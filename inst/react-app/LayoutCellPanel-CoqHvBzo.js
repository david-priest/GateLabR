import { u as z, a as h, aY as F, aZ as J, a_ as R, a$ as V, j as L } from "./embed-BEBIXb3n.js";
import { N as Z } from "./cvwDecode-CKHzN2J_.js";
import { drawTile as q } from "./LayoutImageWall-Deo0h0eQ.js";
const P = "Helvetica Neue, Helvetica, Arial, sans-serif";
function $(e, o, d) {
  if (d <= 0 || e.measureText(o).width <= d) return o;
  let u = 0, m = o.length;
  for (; u < m; ) {
    const p = Math.ceil((u + m) / 2);
    e.measureText(o.slice(0, p) + "…").width <= d ? u = p : m = p - 1;
  }
  return u > 0 ? o.slice(0, u) + "…" : "…";
}
function tt({ recipe: e, service: o, width: d, height: u }) {
  var Y, j;
  const { t: m } = z(), p = h.useRef(null), [c, M] = h.useState(null), [k, H] = h.useState(() => /* @__PURE__ */ new Map()), f = e.sampleId, g = !!(o != null && o.hasSource(f));
  h.useEffect(() => {
    if (!o || !g) {
      M(null);
      return;
    }
    let s = !0;
    const n = o.knownInfo(f);
    if (n) {
      M({ fileKey: f, info: n, error: null });
      return;
    }
    return o.info(f).then(
      (a) => {
        s && M({ fileKey: f, info: a, error: null });
      },
      (a) => {
        s && M({ fileKey: f, info: null, error: a instanceof Error ? a.message : String(a) });
      }
    ), () => {
      s = !1;
    };
  }, [o, g, f]);
  const X = JSON.stringify([e.columns, e.display, e.gain ?? null]), E = h.useMemo(() => {
    if (!g || !c || c.fileKey !== f || !c.info) return null;
    const s = F(e);
    return {
      display: s.display,
      scale: c.info.scale,
      exposure: e.exposure,
      hop: Z,
      composite: s.composite,
      channels: s.channels,
      ...s.grey.length ? { grey: s.grey } : {},
      ...e.outline ? { outline: e.mask ?? {} } : {}
    };
  }, [g, c, f, X, e.exposure, e.outline, (Y = e.mask) == null ? void 0 : Y.slot, (j = e.mask) == null ? void 0 : j.fraction]), _ = e.cells.map((s) => s.event).join(",");
  return h.useEffect(() => {
    if (!o || !E) return;
    const s = /* @__PURE__ */ new Map(), n = (i, t) => {
      const l = t.kind === "image" ? t.image : null;
      s.set(i, { composite: (l == null ? void 0 : l.composite) ?? null, channels: (l == null ? void 0 : l.channels) ?? {}, cols: (l == null ? void 0 : l.cols) ?? 1, rows: (l == null ? void 0 : l.rows) ?? 1, aspect: (l == null ? void 0 : l.aspect) ?? 1 });
    };
    let a = null;
    const x = () => {
      a || (a = setTimeout(() => {
        a = null, H(new Map(s));
      }, 60));
    }, S = [...new Set(e.cells.map((i) => i.event))].map((i) => {
      const t = o.cached(f, i, E);
      if (t)
        return n(i, t), null;
      const l = o.render(f, i, E, "batch");
      return l.promise.then((y) => {
        n(i, y), x();
      }, () => {
      }), l;
    });
    return H(new Map(s)), () => {
      a && clearTimeout(a);
      for (const i of S) i == null || i.cancel();
    };
  }, [o, E, f, _]), h.useEffect(() => {
    const s = p.current;
    if (!s) return;
    const n = J(e), a = Math.max(0.05, Math.min(d / n.width, u / n.height)), x = Math.max(1, Math.min(3, typeof window < "u" && window.devicePixelRatio || 1)), S = Math.round(n.width * a), i = Math.round(n.height * a);
    s.style.width = `${S}px`, s.style.height = `${i}px`, s.width = Math.round(S * x), s.height = Math.round(i * x);
    const t = s.getContext("2d");
    if (!t) return;
    t.setTransform(x * a, 0, 0, x * a, 0, 0), t.fillStyle = "#fff", t.fillRect(0, 0, n.width, n.height);
    const l = e.tile, y = l + 3;
    n.titleHeight > 0 && (t.fillStyle = "#1a1a1a", t.font = `600 12px ${P}`, t.textAlign = "left", t.textBaseline = "alphabetic", t.fillText($(t, e.title.trim(), n.width - 2 * R), R, R + 12));
    const b = e.transpose === !0, A = V(e), I = b ? e.cells.map((r) => r.label) : A.map((r) => r.header), O = b ? A.map((r) => r.header) : e.cells.map((r) => r.label);
    if (n.headerHeight > 0 && (t.fillStyle = "#333", t.font = `10px ${P}`, t.textAlign = "center", t.textBaseline = "bottom", I.forEach((r, w) => t.fillText($(t, r, l), n.gridX + w * y + l / 2, n.gridY - 3))), n.labelWidth > 0 && (t.fillStyle = "#333", t.font = `10px ${P}`, t.textAlign = "right", t.textBaseline = "middle", O.forEach((r, w) => t.fillText($(t, r, n.labelWidth - 6), n.gridX - 5, n.gridY + w * y + l / 2))), t.textAlign = "left", !g || c != null && c.error) {
      t.fillStyle = "#666", t.font = `10px ${P}`, t.textBaseline = "alphabetic", t.fillText((c == null ? void 0 : c.error) ?? m("The file's cell images are not attached"), n.gridX, n.gridY + 14);
      return;
    }
    e.cells.forEach((r, w) => {
      A.forEach((N, B) => {
        const W = b ? B : w, D = b ? w : B, C = n.gridX + D * y, K = n.gridY + W * y, T = k.get(r.event);
        if (!T) {
          t.fillStyle = "#e6e6e6", t.fillRect(C, K, l, l);
          return;
        }
        const G = N.kind === "merge" ? T.composite : N.slot !== void 0 ? T.channels[N.slot] ?? null : null;
        q(t, G, T.cols, T.rows, T.aspect, C, K, l);
      });
    });
  }, [e, k, d, u, g, c, m]), /* @__PURE__ */ L.jsx("div", { className: "gl-layout-cellpanel", "data-cells": e.cells.length, "data-ready": k.size, children: /* @__PURE__ */ L.jsx("canvas", { ref: p }) });
}
export {
  tt as LayoutCellPanel
};
