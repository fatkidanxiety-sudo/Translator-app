// Camera text reading with PaddleOCR (PP-OCRv5 mobile), running on the phone in a background thread.
//
// 1. A text detector (DBNet) marks where text is in the photo, line by line.
// 2. A recognizer reads each line (CTC). There is one recognizer per writing system.
// Both are small ONNX models run with onnxruntime-web (WebAssembly).

import * as ort from 'onnxruntime-web';

ort.env.wasm.wasmPaths = new URL('./vendor/ort/', self.location.href).href;
// Several cores when the page is cross-origin isolated (the service worker adds the headers), else one.
ort.env.wasm.numThreads = self.crossOriginIsolated ? Math.min(4, navigator.hardwareConcurrency || 2) : 1;
ort.env.wasm.proxy = false;

const DET_MAX_SIDE = 1024;
const DET_MEAN = [0.485, 0.456, 0.406]; // applied to B, G, R (the models were trained on BGR images)
const DET_STD = [0.229, 0.224, 0.225];
const REC_HEIGHT = 48;

let det = null;
const recs = new Map(); // script → { session, dict }
let image = null; // ImageBitmap of the current photo
let boxes = []; // detected text boxes in image pixels

const post = (message) => self.postMessage(message);
const sessionOptions = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };

// ---- Detection ------------------------------------------------------------------------

function canvasData(width, height, draw) {
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  draw(ctx);
  return ctx.getImageData(0, 0, width, height).data;
}

async function detect() {
  const W = image.width;
  const H = image.height;
  const scale = Math.min(1.6, DET_MAX_SIDE / Math.max(W, H));
  const w = Math.max(32, Math.round((W * scale) / 32) * 32);
  const h = Math.max(32, Math.round((H * scale) / 32) * 32);
  const rgba = canvasData(w, h, (ctx) => ctx.drawImage(image, 0, 0, w, h));
  const plane = w * h;
  const input = new Float32Array(3 * plane);
  for (let i = 0; i < plane; i++) {
    const r = rgba[i * 4] / 255;
    const g = rgba[i * 4 + 1] / 255;
    const b = rgba[i * 4 + 2] / 255;
    input[i] = (b - DET_MEAN[0]) / DET_STD[0];
    input[plane + i] = (g - DET_MEAN[1]) / DET_STD[1];
    input[2 * plane + i] = (r - DET_MEAN[2]) / DET_STD[2];
  }
  const output = await det.run({ [det.inputNames[0]]: new ort.Tensor('float32', input, [1, 3, h, w]) });
  const prob = output[det.outputNames[0]].data;

  // Connected regions of "text" pixels → line boxes.
  const label = new Int32Array(plane).fill(-1);
  const stack = new Int32Array(plane);
  const found = [];
  for (let start = 0; start < plane; start++) {
    if (prob[start] <= 0.3 || label[start] !== -1) continue;
    const id = found.length;
    let top = 0;
    stack[top++] = start;
    label[start] = id;
    let minX = w, minY = h, maxX = 0, maxY = 0, count = 0, sum = 0;
    while (top) {
      const p = stack[--top];
      const x = p % w;
      const y = (p - x) / w;
      count++;
      sum += prob[p];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (x > 0 && prob[p - 1] > 0.3 && label[p - 1] === -1) { label[p - 1] = id; stack[top++] = p - 1; }
      if (x < w - 1 && prob[p + 1] > 0.3 && label[p + 1] === -1) { label[p + 1] = id; stack[top++] = p + 1; }
      if (y > 0 && prob[p - w] > 0.3 && label[p - w] === -1) { label[p - w] = id; stack[top++] = p - w; }
      if (y < h - 1 && prob[p + w] > 0.3 && label[p + w] === -1) { label[p + w] = id; stack[top++] = p + w; }
    }
    found.push({ minX, minY, maxX, maxY, count, score: sum / count });
  }

  const sx = W / w;
  const sy = H / h;
  boxes = found
    .filter((c) => c.score >= 0.5 && c.maxX - c.minX >= 2 && c.maxY - c.minY >= 2)
    .map((c) => {
      const bw = c.maxX - c.minX + 1;
      const bh = c.maxY - c.minY + 1;
      const d = (c.count * 1.5) / (2 * (bw + bh)); // "unclip": the detector marks a shrunken core of each line
      return {
        x0: Math.max(0, (c.minX - d) * sx),
        y0: Math.max(0, (c.minY - d) * sy),
        x1: Math.min(W, (c.maxX + 1 + d) * sx),
        y1: Math.min(H, (c.maxY + 1 + d) * sy),
        score: c.score,
      };
    })
    .filter((b) => b.y1 - b.y0 >= 6 && b.x1 - b.x0 >= 6);
  return boxes.length;
}

// ---- Recognition ----------------------------------------------------------------------

async function recognizeBox(box, { session, dict }, wordsPerChar) {
  const bw = box.x1 - box.x0;
  const bh = box.y1 - box.y0;
  if (bh > bw * 1.6 && bw < 60) return null; // vertical text isn't supported yet
  const width = Math.min(2400, Math.max(16, Math.ceil((REC_HEIGHT * bw) / bh)));
  const rgba = canvasData(width, REC_HEIGHT, (ctx) => ctx.drawImage(image, box.x0, box.y0, bw, bh, 0, 0, width, REC_HEIGHT));
  const plane = width * REC_HEIGHT;
  const input = new Float32Array(3 * plane);
  for (let i = 0; i < plane; i++) {
    input[i] = rgba[i * 4 + 2] / 127.5 - 1; // B
    input[plane + i] = rgba[i * 4 + 1] / 127.5 - 1; // G
    input[2 * plane + i] = rgba[i * 4] / 127.5 - 1; // R
  }
  const output = await session.run({ [session.inputNames[0]]: new ort.Tensor('float32', input, [1, 3, REC_HEIGHT, width]) });
  const out = output[session.outputNames[0]];
  const [, steps, classes] = out.dims;
  const data = out.data;

  // Greedy CTC decoding, remembering where each character sits along the line.
  const chars = [];
  let previous = -1;
  for (let t = 0; t < steps; t++) {
    let best = 0;
    let bestP = -Infinity;
    for (let c = 0; c < classes; c++) {
      const v = data[t * classes + c];
      if (v > bestP) {
        bestP = v;
        best = c;
      }
    }
    if (best !== 0 && best !== previous) chars.push({ ch: dict[best - 1] ?? ' ', p: bestP, t });
    previous = best;
  }
  const text = chars.map((c) => c.ch).join('').replace(/\s+/g, ' ').trim();
  if (!text) return null;
  const confidence = chars.reduce((s, c) => s + c.p, 0) / chars.length;

  // Word boxes from character positions (for "Tap words").
  const xAt = (t) => box.x0 + (t / steps) * bw;
  const words = [];
  if (wordsPerChar) {
    words.push({ text, bbox: { x0: box.x0, y0: box.y0, x1: box.x1, y1: box.y1 }, confidence });
  } else {
    let current = null;
    for (const c of chars) {
      if (/\s/.test(c.ch)) {
        if (current) words.push(current);
        current = null;
        continue;
      }
      if (!current) current = { text: '', ps: [], tStart: c.t, tEnd: c.t };
      current.text += c.ch;
      current.ps.push(c.p);
      current.tEnd = c.t;
    }
    if (current) words.push(current);
    for (const word of words) {
      word.bbox = { x0: Math.max(box.x0, xAt(word.tStart - 0.8)), y0: box.y0, x1: Math.min(box.x1, xAt(word.tEnd + 1.8)), y1: box.y1 };
      word.confidence = word.ps.reduce((s, p) => s + p, 0) / word.ps.length;
      delete word.ps;
      delete word.tStart;
      delete word.tEnd;
    }
  }
  return { text, confidence, bbox: { x0: box.x0, y0: box.y0, x1: box.x1, y1: box.y1 }, words };
}

/** Real text, or a mark/texture the detector picked up? */
function looksReal(line) {
  const letters = (line.text.match(/[\p{L}\p{N}]/gu) ?? []).length;
  if (!letters) return false;
  if (letters === 1 && !/[぀-ヿ一-鿿가-힯]/u.test(line.text)) return line.confidence > 0.9;
  return line.confidence >= 0.6;
}

async function recognizeAll(script, indices, id) {
  const rec = recs.get(script);
  const cjk = script === 'cjk';
  const list = indices ? indices.map((i) => boxes[i]) : boxes;
  const lines = [];
  for (let k = 0; k < list.length; k++) {
    const line = await recognizeBox(list[k], rec, cjk);
    if (line && looksReal(line)) lines.push(line);
    if (id && k % 4 === 3) post({ id, type: 'progress', done: k + 1, total: list.length });
  }
  return lines;
}

// ---- Messages -------------------------------------------------------------------------

self.onmessage = async ({ data }) => {
  const { id, type } = data;
  try {
    let result;
    if (type === 'loadDet') {
      if (!det) det = await ort.InferenceSession.create(new Uint8Array(data.model), sessionOptions);
      result = true;
    } else if (type === 'loadRec') {
      if (!recs.has(data.script)) {
        // Keep at most three readers in memory.
        while (recs.size >= 3) {
          const [oldest, old] = recs.entries().next().value;
          recs.delete(oldest);
          await old.session.release?.();
        }
        recs.set(data.script, { session: await ort.InferenceSession.create(new Uint8Array(data.model), sessionOptions), dict: data.dict });
      }
      result = true;
    } else if (type === 'hasRec') {
      result = recs.has(data.script);
    } else if (type === 'detect') {
      image?.close?.();
      image = data.bitmap;
      result = await detect();
    } else if ((type === 'sample' || type === 'read') && !recs.has(data.script)) {
      throw new Error('reader-not-loaded');
    } else if (type === 'sample') {
      // Read the biggest few boxes to see how well a reader fits this photo.
      const order = boxes.map((b, i) => [i, (b.x1 - b.x0) * (b.y1 - b.y0)]).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([i]) => i);
      // Score = average confidence over those boxes (a box the reader can't read counts as 0),
      // plus the text, so the caller can check which alphabet came out.
      const rec = recs.get(data.script);
      let total = 0;
      const texts = [];
      for (const i of order) {
        const line = await recognizeBox(boxes[i], rec, data.script === 'cjk');
        total += line?.confidence ?? 0;
        if (line) texts.push(line.text);
      }
      result = { score: order.length ? total / order.length : 0, text: texts.join(' ') };
    } else if (type === 'read') {
      result = await recognizeAll(data.script, null, id);
    } else throw new Error(`Unknown request: ${type}`);
    post({ id, type: 'result', result });
  } catch (error) {
    post({ id, type: 'error', message: error?.message ?? String(error) });
  }
};
