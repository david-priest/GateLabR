import { D as cs, r as Ra, l as Ka, s as La, z as Oa, f as Da, u as Le, a as b, j as e, M as Ti, b as za, c as _a, p as $i, d as pe, e as ie, g as sn, h as Ua, v as pt, i as Ba, T as Va, k as Wa, C as ni, m as qa, n as Ga, S as ti, o as Zt, q as si, F as ii, t as Ha, w as Za, x as Ya, y as Xa, A as Ja } from "./embed-BEBIXb3n.js";
function ss(t) {
  const i = t.trim().normalize("NFC"), r = i.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (r)
    return { element: r[1], mass: Number(r[2]) };
  const l = i.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return l ? { element: l[2], mass: Number(l[1]) } : null;
}
function ai(t) {
  return t.map((i, r) => ({ channel: i, index: r, isotope: ss(i) })).sort((i, r) => i.isotope && r.isotope ? i.isotope.mass - r.isotope.mass || i.isotope.element.localeCompare(r.isotope.element) || i.index - r.index : i.isotope ? -1 : r.isotope ? 1 : i.index - r.index).map(({ index: i }) => i);
}
function Qa(t) {
  const i = ai(t.sourceChannels), r = ai(t.receiverChannels);
  return {
    sourceChannels: i.map((l) => t.sourceChannels[l]),
    receiverChannels: r.map((l) => t.receiverChannels[l]),
    matrix: i.map(
      (l) => r.map((o) => t.matrix[l][o])
    )
  };
}
function An(t, i) {
  if (t === i) return "self";
  const r = ss(t), l = ss(i);
  if (!r || !l) return "other";
  const o = l.mass - r.mass;
  return r.element === l.element ? o === -1 ? "M-1" : o === 1 ? "M+1" : "same-element" : o === -1 ? "M-1" : o === 1 ? "M+1" : o === 16 ? "oxide (+16)" : "other";
}
function gt(t, i) {
  const r = t.index(i);
  if (r !== void 0) return r;
  const l = t.channels.findIndex((o) => o.pnn === i);
  return l < 0 ? void 0 : l;
}
function gn(t, i, r) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(i) || i <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (r && r.length !== t)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const l = r ? r.reduce((g, v) => g + (v ? 1 : 0), 0) : t, o = Math.min(l, i), m = new Uint32Array(o);
  if (o === 0) return m;
  if (!r) {
    if (o === 1) return m;
    for (let g = 0; g < o; g++)
      m[g] = Math.floor(g * (t - 1) / (o - 1));
    return m;
  }
  const h = Array.from({ length: o }, (g, v) => o === 1 ? 0 : Math.floor(v * (l - 1) / (o - 1)));
  let x = 0, y = 0;
  for (let g = 0; g < t && y < o; g++)
    r[g] && (x === h[y] && (m[y++] = g), x++);
  return m;
}
function vn(t, i) {
  if (t.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (t.length - 1), l = Math.floor(r), o = Math.ceil(r);
  return l === o ? t[l] : t[l] + (t[o] - t[l]) * (r - l);
}
function ft(t) {
  const i = t.filter(Number.isFinite).sort((m, h) => m - h);
  if (i.length === 0) return [-1, 1];
  let r = vn(i, 2e-3), l = vn(i, 0.998);
  if (!(l > r)) {
    const m = Number.isFinite(r) ? r : 0, h = Math.max(1, Math.abs(m) * 0.05);
    return [m - h, m + h];
  }
  const o = (l - r) * 0.035;
  return r -= o, l += o, [r, l];
}
function Ve(t) {
  if (t.length === 0) return Number.NaN;
  const i = [...t].sort((r, l) => r - l);
  return vn(i, 0.5);
}
function xt(t) {
  if (t.length === 0) return Number.NaN;
  const i = Ve(t), r = Ve(t.map((h) => Math.abs(h - i))) * 1.4826;
  if (Number.isFinite(r) && r > 0) return r;
  const l = t.reduce((h, x) => h + x, 0) / t.length, o = t.reduce((h, x) => h + (x - l) ** 2, 0) / Math.max(1, t.length - 1), m = Math.sqrt(o);
  return Number.isFinite(m) && m > 0 ? m : 1e-12;
}
function is(t, i, r = 12) {
  if (t.length !== i.length || t.length < r * 8) return null;
  const l = Array.from({ length: t.length }, (x, y) => y).sort((x, y) => t[x] - t[y]), o = [];
  for (let x = 0; x < r; x++) {
    const y = Math.floor(x * l.length / r), g = Math.floor((x + 1) * l.length / r), v = l.slice(y, g);
    if (v.length < 8) continue;
    const P = Ve(v.map((N) => t[N])), E = Ve(v.map((N) => i[N]));
    Number.isFinite(P) && Number.isFinite(E) && o.push({ x: P, y: E });
  }
  const m = [];
  for (let x = 0; x < o.length; x++)
    for (let y = x + 1; y < o.length; y++) {
      const g = o[y].x - o[x].x;
      if (g === 0) continue;
      const v = (o[y].y - o[x].y) / g;
      Number.isFinite(v) && m.push(v);
    }
  const h = Ve(m);
  return Number.isFinite(h) ? h : null;
}
function er(t, i) {
  if (t.length !== i.length || t.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const r = Array.from({ length: t.length }, (T, K) => K).filter((T) => Number.isFinite(t[T]) && Number.isFinite(i[T])).sort((T, K) => t[T] - t[K]);
  if (r.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const l = Math.max(96, Math.floor(r.length * 0.8)), o = Math.min(r.length - 24, Math.floor(r.length * 0.9)), m = r.slice(0, l), h = r.slice(o);
  if (m.length < 96 || h.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const x = m.map((T) => t[T]), y = m.map((T) => i[T]), g = is(x, y, 10);
  if (g === null) return { excessMad: null, slopeDeltaMad: null };
  const v = Ve(m.map((T) => i[T] - g * t[T])), P = m.map((T) => i[T] - (v + g * t[T])), E = Math.max(
    xt(P),
    xt(y) * 0.05,
    1e-12
  ), N = h.map((T) => i[T] - (v + g * t[T])).sort((T, K) => T - K), $ = vn(N, 0.75) / E, A = r.slice(Math.floor(r.length * 0.75)), F = A.map((T) => t[T]), M = A.map((T) => i[T]), I = is(F, M, 4), R = vn(F, 0.9) - vn(F, 0.1), C = I === null || !(R > 0) ? null : (I - g) * R / E;
  return {
    excessMad: Number.isFinite($) ? $ : null,
    slopeDeltaMad: Number.isFinite(C) ? C : null
  };
}
function Fi(t, i, r, l, o, m) {
  const h = r.length, x = er(r, l), y = Math.min(50, Math.max(12, Math.floor(h * 0.01))), g = (k = 0, O = 0, xe = 0) => ({
    status: "insufficient",
    sourceLowEvents: k,
    sourceHighEvents: O,
    destinationNegativeEvents: xe,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: x.excessMad,
    upperTailSlopeDeltaMad: x.slopeDeltaMad,
    receiverZeroDeltaFraction: h > 0 ? (m - o) / h : 0
  });
  if (h < y * 3) return g();
  const v = [...r].sort((k, O) => k - O), P = vn(v, 0.25), E = r.flatMap((k, O) => k <= P ? [O] : []);
  if (E.length < y) return g(E.length);
  const N = E.map((k) => r[k]), $ = Ve(N), A = xt(N);
  let F = r.flatMap((k, O) => k >= $ + 3 * A ? [O] : []);
  if (F.length < y && (F = Array.from({ length: h }, (k, O) => O).sort((k, O) => r[O] - r[k]).slice(0, y)), F.length < y) return g(E.length, F.length);
  const M = E.map((k) => l[k]), I = Ve(M), R = xt(M), C = I + 5 * R, T = l.flatMap((k, O) => k <= C ? [O] : []), K = new Set(T), L = E.filter((k) => K.has(k)), D = F.filter((k) => K.has(k));
  if (L.length < y || D.length < y)
    return g(E.length, F.length, T.length);
  const B = (Ve(D.map((k) => l[k])) - Ve(L.map((k) => l[k]))) / R, W = T.map((k) => t[k]), G = T.map((k) => i[k]);
  return {
    status: "ready",
    sourceLowEvents: E.length,
    sourceHighEvents: F.length,
    destinationNegativeEvents: T.length,
    normalizedNegativeShift: Number.isFinite(B) ? B : null,
    residualSlope: is(W, G),
    upperTailExcessMad: x.excessMad,
    upperTailSlopeDeltaMad: x.slopeDeltaMad,
    receiverZeroDeltaFraction: h > 0 ? (m - o) / h : 0
  };
}
function vt(t, i, r, l, o, m) {
  let h = 0, x = 0, y = 0;
  for (let g = 0; g < r.length; g++) {
    const v = Math.abs(r[g]) <= 1e-12, P = Math.abs(l[g]) <= 1e-12;
    v && h++, P && x++, v && P && y++;
  }
  return {
    x: t.map((g) => Math.max(o[0], Math.min(o[1], g))),
    y: i.map((g) => Math.max(m[0], Math.min(m[1], g))),
    zeroPile: Object.freeze({
      source: h,
      receiver: x,
      corner: y
    })
  };
}
function Yt(t, i, r, l = {}) {
  var k;
  if (t.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation to compare Original and Compensated data." };
  const m = gt(t, i), h = gt(t, r);
  if (m === void 0 || h === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (t.fcs.nEvents === 0)
    return { ready: !1, reason: "This sample contains no events." };
  const x = ((k = l.fixedEventIndices) == null ? void 0 : k.slice()) ?? gn(
    t.fcs.nEvents,
    l.maxEvents ?? 15e3,
    l.eventMask
  );
  for (const O of x)
    if (O >= t.fcs.nEvents || l.eventMask && !l.eventMask[O])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const y = t.channels[m].key, g = t.channels[h].key, v = t.originalColumnData(m), P = t.originalColumnData(h), E = t.compensatedColumnData(m), N = t.compensatedColumnData(h), $ = [], A = [], F = [], M = [], I = [], R = [], C = [], T = [];
  for (const O of x) {
    const xe = t.rawToDisplay(y, v[O]), s = t.rawToDisplay(g, P[O]), We = t.rawToDisplay(y, E[O]), H = t.rawToDisplay(g, N[O]);
    [xe, s, We, H].every(Number.isFinite) && ($.push(xe), A.push(s), F.push(v[O]), M.push(P[O]), I.push(We), R.push(H), C.push(E[O]), T.push(N[O]));
  }
  const K = ft([...$, ...I]), L = ft([...A, ...R]), D = t.channelTicks(m, [K[0], K[1]]), B = t.channelTicks(h, [L[0], L[1]]), W = vt(
    $,
    A,
    F,
    M,
    K,
    L
  ), G = vt(
    I,
    R,
    C,
    T,
    K,
    L
  );
  return {
    ready: !0,
    preview: {
      eventCount: $.length,
      totalEvents: l.eventMask ? l.eligibleEventCount ?? l.eventMask.reduce((O, xe) => O + (xe ? 1 : 0), 0) : t.fcs.nEvents,
      xRange: K,
      yRange: L,
      xTicks: D,
      yTicks: B,
      original: W,
      compensated: G,
      evidence: Fi(
        C,
        T,
        I,
        R,
        W.zeroPile.receiver,
        G.zeroPile.receiver
      )
    }
  };
}
function Xt(t, i, r, l, o, m, h = {}) {
  const x = gt(t, i), y = gt(t, r);
  if (x === void 0 || y === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (o.length !== l.length || m.length !== l.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const g = t.channels[x].key, v = t.channels[y].key, P = t.originalColumnData(x), E = t.originalColumnData(y), N = [], $ = [], A = [], F = [], M = [], I = [], R = [], C = [];
  for (let G = 0; G < l.length; G++) {
    const k = l[G];
    if (k >= t.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const O = P[k], xe = E[k], s = o[G], We = m[G], H = t.rawToDisplay(g, O), an = t.rawToDisplay(v, xe), V = t.rawToDisplay(g, s), S = t.rawToDisplay(v, We);
    [O, xe, s, We, H, an, V, S].every(Number.isFinite) && (N.push(H), $.push(an), A.push(O), F.push(xe), M.push(V), I.push(S), R.push(s), C.push(We));
  }
  const T = h.xRange ?? ft([...N, ...M]), K = h.yRange ?? ft([...$, ...I]), L = t.channelTicks(x, [T[0], T[1]]), D = t.channelTicks(y, [K[0], K[1]]), B = vt(N, $, A, F, T, K), W = vt(M, I, R, C, T, K);
  return {
    ready: !0,
    preview: {
      eventCount: N.length,
      totalEvents: h.totalEvents ?? t.fcs.nEvents,
      xRange: T,
      yRange: K,
      xTicks: L,
      yTicks: D,
      original: B,
      compensated: W,
      evidence: Fi(
        R,
        C,
        M,
        I,
        B.zeroPile.receiver,
        W.zeroPile.receiver
      )
    }
  };
}
const ri = 0.5, nr = 0.01, tr = 1e-4, sr = 0.05, ir = 3, ar = 1, rr = 5;
function Ii(t, i) {
  const r = t.evidence.normalizedNegativeShift ?? 0, l = t.evidence.residualSlope ?? 0, o = Math.max(0, t.evidence.upperTailExcessMad ?? 0), m = Math.max(0, t.evidence.upperTailSlopeDeltaMad ?? 0), h = Math.abs(t.coefficient), x = Math.max(
    tr,
    h * sr
  );
  return {
    negativeShift: Math.max(0, -r),
    negativeSlope: Math.max(0, -l),
    zeroDelta: i === "cytof" ? Math.max(0, t.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, r),
    positiveSlope: Math.max(0, l),
    upperTailExcess: o,
    upperTailSlopeDelta: m,
    hasNegativeShift: r <= -ri,
    hasNegativeSlope: l <= -x,
    hasNewZeroPile: i === "cytof" && t.evidence.receiverZeroDeltaFraction >= nr,
    hasPositiveShift: r >= ri,
    hasPositiveSlope: l >= x,
    hasHighTailCurve: o >= ir && (m >= ar || o >= rr)
  };
}
function lr(t) {
  return Number(t.hasNegativeShift) + Number(t.hasNegativeSlope) + Number(t.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : t.hasNewZeroPile ? "new-zero-pile" : t.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function as(t, i, r = "biological") {
  const l = Ii(t, i), o = l.hasNegativeShift || l.hasNegativeSlope || l.hasNewZeroPile, m = l.hasPositiveShift || l.hasPositiveSlope, h = l.hasHighTailCurve || r === "control" && m;
  return o && h ? {
    category: "mixed-evidence",
    label: "Mixed evidence · inspect",
    detail: "Positive and negative residual signals disagree. Inspect the matched plots and use a suitable control before changing the coefficient.",
    reason: "mixed-residual-signals",
    automaticFollowup: !0
  } : o ? {
    category: "overcompensation-like",
    label: "Overcompensation-like",
    detail: "A negative receiver shift, negative residual slope, or new NNLS zero pile is present. This is a review prompt, not an automatic coefficient verdict.",
    reason: lr(l),
    automaticFollowup: !0
  } : l.hasHighTailCurve ? r === "control" ? {
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
  } : m ? r === "control" ? {
    category: "undercompensation-like",
    label: "Undercompensation-like · control",
    detail: "Positive source-associated residual signal is present. This interpretation is valid only because control-data mode was selected.",
    reason: Number(l.hasPositiveShift) + Number(l.hasPositiveSlope) > 1 ? "multiple-undercompensation-signals" : "positive-residual-control",
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
function tn(t, i) {
  if (!Number.isFinite(t) || t <= 0) return 0;
  const r = i.filter((o) => Number.isFinite(o) && o > 0).sort((o, m) => o - m);
  if (r.length === 0) return 0;
  let l = 0;
  for (const o of r)
    if (o <= t) l++;
    else break;
  return l / r.length;
}
function or(t, i, r = "biological") {
  const l = t.map(($) => ({
    ...Ii($, i),
    coefficient: Math.abs($.coefficient)
  })), o = ($) => l.map((A) => typeof A[$] == "number" ? A[$] : 0), m = o("negativeShift"), h = o("negativeSlope"), x = o("zeroDelta"), y = o("positiveShift"), g = o("positiveSlope"), v = o("upperTailExcess"), P = o("upperTailSlopeDelta"), E = o("coefficient"), N = t.flatMap(($, A) => {
    const F = as($, i, r);
    if (!F.automaticFollowup || F.reason === null) return [];
    const M = l[A], I = 0.22 * tn(M.negativeShift, m) + 0.13 * tn(M.negativeSlope, h) + 0.14 * tn(M.zeroDelta, x) + (r === "control" ? 0.13 * tn(M.positiveShift, y) : 0) + (r === "control" ? 0.08 * tn(M.positiveSlope, g) : 0) + 0.12 * tn(M.upperTailExcess, v) + 0.08 * tn(M.upperTailSlopeDelta, P) + 0.05 * tn(M.coefficient, E) + 0.05 * Math.max(0, Math.min(1, $.physicalPrior));
    return [{
      index: A,
      relativePriority: I,
      reason: F.reason,
      category: F.category
    }];
  });
  return Object.freeze(N.sort(($, A) => A.relativePriority - $.relativePriority || $.index - A.index));
}
function cr(t, i) {
  const r = t.index(i);
  if (r !== void 0) return r;
  const l = t.channels.findIndex((o) => o.pnn === i);
  return l < 0 ? void 0 : l;
}
function rs(t, i) {
  if (t.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (t.length - 1), l = Math.floor(r), o = Math.ceil(r);
  return l === o ? t[l] : t[l] + (t[o] - t[l]) * (r - l);
}
function dr(t) {
  const i = t.filter(Number.isFinite).sort((m, h) => m - h);
  if (i.length === 0) return [-1, 1];
  let r = rs(i, 2e-3), l = rs(i, 0.998);
  if (!(l > r)) {
    const m = Number.isFinite(r) ? r : 0, h = Math.max(1, Math.abs(m) * 0.05);
    return [m - h, m + h];
  }
  const o = (l - r) * 0.035;
  return r -= o, l += o, [r, l];
}
function ur(t) {
  if (t.length === 0) return "0:empty";
  let i = 2166136261;
  for (const r of t)
    i ^= r, i = Math.imul(i, 16777619) >>> 0;
  return `${t.length}:${t[0]}:${t[t.length - 1]}:${i.toString(16)}`;
}
function hr(t, i, r = {}) {
  var x;
  if (t.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const o = ((x = r.fixedEventIndices) == null ? void 0 : x.slice()) ?? gn(
    t.fcs.nEvents,
    r.maxEvents ?? 2500,
    r.eventMask
  );
  for (const y of o)
    if (y >= t.fcs.nEvents || r.eventMask && !r.eventMask[y])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const m = /* @__PURE__ */ new Map();
  for (const y of Array.from(new Set(i))) {
    const g = cr(t, y);
    if (g === void 0) continue;
    const v = t.channels[g], P = t.originalColumnData(g), E = t.compensatedColumnData(g), N = new Float64Array(o.length), $ = new Float64Array(o.length), A = new Float64Array(o.length), F = new Float64Array(o.length), M = [];
    for (let C = 0; C < o.length; C++) {
      const T = o[C], K = P[T], L = E[T], D = t.rawToDisplay(v.key, K), B = t.rawToDisplay(v.key, L);
      N[C] = K, $[C] = L, A[C] = D, F[C] = B, Number.isFinite(D) && M.push(D), Number.isFinite(B) && M.push(B);
    }
    const I = dr(M), R = Object.freeze({
      key: v.key,
      pnn: v.pnn,
      range: I,
      ticks: t.channelTicks(g, [I[0], I[1]]),
      originalRaw: N,
      compensatedRaw: $,
      originalDisplay: A,
      compensatedDisplay: F
    });
    m.set(y, R), m.set(v.key, R), m.set(v.pnn, R);
  }
  const h = r.eventMask ? r.eligibleEventCount ?? r.eventMask.reduce((y, g) => y + (g ? 1 : 0), 0) : t.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: o,
      eventSignature: ur(o),
      eligibleEventCount: h,
      channels: m
    })
  };
}
function li(t, i, r, l, o, m, h) {
  const x = [], y = [];
  let g = 0, v = 0, P = 0;
  for (const E of o) {
    x.push(Math.max(m[0], Math.min(m[1], t[E]))), y.push(Math.max(h[0], Math.min(h[1], i[E])));
    const N = Math.abs(r[E]) <= 1e-12, $ = Math.abs(l[E]) <= 1e-12;
    N && g++, $ && v++, N && $ && P++;
  }
  return {
    x,
    y,
    zeroPile: Object.freeze({ source: g, receiver: v, corner: P })
  };
}
function Pi(t, i, r) {
  const l = t.channels.get(i), o = t.channels.get(r);
  if (!l || !o)
    return { ready: !1, reason: "One or both channels are absent from the frozen global-inspector dataset." };
  const m = [];
  for (let h = 0; h < t.eventIndices.length; h++)
    [
      l.originalDisplay[h],
      o.originalDisplay[h],
      l.compensatedDisplay[h],
      o.compensatedDisplay[h]
    ].every(Number.isFinite) && m.push(h);
  return {
    ready: !0,
    preview: Object.freeze({
      eventCount: m.length,
      totalEvents: t.eligibleEventCount,
      eventSignature: t.eventSignature,
      xRange: l.range,
      yRange: o.range,
      xTicks: l.ticks,
      yTicks: o.ticks,
      original: li(
        l.originalDisplay,
        o.originalDisplay,
        l.originalRaw,
        o.originalRaw,
        m,
        l.range,
        o.range
      ),
      compensated: li(
        l.compensatedDisplay,
        o.compensatedDisplay,
        l.compensatedRaw,
        o.compensatedRaw,
        m,
        l.range,
        o.range
      )
    })
  };
}
function oi(t, i, r, l, o) {
  const m = Math.max(1, Math.min(24, Math.round(o) || 3)), h = 256, x = m, y = h + 2 * x, g = new Float64Array(y * y), v = Math.max(1e-12, i[1] - i[0]), P = Math.max(1e-12, r[1] - r[0]);
  for (let M = 0; M < t.x.length; M++) {
    const I = Math.max(0, Math.min(
      y - 1,
      Math.floor((t.x[M] - i[0]) / v * h) + x
    )), R = Math.max(0, Math.min(
      y - 1,
      Math.floor((t.y[M] - r[0]) / P * h) + x
    ));
    g[R * y + I]++;
  }
  const E = new Float64Array(y * y), N = (m * 2 + 1) ** 2, $ = y + 1, A = new Float64Array($ * $);
  for (let M = 0; M < y; M++) {
    let I = 0;
    for (let R = 0; R < y; R++)
      I += g[M * y + R], A[(M + 1) * $ + R + 1] = A[M * $ + R + 1] + I;
  }
  for (let M = m; M < y - m; M++) {
    const I = M - m, R = M + m + 1;
    for (let C = m; C < y - m; C++) {
      const T = C - m, K = C + m + 1, L = A[R * $ + K] - A[I * $ + K] - A[R * $ + T] + A[I * $ + T];
      E[M * y + C] = L / N;
    }
  }
  const F = [];
  for (let M = x; M < x + h; M++)
    for (let I = x; I < x + h; I++) {
      const R = E[M * y + I];
      R > 0 && F.push(R);
    }
  return F.sort((M, I) => M - I), F.length === 0 ? 1 : Math.max(1e-12, rs(F, l));
}
function ds(t, i) {
  const r = Math.max(1, Math.min(10, Number.isFinite(t) ? t : 6)), l = Math.max(1, (Number.isFinite(i) ? i : 220) - 50);
  return Math.max(1, Math.min(24, r * 170 / l));
}
function us(t, i = 0.95, r = 3, l = cs) {
  const o = Math.max(
    oi(t.original, t.xRange, t.yRange, i, r),
    oi(t.compensated, t.xRange, t.yRange, i, r)
  );
  return Ra(o, l);
}
function bt(t, i) {
  const r = i.size / 220, l = Math.sqrt(r), o = Math.max(9, Math.min(12, 11 * l)), m = Math.max(10, Math.min(13, 12 * l));
  Ka().renderMiniPlot(t, {
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
      tick: o,
      axis_label: m,
      title: Math.max(10, Math.min(13, 12 * l)),
      gate_label: o
    }
  });
}
const fn = "http://www.w3.org/2000/svg", Wn = 6, xn = 1123, qn = 794;
function Ri(t) {
  return Math.ceil(Math.max(0, Math.floor(t)) / Wn);
}
function ci(t) {
  return t.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function Ki(t, i) {
  return `gatelab-compensation-${ci(t.replace(/\.[^.]+$/, ""))}-${ci(i)}`;
}
function ls(t, i, r, l) {
  const o = Ki(t, i);
  return r === "pdf" || l <= 1 ? `${o}.${r}` : `${o}-${r}-pages.zip`;
}
function Tn(t, i, r, l, o = {}) {
  const m = document.createElementNS(fn, "text");
  return m.setAttribute("x", String(r)), m.setAttribute("y", String(l)), m.setAttribute("font-family", "Arial, Helvetica, sans-serif"), m.setAttribute("font-size", String(o.size ?? 10)), m.setAttribute("font-weight", String(o.weight ?? 400)), m.setAttribute("fill", o.fill ?? "#253247"), o.anchor && m.setAttribute("text-anchor", o.anchor), m.textContent = i, t.appendChild(m), m;
}
function di(t, i) {
  return t.length <= i ? t : `${t.slice(0, Math.max(1, i - 1))}…`;
}
function ui(t, i, r, l, o, m, h, x, y, g, v, P) {
  const E = document.createElement("div");
  bt(E, {
    title: l === "original" ? "Original" : "Compensated",
    panel: r[l],
    preview: r,
    sourceLabel: i.sourceLabel,
    receiverLabel: i.receiverLabel,
    size: h,
    densityColorCeiling: y,
    densitySmoothingRadius: x,
    densityColorPower: g,
    pointAlpha: v,
    pointSize: P,
    canvasScale: 300 / 96
  });
  const N = E.querySelector("canvas"), $ = E.querySelector("svg");
  if (!N || !$) throw new Error("GateLab could not render a compensation export panel.");
  const A = document.createElementNS(fn, "g");
  A.setAttribute("transform", `translate(${o},${m})`);
  const F = document.createElementNS(fn, "image");
  F.setAttribute("x", "0"), F.setAttribute("y", "0"), F.setAttribute("width", String(h)), F.setAttribute("height", String(h)), F.setAttribute("href", N.toDataURL("image/png")), A.appendChild(F), A.appendChild($.cloneNode(!0)), t.appendChild(A);
}
function hi(t, i, r, l) {
  const o = document.createElementNS(fn, "svg");
  o.setAttribute("xmlns", fn), o.setAttribute("width", String(xn)), o.setAttribute("height", String(qn)), o.setAttribute("viewBox", `0 0 ${xn} ${qn}`);
  const m = document.createElementNS(fn, "rect");
  m.setAttribute("width", "100%"), m.setAttribute("height", "100%"), m.setAttribute("fill", "#ffffff"), o.appendChild(m), Tn(o, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), Tn(
    o,
    di(`${i.sampleName} · ${i.populationName} · ${i.profileName} · ${i.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), Tn(o, `Page ${r + 1} of ${l}`, xn - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const h = 28, x = 18, y = 53, g = 771, v = (xn - h * 2 - x) / 2, P = (g - y) / 3, E = 204, N = 12, $ = E * 2 + N;
  return t.forEach((A, F) => {
    const M = A.buildPreview(), I = ds(i.densitySmoothing, E), R = us(
      M,
      0.95,
      I,
      i.densityColorPower
    ), C = F % 2, T = Math.floor(F / 2), K = h + C * (v + x), L = y + T * P, D = K + (v - $) / 2, B = L + 25, W = A.relationship && A.relationship !== "other" ? ` · ${A.relationship}` : "";
    if (Tn(
      o,
      di(`${A.sourceLabel} → ${A.receiverLabel}`, 58),
      K + 5,
      L + 14,
      { size: 10.5, weight: 700 }
    ), Tn(
      o,
      `matrix ${(A.coefficient * 100).toFixed(1)}%${W}`,
      K + v - 5,
      L + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), ui(o, A, M, "original", D, B, E, I, R, i.densityColorPower, i.pointAlpha, i.pointSize ?? 1), ui(o, A, M, "compensated", D + E + N, B, E, I, R, i.densityColorPower, i.pointAlpha, i.pointSize ?? 1), T < 2) {
      const G = document.createElementNS(fn, "line");
      G.setAttribute("x1", String(K)), G.setAttribute("x2", String(K + v)), G.setAttribute("y1", String(L + P - 3)), G.setAttribute("y2", String(L + P - 3)), G.setAttribute("stroke", "#e6eaf0"), G.setAttribute("stroke-width", "1"), o.appendChild(G);
    }
  }), Tn(
    o,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), o;
}
function mi(t) {
  return Da(t, { widthPx: xn, heightPx: qn }), `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(t)}`;
}
async function pi(t, i = 300) {
  const r = URL.createObjectURL(new Blob([t], { type: "image/svg+xml" }));
  try {
    const l = await new Promise((x, y) => {
      const g = new Image();
      g.onload = () => x(g), g.onerror = () => y(new Error("GateLab could not rasterize the compensation export page.")), g.src = r;
    }), o = Math.max(1, i / 96), m = document.createElement("canvas");
    m.width = Math.round(xn * o), m.height = Math.round(qn * o);
    const h = m.getContext("2d");
    if (!h) throw new Error("Canvas export is unavailable in this browser.");
    return h.fillStyle = "#ffffff", h.fillRect(0, 0, m.width, m.height), h.scale(o, o), h.drawImage(l, 0, 0, xn, qn), await new Promise((x, y) => {
      m.toBlob((g) => g ? x(g) : y(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(r);
  }
}
function gi(t, i) {
  const r = URL.createObjectURL(t), l = document.createElement("a");
  l.href = r, l.download = i, document.body.appendChild(l), l.click(), l.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function mr(t, i, r, l) {
  const o = Math.max(2, String(r).length);
  return `${t}-page-${String(i + 1).padStart(o, "0")}.${l}`;
}
async function pr(t, i, r, l) {
  const o = Ri(t.length);
  if (o === 0) throw new Error("No compensation pairs are available to export.");
  const m = Ki(i.sampleName, i.populationName);
  if (r === "pdf") {
    const { jsPDF: g } = await import("./jspdf.es.min-Dv77Xhdd.js").then((N) => N.j), v = new g({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), P = v.internal.pageSize.getWidth(), E = v.internal.pageSize.getHeight();
    for (let N = 0; N < o; N++) {
      N > 0 && v.addPage("a4", "landscape");
      const $ = t.slice(
        N * Wn,
        (N + 1) * Wn
      ), A = mi(hi($, i, N, o)), F = await pi(A), M = await new Promise((I, R) => {
        const C = new FileReader();
        C.onload = () => I(String(C.result)), C.onerror = () => R(C.error ?? new Error("GateLab could not read an export page.")), C.readAsDataURL(F);
      });
      v.addImage(M, "PNG", 0, 0, P, E, void 0, "FAST"), l == null || l({ completedPages: N + 1, totalPages: o }), await new Promise((I) => setTimeout(I, 0));
    }
    v.save(ls(i.sampleName, i.populationName, r, o));
    return;
  }
  const h = {};
  let x = null;
  for (let g = 0; g < o; g++) {
    const v = t.slice(
      g * Wn,
      (g + 1) * Wn
    ), P = mi(hi(v, i, g, o)), E = mr(m, g, o, r);
    if (r === "svg") {
      const N = La(P);
      h[E] = N, o === 1 && (x = new Blob([N], { type: "image/svg+xml" }));
    } else {
      const N = await pi(P), $ = new Uint8Array(await N.arrayBuffer());
      h[E] = $, o === 1 && (x = N);
    }
    l == null || l({ completedPages: g + 1, totalPages: o }), await new Promise((N) => setTimeout(N, 0));
  }
  const y = ls(
    i.sampleName,
    i.populationName,
    r,
    o
  );
  gi(o === 1 && x ? x : new Blob([Oa(h, { level: 6 })], { type: "application/zip" }), y);
}
const gr = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function fr({
  sampleName: t,
  populationName: i,
  filterLabel: r,
  pairCount: l,
  onExport: o,
  onClose: m
}) {
  const { t: h } = Le(), [x, y] = b.useState("pdf"), [g, v] = b.useState(null), [P, E] = b.useState(null), N = Ri(l), $ = g !== null && g.completedPages < g.totalPages, A = ls(t, i, x, N), F = async () => {
    E(null), v({ completedPages: 0, totalPages: N });
    try {
      await o(x, v), m();
    } catch (M) {
      v(null), E(M instanceof Error ? M.message : String(M));
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-backdrop", children: [
    /* @__PURE__ */ e.jsx(Ti, { onClose: $ ? null : m }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "gl-modal gl-comp-export-modal gl-comp-comparison-export-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "comp-comparison-export-title",
        children: [
          /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-comparison-export-title", children: h("Export compensation comparison") }),
          /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: h("Export the currently filtered channel pairs as clean paired Original and Compensated biplots. Every pair retains the same frozen events, axes, transform, density scale, and edge piling in both panels.") }),
          /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions gl-comp-comparison-export-formats", children: [
            /* @__PURE__ */ e.jsx("legend", { children: h("Format") }),
            gr.map((M) => /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  name: "compensation-comparison-export-format",
                  value: M.format,
                  checked: x === M.format,
                  disabled: $,
                  onChange: () => y(M.format)
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: M.title }),
                /* @__PURE__ */ e.jsx("small", { children: h(M.detail) })
              ] })
            ] }, M.format))
          ] }),
          /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary gl-comp-comparison-export-summary", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: h("File") }),
              /* @__PURE__ */ e.jsx("dd", { title: A, children: A })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: h("Scope") }),
              /* @__PURE__ */ e.jsx("dd", { children: h(l === 1 ? "{count} filtered pair · both assays" : "{count} filtered pairs · both assays", { count: l.toLocaleString() }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: h("Pages") }),
              /* @__PURE__ */ e.jsx("dd", { children: h(N === 1 ? "{count} A4 landscape page · six pairs per page" : "{count} A4 landscape pages · six pairs per page", { count: N.toLocaleString() }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: h("Population") }),
              /* @__PURE__ */ e.jsx("dd", { title: i, children: i })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: h("Filter") }),
              /* @__PURE__ */ e.jsx("dd", { title: r, children: r })
            ] })
          ] }),
          g && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-comparison-export-progress", role: "status", "aria-live": "polite", children: [
            /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, g.totalPages), value: g.completedPages }),
            /* @__PURE__ */ e.jsx("span", { children: h("Rendering page {current} of {total}", { current: Math.min(g.completedPages + 1, g.totalPages), total: g.totalPages }) })
          ] }),
          P && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: h(P) }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: $, onClick: m, children: h("Cancel") }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: $ || N === 0, onClick: () => void F(), children: $ ? h("Rendering…") : h("Download {format}", { format: x.toUpperCase() }) })
          ] })
        ]
      }
    )
  ] });
}
function fi(t) {
  return `"${t.replaceAll('"', '""')}"`;
}
function xi(t, i) {
  if (!Array.isArray(t) || t.length === 0)
    throw new Error(`The ${i} channel axis is empty.`);
  const r = t.map((l, o) => {
    if (typeof l != "string" || l.trim().length === 0)
      throw new Error(`The ${i} channel at position ${o + 1} is blank or invalid.`);
    return l.trim().normalize("NFC");
  });
  if (new Set(r).size !== r.length)
    throw new Error(`The ${i} channel axis contains duplicate identities.`);
  return r;
}
function xr(t) {
  const i = xi(t.sourceChannels, "source"), r = xi(t.receiverChannels, "receiver");
  if (!Array.isArray(t.matrix) || t.matrix.length !== i.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const l = [
    ["channel", ...r].map(fi).join(",")
  ];
  return t.matrix.forEach((o, m) => {
    if (!Array.isArray(o) || o.length !== r.length)
      throw new Error(
        `Spill matrix row ${m + 1} does not match the receiver channel axis.`
      );
    const h = o.map((x, y) => {
      if (typeof x != "number" || !Number.isFinite(x))
        throw new Error(
          `Spill coefficient ${i[m]} → ${r[y]} is not finite.`
        );
      return Object.is(x, -0) ? "0" : String(x);
    });
    l.push([fi(i[m]), ...h].join(","));
  }), `${l.join(`
`)}
`;
}
function vr(t, i = "installed") {
  return `${t.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${i === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function br(t) {
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
function Li({
  profileLabel: t,
  installedLabel: i,
  installedMatrix: r,
  workingMatrix: l = null,
  pendingEditCount: o = 0,
  onClose: m
}) {
  const { t: h } = Le(), [x, y] = b.useState("installed"), [g, v] = b.useState(null), P = x === "working" && l ? l : r, E = vr(t, x), N = b.useMemo(
    () => br(E),
    [E]
  ), $ = () => {
    v(null);
    try {
      const F = xr(P), M = URL.createObjectURL(new Blob([F], { type: "text/csv;charset=utf-8" })), I = document.createElement("a");
      I.href = M, I.download = E, document.body.appendChild(I), I.click(), I.remove(), setTimeout(() => URL.revokeObjectURL(M), 1e3);
    } catch (F) {
      v(F instanceof Error ? F.message : String(F));
    }
  }, A = async () => {
    var F;
    if (!((F = navigator.clipboard) != null && F.writeText)) {
      v("Clipboard access is unavailable; select the R code below and copy it manually.");
      return;
    }
    try {
      await navigator.clipboard.writeText(N), v("R import code copied.");
    } catch {
      v("Clipboard access was denied; select the R code below and copy it manually.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-backdrop", children: [
    /* @__PURE__ */ e.jsx(Ti, { onClose: m }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "gl-modal gl-comp-export-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "comp-export-title",
        children: [
          /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-export-title", children: h("Export spill matrix") }),
          /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: h("Coefficients are exported as exact fractions, not the rounded percentages shown in the matrix. Source channels are rows and receiver channels are columns. The CSV can be imported by GateLab or base R.") }),
          l && o > 0 && /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions", children: [
            /* @__PURE__ */ e.jsx("legend", { children: h("Matrix version") }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  name: "compensation-export-version",
                  value: "installed",
                  checked: x === "installed",
                  onChange: () => y("installed")
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: i }),
                /* @__PURE__ */ e.jsx("small", { children: h("Current applied scientific record") })
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
                  onChange: () => y("working")
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: h("Working draft") }),
                /* @__PURE__ */ e.jsx("small", { children: h("{count} pending edits; not yet applied", { count: o }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: h("File") }),
              /* @__PURE__ */ e.jsx("dd", { children: E })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: h("Dimensions") }),
              /* @__PURE__ */ e.jsx("dd", { children: h("{sources} sources × {receivers} receivers", { sources: P.sourceChannels.length, receivers: P.receiverChannels.length }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: h("Units") }),
              /* @__PURE__ */ e.jsx("dd", { children: h("Fractions (2.9% is written as 0.029)") })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-export-r-head", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: h("Import in R") }),
              /* @__PURE__ */ e.jsx("span", { children: h("Run after placing the CSV in the R working directory.") })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => void A(), children: h("Copy R code") })
          ] }),
          /* @__PURE__ */ e.jsx("pre", { className: "gl-comp-export-code", children: /* @__PURE__ */ e.jsx("code", { children: N }) }),
          g && /* @__PURE__ */ e.jsx("div", { className: g.includes("copied") ? "gl-comp-status" : "gl-comp-warning", role: "status", children: g }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: m, children: h("Cancel") }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", onClick: $, children: h("Download CSV") })
          ] })
        ]
      }
    )
  ] });
}
function yr(t, i) {
  return t.type === "embedded" ? i("Embedded · {file}", { file: t.fileName }) : t.type === "external" ? i("From {file}", { file: t.label }) : t.type === "imported" ? i("Imported · {file}", { file: t.fileName }) : t.type === "edited" ? i("Edited from {name}", { name: t.from }) : t.type === "empty" ? i("Empty") : i("Preset · {name}", { name: t.presetId });
}
function jr({
  rows: t,
  fileCount: i,
  unsavedEmbeddedFiles: r = [],
  busy: l,
  planSwitch: o,
  onUse: m,
  onRename: h,
  onDuplicate: x,
  onDelete: y,
  onImport: g
}) {
  const { t: v } = Le(), P = b.useRef(null), [E, N] = b.useState(null), [$, A] = b.useState(null), [F, M] = b.useState(null), [I, R] = b.useState(null), [C, T] = b.useState(null), K = async (k) => {
    T(null);
    try {
      T({ text: await g(k), error: !1 });
    } catch (O) {
      T({ text: O instanceof Error ? O.message : String(O), error: !0 });
    }
  }, L = (k) => {
    var xe;
    const O = (xe = k.currentTarget.files) == null ? void 0 : xe[0];
    k.currentTarget.value = "", O && K(O);
  }, D = () => void $i(P.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "Spillover matrix").then((k) => {
    k != null && k[0] && K(k[0]);
  }), B = () => {
    if (!E) return;
    const k = t.find(({ id: O }) => O === E.id);
    N(null), k && E.draft.trim() !== k.name && h(k, E.draft);
  }, W = async (k) => {
    T(null);
    try {
      await x(k);
    } catch (O) {
      T({ text: O instanceof Error ? O.message : String(O), error: !0 });
    }
  }, G = (k) => [
    {
      label: v("Use for the workspace…"),
      className: "gl-comp-lib-use",
      disabled: l || !m || k.unusable !== null || k.active && k.filesUsing === i,
      title: m ? k.unusable !== null ? v("GateLab cannot store this matrix, so only its own file uses it: {reason}", { reason: k.unusable }) : k.active && k.filesUsing === i ? v("Every file is already compensated with this matrix.") : void 0 : v("The matrix of a hosted SCE is chosen in R."),
      onClick: () => A(k)
    },
    ...k.canRename ? [{
      label: v("Rename…"),
      className: "gl-comp-lib-rename",
      disabled: l,
      onClick: () => N({ id: k.id, draft: k.name })
    }] : [],
    { label: v("Duplicate"), className: "gl-comp-lib-duplicate", disabled: l || k.unusable !== null, onClick: () => void W(k) },
    { label: v("Export CSV…"), className: "gl-comp-lib-export", onClick: () => R(k) },
    ...k.canDelete ? [{ label: v("Delete…"), className: "gl-comp-lib-delete", danger: !0, disabled: l, onClick: () => M(k) }] : []
  ];
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrices", "aria-labelledby": "comp-matrices-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrices-head", children: [
      /* @__PURE__ */ e.jsx("h3", { id: "comp-matrices-heading", children: v("Matrices") }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", disabled: l, onClick: D, children: v("Import CSV/TSV…") })
    ] }),
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: P,
        type: "file",
        accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
        className: "gl-sr-only",
        "aria-label": v("Import a spillover matrix"),
        onChange: L
      }
    ),
    t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: v("No matrix yet: the files carry none, and none has been imported.") }) : /* @__PURE__ */ e.jsx("ul", { className: "gl-comp-lib-list", "aria-label": v("Matrices"), children: t.map((k) => /* @__PURE__ */ e.jsxs("li", { className: "gl-comp-lib-row" + (k.active ? " is-active" : ""), "data-matrix-id": k.id, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-lib-text", children: [
        (E == null ? void 0 : E.id) === k.id ? /* @__PURE__ */ e.jsx(
          "input",
          {
            className: "gl-comp-lib-name-input",
            "aria-label": v("Name of {name}", { name: k.name }),
            value: E.draft,
            autoFocus: !0,
            maxLength: 200,
            onChange: (O) => N({ id: k.id, draft: O.currentTarget.value }),
            onBlur: B,
            onKeyDown: (O) => {
              O.key === "Enter" ? (O.preventDefault(), B()) : O.key === "Escape" && (O.preventDefault(), O.stopPropagation(), N(null));
            }
          }
        ) : /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-name", title: k.name, children: k.name }),
        /* @__PURE__ */ e.jsxs("span", { className: "gl-comp-lib-meta", children: [
          yr(k.source, v),
          " · ",
          v("{count} channels", { count: k.channelCount }),
          k.active && k.filesUsing !== i ? ` · ${v("{used} of {files} files", { used: k.filesUsing, files: i })}` : ""
        ] }),
        k.unusable !== null && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-unusable", title: k.unusable, children: v("Only its own file can use it") })
      ] }),
      k.active && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-active", children: v("Active") }),
      /* @__PURE__ */ e.jsx(
        za,
        {
          label: v("{name}: matrix actions", { name: k.name }),
          items: G(k),
          icon: /* @__PURE__ */ e.jsx(_a, { size: 16 }),
          className: "gl-comp-lib-menu"
        }
      )
    ] }, k.id)) }),
    r.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-hint gl-comp-lib-unsaved", children: v("The workspace cannot be saved while files use their own embedded matrix beside stored matrices: {files}. Use a matrix for the workspace, set those files to Original, or delete the stored matrices no file uses.", {
      files: r.join(", ")
    }) }),
    C && /* @__PURE__ */ e.jsx("div", { className: C.error ? "gl-comp-error" : "gl-comp-status", role: C.error ? "alert" : "status", children: C.text }),
    $ && m && /* @__PURE__ */ e.jsx(
      wr,
      {
        row: $,
        plan: o($),
        revertible: r.length === 0,
        busy: l,
        onUse: async (k) => {
          await m(k), T(null);
        },
        onClose: () => A(null)
      }
    ),
    F && /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (k) => {
      k.key === "Escape" && M(null);
    }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-lib-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-matrix-delete-title", children: [
      /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-matrix-delete-title", children: v("Delete {name}?", { name: F.name }) }),
      /* @__PURE__ */ e.jsx("p", { children: v("It leaves the workspace's list of matrices. No file is compensated with it.") }),
      /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
        /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", autoFocus: !0, onClick: () => M(null), children: v("Cancel") }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-btn gl-btn-danger",
            onClick: () => {
              y(F), M(null);
            },
            children: v("Delete")
          }
        )
      ] })
    ] }) }),
    I && /* @__PURE__ */ e.jsx(
      Li,
      {
        profileLabel: I.name,
        installedLabel: I.name,
        installedMatrix: I.exportMatrix,
        onClose: () => R(null)
      }
    )
  ] });
}
function wr({
  row: t,
  plan: i,
  revertible: r,
  busy: l,
  onUse: o,
  onClose: m
}) {
  const { t: h } = Le(), [x, y] = b.useState(!1), [g, v] = b.useState(!1), [P, E] = b.useState(null), N = i.uncovered.length > 0, $ = async () => {
    v(!0), E(null);
    try {
      await o(t), m();
    } catch (A) {
      E(A instanceof Error ? A.message : String(A));
    } finally {
      v(!1);
    }
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (A) => {
    A.key === "Escape" && !g && m();
  }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-lib-dialog gl-comp-lib-switch", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-matrix-switch-title", children: [
    /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-matrix-switch-title", children: h("Use {name} for the workspace", { name: t.name }) }),
    /* @__PURE__ */ e.jsx("p", { children: h("Every file in the workspace ({count}) is compensated with {name}.", { count: i.fileCount, name: t.name }) }),
    /* @__PURE__ */ e.jsx("p", { children: i.gateCount > 0 ? h("Membership is recomputed for {gates} gates and {populations} populations drawn on channels this matrix compensates.", {
      gates: i.gateCount,
      populations: i.populationCount
    }) : h("No gate is drawn on a channel this matrix compensates.") }),
    i.leavingEmbedded.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-leaving", children: h("Leaving their own embedded matrix: {files}.", { files: i.leavingEmbedded.join(", ") }) }),
    !r && !N && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-irreversible", children: h("The workspace as it stands cannot be saved, so Revert workspace cannot return to it afterwards; it returns to the last state that was saved or checkpointed.") }),
    N && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-error gl-comp-lib-uncovered", role: "alert", children: [
      /* @__PURE__ */ e.jsx("p", { children: h("These files cannot be compensated with this matrix, so it cannot be used for the workspace:") }),
      /* @__PURE__ */ e.jsx("ul", { children: i.uncovered.map((A) => /* @__PURE__ */ e.jsx("li", { children: A.wrongInstrument ? h("{file}: not a file of this instrument kind", { file: A.name }) : A.missingChannels.length > 0 ? h("{file}: lacks {channels}", { file: A.name, channels: A.missingChannels.join(", ") }) : h("{file}: {reason}", { file: A.name, reason: A.message ?? "" }) }, A.name)) }),
      /* @__PURE__ */ e.jsx("p", { children: h("Remove these files from the workspace, or choose a matrix that covers their channels.") })
    ] }),
    !N && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "checkbox",
          checked: x,
          disabled: g,
          onChange: (A) => y(A.currentTarget.checked)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { children: h("I agree that gate membership may change.") })
    ] }),
    P && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: P }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: g, onClick: m, children: h("Cancel") }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-btn",
          disabled: N || !x || g || l,
          onClick: () => void $(),
          children: h(g ? "Compensating…" : "Use for the workspace")
        }
      )
    ] })
  ] }) });
}
function $n({
  value: t,
  onValueChange: i,
  scrubStep: r,
  className: l = "",
  disabled: o,
  min: m,
  max: h,
  step: x,
  title: y,
  onPointerDown: g,
  onPointerMove: v,
  onPointerUp: P,
  onPointerCancel: E,
  onLostPointerCapture: N,
  ...$
}) {
  const { t: A } = Le(), F = b.useRef(null), [M, I] = b.useState(!1), R = (C) => {
    var T, K, L;
    ((T = F.current) == null ? void 0 : T.pointerId) === C.pointerId && (F.current = null, I(!1), (L = (K = C.currentTarget).hasPointerCapture) != null && L.call(K, C.pointerId) && C.currentTarget.releasePointerCapture(C.pointerId));
  };
  return /* @__PURE__ */ e.jsx(
    "input",
    {
      ...$,
      type: "number",
      className: `gl-scrubbable-number${M ? " is-scrubbing" : ""}${l ? ` ${l}` : ""}`,
      value: t,
      disabled: o,
      min: m,
      max: h,
      step: x,
      title: y ?? A("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (C) => i(C.currentTarget.value),
      onPointerDown: (C) => {
        var W, G;
        if (g == null || g(C), C.defaultPrevented || o || C.button !== 0) return;
        const T = C.currentTarget.getBoundingClientRect();
        if (C.clientX >= T.right - 18) return;
        const K = Number(t), L = (r ?? Number(x)) || 0.1;
        if (!Number.isFinite(K) || !(L > 0)) return;
        const D = String(L), B = D.includes("e-") ? Number(D.split("e-")[1]) : D.includes(".") ? D.split(".")[1].length : 0;
        F.current = {
          pointerId: C.pointerId,
          startY: C.clientY,
          startValue: K,
          step: L,
          decimals: B,
          lastSteps: 0
        }, (G = (W = C.currentTarget).setPointerCapture) == null || G.call(W, C.pointerId);
      },
      onPointerMove: (C) => {
        v == null || v(C);
        const T = F.current;
        if (!T || T.pointerId !== C.pointerId) return;
        const K = T.startY - C.clientY;
        if (Math.abs(K) < 3) return;
        const L = K > 0 ? Math.floor(K / 4) : Math.ceil(K / 4);
        if (L === T.lastSteps) return;
        let D = T.startValue + L * T.step;
        const B = m === void 0 ? Number.NEGATIVE_INFINITY : Number(m), W = h === void 0 ? Number.POSITIVE_INFINITY : Number(h);
        Number.isFinite(B) && (D = Math.max(B, D)), Number.isFinite(W) && (D = Math.min(W, D)), F.current = { ...T, lastSteps: L }, I(!0), i(D.toFixed(Math.min(10, T.decimals))), C.preventDefault();
      },
      onPointerUp: (C) => {
        P == null || P(C), R(C);
      },
      onPointerCancel: (C) => {
        E == null || E(C), R(C);
      },
      onLostPointerCapture: (C) => {
        var T;
        N == null || N(C), ((T = F.current) == null ? void 0 : T.pointerId) === C.pointerId && (F.current = null, I(!1));
      }
    }
  );
}
const hs = b.createContext(cs), ms = b.createContext(0.85), ps = b.createContext(1), vi = "", mt = [];
let Jt = !1;
function Nr(t) {
  const i = { cancelled: !1, run: t };
  mt.push(i);
  const r = () => {
    if (Jt) return;
    Jt = !0;
    const l = () => {
      Jt = !1;
      let m = mt.shift();
      for (; m != null && m.cancelled; ) m = mt.shift();
      m == null || m.run(), mt.length > 0 && r();
    }, o = window;
    typeof o.requestIdleCallback == "function" ? o.requestIdleCallback(l, { timeout: 50 }) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(l) : setTimeout(l, 0);
  };
  return r(), () => {
    i.cancelled = !0;
  };
}
function yt({
  title: t,
  panel: i,
  preview: r,
  sourceLabel: l,
  receiverLabel: o,
  minimumSize: m = 210,
  maximumSize: h = 420,
  densityColorCeiling: x,
  densitySmoothing: y,
  showZeroPile: g = !0
}) {
  const { t: v } = Le(), P = b.useContext(hs), E = b.useContext(ms), N = b.useContext(ps), $ = b.useRef(null);
  b.useEffect(() => {
    const M = $.current;
    if (!M) return;
    let I = null, R = 0;
    const C = () => {
      var W;
      I = null;
      const L = ((W = M.parentElement) == null ? void 0 : W.clientWidth) ?? 230, D = Math.max(m, Math.min(h, Math.floor(L)));
      if (D === R && M.childElementCount > 0) return;
      R = D;
      const B = ds(y, D);
      bt(M, {
        title: t,
        panel: i,
        preview: r,
        sourceLabel: l,
        receiverLabel: o,
        size: D,
        densityColorCeiling: x ?? us(
          r,
          0.95,
          B,
          P
        ),
        densitySmoothingRadius: B,
        densityColorPower: P,
        pointAlpha: E,
        pointSize: N
      });
    }, T = () => {
      I !== null && cancelAnimationFrame(I), I = requestAnimationFrame(C);
    };
    T();
    const K = typeof ResizeObserver > "u" ? null : new ResizeObserver(T);
    return K == null || K.observe(M.parentElement ?? M), () => {
      K == null || K.disconnect(), I !== null && cancelAnimationFrame(I);
    };
  }, [x, P, y, h, m, i, E, N, r, o, l, t]);
  const A = (M) => r.eventCount > 0 ? `${(M / r.eventCount * 100).toFixed(1)}%` : "0.0%", F = i.zeroPile.source > 0 || i.zeroPile.receiver > 0 || i.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": v("{title} density biplot; {source} on x, {receiver} on y", {
    title: t,
    source: l,
    receiver: o
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: $, className: "gl-comp-biplot-surface" }),
    g && F && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: v("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: A(i.zeroPile.source),
      receiver: A(i.zeroPile.receiver),
      both: A(i.zeroPile.corner)
    }) })
  ] });
}
function Cr({
  title: t,
  preview: i,
  sourceLabel: r,
  receiverLabel: l,
  minimumSize: o,
  maximumSize: m,
  densityColorCeiling: h,
  densitySmoothing: x
}) {
  const { t: y } = Le(), g = b.useContext(hs), v = b.useContext(ms), P = b.useContext(ps), E = b.useRef(null);
  return b.useEffect(() => {
    const N = E.current;
    if (!N) return;
    let $ = null, A = 0;
    const F = () => {
      var G;
      $ = null;
      const R = ((G = N.parentElement) == null ? void 0 : G.clientWidth) ?? o, C = Math.max(o, Math.min(m, Math.floor(R)));
      if (C === A && N.dataset.cacheReady === "true") return;
      A = C, N.dataset.cacheReady = "false";
      const T = ds(x, C), K = h ?? us(
        i,
        0.95,
        T,
        g
      );
      bt(N, {
        title: t,
        panel: i.original,
        preview: i,
        sourceLabel: r,
        receiverLabel: l,
        size: C,
        densityColorCeiling: K,
        densitySmoothingRadius: T,
        densityColorPower: g,
        pointAlpha: v,
        pointSize: P,
        canvasScale: 2
      });
      const L = N.querySelector("canvas"), D = N.querySelector("svg"), B = document.createElement("div");
      bt(B, {
        title: t,
        panel: i.compensated,
        preview: i,
        sourceLabel: r,
        receiverLabel: l,
        size: C,
        densityColorCeiling: K,
        densitySmoothingRadius: T,
        densityColorPower: g,
        pointAlpha: v,
        pointSize: P,
        canvasScale: 2
      });
      const W = B.querySelector("canvas");
      !L || !W || !D || (L.classList.add("gl-comp-cached-canvas", "is-original"), L.dataset.assayLayer = "original", W.classList.add("gl-comp-cached-canvas", "is-compensated"), W.dataset.assayLayer = "compensated", N.insertBefore(W, D), N.dataset.cacheReady = "true");
    }, M = () => {
      $ == null || $(), $ = Nr(F);
    };
    M();
    const I = typeof ResizeObserver > "u" ? null : new ResizeObserver(M);
    return I == null || I.observe(N.parentElement ?? N), () => {
      I == null || I.disconnect(), $ == null || $();
    };
  }, [h, g, x, m, o, v, P, i, l, r, t]), /* @__PURE__ */ e.jsx(
    "figure",
    {
      className: "gl-comp-biplot",
      "aria-label": y("Cached uncompensated and compensated density biplot; {source} on x, {receiver} on y", {
        source: r,
        receiver: l
      }),
      children: /* @__PURE__ */ e.jsx(
        "div",
        {
          ref: E,
          className: "gl-comp-biplot-surface gl-comp-cached-biplot",
          "data-cache-mode": "dual-canvas"
        }
      )
    }
  );
}
function bi({
  preview: t,
  sourceLabel: i,
  receiverLabel: r,
  kind: l,
  densitySmoothing: o,
  compact: m = !1,
  compensatedTitle: h = "Compensated"
}) {
  const { t: x } = Le(), y = t.eventCount > 0 ? t.original.zeroPile.receiver / t.eventCount * 100 : 0, g = t.eventCount > 0 ? t.compensated.zeroPile.receiver / t.eventCount * 100 : 0, v = g - y;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${m ? " is-compact" : ""}`, children: [
    !m && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: x("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: t.eventCount.toLocaleString(),
      sampled: t.totalEvents > t.eventCount ? x(" sampled from {total}", { total: t.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        yt,
        {
          title: x("Original"),
          panel: t.original,
          preview: t,
          sourceLabel: i,
          receiverLabel: r,
          densitySmoothing: o,
          showZeroPile: !m
        }
      ),
      /* @__PURE__ */ e.jsx(
        yt,
        {
          title: h,
          panel: t.compensated,
          preview: t,
          sourceLabel: i,
          receiverLabel: r,
          densitySmoothing: o,
          showZeroPile: !m
        }
      )
    ] }),
    !m && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-diagnostic-note", children: l === "cytof" ? /* @__PURE__ */ e.jsx(e.Fragment, { children: x("Receiver events at exact zero: {original}% → {compensated}% ({delta} percentage points). A rise can be consistent with NNLS over-subtraction, while a residual source-associated rise can be consistent with under-compensation. Neither is a verdict without a suitable negative/control population.", {
      original: y.toFixed(1),
      compensated: g.toFixed(1),
      delta: `${v >= 0 ? "+" : ""}${v.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: x("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: h
    }) }) }),
    !m && (t.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": x("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: x("{value} MAD", { value: ie(t.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: ie(t.evidence.residualSlope ?? 0, 4) })
      ] }),
      t.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: x("{value} MAD", { value: ie(t.evidence.upperTailExcessMad, 3) }) })
      ] }),
      t.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: x("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: x("{value} MAD", { value: ie(t.evidence.upperTailSlopeDeltaMad, 3) }) })
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
function Sr({
  matrixView: t,
  sourceChannels: i,
  receiverChannels: r,
  selectedSourceIndex: l,
  selectedReceiverIndex: o,
  stagedCoefficients: m,
  maximumAbsoluteOffDiagonal: h,
  onSelect: x
}) {
  const { t: y } = Le(), g = 6, v = 74, P = 44, E = 10, N = r.length * g, $ = i.length * g, A = v + N + v, F = P + $ + E, M = b.useMemo(() => {
    const R = [];
    for (let C = 0; C < t.matrix.length; C++)
      for (let T = 0; T < t.matrix[C].length; T++) {
        const K = t.sourceAxisKeys[C], L = t.receiverAxisKeys[T], D = `${K}${vi}${L}`, B = m[D] ?? t.matrix[C][T], W = K === L;
        if (!W && (!Number.isFinite(B) || B === 0)) continue;
        const G = h > 0 && Number.isFinite(B) ? Math.min(1, Math.abs(B) / h) : 0, k = G > 0 ? 0.12 + 0.82 * Math.sqrt(G) : 0;
        R.push({
          sourceIndex: C,
          receiverIndex: T,
          pairKey: D,
          value: B,
          diagonal: W,
          fill: W ? "#cfd4db" : Number.isFinite(B) ? B < 0 ? `rgba(47,128,237,${k})` : `rgba(211,47,47,${k})` : "#ae3e3e"
        });
      }
    return R;
  }, [t, h, m]), I = (R) => {
    const C = R.currentTarget.getBoundingClientRect();
    if (!(C.width > 0) || !(C.height > 0)) return;
    const T = (R.clientX - C.left) * A / C.width, K = (R.clientY - C.top) * F / C.height, L = Math.floor((T - v) / g), D = Math.floor((K - P) / g);
    D < 0 || D >= i.length || L < 0 || L >= r.length || t.sourceAxisKeys[D] === t.receiverAxisKeys[L] || x(`${t.sourceAxisKeys[D]}${vi}${t.receiverAxisKeys[L]}`);
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-mini-matrix", "aria-labelledby": "comp-mini-matrix-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-mini-matrix-head", children: [
      /* @__PURE__ */ e.jsx("strong", { id: "comp-mini-matrix-heading", children: y("Matrix map") }),
      /* @__PURE__ */ e.jsx("span", { children: y("Source ↓ · receiver → · click a cell") })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        width: A,
        height: F,
        viewBox: `0 0 ${A} ${F}`,
        role: "img",
        "aria-label": y("Mini compensation matrix with {sources} source rows and {receivers} receiver columns", {
          sources: i.length,
          receivers: r.length
        }),
        onPointerDown: I,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: v, y: P, width: N, height: $, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          r.map((R, C) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: v + (C + 0.55) * g,
              y: P - 3,
              transform: `rotate(-58 ${v + (C + 0.55) * g} ${P - 3})`,
              textAnchor: "start",
              className: C === o ? "is-selected" : void 0,
              children: R.pnn
            },
            R.key
          )),
          i.map((R, C) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: v - 3,
              y: P + (C + 0.72) * g,
              textAnchor: "end",
              className: C === l ? "is-selected" : void 0,
              children: R.pnn
            },
            R.key
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: v,
              y: P + l * g,
              width: N,
              height: g,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: v + o * g,
              y: P,
              width: g,
              height: $,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          M.map((R) => /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: v + R.receiverIndex * g,
              y: P + R.sourceIndex * g,
              width: g,
              height: g,
              fill: R.fill,
              pointerEvents: "none",
              children: /* @__PURE__ */ e.jsx("title", { children: R.diagonal ? y("{channel} · self", { channel: i[R.sourceIndex].combined }) : `${i[R.sourceIndex].combined} → ${r[R.receiverIndex].combined} · ${sn(R.value)}` })
            },
            R.pairKey
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: v + o * g,
              y: P + l * g,
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
function Mr({
  dataset: t,
  pair: i,
  plotSize: r,
  densitySmoothing: l,
  flagged: o,
  selected: m,
  onSelect: h,
  onFlag: x
}) {
  const { t: y } = Le(), g = b.useRef(null), [v, P] = b.useState(() => typeof IntersectionObserver > "u");
  b.useEffect(() => {
    const $ = g.current;
    if (!$ || typeof IntersectionObserver > "u") {
      P(!0);
      return;
    }
    const A = new IntersectionObserver(
      (F) => P(F.some((M) => M.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return A.observe($), () => A.disconnect();
  }, []);
  const E = b.useMemo(
    () => v ? Pi(t, i.source.key, i.receiver.key) : null,
    [t, i.receiver.key, i.source.key, v]
  ), N = E != null && E.ready ? E.preview : null;
  return /* @__PURE__ */ e.jsxs(
    "article",
    {
      ref: g,
      className: `gl-comp-global-tile${m ? " is-selected" : ""}${o ? " is-flagged" : ""}`,
      "data-pair-key": i.pairKey,
      "data-event-signature": N == null ? void 0 : N.eventSignature,
      "data-x-range": N ? `${N.xRange[0]},${N.xRange[1]}` : void 0,
      "data-y-range": N ? `${N.yRange[0]},${N.yRange[1]}` : void 0,
      style: { width: r, height: r },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-tile-head", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: h,
              title: `${i.source.combined} → ${i.receiver.combined}`,
              "aria-label": y("Open details for {source} to {receiver}", {
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
          /* @__PURE__ */ e.jsx("label", { title: y("Keep this pair in Flagged"), children: /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: o,
              "aria-label": y("Flag global inspector pair {source} to {receiver} for follow-up", {
                source: i.source.label,
                receiver: i.receiver.label
              }),
              onChange: ($) => x($.currentTarget.checked)
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-comp-global-plot-button",
            onClick: h,
            title: y("{source} → {receiver} · {interaction}matrix {coefficient}%", {
              source: i.source.combined,
              receiver: i.receiver.combined,
              interaction: i.interaction && i.interaction !== "other" ? `${i.interaction} · ` : "",
              coefficient: (i.coefficient * 100).toFixed(1)
            }),
            "aria-label": y("Open details for {source} to {receiver}; matrix coefficient {coefficient}%", {
              source: i.source.label,
              receiver: i.receiver.label,
              coefficient: (i.coefficient * 100).toFixed(1)
            }),
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: r, height: r }, children: N ? /* @__PURE__ */ e.jsx(
              Cr,
              {
                title: "",
                preview: N,
                sourceLabel: i.source.label,
                receiverLabel: i.receiver.label,
                minimumSize: r,
                maximumSize: r,
                densitySmoothing: l
              }
            ) : E && !E.ready ? /* @__PURE__ */ e.jsx("span", { children: E.reason }) : /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" }) })
          }
        )
      ]
    }
  );
}
function kr({
  stateKey: t,
  header: i,
  children: r
}) {
  const { t: l } = Le(), [o, m] = pe(
    `compensation.${t}.globalInspectorLayer`,
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
          i,
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "gl-comp-layer-toggle",
              "aria-pressed": o === "compensated",
              "aria-label": l("Showing {shown} data; click to show {other} data", {
                shown: l(o === "original" ? "uncompensated" : "compensated"),
                other: l(o === "original" ? "compensated" : "uncompensated")
              }),
              title: l("Toggle every plot between uncompensated and compensated data without changing its frame"),
              onClick: () => m((h) => h === "original" ? "compensated" : "original"),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "gl-comp-layer-toggle-track", "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", {}) }),
                /* @__PURE__ */ e.jsx("span", { children: l(o === "original" ? "Uncompensated" : "Compensated") })
              ]
            }
          )
        ] }),
        r
      ]
    }
  );
}
const Er = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', Qt = 58 * Math.PI / 180, yi = 54, Ar = 16, Tr = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, $r = [
  { id: "matrices", label: "Matrices" },
  { id: "review", label: "Review" },
  { id: "display", label: "Display" }
];
function es({ label: t, text: i }) {
  return /* @__PURE__ */ e.jsx("span", { className: "gl-hint-icon gl-comp-pane-hint", role: "img", "aria-label": t, title: i, children: "?" });
}
function Fr(t) {
  if (!t) return ["its channels do not map to the file"];
  if (t.ok) return ["not a valid spillover matrix"];
  const i = new Set(t.errors.map(({ code: l }) => l)), r = [];
  return i.has("negative-coefficient") && r.push("negative coefficients"), i.has("non-unit-diagonal") && r.push("diagonal not 1"), r.length > 0 ? r : ["not a valid spillover matrix"];
}
const Ir = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], De = "", ji = 2500, wi = 400, Pr = 2500, Ni = 15e3, Ci = [2500, 5e3, 15e3, 5e4], Rr = 24, Si = 4, Mi = 624, Kr = Object.freeze({});
function ki(t) {
  if (!Number.isFinite(t)) return String(t);
  const i = t * 100;
  if (i === 0) return "0.0";
  const r = Math.abs(i), l = r >= 1 ? 1 : r >= 0.1 ? 2 : 3;
  return i.toFixed(l);
}
function ns(t) {
  return t.replace(/(?: · (?:edited|revised))+$/u, "");
}
function jt(t, i) {
  const r = t.index(i), l = r === void 0 ? void 0 : t.channels[r], o = (l == null ? void 0 : l.pnn) ?? i, m = t.labelForKey(i), h = ((l == null ? void 0 : l.label) ?? "").trim() || ((l == null ? void 0 : l.marker) ?? "").trim(), x = h && h !== o ? `${h} (${o})` : o;
  return { key: i, pnn: o, label: m, combined: x };
}
function ts(t, i) {
  const r = t.channels.find((l) => l.pnn === i);
  return jt(t, (r == null ? void 0 : r.key) ?? i);
}
function Lr(t, i) {
  return t === "cytof-spillover" && i === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function Or(t) {
  return t.replaceAll("-", " ");
}
function os(t) {
  if (t.length === 0) return 0;
  t.sort((r, l) => r - l);
  const i = Math.floor(t.length / 2);
  return t.length % 2 === 0 ? (t[i - 1] + t[i]) / 2 : t[i];
}
function Dr(t) {
  return Object.fromEntries(t.scientific.solverSettings.map(({ key: i, value: r }) => [i, r]));
}
function zr(t, i) {
  const r = Object.freeze({ ...t.scientific.matrix, matrix: i }), l = Dr(t);
  return t.scientific.kind === "flow-spillover" ? {
    kind: "flow-spillover",
    method: "matrix-inverse",
    solverVersion: t.scientific.solverVersion,
    solverSettings: {
      singularTolerance: Number(l.singularTolerance),
      conditionWarningThreshold: Number(l.conditionWarningThreshold)
    },
    matrix: r
  } : {
    kind: "cytof-spillover",
    method: "nnls",
    solverVersion: t.scientific.solverVersion,
    solverSettings: {
      tolerance: Number(l.tolerance),
      kktTolerance: Number(l.kktTolerance),
      maxIterations: Number(l.maxIterations),
      adaptationVersion: String(l.adaptationVersion)
    },
    matrix: r,
    includedChannels: t.scientific.includedChannels
  };
}
function Ei(t, i, r, l) {
  const o = t.scientific.matrix.sourceChannels.indexOf(i), m = t.scientific.matrix.receiverChannels.indexOf(r);
  if (o < 0 || m < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(t.scientific.matrix.matrix.map(
    (h, x) => Object.freeze(h.map((y, g) => x === o && g === m ? l : y))
  ));
}
function _r(t, i, r) {
  var h;
  if (!t) return null;
  const l = t.scientific.matrix.sourceChannels.indexOf(i), o = t.scientific.matrix.receiverChannels.indexOf(r);
  if (l < 0 || o < 0) return null;
  const m = (h = t.scientific.matrix.matrix[l]) == null ? void 0 : h[o];
  return Number.isFinite(m) ? m : null;
}
function Ai(t, i, r) {
  const l = Math.max(Math.abs(t), Math.abs(i), 1e-3);
  return Object.freeze(r === "cytof" ? { lower: 0, upper: Math.max(t + l, l * 2) } : { lower: t - l, upper: t + l });
}
function Ur(t, i) {
  const r = (i - t) / 3;
  return Object.freeze([t, t + r, t + 2 * r, i]);
}
function Br(t, i) {
  return t.length === i.length && t.every((r, l) => {
    var o;
    return r.length === ((o = i[l]) == null ? void 0 : o.length) && r.every((m, h) => m === i[l][h]);
  });
}
function Vr(t, i) {
  if (t.compensatedLayerStatus().state !== "ready" || i.length === 0 || t.fcs.nEvents === 0) return null;
  const l = i.flatMap((P) => {
    const E = t.channels.findIndex((N) => N.pnn === P);
    return E < 0 ? [] : [E];
  });
  if (l.length === 0) return null;
  const o = Math.min(2048, t.fcs.nEvents), m = [];
  let h = 0, x = 0, y = 0, g = "", v = -1;
  for (const P of l) {
    const E = t.originalColumnData(P), N = t.compensatedColumnData(P), $ = [];
    for (let F = 0; F < o; F++) {
      const M = o === 1 ? 0 : Math.floor(F * (t.fcs.nEvents - 1) / (o - 1)), I = E[M], R = N[M], C = Math.abs(R - I);
      $.push(C), m.push(C), C > Math.max(1e-6, Math.abs(I) * 1e-6) && h++, I < 0 && R === 0 && y++, x = Math.max(x, C);
    }
    const A = os($);
    A > v && (v = A, g = jt(t, t.channels[P].key).combined);
  }
  return {
    previewEvents: o,
    comparedValues: m.length,
    changedValues: h,
    medianAbsoluteDelta: os(m),
    maxAbsoluteDelta: x,
    zeroedNegativeValues: y,
    mostChangedChannel: g,
    mostChangedChannelMedianDelta: Math.max(0, v)
  };
}
function Wr(t, i) {
  return t.origin.type === "uploaded" ? t.origin.fileName : t.origin.type === "embedded-fcs" ? `${t.origin.fileName} · ${i("embedded FCS")}` : t.origin.type === "manual" ? i("set by hand, from an empty matrix") : `${t.origin.presetId} · ${i("bundled preset")} ${t.origin.presetVersion}`;
}
function qr(t) {
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
  }, r = pt(
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
    error: `The SCE spillover matrix is invalid. ${r.errors.map(({ message: l }) => l).join(" ")}`
  };
}
function Gr({
  sample: t,
  sampleName: i = "sample.fcs",
  hostedCompensationMatrix: r = null,
  compensationOn: l,
  onApplyProfile: o,
  otherEmbeddedLayerFiles: m = [],
  onRemoveProfile: h,
  existingHostAssays: x = [],
  onAdoptExistingAssay: y,
  onCancelApply: g,
  hasExistingGates: v = !1,
  applyStatus: P = null,
  installedProfile: E = null,
  applyTargetCount: N = 1,
  applyTargetEventCount: $,
  applyWorkerCount: A,
  applyWorkerLimit: F,
  onApplyWorkerCountChange: M,
  installedBaselineProfile: I = null,
  reviewPopulations: R = [],
  reviewPopulationMasks: C = Kr,
  onPreviewCompensationCandidate: T,
  onSolveCompensationSweep: K,
  onCancelCompensationSweep: L,
  onSuspendBackgroundWork: D,
  visible: B = !0,
  stateKey: W,
  densityColorPower: G = cs,
  channelLabelMode: k = "marker",
  onDensityColorPowerChange: O = () => {
  },
  matrices: xe
}) {
  var Xs, Js;
  const { t: s } = Le(), We = Ua("compensation"), H = t.compensatedLayerStatus(), an = H.state === "missing" ? null : H.metadata, V = (an == null ? void 0 : an.runtimeIdentity) === "profile" ? an : null, S = (E == null ? void 0 : E.profileId) === (V == null ? void 0 : V.profileId) ? E : null, ae = !V && t.instrument === "flow" ? t.spillover : null, we = (r == null ? void 0 : r.kind) === "flow-spillover" ? r : null, wt = b.useMemo(
    () => qr(r),
    [r]
  ), [Fe, Ne] = pe(
    `compensation.${W}.selectedPair`,
    null
  ), [Nt, Oe] = b.useState(null), [Gn, gs] = pe(
    `compensation.${W}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [bn, fs] = pe(
    "compensation.inspectorWidth",
    Mi
  ), [ke, Hn] = pe(
    `compensation.${W}.workspaceView`,
    "matrix"
  ), [ze, Zn] = pe(
    `compensation.${W}.globalPairFilter`,
    "relevant"
  ), [Oi, Di] = pe(
    `compensation.${W}.globalLayout`,
    null
  ), [zi, _i] = pe(
    "compensation.globalPlotSize.v5",
    160
  ), [Ui, Bi] = pe(
    "compensation.densitySmoothing.v3",
    6
  ), [Vi, Wi] = pe(
    "compensation.pointAlpha.v1",
    0.85
  ), [qi, Gi] = pe(
    "compensation.pointSize.v1",
    1
  ), [xs, Hi] = pe(
    "compensation.paneSection.v1",
    "matrices"
  ), [Ct, Zi] = pe(
    "compensation.pairPreviewEventLimit.v1",
    Ni
  ), [Fn, vs] = b.useState(""), [In, St] = b.useState(!1), [Mt, bs] = b.useState(null), [yn, kt] = pe(
    `compensation.${W}.reviewPopulation`,
    "all"
  ), [Yn, Yi] = pe(
    `compensation.${W}.flaggedPairs`,
    []
  ), [qe, Xi] = pe(
    `compensation.${W}.evidenceMode`,
    "biological"
  ), [Ji, Qi] = pe(
    `compensation.${W}.sweepBounds`,
    {}
  ), [Et, At] = pe(
    `compensation.${W}.sweepWorkers`,
    2
  ), [Ie, ys] = b.useState(""), [Ee, Tt] = b.useState(""), [ea, $t] = b.useState(0), [X, Xn] = b.useState({}), [na, rn] = b.useState({}), [Ge, ln] = b.useState({ state: "idle" }), [ta, Xe] = b.useState({}), [sa, on] = b.useState({}), [Ce, jn] = b.useState(null), [ia, Pn] = b.useState(null), [he, wn] = b.useState(null), [js, be] = b.useState(null), [Jn, Ft] = b.useState(""), [aa, ws] = b.useState(!1), [ra, Ns] = b.useState(!1), Pe = b.useRef(0), Nn = b.useRef(0), [Cs, Q] = b.useState(null), [Ss, ge] = b.useState(!1), [J, Qn] = b.useState(
    () => wt.draft
  ), [Rn, cn] = b.useState(
    () => {
      var u;
      const n = ((u = wt.draft) == null ? void 0 : u.matrix.receiverChannels) ?? [], a = /* @__PURE__ */ new Map();
      for (const d of t.channels) {
        const p = d.pnn.trim().normalize("NFC");
        a.set(p, (a.get(p) ?? 0) + 1);
      }
      return new Set(n.filter((d) => a.get(d) === 1));
    }
  ), [Ms, Je] = b.useState(
    () => wt.error
  ), [Ae, He] = b.useState(!1), [et, ks] = b.useState(!1), [nt, Es] = b.useState(
    () => {
      var n;
      return ((n = x[0]) == null ? void 0 : n.id) ?? "";
    }
  ), [It, tt] = b.useState(!1), [st, ye] = b.useState(null), [la, _e] = b.useState(!1), [oa, Ze] = b.useState(null), Re = b.useRef(!1), As = b.useRef(null), Ts = b.useRef(null), Cn = b.useRef(null), [it, ca] = b.useState(null), [Pt, $s] = b.useState(null);
  b.useEffect(() => {
    if (!it || typeof ResizeObserver > "u") {
      $s(null);
      return;
    }
    const n = () => {
      const { width: u, height: d } = it.getBoundingClientRect();
      $s((p) => {
        if (u <= 0 || d <= 0) return null;
        const f = { width: Math.round(u), height: Math.round(d) };
        return p && p.width === f.width && p.height === f.height ? p : f;
      });
    };
    n();
    const a = new ResizeObserver(n);
    return a.observe(it), () => a.disconnect();
  }, [it]);
  const q = la || P !== null, Qe = Math.max(0, Math.floor(N)), da = Math.max(
    0,
    Math.floor($ ?? t.fcs.nEvents)
  ), en = x.find(
    ({ id: n }) => n === nt
  ) ?? x[0] ?? null;
  b.useEffect(() => {
    var n;
    nt && x.some(({ id: a }) => a === nt) || (Es(((n = x[0]) == null ? void 0 : n.id) ?? ""), tt(!1));
  }, [x, nt]);
  const le = P ?? (st ? {
    phase: "applying",
    profileName: oa ?? (J == null ? void 0 : J.fileName) ?? "Compensation",
    fraction: st.fraction,
    processedEvents: st.processedEvents,
    totalEvents: st.totalEvents
  } : null);
  b.useEffect(() => {
    B || (Nn.current++, Pe.current++, ln({ state: "idle" }), wn(null), jn(null), D == null || D());
  }, [D, B]);
  const Rt = b.useMemo(
    () => t.channels.map(({ pnn: n, columnIndex: a }) => ({ pnn: n, columnIndex: a })),
    [t]
  ), je = b.useMemo(() => {
    if (!ae) return null;
    const n = ae.channels.map((d) => {
      const p = t.index(d);
      return p === void 0 ? null : t.channels[p].pnn;
    });
    if (n.some((d) => d === null))
      return {
        validation: null,
        error: "The embedded matrix could not be mapped back to exact FCS channel identities.",
        keyword: void 0
      };
    const a = pt({
      sourceChannels: n,
      receiverChannels: n,
      matrix: ae.matrix
    }, "flow-spillover"), u = ["$SPILLOVER", "$SPILL", "SPILL"].find((d) => typeof t.fcs.keywords[d] == "string");
    return {
      validation: a,
      error: a.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${a.errors.map(({ message: d }) => d).join(" ")}`,
      keyword: u
    };
  }, [t, ae]), ee = yn === "all" ? null : R.find(({ id: n }) => n === yn) ?? null, me = ee ? C[ee.id] ?? null : null, oe = me ? (ee == null ? void 0 : ee.eventCount) ?? 0 : t.fcs.nEvents, at = Ct === "all" ? "all" : Ci.includes(Number(Ct)) ? Number(Ct) : Ni, Kn = b.useMemo(
    () => gn(
      t.fcs.nEvents,
      at === "all" ? Math.max(1, t.fcs.nEvents) : at,
      me
    ),
    [at, oe, me, t]
  ), Ln = b.useMemo(
    () => gn(t.fcs.nEvents, 2048, me),
    [me, t]
  ), Kt = b.useMemo(
    () => gn(
      t.fcs.nEvents,
      Pr,
      me
    ),
    [me, t]
  );
  b.useEffect(() => {
    yn !== "all" && !R.some(({ id: n }) => n === yn) && kt("all");
  }, [yn, R, kt]), b.useEffect(() => {
    Pe.current++, L == null || L(), Xe({}), on({}), jn(null), wn(null), be(null);
  }, [yn, me, L]);
  const ue = b.useMemo(() => J ? Ba({
    kind: "cytof-spillover",
    matrix: J.matrix,
    sampleChannels: Rt,
    includedChannels: Array.from(Rn)
  }) : null, [J, Rn, Rt, k]), c = b.useMemo(() => {
    var a;
    if (ae) {
      const u = t.spilloverOrigin, d = u.kind === "external" ? u : null;
      return {
        sourceAxisKeys: ae.channels,
        receiverAxisKeys: ae.channels,
        sourceChannels: ae.channels.map((p) => jt(t, p)),
        receiverChannels: ae.channels.map((p) => jt(t, p)),
        matrix: ae.matrix,
        kind: "flow",
        title: we ? "SCE spillover matrix" : d ? `Compensation matrix from ${d.label}` : "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: d ? "This FCS carries no spillover matrix of its own; these coefficients came from the imported FlowJo workspace and are applied unchanged." + (d.droppedChannels.length ? ` ${d.droppedChannels.length} of its parameter(s) are not in this file (${d.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "") : "Applying the embedded matrix leaves its coefficients unchanged." + (u.kind === "fcs" && ((a = u.droppedChannels) != null && a.length) ? ` ${u.droppedChannels.length} of its parameter(s) are not among this file's channels (${u.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "")
      };
    }
    if (!S || !V) return null;
    const n = S.scientific.kind === "cytof-spillover" ? Qa(S.scientific.matrix) : S.scientific.matrix;
    return n.matrix.length !== n.sourceChannels.length || n.matrix.some((u) => !u || u.length !== n.receiverChannels.length) ? null : {
      sourceAxisKeys: n.sourceChannels,
      receiverAxisKeys: n.receiverChannels,
      sourceChannels: n.sourceChannels.map((u) => ts(t, u)),
      receiverChannels: n.receiverChannels.map((u) => ts(t, u)),
      matrix: n.matrix,
      kind: S.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: S.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: S.scientific.kind === "cytof-spillover" ? s("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: n.sourceChannels.length,
        receivers: n.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: S.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [we, V, S, t, ae, s, k]), fe = Oi ?? (c && c.sourceAxisKeys.length <= Ar ? "matrix" : "compact"), re = (c == null ? void 0 : c.sourceChannels) ?? [], ce = (c == null ? void 0 : c.receiverChannels) ?? [];
  b.useEffect(() => {
    At((n) => Math.max(1, Math.min(Si, Math.round(n) || 1)));
  }, [At]);
  const rt = Nt ?? Fe, Lt = b.useMemo(() => {
    if (!c || !Fe) return !1;
    const [n, a] = Fe.split(De);
    return n !== a && c.sourceAxisKeys.includes(n) && c.receiverAxisKeys.includes(a);
  }, [c, Fe]), j = b.useMemo(() => {
    if (!c || !rt) return null;
    const [n, a] = rt.split(De), u = c.sourceAxisKeys.indexOf(n), d = c.receiverAxisKeys.indexOf(a);
    return u < 0 || d < 0 || c.sourceAxisKeys[u] === c.receiverAxisKeys[d] ? null : {
      pairKey: rt,
      sourceIndex: u,
      receiverIndex: d,
      source: re[u],
      receiver: ce[d],
      value: c.matrix[u][d],
      interaction: c.kind === "cytof" ? An(
        c.sourceAxisKeys[u],
        c.receiverAxisKeys[d]
      ) : null
    };
  }, [rt, c, ce, re]);
  b.useEffect(() => {
    if (!j) {
      Ft("");
      return;
    }
    const n = X[j.pairKey];
    Ft(ie((n ?? j.value) * 100, 6));
  }, [j == null ? void 0 : j.pairKey, j == null ? void 0 : j.value, X]);
  const Se = b.useMemo(() => j ? Yt(
    t,
    j.source.key,
    j.receiver.key,
    {
      eventMask: me,
      fixedEventIndices: Kn,
      eligibleEventCount: oe
    }
  ) : null, [l, H.state, Kn, oe, me, t, j]), Te = b.useMemo(() => {
    if (!c || H.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const n = [];
    for (let p = 0; p < c.matrix.length; p++)
      for (let f = 0; f < c.matrix[p].length; f++) {
        const w = c.sourceAxisKeys[p], U = c.receiverAxisKeys[f];
        if (w === U) continue;
        const z = c.matrix[p][f];
        if (!Number.isFinite(z)) continue;
        const _ = c.kind === "cytof" ? An(w, U) : null, Y = _ !== null && _ !== "self" && _ !== "other";
        z === 0 && !Y && qe === "biological" || n.push({
          sourceIndex: p,
          receiverIndex: f,
          pairKey: `${w}${De}${U}`,
          source: re[p],
          receiver: ce[f],
          coefficient: z,
          interaction: _,
          physicalPrior: Y ? 1 : 0
        });
      }
    n.sort((p, f) => f.physicalPrior - p.physicalPrior || Math.abs(f.coefficient) - Math.abs(p.coefficient));
    const a = n.slice(0, 240), u = a.flatMap((p) => {
      const f = Yt(
        t,
        p.source.key,
        p.receiver.key,
        {
          eventMask: me,
          fixedEventIndices: Ln,
          eligibleEventCount: oe
        }
      );
      return f.ready ? [{ ...p, evidence: f.preview.evidence }] : [];
    }), d = or(
      u.map(({ coefficient: p, physicalPrior: f, evidence: w }) => ({ coefficient: p, physicalPrior: f, evidence: w })),
      c.kind,
      qe
    ).map(({ index: p, relativePriority: f }) => ({ ...u[p], relativePriority: f }));
    return {
      candidateCount: n.length,
      screenedCount: a.length,
      evaluableCount: u.length,
      items: d.slice(0, 8)
    };
  }, [ea, qe, H.state, c, ce, Ln, oe, me, t, re]), de = b.useMemo(() => new Set(
    S ? S.scientific.kind === "flow-spillover" ? S.scientific.matrix.receiverChannels : S.scientific.includedChannels : []
  ), [S]), ne = b.useMemo(() => c ? hr(
    t,
    Array.from(/* @__PURE__ */ new Set([
      ...c.sourceAxisKeys,
      ...c.receiverAxisKeys
    ])),
    {
      eventMask: me,
      fixedEventIndices: Kt,
      eligibleEventCount: oe
    }
  ) : null, [
    l,
    Kt,
    H.state,
    c,
    oe,
    me,
    t
  ]);
  b.useEffect(() => {
    if (!c || de.size === 0) return;
    const n = de.has(Ie) ? Ie : c.sourceAxisKeys.find((u) => de.has(u)) ?? "", a = de.has(Ee) && Ee !== n ? Ee : c.receiverAxisKeys.find((u) => u !== n && de.has(u)) ?? "";
    n !== Ie && ys(n), a !== Ee && Tt(a);
  }, [de, Ee, Ie, c]);
  const Sn = b.useMemo(() => new Set(Yn), [Yn]), Ot = b.useMemo(() => {
    var u;
    if (!c) return [];
    const n = [], a = de.size > 0;
    for (let d = 0; d < c.sourceAxisKeys.length; d++) {
      const p = c.sourceAxisKeys[d];
      if (!(a && !de.has(p)))
        for (let f = 0; f < c.receiverAxisKeys.length; f++) {
          const w = c.receiverAxisKeys[f];
          if (p === w || a && !de.has(w)) continue;
          const U = (u = c.matrix[d]) == null ? void 0 : u[f];
          if (!Number.isFinite(U)) continue;
          const z = re[d], _ = ce[f];
          if (!z || !_ || ne != null && ne.ready && (!ne.dataset.channels.has(z.key) || !ne.dataset.channels.has(_.key))) continue;
          const Y = c.kind === "cytof" ? An(p, w) : null, se = Y !== null && Y !== "self" && Y !== "other";
          n.push({
            sourceIndex: d,
            receiverIndex: f,
            pairKey: `${p}${De}${w}`,
            source: z,
            receiver: _,
            coefficient: U,
            interaction: Y,
            physicalPrior: se ? 1 : 0
          });
        }
    }
    return n;
  }, [ne, de, c, ce, re]), $e = b.useMemo(() => {
    const n = Fn.trim().toLocaleLowerCase();
    return Ot.filter((a) => {
      const u = Math.abs(a.coefficient) > 1e-12, d = a.physicalPrior > 0;
      return ze === "all" || ze === "relevant" && (u || d) || ze === "nonzero" && u || ze === "physical" && d || ze === "flagged" && Sn.has(a.pairKey) ? n ? `${a.source.combined} ${a.receiver.combined}`.toLocaleLowerCase().includes(n) : !0 : !1;
    });
  }, [Sn, Ot, ze, Fn]);
  b.useEffect(() => {
    var a;
    if (!Mt || ke !== "global") return;
    const n = [...((a = Cn.current) == null ? void 0 : a.querySelectorAll(".gl-comp-global-tile")) ?? []].find((u) => u.dataset.pairKey === Mt);
    n && (n.scrollIntoView({ block: "center", inline: "center" }), bs(null));
  }, [In, fe, Mt, $e, ke]);
  const Dt = b.useMemo(() => {
    if (fe === "compact" || fe === "matrix") return [];
    const n = /* @__PURE__ */ new Map();
    for (const a of $e) {
      const u = fe === "source" ? a.source : a.receiver, d = n.get(u.key);
      d ? d.pairs.push(a) : n.set(u.key, { channel: u, pairs: [a] });
    }
    return [...n.values()];
  }, [fe, $e]), ua = b.useMemo(() => {
    const n = /* @__PURE__ */ new Map();
    if (fe !== "matrix") return n;
    for (const a of $e) n.set(`${a.sourceIndex}:${a.receiverIndex}`, a);
    return n;
  }, [fe, $e]), Fs = b.useMemo(
    () => fe === "compact" ? $e : fe === "matrix" ? [...$e].sort((n, a) => n.sourceIndex - a.sourceIndex || n.receiverIndex - a.receiverIndex) : Dt.flatMap((n) => n.pairs),
    [Dt, fe, $e]
  ), Is = `${s(Tr[ze])}${Fn.trim() ? s(" · search “{query}”", { query: Fn.trim() }) : ""}`, On = Math.max(120, Math.min(220, Math.round(zi) || 120)), Ps = b.useRef(null), [Rs, Ks] = b.useState(0);
  b.useEffect(() => {
    const n = Ps.current;
    if (!n || fe !== "matrix" || typeof ResizeObserver > "u") return;
    const a = new ResizeObserver(() => Ks(n.clientWidth));
    return a.observe(n), Ks(n.clientWidth), () => a.disconnect();
  }, [fe, ke, ne == null ? void 0 : ne.ready]);
  const Ls = (c == null ? void 0 : c.receiverChannels.length) ?? 0, zt = Ls > 0 && Rs > 0 ? Math.max(120, Math.min(On, Math.floor((Rs - 92 - 12) / Ls))) : On, nn = Math.max(1, Math.min(10, Math.round(Ui) || 6)), lt = Math.max(0.1, Math.min(1, Number(Vi) || 0.85)), ot = Math.max(0.3, Math.min(3, Number(qi) || 1)), te = b.useMemo(() => !S || !c || H.state !== "ready" ? [] : Yn.flatMap((n) => {
    const [a, u] = n.split(De), d = c.sourceAxisKeys.indexOf(a), p = c.receiverAxisKeys.indexOf(u);
    if (d < 0 || p < 0 || a === u || !de.has(a) || !de.has(u)) return [];
    const f = Yt(
      t,
      re[d].key,
      ce[p].key,
      {
        eventMask: me,
        fixedEventIndices: Ln,
        eligibleEventCount: oe
      }
    );
    if (!f.ready) return [];
    const w = Te.items.find((U) => U.pairKey === n);
    return [{
      sourceIndex: d,
      receiverIndex: p,
      pairKey: n,
      source: re[d],
      receiver: ce[p],
      coefficient: c.matrix[d][p],
      interaction: c.kind === "cytof" ? An(a, u) : null,
      physicalPrior: c.kind === "cytof" && An(a, u) !== "other" ? 1 : 0,
      evidence: f.preview.evidence,
      relativePriority: (w == null ? void 0 : w.relativePriority) ?? 0
    }];
  }), [Yn, de, H.state, c, S, ce, Te.items, Ln, oe, me, t, re]), Ue = te, Os = b.useMemo(() => {
    if (!S) return 0.01;
    const n = [];
    for (let a = 0; a < S.scientific.matrix.matrix.length; a++) {
      const u = S.scientific.matrix.sourceChannels[a];
      for (let d = 0; d < S.scientific.matrix.matrix[a].length; d++) {
        if (u === S.scientific.matrix.receiverChannels[d]) continue;
        const p = Math.abs(S.scientific.matrix.matrix[a][d]);
        Number.isFinite(p) && p > 1e-12 && n.push(p);
      }
    }
    return n.length > 0 ? os(n) : 0.01;
  }, [S]), _t = (n, a) => {
    const u = Ji[n];
    if (u) return u;
    const d = Ai(a, Os, (c == null ? void 0 : c.kind) ?? "flow");
    return {
      lowerPercent: ie(d.lower * 100, 5),
      upperPercent: ie(d.upper * 100, 5)
    };
  }, Dn = (n, a) => {
    const u = _t(n, a), d = Number(u.lowerPercent) / 100, p = Number(u.upperPercent) / 100;
    return !Number.isFinite(d) || !Number.isFinite(p) ? { lower: d, upper: p, error: "Enter finite lower and upper sweep bounds." } : (c == null ? void 0 : c.kind) === "cytof" && d < 0 ? { lower: d, upper: p, error: "CyTOF NNLS sweep bounds cannot be negative." } : p > d ? { lower: d, upper: p, error: null } : { lower: d, upper: p, error: "The upper sweep bound must be greater than the lower bound." };
  }, ct = (n, a, u, d) => {
    Qi((p) => ({
      ...p,
      [n]: {
        ...p[n] ?? (() => {
          const f = Ai(a, Os, (c == null ? void 0 : c.kind) ?? "flow");
          return {
            lowerPercent: ie(f.lower * 100, 5),
            upperPercent: ie(f.upper * 100, 5)
          };
        })(),
        [u]: d
      }
    })), Xe((p) => {
      if (!(n in p)) return p;
      const f = { ...p };
      return delete f[n], f;
    }), on((p) => {
      if (!(n in p)) return p;
      const f = { ...p };
      return delete f[n], f;
    });
  }, zn = (n, a) => {
    Yi((u) => a ? u.includes(n) ? u : [...u, n] : u.filter((d) => d !== n)), a ? (Ne(n), Pn(n)) : (Xe((u) => {
      if (!(n in u)) return u;
      const d = { ...u };
      return delete d[n], d;
    }), on((u) => {
      if (!(n in u)) return u;
      const d = { ...u };
      return delete d[n], d;
    }));
  }, ha = () => {
    if (!c || !Ie || !Ee || Ie === Ee) return;
    if (!de.has(Ie) || !de.has(Ee)) {
      be("Both channels must be included in the installed compensation solve.");
      return;
    }
    const n = `${Ie}${De}${Ee}`;
    zn(n, !0), be(null);
  }, Ut = Ue.reduce((n, a) => n + (Dn(a.pairKey, a.coefficient).error ? 1 : 0), 0), Mn = b.useMemo(() => {
    if (!S) return null;
    const n = S.scientific.matrix.matrix.map((a) => Array.from(a));
    for (const [a, u] of Object.entries(X)) {
      const [d, p] = a.split(De), f = S.scientific.matrix.sourceChannels.indexOf(d), w = S.scientific.matrix.receiverChannels.indexOf(p);
      f >= 0 && w >= 0 && (n[f][w] = u);
    }
    return Object.freeze(n.map((a) => Object.freeze(a)));
  }, [S, X]);
  b.useEffect(() => {
    const n = Object.keys(X).length;
    if (!B || n === 0 || !S || S.scientific.kind !== "flow-spillover" || H.state !== "ready" || !Mn || !j || !T) {
      Nn.current++, ln({ state: "idle" });
      return;
    }
    const a = Kn;
    if (a.length === 0) {
      ln({
        state: "error",
        pairKey: j.pairKey,
        message: s("The selected review population contains no events.")
      });
      return;
    }
    const u = ++Nn.current, d = j.pairKey;
    ln((f) => ({
      state: "updating",
      pairKey: d,
      ...(f.state === "ready" || f.state === "updating") && f.pairKey === d && f.preview ? { preview: f.preview } : {}
    }));
    const p = window.setTimeout(() => {
      T(
        S,
        a,
        Mn
      ).then((f) => {
        if (Nn.current !== u) return;
        const w = f.sourceChannels.indexOf(j.source.pnn), U = f.sourceChannels.indexOf(j.receiver.pnn);
        if (w < 0 || U < 0)
          throw new Error(s("The preview result did not contain the selected flow channels."));
        const z = Xt(
          t,
          j.source.pnn,
          j.receiver.pnn,
          a,
          f.candidateColumns[w],
          f.candidateColumns[U],
          { totalEvents: oe }
        );
        if (!z.ready) throw new Error(z.reason);
        ln({
          state: "ready",
          pairKey: d,
          preview: z.preview
        });
      }).catch((f) => {
        if (Nn.current !== u) return;
        const w = f instanceof Error ? f.message : String(f);
        /cancel|supersed|stale/i.test(w) || ln({ state: "error", pairKey: d, message: w });
      });
    }, 90);
    return () => window.clearTimeout(p);
  }, [
    H.state,
    T,
    S,
    Kn,
    oe,
    t,
    t.dataRevision,
    t.displayTransformContextKey,
    t.layerRevision,
    j,
    X,
    s,
    B,
    Mn
  ]);
  const ma = b.useMemo(() => !c || Object.keys(X).length === 0 ? null : {
    sourceChannels: c.sourceAxisKeys,
    receiverChannels: c.receiverAxisKeys,
    matrix: c.matrix.map(
      (n, a) => n.map((u, d) => {
        const p = `${c.sourceAxisKeys[a]}${De}${c.receiverAxisKeys[d]}`;
        return X[p] ?? u;
      })
    )
  }, [c, X]), Ds = b.useMemo(() => {
    if (!c) return [];
    const n = [];
    for (let a = 0; a < c.matrix.length; a++)
      for (let u = 0; u < c.matrix[a].length; u++) {
        const d = c.matrix[a][u];
        c.sourceAxisKeys[a] === c.receiverAxisKeys[u] || !Number.isFinite(d) || d <= 1 || n.push(`${re[a].combined} → ${ce[u].combined}`);
      }
    return n;
  }, [c, ce, re]), Bt = b.useMemo(() => {
    if (!c) return [];
    const n = [];
    for (let a = 0; a < c.matrix.length; a++)
      for (let u = 0; u < c.matrix[a].length; u++) {
        const d = c.matrix[a][u], p = c.sourceAxisKeys[a] === c.receiverAxisKeys[u], f = `${re[a].combined} → ${ce[u].combined}`;
        Number.isFinite(d) ? p && Math.abs(d - 1) > 1e-8 ? n.push(`${re[a].combined}: diagonal is ${sn(d)}, not 100%`) : !p && d < 0 ? n.push(`${f}: negative coefficient (${sn(d)})`) : !p && d > 1 && n.push(`${f}: coefficient above 100%`) : n.push(`${f}: non-finite coefficient (${String(d)})`);
      }
    return n;
  }, [c, ce, re]), zs = b.useMemo(
    () => (c == null ? void 0 : c.matrix.some((n) => n.some((a) => !Number.isFinite(a)))) ?? !1,
    [c]
  ), Ke = b.useMemo(
    () => V && H.state === "ready" ? Vr(t, V.includedPnns) : null,
    [H.state, V, t]
  ), dt = b.useMemo(() => {
    const n = [...Bt];
    return H.state === "stale" && n.push(...H.reasons.map((a) => `Profile unavailable: ${Or(a)}`)), n;
  }, [H, Bt]), _s = V ? (S == null ? void 0 : S.name) ?? "Installed compensation profile" : ae ? we ? "SCE spillover matrix" : "Embedded FCS matrix" : "No compatible matrix", pa = V ? Lr(V.kind, V.method) : ae ? "Flow linear inverse" : "Not configured", ut = s(pa), Vt = (V == null ? void 0 : V.includedPnns.length) ?? (ae == null ? void 0 : ae.channels.length) ?? 0, ht = (S == null ? void 0 : S.name) ?? (V == null ? void 0 : V.profileId) ?? _s, Us = ns(ht), ga = Us !== ht || (S == null ? void 0 : S.recordType) === "revision" ? `${Us} · ${s("revised")}` : ht, fa = ae !== null && !zs || V !== null && H.state === "ready", Bs = b.useMemo(() => {
    if (!c) return 0;
    let n = 0;
    for (let a = 0; a < c.matrix.length; a++)
      for (let u = 0; u < c.matrix[a].length; u++) {
        if (c.sourceAxisKeys[a] === c.receiverAxisKeys[u]) continue;
        const d = c.matrix[a][u];
        Number.isFinite(d) && (n = Math.max(n, Math.abs(d)));
      }
    return n;
  }, [c]), _n = !!((S == null ? void 0 : S.scientific.kind) === "flow-spillover" && H.state === "ready" && c && Math.max(c.sourceAxisKeys.length, c.receiverAxisKeys.length) <= Rr), kn = b.useMemo(() => {
    const a = [...re, ...ce].map((z) => z.combined), u = typeof document > "u" ? null : document.createElement("canvas").getContext("2d");
    u && (u.font = `11px ${Er}`);
    const d = (z) => u ? u.measureText(z).width : z.length * 11 * 0.55, p = a.reduce((z, _) => Math.max(z, d(_)), 0), f = Math.min(320, Math.max(94, Math.ceil(p) + 12)), w = Math.min(260, Math.max(82, Math.ceil(p) + 6)), U = Math.max(88, Math.ceil(w * Math.sin(Qt) + 12));
    return { rowLabelWidth: f, columnLabelWidth: w, columnLabelHeight: U };
  }, [_n, ce, re]), dn = c ? (() => {
    const n = Math.max(c.sourceAxisKeys.length, c.receiverAxisKeys.length), [a, u, d, p] = _n ? [42, 54, 64, 960] : [32, 38, 44, 760], f = Math.max(a, Math.min(u, Math.floor(p / n)));
    if (!Pt) return f;
    const w = Math.min(
      Pt.width - yi - kn.rowLabelWidth - kn.columnLabelWidth * Math.cos(Qt),
      Pt.height - yi - kn.columnLabelHeight
    );
    return Math.max(f, Math.min(d, Math.floor(w / n)));
  })() : 13, Un = b.useMemo(() => ({
    ...kn,
    // The last column's label leans past the matrix's right edge by its horizontal extent.
    overhang: Math.max(0, Math.ceil(kn.columnLabelWidth * Math.cos(Qt) - dn / 2))
  }), [kn, dn]);
  b.useEffect(() => {
    Xn({}), rn({}), ln({ state: "idle" }), Nn.current++;
  }, [S == null ? void 0 : S.profileId]), b.useEffect(() => {
    (c == null ? void 0 : c.kind) === "flow" && ze === "physical" && Zn("relevant");
  }, [ze, c == null ? void 0 : c.kind, Zn]);
  const xa = (n) => {
    gs((a) => ({ ...a, [n]: !a[n] }));
  }, Vs = (n) => {
    var d;
    const a = ((d = Cn.current) == null ? void 0 : d.getBoundingClientRect().width) ?? 1100, u = Math.max(360, Math.min(900, a - 440 - 8));
    return Math.max(360, Math.min(u, Math.round(n)));
  }, va = (n) => {
    var p;
    if (n.button !== 0) return;
    n.preventDefault();
    const a = n.currentTarget;
    (p = a.setPointerCapture) == null || p.call(a, n.pointerId);
    const u = (f) => {
      var U;
      const w = (U = Cn.current) == null ? void 0 : U.getBoundingClientRect();
      w && fs(Vs(w.right - f.clientX));
    }, d = () => {
      var f;
      window.removeEventListener("pointermove", u), window.removeEventListener("pointerup", d), window.removeEventListener("pointercancel", d), (f = a.releasePointerCapture) == null || f.call(a, n.pointerId);
    };
    window.addEventListener("pointermove", u), window.addEventListener("pointerup", d), window.addEventListener("pointercancel", d);
  }, ba = (n) => {
    let a = null;
    n.key === "ArrowLeft" ? a = bn + 40 : n.key === "ArrowRight" ? a = bn - 40 : n.key === "Home" && (a = Mi), a !== null && (n.preventDefault(), fs(Vs(a)));
  }, ya = async (n) => {
    var u;
    const a = (u = n.currentTarget.files) == null ? void 0 : u[0];
    n.currentTarget.value = "", a && await qs(a);
  }, Ws = () => void $i(As.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "CyTOF spillover matrix").then((n) => {
    n != null && n[0] && qs(n[0]);
  }), qs = async (n) => {
    Je(null), Q(null), ge(!1), ye(null), He(!1);
    try {
      const a = Ya(await n.text()), u = pt(
        a.input,
        "cytof-spillover"
      );
      if (!u.ok)
        throw new Error(u.errors.map(({ message: f }) => f).join(" "));
      const d = /* @__PURE__ */ new Map();
      for (const { pnn: f } of Rt) {
        const w = f.trim().normalize("NFC");
        d.set(w, (d.get(w) ?? 0) + 1);
      }
      const p = u.value.receiverChannels.filter(
        (f) => d.get(f) === 1
      );
      Qn({
        fileName: n.name,
        source: "file",
        parsed: a,
        matrix: u.value,
        validationWarnings: u.warnings
      }), cn(new Set(p));
    } catch (a) {
      Qn(null), cn(/* @__PURE__ */ new Set()), Je(a instanceof Error ? a.message : String(a));
    }
  }, ja = (n, a) => {
    cn((u) => {
      const d = new Set(u);
      return a ? d.add(n) : d.delete(n), d;
    });
  }, Gs = async () => {
    var u, d;
    if (!J)
      throw new Error(s("Choose a CyTOF spillover matrix first."));
    const n = ((d = (u = globalThis.crypto) == null ? void 0 : u.randomUUID) == null ? void 0 : d.call(u)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, a = J.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation";
    return Zt(
      {
        kind: "cytof-spillover",
        method: "nnls",
        solverVersion: Xa,
        solverSettings: Ja,
        matrix: J.matrix,
        includedChannels: Array.from(Rn)
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
  }, wa = async () => {
    if (!(Re.current || q || !J || !(ue != null && ue.canApply) || !o)) {
      if (v && !Ae) {
        Je(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      Je(null), Q(null), ye(null), Re.current = !0, _e(!0), Ze(J.fileName);
      try {
        const n = await Gs();
        await o(n, ye), Q(s("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: n.name,
          channels: Rn.size,
          files: Qe
        })), Qn(null), cn(/* @__PURE__ */ new Set()), He(!1), ye(null);
      } catch (n) {
        const a = n instanceof Error ? n.message : String(n);
        /cancel/i.test(a) ? Q(s("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : Je(a);
      } finally {
        Re.current = !1, _e(!1), Ze(null);
      }
    }
  }, Na = async () => {
    if (!(Re.current || q || !J || !(ue != null && ue.canApply) || !en || !y || !It)) {
      if (v && !Ae) {
        Je(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before adopting the assay.")
        );
        return;
      }
      Je(null), Q(null), ye(null), Re.current = !0, _e(!0), Ze(en.label);
      try {
        const n = await Gs();
        await y(
          n,
          en,
          ye
        ), Q(s("Using existing SCE assay {assay} with {matrix}. No assay values were recomputed.", {
          assay: en.label,
          matrix: n.name
        })), Qn(null), cn(/* @__PURE__ */ new Set()), He(!1), tt(!1), ye(null);
      } catch (n) {
        Je(n instanceof Error ? n.message : String(n));
      } finally {
        Re.current = !1, _e(!1), Ze(null);
      }
    }
  }, Ca = async () => {
    var d, p;
    if (Re.current || q || !o) return;
    if (v && !Ae) {
      ge(!0), Q(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before starting a matrix.")
      );
      return;
    }
    const n = t.channels.map((f, w) => ({ pnn: f.pnn, index: w })).filter(({ index: f }) => t.isFluorChannel(f) && !t.isImagingFeatureChannel(f)).map(({ pnn: f }) => f);
    if (n.length < 2) {
      ge(!0), Q(s("An empty matrix needs at least two fluorescence channels."));
      return;
    }
    const a = pt({
      sourceChannels: n,
      receiverChannels: n,
      matrix: n.map((f, w) => n.map((U, z) => w === z ? 1 : 0))
    }, "flow-spillover");
    if (!a.ok) {
      ge(!0), Q(a.errors.map(({ message: f }) => f).join(" "));
      return;
    }
    const u = `${i.replace(/\.fcs$/i, "") || "Flow"} manual matrix`;
    Q(null), ge(!1), ye(null), Re.current = !0, _e(!0), Ze(u);
    try {
      const f = ((p = (d = globalThis.crypto) == null ? void 0 : d.randomUUID) == null ? void 0 : p.call(d)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, w = await Zt(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: ii,
          solverSettings: si,
          matrix: a.value
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
      await o(w, ye), He(!1), Q(s("Manual matrix editing is ready: every spillover starts at zero. Select a pair and set its coefficient."));
    } catch (f) {
      ge(!0), Q(f instanceof Error ? f.message : String(f));
    } finally {
      Re.current = !1, _e(!1);
    }
  }, Sa = async () => {
    if (!(!h || q || et)) {
      if (v && !Ae) {
        ge(!0), Q(
          s("Confirm that existing gate memberships will be recomputed in original coordinates before removing the matrix.")
        );
        return;
      }
      ks(!0);
      try {
        await h(), ge(!1), Q(s("The matrix was removed. The original assay is active and every file reads its stored values."));
      } catch (n) {
        ge(!0), Q(n instanceof Error ? n.message : String(n));
      } finally {
        ks(!1);
      }
    }
  }, Ma = async () => {
    var a, u, d;
    if (Re.current || q || !ae || !((a = je == null ? void 0 : je.validation) != null && a.ok) || !o) return;
    if (v && !Ae) {
      ge(!0), Q(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const n = (we == null ? void 0 : we.name) || `${i.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    Q(null), ge(!1), ye(null), Re.current = !0, _e(!0), Ze(n);
    try {
      const p = ((d = (u = globalThis.crypto) == null ? void 0 : u.randomUUID) == null ? void 0 : d.call(u)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, f = await Zt(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: ii,
          solverSettings: si,
          matrix: je.validation.value
        },
        {
          profileId: `flow-${p}`,
          name: n,
          createdAt: /* @__PURE__ */ new Date(),
          origin: {
            ...we ? {
              type: "uploaded",
              fileName: we.name,
              format: "csv",
              sourceColumnHeader: "source"
            } : {
              type: "embedded-fcs",
              fileName: i,
              ...je.keyword ? { keyword: je.keyword } : {}
            }
          },
          provenance: {
            sourceDescription: we ? "Flow spillover matrix from metadata(sce)$spillover_matrix" : "Spillover matrix embedded in the source FCS file",
            estimationMethod: we ? "Imported from SCE metadata; coefficients preserved exactly" : "Imported from FCS; coefficients preserved exactly"
          }
        }
      );
      await o(f, ye), He(!1), Q(s(we ? "Flow matrix editing is ready. The exact hosted matrix is retained as the baseline, and Original measurements remain available." : "Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available."));
    } catch (p) {
      ge(!0), Q(p instanceof Error ? p.message : String(p));
    } finally {
      Re.current = !1, _e(!1), Ze(null), ye(null);
    }
  }, Hs = (n, a) => {
    var p, f;
    const u = re[n], d = ce[a];
    !c || !u || !d || c.sourceAxisKeys[n] === c.receiverAxisKeys[a] || (Ne(`${c.sourceAxisKeys[n]}${De}${c.receiverAxisKeys[a]}`), (f = (p = Ts.current) == null ? void 0 : p.querySelector(
      `button[data-source-index="${n}"][data-receiver-index="${a}"]`
    )) == null || f.focus());
  }, ka = (n, a, u) => {
    if (!c) return;
    const d = c.sourceAxisKeys.length, p = c.receiverAxisKeys.length;
    let f = a, w = u;
    const U = (_, Y) => {
      let se = _ + Y;
      for (; se >= 0 && se < p; ) {
        if (c.sourceAxisKeys[a] !== c.receiverAxisKeys[se]) return se;
        se += Y;
      }
      return _;
    }, z = (_, Y) => {
      let se = _ + Y;
      for (; se >= 0 && se < d; ) {
        if (c.sourceAxisKeys[se] !== c.receiverAxisKeys[u]) return se;
        se += Y;
      }
      return _;
    };
    switch (n.key) {
      case "ArrowLeft":
        w = U(u, -1);
        break;
      case "ArrowRight":
        w = U(u, 1);
        break;
      case "ArrowUp":
        f = z(a, -1);
        break;
      case "ArrowDown":
        f = z(a, 1);
        break;
      case "Home": {
        w = c.sourceAxisKeys[a] === c.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const _ = p - 1;
        w = c.sourceAxisKeys[a] === c.receiverAxisKeys[_] ? _ - 1 : _;
        break;
      }
      default:
        return;
    }
    n.preventDefault(), Hs(f, w);
  }, Bn = (n, a) => {
    if (!S || !Number.isFinite(a)) return;
    const [u, d] = n.split(De), p = S.scientific.matrix.sourceChannels.indexOf(u), f = S.scientific.matrix.receiverChannels.indexOf(d);
    if (p < 0 || f < 0) return;
    if (S.scientific.kind === "cytof-spillover" && a < 0) {
      ge(!0), Q(s("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const w = S.scientific.matrix.matrix[p][f];
    Xn((U) => {
      const z = { ...U };
      return a === w ? delete z[n] : z[n] = a, z;
    }), ge(!1), Q(s("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: u,
      receiver: d,
      value: (a * 100).toFixed(2)
    }));
  }, Zs = (n, a, u, d) => {
    const p = u[0];
    if (!p) return null;
    const f = p.sourceChannels.indexOf(n.source.pnn), w = p.sourceChannels.indexOf(n.receiver.pnn);
    if (f < 0 || w < 0) return null;
    const U = Xt(
      t,
      n.source.pnn,
      n.receiver.pnn,
      d,
      p.currentColumns[f],
      p.currentColumns[w],
      { totalEvents: oe }
    );
    if (!U.ready) return null;
    const z = [{
      value: n.coefficient,
      isCurrent: !0,
      preview: U.preview
    }];
    return u.forEach((_, Y) => {
      const se = _.sourceChannels.indexOf(n.source.pnn), Be = _.sourceChannels.indexOf(n.receiver.pnn);
      if (se < 0 || Be < 0) return;
      const Me = Xt(
        t,
        n.source.pnn,
        n.receiver.pnn,
        d,
        _.candidateColumns[se],
        _.candidateColumns[Be],
        {
          totalEvents: oe,
          xRange: U.preview.xRange,
          yRange: U.preview.yRange
        }
      );
      Me.ready && z.push({
        value: a[Y],
        isCurrent: !1,
        preview: Me.preview
      });
    }), z.sort((_, Y) => _.value - Y.value || Number(Y.isCurrent) - Number(_.isCurrent)), { pairKey: n.pairKey, values: Object.freeze(z) };
  }, Ea = async (n) => {
    if (!S || !c || !K || q || he || Ce) return;
    const a = Dn(n.pairKey, n.coefficient);
    if (a.error) {
      be(a.error);
      return;
    }
    const u = gn(
      t.fcs.nEvents,
      wi,
      me
    );
    if (u.length === 0) {
      be(s("The selected review population contains no events."));
      return;
    }
    const d = ++Pe.current, p = [a.lower, a.upper];
    jn(n.pairKey), be(null);
    try {
      const f = await K(
        S,
        u,
        p.map((U) => Ei(
          S,
          c.sourceAxisKeys[n.sourceIndex],
          c.receiverAxisKeys[n.receiverIndex],
          U
        )),
        void 0,
        1
      );
      if (Pe.current !== d) return;
      const w = Zs(n, p, f, u);
      if (!w) throw new Error(s("The fast bounds preview could not be built for this pair."));
      on((U) => ({ ...U, [n.pairKey]: w }));
    } catch (f) {
      if (Pe.current !== d) return;
      const w = f instanceof Error ? f.message : String(f);
      be(/cancel/i.test(w) ? s("Fast bounds preview cancelled.") : w);
    } finally {
      Pe.current === d && jn(null);
    }
  }, Aa = async () => {
    var d;
    if (!S || !K || Ue.length === 0 || q || he !== null || Ce !== null) return;
    if (Ut > 0) {
      be(s("Fix the sweep bounds for {count} flagged pairs before running.", { count: Ut }));
      return;
    }
    const n = gn(
      t.fcs.nEvents,
      ji,
      me
    );
    if (n.length === 0) {
      be(s("The selected review population contains no events."));
      return;
    }
    const a = ++Pe.current, u = Ue.flatMap((p) => {
      const f = Dn(p.pairKey, p.coefficient);
      return Ur(f.lower, f.upper).map((w) => ({
        pair: p,
        value: w,
        matrix: Ei(
          S,
          c.sourceAxisKeys[p.sourceIndex],
          c.receiverAxisKeys[p.receiverIndex],
          w
        )
      }));
    });
    be(null), Xe({}), wn({ completed: 0, total: u.length });
    try {
      const p = await K(
        S,
        n,
        u.map(({ matrix: w }) => w),
        (w, U) => {
          Pe.current === a && wn({ completed: w, total: U });
        },
        Et
      );
      if (Pe.current !== a) return;
      if (p.length !== u.length)
        throw new Error(s("The compensation worker returned an incomplete coefficient sweep."));
      const f = {};
      for (const w of Ue) {
        const U = u.flatMap((_, Y) => _.pair.pairKey === w.pairKey ? [Y] : []), z = Zs(
          w,
          U.map((_) => u[_].value),
          U.map((_) => p[_]),
          n
        );
        z && (f[w.pairKey] = z);
      }
      Xe(f), Pn(((d = Ue[0]) == null ? void 0 : d.pairKey) ?? null);
    } catch (p) {
      if (Pe.current !== a) return;
      const f = p instanceof Error ? p.message : String(p);
      be(/cancel/i.test(f) ? s("Exact coefficient sweep cancelled.") : f);
    } finally {
      Pe.current === a && wn(null);
    }
  }, Ta = () => {
    Pe.current++, L == null || L(), wn(null), jn(null), be(s("Exact coefficient sweep cancelled."));
  }, $a = async () => {
    var a, u;
    if (!S || !Mn || !o || Object.keys(X).length === 0) return;
    const n = `${ns(S.name)} · edited`;
    Q(null), ge(!1), _e(!0), Ze(n), ye(null);
    try {
      const p = {
        profileId: `comp-edit-${((u = (a = globalThis.crypto) == null ? void 0 : a.randomUUID) == null ? void 0 : u.call(a)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: n,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(X).length} compensation coefficient${Object.keys(X).length === 1 ? "" : "s"} in GateLab.`
      }, f = (I == null ? void 0 : I.recordType) === "baseline" && Br(Mn, I.scientific.matrix.matrix) ? await Ha(S, I, p) : await Za(
        S,
        zr(S, Mn),
        p
      );
      await o(f, ye), Xn({}), rn({}), Xe({}), on({}), jn(null), be(null), $t((w) => w + 1), te.length > 0 && (Hn("attention"), Ne(te[0].pairKey), Pn(te[0].pairKey)), Q(s("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: ns(f.name),
        flagged: te.length > 0 ? s(
          te.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: te.length }
        ) : ""
      }));
    } catch (d) {
      ge(!0), Q(d instanceof Error ? d.message : String(d));
    } finally {
      _e(!1), Ze(null), ye(null);
    }
  }, Ys = (n) => {
    if (te.length === 0) return;
    const a = te.findIndex(({ pairKey: p }) => p === Fe), u = a < 0 ? n > 0 ? 0 : te.length - 1 : (a + n + te.length) % te.length, d = te[u];
    Oe(null), Ne(d.pairKey), Pn(d.pairKey);
  }, Wt = () => /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "gl-comp-inspector-resize",
      role: "separator",
      "aria-label": s("Resize compensation inspector"),
      "aria-orientation": "vertical",
      "aria-valuemin": 360,
      "aria-valuemax": 900,
      "aria-valuenow": bn,
      tabIndex: 0,
      title: s("Drag to resize the coefficient inspector; use Left/Right arrow keys for fine control"),
      onPointerDown: va,
      onKeyDown: ba,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), Fa = (n) => {
    Oe(null), Ne(n), St(!0), Ot.some((a) => a.pairKey === n) && ($e.some((a) => a.pairKey === n) || (Zn("all"), vs("")), bs(n));
  }, qt = (n, a = !1) => {
    const u = j ? Sn.has(j.pairKey) : !1, d = j ? te.find(({ pairKey: Z }) => Z === j.pairKey) ?? null : null, p = j ? _t(j.pairKey, j.value) : null, f = j ? Dn(j.pairKey, j.value) : null, w = j ? sa[j.pairKey] : null, U = j ? c.sourceAxisKeys[j.sourceIndex] : "", z = j ? c.receiverAxisKeys[j.receiverIndex] : "", _ = j != null && j.interaction && j.interaction !== "self" && j.interaction !== "other" ? 1 : 0, Y = j && (Se != null && Se.ready) ? as({
      coefficient: j.value,
      physicalPrior: _,
      evidence: Se.preview.evidence
    }, c.kind, qe) : null, se = j ? _r(I, U, z) : null, Be = (j == null ? void 0 : j.value) ?? null, Me = j ? X[j.pairKey] : void 0, En = !!(j && (S == null ? void 0 : S.scientific.kind) === "flow-spillover" && T && Object.keys(X).length > 0), Ye = Ge.state !== "idle" && Ge.state !== "error" && Ge.pairKey === (j == null ? void 0 : j.pairKey) ? Ge.preview : null, un = Ye ?? (Se != null && Se.ready ? Se.preview : null), hn = [];
    se !== null && Be !== null && ((S == null ? void 0 : S.recordType) === "revision" || se !== Be) && hn.push({ label: s("Baseline"), value: se }), Be !== null && hn.push({ label: s("Installed"), value: Be }), Me !== void 0 && hn.push({ label: s("Staged"), value: Me });
    const mn = te.findIndex(({ pairKey: Z }) => Z === Fe);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${a ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: s("Selected coefficient") }),
          !a && /* @__PURE__ */ e.jsx("span", { children: s(Nt ? "Hover preview · click to pin this pair." : Fe ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
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
                onClick: () => Ys(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: mn >= 0 ? s("{current} / {total} flagged", { current: mn + 1, total: te.length }) : s("{total} flagged", { total: te.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Next flagged compensation pair"),
                disabled: te.length === 0,
                onClick: () => Ys(1),
                children: "→"
              }
            )
          ] }),
          n && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-inspector-close",
              "aria-label": s(a ? "Close global compensation pair details" : "Close the coefficient panel"),
              title: s(a ? "Close details and return to the full gallery" : "Close the coefficient panel; selecting a cell opens it again"),
              onClick: n,
              children: "×"
            }
          )
        ] })
      ] }),
      j ? /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-pair-detail${a ? " is-global" : ""}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pair-route", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
            /* @__PURE__ */ e.jsx("strong", { children: j.source.label }),
            /* @__PURE__ */ e.jsx("small", { children: j.source.pnn })
          ] }),
          /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Receiver") }),
            /* @__PURE__ */ e.jsx("strong", { children: j.receiver.label }),
            /* @__PURE__ */ e.jsx("small", { children: j.receiver.pnn })
          ] })
        ] }),
        Y && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${Y.category}`,
            title: s(Y.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: s(Y.label) }),
              /* @__PURE__ */ e.jsx("span", { children: s(Y.detail) })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: u,
              disabled: !S || !de.has(c.sourceAxisKeys[j.sourceIndex]) || !de.has(c.receiverAxisKeys[j.receiverIndex]),
              onChange: (Z) => zn(j.pairKey, Z.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: s("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: s("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: s("Stored fraction: {value}", { value: ie(j.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: s(X[j.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(X[j.pairKey] ?? j.value) ? `${((X[j.pairKey] ?? j.value) * 100).toFixed(1)}%` : String(X[j.pairKey] ?? j.value) })
        ] }),
        hn.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": s("Coefficient history"), children: hn.map((Z, pn) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          pn > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: s("Exact fraction: {value}", { value: ie(Z.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: Z.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (Z.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${Z.label}:${pn}`)) }),
        S && Fe === j.pairKey && !Nt && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              $n,
              {
                step: "0.1",
                value: Jn,
                disabled: q,
                onValueChange: (Z) => {
                  Ft(Z), S.scientific.kind === "flow-spillover" && Z.trim() !== "" && Number.isFinite(Number(Z)) && Bn(j.pairKey, Number(Z) / 100);
                }
              }
            )
          ] }),
          S.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: s("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: q || !Number.isFinite(Number(Jn)) || Jn.trim() === "",
              onClick: () => Bn(j.pairKey, Number(Jn) / 100),
              children: s("Stage value")
            }
          ),
          X[j.pairKey] !== void 0 && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: q,
              onClick: () => {
                Bn(j.pairKey, j.value), rn((Z) => {
                  const pn = { ...Z };
                  return delete pn[j.pairKey], pn;
                });
              },
              children: s("Reset")
            }
          )
        ] }),
        En && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-candidate-status${a ? " is-compact" : ""}`, "aria-label": s("Flow compensation coefficient preview"), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Coefficient preview") }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              s("Original remains fixed; the right panel shows the complete working matrix."),
              a ? s(" The gallery remains installed until Apply.") : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("em", { children: Me === void 0 ? s("Working matrix") : `${(j.value * 100).toFixed(1)}% → ${(Me * 100).toFixed(1)}%` }),
          Ge.state === "updating" && Ge.pairKey === j.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: s("Updating…") }),
          Ge.state === "error" && Ge.pairKey === j.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: s(Ge.message) })
        ] }),
        j.interaction && j.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          s("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: j.interaction })
        ] }),
        a && (un ? /* @__PURE__ */ e.jsx(
          bi,
          {
            preview: un,
            sourceLabel: j.source.label,
            receiverLabel: j.receiver.label,
            kind: c.kind,
            densitySmoothing: nn,
            compact: !0,
            compensatedTitle: s(Ye ? "Candidate" : "Compensated")
          }
        ) : Se && !Se.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(Se.reason) }) : null),
        a && /* @__PURE__ */ e.jsx(
          Sr,
          {
            matrixView: c,
            sourceChannels: re,
            receiverChannels: ce,
            selectedSourceIndex: j.sourceIndex,
            selectedReceiverIndex: j.receiverIndex,
            stagedCoefficients: X,
            maximumAbsoluteOffDiagonal: Bs,
            onSelect: Fa
          }
        ),
        !a && (un ? /* @__PURE__ */ e.jsx(
          bi,
          {
            preview: un,
            sourceLabel: j.source.label,
            receiverLabel: j.receiver.label,
            kind: c.kind,
            densitySmoothing: nn,
            compensatedTitle: s(Ye ? "Candidate" : "Compensated")
          }
        ) : Se && !Se.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(Se.reason) }) : null),
        u && d && p && f && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Sweep bounds") }),
            /* @__PURE__ */ e.jsx("span", { children: s("Four exact candidates will be interpolated across these endpoints.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-inputs", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Lower (%)") }),
              /* @__PURE__ */ e.jsx(
                $n,
                {
                  step: "0.1",
                  value: p.lowerPercent,
                  disabled: q || he !== null || Ce !== null,
                  onValueChange: (Z) => ct(j.pairKey, j.value, "lowerPercent", Z)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Upper (%)") }),
              /* @__PURE__ */ e.jsx(
                $n,
                {
                  step: "0.1",
                  value: p.upperPercent,
                  disabled: q || he !== null || Ce !== null,
                  onValueChange: (Z) => ct(j.pairKey, j.value, "upperPercent", Z)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: q || he !== null || Ce !== null || f.error !== null,
                onClick: () => void Ea(d),
                children: s(Ce === j.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          f.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: s(f.error) }) : /* @__PURE__ */ e.jsx("small", { children: s("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(oe, wi).toLocaleString(),
            sweep: Math.min(oe, ji).toLocaleString()
          }) }),
          w && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: w.values.map((Z) => /* @__PURE__ */ e.jsx("div", { className: Z.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            yt,
            {
              title: `${Z.isCurrent ? `${s("Current")} · ` : ""}${(Z.value * 100).toFixed(2)}%`,
              panel: Z.preview.compensated,
              preview: Z.preview,
              sourceLabel: j.source.label,
              receiverLabel: j.receiver.label,
              minimumSize: 145,
              maximumSize: 220,
              densitySmoothing: nn
            }
          ) }, `${j.pairKey}:bounds:${Z.value}:${Z.isCurrent}`)) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s(c.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: s("No coefficient selected.") })
    ] });
  }, Gt = (n, a, u = On) => /* @__PURE__ */ e.jsx(
    Mr,
    {
      dataset: a,
      pair: n,
      plotSize: u,
      densitySmoothing: nn,
      flagged: Sn.has(n.pairKey),
      selected: Fe === n.pairKey,
      onSelect: () => {
        Oe(null), Ne(n.pairKey), St(!0);
      },
      onFlag: (d) => zn(n.pairKey, d)
    },
    n.pairKey
  ), Ia = async (n, a) => {
    if (!(ne != null && ne.ready) || !c)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const u = Fs.map((d) => ({
      pairKey: d.pairKey,
      sourceLabel: d.source.label,
      receiverLabel: d.receiver.label,
      coefficient: d.coefficient,
      relationship: d.interaction,
      buildPreview: () => {
        const p = Pi(
          ne.dataset,
          d.source.key,
          d.receiver.key
        );
        if (!p.ready) throw new Error(p.reason);
        return p.preview;
      }
    }));
    await pr(u, {
      sampleName: i,
      profileName: (S == null ? void 0 : S.name) ?? s(c.title),
      populationName: (ee == null ? void 0 : ee.name) ?? s("All Events"),
      filterLabel: Is,
      densitySmoothing: nn,
      densityColorPower: G,
      pointAlpha: lt,
      pointSize: ot
    }, n, a);
  };
  return B ? /* @__PURE__ */ e.jsx(hs.Provider, { value: G, children: /* @__PURE__ */ e.jsx(ms.Provider, { value: lt, children: /* @__PURE__ */ e.jsx(ps.Provider, { value: ot, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab gl-plotting-workspace gl-comp-workspace",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-plotting-head gl-comp-head gl-comp-overview${ke === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsxs("h2", { className: "gl-tab-title", children: [
              s("Compensation"),
              /* @__PURE__ */ e.jsx(Va, { intro: We })
            ] }),
            !V && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: ut })
          ] }),
          V ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${H.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: s("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: ht,
                method: ut,
                count: Vt,
                status: s(H.state === "ready" ? "Ready" : "Unavailable"),
                assay: s(l ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${H.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  s("{kind} compensation installed. Installed compensation profile.", {
                    kind: V.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                /* @__PURE__ */ e.jsx("strong", { children: ga }),
                /* @__PURE__ */ e.jsx("span", { children: s("{method} · {count} ch · {status}", {
                  method: ut,
                  count: Vt,
                  status: H.state === "ready" ? s("Ready") : s("Unavailable")
                }) }),
                /* @__PURE__ */ e.jsx("em", { children: s(l ? "Comp active" : "Original active") })
              ]
            }
          ) : /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "gl-comp-summary",
              "aria-label": s("Compensation summary"),
              "data-active-layer": l ? "compensated" : "original",
              children: s("{source} · {assay} · {count} channels", {
                source: s(_s),
                assay: s(l ? "Compensated assay active" : "Original assay active"),
                count: Vt
              })
            }
          ),
          V && t.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: q,
              onClick: Ws,
              children: s("Replace matrix…")
            }
          ),
          V && h && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-header-remove", children: [
            v && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: Ae,
                  disabled: q || et,
                  onChange: (n) => He(n.currentTarget.checked)
                }
              ),
              /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in original coordinates.") })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: q || et,
                title: s("Uninstall the matrix: every file returns to the original assay and the matrix leaves the workspace."),
                onClick: () => void Sa(),
                children: s(et ? "Removing…" : "Remove the matrix")
              }
            )
          ] }),
          fa && /* @__PURE__ */ e.jsx(Wa, { intro: We, className: "gl-comp-global-layer-note", children: s("Assay selection in the top bar applies to every tab.") })
        ] }),
        /* @__PURE__ */ e.jsxs("aside", { className: `gl-plotting-inspector gl-comp-inspector-left section-${xs}`, "aria-label": s("Compensation controls"), children: [
          /* @__PURE__ */ e.jsx("nav", { className: "gl-presentation-tabs", "aria-label": s("Compensation settings"), children: $r.map(({ id: n, label: a }) => /* @__PURE__ */ e.jsx("button", { type: "button", "aria-pressed": xs === n, onClick: () => Hi(n), children: s(a) }, n)) }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-section gl-comp-pane-matrices", children: [
            xe && t.instrument === "flow" && /* @__PURE__ */ e.jsx(jr, { ...xe }),
            t.instrument === "flow" && !V && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Edit coefficients") }),
              ae && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-enable-heading", children: [
                /* @__PURE__ */ e.jsxs("p", { className: "gl-comp-pane-line", children: [
                  /* @__PURE__ */ e.jsx("span", { id: "comp-flow-enable-heading", children: s(we ? "SCE spillover matrix" : "Embedded FCS matrix") }),
                  /* @__PURE__ */ e.jsx(
                    es,
                    {
                      label: s("About editing this matrix"),
                      text: s("Install this exact matrix as the immutable baseline to edit coefficients and preview their effect.")
                    }
                  )
                ] }),
                je != null && je.error ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-problem", children: [
                  /* @__PURE__ */ e.jsx("span", { title: je.error, children: s("Not editable: {reason}", {
                    reason: Fr(je.validation).map((n) => s(n)).join(", ")
                  }) }),
                  /* @__PURE__ */ e.jsxs("details", { children: [
                    /* @__PURE__ */ e.jsx("summary", { children: s("Details") }),
                    /* @__PURE__ */ e.jsx("p", { children: je.error })
                  ] })
                ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  v && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: Ae,
                        disabled: q,
                        onChange: (n) => He(n.currentTarget.checked)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
                  ] }),
                  m.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-hint gl-comp-embedded-others", children: s("Enabling also returns {count} other files to Original: {files}. A workspace keeps one kind of compensation, and these draw from their own embedded matrix.", {
                    count: m.length,
                    files: m.join(", ")
                  }) }),
                  q ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
                    le ? s("Preparing editor… {percent}%", { percent: Math.round(le.fraction * 100) }) : s("Preparing editor…"),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: (le == null ? void 0 : le.phase) === "cancelling",
                        onClick: g,
                        children: s((le == null ? void 0 : le.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                      }
                    )
                  ] }) : /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-btn",
                      disabled: !o || v && !Ae,
                      onClick: () => void Ma(),
                      children: s("Enable matrix editing")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-empty-heading", children: [
                /* @__PURE__ */ e.jsxs("p", { className: "gl-comp-pane-line", children: [
                  /* @__PURE__ */ e.jsx("span", { id: "comp-flow-empty-heading", children: s("Empty matrix") }),
                  /* @__PURE__ */ e.jsx(
                    es,
                    {
                      label: s("About the empty matrix"),
                      text: s("Start from an identity matrix over the file's fluorescence channels, every spillover at zero, and set the coefficients by hand.")
                    }
                  )
                ] }),
                v && (!ae || !!(je != null && je.error)) && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: Ae,
                      disabled: q,
                      onChange: (n) => He(n.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
                ] }),
                q ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-flow-enable-progress", role: "status", children: s("Preparing editor…") }) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: !o || v && !Ae,
                    onClick: () => void Ca(),
                    children: s("Start from an empty matrix")
                  }
                )
              ] })
            ] }),
            V && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Edit coefficients") }),
              !(c && Object.keys(X).length > 0) && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-pane-line", children: s("Select a pair in the matrix to change its coefficient.") }),
              c && Object.keys(X).length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
                /* @__PURE__ */ e.jsxs("span", { children: [
                  s("{count} pending edits", { count: Object.keys(X).length }),
                  (S == null ? void 0 : S.scientific.kind) === "cytof-spillover" ? ` · ${s("{files} checked FCS files", { files: Qe })}` : ""
                ] }),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-mini-btn",
                    disabled: q,
                    onClick: () => {
                      Xn({}), rn({}), Q(null);
                    },
                    children: s("Discard")
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn",
                    disabled: q || he !== null || Ce !== null || !o || (S == null ? void 0 : S.scientific.kind) === "cytof-spillover" && Qe === 0,
                    onClick: () => void $a(),
                    children: s("Apply revised matrix")
                  }
                )
              ] })
            ] }),
            t.instrument === "cytof" && !V && /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s("Choose a CyTOF spillover matrix in the main panel.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-section gl-comp-pane-review", children: [
            /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsxs("h3", { children: [
                s("Review scope"),
                /* @__PURE__ */ e.jsx(es, { label: s("About the review scope"), text: s("The population and the events the biplots, the attention ranking and the sweeps are drawn from. Membership is frozen from the current assay; Apply always uses every event.") })
              ] }),
              /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-review-population", children: [
                /* @__PURE__ */ e.jsx("span", { children: s("Review population") }),
                /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": s("Compensation review population"),
                    value: (ee == null ? void 0 : ee.id) ?? "all",
                    disabled: he !== null || Ce !== null,
                    onChange: (n) => kt(n.currentTarget.value),
                    children: [
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All Events") }),
                      R.map((n) => /* @__PURE__ */ e.jsx("option", { value: n.id, children: `${"· ".repeat(n.depth)}${n.name} (${n.eventCount.toLocaleString()})` }, n.id))
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsx("small", { title: s("{count} events · applies to biplots, attention ranking, and sweeps; membership frozen from the current assay", {
                  count: oe.toLocaleString()
                }), children: s("{count} events", { count: oe.toLocaleString() }) })
              ] }),
              ke !== "global" && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-preview-events", children: [
                /* @__PURE__ */ e.jsx("span", { children: s("Pair preview") }),
                /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": s("Compensation pair preview event count"),
                    value: String(at),
                    disabled: q,
                    onChange: (n) => {
                      const a = n.currentTarget.value;
                      Zi(a === "all" ? "all" : Number(a));
                    },
                    children: [
                      Ci.map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: s("{count} events", { count: n.toLocaleString() }) }, n)),
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All available") })
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsx("small", { title: s("Controls the frozen event set shown in the selected-pair Original and comparison biplots. Applying compensation still processes every event."), children: s("Showing {shown} of {total}; Apply always uses all events.", {
                  shown: Kn.length.toLocaleString(),
                  total: oe.toLocaleString()
                }) })
              ] })
            ] }),
            A !== void 0 && F !== void 0 && M && /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Apply") }),
              A !== void 0 && F !== void 0 && M && /* @__PURE__ */ e.jsxs(
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
                        value: A,
                        disabled: q,
                        onChange: (n) => M(Number(n.currentTarget.value)),
                        children: Array.from({ length: F }, (n, a) => a + 1).map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
                      }
                    ),
                    /* @__PURE__ */ e.jsxs("small", { children: [
                      "/ ",
                      F
                    ] })
                  ]
                }
              )
            ] }),
            (c || V) && /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Tools") }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: Ir.map(({ id: n, label: a }) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  id: `comp-drawer-${n}-button`,
                  className: "gl-comp-drawer-toggle",
                  "aria-expanded": Gn[n],
                  "aria-controls": `comp-drawer-${n}`,
                  onClick: () => xa(n),
                  children: [
                    /* @__PURE__ */ e.jsxs("span", { children: [
                      s(a),
                      n === "review" && dt.length > 0 ? ` (${dt.length})` : ""
                    ] }),
                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ e.jsx(ni, { open: Gn[n], size: 12 }) })
                  ]
                },
                n
              )) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-pane-section gl-comp-pane-display", children: c ? /* @__PURE__ */ e.jsxs("section", { children: [
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
                      value: nn,
                      "aria-label": s("Compensation biplot density smoothing"),
                      onChange: (n) => Bi(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: nn })
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
                      value: lt,
                      "aria-label": s("Compensation biplot point alpha"),
                      onChange: (n) => Wi(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: lt.toFixed(2) })
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
                      value: ot,
                      "aria-label": s("Compensation biplot point size"),
                      onChange: (n) => Gi(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("output", { children: [
                    ot.toFixed(1),
                    "×"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              qa,
              {
                className: "gl-comp-density-colour",
                value: G,
                onChange: O
              }
            )
          ] }) : /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s("The biplot settings apply once a matrix is shown.") }) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-prop-body gl-comp-body", children: [
          c && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-workspace-tabs", role: "tablist", "aria-label": s("Compensation workspace"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": ke === "matrix",
                className: ke === "matrix" ? "active" : void 0,
                onClick: () => {
                  Oe(null), Hn("matrix");
                },
                children: s("Matrix")
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": ke === "global",
                className: ke === "global" ? "active" : void 0,
                onClick: () => {
                  Oe(null), Hn("global");
                },
                children: s("Global inspector")
              }
            ),
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": ke === "attention",
                className: ke === "attention" ? "active" : void 0,
                onClick: () => {
                  Oe(null), Hn("attention");
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
              ref: As,
              type: "file",
              accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
              className: "gl-sr-only",
              "aria-label": s("Choose CyTOF spillover matrix"),
              onChange: (n) => void ya(n)
            }
          ),
          Cs && /* @__PURE__ */ e.jsx("div", { className: Ss ? "gl-comp-error" : "gl-comp-status", role: Ss ? "alert" : "status", children: s(Cs) }),
          t.instrument === "cytof" && (!V || J) && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-cytof-import", "aria-labelledby": "comp-cytof-import-heading", children: [
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
                  disabled: q,
                  onClick: Ws,
                  children: s(J ? "Choose another matrix…" : "Import matrix…")
                }
              ) })
            ] }),
            Ms && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s(Ms) }),
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
                      disabled: q,
                      onClick: () => cn(new Set(ue.matchedChannels)),
                      children: s("All matched")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: q,
                      onClick: () => cn(/* @__PURE__ */ new Set()),
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
                      checked: Rn.has(n),
                      disabled: !a || q,
                      onChange: (u) => ja(n, u.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: ts(t, n).combined }),
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
              v && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Ae,
                    disabled: q,
                    onChange: (n) => He(n.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: s("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                  /* @__PURE__ */ e.jsx("span", { children: q ? le ? s("{phase}… {percent}% ({processed} / {total} events)", {
                    phase: s(le.phase === "cancelling" ? "Cancelling" : le.phase === "preparing" ? "Preparing" : "Applying"),
                    percent: Math.round(le.fraction * 100),
                    processed: le.processedEvents.toLocaleString(),
                    total: le.totalEvents.toLocaleString()
                  }) : s("Preparing compensation…") : s("The Original assay is retained and can be restored at any time.") }),
                  /* @__PURE__ */ e.jsx("strong", { className: Qe === 0 ? "is-empty" : void 0, children: Qe === 0 ? s("No FCS files are checked. Select at least one file in Samples.") : s("Applies atomically to {files} checked FCS files · {events} total events", {
                    files: Qe,
                    events: da.toLocaleString()
                  }) })
                ] }),
                q ? /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (le == null ? void 0 : le.phase) === "cancelling",
                    onClick: g,
                    children: s((le == null ? void 0 : le.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                ) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn",
                    disabled: !o || Qe === 0 || !ue.canApply || v && !Ae,
                    onClick: () => void wa(),
                    children: s("Apply NNLS compensation")
                  }
                )
              ] }),
              x.length > 0 && y && /* @__PURE__ */ e.jsxs(
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
                          value: (en == null ? void 0 : en.id) ?? "",
                          disabled: q,
                          onChange: (n) => {
                            Es(n.currentTarget.value), tt(!1);
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
                          checked: It,
                          disabled: q,
                          onChange: (n) => tt(n.currentTarget.checked)
                        }
                      ),
                      /* @__PURE__ */ e.jsx("span", { children: s("I confirm this assay was computed from the selected source assay using this exact matrix and channel set.") })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: q || !en || !It || Qe === 0 || !ue.canApply || v && !Ae,
                        onClick: () => void Na(),
                        children: s("Use existing assay — no recomputation")
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          zs && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
          Ds.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
            /* @__PURE__ */ e.jsx("span", { children: s("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
              count: Ds.length
            }) }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => gs((n) => ({ ...n, review: !0 })), children: s("Review details") })
          ] }),
          V && H.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
          c && ke === "matrix" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: Cn,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: Lt ? `minmax(440px, 1fr) 8px ${bn}px` : "minmax(0, 1fr)" },
              children: [
                /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrix-panel", "aria-labelledby": "comp-matrix-heading", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-matrix-head", children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("h3", { id: "comp-matrix-heading", children: s(c.title) }),
                      /* @__PURE__ */ e.jsx("span", { children: s(c.subtitle) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-head-actions", children: [
                      _n && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-inline-edit-note", children: s("Edit cells directly (%)") }),
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
                          onClick: () => ws(!0),
                          children: s("Export CSV…")
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-scroll", ref: ca, children: /* @__PURE__ */ e.jsxs(
                    "div",
                    {
                      className: `gl-comp-matrix-stage${_n ? " is-flow-inline" : ""}`,
                      style: {
                        width: 18 + Un.rowLabelWidth + c.receiverAxisKeys.length * dn + Un.overhang,
                        "--gl-comp-row-label-w": `${Un.rowLabelWidth}px`,
                        "--gl-comp-col-label-w": `${Un.columnLabelWidth}px`,
                        "--gl-comp-col-label-h": `${Un.columnLabelHeight}px`
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
                                  gridTemplateColumns: `repeat(${c.receiverAxisKeys.length}, ${dn}px)`
                                },
                                children: ce.map((n, a) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (j == null ? void 0 : j.receiverIndex) === a ? "is-selected" : void 0,
                                    title: n.combined,
                                    children: /* @__PURE__ */ e.jsx("span", { children: n.combined })
                                  },
                                  c.receiverAxisKeys[a]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                className: "gl-comp-row-labels",
                                "aria-label": s("Source channel labels"),
                                style: {
                                  gridTemplateRows: `repeat(${c.sourceAxisKeys.length}, ${dn}px)`
                                },
                                children: re.map((n, a) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (j == null ? void 0 : j.sourceIndex) === a ? "is-selected" : void 0,
                                    title: n.combined,
                                    children: n.combined
                                  },
                                  c.sourceAxisKeys[a]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                ref: Ts,
                                className: "gl-comp-matrix shows-values",
                                role: "grid",
                                "aria-label": s("Compensation matrix; source rows and receiver columns"),
                                "aria-rowcount": c.sourceAxisKeys.length,
                                "aria-colcount": c.receiverAxisKeys.length,
                                style: {
                                  gridTemplateColumns: `repeat(${c.receiverAxisKeys.length}, ${dn}px)`,
                                  gridTemplateRows: `repeat(${c.sourceAxisKeys.length}, ${dn}px)`
                                },
                                children: c.matrix.map((n, a) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    role: "row",
                                    className: "gl-comp-matrix-row",
                                    "aria-rowindex": a + 1,
                                    children: n.map((u, d) => {
                                      const p = c.sourceAxisKeys[a], f = c.receiverAxisKeys[d], w = `${p}${De}${f}`, U = X[w], z = U ?? u, _ = p === f, Y = (j == null ? void 0 : j.sourceIndex) === a && j.receiverIndex === d, se = (j == null ? void 0 : j.sourceIndex) === a, Be = (j == null ? void 0 : j.receiverIndex) === d, Me = re[a], En = ce[d], Ye = c.kind === "cytof" ? An(p, f) : null, un = Ga(
                                        z,
                                        Bs,
                                        _
                                      ), hn = c.receiverAxisKeys.findIndex((ve) => ve !== p), mn = Fe === w, Z = Fe === null && a === 0 && d === hn, pn = Number.isFinite(z) ? z === 0 ? "" : (z * 100).toFixed(1) : String(z), Qs = Ye && Ye !== "other" && Ye !== "self" ? ` · ${Ye}` : "", Pa = na[w] ?? ki(z);
                                      return _n && !_ ? /* @__PURE__ */ e.jsx(
                                        $n,
                                        {
                                          role: "gridcell",
                                          className: `gl-comp-cell gl-comp-cell-input${Y ? " selected" : ""}${mn ? " is-pinned" : ""}${U === void 0 ? "" : " is-staged"}${se ? " is-selected-source" : ""}${Be ? " is-selected-receiver" : ""}`,
                                          min: "0",
                                          step: "0.1",
                                          value: Pa,
                                          disabled: q,
                                          "data-source-index": a,
                                          "data-receiver-index": d,
                                          "aria-colindex": d + 1,
                                          "aria-selected": mn,
                                          "aria-label": s("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                            source: Me.combined,
                                            receiver: En.combined,
                                            pending: U === void 0 ? "" : s(", pending edit")
                                          }),
                                          title: s("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                            source: Me.combined,
                                            receiver: En.combined,
                                            pending: U === void 0 ? "" : s(" · pending edit")
                                          }),
                                          style: un,
                                          onFocus: () => Ne(w),
                                          onMouseEnter: () => Oe(w),
                                          onMouseLeave: () => Oe((ve) => ve === w ? null : ve),
                                          onClick: () => Ne(w),
                                          onValueChange: (ve) => {
                                            Ne(w), rn((Vn) => ({ ...Vn, [w]: ve })), ve.trim() !== "" && Number.isFinite(Number(ve)) && Bn(w, Number(ve) / 100);
                                          },
                                          onBlur: (ve) => {
                                            const Vn = ve.currentTarget.value;
                                            if (Vn.trim() === "" || !Number.isFinite(Number(Vn))) {
                                              rn((Ht) => {
                                                const ei = { ...Ht };
                                                return delete ei[w], ei;
                                              });
                                              return;
                                            }
                                            rn((Ht) => ({
                                              ...Ht,
                                              [w]: ki(Number(Vn) / 100)
                                            }));
                                          }
                                        },
                                        f
                                      ) : /* @__PURE__ */ e.jsx(
                                        "button",
                                        {
                                          type: "button",
                                          role: "gridcell",
                                          className: `gl-comp-cell${_ ? " diagonal" : ""}${Y ? " selected" : ""}${mn ? " is-pinned" : ""}${U === void 0 ? "" : " is-staged"}${se ? " is-selected-source" : ""}${Be ? " is-selected-receiver" : ""}`,
                                          disabled: _,
                                          tabIndex: _ ? -1 : Y || Z ? 0 : -1,
                                          "data-source-index": a,
                                          "data-receiver-index": d,
                                          "data-interaction": Ye ?? void 0,
                                          "aria-colindex": d + 1,
                                          "aria-pressed": _ ? void 0 : mn,
                                          "aria-label": _ ? s("{channel} diagonal: {value}", { channel: Me.combined, value: sn(z) }) : s("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                            source: Me.combined,
                                            receiver: En.combined,
                                            value: sn(z),
                                            pending: U === void 0 ? "" : s(" (pending edit)"),
                                            interaction: Qs
                                          }),
                                          title: _ ? `${Me.combined} · self · ${sn(z)}` : `${Me.combined} → ${En.combined} · ${sn(z)}${U === void 0 ? "" : " · pending edit"}${Qs}`,
                                          style: un,
                                          onFocus: () => {
                                            _ || Ne(w);
                                          },
                                          onMouseEnter: () => {
                                            _ || Oe(w);
                                          },
                                          onMouseLeave: () => Oe((ve) => ve === w ? null : ve),
                                          onClick: () => Ne(w),
                                          onKeyDown: (ve) => ka(ve, a, d),
                                          children: /* @__PURE__ */ e.jsx("span", { children: pn })
                                        },
                                        f
                                      );
                                    })
                                  },
                                  c.sourceAxisKeys[a]
                                ))
                              }
                            )
                          ] })
                        ] })
                      ]
                    }
                  ) })
                ] }),
                Lt && Wt(),
                Lt && qt(() => {
                  Oe(null), Ne(null);
                })
              ]
            }
          ) : c && ke === "global" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: Cn,
              className: `gl-comp-common-path gl-comp-global-path${In ? " has-details" : ""}`,
              style: {
                gridTemplateColumns: In ? `minmax(440px, 1fr) 8px ${bn}px` : "minmax(0, 1fr)"
              },
              children: [
                /* @__PURE__ */ e.jsx(
                  kr,
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
                          value: ze,
                          onChange: (n) => Zn(n.currentTarget.value),
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
                          onChange: (n) => Di(n.currentTarget.value),
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
                          value: Fn,
                          placeholder: s("Find channel…"),
                          "aria-label": s("Search global compensation pairs"),
                          onChange: (n) => vs(n.currentTarget.value)
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
                            value: On,
                            "aria-label": s("Global compensation plot size"),
                            onChange: (n) => _i(Number(n.currentTarget.value))
                          }
                        ),
                        /* @__PURE__ */ e.jsx("output", { children: s("{size}px", { size: On }) })
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn gl-comp-global-export",
                          disabled: !(ne != null && ne.ready) || $e.length === 0,
                          title: s("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                          onClick: () => Ns(!0),
                          children: s("Export…")
                        }
                      ),
                      /* @__PURE__ */ e.jsx(
                        "span",
                        {
                          className: "gl-comp-global-count",
                          title: s("The Global gallery uses one fixed representative event set so every pair and both assay layers remain directly comparable."),
                          children: s("{pairs} pairs · {shown} / {total} events · {population}", {
                            pairs: $e.length.toLocaleString(),
                            shown: Kt.length.toLocaleString(),
                            total: oe.toLocaleString(),
                            population: (ee == null ? void 0 : ee.name) ?? s("All Events")
                          })
                        }
                      )
                    ] }),
                    children: ne ? ne.ready ? $e.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No pairs match the current filter. Choose another filter or clear the channel search.") }) : fe === "compact" ? /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-gallery",
                        "data-event-signature": ne.dataset.eventSignature,
                        children: $e.map((n) => Gt(n, ne.dataset))
                      }
                    ) : fe === "matrix" && c ? /* @__PURE__ */ e.jsxs(
                      "div",
                      {
                        ref: Ps,
                        className: "gl-comp-global-matrix",
                        "data-event-signature": ne.dataset.eventSignature,
                        "data-tile-size": zt,
                        role: "grid",
                        "aria-label": s("Compensation pairs arranged as the matrix"),
                        style: { gridTemplateColumns: `92px repeat(${c.receiverChannels.length}, ${zt}px)` },
                        children: [
                          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-corner", children: [
                            /* @__PURE__ */ e.jsx("span", { children: s("Source ↓") }),
                            /* @__PURE__ */ e.jsx("span", { children: s("Receiver →") })
                          ] }),
                          c.receiverChannels.map((n, a) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-col", title: n.combined, children: [
                            /* @__PURE__ */ e.jsx("strong", { children: n.label }),
                            /* @__PURE__ */ e.jsx("small", { children: n.pnn })
                          ] }, `col-${a}`)),
                          c.sourceChannels.map((n, a) => /* @__PURE__ */ e.jsxs(b.Fragment, { children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-row", title: n.combined, children: [
                              /* @__PURE__ */ e.jsx("strong", { children: n.label }),
                              /* @__PURE__ */ e.jsx("small", { children: n.pnn })
                            ] }),
                            c.receiverChannels.map((u, d) => {
                              const p = ua.get(`${a}:${d}`);
                              if (p) return Gt(p, ne.dataset, zt);
                              const f = c.sourceAxisKeys[a] === c.receiverAxisKeys[d];
                              return /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  className: `gl-comp-global-matrix-blank${f ? " is-diagonal" : ""}`,
                                  title: f ? s("{channel} into itself", { channel: n.label }) : s("{source} into {receiver}: not shown under the current filter", { source: n.label, receiver: u.label }),
                                  children: f ? /* @__PURE__ */ e.jsx("span", { children: n.label }) : null
                                },
                                `${a}:${d}`
                              );
                            })
                          ] }, `row-${a}`))
                        ]
                      }
                    ) : /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-groups",
                        "data-event-signature": ne.dataset.eventSignature,
                        "data-layout": fe,
                        children: Dt.map((n) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                          /* @__PURE__ */ e.jsxs("header", { children: [
                            /* @__PURE__ */ e.jsx("span", { children: s(fe === "source" ? "Source channel" : "Receiver") }),
                            /* @__PURE__ */ e.jsx("strong", { title: n.channel.combined, children: n.channel.label }),
                            /* @__PURE__ */ e.jsx("small", { children: n.channel.pnn }),
                            /* @__PURE__ */ e.jsx("em", { children: s("{count} pairs", { count: n.pairs.length }) })
                          ] }),
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: n.pairs.map((a) => Gt(a, ne.dataset)) })
                        ] }, n.channel.key))
                      }
                    ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s(ne.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No matrix is available for the global inspector.") })
                  }
                ),
                In && Wt(),
                In && qt(() => St(!1), !0)
              ]
            }
          ) : c ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: Cn,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${bn}px` },
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
                            value: Et,
                            disabled: he !== null || Ce !== null,
                            onChange: (n) => At(Number(n.currentTarget.value)),
                            children: Array.from({ length: Si }, (n, a) => a + 1).map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
                          }
                        )
                      ] }),
                      he ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: Ta, children: s("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-btn",
                          disabled: !S || !K || Ue.length === 0 || Ut > 0 || q || Ce !== null,
                          onClick: () => void Aa(),
                          children: s("Run four-value sweeps ({count})", { count: Ue.length })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-scope", children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Suggestions computed for {population} from up to {count} frozen events.", {
                      population: (ee == null ? void 0 : ee.name) ?? s("All Events"),
                      count: Math.min(oe, Ln.length).toLocaleString()
                    }) }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-evidence-mode", children: [
                      /* @__PURE__ */ e.jsx("span", { children: s("Evidence mode") }),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          "aria-label": s("Compensation evidence mode"),
                          value: qe,
                          disabled: q || he !== null || Ce !== null,
                          onChange: (n) => {
                            Xi(n.currentTarget.value), $t((a) => a + 1), Xe({}), on({}), be(null);
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
                        disabled: q || he !== null || Ce !== null,
                        onClick: () => {
                          $t((n) => n + 1), Xe({}), on({}), be(null), ge(!1), Q(
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
                      workers: Et
                    }) })
                  ] }),
                  js && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s(js) }),
                  S ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": s("Add compensation pair for follow-up"), children: [
                      /* @__PURE__ */ e.jsx("strong", { children: s("Add a pair") }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
                        /* @__PURE__ */ e.jsx(
                          ti,
                          {
                            label: s("Follow-up source channel"),
                            value: Ie,
                            options: c.sourceAxisKeys.flatMap((n, a) => de.has(n) ? [{ value: n, label: re[a].combined }] : []),
                            onChange: (n) => {
                              ys(n), Ee === n && Tt(c.receiverAxisKeys.find((a) => a !== n && de.has(a)) ?? "");
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Receiver") }),
                        /* @__PURE__ */ e.jsx(
                          ti,
                          {
                            label: s("Follow-up receiver channel"),
                            value: Ee,
                            options: c.receiverAxisKeys.flatMap((n, a) => n !== Ie && de.has(n) ? [{ value: n, label: ce[a].combined }] : []),
                            onChange: Tt
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !Ie || !Ee || Ie === Ee,
                          onClick: ha,
                          children: s("Flag for follow-up")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flagged-columns", children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsx("h4", { children: s("Flagged by you ({count})", { count: Ue.length }) }),
                          /* @__PURE__ */ e.jsx("span", { children: s("Only these pairs are included when you run sweeps.") })
                        ] }) }),
                        Ue.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pairs are flagged yet. Tick “Flag for follow-up” in the inspector, add a pair above, or accept a suggestion below.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-list", children: Ue.map((n, a) => {
                          const u = ta[n.pairKey], d = ia === n.pairKey, p = Dn(n.pairKey, n.coefficient), f = _t(n.pairKey, n.coefficient);
                          return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${Fe === n.pairKey ? " is-selected" : ""}`, children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                              /* @__PURE__ */ e.jsxs(
                                "button",
                                {
                                  type: "button",
                                  className: "gl-comp-sweep-pair-head",
                                  "aria-expanded": d,
                                  onClick: () => {
                                    Ne(n.pairKey), Pn(d ? null : n.pairKey);
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
                                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ e.jsx(ni, { open: d, size: 12 }) })
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
                                  onChange: (w) => zn(n.pairKey, w.currentTarget.checked)
                                }
                              ) })
                            ] }),
                            d && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-body", children: [
                              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inline-bounds", children: [
                                /* @__PURE__ */ e.jsx("span", { children: s("Four values across") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  s("Lower (%)"),
                                  /* @__PURE__ */ e.jsx($n, { step: "0.1", value: f.lowerPercent, disabled: q || he !== null || Ce !== null, onValueChange: (w) => ct(n.pairKey, n.coefficient, "lowerPercent", w) })
                                ] }),
                                /* @__PURE__ */ e.jsx("span", { children: s("to") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  s("Upper (%)"),
                                  /* @__PURE__ */ e.jsx($n, { step: "0.1", value: f.upperPercent, disabled: q || he !== null || Ce !== null, onValueChange: (w) => ct(n.pairKey, n.coefficient, "upperPercent", w) })
                                ] }),
                                p.error && /* @__PURE__ */ e.jsx("small", { children: s(p.error) })
                              ] }),
                              u ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: u.values.map((w) => /* @__PURE__ */ e.jsxs(
                                "div",
                                {
                                  className: `gl-comp-sweep-value${w.isCurrent ? " is-current" : ""}${X[n.pairKey] === w.value ? " is-staged" : ""}`,
                                  children: [
                                    /* @__PURE__ */ e.jsx(
                                      yt,
                                      {
                                        title: `${w.isCurrent ? `${s("Current")} · ` : ""}${(w.value * 100).toFixed(2)}%`,
                                        panel: w.preview.compensated,
                                        preview: w.preview,
                                        sourceLabel: n.source.label,
                                        receiverLabel: n.receiver.label,
                                        minimumSize: 150,
                                        maximumSize: 230,
                                        densitySmoothing: nn
                                      }
                                    ),
                                    /* @__PURE__ */ e.jsxs("dl", { children: [
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Shift") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: s("{value} MAD", { value: ie(w.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Slope") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: ie(w.preview.evidence.residualSlope ?? 0, 4) })
                                      ] }),
                                      c.kind === "cytof" && /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Receiver zero") }),
                                        /* @__PURE__ */ e.jsxs("dd", { children: [
                                          (w.preview.compensated.zeroPile.receiver / Math.max(1, w.preview.eventCount) * 100).toFixed(1),
                                          "%"
                                        ] })
                                      ] })
                                    ] }),
                                    /* @__PURE__ */ e.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        className: "gl-mini-btn",
                                        disabled: q || w.isCurrent,
                                        onClick: () => Bn(n.pairKey, w.value),
                                        children: s(w.isCurrent ? "Installed" : X[n.pairKey] === w.value ? "Staged" : "Use this value")
                                      }
                                    )
                                  ]
                                },
                                `${n.pairKey}:${w.value}:${w.isCurrent}`
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
                            Te.items.length,
                            ")"
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { children: s("{evaluable} evaluable of {screened} screened pairs for {population}. Inspect before flagging.", {
                            evaluable: Te.evaluableCount.toLocaleString(),
                            screened: Te.screenedCount.toLocaleString(),
                            population: (ee == null ? void 0 : ee.name) ?? s("All Events")
                          }) })
                        ] }) }),
                        Te.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: Te.items.map((n) => {
                          const a = as(n, c.kind, qe);
                          return /* @__PURE__ */ e.jsxs("article", { className: Sn.has(n.pairKey) ? "is-flagged" : void 0, children: [
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
                                  checked: Sn.has(n.pairKey),
                                  "aria-label": s("Flag suggested {source} to {receiver} for follow-up", {
                                    source: n.source.label,
                                    receiver: n.receiver.label
                                  }),
                                  onChange: (u) => zn(n.pairKey, u.currentTarget.checked)
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
                Wt(),
                qt()
              ]
            }
          ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: s(V ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : t.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
          (c || V) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": s("Advanced compensation tools"), children: [
            Gn.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Matrix evidence") }),
              V ? S ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-evidence-grid", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Profile ID") }),
                    /* @__PURE__ */ e.jsx("dd", { children: S.profileId })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Created") }),
                    /* @__PURE__ */ e.jsx("dd", { children: new Date(S.createdAt).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Matrix source") }),
                    /* @__PURE__ */ e.jsx("dd", { children: Wr(S, s) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Orientation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("Source rows → receiver columns") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Imported dimensions") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{sources} sources × {receivers} receivers", {
                      sources: S.scientific.matrix.sourceChannels.length,
                      receivers: S.scientific.matrix.receiverChannels.length
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Applied solve") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{count} exact $PnN channels · {status}", {
                      count: V.includedPnns.length,
                      status: H.state
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Matrix hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: S.matrixHash, children: [
                      S.matrixHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Profile hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: S.profileHash, children: [
                      S.profileHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Provenance") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s(((Xs = S.provenance) == null ? void 0 : Xs.sourceDescription) ?? "No additional source note supplied") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Estimation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s(((Js = S.provenance) == null ? void 0 : Js.estimationMethod) ?? "Imported coefficients preserved exactly") })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-method-card", "aria-label": s("Installed compensation method"), children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Pipeline") }),
                    /* @__PURE__ */ e.jsx("strong", { children: s(S.scientific.kind === "cytof-spillover" ? "Original counts → NNLS → Compensated counts → arcsinh display" : "Original values → linear matrix inverse → Compensated values → display transform") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Solver") }),
                    /* @__PURE__ */ e.jsx("strong", { children: S.scientific.solverVersion }),
                    /* @__PURE__ */ e.jsx("small", { children: S.scientific.solverSettings.map(({ key: n, value: a }) => `${n}=${String(a)}`).join(" · ") })
                  ] })
                ] }),
                Ke && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": s("Original versus Compensated preview"), children: [
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { children: s("Original → Compensated impact") }),
                    /* @__PURE__ */ e.jsx("span", { children: s("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                      events: Ke.previewEvents.toLocaleString(),
                      channels: V.includedPnns.length
                    }) })
                  ] }) }),
                  /* @__PURE__ */ e.jsxs("dl", { children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Values changed") }),
                      /* @__PURE__ */ e.jsxs("dd", { children: [
                        Ke.changedValues.toLocaleString(),
                        " / ",
                        Ke.comparedValues.toLocaleString(),
                        " (",
                        sn(Ke.changedValues / Ke.comparedValues, !1, 4),
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Median |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: ie(Ke.medianAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Maximum |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: ie(Ke.maxAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Largest median shift") }),
                      /* @__PURE__ */ e.jsxs("dd", { title: Ke.mostChangedChannel, children: [
                        Ke.mostChangedChannel,
                        " · ",
                        ie(Ke.mostChangedChannelMedianDelta, 5)
                      ] })
                    ] }),
                    V.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Negative → zero") }),
                      /* @__PURE__ */ e.jsx("dd", { children: s("{count} preview values", { count: Ke.zeroedNegativeValues.toLocaleString() }) })
                    ] })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ e.jsx("p", { children: s("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
                profile: V.profileId,
                method: ut,
                count: V.includedPnns.length,
                status: H.state
              }) }) : /* @__PURE__ */ e.jsx("p", { children: s("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
                channels: ae.channels.length,
                warnings: Bt.length || s("no")
              }) })
            ] }),
            Gn.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Review queue") }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: s("Matrix integrity") }),
                dt.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: dt.map((n) => /* @__PURE__ */ e.jsx("li", { children: s(n) }, n)) }) : /* @__PURE__ */ e.jsx("p", { children: s("No matrix-level items currently require review.") })
              ] }),
              H.state === "ready" && c && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: s("Residual-evidence shortlist") }),
                /* @__PURE__ */ e.jsx("p", { children: s("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                  screened: Te.screenedCount.toLocaleString(),
                  candidateSuffix: Te.candidateCount > Te.screenedCount ? s(" of {count}", { count: Te.candidateCount.toLocaleString() }) : "",
                  zeroSuffix: c.kind === "cytof" ? s(", and new exact-zero pile") : "",
                  modeNote: s(qe === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
                }) }),
                Te.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: Te.items.map((n) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => Hs(n.sourceIndex, n.receiverIndex),
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
          aa && c && /* @__PURE__ */ e.jsx(
            Li,
            {
              profileLabel: (S == null ? void 0 : S.name) ?? (we ? "SCE_spillover" : "embedded_FCS"),
              installedLabel: s(
                S ? "Installed matrix" : we ? "SCE spillover matrix" : "Embedded FCS matrix"
              ),
              installedMatrix: {
                sourceChannels: c.sourceAxisKeys,
                receiverChannels: c.receiverAxisKeys,
                matrix: c.matrix
              },
              workingMatrix: ma,
              pendingEditCount: Object.keys(X).length,
              onClose: () => ws(!1)
            }
          ),
          ra && /* @__PURE__ */ e.jsx(
            fr,
            {
              sampleName: i,
              populationName: (ee == null ? void 0 : ee.name) ?? s("All Events"),
              filterLabel: Is,
              pairCount: Fs.length,
              onExport: Ia,
              onClose: () => Ns(!1)
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
function Hr(t, i) {
  const r = t.visible !== !1, l = i.visible !== !1;
  return r || l ? !1 : t.sample === i.sample && t.stateKey === i.stateKey;
}
const Yr = b.memo(Gr, Hr);
export {
  Yr as CompensationTab
};
