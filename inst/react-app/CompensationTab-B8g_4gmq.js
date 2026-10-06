import { D as Qt, r as hr, l as pr, s as mr, z as gr, f as fr, u as Be, a as N, j as e, b as fe, c as ie, p as tn, v as ct, d as xr, e as vr, g as br, S as zs, h as yr, i as _t, k as _s, F as Us, m as jr, n as wr, o as Nr, C as Cr, q as Sr } from "./embed-DA6AQhjz.js";
function Wt(t) {
  const i = t.trim().normalize("NFC"), r = i.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (r)
    return { element: r[1], mass: Number(r[2]) };
  const o = i.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return o ? { element: o[2], mass: Number(o[1]) } : null;
}
function Bs(t) {
  return t.map((i, r) => ({ channel: i, index: r, isotope: Wt(i) })).sort((i, r) => i.isotope && r.isotope ? i.isotope.mass - r.isotope.mass || i.isotope.element.localeCompare(r.isotope.element) || i.index - r.index : i.isotope ? -1 : r.isotope ? 1 : i.index - r.index).map(({ index: i }) => i);
}
function Mr(t) {
  const i = Bs(t.sourceChannels), r = Bs(t.receiverChannels);
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
  const r = Wt(t), o = Wt(i);
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
function pn(t, i, r) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(i) || i <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (r && r.length !== t)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const o = r ? r.reduce((g, j) => g + (j ? 1 : 0), 0) : t, l = Math.min(o, i), h = new Uint32Array(l);
  if (l === 0) return h;
  if (!r) {
    if (l === 1) return h;
    for (let g = 0; g < l; g++)
      h[g] = Math.floor(g * (t - 1) / (l - 1));
    return h;
  }
  const p = Array.from({ length: l }, (g, j) => l === 1 ? 0 : Math.floor(j * (o - 1) / (l - 1)));
  let f = 0, v = 0;
  for (let g = 0; g < t && v < l; g++)
    r[g] && (f === p[v] && (h[v++] = g), f++);
  return h;
}
function fn(t, i) {
  if (t.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (t.length - 1), o = Math.floor(r), l = Math.ceil(r);
  return o === l ? t[o] : t[o] + (t[l] - t[o]) * (r - o);
}
function ut(t) {
  const i = t.filter(Number.isFinite).sort((h, p) => h - p);
  if (i.length === 0) return [-1, 1];
  let r = fn(i, 2e-3), o = fn(i, 0.998);
  if (!(o > r)) {
    const h = Number.isFinite(r) ? r : 0, p = Math.max(1, Math.abs(h) * 0.05);
    return [h - p, h + p];
  }
  const l = (o - r) * 0.035;
  return r -= l, o += l, [r, o];
}
function Ue(t) {
  if (t.length === 0) return Number.NaN;
  const i = [...t].sort((r, o) => r - o);
  return fn(i, 0.5);
}
function ht(t) {
  if (t.length === 0) return Number.NaN;
  const i = Ue(t), r = Ue(t.map((p) => Math.abs(p - i))) * 1.4826;
  if (Number.isFinite(r) && r > 0) return r;
  const o = t.reduce((p, f) => p + f, 0) / t.length, l = t.reduce((p, f) => p + (f - o) ** 2, 0) / Math.max(1, t.length - 1), h = Math.sqrt(l);
  return Number.isFinite(h) && h > 0 ? h : 1e-12;
}
function Zt(t, i, r = 12) {
  if (t.length !== i.length || t.length < r * 8) return null;
  const o = Array.from({ length: t.length }, (f, v) => v).sort((f, v) => t[f] - t[v]), l = [];
  for (let f = 0; f < r; f++) {
    const v = Math.floor(f * o.length / r), g = Math.floor((f + 1) * o.length / r), j = o.slice(v, g);
    if (j.length < 8) continue;
    const F = Ue(j.map((S) => t[S])), T = Ue(j.map((S) => i[S]));
    Number.isFinite(F) && Number.isFinite(T) && l.push({ x: F, y: T });
  }
  const h = [];
  for (let f = 0; f < l.length; f++)
    for (let v = f + 1; v < l.length; v++) {
      const g = l[v].x - l[f].x;
      if (g === 0) continue;
      const j = (l[v].y - l[f].y) / g;
      Number.isFinite(j) && h.push(j);
    }
  const p = Ue(h);
  return Number.isFinite(p) ? p : null;
}
function kr(t, i) {
  if (t.length !== i.length || t.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const r = Array.from({ length: t.length }, (E, R) => R).filter((E) => Number.isFinite(t[E]) && Number.isFinite(i[E])).sort((E, R) => t[E] - t[R]);
  if (r.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const o = Math.max(96, Math.floor(r.length * 0.8)), l = Math.min(r.length - 24, Math.floor(r.length * 0.9)), h = r.slice(0, o), p = r.slice(l);
  if (h.length < 96 || p.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const f = h.map((E) => t[E]), v = h.map((E) => i[E]), g = Zt(f, v, 10);
  if (g === null) return { excessMad: null, slopeDeltaMad: null };
  const j = Ue(h.map((E) => i[E] - g * t[E])), F = h.map((E) => i[E] - (j + g * t[E])), T = Math.max(
    ht(F),
    ht(v) * 0.05,
    1e-12
  ), S = p.map((E) => i[E] - (j + g * t[E])).sort((E, R) => E - R), A = fn(S, 0.75) / T, I = r.slice(Math.floor(r.length * 0.75)), P = I.map((E) => t[E]), M = I.map((E) => i[E]), k = Zt(P, M, 4), $ = fn(P, 0.9) - fn(P, 0.1), C = k === null || !($ > 0) ? null : (k - g) * $ / T;
  return {
    excessMad: Number.isFinite(A) ? A : null,
    slopeDeltaMad: Number.isFinite(C) ? C : null
  };
}
function mi(t, i, r, o, l, h) {
  const p = r.length, f = kr(r, o), v = Math.min(50, Math.max(12, Math.floor(p * 0.01))), g = (U = 0, G = 0, s = 0) => ({
    status: "insufficient",
    sourceLowEvents: U,
    sourceHighEvents: G,
    destinationNegativeEvents: s,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: f.excessMad,
    upperTailSlopeDeltaMad: f.slopeDeltaMad,
    receiverZeroDeltaFraction: p > 0 ? (h - l) / p : 0
  });
  if (p < v * 3) return g();
  const j = [...r].sort((U, G) => U - G), F = fn(j, 0.25), T = r.flatMap((U, G) => U <= F ? [G] : []);
  if (T.length < v) return g(T.length);
  const S = T.map((U) => r[U]), A = Ue(S), I = ht(S);
  let P = r.flatMap((U, G) => U >= A + 3 * I ? [G] : []);
  if (P.length < v && (P = Array.from({ length: p }, (U, G) => G).sort((U, G) => r[G] - r[U]).slice(0, v)), P.length < v) return g(T.length, P.length);
  const M = T.map((U) => o[U]), k = Ue(M), $ = ht(M), C = k + 5 * $, E = o.flatMap((U, G) => U <= C ? [G] : []), R = new Set(E), K = T.filter((U) => R.has(U)), D = P.filter((U) => R.has(U));
  if (K.length < v || D.length < v)
    return g(T.length, P.length, E.length);
  const V = (Ue(D.map((U) => o[U])) - Ue(K.map((U) => o[U]))) / $, q = E.map((U) => t[U]), H = E.map((U) => i[U]);
  return {
    status: "ready",
    sourceLowEvents: T.length,
    sourceHighEvents: P.length,
    destinationNegativeEvents: E.length,
    normalizedNegativeShift: Number.isFinite(V) ? V : null,
    residualSlope: Zt(q, H),
    upperTailExcessMad: f.excessMad,
    upperTailSlopeDeltaMad: f.slopeDeltaMad,
    receiverZeroDeltaFraction: p > 0 ? (h - l) / p : 0
  };
}
function pt(t, i, r, o, l, h) {
  let p = 0, f = 0, v = 0;
  for (let g = 0; g < r.length; g++) {
    const j = Math.abs(r[g]) <= 1e-12, F = Math.abs(o[g]) <= 1e-12;
    j && p++, F && f++, j && F && v++;
  }
  return {
    x: t.map((g) => Math.max(l[0], Math.min(l[1], g))),
    y: i.map((g) => Math.max(h[0], Math.min(h[1], g))),
    zeroPile: Object.freeze({
      source: p,
      receiver: f,
      corner: v
    })
  };
}
function Ut(t, i, r, o = {}) {
  var U;
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
  const f = ((U = o.fixedEventIndices) == null ? void 0 : U.slice()) ?? pn(
    t.fcs.nEvents,
    o.maxEvents ?? 15e3,
    o.eventMask
  );
  for (const G of f)
    if (G >= t.fcs.nEvents || o.eventMask && !o.eventMask[G])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const v = t.channels[h].key, g = t.channels[p].key, j = t.originalColumnData(h), F = t.originalColumnData(p), T = t.compensatedColumnData(h), S = t.compensatedColumnData(p), A = [], I = [], P = [], M = [], k = [], $ = [], C = [], E = [];
  for (const G of f) {
    const s = t.rawToDisplay(v, j[G]), W = t.rawToDisplay(g, F[G]), Ie = t.rawToDisplay(v, T[G]), z = t.rawToDisplay(g, S[G]);
    [s, W, Ie, z].every(Number.isFinite) && (A.push(s), I.push(W), P.push(j[G]), M.push(F[G]), k.push(Ie), $.push(z), C.push(T[G]), E.push(S[G]));
  }
  const R = ut([...A, ...k]), K = ut([...I, ...$]), D = t.channelTicks(h, [R[0], R[1]]), V = t.channelTicks(p, [K[0], K[1]]), q = pt(
    A,
    I,
    P,
    M,
    R,
    K
  ), H = pt(
    k,
    $,
    C,
    E,
    R,
    K
  );
  return {
    ready: !0,
    preview: {
      eventCount: A.length,
      totalEvents: o.eventMask ? o.eligibleEventCount ?? o.eventMask.reduce((G, s) => G + (s ? 1 : 0), 0) : t.fcs.nEvents,
      xRange: R,
      yRange: K,
      xTicks: D,
      yTicks: V,
      original: q,
      compensated: H,
      evidence: mi(
        C,
        E,
        k,
        $,
        q.zeroPile.receiver,
        H.zeroPile.receiver
      )
    }
  };
}
function Bt(t, i, r, o, l, h, p = {}) {
  const f = dt(t, i), v = dt(t, r);
  if (f === void 0 || v === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (l.length !== o.length || h.length !== o.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const g = t.channels[f].key, j = t.channels[v].key, F = t.originalColumnData(f), T = t.originalColumnData(v), S = [], A = [], I = [], P = [], M = [], k = [], $ = [], C = [];
  for (let H = 0; H < o.length; H++) {
    const U = o[H];
    if (U >= t.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const G = F[U], s = T[U], W = l[H], Ie = h[H], z = t.rawToDisplay(g, G), w = t.rawToDisplay(j, s), ne = t.rawToDisplay(g, W), me = t.rawToDisplay(j, Ie);
    [G, s, W, Ie, z, w, ne, me].every(Number.isFinite) && (S.push(z), A.push(w), I.push(G), P.push(s), M.push(ne), k.push(me), $.push(W), C.push(Ie));
  }
  const E = p.xRange ?? ut([...S, ...M]), R = p.yRange ?? ut([...A, ...k]), K = t.channelTicks(f, [E[0], E[1]]), D = t.channelTicks(v, [R[0], R[1]]), V = pt(S, A, I, P, E, R), q = pt(M, k, $, C, E, R);
  return {
    ready: !0,
    preview: {
      eventCount: S.length,
      totalEvents: p.totalEvents ?? t.fcs.nEvents,
      xRange: E,
      yRange: R,
      xTicks: K,
      yTicks: D,
      original: V,
      compensated: q,
      evidence: mi(
        $,
        C,
        M,
        k,
        V.zeroPile.receiver,
        q.zeroPile.receiver
      )
    }
  };
}
const Vs = 0.5, Er = 0.01, Ar = 1e-4, Tr = 0.05, $r = 3, Fr = 1, Ir = 5;
function gi(t, i) {
  const r = t.evidence.normalizedNegativeShift ?? 0, o = t.evidence.residualSlope ?? 0, l = Math.max(0, t.evidence.upperTailExcessMad ?? 0), h = Math.max(0, t.evidence.upperTailSlopeDeltaMad ?? 0), p = Math.abs(t.coefficient), f = Math.max(
    Ar,
    p * Tr
  );
  return {
    negativeShift: Math.max(0, -r),
    negativeSlope: Math.max(0, -o),
    zeroDelta: i === "cytof" ? Math.max(0, t.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, r),
    positiveSlope: Math.max(0, o),
    upperTailExcess: l,
    upperTailSlopeDelta: h,
    hasNegativeShift: r <= -Vs,
    hasNegativeSlope: o <= -f,
    hasNewZeroPile: i === "cytof" && t.evidence.receiverZeroDeltaFraction >= Er,
    hasPositiveShift: r >= Vs,
    hasPositiveSlope: o >= f,
    hasHighTailCurve: l >= $r && (h >= Fr || l >= Ir)
  };
}
function Pr(t) {
  return Number(t.hasNegativeShift) + Number(t.hasNegativeSlope) + Number(t.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : t.hasNewZeroPile ? "new-zero-pile" : t.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function Ht(t, i, r = "biological") {
  const o = gi(t, i), l = o.hasNegativeShift || o.hasNegativeSlope || o.hasNewZeroPile, h = o.hasPositiveShift || o.hasPositiveSlope, p = o.hasHighTailCurve || r === "control" && h;
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
function nn(t, i) {
  if (!Number.isFinite(t) || t <= 0) return 0;
  const r = i.filter((l) => Number.isFinite(l) && l > 0).sort((l, h) => l - h);
  if (r.length === 0) return 0;
  let o = 0;
  for (const l of r)
    if (l <= t) o++;
    else break;
  return o / r.length;
}
function Rr(t, i, r = "biological") {
  const o = t.map((A) => ({
    ...gi(A, i),
    coefficient: Math.abs(A.coefficient)
  })), l = (A) => o.map((I) => typeof I[A] == "number" ? I[A] : 0), h = l("negativeShift"), p = l("negativeSlope"), f = l("zeroDelta"), v = l("positiveShift"), g = l("positiveSlope"), j = l("upperTailExcess"), F = l("upperTailSlopeDelta"), T = l("coefficient"), S = t.flatMap((A, I) => {
    const P = Ht(A, i, r);
    if (!P.automaticFollowup || P.reason === null) return [];
    const M = o[I], k = 0.22 * nn(M.negativeShift, h) + 0.13 * nn(M.negativeSlope, p) + 0.14 * nn(M.zeroDelta, f) + (r === "control" ? 0.13 * nn(M.positiveShift, v) : 0) + (r === "control" ? 0.08 * nn(M.positiveSlope, g) : 0) + 0.12 * nn(M.upperTailExcess, j) + 0.08 * nn(M.upperTailSlopeDelta, F) + 0.05 * nn(M.coefficient, T) + 0.05 * Math.max(0, Math.min(1, A.physicalPrior));
    return [{
      index: I,
      relativePriority: k,
      reason: P.reason,
      category: P.category
    }];
  });
  return Object.freeze(S.sort((A, I) => I.relativePriority - A.relativePriority || A.index - I.index));
}
function Kr(t, i) {
  const r = t.index(i);
  if (r !== void 0) return r;
  const o = t.channels.findIndex((l) => l.pnn === i);
  return o < 0 ? void 0 : o;
}
function Yt(t, i) {
  if (t.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (t.length - 1), o = Math.floor(r), l = Math.ceil(r);
  return o === l ? t[o] : t[o] + (t[l] - t[o]) * (r - o);
}
function Lr(t) {
  const i = t.filter(Number.isFinite).sort((h, p) => h - p);
  if (i.length === 0) return [-1, 1];
  let r = Yt(i, 2e-3), o = Yt(i, 0.998);
  if (!(o > r)) {
    const h = Number.isFinite(r) ? r : 0, p = Math.max(1, Math.abs(h) * 0.05);
    return [h - p, h + p];
  }
  const l = (o - r) * 0.035;
  return r -= l, o += l, [r, o];
}
function Or(t) {
  if (t.length === 0) return "0:empty";
  let i = 2166136261;
  for (const r of t)
    i ^= r, i = Math.imul(i, 16777619) >>> 0;
  return `${t.length}:${t[0]}:${t[t.length - 1]}:${i.toString(16)}`;
}
function Dr(t, i, r = {}) {
  var f;
  if (t.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const l = ((f = r.fixedEventIndices) == null ? void 0 : f.slice()) ?? pn(
    t.fcs.nEvents,
    r.maxEvents ?? 2500,
    r.eventMask
  );
  for (const v of l)
    if (v >= t.fcs.nEvents || r.eventMask && !r.eventMask[v])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const h = /* @__PURE__ */ new Map();
  for (const v of Array.from(new Set(i))) {
    const g = Kr(t, v);
    if (g === void 0) continue;
    const j = t.channels[g], F = t.originalColumnData(g), T = t.compensatedColumnData(g), S = new Float64Array(l.length), A = new Float64Array(l.length), I = new Float64Array(l.length), P = new Float64Array(l.length), M = [];
    for (let C = 0; C < l.length; C++) {
      const E = l[C], R = F[E], K = T[E], D = t.rawToDisplay(j.key, R), V = t.rawToDisplay(j.key, K);
      S[C] = R, A[C] = K, I[C] = D, P[C] = V, Number.isFinite(D) && M.push(D), Number.isFinite(V) && M.push(V);
    }
    const k = Lr(M), $ = Object.freeze({
      key: j.key,
      pnn: j.pnn,
      range: k,
      ticks: t.channelTicks(g, [k[0], k[1]]),
      originalRaw: S,
      compensatedRaw: A,
      originalDisplay: I,
      compensatedDisplay: P
    });
    h.set(v, $), h.set(j.key, $), h.set(j.pnn, $);
  }
  const p = r.eventMask ? r.eligibleEventCount ?? r.eventMask.reduce((v, g) => v + (g ? 1 : 0), 0) : t.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: l,
      eventSignature: Or(l),
      eligibleEventCount: p,
      channels: h
    })
  };
}
function qs(t, i, r, o, l, h, p) {
  const f = [], v = [];
  let g = 0, j = 0, F = 0;
  for (const T of l) {
    f.push(Math.max(h[0], Math.min(h[1], t[T]))), v.push(Math.max(p[0], Math.min(p[1], i[T])));
    const S = Math.abs(r[T]) <= 1e-12, A = Math.abs(o[T]) <= 1e-12;
    S && g++, A && j++, S && A && F++;
  }
  return {
    x: f,
    y: v,
    zeroPile: Object.freeze({ source: g, receiver: j, corner: F })
  };
}
function fi(t, i, r) {
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
      original: qs(
        o.originalDisplay,
        l.originalDisplay,
        o.originalRaw,
        l.originalRaw,
        h,
        o.range,
        l.range
      ),
      compensated: qs(
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
function Gs(t, i, r, o, l) {
  const h = Math.max(1, Math.min(24, Math.round(l) || 3)), p = 256, f = h, v = p + 2 * f, g = new Float64Array(v * v), j = Math.max(1e-12, i[1] - i[0]), F = Math.max(1e-12, r[1] - r[0]);
  for (let M = 0; M < t.x.length; M++) {
    const k = Math.max(0, Math.min(
      v - 1,
      Math.floor((t.x[M] - i[0]) / j * p) + f
    )), $ = Math.max(0, Math.min(
      v - 1,
      Math.floor((t.y[M] - r[0]) / F * p) + f
    ));
    g[$ * v + k]++;
  }
  const T = new Float64Array(v * v), S = (h * 2 + 1) ** 2, A = v + 1, I = new Float64Array(A * A);
  for (let M = 0; M < v; M++) {
    let k = 0;
    for (let $ = 0; $ < v; $++)
      k += g[M * v + $], I[(M + 1) * A + $ + 1] = I[M * A + $ + 1] + k;
  }
  for (let M = h; M < v - h; M++) {
    const k = M - h, $ = M + h + 1;
    for (let C = h; C < v - h; C++) {
      const E = C - h, R = C + h + 1, K = I[$ * A + R] - I[k * A + R] - I[$ * A + E] + I[k * A + E];
      T[M * v + C] = K / S;
    }
  }
  const P = [];
  for (let M = f; M < f + p; M++)
    for (let k = f; k < f + p; k++) {
      const $ = T[M * v + k];
      $ > 0 && P.push($);
    }
  return P.sort((M, k) => M - k), P.length === 0 ? 1 : Math.max(1e-12, Yt(P, o));
}
function es(t, i) {
  const r = Math.max(1, Math.min(10, Number.isFinite(t) ? t : 6)), o = Math.max(1, (Number.isFinite(i) ? i : 220) - 50);
  return Math.max(1, Math.min(24, r * 170 / o));
}
function ns(t, i = 0.95, r = 3, o = Qt) {
  const l = Math.max(
    Gs(t.original, t.xRange, t.yRange, i, r),
    Gs(t.compensated, t.xRange, t.yRange, i, r)
  );
  return hr(l, o);
}
function mt(t, i) {
  const r = i.size / 220, o = Math.sqrt(r), l = Math.max(9, Math.min(12, 11 * o)), h = Math.max(10, Math.min(13, 12 * o));
  pr().renderMiniPlot(t, {
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
const mn = "http://www.w3.org/2000/svg", _n = 6, gn = 1123, Un = 794;
function xi(t) {
  return Math.ceil(Math.max(0, Math.floor(t)) / _n);
}
function Ws(t) {
  return t.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function vi(t, i) {
  return `gatelab-compensation-${Ws(t.replace(/\.[^.]+$/, ""))}-${Ws(i)}`;
}
function Xt(t, i, r, o) {
  const l = vi(t, i);
  return r === "pdf" || o <= 1 ? `${l}.${r}` : `${l}-${r}-pages.zip`;
}
function En(t, i, r, o, l = {}) {
  const h = document.createElementNS(mn, "text");
  return h.setAttribute("x", String(r)), h.setAttribute("y", String(o)), h.setAttribute("font-family", "Arial, Helvetica, sans-serif"), h.setAttribute("font-size", String(l.size ?? 10)), h.setAttribute("font-weight", String(l.weight ?? 400)), h.setAttribute("fill", l.fill ?? "#253247"), l.anchor && h.setAttribute("text-anchor", l.anchor), h.textContent = i, t.appendChild(h), h;
}
function Zs(t, i) {
  return t.length <= i ? t : `${t.slice(0, Math.max(1, i - 1))}…`;
}
function Hs(t, i, r, o, l, h, p, f, v, g, j, F) {
  const T = document.createElement("div");
  mt(T, {
    title: o === "original" ? "Original" : "Compensated",
    panel: r[o],
    preview: r,
    sourceLabel: i.sourceLabel,
    receiverLabel: i.receiverLabel,
    size: p,
    densityColorCeiling: v,
    densitySmoothingRadius: f,
    densityColorPower: g,
    pointAlpha: j,
    pointSize: F,
    canvasScale: 300 / 96
  });
  const S = T.querySelector("canvas"), A = T.querySelector("svg");
  if (!S || !A) throw new Error("GateLab could not render a compensation export panel.");
  const I = document.createElementNS(mn, "g");
  I.setAttribute("transform", `translate(${l},${h})`);
  const P = document.createElementNS(mn, "image");
  P.setAttribute("x", "0"), P.setAttribute("y", "0"), P.setAttribute("width", String(p)), P.setAttribute("height", String(p)), P.setAttribute("href", S.toDataURL("image/png")), I.appendChild(P), I.appendChild(A.cloneNode(!0)), t.appendChild(I);
}
function Ys(t, i, r, o) {
  const l = document.createElementNS(mn, "svg");
  l.setAttribute("xmlns", mn), l.setAttribute("width", String(gn)), l.setAttribute("height", String(Un)), l.setAttribute("viewBox", `0 0 ${gn} ${Un}`);
  const h = document.createElementNS(mn, "rect");
  h.setAttribute("width", "100%"), h.setAttribute("height", "100%"), h.setAttribute("fill", "#ffffff"), l.appendChild(h), En(l, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), En(
    l,
    Zs(`${i.sampleName} · ${i.populationName} · ${i.profileName} · ${i.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), En(l, `Page ${r + 1} of ${o}`, gn - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const p = 28, f = 18, v = 53, g = 771, j = (gn - p * 2 - f) / 2, F = (g - v) / 3, T = 204, S = 12, A = T * 2 + S;
  return t.forEach((I, P) => {
    const M = I.buildPreview(), k = es(i.densitySmoothing, T), $ = ns(
      M,
      0.95,
      k,
      i.densityColorPower
    ), C = P % 2, E = Math.floor(P / 2), R = p + C * (j + f), K = v + E * F, D = R + (j - A) / 2, V = K + 25, q = I.relationship && I.relationship !== "other" ? ` · ${I.relationship}` : "";
    if (En(
      l,
      Zs(`${I.sourceLabel} → ${I.receiverLabel}`, 58),
      R + 5,
      K + 14,
      { size: 10.5, weight: 700 }
    ), En(
      l,
      `matrix ${(I.coefficient * 100).toFixed(1)}%${q}`,
      R + j - 5,
      K + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), Hs(l, I, M, "original", D, V, T, k, $, i.densityColorPower, i.pointAlpha, i.pointSize ?? 1), Hs(l, I, M, "compensated", D + T + S, V, T, k, $, i.densityColorPower, i.pointAlpha, i.pointSize ?? 1), E < 2) {
      const H = document.createElementNS(mn, "line");
      H.setAttribute("x1", String(R)), H.setAttribute("x2", String(R + j)), H.setAttribute("y1", String(K + F - 3)), H.setAttribute("y2", String(K + F - 3)), H.setAttribute("stroke", "#e6eaf0"), H.setAttribute("stroke-width", "1"), l.appendChild(H);
    }
  }), En(
    l,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), l;
}
function Xs(t) {
  return fr(t, { widthPx: gn, heightPx: Un }), `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(t)}`;
}
async function Js(t, i = 300) {
  const r = URL.createObjectURL(new Blob([t], { type: "image/svg+xml" }));
  try {
    const o = await new Promise((f, v) => {
      const g = new Image();
      g.onload = () => f(g), g.onerror = () => v(new Error("GateLab could not rasterize the compensation export page.")), g.src = r;
    }), l = Math.max(1, i / 96), h = document.createElement("canvas");
    h.width = Math.round(gn * l), h.height = Math.round(Un * l);
    const p = h.getContext("2d");
    if (!p) throw new Error("Canvas export is unavailable in this browser.");
    return p.fillStyle = "#ffffff", p.fillRect(0, 0, h.width, h.height), p.scale(l, l), p.drawImage(o, 0, 0, gn, Un), await new Promise((f, v) => {
      h.toBlob((g) => g ? f(g) : v(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(r);
  }
}
function Qs(t, i) {
  const r = URL.createObjectURL(t), o = document.createElement("a");
  o.href = r, o.download = i, document.body.appendChild(o), o.click(), o.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function zr(t, i, r, o) {
  const l = Math.max(2, String(r).length);
  return `${t}-page-${String(i + 1).padStart(l, "0")}.${o}`;
}
async function _r(t, i, r, o) {
  const l = xi(t.length);
  if (l === 0) throw new Error("No compensation pairs are available to export.");
  const h = vi(i.sampleName, i.populationName);
  if (r === "pdf") {
    const { jsPDF: g } = await import("./jspdf.es.min-DRSlxWrz.js").then((S) => S.j), j = new g({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), F = j.internal.pageSize.getWidth(), T = j.internal.pageSize.getHeight();
    for (let S = 0; S < l; S++) {
      S > 0 && j.addPage("a4", "landscape");
      const A = t.slice(
        S * _n,
        (S + 1) * _n
      ), I = Xs(Ys(A, i, S, l)), P = await Js(I), M = await new Promise((k, $) => {
        const C = new FileReader();
        C.onload = () => k(String(C.result)), C.onerror = () => $(C.error ?? new Error("GateLab could not read an export page.")), C.readAsDataURL(P);
      });
      j.addImage(M, "PNG", 0, 0, F, T, void 0, "FAST"), o == null || o({ completedPages: S + 1, totalPages: l }), await new Promise((k) => setTimeout(k, 0));
    }
    j.save(Xt(i.sampleName, i.populationName, r, l));
    return;
  }
  const p = {};
  let f = null;
  for (let g = 0; g < l; g++) {
    const j = t.slice(
      g * _n,
      (g + 1) * _n
    ), F = Xs(Ys(j, i, g, l)), T = zr(h, g, l, r);
    if (r === "svg") {
      const S = mr(F);
      p[T] = S, l === 1 && (f = new Blob([S], { type: "image/svg+xml" }));
    } else {
      const S = await Js(F), A = new Uint8Array(await S.arrayBuffer());
      p[T] = A, l === 1 && (f = S);
    }
    o == null || o({ completedPages: g + 1, totalPages: l }), await new Promise((S) => setTimeout(S, 0));
  }
  const v = Xt(
    i.sampleName,
    i.populationName,
    r,
    l
  );
  Qs(l === 1 && f ? f : new Blob([gr(p, { level: 6 })], { type: "application/zip" }), v);
}
const Ur = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function Br({
  sampleName: t,
  populationName: i,
  filterLabel: r,
  pairCount: o,
  onExport: l,
  onClose: h
}) {
  const { t: p } = Be(), [f, v] = N.useState("pdf"), [g, j] = N.useState(null), [F, T] = N.useState(null), S = xi(o), A = g !== null && g.completedPages < g.totalPages, I = Xt(t, i, f, S), P = async () => {
    T(null), j({ completedPages: 0, totalPages: S });
    try {
      await l(f, j), h();
    } catch (k) {
      j(null), T(k instanceof Error ? k.message : String(k));
    }
  }, M = (k) => {
    k.key === "Escape" && !A && h();
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
          Ur.map((k) => /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-comparison-export-format",
                value: k.format,
                checked: f === k.format,
                disabled: A,
                onChange: () => v(k.format)
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: k.title }),
              /* @__PURE__ */ e.jsx("small", { children: p(k.detail) })
            ] })
          ] }, k.format))
        ] }),
        /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary gl-comp-comparison-export-summary", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("File") }),
            /* @__PURE__ */ e.jsx("dd", { title: I, children: I })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("Scope") }),
            /* @__PURE__ */ e.jsx("dd", { children: p(o === 1 ? "{count} filtered pair · both assays" : "{count} filtered pairs · both assays", { count: o.toLocaleString() }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: p("Pages") }),
            /* @__PURE__ */ e.jsx("dd", { children: p(S === 1 ? "{count} A4 landscape page · six pairs per page" : "{count} A4 landscape pages · six pairs per page", { count: S.toLocaleString() }) })
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
        g && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-comparison-export-progress", role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, g.totalPages), value: g.completedPages }),
          /* @__PURE__ */ e.jsx("span", { children: p("Rendering page {current} of {total}", { current: Math.min(g.completedPages + 1, g.totalPages), total: g.totalPages }) })
        ] }),
        F && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: p(F) }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: A, onClick: h, children: p("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: A || S === 0, onClick: () => void P(), children: A ? p("Rendering…") : p("Download {format}", { format: f.toUpperCase() }) })
        ] })
      ]
    }
  ) });
}
function ei(t) {
  return `"${t.replaceAll('"', '""')}"`;
}
function ni(t, i) {
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
function Vr(t) {
  const i = ni(t.sourceChannels, "source"), r = ni(t.receiverChannels, "receiver");
  if (!Array.isArray(t.matrix) || t.matrix.length !== i.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const o = [
    ["channel", ...r].map(ei).join(",")
  ];
  return t.matrix.forEach((l, h) => {
    if (!Array.isArray(l) || l.length !== r.length)
      throw new Error(
        `Spill matrix row ${h + 1} does not match the receiver channel axis.`
      );
    const p = l.map((f, v) => {
      if (typeof f != "number" || !Number.isFinite(f))
        throw new Error(
          `Spill coefficient ${i[h]} → ${r[v]} is not finite.`
        );
      return Object.is(f, -0) ? "0" : String(f);
    });
    o.push([ei(i[h]), ...p].join(","));
  }), `${o.join(`
`)}
`;
}
function qr(t, i = "installed") {
  return `${t.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${i === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function Gr(t) {
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
function Wr({
  profileLabel: t,
  installedLabel: i,
  installedMatrix: r,
  workingMatrix: o = null,
  pendingEditCount: l = 0,
  onClose: h
}) {
  const { t: p } = Be(), [f, v] = N.useState("installed"), [g, j] = N.useState(null), F = f === "working" && o ? o : r, T = qr(t, f), S = N.useMemo(
    () => Gr(T),
    [T]
  ), A = () => {
    j(null);
    try {
      const M = Vr(F), k = URL.createObjectURL(new Blob([M], { type: "text/csv;charset=utf-8" })), $ = document.createElement("a");
      $.href = k, $.download = T, document.body.appendChild($), $.click(), $.remove(), setTimeout(() => URL.revokeObjectURL(k), 1e3);
    } catch (M) {
      j(M instanceof Error ? M.message : String(M));
    }
  }, I = async () => {
    var M;
    if (!((M = navigator.clipboard) != null && M.writeText)) {
      j("Clipboard access is unavailable; select the R code below and copy it manually.");
      return;
    }
    try {
      await navigator.clipboard.writeText(S), j("R import code copied.");
    } catch {
      j("Clipboard access was denied; select the R code below and copy it manually.");
    }
  }, P = (M) => {
    M.key === "Escape" && h();
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: P, children: /* @__PURE__ */ e.jsxs(
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
                checked: f === "installed",
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
                checked: f === "working",
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
            /* @__PURE__ */ e.jsx("dd", { children: p("{sources} sources × {receivers} receivers", { sources: F.sourceChannels.length, receivers: F.receiverChannels.length }) })
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
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => void I(), children: p("Copy R code") })
        ] }),
        /* @__PURE__ */ e.jsx("pre", { className: "gl-comp-export-code", children: /* @__PURE__ */ e.jsx("code", { children: S }) }),
        g && /* @__PURE__ */ e.jsx("div", { className: g.includes("copied") ? "gl-comp-status" : "gl-comp-warning", role: "status", children: g }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: h, children: p("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", onClick: A, children: p("Download CSV") })
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
  step: f,
  title: v,
  onPointerDown: g,
  onPointerMove: j,
  onPointerUp: F,
  onPointerCancel: T,
  onLostPointerCapture: S,
  ...A
}) {
  const { t: I } = Be(), P = N.useRef(null), [M, k] = N.useState(!1), $ = (C) => {
    var E, R, K;
    ((E = P.current) == null ? void 0 : E.pointerId) === C.pointerId && (P.current = null, k(!1), (K = (R = C.currentTarget).hasPointerCapture) != null && K.call(R, C.pointerId) && C.currentTarget.releasePointerCapture(C.pointerId));
  };
  return /* @__PURE__ */ e.jsx(
    "input",
    {
      ...A,
      type: "number",
      className: `gl-scrubbable-number${M ? " is-scrubbing" : ""}${o ? ` ${o}` : ""}`,
      value: t,
      disabled: l,
      min: h,
      max: p,
      step: f,
      title: v ?? I("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (C) => i(C.currentTarget.value),
      onPointerDown: (C) => {
        var q, H;
        if (g == null || g(C), C.defaultPrevented || l || C.button !== 0) return;
        const E = C.currentTarget.getBoundingClientRect();
        if (C.clientX >= E.right - 18) return;
        const R = Number(t), K = (r ?? Number(f)) || 0.1;
        if (!Number.isFinite(R) || !(K > 0)) return;
        const D = String(K), V = D.includes("e-") ? Number(D.split("e-")[1]) : D.includes(".") ? D.split(".")[1].length : 0;
        P.current = {
          pointerId: C.pointerId,
          startY: C.clientY,
          startValue: R,
          step: K,
          decimals: V,
          lastSteps: 0
        }, (H = (q = C.currentTarget).setPointerCapture) == null || H.call(q, C.pointerId);
      },
      onPointerMove: (C) => {
        j == null || j(C);
        const E = P.current;
        if (!E || E.pointerId !== C.pointerId) return;
        const R = E.startY - C.clientY;
        if (Math.abs(R) < 3) return;
        const K = R > 0 ? Math.floor(R / 4) : Math.ceil(R / 4);
        if (K === E.lastSteps) return;
        let D = E.startValue + K * E.step;
        const V = h === void 0 ? Number.NEGATIVE_INFINITY : Number(h), q = p === void 0 ? Number.POSITIVE_INFINITY : Number(p);
        Number.isFinite(V) && (D = Math.max(V, D)), Number.isFinite(q) && (D = Math.min(q, D)), P.current = { ...E, lastSteps: K }, k(!0), i(D.toFixed(Math.min(10, E.decimals))), C.preventDefault();
      },
      onPointerUp: (C) => {
        F == null || F(C), $(C);
      },
      onPointerCancel: (C) => {
        T == null || T(C), $(C);
      },
      onLostPointerCapture: (C) => {
        var E;
        S == null || S(C), ((E = P.current) == null ? void 0 : E.pointerId) === C.pointerId && (P.current = null, k(!1));
      }
    }
  );
}
const ts = N.createContext(Qt), ss = N.createContext(0.85), is = N.createContext(1), ti = "", lt = [];
let Vt = !1;
function Zr(t) {
  const i = { cancelled: !1, run: t };
  lt.push(i);
  const r = () => {
    if (Vt) return;
    Vt = !0;
    const o = () => {
      Vt = !1;
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
  densityColorCeiling: f,
  densitySmoothing: v,
  showZeroPile: g = !0
}) {
  const { t: j } = Be(), F = N.useContext(ts), T = N.useContext(ss), S = N.useContext(is), A = N.useRef(null);
  N.useEffect(() => {
    const M = A.current;
    if (!M) return;
    let k = null, $ = 0;
    const C = () => {
      var q;
      k = null;
      const K = ((q = M.parentElement) == null ? void 0 : q.clientWidth) ?? 230, D = Math.max(h, Math.min(p, Math.floor(K)));
      if (D === $ && M.childElementCount > 0) return;
      $ = D;
      const V = es(v, D);
      mt(M, {
        title: t,
        panel: i,
        preview: r,
        sourceLabel: o,
        receiverLabel: l,
        size: D,
        densityColorCeiling: f ?? ns(
          r,
          0.95,
          V,
          F
        ),
        densitySmoothingRadius: V,
        densityColorPower: F,
        pointAlpha: T,
        pointSize: S
      });
    }, E = () => {
      k !== null && cancelAnimationFrame(k), k = requestAnimationFrame(C);
    };
    E();
    const R = typeof ResizeObserver > "u" ? null : new ResizeObserver(E);
    return R == null || R.observe(M.parentElement ?? M), () => {
      R == null || R.disconnect(), k !== null && cancelAnimationFrame(k);
    };
  }, [f, F, v, p, h, i, T, S, r, l, o, t]);
  const I = (M) => r.eventCount > 0 ? `${(M / r.eventCount * 100).toFixed(1)}%` : "0.0%", P = i.zeroPile.source > 0 || i.zeroPile.receiver > 0 || i.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": j("{title} density biplot; {source} on x, {receiver} on y", {
    title: t,
    source: o,
    receiver: l
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: A, className: "gl-comp-biplot-surface" }),
    g && P && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: j("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: I(i.zeroPile.source),
      receiver: I(i.zeroPile.receiver),
      both: I(i.zeroPile.corner)
    }) })
  ] });
}
function Hr({
  title: t,
  preview: i,
  sourceLabel: r,
  receiverLabel: o,
  minimumSize: l,
  maximumSize: h,
  densityColorCeiling: p,
  densitySmoothing: f
}) {
  const { t: v } = Be(), g = N.useContext(ts), j = N.useContext(ss), F = N.useContext(is), T = N.useRef(null);
  return N.useEffect(() => {
    const S = T.current;
    if (!S) return;
    let A = null, I = 0;
    const P = () => {
      var H;
      A = null;
      const $ = ((H = S.parentElement) == null ? void 0 : H.clientWidth) ?? l, C = Math.max(l, Math.min(h, Math.floor($)));
      if (C === I && S.dataset.cacheReady === "true") return;
      I = C, S.dataset.cacheReady = "false";
      const E = es(f, C), R = p ?? ns(
        i,
        0.95,
        E,
        g
      );
      mt(S, {
        title: t,
        panel: i.original,
        preview: i,
        sourceLabel: r,
        receiverLabel: o,
        size: C,
        densityColorCeiling: R,
        densitySmoothingRadius: E,
        densityColorPower: g,
        pointAlpha: j,
        pointSize: F,
        canvasScale: 2
      });
      const K = S.querySelector("canvas"), D = S.querySelector("svg"), V = document.createElement("div");
      mt(V, {
        title: t,
        panel: i.compensated,
        preview: i,
        sourceLabel: r,
        receiverLabel: o,
        size: C,
        densityColorCeiling: R,
        densitySmoothingRadius: E,
        densityColorPower: g,
        pointAlpha: j,
        pointSize: F,
        canvasScale: 2
      });
      const q = V.querySelector("canvas");
      !K || !q || !D || (K.classList.add("gl-comp-cached-canvas", "is-original"), K.dataset.assayLayer = "original", q.classList.add("gl-comp-cached-canvas", "is-compensated"), q.dataset.assayLayer = "compensated", S.insertBefore(q, D), S.dataset.cacheReady = "true");
    }, M = () => {
      A == null || A(), A = Zr(P);
    };
    M();
    const k = typeof ResizeObserver > "u" ? null : new ResizeObserver(M);
    return k == null || k.observe(S.parentElement ?? S), () => {
      k == null || k.disconnect(), A == null || A();
    };
  }, [p, g, f, h, l, j, F, i, o, r, t]), /* @__PURE__ */ e.jsx(
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
function si({
  preview: t,
  sourceLabel: i,
  receiverLabel: r,
  kind: o,
  densitySmoothing: l,
  compact: h = !1,
  compensatedTitle: p = "Compensated"
}) {
  const { t: f } = Be(), v = t.eventCount > 0 ? t.original.zeroPile.receiver / t.eventCount * 100 : 0, g = t.eventCount > 0 ? t.compensated.zeroPile.receiver / t.eventCount * 100 : 0, j = g - v;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${h ? " is-compact" : ""}`, children: [
    !h && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: f("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: t.eventCount.toLocaleString(),
      sampled: t.totalEvents > t.eventCount ? f(" sampled from {total}", { total: t.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        gt,
        {
          title: f("Original"),
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
    !h && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-diagnostic-note", children: o === "cytof" ? /* @__PURE__ */ e.jsx(e.Fragment, { children: f("Receiver events at exact zero: {original}% → {compensated}% ({delta} percentage points). A rise can be consistent with NNLS over-subtraction, while a residual source-associated rise can be consistent with under-compensation. Neither is a verdict without a suitable negative/control population.", {
      original: v.toFixed(1),
      compensated: g.toFixed(1),
      delta: `${j >= 0 ? "+" : ""}${j.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: f("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: p
    }) }) }),
    !h && (t.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": f("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: f("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: f("{value} MAD", { value: ie(t.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: f("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: ie(t.evidence.residualSlope ?? 0, 4) })
      ] }),
      t.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: f("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: f("{value} MAD", { value: ie(t.evidence.upperTailExcessMad, 3) }) })
      ] }),
      t.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: f("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: f("{value} MAD", { value: ie(t.evidence.upperTailSlopeDeltaMad, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: f("Evidence groups") }),
        /* @__PURE__ */ e.jsx("dd", { children: f("{high} source-high · {low} source-low", {
          high: t.evidence.sourceHighEvents.toLocaleString(),
          low: t.evidence.sourceLowEvents.toLocaleString()
        }) })
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-evidence-insufficient", children: f("Residual screening needs distinct source-low/source-high groups and enough receiver-negative events; this pair remains available for visual review.") }))
  ] });
}
function Yr({
  matrixView: t,
  sourceChannels: i,
  receiverChannels: r,
  selectedSourceIndex: o,
  selectedReceiverIndex: l,
  stagedCoefficients: h,
  maximumAbsoluteOffDiagonal: p,
  onSelect: f
}) {
  const { t: v } = Be(), g = 6, j = 74, F = 44, T = 10, S = r.length * g, A = i.length * g, I = j + S + j, P = F + A + T, M = N.useMemo(() => {
    const $ = [];
    for (let C = 0; C < t.matrix.length; C++)
      for (let E = 0; E < t.matrix[C].length; E++) {
        const R = t.sourceAxisKeys[C], K = t.receiverAxisKeys[E], D = `${R}${ti}${K}`, V = h[D] ?? t.matrix[C][E], q = R === K;
        if (!q && (!Number.isFinite(V) || V === 0)) continue;
        const H = p > 0 && Number.isFinite(V) ? Math.min(1, Math.abs(V) / p) : 0, U = H > 0 ? 0.12 + 0.82 * Math.sqrt(H) : 0;
        $.push({
          sourceIndex: C,
          receiverIndex: E,
          pairKey: D,
          value: V,
          diagonal: q,
          fill: q ? "#cfd4db" : Number.isFinite(V) ? V < 0 ? `rgba(47,128,237,${U})` : `rgba(211,47,47,${U})` : "#ae3e3e"
        });
      }
    return $;
  }, [t, p, h]), k = ($) => {
    const C = $.currentTarget.getBoundingClientRect();
    if (!(C.width > 0) || !(C.height > 0)) return;
    const E = ($.clientX - C.left) * I / C.width, R = ($.clientY - C.top) * P / C.height, K = Math.floor((E - j) / g), D = Math.floor((R - F) / g);
    D < 0 || D >= i.length || K < 0 || K >= r.length || t.sourceAxisKeys[D] === t.receiverAxisKeys[K] || f(`${t.sourceAxisKeys[D]}${ti}${t.receiverAxisKeys[K]}`);
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-mini-matrix", "aria-labelledby": "comp-mini-matrix-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-mini-matrix-head", children: [
      /* @__PURE__ */ e.jsx("strong", { id: "comp-mini-matrix-heading", children: v("Matrix map") }),
      /* @__PURE__ */ e.jsx("span", { children: v("Source ↓ · receiver → · click a cell") })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        width: I,
        height: P,
        viewBox: `0 0 ${I} ${P}`,
        role: "img",
        "aria-label": v("Mini compensation matrix with {sources} source rows and {receivers} receiver columns", {
          sources: i.length,
          receivers: r.length
        }),
        onPointerDown: k,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: j, y: F, width: S, height: A, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          r.map(($, C) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: j + (C + 0.55) * g,
              y: F - 3,
              transform: `rotate(-58 ${j + (C + 0.55) * g} ${F - 3})`,
              textAnchor: "start",
              className: C === l ? "is-selected" : void 0,
              children: $.pnn
            },
            $.key
          )),
          i.map(($, C) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: j - 3,
              y: F + (C + 0.72) * g,
              textAnchor: "end",
              className: C === o ? "is-selected" : void 0,
              children: $.pnn
            },
            $.key
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: j,
              y: F + o * g,
              width: S,
              height: g,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: j + l * g,
              y: F,
              width: g,
              height: A,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          M.map(($) => /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: j + $.receiverIndex * g,
              y: F + $.sourceIndex * g,
              width: g,
              height: g,
              fill: $.fill,
              pointerEvents: "none",
              children: /* @__PURE__ */ e.jsx("title", { children: $.diagonal ? v("{channel} · self", { channel: i[$.sourceIndex].combined }) : `${i[$.sourceIndex].combined} → ${r[$.receiverIndex].combined} · ${tn($.value)}` })
            },
            $.pairKey
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: j + l * g,
              y: F + o * g,
              width: g,
              height: g,
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
function Xr({
  dataset: t,
  pair: i,
  plotSize: r,
  densitySmoothing: o,
  flagged: l,
  selected: h,
  onSelect: p,
  onFlag: f
}) {
  const { t: v } = Be(), g = N.useRef(null), [j, F] = N.useState(() => typeof IntersectionObserver > "u");
  N.useEffect(() => {
    const A = g.current;
    if (!A || typeof IntersectionObserver > "u") {
      F(!0);
      return;
    }
    const I = new IntersectionObserver(
      (P) => F(P.some((M) => M.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return I.observe(A), () => I.disconnect();
  }, []);
  const T = N.useMemo(
    () => j ? fi(t, i.source.key, i.receiver.key) : null,
    [t, i.receiver.key, i.source.key, j]
  ), S = T != null && T.ready ? T.preview : null;
  return /* @__PURE__ */ e.jsxs(
    "article",
    {
      ref: g,
      className: `gl-comp-global-tile${h ? " is-selected" : ""}${l ? " is-flagged" : ""}`,
      "data-pair-key": i.pairKey,
      "data-event-signature": S == null ? void 0 : S.eventSignature,
      "data-x-range": S ? `${S.xRange[0]},${S.xRange[1]}` : void 0,
      "data-y-range": S ? `${S.yRange[0]},${S.yRange[1]}` : void 0,
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
              onChange: (A) => f(A.currentTarget.checked)
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
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: r, height: r }, children: S ? /* @__PURE__ */ e.jsx(
              Hr,
              {
                title: "",
                preview: S,
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
function Jr({
  stateKey: t,
  header: i,
  children: r
}) {
  const { t: o } = Be(), [l, h] = fe(
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
const Qr = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', ii = 58 * Math.PI / 180, ea = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, na = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], _e = "", ri = 2500, ai = 400, ta = 2500, oi = 15e3, li = [2500, 5e3, 15e3, 5e4], sa = 24, ci = 4, di = 624, ia = Object.freeze({});
function ui(t) {
  if (!Number.isFinite(t)) return String(t);
  const i = t * 100;
  if (i === 0) return "0.0";
  const r = Math.abs(i), o = r >= 1 ? 1 : r >= 0.1 ? 2 : 3;
  return i.toFixed(o);
}
function qt(t) {
  return t.replace(/(?: · (?:edited|revised))+$/u, "");
}
function ft(t, i) {
  const r = t.index(i), o = r === void 0 ? void 0 : t.channels[r], l = (o == null ? void 0 : o.pnn) ?? i, h = t.labelForKey(i), p = ((o == null ? void 0 : o.label) ?? "").trim() || ((o == null ? void 0 : o.marker) ?? "").trim(), f = p && p !== l ? `${p} (${l})` : l;
  return { key: i, pnn: l, label: h, combined: f };
}
function Gt(t, i) {
  const r = t.channels.find((o) => o.pnn === i);
  return ft(t, (r == null ? void 0 : r.key) ?? i);
}
function ra(t, i) {
  return t === "cytof-spillover" && i === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function aa(t) {
  return t.replaceAll("-", " ");
}
function Jt(t) {
  if (t.length === 0) return 0;
  t.sort((r, o) => r - o);
  const i = Math.floor(t.length / 2);
  return t.length % 2 === 0 ? (t[i - 1] + t[i]) / 2 : t[i];
}
function oa(t) {
  return Object.fromEntries(t.scientific.solverSettings.map(({ key: i, value: r }) => [i, r]));
}
function la(t, i) {
  const r = Object.freeze({ ...t.scientific.matrix, matrix: i }), o = oa(t);
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
function hi(t, i, r, o) {
  const l = t.scientific.matrix.sourceChannels.indexOf(i), h = t.scientific.matrix.receiverChannels.indexOf(r);
  if (l < 0 || h < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(t.scientific.matrix.matrix.map(
    (p, f) => Object.freeze(p.map((v, g) => f === l && g === h ? o : v))
  ));
}
function ca(t, i, r) {
  var p;
  if (!t) return null;
  const o = t.scientific.matrix.sourceChannels.indexOf(i), l = t.scientific.matrix.receiverChannels.indexOf(r);
  if (o < 0 || l < 0) return null;
  const h = (p = t.scientific.matrix.matrix[o]) == null ? void 0 : p[l];
  return Number.isFinite(h) ? h : null;
}
function pi(t, i, r) {
  const o = Math.max(Math.abs(t), Math.abs(i), 1e-3);
  return Object.freeze(r === "cytof" ? { lower: 0, upper: Math.max(t + o, o * 2) } : { lower: t - o, upper: t + o });
}
function da(t, i) {
  const r = (i - t) / 3;
  return Object.freeze([t, t + r, t + 2 * r, i]);
}
function ua(t, i) {
  return t.length === i.length && t.every((r, o) => {
    var l;
    return r.length === ((l = i[o]) == null ? void 0 : l.length) && r.every((h, p) => h === i[o][p]);
  });
}
function ha(t, i) {
  if (t.compensatedLayerStatus().state !== "ready" || i.length === 0 || t.fcs.nEvents === 0) return null;
  const o = i.flatMap((F) => {
    const T = t.channels.findIndex((S) => S.pnn === F);
    return T < 0 ? [] : [T];
  });
  if (o.length === 0) return null;
  const l = Math.min(2048, t.fcs.nEvents), h = [];
  let p = 0, f = 0, v = 0, g = "", j = -1;
  for (const F of o) {
    const T = t.originalColumnData(F), S = t.compensatedColumnData(F), A = [];
    for (let P = 0; P < l; P++) {
      const M = l === 1 ? 0 : Math.floor(P * (t.fcs.nEvents - 1) / (l - 1)), k = T[M], $ = S[M], C = Math.abs($ - k);
      A.push(C), h.push(C), C > Math.max(1e-6, Math.abs(k) * 1e-6) && p++, k < 0 && $ === 0 && v++, f = Math.max(f, C);
    }
    const I = Jt(A);
    I > j && (j = I, g = ft(t, t.channels[F].key).combined);
  }
  return {
    previewEvents: l,
    comparedValues: h.length,
    changedValues: p,
    medianAbsoluteDelta: Jt(h),
    maxAbsoluteDelta: f,
    zeroedNegativeValues: v,
    mostChangedChannel: g,
    mostChangedChannelMedianDelta: Math.max(0, j)
  };
}
function pa(t, i) {
  return t.origin.type === "uploaded" ? t.origin.fileName : t.origin.type === "embedded-fcs" ? `${t.origin.fileName} · ${i("embedded FCS")}` : t.origin.type === "manual" ? i("set by hand, from an empty matrix") : `${t.origin.presetId} · ${i("bundled preset")} ${t.origin.presetVersion}`;
}
function ma(t) {
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
function ga({
  sample: t,
  sampleName: i = "sample.fcs",
  hostedCompensationMatrix: r = null,
  compensationOn: o,
  onApplyProfile: l,
  otherEmbeddedLayerFiles: h = [],
  onRemoveProfile: p,
  existingHostAssays: f = [],
  onAdoptExistingAssay: v,
  onCancelApply: g,
  hasExistingGates: j = !1,
  applyStatus: F = null,
  installedProfile: T = null,
  applyTargetCount: S = 1,
  applyTargetEventCount: A,
  applyWorkerCount: I,
  applyWorkerLimit: P,
  onApplyWorkerCountChange: M,
  installedBaselineProfile: k = null,
  reviewPopulations: $ = [],
  reviewPopulationMasks: C = ia,
  onPreviewCompensationCandidate: E,
  onSolveCompensationSweep: R,
  onCancelCompensationSweep: K,
  onSuspendBackgroundWork: D,
  visible: V = !0,
  stateKey: q,
  densityColorPower: H = Qt,
  channelLabelMode: U = "marker",
  onDensityColorPowerChange: G = () => {
  }
}) {
  var Ks, Ls;
  const { t: s } = Be(), W = t.compensatedLayerStatus(), Ie = W.state === "missing" ? null : W.metadata, z = (Ie == null ? void 0 : Ie.runtimeIdentity) === "profile" ? Ie : null, w = (T == null ? void 0 : T.profileId) === (z == null ? void 0 : z.profileId) ? T : null, ne = !z && t.instrument === "flow" ? t.spillover : null, me = (r == null ? void 0 : r.kind) === "flow-spillover" ? r : null, xt = N.useMemo(
    () => ma(r),
    [r]
  ), [Ve, Ne] = fe(
    `compensation.${q}.selectedPair`,
    null
  ), [vt, Pe] = N.useState(null), [Bn, rs] = fe(
    `compensation.${q}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [xn, as] = fe(
    "compensation.inspectorWidth",
    di
  ), [Ee, Vn] = fe(
    `compensation.${q}.workspaceView`,
    "matrix"
  ), [Re, qn] = fe(
    `compensation.${q}.globalPairFilter`,
    "relevant"
  ), [Ke, bi] = fe(
    `compensation.${q}.globalLayout`,
    "compact"
  ), [yi, ji] = fe(
    "compensation.globalPlotSize.v5",
    160
  ), [wi, Ni] = fe(
    "compensation.densitySmoothing.v3",
    6
  ), [Ci, Si] = fe(
    "compensation.pointAlpha.v1",
    0.85
  ), [Mi, ki] = fe(
    "compensation.pointSize.v1",
    1
  ), [bt, Ei] = fe(
    "compensation.pairPreviewEventLimit.v1",
    oi
  ), [Tn, os] = N.useState(""), [$n, yt] = N.useState(!1), [jt, ls] = N.useState(null), [vn, wt] = fe(
    `compensation.${q}.reviewPopulation`,
    "all"
  ), [Gn, Ai] = fe(
    `compensation.${q}.flaggedPairs`,
    []
  ), [qe, Ti] = fe(
    `compensation.${q}.evidenceMode`,
    "biological"
  ), [$i, Fi] = fe(
    `compensation.${q}.sweepBounds`,
    {}
  ), [Nt, Ct] = fe(
    `compensation.${q}.sweepWorkers`,
    2
  ), [Ae, cs] = N.useState(""), [Ce, St] = N.useState(""), [Ii, Mt] = N.useState(0), [X, Wn] = N.useState({}), [Pi, sn] = N.useState({}), [Ge, rn] = N.useState({ state: "idle" }), [Ri, Ye] = N.useState({}), [Ki, an] = N.useState({}), [ye, bn] = N.useState(null), [Li, Fn] = N.useState(null), [he, yn] = N.useState(null), [ds, ve] = N.useState(null), [Zn, kt] = N.useState(""), [Oi, us] = N.useState(!1), [Di, hs] = N.useState(!1), Te = N.useRef(0), jn = N.useRef(0), [ps, Q] = N.useState(null), [ms, ge] = N.useState(!1), [J, Hn] = N.useState(
    () => xt.draft
  ), [In, on] = N.useState(
    () => {
      var c;
      const n = ((c = xt.draft) == null ? void 0 : c.matrix.receiverChannels) ?? [], a = /* @__PURE__ */ new Map();
      for (const d of t.channels) {
        const m = d.pnn.trim().normalize("NFC");
        a.set(m, (a.get(m) ?? 0) + 1);
      }
      return new Set(n.filter((d) => a.get(d) === 1));
    }
  ), [gs, Xe] = N.useState(
    () => xt.error
  ), [Se, We] = N.useState(!1), [Yn, fs] = N.useState(!1), [Xn, xs] = N.useState(
    () => {
      var n;
      return ((n = f[0]) == null ? void 0 : n.id) ?? "";
    }
  ), [Et, Jn] = N.useState(!1), [Qn, be] = N.useState(null), [zi, Le] = N.useState(!1), [_i, Ze] = N.useState(null), $e = N.useRef(!1), vs = N.useRef(null), bs = N.useRef(null), wn = N.useRef(null), B = zi || F !== null, Je = Math.max(0, Math.floor(S)), Ui = Math.max(
    0,
    Math.floor(A ?? t.fcs.nEvents)
  ), Qe = f.find(
    ({ id: n }) => n === Xn
  ) ?? f[0] ?? null;
  N.useEffect(() => {
    var n;
    Xn && f.some(({ id: a }) => a === Xn) || (xs(((n = f[0]) == null ? void 0 : n.id) ?? ""), Jn(!1));
  }, [f, Xn]);
  const ae = F ?? (Qn ? {
    phase: "applying",
    profileName: _i ?? (J == null ? void 0 : J.fileName) ?? "Compensation",
    fraction: Qn.fraction,
    processedEvents: Qn.processedEvents,
    totalEvents: Qn.totalEvents
  } : null);
  N.useEffect(() => {
    V || (jn.current++, Te.current++, rn({ state: "idle" }), yn(null), bn(null), D == null || D());
  }, [D, V]);
  const At = N.useMemo(
    () => t.channels.map(({ pnn: n, columnIndex: a }) => ({ pnn: n, columnIndex: a })),
    [t]
  ), Me = N.useMemo(() => {
    if (!ne) return null;
    const n = ne.channels.map((d) => {
      const m = t.index(d);
      return m === void 0 ? null : t.channels[m].pnn;
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
      matrix: ne.matrix
    }, "flow-spillover"), c = ["$SPILLOVER", "$SPILL", "SPILL"].find((d) => typeof t.fcs.keywords[d] == "string");
    return {
      validation: a,
      error: a.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${a.errors.map(({ message: d }) => d).join(" ")}`,
      keyword: c
    };
  }, [t, ne]), ee = vn === "all" ? null : $.find(({ id: n }) => n === vn) ?? null, pe = ee ? C[ee.id] ?? null : null, de = pe ? (ee == null ? void 0 : ee.eventCount) ?? 0 : t.fcs.nEvents, et = bt === "all" ? "all" : li.includes(Number(bt)) ? Number(bt) : oi, Pn = N.useMemo(
    () => pn(
      t.fcs.nEvents,
      et === "all" ? Math.max(1, t.fcs.nEvents) : et,
      pe
    ),
    [et, de, pe, t]
  ), Rn = N.useMemo(
    () => pn(t.fcs.nEvents, 2048, pe),
    [pe, t]
  ), Tt = N.useMemo(
    () => pn(
      t.fcs.nEvents,
      ta,
      pe
    ),
    [pe, t]
  );
  N.useEffect(() => {
    vn !== "all" && !$.some(({ id: n }) => n === vn) && wt("all");
  }, [vn, $, wt]), N.useEffect(() => {
    Te.current++, K == null || K(), Ye({}), an({}), bn(null), yn(null), ve(null);
  }, [vn, pe, K]);
  const ue = N.useMemo(() => J ? xr({
    kind: "cytof-spillover",
    matrix: J.matrix,
    sampleChannels: At,
    includedChannels: Array.from(In)
  }) : null, [J, In, At, U]), u = N.useMemo(() => {
    var a;
    if (ne) {
      const c = t.spilloverOrigin, d = c.kind === "external" ? c : null;
      return {
        sourceAxisKeys: ne.channels,
        receiverAxisKeys: ne.channels,
        sourceChannels: ne.channels.map((m) => ft(t, m)),
        receiverChannels: ne.channels.map((m) => ft(t, m)),
        matrix: ne.matrix,
        kind: "flow",
        title: me ? "SCE spillover matrix" : d ? `Compensation matrix from ${d.label}` : "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: d ? "This FCS carries no spillover matrix of its own; these coefficients came from the imported FlowJo workspace and are applied unchanged." + (d.droppedChannels.length ? ` ${d.droppedChannels.length} of its parameter(s) are not in this file (${d.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "") : "Applying the embedded matrix leaves its coefficients unchanged." + (c.kind === "fcs" && ((a = c.droppedChannels) != null && a.length) ? ` ${c.droppedChannels.length} of its parameter(s) are not among this file's channels (${c.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "")
      };
    }
    if (!w || !z) return null;
    const n = w.scientific.kind === "cytof-spillover" ? Mr(w.scientific.matrix) : w.scientific.matrix;
    return n.matrix.length !== n.sourceChannels.length || n.matrix.some((c) => !c || c.length !== n.receiverChannels.length) ? null : {
      sourceAxisKeys: n.sourceChannels,
      receiverAxisKeys: n.receiverChannels,
      sourceChannels: n.sourceChannels.map((c) => Gt(t, c)),
      receiverChannels: n.receiverChannels.map((c) => Gt(t, c)),
      matrix: n.matrix,
      kind: w.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: w.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: w.scientific.kind === "cytof-spillover" ? s("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: n.sourceChannels.length,
        receivers: n.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: w.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [me, z, w, t, ne, s, U]), re = (u == null ? void 0 : u.sourceChannels) ?? [], oe = (u == null ? void 0 : u.receiverChannels) ?? [];
  N.useEffect(() => {
    Ct((n) => Math.max(1, Math.min(ci, Math.round(n) || 1)));
  }, [Ct]);
  const nt = vt ?? Ve, b = N.useMemo(() => {
    if (!u || !nt) return null;
    const [n, a] = nt.split(_e), c = u.sourceAxisKeys.indexOf(n), d = u.receiverAxisKeys.indexOf(a);
    return c < 0 || d < 0 || u.sourceAxisKeys[c] === u.receiverAxisKeys[d] ? null : {
      pairKey: nt,
      sourceIndex: c,
      receiverIndex: d,
      source: re[c],
      receiver: oe[d],
      value: u.matrix[c][d],
      interaction: u.kind === "cytof" ? kn(
        u.sourceAxisKeys[c],
        u.receiverAxisKeys[d]
      ) : null
    };
  }, [nt, u, oe, re]);
  N.useEffect(() => {
    if (!b) {
      kt("");
      return;
    }
    const n = X[b.pairKey];
    kt(ie((n ?? b.value) * 100, 6));
  }, [b == null ? void 0 : b.pairKey, b == null ? void 0 : b.value, X]);
  const je = N.useMemo(() => b ? Ut(
    t,
    b.source.key,
    b.receiver.key,
    {
      eventMask: pe,
      fixedEventIndices: Pn,
      eligibleEventCount: de
    }
  ) : null, [o, W.state, Pn, de, pe, t, b]), ke = N.useMemo(() => {
    if (!u || W.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const n = [];
    for (let m = 0; m < u.matrix.length; m++)
      for (let x = 0; x < u.matrix[m].length; x++) {
        const y = u.sourceAxisKeys[m], O = u.receiverAxisKeys[x];
        if (y === O) continue;
        const _ = u.matrix[m][x];
        if (!Number.isFinite(_)) continue;
        const L = u.kind === "cytof" ? kn(y, O) : null, Z = L !== null && L !== "self" && L !== "other";
        _ === 0 && !Z && qe === "biological" || n.push({
          sourceIndex: m,
          receiverIndex: x,
          pairKey: `${y}${_e}${O}`,
          source: re[m],
          receiver: oe[x],
          coefficient: _,
          interaction: L,
          physicalPrior: Z ? 1 : 0
        });
      }
    n.sort((m, x) => x.physicalPrior - m.physicalPrior || Math.abs(x.coefficient) - Math.abs(m.coefficient));
    const a = n.slice(0, 240), c = a.flatMap((m) => {
      const x = Ut(
        t,
        m.source.key,
        m.receiver.key,
        {
          eventMask: pe,
          fixedEventIndices: Rn,
          eligibleEventCount: de
        }
      );
      return x.ready ? [{ ...m, evidence: x.preview.evidence }] : [];
    }), d = Rr(
      c.map(({ coefficient: m, physicalPrior: x, evidence: y }) => ({ coefficient: m, physicalPrior: x, evidence: y })),
      u.kind,
      qe
    ).map(({ index: m, relativePriority: x }) => ({ ...c[m], relativePriority: x }));
    return {
      candidateCount: n.length,
      screenedCount: a.length,
      evaluableCount: c.length,
      items: d.slice(0, 8)
    };
  }, [Ii, qe, W.state, u, oe, Rn, de, pe, t, re]), le = N.useMemo(() => new Set(
    w ? w.scientific.kind === "flow-spillover" ? w.scientific.matrix.receiverChannels : w.scientific.includedChannels : []
  ), [w]), ce = N.useMemo(() => u ? Dr(
    t,
    Array.from(/* @__PURE__ */ new Set([
      ...u.sourceAxisKeys,
      ...u.receiverAxisKeys
    ])),
    {
      eventMask: pe,
      fixedEventIndices: Tt,
      eligibleEventCount: de
    }
  ) : null, [
    o,
    Tt,
    W.state,
    u,
    de,
    pe,
    t
  ]);
  N.useEffect(() => {
    if (!u || le.size === 0) return;
    const n = le.has(Ae) ? Ae : u.sourceAxisKeys.find((c) => le.has(c)) ?? "", a = le.has(Ce) && Ce !== n ? Ce : u.receiverAxisKeys.find((c) => c !== n && le.has(c)) ?? "";
    n !== Ae && cs(n), a !== Ce && St(a);
  }, [le, Ce, Ae, u]);
  const Nn = N.useMemo(() => new Set(Gn), [Gn]), $t = N.useMemo(() => {
    var c;
    if (!u) return [];
    const n = [], a = le.size > 0;
    for (let d = 0; d < u.sourceAxisKeys.length; d++) {
      const m = u.sourceAxisKeys[d];
      if (!(a && !le.has(m)))
        for (let x = 0; x < u.receiverAxisKeys.length; x++) {
          const y = u.receiverAxisKeys[x];
          if (m === y || a && !le.has(y)) continue;
          const O = (c = u.matrix[d]) == null ? void 0 : c[x];
          if (!Number.isFinite(O)) continue;
          const _ = re[d], L = oe[x];
          if (!_ || !L || ce != null && ce.ready && (!ce.dataset.channels.has(_.key) || !ce.dataset.channels.has(L.key))) continue;
          const Z = u.kind === "cytof" ? kn(m, y) : null, se = Z !== null && Z !== "self" && Z !== "other";
          n.push({
            sourceIndex: d,
            receiverIndex: x,
            pairKey: `${m}${_e}${y}`,
            source: _,
            receiver: L,
            coefficient: O,
            interaction: Z,
            physicalPrior: se ? 1 : 0
          });
        }
    }
    return n;
  }, [ce, le, u, oe, re]), Oe = N.useMemo(() => {
    const n = Tn.trim().toLocaleLowerCase();
    return $t.filter((a) => {
      const c = Math.abs(a.coefficient) > 1e-12, d = a.physicalPrior > 0;
      return Re === "all" || Re === "relevant" && (c || d) || Re === "nonzero" && c || Re === "physical" && d || Re === "flagged" && Nn.has(a.pairKey) ? n ? `${a.source.combined} ${a.receiver.combined}`.toLocaleLowerCase().includes(n) : !0 : !1;
    });
  }, [Nn, $t, Re, Tn]);
  N.useEffect(() => {
    var a;
    if (!jt || Ee !== "global") return;
    const n = [...((a = wn.current) == null ? void 0 : a.querySelectorAll(".gl-comp-global-tile")) ?? []].find((c) => c.dataset.pairKey === jt);
    n && (n.scrollIntoView({ block: "center", inline: "center" }), ls(null));
  }, [$n, Ke, jt, Oe, Ee]);
  const Ft = N.useMemo(() => {
    if (Ke === "compact") return [];
    const n = /* @__PURE__ */ new Map();
    for (const a of Oe) {
      const c = Ke === "source" ? a.source : a.receiver, d = n.get(c.key);
      d ? d.pairs.push(a) : n.set(c.key, { channel: c, pairs: [a] });
    }
    return [...n.values()];
  }, [Ke, Oe]), ys = N.useMemo(
    () => Ke === "compact" ? Oe : Ft.flatMap((n) => n.pairs),
    [Ft, Ke, Oe]
  ), js = `${s(ea[Re])}${Tn.trim() ? s(" · search “{query}”", { query: Tn.trim() }) : ""}`, It = Math.max(120, Math.min(220, Math.round(yi) || 120)), en = Math.max(1, Math.min(10, Math.round(wi) || 6)), tt = Math.max(0.1, Math.min(1, Number(Ci) || 0.85)), st = Math.max(0.3, Math.min(3, Number(Mi) || 1)), te = N.useMemo(() => !w || !u || W.state !== "ready" ? [] : Gn.flatMap((n) => {
    const [a, c] = n.split(_e), d = u.sourceAxisKeys.indexOf(a), m = u.receiverAxisKeys.indexOf(c);
    if (d < 0 || m < 0 || a === c || !le.has(a) || !le.has(c)) return [];
    const x = Ut(
      t,
      re[d].key,
      oe[m].key,
      {
        eventMask: pe,
        fixedEventIndices: Rn,
        eligibleEventCount: de
      }
    );
    if (!x.ready) return [];
    const y = ke.items.find((O) => O.pairKey === n);
    return [{
      sourceIndex: d,
      receiverIndex: m,
      pairKey: n,
      source: re[d],
      receiver: oe[m],
      coefficient: u.matrix[d][m],
      interaction: u.kind === "cytof" ? kn(a, c) : null,
      physicalPrior: u.kind === "cytof" && kn(a, c) !== "other" ? 1 : 0,
      evidence: x.preview.evidence,
      relativePriority: (y == null ? void 0 : y.relativePriority) ?? 0
    }];
  }), [Gn, le, W.state, u, w, oe, ke.items, Rn, de, pe, t, re]), De = te, ws = N.useMemo(() => {
    if (!w) return 0.01;
    const n = [];
    for (let a = 0; a < w.scientific.matrix.matrix.length; a++) {
      const c = w.scientific.matrix.sourceChannels[a];
      for (let d = 0; d < w.scientific.matrix.matrix[a].length; d++) {
        if (c === w.scientific.matrix.receiverChannels[d]) continue;
        const m = Math.abs(w.scientific.matrix.matrix[a][d]);
        Number.isFinite(m) && m > 1e-12 && n.push(m);
      }
    }
    return n.length > 0 ? Jt(n) : 0.01;
  }, [w]), Pt = (n, a) => {
    const c = $i[n];
    if (c) return c;
    const d = pi(a, ws, (u == null ? void 0 : u.kind) ?? "flow");
    return {
      lowerPercent: ie(d.lower * 100, 5),
      upperPercent: ie(d.upper * 100, 5)
    };
  }, Kn = (n, a) => {
    const c = Pt(n, a), d = Number(c.lowerPercent) / 100, m = Number(c.upperPercent) / 100;
    return !Number.isFinite(d) || !Number.isFinite(m) ? { lower: d, upper: m, error: "Enter finite lower and upper sweep bounds." } : (u == null ? void 0 : u.kind) === "cytof" && d < 0 ? { lower: d, upper: m, error: "CyTOF NNLS sweep bounds cannot be negative." } : m > d ? { lower: d, upper: m, error: null } : { lower: d, upper: m, error: "The upper sweep bound must be greater than the lower bound." };
  }, it = (n, a, c, d) => {
    Fi((m) => ({
      ...m,
      [n]: {
        ...m[n] ?? (() => {
          const x = pi(a, ws, (u == null ? void 0 : u.kind) ?? "flow");
          return {
            lowerPercent: ie(x.lower * 100, 5),
            upperPercent: ie(x.upper * 100, 5)
          };
        })(),
        [c]: d
      }
    })), Ye((m) => {
      if (!(n in m)) return m;
      const x = { ...m };
      return delete x[n], x;
    }), an((m) => {
      if (!(n in m)) return m;
      const x = { ...m };
      return delete x[n], x;
    });
  }, Ln = (n, a) => {
    Ai((c) => a ? c.includes(n) ? c : [...c, n] : c.filter((d) => d !== n)), a ? (Ne(n), Fn(n)) : (Ye((c) => {
      if (!(n in c)) return c;
      const d = { ...c };
      return delete d[n], d;
    }), an((c) => {
      if (!(n in c)) return c;
      const d = { ...c };
      return delete d[n], d;
    }));
  }, Bi = () => {
    if (!u || !Ae || !Ce || Ae === Ce) return;
    if (!le.has(Ae) || !le.has(Ce)) {
      ve("Both channels must be included in the installed compensation solve.");
      return;
    }
    const n = `${Ae}${_e}${Ce}`;
    Ln(n, !0), ve(null);
  }, Rt = De.reduce((n, a) => n + (Kn(a.pairKey, a.coefficient).error ? 1 : 0), 0), Cn = N.useMemo(() => {
    if (!w) return null;
    const n = w.scientific.matrix.matrix.map((a) => Array.from(a));
    for (const [a, c] of Object.entries(X)) {
      const [d, m] = a.split(_e), x = w.scientific.matrix.sourceChannels.indexOf(d), y = w.scientific.matrix.receiverChannels.indexOf(m);
      x >= 0 && y >= 0 && (n[x][y] = c);
    }
    return Object.freeze(n.map((a) => Object.freeze(a)));
  }, [w, X]);
  N.useEffect(() => {
    const n = Object.keys(X).length;
    if (!V || n === 0 || !w || w.scientific.kind !== "flow-spillover" || W.state !== "ready" || !Cn || !b || !E) {
      jn.current++, rn({ state: "idle" });
      return;
    }
    const a = Pn;
    if (a.length === 0) {
      rn({
        state: "error",
        pairKey: b.pairKey,
        message: s("The selected review population contains no events.")
      });
      return;
    }
    const c = ++jn.current, d = b.pairKey;
    rn((x) => ({
      state: "updating",
      pairKey: d,
      ...(x.state === "ready" || x.state === "updating") && x.pairKey === d && x.preview ? { preview: x.preview } : {}
    }));
    const m = window.setTimeout(() => {
      E(
        w,
        a,
        Cn
      ).then((x) => {
        if (jn.current !== c) return;
        const y = x.sourceChannels.indexOf(b.source.pnn), O = x.sourceChannels.indexOf(b.receiver.pnn);
        if (y < 0 || O < 0)
          throw new Error(s("The preview result did not contain the selected flow channels."));
        const _ = Bt(
          t,
          b.source.pnn,
          b.receiver.pnn,
          a,
          x.candidateColumns[y],
          x.candidateColumns[O],
          { totalEvents: de }
        );
        if (!_.ready) throw new Error(_.reason);
        rn({
          state: "ready",
          pairKey: d,
          preview: _.preview
        });
      }).catch((x) => {
        if (jn.current !== c) return;
        const y = x instanceof Error ? x.message : String(x);
        /cancel|supersed|stale/i.test(y) || rn({ state: "error", pairKey: d, message: y });
      });
    }, 90);
    return () => window.clearTimeout(m);
  }, [
    W.state,
    E,
    w,
    Pn,
    de,
    t,
    t.dataRevision,
    t.displayTransformContextKey,
    t.layerRevision,
    b,
    X,
    s,
    V,
    Cn
  ]);
  const Vi = N.useMemo(() => !u || Object.keys(X).length === 0 ? null : {
    sourceChannels: u.sourceAxisKeys,
    receiverChannels: u.receiverAxisKeys,
    matrix: u.matrix.map(
      (n, a) => n.map((c, d) => {
        const m = `${u.sourceAxisKeys[a]}${_e}${u.receiverAxisKeys[d]}`;
        return X[m] ?? c;
      })
    )
  }, [u, X]), Ns = N.useMemo(() => {
    if (!u) return [];
    const n = [];
    for (let a = 0; a < u.matrix.length; a++)
      for (let c = 0; c < u.matrix[a].length; c++) {
        const d = u.matrix[a][c];
        u.sourceAxisKeys[a] === u.receiverAxisKeys[c] || !Number.isFinite(d) || d <= 1 || n.push(`${re[a].combined} → ${oe[c].combined}`);
      }
    return n;
  }, [u, oe, re]), Kt = N.useMemo(() => {
    if (!u) return [];
    const n = [];
    for (let a = 0; a < u.matrix.length; a++)
      for (let c = 0; c < u.matrix[a].length; c++) {
        const d = u.matrix[a][c], m = u.sourceAxisKeys[a] === u.receiverAxisKeys[c], x = `${re[a].combined} → ${oe[c].combined}`;
        Number.isFinite(d) ? m && Math.abs(d - 1) > 1e-8 ? n.push(`${re[a].combined}: diagonal is ${tn(d)}, not 100%`) : !m && d < 0 ? n.push(`${x}: negative coefficient (${tn(d)})`) : !m && d > 1 && n.push(`${x}: coefficient above 100%`) : n.push(`${x}: non-finite coefficient (${String(d)})`);
      }
    return n;
  }, [u, oe, re]), Cs = N.useMemo(
    () => (u == null ? void 0 : u.matrix.some((n) => n.some((a) => !Number.isFinite(a)))) ?? !1,
    [u]
  ), Fe = N.useMemo(
    () => z && W.state === "ready" ? ha(t, z.includedPnns) : null,
    [W.state, z, t]
  ), rt = N.useMemo(() => {
    const n = [...Kt];
    return W.state === "stale" && n.push(...W.reasons.map((a) => `Profile unavailable: ${aa(a)}`)), n;
  }, [W, Kt]), Ss = z ? (w == null ? void 0 : w.name) ?? "Installed compensation profile" : ne ? me ? "SCE spillover matrix" : "Embedded FCS matrix" : "No compatible matrix", qi = z ? ra(z.kind, z.method) : ne ? "Flow linear inverse" : "Not configured", at = s(qi), Lt = (z == null ? void 0 : z.includedPnns.length) ?? (ne == null ? void 0 : ne.channels.length) ?? 0, ot = (w == null ? void 0 : w.name) ?? (z == null ? void 0 : z.profileId) ?? Ss, Ms = qt(ot), Gi = Ms !== ot || (w == null ? void 0 : w.recordType) === "revision" ? `${Ms} · ${s("revised")}` : ot, Wi = ne !== null && !Cs || z !== null && W.state === "ready", ks = N.useMemo(() => {
    if (!u) return 0;
    let n = 0;
    for (let a = 0; a < u.matrix.length; a++)
      for (let c = 0; c < u.matrix[a].length; c++) {
        if (u.sourceAxisKeys[a] === u.receiverAxisKeys[c]) continue;
        const d = u.matrix[a][c];
        Number.isFinite(d) && (n = Math.max(n, Math.abs(d)));
      }
    return n;
  }, [u]), Sn = !!((w == null ? void 0 : w.scientific.kind) === "flow-spillover" && W.state === "ready" && u && Math.max(u.sourceAxisKeys.length, u.receiverAxisKeys.length) <= sa), ln = u ? Sn ? Math.max(42, Math.min(54, Math.floor(960 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : Math.max(13, Math.min(38, Math.floor(760 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : 13, On = N.useMemo(() => {
    const n = Sn ? 9.5 : 8, a = [...re, ...oe].map((L) => L.combined), c = typeof document > "u" ? null : document.createElement("canvas").getContext("2d");
    c && (c.font = `${n}px ${Qr}`);
    const d = (L) => c ? c.measureText(L).width : L.length * n * 0.55, m = a.reduce((L, Z) => Math.max(L, d(Z)), 0), x = Math.min(320, Math.max(94, Math.ceil(m) + 12)), y = Math.min(260, Math.max(82, Math.ceil(m) + 6)), O = Math.max(88, Math.ceil(y * Math.sin(ii) + 12)), _ = Math.max(0, Math.ceil(y * Math.cos(ii) - ln / 2));
    return { rowLabelWidth: x, columnLabelWidth: y, columnLabelHeight: O, overhang: _ };
  }, [Sn, ln, oe, re]);
  N.useEffect(() => {
    Wn({}), sn({}), rn({ state: "idle" }), jn.current++;
  }, [w == null ? void 0 : w.profileId]), N.useEffect(() => {
    (u == null ? void 0 : u.kind) === "flow" && Re === "physical" && qn("relevant");
  }, [Re, u == null ? void 0 : u.kind, qn]);
  const Zi = (n) => {
    rs((a) => ({ ...a, [n]: !a[n] }));
  }, Es = (n) => {
    var d;
    const a = ((d = wn.current) == null ? void 0 : d.getBoundingClientRect().width) ?? 1100, c = Math.max(360, Math.min(900, a - 440 - 8));
    return Math.max(360, Math.min(c, Math.round(n)));
  }, Hi = (n) => {
    var m;
    if (n.button !== 0) return;
    n.preventDefault();
    const a = n.currentTarget;
    (m = a.setPointerCapture) == null || m.call(a, n.pointerId);
    const c = (x) => {
      var O;
      const y = (O = wn.current) == null ? void 0 : O.getBoundingClientRect();
      y && as(Es(y.right - x.clientX));
    }, d = () => {
      var x;
      window.removeEventListener("pointermove", c), window.removeEventListener("pointerup", d), window.removeEventListener("pointercancel", d), (x = a.releasePointerCapture) == null || x.call(a, n.pointerId);
    };
    window.addEventListener("pointermove", c), window.addEventListener("pointerup", d), window.addEventListener("pointercancel", d);
  }, Yi = (n) => {
    let a = null;
    n.key === "ArrowLeft" ? a = xn + 40 : n.key === "ArrowRight" ? a = xn - 40 : n.key === "Home" && (a = di), a !== null && (n.preventDefault(), as(Es(a)));
  }, Xi = async (n) => {
    var c;
    const a = (c = n.currentTarget.files) == null ? void 0 : c[0];
    n.currentTarget.value = "", a && await Ts(a);
  }, As = () => void yr(vs.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "CyTOF spillover matrix").then((n) => {
    n != null && n[0] && Ts(n[0]);
  }), Ts = async (n) => {
    Xe(null), Q(null), ge(!1), be(null), We(!1);
    try {
      const a = Nr(await n.text()), c = ct(
        a.input,
        "cytof-spillover"
      );
      if (!c.ok)
        throw new Error(c.errors.map(({ message: x }) => x).join(" "));
      const d = /* @__PURE__ */ new Map();
      for (const { pnn: x } of At) {
        const y = x.trim().normalize("NFC");
        d.set(y, (d.get(y) ?? 0) + 1);
      }
      const m = c.value.receiverChannels.filter(
        (x) => d.get(x) === 1
      );
      Hn({
        fileName: n.name,
        source: "file",
        parsed: a,
        matrix: c.value,
        validationWarnings: c.warnings
      }), on(new Set(m));
    } catch (a) {
      Hn(null), on(/* @__PURE__ */ new Set()), Xe(a instanceof Error ? a.message : String(a));
    }
  }, Ji = (n, a) => {
    on((c) => {
      const d = new Set(c);
      return a ? d.add(n) : d.delete(n), d;
    });
  }, $s = async () => {
    var c, d;
    if (!J)
      throw new Error(s("Choose a CyTOF spillover matrix first."));
    const n = ((d = (c = globalThis.crypto) == null ? void 0 : c.randomUUID) == null ? void 0 : d.call(c)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, a = J.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation";
    return _t(
      {
        kind: "cytof-spillover",
        method: "nnls",
        solverVersion: Cr,
        solverSettings: Sr,
        matrix: J.matrix,
        includedChannels: Array.from(In)
      },
      {
        profileId: `cytof-${n}`,
        name: a,
        createdAt: /* @__PURE__ */ new Date(),
        origin: {
          type: "uploaded",
          fileName: J.fileName,
          format: J.parsed.format.delimiter,
          sourceColumnHeader: J.parsed.format.sourceColumnHeader
        },
        provenance: {
          sourceDescription: J.source === "host" ? "CyTOF spillover matrix from metadata(sce)$spillover_matrix" : "User-uploaded CyTOF spillover matrix",
          estimationMethod: "Imported; coefficients preserved exactly"
        }
      }
    );
  }, Qi = async () => {
    if (!($e.current || B || !J || !(ue != null && ue.canApply) || !l)) {
      if (j && !Se) {
        Xe(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      Xe(null), Q(null), be(null), $e.current = !0, Le(!0), Ze(J.fileName);
      try {
        const n = await $s();
        await l(n, be), Q(s("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: n.name,
          channels: In.size,
          files: Je
        })), Hn(null), on(/* @__PURE__ */ new Set()), We(!1), be(null);
      } catch (n) {
        const a = n instanceof Error ? n.message : String(n);
        /cancel/i.test(a) ? Q(s("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : Xe(a);
      } finally {
        $e.current = !1, Le(!1), Ze(null);
      }
    }
  }, er = async () => {
    if (!($e.current || B || !J || !(ue != null && ue.canApply) || !Qe || !v || !Et)) {
      if (j && !Se) {
        Xe(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before adopting the assay.")
        );
        return;
      }
      Xe(null), Q(null), be(null), $e.current = !0, Le(!0), Ze(Qe.label);
      try {
        const n = await $s();
        await v(
          n,
          Qe,
          be
        ), Q(s("Using existing SCE assay {assay} with {matrix}. No assay values were recomputed.", {
          assay: Qe.label,
          matrix: n.name
        })), Hn(null), on(/* @__PURE__ */ new Set()), We(!1), Jn(!1), be(null);
      } catch (n) {
        Xe(n instanceof Error ? n.message : String(n));
      } finally {
        $e.current = !1, Le(!1), Ze(null);
      }
    }
  }, nr = async () => {
    var d, m;
    if ($e.current || B || !l) return;
    if (j && !Se) {
      ge(!0), Q(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before starting a matrix.")
      );
      return;
    }
    const n = t.channels.map((x, y) => ({ pnn: x.pnn, index: y })).filter(({ index: x }) => t.isFluorChannel(x) && !t.isImagingFeatureChannel(x)).map(({ pnn: x }) => x);
    if (n.length < 2) {
      ge(!0), Q(s("An empty matrix needs at least two fluorescence channels."));
      return;
    }
    const a = ct({
      sourceChannels: n,
      receiverChannels: n,
      matrix: n.map((x, y) => n.map((O, _) => y === _ ? 1 : 0))
    }, "flow-spillover");
    if (!a.ok) {
      ge(!0), Q(a.errors.map(({ message: x }) => x).join(" "));
      return;
    }
    const c = `${i.replace(/\.fcs$/i, "") || "Flow"} manual matrix`;
    Q(null), ge(!1), be(null), $e.current = !0, Le(!0), Ze(c);
    try {
      const x = ((m = (d = globalThis.crypto) == null ? void 0 : d.randomUUID) == null ? void 0 : m.call(d)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, y = await _t(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: Us,
          solverSettings: _s,
          matrix: a.value
        },
        {
          profileId: `flow-manual-${x}`,
          name: c,
          createdAt: /* @__PURE__ */ new Date(),
          origin: { type: "manual", startedAs: "identity" },
          provenance: {
            sourceDescription: "Identity matrix over the file's fluorescence channels, to be set by hand in GateLab",
            estimationMethod: "Manual"
          }
        }
      );
      await l(y, be), We(!1), Q(s("Manual matrix editing is ready: every spillover starts at zero. Select a pair and set its coefficient."));
    } catch (x) {
      ge(!0), Q(x instanceof Error ? x.message : String(x));
    } finally {
      $e.current = !1, Le(!1);
    }
  }, tr = async () => {
    if (!(!p || B || Yn)) {
      if (j && !Se) {
        ge(!0), Q(
          s("Confirm that existing gate memberships will be recomputed in original coordinates before removing the matrix.")
        );
        return;
      }
      fs(!0);
      try {
        await p(), ge(!1), Q(s("The matrix was removed. The original assay is active and every file reads its stored values."));
      } catch (n) {
        ge(!0), Q(n instanceof Error ? n.message : String(n));
      } finally {
        fs(!1);
      }
    }
  }, sr = async () => {
    var a, c, d;
    if ($e.current || B || !ne || !((a = Me == null ? void 0 : Me.validation) != null && a.ok) || !l) return;
    if (j && !Se) {
      ge(!0), Q(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const n = (me == null ? void 0 : me.name) || `${i.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    Q(null), ge(!1), be(null), $e.current = !0, Le(!0), Ze(n);
    try {
      const m = ((d = (c = globalThis.crypto) == null ? void 0 : c.randomUUID) == null ? void 0 : d.call(c)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, x = await _t(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: Us,
          solverSettings: _s,
          matrix: Me.validation.value
        },
        {
          profileId: `flow-${m}`,
          name: n,
          createdAt: /* @__PURE__ */ new Date(),
          origin: {
            ...me ? {
              type: "uploaded",
              fileName: me.name,
              format: "csv",
              sourceColumnHeader: "source"
            } : {
              type: "embedded-fcs",
              fileName: i,
              ...Me.keyword ? { keyword: Me.keyword } : {}
            }
          },
          provenance: {
            sourceDescription: me ? "Flow spillover matrix from metadata(sce)$spillover_matrix" : "Spillover matrix embedded in the source FCS file",
            estimationMethod: me ? "Imported from SCE metadata; coefficients preserved exactly" : "Imported from FCS; coefficients preserved exactly"
          }
        }
      );
      await l(x, be), We(!1), Q(s(me ? "Flow matrix editing is ready. The exact hosted matrix is retained as the baseline, and Original measurements remain available." : "Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available."));
    } catch (m) {
      ge(!0), Q(m instanceof Error ? m.message : String(m));
    } finally {
      $e.current = !1, Le(!1), Ze(null), be(null);
    }
  }, Fs = (n, a) => {
    var m, x;
    const c = re[n], d = oe[a];
    !u || !c || !d || u.sourceAxisKeys[n] === u.receiverAxisKeys[a] || (Ne(`${u.sourceAxisKeys[n]}${_e}${u.receiverAxisKeys[a]}`), (x = (m = bs.current) == null ? void 0 : m.querySelector(
      `button[data-source-index="${n}"][data-receiver-index="${a}"]`
    )) == null || x.focus());
  }, ir = (n, a, c) => {
    if (!u) return;
    const d = u.sourceAxisKeys.length, m = u.receiverAxisKeys.length;
    let x = a, y = c;
    const O = (L, Z) => {
      let se = L + Z;
      for (; se >= 0 && se < m; ) {
        if (u.sourceAxisKeys[a] !== u.receiverAxisKeys[se]) return se;
        se += Z;
      }
      return L;
    }, _ = (L, Z) => {
      let se = L + Z;
      for (; se >= 0 && se < d; ) {
        if (u.sourceAxisKeys[se] !== u.receiverAxisKeys[c]) return se;
        se += Z;
      }
      return L;
    };
    switch (n.key) {
      case "ArrowLeft":
        y = O(c, -1);
        break;
      case "ArrowRight":
        y = O(c, 1);
        break;
      case "ArrowUp":
        x = _(a, -1);
        break;
      case "ArrowDown":
        x = _(a, 1);
        break;
      case "Home": {
        y = u.sourceAxisKeys[a] === u.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const L = m - 1;
        y = u.sourceAxisKeys[a] === u.receiverAxisKeys[L] ? L - 1 : L;
        break;
      }
      default:
        return;
    }
    n.preventDefault(), Fs(x, y);
  }, Dn = (n, a) => {
    if (!w || !Number.isFinite(a)) return;
    const [c, d] = n.split(_e), m = w.scientific.matrix.sourceChannels.indexOf(c), x = w.scientific.matrix.receiverChannels.indexOf(d);
    if (m < 0 || x < 0) return;
    if (w.scientific.kind === "cytof-spillover" && a < 0) {
      ge(!0), Q(s("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const y = w.scientific.matrix.matrix[m][x];
    Wn((O) => {
      const _ = { ...O };
      return a === y ? delete _[n] : _[n] = a, _;
    }), ge(!1), Q(s("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: c,
      receiver: d,
      value: (a * 100).toFixed(2)
    }));
  }, Is = (n, a, c, d) => {
    const m = c[0];
    if (!m) return null;
    const x = m.sourceChannels.indexOf(n.source.pnn), y = m.sourceChannels.indexOf(n.receiver.pnn);
    if (x < 0 || y < 0) return null;
    const O = Bt(
      t,
      n.source.pnn,
      n.receiver.pnn,
      d,
      m.currentColumns[x],
      m.currentColumns[y],
      { totalEvents: de }
    );
    if (!O.ready) return null;
    const _ = [{
      value: n.coefficient,
      isCurrent: !0,
      preview: O.preview
    }];
    return c.forEach((L, Z) => {
      const se = L.sourceChannels.indexOf(n.source.pnn), ze = L.sourceChannels.indexOf(n.receiver.pnn);
      if (se < 0 || ze < 0) return;
      const we = Bt(
        t,
        n.source.pnn,
        n.receiver.pnn,
        d,
        L.candidateColumns[se],
        L.candidateColumns[ze],
        {
          totalEvents: de,
          xRange: O.preview.xRange,
          yRange: O.preview.yRange
        }
      );
      we.ready && _.push({
        value: a[Z],
        isCurrent: !1,
        preview: we.preview
      });
    }), _.sort((L, Z) => L.value - Z.value || Number(Z.isCurrent) - Number(L.isCurrent)), { pairKey: n.pairKey, values: Object.freeze(_) };
  }, rr = async (n) => {
    if (!w || !u || !R || B || he || ye) return;
    const a = Kn(n.pairKey, n.coefficient);
    if (a.error) {
      ve(a.error);
      return;
    }
    const c = pn(
      t.fcs.nEvents,
      ai,
      pe
    );
    if (c.length === 0) {
      ve(s("The selected review population contains no events."));
      return;
    }
    const d = ++Te.current, m = [a.lower, a.upper];
    bn(n.pairKey), ve(null);
    try {
      const x = await R(
        w,
        c,
        m.map((O) => hi(
          w,
          u.sourceAxisKeys[n.sourceIndex],
          u.receiverAxisKeys[n.receiverIndex],
          O
        )),
        void 0,
        1
      );
      if (Te.current !== d) return;
      const y = Is(n, m, x, c);
      if (!y) throw new Error(s("The fast bounds preview could not be built for this pair."));
      an((O) => ({ ...O, [n.pairKey]: y }));
    } catch (x) {
      if (Te.current !== d) return;
      const y = x instanceof Error ? x.message : String(x);
      ve(/cancel/i.test(y) ? s("Fast bounds preview cancelled.") : y);
    } finally {
      Te.current === d && bn(null);
    }
  }, ar = async () => {
    var d;
    if (!w || !R || De.length === 0 || B || he !== null || ye !== null) return;
    if (Rt > 0) {
      ve(s("Fix the sweep bounds for {count} flagged pairs before running.", { count: Rt }));
      return;
    }
    const n = pn(
      t.fcs.nEvents,
      ri,
      pe
    );
    if (n.length === 0) {
      ve(s("The selected review population contains no events."));
      return;
    }
    const a = ++Te.current, c = De.flatMap((m) => {
      const x = Kn(m.pairKey, m.coefficient);
      return da(x.lower, x.upper).map((y) => ({
        pair: m,
        value: y,
        matrix: hi(
          w,
          u.sourceAxisKeys[m.sourceIndex],
          u.receiverAxisKeys[m.receiverIndex],
          y
        )
      }));
    });
    ve(null), Ye({}), yn({ completed: 0, total: c.length });
    try {
      const m = await R(
        w,
        n,
        c.map(({ matrix: y }) => y),
        (y, O) => {
          Te.current === a && yn({ completed: y, total: O });
        },
        Nt
      );
      if (Te.current !== a) return;
      if (m.length !== c.length)
        throw new Error(s("The compensation worker returned an incomplete coefficient sweep."));
      const x = {};
      for (const y of De) {
        const O = c.flatMap((L, Z) => L.pair.pairKey === y.pairKey ? [Z] : []), _ = Is(
          y,
          O.map((L) => c[L].value),
          O.map((L) => m[L]),
          n
        );
        _ && (x[y.pairKey] = _);
      }
      Ye(x), Fn(((d = De[0]) == null ? void 0 : d.pairKey) ?? null);
    } catch (m) {
      if (Te.current !== a) return;
      const x = m instanceof Error ? m.message : String(m);
      ve(/cancel/i.test(x) ? s("Exact coefficient sweep cancelled.") : x);
    } finally {
      Te.current === a && yn(null);
    }
  }, or = () => {
    Te.current++, K == null || K(), yn(null), bn(null), ve(s("Exact coefficient sweep cancelled."));
  }, lr = async () => {
    var a, c;
    if (!w || !Cn || !l || Object.keys(X).length === 0) return;
    const n = `${qt(w.name)} · edited`;
    Q(null), ge(!1), Le(!0), Ze(n), be(null);
    try {
      const m = {
        profileId: `comp-edit-${((c = (a = globalThis.crypto) == null ? void 0 : a.randomUUID) == null ? void 0 : c.call(a)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: n,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(X).length} compensation coefficient${Object.keys(X).length === 1 ? "" : "s"} in GateLab.`
      }, x = (k == null ? void 0 : k.recordType) === "baseline" && ua(Cn, k.scientific.matrix.matrix) ? await jr(w, k, m) : await wr(
        w,
        la(w, Cn),
        m
      );
      await l(x, be), Wn({}), sn({}), Ye({}), an({}), bn(null), ve(null), Mt((y) => y + 1), te.length > 0 && (Vn("attention"), Ne(te[0].pairKey), Fn(te[0].pairKey)), Q(s("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: qt(x.name),
        flagged: te.length > 0 ? s(
          te.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: te.length }
        ) : ""
      }));
    } catch (d) {
      ge(!0), Q(d instanceof Error ? d.message : String(d));
    } finally {
      Le(!1), Ze(null), be(null);
    }
  }, Ps = (n) => {
    if (te.length === 0) return;
    const a = te.findIndex(({ pairKey: m }) => m === Ve), c = a < 0 ? n > 0 ? 0 : te.length - 1 : (a + n + te.length) % te.length, d = te[c];
    Pe(null), Ne(d.pairKey), Fn(d.pairKey);
  }, Ot = () => /* @__PURE__ */ e.jsx(
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
      onPointerDown: Hi,
      onKeyDown: Yi,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), cr = (n) => {
    Pe(null), Ne(n), yt(!0), $t.some((a) => a.pairKey === n) && (Oe.some((a) => a.pairKey === n) || (qn("all"), os("")), ls(n));
  }, Dt = (n, a = !1) => {
    const c = b ? Nn.has(b.pairKey) : !1, d = b ? te.find(({ pairKey: Y }) => Y === b.pairKey) ?? null : null, m = b ? Pt(b.pairKey, b.value) : null, x = b ? Kn(b.pairKey, b.value) : null, y = b ? Ki[b.pairKey] : null, O = b ? u.sourceAxisKeys[b.sourceIndex] : "", _ = b ? u.receiverAxisKeys[b.receiverIndex] : "", L = b != null && b.interaction && b.interaction !== "self" && b.interaction !== "other" ? 1 : 0, Z = b && (je != null && je.ready) ? Ht({
      coefficient: b.value,
      physicalPrior: L,
      evidence: je.preview.evidence
    }, u.kind, qe) : null, se = b ? ca(k, O, _) : null, ze = (b == null ? void 0 : b.value) ?? null, we = b ? X[b.pairKey] : void 0, Mn = !!(b && (w == null ? void 0 : w.scientific.kind) === "flow-spillover" && E && Object.keys(X).length > 0), He = Ge.state !== "idle" && Ge.state !== "error" && Ge.pairKey === (b == null ? void 0 : b.pairKey) ? Ge.preview : null, cn = He ?? (je != null && je.ready ? je.preview : null), dn = [];
    se !== null && ze !== null && ((w == null ? void 0 : w.recordType) === "revision" || se !== ze) && dn.push({ label: s("Baseline"), value: se }), ze !== null && dn.push({ label: s("Installed"), value: ze }), we !== void 0 && dn.push({ label: s("Staged"), value: we });
    const un = te.findIndex(({ pairKey: Y }) => Y === Ve);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${a ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: s("Selected coefficient") }),
          !a && /* @__PURE__ */ e.jsx("span", { children: s(vt ? "Hover preview · click to pin this pair." : Ve ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inspector-actions", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flag-navigation", "aria-label": s("Flagged compensation pair navigation"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Previous flagged compensation pair"),
                disabled: te.length === 0,
                onClick: () => Ps(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: un >= 0 ? s("{current} / {total} flagged", { current: un + 1, total: te.length }) : s("{total} flagged", { total: te.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Next flagged compensation pair"),
                disabled: te.length === 0,
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
        Z && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${Z.category}`,
            title: s(Z.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: s(Z.label) }),
              /* @__PURE__ */ e.jsx("span", { children: s(Z.detail) })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: c,
              disabled: !w || !le.has(u.sourceAxisKeys[b.sourceIndex]) || !le.has(u.receiverAxisKeys[b.receiverIndex]),
              onChange: (Y) => Ln(b.pairKey, Y.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: s("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: s("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: s("Stored fraction: {value}", { value: ie(b.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: s(X[b.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(X[b.pairKey] ?? b.value) ? `${((X[b.pairKey] ?? b.value) * 100).toFixed(1)}%` : String(X[b.pairKey] ?? b.value) })
        ] }),
        dn.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": s("Coefficient history"), children: dn.map((Y, hn) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          hn > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: s("Exact fraction: {value}", { value: ie(Y.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: Y.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (Y.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${Y.label}:${hn}`)) }),
        w && Ve === b.pairKey && !vt && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              An,
              {
                step: "0.1",
                value: Zn,
                disabled: B,
                onValueChange: (Y) => {
                  kt(Y), w.scientific.kind === "flow-spillover" && Y.trim() !== "" && Number.isFinite(Number(Y)) && Dn(b.pairKey, Number(Y) / 100);
                }
              }
            )
          ] }),
          w.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: s("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: B || !Number.isFinite(Number(Zn)) || Zn.trim() === "",
              onClick: () => Dn(b.pairKey, Number(Zn) / 100),
              children: s("Stage value")
            }
          ),
          X[b.pairKey] !== void 0 && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: B,
              onClick: () => {
                Dn(b.pairKey, b.value), sn((Y) => {
                  const hn = { ...Y };
                  return delete hn[b.pairKey], hn;
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
          /* @__PURE__ */ e.jsx("em", { children: we === void 0 ? s("Working matrix") : `${(b.value * 100).toFixed(1)}% → ${(we * 100).toFixed(1)}%` }),
          Ge.state === "updating" && Ge.pairKey === b.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: s("Updating…") }),
          Ge.state === "error" && Ge.pairKey === b.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: s(Ge.message) })
        ] }),
        b.interaction && b.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          s("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: b.interaction })
        ] }),
        a && (cn ? /* @__PURE__ */ e.jsx(
          si,
          {
            preview: cn,
            sourceLabel: b.source.label,
            receiverLabel: b.receiver.label,
            kind: u.kind,
            densitySmoothing: en,
            compact: !0,
            compensatedTitle: s(He ? "Candidate" : "Compensated")
          }
        ) : je && !je.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(je.reason) }) : null),
        a && /* @__PURE__ */ e.jsx(
          Yr,
          {
            matrixView: u,
            sourceChannels: re,
            receiverChannels: oe,
            selectedSourceIndex: b.sourceIndex,
            selectedReceiverIndex: b.receiverIndex,
            stagedCoefficients: X,
            maximumAbsoluteOffDiagonal: ks,
            onSelect: cr
          }
        ),
        !a && (cn ? /* @__PURE__ */ e.jsx(
          si,
          {
            preview: cn,
            sourceLabel: b.source.label,
            receiverLabel: b.receiver.label,
            kind: u.kind,
            densitySmoothing: en,
            compensatedTitle: s(He ? "Candidate" : "Compensated")
          }
        ) : je && !je.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(je.reason) }) : null),
        c && d && m && x && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
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
                  value: m.lowerPercent,
                  disabled: B || he !== null || ye !== null,
                  onValueChange: (Y) => it(b.pairKey, b.value, "lowerPercent", Y)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Upper (%)") }),
              /* @__PURE__ */ e.jsx(
                An,
                {
                  step: "0.1",
                  value: m.upperPercent,
                  disabled: B || he !== null || ye !== null,
                  onValueChange: (Y) => it(b.pairKey, b.value, "upperPercent", Y)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: B || he !== null || ye !== null || x.error !== null,
                onClick: () => void rr(d),
                children: s(ye === b.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          x.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: s(x.error) }) : /* @__PURE__ */ e.jsx("small", { children: s("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(de, ai).toLocaleString(),
            sweep: Math.min(de, ri).toLocaleString()
          }) }),
          y && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: y.values.map((Y) => /* @__PURE__ */ e.jsx("div", { className: Y.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            gt,
            {
              title: `${Y.isCurrent ? `${s("Current")} · ` : ""}${(Y.value * 100).toFixed(2)}%`,
              panel: Y.preview.compensated,
              preview: Y.preview,
              sourceLabel: b.source.label,
              receiverLabel: b.receiver.label,
              minimumSize: 145,
              maximumSize: 220,
              densitySmoothing: en
            }
          ) }, `${b.pairKey}:bounds:${Y.value}:${Y.isCurrent}`)) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s(u.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: s("No coefficient selected.") })
    ] });
  }, Rs = (n, a) => /* @__PURE__ */ e.jsx(
    Xr,
    {
      dataset: a,
      pair: n,
      plotSize: It,
      densitySmoothing: en,
      flagged: Nn.has(n.pairKey),
      selected: Ve === n.pairKey,
      onSelect: () => {
        Pe(null), Ne(n.pairKey), yt(!0);
      },
      onFlag: (c) => Ln(n.pairKey, c)
    },
    n.pairKey
  ), dr = async (n, a) => {
    if (!(ce != null && ce.ready) || !u)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const c = ys.map((d) => ({
      pairKey: d.pairKey,
      sourceLabel: d.source.label,
      receiverLabel: d.receiver.label,
      coefficient: d.coefficient,
      relationship: d.interaction,
      buildPreview: () => {
        const m = fi(
          ce.dataset,
          d.source.key,
          d.receiver.key
        );
        if (!m.ready) throw new Error(m.reason);
        return m.preview;
      }
    }));
    await _r(c, {
      sampleName: i,
      profileName: (w == null ? void 0 : w.name) ?? s(u.title),
      populationName: (ee == null ? void 0 : ee.name) ?? s("All Events"),
      filterLabel: js,
      densitySmoothing: en,
      densityColorPower: H,
      pointAlpha: tt,
      pointSize: st
    }, n, a);
  };
  return V ? /* @__PURE__ */ e.jsx(ts.Provider, { value: H, children: /* @__PURE__ */ e.jsx(ss.Provider, { value: tt, children: /* @__PURE__ */ e.jsx(is.Provider, { value: st, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab gl-plotting-workspace gl-comp-workspace",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-plotting-head gl-comp-head gl-comp-overview${Ee === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsx("h2", { className: "gl-tab-title", children: s("Compensation") }),
            !z && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: at })
          ] }),
          z ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${W.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: s("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: ot,
                method: at,
                count: Lt,
                status: s(W.state === "ready" ? "Ready" : "Unavailable"),
                assay: s(o ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${W.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  s("{kind} compensation installed. Installed compensation profile.", {
                    kind: z.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                /* @__PURE__ */ e.jsx("strong", { children: Gi }),
                /* @__PURE__ */ e.jsx("span", { children: s("{method} · {count} ch · {status}", {
                  method: at,
                  count: Lt,
                  status: W.state === "ready" ? s("Ready") : s("Unavailable")
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
                source: s(Ss),
                assay: s(o ? "Compensated assay active" : "Original assay active"),
                count: Lt
              })
            }
          ),
          z && t.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: B,
              onClick: As,
              children: s("Replace matrix…")
            }
          ),
          z && p && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-header-remove", children: [
            j && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: Se,
                  disabled: B || Yn,
                  onChange: (n) => We(n.currentTarget.checked)
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
                onClick: () => void tr(),
                children: s(Yn ? "Removing…" : "Remove the matrix")
              }
            )
          ] }),
          Wi && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-global-layer-note", children: s("Assay selection in the top bar applies to every tab.") })
        ] }),
        /* @__PURE__ */ e.jsxs("aside", { className: "gl-plotting-inspector gl-comp-inspector-left", "aria-label": s("Compensation controls"), children: [
          t.instrument === "flow" && !z && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Matrix") }),
            t.instrument === "flow" && ne && !z && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-enable-heading", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("strong", { id: "comp-flow-enable-heading", children: s(me ? "SCE spillover matrix" : "Embedded FCS matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: s("Install this exact matrix as the immutable baseline to edit coefficients and preview their effect.") })
              ] }),
              j && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Se,
                    disabled: B,
                    onChange: (n) => We(n.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
              ] }),
              h.length > 0 && !(Me != null && Me.error) && /* @__PURE__ */ e.jsx("p", { className: "gl-hint gl-comp-embedded-others", children: s("Enabling also returns {count} other files to Original: {files}. A workspace keeps one kind of compensation, and these draw from their own embedded matrix.", {
                count: h.length,
                files: h.join(", ")
              }) }),
              Me != null && Me.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: Me.error }) : B ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
                ae ? s("Preparing editor… {percent}%", { percent: Math.round(ae.fraction * 100) }) : s("Preparing editor…"),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (ae == null ? void 0 : ae.phase) === "cancelling",
                    onClick: g,
                    children: s((ae == null ? void 0 : ae.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                )
              ] }) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: !l || j && !Se,
                  onClick: () => void sr(),
                  children: s("Enable matrix editing")
                }
              )
            ] }),
            t.instrument === "flow" && !z && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-empty-heading", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("strong", { id: "comp-flow-empty-heading", children: s("Empty matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: s(ne ? "Or start from an identity matrix over the file's fluorescence channels, every spillover at zero, and set the coefficients by hand." : "Start from an identity matrix over the file's fluorescence channels, every spillover at zero, and set the coefficients by hand.") })
              ] }),
              j && !ne && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Se,
                    disabled: B,
                    onChange: (n) => We(n.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
              ] }),
              B ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-flow-enable-progress", role: "status", children: s("Preparing editor…") }) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: !l || j && !Se,
                  onClick: () => void nr(),
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
                  value: (ee == null ? void 0 : ee.id) ?? "all",
                  disabled: he !== null || ye !== null,
                  onChange: (n) => wt(n.currentTarget.value),
                  children: [
                    /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All Events") }),
                    $.map((n) => /* @__PURE__ */ e.jsx("option", { value: n.id, children: `${"· ".repeat(n.depth)}${n.name} (${n.eventCount.toLocaleString()})` }, n.id))
                  ]
                }
              ),
              /* @__PURE__ */ e.jsx("small", { children: s("{count} events · applies to biplots, attention ranking, and sweeps; membership frozen from the current assay", {
                count: de.toLocaleString()
              }) })
            ] }),
            Ee !== "global" && /* @__PURE__ */ e.jsxs(
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
                        Ei(a === "all" ? "all" : Number(a));
                      },
                      children: [
                        li.map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: s("{count} events", { count: n.toLocaleString() }) }, n)),
                        /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All available") })
                      ]
                    }
                  ),
                  /* @__PURE__ */ e.jsx("small", { children: s("Showing {shown} of {total}; Apply always uses all events.", {
                    shown: Pn.length.toLocaleString(),
                    total: de.toLocaleString()
                  }) })
                ]
              }
            )
          ] }),
          (I !== void 0 && P !== void 0 && M || u && Object.keys(X).length > 0) && /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Apply") }),
            I !== void 0 && P !== void 0 && M && /* @__PURE__ */ e.jsxs(
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
                      value: I,
                      disabled: B,
                      onChange: (n) => M(Number(n.currentTarget.value)),
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
            u && Object.keys(X).length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
              /* @__PURE__ */ e.jsxs("span", { children: [
                s("{count} pending edits", { count: Object.keys(X).length }),
                (w == null ? void 0 : w.scientific.kind) === "cytof-spillover" ? ` · ${s("{files} checked FCS files", { files: Je })}` : ""
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  disabled: B,
                  onClick: () => {
                    Wn({}), sn({}), Q(null);
                  },
                  children: s("Discard")
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: B || he !== null || ye !== null || !l || (w == null ? void 0 : w.scientific.kind) === "cytof-spillover" && Je === 0,
                  onClick: () => void lr(),
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
                      value: en,
                      "aria-label": s("Compensation biplot density smoothing"),
                      onChange: (n) => Ni(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: en })
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
                      onChange: (n) => Si(Number(n.currentTarget.value))
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
                      onChange: (n) => ki(Number(n.currentTarget.value))
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
              vr,
              {
                className: "gl-comp-density-colour",
                value: H,
                onChange: G
              }
            )
          ] }),
          (u || z) && /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Tools") }),
            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: na.map(({ id: n, label: a }) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                id: `comp-drawer-${n}-button`,
                className: "gl-comp-drawer-toggle",
                "aria-expanded": Bn[n],
                "aria-controls": `comp-drawer-${n}`,
                onClick: () => Zi(n),
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
                "aria-selected": Ee === "matrix",
                className: Ee === "matrix" ? "active" : void 0,
                onClick: () => {
                  Pe(null), Vn("matrix");
                },
                children: s("Matrix")
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": Ee === "global",
                className: Ee === "global" ? "active" : void 0,
                onClick: () => {
                  Pe(null), Vn("global");
                },
                children: s("Global inspector")
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": Ee === "attention",
                className: Ee === "attention" ? "active" : void 0,
                onClick: () => {
                  Pe(null), Vn("attention");
                },
                children: [
                  s("Flagged"),
                  te.length > 0 ? ` (${te.length})` : ""
                ]
              }
            )
          ] }),
          t.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "input",
            {
              ref: vs,
              type: "file",
              accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
              className: "gl-sr-only",
              "aria-label": s("Choose CyTOF spillover matrix"),
              onChange: (n) => void Xi(n)
            }
          ),
          ps && /* @__PURE__ */ e.jsx("div", { className: ms ? "gl-comp-error" : "gl-comp-status", role: ms ? "alert" : "status", children: s(ps) }),
          t.instrument === "cytof" && (!z || J) && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-cytof-import", "aria-labelledby": "comp-cytof-import-heading", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-import-head", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("h3", { id: "comp-cytof-import-heading", children: s("CyTOF spillover matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: s("Linear counts → non-negative least squares → arcsinh display") })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-import-actions", children: /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: J ? "gl-btn-ghost" : "gl-btn",
                  disabled: B,
                  onClick: As,
                  children: s(J ? "Choose another matrix…" : "Import matrix…")
                }
              ) })
            ] }),
            gs && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s(gs) }),
            J && ue && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-body", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-summary", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("strong", { children: J.fileName }),
                  /* @__PURE__ */ e.jsx("span", { children: s("{sources} sources × {receivers} receivers", {
                    sources: J.matrix.sourceChannels.length,
                    receivers: J.matrix.receiverChannels.length
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("dl", { children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Exact matches") }),
                    /* @__PURE__ */ e.jsx("dd", { children: ue.matchedChannels.length })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Included") }),
                    /* @__PURE__ */ e.jsx("dd", { children: ue.includedChannels.length })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Not in FCS") }),
                    /* @__PURE__ */ e.jsx("dd", { children: ue.matrixOnlyChannels.length })
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
                      onClick: () => on(new Set(ue.matchedChannels)),
                      children: s("All matched")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: B,
                      onClick: () => on(/* @__PURE__ */ new Set()),
                      children: s("None")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-channel-grid", children: J.matrix.receiverChannels.map((n) => {
                const a = ue.matchedChannels.includes(n);
                return /* @__PURE__ */ e.jsxs("label", { className: a ? "" : "is-unavailable", title: a ? n : s("{channel} is not uniquely present in this FCS file", { channel: n }), children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: In.has(n),
                      disabled: !a || B,
                      onChange: (c) => Ji(n, c.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: Gt(t, n).combined }),
                  !a && /* @__PURE__ */ e.jsx("small", { children: s("not matched") })
                ] }, n);
              }) }),
              (J.validationWarnings.length > 0 || ue.warnings.length > 0) && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: /* @__PURE__ */ e.jsx("span", { children: s("{count} review items: {messages}", {
                count: J.validationWarnings.length + ue.warnings.length,
                messages: [
                  ...J.validationWarnings.map(({ message: n }) => n),
                  ...ue.warnings.map(({ message: n }) => n)
                ].map((n) => s(n)).join(" ")
              }) }) }),
              ue.blockers.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: ue.blockers.map(({ message: n }) => s(n)).join(" ") }),
              j && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Se,
                    disabled: B,
                    onChange: (n) => We(n.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: s("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                  /* @__PURE__ */ e.jsx("span", { children: B ? ae ? s("{phase}… {percent}% ({processed} / {total} events)", {
                    phase: s(ae.phase === "cancelling" ? "Cancelling" : ae.phase === "preparing" ? "Preparing" : "Applying"),
                    percent: Math.round(ae.fraction * 100),
                    processed: ae.processedEvents.toLocaleString(),
                    total: ae.totalEvents.toLocaleString()
                  }) : s("Preparing compensation…") : s("The Original assay is retained and can be restored at any time.") }),
                  /* @__PURE__ */ e.jsx("strong", { className: Je === 0 ? "is-empty" : void 0, children: Je === 0 ? s("No FCS files are checked. Select at least one file in Samples.") : s("Applies atomically to {files} checked FCS files · {events} total events", {
                    files: Je,
                    events: Ui.toLocaleString()
                  }) })
                ] }),
                B ? /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (ae == null ? void 0 : ae.phase) === "cancelling",
                    onClick: g,
                    children: s((ae == null ? void 0 : ae.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                ) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn",
                    disabled: !l || Je === 0 || !ue.canApply || j && !Se,
                    onClick: () => void Qi(),
                    children: s("Apply NNLS compensation")
                  }
                )
              ] }),
              f.length > 0 && v && /* @__PURE__ */ e.jsxs(
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
                          value: (Qe == null ? void 0 : Qe.id) ?? "",
                          disabled: B,
                          onChange: (n) => {
                            xs(n.currentTarget.value), Jn(!1);
                          },
                          children: f.map((n) => /* @__PURE__ */ e.jsx("option", { value: n.id, children: n.label === n.id ? n.id : `${n.label} (${n.id})` }, n.id))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-adopt-confirm", children: [
                      /* @__PURE__ */ e.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: Et,
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
                        disabled: B || !Qe || !Et || Je === 0 || !ue.canApply || j && !Se,
                        onClick: () => void er(),
                        children: s("Use existing assay — no recomputation")
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          Cs && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
          Ns.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
            /* @__PURE__ */ e.jsx("span", { children: s("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
              count: Ns.length
            }) }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => rs((n) => ({ ...n, review: !0 })), children: s("Review details") })
          ] }),
          z && W.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
          u && Ee === "matrix" ? /* @__PURE__ */ e.jsxs(
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
                          onClick: () => us(!0),
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
                        width: 18 + On.rowLabelWidth + u.receiverAxisKeys.length * ln + On.overhang,
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
                                  gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${ln}px)`
                                },
                                children: oe.map((n, a) => /* @__PURE__ */ e.jsx(
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
                                  gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${ln}px)`
                                },
                                children: re.map((n, a) => /* @__PURE__ */ e.jsx(
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
                                ref: bs,
                                className: "gl-comp-matrix shows-values",
                                role: "grid",
                                "aria-label": s("Compensation matrix; source rows and receiver columns"),
                                "aria-rowcount": u.sourceAxisKeys.length,
                                "aria-colcount": u.receiverAxisKeys.length,
                                style: {
                                  gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${ln}px)`,
                                  gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${ln}px)`
                                },
                                children: u.matrix.map((n, a) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    role: "row",
                                    className: "gl-comp-matrix-row",
                                    "aria-rowindex": a + 1,
                                    children: n.map((c, d) => {
                                      const m = u.sourceAxisKeys[a], x = u.receiverAxisKeys[d], y = `${m}${_e}${x}`, O = X[y], _ = O ?? c, L = m === x, Z = (b == null ? void 0 : b.sourceIndex) === a && b.receiverIndex === d, se = (b == null ? void 0 : b.sourceIndex) === a, ze = (b == null ? void 0 : b.receiverIndex) === d, we = re[a], Mn = oe[d], He = u.kind === "cytof" ? kn(m, x) : null, cn = br(
                                        _,
                                        ks,
                                        L
                                      ), dn = u.receiverAxisKeys.findIndex((xe) => xe !== m), un = Ve === y, Y = Ve === null && a === 0 && d === dn, hn = Number.isFinite(_) ? _ === 0 ? "" : (_ * 100).toFixed(1) : String(_), Os = He && He !== "other" && He !== "self" ? ` · ${He}` : "", ur = Pi[y] ?? ui(_);
                                      return Sn && !L ? /* @__PURE__ */ e.jsx(
                                        An,
                                        {
                                          role: "gridcell",
                                          className: `gl-comp-cell gl-comp-cell-input${Z ? " selected" : ""}${un ? " is-pinned" : ""}${O === void 0 ? "" : " is-staged"}${se ? " is-selected-source" : ""}${ze ? " is-selected-receiver" : ""}`,
                                          min: "0",
                                          step: "0.1",
                                          value: ur,
                                          disabled: B,
                                          "data-source-index": a,
                                          "data-receiver-index": d,
                                          "aria-colindex": d + 1,
                                          "aria-selected": un,
                                          "aria-label": s("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                            source: we.combined,
                                            receiver: Mn.combined,
                                            pending: O === void 0 ? "" : s(", pending edit")
                                          }),
                                          title: s("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                            source: we.combined,
                                            receiver: Mn.combined,
                                            pending: O === void 0 ? "" : s(" · pending edit")
                                          }),
                                          style: cn,
                                          onFocus: () => Ne(y),
                                          onMouseEnter: () => Pe(y),
                                          onMouseLeave: () => Pe((xe) => xe === y ? null : xe),
                                          onClick: () => Ne(y),
                                          onValueChange: (xe) => {
                                            Ne(y), sn((zn) => ({ ...zn, [y]: xe })), xe.trim() !== "" && Number.isFinite(Number(xe)) && Dn(y, Number(xe) / 100);
                                          },
                                          onBlur: (xe) => {
                                            const zn = xe.currentTarget.value;
                                            if (zn.trim() === "" || !Number.isFinite(Number(zn))) {
                                              sn((zt) => {
                                                const Ds = { ...zt };
                                                return delete Ds[y], Ds;
                                              });
                                              return;
                                            }
                                            sn((zt) => ({
                                              ...zt,
                                              [y]: ui(Number(zn) / 100)
                                            }));
                                          }
                                        },
                                        x
                                      ) : /* @__PURE__ */ e.jsx(
                                        "button",
                                        {
                                          type: "button",
                                          role: "gridcell",
                                          className: `gl-comp-cell${L ? " diagonal" : ""}${Z ? " selected" : ""}${un ? " is-pinned" : ""}${O === void 0 ? "" : " is-staged"}${se ? " is-selected-source" : ""}${ze ? " is-selected-receiver" : ""}`,
                                          disabled: L,
                                          tabIndex: L ? -1 : Z || Y ? 0 : -1,
                                          "data-source-index": a,
                                          "data-receiver-index": d,
                                          "data-interaction": He ?? void 0,
                                          "aria-colindex": d + 1,
                                          "aria-pressed": L ? void 0 : un,
                                          "aria-label": L ? s("{channel} diagonal: {value}", { channel: we.combined, value: tn(_) }) : s("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                            source: we.combined,
                                            receiver: Mn.combined,
                                            value: tn(_),
                                            pending: O === void 0 ? "" : s(" (pending edit)"),
                                            interaction: Os
                                          }),
                                          title: L ? `${we.combined} · self · ${tn(_)}` : `${we.combined} → ${Mn.combined} · ${tn(_)}${O === void 0 ? "" : " · pending edit"}${Os}`,
                                          style: cn,
                                          onFocus: () => {
                                            L || Ne(y);
                                          },
                                          onMouseEnter: () => {
                                            L || Pe(y);
                                          },
                                          onMouseLeave: () => Pe((xe) => xe === y ? null : xe),
                                          onClick: () => Ne(y),
                                          onKeyDown: (xe) => ir(xe, a, d),
                                          children: /* @__PURE__ */ e.jsx("span", { children: hn })
                                        },
                                        x
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
                Ot(),
                Dt()
              ]
            }
          ) : u && Ee === "global" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: wn,
              className: `gl-comp-common-path gl-comp-global-path${$n ? " has-details" : ""}`,
              style: {
                gridTemplateColumns: $n ? `minmax(440px, 1fr) 8px ${xn}px` : "minmax(0, 1fr)"
              },
              children: [
                /* @__PURE__ */ e.jsx(
                  Jr,
                  {
                    stateKey: q,
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
                          value: Re,
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
                          value: Ke,
                          onChange: (n) => bi(n.currentTarget.value),
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
                          onChange: (n) => os(n.currentTarget.value)
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
                            value: It,
                            "aria-label": s("Global compensation plot size"),
                            onChange: (n) => ji(Number(n.currentTarget.value))
                          }
                        ),
                        /* @__PURE__ */ e.jsx("output", { children: s("{size}px", { size: It }) })
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn gl-comp-global-export",
                          disabled: !(ce != null && ce.ready) || Oe.length === 0,
                          title: s("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                          onClick: () => hs(!0),
                          children: s("Export…")
                        }
                      ),
                      /* @__PURE__ */ e.jsx(
                        "span",
                        {
                          className: "gl-comp-global-count",
                          title: s("The Global gallery uses one fixed representative event set so every pair and both assay layers remain directly comparable."),
                          children: s("{pairs} pairs · {shown} / {total} events · {population}", {
                            pairs: Oe.length.toLocaleString(),
                            shown: Tt.length.toLocaleString(),
                            total: de.toLocaleString(),
                            population: (ee == null ? void 0 : ee.name) ?? s("All Events")
                          })
                        }
                      )
                    ] }),
                    children: ce ? ce.ready ? Oe.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No pairs match the current filter. Choose another filter or clear the channel search.") }) : Ke === "compact" ? /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-gallery",
                        "data-event-signature": ce.dataset.eventSignature,
                        children: Oe.map((n) => Rs(n, ce.dataset))
                      }
                    ) : /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-groups",
                        "data-event-signature": ce.dataset.eventSignature,
                        "data-layout": Ke,
                        children: Ft.map((n) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                          /* @__PURE__ */ e.jsxs("header", { children: [
                            /* @__PURE__ */ e.jsx("span", { children: s(Ke === "source" ? "Source channel" : "Receiver") }),
                            /* @__PURE__ */ e.jsx("strong", { title: n.channel.combined, children: n.channel.label }),
                            /* @__PURE__ */ e.jsx("small", { children: n.channel.pnn }),
                            /* @__PURE__ */ e.jsx("em", { children: s("{count} pairs", { count: n.pairs.length }) })
                          ] }),
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: n.pairs.map((a) => Rs(a, ce.dataset)) })
                        ] }, n.channel.key))
                      }
                    ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s(ce.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No matrix is available for the global inspector.") })
                  }
                ),
                $n && Ot(),
                $n && Dt(() => yt(!1), !0)
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
                            value: Nt,
                            disabled: he !== null || ye !== null,
                            onChange: (n) => Ct(Number(n.currentTarget.value)),
                            children: Array.from({ length: ci }, (n, a) => a + 1).map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
                          }
                        )
                      ] }),
                      he ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: or, children: s("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-btn",
                          disabled: !w || !R || De.length === 0 || Rt > 0 || B || ye !== null,
                          onClick: () => void ar(),
                          children: s("Run four-value sweeps ({count})", { count: De.length })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-scope", children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Suggestions computed for {population} from up to {count} frozen events.", {
                      population: (ee == null ? void 0 : ee.name) ?? s("All Events"),
                      count: Math.min(de, Rn.length).toLocaleString()
                    }) }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-evidence-mode", children: [
                      /* @__PURE__ */ e.jsx("span", { children: s("Evidence mode") }),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          "aria-label": s("Compensation evidence mode"),
                          value: qe,
                          disabled: B || he !== null || ye !== null,
                          onChange: (n) => {
                            Ti(n.currentTarget.value), Mt((a) => a + 1), Ye({}), an({}), ve(null);
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
                        disabled: B || he !== null || ye !== null,
                        onClick: () => {
                          Mt((n) => n + 1), Ye({}), an({}), ve(null), ge(!1), Q(
                            s(te.length === 1 ? "Recomputed compensation suggestions for {population}. {count} flagged pair was retained." : "Recomputed compensation suggestions for {population}. {count} flagged pairs were retained.", {
                              population: (ee == null ? void 0 : ee.name) ?? s("All Events"),
                              count: te.length
                            })
                          );
                        },
                        children: s("Recompute suggestions")
                      }
                    ),
                    /* @__PURE__ */ e.jsxs("small", { children: [
                      s(qe === "biological" ? "Broad positive association is excluded because co-expression and cell size can mimic spill. High-tail shapes remain control-sensitive review prompts." : "Positive residual association may enter the shortlist only because you declared suitable control data."),
                      " ",
                      s("Sweep workers are separate from full-Apply workers.")
                    ] })
                  ] }),
                  he && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-progress", role: "status", "aria-live": "polite", children: [
                    /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, he.total), value: he.completed }),
                    /* @__PURE__ */ e.jsx("span", { children: s("{completed} / {total} exact candidate solves · {workers} workers", {
                      completed: he.completed,
                      total: he.total,
                      workers: Nt
                    }) })
                  ] }),
                  ds && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s(ds) }),
                  w ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": s("Add compensation pair for follow-up"), children: [
                      /* @__PURE__ */ e.jsx("strong", { children: s("Add a pair") }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
                        /* @__PURE__ */ e.jsx(
                          zs,
                          {
                            label: s("Follow-up source channel"),
                            value: Ae,
                            options: u.sourceAxisKeys.flatMap((n, a) => le.has(n) ? [{ value: n, label: re[a].combined }] : []),
                            onChange: (n) => {
                              cs(n), Ce === n && St(u.receiverAxisKeys.find((a) => a !== n && le.has(a)) ?? "");
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Receiver") }),
                        /* @__PURE__ */ e.jsx(
                          zs,
                          {
                            label: s("Follow-up receiver channel"),
                            value: Ce,
                            options: u.receiverAxisKeys.flatMap((n, a) => n !== Ae && le.has(n) ? [{ value: n, label: oe[a].combined }] : []),
                            onChange: St
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !Ae || !Ce || Ae === Ce,
                          onClick: Bi,
                          children: s("Flag for follow-up")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flagged-columns", children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsx("h4", { children: s("Flagged by you ({count})", { count: De.length }) }),
                          /* @__PURE__ */ e.jsx("span", { children: s("Only these pairs are included when you run sweeps.") })
                        ] }) }),
                        De.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pairs are flagged yet. Tick “Flag for follow-up” in the inspector, add a pair above, or accept a suggestion below.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-list", children: De.map((n, a) => {
                          const c = Ri[n.pairKey], d = Li === n.pairKey, m = Kn(n.pairKey, n.coefficient), x = Pt(n.pairKey, n.coefficient);
                          return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${Ve === n.pairKey ? " is-selected" : ""}`, children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                              /* @__PURE__ */ e.jsxs(
                                "button",
                                {
                                  type: "button",
                                  className: "gl-comp-sweep-pair-head",
                                  "aria-expanded": d,
                                  onClick: () => {
                                    Ne(n.pairKey), Fn(d ? null : n.pairKey);
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
                                      shift: ie(n.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: ie(n.evidence.residualSlope ?? 0, 4)
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
                                  /* @__PURE__ */ e.jsx(An, { step: "0.1", value: x.lowerPercent, disabled: B || he !== null || ye !== null, onValueChange: (y) => it(n.pairKey, n.coefficient, "lowerPercent", y) })
                                ] }),
                                /* @__PURE__ */ e.jsx("span", { children: s("to") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  s("Upper (%)"),
                                  /* @__PURE__ */ e.jsx(An, { step: "0.1", value: x.upperPercent, disabled: B || he !== null || ye !== null, onValueChange: (y) => it(n.pairKey, n.coefficient, "upperPercent", y) })
                                ] }),
                                m.error && /* @__PURE__ */ e.jsx("small", { children: s(m.error) })
                              ] }),
                              c ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: c.values.map((y) => /* @__PURE__ */ e.jsxs(
                                "div",
                                {
                                  className: `gl-comp-sweep-value${y.isCurrent ? " is-current" : ""}${X[n.pairKey] === y.value ? " is-staged" : ""}`,
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
                                        densitySmoothing: en
                                      }
                                    ),
                                    /* @__PURE__ */ e.jsxs("dl", { children: [
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Shift") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: s("{value} MAD", { value: ie(y.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Slope") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: ie(y.preview.evidence.residualSlope ?? 0, 4) })
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
                                        children: s(y.isCurrent ? "Installed" : X[n.pairKey] === y.value ? "Staged" : "Use this value")
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
                            s(qe === "biological" ? "Conservative suggestions" : "Control-data suggestions"),
                            " (",
                            ke.items.length,
                            ")"
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { children: s("{evaluable} evaluable of {screened} screened pairs for {population}. Inspect before flagging.", {
                            evaluable: ke.evaluableCount.toLocaleString(),
                            screened: ke.screenedCount.toLocaleString(),
                            population: (ee == null ? void 0 : ee.name) ?? s("All Events")
                          }) })
                        ] }) }),
                        ke.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: ke.items.map((n) => {
                          const a = Ht(n, u.kind, qe);
                          return /* @__PURE__ */ e.jsxs("article", { className: Nn.has(n.pairKey) ? "is-flagged" : void 0, children: [
                            /* @__PURE__ */ e.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => Ne(n.pairKey),
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
                                      shift: ie(n.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: ie(n.evidence.residualSlope ?? 0, 4)
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
                Ot(),
                Dt()
              ]
            }
          ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: s(z ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : t.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
          (u || z) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": s("Advanced compensation tools"), children: [
            Bn.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Matrix evidence") }),
              z ? w ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-evidence-grid", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Profile ID") }),
                    /* @__PURE__ */ e.jsx("dd", { children: w.profileId })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Created") }),
                    /* @__PURE__ */ e.jsx("dd", { children: new Date(w.createdAt).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Matrix source") }),
                    /* @__PURE__ */ e.jsx("dd", { children: pa(w, s) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Orientation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("Source rows → receiver columns") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Imported dimensions") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{sources} sources × {receivers} receivers", {
                      sources: w.scientific.matrix.sourceChannels.length,
                      receivers: w.scientific.matrix.receiverChannels.length
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Applied solve") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{count} exact $PnN channels · {status}", {
                      count: z.includedPnns.length,
                      status: W.state
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Matrix hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: w.matrixHash, children: [
                      w.matrixHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Profile hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: w.profileHash, children: [
                      w.profileHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Provenance") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s(((Ks = w.provenance) == null ? void 0 : Ks.sourceDescription) ?? "No additional source note supplied") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Estimation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s(((Ls = w.provenance) == null ? void 0 : Ls.estimationMethod) ?? "Imported coefficients preserved exactly") })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-method-card", "aria-label": s("Installed compensation method"), children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Pipeline") }),
                    /* @__PURE__ */ e.jsx("strong", { children: s(w.scientific.kind === "cytof-spillover" ? "Original counts → NNLS → Compensated counts → arcsinh display" : "Original values → linear matrix inverse → Compensated values → display transform") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Solver") }),
                    /* @__PURE__ */ e.jsx("strong", { children: w.scientific.solverVersion }),
                    /* @__PURE__ */ e.jsx("small", { children: w.scientific.solverSettings.map(({ key: n, value: a }) => `${n}=${String(a)}`).join(" · ") })
                  ] })
                ] }),
                Fe && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": s("Original versus Compensated preview"), children: [
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { children: s("Original → Compensated impact") }),
                    /* @__PURE__ */ e.jsx("span", { children: s("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                      events: Fe.previewEvents.toLocaleString(),
                      channels: z.includedPnns.length
                    }) })
                  ] }) }),
                  /* @__PURE__ */ e.jsxs("dl", { children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Values changed") }),
                      /* @__PURE__ */ e.jsxs("dd", { children: [
                        Fe.changedValues.toLocaleString(),
                        " / ",
                        Fe.comparedValues.toLocaleString(),
                        " (",
                        tn(Fe.changedValues / Fe.comparedValues, !1, 4),
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Median |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: ie(Fe.medianAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Maximum |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: ie(Fe.maxAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Largest median shift") }),
                      /* @__PURE__ */ e.jsxs("dd", { title: Fe.mostChangedChannel, children: [
                        Fe.mostChangedChannel,
                        " · ",
                        ie(Fe.mostChangedChannelMedianDelta, 5)
                      ] })
                    ] }),
                    z.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Negative → zero") }),
                      /* @__PURE__ */ e.jsx("dd", { children: s("{count} preview values", { count: Fe.zeroedNegativeValues.toLocaleString() }) })
                    ] })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ e.jsx("p", { children: s("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
                profile: z.profileId,
                method: at,
                count: z.includedPnns.length,
                status: W.state
              }) }) : /* @__PURE__ */ e.jsx("p", { children: s("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
                channels: ne.channels.length,
                warnings: Kt.length || s("no")
              }) })
            ] }),
            Bn.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Review queue") }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: s("Matrix integrity") }),
                rt.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: rt.map((n) => /* @__PURE__ */ e.jsx("li", { children: s(n) }, n)) }) : /* @__PURE__ */ e.jsx("p", { children: s("No matrix-level items currently require review.") })
              ] }),
              W.state === "ready" && u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: s("Residual-evidence shortlist") }),
                /* @__PURE__ */ e.jsx("p", { children: s("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                  screened: ke.screenedCount.toLocaleString(),
                  candidateSuffix: ke.candidateCount > ke.screenedCount ? s(" of {count}", { count: ke.candidateCount.toLocaleString() }) : "",
                  zeroSuffix: u.kind === "cytof" ? s(", and new exact-zero pile") : "",
                  modeNote: s(qe === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
                }) }),
                ke.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: ke.items.map((n) => /* @__PURE__ */ e.jsxs(
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
                          shift: ie(n.evidence.normalizedNegativeShift ?? 0, 3),
                          slope: ie(n.evidence.residualSlope ?? 0, 4)
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
          Oi && u && /* @__PURE__ */ e.jsx(
            Wr,
            {
              profileLabel: (w == null ? void 0 : w.name) ?? (me ? "SCE_spillover" : "embedded_FCS"),
              installedLabel: s(
                w ? "Installed matrix" : me ? "SCE spillover matrix" : "Embedded FCS matrix"
              ),
              installedMatrix: {
                sourceChannels: u.sourceAxisKeys,
                receiverChannels: u.receiverAxisKeys,
                matrix: u.matrix
              },
              workingMatrix: Vi,
              pendingEditCount: Object.keys(X).length,
              onClose: () => us(!1)
            }
          ),
          Di && /* @__PURE__ */ e.jsx(
            Br,
            {
              sampleName: i,
              populationName: (ee == null ? void 0 : ee.name) ?? s("All Events"),
              filterLabel: js,
              pairCount: ys.length,
              onExport: dr,
              onClose: () => hs(!1)
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
function fa(t, i) {
  const r = t.visible !== !1, o = i.visible !== !1;
  return r || o ? !1 : t.sample === i.sample && t.stateKey === i.stateKey;
}
const va = N.memo(ga, fa);
export {
  va as CompensationTab
};
