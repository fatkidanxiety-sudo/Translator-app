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
  const keptIndex = new Int32Array(found.length).fill(-1);
  const kept = [];
  found.forEach((c, i) => {
    if (c.score >= 0.5 && c.maxX - c.minX >= 2 && c.maxY - c.minY >= 2) {
      keptIndex[i] = kept.length;
      c.colMin = new Int32Array(c.maxX - c.minX + 1).fill(1 << 30);
      c.colMax = new Int32Array(c.maxX - c.minX + 1).fill(-1);
      kept.push(c);
    }
  });
  // Where each line runs, column by column (lines on bottles and tilted photos aren't straight).
  for (let p = 0; p < plane; p++) {
    const id = label[p];
    if (id < 0 || keptIndex[id] < 0) continue;
    const c = found[id];
    const x = p % w;
    const y = (p - x) / w;
    const k = x - c.minX;
    if (y < c.colMin[k]) c.colMin[k] = y;
    if (y > c.colMax[k]) c.colMax[k] = y;
  }

  boxes = kept
    .map((c) => {
      const bw = c.maxX - c.minX + 1;
      const bh = c.maxY - c.minY + 1;
      const d = (c.count * 1.5) / (2 * (bw + bh)); // "unclip": the detector marks a shrunken core of each line
      const box = {
        x0: Math.max(0, (c.minX - d) * sx),
        y0: Math.max(0, (c.minY - d) * sy),
        x1: Math.min(W, (c.maxX + 1 + d) * sx),
        y1: Math.min(H, (c.maxY + 1 + d) * sy),
        score: c.score,
      };
      // Centre line and thickness of the text, for straightening curved or tilted lines.
      const heights = [];
      const centers = new Float32Array(bw);
      for (let k = 0; k < bw; k++) {
        if (c.colMax[k] >= 0) {
          heights.push(c.colMax[k] - c.colMin[k] + 1);
          centers[k] = (c.colMin[k] + c.colMax[k]) / 2;
        } else centers[k] = NaN;
      }
      heights.sort((a, b) => a - b);
      const t = heights[Math.floor(heights.length / 2)] || bh;
      // A line that bends or slopes noticeably (its box is much taller than the text) gets straightened.
      if (bw > t * 2.5 && bh > t * 1.25) {
        fillGaps(centers);
        box.path = { minX: c.minX, centers: smooth(centers, Math.max(3, Math.round(t))), t, sx, sy };
      }
      return box;
    })
    .filter((b) => b.y1 - b.y0 >= 6 && b.x1 - b.x0 >= 6);
  return boxes.length;
}

function fillGaps(values) {
  let last = -1;
  for (let i = 0; i < values.length; i++) {
    if (Number.isNaN(values[i])) continue;
    if (last === -1) for (let j = 0; j < i; j++) values[j] = values[i];
    else for (let j = last + 1; j < i; j++) values[j] = values[last] + ((values[i] - values[last]) * (j - last)) / (i - last);
    last = i;
  }
  for (let j = last + 1; j < values.length; j++) values[j] = values[last];
}

function smooth(values, window) {
  const out = new Float32Array(values.length);
  const half = Math.floor(window / 2);
  for (let i = 0; i < values.length; i++) {
    let sum = 0;
    let n = 0;
    for (let j = Math.max(0, i - half); j <= Math.min(values.length - 1, i + half); j++) {
      sum += values[j];
      n++;
    }
    out[i] = sum / n;
  }
  return out;
}

/** Centre of a straightened line at image column x (extends the ends in a straight line). */
function centerAt(path, x) {
  const k = x / path.sx - path.minX;
  const n = path.centers.length;
  if (k <= 0) {
    const slope = n > 4 ? (path.centers[Math.min(n - 1, 4)] - path.centers[0]) / Math.min(n - 1, 4) : 0;
    return (path.centers[0] + slope * k) * path.sy;
  }
  if (k >= n - 1) {
    const slope = n > 4 ? (path.centers[n - 1] - path.centers[Math.max(0, n - 5)]) / Math.min(n - 1, 4) : 0;
    return (path.centers[n - 1] + slope * (k - (n - 1))) * path.sy;
  }
  const i = Math.floor(k);
  return (path.centers[i] + (path.centers[i + 1] - path.centers[i]) * (k - i)) * path.sy;
}

/** Copies a curved/tilted line into a straight strip, column by column. */
function straighten(box) {
  const { path } = box;
  const extend = path.t * 0.8 * path.sx;
  const x0 = Math.max(0, path.minX * path.sx - extend);
  const x1 = Math.min(image.width, (path.minX + path.centers.length) * path.sx + extend);
  const half = path.t * 1.1 * path.sy;
  const width = Math.max(1, Math.round(x1 - x0));
  const height = Math.max(8, Math.round(half * 2));
  const strip = new OffscreenCanvas(width, height);
  const ctx = strip.getContext('2d');
  const step = width > 1200 ? 3 : 2;
  for (let i = 0; i < width; i += step) {
    const yc = centerAt(path, x0 + i + step / 2);
    ctx.drawImage(image, x0 + i, yc - half, step, height, i, 0, step, height);
  }
  return { strip, x0, x1, half };
}

// ---- Recognition ----------------------------------------------------------------------

/** Reads a line; for lines that look curved, also tries it straightened and keeps the clearer reading. */
async function recognizeBox(box, rec, wordsPerChar) {
  const plain = await recognizeOnce({ ...box, path: undefined }, rec, wordsPerChar);
  if (!box.path) return plain;
  const straight = await recognizeOnce(box, rec, wordsPerChar);
  if (!plain) return straight;
  if (!straight) return plain;
  // Keep whichever reading the model is more confident about.
  return straight.confidence > plain.confidence ? straight : plain;
}

async function recognizeOnce(box, { session, dict }, wordsPerChar) {
  let bw = box.x1 - box.x0;
  let bh = box.y1 - box.y0;
  if (bh > bw * 1.6 && bw < 60) return null; // vertical text isn't supported yet
  let source = image;
  let sx0 = box.x0;
  let sy0 = box.y0;
  let straight = null;
  if (box.path) {
    straight = straighten(box);
    source = straight.strip;
    sx0 = 0;
    sy0 = 0;
    bw = straight.strip.width;
    bh = straight.strip.height;
  }
  const width = Math.min(2400, Math.max(16, Math.ceil((REC_HEIGHT * bw) / bh)));
  const rgba = canvasData(width, REC_HEIGHT, (ctx) => ctx.drawImage(source, sx0, sy0, bw, bh, 0, 0, width, REC_HEIGHT));
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
  const lineX0 = straight ? straight.x0 : box.x0;
  const lineX1 = straight ? straight.x1 : box.x1;
  const xAt = (t) => lineX0 + (t / steps) * (lineX1 - lineX0);
  const wordY = (xa, xb) => {
    if (!straight) return { y0: box.y0, y1: box.y1 };
    const yc = centerAt(box.path, (xa + xb) / 2);
    const h = box.path.t * 0.75 * box.path.sy;
    return { y0: yc - h, y1: yc + h };
  };
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
      const xa = Math.max(lineX0, xAt(word.tStart - 0.8));
      const xb = Math.min(lineX1, xAt(word.tEnd + 1.8));
      word.bbox = { x0: xa, x1: xb, ...wordY(xa, xb) };
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
