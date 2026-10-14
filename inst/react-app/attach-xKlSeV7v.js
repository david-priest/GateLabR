import "./cvwDecode-CKHzN2J_.js";
const W = "BD_IMAGEWALL_SETTINGS", D = {
  2: "#bdbdbd",
  3: "#ffff40",
  4: "#80ffff",
  5: "#00ff00",
  6: "#ffbe32",
  7: "#ff0000"
};
function G(e) {
  const t = Math.max(0, Math.floor(e)) & 16777215, n = t & 255, r = t >> 8 & 255, o = t >> 16 & 255;
  return `#${[n, r, o].map((s) => s.toString(16).padStart(2, "0")).join("")}`;
}
const S = (e, t) => typeof e == "number" && Number.isFinite(e) ? e : t;
function k(e, t = {}) {
  const n = /* @__PURE__ */ new Map(), r = t[W];
  if (r)
    try {
      const s = JSON.parse(r), a = Array.isArray(s == null ? void 0 : s.ChannelSettings) ? s.ChannelSettings : [];
      for (const f of a) {
        if (typeof (f == null ? void 0 : f.ChannelNumber) != "number") continue;
        const u = Math.min(Math.max(S(f.Threshold, 0), 0), 1), h = Math.min(Math.max(S(f.Saturation, 0.8), 0), 1);
        n.set(f.ChannelNumber, {
          enabled: f.Enabled === !0,
          colour: typeof f.Color == "number" ? G(f.Color) : void 0,
          threshold: u,
          saturation: h > u ? h : Math.min(1, u + 0.05),
          gamma: Math.min(Math.max(S(f.Gamma, 1), 0.1), 10),
          smoothing: Math.min(Math.max(Math.round(S(f.Smoothing, 1)), 0), 8)
        });
      }
    } catch {
    }
  return [...e.keys()].sort((s, a) => s - a).map((s) => {
    const a = n.get(s);
    return {
      slot: s,
      name: e.get(s) ?? `Channel ${s}`,
      enabled: a ? a.enabled === !0 : !0,
      colour: (a == null ? void 0 : a.colour) ?? D[s] ?? "#ffffff",
      threshold: (a == null ? void 0 : a.threshold) ?? 0,
      saturation: (a == null ? void 0 : a.saturation) ?? 0.8,
      gamma: (a == null ? void 0 : a.gamma) ?? 1,
      smoothing: (a == null ? void 0 : a.smoothing) ?? 1
    };
  });
}
const j = "BDFIRESETTINGS";
function L(e) {
  var n;
  const t = e[j];
  if (!t) return null;
  try {
    const r = JSON.parse(t), o = Array.isArray((n = r == null ? void 0 : r.ImagingMaskSettings) == null ? void 0 : n.MaskConfiguration) ? r.ImagingMaskSettings.MaskConfiguration[0] : null;
    if (!o || typeof o.InputChannelId != "number" || typeof o.Threshold != "number") return null;
    const s = o.Threshold / 65535;
    return !(s > 0) || s >= 1 ? null : { slot: o.InputChannelId, fraction: s };
  } catch {
    return null;
  }
}
function _(e) {
  return e.kind === "file" ? e.file.size : e.size;
}
async function M(e, t, n) {
  if (!Number.isInteger(t) || t < 0 || !Number.isInteger(n) || n < 0)
    throw new RangeError(`readRange: bad range ${t}+${n}`);
  const r = _(e);
  if (t + n > r)
    throw new RangeError(
      `readRange: ${t}+${n} is beyond the end of the file (${r} bytes); the file is truncated`
    );
  if (n === 0) return new ArrayBuffer(0);
  {
    const o = await e.file.slice(t, t + n).arrayBuffer();
    if (o.byteLength !== n)
      throw new RangeError(`readRange: short read (${o.byteLength} of ${n} bytes)`);
    return o;
  }
}
const V = "CHORWAVE", N = 128, z = 24, O = 2, T = (e, t) => {
  const n = e.getBigUint64(t, !0);
  if (n > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`cvw: offset at 0x${t.toString(16)} is not representable`);
  return Number(n);
};
function Y(e, t) {
  if (e.byteLength < N) throw new Error("cvw: the file is shorter than its header");
  const n = new DataView(e);
  if (String.fromCharCode(...new Uint8Array(e, 0, 8)) !== V) throw new Error("cvw: not a FACSChorus waveform file (no CHORWAVE magic)");
  const o = n.getUint32(8, !0);
  if (o !== O) throw new Error(`cvw: unsupported version ${o}; GateLab reads version ${O}`);
  const s = {
    version: o,
    eventCount: n.getUint32(60, !0),
    indexOffset: T(n, 64),
    dataOffset: T(n, 72),
    metadataOffset: T(n, 80)
  }, a = s.indexOffset + s.eventCount * z;
  if (s.dataOffset < N || s.indexOffset < s.dataOffset || s.metadataOffset < a)
    throw new Error("cvw: the header's offsets are out of order");
  if (t !== void 0 && s.metadataOffset >= t)
    throw new Error(`cvw: the file is truncated (metadata at ${s.metadataOffset}, file is ${t} bytes)`);
  return s;
}
const U = (e, t) => {
  if (!Array.isArray(e) || e.some((n) => typeof n != "number")) throw new Error(`cvw: ${t} is not a list of numbers`);
  return Float64Array.from(e);
};
function H(e) {
  const t = typeof e == "string" ? e : new TextDecoder("utf-8").decode(e), n = t.indexOf("{");
  if (n < 0) throw new Error("cvw: no metadata document at the end of the file");
  let r;
  try {
    r = JSON.parse(t.slice(n));
  } catch (h) {
    throw new Error(`cvw: the metadata is not valid JSON (${h instanceof Error ? h.message : String(h)})`);
  }
  if (typeof r != "object" || r === null) throw new Error("cvw: the metadata is not an object");
  const o = r, s = o.namesForImageChannels, a = /* @__PURE__ */ new Map();
  if (typeof s == "object" && s !== null)
    for (const [h, l] of Object.entries(s))
      typeof l == "string" && /^\d+$/.test(h) && a.set(Number(h), l);
  if (a.size === 0) throw new Error("cvw: the metadata names no image channels");
  const u = (Array.isArray(o.lasers) ? o.lasers : []).map((h, l) => {
    if (typeof h != "object" || h === null) throw new Error(`cvw: laser ${l} is not an object`);
    const i = h, c = Array.isArray(i.frameIndexes) ? i.frameIndexes : [];
    if (c.some((I) => typeof I != "number")) throw new Error(`cvw: laser ${l} frameIndexes are not numbers`);
    const d = /* @__PURE__ */ new Map();
    if (typeof i.intrinsicPhasors == "object" && i.intrinsicPhasors !== null)
      for (const [I, $] of Object.entries(i.intrinsicPhasors))
        /^\d+$/.test(I) && d.set(Number(I), U($, `intrinsicPhasors[${I}]`));
    const b = typeof i.pixelAspectRatio == "number" && i.pixelAspectRatio > 0 ? i.pixelAspectRatio : 1;
    return {
      laserName: typeof i.laserName == "string" ? i.laserName : `laser ${l}`,
      frameIndexes: c,
      lightlossIndex: typeof i.lightlossIndex == "number" ? i.lightlossIndex : -1,
      pixelAspectRatio: b,
      refPhasors: i.refPhasors === void 0 ? new Float64Array(0) : U(i.refPhasors, "refPhasors"),
      intrinsicPhasors: d
    };
  });
  if (u.length === 0) throw new Error("cvw: the metadata describes no imaging laser");
  return {
    version: typeof o.version == "string" ? o.version : "",
    recordingId: typeof o.recordingId == "string" ? o.recordingId : "",
    recordingName: typeof o.recordingName == "string" ? o.recordingName : "",
    channelNames: a,
    lasers: u
  };
}
async function J(e) {
  const t = _(e), n = Y(await M(e, 0, Math.min(N, t)), t), r = H(await M(e, n.metadataOffset, t - n.metadataOffset));
  return { header: n, metadata: r };
}
const y = {
  width: 256,
  height: 257,
  bitsPerSample: 258,
  compression: 259,
  imageDescription: 270,
  stripOffsets: 273,
  samplesPerPixel: 277,
  stripByteCounts: 279,
  xResolution: 282,
  yResolution: 283,
  pageName: 285,
  tileWidth: 322,
  sampleFormat: 339
}, B = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8, 16: 8 };
class p extends Error {
  constructor(t) {
    super(t), this.name = "TiffError";
  }
}
function K(e) {
  const t = new DataView(e);
  if (t.byteLength < 8) throw new p("not a TIFF: the file is too short");
  const n = String.fromCharCode(t.getUint8(0), t.getUint8(1)), r = n === "II";
  if (!r && n !== "MM") throw new p("not a TIFF: no byte-order mark");
  if (t.getUint16(2, r) !== 42) throw new p(t.getUint16(2, r) === 43 ? "a BigTIFF, which is not read" : "not a TIFF: the magic number is wrong");
  const o = [];
  let s = t.getUint32(4, r);
  const a = /* @__PURE__ */ new Set();
  for (; s > 0 && !a.has(s) && o.length < 64; ) {
    if (a.add(s), s + 2 > t.byteLength) throw new p("the TIFF's directory lies past the end of the file");
    const f = t.getUint16(s, r), u = /* @__PURE__ */ new Map();
    for (let h = 0; h < f; h++) {
      const l = s + 2 + h * 12;
      if (l + 12 > t.byteLength) throw new p("the TIFF's directory is cut short");
      const i = t.getUint16(l, r), c = t.getUint16(l + 2, r), d = t.getUint32(l + 4, r), b = (B[c] ?? 1) * d;
      u.set(i, { type: c, count: d, at: b <= 4 ? l + 8 : t.getUint32(l + 8, r) });
    }
    o.push(X(t, r, u)), s = t.getUint32(s + 2 + f * 12, r);
  }
  if (o.length === 0) throw new p("the TIFF holds no image");
  return o;
}
function X(e, t, n) {
  const r = (x) => {
    const m = n.get(x);
    if (!m) return [];
    const w = [];
    for (let E = 0; E < m.count; E++) {
      const g = m.at + E * (B[m.type] ?? 1);
      if (m.type === 3) w.push(e.getUint16(g, t));
      else if (m.type === 4) w.push(e.getUint32(g, t));
      else if (m.type === 1) w.push(e.getUint8(g));
      else if (m.type === 5) {
        const F = e.getUint32(g, t), R = e.getUint32(g + 4, t);
        w.push(R ? F / R : 0);
      } else m.type === 11 ? w.push(e.getFloat32(g, t)) : m.type === 12 ? w.push(e.getFloat64(g, t)) : m.type === 16 ? w.push(Number(e.getBigUint64(g, t))) : w.push(0);
    }
    return w;
  }, o = (x) => {
    const m = n.get(x);
    if (!m || m.type !== 2) return "";
    let w = "";
    for (let E = 0; E < m.count; E++) {
      const g = e.getUint8(m.at + E);
      if (g === 0) break;
      w += String.fromCharCode(g);
    }
    return w.trim();
  }, s = r(y.width)[0] ?? 0, a = r(y.height)[0] ?? 0;
  if (!(s > 0) || !(a > 0)) throw new p("the TIFF page has no size");
  if (n.has(y.tileWidth)) throw new p("a tiled TIFF, which is not read");
  const f = r(y.compression)[0] ?? 1;
  if (f !== 1) throw new p(`a compressed TIFF (compression ${f}), which is not read`);
  const u = r(y.samplesPerPixel)[0] ?? 1;
  if (u !== 1) throw new p(`a TIFF with ${u} samples per pixel, which is not read; one channel per page is`);
  const h = r(y.bitsPerSample)[0] ?? 8, l = r(y.sampleFormat)[0] ?? 1, i = r(y.stripOffsets), c = r(y.stripByteCounts);
  if (i.length === 0) throw new p("the TIFF page has no strips");
  const d = h / 8;
  if (![1, 2, 4].includes(d)) throw new p(`a TIFF with ${h}-bit samples, which is not read`);
  if (l === 3 && h !== 32) throw new p(`a TIFF with ${h}-bit floats, which is not read`);
  const b = new Float32Array(s * a);
  let I = 0;
  for (let x = 0; x < i.length && I < b.length; x++) {
    const m = c[x] ?? (b.length - I) * d, w = Math.min(Math.floor(m / d), b.length - I), E = i[x];
    if (E + w * d > e.byteLength) throw new p("the TIFF's strip lies past the end of the file");
    for (let g = 0; g < w; g++, I++) {
      const F = E + g * d;
      b[I] = l === 3 ? e.getFloat32(F, t) : d === 1 ? l === 2 ? e.getInt8(F) : e.getUint8(F) : d === 2 ? l === 2 ? e.getInt16(F, t) : e.getUint16(F, t) : l === 2 ? e.getInt32(F, t) : e.getUint32(F, t);
    }
  }
  if (I < b.length) throw new p("the TIFF's strips hold fewer samples than the page's size");
  const $ = r(y.xResolution)[0], A = r(y.yResolution)[0];
  return {
    width: s,
    height: a,
    data: b,
    name: o(y.pageName) || o(y.imageDescription),
    ...$ ? { xResolution: $ } : {},
    ...A ? { yResolution: A } : {}
  };
}
const v = 2, Z = /^(.*?)(\d{6,})(\.tiff?)$/i;
function q(e, t = "subfolders") {
  const n = Z.exec(e);
  return n ? { prefix: n[1], digits: n[2].length, suffix: n[3], layout: t } : null;
}
function P(e, t) {
  if (!e.startsWith(t.prefix) || !e.toLowerCase().endsWith(t.suffix.toLowerCase())) return null;
  const n = e.slice(t.prefix.length, e.length - t.suffix.length);
  return /^\d+$/.test(n) ? Number(n) : null;
}
function Q(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n, r) => t.set(v + r, n.name || `Channel ${v + r}`)), t;
}
async function te(e, t) {
  const n = [];
  let r = "flat", o = null;
  const s = {};
  if (e.files)
    for (const i of e.files) {
      if (!/\.tiff?$/i.test(i.name)) continue;
      n.push(i.name);
      const c = (i.webkitRelativePath ?? "").split("/");
      c.length >= 2 && /^\d{8}$/.test(c[c.length - 2]) && (r = "subfolders");
    }
  else if (e.handle) {
    const i = [];
    for await (const c of e.handle.values())
      c.kind === "directory" && /^\d{8}$/.test(c.name) && i.push(c);
    i.length > 0 ? r = "subfolders" : i.push(e.handle);
    for (const c of i)
      for await (const d of c.values())
        if (d.kind === "file" && /\.tiff?$/i.test(d.name) && (n.push(d.name), !o)) {
          const b = d;
          o = () => b.getFile();
        }
  }
  if (n.length === 0) throw new C(`${e.folderName} holds no .tiff files`);
  n.sort((i, c) => i.localeCompare(c, void 0, { numeric: !0 }));
  const a = q(n[0], r);
  if (!a) throw new C(`${e.folderName}: ${n[0]} is not named <tube>_<event number>.tiff, as the extractor names its files`);
  let f = 0, u = -1;
  for (const i of n) {
    const c = P(i, a);
    c !== null && (f++, c > u && (u = c));
  }
  if (f === 0) throw new C(`${e.folderName}: no file is named like ${n[0]}`);
  if (u >= t.nEvents)
    throw new C(
      `${e.folderName} names event ${u.toLocaleString()} but the FCS has ${t.nEvents.toLocaleString()} events; it is not this file's`
    );
  if (e.files)
    for (const i of e.files) {
      const c = P(i.name, a);
      if (c !== null && (s[c] = i, !o)) {
        const d = i;
        o = async () => d;
      }
    }
  if (!o) throw new C(`${e.folderName}: no file could be read`);
  const h = K(await (await o()).arrayBuffer()), l = Q(h);
  return {
    kind: "tiff-folder",
    fileName: e.folderName,
    handle: e.handle,
    files: e.files ? s : null,
    ...e.sourcePath ? { sourcePath: e.sourcePath } : {},
    eventCount: t.nEvents,
    imageCount: f,
    naming: a,
    channelNames: l,
    pixelAspectRatio: 0.3,
    display: k(l, t.keywords),
    mask: L(t.keywords)
  };
}
class C extends Error {
  constructor(t) {
    super(t), this.name = "ImageAttachError";
  }
}
async function ne(e, t, n, r) {
  let o;
  try {
    o = await J({ kind: "file", file: e });
  } catch (f) {
    throw new C(`${e.name}: ${f instanceof Error ? f.message : String(f)}`);
  }
  const { header: s, metadata: a } = o;
  if (s.eventCount !== n.nEvents)
    throw new C(
      `${e.name} holds ${s.eventCount.toLocaleString()} events but the FCS has ${n.nEvents.toLocaleString()}; it is not this file's recording`
    );
  return {
    kind: "cvw",
    fileName: e.name,
    file: e,
    handle: t,
    ...r ? { sourcePath: r } : {},
    eventCount: s.eventCount,
    recordingId: a.recordingId,
    channelNames: a.channelNames,
    pixelAspectRatio: a.lasers[0].pixelAspectRatio,
    display: k(a.channelNames, n.keywords),
    mask: L(n.keywords)
  };
}
export {
  C as ImageAttachError,
  ne as attachCellImages,
  te as attachTiffFolder
};
