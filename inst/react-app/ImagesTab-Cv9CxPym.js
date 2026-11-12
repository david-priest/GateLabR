import { u as qe, a as r, j as t, g as ie, a6 as St, a5 as vt, a7 as Rt, c9 as Pt } from "./embed-3DD01fPl.js";
import { o as Lt, u as At, d as Et } from "./CellInspector-CPw0Ug-M.js";
import { N as Tt } from "./cvwDecode-CKHzN2J_.js";
const Dt = "#7b9bc8", It = "rgba(47, 111, 228, 0.22)", Kt = "rgba(255, 255, 255, 0.6)", zt = "#2f6fe4";
function Ft({ histogram: i, label: g, inView: s, range: j, onRange: m, width: c = 220, height: h = 40 }) {
  const { t: M } = qe(), W = r.useRef(null), [K, N] = r.useState(null), S = r.useRef(null), C = (f) => (f - i.lo) / (i.hi - i.lo) * c, v = (f) => i.lo + Math.max(0, Math.min(c, f)) / c * (i.hi - i.lo);
  r.useEffect(() => {
    const f = W.current;
    if (!f) return;
    const d = typeof window < "u" && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
    f.width = Math.round(c * d), f.height = Math.round(h * d);
    const b = f.getContext("2d");
    if (!b) return;
    b.setTransform(d, 0, 0, d, 0, 0), b.clearRect(0, 0, c, h);
    const Y = i.counts.length, o = c / Y;
    b.fillStyle = Dt;
    for (let E = 0; E < Y; E++) {
      const z = i.peak > 0 ? i.counts[E] / i.peak * (h - 2) : 0;
      z > 0 && b.fillRect(E * o, h - z, Math.max(1, o - 0.5), z);
    }
    if (s) {
      const E = C(Math.min(s[0], s[1])), z = C(Math.max(s[0], s[1]));
      b.fillStyle = It, b.fillRect(E, 0, Math.max(2, z - E), h);
    }
    const l = K ?? j;
    if (l) {
      const E = C(Math.min(l[0], l[1])), z = C(Math.max(l[0], l[1]));
      b.fillStyle = Kt, b.fillRect(0, 0, E, h), b.fillRect(z, 0, c - z, h), b.strokeStyle = zt, b.lineWidth = 1, b.beginPath(), b.moveTo(E + 0.5, 0), b.lineTo(E + 0.5, h), b.moveTo(z - 0.5, 0), b.lineTo(z - 0.5, h), b.stroke();
    }
  }, [i, s, j, K, c, h]);
  const T = (f) => f.clientX - f.currentTarget.getBoundingClientRect().left, X = (f) => {
    if (f.button !== 0) return;
    const d = T(f);
    S.current = [d, d], N([v(d), v(d)]);
    const b = f.currentTarget;
    if (typeof b.setPointerCapture == "function")
      try {
        b.setPointerCapture(f.pointerId);
      } catch {
      }
  }, w = (f) => {
    if (!S.current) return;
    const d = T(f);
    S.current = [S.current[0], d], N([v(S.current[0]), v(d)]);
  }, P = (f) => {
    const d = S.current;
    if (S.current = null, N(null), !d) return;
    const b = T(f);
    if (Math.abs(b - d[0]) < 3) {
      m(null);
      return;
    }
    const Y = v(d[0]), o = v(b);
    m([Math.min(Y, o), Math.max(Y, o)]);
  };
  return /* @__PURE__ */ t.jsx(
    "canvas",
    {
      ref: W,
      className: "gl-wall-histogram",
      role: "img",
      "aria-label": M("Distribution of {channel} over the wall's cells; drag across it to show only a range of values, click it to show them all", { channel: g }),
      title: M("Distribution of {channel} over the wall's cells; drag across it to show only a range of values, click it to show them all", { channel: g }),
      style: { width: c, height: h },
      onPointerDown: X,
      onPointerMove: w,
      onPointerUp: P,
      onPointerCancel: () => {
        S.current = null, N(null);
      }
    }
  );
}
function qt(i, g) {
  let s = 1 / 0, j = -1 / 0;
  for (let m = 0; m < g.length; m++) {
    const c = i[g[m]];
    Number.isFinite(c) && (c < s && (s = c), c > j && (j = c));
  }
  return s <= j ? [s, j] : null;
}
function $t(i, g, s = 64) {
  const j = qt(i, g);
  if (!j) return null;
  let [m, c] = j;
  c === m && (m -= 0.5, c += 0.5);
  const h = new Uint32Array(Math.max(1, s)), M = (c - m) / h.length;
  let W = 0;
  for (let N = 0; N < g.length; N++) {
    const S = i[g[N]];
    if (!Number.isFinite(S)) continue;
    let C = Math.floor((S - m) / M);
    C >= h.length && (C = h.length - 1), C < 0 && (C = 0), h[C]++, W++;
  }
  let K = 0;
  for (const N of h) N > K && (K = N);
  return { counts: h, lo: m, hi: c, total: W, peak: K };
}
function Wt(i, g, s, j) {
  const m = new Int32Array(g.length);
  let c = 0;
  for (let h = 0; h < g.length; h++) {
    const M = i[g[h]];
    M >= s && M <= j && (m[c++] = g[h]);
  }
  return m.subarray(0, c);
}
function Se(i) {
  if (!Number.isFinite(i)) return "–";
  if (i === 0) return "0";
  const g = Math.abs(i);
  if (g >= 1e6 || g < 1e-3) return i.toExponential(2).replace(/\.?0+e/, "e");
  const s = Math.max(0, 2 - Math.floor(Math.log10(g)));
  return i.toFixed(Math.min(6, s)).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
function ze(i, g) {
  if (i.length === 0) return NaN;
  const s = g * (i.length - 1), j = Math.floor(s), m = Math.min(i.length - 1, j + 1);
  return i[j] + (i[m] - i[j]) * (s - j);
}
function Ut(i, g, s) {
  const j = [];
  for (let c = 0; c < g.length; c++) {
    const h = g[c];
    if (s && s[h] !== 1) continue;
    const M = i[h];
    Number.isFinite(M) && M > 0 && j.push(M);
  }
  const m = Float64Array.from(j).sort();
  return { n: m.length, q1: ze(m, 0.25), median: ze(m, 0.5), q3: ze(m, 0.75) };
}
const ve = "__class__", Fe = 4, at = 2, Bt = 6, Gt = Tt, Ot = r.memo(function({ service: g, fileKey: s, sampleId: j, eventIndex: m, spec: c, size: h, pinned: M, onPin: W, onOpen: K, label: N, colour: S = null, picked: C = !1, onPick: v }) {
  var f;
  const { t: T } = qe(), X = At(g, s, m, c, "batch"), w = ((f = X.result) == null ? void 0 : f.kind) === "image" ? X.result.image : null, P = r.useRef(null);
  return r.useEffect(() => {
    if (!(w != null && w.composite) || !P.current) return;
    const d = w.cols * w.aspect, b = Math.min(h / d, h / w.rows);
    Et(P.current, w.composite, d * b, w.rows * b);
  }, [w, h]), /* @__PURE__ */ t.jsxs(
    "button",
    {
      type: "button",
      role: "gridcell",
      className: "gl-wall-tile" + (M ? " gl-wall-tile-pinned" : "") + (S ? " gl-wall-tile-classed" : "") + (C ? " gl-wall-tile-picked" : ""),
      style: { width: h, height: h },
      title: N,
      "aria-label": N,
      "aria-selected": M,
      "aria-checked": v ? C : void 0,
      "data-event": m,
      onClick: (d) => {
        if (v) {
          if (d.metaKey || d.ctrlKey) {
            v(m, "toggle");
            return;
          }
          if (d.shiftKey) {
            v(m, "range");
            return;
          }
          v(m, "replace");
        }
        W({ sampleId: j, eventIndex: m });
      },
      onDoubleClick: K,
      children: [
        w ? /* @__PURE__ */ t.jsx("canvas", { ref: P }) : /* @__PURE__ */ t.jsx("span", { className: "gl-wall-tile-empty", children: X.status === "none" ? "·" : "" }),
        S && /* @__PURE__ */ t.jsx("span", { className: "gl-wall-tile-ring", "aria-hidden": "true", style: { boxShadow: `inset 0 0 0 2px ${S}` } }),
        v && /* @__PURE__ */ t.jsx(
          "span",
          {
            className: "gl-wall-tile-pick" + (C ? " is-picked" : ""),
            role: "checkbox",
            "aria-checked": C,
            "aria-label": T(C ? "Unpick" : "Pick"),
            title: T(C ? "Unpick" : "Pick"),
            onClick: (d) => {
              d.stopPropagation(), v(m, d.shiftKey ? "range" : "toggle");
            },
            children: C ? "✓" : ""
          }
        ),
        /* @__PURE__ */ t.jsx("span", { className: "gl-wall-tile-index", children: m.toLocaleString() })
      ]
    }
  );
});
function _t({
  visible: i,
  service: g,
  entry: s,
  mask: j,
  populationLabel: m,
  view: c,
  onViewChange: h,
  pinned: M,
  onPin: W,
  onShowOnPlot: K,
  populationId: N = null,
  populations: S,
  onChoosePopulation: C,
  excludedMask: v = null,
  parentName: T = null,
  onSendToLayout: X,
  classOf: w,
  classes: P,
  classTitle: f,
  onMakePopulation: d,
  onFindSimilar: b,
  onSendCellPanel: Y,
  measure: o
}) {
  const { t: l } = qe(), E = r.useRef(K);
  E.current = K;
  const z = r.useCallback(() => E.current(), []), $e = r.useRef(W);
  $e.current = W;
  const st = r.useCallback((e) => $e.current(e), []), [F, Re] = ie("images.sortKey", ""), [ce, We] = ie("images.sortDesc", !1), [te, ot] = ie("images.tileSize", 72), [Pe, Le] = r.useState(!1);
  r.useEffect(() => {
    Le(!1);
  }, [N]);
  const Ue = Pe && !!v && !!T, G = Ue ? v : j, Ae = Ue ? l("{parent} without {population}", { parent: T ?? "", population: m }) : m, [Be, it] = ie("images.wallCount", 48), [ke, pe] = ie("images.range", null), le = s && F && F !== ve ? s.sample.channels.findIndex((e) => e.key === F) : -1, ct = le >= 0 && s ? s.sample.channels[le] : null, J = r.useMemo(() => s && le >= 0 ? s.sample.displayColumn(le) : null, [s, le]), [rt, ut] = ie("images.histKey", ""), xe = s ? le >= 0 ? le : Math.max(0, s.sample.channels.findIndex((e) => e.key === rt)) : -1, Q = xe >= 0 && s ? s.sample.channels[xe] : null, Ge = Q ? Q.label ?? Q.key : "", Z = r.useMemo(() => s && xe >= 0 ? s.sample.displayColumn(xe) : null, [s, xe]), L = Z && Q && ke && ke.key === Q.key ? [ke.lo, ke.hi] : null, [je, q] = r.useState(() => /* @__PURE__ */ new Set()), [re, Ee] = r.useState(""), ne = r.useRef(null);
  r.useEffect(() => {
    q(/* @__PURE__ */ new Set()), ne.current = null;
  }, [s == null ? void 0 : s.id, G]);
  const U = !!P && !!w, [ue, we] = ie("images.wallClass", "all"), Oe = r.useRef(f);
  r.useEffect(() => {
    Oe.current !== f && (Oe.current = f, we("all"));
  }, [f, we]);
  const _e = (e) => {
    var a;
    if (!P || !w) return null;
    const n = w(e);
    return n === null ? null : ((a = P[n]) == null ? void 0 : a.colour) ?? null;
  }, D = (s == null ? void 0 : s.images) ?? null, A = (c == null ? void 0 : c.display) ?? (D == null ? void 0 : D.display) ?? null, ae = (c == null ? void 0 : c.exposure) ?? 1, he = (c == null ? void 0 : c.outline) ?? !1, Ce = Lt(he, D), [me, Te] = r.useState(null);
  r.useEffect(() => {
    if (!g || !s || !D || !i) return;
    const e = g.knownInfo(s.id);
    if (e) {
      Te({ id: s.id, info: e, error: null });
      return;
    }
    let n = !0;
    return g.info(s.id).then(
      (a) => {
        n && Te({ id: s.id, info: a, error: null });
      },
      (a) => {
        n && Te({ id: s.id, info: null, error: a instanceof Error ? a.message : String(a) });
      }
    ), () => {
      n = !1;
    };
  }, [g, s, D, i]);
  const O = me && s && me.id === s.id ? me.info : null, He = me && s && me.id === s.id ? me.error : null, ht = r.useMemo(() => !A || !O ? null : { display: A, scale: O.scale, exposure: ae, hop: Gt, composite: !0, channels: [], ...Ce ? { outline: Ce } : {} }, [A, O, ae, he, D]), { events: p, inPopulation: Xe, all: Ye } = r.useMemo(() => {
    if (!s || !O) return { events: new Int32Array(0), inPopulation: 0, all: new Int32Array(0) };
    const e = s.sample.fcs.nEvents, n = O.hasImage;
    let a = 0, y = 0;
    for (let x = 0; x < e; x++)
      G && !G[x] || (a++, n[x] && y++);
    let u = new Int32Array(y), k = 0;
    for (let x = 0; x < e; x++)
      G && !G[x] || n[x] && (u[k++] = x);
    if (U && ue !== "all") {
      const x = Number(ue);
      u = u.filter((H) => w(H) === x);
    }
    const R = u;
    Z && L && (u = Wt(Z, u, L[0], L[1]).slice());
    const $ = ce ? -1 : 1;
    return F === ve && U ? u.sort((x, H) => $ * ((w(x) ?? 99) - (w(H) ?? 99)) || x - H) : J ? u.sort((x, H) => $ * (J[x] - J[H]) || x - H) : ce && u.reverse(), { events: u, inPopulation: a, all: R };
  }, [s, O, G, F, ce, U, w, ue, J, Z, L == null ? void 0 : L[0], L == null ? void 0 : L[1]]), Je = r.useMemo(() => Z ? $t(Z, Ye) : null, [Z, Ye]), be = r.useMemo(() => {
    if (!o || !U || !s || !O) return null;
    const e = s.sample.fcs.nEvents, n = O.hasImage, a = new Array(P.length).fill(0);
    let y = 0;
    for (let u = 0; u < e; u++) {
      if (G && !G[u] || !n[u]) continue;
      const k = w(u);
      k === null || k < 0 || k >= a.length || (a[k]++, y++);
    }
    return { counts: a, total: y };
  }, [o, U, P, w, s, O, G]), [Qe, mt] = r.useState(""), _ = r.useMemo(() => !o || o.sizes.length === 0 ? [] : o.sizes.map((e) => ({ ...e, ...Ut(e.values, p, o.objectCount) })), [o, p]), De = (e, n) => {
    const a = ne.current;
    q((y) => {
      if (n === "replace") return /* @__PURE__ */ new Set([e]);
      const u = new Set(y);
      if (n === "range" && a !== null) {
        const k = p.indexOf(a), R = p.indexOf(e);
        if (k >= 0 && R >= 0) for (let $ = Math.min(k, R); $ <= Math.max(k, R); $++) u.add(p[$]);
        else u.add(e);
      } else n === "range" ? u.add(e) : u.has(e) ? u.delete(e) : u.add(e);
      return u;
    }), ne.current = e;
  }, [V, Me] = r.useState(null), ye = r.useRef(null), dt = (e) => e.altKey ? "remove" : e.metaKey || e.ctrlKey ? "add" : "replace", Ie = r.useRef(!1), Ke = (e) => {
    const n = se.current, a = n.getBoundingClientRect();
    return { x: e.clientX - a.left + n.scrollLeft, y: e.clientY - a.top + n.scrollTop };
  }, gt = (e) => {
    if (!d || e.button !== 0 || !se.current) return;
    const n = e.target;
    if (n.closest(".gl-wall-tile-pick") || n.closest(".gl-wall-tile") && (e.metaKey || e.ctrlKey || e.shiftKey)) return;
    const a = Ke(e);
    ye.current = { x: a.x, y: a.y, mode: dt(e), active: !1 };
  }, ft = (e) => {
    const n = ye.current;
    if (!n || !se.current) return;
    const a = Ke(e);
    if (!n.active) {
      if (Math.abs(a.x - n.x) < 4 && Math.abs(a.y - n.y) < 4) return;
      n.active = !0;
      const y = se.current;
      if (typeof y.setPointerCapture == "function")
        try {
          y.setPointerCapture(e.pointerId);
        } catch {
        }
    }
    Me({ x0: Math.min(n.x, a.x), y0: Math.min(n.y, a.y), x1: Math.max(n.x, a.x), y1: Math.max(n.y, a.y), mode: n.mode });
  }, pt = (e) => {
    const n = ye.current;
    if (ye.current = null, !n || !n.active) {
      Me(null);
      return;
    }
    const a = Ke(e), y = { x0: Math.min(n.x, a.x), y0: Math.min(n.y, a.y), x1: Math.max(n.x, a.x), y1: Math.max(n.y, a.y) }, u = n.mode;
    Me(null), Ie.current = !0;
    const k = Bt, R = [], $ = Math.max(0, Math.floor((y.x0 - k) / I)), x = Math.min(B - 1, Math.floor((y.x1 - k) / I)), H = Math.max(0, Math.floor((y.y0 - k) / I)), Nt = Math.min(Ne - 1, Math.floor((y.y1 - k) / I));
    for (let ge = H; ge <= Nt; ge++) {
      const fe = k + ge * I;
      if (!(y.y1 < fe || y.y0 > fe + te))
        for (let oe = $; oe <= x; oe++) {
          const lt = k + oe * I;
          if (y.x1 < lt || y.x0 > lt + te) continue;
          const nt = ge * B + oe;
          nt < p.length && R.push(p[nt]);
        }
    }
    if (u === "replace") {
      q(new Set(R)), ne.current = R.length ? R[R.length - 1] : null;
      return;
    }
    R.length !== 0 && (q((ge) => {
      const fe = new Set(ge);
      for (const oe of R)
        u === "remove" ? fe.delete(oe) : fe.add(oe);
      return fe;
    }), ne.current = R[R.length - 1]);
  }, xt = (e) => {
    Ie.current && (Ie.current = !1, e.stopPropagation(), e.preventDefault());
  }, Ze = r.useRef(De);
  Ze.current = De;
  const bt = r.useCallback((e, n) => Ze.current(e, n), []), de = r.useMemo(() => {
    if (je.size === 0) return [];
    const e = [];
    for (let n = 0; n < p.length; n++) je.has(p[n]) && e.push(p[n]);
    return e.sort((n, a) => n - a);
  }, [je, p]), se = r.useRef(null), [ee, yt] = r.useState({ width: 0, height: 0, scrollTop: 0 });
  r.useEffect(() => {
    const e = se.current;
    if (!e || !i) return;
    const n = () => yt({ width: e.clientWidth, height: e.clientHeight, scrollTop: e.scrollTop });
    n();
    const a = typeof ResizeObserver == "function" ? new ResizeObserver(n) : null;
    return a == null || a.observe(e), e.addEventListener("scroll", n, { passive: !0 }), () => {
      a == null || a.disconnect(), e.removeEventListener("scroll", n);
    };
  }, [i]);
  const I = te + Fe, B = Math.max(1, Math.floor((ee.width + Fe) / I)), Ne = Math.ceil(p.length / B), Ve = Math.max(0, Math.floor(ee.scrollTop / I) - at), et = Math.min(Ne, Math.ceil((ee.scrollTop + ee.height) / I) + at), tt = Ve * B, kt = Math.min(p.length, et * B), jt = (() => {
    if (!J || J !== Z || p.length === 0 || ee.height === 0) return null;
    const e = Math.min(p.length - 1, Math.max(0, Math.floor(ee.scrollTop / I)) * B), n = Math.min(p.length - 1, Math.ceil((ee.scrollTop + ee.height) / I) * B - 1);
    return [J[p[e]], J[p[n]]];
  })(), wt = (e, n) => {
    var k;
    const a = [...((k = se.current) == null ? void 0 : k.querySelectorAll(".gl-wall-tile")) ?? []], y = a.indexOf(e);
    if (y < 0) return;
    const u = a[Math.max(0, Math.min(a.length - 1, y + n))];
    u == null || u.focus();
  }, Ct = (e) => {
    const n = e.target;
    if (!n.classList.contains("gl-wall-tile")) return;
    if (d && e.key === " ") {
      const y = Number(n.getAttribute("data-event"));
      Number.isInteger(y) && (e.preventDefault(), De(y, e.shiftKey ? "range" : "toggle"));
      return;
    }
    if (d && e.key === "Escape") {
      q(/* @__PURE__ */ new Set()), ne.current = null;
      return;
    }
    if (d && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a") {
      e.preventDefault(), q(new Set(Array.from(p)));
      return;
    }
    const a = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "ArrowDown" ? B : e.key === "ArrowUp" ? -B : null;
    a !== null && (e.preventDefault(), wt(n, a));
  };
  if (!i) return /* @__PURE__ */ t.jsx("div", { style: { display: "none" } });
  const Mt = (e) => {
    !s || !A || h(s.id, { display: A.map((n) => n.slot === e ? { ...n, enabled: !n.enabled } : n), exposure: ae, outline: he });
  };
  return /* @__PURE__ */ t.jsx("section", { className: "gl-tab-panel gl-tab-fill gl-images-tab", "aria-label": l("Images"), children: !s || !D ? /* @__PURE__ */ t.jsx("div", { className: "gl-empty", children: l("No cell images are attached to the viewed file. Attach a .cvw from the Import menu.") }) : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
    /* @__PURE__ */ t.jsxs("div", { className: "gl-images-toolbar", children: [
      S && S.length > 0 && C && /* @__PURE__ */ t.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ t.jsx("span", { children: l("Population") }),
        /* @__PURE__ */ t.jsxs("select", { value: N ?? "", onChange: (e) => {
          e.target.value && C(e.target.value);
        }, "aria-label": l("Population"), children: [
          N === null && /* @__PURE__ */ t.jsx("option", { value: "", children: m }),
          S.map((e) => /* @__PURE__ */ t.jsxs("option", { value: e.id, children: [
            "  ".repeat(e.depth),
            e.name
          ] }, e.id))
        ] })
      ] }),
      v && T && /* @__PURE__ */ t.jsxs("span", { className: "gl-images-control gl-images-show", role: "group", "aria-label": l("Show"), children: [
        /* @__PURE__ */ t.jsx("button", { type: "button", className: "gl-chip", "aria-pressed": !Pe, onClick: () => Le(!1), children: l("In the population") }),
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            className: "gl-chip",
            "aria-pressed": Pe,
            onClick: () => Le(!0),
            title: l("The cells of {parent} that this population's gate leaves out", { parent: T }),
            children: l("Left out by its gate")
          }
        )
      ] }),
      /* @__PURE__ */ t.jsx("span", { className: "gl-images-count", children: l("{count} cells in {population} · {shown} with images", {
        count: Xe.toLocaleString(),
        population: Ae,
        shown: p.length.toLocaleString()
      }) }),
      /* @__PURE__ */ t.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ t.jsx("span", { children: l("Sort by") }),
        /* @__PURE__ */ t.jsxs("select", { value: F, onChange: (e) => Re(e.target.value), children: [
          /* @__PURE__ */ t.jsx("option", { value: "", children: l("Event order") }),
          U && /* @__PURE__ */ t.jsx("option", { value: ve, children: l("Class") }),
          s.sample.channels.map((e) => /* @__PURE__ */ t.jsx("option", { value: e.key, children: e.label ?? e.key }, e.key))
        ] }),
        /* @__PURE__ */ t.jsx("button", { type: "button", className: "gl-mini-btn", "aria-pressed": ce, onClick: () => We((e) => !e), title: l("Reverse the order"), children: ce ? /* @__PURE__ */ t.jsx(St, { size: 12 }) : /* @__PURE__ */ t.jsx(vt, { size: 12 }) })
      ] }),
      Je && Q && /* @__PURE__ */ t.jsxs("span", { className: "gl-images-histogram", children: [
        !ct && /* @__PURE__ */ t.jsx(
          "select",
          {
            className: "gl-images-hist-channel",
            value: Q.key,
            "aria-label": l("Histogram of"),
            title: l("The channel the histogram shows while the wall is not sorted by one; a range dragged on it limits the wall by that channel"),
            onChange: (e) => {
              ut(e.target.value), pe(null);
            },
            children: s.sample.channels.map((e) => /* @__PURE__ */ t.jsx("option", { value: e.key, children: e.label ?? e.key }, e.key))
          }
        ),
        /* @__PURE__ */ t.jsx(
          Ft,
          {
            histogram: Je,
            label: Ge,
            inView: jt,
            range: L,
            onRange: (e) => pe(e ? { key: Q.key, lo: e[0], hi: e[1] } : null)
          }
        ),
        L && /* @__PURE__ */ t.jsxs("span", { className: "gl-images-range", children: [
          `${Se(L[0])}–${Se(L[1])}`,
          /* @__PURE__ */ t.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => pe(null), title: l("Show every cell again"), "aria-label": l("Show every cell again"), children: /* @__PURE__ */ t.jsx(Rt, { size: 12 }) })
        ] })
      ] }),
      U && /* @__PURE__ */ t.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ t.jsx("span", { children: f ?? l("Class") }),
        /* @__PURE__ */ t.jsxs("select", { value: ue, "aria-label": l("Show class"), onChange: (e) => we(e.target.value), children: [
          /* @__PURE__ */ t.jsx("option", { value: "all", children: l("all classes") }),
          P.map((e, n) => /* @__PURE__ */ t.jsx("option", { value: String(n), children: e.label }, e.label))
        ] })
      ] }),
      /* @__PURE__ */ t.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ t.jsx("span", { children: l("Tile size") }),
        /* @__PURE__ */ t.jsx("input", { type: "range", min: 40, max: 160, step: 8, value: te, onChange: (e) => ot(Number(e.target.value)) })
      ] }),
      /* @__PURE__ */ t.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ t.jsx("span", { children: l("Exposure") }),
        /* @__PURE__ */ t.jsx(
          "input",
          {
            type: "range",
            min: -2,
            max: 2,
            step: 0.05,
            value: Math.log2(ae),
            onChange: (e) => {
              A && h(s.id, { display: A.slice(), exposure: Math.pow(2, Number(e.target.value)), outline: he });
            }
          }
        )
      ] }),
      /* @__PURE__ */ t.jsxs("label", { className: "gl-images-control gl-images-check", title: l("Outline the objects the count found on the mask image, in magenta"), children: [
        /* @__PURE__ */ t.jsx("input", { type: "checkbox", checked: he, onChange: (e) => {
          A && h(s.id, { display: A.slice(), exposure: ae, outline: e.target.checked });
        } }),
        /* @__PURE__ */ t.jsx("span", { children: l("Mask outline") })
      ] }),
      A && /* @__PURE__ */ t.jsx("span", { className: "gl-images-channels", children: A.map((e) => /* @__PURE__ */ t.jsxs("label", { className: "gl-images-channel", title: e.name, children: [
        /* @__PURE__ */ t.jsx("input", { type: "checkbox", checked: e.enabled, onChange: () => Mt(e.slot) }),
        /* @__PURE__ */ t.jsx("span", { className: "gl-cell-chip", style: { background: e.colour } }),
        e.name
      ] }, e.slot)) }),
      /* @__PURE__ */ t.jsx("button", { type: "button", className: "gl-mini-btn", disabled: !M, onClick: K, children: l("Show on plot") }),
      X && /* @__PURE__ */ t.jsxs("label", { className: "gl-images-control gl-images-send", children: [
        /* @__PURE__ */ t.jsx("span", { children: l("Cells") }),
        /* @__PURE__ */ t.jsx("select", { value: Be, onChange: (e) => it(Number(e.target.value)), "aria-label": l("Cells to send"), children: [12, 24, 48, 96, 192].map((e) => /* @__PURE__ */ t.jsx("option", { value: e, children: e }, e)) }),
        /* @__PURE__ */ t.jsx(
          "button",
          {
            type: "button",
            className: "gl-mini-btn",
            disabled: p.length === 0 || !A,
            title: l("Lay the first cells of this wall, in this order, on the Layout tab as one labelled block"),
            onClick: () => {
              if (!A) return;
              const e = Math.min(Be, p.length), n = F ? s.sample.channels.find((a) => a.key === F) : void 0;
              X({
                kind: "imagewall",
                sampleId: s.id,
                fileName: s.name,
                populationId: N ?? "",
                populationName: Ae,
                events: Array.from(p.subarray(0, e)),
                imaged: p.length,
                populationCount: Xe,
                sortKey: F,
                sortLabel: F === ve ? f ?? l("Class") : n ? n.label ?? n.key : "",
                sortDesc: ce,
                display: A.map((a) => ({ ...a })),
                exposure: ae,
                tile: Math.max(24, Math.min(96, Math.round(te * 0.75))),
                columns: e <= 12 ? 6 : e <= 48 ? 8 : 12,
                ...Ce ? { outline: Ce } : {},
                ...L ? { rangeLabel: `${Ge} ${Se(L[0])}–${Se(L[1])}` } : {},
                ...U ? {
                  tileColours: Array.from(p.subarray(0, e), (a) => _e(a) ?? ""),
                  legend: P.map((a) => ({ label: a.label, colour: a.colour }))
                } : {}
              });
            },
            children: l("Send to Layout")
          }
        )
      ] }),
      d && /* @__PURE__ */ t.jsxs(
        "span",
        {
          className: "gl-images-control gl-images-picked",
          title: l("Pick cells as in Photos: click a cell, Cmd/Ctrl-click to add or remove one, Shift-click to extend from the last click, drag a rectangle over the wall (Cmd-drag adds, Option-drag removes), Escape clears, Cmd-A picks all shown"),
          children: [
            /* @__PURE__ */ t.jsx("span", { children: l("{count} picked", { count: de.length.toLocaleString() }) }),
            /* @__PURE__ */ t.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: p.length === 0,
                title: l("Pick every cell now on the wall, within its range and class"),
                onClick: () => {
                  q((e) => {
                    const n = new Set(e);
                    for (let a = 0; a < p.length; a++) n.add(p[a]);
                    return n;
                  });
                },
                children: l("Pick all shown")
              }
            ),
            de.length > 0 && /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
              /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  title: l("Drop every cell now on the wall from the picks"),
                  onClick: () => {
                    q((e) => {
                      const n = new Set(e);
                      for (let a = 0; a < p.length; a++) n.delete(p[a]);
                      return n;
                    });
                  },
                  children: l("Unpick shown")
                }
              ),
              /* @__PURE__ */ t.jsx(
                "input",
                {
                  type: "text",
                  value: re,
                  placeholder: l("Population name"),
                  "aria-label": l("Population name"),
                  onChange: (e) => Ee(e.target.value),
                  onKeyDown: (e) => {
                    e.key === "Enter" && re.trim() && (d(de, re.trim()), q(/* @__PURE__ */ new Set()), Ee(""));
                  }
                }
              ),
              /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  disabled: !re.trim(),
                  title: l("A population of the picked cells under {population}, and one of the rest; the picks become a channel of the file saved with the workspace", { population: Ae }),
                  onClick: () => {
                    d(de, re.trim()), q(/* @__PURE__ */ new Set()), Ee("");
                  },
                  children: l("Make population")
                }
              ),
              Y && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  title: l("Put the picked cells on the Layout tab side by side, one row per cell and a column per channel, to edit there"),
                  onClick: () => {
                    if (!A || !s) return;
                    const e = new Set(de), n = Array.from(p).filter((a) => e.has(a));
                    Y(Pt({
                      sampleId: s.id,
                      fileName: s.name,
                      cells: n.map((a) => {
                        var k;
                        const y = U ? w(a) : null, u = y !== null && P ? (k = P[y]) == null ? void 0 : k.label : null;
                        return { event: a, label: u ? `${l("Event {index}", { index: a.toLocaleString() })} · ${u}` : l("Event {index}", { index: a.toLocaleString() }) };
                      }),
                      display: A,
                      exposure: ae,
                      mask: D != null && D.mask ? { slot: D.mask.slot, fraction: D.mask.fraction } : null,
                      outline: he
                    }));
                  },
                  children: l("Cell panel to Layout")
                }
              ),
              b && /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  title: l("Sort the wall by likeness to the picked cells over the file's channels: the most alike come first, and a range on the histogram keeps them"),
                  onClick: () => {
                    const e = b(de, re.trim() || l("picks"));
                    e && (Re(e), We(!1), pe(null));
                  },
                  children: l("Find similar")
                }
              ),
              /* @__PURE__ */ t.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => {
                q(/* @__PURE__ */ new Set()), ne.current = null;
              }, title: l("Drop every pick"), children: l("Unpick all") })
            ] })
          ]
        }
      )
    ] }),
    o && /* @__PURE__ */ t.jsxs("div", { className: "gl-images-measure", role: "group", "aria-label": l("Measure cells"), children: [
      /* @__PURE__ */ t.jsxs("span", { className: "gl-images-control", children: [
        o.state.kind === "running" ? /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
          /* @__PURE__ */ t.jsx("span", { className: "gl-muted", children: o.state.fileCount > 1 ? l("Measuring {file} ({index} of {count})… {percent}%", {
            file: o.state.fileName,
            index: o.state.fileIndex,
            count: o.state.fileCount,
            percent: o.state.percent
          }) : l("Counting objects… {percent}%", { percent: o.state.percent }) }),
          o.state.cancellable && /* @__PURE__ */ t.jsx("button", { type: "button", className: "gl-mini-btn", onClick: o.onCancel, title: l("Stop measuring; the files already measured keep their results"), children: l("Cancel") })
        ] }) : o.state.kind === "done" ? /* @__PURE__ */ t.jsx("span", { className: "gl-muted", title: l("Every imaged cell of every file with images has its objects counted and measured on its own pictures; the results are channels of each file"), children: o.state.fileCount > 1 ? l("Cells measured in all {count} files", { count: o.state.fileCount }) : l("Cells measured") }) : /* @__PURE__ */ t.jsxs(t.Fragment, { children: [
          /* @__PURE__ */ t.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              onClick: o.onStart,
              title: l("Count the objects in every imaged cell of every file with images, one file after another, and measure them on their own pictures; the results become channels of each file, so a gate on them applies to every file"),
              children: o.state.fileCount > 1 ? l("Measure cells in all {count} files", { count: o.state.fileCount }) : l("Measure cells")
            }
          ),
          o.state.measured > 0 && /* @__PURE__ */ t.jsx("span", { className: "gl-muted", children: l("{measured} of {count} measured", { measured: o.state.measured, count: o.state.fileCount }) })
        ] }),
        (o.failures ?? []).map((e) => /* @__PURE__ */ t.jsx("span", { className: "gl-error-inline", children: l("{file}: {message}", { file: e.fileName, message: e.message }) }, e.fileName))
      ] }),
      /* @__PURE__ */ t.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ t.jsx("span", { children: l("Classes") }),
        /* @__PURE__ */ t.jsxs("select", { value: o.classBy, "aria-label": l("Classes"), onChange: (e) => o.onClassBy(e.target.value), children: [
          /* @__PURE__ */ t.jsx("option", { value: "none", children: l("none") }),
          /* @__PURE__ */ t.jsx("option", { value: "objects", children: l("Objects in image") }),
          /* @__PURE__ */ t.jsx("option", { value: "cellclass", children: l("Single cells") })
        ] })
      ] }),
      o.classBy === "cellclass" && /* @__PURE__ */ t.jsxs(
        "label",
        {
          className: "gl-images-control",
          title: l("How far from the typical single cell, in robust standard deviations, a one-object event may sit and still count as single"),
          children: [
            /* @__PURE__ */ t.jsx("span", { children: l("Strictness") }),
            /* @__PURE__ */ t.jsx(
              "input",
              {
                type: "number",
                min: 1,
                max: 10,
                step: 0.5,
                value: o.strictness,
                "aria-label": l("Strictness"),
                onChange: (e) => o.onStrictness(Math.max(1, Math.min(10, Number(e.target.value) || 3)))
              }
            )
          ]
        }
      ),
      be && /* @__PURE__ */ t.jsx("span", { className: "gl-images-control gl-images-class-counts", role: "group", "aria-label": f ?? l("Class"), children: P.map((e, n) => /* @__PURE__ */ t.jsxs(
        "button",
        {
          type: "button",
          className: "gl-chip",
          "aria-pressed": ue === String(n),
          title: l("Show only this class on the wall; click again to show every class"),
          onClick: () => we(ue === String(n) ? "all" : String(n)),
          children: [
            /* @__PURE__ */ t.jsx("span", { className: "gl-cell-chip", style: { background: e.colour } }),
            l("{label} {count} ({percent}%)", {
              label: e.label,
              count: be.counts[n].toLocaleString(),
              percent: be.total > 0 ? (100 * be.counts[n] / be.total).toFixed(1) : "0"
            })
          ]
        },
        e.label
      )) }),
      _.length > 0 && (() => {
        var k, R, $;
        const e = o.micronsPerPixel ?? null, n = e ?? 1, a = (o.sizeSource ?? "lightloss") === "lightloss", y = _.length >= 3 && _[2].median > 0 ? _[1].median / _[2].median : null, u = Number(Qe);
        return /* @__PURE__ */ t.jsxs(
          "span",
          {
            className: "gl-images-control gl-images-sizes",
            role: "group",
            "aria-label": l("Cell size"),
            title: l(a ? "Measured by GateLab on each cell's own LightLoss picture: the outline of the dark ring a cell makes in the beam, over the one-object cells now on the wall. Median, with the middle half of the cells in brackets. Click one to sort the wall by it." : "Measured by GateLab on each cell's own SSC picture: the outline of the counted object, in image pixels (the spacing of the picture's rows), over the one-object cells now on the wall. Median, with the middle half of the cells in brackets. Click one to sort the wall by it."),
            children: [
              /* @__PURE__ */ t.jsx("span", { children: l(a ? e ? "Cell size (LightLoss outline), µm" : "Cell size (LightLoss outline), px" : "Cell size (SSC mask), px") }),
              _.map((x) => /* @__PURE__ */ t.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-chip",
                  "aria-pressed": F === x.key,
                  onClick: () => {
                    Re(x.key), pe(null);
                  },
                  children: x.n > 0 ? l("{measure} {median} ({q1}–{q3})", { measure: x.label, median: (x.median * n).toFixed(1), q1: (x.q1 * n).toFixed(1), q3: (x.q3 * n).toFixed(1) }) : l("{measure} –", { measure: x.label })
                },
                x.key
              )),
              /* @__PURE__ */ t.jsx("span", { className: "gl-muted", children: l("n = {count}", { count: (((k = _[0]) == null ? void 0 : k.n) ?? 0).toLocaleString() }) }),
              o.onCalibrate && /* @__PURE__ */ t.jsxs(
                "span",
                {
                  className: "gl-images-control gl-images-calibrate",
                  title: l("Run beads of a known diameter and show them on the wall (gate the single beads first): their median outline diameter sets the micrometres per pixel for every file of the workspace, and the sizes are written as micrometre channels saved with it"),
                  children: [
                    /* @__PURE__ */ t.jsx(
                      "input",
                      {
                        type: "number",
                        min: 0.5,
                        max: 100,
                        step: 0.1,
                        value: Qe,
                        placeholder: l("bead µm"),
                        "aria-label": l("Bead diameter in micrometres"),
                        onChange: (x) => mt(x.target.value)
                      }
                    ),
                    /* @__PURE__ */ t.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-mini-btn",
                        disabled: !(u > 0) || !(((R = _[0]) == null ? void 0 : R.n) > 0),
                        onClick: () => o.onCalibrate(u, _[0].median, y),
                        children: l("Set scale from beads")
                      }
                    )
                  ]
                }
              ),
              e && /* @__PURE__ */ t.jsxs("span", { className: "gl-muted gl-images-scale", children: [
                o.calibration ? l("{scale} µm per px, from {bead} µm beads in {file}", { scale: e.toFixed(3), bead: String(o.calibration.beadMicrons), file: o.calibration.fileName }) : l("{scale} µm per px, saved with the workspace", { scale: e.toFixed(3) }),
                ($ = o.calibration) != null && $.axisRatio && o.calibration.axisRatio > 1.05 ? l("; the beads read {ratio}× longer one way than the other, so one image axis is off by about that much", { ratio: o.calibration.axisRatio.toFixed(2) }) : ""
              ] })
            ]
          }
        );
      })()
    ] }),
    U && !o && /* @__PURE__ */ t.jsx("div", { className: "gl-images-legend", "aria-label": f ?? l("Class"), children: P.map((e) => /* @__PURE__ */ t.jsxs("span", { className: "gl-images-legend-item", children: [
      /* @__PURE__ */ t.jsx("span", { className: "gl-cell-chip", style: { background: e.colour } }),
      e.label
    ] }, e.label)) }),
    He && /* @__PURE__ */ t.jsx("div", { className: "gl-error-inline", children: He }),
    /* @__PURE__ */ t.jsxs(
      "div",
      {
        className: "gl-images-scroll",
        ref: se,
        role: "grid",
        "aria-rowcount": Ne,
        onKeyDown: Ct,
        onPointerDown: gt,
        onPointerMove: ft,
        onPointerUp: pt,
        onPointerCancel: () => {
          ye.current = null, Me(null);
        },
        onClickCapture: xt,
        children: [
          V && /* @__PURE__ */ t.jsx(
            "div",
            {
              className: "gl-images-marquee" + (V.mode === "remove" ? " gl-images-marquee-unpick" : ""),
              style: { left: V.x0, top: V.y0, width: Math.max(1, V.x1 - V.x0), height: Math.max(1, V.y1 - V.y0) }
            }
          ),
          /* @__PURE__ */ t.jsx("div", { style: { height: Ve * I } }),
          /* @__PURE__ */ t.jsx("div", { className: "gl-images-grid", style: { gridTemplateColumns: `repeat(${B}, ${te}px)`, gap: Fe }, children: Array.from({ length: Math.max(0, kt - tt) }, (e, n) => {
            const a = p[tt + n];
            return /* @__PURE__ */ t.jsx(
              Ot,
              {
                service: g,
                fileKey: s.id,
                sampleId: s.id,
                eventIndex: a,
                spec: ht,
                size: te,
                pinned: (M == null ? void 0 : M.sampleId) === s.id && M.eventIndex === a,
                onPin: st,
                onOpen: z,
                label: l("Event {index} of {name}", { index: a.toLocaleString(), name: s.name }),
                colour: _e(a),
                picked: je.has(a),
                onPick: d ? bt : void 0
              },
              a
            );
          }) }),
          /* @__PURE__ */ t.jsx("div", { style: { height: Math.max(0, (Ne - et) * I) } })
        ]
      }
    )
  ] }) });
}
function Ht(i, g) {
  return i.visible || g.visible ? !1 : i.stateKey === g.stateKey;
}
const Qt = r.memo(_t, Ht);
export {
  ve as CLASS_SORT,
  Qt as ImagesTab,
  Ht as imagesTabPropsEqual,
  Ut as sizeSummary
};
