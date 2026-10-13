import { a as g, u as q, j as t } from "./embed-Divj10u8.js";
import { RenderCancelled as B } from "./imageService-B3RCoJFT.js";
const J = 256, O = 64, w = J, D = 8, X = new Uint16Array(w);
for (let e = 0; e < w; e++) {
  let n = 0;
  for (let i = 0; i < D; i++) n |= (e >> i & 1) << D - 1 - i;
  X[e] = n;
}
const Y = new Float32Array(w / 2), K = new Float32Array(w / 2);
for (let e = 0; e < w / 2; e++)
  Y[e] = Math.cos(-2 * Math.PI * e / w), K[e] = Math.sin(-2 * Math.PI * e / w);
const G = { status: "idle", result: null, error: null };
function ee(e, n, i, c, d) {
  const [m, x] = g.useState(G);
  return g.useEffect(() => {
    if (!e || n === null || i === null || !c) {
      x(G);
      return;
    }
    const b = e.cached(n, i, c);
    if (b) {
      x({ status: b.kind === "image" ? "ready" : "none", result: b, error: null });
      return;
    }
    x((h) => h.status === "ready" ? h : { status: "loading", result: null, error: null });
    const E = e.render(n, i, c, d);
    let p = !0;
    return E.promise.then(
      (h) => {
        p && x({ status: h.kind === "image" ? "ready" : "none", result: h, error: null });
      },
      (h) => {
        !p || h instanceof B || x({ status: "error", result: null, error: h instanceof Error ? h.message : String(h) });
      }
    ), () => {
      p = !1, E.cancel();
    };
  }, [e, n, i, c, d]), m;
}
const te = 512, se = 112;
function T(e, n, i, c) {
  e.width = Math.max(1, Math.round(i)), e.height = Math.max(1, Math.round(c));
  const d = e.getContext("2d");
  if (!d) return;
  if (d.imageSmoothingEnabled = !0, d.imageSmoothingQuality = "high", n.bitmap) {
    d.drawImage(n.bitmap, 0, 0, e.width, e.height);
    return;
  }
  if (!n.pixels) return;
  const m = document.createElement("canvas");
  m.width = n.width, m.height = n.height;
  const x = m.getContext("2d");
  x && (x.putImageData(new ImageData(n.pixels, n.width, n.height), 0, 0), d.drawImage(m, 0, 0, e.width, e.height));
}
const le = (e) => Number.isFinite(e) ? Math.abs(e) >= 1e3 ? Math.round(e).toLocaleString() : Math.abs(e) >= 10 ? e.toFixed(1) : e.toFixed(3) : "–";
function z(e, n) {
  const i = [];
  return e.channels.forEach((c, d) => {
    if (!e.isImagingFeatureChannel(d)) return;
    const m = e.fcs.columns[c.columnIndex];
    i.push({ name: c.label ?? c.key, value: m ? Number(m[n]) : NaN });
  }), i;
}
function ne({
  service: e,
  hoverStore: n,
  pinned: i,
  resolveEntry: c,
  view: d,
  onViewChange: m,
  onUnpin: x,
  objectCountOf: b,
  cellClassOf: E,
  collapsed: p,
  onToggleCollapsed: h,
  dock: k,
  onToggleDock: U
}) {
  var P, L;
  const { t: a } = q(), $ = g.useSyncExternalStore(n.subscribe, n.get, n.get), u = i ?? $, l = g.useMemo(() => u ? c(u.sampleId) : null, [u, c]), N = (l == null ? void 0 : l.images) ?? null, I = l ? d[l.id] : void 0, f = (I == null ? void 0 : I.display) ?? (N == null ? void 0 : N.display) ?? null, S = (I == null ? void 0 : I.exposure) ?? 1, [y, v] = g.useState(null);
  g.useEffect(() => {
    if (!e || !l || !N) return;
    const s = e.knownInfo(l.id);
    if (s) {
      v({ id: l.id, info: s, error: null });
      return;
    }
    let r = !0;
    return e.info(l.id).then(
      (j) => {
        r && v({ id: l.id, info: j, error: null });
      },
      (j) => {
        r && v({ id: l.id, info: null, error: j instanceof Error ? j.message : String(j) });
      }
    ), () => {
      r = !1;
    };
  }, [e, l, N]);
  const F = y && l && y.id === l.id ? ((P = y.info) == null ? void 0 : P.scale) ?? null : null, _ = y && l && y.id === l.id ? y.error : null, Q = g.useMemo(() => !f || !F ? null : { display: f, scale: F, exposure: S, hop: O, composite: !0, channels: f.map((s) => s.slot) }, [f, F, S]), M = ee(e, N && l && !p ? l.id : null, (u == null ? void 0 : u.eventIndex) ?? null, Q, "interactive"), o = ((L = M.result) == null ? void 0 : L.kind) === "image" ? M.result.image : null, H = g.useMemo(() => l && u ? z(l.sample, u.eventIndex) : [], [l, u]), C = g.useRef(null), R = g.useRef(/* @__PURE__ */ new Map());
  g.useEffect(() => {
    if (!o) return;
    const s = te / o.rows;
    C.current && o.composite && T(C.current, o.composite, o.cols * o.aspect * s, o.rows * s);
    const r = se / o.rows;
    for (const [j, Z] of Object.entries(o.channels)) {
      const A = R.current.get(Number(j));
      A && T(A, Z, o.cols * o.aspect * r, o.rows * r);
    }
  }, [o]);
  const V = (s) => {
    !l || !f || m(l.id, { display: f.map((r) => r.slot === s ? { ...r, enabled: !r.enabled } : r), exposure: S });
  }, W = (s) => {
    !l || !f || m(l.id, { display: f.slice(), exposure: s });
  };
  return /* @__PURE__ */ t.jsxs(
    "div",
    {
      className: "gl-side-section gl-cell-inspector" + (p ? " gl-side-collapsed gl-cell-inspector-collapsed" : "") + (k === "column" ? " gl-cell-inspector-column" : ""),
      "aria-label": a("Cell"),
      children: [
        /* @__PURE__ */ t.jsxs("div", { className: "gl-side-head gl-cell-inspector-head", children: [
          /* @__PURE__ */ t.jsxs(
            "button",
            {
              type: "button",
              className: "gl-side-disclosure",
              "aria-expanded": !p,
              title: a(p ? "Show the cell panel" : "Hide the cell panel"),
              onClick: h,
              children: [
                /* @__PURE__ */ t.jsx("span", { className: "gl-side-disclosure-mark", "aria-hidden": "true", children: p ? "▸" : "▾" }),
                /* @__PURE__ */ t.jsx("span", { className: "gl-side-title", children: a("Cell") })
              ]
            }
          ),
          i ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
            /* @__PURE__ */ t.jsx("span", { className: "gl-cell-status gl-cell-status-pinned", children: a("Pinned") }),
            /* @__PURE__ */ t.jsx("button", { type: "button", className: "gl-mini-btn", onClick: x, children: a("Unpin") })
          ] }) : /* @__PURE__ */ t.jsx("span", { className: "gl-cell-status", children: a("Nearest imaged cell") }),
          /* @__PURE__ */ t.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-cell-dock",
              title: a(k === "column" ? "Show at the bottom of the gates pane" : "Show in a column of its own"),
              "aria-label": a(k === "column" ? "Show at the bottom of the gates pane" : "Show in a column of its own"),
              onClick: U,
              children: k === "column" ? "⇥" : "⇤"
            }
          )
        ] }),
        p ? null : !l || !u ? /* @__PURE__ */ t.jsx("div", { className: "gl-hint", children: a("Hover a dot to see its cell; click to pin it, Escape to unpin.") }) : N ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
          /* @__PURE__ */ t.jsxs("div", { className: "gl-cell-event", children: [
            a("Event {index} of {name}", { index: u.eventIndex.toLocaleString(), name: l.name }),
            (() => {
              const s = (b == null ? void 0 : b(u)) ?? null;
              return s === null ? null : /* @__PURE__ */ t.jsx("span", { className: "gl-cell-objects", children: a("{count} objects", { count: s }) });
            })(),
            (() => {
              const s = (E == null ? void 0 : E(u)) ?? null;
              if (s === null) return null;
              const r = s.reasons.length > 0 ? `: ${s.reasons.map((j) => a(j)).join(", ")}` : "";
              return /* @__PURE__ */ t.jsxs("span", { className: "gl-cell-class", children: [
                a(s.label),
                r
              ] });
            })()
          ] }),
          _ && /* @__PURE__ */ t.jsx("div", { className: "gl-error-inline", children: _ }),
          M.status === "none" && /* @__PURE__ */ t.jsx("div", { className: "gl-hint", children: a("No image for this event") }),
          M.status === "error" && /* @__PURE__ */ t.jsx("div", { className: "gl-error-inline", children: M.error }),
          M.status === "loading" && !o && /* @__PURE__ */ t.jsx("div", { className: "gl-hint", children: a("Loading the image…") }),
          /* @__PURE__ */ t.jsx("div", { className: "gl-cell-composite", style: { visibility: o ? "visible" : "hidden" }, children: /* @__PURE__ */ t.jsx("canvas", { ref: C }) }),
          f && /* @__PURE__ */ t.jsx("div", { className: "gl-cell-tiles", children: f.map((s) => /* @__PURE__ */ t.jsxs("label", { className: "gl-cell-tile" + (s.enabled ? "" : " gl-cell-tile-off"), title: s.name, children: [
            /* @__PURE__ */ t.jsx("span", { className: "gl-cell-tile-picture", children: /* @__PURE__ */ t.jsx("canvas", { ref: (r) => {
              r ? R.current.set(s.slot, r) : R.current.delete(s.slot);
            } }) }),
            /* @__PURE__ */ t.jsxs("span", { className: "gl-cell-tile-name", children: [
              /* @__PURE__ */ t.jsx("input", { type: "checkbox", checked: s.enabled, onChange: () => V(s.slot) }),
              /* @__PURE__ */ t.jsx("span", { className: "gl-cell-chip", style: { background: s.colour } }),
              s.name
            ] })
          ] }, s.slot)) }),
          /* @__PURE__ */ t.jsxs("label", { className: "gl-cell-exposure", children: [
            /* @__PURE__ */ t.jsx("span", { children: a("Exposure") }),
            /* @__PURE__ */ t.jsx(
              "input",
              {
                type: "range",
                min: -2,
                max: 2,
                step: 0.05,
                value: Math.log2(S),
                onChange: (s) => W(Math.pow(2, Number(s.target.value)))
              }
            ),
            /* @__PURE__ */ t.jsxs("span", { className: "gl-cell-exposure-value", children: [
              S.toFixed(2),
              "×"
            ] })
          ] }),
          H.length > 0 && /* @__PURE__ */ t.jsxs("details", { className: "gl-cell-features", children: [
            /* @__PURE__ */ t.jsx("summary", { children: a("Image features") }),
            /* @__PURE__ */ t.jsx("dl", { children: H.map((s) => /* @__PURE__ */ t.jsxs("div", { children: [
              /* @__PURE__ */ t.jsx("dt", { title: s.name, children: s.name }),
              /* @__PURE__ */ t.jsx("dd", { children: le(s.value) })
            ] }, s.name)) })
          ] })
        ] }) : /* @__PURE__ */ t.jsx("div", { className: "gl-hint", children: a("No cell images are attached to {name}", { name: l.name }) })
      ]
    }
  );
}
const re = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CellInspector: ne,
  drawPicture: T,
  imagingFeaturesOf: z
}, Symbol.toStringTag, { value: "Module" }));
export {
  re as C,
  O as N,
  T as d,
  ee as u
};
