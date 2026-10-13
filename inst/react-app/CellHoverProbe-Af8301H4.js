import { a as P } from "./embed-Divj10u8.js";
import { p as H, i as K, a as S, b as U } from "./plotGeometry-CJtfGMFK.js";
function j(u, r, I = {}) {
  const v = Math.min(u.length, r.length), g = I.maxPoints ?? 1e6;
  if (v === 0 || v > g) return null;
  let p = 1 / 0, L = -1 / 0, x = 1 / 0, F = -1 / 0;
  for (let n = 0; n < v; n++) {
    const o = u[n], s = r[n];
    !Number.isFinite(o) || !Number.isFinite(s) || (o < p && (p = o), o > L && (L = o), s < x && (x = s), s > F && (F = s));
  }
  if (!Number.isFinite(p) || !Number.isFinite(x)) return null;
  const O = I.include, e = Math.max(1, Math.floor(I.cells ?? 128)), a = L - p || 1, b = F - x || 1, l = (n, o) => {
    const s = Math.min(e - 1, Math.max(0, Math.floor((n - p) / a * e)));
    return Math.min(e - 1, Math.max(0, Math.floor((o - x) / b * e))) * e + s;
  }, i = new Int32Array(e * e + 1), M = new Int32Array(v).fill(-1);
  for (let n = 0; n < v; n++) {
    const o = u[n], s = r[n];
    if (!Number.isFinite(o) || !Number.isFinite(s) || O && !O(n)) continue;
    const m = l(o, s);
    M[n] = m, i[m + 1]++;
  }
  for (let n = 0; n < e * e; n++) i[n + 1] += i[n];
  const T = i.slice(0, e * e), w = new Int32Array(i[e * e]);
  for (let n = 0; n < v; n++) {
    const o = M[n];
    o < 0 || (w[T[o]++] = n);
  }
  return {
    size: w.length,
    nearest(n, o, s, m) {
      if (!(s > 0) || !(m > 0)) return null;
      const t = Math.max(0, Math.floor((n - s - p) / a * e)), c = Math.min(e - 1, Math.floor((n + s - p) / a * e)), f = Math.max(0, Math.floor((o - m - x) / b * e)), h = Math.min(e - 1, Math.floor((o + m - x) / b * e));
      if (c < 0 || h < 0 || t > e - 1 || f > e - 1) return null;
      let d = -1, E = 1;
      for (let X = f; X <= h; X++)
        for (let y = t; y <= c; y++) {
          const R = X * e + y;
          for (let Y = i[R]; Y < i[R + 1]; Y++) {
            const N = w[Y], A = (u[N] - n) / s, D = (r[N] - o) / m, B = A * A + D * D;
            B <= E && (E = B, d = N);
          }
        }
      return d >= 0 ? d : null;
    }
  };
}
const z = (u, r) => ({
  plotIndex: r,
  eventIndex: u.indices ? u.indices[r] : r,
  sampleId: u.sampleOf && u.sampleIds ? u.sampleIds[u.sampleOf[r]] ?? null : null
});
function J({
  plotAreaRef: u,
  plotted: r,
  xRange: I,
  yRange: v,
  enabled: g,
  radiusPx: p = 8,
  settleMs: L = 0,
  onHover: x,
  onPin: F,
  hasImage: O
}) {
  const e = P.useMemo(() => {
    if (!r) return null;
    const l = O ? (i) => {
      const M = r.sampleOf && r.sampleIds ? r.sampleIds[r.sampleOf[i]] ?? null : null;
      return O(M, r.indices ? r.indices[i] : i);
    } : void 0;
    return j(r.xd, r.yd, l ? { include: l } : {});
  }, [r, O]), a = P.useRef({ plotted: r, xRange: I, yRange: v, enabled: g, onHover: x, onPin: F, index: e, radiusPx: p, settleMs: L });
  a.current = { plotted: r, xRange: I, yRange: v, enabled: g, onHover: x, onPin: F, index: e, radiusPx: p, settleMs: L };
  const b = P.useRef(null);
  return P.useEffect(() => {
    const l = u.current;
    if (!l) return;
    let i = null, M = null;
    const T = (t) => {
      const { plotted: c, onHover: f } = a.current;
      t !== b.current && (b.current = t, f(t === null || !c ? null : z(c, t)));
    }, w = (t, c) => {
      const { plotted: f, xRange: h, yRange: d, index: E, radiusPx: X } = a.current;
      if (!f || !E) return null;
      const y = H(l, h, d);
      if (!y || !K(y, t, c)) return null;
      const [R, Y] = S(y, t, c), [N, A] = U(y, X);
      return E.nearest(R, Y, N, A);
    }, C = (t) => {
      if (!a.current.enabled || t.buttons !== 0) {
        i && (clearTimeout(i), i = null);
        return;
      }
      const c = l.getBoundingClientRect(), f = t.clientX - c.left, h = t.clientY - c.top, d = a.current.settleMs;
      if (i && clearTimeout(i), d <= 0) {
        T(w(f, h));
        return;
      }
      i = setTimeout(() => {
        i = null, T(w(f, h));
      }, d);
    }, n = () => {
      i && (clearTimeout(i), i = null), T(null);
    }, o = (t) => {
      M = { x: t.clientX, y: t.clientY };
    }, s = (t) => {
      const c = M;
      if (M = null, !c || !a.current.enabled || t.button !== 0 || Math.hypot(t.clientX - c.x, t.clientY - c.y) > 3) return;
      const f = l.getBoundingClientRect(), h = w(t.clientX - f.left, t.clientY - f.top), { plotted: d, onPin: E } = a.current;
      E(h === null || !d ? null : z(d, h));
    }, m = (t) => {
      t.key === "Escape" && a.current.onPin(null);
    };
    return l.addEventListener("pointermove", C, { passive: !0 }), l.addEventListener("pointerleave", n), l.addEventListener("pointerdown", o, { passive: !0 }), l.addEventListener("pointerup", s, { passive: !0 }), window.addEventListener("keydown", m), () => {
      l.removeEventListener("pointermove", C), l.removeEventListener("pointerleave", n), l.removeEventListener("pointerdown", o), l.removeEventListener("pointerup", s), window.removeEventListener("keydown", m), i && clearTimeout(i);
    };
  }, [u]), P.useEffect(() => {
    b.current = null;
  }, [r]), null;
}
export {
  J as CellHoverProbe
};
