import { D as ns, r as br, l as yr, s as jr, z as wr, f as Nr, u as Be, a as w, j as e, b as xe, c as re, p as tn, v as dt, d as Cr, e as Sr, g as Mr, S as Ws, h as kr, i as Bt, k as qs, F as Gs, m as Er, n as Ar, o as Tr, C as $r, q as Fr } from "./embed-odJR2giR.js";
function Zt(t) {
  const i = t.trim().normalize("NFC"), a = i.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (a)
    return { element: a[1], mass: Number(a[2]) };
  const o = i.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return o ? { element: o[2], mass: Number(o[1]) } : null;
}
function Hs(t) {
  return t.map((i, a) => ({ channel: i, index: a, isotope: Zt(i) })).sort((i, a) => i.isotope && a.isotope ? i.isotope.mass - a.isotope.mass || i.isotope.element.localeCompare(a.isotope.element) || i.index - a.index : i.isotope ? -1 : a.isotope ? 1 : i.index - a.index).map(({ index: i }) => i);
}
function Pr(t) {
  const i = Hs(t.sourceChannels), a = Hs(t.receiverChannels);
  return {
    sourceChannels: i.map((o) => t.sourceChannels[o]),
    receiverChannels: a.map((o) => t.receiverChannels[o]),
    matrix: i.map(
      (o) => a.map((l) => t.matrix[o][l])
    )
  };
}
function kn(t, i) {
  if (t === i) return "self";
  const a = Zt(t), o = Zt(i);
  if (!a || !o) return "other";
  const l = o.mass - a.mass;
  return a.element === o.element ? l === -1 ? "M-1" : l === 1 ? "M+1" : "same-element" : l === -1 ? "M-1" : l === 1 ? "M+1" : l === 16 ? "oxide (+16)" : "other";
}
function ut(t, i) {
  const a = t.index(i);
  if (a !== void 0) return a;
  const o = t.channels.findIndex((l) => l.pnn === i);
  return o < 0 ? void 0 : o;
}
function pn(t, i, a) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(i) || i <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (a && a.length !== t)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const o = a ? a.reduce((g, j) => g + (j ? 1 : 0), 0) : t, l = Math.min(o, i), h = new Uint32Array(l);
  if (l === 0) return h;
  if (!a) {
    if (l === 1) return h;
    for (let g = 0; g < l; g++)
      h[g] = Math.floor(g * (t - 1) / (l - 1));
    return h;
  }
  const p = Array.from({ length: l }, (g, j) => l === 1 ? 0 : Math.floor(j * (o - 1) / (l - 1)));
  let x = 0, v = 0;
  for (let g = 0; g < t && v < l; g++)
    a[g] && (x === p[v] && (h[v++] = g), x++);
  return h;
}
function fn(t, i) {
  if (t.length === 0) return 0;
  const a = Math.max(0, Math.min(1, i)) * (t.length - 1), o = Math.floor(a), l = Math.ceil(a);
  return o === l ? t[o] : t[o] + (t[l] - t[o]) * (a - o);
}
function ht(t) {
  const i = t.filter(Number.isFinite).sort((h, p) => h - p);
  if (i.length === 0) return [-1, 1];
  let a = fn(i, 2e-3), o = fn(i, 0.998);
  if (!(o > a)) {
    const h = Number.isFinite(a) ? a : 0, p = Math.max(1, Math.abs(h) * 0.05);
    return [h - p, h + p];
  }
  const l = (o - a) * 0.035;
  return a -= l, o += l, [a, o];
}
function Ue(t) {
  if (t.length === 0) return Number.NaN;
  const i = [...t].sort((a, o) => a - o);
  return fn(i, 0.5);
}
function pt(t) {
  if (t.length === 0) return Number.NaN;
  const i = Ue(t), a = Ue(t.map((p) => Math.abs(p - i))) * 1.4826;
  if (Number.isFinite(a) && a > 0) return a;
  const o = t.reduce((p, x) => p + x, 0) / t.length, l = t.reduce((p, x) => p + (x - o) ** 2, 0) / Math.max(1, t.length - 1), h = Math.sqrt(l);
  return Number.isFinite(h) && h > 0 ? h : 1e-12;
}
function Yt(t, i, a = 12) {
  if (t.length !== i.length || t.length < a * 8) return null;
  const o = Array.from({ length: t.length }, (x, v) => v).sort((x, v) => t[x] - t[v]), l = [];
  for (let x = 0; x < a; x++) {
    const v = Math.floor(x * o.length / a), g = Math.floor((x + 1) * o.length / a), j = o.slice(v, g);
    if (j.length < 8) continue;
    const F = Ue(j.map((S) => t[S])), T = Ue(j.map((S) => i[S]));
    Number.isFinite(F) && Number.isFinite(T) && l.push({ x: F, y: T });
  }
  const h = [];
  for (let x = 0; x < l.length; x++)
    for (let v = x + 1; v < l.length; v++) {
      const g = l[v].x - l[x].x;
      if (g === 0) continue;
      const j = (l[v].y - l[x].y) / g;
      Number.isFinite(j) && h.push(j);
    }
  const p = Ue(h);
  return Number.isFinite(p) ? p : null;
}
function Ir(t, i) {
  if (t.length !== i.length || t.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const a = Array.from({ length: t.length }, (E, R) => R).filter((E) => Number.isFinite(t[E]) && Number.isFinite(i[E])).sort((E, R) => t[E] - t[R]);
  if (a.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const o = Math.max(96, Math.floor(a.length * 0.8)), l = Math.min(a.length - 24, Math.floor(a.length * 0.9)), h = a.slice(0, o), p = a.slice(l);
  if (h.length < 96 || p.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const x = h.map((E) => t[E]), v = h.map((E) => i[E]), g = Yt(x, v, 10);
  if (g === null) return { excessMad: null, slopeDeltaMad: null };
  const j = Ue(h.map((E) => i[E] - g * t[E])), F = h.map((E) => i[E] - (j + g * t[E])), T = Math.max(
    pt(F),
    pt(v) * 0.05,
    1e-12
  ), S = p.map((E) => i[E] - (j + g * t[E])).sort((E, R) => E - R), A = fn(S, 0.75) / T, P = a.slice(Math.floor(a.length * 0.75)), I = P.map((E) => t[E]), M = P.map((E) => i[E]), k = Yt(I, M, 4), $ = fn(I, 0.9) - fn(I, 0.1), C = k === null || !($ > 0) ? null : (k - g) * $ / T;
  return {
    excessMad: Number.isFinite(A) ? A : null,
    slopeDeltaMad: Number.isFinite(C) ? C : null
  };
}
function bi(t, i, a, o, l, h) {
  const p = a.length, x = Ir(a, o), v = Math.min(50, Math.max(12, Math.floor(p * 0.01))), g = (U = 0, q = 0, s = 0) => ({
    status: "insufficient",
    sourceLowEvents: U,
    sourceHighEvents: q,
    destinationNegativeEvents: s,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: x.excessMad,
    upperTailSlopeDeltaMad: x.slopeDeltaMad,
    receiverZeroDeltaFraction: p > 0 ? (h - l) / p : 0
  });
  if (p < v * 3) return g();
  const j = [...a].sort((U, q) => U - q), F = fn(j, 0.25), T = a.flatMap((U, q) => U <= F ? [q] : []);
  if (T.length < v) return g(T.length);
  const S = T.map((U) => a[U]), A = Ue(S), P = pt(S);
  let I = a.flatMap((U, q) => U >= A + 3 * P ? [q] : []);
  if (I.length < v && (I = Array.from({ length: p }, (U, q) => q).sort((U, q) => a[q] - a[U]).slice(0, v)), I.length < v) return g(T.length, I.length);
  const M = T.map((U) => o[U]), k = Ue(M), $ = pt(M), C = k + 5 * $, E = o.flatMap((U, q) => U <= C ? [q] : []), R = new Set(E), K = T.filter((U) => R.has(U)), D = I.filter((U) => R.has(U));
  if (K.length < v || D.length < v)
    return g(T.length, I.length, E.length);
  const V = (Ue(D.map((U) => o[U])) - Ue(K.map((U) => o[U]))) / $, W = E.map((U) => t[U]), Z = E.map((U) => i[U]);
  return {
    status: "ready",
    sourceLowEvents: T.length,
    sourceHighEvents: I.length,
    destinationNegativeEvents: E.length,
    normalizedNegativeShift: Number.isFinite(V) ? V : null,
    residualSlope: Yt(W, Z),
    upperTailExcessMad: x.excessMad,
    upperTailSlopeDeltaMad: x.slopeDeltaMad,
    receiverZeroDeltaFraction: p > 0 ? (h - l) / p : 0
  };
}
function mt(t, i, a, o, l, h) {
  let p = 0, x = 0, v = 0;
  for (let g = 0; g < a.length; g++) {
    const j = Math.abs(a[g]) <= 1e-12, F = Math.abs(o[g]) <= 1e-12;
    j && p++, F && x++, j && F && v++;
  }
  return {
    x: t.map((g) => Math.max(l[0], Math.min(l[1], g))),
    y: i.map((g) => Math.max(h[0], Math.min(h[1], g))),
    zeroPile: Object.freeze({
      source: p,
      receiver: x,
      corner: v
    })
  };
}
function Vt(t, i, a, o = {}) {
  var U;
  if (t.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation to compare Original and Compensated data." };
  const h = ut(t, i), p = ut(t, a);
  if (h === void 0 || p === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (t.fcs.nEvents === 0)
    return { ready: !1, reason: "This sample contains no events." };
  const x = ((U = o.fixedEventIndices) == null ? void 0 : U.slice()) ?? pn(
    t.fcs.nEvents,
    o.maxEvents ?? 15e3,
    o.eventMask
  );
  for (const q of x)
    if (q >= t.fcs.nEvents || o.eventMask && !o.eventMask[q])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const v = t.channels[h].key, g = t.channels[p].key, j = t.originalColumnData(h), F = t.originalColumnData(p), T = t.compensatedColumnData(h), S = t.compensatedColumnData(p), A = [], P = [], I = [], M = [], k = [], $ = [], C = [], E = [];
  for (const q of x) {
    const s = t.rawToDisplay(v, j[q]), G = t.rawToDisplay(g, F[q]), Re = t.rawToDisplay(v, T[q]), z = t.rawToDisplay(g, S[q]);
    [s, G, Re, z].every(Number.isFinite) && (A.push(s), P.push(G), I.push(j[q]), M.push(F[q]), k.push(Re), $.push(z), C.push(T[q]), E.push(S[q]));
  }
  const R = ht([...A, ...k]), K = ht([...P, ...$]), D = t.channelTicks(h, [R[0], R[1]]), V = t.channelTicks(p, [K[0], K[1]]), W = mt(
    A,
    P,
    I,
    M,
    R,
    K
  ), Z = mt(
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
      totalEvents: o.eventMask ? o.eligibleEventCount ?? o.eventMask.reduce((q, s) => q + (s ? 1 : 0), 0) : t.fcs.nEvents,
      xRange: R,
      yRange: K,
      xTicks: D,
      yTicks: V,
      original: W,
      compensated: Z,
      evidence: bi(
        C,
        E,
        k,
        $,
        W.zeroPile.receiver,
        Z.zeroPile.receiver
      )
    }
  };
}
function Wt(t, i, a, o, l, h, p = {}) {
  const x = ut(t, i), v = ut(t, a);
  if (x === void 0 || v === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (l.length !== o.length || h.length !== o.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const g = t.channels[x].key, j = t.channels[v].key, F = t.originalColumnData(x), T = t.originalColumnData(v), S = [], A = [], P = [], I = [], M = [], k = [], $ = [], C = [];
  for (let Z = 0; Z < o.length; Z++) {
    const U = o[Z];
    if (U >= t.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const q = F[U], s = T[U], G = l[Z], Re = h[Z], z = t.rawToDisplay(g, q), N = t.rawToDisplay(j, s), ne = t.rawToDisplay(g, G), me = t.rawToDisplay(j, Re);
    [q, s, G, Re, z, N, ne, me].every(Number.isFinite) && (S.push(z), A.push(N), P.push(q), I.push(s), M.push(ne), k.push(me), $.push(G), C.push(Re));
  }
  const E = p.xRange ?? ht([...S, ...M]), R = p.yRange ?? ht([...A, ...k]), K = t.channelTicks(x, [E[0], E[1]]), D = t.channelTicks(v, [R[0], R[1]]), V = mt(S, A, P, I, E, R), W = mt(M, k, $, C, E, R);
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
      compensated: W,
      evidence: bi(
        $,
        C,
        M,
        k,
        V.zeroPile.receiver,
        W.zeroPile.receiver
      )
    }
  };
}
const Zs = 0.5, Rr = 0.01, Kr = 1e-4, Lr = 0.05, Or = 3, Dr = 1, zr = 5;
function yi(t, i) {
  const a = t.evidence.normalizedNegativeShift ?? 0, o = t.evidence.residualSlope ?? 0, l = Math.max(0, t.evidence.upperTailExcessMad ?? 0), h = Math.max(0, t.evidence.upperTailSlopeDeltaMad ?? 0), p = Math.abs(t.coefficient), x = Math.max(
    Kr,
    p * Lr
  );
  return {
    negativeShift: Math.max(0, -a),
    negativeSlope: Math.max(0, -o),
    zeroDelta: i === "cytof" ? Math.max(0, t.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, a),
    positiveSlope: Math.max(0, o),
    upperTailExcess: l,
    upperTailSlopeDelta: h,
    hasNegativeShift: a <= -Zs,
    hasNegativeSlope: o <= -x,
    hasNewZeroPile: i === "cytof" && t.evidence.receiverZeroDeltaFraction >= Rr,
    hasPositiveShift: a >= Zs,
    hasPositiveSlope: o >= x,
    hasHighTailCurve: l >= Or && (h >= Dr || l >= zr)
  };
}
function _r(t) {
  return Number(t.hasNegativeShift) + Number(t.hasNegativeSlope) + Number(t.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : t.hasNewZeroPile ? "new-zero-pile" : t.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function Xt(t, i, a = "biological") {
  const o = yi(t, i), l = o.hasNegativeShift || o.hasNegativeSlope || o.hasNewZeroPile, h = o.hasPositiveShift || o.hasPositiveSlope, p = o.hasHighTailCurve || a === "control" && h;
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
    reason: _r(o),
    automaticFollowup: !0
  } : o.hasHighTailCurve ? a === "control" ? {
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
  } : h ? a === "control" ? {
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
  const a = i.filter((l) => Number.isFinite(l) && l > 0).sort((l, h) => l - h);
  if (a.length === 0) return 0;
  let o = 0;
  for (const l of a)
    if (l <= t) o++;
    else break;
  return o / a.length;
}
function Ur(t, i, a = "biological") {
  const o = t.map((A) => ({
    ...yi(A, i),
    coefficient: Math.abs(A.coefficient)
  })), l = (A) => o.map((P) => typeof P[A] == "number" ? P[A] : 0), h = l("negativeShift"), p = l("negativeSlope"), x = l("zeroDelta"), v = l("positiveShift"), g = l("positiveSlope"), j = l("upperTailExcess"), F = l("upperTailSlopeDelta"), T = l("coefficient"), S = t.flatMap((A, P) => {
    const I = Xt(A, i, a);
    if (!I.automaticFollowup || I.reason === null) return [];
    const M = o[P], k = 0.22 * nn(M.negativeShift, h) + 0.13 * nn(M.negativeSlope, p) + 0.14 * nn(M.zeroDelta, x) + (a === "control" ? 0.13 * nn(M.positiveShift, v) : 0) + (a === "control" ? 0.08 * nn(M.positiveSlope, g) : 0) + 0.12 * nn(M.upperTailExcess, j) + 0.08 * nn(M.upperTailSlopeDelta, F) + 0.05 * nn(M.coefficient, T) + 0.05 * Math.max(0, Math.min(1, A.physicalPrior));
    return [{
      index: P,
      relativePriority: k,
      reason: I.reason,
      category: I.category
    }];
  });
  return Object.freeze(S.sort((A, P) => P.relativePriority - A.relativePriority || A.index - P.index));
}
function Br(t, i) {
  const a = t.index(i);
  if (a !== void 0) return a;
  const o = t.channels.findIndex((l) => l.pnn === i);
  return o < 0 ? void 0 : o;
}
function Jt(t, i) {
  if (t.length === 0) return 0;
  const a = Math.max(0, Math.min(1, i)) * (t.length - 1), o = Math.floor(a), l = Math.ceil(a);
  return o === l ? t[o] : t[o] + (t[l] - t[o]) * (a - o);
}
function Vr(t) {
  const i = t.filter(Number.isFinite).sort((h, p) => h - p);
  if (i.length === 0) return [-1, 1];
  let a = Jt(i, 2e-3), o = Jt(i, 0.998);
  if (!(o > a)) {
    const h = Number.isFinite(a) ? a : 0, p = Math.max(1, Math.abs(h) * 0.05);
    return [h - p, h + p];
  }
  const l = (o - a) * 0.035;
  return a -= l, o += l, [a, o];
}
function Wr(t) {
  if (t.length === 0) return "0:empty";
  let i = 2166136261;
  for (const a of t)
    i ^= a, i = Math.imul(i, 16777619) >>> 0;
  return `${t.length}:${t[0]}:${t[t.length - 1]}:${i.toString(16)}`;
}
function qr(t, i, a = {}) {
  var x;
  if (t.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const l = ((x = a.fixedEventIndices) == null ? void 0 : x.slice()) ?? pn(
    t.fcs.nEvents,
    a.maxEvents ?? 2500,
    a.eventMask
  );
  for (const v of l)
    if (v >= t.fcs.nEvents || a.eventMask && !a.eventMask[v])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const h = /* @__PURE__ */ new Map();
  for (const v of Array.from(new Set(i))) {
    const g = Br(t, v);
    if (g === void 0) continue;
    const j = t.channels[g], F = t.originalColumnData(g), T = t.compensatedColumnData(g), S = new Float64Array(l.length), A = new Float64Array(l.length), P = new Float64Array(l.length), I = new Float64Array(l.length), M = [];
    for (let C = 0; C < l.length; C++) {
      const E = l[C], R = F[E], K = T[E], D = t.rawToDisplay(j.key, R), V = t.rawToDisplay(j.key, K);
      S[C] = R, A[C] = K, P[C] = D, I[C] = V, Number.isFinite(D) && M.push(D), Number.isFinite(V) && M.push(V);
    }
    const k = Vr(M), $ = Object.freeze({
      key: j.key,
      pnn: j.pnn,
      range: k,
      ticks: t.channelTicks(g, [k[0], k[1]]),
      originalRaw: S,
      compensatedRaw: A,
      originalDisplay: P,
      compensatedDisplay: I
    });
    h.set(v, $), h.set(j.key, $), h.set(j.pnn, $);
  }
  const p = a.eventMask ? a.eligibleEventCount ?? a.eventMask.reduce((v, g) => v + (g ? 1 : 0), 0) : t.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: l,
      eventSignature: Wr(l),
      eligibleEventCount: p,
      channels: h
    })
  };
}
function Ys(t, i, a, o, l, h, p) {
  const x = [], v = [];
  let g = 0, j = 0, F = 0;
  for (const T of l) {
    x.push(Math.max(h[0], Math.min(h[1], t[T]))), v.push(Math.max(p[0], Math.min(p[1], i[T])));
    const S = Math.abs(a[T]) <= 1e-12, A = Math.abs(o[T]) <= 1e-12;
    S && g++, A && j++, S && A && F++;
  }
  return {
    x,
    y: v,
    zeroPile: Object.freeze({ source: g, receiver: j, corner: F })
  };
}
function ji(t, i, a) {
  const o = t.channels.get(i), l = t.channels.get(a);
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
      original: Ys(
        o.originalDisplay,
        l.originalDisplay,
        o.originalRaw,
        l.originalRaw,
        h,
        o.range,
        l.range
      ),
      compensated: Ys(
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
function Xs(t, i, a, o, l) {
  const h = Math.max(1, Math.min(24, Math.round(l) || 3)), p = 256, x = h, v = p + 2 * x, g = new Float64Array(v * v), j = Math.max(1e-12, i[1] - i[0]), F = Math.max(1e-12, a[1] - a[0]);
  for (let M = 0; M < t.x.length; M++) {
    const k = Math.max(0, Math.min(
      v - 1,
      Math.floor((t.x[M] - i[0]) / j * p) + x
    )), $ = Math.max(0, Math.min(
      v - 1,
      Math.floor((t.y[M] - a[0]) / F * p) + x
    ));
    g[$ * v + k]++;
  }
  const T = new Float64Array(v * v), S = (h * 2 + 1) ** 2, A = v + 1, P = new Float64Array(A * A);
  for (let M = 0; M < v; M++) {
    let k = 0;
    for (let $ = 0; $ < v; $++)
      k += g[M * v + $], P[(M + 1) * A + $ + 1] = P[M * A + $ + 1] + k;
  }
  for (let M = h; M < v - h; M++) {
    const k = M - h, $ = M + h + 1;
    for (let C = h; C < v - h; C++) {
      const E = C - h, R = C + h + 1, K = P[$ * A + R] - P[k * A + R] - P[$ * A + E] + P[k * A + E];
      T[M * v + C] = K / S;
    }
  }
  const I = [];
  for (let M = x; M < x + p; M++)
    for (let k = x; k < x + p; k++) {
      const $ = T[M * v + k];
      $ > 0 && I.push($);
    }
  return I.sort((M, k) => M - k), I.length === 0 ? 1 : Math.max(1e-12, Jt(I, o));
}
function ts(t, i) {
  const a = Math.max(1, Math.min(10, Number.isFinite(t) ? t : 6)), o = Math.max(1, (Number.isFinite(i) ? i : 220) - 50);
  return Math.max(1, Math.min(24, a * 170 / o));
}
function ss(t, i = 0.95, a = 3, o = ns) {
  const l = Math.max(
    Xs(t.original, t.xRange, t.yRange, i, a),
    Xs(t.compensated, t.xRange, t.yRange, i, a)
  );
  return br(l, o);
}
function gt(t, i) {
  const a = i.size / 220, o = Math.sqrt(a), l = Math.max(9, Math.min(12, 11 * o)), h = Math.max(10, Math.min(13, 12 * o));
  yr().renderMiniPlot(t, {
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
    point_size: Math.max(0.55, Math.min(1.2, 1.15 * a)) * (i.pointSize ?? 1),
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
const mn = "http://www.w3.org/2000/svg", Un = 6, gn = 1123, Bn = 794;
function wi(t) {
  return Math.ceil(Math.max(0, Math.floor(t)) / Un);
}
function Js(t) {
  return t.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function Ni(t, i) {
  return `gatelab-compensation-${Js(t.replace(/\.[^.]+$/, ""))}-${Js(i)}`;
}
function Qt(t, i, a, o) {
  const l = Ni(t, i);
  return a === "pdf" || o <= 1 ? `${l}.${a}` : `${l}-${a}-pages.zip`;
}
function En(t, i, a, o, l = {}) {
  const h = document.createElementNS(mn, "text");
  return h.setAttribute("x", String(a)), h.setAttribute("y", String(o)), h.setAttribute("font-family", "Arial, Helvetica, sans-serif"), h.setAttribute("font-size", String(l.size ?? 10)), h.setAttribute("font-weight", String(l.weight ?? 400)), h.setAttribute("fill", l.fill ?? "#253247"), l.anchor && h.setAttribute("text-anchor", l.anchor), h.textContent = i, t.appendChild(h), h;
}
function Qs(t, i) {
  return t.length <= i ? t : `${t.slice(0, Math.max(1, i - 1))}…`;
}
function ei(t, i, a, o, l, h, p, x, v, g, j, F) {
  const T = document.createElement("div");
  gt(T, {
    title: o === "original" ? "Original" : "Compensated",
    panel: a[o],
    preview: a,
    sourceLabel: i.sourceLabel,
    receiverLabel: i.receiverLabel,
    size: p,
    densityColorCeiling: v,
    densitySmoothingRadius: x,
    densityColorPower: g,
    pointAlpha: j,
    pointSize: F,
    canvasScale: 300 / 96
  });
  const S = T.querySelector("canvas"), A = T.querySelector("svg");
  if (!S || !A) throw new Error("GateLab could not render a compensation export panel.");
  const P = document.createElementNS(mn, "g");
  P.setAttribute("transform", `translate(${l},${h})`);
  const I = document.createElementNS(mn, "image");
  I.setAttribute("x", "0"), I.setAttribute("y", "0"), I.setAttribute("width", String(p)), I.setAttribute("height", String(p)), I.setAttribute("href", S.toDataURL("image/png")), P.appendChild(I), P.appendChild(A.cloneNode(!0)), t.appendChild(P);
}
function ni(t, i, a, o) {
  const l = document.createElementNS(mn, "svg");
  l.setAttribute("xmlns", mn), l.setAttribute("width", String(gn)), l.setAttribute("height", String(Bn)), l.setAttribute("viewBox", `0 0 ${gn} ${Bn}`);
  const h = document.createElementNS(mn, "rect");
  h.setAttribute("width", "100%"), h.setAttribute("height", "100%"), h.setAttribute("fill", "#ffffff"), l.appendChild(h), En(l, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), En(
    l,
    Qs(`${i.sampleName} · ${i.populationName} · ${i.profileName} · ${i.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), En(l, `Page ${a + 1} of ${o}`, gn - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const p = 28, x = 18, v = 53, g = 771, j = (gn - p * 2 - x) / 2, F = (g - v) / 3, T = 204, S = 12, A = T * 2 + S;
  return t.forEach((P, I) => {
    const M = P.buildPreview(), k = ts(i.densitySmoothing, T), $ = ss(
      M,
      0.95,
      k,
      i.densityColorPower
    ), C = I % 2, E = Math.floor(I / 2), R = p + C * (j + x), K = v + E * F, D = R + (j - A) / 2, V = K + 25, W = P.relationship && P.relationship !== "other" ? ` · ${P.relationship}` : "";
    if (En(
      l,
      Qs(`${P.sourceLabel} → ${P.receiverLabel}`, 58),
      R + 5,
      K + 14,
      { size: 10.5, weight: 700 }
    ), En(
      l,
      `matrix ${(P.coefficient * 100).toFixed(1)}%${W}`,
      R + j - 5,
      K + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), ei(l, P, M, "original", D, V, T, k, $, i.densityColorPower, i.pointAlpha, i.pointSize ?? 1), ei(l, P, M, "compensated", D + T + S, V, T, k, $, i.densityColorPower, i.pointAlpha, i.pointSize ?? 1), E < 2) {
      const Z = document.createElementNS(mn, "line");
      Z.setAttribute("x1", String(R)), Z.setAttribute("x2", String(R + j)), Z.setAttribute("y1", String(K + F - 3)), Z.setAttribute("y2", String(K + F - 3)), Z.setAttribute("stroke", "#e6eaf0"), Z.setAttribute("stroke-width", "1"), l.appendChild(Z);
    }
  }), En(
    l,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), l;
}
function ti(t) {
  return Nr(t, { widthPx: gn, heightPx: Bn }), `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(t)}`;
}
async function si(t, i = 300) {
  const a = URL.createObjectURL(new Blob([t], { type: "image/svg+xml" }));
  try {
    const o = await new Promise((x, v) => {
      const g = new Image();
      g.onload = () => x(g), g.onerror = () => v(new Error("GateLab could not rasterize the compensation export page.")), g.src = a;
    }), l = Math.max(1, i / 96), h = document.createElement("canvas");
    h.width = Math.round(gn * l), h.height = Math.round(Bn * l);
    const p = h.getContext("2d");
    if (!p) throw new Error("Canvas export is unavailable in this browser.");
    return p.fillStyle = "#ffffff", p.fillRect(0, 0, h.width, h.height), p.scale(l, l), p.drawImage(o, 0, 0, gn, Bn), await new Promise((x, v) => {
      h.toBlob((g) => g ? x(g) : v(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(a);
  }
}
function ii(t, i) {
  const a = URL.createObjectURL(t), o = document.createElement("a");
  o.href = a, o.download = i, document.body.appendChild(o), o.click(), o.remove(), setTimeout(() => URL.revokeObjectURL(a), 1e3);
}
function Gr(t, i, a, o) {
  const l = Math.max(2, String(a).length);
  return `${t}-page-${String(i + 1).padStart(l, "0")}.${o}`;
}
async function Hr(t, i, a, o) {
  const l = wi(t.length);
  if (l === 0) throw new Error("No compensation pairs are available to export.");
  const h = Ni(i.sampleName, i.populationName);
  if (a === "pdf") {
    const { jsPDF: g } = await import("./jspdf.es.min-qhgnWJuY.js").then((S) => S.j), j = new g({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), F = j.internal.pageSize.getWidth(), T = j.internal.pageSize.getHeight();
    for (let S = 0; S < l; S++) {
      S > 0 && j.addPage("a4", "landscape");
      const A = t.slice(
        S * Un,
        (S + 1) * Un
      ), P = ti(ni(A, i, S, l)), I = await si(P), M = await new Promise((k, $) => {
        const C = new FileReader();
        C.onload = () => k(String(C.result)), C.onerror = () => $(C.error ?? new Error("GateLab could not read an export page.")), C.readAsDataURL(I);
      });
      j.addImage(M, "PNG", 0, 0, F, T, void 0, "FAST"), o == null || o({ completedPages: S + 1, totalPages: l }), await new Promise((k) => setTimeout(k, 0));
    }
    j.save(Qt(i.sampleName, i.populationName, a, l));
    return;
  }
  const p = {};
  let x = null;
  for (let g = 0; g < l; g++) {
    const j = t.slice(
      g * Un,
      (g + 1) * Un
    ), F = ti(ni(j, i, g, l)), T = Gr(h, g, l, a);
    if (a === "svg") {
      const S = jr(F);
      p[T] = S, l === 1 && (x = new Blob([S], { type: "image/svg+xml" }));
    } else {
      const S = await si(F), A = new Uint8Array(await S.arrayBuffer());
      p[T] = A, l === 1 && (x = S);
    }
    o == null || o({ completedPages: g + 1, totalPages: l }), await new Promise((S) => setTimeout(S, 0));
  }
  const v = Qt(
    i.sampleName,
    i.populationName,
    a,
    l
  );
  ii(l === 1 && x ? x : new Blob([wr(p, { level: 6 })], { type: "application/zip" }), v);
}
const Zr = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function Yr({
  sampleName: t,
  populationName: i,
  filterLabel: a,
  pairCount: o,
  onExport: l,
  onClose: h
}) {
  const { t: p } = Be(), [x, v] = w.useState("pdf"), [g, j] = w.useState(null), [F, T] = w.useState(null), S = wi(o), A = g !== null && g.completedPages < g.totalPages, P = Qt(t, i, x, S), I = async () => {
    T(null), j({ completedPages: 0, totalPages: S });
    try {
      await l(x, j), h();
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
          Zr.map((k) => /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-comparison-export-format",
                value: k.format,
                checked: x === k.format,
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
            /* @__PURE__ */ e.jsx("dd", { title: P, children: P })
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
            /* @__PURE__ */ e.jsx("dd", { title: a, children: a })
          ] })
        ] }),
        g && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-comparison-export-progress", role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, g.totalPages), value: g.completedPages }),
          /* @__PURE__ */ e.jsx("span", { children: p("Rendering page {current} of {total}", { current: Math.min(g.completedPages + 1, g.totalPages), total: g.totalPages }) })
        ] }),
        F && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: p(F) }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: A, onClick: h, children: p("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: A || S === 0, onClick: () => void I(), children: A ? p("Rendering…") : p("Download {format}", { format: x.toUpperCase() }) })
        ] })
      ]
    }
  ) });
}
function ri(t) {
  return `"${t.replaceAll('"', '""')}"`;
}
function ai(t, i) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error(`The ${i} channel axis is empty.`);
  const a = t.map((o, l) => {
    if (typeof o != "string" || o.trim().length === 0)
      throw new Error(`The ${i} channel at position ${l + 1} is blank or invalid.`);
    return o.trim().normalize("NFC");
  });
  if (new Set(a).size !== a.length)
    throw new Error(`The ${i} channel axis contains duplicate identities.`);
  return a;
}
function Xr(t) {
  const i = ai(t.sourceChannels, "source"), a = ai(t.receiverChannels, "receiver");
  if (!Array.isArray(t.matrix) || t.matrix.length !== i.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const o = [
    ["channel", ...a].map(ri).join(",")
  ];
  return t.matrix.forEach((l, h) => {
    if (!Array.isArray(l) || l.length !== a.length)
      throw new Error(
        `Spill matrix row ${h + 1} does not match the receiver channel axis.`
      );
    const p = l.map((x, v) => {
      if (typeof x != "number" || !Number.isFinite(x))
        throw new Error(
          `Spill coefficient ${i[h]} → ${a[v]} is not finite.`
        );
      return Object.is(x, -0) ? "0" : String(x);
    });
    o.push([ri(i[h]), ...p].join(","));
  }), `${o.join(`
`)}
`;
}
function Jr(t, i = "installed") {
  return `${t.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${i === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function Qr(t) {
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
function ea({
  profileLabel: t,
  installedLabel: i,
  installedMatrix: a,
  workingMatrix: o = null,
  pendingEditCount: l = 0,
  onClose: h
}) {
  const { t: p } = Be(), [x, v] = w.useState("installed"), [g, j] = w.useState(null), F = x === "working" && o ? o : a, T = Jr(t, x), S = w.useMemo(
    () => Qr(T),
    [T]
  ), A = () => {
    j(null);
    try {
      const M = Xr(F), k = URL.createObjectURL(new Blob([M], { type: "text/csv;charset=utf-8" })), $ = document.createElement("a");
      $.href = k, $.download = T, document.body.appendChild($), $.click(), $.remove(), setTimeout(() => URL.revokeObjectURL(k), 1e3);
    } catch (M) {
      j(M instanceof Error ? M.message : String(M));
    }
  }, P = async () => {
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
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => void P(), children: p("Copy R code") })
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
  scrubStep: a,
  className: o = "",
  disabled: l,
  min: h,
  max: p,
  step: x,
  title: v,
  onPointerDown: g,
  onPointerMove: j,
  onPointerUp: F,
  onPointerCancel: T,
  onLostPointerCapture: S,
  ...A
}) {
  const { t: P } = Be(), I = w.useRef(null), [M, k] = w.useState(!1), $ = (C) => {
    var E, R, K;
    ((E = I.current) == null ? void 0 : E.pointerId) === C.pointerId && (I.current = null, k(!1), (K = (R = C.currentTarget).hasPointerCapture) != null && K.call(R, C.pointerId) && C.currentTarget.releasePointerCapture(C.pointerId));
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
      step: x,
      title: v ?? P("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (C) => i(C.currentTarget.value),
      onPointerDown: (C) => {
        var W, Z;
        if (g == null || g(C), C.defaultPrevented || l || C.button !== 0) return;
        const E = C.currentTarget.getBoundingClientRect();
        if (C.clientX >= E.right - 18) return;
        const R = Number(t), K = (a ?? Number(x)) || 0.1;
        if (!Number.isFinite(R) || !(K > 0)) return;
        const D = String(K), V = D.includes("e-") ? Number(D.split("e-")[1]) : D.includes(".") ? D.split(".")[1].length : 0;
        I.current = {
          pointerId: C.pointerId,
          startY: C.clientY,
          startValue: R,
          step: K,
          decimals: V,
          lastSteps: 0
        }, (Z = (W = C.currentTarget).setPointerCapture) == null || Z.call(W, C.pointerId);
      },
      onPointerMove: (C) => {
        j == null || j(C);
        const E = I.current;
        if (!E || E.pointerId !== C.pointerId) return;
        const R = E.startY - C.clientY;
        if (Math.abs(R) < 3) return;
        const K = R > 0 ? Math.floor(R / 4) : Math.ceil(R / 4);
        if (K === E.lastSteps) return;
        let D = E.startValue + K * E.step;
        const V = h === void 0 ? Number.NEGATIVE_INFINITY : Number(h), W = p === void 0 ? Number.POSITIVE_INFINITY : Number(p);
        Number.isFinite(V) && (D = Math.max(V, D)), Number.isFinite(W) && (D = Math.min(W, D)), I.current = { ...E, lastSteps: K }, k(!0), i(D.toFixed(Math.min(10, E.decimals))), C.preventDefault();
      },
      onPointerUp: (C) => {
        F == null || F(C), $(C);
      },
      onPointerCancel: (C) => {
        T == null || T(C), $(C);
      },
      onLostPointerCapture: (C) => {
        var E;
        S == null || S(C), ((E = I.current) == null ? void 0 : E.pointerId) === C.pointerId && (I.current = null, k(!1));
      }
    }
  );
}
const is = w.createContext(ns), rs = w.createContext(0.85), as = w.createContext(1), oi = "", ct = [];
let qt = !1;
function na(t) {
  const i = { cancelled: !1, run: t };
  ct.push(i);
  const a = () => {
    if (qt) return;
    qt = !0;
    const o = () => {
      qt = !1;
      let h = ct.shift();
      for (; h != null && h.cancelled; ) h = ct.shift();
      h == null || h.run(), ct.length > 0 && a();
    }, l = window;
    typeof l.requestIdleCallback == "function" ? l.requestIdleCallback(o, { timeout: 50 }) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(o) : setTimeout(o, 0);
  };
  return a(), () => {
    i.cancelled = !0;
  };
}
function ft({
  title: t,
  panel: i,
  preview: a,
  sourceLabel: o,
  receiverLabel: l,
  minimumSize: h = 210,
  maximumSize: p = 420,
  densityColorCeiling: x,
  densitySmoothing: v,
  showZeroPile: g = !0
}) {
  const { t: j } = Be(), F = w.useContext(is), T = w.useContext(rs), S = w.useContext(as), A = w.useRef(null);
  w.useEffect(() => {
    const M = A.current;
    if (!M) return;
    let k = null, $ = 0;
    const C = () => {
      var W;
      k = null;
      const K = ((W = M.parentElement) == null ? void 0 : W.clientWidth) ?? 230, D = Math.max(h, Math.min(p, Math.floor(K)));
      if (D === $ && M.childElementCount > 0) return;
      $ = D;
      const V = ts(v, D);
      gt(M, {
        title: t,
        panel: i,
        preview: a,
        sourceLabel: o,
        receiverLabel: l,
        size: D,
        densityColorCeiling: x ?? ss(
          a,
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
  }, [x, F, v, p, h, i, T, S, a, l, o, t]);
  const P = (M) => a.eventCount > 0 ? `${(M / a.eventCount * 100).toFixed(1)}%` : "0.0%", I = i.zeroPile.source > 0 || i.zeroPile.receiver > 0 || i.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": j("{title} density biplot; {source} on x, {receiver} on y", {
    title: t,
    source: o,
    receiver: l
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: A, className: "gl-comp-biplot-surface" }),
    g && I && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: j("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: P(i.zeroPile.source),
      receiver: P(i.zeroPile.receiver),
      both: P(i.zeroPile.corner)
    }) })
  ] });
}
function ta({
  title: t,
  preview: i,
  sourceLabel: a,
  receiverLabel: o,
  minimumSize: l,
  maximumSize: h,
  densityColorCeiling: p,
  densitySmoothing: x
}) {
  const { t: v } = Be(), g = w.useContext(is), j = w.useContext(rs), F = w.useContext(as), T = w.useRef(null);
  return w.useEffect(() => {
    const S = T.current;
    if (!S) return;
    let A = null, P = 0;
    const I = () => {
      var Z;
      A = null;
      const $ = ((Z = S.parentElement) == null ? void 0 : Z.clientWidth) ?? l, C = Math.max(l, Math.min(h, Math.floor($)));
      if (C === P && S.dataset.cacheReady === "true") return;
      P = C, S.dataset.cacheReady = "false";
      const E = ts(x, C), R = p ?? ss(
        i,
        0.95,
        E,
        g
      );
      gt(S, {
        title: t,
        panel: i.original,
        preview: i,
        sourceLabel: a,
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
      gt(V, {
        title: t,
        panel: i.compensated,
        preview: i,
        sourceLabel: a,
        receiverLabel: o,
        size: C,
        densityColorCeiling: R,
        densitySmoothingRadius: E,
        densityColorPower: g,
        pointAlpha: j,
        pointSize: F,
        canvasScale: 2
      });
      const W = V.querySelector("canvas");
      !K || !W || !D || (K.classList.add("gl-comp-cached-canvas", "is-original"), K.dataset.assayLayer = "original", W.classList.add("gl-comp-cached-canvas", "is-compensated"), W.dataset.assayLayer = "compensated", S.insertBefore(W, D), S.dataset.cacheReady = "true");
    }, M = () => {
      A == null || A(), A = na(I);
    };
    M();
    const k = typeof ResizeObserver > "u" ? null : new ResizeObserver(M);
    return k == null || k.observe(S.parentElement ?? S), () => {
      k == null || k.disconnect(), A == null || A();
    };
  }, [p, g, x, h, l, j, F, i, o, a, t]), /* @__PURE__ */ e.jsx(
    "figure",
    {
      className: "gl-comp-biplot",
      "aria-label": v("Cached uncompensated and compensated density biplot; {source} on x, {receiver} on y", {
        source: a,
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
function li({
  preview: t,
  sourceLabel: i,
  receiverLabel: a,
  kind: o,
  densitySmoothing: l,
  compact: h = !1,
  compensatedTitle: p = "Compensated"
}) {
  const { t: x } = Be(), v = t.eventCount > 0 ? t.original.zeroPile.receiver / t.eventCount * 100 : 0, g = t.eventCount > 0 ? t.compensated.zeroPile.receiver / t.eventCount * 100 : 0, j = g - v;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${h ? " is-compact" : ""}`, children: [
    !h && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: x("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: t.eventCount.toLocaleString(),
      sampled: t.totalEvents > t.eventCount ? x(" sampled from {total}", { total: t.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        ft,
        {
          title: x("Original"),
          panel: t.original,
          preview: t,
          sourceLabel: i,
          receiverLabel: a,
          densitySmoothing: l,
          showZeroPile: !h
        }
      ),
      /* @__PURE__ */ e.jsx(
        ft,
        {
          title: p,
          panel: t.compensated,
          preview: t,
          sourceLabel: i,
          receiverLabel: a,
          densitySmoothing: l,
          showZeroPile: !h
        }
      )
    ] }),
    !h && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-diagnostic-note", children: o === "cytof" ? /* @__PURE__ */ e.jsx(e.Fragment, { children: x("Receiver events at exact zero: {original}% → {compensated}% ({delta} percentage points). A rise can be consistent with NNLS over-subtraction, while a residual source-associated rise can be consistent with under-compensation. Neither is a verdict without a suitable negative/control population.", {
      original: v.toFixed(1),
      compensated: g.toFixed(1),
      delta: `${j >= 0 ? "+" : ""}${j.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: x("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: p
    }) }) }),
    !h && (t.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": x("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: x("{value} MAD", { value: re(t.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: re(t.evidence.residualSlope ?? 0, 4) })
      ] }),
      t.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: x("{value} MAD", { value: re(t.evidence.upperTailExcessMad, 3) }) })
      ] }),
      t.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: x("{value} MAD", { value: re(t.evidence.upperTailSlopeDeltaMad, 3) }) })
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
function sa({
  matrixView: t,
  sourceChannels: i,
  receiverChannels: a,
  selectedSourceIndex: o,
  selectedReceiverIndex: l,
  stagedCoefficients: h,
  maximumAbsoluteOffDiagonal: p,
  onSelect: x
}) {
  const { t: v } = Be(), g = 6, j = 74, F = 44, T = 10, S = a.length * g, A = i.length * g, P = j + S + j, I = F + A + T, M = w.useMemo(() => {
    const $ = [];
    for (let C = 0; C < t.matrix.length; C++)
      for (let E = 0; E < t.matrix[C].length; E++) {
        const R = t.sourceAxisKeys[C], K = t.receiverAxisKeys[E], D = `${R}${oi}${K}`, V = h[D] ?? t.matrix[C][E], W = R === K;
        if (!W && (!Number.isFinite(V) || V === 0)) continue;
        const Z = p > 0 && Number.isFinite(V) ? Math.min(1, Math.abs(V) / p) : 0, U = Z > 0 ? 0.12 + 0.82 * Math.sqrt(Z) : 0;
        $.push({
          sourceIndex: C,
          receiverIndex: E,
          pairKey: D,
          value: V,
          diagonal: W,
          fill: W ? "#cfd4db" : Number.isFinite(V) ? V < 0 ? `rgba(47,128,237,${U})` : `rgba(211,47,47,${U})` : "#ae3e3e"
        });
      }
    return $;
  }, [t, p, h]), k = ($) => {
    const C = $.currentTarget.getBoundingClientRect();
    if (!(C.width > 0) || !(C.height > 0)) return;
    const E = ($.clientX - C.left) * P / C.width, R = ($.clientY - C.top) * I / C.height, K = Math.floor((E - j) / g), D = Math.floor((R - F) / g);
    D < 0 || D >= i.length || K < 0 || K >= a.length || t.sourceAxisKeys[D] === t.receiverAxisKeys[K] || x(`${t.sourceAxisKeys[D]}${oi}${t.receiverAxisKeys[K]}`);
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
          receivers: a.length
        }),
        onPointerDown: k,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: j, y: F, width: S, height: A, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          a.map(($, C) => /* @__PURE__ */ e.jsx(
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
              children: /* @__PURE__ */ e.jsx("title", { children: $.diagonal ? v("{channel} · self", { channel: i[$.sourceIndex].combined }) : `${i[$.sourceIndex].combined} → ${a[$.receiverIndex].combined} · ${tn($.value)}` })
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
function ia({
  dataset: t,
  pair: i,
  plotSize: a,
  densitySmoothing: o,
  flagged: l,
  selected: h,
  onSelect: p,
  onFlag: x
}) {
  const { t: v } = Be(), g = w.useRef(null), [j, F] = w.useState(() => typeof IntersectionObserver > "u");
  w.useEffect(() => {
    const A = g.current;
    if (!A || typeof IntersectionObserver > "u") {
      F(!0);
      return;
    }
    const P = new IntersectionObserver(
      (I) => F(I.some((M) => M.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return P.observe(A), () => P.disconnect();
  }, []);
  const T = w.useMemo(
    () => j ? ji(t, i.source.key, i.receiver.key) : null,
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
      style: { width: a, height: a },
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
              onChange: (A) => x(A.currentTarget.checked)
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
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: a, height: a }, children: S ? /* @__PURE__ */ e.jsx(
              ta,
              {
                title: "",
                preview: S,
                sourceLabel: i.source.label,
                receiverLabel: i.receiver.label,
                minimumSize: a,
                maximumSize: a,
                densitySmoothing: o
              }
            ) : T && !T.ready ? /* @__PURE__ */ e.jsx("span", { children: T.reason }) : /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" }) })
          }
        )
      ]
    }
  );
}
function ra({
  stateKey: t,
  header: i,
  children: a
}) {
  const { t: o } = Be(), [l, h] = xe(
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
        a
      ]
    }
  );
}
const aa = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', ci = 58 * Math.PI / 180, oa = 16, la = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, ca = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], _e = "", di = 2500, ui = 400, da = 2500, hi = 15e3, pi = [2500, 5e3, 15e3, 5e4], ua = 24, mi = 4, gi = 624, ha = Object.freeze({});
function fi(t) {
  if (!Number.isFinite(t)) return String(t);
  const i = t * 100;
  if (i === 0) return "0.0";
  const a = Math.abs(i), o = a >= 1 ? 1 : a >= 0.1 ? 2 : 3;
  return i.toFixed(o);
}
function Gt(t) {
  return t.replace(/(?: · (?:edited|revised))+$/u, "");
}
function xt(t, i) {
  const a = t.index(i), o = a === void 0 ? void 0 : t.channels[a], l = (o == null ? void 0 : o.pnn) ?? i, h = t.labelForKey(i), p = ((o == null ? void 0 : o.label) ?? "").trim() || ((o == null ? void 0 : o.marker) ?? "").trim(), x = p && p !== l ? `${p} (${l})` : l;
  return { key: i, pnn: l, label: h, combined: x };
}
function Ht(t, i) {
  const a = t.channels.find((o) => o.pnn === i);
  return xt(t, (a == null ? void 0 : a.key) ?? i);
}
function pa(t, i) {
  return t === "cytof-spillover" && i === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function ma(t) {
  return t.replaceAll("-", " ");
}
function es(t) {
  if (t.length === 0) return 0;
  t.sort((a, o) => a - o);
  const i = Math.floor(t.length / 2);
  return t.length % 2 === 0 ? (t[i - 1] + t[i]) / 2 : t[i];
}
function ga(t) {
  return Object.fromEntries(t.scientific.solverSettings.map(({ key: i, value: a }) => [i, a]));
}
function fa(t, i) {
  const a = Object.freeze({ ...t.scientific.matrix, matrix: i }), o = ga(t);
  return t.scientific.kind === "flow-spillover" ? {
    kind: "flow-spillover",
    method: "matrix-inverse",
    solverVersion: t.scientific.solverVersion,
    solverSettings: {
      singularTolerance: Number(o.singularTolerance),
      conditionWarningThreshold: Number(o.conditionWarningThreshold)
    },
    matrix: a
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
    matrix: a,
    includedChannels: t.scientific.includedChannels
  };
}
function xi(t, i, a, o) {
  const l = t.scientific.matrix.sourceChannels.indexOf(i), h = t.scientific.matrix.receiverChannels.indexOf(a);
  if (l < 0 || h < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(t.scientific.matrix.matrix.map(
    (p, x) => Object.freeze(p.map((v, g) => x === l && g === h ? o : v))
  ));
}
function xa(t, i, a) {
  var p;
  if (!t) return null;
  const o = t.scientific.matrix.sourceChannels.indexOf(i), l = t.scientific.matrix.receiverChannels.indexOf(a);
  if (o < 0 || l < 0) return null;
  const h = (p = t.scientific.matrix.matrix[o]) == null ? void 0 : p[l];
  return Number.isFinite(h) ? h : null;
}
function vi(t, i, a) {
  const o = Math.max(Math.abs(t), Math.abs(i), 1e-3);
  return Object.freeze(a === "cytof" ? { lower: 0, upper: Math.max(t + o, o * 2) } : { lower: t - o, upper: t + o });
}
function va(t, i) {
  const a = (i - t) / 3;
  return Object.freeze([t, t + a, t + 2 * a, i]);
}
function ba(t, i) {
  return t.length === i.length && t.every((a, o) => {
    var l;
    return a.length === ((l = i[o]) == null ? void 0 : l.length) && a.every((h, p) => h === i[o][p]);
  });
}
function ya(t, i) {
  if (t.compensatedLayerStatus().state !== "ready" || i.length === 0 || t.fcs.nEvents === 0) return null;
  const o = i.flatMap((F) => {
    const T = t.channels.findIndex((S) => S.pnn === F);
    return T < 0 ? [] : [T];
  });
  if (o.length === 0) return null;
  const l = Math.min(2048, t.fcs.nEvents), h = [];
  let p = 0, x = 0, v = 0, g = "", j = -1;
  for (const F of o) {
    const T = t.originalColumnData(F), S = t.compensatedColumnData(F), A = [];
    for (let I = 0; I < l; I++) {
      const M = l === 1 ? 0 : Math.floor(I * (t.fcs.nEvents - 1) / (l - 1)), k = T[M], $ = S[M], C = Math.abs($ - k);
      A.push(C), h.push(C), C > Math.max(1e-6, Math.abs(k) * 1e-6) && p++, k < 0 && $ === 0 && v++, x = Math.max(x, C);
    }
    const P = es(A);
    P > j && (j = P, g = xt(t, t.channels[F].key).combined);
  }
  return {
    previewEvents: l,
    comparedValues: h.length,
    changedValues: p,
    medianAbsoluteDelta: es(h),
    maxAbsoluteDelta: x,
    zeroedNegativeValues: v,
    mostChangedChannel: g,
    mostChangedChannelMedianDelta: Math.max(0, j)
  };
}
function ja(t, i) {
  return t.origin.type === "uploaded" ? t.origin.fileName : t.origin.type === "embedded-fcs" ? `${t.origin.fileName} · ${i("embedded FCS")}` : t.origin.type === "manual" ? i("set by hand, from an empty matrix") : `${t.origin.presetId} · ${i("bundled preset")} ${t.origin.presetVersion}`;
}
function wa(t) {
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
  }, a = dt(
    i.input,
    "cytof-spillover"
  );
  return a.ok ? {
    draft: {
      fileName: t.name,
      source: "host",
      parsed: i,
      matrix: a.value,
      validationWarnings: a.warnings
    },
    error: null
  } : {
    draft: null,
    error: `The SCE spillover matrix is invalid. ${a.errors.map(({ message: o }) => o).join(" ")}`
  };
}
function Na({
  sample: t,
  sampleName: i = "sample.fcs",
  hostedCompensationMatrix: a = null,
  compensationOn: o,
  onApplyProfile: l,
  otherEmbeddedLayerFiles: h = [],
  onRemoveProfile: p,
  existingHostAssays: x = [],
  onAdoptExistingAssay: v,
  onCancelApply: g,
  hasExistingGates: j = !1,
  applyStatus: F = null,
  installedProfile: T = null,
  applyTargetCount: S = 1,
  applyTargetEventCount: A,
  applyWorkerCount: P,
  applyWorkerLimit: I,
  onApplyWorkerCountChange: M,
  installedBaselineProfile: k = null,
  reviewPopulations: $ = [],
  reviewPopulationMasks: C = ha,
  onPreviewCompensationCandidate: E,
  onSolveCompensationSweep: R,
  onCancelCompensationSweep: K,
  onSuspendBackgroundWork: D,
  visible: V = !0,
  stateKey: W,
  densityColorPower: Z = ns,
  channelLabelMode: U = "marker",
  onDensityColorPowerChange: q = () => {
  }
}) {
  var _s, Us;
  const { t: s } = Be(), G = t.compensatedLayerStatus(), Re = G.state === "missing" ? null : G.metadata, z = (Re == null ? void 0 : Re.runtimeIdentity) === "profile" ? Re : null, N = (T == null ? void 0 : T.profileId) === (z == null ? void 0 : z.profileId) ? T : null, ne = !z && t.instrument === "flow" ? t.spillover : null, me = (a == null ? void 0 : a.kind) === "flow-spillover" ? a : null, vt = w.useMemo(
    () => wa(a),
    [a]
  ), [Ve, Ce] = xe(
    `compensation.${W}.selectedPair`,
    null
  ), [bt, Ke] = w.useState(null), [Vn, os] = xe(
    `compensation.${W}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [xn, ls] = xe(
    "compensation.inspectorWidth",
    gi
  ), [Se, Wn] = xe(
    `compensation.${W}.workspaceView`,
    "matrix"
  ), [Le, qn] = xe(
    `compensation.${W}.globalPairFilter`,
    "relevant"
  ), [Ci, Si] = xe(
    `compensation.${W}.globalLayout`,
    null
  ), [Mi, ki] = xe(
    "compensation.globalPlotSize.v5",
    160
  ), [Ei, Ai] = xe(
    "compensation.densitySmoothing.v3",
    6
  ), [Ti, $i] = xe(
    "compensation.pointAlpha.v1",
    0.85
  ), [Fi, Pi] = xe(
    "compensation.pointSize.v1",
    1
  ), [yt, Ii] = xe(
    "compensation.pairPreviewEventLimit.v1",
    hi
  ), [Tn, cs] = w.useState(""), [$n, jt] = w.useState(!1), [wt, ds] = w.useState(null), [vn, Nt] = xe(
    `compensation.${W}.reviewPopulation`,
    "all"
  ), [Gn, Ri] = xe(
    `compensation.${W}.flaggedPairs`,
    []
  ), [We, Ki] = xe(
    `compensation.${W}.evidenceMode`,
    "biological"
  ), [Li, Oi] = xe(
    `compensation.${W}.sweepBounds`,
    {}
  ), [Ct, St] = xe(
    `compensation.${W}.sweepWorkers`,
    2
  ), [$e, us] = w.useState(""), [Me, Mt] = w.useState(""), [Di, kt] = w.useState(0), [X, Hn] = w.useState({}), [zi, sn] = w.useState({}), [qe, rn] = w.useState({ state: "idle" }), [_i, Ye] = w.useState({}), [Ui, an] = w.useState({}), [je, bn] = w.useState(null), [Bi, Fn] = w.useState(null), [he, yn] = w.useState(null), [hs, be] = w.useState(null), [Zn, Et] = w.useState(""), [Vi, ps] = w.useState(!1), [Wi, ms] = w.useState(!1), Fe = w.useRef(0), jn = w.useRef(0), [gs, Q] = w.useState(null), [fs, ge] = w.useState(!1), [J, Yn] = w.useState(
    () => vt.draft
  ), [Pn, on] = w.useState(
    () => {
      var u;
      const n = ((u = vt.draft) == null ? void 0 : u.matrix.receiverChannels) ?? [], r = /* @__PURE__ */ new Map();
      for (const d of t.channels) {
        const m = d.pnn.trim().normalize("NFC");
        r.set(m, (r.get(m) ?? 0) + 1);
      }
      return new Set(n.filter((d) => r.get(d) === 1));
    }
  ), [xs, Xe] = w.useState(
    () => vt.error
  ), [ke, Ge] = w.useState(!1), [Xn, vs] = w.useState(!1), [Jn, bs] = w.useState(
    () => {
      var n;
      return ((n = x[0]) == null ? void 0 : n.id) ?? "";
    }
  ), [At, Qn] = w.useState(!1), [et, ye] = w.useState(null), [qi, Oe] = w.useState(!1), [Gi, He] = w.useState(null), Pe = w.useRef(!1), ys = w.useRef(null), js = w.useRef(null), wn = w.useRef(null), B = qi || F !== null, Je = Math.max(0, Math.floor(S)), Hi = Math.max(
    0,
    Math.floor(A ?? t.fcs.nEvents)
  ), Qe = x.find(
    ({ id: n }) => n === Jn
  ) ?? x[0] ?? null;
  w.useEffect(() => {
    var n;
    Jn && x.some(({ id: r }) => r === Jn) || (bs(((n = x[0]) == null ? void 0 : n.id) ?? ""), Qn(!1));
  }, [x, Jn]);
  const oe = F ?? (et ? {
    phase: "applying",
    profileName: Gi ?? (J == null ? void 0 : J.fileName) ?? "Compensation",
    fraction: et.fraction,
    processedEvents: et.processedEvents,
    totalEvents: et.totalEvents
  } : null);
  w.useEffect(() => {
    V || (jn.current++, Fe.current++, rn({ state: "idle" }), yn(null), bn(null), D == null || D());
  }, [D, V]);
  const Tt = w.useMemo(
    () => t.channels.map(({ pnn: n, columnIndex: r }) => ({ pnn: n, columnIndex: r })),
    [t]
  ), Ee = w.useMemo(() => {
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
    const r = dt({
      sourceChannels: n,
      receiverChannels: n,
      matrix: ne.matrix
    }, "flow-spillover"), u = ["$SPILLOVER", "$SPILL", "SPILL"].find((d) => typeof t.fcs.keywords[d] == "string");
    return {
      validation: r,
      error: r.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${r.errors.map(({ message: d }) => d).join(" ")}`,
      keyword: u
    };
  }, [t, ne]), ee = vn === "all" ? null : $.find(({ id: n }) => n === vn) ?? null, pe = ee ? C[ee.id] ?? null : null, de = pe ? (ee == null ? void 0 : ee.eventCount) ?? 0 : t.fcs.nEvents, nt = yt === "all" ? "all" : pi.includes(Number(yt)) ? Number(yt) : hi, In = w.useMemo(
    () => pn(
      t.fcs.nEvents,
      nt === "all" ? Math.max(1, t.fcs.nEvents) : nt,
      pe
    ),
    [nt, de, pe, t]
  ), Rn = w.useMemo(
    () => pn(t.fcs.nEvents, 2048, pe),
    [pe, t]
  ), $t = w.useMemo(
    () => pn(
      t.fcs.nEvents,
      da,
      pe
    ),
    [pe, t]
  );
  w.useEffect(() => {
    vn !== "all" && !$.some(({ id: n }) => n === vn) && Nt("all");
  }, [vn, $, Nt]), w.useEffect(() => {
    Fe.current++, K == null || K(), Ye({}), an({}), bn(null), yn(null), be(null);
  }, [vn, pe, K]);
  const ue = w.useMemo(() => J ? Cr({
    kind: "cytof-spillover",
    matrix: J.matrix,
    sampleChannels: Tt,
    includedChannels: Array.from(Pn)
  }) : null, [J, Pn, Tt, U]), c = w.useMemo(() => {
    var r;
    if (ne) {
      const u = t.spilloverOrigin, d = u.kind === "external" ? u : null;
      return {
        sourceAxisKeys: ne.channels,
        receiverAxisKeys: ne.channels,
        sourceChannels: ne.channels.map((m) => xt(t, m)),
        receiverChannels: ne.channels.map((m) => xt(t, m)),
        matrix: ne.matrix,
        kind: "flow",
        title: me ? "SCE spillover matrix" : d ? `Compensation matrix from ${d.label}` : "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: d ? "This FCS carries no spillover matrix of its own; these coefficients came from the imported FlowJo workspace and are applied unchanged." + (d.droppedChannels.length ? ` ${d.droppedChannels.length} of its parameter(s) are not in this file (${d.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "") : "Applying the embedded matrix leaves its coefficients unchanged." + (u.kind === "fcs" && ((r = u.droppedChannels) != null && r.length) ? ` ${u.droppedChannels.length} of its parameter(s) are not among this file's channels (${u.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "")
      };
    }
    if (!N || !z) return null;
    const n = N.scientific.kind === "cytof-spillover" ? Pr(N.scientific.matrix) : N.scientific.matrix;
    return n.matrix.length !== n.sourceChannels.length || n.matrix.some((u) => !u || u.length !== n.receiverChannels.length) ? null : {
      sourceAxisKeys: n.sourceChannels,
      receiverAxisKeys: n.receiverChannels,
      sourceChannels: n.sourceChannels.map((u) => Ht(t, u)),
      receiverChannels: n.receiverChannels.map((u) => Ht(t, u)),
      matrix: n.matrix,
      kind: N.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: N.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: N.scientific.kind === "cytof-spillover" ? s("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: n.sourceChannels.length,
        receivers: n.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: N.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [me, z, N, t, ne, s, U]), fe = Ci ?? (c && c.sourceAxisKeys.length <= oa ? "matrix" : "compact"), ae = (c == null ? void 0 : c.sourceChannels) ?? [], le = (c == null ? void 0 : c.receiverChannels) ?? [];
  w.useEffect(() => {
    St((n) => Math.max(1, Math.min(mi, Math.round(n) || 1)));
  }, [St]);
  const tt = bt ?? Ve, b = w.useMemo(() => {
    if (!c || !tt) return null;
    const [n, r] = tt.split(_e), u = c.sourceAxisKeys.indexOf(n), d = c.receiverAxisKeys.indexOf(r);
    return u < 0 || d < 0 || c.sourceAxisKeys[u] === c.receiverAxisKeys[d] ? null : {
      pairKey: tt,
      sourceIndex: u,
      receiverIndex: d,
      source: ae[u],
      receiver: le[d],
      value: c.matrix[u][d],
      interaction: c.kind === "cytof" ? kn(
        c.sourceAxisKeys[u],
        c.receiverAxisKeys[d]
      ) : null
    };
  }, [tt, c, le, ae]);
  w.useEffect(() => {
    if (!b) {
      Et("");
      return;
    }
    const n = X[b.pairKey];
    Et(re((n ?? b.value) * 100, 6));
  }, [b == null ? void 0 : b.pairKey, b == null ? void 0 : b.value, X]);
  const we = w.useMemo(() => b ? Vt(
    t,
    b.source.key,
    b.receiver.key,
    {
      eventMask: pe,
      fixedEventIndices: In,
      eligibleEventCount: de
    }
  ) : null, [o, G.state, In, de, pe, t, b]), Ae = w.useMemo(() => {
    if (!c || G.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const n = [];
    for (let m = 0; m < c.matrix.length; m++)
      for (let f = 0; f < c.matrix[m].length; f++) {
        const y = c.sourceAxisKeys[m], O = c.receiverAxisKeys[f];
        if (y === O) continue;
        const _ = c.matrix[m][f];
        if (!Number.isFinite(_)) continue;
        const L = c.kind === "cytof" ? kn(y, O) : null, H = L !== null && L !== "self" && L !== "other";
        _ === 0 && !H && We === "biological" || n.push({
          sourceIndex: m,
          receiverIndex: f,
          pairKey: `${y}${_e}${O}`,
          source: ae[m],
          receiver: le[f],
          coefficient: _,
          interaction: L,
          physicalPrior: H ? 1 : 0
        });
      }
    n.sort((m, f) => f.physicalPrior - m.physicalPrior || Math.abs(f.coefficient) - Math.abs(m.coefficient));
    const r = n.slice(0, 240), u = r.flatMap((m) => {
      const f = Vt(
        t,
        m.source.key,
        m.receiver.key,
        {
          eventMask: pe,
          fixedEventIndices: Rn,
          eligibleEventCount: de
        }
      );
      return f.ready ? [{ ...m, evidence: f.preview.evidence }] : [];
    }), d = Ur(
      u.map(({ coefficient: m, physicalPrior: f, evidence: y }) => ({ coefficient: m, physicalPrior: f, evidence: y })),
      c.kind,
      We
    ).map(({ index: m, relativePriority: f }) => ({ ...u[m], relativePriority: f }));
    return {
      candidateCount: n.length,
      screenedCount: r.length,
      evaluableCount: u.length,
      items: d.slice(0, 8)
    };
  }, [Di, We, G.state, c, le, Rn, de, pe, t, ae]), ce = w.useMemo(() => new Set(
    N ? N.scientific.kind === "flow-spillover" ? N.scientific.matrix.receiverChannels : N.scientific.includedChannels : []
  ), [N]), te = w.useMemo(() => c ? qr(
    t,
    Array.from(/* @__PURE__ */ new Set([
      ...c.sourceAxisKeys,
      ...c.receiverAxisKeys
    ])),
    {
      eventMask: pe,
      fixedEventIndices: $t,
      eligibleEventCount: de
    }
  ) : null, [
    o,
    $t,
    G.state,
    c,
    de,
    pe,
    t
  ]);
  w.useEffect(() => {
    if (!c || ce.size === 0) return;
    const n = ce.has($e) ? $e : c.sourceAxisKeys.find((u) => ce.has(u)) ?? "", r = ce.has(Me) && Me !== n ? Me : c.receiverAxisKeys.find((u) => u !== n && ce.has(u)) ?? "";
    n !== $e && us(n), r !== Me && Mt(r);
  }, [ce, Me, $e, c]);
  const Nn = w.useMemo(() => new Set(Gn), [Gn]), Ft = w.useMemo(() => {
    var u;
    if (!c) return [];
    const n = [], r = ce.size > 0;
    for (let d = 0; d < c.sourceAxisKeys.length; d++) {
      const m = c.sourceAxisKeys[d];
      if (!(r && !ce.has(m)))
        for (let f = 0; f < c.receiverAxisKeys.length; f++) {
          const y = c.receiverAxisKeys[f];
          if (m === y || r && !ce.has(y)) continue;
          const O = (u = c.matrix[d]) == null ? void 0 : u[f];
          if (!Number.isFinite(O)) continue;
          const _ = ae[d], L = le[f];
          if (!_ || !L || te != null && te.ready && (!te.dataset.channels.has(_.key) || !te.dataset.channels.has(L.key))) continue;
          const H = c.kind === "cytof" ? kn(m, y) : null, ie = H !== null && H !== "self" && H !== "other";
          n.push({
            sourceIndex: d,
            receiverIndex: f,
            pairKey: `${m}${_e}${y}`,
            source: _,
            receiver: L,
            coefficient: O,
            interaction: H,
            physicalPrior: ie ? 1 : 0
          });
        }
    }
    return n;
  }, [te, ce, c, le, ae]), Te = w.useMemo(() => {
    const n = Tn.trim().toLocaleLowerCase();
    return Ft.filter((r) => {
      const u = Math.abs(r.coefficient) > 1e-12, d = r.physicalPrior > 0;
      return Le === "all" || Le === "relevant" && (u || d) || Le === "nonzero" && u || Le === "physical" && d || Le === "flagged" && Nn.has(r.pairKey) ? n ? `${r.source.combined} ${r.receiver.combined}`.toLocaleLowerCase().includes(n) : !0 : !1;
    });
  }, [Nn, Ft, Le, Tn]);
  w.useEffect(() => {
    var r;
    if (!wt || Se !== "global") return;
    const n = [...((r = wn.current) == null ? void 0 : r.querySelectorAll(".gl-comp-global-tile")) ?? []].find((u) => u.dataset.pairKey === wt);
    n && (n.scrollIntoView({ block: "center", inline: "center" }), ds(null));
  }, [$n, fe, wt, Te, Se]);
  const Pt = w.useMemo(() => {
    if (fe === "compact" || fe === "matrix") return [];
    const n = /* @__PURE__ */ new Map();
    for (const r of Te) {
      const u = fe === "source" ? r.source : r.receiver, d = n.get(u.key);
      d ? d.pairs.push(r) : n.set(u.key, { channel: u, pairs: [r] });
    }
    return [...n.values()];
  }, [fe, Te]), Zi = w.useMemo(() => {
    const n = /* @__PURE__ */ new Map();
    if (fe !== "matrix") return n;
    for (const r of Te) n.set(`${r.sourceIndex}:${r.receiverIndex}`, r);
    return n;
  }, [fe, Te]), ws = w.useMemo(
    () => fe === "compact" ? Te : fe === "matrix" ? [...Te].sort((n, r) => n.sourceIndex - r.sourceIndex || n.receiverIndex - r.receiverIndex) : Pt.flatMap((n) => n.pairs),
    [Pt, fe, Te]
  ), Ns = `${s(la[Le])}${Tn.trim() ? s(" · search “{query}”", { query: Tn.trim() }) : ""}`, Kn = Math.max(120, Math.min(220, Math.round(Mi) || 120)), Cs = w.useRef(null), [Ss, Ms] = w.useState(0);
  w.useEffect(() => {
    const n = Cs.current;
    if (!n || fe !== "matrix" || typeof ResizeObserver > "u") return;
    const r = new ResizeObserver(() => Ms(n.clientWidth));
    return r.observe(n), Ms(n.clientWidth), () => r.disconnect();
  }, [fe, Se, te == null ? void 0 : te.ready]);
  const ks = (c == null ? void 0 : c.receiverChannels.length) ?? 0, It = ks > 0 && Ss > 0 ? Math.max(120, Math.min(Kn, Math.floor((Ss - 92 - 12) / ks))) : Kn, en = Math.max(1, Math.min(10, Math.round(Ei) || 6)), st = Math.max(0.1, Math.min(1, Number(Ti) || 0.85)), it = Math.max(0.3, Math.min(3, Number(Fi) || 1)), se = w.useMemo(() => !N || !c || G.state !== "ready" ? [] : Gn.flatMap((n) => {
    const [r, u] = n.split(_e), d = c.sourceAxisKeys.indexOf(r), m = c.receiverAxisKeys.indexOf(u);
    if (d < 0 || m < 0 || r === u || !ce.has(r) || !ce.has(u)) return [];
    const f = Vt(
      t,
      ae[d].key,
      le[m].key,
      {
        eventMask: pe,
        fixedEventIndices: Rn,
        eligibleEventCount: de
      }
    );
    if (!f.ready) return [];
    const y = Ae.items.find((O) => O.pairKey === n);
    return [{
      sourceIndex: d,
      receiverIndex: m,
      pairKey: n,
      source: ae[d],
      receiver: le[m],
      coefficient: c.matrix[d][m],
      interaction: c.kind === "cytof" ? kn(r, u) : null,
      physicalPrior: c.kind === "cytof" && kn(r, u) !== "other" ? 1 : 0,
      evidence: f.preview.evidence,
      relativePriority: (y == null ? void 0 : y.relativePriority) ?? 0
    }];
  }), [Gn, ce, G.state, c, N, le, Ae.items, Rn, de, pe, t, ae]), De = se, Es = w.useMemo(() => {
    if (!N) return 0.01;
    const n = [];
    for (let r = 0; r < N.scientific.matrix.matrix.length; r++) {
      const u = N.scientific.matrix.sourceChannels[r];
      for (let d = 0; d < N.scientific.matrix.matrix[r].length; d++) {
        if (u === N.scientific.matrix.receiverChannels[d]) continue;
        const m = Math.abs(N.scientific.matrix.matrix[r][d]);
        Number.isFinite(m) && m > 1e-12 && n.push(m);
      }
    }
    return n.length > 0 ? es(n) : 0.01;
  }, [N]), Rt = (n, r) => {
    const u = Li[n];
    if (u) return u;
    const d = vi(r, Es, (c == null ? void 0 : c.kind) ?? "flow");
    return {
      lowerPercent: re(d.lower * 100, 5),
      upperPercent: re(d.upper * 100, 5)
    };
  }, Ln = (n, r) => {
    const u = Rt(n, r), d = Number(u.lowerPercent) / 100, m = Number(u.upperPercent) / 100;
    return !Number.isFinite(d) || !Number.isFinite(m) ? { lower: d, upper: m, error: "Enter finite lower and upper sweep bounds." } : (c == null ? void 0 : c.kind) === "cytof" && d < 0 ? { lower: d, upper: m, error: "CyTOF NNLS sweep bounds cannot be negative." } : m > d ? { lower: d, upper: m, error: null } : { lower: d, upper: m, error: "The upper sweep bound must be greater than the lower bound." };
  }, rt = (n, r, u, d) => {
    Oi((m) => ({
      ...m,
      [n]: {
        ...m[n] ?? (() => {
          const f = vi(r, Es, (c == null ? void 0 : c.kind) ?? "flow");
          return {
            lowerPercent: re(f.lower * 100, 5),
            upperPercent: re(f.upper * 100, 5)
          };
        })(),
        [u]: d
      }
    })), Ye((m) => {
      if (!(n in m)) return m;
      const f = { ...m };
      return delete f[n], f;
    }), an((m) => {
      if (!(n in m)) return m;
      const f = { ...m };
      return delete f[n], f;
    });
  }, On = (n, r) => {
    Ri((u) => r ? u.includes(n) ? u : [...u, n] : u.filter((d) => d !== n)), r ? (Ce(n), Fn(n)) : (Ye((u) => {
      if (!(n in u)) return u;
      const d = { ...u };
      return delete d[n], d;
    }), an((u) => {
      if (!(n in u)) return u;
      const d = { ...u };
      return delete d[n], d;
    }));
  }, Yi = () => {
    if (!c || !$e || !Me || $e === Me) return;
    if (!ce.has($e) || !ce.has(Me)) {
      be("Both channels must be included in the installed compensation solve.");
      return;
    }
    const n = `${$e}${_e}${Me}`;
    On(n, !0), be(null);
  }, Kt = De.reduce((n, r) => n + (Ln(r.pairKey, r.coefficient).error ? 1 : 0), 0), Cn = w.useMemo(() => {
    if (!N) return null;
    const n = N.scientific.matrix.matrix.map((r) => Array.from(r));
    for (const [r, u] of Object.entries(X)) {
      const [d, m] = r.split(_e), f = N.scientific.matrix.sourceChannels.indexOf(d), y = N.scientific.matrix.receiverChannels.indexOf(m);
      f >= 0 && y >= 0 && (n[f][y] = u);
    }
    return Object.freeze(n.map((r) => Object.freeze(r)));
  }, [N, X]);
  w.useEffect(() => {
    const n = Object.keys(X).length;
    if (!V || n === 0 || !N || N.scientific.kind !== "flow-spillover" || G.state !== "ready" || !Cn || !b || !E) {
      jn.current++, rn({ state: "idle" });
      return;
    }
    const r = In;
    if (r.length === 0) {
      rn({
        state: "error",
        pairKey: b.pairKey,
        message: s("The selected review population contains no events.")
      });
      return;
    }
    const u = ++jn.current, d = b.pairKey;
    rn((f) => ({
      state: "updating",
      pairKey: d,
      ...(f.state === "ready" || f.state === "updating") && f.pairKey === d && f.preview ? { preview: f.preview } : {}
    }));
    const m = window.setTimeout(() => {
      E(
        N,
        r,
        Cn
      ).then((f) => {
        if (jn.current !== u) return;
        const y = f.sourceChannels.indexOf(b.source.pnn), O = f.sourceChannels.indexOf(b.receiver.pnn);
        if (y < 0 || O < 0)
          throw new Error(s("The preview result did not contain the selected flow channels."));
        const _ = Wt(
          t,
          b.source.pnn,
          b.receiver.pnn,
          r,
          f.candidateColumns[y],
          f.candidateColumns[O],
          { totalEvents: de }
        );
        if (!_.ready) throw new Error(_.reason);
        rn({
          state: "ready",
          pairKey: d,
          preview: _.preview
        });
      }).catch((f) => {
        if (jn.current !== u) return;
        const y = f instanceof Error ? f.message : String(f);
        /cancel|supersed|stale/i.test(y) || rn({ state: "error", pairKey: d, message: y });
      });
    }, 90);
    return () => window.clearTimeout(m);
  }, [
    G.state,
    E,
    N,
    In,
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
  const Xi = w.useMemo(() => !c || Object.keys(X).length === 0 ? null : {
    sourceChannels: c.sourceAxisKeys,
    receiverChannels: c.receiverAxisKeys,
    matrix: c.matrix.map(
      (n, r) => n.map((u, d) => {
        const m = `${c.sourceAxisKeys[r]}${_e}${c.receiverAxisKeys[d]}`;
        return X[m] ?? u;
      })
    )
  }, [c, X]), As = w.useMemo(() => {
    if (!c) return [];
    const n = [];
    for (let r = 0; r < c.matrix.length; r++)
      for (let u = 0; u < c.matrix[r].length; u++) {
        const d = c.matrix[r][u];
        c.sourceAxisKeys[r] === c.receiverAxisKeys[u] || !Number.isFinite(d) || d <= 1 || n.push(`${ae[r].combined} → ${le[u].combined}`);
      }
    return n;
  }, [c, le, ae]), Lt = w.useMemo(() => {
    if (!c) return [];
    const n = [];
    for (let r = 0; r < c.matrix.length; r++)
      for (let u = 0; u < c.matrix[r].length; u++) {
        const d = c.matrix[r][u], m = c.sourceAxisKeys[r] === c.receiverAxisKeys[u], f = `${ae[r].combined} → ${le[u].combined}`;
        Number.isFinite(d) ? m && Math.abs(d - 1) > 1e-8 ? n.push(`${ae[r].combined}: diagonal is ${tn(d)}, not 100%`) : !m && d < 0 ? n.push(`${f}: negative coefficient (${tn(d)})`) : !m && d > 1 && n.push(`${f}: coefficient above 100%`) : n.push(`${f}: non-finite coefficient (${String(d)})`);
      }
    return n;
  }, [c, le, ae]), Ts = w.useMemo(
    () => (c == null ? void 0 : c.matrix.some((n) => n.some((r) => !Number.isFinite(r)))) ?? !1,
    [c]
  ), Ie = w.useMemo(
    () => z && G.state === "ready" ? ya(t, z.includedPnns) : null,
    [G.state, z, t]
  ), at = w.useMemo(() => {
    const n = [...Lt];
    return G.state === "stale" && n.push(...G.reasons.map((r) => `Profile unavailable: ${ma(r)}`)), n;
  }, [G, Lt]), $s = z ? (N == null ? void 0 : N.name) ?? "Installed compensation profile" : ne ? me ? "SCE spillover matrix" : "Embedded FCS matrix" : "No compatible matrix", Ji = z ? pa(z.kind, z.method) : ne ? "Flow linear inverse" : "Not configured", ot = s(Ji), Ot = (z == null ? void 0 : z.includedPnns.length) ?? (ne == null ? void 0 : ne.channels.length) ?? 0, lt = (N == null ? void 0 : N.name) ?? (z == null ? void 0 : z.profileId) ?? $s, Fs = Gt(lt), Qi = Fs !== lt || (N == null ? void 0 : N.recordType) === "revision" ? `${Fs} · ${s("revised")}` : lt, er = ne !== null && !Ts || z !== null && G.state === "ready", Ps = w.useMemo(() => {
    if (!c) return 0;
    let n = 0;
    for (let r = 0; r < c.matrix.length; r++)
      for (let u = 0; u < c.matrix[r].length; u++) {
        if (c.sourceAxisKeys[r] === c.receiverAxisKeys[u]) continue;
        const d = c.matrix[r][u];
        Number.isFinite(d) && (n = Math.max(n, Math.abs(d)));
      }
    return n;
  }, [c]), Sn = !!((N == null ? void 0 : N.scientific.kind) === "flow-spillover" && G.state === "ready" && c && Math.max(c.sourceAxisKeys.length, c.receiverAxisKeys.length) <= ua), ln = c ? Sn ? Math.max(42, Math.min(54, Math.floor(960 / Math.max(
    c.sourceAxisKeys.length,
    c.receiverAxisKeys.length
  )))) : Math.max(13, Math.min(38, Math.floor(760 / Math.max(
    c.sourceAxisKeys.length,
    c.receiverAxisKeys.length
  )))) : 13, Dn = w.useMemo(() => {
    const n = Sn ? 9.5 : 8, r = [...ae, ...le].map((L) => L.combined), u = typeof document > "u" ? null : document.createElement("canvas").getContext("2d");
    u && (u.font = `${n}px ${aa}`);
    const d = (L) => u ? u.measureText(L).width : L.length * n * 0.55, m = r.reduce((L, H) => Math.max(L, d(H)), 0), f = Math.min(320, Math.max(94, Math.ceil(m) + 12)), y = Math.min(260, Math.max(82, Math.ceil(m) + 6)), O = Math.max(88, Math.ceil(y * Math.sin(ci) + 12)), _ = Math.max(0, Math.ceil(y * Math.cos(ci) - ln / 2));
    return { rowLabelWidth: f, columnLabelWidth: y, columnLabelHeight: O, overhang: _ };
  }, [Sn, ln, le, ae]);
  w.useEffect(() => {
    Hn({}), sn({}), rn({ state: "idle" }), jn.current++;
  }, [N == null ? void 0 : N.profileId]), w.useEffect(() => {
    (c == null ? void 0 : c.kind) === "flow" && Le === "physical" && qn("relevant");
  }, [Le, c == null ? void 0 : c.kind, qn]);
  const nr = (n) => {
    os((r) => ({ ...r, [n]: !r[n] }));
  }, Is = (n) => {
    var d;
    const r = ((d = wn.current) == null ? void 0 : d.getBoundingClientRect().width) ?? 1100, u = Math.max(360, Math.min(900, r - 440 - 8));
    return Math.max(360, Math.min(u, Math.round(n)));
  }, tr = (n) => {
    var m;
    if (n.button !== 0) return;
    n.preventDefault();
    const r = n.currentTarget;
    (m = r.setPointerCapture) == null || m.call(r, n.pointerId);
    const u = (f) => {
      var O;
      const y = (O = wn.current) == null ? void 0 : O.getBoundingClientRect();
      y && ls(Is(y.right - f.clientX));
    }, d = () => {
      var f;
      window.removeEventListener("pointermove", u), window.removeEventListener("pointerup", d), window.removeEventListener("pointercancel", d), (f = r.releasePointerCapture) == null || f.call(r, n.pointerId);
    };
    window.addEventListener("pointermove", u), window.addEventListener("pointerup", d), window.addEventListener("pointercancel", d);
  }, sr = (n) => {
    let r = null;
    n.key === "ArrowLeft" ? r = xn + 40 : n.key === "ArrowRight" ? r = xn - 40 : n.key === "Home" && (r = gi), r !== null && (n.preventDefault(), ls(Is(r)));
  }, ir = async (n) => {
    var u;
    const r = (u = n.currentTarget.files) == null ? void 0 : u[0];
    n.currentTarget.value = "", r && await Ks(r);
  }, Rs = () => void kr(ys.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "CyTOF spillover matrix").then((n) => {
    n != null && n[0] && Ks(n[0]);
  }), Ks = async (n) => {
    Xe(null), Q(null), ge(!1), ye(null), Ge(!1);
    try {
      const r = Tr(await n.text()), u = dt(
        r.input,
        "cytof-spillover"
      );
      if (!u.ok)
        throw new Error(u.errors.map(({ message: f }) => f).join(" "));
      const d = /* @__PURE__ */ new Map();
      for (const { pnn: f } of Tt) {
        const y = f.trim().normalize("NFC");
        d.set(y, (d.get(y) ?? 0) + 1);
      }
      const m = u.value.receiverChannels.filter(
        (f) => d.get(f) === 1
      );
      Yn({
        fileName: n.name,
        source: "file",
        parsed: r,
        matrix: u.value,
        validationWarnings: u.warnings
      }), on(new Set(m));
    } catch (r) {
      Yn(null), on(/* @__PURE__ */ new Set()), Xe(r instanceof Error ? r.message : String(r));
    }
  }, rr = (n, r) => {
    on((u) => {
      const d = new Set(u);
      return r ? d.add(n) : d.delete(n), d;
    });
  }, Ls = async () => {
    var u, d;
    if (!J)
      throw new Error(s("Choose a CyTOF spillover matrix first."));
    const n = ((d = (u = globalThis.crypto) == null ? void 0 : u.randomUUID) == null ? void 0 : d.call(u)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, r = J.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation";
    return Bt(
      {
        kind: "cytof-spillover",
        method: "nnls",
        solverVersion: $r,
        solverSettings: Fr,
        matrix: J.matrix,
        includedChannels: Array.from(Pn)
      },
      {
        profileId: `cytof-${n}`,
        name: r,
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
  }, ar = async () => {
    if (!(Pe.current || B || !J || !(ue != null && ue.canApply) || !l)) {
      if (j && !ke) {
        Xe(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      Xe(null), Q(null), ye(null), Pe.current = !0, Oe(!0), He(J.fileName);
      try {
        const n = await Ls();
        await l(n, ye), Q(s("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: n.name,
          channels: Pn.size,
          files: Je
        })), Yn(null), on(/* @__PURE__ */ new Set()), Ge(!1), ye(null);
      } catch (n) {
        const r = n instanceof Error ? n.message : String(n);
        /cancel/i.test(r) ? Q(s("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : Xe(r);
      } finally {
        Pe.current = !1, Oe(!1), He(null);
      }
    }
  }, or = async () => {
    if (!(Pe.current || B || !J || !(ue != null && ue.canApply) || !Qe || !v || !At)) {
      if (j && !ke) {
        Xe(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before adopting the assay.")
        );
        return;
      }
      Xe(null), Q(null), ye(null), Pe.current = !0, Oe(!0), He(Qe.label);
      try {
        const n = await Ls();
        await v(
          n,
          Qe,
          ye
        ), Q(s("Using existing SCE assay {assay} with {matrix}. No assay values were recomputed.", {
          assay: Qe.label,
          matrix: n.name
        })), Yn(null), on(/* @__PURE__ */ new Set()), Ge(!1), Qn(!1), ye(null);
      } catch (n) {
        Xe(n instanceof Error ? n.message : String(n));
      } finally {
        Pe.current = !1, Oe(!1), He(null);
      }
    }
  }, lr = async () => {
    var d, m;
    if (Pe.current || B || !l) return;
    if (j && !ke) {
      ge(!0), Q(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before starting a matrix.")
      );
      return;
    }
    const n = t.channels.map((f, y) => ({ pnn: f.pnn, index: y })).filter(({ index: f }) => t.isFluorChannel(f) && !t.isImagingFeatureChannel(f)).map(({ pnn: f }) => f);
    if (n.length < 2) {
      ge(!0), Q(s("An empty matrix needs at least two fluorescence channels."));
      return;
    }
    const r = dt({
      sourceChannels: n,
      receiverChannels: n,
      matrix: n.map((f, y) => n.map((O, _) => y === _ ? 1 : 0))
    }, "flow-spillover");
    if (!r.ok) {
      ge(!0), Q(r.errors.map(({ message: f }) => f).join(" "));
      return;
    }
    const u = `${i.replace(/\.fcs$/i, "") || "Flow"} manual matrix`;
    Q(null), ge(!1), ye(null), Pe.current = !0, Oe(!0), He(u);
    try {
      const f = ((m = (d = globalThis.crypto) == null ? void 0 : d.randomUUID) == null ? void 0 : m.call(d)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, y = await Bt(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: Gs,
          solverSettings: qs,
          matrix: r.value
        },
        {
          profileId: `flow-manual-${f}`,
          name: u,
          createdAt: /* @__PURE__ */ new Date(),
          origin: { type: "manual", startedAs: "identity" },
          provenance: {
            sourceDescription: "Identity matrix over the file's fluorescence channels, to be set by hand in GateLab",
            estimationMethod: "Manual"
          }
        }
      );
      await l(y, ye), Ge(!1), Q(s("Manual matrix editing is ready: every spillover starts at zero. Select a pair and set its coefficient."));
    } catch (f) {
      ge(!0), Q(f instanceof Error ? f.message : String(f));
    } finally {
      Pe.current = !1, Oe(!1);
    }
  }, cr = async () => {
    if (!(!p || B || Xn)) {
      if (j && !ke) {
        ge(!0), Q(
          s("Confirm that existing gate memberships will be recomputed in original coordinates before removing the matrix.")
        );
        return;
      }
      vs(!0);
      try {
        await p(), ge(!1), Q(s("The matrix was removed. The original assay is active and every file reads its stored values."));
      } catch (n) {
        ge(!0), Q(n instanceof Error ? n.message : String(n));
      } finally {
        vs(!1);
      }
    }
  }, dr = async () => {
    var r, u, d;
    if (Pe.current || B || !ne || !((r = Ee == null ? void 0 : Ee.validation) != null && r.ok) || !l) return;
    if (j && !ke) {
      ge(!0), Q(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const n = (me == null ? void 0 : me.name) || `${i.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    Q(null), ge(!1), ye(null), Pe.current = !0, Oe(!0), He(n);
    try {
      const m = ((d = (u = globalThis.crypto) == null ? void 0 : u.randomUUID) == null ? void 0 : d.call(u)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, f = await Bt(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: Gs,
          solverSettings: qs,
          matrix: Ee.validation.value
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
              ...Ee.keyword ? { keyword: Ee.keyword } : {}
            }
          },
          provenance: {
            sourceDescription: me ? "Flow spillover matrix from metadata(sce)$spillover_matrix" : "Spillover matrix embedded in the source FCS file",
            estimationMethod: me ? "Imported from SCE metadata; coefficients preserved exactly" : "Imported from FCS; coefficients preserved exactly"
          }
        }
      );
      await l(f, ye), Ge(!1), Q(s(me ? "Flow matrix editing is ready. The exact hosted matrix is retained as the baseline, and Original measurements remain available." : "Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available."));
    } catch (m) {
      ge(!0), Q(m instanceof Error ? m.message : String(m));
    } finally {
      Pe.current = !1, Oe(!1), He(null), ye(null);
    }
  }, Os = (n, r) => {
    var m, f;
    const u = ae[n], d = le[r];
    !c || !u || !d || c.sourceAxisKeys[n] === c.receiverAxisKeys[r] || (Ce(`${c.sourceAxisKeys[n]}${_e}${c.receiverAxisKeys[r]}`), (f = (m = js.current) == null ? void 0 : m.querySelector(
      `button[data-source-index="${n}"][data-receiver-index="${r}"]`
    )) == null || f.focus());
  }, ur = (n, r, u) => {
    if (!c) return;
    const d = c.sourceAxisKeys.length, m = c.receiverAxisKeys.length;
    let f = r, y = u;
    const O = (L, H) => {
      let ie = L + H;
      for (; ie >= 0 && ie < m; ) {
        if (c.sourceAxisKeys[r] !== c.receiverAxisKeys[ie]) return ie;
        ie += H;
      }
      return L;
    }, _ = (L, H) => {
      let ie = L + H;
      for (; ie >= 0 && ie < d; ) {
        if (c.sourceAxisKeys[ie] !== c.receiverAxisKeys[u]) return ie;
        ie += H;
      }
      return L;
    };
    switch (n.key) {
      case "ArrowLeft":
        y = O(u, -1);
        break;
      case "ArrowRight":
        y = O(u, 1);
        break;
      case "ArrowUp":
        f = _(r, -1);
        break;
      case "ArrowDown":
        f = _(r, 1);
        break;
      case "Home": {
        y = c.sourceAxisKeys[r] === c.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const L = m - 1;
        y = c.sourceAxisKeys[r] === c.receiverAxisKeys[L] ? L - 1 : L;
        break;
      }
      default:
        return;
    }
    n.preventDefault(), Os(f, y);
  }, zn = (n, r) => {
    if (!N || !Number.isFinite(r)) return;
    const [u, d] = n.split(_e), m = N.scientific.matrix.sourceChannels.indexOf(u), f = N.scientific.matrix.receiverChannels.indexOf(d);
    if (m < 0 || f < 0) return;
    if (N.scientific.kind === "cytof-spillover" && r < 0) {
      ge(!0), Q(s("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const y = N.scientific.matrix.matrix[m][f];
    Hn((O) => {
      const _ = { ...O };
      return r === y ? delete _[n] : _[n] = r, _;
    }), ge(!1), Q(s("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: u,
      receiver: d,
      value: (r * 100).toFixed(2)
    }));
  }, Ds = (n, r, u, d) => {
    const m = u[0];
    if (!m) return null;
    const f = m.sourceChannels.indexOf(n.source.pnn), y = m.sourceChannels.indexOf(n.receiver.pnn);
    if (f < 0 || y < 0) return null;
    const O = Wt(
      t,
      n.source.pnn,
      n.receiver.pnn,
      d,
      m.currentColumns[f],
      m.currentColumns[y],
      { totalEvents: de }
    );
    if (!O.ready) return null;
    const _ = [{
      value: n.coefficient,
      isCurrent: !0,
      preview: O.preview
    }];
    return u.forEach((L, H) => {
      const ie = L.sourceChannels.indexOf(n.source.pnn), ze = L.sourceChannels.indexOf(n.receiver.pnn);
      if (ie < 0 || ze < 0) return;
      const Ne = Wt(
        t,
        n.source.pnn,
        n.receiver.pnn,
        d,
        L.candidateColumns[ie],
        L.candidateColumns[ze],
        {
          totalEvents: de,
          xRange: O.preview.xRange,
          yRange: O.preview.yRange
        }
      );
      Ne.ready && _.push({
        value: r[H],
        isCurrent: !1,
        preview: Ne.preview
      });
    }), _.sort((L, H) => L.value - H.value || Number(H.isCurrent) - Number(L.isCurrent)), { pairKey: n.pairKey, values: Object.freeze(_) };
  }, hr = async (n) => {
    if (!N || !c || !R || B || he || je) return;
    const r = Ln(n.pairKey, n.coefficient);
    if (r.error) {
      be(r.error);
      return;
    }
    const u = pn(
      t.fcs.nEvents,
      ui,
      pe
    );
    if (u.length === 0) {
      be(s("The selected review population contains no events."));
      return;
    }
    const d = ++Fe.current, m = [r.lower, r.upper];
    bn(n.pairKey), be(null);
    try {
      const f = await R(
        N,
        u,
        m.map((O) => xi(
          N,
          c.sourceAxisKeys[n.sourceIndex],
          c.receiverAxisKeys[n.receiverIndex],
          O
        )),
        void 0,
        1
      );
      if (Fe.current !== d) return;
      const y = Ds(n, m, f, u);
      if (!y) throw new Error(s("The fast bounds preview could not be built for this pair."));
      an((O) => ({ ...O, [n.pairKey]: y }));
    } catch (f) {
      if (Fe.current !== d) return;
      const y = f instanceof Error ? f.message : String(f);
      be(/cancel/i.test(y) ? s("Fast bounds preview cancelled.") : y);
    } finally {
      Fe.current === d && bn(null);
    }
  }, pr = async () => {
    var d;
    if (!N || !R || De.length === 0 || B || he !== null || je !== null) return;
    if (Kt > 0) {
      be(s("Fix the sweep bounds for {count} flagged pairs before running.", { count: Kt }));
      return;
    }
    const n = pn(
      t.fcs.nEvents,
      di,
      pe
    );
    if (n.length === 0) {
      be(s("The selected review population contains no events."));
      return;
    }
    const r = ++Fe.current, u = De.flatMap((m) => {
      const f = Ln(m.pairKey, m.coefficient);
      return va(f.lower, f.upper).map((y) => ({
        pair: m,
        value: y,
        matrix: xi(
          N,
          c.sourceAxisKeys[m.sourceIndex],
          c.receiverAxisKeys[m.receiverIndex],
          y
        )
      }));
    });
    be(null), Ye({}), yn({ completed: 0, total: u.length });
    try {
      const m = await R(
        N,
        n,
        u.map(({ matrix: y }) => y),
        (y, O) => {
          Fe.current === r && yn({ completed: y, total: O });
        },
        Ct
      );
      if (Fe.current !== r) return;
      if (m.length !== u.length)
        throw new Error(s("The compensation worker returned an incomplete coefficient sweep."));
      const f = {};
      for (const y of De) {
        const O = u.flatMap((L, H) => L.pair.pairKey === y.pairKey ? [H] : []), _ = Ds(
          y,
          O.map((L) => u[L].value),
          O.map((L) => m[L]),
          n
        );
        _ && (f[y.pairKey] = _);
      }
      Ye(f), Fn(((d = De[0]) == null ? void 0 : d.pairKey) ?? null);
    } catch (m) {
      if (Fe.current !== r) return;
      const f = m instanceof Error ? m.message : String(m);
      be(/cancel/i.test(f) ? s("Exact coefficient sweep cancelled.") : f);
    } finally {
      Fe.current === r && yn(null);
    }
  }, mr = () => {
    Fe.current++, K == null || K(), yn(null), bn(null), be(s("Exact coefficient sweep cancelled."));
  }, gr = async () => {
    var r, u;
    if (!N || !Cn || !l || Object.keys(X).length === 0) return;
    const n = `${Gt(N.name)} · edited`;
    Q(null), ge(!1), Oe(!0), He(n), ye(null);
    try {
      const m = {
        profileId: `comp-edit-${((u = (r = globalThis.crypto) == null ? void 0 : r.randomUUID) == null ? void 0 : u.call(r)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: n,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(X).length} compensation coefficient${Object.keys(X).length === 1 ? "" : "s"} in GateLab.`
      }, f = (k == null ? void 0 : k.recordType) === "baseline" && ba(Cn, k.scientific.matrix.matrix) ? await Er(N, k, m) : await Ar(
        N,
        fa(N, Cn),
        m
      );
      await l(f, ye), Hn({}), sn({}), Ye({}), an({}), bn(null), be(null), kt((y) => y + 1), se.length > 0 && (Wn("attention"), Ce(se[0].pairKey), Fn(se[0].pairKey)), Q(s("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: Gt(f.name),
        flagged: se.length > 0 ? s(
          se.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: se.length }
        ) : ""
      }));
    } catch (d) {
      ge(!0), Q(d instanceof Error ? d.message : String(d));
    } finally {
      Oe(!1), He(null), ye(null);
    }
  }, zs = (n) => {
    if (se.length === 0) return;
    const r = se.findIndex(({ pairKey: m }) => m === Ve), u = r < 0 ? n > 0 ? 0 : se.length - 1 : (r + n + se.length) % se.length, d = se[u];
    Ke(null), Ce(d.pairKey), Fn(d.pairKey);
  }, Dt = () => /* @__PURE__ */ e.jsx(
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
      onPointerDown: tr,
      onKeyDown: sr,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), fr = (n) => {
    Ke(null), Ce(n), jt(!0), Ft.some((r) => r.pairKey === n) && (Te.some((r) => r.pairKey === n) || (qn("all"), cs("")), ds(n));
  }, zt = (n, r = !1) => {
    const u = b ? Nn.has(b.pairKey) : !1, d = b ? se.find(({ pairKey: Y }) => Y === b.pairKey) ?? null : null, m = b ? Rt(b.pairKey, b.value) : null, f = b ? Ln(b.pairKey, b.value) : null, y = b ? Ui[b.pairKey] : null, O = b ? c.sourceAxisKeys[b.sourceIndex] : "", _ = b ? c.receiverAxisKeys[b.receiverIndex] : "", L = b != null && b.interaction && b.interaction !== "self" && b.interaction !== "other" ? 1 : 0, H = b && (we != null && we.ready) ? Xt({
      coefficient: b.value,
      physicalPrior: L,
      evidence: we.preview.evidence
    }, c.kind, We) : null, ie = b ? xa(k, O, _) : null, ze = (b == null ? void 0 : b.value) ?? null, Ne = b ? X[b.pairKey] : void 0, Mn = !!(b && (N == null ? void 0 : N.scientific.kind) === "flow-spillover" && E && Object.keys(X).length > 0), Ze = qe.state !== "idle" && qe.state !== "error" && qe.pairKey === (b == null ? void 0 : b.pairKey) ? qe.preview : null, cn = Ze ?? (we != null && we.ready ? we.preview : null), dn = [];
    ie !== null && ze !== null && ((N == null ? void 0 : N.recordType) === "revision" || ie !== ze) && dn.push({ label: s("Baseline"), value: ie }), ze !== null && dn.push({ label: s("Installed"), value: ze }), Ne !== void 0 && dn.push({ label: s("Staged"), value: Ne });
    const un = se.findIndex(({ pairKey: Y }) => Y === Ve);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${r ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: s("Selected coefficient") }),
          !r && /* @__PURE__ */ e.jsx("span", { children: s(bt ? "Hover preview · click to pin this pair." : Ve ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inspector-actions", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flag-navigation", "aria-label": s("Flagged compensation pair navigation"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Previous flagged compensation pair"),
                disabled: se.length === 0,
                onClick: () => zs(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: un >= 0 ? s("{current} / {total} flagged", { current: un + 1, total: se.length }) : s("{total} flagged", { total: se.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Next flagged compensation pair"),
                disabled: se.length === 0,
                onClick: () => zs(1),
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
      b ? /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-pair-detail${r ? " is-global" : ""}`, children: [
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
        H && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${H.category}`,
            title: s(H.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: s(H.label) }),
              /* @__PURE__ */ e.jsx("span", { children: s(H.detail) })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: u,
              disabled: !N || !ce.has(c.sourceAxisKeys[b.sourceIndex]) || !ce.has(c.receiverAxisKeys[b.receiverIndex]),
              onChange: (Y) => On(b.pairKey, Y.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: s("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: s("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: s("Stored fraction: {value}", { value: re(b.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: s(X[b.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(X[b.pairKey] ?? b.value) ? `${((X[b.pairKey] ?? b.value) * 100).toFixed(1)}%` : String(X[b.pairKey] ?? b.value) })
        ] }),
        dn.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": s("Coefficient history"), children: dn.map((Y, hn) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          hn > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: s("Exact fraction: {value}", { value: re(Y.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: Y.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (Y.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${Y.label}:${hn}`)) }),
        N && Ve === b.pairKey && !bt && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              An,
              {
                step: "0.1",
                value: Zn,
                disabled: B,
                onValueChange: (Y) => {
                  Et(Y), N.scientific.kind === "flow-spillover" && Y.trim() !== "" && Number.isFinite(Number(Y)) && zn(b.pairKey, Number(Y) / 100);
                }
              }
            )
          ] }),
          N.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: s("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: B || !Number.isFinite(Number(Zn)) || Zn.trim() === "",
              onClick: () => zn(b.pairKey, Number(Zn) / 100),
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
                zn(b.pairKey, b.value), sn((Y) => {
                  const hn = { ...Y };
                  return delete hn[b.pairKey], hn;
                });
              },
              children: s("Reset")
            }
          )
        ] }),
        Mn && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-candidate-status${r ? " is-compact" : ""}`, "aria-label": s("Flow compensation coefficient preview"), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Coefficient preview") }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              s("Original remains fixed; the right panel shows the complete working matrix."),
              r ? s(" The gallery remains installed until Apply.") : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("em", { children: Ne === void 0 ? s("Working matrix") : `${(b.value * 100).toFixed(1)}% → ${(Ne * 100).toFixed(1)}%` }),
          qe.state === "updating" && qe.pairKey === b.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: s("Updating…") }),
          qe.state === "error" && qe.pairKey === b.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: s(qe.message) })
        ] }),
        b.interaction && b.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          s("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: b.interaction })
        ] }),
        r && (cn ? /* @__PURE__ */ e.jsx(
          li,
          {
            preview: cn,
            sourceLabel: b.source.label,
            receiverLabel: b.receiver.label,
            kind: c.kind,
            densitySmoothing: en,
            compact: !0,
            compensatedTitle: s(Ze ? "Candidate" : "Compensated")
          }
        ) : we && !we.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(we.reason) }) : null),
        r && /* @__PURE__ */ e.jsx(
          sa,
          {
            matrixView: c,
            sourceChannels: ae,
            receiverChannels: le,
            selectedSourceIndex: b.sourceIndex,
            selectedReceiverIndex: b.receiverIndex,
            stagedCoefficients: X,
            maximumAbsoluteOffDiagonal: Ps,
            onSelect: fr
          }
        ),
        !r && (cn ? /* @__PURE__ */ e.jsx(
          li,
          {
            preview: cn,
            sourceLabel: b.source.label,
            receiverLabel: b.receiver.label,
            kind: c.kind,
            densitySmoothing: en,
            compensatedTitle: s(Ze ? "Candidate" : "Compensated")
          }
        ) : we && !we.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(we.reason) }) : null),
        u && d && m && f && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
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
                  disabled: B || he !== null || je !== null,
                  onValueChange: (Y) => rt(b.pairKey, b.value, "lowerPercent", Y)
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
                  disabled: B || he !== null || je !== null,
                  onValueChange: (Y) => rt(b.pairKey, b.value, "upperPercent", Y)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: B || he !== null || je !== null || f.error !== null,
                onClick: () => void hr(d),
                children: s(je === b.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          f.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: s(f.error) }) : /* @__PURE__ */ e.jsx("small", { children: s("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(de, ui).toLocaleString(),
            sweep: Math.min(de, di).toLocaleString()
          }) }),
          y && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: y.values.map((Y) => /* @__PURE__ */ e.jsx("div", { className: Y.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            ft,
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
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s(c.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: s("No coefficient selected.") })
    ] });
  }, _t = (n, r, u = Kn) => /* @__PURE__ */ e.jsx(
    ia,
    {
      dataset: r,
      pair: n,
      plotSize: u,
      densitySmoothing: en,
      flagged: Nn.has(n.pairKey),
      selected: Ve === n.pairKey,
      onSelect: () => {
        Ke(null), Ce(n.pairKey), jt(!0);
      },
      onFlag: (d) => On(n.pairKey, d)
    },
    n.pairKey
  ), xr = async (n, r) => {
    if (!(te != null && te.ready) || !c)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const u = ws.map((d) => ({
      pairKey: d.pairKey,
      sourceLabel: d.source.label,
      receiverLabel: d.receiver.label,
      coefficient: d.coefficient,
      relationship: d.interaction,
      buildPreview: () => {
        const m = ji(
          te.dataset,
          d.source.key,
          d.receiver.key
        );
        if (!m.ready) throw new Error(m.reason);
        return m.preview;
      }
    }));
    await Hr(u, {
      sampleName: i,
      profileName: (N == null ? void 0 : N.name) ?? s(c.title),
      populationName: (ee == null ? void 0 : ee.name) ?? s("All Events"),
      filterLabel: Ns,
      densitySmoothing: en,
      densityColorPower: Z,
      pointAlpha: st,
      pointSize: it
    }, n, r);
  };
  return V ? /* @__PURE__ */ e.jsx(is.Provider, { value: Z, children: /* @__PURE__ */ e.jsx(rs.Provider, { value: st, children: /* @__PURE__ */ e.jsx(as.Provider, { value: it, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab gl-plotting-workspace gl-comp-workspace",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-plotting-head gl-comp-head gl-comp-overview${Se === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsx("h2", { className: "gl-tab-title", children: s("Compensation") }),
            !z && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: ot })
          ] }),
          z ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${G.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: s("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: lt,
                method: ot,
                count: Ot,
                status: s(G.state === "ready" ? "Ready" : "Unavailable"),
                assay: s(o ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${G.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  s("{kind} compensation installed. Installed compensation profile.", {
                    kind: z.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                /* @__PURE__ */ e.jsx("strong", { children: Qi }),
                /* @__PURE__ */ e.jsx("span", { children: s("{method} · {count} ch · {status}", {
                  method: ot,
                  count: Ot,
                  status: G.state === "ready" ? s("Ready") : s("Unavailable")
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
                source: s($s),
                assay: s(o ? "Compensated assay active" : "Original assay active"),
                count: Ot
              })
            }
          ),
          z && t.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: B,
              onClick: Rs,
              children: s("Replace matrix…")
            }
          ),
          z && p && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-header-remove", children: [
            j && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: ke,
                  disabled: B || Xn,
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
                disabled: B || Xn,
                title: s("Uninstall the matrix: every file returns to the original assay and the matrix leaves the workspace."),
                onClick: () => void cr(),
                children: s(Xn ? "Removing…" : "Remove the matrix")
              }
            )
          ] }),
          er && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-global-layer-note", children: s("Assay selection in the top bar applies to every tab.") })
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
                    checked: ke,
                    disabled: B,
                    onChange: (n) => Ge(n.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
              ] }),
              h.length > 0 && !(Ee != null && Ee.error) && /* @__PURE__ */ e.jsx("p", { className: "gl-hint gl-comp-embedded-others", children: s("Enabling also returns {count} other files to Original: {files}. A workspace keeps one kind of compensation, and these draw from their own embedded matrix.", {
                count: h.length,
                files: h.join(", ")
              }) }),
              Ee != null && Ee.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: Ee.error }) : B ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
                oe ? s("Preparing editor… {percent}%", { percent: Math.round(oe.fraction * 100) }) : s("Preparing editor…"),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (oe == null ? void 0 : oe.phase) === "cancelling",
                    onClick: g,
                    children: s((oe == null ? void 0 : oe.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                )
              ] }) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: !l || j && !ke,
                  onClick: () => void dr(),
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
                    checked: ke,
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
                  disabled: !l || j && !ke,
                  onClick: () => void lr(),
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
                  disabled: he !== null || je !== null,
                  onChange: (n) => Nt(n.currentTarget.value),
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
            Se !== "global" && /* @__PURE__ */ e.jsxs(
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
                      value: String(nt),
                      disabled: B,
                      onChange: (n) => {
                        const r = n.currentTarget.value;
                        Ii(r === "all" ? "all" : Number(r));
                      },
                      children: [
                        pi.map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: s("{count} events", { count: n.toLocaleString() }) }, n)),
                        /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All available") })
                      ]
                    }
                  ),
                  /* @__PURE__ */ e.jsx("small", { children: s("Showing {shown} of {total}; Apply always uses all events.", {
                    shown: In.length.toLocaleString(),
                    total: de.toLocaleString()
                  }) })
                ]
              }
            )
          ] }),
          (P !== void 0 && I !== void 0 && M || c && Object.keys(X).length > 0) && /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Apply") }),
            P !== void 0 && I !== void 0 && M && /* @__PURE__ */ e.jsxs(
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
                      value: P,
                      disabled: B,
                      onChange: (n) => M(Number(n.currentTarget.value)),
                      children: Array.from({ length: I }, (n, r) => r + 1).map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("small", { children: [
                    "/ ",
                    I
                  ] })
                ]
              }
            ),
            c && Object.keys(X).length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
              /* @__PURE__ */ e.jsxs("span", { children: [
                s("{count} pending edits", { count: Object.keys(X).length }),
                (N == null ? void 0 : N.scientific.kind) === "cytof-spillover" ? ` · ${s("{files} checked FCS files", { files: Je })}` : ""
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  disabled: B,
                  onClick: () => {
                    Hn({}), sn({}), Q(null);
                  },
                  children: s("Discard")
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: B || he !== null || je !== null || !l || (N == null ? void 0 : N.scientific.kind) === "cytof-spillover" && Je === 0,
                  onClick: () => void gr(),
                  children: s("Apply revised matrix")
                }
              )
            ] })
          ] }),
          c && /* @__PURE__ */ e.jsxs("section", { children: [
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
                      onChange: (n) => Ai(Number(n.currentTarget.value))
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
                      value: st,
                      "aria-label": s("Compensation biplot point alpha"),
                      onChange: (n) => $i(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: st.toFixed(2) })
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
                      value: it,
                      "aria-label": s("Compensation biplot point size"),
                      onChange: (n) => Pi(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("output", { children: [
                    it.toFixed(1),
                    "×"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              Sr,
              {
                className: "gl-comp-density-colour",
                value: Z,
                onChange: q
              }
            )
          ] }),
          (c || z) && /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Tools") }),
            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: ca.map(({ id: n, label: r }) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                id: `comp-drawer-${n}-button`,
                className: "gl-comp-drawer-toggle",
                "aria-expanded": Vn[n],
                "aria-controls": `comp-drawer-${n}`,
                onClick: () => nr(n),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { children: [
                    s(r),
                    n === "review" && at.length > 0 ? ` (${at.length})` : ""
                  ] }),
                  /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: Vn[n] ? "▾" : "▸" })
                ]
              },
              n
            )) })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-prop-body gl-comp-body", children: [
          c && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-workspace-tabs", role: "tablist", "aria-label": s("Compensation workspace"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": Se === "matrix",
                className: Se === "matrix" ? "active" : void 0,
                onClick: () => {
                  Ke(null), Wn("matrix");
                },
                children: s("Matrix")
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": Se === "global",
                className: Se === "global" ? "active" : void 0,
                onClick: () => {
                  Ke(null), Wn("global");
                },
                children: s("Global inspector")
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": Se === "attention",
                className: Se === "attention" ? "active" : void 0,
                onClick: () => {
                  Ke(null), Wn("attention");
                },
                children: [
                  s("Flagged"),
                  se.length > 0 ? ` (${se.length})` : ""
                ]
              }
            )
          ] }),
          t.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "input",
            {
              ref: ys,
              type: "file",
              accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
              className: "gl-sr-only",
              "aria-label": s("Choose CyTOF spillover matrix"),
              onChange: (n) => void ir(n)
            }
          ),
          gs && /* @__PURE__ */ e.jsx("div", { className: fs ? "gl-comp-error" : "gl-comp-status", role: fs ? "alert" : "status", children: s(gs) }),
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
                  onClick: Rs,
                  children: s(J ? "Choose another matrix…" : "Import matrix…")
                }
              ) })
            ] }),
            xs && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s(xs) }),
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
                const r = ue.matchedChannels.includes(n);
                return /* @__PURE__ */ e.jsxs("label", { className: r ? "" : "is-unavailable", title: r ? n : s("{channel} is not uniquely present in this FCS file", { channel: n }), children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: Pn.has(n),
                      disabled: !r || B,
                      onChange: (u) => rr(n, u.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: Ht(t, n).combined }),
                  !r && /* @__PURE__ */ e.jsx("small", { children: s("not matched") })
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
                    checked: ke,
                    disabled: B,
                    onChange: (n) => Ge(n.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: s("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                  /* @__PURE__ */ e.jsx("span", { children: B ? oe ? s("{phase}… {percent}% ({processed} / {total} events)", {
                    phase: s(oe.phase === "cancelling" ? "Cancelling" : oe.phase === "preparing" ? "Preparing" : "Applying"),
                    percent: Math.round(oe.fraction * 100),
                    processed: oe.processedEvents.toLocaleString(),
                    total: oe.totalEvents.toLocaleString()
                  }) : s("Preparing compensation…") : s("The Original assay is retained and can be restored at any time.") }),
                  /* @__PURE__ */ e.jsx("strong", { className: Je === 0 ? "is-empty" : void 0, children: Je === 0 ? s("No FCS files are checked. Select at least one file in Samples.") : s("Applies atomically to {files} checked FCS files · {events} total events", {
                    files: Je,
                    events: Hi.toLocaleString()
                  }) })
                ] }),
                B ? /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (oe == null ? void 0 : oe.phase) === "cancelling",
                    onClick: g,
                    children: s((oe == null ? void 0 : oe.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                ) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn",
                    disabled: !l || Je === 0 || !ue.canApply || j && !ke,
                    onClick: () => void ar(),
                    children: s("Apply NNLS compensation")
                  }
                )
              ] }),
              x.length > 0 && v && /* @__PURE__ */ e.jsxs(
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
                            bs(n.currentTarget.value), Qn(!1);
                          },
                          children: x.map((n) => /* @__PURE__ */ e.jsx("option", { value: n.id, children: n.label === n.id ? n.id : `${n.label} (${n.id})` }, n.id))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-adopt-confirm", children: [
                      /* @__PURE__ */ e.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: At,
                          disabled: B,
                          onChange: (n) => Qn(n.currentTarget.checked)
                        }
                      ),
                      /* @__PURE__ */ e.jsx("span", { children: s("I confirm this assay was computed from the selected source assay using this exact matrix and channel set.") })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: B || !Qe || !At || Je === 0 || !ue.canApply || j && !ke,
                        onClick: () => void or(),
                        children: s("Use existing assay — no recomputation")
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          Ts && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
          As.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
            /* @__PURE__ */ e.jsx("span", { children: s("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
              count: As.length
            }) }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => os((n) => ({ ...n, review: !0 })), children: s("Review details") })
          ] }),
          z && G.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
          c && Se === "matrix" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: wn,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${xn}px` },
              children: [
                /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrix-panel", "aria-labelledby": "comp-matrix-heading", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-matrix-head", children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("h3", { id: "comp-matrix-heading", children: s(c.title) }),
                      /* @__PURE__ */ e.jsx("span", { children: s(c.subtitle) })
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
                          onClick: () => ps(!0),
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
                        width: 18 + Dn.rowLabelWidth + c.receiverAxisKeys.length * ln + Dn.overhang,
                        "--gl-comp-row-label-w": `${Dn.rowLabelWidth}px`,
                        "--gl-comp-col-label-w": `${Dn.columnLabelWidth}px`,
                        "--gl-comp-col-label-h": `${Dn.columnLabelHeight}px`
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
                                  gridTemplateColumns: `repeat(${c.receiverAxisKeys.length}, ${ln}px)`
                                },
                                children: le.map((n, r) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (b == null ? void 0 : b.receiverIndex) === r ? "is-selected" : void 0,
                                    title: n.combined,
                                    children: /* @__PURE__ */ e.jsx("span", { children: n.combined })
                                  },
                                  c.receiverAxisKeys[r]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                className: "gl-comp-row-labels",
                                "aria-label": s("Source channel labels"),
                                style: {
                                  gridTemplateRows: `repeat(${c.sourceAxisKeys.length}, ${ln}px)`
                                },
                                children: ae.map((n, r) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (b == null ? void 0 : b.sourceIndex) === r ? "is-selected" : void 0,
                                    title: n.combined,
                                    children: n.combined
                                  },
                                  c.sourceAxisKeys[r]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                ref: js,
                                className: "gl-comp-matrix shows-values",
                                role: "grid",
                                "aria-label": s("Compensation matrix; source rows and receiver columns"),
                                "aria-rowcount": c.sourceAxisKeys.length,
                                "aria-colcount": c.receiverAxisKeys.length,
                                style: {
                                  gridTemplateColumns: `repeat(${c.receiverAxisKeys.length}, ${ln}px)`,
                                  gridTemplateRows: `repeat(${c.sourceAxisKeys.length}, ${ln}px)`
                                },
                                children: c.matrix.map((n, r) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    role: "row",
                                    className: "gl-comp-matrix-row",
                                    "aria-rowindex": r + 1,
                                    children: n.map((u, d) => {
                                      const m = c.sourceAxisKeys[r], f = c.receiverAxisKeys[d], y = `${m}${_e}${f}`, O = X[y], _ = O ?? u, L = m === f, H = (b == null ? void 0 : b.sourceIndex) === r && b.receiverIndex === d, ie = (b == null ? void 0 : b.sourceIndex) === r, ze = (b == null ? void 0 : b.receiverIndex) === d, Ne = ae[r], Mn = le[d], Ze = c.kind === "cytof" ? kn(m, f) : null, cn = Mr(
                                        _,
                                        Ps,
                                        L
                                      ), dn = c.receiverAxisKeys.findIndex((ve) => ve !== m), un = Ve === y, Y = Ve === null && r === 0 && d === dn, hn = Number.isFinite(_) ? _ === 0 ? "" : (_ * 100).toFixed(1) : String(_), Bs = Ze && Ze !== "other" && Ze !== "self" ? ` · ${Ze}` : "", vr = zi[y] ?? fi(_);
                                      return Sn && !L ? /* @__PURE__ */ e.jsx(
                                        An,
                                        {
                                          role: "gridcell",
                                          className: `gl-comp-cell gl-comp-cell-input${H ? " selected" : ""}${un ? " is-pinned" : ""}${O === void 0 ? "" : " is-staged"}${ie ? " is-selected-source" : ""}${ze ? " is-selected-receiver" : ""}`,
                                          min: "0",
                                          step: "0.1",
                                          value: vr,
                                          disabled: B,
                                          "data-source-index": r,
                                          "data-receiver-index": d,
                                          "aria-colindex": d + 1,
                                          "aria-selected": un,
                                          "aria-label": s("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                            source: Ne.combined,
                                            receiver: Mn.combined,
                                            pending: O === void 0 ? "" : s(", pending edit")
                                          }),
                                          title: s("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                            source: Ne.combined,
                                            receiver: Mn.combined,
                                            pending: O === void 0 ? "" : s(" · pending edit")
                                          }),
                                          style: cn,
                                          onFocus: () => Ce(y),
                                          onMouseEnter: () => Ke(y),
                                          onMouseLeave: () => Ke((ve) => ve === y ? null : ve),
                                          onClick: () => Ce(y),
                                          onValueChange: (ve) => {
                                            Ce(y), sn((_n) => ({ ..._n, [y]: ve })), ve.trim() !== "" && Number.isFinite(Number(ve)) && zn(y, Number(ve) / 100);
                                          },
                                          onBlur: (ve) => {
                                            const _n = ve.currentTarget.value;
                                            if (_n.trim() === "" || !Number.isFinite(Number(_n))) {
                                              sn((Ut) => {
                                                const Vs = { ...Ut };
                                                return delete Vs[y], Vs;
                                              });
                                              return;
                                            }
                                            sn((Ut) => ({
                                              ...Ut,
                                              [y]: fi(Number(_n) / 100)
                                            }));
                                          }
                                        },
                                        f
                                      ) : /* @__PURE__ */ e.jsx(
                                        "button",
                                        {
                                          type: "button",
                                          role: "gridcell",
                                          className: `gl-comp-cell${L ? " diagonal" : ""}${H ? " selected" : ""}${un ? " is-pinned" : ""}${O === void 0 ? "" : " is-staged"}${ie ? " is-selected-source" : ""}${ze ? " is-selected-receiver" : ""}`,
                                          disabled: L,
                                          tabIndex: L ? -1 : H || Y ? 0 : -1,
                                          "data-source-index": r,
                                          "data-receiver-index": d,
                                          "data-interaction": Ze ?? void 0,
                                          "aria-colindex": d + 1,
                                          "aria-pressed": L ? void 0 : un,
                                          "aria-label": L ? s("{channel} diagonal: {value}", { channel: Ne.combined, value: tn(_) }) : s("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                            source: Ne.combined,
                                            receiver: Mn.combined,
                                            value: tn(_),
                                            pending: O === void 0 ? "" : s(" (pending edit)"),
                                            interaction: Bs
                                          }),
                                          title: L ? `${Ne.combined} · self · ${tn(_)}` : `${Ne.combined} → ${Mn.combined} · ${tn(_)}${O === void 0 ? "" : " · pending edit"}${Bs}`,
                                          style: cn,
                                          onFocus: () => {
                                            L || Ce(y);
                                          },
                                          onMouseEnter: () => {
                                            L || Ke(y);
                                          },
                                          onMouseLeave: () => Ke((ve) => ve === y ? null : ve),
                                          onClick: () => Ce(y),
                                          onKeyDown: (ve) => ur(ve, r, d),
                                          children: /* @__PURE__ */ e.jsx("span", { children: hn })
                                        },
                                        f
                                      );
                                    })
                                  },
                                  c.sourceAxisKeys[r]
                                ))
                              }
                            )
                          ] })
                        ] })
                      ]
                    }
                  ) })
                ] }),
                Dt(),
                zt()
              ]
            }
          ) : c && Se === "global" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: wn,
              className: `gl-comp-common-path gl-comp-global-path${$n ? " has-details" : ""}`,
              style: {
                gridTemplateColumns: $n ? `minmax(440px, 1fr) 8px ${xn}px` : "minmax(0, 1fr)"
              },
              children: [
                /* @__PURE__ */ e.jsx(
                  ra,
                  {
                    stateKey: W,
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
                          value: Le,
                          onChange: (n) => qn(n.currentTarget.value),
                          children: [
                            /* @__PURE__ */ e.jsx("option", { value: "relevant", children: s("Matrix-linked / relevant") }),
                            /* @__PURE__ */ e.jsx("option", { value: "nonzero", children: s("Non-zero coefficients") }),
                            c.kind === "cytof" && /* @__PURE__ */ e.jsx("option", { value: "physical", children: s("Physical CyTOF relationships") }),
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
                          value: fe,
                          onChange: (n) => Si(n.currentTarget.value),
                          children: [
                            /* @__PURE__ */ e.jsx("option", { value: "matrix", children: s("Matrix: sources down, receivers across") }),
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
                          onChange: (n) => cs(n.currentTarget.value)
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
                            value: Kn,
                            "aria-label": s("Global compensation plot size"),
                            onChange: (n) => ki(Number(n.currentTarget.value))
                          }
                        ),
                        /* @__PURE__ */ e.jsx("output", { children: s("{size}px", { size: Kn }) })
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn gl-comp-global-export",
                          disabled: !(te != null && te.ready) || Te.length === 0,
                          title: s("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                          onClick: () => ms(!0),
                          children: s("Export…")
                        }
                      ),
                      /* @__PURE__ */ e.jsx(
                        "span",
                        {
                          className: "gl-comp-global-count",
                          title: s("The Global gallery uses one fixed representative event set so every pair and both assay layers remain directly comparable."),
                          children: s("{pairs} pairs · {shown} / {total} events · {population}", {
                            pairs: Te.length.toLocaleString(),
                            shown: $t.length.toLocaleString(),
                            total: de.toLocaleString(),
                            population: (ee == null ? void 0 : ee.name) ?? s("All Events")
                          })
                        }
                      )
                    ] }),
                    children: te ? te.ready ? Te.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No pairs match the current filter. Choose another filter or clear the channel search.") }) : fe === "compact" ? /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-gallery",
                        "data-event-signature": te.dataset.eventSignature,
                        children: Te.map((n) => _t(n, te.dataset))
                      }
                    ) : fe === "matrix" && c ? /* @__PURE__ */ e.jsxs(
                      "div",
                      {
                        ref: Cs,
                        className: "gl-comp-global-matrix",
                        "data-event-signature": te.dataset.eventSignature,
                        "data-tile-size": It,
                        role: "grid",
                        "aria-label": s("Compensation pairs arranged as the matrix"),
                        style: { gridTemplateColumns: `92px repeat(${c.receiverChannels.length}, ${It}px)` },
                        children: [
                          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-corner", children: [
                            /* @__PURE__ */ e.jsx("span", { children: s("Source ↓") }),
                            /* @__PURE__ */ e.jsx("span", { children: s("Receiver →") })
                          ] }),
                          c.receiverChannels.map((n, r) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-col", title: n.combined, children: [
                            /* @__PURE__ */ e.jsx("strong", { children: n.label }),
                            /* @__PURE__ */ e.jsx("small", { children: n.pnn })
                          ] }, `col-${r}`)),
                          c.sourceChannels.map((n, r) => /* @__PURE__ */ e.jsxs(w.Fragment, { children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-row", title: n.combined, children: [
                              /* @__PURE__ */ e.jsx("strong", { children: n.label }),
                              /* @__PURE__ */ e.jsx("small", { children: n.pnn })
                            ] }),
                            c.receiverChannels.map((u, d) => {
                              const m = Zi.get(`${r}:${d}`);
                              if (m) return _t(m, te.dataset, It);
                              const f = c.sourceAxisKeys[r] === c.receiverAxisKeys[d];
                              return /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  className: `gl-comp-global-matrix-blank${f ? " is-diagonal" : ""}`,
                                  title: f ? s("{channel} into itself", { channel: n.label }) : s("{source} into {receiver}: not shown under the current filter", { source: n.label, receiver: u.label }),
                                  children: f ? /* @__PURE__ */ e.jsx("span", { children: n.label }) : null
                                },
                                `${r}:${d}`
                              );
                            })
                          ] }, `row-${r}`))
                        ]
                      }
                    ) : /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-groups",
                        "data-event-signature": te.dataset.eventSignature,
                        "data-layout": fe,
                        children: Pt.map((n) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                          /* @__PURE__ */ e.jsxs("header", { children: [
                            /* @__PURE__ */ e.jsx("span", { children: s(fe === "source" ? "Source channel" : "Receiver") }),
                            /* @__PURE__ */ e.jsx("strong", { title: n.channel.combined, children: n.channel.label }),
                            /* @__PURE__ */ e.jsx("small", { children: n.channel.pnn }),
                            /* @__PURE__ */ e.jsx("em", { children: s("{count} pairs", { count: n.pairs.length }) })
                          ] }),
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: n.pairs.map((r) => _t(r, te.dataset)) })
                        ] }, n.channel.key))
                      }
                    ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s(te.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No matrix is available for the global inspector.") })
                  }
                ),
                $n && Dt(),
                $n && zt(() => jt(!1), !0)
              ]
            }
          ) : c ? /* @__PURE__ */ e.jsxs(
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
                            value: Ct,
                            disabled: he !== null || je !== null,
                            onChange: (n) => St(Number(n.currentTarget.value)),
                            children: Array.from({ length: mi }, (n, r) => r + 1).map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
                          }
                        )
                      ] }),
                      he ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: mr, children: s("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-btn",
                          disabled: !N || !R || De.length === 0 || Kt > 0 || B || je !== null,
                          onClick: () => void pr(),
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
                          value: We,
                          disabled: B || he !== null || je !== null,
                          onChange: (n) => {
                            Ki(n.currentTarget.value), kt((r) => r + 1), Ye({}), an({}), be(null);
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
                        disabled: B || he !== null || je !== null,
                        onClick: () => {
                          kt((n) => n + 1), Ye({}), an({}), be(null), ge(!1), Q(
                            s(se.length === 1 ? "Recomputed compensation suggestions for {population}. {count} flagged pair was retained." : "Recomputed compensation suggestions for {population}. {count} flagged pairs were retained.", {
                              population: (ee == null ? void 0 : ee.name) ?? s("All Events"),
                              count: se.length
                            })
                          );
                        },
                        children: s("Recompute suggestions")
                      }
                    ),
                    /* @__PURE__ */ e.jsxs("small", { children: [
                      s(We === "biological" ? "Broad positive association is excluded because co-expression and cell size can mimic spill. High-tail shapes remain control-sensitive review prompts." : "Positive residual association may enter the shortlist only because you declared suitable control data."),
                      " ",
                      s("Sweep workers are separate from full-Apply workers.")
                    ] })
                  ] }),
                  he && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-progress", role: "status", "aria-live": "polite", children: [
                    /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, he.total), value: he.completed }),
                    /* @__PURE__ */ e.jsx("span", { children: s("{completed} / {total} exact candidate solves · {workers} workers", {
                      completed: he.completed,
                      total: he.total,
                      workers: Ct
                    }) })
                  ] }),
                  hs && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s(hs) }),
                  N ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": s("Add compensation pair for follow-up"), children: [
                      /* @__PURE__ */ e.jsx("strong", { children: s("Add a pair") }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
                        /* @__PURE__ */ e.jsx(
                          Ws,
                          {
                            label: s("Follow-up source channel"),
                            value: $e,
                            options: c.sourceAxisKeys.flatMap((n, r) => ce.has(n) ? [{ value: n, label: ae[r].combined }] : []),
                            onChange: (n) => {
                              us(n), Me === n && Mt(c.receiverAxisKeys.find((r) => r !== n && ce.has(r)) ?? "");
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Receiver") }),
                        /* @__PURE__ */ e.jsx(
                          Ws,
                          {
                            label: s("Follow-up receiver channel"),
                            value: Me,
                            options: c.receiverAxisKeys.flatMap((n, r) => n !== $e && ce.has(n) ? [{ value: n, label: le[r].combined }] : []),
                            onChange: Mt
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !$e || !Me || $e === Me,
                          onClick: Yi,
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
                        De.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pairs are flagged yet. Tick “Flag for follow-up” in the inspector, add a pair above, or accept a suggestion below.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-list", children: De.map((n, r) => {
                          const u = _i[n.pairKey], d = Bi === n.pairKey, m = Ln(n.pairKey, n.coefficient), f = Rt(n.pairKey, n.coefficient);
                          return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${Ve === n.pairKey ? " is-selected" : ""}`, children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                              /* @__PURE__ */ e.jsxs(
                                "button",
                                {
                                  type: "button",
                                  className: "gl-comp-sweep-pair-head",
                                  "aria-expanded": d,
                                  onClick: () => {
                                    Ce(n.pairKey), Fn(d ? null : n.pairKey);
                                  },
                                  children: [
                                    /* @__PURE__ */ e.jsx("span", { className: "gl-comp-sweep-rank", children: r + 1 }),
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
                                      shift: re(n.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: re(n.evidence.residualSlope ?? 0, 4)
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
                                  onChange: (y) => On(n.pairKey, y.currentTarget.checked)
                                }
                              ) })
                            ] }),
                            d && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-body", children: [
                              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inline-bounds", children: [
                                /* @__PURE__ */ e.jsx("span", { children: s("Four values across") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  s("Lower (%)"),
                                  /* @__PURE__ */ e.jsx(An, { step: "0.1", value: f.lowerPercent, disabled: B || he !== null || je !== null, onValueChange: (y) => rt(n.pairKey, n.coefficient, "lowerPercent", y) })
                                ] }),
                                /* @__PURE__ */ e.jsx("span", { children: s("to") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  s("Upper (%)"),
                                  /* @__PURE__ */ e.jsx(An, { step: "0.1", value: f.upperPercent, disabled: B || he !== null || je !== null, onValueChange: (y) => rt(n.pairKey, n.coefficient, "upperPercent", y) })
                                ] }),
                                m.error && /* @__PURE__ */ e.jsx("small", { children: s(m.error) })
                              ] }),
                              u ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: u.values.map((y) => /* @__PURE__ */ e.jsxs(
                                "div",
                                {
                                  className: `gl-comp-sweep-value${y.isCurrent ? " is-current" : ""}${X[n.pairKey] === y.value ? " is-staged" : ""}`,
                                  children: [
                                    /* @__PURE__ */ e.jsx(
                                      ft,
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
                                        /* @__PURE__ */ e.jsx("dd", { children: s("{value} MAD", { value: re(y.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Slope") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: re(y.preview.evidence.residualSlope ?? 0, 4) })
                                      ] }),
                                      c.kind === "cytof" && /* @__PURE__ */ e.jsxs("div", { children: [
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
                                        onClick: () => zn(n.pairKey, y.value),
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
                            s(We === "biological" ? "Conservative suggestions" : "Control-data suggestions"),
                            " (",
                            Ae.items.length,
                            ")"
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { children: s("{evaluable} evaluable of {screened} screened pairs for {population}. Inspect before flagging.", {
                            evaluable: Ae.evaluableCount.toLocaleString(),
                            screened: Ae.screenedCount.toLocaleString(),
                            population: (ee == null ? void 0 : ee.name) ?? s("All Events")
                          }) })
                        ] }) }),
                        Ae.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: Ae.items.map((n) => {
                          const r = Xt(n, c.kind, We);
                          return /* @__PURE__ */ e.jsxs("article", { className: Nn.has(n.pairKey) ? "is-flagged" : void 0, children: [
                            /* @__PURE__ */ e.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => Ce(n.pairKey),
                                children: [
                                  /* @__PURE__ */ e.jsxs("strong", { children: [
                                    n.source.label,
                                    " → ",
                                    n.receiver.label
                                  ] }),
                                  /* @__PURE__ */ e.jsx("em", { className: `gl-comp-suggestion-badge is-${r.category}`, children: s(r.label) }),
                                  /* @__PURE__ */ e.jsxs("span", { children: [
                                    n.interaction && n.interaction !== "other" ? `${n.interaction} · ` : "",
                                    s("{coefficient}% · shift {shift} MAD · slope {slope}", {
                                      coefficient: (n.coefficient * 100).toFixed(1),
                                      shift: re(n.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: re(n.evidence.residualSlope ?? 0, 4)
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
                                  onChange: (u) => On(n.pairKey, u.currentTarget.checked)
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
                Dt(),
                zt()
              ]
            }
          ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: s(z ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : t.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
          (c || z) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": s("Advanced compensation tools"), children: [
            Vn.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Matrix evidence") }),
              z ? N ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-evidence-grid", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Profile ID") }),
                    /* @__PURE__ */ e.jsx("dd", { children: N.profileId })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Created") }),
                    /* @__PURE__ */ e.jsx("dd", { children: new Date(N.createdAt).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Matrix source") }),
                    /* @__PURE__ */ e.jsx("dd", { children: ja(N, s) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Orientation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("Source rows → receiver columns") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Imported dimensions") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{sources} sources × {receivers} receivers", {
                      sources: N.scientific.matrix.sourceChannels.length,
                      receivers: N.scientific.matrix.receiverChannels.length
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Applied solve") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{count} exact $PnN channels · {status}", {
                      count: z.includedPnns.length,
                      status: G.state
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Matrix hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: N.matrixHash, children: [
                      N.matrixHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Profile hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: N.profileHash, children: [
                      N.profileHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Provenance") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s(((_s = N.provenance) == null ? void 0 : _s.sourceDescription) ?? "No additional source note supplied") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Estimation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s(((Us = N.provenance) == null ? void 0 : Us.estimationMethod) ?? "Imported coefficients preserved exactly") })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-method-card", "aria-label": s("Installed compensation method"), children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Pipeline") }),
                    /* @__PURE__ */ e.jsx("strong", { children: s(N.scientific.kind === "cytof-spillover" ? "Original counts → NNLS → Compensated counts → arcsinh display" : "Original values → linear matrix inverse → Compensated values → display transform") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Solver") }),
                    /* @__PURE__ */ e.jsx("strong", { children: N.scientific.solverVersion }),
                    /* @__PURE__ */ e.jsx("small", { children: N.scientific.solverSettings.map(({ key: n, value: r }) => `${n}=${String(r)}`).join(" · ") })
                  ] })
                ] }),
                Ie && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": s("Original versus Compensated preview"), children: [
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { children: s("Original → Compensated impact") }),
                    /* @__PURE__ */ e.jsx("span", { children: s("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                      events: Ie.previewEvents.toLocaleString(),
                      channels: z.includedPnns.length
                    }) })
                  ] }) }),
                  /* @__PURE__ */ e.jsxs("dl", { children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Values changed") }),
                      /* @__PURE__ */ e.jsxs("dd", { children: [
                        Ie.changedValues.toLocaleString(),
                        " / ",
                        Ie.comparedValues.toLocaleString(),
                        " (",
                        tn(Ie.changedValues / Ie.comparedValues, !1, 4),
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Median |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: re(Ie.medianAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Maximum |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: re(Ie.maxAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Largest median shift") }),
                      /* @__PURE__ */ e.jsxs("dd", { title: Ie.mostChangedChannel, children: [
                        Ie.mostChangedChannel,
                        " · ",
                        re(Ie.mostChangedChannelMedianDelta, 5)
                      ] })
                    ] }),
                    z.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Negative → zero") }),
                      /* @__PURE__ */ e.jsx("dd", { children: s("{count} preview values", { count: Ie.zeroedNegativeValues.toLocaleString() }) })
                    ] })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ e.jsx("p", { children: s("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
                profile: z.profileId,
                method: ot,
                count: z.includedPnns.length,
                status: G.state
              }) }) : /* @__PURE__ */ e.jsx("p", { children: s("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
                channels: ne.channels.length,
                warnings: Lt.length || s("no")
              }) })
            ] }),
            Vn.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Review queue") }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: s("Matrix integrity") }),
                at.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: at.map((n) => /* @__PURE__ */ e.jsx("li", { children: s(n) }, n)) }) : /* @__PURE__ */ e.jsx("p", { children: s("No matrix-level items currently require review.") })
              ] }),
              G.state === "ready" && c && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: s("Residual-evidence shortlist") }),
                /* @__PURE__ */ e.jsx("p", { children: s("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                  screened: Ae.screenedCount.toLocaleString(),
                  candidateSuffix: Ae.candidateCount > Ae.screenedCount ? s(" of {count}", { count: Ae.candidateCount.toLocaleString() }) : "",
                  zeroSuffix: c.kind === "cytof" ? s(", and new exact-zero pile") : "",
                  modeNote: s(We === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
                }) }),
                Ae.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: Ae.items.map((n) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => Os(n.sourceIndex, n.receiverIndex),
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
                          shift: re(n.evidence.normalizedNegativeShift ?? 0, 3),
                          slope: re(n.evidence.residualSlope ?? 0, 4)
                        }),
                        c.kind === "cytof" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
          Vi && c && /* @__PURE__ */ e.jsx(
            ea,
            {
              profileLabel: (N == null ? void 0 : N.name) ?? (me ? "SCE_spillover" : "embedded_FCS"),
              installedLabel: s(
                N ? "Installed matrix" : me ? "SCE spillover matrix" : "Embedded FCS matrix"
              ),
              installedMatrix: {
                sourceChannels: c.sourceAxisKeys,
                receiverChannels: c.receiverAxisKeys,
                matrix: c.matrix
              },
              workingMatrix: Xi,
              pendingEditCount: Object.keys(X).length,
              onClose: () => ps(!1)
            }
          ),
          Wi && /* @__PURE__ */ e.jsx(
            Yr,
            {
              sampleName: i,
              populationName: (ee == null ? void 0 : ee.name) ?? s("All Events"),
              filterLabel: Ns,
              pairCount: ws.length,
              onExport: xr,
              onClose: () => ms(!1)
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
function Ca(t, i) {
  const a = t.visible !== !1, o = i.visible !== !1;
  return a || o ? !1 : t.sample === i.sample && t.stateKey === i.stateKey;
}
const Ma = w.memo(Na, Ca);
export {
  Ma as CompensationTab
};
