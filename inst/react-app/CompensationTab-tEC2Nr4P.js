import { D as Jt, r as ur, l as hr, s as pr, z as mr, f as gr, u as Ue, a as N, j as e, b as ge, c as se, p as nn, v as ct, d as fr, e as xr, g as vr, S as Ds, h as br, i as zt, k as zs, F as _s, m as yr, n as jr, o as wr, C as Nr, q as Cr } from "./embed-B89EMwZT.js";
function Gt(t) {
  const i = t.trim().normalize("NFC"), r = i.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (r)
    return { element: r[1], mass: Number(r[2]) };
  const o = i.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return o ? { element: o[2], mass: Number(o[1]) } : null;
}
function Us(t) {
  return t.map((i, r) => ({ channel: i, index: r, isotope: Gt(i) })).sort((i, r) => i.isotope && r.isotope ? i.isotope.mass - r.isotope.mass || i.isotope.element.localeCompare(r.isotope.element) || i.index - r.index : i.isotope ? -1 : r.isotope ? 1 : i.index - r.index).map(({ index: i }) => i);
}
function Sr(t) {
  const i = Us(t.sourceChannels), r = Us(t.receiverChannels);
  return {
    sourceChannels: i.map((o) => t.sourceChannels[o]),
    receiverChannels: r.map((o) => t.receiverChannels[o]),
    matrix: i.map(
      (o) => r.map((l) => t.matrix[o][l])
    )
  };
}
function kn(t, i) {
  if (t === i) return "self";
  const r = Gt(t), o = Gt(i);
  if (!r || !o) return "other";
  const l = o.mass - r.mass;
  return r.element === o.element ? l === -1 ? "M-1" : l === 1 ? "M+1" : "same-element" : l === -1 ? "M-1" : l === 1 ? "M+1" : l === 16 ? "oxide (+16)" : "other";
}
function dt(t, i) {
  const r = t.index(i);
  if (r !== void 0) return r;
  const o = t.channels.findIndex((l) => l.pnn === i);
  return o < 0 ? void 0 : o;
}
function hn(t, i, r) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(i) || i <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (r && r.length !== t)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const o = r ? r.reduce((m, S) => m + (S ? 1 : 0), 0) : t, l = Math.min(o, i), h = new Uint32Array(l);
  if (l === 0) return h;
  if (!r) {
    if (l === 1) return h;
    for (let m = 0; m < l; m++)
      h[m] = Math.floor(m * (t - 1) / (l - 1));
    return h;
  }
  const p = Array.from({ length: l }, (m, S) => l === 1 ? 0 : Math.floor(S * (o - 1) / (l - 1)));
  let x = 0, v = 0;
  for (let m = 0; m < t && v < l; m++)
    r[m] && (x === p[v] && (h[v++] = m), x++);
  return h;
}
function gn(t, i) {
  if (t.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (t.length - 1), o = Math.floor(r), l = Math.ceil(r);
  return o === l ? t[o] : t[o] + (t[l] - t[o]) * (r - o);
}
function ut(t) {
  const i = t.filter(Number.isFinite).sort((h, p) => h - p);
  if (i.length === 0) return [-1, 1];
  let r = gn(i, 2e-3), o = gn(i, 0.998);
  if (!(o > r)) {
    const h = Number.isFinite(r) ? r : 0, p = Math.max(1, Math.abs(h) * 0.05);
    return [h - p, h + p];
  }
  const l = (o - r) * 0.035;
  return r -= l, o += l, [r, o];
}
function _e(t) {
  if (t.length === 0) return Number.NaN;
  const i = [...t].sort((r, o) => r - o);
  return gn(i, 0.5);
}
function ht(t) {
  if (t.length === 0) return Number.NaN;
  const i = _e(t), r = _e(t.map((p) => Math.abs(p - i))) * 1.4826;
  if (Number.isFinite(r) && r > 0) return r;
  const o = t.reduce((p, x) => p + x, 0) / t.length, l = t.reduce((p, x) => p + (x - o) ** 2, 0) / Math.max(1, t.length - 1), h = Math.sqrt(l);
  return Number.isFinite(h) && h > 0 ? h : 1e-12;
}
function Wt(t, i, r = 12) {
  if (t.length !== i.length || t.length < r * 8) return null;
  const o = Array.from({ length: t.length }, (x, v) => v).sort((x, v) => t[x] - t[v]), l = [];
  for (let x = 0; x < r; x++) {
    const v = Math.floor(x * o.length / r), m = Math.floor((x + 1) * o.length / r), S = o.slice(v, m);
    if (S.length < 8) continue;
    const $ = _e(S.map((C) => t[C])), T = _e(S.map((C) => i[C]));
    Number.isFinite($) && Number.isFinite(T) && l.push({ x: $, y: T });
  }
  const h = [];
  for (let x = 0; x < l.length; x++)
    for (let v = x + 1; v < l.length; v++) {
      const m = l[v].x - l[x].x;
      if (m === 0) continue;
      const S = (l[v].y - l[x].y) / m;
      Number.isFinite(S) && h.push(S);
    }
  const p = _e(h);
  return Number.isFinite(p) ? p : null;
}
function Mr(t, i) {
  if (t.length !== i.length || t.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const r = Array.from({ length: t.length }, (A, R) => R).filter((A) => Number.isFinite(t[A]) && Number.isFinite(i[A])).sort((A, R) => t[A] - t[R]);
  if (r.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const o = Math.max(96, Math.floor(r.length * 0.8)), l = Math.min(r.length - 24, Math.floor(r.length * 0.9)), h = r.slice(0, o), p = r.slice(l);
  if (h.length < 96 || p.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const x = h.map((A) => t[A]), v = h.map((A) => i[A]), m = Wt(x, v, 10);
  if (m === null) return { excessMad: null, slopeDeltaMad: null };
  const S = _e(h.map((A) => i[A] - m * t[A])), $ = h.map((A) => i[A] - (S + m * t[A])), T = Math.max(
    ht($),
    ht(v) * 0.05,
    1e-12
  ), C = p.map((A) => i[A] - (S + m * t[A])).sort((A, R) => A - R), k = gn(C, 0.75) / T, P = r.slice(Math.floor(r.length * 0.75)), I = P.map((A) => t[A]), M = P.map((A) => i[A]), E = Wt(I, M, 4), F = gn(I, 0.9) - gn(I, 0.1), w = E === null || !(F > 0) ? null : (E - m) * F / T;
  return {
    excessMad: Number.isFinite(k) ? k : null,
    slopeDeltaMad: Number.isFinite(w) ? w : null
  };
}
function pi(t, i, r, o, l, h) {
  const p = r.length, x = Mr(r, o), v = Math.min(50, Math.max(12, Math.floor(p * 0.01))), m = (V = 0, s = 0, q = 0) => ({
    status: "insufficient",
    sourceLowEvents: V,
    sourceHighEvents: s,
    destinationNegativeEvents: q,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: x.excessMad,
    upperTailSlopeDeltaMad: x.slopeDeltaMad,
    receiverZeroDeltaFraction: p > 0 ? (h - l) / p : 0
  });
  if (p < v * 3) return m();
  const S = [...r].sort((V, s) => V - s), $ = gn(S, 0.25), T = r.flatMap((V, s) => V <= $ ? [s] : []);
  if (T.length < v) return m(T.length);
  const C = T.map((V) => r[V]), k = _e(C), P = ht(C);
  let I = r.flatMap((V, s) => V >= k + 3 * P ? [s] : []);
  if (I.length < v && (I = Array.from({ length: p }, (V, s) => s).sort((V, s) => r[s] - r[V]).slice(0, v)), I.length < v) return m(T.length, I.length);
  const M = T.map((V) => o[V]), E = _e(M), F = ht(M), w = E + 5 * F, A = o.flatMap((V, s) => V <= w ? [s] : []), R = new Set(A), L = T.filter((V) => R.has(V)), O = I.filter((V) => R.has(V));
  if (L.length < v || O.length < v)
    return m(T.length, I.length, A.length);
  const _ = (_e(O.map((V) => o[V])) - _e(L.map((V) => o[V]))) / F, W = A.map((V) => t[V]), H = A.map((V) => i[V]);
  return {
    status: "ready",
    sourceLowEvents: T.length,
    sourceHighEvents: I.length,
    destinationNegativeEvents: A.length,
    normalizedNegativeShift: Number.isFinite(_) ? _ : null,
    residualSlope: Wt(W, H),
    upperTailExcessMad: x.excessMad,
    upperTailSlopeDeltaMad: x.slopeDeltaMad,
    receiverZeroDeltaFraction: p > 0 ? (h - l) / p : 0
  };
}
function pt(t, i, r, o, l, h) {
  let p = 0, x = 0, v = 0;
  for (let m = 0; m < r.length; m++) {
    const S = Math.abs(r[m]) <= 1e-12, $ = Math.abs(o[m]) <= 1e-12;
    S && p++, $ && x++, S && $ && v++;
  }
  return {
    x: t.map((m) => Math.max(l[0], Math.min(l[1], m))),
    y: i.map((m) => Math.max(h[0], Math.min(h[1], m))),
    zeroPile: Object.freeze({
      source: p,
      receiver: x,
      corner: v
    })
  };
}
function _t(t, i, r, o = {}) {
  var V;
  if (t.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation to compare Original and Compensated data." };
  const h = dt(t, i), p = dt(t, r);
  if (h === void 0 || p === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (t.fcs.nEvents === 0)
    return { ready: !1, reason: "This sample contains no events." };
  const x = ((V = o.fixedEventIndices) == null ? void 0 : V.slice()) ?? hn(
    t.fcs.nEvents,
    o.maxEvents ?? 15e3,
    o.eventMask
  );
  for (const s of x)
    if (s >= t.fcs.nEvents || o.eventMask && !o.eventMask[s])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const v = t.channels[h].key, m = t.channels[p].key, S = t.originalColumnData(h), $ = t.originalColumnData(p), T = t.compensatedColumnData(h), C = t.compensatedColumnData(p), k = [], P = [], I = [], M = [], E = [], F = [], w = [], A = [];
  for (const s of x) {
    const q = t.rawToDisplay(v, S[s]), Fe = t.rawToDisplay(m, $[s]), D = t.rawToDisplay(v, T[s]), j = t.rawToDisplay(m, C[s]);
    [q, Fe, D, j].every(Number.isFinite) && (k.push(q), P.push(Fe), I.push(S[s]), M.push($[s]), E.push(D), F.push(j), w.push(T[s]), A.push(C[s]));
  }
  const R = ut([...k, ...E]), L = ut([...P, ...F]), O = t.channelTicks(h, [R[0], R[1]]), _ = t.channelTicks(p, [L[0], L[1]]), W = pt(
    k,
    P,
    I,
    M,
    R,
    L
  ), H = pt(
    E,
    F,
    w,
    A,
    R,
    L
  );
  return {
    ready: !0,
    preview: {
      eventCount: k.length,
      totalEvents: o.eventMask ? o.eligibleEventCount ?? o.eventMask.reduce((s, q) => s + (q ? 1 : 0), 0) : t.fcs.nEvents,
      xRange: R,
      yRange: L,
      xTicks: O,
      yTicks: _,
      original: W,
      compensated: H,
      evidence: pi(
        w,
        A,
        E,
        F,
        W.zeroPile.receiver,
        H.zeroPile.receiver
      )
    }
  };
}
function Ut(t, i, r, o, l, h, p = {}) {
  const x = dt(t, i), v = dt(t, r);
  if (x === void 0 || v === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (l.length !== o.length || h.length !== o.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const m = t.channels[x].key, S = t.channels[v].key, $ = t.originalColumnData(x), T = t.originalColumnData(v), C = [], k = [], P = [], I = [], M = [], E = [], F = [], w = [];
  for (let H = 0; H < o.length; H++) {
    const V = o[H];
    if (V >= t.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const s = $[V], q = T[V], Fe = l[H], D = h[H], j = t.rawToDisplay(m, s), ee = t.rawToDisplay(S, q), pe = t.rawToDisplay(m, Fe), fn = t.rawToDisplay(S, D);
    [s, q, Fe, D, j, ee, pe, fn].every(Number.isFinite) && (C.push(j), k.push(ee), P.push(s), I.push(q), M.push(pe), E.push(fn), F.push(Fe), w.push(D));
  }
  const A = p.xRange ?? ut([...C, ...M]), R = p.yRange ?? ut([...k, ...E]), L = t.channelTicks(x, [A[0], A[1]]), O = t.channelTicks(v, [R[0], R[1]]), _ = pt(C, k, P, I, A, R), W = pt(M, E, F, w, A, R);
  return {
    ready: !0,
    preview: {
      eventCount: C.length,
      totalEvents: p.totalEvents ?? t.fcs.nEvents,
      xRange: A,
      yRange: R,
      xTicks: L,
      yTicks: O,
      original: _,
      compensated: W,
      evidence: pi(
        F,
        w,
        M,
        E,
        _.zeroPile.receiver,
        W.zeroPile.receiver
      )
    }
  };
}
const Bs = 0.5, kr = 0.01, Er = 1e-4, Ar = 0.05, Tr = 3, Fr = 1, $r = 5;
function mi(t, i) {
  const r = t.evidence.normalizedNegativeShift ?? 0, o = t.evidence.residualSlope ?? 0, l = Math.max(0, t.evidence.upperTailExcessMad ?? 0), h = Math.max(0, t.evidence.upperTailSlopeDeltaMad ?? 0), p = Math.abs(t.coefficient), x = Math.max(
    Er,
    p * Ar
  );
  return {
    negativeShift: Math.max(0, -r),
    negativeSlope: Math.max(0, -o),
    zeroDelta: i === "cytof" ? Math.max(0, t.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, r),
    positiveSlope: Math.max(0, o),
    upperTailExcess: l,
    upperTailSlopeDelta: h,
    hasNegativeShift: r <= -Bs,
    hasNegativeSlope: o <= -x,
    hasNewZeroPile: i === "cytof" && t.evidence.receiverZeroDeltaFraction >= kr,
    hasPositiveShift: r >= Bs,
    hasPositiveSlope: o >= x,
    hasHighTailCurve: l >= Tr && (h >= Fr || l >= $r)
  };
}
function Pr(t) {
  return Number(t.hasNegativeShift) + Number(t.hasNegativeSlope) + Number(t.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : t.hasNewZeroPile ? "new-zero-pile" : t.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function Zt(t, i, r = "biological") {
  const o = mi(t, i), l = o.hasNegativeShift || o.hasNegativeSlope || o.hasNewZeroPile, h = o.hasPositiveShift || o.hasPositiveSlope, p = o.hasHighTailCurve || r === "control" && h;
  return l && p ? {
    category: "mixed-evidence",
    label: "Mixed evidence · inspect",
    detail: "Positive and negative residual signals disagree. Inspect the matched plots and use a suitable control before changing the coefficient.",
    reason: "mixed-residual-signals",
    automaticFollowup: !0
  } : l ? {
    category: "overcompensation-like",
    label: "Overcompensation-like",
    detail: "A negative receiver shift, negative residual slope, or new NNLS zero pile is present. This is a review prompt, not an automatic coefficient verdict.",
    reason: Pr(o),
    automaticFollowup: !0
  } : o.hasHighTailCurve ? r === "control" ? {
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
    automaticFollowup: t.physicalPrior > 0
  } : h ? r === "control" ? {
    category: "undercompensation-like",
    label: "Undercompensation-like · control",
    detail: "Positive source-associated residual signal is present. This interpretation is valid only because control-data mode was selected.",
    reason: Number(o.hasPositiveShift) + Number(o.hasPositiveSlope) > 1 ? "multiple-undercompensation-signals" : "positive-residual-control",
    automaticFollowup: !0
  } : {
    category: "positive-association-only",
    label: "Positive association only · control required",
    detail: "Positive association alone is not treated as spill in a biological sample; co-expression and cell size can produce the same pattern.",
    reason: null,
    automaticFollowup: !1
  } : t.evidence.status !== "ready" ? {
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
function en(t, i) {
  if (!Number.isFinite(t) || t <= 0) return 0;
  const r = i.filter((l) => Number.isFinite(l) && l > 0).sort((l, h) => l - h);
  if (r.length === 0) return 0;
  let o = 0;
  for (const l of r)
    if (l <= t) o++;
    else break;
  return o / r.length;
}
function Ir(t, i, r = "biological") {
  const o = t.map((k) => ({
    ...mi(k, i),
    coefficient: Math.abs(k.coefficient)
  })), l = (k) => o.map((P) => typeof P[k] == "number" ? P[k] : 0), h = l("negativeShift"), p = l("negativeSlope"), x = l("zeroDelta"), v = l("positiveShift"), m = l("positiveSlope"), S = l("upperTailExcess"), $ = l("upperTailSlopeDelta"), T = l("coefficient"), C = t.flatMap((k, P) => {
    const I = Zt(k, i, r);
    if (!I.automaticFollowup || I.reason === null) return [];
    const M = o[P], E = 0.22 * en(M.negativeShift, h) + 0.13 * en(M.negativeSlope, p) + 0.14 * en(M.zeroDelta, x) + (r === "control" ? 0.13 * en(M.positiveShift, v) : 0) + (r === "control" ? 0.08 * en(M.positiveSlope, m) : 0) + 0.12 * en(M.upperTailExcess, S) + 0.08 * en(M.upperTailSlopeDelta, $) + 0.05 * en(M.coefficient, T) + 0.05 * Math.max(0, Math.min(1, k.physicalPrior));
    return [{
      index: P,
      relativePriority: E,
      reason: I.reason,
      category: I.category
    }];
  });
  return Object.freeze(C.sort((k, P) => P.relativePriority - k.relativePriority || k.index - P.index));
}
function Rr(t, i) {
  const r = t.index(i);
  if (r !== void 0) return r;
  const o = t.channels.findIndex((l) => l.pnn === i);
  return o < 0 ? void 0 : o;
}
function Ht(t, i) {
  if (t.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (t.length - 1), o = Math.floor(r), l = Math.ceil(r);
  return o === l ? t[o] : t[o] + (t[l] - t[o]) * (r - o);
}
function Kr(t) {
  const i = t.filter(Number.isFinite).sort((h, p) => h - p);
  if (i.length === 0) return [-1, 1];
  let r = Ht(i, 2e-3), o = Ht(i, 0.998);
  if (!(o > r)) {
    const h = Number.isFinite(r) ? r : 0, p = Math.max(1, Math.abs(h) * 0.05);
    return [h - p, h + p];
  }
  const l = (o - r) * 0.035;
  return r -= l, o += l, [r, o];
}
function Lr(t) {
  if (t.length === 0) return "0:empty";
  let i = 2166136261;
  for (const r of t)
    i ^= r, i = Math.imul(i, 16777619) >>> 0;
  return `${t.length}:${t[0]}:${t[t.length - 1]}:${i.toString(16)}`;
}
function Or(t, i, r = {}) {
  var x;
  if (t.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const l = ((x = r.fixedEventIndices) == null ? void 0 : x.slice()) ?? hn(
    t.fcs.nEvents,
    r.maxEvents ?? 2500,
    r.eventMask
  );
  for (const v of l)
    if (v >= t.fcs.nEvents || r.eventMask && !r.eventMask[v])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const h = /* @__PURE__ */ new Map();
  for (const v of Array.from(new Set(i))) {
    const m = Rr(t, v);
    if (m === void 0) continue;
    const S = t.channels[m], $ = t.originalColumnData(m), T = t.compensatedColumnData(m), C = new Float64Array(l.length), k = new Float64Array(l.length), P = new Float64Array(l.length), I = new Float64Array(l.length), M = [];
    for (let w = 0; w < l.length; w++) {
      const A = l[w], R = $[A], L = T[A], O = t.rawToDisplay(S.key, R), _ = t.rawToDisplay(S.key, L);
      C[w] = R, k[w] = L, P[w] = O, I[w] = _, Number.isFinite(O) && M.push(O), Number.isFinite(_) && M.push(_);
    }
    const E = Kr(M), F = Object.freeze({
      key: S.key,
      pnn: S.pnn,
      range: E,
      ticks: t.channelTicks(m, [E[0], E[1]]),
      originalRaw: C,
      compensatedRaw: k,
      originalDisplay: P,
      compensatedDisplay: I
    });
    h.set(v, F), h.set(S.key, F), h.set(S.pnn, F);
  }
  const p = r.eventMask ? r.eligibleEventCount ?? r.eventMask.reduce((v, m) => v + (m ? 1 : 0), 0) : t.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: l,
      eventSignature: Lr(l),
      eligibleEventCount: p,
      channels: h
    })
  };
}
function Vs(t, i, r, o, l, h, p) {
  const x = [], v = [];
  let m = 0, S = 0, $ = 0;
  for (const T of l) {
    x.push(Math.max(h[0], Math.min(h[1], t[T]))), v.push(Math.max(p[0], Math.min(p[1], i[T])));
    const C = Math.abs(r[T]) <= 1e-12, k = Math.abs(o[T]) <= 1e-12;
    C && m++, k && S++, C && k && $++;
  }
  return {
    x,
    y: v,
    zeroPile: Object.freeze({ source: m, receiver: S, corner: $ })
  };
}
function gi(t, i, r) {
  const o = t.channels.get(i), l = t.channels.get(r);
  if (!o || !l)
    return { ready: !1, reason: "One or both channels are absent from the frozen global-inspector dataset." };
  const h = [];
  for (let p = 0; p < t.eventIndices.length; p++)
    [
      o.originalDisplay[p],
      l.originalDisplay[p],
      o.compensatedDisplay[p],
      l.compensatedDisplay[p]
    ].every(Number.isFinite) && h.push(p);
  return {
    ready: !0,
    preview: Object.freeze({
      eventCount: h.length,
      totalEvents: t.eligibleEventCount,
      eventSignature: t.eventSignature,
      xRange: o.range,
      yRange: l.range,
      xTicks: o.ticks,
      yTicks: l.ticks,
      original: Vs(
        o.originalDisplay,
        l.originalDisplay,
        o.originalRaw,
        l.originalRaw,
        h,
        o.range,
        l.range
      ),
      compensated: Vs(
        o.compensatedDisplay,
        l.compensatedDisplay,
        o.compensatedRaw,
        l.compensatedRaw,
        h,
        o.range,
        l.range
      )
    })
  };
}
function qs(t, i, r, o, l) {
  const h = Math.max(1, Math.min(24, Math.round(l) || 3)), p = 256, x = h, v = p + 2 * x, m = new Float64Array(v * v), S = Math.max(1e-12, i[1] - i[0]), $ = Math.max(1e-12, r[1] - r[0]);
  for (let M = 0; M < t.x.length; M++) {
    const E = Math.max(0, Math.min(
      v - 1,
      Math.floor((t.x[M] - i[0]) / S * p) + x
    )), F = Math.max(0, Math.min(
      v - 1,
      Math.floor((t.y[M] - r[0]) / $ * p) + x
    ));
    m[F * v + E]++;
  }
  const T = new Float64Array(v * v), C = (h * 2 + 1) ** 2, k = v + 1, P = new Float64Array(k * k);
  for (let M = 0; M < v; M++) {
    let E = 0;
    for (let F = 0; F < v; F++)
      E += m[M * v + F], P[(M + 1) * k + F + 1] = P[M * k + F + 1] + E;
  }
  for (let M = h; M < v - h; M++) {
    const E = M - h, F = M + h + 1;
    for (let w = h; w < v - h; w++) {
      const A = w - h, R = w + h + 1, L = P[F * k + R] - P[E * k + R] - P[F * k + A] + P[E * k + A];
      T[M * v + w] = L / C;
    }
  }
  const I = [];
  for (let M = x; M < x + p; M++)
    for (let E = x; E < x + p; E++) {
      const F = T[M * v + E];
      F > 0 && I.push(F);
    }
  return I.sort((M, E) => M - E), I.length === 0 ? 1 : Math.max(1e-12, Ht(I, o));
}
function Qt(t, i) {
  const r = Math.max(1, Math.min(10, Number.isFinite(t) ? t : 6)), o = Math.max(1, (Number.isFinite(i) ? i : 220) - 50);
  return Math.max(1, Math.min(24, r * 170 / o));
}
function es(t, i = 0.95, r = 3, o = Jt) {
  const l = Math.max(
    qs(t.original, t.xRange, t.yRange, i, r),
    qs(t.compensated, t.xRange, t.yRange, i, r)
  );
  return ur(l, o);
}
function mt(t, i) {
  const r = i.size / 220, o = Math.sqrt(r), l = Math.max(9, Math.min(12, 11 * o)), h = Math.max(10, Math.min(13, 12 * o));
  hr().renderMiniPlot(t, {
    plot_size: i.size,
    canvas_scale: i.canvasScale ?? 3,
    display_mode: "pseudocolor",
    x: i.panel.x,
    y: i.panel.y,
    x_range: i.preview.xRange,
    y_range: i.preview.yRange,
    x_is_logicle: !!i.preview.xTicks,
    x_logicle_ticks: i.preview.xTicks ?? null,
    y_is_logicle: !!i.preview.yTicks,
    y_logicle_ticks: i.preview.yTicks ?? null,
    x_label: i.sourceLabel,
    y_label: i.receiverLabel,
    title: i.title,
    point_size: Math.max(0.55, Math.min(1.2, 1.15 * r)) * (i.pointSize ?? 1),
    point_alpha: i.pointAlpha,
    density_clip_quantile: 0.95,
    density_color_power: i.densityColorPower,
    density_color_ceiling: i.densityColorCeiling,
    density_smoothing: i.densitySmoothingRadius,
    axis_tick_size: 6,
    axis_outer_tick_size: 0,
    plot_margins: { top: 22, right: 8 },
    font_sizes: {
      tick: l,
      axis_label: h,
      title: Math.max(10, Math.min(13, 12 * o)),
      gate_label: l
    }
  });
}
const pn = "http://www.w3.org/2000/svg", _n = 6, mn = 1123, Un = 794;
function fi(t) {
  return Math.ceil(Math.max(0, Math.floor(t)) / _n);
}
function Gs(t) {
  return t.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function xi(t, i) {
  return `gatelab-compensation-${Gs(t.replace(/\.[^.]+$/, ""))}-${Gs(i)}`;
}
function Yt(t, i, r, o) {
  const l = xi(t, i);
  return r === "pdf" || o <= 1 ? `${l}.${r}` : `${l}-${r}-pages.zip`;
}
function En(t, i, r, o, l = {}) {
  const h = document.createElementNS(pn, "text");
  return h.setAttribute("x", String(r)), h.setAttribute("y", String(o)), h.setAttribute("font-family", "Arial, Helvetica, sans-serif"), h.setAttribute("font-size", String(l.size ?? 10)), h.setAttribute("font-weight", String(l.weight ?? 400)), h.setAttribute("fill", l.fill ?? "#253247"), l.anchor && h.setAttribute("text-anchor", l.anchor), h.textContent = i, t.appendChild(h), h;
}
function Ws(t, i) {
  return t.length <= i ? t : `${t.slice(0, Math.max(1, i - 1))}…`;
}
function Zs(t, i, r, o, l, h, p, x, v, m, S, $) {
  const T = document.createElement("div");
  mt(T, {
    title: o === "original" ? "Original" : "Compensated",
    panel: r[o],
    preview: r,
    sourceLabel: i.sourceLabel,
    receiverLabel: i.receiverLabel,
    size: p,
    densityColorCeiling: v,
    densitySmoothingRadius: x,
    densityColorPower: m,
    pointAlpha: S,
    pointSize: $,
    canvasScale: 300 / 96
  });
  const C = T.querySelector("canvas"), k = T.querySelector("svg");
  if (!C || !k) throw new Error("GateLab could not render a compensation export panel.");
  const P = document.createElementNS(pn, "g");
  P.setAttribute("transform", `translate(${l},${h})`);
  const I = document.createElementNS(pn, "image");
  I.setAttribute("x", "0"), I.setAttribute("y", "0"), I.setAttribute("width", String(p)), I.setAttribute("height", String(p)), I.setAttribute("href", C.toDataURL("image/png")), P.appendChild(I), P.appendChild(k.cloneNode(!0)), t.appendChild(P);
}
function Hs(t, i, r, o) {
  const l = document.createElementNS(pn, "svg");
  l.setAttribute("xmlns", pn), l.setAttribute("width", String(mn)), l.setAttribute("height", String(Un)), l.setAttribute("viewBox", `0 0 ${mn} ${Un}`);
  const h = document.createElementNS(pn, "rect");
  h.setAttribute("width", "100%"), h.setAttribute("height", "100%"), h.setAttribute("fill", "#ffffff"), l.appendChild(h), En(l, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), En(
    l,
    Ws(`${i.sampleName} · ${i.populationName} · ${i.profileName} · ${i.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), En(l, `Page ${r + 1} of ${o}`, mn - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const p = 28, x = 18, v = 53, m = 771, S = (mn - p * 2 - x) / 2, $ = (m - v) / 3, T = 204, C = 12, k = T * 2 + C;
  return t.forEach((P, I) => {
    const M = P.buildPreview(), E = Qt(i.densitySmoothing, T), F = es(
      M,
      0.95,
      E,
      i.densityColorPower
    ), w = I % 2, A = Math.floor(I / 2), R = p + w * (S + x), L = v + A * $, O = R + (S - k) / 2, _ = L + 25, W = P.relationship && P.relationship !== "other" ? ` · ${P.relationship}` : "";
    if (En(
      l,
      Ws(`${P.sourceLabel} → ${P.receiverLabel}`, 58),
      R + 5,
      L + 14,
      { size: 10.5, weight: 700 }
    ), En(
      l,
      `matrix ${(P.coefficient * 100).toFixed(1)}%${W}`,
      R + S - 5,
      L + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), Zs(l, P, M, "original", O, _, T, E, F, i.densityColorPower, i.pointAlpha, i.pointSize ?? 1), Zs(l, P, M, "compensated", O + T + C, _, T, E, F, i.densityColorPower, i.pointAlpha, i.pointSize ?? 1), A < 2) {
      const H = document.createElementNS(pn, "line");
      H.setAttribute("x1", String(R)), H.setAttribute("x2", String(R + S)), H.setAttribute("y1", String(L + $ - 3)), H.setAttribute("y2", String(L + $ - 3)), H.setAttribute("stroke", "#e6eaf0"), H.setAttribute("stroke-width", "1"), l.appendChild(H);
    }
  }), En(
    l,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), l;
}
function Ys(t) {
  return gr(t, { widthPx: mn, heightPx: Un }), `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(t)}`;
}
async function Xs(t, i = 300) {
  const r = URL.createObjectURL(new Blob([t], { type: "image/svg+xml" }));
  try {
    const o = await new Promise((x, v) => {
      const m = new Image();
      m.onload = () => x(m), m.onerror = () => v(new Error("GateLab could not rasterize the compensation export page.")), m.src = r;
    }), l = Math.max(1, i / 96), h = document.createElement("canvas");
    h.width = Math.round(mn * l), h.height = Math.round(Un * l);
    const p = h.getContext("2d");
    if (!p) throw new Error("Canvas export is unavailable in this browser.");
    return p.fillStyle = "#ffffff", p.fillRect(0, 0, h.width, h.height), p.scale(l, l), p.drawImage(o, 0, 0, mn, Un), await new Promise((x, v) => {
      h.toBlob((m) => m ? x(m) : v(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(r);
  }
}
function Js(t, i) {
  const r = URL.createObjectURL(t), o = document.createElement("a");
  o.href = r, o.download = i, document.body.appendChild(o), o.click(), o.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function Dr(t, i, r, o) {
  const l = Math.max(2, String(r).length);
  return `${t}-page-${String(i + 1).padStart(l, "0")}.${o}`;
}
async function zr(t, i, r, o) {
  const l = fi(t.length);
  if (l === 0) throw new Error("No compensation pairs are available to export.");
  const h = xi(i.sampleName, i.populationName);
  if (r === "pdf") {
    const { jsPDF: m } = await import("./jspdf.es.min-BCVXgNHT.js").then((C) => C.j), S = new m({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), $ = S.internal.pageSize.getWidth(), T = S.internal.pageSize.getHeight();
    for (let C = 0; C < l; C++) {
      C > 0 && S.addPage("a4", "landscape");
      const k = t.slice(
        C * _n,
        (C + 1) * _n
      ), P = Ys(Hs(k, i, C, l)), I = await Xs(P), M = await new Promise((E, F) => {
        const w = new FileReader();
        w.onload = () => E(String(w.result)), w.onerror = () => F(w.error ?? new Error("GateLab could not read an export page.")), w.readAsDataURL(I);
      });
      S.addImage(M, "PNG", 0, 0, $, T, void 0, "FAST"), o == null || o({ completedPages: C + 1, totalPages: l }), await new Promise((E) => setTimeout(E, 0));
    }
    S.save(Yt(i.sampleName, i.populationName, r, l));
    return;
  }
  const p = {};
  let x = null;
  for (let m = 0; m < l; m++) {
    const S = t.slice(
      m * _n,
      (m + 1) * _n
    ), $ = Ys(Hs(S, i, m, l)), T = Dr(h, m, l, r);
    if (r === "svg") {
      const C = pr($);
      p[T] = C, l === 1 && (x = new Blob([C], { type: "image/svg+xml" }));
    } else {
      const C = await Xs($), k = new Uint8Array(await C.arrayBuffer());
      p[T] = k, l === 1 && (x = C);
    }
    o == null || o({ completedPages: m + 1, totalPages: l }), await new Promise((C) => setTimeout(C, 0));
  }
  const v = Yt(
    i.sampleName,
    i.populationName,
    r,
    l
  );
  Js(l === 1 && x ? x : new Blob([mr(p, { level: 6 })], { type: "application/zip" }), v);
}
const _r = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function Ur({
  sampleName: t,
  populationName: i,
  filterLabel: r,
  pairCount: o,
  onExport: l,
  onClose: h
}) {
  const { t: p } = Ue(), [x, v] = N.useState("pdf"), [m, S] = N.useState(null), [$, T] = N.useState(null), C = fi(o), k = m !== null && m.completedPages < m.totalPages, P = Yt(t, i, x, C), I = async () => {
    T(null), S({ completedPages: 0, totalPages: C });
    try {
      await l(x, S), h();
    } catch (E) {
      S(null), T(E instanceof Error ? E.message : String(E));
    }
  }, M = (E) => {
    E.key === "Escape" && !k && h();
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: M, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-modal gl-comp-export-modal gl-comp-comparison-export-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "comp-comparison-export-title",
      children: [
        /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-comparison-export-title", children: p("Export compensation comparison") }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: p("Export the currently filtered channel pairs as clean paired Original and Compensated biplots. Every pair retains the same frozen events, axes, transform, density scale, and edge piling in both panels.") }),
        /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions gl-comp-comparison-export-formats", children: [
          /* @__PURE__ */ e.jsx("legend", { children: p("Format") }),
          _r.map((E) => /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-comparison-export-format",
                value: E.format,
                checked: x === E.format,
                disabled: k,
                onChange: () => v(E.format)
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: E.title }),
              /* @__PURE__ */ e.jsx("small", { children: p(E.detail) })
            ] })
          ] }, E.format))
        ] }),
        /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary gl-comp-comparison-export-summary", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("File") }),
            /* @__PURE__ */ e.jsx("dd", { title: P, children: P })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("Scope") }),
            /* @__PURE__ */ e.jsx("dd", { children: p(o === 1 ? "{count} filtered pair · both assays" : "{count} filtered pairs · both assays", { count: o.toLocaleString() }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("Pages") }),
            /* @__PURE__ */ e.jsx("dd", { children: p(C === 1 ? "{count} A4 landscape page · six pairs per page" : "{count} A4 landscape pages · six pairs per page", { count: C.toLocaleString() }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("Population") }),
            /* @__PURE__ */ e.jsx("dd", { title: i, children: i })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("Filter") }),
            /* @__PURE__ */ e.jsx("dd", { title: r, children: r })
          ] })
        ] }),
        m && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-comparison-export-progress", role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, m.totalPages), value: m.completedPages }),
          /* @__PURE__ */ e.jsx("span", { children: p("Rendering page {current} of {total}", { current: Math.min(m.completedPages + 1, m.totalPages), total: m.totalPages }) })
        ] }),
        $ && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: p($) }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: k, onClick: h, children: p("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: k || C === 0, onClick: () => void I(), children: k ? p("Rendering…") : p("Download {format}", { format: x.toUpperCase() }) })
        ] })
      ]
    }
  ) });
}
function Qs(t) {
  return `"${t.replaceAll('"', '""')}"`;
}
function ei(t, i) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error(`The ${i} channel axis is empty.`);
  const r = t.map((o, l) => {
    if (typeof o != "string" || o.trim().length === 0)
      throw new Error(`The ${i} channel at position ${l + 1} is blank or invalid.`);
    return o.trim().normalize("NFC");
  });
  if (new Set(r).size !== r.length)
    throw new Error(`The ${i} channel axis contains duplicate identities.`);
  return r;
}
function Br(t) {
  const i = ei(t.sourceChannels, "source"), r = ei(t.receiverChannels, "receiver");
  if (!Array.isArray(t.matrix) || t.matrix.length !== i.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const o = [
    ["channel", ...r].map(Qs).join(",")
  ];
  return t.matrix.forEach((l, h) => {
    if (!Array.isArray(l) || l.length !== r.length)
      throw new Error(
        `Spill matrix row ${h + 1} does not match the receiver channel axis.`
      );
    const p = l.map((x, v) => {
      if (typeof x != "number" || !Number.isFinite(x))
        throw new Error(
          `Spill coefficient ${i[h]} → ${r[v]} is not finite.`
        );
      return Object.is(x, -0) ? "0" : String(x);
    });
    o.push([Qs(i[h]), ...p].join(","));
  }), `${o.join(`
`)}
`;
}
function Vr(t, i = "installed") {
  return `${t.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${i === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function qr(t) {
  return [
    "spill <- as.matrix(read.csv(",
    `  "${t.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}",`,
    "  row.names = 1,",
    "  check.names = FALSE,",
    '  fileEncoding = "UTF-8"',
    "))",
    'storage.mode(spill) <- "double"'
  ].join(`
`);
}
function Gr({
  profileLabel: t,
  installedLabel: i,
  installedMatrix: r,
  workingMatrix: o = null,
  pendingEditCount: l = 0,
  onClose: h
}) {
  const { t: p } = Ue(), [x, v] = N.useState("installed"), [m, S] = N.useState(null), $ = x === "working" && o ? o : r, T = Vr(t, x), C = N.useMemo(
    () => qr(T),
    [T]
  ), k = () => {
    S(null);
    try {
      const M = Br($), E = URL.createObjectURL(new Blob([M], { type: "text/csv;charset=utf-8" })), F = document.createElement("a");
      F.href = E, F.download = T, document.body.appendChild(F), F.click(), F.remove(), setTimeout(() => URL.revokeObjectURL(E), 1e3);
    } catch (M) {
      S(M instanceof Error ? M.message : String(M));
    }
  }, P = async () => {
    var M;
    if (!((M = navigator.clipboard) != null && M.writeText)) {
      S("Clipboard access is unavailable; select the R code below and copy it manually.");
      return;
    }
    try {
      await navigator.clipboard.writeText(C), S("R import code copied.");
    } catch {
      S("Clipboard access was denied; select the R code below and copy it manually.");
    }
  }, I = (M) => {
    M.key === "Escape" && h();
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: I, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-modal gl-comp-export-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "comp-export-title",
      children: [
        /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-export-title", children: p("Export spill matrix") }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: p("Coefficients are exported as exact fractions, not the rounded percentages shown in the matrix. Source channels are rows and receiver channels are columns. The CSV can be imported by GateLab or base R.") }),
        o && l > 0 && /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions", children: [
          /* @__PURE__ */ e.jsx("legend", { children: p("Matrix version") }),
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-export-version",
                value: "installed",
                checked: x === "installed",
                onChange: () => v("installed")
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: i }),
              /* @__PURE__ */ e.jsx("small", { children: p("Current applied scientific record") })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-export-version",
                value: "working",
                checked: x === "working",
                onChange: () => v("working")
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: p("Working draft") }),
              /* @__PURE__ */ e.jsx("small", { children: p("{count} pending edits; not yet applied", { count: l }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("File") }),
            /* @__PURE__ */ e.jsx("dd", { children: T })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("Dimensions") }),
            /* @__PURE__ */ e.jsx("dd", { children: p("{sources} sources × {receivers} receivers", { sources: $.sourceChannels.length, receivers: $.receiverChannels.length }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("Units") }),
            /* @__PURE__ */ e.jsx("dd", { children: p("Fractions (2.9% is written as 0.029)") })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-export-r-head", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: p("Import in R") }),
            /* @__PURE__ */ e.jsx("span", { children: p("Run after placing the CSV in the R working directory.") })
          ] }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => void P(), children: p("Copy R code") })
        ] }),
        /* @__PURE__ */ e.jsx("pre", { className: "gl-comp-export-code", children: /* @__PURE__ */ e.jsx("code", { children: C }) }),
        m && /* @__PURE__ */ e.jsx("div", { className: m.includes("copied") ? "gl-comp-status" : "gl-comp-warning", role: "status", children: m }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: h, children: p("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", onClick: k, children: p("Download CSV") })
        ] })
      ]
    }
  ) });
}
function An({
  value: t,
  onValueChange: i,
  scrubStep: r,
  className: o = "",
  disabled: l,
  min: h,
  max: p,
  step: x,
  title: v,
  onPointerDown: m,
  onPointerMove: S,
  onPointerUp: $,
  onPointerCancel: T,
  onLostPointerCapture: C,
  ...k
}) {
  const { t: P } = Ue(), I = N.useRef(null), [M, E] = N.useState(!1), F = (w) => {
    var A, R, L;
    ((A = I.current) == null ? void 0 : A.pointerId) === w.pointerId && (I.current = null, E(!1), (L = (R = w.currentTarget).hasPointerCapture) != null && L.call(R, w.pointerId) && w.currentTarget.releasePointerCapture(w.pointerId));
  };
  return /* @__PURE__ */ e.jsx(
    "input",
    {
      ...k,
      type: "number",
      className: `gl-scrubbable-number${M ? " is-scrubbing" : ""}${o ? ` ${o}` : ""}`,
      value: t,
      disabled: l,
      min: h,
      max: p,
      step: x,
      title: v ?? P("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (w) => i(w.currentTarget.value),
      onPointerDown: (w) => {
        var W, H;
        if (m == null || m(w), w.defaultPrevented || l || w.button !== 0) return;
        const A = w.currentTarget.getBoundingClientRect();
        if (w.clientX >= A.right - 18) return;
        const R = Number(t), L = (r ?? Number(x)) || 0.1;
        if (!Number.isFinite(R) || !(L > 0)) return;
        const O = String(L), _ = O.includes("e-") ? Number(O.split("e-")[1]) : O.includes(".") ? O.split(".")[1].length : 0;
        I.current = {
          pointerId: w.pointerId,
          startY: w.clientY,
          startValue: R,
          step: L,
          decimals: _,
          lastSteps: 0
        }, (H = (W = w.currentTarget).setPointerCapture) == null || H.call(W, w.pointerId);
      },
      onPointerMove: (w) => {
        S == null || S(w);
        const A = I.current;
        if (!A || A.pointerId !== w.pointerId) return;
        const R = A.startY - w.clientY;
        if (Math.abs(R) < 3) return;
        const L = R > 0 ? Math.floor(R / 4) : Math.ceil(R / 4);
        if (L === A.lastSteps) return;
        let O = A.startValue + L * A.step;
        const _ = h === void 0 ? Number.NEGATIVE_INFINITY : Number(h), W = p === void 0 ? Number.POSITIVE_INFINITY : Number(p);
        Number.isFinite(_) && (O = Math.max(_, O)), Number.isFinite(W) && (O = Math.min(W, O)), I.current = { ...A, lastSteps: L }, E(!0), i(O.toFixed(Math.min(10, A.decimals))), w.preventDefault();
      },
      onPointerUp: (w) => {
        $ == null || $(w), F(w);
      },
      onPointerCancel: (w) => {
        T == null || T(w), F(w);
      },
      onLostPointerCapture: (w) => {
        var A;
        C == null || C(w), ((A = I.current) == null ? void 0 : A.pointerId) === w.pointerId && (I.current = null, E(!1));
      }
    }
  );
}
const ns = N.createContext(Jt), ts = N.createContext(0.85), ss = N.createContext(1), ni = "", lt = [];
let Bt = !1;
function Wr(t) {
  const i = { cancelled: !1, run: t };
  lt.push(i);
  const r = () => {
    if (Bt) return;
    Bt = !0;
    const o = () => {
      Bt = !1;
      let h = lt.shift();
      for (; h != null && h.cancelled; ) h = lt.shift();
      h == null || h.run(), lt.length > 0 && r();
    }, l = window;
    typeof l.requestIdleCallback == "function" ? l.requestIdleCallback(o, { timeout: 50 }) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(o) : setTimeout(o, 0);
  };
  return r(), () => {
    i.cancelled = !0;
  };
}
function gt({
  title: t,
  panel: i,
  preview: r,
  sourceLabel: o,
  receiverLabel: l,
  minimumSize: h = 210,
  maximumSize: p = 420,
  densityColorCeiling: x,
  densitySmoothing: v,
  showZeroPile: m = !0
}) {
  const { t: S } = Ue(), $ = N.useContext(ns), T = N.useContext(ts), C = N.useContext(ss), k = N.useRef(null);
  N.useEffect(() => {
    const M = k.current;
    if (!M) return;
    let E = null, F = 0;
    const w = () => {
      var W;
      E = null;
      const L = ((W = M.parentElement) == null ? void 0 : W.clientWidth) ?? 230, O = Math.max(h, Math.min(p, Math.floor(L)));
      if (O === F && M.childElementCount > 0) return;
      F = O;
      const _ = Qt(v, O);
      mt(M, {
        title: t,
        panel: i,
        preview: r,
        sourceLabel: o,
        receiverLabel: l,
        size: O,
        densityColorCeiling: x ?? es(
          r,
          0.95,
          _,
          $
        ),
        densitySmoothingRadius: _,
        densityColorPower: $,
        pointAlpha: T,
        pointSize: C
      });
    }, A = () => {
      E !== null && cancelAnimationFrame(E), E = requestAnimationFrame(w);
    };
    A();
    const R = typeof ResizeObserver > "u" ? null : new ResizeObserver(A);
    return R == null || R.observe(M.parentElement ?? M), () => {
      R == null || R.disconnect(), E !== null && cancelAnimationFrame(E);
    };
  }, [x, $, v, p, h, i, T, C, r, l, o, t]);
  const P = (M) => r.eventCount > 0 ? `${(M / r.eventCount * 100).toFixed(1)}%` : "0.0%", I = i.zeroPile.source > 0 || i.zeroPile.receiver > 0 || i.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": S("{title} density biplot; {source} on x, {receiver} on y", {
    title: t,
    source: o,
    receiver: l
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: k, className: "gl-comp-biplot-surface" }),
    m && I && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: S("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: P(i.zeroPile.source),
      receiver: P(i.zeroPile.receiver),
      both: P(i.zeroPile.corner)
    }) })
  ] });
}
function Zr({
  title: t,
  preview: i,
  sourceLabel: r,
  receiverLabel: o,
  minimumSize: l,
  maximumSize: h,
  densityColorCeiling: p,
  densitySmoothing: x
}) {
  const { t: v } = Ue(), m = N.useContext(ns), S = N.useContext(ts), $ = N.useContext(ss), T = N.useRef(null);
  return N.useEffect(() => {
    const C = T.current;
    if (!C) return;
    let k = null, P = 0;
    const I = () => {
      var H;
      k = null;
      const F = ((H = C.parentElement) == null ? void 0 : H.clientWidth) ?? l, w = Math.max(l, Math.min(h, Math.floor(F)));
      if (w === P && C.dataset.cacheReady === "true") return;
      P = w, C.dataset.cacheReady = "false";
      const A = Qt(x, w), R = p ?? es(
        i,
        0.95,
        A,
        m
      );
      mt(C, {
        title: t,
        panel: i.original,
        preview: i,
        sourceLabel: r,
        receiverLabel: o,
        size: w,
        densityColorCeiling: R,
        densitySmoothingRadius: A,
        densityColorPower: m,
        pointAlpha: S,
        pointSize: $,
        canvasScale: 2
      });
      const L = C.querySelector("canvas"), O = C.querySelector("svg"), _ = document.createElement("div");
      mt(_, {
        title: t,
        panel: i.compensated,
        preview: i,
        sourceLabel: r,
        receiverLabel: o,
        size: w,
        densityColorCeiling: R,
        densitySmoothingRadius: A,
        densityColorPower: m,
        pointAlpha: S,
        pointSize: $,
        canvasScale: 2
      });
      const W = _.querySelector("canvas");
      !L || !W || !O || (L.classList.add("gl-comp-cached-canvas", "is-original"), L.dataset.assayLayer = "original", W.classList.add("gl-comp-cached-canvas", "is-compensated"), W.dataset.assayLayer = "compensated", C.insertBefore(W, O), C.dataset.cacheReady = "true");
    }, M = () => {
      k == null || k(), k = Wr(I);
    };
    M();
    const E = typeof ResizeObserver > "u" ? null : new ResizeObserver(M);
    return E == null || E.observe(C.parentElement ?? C), () => {
      E == null || E.disconnect(), k == null || k();
    };
  }, [p, m, x, h, l, S, $, i, o, r, t]), /* @__PURE__ */ e.jsx(
    "figure",
    {
      className: "gl-comp-biplot",
      "aria-label": v("Cached uncompensated and compensated density biplot; {source} on x, {receiver} on y", {
        source: r,
        receiver: o
      }),
      children: /* @__PURE__ */ e.jsx(
        "div",
        {
          ref: T,
          className: "gl-comp-biplot-surface gl-comp-cached-biplot",
          "data-cache-mode": "dual-canvas"
        }
      )
    }
  );
}
function ti({
  preview: t,
  sourceLabel: i,
  receiverLabel: r,
  kind: o,
  densitySmoothing: l,
  compact: h = !1,
  compensatedTitle: p = "Compensated"
}) {
  const { t: x } = Ue(), v = t.eventCount > 0 ? t.original.zeroPile.receiver / t.eventCount * 100 : 0, m = t.eventCount > 0 ? t.compensated.zeroPile.receiver / t.eventCount * 100 : 0, S = m - v;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${h ? " is-compact" : ""}`, children: [
    !h && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: x("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: t.eventCount.toLocaleString(),
      sampled: t.totalEvents > t.eventCount ? x(" sampled from {total}", { total: t.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        gt,
        {
          title: x("Original"),
          panel: t.original,
          preview: t,
          sourceLabel: i,
          receiverLabel: r,
          densitySmoothing: l,
          showZeroPile: !h
        }
      ),
      /* @__PURE__ */ e.jsx(
        gt,
        {
          title: p,
          panel: t.compensated,
          preview: t,
          sourceLabel: i,
          receiverLabel: r,
          densitySmoothing: l,
          showZeroPile: !h
        }
      )
    ] }),
    !h && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-diagnostic-note", children: o === "cytof" ? /* @__PURE__ */ e.jsx(e.Fragment, { children: x("Receiver events at exact zero: {original}% → {compensated}% ({delta} percentage points). A rise can be consistent with NNLS over-subtraction, while a residual source-associated rise can be consistent with under-compensation. Neither is a verdict without a suitable negative/control population.", {
      original: v.toFixed(1),
      compensated: m.toFixed(1),
      delta: `${S >= 0 ? "+" : ""}${S.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: x("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: p
    }) }) }),
    !h && (t.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": x("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: x("{value} MAD", { value: se(t.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: se(t.evidence.residualSlope ?? 0, 4) })
      ] }),
      t.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: x("{value} MAD", { value: se(t.evidence.upperTailExcessMad, 3) }) })
      ] }),
      t.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: x("{value} MAD", { value: se(t.evidence.upperTailSlopeDeltaMad, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Evidence groups") }),
        /* @__PURE__ */ e.jsx("dd", { children: x("{high} source-high · {low} source-low", {
          high: t.evidence.sourceHighEvents.toLocaleString(),
          low: t.evidence.sourceLowEvents.toLocaleString()
        }) })
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-evidence-insufficient", children: x("Residual screening needs distinct source-low/source-high groups and enough receiver-negative events; this pair remains available for visual review.") }))
  ] });
}
function Hr({
  matrixView: t,
  sourceChannels: i,
  receiverChannels: r,
  selectedSourceIndex: o,
  selectedReceiverIndex: l,
  stagedCoefficients: h,
  maximumAbsoluteOffDiagonal: p,
  onSelect: x
}) {
  const { t: v } = Ue(), m = 6, S = 74, $ = 44, T = 10, C = r.length * m, k = i.length * m, P = S + C + S, I = $ + k + T, M = N.useMemo(() => {
    const F = [];
    for (let w = 0; w < t.matrix.length; w++)
      for (let A = 0; A < t.matrix[w].length; A++) {
        const R = t.sourceAxisKeys[w], L = t.receiverAxisKeys[A], O = `${R}${ni}${L}`, _ = h[O] ?? t.matrix[w][A], W = R === L;
        if (!W && (!Number.isFinite(_) || _ === 0)) continue;
        const H = p > 0 && Number.isFinite(_) ? Math.min(1, Math.abs(_) / p) : 0, V = H > 0 ? 0.12 + 0.82 * Math.sqrt(H) : 0;
        F.push({
          sourceIndex: w,
          receiverIndex: A,
          pairKey: O,
          value: _,
          diagonal: W,
          fill: W ? "#cfd4db" : Number.isFinite(_) ? _ < 0 ? `rgba(47,128,237,${V})` : `rgba(211,47,47,${V})` : "#ae3e3e"
        });
      }
    return F;
  }, [t, p, h]), E = (F) => {
    const w = F.currentTarget.getBoundingClientRect();
    if (!(w.width > 0) || !(w.height > 0)) return;
    const A = (F.clientX - w.left) * P / w.width, R = (F.clientY - w.top) * I / w.height, L = Math.floor((A - S) / m), O = Math.floor((R - $) / m);
    O < 0 || O >= i.length || L < 0 || L >= r.length || t.sourceAxisKeys[O] === t.receiverAxisKeys[L] || x(`${t.sourceAxisKeys[O]}${ni}${t.receiverAxisKeys[L]}`);
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-mini-matrix", "aria-labelledby": "comp-mini-matrix-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-mini-matrix-head", children: [
      /* @__PURE__ */ e.jsx("strong", { id: "comp-mini-matrix-heading", children: v("Matrix map") }),
      /* @__PURE__ */ e.jsx("span", { children: v("Source ↓ · receiver → · click a cell") })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        width: P,
        height: I,
        viewBox: `0 0 ${P} ${I}`,
        role: "img",
        "aria-label": v("Mini compensation matrix with {sources} source rows and {receivers} receiver columns", {
          sources: i.length,
          receivers: r.length
        }),
        onPointerDown: E,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: S, y: $, width: C, height: k, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          r.map((F, w) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: S + (w + 0.55) * m,
              y: $ - 3,
              transform: `rotate(-58 ${S + (w + 0.55) * m} ${$ - 3})`,
              textAnchor: "start",
              className: w === l ? "is-selected" : void 0,
              children: F.pnn
            },
            F.key
          )),
          i.map((F, w) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: S - 3,
              y: $ + (w + 0.72) * m,
              textAnchor: "end",
              className: w === o ? "is-selected" : void 0,
              children: F.pnn
            },
            F.key
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: S,
              y: $ + o * m,
              width: C,
              height: m,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: S + l * m,
              y: $,
              width: m,
              height: k,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          M.map((F) => /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: S + F.receiverIndex * m,
              y: $ + F.sourceIndex * m,
              width: m,
              height: m,
              fill: F.fill,
              pointerEvents: "none",
              children: /* @__PURE__ */ e.jsx("title", { children: F.diagonal ? v("{channel} · self", { channel: i[F.sourceIndex].combined }) : `${i[F.sourceIndex].combined} → ${r[F.receiverIndex].combined} · ${nn(F.value)}` })
            },
            F.pairKey
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: S + l * m,
              y: $ + o * m,
              width: m,
              height: m,
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
function Yr({
  dataset: t,
  pair: i,
  plotSize: r,
  densitySmoothing: o,
  flagged: l,
  selected: h,
  onSelect: p,
  onFlag: x
}) {
  const { t: v } = Ue(), m = N.useRef(null), [S, $] = N.useState(() => typeof IntersectionObserver > "u");
  N.useEffect(() => {
    const k = m.current;
    if (!k || typeof IntersectionObserver > "u") {
      $(!0);
      return;
    }
    const P = new IntersectionObserver(
      (I) => $(I.some((M) => M.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return P.observe(k), () => P.disconnect();
  }, []);
  const T = N.useMemo(
    () => S ? gi(t, i.source.key, i.receiver.key) : null,
    [t, i.receiver.key, i.source.key, S]
  ), C = T != null && T.ready ? T.preview : null;
  return /* @__PURE__ */ e.jsxs(
    "article",
    {
      ref: m,
      className: `gl-comp-global-tile${h ? " is-selected" : ""}${l ? " is-flagged" : ""}`,
      "data-pair-key": i.pairKey,
      "data-event-signature": C == null ? void 0 : C.eventSignature,
      "data-x-range": C ? `${C.xRange[0]},${C.xRange[1]}` : void 0,
      "data-y-range": C ? `${C.yRange[0]},${C.yRange[1]}` : void 0,
      style: { width: r, height: r },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-tile-head", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: p,
              title: `${i.source.combined} → ${i.receiver.combined}`,
              "aria-label": v("Open details for {source} to {receiver}", {
                source: i.source.label,
                receiver: i.receiver.label
              }),
              children: [
                /* @__PURE__ */ e.jsxs("span", { children: [
                  i.source.label,
                  " → ",
                  i.receiver.label
                ] }),
                /* @__PURE__ */ e.jsxs("strong", { children: [
                  (i.coefficient * 100).toFixed(1),
                  "%"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx("label", { title: v("Keep this pair in Flagged"), children: /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: l,
              "aria-label": v("Flag global inspector pair {source} to {receiver} for follow-up", {
                source: i.source.label,
                receiver: i.receiver.label
              }),
              onChange: (k) => x(k.currentTarget.checked)
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-comp-global-plot-button",
            onClick: p,
            title: v("{source} → {receiver} · {interaction}matrix {coefficient}%", {
              source: i.source.combined,
              receiver: i.receiver.combined,
              interaction: i.interaction && i.interaction !== "other" ? `${i.interaction} · ` : "",
              coefficient: (i.coefficient * 100).toFixed(1)
            }),
            "aria-label": v("Open details for {source} to {receiver}; matrix coefficient {coefficient}%", {
              source: i.source.label,
              receiver: i.receiver.label,
              coefficient: (i.coefficient * 100).toFixed(1)
            }),
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: r, height: r }, children: C ? /* @__PURE__ */ e.jsx(
              Zr,
              {
                title: "",
                preview: C,
                sourceLabel: i.source.label,
                receiverLabel: i.receiver.label,
                minimumSize: r,
                maximumSize: r,
                densitySmoothing: o
              }
            ) : T && !T.ready ? /* @__PURE__ */ e.jsx("span", { children: T.reason }) : /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" }) })
          }
        )
      ]
    }
  );
}
function Xr({
  stateKey: t,
  header: i,
  children: r
}) {
  const { t: o } = Ue(), [l, h] = ge(
    `compensation.${t}.globalInspectorLayer`,
    "compensated"
  );
  return /* @__PURE__ */ e.jsxs(
    "section",
    {
      className: "gl-comp-global-inspector",
      "aria-labelledby": "comp-global-inspector-heading",
      "data-inspector-layer": l,
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-head", children: [
          i,
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "gl-comp-layer-toggle",
              "aria-pressed": l === "compensated",
              "aria-label": o("Showing {shown} data; click to show {other} data", {
                shown: o(l === "original" ? "uncompensated" : "compensated"),
                other: o(l === "original" ? "compensated" : "uncompensated")
              }),
              title: o("Toggle every plot between uncompensated and compensated data without changing its frame"),
              onClick: () => h((p) => p === "original" ? "compensated" : "original"),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "gl-comp-layer-toggle-track", "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", {}) }),
                /* @__PURE__ */ e.jsx("span", { children: o(l === "original" ? "Uncompensated" : "Compensated") })
              ]
            }
          )
        ] }),
        r
      ]
    }
  );
}
const Jr = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', si = 58 * Math.PI / 180, Qr = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, ea = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], ze = "", ii = 2500, ri = 400, na = 2500, ai = 15e3, oi = [2500, 5e3, 15e3, 5e4], ta = 24, li = 4, ci = 624, sa = Object.freeze({});
function di(t) {
  if (!Number.isFinite(t)) return String(t);
  const i = t * 100;
  if (i === 0) return "0.0";
  const r = Math.abs(i), o = r >= 1 ? 1 : r >= 0.1 ? 2 : 3;
  return i.toFixed(o);
}
function Vt(t) {
  return t.replace(/(?: · (?:edited|revised))+$/u, "");
}
function ft(t, i) {
  const r = t.index(i), o = r === void 0 ? void 0 : t.channels[r], l = (o == null ? void 0 : o.pnn) ?? i, h = t.labelForKey(i), p = ((o == null ? void 0 : o.label) ?? "").trim() || ((o == null ? void 0 : o.marker) ?? "").trim(), x = p && p !== l ? `${p} (${l})` : l;
  return { key: i, pnn: l, label: h, combined: x };
}
function qt(t, i) {
  const r = t.channels.find((o) => o.pnn === i);
  return ft(t, (r == null ? void 0 : r.key) ?? i);
}
function ia(t, i) {
  return t === "cytof-spillover" && i === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function ra(t) {
  return t.replaceAll("-", " ");
}
function Xt(t) {
  if (t.length === 0) return 0;
  t.sort((r, o) => r - o);
  const i = Math.floor(t.length / 2);
  return t.length % 2 === 0 ? (t[i - 1] + t[i]) / 2 : t[i];
}
function aa(t) {
  return Object.fromEntries(t.scientific.solverSettings.map(({ key: i, value: r }) => [i, r]));
}
function oa(t, i) {
  const r = Object.freeze({ ...t.scientific.matrix, matrix: i }), o = aa(t);
  return t.scientific.kind === "flow-spillover" ? {
    kind: "flow-spillover",
    method: "matrix-inverse",
    solverVersion: t.scientific.solverVersion,
    solverSettings: {
      singularTolerance: Number(o.singularTolerance),
      conditionWarningThreshold: Number(o.conditionWarningThreshold)
    },
    matrix: r
  } : {
    kind: "cytof-spillover",
    method: "nnls",
    solverVersion: t.scientific.solverVersion,
    solverSettings: {
      tolerance: Number(o.tolerance),
      kktTolerance: Number(o.kktTolerance),
      maxIterations: Number(o.maxIterations),
      adaptationVersion: String(o.adaptationVersion)
    },
    matrix: r,
    includedChannels: t.scientific.includedChannels
  };
}
function ui(t, i, r, o) {
  const l = t.scientific.matrix.sourceChannels.indexOf(i), h = t.scientific.matrix.receiverChannels.indexOf(r);
  if (l < 0 || h < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(t.scientific.matrix.matrix.map(
    (p, x) => Object.freeze(p.map((v, m) => x === l && m === h ? o : v))
  ));
}
function la(t, i, r) {
  var p;
  if (!t) return null;
  const o = t.scientific.matrix.sourceChannels.indexOf(i), l = t.scientific.matrix.receiverChannels.indexOf(r);
  if (o < 0 || l < 0) return null;
  const h = (p = t.scientific.matrix.matrix[o]) == null ? void 0 : p[l];
  return Number.isFinite(h) ? h : null;
}
function hi(t, i, r) {
  const o = Math.max(Math.abs(t), Math.abs(i), 1e-3);
  return Object.freeze(r === "cytof" ? { lower: 0, upper: Math.max(t + o, o * 2) } : { lower: t - o, upper: t + o });
}
function ca(t, i) {
  const r = (i - t) / 3;
  return Object.freeze([t, t + r, t + 2 * r, i]);
}
function da(t, i) {
  return t.length === i.length && t.every((r, o) => {
    var l;
    return r.length === ((l = i[o]) == null ? void 0 : l.length) && r.every((h, p) => h === i[o][p]);
  });
}
function ua(t, i) {
  if (t.compensatedLayerStatus().state !== "ready" || i.length === 0 || t.fcs.nEvents === 0) return null;
  const o = i.flatMap(($) => {
    const T = t.channels.findIndex((C) => C.pnn === $);
    return T < 0 ? [] : [T];
  });
  if (o.length === 0) return null;
  const l = Math.min(2048, t.fcs.nEvents), h = [];
  let p = 0, x = 0, v = 0, m = "", S = -1;
  for (const $ of o) {
    const T = t.originalColumnData($), C = t.compensatedColumnData($), k = [];
    for (let I = 0; I < l; I++) {
      const M = l === 1 ? 0 : Math.floor(I * (t.fcs.nEvents - 1) / (l - 1)), E = T[M], F = C[M], w = Math.abs(F - E);
      k.push(w), h.push(w), w > Math.max(1e-6, Math.abs(E) * 1e-6) && p++, E < 0 && F === 0 && v++, x = Math.max(x, w);
    }
    const P = Xt(k);
    P > S && (S = P, m = ft(t, t.channels[$].key).combined);
  }
  return {
    previewEvents: l,
    comparedValues: h.length,
    changedValues: p,
    medianAbsoluteDelta: Xt(h),
    maxAbsoluteDelta: x,
    zeroedNegativeValues: v,
    mostChangedChannel: m,
    mostChangedChannelMedianDelta: Math.max(0, S)
  };
}
function ha(t, i) {
  return t.origin.type === "uploaded" ? t.origin.fileName : t.origin.type === "embedded-fcs" ? `${t.origin.fileName} · ${i("embedded FCS")}` : t.origin.type === "manual" ? i("set by hand, from an empty matrix") : `${t.origin.presetId} · ${i("bundled preset")} ${t.origin.presetVersion}`;
}
function pa(t) {
  if (!t || t.kind !== "cytof-spillover")
    return { draft: null, error: null };
  const i = {
    input: {
      sourceChannels: t.sourceChannels,
      receiverChannels: t.receiverChannels,
      matrix: t.matrix
    },
    format: {
      delimiter: "csv",
      sourceColumnHeader: "source"
    }
  }, r = ct(
    i.input,
    "cytof-spillover"
  );
  return r.ok ? {
    draft: {
      fileName: t.name,
      source: "host",
      parsed: i,
      matrix: r.value,
      validationWarnings: r.warnings
    },
    error: null
  } : {
    draft: null,
    error: `The SCE spillover matrix is invalid. ${r.errors.map(({ message: o }) => o).join(" ")}`
  };
}
function ma({
  sample: t,
  sampleName: i = "sample.fcs",
  hostedCompensationMatrix: r = null,
  compensationOn: o,
  onApplyProfile: l,
  onRemoveProfile: h,
  existingHostAssays: p = [],
  onAdoptExistingAssay: x,
  onCancelApply: v,
  hasExistingGates: m = !1,
  applyStatus: S = null,
  installedProfile: $ = null,
  applyTargetCount: T = 1,
  applyTargetEventCount: C,
  applyWorkerCount: k,
  applyWorkerLimit: P,
  onApplyWorkerCountChange: I,
  installedBaselineProfile: M = null,
  reviewPopulations: E = [],
  reviewPopulationMasks: F = sa,
  onPreviewCompensationCandidate: w,
  onSolveCompensationSweep: A,
  onCancelCompensationSweep: R,
  onSuspendBackgroundWork: L,
  visible: O = !0,
  stateKey: _,
  densityColorPower: W = Jt,
  channelLabelMode: H = "marker",
  onDensityColorPowerChange: V = () => {
  }
}) {
  var Rs, Ks;
  const { t: s } = Ue(), q = t.compensatedLayerStatus(), Fe = q.state === "missing" ? null : q.metadata, D = (Fe == null ? void 0 : Fe.runtimeIdentity) === "profile" ? Fe : null, j = ($ == null ? void 0 : $.profileId) === (D == null ? void 0 : D.profileId) ? $ : null, ee = !D && t.instrument === "flow" ? t.spillover : null, pe = (r == null ? void 0 : r.kind) === "flow-spillover" ? r : null, fn = N.useMemo(
    () => pa(r),
    [r]
  ), [Be, we] = ge(
    `compensation.${_}.selectedPair`,
    null
  ), [xt, $e] = N.useState(null), [Bn, is] = ge(
    `compensation.${_}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [xn, rs] = ge(
    "compensation.inspectorWidth",
    ci
  ), [Me, Vn] = ge(
    `compensation.${_}.workspaceView`,
    "matrix"
  ), [Pe, qn] = ge(
    `compensation.${_}.globalPairFilter`,
    "relevant"
  ), [Ie, vi] = ge(
    `compensation.${_}.globalLayout`,
    "compact"
  ), [bi, yi] = ge(
    "compensation.globalPlotSize.v5",
    160
  ), [ji, wi] = ge(
    "compensation.densitySmoothing.v3",
    6
  ), [Ni, Ci] = ge(
    "compensation.pointAlpha.v1",
    0.85
  ), [Si, Mi] = ge(
    "compensation.pointSize.v1",
    1
  ), [vt, ki] = ge(
    "compensation.pairPreviewEventLimit.v1",
    ai
  ), [Tn, as] = N.useState(""), [Fn, bt] = N.useState(!1), [yt, os] = N.useState(null), [vn, jt] = ge(
    `compensation.${_}.reviewPopulation`,
    "all"
  ), [Gn, Ei] = ge(
    `compensation.${_}.flaggedPairs`,
    []
  ), [Ve, Ai] = ge(
    `compensation.${_}.evidenceMode`,
    "biological"
  ), [Ti, Fi] = ge(
    `compensation.${_}.sweepBounds`,
    {}
  ), [wt, Nt] = ge(
    `compensation.${_}.sweepWorkers`,
    2
  ), [ke, ls] = N.useState(""), [Ne, Ct] = N.useState(""), [$i, St] = N.useState(0), [Y, Wn] = N.useState({}), [Pi, tn] = N.useState({}), [qe, sn] = N.useState({ state: "idle" }), [Ii, He] = N.useState({}), [Ri, rn] = N.useState({}), [be, bn] = N.useState(null), [Ki, $n] = N.useState(null), [ue, yn] = N.useState(null), [cs, xe] = N.useState(null), [Zn, Mt] = N.useState(""), [Li, ds] = N.useState(!1), [Oi, us] = N.useState(!1), Ee = N.useRef(0), jn = N.useRef(0), [hs, J] = N.useState(null), [ps, me] = N.useState(!1), [X, Hn] = N.useState(
    () => fn.draft
  ), [Pn, an] = N.useState(
    () => {
      var c;
      const n = ((c = fn.draft) == null ? void 0 : c.matrix.receiverChannels) ?? [], a = /* @__PURE__ */ new Map();
      for (const d of t.channels) {
        const g = d.pnn.trim().normalize("NFC");
        a.set(g, (a.get(g) ?? 0) + 1);
      }
      return new Set(n.filter((d) => a.get(d) === 1));
    }
  ), [ms, Ye] = N.useState(
    () => fn.error
  ), [Ce, Ge] = N.useState(!1), [Yn, gs] = N.useState(!1), [Xn, fs] = N.useState(
    () => {
      var n;
      return ((n = p[0]) == null ? void 0 : n.id) ?? "";
    }
  ), [kt, Jn] = N.useState(!1), [Qn, ve] = N.useState(null), [Di, Re] = N.useState(!1), [zi, We] = N.useState(null), Ae = N.useRef(!1), xs = N.useRef(null), vs = N.useRef(null), wn = N.useRef(null), B = Di || S !== null, Xe = Math.max(0, Math.floor(T)), _i = Math.max(
    0,
    Math.floor(C ?? t.fcs.nEvents)
  ), Je = p.find(
    ({ id: n }) => n === Xn
  ) ?? p[0] ?? null;
  N.useEffect(() => {
    var n;
    Xn && p.some(({ id: a }) => a === Xn) || (fs(((n = p[0]) == null ? void 0 : n.id) ?? ""), Jn(!1));
  }, [p, Xn]);
  const re = S ?? (Qn ? {
    phase: "applying",
    profileName: zi ?? (X == null ? void 0 : X.fileName) ?? "Compensation",
    fraction: Qn.fraction,
    processedEvents: Qn.processedEvents,
    totalEvents: Qn.totalEvents
  } : null);
  N.useEffect(() => {
    O || (jn.current++, Ee.current++, sn({ state: "idle" }), yn(null), bn(null), L == null || L());
  }, [L, O]);
  const Et = N.useMemo(
    () => t.channels.map(({ pnn: n, columnIndex: a }) => ({ pnn: n, columnIndex: a })),
    [t]
  ), Ke = N.useMemo(() => {
    if (!ee) return null;
    const n = ee.channels.map((d) => {
      const g = t.index(d);
      return g === void 0 ? null : t.channels[g].pnn;
    });
    if (n.some((d) => d === null))
      return {
        validation: null,
        error: "The embedded matrix could not be mapped back to exact FCS channel identities.",
        keyword: void 0
      };
    const a = ct({
      sourceChannels: n,
      receiverChannels: n,
      matrix: ee.matrix
    }, "flow-spillover"), c = ["$SPILLOVER", "$SPILL", "SPILL"].find((d) => typeof t.fcs.keywords[d] == "string");
    return {
      validation: a,
      error: a.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${a.errors.map(({ message: d }) => d).join(" ")}`,
      keyword: c
    };
  }, [t, ee]), Q = vn === "all" ? null : E.find(({ id: n }) => n === vn) ?? null, he = Q ? F[Q.id] ?? null : null, ce = he ? (Q == null ? void 0 : Q.eventCount) ?? 0 : t.fcs.nEvents, et = vt === "all" ? "all" : oi.includes(Number(vt)) ? Number(vt) : ai, In = N.useMemo(
    () => hn(
      t.fcs.nEvents,
      et === "all" ? Math.max(1, t.fcs.nEvents) : et,
      he
    ),
    [et, ce, he, t]
  ), Rn = N.useMemo(
    () => hn(t.fcs.nEvents, 2048, he),
    [he, t]
  ), At = N.useMemo(
    () => hn(
      t.fcs.nEvents,
      na,
      he
    ),
    [he, t]
  );
  N.useEffect(() => {
    vn !== "all" && !E.some(({ id: n }) => n === vn) && jt("all");
  }, [vn, E, jt]), N.useEffect(() => {
    Ee.current++, R == null || R(), He({}), rn({}), bn(null), yn(null), xe(null);
  }, [vn, he, R]);
  const de = N.useMemo(() => X ? fr({
    kind: "cytof-spillover",
    matrix: X.matrix,
    sampleChannels: Et,
    includedChannels: Array.from(Pn)
  }) : null, [X, Pn, Et, H]), u = N.useMemo(() => {
    var a;
    if (ee) {
      const c = t.spilloverOrigin, d = c.kind === "external" ? c : null;
      return {
        sourceAxisKeys: ee.channels,
        receiverAxisKeys: ee.channels,
        sourceChannels: ee.channels.map((g) => ft(t, g)),
        receiverChannels: ee.channels.map((g) => ft(t, g)),
        matrix: ee.matrix,
        kind: "flow",
        title: pe ? "SCE spillover matrix" : d ? `Compensation matrix from ${d.label}` : "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: d ? "This FCS carries no spillover matrix of its own; these coefficients came from the imported FlowJo workspace and are applied unchanged." + (d.droppedChannels.length ? ` ${d.droppedChannels.length} of its parameter(s) are not in this file (${d.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "") : "Applying the embedded matrix leaves its coefficients unchanged." + (c.kind === "fcs" && ((a = c.droppedChannels) != null && a.length) ? ` ${c.droppedChannels.length} of its parameter(s) are not among this file's channels (${c.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "")
      };
    }
    if (!j || !D) return null;
    const n = j.scientific.kind === "cytof-spillover" ? Sr(j.scientific.matrix) : j.scientific.matrix;
    return n.matrix.length !== n.sourceChannels.length || n.matrix.some((c) => !c || c.length !== n.receiverChannels.length) ? null : {
      sourceAxisKeys: n.sourceChannels,
      receiverAxisKeys: n.receiverChannels,
      sourceChannels: n.sourceChannels.map((c) => qt(t, c)),
      receiverChannels: n.receiverChannels.map((c) => qt(t, c)),
      matrix: n.matrix,
      kind: j.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: j.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: j.scientific.kind === "cytof-spillover" ? s("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: n.sourceChannels.length,
        receivers: n.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: j.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [pe, D, j, t, ee, s, H]), ie = (u == null ? void 0 : u.sourceChannels) ?? [], ae = (u == null ? void 0 : u.receiverChannels) ?? [];
  N.useEffect(() => {
    Nt((n) => Math.max(1, Math.min(li, Math.round(n) || 1)));
  }, [Nt]);
  const nt = xt ?? Be, b = N.useMemo(() => {
    if (!u || !nt) return null;
    const [n, a] = nt.split(ze), c = u.sourceAxisKeys.indexOf(n), d = u.receiverAxisKeys.indexOf(a);
    return c < 0 || d < 0 || u.sourceAxisKeys[c] === u.receiverAxisKeys[d] ? null : {
      pairKey: nt,
      sourceIndex: c,
      receiverIndex: d,
      source: ie[c],
      receiver: ae[d],
      value: u.matrix[c][d],
      interaction: u.kind === "cytof" ? kn(
        u.sourceAxisKeys[c],
        u.receiverAxisKeys[d]
      ) : null
    };
  }, [nt, u, ae, ie]);
  N.useEffect(() => {
    if (!b) {
      Mt("");
      return;
    }
    const n = Y[b.pairKey];
    Mt(se((n ?? b.value) * 100, 6));
  }, [b == null ? void 0 : b.pairKey, b == null ? void 0 : b.value, Y]);
  const ye = N.useMemo(() => b ? _t(
    t,
    b.source.key,
    b.receiver.key,
    {
      eventMask: he,
      fixedEventIndices: In,
      eligibleEventCount: ce
    }
  ) : null, [o, q.state, In, ce, he, t, b]), Se = N.useMemo(() => {
    if (!u || q.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const n = [];
    for (let g = 0; g < u.matrix.length; g++)
      for (let f = 0; f < u.matrix[g].length; f++) {
        const y = u.sourceAxisKeys[g], z = u.receiverAxisKeys[f];
        if (y === z) continue;
        const U = u.matrix[g][f];
        if (!Number.isFinite(U)) continue;
        const K = u.kind === "cytof" ? kn(y, z) : null, G = K !== null && K !== "self" && K !== "other";
        U === 0 && !G && Ve === "biological" || n.push({
          sourceIndex: g,
          receiverIndex: f,
          pairKey: `${y}${ze}${z}`,
          source: ie[g],
          receiver: ae[f],
          coefficient: U,
          interaction: K,
          physicalPrior: G ? 1 : 0
        });
      }
    n.sort((g, f) => f.physicalPrior - g.physicalPrior || Math.abs(f.coefficient) - Math.abs(g.coefficient));
    const a = n.slice(0, 240), c = a.flatMap((g) => {
      const f = _t(
        t,
        g.source.key,
        g.receiver.key,
        {
          eventMask: he,
          fixedEventIndices: Rn,
          eligibleEventCount: ce
        }
      );
      return f.ready ? [{ ...g, evidence: f.preview.evidence }] : [];
    }), d = Ir(
      c.map(({ coefficient: g, physicalPrior: f, evidence: y }) => ({ coefficient: g, physicalPrior: f, evidence: y })),
      u.kind,
      Ve
    ).map(({ index: g, relativePriority: f }) => ({ ...c[g], relativePriority: f }));
    return {
      candidateCount: n.length,
      screenedCount: a.length,
      evaluableCount: c.length,
      items: d.slice(0, 8)
    };
  }, [$i, Ve, q.state, u, ae, Rn, ce, he, t, ie]), oe = N.useMemo(() => new Set(
    j ? j.scientific.kind === "flow-spillover" ? j.scientific.matrix.receiverChannels : j.scientific.includedChannels : []
  ), [j]), le = N.useMemo(() => u ? Or(
    t,
    Array.from(/* @__PURE__ */ new Set([
      ...u.sourceAxisKeys,
      ...u.receiverAxisKeys
    ])),
    {
      eventMask: he,
      fixedEventIndices: At,
      eligibleEventCount: ce
    }
  ) : null, [
    o,
    At,
    q.state,
    u,
    ce,
    he,
    t
  ]);
  N.useEffect(() => {
    if (!u || oe.size === 0) return;
    const n = oe.has(ke) ? ke : u.sourceAxisKeys.find((c) => oe.has(c)) ?? "", a = oe.has(Ne) && Ne !== n ? Ne : u.receiverAxisKeys.find((c) => c !== n && oe.has(c)) ?? "";
    n !== ke && ls(n), a !== Ne && Ct(a);
  }, [oe, Ne, ke, u]);
  const Nn = N.useMemo(() => new Set(Gn), [Gn]), Tt = N.useMemo(() => {
    var c;
    if (!u) return [];
    const n = [], a = oe.size > 0;
    for (let d = 0; d < u.sourceAxisKeys.length; d++) {
      const g = u.sourceAxisKeys[d];
      if (!(a && !oe.has(g)))
        for (let f = 0; f < u.receiverAxisKeys.length; f++) {
          const y = u.receiverAxisKeys[f];
          if (g === y || a && !oe.has(y)) continue;
          const z = (c = u.matrix[d]) == null ? void 0 : c[f];
          if (!Number.isFinite(z)) continue;
          const U = ie[d], K = ae[f];
          if (!U || !K || le != null && le.ready && (!le.dataset.channels.has(U.key) || !le.dataset.channels.has(K.key))) continue;
          const G = u.kind === "cytof" ? kn(g, y) : null, te = G !== null && G !== "self" && G !== "other";
          n.push({
            sourceIndex: d,
            receiverIndex: f,
            pairKey: `${g}${ze}${y}`,
            source: U,
            receiver: K,
            coefficient: z,
            interaction: G,
            physicalPrior: te ? 1 : 0
          });
        }
    }
    return n;
  }, [le, oe, u, ae, ie]), Le = N.useMemo(() => {
    const n = Tn.trim().toLocaleLowerCase();
    return Tt.filter((a) => {
      const c = Math.abs(a.coefficient) > 1e-12, d = a.physicalPrior > 0;
      return Pe === "all" || Pe === "relevant" && (c || d) || Pe === "nonzero" && c || Pe === "physical" && d || Pe === "flagged" && Nn.has(a.pairKey) ? n ? `${a.source.combined} ${a.receiver.combined}`.toLocaleLowerCase().includes(n) : !0 : !1;
    });
  }, [Nn, Tt, Pe, Tn]);
  N.useEffect(() => {
    var a;
    if (!yt || Me !== "global") return;
    const n = [...((a = wn.current) == null ? void 0 : a.querySelectorAll(".gl-comp-global-tile")) ?? []].find((c) => c.dataset.pairKey === yt);
    n && (n.scrollIntoView({ block: "center", inline: "center" }), os(null));
  }, [Fn, Ie, yt, Le, Me]);
  const Ft = N.useMemo(() => {
    if (Ie === "compact") return [];
    const n = /* @__PURE__ */ new Map();
    for (const a of Le) {
      const c = Ie === "source" ? a.source : a.receiver, d = n.get(c.key);
      d ? d.pairs.push(a) : n.set(c.key, { channel: c, pairs: [a] });
    }
    return [...n.values()];
  }, [Ie, Le]), bs = N.useMemo(
    () => Ie === "compact" ? Le : Ft.flatMap((n) => n.pairs),
    [Ft, Ie, Le]
  ), ys = `${s(Qr[Pe])}${Tn.trim() ? s(" · search “{query}”", { query: Tn.trim() }) : ""}`, $t = Math.max(120, Math.min(220, Math.round(bi) || 120)), Qe = Math.max(1, Math.min(10, Math.round(ji) || 6)), tt = Math.max(0.1, Math.min(1, Number(Ni) || 0.85)), st = Math.max(0.3, Math.min(3, Number(Si) || 1)), ne = N.useMemo(() => !j || !u || q.state !== "ready" ? [] : Gn.flatMap((n) => {
    const [a, c] = n.split(ze), d = u.sourceAxisKeys.indexOf(a), g = u.receiverAxisKeys.indexOf(c);
    if (d < 0 || g < 0 || a === c || !oe.has(a) || !oe.has(c)) return [];
    const f = _t(
      t,
      ie[d].key,
      ae[g].key,
      {
        eventMask: he,
        fixedEventIndices: Rn,
        eligibleEventCount: ce
      }
    );
    if (!f.ready) return [];
    const y = Se.items.find((z) => z.pairKey === n);
    return [{
      sourceIndex: d,
      receiverIndex: g,
      pairKey: n,
      source: ie[d],
      receiver: ae[g],
      coefficient: u.matrix[d][g],
      interaction: u.kind === "cytof" ? kn(a, c) : null,
      physicalPrior: u.kind === "cytof" && kn(a, c) !== "other" ? 1 : 0,
      evidence: f.preview.evidence,
      relativePriority: (y == null ? void 0 : y.relativePriority) ?? 0
    }];
  }), [Gn, oe, q.state, u, j, ae, Se.items, Rn, ce, he, t, ie]), Oe = ne, js = N.useMemo(() => {
    if (!j) return 0.01;
    const n = [];
    for (let a = 0; a < j.scientific.matrix.matrix.length; a++) {
      const c = j.scientific.matrix.sourceChannels[a];
      for (let d = 0; d < j.scientific.matrix.matrix[a].length; d++) {
        if (c === j.scientific.matrix.receiverChannels[d]) continue;
        const g = Math.abs(j.scientific.matrix.matrix[a][d]);
        Number.isFinite(g) && g > 1e-12 && n.push(g);
      }
    }
    return n.length > 0 ? Xt(n) : 0.01;
  }, [j]), Pt = (n, a) => {
    const c = Ti[n];
    if (c) return c;
    const d = hi(a, js, (u == null ? void 0 : u.kind) ?? "flow");
    return {
      lowerPercent: se(d.lower * 100, 5),
      upperPercent: se(d.upper * 100, 5)
    };
  }, Kn = (n, a) => {
    const c = Pt(n, a), d = Number(c.lowerPercent) / 100, g = Number(c.upperPercent) / 100;
    return !Number.isFinite(d) || !Number.isFinite(g) ? { lower: d, upper: g, error: "Enter finite lower and upper sweep bounds." } : (u == null ? void 0 : u.kind) === "cytof" && d < 0 ? { lower: d, upper: g, error: "CyTOF NNLS sweep bounds cannot be negative." } : g > d ? { lower: d, upper: g, error: null } : { lower: d, upper: g, error: "The upper sweep bound must be greater than the lower bound." };
  }, it = (n, a, c, d) => {
    Fi((g) => ({
      ...g,
      [n]: {
        ...g[n] ?? (() => {
          const f = hi(a, js, (u == null ? void 0 : u.kind) ?? "flow");
          return {
            lowerPercent: se(f.lower * 100, 5),
            upperPercent: se(f.upper * 100, 5)
          };
        })(),
        [c]: d
      }
    })), He((g) => {
      if (!(n in g)) return g;
      const f = { ...g };
      return delete f[n], f;
    }), rn((g) => {
      if (!(n in g)) return g;
      const f = { ...g };
      return delete f[n], f;
    });
  }, Ln = (n, a) => {
    Ei((c) => a ? c.includes(n) ? c : [...c, n] : c.filter((d) => d !== n)), a ? (we(n), $n(n)) : (He((c) => {
      if (!(n in c)) return c;
      const d = { ...c };
      return delete d[n], d;
    }), rn((c) => {
      if (!(n in c)) return c;
      const d = { ...c };
      return delete d[n], d;
    }));
  }, Ui = () => {
    if (!u || !ke || !Ne || ke === Ne) return;
    if (!oe.has(ke) || !oe.has(Ne)) {
      xe("Both channels must be included in the installed compensation solve.");
      return;
    }
    const n = `${ke}${ze}${Ne}`;
    Ln(n, !0), xe(null);
  }, It = Oe.reduce((n, a) => n + (Kn(a.pairKey, a.coefficient).error ? 1 : 0), 0), Cn = N.useMemo(() => {
    if (!j) return null;
    const n = j.scientific.matrix.matrix.map((a) => Array.from(a));
    for (const [a, c] of Object.entries(Y)) {
      const [d, g] = a.split(ze), f = j.scientific.matrix.sourceChannels.indexOf(d), y = j.scientific.matrix.receiverChannels.indexOf(g);
      f >= 0 && y >= 0 && (n[f][y] = c);
    }
    return Object.freeze(n.map((a) => Object.freeze(a)));
  }, [j, Y]);
  N.useEffect(() => {
    const n = Object.keys(Y).length;
    if (!O || n === 0 || !j || j.scientific.kind !== "flow-spillover" || q.state !== "ready" || !Cn || !b || !w) {
      jn.current++, sn({ state: "idle" });
      return;
    }
    const a = In;
    if (a.length === 0) {
      sn({
        state: "error",
        pairKey: b.pairKey,
        message: s("The selected review population contains no events.")
      });
      return;
    }
    const c = ++jn.current, d = b.pairKey;
    sn((f) => ({
      state: "updating",
      pairKey: d,
      ...(f.state === "ready" || f.state === "updating") && f.pairKey === d && f.preview ? { preview: f.preview } : {}
    }));
    const g = window.setTimeout(() => {
      w(
        j,
        a,
        Cn
      ).then((f) => {
        if (jn.current !== c) return;
        const y = f.sourceChannels.indexOf(b.source.pnn), z = f.sourceChannels.indexOf(b.receiver.pnn);
        if (y < 0 || z < 0)
          throw new Error(s("The preview result did not contain the selected flow channels."));
        const U = Ut(
          t,
          b.source.pnn,
          b.receiver.pnn,
          a,
          f.candidateColumns[y],
          f.candidateColumns[z],
          { totalEvents: ce }
        );
        if (!U.ready) throw new Error(U.reason);
        sn({
          state: "ready",
          pairKey: d,
          preview: U.preview
        });
      }).catch((f) => {
        if (jn.current !== c) return;
        const y = f instanceof Error ? f.message : String(f);
        /cancel|supersed|stale/i.test(y) || sn({ state: "error", pairKey: d, message: y });
      });
    }, 90);
    return () => window.clearTimeout(g);
  }, [
    q.state,
    w,
    j,
    In,
    ce,
    t,
    t.dataRevision,
    t.displayTransformContextKey,
    t.layerRevision,
    b,
    Y,
    s,
    O,
    Cn
  ]);
  const Bi = N.useMemo(() => !u || Object.keys(Y).length === 0 ? null : {
    sourceChannels: u.sourceAxisKeys,
    receiverChannels: u.receiverAxisKeys,
    matrix: u.matrix.map(
      (n, a) => n.map((c, d) => {
        const g = `${u.sourceAxisKeys[a]}${ze}${u.receiverAxisKeys[d]}`;
        return Y[g] ?? c;
      })
    )
  }, [u, Y]), ws = N.useMemo(() => {
    if (!u) return [];
    const n = [];
    for (let a = 0; a < u.matrix.length; a++)
      for (let c = 0; c < u.matrix[a].length; c++) {
        const d = u.matrix[a][c];
        u.sourceAxisKeys[a] === u.receiverAxisKeys[c] || !Number.isFinite(d) || d <= 1 || n.push(`${ie[a].combined} → ${ae[c].combined}`);
      }
    return n;
  }, [u, ae, ie]), Rt = N.useMemo(() => {
    if (!u) return [];
    const n = [];
    for (let a = 0; a < u.matrix.length; a++)
      for (let c = 0; c < u.matrix[a].length; c++) {
        const d = u.matrix[a][c], g = u.sourceAxisKeys[a] === u.receiverAxisKeys[c], f = `${ie[a].combined} → ${ae[c].combined}`;
        Number.isFinite(d) ? g && Math.abs(d - 1) > 1e-8 ? n.push(`${ie[a].combined}: diagonal is ${nn(d)}, not 100%`) : !g && d < 0 ? n.push(`${f}: negative coefficient (${nn(d)})`) : !g && d > 1 && n.push(`${f}: coefficient above 100%`) : n.push(`${f}: non-finite coefficient (${String(d)})`);
      }
    return n;
  }, [u, ae, ie]), Ns = N.useMemo(
    () => (u == null ? void 0 : u.matrix.some((n) => n.some((a) => !Number.isFinite(a)))) ?? !1,
    [u]
  ), Te = N.useMemo(
    () => D && q.state === "ready" ? ua(t, D.includedPnns) : null,
    [q.state, D, t]
  ), rt = N.useMemo(() => {
    const n = [...Rt];
    return q.state === "stale" && n.push(...q.reasons.map((a) => `Profile unavailable: ${ra(a)}`)), n;
  }, [q, Rt]), Cs = D ? (j == null ? void 0 : j.name) ?? "Installed compensation profile" : ee ? pe ? "SCE spillover matrix" : "Embedded FCS matrix" : "No compatible matrix", Vi = D ? ia(D.kind, D.method) : ee ? "Flow linear inverse" : "Not configured", at = s(Vi), Kt = (D == null ? void 0 : D.includedPnns.length) ?? (ee == null ? void 0 : ee.channels.length) ?? 0, ot = (j == null ? void 0 : j.name) ?? (D == null ? void 0 : D.profileId) ?? Cs, Ss = Vt(ot), qi = Ss !== ot || (j == null ? void 0 : j.recordType) === "revision" ? `${Ss} · ${s("revised")}` : ot, Gi = ee !== null && !Ns || D !== null && q.state === "ready", Ms = N.useMemo(() => {
    if (!u) return 0;
    let n = 0;
    for (let a = 0; a < u.matrix.length; a++)
      for (let c = 0; c < u.matrix[a].length; c++) {
        if (u.sourceAxisKeys[a] === u.receiverAxisKeys[c]) continue;
        const d = u.matrix[a][c];
        Number.isFinite(d) && (n = Math.max(n, Math.abs(d)));
      }
    return n;
  }, [u]), Sn = !!((j == null ? void 0 : j.scientific.kind) === "flow-spillover" && q.state === "ready" && u && Math.max(u.sourceAxisKeys.length, u.receiverAxisKeys.length) <= ta), on = u ? Sn ? Math.max(42, Math.min(54, Math.floor(960 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : Math.max(13, Math.min(38, Math.floor(760 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : 13, On = N.useMemo(() => {
    const n = Sn ? 9.5 : 8, a = [...ie, ...ae].map((K) => K.combined), c = typeof document > "u" ? null : document.createElement("canvas").getContext("2d");
    c && (c.font = `${n}px ${Jr}`);
    const d = (K) => c ? c.measureText(K).width : K.length * n * 0.55, g = a.reduce((K, G) => Math.max(K, d(G)), 0), f = Math.min(320, Math.max(94, Math.ceil(g) + 12)), y = Math.min(260, Math.max(82, Math.ceil(g) + 6)), z = Math.max(88, Math.ceil(y * Math.sin(si) + 12)), U = Math.max(0, Math.ceil(y * Math.cos(si) - on / 2));
    return { rowLabelWidth: f, columnLabelWidth: y, columnLabelHeight: z, overhang: U };
  }, [Sn, on, ae, ie]);
  N.useEffect(() => {
    Wn({}), tn({}), sn({ state: "idle" }), jn.current++;
  }, [j == null ? void 0 : j.profileId]), N.useEffect(() => {
    (u == null ? void 0 : u.kind) === "flow" && Pe === "physical" && qn("relevant");
  }, [Pe, u == null ? void 0 : u.kind, qn]);
  const Wi = (n) => {
    is((a) => ({ ...a, [n]: !a[n] }));
  }, ks = (n) => {
    var d;
    const a = ((d = wn.current) == null ? void 0 : d.getBoundingClientRect().width) ?? 1100, c = Math.max(360, Math.min(900, a - 440 - 8));
    return Math.max(360, Math.min(c, Math.round(n)));
  }, Zi = (n) => {
    var g;
    if (n.button !== 0) return;
    n.preventDefault();
    const a = n.currentTarget;
    (g = a.setPointerCapture) == null || g.call(a, n.pointerId);
    const c = (f) => {
      var z;
      const y = (z = wn.current) == null ? void 0 : z.getBoundingClientRect();
      y && rs(ks(y.right - f.clientX));
    }, d = () => {
      var f;
      window.removeEventListener("pointermove", c), window.removeEventListener("pointerup", d), window.removeEventListener("pointercancel", d), (f = a.releasePointerCapture) == null || f.call(a, n.pointerId);
    };
    window.addEventListener("pointermove", c), window.addEventListener("pointerup", d), window.addEventListener("pointercancel", d);
  }, Hi = (n) => {
    let a = null;
    n.key === "ArrowLeft" ? a = xn + 40 : n.key === "ArrowRight" ? a = xn - 40 : n.key === "Home" && (a = ci), a !== null && (n.preventDefault(), rs(ks(a)));
  }, Yi = async (n) => {
    var c;
    const a = (c = n.currentTarget.files) == null ? void 0 : c[0];
    n.currentTarget.value = "", a && await As(a);
  }, Es = () => void br(xs.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "CyTOF spillover matrix").then((n) => {
    n != null && n[0] && As(n[0]);
  }), As = async (n) => {
    Ye(null), J(null), me(!1), ve(null), Ge(!1);
    try {
      const a = wr(await n.text()), c = ct(
        a.input,
        "cytof-spillover"
      );
      if (!c.ok)
        throw new Error(c.errors.map(({ message: f }) => f).join(" "));
      const d = /* @__PURE__ */ new Map();
      for (const { pnn: f } of Et) {
        const y = f.trim().normalize("NFC");
        d.set(y, (d.get(y) ?? 0) + 1);
      }
      const g = c.value.receiverChannels.filter(
        (f) => d.get(f) === 1
      );
      Hn({
        fileName: n.name,
        source: "file",
        parsed: a,
        matrix: c.value,
        validationWarnings: c.warnings
      }), an(new Set(g));
    } catch (a) {
      Hn(null), an(/* @__PURE__ */ new Set()), Ye(a instanceof Error ? a.message : String(a));
    }
  }, Xi = (n, a) => {
    an((c) => {
      const d = new Set(c);
      return a ? d.add(n) : d.delete(n), d;
    });
  }, Ts = async () => {
    var c, d;
    if (!X)
      throw new Error(s("Choose a CyTOF spillover matrix first."));
    const n = ((d = (c = globalThis.crypto) == null ? void 0 : c.randomUUID) == null ? void 0 : d.call(c)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, a = X.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation";
    return zt(
      {
        kind: "cytof-spillover",
        method: "nnls",
        solverVersion: Nr,
        solverSettings: Cr,
        matrix: X.matrix,
        includedChannels: Array.from(Pn)
      },
      {
        profileId: `cytof-${n}`,
        name: a,
        createdAt: /* @__PURE__ */ new Date(),
        origin: {
          type: "uploaded",
          fileName: X.fileName,
          format: X.parsed.format.delimiter,
          sourceColumnHeader: X.parsed.format.sourceColumnHeader
        },
        provenance: {
          sourceDescription: X.source === "host" ? "CyTOF spillover matrix from metadata(sce)$spillover_matrix" : "User-uploaded CyTOF spillover matrix",
          estimationMethod: "Imported; coefficients preserved exactly"
        }
      }
    );
  }, Ji = async () => {
    if (!(Ae.current || B || !X || !(de != null && de.canApply) || !l)) {
      if (m && !Ce) {
        Ye(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      Ye(null), J(null), ve(null), Ae.current = !0, Re(!0), We(X.fileName);
      try {
        const n = await Ts();
        await l(n, ve), J(s("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: n.name,
          channels: Pn.size,
          files: Xe
        })), Hn(null), an(/* @__PURE__ */ new Set()), Ge(!1), ve(null);
      } catch (n) {
        const a = n instanceof Error ? n.message : String(n);
        /cancel/i.test(a) ? J(s("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : Ye(a);
      } finally {
        Ae.current = !1, Re(!1), We(null);
      }
    }
  }, Qi = async () => {
    if (!(Ae.current || B || !X || !(de != null && de.canApply) || !Je || !x || !kt)) {
      if (m && !Ce) {
        Ye(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before adopting the assay.")
        );
        return;
      }
      Ye(null), J(null), ve(null), Ae.current = !0, Re(!0), We(Je.label);
      try {
        const n = await Ts();
        await x(
          n,
          Je,
          ve
        ), J(s("Using existing SCE assay {assay} with {matrix}. No assay values were recomputed.", {
          assay: Je.label,
          matrix: n.name
        })), Hn(null), an(/* @__PURE__ */ new Set()), Ge(!1), Jn(!1), ve(null);
      } catch (n) {
        Ye(n instanceof Error ? n.message : String(n));
      } finally {
        Ae.current = !1, Re(!1), We(null);
      }
    }
  }, er = async () => {
    var d, g;
    if (Ae.current || B || !l) return;
    if (m && !Ce) {
      me(!0), J(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before starting a matrix.")
      );
      return;
    }
    const n = t.channels.map((f, y) => ({ pnn: f.pnn, index: y })).filter(({ index: f }) => t.isFluorChannel(f) && !t.isImagingFeatureChannel(f)).map(({ pnn: f }) => f);
    if (n.length < 2) {
      me(!0), J(s("An empty matrix needs at least two fluorescence channels."));
      return;
    }
    const a = ct({
      sourceChannels: n,
      receiverChannels: n,
      matrix: n.map((f, y) => n.map((z, U) => y === U ? 1 : 0))
    }, "flow-spillover");
    if (!a.ok) {
      me(!0), J(a.errors.map(({ message: f }) => f).join(" "));
      return;
    }
    const c = `${i.replace(/\.fcs$/i, "") || "Flow"} manual matrix`;
    J(null), me(!1), ve(null), Ae.current = !0, Re(!0), We(c);
    try {
      const f = ((g = (d = globalThis.crypto) == null ? void 0 : d.randomUUID) == null ? void 0 : g.call(d)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, y = await zt(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: _s,
          solverSettings: zs,
          matrix: a.value
        },
        {
          profileId: `flow-manual-${f}`,
          name: c,
          createdAt: /* @__PURE__ */ new Date(),
          origin: { type: "manual", startedAs: "identity" },
          provenance: {
            sourceDescription: "Identity matrix over the file's fluorescence channels, to be set by hand in GateLab",
            estimationMethod: "Manual"
          }
        }
      );
      await l(y, ve), Ge(!1), J(s("Manual matrix editing is ready: every spillover starts at zero. Select a pair and set its coefficient."));
    } catch (f) {
      me(!0), J(f instanceof Error ? f.message : String(f));
    } finally {
      Ae.current = !1, Re(!1);
    }
  }, nr = async () => {
    if (!(!h || B || Yn)) {
      if (m && !Ce) {
        me(!0), J(
          s("Confirm that existing gate memberships will be recomputed in original coordinates before removing the matrix.")
        );
        return;
      }
      gs(!0);
      try {
        await h(), me(!1), J(s("The matrix was removed. The original assay is active and every file reads its stored values."));
      } catch (n) {
        me(!0), J(n instanceof Error ? n.message : String(n));
      } finally {
        gs(!1);
      }
    }
  }, tr = async () => {
    var a, c, d;
    if (Ae.current || B || !ee || !((a = Ke == null ? void 0 : Ke.validation) != null && a.ok) || !l) return;
    if (m && !Ce) {
      me(!0), J(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const n = (pe == null ? void 0 : pe.name) || `${i.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    J(null), me(!1), ve(null), Ae.current = !0, Re(!0), We(n);
    try {
      const g = ((d = (c = globalThis.crypto) == null ? void 0 : c.randomUUID) == null ? void 0 : d.call(c)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, f = await zt(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: _s,
          solverSettings: zs,
          matrix: Ke.validation.value
        },
        {
          profileId: `flow-${g}`,
          name: n,
          createdAt: /* @__PURE__ */ new Date(),
          origin: {
            ...pe ? {
              type: "uploaded",
              fileName: pe.name,
              format: "csv",
              sourceColumnHeader: "source"
            } : {
              type: "embedded-fcs",
              fileName: i,
              ...Ke.keyword ? { keyword: Ke.keyword } : {}
            }
          },
          provenance: {
            sourceDescription: pe ? "Flow spillover matrix from metadata(sce)$spillover_matrix" : "Spillover matrix embedded in the source FCS file",
            estimationMethod: pe ? "Imported from SCE metadata; coefficients preserved exactly" : "Imported from FCS; coefficients preserved exactly"
          }
        }
      );
      await l(f, ve), Ge(!1), J(s(pe ? "Flow matrix editing is ready. The exact hosted matrix is retained as the baseline, and Original measurements remain available." : "Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available."));
    } catch (g) {
      me(!0), J(g instanceof Error ? g.message : String(g));
    } finally {
      Ae.current = !1, Re(!1), We(null), ve(null);
    }
  }, Fs = (n, a) => {
    var g, f;
    const c = ie[n], d = ae[a];
    !u || !c || !d || u.sourceAxisKeys[n] === u.receiverAxisKeys[a] || (we(`${u.sourceAxisKeys[n]}${ze}${u.receiverAxisKeys[a]}`), (f = (g = vs.current) == null ? void 0 : g.querySelector(
      `button[data-source-index="${n}"][data-receiver-index="${a}"]`
    )) == null || f.focus());
  }, sr = (n, a, c) => {
    if (!u) return;
    const d = u.sourceAxisKeys.length, g = u.receiverAxisKeys.length;
    let f = a, y = c;
    const z = (K, G) => {
      let te = K + G;
      for (; te >= 0 && te < g; ) {
        if (u.sourceAxisKeys[a] !== u.receiverAxisKeys[te]) return te;
        te += G;
      }
      return K;
    }, U = (K, G) => {
      let te = K + G;
      for (; te >= 0 && te < d; ) {
        if (u.sourceAxisKeys[te] !== u.receiverAxisKeys[c]) return te;
        te += G;
      }
      return K;
    };
    switch (n.key) {
      case "ArrowLeft":
        y = z(c, -1);
        break;
      case "ArrowRight":
        y = z(c, 1);
        break;
      case "ArrowUp":
        f = U(a, -1);
        break;
      case "ArrowDown":
        f = U(a, 1);
        break;
      case "Home": {
        y = u.sourceAxisKeys[a] === u.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const K = g - 1;
        y = u.sourceAxisKeys[a] === u.receiverAxisKeys[K] ? K - 1 : K;
        break;
      }
      default:
        return;
    }
    n.preventDefault(), Fs(f, y);
  }, Dn = (n, a) => {
    if (!j || !Number.isFinite(a)) return;
    const [c, d] = n.split(ze), g = j.scientific.matrix.sourceChannels.indexOf(c), f = j.scientific.matrix.receiverChannels.indexOf(d);
    if (g < 0 || f < 0) return;
    if (j.scientific.kind === "cytof-spillover" && a < 0) {
      me(!0), J(s("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const y = j.scientific.matrix.matrix[g][f];
    Wn((z) => {
      const U = { ...z };
      return a === y ? delete U[n] : U[n] = a, U;
    }), me(!1), J(s("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: c,
      receiver: d,
      value: (a * 100).toFixed(2)
    }));
  }, $s = (n, a, c, d) => {
    const g = c[0];
    if (!g) return null;
    const f = g.sourceChannels.indexOf(n.source.pnn), y = g.sourceChannels.indexOf(n.receiver.pnn);
    if (f < 0 || y < 0) return null;
    const z = Ut(
      t,
      n.source.pnn,
      n.receiver.pnn,
      d,
      g.currentColumns[f],
      g.currentColumns[y],
      { totalEvents: ce }
    );
    if (!z.ready) return null;
    const U = [{
      value: n.coefficient,
      isCurrent: !0,
      preview: z.preview
    }];
    return c.forEach((K, G) => {
      const te = K.sourceChannels.indexOf(n.source.pnn), De = K.sourceChannels.indexOf(n.receiver.pnn);
      if (te < 0 || De < 0) return;
      const je = Ut(
        t,
        n.source.pnn,
        n.receiver.pnn,
        d,
        K.candidateColumns[te],
        K.candidateColumns[De],
        {
          totalEvents: ce,
          xRange: z.preview.xRange,
          yRange: z.preview.yRange
        }
      );
      je.ready && U.push({
        value: a[G],
        isCurrent: !1,
        preview: je.preview
      });
    }), U.sort((K, G) => K.value - G.value || Number(G.isCurrent) - Number(K.isCurrent)), { pairKey: n.pairKey, values: Object.freeze(U) };
  }, ir = async (n) => {
    if (!j || !u || !A || B || ue || be) return;
    const a = Kn(n.pairKey, n.coefficient);
    if (a.error) {
      xe(a.error);
      return;
    }
    const c = hn(
      t.fcs.nEvents,
      ri,
      he
    );
    if (c.length === 0) {
      xe(s("The selected review population contains no events."));
      return;
    }
    const d = ++Ee.current, g = [a.lower, a.upper];
    bn(n.pairKey), xe(null);
    try {
      const f = await A(
        j,
        c,
        g.map((z) => ui(
          j,
          u.sourceAxisKeys[n.sourceIndex],
          u.receiverAxisKeys[n.receiverIndex],
          z
        )),
        void 0,
        1
      );
      if (Ee.current !== d) return;
      const y = $s(n, g, f, c);
      if (!y) throw new Error(s("The fast bounds preview could not be built for this pair."));
      rn((z) => ({ ...z, [n.pairKey]: y }));
    } catch (f) {
      if (Ee.current !== d) return;
      const y = f instanceof Error ? f.message : String(f);
      xe(/cancel/i.test(y) ? s("Fast bounds preview cancelled.") : y);
    } finally {
      Ee.current === d && bn(null);
    }
  }, rr = async () => {
    var d;
    if (!j || !A || Oe.length === 0 || B || ue !== null || be !== null) return;
    if (It > 0) {
      xe(s("Fix the sweep bounds for {count} flagged pairs before running.", { count: It }));
      return;
    }
    const n = hn(
      t.fcs.nEvents,
      ii,
      he
    );
    if (n.length === 0) {
      xe(s("The selected review population contains no events."));
      return;
    }
    const a = ++Ee.current, c = Oe.flatMap((g) => {
      const f = Kn(g.pairKey, g.coefficient);
      return ca(f.lower, f.upper).map((y) => ({
        pair: g,
        value: y,
        matrix: ui(
          j,
          u.sourceAxisKeys[g.sourceIndex],
          u.receiverAxisKeys[g.receiverIndex],
          y
        )
      }));
    });
    xe(null), He({}), yn({ completed: 0, total: c.length });
    try {
      const g = await A(
        j,
        n,
        c.map(({ matrix: y }) => y),
        (y, z) => {
          Ee.current === a && yn({ completed: y, total: z });
        },
        wt
      );
      if (Ee.current !== a) return;
      if (g.length !== c.length)
        throw new Error(s("The compensation worker returned an incomplete coefficient sweep."));
      const f = {};
      for (const y of Oe) {
        const z = c.flatMap((K, G) => K.pair.pairKey === y.pairKey ? [G] : []), U = $s(
          y,
          z.map((K) => c[K].value),
          z.map((K) => g[K]),
          n
        );
        U && (f[y.pairKey] = U);
      }
      He(f), $n(((d = Oe[0]) == null ? void 0 : d.pairKey) ?? null);
    } catch (g) {
      if (Ee.current !== a) return;
      const f = g instanceof Error ? g.message : String(g);
      xe(/cancel/i.test(f) ? s("Exact coefficient sweep cancelled.") : f);
    } finally {
      Ee.current === a && yn(null);
    }
  }, ar = () => {
    Ee.current++, R == null || R(), yn(null), bn(null), xe(s("Exact coefficient sweep cancelled."));
  }, or = async () => {
    var a, c;
    if (!j || !Cn || !l || Object.keys(Y).length === 0) return;
    const n = `${Vt(j.name)} · edited`;
    J(null), me(!1), Re(!0), We(n), ve(null);
    try {
      const g = {
        profileId: `comp-edit-${((c = (a = globalThis.crypto) == null ? void 0 : a.randomUUID) == null ? void 0 : c.call(a)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: n,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(Y).length} compensation coefficient${Object.keys(Y).length === 1 ? "" : "s"} in GateLab.`
      }, f = (M == null ? void 0 : M.recordType) === "baseline" && da(Cn, M.scientific.matrix.matrix) ? await yr(j, M, g) : await jr(
        j,
        oa(j, Cn),
        g
      );
      await l(f, ve), Wn({}), tn({}), He({}), rn({}), bn(null), xe(null), St((y) => y + 1), ne.length > 0 && (Vn("attention"), we(ne[0].pairKey), $n(ne[0].pairKey)), J(s("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: Vt(f.name),
        flagged: ne.length > 0 ? s(
          ne.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: ne.length }
        ) : ""
      }));
    } catch (d) {
      me(!0), J(d instanceof Error ? d.message : String(d));
    } finally {
      Re(!1), We(null), ve(null);
    }
  }, Ps = (n) => {
    if (ne.length === 0) return;
    const a = ne.findIndex(({ pairKey: g }) => g === Be), c = a < 0 ? n > 0 ? 0 : ne.length - 1 : (a + n + ne.length) % ne.length, d = ne[c];
    $e(null), we(d.pairKey), $n(d.pairKey);
  }, Lt = () => /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "gl-comp-inspector-resize",
      role: "separator",
      "aria-label": s("Resize compensation inspector"),
      "aria-orientation": "vertical",
      "aria-valuemin": 360,
      "aria-valuemax": 900,
      "aria-valuenow": xn,
      tabIndex: 0,
      title: s("Drag to resize the coefficient inspector; use Left/Right arrow keys for fine control"),
      onPointerDown: Zi,
      onKeyDown: Hi,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), lr = (n) => {
    $e(null), we(n), bt(!0), Tt.some((a) => a.pairKey === n) && (Le.some((a) => a.pairKey === n) || (qn("all"), as("")), os(n));
  }, Ot = (n, a = !1) => {
    const c = b ? Nn.has(b.pairKey) : !1, d = b ? ne.find(({ pairKey: Z }) => Z === b.pairKey) ?? null : null, g = b ? Pt(b.pairKey, b.value) : null, f = b ? Kn(b.pairKey, b.value) : null, y = b ? Ri[b.pairKey] : null, z = b ? u.sourceAxisKeys[b.sourceIndex] : "", U = b ? u.receiverAxisKeys[b.receiverIndex] : "", K = b != null && b.interaction && b.interaction !== "self" && b.interaction !== "other" ? 1 : 0, G = b && (ye != null && ye.ready) ? Zt({
      coefficient: b.value,
      physicalPrior: K,
      evidence: ye.preview.evidence
    }, u.kind, Ve) : null, te = b ? la(M, z, U) : null, De = (b == null ? void 0 : b.value) ?? null, je = b ? Y[b.pairKey] : void 0, Mn = !!(b && (j == null ? void 0 : j.scientific.kind) === "flow-spillover" && w && Object.keys(Y).length > 0), Ze = qe.state !== "idle" && qe.state !== "error" && qe.pairKey === (b == null ? void 0 : b.pairKey) ? qe.preview : null, ln = Ze ?? (ye != null && ye.ready ? ye.preview : null), cn = [];
    te !== null && De !== null && ((j == null ? void 0 : j.recordType) === "revision" || te !== De) && cn.push({ label: s("Baseline"), value: te }), De !== null && cn.push({ label: s("Installed"), value: De }), je !== void 0 && cn.push({ label: s("Staged"), value: je });
    const dn = ne.findIndex(({ pairKey: Z }) => Z === Be);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${a ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: s("Selected coefficient") }),
          !a && /* @__PURE__ */ e.jsx("span", { children: s(xt ? "Hover preview · click to pin this pair." : Be ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inspector-actions", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flag-navigation", "aria-label": s("Flagged compensation pair navigation"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Previous flagged compensation pair"),
                disabled: ne.length === 0,
                onClick: () => Ps(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: dn >= 0 ? s("{current} / {total} flagged", { current: dn + 1, total: ne.length }) : s("{total} flagged", { total: ne.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Next flagged compensation pair"),
                disabled: ne.length === 0,
                onClick: () => Ps(1),
                children: "→"
              }
            )
          ] }),
          n && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-inspector-close",
              "aria-label": s("Close global compensation pair details"),
              title: s("Close details and return to the full gallery"),
              onClick: n,
              children: "×"
            }
          )
        ] })
      ] }),
      b ? /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-pair-detail${a ? " is-global" : ""}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pair-route", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
            /* @__PURE__ */ e.jsx("strong", { children: b.source.label }),
            /* @__PURE__ */ e.jsx("small", { children: b.source.pnn })
          ] }),
          /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Receiver") }),
            /* @__PURE__ */ e.jsx("strong", { children: b.receiver.label }),
            /* @__PURE__ */ e.jsx("small", { children: b.receiver.pnn })
          ] })
        ] }),
        G && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${G.category}`,
            title: s(G.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: s(G.label) }),
              /* @__PURE__ */ e.jsx("span", { children: s(G.detail) })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: c,
              disabled: !j || !oe.has(u.sourceAxisKeys[b.sourceIndex]) || !oe.has(u.receiverAxisKeys[b.receiverIndex]),
              onChange: (Z) => Ln(b.pairKey, Z.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: s("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: s("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: s("Stored fraction: {value}", { value: se(b.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: s(Y[b.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(Y[b.pairKey] ?? b.value) ? `${((Y[b.pairKey] ?? b.value) * 100).toFixed(1)}%` : String(Y[b.pairKey] ?? b.value) })
        ] }),
        cn.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": s("Coefficient history"), children: cn.map((Z, un) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          un > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: s("Exact fraction: {value}", { value: se(Z.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: Z.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (Z.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${Z.label}:${un}`)) }),
        j && Be === b.pairKey && !xt && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              An,
              {
                step: "0.1",
                value: Zn,
                disabled: B,
                onValueChange: (Z) => {
                  Mt(Z), j.scientific.kind === "flow-spillover" && Z.trim() !== "" && Number.isFinite(Number(Z)) && Dn(b.pairKey, Number(Z) / 100);
                }
              }
            )
          ] }),
          j.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: s("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: B || !Number.isFinite(Number(Zn)) || Zn.trim() === "",
              onClick: () => Dn(b.pairKey, Number(Zn) / 100),
              children: s("Stage value")
            }
          ),
          Y[b.pairKey] !== void 0 && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: B,
              onClick: () => {
                Dn(b.pairKey, b.value), tn((Z) => {
                  const un = { ...Z };
                  return delete un[b.pairKey], un;
                });
              },
              children: s("Reset")
            }
          )
        ] }),
        Mn && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-candidate-status${a ? " is-compact" : ""}`, "aria-label": s("Flow compensation coefficient preview"), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Coefficient preview") }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              s("Original remains fixed; the right panel shows the complete working matrix."),
              a ? s(" The gallery remains installed until Apply.") : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("em", { children: je === void 0 ? s("Working matrix") : `${(b.value * 100).toFixed(1)}% → ${(je * 100).toFixed(1)}%` }),
          qe.state === "updating" && qe.pairKey === b.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: s("Updating…") }),
          qe.state === "error" && qe.pairKey === b.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: s(qe.message) })
        ] }),
        b.interaction && b.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          s("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: b.interaction })
        ] }),
        a && (ln ? /* @__PURE__ */ e.jsx(
          ti,
          {
            preview: ln,
            sourceLabel: b.source.label,
            receiverLabel: b.receiver.label,
            kind: u.kind,
            densitySmoothing: Qe,
            compact: !0,
            compensatedTitle: s(Ze ? "Candidate" : "Compensated")
          }
        ) : ye && !ye.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(ye.reason) }) : null),
        a && /* @__PURE__ */ e.jsx(
          Hr,
          {
            matrixView: u,
            sourceChannels: ie,
            receiverChannels: ae,
            selectedSourceIndex: b.sourceIndex,
            selectedReceiverIndex: b.receiverIndex,
            stagedCoefficients: Y,
            maximumAbsoluteOffDiagonal: Ms,
            onSelect: lr
          }
        ),
        !a && (ln ? /* @__PURE__ */ e.jsx(
          ti,
          {
            preview: ln,
            sourceLabel: b.source.label,
            receiverLabel: b.receiver.label,
            kind: u.kind,
            densitySmoothing: Qe,
            compensatedTitle: s(Ze ? "Candidate" : "Compensated")
          }
        ) : ye && !ye.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(ye.reason) }) : null),
        c && d && g && f && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Sweep bounds") }),
            /* @__PURE__ */ e.jsx("span", { children: s("Four exact candidates will be interpolated across these endpoints.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-inputs", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Lower (%)") }),
              /* @__PURE__ */ e.jsx(
                An,
                {
                  step: "0.1",
                  value: g.lowerPercent,
                  disabled: B || ue !== null || be !== null,
                  onValueChange: (Z) => it(b.pairKey, b.value, "lowerPercent", Z)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Upper (%)") }),
              /* @__PURE__ */ e.jsx(
                An,
                {
                  step: "0.1",
                  value: g.upperPercent,
                  disabled: B || ue !== null || be !== null,
                  onValueChange: (Z) => it(b.pairKey, b.value, "upperPercent", Z)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: B || ue !== null || be !== null || f.error !== null,
                onClick: () => void ir(d),
                children: s(be === b.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          f.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: s(f.error) }) : /* @__PURE__ */ e.jsx("small", { children: s("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(ce, ri).toLocaleString(),
            sweep: Math.min(ce, ii).toLocaleString()
          }) }),
          y && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: y.values.map((Z) => /* @__PURE__ */ e.jsx("div", { className: Z.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            gt,
            {
              title: `${Z.isCurrent ? `${s("Current")} · ` : ""}${(Z.value * 100).toFixed(2)}%`,
              panel: Z.preview.compensated,
              preview: Z.preview,
              sourceLabel: b.source.label,
              receiverLabel: b.receiver.label,
              minimumSize: 145,
              maximumSize: 220,
              densitySmoothing: Qe
            }
          ) }, `${b.pairKey}:bounds:${Z.value}:${Z.isCurrent}`)) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s(u.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: s("No coefficient selected.") })
    ] });
  }, Is = (n, a) => /* @__PURE__ */ e.jsx(
    Yr,
    {
      dataset: a,
      pair: n,
      plotSize: $t,
      densitySmoothing: Qe,
      flagged: Nn.has(n.pairKey),
      selected: Be === n.pairKey,
      onSelect: () => {
        $e(null), we(n.pairKey), bt(!0);
      },
      onFlag: (c) => Ln(n.pairKey, c)
    },
    n.pairKey
  ), cr = async (n, a) => {
    if (!(le != null && le.ready) || !u)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const c = bs.map((d) => ({
      pairKey: d.pairKey,
      sourceLabel: d.source.label,
      receiverLabel: d.receiver.label,
      coefficient: d.coefficient,
      relationship: d.interaction,
      buildPreview: () => {
        const g = gi(
          le.dataset,
          d.source.key,
          d.receiver.key
        );
        if (!g.ready) throw new Error(g.reason);
        return g.preview;
      }
    }));
    await zr(c, {
      sampleName: i,
      profileName: (j == null ? void 0 : j.name) ?? s(u.title),
      populationName: (Q == null ? void 0 : Q.name) ?? s("All Events"),
      filterLabel: ys,
      densitySmoothing: Qe,
      densityColorPower: W,
      pointAlpha: tt,
      pointSize: st
    }, n, a);
  };
  return O ? /* @__PURE__ */ e.jsx(ns.Provider, { value: W, children: /* @__PURE__ */ e.jsx(ts.Provider, { value: tt, children: /* @__PURE__ */ e.jsx(ss.Provider, { value: st, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab gl-plotting-workspace gl-comp-workspace",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-plotting-head gl-comp-head gl-comp-overview${Me === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsx("h2", { className: "gl-tab-title", children: s("Compensation") }),
            !D && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: at })
          ] }),
          D ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${q.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: s("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: ot,
                method: at,
                count: Kt,
                status: s(q.state === "ready" ? "Ready" : "Unavailable"),
                assay: s(o ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${q.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  s("{kind} compensation installed. Installed compensation profile.", {
                    kind: D.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                /* @__PURE__ */ e.jsx("strong", { children: qi }),
                /* @__PURE__ */ e.jsx("span", { children: s("{method} · {count} ch · {status}", {
                  method: at,
                  count: Kt,
                  status: q.state === "ready" ? s("Ready") : s("Unavailable")
                }) }),
                /* @__PURE__ */ e.jsx("em", { children: s(o ? "Comp active" : "Original active") })
              ]
            }
          ) : /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "gl-comp-summary",
              "aria-label": s("Compensation summary"),
              "data-active-layer": o ? "compensated" : "original",
              children: s("{source} · {assay} · {count} channels", {
                source: s(Cs),
                assay: s(o ? "Compensated assay active" : "Original assay active"),
                count: Kt
              })
            }
          ),
          D && t.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: B,
              onClick: Es,
              children: s("Replace matrix…")
            }
          ),
          D && h && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-header-remove", children: [
            m && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: Ce,
                  disabled: B || Yn,
                  onChange: (n) => Ge(n.currentTarget.checked)
                }
              ),
              /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in original coordinates.") })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: B || Yn,
                title: s("Uninstall the matrix: every file returns to the original assay and the matrix leaves the workspace."),
                onClick: () => void nr(),
                children: s(Yn ? "Removing…" : "Remove the matrix")
              }
            )
          ] }),
          Gi && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-global-layer-note", children: s("Assay selection in the top bar applies to every tab.") })
        ] }),
        /* @__PURE__ */ e.jsxs("aside", { className: "gl-plotting-inspector gl-comp-inspector-left", "aria-label": s("Compensation controls"), children: [
          t.instrument === "flow" && !D && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Matrix") }),
            t.instrument === "flow" && ee && !D && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-enable-heading", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("strong", { id: "comp-flow-enable-heading", children: s(pe ? "SCE spillover matrix" : "Embedded FCS matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: s("Install this exact matrix as the immutable baseline to edit coefficients and preview their effect.") })
              ] }),
              m && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Ce,
                    disabled: B,
                    onChange: (n) => Ge(n.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
              ] }),
              Ke != null && Ke.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: Ke.error }) : B ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
                re ? s("Preparing editor… {percent}%", { percent: Math.round(re.fraction * 100) }) : s("Preparing editor…"),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (re == null ? void 0 : re.phase) === "cancelling",
                    onClick: v,
                    children: s((re == null ? void 0 : re.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                )
              ] }) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: !l || m && !Ce,
                  onClick: () => void tr(),
                  children: s("Enable matrix editing")
                }
              )
            ] }),
            t.instrument === "flow" && !D && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-empty-heading", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("strong", { id: "comp-flow-empty-heading", children: s("Empty matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: s(ee ? "Or start from an identity matrix over the file's fluorescence channels, every spillover at zero, and set the coefficients by hand." : "Start from an identity matrix over the file's fluorescence channels, every spillover at zero, and set the coefficients by hand.") })
              ] }),
              m && !ee && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Ce,
                    disabled: B,
                    onChange: (n) => Ge(n.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
              ] }),
              B ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-flow-enable-progress", role: "status", children: s("Preparing editor…") }) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: !l || m && !Ce,
                  onClick: () => void er(),
                  children: s("Start from an empty matrix")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Review scope") }),
            /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-review-population", children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Review population") }),
              /* @__PURE__ */ e.jsxs(
                "select",
                {
                  "aria-label": s("Compensation review population"),
                  value: (Q == null ? void 0 : Q.id) ?? "all",
                  disabled: ue !== null || be !== null,
                  onChange: (n) => jt(n.currentTarget.value),
                  children: [
                    /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All Events") }),
                    E.map((n) => /* @__PURE__ */ e.jsx("option", { value: n.id, children: `${"· ".repeat(n.depth)}${n.name} (${n.eventCount.toLocaleString()})` }, n.id))
                  ]
                }
              ),
              /* @__PURE__ */ e.jsx("small", { children: s("{count} events · applies to biplots, attention ranking, and sweeps; membership frozen from the current assay", {
                count: ce.toLocaleString()
              }) })
            ] }),
            Me !== "global" && /* @__PURE__ */ e.jsxs(
              "label",
              {
                className: "gl-comp-preview-events",
                title: s("Controls the frozen event set shown in the selected-pair Original and comparison biplots. Applying compensation still processes every event."),
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Pair preview") }),
                  /* @__PURE__ */ e.jsxs(
                    "select",
                    {
                      "aria-label": s("Compensation pair preview event count"),
                      value: String(et),
                      disabled: B,
                      onChange: (n) => {
                        const a = n.currentTarget.value;
                        ki(a === "all" ? "all" : Number(a));
                      },
                      children: [
                        oi.map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: s("{count} events", { count: n.toLocaleString() }) }, n)),
                        /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All available") })
                      ]
                    }
                  ),
                  /* @__PURE__ */ e.jsx("small", { children: s("Showing {shown} of {total}; Apply always uses all events.", {
                    shown: In.length.toLocaleString(),
                    total: ce.toLocaleString()
                  }) })
                ]
              }
            )
          ] }),
          (k !== void 0 && P !== void 0 && I || u && Object.keys(Y).length > 0) && /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Apply") }),
            k !== void 0 && P !== void 0 && I && /* @__PURE__ */ e.jsxs(
              "label",
              {
                className: "gl-comp-worker-control",
                title: s("Event-parallel Apply workers. The aggregate memory budget stays fixed; more workers are not always faster."),
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Apply workers") }),
                  /* @__PURE__ */ e.jsx(
                    "select",
                    {
                      "aria-label": s("Compensation Apply worker count"),
                      value: k,
                      disabled: B,
                      onChange: (n) => I(Number(n.currentTarget.value)),
                      children: Array.from({ length: P }, (n, a) => a + 1).map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("small", { children: [
                    "/ ",
                    P
                  ] })
                ]
              }
            ),
            u && Object.keys(Y).length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
              /* @__PURE__ */ e.jsxs("span", { children: [
                s("{count} pending edits", { count: Object.keys(Y).length }),
                (j == null ? void 0 : j.scientific.kind) === "cytof-spillover" ? ` · ${s("{files} checked FCS files", { files: Xe })}` : ""
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  disabled: B,
                  onClick: () => {
                    Wn({}), tn({}), J(null);
                  },
                  children: s("Discard")
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: B || ue !== null || be !== null || !l || (j == null ? void 0 : j.scientific.kind) === "cytof-spillover" && Xe === 0,
                  onClick: () => void or(),
                  children: s("Apply revised matrix")
                }
              )
            ] })
          ] }),
          u && /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Biplot display") }),
            /* @__PURE__ */ e.jsxs(
              "label",
              {
                className: "gl-comp-density-smoothing",
                title: s("Blur radius for every compensation biplot; both assay layers always use the same setting"),
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Density smooth") }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "range",
                      min: "1",
                      max: "10",
                      step: "1",
                      value: Qe,
                      "aria-label": s("Compensation biplot density smoothing"),
                      onChange: (n) => wi(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: Qe })
                ]
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "label",
              {
                className: "gl-comp-point-alpha",
                title: s("Point opacity for every compensation biplot"),
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Point alpha") }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "range",
                      min: "0.1",
                      max: "1",
                      step: "0.05",
                      value: tt,
                      "aria-label": s("Compensation biplot point alpha"),
                      onChange: (n) => Ci(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: tt.toFixed(2) })
                ]
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "label",
              {
                className: "gl-comp-point-alpha",
                title: s("Point size for every compensation biplot, as a factor on the size each panel's width gives"),
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Point size") }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "range",
                      min: "0.3",
                      max: "3",
                      step: "0.1",
                      value: st,
                      "aria-label": s("Compensation biplot point size"),
                      onChange: (n) => Mi(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("output", { children: [
                    st.toFixed(1),
                    "×"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              xr,
              {
                className: "gl-comp-density-colour",
                value: W,
                onChange: V
              }
            )
          ] }),
          (u || D) && /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Tools") }),
            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: ea.map(({ id: n, label: a }) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                id: `comp-drawer-${n}-button`,
                className: "gl-comp-drawer-toggle",
                "aria-expanded": Bn[n],
                "aria-controls": `comp-drawer-${n}`,
                onClick: () => Wi(n),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { children: [
                    s(a),
                    n === "review" && rt.length > 0 ? ` (${rt.length})` : ""
                  ] }),
                  /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: Bn[n] ? "▾" : "▸" })
                ]
              },
              n
            )) })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-prop-body gl-comp-body", children: [
          u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-workspace-tabs", role: "tablist", "aria-label": s("Compensation workspace"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": Me === "matrix",
                className: Me === "matrix" ? "active" : void 0,
                onClick: () => {
                  $e(null), Vn("matrix");
                },
                children: s("Matrix")
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": Me === "global",
                className: Me === "global" ? "active" : void 0,
                onClick: () => {
                  $e(null), Vn("global");
                },
                children: s("Global inspector")
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": Me === "attention",
                className: Me === "attention" ? "active" : void 0,
                onClick: () => {
                  $e(null), Vn("attention");
                },
                children: [
                  s("Flagged"),
                  ne.length > 0 ? ` (${ne.length})` : ""
                ]
              }
            )
          ] }),
          t.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "input",
            {
              ref: xs,
              type: "file",
              accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
              className: "gl-sr-only",
              "aria-label": s("Choose CyTOF spillover matrix"),
              onChange: (n) => void Yi(n)
            }
          ),
          hs && /* @__PURE__ */ e.jsx("div", { className: ps ? "gl-comp-error" : "gl-comp-status", role: ps ? "alert" : "status", children: s(hs) }),
          t.instrument === "cytof" && (!D || X) && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-cytof-import", "aria-labelledby": "comp-cytof-import-heading", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-import-head", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("h3", { id: "comp-cytof-import-heading", children: s("CyTOF spillover matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: s("Linear counts → non-negative least squares → arcsinh display") })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-import-actions", children: /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: X ? "gl-btn-ghost" : "gl-btn",
                  disabled: B,
                  onClick: Es,
                  children: s(X ? "Choose another matrix…" : "Import matrix…")
                }
              ) })
            ] }),
            ms && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s(ms) }),
            X && de && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-body", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-summary", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("strong", { children: X.fileName }),
                  /* @__PURE__ */ e.jsx("span", { children: s("{sources} sources × {receivers} receivers", {
                    sources: X.matrix.sourceChannels.length,
                    receivers: X.matrix.receiverChannels.length
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("dl", { children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Exact matches") }),
                    /* @__PURE__ */ e.jsx("dd", { children: de.matchedChannels.length })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Included") }),
                    /* @__PURE__ */ e.jsx("dd", { children: de.includedChannels.length })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Not in FCS") }),
                    /* @__PURE__ */ e.jsx("dd", { children: de.matrixOnlyChannels.length })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-channel-head", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("h4", { children: s("Channels included in NNLS") }),
                  /* @__PURE__ */ e.jsx("span", { children: s("Exact, case-sensitive $PnN matching; unchecked channels pass through unchanged.") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: B,
                      onClick: () => an(new Set(de.matchedChannels)),
                      children: s("All matched")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: B,
                      onClick: () => an(/* @__PURE__ */ new Set()),
                      children: s("None")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-channel-grid", children: X.matrix.receiverChannels.map((n) => {
                const a = de.matchedChannels.includes(n);
                return /* @__PURE__ */ e.jsxs("label", { className: a ? "" : "is-unavailable", title: a ? n : s("{channel} is not uniquely present in this FCS file", { channel: n }), children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: Pn.has(n),
                      disabled: !a || B,
                      onChange: (c) => Xi(n, c.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: qt(t, n).combined }),
                  !a && /* @__PURE__ */ e.jsx("small", { children: s("not matched") })
                ] }, n);
              }) }),
              (X.validationWarnings.length > 0 || de.warnings.length > 0) && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: /* @__PURE__ */ e.jsx("span", { children: s("{count} review items: {messages}", {
                count: X.validationWarnings.length + de.warnings.length,
                messages: [
                  ...X.validationWarnings.map(({ message: n }) => n),
                  ...de.warnings.map(({ message: n }) => n)
                ].map((n) => s(n)).join(" ")
              }) }) }),
              de.blockers.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: de.blockers.map(({ message: n }) => s(n)).join(" ") }),
              m && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Ce,
                    disabled: B,
                    onChange: (n) => Ge(n.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: s("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                  /* @__PURE__ */ e.jsx("span", { children: B ? re ? s("{phase}… {percent}% ({processed} / {total} events)", {
                    phase: s(re.phase === "cancelling" ? "Cancelling" : re.phase === "preparing" ? "Preparing" : "Applying"),
                    percent: Math.round(re.fraction * 100),
                    processed: re.processedEvents.toLocaleString(),
                    total: re.totalEvents.toLocaleString()
                  }) : s("Preparing compensation…") : s("The Original assay is retained and can be restored at any time.") }),
                  /* @__PURE__ */ e.jsx("strong", { className: Xe === 0 ? "is-empty" : void 0, children: Xe === 0 ? s("No FCS files are checked. Select at least one file in Samples.") : s("Applies atomically to {files} checked FCS files · {events} total events", {
                    files: Xe,
                    events: _i.toLocaleString()
                  }) })
                ] }),
                B ? /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (re == null ? void 0 : re.phase) === "cancelling",
                    onClick: v,
                    children: s((re == null ? void 0 : re.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                ) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn",
                    disabled: !l || Xe === 0 || !de.canApply || m && !Ce,
                    onClick: () => void Ji(),
                    children: s("Apply NNLS compensation")
                  }
                )
              ] }),
              p.length > 0 && x && /* @__PURE__ */ e.jsxs(
                "div",
                {
                  className: "gl-comp-adopt-existing",
                  "aria-labelledby": "comp-adopt-existing-heading",
                  children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-adopt-copy", children: [
                      /* @__PURE__ */ e.jsx("strong", { id: "comp-adopt-existing-heading", children: s("Use an existing SCE assay") }),
                      /* @__PURE__ */ e.jsx("span", { children: s("Records this matrix against data already computed in R. GateLabR will not recompute or overwrite the selected assay.") })
                    ] }),
                    /* @__PURE__ */ e.jsxs("label", { children: [
                      /* @__PURE__ */ e.jsx("span", { children: s("Existing linear assay") }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          value: (Je == null ? void 0 : Je.id) ?? "",
                          disabled: B,
                          onChange: (n) => {
                            fs(n.currentTarget.value), Jn(!1);
                          },
                          children: p.map((n) => /* @__PURE__ */ e.jsx("option", { value: n.id, children: n.label === n.id ? n.id : `${n.label} (${n.id})` }, n.id))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-adopt-confirm", children: [
                      /* @__PURE__ */ e.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: kt,
                          disabled: B,
                          onChange: (n) => Jn(n.currentTarget.checked)
                        }
                      ),
                      /* @__PURE__ */ e.jsx("span", { children: s("I confirm this assay was computed from the selected source assay using this exact matrix and channel set.") })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: B || !Je || !kt || Xe === 0 || !de.canApply || m && !Ce,
                        onClick: () => void Qi(),
                        children: s("Use existing assay — no recomputation")
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          Ns && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
          ws.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
            /* @__PURE__ */ e.jsx("span", { children: s("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
              count: ws.length
            }) }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => is((n) => ({ ...n, review: !0 })), children: s("Review details") })
          ] }),
          D && q.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
          u && Me === "matrix" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: wn,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${xn}px` },
              children: [
                /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrix-panel", "aria-labelledby": "comp-matrix-heading", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-matrix-head", children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("h3", { id: "comp-matrix-heading", children: s(u.title) }),
                      /* @__PURE__ */ e.jsx("span", { children: s(u.subtitle) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-head-actions", children: [
                      Sn && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-inline-edit-note", children: s("Edit cells directly (%)") }),
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-legend", "aria-label": s("Matrix colour key"), children: [
                        /* @__PURE__ */ e.jsxs("span", { children: [
                          /* @__PURE__ */ e.jsx("i", { className: "is-diagonal", "aria-hidden": "true" }),
                          s("Diagonal (self)")
                        ] }),
                        /* @__PURE__ */ e.jsxs("span", { children: [
                          /* @__PURE__ */ e.jsx("i", { className: "is-positive", "aria-hidden": "true" }),
                          s("Positive spill")
                        ] }),
                        /* @__PURE__ */ e.jsxs("span", { children: [
                          /* @__PURE__ */ e.jsx("i", { className: "is-negative", "aria-hidden": "true" }),
                          s("Negative")
                        ] })
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => ds(!0),
                          children: s("Export CSV…")
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-scroll", children: /* @__PURE__ */ e.jsxs(
                    "div",
                    {
                      className: `gl-comp-matrix-stage${Sn ? " is-flow-inline" : ""}`,
                      style: {
                        width: 18 + On.rowLabelWidth + u.receiverAxisKeys.length * on + On.overhang,
                        "--gl-comp-row-label-w": `${On.rowLabelWidth}px`,
                        "--gl-comp-col-label-w": `${On.columnLabelWidth}px`,
                        "--gl-comp-col-label-h": `${On.columnLabelHeight}px`
                      },
                      children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-axis gl-comp-matrix-receiver-axis", children: s("Receiver channels →") }),
                        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-body", children: [
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-axis gl-comp-matrix-source-axis", children: s("Source channels ↓") }),
                          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-labelled", children: [
                            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-corner", "aria-hidden": "true", children: "%" }),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                className: "gl-comp-column-labels",
                                "aria-label": s("Receiver channel labels"),
                                style: {
                                  gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${on}px)`
                                },
                                children: ae.map((n, a) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (b == null ? void 0 : b.receiverIndex) === a ? "is-selected" : void 0,
                                    title: n.combined,
                                    children: /* @__PURE__ */ e.jsx("span", { children: n.combined })
                                  },
                                  u.receiverAxisKeys[a]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                className: "gl-comp-row-labels",
                                "aria-label": s("Source channel labels"),
                                style: {
                                  gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${on}px)`
                                },
                                children: ie.map((n, a) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (b == null ? void 0 : b.sourceIndex) === a ? "is-selected" : void 0,
                                    title: n.combined,
                                    children: n.combined
                                  },
                                  u.sourceAxisKeys[a]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                ref: vs,
                                className: "gl-comp-matrix shows-values",
                                role: "grid",
                                "aria-label": s("Compensation matrix; source rows and receiver columns"),
                                "aria-rowcount": u.sourceAxisKeys.length,
                                "aria-colcount": u.receiverAxisKeys.length,
                                style: {
                                  gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${on}px)`,
                                  gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${on}px)`
                                },
                                children: u.matrix.map((n, a) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    role: "row",
                                    className: "gl-comp-matrix-row",
                                    "aria-rowindex": a + 1,
                                    children: n.map((c, d) => {
                                      const g = u.sourceAxisKeys[a], f = u.receiverAxisKeys[d], y = `${g}${ze}${f}`, z = Y[y], U = z ?? c, K = g === f, G = (b == null ? void 0 : b.sourceIndex) === a && b.receiverIndex === d, te = (b == null ? void 0 : b.sourceIndex) === a, De = (b == null ? void 0 : b.receiverIndex) === d, je = ie[a], Mn = ae[d], Ze = u.kind === "cytof" ? kn(g, f) : null, ln = vr(
                                        U,
                                        Ms,
                                        K
                                      ), cn = u.receiverAxisKeys.findIndex((fe) => fe !== g), dn = Be === y, Z = Be === null && a === 0 && d === cn, un = Number.isFinite(U) ? U === 0 ? "" : (U * 100).toFixed(1) : String(U), Ls = Ze && Ze !== "other" && Ze !== "self" ? ` · ${Ze}` : "", dr = Pi[y] ?? di(U);
                                      return Sn && !K ? /* @__PURE__ */ e.jsx(
                                        An,
                                        {
                                          role: "gridcell",
                                          className: `gl-comp-cell gl-comp-cell-input${G ? " selected" : ""}${dn ? " is-pinned" : ""}${z === void 0 ? "" : " is-staged"}${te ? " is-selected-source" : ""}${De ? " is-selected-receiver" : ""}`,
                                          min: "0",
                                          step: "0.1",
                                          value: dr,
                                          disabled: B,
                                          "data-source-index": a,
                                          "data-receiver-index": d,
                                          "aria-colindex": d + 1,
                                          "aria-selected": dn,
                                          "aria-label": s("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                            source: je.combined,
                                            receiver: Mn.combined,
                                            pending: z === void 0 ? "" : s(", pending edit")
                                          }),
                                          title: s("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                            source: je.combined,
                                            receiver: Mn.combined,
                                            pending: z === void 0 ? "" : s(" · pending edit")
                                          }),
                                          style: ln,
                                          onFocus: () => we(y),
                                          onMouseEnter: () => $e(y),
                                          onMouseLeave: () => $e((fe) => fe === y ? null : fe),
                                          onClick: () => we(y),
                                          onValueChange: (fe) => {
                                            we(y), tn((zn) => ({ ...zn, [y]: fe })), fe.trim() !== "" && Number.isFinite(Number(fe)) && Dn(y, Number(fe) / 100);
                                          },
                                          onBlur: (fe) => {
                                            const zn = fe.currentTarget.value;
                                            if (zn.trim() === "" || !Number.isFinite(Number(zn))) {
                                              tn((Dt) => {
                                                const Os = { ...Dt };
                                                return delete Os[y], Os;
                                              });
                                              return;
                                            }
                                            tn((Dt) => ({
                                              ...Dt,
                                              [y]: di(Number(zn) / 100)
                                            }));
                                          }
                                        },
                                        f
                                      ) : /* @__PURE__ */ e.jsx(
                                        "button",
                                        {
                                          type: "button",
                                          role: "gridcell",
                                          className: `gl-comp-cell${K ? " diagonal" : ""}${G ? " selected" : ""}${dn ? " is-pinned" : ""}${z === void 0 ? "" : " is-staged"}${te ? " is-selected-source" : ""}${De ? " is-selected-receiver" : ""}`,
                                          disabled: K,
                                          tabIndex: K ? -1 : G || Z ? 0 : -1,
                                          "data-source-index": a,
                                          "data-receiver-index": d,
                                          "data-interaction": Ze ?? void 0,
                                          "aria-colindex": d + 1,
                                          "aria-pressed": K ? void 0 : dn,
                                          "aria-label": K ? s("{channel} diagonal: {value}", { channel: je.combined, value: nn(U) }) : s("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                            source: je.combined,
                                            receiver: Mn.combined,
                                            value: nn(U),
                                            pending: z === void 0 ? "" : s(" (pending edit)"),
                                            interaction: Ls
                                          }),
                                          title: K ? `${je.combined} · self · ${nn(U)}` : `${je.combined} → ${Mn.combined} · ${nn(U)}${z === void 0 ? "" : " · pending edit"}${Ls}`,
                                          style: ln,
                                          onFocus: () => {
                                            K || we(y);
                                          },
                                          onMouseEnter: () => {
                                            K || $e(y);
                                          },
                                          onMouseLeave: () => $e((fe) => fe === y ? null : fe),
                                          onClick: () => we(y),
                                          onKeyDown: (fe) => sr(fe, a, d),
                                          children: /* @__PURE__ */ e.jsx("span", { children: un })
                                        },
                                        f
                                      );
                                    })
                                  },
                                  u.sourceAxisKeys[a]
                                ))
                              }
                            )
                          ] })
                        ] })
                      ]
                    }
                  ) })
                ] }),
                Lt(),
                Ot()
              ]
            }
          ) : u && Me === "global" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: wn,
              className: `gl-comp-common-path gl-comp-global-path${Fn ? " has-details" : ""}`,
              style: {
                gridTemplateColumns: Fn ? `minmax(440px, 1fr) 8px ${xn}px` : "minmax(0, 1fr)"
              },
              children: [
                /* @__PURE__ */ e.jsx(
                  Xr,
                  {
                    stateKey: _,
                    header: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-head-title", children: [
                        /* @__PURE__ */ e.jsx("h3", { id: "comp-global-inspector-heading", children: s("Global data inspector") }),
                        /* @__PURE__ */ e.jsx(
                          "span",
                          {
                            className: "gl-comp-lock-pill",
                            title: s("The assay flip keeps the same events, axes, transform, density bins, colour scale, and tile geometry."),
                            children: s("View locked")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          "aria-label": s("Global compensation pair filter"),
                          title: s("Choose which channel pairs appear"),
                          value: Pe,
                          onChange: (n) => qn(n.currentTarget.value),
                          children: [
                            /* @__PURE__ */ e.jsx("option", { value: "relevant", children: s("Matrix-linked / relevant") }),
                            /* @__PURE__ */ e.jsx("option", { value: "nonzero", children: s("Non-zero coefficients") }),
                            u.kind === "cytof" && /* @__PURE__ */ e.jsx("option", { value: "physical", children: s("Physical CyTOF relationships") }),
                            /* @__PURE__ */ e.jsx("option", { value: "flagged", children: s("Flagged for follow-up") }),
                            /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All included pairs") })
                          ]
                        }
                      ),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          className: "gl-comp-global-layout",
                          "aria-label": s("Global compensation plot layout"),
                          title: s("Show one compressed gallery or organise channel pairs into labelled rows"),
                          value: Ie,
                          onChange: (n) => vi(n.currentTarget.value),
                          children: [
                            /* @__PURE__ */ e.jsx("option", { value: "compact", children: s("Compact gallery") }),
                            /* @__PURE__ */ e.jsx("option", { value: "source", children: s("Rows by source") }),
                            /* @__PURE__ */ e.jsx("option", { value: "receiver", children: s("Rows by receiver") })
                          ]
                        }
                      ),
                      /* @__PURE__ */ e.jsx(
                        "input",
                        {
                          className: "gl-comp-global-search",
                          type: "search",
                          value: Tn,
                          placeholder: s("Find channel…"),
                          "aria-label": s("Search global compensation pairs"),
                          onChange: (n) => as(n.currentTarget.value)
                        }
                      ),
                      /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-global-size", children: [
                        /* @__PURE__ */ e.jsx("span", { className: "gl-sr-only", children: s("Plot size") }),
                        /* @__PURE__ */ e.jsx(
                          "input",
                          {
                            type: "range",
                            min: "120",
                            max: "220",
                            step: "4",
                            value: $t,
                            "aria-label": s("Global compensation plot size"),
                            onChange: (n) => yi(Number(n.currentTarget.value))
                          }
                        ),
                        /* @__PURE__ */ e.jsx("output", { children: s("{size}px", { size: $t }) })
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn gl-comp-global-export",
                          disabled: !(le != null && le.ready) || Le.length === 0,
                          title: s("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                          onClick: () => us(!0),
                          children: s("Export…")
                        }
                      ),
                      /* @__PURE__ */ e.jsx(
                        "span",
                        {
                          className: "gl-comp-global-count",
                          title: s("The Global gallery uses one fixed representative event set so every pair and both assay layers remain directly comparable."),
                          children: s("{pairs} pairs · {shown} / {total} events · {population}", {
                            pairs: Le.length.toLocaleString(),
                            shown: At.length.toLocaleString(),
                            total: ce.toLocaleString(),
                            population: (Q == null ? void 0 : Q.name) ?? s("All Events")
                          })
                        }
                      )
                    ] }),
                    children: le ? le.ready ? Le.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No pairs match the current filter. Choose another filter or clear the channel search.") }) : Ie === "compact" ? /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-gallery",
                        "data-event-signature": le.dataset.eventSignature,
                        children: Le.map((n) => Is(n, le.dataset))
                      }
                    ) : /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-groups",
                        "data-event-signature": le.dataset.eventSignature,
                        "data-layout": Ie,
                        children: Ft.map((n) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                          /* @__PURE__ */ e.jsxs("header", { children: [
                            /* @__PURE__ */ e.jsx("span", { children: s(Ie === "source" ? "Source channel" : "Receiver") }),
                            /* @__PURE__ */ e.jsx("strong", { title: n.channel.combined, children: n.channel.label }),
                            /* @__PURE__ */ e.jsx("small", { children: n.channel.pnn }),
                            /* @__PURE__ */ e.jsx("em", { children: s("{count} pairs", { count: n.pairs.length }) })
                          ] }),
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: n.pairs.map((a) => Is(a, le.dataset)) })
                        ] }, n.channel.key))
                      }
                    ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s(le.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No matrix is available for the global inspector.") })
                  }
                ),
                Fn && Lt(),
                Fn && Ot(() => bt(!1), !0)
              ]
            }
          ) : u ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: wn,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${xn}px` },
              children: [
                /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-attention gl-comp-attention-panel", "aria-labelledby": "comp-attention-heading", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-head", children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("h3", { id: "comp-attention-heading", children: s("Flagged pairs") }),
                      /* @__PURE__ */ e.jsx("p", { children: s("This is your follow-up queue. Suggestions are a population-scoped evidence screen, not a verdict and not automatically included. Exact sweeps change one coefficient at a time across four user-bounded values using the same frozen events.") })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-actions", children: [
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Sweep workers") }),
                        /* @__PURE__ */ e.jsx(
                          "select",
                          {
                            "aria-label": s("Compensation sweep workers"),
                            value: wt,
                            disabled: ue !== null || be !== null,
                            onChange: (n) => Nt(Number(n.currentTarget.value)),
                            children: Array.from({ length: li }, (n, a) => a + 1).map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
                          }
                        )
                      ] }),
                      ue ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: ar, children: s("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-btn",
                          disabled: !j || !A || Oe.length === 0 || It > 0 || B || be !== null,
                          onClick: () => void rr(),
                          children: s("Run four-value sweeps ({count})", { count: Oe.length })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-scope", children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Suggestions computed for {population} from up to {count} frozen events.", {
                      population: (Q == null ? void 0 : Q.name) ?? s("All Events"),
                      count: Math.min(ce, Rn.length).toLocaleString()
                    }) }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-evidence-mode", children: [
                      /* @__PURE__ */ e.jsx("span", { children: s("Evidence mode") }),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          "aria-label": s("Compensation evidence mode"),
                          value: Ve,
                          disabled: B || ue !== null || be !== null,
                          onChange: (n) => {
                            Ai(n.currentTarget.value), St((a) => a + 1), He({}), rn({}), xe(null);
                          },
                          children: [
                            /* @__PURE__ */ e.jsx("option", { value: "biological", children: s("Biological sample (conservative)") }),
                            /* @__PURE__ */ e.jsx("option", { value: "control", children: s("Single-stain / control") })
                          ]
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-mini-btn",
                        disabled: B || ue !== null || be !== null,
                        onClick: () => {
                          St((n) => n + 1), He({}), rn({}), xe(null), me(!1), J(
                            s(ne.length === 1 ? "Recomputed compensation suggestions for {population}. {count} flagged pair was retained." : "Recomputed compensation suggestions for {population}. {count} flagged pairs were retained.", {
                              population: (Q == null ? void 0 : Q.name) ?? s("All Events"),
                              count: ne.length
                            })
                          );
                        },
                        children: s("Recompute suggestions")
                      }
                    ),
                    /* @__PURE__ */ e.jsxs("small", { children: [
                      s(Ve === "biological" ? "Broad positive association is excluded because co-expression and cell size can mimic spill. High-tail shapes remain control-sensitive review prompts." : "Positive residual association may enter the shortlist only because you declared suitable control data."),
                      " ",
                      s("Sweep workers are separate from full-Apply workers.")
                    ] })
                  ] }),
                  ue && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-progress", role: "status", "aria-live": "polite", children: [
                    /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, ue.total), value: ue.completed }),
                    /* @__PURE__ */ e.jsx("span", { children: s("{completed} / {total} exact candidate solves · {workers} workers", {
                      completed: ue.completed,
                      total: ue.total,
                      workers: wt
                    }) })
                  ] }),
                  cs && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s(cs) }),
                  j ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": s("Add compensation pair for follow-up"), children: [
                      /* @__PURE__ */ e.jsx("strong", { children: s("Add a pair") }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
                        /* @__PURE__ */ e.jsx(
                          Ds,
                          {
                            label: s("Follow-up source channel"),
                            value: ke,
                            options: u.sourceAxisKeys.flatMap((n, a) => oe.has(n) ? [{ value: n, label: ie[a].combined }] : []),
                            onChange: (n) => {
                              ls(n), Ne === n && Ct(u.receiverAxisKeys.find((a) => a !== n && oe.has(a)) ?? "");
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Receiver") }),
                        /* @__PURE__ */ e.jsx(
                          Ds,
                          {
                            label: s("Follow-up receiver channel"),
                            value: Ne,
                            options: u.receiverAxisKeys.flatMap((n, a) => n !== ke && oe.has(n) ? [{ value: n, label: ae[a].combined }] : []),
                            onChange: Ct
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !ke || !Ne || ke === Ne,
                          onClick: Ui,
                          children: s("Flag for follow-up")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flagged-columns", children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsx("h4", { children: s("Flagged by you ({count})", { count: Oe.length }) }),
                          /* @__PURE__ */ e.jsx("span", { children: s("Only these pairs are included when you run sweeps.") })
                        ] }) }),
                        Oe.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pairs are flagged yet. Tick “Flag for follow-up” in the inspector, add a pair above, or accept a suggestion below.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-list", children: Oe.map((n, a) => {
                          const c = Ii[n.pairKey], d = Ki === n.pairKey, g = Kn(n.pairKey, n.coefficient), f = Pt(n.pairKey, n.coefficient);
                          return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${Be === n.pairKey ? " is-selected" : ""}`, children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                              /* @__PURE__ */ e.jsxs(
                                "button",
                                {
                                  type: "button",
                                  className: "gl-comp-sweep-pair-head",
                                  "aria-expanded": d,
                                  onClick: () => {
                                    we(n.pairKey), $n(d ? null : n.pairKey);
                                  },
                                  children: [
                                    /* @__PURE__ */ e.jsx("span", { className: "gl-comp-sweep-rank", children: a + 1 }),
                                    /* @__PURE__ */ e.jsxs("span", { children: [
                                      /* @__PURE__ */ e.jsxs("strong", { children: [
                                        n.source.label,
                                        " → ",
                                        n.receiver.label
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("small", { children: [
                                        n.interaction && n.interaction !== "other" ? `${n.interaction} · ` : "",
                                        s("installed {value}%", { value: (n.coefficient * 100).toFixed(1) })
                                      ] })
                                    ] }),
                                    /* @__PURE__ */ e.jsx("span", { children: n.evidence.status === "ready" ? s("shift {shift} MAD · slope {slope}", {
                                      shift: se(n.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: se(n.evidence.residualSlope ?? 0, 4)
                                    }) : s("visual review · residual groups insufficient") }),
                                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: d ? "▾" : "▸" })
                                  ]
                                }
                              ),
                              /* @__PURE__ */ e.jsx("label", { className: "gl-comp-followup-list-toggle", title: s("Remove from follow-up queue"), children: /* @__PURE__ */ e.jsx(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: !0,
                                  "aria-label": s("Flag {source} to {receiver} for follow-up", {
                                    source: n.source.label,
                                    receiver: n.receiver.label
                                  }),
                                  onChange: (y) => Ln(n.pairKey, y.currentTarget.checked)
                                }
                              ) })
                            ] }),
                            d && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-body", children: [
                              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inline-bounds", children: [
                                /* @__PURE__ */ e.jsx("span", { children: s("Four values across") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  s("Lower (%)"),
                                  /* @__PURE__ */ e.jsx(An, { step: "0.1", value: f.lowerPercent, disabled: B || ue !== null || be !== null, onValueChange: (y) => it(n.pairKey, n.coefficient, "lowerPercent", y) })
                                ] }),
                                /* @__PURE__ */ e.jsx("span", { children: s("to") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  s("Upper (%)"),
                                  /* @__PURE__ */ e.jsx(An, { step: "0.1", value: f.upperPercent, disabled: B || ue !== null || be !== null, onValueChange: (y) => it(n.pairKey, n.coefficient, "upperPercent", y) })
                                ] }),
                                g.error && /* @__PURE__ */ e.jsx("small", { children: s(g.error) })
                              ] }),
                              c ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: c.values.map((y) => /* @__PURE__ */ e.jsxs(
                                "div",
                                {
                                  className: `gl-comp-sweep-value${y.isCurrent ? " is-current" : ""}${Y[n.pairKey] === y.value ? " is-staged" : ""}`,
                                  children: [
                                    /* @__PURE__ */ e.jsx(
                                      gt,
                                      {
                                        title: `${y.isCurrent ? `${s("Current")} · ` : ""}${(y.value * 100).toFixed(2)}%`,
                                        panel: y.preview.compensated,
                                        preview: y.preview,
                                        sourceLabel: n.source.label,
                                        receiverLabel: n.receiver.label,
                                        minimumSize: 150,
                                        maximumSize: 230,
                                        densitySmoothing: Qe
                                      }
                                    ),
                                    /* @__PURE__ */ e.jsxs("dl", { children: [
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Shift") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: s("{value} MAD", { value: se(y.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Slope") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: se(y.preview.evidence.residualSlope ?? 0, 4) })
                                      ] }),
                                      u.kind === "cytof" && /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Receiver zero") }),
                                        /* @__PURE__ */ e.jsxs("dd", { children: [
                                          (y.preview.compensated.zeroPile.receiver / Math.max(1, y.preview.eventCount) * 100).toFixed(1),
                                          "%"
                                        ] })
                                      ] })
                                    ] }),
                                    /* @__PURE__ */ e.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        className: "gl-mini-btn",
                                        disabled: B || y.isCurrent,
                                        onClick: () => Dn(n.pairKey, y.value),
                                        children: s(y.isCurrent ? "Installed" : Y[n.pairKey] === y.value ? "Staged" : "Use this value")
                                      }
                                    )
                                  ]
                                },
                                `${n.pairKey}:${y.value}:${y.isCurrent}`
                              )) }) : /* @__PURE__ */ e.jsx("p", { children: s("Set or fast-preview the endpoints in the inspector, then run the four-value exact sweep. Panels use the same events and locked axes.") })
                            ] })
                          ] }, n.pairKey);
                        }) })
                      ] }),
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section gl-comp-suggestions", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsxs("h4", { children: [
                            s(Ve === "biological" ? "Conservative suggestions" : "Control-data suggestions"),
                            " (",
                            Se.items.length,
                            ")"
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { children: s("{evaluable} evaluable of {screened} screened pairs for {population}. Inspect before flagging.", {
                            evaluable: Se.evaluableCount.toLocaleString(),
                            screened: Se.screenedCount.toLocaleString(),
                            population: (Q == null ? void 0 : Q.name) ?? s("All Events")
                          }) })
                        ] }) }),
                        Se.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: Se.items.map((n) => {
                          const a = Zt(n, u.kind, Ve);
                          return /* @__PURE__ */ e.jsxs("article", { className: Nn.has(n.pairKey) ? "is-flagged" : void 0, children: [
                            /* @__PURE__ */ e.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => we(n.pairKey),
                                children: [
                                  /* @__PURE__ */ e.jsxs("strong", { children: [
                                    n.source.label,
                                    " → ",
                                    n.receiver.label
                                  ] }),
                                  /* @__PURE__ */ e.jsx("em", { className: `gl-comp-suggestion-badge is-${a.category}`, children: s(a.label) }),
                                  /* @__PURE__ */ e.jsxs("span", { children: [
                                    n.interaction && n.interaction !== "other" ? `${n.interaction} · ` : "",
                                    s("{coefficient}% · shift {shift} MAD · slope {slope}", {
                                      coefficient: (n.coefficient * 100).toFixed(1),
                                      shift: se(n.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: se(n.evidence.residualSlope ?? 0, 4)
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
                                  checked: Nn.has(n.pairKey),
                                  "aria-label": s("Flag suggested {source} to {receiver} for follow-up", {
                                    source: n.source.label,
                                    receiver: n.receiver.label
                                  }),
                                  onChange: (c) => Ln(n.pairKey, c.currentTarget.checked)
                                }
                              ),
                              /* @__PURE__ */ e.jsx("span", { children: s("Follow up") })
                            ] })
                          ] }, n.pairKey);
                        }) })
                      ] })
                    ] })
                  ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("Install a profile-derived compensation layer before curating or sweeping pairs. The embedded FCS matrix remains inspectable in the Matrix view.") })
                ] }),
                Lt(),
                Ot()
              ]
            }
          ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: s(D ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : t.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
          (u || D) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": s("Advanced compensation tools"), children: [
            Bn.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Matrix evidence") }),
              D ? j ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-evidence-grid", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Profile ID") }),
                    /* @__PURE__ */ e.jsx("dd", { children: j.profileId })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Created") }),
                    /* @__PURE__ */ e.jsx("dd", { children: new Date(j.createdAt).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Matrix source") }),
                    /* @__PURE__ */ e.jsx("dd", { children: ha(j, s) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Orientation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("Source rows → receiver columns") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Imported dimensions") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{sources} sources × {receivers} receivers", {
                      sources: j.scientific.matrix.sourceChannels.length,
                      receivers: j.scientific.matrix.receiverChannels.length
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Applied solve") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{count} exact $PnN channels · {status}", {
                      count: D.includedPnns.length,
                      status: q.state
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Matrix hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: j.matrixHash, children: [
                      j.matrixHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Profile hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: j.profileHash, children: [
                      j.profileHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Provenance") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s(((Rs = j.provenance) == null ? void 0 : Rs.sourceDescription) ?? "No additional source note supplied") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Estimation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s(((Ks = j.provenance) == null ? void 0 : Ks.estimationMethod) ?? "Imported coefficients preserved exactly") })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-method-card", "aria-label": s("Installed compensation method"), children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Pipeline") }),
                    /* @__PURE__ */ e.jsx("strong", { children: s(j.scientific.kind === "cytof-spillover" ? "Original counts → NNLS → Compensated counts → arcsinh display" : "Original values → linear matrix inverse → Compensated values → display transform") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Solver") }),
                    /* @__PURE__ */ e.jsx("strong", { children: j.scientific.solverVersion }),
                    /* @__PURE__ */ e.jsx("small", { children: j.scientific.solverSettings.map(({ key: n, value: a }) => `${n}=${String(a)}`).join(" · ") })
                  ] })
                ] }),
                Te && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": s("Original versus Compensated preview"), children: [
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { children: s("Original → Compensated impact") }),
                    /* @__PURE__ */ e.jsx("span", { children: s("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                      events: Te.previewEvents.toLocaleString(),
                      channels: D.includedPnns.length
                    }) })
                  ] }) }),
                  /* @__PURE__ */ e.jsxs("dl", { children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Values changed") }),
                      /* @__PURE__ */ e.jsxs("dd", { children: [
                        Te.changedValues.toLocaleString(),
                        " / ",
                        Te.comparedValues.toLocaleString(),
                        " (",
                        nn(Te.changedValues / Te.comparedValues, !1, 4),
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Median |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: se(Te.medianAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Maximum |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: se(Te.maxAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Largest median shift") }),
                      /* @__PURE__ */ e.jsxs("dd", { title: Te.mostChangedChannel, children: [
                        Te.mostChangedChannel,
                        " · ",
                        se(Te.mostChangedChannelMedianDelta, 5)
                      ] })
                    ] }),
                    D.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Negative → zero") }),
                      /* @__PURE__ */ e.jsx("dd", { children: s("{count} preview values", { count: Te.zeroedNegativeValues.toLocaleString() }) })
                    ] })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ e.jsx("p", { children: s("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
                profile: D.profileId,
                method: at,
                count: D.includedPnns.length,
                status: q.state
              }) }) : /* @__PURE__ */ e.jsx("p", { children: s("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
                channels: ee.channels.length,
                warnings: Rt.length || s("no")
              }) })
            ] }),
            Bn.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Review queue") }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: s("Matrix integrity") }),
                rt.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: rt.map((n) => /* @__PURE__ */ e.jsx("li", { children: s(n) }, n)) }) : /* @__PURE__ */ e.jsx("p", { children: s("No matrix-level items currently require review.") })
              ] }),
              q.state === "ready" && u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: s("Residual-evidence shortlist") }),
                /* @__PURE__ */ e.jsx("p", { children: s("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                  screened: Se.screenedCount.toLocaleString(),
                  candidateSuffix: Se.candidateCount > Se.screenedCount ? s(" of {count}", { count: Se.candidateCount.toLocaleString() }) : "",
                  zeroSuffix: u.kind === "cytof" ? s(", and new exact-zero pile") : "",
                  modeNote: s(Ve === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
                }) }),
                Se.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: Se.items.map((n) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => Fs(n.sourceIndex, n.receiverIndex),
                    children: [
                      /* @__PURE__ */ e.jsxs("span", { children: [
                        /* @__PURE__ */ e.jsxs("strong", { children: [
                          n.source.label,
                          " → ",
                          n.receiver.label
                        ] }),
                        /* @__PURE__ */ e.jsxs("small", { children: [
                          n.interaction && n.interaction !== "other" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                            n.interaction,
                            " · "
                          ] }) : null,
                          s("matrix {value}%", { value: (n.coefficient * 100).toFixed(1) })
                        ] })
                      ] }),
                      /* @__PURE__ */ e.jsxs("span", { children: [
                        s("shift {shift} MAD · slope {slope}", {
                          shift: se(n.evidence.normalizedNegativeShift ?? 0, 3),
                          slope: se(n.evidence.residualSlope ?? 0, 4)
                        }),
                        u.kind === "cytof" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                          " ",
                          s("· zero Δ {value} pp", { value: `${n.evidence.receiverZeroDeltaFraction >= 0 ? "+" : ""}${(n.evidence.receiverZeroDeltaFraction * 100).toFixed(1)}` })
                        ] }) : null
                      ] })
                    ]
                  },
                  n.pairKey
                )) }) : /* @__PURE__ */ e.jsx("p", { children: s("No pair had enough source-high, source-low, and receiver-negative events for this conservative screen. Visual inspection remains available from the matrix.") })
              ] })
            ] })
          ] }),
          Li && u && /* @__PURE__ */ e.jsx(
            Gr,
            {
              profileLabel: (j == null ? void 0 : j.name) ?? (pe ? "SCE_spillover" : "embedded_FCS"),
              installedLabel: s(
                j ? "Installed matrix" : pe ? "SCE spillover matrix" : "Embedded FCS matrix"
              ),
              installedMatrix: {
                sourceChannels: u.sourceAxisKeys,
                receiverChannels: u.receiverAxisKeys,
                matrix: u.matrix
              },
              workingMatrix: Bi,
              pendingEditCount: Object.keys(Y).length,
              onClose: () => ds(!1)
            }
          ),
          Oi && /* @__PURE__ */ e.jsx(
            Ur,
            {
              sampleName: i,
              populationName: (Q == null ? void 0 : Q.name) ?? s("All Events"),
              filterLabel: ys,
              pairCount: bs.length,
              onExport: cr,
              onClose: () => us(!1)
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
function ga(t, i) {
  const r = t.visible !== !1, o = i.visible !== !1;
  return r || o ? !1 : t.sample === i.sample && t.stateKey === i.stateKey;
}
const xa = N.memo(ma, ga);
export {
  xa as CompensationTab
};
