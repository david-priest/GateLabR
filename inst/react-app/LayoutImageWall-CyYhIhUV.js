import { u as z, r as w, cP as B, j as O, cQ as F, cR as r, cS as U, cT as Q, cU as V } from "./embed-DE3p7Uql.js";
import { N as q } from "./cvwDecode-CKHzN2J_.js";
import { k as x, f as C } from "./LayoutTab-Dm8cYWXw.js";
function J(t, n, _, T, H, L, l, h) {
  if (t.fillStyle = "#111", t.fillRect(L, l, h, h), !n) return;
  const g = _ * H, M = Math.min(h / Math.max(g, 1), h / Math.max(T, 1)), N = g * M, A = T * M, o = L + (h - N) / 2, c = l + (h - A) / 2;
  if (t.imageSmoothingEnabled = !0, t.imageSmoothingQuality = "high", n.bitmap) {
    t.drawImage(n.bitmap, o, c, N, A);
    return;
  }
  if (!n.pixels) return;
  const d = document.createElement("canvas");
  d.width = n.width, d.height = n.height;
  const b = d.getContext("2d");
  b && (b.putImageData(new ImageData(n.pixels, n.width, n.height), 0, 0), t.drawImage(d, o, c, N, A));
}
function tt({ recipe: t, service: n, width: _, height: T }) {
  const { t: H } = z(), L = w.useRef(null), [l, h] = w.useState(null), [g, M] = w.useState(() => /* @__PURE__ */ new Map()), [N, A] = w.useState(() => /* @__PURE__ */ new Set()), o = t.sampleId, c = !!(n != null && n.hasSource(o));
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
  const d = w.useMemo(() => !l || l.fileKey !== o || !l.info ? null : { display: t.display, scale: l.info.scale, exposure: t.exposure, hop: q, composite: !0, channels: [], ...t.outline ? { outline: t.outline } : {} }, [l, o, t.display, t.exposure, t.outline]), b = t.events.join(",");
  w.useEffect(() => {
    if (!n || !d) return;
    const s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set();
    let f = !0;
    M(s);
    const E = t.events.map((u) => {
      const v = n.cached(o, u, d), e = (I) => {
        const i = I.kind === "image" ? I.image : null;
        s.set(u, { picture: (i == null ? void 0 : i.composite) ?? null, cols: (i == null ? void 0 : i.cols) ?? 1, rows: (i == null ? void 0 : i.rows) ?? 1, aspect: (i == null ? void 0 : i.aspect) ?? 1 });
      };
      if (v)
        return e(v), null;
      const y = n.render(o, u, d, "batch");
      return y.promise.then((I) => {
        e(I), W();
      }, () => {
        f && (a.add(u), W());
      }), y;
    });
    let m = null;
    const W = () => {
      m || (m = setTimeout(() => {
        m = null, M(new Map(s)), A(new Set(a));
      }, 60));
    };
    return M(new Map(s)), A(new Set(a)), () => {
      f = !1, m && clearTimeout(m);
      for (const u of E) u == null || u.cancel();
    };
  }, [n, d, o, b]), w.useEffect(() => {
    const s = L.current;
    if (!s) return;
    const a = B(t), f = Math.max(0.05, Math.min(_ / a.width, T / a.height)), E = Math.max(1, Math.min(3, typeof window < "u" && window.devicePixelRatio || 1)), m = Math.round(a.width * f), W = Math.round(a.height * f);
    s.style.width = `${m}px`, s.style.height = `${W}px`, s.width = Math.round(m * E), s.height = Math.round(W * E);
    const u = s.getContext("2d");
    if (!u) return;
    u.setTransform(E * f, 0, 0, E * f, 0, 0);
    const v = (e, y) => {
      e.fillStyle = "#fff", e.fillRect(0, 0, a.width, a.height);
      const [I, i] = F(t, H);
      if (e.fillStyle = "#1a1a1a", e.textBaseline = "alphabetic", e.font = "600 12px Helvetica Neue, Helvetica, Arial, sans-serif", C(e, y, I, r, r + 12, a.width - 2 * r), e.fillStyle = "#444", e.font = "10px Helvetica Neue, Helvetica, Arial, sans-serif", C(e, y, i, r, r + 26, a.width - 2 * r), t.legend && t.legend.length > 0) {
        let p = r;
        const R = r + V + 6;
        e.font = "9px Helvetica Neue, Helvetica, Arial, sans-serif";
        for (const S of t.legend)
          if (e.fillStyle = S.colour, e.fillRect(p, R - 1, 8, 8), e.fillStyle = "#444", C(e, y, S.label, p + 11, R + 7), p += 11 + e.measureText(S.label).width + 12, p > a.width - r) break;
      }
      const j = Math.max(1, t.columns), G = r + U(t);
      if (!c || l != null && l.error) {
        e.fillStyle = "#666", C(e, y, (l == null ? void 0 : l.error) ?? H("The file's cell images are not attached"), r, G + 14);
        return;
      }
      t.events.forEach((p, R) => {
        var K;
        const S = r + R % j * (t.tile + Q), P = G + Math.floor(R / j) * (t.tile + Q), k = g.get(p);
        k ? J(e, k.picture, k.cols, k.rows, k.aspect, S, P, t.tile) : (e.fillStyle = "#e6e6e6", e.fillRect(S, P, t.tile, t.tile));
        const D = (K = t.tileColours) == null ? void 0 : K[R];
        D && (e.strokeStyle = D, e.lineWidth = 1.5, e.strokeRect(S + 0.75, P + 0.75, t.tile - 1.5, t.tile - 1.5));
      });
    };
    v(u, null), x(s, { width: a.width, height: a.height, draw: v });
  }, [t, g, _, T, c, l, H]);
  const $ = c && !(l != null && l.error) && g.size + N.size < new Set(t.events).size;
  return /* @__PURE__ */ O.jsx("div", { className: "gl-layout-imagewall", "data-events": t.events.length, "data-ready": g.size, "data-layout-pending": $ ? "1" : void 0, children: /* @__PURE__ */ O.jsx("canvas", { ref: L }) });
}
export {
  tt as LayoutImageWall,
  J as drawTile
};
