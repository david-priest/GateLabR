import { a as p, u as W, j as e, C as X } from "./embed-BNm4x7i3.js";
import { N as Y } from "./cvwDecode-CKHzN2J_.js";
import { RenderCancelled as V } from "./imageService-BucHAYme.js";
const $ = { status: "idle", result: null, error: null };
function K(l, a, d, c, m) {
  const [u, x] = p.useState($);
  return p.useEffect(() => {
    if (!l || a === null || d === null || !c) {
      x($);
      return;
    }
    const y = l.cached(a, d, c);
    if (y) {
      x({ status: y.kind === "image" ? "ready" : "none", result: y, error: null });
      return;
    }
    x((h) => h.status === "ready" ? h : { status: "loading", result: null, error: null });
    const I = l.render(a, d, c, m);
    let f = !0;
    return I.promise.then(
      (h) => {
        f && x({ status: h.kind === "image" ? "ready" : "none", result: h, error: null });
      },
      (h) => {
        !f || h instanceof V || x({ status: "error", result: null, error: h instanceof Error ? h.message : String(h) });
      }
    ), () => {
      f = !1, I.cancel();
    };
  }, [l, a, d, c, m]), u;
}
function A(l, a) {
  if (l)
    return a != null && a.mask ? { slot: a.mask.slot, fraction: a.mask.fraction } : {};
}
const ee = 512, te = 112;
function L(l, a, d, c) {
  l.width = Math.max(1, Math.round(d)), l.height = Math.max(1, Math.round(c));
  const m = l.getContext("2d");
  if (!m) return;
  if (m.imageSmoothingEnabled = !0, m.imageSmoothingQuality = "high", a.bitmap) {
    m.drawImage(a.bitmap, 0, 0, l.width, l.height);
    return;
  }
  if (!a.pixels) return;
  const u = document.createElement("canvas");
  u.width = a.width, u.height = a.height;
  const x = u.getContext("2d");
  x && (x.putImageData(new ImageData(a.pixels, a.width, a.height), 0, 0), m.drawImage(u, 0, 0, l.width, l.height));
}
const le = (l) => Number.isFinite(l) ? Math.abs(l) >= 1e3 ? Math.round(l).toLocaleString() : Math.abs(l) >= 10 ? l.toFixed(1) : l.toFixed(3) : "–";
function G(l, a) {
  const d = [];
  return l.channels.forEach((c, m) => {
    if (!l.isImagingFeatureChannel(m)) return;
    const u = l.fcs.columns[c.columnIndex];
    d.push({ name: c.label ?? c.key, value: u ? Number(u[a]) : NaN });
  }), d;
}
function ne({
  service: l,
  hoverStore: a,
  pinned: d,
  resolveEntry: c,
  view: m,
  onViewChange: u,
  onUnpin: x,
  objectCountOf: y,
  cellClassOf: I,
  collapsed: f,
  onToggleCollapsed: h,
  dock: M,
  onToggleDock: O,
  onAddToLayout: R
}) {
  var T, z;
  const { t: s } = W(), Q = p.useSyncExternalStore(a.subscribe, a.get, a.get), o = d ?? Q, n = p.useMemo(() => o ? c(o.sampleId) : null, [o, c]), j = (n == null ? void 0 : n.images) ?? null, b = n ? m[n.id] : void 0, g = (b == null ? void 0 : b.display) ?? (j == null ? void 0 : j.display) ?? null, k = (b == null ? void 0 : b.exposure) ?? 1, S = (b == null ? void 0 : b.outline) ?? !1, [w, v] = p.useState(null);
  p.useEffect(() => {
    if (!l || !n || !j) return;
    const t = l.knownInfo(n.id);
    if (t) {
      v({ id: n.id, info: t, error: null });
      return;
    }
    let i = !0;
    return l.info(n.id).then(
      (N) => {
        i && v({ id: n.id, info: N, error: null });
      },
      (N) => {
        i && v({ id: n.id, info: null, error: N instanceof Error ? N.message : String(N) });
      }
    ), () => {
      i = !1;
    };
  }, [l, n, j]);
  const C = w && n && w.id === n.id ? ((T = w.info) == null ? void 0 : T.scale) ?? null : null, F = w && n && w.id === n.id ? w.error : null, U = p.useMemo(() => {
    if (!g || !C) return null;
    const t = A(S, j);
    return { display: g, scale: C, exposure: k, hop: Y, composite: !0, channels: g.map((i) => i.slot), ...t ? { outline: t } : {} };
  }, [g, C, k, S, j]), E = K(l, j && n && !f ? n.id : null, (o == null ? void 0 : o.eventIndex) ?? null, U, "interactive"), r = ((z = E.result) == null ? void 0 : z.kind) === "image" ? E.result.image : null, P = p.useMemo(() => n && o ? G(n.sample, o.eventIndex) : [], [n, o]), H = p.useRef(null), _ = p.useRef(/* @__PURE__ */ new Map());
  p.useEffect(() => {
    if (!r) return;
    const t = ee / r.rows;
    H.current && r.composite && L(H.current, r.composite, r.cols * r.aspect * t, r.rows * t);
    const i = te / r.rows;
    for (const [N, J] of Object.entries(r.channels)) {
      const D = _.current.get(Number(N));
      D && L(D, J, r.cols * r.aspect * i, r.rows * i);
    }
  }, [r]);
  const Z = (t) => {
    !n || !g || u(n.id, { display: g.map((i) => i.slot === t ? { ...i, enabled: !i.enabled } : i), exposure: k, outline: S });
  }, q = (t) => {
    !n || !g || u(n.id, { display: g.slice(), exposure: t, outline: S });
  }, B = (t) => {
    !n || !g || u(n.id, { display: g.slice(), exposure: k, outline: t });
  };
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-side-section gl-cell-inspector" + (f ? " gl-side-collapsed gl-cell-inspector-collapsed" : "") + (M === "column" ? " gl-cell-inspector-column" : ""),
      "aria-label": s("Cell"),
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-side-head gl-cell-inspector-head", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "gl-side-disclosure",
              "aria-expanded": !f,
              title: s(f ? "Show the cell panel" : "Hide the cell panel"),
              onClick: h,
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "gl-side-disclosure-mark", "aria-hidden": "true", children: /* @__PURE__ */ e.jsx(X, { open: !f, size: 12 }) }),
                /* @__PURE__ */ e.jsx("span", { className: "gl-side-title", children: s("Cell") })
              ]
            }
          ),
          d ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsx("span", { className: "gl-cell-status gl-cell-status-pinned", children: s("Pinned") }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: x, children: s("Unpin") })
          ] }) : /* @__PURE__ */ e.jsx("span", { className: "gl-cell-status", children: s("Nearest imaged cell") }),
          /* @__PURE__ */ e.jsx(
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
        f ? null : !n || !o ? /* @__PURE__ */ e.jsx("div", { className: "gl-hint", children: s("Hover a dot to see its cell; click to pin it, Escape to unpin.") }) : j ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-cell-event", title: s("Event {index} of {name}", { index: o.eventIndex.toLocaleString(), name: n.name }), children: [
            /* @__PURE__ */ e.jsx("span", { className: "gl-cell-event-name", children: s("Event {index} of {name}", { index: o.eventIndex.toLocaleString(), name: n.name }) }),
            (() => {
              const t = (y == null ? void 0 : y(o)) ?? null;
              return t === null ? null : /* @__PURE__ */ e.jsx("span", { className: "gl-cell-objects", children: s("{count} objects", { count: t }) });
            })(),
            (() => {
              const t = (I == null ? void 0 : I(o)) ?? null;
              if (t === null) return null;
              const i = t.reasons.map((N) => s(N)).join(", ");
              return /* @__PURE__ */ e.jsx("span", { className: "gl-cell-class", title: i ? `${s(t.label)}: ${i}` : s(t.label), children: s(t.label) });
            })()
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "gl-cell-note" + (F || E.status === "error" ? " gl-cell-note-error" : ""), children: F || (E.status === "none" ? s("No image for this event") : E.status === "error" ? E.error : E.status === "loading" && !r ? s("Loading the image…") : "") }),
          /* @__PURE__ */ e.jsx("div", { className: "gl-cell-composite", style: { visibility: r ? "visible" : "hidden" }, children: /* @__PURE__ */ e.jsx("canvas", { ref: H }) }),
          g && /* @__PURE__ */ e.jsx("div", { className: "gl-cell-tiles", children: g.map((t) => /* @__PURE__ */ e.jsxs("label", { className: "gl-cell-tile" + (t.enabled ? "" : " gl-cell-tile-off"), title: t.name, children: [
            /* @__PURE__ */ e.jsx("span", { className: "gl-cell-tile-picture", children: /* @__PURE__ */ e.jsx("canvas", { ref: (i) => {
              i ? _.current.set(t.slot, i) : _.current.delete(t.slot);
            } }) }),
            /* @__PURE__ */ e.jsxs("span", { className: "gl-cell-tile-name", children: [
              /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: t.enabled, onChange: () => Z(t.slot) }),
              /* @__PURE__ */ e.jsx("span", { className: "gl-cell-chip", style: { background: t.colour } }),
              t.name
            ] })
          ] }, t.slot)) }),
          /* @__PURE__ */ e.jsxs("label", { className: "gl-cell-exposure", children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Exposure") }),
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "range",
                min: -2,
                max: 2,
                step: 0.05,
                value: Math.log2(k),
                onChange: (t) => q(Math.pow(2, Number(t.target.value)))
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { className: "gl-cell-exposure-value", children: [
              k.toFixed(2),
              "×"
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-cell-actions", children: [
            /* @__PURE__ */ e.jsxs("label", { className: "gl-cell-outline", title: s("Outline the objects the count found on the mask image, in magenta"), children: [
              /* @__PURE__ */ e.jsx("input", { type: "checkbox", checked: S, onChange: (t) => B(t.target.checked) }),
              /* @__PURE__ */ e.jsx("span", { children: s("Mask outline") })
            ] }),
            R && /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn gl-cell-add-layout",
                title: s("Add this cell to a cell panel on the Layout tab: the last one made for this file, or a new one"),
                onClick: () => R(o),
                children: s("Add to a cell panel")
              }
            )
          ] }),
          P.length > 0 && /* @__PURE__ */ e.jsxs("details", { className: "gl-cell-features", children: [
            /* @__PURE__ */ e.jsx("summary", { children: s("Image features") }),
            /* @__PURE__ */ e.jsx("dl", { children: P.map((t) => /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { title: t.name, children: t.name }),
              /* @__PURE__ */ e.jsx("dd", { children: le(t.value) })
            ] }, t.name)) })
          ] })
        ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-hint", children: s("No cell images are attached to {name}", { name: n.name }) })
      ]
    }
  );
}
const oe = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CellInspector: ne,
  drawPicture: L,
  imagingFeaturesOf: G,
  outlineSpecOf: A
}, Symbol.toStringTag, { value: "Module" }));
export {
  oe as C,
  L as d,
  A as o,
  K as u
};
