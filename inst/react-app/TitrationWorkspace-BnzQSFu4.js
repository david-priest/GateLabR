import { u as q, r as M, a1 as ge, j as e, a2 as V, t as pe, a3 as me, a4 as Q, w as be, a5 as je, a6 as Ne, a7 as ye, M as ve, a8 as Ie } from "./embed-DE3p7Uql.js";
import { a as Me, s as Se, f as re, F as J, t as X } from "./spilloverEstimate-BWFwderd.js";
const H = ["negativeLower", "negativeUpper", "positiveLower", "positiveUpper"], Ce = {
  negativeLower: "Lower boundary of the negative events",
  negativeUpper: "Upper boundary of the negative events",
  positiveLower: "Lower boundary of the positive events",
  positiveUpper: "Upper boundary of the positive events"
}, ce = { negativeLower: null, negativeUpper: null, positiveLower: null, positiveUpper: null }, de = { stainIndex: "Stain index", negativeSpread: "Negative spread", positiveMedian: "Positive median", negativeMedian: "Negative median" }, B = (a) => a == null ? "—" : be(a, 4);
function ue() {
  return { id: crypto.randomUUID(), clone: "", conjugate: "", lot: "", detector: "", unit: "", tubes: [], chosenDose: null, note: "" };
}
function he(a, i) {
  return [a.clone, a.conjugate, a.lot, a.detector].filter(Boolean).join(" · ") || i("Unnamed series");
}
function we(a, i, c) {
  const h = a == null ? void 0 : a.detectors.find((g) => g.id === i);
  if (!a || !h) return null;
  const o = a.values(i), n = c === null ? null : a.mask(c);
  if (!o || c !== null && (!n || n.length !== o.length)) return null;
  let f = 1 / 0, l = -1 / 0;
  const v = n ? [] : null;
  for (let g = 0; g < o.length; g++)
    n && !n[g] || !Number.isFinite(o[g]) || (v == null || v.push(g), f = Math.min(f, o[g]), l = Math.max(l, o[g]));
  return { values: o, mask: n, events: v, range: h.range, min: f, max: l };
}
function De(a, i) {
  const c = new Map(a.map((o) => [o.id, o])), h = /* @__PURE__ */ new Map();
  return (o) => {
    const n = c.get(o.fileId), f = JSON.stringify(H.map((x) => o[x]));
    let l = h.get(o.fileId);
    if ((!l || l.population !== o.populationId) && (l = { population: o.populationId, source: we(n, i, o.populationId), bounds: "", statistics: null }, h.set(o.fileId, l)), f !== l.bounds) {
      const { source: x } = l;
      l.statistics = x ? me(x.values, x.mask, o, x.range) : null, l.bounds = f;
    }
    const v = o.reviewed, g = !!(!l.source && (v == null ? void 0 : v.detector) === i && v.populationId === o.populationId && v.statistics);
    return {
      tube: o,
      file: n,
      name: (n == null ? void 0 : n.name) ?? (v == null ? void 0 : v.fileName) ?? o.fileId,
      dose: Q(o.dose),
      source: l.source,
      saved: g,
      statistics: g ? v.statistics : l.statistics
    };
  };
}
function Le(a, i) {
  const { tube: c, source: h, saved: o, statistics: n } = a, f = [];
  return h || f.push(i(o ? "Last saved measurements" : "Source or population unavailable")), V(c) || f.push(i("Set ordered, non-overlapping intervals.")), n && (n.negativeCount < J && f.push(i("Only {count} negative events (fewer than {limit}).", { count: n.negativeCount, limit: J })), n.positiveCount < J && f.push(i("Only {count} positive events (fewer than {limit}).", { count: n.positiveCount, limit: J })), n.negativeSpread === 0 && f.push(i("Zero negative spread. The stain index is undefined.")), (n.saturationFraction ?? 0) > 0.01 && f.push(i("{percent} of positive events reach 99% of detector range.", { percent: pe(n.saturationFraction) }))), f;
}
function Te(a) {
  let i = 1 / 0, c = -1 / 0, h = 0;
  for (const { source: v } of a)
    !v || v.min > v.max || (i = Math.min(i, v.min), c = Math.max(c, v.max), Number.isFinite(v.range) && (h = Math.max(h, v.range)));
  if (i > c) return null;
  const o = Math.max(1e-6, (h || Math.max(1, Math.abs(i), Math.abs(c))) / 2e3), n = X(i, o), f = X(c, o), l = Math.max(0.02, (f - n) * 0.025);
  return { lo: n - l, hi: f + l, cofactor: o };
}
function Ae({ row: a, scale: i, onSplit: c }) {
  const { t: h } = q(), { source: o, tube: n } = a, f = i == null ? void 0 : i.lo, l = i == null ? void 0 : i.hi, v = i == null ? void 0 : i.cofactor, g = M.useMemo(() => o && f !== void 0 && l !== void 0 && v !== void 0 ? Me(o.values, { lo: f, hi: l, cofactor: v }, 100, o.events) : null, [o, f, l, v]);
  if (!o || !i || !g || o.min > o.max) return /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: h("No events available for this histogram.") });
  const x = 40, D = 580, C = 12, y = 117, j = (p) => x + Math.max(0, Math.min(1, (X(p, i.cofactor) - i.lo) / (i.hi - i.lo))) * (D - x), S = Math.max(1, ...g), w = Array.from(g, (p, d) => "L" + (x + d * (D - x) / g.length) + " " + (y - p / S * (y - C)) + "h" + (D - x) / g.length).join(" "), I = Se(i);
  if (I.length < 2) {
    I.length = 0;
    for (const p of [0.08, 0.5, 0.92]) {
      const d = re(i.lo + p * (i.hi - i.lo), i.cofactor);
      I.push({ at: p, value: d, label: B(d) });
    }
  }
  function L(p, d, s) {
    const A = p === null ? x : j(p), b = d === null ? D : j(d);
    return /* @__PURE__ */ e.jsx("rect", { className: "tit-" + s, x: A, y: C, width: Math.max(0, b - A), height: y - C });
  }
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        className: "tit-histogram",
        viewBox: "0 0 600 145",
        role: "img",
        "aria-label": h("Event counts on the shared detector axis"),
        onClick: (p) => {
          const d = p.currentTarget, s = d.getScreenCTM();
          if (!s) return;
          const A = d.createSVGPoint();
          A.x = p.clientX, A.y = p.clientY;
          const { x: b, y: R } = A.matrixTransform(s.inverse());
          b >= x && b <= D && R >= C && R <= y && c(re(i.lo + (b - x) / (D - x) * (i.hi - i.lo), i.cofactor));
        },
        children: [
          n.negativeUpper !== null && L(n.negativeLower, n.negativeUpper, "negative"),
          n.positiveLower !== null && L(n.positiveLower, n.positiveUpper, "positive"),
          /* @__PURE__ */ e.jsx("path", { className: "tit-hist-counts", d: "M" + x + " " + y + w + " V" + y + "Z" }),
          H.map((p) => n[p] !== null && /* @__PURE__ */ e.jsx("line", { className: "tit-bound " + (p.startsWith("negative") ? "negative" : "positive"), x1: j(n[p]), x2: j(n[p]), y1: C, y2: y }, p)),
          /* @__PURE__ */ e.jsx("line", { className: "tit-axis", x1: x, x2: D, y1: y, y2: y }),
          /* @__PURE__ */ e.jsx("text", { x: x - 5, y: C + 5, textAnchor: "end", children: B(S) }),
          /* @__PURE__ */ e.jsx("text", { x: x - 5, y, textAnchor: "end", children: "0" }),
          I.map(({ at: p, label: d }) => /* @__PURE__ */ e.jsx("text", { x: x + p * (D - x), y: y + 17, textAnchor: "middle", children: d }, d))
        ]
      }
    ),
    /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: h("The histogram uses a shared arcsinh axis. Click to set the negative upper and positive lower limits, or enter the limits below.") })
  ] });
}
function Ee(a, i) {
  const c = /* @__PURE__ */ new Map();
  for (const h of a) {
    if (h.dose === null) continue;
    const o = c.get(h.dose) ?? { value: h.dose, label: h.tube.dose, rows: [] };
    h.tube.dose === i && (o.label = i), o.rows.push(h), c.set(h.dose, o);
  }
  return [...c.values()].sort((h, o) => h.value - o.value);
}
function ke({ groups: a, selected: i, chosen: c, unit: h, onInspect: o }) {
  const { t: n } = q(), f = M.useId(), [l, v] = M.useState("stainIndex"), g = Math.max(420, 90 + a.length * 68), x = 55, D = g - 40, C = 16, y = 121, j = a.length > 0 && a[0].value > 0, S = (r) => j ? Math.log10(r) : r, w = a.length ? S(a[0].value) : 0, I = a.length ? S(a[a.length - 1].value) : 0, L = (r) => w === I ? (x + D) / 2 : x + (S(r) - w) / (I - w) * (D - x), p = a.flatMap((r) => r.rows.flatMap((N) => {
    var U;
    const k = (U = N.statistics) == null ? void 0 : U[l];
    return k == null ? [] : [{ row: N, value: k, x: L(r.value) }];
  })), d = p.map((r) => r.value), s = Math.min(0, ...d), A = Math.max(0, ...d), b = (r) => y - (r - s) / (A === s ? 1 : A - s) * (y - C);
  let R = !0;
  const m = a.map((r) => {
    const N = r.rows.flatMap(({ statistics: O }) => (O == null ? void 0 : O[l]) == null ? [] : [O[l]]).sort((O, W) => O - W);
    if (!N.length)
      return R = !0, "";
    const k = Math.floor(N.length / 2), U = N.length % 2 === 0 ? N[k - 1] / 2 + N[k] / 2 : N[k], F = (R ? "M" : "L") + L(r.value) + " " + b(U);
    return R = !1, F;
  }).join(" "), G = a.length > 1 ? D : 1 / 0;
  let P = -1 / 0;
  const _ = new Set(a.filter((r, N) => {
    const k = L(r.value), U = N === 0 || N === a.length - 1 || k - P >= 50 && G - k >= 50;
    return U && (P = k), U;
  }).map((r) => r.value));
  return /* @__PURE__ */ e.jsxs("section", { className: "tit-plot", "aria-labelledby": f, children: [
    /* @__PURE__ */ e.jsxs("div", { className: "tit-section-head", children: [
      /* @__PURE__ */ e.jsx("h3", { id: f, children: n("Dose response") }),
      /* @__PURE__ */ e.jsxs("label", { children: [
        n("Measure"),
        " ",
        /* @__PURE__ */ e.jsx("select", { value: l, onChange: (r) => v(r.target.value), children: Object.entries(de).map(([r, N]) => /* @__PURE__ */ e.jsx("option", { value: r, children: n(N) }, r)) })
      ] })
    ] }),
    p.length ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx("div", { className: "tit-plot-scroll", children: /* @__PURE__ */ e.jsxs("svg", { viewBox: "0 0 " + g + " 176", style: { minWidth: a.length * 50 }, role: "group", "aria-label": n("Replicate measurements by dose"), children: [
        Array.from(/* @__PURE__ */ new Set([s, (A + s) / 2, A])).map((r) => /* @__PURE__ */ e.jsxs("g", { children: [
          /* @__PURE__ */ e.jsx("line", { className: "tit-gridline", x1: x - 10, x2: D + 10, y1: b(r), y2: b(r) }),
          /* @__PURE__ */ e.jsx("text", { x: x - 14, y: b(r) + 4, textAnchor: "end", children: B(r) })
        ] }, r)),
        a.map((r) => /* @__PURE__ */ e.jsxs("g", { children: [
          c !== null && r.value === Q(c) && /* @__PURE__ */ e.jsx("rect", { className: "tit-chosen", x: L(r.value) - 7, y: C - 4, width: 14, height: y - C + 8 }),
          /* @__PURE__ */ e.jsx("line", { className: "tit-axis", x1: L(r.value), x2: L(r.value), y1: y, y2: y + 4 }),
          _.has(r.value) && /* @__PURE__ */ e.jsx("text", { x: L(r.value), y: y + 20, textAnchor: "middle", children: r.label })
        ] }, r.value)),
        /* @__PURE__ */ e.jsx("path", { className: "tit-median", d: m }),
        /* @__PURE__ */ e.jsx("text", { x: (x + D) / 2, y: y + 44, textAnchor: "middle", children: [n("Dose"), h, n(j ? "Log scale" : "Linear scale")].filter(Boolean).join(" · ") }),
        p.map(({ row: r, value: N, x: k }) => {
          const U = n("{file}, dose {dose}, replicate {replicate}, {measure} {value}", { file: r.name, dose: r.tube.dose, replicate: r.tube.replicate, measure: n(de[l]), value: B(N) });
          return /* @__PURE__ */ e.jsxs(
            "g",
            {
              role: "button",
              tabIndex: 0,
              "aria-label": U,
              "aria-pressed": r.tube.fileId === i,
              className: "tit-point" + (r.saved ? " saved" : "") + (r.tube.fileId === i ? " active" : ""),
              onClick: () => o(r.tube.fileId),
              onKeyDown: (F) => {
                (F.key === "Enter" || F.key === " ") && (F.preventDefault(), o(r.tube.fileId));
              },
              children: [
                /* @__PURE__ */ e.jsx("title", { children: U }),
                /* @__PURE__ */ e.jsx("circle", { className: "hit", cx: k, cy: b(N), r: 10 }),
                /* @__PURE__ */ e.jsx("circle", { cx: k, cy: b(N), r: 4 })
              ]
            },
            r.tube.fileId
          );
        })
      ] }) }),
      /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: n("Select a point to inspect its tube. The line joins dose medians. Hollow points show saved measurements.") })
    ] }) : /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: n("Enter doses and set the intervals to plot this measure.") })
  ] });
}
function xe(a) {
  return a.tubes.some((i) => /[/:]/.test(i.dose)) && a.tubes.every((i) => /[/:]/.test(i.dose) || Q(i.dose) === 0);
}
function fe(a) {
  const i = a.unit.trim();
  return !!i && a.tubes.some((c) => c.dose.includes(":")) && !/dilution|ratio|fraction|^v\/v$|^fold$|希釈|比率/i.test(i);
}
function Fe(a, i) {
  return !a.clone.trim() || !a.detector ? i("Enter a clone and detector.") : a.tubes.length ? fe(a) ? i("Use dilution ratios or convert all doses to the same concentration unit.") : a.tubes.some((c) => Q(c.dose) === null || !c.replicate.trim()) ? i("Enter a numeric dose or dilution and a replicate for each tube.") : !a.unit.trim() && !xe(a) ? i("Enter a unit for the concentrations.") : a.tubes.some((c) => H.some((h) => c[h] !== null) && !V(c)) ? i("Set ordered, non-overlapping intervals.") : null : i("Add at least one tube.");
}
function Ue(a) {
  if (a.key !== "Tab") return;
  const i = a.currentTarget.querySelectorAll('button:enabled, input:enabled, textarea:enabled, select:enabled, [tabindex="0"]'), c = i[i.length - 1], h = i[0];
  a.shiftKey && document.activeElement === h && (a.preventDefault(), c == null || c.focus()), !a.shiftKey && document.activeElement === c && (a.preventDefault(), h == null || h.focus());
}
function Re({ files: a, series: i, onSave: c, onQc: h, onClose: o }) {
  var Z, $, z, ee, te, ne, se, ie, ae, oe;
  const { t: n } = q(), f = M.useId(), [l, v] = M.useState(() => i.length ? i : [ue()]), [g, x] = M.useState(() => {
    var t;
    return ((t = l[0]) == null ? void 0 : t.id) ?? null;
  }), [D, C] = M.useState(null), [y, j] = M.useState(""), [S, w] = M.useState(!1), [I, L] = M.useState(!1), p = M.useRef(null), d = M.useRef(i);
  ge(o), M.useEffect(() => {
    var u;
    const t = document.activeElement;
    return (u = p.current) == null || u.focus(), () => {
      t instanceof HTMLElement && t.isConnected && t.focus();
    };
  }, []), M.useEffect(() => {
    I && !S && d.current !== i && (v(i), d.current = i);
  }, [i, I, S]);
  const s = l.find((t) => t.id === g), A = M.useMemo(() => De(a, (s == null ? void 0 : s.detector) ?? ""), [a, s == null ? void 0 : s.detector]), b = M.useMemo(() => ((s == null ? void 0 : s.tubes) ?? []).map(A).sort((t, u) => t.dose === null ? u.dose === null ? 0 : 1 : u.dose === null ? -1 : t.dose - u.dose || t.tube.replicate.localeCompare(u.tube.replicate, void 0, { numeric: !0 })), [A, s == null ? void 0 : s.tubes]), R = M.useMemo(() => Te(b), [b]), m = b.find((t) => t.tube.fileId === D) ?? b[0], G = M.useMemo(() => new Map(a.flatMap((t) => t.detectors.map((u) => [u.id, u.label]))), [a]), P = a.filter((t) => !(s != null && s.tubes.some((u) => u.fileId === t.id)) && (!(s != null && s.detector) || t.detectors.some((u) => u.id === s.detector))), _ = P.some((t) => t.id === y) ? y : ((Z = P[0]) == null ? void 0 : Z.id) ?? "", r = Ee(b, (s == null ? void 0 : s.chosenDose) ?? null), N = l.map((t) => ({ id: t.id, name: he(t, n), reason: Fe(t, n) })).find((t) => t.reason), k = !!N || !l.length && !S, U = () => {
    w(!0), L(!1);
  };
  function F(t) {
    var T;
    if (!s) return;
    const u = { ...s, ...t };
    if (u.chosenDose !== null && !u.tubes.some((E) => E.dose === u.chosenDose)) {
      const E = Q(u.chosenDose);
      u.chosenDose = E === null ? null : ((T = u.tubes.find((K) => Q(K.dose) === E)) == null ? void 0 : T.dose) ?? null;
    }
    v(l.map((E) => E.id === s.id ? u : E)), U();
  }
  function O(t, u) {
    if (!s) return;
    const T = u.populationId !== void 0 || H.some((E) => E in u);
    F({ tubes: s.tubes.map((E) => E.fileId === t ? { ...E, ...u, ...T ? { reviewed: void 0 } : {} } : E) });
  }
  function W(t) {
    x(t), C(null), j("");
  }
  function Y() {
    k || (d.current = i, c(l, s == null ? void 0 : s.id), w(!1), L(!0));
  }
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal tit-review", role: "dialog", "aria-modal": "true", "aria-labelledby": f, onKeyDown: Ue, children: [
    /* @__PURE__ */ e.jsx("h2", { className: "gl-modal-title", id: f, children: n("Antibody titration review") }),
    /* @__PURE__ */ e.jsxs("div", { className: "tit-toolbar", children: [
      /* @__PURE__ */ e.jsxs("label", { children: [
        n("Antibody series"),
        " ",
        /* @__PURE__ */ e.jsxs("select", { ref: p, value: (s == null ? void 0 : s.id) ?? "", onChange: (t) => W(t.target.value), children: [
          !l.length && /* @__PURE__ */ e.jsx("option", { value: "", children: "—" }),
          l.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: he(t, n) }, t.id))
        ] })
      ] }),
      /* @__PURE__ */ e.jsx("button", { className: "gl-mini-btn", onClick: () => {
        const t = ue();
        v([...l, t]), W(t.id), U();
      }, children: n("Add series") }),
      s && /* @__PURE__ */ e.jsx("button", { className: "gl-mini-btn", onClick: () => {
        var u;
        const t = l.filter((T) => T.id !== s.id);
        v(t), W(((u = t[0]) == null ? void 0 : u.id) ?? null), U();
      }, children: n("Remove series") })
    ] }),
    /* @__PURE__ */ e.jsx("div", { className: "tit-scroll", children: s && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsxs("div", { className: "tit-meta", children: [
        ["clone", "conjugate", "lot"].map((t) => /* @__PURE__ */ e.jsxs("label", { children: [
          n({ clone: "Clone", conjugate: "Conjugate", lot: "Lot" }[t]),
          /* @__PURE__ */ e.jsx("input", { value: s[t], onChange: (u) => F({ [t]: u.target.value }) })
        ] }, t)),
        /* @__PURE__ */ e.jsxs("label", { children: [
          n("Detector"),
          /* @__PURE__ */ e.jsxs("select", { value: s.detector, onChange: (t) => F({ detector: t.target.value, chosenDose: null, tubes: s.tubes.map((u) => ({ ...u, ...ce, reviewed: void 0 })) }), children: [
            /* @__PURE__ */ e.jsx("option", { value: "", children: n("Choose detector") }),
            s.detector && !G.has(s.detector) && /* @__PURE__ */ e.jsx("option", { value: s.detector, children: s.detector }),
            [...G].map(([t, u]) => /* @__PURE__ */ e.jsx("option", { value: t, children: u }, t))
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("label", { children: [
          n("Dose unit"),
          /* @__PURE__ */ e.jsx("input", { value: s.unit, placeholder: n("e.g. µg/mL or dilution"), onChange: (t) => F({ unit: t.target.value }) })
        ] })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { className: "tit-columns", children: [
        /* @__PURE__ */ e.jsxs("section", { className: "tit-tubes", children: [
          /* @__PURE__ */ e.jsxs("h3", { children: [
            n("Tubes"),
            " ",
            /* @__PURE__ */ e.jsxs("span", { className: "tit-subtle", children: [
              "(",
              b.length,
              ")"
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "tit-add", children: [
            /* @__PURE__ */ e.jsxs("select", { "aria-label": n("Workspace tube"), value: _, disabled: !P.length || !s.detector, onChange: (t) => j(t.target.value), children: [
              !P.length && /* @__PURE__ */ e.jsx("option", { value: "", children: n("No available tubes") }),
              P.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.name }, t.id))
            ] }),
            /* @__PURE__ */ e.jsx("button", { className: "gl-mini-btn", disabled: !_ || !s.detector, onClick: () => {
              F({ tubes: [...s.tubes, { fileId: _, dose: "", replicate: "1", populationId: null, ...ce }] }), C(_), j("");
            }, children: n("Add tube") })
          ] }),
          /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: n("Enter a concentration or a dilution such as 1:200. Tubes are ordered by increasing dose.") }),
          b.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "tit-table-wrap", children: /* @__PURE__ */ e.jsxs("table", { children: [
            /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { children: [n("Tube"), n("Dose"), n("Replicate"), n("Stain index"), n("Remove")].map((t) => /* @__PURE__ */ e.jsx("th", { children: t }, t)) }) }),
            /* @__PURE__ */ e.jsx("tbody", { children: b.map((t) => {
              var u;
              return /* @__PURE__ */ e.jsxs("tr", { className: m === t ? "active" : "", children: [
                /* @__PURE__ */ e.jsxs("th", { scope: "row", children: [
                  /* @__PURE__ */ e.jsx("button", { className: "tit-row-pick", "aria-pressed": m === t, onClick: () => C(t.tube.fileId), children: t.name }),
                  !t.source && /* @__PURE__ */ e.jsx("small", { children: t.saved ? n("Last saved measurements") : n("Source or population unavailable") })
                ] }),
                /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx("input", { "aria-label": n("Dose for {file}", { file: t.name }), value: t.tube.dose, onChange: (T) => O(t.tube.fileId, { dose: T.target.value }) }) }),
                /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx("input", { "aria-label": n("Replicate for {file}", { file: t.name }), value: t.tube.replicate, onChange: (T) => O(t.tube.fileId, { replicate: T.target.value }) }) }),
                /* @__PURE__ */ e.jsx("td", { children: B((u = t.statistics) == null ? void 0 : u.stainIndex) }),
                /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx("button", { className: "gl-mini-btn tit-remove", "aria-label": n("Remove {file}", { file: t.name }), onClick: () => F({ tubes: s.tubes.filter((T) => T.fileId !== t.tube.fileId) }), children: "×" }) })
              ] }, t.tube.fileId);
            }) })
          ] }) }),
          !fe(s) && /* @__PURE__ */ e.jsx(ke, { groups: r, unit: s.unit.trim() || (xe(s) ? n("Dilution") : ""), selected: (m == null ? void 0 : m.tube.fileId) ?? null, chosen: s.chosenDose, onInspect: C }, s.id),
          /* @__PURE__ */ e.jsxs("div", { className: "tit-choice", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              n("Chosen dose"),
              " ",
              /* @__PURE__ */ e.jsxs("select", { value: s.chosenDose ?? "", onChange: (t) => F({ chosenDose: t.target.value || null }), children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: n("Undecided") }),
                r.map((t) => /* @__PURE__ */ e.jsxs("option", { value: t.label, children: [
                  t.label,
                  " ",
                  s.unit
                ] }, t.value))
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              n("Review note"),
              /* @__PURE__ */ e.jsx("textarea", { rows: 2, value: s.note, onChange: (t) => F({ note: t.target.value }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("section", { className: "tit-inspector", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "tit-section-head", children: [
            /* @__PURE__ */ e.jsx("h3", { children: (m == null ? void 0 : m.name) ?? n("Tube distribution") }),
            /* @__PURE__ */ e.jsx("span", { children: n("Original assay · linear values") })
          ] }),
          m ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
            /* @__PURE__ */ e.jsxs("label", { className: "tit-pop", children: [
              n("Population"),
              " ",
              /* @__PURE__ */ e.jsxs("select", { value: m.tube.populationId ?? "", disabled: !m.file, onChange: (t) => O(m.tube.fileId, { populationId: t.target.value || null }), children: [
                /* @__PURE__ */ e.jsx("option", { value: "", children: n("All events") }),
                m.tube.populationId && !(($ = m.file) != null && $.populations.some((t) => t.id === m.tube.populationId)) && /* @__PURE__ */ e.jsx("option", { value: m.tube.populationId, children: m.tube.populationId }),
                (z = m.file) == null ? void 0 : z.populations.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.name }, t.id))
              ] })
            ] }),
            /* @__PURE__ */ e.jsx(Ae, { row: m, scale: R, onSplit: (t) => O(m.tube.fileId, { negativeUpper: t, positiveLower: t }) }),
            /* @__PURE__ */ e.jsx("div", { className: "tit-gates", children: ["negative", "positive"].map((t) => /* @__PURE__ */ e.jsxs("fieldset", { className: "tit-gate " + t, children: [
              /* @__PURE__ */ e.jsx("legend", { children: n(t === "negative" ? "Negative interval" : "Positive interval") }),
              ["Lower", "Upper"].map((u) => {
                const T = t + u;
                return /* @__PURE__ */ e.jsxs("label", { children: [
                  n(u === "Lower" ? "Lower (inclusive)" : "Upper (exclusive)"),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "number",
                      step: "any",
                      "aria-label": n(Ce[T]),
                      value: m.tube[T] ?? "",
                      onChange: (E) => O(m.tube.fileId, { [T]: Number.isFinite(E.target.valueAsNumber) ? E.target.valueAsNumber : null })
                    }
                  )
                ] }, T);
              })
            ] }, t)) }),
            b.length > 1 && /* @__PURE__ */ e.jsx("button", { className: "gl-mini-btn", disabled: !V(m.tube), onClick: () => {
              const { negativeLower: t, negativeUpper: u, positiveLower: T, positiveUpper: E } = m.tube;
              F({ tubes: s.tubes.map((K) => H.every((le) => K[le] === m.tube[le]) ? K : { ...K, negativeLower: t, negativeUpper: u, positiveLower: T, positiveUpper: E, reviewed: void 0 }) });
            }, children: n("Apply these intervals to all tubes in this series") }),
            /* @__PURE__ */ e.jsx("h4", { children: m.saved ? n("Last saved measurements") : n("Current measurements") }),
            /* @__PURE__ */ e.jsxs("dl", { className: "tit-statistics", children: [
              [
                [n("Negative events"), (ee = m.statistics) == null ? void 0 : ee.negativeCount.toLocaleString()],
                [n("Positive events"), (te = m.statistics) == null ? void 0 : te.positiveCount.toLocaleString()],
                [n("Negative median"), B((ne = m.statistics) == null ? void 0 : ne.negativeMedian)],
                [n("Positive median"), B((se = m.statistics) == null ? void 0 : se.positiveMedian)],
                [n("Negative spread"), B((ie = m.statistics) == null ? void 0 : ie.negativeSpread)],
                [n("Stain index"), B((ae = m.statistics) == null ? void 0 : ae.stainIndex)]
              ].map(([t, u]) => /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("dt", { children: t }),
                /* @__PURE__ */ e.jsx("dd", { children: u ?? "—" })
              ] }, t)),
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("dt", { children: n("Positive events near detector ceiling") }),
                /* @__PURE__ */ e.jsx("dd", { children: ((oe = m.statistics) == null ? void 0 : oe.saturationFraction) == null ? "—" : pe(m.statistics.saturationFraction) })
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: n("Negative spread is half the 84.13th–15.87th percentile interval. Stain index is the difference between the positive and negative medians divided by twice the negative spread.") }),
            Le(m, n).filter((t) => t !== n("Last saved measurements")).map((t) => /* @__PURE__ */ e.jsx("p", { className: "tit-warning", children: t }, t))
          ] }) : /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: n("Add a tube to inspect its distribution.") })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions tit-actions", children: [
      /* @__PURE__ */ e.jsx("span", { role: "status", children: N ? N.id === (s == null ? void 0 : s.id) ? N.reason : N.name + " · " + N.reason : I ? n("Review saved to workspace.") : "" }),
      s && h && /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "gl-btn-ghost",
          disabled: k || !b.some((t) => t.source && V(t.tube)),
          onClick: () => {
            Y(), h(s);
          },
          children: n("Save and view control QC")
        }
      ),
      /* @__PURE__ */ e.jsx("button", { className: "gl-btn-ghost", onClick: o, children: n(S ? "Cancel" : "Close") }),
      /* @__PURE__ */ e.jsx("button", { className: "gl-btn", disabled: k, onClick: Y, children: n("Save review") })
    ] })
  ] }) });
}
function _e({ samples: a, state: i, record: c, onSave: h, onPages: o, onClose: n }) {
  const { t: f } = q(), [l, v] = M.useState(null), g = M.useMemo(() => je(i), [i]), x = M.useMemo(() => a.filter((j) => j.sample.instrument === "flow" && !j.sample.hostedAssayId), [a]), D = M.useMemo(() => x.map((j) => {
    const { sample: S } = j, w = g[j.hierarchyId], I = /* @__PURE__ */ new Map();
    S.channels.forEach((d, s) => {
      S.isFluorChannel(s) && !S.isDerivedChannel(s) && I.set(d.pnn, I.has(d.pnn) ? null : s);
    });
    const L = [...I].flatMap(([d, s]) => s === null ? [] : [{ id: d, label: S.labelForKey(S.channels[s].key), range: S.channels[s].range }]);
    let p;
    return {
      id: j.id,
      name: j.fileName || j.name,
      detectors: L,
      populations: Object.values((w == null ? void 0 : w.populations) ?? {}).filter((d) => d.population_id !== (w == null ? void 0 : w.root_population_id)).map((d) => ({ id: d.population_id, name: d.name })),
      values: (d) => {
        const s = I.get(d);
        return s == null ? null : S.originalColumnData(s);
      },
      mask: (d) => {
        if (!d || !(w != null && w.populations[d])) return null;
        p ?? (p = Ne(j, w, i).gating);
        const s = p.masks[d];
        return (s == null ? void 0 : s.length) === S.fcs.nEvents ? s : null;
      }
    };
  }), [x, g, i]), C = M.useMemo(() => c === void 0 ? [] : !c || typeof c != "object" || !("version" in c) || c.version !== 1 || !("series" in c) || !Array.isArray(c.series) ? null : ye(c.series), [c]);
  function y(j, S) {
    const w = j.map((I) => {
      const L = C == null ? void 0 : C.find((p) => p.id === I.id);
      return I.id !== S && L && JSON.stringify(L) === JSON.stringify(I) ? L : { ...I, tubes: I.tubes.map((p) => {
        const d = D.find((R) => R.id === p.fileId), s = d == null ? void 0 : d.detectors.find((R) => R.id === I.detector), A = d == null ? void 0 : d.values(I.detector), b = (d == null ? void 0 : d.mask(p.populationId)) ?? null;
        return !d || !s || !A || p.populationId !== null && !b ? p : { ...p, reviewed: {
          detector: s.id,
          populationId: p.populationId,
          fileName: d.name,
          assay: "original",
          eventCount: A.length,
          statistics: me(A, b, p, s.range)
        } };
      }) };
    });
    h({ version: 1, series: w });
  }
  return C === null ? /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", children: /* @__PURE__ */ e.jsxs("section", { className: "gl-modal", role: "dialog", "aria-modal": "true", "aria-label": f("Titration review"), children: [
    /* @__PURE__ */ e.jsx(ve, { onClose: n }),
    /* @__PURE__ */ e.jsx("p", { children: f("This workspace contains an unsupported titration review format.") }),
    /* @__PURE__ */ e.jsx("button", { type: "button", autoFocus: !0, onClick: n, children: f("Close") })
  ] }) }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    /* @__PURE__ */ e.jsx(Re, { files: D, series: C, onSave: y, onClose: n, onQc: o ? v : void 0 }),
    l && o && /* @__PURE__ */ e.jsx(
      Oe,
      {
        series: l,
        files: x,
        trees: g,
        onClose: () => v(null),
        onCreate: (j) => {
          o(j), n();
        }
      },
      l.id
    )
  ] });
}
function Oe({ series: a, files: i, trees: c, onClose: h, onCreate: o }) {
  const { t: n } = q(), f = a.tubes.map((l) => l.fileId);
  return /* @__PURE__ */ e.jsxs(
    "dialog",
    {
      className: "gl-modal gl-titration-qc",
      ref: (l) => {
        l && !l.open && l.showModal();
      },
      onCancel: (l) => {
        l.preventDefault(), h();
      },
      "aria-label": n("Control QC sheets"),
      children: [
        /* @__PURE__ */ e.jsx(ve, { onClose: h }),
        /* @__PURE__ */ e.jsx("h2", { children: n("Control QC sheets") }),
        /* @__PURE__ */ e.jsx("p", { children: n("These plots use the workspace display assay and each tube’s reviewed cleanup population.") }),
        /* @__PURE__ */ e.jsx(
          Ie,
          {
            files: i.filter((l) => f.includes(l.id)),
            figure: { sampleIds: f, populations: [] },
            trees: c,
            reviewedSeries: a,
            onCreate: o
          }
        ),
        /* @__PURE__ */ e.jsx("button", { type: "button", autoFocus: !0, onClick: h, children: n("Back to titration") })
      ]
    }
  );
}
export {
  _e as TitrationWorkspace
};
