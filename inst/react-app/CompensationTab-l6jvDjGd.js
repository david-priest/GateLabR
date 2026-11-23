import { u as _e, r as F, j as e, D as ei, a as Nr, l as Cr, s as Sr, z as Mr, f as kr, M as Xo, i as Er, m as nn, q as Xe, b as Tr, c as Yo, p as Te, d as Zo, e as ve, g as ni, h as Ar, S as Fr, k as Ir, n as $r, o as Wi, t as qi, v as Gi, w as Le, x as Rr, y as Lr, A as Pr, T as Or, B as _r, F as Dr, C as Hi, E as Kr, G as zr, H as Xi, I as Vs, J as Ps, K as Yi, L as Zi, N as Ur, O as Br, P as Vr, Q as Wr, R as qr, U as Gr } from "./embed-D_eRnync.js";
function yt(n) {
  const t = n.trim().normalize("NFC"), i = t.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (i)
    return { element: i[1], mass: Number(i[2]) };
  const s = t.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return s ? { element: s[2], mass: Number(s[1]) } : null;
}
function Qi(n) {
  return n.map((t, i) => ({ channel: t, index: i, isotope: yt(t) })).sort((t, i) => t.isotope && i.isotope ? t.isotope.mass - i.isotope.mass || t.isotope.element.localeCompare(i.isotope.element) || t.index - i.index : t.isotope ? -1 : i.isotope ? 1 : t.index - i.index).map(({ index: t }) => t);
}
function Hr(n) {
  const t = Qi(n.sourceChannels), i = Qi(n.receiverChannels);
  return {
    sourceChannels: t.map((s) => n.sourceChannels[s]),
    receiverChannels: i.map((s) => n.receiverChannels[s]),
    matrix: t.map(
      (s) => i.map((o) => n.matrix[s][o])
    )
  };
}
function tt(n, t) {
  if (n === t) return "self";
  const i = yt(n), s = yt(t);
  if (!i || !s) return "other";
  const o = s.mass - i.mass;
  return i.element === s.element ? o === -1 ? "M-1" : o === 1 ? "M+1" : "same-element" : o === -1 ? "M-1" : o === 1 ? "M+1" : o === 16 ? "oxide (+16)" : "other";
}
function Qt(n, t) {
  const i = n.index(t);
  if (i !== void 0) return i;
  const s = n.channels.findIndex((o) => o.pnn === t);
  return s < 0 ? void 0 : s;
}
function En(n, t, i) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(t) || t <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (i && i.length !== n)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const s = i ? i.reduce((d, m) => d + (m ? 1 : 0), 0) : n, o = Math.min(s, t), l = new Uint32Array(o);
  if (o === 0) return l;
  if (!i) {
    if (o === 1) return l;
    for (let d = 0; d < o; d++)
      l[d] = Math.floor(d * (n - 1) / (o - 1));
    return l;
  }
  const c = Array.from({ length: o }, (d, m) => o === 1 ? 0 : Math.floor(m * (s - 1) / (o - 1)));
  let u = 0, h = 0;
  for (let d = 0; d < n && h < o; d++)
    i[d] && (u === c[h] && (l[h++] = d), u++);
  return l;
}
function Kn(n, t) {
  if (n.length === 0) return 0;
  const i = Math.max(0, Math.min(1, t)) * (n.length - 1), s = Math.floor(i), o = Math.ceil(i);
  return s === o ? n[s] : n[s] + (n[o] - n[s]) * (i - s);
}
function Jt(n) {
  const t = n.filter(Number.isFinite).sort((l, c) => l - c);
  if (t.length === 0) return [-1, 1];
  let i = Kn(t, 2e-3), s = Kn(t, 0.998);
  if (!(s > i)) {
    const l = Number.isFinite(i) ? i : 0, c = Math.max(1, Math.abs(l) * 0.05);
    return [l - c, l + c];
  }
  const o = (s - i) * 0.035;
  return i -= o, s += o, [i, s];
}
function ln(n) {
  if (n.length === 0) return Number.NaN;
  const t = [...n].sort((i, s) => i - s);
  return Kn(t, 0.5);
}
function es(n) {
  if (n.length === 0) return Number.NaN;
  const t = ln(n), i = ln(n.map((c) => Math.abs(c - t))) * 1.4826;
  if (Number.isFinite(i) && i > 0) return i;
  const s = n.reduce((c, u) => c + u, 0) / n.length, o = n.reduce((c, u) => c + (u - s) ** 2, 0) / Math.max(1, n.length - 1), l = Math.sqrt(o);
  return Number.isFinite(l) && l > 0 ? l : 1e-12;
}
function Ws(n, t, i = 12) {
  if (n.length !== t.length || n.length < i * 8) return null;
  const s = Array.from({ length: n.length }, (u, h) => h).sort((u, h) => n[u] - n[h]), o = [];
  for (let u = 0; u < i; u++) {
    const h = Math.floor(u * s.length / i), d = Math.floor((u + 1) * s.length / i), m = s.slice(h, d);
    if (m.length < 8) continue;
    const j = ln(m.map((v) => n[v])), g = ln(m.map((v) => t[v]));
    Number.isFinite(j) && Number.isFinite(g) && o.push({ x: j, y: g });
  }
  const l = [];
  for (let u = 0; u < o.length; u++)
    for (let h = u + 1; h < o.length; h++) {
      const d = o[h].x - o[u].x;
      if (d === 0) continue;
      const m = (o[h].y - o[u].y) / d;
      Number.isFinite(m) && l.push(m);
    }
  const c = ln(l);
  return Number.isFinite(c) ? c : null;
}
function Xr(n, t) {
  if (n.length !== t.length || n.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const i = Array.from({ length: n.length }, (E, _) => _).filter((E) => Number.isFinite(n[E]) && Number.isFinite(t[E])).sort((E, _) => n[E] - n[_]);
  if (i.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const s = Math.max(96, Math.floor(i.length * 0.8)), o = Math.min(i.length - 24, Math.floor(i.length * 0.9)), l = i.slice(0, s), c = i.slice(o);
  if (l.length < 96 || c.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const u = l.map((E) => n[E]), h = l.map((E) => t[E]), d = Ws(u, h, 10);
  if (d === null) return { excessMad: null, slopeDeltaMad: null };
  const m = ln(l.map((E) => t[E] - d * n[E])), j = l.map((E) => t[E] - (m + d * n[E])), g = Math.max(
    es(j),
    es(h) * 0.05,
    1e-12
  ), v = c.map((E) => t[E] - (m + d * n[E])).sort((E, _) => E - _), N = Kn(v, 0.75) / g, x = i.slice(Math.floor(i.length * 0.75)), M = x.map((E) => n[E]), k = x.map((E) => t[E]), T = Ws(M, k, 4), P = Kn(M, 0.9) - Kn(M, 0.1), f = T === null || !(P > 0) ? null : (T - d) * P / g;
  return {
    excessMad: Number.isFinite(N) ? N : null,
    slopeDeltaMad: Number.isFinite(f) ? f : null
  };
}
function Qo(n, t, i, s, o, l) {
  const c = i.length, u = Xr(i, s), h = Math.min(50, Math.max(12, Math.floor(c * 0.01))), d = (b = 0, U = 0, W = 0) => ({
    status: "insufficient",
    sourceLowEvents: b,
    sourceHighEvents: U,
    destinationNegativeEvents: W,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: u.excessMad,
    upperTailSlopeDeltaMad: u.slopeDeltaMad,
    receiverZeroDeltaFraction: c > 0 ? (l - o) / c : 0
  });
  if (c < h * 3) return d();
  const m = [...i].sort((b, U) => b - U), j = Kn(m, 0.25), g = i.flatMap((b, U) => b <= j ? [U] : []);
  if (g.length < h) return d(g.length);
  const v = g.map((b) => i[b]), N = ln(v), x = es(v);
  let M = i.flatMap((b, U) => b >= N + 3 * x ? [U] : []);
  if (M.length < h && (M = Array.from({ length: c }, (b, U) => U).sort((b, U) => i[U] - i[b]).slice(0, h)), M.length < h) return d(g.length, M.length);
  const k = g.map((b) => s[b]), T = ln(k), P = es(k), f = T + 5 * P, E = s.flatMap((b, U) => b <= f ? [U] : []), _ = new Set(E), L = g.filter((b) => _.has(b)), I = M.filter((b) => _.has(b));
  if (L.length < h || I.length < h)
    return d(g.length, M.length, E.length);
  const B = (ln(I.map((b) => s[b])) - ln(L.map((b) => s[b]))) / P, q = E.map((b) => n[b]), R = E.map((b) => t[b]);
  return {
    status: "ready",
    sourceLowEvents: g.length,
    sourceHighEvents: M.length,
    destinationNegativeEvents: E.length,
    normalizedNegativeShift: Number.isFinite(B) ? B : null,
    residualSlope: Ws(q, R),
    upperTailExcessMad: u.excessMad,
    upperTailSlopeDeltaMad: u.slopeDeltaMad,
    receiverZeroDeltaFraction: c > 0 ? (l - o) / c : 0
  };
}
function ns(n, t, i, s, o, l) {
  let c = 0, u = 0, h = 0;
  for (let d = 0; d < i.length; d++) {
    const m = Math.abs(i[d]) <= 1e-12, j = Math.abs(s[d]) <= 1e-12;
    m && c++, j && u++, m && j && h++;
  }
  return {
    x: n.map((d) => Math.max(o[0], Math.min(o[1], d))),
    y: t.map((d) => Math.max(l[0], Math.min(l[1], d))),
    zeroPile: Object.freeze({
      source: c,
      receiver: u,
      corner: h
    })
  };
}
function Os(n, t, i, s = {}) {
  var b;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation to compare Original and Compensated data." };
  const l = Qt(n, t), c = Qt(n, i);
  if (l === void 0 || c === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (n.fcs.nEvents === 0)
    return { ready: !1, reason: "This sample contains no events." };
  const u = ((b = s.fixedEventIndices) == null ? void 0 : b.slice()) ?? En(
    n.fcs.nEvents,
    s.maxEvents ?? 15e3,
    s.eventMask
  );
  for (const U of u)
    if (U >= n.fcs.nEvents || s.eventMask && !s.eventMask[U])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const h = n.channels[l].key, d = n.channels[c].key, m = n.originalColumnData(l), j = n.originalColumnData(c), g = n.compensatedColumnData(l), v = n.compensatedColumnData(c), N = [], x = [], M = [], k = [], T = [], P = [], f = [], E = [];
  for (const U of u) {
    const W = n.rawToDisplay(h, m[U]), G = n.rawToDisplay(d, j[U]), r = n.rawToDisplay(h, g[U]), le = n.rawToDisplay(d, v[U]);
    [W, G, r, le].every(Number.isFinite) && (N.push(W), x.push(G), M.push(m[U]), k.push(j[U]), T.push(r), P.push(le), f.push(g[U]), E.push(v[U]));
  }
  const _ = Jt([...N, ...T]), L = Jt([...x, ...P]), I = n.channelTicks(l, [_[0], _[1]]), B = n.channelTicks(c, [L[0], L[1]]), q = ns(
    N,
    x,
    M,
    k,
    _,
    L
  ), R = ns(
    T,
    P,
    f,
    E,
    _,
    L
  );
  return {
    ready: !0,
    preview: {
      eventCount: N.length,
      totalEvents: s.eventMask ? s.eligibleEventCount ?? s.eventMask.reduce((U, W) => U + (W ? 1 : 0), 0) : n.fcs.nEvents,
      xRange: _,
      yRange: L,
      xTicks: I,
      yTicks: B,
      original: q,
      compensated: R,
      evidence: Qo(
        f,
        E,
        T,
        P,
        q.zeroPile.receiver,
        R.zeroPile.receiver
      )
    }
  };
}
function _s(n, t, i, s, o, l, c = {}) {
  const u = Qt(n, t), h = Qt(n, i);
  if (u === void 0 || h === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (o.length !== s.length || l.length !== s.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const d = n.channels[u].key, m = n.channels[h].key, j = n.originalColumnData(u), g = n.originalColumnData(h), v = [], N = [], x = [], M = [], k = [], T = [], P = [], f = [];
  for (let R = 0; R < s.length; R++) {
    const b = s[R];
    if (b >= n.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const U = j[b], W = g[b], G = o[R], r = l[R], le = n.rawToDisplay(d, U), J = n.rawToDisplay(m, W), ce = n.rawToDisplay(d, G), D = n.rawToDisplay(m, r);
    [U, W, G, r, le, J, ce, D].every(Number.isFinite) && (v.push(le), N.push(J), x.push(U), M.push(W), k.push(ce), T.push(D), P.push(G), f.push(r));
  }
  const E = c.xRange ?? Jt([...v, ...k]), _ = c.yRange ?? Jt([...N, ...T]), L = n.channelTicks(u, [E[0], E[1]]), I = n.channelTicks(h, [_[0], _[1]]), B = ns(v, N, x, M, E, _), q = ns(k, T, P, f, E, _);
  return {
    ready: !0,
    preview: {
      eventCount: v.length,
      totalEvents: c.totalEvents ?? n.fcs.nEvents,
      xRange: E,
      yRange: _,
      xTicks: L,
      yTicks: I,
      original: B,
      compensated: q,
      evidence: Qo(
        P,
        f,
        k,
        T,
        B.zeroPile.receiver,
        q.zeroPile.receiver
      )
    }
  };
}
const Ji = 0.5, Yr = 0.01, Zr = 1e-4, Qr = 0.05, Jr = 3, el = 1, nl = 5;
function Jo(n, t) {
  const i = n.evidence.normalizedNegativeShift ?? 0, s = n.evidence.residualSlope ?? 0, o = Math.max(0, n.evidence.upperTailExcessMad ?? 0), l = Math.max(0, n.evidence.upperTailSlopeDeltaMad ?? 0), c = Math.abs(n.coefficient), u = Math.max(
    Zr,
    c * Qr
  );
  return {
    negativeShift: Math.max(0, -i),
    negativeSlope: Math.max(0, -s),
    zeroDelta: t === "cytof" ? Math.max(0, n.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, i),
    positiveSlope: Math.max(0, s),
    upperTailExcess: o,
    upperTailSlopeDelta: l,
    hasNegativeShift: i <= -Ji,
    hasNegativeSlope: s <= -u,
    hasNewZeroPile: t === "cytof" && n.evidence.receiverZeroDeltaFraction >= Yr,
    hasPositiveShift: i >= Ji,
    hasPositiveSlope: s >= u,
    hasHighTailCurve: o >= Jr && (l >= el || o >= nl)
  };
}
function tl(n) {
  return Number(n.hasNegativeShift) + Number(n.hasNegativeSlope) + Number(n.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : n.hasNewZeroPile ? "new-zero-pile" : n.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function qs(n, t, i = "biological") {
  const s = Jo(n, t), o = s.hasNegativeShift || s.hasNegativeSlope || s.hasNewZeroPile, l = s.hasPositiveShift || s.hasPositiveSlope, c = s.hasHighTailCurve || i === "control" && l;
  return o && c ? {
    category: "mixed-evidence",
    label: "Mixed evidence · inspect",
    detail: "Positive and negative residual signals disagree. Inspect the matched plots and use a suitable control before changing the coefficient.",
    reason: "mixed-residual-signals",
    automaticFollowup: !0
  } : o ? {
    category: "overcompensation-like",
    label: "Overcompensation-like",
    detail: "A negative receiver shift, negative residual slope, or new NNLS zero pile is present. This is a review prompt, not an automatic coefficient verdict.",
    reason: tl(s),
    automaticFollowup: !0
  } : s.hasHighTailCurve ? i === "control" ? {
    category: "undercompensation-like",
    label: "Undercompensation-like · control",
    detail: "A source-associated point or curve emerges in the upper tail. In a suitable single-stain/control sample this can support under-compensation review.",
    reason: "high-tail-curve",
    automaticFollowup: !0
  } : {
    category: "high-tail-structure",
    label: "High-tail structure · control required",
    detail: "A source-associated point or curve emerges only at high expression. Spill can look this way, but biological co-expression can too.",
    reason: "high-tail-curve",
    automaticFollowup: n.physicalPrior > 0
  } : l ? i === "control" ? {
    category: "undercompensation-like",
    label: "Undercompensation-like · control",
    detail: "Positive source-associated residual signal is present. This interpretation is valid only because control-data mode was selected.",
    reason: Number(s.hasPositiveShift) + Number(s.hasPositiveSlope) > 1 ? "multiple-undercompensation-signals" : "positive-residual-control",
    automaticFollowup: !0
  } : {
    category: "positive-association-only",
    label: "Positive association only · control required",
    detail: "Positive association alone is not treated as spill in a biological sample; co-expression and cell size can produce the same pattern.",
    reason: null,
    automaticFollowup: !1
  } : n.evidence.status !== "ready" ? {
    category: "insufficient",
    label: "Evidence groups insufficient",
    detail: "The pair remains available for visual review, but the automatic screen could not form robust comparison groups.",
    reason: null,
    automaticFollowup: !1
  } : {
    category: "no-automatic-evidence",
    label: "No automatic evidence",
    detail: "This screen did not find a qualified residual pattern. Visual review and manual follow-up remain available.",
    reason: null,
    automaticFollowup: !1
  };
}
function kn(n, t) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  const i = t.filter((o) => Number.isFinite(o) && o > 0).sort((o, l) => o - l);
  if (i.length === 0) return 0;
  let s = 0;
  for (const o of i)
    if (o <= n) s++;
    else break;
  return s / i.length;
}
function sl(n, t, i = "biological") {
  const s = n.map((N) => ({
    ...Jo(N, t),
    coefficient: Math.abs(N.coefficient)
  })), o = (N) => s.map((x) => typeof x[N] == "number" ? x[N] : 0), l = o("negativeShift"), c = o("negativeSlope"), u = o("zeroDelta"), h = o("positiveShift"), d = o("positiveSlope"), m = o("upperTailExcess"), j = o("upperTailSlopeDelta"), g = o("coefficient"), v = n.flatMap((N, x) => {
    const M = qs(N, t, i);
    if (!M.automaticFollowup || M.reason === null) return [];
    const k = s[x], T = 0.22 * kn(k.negativeShift, l) + 0.13 * kn(k.negativeSlope, c) + 0.14 * kn(k.zeroDelta, u) + (i === "control" ? 0.13 * kn(k.positiveShift, h) : 0) + (i === "control" ? 0.08 * kn(k.positiveSlope, d) : 0) + 0.12 * kn(k.upperTailExcess, m) + 0.08 * kn(k.upperTailSlopeDelta, j) + 0.05 * kn(k.coefficient, g) + 0.05 * Math.max(0, Math.min(1, N.physicalPrior));
    return [{
      index: x,
      relativePriority: T,
      reason: M.reason,
      category: M.category
    }];
  });
  return Object.freeze(v.sort((N, x) => x.relativePriority - N.relativePriority || N.index - x.index));
}
const xt = 0.25, il = 0.1, ea = 0.607, ol = 500, al = 60, rl = 3e3, ll = [0.5, 0.75, 0.875, 0.9375, 0.96875, 0.984375, 0.9921875, 0.9995], cl = 4;
function dl(n, t) {
  const i = new Float64Array(t.length);
  for (let s = 0; s < t.length; s++) i[s] = n[t[s]];
  return i.sort();
}
function Gs(n, t) {
  if (n.length === 0) return Number.NaN;
  const i = Math.max(0, Math.min(1, t)) * (n.length - 1), s = Math.floor(i), o = Math.ceil(i);
  return n[s] + (n[o] - n[s]) * (i - s);
}
function ul(n) {
  const t = n.length;
  if (t < ol) return { usable: !1, reason: "few-events" };
  const i = new Uint32Array(t);
  for (let h = 0; h < t; h++) i[h] = h;
  i.sort((h, d) => n[h] - n[d]);
  const s = [];
  let o = 0;
  for (const h of ll) {
    const d = Math.min(t, Math.round(h * t));
    d > o && s.push([o, d]), o = d;
  }
  for (; s.length > 1 && s[s.length - 1][1] - s[s.length - 1][0] < al; ) {
    const h = s.pop();
    s[s.length - 1][1] = h[1];
  }
  if (s.length < cl) return { usable: !1, reason: "few-events" };
  const l = [], c = new Float64Array(s.length);
  s.forEach(([h, d], m) => {
    const j = d - h, g = Math.min(j, rl), v = new Uint32Array(g);
    for (let N = 0; N < g; N++)
      v[N] = i[h + (g === j ? N : Math.floor(N * j / g))];
    l.push(v), c[m] = Gs(dl(n, v), 0.5);
  });
  const u = c[c.length - 1] - c[0];
  return u > 0 ? { usable: !0, source: { values: n, groups: l, centres: c, span: u } } : { usable: !1, reason: "no-range" };
}
function hl(n) {
  const t = [
    76.18009172947146,
    -86.50532032941678,
    24.01409824083091,
    -1.231739572450155,
    0.001208650973866179,
    -5395239384953e-18
  ];
  let i = 1.000000000190015, s = n;
  for (const l of t) i += l / ++s;
  const o = n + 5.5;
  return (n + 0.5) * Math.log(o) - o + Math.log(2.5066282746310007 * i / n);
}
function ml(n, t) {
  if (n < 0) return 0;
  if (!(t > 0)) return 1;
  const i = Math.floor(n), s = n - i, o = Math.max(0, Math.floor(t - 12 * Math.sqrt(t) - 12));
  if (i + 1 < o) return 0;
  let l = 0, c = o * Math.log(t) - t - hl(o + 1);
  for (let u = o; u <= i + 1; u++) {
    const h = Math.exp(c);
    l += u <= i ? h : h * s, c += Math.log(t) - Math.log(u + 1);
  }
  return Math.min(1, l);
}
function pl(n, t) {
  const i = Math.max(0, n);
  let s = 0, o = i + 12 * Math.sqrt(i + 1) + 20;
  for (let l = 0; l < 60; l++) {
    const c = (s + o) / 2;
    ml(i, c) > t ? s = c : o = c;
  }
  return (s + o) / 2;
}
function fl(n, t) {
  const i = n.map((l, c) => c).sort((l, c) => n[l] - n[c]), s = t.reduce((l, c) => l + c, 0);
  let o = 0;
  for (const l of i)
    if (o += t[l], o >= s / 2) return n[l];
  return Number.NaN;
}
const gl = 3;
function eo(n, t, i) {
  const s = n.groups.length, o = new Float64Array(s), l = new Float64Array(s);
  let c = 0, u = 0;
  for (let h = 0; h < s; h++) {
    const d = n.groups[h], m = d.length, j = n.centres[h], g = new Float64Array(m);
    for (let T = 0; T < m; T++) {
      const P = d[T];
      g[T] = t[P] - i * (n.values[P] - j);
    }
    g.sort(), o[h] = Gs(g, xt);
    const v = xt * (m - 1), N = 1.96 * Math.sqrt(m * xt * (1 - xt)), x = g[Math.max(0, Math.floor(v - N))], M = g[Math.min(m - 1, Math.ceil(v + N))];
    l[h] = Math.max((M - x) / 3.92, 1 / Math.sqrt(m));
    const k = o[h] - Gs(g, il);
    h === 0 && (c = k / ea), h === s - 1 && (u = k);
  }
  return { floors: o, sigmas: l, referenceSpread: c, topWidth: u };
}
function no(n, { floors: t, sigmas: i }) {
  const s = [], o = [];
  for (let l = 0; l < t.length; l++)
    for (let c = l + 1; c < t.length; c++) {
      const u = n.centres[c] - n.centres[l];
      u > 0 && (s.push((t[c] - t[l]) / u), o.push(u / Math.hypot(i[l], i[c])));
    }
  return fl(s, o);
}
function vl(n, t) {
  const i = n.groups.length;
  let s = eo(n, t, 0), o = no(n, s);
  for (let I = 0; I < gl; I++) {
    s = eo(n, t, o);
    const B = no(n, s), q = Math.abs(B - o) <= 1e-6 + 1e-3 * Math.abs(o);
    if (o = B, q) break;
  }
  const { floors: l, sigmas: c, referenceSpread: u, topWidth: h } = s;
  let d = 0, m = 0, j = 0;
  for (let I = 0; I < i; I++) {
    const B = 1 / c[I] ** 2;
    d += B, m += B * n.centres[I], j += B * l[I];
  }
  const g = m / d, v = j / d;
  let N = 0, x = 0;
  for (let I = 0; I < i; I++) {
    const B = 1 / c[I] ** 2;
    N += B * (n.centres[I] - g) ** 2, x += B * (n.centres[I] - g) * (l[I] - v);
  }
  const M = N > 0 ? x / N : 0;
  let k = 0;
  for (let I = 0; I < i; I++) {
    const B = l[I] - (v + M * (n.centres[I] - g));
    k += (B / c[I]) ** 2;
  }
  const T = k / Math.max(1, i - 2), P = N > 0 ? Math.sqrt(Math.max(1, T) / N) : Number.POSITIVE_INFINITY, f = Math.max(0, o * n.span), E = pl(f, xt), _ = E / n.span + 1.96 * P, L = ea * Math.sqrt(u ** 2 + Math.max(1, E));
  return {
    slope: o,
    standardError: P,
    upperBound: _,
    referenceFloor: l[0],
    referenceSpread: u,
    tightness: h / L,
    misfit: T,
    span: n.span,
    groupCount: i,
    points: Array.from(l, (I, B) => ({ source: n.centres[B], floor: I }))
  };
}
const na = Object.freeze({
  minimumCounts: 10,
  ratioMargin: 1.5,
  absoluteMargin: 2e-3,
  tightnessLimit: 3,
  plausibleMaximum: 0.1,
  dimLimit: 0.01,
  pairs: "physical"
}), to = {
  "above-data": 0,
  "below-floor": 0,
  "upper-bound-only": 1,
  consistent: 2,
  "too-dim": 3
};
function xl(n) {
  var l;
  const t = ((l = n.marker) == null ? void 0 : l.trim()) ?? "";
  if (t === "" || t === n.pnn) return !0;
  const i = yt(n.pnn), s = yt(t);
  return !i || !s || i.element !== s.element || i.mass !== s.mass ? !1 : t.replace(String(s.mass), "").replace(s.element, "").replace(/Di\b/, "").replace(/[\s_()\-]/g, "") === "";
}
function ta(n, t, i) {
  const s = new Map(t.sourceChannels.map((u, h) => [u, h])), o = new Map(t.receiverChannels.map((u, h) => [u, h])), l = (u, h) => {
    var g;
    const d = s.get(u), m = o.get(h);
    if (d === void 0 || m === void 0) return 0;
    const j = (g = t.matrix[d]) == null ? void 0 : g[m];
    return Number.isFinite(j) ? j : 0;
  }, c = new Set(n.channels.map((u) => u.pnn));
  return {
    data: n,
    settings: i,
    coefficient: l,
    sources: t.sourceChannels.filter((u) => c.has(u)),
    receivers: t.receiverChannels.filter((u) => c.has(u)),
    unlabelled: new Set(n.channels.filter(xl).map((u) => u.pnn)),
    spillIn: /* @__PURE__ */ new Map(),
    own: /* @__PURE__ */ new Map(),
    emitters: t.sourceChannels.filter((u) => c.has(u))
  };
}
function as(n, t) {
  const i = n.own.get(t);
  if (i) return i;
  const s = n.data.values(t);
  if (!s) return null;
  const o = Float64Array.from(s);
  for (const l of n.emitters) {
    if (l === t) continue;
    const c = n.coefficient(l, t);
    if (!(c > 0)) continue;
    const u = n.data.values(l);
    if (u)
      for (let h = 0; h < o.length; h++) o[h] -= c * u[h];
  }
  return n.own.set(t, o), o;
}
function sa(n, t) {
  const i = n.spillIn.get(t);
  if (i) return i;
  const s = new Float64Array(n.data.eventCount);
  for (const o of n.emitters) {
    if (o === t) continue;
    const l = n.coefficient(o, t);
    if (!(l > 0)) continue;
    const c = as(n, o);
    if (c)
      for (let u = 0; u < s.length; u++) s[u] += l * c[u];
  }
  return n.spillIn.set(t, s), s;
}
function bl(n, t, i, s) {
  const o = Math.max(0, i.slope - 1.96 * i.standardError), l = s.minimumCounts / i.span, c = { floorLower: o, detectionLimit: l, upperBoundReason: null };
  if (n - i.upperBound > s.absoluteMargin && n > i.upperBound * s.ratioMargin && n >= l) return { ...c, verdict: "above-data" };
  if (o - n > s.absoluteMargin && o > n * s.ratioMargin && o - n >= l) {
    const j = t !== "other" && t !== "self" ? i.slope > s.plausibleMaximum ? "above-plausible" : i.tightness > s.tightnessLimit ? "wide-floor" : null : "no-physical-route";
    return j ? { ...c, verdict: "upper-bound-only", upperBoundReason: j } : { ...c, verdict: "below-floor" };
  }
  return (n > 0 ? n < l : l > s.dimLimit) ? { ...c, verdict: "too-dim" } : i.upperBound > s.plausibleMaximum && n <= s.plausibleMaximum ? { ...c, verdict: "upper-bound-only", upperBoundReason: "loose-bound" } : { ...c, verdict: "consistent" };
}
function yl(n, t, i, s) {
  const { data: o, settings: l } = n, c = as(n, t), u = [], h = new Float64Array(o.eventCount);
  for (const d of n.receivers) {
    if (d === t || s && !s(t, d)) continue;
    const m = n.coefficient(t, d), j = tt(t, d), g = j !== "other" && j !== "self";
    if (l.pairs === "physical" && !g && !(m > 0)) continue;
    const v = o.values(d);
    if (!v) continue;
    const N = sa(n, d);
    for (let T = 0; T < h.length; T++)
      h[T] = v[T] - N[T] + m * c[T];
    const x = vl(i, h), M = bl(m, j, x, l), k = Math.max(1, x.referenceSpread);
    u.push({
      source: t,
      receiver: d,
      coefficient: m,
      interaction: j,
      receiverUnlabelled: n.unlabelled.has(d),
      floor: x,
      ...M,
      impact: M.verdict === "above-data" ? (m - x.upperBound) * x.span / k : M.verdict === "below-floor" || M.verdict === "upper-bound-only" ? (x.slope - m) * x.span / k : 0
    });
  }
  return u;
}
function wl(n, t) {
  const i = n.flatMap((d) => d.interaction !== "oxide (+16)" || !(d.coefficient > 0) || !d.floor ? [] : d.coefficient < (d.detectionLimit ?? 1 / 0) ? [] : d.floor.tightness > t.tightnessLimit ? [] : d.floor.slope > t.plausibleMaximum ? [] : [{ source: d.source, receiver: d.receiver, ratio: d.floor.slope / d.coefficient }]);
  if (i.length === 0) return null;
  const s = i.map((d) => d.ratio).sort((d, m) => d - m), o = s.length / 2, l = s.length % 2 === 1 ? s[Math.floor(o)] : (s[o - 1] + s[o]) / 2, c = s[0], u = s[s.length - 1], h = c > t.ratioMargin || u < 1 / t.ratioMargin;
  return {
    pairs: i,
    ratio: l,
    lowestRatio: c,
    highestRatio: u,
    shared: i.length >= 2 && h && c > 0 && u / c <= 1.5
  };
}
function jl(n, t, i = {}, s = {}) {
  const o = { ...na, ...i }, l = ta(n, t, o), c = s.only, u = c ? { ...l, sources: l.sources.filter((j) => l.receivers.some((g) => c(j, g))) } : l, h = [], d = [];
  let m = 0;
  return {
    stepCount: u.sources.length,
    step() {
      if (m >= u.sources.length) return !1;
      const j = u.sources[m++], g = ul(as(u, j));
      return g.usable ? h.push(...yl(u, j, g.source, c)) : d.push({ source: j, reason: g.reason }), m < u.sources.length;
    },
    result() {
      return {
        pairs: [...h].sort((g, v) => to[g.verdict] - to[v.verdict] || v.impact - g.impact || v.coefficient - g.coefficient),
        oxide: wl(h, o),
        eventCount: n.eventCount,
        unreadSources: d,
        settings: o
      };
    }
  };
}
function ia(n) {
  return n.floor ? n.verdict === "above-data" ? n.floor.upperBound : n.verdict === "below-floor" ? Math.max(0, n.floor.slope) : null : null;
}
function Nl(n, t, i, s) {
  const o = ta(n, t, na), l = as(o, i), c = n.values(s);
  if (!l || !c) return null;
  const u = sa(o, s), h = o.coefficient(i, s), d = new Float64Array(n.eventCount);
  for (let m = 0; m < d.length; m++)
    d[m] = c[m] - u[m] + h * l[m];
  return { source: l, receiver: d };
}
const Wt = 300, Zn = 230, Ee = { left: 38, right: 8, top: 8, bottom: 30 }, oa = 5, Cl = 3500, Sl = 1500, so = [0, 10, 100, 1e3, 1e4, 1e5], Pn = (n) => Math.asinh(n / oa);
function io(n) {
  return n >= 1e3 ? `${n / 1e3}k` : String(n);
}
function Ml({ pair: n, events: t, sourceLabel: i, receiverLabel: s }) {
  const { t: o } = _e(), l = n.floor, c = F.useMemo(() => {
    var R;
    if (!l) return null;
    const h = t.source.length, d = ((R = l.points[1]) == null ? void 0 : R.source) ?? 0, m = [], j = [];
    for (let b = 0; b < h; b++) (t.source[b] > d ? m : j).push(b);
    const g = (b, U) => b.length <= U ? b : Array.from({ length: U }, (W, G) => b[Math.floor(G * b.length / U)]), v = [...g(j, Sl), ...g(m, Cl)], N = l.points[l.points.length - 1], x = Pn(Math.max(20, N.source * 4));
    let M = Math.max(20, N.floor * 4, n.coefficient * N.source * 2);
    const k = v.map((b) => t.receiver[b]).sort((b, U) => b - U);
    M = Math.max(M, k[Math.floor(k.length * 0.98)] ?? 0);
    const T = Pn(Math.min(0, k[Math.floor(k.length * 5e-3)] ?? 0)), P = Pn(M), f = Wt - Ee.left - Ee.right, E = Zn - Ee.top - Ee.bottom, _ = (b) => Ee.left + Math.max(0, Math.min(1, Pn(b) / x)) * f, L = (b) => Ee.top + (1 - Math.max(0, Math.min(1, (Pn(b) - T) / (P - T)))) * E, I = v.map((b) => `M${_(t.source[b]).toFixed(1)} ${L(t.receiver[b]).toFixed(1)}h0`).join(""), B = l.points[0], q = (b) => {
      let W = "";
      for (let G = 0; G <= 48; G++) {
        const r = oa * Math.sinh(x * G / 48), le = B.floor + b * (r - B.source);
        W += `${G === 0 ? "M" : "L"}${_(r).toFixed(1)} ${L(le).toFixed(1)}`;
      }
      return W;
    };
    return {
      points: I,
      matrixLine: q(n.coefficient),
      boundLine: q(l.upperBound),
      floors: l.points.map((b) => ({ x: _(b.source), y: L(b.floor) })),
      xTicks: so.filter((b) => Pn(b) <= x).map((b) => ({ tick: b, at: _(b) })),
      yTicks: so.filter((b) => Pn(b) <= P).map((b) => ({ tick: b, at: L(b) }))
    };
  }, [t, l, n.coefficient]);
  if (!l || !c) return null;
  const u = (h) => `${(h * 100).toFixed(2)}%`;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-floor-plot", children: [
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        viewBox: `0 0 ${Wt} ${Zn}`,
        role: "img",
        "aria-label": o("Receiver floor against source signal for {source} to {receiver}: matrix {matrix}, events allow at most {bound}", {
          source: i,
          receiver: s,
          matrix: u(n.coefficient),
          bound: u(l.upperBound)
        }),
        children: [
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              className: "gl-comp-floor-frame",
              x: Ee.left,
              y: Ee.top,
              width: Wt - Ee.left - Ee.right,
              height: Zn - Ee.top - Ee.bottom
            }
          ),
          /* @__PURE__ */ e.jsx("path", { className: "gl-comp-floor-events", d: c.points }),
          /* @__PURE__ */ e.jsx("path", { className: "gl-comp-floor-bound", d: c.boundLine }),
          /* @__PURE__ */ e.jsx("path", { className: "gl-comp-floor-matrix", d: c.matrixLine }),
          c.floors.map((h, d) => /* @__PURE__ */ e.jsx("circle", { className: "gl-comp-floor-point", cx: h.x, cy: h.y, r: 3 }, d)),
          c.xTicks.map(({ tick: h, at: d }) => /* @__PURE__ */ e.jsx("text", { className: "gl-comp-floor-tick", x: d, y: Zn - Ee.bottom + 11, textAnchor: "middle", children: io(h) }, `x${h}`)),
          c.yTicks.map(({ tick: h, at: d }) => /* @__PURE__ */ e.jsx("text", { className: "gl-comp-floor-tick", x: Ee.left - 4, y: d + 3, textAnchor: "end", children: io(h) }, `y${h}`)),
          /* @__PURE__ */ e.jsx("text", { className: "gl-comp-floor-axis", x: Ee.left + (Wt - Ee.left - Ee.right) / 2, y: Zn - 4, textAnchor: "middle", children: o("{channel} (counts)", { channel: i }) }),
          /* @__PURE__ */ e.jsx("text", { className: "gl-comp-floor-axis", transform: `translate(9 ${Ee.top + (Zn - Ee.top - Ee.bottom) / 2}) rotate(-90)`, textAnchor: "middle", children: o("{channel} (counts)", { channel: s }) })
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("figcaption", { children: [
      /* @__PURE__ */ e.jsxs("span", { children: [
        /* @__PURE__ */ e.jsx("i", { className: "is-point", "aria-hidden": "true" }),
        o("Receiver floor per group of events")
      ] }),
      /* @__PURE__ */ e.jsxs("span", { children: [
        /* @__PURE__ */ e.jsx("i", { className: "is-matrix", "aria-hidden": "true" }),
        o("Matrix {value}", { value: u(n.coefficient) })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { children: [
        /* @__PURE__ */ e.jsx("i", { className: "is-bound", "aria-hidden": "true" }),
        o("Most the events allow {value}", { value: u(l.upperBound) })
      ] })
    ] })
  ] });
}
function He(n) {
  const t = n * 100;
  return `${t.toFixed(Math.abs(t) >= 10 ? 1 : 2)}%`;
}
function kl(n) {
  const t = n.floor;
  if (!t || n.floorLower === null || n.detectionLimit === null) return { text: "not read", values: {} };
  const i = He(t.upperBound), s = He(n.floorLower);
  switch (n.verdict) {
    case "above-data":
    case "upper-bound-only":
      return { text: "at most {bound}", values: { bound: i } };
    case "below-floor":
      return { text: "{lower} to {bound}", values: { lower: s, bound: i } };
    case "too-dim":
      return { text: "readable from {limit}", values: { limit: He(n.detectionLimit) } };
    case "consistent":
      return n.coefficient > 0 ? { text: "{lower} to {bound}", values: { lower: s, bound: i } } : { text: "below {bound}", values: { bound: He(Math.max(t.upperBound, n.detectionLimit)) } };
  }
}
function aa(n) {
  const t = n.floor, i = {
    matrix: He(n.coefficient),
    floor: t ? He(t.slope) : "",
    lower: n.floorLower !== null ? He(n.floorLower) : "",
    bound: t ? He(t.upperBound) : "",
    limit: n.detectionLimit !== null ? He(n.detectionLimit) : "",
    route: n.interaction
  };
  switch (n.verdict) {
    case "above-data":
      return {
        tone: "above",
        label: "Matrix above the events",
        detail: "The matrix value ({matrix}) is more than these events allow (at most {bound}).",
        values: i
      };
    case "below-floor":
      return n.coefficient > 0 ? {
        tone: "below",
        label: "Matrix below the floor",
        detail: "The receiver's floor rises with the source by {floor} ({lower} to {bound}); the matrix value is {matrix}.",
        values: i
      } : {
        tone: "below",
        label: "Possible missing coefficient",
        detail: "The receiver's floor rises with the source by {floor} ({lower} to {bound}) on a pair with a physical route ({route}); the matrix holds no value.",
        values: i
      };
    case "upper-bound-only":
      return {
        tone: "bound",
        label: "Upper bound only",
        detail: n.upperBoundReason === "loose-bound" ? "These events only cap the coefficient at {bound}, above any spillover expected between two masses, so they neither support nor contradict the matrix value ({matrix})." : n.upperBoundReason === "no-physical-route" ? "The receiver follows the source, but these masses have no physical route for spillover: read as a marker on the same cells. The events cap the coefficient at {bound}." : n.upperBoundReason === "above-plausible" ? "The receiver rises with the source by {floor}, steeper than spillover: a marker on the same cells. The events cap the coefficient at {bound}; a population without the receiver's marker could read it." : "The receiver's marker is on the source's bright cells, so the events only cap the coefficient at {bound}. A population without the receiver's marker could read it.",
        values: i
      };
    case "consistent":
      return {
        tone: "consistent",
        label: "Consistent",
        detail: n.coefficient <= 0 ? "No spillover is seen in these events; one of {limit} or more would show." : t && n.floorLower !== null && n.coefficient >= n.floorLower && n.coefficient <= t.upperBound ? "The matrix value ({matrix}) lies within what these events support ({lower} to {bound})." : "The matrix value ({matrix}) is outside what these events support ({lower} to {bound}), but by less than the screen's margin.",
        values: i
      };
    case "too-dim":
      return {
        tone: "dim",
        label: "Source too dim",
        detail: n.coefficient > 0 ? "The source is not bright enough in these events to read the matrix value ({matrix}); a coefficient of {limit} or more would show." : "The source is not bright enough in these events to read this pair; only a coefficient of {limit} or more would show.",
        values: i
      };
  }
}
const oo = {
  attention: ["above-data", "below-floor"],
  bound: ["upper-bound-only"],
  consistent: ["consistent"],
  dim: ["too-dim"],
  all: ["above-data", "below-floor", "upper-bound-only", "consistent", "too-dim"]
}, ao = {
  attention: "Needs a look",
  bound: "Upper bound only",
  consistent: "Consistent",
  dim: "Too dim",
  all: "All pairs"
};
function El({
  state: n,
  channelLabel: t,
  populationName: i,
  selected: s,
  onSelect: o,
  isStaged: l,
  canStage: c,
  onStage: u,
  onRunAgain: h
}) {
  var P;
  const { t: d } = _e(), [m, j] = F.useState("attention"), g = n.result, v = F.useMemo(() => {
    const f = { attention: 0, bound: 0, consistent: 0, dim: 0, all: 0 };
    for (const E of (g == null ? void 0 : g.pairs) ?? []) {
      f.all++;
      for (const _ of ["attention", "bound", "consistent", "dim"])
        oo[_].includes(E.verdict) && f[_]++;
    }
    return f;
  }, [g]), N = F.useMemo(
    () => ((g == null ? void 0 : g.pairs) ?? []).filter((f) => oo[m].includes(f.verdict)),
    [m, g]
  ), x = (P = g == null ? void 0 : g.oxide) != null && P.shared ? g.oxide : null, M = F.useMemo(() => !x || !g ? [] : g.pairs.filter((f) => f.interaction === "oxide (+16)" && f.coefficient > 0).map((f) => ({ source: f.source, receiver: f.receiver, value: f.coefficient * x.ratio })), [x, g]), k = n.status === "running", T = (f) => {
    const E = aa(f), _ = kl(f), L = ia(f), I = (s == null ? void 0 : s.source) === f.source && s.receiver === f.receiver, B = l(f.source, f.receiver), q = `${t(f.source)} → ${t(f.receiver)}`;
    return /* @__PURE__ */ e.jsxs(
      "tr",
      {
        className: `${I ? "is-selected" : ""}${B ? " is-staged" : ""}`,
        "aria-selected": I,
        onClick: () => o(f.source, f.receiver),
        children: [
          /* @__PURE__ */ e.jsx("th", { scope: "row", children: /* @__PURE__ */ e.jsxs("button", { type: "button", className: "gl-comp-screen-pair", onClick: () => o(f.source, f.receiver), children: [
            /* @__PURE__ */ e.jsx("strong", { children: q }),
            /* @__PURE__ */ e.jsxs("small", { children: [
              f.source,
              " → ",
              f.receiver,
              ` · ${f.interaction === "other" ? d("no physical route") : f.interaction}`,
              f.receiverUnlabelled ? ` · ${d("receiver has no antibody")}` : ""
            ] })
          ] }) }),
          /* @__PURE__ */ e.jsxs("td", { className: "is-number", children: [
            He(f.coefficient),
            B && /* @__PURE__ */ e.jsx("em", { children: d("staged") })
          ] }),
          /* @__PURE__ */ e.jsx("td", { className: "is-number", children: d(_.text, _.values) }),
          /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx("span", { className: `gl-comp-screen-reading is-${E.tone}`, title: d(E.detail, E.values), children: d(E.label) }) }),
          /* @__PURE__ */ e.jsx("td", { children: L !== null && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: !c,
              "aria-label": d("Stage {value} for {pair}", { value: He(L), pair: q }),
              onClick: (R) => {
                R.stopPropagation(), o(f.source, f.receiver), u([{ source: f.source, receiver: f.receiver, value: L }]);
              },
              children: d("Stage {value}", { value: He(L) })
            }
          ) })
        ]
      },
      `${f.source}>${f.receiver}`
    );
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-attention gl-comp-screen", "aria-labelledby": "comp-screen-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-head", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("h3", { id: "comp-screen-heading", children: d("Matrix against the events") }),
        /* @__PURE__ */ e.jsx("p", { children: d("Each pair's matrix value beside the coefficient this file's stored counts support. Spillover puts a floor under the receiver that rises with the source; a marker on the same cells only adds counts above it. A reading is a prompt to look at the pair, and nothing here changes the matrix until you apply it.") })
      ] }),
      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-actions", children: /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: k, onClick: h, children: d("Read again") }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-screen-scope", role: "status", "aria-live": "polite", children: [
      k ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, n.total), value: n.completed }),
        /* @__PURE__ */ e.jsx("span", { children: d("Reading {completed} of {total} source channels…", { completed: n.completed, total: n.total }) })
      ] }) : g ? /* @__PURE__ */ e.jsx("span", { children: d("{pairs} pairs read from {events} events of {population}.", {
        pairs: g.pairs.length.toLocaleString(),
        events: g.eventCount.toLocaleString(),
        population: i ?? d("All Events")
      }) }) : /* @__PURE__ */ e.jsx("span", { children: d("Not read yet.") }),
      i === null && /* @__PURE__ */ e.jsx("small", { children: d("Every event is in scope. Beads, debris and doublets carry signal in many channels at once and can be read as spillover: choose a population of single cells under Review scope.") }),
      g && g.unreadSources.length > 0 && /* @__PURE__ */ e.jsx("small", { children: d("{count} source channels could not be read (too few events, or no range): {channels}", {
        count: g.unreadSources.length,
        channels: g.unreadSources.map(({ source: f }) => t(f)).join(", ")
      }) })
    ] }),
    x && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-screen-oxide", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("strong", { children: d("Oxide (+16) pairs share a factor of {ratio}", { ratio: x.ratio.toFixed(2) }) }),
        /* @__PURE__ */ e.jsx("span", { children: d("Across {count} oxide pairs these events support {low} to {high} times the matrix value. Oxide formation follows the run's plasma conditions, so a matrix from another run can be off by one factor in every oxide pair.", {
          count: x.pairs.length,
          low: x.lowestRatio.toFixed(2),
          high: x.highestRatio.toFixed(2)
        }) })
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-mini-btn",
          disabled: !c || M.length === 0,
          onClick: () => u(M),
          children: d("Stage {count} oxide values × {ratio}", { count: M.length, ratio: x.ratio.toFixed(2) })
        }
      )
    ] }),
    g && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-screen-filters", role: "tablist", "aria-label": d("Pairs by reading"), children: Object.keys(ao).map((f) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": m === f,
          className: `gl-chip${m === f ? " active" : ""}`,
          onClick: () => j(f),
          children: [
            d(ao[f]),
            " (",
            v[f],
            ")"
          ]
        },
        f
      )) }),
      N.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: d(m === "attention" ? "No pair's matrix value disagrees with these events." : "No pair has this reading.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-screen-table-wrap", children: /* @__PURE__ */ e.jsxs("table", { className: "gl-comp-screen-table", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { scope: "col", children: d("Source → receiver") }),
          /* @__PURE__ */ e.jsx("th", { scope: "col", className: "is-number", children: d("Matrix") }),
          /* @__PURE__ */ e.jsx("th", { scope: "col", className: "is-number", children: d("Events support") }),
          /* @__PURE__ */ e.jsx("th", { scope: "col", children: d("Reading") }),
          /* @__PURE__ */ e.jsx("th", { scope: "col", children: /* @__PURE__ */ e.jsx("span", { className: "gl-sr-only", children: d("Stage") }) })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: N.map(T) })
      ] }) })
    ] })
  ] });
}
function Tl(n, t) {
  const i = new Map(n.channels.map((o, l) => [o.pnn, l])), s = /* @__PURE__ */ new Map();
  return {
    eventCount: t.length,
    channels: n.channels.map((o) => ({ pnn: o.pnn, marker: o.marker })),
    values(o) {
      const l = s.get(o);
      if (l) return l;
      const c = i.get(o);
      if (c === void 0) return null;
      const u = n.originalColumnData(c), h = new Float64Array(t.length);
      for (let d = 0; d < h.length; d++) h[d] = u[t[d]];
      return s.set(o, h), h;
    }
  };
}
const Al = 12, ro = { status: "idle", completed: 0, total: 0, result: null, data: null };
function Fl(n) {
  const { enabled: t, sample: i, eventIndices: s, matrix: o, revision: l } = n, [c, u] = F.useState(ro), h = F.useRef(null);
  return F.useEffect(() => {
    if (!o) {
      h.current = null, u(ro);
      return;
    }
    if (!t) return;
    const d = [i, s, o, l];
    if (h.current && d.every((M, k) => M === h.current[k])) return;
    let m = !1, j = null;
    const g = Tl(i, s), v = jl(g, o);
    let N = 0;
    u((M) => ({ ...M, status: "running", completed: 0, total: v.stepCount }));
    const x = () => {
      if (m) return;
      const M = performance.now();
      let k = !0;
      for (; k && performance.now() - M < Al; )
        k = v.step(), N++;
      if (k) {
        u((T) => ({ ...T, status: "running", completed: N, total: v.stepCount })), j = setTimeout(x, 0);
        return;
      }
      h.current = d, u({ status: "done", completed: v.stepCount, total: v.stepCount, result: v.result(), data: g });
    };
    return j = setTimeout(x, 0), () => {
      m = !0, j !== null && clearTimeout(j);
    };
  }, [t, s, o, l, i]), c;
}
function Il(n, t) {
  const i = n.index(t);
  if (i !== void 0) return i;
  const s = n.channels.findIndex((o) => o.pnn === t);
  return s < 0 ? void 0 : s;
}
function Hs(n, t) {
  if (n.length === 0) return 0;
  const i = Math.max(0, Math.min(1, t)) * (n.length - 1), s = Math.floor(i), o = Math.ceil(i);
  return s === o ? n[s] : n[s] + (n[o] - n[s]) * (i - s);
}
function $l(n) {
  const t = n.filter(Number.isFinite).sort((l, c) => l - c);
  if (t.length === 0) return [-1, 1];
  let i = Hs(t, 2e-3), s = Hs(t, 0.998);
  if (!(s > i)) {
    const l = Number.isFinite(i) ? i : 0, c = Math.max(1, Math.abs(l) * 0.05);
    return [l - c, l + c];
  }
  const o = (s - i) * 0.035;
  return i -= o, s += o, [i, s];
}
function Rl(n) {
  if (n.length === 0) return "0:empty";
  let t = 2166136261;
  for (const i of n)
    t ^= i, t = Math.imul(t, 16777619) >>> 0;
  return `${n.length}:${n[0]}:${n[n.length - 1]}:${t.toString(16)}`;
}
function Ll(n, t, i = {}) {
  var u;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const o = ((u = i.fixedEventIndices) == null ? void 0 : u.slice()) ?? En(
    n.fcs.nEvents,
    i.maxEvents ?? 2500,
    i.eventMask
  );
  for (const h of o)
    if (h >= n.fcs.nEvents || i.eventMask && !i.eventMask[h])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const l = /* @__PURE__ */ new Map();
  for (const h of Array.from(new Set(t))) {
    const d = Il(n, h);
    if (d === void 0) continue;
    const m = n.channels[d], j = n.originalColumnData(d), g = n.compensatedColumnData(d), v = new Float64Array(o.length), N = new Float64Array(o.length), x = new Float64Array(o.length), M = new Float64Array(o.length), k = [];
    for (let f = 0; f < o.length; f++) {
      const E = o[f], _ = j[E], L = g[E], I = n.rawToDisplay(m.key, _), B = n.rawToDisplay(m.key, L);
      v[f] = _, N[f] = L, x[f] = I, M[f] = B, Number.isFinite(I) && k.push(I), Number.isFinite(B) && k.push(B);
    }
    const T = $l(k), P = Object.freeze({
      key: m.key,
      pnn: m.pnn,
      range: T,
      ticks: n.channelTicks(d, [T[0], T[1]]),
      originalRaw: v,
      compensatedRaw: N,
      originalDisplay: x,
      compensatedDisplay: M
    });
    l.set(h, P), l.set(m.key, P), l.set(m.pnn, P);
  }
  const c = i.eventMask ? i.eligibleEventCount ?? i.eventMask.reduce((h, d) => h + (d ? 1 : 0), 0) : n.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: o,
      eventSignature: Rl(o),
      eligibleEventCount: c,
      channels: l
    })
  };
}
function lo(n, t, i, s, o, l, c) {
  const u = [], h = [];
  let d = 0, m = 0, j = 0;
  for (const g of o) {
    u.push(Math.max(l[0], Math.min(l[1], n[g]))), h.push(Math.max(c[0], Math.min(c[1], t[g])));
    const v = Math.abs(i[g]) <= 1e-12, N = Math.abs(s[g]) <= 1e-12;
    v && d++, N && m++, v && N && j++;
  }
  return {
    x: u,
    y: h,
    zeroPile: Object.freeze({ source: d, receiver: m, corner: j })
  };
}
function ra(n, t, i) {
  const s = n.channels.get(t), o = n.channels.get(i);
  if (!s || !o)
    return { ready: !1, reason: "One or both channels are absent from the frozen global-inspector dataset." };
  const l = [];
  for (let c = 0; c < n.eventIndices.length; c++)
    [
      s.originalDisplay[c],
      o.originalDisplay[c],
      s.compensatedDisplay[c],
      o.compensatedDisplay[c]
    ].every(Number.isFinite) && l.push(c);
  return {
    ready: !0,
    preview: Object.freeze({
      eventCount: l.length,
      totalEvents: n.eligibleEventCount,
      eventSignature: n.eventSignature,
      xRange: s.range,
      yRange: o.range,
      xTicks: s.ticks,
      yTicks: o.ticks,
      original: lo(
        s.originalDisplay,
        o.originalDisplay,
        s.originalRaw,
        o.originalRaw,
        l,
        s.range,
        o.range
      ),
      compensated: lo(
        s.compensatedDisplay,
        o.compensatedDisplay,
        s.compensatedRaw,
        o.compensatedRaw,
        l,
        s.range,
        o.range
      )
    })
  };
}
function co(n, t, i, s, o) {
  const l = Math.max(1, Math.min(24, Math.round(o) || 3)), c = 256, u = l, h = c + 2 * u, d = new Float64Array(h * h), m = Math.max(1e-12, t[1] - t[0]), j = Math.max(1e-12, i[1] - i[0]);
  for (let k = 0; k < n.x.length; k++) {
    const T = Math.max(0, Math.min(
      h - 1,
      Math.floor((n.x[k] - t[0]) / m * c) + u
    )), P = Math.max(0, Math.min(
      h - 1,
      Math.floor((n.y[k] - i[0]) / j * c) + u
    ));
    d[P * h + T]++;
  }
  const g = new Float64Array(h * h), v = (l * 2 + 1) ** 2, N = h + 1, x = new Float64Array(N * N);
  for (let k = 0; k < h; k++) {
    let T = 0;
    for (let P = 0; P < h; P++)
      T += d[k * h + P], x[(k + 1) * N + P + 1] = x[k * N + P + 1] + T;
  }
  for (let k = l; k < h - l; k++) {
    const T = k - l, P = k + l + 1;
    for (let f = l; f < h - l; f++) {
      const E = f - l, _ = f + l + 1, L = x[P * N + _] - x[T * N + _] - x[P * N + E] + x[T * N + E];
      g[k * h + f] = L / v;
    }
  }
  const M = [];
  for (let k = u; k < u + c; k++)
    for (let T = u; T < u + c; T++) {
      const P = g[k * h + T];
      P > 0 && M.push(P);
    }
  return M.sort((k, T) => k - T), M.length === 0 ? 1 : Math.max(1e-12, Hs(M, s));
}
function ti(n, t) {
  const i = Math.max(1, Math.min(10, Number.isFinite(n) ? n : 6)), s = Math.max(1, (Number.isFinite(t) ? t : 220) - 50);
  return Math.max(1, Math.min(24, i * 170 / s));
}
function si(n, t = 0.95, i = 3, s = ei) {
  const o = Math.max(
    co(n.original, n.xRange, n.yRange, t, i),
    co(n.compensated, n.xRange, n.yRange, t, i)
  );
  return Nr(o, s);
}
function ts(n, t) {
  const i = t.size / 220, s = Math.sqrt(i), o = Math.max(9, Math.min(12, 11 * s)), l = Math.max(10, Math.min(13, 12 * s));
  Cr().renderMiniPlot(n, {
    plot_size: t.size,
    canvas_scale: t.canvasScale ?? 3,
    display_mode: "pseudocolor",
    x: t.panel.x,
    y: t.panel.y,
    x_range: t.preview.xRange,
    y_range: t.preview.yRange,
    x_is_logicle: !!t.preview.xTicks,
    x_logicle_ticks: t.preview.xTicks ?? null,
    y_is_logicle: !!t.preview.yTicks,
    y_logicle_ticks: t.preview.yTicks ?? null,
    x_label: t.sourceLabel,
    y_label: t.receiverLabel,
    title: t.title,
    point_size: Math.max(0.55, Math.min(1.2, 1.15 * i)) * (t.pointSize ?? 1),
    point_alpha: t.pointAlpha,
    density_clip_quantile: 0.95,
    density_color_power: t.densityColorPower,
    density_color_ceiling: t.densityColorCeiling,
    density_smoothing: t.densitySmoothingRadius,
    axis_tick_size: 6,
    axis_outer_tick_size: 0,
    plot_margins: { top: 22, right: 8 },
    font_sizes: {
      tick: o,
      axis_label: l,
      title: Math.max(10, Math.min(13, 12 * s)),
      gate_label: o
    }
  });
}
const _n = "http://www.w3.org/2000/svg", bt = 6, Dn = 1123, wt = 794;
function la(n) {
  return Math.ceil(Math.max(0, Math.floor(n)) / bt);
}
function uo(n) {
  return n.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function ca(n, t) {
  return `gatelab-compensation-${uo(n.replace(/\.[^.]+$/, ""))}-${uo(t)}`;
}
function Xs(n, t, i, s) {
  const o = ca(n, t);
  return i === "pdf" || s <= 1 ? `${o}.${i}` : `${o}-${i}-pages.zip`;
}
function Qn(n, t, i, s, o = {}) {
  const l = document.createElementNS(_n, "text");
  return l.setAttribute("x", String(i)), l.setAttribute("y", String(s)), l.setAttribute("font-family", "Arial, Helvetica, sans-serif"), l.setAttribute("font-size", String(o.size ?? 10)), l.setAttribute("font-weight", String(o.weight ?? 400)), l.setAttribute("fill", o.fill ?? "#253247"), o.anchor && l.setAttribute("text-anchor", o.anchor), l.textContent = t, n.appendChild(l), l;
}
function ho(n, t) {
  return n.length <= t ? n : `${n.slice(0, Math.max(1, t - 1))}…`;
}
function mo(n, t, i, s, o, l, c, u, h, d, m, j) {
  const g = document.createElement("div");
  ts(g, {
    title: s === "original" ? "Original" : "Compensated",
    panel: i[s],
    preview: i,
    sourceLabel: t.sourceLabel,
    receiverLabel: t.receiverLabel,
    size: c,
    densityColorCeiling: h,
    densitySmoothingRadius: u,
    densityColorPower: d,
    pointAlpha: m,
    pointSize: j,
    canvasScale: 300 / 96
  });
  const v = g.querySelector("canvas"), N = g.querySelector("svg");
  if (!v || !N) throw new Error("GateLab could not render a compensation export panel.");
  const x = document.createElementNS(_n, "g");
  x.setAttribute("transform", `translate(${o},${l})`);
  const M = document.createElementNS(_n, "image");
  M.setAttribute("x", "0"), M.setAttribute("y", "0"), M.setAttribute("width", String(c)), M.setAttribute("height", String(c)), M.setAttribute("href", v.toDataURL("image/png")), x.appendChild(M), x.appendChild(N.cloneNode(!0)), n.appendChild(x);
}
function po(n, t, i, s) {
  const o = document.createElementNS(_n, "svg");
  o.setAttribute("xmlns", _n), o.setAttribute("width", String(Dn)), o.setAttribute("height", String(wt)), o.setAttribute("viewBox", `0 0 ${Dn} ${wt}`);
  const l = document.createElementNS(_n, "rect");
  l.setAttribute("width", "100%"), l.setAttribute("height", "100%"), l.setAttribute("fill", "#ffffff"), o.appendChild(l), Qn(o, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), Qn(
    o,
    ho(`${t.sampleName} · ${t.populationName} · ${t.profileName} · ${t.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), Qn(o, `Page ${i + 1} of ${s}`, Dn - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const c = 28, u = 18, h = 53, d = 771, m = (Dn - c * 2 - u) / 2, j = (d - h) / 3, g = 204, v = 12, N = g * 2 + v;
  return n.forEach((x, M) => {
    const k = x.buildPreview(), T = ti(t.densitySmoothing, g), P = si(
      k,
      0.95,
      T,
      t.densityColorPower
    ), f = M % 2, E = Math.floor(M / 2), _ = c + f * (m + u), L = h + E * j, I = _ + (m - N) / 2, B = L + 25, q = x.relationship && x.relationship !== "other" ? ` · ${x.relationship}` : "";
    if (Qn(
      o,
      ho(`${x.sourceLabel} → ${x.receiverLabel}`, 58),
      _ + 5,
      L + 14,
      { size: 10.5, weight: 700 }
    ), Qn(
      o,
      `matrix ${(x.coefficient * 100).toFixed(1)}%${q}`,
      _ + m - 5,
      L + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), mo(o, x, k, "original", I, B, g, T, P, t.densityColorPower, t.pointAlpha, t.pointSize ?? 1), mo(o, x, k, "compensated", I + g + v, B, g, T, P, t.densityColorPower, t.pointAlpha, t.pointSize ?? 1), E < 2) {
      const R = document.createElementNS(_n, "line");
      R.setAttribute("x1", String(_)), R.setAttribute("x2", String(_ + m)), R.setAttribute("y1", String(L + j - 3)), R.setAttribute("y2", String(L + j - 3)), R.setAttribute("stroke", "#e6eaf0"), R.setAttribute("stroke-width", "1"), o.appendChild(R);
    }
  }), Qn(
    o,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), o;
}
function fo(n) {
  return kr(n, { widthPx: Dn, heightPx: wt }), `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(n)}`;
}
async function go(n, t = 300) {
  const i = URL.createObjectURL(new Blob([n], { type: "image/svg+xml" }));
  try {
    const s = await new Promise((u, h) => {
      const d = new Image();
      d.onload = () => u(d), d.onerror = () => h(new Error("GateLab could not rasterize the compensation export page.")), d.src = i;
    }), o = Math.max(1, t / 96), l = document.createElement("canvas");
    l.width = Math.round(Dn * o), l.height = Math.round(wt * o);
    const c = l.getContext("2d");
    if (!c) throw new Error("Canvas export is unavailable in this browser.");
    return c.fillStyle = "#ffffff", c.fillRect(0, 0, l.width, l.height), c.scale(o, o), c.drawImage(s, 0, 0, Dn, wt), await new Promise((u, h) => {
      l.toBlob((d) => d ? u(d) : h(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(i);
  }
}
function vo(n, t) {
  const i = URL.createObjectURL(n), s = document.createElement("a");
  s.href = i, s.download = t, document.body.appendChild(s), s.click(), s.remove(), setTimeout(() => URL.revokeObjectURL(i), 1e3);
}
function Pl(n, t, i, s) {
  const o = Math.max(2, String(i).length);
  return `${n}-page-${String(t + 1).padStart(o, "0")}.${s}`;
}
async function Ol(n, t, i, s) {
  const o = la(n.length);
  if (o === 0) throw new Error("No compensation pairs are available to export.");
  const l = ca(t.sampleName, t.populationName);
  if (i === "pdf") {
    const { jsPDF: d } = await import("./jspdf.es.min-DmhW3_Sa.js").then((v) => v.j), m = new d({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), j = m.internal.pageSize.getWidth(), g = m.internal.pageSize.getHeight();
    for (let v = 0; v < o; v++) {
      v > 0 && m.addPage("a4", "landscape");
      const N = n.slice(
        v * bt,
        (v + 1) * bt
      ), x = fo(po(N, t, v, o)), M = await go(x), k = await new Promise((T, P) => {
        const f = new FileReader();
        f.onload = () => T(String(f.result)), f.onerror = () => P(f.error ?? new Error("GateLab could not read an export page.")), f.readAsDataURL(M);
      });
      m.addImage(k, "PNG", 0, 0, j, g, void 0, "FAST"), s == null || s({ completedPages: v + 1, totalPages: o }), await new Promise((T) => setTimeout(T, 0));
    }
    m.save(Xs(t.sampleName, t.populationName, i, o));
    return;
  }
  const c = {};
  let u = null;
  for (let d = 0; d < o; d++) {
    const m = n.slice(
      d * bt,
      (d + 1) * bt
    ), j = fo(po(m, t, d, o)), g = Pl(l, d, o, i);
    if (i === "svg") {
      const v = Sr(j);
      c[g] = v, o === 1 && (u = new Blob([v], { type: "image/svg+xml" }));
    } else {
      const v = await go(j), N = new Uint8Array(await v.arrayBuffer());
      c[g] = N, o === 1 && (u = v);
    }
    s == null || s({ completedPages: d + 1, totalPages: o }), await new Promise((v) => setTimeout(v, 0));
  }
  const h = Xs(
    t.sampleName,
    t.populationName,
    i,
    o
  );
  vo(o === 1 && u ? u : new Blob([Mr(c, { level: 6 })], { type: "application/zip" }), h);
}
const _l = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function Dl({
  sampleName: n,
  populationName: t,
  filterLabel: i,
  pairCount: s,
  onExport: o,
  onClose: l
}) {
  const { t: c } = _e(), [u, h] = F.useState("pdf"), [d, m] = F.useState(null), [j, g] = F.useState(null), v = la(s), N = d !== null && d.completedPages < d.totalPages, x = Xs(n, t, u, v), M = async () => {
    g(null), m({ completedPages: 0, totalPages: v });
    try {
      await o(u, m), l();
    } catch (k) {
      m(null), g(k instanceof Error ? k.message : String(k));
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-backdrop", children: [
    /* @__PURE__ */ e.jsx(Xo, { onClose: N ? null : l }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "gl-modal gl-comp-export-modal gl-comp-comparison-export-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "comp-comparison-export-title",
        children: [
          /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-comparison-export-title", children: c("Export compensation comparison") }),
          /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: c("Export the currently filtered channel pairs as clean paired Original and Compensated biplots. Every pair retains the same frozen events, axes, transform, density scale, and edge piling in both panels.") }),
          /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions gl-comp-comparison-export-formats", children: [
            /* @__PURE__ */ e.jsx("legend", { children: c("Format") }),
            _l.map((k) => /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  name: "compensation-comparison-export-format",
                  value: k.format,
                  checked: u === k.format,
                  disabled: N,
                  onChange: () => h(k.format)
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: k.title }),
                /* @__PURE__ */ e.jsx("small", { children: c(k.detail) })
              ] })
            ] }, k.format))
          ] }),
          /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary gl-comp-comparison-export-summary", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("File") }),
              /* @__PURE__ */ e.jsx("dd", { title: x, children: x })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Scope") }),
              /* @__PURE__ */ e.jsx("dd", { children: c(s === 1 ? "{count} filtered pair · both assays" : "{count} filtered pairs · both assays", { count: s.toLocaleString() }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Pages") }),
              /* @__PURE__ */ e.jsx("dd", { children: c(v === 1 ? "{count} A4 landscape page · six pairs per page" : "{count} A4 landscape pages · six pairs per page", { count: v.toLocaleString() }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Population") }),
              /* @__PURE__ */ e.jsx("dd", { title: t, children: t })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Filter") }),
              /* @__PURE__ */ e.jsx("dd", { title: i, children: i })
            ] })
          ] }),
          d && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-comparison-export-progress", role: "status", "aria-live": "polite", children: [
            /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, d.totalPages), value: d.completedPages }),
            /* @__PURE__ */ e.jsx("span", { children: c("Rendering page {current} of {total}", { current: Math.min(d.completedPages + 1, d.totalPages), total: d.totalPages }) })
          ] }),
          j && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: c(j) }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: N, onClick: l, children: c("Cancel") }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: N || v === 0, onClick: () => void M(), children: N ? c("Rendering…") : c("Download {format}", { format: u.toUpperCase() }) })
          ] })
        ]
      }
    )
  ] });
}
function xo(n) {
  return `"${n.replaceAll('"', '""')}"`;
}
function bo(n, t) {
  if (!Array.isArray(n) || n.length === 0)
    throw new Error(`The ${t} channel axis is empty.`);
  const i = n.map((s, o) => {
    if (typeof s != "string" || s.trim().length === 0)
      throw new Error(`The ${t} channel at position ${o + 1} is blank or invalid.`);
    return s.trim().normalize("NFC");
  });
  if (new Set(i).size !== i.length)
    throw new Error(`The ${t} channel axis contains duplicate identities.`);
  return i;
}
function Kl(n) {
  const t = bo(n.sourceChannels, "source"), i = bo(n.receiverChannels, "receiver");
  if (!Array.isArray(n.matrix) || n.matrix.length !== t.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const s = [
    ["channel", ...i].map(xo).join(",")
  ];
  return n.matrix.forEach((o, l) => {
    if (!Array.isArray(o) || o.length !== i.length)
      throw new Error(
        `Spill matrix row ${l + 1} does not match the receiver channel axis.`
      );
    const c = o.map((u, h) => {
      if (typeof u != "number" || !Number.isFinite(u))
        throw new Error(
          `Spill coefficient ${t[l]} → ${i[h]} is not finite.`
        );
      return Object.is(u, -0) ? "0" : String(u);
    });
    s.push([xo(t[l]), ...c].join(","));
  }), `${s.join(`
`)}
`;
}
function zl(n, t = "installed") {
  return `${n.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${t === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function Ul(n) {
  return [
    "spill <- as.matrix(read.csv(",
    `  "${n.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}",`,
    "  row.names = 1,",
    "  check.names = FALSE,",
    '  fileEncoding = "UTF-8"',
    "))",
    'storage.mode(spill) <- "double"'
  ].join(`
`);
}
function da({
  profileLabel: n,
  installedLabel: t,
  installedMatrix: i,
  workingMatrix: s = null,
  pendingEditCount: o = 0,
  onClose: l
}) {
  const { t: c } = _e(), [u, h] = F.useState("installed"), [d, m] = F.useState(null), j = u === "working" && s ? s : i, g = zl(n, u), v = F.useMemo(
    () => Ul(g),
    [g]
  ), N = () => {
    m(null);
    try {
      const M = Kl(j), k = URL.createObjectURL(new Blob([M], { type: "text/csv;charset=utf-8" })), T = document.createElement("a");
      T.href = k, T.download = g, document.body.appendChild(T), T.click(), T.remove(), setTimeout(() => URL.revokeObjectURL(k), 1e3);
    } catch (M) {
      m(M instanceof Error ? M.message : String(M));
    }
  }, x = async () => {
    var M;
    if (!((M = navigator.clipboard) != null && M.writeText)) {
      m("Clipboard access is unavailable; select the R code below and copy it manually.");
      return;
    }
    try {
      await navigator.clipboard.writeText(v), m("R import code copied.");
    } catch {
      m("Clipboard access was denied; select the R code below and copy it manually.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-backdrop", children: [
    /* @__PURE__ */ e.jsx(Xo, { onClose: l }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "gl-modal gl-comp-export-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "comp-export-title",
        children: [
          /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-export-title", children: c("Export spill matrix") }),
          /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: c("Coefficients are exported as exact fractions, not the rounded percentages shown in the matrix. Source channels are rows and receiver channels are columns. The CSV can be imported by GateLab or base R.") }),
          s && o > 0 && /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions", children: [
            /* @__PURE__ */ e.jsx("legend", { children: c("Matrix version") }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  name: "compensation-export-version",
                  value: "installed",
                  checked: u === "installed",
                  onChange: () => h("installed")
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: t }),
                /* @__PURE__ */ e.jsx("small", { children: c("Current applied scientific record") })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  name: "compensation-export-version",
                  value: "working",
                  checked: u === "working",
                  onChange: () => h("working")
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: c("Working draft") }),
                /* @__PURE__ */ e.jsx("small", { children: c("{count} pending edits; not yet applied", { count: o }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("File") }),
              /* @__PURE__ */ e.jsx("dd", { children: g })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Dimensions") }),
              /* @__PURE__ */ e.jsx("dd", { children: c("{sources} sources × {receivers} receivers", { sources: j.sourceChannels.length, receivers: j.receiverChannels.length }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Units") }),
              /* @__PURE__ */ e.jsx("dd", { children: c("Fractions (2.9% is written as 0.029)") })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-export-r-head", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: c("Import in R") }),
              /* @__PURE__ */ e.jsx("span", { children: c("Run after placing the CSV in the R working directory.") })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => void x(), children: c("Copy R code") })
          ] }),
          /* @__PURE__ */ e.jsx("pre", { className: "gl-comp-export-code", children: /* @__PURE__ */ e.jsx("code", { children: v }) }),
          d && /* @__PURE__ */ e.jsx("div", { className: d.includes("copied") ? "gl-comp-status" : "gl-comp-warning", role: "status", children: d }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: l, children: c("Cancel") }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", onClick: N, children: c("Download CSV") })
          ] })
        ]
      }
    )
  ] });
}
const yo = /-A$/i, Bl = /-(A|H|W)$/i;
function Vl(n, t, i) {
  const s = n.channels.map((g, v) => ({ channel: g, index: v })).filter(({ index: g }) => n.isFluorChannel(g)), l = s.some(({ channel: g }) => Bl.test(g.pnn)) ? s.filter(({ channel: g }) => yo.test(g.pnn)) : s, c = new Map(l.map(({ channel: g, index: v }) => [g.pnn, v])), u = (g) => {
    const v = n.channels.findIndex((N) => g.test(N.pnn) && yo.test(N.pnn) && Er(N.pnn));
    return v < 0 ? null : n.originalColumnData(v);
  }, h = n.fcs.keywords, d = ["TUBE NAME", "$SMNO", "$SRC"].map((g) => (h[g] ?? "").trim()).filter((g) => g.length > 0), m = (g, v) => {
    const N = (h[`$P${g + 1}${v}`] ?? "").trim(), x = N.length > 0 ? Number(N) : NaN;
    return Number.isFinite(x) ? x : null;
  }, j = [h.$CYT, h.$CYTSN].map((g) => (g ?? "").trim()).filter((g) => g.length > 0).join(" ");
  return {
    id: t,
    fileName: i,
    labels: d,
    eventCount: n.fcs.nEvents,
    channels: l.map(({ channel: g }) => ({
      key: g.key,
      pnn: g.pnn,
      marker: g.marker,
      range: g.range,
      voltage: m(g.columnIndex, "V"),
      gain: m(g.columnIndex, "G")
    })),
    values: (g) => {
      const v = c.get(g);
      return v === void 0 ? null : n.originalColumnData(v);
    },
    scatter: { forward: u(/^FSC/i), side: u(/^SSC/i) },
    cytometer: j.length > 0 ? j : null,
    acquired: (h.$DATE ?? "").trim() || null,
    embedded: n.fcs.spillover
  };
}
function Wl(n) {
  return n.length === 0 ? [] : n[0].channels.filter((t) => n.every((i) => i.channels.some((s) => s.pnn === t.pnn)));
}
function bn(n, t) {
  const i = n.lower ?? -1 / 0, s = n.upper ?? 1 / 0, o = n.mask ?? null, l = new Uint32Array(t.length);
  let c = 0;
  for (let u = 0; u < t.length; u++) {
    if (o && !o[u]) continue;
    const h = t[u];
    h >= i && h < s && (l[c++] = u);
  }
  return l.subarray(0, c);
}
function Pe(n, t) {
  const i = t ? t.length : n.length, s = new Float64Array(i);
  let o = 0;
  for (let l = 0; l < i; l++) {
    const c = n[t ? t[l] : l];
    Number.isFinite(c) && (s[o++] = c);
  }
  return s.subarray(0, o).sort();
}
function rs(n, t) {
  const i = Math.max(1, Math.ceil(n / t)), s = new Uint32Array(Math.ceil(n / i));
  for (let o = 0; o < s.length; o++) s[o] = o * i;
  return s;
}
function jt(n) {
  const t = nn(n);
  if (!Number.isFinite(t)) return { median: NaN, rsd: NaN };
  const i = new Float64Array(n.length);
  for (let s = 0; s < n.length; s++) i[s] = Math.abs(n[s] - t);
  return { median: t, rsd: 1.4826 * nn(i.sort()) };
}
const zn = (n, t) => Math.asinh(n / t), qt = (n, t) => Math.sinh(n) * t;
function ql(n, t) {
  let i = 1 / 0, s = -1 / 0;
  for (const l of n) {
    if (!l) continue;
    const c = Pe(l);
    c.length !== 0 && (i = Math.min(i, zn(Xe(c, 1e-3), t)), s = Math.max(s, zn(Xe(c, 0.999), t)));
  }
  if (!(s > i)) return null;
  const o = (s - i) / 20;
  return { cofactor: t, lo: i - o, hi: s + o };
}
function wo(n, t, i, s) {
  const o = new Uint32Array(i), l = (t.hi - t.lo) / i, c = n.length;
  for (let u = 0; u < c; u++) {
    const h = n[u];
    if (!Number.isFinite(h)) continue;
    const d = Math.floor((zn(h, t.cofactor) - t.lo) / l);
    o[Math.max(0, Math.min(i - 1, d))]++;
  }
  return o;
}
const Gl = ["⁰", "¹", "²", "³", "⁴", "⁵", "⁶", "⁷", "⁸", "⁹"];
function Hl(n) {
  const t = [], i = (s, o) => {
    const l = (zn(s, n.cofactor) - n.lo) / (n.hi - n.lo);
    l >= 0 && l <= 1 && t.push({ value: s, at: l, label: o });
  };
  i(0, "0");
  for (let s = 1; s <= 9; s++) {
    const o = 10 ** s;
    if (o < 3 * n.cofactor) continue;
    const l = `10${String(s).split("").map((c) => Gl[Number(c)]).join("")}`;
    i(o, l), i(-o, `-${l}`);
  }
  return t.sort((s, o) => s.at - o.at);
}
const Nt = 200, jo = 5, No = 0.99, Xl = 0.01;
function Co(n, t) {
  const i = n.find((s) => s.id === t);
  if (!i) throw new Error(`Compensation control file "${t}" is not among the files given.`);
  return i;
}
function Gt(n, t) {
  const i = n.values(t);
  if (!i) throw new Error(`File "${n.fileName}" has no channel "${t}".`);
  return i;
}
const Yl = (n, t) => ({
  channel: n,
  source: t,
  positiveFileId: null,
  negativeFileId: null,
  positiveCount: 0,
  negativeCount: 0,
  positiveMedian: NaN,
  negativeMedian: NaN,
  calculated: null,
  uncertainty: null,
  warnings: []
});
function So(n, t, i, s) {
  const o = /* @__PURE__ */ new Map();
  for (const m of i) {
    if (!t.includes(m.channel)) throw new Error(`"${m.channel}" is not a channel of the matrix.`);
    if (o.has(m.channel)) throw new Error(`Two controls were given for "${m.channel}".`);
    o.set(m.channel, m);
  }
  const l = new Map([].map((m, j) => [m, j])), c = (m) => (l.get(t[m]), null), u = [], h = [];
  t.forEach((m, j) => {
    const g = o.get(m), v = g ? Zl(n, t, j, g) : null;
    if (v != null && v.calculated) {
      u.push(v.calculated.map((x, M) => M === j ? 1 : Math.max(0, x))), h.push(v);
      return;
    }
    const N = c(j);
    u.push(N ?? t.map((x, M) => M === j ? 1 : 0)), h.push({ ...v ?? Yl(m, "none"), source: N ? "fallback" : "none" });
  });
  let d = null;
  try {
    d = Tr(u);
  } catch {
    d = null;
  }
  return { channels: [...t], matrix: u, rows: h, diagnostics: d };
}
function Zl(n, t, i, s) {
  var _;
  const o = Co(n, s.positive.fileId), l = Co(n, s.negative.fileId), c = Gt(o, s.channel), u = bn(s.positive, c), h = bn(s.negative, Gt(l, s.channel)), d = {
    channel: s.channel,
    source: "control",
    positiveFileId: o.id,
    negativeFileId: l.id,
    positiveCount: u.length,
    negativeCount: h.length
  }, m = [];
  if (u.length < Nt && m.push({ code: "few-positive-events", count: u.length }), h.length < Nt && m.push({ code: "few-negative-events", count: h.length }), u.length < jo || h.length < jo)
    return { ...d, positiveMedian: NaN, negativeMedian: NaN, calculated: null, uncertainty: null, warnings: m };
  const j = (L) => 1.2533 * jt(L).rsd / Math.sqrt(L.length), g = [], v = t.map((L) => {
    const I = Pe(Gt(o, L), u), B = Pe(Gt(l, L), h);
    return g.push(Math.hypot(j(I), j(B))), nn(I) - nn(B);
  }), N = Pe(c, u), x = nn(N), M = x - v[i];
  if (!(v[i] > 0))
    return { ...d, positiveMedian: x, negativeMedian: M, calculated: null, uncertainty: null, warnings: [...m, { code: "no-signal" }] };
  const k = ((_ = o.channels.find((L) => L.pnn === s.channel)) == null ? void 0 : _.range) ?? 0;
  if (k > 0 && x >= No * k)
    return { ...d, positiveMedian: x, negativeMedian: M, calculated: null, uncertainty: null, warnings: [...m, { code: "saturated" }] };
  if (k > 0) {
    let L = 0;
    for (let B = N.length - 1; B >= 0 && N[B] >= No * k; B--) L++;
    const I = L / N.length;
    I > Xl && m.push({ code: "positive-at-top-of-range", fraction: I });
  }
  const T = v.map((L, I) => I === i ? 1 : L / v[i]), P = T.map((L, I) => I === i ? 0 : Math.hypot(g[I], L * g[i]) / v[i]);
  let f = -1, E = 0;
  return T.forEach((L, I) => {
    I !== i && (L > 1 && m.push({ code: "coefficient-above-one", receiver: t[I], value: L }), L < 0 && (E++, (f < 0 || L < T[f]) && (f = I)));
  }), E > 0 && m.push({ code: "negative-set-to-zero", count: E, receiver: t[f], lowest: T[f] }), { ...d, positiveMedian: x, negativeMedian: M, calculated: T, uncertainty: P, warnings: m };
}
function Ql(n, t) {
  const i = new Map(t.channels.map((o, l) => [o, l])), s = [];
  return n.channels.forEach((o, l) => {
    const c = i.get(o);
    c !== void 0 && n.channels.forEach((u, h) => {
      var g, v, N;
      const d = i.get(u);
      if (l === h || d === void 0) return;
      const m = n.matrix[l][h], j = t.matrix[c][d];
      s.push({
        source: o,
        receiver: u,
        calculated: m,
        reference: j,
        difference: m - j,
        uncertainty: ((N = (v = (g = n.rows) == null ? void 0 : g[l]) == null ? void 0 : v.uncertainty) == null ? void 0 : N[h]) ?? null
      });
    });
  }), s.sort((o, l) => Math.abs(l.difference) - Math.abs(o.difference));
}
const xn = 64, Mo = 20, Jl = 5e-3, ec = 0.5, nc = 3, ko = 3;
function ua(n, t) {
  const i = Xe(n, 0.05) - Xe(n, 5e-3);
  return Math.max(t > 0 ? t / 2e3 : 0, Number.isFinite(i) ? i : 0, 1e-6);
}
function gt(n, t) {
  let i = 0, s = n.length;
  for (; i < s; ) {
    const o = i + s >>> 1;
    n[o] < t ? i = o + 1 : s = o;
  }
  return i;
}
function ha(n, t, i) {
  const s = Pe(n, i);
  if (s.length < 2 * Mo) return null;
  const o = ua(s, t), l = s.map((G) => Math.asinh(G / o)), c = Xe(l, 1e-3), u = Xe(l, 0.999);
  if (!(u > c)) return null;
  const h = new Float64Array(xn), d = (u - c) / xn;
  for (let G = 0; G < l.length; G++)
    h[Math.min(xn - 1, Math.max(0, Math.floor((l[G] - c) / d)))]++;
  const m = h.map((G, r) => (h[Math.max(0, r - 1)] + h[r] + h[Math.min(xn - 1, r + 1)]) / 3), j = new Float64Array(xn), g = new Float64Array(xn);
  for (let G = 1; G < xn; G++) j[G] = Math.max(j[G - 1], m[G - 1]);
  for (let G = xn - 2; G >= 0; G--) g[G] = Math.max(g[G + 1], m[G + 1]);
  let v = -1 / 0, N = 0, x = 0;
  for (let G = 1; G < xn - 1; G++) {
    const r = Math.min(j[G], g[G]) - m[G];
    r > v + 1e-9 ? (v = r, N = G, x = G) : Math.abs(r - v) <= 1e-9 && G === x + 1 && (x = G);
  }
  const M = N + x >> 1, k = c + (M + 0.5) * d, T = gt(l, k), P = Math.min(j[M], g[M]), f = P > 0 ? m[M] / P : 1, E = jt(l.slice(0, T)), _ = jt(l.slice(T)), L = Math.hypot(E.rsd, _.rsd), I = T === 0 || T === l.length ? 0 : L > 0 ? Math.SQRT2 * (_.median - E.median) / L : 1 / 0, B = Math.max(Mo, Jl * l.length), q = T >= B && l.length - T >= B && f <= ec && I >= nc, R = (G) => Math.sinh(G) * o, b = R(k);
  let U = q ? Math.min(b, R(E.median + ko * E.rsd)) : b, W = q ? Math.max(b, R(_.median - ko * _.rsd)) : b;
  return gt(s, U) < T / 2 && (U = b), s.length - gt(s, W) < (s.length - T) / 2 && (W = b), {
    bimodal: q,
    cut: b,
    negativeUpper: U,
    positiveLower: W,
    negativeCount: gt(s, U),
    positiveCount: s.length - gt(s, W),
    separation: I,
    valleyRatio: f,
    cofactor: o,
    negativeSpread: E.rsd,
    positiveSpread: _.rsd
  };
}
function tc(n) {
  const t = Xe(n, 0.99);
  return t + 2 * (t - Xe(n, 0.5));
}
const ma = 5e4, sc = 0.01, Eo = 50;
function Jn(n) {
  const t = /* @__PURE__ */ new Map();
  let i;
  for (const s of n) {
    const o = (t.get(s) ?? 0) + 1;
    t.set(s, o), (i === void 0 || o > (t.get(i) ?? 0)) && (i = s);
  }
  return i;
}
function ic(n, t, i) {
  const s = [...n, ...t], o = [...t, ...n], l = [], c = [], u = (m) => m.filter((j) => j != null);
  for (const m of i) {
    let j = !1;
    for (const g of ["voltage", "gain"]) {
      const v = (x) => {
        var M;
        return (M = x.channels.find((k) => k.pnn === m)) == null ? void 0 : M[g];
      }, N = Jn(u(o.map(v))) ?? Jn(u(s.map(v)));
      if (N !== void 0) {
        j = !0;
        for (const x of s) {
          const M = v(x);
          M != null && M !== N && l.push({ code: "setting-differs", setting: g, fileId: x.id, channel: m, value: M, expected: N });
        }
      }
    }
    j || c.push(m);
  }
  c.length > 0 && l.push({ code: "settings-not-recorded", channels: c });
  const h = Jn(u(o.map((m) => m.cytometer))) ?? Jn(u(s.map((m) => m.cytometer))), d = Jn(u(o.map((m) => m.acquired))) ?? Jn(u(s.map((m) => m.acquired)));
  for (const m of s)
    h !== void 0 && m.cytometer && m.cytometer !== h && l.push({ code: "cytometer-differs", fileId: m.id, cytometer: m.cytometer, expected: h }), d !== void 0 && m.acquired && m.acquired !== d && l.push({ code: "date-differs", fileId: m.id, acquired: m.acquired, expected: d });
  return l;
}
function pa(n, t, i, s) {
  const o = t.map((c) => n.values(c));
  if (o.some((c) => c === null)) return null;
  const l = t.map(() => new Float64Array(s.length));
  for (let c = 0; c < s.length; c++) {
    const u = s[c];
    for (let h = 0; h < t.length; h++) {
      let d = 0;
      for (let m = 0; m < t.length; m++) d += o[m][u] * i[m][h];
      l[h][c] = d;
    }
  }
  return l;
}
function oc(n, t, i, s, o) {
  const l = Yo(s.map((h) => [...h]));
  if (!l) return [];
  const c = pa(o, t, l, rs(o.eventCount, ma));
  if (!c) return [];
  const u = [];
  for (const h of i) {
    const d = t.indexOf(h.channel), m = n.find((P) => P.id === h.positive.fileId), j = n.find((P) => P.id === h.negative.fileId), g = m == null ? void 0 : m.values(h.channel), v = j == null ? void 0 : j.values(h.channel);
    if (d < 0 || !g || !v) continue;
    const N = Pe(g, bn(h.positive, g)), x = Pe(v, bn(h.negative, v)), M = Xe(N, 0.99) - nn(x), k = Xe(c[d].slice().sort(), 0.99);
    if (!(M > 0) || !Number.isFinite(k)) continue;
    const T = k / M;
    u.push({ channel: h.channel, controlTop: M, sampleTop: k, ratio: T, exceeds: T > 1 });
  }
  return u;
}
function ac(n, t, i, s) {
  const o = i.indexOf(t), l = Yo(s.map((h) => [...h]));
  if (o < 0 || !l) return [];
  const c = pa(n, i, l, rs(n.eventCount, ma));
  if (!c) return [];
  const u = [];
  return i.forEach((h, d) => {
    var f;
    if (d === o) return;
    const m = ((f = n.channels.find((E) => E.pnn === h)) == null ? void 0 : f.range) ?? 0, j = ha(c[d], m);
    if (!(j != null && j.bimodal)) return;
    const g = bn({ fileId: n.id, upper: j.negativeUpper }, c[d]), v = bn({ fileId: n.id, lower: j.positiveLower }, c[d]);
    if (g.length < Eo || v.length < Eo) return;
    const N = nn(Pe(c[d], v)) - nn(Pe(c[d], g));
    if (!(N > 0)) return;
    const x = jt(Pe(c[o], v)), M = jt(Pe(c[o], g)), k = x.median - M.median, T = 1.2533 * Math.hypot(x.rsd / Math.sqrt(v.length), M.rsd / Math.sqrt(g.length)) / N, P = k / N;
    u.push({
      source: h,
      receiver: t,
      residual: P,
      shift: k,
      uncertainty: T,
      brightCount: v.length,
      dimCount: g.length,
      flagged: Math.abs(P) >= sc && Math.abs(P) >= 3 * T
    });
  }), u.sort((h, d) => Math.abs(d.residual) - Math.abs(h.residual));
}
function fa(n) {
  return n.toLowerCase().match(/[a-z0-9]+/g) ?? [];
}
function ls(n) {
  return [n.fileName.replace(/\.(fcs|lmd)$/i, ""), ...n.labels].map(fa).filter((i) => i.length > 0);
}
const rc = [
  ["unstained"],
  ["unstain"],
  ["unlabelled"],
  ["unlabeled"],
  ["nostain"],
  ["no", "stain"],
  ["non", "stained"],
  ["nonstained"],
  ["blank"],
  ["autofluorescence"],
  ["cells", "only"],
  ["beads", "only"],
  ["negative", "control"],
  ["neg", "ctrl"],
  ["neg", "control"]
];
function ga(n, t) {
  for (let i = 0; i + t.length <= n.length; i++)
    if (t.every((s, o) => n[i + o] === s)) return !0;
  return !1;
}
function va(n) {
  return ls(n).some((t) => rc.some((i) => ga(t, i)));
}
const lc = [["fmo"], ["minus", "one"]];
function cc(n) {
  return ls(n).some((t) => lc.some((i) => ga(t, i)));
}
const dc = /^(beads?|compbeads?|ultracomp|versacomp|onecomp|microspheres?)$/, uc = /^(cells?|pbmcs?|splenocytes?|lymphocytes?|thymocytes?)$/;
function xa(n) {
  const t = ls(n).flat(), i = t.some((o) => dc.test(o)), s = t.some((o) => uc.test(o));
  return i === s ? null : i ? "beads" : "cells";
}
const hc = (n) => n.replace(/-(A|H|W)$/i, ""), Ys = (n) => fa(hc(n)).join("");
function mc(n) {
  return [Ys(n.pnn)].filter((t) => t.length >= 2);
}
function pc(n) {
  return [.../* @__PURE__ */ new Set([Ys(n.key), Ys(n.marker ?? "")])].filter((t) => t.length >= 2);
}
function ba(n, t) {
  const i = /* @__PURE__ */ new Set();
  for (const s of ls(n))
    for (let o = 0; o < s.length; o++) {
      let l = "";
      for (let c = o; c < s.length; c++)
        l += s[c], i.add(l);
    }
  for (const s of [mc, pc]) {
    const o = [];
    for (const c of t) {
      const u = s(c).filter((h) => i.has(h)).sort((h, d) => d.length - h.length);
      u.length > 0 && o.push({ key: c.pnn, name: u[0] });
    }
    const l = o.filter(({ name: c }) => !o.some((u) => u.name.length > c.length && u.name.includes(c))).map(({ key: c }) => c);
    if (l.length > 0) return { channel: l.length === 1 ? l[0] : null, candidates: l };
  }
  return { channel: null, candidates: [] };
}
const fc = 2e4, vt = 2, et = 10, gc = 0.5, vc = 3, xc = 0.05, bc = 0.1, yc = 3, To = 20;
function wc(n, t) {
  const i = rs(n.eventCount, fc), s = [0.05, 0.25, 0.5, 0.99].map(() => new Float64Array(t.length));
  t.forEach((h, d) => {
    const m = Pe(n.values(h.pnn) ?? [], i);
    [0.05, 0.25, 0.5, 0.99].forEach((j, g) => {
      s[g][d] = Xe(m, j);
    });
  });
  const [o, l, c, u] = s;
  return { events: i, p05: o, p25: l, p50: c, p99: u };
}
function Ht(n, t) {
  const i = n.filter(Number.isFinite).sort((s, o) => s - o);
  return i.length === 0 ? NaN : t ? i[0] : Xe(i, 0.5);
}
function jc(n) {
  var q;
  const t = Wl(n), i = t.map((R) => R.pnn), s = n.map((R) => wc(R, t)), o = n.map((R) => va(R)), l = /* @__PURE__ */ new Map();
  for (const R of n)
    for (const b of R.channels)
      b.marker && !l.has(b.pnn) && l.set(b.pnn, b.marker);
  const c = t.map((R) => ({ ...R, marker: R.marker ?? l.get(R.pnn) ?? null })), u = n.map((R, b) => o[b] ? { channel: null, candidates: [] } : ba(R, c)), h = n.map((R, b) => b).filter((R) => o[R]), d = n.length < 3, m = i.map((R, b) => h.length > 0 ? Ht(h.map((U) => s[U].p50[b]), !1) : Ht(s.map((U) => U.p25[b]), d)), j = i.map((R, b) => h.length > 0 ? Ht(h.map((U) => s[U].p99[b]), !1) : m[b] + yc * Ht(s.map((U) => U.p25[b] - U.p05[b]), d)), g = i.map((R, b) => Math.max(j[b], 2 * (j[b] - m[b]), 1e-9)), v = (R, b) => s[R].p99[b] - j[b], N = (R, b) => v(R, b) / g[b], x = n.map((R, b) => {
    let U = -1;
    for (let W = 0; W < i.length; W++)
      Number.isFinite(v(b, W)) && (U < 0 || v(b, W) > v(b, U)) && (U = W);
    return U;
  }), M = (R, b) => N(R, b) > vt && v(R, b) >= gc * v(R, x[R]), k = (R, b) => {
    const U = n[R], W = U.values(i[b]);
    if (!W) return [];
    const { events: G } = s[R], r = [], le = [];
    for (const ce of G)
      (W[ce] - m[b] > vt * g[b] ? r : le).push(ce);
    const J = [];
    for (let ce = 0; ce < i.length; ce++) {
      if (ce === b || N(R, ce) < et) continue;
      const D = U.values(i[ce]);
      if (!D) continue;
      const S = (ee) => D[ee] - j[ce] >= et * g[ce];
      if (le.filter(S).length >= Math.max(To, xc * G.length)) {
        J.push(i[ce]);
        continue;
      }
      const V = r.map((ee) => (D[ee] - m[ce]) / (W[ee] - m[b])), Q = Math.max(Xe(Float64Array.from(V).sort(), 0.25), 0);
      r.filter((ee, xe) => S(ee) && V[xe] > vc * Q).length >= Math.max(To, bc * r.length) && J.push(i[ce]);
    }
    return J;
  }, T = n.map(() => null), P = /* @__PURE__ */ new Map(), f = (R, b, U, W = []) => ({ role: R, channel: b, matchedBy: U, duplicate: !1, independentChannels: [], notes: W });
  n.forEach((R, b) => {
    if (o[b]) {
      T[b] = f("unstained", -1, "name");
      return;
    }
    if (cc(n[b])) {
      const r = u[b].channel === null ? -1 : i.indexOf(u[b].channel);
      T[b] = f("fmo", r, "name", u[b].candidates.length > 1 ? ["name-fits-several-channels"] : []);
      return;
    }
    if (i.length < 2 || x[b] < 0) return;
    const U = u[b].channel === null ? -1 : i.indexOf(u[b].channel), W = U >= 0 && N(b, U) >= et ? U : x[b];
    if (N(b, W) < et) return;
    const G = k(b, W);
    G.length > 0 && (T[b] = { ...f("mixed", W, null), independentChannels: G });
  });
  const E = n.map((R, b) => ({ f: b, j: u[b].channel === null ? -1 : i.indexOf(u[b].channel) })).filter(({ f: R, j: b }) => T[R] === null && b >= 0).sort((R, b) => Number(M(b.f, b.j)) - Number(M(R.f, R.j)) || v(b.f, b.j) - v(R.f, R.j));
  for (const { f: R, j: b } of E) {
    const U = M(R, b), W = U ? [] : [N(R, b) > vt ? "name-and-signal-disagree" : "named-channel-has-no-signal"];
    T[R] = f("single-stain", b, U ? "name-and-signal" : "name", W), P.has(b) ? T[R].duplicate = !0 : P.set(b, R);
  }
  const _ = /* @__PURE__ */ new Map();
  n.forEach((R, b) => {
    if (T[b] !== null) return;
    const U = i.map((r, le) => le).filter((r) => M(b, r) && N(b, r) >= et && !P.has(r)), W = u[b].candidates.map((r) => i.indexOf(r)).filter((r) => U.includes(r)), G = (W.length > 0 ? W : U).sort((r, le) => v(b, le) - v(b, r));
    G.length > 0 && _.set(b, { channels: G, tied: W.length > 0 });
  });
  const L = /* @__PURE__ */ new Map(), I = (R, b) => {
    var U;
    for (const W of ((U = _.get(R)) == null ? void 0 : U.channels) ?? []) {
      if (b.has(W)) continue;
      b.add(W);
      const G = L.get(W);
      if (G === void 0 || I(G, b))
        return L.set(W, R), !0;
    }
    return !1;
  };
  [..._.keys()].sort((R, b) => v(b, x[b]) - v(R, x[R])).forEach((R) => I(R, /* @__PURE__ */ new Set()));
  for (const [R, b] of L)
    T[b] = f("single-stain", R, (q = _.get(b)) != null && q.tied ? "name-and-signal" : "signal"), P.set(R, b);
  n.forEach((R, b) => {
    var G;
    if (T[b] !== null) return;
    const U = u[b].candidates.length > 1 ? ["name-fits-several-channels"] : [], W = x[b];
    if (W < 0 || N(b, W) <= vt)
      T[b] = f("unstained", -1, "signal", U);
    else if (N(b, W) >= et) {
      const r = P.get(W);
      r !== void 0 && ((G = T[r]) == null ? void 0 : G.matchedBy) !== "signal" && u[b].candidates.length === 0 ? T[b] = f("mixed", W, null) : (T[b] = { ...f("single-stain", W, "signal", U), duplicate: r !== void 0 }, r === void 0 && P.set(W, b));
    } else
      T[b] = f("unknown", -1, null, [...U, "weak-signal"]);
  });
  const B = n.map((R, b) => {
    const U = T[b], W = x[b];
    return {
      fileId: R.id,
      role: U.role,
      channel: U.channel >= 0 ? i[U.channel] : null,
      matchedBy: U.matchedBy,
      duplicate: U.duplicate,
      particle: xa(R),
      brightest: W >= 0 && N(b, W) > vt ? { channel: i[W], fold: N(b, W) } : null,
      fold: U.channel >= 0 ? N(b, U.channel) : null,
      independentChannels: U.independentChannels,
      notes: U.notes
    };
  });
  return {
    channels: t,
    controls: B,
    channelsWithoutControl: i.filter((R, b) => !P.has(b))
  };
}
const Nc = 0.25, Ao = 1.5, Cc = 2e4;
function Fo(n) {
  var o, l;
  const t = (o = n.scatter) == null ? void 0 : o.forward, i = (l = n.scatter) == null ? void 0 : l.side;
  if (!t || !i) return null;
  const s = rs(n.eventCount, Cc);
  return [nn(Pe(t, s)), nn(Pe(i, s))];
}
function Zs(n, t) {
  const i = Fo(n), s = Fo(t);
  return !i || !s ? !1 : i.some((o, l) => {
    const c = s[l];
    return !(o > 0) || !(c > 0) ? !1 : o / c > Ao || c / o > Ao;
  });
}
function Sc(n, t) {
  if (t.length === 0) return null;
  const i = [...t].sort((s, o) => o.eventCount - s.eventCount);
  return i.find((s) => !Zs(n, s)) ?? i[0];
}
function Mc(n, t, i, s, o = {}) {
  var I, B, q;
  const l = n.find((R) => R.id === t), c = l == null ? void 0 : l.values(i);
  if (!l || !c) throw new Error(`No file "${t}" with channel "${i}".`);
  const u = ((I = o.populations) == null ? void 0 : I[l.id]) ?? null, h = { fileId: l.id, mask: u }, d = ((B = l.channels.find((R) => R.pnn === i)) == null ? void 0 : B.range) ?? 0, m = ha(c, d, u ? bn(h, c) : null), j = o.negative ?? "auto", g = Sc(l, s), v = xa(l), N = o.kind === "beads" || o.kind === "cells" ? o.kind : v ?? (m != null && m.bimodal && m.positiveSpread < Nc ? "beads" : "cells"), x = o.kind === "beads" || o.kind === "cells" ? "chosen" : v ? "name" : "peaks", M = { channel: i, fileId: l.id, kind: N, kindFrom: x, split: m }, k = (g == null ? void 0 : g.values(i)) ?? null, T = g && k ? { fileId: g.id, mask: ((q = o.populations) == null ? void 0 : q[g.id]) ?? null } : null, P = T && k ? tc(Pe(k, bn(T, k))) : null, f = g !== null && T !== null && !Zs(l, g);
  let E = m != null && m.bimodal ? "own-peak" : "no-own-peak";
  if (m != null && m.bimodal && j === "auto" && f && P !== null) {
    const R = Pe(c, bn({ ...h, upper: m.cut }, c));
    nn(R) > P ? E = "own-peak-not-negative" : m.negativeCount < Nt && (E = "own-peak-small");
  }
  if (j !== "unstained" && (m != null && m.bimodal) && E === "own-peak")
    return {
      ...M,
      negativeSource: "internal",
      negativeFileId: l.id,
      negativeReason: j === "internal" ? "chosen" : "own-peak",
      spec: {
        channel: i,
        positive: { ...h, lower: m.positiveLower },
        negative: { ...h, upper: m.negativeUpper }
      },
      problem: null,
      scatterDiffers: !1
    };
  const _ = { ...M, negativeSource: null, negativeFileId: null, negativeReason: null, spec: null, scatterDiffers: !1 };
  if (j === "internal" || j === "auto" && N === "beads" && !f)
    return { ..._, problem: "no-negative-population" };
  if (!g || !T || P === null) return { ..._, problem: "no-unstained-control" };
  const L = (m == null ? void 0 : m.bimodal) && E !== "own-peak-not-negative";
  return {
    ...M,
    negativeSource: "unstained",
    negativeFileId: g.id,
    negativeReason: j === "unstained" ? "chosen" : E === "own-peak" ? "no-own-peak" : E,
    spec: { channel: i, positive: { ...h, lower: L ? m.positiveLower : P }, negative: T },
    problem: null,
    scatterDiffers: Zs(l, g)
  };
}
const Ds = (n) => n.channels.map((t) => t.pnn).sort().join("");
function kc(n, t = {}) {
  const i = n.filter((d) => {
    var m;
    return ((m = t[d.id]) == null ? void 0 : m.role) !== "ignored";
  }), s = /* @__PURE__ */ new Map();
  for (const d of i) {
    const m = Ds(d);
    s.set(m, [...s.get(m) ?? [], d]);
  }
  let o = [], l = -1;
  for (const d of s.values()) {
    const m = d.filter((j) => va(j) || ba(j, d[0].channels).channel !== null).length;
    (m > l || m === l && d.length > o.length) && (o = d, l = m);
  }
  const c = o.length > 0 ? o[0].channels.map((d) => d.pnn) : [], u = o.length > 0 ? Ds(o[0]) : "";
  o = i.filter((d) => Ds(d) === u || c.length > 0 && c.every((m) => d.channels.some((j) => j.pnn === m)));
  const h = new Set(o.map((d) => d.id));
  return {
    files: o,
    otherChannels: i.filter((d) => !h.has(d.id)).map((d) => d.id),
    detection: jc(o)
  };
}
function Io(n) {
  var t;
  return ((t = n.embedded) == null ? void 0 : t.matrix.some((i, s) => i.some((o, l) => s !== l && o !== 0))) ?? !1;
}
function Ec(n, t = {}) {
  const { files: i, detection: s } = n, o = i.map((f, E) => {
    const _ = s.controls[E], L = t[f.id] ?? {}, I = L.role ?? _.role, B = L.channel !== void 0 ? L.channel : _.channel;
    return { file: f, detected: _, choice: L, role: I, channel: B, chosen: L.role !== void 0 || L.channel !== void 0 };
  }), l = /* @__PURE__ */ new Map();
  for (const f of s.channels) {
    const E = o.filter((_) => _.role === "single-stain" && _.channel === f.pnn).sort((_, L) => Number(L.chosen) - Number(_.chosen) || Number(_.detected.duplicate) - Number(L.detected.duplicate) || (L.detected.fold ?? 0) - (_.detected.fold ?? 0));
    E.length > 0 && l.set(f.pnn, E[0].file.id);
  }
  const c = o.filter((f) => f.role === "unstained").map((f) => f.file), u = /* @__PURE__ */ new Map();
  for (const f of o) {
    if (f.role !== "single-stain" || f.channel === null || l.get(f.channel) !== f.file.id) continue;
    const E = Mc(i, f.file.id, f.channel, c, {
      kind: f.choice.kind,
      negative: f.choice.negative
    }), { negativeLower: _, negativeUpper: L, positiveLower: I, positiveUpper: B } = f.choice, q = (b) => Object.fromEntries(Object.entries(b).filter(([, U]) => U !== void 0));
    let R = E.spec;
    R ? R = {
      channel: R.channel,
      positive: { ...R.positive, ...q({ lower: I, upper: B }) },
      // The boundaries are on this file's events: they do not apply to an unstained control's.
      negative: E.negativeSource !== "internal" ? R.negative : { ...R.negative, ...q({ lower: _, upper: L }) }
    } : L !== void 0 && I !== void 0 && f.choice.negative !== "unstained" && (R = {
      channel: f.channel,
      positive: { fileId: f.file.id, lower: I, ...q({ upper: B }) },
      negative: { fileId: f.file.id, upper: L, ...q({ lower: _ }) }
    }), u.set(f.file.id, {
      planned: E,
      spec: R,
      moved: [_, L, I, B].some((b) => b !== void 0)
    });
  }
  const h = (f) => {
    var E;
    return ((E = u.get(l.get(f) ?? "")) == null ? void 0 : E.spec) ?? null;
  }, d = s.channels.map((f) => f.pnn).filter((f) => h(f) !== null), m = So(i, d, d.map((f) => h(f))), j = new Map(m.rows.map((f) => [f.channel, f])), g = d.filter((f) => {
    var E;
    return ((E = j.get(f)) == null ? void 0 : E.calculated) != null;
  }), v = g.map((f) => h(f)), N = g.length < 2 ? null : g.length === d.length ? m : So(i, g, v);
  N == null || N.rows.forEach((f) => j.set(f.channel, f));
  const x = o.map((f) => {
    const E = u.get(f.file.id) ?? null, _ = E !== null, L = (E == null ? void 0 : E.spec) ?? null, I = L !== null && L.negative.fileId === f.file.id && L.negative.upper !== void 0;
    return {
      file: f.file,
      detected: f.detected,
      role: f.role,
      channel: f.channel,
      chosen: f.chosen,
      duplicate: f.role === "single-stain" && f.channel !== null && !_,
      planned: (E == null ? void 0 : E.planned) ?? null,
      spec: L,
      negativeLower: I ? L.negative.lower ?? null : null,
      negativeUpper: I ? L.negative.upper : null,
      positiveLower: (L == null ? void 0 : L.positive.lower) ?? null,
      positiveUpper: (L == null ? void 0 : L.positive.upper) ?? null,
      boundariesMoved: (E == null ? void 0 : E.moved) ?? !1,
      row: _ && f.channel !== null ? j.get(f.channel) ?? null : null
    };
  }), M = x.filter((f) => f.role === "mixed").map((f) => f.file), k = new Set(v.flatMap((f) => [f.positive.fileId, f.negative.fileId])), T = i.filter((f) => k.has(f.id)), P = M.find(Io) ?? i.find(Io) ?? null;
  return {
    channels: s.channels,
    files: x,
    otherChannels: n.otherChannels,
    matrixChannels: g,
    estimate: N,
    channelsWithoutControl: s.channels.map((f) => f.pnn).filter((f) => !g.includes(f)),
    reference: N && (P != null && P.embedded) ? { fileId: P.id, differences: Ql(N, P.embedded) } : null,
    settings: N ? ic(T, M, g) : [],
    brightness: N ? M.map((f) => ({
      fileId: f.id,
      findings: oc(i, g, v, N.matrix, f)
    })) : [],
    fmo: N ? x.filter((f) => f.role === "fmo" && f.channel !== null && g.includes(f.channel)).map((f) => ({
      fileId: f.file.id,
      omitted: f.channel,
      residuals: ac(f.file, f.channel, g, N.matrix)
    })) : []
  };
}
function Tc(n) {
  const t = new Map(n.files.map((s) => [s.file.id, s])), i = (s) => ({
    ...s.lower !== void 0 && Number.isFinite(s.lower) ? { lower: s.lower } : {},
    ...s.upper !== void 0 && Number.isFinite(s.upper) ? { upper: s.upper } : {}
  });
  return n.matrixChannels.map((s) => {
    const o = n.files.find((u) => {
      var h, d;
      return ((h = u.spec) == null ? void 0 : h.channel) === s && ((d = u.row) == null ? void 0 : d.channel) === s;
    }), l = o.spec, c = t.get(l.negative.fileId).file;
    return {
      channel: s,
      row: "control",
      events: { fileName: o.file.fileName, count: o.row.positiveCount, ...i(l.positive) },
      negative: { fileName: c.fileName, count: o.row.negativeCount, ...i(l.negative) }
    };
  });
}
const $o = 5e-3, Ac = 5, Xt = 160, re = { width: 620, height: 190, left: 10, right: 10, top: 10, bottom: 24 }, Ro = {
  "single-stain": "Single-stained control",
  unstained: "Unstained control",
  fmo: "FMO control",
  mixed: "Stained sample",
  unknown: "Not recognised",
  ignored: "Not used"
}, On = (n) => Math.abs(n) >= 1e3 ? Math.round(n).toLocaleString("en-US") : ve(n, 3);
function Fc(n, t) {
  if (!t.has(n)) return n;
  for (let i = 2; ; i++) if (!t.has(`${n} ${i}`)) return `${n} ${i}`;
}
function Ic(n, t) {
  switch (n.code) {
    case "few-positive-events":
      return t("Only {count} positive events (fewer than {limit}).", { count: n.count, limit: Nt });
    case "few-negative-events":
      return t("Only {count} negative events (fewer than {limit}).", { count: n.count, limit: Nt });
    case "coefficient-above-one":
      return t("Brighter in {receiver} than in its own channel ({value}): check its channel.", {
        receiver: n.receiver,
        value: Te(n.value)
      });
    case "negative-set-to-zero":
      return t("Coefficients below zero stored as 0: {count} (lowest: {receiver}, {value}).", {
        count: n.count,
        receiver: n.receiver,
        value: Te(n.lowest)
      });
    case "positive-at-top-of-range":
      return t("{percent} of the positive events are at the top of the range.", { percent: Te(n.fraction) });
    case "saturated":
      return t("Its positive events are at the top of the range: the detector was saturated, and no row can be calculated. Record the control dimmer, or at the voltage of a dimmer sample.");
    default:
      return t("The positive events are not above the negative events: no row.");
  }
}
function $c(n, t, i, s) {
  var l, c, u, h, d, m, j, g;
  if (i) return [s("Its channels are not the controls': not used.")];
  if (!n) return [];
  const o = [];
  if (n.duplicate && n.channel !== null) {
    const v = t.files.find((N) => N.planned !== null && N.channel === n.channel);
    o.push(s("Not used: {file} is the control for {channel}.", { file: (v == null ? void 0 : v.file.fileName) ?? "", channel: n.channel }));
  }
  n.role === "single-stain" && n.channel === null && o.push(s("Choose its channel.")), ((l = n.planned) == null ? void 0 : l.problem) === "no-negative-population" && o.push(s("No negative peak was found. Bead controls carry their own negative beads: mark the two populations by hand, or choose Cells to use the unstained control.")), ((c = n.planned) == null ? void 0 : c.problem) === "no-unstained-control" && o.push(s("No negative population, and no unstained control to take one from.")), ((u = n.planned) == null ? void 0 : u.negativeReason) === "own-peak-not-negative" ? o.push(s("Its lower peak is above the unstained control's events, so it is not a negative population: the unstained control is used.")) : ((h = n.planned) == null ? void 0 : h.negativeReason) === "own-peak-small" && o.push(s("It has only {count} negative events of its own: the unstained control is used.", { count: ((d = n.planned.split) == null ? void 0 : d.negativeCount) ?? 0 })), (m = n.planned) != null && m.scatterDiffers && o.push(s("The unstained control is of other particles (its scatter differs)."));
  for (const v of ((j = n.row) == null ? void 0 : j.warnings) ?? []) o.push(Ic(v, s));
  if (n.role === "single-stain" || n.role === "fmo") {
    for (const v of n.detected.notes)
      v === "named-channel-has-no-signal" ? o.push(s("Named for a channel that holds no signal.")) : v === "name-and-signal-disagree" ? o.push(s("Named for this channel, but brightest in {channel}.", { channel: ((g = n.detected.brightest) == null ? void 0 : g.channel) ?? "?" })) : v === "name-fits-several-channels" && o.push(s("Its name fits several channels."));
    n.chosen && n.role === "single-stain" && n.channel !== null && n.detected.brightest && n.detected.brightest.channel !== n.channel && o.push(s("Brightest in {channel}.", { channel: n.detected.brightest.channel }));
  }
  return n.detected.notes.includes("weak-signal") && n.role === "unknown" && o.push(s("A little signal, not enough for a control.")), n.boundariesMoved && o.push(s("Boundaries set by hand.")), o;
}
function Rc(n, t) {
  return n.chosen ? t("Chosen") : n.detected.matchedBy === "name-and-signal" ? t("Name and signal") : n.detected.matchedBy === "name" ? t("Name") : n.detected.matchedBy === "signal" ? t("Signal") : "";
}
function Lc(n, t, i) {
  var l;
  const s = [];
  n.channelsWithoutControl.length > 0 && s.push(n.brightness.length > 0 || n.fmo.length > 0 ? i("No usable control for {channels}: left out of the matrix. A sample stained in one of them is not compensated for it, and the findings below may come from it.", { channels: n.channelsWithoutControl.join(", ") }) : i("No usable control for {channels}: left out of the matrix.", { channels: n.channelsWithoutControl.join(", ") }));
  for (const c of n.settings)
    c.code === "setting-differs" ? s.push(c.setting === "voltage" ? i("{file}: {channel} was run at {value} V, the others at {expected} V. Spillover changes with voltage.", {
      file: t(c.fileId),
      channel: c.channel,
      value: c.value,
      expected: c.expected
    }) : i("{file}: {channel} was run at gain {value}, the others at {expected}.", {
      file: t(c.fileId),
      channel: c.channel,
      value: c.value,
      expected: c.expected
    })) : c.code === "settings-not-recorded" ? s.push(i("No file records a voltage or a gain for {channels}: the settings were not compared.", { channels: c.channels.join(", ") })) : c.code === "cytometer-differs" ? s.push(i("{file} was run on {cytometer}, the others on {expected}.", {
      file: t(c.fileId),
      cytometer: c.cytometer,
      expected: c.expected
    })) : s.push(i("{file} was acquired on {date}, the others on {expected}.", {
      file: t(c.fileId),
      date: c.acquired,
      expected: c.expected
    }));
  const o = /* @__PURE__ */ new Map();
  for (const { fileId: c, findings: u } of n.brightness)
    for (const h of u)
      h.exceeds && h.ratio > (((l = o.get(h.channel)) == null ? void 0 : l.ratio) ?? 0) && o.set(h.channel, { fileId: c, ratio: h.ratio });
  for (const [c, { fileId: u, ratio: h }] of o)
    s.push(i("{channel}: {file} is {ratio} times as bright as the control reaches, so the spillover of its brightest events is extrapolated.", {
      channel: c,
      file: t(u),
      ratio: ve(h, 3)
    }));
  for (const { fileId: c, omitted: u, residuals: h } of n.fmo) {
    const d = h.filter((m) => m.flagged);
    d.length === 0 && s.push(i("{file}: nothing is left in {channel} after compensation ({count} stained channels checked).", {
      file: t(c),
      channel: u,
      count: h.length
    }));
    for (const m of d)
      s.push(m.residual > 0 ? i("{file}: {value} of {source} is left in {receiver} after compensation. The coefficient looks too small.", {
        file: t(c),
        value: Te(m.residual),
        source: m.source,
        receiver: m.receiver
      }) : i("{file}: {receiver} is pulled {value} of {source} below its level after compensation. The coefficient looks too large.", {
        file: t(c),
        value: Te(-m.residual),
        source: m.source,
        receiver: m.receiver
      }));
  }
  if (n.reference && n.reference.differences.length > 0) {
    const c = n.reference.differences[0], u = n.reference.differences.filter((h) => Math.abs(h.difference) > Math.max($o, Ac * (h.uncertainty ?? 0))).length;
    s.push(i("Against the matrix embedded in {file}: the largest difference is {source} into {receiver}, {calculated} calculated against {reference}. {count} of {total} coefficients differ by more than {threshold} and more than five standard errors.", {
      file: t(n.reference.fileId),
      source: c.source,
      receiver: c.receiver,
      calculated: c.uncertainty !== null ? `${Te(c.calculated)} ± ${Te(c.uncertainty, !1, 2)}` : Te(c.calculated),
      reference: Te(c.reference),
      count: u,
      total: n.reference.differences.length,
      threshold: Te($o)
    }));
  }
  return s;
}
const Qs = {
  negativeLower: void 0,
  negativeUpper: void 0,
  positiveLower: void 0,
  positiveUpper: void 0
}, Pc = {
  negativeLower: "Lower boundary of the negative events",
  negativeUpper: "Upper boundary of the negative events",
  positiveLower: "Lower boundary of the positive events",
  positiveUpper: "Upper boundary of the positive events"
};
function Oc({ entry: n, files: t, onBoundaries: i, onReset: s }) {
  var S, H;
  const { t: o } = _e(), l = n.channel, c = n.file.values(l), u = n.spec && n.spec.negative.fileId !== n.file.id ? t.find((V) => V.id === n.spec.negative.fileId) ?? null : null, h = (u == null ? void 0 : u.values(l)) ?? null, d = F.useMemo(() => {
    var ee, xe, X;
    if (!c) return null;
    const V = ((ee = n.file.channels.find((O) => O.pnn === l)) == null ? void 0 : ee.range) ?? 0, Q = ((X = (xe = n.planned) == null ? void 0 : xe.split) == null ? void 0 : X.cofactor) ?? ua(Pe(c), V), ie = ql([c, h], Q);
    return ie ? {
      scale: ie,
      counts: wo(c, ie, Xt),
      otherCounts: h ? wo(h, ie, Xt) : null,
      sorted: Pe(c)
    } : null;
  }, [c, h, l, n.file, n.planned]), [m, j] = F.useState(null), g = F.useRef(null);
  if (F.useEffect(() => j(null), [n.file.id, l]), !c || !d) return /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: o("This file has no events to draw in {channel}.", { channel: l }) });
  const { scale: v, counts: N, otherCounts: x, sorted: M } = d, k = { width: re.width - re.left - re.right, height: re.height - re.top - re.bottom }, T = (V) => re.left + (zn(V, v.cofactor) - v.lo) / (v.hi - v.lo) * k.width, P = (V) => Math.max(re.left, Math.min(re.left + k.width, V)), f = (V) => {
    const Q = g.current.getBoundingClientRect(), ie = (V - Q.left) / Q.width * re.width, ee = (P(ie) - re.left) / k.width;
    return qt(v.lo + ee * (v.hi - v.lo), v.cofactor);
  }, E = (V, Q) => {
    const ie = Math.max(1, ...V), ee = k.width / V.length, xe = re.top + k.height;
    let X = Q ? `M${re.left},${xe}` : "";
    return V.forEach((O, te) => {
      const ge = xe - O / ie * k.height, Fe = re.left + te * ee;
      X += `${X === "" ? "M" : "L"}${Fe.toFixed(1)},${ge.toFixed(1)}L${(Fe + ee).toFixed(1)},${ge.toFixed(1)}`;
    }), Q ? `${X}L${re.left + k.width},${xe}Z` : X;
  }, _ = { lo: qt(v.lo, v.cofactor), hi: qt(v.hi, v.cofactor) }, L = (V) => (m == null ? void 0 : m.which) === V ? m.value : n[V], I = L("negativeUpper"), B = L("positiveLower"), q = I === null ? null : L("negativeLower") ?? _.lo, R = B === null ? null : L("positiveUpper") ?? _.hi, b = (V, Q) => {
    const [ie, ee] = V === "negativeLower" ? [_.lo, I ?? _.hi] : V === "negativeUpper" ? [q ?? _.lo, B ?? _.hi] : V === "positiveLower" ? [I ?? _.lo, R ?? _.hi] : [B ?? _.lo, _.hi];
    return Math.max(ie, Math.min(ee, Q));
  }, U = (V, Q) => {
    if (j(null), Q === (n[V] ?? (V === "negativeLower" ? _.lo : V === "positiveUpper" ? _.hi : null))) return;
    const ie = (v.hi - v.lo) / Xt / 2, ee = zn(Q, v.cofactor), xe = V === "negativeLower" && ee <= v.lo + ie || V === "positiveUpper" && ee >= v.hi - ie;
    i({ [V]: xe ? void 0 : Q });
  }, W = (V, Q) => {
    const ie = V.startsWith("negative") ? "negative" : "positive", ee = V.endsWith("Lower") ? "lower" : "upper", xe = P(T(Q)), X = (O) => {
      const te = zn(Q, v.cofactor) + O * (v.hi - v.lo) / Xt;
      U(V, b(V, qt(te, v.cofactor)));
    };
    return /* @__PURE__ */ e.jsxs(
      "g",
      {
        className: `gl-comp-controls-handle is-${ie} is-${ee}`,
        role: "slider",
        tabIndex: 0,
        "aria-label": o(Pc[V]),
        "aria-valuenow": Math.round(Q),
        "aria-valuetext": On(Q),
        onKeyDown: (O) => {
          O.key === "ArrowLeft" || O.key === "ArrowDown" ? (O.preventDefault(), X(O.shiftKey ? -5 : -1)) : (O.key === "ArrowRight" || O.key === "ArrowUp") && (O.preventDefault(), X(O.shiftKey ? 5 : 1));
        },
        onPointerDown: (O) => {
          var te, ge;
          O.preventDefault(), (ge = (te = O.currentTarget).setPointerCapture) == null || ge.call(te, O.pointerId), j({ which: V, value: Q });
        },
        onPointerMove: (O) => {
          (m == null ? void 0 : m.which) === V && j({ which: V, value: b(V, f(O.clientX)) });
        },
        onPointerUp: (O) => {
          var te, ge;
          (m == null ? void 0 : m.which) === V && ((ge = (te = O.currentTarget).releasePointerCapture) == null || ge.call(te, O.pointerId), U(V, m.value));
        },
        onPointerCancel: () => j(null),
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: xe - 7, y: re.top, width: 14, height: k.height, fill: "transparent" }),
          /* @__PURE__ */ e.jsx("line", { x1: xe, x2: xe, y1: re.top, y2: re.top + k.height }),
          /* @__PURE__ */ e.jsx("path", { d: `M${xe - 5},${re.top}h10l-5,7z` })
        ]
      }
    );
  }, G = (V) => {
    let Q = 0, ie = M.length;
    for (; Q < ie; ) {
      const ee = Q + ie >>> 1;
      M[ee] < V ? Q = ee + 1 : ie = ee;
    }
    return Q;
  }, r = L("negativeLower"), le = L("positiveUpper"), J = B === null ? 0 : (le === null ? M.length : G(le)) - G(B), ce = I === null ? ((S = n.row) == null ? void 0 : S.negativeCount) ?? 0 : G(I) - (r === null ? 0 : G(r)), D = () => {
    i({ ...Qs, negativeUpper: M[Math.floor(M.length * 0.1)], positiveLower: M[Math.floor(M.length * 0.5)] });
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-histogram", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-histogram-head", children: [
      /* @__PURE__ */ e.jsx("strong", { children: o("{file}: events in {channel}", { file: n.file.fileName, channel: l }) }),
      n.boundariesMoved && /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: s, children: o("Reset boundaries") }),
      n.spec === null && ((H = n.planned) == null ? void 0 : H.problem) === "no-negative-population" && /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn gl-comp-controls-by-hand", onClick: D, children: o("Mark by hand") })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        ref: g,
        className: "gl-comp-controls-plot",
        viewBox: `0 0 ${re.width} ${re.height}`,
        role: "group",
        "aria-label": o("Histogram of {file} in {channel}", { file: n.file.fileName, channel: l }),
        children: [
          I !== null && q !== null && /* @__PURE__ */ e.jsx(
            "rect",
            {
              className: "gl-comp-controls-negative",
              x: P(T(q)),
              y: re.top,
              width: Math.max(0, P(T(I)) - P(T(q))),
              height: k.height
            }
          ),
          B !== null && R !== null && /* @__PURE__ */ e.jsx(
            "rect",
            {
              className: "gl-comp-controls-positive",
              x: P(T(B)),
              y: re.top,
              width: Math.max(0, P(T(R)) - P(T(B))),
              height: k.height
            }
          ),
          /* @__PURE__ */ e.jsx("path", { className: "gl-comp-controls-own", d: E(N, !0) }),
          x && /* @__PURE__ */ e.jsx("path", { className: "gl-comp-controls-other", d: E(x, !1) }),
          /* @__PURE__ */ e.jsx("line", { className: "gl-comp-controls-axis", x1: re.left, x2: re.left + k.width, y1: re.top + k.height, y2: re.top + k.height }),
          Hl(v).map((V) => {
            const Q = re.left + V.at * k.width;
            return /* @__PURE__ */ e.jsxs("g", { className: "gl-comp-controls-tick", children: [
              /* @__PURE__ */ e.jsx("line", { x1: Q, x2: Q, y1: re.top + k.height, y2: re.top + k.height + 4 }),
              /* @__PURE__ */ e.jsx("text", { x: Q, y: re.height - 6, textAnchor: "middle", children: V.label })
            ] }, V.label);
          }),
          q !== null && W("negativeLower", q),
          I !== null && W("negativeUpper", I),
          R !== null && W("positiveUpper", R),
          B !== null && W("positiveLower", B)
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("p", { className: "gl-comp-controls-counts", children: [
      B !== null && /* @__PURE__ */ e.jsx("span", { className: "is-positive", children: le === null ? o("Positive: {count} events at or above {value}", { count: J.toLocaleString("en-US"), value: On(B) }) : o("Positive: {count} events from {lower} to {upper}", { count: J.toLocaleString("en-US"), lower: On(B), upper: On(le) }) }),
      I !== null ? /* @__PURE__ */ e.jsx("span", { className: "is-negative", children: r === null ? o("Negative: {count} events below {value}", { count: ce.toLocaleString("en-US"), value: On(I) }) : o("Negative: {count} events from {lower} to {upper}", { count: ce.toLocaleString("en-US"), lower: On(r), upper: On(I) }) }) : u ? /* @__PURE__ */ e.jsx("span", { className: "is-negative", children: o("Negative: all {count} events of {file} (dashed line)", { count: ce.toLocaleString("en-US"), file: u.fileName }) }) : null
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: o("Each set of events has a lower and an upper boundary: drag one, or select it and use the arrow keys. Events outside both sets are not used.") })
  ] });
}
function _c({ workspaceFiles: n, takenNames: t, onAdd: i, onClose: s }) {
  const { t: o } = _e(), [l] = F.useState(() => n.filter(({ sample: D }) => D.instrument === "flow")), [c, u] = F.useState([]), [h, d] = F.useState({}), [m, j] = F.useState(null), [g, v] = F.useState(() => Fc("Calculated matrix", t)), [N, x] = F.useState(null), [M, k] = F.useState(!1), [T, P] = F.useState(!1), f = F.useRef(null), E = F.useMemo(
    () => [...l, ...c].map(({ id: D, name: S, sample: H }) => Vl(H, D, S)),
    [l, c]
  ), _ = E.filter((D) => {
    var S;
    return ((S = h[D.id]) == null ? void 0 : S.role) === "ignored";
  }).map((D) => D.id).join(""), L = F.useMemo(() => kc(E, h), [E, _]), I = F.useMemo(() => Ec(L, h), [L, h]), B = F.useMemo(() => new Map(I.files.map((D) => [D.file.id, D])), [I]), q = (D) => {
    var S;
    return ((S = E.find((H) => H.id === D)) == null ? void 0 : S.fileName) ?? D;
  }, R = (m !== null ? B.get(m) : void 0) ?? I.files.find((D) => D.planned !== null) ?? null, b = F.useMemo(() => Lc(I, q, o), [I, o]), U = (D, S) => {
    x(null), d((H) => ({ ...H, [D]: { ...H[D], ...S } }));
  }, W = async (D) => {
    k(!0), x(null);
    try {
      const S = [];
      for (const H of D)
        try {
          const V = new Fr(Ir(await H.arrayBuffer()));
          if (V.instrument !== "flow") throw new Error(o("not a flow cytometry file"));
          S.push({ id: `added-${Date.now()}-${S.length}-${H.name}`, name: H.name, sample: V });
        } catch (V) {
          x(o("{file} could not be read: {reason}", { file: H.name, reason: V instanceof Error ? V.message : String(V) }));
        }
      u((H) => [...H, ...S.filter((V) => ![...l, ...H].some((Q) => Q.name === V.name))]);
    } finally {
      k(!1);
    }
  }, G = (D) => {
    const S = Array.from(D.currentTarget.files ?? []);
    D.currentTarget.value = "", S.length > 0 && W(S);
  }, r = () => void ni(f.current, { "application/vnd.isac.fcs": [".fcs"] }, "Compensation controls", !0).then((D) => {
    D && D.length > 0 && W(D);
  }), le = async () => {
    if (I.estimate) {
      P(!0), x(null);
      try {
        const D = await Ar(
          I.matrixChannels,
          I.estimate.matrix,
          Tc(I),
          g.trim().normalize("NFC").slice(0, 200) || "Calculated matrix"
        );
        s(i(D));
      } catch (D) {
        x(D instanceof Error ? D.message : String(D));
      } finally {
        P(!1);
      }
    }
  }, J = I.estimate ? Math.max(0, ...I.estimate.matrix.flatMap((D, S) => D.filter((H, V) => S !== V).map(Math.abs))) : 0, ce = Object.keys(h).length > 0;
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (D) => {
    D.key === "Escape" && s();
  }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-controls", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-controls-title", children: [
    /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-controls-title", children: o("Calculate a matrix from single-stained controls") }),
    /* @__PURE__ */ e.jsx("p", { className: "gl-comp-controls-intro", children: o("Each file is read for what it is: a single-stained control and its channel, an unstained control, an FMO control or a stained sample. Correct anything read wrongly. The matrix is added to the list of matrices and compensates no file until you use it.") }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-bar", children: [
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", disabled: M, onClick: r, children: o(M ? "Reading…" : "Add FCS files…") }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", disabled: !ce, onClick: () => {
        d({}), x(null);
      }, children: o("Reset to what was read") }),
      /* @__PURE__ */ e.jsx("span", { className: "gl-hint", children: o("{files} files · {controls} controls used · {channels} channels in the matrix", {
        files: E.length,
        controls: I.files.filter((D) => D.planned !== null).length,
        channels: I.matrixChannels.length
      }) }),
      /* @__PURE__ */ e.jsx(
        "input",
        {
          ref: f,
          type: "file",
          accept: ".fcs",
          multiple: !0,
          className: "gl-sr-only",
          "aria-label": o("Add compensation control files"),
          onChange: G
        }
      )
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-body", children: [
      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-controls-files", children: E.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: o("No flow files yet. Add the control files, and a stained sample of the same experiment if you have one.") }) : /* @__PURE__ */ e.jsxs("table", { className: "gl-comp-controls-table", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { children: o("File") }),
          /* @__PURE__ */ e.jsx("th", { children: o("Read as") }),
          /* @__PURE__ */ e.jsx("th", { children: o("Channel") }),
          /* @__PURE__ */ e.jsx("th", { children: o("By") }),
          /* @__PURE__ */ e.jsx("th", { children: o("Particles") }),
          /* @__PURE__ */ e.jsx("th", { children: o("Negative events") }),
          /* @__PURE__ */ e.jsx("th", { children: o("Events used") }),
          /* @__PURE__ */ e.jsx("th", { children: o("Notes") })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: E.map((D) => {
          const S = B.get(D.id) ?? null, H = h[D.id] ?? {}, V = H.role === "ignored" ? "ignored" : (S == null ? void 0 : S.role) ?? "ignored", Q = L.otherChannels.includes(D.id), ie = $c(S, I, Q, o), ee = V === "single-stain" || V === "fmo", xe = (R == null ? void 0 : R.file.id) === D.id;
          return /* @__PURE__ */ e.jsxs(
            "tr",
            {
              "data-file-id": D.id,
              className: (xe ? "is-selected" : "") + (S != null && S.planned ? " is-control" : "") + (V === "ignored" || Q ? " is-unused" : ""),
              onClick: () => (S == null ? void 0 : S.planned) && j(D.id),
              children: [
                /* @__PURE__ */ e.jsx("td", { className: "gl-comp-controls-file", title: D.fileName, children: D.fileName }),
                /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx(
                  "select",
                  {
                    "aria-label": o("What {file} is", { file: D.fileName }),
                    value: V,
                    disabled: Q,
                    onChange: (X) => U(D.id, { role: X.currentTarget.value }),
                    children: Object.keys(Ro).filter((X) => X !== "unknown" || V === "unknown").map((X) => /* @__PURE__ */ e.jsx("option", { value: X, children: o(Ro[X]) }, X))
                  }
                ) }),
                /* @__PURE__ */ e.jsx("td", { children: ee && S ? /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": o("Channel of {file}", { file: D.fileName }),
                    value: S.channel ?? "",
                    onChange: (X) => U(D.id, { channel: X.currentTarget.value || null, ...Qs }),
                    children: [
                      /* @__PURE__ */ e.jsx("option", { value: "", children: "—" }),
                      I.channels.map((X) => /* @__PURE__ */ e.jsx("option", { value: X.pnn, children: X.pnn }, X.pnn))
                    ]
                  }
                ) : "" }),
                /* @__PURE__ */ e.jsx("td", { children: S && V !== "ignored" ? Rc(S, o) : "" }),
                /* @__PURE__ */ e.jsx("td", { children: S != null && S.planned ? /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": o("Particles of {file}", { file: D.fileName }),
                    value: H.kind ?? "auto",
                    onChange: (X) => U(D.id, { kind: X.currentTarget.value }),
                    children: [
                      /* @__PURE__ */ e.jsx("option", { value: "auto", children: S.planned.kindFrom === "chosen" ? o("Automatic") : S.planned.kind === "beads" ? o("Automatic: beads") : o("Automatic: cells") }),
                      /* @__PURE__ */ e.jsx("option", { value: "beads", children: o("Beads") }),
                      /* @__PURE__ */ e.jsx("option", { value: "cells", children: o("Stained cells") })
                    ]
                  }
                ) : "" }),
                /* @__PURE__ */ e.jsx("td", { children: S != null && S.planned ? /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": o("Negative events of {file}", { file: D.fileName }),
                    value: H.negative ?? "auto",
                    onChange: (X) => U(D.id, { negative: X.currentTarget.value }),
                    children: [
                      /* @__PURE__ */ e.jsx("option", { value: "auto", children: H.negative !== void 0 && H.negative !== "auto" ? o("Automatic") : S.spec === null ? o("Automatic: none found") : S.spec.negative.fileId === D.id ? o("Automatic: its own") : o("Automatic: unstained") }),
                      /* @__PURE__ */ e.jsx("option", { value: "internal", children: o("Its own negative peak") }),
                      /* @__PURE__ */ e.jsx("option", { value: "unstained", children: o("The unstained control") })
                    ]
                  }
                ) : "" }),
                /* @__PURE__ */ e.jsx("td", { className: "gl-comp-controls-events", children: S != null && S.row ? o("{positive} pos · {negative} neg", {
                  positive: S.row.positiveCount.toLocaleString("en-US"),
                  negative: S.row.negativeCount.toLocaleString("en-US")
                }) : S && V !== "ignored" ? D.eventCount.toLocaleString("en-US") : "" }),
                /* @__PURE__ */ e.jsx("td", { className: "gl-comp-controls-notes", children: ie.map((X) => /* @__PURE__ */ e.jsx("div", { children: X }, X)) })
              ]
            },
            D.id
          );
        }) })
      ] }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-side", children: [
        R != null && R.planned && R.channel !== null ? /* @__PURE__ */ e.jsx(
          Oc,
          {
            entry: R,
            files: L.files,
            onBoundaries: (D) => U(R.file.id, D),
            onReset: () => U(R.file.id, Qs)
          }
        ) : /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: o("Select a single-stained control to see its events and the boundaries of its negative and positive events.") }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-report", children: [
          /* @__PURE__ */ e.jsx("h4", { children: o("Findings") }),
          b.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: I.estimate ? o("Nothing to report.") : o("At least two channels need a control.") }) : /* @__PURE__ */ e.jsx("ul", { children: b.map((D) => /* @__PURE__ */ e.jsx("li", { children: D }, D)) })
        ] })
      ] })
    ] }),
    I.estimate && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-matrix", children: [
      /* @__PURE__ */ e.jsx("h4", { children: o("Calculated matrix · {count} channels", { count: I.matrixChannels.length }) }),
      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-controls-matrix-scroll", children: /* @__PURE__ */ e.jsxs("table", { "aria-label": o("Calculated spillover matrix"), children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { title: o("Rows are the fluorochrome, columns the channel it spills into."), children: o("From \\ into") }),
          I.matrixChannels.map((D) => /* @__PURE__ */ e.jsx("th", { children: D.replace(/-A$/i, "") }, D))
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: I.estimate.matrix.map((D, S) => /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { children: I.matrixChannels[S].replace(/-A$/i, "") }),
          D.map((H, V) => /* @__PURE__ */ e.jsx(
            "td",
            {
              style: Zo(H, J, S === V),
              title: `${I.matrixChannels[S]} → ${I.matrixChannels[V]}: ${Te(H, !1, 4)}` + (S !== V && I.estimate.rows[S].uncertainty ? ` ± ${Te(I.estimate.rows[S].uncertainty[V], !1, 2)}` : ""),
              children: S === V ? "100%" : H === 0 ? "·" : `${(100 * H).toFixed(2)}%`
            },
            I.matrixChannels[V]
          ))
        ] }, I.matrixChannels[S])) })
      ] }) })
    ] }),
    N && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: N }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions gl-comp-controls-actions", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-controls-name", children: [
        /* @__PURE__ */ e.jsx("span", { children: o("Name") }),
        /* @__PURE__ */ e.jsx("input", { value: g, maxLength: 200, onChange: (D) => v(D.currentTarget.value) })
      ] }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: () => s(), children: o("Close") }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: !I.estimate || T, onClick: () => void le(), children: o("Add to matrices") })
    ] })
  ] }) });
}
function Dc(n, t) {
  return n.type === "embedded" ? t("Embedded · {file}", { file: n.fileName }) : n.type === "external" ? t("From {file}", { file: n.label }) : n.type === "imported" ? t("Imported · {file}", { file: n.fileName }) : n.type === "edited" ? t("Edited from {name}", { name: n.from }) : n.type === "empty" ? t("Empty") : n.type === "calculated" ? t("Calculated · {count} controls", { count: n.controls }) : t("Preset · {name}", { name: n.presetId });
}
function ya({ row: n }) {
  const { t } = _e();
  if (n.number === null) return null;
  const i = `M${n.number}`;
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: "gl-comp-lib-tag" + (n.primary ? " is-primary" : ""),
      title: n.primary ? t("{tag}, the primary matrix: the one in use when the data came in", { tag: i }) : i,
      children: [
        /* @__PURE__ */ e.jsx($r, { size: 12 }),
        i
      ]
    }
  );
}
function ss(n) {
  return n.number === null ? n.name : `M${n.number} ${n.name}`;
}
function Kc({
  rows: n,
  fileCount: t,
  unsavedEmbeddedFiles: i = [],
  busy: s,
  planSwitch: o,
  onUse: l,
  onRename: c,
  onDuplicate: u,
  onDuplicateAndEdit: h,
  onEditStarted: d,
  onDelete: m,
  onDeleteVersion: j,
  onImport: g,
  chooseImport: v,
  controls: N
}) {
  const { t: x } = _e(), M = F.useRef(null), [k, T] = F.useState(null), [P, f] = F.useState(null), [E, _] = F.useState(null), [L, I] = F.useState(null), [B, q] = F.useState(null), [R, b] = F.useState({}), [U, W] = F.useState(null), [G, r] = F.useState(!1), [le, J] = F.useState(null), ce = async (O) => {
    J(null);
    try {
      J({ text: await g(O), error: !1 });
    } catch (te) {
      J({ text: te instanceof Error ? te.message : String(te), error: !0 });
    }
  }, D = (O) => {
    var ge;
    const te = (ge = O.currentTarget.files) == null ? void 0 : ge[0];
    O.currentTarget.value = "", te && ce(te);
  }, S = () => void ni(M.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "Spillover matrix").then((O) => {
    O != null && O[0] && ce(O[0]);
  }), H = () => {
    if (!k) return;
    const O = n.find(({ id: te }) => te === k.id);
    T(null), O && k.draft.trim() !== O.name && c(O, k.draft);
  }, V = async (O) => {
    J(null);
    try {
      await u(O);
    } catch (te) {
      J({ text: te instanceof Error ? te.message : String(te), error: !0 });
    }
  }, Q = (O) => ({
    ...O,
    name: x("{name}, version {version}", { name: O.name, version: O.version })
  }), ie = (O) => [
    {
      label: x("Use this version…"),
      className: "gl-comp-version-use",
      disabled: s || !l || O.active && O.filesUsing === t,
      title: l ? O.active && O.filesUsing === t ? x("Every file is already compensated with this version.") : x("Compensate every file with this version. The other versions stay as they are.") : x("The matrix of a hosted SCE is chosen in R."),
      onClick: () => f(Q(O))
    },
    {
      label: x("Duplicate and edit…"),
      className: "gl-comp-version-edit",
      disabled: s || !h,
      title: x(h ? "Copy this version as a new matrix, use the copy for every file and edit its coefficients beside the plots. This version stays as it is." : "The matrix of a hosted SCE is chosen in R."),
      onClick: () => _({ row: Q(O), copy: Gi(Q(O).name, new Set(n.map(({ name: te }) => te))) })
    },
    { label: x("Duplicate"), className: "gl-comp-version-duplicate", disabled: s, onClick: () => void V(Q(O)) },
    { label: x("Export CSV…"), className: "gl-comp-version-export", onClick: () => W(Q(O)) },
    ...j && O.canDelete ? [{ label: x("Delete…"), className: "gl-comp-version-delete", danger: !0, disabled: s, onClick: () => q(O) }] : []
  ], ee = (O) => {
    var cn;
    const te = new Date(((cn = O.profile) == null ? void 0 : cn.createdAt) ?? ""), ge = Number.isNaN(te.getTime()) ? "" : ` · ${te.toLocaleString()}`, Fe = O.parentVersion === null ? x("Baseline") : O.revisionReason === "reset-to-baseline" ? x("Reset to the baseline from version {version}", { version: O.parentVersion }) : x("Edited from version {version}", { version: O.parentVersion }), be = O.filesUsing > 0 && !(O.active && O.filesUsing === t) ? ` · ${x("{used} of {files} files", { used: O.filesUsing, files: t })}` : "";
    return `${Fe}${ge}${be}`;
  }, xe = (O) => [
    {
      label: x("Use for the workspace…"),
      className: "gl-comp-lib-use",
      disabled: s || !l || O.unusable !== null || O.active && O.filesUsing === t,
      title: l ? O.unusable !== null ? x("GateLab cannot store this matrix, so only its own file uses it: {reason}", { reason: O.unusable }) : O.active && O.filesUsing === t ? x("Every file is already compensated with this matrix.") : void 0 : x("The matrix of a hosted SCE is chosen in R."),
      onClick: () => f(O)
    },
    ...O.canRename ? [{
      label: x("Rename…"),
      className: "gl-comp-lib-rename",
      disabled: s,
      onClick: () => T({ id: O.id, draft: O.name })
    }] : [],
    {
      label: x("Duplicate and edit…"),
      className: "gl-comp-lib-edit",
      disabled: s || !h || O.unusable !== null,
      title: h ? O.unusable !== null ? x("GateLab cannot store this matrix, so only its own file uses it: {reason}", { reason: O.unusable }) : x("Copy this matrix, use the copy for every file and edit its coefficients beside the plots. This matrix stays as it is.") : x("The matrix of a hosted SCE is chosen in R."),
      onClick: () => _({ row: O, copy: Gi(O.name, new Set(n.map(({ name: te }) => te))) })
    },
    { label: x("Duplicate"), className: "gl-comp-lib-duplicate", disabled: s || O.unusable !== null, onClick: () => void V(O) },
    { label: x("Export CSV…"), className: "gl-comp-lib-export", onClick: () => W(O) },
    ...O.canDelete ? [{ label: x("Delete…"), className: "gl-comp-lib-delete", danger: !0, disabled: s, onClick: () => I(O) }] : []
  ], X = n.find(({ active: O }) => O) ?? null;
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrices", "aria-labelledby": "comp-matrices-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrices-head", children: [
      /* @__PURE__ */ e.jsx("h3", { id: "comp-matrices-heading", children: x("Matrices") }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", disabled: s, onClick: v ?? S, children: x("Import CSV/TSV…") }),
      N && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-mini-btn gl-comp-lib-calculate",
          disabled: s,
          title: x("Calculate a spillover matrix from single-stained control files. It is added to this list and compensates no file until you use it."),
          onClick: () => r(!0),
          children: x("Calculate from controls…")
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-mini-btn gl-comp-lib-export-active",
          disabled: !X,
          title: X ? x("Download {name}, the matrix in use, as a CSV table that Import CSV/TSV… reads back.", { name: X.name }) : x("No matrix is in use."),
          onClick: () => X && W(X),
          children: x("Export CSV…")
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: M,
        type: "file",
        accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
        className: "gl-sr-only",
        "aria-label": x("Import a spillover matrix"),
        onChange: D
      }
    ),
    n.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: x("No matrix yet: the files carry none, and none has been imported.") }) : /* @__PURE__ */ e.jsx("ul", { className: "gl-comp-lib-list", "aria-label": x("Matrices"), children: n.map((O) => /* @__PURE__ */ e.jsxs("li", { className: "gl-comp-lib-row" + (O.active ? " is-active" : ""), "data-matrix-id": O.id, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-lib-text", children: [
        (k == null ? void 0 : k.id) === O.id ? /* @__PURE__ */ e.jsx(
          "input",
          {
            className: "gl-comp-lib-name-input",
            "aria-label": x("Name of {name}", { name: O.name }),
            value: k.draft,
            autoFocus: !0,
            maxLength: 200,
            onChange: (te) => T({ id: O.id, draft: te.currentTarget.value }),
            onBlur: H,
            onKeyDown: (te) => {
              te.key === "Enter" ? (te.preventDefault(), H()) : te.key === "Escape" && (te.preventDefault(), te.stopPropagation(), T(null));
            }
          }
        ) : /* @__PURE__ */ e.jsxs("span", { className: "gl-comp-lib-title", children: [
          /* @__PURE__ */ e.jsx(ya, { row: O }),
          /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-name", title: O.name, children: O.name })
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "gl-comp-lib-meta", children: [
          O.primary ? `${x("Primary")} · ` : "",
          Dc(O.source, x),
          " · ",
          x("{count} channels", { count: O.channelCount }),
          O.active && O.filesUsing !== t ? ` · ${x("{used} of {files} files", { used: O.filesUsing, files: t })}` : ""
        ] }),
        O.unusable !== null && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-unusable", title: O.unusable, children: x("Only its own file can use it") })
      ] }),
      O.active && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-active", children: x("Active") }),
      /* @__PURE__ */ e.jsx(
        Wi,
        {
          label: x("{name}: matrix actions", { name: O.name }),
          items: xe(O),
          icon: /* @__PURE__ */ e.jsx(qi, { size: 16 }),
          className: "gl-comp-lib-menu"
        }
      ),
      O.versions.length > 1 && (() => {
        const te = R[O.id] ?? O.active, ge = `comp-versions-${O.id.replace(/[^A-Za-z0-9_-]/g, "_")}`;
        return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-comp-lib-versions-toggle",
              "aria-expanded": te,
              "aria-controls": ge,
              onClick: () => b((Fe) => ({ ...Fe, [O.id]: !te })),
              children: x("{count} versions", { count: O.versions.length })
            }
          ),
          te && /* @__PURE__ */ e.jsx("ol", { id: ge, className: "gl-comp-lib-versions", "aria-label": x("Versions of {name}", { name: O.name }), children: [...O.versions].reverse().map((Fe) => {
            var be;
            return /* @__PURE__ */ e.jsxs(
              "li",
              {
                className: "gl-comp-lib-version" + (Fe.active ? " is-active" : ""),
                "data-profile-id": (be = Fe.profile) == null ? void 0 : be.profileId,
                children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-lib-text", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-version-name", children: x("Version {version}", { version: Fe.version }) }),
                    /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-meta", children: ee(Fe) })
                  ] }),
                  Fe.active && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-active", children: x("Active") }),
                  /* @__PURE__ */ e.jsx(
                    Wi,
                    {
                      label: x("{name}: version actions", { name: Q(Fe).name }),
                      items: ie(Fe),
                      icon: /* @__PURE__ */ e.jsx(qi, { size: 16 }),
                      className: "gl-comp-lib-menu"
                    }
                  )
                ]
              },
              Fe.id
            );
          }) })
        ] });
      })()
    ] }, O.id)) }),
    i.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-hint gl-comp-lib-unsaved", children: x("The workspace cannot be saved while files use their own embedded matrix beside stored matrices: {files}. Use a matrix for the workspace, set those files to Original, or delete the stored matrices no file uses.", {
      files: i.join(", ")
    }) }),
    le && /* @__PURE__ */ e.jsx("div", { className: le.error ? "gl-comp-error" : "gl-comp-status", role: le.error ? "alert" : "status", children: le.text }),
    E && h && /* @__PURE__ */ e.jsx(
      Lo,
      {
        row: E.row,
        copy: E.copy,
        plan: o(E.row),
        revertible: i.length === 0,
        busy: s,
        onUse: async (O) => {
          await h(O, E.copy), J(null), d == null || d(E.copy);
        },
        onClose: () => _(null)
      }
    ),
    P && l && /* @__PURE__ */ e.jsx(
      Lo,
      {
        row: P,
        plan: o(P),
        revertible: i.length === 0,
        busy: s,
        onUse: async (O) => {
          await l(O), J(null);
        },
        onClose: () => f(null)
      }
    ),
    L && /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (O) => {
      O.key === "Escape" && I(null);
    }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-lib-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-matrix-delete-title", children: [
      /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-matrix-delete-title", children: x("Delete {name}?", { name: ss(L) }) }),
      /* @__PURE__ */ e.jsx("p", { children: x("It leaves the workspace's list of matrices. No file is compensated with it.") }),
      /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
        /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", autoFocus: !0, onClick: () => I(null), children: x("Cancel") }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-btn gl-btn-danger",
            onClick: () => {
              m(L), I(null);
            },
            children: x("Delete")
          }
        )
      ] })
    ] }) }),
    B && j && /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (O) => {
      O.key === "Escape" && q(null);
    }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-lib-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-version-delete-title", children: [
      /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-version-delete-title", children: x("Delete {name}?", { name: ss(Q(B)) }) }),
      /* @__PURE__ */ e.jsx("p", { children: x("It leaves the list of versions. No file is compensated with it, and no other version was edited from it.") }),
      /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
        /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", autoFocus: !0, onClick: () => q(null), children: x("Cancel") }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-btn gl-btn-danger",
            onClick: () => {
              j(B), q(null);
            },
            children: x("Delete")
          }
        )
      ] })
    ] }) }),
    G && N && /* @__PURE__ */ e.jsx(
      _c,
      {
        workspaceFiles: N.files,
        takenNames: new Set(n.map(({ name: O }) => O)),
        onAdd: N.onAdd,
        onClose: (O) => {
          r(!1), O !== void 0 && J({ text: O, error: !1 });
        }
      }
    ),
    U && /* @__PURE__ */ e.jsx(
      da,
      {
        profileLabel: U.name,
        installedLabel: U.name,
        installedMatrix: U.exportMatrix,
        onClose: () => W(null)
      }
    )
  ] });
}
function Lo({
  row: n,
  copy: t,
  plan: i,
  revertible: s,
  busy: o,
  onUse: l,
  onClose: c
}) {
  const { t: u } = _e(), [h, d] = F.useState(!1), [m, j] = F.useState(!1), [g, v] = F.useState(null), N = i.uncovered.length > 0, x = async () => {
    j(!0), v(null);
    try {
      await l(n), c();
    } catch (M) {
      v(M instanceof Error ? M.message : String(M));
    } finally {
      j(!1);
    }
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (M) => {
    M.key === "Escape" && !m && c();
  }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-lib-dialog gl-comp-lib-switch", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-matrix-switch-title", children: [
    /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-matrix-switch-title", children: t === void 0 ? u("Use {name} for the workspace", { name: ss(n) }) : u("Duplicate and edit {name}", { name: ss(n) }) }),
    t === void 0 ? /* @__PURE__ */ e.jsx("p", { children: u("Every file in the workspace ({count}) is compensated with {name}.", { count: i.fileCount, name: n.name }) }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-copy", children: u("GateLab stores a copy, {copy}, and compensates every file in the workspace ({count}) with it, so the plots show each coefficient you change. {name} stays in the list as it is; use it again to go back.", {
        copy: t,
        count: i.fileCount,
        name: n.name
      }) }),
      /* @__PURE__ */ e.jsx("p", { children: u("Edited coefficients change no file until you choose Apply revised matrix, which asks again.") })
    ] }),
    /* @__PURE__ */ e.jsx("p", { children: i.gateCount > 0 ? u("Membership is recomputed for {gates} gates and {populations} populations drawn on channels this matrix compensates.", {
      gates: i.gateCount,
      populations: i.populationCount
    }) : u("No gate is drawn on a channel this matrix compensates.") }),
    i.leavingEmbedded.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-leaving", children: u("Leaving their own embedded matrix: {files}.", { files: i.leavingEmbedded.join(", ") }) }),
    !s && !N && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-irreversible", children: u("The workspace as it stands cannot be saved, so Revert workspace cannot return to it afterwards; it returns to the last state that was saved or checkpointed.") }),
    N && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-error gl-comp-lib-uncovered", role: "alert", children: [
      /* @__PURE__ */ e.jsx("p", { children: u("These files cannot be compensated with this matrix, so it cannot be used for the workspace:") }),
      /* @__PURE__ */ e.jsx("ul", { children: i.uncovered.map((M) => /* @__PURE__ */ e.jsx("li", { children: M.wrongInstrument ? u("{file}: not a file of this instrument kind", { file: M.name }) : M.missingChannels.length > 0 ? u("{file}: lacks {channels}", { file: M.name, channels: M.missingChannels.join(", ") }) : u("{file}: {reason}", { file: M.name, reason: M.message ?? "" }) }, M.name)) }),
      /* @__PURE__ */ e.jsx("p", { children: u("Remove these files from the workspace, or choose a matrix that covers their channels.") })
    ] }),
    !N && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "checkbox",
          checked: h,
          disabled: m,
          onChange: (M) => d(M.currentTarget.checked)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { children: u("I agree that gate membership may change.") })
    ] }),
    g && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: g }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: m, onClick: c, children: u("Cancel") }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-btn",
          disabled: N || !h || m || o,
          onClick: () => void x(),
          children: u(m ? "Compensating…" : t === void 0 ? "Use for the workspace" : "Make the copy and edit")
        }
      )
    ] })
  ] }) });
}
function nt({
  value: n,
  onValueChange: t,
  scrubStep: i,
  className: s = "",
  disabled: o,
  min: l,
  max: c,
  step: u,
  title: h,
  onPointerDown: d,
  onPointerMove: m,
  onPointerUp: j,
  onPointerCancel: g,
  onLostPointerCapture: v,
  ...N
}) {
  const { t: x } = _e(), M = F.useRef(null), [k, T] = F.useState(!1), P = (f) => {
    var E, _, L;
    ((E = M.current) == null ? void 0 : E.pointerId) === f.pointerId && (M.current = null, T(!1), (L = (_ = f.currentTarget).hasPointerCapture) != null && L.call(_, f.pointerId) && f.currentTarget.releasePointerCapture(f.pointerId));
  };
  return /* @__PURE__ */ e.jsx(
    "input",
    {
      ...N,
      type: "number",
      className: `gl-scrubbable-number${k ? " is-scrubbing" : ""}${s ? ` ${s}` : ""}`,
      value: n,
      disabled: o,
      min: l,
      max: c,
      step: u,
      title: h ?? x("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (f) => t(f.currentTarget.value),
      onPointerDown: (f) => {
        var q, R;
        if (d == null || d(f), f.defaultPrevented || o || f.button !== 0) return;
        const E = f.currentTarget.getBoundingClientRect();
        if (f.clientX >= E.right - 18) return;
        const _ = Number(n), L = (i ?? Number(u)) || 0.1;
        if (!Number.isFinite(_) || !(L > 0)) return;
        const I = String(L), B = I.includes("e-") ? Number(I.split("e-")[1]) : I.includes(".") ? I.split(".")[1].length : 0;
        M.current = {
          pointerId: f.pointerId,
          startY: f.clientY,
          startValue: _,
          step: L,
          decimals: B,
          lastSteps: 0
        }, (R = (q = f.currentTarget).setPointerCapture) == null || R.call(q, f.pointerId);
      },
      onPointerMove: (f) => {
        m == null || m(f);
        const E = M.current;
        if (!E || E.pointerId !== f.pointerId) return;
        const _ = E.startY - f.clientY;
        if (Math.abs(_) < 3) return;
        const L = _ > 0 ? Math.floor(_ / 4) : Math.ceil(_ / 4);
        if (L === E.lastSteps) return;
        let I = E.startValue + L * E.step;
        const B = l === void 0 ? Number.NEGATIVE_INFINITY : Number(l), q = c === void 0 ? Number.POSITIVE_INFINITY : Number(c);
        Number.isFinite(B) && (I = Math.max(B, I)), Number.isFinite(q) && (I = Math.min(q, I)), M.current = { ...E, lastSteps: L }, T(!0), t(I.toFixed(Math.min(10, E.decimals))), f.preventDefault();
      },
      onPointerUp: (f) => {
        j == null || j(f), P(f);
      },
      onPointerCancel: (f) => {
        g == null || g(f), P(f);
      },
      onLostPointerCapture: (f) => {
        var E;
        v == null || v(f), ((E = M.current) == null ? void 0 : E.pointerId) === f.pointerId && (M.current = null, T(!1));
      }
    }
  );
}
const ii = F.createContext(ei), oi = F.createContext(0.85), ai = F.createContext(1), Po = "", Yt = [];
let Ks = !1;
function zc(n) {
  const t = { cancelled: !1, run: n };
  Yt.push(t);
  const i = () => {
    if (Ks) return;
    Ks = !0;
    const s = () => {
      Ks = !1;
      let l = Yt.shift();
      for (; l != null && l.cancelled; ) l = Yt.shift();
      l == null || l.run(), Yt.length > 0 && i();
    }, o = window;
    typeof o.requestIdleCallback == "function" ? o.requestIdleCallback(s, { timeout: 50 }) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(s) : setTimeout(s, 0);
  };
  return i(), () => {
    t.cancelled = !0;
  };
}
function is({
  title: n,
  panel: t,
  preview: i,
  sourceLabel: s,
  receiverLabel: o,
  minimumSize: l = 210,
  maximumSize: c = 420,
  densityColorCeiling: u,
  densitySmoothing: h,
  showZeroPile: d = !0
}) {
  const { t: m } = _e(), j = F.useContext(ii), g = F.useContext(oi), v = F.useContext(ai), N = F.useRef(null);
  F.useEffect(() => {
    const k = N.current;
    if (!k) return;
    let T = null, P = 0;
    const f = () => {
      var q;
      T = null;
      const L = ((q = k.parentElement) == null ? void 0 : q.clientWidth) ?? 230, I = Math.max(l, Math.min(c, Math.floor(L)));
      if (I === P && k.childElementCount > 0) return;
      P = I;
      const B = ti(h, I);
      ts(k, {
        title: n,
        panel: t,
        preview: i,
        sourceLabel: s,
        receiverLabel: o,
        size: I,
        densityColorCeiling: u ?? si(
          i,
          0.95,
          B,
          j
        ),
        densitySmoothingRadius: B,
        densityColorPower: j,
        pointAlpha: g,
        pointSize: v
      });
    }, E = () => {
      T !== null && cancelAnimationFrame(T), T = requestAnimationFrame(f);
    };
    E();
    const _ = typeof ResizeObserver > "u" ? null : new ResizeObserver(E);
    return _ == null || _.observe(k.parentElement ?? k), () => {
      _ == null || _.disconnect(), T !== null && cancelAnimationFrame(T);
    };
  }, [u, j, h, c, l, t, g, v, i, o, s, n]);
  const x = (k) => i.eventCount > 0 ? `${(k / i.eventCount * 100).toFixed(1)}%` : "0.0%", M = t.zeroPile.source > 0 || t.zeroPile.receiver > 0 || t.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": m("{title} density biplot; {source} on x, {receiver} on y", {
    title: n,
    source: s,
    receiver: o
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: N, className: "gl-comp-biplot-surface" }),
    d && M && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: m("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: x(t.zeroPile.source),
      receiver: x(t.zeroPile.receiver),
      both: x(t.zeroPile.corner)
    }) })
  ] });
}
function Uc({
  title: n,
  preview: t,
  sourceLabel: i,
  receiverLabel: s,
  minimumSize: o,
  maximumSize: l,
  densityColorCeiling: c,
  densitySmoothing: u
}) {
  const { t: h } = _e(), d = F.useContext(ii), m = F.useContext(oi), j = F.useContext(ai), g = F.useRef(null);
  return F.useEffect(() => {
    const v = g.current;
    if (!v) return;
    let N = null, x = 0;
    const M = () => {
      var R;
      N = null;
      const P = ((R = v.parentElement) == null ? void 0 : R.clientWidth) ?? o, f = Math.max(o, Math.min(l, Math.floor(P)));
      if (f === x && v.dataset.cacheReady === "true") return;
      x = f, v.dataset.cacheReady = "false";
      const E = ti(u, f), _ = c ?? si(
        t,
        0.95,
        E,
        d
      );
      ts(v, {
        title: n,
        panel: t.original,
        preview: t,
        sourceLabel: i,
        receiverLabel: s,
        size: f,
        densityColorCeiling: _,
        densitySmoothingRadius: E,
        densityColorPower: d,
        pointAlpha: m,
        pointSize: j,
        canvasScale: 2
      });
      const L = v.querySelector("canvas"), I = v.querySelector("svg"), B = document.createElement("div");
      ts(B, {
        title: n,
        panel: t.compensated,
        preview: t,
        sourceLabel: i,
        receiverLabel: s,
        size: f,
        densityColorCeiling: _,
        densitySmoothingRadius: E,
        densityColorPower: d,
        pointAlpha: m,
        pointSize: j,
        canvasScale: 2
      });
      const q = B.querySelector("canvas");
      !L || !q || !I || (L.classList.add("gl-comp-cached-canvas", "is-original"), L.dataset.assayLayer = "original", q.classList.add("gl-comp-cached-canvas", "is-compensated"), q.dataset.assayLayer = "compensated", v.insertBefore(q, I), v.dataset.cacheReady = "true");
    }, k = () => {
      N == null || N(), N = zc(M);
    };
    k();
    const T = typeof ResizeObserver > "u" ? null : new ResizeObserver(k);
    return T == null || T.observe(v.parentElement ?? v), () => {
      T == null || T.disconnect(), N == null || N();
    };
  }, [c, d, u, l, o, m, j, t, s, i, n]), /* @__PURE__ */ e.jsx(
    "figure",
    {
      className: "gl-comp-biplot",
      "aria-label": h("Cached uncompensated and compensated density biplot; {source} on x, {receiver} on y", {
        source: i,
        receiver: s
      }),
      children: /* @__PURE__ */ e.jsx(
        "div",
        {
          ref: g,
          className: "gl-comp-biplot-surface gl-comp-cached-biplot",
          "data-cache-mode": "dual-canvas"
        }
      )
    }
  );
}
function Oo({
  preview: n,
  sourceLabel: t,
  receiverLabel: i,
  kind: s,
  densitySmoothing: o,
  compact: l = !1,
  compensatedTitle: c = "Compensated"
}) {
  const { t: u } = _e(), h = n.eventCount > 0 ? n.original.zeroPile.receiver / n.eventCount * 100 : 0, d = n.eventCount > 0 ? n.compensated.zeroPile.receiver / n.eventCount * 100 : 0, m = d - h;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${l ? " is-compact" : ""}`, children: [
    !l && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: u("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: n.eventCount.toLocaleString(),
      sampled: n.totalEvents > n.eventCount ? u(" sampled from {total}", { total: n.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        is,
        {
          title: u("Original"),
          panel: n.original,
          preview: n,
          sourceLabel: t,
          receiverLabel: i,
          densitySmoothing: o,
          showZeroPile: !l
        }
      ),
      /* @__PURE__ */ e.jsx(
        is,
        {
          title: c,
          panel: n.compensated,
          preview: n,
          sourceLabel: t,
          receiverLabel: i,
          densitySmoothing: o,
          showZeroPile: !l
        }
      )
    ] }),
    !l && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-diagnostic-note", children: s === "cytof" ? /* @__PURE__ */ e.jsx(e.Fragment, { children: u("Receiver events at exact zero: {original}% → {compensated}% ({delta} percentage points). A rise can be consistent with NNLS over-subtraction, while a residual source-associated rise can be consistent with under-compensation. Neither is a verdict without a suitable negative/control population.", {
      original: h.toFixed(1),
      compensated: d.toFixed(1),
      delta: `${m >= 0 ? "+" : ""}${m.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: u("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: c
    }) }) }),
    !l && (n.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": u("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: u("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: u("{value} MAD", { value: ve(n.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: u("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: ve(n.evidence.residualSlope ?? 0, 4) })
      ] }),
      n.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: u("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: u("{value} MAD", { value: ve(n.evidence.upperTailExcessMad, 3) }) })
      ] }),
      n.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: u("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: u("{value} MAD", { value: ve(n.evidence.upperTailSlopeDeltaMad, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: u("Evidence groups") }),
        /* @__PURE__ */ e.jsx("dd", { children: u("{high} source-high · {low} source-low", {
          high: n.evidence.sourceHighEvents.toLocaleString(),
          low: n.evidence.sourceLowEvents.toLocaleString()
        }) })
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-evidence-insufficient", children: u("Residual screening needs distinct source-low/source-high groups and enough receiver-negative events; this pair remains available for visual review.") }))
  ] });
}
function Bc({
  matrixView: n,
  sourceChannels: t,
  receiverChannels: i,
  selectedSourceIndex: s,
  selectedReceiverIndex: o,
  stagedCoefficients: l,
  maximumAbsoluteOffDiagonal: c,
  onSelect: u
}) {
  const { t: h } = _e(), d = 6, m = 74, j = 44, g = 10, v = i.length * d, N = t.length * d, x = m + v + m, M = j + N + g, k = F.useMemo(() => {
    const P = [];
    for (let f = 0; f < n.matrix.length; f++)
      for (let E = 0; E < n.matrix[f].length; E++) {
        const _ = n.sourceAxisKeys[f], L = n.receiverAxisKeys[E], I = `${_}${Po}${L}`, B = l[I] ?? n.matrix[f][E], q = _ === L;
        if (!q && (!Number.isFinite(B) || B === 0)) continue;
        const R = c > 0 && Number.isFinite(B) ? Math.min(1, Math.abs(B) / c) : 0, b = R > 0 ? 0.12 + 0.82 * Math.sqrt(R) : 0;
        P.push({
          sourceIndex: f,
          receiverIndex: E,
          pairKey: I,
          value: B,
          diagonal: q,
          fill: q ? "#cfd4db" : Number.isFinite(B) ? B < 0 ? `rgba(47,128,237,${b})` : `rgba(211,47,47,${b})` : "#ae3e3e"
        });
      }
    return P;
  }, [n, c, l]), T = (P) => {
    const f = P.currentTarget.getBoundingClientRect();
    if (!(f.width > 0) || !(f.height > 0)) return;
    const E = (P.clientX - f.left) * x / f.width, _ = (P.clientY - f.top) * M / f.height, L = Math.floor((E - m) / d), I = Math.floor((_ - j) / d);
    I < 0 || I >= t.length || L < 0 || L >= i.length || n.sourceAxisKeys[I] === n.receiverAxisKeys[L] || u(`${n.sourceAxisKeys[I]}${Po}${n.receiverAxisKeys[L]}`);
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-mini-matrix", "aria-labelledby": "comp-mini-matrix-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-mini-matrix-head", children: [
      /* @__PURE__ */ e.jsx("strong", { id: "comp-mini-matrix-heading", children: h("Matrix map") }),
      /* @__PURE__ */ e.jsx("span", { children: h("Source ↓ · receiver → · click a cell") })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        width: x,
        height: M,
        viewBox: `0 0 ${x} ${M}`,
        role: "img",
        "aria-label": h("Mini compensation matrix with {sources} source rows and {receivers} receiver columns", {
          sources: t.length,
          receivers: i.length
        }),
        onPointerDown: T,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: m, y: j, width: v, height: N, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          i.map((P, f) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: m + (f + 0.55) * d,
              y: j - 3,
              transform: `rotate(-58 ${m + (f + 0.55) * d} ${j - 3})`,
              textAnchor: "start",
              className: f === o ? "is-selected" : void 0,
              children: P.pnn
            },
            P.key
          )),
          t.map((P, f) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: m - 3,
              y: j + (f + 0.72) * d,
              textAnchor: "end",
              className: f === s ? "is-selected" : void 0,
              children: P.pnn
            },
            P.key
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: m,
              y: j + s * d,
              width: v,
              height: d,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: m + o * d,
              y: j,
              width: d,
              height: N,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          k.map((P) => /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: m + P.receiverIndex * d,
              y: j + P.sourceIndex * d,
              width: d,
              height: d,
              fill: P.fill,
              pointerEvents: "none",
              children: /* @__PURE__ */ e.jsx("title", { children: P.diagonal ? h("{channel} · self", { channel: t[P.sourceIndex].combined }) : `${t[P.sourceIndex].combined} → ${i[P.receiverIndex].combined} · ${Te(P.value)}` })
            },
            P.pairKey
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: m + o * d,
              y: j + s * d,
              width: d,
              height: d,
              fill: "none",
              stroke: "#2f80ed",
              strokeWidth: "1.4",
              vectorEffect: "non-scaling-stroke",
              pointerEvents: "none"
            }
          )
        ]
      }
    )
  ] });
}
function Vc({
  dataset: n,
  pair: t,
  plotSize: i,
  densitySmoothing: s,
  flagged: o,
  selected: l,
  onSelect: c,
  onFlag: u
}) {
  const { t: h } = _e(), d = F.useRef(null), [m, j] = F.useState(() => typeof IntersectionObserver > "u");
  F.useEffect(() => {
    const N = d.current;
    if (!N || typeof IntersectionObserver > "u") {
      j(!0);
      return;
    }
    const x = new IntersectionObserver(
      (M) => j(M.some((k) => k.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return x.observe(N), () => x.disconnect();
  }, []);
  const g = F.useMemo(
    () => m ? ra(n, t.source.key, t.receiver.key) : null,
    [n, t.receiver.key, t.source.key, m]
  ), v = g != null && g.ready ? g.preview : null;
  return /* @__PURE__ */ e.jsxs(
    "article",
    {
      ref: d,
      className: `gl-comp-global-tile${l ? " is-selected" : ""}${o ? " is-flagged" : ""}`,
      "data-pair-key": t.pairKey,
      "data-event-signature": v == null ? void 0 : v.eventSignature,
      "data-x-range": v ? `${v.xRange[0]},${v.xRange[1]}` : void 0,
      "data-y-range": v ? `${v.yRange[0]},${v.yRange[1]}` : void 0,
      style: { width: i, height: i },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-tile-head", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: c,
              title: `${t.source.combined} → ${t.receiver.combined}`,
              "aria-label": h("Open details for {source} to {receiver}", {
                source: t.source.label,
                receiver: t.receiver.label
              }),
              children: [
                /* @__PURE__ */ e.jsxs("span", { children: [
                  t.source.label,
                  " → ",
                  t.receiver.label
                ] }),
                /* @__PURE__ */ e.jsxs("strong", { children: [
                  (t.coefficient * 100).toFixed(1),
                  "%"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx("label", { title: h("Keep this pair in Flagged"), children: /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: o,
              "aria-label": h("Flag global inspector pair {source} to {receiver} for follow-up", {
                source: t.source.label,
                receiver: t.receiver.label
              }),
              onChange: (N) => u(N.currentTarget.checked)
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-comp-global-plot-button",
            onClick: c,
            title: h("{source} → {receiver} · {interaction}matrix {coefficient}%", {
              source: t.source.combined,
              receiver: t.receiver.combined,
              interaction: t.interaction && t.interaction !== "other" ? `${t.interaction} · ` : "",
              coefficient: (t.coefficient * 100).toFixed(1)
            }),
            "aria-label": h("Open details for {source} to {receiver}; matrix coefficient {coefficient}%", {
              source: t.source.label,
              receiver: t.receiver.label,
              coefficient: (t.coefficient * 100).toFixed(1)
            }),
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: i, height: i }, children: v ? /* @__PURE__ */ e.jsx(
              Uc,
              {
                title: "",
                preview: v,
                sourceLabel: t.source.label,
                receiverLabel: t.receiver.label,
                minimumSize: i,
                maximumSize: i,
                densitySmoothing: s
              }
            ) : g && !g.ready ? /* @__PURE__ */ e.jsx("span", { children: g.reason }) : /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" }) })
          }
        )
      ]
    }
  );
}
function Wc({
  stateKey: n,
  header: t,
  children: i
}) {
  const { t: s } = _e(), [o, l] = Le(
    `compensation.${n}.globalInspectorLayer`,
    "compensated"
  );
  return /* @__PURE__ */ e.jsxs(
    "section",
    {
      className: "gl-comp-global-inspector",
      "aria-labelledby": "comp-global-inspector-heading",
      "data-inspector-layer": o,
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-head", children: [
          t,
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "gl-comp-layer-toggle",
              "aria-pressed": o === "compensated",
              "aria-label": s("Showing {shown} data; click to show {other} data", {
                shown: s(o === "original" ? "uncompensated" : "compensated"),
                other: s(o === "original" ? "compensated" : "uncompensated")
              }),
              title: s("Toggle every plot between uncompensated and compensated data without changing its frame"),
              onClick: () => l((c) => c === "original" ? "compensated" : "original"),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "gl-comp-layer-toggle-track", "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", {}) }),
                /* @__PURE__ */ e.jsx("span", { children: s(o === "original" ? "Uncompensated" : "Compensated") })
              ]
            }
          )
        ] }),
        i
      ]
    }
  );
}
const qc = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', zs = 58 * Math.PI / 180, _o = 54, Do = {
  view: { least: 12, budgeted: 38, most: 44, largest: 72, budget: 760 },
  inline: { least: 42, budgeted: 54, most: 64, largest: 96, budget: 960 }
}, Gc = 30, Hc = 16, Xc = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, Yc = [
  { id: "matrices", label: "Matrices" },
  { id: "review", label: "Review" },
  { id: "display", label: "Display" }
];
function Us({ label: n, text: t }) {
  return /* @__PURE__ */ e.jsx("span", { className: "gl-hint-icon gl-comp-pane-hint", role: "img", "aria-label": n, title: t, children: "?" });
}
function Zc(n) {
  if (!n) return ["its channels do not map to the file"];
  if (n.ok) return ["not a valid spillover matrix"];
  const t = new Set(n.errors.map(({ code: s }) => s)), i = [];
  return t.has("negative-coefficient") && i.push("negative coefficients"), t.has("non-unit-diagonal") && i.push("diagonal not 1"), i.length > 0 ? i : ["not a valid spillover matrix"];
}
const Qc = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], De = "", Jc = 6e4, Ko = 2500, zo = 400, ed = 2500, Uo = 15e3, Bo = [2500, 5e3, 15e3, 5e4], nd = 24, Vo = 4, Wo = 624, td = Object.freeze({});
function qo(n) {
  if (!Number.isFinite(n)) return String(n);
  const t = n * 100;
  if (t === 0) return "0.0";
  const i = Math.abs(t), s = i >= 1 ? 1 : i >= 0.1 ? 2 : 3;
  return t.toFixed(s);
}
function Bs(n) {
  return n.replace(/(?: · (?:edited|revised))+$/u, "");
}
function os(n, t) {
  const i = n.index(t), s = i === void 0 ? void 0 : n.channels[i], o = (s == null ? void 0 : s.pnn) ?? t, l = n.labelForKey(t), c = ((s == null ? void 0 : s.label) ?? "").trim() || ((s == null ? void 0 : s.marker) ?? "").trim(), u = c && c !== o ? `${c} (${o})` : o;
  return { key: t, pnn: o, label: l, combined: u };
}
function sd(n, t) {
  const i = n.channels.find((s) => s.pnn === t);
  return ((i == null ? void 0 : i.label) ?? "").trim() || ((i == null ? void 0 : i.marker) ?? "").trim();
}
function Zt(n, t) {
  const i = n.channels.find((s) => s.pnn === t);
  return os(n, (i == null ? void 0 : i.key) ?? t);
}
function id(n, t) {
  return n === "cytof-spillover" && t === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function od(n) {
  return n.replaceAll("-", " ");
}
function Js(n) {
  if (n.length === 0) return 0;
  n.sort((i, s) => i - s);
  const t = Math.floor(n.length / 2);
  return n.length % 2 === 0 ? (n[t - 1] + n[t]) / 2 : n[t];
}
function ad(n) {
  return Object.fromEntries(n.scientific.solverSettings.map(({ key: t, value: i }) => [t, i]));
}
function rd(n, t) {
  const i = Object.freeze({ ...n.scientific.matrix, matrix: t }), s = ad(n);
  return n.scientific.kind === "flow-spillover" ? {
    kind: "flow-spillover",
    method: "matrix-inverse",
    solverVersion: n.scientific.solverVersion,
    solverSettings: {
      singularTolerance: Number(s.singularTolerance),
      conditionWarningThreshold: Number(s.conditionWarningThreshold)
    },
    matrix: i
  } : {
    kind: "cytof-spillover",
    method: "nnls",
    solverVersion: n.scientific.solverVersion,
    solverSettings: {
      tolerance: Number(s.tolerance),
      kktTolerance: Number(s.kktTolerance),
      maxIterations: Number(s.maxIterations),
      adaptationVersion: String(s.adaptationVersion)
    },
    matrix: i,
    includedChannels: n.scientific.includedChannels
  };
}
function Go(n, t, i, s) {
  const o = n.scientific.matrix.sourceChannels.indexOf(t), l = n.scientific.matrix.receiverChannels.indexOf(i);
  if (o < 0 || l < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(n.scientific.matrix.matrix.map(
    (c, u) => Object.freeze(c.map((h, d) => u === o && d === l ? s : h))
  ));
}
function ld(n, t, i) {
  var c;
  if (!n) return null;
  const s = n.scientific.matrix.sourceChannels.indexOf(t), o = n.scientific.matrix.receiverChannels.indexOf(i);
  if (s < 0 || o < 0) return null;
  const l = (c = n.scientific.matrix.matrix[s]) == null ? void 0 : c[o];
  return Number.isFinite(l) ? l : null;
}
function Ho(n, t, i) {
  const s = Math.max(Math.abs(n), Math.abs(t), 1e-3);
  return Object.freeze(i === "cytof" ? { lower: 0, upper: Math.max(n + s, s * 2) } : { lower: n - s, upper: n + s });
}
function cd(n, t) {
  const i = (t - n) / 3;
  return Object.freeze([n, n + i, n + 2 * i, t]);
}
function dd(n, t) {
  return n.length === t.length && n.every((i, s) => {
    var o;
    return i.length === ((o = t[s]) == null ? void 0 : o.length) && i.every((l, c) => l === t[s][c]);
  });
}
function ud(n, t) {
  if (n.compensatedLayerStatus().state !== "ready" || t.length === 0 || n.fcs.nEvents === 0) return null;
  const s = t.flatMap((j) => {
    const g = n.channels.findIndex((v) => v.pnn === j);
    return g < 0 ? [] : [g];
  });
  if (s.length === 0) return null;
  const o = Math.min(2048, n.fcs.nEvents), l = [];
  let c = 0, u = 0, h = 0, d = "", m = -1;
  for (const j of s) {
    const g = n.originalColumnData(j), v = n.compensatedColumnData(j), N = [];
    for (let M = 0; M < o; M++) {
      const k = o === 1 ? 0 : Math.floor(M * (n.fcs.nEvents - 1) / (o - 1)), T = g[k], P = v[k], f = Math.abs(P - T);
      N.push(f), l.push(f), f > Math.max(1e-6, Math.abs(T) * 1e-6) && c++, T < 0 && P === 0 && h++, u = Math.max(u, f);
    }
    const x = Js(N);
    x > m && (m = x, d = os(n, n.channels[j].key).combined);
  }
  return {
    previewEvents: o,
    comparedValues: l.length,
    changedValues: c,
    medianAbsoluteDelta: Js(l),
    maxAbsoluteDelta: u,
    zeroedNegativeValues: h,
    mostChangedChannel: d,
    mostChangedChannelMedianDelta: Math.max(0, m)
  };
}
function hd(n, t) {
  return n.origin.type === "uploaded" ? n.origin.fileName : n.origin.type === "embedded-fcs" ? `${n.origin.fileName} · ${t("embedded FCS")}` : n.origin.type === "manual" ? t("set by hand, from an empty matrix") : n.origin.type === "calculated" ? t("calculated from single-stained controls") : `${n.origin.presetId} · ${t("bundled preset")} ${n.origin.presetVersion}`;
}
function md(n) {
  if (!n || n.kind !== "cytof-spillover")
    return { draft: null, error: null };
  const t = {
    input: {
      sourceChannels: n.sourceChannels,
      receiverChannels: n.receiverChannels,
      matrix: n.matrix
    },
    format: {
      delimiter: "csv",
      sourceColumnHeader: "source"
    }
  }, i = Vs(
    t.input,
    "cytof-spillover"
  );
  return i.ok ? {
    draft: {
      fileName: n.name,
      source: "host",
      parsed: t,
      matrix: i.value,
      validationWarnings: i.warnings
    },
    error: null
  } : {
    draft: null,
    error: `The SCE spillover matrix is invalid. ${i.errors.map(({ message: s }) => s).join(" ")}`
  };
}
function pd({
  sample: n,
  sampleName: t = "sample.fcs",
  hostedCompensationMatrix: i = null,
  compensationOn: s,
  onApplyProfile: o,
  otherEmbeddedLayerFiles: l = [],
  onRemoveProfile: c,
  existingHostAssays: u = [],
  onAdoptExistingAssay: h,
  onCancelApply: d,
  hasExistingGates: m = !1,
  applyStatus: j = null,
  installedProfile: g = null,
  applyTargetCount: v = 1,
  applyTargetEventCount: N,
  applyWorkerCount: x,
  applyWorkerLimit: M,
  onApplyWorkerCountChange: k,
  installedBaselineProfile: T = null,
  reviewPopulations: P = [],
  reviewPopulationMasks: f = td,
  onPreviewCompensationCandidate: E,
  onSolveCompensationSweep: _,
  onCancelCompensationSweep: L,
  onSuspendBackgroundWork: I,
  visible: B = !0,
  stateKey: q,
  densityColorPower: R = ei,
  channelLabelMode: b = "marker",
  onDensityColorPowerChange: U = () => {
  },
  matrices: W,
  onApplyRevision: G
}) {
  var Ui, Bi;
  const { t: r } = _e(), le = Rr("compensation"), J = n.compensatedLayerStatus(), ce = J.state === "missing" ? null : J.metadata, D = (ce == null ? void 0 : ce.runtimeIdentity) === "profile" ? ce : null, S = (g == null ? void 0 : g.profileId) === (D == null ? void 0 : D.profileId) ? g : null, H = !D && n.instrument === "flow" ? n.spillover : null, V = (i == null ? void 0 : i.kind) === "flow-spillover" ? i : null, Q = F.useMemo(
    () => md(i),
    [i]
  ), [ie, ee] = Le(
    `compensation.${q}.selectedPair`,
    null
  ), [xe, X] = F.useState(null), [O, te] = Le(
    `compensation.${q}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [ge, Fe] = Le(
    "compensation.inspectorWidth",
    Wo
  ), [be, cn] = Le(
    `compensation.${q}.workspaceView`,
    "matrix"
  ), [tn, Ct] = Le(
    `compensation.${q}.globalPairFilter`,
    "relevant"
  ), [wa, ja] = Le(
    `compensation.${q}.globalLayout`,
    null
  ), [Na, Ca] = Le(
    "compensation.globalPlotSize.v5",
    160
  ), [Sa, Ma] = Le(
    "compensation.densitySmoothing.v3",
    6
  ), [ka, Ea] = Le(
    "compensation.pointAlpha.v1",
    0.85
  ), [Ta, Aa] = Le(
    "compensation.pointSize.v1",
    1
  ), [ri, Fa] = Le(
    "compensation.paneSection.v1",
    "matrices"
  ), [cs, Ia] = Le(
    "compensation.pairPreviewEventLimit.v1",
    Uo
  ), [st, li] = F.useState(""), [it, ds] = F.useState(!1), [us, ci] = F.useState(null), [Un, hs] = Le(
    `compensation.${q}.reviewPopulation`,
    "all"
  ), [St, $a] = Le(
    `compensation.${q}.flaggedPairs`,
    []
  ), [dn, Ra] = Le(
    `compensation.${q}.evidenceMode`,
    "biological"
  ), [La, Pa] = Le(
    `compensation.${q}.sweepBounds`,
    {}
  ), [ms, ps] = Le(
    `compensation.${q}.sweepWorkers`,
    2
  ), [Ye, di] = F.useState(""), [Ve, fs] = F.useState(""), [Oa, gs] = F.useState(0), [_a, Da] = F.useState(0), [ue, Mt] = F.useState({}), [Ka, Tn] = F.useState({}), [un, An] = F.useState({ state: "idle" }), [za, yn] = F.useState({}), [Ua, Fn] = F.useState({}), [Ue, Bn] = F.useState(null), [Ba, ot] = F.useState(null), [Ie, Vn] = F.useState(null), [ui, Ke] = F.useState(null), [kt, vs] = F.useState(""), [Va, hi] = F.useState(!1), [Wa, mi] = F.useState(!1), Ze = F.useRef(0), Wn = F.useRef(0), [pi, he] = F.useState(null), [xs, bs] = F.useState(!1), [fi, $e] = F.useState(!1), [me, Et] = F.useState(
    () => Q.draft
  ), [at, wn] = F.useState(
    () => {
      var w;
      const a = ((w = Q.draft) == null ? void 0 : w.matrix.receiverChannels) ?? [], p = /* @__PURE__ */ new Map();
      for (const C of n.channels) {
        const A = C.pnn.trim().normalize("NFC");
        p.set(A, (p.get(A) ?? 0) + 1);
      }
      return new Set(a.filter((C) => p.get(C) === 1));
    }
  ), [gi, jn] = F.useState(
    () => Q.error
  ), [We, hn] = F.useState(!1), [Tt, vi] = F.useState(!1), [At, xi] = F.useState(
    () => {
      var a;
      return ((a = u[0]) == null ? void 0 : a.id) ?? "";
    }
  ), [ys, Ft] = F.useState(!1), [It, ze] = F.useState(null), [qa, sn] = F.useState(!1), [Ga, mn] = F.useState(null), Qe = F.useRef(!1), bi = F.useRef(null), yi = F.useRef(null), In = F.useRef(null), [$t, Ha] = F.useState(null), [ws, wi] = F.useState(null), [js, ji] = F.useState("fit");
  F.useEffect(() => {
    if (!$t || typeof ResizeObserver > "u") {
      wi(null);
      return;
    }
    const a = () => {
      const { width: w, height: C } = $t.getBoundingClientRect();
      wi((A) => {
        if (w <= 0 || C <= 0) return null;
        const $ = { width: Math.round(w), height: Math.round(C) };
        return A && A.width === $.width && A.height === $.height ? A : $;
      });
    };
    a();
    const p = new ResizeObserver(a);
    return p.observe($t), () => p.disconnect();
  }, [$t]);
  const ne = qa || j !== null, Nn = Math.max(0, Math.floor(v)), Xa = Math.max(
    0,
    Math.floor(N ?? n.fcs.nEvents)
  ), Cn = u.find(
    ({ id: a }) => a === At
  ) ?? u[0] ?? null;
  F.useEffect(() => {
    var a;
    At && u.some(({ id: p }) => p === At) || (xi(((a = u[0]) == null ? void 0 : a.id) ?? ""), Ft(!1));
  }, [u, At]);
  const je = j ?? (It ? {
    phase: "applying",
    profileName: Ga ?? (me == null ? void 0 : me.fileName) ?? "Compensation",
    fraction: It.fraction,
    processedEvents: It.processedEvents,
    totalEvents: It.totalEvents
  } : null);
  F.useEffect(() => {
    B || (Wn.current++, Ze.current++, An({ state: "idle" }), Vn(null), Bn(null), I == null || I());
  }, [I, B]);
  const Ns = F.useMemo(
    () => n.channels.map(({ pnn: a, columnIndex: p }) => ({ pnn: a, columnIndex: p })),
    [n]
  ), Re = F.useMemo(() => {
    if (!H) return null;
    const a = H.channels.map((A) => {
      const $ = n.index(A);
      return $ === void 0 ? null : n.channels[$].pnn;
    });
    if (a.some((A) => A === null))
      return {
        validation: null,
        error: "The embedded matrix could not be mapped back to exact FCS channel identities.",
        keyword: void 0,
        roundedCoefficients: 0
      };
    const { validation: p, roundedCoefficients: w } = Lr({
      sourceChannels: a,
      receiverChannels: a,
      matrix: H.matrix
    }), C = ["$SPILLOVER", "$SPILL", "SPILL"].find((A) => typeof n.fcs.keywords[A] == "string");
    return {
      validation: p,
      error: p.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${p.errors.map(({ message: A }) => A).join(" ")}`,
      keyword: C,
      roundedCoefficients: w
    };
  }, [n, H]), de = Un === "all" ? null : P.find(({ id: a }) => a === Un) ?? null, Ne = de ? f[de.id] ?? null : null, Ce = Ne ? (de == null ? void 0 : de.eventCount) ?? 0 : n.fcs.nEvents, Rt = cs === "all" ? "all" : Bo.includes(Number(cs)) ? Number(cs) : Uo, rt = F.useMemo(
    () => En(
      n.fcs.nEvents,
      Rt === "all" ? Math.max(1, n.fcs.nEvents) : Rt,
      Ne
    ),
    [Rt, Ce, Ne, n]
  ), lt = F.useMemo(
    () => En(n.fcs.nEvents, 2048, Ne),
    [Ne, n]
  ), Cs = F.useMemo(
    () => En(
      n.fcs.nEvents,
      ed,
      Ne
    ),
    [Ne, n]
  );
  F.useEffect(() => {
    Un !== "all" && !P.some(({ id: a }) => a === Un) && hs("all");
  }, [Un, P, hs]), F.useEffect(() => {
    Ze.current++, L == null || L(), yn({}), Fn({}), Bn(null), Vn(null), Ke(null);
  }, [Un, Ne, L]);
  const Se = F.useMemo(() => me ? Pr({
    kind: "cytof-spillover",
    matrix: me.matrix,
    sampleChannels: Ns,
    includedChannels: Array.from(at)
  }) : null, [me, at, Ns, b]), y = F.useMemo(() => {
    var p;
    if (H) {
      const w = n.spilloverOrigin, C = w.kind === "external" ? w : null;
      return {
        sourceAxisKeys: H.channels,
        receiverAxisKeys: H.channels,
        sourceChannels: H.channels.map((A) => os(n, A)),
        receiverChannels: H.channels.map((A) => os(n, A)),
        matrix: H.matrix,
        kind: "flow",
        title: V ? "SCE spillover matrix" : C ? `Compensation matrix from ${C.label}` : "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: C ? "This FCS carries no spillover matrix of its own; these coefficients came from the imported FlowJo workspace and are applied unchanged." + (C.droppedChannels.length ? ` ${C.droppedChannels.length} of its parameter(s) are not in this file (${C.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "") : "Applying the embedded matrix leaves its coefficients unchanged." + (w.kind === "fcs" && ((p = w.droppedChannels) != null && p.length) ? ` ${w.droppedChannels.length} of its parameter(s) are not among this file's channels (${w.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "")
      };
    }
    if (!S || !D) return null;
    const a = S.scientific.kind === "cytof-spillover" ? Hr(S.scientific.matrix) : S.scientific.matrix;
    return a.matrix.length !== a.sourceChannels.length || a.matrix.some((w) => !w || w.length !== a.receiverChannels.length) ? null : {
      sourceAxisKeys: a.sourceChannels,
      receiverAxisKeys: a.receiverChannels,
      sourceChannels: a.sourceChannels.map((w) => Zt(n, w)),
      receiverChannels: a.receiverChannels.map((w) => Zt(n, w)),
      matrix: a.matrix,
      kind: S.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: S.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: S.scientific.kind === "cytof-spillover" ? r("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: a.sourceChannels.length,
        receivers: a.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: S.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [V, D, S, n, H, r, b]), Oe = wa ?? (y && y.sourceAxisKeys.length <= Hc ? "matrix" : "compact"), we = (y == null ? void 0 : y.sourceChannels) ?? [], Me = (y == null ? void 0 : y.receiverChannels) ?? [];
  F.useEffect(() => {
    ps((a) => Math.max(1, Math.min(Vo, Math.round(a) || 1)));
  }, [ps]);
  const Lt = xe ?? ie, Ss = F.useMemo(() => {
    if (!y || !ie) return !1;
    const [a, p] = ie.split(De);
    return a !== p && y.sourceAxisKeys.includes(a) && y.receiverAxisKeys.includes(p);
  }, [y, ie]), K = F.useMemo(() => {
    if (!y || !Lt) return null;
    const [a, p] = Lt.split(De), w = y.sourceAxisKeys.indexOf(a), C = y.receiverAxisKeys.indexOf(p);
    return w < 0 || C < 0 || y.sourceAxisKeys[w] === y.receiverAxisKeys[C] ? null : {
      pairKey: Lt,
      sourceIndex: w,
      receiverIndex: C,
      source: we[w],
      receiver: Me[C],
      value: y.matrix[w][C],
      interaction: y.kind === "cytof" ? tt(
        y.sourceAxisKeys[w],
        y.receiverAxisKeys[C]
      ) : null
    };
  }, [Lt, y, Me, we]);
  F.useEffect(() => {
    if (!K) {
      vs("");
      return;
    }
    const a = ue[K.pairKey];
    vs(ve((a ?? K.value) * 100, 6));
  }, [K == null ? void 0 : K.pairKey, K == null ? void 0 : K.value, ue]);
  const Be = F.useMemo(() => K ? Os(
    n,
    K.source.key,
    K.receiver.key,
    {
      eventMask: Ne,
      fixedEventIndices: rt,
      eligibleEventCount: Ce
    }
  ) : null, [s, J.state, rt, Ce, Ne, n, K]), qe = F.useMemo(() => {
    if (!y || y.kind === "cytof" || J.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const a = [];
    for (let A = 0; A < y.matrix.length; A++)
      for (let $ = 0; $ < y.matrix[A].length; $++) {
        const z = y.sourceAxisKeys[A], Y = y.receiverAxisKeys[$];
        if (z === Y) continue;
        const Z = y.matrix[A][$];
        if (!Number.isFinite(Z)) continue;
        const se = null;
        Z === 0 && dn === "biological" || a.push({
          sourceIndex: A,
          receiverIndex: $,
          pairKey: `${z}${De}${Y}`,
          source: we[A],
          receiver: Me[$],
          coefficient: Z,
          interaction: se,
          physicalPrior: 0
        });
      }
    a.sort((A, $) => $.physicalPrior - A.physicalPrior || Math.abs($.coefficient) - Math.abs(A.coefficient));
    const p = a.slice(0, 240), w = p.flatMap((A) => {
      const $ = Os(
        n,
        A.source.key,
        A.receiver.key,
        {
          eventMask: Ne,
          fixedEventIndices: lt,
          eligibleEventCount: Ce
        }
      );
      return $.ready ? [{ ...A, evidence: $.preview.evidence }] : [];
    }), C = sl(
      w.map(({ coefficient: A, physicalPrior: $, evidence: z }) => ({ coefficient: A, physicalPrior: $, evidence: z })),
      y.kind,
      dn
    ).map(({ index: A, relativePriority: $ }) => ({ ...w[A], relativePriority: $ }));
    return {
      candidateCount: a.length,
      screenedCount: p.length,
      evaluableCount: w.length,
      items: C.slice(0, 8)
    };
  }, [Oa, dn, J.state, y, Me, lt, Ce, Ne, n, we]), ke = F.useMemo(() => new Set(
    S ? S.scientific.kind === "flow-spillover" ? S.scientific.matrix.receiverChannels : S.scientific.includedChannels : []
  ), [S]), pe = F.useMemo(() => y ? Ll(
    n,
    Array.from(/* @__PURE__ */ new Set([
      ...y.sourceAxisKeys,
      ...y.receiverAxisKeys
    ])),
    {
      eventMask: Ne,
      fixedEventIndices: Cs,
      eligibleEventCount: Ce
    }
  ) : null, [
    s,
    Cs,
    J.state,
    y,
    Ce,
    Ne,
    n
  ]);
  F.useEffect(() => {
    if (!y || ke.size === 0) return;
    const a = ke.has(Ye) ? Ye : y.sourceAxisKeys.find((w) => ke.has(w)) ?? "", p = ke.has(Ve) && Ve !== a ? Ve : y.receiverAxisKeys.find((w) => w !== a && ke.has(w)) ?? "";
    a !== Ye && di(a), p !== Ve && fs(p);
  }, [ke, Ve, Ye, y]);
  const qn = F.useMemo(() => new Set(St), [St]), Ms = F.useMemo(() => {
    var w;
    if (!y) return [];
    const a = [], p = ke.size > 0;
    for (let C = 0; C < y.sourceAxisKeys.length; C++) {
      const A = y.sourceAxisKeys[C];
      if (!(p && !ke.has(A)))
        for (let $ = 0; $ < y.receiverAxisKeys.length; $++) {
          const z = y.receiverAxisKeys[$];
          if (A === z || p && !ke.has(z)) continue;
          const Y = (w = y.matrix[C]) == null ? void 0 : w[$];
          if (!Number.isFinite(Y)) continue;
          const Z = we[C], se = Me[$];
          if (!Z || !se || pe != null && pe.ready && (!pe.dataset.channels.has(Z.key) || !pe.dataset.channels.has(se.key))) continue;
          const ae = y.kind === "cytof" ? tt(A, z) : null, fe = ae !== null && ae !== "self" && ae !== "other";
          a.push({
            sourceIndex: C,
            receiverIndex: $,
            pairKey: `${A}${De}${z}`,
            source: Z,
            receiver: se,
            coefficient: Y,
            interaction: ae,
            physicalPrior: fe ? 1 : 0
          });
        }
    }
    return a;
  }, [pe, ke, y, Me, we]), Ge = F.useMemo(() => {
    const a = st.trim().toLocaleLowerCase();
    return Ms.filter((p) => {
      const w = Math.abs(p.coefficient) > 1e-12, C = p.physicalPrior > 0;
      return tn === "all" || tn === "relevant" && (w || C) || tn === "nonzero" && w || tn === "physical" && C || tn === "flagged" && qn.has(p.pairKey) ? a ? `${p.source.combined} ${p.receiver.combined}`.toLocaleLowerCase().includes(a) : !0 : !1;
    });
  }, [qn, Ms, tn, st]);
  F.useEffect(() => {
    var p;
    if (!us || be !== "global") return;
    const a = [...((p = In.current) == null ? void 0 : p.querySelectorAll(".gl-comp-global-tile")) ?? []].find((w) => w.dataset.pairKey === us);
    a && (a.scrollIntoView({ block: "center", inline: "center" }), ci(null));
  }, [it, Oe, us, Ge, be]);
  const ks = F.useMemo(() => {
    if (Oe === "compact" || Oe === "matrix") return [];
    const a = /* @__PURE__ */ new Map();
    for (const p of Ge) {
      const w = Oe === "source" ? p.source : p.receiver, C = a.get(w.key);
      C ? C.pairs.push(p) : a.set(w.key, { channel: w, pairs: [p] });
    }
    return [...a.values()];
  }, [Oe, Ge]), Ya = F.useMemo(() => {
    const a = /* @__PURE__ */ new Map();
    if (Oe !== "matrix") return a;
    for (const p of Ge) a.set(`${p.sourceIndex}:${p.receiverIndex}`, p);
    return a;
  }, [Oe, Ge]), Ni = F.useMemo(
    () => Oe === "compact" ? Ge : Oe === "matrix" ? [...Ge].sort((a, p) => a.sourceIndex - p.sourceIndex || a.receiverIndex - p.receiverIndex) : ks.flatMap((a) => a.pairs),
    [ks, Oe, Ge]
  ), Ci = `${r(Xc[tn])}${st.trim() ? r(" · search “{query}”", { query: st.trim() }) : ""}`, ct = Math.max(120, Math.min(220, Math.round(Na) || 120)), Si = F.useRef(null), [Mi, ki] = F.useState(0);
  F.useEffect(() => {
    const a = Si.current;
    if (!a || Oe !== "matrix" || typeof ResizeObserver > "u") return;
    const p = new ResizeObserver(() => ki(a.clientWidth));
    return p.observe(a), ki(a.clientWidth), () => p.disconnect();
  }, [Oe, be, pe == null ? void 0 : pe.ready]);
  const Ei = (y == null ? void 0 : y.receiverChannels.length) ?? 0, Es = Ei > 0 && Mi > 0 ? Math.max(120, Math.min(ct, Math.floor((Mi - 92 - 12) / Ei))) : ct, Sn = Math.max(1, Math.min(10, Math.round(Sa) || 6)), Pt = Math.max(0.1, Math.min(1, Number(ka) || 0.85)), Ot = Math.max(0.3, Math.min(3, Number(Ta) || 1)), ye = F.useMemo(() => !S || !y || J.state !== "ready" ? [] : St.flatMap((a) => {
    const [p, w] = a.split(De), C = y.sourceAxisKeys.indexOf(p), A = y.receiverAxisKeys.indexOf(w);
    if (C < 0 || A < 0 || p === w || !ke.has(p) || !ke.has(w)) return [];
    const $ = Os(
      n,
      we[C].key,
      Me[A].key,
      {
        eventMask: Ne,
        fixedEventIndices: lt,
        eligibleEventCount: Ce
      }
    );
    if (!$.ready) return [];
    const z = qe.items.find((Y) => Y.pairKey === a);
    return [{
      sourceIndex: C,
      receiverIndex: A,
      pairKey: a,
      source: we[C],
      receiver: Me[A],
      coefficient: y.matrix[C][A],
      interaction: y.kind === "cytof" ? tt(p, w) : null,
      physicalPrior: y.kind === "cytof" && tt(p, w) !== "other" ? 1 : 0,
      evidence: $.preview.evidence,
      relativePriority: (z == null ? void 0 : z.relativePriority) ?? 0
    }];
  }), [St, ke, J.state, y, S, Me, qe.items, lt, Ce, Ne, n, we]), on = ye, Ti = F.useMemo(() => {
    if (!S) return 0.01;
    const a = [];
    for (let p = 0; p < S.scientific.matrix.matrix.length; p++) {
      const w = S.scientific.matrix.sourceChannels[p];
      for (let C = 0; C < S.scientific.matrix.matrix[p].length; C++) {
        if (w === S.scientific.matrix.receiverChannels[C]) continue;
        const A = Math.abs(S.scientific.matrix.matrix[p][C]);
        Number.isFinite(A) && A > 1e-12 && a.push(A);
      }
    }
    return a.length > 0 ? Js(a) : 0.01;
  }, [S]), Ts = (a, p) => {
    const w = La[a];
    if (w) return w;
    const C = Ho(p, Ti, (y == null ? void 0 : y.kind) ?? "flow");
    return {
      lowerPercent: ve(C.lower * 100, 5),
      upperPercent: ve(C.upper * 100, 5)
    };
  }, dt = (a, p) => {
    const w = Ts(a, p), C = Number(w.lowerPercent) / 100, A = Number(w.upperPercent) / 100;
    return !Number.isFinite(C) || !Number.isFinite(A) ? { lower: C, upper: A, error: "Enter finite lower and upper sweep bounds." } : (y == null ? void 0 : y.kind) === "cytof" && C < 0 ? { lower: C, upper: A, error: "CyTOF NNLS sweep bounds cannot be negative." } : A > C ? { lower: C, upper: A, error: null } : { lower: C, upper: A, error: "The upper sweep bound must be greater than the lower bound." };
  }, _t = (a, p, w, C) => {
    Pa((A) => ({
      ...A,
      [a]: {
        ...A[a] ?? (() => {
          const $ = Ho(p, Ti, (y == null ? void 0 : y.kind) ?? "flow");
          return {
            lowerPercent: ve($.lower * 100, 5),
            upperPercent: ve($.upper * 100, 5)
          };
        })(),
        [w]: C
      }
    })), yn((A) => {
      if (!(a in A)) return A;
      const $ = { ...A };
      return delete $[a], $;
    }), Fn((A) => {
      if (!(a in A)) return A;
      const $ = { ...A };
      return delete $[a], $;
    });
  }, ut = (a, p) => {
    $a((w) => p ? w.includes(a) ? w : [...w, a] : w.filter((C) => C !== a)), p ? (ee(a), ot(a)) : (yn((w) => {
      if (!(a in w)) return w;
      const C = { ...w };
      return delete C[a], C;
    }), Fn((w) => {
      if (!(a in w)) return w;
      const C = { ...w };
      return delete C[a], C;
    }));
  }, Za = () => {
    if (!y || !Ye || !Ve || Ye === Ve) return;
    if (!ke.has(Ye) || !ke.has(Ve)) {
      Ke("Both channels must be included in the installed compensation solve.");
      return;
    }
    const a = `${Ye}${De}${Ve}`;
    ut(a, !0), Ke(null);
  }, As = on.reduce((a, p) => a + (dt(p.pairKey, p.coefficient).error ? 1 : 0), 0), pn = F.useMemo(() => {
    if (!S) return null;
    const a = S.scientific.matrix.matrix.map((p) => Array.from(p));
    for (const [p, w] of Object.entries(ue)) {
      const [C, A] = p.split(De), $ = S.scientific.matrix.sourceChannels.indexOf(C), z = S.scientific.matrix.receiverChannels.indexOf(A);
      $ >= 0 && z >= 0 && (a[$][z] = w);
    }
    return Object.freeze(a.map((p) => Object.freeze(p)));
  }, [S, ue]), Qa = F.useMemo(
    () => En(n.fcs.nEvents, Jc, Ne),
    [Ne, n]
  ), Fs = F.useMemo(() => !S || S.scientific.kind !== "cytof-spillover" || !pn ? null : {
    sourceChannels: S.scientific.matrix.sourceChannels,
    receiverChannels: S.scientific.matrix.receiverChannels,
    matrix: pn
  }, [S, pn]), $n = Fl({
    enabled: B && be === "screen",
    sample: n,
    eventIndices: Qa,
    matrix: Fs,
    revision: _a
  }), Ai = F.useMemo(
    () => {
      var a;
      return ((a = $n.result) == null ? void 0 : a.pairs.filter(({ verdict: p }) => p === "above-data" || p === "below-floor").length) ?? 0;
    },
    [$n.result]
  );
  F.useEffect(() => {
    const a = Object.keys(ue).length;
    if (!B || a === 0 || !S || S.scientific.kind !== "flow-spillover" || J.state !== "ready" || !pn || !K || !E) {
      Wn.current++, An({ state: "idle" });
      return;
    }
    const p = rt;
    if (p.length === 0) {
      An({
        state: "error",
        pairKey: K.pairKey,
        message: r("The selected review population contains no events.")
      });
      return;
    }
    const w = ++Wn.current, C = K.pairKey;
    An(($) => ({
      state: "updating",
      pairKey: C,
      ...($.state === "ready" || $.state === "updating") && $.pairKey === C && $.preview ? { preview: $.preview } : {}
    }));
    const A = window.setTimeout(() => {
      E(
        S,
        p,
        pn
      ).then(($) => {
        if (Wn.current !== w) return;
        const z = $.sourceChannels.indexOf(K.source.pnn), Y = $.sourceChannels.indexOf(K.receiver.pnn);
        if (z < 0 || Y < 0)
          throw new Error(r("The preview result did not contain the selected flow channels."));
        const Z = _s(
          n,
          K.source.pnn,
          K.receiver.pnn,
          p,
          $.candidateColumns[z],
          $.candidateColumns[Y],
          { totalEvents: Ce }
        );
        if (!Z.ready) throw new Error(Z.reason);
        An({
          state: "ready",
          pairKey: C,
          preview: Z.preview
        });
      }).catch(($) => {
        if (Wn.current !== w) return;
        const z = $ instanceof Error ? $.message : String($);
        /cancel|supersed|stale/i.test(z) || An({ state: "error", pairKey: C, message: z });
      });
    }, 90);
    return () => window.clearTimeout(A);
  }, [
    J.state,
    E,
    S,
    rt,
    Ce,
    n,
    n.dataRevision,
    n.displayTransformContextKey,
    n.layerRevision,
    K,
    ue,
    r,
    B,
    pn
  ]);
  const Ja = F.useMemo(() => !y || Object.keys(ue).length === 0 ? null : {
    sourceChannels: y.sourceAxisKeys,
    receiverChannels: y.receiverAxisKeys,
    matrix: y.matrix.map(
      (a, p) => a.map((w, C) => {
        const A = `${y.sourceAxisKeys[p]}${De}${y.receiverAxisKeys[C]}`;
        return ue[A] ?? w;
      })
    )
  }, [y, ue]), Fi = F.useMemo(() => {
    if (!y) return [];
    const a = [];
    for (let p = 0; p < y.matrix.length; p++)
      for (let w = 0; w < y.matrix[p].length; w++) {
        const C = y.matrix[p][w];
        y.sourceAxisKeys[p] === y.receiverAxisKeys[w] || !Number.isFinite(C) || C <= 1 || a.push(`${we[p].combined} → ${Me[w].combined}`);
      }
    return a;
  }, [y, Me, we]), Is = F.useMemo(() => {
    if (!y) return [];
    const a = [];
    for (let p = 0; p < y.matrix.length; p++)
      for (let w = 0; w < y.matrix[p].length; w++) {
        const C = y.matrix[p][w], A = y.sourceAxisKeys[p] === y.receiverAxisKeys[w], $ = `${we[p].combined} → ${Me[w].combined}`;
        Number.isFinite(C) ? A && Math.abs(C - 1) > 1e-8 ? a.push(`${we[p].combined}: diagonal is ${Te(C)}, not 100%`) : !A && C < 0 ? a.push(`${$}: negative coefficient (${Te(C)})`) : !A && C > 1 && a.push(`${$}: coefficient above 100%`) : a.push(`${$}: non-finite coefficient (${String(C)})`);
      }
    return a;
  }, [y, Me, we]), Ii = F.useMemo(
    () => (y == null ? void 0 : y.matrix.some((a) => a.some((p) => !Number.isFinite(p)))) ?? !1,
    [y]
  ), Je = F.useMemo(
    () => D && J.state === "ready" ? ud(n, D.includedPnns) : null,
    [J.state, D, n]
  ), Dt = F.useMemo(() => {
    const a = [...Is];
    return J.state === "stale" && a.push(...J.reasons.map((p) => `Profile unavailable: ${od(p)}`)), a;
  }, [J, Is]), $i = D ? (S == null ? void 0 : S.name) ?? "Installed compensation profile" : H ? V ? "SCE spillover matrix" : "Embedded FCS matrix" : "No compatible matrix", er = D ? id(D.kind, D.method) : H ? "Flow linear inverse" : "Not configured", Kt = r(er), $s = (D == null ? void 0 : D.includedPnns.length) ?? (H == null ? void 0 : H.channels.length) ?? 0, zt = (S == null ? void 0 : S.name) ?? (D == null ? void 0 : D.profileId) ?? $i, Ri = Bs(zt), nr = Ri !== zt || (S == null ? void 0 : S.recordType) === "revision" ? `${Ri} · ${r("revised")}` : zt, tr = H !== null && !Ii || D !== null && J.state === "ready", Li = F.useMemo(() => {
    if (!y) return 0;
    let a = 0;
    for (let p = 0; p < y.matrix.length; p++)
      for (let w = 0; w < y.matrix[p].length; w++) {
        if (y.sourceAxisKeys[p] === y.receiverAxisKeys[w]) continue;
        const C = y.matrix[p][w];
        Number.isFinite(C) && (a = Math.max(a, Math.abs(C)));
      }
    return a;
  }, [y]), ht = !!((S == null ? void 0 : S.scientific.kind) === "flow-spillover" && J.state === "ready" && y && Math.max(y.sourceAxisKeys.length, y.receiverAxisKeys.length) <= nd), Gn = F.useMemo(() => {
    const p = [...we, ...Me].map((Z) => Z.combined), w = typeof document > "u" ? null : document.createElement("canvas").getContext("2d");
    w && (w.font = `11px ${qc}`);
    const C = (Z) => w ? w.measureText(Z).width : Z.length * 11 * 0.55, A = p.reduce((Z, se) => Math.max(Z, C(se)), 0), $ = Math.min(320, Math.max(94, Math.ceil(A) + 12)), z = Math.min(260, Math.max(82, Math.ceil(A) + 6)), Y = Math.max(88, Math.ceil(z * Math.sin(zs) + 12));
    return { rowLabelWidth: $, columnLabelWidth: z, columnLabelHeight: Y };
  }, [ht, Me, we]), mt = ht ? Do.inline : Do.view, sr = y ? (() => {
    const a = Math.max(1, y.sourceAxisKeys.length), p = Math.max(1, y.receiverAxisKeys.length), w = Math.max(a, p), { least: C, budgeted: A, most: $, budget: z } = mt;
    if (!ws) return Math.max(C, Math.min(A, Math.floor(z / w)));
    const Y = (ws.width - _o - Gn.rowLabelWidth - Gn.columnLabelWidth * Math.cos(zs)) / p, Z = (ws.height - _o - Gn.columnLabelHeight) / a;
    return Math.max(C, Math.min($, Math.floor(Math.min(Y, Z))));
  })() : 13, an = y && js !== "fit" ? Math.max(mt.least, Math.min(mt.largest, Math.round(js))) : sr, ir = an >= Gc, pt = F.useMemo(() => ({
    ...Gn,
    // The last column's label leans past the matrix's right edge by its horizontal extent.
    overhang: Math.max(0, Math.ceil(Gn.columnLabelWidth * Math.cos(zs) - an / 2))
  }), [Gn, an]);
  F.useEffect(() => {
    Mt({}), Tn({}), An({ state: "idle" }), Wn.current++;
  }, [S == null ? void 0 : S.profileId]), F.useEffect(() => {
    (y == null ? void 0 : y.kind) === "flow" && tn === "physical" && Ct("relevant");
  }, [tn, y == null ? void 0 : y.kind, Ct]);
  const or = (a) => {
    te((p) => ({ ...p, [a]: !p[a] }));
  }, Pi = (a) => {
    var C;
    const p = ((C = In.current) == null ? void 0 : C.getBoundingClientRect().width) ?? 1100, w = Math.max(360, Math.min(900, p - 440 - 8));
    return Math.max(360, Math.min(w, Math.round(a)));
  }, ar = (a) => {
    var A;
    if (a.button !== 0) return;
    a.preventDefault();
    const p = a.currentTarget;
    (A = p.setPointerCapture) == null || A.call(p, a.pointerId);
    const w = ($) => {
      var Y;
      const z = (Y = In.current) == null ? void 0 : Y.getBoundingClientRect();
      z && Fe(Pi(z.right - $.clientX));
    }, C = () => {
      var $;
      window.removeEventListener("pointermove", w), window.removeEventListener("pointerup", C), window.removeEventListener("pointercancel", C), ($ = p.releasePointerCapture) == null || $.call(p, a.pointerId);
    };
    window.addEventListener("pointermove", w), window.addEventListener("pointerup", C), window.addEventListener("pointercancel", C);
  }, rr = (a) => {
    let p = null;
    a.key === "ArrowLeft" ? p = ge + 40 : a.key === "ArrowRight" ? p = ge - 40 : a.key === "Home" && (p = Wo), p !== null && (a.preventDefault(), Fe(Pi(p)));
  }, lr = async (a) => {
    var w;
    const p = (w = a.currentTarget.files) == null ? void 0 : w[0];
    a.currentTarget.value = "", p && await Oi(p);
  }, Rs = () => void ni(bi.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "CyTOF spillover matrix").then((a) => {
    a != null && a[0] && Oi(a[0]);
  }), Oi = async (a) => {
    jn(null), he(null), $e(!1), ze(null), hn(!1);
    try {
      const p = Wr(await a.text()), w = Vs(
        p.input,
        "cytof-spillover"
      );
      if (!w.ok)
        throw new Error(w.errors.map(({ message: $ }) => $).join(" "));
      const C = /* @__PURE__ */ new Map();
      for (const { pnn: $ } of Ns) {
        const z = $.trim().normalize("NFC");
        C.set(z, (C.get(z) ?? 0) + 1);
      }
      const A = w.value.receiverChannels.filter(
        ($) => C.get($) === 1
      );
      Et({
        fileName: a.name,
        source: "file",
        parsed: p,
        matrix: w.value,
        validationWarnings: w.warnings
      }), wn(new Set(A));
    } catch (p) {
      Et(null), wn(/* @__PURE__ */ new Set()), jn(p instanceof Error ? p.message : String(p));
    }
  }, cr = (a, p) => {
    wn((w) => {
      const C = new Set(w);
      return p ? C.add(a) : C.delete(a), C;
    });
  }, _i = async () => {
    var w, C;
    if (!me)
      throw new Error(r("Choose a CyTOF spillover matrix first."));
    const a = ((C = (w = globalThis.crypto) == null ? void 0 : w.randomUUID) == null ? void 0 : C.call(w)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, p = me.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation";
    return Ps(
      {
        kind: "cytof-spillover",
        method: "nnls",
        solverVersion: qr,
        solverSettings: Gr,
        matrix: me.matrix,
        includedChannels: Array.from(at)
      },
      {
        profileId: `cytof-${a}`,
        name: p,
        createdAt: /* @__PURE__ */ new Date(),
        origin: {
          type: "uploaded",
          fileName: me.fileName,
          format: me.parsed.format.delimiter,
          sourceColumnHeader: me.parsed.format.sourceColumnHeader
        },
        provenance: {
          sourceDescription: me.source === "host" ? "CyTOF spillover matrix from metadata(sce)$spillover_matrix" : "User-uploaded CyTOF spillover matrix",
          estimationMethod: "Imported; coefficients preserved exactly"
        }
      }
    );
  }, dr = async () => {
    if (!(Qe.current || ne || !me || !(Se != null && Se.canApply) || !o)) {
      if (m && !We) {
        jn(
          r("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      jn(null), he(null), ze(null), Qe.current = !0, sn(!0), mn(me.fileName);
      try {
        const a = await _i();
        await o(a, ze), he(r("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: a.name,
          channels: at.size,
          files: Nn
        })), Et(null), wn(/* @__PURE__ */ new Set()), hn(!1), ze(null);
      } catch (a) {
        const p = a instanceof Error ? a.message : String(a);
        /cancel/i.test(p) ? he(r("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : jn(p);
      } finally {
        Qe.current = !1, sn(!1), mn(null);
      }
    }
  }, ur = async () => {
    if (!(Qe.current || ne || !me || !(Se != null && Se.canApply) || !Cn || !h || !ys)) {
      if (m && !We) {
        jn(
          r("Confirm that existing gate memberships will be recomputed in compensated coordinates before adopting the assay.")
        );
        return;
      }
      jn(null), he(null), ze(null), Qe.current = !0, sn(!0), mn(Cn.label);
      try {
        const a = await _i();
        await h(
          a,
          Cn,
          ze
        ), he(r("Using existing SCE assay {assay} with {matrix}. No assay values were recomputed.", {
          assay: Cn.label,
          matrix: a.name
        })), Et(null), wn(/* @__PURE__ */ new Set()), hn(!1), Ft(!1), ze(null);
      } catch (a) {
        jn(a instanceof Error ? a.message : String(a));
      } finally {
        Qe.current = !1, sn(!1), mn(null);
      }
    }
  }, hr = async () => {
    var C, A;
    if (Qe.current || ne || !o) return;
    if (m && !We) {
      $e(!0), he(
        r("Confirm that existing gate memberships will be recomputed in compensated coordinates before starting a matrix.")
      );
      return;
    }
    const a = n.channels.map(($, z) => ({ pnn: $.pnn, index: z })).filter(({ index: $ }) => n.isFluorChannel($) && !n.isImagingFeatureChannel($)).map(({ pnn: $ }) => $);
    if (a.length < 2) {
      $e(!0), he(r("An empty matrix needs at least two fluorescence channels."));
      return;
    }
    const p = Vs({
      sourceChannels: a,
      receiverChannels: a,
      matrix: a.map(($, z) => a.map((Y, Z) => z === Z ? 1 : 0))
    }, "flow-spillover");
    if (!p.ok) {
      $e(!0), he(p.errors.map(({ message: $ }) => $).join(" "));
      return;
    }
    const w = `${t.replace(/\.fcs$/i, "") || "Flow"} manual matrix`;
    he(null), $e(!1), ze(null), Qe.current = !0, sn(!0), mn(w);
    try {
      const $ = ((A = (C = globalThis.crypto) == null ? void 0 : C.randomUUID) == null ? void 0 : A.call(C)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, z = await Ps(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: Zi,
          solverSettings: Yi,
          matrix: p.value
        },
        {
          profileId: `flow-manual-${$}`,
          name: w,
          createdAt: /* @__PURE__ */ new Date(),
          origin: { type: "manual", startedAs: "identity" },
          provenance: {
            sourceDescription: "Identity matrix over the file's fluorescence channels, to be set by hand in GateLab",
            estimationMethod: "Manual"
          }
        }
      );
      await o(z, ze), hn(!1), he(r("Manual matrix editing is ready: every spillover starts at zero. Select a pair and set its coefficient."));
    } catch ($) {
      $e(!0), he($ instanceof Error ? $.message : String($));
    } finally {
      Qe.current = !1, sn(!1);
    }
  }, mr = async () => {
    if (!(!c || ne || Tt)) {
      if (m && !We) {
        $e(!0), he(
          r("Confirm that existing gate memberships will be recomputed in original coordinates before removing the matrix.")
        );
        return;
      }
      vi(!0);
      try {
        await c(), $e(!1), he(r("No file is compensated: the original assay is active and every file reads its stored values. The matrix stays in the Matrices list."));
      } catch (a) {
        $e(!0), he(a instanceof Error ? a.message : String(a));
      } finally {
        vi(!1);
      }
    }
  }, pr = async () => {
    var p, w, C;
    if (Qe.current || ne || !H || !((p = Re == null ? void 0 : Re.validation) != null && p.ok) || !o) return;
    if (m && !We) {
      $e(!0), he(
        r("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const a = (V == null ? void 0 : V.name) || `${t.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    he(null), $e(!1), ze(null), Qe.current = !0, sn(!0), mn(a);
    try {
      const A = ((C = (w = globalThis.crypto) == null ? void 0 : w.randomUUID) == null ? void 0 : C.call(w)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, $ = await Ps(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: Zi,
          solverSettings: Yi,
          matrix: Re.validation.value
        },
        {
          profileId: `flow-${A}`,
          name: a,
          createdAt: /* @__PURE__ */ new Date(),
          origin: {
            ...V ? {
              type: "uploaded",
              fileName: V.name,
              format: "csv",
              sourceColumnHeader: "source"
            } : {
              type: "embedded-fcs",
              fileName: t,
              ...Re.keyword ? { keyword: Re.keyword } : {}
            }
          },
          provenance: {
            sourceDescription: V ? "Flow spillover matrix from metadata(sce)$spillover_matrix" : "Spillover matrix embedded in the source FCS file",
            estimationMethod: Ur(
              V ? "Imported from SCE metadata" : "Imported from FCS",
              Re.roundedCoefficients
            )
          }
        }
      );
      await o($, ze), hn(!1);
      const z = r(V ? "Flow matrix editing is ready. The exact hosted matrix is retained as the baseline, and Original measurements remain available." : "Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available.");
      he(Re.roundedCoefficients > 0 ? r("Flow matrix editing is ready. {count} coefficients within 0.001% of 0 or 100% were set to exactly 0 or 100% to store the matrix; all others are as the file carries them. Original measurements remain available.", {
        count: Re.roundedCoefficients
      }) : z);
    } catch (A) {
      $e(!0), he(A instanceof Error ? A.message : String(A));
    } finally {
      Qe.current = !1, sn(!1), mn(null), ze(null);
    }
  }, Di = (a, p) => {
    var A, $;
    const w = we[a], C = Me[p];
    !y || !w || !C || y.sourceAxisKeys[a] === y.receiverAxisKeys[p] || (ee(`${y.sourceAxisKeys[a]}${De}${y.receiverAxisKeys[p]}`), ($ = (A = yi.current) == null ? void 0 : A.querySelector(
      `button[data-source-index="${a}"][data-receiver-index="${p}"]`
    )) == null || $.focus());
  }, fr = (a, p, w) => {
    if (!y) return;
    const C = y.sourceAxisKeys.length, A = y.receiverAxisKeys.length;
    let $ = p, z = w;
    const Y = (se, ae) => {
      let fe = se + ae;
      for (; fe >= 0 && fe < A; ) {
        if (y.sourceAxisKeys[p] !== y.receiverAxisKeys[fe]) return fe;
        fe += ae;
      }
      return se;
    }, Z = (se, ae) => {
      let fe = se + ae;
      for (; fe >= 0 && fe < C; ) {
        if (y.sourceAxisKeys[fe] !== y.receiverAxisKeys[w]) return fe;
        fe += ae;
      }
      return se;
    };
    switch (a.key) {
      case "ArrowLeft":
        z = Y(w, -1);
        break;
      case "ArrowRight":
        z = Y(w, 1);
        break;
      case "ArrowUp":
        $ = Z(p, -1);
        break;
      case "ArrowDown":
        $ = Z(p, 1);
        break;
      case "Home": {
        z = y.sourceAxisKeys[p] === y.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const se = A - 1;
        z = y.sourceAxisKeys[p] === y.receiverAxisKeys[se] ? se - 1 : se;
        break;
      }
      default:
        return;
    }
    a.preventDefault(), Di($, z);
  }, Rn = (a, p) => {
    if (!S || !Number.isFinite(p)) return;
    const [w, C] = a.split(De), A = S.scientific.matrix.sourceChannels.indexOf(w), $ = S.scientific.matrix.receiverChannels.indexOf(C);
    if (A < 0 || $ < 0) return;
    if (S.scientific.kind === "cytof-spillover" && p < 0) {
      $e(!0), he(r("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const z = S.scientific.matrix.matrix[A][$];
    Mt((Y) => {
      const Z = { ...Y };
      return p === z ? delete Z[a] : Z[a] = p, Z;
    }), $e(!1), he(r("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: w,
      receiver: C,
      value: (p * 100).toFixed(2)
    }));
  }, Ki = (a, p, w, C) => {
    const A = w[0];
    if (!A) return null;
    const $ = A.sourceChannels.indexOf(a.source.pnn), z = A.sourceChannels.indexOf(a.receiver.pnn);
    if ($ < 0 || z < 0) return null;
    const Y = _s(
      n,
      a.source.pnn,
      a.receiver.pnn,
      C,
      A.currentColumns[$],
      A.currentColumns[z],
      { totalEvents: Ce }
    );
    if (!Y.ready) return null;
    const Z = [{
      value: a.coefficient,
      isCurrent: !0,
      preview: Y.preview
    }];
    return w.forEach((se, ae) => {
      const fe = se.sourceChannels.indexOf(a.source.pnn), fn = se.sourceChannels.indexOf(a.receiver.pnn);
      if (fe < 0 || fn < 0) return;
      const en = _s(
        n,
        a.source.pnn,
        a.receiver.pnn,
        C,
        se.candidateColumns[fe],
        se.candidateColumns[fn],
        {
          totalEvents: Ce,
          xRange: Y.preview.xRange,
          yRange: Y.preview.yRange
        }
      );
      en.ready && Z.push({
        value: p[ae],
        isCurrent: !1,
        preview: en.preview
      });
    }), Z.sort((se, ae) => se.value - ae.value || Number(ae.isCurrent) - Number(se.isCurrent)), { pairKey: a.pairKey, values: Object.freeze(Z) };
  }, gr = async (a) => {
    if (!S || !y || !_ || ne || Ie || Ue) return;
    const p = dt(a.pairKey, a.coefficient);
    if (p.error) {
      Ke(p.error);
      return;
    }
    const w = En(
      n.fcs.nEvents,
      zo,
      Ne
    );
    if (w.length === 0) {
      Ke(r("The selected review population contains no events."));
      return;
    }
    const C = ++Ze.current, A = [p.lower, p.upper];
    Bn(a.pairKey), Ke(null);
    try {
      const $ = await _(
        S,
        w,
        A.map((Y) => Go(
          S,
          y.sourceAxisKeys[a.sourceIndex],
          y.receiverAxisKeys[a.receiverIndex],
          Y
        )),
        void 0,
        1
      );
      if (Ze.current !== C) return;
      const z = Ki(a, A, $, w);
      if (!z) throw new Error(r("The fast bounds preview could not be built for this pair."));
      Fn((Y) => ({ ...Y, [a.pairKey]: z }));
    } catch ($) {
      if (Ze.current !== C) return;
      const z = $ instanceof Error ? $.message : String($);
      Ke(/cancel/i.test(z) ? r("Fast bounds preview cancelled.") : z);
    } finally {
      Ze.current === C && Bn(null);
    }
  }, vr = async () => {
    var C;
    if (!S || !_ || on.length === 0 || ne || Ie !== null || Ue !== null) return;
    if (As > 0) {
      Ke(r("Fix the sweep bounds for {count} flagged pairs before running.", { count: As }));
      return;
    }
    const a = En(
      n.fcs.nEvents,
      Ko,
      Ne
    );
    if (a.length === 0) {
      Ke(r("The selected review population contains no events."));
      return;
    }
    const p = ++Ze.current, w = on.flatMap((A) => {
      const $ = dt(A.pairKey, A.coefficient);
      return cd($.lower, $.upper).map((z) => ({
        pair: A,
        value: z,
        matrix: Go(
          S,
          y.sourceAxisKeys[A.sourceIndex],
          y.receiverAxisKeys[A.receiverIndex],
          z
        )
      }));
    });
    Ke(null), yn({}), Vn({ completed: 0, total: w.length });
    try {
      const A = await _(
        S,
        a,
        w.map(({ matrix: z }) => z),
        (z, Y) => {
          Ze.current === p && Vn({ completed: z, total: Y });
        },
        ms
      );
      if (Ze.current !== p) return;
      if (A.length !== w.length)
        throw new Error(r("The compensation worker returned an incomplete coefficient sweep."));
      const $ = {};
      for (const z of on) {
        const Y = w.flatMap((se, ae) => se.pair.pairKey === z.pairKey ? [ae] : []), Z = Ki(
          z,
          Y.map((se) => w[se].value),
          Y.map((se) => A[se]),
          a
        );
        Z && ($[z.pairKey] = Z);
      }
      yn($), ot(((C = on[0]) == null ? void 0 : C.pairKey) ?? null);
    } catch (A) {
      if (Ze.current !== p) return;
      const $ = A instanceof Error ? A.message : String(A);
      Ke(/cancel/i.test($) ? r("Exact coefficient sweep cancelled.") : $);
    } finally {
      Ze.current === p && Vn(null);
    }
  }, xr = () => {
    const p = (S == null ? void 0 : S.scientific.kind) === "flow-spillover" && !!G ? (W == null ? void 0 : W.rows.find(({ active: C, profile: A }) => C && A !== null)) ?? null : null, w = p && W ? W.planSwitch(p) : null;
    return /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-revision-agreement", children: [
      w && /* @__PURE__ */ e.jsxs("p", { children: [
        r("Every file in the workspace ({count}) is compensated with the revised matrix.", { count: w.fileCount }),
        " ",
        w.gateCount > 0 ? r("Membership is recomputed for {gates} gates and {populations} populations drawn on channels this matrix compensates.", {
          gates: w.gateCount,
          populations: w.populationCount
        }) : r("No gate is drawn on a channel this matrix compensates.")
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: xs,
            disabled: ne,
            onChange: (C) => bs(C.currentTarget.checked)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { children: r("I agree that gate membership may change.") })
      ] })
    ] });
  }, br = () => {
    Ze.current++, L == null || L(), Vn(null), Bn(null), Ke(r("Exact coefficient sweep cancelled."));
  }, yr = async () => {
    var w, C;
    if (!S || !pn || !o || Object.keys(ue).length === 0 || !xs) return;
    const a = S.scientific.kind === "flow-spillover" && G ? G : o, p = `${Bs(S.name)} · edited`;
    he(null), $e(!1), sn(!0), mn(p), ze(null);
    try {
      const $ = {
        profileId: `comp-edit-${((C = (w = globalThis.crypto) == null ? void 0 : w.randomUUID) == null ? void 0 : C.call(w)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: p,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(ue).length} compensation coefficient${Object.keys(ue).length === 1 ? "" : "s"} in GateLab.`
      }, z = (T == null ? void 0 : T.recordType) === "baseline" && dd(pn, T.scientific.matrix.matrix) ? await Br(S, T, $) : await Vr(
        S,
        rd(S, pn),
        $
      );
      await a(z, ze), bs(!1), Mt({}), Tn({}), yn({}), Fn({}), Bn(null), Ke(null), gs((Y) => Y + 1), ye.length > 0 && (cn("attention"), ee(ye[0].pairKey), ot(ye[0].pairKey)), he(r("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: Bs(z.name),
        flagged: ye.length > 0 ? r(
          ye.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: ye.length }
        ) : ""
      }));
    } catch (A) {
      $e(!0), he(A instanceof Error ? A.message : String(A));
    } finally {
      sn(!1), mn(null), ze(null);
    }
  }, zi = (a) => {
    if (ye.length === 0) return;
    const p = ye.findIndex(({ pairKey: A }) => A === ie), w = p < 0 ? a > 0 ? 0 : ye.length - 1 : (p + a + ye.length) % ye.length, C = ye[w];
    X(null), ee(C.pairKey), ot(C.pairKey);
  }, Ut = () => /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "gl-comp-inspector-resize",
      role: "separator",
      "aria-label": r("Resize compensation inspector"),
      "aria-orientation": "vertical",
      "aria-valuemin": 360,
      "aria-valuemax": 900,
      "aria-valuenow": ge,
      tabIndex: 0,
      title: r("Drag to resize the coefficient inspector; use Left/Right arrow keys for fine control"),
      onPointerDown: ar,
      onKeyDown: rr,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), wr = (a) => {
    X(null), ee(a), ds(!0), Ms.some((p) => p.pairKey === a) && (Ge.some((p) => p.pairKey === a) || (Ct("all"), li("")), ci(a));
  }, Bt = (a, p = !1) => {
    var Ae;
    const w = K ? qn.has(K.pairKey) : !1, C = K ? ye.find(({ pairKey: oe }) => oe === K.pairKey) ?? null : null, A = K ? Ts(K.pairKey, K.value) : null, $ = K ? dt(K.pairKey, K.value) : null, z = K ? Ua[K.pairKey] : null, Y = K ? y.sourceAxisKeys[K.sourceIndex] : "", Z = K ? y.receiverAxisKeys[K.receiverIndex] : "", se = K != null && K.interaction && K.interaction !== "self" && K.interaction !== "other" ? 1 : 0, ae = K && y.kind === "cytof" ? ((Ae = $n.result) == null ? void 0 : Ae.pairs.find((oe) => oe.source === Y && oe.receiver === Z)) ?? null : null, fe = ae ? aa(ae) : null, fn = ae ? ia(ae) : null, en = ae && $n.data && Fs && be === "screen" ? Nl($n.data, Fs, Y, Z) : null, rn = K && (Be != null && Be.ready) && y.kind !== "cytof" ? qs({
      coefficient: K.value,
      physicalPrior: se,
      evidence: Be.preview.evidence
    }, y.kind, dn) : null, gn = K ? ld(T, Y, Z) : null, Ln = (K == null ? void 0 : K.value) ?? null, Hn = K ? ue[K.pairKey] : void 0, Xn = !!(K && (S == null ? void 0 : S.scientific.kind) === "flow-spillover" && E && Object.keys(ue).length > 0), ft = un.state !== "idle" && un.state !== "error" && un.pairKey === (K == null ? void 0 : K.pairKey) ? un.preview : null, Yn = ft ?? (Be != null && Be.ready ? Be.preview : null), Mn = [];
    gn !== null && Ln !== null && ((S == null ? void 0 : S.recordType) === "revision" || gn !== Ln) && Mn.push({ label: r("Baseline"), value: gn }), Ln !== null && Mn.push({ label: r("Installed"), value: Ln }), Hn !== void 0 && Mn.push({ label: r("Staged"), value: Hn });
    const Vt = ye.findIndex(({ pairKey: oe }) => oe === ie);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${p ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: r("Selected coefficient") }),
          !p && /* @__PURE__ */ e.jsx("span", { children: r(xe ? "Hover preview · click to pin this pair." : ie ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inspector-actions", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flag-navigation", "aria-label": r("Flagged compensation pair navigation"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": r("Previous flagged compensation pair"),
                disabled: ye.length === 0,
                onClick: () => zi(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: Vt >= 0 ? r("{current} / {total} flagged", { current: Vt + 1, total: ye.length }) : r("{total} flagged", { total: ye.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": r("Next flagged compensation pair"),
                disabled: ye.length === 0,
                onClick: () => zi(1),
                children: "→"
              }
            )
          ] }),
          a && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-inspector-close",
              "aria-label": r(p ? "Close global compensation pair details" : "Close the coefficient panel"),
              title: r(p ? "Close details and return to the full gallery" : "Close the coefficient panel; selecting a cell opens it again"),
              onClick: a,
              children: "×"
            }
          )
        ] })
      ] }),
      K ? /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-pair-detail${p ? " is-global" : ""}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pair-route", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: r("Source channel") }),
            /* @__PURE__ */ e.jsx("strong", { children: K.source.label }),
            /* @__PURE__ */ e.jsx("small", { children: K.source.pnn })
          ] }),
          /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: r("Receiver") }),
            /* @__PURE__ */ e.jsx("strong", { children: K.receiver.label }),
            /* @__PURE__ */ e.jsx("small", { children: K.receiver.pnn })
          ] })
        ] }),
        rn && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${rn.category}`,
            title: r(rn.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: r(rn.label) }),
              /* @__PURE__ */ e.jsx("span", { children: r(rn.detail) })
            ]
          }
        ),
        ae && fe && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-evidence-badge gl-comp-screen-badge is-${fe.tone}`, children: [
          /* @__PURE__ */ e.jsx("strong", { children: r(fe.label) }),
          /* @__PURE__ */ e.jsxs("span", { children: [
            r(fe.detail, fe.values),
            ae.receiverUnlabelled ? ` ${r("The receiver carries no antibody in this file, so only spillover should put counts in it.")}` : ""
          ] }),
          fn !== null && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: !S || ne,
              onClick: () => Rn(K.pairKey, fn),
              children: r("Stage {value}", { value: He(fn) })
            }
          )
        ] }),
        ae && en && /* @__PURE__ */ e.jsx(
          Ml,
          {
            pair: ae,
            events: en,
            sourceLabel: K.source.label,
            receiverLabel: K.receiver.label
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: w,
              disabled: !S || !ke.has(y.sourceAxisKeys[K.sourceIndex]) || !ke.has(y.receiverAxisKeys[K.receiverIndex]),
              onChange: (oe) => ut(K.pairKey, oe.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: r("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: r("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: r("Stored fraction: {value}", { value: ve(K.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: r(ue[K.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(ue[K.pairKey] ?? K.value) ? `${((ue[K.pairKey] ?? K.value) * 100).toFixed(1)}%` : String(ue[K.pairKey] ?? K.value) })
        ] }),
        Mn.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": r("Coefficient history"), children: Mn.map((oe, vn) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          vn > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: r("Exact fraction: {value}", { value: ve(oe.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: oe.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (oe.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${oe.label}:${vn}`)) }),
        S && ie === K.pairKey && !xe && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: r("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              nt,
              {
                step: "0.1",
                value: kt,
                disabled: ne,
                onValueChange: (oe) => {
                  vs(oe), S.scientific.kind === "flow-spillover" && oe.trim() !== "" && Number.isFinite(Number(oe)) && Rn(K.pairKey, Number(oe) / 100);
                }
              }
            )
          ] }),
          S.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: r("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: ne || !Number.isFinite(Number(kt)) || kt.trim() === "",
              onClick: () => Rn(K.pairKey, Number(kt) / 100),
              children: r("Stage value")
            }
          ),
          ue[K.pairKey] !== void 0 && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: ne,
              onClick: () => {
                Rn(K.pairKey, K.value), Tn((oe) => {
                  const vn = { ...oe };
                  return delete vn[K.pairKey], vn;
                });
              },
              children: r("Reset")
            }
          )
        ] }),
        Xn && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-candidate-status${p ? " is-compact" : ""}`, "aria-label": r("Flow compensation coefficient preview"), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: r("Coefficient preview") }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              r("Original remains fixed; the right panel shows the complete working matrix."),
              p ? r(" The gallery remains installed until Apply.") : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("em", { children: Hn === void 0 ? r("Working matrix") : `${(K.value * 100).toFixed(1)}% → ${(Hn * 100).toFixed(1)}%` }),
          un.state === "updating" && un.pairKey === K.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: r("Updating…") }),
          un.state === "error" && un.pairKey === K.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: r(un.message) })
        ] }),
        K.interaction && K.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          r("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: K.interaction })
        ] }),
        p && (Yn ? /* @__PURE__ */ e.jsx(
          Oo,
          {
            preview: Yn,
            sourceLabel: K.source.label,
            receiverLabel: K.receiver.label,
            kind: y.kind,
            densitySmoothing: Sn,
            compact: !0,
            compensatedTitle: r(ft ? "Candidate" : "Compensated")
          }
        ) : Be && !Be.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: r(Be.reason) }) : null),
        p && /* @__PURE__ */ e.jsx(
          Bc,
          {
            matrixView: y,
            sourceChannels: we,
            receiverChannels: Me,
            selectedSourceIndex: K.sourceIndex,
            selectedReceiverIndex: K.receiverIndex,
            stagedCoefficients: ue,
            maximumAbsoluteOffDiagonal: Li,
            onSelect: wr
          }
        ),
        !p && (Yn ? /* @__PURE__ */ e.jsx(
          Oo,
          {
            preview: Yn,
            sourceLabel: K.source.label,
            receiverLabel: K.receiver.label,
            kind: y.kind,
            densitySmoothing: Sn,
            compensatedTitle: r(ft ? "Candidate" : "Compensated")
          }
        ) : Be && !Be.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: r(Be.reason) }) : null),
        w && C && A && $ && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: r("Sweep bounds") }),
            /* @__PURE__ */ e.jsx("span", { children: r("Four exact candidates will be interpolated across these endpoints.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-inputs", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: r("Lower (%)") }),
              /* @__PURE__ */ e.jsx(
                nt,
                {
                  step: "0.1",
                  value: A.lowerPercent,
                  disabled: ne || Ie !== null || Ue !== null,
                  onValueChange: (oe) => _t(K.pairKey, K.value, "lowerPercent", oe)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: r("Upper (%)") }),
              /* @__PURE__ */ e.jsx(
                nt,
                {
                  step: "0.1",
                  value: A.upperPercent,
                  disabled: ne || Ie !== null || Ue !== null,
                  onValueChange: (oe) => _t(K.pairKey, K.value, "upperPercent", oe)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: ne || Ie !== null || Ue !== null || $.error !== null,
                onClick: () => void gr(C),
                children: r(Ue === K.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          $.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: r($.error) }) : /* @__PURE__ */ e.jsx("small", { children: r("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(Ce, zo).toLocaleString(),
            sweep: Math.min(Ce, Ko).toLocaleString()
          }) }),
          z && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: z.values.map((oe) => /* @__PURE__ */ e.jsx("div", { className: oe.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            is,
            {
              title: `${oe.isCurrent ? `${r("Current")} · ` : ""}${(oe.value * 100).toFixed(2)}%`,
              panel: oe.preview.compensated,
              preview: oe.preview,
              sourceLabel: K.source.label,
              receiverLabel: K.receiver.label,
              minimumSize: 145,
              maximumSize: 220,
              densitySmoothing: Sn
            }
          ) }, `${K.pairKey}:bounds:${oe.value}:${oe.isCurrent}`)) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: r(y.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: r("No coefficient selected.") })
    ] });
  }, Ls = (a, p, w = ct) => /* @__PURE__ */ e.jsx(
    Vc,
    {
      dataset: p,
      pair: a,
      plotSize: w,
      densitySmoothing: Sn,
      flagged: qn.has(a.pairKey),
      selected: ie === a.pairKey,
      onSelect: () => {
        X(null), ee(a.pairKey), ds(!0);
      },
      onFlag: (C) => ut(a.pairKey, C)
    },
    a.pairKey
  ), jr = async (a, p) => {
    if (!(pe != null && pe.ready) || !y)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const w = Ni.map((C) => ({
      pairKey: C.pairKey,
      sourceLabel: C.source.label,
      receiverLabel: C.receiver.label,
      coefficient: C.coefficient,
      relationship: C.interaction,
      buildPreview: () => {
        const A = ra(
          pe.dataset,
          C.source.key,
          C.receiver.key
        );
        if (!A.ready) throw new Error(A.reason);
        return A.preview;
      }
    }));
    await Ol(w, {
      sampleName: t,
      profileName: (S == null ? void 0 : S.name) ?? r(y.title),
      populationName: (de == null ? void 0 : de.name) ?? r("All Events"),
      filterLabel: Ci,
      densitySmoothing: Sn,
      densityColorPower: R,
      pointAlpha: Pt,
      pointSize: Ot
    }, a, p);
  };
  return B ? /* @__PURE__ */ e.jsx(ii.Provider, { value: R, children: /* @__PURE__ */ e.jsx(oi.Provider, { value: Pt, children: /* @__PURE__ */ e.jsx(ai.Provider, { value: Ot, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab gl-plotting-workspace gl-comp-workspace",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-plotting-head gl-comp-head gl-comp-overview${be === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsxs("h2", { className: "gl-tab-title", children: [
              r("Compensation"),
              /* @__PURE__ */ e.jsx(Or, { intro: le })
            ] }),
            !D && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: Kt })
          ] }),
          D ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${J.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: r("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: zt,
                method: Kt,
                count: $s,
                status: r(J.state === "ready" ? "Ready" : "Unavailable"),
                assay: r(s ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${J.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  r("{kind} compensation installed. Installed compensation profile.", {
                    kind: D.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                (() => {
                  const a = W == null ? void 0 : W.rows.find(({ profile: p }) => (p == null ? void 0 : p.profileId) === D.profileId);
                  return a ? /* @__PURE__ */ e.jsx(ya, { row: a }) : null;
                })(),
                /* @__PURE__ */ e.jsx("strong", { children: nr }),
                /* @__PURE__ */ e.jsx("span", { children: r("{method} · {count} ch · {status}", {
                  method: Kt,
                  count: $s,
                  status: J.state === "ready" ? r("Ready") : r("Unavailable")
                }) }),
                /* @__PURE__ */ e.jsx("em", { children: r(s ? "Comp active" : "Original active") })
              ]
            }
          ) : /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "gl-comp-summary",
              "aria-label": r("Compensation summary"),
              "data-active-layer": s ? "compensated" : "original",
              children: r("{source} · {assay} · {count} channels", {
                source: r($i),
                assay: r(s ? "Compensated assay active" : "Original assay active"),
                count: $s
              })
            }
          ),
          D && n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: ne,
              onClick: Rs,
              children: r("Replace matrix…")
            }
          ),
          D && c && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-header-remove", children: [
            m && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: We,
                  disabled: ne || Tt,
                  onChange: (a) => hn(a.currentTarget.checked)
                }
              ),
              /* @__PURE__ */ e.jsx("span", { children: r("Recompute existing gate memberships in original coordinates.") })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: ne || Tt,
                title: r("Every file returns to the original assay. The matrix and its versions stay in the Matrices list, to be used again or deleted there."),
                onClick: () => void mr(),
                children: r(Tt ? "Removing…" : "Remove the matrix")
              }
            )
          ] }),
          tr && /* @__PURE__ */ e.jsx(_r, { intro: le, className: "gl-comp-global-layer-note", children: r("Assay selection in the top bar applies to every tab.") })
        ] }),
        /* @__PURE__ */ e.jsxs("aside", { className: `gl-plotting-inspector gl-comp-inspector-left section-${ri}`, "aria-label": r("Compensation controls"), children: [
          /* @__PURE__ */ e.jsx("nav", { className: "gl-presentation-tabs", "aria-label": r("Compensation settings"), children: Yc.map(({ id: a, label: p }) => /* @__PURE__ */ e.jsx("button", { type: "button", "aria-pressed": ri === a, onClick: () => Fa(a), children: r(p) }, a)) }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-section gl-comp-pane-matrices", children: [
            W && /* @__PURE__ */ e.jsx(
              Kc,
              {
                ...W,
                ...n.instrument === "cytof" ? { chooseImport: Rs } : {},
                onEditStarted: (a) => {
                  cn("matrix"), $e(!1), he(r("Editing {name}: type a percentage in the matrix, or select a pair to see its plots. Apply revised matrix compensates every file with the changes.", { name: a }));
                }
              }
            ),
            n.instrument === "flow" && !D && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Edit coefficients") }),
              H && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-enable-heading", children: [
                /* @__PURE__ */ e.jsxs("p", { className: "gl-comp-pane-line", children: [
                  /* @__PURE__ */ e.jsx("span", { id: "comp-flow-enable-heading", children: r(V ? "SCE spillover matrix" : "Embedded FCS matrix") }),
                  /* @__PURE__ */ e.jsx(
                    Us,
                    {
                      label: r("About editing this matrix"),
                      text: r("Install this exact matrix as the immutable baseline to edit coefficients and preview their effect.")
                    }
                  )
                ] }),
                Re != null && Re.error ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-problem", children: [
                  /* @__PURE__ */ e.jsx("span", { title: Re.error, children: r("Not editable: {reason}", {
                    reason: Zc(Re.validation).map((a) => r(a)).join(", ")
                  }) }),
                  /* @__PURE__ */ e.jsxs("details", { children: [
                    /* @__PURE__ */ e.jsx(Dr, { children: r("Details") }),
                    /* @__PURE__ */ e.jsx("p", { children: Re.error })
                  ] })
                ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  m && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: We,
                        disabled: ne,
                        onChange: (a) => hn(a.currentTarget.checked)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { children: r("Recompute existing gate memberships in compensated coordinates.") })
                  ] }),
                  l.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-hint gl-comp-embedded-others", children: r("Enabling also returns {count} other files to Original: {files}. A workspace keeps one kind of compensation, and these draw from their own embedded matrix.", {
                    count: l.length,
                    files: l.join(", ")
                  }) }),
                  ne ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
                    je ? r("Preparing editor… {percent}%", { percent: Math.round(je.fraction * 100) }) : r("Preparing editor…"),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: (je == null ? void 0 : je.phase) === "cancelling",
                        onClick: d,
                        children: r((je == null ? void 0 : je.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                      }
                    )
                  ] }) : /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-btn",
                      disabled: !o || m && !We,
                      onClick: () => void pr(),
                      children: r("Enable matrix editing")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-empty-heading", children: [
                /* @__PURE__ */ e.jsxs("p", { className: "gl-comp-pane-line", children: [
                  /* @__PURE__ */ e.jsx("span", { id: "comp-flow-empty-heading", children: r("Empty matrix") }),
                  /* @__PURE__ */ e.jsx(
                    Us,
                    {
                      label: r("About the empty matrix"),
                      text: r("Start from an identity matrix over the file's fluorescence channels, every spillover at zero, and set the coefficients by hand.")
                    }
                  )
                ] }),
                m && (!H || !!(Re != null && Re.error)) && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: We,
                      disabled: ne,
                      onChange: (a) => hn(a.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: r("Recompute existing gate memberships in compensated coordinates.") })
                ] }),
                ne ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-flow-enable-progress", role: "status", children: r("Preparing editor…") }) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: !o || m && !We,
                    onClick: () => void hr(),
                    children: r("Start from an empty matrix")
                  }
                )
              ] })
            ] }),
            D && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Edit coefficients") }),
              !(y && Object.keys(ue).length > 0) && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-pane-line", children: r("Select a pair in the matrix to change its coefficient.") }),
              y && Object.keys(ue).length > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                xr(),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
                  /* @__PURE__ */ e.jsxs("span", { children: [
                    r("{count} pending edits", { count: Object.keys(ue).length }),
                    (S == null ? void 0 : S.scientific.kind) === "cytof-spillover" ? ` · ${r("{files} checked FCS files", { files: Nn })}` : ""
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: ne,
                      onClick: () => {
                        Mt({}), Tn({}), bs(!1), he(null);
                      },
                      children: r("Discard")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-btn",
                      disabled: ne || !xs || Ie !== null || Ue !== null || !o || (S == null ? void 0 : S.scientific.kind) === "cytof-spillover" && Nn === 0,
                      onClick: () => void yr(),
                      children: r("Apply revised matrix")
                    }
                  )
                ] })
              ] })
            ] }),
            n.instrument === "cytof" && !D && /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: r("Choose a CyTOF spillover matrix in the main panel.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-section gl-comp-pane-review", children: [
            /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsxs("h3", { children: [
                r("Review scope"),
                /* @__PURE__ */ e.jsx(Us, { label: r("About the review scope"), text: r("The population and the events the biplots, the attention ranking and the sweeps are drawn from. Membership is frozen from the current assay; Apply always uses every event.") })
              ] }),
              /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-review-population", children: [
                /* @__PURE__ */ e.jsx("span", { children: r("Review population") }),
                /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": r("Compensation review population"),
                    value: (de == null ? void 0 : de.id) ?? "all",
                    disabled: Ie !== null || Ue !== null,
                    onChange: (a) => hs(a.currentTarget.value),
                    children: [
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: r("All Events") }),
                      P.map((a) => /* @__PURE__ */ e.jsx("option", { value: a.id, children: `${"· ".repeat(a.depth)}${a.name} (${a.eventCount.toLocaleString()})` }, a.id))
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsx("small", { title: r("{count} events · applies to biplots, attention ranking, and sweeps; membership frozen from the current assay", {
                  count: Ce.toLocaleString()
                }), children: r("{count} events", { count: Ce.toLocaleString() }) })
              ] }),
              be !== "global" && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-preview-events", children: [
                /* @__PURE__ */ e.jsx("span", { children: r("Pair preview") }),
                /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": r("Compensation pair preview event count"),
                    value: String(Rt),
                    disabled: ne,
                    onChange: (a) => {
                      const p = a.currentTarget.value;
                      Ia(p === "all" ? "all" : Number(p));
                    },
                    children: [
                      Bo.map((a) => /* @__PURE__ */ e.jsx("option", { value: a, children: r("{count} events", { count: a.toLocaleString() }) }, a)),
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: r("All available") })
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsx("small", { title: r("Controls the frozen event set shown in the selected-pair Original and comparison biplots. Applying compensation still processes every event."), children: r("Showing {shown} of {total}; Apply always uses all events.", {
                  shown: rt.length.toLocaleString(),
                  total: Ce.toLocaleString()
                }) })
              ] })
            ] }),
            x !== void 0 && M !== void 0 && k && /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Apply") }),
              x !== void 0 && M !== void 0 && k && /* @__PURE__ */ e.jsxs(
                "label",
                {
                  className: "gl-comp-worker-control",
                  title: r("Event-parallel Apply workers. The aggregate memory budget stays fixed; more workers are not always faster."),
                  children: [
                    /* @__PURE__ */ e.jsx("span", { children: r("Apply workers") }),
                    /* @__PURE__ */ e.jsx(
                      "select",
                      {
                        "aria-label": r("Compensation Apply worker count"),
                        value: x,
                        disabled: ne,
                        onChange: (a) => k(Number(a.currentTarget.value)),
                        children: Array.from({ length: M }, (a, p) => p + 1).map((a) => /* @__PURE__ */ e.jsx("option", { value: a, children: a }, a))
                      }
                    ),
                    /* @__PURE__ */ e.jsxs("small", { children: [
                      "/ ",
                      M
                    ] })
                  ]
                }
              )
            ] }),
            (y || D) && /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Tools") }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: Qc.map(({ id: a, label: p }) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  id: `comp-drawer-${a}-button`,
                  className: "gl-comp-drawer-toggle",
                  "aria-expanded": O[a],
                  "aria-controls": `comp-drawer-${a}`,
                  onClick: () => or(a),
                  children: [
                    /* @__PURE__ */ e.jsxs("span", { children: [
                      r(p),
                      a === "review" && Dt.length > 0 ? ` (${Dt.length})` : ""
                    ] }),
                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ e.jsx(Hi, { open: O[a], size: 12 }) })
                  ]
                },
                a
              )) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-pane-section gl-comp-pane-display", children: y ? /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: r("Biplot display") }),
            /* @__PURE__ */ e.jsxs(
              "label",
              {
                className: "gl-comp-density-smoothing",
                title: r("Blur radius for every compensation biplot; both assay layers always use the same setting"),
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: r("Density smooth") }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "range",
                      min: "1",
                      max: "10",
                      step: "1",
                      value: Sn,
                      "aria-label": r("Compensation biplot density smoothing"),
                      onChange: (a) => Ma(Number(a.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: Sn })
                ]
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "label",
              {
                className: "gl-comp-point-alpha",
                title: r("Point opacity for every compensation biplot"),
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: r("Point alpha") }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "range",
                      min: "0.1",
                      max: "1",
                      step: "0.05",
                      value: Pt,
                      "aria-label": r("Compensation biplot point alpha"),
                      onChange: (a) => Ea(Number(a.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: Pt.toFixed(2) })
                ]
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "label",
              {
                className: "gl-comp-point-alpha",
                title: r("Point size for every compensation biplot, as a factor on the size each panel's width gives"),
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: r("Point size") }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "range",
                      min: "0.3",
                      max: "3",
                      step: "0.1",
                      value: Ot,
                      "aria-label": r("Compensation biplot point size"),
                      onChange: (a) => Aa(Number(a.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("output", { children: [
                    Ot.toFixed(1),
                    "×"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              Kr,
              {
                className: "gl-comp-density-colour",
                value: R,
                onChange: U
              }
            )
          ] }) : /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: r("The biplot settings apply once a matrix is shown.") }) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-prop-body gl-comp-body", children: [
          y && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-workspace-tabs", role: "tablist", "aria-label": r("Compensation workspace"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": be === "matrix",
                className: be === "matrix" ? "active" : void 0,
                onClick: () => {
                  X(null), cn("matrix");
                },
                children: r("Matrix")
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": be === "global",
                className: be === "global" ? "active" : void 0,
                onClick: () => {
                  X(null), cn("global");
                },
                children: r("Global inspector")
              }
            ),
            y.kind === "cytof" && /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": be === "screen",
                className: be === "screen" ? "active" : void 0,
                onClick: () => {
                  X(null), cn("screen");
                },
                children: [
                  r("Check"),
                  $n.result && Ai > 0 ? ` (${Ai})` : ""
                ]
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": be === "attention",
                className: be === "attention" ? "active" : void 0,
                onClick: () => {
                  X(null), cn("attention");
                },
                children: [
                  r("Flagged"),
                  ye.length > 0 ? ` (${ye.length})` : ""
                ]
              }
            )
          ] }),
          n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "input",
            {
              ref: bi,
              type: "file",
              accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
              className: "gl-sr-only",
              "aria-label": r("Choose CyTOF spillover matrix"),
              onChange: (a) => void lr(a)
            }
          ),
          pi && /* @__PURE__ */ e.jsx("div", { className: fi ? "gl-comp-error" : "gl-comp-status", role: fi ? "alert" : "status", children: r(pi) }),
          n.instrument === "cytof" && (!D || me) && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-cytof-import", "aria-labelledby": "comp-cytof-import-heading", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-import-head", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("h3", { id: "comp-cytof-import-heading", children: r("CyTOF spillover matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: r("Linear counts → non-negative least squares → arcsinh display") })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-import-actions", children: /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: me ? "gl-btn-ghost" : "gl-btn",
                  disabled: ne,
                  onClick: Rs,
                  children: r(me ? "Choose another matrix…" : "Import matrix…")
                }
              ) })
            ] }),
            gi && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: r(gi) }),
            me && Se && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-body", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-summary", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("strong", { children: me.fileName }),
                  /* @__PURE__ */ e.jsx("span", { children: r("{sources} sources × {receivers} receivers", {
                    sources: me.matrix.sourceChannels.length,
                    receivers: me.matrix.receiverChannels.length
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("dl", { children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Exact matches") }),
                    /* @__PURE__ */ e.jsx("dd", { children: Se.matchedChannels.length })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Included") }),
                    /* @__PURE__ */ e.jsx("dd", { children: Se.includedChannels.length })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Not in FCS") }),
                    /* @__PURE__ */ e.jsx("dd", { children: Se.matrixOnlyChannels.length })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-channel-head", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("h4", { children: r("Channels included in NNLS") }),
                  /* @__PURE__ */ e.jsx("span", { children: r("Exact, case-sensitive $PnN matching; unchecked channels pass through unchanged.") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: ne,
                      onClick: () => wn(new Set(Se.matchedChannels)),
                      children: r("All matched")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: ne,
                      title: r("Include only the matched channels that carry a marker name, leaving out those named by their isotope alone (such as 131Xe or 133Cs) or not named at all"),
                      onClick: () => wn(new Set(Se.matchedChannels.filter((a) => zr(sd(n, a), a)))),
                      children: r("Named only")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: ne,
                      onClick: () => wn(/* @__PURE__ */ new Set()),
                      children: r("None")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-channel-grid", children: me.matrix.receiverChannels.map((a) => {
                const p = Se.matchedChannels.includes(a);
                return /* @__PURE__ */ e.jsxs("label", { className: p ? "" : "is-unavailable", title: p ? a : r("{channel} is not uniquely present in this FCS file", { channel: a }), children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: at.has(a),
                      disabled: !p || ne,
                      onChange: (w) => cr(a, w.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: Zt(n, a).combined }),
                  !p && /* @__PURE__ */ e.jsx("small", { children: r("not matched") })
                ] }, a);
              }) }),
              (me.validationWarnings.length > 0 || Se.warnings.length > 0) && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: /* @__PURE__ */ e.jsx("span", { children: r("{count} review items: {messages}", {
                count: me.validationWarnings.length + Se.warnings.length,
                messages: [
                  ...me.validationWarnings.map(({ message: a }) => a),
                  ...Se.warnings.map(({ message: a }) => a)
                ].map((a) => r(a)).join(" ")
              }) }) }),
              Se.blockers.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: Se.blockers.map(({ message: a }) => r(a)).join(" ") }),
              m && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: We,
                    disabled: ne,
                    onChange: (a) => hn(a.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: r("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                  /* @__PURE__ */ e.jsx("span", { children: ne ? je ? r("{phase}… {percent}% ({processed} / {total} events)", {
                    phase: r(je.phase === "cancelling" ? "Cancelling" : je.phase === "preparing" ? "Preparing" : "Applying"),
                    percent: Math.round(je.fraction * 100),
                    processed: je.processedEvents.toLocaleString(),
                    total: je.totalEvents.toLocaleString()
                  }) : r("Preparing compensation…") : r("The Original assay is retained and can be restored at any time.") }),
                  /* @__PURE__ */ e.jsx("strong", { className: Nn === 0 ? "is-empty" : void 0, children: Nn === 0 ? r("No FCS files are checked. Select at least one file in Samples.") : r("Applies atomically to {files} checked FCS files · {events} total events", {
                    files: Nn,
                    events: Xa.toLocaleString()
                  }) })
                ] }),
                ne ? /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (je == null ? void 0 : je.phase) === "cancelling",
                    onClick: d,
                    children: r((je == null ? void 0 : je.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                ) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn",
                    disabled: !o || Nn === 0 || !Se.canApply || m && !We,
                    onClick: () => void dr(),
                    children: r("Apply NNLS compensation")
                  }
                )
              ] }),
              u.length > 0 && h && /* @__PURE__ */ e.jsxs(
                "div",
                {
                  className: "gl-comp-adopt-existing",
                  "aria-labelledby": "comp-adopt-existing-heading",
                  children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-adopt-copy", children: [
                      /* @__PURE__ */ e.jsx("strong", { id: "comp-adopt-existing-heading", children: r("Use an existing SCE assay") }),
                      /* @__PURE__ */ e.jsx("span", { children: r("Records this matrix against data already computed in R. GateLabR will not recompute or overwrite the selected assay.") })
                    ] }),
                    /* @__PURE__ */ e.jsxs("label", { children: [
                      /* @__PURE__ */ e.jsx("span", { children: r("Existing linear assay") }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          value: (Cn == null ? void 0 : Cn.id) ?? "",
                          disabled: ne,
                          onChange: (a) => {
                            xi(a.currentTarget.value), Ft(!1);
                          },
                          children: u.map((a) => /* @__PURE__ */ e.jsx("option", { value: a.id, children: a.label === a.id ? a.id : `${a.label} (${a.id})` }, a.id))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-adopt-confirm", children: [
                      /* @__PURE__ */ e.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: ys,
                          disabled: ne,
                          onChange: (a) => Ft(a.currentTarget.checked)
                        }
                      ),
                      /* @__PURE__ */ e.jsx("span", { children: r("I confirm this assay was computed from the selected source assay using this exact matrix and channel set.") })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: ne || !Cn || !ys || Nn === 0 || !Se.canApply || m && !We,
                        onClick: () => void ur(),
                        children: r("Use existing assay — no recomputation")
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          Ii && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: r("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
          Fi.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
            /* @__PURE__ */ e.jsx("span", { children: r("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
              count: Fi.length
            }) }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => te((a) => ({ ...a, review: !0 })), children: r("Review details") })
          ] }),
          D && J.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: r("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
          y && be === "matrix" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: In,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: Ss ? `minmax(440px, 1fr) 8px ${ge}px` : "minmax(0, 1fr)" },
              children: [
                /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrix-panel", "aria-labelledby": "comp-matrix-heading", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-matrix-head", children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("h3", { id: "comp-matrix-heading", children: r(y.title) }),
                      /* @__PURE__ */ e.jsx("span", { children: r(y.subtitle) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-head-actions", children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-size", role: "group", "aria-label": r("Matrix size"), children: [
                        /* @__PURE__ */ e.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            "aria-pressed": js === "fit",
                            title: r("Fit the whole matrix to the panel; where the cells are too small for their values they show colour alone, and each names its value on hover"),
                            onClick: () => ji("fit"),
                            children: r("Fit")
                          }
                        ),
                        /* @__PURE__ */ e.jsx(
                          "input",
                          {
                            type: "range",
                            min: mt.least,
                            max: mt.largest,
                            step: 1,
                            value: an,
                            "aria-label": r("Cell size"),
                            title: r("Cell size: {size} px", { size: an }),
                            onChange: (a) => ji(Number(a.currentTarget.value))
                          }
                        )
                      ] }),
                      ht && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-inline-edit-note", children: r("Edit cells directly (%)") }),
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-legend", "aria-label": r("Matrix colour key"), children: [
                        /* @__PURE__ */ e.jsxs("span", { children: [
                          /* @__PURE__ */ e.jsx("i", { className: "is-diagonal", "aria-hidden": "true" }),
                          r("Diagonal (self)")
                        ] }),
                        /* @__PURE__ */ e.jsxs("span", { children: [
                          /* @__PURE__ */ e.jsx("i", { className: "is-positive", "aria-hidden": "true" }),
                          r("Positive spill")
                        ] }),
                        /* @__PURE__ */ e.jsxs("span", { children: [
                          /* @__PURE__ */ e.jsx("i", { className: "is-negative", "aria-hidden": "true" }),
                          r("Negative")
                        ] })
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => hi(!0),
                          children: r("Export CSV…")
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-scroll", ref: Ha, children: /* @__PURE__ */ e.jsxs(
                    "div",
                    {
                      className: `gl-comp-matrix-stage${ht ? " is-flow-inline" : ""}${ir ? "" : " is-values-hidden"}`,
                      style: {
                        width: 18 + pt.rowLabelWidth + y.receiverAxisKeys.length * an + pt.overhang,
                        "--gl-comp-row-label-w": `${pt.rowLabelWidth}px`,
                        "--gl-comp-col-label-w": `${pt.columnLabelWidth}px`,
                        "--gl-comp-col-label-h": `${pt.columnLabelHeight}px`
                      },
                      children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-axis gl-comp-matrix-receiver-axis", children: r("Receiver channels →") }),
                        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-body", children: [
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-axis gl-comp-matrix-source-axis", children: r("Source channels ↓") }),
                          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-labelled", children: [
                            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-corner", "aria-hidden": "true", children: "%" }),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                className: "gl-comp-column-labels",
                                "aria-label": r("Receiver channel labels"),
                                style: {
                                  gridTemplateColumns: `repeat(${y.receiverAxisKeys.length}, ${an}px)`
                                },
                                children: Me.map((a, p) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (K == null ? void 0 : K.receiverIndex) === p ? "is-selected" : void 0,
                                    title: a.combined,
                                    children: /* @__PURE__ */ e.jsx("span", { children: a.combined })
                                  },
                                  y.receiverAxisKeys[p]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                className: "gl-comp-row-labels",
                                "aria-label": r("Source channel labels"),
                                style: {
                                  gridTemplateRows: `repeat(${y.sourceAxisKeys.length}, ${an}px)`
                                },
                                children: we.map((a, p) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (K == null ? void 0 : K.sourceIndex) === p ? "is-selected" : void 0,
                                    title: a.combined,
                                    children: a.combined
                                  },
                                  y.sourceAxisKeys[p]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                ref: yi,
                                className: "gl-comp-matrix shows-values",
                                role: "grid",
                                "aria-label": r("Compensation matrix; source rows and receiver columns"),
                                "aria-rowcount": y.sourceAxisKeys.length,
                                "aria-colcount": y.receiverAxisKeys.length,
                                style: {
                                  gridTemplateColumns: `repeat(${y.receiverAxisKeys.length}, ${an}px)`,
                                  gridTemplateRows: `repeat(${y.sourceAxisKeys.length}, ${an}px)`
                                },
                                children: y.matrix.map((a, p) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    role: "row",
                                    className: "gl-comp-matrix-row",
                                    "aria-rowindex": p + 1,
                                    children: a.map((w, C) => {
                                      const A = y.sourceAxisKeys[p], $ = y.receiverAxisKeys[C], z = `${A}${De}${$}`, Y = ue[z], Z = Y ?? w, se = A === $, ae = (K == null ? void 0 : K.sourceIndex) === p && K.receiverIndex === C, fe = (K == null ? void 0 : K.sourceIndex) === p, fn = (K == null ? void 0 : K.receiverIndex) === C, en = we[p], rn = Me[C], gn = y.kind === "cytof" ? tt(A, $) : null, Ln = Zo(
                                        Z,
                                        Li,
                                        se
                                      ), Hn = y.receiverAxisKeys.findIndex((Ae) => Ae !== A), Xn = ie === z, ft = ie === null && p === 0 && C === Hn, Yn = Number.isFinite(Z) ? Z === 0 ? "" : (Z * 100).toFixed(1) : String(Z), Mn = gn && gn !== "other" && gn !== "self" ? ` · ${gn}` : "", Vt = Ka[z] ?? qo(Z);
                                      return ht && !se ? /* @__PURE__ */ e.jsx(
                                        nt,
                                        {
                                          role: "gridcell",
                                          className: `gl-comp-cell gl-comp-cell-input${ae ? " selected" : ""}${Xn ? " is-pinned" : ""}${Y === void 0 ? "" : " is-staged"}${fe ? " is-selected-source" : ""}${fn ? " is-selected-receiver" : ""}`,
                                          min: "0",
                                          step: "0.1",
                                          value: Vt,
                                          disabled: ne,
                                          "data-source-index": p,
                                          "data-receiver-index": C,
                                          "aria-colindex": C + 1,
                                          "aria-selected": Xn,
                                          "aria-label": r("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                            source: en.combined,
                                            receiver: rn.combined,
                                            pending: Y === void 0 ? "" : r(", pending edit")
                                          }),
                                          title: r("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                            source: en.combined,
                                            receiver: rn.combined,
                                            pending: Y === void 0 ? "" : r(" · pending edit")
                                          }),
                                          style: Ln,
                                          onFocus: () => ee(z),
                                          onMouseEnter: () => X(z),
                                          onMouseLeave: () => X((Ae) => Ae === z ? null : Ae),
                                          onClick: () => ee(z),
                                          onValueChange: (Ae) => {
                                            ee(z), Tn((oe) => ({ ...oe, [z]: Ae })), Ae.trim() !== "" && Number.isFinite(Number(Ae)) && Rn(z, Number(Ae) / 100);
                                          },
                                          onBlur: (Ae) => {
                                            const oe = Ae.currentTarget.value;
                                            if (oe.trim() === "" || !Number.isFinite(Number(oe))) {
                                              Tn((vn) => {
                                                const Vi = { ...vn };
                                                return delete Vi[z], Vi;
                                              });
                                              return;
                                            }
                                            Tn((vn) => ({
                                              ...vn,
                                              [z]: qo(Number(oe) / 100)
                                            }));
                                          }
                                        },
                                        $
                                      ) : /* @__PURE__ */ e.jsx(
                                        "button",
                                        {
                                          type: "button",
                                          role: "gridcell",
                                          className: `gl-comp-cell${se ? " diagonal" : ""}${ae ? " selected" : ""}${Xn ? " is-pinned" : ""}${Y === void 0 ? "" : " is-staged"}${fe ? " is-selected-source" : ""}${fn ? " is-selected-receiver" : ""}`,
                                          disabled: se,
                                          tabIndex: se ? -1 : ae || ft ? 0 : -1,
                                          "data-source-index": p,
                                          "data-receiver-index": C,
                                          "data-interaction": gn ?? void 0,
                                          "aria-colindex": C + 1,
                                          "aria-pressed": se ? void 0 : Xn,
                                          "aria-label": se ? r("{channel} diagonal: {value}", { channel: en.combined, value: Te(Z) }) : r("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                            source: en.combined,
                                            receiver: rn.combined,
                                            value: Te(Z),
                                            pending: Y === void 0 ? "" : r(" (pending edit)"),
                                            interaction: Mn
                                          }),
                                          title: se ? `${en.combined} · self · ${Te(Z)}` : `${en.combined} → ${rn.combined} · ${Te(Z)}${Y === void 0 ? "" : " · pending edit"}${Mn}`,
                                          style: Ln,
                                          onFocus: () => {
                                            se || ee(z);
                                          },
                                          onMouseEnter: () => {
                                            se || X(z);
                                          },
                                          onMouseLeave: () => X((Ae) => Ae === z ? null : Ae),
                                          onClick: () => ee(z),
                                          onKeyDown: (Ae) => fr(Ae, p, C),
                                          children: /* @__PURE__ */ e.jsx("span", { children: Yn })
                                        },
                                        $
                                      );
                                    })
                                  },
                                  y.sourceAxisKeys[p]
                                ))
                              }
                            )
                          ] })
                        ] })
                      ]
                    }
                  ) })
                ] }),
                Ss && Ut(),
                Ss && Bt(() => {
                  X(null), ee(null);
                })
              ]
            }
          ) : y && be === "global" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: In,
              className: `gl-comp-common-path gl-comp-global-path${it ? " has-details" : ""}`,
              style: {
                gridTemplateColumns: it ? `minmax(440px, 1fr) 8px ${ge}px` : "minmax(0, 1fr)"
              },
              children: [
                /* @__PURE__ */ e.jsx(
                  Wc,
                  {
                    stateKey: q,
                    header: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-head-title", children: [
                        /* @__PURE__ */ e.jsx("h3", { id: "comp-global-inspector-heading", children: r("Global data inspector") }),
                        /* @__PURE__ */ e.jsx(
                          "span",
                          {
                            className: "gl-comp-lock-pill",
                            title: r("The assay flip keeps the same events, axes, transform, density bins, colour scale, and tile geometry."),
                            children: r("View locked")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          "aria-label": r("Global compensation pair filter"),
                          title: r("Choose which channel pairs appear"),
                          value: tn,
                          onChange: (a) => Ct(a.currentTarget.value),
                          children: [
                            /* @__PURE__ */ e.jsx("option", { value: "relevant", children: r("Matrix-linked / relevant") }),
                            /* @__PURE__ */ e.jsx("option", { value: "nonzero", children: r("Non-zero coefficients") }),
                            y.kind === "cytof" && /* @__PURE__ */ e.jsx("option", { value: "physical", children: r("Physical CyTOF relationships") }),
                            /* @__PURE__ */ e.jsx("option", { value: "flagged", children: r("Flagged for follow-up") }),
                            /* @__PURE__ */ e.jsx("option", { value: "all", children: r("All included pairs") })
                          ]
                        }
                      ),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          className: "gl-comp-global-layout",
                          "aria-label": r("Global compensation plot layout"),
                          title: r("Show one compressed gallery or organise channel pairs into labelled rows"),
                          value: Oe,
                          onChange: (a) => ja(a.currentTarget.value),
                          children: [
                            /* @__PURE__ */ e.jsx("option", { value: "matrix", children: r("Matrix: sources down, receivers across") }),
                            /* @__PURE__ */ e.jsx("option", { value: "compact", children: r("Compact gallery") }),
                            /* @__PURE__ */ e.jsx("option", { value: "source", children: r("Rows by source") }),
                            /* @__PURE__ */ e.jsx("option", { value: "receiver", children: r("Rows by receiver") })
                          ]
                        }
                      ),
                      /* @__PURE__ */ e.jsx(
                        "input",
                        {
                          className: "gl-comp-global-search",
                          type: "search",
                          value: st,
                          placeholder: r("Find channel…"),
                          "aria-label": r("Search global compensation pairs"),
                          onChange: (a) => li(a.currentTarget.value)
                        }
                      ),
                      /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-global-size", children: [
                        /* @__PURE__ */ e.jsx("span", { className: "gl-sr-only", children: r("Plot size") }),
                        /* @__PURE__ */ e.jsx(
                          "input",
                          {
                            type: "range",
                            min: "120",
                            max: "220",
                            step: "4",
                            value: ct,
                            "aria-label": r("Global compensation plot size"),
                            onChange: (a) => Ca(Number(a.currentTarget.value))
                          }
                        ),
                        /* @__PURE__ */ e.jsx("output", { children: r("{size}px", { size: ct }) })
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn gl-comp-global-export",
                          disabled: !(pe != null && pe.ready) || Ge.length === 0,
                          title: r("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                          onClick: () => mi(!0),
                          children: r("Export…")
                        }
                      ),
                      /* @__PURE__ */ e.jsx(
                        "span",
                        {
                          className: "gl-comp-global-count",
                          title: r("The Global gallery uses one fixed representative event set so every pair and both assay layers remain directly comparable."),
                          children: r("{pairs} pairs · {shown} / {total} events · {population}", {
                            pairs: Ge.length.toLocaleString(),
                            shown: Cs.length.toLocaleString(),
                            total: Ce.toLocaleString(),
                            population: (de == null ? void 0 : de.name) ?? r("All Events")
                          })
                        }
                      )
                    ] }),
                    children: pe ? pe.ready ? Ge.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: r("No pairs match the current filter. Choose another filter or clear the channel search.") }) : Oe === "compact" ? /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-gallery",
                        "data-event-signature": pe.dataset.eventSignature,
                        children: Ge.map((a) => Ls(a, pe.dataset))
                      }
                    ) : Oe === "matrix" && y ? /* @__PURE__ */ e.jsxs(
                      "div",
                      {
                        ref: Si,
                        className: "gl-comp-global-matrix",
                        "data-event-signature": pe.dataset.eventSignature,
                        "data-tile-size": Es,
                        role: "grid",
                        "aria-label": r("Compensation pairs arranged as the matrix"),
                        style: { gridTemplateColumns: `92px repeat(${y.receiverChannels.length}, ${Es}px)` },
                        children: [
                          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-corner", children: [
                            /* @__PURE__ */ e.jsx("span", { children: r("Source ↓") }),
                            /* @__PURE__ */ e.jsx("span", { children: r("Receiver →") })
                          ] }),
                          y.receiverChannels.map((a, p) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-col", title: a.combined, children: [
                            /* @__PURE__ */ e.jsx("strong", { children: a.label }),
                            /* @__PURE__ */ e.jsx("small", { children: a.pnn })
                          ] }, `col-${p}`)),
                          y.sourceChannels.map((a, p) => /* @__PURE__ */ e.jsxs(F.Fragment, { children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-row", title: a.combined, children: [
                              /* @__PURE__ */ e.jsx("strong", { children: a.label }),
                              /* @__PURE__ */ e.jsx("small", { children: a.pnn })
                            ] }),
                            y.receiverChannels.map((w, C) => {
                              const A = Ya.get(`${p}:${C}`);
                              if (A) return Ls(A, pe.dataset, Es);
                              const $ = y.sourceAxisKeys[p] === y.receiverAxisKeys[C];
                              return /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  className: `gl-comp-global-matrix-blank${$ ? " is-diagonal" : ""}`,
                                  title: $ ? r("{channel} into itself", { channel: a.label }) : r("{source} into {receiver}: not shown under the current filter", { source: a.label, receiver: w.label }),
                                  children: $ ? /* @__PURE__ */ e.jsx("span", { children: a.label }) : null
                                },
                                `${p}:${C}`
                              );
                            })
                          ] }, `row-${p}`))
                        ]
                      }
                    ) : /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-groups",
                        "data-event-signature": pe.dataset.eventSignature,
                        "data-layout": Oe,
                        children: ks.map((a) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                          /* @__PURE__ */ e.jsxs("header", { children: [
                            /* @__PURE__ */ e.jsx("span", { children: r(Oe === "source" ? "Source channel" : "Receiver") }),
                            /* @__PURE__ */ e.jsx("strong", { title: a.channel.combined, children: a.channel.label }),
                            /* @__PURE__ */ e.jsx("small", { children: a.channel.pnn }),
                            /* @__PURE__ */ e.jsx("em", { children: r("{count} pairs", { count: a.pairs.length }) })
                          ] }),
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: a.pairs.map((p) => Ls(p, pe.dataset)) })
                        ] }, a.channel.key))
                      }
                    ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: r(pe.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: r("No matrix is available for the global inspector.") })
                  }
                ),
                it && Ut(),
                it && Bt(() => ds(!1), !0)
              ]
            }
          ) : y && be === "screen" && y.kind === "cytof" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: In,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${ge}px` },
              children: [
                /* @__PURE__ */ e.jsx(
                  El,
                  {
                    state: $n,
                    channelLabel: (a) => Zt(n, a).label,
                    populationName: (de == null ? void 0 : de.name) ?? null,
                    selected: ie ? { source: ie.split(De)[0], receiver: ie.split(De)[1] } : null,
                    onSelect: (a, p) => {
                      X(null), ee(`${a}${De}${p}`);
                    },
                    isStaged: (a, p) => ue[`${a}${De}${p}`] !== void 0,
                    canStage: !!S && !ne,
                    onStage: (a) => {
                      for (const p of a) Rn(`${p.source}${De}${p.receiver}`, p.value);
                    },
                    onRunAgain: () => Da((a) => a + 1)
                  }
                ),
                Ut(),
                Bt()
              ]
            }
          ) : y ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: In,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${ge}px` },
              children: [
                /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-attention gl-comp-attention-panel", "aria-labelledby": "comp-attention-heading", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-head", children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("h3", { id: "comp-attention-heading", children: r("Flagged pairs") }),
                      /* @__PURE__ */ e.jsx("p", { children: r(y.kind === "cytof" ? "This is your follow-up queue. Every pair is read against the events in Check; flag a pair here to run exact sweeps, which change one coefficient at a time across four user-bounded values using the same frozen events." : "This is your follow-up queue. Suggestions are a population-scoped evidence screen, not a verdict and not automatically included. Exact sweeps change one coefficient at a time across four user-bounded values using the same frozen events.") })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-actions", children: [
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: r("Sweep workers") }),
                        /* @__PURE__ */ e.jsx(
                          "select",
                          {
                            "aria-label": r("Compensation sweep workers"),
                            value: ms,
                            disabled: Ie !== null || Ue !== null,
                            onChange: (a) => ps(Number(a.currentTarget.value)),
                            children: Array.from({ length: Vo }, (a, p) => p + 1).map((a) => /* @__PURE__ */ e.jsx("option", { value: a, children: a }, a))
                          }
                        )
                      ] }),
                      Ie ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: br, children: r("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-btn",
                          disabled: !S || !_ || on.length === 0 || As > 0 || ne || Ue !== null,
                          onClick: () => void vr(),
                          children: r("Run four-value sweeps ({count})", { count: on.length })
                        }
                      )
                    ] })
                  ] }),
                  y.kind !== "cytof" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-scope", children: [
                    /* @__PURE__ */ e.jsx("span", { children: r("Suggestions computed for {population} from up to {count} frozen events.", {
                      population: (de == null ? void 0 : de.name) ?? r("All Events"),
                      count: Math.min(Ce, lt.length).toLocaleString()
                    }) }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-evidence-mode", children: [
                      /* @__PURE__ */ e.jsx("span", { children: r("Evidence mode") }),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          "aria-label": r("Compensation evidence mode"),
                          value: dn,
                          disabled: ne || Ie !== null || Ue !== null,
                          onChange: (a) => {
                            Ra(a.currentTarget.value), gs((p) => p + 1), yn({}), Fn({}), Ke(null);
                          },
                          children: [
                            /* @__PURE__ */ e.jsx("option", { value: "biological", children: r("Biological sample (conservative)") }),
                            /* @__PURE__ */ e.jsx("option", { value: "control", children: r("Single-stain / control") })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-mini-btn",
                        disabled: ne || Ie !== null || Ue !== null,
                        onClick: () => {
                          gs((a) => a + 1), yn({}), Fn({}), Ke(null), $e(!1), he(
                            r(ye.length === 1 ? "Recomputed compensation suggestions for {population}. {count} flagged pair was retained." : "Recomputed compensation suggestions for {population}. {count} flagged pairs were retained.", {
                              population: (de == null ? void 0 : de.name) ?? r("All Events"),
                              count: ye.length
                            })
                          );
                        },
                        children: r("Recompute suggestions")
                      }
                    ),
                    /* @__PURE__ */ e.jsxs("small", { children: [
                      r(dn === "biological" ? "Broad positive association is excluded because co-expression and cell size can mimic spill. High-tail shapes remain control-sensitive review prompts." : "Positive residual association may enter the shortlist only because you declared suitable control data."),
                      " ",
                      r("Sweep workers are separate from full-Apply workers.")
                    ] })
                  ] }),
                  y.kind === "cytof" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-scope", children: /* @__PURE__ */ e.jsx("small", { children: r("Sweep workers are separate from full-Apply workers.") }) }),
                  Ie && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-progress", role: "status", "aria-live": "polite", children: [
                    /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, Ie.total), value: Ie.completed }),
                    /* @__PURE__ */ e.jsx("span", { children: r("{completed} / {total} exact candidate solves · {workers} workers", {
                      completed: Ie.completed,
                      total: Ie.total,
                      workers: ms
                    }) })
                  ] }),
                  ui && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: r(ui) }),
                  S ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": r("Add compensation pair for follow-up"), children: [
                      /* @__PURE__ */ e.jsx("strong", { children: r("Add a pair") }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: r("Source channel") }),
                        /* @__PURE__ */ e.jsx(
                          Xi,
                          {
                            label: r("Follow-up source channel"),
                            value: Ye,
                            options: y.sourceAxisKeys.flatMap((a, p) => ke.has(a) ? [{ value: a, label: we[p].combined }] : []),
                            onChange: (a) => {
                              di(a), Ve === a && fs(y.receiverAxisKeys.find((p) => p !== a && ke.has(p)) ?? "");
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: r("Receiver") }),
                        /* @__PURE__ */ e.jsx(
                          Xi,
                          {
                            label: r("Follow-up receiver channel"),
                            value: Ve,
                            options: y.receiverAxisKeys.flatMap((a, p) => a !== Ye && ke.has(a) ? [{ value: a, label: Me[p].combined }] : []),
                            onChange: fs
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !Ye || !Ve || Ye === Ve,
                          onClick: Za,
                          children: r("Flag for follow-up")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flagged-columns", children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsx("h4", { children: r("Flagged by you ({count})", { count: on.length }) }),
                          /* @__PURE__ */ e.jsx("span", { children: r("Only these pairs are included when you run sweeps.") })
                        ] }) }),
                        on.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: r("No pairs are flagged yet. Tick “Flag for follow-up” in the inspector, add a pair above, or accept a suggestion below.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-list", children: on.map((a, p) => {
                          const w = za[a.pairKey], C = Ba === a.pairKey, A = dt(a.pairKey, a.coefficient), $ = Ts(a.pairKey, a.coefficient);
                          return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${ie === a.pairKey ? " is-selected" : ""}`, children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                              /* @__PURE__ */ e.jsxs(
                                "button",
                                {
                                  type: "button",
                                  className: "gl-comp-sweep-pair-head",
                                  "aria-expanded": C,
                                  onClick: () => {
                                    ee(a.pairKey), ot(C ? null : a.pairKey);
                                  },
                                  children: [
                                    /* @__PURE__ */ e.jsx("span", { className: "gl-comp-sweep-rank", children: p + 1 }),
                                    /* @__PURE__ */ e.jsxs("span", { children: [
                                      /* @__PURE__ */ e.jsxs("strong", { children: [
                                        a.source.label,
                                        " → ",
                                        a.receiver.label
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("small", { children: [
                                        a.interaction && a.interaction !== "other" ? `${a.interaction} · ` : "",
                                        r("installed {value}%", { value: (a.coefficient * 100).toFixed(1) })
                                      ] })
                                    ] }),
                                    /* @__PURE__ */ e.jsx("span", { children: a.evidence.status === "ready" ? r("shift {shift} MAD · slope {slope}", {
                                      shift: ve(a.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: ve(a.evidence.residualSlope ?? 0, 4)
                                    }) : r("visual review · residual groups insufficient") }),
                                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ e.jsx(Hi, { open: C, size: 12 }) })
                                  ]
                                }
                              ),
                              /* @__PURE__ */ e.jsx("label", { className: "gl-comp-followup-list-toggle", title: r("Remove from follow-up queue"), children: /* @__PURE__ */ e.jsx(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: !0,
                                  "aria-label": r("Flag {source} to {receiver} for follow-up", {
                                    source: a.source.label,
                                    receiver: a.receiver.label
                                  }),
                                  onChange: (z) => ut(a.pairKey, z.currentTarget.checked)
                                }
                              ) })
                            ] }),
                            C && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-body", children: [
                              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inline-bounds", children: [
                                /* @__PURE__ */ e.jsx("span", { children: r("Four values across") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  r("Lower (%)"),
                                  /* @__PURE__ */ e.jsx(nt, { step: "0.1", value: $.lowerPercent, disabled: ne || Ie !== null || Ue !== null, onValueChange: (z) => _t(a.pairKey, a.coefficient, "lowerPercent", z) })
                                ] }),
                                /* @__PURE__ */ e.jsx("span", { children: r("to") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  r("Upper (%)"),
                                  /* @__PURE__ */ e.jsx(nt, { step: "0.1", value: $.upperPercent, disabled: ne || Ie !== null || Ue !== null, onValueChange: (z) => _t(a.pairKey, a.coefficient, "upperPercent", z) })
                                ] }),
                                A.error && /* @__PURE__ */ e.jsx("small", { children: r(A.error) })
                              ] }),
                              w ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: w.values.map((z) => /* @__PURE__ */ e.jsxs(
                                "div",
                                {
                                  className: `gl-comp-sweep-value${z.isCurrent ? " is-current" : ""}${ue[a.pairKey] === z.value ? " is-staged" : ""}`,
                                  children: [
                                    /* @__PURE__ */ e.jsx(
                                      is,
                                      {
                                        title: `${z.isCurrent ? `${r("Current")} · ` : ""}${(z.value * 100).toFixed(2)}%`,
                                        panel: z.preview.compensated,
                                        preview: z.preview,
                                        sourceLabel: a.source.label,
                                        receiverLabel: a.receiver.label,
                                        minimumSize: 150,
                                        maximumSize: 230,
                                        densitySmoothing: Sn
                                      }
                                    ),
                                    /* @__PURE__ */ e.jsxs("dl", { children: [
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: r("Shift") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: r("{value} MAD", { value: ve(z.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: r("Slope") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: ve(z.preview.evidence.residualSlope ?? 0, 4) })
                                      ] }),
                                      y.kind === "cytof" && /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: r("Receiver zero") }),
                                        /* @__PURE__ */ e.jsxs("dd", { children: [
                                          (z.preview.compensated.zeroPile.receiver / Math.max(1, z.preview.eventCount) * 100).toFixed(1),
                                          "%"
                                        ] })
                                      ] })
                                    ] }),
                                    /* @__PURE__ */ e.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        className: "gl-mini-btn",
                                        disabled: ne || z.isCurrent,
                                        onClick: () => Rn(a.pairKey, z.value),
                                        children: r(z.isCurrent ? "Installed" : ue[a.pairKey] === z.value ? "Staged" : "Use this value")
                                      }
                                    )
                                  ]
                                },
                                `${a.pairKey}:${z.value}:${z.isCurrent}`
                              )) }) : /* @__PURE__ */ e.jsx("p", { children: r("Set or fast-preview the endpoints in the inspector, then run the four-value exact sweep. Panels use the same events and locked axes.") })
                            ] })
                          ] }, a.pairKey);
                        }) })
                      ] }),
                      y.kind !== "cytof" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section gl-comp-suggestions", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsxs("h4", { children: [
                            r(dn === "biological" ? "Conservative suggestions" : "Control-data suggestions"),
                            " (",
                            qe.items.length,
                            ")"
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { children: r("{evaluable} evaluable of {screened} screened pairs for {population}. Inspect before flagging.", {
                            evaluable: qe.evaluableCount.toLocaleString(),
                            screened: qe.screenedCount.toLocaleString(),
                            population: (de == null ? void 0 : de.name) ?? r("All Events")
                          }) })
                        ] }) }),
                        qe.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: r("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: qe.items.map((a) => {
                          const p = qs(a, y.kind, dn);
                          return /* @__PURE__ */ e.jsxs("article", { className: qn.has(a.pairKey) ? "is-flagged" : void 0, children: [
                            /* @__PURE__ */ e.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => ee(a.pairKey),
                                children: [
                                  /* @__PURE__ */ e.jsxs("strong", { children: [
                                    a.source.label,
                                    " → ",
                                    a.receiver.label
                                  ] }),
                                  /* @__PURE__ */ e.jsx("em", { className: `gl-comp-suggestion-badge is-${p.category}`, children: r(p.label) }),
                                  /* @__PURE__ */ e.jsxs("span", { children: [
                                    a.interaction && a.interaction !== "other" ? `${a.interaction} · ` : "",
                                    r("{coefficient}% · shift {shift} MAD · slope {slope}", {
                                      coefficient: (a.coefficient * 100).toFixed(1),
                                      shift: ve(a.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: ve(a.evidence.residualSlope ?? 0, 4)
                                    })
                                  ] })
                                ]
                              }
                            ),
                            /* @__PURE__ */ e.jsxs("label", { children: [
                              /* @__PURE__ */ e.jsx(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: qn.has(a.pairKey),
                                  "aria-label": r("Flag suggested {source} to {receiver} for follow-up", {
                                    source: a.source.label,
                                    receiver: a.receiver.label
                                  }),
                                  onChange: (w) => ut(a.pairKey, w.currentTarget.checked)
                                }
                              ),
                              /* @__PURE__ */ e.jsx("span", { children: r("Follow up") })
                            ] })
                          ] }, a.pairKey);
                        }) })
                      ] })
                    ] })
                  ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: r("Install a profile-derived compensation layer before curating or sweeping pairs. The embedded FCS matrix remains inspectable in the Matrix view.") })
                ] }),
                Ut(),
                Bt()
              ]
            }
          ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: r(D ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : n.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
          (y || D) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": r("Advanced compensation tools"), children: [
            O.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Matrix evidence") }),
              D ? S ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-evidence-grid", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Profile ID") }),
                    /* @__PURE__ */ e.jsx("dd", { children: S.profileId })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Created") }),
                    /* @__PURE__ */ e.jsx("dd", { children: new Date(S.createdAt).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Matrix source") }),
                    /* @__PURE__ */ e.jsx("dd", { children: hd(S, r) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Orientation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: r("Source rows → receiver columns") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Imported dimensions") }),
                    /* @__PURE__ */ e.jsx("dd", { children: r("{sources} sources × {receivers} receivers", {
                      sources: S.scientific.matrix.sourceChannels.length,
                      receivers: S.scientific.matrix.receiverChannels.length
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Applied solve") }),
                    /* @__PURE__ */ e.jsx("dd", { children: r("{count} exact $PnN channels · {status}", {
                      count: D.includedPnns.length,
                      status: J.state
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Matrix hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: S.matrixHash, children: [
                      S.matrixHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Profile hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: S.profileHash, children: [
                      S.profileHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Provenance") }),
                    /* @__PURE__ */ e.jsx("dd", { children: r(((Ui = S.provenance) == null ? void 0 : Ui.sourceDescription) ?? "No additional source note supplied") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Estimation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: r(((Bi = S.provenance) == null ? void 0 : Bi.estimationMethod) ?? "Imported coefficients preserved exactly") })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-method-card", "aria-label": r("Installed compensation method"), children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: r("Pipeline") }),
                    /* @__PURE__ */ e.jsx("strong", { children: r(S.scientific.kind === "cytof-spillover" ? "Original counts → NNLS → Compensated counts → arcsinh display" : "Original values → linear matrix inverse → Compensated values → display transform") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: r("Solver") }),
                    /* @__PURE__ */ e.jsx("strong", { children: S.scientific.solverVersion }),
                    /* @__PURE__ */ e.jsx("small", { children: S.scientific.solverSettings.map(({ key: a, value: p }) => `${a}=${String(p)}`).join(" · ") })
                  ] })
                ] }),
                Je && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": r("Original versus Compensated preview"), children: [
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { children: r("Original → Compensated impact") }),
                    /* @__PURE__ */ e.jsx("span", { children: r("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                      events: Je.previewEvents.toLocaleString(),
                      channels: D.includedPnns.length
                    }) })
                  ] }) }),
                  /* @__PURE__ */ e.jsxs("dl", { children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: r("Values changed") }),
                      /* @__PURE__ */ e.jsxs("dd", { children: [
                        Je.changedValues.toLocaleString(),
                        " / ",
                        Je.comparedValues.toLocaleString(),
                        " (",
                        Te(Je.changedValues / Je.comparedValues, !1, 4),
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: r("Median |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: ve(Je.medianAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: r("Maximum |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: ve(Je.maxAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: r("Largest median shift") }),
                      /* @__PURE__ */ e.jsxs("dd", { title: Je.mostChangedChannel, children: [
                        Je.mostChangedChannel,
                        " · ",
                        ve(Je.mostChangedChannelMedianDelta, 5)
                      ] })
                    ] }),
                    D.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: r("Negative → zero") }),
                      /* @__PURE__ */ e.jsx("dd", { children: r("{count} preview values", { count: Je.zeroedNegativeValues.toLocaleString() }) })
                    ] })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ e.jsx("p", { children: r("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
                profile: D.profileId,
                method: Kt,
                count: D.includedPnns.length,
                status: J.state
              }) }) : /* @__PURE__ */ e.jsx("p", { children: r("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
                channels: H.channels.length,
                warnings: Is.length || r("no")
              }) })
            ] }),
            O.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Review queue") }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: r("Matrix integrity") }),
                Dt.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: Dt.map((a) => /* @__PURE__ */ e.jsx("li", { children: r(a) }, a)) }) : /* @__PURE__ */ e.jsx("p", { children: r("No matrix-level items currently require review.") })
              ] }),
              J.state === "ready" && y && y.kind !== "cytof" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: r("Residual-evidence shortlist") }),
                /* @__PURE__ */ e.jsx("p", { children: r("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                  screened: qe.screenedCount.toLocaleString(),
                  candidateSuffix: qe.candidateCount > qe.screenedCount ? r(" of {count}", { count: qe.candidateCount.toLocaleString() }) : "",
                  zeroSuffix: "",
                  modeNote: r(dn === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
                }) }),
                qe.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: qe.items.map((a) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => Di(a.sourceIndex, a.receiverIndex),
                    children: [
                      /* @__PURE__ */ e.jsxs("span", { children: [
                        /* @__PURE__ */ e.jsxs("strong", { children: [
                          a.source.label,
                          " → ",
                          a.receiver.label
                        ] }),
                        /* @__PURE__ */ e.jsxs("small", { children: [
                          a.interaction && a.interaction !== "other" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                            a.interaction,
                            " · "
                          ] }) : null,
                          r("matrix {value}%", { value: (a.coefficient * 100).toFixed(1) })
                        ] })
                      ] }),
                      /* @__PURE__ */ e.jsxs("span", { children: [
                        r("shift {shift} MAD · slope {slope}", {
                          shift: ve(a.evidence.normalizedNegativeShift ?? 0, 3),
                          slope: ve(a.evidence.residualSlope ?? 0, 4)
                        }),
                        y.kind === "cytof" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                          " ",
                          r("· zero Δ {value} pp", { value: `${a.evidence.receiverZeroDeltaFraction >= 0 ? "+" : ""}${(a.evidence.receiverZeroDeltaFraction * 100).toFixed(1)}` })
                        ] }) : null
                      ] })
                    ]
                  },
                  a.pairKey
                )) }) : /* @__PURE__ */ e.jsx("p", { children: r("No pair had enough source-high, source-low, and receiver-negative events for this conservative screen. Visual inspection remains available from the matrix.") })
              ] })
            ] })
          ] }),
          Va && y && /* @__PURE__ */ e.jsx(
            da,
            {
              profileLabel: (S == null ? void 0 : S.name) ?? (V ? "SCE_spillover" : "embedded_FCS"),
              installedLabel: r(
                S ? "Installed matrix" : V ? "SCE spillover matrix" : "Embedded FCS matrix"
              ),
              installedMatrix: {
                sourceChannels: y.sourceAxisKeys,
                receiverChannels: y.receiverAxisKeys,
                matrix: y.matrix
              },
              workingMatrix: Ja,
              pendingEditCount: Object.keys(ue).length,
              onClose: () => hi(!1)
            }
          ),
          Wa && /* @__PURE__ */ e.jsx(
            Dl,
            {
              sampleName: t,
              populationName: (de == null ? void 0 : de.name) ?? r("All Events"),
              filterLabel: Ci,
              pairCount: Ni.length,
              onExport: jr,
              onClose: () => mi(!1)
            }
          )
        ] })
      ]
    }
  ) }) }) }) : /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab",
      style: { display: "none" },
      "aria-hidden": "true",
      "data-compensation-dormant": "true"
    }
  );
}
function fd(n, t) {
  const i = n.visible !== !1, s = t.visible !== !1;
  return i || s ? !1 : n.sample === t.sample && n.stateKey === t.stateKey;
}
const vd = F.memo(pd, fd);
export {
  vd as CompensationTab
};
