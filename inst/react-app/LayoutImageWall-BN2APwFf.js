import { u as C, a as w, cg as G, ch as P, ci as u, cj as D, ck as k, j as v, cl as K } from "./embed-3DD01fPl.js";
import { N as O } from "./cvwDecode-CKHzN2J_.js";
function $(t, n, R, E, I, T, i, h) {
  if (t.fillStyle = "#111", t.fillRect(T, i, h, h), !n) return;
  const g = R * I, x = Math.min(h / Math.max(g, 1), h / Math.max(E, 1)), o = g * x, c = E * x, d = T + (h - o) / 2, W = i + (h - c) / 2;
  if (t.imageSmoothingEnabled = !0, t.imageSmoothingQuality = "high", n.bitmap) {
    t.drawImage(n.bitmap, d, W, o, c);
    return;
  }
  if (!n.pixels) return;
  const e = document.createElement("canvas");
  e.width = n.width, e.height = n.height;
  const a = e.getContext("2d");
  a && (a.putImageData(new ImageData(n.pixels, n.width, n.height), 0, 0), t.drawImage(e, d, W, o, c));
}
function V({ recipe: t, service: n, width: R, height: E }) {
  const { t: I } = C(), T = w.useRef(null), [i, h] = w.useState(null), [g, x] = w.useState(() => /* @__PURE__ */ new Map()), o = t.sampleId, c = !!(n != null && n.hasSource(o));
  w.useEffect(() => {
    if (!n || !c) {
      h(null);
      return;
    }
    let e = !0;
    const a = n.knownInfo(o);
    if (a) {
      h({ fileKey: o, info: a, error: null });
      return;
    }
    return n.info(o).then(
      (s) => {
        e && h({ fileKey: o, info: s, error: null });
      },
      (s) => {
        e && h({ fileKey: o, info: null, error: s instanceof Error ? s.message : String(s) });
      }
    ), () => {
      e = !1;
    };
  }, [n, c, o]);
  const d = w.useMemo(() => !i || i.fileKey !== o || !i.info ? null : { display: t.display, scale: i.info.scale, exposure: t.exposure, hop: O, composite: !0, channels: [], ...t.outline ? { outline: t.outline } : {} }, [i, o, t.display, t.exposure, t.outline]), W = t.events.join(",");
  return w.useEffect(() => {
    if (!n || !d) return;
    const e = /* @__PURE__ */ new Map();
    x(e);
    const a = t.events.map((r) => {
      const H = n.cached(o, r, d), l = (M) => {
        const f = M.kind === "image" ? M.image : null;
        e.set(r, { picture: (f == null ? void 0 : f.composite) ?? null, cols: (f == null ? void 0 : f.cols) ?? 1, rows: (f == null ? void 0 : f.rows) ?? 1, aspect: (f == null ? void 0 : f.aspect) ?? 1 });
      };
      if (H)
        return l(H), null;
      const b = n.render(o, r, d, "batch");
      return b.promise.then((M) => {
        l(M), y();
      }, () => {
      }), b;
    });
    let s = null;
    const y = () => {
      s || (s = setTimeout(() => {
        s = null, x(new Map(e));
      }, 60));
    };
    return x(new Map(e)), () => {
      s && clearTimeout(s);
      for (const r of a) r == null || r.cancel();
    };
  }, [n, d, o, W]), w.useEffect(() => {
    const e = T.current;
    if (!e) return;
    const a = G(t), s = Math.max(0.05, Math.min(R / a.width, E / a.height)), y = Math.max(1, Math.min(3, typeof window < "u" && window.devicePixelRatio || 1)), r = Math.round(a.width * s), H = Math.round(a.height * s);
    e.style.width = `${r}px`, e.style.height = `${H}px`, e.width = Math.round(r * y), e.height = Math.round(H * y);
    const l = e.getContext("2d");
    if (!l) return;
    l.setTransform(y * s, 0, 0, y * s, 0, 0), l.fillStyle = "#fff", l.fillRect(0, 0, a.width, a.height);
    const [b, M] = P(t, I);
    if (l.fillStyle = "#1a1a1a", l.textBaseline = "alphabetic", l.font = "600 12px Helvetica Neue, Helvetica, Arial, sans-serif", l.fillText(b, u, u + 12, a.width - 2 * u), l.fillStyle = "#444", l.font = "10px Helvetica Neue, Helvetica, Arial, sans-serif", l.fillText(M, u, u + 26, a.width - 2 * u), t.legend && t.legend.length > 0) {
      let S = u;
      const A = u + K + 6;
      l.font = "9px Helvetica Neue, Helvetica, Arial, sans-serif";
      for (const m of t.legend)
        if (l.fillStyle = m.colour, l.fillRect(S, A - 1, 8, 8), l.fillStyle = "#444", l.fillText(m.label, S + 11, A + 7), S += 11 + l.measureText(m.label).width + 12, S > a.width - u) break;
    }
    const f = Math.max(1, t.columns), L = u + D(t);
    if (!c || i != null && i.error) {
      l.fillStyle = "#666", l.fillText((i == null ? void 0 : i.error) ?? I("The file's cell images are not attached"), u, L + 14);
      return;
    }
    t.events.forEach((S, A) => {
      var j;
      const m = u + A % f * (t.tile + k), p = L + Math.floor(A / f) * (t.tile + k), N = g.get(S);
      N ? $(l, N.picture, N.cols, N.rows, N.aspect, m, p, t.tile) : (l.fillStyle = "#e6e6e6", l.fillRect(m, p, t.tile, t.tile));
      const _ = (j = t.tileColours) == null ? void 0 : j[A];
      _ && (l.strokeStyle = _, l.lineWidth = 1.5, l.strokeRect(m + 0.75, p + 0.75, t.tile - 1.5, t.tile - 1.5));
    });
  }, [t, g, R, E, c, i, I]), /* @__PURE__ */ v.jsx("div", { className: "gl-layout-imagewall", "data-events": t.events.length, "data-ready": g.size, children: /* @__PURE__ */ v.jsx("canvas", { ref: T }) });
}
export {
  V as LayoutImageWall,
  $ as drawTile
};
