import { a as m, u as le, b as O, j as s } from "./embed-Divj10u8.js";
import { N as te, u as oe, d as ne } from "./CellInspector-Da4_gj91.js";
const z = 4, $ = 2, ae = te;
function ie({ service: r, fileKey: u, sampleId: l, eventIndex: d, spec: R, size: c, pinned: I, onPin: f, onOpen: L, label: M }) {
  var h;
  const i = oe(r, u, d, R, "batch"), n = ((h = i.result) == null ? void 0 : h.kind) === "image" ? i.result.image : null, S = m.useRef(null);
  return m.useEffect(() => {
    if (!(n != null && n.composite) || !S.current) return;
    const k = n.cols * n.aspect, x = Math.min(c / k, c / n.rows);
    ne(S.current, n.composite, k * x, n.rows * x);
  }, [n, c]), /* @__PURE__ */ s.jsxs(
    "button",
    {
      type: "button",
      role: "gridcell",
      className: "gl-wall-tile" + (I ? " gl-wall-tile-pinned" : ""),
      style: { width: c, height: c },
      title: M,
      "aria-label": M,
      "aria-selected": I,
      onClick: () => f({ sampleId: l, eventIndex: d }),
      onDoubleClick: L,
      children: [
        n ? /* @__PURE__ */ s.jsx("canvas", { ref: S }) : /* @__PURE__ */ s.jsx("span", { className: "gl-wall-tile-empty", children: i.status === "none" ? "·" : "" }),
        /* @__PURE__ */ s.jsx("span", { className: "gl-wall-tile-index", children: d.toLocaleString() })
      ]
    }
  );
}
function ce({
  visible: r,
  service: u,
  entry: l,
  mask: d,
  populationLabel: R,
  view: c,
  onViewChange: I,
  pinned: f,
  onPin: L,
  onShowOnPlot: M
}) {
  const { t: i } = le(), [n, S] = O("images.sortKey", ""), [h, k] = O("images.sortDesc", !1), [x, B] = O("images.tileSize", 72), j = (l == null ? void 0 : l.images) ?? null, g = (c == null ? void 0 : c.display) ?? (j == null ? void 0 : j.display) ?? null, v = (c == null ? void 0 : c.exposure) ?? 1, [b, P] = m.useState(null);
  m.useEffect(() => {
    if (!u || !l || !j || !r) return;
    const e = u.knownInfo(l.id);
    if (e) {
      P({ id: l.id, info: e, error: null });
      return;
    }
    let o = !0;
    return u.info(l.id).then(
      (t) => {
        o && P({ id: l.id, info: t, error: null });
      },
      (t) => {
        o && P({ id: l.id, info: null, error: t instanceof Error ? t.message : String(t) });
      }
    ), () => {
      o = !1;
    };
  }, [u, l, j, r]);
  const w = b && l && b.id === l.id ? b.info : null, H = b && l && b.id === l.id ? b.error : null, G = m.useMemo(() => !g || !w ? null : { display: g, scale: w.scale, exposure: v, hop: ae, composite: !0, channels: [] }, [g, w, v]), { events: y, inPopulation: J } = m.useMemo(() => {
    if (!l || !w) return { events: new Int32Array(0), inPopulation: 0 };
    const e = l.sample.fcs.nEvents, o = w.hasImage;
    let t = 0, E = 0;
    for (let a = 0; a < e; a++)
      d && !d[a] || (t++, o[a] && E++);
    const p = new Int32Array(E);
    let C = 0;
    for (let a = 0; a < e; a++)
      d && !d[a] || o[a] && (p[C++] = a);
    const F = n ? l.sample.channels.findIndex((a) => a.key === n) : -1;
    if (F >= 0) {
      const a = l.sample.displayColumn(F), se = h ? -1 : 1;
      p.sort((U, V) => se * (a[U] - a[V]) || U - V);
    } else h && p.reverse();
    return { events: p, inPopulation: t };
  }, [l, w, d, n, h]), D = m.useRef(null), [A, Q] = m.useState({ width: 0, height: 0, scrollTop: 0 });
  m.useEffect(() => {
    const e = D.current;
    if (!e || !r) return;
    const o = () => Q({ width: e.clientWidth, height: e.clientHeight, scrollTop: e.scrollTop });
    o();
    const t = typeof ResizeObserver == "function" ? new ResizeObserver(o) : null;
    return t == null || t.observe(e), e.addEventListener("scroll", o, { passive: !0 }), () => {
      t == null || t.disconnect(), e.removeEventListener("scroll", o);
    };
  }, [r]);
  const T = x + z, N = Math.max(1, Math.floor((A.width + z) / T)), K = Math.ceil(y.length / N), _ = Math.max(0, Math.floor(A.scrollTop / T) - $), W = Math.min(K, Math.ceil((A.scrollTop + A.height) / T) + $), q = _ * N, X = Math.min(y.length, W * N), Y = (e, o) => {
    var C;
    const t = [...((C = D.current) == null ? void 0 : C.querySelectorAll(".gl-wall-tile")) ?? []], E = t.indexOf(e);
    if (E < 0) return;
    const p = t[Math.max(0, Math.min(t.length - 1, E + o))];
    p == null || p.focus();
  }, Z = (e) => {
    const o = e.target;
    if (!o.classList.contains("gl-wall-tile")) return;
    const t = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "ArrowDown" ? N : e.key === "ArrowUp" ? -N : null;
    t !== null && (e.preventDefault(), Y(o, t));
  };
  if (!r) return /* @__PURE__ */ s.jsx("div", { style: { display: "none" } });
  const ee = (e) => {
    !l || !g || I(l.id, { display: g.map((o) => o.slot === e ? { ...o, enabled: !o.enabled } : o), exposure: v });
  };
  return /* @__PURE__ */ s.jsx("section", { className: "gl-tab-panel gl-tab-fill gl-images-tab", "aria-label": i("Images"), children: !l || !j ? /* @__PURE__ */ s.jsx("div", { className: "gl-empty", children: i("No cell images are attached to the viewed file. Attach a .cvw from the Import menu.") }) : /* @__PURE__ */ s.jsxs(s.Fragment, { children: [
    /* @__PURE__ */ s.jsxs("div", { className: "gl-images-toolbar", children: [
      /* @__PURE__ */ s.jsx("span", { className: "gl-images-count", children: i("{count} cells in {population} · {shown} with images", {
        count: J.toLocaleString(),
        population: R,
        shown: y.length.toLocaleString()
      }) }),
      /* @__PURE__ */ s.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ s.jsx("span", { children: i("Sort by") }),
        /* @__PURE__ */ s.jsxs("select", { value: n, onChange: (e) => S(e.target.value), children: [
          /* @__PURE__ */ s.jsx("option", { value: "", children: i("Event order") }),
          l.sample.channels.map((e) => /* @__PURE__ */ s.jsx("option", { value: e.key, children: e.label ?? e.key }, e.key))
        ] }),
        /* @__PURE__ */ s.jsx("button", { type: "button", className: "gl-mini-btn", "aria-pressed": h, onClick: () => k((e) => !e), title: i("Reverse the order"), children: h ? "↓" : "↑" })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ s.jsx("span", { children: i("Tile size") }),
        /* @__PURE__ */ s.jsx("input", { type: "range", min: 40, max: 160, step: 8, value: x, onChange: (e) => B(Number(e.target.value)) })
      ] }),
      /* @__PURE__ */ s.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ s.jsx("span", { children: i("Exposure") }),
        /* @__PURE__ */ s.jsx(
          "input",
          {
            type: "range",
            min: -2,
            max: 2,
            step: 0.05,
            value: Math.log2(v),
            onChange: (e) => {
              g && I(l.id, { display: g.slice(), exposure: Math.pow(2, Number(e.target.value)) });
            }
          }
        )
      ] }),
      g && /* @__PURE__ */ s.jsx("span", { className: "gl-images-channels", children: g.map((e) => /* @__PURE__ */ s.jsxs("label", { className: "gl-images-channel", title: e.name, children: [
        /* @__PURE__ */ s.jsx("input", { type: "checkbox", checked: e.enabled, onChange: () => ee(e.slot) }),
        /* @__PURE__ */ s.jsx("span", { className: "gl-cell-chip", style: { background: e.colour } }),
        e.name
      ] }, e.slot)) }),
      /* @__PURE__ */ s.jsx("button", { type: "button", className: "gl-mini-btn", disabled: !f, onClick: M, children: i("Show on plot") })
    ] }),
    H && /* @__PURE__ */ s.jsx("div", { className: "gl-error-inline", children: H }),
    /* @__PURE__ */ s.jsxs("div", { className: "gl-images-scroll", ref: D, role: "grid", "aria-rowcount": K, onKeyDown: Z, children: [
      /* @__PURE__ */ s.jsx("div", { style: { height: _ * T } }),
      /* @__PURE__ */ s.jsx("div", { className: "gl-images-grid", style: { gridTemplateColumns: `repeat(${N}, ${x}px)`, gap: z }, children: Array.from({ length: Math.max(0, X - q) }, (e, o) => {
        const t = y[q + o];
        return /* @__PURE__ */ s.jsx(
          ie,
          {
            service: u,
            fileKey: l.id,
            sampleId: l.id,
            eventIndex: t,
            spec: G,
            size: x,
            pinned: (f == null ? void 0 : f.sampleId) === l.id && f.eventIndex === t,
            onPin: L,
            onOpen: M,
            label: i("Event {index} of {name}", { index: t.toLocaleString(), name: l.name })
          },
          t
        );
      }) }),
      /* @__PURE__ */ s.jsx("div", { style: { height: Math.max(0, (K - W) * T) } })
    ] })
  ] }) });
}
function re(r, u) {
  return r.visible || u.visible ? !1 : r.stateKey === u.stateKey;
}
const de = m.memo(ce, re);
export {
  de as ImagesTab,
  re as imagesTabPropsEqual
};
