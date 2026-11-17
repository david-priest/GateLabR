import { u as z, a as w, cq as B, j as O, cr as F, cs as r, ct as Q, cu as $, cv as V } from "./embed-DAY6mzhM.js";
import { N as x } from "./cvwDecode-CKHzN2J_.js";
import { k as J, f as C } from "./LayoutTab-bSrkDViU.js";
function U(t, n, _, H, L, N, l, h) {
  if (t.fillStyle = "#111", t.fillRect(N, l, h, h), !n) return;
  const g = _ * L, M = Math.min(h / Math.max(g, 1), h / Math.max(H, 1)), R = g * M, A = H * M, o = N + (h - R) / 2, c = l + (h - A) / 2;
  if (t.imageSmoothingEnabled = !0, t.imageSmoothingQuality = "high", n.bitmap) {
    t.drawImage(n.bitmap, o, c, R, A);
    return;
  }
  if (!n.pixels) return;
  const d = document.createElement("canvas");
  d.width = n.width, d.height = n.height;
  const b = d.getContext("2d");
  b && (b.putImageData(new ImageData(n.pixels, n.width, n.height), 0, 0), t.drawImage(d, o, c, R, A));
}
function tt({ recipe: t, service: n, width: _, height: H }) {
  const { t: L } = z(), N = w.useRef(null), [l, h] = w.useState(null), [g, M] = w.useState(() => /* @__PURE__ */ new Map()), [R, A] = w.useState(() => /* @__PURE__ */ new Set()), o = t.sampleId, c = !!(n != null && n.hasSource(o));
  w.useEffect(() => {
    if (!n || !c) {
      h(null);
      return;
    }
    let s = !0;
    const a = n.knownInfo(o);
    if (a) {
      h({ fileKey: o, info: a, error: null });
      return;
    }
    return n.info(o).then(
      (f) => {
        s && h({ fileKey: o, info: f, error: null });
      },
      (f) => {
        s && h({ fileKey: o, info: null, error: f instanceof Error ? f.message : String(f) });
      }
    ), () => {
      s = !1;
    };
  }, [n, c, o]);
  const d = w.useMemo(() => !l || l.fileKey !== o || !l.info ? null : { display: t.display, scale: l.info.scale, exposure: t.exposure, hop: x, composite: !0, channels: [], ...t.outline ? { outline: t.outline } : {} }, [l, o, t.display, t.exposure, t.outline]), b = t.events.join(",");
  w.useEffect(() => {
    if (!n || !d) return;
    const s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
    let f = !0;
    M(s);
    const E = t.events.map((u) => {
      const W = n.cached(o, u, d), e = (I) => {
        const i = I.kind === "image" ? I.image : null;
        s.set(u, { picture: (i == null ? void 0 : i.composite) ?? null, cols: (i == null ? void 0 : i.cols) ?? 1, rows: (i == null ? void 0 : i.rows) ?? 1, aspect: (i == null ? void 0 : i.aspect) ?? 1 });
      };
      if (W)
        return e(W), null;
      const y = n.render(o, u, d, "batch");
      return y.promise.then((I) => {
        e(I), T();
      }, () => {
        f && (a.add(u), T());
      }), y;
    });
    let m = null;
    const T = () => {
      m || (m = setTimeout(() => {
        m = null, M(new Map(s)), A(new Set(a));
      }, 60));
    };
    return M(new Map(s)), A(new Set(a)), () => {
      f = !1, m && clearTimeout(m);
      for (const u of E) u == null || u.cancel();
    };
  }, [n, d, o, b]), w.useEffect(() => {
    const s = N.current;
    if (!s) return;
    const a = B(t), f = Math.max(0.05, Math.min(_ / a.width, H / a.height)), E = Math.max(1, Math.min(3, typeof window < "u" && window.devicePixelRatio || 1)), m = Math.round(a.width * f), T = Math.round(a.height * f);
    s.style.width = `${m}px`, s.style.height = `${T}px`, s.width = Math.round(m * E), s.height = Math.round(T * E);
    const u = s.getContext("2d");
    if (!u) return;
    u.setTransform(E * f, 0, 0, E * f, 0, 0);
    const W = (e, y) => {
      e.fillStyle = "#fff", e.fillRect(0, 0, a.width, a.height);
      const [I, i] = F(t, L);
      if (e.fillStyle = "#1a1a1a", e.textBaseline = "alphabetic", e.font = "600 12px Helvetica Neue, Helvetica, Arial, sans-serif", C(e, y, I, r, r + 12, a.width - 2 * r), e.fillStyle = "#444", e.font = "10px Helvetica Neue, Helvetica, Arial, sans-serif", C(e, y, i, r, r + 26, a.width - 2 * r), t.legend && t.legend.length > 0) {
        let p = r;
        const v = r + V + 6;
        e.font = "9px Helvetica Neue, Helvetica, Arial, sans-serif";
        for (const S of t.legend)
          if (e.fillStyle = S.colour, e.fillRect(p, v - 1, 8, 8), e.fillStyle = "#444", C(e, y, S.label, p + 11, v + 7), p += 11 + e.measureText(S.label).width + 12, p > a.width - r) break;
      }
      const G = Math.max(1, t.columns), P = r + Q(t);
      if (!c || l != null && l.error) {
        e.fillStyle = "#666", C(e, y, (l == null ? void 0 : l.error) ?? L("The file's cell images are not attached"), r, P + 14);
        return;
      }
      t.events.forEach((p, v) => {
        var K;
        const S = r + v % G * (t.tile + $), j = P + Math.floor(v / G) * (t.tile + $), k = g.get(p);
        k ? U(e, k.picture, k.cols, k.rows, k.aspect, S, j, t.tile) : (e.fillStyle = "#e6e6e6", e.fillRect(S, j, t.tile, t.tile));
        const D = (K = t.tileColours) == null ? void 0 : K[v];
        D && (e.strokeStyle = D, e.lineWidth = 1.5, e.strokeRect(S + 0.75, j + 0.75, t.tile - 1.5, t.tile - 1.5));
      });
    };
    W(u, null), J(s, { width: a.width, height: a.height, draw: W });
  }, [t, g, _, H, c, l, L]);
  const q = c && !(l != null && l.error) && g.size + R.size < new Set(t.events).size;
  return /* @__PURE__ */ O.jsx("div", { className: "gl-layout-imagewall", "data-events": t.events.length, "data-ready": g.size, "data-layout-pending": q ? "1" : void 0, children: /* @__PURE__ */ O.jsx("canvas", { ref: N }) });
}
export {
  tt as LayoutImageWall,
  U as drawTile
};
