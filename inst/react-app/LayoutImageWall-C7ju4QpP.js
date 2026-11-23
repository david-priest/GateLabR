import { u as $, r as w, cz as F, j as z, cA as Q, cB as r, cC as V, cD as B, cE as q } from "./embed-D_eRnync.js";
import { N as x } from "./cvwDecode-CKHzN2J_.js";
import { k as J, f as b } from "./LayoutTab-e9VO2lBZ.js";
function U(t, n, C, L, N, R, l, h) {
  if (t.fillStyle = "#111", t.fillRect(R, l, h, h), !n) return;
  const g = C * N, M = Math.min(h / Math.max(g, 1), h / Math.max(L, 1)), T = g * M, A = L * M, o = R + (h - T) / 2, c = l + (h - A) / 2;
  if (t.imageSmoothingEnabled = !0, t.imageSmoothingQuality = "high", n.bitmap) {
    t.drawImage(n.bitmap, o, c, T, A);
    return;
  }
  if (!n.pixels) return;
  const d = document.createElement("canvas");
  d.width = n.width, d.height = n.height;
  const _ = d.getContext("2d");
  _ && (_.putImageData(new ImageData(n.pixels, n.width, n.height), 0, 0), t.drawImage(d, o, c, T, A));
}
function tt({ recipe: t, service: n, width: C, height: L }) {
  const { t: N } = $(), R = w.useRef(null), [l, h] = w.useState(null), [g, M] = w.useState(() => /* @__PURE__ */ new Map()), [T, A] = w.useState(() => /* @__PURE__ */ new Set()), o = t.sampleId, c = !!(n != null && n.hasSource(o));
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
  const d = w.useMemo(() => !l || l.fileKey !== o || !l.info ? null : { display: t.display, scale: l.info.scale, exposure: t.exposure, hop: x, composite: !0, channels: [], ...t.outline ? { outline: t.outline } : {} }, [l, o, t.display, t.exposure, t.outline]), _ = t.events.join(",");
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
  }, [n, d, o, _]), w.useEffect(() => {
    const s = R.current;
    if (!s) return;
    const a = F(t), f = Math.max(0.05, Math.min(C / a.width, L / a.height)), E = Math.max(1, Math.min(3, typeof window < "u" && window.devicePixelRatio || 1)), m = Math.round(a.width * f), W = Math.round(a.height * f);
    s.style.width = `${m}px`, s.style.height = `${W}px`, s.width = Math.round(m * E), s.height = Math.round(W * E);
    const u = s.getContext("2d");
    if (!u) return;
    u.setTransform(E * f, 0, 0, E * f, 0, 0);
    const v = (e, y) => {
      e.fillStyle = "#fff", e.fillRect(0, 0, a.width, a.height);
      const [I, i] = Q(t, N);
      if (e.fillStyle = "#1a1a1a", e.textBaseline = "alphabetic", e.font = "600 12px Helvetica Neue, Helvetica, Arial, sans-serif", b(e, y, I, r, r + 12, a.width - 2 * r), e.fillStyle = "#444", e.font = "10px Helvetica Neue, Helvetica, Arial, sans-serif", b(e, y, i, r, r + 26, a.width - 2 * r), t.legend && t.legend.length > 0) {
        let p = r;
        const H = r + q + 6;
        e.font = "9px Helvetica Neue, Helvetica, Arial, sans-serif";
        for (const S of t.legend)
          if (e.fillStyle = S.colour, e.fillRect(p, H - 1, 8, 8), e.fillStyle = "#444", b(e, y, S.label, p + 11, H + 7), p += 11 + e.measureText(S.label).width + 12, p > a.width - r) break;
      }
      const D = Math.max(1, t.columns), G = r + V(t);
      if (!c || l != null && l.error) {
        e.fillStyle = "#666", b(e, y, (l == null ? void 0 : l.error) ?? N("The file's cell images are not attached"), r, G + 14);
        return;
      }
      t.events.forEach((p, H) => {
        var K;
        const S = r + H % D * (t.tile + B), j = G + Math.floor(H / D) * (t.tile + B), k = g.get(p);
        k ? U(e, k.picture, k.cols, k.rows, k.aspect, S, j, t.tile) : (e.fillStyle = "#e6e6e6", e.fillRect(S, j, t.tile, t.tile));
        const P = (K = t.tileColours) == null ? void 0 : K[H];
        P && (e.strokeStyle = P, e.lineWidth = 1.5, e.strokeRect(S + 0.75, j + 0.75, t.tile - 1.5, t.tile - 1.5));
      });
    };
    v(u, null), J(s, { width: a.width, height: a.height, draw: v });
  }, [t, g, C, L, c, l, N]);
  const O = c && !(l != null && l.error) && g.size + T.size < new Set(t.events).size;
  return /* @__PURE__ */ z.jsx("div", { className: "gl-layout-imagewall", "data-events": t.events.length, "data-ready": g.size, "data-layout-pending": O ? "1" : void 0, children: /* @__PURE__ */ z.jsx("canvas", { ref: R }) });
}
export {
  tt as LayoutImageWall,
  U as drawTile
};
