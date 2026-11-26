import { b as S, q as T, a9 as q, e as k, m as x, c as P } from "./embed-DE3p7Uql.js";
const b = (o, n) => Math.asinh(o / n), G = (o, n) => Math.sinh(o) * n;
function W(o, n) {
  let e = 1 / 0, t = -1 / 0;
  for (const s of o) {
    if (!s) continue;
    const u = S(s);
    u.length !== 0 && (e = Math.min(e, b(T(u, 1e-3), n)), t = Math.max(t, b(T(u, 0.999), n)));
  }
  if (!(t > e)) return null;
  const i = (t - e) / 20;
  return { cofactor: n, lo: e - i, hi: t + i };
}
function H(o, n, e, t) {
  const i = new Uint32Array(e), s = (n.hi - n.lo) / e, u = t ? t.length : o.length;
  for (let r = 0; r < u; r++) {
    const l = o[t ? t[r] : r];
    if (!Number.isFinite(l)) continue;
    const p = Math.floor((b(l, n.cofactor) - n.lo) / s);
    i[Math.max(0, Math.min(e - 1, p))]++;
  }
  return i;
}
const U = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
function J(o) {
  const n = [], e = (t, i) => {
    const s = (b(t, o.cofactor) - o.lo) / (o.hi - o.lo);
    s >= 0 && s <= 1 && n.push({ value: t, at: s, label: i });
  };
  e(0, "0");
  for (let t = 1; t <= 9; t++) {
    const i = 10 ** t;
    if (i < 3 * o.cofactor) continue;
    const s = `10${String(t).split("").map((u) => U[Number(u)]).join("")}`;
    e(i, s), e(-i, `-${s}`);
  }
  return n.sort((t, i) => t.at - i.at);
}
const R = 200, $ = 5, _ = 0.99, V = 0.01;
function A(o, n) {
  const e = o.find((t) => t.id === n);
  if (!e) throw new Error(`Compensation control file "${n}" is not among the files given.`);
  return e;
}
function I(o, n) {
  const e = o.values(n);
  if (!e) throw new Error(`File "${o.fileName}" has no channel "${n}".`);
  return e;
}
const B = (o, n) => ({
  channel: o,
  source: n,
  positiveFileId: null,
  negativeFileId: null,
  positiveCount: 0,
  negativeCount: 0,
  positiveMedian: NaN,
  negativeMedian: NaN,
  calculated: null,
  uncertainty: null,
  warnings: []
});
function K(o, n, e, t) {
  const i = /* @__PURE__ */ new Map();
  for (const a of e) {
    if (!n.includes(a.channel)) throw new Error(`"${a.channel}" is not a channel of the matrix.`);
    if (i.has(a.channel)) throw new Error(`Two controls were given for "${a.channel}".`);
    i.set(a.channel, a);
  }
  const s = new Map([].map((a, d) => [a, d])), u = (a) => (s.get(n[a]), null), r = [], l = [];
  n.forEach((a, d) => {
    const v = i.get(a), f = v ? z(o, n, d, v) : null;
    if (f != null && f.calculated) {
      r.push(f.calculated.map((m, w) => w === d ? 1 : Math.max(0, m))), l.push(f);
      return;
    }
    const g = u(d);
    r.push(g ?? n.map((m, w) => w === d ? 1 : 0)), l.push({ ...f ?? B(a, "none"), source: g ? "fallback" : "none" });
  });
  let p = null;
  try {
    p = q(r);
  } catch {
    p = null;
  }
  return { channels: [...n], matrix: r, rows: l, diagnostics: p };
}
function z(o, n, e, t) {
  var C;
  const i = A(o, t.positive.fileId), s = A(o, t.negative.fileId), u = I(i, t.channel), r = k(t.positive, u), l = k(t.negative, I(s, t.channel)), p = {
    channel: t.channel,
    source: "control",
    positiveFileId: i.id,
    negativeFileId: s.id,
    positiveCount: r.length,
    negativeCount: l.length
  }, a = [];
  if (r.length < R && a.push({ code: "few-positive-events", count: r.length }), l.length < R && a.push({ code: "few-negative-events", count: l.length }), r.length < $ || l.length < $)
    return { ...p, positiveMedian: NaN, negativeMedian: NaN, calculated: null, uncertainty: null, warnings: a };
  const d = (c) => 1.2533 * P(c).rsd / Math.sqrt(c.length), v = [], f = n.map((c) => {
    const h = S(I(i, c), r), M = S(I(s, c), l);
    return v.push(Math.hypot(d(h), d(M))), x(h) - x(M);
  }), g = S(u, r), m = x(g), w = m - f[e];
  if (!(f[e] > 0))
    return { ...p, positiveMedian: m, negativeMedian: w, calculated: null, uncertainty: null, warnings: [...a, { code: "no-signal" }] };
  const N = ((C = i.channels.find((c) => c.pnn === t.channel)) == null ? void 0 : C.range) ?? 0;
  if (N > 0 && m >= _ * N)
    return { ...p, positiveMedian: m, negativeMedian: w, calculated: null, uncertainty: null, warnings: [...a, { code: "saturated" }] };
  if (N > 0) {
    let c = 0;
    for (let M = g.length - 1; M >= 0 && g[M] >= _ * N; M--) c++;
    const h = c / g.length;
    h > V && a.push({ code: "positive-at-top-of-range", fraction: h });
  }
  const E = f.map((c, h) => h === e ? 1 : c / f[e]), O = E.map((c, h) => h === e ? 0 : Math.hypot(v[h], c * v[e]) / f[e]);
  let y = -1, F = 0;
  return E.forEach((c, h) => {
    h !== e && (c > 1 && a.push({ code: "coefficient-above-one", receiver: n[h], value: c }), c < 0 && (F++, (y < 0 || c < E[y]) && (y = h)));
  }), F > 0 && a.push({ code: "negative-set-to-zero", count: F, receiver: n[y], lowest: E[y] }), { ...p, positiveMedian: m, negativeMedian: w, calculated: E, uncertainty: O, warnings: a };
}
function L(o, n) {
  const e = new Map(n.channels.map((i, s) => [i, s])), t = [];
  return o.channels.forEach((i, s) => {
    const u = e.get(i);
    u !== void 0 && o.channels.forEach((r, l) => {
      var v, f, g;
      const p = e.get(r);
      if (s === l || p === void 0) return;
      const a = o.matrix[s][l], d = n.matrix[u][p];
      t.push({
        source: i,
        receiver: r,
        calculated: a,
        reference: d,
        difference: a - d,
        uncertainty: ((g = (f = (v = o.rows) == null ? void 0 : v[s]) == null ? void 0 : f.uncertainty) == null ? void 0 : g[l]) ?? null
      });
    });
  }), t.sort((i, s) => Math.abs(s.difference) - Math.abs(i.difference));
}
export {
  R as F,
  H as a,
  L as c,
  K as e,
  G as f,
  W as h,
  J as s,
  b as t
};
