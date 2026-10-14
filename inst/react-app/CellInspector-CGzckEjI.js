import { a as p, u as J, j as t } from "./embed-v78cfaSj.js";
import { N as W } from "./cvwDecode-CKHzN2J_.js";
import { RenderCancelled as X } from "./imageService-BE_5PwLf.js";
const $ = { status: "idle", result: null, error: null };
function Y(l, i, d, c, m) {
  const [u, x] = p.useState($);
  return p.useEffect(() => {
    if (!l || i === null || d === null || !c) {
      x($);
      return;
    }
    const E = l.cached(i, d, c);
    if (E) {
      x({ status: E.kind === "image" ? "ready" : "none", result: E, error: null });
      return;
    }
    x((h) => h.status === "ready" ? h : { status: "loading", result: null, error: null });
    const k = l.render(i, d, c, m);
    let f = !0;
    return k.promise.then(
      (h) => {
        f && x({ status: h.kind === "image" ? "ready" : "none", result: h, error: null });
      },
      (h) => {
        !f || h instanceof X || x({ status: "error", result: null, error: h instanceof Error ? h.message : String(h) });
      }
    ), () => {
      f = !1, k.cancel();
    };
  }, [l, i, d, c, m]), u;
}
function z(l, i) {
  if (l)
    return i != null && i.mask ? { slot: i.mask.slot, fraction: i.mask.fraction } : {};
}
const V = 512, K = 112;
function L(l, i, d, c) {
  l.width = Math.max(1, Math.round(d)), l.height = Math.max(1, Math.round(c));
  const m = l.getContext("2d");
  if (!m) return;
  if (m.imageSmoothingEnabled = !0, m.imageSmoothingQuality = "high", i.bitmap) {
    m.drawImage(i.bitmap, 0, 0, l.width, l.height);
    return;
  }
  if (!i.pixels) return;
  const u = document.createElement("canvas");
  u.width = i.width, u.height = i.height;
  const x = u.getContext("2d");
  x && (x.putImageData(new ImageData(i.pixels, i.width, i.height), 0, 0), m.drawImage(u, 0, 0, l.width, l.height));
}
const ee = (l) => Number.isFinite(l) ? Math.abs(l) >= 1e3 ? Math.round(l).toLocaleString() : Math.abs(l) >= 10 ? l.toFixed(1) : l.toFixed(3) : "–";
function G(l, i) {
  const d = [];
  return l.channels.forEach((c, m) => {
    if (!l.isImagingFeatureChannel(m)) return;
    const u = l.fcs.columns[c.columnIndex];
    d.push({ name: c.label ?? c.key, value: u ? Number(u[i]) : NaN });
  }), d;
}
function te({
  service: l,
  hoverStore: i,
  pinned: d,
  resolveEntry: c,
  view: m,
  onViewChange: u,
  onUnpin: x,
  objectCountOf: E,
  cellClassOf: k,
  collapsed: f,
  onToggleCollapsed: h,
  dock: M,
  onToggleDock: O
}) {
  var T, P;
  const { t: s } = J(), A = p.useSyncExternalStore(i.subscribe, i.get, i.get), r = d ?? A, n = p.useMemo(() => r ? c(r.sampleId) : null, [r, c]), j = (n == null ? void 0 : n.images) ?? null, b = n ? m[n.id] : void 0, g = (b == null ? void 0 : b.display) ?? (j == null ? void 0 : j.display) ?? null, w = (b == null ? void 0 : b.exposure) ?? 1, S = (b == null ? void 0 : b.outline) ?? !1, [y, v] = p.useState(null);
  p.useEffect(() => {
    if (!l || !n || !j) return;
    const e = l.knownInfo(n.id);
    if (e) {
      v({ id: n.id, info: e, error: null });
      return;
    }
    let a = !0;
    return l.info(n.id).then(
      (N) => {
        a && v({ id: n.id, info: N, error: null });
      },
      (N) => {
        a && v({ id: n.id, info: null, error: N instanceof Error ? N.message : String(N) });
      }
    ), () => {
      a = !1;
    };
  }, [l, n, j]);
  const F = y && n && y.id === n.id ? ((T = y.info) == null ? void 0 : T.scale) ?? null : null, C = y && n && y.id === n.id ? y.error : null, Q = p.useMemo(() => {
    if (!g || !F) return null;
    const e = z(S, j);
    return { display: g, scale: F, exposure: w, hop: W, composite: !0, channels: g.map((a) => a.slot), ...e ? { outline: e } : {} };
  }, [g, F, w, S, j]), I = Y(l, j && n && !f ? n.id : null, (r == null ? void 0 : r.eventIndex) ?? null, Q, "interactive"), o = ((P = I.result) == null ? void 0 : P.kind) === "image" ? I.result.image : null, R = p.useMemo(() => n && r ? G(n.sample, r.eventIndex) : [], [n, r]), H = p.useRef(null), _ = p.useRef(/* @__PURE__ */ new Map());
  p.useEffect(() => {
    if (!o) return;
    const e = V / o.rows;
    H.current && o.composite && L(H.current, o.composite, o.cols * o.aspect * e, o.rows * e);
    const a = K / o.rows;
    for (const [N, B] of Object.entries(o.channels)) {
      const D = _.current.get(Number(N));
      D && L(D, B, o.cols * o.aspect * a, o.rows * a);
    }
  }, [o]);
  const U = (e) => {
    !n || !g || u(n.id, { display: g.map((a) => a.slot === e ? { ...a, enabled: !a.enabled } : a), exposure: w, outline: S });
  }, Z = (e) => {
    !n || !g || u(n.id, { display: g.slice(), exposure: e, outline: S });
  }, q = (e) => {
    !n || !g || u(n.id, { display: g.slice(), exposure: w, outline: e });
  };
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      className: "gl-side-section gl-cell-inspector" + (f ? " gl-side-collapsed gl-cell-inspector-collapsed" : "") + (M === "column" ? " gl-cell-inspector-column" : ""),
      "aria-label": s("Cell"),
      children: [
        /* @__PURE__ */ t.jsxs("div", { className: "gl-side-head gl-cell-inspector-head", children: [
          /* @__PURE__ */ t.jsxs(
            "button",
            {
              type: "button",
              className: "gl-side-disclosure",
              "aria-expanded": !f,
              title: s(f ? "Show the cell panel" : "Hide the cell panel"),
              onClick: h,
              children: [
                /* @__PURE__ */ t.jsx("span", { className: "gl-side-disclosure-mark", "aria-hidden": "true", children: f ? "▸" : "▾" }),
                /* @__PURE__ */ t.jsx("span", { className: "gl-side-title", children: s("Cell") })
              ]
            }
          ),
          d ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx("span", { className: "gl-cell-status gl-cell-status-pinned", children: s("Pinned") }),
            /* @__PURE__ */ t.jsx("button", { type: "button", className: "gl-mini-btn", onClick: x, children: s("Unpin") })
          ] }) : /* @__PURE__ */ t.jsx("span", { className: "gl-cell-status", children: s("Nearest imaged cell") }),
          /* @__PURE__ */ t.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-cell-dock",
              title: s(M === "column" ? "Show at the bottom of the gates pane" : "Show in a column of its own"),
              "aria-label": s(M === "column" ? "Show at the bottom of the gates pane" : "Show in a column of its own"),
              onClick: O,
              children: M === "column" ? "⇥" : "⇤"
            }
          )
        ] }),
        f ? null : !n || !r ? /* @__PURE__ */ t.jsx("div", { className: "gl-hint", children: s("Hover a dot to see its cell; click to pin it, Escape to unpin.") }) : j ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
          /* @__PURE__ */ t.jsxs("div", { className: "gl-cell-event", title: s("Event {index} of {name}", { index: r.eventIndex.toLocaleString(), name: n.name }), children: [
            /* @__PURE__ */ t.jsx("span", { className: "gl-cell-event-name", children: s("Event {index} of {name}", { index: r.eventIndex.toLocaleString(), name: n.name }) }),
            (() => {
              const e = (E == null ? void 0 : E(r)) ?? null;
              return e === null ? null : /* @__PURE__ */ t.jsx("span", { className: "gl-cell-objects", children: s("{count} objects", { count: e }) });
            })(),
            (() => {
              const e = (k == null ? void 0 : k(r)) ?? null;
              if (e === null) return null;
              const a = e.reasons.map((N) => s(N)).join(", ");
              return /* @__PURE__ */ t.jsx("span", { className: "gl-cell-class", title: a ? `${s(e.label)}: ${a}` : s(e.label), children: s(e.label) });
            })()
          ] }),
          /* @__PURE__ */ t.jsx("div", { className: "gl-cell-note" + (C || I.status === "error" ? " gl-cell-note-error" : ""), children: C || (I.status === "none" ? s("No image for this event") : I.status === "error" ? I.error : I.status === "loading" && !o ? s("Loading the image…") : "") }),
          /* @__PURE__ */ t.jsx("div", { className: "gl-cell-composite", style: { visibility: o ? "visible" : "hidden" }, children: /* @__PURE__ */ t.jsx("canvas", { ref: H }) }),
          g && /* @__PURE__ */ t.jsx("div", { className: "gl-cell-tiles", children: g.map((e) => /* @__PURE__ */ t.jsxs("label", { className: "gl-cell-tile" + (e.enabled ? "" : " gl-cell-tile-off"), title: e.name, children: [
            /* @__PURE__ */ t.jsx("span", { className: "gl-cell-tile-picture", children: /* @__PURE__ */ t.jsx("canvas", { ref: (a) => {
              a ? _.current.set(e.slot, a) : _.current.delete(e.slot);
            } }) }),
            /* @__PURE__ */ t.jsxs("span", { className: "gl-cell-tile-name", children: [
              /* @__PURE__ */ t.jsx("input", { type: "checkbox", checked: e.enabled, onChange: () => U(e.slot) }),
              /* @__PURE__ */ t.jsx("span", { className: "gl-cell-chip", style: { background: e.colour } }),
              e.name
            ] })
          ] }, e.slot)) }),
          /* @__PURE__ */ t.jsxs("label", { className: "gl-cell-exposure", children: [
            /* @__PURE__ */ t.jsx("span", { children: s("Exposure") }),
            /* @__PURE__ */ t.jsx(
              "input",
              {
                type: "range",
                min: -2,
                max: 2,
                step: 0.05,
                value: Math.log2(w),
                onChange: (e) => Z(Math.pow(2, Number(e.target.value)))
              }
            ),
            /* @__PURE__ */ t.jsxs("span", { className: "gl-cell-exposure-value", children: [
              w.toFixed(2),
              "×"
            ] })
          ] }),
          /* @__PURE__ */ t.jsxs("label", { className: "gl-cell-outline", title: s("Outline the objects the count found on the mask image, in magenta"), children: [
            /* @__PURE__ */ t.jsx("input", { type: "checkbox", checked: S, onChange: (e) => q(e.target.checked) }),
            /* @__PURE__ */ t.jsx("span", { children: s("Mask outline") })
          ] }),
          R.length > 0 && /* @__PURE__ */ t.jsxs("details", { className: "gl-cell-features", children: [
            /* @__PURE__ */ t.jsx("summary", { children: s("Image features") }),
            /* @__PURE__ */ t.jsx("dl", { children: R.map((e) => /* @__PURE__ */ t.jsxs("div", { children: [
              /* @__PURE__ */ t.jsx("dt", { title: e.name, children: e.name }),
              /* @__PURE__ */ t.jsx("dd", { children: ee(e.value) })
            ] }, e.name)) })
          ] })
        ] }) : /* @__PURE__ */ t.jsx("div", { className: "gl-hint", children: s("No cell images are attached to {name}", { name: n.name }) })
      ]
    }
  );
}
const ie = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CellInspector: te,
  drawPicture: L,
  imagingFeaturesOf: G,
  outlineSpecOf: z
}, Symbol.toStringTag, { value: "Module" }));
export {
  ie as C,
  L as d,
  z as o,
  Y as u
};
