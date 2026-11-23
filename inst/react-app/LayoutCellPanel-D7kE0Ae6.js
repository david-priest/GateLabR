import { u as Z, r as m, cv as x, cw as tt, j as _, cx as et, cy as j } from "./embed-D_eRnync.js";
import { N as nt } from "./cvwDecode-CKHzN2J_.js";
import { drawTile as lt } from "./LayoutImageWall-C7ju4QpP.js";
import { k as st, f as H } from "./LayoutTab-e9VO2lBZ.js";
const L = "Helvetica Neue, Helvetica, Arial, sans-serif";
function z(e, o, w) {
  if (w <= 0 || e.measureText(o).width <= w) return o;
  let c = 0, y = o.length;
  for (; c < y; ) {
    const S = Math.ceil((c + y) / 2);
    e.measureText(o.slice(0, S) + "…").width <= w ? c = S : y = S - 1;
  }
  return c > 0 ? o.slice(0, c) + "…" : "…";
}
function ft({ recipe: e, service: o, width: w, height: c }) {
  var X, Y;
  const { t: y } = Z(), S = m.useRef(null), [i, P] = m.useState(null), [A, B] = m.useState(() => /* @__PURE__ */ new Map()), [D, K] = m.useState(() => /* @__PURE__ */ new Set()), u = e.sampleId, p = !!(o != null && o.hasSource(u));
  m.useEffect(() => {
    if (!o || !p) {
      P(null);
      return;
    }
    let l = !0;
    const n = o.knownInfo(u);
    if (n) {
      P({ fileKey: u, info: n, error: null });
      return;
    }
    return o.info(u).then(
      (r) => {
        l && P({ fileKey: u, info: r, error: null });
      },
      (r) => {
        l && P({ fileKey: u, info: null, error: r instanceof Error ? r.message : String(r) });
      }
    ), () => {
      l = !1;
    };
  }, [o, p, u]);
  const F = JSON.stringify([e.columns, e.display, e.gain ?? null]), N = m.useMemo(() => {
    if (!p || !i || i.fileKey !== u || !i.info) return null;
    const l = x(e);
    return {
      display: l.display,
      scale: i.info.scale,
      exposure: e.exposure,
      hop: nt,
      composite: l.composite,
      channels: l.channels,
      ...l.grey.length ? { grey: l.grey } : {},
      ...e.outline ? { outline: e.mask ?? {} } : {}
    };
  }, [p, i, u, F, e.exposure, e.outline, (X = e.mask) == null ? void 0 : X.slot, (Y = e.mask) == null ? void 0 : Y.fraction]), G = e.cells.map((l) => l.event).join(",");
  m.useEffect(() => {
    if (!o || !N) return;
    const l = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set();
    let r = !0;
    const g = (a, t) => {
      const s = t.kind === "image" ? t.image : null;
      l.set(a, { composite: (s == null ? void 0 : s.composite) ?? null, channels: (s == null ? void 0 : s.channels) ?? {}, cols: (s == null ? void 0 : s.cols) ?? 1, rows: (s == null ? void 0 : s.rows) ?? 1, aspect: (s == null ? void 0 : s.aspect) ?? 1 });
    };
    let d = null;
    const T = () => {
      d || (d = setTimeout(() => {
        d = null, B(new Map(l)), K(new Set(n));
      }, 60));
    }, k = [...new Set(e.cells.map((a) => a.event))].map((a) => {
      const t = o.cached(u, a, N);
      if (t)
        return g(a, t), null;
      const s = o.render(u, a, N, "batch");
      return s.promise.then((h) => {
        g(a, h), T();
      }, () => {
        r && (n.add(a), T());
      }), s;
    });
    return B(new Map(l)), K(new Set(n)), () => {
      r = !1, d && clearTimeout(d);
      for (const a of k) a == null || a.cancel();
    };
  }, [o, N, u, G]), m.useEffect(() => {
    const l = S.current;
    if (!l) return;
    const n = tt(e), r = Math.max(0.05, Math.min(w / n.width, c / n.height)), g = Math.max(1, Math.min(3, typeof window < "u" && window.devicePixelRatio || 1)), d = Math.round(n.width * r), T = Math.round(n.height * r);
    l.style.width = `${d}px`, l.style.height = `${T}px`, l.width = Math.round(d * g), l.height = Math.round(T * g);
    const k = l.getContext("2d");
    if (!k) return;
    k.setTransform(g * r, 0, 0, g * r, 0, 0);
    const a = (t, s) => {
      t.fillStyle = "#fff", t.fillRect(0, 0, n.width, n.height);
      const h = e.tile, b = h + 3;
      n.titleHeight > 0 && (t.fillStyle = "#1a1a1a", t.font = `600 12px ${L}`, t.textAlign = "left", t.textBaseline = "alphabetic", H(t, s, z(t, e.title.trim(), n.width - 2 * j), j, j + 12));
      const R = e.transpose === !0, $ = et(e), J = R ? e.cells.map((f) => f.label) : $.map((f) => f.header), V = R ? $.map((f) => f.header) : e.cells.map((f) => f.label);
      if (n.headerHeight > 0 && (t.fillStyle = "#333", t.font = `10px ${L}`, t.textAlign = "center", t.textBaseline = "bottom", J.forEach((f, M) => H(t, s, z(t, f, h), n.gridX + M * b + h / 2, n.gridY - 3))), n.labelWidth > 0 && (t.fillStyle = "#333", t.font = `10px ${L}`, t.textAlign = "right", t.textBaseline = "middle", V.forEach((f, M) => H(t, s, z(t, f, n.labelWidth - 6), n.gridX - 5, n.gridY + M * b + h / 2))), t.textAlign = "left", !p || i != null && i.error) {
        t.fillStyle = "#666", t.font = `10px ${L}`, t.textBaseline = "alphabetic", H(t, s, (i == null ? void 0 : i.error) ?? y("The file's cell images are not attached"), n.gridX, n.gridY + 14);
        return;
      }
      e.cells.forEach((f, M) => {
        $.forEach((C, v) => {
          const q = R ? v : M, Q = R ? M : v, O = n.gridX + Q * b, W = n.gridY + q * b, E = A.get(f.event);
          if (!E) {
            t.fillStyle = "#e6e6e6", t.fillRect(O, W, h, h);
            return;
          }
          const U = C.kind === "merge" ? E.composite : C.slot !== void 0 ? E.channels[C.slot] ?? null : null;
          lt(t, U, E.cols, E.rows, E.aspect, O, W, h);
        });
      });
    };
    a(k, null), st(l, { width: n.width, height: n.height, draw: a });
  }, [e, A, w, c, p, i, y]);
  const I = p && !(i != null && i.error) && A.size + D.size < new Set(e.cells.map((l) => l.event)).size;
  return /* @__PURE__ */ _.jsx("div", { className: "gl-layout-cellpanel", "data-cells": e.cells.length, "data-ready": A.size, "data-layout-pending": I ? "1" : void 0, children: /* @__PURE__ */ _.jsx("canvas", { ref: S }) });
}
export {
  ft as LayoutCellPanel
};
