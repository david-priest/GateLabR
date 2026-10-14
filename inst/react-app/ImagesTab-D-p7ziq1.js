import { u as Ke, a as c, j as l, b as ne } from "./embed-v78cfaSj.js";
import { o as bt, u as kt, d as yt } from "./CellInspector-CGzckEjI.js";
import { N as wt } from "./cvwDecode-CKHzN2J_.js";
const jt = "#7b9bc8", Mt = "rgba(47, 111, 228, 0.22)", Ct = "rgba(255, 255, 255, 0.6)", Nt = "#2f6fe4";
function St({ histogram: r, label: m, inView: s, range: C, onRange: d, width: o = 220, height: u = 40 }) {
  const { t: N } = Ke(), O = c.useRef(null), [v, w] = c.useState(null), j = c.useRef(null), b = (g) => (g - r.lo) / (r.hi - r.lo) * o, M = (g) => r.lo + Math.max(0, Math.min(o, g)) / o * (r.hi - r.lo);
  c.useEffect(() => {
    const g = O.current;
    if (!g) return;
    const i = typeof window < "u" && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
    g.width = Math.round(o * i), g.height = Math.round(u * i);
    const h = g.getContext("2d");
    if (!h) return;
    h.setTransform(i, 0, 0, i, 0, 0), h.clearRect(0, 0, o, u);
    const a = r.counts.length, G = o / a;
    h.fillStyle = jt;
    for (let T = 0; T < a; T++) {
      const I = r.peak > 0 ? r.counts[T] / r.peak * (u - 2) : 0;
      I > 0 && h.fillRect(T * G, u - I, Math.max(1, G - 0.5), I);
    }
    if (s) {
      const T = b(Math.min(s[0], s[1])), I = b(Math.max(s[0], s[1]));
      h.fillStyle = Mt, h.fillRect(T, 0, Math.max(2, I - T), u);
    }
    const J = v ?? C;
    if (J) {
      const T = b(Math.min(J[0], J[1])), I = b(Math.max(J[0], J[1]));
      h.fillStyle = Ct, h.fillRect(0, 0, T, u), h.fillRect(I, 0, o - I, u), h.strokeStyle = Nt, h.lineWidth = 1, h.beginPath(), h.moveTo(T + 0.5, 0), h.lineTo(T + 0.5, u), h.moveTo(I - 0.5, 0), h.lineTo(I - 0.5, u), h.stroke();
    }
  }, [r, s, C, v, o, u]);
  const E = (g) => g.clientX - g.currentTarget.getBoundingClientRect().left, _ = (g) => {
    if (g.button !== 0) return;
    const i = E(g);
    j.current = [i, i], w([M(i), M(i)]);
    const h = g.currentTarget;
    if (typeof h.setPointerCapture == "function")
      try {
        h.setPointerCapture(g.pointerId);
      } catch {
      }
  }, k = (g) => {
    if (!j.current) return;
    const i = E(g);
    j.current = [j.current[0], i], w([M(j.current[0]), M(i)]);
  }, K = (g) => {
    const i = j.current;
    if (j.current = null, w(null), !i) return;
    const h = E(g);
    if (Math.abs(h - i[0]) < 3) {
      d(null);
      return;
    }
    const a = M(i[0]), G = M(h);
    d([Math.min(a, G), Math.max(a, G)]);
  };
  return /* @__PURE__ */ l.jsx(
    "canvas",
    {
      ref: O,
      className: "gl-wall-histogram",
      role: "img",
      "aria-label": N("Distribution of {channel} over the wall's cells; drag across it to show only a range of values, click it to show them all", { channel: m }),
      title: N("Distribution of {channel} over the wall's cells; drag across it to show only a range of values, click it to show them all", { channel: m }),
      style: { width: o, height: u },
      onPointerDown: _,
      onPointerMove: k,
      onPointerUp: K,
      onPointerCancel: () => {
        j.current = null, w(null);
      }
    }
  );
}
function Rt(r, m) {
  let s = 1 / 0, C = -1 / 0;
  for (let d = 0; d < m.length; d++) {
    const o = r[m[d]];
    Number.isFinite(o) && (o < s && (s = o), o > C && (C = o));
  }
  return s <= C ? [s, C] : null;
}
function Pt(r, m, s = 64) {
  const C = Rt(r, m);
  if (!C) return null;
  let [d, o] = C;
  o === d && (d -= 0.5, o += 0.5);
  const u = new Uint32Array(Math.max(1, s)), N = (o - d) / u.length;
  let O = 0;
  for (let w = 0; w < m.length; w++) {
    const j = r[m[w]];
    if (!Number.isFinite(j)) continue;
    let b = Math.floor((j - d) / N);
    b >= u.length && (b = u.length - 1), b < 0 && (b = 0), u[b]++, O++;
  }
  let v = 0;
  for (const w of u) w > v && (v = w);
  return { counts: u, lo: d, hi: o, total: O, peak: v };
}
function Tt(r, m, s, C) {
  const d = new Int32Array(m.length);
  let o = 0;
  for (let u = 0; u < m.length; u++) {
    const N = r[m[u]];
    N >= s && N <= C && (d[o++] = m[u]);
  }
  return d.subarray(0, o);
}
function Me(r) {
  if (!Number.isFinite(r)) return "–";
  if (r === 0) return "0";
  const m = Math.abs(r);
  if (m >= 1e6 || m < 1e-3) return r.toExponential(2).replace(/\.?0+e/, "e");
  const s = Math.max(0, 2 - Math.floor(Math.log10(m)));
  return r.toFixed(Math.min(6, s)).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
const Ce = "__class__", ve = 4, Qe = 2, At = 6, Et = wt, Dt = c.memo(function({ service: m, fileKey: s, sampleId: C, eventIndex: d, spec: o, size: u, pinned: N, onPin: O, onOpen: v, label: w, colour: j = null, picked: b = !1, onPick: M }) {
  var g;
  const { t: E } = Ke(), _ = kt(m, s, d, o, "batch"), k = ((g = _.result) == null ? void 0 : g.kind) === "image" ? _.result.image : null, K = c.useRef(null);
  return c.useEffect(() => {
    if (!(k != null && k.composite) || !K.current) return;
    const i = k.cols * k.aspect, h = Math.min(u / i, u / k.rows);
    yt(K.current, k.composite, i * h, k.rows * h);
  }, [k, u]), /* @__PURE__ */ l.jsxs(
    "button",
    {
      type: "button",
      role: "gridcell",
      className: "gl-wall-tile" + (N ? " gl-wall-tile-pinned" : "") + (j ? " gl-wall-tile-classed" : "") + (b ? " gl-wall-tile-picked" : ""),
      style: { width: u, height: u },
      title: w,
      "aria-label": w,
      "aria-selected": N,
      "aria-checked": M ? b : void 0,
      "data-event": d,
      onClick: (i) => {
        if (M) {
          if (i.metaKey || i.ctrlKey) {
            M(d, "toggle");
            return;
          }
          if (i.shiftKey) {
            M(d, "range");
            return;
          }
          M(d, "replace");
        }
        O({ sampleId: C, eventIndex: d });
      },
      onDoubleClick: v,
      children: [
        k ? /* @__PURE__ */ l.jsx("canvas", { ref: K }) : /* @__PURE__ */ l.jsx("span", { className: "gl-wall-tile-empty", children: _.status === "none" ? "·" : "" }),
        j && /* @__PURE__ */ l.jsx("span", { className: "gl-wall-tile-ring", "aria-hidden": "true", style: { boxShadow: `inset 0 0 0 2px ${j}` } }),
        M && /* @__PURE__ */ l.jsx(
          "span",
          {
            className: "gl-wall-tile-pick" + (b ? " is-picked" : ""),
            role: "checkbox",
            "aria-checked": b,
            "aria-label": E(b ? "Unpick" : "Pick"),
            title: E(b ? "Unpick" : "Pick"),
            onClick: (i) => {
              i.stopPropagation(), M(d, i.shiftKey ? "range" : "toggle");
            },
            children: b ? "✓" : ""
          }
        ),
        /* @__PURE__ */ l.jsx("span", { className: "gl-wall-tile-index", children: d.toLocaleString() })
      ]
    }
  );
});
function vt({
  visible: r,
  service: m,
  entry: s,
  mask: C,
  populationLabel: d,
  view: o,
  onViewChange: u,
  pinned: N,
  onPin: O,
  onShowOnPlot: v,
  populationId: w = null,
  populations: j,
  onChoosePopulation: b,
  excludedMask: M = null,
  parentName: E = null,
  onSendToLayout: _,
  classOf: k,
  classes: K,
  classTitle: g,
  onMakePopulation: i,
  onFindSimilar: h
}) {
  const { t: a } = Ke(), G = c.useRef(v);
  G.current = v;
  const J = c.useCallback(() => G.current(), []), T = c.useRef(O);
  T.current = O;
  const I = c.useCallback((e) => T.current(e), []), [W, Ie] = ne("images.sortKey", ""), [se, Le] = ne("images.sortDesc", !1), [Q, Ze] = ne("images.tileSize", 72), [Ne, Se] = c.useState(!1);
  c.useEffect(() => {
    Se(!1);
  }, [w]);
  const Oe = Ne && !!M && !!E, ae = Oe ? M : C, Re = Oe ? a("{parent} without {population}", { parent: E ?? "", population: d }) : d, [We, Ve] = ne("images.wallCount", 48), [pe, xe] = ne("images.range", null), Z = s && W && W !== Ce ? s.sample.channels.findIndex((e) => e.key === W) : -1, et = Z >= 0 && s ? s.sample.channels[Z] : null, H = c.useMemo(() => s && Z >= 0 ? s.sample.displayColumn(Z) : null, [s, Z]), [tt, lt] = ne("images.histKey", ""), me = s ? Z >= 0 ? Z : Math.max(0, s.sample.channels.findIndex((e) => e.key === tt)) : -1, F = me >= 0 && s ? s.sample.channels[me] : null, $e = F ? F.label ?? F.key : "", q = c.useMemo(() => s && me >= 0 ? s.sample.displayColumn(me) : null, [s, me]), S = q && F && pe && pe.key === F.key ? [pe.lo, pe.hi] : null, [be, L] = c.useState(() => /* @__PURE__ */ new Set()), [oe, Pe] = c.useState(""), V = c.useRef(null);
  c.useEffect(() => {
    L(/* @__PURE__ */ new Set()), V.current = null;
  }, [s == null ? void 0 : s.id, ae]);
  const ee = !!K && !!k, [ke, nt] = ne("images.wallClass", "all"), Ue = (e) => {
    var n;
    if (!K || !k) return null;
    const t = k(e);
    return t === null ? null : ((n = K[t]) == null ? void 0 : n.colour) ?? null;
  }, z = (s == null ? void 0 : s.images) ?? null, A = (o == null ? void 0 : o.display) ?? (z == null ? void 0 : z.display) ?? null, ie = (o == null ? void 0 : o.exposure) ?? 1, fe = (o == null ? void 0 : o.outline) ?? !1, ye = bt(fe, z), [re, Te] = c.useState(null);
  c.useEffect(() => {
    if (!m || !s || !z || !r) return;
    const e = m.knownInfo(s.id);
    if (e) {
      Te({ id: s.id, info: e, error: null });
      return;
    }
    let t = !0;
    return m.info(s.id).then(
      (n) => {
        t && Te({ id: s.id, info: n, error: null });
      },
      (n) => {
        t && Te({ id: s.id, info: null, error: n instanceof Error ? n.message : String(n) });
      }
    ), () => {
      t = !1;
    };
  }, [m, s, z, r]);
  const ce = re && s && re.id === s.id ? re.info : null, _e = re && s && re.id === s.id ? re.error : null, st = c.useMemo(() => !A || !ce ? null : { display: A, scale: ce.scale, exposure: ie, hop: Et, composite: !0, channels: [], ...ye ? { outline: ye } : {} }, [A, ce, ie, fe, z]), { events: f, inPopulation: Ge, all: He } = c.useMemo(() => {
    if (!s || !ce) return { events: new Int32Array(0), inPopulation: 0, all: new Int32Array(0) };
    const e = s.sample.fcs.nEvents, t = ce.hasImage;
    let n = 0, x = 0;
    for (let y = 0; y < e; y++)
      ae && !ae[y] || (n++, t[y] && x++);
    let p = new Int32Array(x), R = 0;
    for (let y = 0; y < e; y++)
      ae && !ae[y] || t[y] && (p[R++] = y);
    if (ee && ke !== "all") {
      const y = Number(ke);
      p = p.filter((U) => k(U) === y);
    }
    const P = p;
    q && S && (p = Tt(q, p, S[0], S[1]).slice());
    const Y = se ? -1 : 1;
    return W === Ce && ee ? p.sort((y, U) => Y * ((k(y) ?? 99) - (k(U) ?? 99)) || y - U) : H ? p.sort((y, U) => Y * (H[y] - H[U]) || y - U) : se && p.reverse(), { events: p, inPopulation: n, all: P };
  }, [s, ce, ae, W, se, ee, k, ke, H, q, S == null ? void 0 : S[0], S == null ? void 0 : S[1]]), Fe = c.useMemo(() => q ? Pt(q, He) : null, [q, He]), Ae = (e, t) => {
    const n = V.current;
    L((x) => {
      if (t === "replace") return /* @__PURE__ */ new Set([e]);
      const p = new Set(x);
      if (t === "range" && n !== null) {
        const R = f.indexOf(n), P = f.indexOf(e);
        if (R >= 0 && P >= 0) for (let Y = Math.min(R, P); Y <= Math.max(R, P); Y++) p.add(f[Y]);
        else p.add(e);
      } else t === "range" ? p.add(e) : p.has(e) ? p.delete(e) : p.add(e);
      return p;
    }), V.current = e;
  }, [B, we] = c.useState(null), de = c.useRef(null), at = (e) => e.altKey ? "remove" : e.metaKey || e.ctrlKey ? "add" : "replace", Ee = c.useRef(!1), De = (e) => {
    const t = te.current, n = t.getBoundingClientRect();
    return { x: e.clientX - n.left + t.scrollLeft, y: e.clientY - n.top + t.scrollTop };
  }, ot = (e) => {
    if (!i || e.button !== 0 || !te.current) return;
    const t = e.target;
    if (t.closest(".gl-wall-tile-pick") || t.closest(".gl-wall-tile") && (e.metaKey || e.ctrlKey || e.shiftKey)) return;
    const n = De(e);
    de.current = { x: n.x, y: n.y, mode: at(e), active: !1 };
  }, it = (e) => {
    const t = de.current;
    if (!t || !te.current) return;
    const n = De(e);
    if (!t.active) {
      if (Math.abs(n.x - t.x) < 4 && Math.abs(n.y - t.y) < 4) return;
      t.active = !0;
      const x = te.current;
      if (typeof x.setPointerCapture == "function")
        try {
          x.setPointerCapture(e.pointerId);
        } catch {
        }
    }
    we({ x0: Math.min(t.x, n.x), y0: Math.min(t.y, n.y), x1: Math.max(t.x, n.x), y1: Math.max(t.y, n.y), mode: t.mode });
  }, rt = (e) => {
    const t = de.current;
    if (de.current = null, !t || !t.active) {
      we(null);
      return;
    }
    const n = De(e), x = { x0: Math.min(t.x, n.x), y0: Math.min(t.y, n.y), x1: Math.max(t.x, n.x), y1: Math.max(t.y, n.y) }, p = t.mode;
    we(null), Ee.current = !0;
    const R = At, P = [], Y = Math.max(0, Math.floor((x.x0 - R) / D)), y = Math.min($ - 1, Math.floor((x.x1 - R) / D)), U = Math.max(0, Math.floor((x.y0 - R) / D)), xt = Math.min(je - 1, Math.floor((x.y1 - R) / D));
    for (let ue = U; ue <= xt; ue++) {
      const he = R + ue * D;
      if (!(x.y1 < he || x.y0 > he + Q))
        for (let le = Y; le <= y; le++) {
          const Ye = R + le * D;
          if (x.x1 < Ye || x.x0 > Ye + Q) continue;
          const Je = ue * $ + le;
          Je < f.length && P.push(f[Je]);
        }
    }
    if (p === "replace") {
      L(new Set(P)), V.current = P.length ? P[P.length - 1] : null;
      return;
    }
    P.length !== 0 && (L((ue) => {
      const he = new Set(ue);
      for (const le of P)
        p === "remove" ? he.delete(le) : he.add(le);
      return he;
    }), V.current = P[P.length - 1]);
  }, ct = (e) => {
    Ee.current && (Ee.current = !1, e.stopPropagation(), e.preventDefault());
  }, qe = c.useRef(Ae);
  qe.current = Ae;
  const ut = c.useCallback((e, t) => qe.current(e, t), []), ge = c.useMemo(() => {
    if (be.size === 0) return [];
    const e = [];
    for (let t = 0; t < f.length; t++) be.has(f[t]) && e.push(f[t]);
    return e.sort((t, n) => t - n);
  }, [be, f]), te = c.useRef(null), [X, ht] = c.useState({ width: 0, height: 0, scrollTop: 0 });
  c.useEffect(() => {
    const e = te.current;
    if (!e || !r) return;
    const t = () => ht({ width: e.clientWidth, height: e.clientHeight, scrollTop: e.scrollTop });
    t();
    const n = typeof ResizeObserver == "function" ? new ResizeObserver(t) : null;
    return n == null || n.observe(e), e.addEventListener("scroll", t, { passive: !0 }), () => {
      n == null || n.disconnect(), e.removeEventListener("scroll", t);
    };
  }, [r]);
  const D = Q + ve, $ = Math.max(1, Math.floor((X.width + ve) / D)), je = Math.ceil(f.length / $), ze = Math.max(0, Math.floor(X.scrollTop / D) - Qe), Be = Math.min(je, Math.ceil((X.scrollTop + X.height) / D) + Qe), Xe = ze * $, mt = Math.min(f.length, Be * $), ft = (() => {
    if (!H || H !== q || f.length === 0 || X.height === 0) return null;
    const e = Math.min(f.length - 1, Math.max(0, Math.floor(X.scrollTop / D)) * $), t = Math.min(f.length - 1, Math.ceil((X.scrollTop + X.height) / D) * $ - 1);
    return [H[f[e]], H[f[t]]];
  })(), dt = (e, t) => {
    var R;
    const n = [...((R = te.current) == null ? void 0 : R.querySelectorAll(".gl-wall-tile")) ?? []], x = n.indexOf(e);
    if (x < 0) return;
    const p = n[Math.max(0, Math.min(n.length - 1, x + t))];
    p == null || p.focus();
  }, gt = (e) => {
    const t = e.target;
    if (!t.classList.contains("gl-wall-tile")) return;
    if (i && e.key === " ") {
      const x = Number(t.getAttribute("data-event"));
      Number.isInteger(x) && (e.preventDefault(), Ae(x, e.shiftKey ? "range" : "toggle"));
      return;
    }
    if (i && e.key === "Escape") {
      L(/* @__PURE__ */ new Set()), V.current = null;
      return;
    }
    if (i && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a") {
      e.preventDefault(), L(new Set(Array.from(f)));
      return;
    }
    const n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "ArrowDown" ? $ : e.key === "ArrowUp" ? -$ : null;
    n !== null && (e.preventDefault(), dt(t, n));
  };
  if (!r) return /* @__PURE__ */ l.jsx("div", { style: { display: "none" } });
  const pt = (e) => {
    !s || !A || u(s.id, { display: A.map((t) => t.slot === e ? { ...t, enabled: !t.enabled } : t), exposure: ie, outline: fe });
  };
  return /* @__PURE__ */ l.jsx("section", { className: "gl-tab-panel gl-tab-fill gl-images-tab", "aria-label": a("Images"), children: !s || !z ? /* @__PURE__ */ l.jsx("div", { className: "gl-empty", children: a("No cell images are attached to the viewed file. Attach a .cvw from the Import menu.") }) : /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsxs("div", { className: "gl-images-toolbar", children: [
      j && j.length > 0 && b && /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ l.jsx("span", { children: a("Population") }),
        /* @__PURE__ */ l.jsxs("select", { value: w ?? "", onChange: (e) => {
          e.target.value && b(e.target.value);
        }, "aria-label": a("Population"), children: [
          w === null && /* @__PURE__ */ l.jsx("option", { value: "", children: d }),
          j.map((e) => /* @__PURE__ */ l.jsxs("option", { value: e.id, children: [
            "  ".repeat(e.depth),
            e.name
          ] }, e.id))
        ] })
      ] }),
      M && E && /* @__PURE__ */ l.jsxs("span", { className: "gl-images-control gl-images-show", role: "group", "aria-label": a("Show"), children: [
        /* @__PURE__ */ l.jsx("button", { type: "button", className: "gl-chip", "aria-pressed": !Ne, onClick: () => Se(!1), children: a("In the population") }),
        /* @__PURE__ */ l.jsx(
          "button",
          {
            type: "button",
            className: "gl-chip",
            "aria-pressed": Ne,
            onClick: () => Se(!0),
            title: a("The cells of {parent} that this population's gate leaves out", { parent: E }),
            children: a("Left out by its gate")
          }
        )
      ] }),
      /* @__PURE__ */ l.jsx("span", { className: "gl-images-count", children: a("{count} cells in {population} · {shown} with images", {
        count: Ge.toLocaleString(),
        population: Re,
        shown: f.length.toLocaleString()
      }) }),
      /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ l.jsx("span", { children: a("Sort by") }),
        /* @__PURE__ */ l.jsxs("select", { value: W, onChange: (e) => Ie(e.target.value), children: [
          /* @__PURE__ */ l.jsx("option", { value: "", children: a("Event order") }),
          ee && /* @__PURE__ */ l.jsx("option", { value: Ce, children: a("Class") }),
          s.sample.channels.map((e) => /* @__PURE__ */ l.jsx("option", { value: e.key, children: e.label ?? e.key }, e.key))
        ] }),
        /* @__PURE__ */ l.jsx("button", { type: "button", className: "gl-mini-btn", "aria-pressed": se, onClick: () => Le((e) => !e), title: a("Reverse the order"), children: se ? "↓" : "↑" })
      ] }),
      Fe && F && /* @__PURE__ */ l.jsxs("span", { className: "gl-images-histogram", children: [
        !et && /* @__PURE__ */ l.jsx(
          "select",
          {
            className: "gl-images-hist-channel",
            value: F.key,
            "aria-label": a("Histogram of"),
            title: a("The channel the histogram shows while the wall is not sorted by one; a range dragged on it limits the wall by that channel"),
            onChange: (e) => {
              lt(e.target.value), xe(null);
            },
            children: s.sample.channels.map((e) => /* @__PURE__ */ l.jsx("option", { value: e.key, children: e.label ?? e.key }, e.key))
          }
        ),
        /* @__PURE__ */ l.jsx(
          St,
          {
            histogram: Fe,
            label: $e,
            inView: ft,
            range: S,
            onRange: (e) => xe(e ? { key: F.key, lo: e[0], hi: e[1] } : null)
          }
        ),
        S && /* @__PURE__ */ l.jsxs("span", { className: "gl-images-range", children: [
          `${Me(S[0])}–${Me(S[1])}`,
          /* @__PURE__ */ l.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => xe(null), title: a("Show every cell again"), children: "×" })
        ] })
      ] }),
      ee && /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ l.jsx("span", { children: g ?? a("Class") }),
        /* @__PURE__ */ l.jsxs("select", { value: ke, "aria-label": a("Show class"), onChange: (e) => nt(e.target.value), children: [
          /* @__PURE__ */ l.jsx("option", { value: "all", children: a("all classes") }),
          K.map((e, t) => /* @__PURE__ */ l.jsx("option", { value: String(t), children: e.label }, e.label))
        ] })
      ] }),
      /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ l.jsx("span", { children: a("Tile size") }),
        /* @__PURE__ */ l.jsx("input", { type: "range", min: 40, max: 160, step: 8, value: Q, onChange: (e) => Ze(Number(e.target.value)) })
      ] }),
      /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ l.jsx("span", { children: a("Exposure") }),
        /* @__PURE__ */ l.jsx(
          "input",
          {
            type: "range",
            min: -2,
            max: 2,
            step: 0.05,
            value: Math.log2(ie),
            onChange: (e) => {
              A && u(s.id, { display: A.slice(), exposure: Math.pow(2, Number(e.target.value)), outline: fe });
            }
          }
        )
      ] }),
      /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control gl-images-check", title: a("Outline the objects the count found on the mask image, in magenta"), children: [
        /* @__PURE__ */ l.jsx("input", { type: "checkbox", checked: fe, onChange: (e) => {
          A && u(s.id, { display: A.slice(), exposure: ie, outline: e.target.checked });
        } }),
        /* @__PURE__ */ l.jsx("span", { children: a("Mask outline") })
      ] }),
      A && /* @__PURE__ */ l.jsx("span", { className: "gl-images-channels", children: A.map((e) => /* @__PURE__ */ l.jsxs("label", { className: "gl-images-channel", title: e.name, children: [
        /* @__PURE__ */ l.jsx("input", { type: "checkbox", checked: e.enabled, onChange: () => pt(e.slot) }),
        /* @__PURE__ */ l.jsx("span", { className: "gl-cell-chip", style: { background: e.colour } }),
        e.name
      ] }, e.slot)) }),
      /* @__PURE__ */ l.jsx("button", { type: "button", className: "gl-mini-btn", disabled: !N, onClick: v, children: a("Show on plot") }),
      _ && /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control gl-images-send", children: [
        /* @__PURE__ */ l.jsx("span", { children: a("Cells") }),
        /* @__PURE__ */ l.jsx("select", { value: We, onChange: (e) => Ve(Number(e.target.value)), "aria-label": a("Cells to send"), children: [12, 24, 48, 96, 192].map((e) => /* @__PURE__ */ l.jsx("option", { value: e, children: e }, e)) }),
        /* @__PURE__ */ l.jsx(
          "button",
          {
            type: "button",
            className: "gl-mini-btn",
            disabled: f.length === 0 || !A,
            title: a("Lay the first cells of this wall, in this order, on the Layout tab as one labelled block"),
            onClick: () => {
              if (!A) return;
              const e = Math.min(We, f.length), t = W ? s.sample.channels.find((n) => n.key === W) : void 0;
              _({
                kind: "imagewall",
                sampleId: s.id,
                fileName: s.name,
                populationId: w ?? "",
                populationName: Re,
                events: Array.from(f.subarray(0, e)),
                imaged: f.length,
                populationCount: Ge,
                sortKey: W,
                sortLabel: W === Ce ? g ?? a("Class") : t ? t.label ?? t.key : "",
                sortDesc: se,
                display: A.map((n) => ({ ...n })),
                exposure: ie,
                tile: Math.max(24, Math.min(96, Math.round(Q * 0.75))),
                columns: e <= 12 ? 6 : e <= 48 ? 8 : 12,
                ...ye ? { outline: ye } : {},
                ...S ? { rangeLabel: `${$e} ${Me(S[0])}–${Me(S[1])}` } : {},
                ...ee ? {
                  tileColours: Array.from(f.subarray(0, e), (n) => Ue(n) ?? ""),
                  legend: K.map((n) => ({ label: n.label, colour: n.colour }))
                } : {}
              });
            },
            children: a("Send to Layout")
          }
        )
      ] }),
      i && /* @__PURE__ */ l.jsxs(
        "span",
        {
          className: "gl-images-control gl-images-picked",
          title: a("Pick cells as in Photos: click a cell, Cmd/Ctrl-click to add or remove one, Shift-click to extend from the last click, drag a rectangle over the wall (Cmd-drag adds, Option-drag removes), Escape clears, Cmd-A picks all shown"),
          children: [
            /* @__PURE__ */ l.jsx("span", { children: a("{count} picked", { count: ge.length.toLocaleString() }) }),
            /* @__PURE__ */ l.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: f.length === 0,
                title: a("Pick every cell now on the wall, within its range and class"),
                onClick: () => {
                  L((e) => {
                    const t = new Set(e);
                    for (let n = 0; n < f.length; n++) t.add(f[n]);
                    return t;
                  });
                },
                children: a("Pick all shown")
              }
            ),
            ge.length > 0 && /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
              /* @__PURE__ */ l.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  title: a("Drop every cell now on the wall from the picks"),
                  onClick: () => {
                    L((e) => {
                      const t = new Set(e);
                      for (let n = 0; n < f.length; n++) t.delete(f[n]);
                      return t;
                    });
                  },
                  children: a("Unpick shown")
                }
              ),
              /* @__PURE__ */ l.jsx(
                "input",
                {
                  type: "text",
                  value: oe,
                  placeholder: a("Population name"),
                  "aria-label": a("Population name"),
                  onChange: (e) => Pe(e.target.value),
                  onKeyDown: (e) => {
                    e.key === "Enter" && oe.trim() && (i(ge, oe.trim()), L(/* @__PURE__ */ new Set()), Pe(""));
                  }
                }
              ),
              /* @__PURE__ */ l.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  disabled: !oe.trim(),
                  title: a("A population of the picked cells under {population}, and one of the rest; the picks become a channel of the file saved with the workspace", { population: Re }),
                  onClick: () => {
                    i(ge, oe.trim()), L(/* @__PURE__ */ new Set()), Pe("");
                  },
                  children: a("Make population")
                }
              ),
              h && /* @__PURE__ */ l.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  title: a("Sort the wall by likeness to the picked cells over the file's channels: the most alike come first, and a range on the histogram keeps them"),
                  onClick: () => {
                    const e = h(ge, oe.trim() || a("picks"));
                    e && (Ie(e), Le(!1), xe(null));
                  },
                  children: a("Find similar")
                }
              ),
              /* @__PURE__ */ l.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => {
                L(/* @__PURE__ */ new Set()), V.current = null;
              }, title: a("Drop every pick"), children: a("Unpick all") })
            ] })
          ]
        }
      )
    ] }),
    ee && /* @__PURE__ */ l.jsx("div", { className: "gl-images-legend", "aria-label": g ?? a("Class"), children: K.map((e) => /* @__PURE__ */ l.jsxs("span", { className: "gl-images-legend-item", children: [
      /* @__PURE__ */ l.jsx("span", { className: "gl-cell-chip", style: { background: e.colour } }),
      e.label
    ] }, e.label)) }),
    _e && /* @__PURE__ */ l.jsx("div", { className: "gl-error-inline", children: _e }),
    /* @__PURE__ */ l.jsxs(
      "div",
      {
        className: "gl-images-scroll",
        ref: te,
        role: "grid",
        "aria-rowcount": je,
        onKeyDown: gt,
        onPointerDown: ot,
        onPointerMove: it,
        onPointerUp: rt,
        onPointerCancel: () => {
          de.current = null, we(null);
        },
        onClickCapture: ct,
        children: [
          B && /* @__PURE__ */ l.jsx(
            "div",
            {
              className: "gl-images-marquee" + (B.mode === "remove" ? " gl-images-marquee-unpick" : ""),
              style: { left: B.x0, top: B.y0, width: Math.max(1, B.x1 - B.x0), height: Math.max(1, B.y1 - B.y0) }
            }
          ),
          /* @__PURE__ */ l.jsx("div", { style: { height: ze * D } }),
          /* @__PURE__ */ l.jsx("div", { className: "gl-images-grid", style: { gridTemplateColumns: `repeat(${$}, ${Q}px)`, gap: ve }, children: Array.from({ length: Math.max(0, mt - Xe) }, (e, t) => {
            const n = f[Xe + t];
            return /* @__PURE__ */ l.jsx(
              Dt,
              {
                service: m,
                fileKey: s.id,
                sampleId: s.id,
                eventIndex: n,
                spec: st,
                size: Q,
                pinned: (N == null ? void 0 : N.sampleId) === s.id && N.eventIndex === n,
                onPin: I,
                onOpen: J,
                label: a("Event {index} of {name}", { index: n.toLocaleString(), name: s.name }),
                colour: Ue(n),
                picked: be.has(n),
                onPick: i ? ut : void 0
              },
              n
            );
          }) }),
          /* @__PURE__ */ l.jsx("div", { style: { height: Math.max(0, (je - Be) * D) } })
        ]
      }
    )
  ] }) });
}
function Kt(r, m) {
  return r.visible || m.visible ? !1 : r.stateKey === m.stateKey;
}
const Wt = c.memo(vt, Kt);
export {
  Ce as CLASS_SORT,
  Wt as ImagesTab,
  Kt as imagesTabPropsEqual
};
