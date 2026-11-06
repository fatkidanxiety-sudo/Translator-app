// Builds the web app into ../docs (served by GitHub Pages).
import { createHash } from 'node:crypto';
import { cp, mkdir, readdir, readFile, rm, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import * as esbuild from 'esbuild';

const OUT = path.resolve('../docs');
const version = new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '');

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp('public', OUT, { recursive: true });
await writeFile(path.join(OUT, '.nojekyll'), '');

// WebAssembly runtimes, served from our own site so nothing comes from a CDN at run time.
await mkdir(path.join(OUT, 'vendor/ort'), { recursive: true });
for (const f of ['ort-wasm-simd-threaded.jsep.mjs', 'ort-wasm-simd-threaded.jsep.wasm']) {
  await cp(`node_modules/onnxruntime-web/dist/${f}`, path.join(OUT, 'vendor/ort', f));
}
await mkdir(path.join(OUT, 'vendor/bergamot'), { recursive: true });
for (const f of ['translator-worker.js', 'bergamot-translator-worker.js', 'bergamot-translator-worker.wasm']) {
  await cp(`node_modules/@mkljczk/bergamot-translator/worker/${f}`, path.join(OUT, 'vendor/bergamot', f));
}
await mkdir(path.join(OUT, 'vendor/tesseract'), { recursive: true });
await cp('node_modules/tesseract.js/dist/worker.min.js', path.join(OUT, 'vendor/tesseract/worker.min.js'));
// LSTM cores read text; the plain cores include the legacy engine used for script detection.
for (const f of ['tesseract-core-simd-lstm.wasm.js', 'tesseract-core-lstm.wasm.js', 'tesseract-core-simd.wasm.js', 'tesseract-core.wasm.js']) {
  await cp(`node_modules/tesseract.js-core/${f}`, path.join(OUT, 'vendor/tesseract', f));
}

await esbuild.build({
  entryPoints: { app: 'src/main.js', worker: 'src/engine.worker.js', 'ocr-worker': 'src/ocr.worker.js' },
  outdir: OUT,
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: ['safari16.4', 'chrome110'],
  minify: true,
  legalComments: 'none',
  define: { __APP_VERSION__: JSON.stringify(`1.0 (${version})`) },
  external: ['node:worker_threads'],
  logLevel: 'warning',
});

// Precache list for the service worker: every file in the build except the worker script itself.
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)])));
  return files.flat();
}
const files = (await walk(OUT))
  .map((f) => path.relative(OUT, f).split(path.sep).join('/'))
  .filter((f) => f !== 'sw.js' && !f.startsWith('.'));
// Voice (ONNX runtime) and camera (Tesseract) engines are large; the service worker caches them
// the first time they're used instead of on install, so the first visit stays quick.
const precache = files.filter((f) => !f.startsWith('vendor/ort/') && !f.startsWith('vendor/tesseract/'));
const hash = createHash('sha256');
for (const f of files.sort()) hash.update(f).update(await readFile(path.join(OUT, f)));
const vendorHash = createHash('sha256');
for (const f of files.filter((f) => f.startsWith('vendor/')).sort()) vendorHash.update(f).update(await readFile(path.join(OUT, f)));
const swPath = path.join(OUT, 'sw.js');
const sw = (await readFile(swPath, 'utf8'))
  .replace('__VERSION__', hash.digest('hex').slice(0, 12))
  .replace('__VENDOR__', vendorHash.digest('hex').slice(0, 12))
  .replace('__PRECACHE__', JSON.stringify(['./', ...precache.map((f) => `./${f}`)], null, 2));
await writeFile(swPath, sw);

let total = 0;
for (const f of files) total += (await stat(path.join(OUT, f))).size;
console.log(`Built ${files.length} files (${(total / 1e6).toFixed(1)} MB) into ${OUT}`);
