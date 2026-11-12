import { inflateSync } from "node:zlib";

// Only complete, quoted, canonical PNG data URLs are eligible.
const DATA_URL = /(["'])(data:image\/png;base64,([A-Za-z0-9+/]+={0,2}))\1/g;
const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const MAX_PIXELS_BYTES = 64 * 1024 * 1024;

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function validPng(base64) {
  const png = Buffer.from(base64, "base64");
  if (png.toString("base64") !== base64 || !png.subarray(0, 8).equals(SIGNATURE)) return false;
  let offset = 8;
  let header;
  let palette = false;
  let idatEnded = false;
  const idat = [];
  while (offset + 12 <= png.length) {
    const size = png.readUInt32BE(offset);
    const end = offset + 12 + size;
    if (end > png.length) return false;
    const name = png.subarray(offset + 4, offset + 8);
    if (!name.every((byte) => (byte >= 65 && byte <= 90) || (byte >= 97 && byte <= 122)) || name[2] < 65 || name[2] > 90) return false;
    const type = name.toString("ascii");
    if (crc32(png.subarray(offset + 4, end - 4)) !== png.readUInt32BE(end - 4)) return false;
    const data = png.subarray(offset + 8, end - 4);
    if (!header && type !== "IHDR") return false;
    if (type === "IHDR") {
      if (header || size !== 13) return false;
      header = data;
    } else if (type === "PLTE") {
      if (palette || idat.length || !size || size % 3 || size > 768) return false;
      palette = true;
    } else if (type === "IDAT") {
      if (idatEnded) return false;
      idat.push(data);
    } else if (type === "IEND") {
      if (size || end !== png.length || !idat.length) return false;
      return validPixels(header, palette, Buffer.concat(idat));
    } else if (type[0] === type[0].toUpperCase()) return false;
    if (idat.length && type !== "IDAT") idatEnded = true;
    offset = end;
  }
  return false;
}

function validPixels(header, palette, compressed) {
  const width = header.readUInt32BE(0);
  const height = header.readUInt32BE(4);
  const depth = header[8];
  const color = header[9];
  const depths = { 0: [1, 2, 4, 8, 16], 2: [8, 16], 3: [1, 2, 4, 8], 4: [8, 16], 6: [8, 16] };
  if (!width || !height || width > 0x7fffffff || height > 0x7fffffff || !depths[color]?.includes(depth)) return false;
  if (header[10] || header[11] || header[12] > 1 || (color === 3 && !palette) || ([0, 4].includes(color) && palette)) return false;
  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[color];
  const passes = header[12] ? [[0, 0, 8, 8], [4, 0, 8, 8], [0, 4, 4, 8], [2, 0, 4, 4], [0, 2, 2, 4], [1, 0, 2, 2], [0, 1, 1, 2]] : [[0, 0, 1, 1]];
  const rows = [];
  let expected = 0;
  for (const [x, y, dx, dy] of passes) {
    const columns = Math.max(0, Math.ceil((width - x) / dx));
    const count = Math.max(0, Math.ceil((height - y) / dy));
    if (!columns || !count) continue;
    const bytes = 1 + Math.ceil(columns * channels * depth / 8);
    expected += count * bytes;
    if (expected > MAX_PIXELS_BYTES) return false;
    rows.push([count, bytes]);
  }
  try {
    const result = inflateSync(compressed, { maxOutputLength: expected, info: true });
    if (result.buffer.length !== expected || result.engine.bytesWritten !== compressed.length) return false;
    let offset = 0;
    for (const [count, bytes] of rows) {
      for (let row = 0; row < count; row += 1, offset += bytes) if (result.buffer[offset] > 4) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function dataUrlCounts(text) {
  const counts = new Map();
  for (const match of text.matchAll(DATA_URL)) counts.set(match[2], (counts.get(match[2]) ?? 0) + 1);
  return counts;
}

export function retainedPngDataUrls(previous, staged) {
  const before = dataUrlCounts(previous);
  const retained = new Set();
  for (const [url, count] of dataUrlCounts(staged)) {
    if (count === before.get(url) && validPng(url.slice("data:image/png;base64,".length))) retained.add(url);
  }
  return retained;
}

export function maskRetainedPngPayloads(text, retained) {
  return text.replace(DATA_URL, (quoted, quote, url, payload) => retained.has(url)
    ? `${quote}data:image/png;base64,${" ".repeat(payload.length)}${quote}`
    : quoted);
}
