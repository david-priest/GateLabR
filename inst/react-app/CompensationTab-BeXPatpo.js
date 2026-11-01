import { D as ms, r as Ua, l as Ba, s as Va, z as Wa, f as Ga, u as Ie, a as v, j as e, M as Ri, b as qa, c as Ha, d as Za, p as Ki, e as Ya, g as ve, h as re, i as rn, k as Xa, m as Ja, n as Qa, T as er, o as nr, C as ai, q as tr, t as sr, S as ri, v as as, w as Xt, x as li, F as oi, y as ir, A as ar, B as rr, E as lr, G as or, H as cr } from "./embed-Ad5xBSHI.js";
function rs(t) {
  const i = t.trim().normalize("NFC"), r = i.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (r)
    return { element: r[1], mass: Number(r[2]) };
  const l = i.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return l ? { element: l[2], mass: Number(l[1]) } : null;
}
function ci(t) {
  return t.map((i, r) => ({ channel: i, index: r, isotope: rs(i) })).sort((i, r) => i.isotope && r.isotope ? i.isotope.mass - r.isotope.mass || i.isotope.element.localeCompare(r.isotope.element) || i.index - r.index : i.isotope ? -1 : r.isotope ? 1 : i.index - r.index).map(({ index: i }) => i);
}
function dr(t) {
  const i = ci(t.sourceChannels), r = ci(t.receiverChannels);
  return {
    sourceChannels: i.map((l) => t.sourceChannels[l]),
    receiverChannels: r.map((l) => t.receiverChannels[l]),
    matrix: i.map(
      (l) => r.map((o) => t.matrix[l][o])
    )
  };
}
function Tn(t, i) {
  if (t === i) return "self";
  const r = rs(t), l = rs(i);
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
function fn(t, i, r) {
  if (!Number.isSafeInteger(t) || t < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(i) || i <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (r && r.length !== t)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const l = r ? r.reduce((x, j) => x + (j ? 1 : 0), 0) : t, o = Math.min(l, i), h = new Uint32Array(o);
  if (o === 0) return h;
  if (!r) {
    if (o === 1) return h;
    for (let x = 0; x < o; x++)
      h[x] = Math.floor(x * (t - 1) / (o - 1));
    return h;
  }
  const m = Array.from({ length: o }, (x, j) => o === 1 ? 0 : Math.floor(j * (l - 1) / (o - 1)));
  let g = 0, b = 0;
  for (let x = 0; x < t && b < o; x++)
    r[x] && (g === m[b] && (h[b++] = x), g++);
  return h;
}
function bn(t, i) {
  if (t.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (t.length - 1), l = Math.floor(r), o = Math.ceil(r);
  return l === o ? t[l] : t[l] + (t[o] - t[l]) * (r - l);
}
function ft(t) {
  const i = t.filter(Number.isFinite).sort((h, m) => h - m);
  if (i.length === 0) return [-1, 1];
  let r = bn(i, 2e-3), l = bn(i, 0.998);
  if (!(l > r)) {
    const h = Number.isFinite(r) ? r : 0, m = Math.max(1, Math.abs(h) * 0.05);
    return [h - m, h + m];
  }
  const o = (l - r) * 0.035;
  return r -= o, l += o, [r, l];
}
function qe(t) {
  if (t.length === 0) return Number.NaN;
  const i = [...t].sort((r, l) => r - l);
  return bn(i, 0.5);
}
function xt(t) {
  if (t.length === 0) return Number.NaN;
  const i = qe(t), r = qe(t.map((m) => Math.abs(m - i))) * 1.4826;
  if (Number.isFinite(r) && r > 0) return r;
  const l = t.reduce((m, g) => m + g, 0) / t.length, o = t.reduce((m, g) => m + (g - l) ** 2, 0) / Math.max(1, t.length - 1), h = Math.sqrt(o);
  return Number.isFinite(h) && h > 0 ? h : 1e-12;
}
function ls(t, i, r = 12) {
  if (t.length !== i.length || t.length < r * 8) return null;
  const l = Array.from({ length: t.length }, (g, b) => b).sort((g, b) => t[g] - t[b]), o = [];
  for (let g = 0; g < r; g++) {
    const b = Math.floor(g * l.length / r), x = Math.floor((g + 1) * l.length / r), j = l.slice(b, x);
    if (j.length < 8) continue;
    const I = qe(j.map((S) => t[S])), y = qe(j.map((S) => i[S]));
    Number.isFinite(I) && Number.isFinite(y) && o.push({ x: I, y });
  }
  const h = [];
  for (let g = 0; g < o.length; g++)
    for (let b = g + 1; b < o.length; b++) {
      const x = o[b].x - o[g].x;
      if (x === 0) continue;
      const j = (o[b].y - o[g].y) / x;
      Number.isFinite(j) && h.push(j);
    }
  const m = qe(h);
  return Number.isFinite(m) ? m : null;
}
function ur(t, i) {
  if (t.length !== i.length || t.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const r = Array.from({ length: t.length }, (T, K) => K).filter((T) => Number.isFinite(t[T]) && Number.isFinite(i[T])).sort((T, K) => t[T] - t[K]);
  if (r.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const l = Math.max(96, Math.floor(r.length * 0.8)), o = Math.min(r.length - 24, Math.floor(r.length * 0.9)), h = r.slice(0, l), m = r.slice(o);
  if (h.length < 96 || m.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const g = h.map((T) => t[T]), b = h.map((T) => i[T]), x = ls(g, b, 10);
  if (x === null) return { excessMad: null, slopeDeltaMad: null };
  const j = qe(h.map((T) => i[T] - x * t[T])), I = h.map((T) => i[T] - (j + x * t[T])), y = Math.max(
    xt(I),
    xt(b) * 0.05,
    1e-12
  ), S = m.map((T) => i[T] - (j + x * t[T])).sort((T, K) => T - K), E = bn(S, 0.75) / y, F = r.slice(Math.floor(r.length * 0.75)), k = F.map((T) => t[T]), A = F.map((T) => i[T]), $ = ls(k, A, 4), P = bn(k, 0.9) - bn(k, 0.1), M = $ === null || !(P > 0) ? null : ($ - x) * P / y;
  return {
    excessMad: Number.isFinite(E) ? E : null,
    slopeDeltaMad: Number.isFinite(M) ? M : null
  };
}
function Li(t, i, r, l, o, h) {
  const m = r.length, g = ur(r, l), b = Math.min(50, Math.max(12, Math.floor(m * 0.01))), x = (V = 0, H = 0, se = 0) => ({
    status: "insufficient",
    sourceLowEvents: V,
    sourceHighEvents: H,
    destinationNegativeEvents: se,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: g.excessMad,
    upperTailSlopeDeltaMad: g.slopeDeltaMad,
    receiverZeroDeltaFraction: m > 0 ? (h - o) / m : 0
  });
  if (m < b * 3) return x();
  const j = [...r].sort((V, H) => V - H), I = bn(j, 0.25), y = r.flatMap((V, H) => V <= I ? [H] : []);
  if (y.length < b) return x(y.length);
  const S = y.map((V) => r[V]), E = qe(S), F = xt(S);
  let k = r.flatMap((V, H) => V >= E + 3 * F ? [H] : []);
  if (k.length < b && (k = Array.from({ length: m }, (V, H) => H).sort((V, H) => r[H] - r[V]).slice(0, b)), k.length < b) return x(y.length, k.length);
  const A = y.map((V) => l[V]), $ = qe(A), P = xt(A), M = $ + 5 * P, T = l.flatMap((V, H) => V <= M ? [H] : []), K = new Set(T), L = y.filter((V) => K.has(V)), D = k.filter((V) => K.has(V));
  if (L.length < b || D.length < b)
    return x(y.length, k.length, T.length);
  const _ = (qe(D.map((V) => l[V])) - qe(L.map((V) => l[V]))) / P, G = T.map((V) => t[V]), Z = T.map((V) => i[V]);
  return {
    status: "ready",
    sourceLowEvents: y.length,
    sourceHighEvents: k.length,
    destinationNegativeEvents: T.length,
    normalizedNegativeShift: Number.isFinite(_) ? _ : null,
    residualSlope: ls(G, Z),
    upperTailExcessMad: g.excessMad,
    upperTailSlopeDeltaMad: g.slopeDeltaMad,
    receiverZeroDeltaFraction: m > 0 ? (h - o) / m : 0
  };
}
function vt(t, i, r, l, o, h) {
  let m = 0, g = 0, b = 0;
  for (let x = 0; x < r.length; x++) {
    const j = Math.abs(r[x]) <= 1e-12, I = Math.abs(l[x]) <= 1e-12;
    j && m++, I && g++, j && I && b++;
  }
  return {
    x: t.map((x) => Math.max(o[0], Math.min(o[1], x))),
    y: i.map((x) => Math.max(h[0], Math.min(h[1], x))),
    zeroPile: Object.freeze({
      source: m,
      receiver: g,
      corner: b
    })
  };
}
function Jt(t, i, r, l = {}) {
  var V;
  if (t.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation to compare Original and Compensated data." };
  const h = gt(t, i), m = gt(t, r);
  if (h === void 0 || m === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (t.fcs.nEvents === 0)
    return { ready: !1, reason: "This sample contains no events." };
  const g = ((V = l.fixedEventIndices) == null ? void 0 : V.slice()) ?? fn(
    t.fcs.nEvents,
    l.maxEvents ?? 15e3,
    l.eventMask
  );
  for (const H of g)
    if (H >= t.fcs.nEvents || l.eventMask && !l.eventMask[H])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const b = t.channels[h].key, x = t.channels[m].key, j = t.originalColumnData(h), I = t.originalColumnData(m), y = t.compensatedColumnData(h), S = t.compensatedColumnData(m), E = [], F = [], k = [], A = [], $ = [], P = [], M = [], T = [];
  for (const H of g) {
    const se = t.rawToDisplay(b, j[H]), Pe = t.rawToDisplay(x, I[H]), s = t.rawToDisplay(b, y[H]), R = t.rawToDisplay(x, S[H]);
    [se, Pe, s, R].every(Number.isFinite) && (E.push(se), F.push(Pe), k.push(j[H]), A.push(I[H]), $.push(s), P.push(R), M.push(y[H]), T.push(S[H]));
  }
  const K = ft([...E, ...$]), L = ft([...F, ...P]), D = t.channelTicks(h, [K[0], K[1]]), _ = t.channelTicks(m, [L[0], L[1]]), G = vt(
    E,
    F,
    k,
    A,
    K,
    L
  ), Z = vt(
    $,
    P,
    M,
    T,
    K,
    L
  );
  return {
    ready: !0,
    preview: {
      eventCount: E.length,
      totalEvents: l.eventMask ? l.eligibleEventCount ?? l.eventMask.reduce((H, se) => H + (se ? 1 : 0), 0) : t.fcs.nEvents,
      xRange: K,
      yRange: L,
      xTicks: D,
      yTicks: _,
      original: G,
      compensated: Z,
      evidence: Li(
        M,
        T,
        $,
        P,
        G.zeroPile.receiver,
        Z.zeroPile.receiver
      )
    }
  };
}
function Qt(t, i, r, l, o, h, m = {}) {
  const g = gt(t, i), b = gt(t, r);
  if (g === void 0 || b === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (o.length !== l.length || h.length !== l.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const x = t.channels[g].key, j = t.channels[b].key, I = t.originalColumnData(g), y = t.originalColumnData(b), S = [], E = [], F = [], k = [], A = [], $ = [], P = [], M = [];
  for (let Z = 0; Z < l.length; Z++) {
    const V = l[Z];
    if (V >= t.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const H = I[V], se = y[V], Pe = o[Z], s = h[Z], R = t.rawToDisplay(x, H), O = t.rawToDisplay(j, se), Ue = t.rawToDisplay(x, Pe), W = t.rawToDisplay(j, s);
    [H, se, Pe, s, R, O, Ue, W].every(Number.isFinite) && (S.push(R), E.push(O), F.push(H), k.push(se), A.push(Ue), $.push(W), P.push(Pe), M.push(s));
  }
  const T = m.xRange ?? ft([...S, ...A]), K = m.yRange ?? ft([...E, ...$]), L = t.channelTicks(g, [T[0], T[1]]), D = t.channelTicks(b, [K[0], K[1]]), _ = vt(S, E, F, k, T, K), G = vt(A, $, P, M, T, K);
  return {
    ready: !0,
    preview: {
      eventCount: S.length,
      totalEvents: m.totalEvents ?? t.fcs.nEvents,
      xRange: T,
      yRange: K,
      xTicks: L,
      yTicks: D,
      original: _,
      compensated: G,
      evidence: Li(
        P,
        M,
        A,
        $,
        _.zeroPile.receiver,
        G.zeroPile.receiver
      )
    }
  };
}
const di = 0.5, hr = 0.01, mr = 1e-4, pr = 0.05, gr = 3, fr = 1, xr = 5;
function Oi(t, i) {
  const r = t.evidence.normalizedNegativeShift ?? 0, l = t.evidence.residualSlope ?? 0, o = Math.max(0, t.evidence.upperTailExcessMad ?? 0), h = Math.max(0, t.evidence.upperTailSlopeDeltaMad ?? 0), m = Math.abs(t.coefficient), g = Math.max(
    mr,
    m * pr
  );
  return {
    negativeShift: Math.max(0, -r),
    negativeSlope: Math.max(0, -l),
    zeroDelta: i === "cytof" ? Math.max(0, t.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, r),
    positiveSlope: Math.max(0, l),
    upperTailExcess: o,
    upperTailSlopeDelta: h,
    hasNegativeShift: r <= -di,
    hasNegativeSlope: l <= -g,
    hasNewZeroPile: i === "cytof" && t.evidence.receiverZeroDeltaFraction >= hr,
    hasPositiveShift: r >= di,
    hasPositiveSlope: l >= g,
    hasHighTailCurve: o >= gr && (h >= fr || o >= xr)
  };
}
function vr(t) {
  return Number(t.hasNegativeShift) + Number(t.hasNegativeSlope) + Number(t.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : t.hasNewZeroPile ? "new-zero-pile" : t.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function os(t, i, r = "biological") {
  const l = Oi(t, i), o = l.hasNegativeShift || l.hasNegativeSlope || l.hasNewZeroPile, h = l.hasPositiveShift || l.hasPositiveSlope, m = l.hasHighTailCurve || r === "control" && h;
  return o && m ? {
    category: "mixed-evidence",
    label: "Mixed evidence · inspect",
    detail: "Positive and negative residual signals disagree. Inspect the matched plots and use a suitable control before changing the coefficient.",
    reason: "mixed-residual-signals",
    automaticFollowup: !0
  } : o ? {
    category: "overcompensation-like",
    label: "Overcompensation-like",
    detail: "A negative receiver shift, negative residual slope, or new NNLS zero pile is present. This is a review prompt, not an automatic coefficient verdict.",
    reason: vr(l),
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
  } : h ? r === "control" ? {
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
function an(t, i) {
  if (!Number.isFinite(t) || t <= 0) return 0;
  const r = i.filter((o) => Number.isFinite(o) && o > 0).sort((o, h) => o - h);
  if (r.length === 0) return 0;
  let l = 0;
  for (const o of r)
    if (o <= t) l++;
    else break;
  return l / r.length;
}
function br(t, i, r = "biological") {
  const l = t.map((E) => ({
    ...Oi(E, i),
    coefficient: Math.abs(E.coefficient)
  })), o = (E) => l.map((F) => typeof F[E] == "number" ? F[E] : 0), h = o("negativeShift"), m = o("negativeSlope"), g = o("zeroDelta"), b = o("positiveShift"), x = o("positiveSlope"), j = o("upperTailExcess"), I = o("upperTailSlopeDelta"), y = o("coefficient"), S = t.flatMap((E, F) => {
    const k = os(E, i, r);
    if (!k.automaticFollowup || k.reason === null) return [];
    const A = l[F], $ = 0.22 * an(A.negativeShift, h) + 0.13 * an(A.negativeSlope, m) + 0.14 * an(A.zeroDelta, g) + (r === "control" ? 0.13 * an(A.positiveShift, b) : 0) + (r === "control" ? 0.08 * an(A.positiveSlope, x) : 0) + 0.12 * an(A.upperTailExcess, j) + 0.08 * an(A.upperTailSlopeDelta, I) + 0.05 * an(A.coefficient, y) + 0.05 * Math.max(0, Math.min(1, E.physicalPrior));
    return [{
      index: F,
      relativePriority: $,
      reason: k.reason,
      category: k.category
    }];
  });
  return Object.freeze(S.sort((E, F) => F.relativePriority - E.relativePriority || E.index - F.index));
}
function yr(t, i) {
  const r = t.index(i);
  if (r !== void 0) return r;
  const l = t.channels.findIndex((o) => o.pnn === i);
  return l < 0 ? void 0 : l;
}
function cs(t, i) {
  if (t.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (t.length - 1), l = Math.floor(r), o = Math.ceil(r);
  return l === o ? t[l] : t[l] + (t[o] - t[l]) * (r - l);
}
function jr(t) {
  const i = t.filter(Number.isFinite).sort((h, m) => h - m);
  if (i.length === 0) return [-1, 1];
  let r = cs(i, 2e-3), l = cs(i, 0.998);
  if (!(l > r)) {
    const h = Number.isFinite(r) ? r : 0, m = Math.max(1, Math.abs(h) * 0.05);
    return [h - m, h + m];
  }
  const o = (l - r) * 0.035;
  return r -= o, l += o, [r, l];
}
function wr(t) {
  if (t.length === 0) return "0:empty";
  let i = 2166136261;
  for (const r of t)
    i ^= r, i = Math.imul(i, 16777619) >>> 0;
  return `${t.length}:${t[0]}:${t[t.length - 1]}:${i.toString(16)}`;
}
function Nr(t, i, r = {}) {
  var g;
  if (t.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const o = ((g = r.fixedEventIndices) == null ? void 0 : g.slice()) ?? fn(
    t.fcs.nEvents,
    r.maxEvents ?? 2500,
    r.eventMask
  );
  for (const b of o)
    if (b >= t.fcs.nEvents || r.eventMask && !r.eventMask[b])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const h = /* @__PURE__ */ new Map();
  for (const b of Array.from(new Set(i))) {
    const x = yr(t, b);
    if (x === void 0) continue;
    const j = t.channels[x], I = t.originalColumnData(x), y = t.compensatedColumnData(x), S = new Float64Array(o.length), E = new Float64Array(o.length), F = new Float64Array(o.length), k = new Float64Array(o.length), A = [];
    for (let M = 0; M < o.length; M++) {
      const T = o[M], K = I[T], L = y[T], D = t.rawToDisplay(j.key, K), _ = t.rawToDisplay(j.key, L);
      S[M] = K, E[M] = L, F[M] = D, k[M] = _, Number.isFinite(D) && A.push(D), Number.isFinite(_) && A.push(_);
    }
    const $ = jr(A), P = Object.freeze({
      key: j.key,
      pnn: j.pnn,
      range: $,
      ticks: t.channelTicks(x, [$[0], $[1]]),
      originalRaw: S,
      compensatedRaw: E,
      originalDisplay: F,
      compensatedDisplay: k
    });
    h.set(b, P), h.set(j.key, P), h.set(j.pnn, P);
  }
  const m = r.eventMask ? r.eligibleEventCount ?? r.eventMask.reduce((b, x) => b + (x ? 1 : 0), 0) : t.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: o,
      eventSignature: wr(o),
      eligibleEventCount: m,
      channels: h
    })
  };
}
function ui(t, i, r, l, o, h, m) {
  const g = [], b = [];
  let x = 0, j = 0, I = 0;
  for (const y of o) {
    g.push(Math.max(h[0], Math.min(h[1], t[y]))), b.push(Math.max(m[0], Math.min(m[1], i[y])));
    const S = Math.abs(r[y]) <= 1e-12, E = Math.abs(l[y]) <= 1e-12;
    S && x++, E && j++, S && E && I++;
  }
  return {
    x: g,
    y: b,
    zeroPile: Object.freeze({ source: x, receiver: j, corner: I })
  };
}
function Di(t, i, r) {
  const l = t.channels.get(i), o = t.channels.get(r);
  if (!l || !o)
    return { ready: !1, reason: "One or both channels are absent from the frozen global-inspector dataset." };
  const h = [];
  for (let m = 0; m < t.eventIndices.length; m++)
    [
      l.originalDisplay[m],
      o.originalDisplay[m],
      l.compensatedDisplay[m],
      o.compensatedDisplay[m]
    ].every(Number.isFinite) && h.push(m);
  return {
    ready: !0,
    preview: Object.freeze({
      eventCount: h.length,
      totalEvents: t.eligibleEventCount,
      eventSignature: t.eventSignature,
      xRange: l.range,
      yRange: o.range,
      xTicks: l.ticks,
      yTicks: o.ticks,
      original: ui(
        l.originalDisplay,
        o.originalDisplay,
        l.originalRaw,
        o.originalRaw,
        h,
        l.range,
        o.range
      ),
      compensated: ui(
        l.compensatedDisplay,
        o.compensatedDisplay,
        l.compensatedRaw,
        o.compensatedRaw,
        h,
        l.range,
        o.range
      )
    })
  };
}
function hi(t, i, r, l, o) {
  const h = Math.max(1, Math.min(24, Math.round(o) || 3)), m = 256, g = h, b = m + 2 * g, x = new Float64Array(b * b), j = Math.max(1e-12, i[1] - i[0]), I = Math.max(1e-12, r[1] - r[0]);
  for (let A = 0; A < t.x.length; A++) {
    const $ = Math.max(0, Math.min(
      b - 1,
      Math.floor((t.x[A] - i[0]) / j * m) + g
    )), P = Math.max(0, Math.min(
      b - 1,
      Math.floor((t.y[A] - r[0]) / I * m) + g
    ));
    x[P * b + $]++;
  }
  const y = new Float64Array(b * b), S = (h * 2 + 1) ** 2, E = b + 1, F = new Float64Array(E * E);
  for (let A = 0; A < b; A++) {
    let $ = 0;
    for (let P = 0; P < b; P++)
      $ += x[A * b + P], F[(A + 1) * E + P + 1] = F[A * E + P + 1] + $;
  }
  for (let A = h; A < b - h; A++) {
    const $ = A - h, P = A + h + 1;
    for (let M = h; M < b - h; M++) {
      const T = M - h, K = M + h + 1, L = F[P * E + K] - F[$ * E + K] - F[P * E + T] + F[$ * E + T];
      y[A * b + M] = L / S;
    }
  }
  const k = [];
  for (let A = g; A < g + m; A++)
    for (let $ = g; $ < g + m; $++) {
      const P = y[A * b + $];
      P > 0 && k.push(P);
    }
  return k.sort((A, $) => A - $), k.length === 0 ? 1 : Math.max(1e-12, cs(k, l));
}
function ps(t, i) {
  const r = Math.max(1, Math.min(10, Number.isFinite(t) ? t : 6)), l = Math.max(1, (Number.isFinite(i) ? i : 220) - 50);
  return Math.max(1, Math.min(24, r * 170 / l));
}
function gs(t, i = 0.95, r = 3, l = ms) {
  const o = Math.max(
    hi(t.original, t.xRange, t.yRange, i, r),
    hi(t.compensated, t.xRange, t.yRange, i, r)
  );
  return Ua(o, l);
}
function bt(t, i) {
  const r = i.size / 220, l = Math.sqrt(r), o = Math.max(9, Math.min(12, 11 * l)), h = Math.max(10, Math.min(13, 12 * l));
  Ba().renderMiniPlot(t, {
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
      axis_label: h,
      title: Math.max(10, Math.min(13, 12 * l)),
      gate_label: o
    }
  });
}
const xn = "http://www.w3.org/2000/svg", qn = 6, vn = 1123, Hn = 794;
function zi(t) {
  return Math.ceil(Math.max(0, Math.floor(t)) / qn);
}
function mi(t) {
  return t.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function _i(t, i) {
  return `gatelab-compensation-${mi(t.replace(/\.[^.]+$/, ""))}-${mi(i)}`;
}
function ds(t, i, r, l) {
  const o = _i(t, i);
  return r === "pdf" || l <= 1 ? `${o}.${r}` : `${o}-${r}-pages.zip`;
}
function $n(t, i, r, l, o = {}) {
  const h = document.createElementNS(xn, "text");
  return h.setAttribute("x", String(r)), h.setAttribute("y", String(l)), h.setAttribute("font-family", "Arial, Helvetica, sans-serif"), h.setAttribute("font-size", String(o.size ?? 10)), h.setAttribute("font-weight", String(o.weight ?? 400)), h.setAttribute("fill", o.fill ?? "#253247"), o.anchor && h.setAttribute("text-anchor", o.anchor), h.textContent = i, t.appendChild(h), h;
}
function pi(t, i) {
  return t.length <= i ? t : `${t.slice(0, Math.max(1, i - 1))}…`;
}
function gi(t, i, r, l, o, h, m, g, b, x, j, I) {
  const y = document.createElement("div");
  bt(y, {
    title: l === "original" ? "Original" : "Compensated",
    panel: r[l],
    preview: r,
    sourceLabel: i.sourceLabel,
    receiverLabel: i.receiverLabel,
    size: m,
    densityColorCeiling: b,
    densitySmoothingRadius: g,
    densityColorPower: x,
    pointAlpha: j,
    pointSize: I,
    canvasScale: 300 / 96
  });
  const S = y.querySelector("canvas"), E = y.querySelector("svg");
  if (!S || !E) throw new Error("GateLab could not render a compensation export panel.");
  const F = document.createElementNS(xn, "g");
  F.setAttribute("transform", `translate(${o},${h})`);
  const k = document.createElementNS(xn, "image");
  k.setAttribute("x", "0"), k.setAttribute("y", "0"), k.setAttribute("width", String(m)), k.setAttribute("height", String(m)), k.setAttribute("href", S.toDataURL("image/png")), F.appendChild(k), F.appendChild(E.cloneNode(!0)), t.appendChild(F);
}
function fi(t, i, r, l) {
  const o = document.createElementNS(xn, "svg");
  o.setAttribute("xmlns", xn), o.setAttribute("width", String(vn)), o.setAttribute("height", String(Hn)), o.setAttribute("viewBox", `0 0 ${vn} ${Hn}`);
  const h = document.createElementNS(xn, "rect");
  h.setAttribute("width", "100%"), h.setAttribute("height", "100%"), h.setAttribute("fill", "#ffffff"), o.appendChild(h), $n(o, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), $n(
    o,
    pi(`${i.sampleName} · ${i.populationName} · ${i.profileName} · ${i.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), $n(o, `Page ${r + 1} of ${l}`, vn - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const m = 28, g = 18, b = 53, x = 771, j = (vn - m * 2 - g) / 2, I = (x - b) / 3, y = 204, S = 12, E = y * 2 + S;
  return t.forEach((F, k) => {
    const A = F.buildPreview(), $ = ps(i.densitySmoothing, y), P = gs(
      A,
      0.95,
      $,
      i.densityColorPower
    ), M = k % 2, T = Math.floor(k / 2), K = m + M * (j + g), L = b + T * I, D = K + (j - E) / 2, _ = L + 25, G = F.relationship && F.relationship !== "other" ? ` · ${F.relationship}` : "";
    if ($n(
      o,
      pi(`${F.sourceLabel} → ${F.receiverLabel}`, 58),
      K + 5,
      L + 14,
      { size: 10.5, weight: 700 }
    ), $n(
      o,
      `matrix ${(F.coefficient * 100).toFixed(1)}%${G}`,
      K + j - 5,
      L + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), gi(o, F, A, "original", D, _, y, $, P, i.densityColorPower, i.pointAlpha, i.pointSize ?? 1), gi(o, F, A, "compensated", D + y + S, _, y, $, P, i.densityColorPower, i.pointAlpha, i.pointSize ?? 1), T < 2) {
      const Z = document.createElementNS(xn, "line");
      Z.setAttribute("x1", String(K)), Z.setAttribute("x2", String(K + j)), Z.setAttribute("y1", String(L + I - 3)), Z.setAttribute("y2", String(L + I - 3)), Z.setAttribute("stroke", "#e6eaf0"), Z.setAttribute("stroke-width", "1"), o.appendChild(Z);
    }
  }), $n(
    o,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), o;
}
function xi(t) {
  return Ga(t, { widthPx: vn, heightPx: Hn }), `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(t)}`;
}
async function vi(t, i = 300) {
  const r = URL.createObjectURL(new Blob([t], { type: "image/svg+xml" }));
  try {
    const l = await new Promise((g, b) => {
      const x = new Image();
      x.onload = () => g(x), x.onerror = () => b(new Error("GateLab could not rasterize the compensation export page.")), x.src = r;
    }), o = Math.max(1, i / 96), h = document.createElement("canvas");
    h.width = Math.round(vn * o), h.height = Math.round(Hn * o);
    const m = h.getContext("2d");
    if (!m) throw new Error("Canvas export is unavailable in this browser.");
    return m.fillStyle = "#ffffff", m.fillRect(0, 0, h.width, h.height), m.scale(o, o), m.drawImage(l, 0, 0, vn, Hn), await new Promise((g, b) => {
      h.toBlob((x) => x ? g(x) : b(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(r);
  }
}
function bi(t, i) {
  const r = URL.createObjectURL(t), l = document.createElement("a");
  l.href = r, l.download = i, document.body.appendChild(l), l.click(), l.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function Cr(t, i, r, l) {
  const o = Math.max(2, String(r).length);
  return `${t}-page-${String(i + 1).padStart(o, "0")}.${l}`;
}
async function Sr(t, i, r, l) {
  const o = zi(t.length);
  if (o === 0) throw new Error("No compensation pairs are available to export.");
  const h = _i(i.sampleName, i.populationName);
  if (r === "pdf") {
    const { jsPDF: x } = await import("./jspdf.es.min-BjxRJ2Uq.js").then((S) => S.j), j = new x({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), I = j.internal.pageSize.getWidth(), y = j.internal.pageSize.getHeight();
    for (let S = 0; S < o; S++) {
      S > 0 && j.addPage("a4", "landscape");
      const E = t.slice(
        S * qn,
        (S + 1) * qn
      ), F = xi(fi(E, i, S, o)), k = await vi(F), A = await new Promise(($, P) => {
        const M = new FileReader();
        M.onload = () => $(String(M.result)), M.onerror = () => P(M.error ?? new Error("GateLab could not read an export page.")), M.readAsDataURL(k);
      });
      j.addImage(A, "PNG", 0, 0, I, y, void 0, "FAST"), l == null || l({ completedPages: S + 1, totalPages: o }), await new Promise(($) => setTimeout($, 0));
    }
    j.save(ds(i.sampleName, i.populationName, r, o));
    return;
  }
  const m = {};
  let g = null;
  for (let x = 0; x < o; x++) {
    const j = t.slice(
      x * qn,
      (x + 1) * qn
    ), I = xi(fi(j, i, x, o)), y = Cr(h, x, o, r);
    if (r === "svg") {
      const S = Va(I);
      m[y] = S, o === 1 && (g = new Blob([S], { type: "image/svg+xml" }));
    } else {
      const S = await vi(I), E = new Uint8Array(await S.arrayBuffer());
      m[y] = E, o === 1 && (g = S);
    }
    l == null || l({ completedPages: x + 1, totalPages: o }), await new Promise((S) => setTimeout(S, 0));
  }
  const b = ds(
    i.sampleName,
    i.populationName,
    r,
    o
  );
  bi(o === 1 && g ? g : new Blob([Wa(m, { level: 6 })], { type: "application/zip" }), b);
}
const Mr = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function kr({
  sampleName: t,
  populationName: i,
  filterLabel: r,
  pairCount: l,
  onExport: o,
  onClose: h
}) {
  const { t: m } = Ie(), [g, b] = v.useState("pdf"), [x, j] = v.useState(null), [I, y] = v.useState(null), S = zi(l), E = x !== null && x.completedPages < x.totalPages, F = ds(t, i, g, S), k = async () => {
    y(null), j({ completedPages: 0, totalPages: S });
    try {
      await o(g, j), h();
    } catch (A) {
      j(null), y(A instanceof Error ? A.message : String(A));
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-backdrop", children: [
    /* @__PURE__ */ e.jsx(Ri, { onClose: E ? null : h }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "gl-modal gl-comp-export-modal gl-comp-comparison-export-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "comp-comparison-export-title",
        children: [
          /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-comparison-export-title", children: m("Export compensation comparison") }),
          /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: m("Export the currently filtered channel pairs as clean paired Original and Compensated biplots. Every pair retains the same frozen events, axes, transform, density scale, and edge piling in both panels.") }),
          /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions gl-comp-comparison-export-formats", children: [
            /* @__PURE__ */ e.jsx("legend", { children: m("Format") }),
            Mr.map((A) => /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  name: "compensation-comparison-export-format",
                  value: A.format,
                  checked: g === A.format,
                  disabled: E,
                  onChange: () => b(A.format)
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: A.title }),
                /* @__PURE__ */ e.jsx("small", { children: m(A.detail) })
              ] })
            ] }, A.format))
          ] }),
          /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary gl-comp-comparison-export-summary", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: m("File") }),
              /* @__PURE__ */ e.jsx("dd", { title: F, children: F })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: m("Scope") }),
              /* @__PURE__ */ e.jsx("dd", { children: m(l === 1 ? "{count} filtered pair · both assays" : "{count} filtered pairs · both assays", { count: l.toLocaleString() }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: m("Pages") }),
              /* @__PURE__ */ e.jsx("dd", { children: m(S === 1 ? "{count} A4 landscape page · six pairs per page" : "{count} A4 landscape pages · six pairs per page", { count: S.toLocaleString() }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: m("Population") }),
              /* @__PURE__ */ e.jsx("dd", { title: i, children: i })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: m("Filter") }),
              /* @__PURE__ */ e.jsx("dd", { title: r, children: r })
            ] })
          ] }),
          x && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-comparison-export-progress", role: "status", "aria-live": "polite", children: [
            /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, x.totalPages), value: x.completedPages }),
            /* @__PURE__ */ e.jsx("span", { children: m("Rendering page {current} of {total}", { current: Math.min(x.completedPages + 1, x.totalPages), total: x.totalPages }) })
          ] }),
          I && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: m(I) }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: E, onClick: h, children: m("Cancel") }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: E || S === 0, onClick: () => void k(), children: E ? m("Rendering…") : m("Download {format}", { format: g.toUpperCase() }) })
          ] })
        ]
      }
    )
  ] });
}
function yi(t) {
  return `"${t.replaceAll('"', '""')}"`;
}
function ji(t, i) {
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
function Er(t) {
  const i = ji(t.sourceChannels, "source"), r = ji(t.receiverChannels, "receiver");
  if (!Array.isArray(t.matrix) || t.matrix.length !== i.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const l = [
    ["channel", ...r].map(yi).join(",")
  ];
  return t.matrix.forEach((o, h) => {
    if (!Array.isArray(o) || o.length !== r.length)
      throw new Error(
        `Spill matrix row ${h + 1} does not match the receiver channel axis.`
      );
    const m = o.map((g, b) => {
      if (typeof g != "number" || !Number.isFinite(g))
        throw new Error(
          `Spill coefficient ${i[h]} → ${r[b]} is not finite.`
        );
      return Object.is(g, -0) ? "0" : String(g);
    });
    l.push([yi(i[h]), ...m].join(","));
  }), `${l.join(`
`)}
`;
}
function Ar(t, i = "installed") {
  return `${t.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${i === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function Tr(t) {
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
function Ui({
  profileLabel: t,
  installedLabel: i,
  installedMatrix: r,
  workingMatrix: l = null,
  pendingEditCount: o = 0,
  onClose: h
}) {
  const { t: m } = Ie(), [g, b] = v.useState("installed"), [x, j] = v.useState(null), I = g === "working" && l ? l : r, y = Ar(t, g), S = v.useMemo(
    () => Tr(y),
    [y]
  ), E = () => {
    j(null);
    try {
      const k = Er(I), A = URL.createObjectURL(new Blob([k], { type: "text/csv;charset=utf-8" })), $ = document.createElement("a");
      $.href = A, $.download = y, document.body.appendChild($), $.click(), $.remove(), setTimeout(() => URL.revokeObjectURL(A), 1e3);
    } catch (k) {
      j(k instanceof Error ? k.message : String(k));
    }
  }, F = async () => {
    var k;
    if (!((k = navigator.clipboard) != null && k.writeText)) {
      j("Clipboard access is unavailable; select the R code below and copy it manually.");
      return;
    }
    try {
      await navigator.clipboard.writeText(S), j("R import code copied.");
    } catch {
      j("Clipboard access was denied; select the R code below and copy it manually.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-backdrop", children: [
    /* @__PURE__ */ e.jsx(Ri, { onClose: h }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "gl-modal gl-comp-export-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "comp-export-title",
        children: [
          /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-export-title", children: m("Export spill matrix") }),
          /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: m("Coefficients are exported as exact fractions, not the rounded percentages shown in the matrix. Source channels are rows and receiver channels are columns. The CSV can be imported by GateLab or base R.") }),
          l && o > 0 && /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions", children: [
            /* @__PURE__ */ e.jsx("legend", { children: m("Matrix version") }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  name: "compensation-export-version",
                  value: "installed",
                  checked: g === "installed",
                  onChange: () => b("installed")
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: i }),
                /* @__PURE__ */ e.jsx("small", { children: m("Current applied scientific record") })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  name: "compensation-export-version",
                  value: "working",
                  checked: g === "working",
                  onChange: () => b("working")
                }
              ),
              /* @__PURE__ */ e.jsxs("span", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: m("Working draft") }),
                /* @__PURE__ */ e.jsx("small", { children: m("{count} pending edits; not yet applied", { count: o }) })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: m("File") }),
              /* @__PURE__ */ e.jsx("dd", { children: y })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: m("Dimensions") }),
              /* @__PURE__ */ e.jsx("dd", { children: m("{sources} sources × {receivers} receivers", { sources: I.sourceChannels.length, receivers: I.receiverChannels.length }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: m("Units") }),
              /* @__PURE__ */ e.jsx("dd", { children: m("Fractions (2.9% is written as 0.029)") })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-export-r-head", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: m("Import in R") }),
              /* @__PURE__ */ e.jsx("span", { children: m("Run after placing the CSV in the R working directory.") })
            ] }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => void F(), children: m("Copy R code") })
          ] }),
          /* @__PURE__ */ e.jsx("pre", { className: "gl-comp-export-code", children: /* @__PURE__ */ e.jsx("code", { children: S }) }),
          x && /* @__PURE__ */ e.jsx("div", { className: x.includes("copied") ? "gl-comp-status" : "gl-comp-warning", role: "status", children: x }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: h, children: m("Cancel") }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", onClick: E, children: m("Download CSV") })
          ] })
        ]
      }
    )
  ] });
}
function $r(t, i) {
  return t.type === "embedded" ? i("Embedded · {file}", { file: t.fileName }) : t.type === "external" ? i("From {file}", { file: t.label }) : t.type === "imported" ? i("Imported · {file}", { file: t.fileName }) : t.type === "edited" ? i("Edited from {name}", { name: t.from }) : t.type === "empty" ? i("Empty") : i("Preset · {name}", { name: t.presetId });
}
function Bi({ row: t }) {
  const { t: i } = Ie();
  if (t.number === null) return null;
  const r = `M${t.number}`;
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: "gl-comp-lib-tag" + (t.primary ? " is-primary" : ""),
      title: t.primary ? i("{tag}, the primary matrix: the one in use when the data came in", { tag: r }) : r,
      children: [
        /* @__PURE__ */ e.jsx(qa, { size: 12 }),
        r
      ]
    }
  );
}
function us(t) {
  return t.number === null ? t.name : `M${t.number} ${t.name}`;
}
function Fr({
  rows: t,
  fileCount: i,
  unsavedEmbeddedFiles: r = [],
  busy: l,
  planSwitch: o,
  onUse: h,
  onRename: m,
  onDuplicate: g,
  onDuplicateAndEdit: b,
  onEditStarted: x,
  onDelete: j,
  onImport: I
}) {
  const { t: y } = Ie(), S = v.useRef(null), [E, F] = v.useState(null), [k, A] = v.useState(null), [$, P] = v.useState(null), [M, T] = v.useState(null), [K, L] = v.useState(null), [D, _] = v.useState(null), G = async (R) => {
    _(null);
    try {
      _({ text: await I(R), error: !1 });
    } catch (O) {
      _({ text: O instanceof Error ? O.message : String(O), error: !0 });
    }
  }, Z = (R) => {
    var Ue;
    const O = (Ue = R.currentTarget.files) == null ? void 0 : Ue[0];
    R.currentTarget.value = "", O && G(O);
  }, V = () => void Ki(S.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "Spillover matrix").then((R) => {
    R != null && R[0] && G(R[0]);
  }), H = () => {
    if (!E) return;
    const R = t.find(({ id: O }) => O === E.id);
    F(null), R && E.draft.trim() !== R.name && m(R, E.draft);
  }, se = async (R) => {
    _(null);
    try {
      await g(R);
    } catch (O) {
      _({ text: O instanceof Error ? O.message : String(O), error: !0 });
    }
  }, Pe = (R) => [
    {
      label: y("Use for the workspace…"),
      className: "gl-comp-lib-use",
      disabled: l || !h || R.unusable !== null || R.active && R.filesUsing === i,
      title: h ? R.unusable !== null ? y("GateLab cannot store this matrix, so only its own file uses it: {reason}", { reason: R.unusable }) : R.active && R.filesUsing === i ? y("Every file is already compensated with this matrix.") : void 0 : y("The matrix of a hosted SCE is chosen in R."),
      onClick: () => A(R)
    },
    ...R.canRename ? [{
      label: y("Rename…"),
      className: "gl-comp-lib-rename",
      disabled: l,
      onClick: () => F({ id: R.id, draft: R.name })
    }] : [],
    {
      label: y("Duplicate and edit…"),
      className: "gl-comp-lib-edit",
      disabled: l || !b || R.unusable !== null,
      title: b ? R.unusable !== null ? y("GateLab cannot store this matrix, so only its own file uses it: {reason}", { reason: R.unusable }) : y("Copy this matrix, use the copy for every file and edit its coefficients beside the plots. This matrix stays as it is.") : y("The matrix of a hosted SCE is chosen in R."),
      onClick: () => P({ row: R, copy: Ya(R.name, new Set(t.map(({ name: O }) => O))) })
    },
    { label: y("Duplicate"), className: "gl-comp-lib-duplicate", disabled: l || R.unusable !== null, onClick: () => void se(R) },
    { label: y("Export CSV…"), className: "gl-comp-lib-export", onClick: () => L(R) },
    ...R.canDelete ? [{ label: y("Delete…"), className: "gl-comp-lib-delete", danger: !0, disabled: l, onClick: () => T(R) }] : []
  ], s = t.find(({ active: R }) => R) ?? null;
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrices", "aria-labelledby": "comp-matrices-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrices-head", children: [
      /* @__PURE__ */ e.jsx("h3", { id: "comp-matrices-heading", children: y("Matrices") }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", disabled: l, onClick: V, children: y("Import CSV/TSV…") }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-mini-btn gl-comp-lib-export-active",
          disabled: !s,
          title: s ? y("Download {name}, the matrix in use, as a CSV table that Import CSV/TSV… reads back.", { name: s.name }) : y("No matrix is in use."),
          onClick: () => s && L(s),
          children: y("Export CSV…")
        }
      )
    ] }),
    /* @__PURE__ */ e.jsx(
      "input",
      {
        ref: S,
        type: "file",
        accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
        className: "gl-sr-only",
        "aria-label": y("Import a spillover matrix"),
        onChange: Z
      }
    ),
    t.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: y("No matrix yet: the files carry none, and none has been imported.") }) : /* @__PURE__ */ e.jsx("ul", { className: "gl-comp-lib-list", "aria-label": y("Matrices"), children: t.map((R) => /* @__PURE__ */ e.jsxs("li", { className: "gl-comp-lib-row" + (R.active ? " is-active" : ""), "data-matrix-id": R.id, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-lib-text", children: [
        (E == null ? void 0 : E.id) === R.id ? /* @__PURE__ */ e.jsx(
          "input",
          {
            className: "gl-comp-lib-name-input",
            "aria-label": y("Name of {name}", { name: R.name }),
            value: E.draft,
            autoFocus: !0,
            maxLength: 200,
            onChange: (O) => F({ id: R.id, draft: O.currentTarget.value }),
            onBlur: H,
            onKeyDown: (O) => {
              O.key === "Enter" ? (O.preventDefault(), H()) : O.key === "Escape" && (O.preventDefault(), O.stopPropagation(), F(null));
            }
          }
        ) : /* @__PURE__ */ e.jsxs("span", { className: "gl-comp-lib-title", children: [
          /* @__PURE__ */ e.jsx(Bi, { row: R }),
          /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-name", title: R.name, children: R.name })
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "gl-comp-lib-meta", children: [
          R.primary ? `${y("Primary")} · ` : "",
          $r(R.source, y),
          " · ",
          y("{count} channels", { count: R.channelCount }),
          R.active && R.filesUsing !== i ? ` · ${y("{used} of {files} files", { used: R.filesUsing, files: i })}` : ""
        ] }),
        R.unusable !== null && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-unusable", title: R.unusable, children: y("Only its own file can use it") })
      ] }),
      R.active && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-active", children: y("Active") }),
      /* @__PURE__ */ e.jsx(
        Ha,
        {
          label: y("{name}: matrix actions", { name: R.name }),
          items: Pe(R),
          icon: /* @__PURE__ */ e.jsx(Za, { size: 16 }),
          className: "gl-comp-lib-menu"
        }
      )
    ] }, R.id)) }),
    r.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-hint gl-comp-lib-unsaved", children: y("The workspace cannot be saved while files use their own embedded matrix beside stored matrices: {files}. Use a matrix for the workspace, set those files to Original, or delete the stored matrices no file uses.", {
      files: r.join(", ")
    }) }),
    D && /* @__PURE__ */ e.jsx("div", { className: D.error ? "gl-comp-error" : "gl-comp-status", role: D.error ? "alert" : "status", children: D.text }),
    $ && b && /* @__PURE__ */ e.jsx(
      wi,
      {
        row: $.row,
        copy: $.copy,
        plan: o($.row),
        revertible: r.length === 0,
        busy: l,
        onUse: async (R) => {
          await b(R, $.copy), _(null), x == null || x($.copy);
        },
        onClose: () => P(null)
      }
    ),
    k && h && /* @__PURE__ */ e.jsx(
      wi,
      {
        row: k,
        plan: o(k),
        revertible: r.length === 0,
        busy: l,
        onUse: async (R) => {
          await h(R), _(null);
        },
        onClose: () => A(null)
      }
    ),
    M && /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (R) => {
      R.key === "Escape" && T(null);
    }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-lib-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-matrix-delete-title", children: [
      /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-matrix-delete-title", children: y("Delete {name}?", { name: us(M) }) }),
      /* @__PURE__ */ e.jsx("p", { children: y("It leaves the workspace's list of matrices. No file is compensated with it.") }),
      /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
        /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", autoFocus: !0, onClick: () => T(null), children: y("Cancel") }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-btn gl-btn-danger",
            onClick: () => {
              j(M), T(null);
            },
            children: y("Delete")
          }
        )
      ] })
    ] }) }),
    K && /* @__PURE__ */ e.jsx(
      Ui,
      {
        profileLabel: K.name,
        installedLabel: K.name,
        installedMatrix: K.exportMatrix,
        onClose: () => L(null)
      }
    )
  ] });
}
function wi({
  row: t,
  copy: i,
  plan: r,
  revertible: l,
  busy: o,
  onUse: h,
  onClose: m
}) {
  const { t: g } = Ie(), [b, x] = v.useState(!1), [j, I] = v.useState(!1), [y, S] = v.useState(null), E = r.uncovered.length > 0, F = async () => {
    I(!0), S(null);
    try {
      await h(t), m();
    } catch (k) {
      S(k instanceof Error ? k.message : String(k));
    } finally {
      I(!1);
    }
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (k) => {
    k.key === "Escape" && !j && m();
  }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-lib-dialog gl-comp-lib-switch", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-matrix-switch-title", children: [
    /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-matrix-switch-title", children: i === void 0 ? g("Use {name} for the workspace", { name: us(t) }) : g("Duplicate and edit {name}", { name: us(t) }) }),
    i === void 0 ? /* @__PURE__ */ e.jsx("p", { children: g("Every file in the workspace ({count}) is compensated with {name}.", { count: r.fileCount, name: t.name }) }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-copy", children: g("GateLab stores a copy, {copy}, and compensates every file in the workspace ({count}) with it, so the plots show each coefficient you change. {name} stays in the list as it is; use it again to go back.", {
        copy: i,
        count: r.fileCount,
        name: t.name
      }) }),
      /* @__PURE__ */ e.jsx("p", { children: g("Edited coefficients change no file until you choose Apply revised matrix, which asks again.") })
    ] }),
    /* @__PURE__ */ e.jsx("p", { children: r.gateCount > 0 ? g("Membership is recomputed for {gates} gates and {populations} populations drawn on channels this matrix compensates.", {
      gates: r.gateCount,
      populations: r.populationCount
    }) : g("No gate is drawn on a channel this matrix compensates.") }),
    r.leavingEmbedded.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-leaving", children: g("Leaving their own embedded matrix: {files}.", { files: r.leavingEmbedded.join(", ") }) }),
    !l && !E && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-irreversible", children: g("The workspace as it stands cannot be saved, so Revert workspace cannot return to it afterwards; it returns to the last state that was saved or checkpointed.") }),
    E && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-error gl-comp-lib-uncovered", role: "alert", children: [
      /* @__PURE__ */ e.jsx("p", { children: g("These files cannot be compensated with this matrix, so it cannot be used for the workspace:") }),
      /* @__PURE__ */ e.jsx("ul", { children: r.uncovered.map((k) => /* @__PURE__ */ e.jsx("li", { children: k.wrongInstrument ? g("{file}: not a file of this instrument kind", { file: k.name }) : k.missingChannels.length > 0 ? g("{file}: lacks {channels}", { file: k.name, channels: k.missingChannels.join(", ") }) : g("{file}: {reason}", { file: k.name, reason: k.message ?? "" }) }, k.name)) }),
      /* @__PURE__ */ e.jsx("p", { children: g("Remove these files from the workspace, or choose a matrix that covers their channels.") })
    ] }),
    !E && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "checkbox",
          checked: b,
          disabled: j,
          onChange: (k) => x(k.currentTarget.checked)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { children: g("I agree that gate membership may change.") })
    ] }),
    y && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: y }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: j, onClick: m, children: g("Cancel") }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-btn",
          disabled: E || !b || j || o,
          onClick: () => void F(),
          children: g(j ? "Compensating…" : i === void 0 ? "Use for the workspace" : "Make the copy and edit")
        }
      )
    ] })
  ] }) });
}
function Fn({
  value: t,
  onValueChange: i,
  scrubStep: r,
  className: l = "",
  disabled: o,
  min: h,
  max: m,
  step: g,
  title: b,
  onPointerDown: x,
  onPointerMove: j,
  onPointerUp: I,
  onPointerCancel: y,
  onLostPointerCapture: S,
  ...E
}) {
  const { t: F } = Ie(), k = v.useRef(null), [A, $] = v.useState(!1), P = (M) => {
    var T, K, L;
    ((T = k.current) == null ? void 0 : T.pointerId) === M.pointerId && (k.current = null, $(!1), (L = (K = M.currentTarget).hasPointerCapture) != null && L.call(K, M.pointerId) && M.currentTarget.releasePointerCapture(M.pointerId));
  };
  return /* @__PURE__ */ e.jsx(
    "input",
    {
      ...E,
      type: "number",
      className: `gl-scrubbable-number${A ? " is-scrubbing" : ""}${l ? ` ${l}` : ""}`,
      value: t,
      disabled: o,
      min: h,
      max: m,
      step: g,
      title: b ?? F("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (M) => i(M.currentTarget.value),
      onPointerDown: (M) => {
        var G, Z;
        if (x == null || x(M), M.defaultPrevented || o || M.button !== 0) return;
        const T = M.currentTarget.getBoundingClientRect();
        if (M.clientX >= T.right - 18) return;
        const K = Number(t), L = (r ?? Number(g)) || 0.1;
        if (!Number.isFinite(K) || !(L > 0)) return;
        const D = String(L), _ = D.includes("e-") ? Number(D.split("e-")[1]) : D.includes(".") ? D.split(".")[1].length : 0;
        k.current = {
          pointerId: M.pointerId,
          startY: M.clientY,
          startValue: K,
          step: L,
          decimals: _,
          lastSteps: 0
        }, (Z = (G = M.currentTarget).setPointerCapture) == null || Z.call(G, M.pointerId);
      },
      onPointerMove: (M) => {
        j == null || j(M);
        const T = k.current;
        if (!T || T.pointerId !== M.pointerId) return;
        const K = T.startY - M.clientY;
        if (Math.abs(K) < 3) return;
        const L = K > 0 ? Math.floor(K / 4) : Math.ceil(K / 4);
        if (L === T.lastSteps) return;
        let D = T.startValue + L * T.step;
        const _ = h === void 0 ? Number.NEGATIVE_INFINITY : Number(h), G = m === void 0 ? Number.POSITIVE_INFINITY : Number(m);
        Number.isFinite(_) && (D = Math.max(_, D)), Number.isFinite(G) && (D = Math.min(G, D)), k.current = { ...T, lastSteps: L }, $(!0), i(D.toFixed(Math.min(10, T.decimals))), M.preventDefault();
      },
      onPointerUp: (M) => {
        I == null || I(M), P(M);
      },
      onPointerCancel: (M) => {
        y == null || y(M), P(M);
      },
      onLostPointerCapture: (M) => {
        var T;
        S == null || S(M), ((T = k.current) == null ? void 0 : T.pointerId) === M.pointerId && (k.current = null, $(!1));
      }
    }
  );
}
const fs = v.createContext(ms), xs = v.createContext(0.85), vs = v.createContext(1), Ni = "", pt = [];
let es = !1;
function Ir(t) {
  const i = { cancelled: !1, run: t };
  pt.push(i);
  const r = () => {
    if (es) return;
    es = !0;
    const l = () => {
      es = !1;
      let h = pt.shift();
      for (; h != null && h.cancelled; ) h = pt.shift();
      h == null || h.run(), pt.length > 0 && r();
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
  minimumSize: h = 210,
  maximumSize: m = 420,
  densityColorCeiling: g,
  densitySmoothing: b,
  showZeroPile: x = !0
}) {
  const { t: j } = Ie(), I = v.useContext(fs), y = v.useContext(xs), S = v.useContext(vs), E = v.useRef(null);
  v.useEffect(() => {
    const A = E.current;
    if (!A) return;
    let $ = null, P = 0;
    const M = () => {
      var G;
      $ = null;
      const L = ((G = A.parentElement) == null ? void 0 : G.clientWidth) ?? 230, D = Math.max(h, Math.min(m, Math.floor(L)));
      if (D === P && A.childElementCount > 0) return;
      P = D;
      const _ = ps(b, D);
      bt(A, {
        title: t,
        panel: i,
        preview: r,
        sourceLabel: l,
        receiverLabel: o,
        size: D,
        densityColorCeiling: g ?? gs(
          r,
          0.95,
          _,
          I
        ),
        densitySmoothingRadius: _,
        densityColorPower: I,
        pointAlpha: y,
        pointSize: S
      });
    }, T = () => {
      $ !== null && cancelAnimationFrame($), $ = requestAnimationFrame(M);
    };
    T();
    const K = typeof ResizeObserver > "u" ? null : new ResizeObserver(T);
    return K == null || K.observe(A.parentElement ?? A), () => {
      K == null || K.disconnect(), $ !== null && cancelAnimationFrame($);
    };
  }, [g, I, b, m, h, i, y, S, r, o, l, t]);
  const F = (A) => r.eventCount > 0 ? `${(A / r.eventCount * 100).toFixed(1)}%` : "0.0%", k = i.zeroPile.source > 0 || i.zeroPile.receiver > 0 || i.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": j("{title} density biplot; {source} on x, {receiver} on y", {
    title: t,
    source: l,
    receiver: o
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: E, className: "gl-comp-biplot-surface" }),
    x && k && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: j("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: F(i.zeroPile.source),
      receiver: F(i.zeroPile.receiver),
      both: F(i.zeroPile.corner)
    }) })
  ] });
}
function Pr({
  title: t,
  preview: i,
  sourceLabel: r,
  receiverLabel: l,
  minimumSize: o,
  maximumSize: h,
  densityColorCeiling: m,
  densitySmoothing: g
}) {
  const { t: b } = Ie(), x = v.useContext(fs), j = v.useContext(xs), I = v.useContext(vs), y = v.useRef(null);
  return v.useEffect(() => {
    const S = y.current;
    if (!S) return;
    let E = null, F = 0;
    const k = () => {
      var Z;
      E = null;
      const P = ((Z = S.parentElement) == null ? void 0 : Z.clientWidth) ?? o, M = Math.max(o, Math.min(h, Math.floor(P)));
      if (M === F && S.dataset.cacheReady === "true") return;
      F = M, S.dataset.cacheReady = "false";
      const T = ps(g, M), K = m ?? gs(
        i,
        0.95,
        T,
        x
      );
      bt(S, {
        title: t,
        panel: i.original,
        preview: i,
        sourceLabel: r,
        receiverLabel: l,
        size: M,
        densityColorCeiling: K,
        densitySmoothingRadius: T,
        densityColorPower: x,
        pointAlpha: j,
        pointSize: I,
        canvasScale: 2
      });
      const L = S.querySelector("canvas"), D = S.querySelector("svg"), _ = document.createElement("div");
      bt(_, {
        title: t,
        panel: i.compensated,
        preview: i,
        sourceLabel: r,
        receiverLabel: l,
        size: M,
        densityColorCeiling: K,
        densitySmoothingRadius: T,
        densityColorPower: x,
        pointAlpha: j,
        pointSize: I,
        canvasScale: 2
      });
      const G = _.querySelector("canvas");
      !L || !G || !D || (L.classList.add("gl-comp-cached-canvas", "is-original"), L.dataset.assayLayer = "original", G.classList.add("gl-comp-cached-canvas", "is-compensated"), G.dataset.assayLayer = "compensated", S.insertBefore(G, D), S.dataset.cacheReady = "true");
    }, A = () => {
      E == null || E(), E = Ir(k);
    };
    A();
    const $ = typeof ResizeObserver > "u" ? null : new ResizeObserver(A);
    return $ == null || $.observe(S.parentElement ?? S), () => {
      $ == null || $.disconnect(), E == null || E();
    };
  }, [m, x, g, h, o, j, I, i, l, r, t]), /* @__PURE__ */ e.jsx(
    "figure",
    {
      className: "gl-comp-biplot",
      "aria-label": b("Cached uncompensated and compensated density biplot; {source} on x, {receiver} on y", {
        source: r,
        receiver: l
      }),
      children: /* @__PURE__ */ e.jsx(
        "div",
        {
          ref: y,
          className: "gl-comp-biplot-surface gl-comp-cached-biplot",
          "data-cache-mode": "dual-canvas"
        }
      )
    }
  );
}
function Ci({
  preview: t,
  sourceLabel: i,
  receiverLabel: r,
  kind: l,
  densitySmoothing: o,
  compact: h = !1,
  compensatedTitle: m = "Compensated"
}) {
  const { t: g } = Ie(), b = t.eventCount > 0 ? t.original.zeroPile.receiver / t.eventCount * 100 : 0, x = t.eventCount > 0 ? t.compensated.zeroPile.receiver / t.eventCount * 100 : 0, j = x - b;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${h ? " is-compact" : ""}`, children: [
    !h && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: g("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: t.eventCount.toLocaleString(),
      sampled: t.totalEvents > t.eventCount ? g(" sampled from {total}", { total: t.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        yt,
        {
          title: g("Original"),
          panel: t.original,
          preview: t,
          sourceLabel: i,
          receiverLabel: r,
          densitySmoothing: o,
          showZeroPile: !h
        }
      ),
      /* @__PURE__ */ e.jsx(
        yt,
        {
          title: m,
          panel: t.compensated,
          preview: t,
          sourceLabel: i,
          receiverLabel: r,
          densitySmoothing: o,
          showZeroPile: !h
        }
      )
    ] }),
    !h && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-diagnostic-note", children: l === "cytof" ? /* @__PURE__ */ e.jsx(e.Fragment, { children: g("Receiver events at exact zero: {original}% → {compensated}% ({delta} percentage points). A rise can be consistent with NNLS over-subtraction, while a residual source-associated rise can be consistent with under-compensation. Neither is a verdict without a suitable negative/control population.", {
      original: b.toFixed(1),
      compensated: x.toFixed(1),
      delta: `${j >= 0 ? "+" : ""}${j.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: g("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: m
    }) }) }),
    !h && (t.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": g("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: g("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: g("{value} MAD", { value: re(t.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: g("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: re(t.evidence.residualSlope ?? 0, 4) })
      ] }),
      t.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: g("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: g("{value} MAD", { value: re(t.evidence.upperTailExcessMad, 3) }) })
      ] }),
      t.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: g("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: g("{value} MAD", { value: re(t.evidence.upperTailSlopeDeltaMad, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: g("Evidence groups") }),
        /* @__PURE__ */ e.jsx("dd", { children: g("{high} source-high · {low} source-low", {
          high: t.evidence.sourceHighEvents.toLocaleString(),
          low: t.evidence.sourceLowEvents.toLocaleString()
        }) })
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-evidence-insufficient", children: g("Residual screening needs distinct source-low/source-high groups and enough receiver-negative events; this pair remains available for visual review.") }))
  ] });
}
function Rr({
  matrixView: t,
  sourceChannels: i,
  receiverChannels: r,
  selectedSourceIndex: l,
  selectedReceiverIndex: o,
  stagedCoefficients: h,
  maximumAbsoluteOffDiagonal: m,
  onSelect: g
}) {
  const { t: b } = Ie(), x = 6, j = 74, I = 44, y = 10, S = r.length * x, E = i.length * x, F = j + S + j, k = I + E + y, A = v.useMemo(() => {
    const P = [];
    for (let M = 0; M < t.matrix.length; M++)
      for (let T = 0; T < t.matrix[M].length; T++) {
        const K = t.sourceAxisKeys[M], L = t.receiverAxisKeys[T], D = `${K}${Ni}${L}`, _ = h[D] ?? t.matrix[M][T], G = K === L;
        if (!G && (!Number.isFinite(_) || _ === 0)) continue;
        const Z = m > 0 && Number.isFinite(_) ? Math.min(1, Math.abs(_) / m) : 0, V = Z > 0 ? 0.12 + 0.82 * Math.sqrt(Z) : 0;
        P.push({
          sourceIndex: M,
          receiverIndex: T,
          pairKey: D,
          value: _,
          diagonal: G,
          fill: G ? "#cfd4db" : Number.isFinite(_) ? _ < 0 ? `rgba(47,128,237,${V})` : `rgba(211,47,47,${V})` : "#ae3e3e"
        });
      }
    return P;
  }, [t, m, h]), $ = (P) => {
    const M = P.currentTarget.getBoundingClientRect();
    if (!(M.width > 0) || !(M.height > 0)) return;
    const T = (P.clientX - M.left) * F / M.width, K = (P.clientY - M.top) * k / M.height, L = Math.floor((T - j) / x), D = Math.floor((K - I) / x);
    D < 0 || D >= i.length || L < 0 || L >= r.length || t.sourceAxisKeys[D] === t.receiverAxisKeys[L] || g(`${t.sourceAxisKeys[D]}${Ni}${t.receiverAxisKeys[L]}`);
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-mini-matrix", "aria-labelledby": "comp-mini-matrix-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-mini-matrix-head", children: [
      /* @__PURE__ */ e.jsx("strong", { id: "comp-mini-matrix-heading", children: b("Matrix map") }),
      /* @__PURE__ */ e.jsx("span", { children: b("Source ↓ · receiver → · click a cell") })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        width: F,
        height: k,
        viewBox: `0 0 ${F} ${k}`,
        role: "img",
        "aria-label": b("Mini compensation matrix with {sources} source rows and {receivers} receiver columns", {
          sources: i.length,
          receivers: r.length
        }),
        onPointerDown: $,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: j, y: I, width: S, height: E, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          r.map((P, M) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: j + (M + 0.55) * x,
              y: I - 3,
              transform: `rotate(-58 ${j + (M + 0.55) * x} ${I - 3})`,
              textAnchor: "start",
              className: M === o ? "is-selected" : void 0,
              children: P.pnn
            },
            P.key
          )),
          i.map((P, M) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: j - 3,
              y: I + (M + 0.72) * x,
              textAnchor: "end",
              className: M === l ? "is-selected" : void 0,
              children: P.pnn
            },
            P.key
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: j,
              y: I + l * x,
              width: S,
              height: x,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: j + o * x,
              y: I,
              width: x,
              height: E,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          A.map((P) => /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: j + P.receiverIndex * x,
              y: I + P.sourceIndex * x,
              width: x,
              height: x,
              fill: P.fill,
              pointerEvents: "none",
              children: /* @__PURE__ */ e.jsx("title", { children: P.diagonal ? b("{channel} · self", { channel: i[P.sourceIndex].combined }) : `${i[P.sourceIndex].combined} → ${r[P.receiverIndex].combined} · ${rn(P.value)}` })
            },
            P.pairKey
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: j + o * x,
              y: I + l * x,
              width: x,
              height: x,
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
function Kr({
  dataset: t,
  pair: i,
  plotSize: r,
  densitySmoothing: l,
  flagged: o,
  selected: h,
  onSelect: m,
  onFlag: g
}) {
  const { t: b } = Ie(), x = v.useRef(null), [j, I] = v.useState(() => typeof IntersectionObserver > "u");
  v.useEffect(() => {
    const E = x.current;
    if (!E || typeof IntersectionObserver > "u") {
      I(!0);
      return;
    }
    const F = new IntersectionObserver(
      (k) => I(k.some((A) => A.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return F.observe(E), () => F.disconnect();
  }, []);
  const y = v.useMemo(
    () => j ? Di(t, i.source.key, i.receiver.key) : null,
    [t, i.receiver.key, i.source.key, j]
  ), S = y != null && y.ready ? y.preview : null;
  return /* @__PURE__ */ e.jsxs(
    "article",
    {
      ref: x,
      className: `gl-comp-global-tile${h ? " is-selected" : ""}${o ? " is-flagged" : ""}`,
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
              onClick: m,
              title: `${i.source.combined} → ${i.receiver.combined}`,
              "aria-label": b("Open details for {source} to {receiver}", {
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
          /* @__PURE__ */ e.jsx("label", { title: b("Keep this pair in Flagged"), children: /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: o,
              "aria-label": b("Flag global inspector pair {source} to {receiver} for follow-up", {
                source: i.source.label,
                receiver: i.receiver.label
              }),
              onChange: (E) => g(E.currentTarget.checked)
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-comp-global-plot-button",
            onClick: m,
            title: b("{source} → {receiver} · {interaction}matrix {coefficient}%", {
              source: i.source.combined,
              receiver: i.receiver.combined,
              interaction: i.interaction && i.interaction !== "other" ? `${i.interaction} · ` : "",
              coefficient: (i.coefficient * 100).toFixed(1)
            }),
            "aria-label": b("Open details for {source} to {receiver}; matrix coefficient {coefficient}%", {
              source: i.source.label,
              receiver: i.receiver.label,
              coefficient: (i.coefficient * 100).toFixed(1)
            }),
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: r, height: r }, children: S ? /* @__PURE__ */ e.jsx(
              Pr,
              {
                title: "",
                preview: S,
                sourceLabel: i.source.label,
                receiverLabel: i.receiver.label,
                minimumSize: r,
                maximumSize: r,
                densitySmoothing: l
              }
            ) : y && !y.ready ? /* @__PURE__ */ e.jsx("span", { children: y.reason }) : /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" }) })
          }
        )
      ]
    }
  );
}
function Lr({
  stateKey: t,
  header: i,
  children: r
}) {
  const { t: l } = Ie(), [o, h] = ve(
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
              onClick: () => h((m) => m === "original" ? "compensated" : "original"),
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
const Or = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', ns = 58 * Math.PI / 180, Si = 54, Dr = 16, zr = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, _r = [
  { id: "matrices", label: "Matrices" },
  { id: "review", label: "Review" },
  { id: "display", label: "Display" }
];
function ts({ label: t, text: i }) {
  return /* @__PURE__ */ e.jsx("span", { className: "gl-hint-icon gl-comp-pane-hint", role: "img", "aria-label": t, title: i, children: "?" });
}
function Ur(t) {
  if (!t) return ["its channels do not map to the file"];
  if (t.ok) return ["not a valid spillover matrix"];
  const i = new Set(t.errors.map(({ code: l }) => l)), r = [];
  return i.has("negative-coefficient") && r.push("negative coefficients"), i.has("non-unit-diagonal") && r.push("diagonal not 1"), r.length > 0 ? r : ["not a valid spillover matrix"];
}
const Br = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], _e = "", Mi = 2500, ki = 400, Vr = 2500, Ei = 15e3, Ai = [2500, 5e3, 15e3, 5e4], Wr = 24, Ti = 4, $i = 624, Gr = Object.freeze({});
function Fi(t) {
  if (!Number.isFinite(t)) return String(t);
  const i = t * 100;
  if (i === 0) return "0.0";
  const r = Math.abs(i), l = r >= 1 ? 1 : r >= 0.1 ? 2 : 3;
  return i.toFixed(l);
}
function ss(t) {
  return t.replace(/(?: · (?:edited|revised))+$/u, "");
}
function jt(t, i) {
  const r = t.index(i), l = r === void 0 ? void 0 : t.channels[r], o = (l == null ? void 0 : l.pnn) ?? i, h = t.labelForKey(i), m = ((l == null ? void 0 : l.label) ?? "").trim() || ((l == null ? void 0 : l.marker) ?? "").trim(), g = m && m !== o ? `${m} (${o})` : o;
  return { key: i, pnn: o, label: h, combined: g };
}
function is(t, i) {
  const r = t.channels.find((l) => l.pnn === i);
  return jt(t, (r == null ? void 0 : r.key) ?? i);
}
function qr(t, i) {
  return t === "cytof-spillover" && i === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function Hr(t) {
  return t.replaceAll("-", " ");
}
function hs(t) {
  if (t.length === 0) return 0;
  t.sort((r, l) => r - l);
  const i = Math.floor(t.length / 2);
  return t.length % 2 === 0 ? (t[i - 1] + t[i]) / 2 : t[i];
}
function Zr(t) {
  return Object.fromEntries(t.scientific.solverSettings.map(({ key: i, value: r }) => [i, r]));
}
function Yr(t, i) {
  const r = Object.freeze({ ...t.scientific.matrix, matrix: i }), l = Zr(t);
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
function Ii(t, i, r, l) {
  const o = t.scientific.matrix.sourceChannels.indexOf(i), h = t.scientific.matrix.receiverChannels.indexOf(r);
  if (o < 0 || h < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(t.scientific.matrix.matrix.map(
    (m, g) => Object.freeze(m.map((b, x) => g === o && x === h ? l : b))
  ));
}
function Xr(t, i, r) {
  var m;
  if (!t) return null;
  const l = t.scientific.matrix.sourceChannels.indexOf(i), o = t.scientific.matrix.receiverChannels.indexOf(r);
  if (l < 0 || o < 0) return null;
  const h = (m = t.scientific.matrix.matrix[l]) == null ? void 0 : m[o];
  return Number.isFinite(h) ? h : null;
}
function Pi(t, i, r) {
  const l = Math.max(Math.abs(t), Math.abs(i), 1e-3);
  return Object.freeze(r === "cytof" ? { lower: 0, upper: Math.max(t + l, l * 2) } : { lower: t - l, upper: t + l });
}
function Jr(t, i) {
  const r = (i - t) / 3;
  return Object.freeze([t, t + r, t + 2 * r, i]);
}
function Qr(t, i) {
  return t.length === i.length && t.every((r, l) => {
    var o;
    return r.length === ((o = i[l]) == null ? void 0 : o.length) && r.every((h, m) => h === i[l][m]);
  });
}
function el(t, i) {
  if (t.compensatedLayerStatus().state !== "ready" || i.length === 0 || t.fcs.nEvents === 0) return null;
  const l = i.flatMap((I) => {
    const y = t.channels.findIndex((S) => S.pnn === I);
    return y < 0 ? [] : [y];
  });
  if (l.length === 0) return null;
  const o = Math.min(2048, t.fcs.nEvents), h = [];
  let m = 0, g = 0, b = 0, x = "", j = -1;
  for (const I of l) {
    const y = t.originalColumnData(I), S = t.compensatedColumnData(I), E = [];
    for (let k = 0; k < o; k++) {
      const A = o === 1 ? 0 : Math.floor(k * (t.fcs.nEvents - 1) / (o - 1)), $ = y[A], P = S[A], M = Math.abs(P - $);
      E.push(M), h.push(M), M > Math.max(1e-6, Math.abs($) * 1e-6) && m++, $ < 0 && P === 0 && b++, g = Math.max(g, M);
    }
    const F = hs(E);
    F > j && (j = F, x = jt(t, t.channels[I].key).combined);
  }
  return {
    previewEvents: o,
    comparedValues: h.length,
    changedValues: m,
    medianAbsoluteDelta: hs(h),
    maxAbsoluteDelta: g,
    zeroedNegativeValues: b,
    mostChangedChannel: x,
    mostChangedChannelMedianDelta: Math.max(0, j)
  };
}
function nl(t, i) {
  return t.origin.type === "uploaded" ? t.origin.fileName : t.origin.type === "embedded-fcs" ? `${t.origin.fileName} · ${i("embedded FCS")}` : t.origin.type === "manual" ? i("set by hand, from an empty matrix") : `${t.origin.presetId} · ${i("bundled preset")} ${t.origin.presetVersion}`;
}
function tl(t) {
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
  }, r = as(
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
function sl({
  sample: t,
  sampleName: i = "sample.fcs",
  hostedCompensationMatrix: r = null,
  compensationOn: l,
  onApplyProfile: o,
  otherEmbeddedLayerFiles: h = [],
  onRemoveProfile: m,
  existingHostAssays: g = [],
  onAdoptExistingAssay: b,
  onCancelApply: x,
  hasExistingGates: j = !1,
  applyStatus: I = null,
  installedProfile: y = null,
  applyTargetCount: S = 1,
  applyTargetEventCount: E,
  applyWorkerCount: F,
  applyWorkerLimit: k,
  onApplyWorkerCountChange: A,
  installedBaselineProfile: $ = null,
  reviewPopulations: P = [],
  reviewPopulationMasks: M = Gr,
  onPreviewCompensationCandidate: T,
  onSolveCompensationSweep: K,
  onCancelCompensationSweep: L,
  onSuspendBackgroundWork: D,
  visible: _ = !0,
  stateKey: G,
  densityColorPower: Z = ms,
  channelLabelMode: V = "marker",
  onDensityColorPowerChange: H = () => {
  },
  matrices: se,
  onApplyRevision: Pe
}) {
  var ni, ti;
  const { t: s } = Ie(), R = Xa("compensation"), O = t.compensatedLayerStatus(), Ue = O.state === "missing" ? null : O.metadata, W = (Ue == null ? void 0 : Ue.runtimeIdentity) === "profile" ? Ue : null, C = (y == null ? void 0 : y.profileId) === (W == null ? void 0 : W.profileId) ? y : null, le = !W && t.instrument === "flow" ? t.spillover : null, Ne = (r == null ? void 0 : r.kind) === "flow-spillover" ? r : null, wt = v.useMemo(
    () => tl(r),
    [r]
  ), [Re, Ce] = ve(
    `compensation.${G}.selectedPair`,
    null
  ), [Nt, ze] = v.useState(null), [Zn, bs] = ve(
    `compensation.${G}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [yn, ys] = ve(
    "compensation.inspectorWidth",
    $i
  ), [Ee, In] = ve(
    `compensation.${G}.workspaceView`,
    "matrix"
  ), [Be, Yn] = ve(
    `compensation.${G}.globalPairFilter`,
    "relevant"
  ), [Vi, Wi] = ve(
    `compensation.${G}.globalLayout`,
    null
  ), [Gi, qi] = ve(
    "compensation.globalPlotSize.v5",
    160
  ), [Hi, Zi] = ve(
    "compensation.densitySmoothing.v3",
    6
  ), [Yi, Xi] = ve(
    "compensation.pointAlpha.v1",
    0.85
  ), [Ji, Qi] = ve(
    "compensation.pointSize.v1",
    1
  ), [js, ea] = ve(
    "compensation.paneSection.v1",
    "matrices"
  ), [Ct, na] = ve(
    "compensation.pairPreviewEventLimit.v1",
    Ei
  ), [Pn, ws] = v.useState(""), [Rn, St] = v.useState(!1), [Mt, Ns] = v.useState(null), [jn, kt] = ve(
    `compensation.${G}.reviewPopulation`,
    "all"
  ), [Xn, ta] = ve(
    `compensation.${G}.flaggedPairs`,
    []
  ), [He, sa] = ve(
    `compensation.${G}.evidenceMode`,
    "biological"
  ), [ia, aa] = ve(
    `compensation.${G}.sweepBounds`,
    {}
  ), [Et, At] = ve(
    `compensation.${G}.sweepWorkers`,
    2
  ), [Ke, Cs] = v.useState(""), [Ae, Tt] = v.useState(""), [ra, $t] = v.useState(0), [J, Jn] = v.useState({}), [la, ln] = v.useState({}), [Ze, on] = v.useState({ state: "idle" }), [oa, Qe] = v.useState({}), [ca, cn] = v.useState({}), [Se, wn] = v.useState(null), [da, Kn] = v.useState(null), [pe, Nn] = v.useState(null), [Ss, je] = v.useState(null), [Qn, Ft] = v.useState(""), [ua, Ms] = v.useState(!1), [ha, ks] = v.useState(!1), Le = v.useRef(0), Cn = v.useRef(0), [Es, Q] = v.useState(null), [It, Pt] = v.useState(!1), [As, ge] = v.useState(!1), [ee, et] = v.useState(
    () => wt.draft
  ), [Ln, dn] = v.useState(
    () => {
      var c;
      const n = ((c = wt.draft) == null ? void 0 : c.matrix.receiverChannels) ?? [], a = /* @__PURE__ */ new Map();
      for (const u of t.channels) {
        const p = u.pnn.trim().normalize("NFC");
        a.set(p, (a.get(p) ?? 0) + 1);
      }
      return new Set(n.filter((u) => a.get(u) === 1));
    }
  ), [Ts, en] = v.useState(
    () => wt.error
  ), [Te, Ye] = v.useState(!1), [nt, $s] = v.useState(!1), [tt, Fs] = v.useState(
    () => {
      var n;
      return ((n = g[0]) == null ? void 0 : n.id) ?? "";
    }
  ), [Rt, st] = v.useState(!1), [it, we] = v.useState(null), [ma, Ve] = v.useState(!1), [pa, Xe] = v.useState(null), Oe = v.useRef(!1), Is = v.useRef(null), Ps = v.useRef(null), Sn = v.useRef(null), [at, ga] = v.useState(null), [Kt, Rs] = v.useState(null);
  v.useEffect(() => {
    if (!at || typeof ResizeObserver > "u") {
      Rs(null);
      return;
    }
    const n = () => {
      const { width: c, height: u } = at.getBoundingClientRect();
      Rs((p) => {
        if (c <= 0 || u <= 0) return null;
        const f = { width: Math.round(c), height: Math.round(u) };
        return p && p.width === f.width && p.height === f.height ? p : f;
      });
    };
    n();
    const a = new ResizeObserver(n);
    return a.observe(at), () => a.disconnect();
  }, [at]);
  const q = ma || I !== null, nn = Math.max(0, Math.floor(S)), fa = Math.max(
    0,
    Math.floor(E ?? t.fcs.nEvents)
  ), tn = g.find(
    ({ id: n }) => n === tt
  ) ?? g[0] ?? null;
  v.useEffect(() => {
    var n;
    tt && g.some(({ id: a }) => a === tt) || (Fs(((n = g[0]) == null ? void 0 : n.id) ?? ""), st(!1));
  }, [g, tt]);
  const ce = I ?? (it ? {
    phase: "applying",
    profileName: pa ?? (ee == null ? void 0 : ee.fileName) ?? "Compensation",
    fraction: it.fraction,
    processedEvents: it.processedEvents,
    totalEvents: it.totalEvents
  } : null);
  v.useEffect(() => {
    _ || (Cn.current++, Le.current++, on({ state: "idle" }), Nn(null), wn(null), D == null || D());
  }, [D, _]);
  const Lt = v.useMemo(
    () => t.channels.map(({ pnn: n, columnIndex: a }) => ({ pnn: n, columnIndex: a })),
    [t]
  ), fe = v.useMemo(() => {
    if (!le) return null;
    const n = le.channels.map((p) => {
      const f = t.index(p);
      return f === void 0 ? null : t.channels[f].pnn;
    });
    if (n.some((p) => p === null))
      return {
        validation: null,
        error: "The embedded matrix could not be mapped back to exact FCS channel identities.",
        keyword: void 0,
        roundedCoefficients: 0
      };
    const { validation: a, roundedCoefficients: c } = Ja({
      sourceChannels: n,
      receiverChannels: n,
      matrix: le.matrix
    }), u = ["$SPILLOVER", "$SPILL", "SPILL"].find((p) => typeof t.fcs.keywords[p] == "string");
    return {
      validation: a,
      error: a.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${a.errors.map(({ message: p }) => p).join(" ")}`,
      keyword: u,
      roundedCoefficients: c
    };
  }, [t, le]), ne = jn === "all" ? null : P.find(({ id: n }) => n === jn) ?? null, xe = ne ? M[ne.id] ?? null : null, de = xe ? (ne == null ? void 0 : ne.eventCount) ?? 0 : t.fcs.nEvents, rt = Ct === "all" ? "all" : Ai.includes(Number(Ct)) ? Number(Ct) : Ei, On = v.useMemo(
    () => fn(
      t.fcs.nEvents,
      rt === "all" ? Math.max(1, t.fcs.nEvents) : rt,
      xe
    ),
    [rt, de, xe, t]
  ), Dn = v.useMemo(
    () => fn(t.fcs.nEvents, 2048, xe),
    [xe, t]
  ), Ot = v.useMemo(
    () => fn(
      t.fcs.nEvents,
      Vr,
      xe
    ),
    [xe, t]
  );
  v.useEffect(() => {
    jn !== "all" && !P.some(({ id: n }) => n === jn) && kt("all");
  }, [jn, P, kt]), v.useEffect(() => {
    Le.current++, L == null || L(), Qe({}), cn({}), wn(null), Nn(null), je(null);
  }, [jn, xe, L]);
  const me = v.useMemo(() => ee ? Qa({
    kind: "cytof-spillover",
    matrix: ee.matrix,
    sampleChannels: Lt,
    includedChannels: Array.from(Ln)
  }) : null, [ee, Ln, Lt, V]), d = v.useMemo(() => {
    var a;
    if (le) {
      const c = t.spilloverOrigin, u = c.kind === "external" ? c : null;
      return {
        sourceAxisKeys: le.channels,
        receiverAxisKeys: le.channels,
        sourceChannels: le.channels.map((p) => jt(t, p)),
        receiverChannels: le.channels.map((p) => jt(t, p)),
        matrix: le.matrix,
        kind: "flow",
        title: Ne ? "SCE spillover matrix" : u ? `Compensation matrix from ${u.label}` : "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: u ? "This FCS carries no spillover matrix of its own; these coefficients came from the imported FlowJo workspace and are applied unchanged." + (u.droppedChannels.length ? ` ${u.droppedChannels.length} of its parameter(s) are not in this file (${u.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "") : "Applying the embedded matrix leaves its coefficients unchanged." + (c.kind === "fcs" && ((a = c.droppedChannels) != null && a.length) ? ` ${c.droppedChannels.length} of its parameter(s) are not among this file's channels (${c.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "")
      };
    }
    if (!C || !W) return null;
    const n = C.scientific.kind === "cytof-spillover" ? dr(C.scientific.matrix) : C.scientific.matrix;
    return n.matrix.length !== n.sourceChannels.length || n.matrix.some((c) => !c || c.length !== n.receiverChannels.length) ? null : {
      sourceAxisKeys: n.sourceChannels,
      receiverAxisKeys: n.receiverChannels,
      sourceChannels: n.sourceChannels.map((c) => is(t, c)),
      receiverChannels: n.receiverChannels.map((c) => is(t, c)),
      matrix: n.matrix,
      kind: C.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: C.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: C.scientific.kind === "cytof-spillover" ? s("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: n.sourceChannels.length,
        receivers: n.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: C.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [Ne, W, C, t, le, s, V]), be = Vi ?? (d && d.sourceAxisKeys.length <= Dr ? "matrix" : "compact"), oe = (d == null ? void 0 : d.sourceChannels) ?? [], ue = (d == null ? void 0 : d.receiverChannels) ?? [];
  v.useEffect(() => {
    At((n) => Math.max(1, Math.min(Ti, Math.round(n) || 1)));
  }, [At]);
  const lt = Nt ?? Re, Dt = v.useMemo(() => {
    if (!d || !Re) return !1;
    const [n, a] = Re.split(_e);
    return n !== a && d.sourceAxisKeys.includes(n) && d.receiverAxisKeys.includes(a);
  }, [d, Re]), N = v.useMemo(() => {
    if (!d || !lt) return null;
    const [n, a] = lt.split(_e), c = d.sourceAxisKeys.indexOf(n), u = d.receiverAxisKeys.indexOf(a);
    return c < 0 || u < 0 || d.sourceAxisKeys[c] === d.receiverAxisKeys[u] ? null : {
      pairKey: lt,
      sourceIndex: c,
      receiverIndex: u,
      source: oe[c],
      receiver: ue[u],
      value: d.matrix[c][u],
      interaction: d.kind === "cytof" ? Tn(
        d.sourceAxisKeys[c],
        d.receiverAxisKeys[u]
      ) : null
    };
  }, [lt, d, ue, oe]);
  v.useEffect(() => {
    if (!N) {
      Ft("");
      return;
    }
    const n = J[N.pairKey];
    Ft(re((n ?? N.value) * 100, 6));
  }, [N == null ? void 0 : N.pairKey, N == null ? void 0 : N.value, J]);
  const Me = v.useMemo(() => N ? Jt(
    t,
    N.source.key,
    N.receiver.key,
    {
      eventMask: xe,
      fixedEventIndices: On,
      eligibleEventCount: de
    }
  ) : null, [l, O.state, On, de, xe, t, N]), $e = v.useMemo(() => {
    if (!d || O.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const n = [];
    for (let p = 0; p < d.matrix.length; p++)
      for (let f = 0; f < d.matrix[p].length; f++) {
        const w = d.sourceAxisKeys[p], z = d.receiverAxisKeys[f];
        if (w === z) continue;
        const U = d.matrix[p][f];
        if (!Number.isFinite(U)) continue;
        const B = d.kind === "cytof" ? Tn(w, z) : null, X = B !== null && B !== "self" && B !== "other";
        U === 0 && !X && He === "biological" || n.push({
          sourceIndex: p,
          receiverIndex: f,
          pairKey: `${w}${_e}${z}`,
          source: oe[p],
          receiver: ue[f],
          coefficient: U,
          interaction: B,
          physicalPrior: X ? 1 : 0
        });
      }
    n.sort((p, f) => f.physicalPrior - p.physicalPrior || Math.abs(f.coefficient) - Math.abs(p.coefficient));
    const a = n.slice(0, 240), c = a.flatMap((p) => {
      const f = Jt(
        t,
        p.source.key,
        p.receiver.key,
        {
          eventMask: xe,
          fixedEventIndices: Dn,
          eligibleEventCount: de
        }
      );
      return f.ready ? [{ ...p, evidence: f.preview.evidence }] : [];
    }), u = br(
      c.map(({ coefficient: p, physicalPrior: f, evidence: w }) => ({ coefficient: p, physicalPrior: f, evidence: w })),
      d.kind,
      He
    ).map(({ index: p, relativePriority: f }) => ({ ...c[p], relativePriority: f }));
    return {
      candidateCount: n.length,
      screenedCount: a.length,
      evaluableCount: c.length,
      items: u.slice(0, 8)
    };
  }, [ra, He, O.state, d, ue, Dn, de, xe, t, oe]), he = v.useMemo(() => new Set(
    C ? C.scientific.kind === "flow-spillover" ? C.scientific.matrix.receiverChannels : C.scientific.includedChannels : []
  ), [C]), te = v.useMemo(() => d ? Nr(
    t,
    Array.from(/* @__PURE__ */ new Set([
      ...d.sourceAxisKeys,
      ...d.receiverAxisKeys
    ])),
    {
      eventMask: xe,
      fixedEventIndices: Ot,
      eligibleEventCount: de
    }
  ) : null, [
    l,
    Ot,
    O.state,
    d,
    de,
    xe,
    t
  ]);
  v.useEffect(() => {
    if (!d || he.size === 0) return;
    const n = he.has(Ke) ? Ke : d.sourceAxisKeys.find((c) => he.has(c)) ?? "", a = he.has(Ae) && Ae !== n ? Ae : d.receiverAxisKeys.find((c) => c !== n && he.has(c)) ?? "";
    n !== Ke && Cs(n), a !== Ae && Tt(a);
  }, [he, Ae, Ke, d]);
  const Mn = v.useMemo(() => new Set(Xn), [Xn]), zt = v.useMemo(() => {
    var c;
    if (!d) return [];
    const n = [], a = he.size > 0;
    for (let u = 0; u < d.sourceAxisKeys.length; u++) {
      const p = d.sourceAxisKeys[u];
      if (!(a && !he.has(p)))
        for (let f = 0; f < d.receiverAxisKeys.length; f++) {
          const w = d.receiverAxisKeys[f];
          if (p === w || a && !he.has(w)) continue;
          const z = (c = d.matrix[u]) == null ? void 0 : c[f];
          if (!Number.isFinite(z)) continue;
          const U = oe[u], B = ue[f];
          if (!U || !B || te != null && te.ready && (!te.dataset.channels.has(U.key) || !te.dataset.channels.has(B.key))) continue;
          const X = d.kind === "cytof" ? Tn(p, w) : null, ae = X !== null && X !== "self" && X !== "other";
          n.push({
            sourceIndex: u,
            receiverIndex: f,
            pairKey: `${p}${_e}${w}`,
            source: U,
            receiver: B,
            coefficient: z,
            interaction: X,
            physicalPrior: ae ? 1 : 0
          });
        }
    }
    return n;
  }, [te, he, d, ue, oe]), Fe = v.useMemo(() => {
    const n = Pn.trim().toLocaleLowerCase();
    return zt.filter((a) => {
      const c = Math.abs(a.coefficient) > 1e-12, u = a.physicalPrior > 0;
      return Be === "all" || Be === "relevant" && (c || u) || Be === "nonzero" && c || Be === "physical" && u || Be === "flagged" && Mn.has(a.pairKey) ? n ? `${a.source.combined} ${a.receiver.combined}`.toLocaleLowerCase().includes(n) : !0 : !1;
    });
  }, [Mn, zt, Be, Pn]);
  v.useEffect(() => {
    var a;
    if (!Mt || Ee !== "global") return;
    const n = [...((a = Sn.current) == null ? void 0 : a.querySelectorAll(".gl-comp-global-tile")) ?? []].find((c) => c.dataset.pairKey === Mt);
    n && (n.scrollIntoView({ block: "center", inline: "center" }), Ns(null));
  }, [Rn, be, Mt, Fe, Ee]);
  const _t = v.useMemo(() => {
    if (be === "compact" || be === "matrix") return [];
    const n = /* @__PURE__ */ new Map();
    for (const a of Fe) {
      const c = be === "source" ? a.source : a.receiver, u = n.get(c.key);
      u ? u.pairs.push(a) : n.set(c.key, { channel: c, pairs: [a] });
    }
    return [...n.values()];
  }, [be, Fe]), xa = v.useMemo(() => {
    const n = /* @__PURE__ */ new Map();
    if (be !== "matrix") return n;
    for (const a of Fe) n.set(`${a.sourceIndex}:${a.receiverIndex}`, a);
    return n;
  }, [be, Fe]), Ks = v.useMemo(
    () => be === "compact" ? Fe : be === "matrix" ? [...Fe].sort((n, a) => n.sourceIndex - a.sourceIndex || n.receiverIndex - a.receiverIndex) : _t.flatMap((n) => n.pairs),
    [_t, be, Fe]
  ), Ls = `${s(zr[Be])}${Pn.trim() ? s(" · search “{query}”", { query: Pn.trim() }) : ""}`, zn = Math.max(120, Math.min(220, Math.round(Gi) || 120)), Os = v.useRef(null), [Ds, zs] = v.useState(0);
  v.useEffect(() => {
    const n = Os.current;
    if (!n || be !== "matrix" || typeof ResizeObserver > "u") return;
    const a = new ResizeObserver(() => zs(n.clientWidth));
    return a.observe(n), zs(n.clientWidth), () => a.disconnect();
  }, [be, Ee, te == null ? void 0 : te.ready]);
  const _s = (d == null ? void 0 : d.receiverChannels.length) ?? 0, Ut = _s > 0 && Ds > 0 ? Math.max(120, Math.min(zn, Math.floor((Ds - 92 - 12) / _s))) : zn, sn = Math.max(1, Math.min(10, Math.round(Hi) || 6)), ot = Math.max(0.1, Math.min(1, Number(Yi) || 0.85)), ct = Math.max(0.3, Math.min(3, Number(Ji) || 1)), ie = v.useMemo(() => !C || !d || O.state !== "ready" ? [] : Xn.flatMap((n) => {
    const [a, c] = n.split(_e), u = d.sourceAxisKeys.indexOf(a), p = d.receiverAxisKeys.indexOf(c);
    if (u < 0 || p < 0 || a === c || !he.has(a) || !he.has(c)) return [];
    const f = Jt(
      t,
      oe[u].key,
      ue[p].key,
      {
        eventMask: xe,
        fixedEventIndices: Dn,
        eligibleEventCount: de
      }
    );
    if (!f.ready) return [];
    const w = $e.items.find((z) => z.pairKey === n);
    return [{
      sourceIndex: u,
      receiverIndex: p,
      pairKey: n,
      source: oe[u],
      receiver: ue[p],
      coefficient: d.matrix[u][p],
      interaction: d.kind === "cytof" ? Tn(a, c) : null,
      physicalPrior: d.kind === "cytof" && Tn(a, c) !== "other" ? 1 : 0,
      evidence: f.preview.evidence,
      relativePriority: (w == null ? void 0 : w.relativePriority) ?? 0
    }];
  }), [Xn, he, O.state, d, C, ue, $e.items, Dn, de, xe, t, oe]), We = ie, Us = v.useMemo(() => {
    if (!C) return 0.01;
    const n = [];
    for (let a = 0; a < C.scientific.matrix.matrix.length; a++) {
      const c = C.scientific.matrix.sourceChannels[a];
      for (let u = 0; u < C.scientific.matrix.matrix[a].length; u++) {
        if (c === C.scientific.matrix.receiverChannels[u]) continue;
        const p = Math.abs(C.scientific.matrix.matrix[a][u]);
        Number.isFinite(p) && p > 1e-12 && n.push(p);
      }
    }
    return n.length > 0 ? hs(n) : 0.01;
  }, [C]), Bt = (n, a) => {
    const c = ia[n];
    if (c) return c;
    const u = Pi(a, Us, (d == null ? void 0 : d.kind) ?? "flow");
    return {
      lowerPercent: re(u.lower * 100, 5),
      upperPercent: re(u.upper * 100, 5)
    };
  }, _n = (n, a) => {
    const c = Bt(n, a), u = Number(c.lowerPercent) / 100, p = Number(c.upperPercent) / 100;
    return !Number.isFinite(u) || !Number.isFinite(p) ? { lower: u, upper: p, error: "Enter finite lower and upper sweep bounds." } : (d == null ? void 0 : d.kind) === "cytof" && u < 0 ? { lower: u, upper: p, error: "CyTOF NNLS sweep bounds cannot be negative." } : p > u ? { lower: u, upper: p, error: null } : { lower: u, upper: p, error: "The upper sweep bound must be greater than the lower bound." };
  }, dt = (n, a, c, u) => {
    aa((p) => ({
      ...p,
      [n]: {
        ...p[n] ?? (() => {
          const f = Pi(a, Us, (d == null ? void 0 : d.kind) ?? "flow");
          return {
            lowerPercent: re(f.lower * 100, 5),
            upperPercent: re(f.upper * 100, 5)
          };
        })(),
        [c]: u
      }
    })), Qe((p) => {
      if (!(n in p)) return p;
      const f = { ...p };
      return delete f[n], f;
    }), cn((p) => {
      if (!(n in p)) return p;
      const f = { ...p };
      return delete f[n], f;
    });
  }, Un = (n, a) => {
    ta((c) => a ? c.includes(n) ? c : [...c, n] : c.filter((u) => u !== n)), a ? (Ce(n), Kn(n)) : (Qe((c) => {
      if (!(n in c)) return c;
      const u = { ...c };
      return delete u[n], u;
    }), cn((c) => {
      if (!(n in c)) return c;
      const u = { ...c };
      return delete u[n], u;
    }));
  }, va = () => {
    if (!d || !Ke || !Ae || Ke === Ae) return;
    if (!he.has(Ke) || !he.has(Ae)) {
      je("Both channels must be included in the installed compensation solve.");
      return;
    }
    const n = `${Ke}${_e}${Ae}`;
    Un(n, !0), je(null);
  }, Vt = We.reduce((n, a) => n + (_n(a.pairKey, a.coefficient).error ? 1 : 0), 0), kn = v.useMemo(() => {
    if (!C) return null;
    const n = C.scientific.matrix.matrix.map((a) => Array.from(a));
    for (const [a, c] of Object.entries(J)) {
      const [u, p] = a.split(_e), f = C.scientific.matrix.sourceChannels.indexOf(u), w = C.scientific.matrix.receiverChannels.indexOf(p);
      f >= 0 && w >= 0 && (n[f][w] = c);
    }
    return Object.freeze(n.map((a) => Object.freeze(a)));
  }, [C, J]);
  v.useEffect(() => {
    const n = Object.keys(J).length;
    if (!_ || n === 0 || !C || C.scientific.kind !== "flow-spillover" || O.state !== "ready" || !kn || !N || !T) {
      Cn.current++, on({ state: "idle" });
      return;
    }
    const a = On;
    if (a.length === 0) {
      on({
        state: "error",
        pairKey: N.pairKey,
        message: s("The selected review population contains no events.")
      });
      return;
    }
    const c = ++Cn.current, u = N.pairKey;
    on((f) => ({
      state: "updating",
      pairKey: u,
      ...(f.state === "ready" || f.state === "updating") && f.pairKey === u && f.preview ? { preview: f.preview } : {}
    }));
    const p = window.setTimeout(() => {
      T(
        C,
        a,
        kn
      ).then((f) => {
        if (Cn.current !== c) return;
        const w = f.sourceChannels.indexOf(N.source.pnn), z = f.sourceChannels.indexOf(N.receiver.pnn);
        if (w < 0 || z < 0)
          throw new Error(s("The preview result did not contain the selected flow channels."));
        const U = Qt(
          t,
          N.source.pnn,
          N.receiver.pnn,
          a,
          f.candidateColumns[w],
          f.candidateColumns[z],
          { totalEvents: de }
        );
        if (!U.ready) throw new Error(U.reason);
        on({
          state: "ready",
          pairKey: u,
          preview: U.preview
        });
      }).catch((f) => {
        if (Cn.current !== c) return;
        const w = f instanceof Error ? f.message : String(f);
        /cancel|supersed|stale/i.test(w) || on({ state: "error", pairKey: u, message: w });
      });
    }, 90);
    return () => window.clearTimeout(p);
  }, [
    O.state,
    T,
    C,
    On,
    de,
    t,
    t.dataRevision,
    t.displayTransformContextKey,
    t.layerRevision,
    N,
    J,
    s,
    _,
    kn
  ]);
  const ba = v.useMemo(() => !d || Object.keys(J).length === 0 ? null : {
    sourceChannels: d.sourceAxisKeys,
    receiverChannels: d.receiverAxisKeys,
    matrix: d.matrix.map(
      (n, a) => n.map((c, u) => {
        const p = `${d.sourceAxisKeys[a]}${_e}${d.receiverAxisKeys[u]}`;
        return J[p] ?? c;
      })
    )
  }, [d, J]), Bs = v.useMemo(() => {
    if (!d) return [];
    const n = [];
    for (let a = 0; a < d.matrix.length; a++)
      for (let c = 0; c < d.matrix[a].length; c++) {
        const u = d.matrix[a][c];
        d.sourceAxisKeys[a] === d.receiverAxisKeys[c] || !Number.isFinite(u) || u <= 1 || n.push(`${oe[a].combined} → ${ue[c].combined}`);
      }
    return n;
  }, [d, ue, oe]), Wt = v.useMemo(() => {
    if (!d) return [];
    const n = [];
    for (let a = 0; a < d.matrix.length; a++)
      for (let c = 0; c < d.matrix[a].length; c++) {
        const u = d.matrix[a][c], p = d.sourceAxisKeys[a] === d.receiverAxisKeys[c], f = `${oe[a].combined} → ${ue[c].combined}`;
        Number.isFinite(u) ? p && Math.abs(u - 1) > 1e-8 ? n.push(`${oe[a].combined}: diagonal is ${rn(u)}, not 100%`) : !p && u < 0 ? n.push(`${f}: negative coefficient (${rn(u)})`) : !p && u > 1 && n.push(`${f}: coefficient above 100%`) : n.push(`${f}: non-finite coefficient (${String(u)})`);
      }
    return n;
  }, [d, ue, oe]), Vs = v.useMemo(
    () => (d == null ? void 0 : d.matrix.some((n) => n.some((a) => !Number.isFinite(a)))) ?? !1,
    [d]
  ), De = v.useMemo(
    () => W && O.state === "ready" ? el(t, W.includedPnns) : null,
    [O.state, W, t]
  ), ut = v.useMemo(() => {
    const n = [...Wt];
    return O.state === "stale" && n.push(...O.reasons.map((a) => `Profile unavailable: ${Hr(a)}`)), n;
  }, [O, Wt]), Ws = W ? (C == null ? void 0 : C.name) ?? "Installed compensation profile" : le ? Ne ? "SCE spillover matrix" : "Embedded FCS matrix" : "No compatible matrix", ya = W ? qr(W.kind, W.method) : le ? "Flow linear inverse" : "Not configured", ht = s(ya), Gt = (W == null ? void 0 : W.includedPnns.length) ?? (le == null ? void 0 : le.channels.length) ?? 0, mt = (C == null ? void 0 : C.name) ?? (W == null ? void 0 : W.profileId) ?? Ws, Gs = ss(mt), ja = Gs !== mt || (C == null ? void 0 : C.recordType) === "revision" ? `${Gs} · ${s("revised")}` : mt, wa = le !== null && !Vs || W !== null && O.state === "ready", qs = v.useMemo(() => {
    if (!d) return 0;
    let n = 0;
    for (let a = 0; a < d.matrix.length; a++)
      for (let c = 0; c < d.matrix[a].length; c++) {
        if (d.sourceAxisKeys[a] === d.receiverAxisKeys[c]) continue;
        const u = d.matrix[a][c];
        Number.isFinite(u) && (n = Math.max(n, Math.abs(u)));
      }
    return n;
  }, [d]), Bn = !!((C == null ? void 0 : C.scientific.kind) === "flow-spillover" && O.state === "ready" && d && Math.max(d.sourceAxisKeys.length, d.receiverAxisKeys.length) <= Wr), En = v.useMemo(() => {
    const a = [...oe, ...ue].map((U) => U.combined), c = typeof document > "u" ? null : document.createElement("canvas").getContext("2d");
    c && (c.font = `11px ${Or}`);
    const u = (U) => c ? c.measureText(U).width : U.length * 11 * 0.55, p = a.reduce((U, B) => Math.max(U, u(B)), 0), f = Math.min(320, Math.max(94, Math.ceil(p) + 12)), w = Math.min(260, Math.max(82, Math.ceil(p) + 6)), z = Math.max(88, Math.ceil(w * Math.sin(ns) + 12));
    return { rowLabelWidth: f, columnLabelWidth: w, columnLabelHeight: z };
  }, [Bn, ue, oe]), un = d ? (() => {
    const n = Math.max(d.sourceAxisKeys.length, d.receiverAxisKeys.length), [a, c, u, p] = Bn ? [42, 54, 64, 960] : [32, 38, 44, 760], f = Math.max(a, Math.min(c, Math.floor(p / n)));
    if (!Kt) return f;
    const w = Math.min(
      Kt.width - Si - En.rowLabelWidth - En.columnLabelWidth * Math.cos(ns),
      Kt.height - Si - En.columnLabelHeight
    );
    return Math.max(f, Math.min(u, Math.floor(w / n)));
  })() : 13, Vn = v.useMemo(() => ({
    ...En,
    // The last column's label leans past the matrix's right edge by its horizontal extent.
    overhang: Math.max(0, Math.ceil(En.columnLabelWidth * Math.cos(ns) - un / 2))
  }), [En, un]);
  v.useEffect(() => {
    Jn({}), ln({}), on({ state: "idle" }), Cn.current++;
  }, [C == null ? void 0 : C.profileId]), v.useEffect(() => {
    (d == null ? void 0 : d.kind) === "flow" && Be === "physical" && Yn("relevant");
  }, [Be, d == null ? void 0 : d.kind, Yn]);
  const Na = (n) => {
    bs((a) => ({ ...a, [n]: !a[n] }));
  }, Hs = (n) => {
    var u;
    const a = ((u = Sn.current) == null ? void 0 : u.getBoundingClientRect().width) ?? 1100, c = Math.max(360, Math.min(900, a - 440 - 8));
    return Math.max(360, Math.min(c, Math.round(n)));
  }, Ca = (n) => {
    var p;
    if (n.button !== 0) return;
    n.preventDefault();
    const a = n.currentTarget;
    (p = a.setPointerCapture) == null || p.call(a, n.pointerId);
    const c = (f) => {
      var z;
      const w = (z = Sn.current) == null ? void 0 : z.getBoundingClientRect();
      w && ys(Hs(w.right - f.clientX));
    }, u = () => {
      var f;
      window.removeEventListener("pointermove", c), window.removeEventListener("pointerup", u), window.removeEventListener("pointercancel", u), (f = a.releasePointerCapture) == null || f.call(a, n.pointerId);
    };
    window.addEventListener("pointermove", c), window.addEventListener("pointerup", u), window.addEventListener("pointercancel", u);
  }, Sa = (n) => {
    let a = null;
    n.key === "ArrowLeft" ? a = yn + 40 : n.key === "ArrowRight" ? a = yn - 40 : n.key === "Home" && (a = $i), a !== null && (n.preventDefault(), ys(Hs(a)));
  }, Ma = async (n) => {
    var c;
    const a = (c = n.currentTarget.files) == null ? void 0 : c[0];
    n.currentTarget.value = "", a && await Ys(a);
  }, Zs = () => void Ki(Is.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "CyTOF spillover matrix").then((n) => {
    n != null && n[0] && Ys(n[0]);
  }), Ys = async (n) => {
    en(null), Q(null), ge(!1), we(null), Ye(!1);
    try {
      const a = lr(await n.text()), c = as(
        a.input,
        "cytof-spillover"
      );
      if (!c.ok)
        throw new Error(c.errors.map(({ message: f }) => f).join(" "));
      const u = /* @__PURE__ */ new Map();
      for (const { pnn: f } of Lt) {
        const w = f.trim().normalize("NFC");
        u.set(w, (u.get(w) ?? 0) + 1);
      }
      const p = c.value.receiverChannels.filter(
        (f) => u.get(f) === 1
      );
      et({
        fileName: n.name,
        source: "file",
        parsed: a,
        matrix: c.value,
        validationWarnings: c.warnings
      }), dn(new Set(p));
    } catch (a) {
      et(null), dn(/* @__PURE__ */ new Set()), en(a instanceof Error ? a.message : String(a));
    }
  }, ka = (n, a) => {
    dn((c) => {
      const u = new Set(c);
      return a ? u.add(n) : u.delete(n), u;
    });
  }, Xs = async () => {
    var c, u;
    if (!ee)
      throw new Error(s("Choose a CyTOF spillover matrix first."));
    const n = ((u = (c = globalThis.crypto) == null ? void 0 : c.randomUUID) == null ? void 0 : u.call(c)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, a = ee.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation";
    return Xt(
      {
        kind: "cytof-spillover",
        method: "nnls",
        solverVersion: or,
        solverSettings: cr,
        matrix: ee.matrix,
        includedChannels: Array.from(Ln)
      },
      {
        profileId: `cytof-${n}`,
        name: a,
        createdAt: /* @__PURE__ */ new Date(),
        origin: {
          type: "uploaded",
          fileName: ee.fileName,
          format: ee.parsed.format.delimiter,
          sourceColumnHeader: ee.parsed.format.sourceColumnHeader
        },
        provenance: {
          sourceDescription: ee.source === "host" ? "CyTOF spillover matrix from metadata(sce)$spillover_matrix" : "User-uploaded CyTOF spillover matrix",
          estimationMethod: "Imported; coefficients preserved exactly"
        }
      }
    );
  }, Ea = async () => {
    if (!(Oe.current || q || !ee || !(me != null && me.canApply) || !o)) {
      if (j && !Te) {
        en(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      en(null), Q(null), we(null), Oe.current = !0, Ve(!0), Xe(ee.fileName);
      try {
        const n = await Xs();
        await o(n, we), Q(s("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: n.name,
          channels: Ln.size,
          files: nn
        })), et(null), dn(/* @__PURE__ */ new Set()), Ye(!1), we(null);
      } catch (n) {
        const a = n instanceof Error ? n.message : String(n);
        /cancel/i.test(a) ? Q(s("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : en(a);
      } finally {
        Oe.current = !1, Ve(!1), Xe(null);
      }
    }
  }, Aa = async () => {
    if (!(Oe.current || q || !ee || !(me != null && me.canApply) || !tn || !b || !Rt)) {
      if (j && !Te) {
        en(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before adopting the assay.")
        );
        return;
      }
      en(null), Q(null), we(null), Oe.current = !0, Ve(!0), Xe(tn.label);
      try {
        const n = await Xs();
        await b(
          n,
          tn,
          we
        ), Q(s("Using existing SCE assay {assay} with {matrix}. No assay values were recomputed.", {
          assay: tn.label,
          matrix: n.name
        })), et(null), dn(/* @__PURE__ */ new Set()), Ye(!1), st(!1), we(null);
      } catch (n) {
        en(n instanceof Error ? n.message : String(n));
      } finally {
        Oe.current = !1, Ve(!1), Xe(null);
      }
    }
  }, Ta = async () => {
    var u, p;
    if (Oe.current || q || !o) return;
    if (j && !Te) {
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
    const a = as({
      sourceChannels: n,
      receiverChannels: n,
      matrix: n.map((f, w) => n.map((z, U) => w === U ? 1 : 0))
    }, "flow-spillover");
    if (!a.ok) {
      ge(!0), Q(a.errors.map(({ message: f }) => f).join(" "));
      return;
    }
    const c = `${i.replace(/\.fcs$/i, "") || "Flow"} manual matrix`;
    Q(null), ge(!1), we(null), Oe.current = !0, Ve(!0), Xe(c);
    try {
      const f = ((p = (u = globalThis.crypto) == null ? void 0 : u.randomUUID) == null ? void 0 : p.call(u)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, w = await Xt(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: oi,
          solverSettings: li,
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
      await o(w, we), Ye(!1), Q(s("Manual matrix editing is ready: every spillover starts at zero. Select a pair and set its coefficient."));
    } catch (f) {
      ge(!0), Q(f instanceof Error ? f.message : String(f));
    } finally {
      Oe.current = !1, Ve(!1);
    }
  }, $a = async () => {
    if (!(!m || q || nt)) {
      if (j && !Te) {
        ge(!0), Q(
          s("Confirm that existing gate memberships will be recomputed in original coordinates before removing the matrix.")
        );
        return;
      }
      $s(!0);
      try {
        await m(), ge(!1), Q(s("The matrix was removed. The original assay is active and every file reads its stored values."));
      } catch (n) {
        ge(!0), Q(n instanceof Error ? n.message : String(n));
      } finally {
        $s(!1);
      }
    }
  }, Fa = async () => {
    var a, c, u;
    if (Oe.current || q || !le || !((a = fe == null ? void 0 : fe.validation) != null && a.ok) || !o) return;
    if (j && !Te) {
      ge(!0), Q(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const n = (Ne == null ? void 0 : Ne.name) || `${i.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    Q(null), ge(!1), we(null), Oe.current = !0, Ve(!0), Xe(n);
    try {
      const p = ((u = (c = globalThis.crypto) == null ? void 0 : c.randomUUID) == null ? void 0 : u.call(c)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, f = await Xt(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: oi,
          solverSettings: li,
          matrix: fe.validation.value
        },
        {
          profileId: `flow-${p}`,
          name: n,
          createdAt: /* @__PURE__ */ new Date(),
          origin: {
            ...Ne ? {
              type: "uploaded",
              fileName: Ne.name,
              format: "csv",
              sourceColumnHeader: "source"
            } : {
              type: "embedded-fcs",
              fileName: i,
              ...fe.keyword ? { keyword: fe.keyword } : {}
            }
          },
          provenance: {
            sourceDescription: Ne ? "Flow spillover matrix from metadata(sce)$spillover_matrix" : "Spillover matrix embedded in the source FCS file",
            estimationMethod: ir(
              Ne ? "Imported from SCE metadata" : "Imported from FCS",
              fe.roundedCoefficients
            )
          }
        }
      );
      await o(f, we), Ye(!1);
      const w = s(Ne ? "Flow matrix editing is ready. The exact hosted matrix is retained as the baseline, and Original measurements remain available." : "Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available.");
      Q(fe.roundedCoefficients > 0 ? s("Flow matrix editing is ready. {count} coefficients within 0.001% of 0 or 100% were set to exactly 0 or 100% to store the matrix; all others are as the file carries them. Original measurements remain available.", {
        count: fe.roundedCoefficients
      }) : w);
    } catch (p) {
      ge(!0), Q(p instanceof Error ? p.message : String(p));
    } finally {
      Oe.current = !1, Ve(!1), Xe(null), we(null);
    }
  }, Js = (n, a) => {
    var p, f;
    const c = oe[n], u = ue[a];
    !d || !c || !u || d.sourceAxisKeys[n] === d.receiverAxisKeys[a] || (Ce(`${d.sourceAxisKeys[n]}${_e}${d.receiverAxisKeys[a]}`), (f = (p = Ps.current) == null ? void 0 : p.querySelector(
      `button[data-source-index="${n}"][data-receiver-index="${a}"]`
    )) == null || f.focus());
  }, Ia = (n, a, c) => {
    if (!d) return;
    const u = d.sourceAxisKeys.length, p = d.receiverAxisKeys.length;
    let f = a, w = c;
    const z = (B, X) => {
      let ae = B + X;
      for (; ae >= 0 && ae < p; ) {
        if (d.sourceAxisKeys[a] !== d.receiverAxisKeys[ae]) return ae;
        ae += X;
      }
      return B;
    }, U = (B, X) => {
      let ae = B + X;
      for (; ae >= 0 && ae < u; ) {
        if (d.sourceAxisKeys[ae] !== d.receiverAxisKeys[c]) return ae;
        ae += X;
      }
      return B;
    };
    switch (n.key) {
      case "ArrowLeft":
        w = z(c, -1);
        break;
      case "ArrowRight":
        w = z(c, 1);
        break;
      case "ArrowUp":
        f = U(a, -1);
        break;
      case "ArrowDown":
        f = U(a, 1);
        break;
      case "Home": {
        w = d.sourceAxisKeys[a] === d.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const B = p - 1;
        w = d.sourceAxisKeys[a] === d.receiverAxisKeys[B] ? B - 1 : B;
        break;
      }
      default:
        return;
    }
    n.preventDefault(), Js(f, w);
  }, Wn = (n, a) => {
    if (!C || !Number.isFinite(a)) return;
    const [c, u] = n.split(_e), p = C.scientific.matrix.sourceChannels.indexOf(c), f = C.scientific.matrix.receiverChannels.indexOf(u);
    if (p < 0 || f < 0) return;
    if (C.scientific.kind === "cytof-spillover" && a < 0) {
      ge(!0), Q(s("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const w = C.scientific.matrix.matrix[p][f];
    Jn((z) => {
      const U = { ...z };
      return a === w ? delete U[n] : U[n] = a, U;
    }), ge(!1), Q(s("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: c,
      receiver: u,
      value: (a * 100).toFixed(2)
    }));
  }, Qs = (n, a, c, u) => {
    const p = c[0];
    if (!p) return null;
    const f = p.sourceChannels.indexOf(n.source.pnn), w = p.sourceChannels.indexOf(n.receiver.pnn);
    if (f < 0 || w < 0) return null;
    const z = Qt(
      t,
      n.source.pnn,
      n.receiver.pnn,
      u,
      p.currentColumns[f],
      p.currentColumns[w],
      { totalEvents: de }
    );
    if (!z.ready) return null;
    const U = [{
      value: n.coefficient,
      isCurrent: !0,
      preview: z.preview
    }];
    return c.forEach((B, X) => {
      const ae = B.sourceChannels.indexOf(n.source.pnn), Ge = B.sourceChannels.indexOf(n.receiver.pnn);
      if (ae < 0 || Ge < 0) return;
      const ke = Qt(
        t,
        n.source.pnn,
        n.receiver.pnn,
        u,
        B.candidateColumns[ae],
        B.candidateColumns[Ge],
        {
          totalEvents: de,
          xRange: z.preview.xRange,
          yRange: z.preview.yRange
        }
      );
      ke.ready && U.push({
        value: a[X],
        isCurrent: !1,
        preview: ke.preview
      });
    }), U.sort((B, X) => B.value - X.value || Number(X.isCurrent) - Number(B.isCurrent)), { pairKey: n.pairKey, values: Object.freeze(U) };
  }, Pa = async (n) => {
    if (!C || !d || !K || q || pe || Se) return;
    const a = _n(n.pairKey, n.coefficient);
    if (a.error) {
      je(a.error);
      return;
    }
    const c = fn(
      t.fcs.nEvents,
      ki,
      xe
    );
    if (c.length === 0) {
      je(s("The selected review population contains no events."));
      return;
    }
    const u = ++Le.current, p = [a.lower, a.upper];
    wn(n.pairKey), je(null);
    try {
      const f = await K(
        C,
        c,
        p.map((z) => Ii(
          C,
          d.sourceAxisKeys[n.sourceIndex],
          d.receiverAxisKeys[n.receiverIndex],
          z
        )),
        void 0,
        1
      );
      if (Le.current !== u) return;
      const w = Qs(n, p, f, c);
      if (!w) throw new Error(s("The fast bounds preview could not be built for this pair."));
      cn((z) => ({ ...z, [n.pairKey]: w }));
    } catch (f) {
      if (Le.current !== u) return;
      const w = f instanceof Error ? f.message : String(f);
      je(/cancel/i.test(w) ? s("Fast bounds preview cancelled.") : w);
    } finally {
      Le.current === u && wn(null);
    }
  }, Ra = async () => {
    var u;
    if (!C || !K || We.length === 0 || q || pe !== null || Se !== null) return;
    if (Vt > 0) {
      je(s("Fix the sweep bounds for {count} flagged pairs before running.", { count: Vt }));
      return;
    }
    const n = fn(
      t.fcs.nEvents,
      Mi,
      xe
    );
    if (n.length === 0) {
      je(s("The selected review population contains no events."));
      return;
    }
    const a = ++Le.current, c = We.flatMap((p) => {
      const f = _n(p.pairKey, p.coefficient);
      return Jr(f.lower, f.upper).map((w) => ({
        pair: p,
        value: w,
        matrix: Ii(
          C,
          d.sourceAxisKeys[p.sourceIndex],
          d.receiverAxisKeys[p.receiverIndex],
          w
        )
      }));
    });
    je(null), Qe({}), Nn({ completed: 0, total: c.length });
    try {
      const p = await K(
        C,
        n,
        c.map(({ matrix: w }) => w),
        (w, z) => {
          Le.current === a && Nn({ completed: w, total: z });
        },
        Et
      );
      if (Le.current !== a) return;
      if (p.length !== c.length)
        throw new Error(s("The compensation worker returned an incomplete coefficient sweep."));
      const f = {};
      for (const w of We) {
        const z = c.flatMap((B, X) => B.pair.pairKey === w.pairKey ? [X] : []), U = Qs(
          w,
          z.map((B) => c[B].value),
          z.map((B) => p[B]),
          n
        );
        U && (f[w.pairKey] = U);
      }
      Qe(f), Kn(((u = We[0]) == null ? void 0 : u.pairKey) ?? null);
    } catch (p) {
      if (Le.current !== a) return;
      const f = p instanceof Error ? p.message : String(p);
      je(/cancel/i.test(f) ? s("Exact coefficient sweep cancelled.") : f);
    } finally {
      Le.current === a && Nn(null);
    }
  }, Ka = () => {
    const a = (C == null ? void 0 : C.scientific.kind) === "flow-spillover" && !!Pe ? (se == null ? void 0 : se.rows.find(({ active: u, profile: p }) => u && p !== null)) ?? null : null, c = a && se ? se.planSwitch(a) : null;
    return /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-revision-agreement", children: [
      c && /* @__PURE__ */ e.jsxs("p", { children: [
        s("Every file in the workspace ({count}) is compensated with the revised matrix.", { count: c.fileCount }),
        " ",
        c.gateCount > 0 ? s("Membership is recomputed for {gates} gates and {populations} populations drawn on channels this matrix compensates.", {
          gates: c.gateCount,
          populations: c.populationCount
        }) : s("No gate is drawn on a channel this matrix compensates.")
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: It,
            disabled: q,
            onChange: (u) => Pt(u.currentTarget.checked)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { children: s("I agree that gate membership may change.") })
      ] })
    ] });
  }, La = () => {
    Le.current++, L == null || L(), Nn(null), wn(null), je(s("Exact coefficient sweep cancelled."));
  }, Oa = async () => {
    var c, u;
    if (!C || !kn || !o || Object.keys(J).length === 0 || !It) return;
    const n = C.scientific.kind === "flow-spillover" && Pe ? Pe : o, a = `${ss(C.name)} · edited`;
    Q(null), ge(!1), Ve(!0), Xe(a), we(null);
    try {
      const f = {
        profileId: `comp-edit-${((u = (c = globalThis.crypto) == null ? void 0 : c.randomUUID) == null ? void 0 : u.call(c)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: a,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(J).length} compensation coefficient${Object.keys(J).length === 1 ? "" : "s"} in GateLab.`
      }, w = ($ == null ? void 0 : $.recordType) === "baseline" && Qr(kn, $.scientific.matrix.matrix) ? await ar(C, $, f) : await rr(
        C,
        Yr(C, kn),
        f
      );
      await n(w, we), Pt(!1), Jn({}), ln({}), Qe({}), cn({}), wn(null), je(null), $t((z) => z + 1), ie.length > 0 && (In("attention"), Ce(ie[0].pairKey), Kn(ie[0].pairKey)), Q(s("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: ss(w.name),
        flagged: ie.length > 0 ? s(
          ie.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: ie.length }
        ) : ""
      }));
    } catch (p) {
      ge(!0), Q(p instanceof Error ? p.message : String(p));
    } finally {
      Ve(!1), Xe(null), we(null);
    }
  }, ei = (n) => {
    if (ie.length === 0) return;
    const a = ie.findIndex(({ pairKey: p }) => p === Re), c = a < 0 ? n > 0 ? 0 : ie.length - 1 : (a + n + ie.length) % ie.length, u = ie[c];
    ze(null), Ce(u.pairKey), Kn(u.pairKey);
  }, qt = () => /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "gl-comp-inspector-resize",
      role: "separator",
      "aria-label": s("Resize compensation inspector"),
      "aria-orientation": "vertical",
      "aria-valuemin": 360,
      "aria-valuemax": 900,
      "aria-valuenow": yn,
      tabIndex: 0,
      title: s("Drag to resize the coefficient inspector; use Left/Right arrow keys for fine control"),
      onPointerDown: Ca,
      onKeyDown: Sa,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), Da = (n) => {
    ze(null), Ce(n), St(!0), zt.some((a) => a.pairKey === n) && (Fe.some((a) => a.pairKey === n) || (Yn("all"), ws("")), Ns(n));
  }, Ht = (n, a = !1) => {
    const c = N ? Mn.has(N.pairKey) : !1, u = N ? ie.find(({ pairKey: Y }) => Y === N.pairKey) ?? null : null, p = N ? Bt(N.pairKey, N.value) : null, f = N ? _n(N.pairKey, N.value) : null, w = N ? ca[N.pairKey] : null, z = N ? d.sourceAxisKeys[N.sourceIndex] : "", U = N ? d.receiverAxisKeys[N.receiverIndex] : "", B = N != null && N.interaction && N.interaction !== "self" && N.interaction !== "other" ? 1 : 0, X = N && (Me != null && Me.ready) ? os({
      coefficient: N.value,
      physicalPrior: B,
      evidence: Me.preview.evidence
    }, d.kind, He) : null, ae = N ? Xr($, z, U) : null, Ge = (N == null ? void 0 : N.value) ?? null, ke = N ? J[N.pairKey] : void 0, An = !!(N && (C == null ? void 0 : C.scientific.kind) === "flow-spillover" && T && Object.keys(J).length > 0), Je = Ze.state !== "idle" && Ze.state !== "error" && Ze.pairKey === (N == null ? void 0 : N.pairKey) ? Ze.preview : null, hn = Je ?? (Me != null && Me.ready ? Me.preview : null), mn = [];
    ae !== null && Ge !== null && ((C == null ? void 0 : C.recordType) === "revision" || ae !== Ge) && mn.push({ label: s("Baseline"), value: ae }), Ge !== null && mn.push({ label: s("Installed"), value: Ge }), ke !== void 0 && mn.push({ label: s("Staged"), value: ke });
    const pn = ie.findIndex(({ pairKey: Y }) => Y === Re);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${a ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: s("Selected coefficient") }),
          !a && /* @__PURE__ */ e.jsx("span", { children: s(Nt ? "Hover preview · click to pin this pair." : Re ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inspector-actions", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flag-navigation", "aria-label": s("Flagged compensation pair navigation"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Previous flagged compensation pair"),
                disabled: ie.length === 0,
                onClick: () => ei(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: pn >= 0 ? s("{current} / {total} flagged", { current: pn + 1, total: ie.length }) : s("{total} flagged", { total: ie.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Next flagged compensation pair"),
                disabled: ie.length === 0,
                onClick: () => ei(1),
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
      N ? /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-pair-detail${a ? " is-global" : ""}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pair-route", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
            /* @__PURE__ */ e.jsx("strong", { children: N.source.label }),
            /* @__PURE__ */ e.jsx("small", { children: N.source.pnn })
          ] }),
          /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Receiver") }),
            /* @__PURE__ */ e.jsx("strong", { children: N.receiver.label }),
            /* @__PURE__ */ e.jsx("small", { children: N.receiver.pnn })
          ] })
        ] }),
        X && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${X.category}`,
            title: s(X.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: s(X.label) }),
              /* @__PURE__ */ e.jsx("span", { children: s(X.detail) })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: c,
              disabled: !C || !he.has(d.sourceAxisKeys[N.sourceIndex]) || !he.has(d.receiverAxisKeys[N.receiverIndex]),
              onChange: (Y) => Un(N.pairKey, Y.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: s("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: s("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: s("Stored fraction: {value}", { value: re(N.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: s(J[N.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(J[N.pairKey] ?? N.value) ? `${((J[N.pairKey] ?? N.value) * 100).toFixed(1)}%` : String(J[N.pairKey] ?? N.value) })
        ] }),
        mn.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": s("Coefficient history"), children: mn.map((Y, gn) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          gn > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: s("Exact fraction: {value}", { value: re(Y.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: Y.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (Y.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${Y.label}:${gn}`)) }),
        C && Re === N.pairKey && !Nt && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              Fn,
              {
                step: "0.1",
                value: Qn,
                disabled: q,
                onValueChange: (Y) => {
                  Ft(Y), C.scientific.kind === "flow-spillover" && Y.trim() !== "" && Number.isFinite(Number(Y)) && Wn(N.pairKey, Number(Y) / 100);
                }
              }
            )
          ] }),
          C.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: s("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: q || !Number.isFinite(Number(Qn)) || Qn.trim() === "",
              onClick: () => Wn(N.pairKey, Number(Qn) / 100),
              children: s("Stage value")
            }
          ),
          J[N.pairKey] !== void 0 && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: q,
              onClick: () => {
                Wn(N.pairKey, N.value), ln((Y) => {
                  const gn = { ...Y };
                  return delete gn[N.pairKey], gn;
                });
              },
              children: s("Reset")
            }
          )
        ] }),
        An && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-candidate-status${a ? " is-compact" : ""}`, "aria-label": s("Flow compensation coefficient preview"), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Coefficient preview") }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              s("Original remains fixed; the right panel shows the complete working matrix."),
              a ? s(" The gallery remains installed until Apply.") : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("em", { children: ke === void 0 ? s("Working matrix") : `${(N.value * 100).toFixed(1)}% → ${(ke * 100).toFixed(1)}%` }),
          Ze.state === "updating" && Ze.pairKey === N.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: s("Updating…") }),
          Ze.state === "error" && Ze.pairKey === N.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: s(Ze.message) })
        ] }),
        N.interaction && N.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          s("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: N.interaction })
        ] }),
        a && (hn ? /* @__PURE__ */ e.jsx(
          Ci,
          {
            preview: hn,
            sourceLabel: N.source.label,
            receiverLabel: N.receiver.label,
            kind: d.kind,
            densitySmoothing: sn,
            compact: !0,
            compensatedTitle: s(Je ? "Candidate" : "Compensated")
          }
        ) : Me && !Me.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(Me.reason) }) : null),
        a && /* @__PURE__ */ e.jsx(
          Rr,
          {
            matrixView: d,
            sourceChannels: oe,
            receiverChannels: ue,
            selectedSourceIndex: N.sourceIndex,
            selectedReceiverIndex: N.receiverIndex,
            stagedCoefficients: J,
            maximumAbsoluteOffDiagonal: qs,
            onSelect: Da
          }
        ),
        !a && (hn ? /* @__PURE__ */ e.jsx(
          Ci,
          {
            preview: hn,
            sourceLabel: N.source.label,
            receiverLabel: N.receiver.label,
            kind: d.kind,
            densitySmoothing: sn,
            compensatedTitle: s(Je ? "Candidate" : "Compensated")
          }
        ) : Me && !Me.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(Me.reason) }) : null),
        c && u && p && f && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Sweep bounds") }),
            /* @__PURE__ */ e.jsx("span", { children: s("Four exact candidates will be interpolated across these endpoints.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-inputs", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Lower (%)") }),
              /* @__PURE__ */ e.jsx(
                Fn,
                {
                  step: "0.1",
                  value: p.lowerPercent,
                  disabled: q || pe !== null || Se !== null,
                  onValueChange: (Y) => dt(N.pairKey, N.value, "lowerPercent", Y)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Upper (%)") }),
              /* @__PURE__ */ e.jsx(
                Fn,
                {
                  step: "0.1",
                  value: p.upperPercent,
                  disabled: q || pe !== null || Se !== null,
                  onValueChange: (Y) => dt(N.pairKey, N.value, "upperPercent", Y)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: q || pe !== null || Se !== null || f.error !== null,
                onClick: () => void Pa(u),
                children: s(Se === N.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          f.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: s(f.error) }) : /* @__PURE__ */ e.jsx("small", { children: s("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(de, ki).toLocaleString(),
            sweep: Math.min(de, Mi).toLocaleString()
          }) }),
          w && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: w.values.map((Y) => /* @__PURE__ */ e.jsx("div", { className: Y.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            yt,
            {
              title: `${Y.isCurrent ? `${s("Current")} · ` : ""}${(Y.value * 100).toFixed(2)}%`,
              panel: Y.preview.compensated,
              preview: Y.preview,
              sourceLabel: N.source.label,
              receiverLabel: N.receiver.label,
              minimumSize: 145,
              maximumSize: 220,
              densitySmoothing: sn
            }
          ) }, `${N.pairKey}:bounds:${Y.value}:${Y.isCurrent}`)) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s(d.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: s("No coefficient selected.") })
    ] });
  }, Zt = (n, a, c = zn) => /* @__PURE__ */ e.jsx(
    Kr,
    {
      dataset: a,
      pair: n,
      plotSize: c,
      densitySmoothing: sn,
      flagged: Mn.has(n.pairKey),
      selected: Re === n.pairKey,
      onSelect: () => {
        ze(null), Ce(n.pairKey), St(!0);
      },
      onFlag: (u) => Un(n.pairKey, u)
    },
    n.pairKey
  ), za = async (n, a) => {
    if (!(te != null && te.ready) || !d)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const c = Ks.map((u) => ({
      pairKey: u.pairKey,
      sourceLabel: u.source.label,
      receiverLabel: u.receiver.label,
      coefficient: u.coefficient,
      relationship: u.interaction,
      buildPreview: () => {
        const p = Di(
          te.dataset,
          u.source.key,
          u.receiver.key
        );
        if (!p.ready) throw new Error(p.reason);
        return p.preview;
      }
    }));
    await Sr(c, {
      sampleName: i,
      profileName: (C == null ? void 0 : C.name) ?? s(d.title),
      populationName: (ne == null ? void 0 : ne.name) ?? s("All Events"),
      filterLabel: Ls,
      densitySmoothing: sn,
      densityColorPower: Z,
      pointAlpha: ot,
      pointSize: ct
    }, n, a);
  };
  return _ ? /* @__PURE__ */ e.jsx(fs.Provider, { value: Z, children: /* @__PURE__ */ e.jsx(xs.Provider, { value: ot, children: /* @__PURE__ */ e.jsx(vs.Provider, { value: ct, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab gl-plotting-workspace gl-comp-workspace",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-plotting-head gl-comp-head gl-comp-overview${Ee === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsxs("h2", { className: "gl-tab-title", children: [
              s("Compensation"),
              /* @__PURE__ */ e.jsx(er, { intro: R })
            ] }),
            !W && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: ht })
          ] }),
          W ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${O.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: s("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: mt,
                method: ht,
                count: Gt,
                status: s(O.state === "ready" ? "Ready" : "Unavailable"),
                assay: s(l ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${O.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  s("{kind} compensation installed. Installed compensation profile.", {
                    kind: W.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                (() => {
                  const n = se == null ? void 0 : se.rows.find(({ profile: a }) => (a == null ? void 0 : a.profileId) === W.profileId);
                  return n ? /* @__PURE__ */ e.jsx(Bi, { row: n }) : null;
                })(),
                /* @__PURE__ */ e.jsx("strong", { children: ja }),
                /* @__PURE__ */ e.jsx("span", { children: s("{method} · {count} ch · {status}", {
                  method: ht,
                  count: Gt,
                  status: O.state === "ready" ? s("Ready") : s("Unavailable")
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
                source: s(Ws),
                assay: s(l ? "Compensated assay active" : "Original assay active"),
                count: Gt
              })
            }
          ),
          W && t.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: q,
              onClick: Zs,
              children: s("Replace matrix…")
            }
          ),
          W && m && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-header-remove", children: [
            j && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: Te,
                  disabled: q || nt,
                  onChange: (n) => Ye(n.currentTarget.checked)
                }
              ),
              /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in original coordinates.") })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: q || nt,
                title: s("Uninstall the matrix: every file returns to the original assay and the matrix leaves the workspace."),
                onClick: () => void $a(),
                children: s(nt ? "Removing…" : "Remove the matrix")
              }
            )
          ] }),
          wa && /* @__PURE__ */ e.jsx(nr, { intro: R, className: "gl-comp-global-layer-note", children: s("Assay selection in the top bar applies to every tab.") })
        ] }),
        /* @__PURE__ */ e.jsxs("aside", { className: `gl-plotting-inspector gl-comp-inspector-left section-${js}`, "aria-label": s("Compensation controls"), children: [
          /* @__PURE__ */ e.jsx("nav", { className: "gl-presentation-tabs", "aria-label": s("Compensation settings"), children: _r.map(({ id: n, label: a }) => /* @__PURE__ */ e.jsx("button", { type: "button", "aria-pressed": js === n, onClick: () => ea(n), children: s(a) }, n)) }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-section gl-comp-pane-matrices", children: [
            se && t.instrument === "flow" && /* @__PURE__ */ e.jsx(
              Fr,
              {
                ...se,
                onEditStarted: (n) => {
                  In("matrix"), ge(!1), Q(s("Editing {name}: type a percentage in the matrix, or select a pair to see its plots. Apply revised matrix compensates every file with the changes.", { name: n }));
                }
              }
            ),
            t.instrument === "flow" && !W && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Edit coefficients") }),
              le && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-enable-heading", children: [
                /* @__PURE__ */ e.jsxs("p", { className: "gl-comp-pane-line", children: [
                  /* @__PURE__ */ e.jsx("span", { id: "comp-flow-enable-heading", children: s(Ne ? "SCE spillover matrix" : "Embedded FCS matrix") }),
                  /* @__PURE__ */ e.jsx(
                    ts,
                    {
                      label: s("About editing this matrix"),
                      text: s("Install this exact matrix as the immutable baseline to edit coefficients and preview their effect.")
                    }
                  )
                ] }),
                fe != null && fe.error ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-problem", children: [
                  /* @__PURE__ */ e.jsx("span", { title: fe.error, children: s("Not editable: {reason}", {
                    reason: Ur(fe.validation).map((n) => s(n)).join(", ")
                  }) }),
                  /* @__PURE__ */ e.jsxs("details", { children: [
                    /* @__PURE__ */ e.jsx("summary", { children: s("Details") }),
                    /* @__PURE__ */ e.jsx("p", { children: fe.error })
                  ] })
                ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  j && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: Te,
                        disabled: q,
                        onChange: (n) => Ye(n.currentTarget.checked)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
                  ] }),
                  h.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-hint gl-comp-embedded-others", children: s("Enabling also returns {count} other files to Original: {files}. A workspace keeps one kind of compensation, and these draw from their own embedded matrix.", {
                    count: h.length,
                    files: h.join(", ")
                  }) }),
                  q ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
                    ce ? s("Preparing editor… {percent}%", { percent: Math.round(ce.fraction * 100) }) : s("Preparing editor…"),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: (ce == null ? void 0 : ce.phase) === "cancelling",
                        onClick: x,
                        children: s((ce == null ? void 0 : ce.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                      }
                    )
                  ] }) : /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-btn",
                      disabled: !o || j && !Te,
                      onClick: () => void Fa(),
                      children: s("Enable matrix editing")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-empty-heading", children: [
                /* @__PURE__ */ e.jsxs("p", { className: "gl-comp-pane-line", children: [
                  /* @__PURE__ */ e.jsx("span", { id: "comp-flow-empty-heading", children: s("Empty matrix") }),
                  /* @__PURE__ */ e.jsx(
                    ts,
                    {
                      label: s("About the empty matrix"),
                      text: s("Start from an identity matrix over the file's fluorescence channels, every spillover at zero, and set the coefficients by hand.")
                    }
                  )
                ] }),
                j && (!le || !!(fe != null && fe.error)) && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: Te,
                      disabled: q,
                      onChange: (n) => Ye(n.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
                ] }),
                q ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-flow-enable-progress", role: "status", children: s("Preparing editor…") }) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: !o || j && !Te,
                    onClick: () => void Ta(),
                    children: s("Start from an empty matrix")
                  }
                )
              ] })
            ] }),
            W && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Edit coefficients") }),
              !(d && Object.keys(J).length > 0) && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-pane-line", children: s("Select a pair in the matrix to change its coefficient.") }),
              d && Object.keys(J).length > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                Ka(),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
                  /* @__PURE__ */ e.jsxs("span", { children: [
                    s("{count} pending edits", { count: Object.keys(J).length }),
                    (C == null ? void 0 : C.scientific.kind) === "cytof-spillover" ? ` · ${s("{files} checked FCS files", { files: nn })}` : ""
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: q,
                      onClick: () => {
                        Jn({}), ln({}), Pt(!1), Q(null);
                      },
                      children: s("Discard")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-btn",
                      disabled: q || !It || pe !== null || Se !== null || !o || (C == null ? void 0 : C.scientific.kind) === "cytof-spillover" && nn === 0,
                      onClick: () => void Oa(),
                      children: s("Apply revised matrix")
                    }
                  )
                ] })
              ] })
            ] }),
            t.instrument === "cytof" && !W && /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s("Choose a CyTOF spillover matrix in the main panel.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-section gl-comp-pane-review", children: [
            /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsxs("h3", { children: [
                s("Review scope"),
                /* @__PURE__ */ e.jsx(ts, { label: s("About the review scope"), text: s("The population and the events the biplots, the attention ranking and the sweeps are drawn from. Membership is frozen from the current assay; Apply always uses every event.") })
              ] }),
              /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-review-population", children: [
                /* @__PURE__ */ e.jsx("span", { children: s("Review population") }),
                /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": s("Compensation review population"),
                    value: (ne == null ? void 0 : ne.id) ?? "all",
                    disabled: pe !== null || Se !== null,
                    onChange: (n) => kt(n.currentTarget.value),
                    children: [
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All Events") }),
                      P.map((n) => /* @__PURE__ */ e.jsx("option", { value: n.id, children: `${"· ".repeat(n.depth)}${n.name} (${n.eventCount.toLocaleString()})` }, n.id))
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsx("small", { title: s("{count} events · applies to biplots, attention ranking, and sweeps; membership frozen from the current assay", {
                  count: de.toLocaleString()
                }), children: s("{count} events", { count: de.toLocaleString() }) })
              ] }),
              Ee !== "global" && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-preview-events", children: [
                /* @__PURE__ */ e.jsx("span", { children: s("Pair preview") }),
                /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": s("Compensation pair preview event count"),
                    value: String(rt),
                    disabled: q,
                    onChange: (n) => {
                      const a = n.currentTarget.value;
                      na(a === "all" ? "all" : Number(a));
                    },
                    children: [
                      Ai.map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: s("{count} events", { count: n.toLocaleString() }) }, n)),
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All available") })
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsx("small", { title: s("Controls the frozen event set shown in the selected-pair Original and comparison biplots. Applying compensation still processes every event."), children: s("Showing {shown} of {total}; Apply always uses all events.", {
                  shown: On.length.toLocaleString(),
                  total: de.toLocaleString()
                }) })
              ] })
            ] }),
            F !== void 0 && k !== void 0 && A && /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Apply") }),
              F !== void 0 && k !== void 0 && A && /* @__PURE__ */ e.jsxs(
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
                        value: F,
                        disabled: q,
                        onChange: (n) => A(Number(n.currentTarget.value)),
                        children: Array.from({ length: k }, (n, a) => a + 1).map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
                      }
                    ),
                    /* @__PURE__ */ e.jsxs("small", { children: [
                      "/ ",
                      k
                    ] })
                  ]
                }
              )
            ] }),
            (d || W) && /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Tools") }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: Br.map(({ id: n, label: a }) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  id: `comp-drawer-${n}-button`,
                  className: "gl-comp-drawer-toggle",
                  "aria-expanded": Zn[n],
                  "aria-controls": `comp-drawer-${n}`,
                  onClick: () => Na(n),
                  children: [
                    /* @__PURE__ */ e.jsxs("span", { children: [
                      s(a),
                      n === "review" && ut.length > 0 ? ` (${ut.length})` : ""
                    ] }),
                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ e.jsx(ai, { open: Zn[n], size: 12 }) })
                  ]
                },
                n
              )) })
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-pane-section gl-comp-pane-display", children: d ? /* @__PURE__ */ e.jsxs("section", { children: [
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
                      value: sn,
                      "aria-label": s("Compensation biplot density smoothing"),
                      onChange: (n) => Zi(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: sn })
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
                      value: ot,
                      "aria-label": s("Compensation biplot point alpha"),
                      onChange: (n) => Xi(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: ot.toFixed(2) })
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
                      value: ct,
                      "aria-label": s("Compensation biplot point size"),
                      onChange: (n) => Qi(Number(n.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("output", { children: [
                    ct.toFixed(1),
                    "×"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              tr,
              {
                className: "gl-comp-density-colour",
                value: Z,
                onChange: H
              }
            )
          ] }) : /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s("The biplot settings apply once a matrix is shown.") }) })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-prop-body gl-comp-body", children: [
          d && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-workspace-tabs", role: "tablist", "aria-label": s("Compensation workspace"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": Ee === "matrix",
                className: Ee === "matrix" ? "active" : void 0,
                onClick: () => {
                  ze(null), In("matrix");
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
                  ze(null), In("global");
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
                  ze(null), In("attention");
                },
                children: [
                  s("Flagged"),
                  ie.length > 0 ? ` (${ie.length})` : ""
                ]
              }
            )
          ] }),
          t.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "input",
            {
              ref: Is,
              type: "file",
              accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
              className: "gl-sr-only",
              "aria-label": s("Choose CyTOF spillover matrix"),
              onChange: (n) => void Ma(n)
            }
          ),
          Es && /* @__PURE__ */ e.jsx("div", { className: As ? "gl-comp-error" : "gl-comp-status", role: As ? "alert" : "status", children: s(Es) }),
          t.instrument === "cytof" && (!W || ee) && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-cytof-import", "aria-labelledby": "comp-cytof-import-heading", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-import-head", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("h3", { id: "comp-cytof-import-heading", children: s("CyTOF spillover matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: s("Linear counts → non-negative least squares → arcsinh display") })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-import-actions", children: /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: ee ? "gl-btn-ghost" : "gl-btn",
                  disabled: q,
                  onClick: Zs,
                  children: s(ee ? "Choose another matrix…" : "Import matrix…")
                }
              ) })
            ] }),
            Ts && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s(Ts) }),
            ee && me && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-body", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-summary", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("strong", { children: ee.fileName }),
                  /* @__PURE__ */ e.jsx("span", { children: s("{sources} sources × {receivers} receivers", {
                    sources: ee.matrix.sourceChannels.length,
                    receivers: ee.matrix.receiverChannels.length
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("dl", { children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Exact matches") }),
                    /* @__PURE__ */ e.jsx("dd", { children: me.matchedChannels.length })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Included") }),
                    /* @__PURE__ */ e.jsx("dd", { children: me.includedChannels.length })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Not in FCS") }),
                    /* @__PURE__ */ e.jsx("dd", { children: me.matrixOnlyChannels.length })
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
                      onClick: () => dn(new Set(me.matchedChannels)),
                      children: s("All matched")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: q,
                      onClick: () => dn(/* @__PURE__ */ new Set()),
                      children: s("None")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-channel-grid", children: ee.matrix.receiverChannels.map((n) => {
                const a = me.matchedChannels.includes(n);
                return /* @__PURE__ */ e.jsxs("label", { className: a ? "" : "is-unavailable", title: a ? n : s("{channel} is not uniquely present in this FCS file", { channel: n }), children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: Ln.has(n),
                      disabled: !a || q,
                      onChange: (c) => ka(n, c.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: is(t, n).combined }),
                  !a && /* @__PURE__ */ e.jsx("small", { children: s("not matched") })
                ] }, n);
              }) }),
              (ee.validationWarnings.length > 0 || me.warnings.length > 0) && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: /* @__PURE__ */ e.jsx("span", { children: s("{count} review items: {messages}", {
                count: ee.validationWarnings.length + me.warnings.length,
                messages: [
                  ...ee.validationWarnings.map(({ message: n }) => n),
                  ...me.warnings.map(({ message: n }) => n)
                ].map((n) => s(n)).join(" ")
              }) }) }),
              me.blockers.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: me.blockers.map(({ message: n }) => s(n)).join(" ") }),
              j && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Te,
                    disabled: q,
                    onChange: (n) => Ye(n.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: s("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                  /* @__PURE__ */ e.jsx("span", { children: q ? ce ? s("{phase}… {percent}% ({processed} / {total} events)", {
                    phase: s(ce.phase === "cancelling" ? "Cancelling" : ce.phase === "preparing" ? "Preparing" : "Applying"),
                    percent: Math.round(ce.fraction * 100),
                    processed: ce.processedEvents.toLocaleString(),
                    total: ce.totalEvents.toLocaleString()
                  }) : s("Preparing compensation…") : s("The Original assay is retained and can be restored at any time.") }),
                  /* @__PURE__ */ e.jsx("strong", { className: nn === 0 ? "is-empty" : void 0, children: nn === 0 ? s("No FCS files are checked. Select at least one file in Samples.") : s("Applies atomically to {files} checked FCS files · {events} total events", {
                    files: nn,
                    events: fa.toLocaleString()
                  }) })
                ] }),
                q ? /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (ce == null ? void 0 : ce.phase) === "cancelling",
                    onClick: x,
                    children: s((ce == null ? void 0 : ce.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                ) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn",
                    disabled: !o || nn === 0 || !me.canApply || j && !Te,
                    onClick: () => void Ea(),
                    children: s("Apply NNLS compensation")
                  }
                )
              ] }),
              g.length > 0 && b && /* @__PURE__ */ e.jsxs(
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
                          value: (tn == null ? void 0 : tn.id) ?? "",
                          disabled: q,
                          onChange: (n) => {
                            Fs(n.currentTarget.value), st(!1);
                          },
                          children: g.map((n) => /* @__PURE__ */ e.jsx("option", { value: n.id, children: n.label === n.id ? n.id : `${n.label} (${n.id})` }, n.id))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-adopt-confirm", children: [
                      /* @__PURE__ */ e.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: Rt,
                          disabled: q,
                          onChange: (n) => st(n.currentTarget.checked)
                        }
                      ),
                      /* @__PURE__ */ e.jsx("span", { children: s("I confirm this assay was computed from the selected source assay using this exact matrix and channel set.") })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: q || !tn || !Rt || nn === 0 || !me.canApply || j && !Te,
                        onClick: () => void Aa(),
                        children: s("Use existing assay — no recomputation")
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          Vs && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
          Bs.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
            /* @__PURE__ */ e.jsx("span", { children: s("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
              count: Bs.length
            }) }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => bs((n) => ({ ...n, review: !0 })), children: s("Review details") })
          ] }),
          W && O.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
          d && Ee === "matrix" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: Sn,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: Dt ? `minmax(440px, 1fr) 8px ${yn}px` : "minmax(0, 1fr)" },
              children: [
                /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrix-panel", "aria-labelledby": "comp-matrix-heading", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-matrix-head", children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("h3", { id: "comp-matrix-heading", children: s(d.title) }),
                      /* @__PURE__ */ e.jsx("span", { children: s(d.subtitle) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-head-actions", children: [
                      Bn && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-inline-edit-note", children: s("Edit cells directly (%)") }),
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
                          onClick: () => Ms(!0),
                          children: s("Export CSV…")
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-scroll", ref: ga, children: /* @__PURE__ */ e.jsxs(
                    "div",
                    {
                      className: `gl-comp-matrix-stage${Bn ? " is-flow-inline" : ""}`,
                      style: {
                        width: 18 + Vn.rowLabelWidth + d.receiverAxisKeys.length * un + Vn.overhang,
                        "--gl-comp-row-label-w": `${Vn.rowLabelWidth}px`,
                        "--gl-comp-col-label-w": `${Vn.columnLabelWidth}px`,
                        "--gl-comp-col-label-h": `${Vn.columnLabelHeight}px`
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
                                  gridTemplateColumns: `repeat(${d.receiverAxisKeys.length}, ${un}px)`
                                },
                                children: ue.map((n, a) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (N == null ? void 0 : N.receiverIndex) === a ? "is-selected" : void 0,
                                    title: n.combined,
                                    children: /* @__PURE__ */ e.jsx("span", { children: n.combined })
                                  },
                                  d.receiverAxisKeys[a]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                className: "gl-comp-row-labels",
                                "aria-label": s("Source channel labels"),
                                style: {
                                  gridTemplateRows: `repeat(${d.sourceAxisKeys.length}, ${un}px)`
                                },
                                children: oe.map((n, a) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (N == null ? void 0 : N.sourceIndex) === a ? "is-selected" : void 0,
                                    title: n.combined,
                                    children: n.combined
                                  },
                                  d.sourceAxisKeys[a]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                ref: Ps,
                                className: "gl-comp-matrix shows-values",
                                role: "grid",
                                "aria-label": s("Compensation matrix; source rows and receiver columns"),
                                "aria-rowcount": d.sourceAxisKeys.length,
                                "aria-colcount": d.receiverAxisKeys.length,
                                style: {
                                  gridTemplateColumns: `repeat(${d.receiverAxisKeys.length}, ${un}px)`,
                                  gridTemplateRows: `repeat(${d.sourceAxisKeys.length}, ${un}px)`
                                },
                                children: d.matrix.map((n, a) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    role: "row",
                                    className: "gl-comp-matrix-row",
                                    "aria-rowindex": a + 1,
                                    children: n.map((c, u) => {
                                      const p = d.sourceAxisKeys[a], f = d.receiverAxisKeys[u], w = `${p}${_e}${f}`, z = J[w], U = z ?? c, B = p === f, X = (N == null ? void 0 : N.sourceIndex) === a && N.receiverIndex === u, ae = (N == null ? void 0 : N.sourceIndex) === a, Ge = (N == null ? void 0 : N.receiverIndex) === u, ke = oe[a], An = ue[u], Je = d.kind === "cytof" ? Tn(p, f) : null, hn = sr(
                                        U,
                                        qs,
                                        B
                                      ), mn = d.receiverAxisKeys.findIndex((ye) => ye !== p), pn = Re === w, Y = Re === null && a === 0 && u === mn, gn = Number.isFinite(U) ? U === 0 ? "" : (U * 100).toFixed(1) : String(U), si = Je && Je !== "other" && Je !== "self" ? ` · ${Je}` : "", _a = la[w] ?? Fi(U);
                                      return Bn && !B ? /* @__PURE__ */ e.jsx(
                                        Fn,
                                        {
                                          role: "gridcell",
                                          className: `gl-comp-cell gl-comp-cell-input${X ? " selected" : ""}${pn ? " is-pinned" : ""}${z === void 0 ? "" : " is-staged"}${ae ? " is-selected-source" : ""}${Ge ? " is-selected-receiver" : ""}`,
                                          min: "0",
                                          step: "0.1",
                                          value: _a,
                                          disabled: q,
                                          "data-source-index": a,
                                          "data-receiver-index": u,
                                          "aria-colindex": u + 1,
                                          "aria-selected": pn,
                                          "aria-label": s("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                            source: ke.combined,
                                            receiver: An.combined,
                                            pending: z === void 0 ? "" : s(", pending edit")
                                          }),
                                          title: s("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                            source: ke.combined,
                                            receiver: An.combined,
                                            pending: z === void 0 ? "" : s(" · pending edit")
                                          }),
                                          style: hn,
                                          onFocus: () => Ce(w),
                                          onMouseEnter: () => ze(w),
                                          onMouseLeave: () => ze((ye) => ye === w ? null : ye),
                                          onClick: () => Ce(w),
                                          onValueChange: (ye) => {
                                            Ce(w), ln((Gn) => ({ ...Gn, [w]: ye })), ye.trim() !== "" && Number.isFinite(Number(ye)) && Wn(w, Number(ye) / 100);
                                          },
                                          onBlur: (ye) => {
                                            const Gn = ye.currentTarget.value;
                                            if (Gn.trim() === "" || !Number.isFinite(Number(Gn))) {
                                              ln((Yt) => {
                                                const ii = { ...Yt };
                                                return delete ii[w], ii;
                                              });
                                              return;
                                            }
                                            ln((Yt) => ({
                                              ...Yt,
                                              [w]: Fi(Number(Gn) / 100)
                                            }));
                                          }
                                        },
                                        f
                                      ) : /* @__PURE__ */ e.jsx(
                                        "button",
                                        {
                                          type: "button",
                                          role: "gridcell",
                                          className: `gl-comp-cell${B ? " diagonal" : ""}${X ? " selected" : ""}${pn ? " is-pinned" : ""}${z === void 0 ? "" : " is-staged"}${ae ? " is-selected-source" : ""}${Ge ? " is-selected-receiver" : ""}`,
                                          disabled: B,
                                          tabIndex: B ? -1 : X || Y ? 0 : -1,
                                          "data-source-index": a,
                                          "data-receiver-index": u,
                                          "data-interaction": Je ?? void 0,
                                          "aria-colindex": u + 1,
                                          "aria-pressed": B ? void 0 : pn,
                                          "aria-label": B ? s("{channel} diagonal: {value}", { channel: ke.combined, value: rn(U) }) : s("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                            source: ke.combined,
                                            receiver: An.combined,
                                            value: rn(U),
                                            pending: z === void 0 ? "" : s(" (pending edit)"),
                                            interaction: si
                                          }),
                                          title: B ? `${ke.combined} · self · ${rn(U)}` : `${ke.combined} → ${An.combined} · ${rn(U)}${z === void 0 ? "" : " · pending edit"}${si}`,
                                          style: hn,
                                          onFocus: () => {
                                            B || Ce(w);
                                          },
                                          onMouseEnter: () => {
                                            B || ze(w);
                                          },
                                          onMouseLeave: () => ze((ye) => ye === w ? null : ye),
                                          onClick: () => Ce(w),
                                          onKeyDown: (ye) => Ia(ye, a, u),
                                          children: /* @__PURE__ */ e.jsx("span", { children: gn })
                                        },
                                        f
                                      );
                                    })
                                  },
                                  d.sourceAxisKeys[a]
                                ))
                              }
                            )
                          ] })
                        ] })
                      ]
                    }
                  ) })
                ] }),
                Dt && qt(),
                Dt && Ht(() => {
                  ze(null), Ce(null);
                })
              ]
            }
          ) : d && Ee === "global" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: Sn,
              className: `gl-comp-common-path gl-comp-global-path${Rn ? " has-details" : ""}`,
              style: {
                gridTemplateColumns: Rn ? `minmax(440px, 1fr) 8px ${yn}px` : "minmax(0, 1fr)"
              },
              children: [
                /* @__PURE__ */ e.jsx(
                  Lr,
                  {
                    stateKey: G,
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
                          value: Be,
                          onChange: (n) => Yn(n.currentTarget.value),
                          children: [
                            /* @__PURE__ */ e.jsx("option", { value: "relevant", children: s("Matrix-linked / relevant") }),
                            /* @__PURE__ */ e.jsx("option", { value: "nonzero", children: s("Non-zero coefficients") }),
                            d.kind === "cytof" && /* @__PURE__ */ e.jsx("option", { value: "physical", children: s("Physical CyTOF relationships") }),
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
                          value: be,
                          onChange: (n) => Wi(n.currentTarget.value),
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
                          value: Pn,
                          placeholder: s("Find channel…"),
                          "aria-label": s("Search global compensation pairs"),
                          onChange: (n) => ws(n.currentTarget.value)
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
                            value: zn,
                            "aria-label": s("Global compensation plot size"),
                            onChange: (n) => qi(Number(n.currentTarget.value))
                          }
                        ),
                        /* @__PURE__ */ e.jsx("output", { children: s("{size}px", { size: zn }) })
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn gl-comp-global-export",
                          disabled: !(te != null && te.ready) || Fe.length === 0,
                          title: s("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                          onClick: () => ks(!0),
                          children: s("Export…")
                        }
                      ),
                      /* @__PURE__ */ e.jsx(
                        "span",
                        {
                          className: "gl-comp-global-count",
                          title: s("The Global gallery uses one fixed representative event set so every pair and both assay layers remain directly comparable."),
                          children: s("{pairs} pairs · {shown} / {total} events · {population}", {
                            pairs: Fe.length.toLocaleString(),
                            shown: Ot.length.toLocaleString(),
                            total: de.toLocaleString(),
                            population: (ne == null ? void 0 : ne.name) ?? s("All Events")
                          })
                        }
                      )
                    ] }),
                    children: te ? te.ready ? Fe.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No pairs match the current filter. Choose another filter or clear the channel search.") }) : be === "compact" ? /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-gallery",
                        "data-event-signature": te.dataset.eventSignature,
                        children: Fe.map((n) => Zt(n, te.dataset))
                      }
                    ) : be === "matrix" && d ? /* @__PURE__ */ e.jsxs(
                      "div",
                      {
                        ref: Os,
                        className: "gl-comp-global-matrix",
                        "data-event-signature": te.dataset.eventSignature,
                        "data-tile-size": Ut,
                        role: "grid",
                        "aria-label": s("Compensation pairs arranged as the matrix"),
                        style: { gridTemplateColumns: `92px repeat(${d.receiverChannels.length}, ${Ut}px)` },
                        children: [
                          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-corner", children: [
                            /* @__PURE__ */ e.jsx("span", { children: s("Source ↓") }),
                            /* @__PURE__ */ e.jsx("span", { children: s("Receiver →") })
                          ] }),
                          d.receiverChannels.map((n, a) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-col", title: n.combined, children: [
                            /* @__PURE__ */ e.jsx("strong", { children: n.label }),
                            /* @__PURE__ */ e.jsx("small", { children: n.pnn })
                          ] }, `col-${a}`)),
                          d.sourceChannels.map((n, a) => /* @__PURE__ */ e.jsxs(v.Fragment, { children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-row", title: n.combined, children: [
                              /* @__PURE__ */ e.jsx("strong", { children: n.label }),
                              /* @__PURE__ */ e.jsx("small", { children: n.pnn })
                            ] }),
                            d.receiverChannels.map((c, u) => {
                              const p = xa.get(`${a}:${u}`);
                              if (p) return Zt(p, te.dataset, Ut);
                              const f = d.sourceAxisKeys[a] === d.receiverAxisKeys[u];
                              return /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  className: `gl-comp-global-matrix-blank${f ? " is-diagonal" : ""}`,
                                  title: f ? s("{channel} into itself", { channel: n.label }) : s("{source} into {receiver}: not shown under the current filter", { source: n.label, receiver: c.label }),
                                  children: f ? /* @__PURE__ */ e.jsx("span", { children: n.label }) : null
                                },
                                `${a}:${u}`
                              );
                            })
                          ] }, `row-${a}`))
                        ]
                      }
                    ) : /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-groups",
                        "data-event-signature": te.dataset.eventSignature,
                        "data-layout": be,
                        children: _t.map((n) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                          /* @__PURE__ */ e.jsxs("header", { children: [
                            /* @__PURE__ */ e.jsx("span", { children: s(be === "source" ? "Source channel" : "Receiver") }),
                            /* @__PURE__ */ e.jsx("strong", { title: n.channel.combined, children: n.channel.label }),
                            /* @__PURE__ */ e.jsx("small", { children: n.channel.pnn }),
                            /* @__PURE__ */ e.jsx("em", { children: s("{count} pairs", { count: n.pairs.length }) })
                          ] }),
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: n.pairs.map((a) => Zt(a, te.dataset)) })
                        ] }, n.channel.key))
                      }
                    ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s(te.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No matrix is available for the global inspector.") })
                  }
                ),
                Rn && qt(),
                Rn && Ht(() => St(!1), !0)
              ]
            }
          ) : d ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: Sn,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${yn}px` },
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
                            disabled: pe !== null || Se !== null,
                            onChange: (n) => At(Number(n.currentTarget.value)),
                            children: Array.from({ length: Ti }, (n, a) => a + 1).map((n) => /* @__PURE__ */ e.jsx("option", { value: n, children: n }, n))
                          }
                        )
                      ] }),
                      pe ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: La, children: s("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-btn",
                          disabled: !C || !K || We.length === 0 || Vt > 0 || q || Se !== null,
                          onClick: () => void Ra(),
                          children: s("Run four-value sweeps ({count})", { count: We.length })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-scope", children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Suggestions computed for {population} from up to {count} frozen events.", {
                      population: (ne == null ? void 0 : ne.name) ?? s("All Events"),
                      count: Math.min(de, Dn.length).toLocaleString()
                    }) }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-evidence-mode", children: [
                      /* @__PURE__ */ e.jsx("span", { children: s("Evidence mode") }),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          "aria-label": s("Compensation evidence mode"),
                          value: He,
                          disabled: q || pe !== null || Se !== null,
                          onChange: (n) => {
                            sa(n.currentTarget.value), $t((a) => a + 1), Qe({}), cn({}), je(null);
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
                        disabled: q || pe !== null || Se !== null,
                        onClick: () => {
                          $t((n) => n + 1), Qe({}), cn({}), je(null), ge(!1), Q(
                            s(ie.length === 1 ? "Recomputed compensation suggestions for {population}. {count} flagged pair was retained." : "Recomputed compensation suggestions for {population}. {count} flagged pairs were retained.", {
                              population: (ne == null ? void 0 : ne.name) ?? s("All Events"),
                              count: ie.length
                            })
                          );
                        },
                        children: s("Recompute suggestions")
                      }
                    ),
                    /* @__PURE__ */ e.jsxs("small", { children: [
                      s(He === "biological" ? "Broad positive association is excluded because co-expression and cell size can mimic spill. High-tail shapes remain control-sensitive review prompts." : "Positive residual association may enter the shortlist only because you declared suitable control data."),
                      " ",
                      s("Sweep workers are separate from full-Apply workers.")
                    ] })
                  ] }),
                  pe && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-progress", role: "status", "aria-live": "polite", children: [
                    /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, pe.total), value: pe.completed }),
                    /* @__PURE__ */ e.jsx("span", { children: s("{completed} / {total} exact candidate solves · {workers} workers", {
                      completed: pe.completed,
                      total: pe.total,
                      workers: Et
                    }) })
                  ] }),
                  Ss && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s(Ss) }),
                  C ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": s("Add compensation pair for follow-up"), children: [
                      /* @__PURE__ */ e.jsx("strong", { children: s("Add a pair") }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
                        /* @__PURE__ */ e.jsx(
                          ri,
                          {
                            label: s("Follow-up source channel"),
                            value: Ke,
                            options: d.sourceAxisKeys.flatMap((n, a) => he.has(n) ? [{ value: n, label: oe[a].combined }] : []),
                            onChange: (n) => {
                              Cs(n), Ae === n && Tt(d.receiverAxisKeys.find((a) => a !== n && he.has(a)) ?? "");
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: s("Receiver") }),
                        /* @__PURE__ */ e.jsx(
                          ri,
                          {
                            label: s("Follow-up receiver channel"),
                            value: Ae,
                            options: d.receiverAxisKeys.flatMap((n, a) => n !== Ke && he.has(n) ? [{ value: n, label: ue[a].combined }] : []),
                            onChange: Tt
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !Ke || !Ae || Ke === Ae,
                          onClick: va,
                          children: s("Flag for follow-up")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flagged-columns", children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsx("h4", { children: s("Flagged by you ({count})", { count: We.length }) }),
                          /* @__PURE__ */ e.jsx("span", { children: s("Only these pairs are included when you run sweeps.") })
                        ] }) }),
                        We.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pairs are flagged yet. Tick “Flag for follow-up” in the inspector, add a pair above, or accept a suggestion below.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-list", children: We.map((n, a) => {
                          const c = oa[n.pairKey], u = da === n.pairKey, p = _n(n.pairKey, n.coefficient), f = Bt(n.pairKey, n.coefficient);
                          return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${Re === n.pairKey ? " is-selected" : ""}`, children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                              /* @__PURE__ */ e.jsxs(
                                "button",
                                {
                                  type: "button",
                                  className: "gl-comp-sweep-pair-head",
                                  "aria-expanded": u,
                                  onClick: () => {
                                    Ce(n.pairKey), Kn(u ? null : n.pairKey);
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
                                      shift: re(n.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: re(n.evidence.residualSlope ?? 0, 4)
                                    }) : s("visual review · residual groups insufficient") }),
                                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ e.jsx(ai, { open: u, size: 12 }) })
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
                                  onChange: (w) => Un(n.pairKey, w.currentTarget.checked)
                                }
                              ) })
                            ] }),
                            u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-body", children: [
                              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inline-bounds", children: [
                                /* @__PURE__ */ e.jsx("span", { children: s("Four values across") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  s("Lower (%)"),
                                  /* @__PURE__ */ e.jsx(Fn, { step: "0.1", value: f.lowerPercent, disabled: q || pe !== null || Se !== null, onValueChange: (w) => dt(n.pairKey, n.coefficient, "lowerPercent", w) })
                                ] }),
                                /* @__PURE__ */ e.jsx("span", { children: s("to") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  s("Upper (%)"),
                                  /* @__PURE__ */ e.jsx(Fn, { step: "0.1", value: f.upperPercent, disabled: q || pe !== null || Se !== null, onValueChange: (w) => dt(n.pairKey, n.coefficient, "upperPercent", w) })
                                ] }),
                                p.error && /* @__PURE__ */ e.jsx("small", { children: s(p.error) })
                              ] }),
                              c ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: c.values.map((w) => /* @__PURE__ */ e.jsxs(
                                "div",
                                {
                                  className: `gl-comp-sweep-value${w.isCurrent ? " is-current" : ""}${J[n.pairKey] === w.value ? " is-staged" : ""}`,
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
                                        densitySmoothing: sn
                                      }
                                    ),
                                    /* @__PURE__ */ e.jsxs("dl", { children: [
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Shift") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: s("{value} MAD", { value: re(w.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: s("Slope") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: re(w.preview.evidence.residualSlope ?? 0, 4) })
                                      ] }),
                                      d.kind === "cytof" && /* @__PURE__ */ e.jsxs("div", { children: [
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
                                        onClick: () => Wn(n.pairKey, w.value),
                                        children: s(w.isCurrent ? "Installed" : J[n.pairKey] === w.value ? "Staged" : "Use this value")
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
                            s(He === "biological" ? "Conservative suggestions" : "Control-data suggestions"),
                            " (",
                            $e.items.length,
                            ")"
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { children: s("{evaluable} evaluable of {screened} screened pairs for {population}. Inspect before flagging.", {
                            evaluable: $e.evaluableCount.toLocaleString(),
                            screened: $e.screenedCount.toLocaleString(),
                            population: (ne == null ? void 0 : ne.name) ?? s("All Events")
                          }) })
                        ] }) }),
                        $e.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: $e.items.map((n) => {
                          const a = os(n, d.kind, He);
                          return /* @__PURE__ */ e.jsxs("article", { className: Mn.has(n.pairKey) ? "is-flagged" : void 0, children: [
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
                                  /* @__PURE__ */ e.jsx("em", { className: `gl-comp-suggestion-badge is-${a.category}`, children: s(a.label) }),
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
                                  checked: Mn.has(n.pairKey),
                                  "aria-label": s("Flag suggested {source} to {receiver} for follow-up", {
                                    source: n.source.label,
                                    receiver: n.receiver.label
                                  }),
                                  onChange: (c) => Un(n.pairKey, c.currentTarget.checked)
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
                qt(),
                Ht()
              ]
            }
          ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: s(W ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : t.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
          (d || W) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": s("Advanced compensation tools"), children: [
            Zn.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Matrix evidence") }),
              W ? C ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-evidence-grid", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Profile ID") }),
                    /* @__PURE__ */ e.jsx("dd", { children: C.profileId })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Created") }),
                    /* @__PURE__ */ e.jsx("dd", { children: new Date(C.createdAt).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Matrix source") }),
                    /* @__PURE__ */ e.jsx("dd", { children: nl(C, s) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Orientation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("Source rows → receiver columns") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Imported dimensions") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{sources} sources × {receivers} receivers", {
                      sources: C.scientific.matrix.sourceChannels.length,
                      receivers: C.scientific.matrix.receiverChannels.length
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Applied solve") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{count} exact $PnN channels · {status}", {
                      count: W.includedPnns.length,
                      status: O.state
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Matrix hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: C.matrixHash, children: [
                      C.matrixHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Profile hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: C.profileHash, children: [
                      C.profileHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Provenance") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s(((ni = C.provenance) == null ? void 0 : ni.sourceDescription) ?? "No additional source note supplied") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Estimation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s(((ti = C.provenance) == null ? void 0 : ti.estimationMethod) ?? "Imported coefficients preserved exactly") })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-method-card", "aria-label": s("Installed compensation method"), children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Pipeline") }),
                    /* @__PURE__ */ e.jsx("strong", { children: s(C.scientific.kind === "cytof-spillover" ? "Original counts → NNLS → Compensated counts → arcsinh display" : "Original values → linear matrix inverse → Compensated values → display transform") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Solver") }),
                    /* @__PURE__ */ e.jsx("strong", { children: C.scientific.solverVersion }),
                    /* @__PURE__ */ e.jsx("small", { children: C.scientific.solverSettings.map(({ key: n, value: a }) => `${n}=${String(a)}`).join(" · ") })
                  ] })
                ] }),
                De && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": s("Original versus Compensated preview"), children: [
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { children: s("Original → Compensated impact") }),
                    /* @__PURE__ */ e.jsx("span", { children: s("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                      events: De.previewEvents.toLocaleString(),
                      channels: W.includedPnns.length
                    }) })
                  ] }) }),
                  /* @__PURE__ */ e.jsxs("dl", { children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Values changed") }),
                      /* @__PURE__ */ e.jsxs("dd", { children: [
                        De.changedValues.toLocaleString(),
                        " / ",
                        De.comparedValues.toLocaleString(),
                        " (",
                        rn(De.changedValues / De.comparedValues, !1, 4),
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Median |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: re(De.medianAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Maximum |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: re(De.maxAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Largest median shift") }),
                      /* @__PURE__ */ e.jsxs("dd", { title: De.mostChangedChannel, children: [
                        De.mostChangedChannel,
                        " · ",
                        re(De.mostChangedChannelMedianDelta, 5)
                      ] })
                    ] }),
                    W.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: s("Negative → zero") }),
                      /* @__PURE__ */ e.jsx("dd", { children: s("{count} preview values", { count: De.zeroedNegativeValues.toLocaleString() }) })
                    ] })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ e.jsx("p", { children: s("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
                profile: W.profileId,
                method: ht,
                count: W.includedPnns.length,
                status: O.state
              }) }) : /* @__PURE__ */ e.jsx("p", { children: s("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
                channels: le.channels.length,
                warnings: Wt.length || s("no")
              }) })
            ] }),
            Zn.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: s("Review queue") }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: s("Matrix integrity") }),
                ut.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: ut.map((n) => /* @__PURE__ */ e.jsx("li", { children: s(n) }, n)) }) : /* @__PURE__ */ e.jsx("p", { children: s("No matrix-level items currently require review.") })
              ] }),
              O.state === "ready" && d && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: s("Residual-evidence shortlist") }),
                /* @__PURE__ */ e.jsx("p", { children: s("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                  screened: $e.screenedCount.toLocaleString(),
                  candidateSuffix: $e.candidateCount > $e.screenedCount ? s(" of {count}", { count: $e.candidateCount.toLocaleString() }) : "",
                  zeroSuffix: d.kind === "cytof" ? s(", and new exact-zero pile") : "",
                  modeNote: s(He === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
                }) }),
                $e.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: $e.items.map((n) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => Js(n.sourceIndex, n.receiverIndex),
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
                        d.kind === "cytof" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
          ua && d && /* @__PURE__ */ e.jsx(
            Ui,
            {
              profileLabel: (C == null ? void 0 : C.name) ?? (Ne ? "SCE_spillover" : "embedded_FCS"),
              installedLabel: s(
                C ? "Installed matrix" : Ne ? "SCE spillover matrix" : "Embedded FCS matrix"
              ),
              installedMatrix: {
                sourceChannels: d.sourceAxisKeys,
                receiverChannels: d.receiverAxisKeys,
                matrix: d.matrix
              },
              workingMatrix: ba,
              pendingEditCount: Object.keys(J).length,
              onClose: () => Ms(!1)
            }
          ),
          ha && /* @__PURE__ */ e.jsx(
            kr,
            {
              sampleName: i,
              populationName: (ne == null ? void 0 : ne.name) ?? s("All Events"),
              filterLabel: Ls,
              pairCount: Ks.length,
              onExport: za,
              onClose: () => ks(!1)
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
function il(t, i) {
  const r = t.visible !== !1, l = i.visible !== !1;
  return r || l ? !1 : t.sample === i.sample && t.stateKey === i.stateKey;
}
const rl = v.memo(sl, il);
export {
  rl as CompensationTab
};
