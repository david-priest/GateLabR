import { u as Ke, a as c, j as l, b as se, aL as kt } from "./embed-WnndlmUB.js";
import { o as yt, u as wt, d as jt } from "./CellInspector-CzwhDgWa.js";
import { N as Mt } from "./cvwDecode-CKHzN2J_.js";
const Ct = "#7b9bc8", Nt = "rgba(47, 111, 228, 0.22)", St = "rgba(255, 255, 255, 0.6)", Rt = "#2f6fe4";
function Pt({ histogram: r, label: d, inView: s, range: N, onRange: f, width: o = 220, height: u = 40 }) {
  const { t: S } = Ke(), W = c.useRef(null), [I, w] = c.useState(null), j = c.useRef(null), b = (p) => (p - r.lo) / (r.hi - r.lo) * o, M = (p) => r.lo + Math.max(0, Math.min(o, p)) / o * (r.hi - r.lo);
  c.useEffect(() => {
    const p = W.current;
    if (!p) return;
    const i = typeof window < "u" && window.devicePixelRatio > 1 ? window.devicePixelRatio : 1;
    p.width = Math.round(o * i), p.height = Math.round(u * i);
    const h = p.getContext("2d");
    if (!h) return;
    h.setTransform(i, 0, 0, i, 0, 0), h.clearRect(0, 0, o, u);
    const H = r.counts.length, a = o / H;
    h.fillStyle = Ct;
    for (let v = 0; v < H; v++) {
      const D = r.peak > 0 ? r.counts[v] / r.peak * (u - 2) : 0;
      D > 0 && h.fillRect(v * a, u - D, Math.max(1, a - 0.5), D);
    }
    if (s) {
      const v = b(Math.min(s[0], s[1])), D = b(Math.max(s[0], s[1]));
      h.fillStyle = Nt, h.fillRect(v, 0, Math.max(2, D - v), u);
    }
    const F = I ?? N;
    if (F) {
      const v = b(Math.min(F[0], F[1])), D = b(Math.max(F[0], F[1]));
      h.fillStyle = St, h.fillRect(0, 0, v, u), h.fillRect(D, 0, o - D, u), h.strokeStyle = Rt, h.lineWidth = 1, h.beginPath(), h.moveTo(v + 0.5, 0), h.lineTo(v + 0.5, u), h.moveTo(D - 0.5, 0), h.lineTo(D - 0.5, u), h.stroke();
    }
  }, [r, s, N, I, o, u]);
  const A = (p) => p.clientX - p.currentTarget.getBoundingClientRect().left, G = (p) => {
    if (p.button !== 0) return;
    const i = A(p);
    j.current = [i, i], w([M(i), M(i)]);
    const h = p.currentTarget;
    if (typeof h.setPointerCapture == "function")
      try {
        h.setPointerCapture(p.pointerId);
      } catch {
      }
  }, k = (p) => {
    if (!j.current) return;
    const i = A(p);
    j.current = [j.current[0], i], w([M(j.current[0]), M(i)]);
  }, E = (p) => {
    const i = j.current;
    if (j.current = null, w(null), !i) return;
    const h = A(p);
    if (Math.abs(h - i[0]) < 3) {
      f(null);
      return;
    }
    const H = M(i[0]), a = M(h);
    f([Math.min(H, a), Math.max(H, a)]);
  };
  return /* @__PURE__ */ l.jsx(
    "canvas",
    {
      ref: W,
      className: "gl-wall-histogram",
      role: "img",
      "aria-label": S("Distribution of {channel} over the wall's cells; drag across it to show only a range of values, click it to show them all", { channel: d }),
      title: S("Distribution of {channel} over the wall's cells; drag across it to show only a range of values, click it to show them all", { channel: d }),
      style: { width: o, height: u },
      onPointerDown: G,
      onPointerMove: k,
      onPointerUp: E,
      onPointerCancel: () => {
        j.current = null, w(null);
      }
    }
  );
}
function Tt(r, d) {
  let s = 1 / 0, N = -1 / 0;
  for (let f = 0; f < d.length; f++) {
    const o = r[d[f]];
    Number.isFinite(o) && (o < s && (s = o), o > N && (N = o));
  }
  return s <= N ? [s, N] : null;
}
function Et(r, d, s = 64) {
  const N = Tt(r, d);
  if (!N) return null;
  let [f, o] = N;
  o === f && (f -= 0.5, o += 0.5);
  const u = new Uint32Array(Math.max(1, s)), S = (o - f) / u.length;
  let W = 0;
  for (let w = 0; w < d.length; w++) {
    const j = r[d[w]];
    if (!Number.isFinite(j)) continue;
    let b = Math.floor((j - f) / S);
    b >= u.length && (b = u.length - 1), b < 0 && (b = 0), u[b]++, W++;
  }
  let I = 0;
  for (const w of u) w > I && (I = w);
  return { counts: u, lo: f, hi: o, total: W, peak: I };
}
function At(r, d, s, N) {
  const f = new Int32Array(d.length);
  let o = 0;
  for (let u = 0; u < d.length; u++) {
    const S = r[d[u]];
    S >= s && S <= N && (f[o++] = d[u]);
  }
  return f.subarray(0, o);
}
function Me(r) {
  if (!Number.isFinite(r)) return "–";
  if (r === 0) return "0";
  const d = Math.abs(r);
  if (d >= 1e6 || d < 1e-3) return r.toExponential(2).replace(/\.?0+e/, "e");
  const s = Math.max(0, 2 - Math.floor(Math.log10(d)));
  return r.toFixed(Math.min(6, s)).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
const Ce = "__class__", De = 4, Qe = 2, vt = 6, Dt = Mt, Kt = c.memo(function({ service: d, fileKey: s, sampleId: N, eventIndex: f, spec: o, size: u, pinned: S, onPin: W, onOpen: I, label: w, colour: j = null, picked: b = !1, onPick: M }) {
  var p;
  const { t: A } = Ke(), G = wt(d, s, f, o, "batch"), k = ((p = G.result) == null ? void 0 : p.kind) === "image" ? G.result.image : null, E = c.useRef(null);
  return c.useEffect(() => {
    if (!(k != null && k.composite) || !E.current) return;
    const i = k.cols * k.aspect, h = Math.min(u / i, u / k.rows);
    jt(E.current, k.composite, i * h, k.rows * h);
  }, [k, u]), /* @__PURE__ */ l.jsxs(
    "button",
    {
      type: "button",
      role: "gridcell",
      className: "gl-wall-tile" + (S ? " gl-wall-tile-pinned" : "") + (j ? " gl-wall-tile-classed" : "") + (b ? " gl-wall-tile-picked" : ""),
      style: { width: u, height: u },
      title: w,
      "aria-label": w,
      "aria-selected": S,
      "aria-checked": M ? b : void 0,
      "data-event": f,
      onClick: (i) => {
        if (M) {
          if (i.metaKey || i.ctrlKey) {
            M(f, "toggle");
            return;
          }
          if (i.shiftKey) {
            M(f, "range");
            return;
          }
          M(f, "replace");
        }
        W({ sampleId: N, eventIndex: f });
      },
      onDoubleClick: I,
      children: [
        k ? /* @__PURE__ */ l.jsx("canvas", { ref: E }) : /* @__PURE__ */ l.jsx("span", { className: "gl-wall-tile-empty", children: G.status === "none" ? "·" : "" }),
        j && /* @__PURE__ */ l.jsx("span", { className: "gl-wall-tile-ring", "aria-hidden": "true", style: { boxShadow: `inset 0 0 0 2px ${j}` } }),
        M && /* @__PURE__ */ l.jsx(
          "span",
          {
            className: "gl-wall-tile-pick" + (b ? " is-picked" : ""),
            role: "checkbox",
            "aria-checked": b,
            "aria-label": A(b ? "Unpick" : "Pick"),
            title: A(b ? "Unpick" : "Pick"),
            onClick: (i) => {
              i.stopPropagation(), M(f, i.shiftKey ? "range" : "toggle");
            },
            children: b ? "✓" : ""
          }
        ),
        /* @__PURE__ */ l.jsx("span", { className: "gl-wall-tile-index", children: f.toLocaleString() })
      ]
    }
  );
});
function Lt({
  visible: r,
  service: d,
  entry: s,
  mask: N,
  populationLabel: f,
  view: o,
  onViewChange: u,
  pinned: S,
  onPin: W,
  onShowOnPlot: I,
  populationId: w = null,
  populations: j,
  onChoosePopulation: b,
  excludedMask: M = null,
  parentName: A = null,
  onSendToLayout: G,
  classOf: k,
  classes: E,
  classTitle: p,
  onMakePopulation: i,
  onFindSimilar: h,
  onSendCellPanel: H
}) {
  const { t: a } = Ke(), F = c.useRef(I);
  F.current = I;
  const v = c.useCallback(() => F.current(), []), D = c.useRef(W);
  D.current = W;
  const Ze = c.useCallback((e) => D.current(e), []), [O, Le] = se("images.sortKey", ""), [ae, Ie] = se("images.sortDesc", !1), [Z, Ve] = se("images.tileSize", 72), [Ne, Se] = c.useState(!1);
  c.useEffect(() => {
    Se(!1);
  }, [w]);
  const $e = Ne && !!M && !!A, oe = $e ? M : N, Re = $e ? a("{parent} without {population}", { parent: A ?? "", population: f }) : f, [We, et] = se("images.wallCount", 48), [pe, xe] = se("images.range", null), V = s && O && O !== Ce ? s.sample.channels.findIndex((e) => e.key === O) : -1, tt = V >= 0 && s ? s.sample.channels[V] : null, q = c.useMemo(() => s && V >= 0 ? s.sample.displayColumn(V) : null, [s, V]), [lt, nt] = se("images.histKey", ""), fe = s ? V >= 0 ? V : Math.max(0, s.sample.channels.findIndex((e) => e.key === lt)) : -1, z = fe >= 0 && s ? s.sample.channels[fe] : null, Oe = z ? z.label ?? z.key : "", B = c.useMemo(() => s && fe >= 0 ? s.sample.displayColumn(fe) : null, [s, fe]), R = B && z && pe && pe.key === z.key ? [pe.lo, pe.hi] : null, [be, $] = c.useState(() => /* @__PURE__ */ new Set()), [ie, Pe] = c.useState(""), ee = c.useRef(null);
  c.useEffect(() => {
    $(/* @__PURE__ */ new Set()), ee.current = null;
  }, [s == null ? void 0 : s.id, oe]);
  const X = !!E && !!k, [ke, st] = se("images.wallClass", "all"), Ue = (e) => {
    var n;
    if (!E || !k) return null;
    const t = k(e);
    return t === null ? null : ((n = E[t]) == null ? void 0 : n.colour) ?? null;
  }, K = (s == null ? void 0 : s.images) ?? null, P = (o == null ? void 0 : o.display) ?? (K == null ? void 0 : K.display) ?? null, te = (o == null ? void 0 : o.exposure) ?? 1, re = (o == null ? void 0 : o.outline) ?? !1, ye = yt(re, K), [ce, Te] = c.useState(null);
  c.useEffect(() => {
    if (!d || !s || !K || !r) return;
    const e = d.knownInfo(s.id);
    if (e) {
      Te({ id: s.id, info: e, error: null });
      return;
    }
    let t = !0;
    return d.info(s.id).then(
      (n) => {
        t && Te({ id: s.id, info: n, error: null });
      },
      (n) => {
        t && Te({ id: s.id, info: null, error: n instanceof Error ? n.message : String(n) });
      }
    ), () => {
      t = !1;
    };
  }, [d, s, K, r]);
  const ue = ce && s && ce.id === s.id ? ce.info : null, _e = ce && s && ce.id === s.id ? ce.error : null, at = c.useMemo(() => !P || !ue ? null : { display: P, scale: ue.scale, exposure: te, hop: Dt, composite: !0, channels: [], ...ye ? { outline: ye } : {} }, [P, ue, te, re, K]), { events: m, inPopulation: Ge, all: He } = c.useMemo(() => {
    if (!s || !ue) return { events: new Int32Array(0), inPopulation: 0, all: new Int32Array(0) };
    const e = s.sample.fcs.nEvents, t = ue.hasImage;
    let n = 0, x = 0;
    for (let y = 0; y < e; y++)
      oe && !oe[y] || (n++, t[y] && x++);
    let g = new Int32Array(x), C = 0;
    for (let y = 0; y < e; y++)
      oe && !oe[y] || t[y] && (g[C++] = y);
    if (X && ke !== "all") {
      const y = Number(ke);
      g = g.filter((_) => k(_) === y);
    }
    const T = g;
    B && R && (g = At(B, g, R[0], R[1]).slice());
    const Q = ae ? -1 : 1;
    return O === Ce && X ? g.sort((y, _) => Q * ((k(y) ?? 99) - (k(_) ?? 99)) || y - _) : q ? g.sort((y, _) => Q * (q[y] - q[_]) || y - _) : ae && g.reverse(), { events: g, inPopulation: n, all: T };
  }, [s, ue, oe, O, ae, X, k, ke, q, B, R == null ? void 0 : R[0], R == null ? void 0 : R[1]]), Fe = c.useMemo(() => B ? Et(B, He) : null, [B, He]), Ee = (e, t) => {
    const n = ee.current;
    $((x) => {
      if (t === "replace") return /* @__PURE__ */ new Set([e]);
      const g = new Set(x);
      if (t === "range" && n !== null) {
        const C = m.indexOf(n), T = m.indexOf(e);
        if (C >= 0 && T >= 0) for (let Q = Math.min(C, T); Q <= Math.max(C, T); Q++) g.add(m[Q]);
        else g.add(e);
      } else t === "range" ? g.add(e) : g.has(e) ? g.delete(e) : g.add(e);
      return g;
    }), ee.current = e;
  }, [Y, we] = c.useState(null), ge = c.useRef(null), ot = (e) => e.altKey ? "remove" : e.metaKey || e.ctrlKey ? "add" : "replace", Ae = c.useRef(!1), ve = (e) => {
    const t = le.current, n = t.getBoundingClientRect();
    return { x: e.clientX - n.left + t.scrollLeft, y: e.clientY - n.top + t.scrollTop };
  }, it = (e) => {
    if (!i || e.button !== 0 || !le.current) return;
    const t = e.target;
    if (t.closest(".gl-wall-tile-pick") || t.closest(".gl-wall-tile") && (e.metaKey || e.ctrlKey || e.shiftKey)) return;
    const n = ve(e);
    ge.current = { x: n.x, y: n.y, mode: ot(e), active: !1 };
  }, rt = (e) => {
    const t = ge.current;
    if (!t || !le.current) return;
    const n = ve(e);
    if (!t.active) {
      if (Math.abs(n.x - t.x) < 4 && Math.abs(n.y - t.y) < 4) return;
      t.active = !0;
      const x = le.current;
      if (typeof x.setPointerCapture == "function")
        try {
          x.setPointerCapture(e.pointerId);
        } catch {
        }
    }
    we({ x0: Math.min(t.x, n.x), y0: Math.min(t.y, n.y), x1: Math.max(t.x, n.x), y1: Math.max(t.y, n.y), mode: t.mode });
  }, ct = (e) => {
    const t = ge.current;
    if (ge.current = null, !t || !t.active) {
      we(null);
      return;
    }
    const n = ve(e), x = { x0: Math.min(t.x, n.x), y0: Math.min(t.y, n.y), x1: Math.max(t.x, n.x), y1: Math.max(t.y, n.y) }, g = t.mode;
    we(null), Ae.current = !0;
    const C = vt, T = [], Q = Math.max(0, Math.floor((x.x0 - C) / L)), y = Math.min(U - 1, Math.floor((x.x1 - C) / L)), _ = Math.max(0, Math.floor((x.y0 - C) / L)), bt = Math.min(je - 1, Math.floor((x.y1 - C) / L));
    for (let me = _; me <= bt; me++) {
      const de = C + me * L;
      if (!(x.y1 < de || x.y0 > de + Z))
        for (let ne = Q; ne <= y; ne++) {
          const Ye = C + ne * L;
          if (x.x1 < Ye || x.x0 > Ye + Z) continue;
          const Je = me * U + ne;
          Je < m.length && T.push(m[Je]);
        }
    }
    if (g === "replace") {
      $(new Set(T)), ee.current = T.length ? T[T.length - 1] : null;
      return;
    }
    T.length !== 0 && ($((me) => {
      const de = new Set(me);
      for (const ne of T)
        g === "remove" ? de.delete(ne) : de.add(ne);
      return de;
    }), ee.current = T[T.length - 1]);
  }, ut = (e) => {
    Ae.current && (Ae.current = !1, e.stopPropagation(), e.preventDefault());
  }, qe = c.useRef(Ee);
  qe.current = Ee;
  const ht = c.useCallback((e, t) => qe.current(e, t), []), he = c.useMemo(() => {
    if (be.size === 0) return [];
    const e = [];
    for (let t = 0; t < m.length; t++) be.has(m[t]) && e.push(m[t]);
    return e.sort((t, n) => t - n);
  }, [be, m]), le = c.useRef(null), [J, mt] = c.useState({ width: 0, height: 0, scrollTop: 0 });
  c.useEffect(() => {
    const e = le.current;
    if (!e || !r) return;
    const t = () => mt({ width: e.clientWidth, height: e.clientHeight, scrollTop: e.scrollTop });
    t();
    const n = typeof ResizeObserver == "function" ? new ResizeObserver(t) : null;
    return n == null || n.observe(e), e.addEventListener("scroll", t, { passive: !0 }), () => {
      n == null || n.disconnect(), e.removeEventListener("scroll", t);
    };
  }, [r]);
  const L = Z + De, U = Math.max(1, Math.floor((J.width + De) / L)), je = Math.ceil(m.length / U), ze = Math.max(0, Math.floor(J.scrollTop / L) - Qe), Be = Math.min(je, Math.ceil((J.scrollTop + J.height) / L) + Qe), Xe = ze * U, dt = Math.min(m.length, Be * U), ft = (() => {
    if (!q || q !== B || m.length === 0 || J.height === 0) return null;
    const e = Math.min(m.length - 1, Math.max(0, Math.floor(J.scrollTop / L)) * U), t = Math.min(m.length - 1, Math.ceil((J.scrollTop + J.height) / L) * U - 1);
    return [q[m[e]], q[m[t]]];
  })(), gt = (e, t) => {
    var C;
    const n = [...((C = le.current) == null ? void 0 : C.querySelectorAll(".gl-wall-tile")) ?? []], x = n.indexOf(e);
    if (x < 0) return;
    const g = n[Math.max(0, Math.min(n.length - 1, x + t))];
    g == null || g.focus();
  }, pt = (e) => {
    const t = e.target;
    if (!t.classList.contains("gl-wall-tile")) return;
    if (i && e.key === " ") {
      const x = Number(t.getAttribute("data-event"));
      Number.isInteger(x) && (e.preventDefault(), Ee(x, e.shiftKey ? "range" : "toggle"));
      return;
    }
    if (i && e.key === "Escape") {
      $(/* @__PURE__ */ new Set()), ee.current = null;
      return;
    }
    if (i && (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "a") {
      e.preventDefault(), $(new Set(Array.from(m)));
      return;
    }
    const n = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : e.key === "ArrowDown" ? U : e.key === "ArrowUp" ? -U : null;
    n !== null && (e.preventDefault(), gt(t, n));
  };
  if (!r) return /* @__PURE__ */ l.jsx("div", { style: { display: "none" } });
  const xt = (e) => {
    !s || !P || u(s.id, { display: P.map((t) => t.slot === e ? { ...t, enabled: !t.enabled } : t), exposure: te, outline: re });
  };
  return /* @__PURE__ */ l.jsx("section", { className: "gl-tab-panel gl-tab-fill gl-images-tab", "aria-label": a("Images"), children: !s || !K ? /* @__PURE__ */ l.jsx("div", { className: "gl-empty", children: a("No cell images are attached to the viewed file. Attach a .cvw from the Import menu.") }) : /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsxs("div", { className: "gl-images-toolbar", children: [
      j && j.length > 0 && b && /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ l.jsx("span", { children: a("Population") }),
        /* @__PURE__ */ l.jsxs("select", { value: w ?? "", onChange: (e) => {
          e.target.value && b(e.target.value);
        }, "aria-label": a("Population"), children: [
          w === null && /* @__PURE__ */ l.jsx("option", { value: "", children: f }),
          j.map((e) => /* @__PURE__ */ l.jsxs("option", { value: e.id, children: [
            "  ".repeat(e.depth),
            e.name
          ] }, e.id))
        ] })
      ] }),
      M && A && /* @__PURE__ */ l.jsxs("span", { className: "gl-images-control gl-images-show", role: "group", "aria-label": a("Show"), children: [
        /* @__PURE__ */ l.jsx("button", { type: "button", className: "gl-chip", "aria-pressed": !Ne, onClick: () => Se(!1), children: a("In the population") }),
        /* @__PURE__ */ l.jsx(
          "button",
          {
            type: "button",
            className: "gl-chip",
            "aria-pressed": Ne,
            onClick: () => Se(!0),
            title: a("The cells of {parent} that this population's gate leaves out", { parent: A }),
            children: a("Left out by its gate")
          }
        )
      ] }),
      /* @__PURE__ */ l.jsx("span", { className: "gl-images-count", children: a("{count} cells in {population} · {shown} with images", {
        count: Ge.toLocaleString(),
        population: Re,
        shown: m.length.toLocaleString()
      }) }),
      /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ l.jsx("span", { children: a("Sort by") }),
        /* @__PURE__ */ l.jsxs("select", { value: O, onChange: (e) => Le(e.target.value), children: [
          /* @__PURE__ */ l.jsx("option", { value: "", children: a("Event order") }),
          X && /* @__PURE__ */ l.jsx("option", { value: Ce, children: a("Class") }),
          s.sample.channels.map((e) => /* @__PURE__ */ l.jsx("option", { value: e.key, children: e.label ?? e.key }, e.key))
        ] }),
        /* @__PURE__ */ l.jsx("button", { type: "button", className: "gl-mini-btn", "aria-pressed": ae, onClick: () => Ie((e) => !e), title: a("Reverse the order"), children: ae ? "↓" : "↑" })
      ] }),
      Fe && z && /* @__PURE__ */ l.jsxs("span", { className: "gl-images-histogram", children: [
        !tt && /* @__PURE__ */ l.jsx(
          "select",
          {
            className: "gl-images-hist-channel",
            value: z.key,
            "aria-label": a("Histogram of"),
            title: a("The channel the histogram shows while the wall is not sorted by one; a range dragged on it limits the wall by that channel"),
            onChange: (e) => {
              nt(e.target.value), xe(null);
            },
            children: s.sample.channels.map((e) => /* @__PURE__ */ l.jsx("option", { value: e.key, children: e.label ?? e.key }, e.key))
          }
        ),
        /* @__PURE__ */ l.jsx(
          Pt,
          {
            histogram: Fe,
            label: Oe,
            inView: ft,
            range: R,
            onRange: (e) => xe(e ? { key: z.key, lo: e[0], hi: e[1] } : null)
          }
        ),
        R && /* @__PURE__ */ l.jsxs("span", { className: "gl-images-range", children: [
          `${Me(R[0])}–${Me(R[1])}`,
          /* @__PURE__ */ l.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => xe(null), title: a("Show every cell again"), children: "×" })
        ] })
      ] }),
      X && /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ l.jsx("span", { children: p ?? a("Class") }),
        /* @__PURE__ */ l.jsxs("select", { value: ke, "aria-label": a("Show class"), onChange: (e) => st(e.target.value), children: [
          /* @__PURE__ */ l.jsx("option", { value: "all", children: a("all classes") }),
          E.map((e, t) => /* @__PURE__ */ l.jsx("option", { value: String(t), children: e.label }, e.label))
        ] })
      ] }),
      /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control", children: [
        /* @__PURE__ */ l.jsx("span", { children: a("Tile size") }),
        /* @__PURE__ */ l.jsx("input", { type: "range", min: 40, max: 160, step: 8, value: Z, onChange: (e) => Ve(Number(e.target.value)) })
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
            value: Math.log2(te),
            onChange: (e) => {
              P && u(s.id, { display: P.slice(), exposure: Math.pow(2, Number(e.target.value)), outline: re });
            }
          }
        )
      ] }),
      /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control gl-images-check", title: a("Outline the objects the count found on the mask image, in magenta"), children: [
        /* @__PURE__ */ l.jsx("input", { type: "checkbox", checked: re, onChange: (e) => {
          P && u(s.id, { display: P.slice(), exposure: te, outline: e.target.checked });
        } }),
        /* @__PURE__ */ l.jsx("span", { children: a("Mask outline") })
      ] }),
      P && /* @__PURE__ */ l.jsx("span", { className: "gl-images-channels", children: P.map((e) => /* @__PURE__ */ l.jsxs("label", { className: "gl-images-channel", title: e.name, children: [
        /* @__PURE__ */ l.jsx("input", { type: "checkbox", checked: e.enabled, onChange: () => xt(e.slot) }),
        /* @__PURE__ */ l.jsx("span", { className: "gl-cell-chip", style: { background: e.colour } }),
        e.name
      ] }, e.slot)) }),
      /* @__PURE__ */ l.jsx("button", { type: "button", className: "gl-mini-btn", disabled: !S, onClick: I, children: a("Show on plot") }),
      G && /* @__PURE__ */ l.jsxs("label", { className: "gl-images-control gl-images-send", children: [
        /* @__PURE__ */ l.jsx("span", { children: a("Cells") }),
        /* @__PURE__ */ l.jsx("select", { value: We, onChange: (e) => et(Number(e.target.value)), "aria-label": a("Cells to send"), children: [12, 24, 48, 96, 192].map((e) => /* @__PURE__ */ l.jsx("option", { value: e, children: e }, e)) }),
        /* @__PURE__ */ l.jsx(
          "button",
          {
            type: "button",
            className: "gl-mini-btn",
            disabled: m.length === 0 || !P,
            title: a("Lay the first cells of this wall, in this order, on the Layout tab as one labelled block"),
            onClick: () => {
              if (!P) return;
              const e = Math.min(We, m.length), t = O ? s.sample.channels.find((n) => n.key === O) : void 0;
              G({
                kind: "imagewall",
                sampleId: s.id,
                fileName: s.name,
                populationId: w ?? "",
                populationName: Re,
                events: Array.from(m.subarray(0, e)),
                imaged: m.length,
                populationCount: Ge,
                sortKey: O,
                sortLabel: O === Ce ? p ?? a("Class") : t ? t.label ?? t.key : "",
                sortDesc: ae,
                display: P.map((n) => ({ ...n })),
                exposure: te,
                tile: Math.max(24, Math.min(96, Math.round(Z * 0.75))),
                columns: e <= 12 ? 6 : e <= 48 ? 8 : 12,
                ...ye ? { outline: ye } : {},
                ...R ? { rangeLabel: `${Oe} ${Me(R[0])}–${Me(R[1])}` } : {},
                ...X ? {
                  tileColours: Array.from(m.subarray(0, e), (n) => Ue(n) ?? ""),
                  legend: E.map((n) => ({ label: n.label, colour: n.colour }))
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
            /* @__PURE__ */ l.jsx("span", { children: a("{count} picked", { count: he.length.toLocaleString() }) }),
            /* @__PURE__ */ l.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: m.length === 0,
                title: a("Pick every cell now on the wall, within its range and class"),
                onClick: () => {
                  $((e) => {
                    const t = new Set(e);
                    for (let n = 0; n < m.length; n++) t.add(m[n]);
                    return t;
                  });
                },
                children: a("Pick all shown")
              }
            ),
            he.length > 0 && /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
              /* @__PURE__ */ l.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  title: a("Drop every cell now on the wall from the picks"),
                  onClick: () => {
                    $((e) => {
                      const t = new Set(e);
                      for (let n = 0; n < m.length; n++) t.delete(m[n]);
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
                  value: ie,
                  placeholder: a("Population name"),
                  "aria-label": a("Population name"),
                  onChange: (e) => Pe(e.target.value),
                  onKeyDown: (e) => {
                    e.key === "Enter" && ie.trim() && (i(he, ie.trim()), $(/* @__PURE__ */ new Set()), Pe(""));
                  }
                }
              ),
              /* @__PURE__ */ l.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  disabled: !ie.trim(),
                  title: a("A population of the picked cells under {population}, and one of the rest; the picks become a channel of the file saved with the workspace", { population: Re }),
                  onClick: () => {
                    i(he, ie.trim()), $(/* @__PURE__ */ new Set()), Pe("");
                  },
                  children: a("Make population")
                }
              ),
              H && /* @__PURE__ */ l.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  title: a("Put the picked cells on the Layout tab side by side, one row per cell and a column per channel, to edit there"),
                  onClick: () => {
                    if (!P || !s) return;
                    const e = new Set(he), t = Array.from(m).filter((n) => e.has(n));
                    H(kt({
                      sampleId: s.id,
                      fileName: s.name,
                      cells: t.map((n) => {
                        var C;
                        const x = X ? k(n) : null, g = x !== null && E ? (C = E[x]) == null ? void 0 : C.label : null;
                        return { event: n, label: g ? `${a("Event {index}", { index: n.toLocaleString() })} · ${g}` : a("Event {index}", { index: n.toLocaleString() }) };
                      }),
                      display: P,
                      exposure: te,
                      mask: K != null && K.mask ? { slot: K.mask.slot, fraction: K.mask.fraction } : null,
                      outline: re
                    }));
                  },
                  children: a("Cell panel to Layout")
                }
              ),
              h && /* @__PURE__ */ l.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  title: a("Sort the wall by likeness to the picked cells over the file's channels: the most alike come first, and a range on the histogram keeps them"),
                  onClick: () => {
                    const e = h(he, ie.trim() || a("picks"));
                    e && (Le(e), Ie(!1), xe(null));
                  },
                  children: a("Find similar")
                }
              ),
              /* @__PURE__ */ l.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => {
                $(/* @__PURE__ */ new Set()), ee.current = null;
              }, title: a("Drop every pick"), children: a("Unpick all") })
            ] })
          ]
        }
      )
    ] }),
    X && /* @__PURE__ */ l.jsx("div", { className: "gl-images-legend", "aria-label": p ?? a("Class"), children: E.map((e) => /* @__PURE__ */ l.jsxs("span", { className: "gl-images-legend-item", children: [
      /* @__PURE__ */ l.jsx("span", { className: "gl-cell-chip", style: { background: e.colour } }),
      e.label
    ] }, e.label)) }),
    _e && /* @__PURE__ */ l.jsx("div", { className: "gl-error-inline", children: _e }),
    /* @__PURE__ */ l.jsxs(
      "div",
      {
        className: "gl-images-scroll",
        ref: le,
        role: "grid",
        "aria-rowcount": je,
        onKeyDown: pt,
        onPointerDown: it,
        onPointerMove: rt,
        onPointerUp: ct,
        onPointerCancel: () => {
          ge.current = null, we(null);
        },
        onClickCapture: ut,
        children: [
          Y && /* @__PURE__ */ l.jsx(
            "div",
            {
              className: "gl-images-marquee" + (Y.mode === "remove" ? " gl-images-marquee-unpick" : ""),
              style: { left: Y.x0, top: Y.y0, width: Math.max(1, Y.x1 - Y.x0), height: Math.max(1, Y.y1 - Y.y0) }
            }
          ),
          /* @__PURE__ */ l.jsx("div", { style: { height: ze * L } }),
          /* @__PURE__ */ l.jsx("div", { className: "gl-images-grid", style: { gridTemplateColumns: `repeat(${U}, ${Z}px)`, gap: De }, children: Array.from({ length: Math.max(0, dt - Xe) }, (e, t) => {
            const n = m[Xe + t];
            return /* @__PURE__ */ l.jsx(
              Kt,
              {
                service: d,
                fileKey: s.id,
                sampleId: s.id,
                eventIndex: n,
                spec: at,
                size: Z,
                pinned: (S == null ? void 0 : S.sampleId) === s.id && S.eventIndex === n,
                onPin: Ze,
                onOpen: v,
                label: a("Event {index} of {name}", { index: n.toLocaleString(), name: s.name }),
                colour: Ue(n),
                picked: be.has(n),
                onPick: i ? ht : void 0
              },
              n
            );
          }) }),
          /* @__PURE__ */ l.jsx("div", { style: { height: Math.max(0, (je - Be) * L) } })
        ]
      }
    )
  ] }) });
}
function It(r, d) {
  return r.visible || d.visible ? !1 : r.stateKey === d.stateKey;
}
const Ut = c.memo(Lt, It);
export {
  Ce as CLASS_SORT,
  Ut as ImagesTab,
  It as imagesTabPropsEqual
};
