import { a as A, j as S } from "./embed-BEBIXb3n.js";
import { u as _, d as z } from "./CellInspector-BIKacaBn.js";
import { N as D } from "./cvwDecode-CKHzN2J_.js";
import { d as G, p as L } from "./plotGeometry-CJtfGMFK.js";
function V(f) {
  let n = Math.floor(f) >>> 0 || 1;
  return () => {
    n = n + 1831565813 >>> 0;
    let i = n;
    return i = Math.imul(i ^ i >>> 15, i | 1), i ^= i + Math.imul(i ^ i >>> 7, i | 61), ((i ^ i >>> 14) >>> 0) / 4294967296;
  };
}
function X(f, n, i, l, m, x, N = 1) {
  const k = Math.min(f.xd.length, f.yd.length);
  if (k === 0 || i <= 0) return new Int32Array(0);
  const y = l[1] - l[0], I = m[1] - m[0];
  if (!(y > 0) || !(I > 0)) return new Int32Array(0);
  const { width: a, height: p, cell: c } = x;
  if (!(a > 0) || !(p > 0) || !(c > 0)) return new Int32Array(0);
  const O = c / 2, d = Math.max(1, Math.floor(a / O)), P = Math.max(1, Math.floor(p / O)), T = a / d, H = p / P, M = d * P, j = new Int32Array(M).fill(-1), g = new Float64Array(M), b = new Float64Array(M), E = new Uint32Array(M), C = V(N);
  for (let o = 0; o < k; o++) {
    const F = f.xd[o], r = f.yd[o];
    if (!Number.isFinite(F) || !Number.isFinite(r) || F < l[0] || F > l[1] || r < m[0] || r > m[1] || !n(o)) continue;
    const $ = (F - l[0]) / y * a, U = (m[1] - r) / I * p, W = Math.min(d - 1, Math.floor($ / T)), B = Math.min(P - 1, Math.floor(U / H)) * d + W;
    E[B]++, C() * E[B] < 1 && (j[B] = o, g[B] = $, b[B] = U);
  }
  const t = [];
  for (let o = 0; o < M; o++) j[o] >= 0 && t.push(o);
  if (t.length === 0) return new Int32Array(0);
  const s = t.length, e = new Uint8Array(s), u = new Float64Array(s).fill(1 / 0), w = [];
  let h = 0;
  for (let o = 1; o < s; o++) E[t[o]] > E[t[h]] && (h = o);
  for (; w.length < i; ) {
    const o = t[h];
    e[h] = 1;
    let F = !1;
    for (const r of w)
      if (Math.abs(g[o] - g[r]) < c && Math.abs(b[o] - b[r]) < c) {
        F = !0;
        break;
      }
    if (!F) {
      w.push(o);
      for (let r = 0; r < s; r++) {
        if (e[r]) continue;
        const $ = t[r], U = (g[$] - g[o]) ** 2 + (b[$] - b[o]) ** 2;
        U < u[r] && (u[r] = U);
      }
    }
    h = -1;
    for (let r = 0; r < s; r++) !e[r] && (h < 0 || u[r] > u[h]) && (h = r);
    if (h < 0) break;
  }
  return Int32Array.from(w, (o) => j[o]);
}
function Y(f, n, i) {
  const l = i / Math.max(f, n, 1);
  return { width: Math.max(1, Math.round(f * l)), height: Math.max(1, Math.round(n * l)) };
}
const q = 6;
function J({ service: f, entry: n, eventIndex: i, spec: l, size: m, left: x, top: N, onPin: k, label: y }) {
  var O;
  const I = _(f, n.images ? n.id : null, i, l, "batch"), a = ((O = I.result) == null ? void 0 : O.kind) === "image" ? I.result.image : null, p = A.useRef(null), c = a ? Y(a.cols * a.aspect, a.rows, m) : null;
  return A.useEffect(() => {
    !(a != null && a.composite) || !p.current || !c || z(p.current, a.composite, c.width, c.height);
  }, [a, c == null ? void 0 : c.width, c == null ? void 0 : c.height]), !a || !c ? null : /* @__PURE__ */ S.jsx(
    "button",
    {
      type: "button",
      className: "gl-plot-thumb",
      style: { left: x - c.width / 2, top: N - c.height / 2, width: c.width, height: c.height },
      title: y,
      "aria-label": y,
      onClick: k,
      children: /* @__PURE__ */ S.jsx("canvas", { ref: p })
    }
  );
}
function nn({
  plotAreaRef: f,
  plotted: n,
  xRange: i,
  yRange: l,
  service: m,
  activeSampleId: x,
  resolveEntry: N,
  hasImage: k,
  count: y,
  size: I,
  seed: a,
  view: p,
  onPin: c,
  layoutKey: O
}) {
  const [d, P] = A.useState(null);
  A.useEffect(() => {
    const t = f.current;
    if (!t) return;
    const s = () => P(L(t, i, l));
    s();
    const e = typeof ResizeObserver == "function" ? new ResizeObserver(s) : null;
    return e == null || e.observe(t), () => e == null ? void 0 : e.disconnect();
  }, [f, i, l, O]);
  const T = (d == null ? void 0 : d.width) ?? 0, H = (d == null ? void 0 : d.height) ?? 0, M = A.useMemo(() => !n || !i || !l || !(T > 0) || !(H > 0) ? new Int32Array(0) : X(n, (s) => {
    const e = n.sampleOf && n.sampleIds ? n.sampleIds[n.sampleOf[s]] ?? null : null;
    return k(e, n.indices ? n.indices[s] : s);
  }, y, i, l, { width: T, height: H, cell: I + q }, a), [n, i, l, y, I, a, k, T, H]), j = A.useMemo(() => {
    const t = /* @__PURE__ */ new Set();
    if (!n) return t;
    if (n.sampleIds && n.sampleOf) for (const s of M) t.add(n.sampleIds[n.sampleOf[s]]);
    else x && t.add(x);
    return t;
  }, [n, M, x]), [g, b] = A.useState({});
  if (A.useEffect(() => {
    if (!m) return;
    let t = !0;
    for (const s of j) {
      if (g[s]) continue;
      const e = m.knownInfo(s);
      if (e) {
        b((u) => u[s] ? u : { ...u, [s]: e });
        continue;
      }
      m.info(s).then((u) => {
        t && b((w) => w[s] ? w : { ...w, [s]: u });
      }, () => {
      });
    }
    return () => {
      t = !1;
    };
  }, [m, j]), !n || !d || M.length === 0) return null;
  const E = (t) => {
    var u, w, h;
    const s = g[t.id], e = ((u = p[t.id]) == null ? void 0 : u.display) ?? ((w = t.images) == null ? void 0 : w.display) ?? null;
    return !s || !e ? null : { display: e, scale: s.scale, exposure: ((h = p[t.id]) == null ? void 0 : h.exposure) ?? 1, hop: D, composite: !0, channels: [] };
  }, C = [];
  for (const t of M) {
    const s = n.sampleOf && n.sampleIds ? n.sampleIds[n.sampleOf[t]] : x;
    if (!s) continue;
    const e = N(s);
    if (!(e != null && e.images)) continue;
    const u = n.indices ? n.indices[t] : t, [w, h] = G(d, n.xd[t], n.yd[t]);
    C.push(
      /* @__PURE__ */ S.jsx(
        J,
        {
          service: m,
          entry: e,
          eventIndex: u,
          spec: E(e),
          size: I,
          left: w,
          top: h,
          onPin: () => c({ sampleId: s, eventIndex: u }),
          label: `${e.name} · ${u.toLocaleString()}`
        },
        `${s}:${u}`
      )
    );
  }
  return /* @__PURE__ */ S.jsx("div", { className: "gl-plot-thumbs", "aria-hidden": "false", children: C });
}
export {
  nn as PlotThumbnails,
  q as THUMB_GAP,
  Y as thumbBox
};
