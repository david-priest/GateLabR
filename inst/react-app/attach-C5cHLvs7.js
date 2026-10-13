const N = "BD_IMAGEWALL_SETTINGS", x = {
  2: "#bdbdbd",
  3: "#ffff40",
  4: "#80ffff",
  5: "#00ff00",
  6: "#ffbe32",
  7: "#ff0000"
};
function v(e) {
  const r = Math.max(0, Math.floor(e)) & 16777215, t = r & 255, s = r >> 8 & 255, o = r >> 16 & 255;
  return `#${[t, s, o].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}
const u = (e, r) => typeof e == "number" && Number.isFinite(e) ? e : r;
function R(e, r = {}) {
  const t = /* @__PURE__ */ new Map(), s = r[N];
  if (s)
    try {
      const n = JSON.parse(s), a = Array.isArray(n == null ? void 0 : n.ChannelSettings) ? n.ChannelSettings : [];
      for (const i of a) {
        if (typeof (i == null ? void 0 : i.ChannelNumber) != "number") continue;
        const m = Math.min(Math.max(u(i.Threshold, 0), 0), 1), f = Math.min(Math.max(u(i.Saturation, 0.8), 0), 1);
        t.set(i.ChannelNumber, {
          enabled: i.Enabled === !0,
          colour: typeof i.Color == "number" ? v(i.Color) : void 0,
          threshold: m,
          saturation: f > m ? f : Math.min(1, m + 0.05),
          gamma: Math.min(Math.max(u(i.Gamma, 1), 0.1), 10),
          smoothing: Math.min(Math.max(Math.round(u(i.Smoothing, 1)), 0), 8)
        });
      }
    } catch {
    }
  return [...e.keys()].sort((n, a) => n - a).map((n) => {
    const a = t.get(n);
    return {
      slot: n,
      name: e.get(n) ?? `Channel ${n}`,
      enabled: a ? a.enabled === !0 : !0,
      colour: (a == null ? void 0 : a.colour) ?? x[n] ?? "#ffffff",
      threshold: (a == null ? void 0 : a.threshold) ?? 0,
      saturation: (a == null ? void 0 : a.saturation) ?? 0.8,
      gamma: (a == null ? void 0 : a.gamma) ?? 1,
      smoothing: (a == null ? void 0 : a.smoothing) ?? 1
    };
  });
}
const $ = "BDFIRESETTINGS";
function M(e) {
  var t;
  const r = e[$];
  if (!r) return null;
  try {
    const s = JSON.parse(r), o = Array.isArray((t = s == null ? void 0 : s.ImagingMaskSettings) == null ? void 0 : t.MaskConfiguration) ? s.ImagingMaskSettings.MaskConfiguration[0] : null;
    if (!o || typeof o.InputChannelId != "number" || typeof o.Threshold != "number") return null;
    const n = o.Threshold / 65535;
    return !(n > 0) || n >= 1 ? null : { slot: o.InputChannelId, fraction: n };
  } catch {
    return null;
  }
}
function C(e) {
  return e.kind === "file" ? e.file.size : e.size;
}
async function y(e, r, t) {
  if (!Number.isInteger(r) || r < 0 || !Number.isInteger(t) || t < 0)
    throw new RangeError(`readRange: bad range ${r}+${t}`);
  const s = C(e);
  if (r + t > s)
    throw new RangeError(
      `readRange: ${r}+${t} is beyond the end of the file (${s} bytes); the file is truncated`
    );
  if (t === 0) return new ArrayBuffer(0);
  {
    const o = await e.file.slice(r, r + t).arrayBuffer();
    if (o.byteLength !== t)
      throw new RangeError(`readRange: short read (${o.byteLength} of ${t} bytes)`);
    return o;
  }
}
const O = "CHORWAVE", w = 128, T = 24, E = 2, l = (e, r) => {
  const t = e.getBigUint64(r, !0);
  if (t > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error(`cvw: offset at 0x${r.toString(16)} is not representable`);
  return Number(t);
};
function _(e, r) {
  if (e.byteLength < w) throw new Error("cvw: the file is shorter than its header");
  const t = new DataView(e);
  if (String.fromCharCode(...new Uint8Array(e, 0, 8)) !== O) throw new Error("cvw: not a FACSChorus waveform file (no CHORWAVE magic)");
  const o = t.getUint32(8, !0);
  if (o !== E) throw new Error(`cvw: unsupported version ${o}; GateLab reads version ${E}`);
  const n = {
    version: o,
    eventCount: t.getUint32(60, !0),
    indexOffset: l(t, 64),
    dataOffset: l(t, 72),
    metadataOffset: l(t, 80)
  }, a = n.indexOffset + n.eventCount * T;
  if (n.dataOffset < w || n.indexOffset < n.dataOffset || n.metadataOffset < a)
    throw new Error("cvw: the header's offsets are out of order");
  if (r !== void 0 && n.metadataOffset >= r)
    throw new Error(`cvw: the file is truncated (metadata at ${n.metadataOffset}, file is ${r} bytes)`);
  return n;
}
const b = (e, r) => {
  if (!Array.isArray(e) || e.some((t) => typeof t != "number")) throw new Error(`cvw: ${r} is not a list of numbers`);
  return Float64Array.from(e);
};
function k(e) {
  const r = typeof e == "string" ? e : new TextDecoder("utf-8").decode(e), t = r.indexOf("{");
  if (t < 0) throw new Error("cvw: no metadata document at the end of the file");
  let s;
  try {
    s = JSON.parse(r.slice(t));
  } catch (f) {
    throw new Error(`cvw: the metadata is not valid JSON (${f instanceof Error ? f.message : String(f)})`);
  }
  if (typeof s != "object" || s === null) throw new Error("cvw: the metadata is not an object");
  const o = s, n = o.namesForImageChannels, a = /* @__PURE__ */ new Map();
  if (typeof n == "object" && n !== null)
    for (const [f, d] of Object.entries(n))
      typeof d == "string" && /^\d+$/.test(f) && a.set(Number(f), d);
  if (a.size === 0) throw new Error("cvw: the metadata names no image channels");
  const m = (Array.isArray(o.lasers) ? o.lasers : []).map((f, d) => {
    if (typeof f != "object" || f === null) throw new Error(`cvw: laser ${d} is not an object`);
    const c = f, g = Array.isArray(c.frameIndexes) ? c.frameIndexes : [];
    if (g.some((h) => typeof h != "number")) throw new Error(`cvw: laser ${d} frameIndexes are not numbers`);
    const p = /* @__PURE__ */ new Map();
    if (typeof c.intrinsicPhasors == "object" && c.intrinsicPhasors !== null)
      for (const [h, S] of Object.entries(c.intrinsicPhasors))
        /^\d+$/.test(h) && p.set(Number(h), b(S, `intrinsicPhasors[${h}]`));
    const A = typeof c.pixelAspectRatio == "number" && c.pixelAspectRatio > 0 ? c.pixelAspectRatio : 1;
    return {
      laserName: typeof c.laserName == "string" ? c.laserName : `laser ${d}`,
      frameIndexes: g,
      lightlossIndex: typeof c.lightlossIndex == "number" ? c.lightlossIndex : -1,
      pixelAspectRatio: A,
      refPhasors: c.refPhasors === void 0 ? new Float64Array(0) : b(c.refPhasors, "refPhasors"),
      intrinsicPhasors: p
    };
  });
  if (m.length === 0) throw new Error("cvw: the metadata describes no imaging laser");
  return {
    version: typeof o.version == "string" ? o.version : "",
    recordingId: typeof o.recordingId == "string" ? o.recordingId : "",
    recordingName: typeof o.recordingName == "string" ? o.recordingName : "",
    channelNames: a,
    lasers: m
  };
}
async function L(e) {
  const r = C(e), t = _(await y(e, 0, Math.min(w, r)), r), s = k(await y(e, t.metadataOffset, r - t.metadataOffset));
  return { header: t, metadata: s };
}
class I extends Error {
  constructor(r) {
    super(r), this.name = "ImageAttachError";
  }
}
async function D(e, r, t, s) {
  let o;
  try {
    o = await L({ kind: "file", file: e });
  } catch (i) {
    throw new I(`${e.name}: ${i instanceof Error ? i.message : String(i)}`);
  }
  const { header: n, metadata: a } = o;
  if (n.eventCount !== t.nEvents)
    throw new I(
      `${e.name} holds ${n.eventCount.toLocaleString()} events but the FCS has ${t.nEvents.toLocaleString()}; it is not this file's recording`
    );
  return {
    kind: "cvw",
    fileName: e.name,
    file: e,
    handle: r,
    ...s ? { sourcePath: s } : {},
    eventCount: n.eventCount,
    recordingId: a.recordingId,
    channelNames: a.channelNames,
    pixelAspectRatio: a.lasers[0].pixelAspectRatio,
    display: R(a.channelNames, t.keywords),
    mask: M(t.keywords)
  };
}
export {
  I as ImageAttachError,
  D as attachCellImages
};
