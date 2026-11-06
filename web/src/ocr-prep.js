// Finds where the text is in a photo before reading it: shapes that line up like letters in a row
// (dark on light or light on dark). Everything outside those text areas — wall texture, wood grain,
// reflections, specks — is blanked out, while the photo inside them is kept as-is. Tesseract then
// reads faster and invents far fewer "words".

/**
 * @param {HTMLCanvasElement} source
 * @returns {{ canvas: HTMLCanvasElement, zones: number } | null} null if no clear text areas were found
 */
export function cleanForOcr(source) {
  const W = source.width;
  const H = source.height;
  const N = W * H;
  const rgba = source.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, W, H).data;

  // Grayscale and an integral image for fast local averages.
  const gray = new Uint8Array(N);
  for (let i = 0, j = 0; i < N; i++, j += 4) gray[i] = (rgba[j] * 77 + rgba[j + 1] * 150 + rgba[j + 2] * 29) >> 8;
  const integral = new Uint32Array((W + 1) * (H + 1));
  for (let y = 0; y < H; y++) {
    let row = 0;
    for (let x = 0; x < W; x++) {
      row += gray[y * W + x];
      integral[(y + 1) * (W + 1) + x + 1] = integral[y * (W + 1) + x + 1] + row;
    }
  }

  // Adaptive threshold: 1 = darker than surroundings, 2 = lighter than surroundings.
  const r = Math.max(8, Math.round(Math.max(W, H) / 55));
  const mask = new Uint8Array(N);
  for (let y = 0; y < H; y++) {
    const y0 = Math.max(0, y - r);
    const y1 = Math.min(H, y + r + 1);
    for (let x = 0; x < W; x++) {
      const x0 = Math.max(0, x - r);
      const x1 = Math.min(W, x + r + 1);
      const sum = integral[y1 * (W + 1) + x1] - integral[y0 * (W + 1) + x1] - integral[y1 * (W + 1) + x0] + integral[y0 * (W + 1) + x0];
      const mean = sum / ((x1 - x0) * (y1 - y0));
      const g = gray[y * W + x];
      if (g < mean - 16 && g < mean * 0.86) mask[y * W + x] = 1;
      else if (g > mean + 16 && g > mean * 1.14) mask[y * W + x] = 2;
    }
  }

  // Connected shapes (4-neighbour flood fill), per polarity.
  const label = new Int32Array(N).fill(-1);
  const comps = [];
  const stack = new Int32Array(N);
  for (let start = 0; start < N; start++) {
    const kind = mask[start];
    if (!kind || label[start] !== -1) continue;
    const id = comps.length;
    let top = 0;
    stack[top++] = start;
    label[start] = id;
    let minX = W, minY = H, maxX = 0, maxY = 0, count = 0;
    while (top) {
      const p = stack[--top];
      const px = p % W;
      const py = (p - px) / W;
      count++;
      if (px < minX) minX = px;
      if (px > maxX) maxX = px;
      if (py < minY) minY = py;
      if (py > maxY) maxY = py;
      if (px > 0 && mask[p - 1] === kind && label[p - 1] === -1) { label[p - 1] = id; stack[top++] = p - 1; }
      if (px < W - 1 && mask[p + 1] === kind && label[p + 1] === -1) { label[p + 1] = id; stack[top++] = p + 1; }
      if (py > 0 && mask[p - W] === kind && label[p - W] === -1) { label[p - W] = id; stack[top++] = p - W; }
      if (py < H - 1 && mask[p + W] === kind && label[p + W] === -1) { label[p + W] = id; stack[top++] = p + W; }
    }
    const w = maxX - minX + 1;
    const h = maxY - minY + 1;
    comps.push({ kind, minX, minY, maxX, maxY, w, h, cx: (minX + maxX) / 2, cy: (minY + maxY) / 2, count, keep: false });
  }

  // Letter-sized shapes with a reasonable ink density.
  const minH = Math.max(7, H * 0.012);
  const maxH = H * 0.25;
  const glyphs = comps.filter((c) => {
    if (c.h < minH || c.h > maxH || c.w > W * 0.5) return false;
    const fill = c.count / (c.w * c.h);
    const thin = c.w / c.h < 0.4; // "l", "I", "1" fill their box almost completely
    return fill > 0.1 && (fill < 0.95 || thin) && c.w / c.h < 6;
  });

  // A letter has neighbours of similar height on the same line; isolated specks don't.
  glyphs.sort((a, b) => a.cx - b.cx);
  for (let i = 0; i < glyphs.length; i++) {
    const a = glyphs[i];
    let neighbours = 0;
    for (let j = i + 1; j < glyphs.length; j++) {
      const b = glyphs[j];
      const size = Math.max(a.h, b.h);
      if (b.minX - a.maxX > size * 1.6) break;
      if (b.kind !== a.kind || Math.abs(a.cy - b.cy) > size * 0.45) continue;
      const ratio = a.h / b.h;
      if (ratio < 0.55 || ratio > 1.8) continue;
      neighbours++;
      b.neighbours = (b.neighbours ?? 0) + 1;
    }
    a.neighbours = (a.neighbours ?? 0) + neighbours;
  }
  const letters = glyphs.filter((g) => g.neighbours >= 1);
  if (letters.length < 2) return null;

  // Grow each letter into a generous box and merge overlapping boxes into text areas.
  let zones = letters.map((g) => ({ x0: g.minX - g.h * 1.3, y0: g.minY - g.h * 0.9, x1: g.maxX + g.h * 1.3, y1: g.maxY + g.h * 0.9 }));
  for (let changed = true; changed; ) {
    changed = false;
    const merged = [];
    for (const z of zones) {
      const hit = merged.find((m) => z.x0 < m.x1 && z.x1 > m.x0 && z.y0 < m.y1 && z.y1 > m.y0);
      if (hit) {
        hit.x0 = Math.min(hit.x0, z.x0);
        hit.y0 = Math.min(hit.y0, z.y0);
        hit.x1 = Math.max(hit.x1, z.x1);
        hit.y1 = Math.max(hit.y1, z.y1);
        changed = true;
      } else merged.push({ ...z });
    }
    zones = merged;
  }
  // Areas with a single letter-pair are usually texture; text areas are wider than tall.
  zones = zones
    .map((z) => ({ x0: Math.max(0, Math.floor(z.x0)), y0: Math.max(0, Math.floor(z.y0)), x1: Math.min(W, Math.ceil(z.x1)), y1: Math.min(H, Math.ceil(z.y1)) }))
    .filter((z) => z.x1 - z.x0 > (z.y1 - z.y0) * 0.9);
  if (!zones.length) return null;
  const covered = zones.reduce((sum, z) => sum + (z.x1 - z.x0) * (z.y1 - z.y0), 0) / N;
  if (covered > 0.7) return null; // text everywhere (e.g. a document): nothing to gain

  const out = document.createElement('canvas');
  out.width = W;
  out.height = H;
  const ctx = out.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);
  for (const z of zones) ctx.drawImage(source, z.x0, z.y0, z.x1 - z.x0, z.y1 - z.y0, z.x0, z.y0, z.x1 - z.x0, z.y1 - z.y0);
  return { canvas: out, zones: zones.length };
}
