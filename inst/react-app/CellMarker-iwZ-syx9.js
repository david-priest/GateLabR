import { a as h, j as s } from "./embed-Divj10u8.js";
import { p as N, d as w } from "./plotGeometry-CJtfGMFK.js";
function C({ plotAreaRef: m, xRange: v, yRange: x, hoverStore: d, pinned: i, displayPointOf: f, colourOf: a, layoutKey: E }) {
  const o = h.useSyncExternalStore(d.subscribe, d.get, d.get), [e, g] = h.useState({ hovered: null, pinned: null });
  h.useEffect(() => {
    const t = m.current;
    if (!t) {
      g({ hovered: null, pinned: null });
      return;
    }
    const l = () => {
      const n = N(t, v, x), j = (y) => {
        if (!y || !n) return null;
        const c = f(y);
        if (!c) return null;
        const [u, p] = w(n, c[0], c[1]);
        return u >= n.left && u <= n.left + n.width && p >= n.top && p <= n.top + n.height ? [u, p] : null;
      };
      g({ hovered: j(o), pinned: j(i) });
    };
    l();
    const r = typeof ResizeObserver == "function" ? new ResizeObserver(l) : null;
    return r == null || r.observe(t), () => r == null ? void 0 : r.disconnect();
  }, [m, v, x, o, i, f, E]);
  const b = e.hovered && e.pinned && e.hovered[0] === e.pinned[0] && e.hovered[1] === e.pinned[1], k = (t) => {
    const l = t ? (a == null ? void 0 : a(t)) ?? null : null;
    return l ? /* @__PURE__ */ s.jsx("span", { className: "gl-cell-marker-dot", style: { background: l } }) : null;
  };
  return /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    e.hovered && !b && /* @__PURE__ */ s.jsx("div", { className: "gl-cell-marker gl-cell-marker-hover", "aria-hidden": "true", style: { left: e.hovered[0], top: e.hovered[1] }, children: k(o) }),
    e.pinned && /* @__PURE__ */ s.jsx("div", { className: "gl-cell-marker gl-cell-marker-pinned", "aria-hidden": "true", style: { left: e.pinned[0], top: e.pinned[1] }, children: k(i) })
  ] });
}
export {
  C as CellMarker
};
