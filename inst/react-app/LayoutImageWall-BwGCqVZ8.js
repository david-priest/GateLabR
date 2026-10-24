import { u as C, a as w, b3 as G, b4 as P, b5 as u, b6 as D, b7 as j, j as k, b8 as K } from "./embed-C4wtq6TR.js";
import { N as O } from "./cvwDecode-CKHzN2J_.js";
function $(t, n, N, A, E, I, i, r) {
  if (t.fillStyle = "#111", t.fillRect(I, i, r, r), !n) return;
  const g = N * E, x = Math.min(r / Math.max(g, 1), r / Math.max(A, 1)), o = g * x, c = A * x, d = I + (r - o) / 2, R = i + (r - c) / 2;
  if (t.imageSmoothingEnabled = !0, t.imageSmoothingQuality = "high", n.bitmap) {
    t.drawImage(n.bitmap, d, R, o, c);
    return;
  }
  if (!n.pixels) return;
  const e = document.createElement("canvas");
  e.width = n.width, e.height = n.height;
  const a = e.getContext("2d");
  a && (a.putImageData(new ImageData(n.pixels, n.width, n.height), 0, 0), t.drawImage(e, d, R, o, c));
}
function V({ recipe: t, service: n, width: N, height: A }) {
  const { t: E } = C(), I = w.useRef(null), [i, r] = w.useState(null), [g, x] = w.useState(() => /* @__PURE__ */ new Map()), o = t.sampleId, c = !!(n != null && n.hasSource(o));
  w.useEffect(() => {
    if (!n || !c) {
      r(null);
      return;
    }
    let e = !0;
    const a = n.knownInfo(o);
    if (a) {
      r({ fileKey: o, info: a, error: null });
      return;
    }
    return n.info(o).then(
      (s) => {
        e && r({ fileKey: o, info: s, error: null });
      },
      (s) => {
        e && r({ fileKey: o, info: null, error: s instanceof Error ? s.message : String(s) });
      }
    ), () => {
      e = !1;
    };
  }, [n, c, o]);
  const d = w.useMemo(() => !i || i.fileKey !== o || !i.info ? null : { display: t.display, scale: i.info.scale, exposure: t.exposure, hop: O, composite: !0, channels: [], ...t.outline ? { outline: t.outline } : {} }, [i, o, t.display, t.exposure, t.outline]), R = t.events.join(",");
  return w.useEffect(() => {
    if (!n || !d) return;
    const e = /* @__PURE__ */ new Map();
    x(e);
    const a = t.events.map((h) => {
      const T = n.cached(o, h, d), l = (M) => {
        const f = M.kind === "image" ? M.image : null;
        e.set(h, { picture: (f == null ? void 0 : f.composite) ?? null, cols: (f == null ? void 0 : f.cols) ?? 1, rows: (f == null ? void 0 : f.rows) ?? 1, aspect: (f == null ? void 0 : f.aspect) ?? 1 });
      };
      if (T)
        return l(T), null;
      const W = n.render(o, h, d, "batch");
      return W.promise.then((M) => {
        l(M), y();
      }, () => {
      }), W;
    });
    let s = null;
    const y = () => {
      s || (s = setTimeout(() => {
        s = null, x(new Map(e));
      }, 60));
    };
    return x(new Map(e)), () => {
      s && clearTimeout(s);
      for (const h of a) h == null || h.cancel();
    };
  }, [n, d, o, R]), w.useEffect(() => {
    const e = I.current;
    if (!e) return;
    const a = G(t), s = Math.max(0.05, Math.min(N / a.width, A / a.height)), y = Math.max(1, Math.min(3, typeof window < "u" && window.devicePixelRatio || 1)), h = Math.round(a.width * s), T = Math.round(a.height * s);
    e.style.width = `${h}px`, e.style.height = `${T}px`, e.width = Math.round(h * y), e.height = Math.round(T * y);
    const l = e.getContext("2d");
    if (!l) return;
    l.setTransform(y * s, 0, 0, y * s, 0, 0), l.fillStyle = "#fff", l.fillRect(0, 0, a.width, a.height);
    const [W, M] = P(t, E);
    if (l.fillStyle = "#1a1a1a", l.textBaseline = "alphabetic", l.font = "600 12px Helvetica Neue, Helvetica, Arial, sans-serif", l.fillText(W, u, u + 12, a.width - 2 * u), l.fillStyle = "#444", l.font = "10px Helvetica Neue, Helvetica, Arial, sans-serif", l.fillText(M, u, u + 26, a.width - 2 * u), t.legend && t.legend.length > 0) {
      let S = u;
      const b = u + K + 6;
      l.font = "9px Helvetica Neue, Helvetica, Arial, sans-serif";
      for (const m of t.legend)
        if (l.fillStyle = m.colour, l.fillRect(S, b - 1, 8, 8), l.fillStyle = "#444", l.fillText(m.label, S + 11, b + 7), S += 11 + l.measureText(m.label).width + 12, S > a.width - u) break;
    }
    const f = Math.max(1, t.columns), L = u + D(t);
    if (!c || i != null && i.error) {
      l.fillStyle = "#666", l.fillText((i == null ? void 0 : i.error) ?? E("The file's cell images are not attached"), u, L + 14);
      return;
    }
    t.events.forEach((S, b) => {
      var v;
      const m = u + b % f * (t.tile + j), p = L + Math.floor(b / f) * (t.tile + j), H = g.get(S);
      H ? $(l, H.picture, H.cols, H.rows, H.aspect, m, p, t.tile) : (l.fillStyle = "#e6e6e6", l.fillRect(m, p, t.tile, t.tile));
      const _ = (v = t.tileColours) == null ? void 0 : v[b];
      _ && (l.strokeStyle = _, l.lineWidth = 1.5, l.strokeRect(m + 0.75, p + 0.75, t.tile - 1.5, t.tile - 1.5));
    });
  }, [t, g, N, A, c, i, E]), /* @__PURE__ */ k.jsx("div", { className: "gl-layout-imagewall", "data-events": t.events.length, "data-ready": g.size, children: /* @__PURE__ */ k.jsx("canvas", { ref: I }) });
}
export {
  V as LayoutImageWall,
  $ as drawTile
};
