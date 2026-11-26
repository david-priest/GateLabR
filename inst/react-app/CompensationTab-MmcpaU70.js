import { u as Oe, r as A, j as e, D as Zs, a as pr, l as fr, s as gr, z as xr, f as vr, M as Uo, q as en, b as Be, c as Ht, i as Bo, d as ss, e as _n, m as nt, g as br, n as Vo, h as Wo, k as yr, o as qo, p as jr, t as Te, v as Go, w as xe, x as Qs, y as wr, S as Nr, A as Cr, B as Sr, C as Ui, E as Bi, F as Vi, G as Le, H as Mr, I as kr, J as Er, T as Tr, K as Ar, L as Fr, N as Wi, O as Ir, P as $r, Q as qi, R as zs, U as Is, V as Gi, W as Hi, X as Rr, Y as Lr, Z as Pr, _ as Or, $ as _r, a0 as Dr } from "./embed-DE3p7Uql.js";
import { F as Us, e as Xi, c as Kr, h as zr, a as Yi, f as Ut, s as Ur, t as $s } from "./spilloverEstimate-BWFwderd.js";
function bt(n) {
  const t = n.trim().normalize("NFC"), a = t.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (a)
    return { element: a[1], mass: Number(a[2]) };
  const i = t.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return i ? { element: i[2], mass: Number(i[1]) } : null;
}
function Zi(n) {
  return n.map((t, a) => ({ channel: t, index: a, isotope: bt(t) })).sort((t, a) => t.isotope && a.isotope ? t.isotope.mass - a.isotope.mass || t.isotope.element.localeCompare(a.isotope.element) || t.index - a.index : t.isotope ? -1 : a.isotope ? 1 : t.index - a.index).map(({ index: t }) => t);
}
function Br(n) {
  const t = Zi(n.sourceChannels), a = Zi(n.receiverChannels);
  return {
    sourceChannels: t.map((i) => n.sourceChannels[i]),
    receiverChannels: a.map((i) => n.receiverChannels[i]),
    matrix: t.map(
      (i) => a.map((o) => n.matrix[i][o])
    )
  };
}
function et(n, t) {
  if (n === t) return "self";
  const a = bt(n), i = bt(t);
  if (!a || !i) return "other";
  const o = i.mass - a.mass;
  return a.element === i.element ? o === -1 ? "M-1" : o === 1 ? "M+1" : "same-element" : o === -1 ? "M-1" : o === 1 ? "M+1" : o === 16 ? "oxide (+16)" : "other";
}
function Xt(n, t) {
  const a = n.index(t);
  if (a !== void 0) return a;
  const i = n.channels.findIndex((o) => o.pnn === t);
  return i < 0 ? void 0 : i;
}
function Mn(n, t, a) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(t) || t <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (a && a.length !== n)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const i = a ? a.reduce((d, p) => d + (p ? 1 : 0), 0) : n, o = Math.min(i, t), l = new Uint32Array(o);
  if (o === 0) return l;
  if (!a) {
    if (o === 1) return l;
    for (let d = 0; d < o; d++)
      l[d] = Math.floor(d * (n - 1) / (o - 1));
    return l;
  }
  const c = Array.from({ length: o }, (d, p) => o === 1 ? 0 : Math.floor(p * (i - 1) / (o - 1)));
  let h = 0, m = 0;
  for (let d = 0; d < n && m < o; d++)
    a[d] && (h === c[m] && (l[m++] = d), h++);
  return l;
}
function Dn(n, t) {
  if (n.length === 0) return 0;
  const a = Math.max(0, Math.min(1, t)) * (n.length - 1), i = Math.floor(a), o = Math.ceil(a);
  return i === o ? n[i] : n[i] + (n[o] - n[i]) * (a - i);
}
function Yt(n) {
  const t = n.filter(Number.isFinite).sort((l, c) => l - c);
  if (t.length === 0) return [-1, 1];
  let a = Dn(t, 2e-3), i = Dn(t, 0.998);
  if (!(i > a)) {
    const l = Number.isFinite(a) ? a : 0, c = Math.max(1, Math.abs(l) * 0.05);
    return [l - c, l + c];
  }
  const o = (i - a) * 0.035;
  return a -= o, i += o, [a, i];
}
function rn(n) {
  if (n.length === 0) return Number.NaN;
  const t = [...n].sort((a, i) => a - i);
  return Dn(t, 0.5);
}
function Zt(n) {
  if (n.length === 0) return Number.NaN;
  const t = rn(n), a = rn(n.map((c) => Math.abs(c - t))) * 1.4826;
  if (Number.isFinite(a) && a > 0) return a;
  const i = n.reduce((c, h) => c + h, 0) / n.length, o = n.reduce((c, h) => c + (h - i) ** 2, 0) / Math.max(1, n.length - 1), l = Math.sqrt(o);
  return Number.isFinite(l) && l > 0 ? l : 1e-12;
}
function Bs(n, t, a = 12) {
  if (n.length !== t.length || n.length < a * 8) return null;
  const i = Array.from({ length: n.length }, (h, m) => m).sort((h, m) => n[h] - n[m]), o = [];
  for (let h = 0; h < a; h++) {
    const m = Math.floor(h * i.length / a), d = Math.floor((h + 1) * i.length / a), p = i.slice(m, d);
    if (p.length < 8) continue;
    const C = rn(p.map((x) => n[x])), v = rn(p.map((x) => t[x]));
    Number.isFinite(C) && Number.isFinite(v) && o.push({ x: C, y: v });
  }
  const l = [];
  for (let h = 0; h < o.length; h++)
    for (let m = h + 1; m < o.length; m++) {
      const d = o[m].x - o[h].x;
      if (d === 0) continue;
      const p = (o[m].y - o[h].y) / d;
      Number.isFinite(p) && l.push(p);
    }
  const c = rn(l);
  return Number.isFinite(c) ? c : null;
}
function Vr(n, t) {
  if (n.length !== t.length || n.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const a = Array.from({ length: n.length }, (T, O) => O).filter((T) => Number.isFinite(n[T]) && Number.isFinite(t[T])).sort((T, O) => n[T] - n[O]);
  if (a.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const i = Math.max(96, Math.floor(a.length * 0.8)), o = Math.min(a.length - 24, Math.floor(a.length * 0.9)), l = a.slice(0, i), c = a.slice(o);
  if (l.length < 96 || c.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const h = l.map((T) => n[T]), m = l.map((T) => t[T]), d = Bs(h, m, 10);
  if (d === null) return { excessMad: null, slopeDeltaMad: null };
  const p = rn(l.map((T) => t[T] - d * n[T])), C = l.map((T) => t[T] - (p + d * n[T])), v = Math.max(
    Zt(C),
    Zt(m) * 0.05,
    1e-12
  ), x = c.map((T) => t[T] - (p + d * n[T])).sort((T, O) => T - O), S = Dn(x, 0.75) / v, b = a.slice(Math.floor(a.length * 0.75)), M = b.map((T) => n[T]), k = b.map((T) => t[T]), F = Bs(M, k, 4), P = Dn(M, 0.9) - Dn(M, 0.1), f = F === null || !(P > 0) ? null : (F - d) * P / v;
  return {
    excessMad: Number.isFinite(S) ? S : null,
    slopeDeltaMad: Number.isFinite(f) ? f : null
  };
}
function Ho(n, t, a, i, o, l) {
  const c = a.length, h = Vr(a, i), m = Math.min(50, Math.max(12, Math.floor(c * 0.01))), d = (g = 0, U = 0, W = 0) => ({
    status: "insufficient",
    sourceLowEvents: g,
    sourceHighEvents: U,
    destinationNegativeEvents: W,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: h.excessMad,
    upperTailSlopeDeltaMad: h.slopeDeltaMad,
    receiverZeroDeltaFraction: c > 0 ? (l - o) / c : 0
  });
  if (c < m * 3) return d();
  const p = [...a].sort((g, U) => g - U), C = Dn(p, 0.25), v = a.flatMap((g, U) => g <= C ? [U] : []);
  if (v.length < m) return d(v.length);
  const x = v.map((g) => a[g]), S = rn(x), b = Zt(x);
  let M = a.flatMap((g, U) => g >= S + 3 * b ? [U] : []);
  if (M.length < m && (M = Array.from({ length: c }, (g, U) => U).sort((g, U) => a[U] - a[g]).slice(0, m)), M.length < m) return d(v.length, M.length);
  const k = v.map((g) => i[g]), F = rn(k), P = Zt(k), f = F + 5 * P, T = i.flatMap((g, U) => g <= f ? [U] : []), O = new Set(T), D = v.filter((g) => O.has(g)), R = M.filter((g) => O.has(g));
  if (D.length < m || R.length < m)
    return d(v.length, M.length, T.length);
  const B = (rn(R.map((g) => i[g])) - rn(D.map((g) => i[g]))) / P, q = T.map((g) => n[g]), $ = T.map((g) => t[g]);
  return {
    status: "ready",
    sourceLowEvents: v.length,
    sourceHighEvents: M.length,
    destinationNegativeEvents: T.length,
    normalizedNegativeShift: Number.isFinite(B) ? B : null,
    residualSlope: Bs(q, $),
    upperTailExcessMad: h.excessMad,
    upperTailSlopeDeltaMad: h.slopeDeltaMad,
    receiverZeroDeltaFraction: c > 0 ? (l - o) / c : 0
  };
}
function Qt(n, t, a, i, o, l) {
  let c = 0, h = 0, m = 0;
  for (let d = 0; d < a.length; d++) {
    const p = Math.abs(a[d]) <= 1e-12, C = Math.abs(i[d]) <= 1e-12;
    p && c++, C && h++, p && C && m++;
  }
  return {
    x: n.map((d) => Math.max(o[0], Math.min(o[1], d))),
    y: t.map((d) => Math.max(l[0], Math.min(l[1], d))),
    zeroPile: Object.freeze({
      source: c,
      receiver: h,
      corner: m
    })
  };
}
function Rs(n, t, a, i = {}) {
  var g;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation to compare Original and Compensated data." };
  const l = Xt(n, t), c = Xt(n, a);
  if (l === void 0 || c === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (n.fcs.nEvents === 0)
    return { ready: !1, reason: "This sample contains no events." };
  const h = ((g = i.fixedEventIndices) == null ? void 0 : g.slice()) ?? Mn(
    n.fcs.nEvents,
    i.maxEvents ?? 15e3,
    i.eventMask
  );
  for (const U of h)
    if (U >= n.fcs.nEvents || i.eventMask && !i.eventMask[U])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const m = n.channels[l].key, d = n.channels[c].key, p = n.originalColumnData(l), C = n.originalColumnData(c), v = n.compensatedColumnData(l), x = n.compensatedColumnData(c), S = [], b = [], M = [], k = [], F = [], P = [], f = [], T = [];
  for (const U of h) {
    const W = n.rawToDisplay(m, p[U]), G = n.rawToDisplay(d, C[U]), r = n.rawToDisplay(m, v[U]), le = n.rawToDisplay(d, x[U]);
    [W, G, r, le].every(Number.isFinite) && (S.push(W), b.push(G), M.push(p[U]), k.push(C[U]), F.push(r), P.push(le), f.push(v[U]), T.push(x[U]));
  }
  const O = Yt([...S, ...F]), D = Yt([...b, ...P]), R = n.channelTicks(l, [O[0], O[1]]), B = n.channelTicks(c, [D[0], D[1]]), q = Qt(
    S,
    b,
    M,
    k,
    O,
    D
  ), $ = Qt(
    F,
    P,
    f,
    T,
    O,
    D
  );
  return {
    ready: !0,
    preview: {
      eventCount: S.length,
      totalEvents: i.eventMask ? i.eligibleEventCount ?? i.eventMask.reduce((U, W) => U + (W ? 1 : 0), 0) : n.fcs.nEvents,
      xRange: O,
      yRange: D,
      xTicks: R,
      yTicks: B,
      original: q,
      compensated: $,
      evidence: Ho(
        f,
        T,
        F,
        P,
        q.zeroPile.receiver,
        $.zeroPile.receiver
      )
    }
  };
}
function Ls(n, t, a, i, o, l, c = {}) {
  const h = Xt(n, t), m = Xt(n, a);
  if (h === void 0 || m === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (o.length !== i.length || l.length !== i.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const d = n.channels[h].key, p = n.channels[m].key, C = n.originalColumnData(h), v = n.originalColumnData(m), x = [], S = [], b = [], M = [], k = [], F = [], P = [], f = [];
  for (let $ = 0; $ < i.length; $++) {
    const g = i[$];
    if (g >= n.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const U = C[g], W = v[g], G = o[$], r = l[$], le = n.rawToDisplay(d, U), J = n.rawToDisplay(p, W), ce = n.rawToDisplay(d, G), _ = n.rawToDisplay(p, r);
    [U, W, G, r, le, J, ce, _].every(Number.isFinite) && (x.push(le), S.push(J), b.push(U), M.push(W), k.push(ce), F.push(_), P.push(G), f.push(r));
  }
  const T = c.xRange ?? Yt([...x, ...k]), O = c.yRange ?? Yt([...S, ...F]), D = n.channelTicks(h, [T[0], T[1]]), R = n.channelTicks(m, [O[0], O[1]]), B = Qt(x, S, b, M, T, O), q = Qt(k, F, P, f, T, O);
  return {
    ready: !0,
    preview: {
      eventCount: x.length,
      totalEvents: c.totalEvents ?? n.fcs.nEvents,
      xRange: T,
      yRange: O,
      xTicks: D,
      yTicks: R,
      original: B,
      compensated: q,
      evidence: Ho(
        P,
        f,
        k,
        F,
        B.zeroPile.receiver,
        q.zeroPile.receiver
      )
    }
  };
}
const Qi = 0.5, Wr = 0.01, qr = 1e-4, Gr = 0.05, Hr = 3, Xr = 1, Yr = 5;
function Xo(n, t) {
  const a = n.evidence.normalizedNegativeShift ?? 0, i = n.evidence.residualSlope ?? 0, o = Math.max(0, n.evidence.upperTailExcessMad ?? 0), l = Math.max(0, n.evidence.upperTailSlopeDeltaMad ?? 0), c = Math.abs(n.coefficient), h = Math.max(
    qr,
    c * Gr
  );
  return {
    negativeShift: Math.max(0, -a),
    negativeSlope: Math.max(0, -i),
    zeroDelta: t === "cytof" ? Math.max(0, n.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, a),
    positiveSlope: Math.max(0, i),
    upperTailExcess: o,
    upperTailSlopeDelta: l,
    hasNegativeShift: a <= -Qi,
    hasNegativeSlope: i <= -h,
    hasNewZeroPile: t === "cytof" && n.evidence.receiverZeroDeltaFraction >= Wr,
    hasPositiveShift: a >= Qi,
    hasPositiveSlope: i >= h,
    hasHighTailCurve: o >= Hr && (l >= Xr || o >= Yr)
  };
}
function Zr(n) {
  return Number(n.hasNegativeShift) + Number(n.hasNegativeSlope) + Number(n.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : n.hasNewZeroPile ? "new-zero-pile" : n.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function Vs(n, t, a = "biological") {
  const i = Xo(n, t), o = i.hasNegativeShift || i.hasNegativeSlope || i.hasNewZeroPile, l = i.hasPositiveShift || i.hasPositiveSlope, c = i.hasHighTailCurve || a === "control" && l;
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
    reason: Zr(i),
    automaticFollowup: !0
  } : i.hasHighTailCurve ? a === "control" ? {
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
  } : l ? a === "control" ? {
    category: "undercompensation-like",
    label: "Undercompensation-like · control",
    detail: "Positive source-associated residual signal is present. This interpretation is valid only because control-data mode was selected.",
    reason: Number(i.hasPositiveShift) + Number(i.hasPositiveSlope) > 1 ? "multiple-undercompensation-signals" : "positive-residual-control",
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
function Sn(n, t) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  const a = t.filter((o) => Number.isFinite(o) && o > 0).sort((o, l) => o - l);
  if (a.length === 0) return 0;
  let i = 0;
  for (const o of a)
    if (o <= n) i++;
    else break;
  return i / a.length;
}
function Qr(n, t, a = "biological") {
  const i = n.map((S) => ({
    ...Xo(S, t),
    coefficient: Math.abs(S.coefficient)
  })), o = (S) => i.map((b) => typeof b[S] == "number" ? b[S] : 0), l = o("negativeShift"), c = o("negativeSlope"), h = o("zeroDelta"), m = o("positiveShift"), d = o("positiveSlope"), p = o("upperTailExcess"), C = o("upperTailSlopeDelta"), v = o("coefficient"), x = n.flatMap((S, b) => {
    const M = Vs(S, t, a);
    if (!M.automaticFollowup || M.reason === null) return [];
    const k = i[b], F = 0.22 * Sn(k.negativeShift, l) + 0.13 * Sn(k.negativeSlope, c) + 0.14 * Sn(k.zeroDelta, h) + (a === "control" ? 0.13 * Sn(k.positiveShift, m) : 0) + (a === "control" ? 0.08 * Sn(k.positiveSlope, d) : 0) + 0.12 * Sn(k.upperTailExcess, p) + 0.08 * Sn(k.upperTailSlopeDelta, C) + 0.05 * Sn(k.coefficient, v) + 0.05 * Math.max(0, Math.min(1, S.physicalPrior));
    return [{
      index: b,
      relativePriority: F,
      reason: M.reason,
      category: M.category
    }];
  });
  return Object.freeze(x.sort((S, b) => b.relativePriority - S.relativePriority || S.index - b.index));
}
const xt = 0.25, Jr = 0.1, Yo = 0.607, el = 500, nl = 60, tl = 3e3, sl = [0.5, 0.75, 0.875, 0.9375, 0.96875, 0.984375, 0.9921875, 0.9995], il = 4;
function ol(n, t) {
  const a = new Float64Array(t.length);
  for (let i = 0; i < t.length; i++) a[i] = n[t[i]];
  return a.sort();
}
function Ws(n, t) {
  if (n.length === 0) return Number.NaN;
  const a = Math.max(0, Math.min(1, t)) * (n.length - 1), i = Math.floor(a), o = Math.ceil(a);
  return n[i] + (n[o] - n[i]) * (a - i);
}
function al(n) {
  const t = n.length;
  if (t < el) return { usable: !1, reason: "few-events" };
  const a = new Uint32Array(t);
  for (let m = 0; m < t; m++) a[m] = m;
  a.sort((m, d) => n[m] - n[d]);
  const i = [];
  let o = 0;
  for (const m of sl) {
    const d = Math.min(t, Math.round(m * t));
    d > o && i.push([o, d]), o = d;
  }
  for (; i.length > 1 && i[i.length - 1][1] - i[i.length - 1][0] < nl; ) {
    const m = i.pop();
    i[i.length - 1][1] = m[1];
  }
  if (i.length < il) return { usable: !1, reason: "few-events" };
  const l = [], c = new Float64Array(i.length);
  i.forEach(([m, d], p) => {
    const C = d - m, v = Math.min(C, tl), x = new Uint32Array(v);
    for (let S = 0; S < v; S++)
      x[S] = a[m + (v === C ? S : Math.floor(S * C / v))];
    l.push(x), c[p] = Ws(ol(n, x), 0.5);
  });
  const h = c[c.length - 1] - c[0];
  return h > 0 ? { usable: !0, source: { values: n, groups: l, centres: c, span: h } } : { usable: !1, reason: "no-range" };
}
function rl(n) {
  const t = [
    76.18009172947146,
    -86.50532032941678,
    24.01409824083091,
    -1.231739572450155,
    0.001208650973866179,
    -5395239384953e-18
  ];
  let a = 1.000000000190015, i = n;
  for (const l of t) a += l / ++i;
  const o = n + 5.5;
  return (n + 0.5) * Math.log(o) - o + Math.log(2.5066282746310007 * a / n);
}
function ll(n, t) {
  if (n < 0) return 0;
  if (!(t > 0)) return 1;
  const a = Math.floor(n), i = n - a, o = Math.max(0, Math.floor(t - 12 * Math.sqrt(t) - 12));
  if (a + 1 < o) return 0;
  let l = 0, c = o * Math.log(t) - t - rl(o + 1);
  for (let h = o; h <= a + 1; h++) {
    const m = Math.exp(c);
    l += h <= a ? m : m * i, c += Math.log(t) - Math.log(h + 1);
  }
  return Math.min(1, l);
}
function cl(n, t) {
  const a = Math.max(0, n);
  let i = 0, o = a + 12 * Math.sqrt(a + 1) + 20;
  for (let l = 0; l < 60; l++) {
    const c = (i + o) / 2;
    ll(a, c) > t ? i = c : o = c;
  }
  return (i + o) / 2;
}
function dl(n, t) {
  const a = n.map((l, c) => c).sort((l, c) => n[l] - n[c]), i = t.reduce((l, c) => l + c, 0);
  let o = 0;
  for (const l of a)
    if (o += t[l], o >= i / 2) return n[l];
  return Number.NaN;
}
const ul = 3;
function Ji(n, t, a) {
  const i = n.groups.length, o = new Float64Array(i), l = new Float64Array(i);
  let c = 0, h = 0;
  for (let m = 0; m < i; m++) {
    const d = n.groups[m], p = d.length, C = n.centres[m], v = new Float64Array(p);
    for (let F = 0; F < p; F++) {
      const P = d[F];
      v[F] = t[P] - a * (n.values[P] - C);
    }
    v.sort(), o[m] = Ws(v, xt);
    const x = xt * (p - 1), S = 1.96 * Math.sqrt(p * xt * (1 - xt)), b = v[Math.max(0, Math.floor(x - S))], M = v[Math.min(p - 1, Math.ceil(x + S))];
    l[m] = Math.max((M - b) / 3.92, 1 / Math.sqrt(p));
    const k = o[m] - Ws(v, Jr);
    m === 0 && (c = k / Yo), m === i - 1 && (h = k);
  }
  return { floors: o, sigmas: l, referenceSpread: c, topWidth: h };
}
function eo(n, { floors: t, sigmas: a }) {
  const i = [], o = [];
  for (let l = 0; l < t.length; l++)
    for (let c = l + 1; c < t.length; c++) {
      const h = n.centres[c] - n.centres[l];
      h > 0 && (i.push((t[c] - t[l]) / h), o.push(h / Math.hypot(a[l], a[c])));
    }
  return dl(i, o);
}
function hl(n, t) {
  const a = n.groups.length;
  let i = Ji(n, t, 0), o = eo(n, i);
  for (let R = 0; R < ul; R++) {
    i = Ji(n, t, o);
    const B = eo(n, i), q = Math.abs(B - o) <= 1e-6 + 1e-3 * Math.abs(o);
    if (o = B, q) break;
  }
  const { floors: l, sigmas: c, referenceSpread: h, topWidth: m } = i;
  let d = 0, p = 0, C = 0;
  for (let R = 0; R < a; R++) {
    const B = 1 / c[R] ** 2;
    d += B, p += B * n.centres[R], C += B * l[R];
  }
  const v = p / d, x = C / d;
  let S = 0, b = 0;
  for (let R = 0; R < a; R++) {
    const B = 1 / c[R] ** 2;
    S += B * (n.centres[R] - v) ** 2, b += B * (n.centres[R] - v) * (l[R] - x);
  }
  const M = S > 0 ? b / S : 0;
  let k = 0;
  for (let R = 0; R < a; R++) {
    const B = l[R] - (x + M * (n.centres[R] - v));
    k += (B / c[R]) ** 2;
  }
  const F = k / Math.max(1, a - 2), P = S > 0 ? Math.sqrt(Math.max(1, F) / S) : Number.POSITIVE_INFINITY, f = Math.max(0, o * n.span), T = cl(f, xt), O = T / n.span + 1.96 * P, D = Yo * Math.sqrt(h ** 2 + Math.max(1, T));
  return {
    slope: o,
    standardError: P,
    upperBound: O,
    referenceFloor: l[0],
    referenceSpread: h,
    tightness: m / D,
    misfit: F,
    span: n.span,
    groupCount: a,
    points: Array.from(l, (R, B) => ({ source: n.centres[B], floor: R }))
  };
}
const Zo = Object.freeze({
  minimumCounts: 10,
  ratioMargin: 1.5,
  absoluteMargin: 2e-3,
  tightnessLimit: 3,
  plausibleMaximum: 0.1,
  dimLimit: 0.01,
  pairs: "physical"
}), no = {
  "above-data": 0,
  "below-floor": 0,
  "upper-bound-only": 1,
  consistent: 2,
  "too-dim": 3
};
function ml(n) {
  var l;
  const t = ((l = n.marker) == null ? void 0 : l.trim()) ?? "";
  if (t === "" || t === n.pnn) return !0;
  const a = bt(n.pnn), i = bt(t);
  return !a || !i || a.element !== i.element || a.mass !== i.mass ? !1 : t.replace(String(i.mass), "").replace(i.element, "").replace(/Di\b/, "").replace(/[\s_()\-]/g, "") === "";
}
function Qo(n, t, a) {
  const i = new Map(t.sourceChannels.map((h, m) => [h, m])), o = new Map(t.receiverChannels.map((h, m) => [h, m])), l = (h, m) => {
    var v;
    const d = i.get(h), p = o.get(m);
    if (d === void 0 || p === void 0) return 0;
    const C = (v = t.matrix[d]) == null ? void 0 : v[p];
    return Number.isFinite(C) ? C : 0;
  }, c = new Set(n.channels.map((h) => h.pnn));
  return {
    data: n,
    settings: a,
    coefficient: l,
    sources: t.sourceChannels.filter((h) => c.has(h)),
    receivers: t.receiverChannels.filter((h) => c.has(h)),
    unlabelled: new Set(n.channels.filter(ml).map((h) => h.pnn)),
    spillIn: /* @__PURE__ */ new Map(),
    own: /* @__PURE__ */ new Map(),
    emitters: t.sourceChannels.filter((h) => c.has(h))
  };
}
function is(n, t) {
  const a = n.own.get(t);
  if (a) return a;
  const i = n.data.values(t);
  if (!i) return null;
  const o = Float64Array.from(i);
  for (const l of n.emitters) {
    if (l === t) continue;
    const c = n.coefficient(l, t);
    if (!(c > 0)) continue;
    const h = n.data.values(l);
    if (h)
      for (let m = 0; m < o.length; m++) o[m] -= c * h[m];
  }
  return n.own.set(t, o), o;
}
function Jo(n, t) {
  const a = n.spillIn.get(t);
  if (a) return a;
  const i = new Float64Array(n.data.eventCount);
  for (const o of n.emitters) {
    if (o === t) continue;
    const l = n.coefficient(o, t);
    if (!(l > 0)) continue;
    const c = is(n, o);
    if (c)
      for (let h = 0; h < i.length; h++) i[h] += l * c[h];
  }
  return n.spillIn.set(t, i), i;
}
function pl(n, t, a, i) {
  const o = Math.max(0, a.slope - 1.96 * a.standardError), l = i.minimumCounts / a.span, c = { floorLower: o, detectionLimit: l, upperBoundReason: null };
  if (n - a.upperBound > i.absoluteMargin && n > a.upperBound * i.ratioMargin && n >= l) return { ...c, verdict: "above-data" };
  if (o - n > i.absoluteMargin && o > n * i.ratioMargin && o - n >= l) {
    const C = t !== "other" && t !== "self" ? a.slope > i.plausibleMaximum ? "above-plausible" : a.tightness > i.tightnessLimit ? "wide-floor" : null : "no-physical-route";
    return C ? { ...c, verdict: "upper-bound-only", upperBoundReason: C } : { ...c, verdict: "below-floor" };
  }
  return (n > 0 ? n < l : l > i.dimLimit) ? { ...c, verdict: "too-dim" } : a.upperBound > i.plausibleMaximum && n <= i.plausibleMaximum ? { ...c, verdict: "upper-bound-only", upperBoundReason: "loose-bound" } : { ...c, verdict: "consistent" };
}
function fl(n, t, a, i) {
  const { data: o, settings: l } = n, c = is(n, t), h = [], m = new Float64Array(o.eventCount);
  for (const d of n.receivers) {
    if (d === t || i && !i(t, d)) continue;
    const p = n.coefficient(t, d), C = et(t, d), v = C !== "other" && C !== "self";
    if (l.pairs === "physical" && !v && !(p > 0)) continue;
    const x = o.values(d);
    if (!x) continue;
    const S = Jo(n, d);
    for (let F = 0; F < m.length; F++)
      m[F] = x[F] - S[F] + p * c[F];
    const b = hl(a, m), M = pl(p, C, b, l), k = Math.max(1, b.referenceSpread);
    h.push({
      source: t,
      receiver: d,
      coefficient: p,
      interaction: C,
      receiverUnlabelled: n.unlabelled.has(d),
      floor: b,
      ...M,
      impact: M.verdict === "above-data" ? (p - b.upperBound) * b.span / k : M.verdict === "below-floor" || M.verdict === "upper-bound-only" ? (b.slope - p) * b.span / k : 0
    });
  }
  return h;
}
function gl(n, t) {
  const a = n.flatMap((d) => d.interaction !== "oxide (+16)" || !(d.coefficient > 0) || !d.floor ? [] : d.coefficient < (d.detectionLimit ?? 1 / 0) ? [] : d.floor.tightness > t.tightnessLimit ? [] : d.floor.slope > t.plausibleMaximum ? [] : [{ source: d.source, receiver: d.receiver, ratio: d.floor.slope / d.coefficient }]);
  if (a.length === 0) return null;
  const i = a.map((d) => d.ratio).sort((d, p) => d - p), o = i.length / 2, l = i.length % 2 === 1 ? i[Math.floor(o)] : (i[o - 1] + i[o]) / 2, c = i[0], h = i[i.length - 1], m = c > t.ratioMargin || h < 1 / t.ratioMargin;
  return {
    pairs: a,
    ratio: l,
    lowestRatio: c,
    highestRatio: h,
    shared: a.length >= 2 && m && c > 0 && h / c <= 1.5
  };
}
function xl(n, t, a = {}, i = {}) {
  const o = { ...Zo, ...a }, l = Qo(n, t, o), c = i.only, h = c ? { ...l, sources: l.sources.filter((C) => l.receivers.some((v) => c(C, v))) } : l, m = [], d = [];
  let p = 0;
  return {
    stepCount: h.sources.length,
    step() {
      if (p >= h.sources.length) return !1;
      const C = h.sources[p++], v = al(is(h, C));
      return v.usable ? m.push(...fl(h, C, v.source, c)) : d.push({ source: C, reason: v.reason }), p < h.sources.length;
    },
    result() {
      return {
        pairs: [...m].sort((v, x) => no[v.verdict] - no[x.verdict] || x.impact - v.impact || x.coefficient - v.coefficient),
        oxide: gl(m, o),
        eventCount: n.eventCount,
        unreadSources: d,
        settings: o
      };
    }
  };
}
function ea(n) {
  return n.floor ? n.verdict === "above-data" ? n.floor.upperBound : n.verdict === "below-floor" ? Math.max(0, n.floor.slope) : null : null;
}
function vl(n, t, a, i) {
  const o = Qo(n, t, Zo), l = is(o, a), c = n.values(i);
  if (!l || !c) return null;
  const h = Jo(o, i), m = o.coefficient(a, i), d = new Float64Array(n.eventCount);
  for (let p = 0; p < d.length; p++)
    d[p] = c[p] - h[p] + m * l[p];
  return { source: l, receiver: d };
}
const Bt = 300, Xn = 230, Ee = { left: 38, right: 8, top: 8, bottom: 30 }, na = 5, bl = 3500, yl = 1500, to = [0, 10, 100, 1e3, 1e4, 1e5], Rn = (n) => Math.asinh(n / na);
function so(n) {
  return n >= 1e3 ? `${n / 1e3}k` : String(n);
}
function jl({ pair: n, events: t, sourceLabel: a, receiverLabel: i }) {
  const { t: o } = Oe(), l = n.floor, c = A.useMemo(() => {
    var $;
    if (!l) return null;
    const m = t.source.length, d = (($ = l.points[1]) == null ? void 0 : $.source) ?? 0, p = [], C = [];
    for (let g = 0; g < m; g++) (t.source[g] > d ? p : C).push(g);
    const v = (g, U) => g.length <= U ? g : Array.from({ length: U }, (W, G) => g[Math.floor(G * g.length / U)]), x = [...v(C, yl), ...v(p, bl)], S = l.points[l.points.length - 1], b = Rn(Math.max(20, S.source * 4));
    let M = Math.max(20, S.floor * 4, n.coefficient * S.source * 2);
    const k = x.map((g) => t.receiver[g]).sort((g, U) => g - U);
    M = Math.max(M, k[Math.floor(k.length * 0.98)] ?? 0);
    const F = Rn(Math.min(0, k[Math.floor(k.length * 5e-3)] ?? 0)), P = Rn(M), f = Bt - Ee.left - Ee.right, T = Xn - Ee.top - Ee.bottom, O = (g) => Ee.left + Math.max(0, Math.min(1, Rn(g) / b)) * f, D = (g) => Ee.top + (1 - Math.max(0, Math.min(1, (Rn(g) - F) / (P - F)))) * T, R = x.map((g) => `M${O(t.source[g]).toFixed(1)} ${D(t.receiver[g]).toFixed(1)}h0`).join(""), B = l.points[0], q = (g) => {
      let W = "";
      for (let G = 0; G <= 48; G++) {
        const r = na * Math.sinh(b * G / 48), le = B.floor + g * (r - B.source);
        W += `${G === 0 ? "M" : "L"}${O(r).toFixed(1)} ${D(le).toFixed(1)}`;
      }
      return W;
    };
    return {
      points: R,
      matrixLine: q(n.coefficient),
      boundLine: q(l.upperBound),
      floors: l.points.map((g) => ({ x: O(g.source), y: D(g.floor) })),
      xTicks: to.filter((g) => Rn(g) <= b).map((g) => ({ tick: g, at: O(g) })),
      yTicks: to.filter((g) => Rn(g) <= P).map((g) => ({ tick: g, at: D(g) }))
    };
  }, [t, l, n.coefficient]);
  if (!l || !c) return null;
  const h = (m) => `${(m * 100).toFixed(2)}%`;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-floor-plot", children: [
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        viewBox: `0 0 ${Bt} ${Xn}`,
        role: "img",
        "aria-label": o("Receiver floor against source signal for {source} to {receiver}: matrix {matrix}, events allow at most {bound}", {
          source: a,
          receiver: i,
          matrix: h(n.coefficient),
          bound: h(l.upperBound)
        }),
        children: [
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              className: "gl-comp-floor-frame",
              x: Ee.left,
              y: Ee.top,
              width: Bt - Ee.left - Ee.right,
              height: Xn - Ee.top - Ee.bottom
            }
          ),
          /* @__PURE__ */ e.jsx("path", { className: "gl-comp-floor-events", d: c.points }),
          /* @__PURE__ */ e.jsx("path", { className: "gl-comp-floor-bound", d: c.boundLine }),
          /* @__PURE__ */ e.jsx("path", { className: "gl-comp-floor-matrix", d: c.matrixLine }),
          c.floors.map((m, d) => /* @__PURE__ */ e.jsx("circle", { className: "gl-comp-floor-point", cx: m.x, cy: m.y, r: 3 }, d)),
          c.xTicks.map(({ tick: m, at: d }) => /* @__PURE__ */ e.jsx("text", { className: "gl-comp-floor-tick", x: d, y: Xn - Ee.bottom + 11, textAnchor: "middle", children: so(m) }, `x${m}`)),
          c.yTicks.map(({ tick: m, at: d }) => /* @__PURE__ */ e.jsx("text", { className: "gl-comp-floor-tick", x: Ee.left - 4, y: d + 3, textAnchor: "end", children: so(m) }, `y${m}`)),
          /* @__PURE__ */ e.jsx("text", { className: "gl-comp-floor-axis", x: Ee.left + (Bt - Ee.left - Ee.right) / 2, y: Xn - 4, textAnchor: "middle", children: o("{channel} (counts)", { channel: a }) }),
          /* @__PURE__ */ e.jsx("text", { className: "gl-comp-floor-axis", transform: `translate(9 ${Ee.top + (Xn - Ee.top - Ee.bottom) / 2}) rotate(-90)`, textAnchor: "middle", children: o("{channel} (counts)", { channel: i }) })
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
        o("Matrix {value}", { value: h(n.coefficient) })
      ] }),
      /* @__PURE__ */ e.jsxs("span", { children: [
        /* @__PURE__ */ e.jsx("i", { className: "is-bound", "aria-hidden": "true" }),
        o("Most the events allow {value}", { value: h(l.upperBound) })
      ] })
    ] })
  ] });
}
function He(n) {
  const t = n * 100;
  return `${t.toFixed(Math.abs(t) >= 10 ? 1 : 2)}%`;
}
function wl(n) {
  const t = n.floor;
  if (!t || n.floorLower === null || n.detectionLimit === null) return { text: "not read", values: {} };
  const a = He(t.upperBound), i = He(n.floorLower);
  switch (n.verdict) {
    case "above-data":
    case "upper-bound-only":
      return { text: "at most {bound}", values: { bound: a } };
    case "below-floor":
      return { text: "{lower} to {bound}", values: { lower: i, bound: a } };
    case "too-dim":
      return { text: "readable from {limit}", values: { limit: He(n.detectionLimit) } };
    case "consistent":
      return n.coefficient > 0 ? { text: "{lower} to {bound}", values: { lower: i, bound: a } } : { text: "below {bound}", values: { bound: He(Math.max(t.upperBound, n.detectionLimit)) } };
  }
}
function ta(n) {
  const t = n.floor, a = {
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
        values: a
      };
    case "below-floor":
      return n.coefficient > 0 ? {
        tone: "below",
        label: "Matrix below the floor",
        detail: "The receiver's floor rises with the source by {floor} ({lower} to {bound}); the matrix value is {matrix}.",
        values: a
      } : {
        tone: "below",
        label: "Possible missing coefficient",
        detail: "The receiver's floor rises with the source by {floor} ({lower} to {bound}) on a pair with a physical route ({route}); the matrix holds no value.",
        values: a
      };
    case "upper-bound-only":
      return {
        tone: "bound",
        label: "Upper bound only",
        detail: n.upperBoundReason === "loose-bound" ? "These events only cap the coefficient at {bound}, above any spillover expected between two masses, so they neither support nor contradict the matrix value ({matrix})." : n.upperBoundReason === "no-physical-route" ? "The receiver follows the source, but these masses have no physical route for spillover: read as a marker on the same cells. The events cap the coefficient at {bound}." : n.upperBoundReason === "above-plausible" ? "The receiver rises with the source by {floor}, steeper than spillover: a marker on the same cells. The events cap the coefficient at {bound}; a population without the receiver's marker could read it." : "The receiver's marker is on the source's bright cells, so the events only cap the coefficient at {bound}. A population without the receiver's marker could read it.",
        values: a
      };
    case "consistent":
      return {
        tone: "consistent",
        label: "Consistent",
        detail: n.coefficient <= 0 ? "No spillover is seen in these events; one of {limit} or more would show." : t && n.floorLower !== null && n.coefficient >= n.floorLower && n.coefficient <= t.upperBound ? "The matrix value ({matrix}) lies within what these events support ({lower} to {bound})." : "The matrix value ({matrix}) is outside what these events support ({lower} to {bound}), but by less than the screen's margin.",
        values: a
      };
    case "too-dim":
      return {
        tone: "dim",
        label: "Source too dim",
        detail: n.coefficient > 0 ? "The source is not bright enough in these events to read the matrix value ({matrix}); a coefficient of {limit} or more would show." : "The source is not bright enough in these events to read this pair; only a coefficient of {limit} or more would show.",
        values: a
      };
  }
}
const io = {
  attention: ["above-data", "below-floor"],
  bound: ["upper-bound-only"],
  consistent: ["consistent"],
  dim: ["too-dim"],
  all: ["above-data", "below-floor", "upper-bound-only", "consistent", "too-dim"]
}, oo = {
  attention: "Needs a look",
  bound: "Upper bound only",
  consistent: "Consistent",
  dim: "Too dim",
  all: "All pairs"
};
function Nl({
  state: n,
  channelLabel: t,
  populationName: a,
  selected: i,
  onSelect: o,
  isStaged: l,
  canStage: c,
  onStage: h,
  onRunAgain: m
}) {
  var P;
  const { t: d } = Oe(), [p, C] = A.useState("attention"), v = n.result, x = A.useMemo(() => {
    const f = { attention: 0, bound: 0, consistent: 0, dim: 0, all: 0 };
    for (const T of (v == null ? void 0 : v.pairs) ?? []) {
      f.all++;
      for (const O of ["attention", "bound", "consistent", "dim"])
        io[O].includes(T.verdict) && f[O]++;
    }
    return f;
  }, [v]), S = A.useMemo(
    () => ((v == null ? void 0 : v.pairs) ?? []).filter((f) => io[p].includes(f.verdict)),
    [p, v]
  ), b = (P = v == null ? void 0 : v.oxide) != null && P.shared ? v.oxide : null, M = A.useMemo(() => !b || !v ? [] : v.pairs.filter((f) => f.interaction === "oxide (+16)" && f.coefficient > 0).map((f) => ({ source: f.source, receiver: f.receiver, value: f.coefficient * b.ratio })), [b, v]), k = n.status === "running", F = (f) => {
    const T = ta(f), O = wl(f), D = ea(f), R = (i == null ? void 0 : i.source) === f.source && i.receiver === f.receiver, B = l(f.source, f.receiver), q = `${t(f.source)} → ${t(f.receiver)}`;
    return /* @__PURE__ */ e.jsxs(
      "tr",
      {
        className: `${R ? "is-selected" : ""}${B ? " is-staged" : ""}`,
        "aria-selected": R,
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
          /* @__PURE__ */ e.jsx("td", { className: "is-number", children: d(O.text, O.values) }),
          /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx("span", { className: `gl-comp-screen-reading is-${T.tone}`, title: d(T.detail, T.values), children: d(T.label) }) }),
          /* @__PURE__ */ e.jsx("td", { children: D !== null && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: !c,
              "aria-label": d("Stage {value} for {pair}", { value: He(D), pair: q }),
              onClick: ($) => {
                $.stopPropagation(), o(f.source, f.receiver), h([{ source: f.source, receiver: f.receiver, value: D }]);
              },
              children: d("Stage {value}", { value: He(D) })
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
      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-actions", children: /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: k, onClick: m, children: d("Read again") }) })
    ] }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-screen-scope", role: "status", "aria-live": "polite", children: [
      k ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
        /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, n.total), value: n.completed }),
        /* @__PURE__ */ e.jsx("span", { children: d("Reading {completed} of {total} source channels…", { completed: n.completed, total: n.total }) })
      ] }) : v ? /* @__PURE__ */ e.jsx("span", { children: d("{pairs} pairs read from {events} events of {population}.", {
        pairs: v.pairs.length.toLocaleString(),
        events: v.eventCount.toLocaleString(),
        population: a ?? d("All Events")
      }) }) : /* @__PURE__ */ e.jsx("span", { children: d("Not read yet.") }),
      a === null && /* @__PURE__ */ e.jsx("small", { children: d("Every event is in scope. Beads, debris and doublets carry signal in many channels at once and can be read as spillover: choose a population of single cells under Review scope.") }),
      v && v.unreadSources.length > 0 && /* @__PURE__ */ e.jsx("small", { children: d("{count} source channels could not be read (too few events, or no range): {channels}", {
        count: v.unreadSources.length,
        channels: v.unreadSources.map(({ source: f }) => t(f)).join(", ")
      }) })
    ] }),
    b && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-screen-oxide", children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("strong", { children: d("Oxide (+16) pairs share a factor of {ratio}", { ratio: b.ratio.toFixed(2) }) }),
        /* @__PURE__ */ e.jsx("span", { children: d("Across {count} oxide pairs these events support {low} to {high} times the matrix value. Oxide formation follows the run's plasma conditions, so a matrix from another run can be off by one factor in every oxide pair.", {
          count: b.pairs.length,
          low: b.lowestRatio.toFixed(2),
          high: b.highestRatio.toFixed(2)
        }) })
      ] }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-mini-btn",
          disabled: !c || M.length === 0,
          onClick: () => h(M),
          children: d("Stage {count} oxide values × {ratio}", { count: M.length, ratio: b.ratio.toFixed(2) })
        }
      )
    ] }),
    v && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-screen-filters", role: "tablist", "aria-label": d("Pairs by reading"), children: Object.keys(oo).map((f) => /* @__PURE__ */ e.jsxs(
        "button",
        {
          type: "button",
          role: "tab",
          "aria-selected": p === f,
          className: `gl-chip${p === f ? " active" : ""}`,
          onClick: () => C(f),
          children: [
            d(oo[f]),
            " (",
            x[f],
            ")"
          ]
        },
        f
      )) }),
      S.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: d(p === "attention" ? "No pair's matrix value disagrees with these events." : "No pair has this reading.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-screen-table-wrap", children: /* @__PURE__ */ e.jsxs("table", { className: "gl-comp-screen-table", children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { scope: "col", children: d("Source → receiver") }),
          /* @__PURE__ */ e.jsx("th", { scope: "col", className: "is-number", children: d("Matrix") }),
          /* @__PURE__ */ e.jsx("th", { scope: "col", className: "is-number", children: d("Events support") }),
          /* @__PURE__ */ e.jsx("th", { scope: "col", children: d("Reading") }),
          /* @__PURE__ */ e.jsx("th", { scope: "col", children: /* @__PURE__ */ e.jsx("span", { className: "gl-sr-only", children: d("Stage") }) })
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: S.map(F) })
      ] }) })
    ] })
  ] });
}
function Cl(n, t) {
  const a = new Map(n.channels.map((o, l) => [o.pnn, l])), i = /* @__PURE__ */ new Map();
  return {
    eventCount: t.length,
    channels: n.channels.map((o) => ({ pnn: o.pnn, marker: o.marker })),
    values(o) {
      const l = i.get(o);
      if (l) return l;
      const c = a.get(o);
      if (c === void 0) return null;
      const h = n.originalColumnData(c), m = new Float64Array(t.length);
      for (let d = 0; d < m.length; d++) m[d] = h[t[d]];
      return i.set(o, m), m;
    }
  };
}
const Sl = 12, ao = { status: "idle", completed: 0, total: 0, result: null, data: null };
function Ml(n) {
  const { enabled: t, sample: a, eventIndices: i, matrix: o, revision: l } = n, [c, h] = A.useState(ao), m = A.useRef(null);
  return A.useEffect(() => {
    if (!o) {
      m.current = null, h(ao);
      return;
    }
    if (!t) return;
    const d = [a, i, o, l];
    if (m.current && d.every((M, k) => M === m.current[k])) return;
    let p = !1, C = null;
    const v = Cl(a, i), x = xl(v, o);
    let S = 0;
    h((M) => ({ ...M, status: "running", completed: 0, total: x.stepCount }));
    const b = () => {
      if (p) return;
      const M = performance.now();
      let k = !0;
      for (; k && performance.now() - M < Sl; )
        k = x.step(), S++;
      if (k) {
        h((F) => ({ ...F, status: "running", completed: S, total: x.stepCount })), C = setTimeout(b, 0);
        return;
      }
      m.current = d, h({ status: "done", completed: x.stepCount, total: x.stepCount, result: x.result(), data: v });
    };
    return C = setTimeout(b, 0), () => {
      p = !0, C !== null && clearTimeout(C);
    };
  }, [t, i, o, l, a]), c;
}
function kl(n, t) {
  const a = n.index(t);
  if (a !== void 0) return a;
  const i = n.channels.findIndex((o) => o.pnn === t);
  return i < 0 ? void 0 : i;
}
function qs(n, t) {
  if (n.length === 0) return 0;
  const a = Math.max(0, Math.min(1, t)) * (n.length - 1), i = Math.floor(a), o = Math.ceil(a);
  return i === o ? n[i] : n[i] + (n[o] - n[i]) * (a - i);
}
function El(n) {
  const t = n.filter(Number.isFinite).sort((l, c) => l - c);
  if (t.length === 0) return [-1, 1];
  let a = qs(t, 2e-3), i = qs(t, 0.998);
  if (!(i > a)) {
    const l = Number.isFinite(a) ? a : 0, c = Math.max(1, Math.abs(l) * 0.05);
    return [l - c, l + c];
  }
  const o = (i - a) * 0.035;
  return a -= o, i += o, [a, i];
}
function Tl(n) {
  if (n.length === 0) return "0:empty";
  let t = 2166136261;
  for (const a of n)
    t ^= a, t = Math.imul(t, 16777619) >>> 0;
  return `${n.length}:${n[0]}:${n[n.length - 1]}:${t.toString(16)}`;
}
function Al(n, t, a = {}) {
  var h;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const o = ((h = a.fixedEventIndices) == null ? void 0 : h.slice()) ?? Mn(
    n.fcs.nEvents,
    a.maxEvents ?? 2500,
    a.eventMask
  );
  for (const m of o)
    if (m >= n.fcs.nEvents || a.eventMask && !a.eventMask[m])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const l = /* @__PURE__ */ new Map();
  for (const m of Array.from(new Set(t))) {
    const d = kl(n, m);
    if (d === void 0) continue;
    const p = n.channels[d], C = n.originalColumnData(d), v = n.compensatedColumnData(d), x = new Float64Array(o.length), S = new Float64Array(o.length), b = new Float64Array(o.length), M = new Float64Array(o.length), k = [];
    for (let f = 0; f < o.length; f++) {
      const T = o[f], O = C[T], D = v[T], R = n.rawToDisplay(p.key, O), B = n.rawToDisplay(p.key, D);
      x[f] = O, S[f] = D, b[f] = R, M[f] = B, Number.isFinite(R) && k.push(R), Number.isFinite(B) && k.push(B);
    }
    const F = El(k), P = Object.freeze({
      key: p.key,
      pnn: p.pnn,
      range: F,
      ticks: n.channelTicks(d, [F[0], F[1]]),
      originalRaw: x,
      compensatedRaw: S,
      originalDisplay: b,
      compensatedDisplay: M
    });
    l.set(m, P), l.set(p.key, P), l.set(p.pnn, P);
  }
  const c = a.eventMask ? a.eligibleEventCount ?? a.eventMask.reduce((m, d) => m + (d ? 1 : 0), 0) : n.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: o,
      eventSignature: Tl(o),
      eligibleEventCount: c,
      channels: l
    })
  };
}
function ro(n, t, a, i, o, l, c) {
  const h = [], m = [];
  let d = 0, p = 0, C = 0;
  for (const v of o) {
    h.push(Math.max(l[0], Math.min(l[1], n[v]))), m.push(Math.max(c[0], Math.min(c[1], t[v])));
    const x = Math.abs(a[v]) <= 1e-12, S = Math.abs(i[v]) <= 1e-12;
    x && d++, S && p++, x && S && C++;
  }
  return {
    x: h,
    y: m,
    zeroPile: Object.freeze({ source: d, receiver: p, corner: C })
  };
}
function sa(n, t, a) {
  const i = n.channels.get(t), o = n.channels.get(a);
  if (!i || !o)
    return { ready: !1, reason: "One or both channels are absent from the frozen global-inspector dataset." };
  const l = [];
  for (let c = 0; c < n.eventIndices.length; c++)
    [
      i.originalDisplay[c],
      o.originalDisplay[c],
      i.compensatedDisplay[c],
      o.compensatedDisplay[c]
    ].every(Number.isFinite) && l.push(c);
  return {
    ready: !0,
    preview: Object.freeze({
      eventCount: l.length,
      totalEvents: n.eligibleEventCount,
      eventSignature: n.eventSignature,
      xRange: i.range,
      yRange: o.range,
      xTicks: i.ticks,
      yTicks: o.ticks,
      original: ro(
        i.originalDisplay,
        o.originalDisplay,
        i.originalRaw,
        o.originalRaw,
        l,
        i.range,
        o.range
      ),
      compensated: ro(
        i.compensatedDisplay,
        o.compensatedDisplay,
        i.compensatedRaw,
        o.compensatedRaw,
        l,
        i.range,
        o.range
      )
    })
  };
}
function lo(n, t, a, i, o) {
  const l = Math.max(1, Math.min(24, Math.round(o) || 3)), c = 256, h = l, m = c + 2 * h, d = new Float64Array(m * m), p = Math.max(1e-12, t[1] - t[0]), C = Math.max(1e-12, a[1] - a[0]);
  for (let k = 0; k < n.x.length; k++) {
    const F = Math.max(0, Math.min(
      m - 1,
      Math.floor((n.x[k] - t[0]) / p * c) + h
    )), P = Math.max(0, Math.min(
      m - 1,
      Math.floor((n.y[k] - a[0]) / C * c) + h
    ));
    d[P * m + F]++;
  }
  const v = new Float64Array(m * m), x = (l * 2 + 1) ** 2, S = m + 1, b = new Float64Array(S * S);
  for (let k = 0; k < m; k++) {
    let F = 0;
    for (let P = 0; P < m; P++)
      F += d[k * m + P], b[(k + 1) * S + P + 1] = b[k * S + P + 1] + F;
  }
  for (let k = l; k < m - l; k++) {
    const F = k - l, P = k + l + 1;
    for (let f = l; f < m - l; f++) {
      const T = f - l, O = f + l + 1, D = b[P * S + O] - b[F * S + O] - b[P * S + T] + b[F * S + T];
      v[k * m + f] = D / x;
    }
  }
  const M = [];
  for (let k = h; k < h + c; k++)
    for (let F = h; F < h + c; F++) {
      const P = v[k * m + F];
      P > 0 && M.push(P);
    }
  return M.sort((k, F) => k - F), M.length === 0 ? 1 : Math.max(1e-12, qs(M, i));
}
function Js(n, t) {
  const a = Math.max(1, Math.min(10, Number.isFinite(n) ? n : 6)), i = Math.max(1, (Number.isFinite(t) ? t : 220) - 50);
  return Math.max(1, Math.min(24, a * 170 / i));
}
function ei(n, t = 0.95, a = 3, i = Zs) {
  const o = Math.max(
    lo(n.original, n.xRange, n.yRange, t, a),
    lo(n.compensated, n.xRange, n.yRange, t, a)
  );
  return pr(o, i);
}
function Jt(n, t) {
  const a = t.size / 220, i = Math.sqrt(a), o = Math.max(9, Math.min(12, 11 * i)), l = Math.max(10, Math.min(13, 12 * i));
  fr().renderMiniPlot(n, {
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
    point_size: Math.max(0.55, Math.min(1.2, 1.15 * a)) * (t.pointSize ?? 1),
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
      title: Math.max(10, Math.min(13, 12 * i)),
      gate_label: o
    }
  });
}
const Pn = "http://www.w3.org/2000/svg", vt = 6, On = 1123, yt = 794;
function ia(n) {
  return Math.ceil(Math.max(0, Math.floor(n)) / vt);
}
function co(n) {
  return n.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function oa(n, t) {
  return `gatelab-compensation-${co(n.replace(/\.[^.]+$/, ""))}-${co(t)}`;
}
function Gs(n, t, a, i) {
  const o = oa(n, t);
  return a === "pdf" || i <= 1 ? `${o}.${a}` : `${o}-${a}-pages.zip`;
}
function Yn(n, t, a, i, o = {}) {
  const l = document.createElementNS(Pn, "text");
  return l.setAttribute("x", String(a)), l.setAttribute("y", String(i)), l.setAttribute("font-family", "Arial, Helvetica, sans-serif"), l.setAttribute("font-size", String(o.size ?? 10)), l.setAttribute("font-weight", String(o.weight ?? 400)), l.setAttribute("fill", o.fill ?? "#253247"), o.anchor && l.setAttribute("text-anchor", o.anchor), l.textContent = t, n.appendChild(l), l;
}
function uo(n, t) {
  return n.length <= t ? n : `${n.slice(0, Math.max(1, t - 1))}…`;
}
function ho(n, t, a, i, o, l, c, h, m, d, p, C) {
  const v = document.createElement("div");
  Jt(v, {
    title: i === "original" ? "Original" : "Compensated",
    panel: a[i],
    preview: a,
    sourceLabel: t.sourceLabel,
    receiverLabel: t.receiverLabel,
    size: c,
    densityColorCeiling: m,
    densitySmoothingRadius: h,
    densityColorPower: d,
    pointAlpha: p,
    pointSize: C,
    canvasScale: 300 / 96
  });
  const x = v.querySelector("canvas"), S = v.querySelector("svg");
  if (!x || !S) throw new Error("GateLab could not render a compensation export panel.");
  const b = document.createElementNS(Pn, "g");
  b.setAttribute("transform", `translate(${o},${l})`);
  const M = document.createElementNS(Pn, "image");
  M.setAttribute("x", "0"), M.setAttribute("y", "0"), M.setAttribute("width", String(c)), M.setAttribute("height", String(c)), M.setAttribute("href", x.toDataURL("image/png")), b.appendChild(M), b.appendChild(S.cloneNode(!0)), n.appendChild(b);
}
function mo(n, t, a, i) {
  const o = document.createElementNS(Pn, "svg");
  o.setAttribute("xmlns", Pn), o.setAttribute("width", String(On)), o.setAttribute("height", String(yt)), o.setAttribute("viewBox", `0 0 ${On} ${yt}`);
  const l = document.createElementNS(Pn, "rect");
  l.setAttribute("width", "100%"), l.setAttribute("height", "100%"), l.setAttribute("fill", "#ffffff"), o.appendChild(l), Yn(o, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), Yn(
    o,
    uo(`${t.sampleName} · ${t.populationName} · ${t.profileName} · ${t.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), Yn(o, `Page ${a + 1} of ${i}`, On - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const c = 28, h = 18, m = 53, d = 771, p = (On - c * 2 - h) / 2, C = (d - m) / 3, v = 204, x = 12, S = v * 2 + x;
  return n.forEach((b, M) => {
    const k = b.buildPreview(), F = Js(t.densitySmoothing, v), P = ei(
      k,
      0.95,
      F,
      t.densityColorPower
    ), f = M % 2, T = Math.floor(M / 2), O = c + f * (p + h), D = m + T * C, R = O + (p - S) / 2, B = D + 25, q = b.relationship && b.relationship !== "other" ? ` · ${b.relationship}` : "";
    if (Yn(
      o,
      uo(`${b.sourceLabel} → ${b.receiverLabel}`, 58),
      O + 5,
      D + 14,
      { size: 10.5, weight: 700 }
    ), Yn(
      o,
      `matrix ${(b.coefficient * 100).toFixed(1)}%${q}`,
      O + p - 5,
      D + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), ho(o, b, k, "original", R, B, v, F, P, t.densityColorPower, t.pointAlpha, t.pointSize ?? 1), ho(o, b, k, "compensated", R + v + x, B, v, F, P, t.densityColorPower, t.pointAlpha, t.pointSize ?? 1), T < 2) {
      const $ = document.createElementNS(Pn, "line");
      $.setAttribute("x1", String(O)), $.setAttribute("x2", String(O + p)), $.setAttribute("y1", String(D + C - 3)), $.setAttribute("y2", String(D + C - 3)), $.setAttribute("stroke", "#e6eaf0"), $.setAttribute("stroke-width", "1"), o.appendChild($);
    }
  }), Yn(
    o,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), o;
}
function po(n) {
  return vr(n, { widthPx: On, heightPx: yt }), `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(n)}`;
}
async function fo(n, t = 300) {
  const a = URL.createObjectURL(new Blob([n], { type: "image/svg+xml" }));
  try {
    const i = await new Promise((h, m) => {
      const d = new Image();
      d.onload = () => h(d), d.onerror = () => m(new Error("GateLab could not rasterize the compensation export page.")), d.src = a;
    }), o = Math.max(1, t / 96), l = document.createElement("canvas");
    l.width = Math.round(On * o), l.height = Math.round(yt * o);
    const c = l.getContext("2d");
    if (!c) throw new Error("Canvas export is unavailable in this browser.");
    return c.fillStyle = "#ffffff", c.fillRect(0, 0, l.width, l.height), c.scale(o, o), c.drawImage(i, 0, 0, On, yt), await new Promise((h, m) => {
      l.toBlob((d) => d ? h(d) : m(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(a);
  }
}
function go(n, t) {
  const a = URL.createObjectURL(n), i = document.createElement("a");
  i.href = a, i.download = t, document.body.appendChild(i), i.click(), i.remove(), setTimeout(() => URL.revokeObjectURL(a), 1e3);
}
function Fl(n, t, a, i) {
  const o = Math.max(2, String(a).length);
  return `${n}-page-${String(t + 1).padStart(o, "0")}.${i}`;
}
async function Il(n, t, a, i) {
  const o = ia(n.length);
  if (o === 0) throw new Error("No compensation pairs are available to export.");
  const l = oa(t.sampleName, t.populationName);
  if (a === "pdf") {
    const { jsPDF: d } = await import("./jspdf.es.min-BY1oRxmx.js").then((x) => x.j), p = new d({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), C = p.internal.pageSize.getWidth(), v = p.internal.pageSize.getHeight();
    for (let x = 0; x < o; x++) {
      x > 0 && p.addPage("a4", "landscape");
      const S = n.slice(
        x * vt,
        (x + 1) * vt
      ), b = po(mo(S, t, x, o)), M = await fo(b), k = await new Promise((F, P) => {
        const f = new FileReader();
        f.onload = () => F(String(f.result)), f.onerror = () => P(f.error ?? new Error("GateLab could not read an export page.")), f.readAsDataURL(M);
      });
      p.addImage(k, "PNG", 0, 0, C, v, void 0, "FAST"), i == null || i({ completedPages: x + 1, totalPages: o }), await new Promise((F) => setTimeout(F, 0));
    }
    p.save(Gs(t.sampleName, t.populationName, a, o));
    return;
  }
  const c = {};
  let h = null;
  for (let d = 0; d < o; d++) {
    const p = n.slice(
      d * vt,
      (d + 1) * vt
    ), C = po(mo(p, t, d, o)), v = Fl(l, d, o, a);
    if (a === "svg") {
      const x = gr(C);
      c[v] = x, o === 1 && (h = new Blob([x], { type: "image/svg+xml" }));
    } else {
      const x = await fo(C), S = new Uint8Array(await x.arrayBuffer());
      c[v] = S, o === 1 && (h = x);
    }
    i == null || i({ completedPages: d + 1, totalPages: o }), await new Promise((x) => setTimeout(x, 0));
  }
  const m = Gs(
    t.sampleName,
    t.populationName,
    a,
    o
  );
  go(o === 1 && h ? h : new Blob([xr(c, { level: 6 })], { type: "application/zip" }), m);
}
const $l = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function Rl({
  sampleName: n,
  populationName: t,
  filterLabel: a,
  pairCount: i,
  onExport: o,
  onClose: l
}) {
  const { t: c } = Oe(), [h, m] = A.useState("pdf"), [d, p] = A.useState(null), [C, v] = A.useState(null), x = ia(i), S = d !== null && d.completedPages < d.totalPages, b = Gs(n, t, h, x), M = async () => {
    v(null), p({ completedPages: 0, totalPages: x });
    try {
      await o(h, p), l();
    } catch (k) {
      p(null), v(k instanceof Error ? k.message : String(k));
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-backdrop", children: [
    /* @__PURE__ */ e.jsx(Uo, { onClose: S ? null : l }),
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
            $l.map((k) => /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  name: "compensation-comparison-export-format",
                  value: k.format,
                  checked: h === k.format,
                  disabled: S,
                  onChange: () => m(k.format)
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
              /* @__PURE__ */ e.jsx("dd", { title: b, children: b })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Scope") }),
              /* @__PURE__ */ e.jsx("dd", { children: c(i === 1 ? "{count} filtered pair · both assays" : "{count} filtered pairs · both assays", { count: i.toLocaleString() }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Pages") }),
              /* @__PURE__ */ e.jsx("dd", { children: c(x === 1 ? "{count} A4 landscape page · six pairs per page" : "{count} A4 landscape pages · six pairs per page", { count: x.toLocaleString() }) })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Population") }),
              /* @__PURE__ */ e.jsx("dd", { title: t, children: t })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Filter") }),
              /* @__PURE__ */ e.jsx("dd", { title: a, children: a })
            ] })
          ] }),
          d && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-comparison-export-progress", role: "status", "aria-live": "polite", children: [
            /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, d.totalPages), value: d.completedPages }),
            /* @__PURE__ */ e.jsx("span", { children: c("Rendering page {current} of {total}", { current: Math.min(d.completedPages + 1, d.totalPages), total: d.totalPages }) })
          ] }),
          C && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: c(C) }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: S, onClick: l, children: c("Cancel") }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: S || x === 0, onClick: () => void M(), children: S ? c("Rendering…") : c("Download {format}", { format: h.toUpperCase() }) })
          ] })
        ]
      }
    )
  ] });
}
function xo(n) {
  return `"${n.replaceAll('"', '""')}"`;
}
function vo(n, t) {
  if (!Array.isArray(n) || n.length === 0)
    throw new Error(`The ${t} channel axis is empty.`);
  const a = n.map((i, o) => {
    if (typeof i != "string" || i.trim().length === 0)
      throw new Error(`The ${t} channel at position ${o + 1} is blank or invalid.`);
    return i.trim().normalize("NFC");
  });
  if (new Set(a).size !== a.length)
    throw new Error(`The ${t} channel axis contains duplicate identities.`);
  return a;
}
function Ll(n) {
  const t = vo(n.sourceChannels, "source"), a = vo(n.receiverChannels, "receiver");
  if (!Array.isArray(n.matrix) || n.matrix.length !== t.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const i = [
    ["channel", ...a].map(xo).join(",")
  ];
  return n.matrix.forEach((o, l) => {
    if (!Array.isArray(o) || o.length !== a.length)
      throw new Error(
        `Spill matrix row ${l + 1} does not match the receiver channel axis.`
      );
    const c = o.map((h, m) => {
      if (typeof h != "number" || !Number.isFinite(h))
        throw new Error(
          `Spill coefficient ${t[l]} → ${a[m]} is not finite.`
        );
      return Object.is(h, -0) ? "0" : String(h);
    });
    i.push([xo(t[l]), ...c].join(","));
  }), `${i.join(`
`)}
`;
}
function Pl(n, t = "installed") {
  return `${n.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${t === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function Ol(n) {
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
function aa({
  profileLabel: n,
  installedLabel: t,
  installedMatrix: a,
  workingMatrix: i = null,
  pendingEditCount: o = 0,
  onClose: l
}) {
  const { t: c } = Oe(), [h, m] = A.useState("installed"), [d, p] = A.useState(null), C = h === "working" && i ? i : a, v = Pl(n, h), x = A.useMemo(
    () => Ol(v),
    [v]
  ), S = () => {
    p(null);
    try {
      const M = Ll(C), k = URL.createObjectURL(new Blob([M], { type: "text/csv;charset=utf-8" })), F = document.createElement("a");
      F.href = k, F.download = v, document.body.appendChild(F), F.click(), F.remove(), setTimeout(() => URL.revokeObjectURL(k), 1e3);
    } catch (M) {
      p(M instanceof Error ? M.message : String(M));
    }
  }, b = async () => {
    var M;
    if (!((M = navigator.clipboard) != null && M.writeText)) {
      p("Clipboard access is unavailable; select the R code below and copy it manually.");
      return;
    }
    try {
      await navigator.clipboard.writeText(x), p("R import code copied.");
    } catch {
      p("Clipboard access was denied; select the R code below and copy it manually.");
    }
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-backdrop", children: [
    /* @__PURE__ */ e.jsx(Uo, { onClose: l }),
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
          i && o > 0 && /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions", children: [
            /* @__PURE__ */ e.jsx("legend", { children: c("Matrix version") }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "radio",
                  name: "compensation-export-version",
                  value: "installed",
                  checked: h === "installed",
                  onChange: () => m("installed")
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
                  checked: h === "working",
                  onChange: () => m("working")
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
              /* @__PURE__ */ e.jsx("dd", { children: v })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("dt", { children: c("Dimensions") }),
              /* @__PURE__ */ e.jsx("dd", { children: c("{sources} sources × {receivers} receivers", { sources: C.sourceChannels.length, receivers: C.receiverChannels.length }) })
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
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => void b(), children: c("Copy R code") })
          ] }),
          /* @__PURE__ */ e.jsx("pre", { className: "gl-comp-export-code", children: /* @__PURE__ */ e.jsx("code", { children: x }) }),
          d && /* @__PURE__ */ e.jsx("div", { className: d.includes("copied") ? "gl-comp-status" : "gl-comp-warning", role: "status", children: d }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: l, children: c("Cancel") }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", onClick: S, children: c("Download CSV") })
          ] })
        ]
      }
    )
  ] });
}
const xn = 64, bo = 20, _l = 5e-3, Dl = 0.5, Kl = 3, yo = 3;
function ra(n, t) {
  const a = en(n, 0.05) - en(n, 5e-3);
  return Math.max(t > 0 ? t / 2e3 : 0, Number.isFinite(a) ? a : 0, 1e-6);
}
function ft(n, t) {
  let a = 0, i = n.length;
  for (; a < i; ) {
    const o = a + i >>> 1;
    n[o] < t ? a = o + 1 : i = o;
  }
  return a;
}
function la(n, t, a) {
  const i = Be(n, a);
  if (i.length < 2 * bo) return null;
  const o = ra(i, t), l = i.map((G) => Math.asinh(G / o)), c = en(l, 1e-3), h = en(l, 0.999);
  if (!(h > c)) return null;
  const m = new Float64Array(xn), d = (h - c) / xn;
  for (let G = 0; G < l.length; G++)
    m[Math.min(xn - 1, Math.max(0, Math.floor((l[G] - c) / d)))]++;
  const p = m.map((G, r) => (m[Math.max(0, r - 1)] + m[r] + m[Math.min(xn - 1, r + 1)]) / 3), C = new Float64Array(xn), v = new Float64Array(xn);
  for (let G = 1; G < xn; G++) C[G] = Math.max(C[G - 1], p[G - 1]);
  for (let G = xn - 2; G >= 0; G--) v[G] = Math.max(v[G + 1], p[G + 1]);
  let x = -1 / 0, S = 0, b = 0;
  for (let G = 1; G < xn - 1; G++) {
    const r = Math.min(C[G], v[G]) - p[G];
    r > x + 1e-9 ? (x = r, S = G, b = G) : Math.abs(r - x) <= 1e-9 && G === b + 1 && (b = G);
  }
  const M = S + b >> 1, k = c + (M + 0.5) * d, F = ft(l, k), P = Math.min(C[M], v[M]), f = P > 0 ? p[M] / P : 1, T = Ht(l.slice(0, F)), O = Ht(l.slice(F)), D = Math.hypot(T.rsd, O.rsd), R = F === 0 || F === l.length ? 0 : D > 0 ? Math.SQRT2 * (O.median - T.median) / D : 1 / 0, B = Math.max(bo, _l * l.length), q = F >= B && l.length - F >= B && f <= Dl && R >= Kl, $ = (G) => Math.sinh(G) * o, g = $(k);
  let U = q ? Math.min(g, $(T.median + yo * T.rsd)) : g, W = q ? Math.max(g, $(O.median - yo * O.rsd)) : g;
  return ft(i, U) < F / 2 && (U = g), i.length - ft(i, W) < (i.length - F) / 2 && (W = g), {
    bimodal: q,
    cut: g,
    negativeUpper: U,
    positiveLower: W,
    negativeCount: ft(i, U),
    positiveCount: i.length - ft(i, W),
    separation: R,
    valleyRatio: f,
    cofactor: o,
    negativeSpread: T.rsd,
    positiveSpread: O.rsd
  };
}
function zl(n) {
  const t = en(n, 0.99);
  return t + 2 * (t - en(n, 0.5));
}
const ca = 5e4, Ul = 0.01, jo = 50;
function Zn(n) {
  const t = /* @__PURE__ */ new Map();
  let a;
  for (const i of n) {
    const o = (t.get(i) ?? 0) + 1;
    t.set(i, o), (a === void 0 || o > (t.get(a) ?? 0)) && (a = i);
  }
  return a;
}
function Bl(n, t, a) {
  const i = [...n, ...t], o = [...t, ...n], l = [], c = [], h = (p) => p.filter((C) => C != null);
  for (const p of a) {
    let C = !1;
    for (const v of ["voltage", "gain"]) {
      const x = (b) => {
        var M;
        return (M = b.channels.find((k) => k.pnn === p)) == null ? void 0 : M[v];
      }, S = Zn(h(o.map(x))) ?? Zn(h(i.map(x)));
      if (S !== void 0) {
        C = !0;
        for (const b of i) {
          const M = x(b);
          M != null && M !== S && l.push({ code: "setting-differs", setting: v, fileId: b.id, channel: p, value: M, expected: S });
        }
      }
    }
    C || c.push(p);
  }
  c.length > 0 && l.push({ code: "settings-not-recorded", channels: c });
  const m = Zn(h(o.map((p) => p.cytometer))) ?? Zn(h(i.map((p) => p.cytometer))), d = Zn(h(o.map((p) => p.acquired))) ?? Zn(h(i.map((p) => p.acquired)));
  for (const p of i)
    m !== void 0 && p.cytometer && p.cytometer !== m && l.push({ code: "cytometer-differs", fileId: p.id, cytometer: p.cytometer, expected: m }), d !== void 0 && p.acquired && p.acquired !== d && l.push({ code: "date-differs", fileId: p.id, acquired: p.acquired, expected: d });
  return l;
}
function da(n, t, a, i) {
  const o = t.map((c) => n.values(c));
  if (o.some((c) => c === null)) return null;
  const l = t.map(() => new Float64Array(i.length));
  for (let c = 0; c < i.length; c++) {
    const h = i[c];
    for (let m = 0; m < t.length; m++) {
      let d = 0;
      for (let p = 0; p < t.length; p++) d += o[p][h] * a[p][m];
      l[m][c] = d;
    }
  }
  return l;
}
function Vl(n, t, a, i, o) {
  const l = Bo(i.map((m) => [...m]));
  if (!l) return [];
  const c = da(o, t, l, ss(o.eventCount, ca));
  if (!c) return [];
  const h = [];
  for (const m of a) {
    const d = t.indexOf(m.channel), p = n.find((P) => P.id === m.positive.fileId), C = n.find((P) => P.id === m.negative.fileId), v = p == null ? void 0 : p.values(m.channel), x = C == null ? void 0 : C.values(m.channel);
    if (d < 0 || !v || !x) continue;
    const S = Be(v, _n(m.positive, v)), b = Be(x, _n(m.negative, x)), M = en(S, 0.99) - nt(b), k = en(c[d].slice().sort(), 0.99);
    if (!(M > 0) || !Number.isFinite(k)) continue;
    const F = k / M;
    h.push({ channel: m.channel, controlTop: M, sampleTop: k, ratio: F, exceeds: F > 1 });
  }
  return h;
}
function Wl(n, t, a, i) {
  const o = a.indexOf(t), l = Bo(i.map((m) => [...m]));
  if (o < 0 || !l) return [];
  const c = da(n, a, l, ss(n.eventCount, ca));
  if (!c) return [];
  const h = [];
  return a.forEach((m, d) => {
    var f;
    if (d === o) return;
    const p = ((f = n.channels.find((T) => T.pnn === m)) == null ? void 0 : f.range) ?? 0, C = la(c[d], p);
    if (!(C != null && C.bimodal)) return;
    const v = _n({ fileId: n.id, upper: C.negativeUpper }, c[d]), x = _n({ fileId: n.id, lower: C.positiveLower }, c[d]);
    if (v.length < jo || x.length < jo) return;
    const S = nt(Be(c[d], x)) - nt(Be(c[d], v));
    if (!(S > 0)) return;
    const b = Ht(Be(c[o], x)), M = Ht(Be(c[o], v)), k = b.median - M.median, F = 1.2533 * Math.hypot(b.rsd / Math.sqrt(x.length), M.rsd / Math.sqrt(v.length)) / S, P = k / S;
    h.push({
      source: m,
      receiver: t,
      residual: P,
      shift: k,
      uncertainty: F,
      brightCount: x.length,
      dimCount: v.length,
      flagged: Math.abs(P) >= Ul && Math.abs(P) >= 3 * F
    });
  }), h.sort((m, d) => Math.abs(d.residual) - Math.abs(m.residual));
}
const ql = 2e4, gt = 2, Qn = 10, Gl = 0.5, Hl = 3, Xl = 0.05, Yl = 0.1, Zl = 3, wo = 20;
function Ql(n, t) {
  const a = ss(n.eventCount, ql), i = [0.05, 0.25, 0.5, 0.99].map(() => new Float64Array(t.length));
  t.forEach((m, d) => {
    const p = Be(n.values(m.pnn) ?? [], a);
    [0.05, 0.25, 0.5, 0.99].forEach((C, v) => {
      i[v][d] = en(p, C);
    });
  });
  const [o, l, c, h] = i;
  return { events: a, p05: o, p25: l, p50: c, p99: h };
}
function Vt(n, t) {
  const a = n.filter(Number.isFinite).sort((i, o) => i - o);
  return a.length === 0 ? NaN : t ? a[0] : en(a, 0.5);
}
function Jl(n) {
  var q;
  const t = br(n), a = t.map(($) => $.pnn), i = n.map(($) => Ql($, t)), o = n.map(($) => Vo($)), l = /* @__PURE__ */ new Map();
  for (const $ of n)
    for (const g of $.channels)
      g.marker && !l.has(g.pnn) && l.set(g.pnn, g.marker);
  const c = t.map(($) => ({ ...$, marker: $.marker ?? l.get($.pnn) ?? null })), h = n.map(($, g) => o[g] ? { channel: null, candidates: [] } : Wo($, c)), m = n.map(($, g) => g).filter(($) => o[$]), d = n.length < 3, p = a.map(($, g) => m.length > 0 ? Vt(m.map((U) => i[U].p50[g]), !1) : Vt(i.map((U) => U.p25[g]), d)), C = a.map(($, g) => m.length > 0 ? Vt(m.map((U) => i[U].p99[g]), !1) : p[g] + Zl * Vt(i.map((U) => U.p25[g] - U.p05[g]), d)), v = a.map(($, g) => Math.max(C[g], 2 * (C[g] - p[g]), 1e-9)), x = ($, g) => i[$].p99[g] - C[g], S = ($, g) => x($, g) / v[g], b = n.map(($, g) => {
    let U = -1;
    for (let W = 0; W < a.length; W++)
      Number.isFinite(x(g, W)) && (U < 0 || x(g, W) > x(g, U)) && (U = W);
    return U;
  }), M = ($, g) => S($, g) > gt && x($, g) >= Gl * x($, b[$]), k = ($, g) => {
    const U = n[$], W = U.values(a[g]);
    if (!W) return [];
    const { events: G } = i[$], r = [], le = [];
    for (const ce of G)
      (W[ce] - p[g] > gt * v[g] ? r : le).push(ce);
    const J = [];
    for (let ce = 0; ce < a.length; ce++) {
      if (ce === g || S($, ce) < Qn) continue;
      const _ = U.values(a[ce]);
      if (!_) continue;
      const N = (ee) => _[ee] - C[ce] >= Qn * v[ce];
      if (le.filter(N).length >= Math.max(wo, Xl * G.length)) {
        J.push(a[ce]);
        continue;
      }
      const V = r.map((ee) => (_[ee] - p[ce]) / (W[ee] - p[g])), Q = Math.max(en(Float64Array.from(V).sort(), 0.25), 0);
      r.filter((ee, ve) => N(ee) && V[ve] > Hl * Q).length >= Math.max(wo, Yl * r.length) && J.push(a[ce]);
    }
    return J;
  }, F = n.map(() => null), P = /* @__PURE__ */ new Map(), f = ($, g, U, W = []) => ({ role: $, channel: g, matchedBy: U, duplicate: !1, independentChannels: [], notes: W });
  n.forEach(($, g) => {
    if (o[g]) {
      F[g] = f("unstained", -1, "name");
      return;
    }
    if (yr(n[g])) {
      const r = h[g].channel === null ? -1 : a.indexOf(h[g].channel);
      F[g] = f("fmo", r, "name", h[g].candidates.length > 1 ? ["name-fits-several-channels"] : []);
      return;
    }
    if (a.length < 2 || b[g] < 0) return;
    const U = h[g].channel === null ? -1 : a.indexOf(h[g].channel), W = U >= 0 && S(g, U) >= Qn ? U : b[g];
    if (S(g, W) < Qn) return;
    const G = k(g, W);
    G.length > 0 && (F[g] = { ...f("mixed", W, null), independentChannels: G });
  });
  const T = n.map(($, g) => ({ f: g, j: h[g].channel === null ? -1 : a.indexOf(h[g].channel) })).filter(({ f: $, j: g }) => F[$] === null && g >= 0).sort(($, g) => Number(M(g.f, g.j)) - Number(M($.f, $.j)) || x(g.f, g.j) - x($.f, $.j));
  for (const { f: $, j: g } of T) {
    const U = M($, g), W = U ? [] : [S($, g) > gt ? "name-and-signal-disagree" : "named-channel-has-no-signal"];
    F[$] = f("single-stain", g, U ? "name-and-signal" : "name", W), P.has(g) ? F[$].duplicate = !0 : P.set(g, $);
  }
  const O = /* @__PURE__ */ new Map();
  n.forEach(($, g) => {
    if (F[g] !== null) return;
    const U = a.map((r, le) => le).filter((r) => M(g, r) && S(g, r) >= Qn && !P.has(r)), W = h[g].candidates.map((r) => a.indexOf(r)).filter((r) => U.includes(r)), G = (W.length > 0 ? W : U).sort((r, le) => x(g, le) - x(g, r));
    G.length > 0 && O.set(g, { channels: G, tied: W.length > 0 });
  });
  const D = /* @__PURE__ */ new Map(), R = ($, g) => {
    var U;
    for (const W of ((U = O.get($)) == null ? void 0 : U.channels) ?? []) {
      if (g.has(W)) continue;
      g.add(W);
      const G = D.get(W);
      if (G === void 0 || R(G, g))
        return D.set(W, $), !0;
    }
    return !1;
  };
  [...O.keys()].sort(($, g) => x(g, b[g]) - x($, b[$])).forEach(($) => R($, /* @__PURE__ */ new Set()));
  for (const [$, g] of D)
    F[g] = f("single-stain", $, (q = O.get(g)) != null && q.tied ? "name-and-signal" : "signal"), P.set($, g);
  n.forEach(($, g) => {
    var G;
    if (F[g] !== null) return;
    const U = h[g].candidates.length > 1 ? ["name-fits-several-channels"] : [], W = b[g];
    if (W < 0 || S(g, W) <= gt)
      F[g] = f("unstained", -1, "signal", U);
    else if (S(g, W) >= Qn) {
      const r = P.get(W);
      r !== void 0 && ((G = F[r]) == null ? void 0 : G.matchedBy) !== "signal" && h[g].candidates.length === 0 ? F[g] = f("mixed", W, null) : (F[g] = { ...f("single-stain", W, "signal", U), duplicate: r !== void 0 }, r === void 0 && P.set(W, g));
    } else
      F[g] = f("unknown", -1, null, [...U, "weak-signal"]);
  });
  const B = n.map(($, g) => {
    const U = F[g], W = b[g];
    return {
      fileId: $.id,
      role: U.role,
      channel: U.channel >= 0 ? a[U.channel] : null,
      matchedBy: U.matchedBy,
      duplicate: U.duplicate,
      particle: qo($),
      brightest: W >= 0 && S(g, W) > gt ? { channel: a[W], fold: S(g, W) } : null,
      fold: U.channel >= 0 ? S(g, U.channel) : null,
      independentChannels: U.independentChannels,
      notes: U.notes
    };
  });
  return {
    channels: t,
    controls: B,
    channelsWithoutControl: a.filter(($, g) => !P.has(g))
  };
}
const ec = 0.25, No = 1.5, nc = 2e4;
function Co(n) {
  var o, l;
  const t = (o = n.scatter) == null ? void 0 : o.forward, a = (l = n.scatter) == null ? void 0 : l.side;
  if (!t || !a) return null;
  const i = ss(n.eventCount, nc);
  return [nt(Be(t, i)), nt(Be(a, i))];
}
function Hs(n, t) {
  const a = Co(n), i = Co(t);
  return !a || !i ? !1 : a.some((o, l) => {
    const c = i[l];
    return !(o > 0) || !(c > 0) ? !1 : o / c > No || c / o > No;
  });
}
function tc(n, t) {
  if (t.length === 0) return null;
  const a = [...t].sort((i, o) => o.eventCount - i.eventCount);
  return a.find((i) => !Hs(n, i)) ?? a[0];
}
function sc(n, t, a, i, o = {}) {
  var R, B, q;
  const l = n.find(($) => $.id === t), c = l == null ? void 0 : l.values(a);
  if (!l || !c) throw new Error(`No file "${t}" with channel "${a}".`);
  const h = ((R = o.populations) == null ? void 0 : R[l.id]) ?? null, m = { fileId: l.id, mask: h }, d = ((B = l.channels.find(($) => $.pnn === a)) == null ? void 0 : B.range) ?? 0, p = la(c, d, h ? _n(m, c) : null), C = o.negative ?? "auto", v = tc(l, i), x = qo(l), S = o.kind === "beads" || o.kind === "cells" ? o.kind : x ?? (p != null && p.bimodal && p.positiveSpread < ec ? "beads" : "cells"), b = o.kind === "beads" || o.kind === "cells" ? "chosen" : x ? "name" : "peaks", M = { channel: a, fileId: l.id, kind: S, kindFrom: b, split: p }, k = (v == null ? void 0 : v.values(a)) ?? null, F = v && k ? { fileId: v.id, mask: ((q = o.populations) == null ? void 0 : q[v.id]) ?? null } : null, P = F && k ? zl(Be(k, _n(F, k))) : null, f = v !== null && F !== null && !Hs(l, v);
  let T = p != null && p.bimodal ? "own-peak" : "no-own-peak";
  if (p != null && p.bimodal && C === "auto" && f && P !== null) {
    const $ = Be(c, _n({ ...m, upper: p.cut }, c));
    nt($) > P ? T = "own-peak-not-negative" : p.negativeCount < Us && (T = "own-peak-small");
  }
  if (C !== "unstained" && (p != null && p.bimodal) && T === "own-peak")
    return {
      ...M,
      negativeSource: "internal",
      negativeFileId: l.id,
      negativeReason: C === "internal" ? "chosen" : "own-peak",
      spec: {
        channel: a,
        positive: { ...m, lower: p.positiveLower },
        negative: { ...m, upper: p.negativeUpper }
      },
      problem: null,
      scatterDiffers: !1
    };
  const O = { ...M, negativeSource: null, negativeFileId: null, negativeReason: null, spec: null, scatterDiffers: !1 };
  if (C === "internal" || C === "auto" && S === "beads" && !f)
    return { ...O, problem: "no-negative-population" };
  if (!v || !F || P === null) return { ...O, problem: "no-unstained-control" };
  const D = (p == null ? void 0 : p.bimodal) && T !== "own-peak-not-negative";
  return {
    ...M,
    negativeSource: "unstained",
    negativeFileId: v.id,
    negativeReason: C === "unstained" ? "chosen" : T === "own-peak" ? "no-own-peak" : T,
    spec: { channel: a, positive: { ...m, lower: D ? p.positiveLower : P }, negative: F },
    problem: null,
    scatterDiffers: Hs(l, v)
  };
}
const Ps = (n) => n.channels.map((t) => t.pnn).sort().join("");
function ic(n, t = {}) {
  const a = n.filter((d) => {
    var p;
    return ((p = t[d.id]) == null ? void 0 : p.role) !== "ignored";
  }), i = /* @__PURE__ */ new Map();
  for (const d of a) {
    const p = Ps(d);
    i.set(p, [...i.get(p) ?? [], d]);
  }
  let o = [], l = -1;
  for (const d of i.values()) {
    const p = d.filter((C) => Vo(C) || Wo(C, d[0].channels).channel !== null).length;
    (p > l || p === l && d.length > o.length) && (o = d, l = p);
  }
  const c = o.length > 0 ? o[0].channels.map((d) => d.pnn) : [], h = o.length > 0 ? Ps(o[0]) : "";
  o = a.filter((d) => Ps(d) === h || c.length > 0 && c.every((p) => d.channels.some((C) => C.pnn === p)));
  const m = new Set(o.map((d) => d.id));
  return {
    files: o,
    otherChannels: a.filter((d) => !m.has(d.id)).map((d) => d.id),
    detection: Jl(o)
  };
}
function So(n) {
  var t;
  return ((t = n.embedded) == null ? void 0 : t.matrix.some((a, i) => a.some((o, l) => i !== l && o !== 0))) ?? !1;
}
function oc(n, t = {}) {
  const { files: a, detection: i } = n, o = a.map((f, T) => {
    const O = i.controls[T], D = t[f.id] ?? {}, R = D.role ?? O.role, B = D.channel !== void 0 ? D.channel : O.channel;
    return { file: f, detected: O, choice: D, role: R, channel: B, chosen: D.role !== void 0 || D.channel !== void 0 };
  }), l = /* @__PURE__ */ new Map();
  for (const f of i.channels) {
    const T = o.filter((O) => O.role === "single-stain" && O.channel === f.pnn).sort((O, D) => Number(D.chosen) - Number(O.chosen) || Number(O.detected.duplicate) - Number(D.detected.duplicate) || (D.detected.fold ?? 0) - (O.detected.fold ?? 0));
    T.length > 0 && l.set(f.pnn, T[0].file.id);
  }
  const c = o.filter((f) => f.role === "unstained").map((f) => f.file), h = /* @__PURE__ */ new Map();
  for (const f of o) {
    if (f.role !== "single-stain" || f.channel === null || l.get(f.channel) !== f.file.id) continue;
    const T = sc(a, f.file.id, f.channel, c, {
      kind: f.choice.kind,
      negative: f.choice.negative
    }), { negativeLower: O, negativeUpper: D, positiveLower: R, positiveUpper: B } = f.choice, q = (g) => Object.fromEntries(Object.entries(g).filter(([, U]) => U !== void 0));
    let $ = T.spec;
    $ ? $ = {
      channel: $.channel,
      positive: { ...$.positive, ...q({ lower: R, upper: B }) },
      // The boundaries are on this file's events: they do not apply to an unstained control's.
      negative: T.negativeSource !== "internal" ? $.negative : { ...$.negative, ...q({ lower: O, upper: D }) }
    } : D !== void 0 && R !== void 0 && f.choice.negative !== "unstained" && ($ = {
      channel: f.channel,
      positive: { fileId: f.file.id, lower: R, ...q({ upper: B }) },
      negative: { fileId: f.file.id, upper: D, ...q({ lower: O }) }
    }), h.set(f.file.id, {
      planned: T,
      spec: $,
      moved: [O, D, R, B].some((g) => g !== void 0)
    });
  }
  const m = (f) => {
    var T;
    return ((T = h.get(l.get(f) ?? "")) == null ? void 0 : T.spec) ?? null;
  }, d = i.channels.map((f) => f.pnn).filter((f) => m(f) !== null), p = Xi(a, d, d.map((f) => m(f))), C = new Map(p.rows.map((f) => [f.channel, f])), v = d.filter((f) => {
    var T;
    return ((T = C.get(f)) == null ? void 0 : T.calculated) != null;
  }), x = v.map((f) => m(f)), S = v.length < 2 ? null : v.length === d.length ? p : Xi(a, v, x);
  S == null || S.rows.forEach((f) => C.set(f.channel, f));
  const b = o.map((f) => {
    const T = h.get(f.file.id) ?? null, O = T !== null, D = (T == null ? void 0 : T.spec) ?? null, R = D !== null && D.negative.fileId === f.file.id && D.negative.upper !== void 0;
    return {
      file: f.file,
      detected: f.detected,
      role: f.role,
      channel: f.channel,
      chosen: f.chosen,
      duplicate: f.role === "single-stain" && f.channel !== null && !O,
      planned: (T == null ? void 0 : T.planned) ?? null,
      spec: D,
      negativeLower: R ? D.negative.lower ?? null : null,
      negativeUpper: R ? D.negative.upper : null,
      positiveLower: (D == null ? void 0 : D.positive.lower) ?? null,
      positiveUpper: (D == null ? void 0 : D.positive.upper) ?? null,
      boundariesMoved: (T == null ? void 0 : T.moved) ?? !1,
      row: O && f.channel !== null ? C.get(f.channel) ?? null : null
    };
  }), M = b.filter((f) => f.role === "mixed").map((f) => f.file), k = new Set(x.flatMap((f) => [f.positive.fileId, f.negative.fileId])), F = a.filter((f) => k.has(f.id)), P = M.find(So) ?? a.find(So) ?? null;
  return {
    channels: i.channels,
    files: b,
    otherChannels: n.otherChannels,
    matrixChannels: v,
    estimate: S,
    channelsWithoutControl: i.channels.map((f) => f.pnn).filter((f) => !v.includes(f)),
    reference: S && (P != null && P.embedded) ? { fileId: P.id, differences: Kr(S, P.embedded) } : null,
    settings: S ? Bl(F, M, v) : [],
    brightness: S ? M.map((f) => ({
      fileId: f.id,
      findings: Vl(a, v, x, S.matrix, f)
    })) : [],
    fmo: S ? b.filter((f) => f.role === "fmo" && f.channel !== null && v.includes(f.channel)).map((f) => ({
      fileId: f.file.id,
      omitted: f.channel,
      residuals: Wl(f.file, f.channel, v, S.matrix)
    })) : []
  };
}
function ac(n) {
  const t = new Map(n.files.map((i) => [i.file.id, i])), a = (i) => ({
    ...i.lower !== void 0 && Number.isFinite(i.lower) ? { lower: i.lower } : {},
    ...i.upper !== void 0 && Number.isFinite(i.upper) ? { upper: i.upper } : {}
  });
  return n.matrixChannels.map((i) => {
    const o = n.files.find((h) => {
      var m, d;
      return ((m = h.spec) == null ? void 0 : m.channel) === i && ((d = h.row) == null ? void 0 : d.channel) === i;
    }), l = o.spec, c = t.get(l.negative.fileId).file;
    return {
      channel: i,
      row: "control",
      events: { fileName: o.file.fileName, count: o.row.positiveCount, ...a(l.positive) },
      negative: { fileName: c.fileName, count: o.row.negativeCount, ...a(l.negative) }
    };
  });
}
const Mo = 5e-3, rc = 5, Wt = 160, re = { width: 620, height: 190, left: 10, right: 10, top: 10, bottom: 24 }, ko = {
  "single-stain": "Single-stained control",
  unstained: "Unstained control",
  fmo: "FMO control",
  mixed: "Stained sample",
  unknown: "Not recognised",
  ignored: "Not used"
}, Ln = (n) => Math.abs(n) >= 1e3 ? Math.round(n).toLocaleString("en-US") : xe(n, 3);
function lc(n, t) {
  if (!t.has(n)) return n;
  for (let a = 2; ; a++) if (!t.has(`${n} ${a}`)) return `${n} ${a}`;
}
function cc(n, t) {
  switch (n.code) {
    case "few-positive-events":
      return t("Only {count} positive events (fewer than {limit}).", { count: n.count, limit: Us });
    case "few-negative-events":
      return t("Only {count} negative events (fewer than {limit}).", { count: n.count, limit: Us });
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
function dc(n, t, a, i) {
  var l, c, h, m, d, p, C, v;
  if (a) return [i("Its channels are not the controls': not used.")];
  if (!n) return [];
  const o = [];
  if (n.duplicate && n.channel !== null) {
    const x = t.files.find((S) => S.planned !== null && S.channel === n.channel);
    o.push(i("Not used: {file} is the control for {channel}.", { file: (x == null ? void 0 : x.file.fileName) ?? "", channel: n.channel }));
  }
  n.role === "single-stain" && n.channel === null && o.push(i("Choose its channel.")), ((l = n.planned) == null ? void 0 : l.problem) === "no-negative-population" && o.push(i("No negative peak was found. Bead controls carry their own negative beads: mark the two populations by hand, or choose Cells to use the unstained control.")), ((c = n.planned) == null ? void 0 : c.problem) === "no-unstained-control" && o.push(i("No negative population, and no unstained control to take one from.")), ((h = n.planned) == null ? void 0 : h.negativeReason) === "own-peak-not-negative" ? o.push(i("Its lower peak is above the unstained control's events, so it is not a negative population: the unstained control is used.")) : ((m = n.planned) == null ? void 0 : m.negativeReason) === "own-peak-small" && o.push(i("It has only {count} negative events of its own: the unstained control is used.", { count: ((d = n.planned.split) == null ? void 0 : d.negativeCount) ?? 0 })), (p = n.planned) != null && p.scatterDiffers && o.push(i("The unstained control is of other particles (its scatter differs)."));
  for (const x of ((C = n.row) == null ? void 0 : C.warnings) ?? []) o.push(cc(x, i));
  if (n.role === "single-stain" || n.role === "fmo") {
    for (const x of n.detected.notes)
      x === "named-channel-has-no-signal" ? o.push(i("Named for a channel that holds no signal.")) : x === "name-and-signal-disagree" ? o.push(i("Named for this channel, but brightest in {channel}.", { channel: ((v = n.detected.brightest) == null ? void 0 : v.channel) ?? "?" })) : x === "name-fits-several-channels" && o.push(i("Its name fits several channels."));
    n.chosen && n.role === "single-stain" && n.channel !== null && n.detected.brightest && n.detected.brightest.channel !== n.channel && o.push(i("Brightest in {channel}.", { channel: n.detected.brightest.channel }));
  }
  return n.detected.notes.includes("weak-signal") && n.role === "unknown" && o.push(i("A little signal, not enough for a control.")), n.boundariesMoved && o.push(i("Boundaries set by hand.")), o;
}
function uc(n, t) {
  return n.chosen ? t("Chosen") : n.detected.matchedBy === "name-and-signal" ? t("Name and signal") : n.detected.matchedBy === "name" ? t("Name") : n.detected.matchedBy === "signal" ? t("Signal") : "";
}
function hc(n, t, a) {
  var l;
  const i = [];
  n.channelsWithoutControl.length > 0 && i.push(n.brightness.length > 0 || n.fmo.length > 0 ? a("No usable control for {channels}: left out of the matrix. A sample stained in one of them is not compensated for it, and the findings below may come from it.", { channels: n.channelsWithoutControl.join(", ") }) : a("No usable control for {channels}: left out of the matrix.", { channels: n.channelsWithoutControl.join(", ") }));
  for (const c of n.settings)
    c.code === "setting-differs" ? i.push(c.setting === "voltage" ? a("{file}: {channel} was run at {value} V, the others at {expected} V. Spillover changes with voltage.", {
      file: t(c.fileId),
      channel: c.channel,
      value: c.value,
      expected: c.expected
    }) : a("{file}: {channel} was run at gain {value}, the others at {expected}.", {
      file: t(c.fileId),
      channel: c.channel,
      value: c.value,
      expected: c.expected
    })) : c.code === "settings-not-recorded" ? i.push(a("No file records a voltage or a gain for {channels}: the settings were not compared.", { channels: c.channels.join(", ") })) : c.code === "cytometer-differs" ? i.push(a("{file} was run on {cytometer}, the others on {expected}.", {
      file: t(c.fileId),
      cytometer: c.cytometer,
      expected: c.expected
    })) : i.push(a("{file} was acquired on {date}, the others on {expected}.", {
      file: t(c.fileId),
      date: c.acquired,
      expected: c.expected
    }));
  const o = /* @__PURE__ */ new Map();
  for (const { fileId: c, findings: h } of n.brightness)
    for (const m of h)
      m.exceeds && m.ratio > (((l = o.get(m.channel)) == null ? void 0 : l.ratio) ?? 0) && o.set(m.channel, { fileId: c, ratio: m.ratio });
  for (const [c, { fileId: h, ratio: m }] of o)
    i.push(a("{channel}: {file} is {ratio} times as bright as the control reaches, so the spillover of its brightest events is extrapolated.", {
      channel: c,
      file: t(h),
      ratio: xe(m, 3)
    }));
  for (const { fileId: c, omitted: h, residuals: m } of n.fmo) {
    const d = m.filter((p) => p.flagged);
    d.length === 0 && i.push(a("{file}: nothing is left in {channel} after compensation ({count} stained channels checked).", {
      file: t(c),
      channel: h,
      count: m.length
    }));
    for (const p of d)
      i.push(p.residual > 0 ? a("{file}: {value} of {source} is left in {receiver} after compensation. The coefficient looks too small.", {
        file: t(c),
        value: Te(p.residual),
        source: p.source,
        receiver: p.receiver
      }) : a("{file}: {receiver} is pulled {value} of {source} below its level after compensation. The coefficient looks too large.", {
        file: t(c),
        value: Te(-p.residual),
        source: p.source,
        receiver: p.receiver
      }));
  }
  if (n.reference && n.reference.differences.length > 0) {
    const c = n.reference.differences[0], h = n.reference.differences.filter((m) => Math.abs(m.difference) > Math.max(Mo, rc * (m.uncertainty ?? 0))).length;
    i.push(a("Against the matrix embedded in {file}: the largest difference is {source} into {receiver}, {calculated} calculated against {reference}. {count} of {total} coefficients differ by more than {threshold} and more than five standard errors.", {
      file: t(n.reference.fileId),
      source: c.source,
      receiver: c.receiver,
      calculated: c.uncertainty !== null ? `${Te(c.calculated)} ± ${Te(c.uncertainty, !1, 2)}` : Te(c.calculated),
      reference: Te(c.reference),
      count: h,
      total: n.reference.differences.length,
      threshold: Te(Mo)
    }));
  }
  return i;
}
const Xs = {
  negativeLower: void 0,
  negativeUpper: void 0,
  positiveLower: void 0,
  positiveUpper: void 0
}, mc = {
  negativeLower: "Lower boundary of the negative events",
  negativeUpper: "Upper boundary of the negative events",
  positiveLower: "Lower boundary of the positive events",
  positiveUpper: "Upper boundary of the positive events"
};
function pc({ entry: n, files: t, onBoundaries: a, onReset: i }) {
  var N, H;
  const { t: o } = Oe(), l = n.channel, c = n.file.values(l), h = n.spec && n.spec.negative.fileId !== n.file.id ? t.find((V) => V.id === n.spec.negative.fileId) ?? null : null, m = (h == null ? void 0 : h.values(l)) ?? null, d = A.useMemo(() => {
    var ee, ve, X;
    if (!c) return null;
    const V = ((ee = n.file.channels.find((L) => L.pnn === l)) == null ? void 0 : ee.range) ?? 0, Q = ((X = (ve = n.planned) == null ? void 0 : ve.split) == null ? void 0 : X.cofactor) ?? ra(Be(c), V), ie = zr([c, m], Q);
    return ie ? {
      scale: ie,
      counts: Yi(c, ie, Wt),
      otherCounts: m ? Yi(m, ie, Wt) : null,
      sorted: Be(c)
    } : null;
  }, [c, m, l, n.file, n.planned]), [p, C] = A.useState(null), v = A.useRef(null);
  if (A.useEffect(() => C(null), [n.file.id, l]), !c || !d) return /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: o("This file has no events to draw in {channel}.", { channel: l }) });
  const { scale: x, counts: S, otherCounts: b, sorted: M } = d, k = { width: re.width - re.left - re.right, height: re.height - re.top - re.bottom }, F = (V) => re.left + ($s(V, x.cofactor) - x.lo) / (x.hi - x.lo) * k.width, P = (V) => Math.max(re.left, Math.min(re.left + k.width, V)), f = (V) => {
    const Q = v.current.getBoundingClientRect(), ie = (V - Q.left) / Q.width * re.width, ee = (P(ie) - re.left) / k.width;
    return Ut(x.lo + ee * (x.hi - x.lo), x.cofactor);
  }, T = (V, Q) => {
    const ie = Math.max(1, ...V), ee = k.width / V.length, ve = re.top + k.height;
    let X = Q ? `M${re.left},${ve}` : "";
    return V.forEach((L, te) => {
      const ge = ve - L / ie * k.height, Fe = re.left + te * ee;
      X += `${X === "" ? "M" : "L"}${Fe.toFixed(1)},${ge.toFixed(1)}L${(Fe + ee).toFixed(1)},${ge.toFixed(1)}`;
    }), Q ? `${X}L${re.left + k.width},${ve}Z` : X;
  }, O = { lo: Ut(x.lo, x.cofactor), hi: Ut(x.hi, x.cofactor) }, D = (V) => (p == null ? void 0 : p.which) === V ? p.value : n[V], R = D("negativeUpper"), B = D("positiveLower"), q = R === null ? null : D("negativeLower") ?? O.lo, $ = B === null ? null : D("positiveUpper") ?? O.hi, g = (V, Q) => {
    const [ie, ee] = V === "negativeLower" ? [O.lo, R ?? O.hi] : V === "negativeUpper" ? [q ?? O.lo, B ?? O.hi] : V === "positiveLower" ? [R ?? O.lo, $ ?? O.hi] : [B ?? O.lo, O.hi];
    return Math.max(ie, Math.min(ee, Q));
  }, U = (V, Q) => {
    if (C(null), Q === (n[V] ?? (V === "negativeLower" ? O.lo : V === "positiveUpper" ? O.hi : null))) return;
    const ie = (x.hi - x.lo) / Wt / 2, ee = $s(Q, x.cofactor), ve = V === "negativeLower" && ee <= x.lo + ie || V === "positiveUpper" && ee >= x.hi - ie;
    a({ [V]: ve ? void 0 : Q });
  }, W = (V, Q) => {
    const ie = V.startsWith("negative") ? "negative" : "positive", ee = V.endsWith("Lower") ? "lower" : "upper", ve = P(F(Q)), X = (L) => {
      const te = $s(Q, x.cofactor) + L * (x.hi - x.lo) / Wt;
      U(V, g(V, Ut(te, x.cofactor)));
    };
    return /* @__PURE__ */ e.jsxs(
      "g",
      {
        className: `gl-comp-controls-handle is-${ie} is-${ee}`,
        role: "slider",
        tabIndex: 0,
        "aria-label": o(mc[V]),
        "aria-valuenow": Math.round(Q),
        "aria-valuetext": Ln(Q),
        onKeyDown: (L) => {
          L.key === "ArrowLeft" || L.key === "ArrowDown" ? (L.preventDefault(), X(L.shiftKey ? -5 : -1)) : (L.key === "ArrowRight" || L.key === "ArrowUp") && (L.preventDefault(), X(L.shiftKey ? 5 : 1));
        },
        onPointerDown: (L) => {
          var te, ge;
          L.preventDefault(), (ge = (te = L.currentTarget).setPointerCapture) == null || ge.call(te, L.pointerId), C({ which: V, value: Q });
        },
        onPointerMove: (L) => {
          (p == null ? void 0 : p.which) === V && C({ which: V, value: g(V, f(L.clientX)) });
        },
        onPointerUp: (L) => {
          var te, ge;
          (p == null ? void 0 : p.which) === V && ((ge = (te = L.currentTarget).releasePointerCapture) == null || ge.call(te, L.pointerId), U(V, p.value));
        },
        onPointerCancel: () => C(null),
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: ve - 7, y: re.top, width: 14, height: k.height, fill: "transparent" }),
          /* @__PURE__ */ e.jsx("line", { x1: ve, x2: ve, y1: re.top, y2: re.top + k.height }),
          /* @__PURE__ */ e.jsx("path", { d: `M${ve - 5},${re.top}h10l-5,7z` })
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
  }, r = D("negativeLower"), le = D("positiveUpper"), J = B === null ? 0 : (le === null ? M.length : G(le)) - G(B), ce = R === null ? ((N = n.row) == null ? void 0 : N.negativeCount) ?? 0 : G(R) - (r === null ? 0 : G(r)), _ = () => {
    a({ ...Xs, negativeUpper: M[Math.floor(M.length * 0.1)], positiveLower: M[Math.floor(M.length * 0.5)] });
  };
  return /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-histogram", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-histogram-head", children: [
      /* @__PURE__ */ e.jsx("strong", { children: o("{file}: events in {channel}", { file: n.file.fileName, channel: l }) }),
      n.boundariesMoved && /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: i, children: o("Reset boundaries") }),
      n.spec === null && ((H = n.planned) == null ? void 0 : H.problem) === "no-negative-population" && /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn gl-comp-controls-by-hand", onClick: _, children: o("Mark by hand") })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        ref: v,
        className: "gl-comp-controls-plot",
        viewBox: `0 0 ${re.width} ${re.height}`,
        role: "group",
        "aria-label": o("Histogram of {file} in {channel}", { file: n.file.fileName, channel: l }),
        children: [
          R !== null && q !== null && /* @__PURE__ */ e.jsx(
            "rect",
            {
              className: "gl-comp-controls-negative",
              x: P(F(q)),
              y: re.top,
              width: Math.max(0, P(F(R)) - P(F(q))),
              height: k.height
            }
          ),
          B !== null && $ !== null && /* @__PURE__ */ e.jsx(
            "rect",
            {
              className: "gl-comp-controls-positive",
              x: P(F(B)),
              y: re.top,
              width: Math.max(0, P(F($)) - P(F(B))),
              height: k.height
            }
          ),
          /* @__PURE__ */ e.jsx("path", { className: "gl-comp-controls-own", d: T(S, !0) }),
          b && /* @__PURE__ */ e.jsx("path", { className: "gl-comp-controls-other", d: T(b, !1) }),
          /* @__PURE__ */ e.jsx("line", { className: "gl-comp-controls-axis", x1: re.left, x2: re.left + k.width, y1: re.top + k.height, y2: re.top + k.height }),
          Ur(x).map((V) => {
            const Q = re.left + V.at * k.width;
            return /* @__PURE__ */ e.jsxs("g", { className: "gl-comp-controls-tick", children: [
              /* @__PURE__ */ e.jsx("line", { x1: Q, x2: Q, y1: re.top + k.height, y2: re.top + k.height + 4 }),
              /* @__PURE__ */ e.jsx("text", { x: Q, y: re.height - 6, textAnchor: "middle", children: V.label })
            ] }, V.label);
          }),
          q !== null && W("negativeLower", q),
          R !== null && W("negativeUpper", R),
          $ !== null && W("positiveUpper", $),
          B !== null && W("positiveLower", B)
        ]
      }
    ),
    /* @__PURE__ */ e.jsxs("p", { className: "gl-comp-controls-counts", children: [
      B !== null && /* @__PURE__ */ e.jsx("span", { className: "is-positive", children: le === null ? o("Positive: {count} events at or above {value}", { count: J.toLocaleString("en-US"), value: Ln(B) }) : o("Positive: {count} events from {lower} to {upper}", { count: J.toLocaleString("en-US"), lower: Ln(B), upper: Ln(le) }) }),
      R !== null ? /* @__PURE__ */ e.jsx("span", { className: "is-negative", children: r === null ? o("Negative: {count} events below {value}", { count: ce.toLocaleString("en-US"), value: Ln(R) }) : o("Negative: {count} events from {lower} to {upper}", { count: ce.toLocaleString("en-US"), lower: Ln(r), upper: Ln(R) }) }) : h ? /* @__PURE__ */ e.jsx("span", { className: "is-negative", children: o("Negative: all {count} events of {file} (dashed line)", { count: ce.toLocaleString("en-US"), file: h.fileName }) }) : null
    ] }),
    /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: o("Each set of events has a lower and an upper boundary: drag one, or select it and use the arrow keys. Events outside both sets are not used.") })
  ] });
}
function fc({ workspaceFiles: n, takenNames: t, onAdd: a, onClose: i }) {
  const { t: o } = Oe(), [l] = A.useState(() => n.filter(({ sample: _ }) => _.instrument === "flow")), [c, h] = A.useState([]), [m, d] = A.useState({}), [p, C] = A.useState(null), [v, x] = A.useState(() => lc("Calculated matrix", t)), [S, b] = A.useState(null), [M, k] = A.useState(!1), [F, P] = A.useState(!1), f = A.useRef(null), T = A.useMemo(
    () => [...l, ...c].map(({ id: _, name: N, sample: H }) => jr(H, _, N)),
    [l, c]
  ), O = T.filter((_) => {
    var N;
    return ((N = m[_.id]) == null ? void 0 : N.role) === "ignored";
  }).map((_) => _.id).join(""), D = A.useMemo(() => ic(T, m), [T, O]), R = A.useMemo(() => oc(D, m), [D, m]), B = A.useMemo(() => new Map(R.files.map((_) => [_.file.id, _])), [R]), q = (_) => {
    var N;
    return ((N = T.find((H) => H.id === _)) == null ? void 0 : N.fileName) ?? _;
  }, $ = (p !== null ? B.get(p) : void 0) ?? R.files.find((_) => _.planned !== null) ?? null, g = A.useMemo(() => hc(R, q, o), [R, o]), U = (_, N) => {
    b(null), d((H) => ({ ...H, [_]: { ...H[_], ...N } }));
  }, W = async (_) => {
    k(!0), b(null);
    try {
      const N = [];
      for (const H of _)
        try {
          const V = new Nr(Cr(await H.arrayBuffer()));
          if (V.instrument !== "flow") throw new Error(o("not a flow cytometry file"));
          N.push({ id: `added-${Date.now()}-${N.length}-${H.name}`, name: H.name, sample: V });
        } catch (V) {
          b(o("{file} could not be read: {reason}", { file: H.name, reason: V instanceof Error ? V.message : String(V) }));
        }
      h((H) => [...H, ...N.filter((V) => ![...l, ...H].some((Q) => Q.name === V.name))]);
    } finally {
      k(!1);
    }
  }, G = (_) => {
    const N = Array.from(_.currentTarget.files ?? []);
    _.currentTarget.value = "", N.length > 0 && W(N);
  }, r = () => void Qs(f.current, { "application/vnd.isac.fcs": [".fcs"] }, "Compensation controls", !0).then((_) => {
    _ && _.length > 0 && W(_);
  }), le = async () => {
    if (R.estimate) {
      P(!0), b(null);
      try {
        const _ = await wr(
          R.matrixChannels,
          R.estimate.matrix,
          ac(R),
          v.trim().normalize("NFC").slice(0, 200) || "Calculated matrix"
        );
        i(a(_));
      } catch (_) {
        b(_ instanceof Error ? _.message : String(_));
      } finally {
        P(!1);
      }
    }
  }, J = R.estimate ? Math.max(0, ...R.estimate.matrix.flatMap((_, N) => _.filter((H, V) => N !== V).map(Math.abs))) : 0, ce = Object.keys(m).length > 0;
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (_) => {
    _.key === "Escape" && i();
  }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-controls", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-controls-title", children: [
    /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-controls-title", children: o("Calculate a matrix from single-stained controls") }),
    /* @__PURE__ */ e.jsx("p", { className: "gl-comp-controls-intro", children: o("Each file is read for what it is: a single-stained control and its channel, an unstained control, an FMO control or a stained sample. Correct anything read wrongly. The matrix is added to the list of matrices and compensates no file until you use it.") }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-bar", children: [
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", disabled: M, onClick: r, children: o(M ? "Reading…" : "Add FCS files…") }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", disabled: !ce, onClick: () => {
        d({}), b(null);
      }, children: o("Reset to what was read") }),
      /* @__PURE__ */ e.jsx("span", { className: "gl-hint", children: o("{files} files · {controls} controls used · {channels} channels in the matrix", {
        files: T.length,
        controls: R.files.filter((_) => _.planned !== null).length,
        channels: R.matrixChannels.length
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
      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-controls-files", children: T.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: o("No flow files yet. Add the control files, and a stained sample of the same experiment if you have one.") }) : /* @__PURE__ */ e.jsxs("table", { className: "gl-comp-controls-table", children: [
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
        /* @__PURE__ */ e.jsx("tbody", { children: T.map((_) => {
          const N = B.get(_.id) ?? null, H = m[_.id] ?? {}, V = H.role === "ignored" ? "ignored" : (N == null ? void 0 : N.role) ?? "ignored", Q = D.otherChannels.includes(_.id), ie = dc(N, R, Q, o), ee = V === "single-stain" || V === "fmo", ve = ($ == null ? void 0 : $.file.id) === _.id;
          return /* @__PURE__ */ e.jsxs(
            "tr",
            {
              "data-file-id": _.id,
              className: (ve ? "is-selected" : "") + (N != null && N.planned ? " is-control" : "") + (V === "ignored" || Q ? " is-unused" : ""),
              onClick: () => (N == null ? void 0 : N.planned) && C(_.id),
              children: [
                /* @__PURE__ */ e.jsx("td", { className: "gl-comp-controls-file", title: _.fileName, children: _.fileName }),
                /* @__PURE__ */ e.jsx("td", { children: /* @__PURE__ */ e.jsx(
                  "select",
                  {
                    "aria-label": o("What {file} is", { file: _.fileName }),
                    value: V,
                    disabled: Q,
                    onChange: (X) => U(_.id, { role: X.currentTarget.value }),
                    children: Object.keys(ko).filter((X) => X !== "unknown" || V === "unknown").map((X) => /* @__PURE__ */ e.jsx("option", { value: X, children: o(ko[X]) }, X))
                  }
                ) }),
                /* @__PURE__ */ e.jsx("td", { children: ee && N ? /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": o("Channel of {file}", { file: _.fileName }),
                    value: N.channel ?? "",
                    onChange: (X) => U(_.id, { channel: X.currentTarget.value || null, ...Xs }),
                    children: [
                      /* @__PURE__ */ e.jsx("option", { value: "", children: "—" }),
                      R.channels.map((X) => /* @__PURE__ */ e.jsx("option", { value: X.pnn, children: X.pnn }, X.pnn))
                    ]
                  }
                ) : "" }),
                /* @__PURE__ */ e.jsx("td", { children: N && V !== "ignored" ? uc(N, o) : "" }),
                /* @__PURE__ */ e.jsx("td", { children: N != null && N.planned ? /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": o("Particles of {file}", { file: _.fileName }),
                    value: H.kind ?? "auto",
                    onChange: (X) => U(_.id, { kind: X.currentTarget.value }),
                    children: [
                      /* @__PURE__ */ e.jsx("option", { value: "auto", children: N.planned.kindFrom === "chosen" ? o("Automatic") : N.planned.kind === "beads" ? o("Automatic: beads") : o("Automatic: cells") }),
                      /* @__PURE__ */ e.jsx("option", { value: "beads", children: o("Beads") }),
                      /* @__PURE__ */ e.jsx("option", { value: "cells", children: o("Stained cells") })
                    ]
                  }
                ) : "" }),
                /* @__PURE__ */ e.jsx("td", { children: N != null && N.planned ? /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": o("Negative events of {file}", { file: _.fileName }),
                    value: H.negative ?? "auto",
                    onChange: (X) => U(_.id, { negative: X.currentTarget.value }),
                    children: [
                      /* @__PURE__ */ e.jsx("option", { value: "auto", children: H.negative !== void 0 && H.negative !== "auto" ? o("Automatic") : N.spec === null ? o("Automatic: none found") : N.spec.negative.fileId === _.id ? o("Automatic: its own") : o("Automatic: unstained") }),
                      /* @__PURE__ */ e.jsx("option", { value: "internal", children: o("Its own negative peak") }),
                      /* @__PURE__ */ e.jsx("option", { value: "unstained", children: o("The unstained control") })
                    ]
                  }
                ) : "" }),
                /* @__PURE__ */ e.jsx("td", { className: "gl-comp-controls-events", children: N != null && N.row ? o("{positive} pos · {negative} neg", {
                  positive: N.row.positiveCount.toLocaleString("en-US"),
                  negative: N.row.negativeCount.toLocaleString("en-US")
                }) : N && V !== "ignored" ? _.eventCount.toLocaleString("en-US") : "" }),
                /* @__PURE__ */ e.jsx("td", { className: "gl-comp-controls-notes", children: ie.map((X) => /* @__PURE__ */ e.jsx("div", { children: X }, X)) })
              ]
            },
            _.id
          );
        }) })
      ] }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-side", children: [
        $ != null && $.planned && $.channel !== null ? /* @__PURE__ */ e.jsx(
          pc,
          {
            entry: $,
            files: D.files,
            onBoundaries: (_) => U($.file.id, _),
            onReset: () => U($.file.id, Xs)
          }
        ) : /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: o("Select a single-stained control to see its events and the boundaries of its negative and positive events.") }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-report", children: [
          /* @__PURE__ */ e.jsx("h4", { children: o("Findings") }),
          g.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: R.estimate ? o("Nothing to report.") : o("At least two channels need a control.") }) : /* @__PURE__ */ e.jsx("ul", { children: g.map((_) => /* @__PURE__ */ e.jsx("li", { children: _ }, _)) })
        ] })
      ] })
    ] }),
    R.estimate && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-controls-matrix", children: [
      /* @__PURE__ */ e.jsx("h4", { children: o("Calculated matrix · {count} channels", { count: R.matrixChannels.length }) }),
      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-controls-matrix-scroll", children: /* @__PURE__ */ e.jsxs("table", { "aria-label": o("Calculated spillover matrix"), children: [
        /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { title: o("Rows are the fluorochrome, columns the channel it spills into."), children: o("From \\ into") }),
          R.matrixChannels.map((_) => /* @__PURE__ */ e.jsx("th", { children: _.replace(/-A$/i, "") }, _))
        ] }) }),
        /* @__PURE__ */ e.jsx("tbody", { children: R.estimate.matrix.map((_, N) => /* @__PURE__ */ e.jsxs("tr", { children: [
          /* @__PURE__ */ e.jsx("th", { children: R.matrixChannels[N].replace(/-A$/i, "") }),
          _.map((H, V) => /* @__PURE__ */ e.jsx(
            "td",
            {
              style: Go(H, J, N === V),
              title: `${R.matrixChannels[N]} → ${R.matrixChannels[V]}: ${Te(H, !1, 4)}` + (N !== V && R.estimate.rows[N].uncertainty ? ` ± ${Te(R.estimate.rows[N].uncertainty[V], !1, 2)}` : ""),
              children: N === V ? "100%" : H === 0 ? "·" : `${(100 * H).toFixed(2)}%`
            },
            R.matrixChannels[V]
          ))
        ] }, R.matrixChannels[N])) })
      ] }) })
    ] }),
    S && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: S }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions gl-comp-controls-actions", children: [
      /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-controls-name", children: [
        /* @__PURE__ */ e.jsx("span", { children: o("Name") }),
        /* @__PURE__ */ e.jsx("input", { value: v, maxLength: 200, onChange: (_) => x(_.currentTarget.value) })
      ] }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: () => i(), children: o("Close") }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: !R.estimate || F, onClick: () => void le(), children: o("Add to matrices") })
    ] })
  ] }) });
}
function gc(n, t) {
  return n.type === "embedded" ? t("Embedded · {file}", { file: n.fileName }) : n.type === "external" ? t("From {file}", { file: n.label }) : n.type === "imported" ? t("Imported · {file}", { file: n.fileName }) : n.type === "edited" ? t("Edited from {name}", { name: n.from }) : n.type === "empty" ? t("Empty") : n.type === "calculated" ? t("Calculated · {count} controls", { count: n.controls }) : t("Preset · {name}", { name: n.presetId });
}
function ua({ row: n }) {
  const { t } = Oe();
  if (n.number === null) return null;
  const a = `M${n.number}`;
  return /* @__PURE__ */ e.jsxs(
    "span",
    {
      className: "gl-comp-lib-tag" + (n.primary ? " is-primary" : ""),
      title: n.primary ? t("{tag}, the primary matrix: the one in use when the data came in", { tag: a }) : a,
      children: [
        /* @__PURE__ */ e.jsx(Sr, { size: 12 }),
        a
      ]
    }
  );
}
function es(n) {
  return n.number === null ? n.name : `M${n.number} ${n.name}`;
}
function xc({
  rows: n,
  fileCount: t,
  unsavedEmbeddedFiles: a = [],
  busy: i,
  planSwitch: o,
  onUse: l,
  onRename: c,
  onDuplicate: h,
  onDuplicateAndEdit: m,
  onEditStarted: d,
  onDelete: p,
  onDeleteVersion: C,
  onImport: v,
  chooseImport: x,
  controls: S
}) {
  const { t: b } = Oe(), M = A.useRef(null), [k, F] = A.useState(null), [P, f] = A.useState(null), [T, O] = A.useState(null), [D, R] = A.useState(null), [B, q] = A.useState(null), [$, g] = A.useState({}), [U, W] = A.useState(null), [G, r] = A.useState(!1), [le, J] = A.useState(null), ce = async (L) => {
    J(null);
    try {
      J({ text: await v(L), error: !1 });
    } catch (te) {
      J({ text: te instanceof Error ? te.message : String(te), error: !0 });
    }
  }, _ = (L) => {
    var ge;
    const te = (ge = L.currentTarget.files) == null ? void 0 : ge[0];
    L.currentTarget.value = "", te && ce(te);
  }, N = () => void Qs(M.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "Spillover matrix").then((L) => {
    L != null && L[0] && ce(L[0]);
  }), H = () => {
    if (!k) return;
    const L = n.find(({ id: te }) => te === k.id);
    F(null), L && k.draft.trim() !== L.name && c(L, k.draft);
  }, V = async (L) => {
    J(null);
    try {
      await h(L);
    } catch (te) {
      J({ text: te instanceof Error ? te.message : String(te), error: !0 });
    }
  }, Q = (L) => ({
    ...L,
    name: b("{name}, version {version}", { name: L.name, version: L.version })
  }), ie = (L) => [
    {
      label: b("Use this version…"),
      className: "gl-comp-version-use",
      disabled: i || !l || L.active && L.filesUsing === t,
      title: l ? L.active && L.filesUsing === t ? b("Every file is already compensated with this version.") : b("Compensate every file with this version. The other versions stay as they are.") : b("The matrix of a hosted SCE is chosen in R."),
      onClick: () => f(Q(L))
    },
    {
      label: b("Duplicate and edit…"),
      className: "gl-comp-version-edit",
      disabled: i || !m,
      title: b(m ? "Copy this version as a new matrix, use the copy for every file and edit its coefficients beside the plots. This version stays as it is." : "The matrix of a hosted SCE is chosen in R."),
      onClick: () => O({ row: Q(L), copy: Vi(Q(L).name, new Set(n.map(({ name: te }) => te))) })
    },
    { label: b("Duplicate"), className: "gl-comp-version-duplicate", disabled: i, onClick: () => void V(Q(L)) },
    { label: b("Export CSV…"), className: "gl-comp-version-export", onClick: () => W(Q(L)) },
    ...C && L.canDelete ? [{ label: b("Delete…"), className: "gl-comp-version-delete", danger: !0, disabled: i, onClick: () => q(L) }] : []
  ], ee = (L) => {
    var ln;
    const te = new Date(((ln = L.profile) == null ? void 0 : ln.createdAt) ?? ""), ge = Number.isNaN(te.getTime()) ? "" : ` · ${te.toLocaleString()}`, Fe = L.parentVersion === null ? b("Baseline") : L.revisionReason === "reset-to-baseline" ? b("Reset to the baseline from version {version}", { version: L.parentVersion }) : b("Edited from version {version}", { version: L.parentVersion }), be = L.filesUsing > 0 && !(L.active && L.filesUsing === t) ? ` · ${b("{used} of {files} files", { used: L.filesUsing, files: t })}` : "";
    return `${Fe}${ge}${be}`;
  }, ve = (L) => [
    {
      label: b("Use for the workspace…"),
      className: "gl-comp-lib-use",
      disabled: i || !l || L.unusable !== null || L.active && L.filesUsing === t,
      title: l ? L.unusable !== null ? b("GateLab cannot store this matrix, so only its own file uses it: {reason}", { reason: L.unusable }) : L.active && L.filesUsing === t ? b("Every file is already compensated with this matrix.") : void 0 : b("The matrix of a hosted SCE is chosen in R."),
      onClick: () => f(L)
    },
    ...L.canRename ? [{
      label: b("Rename…"),
      className: "gl-comp-lib-rename",
      disabled: i,
      onClick: () => F({ id: L.id, draft: L.name })
    }] : [],
    {
      label: b("Duplicate and edit…"),
      className: "gl-comp-lib-edit",
      disabled: i || !m || L.unusable !== null,
      title: m ? L.unusable !== null ? b("GateLab cannot store this matrix, so only its own file uses it: {reason}", { reason: L.unusable }) : b("Copy this matrix, use the copy for every file and edit its coefficients beside the plots. This matrix stays as it is.") : b("The matrix of a hosted SCE is chosen in R."),
      onClick: () => O({ row: L, copy: Vi(L.name, new Set(n.map(({ name: te }) => te))) })
    },
    { label: b("Duplicate"), className: "gl-comp-lib-duplicate", disabled: i || L.unusable !== null, onClick: () => void V(L) },
    { label: b("Export CSV…"), className: "gl-comp-lib-export", onClick: () => W(L) },
    ...L.canDelete ? [{ label: b("Delete…"), className: "gl-comp-lib-delete", danger: !0, disabled: i, onClick: () => R(L) }] : []
  ], X = n.find(({ active: L }) => L) ?? null;
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrices", "aria-labelledby": "comp-matrices-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrices-head", children: [
      /* @__PURE__ */ e.jsx("h3", { id: "comp-matrices-heading", children: b("Matrices") }),
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", disabled: i, onClick: x ?? N, children: b("Import CSV/TSV…") }),
      S && /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-mini-btn gl-comp-lib-calculate",
          disabled: i,
          title: b("Calculate a spillover matrix from single-stained control files. It is added to this list and compensates no file until you use it."),
          onClick: () => r(!0),
          children: b("Calculate from controls…")
        }
      ),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-mini-btn gl-comp-lib-export-active",
          disabled: !X,
          title: X ? b("Download {name}, the matrix in use, as a CSV table that Import CSV/TSV… reads back.", { name: X.name }) : b("No matrix is in use."),
          onClick: () => X && W(X),
          children: b("Export CSV…")
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
        "aria-label": b("Import a spillover matrix"),
        onChange: _
      }
    ),
    n.length === 0 ? /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: b("No matrix yet: the files carry none, and none has been imported.") }) : /* @__PURE__ */ e.jsx("ul", { className: "gl-comp-lib-list", "aria-label": b("Matrices"), children: n.map((L) => /* @__PURE__ */ e.jsxs("li", { className: "gl-comp-lib-row" + (L.active ? " is-active" : ""), "data-matrix-id": L.id, children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-lib-text", children: [
        (k == null ? void 0 : k.id) === L.id ? /* @__PURE__ */ e.jsx(
          "input",
          {
            className: "gl-comp-lib-name-input",
            "aria-label": b("Name of {name}", { name: L.name }),
            value: k.draft,
            autoFocus: !0,
            maxLength: 200,
            onChange: (te) => F({ id: L.id, draft: te.currentTarget.value }),
            onBlur: H,
            onKeyDown: (te) => {
              te.key === "Enter" ? (te.preventDefault(), H()) : te.key === "Escape" && (te.preventDefault(), te.stopPropagation(), F(null));
            }
          }
        ) : /* @__PURE__ */ e.jsxs("span", { className: "gl-comp-lib-title", children: [
          /* @__PURE__ */ e.jsx(ua, { row: L }),
          /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-name", title: L.name, children: L.name })
        ] }),
        /* @__PURE__ */ e.jsxs("span", { className: "gl-comp-lib-meta", children: [
          L.primary ? `${b("Primary")} · ` : "",
          gc(L.source, b),
          " · ",
          b("{count} channels", { count: L.channelCount }),
          L.active && L.filesUsing !== t ? ` · ${b("{used} of {files} files", { used: L.filesUsing, files: t })}` : ""
        ] }),
        L.unusable !== null && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-unusable", title: L.unusable, children: b("Only its own file can use it") })
      ] }),
      L.active && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-active", children: b("Active") }),
      /* @__PURE__ */ e.jsx(
        Ui,
        {
          label: b("{name}: matrix actions", { name: L.name }),
          items: ve(L),
          icon: /* @__PURE__ */ e.jsx(Bi, { size: 16 }),
          className: "gl-comp-lib-menu"
        }
      ),
      L.versions.length > 1 && (() => {
        const te = $[L.id] ?? L.active, ge = `comp-versions-${L.id.replace(/[^A-Za-z0-9_-]/g, "_")}`;
        return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-comp-lib-versions-toggle",
              "aria-expanded": te,
              "aria-controls": ge,
              onClick: () => g((Fe) => ({ ...Fe, [L.id]: !te })),
              children: b("{count} versions", { count: L.versions.length })
            }
          ),
          te && /* @__PURE__ */ e.jsx("ol", { id: ge, className: "gl-comp-lib-versions", "aria-label": b("Versions of {name}", { name: L.name }), children: [...L.versions].reverse().map((Fe) => {
            var be;
            return /* @__PURE__ */ e.jsxs(
              "li",
              {
                className: "gl-comp-lib-version" + (Fe.active ? " is-active" : ""),
                "data-profile-id": (be = Fe.profile) == null ? void 0 : be.profileId,
                children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-lib-text", children: [
                    /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-version-name", children: b("Version {version}", { version: Fe.version }) }),
                    /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-meta", children: ee(Fe) })
                  ] }),
                  Fe.active && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-lib-active", children: b("Active") }),
                  /* @__PURE__ */ e.jsx(
                    Ui,
                    {
                      label: b("{name}: version actions", { name: Q(Fe).name }),
                      items: ie(Fe),
                      icon: /* @__PURE__ */ e.jsx(Bi, { size: 16 }),
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
    ] }, L.id)) }),
    a.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-hint gl-comp-lib-unsaved", children: b("The workspace cannot be saved while files use their own embedded matrix beside stored matrices: {files}. Use a matrix for the workspace, set those files to Original, or delete the stored matrices no file uses.", {
      files: a.join(", ")
    }) }),
    le && /* @__PURE__ */ e.jsx("div", { className: le.error ? "gl-comp-error" : "gl-comp-status", role: le.error ? "alert" : "status", children: le.text }),
    T && m && /* @__PURE__ */ e.jsx(
      Eo,
      {
        row: T.row,
        copy: T.copy,
        plan: o(T.row),
        revertible: a.length === 0,
        busy: i,
        onUse: async (L) => {
          await m(L, T.copy), J(null), d == null || d(T.copy);
        },
        onClose: () => O(null)
      }
    ),
    P && l && /* @__PURE__ */ e.jsx(
      Eo,
      {
        row: P,
        plan: o(P),
        revertible: a.length === 0,
        busy: i,
        onUse: async (L) => {
          await l(L), J(null);
        },
        onClose: () => f(null)
      }
    ),
    D && /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (L) => {
      L.key === "Escape" && R(null);
    }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-lib-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-matrix-delete-title", children: [
      /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-matrix-delete-title", children: b("Delete {name}?", { name: es(D) }) }),
      /* @__PURE__ */ e.jsx("p", { children: b("It leaves the workspace's list of matrices. No file is compensated with it.") }),
      /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
        /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", autoFocus: !0, onClick: () => R(null), children: b("Cancel") }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-btn gl-btn-danger",
            onClick: () => {
              p(D), R(null);
            },
            children: b("Delete")
          }
        )
      ] })
    ] }) }),
    B && C && /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (L) => {
      L.key === "Escape" && q(null);
    }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-lib-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-version-delete-title", children: [
      /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-version-delete-title", children: b("Delete {name}?", { name: es(Q(B)) }) }),
      /* @__PURE__ */ e.jsx("p", { children: b("It leaves the list of versions. No file is compensated with it, and no other version was edited from it.") }),
      /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
        /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", autoFocus: !0, onClick: () => q(null), children: b("Cancel") }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-btn gl-btn-danger",
            onClick: () => {
              C(B), q(null);
            },
            children: b("Delete")
          }
        )
      ] })
    ] }) }),
    G && S && /* @__PURE__ */ e.jsx(
      fc,
      {
        workspaceFiles: S.files,
        takenNames: new Set(n.map(({ name: L }) => L)),
        onAdd: S.onAdd,
        onClose: (L) => {
          r(!1), L !== void 0 && J({ text: L, error: !1 });
        }
      }
    ),
    U && /* @__PURE__ */ e.jsx(
      aa,
      {
        profileLabel: U.name,
        installedLabel: U.name,
        installedMatrix: U.exportMatrix,
        onClose: () => W(null)
      }
    )
  ] });
}
function Eo({
  row: n,
  copy: t,
  plan: a,
  revertible: i,
  busy: o,
  onUse: l,
  onClose: c
}) {
  const { t: h } = Oe(), [m, d] = A.useState(!1), [p, C] = A.useState(!1), [v, x] = A.useState(null), S = a.uncovered.length > 0, b = async () => {
    C(!0), x(null);
    try {
      await l(n), c();
    } catch (M) {
      x(M instanceof Error ? M.message : String(M));
    } finally {
      C(!1);
    }
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: (M) => {
    M.key === "Escape" && !p && c();
  }, children: /* @__PURE__ */ e.jsxs("div", { className: "gl-modal gl-comp-lib-dialog gl-comp-lib-switch", role: "dialog", "aria-modal": "true", "aria-labelledby": "comp-matrix-switch-title", children: [
    /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-matrix-switch-title", children: t === void 0 ? h("Use {name} for the workspace", { name: es(n) }) : h("Duplicate and edit {name}", { name: es(n) }) }),
    t === void 0 ? /* @__PURE__ */ e.jsx("p", { children: h("Every file in the workspace ({count}) is compensated with {name}.", { count: a.fileCount, name: n.name }) }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
      /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-copy", children: h("GateLab stores a copy, {copy}, and compensates every file in the workspace ({count}) with it, so the plots show each coefficient you change. {name} stays in the list as it is; use it again to go back.", {
        copy: t,
        count: a.fileCount,
        name: n.name
      }) }),
      /* @__PURE__ */ e.jsx("p", { children: h("Edited coefficients change no file until you choose Apply revised matrix, which asks again.") })
    ] }),
    /* @__PURE__ */ e.jsx("p", { children: a.gateCount > 0 ? h("Membership is recomputed for {gates} gates and {populations} populations drawn on channels this matrix compensates.", {
      gates: a.gateCount,
      populations: a.populationCount
    }) : h("No gate is drawn on a channel this matrix compensates.") }),
    a.leavingEmbedded.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-leaving", children: h("Leaving their own embedded matrix: {files}.", { files: a.leavingEmbedded.join(", ") }) }),
    !i && !S && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-lib-irreversible", children: h("The workspace as it stands cannot be saved, so Revert workspace cannot return to it afterwards; it returns to the last state that was saved or checkpointed.") }),
    S && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-error gl-comp-lib-uncovered", role: "alert", children: [
      /* @__PURE__ */ e.jsx("p", { children: h("These files cannot be compensated with this matrix, so it cannot be used for the workspace:") }),
      /* @__PURE__ */ e.jsx("ul", { children: a.uncovered.map((M) => /* @__PURE__ */ e.jsx("li", { children: M.wrongInstrument ? h("{file}: not a file of this instrument kind", { file: M.name }) : M.missingChannels.length > 0 ? h("{file}: lacks {channels}", { file: M.name, channels: M.missingChannels.join(", ") }) : h("{file}: {reason}", { file: M.name, reason: M.message ?? "" }) }, M.name)) }),
      /* @__PURE__ */ e.jsx("p", { children: h("Remove these files from the workspace, or choose a matrix that covers their channels.") })
    ] }),
    !S && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
      /* @__PURE__ */ e.jsx(
        "input",
        {
          type: "checkbox",
          checked: m,
          disabled: p,
          onChange: (M) => d(M.currentTarget.checked)
        }
      ),
      /* @__PURE__ */ e.jsx("span", { children: h("I agree that gate membership may change.") })
    ] }),
    v && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: v }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
      /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: p, onClick: c, children: h("Cancel") }),
      /* @__PURE__ */ e.jsx(
        "button",
        {
          type: "button",
          className: "gl-btn",
          disabled: S || !m || p || o,
          onClick: () => void b(),
          children: h(p ? "Compensating…" : t === void 0 ? "Use for the workspace" : "Make the copy and edit")
        }
      )
    ] })
  ] }) });
}
function Jn({
  value: n,
  onValueChange: t,
  scrubStep: a,
  className: i = "",
  disabled: o,
  min: l,
  max: c,
  step: h,
  title: m,
  onPointerDown: d,
  onPointerMove: p,
  onPointerUp: C,
  onPointerCancel: v,
  onLostPointerCapture: x,
  ...S
}) {
  const { t: b } = Oe(), M = A.useRef(null), [k, F] = A.useState(!1), P = (f) => {
    var T, O, D;
    ((T = M.current) == null ? void 0 : T.pointerId) === f.pointerId && (M.current = null, F(!1), (D = (O = f.currentTarget).hasPointerCapture) != null && D.call(O, f.pointerId) && f.currentTarget.releasePointerCapture(f.pointerId));
  };
  return /* @__PURE__ */ e.jsx(
    "input",
    {
      ...S,
      type: "number",
      className: `gl-scrubbable-number${k ? " is-scrubbing" : ""}${i ? ` ${i}` : ""}`,
      value: n,
      disabled: o,
      min: l,
      max: c,
      step: h,
      title: m ?? b("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (f) => t(f.currentTarget.value),
      onPointerDown: (f) => {
        var q, $;
        if (d == null || d(f), f.defaultPrevented || o || f.button !== 0) return;
        const T = f.currentTarget.getBoundingClientRect();
        if (f.clientX >= T.right - 18) return;
        const O = Number(n), D = (a ?? Number(h)) || 0.1;
        if (!Number.isFinite(O) || !(D > 0)) return;
        const R = String(D), B = R.includes("e-") ? Number(R.split("e-")[1]) : R.includes(".") ? R.split(".")[1].length : 0;
        M.current = {
          pointerId: f.pointerId,
          startY: f.clientY,
          startValue: O,
          step: D,
          decimals: B,
          lastSteps: 0
        }, ($ = (q = f.currentTarget).setPointerCapture) == null || $.call(q, f.pointerId);
      },
      onPointerMove: (f) => {
        p == null || p(f);
        const T = M.current;
        if (!T || T.pointerId !== f.pointerId) return;
        const O = T.startY - f.clientY;
        if (Math.abs(O) < 3) return;
        const D = O > 0 ? Math.floor(O / 4) : Math.ceil(O / 4);
        if (D === T.lastSteps) return;
        let R = T.startValue + D * T.step;
        const B = l === void 0 ? Number.NEGATIVE_INFINITY : Number(l), q = c === void 0 ? Number.POSITIVE_INFINITY : Number(c);
        Number.isFinite(B) && (R = Math.max(B, R)), Number.isFinite(q) && (R = Math.min(q, R)), M.current = { ...T, lastSteps: D }, F(!0), t(R.toFixed(Math.min(10, T.decimals))), f.preventDefault();
      },
      onPointerUp: (f) => {
        C == null || C(f), P(f);
      },
      onPointerCancel: (f) => {
        v == null || v(f), P(f);
      },
      onLostPointerCapture: (f) => {
        var T;
        x == null || x(f), ((T = M.current) == null ? void 0 : T.pointerId) === f.pointerId && (M.current = null, F(!1));
      }
    }
  );
}
const ni = A.createContext(Zs), ti = A.createContext(0.85), si = A.createContext(1), To = "", qt = [];
let Os = !1;
function vc(n) {
  const t = { cancelled: !1, run: n };
  qt.push(t);
  const a = () => {
    if (Os) return;
    Os = !0;
    const i = () => {
      Os = !1;
      let l = qt.shift();
      for (; l != null && l.cancelled; ) l = qt.shift();
      l == null || l.run(), qt.length > 0 && a();
    }, o = window;
    typeof o.requestIdleCallback == "function" ? o.requestIdleCallback(i, { timeout: 50 }) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(i) : setTimeout(i, 0);
  };
  return a(), () => {
    t.cancelled = !0;
  };
}
function ns({
  title: n,
  panel: t,
  preview: a,
  sourceLabel: i,
  receiverLabel: o,
  minimumSize: l = 210,
  maximumSize: c = 420,
  densityColorCeiling: h,
  densitySmoothing: m,
  showZeroPile: d = !0
}) {
  const { t: p } = Oe(), C = A.useContext(ni), v = A.useContext(ti), x = A.useContext(si), S = A.useRef(null);
  A.useEffect(() => {
    const k = S.current;
    if (!k) return;
    let F = null, P = 0;
    const f = () => {
      var q;
      F = null;
      const D = ((q = k.parentElement) == null ? void 0 : q.clientWidth) ?? 230, R = Math.max(l, Math.min(c, Math.floor(D)));
      if (R === P && k.childElementCount > 0) return;
      P = R;
      const B = Js(m, R);
      Jt(k, {
        title: n,
        panel: t,
        preview: a,
        sourceLabel: i,
        receiverLabel: o,
        size: R,
        densityColorCeiling: h ?? ei(
          a,
          0.95,
          B,
          C
        ),
        densitySmoothingRadius: B,
        densityColorPower: C,
        pointAlpha: v,
        pointSize: x
      });
    }, T = () => {
      F !== null && cancelAnimationFrame(F), F = requestAnimationFrame(f);
    };
    T();
    const O = typeof ResizeObserver > "u" ? null : new ResizeObserver(T);
    return O == null || O.observe(k.parentElement ?? k), () => {
      O == null || O.disconnect(), F !== null && cancelAnimationFrame(F);
    };
  }, [h, C, m, c, l, t, v, x, a, o, i, n]);
  const b = (k) => a.eventCount > 0 ? `${(k / a.eventCount * 100).toFixed(1)}%` : "0.0%", M = t.zeroPile.source > 0 || t.zeroPile.receiver > 0 || t.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": p("{title} density biplot; {source} on x, {receiver} on y", {
    title: n,
    source: i,
    receiver: o
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: S, className: "gl-comp-biplot-surface" }),
    d && M && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: p("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: b(t.zeroPile.source),
      receiver: b(t.zeroPile.receiver),
      both: b(t.zeroPile.corner)
    }) })
  ] });
}
function bc({
  title: n,
  preview: t,
  sourceLabel: a,
  receiverLabel: i,
  minimumSize: o,
  maximumSize: l,
  densityColorCeiling: c,
  densitySmoothing: h
}) {
  const { t: m } = Oe(), d = A.useContext(ni), p = A.useContext(ti), C = A.useContext(si), v = A.useRef(null);
  return A.useEffect(() => {
    const x = v.current;
    if (!x) return;
    let S = null, b = 0;
    const M = () => {
      var $;
      S = null;
      const P = (($ = x.parentElement) == null ? void 0 : $.clientWidth) ?? o, f = Math.max(o, Math.min(l, Math.floor(P)));
      if (f === b && x.dataset.cacheReady === "true") return;
      b = f, x.dataset.cacheReady = "false";
      const T = Js(h, f), O = c ?? ei(
        t,
        0.95,
        T,
        d
      );
      Jt(x, {
        title: n,
        panel: t.original,
        preview: t,
        sourceLabel: a,
        receiverLabel: i,
        size: f,
        densityColorCeiling: O,
        densitySmoothingRadius: T,
        densityColorPower: d,
        pointAlpha: p,
        pointSize: C,
        canvasScale: 2
      });
      const D = x.querySelector("canvas"), R = x.querySelector("svg"), B = document.createElement("div");
      Jt(B, {
        title: n,
        panel: t.compensated,
        preview: t,
        sourceLabel: a,
        receiverLabel: i,
        size: f,
        densityColorCeiling: O,
        densitySmoothingRadius: T,
        densityColorPower: d,
        pointAlpha: p,
        pointSize: C,
        canvasScale: 2
      });
      const q = B.querySelector("canvas");
      !D || !q || !R || (D.classList.add("gl-comp-cached-canvas", "is-original"), D.dataset.assayLayer = "original", q.classList.add("gl-comp-cached-canvas", "is-compensated"), q.dataset.assayLayer = "compensated", x.insertBefore(q, R), x.dataset.cacheReady = "true");
    }, k = () => {
      S == null || S(), S = vc(M);
    };
    k();
    const F = typeof ResizeObserver > "u" ? null : new ResizeObserver(k);
    return F == null || F.observe(x.parentElement ?? x), () => {
      F == null || F.disconnect(), S == null || S();
    };
  }, [c, d, h, l, o, p, C, t, i, a, n]), /* @__PURE__ */ e.jsx(
    "figure",
    {
      className: "gl-comp-biplot",
      "aria-label": m("Cached uncompensated and compensated density biplot; {source} on x, {receiver} on y", {
        source: a,
        receiver: i
      }),
      children: /* @__PURE__ */ e.jsx(
        "div",
        {
          ref: v,
          className: "gl-comp-biplot-surface gl-comp-cached-biplot",
          "data-cache-mode": "dual-canvas"
        }
      )
    }
  );
}
function Ao({
  preview: n,
  sourceLabel: t,
  receiverLabel: a,
  kind: i,
  densitySmoothing: o,
  compact: l = !1,
  compensatedTitle: c = "Compensated"
}) {
  const { t: h } = Oe(), m = n.eventCount > 0 ? n.original.zeroPile.receiver / n.eventCount * 100 : 0, d = n.eventCount > 0 ? n.compensated.zeroPile.receiver / n.eventCount * 100 : 0, p = d - m;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${l ? " is-compact" : ""}`, children: [
    !l && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: h("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: n.eventCount.toLocaleString(),
      sampled: n.totalEvents > n.eventCount ? h(" sampled from {total}", { total: n.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        ns,
        {
          title: h("Original"),
          panel: n.original,
          preview: n,
          sourceLabel: t,
          receiverLabel: a,
          densitySmoothing: o,
          showZeroPile: !l
        }
      ),
      /* @__PURE__ */ e.jsx(
        ns,
        {
          title: c,
          panel: n.compensated,
          preview: n,
          sourceLabel: t,
          receiverLabel: a,
          densitySmoothing: o,
          showZeroPile: !l
        }
      )
    ] }),
    !l && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-diagnostic-note", children: i === "cytof" ? /* @__PURE__ */ e.jsx(e.Fragment, { children: h("Receiver events at exact zero: {original}% → {compensated}% ({delta} percentage points). A rise can be consistent with NNLS over-subtraction, while a residual source-associated rise can be consistent with under-compensation. Neither is a verdict without a suitable negative/control population.", {
      original: m.toFixed(1),
      compensated: d.toFixed(1),
      delta: `${p >= 0 ? "+" : ""}${p.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: h("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: c
    }) }) }),
    !l && (n.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": h("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: h("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: h("{value} MAD", { value: xe(n.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: h("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: xe(n.evidence.residualSlope ?? 0, 4) })
      ] }),
      n.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: h("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: h("{value} MAD", { value: xe(n.evidence.upperTailExcessMad, 3) }) })
      ] }),
      n.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: h("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: h("{value} MAD", { value: xe(n.evidence.upperTailSlopeDeltaMad, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: h("Evidence groups") }),
        /* @__PURE__ */ e.jsx("dd", { children: h("{high} source-high · {low} source-low", {
          high: n.evidence.sourceHighEvents.toLocaleString(),
          low: n.evidence.sourceLowEvents.toLocaleString()
        }) })
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-evidence-insufficient", children: h("Residual screening needs distinct source-low/source-high groups and enough receiver-negative events; this pair remains available for visual review.") }))
  ] });
}
function yc({
  matrixView: n,
  sourceChannels: t,
  receiverChannels: a,
  selectedSourceIndex: i,
  selectedReceiverIndex: o,
  stagedCoefficients: l,
  maximumAbsoluteOffDiagonal: c,
  onSelect: h
}) {
  const { t: m } = Oe(), d = 6, p = 74, C = 44, v = 10, x = a.length * d, S = t.length * d, b = p + x + p, M = C + S + v, k = A.useMemo(() => {
    const P = [];
    for (let f = 0; f < n.matrix.length; f++)
      for (let T = 0; T < n.matrix[f].length; T++) {
        const O = n.sourceAxisKeys[f], D = n.receiverAxisKeys[T], R = `${O}${To}${D}`, B = l[R] ?? n.matrix[f][T], q = O === D;
        if (!q && (!Number.isFinite(B) || B === 0)) continue;
        const $ = c > 0 && Number.isFinite(B) ? Math.min(1, Math.abs(B) / c) : 0, g = $ > 0 ? 0.12 + 0.82 * Math.sqrt($) : 0;
        P.push({
          sourceIndex: f,
          receiverIndex: T,
          pairKey: R,
          value: B,
          diagonal: q,
          fill: q ? "#cfd4db" : Number.isFinite(B) ? B < 0 ? `rgba(47,128,237,${g})` : `rgba(211,47,47,${g})` : "#ae3e3e"
        });
      }
    return P;
  }, [n, c, l]), F = (P) => {
    const f = P.currentTarget.getBoundingClientRect();
    if (!(f.width > 0) || !(f.height > 0)) return;
    const T = (P.clientX - f.left) * b / f.width, O = (P.clientY - f.top) * M / f.height, D = Math.floor((T - p) / d), R = Math.floor((O - C) / d);
    R < 0 || R >= t.length || D < 0 || D >= a.length || n.sourceAxisKeys[R] === n.receiverAxisKeys[D] || h(`${n.sourceAxisKeys[R]}${To}${n.receiverAxisKeys[D]}`);
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-mini-matrix", "aria-labelledby": "comp-mini-matrix-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-mini-matrix-head", children: [
      /* @__PURE__ */ e.jsx("strong", { id: "comp-mini-matrix-heading", children: m("Matrix map") }),
      /* @__PURE__ */ e.jsx("span", { children: m("Source ↓ · receiver → · click a cell") })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        width: b,
        height: M,
        viewBox: `0 0 ${b} ${M}`,
        role: "img",
        "aria-label": m("Mini compensation matrix with {sources} source rows and {receivers} receiver columns", {
          sources: t.length,
          receivers: a.length
        }),
        onPointerDown: F,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: p, y: C, width: x, height: S, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          a.map((P, f) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: p + (f + 0.55) * d,
              y: C - 3,
              transform: `rotate(-58 ${p + (f + 0.55) * d} ${C - 3})`,
              textAnchor: "start",
              className: f === o ? "is-selected" : void 0,
              children: P.pnn
            },
            P.key
          )),
          t.map((P, f) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: p - 3,
              y: C + (f + 0.72) * d,
              textAnchor: "end",
              className: f === i ? "is-selected" : void 0,
              children: P.pnn
            },
            P.key
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: p,
              y: C + i * d,
              width: x,
              height: d,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: p + o * d,
              y: C,
              width: d,
              height: S,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          k.map((P) => /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: p + P.receiverIndex * d,
              y: C + P.sourceIndex * d,
              width: d,
              height: d,
              fill: P.fill,
              pointerEvents: "none",
              children: /* @__PURE__ */ e.jsx("title", { children: P.diagonal ? m("{channel} · self", { channel: t[P.sourceIndex].combined }) : `${t[P.sourceIndex].combined} → ${a[P.receiverIndex].combined} · ${Te(P.value)}` })
            },
            P.pairKey
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: p + o * d,
              y: C + i * d,
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
function jc({
  dataset: n,
  pair: t,
  plotSize: a,
  densitySmoothing: i,
  flagged: o,
  selected: l,
  onSelect: c,
  onFlag: h
}) {
  const { t: m } = Oe(), d = A.useRef(null), [p, C] = A.useState(() => typeof IntersectionObserver > "u");
  A.useEffect(() => {
    const S = d.current;
    if (!S || typeof IntersectionObserver > "u") {
      C(!0);
      return;
    }
    const b = new IntersectionObserver(
      (M) => C(M.some((k) => k.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return b.observe(S), () => b.disconnect();
  }, []);
  const v = A.useMemo(
    () => p ? sa(n, t.source.key, t.receiver.key) : null,
    [n, t.receiver.key, t.source.key, p]
  ), x = v != null && v.ready ? v.preview : null;
  return /* @__PURE__ */ e.jsxs(
    "article",
    {
      ref: d,
      className: `gl-comp-global-tile${l ? " is-selected" : ""}${o ? " is-flagged" : ""}`,
      "data-pair-key": t.pairKey,
      "data-event-signature": x == null ? void 0 : x.eventSignature,
      "data-x-range": x ? `${x.xRange[0]},${x.xRange[1]}` : void 0,
      "data-y-range": x ? `${x.yRange[0]},${x.yRange[1]}` : void 0,
      style: { width: a, height: a },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-tile-head", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: c,
              title: `${t.source.combined} → ${t.receiver.combined}`,
              "aria-label": m("Open details for {source} to {receiver}", {
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
          /* @__PURE__ */ e.jsx("label", { title: m("Keep this pair in Flagged"), children: /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: o,
              "aria-label": m("Flag global inspector pair {source} to {receiver} for follow-up", {
                source: t.source.label,
                receiver: t.receiver.label
              }),
              onChange: (S) => h(S.currentTarget.checked)
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-comp-global-plot-button",
            onClick: c,
            title: m("{source} → {receiver} · {interaction}matrix {coefficient}%", {
              source: t.source.combined,
              receiver: t.receiver.combined,
              interaction: t.interaction && t.interaction !== "other" ? `${t.interaction} · ` : "",
              coefficient: (t.coefficient * 100).toFixed(1)
            }),
            "aria-label": m("Open details for {source} to {receiver}; matrix coefficient {coefficient}%", {
              source: t.source.label,
              receiver: t.receiver.label,
              coefficient: (t.coefficient * 100).toFixed(1)
            }),
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: a, height: a }, children: x ? /* @__PURE__ */ e.jsx(
              bc,
              {
                title: "",
                preview: x,
                sourceLabel: t.source.label,
                receiverLabel: t.receiver.label,
                minimumSize: a,
                maximumSize: a,
                densitySmoothing: i
              }
            ) : v && !v.ready ? /* @__PURE__ */ e.jsx("span", { children: v.reason }) : /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" }) })
          }
        )
      ]
    }
  );
}
function wc({
  stateKey: n,
  header: t,
  children: a
}) {
  const { t: i } = Oe(), [o, l] = Le(
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
              "aria-label": i("Showing {shown} data; click to show {other} data", {
                shown: i(o === "original" ? "uncompensated" : "compensated"),
                other: i(o === "original" ? "compensated" : "uncompensated")
              }),
              title: i("Toggle every plot between uncompensated and compensated data without changing its frame"),
              onClick: () => l((c) => c === "original" ? "compensated" : "original"),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "gl-comp-layer-toggle-track", "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", {}) }),
                /* @__PURE__ */ e.jsx("span", { children: i(o === "original" ? "Uncompensated" : "Compensated") })
              ]
            }
          )
        ] }),
        a
      ]
    }
  );
}
const Nc = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', _s = 58 * Math.PI / 180, Fo = 54, Io = {
  view: { least: 12, budgeted: 38, most: 44, largest: 72, budget: 760 },
  inline: { least: 42, budgeted: 54, most: 64, largest: 96, budget: 960 }
}, Cc = 30, Sc = 16, Mc = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, kc = [
  { id: "matrices", label: "Matrices" },
  { id: "review", label: "Review" },
  { id: "display", label: "Display" }
];
function Ds({ label: n, text: t }) {
  return /* @__PURE__ */ e.jsx("span", { className: "gl-hint-icon gl-comp-pane-hint", role: "img", "aria-label": n, title: t, children: "?" });
}
function Ec(n) {
  if (!n) return ["its channels do not map to the file"];
  if (n.ok) return ["not a valid spillover matrix"];
  const t = new Set(n.errors.map(({ code: i }) => i)), a = [];
  return t.has("negative-coefficient") && a.push("negative coefficients"), t.has("non-unit-diagonal") && a.push("diagonal not 1"), a.length > 0 ? a : ["not a valid spillover matrix"];
}
const Tc = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], _e = "", Ac = 6e4, $o = 2500, Ro = 400, Fc = 2500, Lo = 15e3, Po = [2500, 5e3, 15e3, 5e4], Ic = 24, Oo = 4, _o = 624, $c = Object.freeze({});
function Do(n) {
  if (!Number.isFinite(n)) return String(n);
  const t = n * 100;
  if (t === 0) return "0.0";
  const a = Math.abs(t), i = a >= 1 ? 1 : a >= 0.1 ? 2 : 3;
  return t.toFixed(i);
}
function Ks(n) {
  return n.replace(/(?: · (?:edited|revised))+$/u, "");
}
function ts(n, t) {
  const a = n.index(t), i = a === void 0 ? void 0 : n.channels[a], o = (i == null ? void 0 : i.pnn) ?? t, l = n.labelForKey(t), c = ((i == null ? void 0 : i.label) ?? "").trim() || ((i == null ? void 0 : i.marker) ?? "").trim(), h = c && c !== o ? `${c} (${o})` : o;
  return { key: t, pnn: o, label: l, combined: h };
}
function Rc(n, t) {
  const a = n.channels.find((i) => i.pnn === t);
  return ((a == null ? void 0 : a.label) ?? "").trim() || ((a == null ? void 0 : a.marker) ?? "").trim();
}
function Gt(n, t) {
  const a = n.channels.find((i) => i.pnn === t);
  return ts(n, (a == null ? void 0 : a.key) ?? t);
}
function Lc(n, t) {
  return n === "cytof-spillover" && t === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function Pc(n) {
  return n.replaceAll("-", " ");
}
function Ys(n) {
  if (n.length === 0) return 0;
  n.sort((a, i) => a - i);
  const t = Math.floor(n.length / 2);
  return n.length % 2 === 0 ? (n[t - 1] + n[t]) / 2 : n[t];
}
function Oc(n) {
  return Object.fromEntries(n.scientific.solverSettings.map(({ key: t, value: a }) => [t, a]));
}
function _c(n, t) {
  const a = Object.freeze({ ...n.scientific.matrix, matrix: t }), i = Oc(n);
  return n.scientific.kind === "flow-spillover" ? {
    kind: "flow-spillover",
    method: "matrix-inverse",
    solverVersion: n.scientific.solverVersion,
    solverSettings: {
      singularTolerance: Number(i.singularTolerance),
      conditionWarningThreshold: Number(i.conditionWarningThreshold)
    },
    matrix: a
  } : {
    kind: "cytof-spillover",
    method: "nnls",
    solverVersion: n.scientific.solverVersion,
    solverSettings: {
      tolerance: Number(i.tolerance),
      kktTolerance: Number(i.kktTolerance),
      maxIterations: Number(i.maxIterations),
      adaptationVersion: String(i.adaptationVersion)
    },
    matrix: a,
    includedChannels: n.scientific.includedChannels
  };
}
function Ko(n, t, a, i) {
  const o = n.scientific.matrix.sourceChannels.indexOf(t), l = n.scientific.matrix.receiverChannels.indexOf(a);
  if (o < 0 || l < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(n.scientific.matrix.matrix.map(
    (c, h) => Object.freeze(c.map((m, d) => h === o && d === l ? i : m))
  ));
}
function Dc(n, t, a) {
  var c;
  if (!n) return null;
  const i = n.scientific.matrix.sourceChannels.indexOf(t), o = n.scientific.matrix.receiverChannels.indexOf(a);
  if (i < 0 || o < 0) return null;
  const l = (c = n.scientific.matrix.matrix[i]) == null ? void 0 : c[o];
  return Number.isFinite(l) ? l : null;
}
function zo(n, t, a) {
  const i = Math.max(Math.abs(n), Math.abs(t), 1e-3);
  return Object.freeze(a === "cytof" ? { lower: 0, upper: Math.max(n + i, i * 2) } : { lower: n - i, upper: n + i });
}
function Kc(n, t) {
  const a = (t - n) / 3;
  return Object.freeze([n, n + a, n + 2 * a, t]);
}
function zc(n, t) {
  return n.length === t.length && n.every((a, i) => {
    var o;
    return a.length === ((o = t[i]) == null ? void 0 : o.length) && a.every((l, c) => l === t[i][c]);
  });
}
function Uc(n, t) {
  if (n.compensatedLayerStatus().state !== "ready" || t.length === 0 || n.fcs.nEvents === 0) return null;
  const i = t.flatMap((C) => {
    const v = n.channels.findIndex((x) => x.pnn === C);
    return v < 0 ? [] : [v];
  });
  if (i.length === 0) return null;
  const o = Math.min(2048, n.fcs.nEvents), l = [];
  let c = 0, h = 0, m = 0, d = "", p = -1;
  for (const C of i) {
    const v = n.originalColumnData(C), x = n.compensatedColumnData(C), S = [];
    for (let M = 0; M < o; M++) {
      const k = o === 1 ? 0 : Math.floor(M * (n.fcs.nEvents - 1) / (o - 1)), F = v[k], P = x[k], f = Math.abs(P - F);
      S.push(f), l.push(f), f > Math.max(1e-6, Math.abs(F) * 1e-6) && c++, F < 0 && P === 0 && m++, h = Math.max(h, f);
    }
    const b = Ys(S);
    b > p && (p = b, d = ts(n, n.channels[C].key).combined);
  }
  return {
    previewEvents: o,
    comparedValues: l.length,
    changedValues: c,
    medianAbsoluteDelta: Ys(l),
    maxAbsoluteDelta: h,
    zeroedNegativeValues: m,
    mostChangedChannel: d,
    mostChangedChannelMedianDelta: Math.max(0, p)
  };
}
function Bc(n, t) {
  return n.origin.type === "uploaded" ? n.origin.fileName : n.origin.type === "embedded-fcs" ? `${n.origin.fileName} · ${t("embedded FCS")}` : n.origin.type === "manual" ? t("set by hand, from an empty matrix") : n.origin.type === "calculated" ? t("calculated from single-stained controls") : `${n.origin.presetId} · ${t("bundled preset")} ${n.origin.presetVersion}`;
}
function Vc(n) {
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
  }, a = zs(
    t.input,
    "cytof-spillover"
  );
  return a.ok ? {
    draft: {
      fileName: n.name,
      source: "host",
      parsed: t,
      matrix: a.value,
      validationWarnings: a.warnings
    },
    error: null
  } : {
    draft: null,
    error: `The SCE spillover matrix is invalid. ${a.errors.map(({ message: i }) => i).join(" ")}`
  };
}
function Wc({
  sample: n,
  sampleName: t = "sample.fcs",
  hostedCompensationMatrix: a = null,
  compensationOn: i,
  onApplyProfile: o,
  otherEmbeddedLayerFiles: l = [],
  onRemoveProfile: c,
  existingHostAssays: h = [],
  onAdoptExistingAssay: m,
  onCancelApply: d,
  hasExistingGates: p = !1,
  applyStatus: C = null,
  installedProfile: v = null,
  applyTargetCount: x = 1,
  applyTargetEventCount: S,
  applyWorkerCount: b,
  applyWorkerLimit: M,
  onApplyWorkerCountChange: k,
  installedBaselineProfile: F = null,
  reviewPopulations: P = [],
  reviewPopulationMasks: f = $c,
  onPreviewCompensationCandidate: T,
  onSolveCompensationSweep: O,
  onCancelCompensationSweep: D,
  onSuspendBackgroundWork: R,
  visible: B = !0,
  stateKey: q,
  densityColorPower: $ = Zs,
  channelLabelMode: g = "marker",
  onDensityColorPowerChange: U = () => {
  },
  matrices: W,
  onApplyRevision: G
}) {
  var Di, Ki;
  const { t: r } = Oe(), le = Mr("compensation"), J = n.compensatedLayerStatus(), ce = J.state === "missing" ? null : J.metadata, _ = (ce == null ? void 0 : ce.runtimeIdentity) === "profile" ? ce : null, N = (v == null ? void 0 : v.profileId) === (_ == null ? void 0 : _.profileId) ? v : null, H = !_ && n.instrument === "flow" ? n.spillover : null, V = (a == null ? void 0 : a.kind) === "flow-spillover" ? a : null, Q = A.useMemo(
    () => Vc(a),
    [a]
  ), [ie, ee] = Le(
    `compensation.${q}.selectedPair`,
    null
  ), [ve, X] = A.useState(null), [L, te] = Le(
    `compensation.${q}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [ge, Fe] = Le(
    "compensation.inspectorWidth",
    _o
  ), [be, ln] = Le(
    `compensation.${q}.workspaceView`,
    "matrix"
  ), [nn, jt] = Le(
    `compensation.${q}.globalPairFilter`,
    "relevant"
  ), [ha, ma] = Le(
    `compensation.${q}.globalLayout`,
    null
  ), [pa, fa] = Le(
    "compensation.globalPlotSize.v5",
    160
  ), [ga, xa] = Le(
    "compensation.densitySmoothing.v3",
    6
  ), [va, ba] = Le(
    "compensation.pointAlpha.v1",
    0.85
  ), [ya, ja] = Le(
    "compensation.pointSize.v1",
    1
  ), [ii, wa] = Le(
    "compensation.paneSection.v1",
    "matrices"
  ), [os, Na] = Le(
    "compensation.pairPreviewEventLimit.v1",
    Lo
  ), [tt, oi] = A.useState(""), [st, as] = A.useState(!1), [rs, ai] = A.useState(null), [Kn, ls] = Le(
    `compensation.${q}.reviewPopulation`,
    "all"
  ), [wt, Ca] = Le(
    `compensation.${q}.flaggedPairs`,
    []
  ), [cn, Sa] = Le(
    `compensation.${q}.evidenceMode`,
    "biological"
  ), [Ma, ka] = Le(
    `compensation.${q}.sweepBounds`,
    {}
  ), [cs, ds] = Le(
    `compensation.${q}.sweepWorkers`,
    2
  ), [Xe, ri] = A.useState(""), [Ve, us] = A.useState(""), [Ea, hs] = A.useState(0), [Ta, Aa] = A.useState(0), [ue, Nt] = A.useState({}), [Fa, kn] = A.useState({}), [dn, En] = A.useState({ state: "idle" }), [Ia, vn] = A.useState({}), [$a, Tn] = A.useState({}), [ze, zn] = A.useState(null), [Ra, it] = A.useState(null), [Ie, Un] = A.useState(null), [li, De] = A.useState(null), [Ct, ms] = A.useState(""), [La, ci] = A.useState(!1), [Pa, di] = A.useState(!1), Ye = A.useRef(0), Bn = A.useRef(0), [ui, he] = A.useState(null), [ps, fs] = A.useState(!1), [hi, $e] = A.useState(!1), [me, St] = A.useState(
    () => Q.draft
  ), [ot, bn] = A.useState(
    () => {
      var j;
      const s = ((j = Q.draft) == null ? void 0 : j.matrix.receiverChannels) ?? [], u = /* @__PURE__ */ new Map();
      for (const w of n.channels) {
        const E = w.pnn.trim().normalize("NFC");
        u.set(E, (u.get(E) ?? 0) + 1);
      }
      return new Set(s.filter((w) => u.get(w) === 1));
    }
  ), [mi, yn] = A.useState(
    () => Q.error
  ), [We, un] = A.useState(!1), [Mt, pi] = A.useState(!1), [kt, fi] = A.useState(
    () => {
      var s;
      return ((s = h[0]) == null ? void 0 : s.id) ?? "";
    }
  ), [gs, Et] = A.useState(!1), [Tt, Ke] = A.useState(null), [Oa, tn] = A.useState(!1), [_a, hn] = A.useState(null), Ze = A.useRef(!1), gi = A.useRef(null), xi = A.useRef(null), An = A.useRef(null), [At, Da] = A.useState(null), [xs, vi] = A.useState(null), [vs, bi] = A.useState("fit");
  A.useEffect(() => {
    if (!At || typeof ResizeObserver > "u") {
      vi(null);
      return;
    }
    const s = () => {
      const { width: j, height: w } = At.getBoundingClientRect();
      vi((E) => {
        if (j <= 0 || w <= 0) return null;
        const I = { width: Math.round(j), height: Math.round(w) };
        return E && E.width === I.width && E.height === I.height ? E : I;
      });
    };
    s();
    const u = new ResizeObserver(s);
    return u.observe(At), () => u.disconnect();
  }, [At]);
  const ne = Oa || C !== null, jn = Math.max(0, Math.floor(x)), Ka = Math.max(
    0,
    Math.floor(S ?? n.fcs.nEvents)
  ), wn = h.find(
    ({ id: s }) => s === kt
  ) ?? h[0] ?? null;
  A.useEffect(() => {
    var s;
    kt && h.some(({ id: u }) => u === kt) || (fi(((s = h[0]) == null ? void 0 : s.id) ?? ""), Et(!1));
  }, [h, kt]);
  const we = C ?? (Tt ? {
    phase: "applying",
    profileName: _a ?? (me == null ? void 0 : me.fileName) ?? "Compensation",
    fraction: Tt.fraction,
    processedEvents: Tt.processedEvents,
    totalEvents: Tt.totalEvents
  } : null);
  A.useEffect(() => {
    B || (Bn.current++, Ye.current++, En({ state: "idle" }), Un(null), zn(null), R == null || R());
  }, [R, B]);
  const bs = A.useMemo(
    () => n.channels.map(({ pnn: s, columnIndex: u }) => ({ pnn: s, columnIndex: u })),
    [n]
  ), Re = A.useMemo(() => {
    if (!H) return null;
    const s = H.channels.map((E) => {
      const I = n.index(E);
      return I === void 0 ? null : n.channels[I].pnn;
    });
    if (s.some((E) => E === null))
      return {
        validation: null,
        error: "The embedded matrix could not be mapped back to exact FCS channel identities.",
        keyword: void 0,
        roundedCoefficients: 0
      };
    const { validation: u, roundedCoefficients: j } = kr({
      sourceChannels: s,
      receiverChannels: s,
      matrix: H.matrix
    }), w = ["$SPILLOVER", "$SPILL", "SPILL"].find((E) => typeof n.fcs.keywords[E] == "string");
    return {
      validation: u,
      error: u.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${u.errors.map(({ message: E }) => E).join(" ")}`,
      keyword: w,
      roundedCoefficients: j
    };
  }, [n, H]), de = Kn === "all" ? null : P.find(({ id: s }) => s === Kn) ?? null, Ne = de ? f[de.id] ?? null : null, Ce = Ne ? (de == null ? void 0 : de.eventCount) ?? 0 : n.fcs.nEvents, Ft = os === "all" ? "all" : Po.includes(Number(os)) ? Number(os) : Lo, at = A.useMemo(
    () => Mn(
      n.fcs.nEvents,
      Ft === "all" ? Math.max(1, n.fcs.nEvents) : Ft,
      Ne
    ),
    [Ft, Ce, Ne, n]
  ), rt = A.useMemo(
    () => Mn(n.fcs.nEvents, 2048, Ne),
    [Ne, n]
  ), ys = A.useMemo(
    () => Mn(
      n.fcs.nEvents,
      Fc,
      Ne
    ),
    [Ne, n]
  );
  A.useEffect(() => {
    Kn !== "all" && !P.some(({ id: s }) => s === Kn) && ls("all");
  }, [Kn, P, ls]), A.useEffect(() => {
    Ye.current++, D == null || D(), vn({}), Tn({}), zn(null), Un(null), De(null);
  }, [Kn, Ne, D]);
  const Se = A.useMemo(() => me ? Er({
    kind: "cytof-spillover",
    matrix: me.matrix,
    sampleChannels: bs,
    includedChannels: Array.from(ot)
  }) : null, [me, ot, bs, g]), y = A.useMemo(() => {
    var u;
    if (H) {
      const j = n.spilloverOrigin, w = j.kind === "external" ? j : null;
      return {
        sourceAxisKeys: H.channels,
        receiverAxisKeys: H.channels,
        sourceChannels: H.channels.map((E) => ts(n, E)),
        receiverChannels: H.channels.map((E) => ts(n, E)),
        matrix: H.matrix,
        kind: "flow",
        title: V ? "SCE spillover matrix" : w ? `Compensation matrix from ${w.label}` : "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: w ? "This FCS carries no spillover matrix of its own; these coefficients came from the imported FlowJo workspace and are applied unchanged." + (w.droppedChannels.length ? ` ${w.droppedChannels.length} of its parameter(s) are not in this file (${w.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "") : "Applying the embedded matrix leaves its coefficients unchanged." + (j.kind === "fcs" && ((u = j.droppedChannels) != null && u.length) ? ` ${j.droppedChannels.length} of its parameter(s) are not among this file's channels (${j.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "")
      };
    }
    if (!N || !_) return null;
    const s = N.scientific.kind === "cytof-spillover" ? Br(N.scientific.matrix) : N.scientific.matrix;
    return s.matrix.length !== s.sourceChannels.length || s.matrix.some((j) => !j || j.length !== s.receiverChannels.length) ? null : {
      sourceAxisKeys: s.sourceChannels,
      receiverAxisKeys: s.receiverChannels,
      sourceChannels: s.sourceChannels.map((j) => Gt(n, j)),
      receiverChannels: s.receiverChannels.map((j) => Gt(n, j)),
      matrix: s.matrix,
      kind: N.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: N.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: N.scientific.kind === "cytof-spillover" ? r("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: s.sourceChannels.length,
        receivers: s.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: N.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [V, _, N, n, H, r, g]), Pe = ha ?? (y && y.sourceAxisKeys.length <= Sc ? "matrix" : "compact"), je = (y == null ? void 0 : y.sourceChannels) ?? [], Me = (y == null ? void 0 : y.receiverChannels) ?? [];
  A.useEffect(() => {
    ds((s) => Math.max(1, Math.min(Oo, Math.round(s) || 1)));
  }, [ds]);
  const It = ve ?? ie, js = A.useMemo(() => {
    if (!y || !ie) return !1;
    const [s, u] = ie.split(_e);
    return s !== u && y.sourceAxisKeys.includes(s) && y.receiverAxisKeys.includes(u);
  }, [y, ie]), K = A.useMemo(() => {
    if (!y || !It) return null;
    const [s, u] = It.split(_e), j = y.sourceAxisKeys.indexOf(s), w = y.receiverAxisKeys.indexOf(u);
    return j < 0 || w < 0 || y.sourceAxisKeys[j] === y.receiverAxisKeys[w] ? null : {
      pairKey: It,
      sourceIndex: j,
      receiverIndex: w,
      source: je[j],
      receiver: Me[w],
      value: y.matrix[j][w],
      interaction: y.kind === "cytof" ? et(
        y.sourceAxisKeys[j],
        y.receiverAxisKeys[w]
      ) : null
    };
  }, [It, y, Me, je]);
  A.useEffect(() => {
    if (!K) {
      ms("");
      return;
    }
    const s = ue[K.pairKey];
    ms(xe((s ?? K.value) * 100, 6));
  }, [K == null ? void 0 : K.pairKey, K == null ? void 0 : K.value, ue]);
  const Ue = A.useMemo(() => K ? Rs(
    n,
    K.source.key,
    K.receiver.key,
    {
      eventMask: Ne,
      fixedEventIndices: at,
      eligibleEventCount: Ce
    }
  ) : null, [i, J.state, at, Ce, Ne, n, K]), qe = A.useMemo(() => {
    if (!y || y.kind === "cytof" || J.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const s = [];
    for (let E = 0; E < y.matrix.length; E++)
      for (let I = 0; I < y.matrix[E].length; I++) {
        const z = y.sourceAxisKeys[E], Y = y.receiverAxisKeys[I];
        if (z === Y) continue;
        const Z = y.matrix[E][I];
        if (!Number.isFinite(Z)) continue;
        const se = null;
        Z === 0 && cn === "biological" || s.push({
          sourceIndex: E,
          receiverIndex: I,
          pairKey: `${z}${_e}${Y}`,
          source: je[E],
          receiver: Me[I],
          coefficient: Z,
          interaction: se,
          physicalPrior: 0
        });
      }
    s.sort((E, I) => I.physicalPrior - E.physicalPrior || Math.abs(I.coefficient) - Math.abs(E.coefficient));
    const u = s.slice(0, 240), j = u.flatMap((E) => {
      const I = Rs(
        n,
        E.source.key,
        E.receiver.key,
        {
          eventMask: Ne,
          fixedEventIndices: rt,
          eligibleEventCount: Ce
        }
      );
      return I.ready ? [{ ...E, evidence: I.preview.evidence }] : [];
    }), w = Qr(
      j.map(({ coefficient: E, physicalPrior: I, evidence: z }) => ({ coefficient: E, physicalPrior: I, evidence: z })),
      y.kind,
      cn
    ).map(({ index: E, relativePriority: I }) => ({ ...j[E], relativePriority: I }));
    return {
      candidateCount: s.length,
      screenedCount: u.length,
      evaluableCount: j.length,
      items: w.slice(0, 8)
    };
  }, [Ea, cn, J.state, y, Me, rt, Ce, Ne, n, je]), ke = A.useMemo(() => new Set(
    N ? N.scientific.kind === "flow-spillover" ? N.scientific.matrix.receiverChannels : N.scientific.includedChannels : []
  ), [N]), pe = A.useMemo(() => y ? Al(
    n,
    Array.from(/* @__PURE__ */ new Set([
      ...y.sourceAxisKeys,
      ...y.receiverAxisKeys
    ])),
    {
      eventMask: Ne,
      fixedEventIndices: ys,
      eligibleEventCount: Ce
    }
  ) : null, [
    i,
    ys,
    J.state,
    y,
    Ce,
    Ne,
    n
  ]);
  A.useEffect(() => {
    if (!y || ke.size === 0) return;
    const s = ke.has(Xe) ? Xe : y.sourceAxisKeys.find((j) => ke.has(j)) ?? "", u = ke.has(Ve) && Ve !== s ? Ve : y.receiverAxisKeys.find((j) => j !== s && ke.has(j)) ?? "";
    s !== Xe && ri(s), u !== Ve && us(u);
  }, [ke, Ve, Xe, y]);
  const Vn = A.useMemo(() => new Set(wt), [wt]), ws = A.useMemo(() => {
    var j;
    if (!y) return [];
    const s = [], u = ke.size > 0;
    for (let w = 0; w < y.sourceAxisKeys.length; w++) {
      const E = y.sourceAxisKeys[w];
      if (!(u && !ke.has(E)))
        for (let I = 0; I < y.receiverAxisKeys.length; I++) {
          const z = y.receiverAxisKeys[I];
          if (E === z || u && !ke.has(z)) continue;
          const Y = (j = y.matrix[w]) == null ? void 0 : j[I];
          if (!Number.isFinite(Y)) continue;
          const Z = je[w], se = Me[I];
          if (!Z || !se || pe != null && pe.ready && (!pe.dataset.channels.has(Z.key) || !pe.dataset.channels.has(se.key))) continue;
          const ae = y.kind === "cytof" ? et(E, z) : null, fe = ae !== null && ae !== "self" && ae !== "other";
          s.push({
            sourceIndex: w,
            receiverIndex: I,
            pairKey: `${E}${_e}${z}`,
            source: Z,
            receiver: se,
            coefficient: Y,
            interaction: ae,
            physicalPrior: fe ? 1 : 0
          });
        }
    }
    return s;
  }, [pe, ke, y, Me, je]), Ge = A.useMemo(() => {
    const s = tt.trim().toLocaleLowerCase();
    return ws.filter((u) => {
      const j = Math.abs(u.coefficient) > 1e-12, w = u.physicalPrior > 0;
      return nn === "all" || nn === "relevant" && (j || w) || nn === "nonzero" && j || nn === "physical" && w || nn === "flagged" && Vn.has(u.pairKey) ? s ? `${u.source.combined} ${u.receiver.combined}`.toLocaleLowerCase().includes(s) : !0 : !1;
    });
  }, [Vn, ws, nn, tt]);
  A.useEffect(() => {
    var u;
    if (!rs || be !== "global") return;
    const s = [...((u = An.current) == null ? void 0 : u.querySelectorAll(".gl-comp-global-tile")) ?? []].find((j) => j.dataset.pairKey === rs);
    s && (s.scrollIntoView({ block: "center", inline: "center" }), ai(null));
  }, [st, Pe, rs, Ge, be]);
  const Ns = A.useMemo(() => {
    if (Pe === "compact" || Pe === "matrix") return [];
    const s = /* @__PURE__ */ new Map();
    for (const u of Ge) {
      const j = Pe === "source" ? u.source : u.receiver, w = s.get(j.key);
      w ? w.pairs.push(u) : s.set(j.key, { channel: j, pairs: [u] });
    }
    return [...s.values()];
  }, [Pe, Ge]), za = A.useMemo(() => {
    const s = /* @__PURE__ */ new Map();
    if (Pe !== "matrix") return s;
    for (const u of Ge) s.set(`${u.sourceIndex}:${u.receiverIndex}`, u);
    return s;
  }, [Pe, Ge]), yi = A.useMemo(
    () => Pe === "compact" ? Ge : Pe === "matrix" ? [...Ge].sort((s, u) => s.sourceIndex - u.sourceIndex || s.receiverIndex - u.receiverIndex) : Ns.flatMap((s) => s.pairs),
    [Ns, Pe, Ge]
  ), ji = `${r(Mc[nn])}${tt.trim() ? r(" · search “{query}”", { query: tt.trim() }) : ""}`, lt = Math.max(120, Math.min(220, Math.round(pa) || 120)), wi = A.useRef(null), [Ni, Ci] = A.useState(0);
  A.useEffect(() => {
    const s = wi.current;
    if (!s || Pe !== "matrix" || typeof ResizeObserver > "u") return;
    const u = new ResizeObserver(() => Ci(s.clientWidth));
    return u.observe(s), Ci(s.clientWidth), () => u.disconnect();
  }, [Pe, be, pe == null ? void 0 : pe.ready]);
  const Si = (y == null ? void 0 : y.receiverChannels.length) ?? 0, Cs = Si > 0 && Ni > 0 ? Math.max(120, Math.min(lt, Math.floor((Ni - 92 - 12) / Si))) : lt, Nn = Math.max(1, Math.min(10, Math.round(ga) || 6)), $t = Math.max(0.1, Math.min(1, Number(va) || 0.85)), Rt = Math.max(0.3, Math.min(3, Number(ya) || 1)), ye = A.useMemo(() => !N || !y || J.state !== "ready" ? [] : wt.flatMap((s) => {
    const [u, j] = s.split(_e), w = y.sourceAxisKeys.indexOf(u), E = y.receiverAxisKeys.indexOf(j);
    if (w < 0 || E < 0 || u === j || !ke.has(u) || !ke.has(j)) return [];
    const I = Rs(
      n,
      je[w].key,
      Me[E].key,
      {
        eventMask: Ne,
        fixedEventIndices: rt,
        eligibleEventCount: Ce
      }
    );
    if (!I.ready) return [];
    const z = qe.items.find((Y) => Y.pairKey === s);
    return [{
      sourceIndex: w,
      receiverIndex: E,
      pairKey: s,
      source: je[w],
      receiver: Me[E],
      coefficient: y.matrix[w][E],
      interaction: y.kind === "cytof" ? et(u, j) : null,
      physicalPrior: y.kind === "cytof" && et(u, j) !== "other" ? 1 : 0,
      evidence: I.preview.evidence,
      relativePriority: (z == null ? void 0 : z.relativePriority) ?? 0
    }];
  }), [wt, ke, J.state, y, N, Me, qe.items, rt, Ce, Ne, n, je]), sn = ye, Mi = A.useMemo(() => {
    if (!N) return 0.01;
    const s = [];
    for (let u = 0; u < N.scientific.matrix.matrix.length; u++) {
      const j = N.scientific.matrix.sourceChannels[u];
      for (let w = 0; w < N.scientific.matrix.matrix[u].length; w++) {
        if (j === N.scientific.matrix.receiverChannels[w]) continue;
        const E = Math.abs(N.scientific.matrix.matrix[u][w]);
        Number.isFinite(E) && E > 1e-12 && s.push(E);
      }
    }
    return s.length > 0 ? Ys(s) : 0.01;
  }, [N]), Ss = (s, u) => {
    const j = Ma[s];
    if (j) return j;
    const w = zo(u, Mi, (y == null ? void 0 : y.kind) ?? "flow");
    return {
      lowerPercent: xe(w.lower * 100, 5),
      upperPercent: xe(w.upper * 100, 5)
    };
  }, ct = (s, u) => {
    const j = Ss(s, u), w = Number(j.lowerPercent) / 100, E = Number(j.upperPercent) / 100;
    return !Number.isFinite(w) || !Number.isFinite(E) ? { lower: w, upper: E, error: "Enter finite lower and upper sweep bounds." } : (y == null ? void 0 : y.kind) === "cytof" && w < 0 ? { lower: w, upper: E, error: "CyTOF NNLS sweep bounds cannot be negative." } : E > w ? { lower: w, upper: E, error: null } : { lower: w, upper: E, error: "The upper sweep bound must be greater than the lower bound." };
  }, Lt = (s, u, j, w) => {
    ka((E) => ({
      ...E,
      [s]: {
        ...E[s] ?? (() => {
          const I = zo(u, Mi, (y == null ? void 0 : y.kind) ?? "flow");
          return {
            lowerPercent: xe(I.lower * 100, 5),
            upperPercent: xe(I.upper * 100, 5)
          };
        })(),
        [j]: w
      }
    })), vn((E) => {
      if (!(s in E)) return E;
      const I = { ...E };
      return delete I[s], I;
    }), Tn((E) => {
      if (!(s in E)) return E;
      const I = { ...E };
      return delete I[s], I;
    });
  }, dt = (s, u) => {
    Ca((j) => u ? j.includes(s) ? j : [...j, s] : j.filter((w) => w !== s)), u ? (ee(s), it(s)) : (vn((j) => {
      if (!(s in j)) return j;
      const w = { ...j };
      return delete w[s], w;
    }), Tn((j) => {
      if (!(s in j)) return j;
      const w = { ...j };
      return delete w[s], w;
    }));
  }, Ua = () => {
    if (!y || !Xe || !Ve || Xe === Ve) return;
    if (!ke.has(Xe) || !ke.has(Ve)) {
      De("Both channels must be included in the installed compensation solve.");
      return;
    }
    const s = `${Xe}${_e}${Ve}`;
    dt(s, !0), De(null);
  }, Ms = sn.reduce((s, u) => s + (ct(u.pairKey, u.coefficient).error ? 1 : 0), 0), mn = A.useMemo(() => {
    if (!N) return null;
    const s = N.scientific.matrix.matrix.map((u) => Array.from(u));
    for (const [u, j] of Object.entries(ue)) {
      const [w, E] = u.split(_e), I = N.scientific.matrix.sourceChannels.indexOf(w), z = N.scientific.matrix.receiverChannels.indexOf(E);
      I >= 0 && z >= 0 && (s[I][z] = j);
    }
    return Object.freeze(s.map((u) => Object.freeze(u)));
  }, [N, ue]), Ba = A.useMemo(
    () => Mn(n.fcs.nEvents, Ac, Ne),
    [Ne, n]
  ), ks = A.useMemo(() => !N || N.scientific.kind !== "cytof-spillover" || !mn ? null : {
    sourceChannels: N.scientific.matrix.sourceChannels,
    receiverChannels: N.scientific.matrix.receiverChannels,
    matrix: mn
  }, [N, mn]), Fn = Ml({
    enabled: B && be === "screen",
    sample: n,
    eventIndices: Ba,
    matrix: ks,
    revision: Ta
  }), ki = A.useMemo(
    () => {
      var s;
      return ((s = Fn.result) == null ? void 0 : s.pairs.filter(({ verdict: u }) => u === "above-data" || u === "below-floor").length) ?? 0;
    },
    [Fn.result]
  );
  A.useEffect(() => {
    const s = Object.keys(ue).length;
    if (!B || s === 0 || !N || N.scientific.kind !== "flow-spillover" || J.state !== "ready" || !mn || !K || !T) {
      Bn.current++, En({ state: "idle" });
      return;
    }
    const u = at;
    if (u.length === 0) {
      En({
        state: "error",
        pairKey: K.pairKey,
        message: r("The selected review population contains no events.")
      });
      return;
    }
    const j = ++Bn.current, w = K.pairKey;
    En((I) => ({
      state: "updating",
      pairKey: w,
      ...(I.state === "ready" || I.state === "updating") && I.pairKey === w && I.preview ? { preview: I.preview } : {}
    }));
    const E = window.setTimeout(() => {
      T(
        N,
        u,
        mn
      ).then((I) => {
        if (Bn.current !== j) return;
        const z = I.sourceChannels.indexOf(K.source.pnn), Y = I.sourceChannels.indexOf(K.receiver.pnn);
        if (z < 0 || Y < 0)
          throw new Error(r("The preview result did not contain the selected flow channels."));
        const Z = Ls(
          n,
          K.source.pnn,
          K.receiver.pnn,
          u,
          I.candidateColumns[z],
          I.candidateColumns[Y],
          { totalEvents: Ce }
        );
        if (!Z.ready) throw new Error(Z.reason);
        En({
          state: "ready",
          pairKey: w,
          preview: Z.preview
        });
      }).catch((I) => {
        if (Bn.current !== j) return;
        const z = I instanceof Error ? I.message : String(I);
        /cancel|supersed|stale/i.test(z) || En({ state: "error", pairKey: w, message: z });
      });
    }, 90);
    return () => window.clearTimeout(E);
  }, [
    J.state,
    T,
    N,
    at,
    Ce,
    n,
    n.dataRevision,
    n.displayTransformContextKey,
    n.layerRevision,
    K,
    ue,
    r,
    B,
    mn
  ]);
  const Va = A.useMemo(() => !y || Object.keys(ue).length === 0 ? null : {
    sourceChannels: y.sourceAxisKeys,
    receiverChannels: y.receiverAxisKeys,
    matrix: y.matrix.map(
      (s, u) => s.map((j, w) => {
        const E = `${y.sourceAxisKeys[u]}${_e}${y.receiverAxisKeys[w]}`;
        return ue[E] ?? j;
      })
    )
  }, [y, ue]), Ei = A.useMemo(() => {
    if (!y) return [];
    const s = [];
    for (let u = 0; u < y.matrix.length; u++)
      for (let j = 0; j < y.matrix[u].length; j++) {
        const w = y.matrix[u][j];
        y.sourceAxisKeys[u] === y.receiverAxisKeys[j] || !Number.isFinite(w) || w <= 1 || s.push(`${je[u].combined} → ${Me[j].combined}`);
      }
    return s;
  }, [y, Me, je]), Es = A.useMemo(() => {
    if (!y) return [];
    const s = [];
    for (let u = 0; u < y.matrix.length; u++)
      for (let j = 0; j < y.matrix[u].length; j++) {
        const w = y.matrix[u][j], E = y.sourceAxisKeys[u] === y.receiverAxisKeys[j], I = `${je[u].combined} → ${Me[j].combined}`;
        Number.isFinite(w) ? E && Math.abs(w - 1) > 1e-8 ? s.push(`${je[u].combined}: diagonal is ${Te(w)}, not 100%`) : !E && w < 0 ? s.push(`${I}: negative coefficient (${Te(w)})`) : !E && w > 1 && s.push(`${I}: coefficient above 100%`) : s.push(`${I}: non-finite coefficient (${String(w)})`);
      }
    return s;
  }, [y, Me, je]), Ti = A.useMemo(
    () => (y == null ? void 0 : y.matrix.some((s) => s.some((u) => !Number.isFinite(u)))) ?? !1,
    [y]
  ), Qe = A.useMemo(
    () => _ && J.state === "ready" ? Uc(n, _.includedPnns) : null,
    [J.state, _, n]
  ), Pt = A.useMemo(() => {
    const s = [...Es];
    return J.state === "stale" && s.push(...J.reasons.map((u) => `Profile unavailable: ${Pc(u)}`)), s;
  }, [J, Es]), Ai = _ ? (N == null ? void 0 : N.name) ?? "Installed compensation profile" : H ? V ? "SCE spillover matrix" : "Embedded FCS matrix" : "No compatible matrix", Wa = _ ? Lc(_.kind, _.method) : H ? "Flow linear inverse" : "Not configured", Ot = r(Wa), Ts = (_ == null ? void 0 : _.includedPnns.length) ?? (H == null ? void 0 : H.channels.length) ?? 0, _t = (N == null ? void 0 : N.name) ?? (_ == null ? void 0 : _.profileId) ?? Ai, Fi = Ks(_t), qa = Fi !== _t || (N == null ? void 0 : N.recordType) === "revision" ? `${Fi} · ${r("revised")}` : _t, Ga = H !== null && !Ti || _ !== null && J.state === "ready", Ii = A.useMemo(() => {
    if (!y) return 0;
    let s = 0;
    for (let u = 0; u < y.matrix.length; u++)
      for (let j = 0; j < y.matrix[u].length; j++) {
        if (y.sourceAxisKeys[u] === y.receiverAxisKeys[j]) continue;
        const w = y.matrix[u][j];
        Number.isFinite(w) && (s = Math.max(s, Math.abs(w)));
      }
    return s;
  }, [y]), ut = !!((N == null ? void 0 : N.scientific.kind) === "flow-spillover" && J.state === "ready" && y && Math.max(y.sourceAxisKeys.length, y.receiverAxisKeys.length) <= Ic), Wn = A.useMemo(() => {
    const u = [...je, ...Me].map((Z) => Z.combined), j = typeof document > "u" ? null : document.createElement("canvas").getContext("2d");
    j && (j.font = `11px ${Nc}`);
    const w = (Z) => j ? j.measureText(Z).width : Z.length * 11 * 0.55, E = u.reduce((Z, se) => Math.max(Z, w(se)), 0), I = Math.min(320, Math.max(94, Math.ceil(E) + 12)), z = Math.min(260, Math.max(82, Math.ceil(E) + 6)), Y = Math.max(88, Math.ceil(z * Math.sin(_s) + 12));
    return { rowLabelWidth: I, columnLabelWidth: z, columnLabelHeight: Y };
  }, [ut, Me, je]), ht = ut ? Io.inline : Io.view, Ha = y ? (() => {
    const s = Math.max(1, y.sourceAxisKeys.length), u = Math.max(1, y.receiverAxisKeys.length), j = Math.max(s, u), { least: w, budgeted: E, most: I, budget: z } = ht;
    if (!xs) return Math.max(w, Math.min(E, Math.floor(z / j)));
    const Y = (xs.width - Fo - Wn.rowLabelWidth - Wn.columnLabelWidth * Math.cos(_s)) / u, Z = (xs.height - Fo - Wn.columnLabelHeight) / s;
    return Math.max(w, Math.min(I, Math.floor(Math.min(Y, Z))));
  })() : 13, on = y && vs !== "fit" ? Math.max(ht.least, Math.min(ht.largest, Math.round(vs))) : Ha, Xa = on >= Cc, mt = A.useMemo(() => ({
    ...Wn,
    // The last column's label leans past the matrix's right edge by its horizontal extent.
    overhang: Math.max(0, Math.ceil(Wn.columnLabelWidth * Math.cos(_s) - on / 2))
  }), [Wn, on]);
  A.useEffect(() => {
    Nt({}), kn({}), En({ state: "idle" }), Bn.current++;
  }, [N == null ? void 0 : N.profileId]), A.useEffect(() => {
    (y == null ? void 0 : y.kind) === "flow" && nn === "physical" && jt("relevant");
  }, [nn, y == null ? void 0 : y.kind, jt]);
  const Ya = (s) => {
    te((u) => ({ ...u, [s]: !u[s] }));
  }, $i = (s) => {
    var w;
    const u = ((w = An.current) == null ? void 0 : w.getBoundingClientRect().width) ?? 1100, j = Math.max(360, Math.min(900, u - 440 - 8));
    return Math.max(360, Math.min(j, Math.round(s)));
  }, Za = (s) => {
    var E;
    if (s.button !== 0) return;
    s.preventDefault();
    const u = s.currentTarget;
    (E = u.setPointerCapture) == null || E.call(u, s.pointerId);
    const j = (I) => {
      var Y;
      const z = (Y = An.current) == null ? void 0 : Y.getBoundingClientRect();
      z && Fe($i(z.right - I.clientX));
    }, w = () => {
      var I;
      window.removeEventListener("pointermove", j), window.removeEventListener("pointerup", w), window.removeEventListener("pointercancel", w), (I = u.releasePointerCapture) == null || I.call(u, s.pointerId);
    };
    window.addEventListener("pointermove", j), window.addEventListener("pointerup", w), window.addEventListener("pointercancel", w);
  }, Qa = (s) => {
    let u = null;
    s.key === "ArrowLeft" ? u = ge + 40 : s.key === "ArrowRight" ? u = ge - 40 : s.key === "Home" && (u = _o), u !== null && (s.preventDefault(), Fe($i(u)));
  }, Ja = async (s) => {
    var j;
    const u = (j = s.currentTarget.files) == null ? void 0 : j[0];
    s.currentTarget.value = "", u && await Ri(u);
  }, As = () => void Qs(gi.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "CyTOF spillover matrix").then((s) => {
    s != null && s[0] && Ri(s[0]);
  }), Ri = async (s) => {
    yn(null), he(null), $e(!1), Ke(null), un(!1);
    try {
      const u = Or(await s.text()), j = zs(
        u.input,
        "cytof-spillover"
      );
      if (!j.ok)
        throw new Error(j.errors.map(({ message: I }) => I).join(" "));
      const w = /* @__PURE__ */ new Map();
      for (const { pnn: I } of bs) {
        const z = I.trim().normalize("NFC");
        w.set(z, (w.get(z) ?? 0) + 1);
      }
      const E = j.value.receiverChannels.filter(
        (I) => w.get(I) === 1
      );
      St({
        fileName: s.name,
        source: "file",
        parsed: u,
        matrix: j.value,
        validationWarnings: j.warnings
      }), bn(new Set(E));
    } catch (u) {
      St(null), bn(/* @__PURE__ */ new Set()), yn(u instanceof Error ? u.message : String(u));
    }
  }, er = (s, u) => {
    bn((j) => {
      const w = new Set(j);
      return u ? w.add(s) : w.delete(s), w;
    });
  }, Li = async () => {
    var j, w;
    if (!me)
      throw new Error(r("Choose a CyTOF spillover matrix first."));
    const s = ((w = (j = globalThis.crypto) == null ? void 0 : j.randomUUID) == null ? void 0 : w.call(j)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, u = me.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation";
    return Is(
      {
        kind: "cytof-spillover",
        method: "nnls",
        solverVersion: _r,
        solverSettings: Dr,
        matrix: me.matrix,
        includedChannels: Array.from(ot)
      },
      {
        profileId: `cytof-${s}`,
        name: u,
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
  }, nr = async () => {
    if (!(Ze.current || ne || !me || !(Se != null && Se.canApply) || !o)) {
      if (p && !We) {
        yn(
          r("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      yn(null), he(null), Ke(null), Ze.current = !0, tn(!0), hn(me.fileName);
      try {
        const s = await Li();
        await o(s, Ke), he(r("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: s.name,
          channels: ot.size,
          files: jn
        })), St(null), bn(/* @__PURE__ */ new Set()), un(!1), Ke(null);
      } catch (s) {
        const u = s instanceof Error ? s.message : String(s);
        /cancel/i.test(u) ? he(r("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : yn(u);
      } finally {
        Ze.current = !1, tn(!1), hn(null);
      }
    }
  }, tr = async () => {
    if (!(Ze.current || ne || !me || !(Se != null && Se.canApply) || !wn || !m || !gs)) {
      if (p && !We) {
        yn(
          r("Confirm that existing gate memberships will be recomputed in compensated coordinates before adopting the assay.")
        );
        return;
      }
      yn(null), he(null), Ke(null), Ze.current = !0, tn(!0), hn(wn.label);
      try {
        const s = await Li();
        await m(
          s,
          wn,
          Ke
        ), he(r("Using existing SCE assay {assay} with {matrix}. No assay values were recomputed.", {
          assay: wn.label,
          matrix: s.name
        })), St(null), bn(/* @__PURE__ */ new Set()), un(!1), Et(!1), Ke(null);
      } catch (s) {
        yn(s instanceof Error ? s.message : String(s));
      } finally {
        Ze.current = !1, tn(!1), hn(null);
      }
    }
  }, sr = async () => {
    var w, E;
    if (Ze.current || ne || !o) return;
    if (p && !We) {
      $e(!0), he(
        r("Confirm that existing gate memberships will be recomputed in compensated coordinates before starting a matrix.")
      );
      return;
    }
    const s = n.channels.map((I, z) => ({ pnn: I.pnn, index: z })).filter(({ index: I }) => n.isFluorChannel(I) && !n.isImagingFeatureChannel(I)).map(({ pnn: I }) => I);
    if (s.length < 2) {
      $e(!0), he(r("An empty matrix needs at least two fluorescence channels."));
      return;
    }
    const u = zs({
      sourceChannels: s,
      receiverChannels: s,
      matrix: s.map((I, z) => s.map((Y, Z) => z === Z ? 1 : 0))
    }, "flow-spillover");
    if (!u.ok) {
      $e(!0), he(u.errors.map(({ message: I }) => I).join(" "));
      return;
    }
    const j = `${t.replace(/\.fcs$/i, "") || "Flow"} manual matrix`;
    he(null), $e(!1), Ke(null), Ze.current = !0, tn(!0), hn(j);
    try {
      const I = ((E = (w = globalThis.crypto) == null ? void 0 : w.randomUUID) == null ? void 0 : E.call(w)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, z = await Is(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: Hi,
          solverSettings: Gi,
          matrix: u.value
        },
        {
          profileId: `flow-manual-${I}`,
          name: j,
          createdAt: /* @__PURE__ */ new Date(),
          origin: { type: "manual", startedAs: "identity" },
          provenance: {
            sourceDescription: "Identity matrix over the file's fluorescence channels, to be set by hand in GateLab",
            estimationMethod: "Manual"
          }
        }
      );
      await o(z, Ke), un(!1), he(r("Manual matrix editing is ready: every spillover starts at zero. Select a pair and set its coefficient."));
    } catch (I) {
      $e(!0), he(I instanceof Error ? I.message : String(I));
    } finally {
      Ze.current = !1, tn(!1);
    }
  }, ir = async () => {
    if (!(!c || ne || Mt)) {
      if (p && !We) {
        $e(!0), he(
          r("Confirm that existing gate memberships will be recomputed in original coordinates before removing the matrix.")
        );
        return;
      }
      pi(!0);
      try {
        await c(), $e(!1), he(r("No file is compensated: the original assay is active and every file reads its stored values. The matrix stays in the Matrices list."));
      } catch (s) {
        $e(!0), he(s instanceof Error ? s.message : String(s));
      } finally {
        pi(!1);
      }
    }
  }, or = async () => {
    var u, j, w;
    if (Ze.current || ne || !H || !((u = Re == null ? void 0 : Re.validation) != null && u.ok) || !o) return;
    if (p && !We) {
      $e(!0), he(
        r("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const s = (V == null ? void 0 : V.name) || `${t.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    he(null), $e(!1), Ke(null), Ze.current = !0, tn(!0), hn(s);
    try {
      const E = ((w = (j = globalThis.crypto) == null ? void 0 : j.randomUUID) == null ? void 0 : w.call(j)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, I = await Is(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: Hi,
          solverSettings: Gi,
          matrix: Re.validation.value
        },
        {
          profileId: `flow-${E}`,
          name: s,
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
            estimationMethod: Rr(
              V ? "Imported from SCE metadata" : "Imported from FCS",
              Re.roundedCoefficients
            )
          }
        }
      );
      await o(I, Ke), un(!1);
      const z = r(V ? "Flow matrix editing is ready. The exact hosted matrix is retained as the baseline, and Original measurements remain available." : "Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available.");
      he(Re.roundedCoefficients > 0 ? r("Flow matrix editing is ready. {count} coefficients within 0.001% of 0 or 100% were set to exactly 0 or 100% to store the matrix; all others are as the file carries them. Original measurements remain available.", {
        count: Re.roundedCoefficients
      }) : z);
    } catch (E) {
      $e(!0), he(E instanceof Error ? E.message : String(E));
    } finally {
      Ze.current = !1, tn(!1), hn(null), Ke(null);
    }
  }, Pi = (s, u) => {
    var E, I;
    const j = je[s], w = Me[u];
    !y || !j || !w || y.sourceAxisKeys[s] === y.receiverAxisKeys[u] || (ee(`${y.sourceAxisKeys[s]}${_e}${y.receiverAxisKeys[u]}`), (I = (E = xi.current) == null ? void 0 : E.querySelector(
      `button[data-source-index="${s}"][data-receiver-index="${u}"]`
    )) == null || I.focus());
  }, ar = (s, u, j) => {
    if (!y) return;
    const w = y.sourceAxisKeys.length, E = y.receiverAxisKeys.length;
    let I = u, z = j;
    const Y = (se, ae) => {
      let fe = se + ae;
      for (; fe >= 0 && fe < E; ) {
        if (y.sourceAxisKeys[u] !== y.receiverAxisKeys[fe]) return fe;
        fe += ae;
      }
      return se;
    }, Z = (se, ae) => {
      let fe = se + ae;
      for (; fe >= 0 && fe < w; ) {
        if (y.sourceAxisKeys[fe] !== y.receiverAxisKeys[j]) return fe;
        fe += ae;
      }
      return se;
    };
    switch (s.key) {
      case "ArrowLeft":
        z = Y(j, -1);
        break;
      case "ArrowRight":
        z = Y(j, 1);
        break;
      case "ArrowUp":
        I = Z(u, -1);
        break;
      case "ArrowDown":
        I = Z(u, 1);
        break;
      case "Home": {
        z = y.sourceAxisKeys[u] === y.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const se = E - 1;
        z = y.sourceAxisKeys[u] === y.receiverAxisKeys[se] ? se - 1 : se;
        break;
      }
      default:
        return;
    }
    s.preventDefault(), Pi(I, z);
  }, In = (s, u) => {
    if (!N || !Number.isFinite(u)) return;
    const [j, w] = s.split(_e), E = N.scientific.matrix.sourceChannels.indexOf(j), I = N.scientific.matrix.receiverChannels.indexOf(w);
    if (E < 0 || I < 0) return;
    if (N.scientific.kind === "cytof-spillover" && u < 0) {
      $e(!0), he(r("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const z = N.scientific.matrix.matrix[E][I];
    Nt((Y) => {
      const Z = { ...Y };
      return u === z ? delete Z[s] : Z[s] = u, Z;
    }), $e(!1), he(r("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: j,
      receiver: w,
      value: (u * 100).toFixed(2)
    }));
  }, Oi = (s, u, j, w) => {
    const E = j[0];
    if (!E) return null;
    const I = E.sourceChannels.indexOf(s.source.pnn), z = E.sourceChannels.indexOf(s.receiver.pnn);
    if (I < 0 || z < 0) return null;
    const Y = Ls(
      n,
      s.source.pnn,
      s.receiver.pnn,
      w,
      E.currentColumns[I],
      E.currentColumns[z],
      { totalEvents: Ce }
    );
    if (!Y.ready) return null;
    const Z = [{
      value: s.coefficient,
      isCurrent: !0,
      preview: Y.preview
    }];
    return j.forEach((se, ae) => {
      const fe = se.sourceChannels.indexOf(s.source.pnn), pn = se.sourceChannels.indexOf(s.receiver.pnn);
      if (fe < 0 || pn < 0) return;
      const Je = Ls(
        n,
        s.source.pnn,
        s.receiver.pnn,
        w,
        se.candidateColumns[fe],
        se.candidateColumns[pn],
        {
          totalEvents: Ce,
          xRange: Y.preview.xRange,
          yRange: Y.preview.yRange
        }
      );
      Je.ready && Z.push({
        value: u[ae],
        isCurrent: !1,
        preview: Je.preview
      });
    }), Z.sort((se, ae) => se.value - ae.value || Number(ae.isCurrent) - Number(se.isCurrent)), { pairKey: s.pairKey, values: Object.freeze(Z) };
  }, rr = async (s) => {
    if (!N || !y || !O || ne || Ie || ze) return;
    const u = ct(s.pairKey, s.coefficient);
    if (u.error) {
      De(u.error);
      return;
    }
    const j = Mn(
      n.fcs.nEvents,
      Ro,
      Ne
    );
    if (j.length === 0) {
      De(r("The selected review population contains no events."));
      return;
    }
    const w = ++Ye.current, E = [u.lower, u.upper];
    zn(s.pairKey), De(null);
    try {
      const I = await O(
        N,
        j,
        E.map((Y) => Ko(
          N,
          y.sourceAxisKeys[s.sourceIndex],
          y.receiverAxisKeys[s.receiverIndex],
          Y
        )),
        void 0,
        1
      );
      if (Ye.current !== w) return;
      const z = Oi(s, E, I, j);
      if (!z) throw new Error(r("The fast bounds preview could not be built for this pair."));
      Tn((Y) => ({ ...Y, [s.pairKey]: z }));
    } catch (I) {
      if (Ye.current !== w) return;
      const z = I instanceof Error ? I.message : String(I);
      De(/cancel/i.test(z) ? r("Fast bounds preview cancelled.") : z);
    } finally {
      Ye.current === w && zn(null);
    }
  }, lr = async () => {
    var w;
    if (!N || !O || sn.length === 0 || ne || Ie !== null || ze !== null) return;
    if (Ms > 0) {
      De(r("Fix the sweep bounds for {count} flagged pairs before running.", { count: Ms }));
      return;
    }
    const s = Mn(
      n.fcs.nEvents,
      $o,
      Ne
    );
    if (s.length === 0) {
      De(r("The selected review population contains no events."));
      return;
    }
    const u = ++Ye.current, j = sn.flatMap((E) => {
      const I = ct(E.pairKey, E.coefficient);
      return Kc(I.lower, I.upper).map((z) => ({
        pair: E,
        value: z,
        matrix: Ko(
          N,
          y.sourceAxisKeys[E.sourceIndex],
          y.receiverAxisKeys[E.receiverIndex],
          z
        )
      }));
    });
    De(null), vn({}), Un({ completed: 0, total: j.length });
    try {
      const E = await O(
        N,
        s,
        j.map(({ matrix: z }) => z),
        (z, Y) => {
          Ye.current === u && Un({ completed: z, total: Y });
        },
        cs
      );
      if (Ye.current !== u) return;
      if (E.length !== j.length)
        throw new Error(r("The compensation worker returned an incomplete coefficient sweep."));
      const I = {};
      for (const z of sn) {
        const Y = j.flatMap((se, ae) => se.pair.pairKey === z.pairKey ? [ae] : []), Z = Oi(
          z,
          Y.map((se) => j[se].value),
          Y.map((se) => E[se]),
          s
        );
        Z && (I[z.pairKey] = Z);
      }
      vn(I), it(((w = sn[0]) == null ? void 0 : w.pairKey) ?? null);
    } catch (E) {
      if (Ye.current !== u) return;
      const I = E instanceof Error ? E.message : String(E);
      De(/cancel/i.test(I) ? r("Exact coefficient sweep cancelled.") : I);
    } finally {
      Ye.current === u && Un(null);
    }
  }, cr = () => {
    const u = (N == null ? void 0 : N.scientific.kind) === "flow-spillover" && !!G ? (W == null ? void 0 : W.rows.find(({ active: w, profile: E }) => w && E !== null)) ?? null : null, j = u && W ? W.planSwitch(u) : null;
    return /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-revision-agreement", children: [
      j && /* @__PURE__ */ e.jsxs("p", { children: [
        r("Every file in the workspace ({count}) is compensated with the revised matrix.", { count: j.fileCount }),
        " ",
        j.gateCount > 0 ? r("Membership is recomputed for {gates} gates and {populations} populations drawn on channels this matrix compensates.", {
          gates: j.gateCount,
          populations: j.populationCount
        }) : r("No gate is drawn on a channel this matrix compensates.")
      ] }),
      /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
        /* @__PURE__ */ e.jsx(
          "input",
          {
            type: "checkbox",
            checked: ps,
            disabled: ne,
            onChange: (w) => fs(w.currentTarget.checked)
          }
        ),
        /* @__PURE__ */ e.jsx("span", { children: r("I agree that gate membership may change.") })
      ] })
    ] });
  }, dr = () => {
    Ye.current++, D == null || D(), Un(null), zn(null), De(r("Exact coefficient sweep cancelled."));
  }, ur = async () => {
    var j, w;
    if (!N || !mn || !o || Object.keys(ue).length === 0 || !ps) return;
    const s = N.scientific.kind === "flow-spillover" && G ? G : o, u = `${Ks(N.name)} · edited`;
    he(null), $e(!1), tn(!0), hn(u), Ke(null);
    try {
      const I = {
        profileId: `comp-edit-${((w = (j = globalThis.crypto) == null ? void 0 : j.randomUUID) == null ? void 0 : w.call(j)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: u,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(ue).length} compensation coefficient${Object.keys(ue).length === 1 ? "" : "s"} in GateLab.`
      }, z = (F == null ? void 0 : F.recordType) === "baseline" && zc(mn, F.scientific.matrix.matrix) ? await Lr(N, F, I) : await Pr(
        N,
        _c(N, mn),
        I
      );
      await s(z, Ke), fs(!1), Nt({}), kn({}), vn({}), Tn({}), zn(null), De(null), hs((Y) => Y + 1), ye.length > 0 && (ln("attention"), ee(ye[0].pairKey), it(ye[0].pairKey)), he(r("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: Ks(z.name),
        flagged: ye.length > 0 ? r(
          ye.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: ye.length }
        ) : ""
      }));
    } catch (E) {
      $e(!0), he(E instanceof Error ? E.message : String(E));
    } finally {
      tn(!1), hn(null), Ke(null);
    }
  }, _i = (s) => {
    if (ye.length === 0) return;
    const u = ye.findIndex(({ pairKey: E }) => E === ie), j = u < 0 ? s > 0 ? 0 : ye.length - 1 : (u + s + ye.length) % ye.length, w = ye[j];
    X(null), ee(w.pairKey), it(w.pairKey);
  }, Dt = () => /* @__PURE__ */ e.jsx(
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
      onPointerDown: Za,
      onKeyDown: Qa,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), hr = (s) => {
    X(null), ee(s), as(!0), ws.some((u) => u.pairKey === s) && (Ge.some((u) => u.pairKey === s) || (jt("all"), oi("")), ai(s));
  }, Kt = (s, u = !1) => {
    var Ae;
    const j = K ? Vn.has(K.pairKey) : !1, w = K ? ye.find(({ pairKey: oe }) => oe === K.pairKey) ?? null : null, E = K ? Ss(K.pairKey, K.value) : null, I = K ? ct(K.pairKey, K.value) : null, z = K ? $a[K.pairKey] : null, Y = K ? y.sourceAxisKeys[K.sourceIndex] : "", Z = K ? y.receiverAxisKeys[K.receiverIndex] : "", se = K != null && K.interaction && K.interaction !== "self" && K.interaction !== "other" ? 1 : 0, ae = K && y.kind === "cytof" ? ((Ae = Fn.result) == null ? void 0 : Ae.pairs.find((oe) => oe.source === Y && oe.receiver === Z)) ?? null : null, fe = ae ? ta(ae) : null, pn = ae ? ea(ae) : null, Je = ae && Fn.data && ks && be === "screen" ? vl(Fn.data, ks, Y, Z) : null, an = K && (Ue != null && Ue.ready) && y.kind !== "cytof" ? Vs({
      coefficient: K.value,
      physicalPrior: se,
      evidence: Ue.preview.evidence
    }, y.kind, cn) : null, fn = K ? Dc(F, Y, Z) : null, $n = (K == null ? void 0 : K.value) ?? null, qn = K ? ue[K.pairKey] : void 0, Gn = !!(K && (N == null ? void 0 : N.scientific.kind) === "flow-spillover" && T && Object.keys(ue).length > 0), pt = dn.state !== "idle" && dn.state !== "error" && dn.pairKey === (K == null ? void 0 : K.pairKey) ? dn.preview : null, Hn = pt ?? (Ue != null && Ue.ready ? Ue.preview : null), Cn = [];
    fn !== null && $n !== null && ((N == null ? void 0 : N.recordType) === "revision" || fn !== $n) && Cn.push({ label: r("Baseline"), value: fn }), $n !== null && Cn.push({ label: r("Installed"), value: $n }), qn !== void 0 && Cn.push({ label: r("Staged"), value: qn });
    const zt = ye.findIndex(({ pairKey: oe }) => oe === ie);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${u ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: r("Selected coefficient") }),
          !u && /* @__PURE__ */ e.jsx("span", { children: r(ve ? "Hover preview · click to pin this pair." : ie ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
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
                onClick: () => _i(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: zt >= 0 ? r("{current} / {total} flagged", { current: zt + 1, total: ye.length }) : r("{total} flagged", { total: ye.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": r("Next flagged compensation pair"),
                disabled: ye.length === 0,
                onClick: () => _i(1),
                children: "→"
              }
            )
          ] }),
          s && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-inspector-close",
              "aria-label": r(u ? "Close global compensation pair details" : "Close the coefficient panel"),
              title: r(u ? "Close details and return to the full gallery" : "Close the coefficient panel; selecting a cell opens it again"),
              onClick: s,
              children: "×"
            }
          )
        ] })
      ] }),
      K ? /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-pair-detail${u ? " is-global" : ""}`, children: [
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
        an && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${an.category}`,
            title: r(an.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: r(an.label) }),
              /* @__PURE__ */ e.jsx("span", { children: r(an.detail) })
            ]
          }
        ),
        ae && fe && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-evidence-badge gl-comp-screen-badge is-${fe.tone}`, children: [
          /* @__PURE__ */ e.jsx("strong", { children: r(fe.label) }),
          /* @__PURE__ */ e.jsxs("span", { children: [
            r(fe.detail, fe.values),
            ae.receiverUnlabelled ? ` ${r("The receiver carries no antibody in this file, so only spillover should put counts in it.")}` : ""
          ] }),
          pn !== null && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: !N || ne,
              onClick: () => In(K.pairKey, pn),
              children: r("Stage {value}", { value: He(pn) })
            }
          )
        ] }),
        ae && Je && /* @__PURE__ */ e.jsx(
          jl,
          {
            pair: ae,
            events: Je,
            sourceLabel: K.source.label,
            receiverLabel: K.receiver.label
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: j,
              disabled: !N || !ke.has(y.sourceAxisKeys[K.sourceIndex]) || !ke.has(y.receiverAxisKeys[K.receiverIndex]),
              onChange: (oe) => dt(K.pairKey, oe.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: r("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: r("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: r("Stored fraction: {value}", { value: xe(K.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: r(ue[K.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(ue[K.pairKey] ?? K.value) ? `${((ue[K.pairKey] ?? K.value) * 100).toFixed(1)}%` : String(ue[K.pairKey] ?? K.value) })
        ] }),
        Cn.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": r("Coefficient history"), children: Cn.map((oe, gn) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          gn > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: r("Exact fraction: {value}", { value: xe(oe.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: oe.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (oe.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${oe.label}:${gn}`)) }),
        N && ie === K.pairKey && !ve && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: r("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              Jn,
              {
                step: "0.1",
                value: Ct,
                disabled: ne,
                onValueChange: (oe) => {
                  ms(oe), N.scientific.kind === "flow-spillover" && oe.trim() !== "" && Number.isFinite(Number(oe)) && In(K.pairKey, Number(oe) / 100);
                }
              }
            )
          ] }),
          N.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: r("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: ne || !Number.isFinite(Number(Ct)) || Ct.trim() === "",
              onClick: () => In(K.pairKey, Number(Ct) / 100),
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
                In(K.pairKey, K.value), kn((oe) => {
                  const gn = { ...oe };
                  return delete gn[K.pairKey], gn;
                });
              },
              children: r("Reset")
            }
          )
        ] }),
        Gn && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-candidate-status${u ? " is-compact" : ""}`, "aria-label": r("Flow compensation coefficient preview"), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: r("Coefficient preview") }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              r("Original remains fixed; the right panel shows the complete working matrix."),
              u ? r(" The gallery remains installed until Apply.") : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("em", { children: qn === void 0 ? r("Working matrix") : `${(K.value * 100).toFixed(1)}% → ${(qn * 100).toFixed(1)}%` }),
          dn.state === "updating" && dn.pairKey === K.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: r("Updating…") }),
          dn.state === "error" && dn.pairKey === K.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: r(dn.message) })
        ] }),
        K.interaction && K.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          r("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: K.interaction })
        ] }),
        u && (Hn ? /* @__PURE__ */ e.jsx(
          Ao,
          {
            preview: Hn,
            sourceLabel: K.source.label,
            receiverLabel: K.receiver.label,
            kind: y.kind,
            densitySmoothing: Nn,
            compact: !0,
            compensatedTitle: r(pt ? "Candidate" : "Compensated")
          }
        ) : Ue && !Ue.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: r(Ue.reason) }) : null),
        u && /* @__PURE__ */ e.jsx(
          yc,
          {
            matrixView: y,
            sourceChannels: je,
            receiverChannels: Me,
            selectedSourceIndex: K.sourceIndex,
            selectedReceiverIndex: K.receiverIndex,
            stagedCoefficients: ue,
            maximumAbsoluteOffDiagonal: Ii,
            onSelect: hr
          }
        ),
        !u && (Hn ? /* @__PURE__ */ e.jsx(
          Ao,
          {
            preview: Hn,
            sourceLabel: K.source.label,
            receiverLabel: K.receiver.label,
            kind: y.kind,
            densitySmoothing: Nn,
            compensatedTitle: r(pt ? "Candidate" : "Compensated")
          }
        ) : Ue && !Ue.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: r(Ue.reason) }) : null),
        j && w && E && I && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: r("Sweep bounds") }),
            /* @__PURE__ */ e.jsx("span", { children: r("Four exact candidates will be interpolated across these endpoints.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-inputs", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: r("Lower (%)") }),
              /* @__PURE__ */ e.jsx(
                Jn,
                {
                  step: "0.1",
                  value: E.lowerPercent,
                  disabled: ne || Ie !== null || ze !== null,
                  onValueChange: (oe) => Lt(K.pairKey, K.value, "lowerPercent", oe)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: r("Upper (%)") }),
              /* @__PURE__ */ e.jsx(
                Jn,
                {
                  step: "0.1",
                  value: E.upperPercent,
                  disabled: ne || Ie !== null || ze !== null,
                  onValueChange: (oe) => Lt(K.pairKey, K.value, "upperPercent", oe)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: ne || Ie !== null || ze !== null || I.error !== null,
                onClick: () => void rr(w),
                children: r(ze === K.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          I.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: r(I.error) }) : /* @__PURE__ */ e.jsx("small", { children: r("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(Ce, Ro).toLocaleString(),
            sweep: Math.min(Ce, $o).toLocaleString()
          }) }),
          z && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: z.values.map((oe) => /* @__PURE__ */ e.jsx("div", { className: oe.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            ns,
            {
              title: `${oe.isCurrent ? `${r("Current")} · ` : ""}${(oe.value * 100).toFixed(2)}%`,
              panel: oe.preview.compensated,
              preview: oe.preview,
              sourceLabel: K.source.label,
              receiverLabel: K.receiver.label,
              minimumSize: 145,
              maximumSize: 220,
              densitySmoothing: Nn
            }
          ) }, `${K.pairKey}:bounds:${oe.value}:${oe.isCurrent}`)) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: r(y.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: r("No coefficient selected.") })
    ] });
  }, Fs = (s, u, j = lt) => /* @__PURE__ */ e.jsx(
    jc,
    {
      dataset: u,
      pair: s,
      plotSize: j,
      densitySmoothing: Nn,
      flagged: Vn.has(s.pairKey),
      selected: ie === s.pairKey,
      onSelect: () => {
        X(null), ee(s.pairKey), as(!0);
      },
      onFlag: (w) => dt(s.pairKey, w)
    },
    s.pairKey
  ), mr = async (s, u) => {
    if (!(pe != null && pe.ready) || !y)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const j = yi.map((w) => ({
      pairKey: w.pairKey,
      sourceLabel: w.source.label,
      receiverLabel: w.receiver.label,
      coefficient: w.coefficient,
      relationship: w.interaction,
      buildPreview: () => {
        const E = sa(
          pe.dataset,
          w.source.key,
          w.receiver.key
        );
        if (!E.ready) throw new Error(E.reason);
        return E.preview;
      }
    }));
    await Il(j, {
      sampleName: t,
      profileName: (N == null ? void 0 : N.name) ?? r(y.title),
      populationName: (de == null ? void 0 : de.name) ?? r("All Events"),
      filterLabel: ji,
      densitySmoothing: Nn,
      densityColorPower: $,
      pointAlpha: $t,
      pointSize: Rt
    }, s, u);
  };
  return B ? /* @__PURE__ */ e.jsx(ni.Provider, { value: $, children: /* @__PURE__ */ e.jsx(ti.Provider, { value: $t, children: /* @__PURE__ */ e.jsx(si.Provider, { value: Rt, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab gl-plotting-workspace gl-comp-workspace",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-plotting-head gl-comp-head gl-comp-overview${be === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsxs("h2", { className: "gl-tab-title", children: [
              r("Compensation"),
              /* @__PURE__ */ e.jsx(Tr, { intro: le })
            ] }),
            !_ && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: Ot })
          ] }),
          _ ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${J.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: r("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: _t,
                method: Ot,
                count: Ts,
                status: r(J.state === "ready" ? "Ready" : "Unavailable"),
                assay: r(i ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${J.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  r("{kind} compensation installed. Installed compensation profile.", {
                    kind: _.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                (() => {
                  const s = W == null ? void 0 : W.rows.find(({ profile: u }) => (u == null ? void 0 : u.profileId) === _.profileId);
                  return s ? /* @__PURE__ */ e.jsx(ua, { row: s }) : null;
                })(),
                /* @__PURE__ */ e.jsx("strong", { children: qa }),
                /* @__PURE__ */ e.jsx("span", { children: r("{method} · {count} ch · {status}", {
                  method: Ot,
                  count: Ts,
                  status: J.state === "ready" ? r("Ready") : r("Unavailable")
                }) }),
                /* @__PURE__ */ e.jsx("em", { children: r(i ? "Comp active" : "Original active") })
              ]
            }
          ) : /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "gl-comp-summary",
              "aria-label": r("Compensation summary"),
              "data-active-layer": i ? "compensated" : "original",
              children: r("{source} · {assay} · {count} channels", {
                source: r(Ai),
                assay: r(i ? "Compensated assay active" : "Original assay active"),
                count: Ts
              })
            }
          ),
          _ && n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: ne,
              onClick: As,
              children: r("Replace matrix…")
            }
          ),
          _ && c && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-header-remove", children: [
            p && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: We,
                  disabled: ne || Mt,
                  onChange: (s) => un(s.currentTarget.checked)
                }
              ),
              /* @__PURE__ */ e.jsx("span", { children: r("Recompute existing gate memberships in original coordinates.") })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: ne || Mt,
                title: r("Every file returns to the original assay. The matrix and its versions stay in the Matrices list, to be used again or deleted there."),
                onClick: () => void ir(),
                children: r(Mt ? "Removing…" : "Remove the matrix")
              }
            )
          ] }),
          Ga && /* @__PURE__ */ e.jsx(Ar, { intro: le, className: "gl-comp-global-layer-note", children: r("Assay selection in the top bar applies to every tab.") })
        ] }),
        /* @__PURE__ */ e.jsxs("aside", { className: `gl-plotting-inspector gl-comp-inspector-left section-${ii}`, "aria-label": r("Compensation controls"), children: [
          /* @__PURE__ */ e.jsx("nav", { className: "gl-presentation-tabs", "aria-label": r("Compensation settings"), children: kc.map(({ id: s, label: u }) => /* @__PURE__ */ e.jsx("button", { type: "button", "aria-pressed": ii === s, onClick: () => wa(s), children: r(u) }, s)) }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-section gl-comp-pane-matrices", children: [
            W && /* @__PURE__ */ e.jsx(
              xc,
              {
                ...W,
                ...n.instrument === "cytof" ? { chooseImport: As } : {},
                onEditStarted: (s) => {
                  ln("matrix"), $e(!1), he(r("Editing {name}: type a percentage in the matrix, or select a pair to see its plots. Apply revised matrix compensates every file with the changes.", { name: s }));
                }
              }
            ),
            n.instrument === "flow" && !_ && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Edit coefficients") }),
              H && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-enable-heading", children: [
                /* @__PURE__ */ e.jsxs("p", { className: "gl-comp-pane-line", children: [
                  /* @__PURE__ */ e.jsx("span", { id: "comp-flow-enable-heading", children: r(V ? "SCE spillover matrix" : "Embedded FCS matrix") }),
                  /* @__PURE__ */ e.jsx(
                    Ds,
                    {
                      label: r("About editing this matrix"),
                      text: r("Install this exact matrix as the immutable baseline to edit coefficients and preview their effect.")
                    }
                  )
                ] }),
                Re != null && Re.error ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-problem", children: [
                  /* @__PURE__ */ e.jsx("span", { title: Re.error, children: r("Not editable: {reason}", {
                    reason: Ec(Re.validation).map((s) => r(s)).join(", ")
                  }) }),
                  /* @__PURE__ */ e.jsxs("details", { children: [
                    /* @__PURE__ */ e.jsx(Fr, { children: r("Details") }),
                    /* @__PURE__ */ e.jsx("p", { children: Re.error })
                  ] })
                ] }) : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  p && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: We,
                        disabled: ne,
                        onChange: (s) => un(s.currentTarget.checked)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { children: r("Recompute existing gate memberships in compensated coordinates.") })
                  ] }),
                  l.length > 0 && /* @__PURE__ */ e.jsx("p", { className: "gl-hint gl-comp-embedded-others", children: r("Enabling also returns {count} other files to Original: {files}. A workspace keeps one kind of compensation, and these draw from their own embedded matrix.", {
                    count: l.length,
                    files: l.join(", ")
                  }) }),
                  ne ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
                    we ? r("Preparing editor… {percent}%", { percent: Math.round(we.fraction * 100) }) : r("Preparing editor…"),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: (we == null ? void 0 : we.phase) === "cancelling",
                        onClick: d,
                        children: r((we == null ? void 0 : we.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                      }
                    )
                  ] }) : /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-btn",
                      disabled: !o || p && !We,
                      onClick: () => void or(),
                      children: r("Enable matrix editing")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-empty-heading", children: [
                /* @__PURE__ */ e.jsxs("p", { className: "gl-comp-pane-line", children: [
                  /* @__PURE__ */ e.jsx("span", { id: "comp-flow-empty-heading", children: r("Empty matrix") }),
                  /* @__PURE__ */ e.jsx(
                    Ds,
                    {
                      label: r("About the empty matrix"),
                      text: r("Start from an identity matrix over the file's fluorescence channels, every spillover at zero, and set the coefficients by hand.")
                    }
                  )
                ] }),
                p && (!H || !!(Re != null && Re.error)) && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: We,
                      disabled: ne,
                      onChange: (s) => un(s.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: r("Recompute existing gate memberships in compensated coordinates.") })
                ] }),
                ne ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-flow-enable-progress", role: "status", children: r("Preparing editor…") }) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: !o || p && !We,
                    onClick: () => void sr(),
                    children: r("Start from an empty matrix")
                  }
                )
              ] })
            ] }),
            _ && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Edit coefficients") }),
              !(y && Object.keys(ue).length > 0) && /* @__PURE__ */ e.jsx("p", { className: "gl-comp-pane-line", children: r("Select a pair in the matrix to change its coefficient.") }),
              y && Object.keys(ue).length > 0 && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                cr(),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
                  /* @__PURE__ */ e.jsxs("span", { children: [
                    r("{count} pending edits", { count: Object.keys(ue).length }),
                    (N == null ? void 0 : N.scientific.kind) === "cytof-spillover" ? ` · ${r("{files} checked FCS files", { files: jn })}` : ""
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: ne,
                      onClick: () => {
                        Nt({}), kn({}), fs(!1), he(null);
                      },
                      children: r("Discard")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-btn",
                      disabled: ne || !ps || Ie !== null || ze !== null || !o || (N == null ? void 0 : N.scientific.kind) === "cytof-spillover" && jn === 0,
                      onClick: () => void ur(),
                      children: r("Apply revised matrix")
                    }
                  )
                ] })
              ] })
            ] }),
            n.instrument === "cytof" && !_ && /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: r("Choose a CyTOF spillover matrix in the main panel.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pane-section gl-comp-pane-review", children: [
            /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsxs("h3", { children: [
                r("Review scope"),
                /* @__PURE__ */ e.jsx(Ds, { label: r("About the review scope"), text: r("The population and the events the biplots, the attention ranking and the sweeps are drawn from. Membership is frozen from the current assay; Apply always uses every event.") })
              ] }),
              /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-review-population", children: [
                /* @__PURE__ */ e.jsx("span", { children: r("Review population") }),
                /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": r("Compensation review population"),
                    value: (de == null ? void 0 : de.id) ?? "all",
                    disabled: Ie !== null || ze !== null,
                    onChange: (s) => ls(s.currentTarget.value),
                    children: [
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: r("All Events") }),
                      P.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: `${"· ".repeat(s.depth)}${s.name} (${s.eventCount.toLocaleString()})` }, s.id))
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
                    value: String(Ft),
                    disabled: ne,
                    onChange: (s) => {
                      const u = s.currentTarget.value;
                      Na(u === "all" ? "all" : Number(u));
                    },
                    children: [
                      Po.map((s) => /* @__PURE__ */ e.jsx("option", { value: s, children: r("{count} events", { count: s.toLocaleString() }) }, s)),
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: r("All available") })
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsx("small", { title: r("Controls the frozen event set shown in the selected-pair Original and comparison biplots. Applying compensation still processes every event."), children: r("Showing {shown} of {total}; Apply always uses all events.", {
                  shown: at.length.toLocaleString(),
                  total: Ce.toLocaleString()
                }) })
              ] })
            ] }),
            b !== void 0 && M !== void 0 && k && /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Apply") }),
              b !== void 0 && M !== void 0 && k && /* @__PURE__ */ e.jsxs(
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
                        value: b,
                        disabled: ne,
                        onChange: (s) => k(Number(s.currentTarget.value)),
                        children: Array.from({ length: M }, (s, u) => u + 1).map((s) => /* @__PURE__ */ e.jsx("option", { value: s, children: s }, s))
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
            (y || _) && /* @__PURE__ */ e.jsxs("section", { children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Tools") }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: Tc.map(({ id: s, label: u }) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  id: `comp-drawer-${s}-button`,
                  className: "gl-comp-drawer-toggle",
                  "aria-expanded": L[s],
                  "aria-controls": `comp-drawer-${s}`,
                  onClick: () => Ya(s),
                  children: [
                    /* @__PURE__ */ e.jsxs("span", { children: [
                      r(u),
                      s === "review" && Pt.length > 0 ? ` (${Pt.length})` : ""
                    ] }),
                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ e.jsx(Wi, { open: L[s], size: 12 }) })
                  ]
                },
                s
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
                      value: Nn,
                      "aria-label": r("Compensation biplot density smoothing"),
                      onChange: (s) => xa(Number(s.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: Nn })
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
                      value: $t,
                      "aria-label": r("Compensation biplot point alpha"),
                      onChange: (s) => ba(Number(s.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsx("output", { children: $t.toFixed(2) })
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
                      value: Rt,
                      "aria-label": r("Compensation biplot point size"),
                      onChange: (s) => ja(Number(s.currentTarget.value))
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("output", { children: [
                    Rt.toFixed(1),
                    "×"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ e.jsx(
              Ir,
              {
                className: "gl-comp-density-colour",
                value: $,
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
                  X(null), ln("matrix");
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
                  X(null), ln("global");
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
                  X(null), ln("screen");
                },
                children: [
                  r("Check"),
                  Fn.result && ki > 0 ? ` (${ki})` : ""
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
                  X(null), ln("attention");
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
              ref: gi,
              type: "file",
              accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
              className: "gl-sr-only",
              "aria-label": r("Choose CyTOF spillover matrix"),
              onChange: (s) => void Ja(s)
            }
          ),
          ui && /* @__PURE__ */ e.jsx("div", { className: hi ? "gl-comp-error" : "gl-comp-status", role: hi ? "alert" : "status", children: r(ui) }),
          n.instrument === "cytof" && (!_ || me) && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-cytof-import", "aria-labelledby": "comp-cytof-import-heading", children: [
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
                  onClick: As,
                  children: r(me ? "Choose another matrix…" : "Import matrix…")
                }
              ) })
            ] }),
            mi && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: r(mi) }),
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
                      onClick: () => bn(new Set(Se.matchedChannels)),
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
                      onClick: () => bn(new Set(Se.matchedChannels.filter((s) => $r(Rc(n, s), s)))),
                      children: r("Named only")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: ne,
                      onClick: () => bn(/* @__PURE__ */ new Set()),
                      children: r("None")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-channel-grid", children: me.matrix.receiverChannels.map((s) => {
                const u = Se.matchedChannels.includes(s);
                return /* @__PURE__ */ e.jsxs("label", { className: u ? "" : "is-unavailable", title: u ? s : r("{channel} is not uniquely present in this FCS file", { channel: s }), children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: ot.has(s),
                      disabled: !u || ne,
                      onChange: (j) => er(s, j.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: Gt(n, s).combined }),
                  !u && /* @__PURE__ */ e.jsx("small", { children: r("not matched") })
                ] }, s);
              }) }),
              (me.validationWarnings.length > 0 || Se.warnings.length > 0) && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: /* @__PURE__ */ e.jsx("span", { children: r("{count} review items: {messages}", {
                count: me.validationWarnings.length + Se.warnings.length,
                messages: [
                  ...me.validationWarnings.map(({ message: s }) => s),
                  ...Se.warnings.map(({ message: s }) => s)
                ].map((s) => r(s)).join(" ")
              }) }) }),
              Se.blockers.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: Se.blockers.map(({ message: s }) => r(s)).join(" ") }),
              p && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: We,
                    disabled: ne,
                    onChange: (s) => un(s.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: r("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                  /* @__PURE__ */ e.jsx("span", { children: ne ? we ? r("{phase}… {percent}% ({processed} / {total} events)", {
                    phase: r(we.phase === "cancelling" ? "Cancelling" : we.phase === "preparing" ? "Preparing" : "Applying"),
                    percent: Math.round(we.fraction * 100),
                    processed: we.processedEvents.toLocaleString(),
                    total: we.totalEvents.toLocaleString()
                  }) : r("Preparing compensation…") : r("The Original assay is retained and can be restored at any time.") }),
                  /* @__PURE__ */ e.jsx("strong", { className: jn === 0 ? "is-empty" : void 0, children: jn === 0 ? r("No FCS files are checked. Select at least one file in Samples.") : r("Applies atomically to {files} checked FCS files · {events} total events", {
                    files: jn,
                    events: Ka.toLocaleString()
                  }) })
                ] }),
                ne ? /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (we == null ? void 0 : we.phase) === "cancelling",
                    onClick: d,
                    children: r((we == null ? void 0 : we.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                ) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn",
                    disabled: !o || jn === 0 || !Se.canApply || p && !We,
                    onClick: () => void nr(),
                    children: r("Apply NNLS compensation")
                  }
                )
              ] }),
              h.length > 0 && m && /* @__PURE__ */ e.jsxs(
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
                          value: (wn == null ? void 0 : wn.id) ?? "",
                          disabled: ne,
                          onChange: (s) => {
                            fi(s.currentTarget.value), Et(!1);
                          },
                          children: h.map((s) => /* @__PURE__ */ e.jsx("option", { value: s.id, children: s.label === s.id ? s.id : `${s.label} (${s.id})` }, s.id))
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-adopt-confirm", children: [
                      /* @__PURE__ */ e.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: gs,
                          disabled: ne,
                          onChange: (s) => Et(s.currentTarget.checked)
                        }
                      ),
                      /* @__PURE__ */ e.jsx("span", { children: r("I confirm this assay was computed from the selected source assay using this exact matrix and channel set.") })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: ne || !wn || !gs || jn === 0 || !Se.canApply || p && !We,
                        onClick: () => void tr(),
                        children: r("Use existing assay — no recomputation")
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          Ti && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: r("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
          Ei.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
            /* @__PURE__ */ e.jsx("span", { children: r("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
              count: Ei.length
            }) }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => te((s) => ({ ...s, review: !0 })), children: r("Review details") })
          ] }),
          _ && J.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: r("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
          y && be === "matrix" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: An,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: js ? `minmax(440px, 1fr) 8px ${ge}px` : "minmax(0, 1fr)" },
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
                            "aria-pressed": vs === "fit",
                            title: r("Fit the whole matrix to the panel; where the cells are too small for their values they show colour alone, and each names its value on hover"),
                            onClick: () => bi("fit"),
                            children: r("Fit")
                          }
                        ),
                        /* @__PURE__ */ e.jsx(
                          "input",
                          {
                            type: "range",
                            min: ht.least,
                            max: ht.largest,
                            step: 1,
                            value: on,
                            "aria-label": r("Cell size"),
                            title: r("Cell size: {size} px", { size: on }),
                            onChange: (s) => bi(Number(s.currentTarget.value))
                          }
                        )
                      ] }),
                      ut && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-inline-edit-note", children: r("Edit cells directly (%)") }),
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
                          onClick: () => ci(!0),
                          children: r("Export CSV…")
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-scroll", ref: Da, children: /* @__PURE__ */ e.jsxs(
                    "div",
                    {
                      className: `gl-comp-matrix-stage${ut ? " is-flow-inline" : ""}${Xa ? "" : " is-values-hidden"}`,
                      style: {
                        width: 18 + mt.rowLabelWidth + y.receiverAxisKeys.length * on + mt.overhang,
                        "--gl-comp-row-label-w": `${mt.rowLabelWidth}px`,
                        "--gl-comp-col-label-w": `${mt.columnLabelWidth}px`,
                        "--gl-comp-col-label-h": `${mt.columnLabelHeight}px`
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
                                  gridTemplateColumns: `repeat(${y.receiverAxisKeys.length}, ${on}px)`
                                },
                                children: Me.map((s, u) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (K == null ? void 0 : K.receiverIndex) === u ? "is-selected" : void 0,
                                    title: s.combined,
                                    children: /* @__PURE__ */ e.jsx("span", { children: s.combined })
                                  },
                                  y.receiverAxisKeys[u]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                className: "gl-comp-row-labels",
                                "aria-label": r("Source channel labels"),
                                style: {
                                  gridTemplateRows: `repeat(${y.sourceAxisKeys.length}, ${on}px)`
                                },
                                children: je.map((s, u) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (K == null ? void 0 : K.sourceIndex) === u ? "is-selected" : void 0,
                                    title: s.combined,
                                    children: s.combined
                                  },
                                  y.sourceAxisKeys[u]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                ref: xi,
                                className: "gl-comp-matrix shows-values",
                                role: "grid",
                                "aria-label": r("Compensation matrix; source rows and receiver columns"),
                                "aria-rowcount": y.sourceAxisKeys.length,
                                "aria-colcount": y.receiverAxisKeys.length,
                                style: {
                                  gridTemplateColumns: `repeat(${y.receiverAxisKeys.length}, ${on}px)`,
                                  gridTemplateRows: `repeat(${y.sourceAxisKeys.length}, ${on}px)`
                                },
                                children: y.matrix.map((s, u) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    role: "row",
                                    className: "gl-comp-matrix-row",
                                    "aria-rowindex": u + 1,
                                    children: s.map((j, w) => {
                                      const E = y.sourceAxisKeys[u], I = y.receiverAxisKeys[w], z = `${E}${_e}${I}`, Y = ue[z], Z = Y ?? j, se = E === I, ae = (K == null ? void 0 : K.sourceIndex) === u && K.receiverIndex === w, fe = (K == null ? void 0 : K.sourceIndex) === u, pn = (K == null ? void 0 : K.receiverIndex) === w, Je = je[u], an = Me[w], fn = y.kind === "cytof" ? et(E, I) : null, $n = Go(
                                        Z,
                                        Ii,
                                        se
                                      ), qn = y.receiverAxisKeys.findIndex((Ae) => Ae !== E), Gn = ie === z, pt = ie === null && u === 0 && w === qn, Hn = Number.isFinite(Z) ? Z === 0 ? "" : (Z * 100).toFixed(1) : String(Z), Cn = fn && fn !== "other" && fn !== "self" ? ` · ${fn}` : "", zt = Fa[z] ?? Do(Z);
                                      return ut && !se ? /* @__PURE__ */ e.jsx(
                                        Jn,
                                        {
                                          role: "gridcell",
                                          className: `gl-comp-cell gl-comp-cell-input${ae ? " selected" : ""}${Gn ? " is-pinned" : ""}${Y === void 0 ? "" : " is-staged"}${fe ? " is-selected-source" : ""}${pn ? " is-selected-receiver" : ""}`,
                                          min: "0",
                                          step: "0.1",
                                          value: zt,
                                          disabled: ne,
                                          "data-source-index": u,
                                          "data-receiver-index": w,
                                          "aria-colindex": w + 1,
                                          "aria-selected": Gn,
                                          "aria-label": r("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                            source: Je.combined,
                                            receiver: an.combined,
                                            pending: Y === void 0 ? "" : r(", pending edit")
                                          }),
                                          title: r("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                            source: Je.combined,
                                            receiver: an.combined,
                                            pending: Y === void 0 ? "" : r(" · pending edit")
                                          }),
                                          style: $n,
                                          onFocus: () => ee(z),
                                          onMouseEnter: () => X(z),
                                          onMouseLeave: () => X((Ae) => Ae === z ? null : Ae),
                                          onClick: () => ee(z),
                                          onValueChange: (Ae) => {
                                            ee(z), kn((oe) => ({ ...oe, [z]: Ae })), Ae.trim() !== "" && Number.isFinite(Number(Ae)) && In(z, Number(Ae) / 100);
                                          },
                                          onBlur: (Ae) => {
                                            const oe = Ae.currentTarget.value;
                                            if (oe.trim() === "" || !Number.isFinite(Number(oe))) {
                                              kn((gn) => {
                                                const zi = { ...gn };
                                                return delete zi[z], zi;
                                              });
                                              return;
                                            }
                                            kn((gn) => ({
                                              ...gn,
                                              [z]: Do(Number(oe) / 100)
                                            }));
                                          }
                                        },
                                        I
                                      ) : /* @__PURE__ */ e.jsx(
                                        "button",
                                        {
                                          type: "button",
                                          role: "gridcell",
                                          className: `gl-comp-cell${se ? " diagonal" : ""}${ae ? " selected" : ""}${Gn ? " is-pinned" : ""}${Y === void 0 ? "" : " is-staged"}${fe ? " is-selected-source" : ""}${pn ? " is-selected-receiver" : ""}`,
                                          disabled: se,
                                          tabIndex: se ? -1 : ae || pt ? 0 : -1,
                                          "data-source-index": u,
                                          "data-receiver-index": w,
                                          "data-interaction": fn ?? void 0,
                                          "aria-colindex": w + 1,
                                          "aria-pressed": se ? void 0 : Gn,
                                          "aria-label": se ? r("{channel} diagonal: {value}", { channel: Je.combined, value: Te(Z) }) : r("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                            source: Je.combined,
                                            receiver: an.combined,
                                            value: Te(Z),
                                            pending: Y === void 0 ? "" : r(" (pending edit)"),
                                            interaction: Cn
                                          }),
                                          title: se ? `${Je.combined} · self · ${Te(Z)}` : `${Je.combined} → ${an.combined} · ${Te(Z)}${Y === void 0 ? "" : " · pending edit"}${Cn}`,
                                          style: $n,
                                          onFocus: () => {
                                            se || ee(z);
                                          },
                                          onMouseEnter: () => {
                                            se || X(z);
                                          },
                                          onMouseLeave: () => X((Ae) => Ae === z ? null : Ae),
                                          onClick: () => ee(z),
                                          onKeyDown: (Ae) => ar(Ae, u, w),
                                          children: /* @__PURE__ */ e.jsx("span", { children: Hn })
                                        },
                                        I
                                      );
                                    })
                                  },
                                  y.sourceAxisKeys[u]
                                ))
                              }
                            )
                          ] })
                        ] })
                      ]
                    }
                  ) })
                ] }),
                js && Dt(),
                js && Kt(() => {
                  X(null), ee(null);
                })
              ]
            }
          ) : y && be === "global" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: An,
              className: `gl-comp-common-path gl-comp-global-path${st ? " has-details" : ""}`,
              style: {
                gridTemplateColumns: st ? `minmax(440px, 1fr) 8px ${ge}px` : "minmax(0, 1fr)"
              },
              children: [
                /* @__PURE__ */ e.jsx(
                  wc,
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
                          value: nn,
                          onChange: (s) => jt(s.currentTarget.value),
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
                          value: Pe,
                          onChange: (s) => ma(s.currentTarget.value),
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
                          value: tt,
                          placeholder: r("Find channel…"),
                          "aria-label": r("Search global compensation pairs"),
                          onChange: (s) => oi(s.currentTarget.value)
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
                            value: lt,
                            "aria-label": r("Global compensation plot size"),
                            onChange: (s) => fa(Number(s.currentTarget.value))
                          }
                        ),
                        /* @__PURE__ */ e.jsx("output", { children: r("{size}px", { size: lt }) })
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn gl-comp-global-export",
                          disabled: !(pe != null && pe.ready) || Ge.length === 0,
                          title: r("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                          onClick: () => di(!0),
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
                            shown: ys.length.toLocaleString(),
                            total: Ce.toLocaleString(),
                            population: (de == null ? void 0 : de.name) ?? r("All Events")
                          })
                        }
                      )
                    ] }),
                    children: pe ? pe.ready ? Ge.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: r("No pairs match the current filter. Choose another filter or clear the channel search.") }) : Pe === "compact" ? /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-gallery",
                        "data-event-signature": pe.dataset.eventSignature,
                        children: Ge.map((s) => Fs(s, pe.dataset))
                      }
                    ) : Pe === "matrix" && y ? /* @__PURE__ */ e.jsxs(
                      "div",
                      {
                        ref: wi,
                        className: "gl-comp-global-matrix",
                        "data-event-signature": pe.dataset.eventSignature,
                        "data-tile-size": Cs,
                        role: "grid",
                        "aria-label": r("Compensation pairs arranged as the matrix"),
                        style: { gridTemplateColumns: `92px repeat(${y.receiverChannels.length}, ${Cs}px)` },
                        children: [
                          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-corner", children: [
                            /* @__PURE__ */ e.jsx("span", { children: r("Source ↓") }),
                            /* @__PURE__ */ e.jsx("span", { children: r("Receiver →") })
                          ] }),
                          y.receiverChannels.map((s, u) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-col", title: s.combined, children: [
                            /* @__PURE__ */ e.jsx("strong", { children: s.label }),
                            /* @__PURE__ */ e.jsx("small", { children: s.pnn })
                          ] }, `col-${u}`)),
                          y.sourceChannels.map((s, u) => /* @__PURE__ */ e.jsxs(A.Fragment, { children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-matrix-row", title: s.combined, children: [
                              /* @__PURE__ */ e.jsx("strong", { children: s.label }),
                              /* @__PURE__ */ e.jsx("small", { children: s.pnn })
                            ] }),
                            y.receiverChannels.map((j, w) => {
                              const E = za.get(`${u}:${w}`);
                              if (E) return Fs(E, pe.dataset, Cs);
                              const I = y.sourceAxisKeys[u] === y.receiverAxisKeys[w];
                              return /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  className: `gl-comp-global-matrix-blank${I ? " is-diagonal" : ""}`,
                                  title: I ? r("{channel} into itself", { channel: s.label }) : r("{source} into {receiver}: not shown under the current filter", { source: s.label, receiver: j.label }),
                                  children: I ? /* @__PURE__ */ e.jsx("span", { children: s.label }) : null
                                },
                                `${u}:${w}`
                              );
                            })
                          ] }, `row-${u}`))
                        ]
                      }
                    ) : /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-groups",
                        "data-event-signature": pe.dataset.eventSignature,
                        "data-layout": Pe,
                        children: Ns.map((s) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                          /* @__PURE__ */ e.jsxs("header", { children: [
                            /* @__PURE__ */ e.jsx("span", { children: r(Pe === "source" ? "Source channel" : "Receiver") }),
                            /* @__PURE__ */ e.jsx("strong", { title: s.channel.combined, children: s.channel.label }),
                            /* @__PURE__ */ e.jsx("small", { children: s.channel.pnn }),
                            /* @__PURE__ */ e.jsx("em", { children: r("{count} pairs", { count: s.pairs.length }) })
                          ] }),
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: s.pairs.map((u) => Fs(u, pe.dataset)) })
                        ] }, s.channel.key))
                      }
                    ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: r(pe.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: r("No matrix is available for the global inspector.") })
                  }
                ),
                st && Dt(),
                st && Kt(() => as(!1), !0)
              ]
            }
          ) : y && be === "screen" && y.kind === "cytof" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: An,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${ge}px` },
              children: [
                /* @__PURE__ */ e.jsx(
                  Nl,
                  {
                    state: Fn,
                    channelLabel: (s) => Gt(n, s).label,
                    populationName: (de == null ? void 0 : de.name) ?? null,
                    selected: ie ? { source: ie.split(_e)[0], receiver: ie.split(_e)[1] } : null,
                    onSelect: (s, u) => {
                      X(null), ee(`${s}${_e}${u}`);
                    },
                    isStaged: (s, u) => ue[`${s}${_e}${u}`] !== void 0,
                    canStage: !!N && !ne,
                    onStage: (s) => {
                      for (const u of s) In(`${u.source}${_e}${u.receiver}`, u.value);
                    },
                    onRunAgain: () => Aa((s) => s + 1)
                  }
                ),
                Dt(),
                Kt()
              ]
            }
          ) : y ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: An,
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
                            value: cs,
                            disabled: Ie !== null || ze !== null,
                            onChange: (s) => ds(Number(s.currentTarget.value)),
                            children: Array.from({ length: Oo }, (s, u) => u + 1).map((s) => /* @__PURE__ */ e.jsx("option", { value: s, children: s }, s))
                          }
                        )
                      ] }),
                      Ie ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: dr, children: r("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-btn",
                          disabled: !N || !O || sn.length === 0 || Ms > 0 || ne || ze !== null,
                          onClick: () => void lr(),
                          children: r("Run four-value sweeps ({count})", { count: sn.length })
                        }
                      )
                    ] })
                  ] }),
                  y.kind !== "cytof" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-scope", children: [
                    /* @__PURE__ */ e.jsx("span", { children: r("Suggestions computed for {population} from up to {count} frozen events.", {
                      population: (de == null ? void 0 : de.name) ?? r("All Events"),
                      count: Math.min(Ce, rt.length).toLocaleString()
                    }) }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-evidence-mode", children: [
                      /* @__PURE__ */ e.jsx("span", { children: r("Evidence mode") }),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          "aria-label": r("Compensation evidence mode"),
                          value: cn,
                          disabled: ne || Ie !== null || ze !== null,
                          onChange: (s) => {
                            Sa(s.currentTarget.value), hs((u) => u + 1), vn({}), Tn({}), De(null);
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
                        disabled: ne || Ie !== null || ze !== null,
                        onClick: () => {
                          hs((s) => s + 1), vn({}), Tn({}), De(null), $e(!1), he(
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
                      r(cn === "biological" ? "Broad positive association is excluded because co-expression and cell size can mimic spill. High-tail shapes remain control-sensitive review prompts." : "Positive residual association may enter the shortlist only because you declared suitable control data."),
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
                      workers: cs
                    }) })
                  ] }),
                  li && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: r(li) }),
                  N ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": r("Add compensation pair for follow-up"), children: [
                      /* @__PURE__ */ e.jsx("strong", { children: r("Add a pair") }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: r("Source channel") }),
                        /* @__PURE__ */ e.jsx(
                          qi,
                          {
                            label: r("Follow-up source channel"),
                            value: Xe,
                            options: y.sourceAxisKeys.flatMap((s, u) => ke.has(s) ? [{ value: s, label: je[u].combined }] : []),
                            onChange: (s) => {
                              ri(s), Ve === s && us(y.receiverAxisKeys.find((u) => u !== s && ke.has(u)) ?? "");
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: r("Receiver") }),
                        /* @__PURE__ */ e.jsx(
                          qi,
                          {
                            label: r("Follow-up receiver channel"),
                            value: Ve,
                            options: y.receiverAxisKeys.flatMap((s, u) => s !== Xe && ke.has(s) ? [{ value: s, label: Me[u].combined }] : []),
                            onChange: us
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !Xe || !Ve || Xe === Ve,
                          onClick: Ua,
                          children: r("Flag for follow-up")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flagged-columns", children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsx("h4", { children: r("Flagged by you ({count})", { count: sn.length }) }),
                          /* @__PURE__ */ e.jsx("span", { children: r("Only these pairs are included when you run sweeps.") })
                        ] }) }),
                        sn.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: r("No pairs are flagged yet. Tick “Flag for follow-up” in the inspector, add a pair above, or accept a suggestion below.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-list", children: sn.map((s, u) => {
                          const j = Ia[s.pairKey], w = Ra === s.pairKey, E = ct(s.pairKey, s.coefficient), I = Ss(s.pairKey, s.coefficient);
                          return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${ie === s.pairKey ? " is-selected" : ""}`, children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                              /* @__PURE__ */ e.jsxs(
                                "button",
                                {
                                  type: "button",
                                  className: "gl-comp-sweep-pair-head",
                                  "aria-expanded": w,
                                  onClick: () => {
                                    ee(s.pairKey), it(w ? null : s.pairKey);
                                  },
                                  children: [
                                    /* @__PURE__ */ e.jsx("span", { className: "gl-comp-sweep-rank", children: u + 1 }),
                                    /* @__PURE__ */ e.jsxs("span", { children: [
                                      /* @__PURE__ */ e.jsxs("strong", { children: [
                                        s.source.label,
                                        " → ",
                                        s.receiver.label
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("small", { children: [
                                        s.interaction && s.interaction !== "other" ? `${s.interaction} · ` : "",
                                        r("installed {value}%", { value: (s.coefficient * 100).toFixed(1) })
                                      ] })
                                    ] }),
                                    /* @__PURE__ */ e.jsx("span", { children: s.evidence.status === "ready" ? r("shift {shift} MAD · slope {slope}", {
                                      shift: xe(s.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: xe(s.evidence.residualSlope ?? 0, 4)
                                    }) : r("visual review · residual groups insufficient") }),
                                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: /* @__PURE__ */ e.jsx(Wi, { open: w, size: 12 }) })
                                  ]
                                }
                              ),
                              /* @__PURE__ */ e.jsx("label", { className: "gl-comp-followup-list-toggle", title: r("Remove from follow-up queue"), children: /* @__PURE__ */ e.jsx(
                                "input",
                                {
                                  type: "checkbox",
                                  checked: !0,
                                  "aria-label": r("Flag {source} to {receiver} for follow-up", {
                                    source: s.source.label,
                                    receiver: s.receiver.label
                                  }),
                                  onChange: (z) => dt(s.pairKey, z.currentTarget.checked)
                                }
                              ) })
                            ] }),
                            w && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-body", children: [
                              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inline-bounds", children: [
                                /* @__PURE__ */ e.jsx("span", { children: r("Four values across") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  r("Lower (%)"),
                                  /* @__PURE__ */ e.jsx(Jn, { step: "0.1", value: I.lowerPercent, disabled: ne || Ie !== null || ze !== null, onValueChange: (z) => Lt(s.pairKey, s.coefficient, "lowerPercent", z) })
                                ] }),
                                /* @__PURE__ */ e.jsx("span", { children: r("to") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  r("Upper (%)"),
                                  /* @__PURE__ */ e.jsx(Jn, { step: "0.1", value: I.upperPercent, disabled: ne || Ie !== null || ze !== null, onValueChange: (z) => Lt(s.pairKey, s.coefficient, "upperPercent", z) })
                                ] }),
                                E.error && /* @__PURE__ */ e.jsx("small", { children: r(E.error) })
                              ] }),
                              j ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: j.values.map((z) => /* @__PURE__ */ e.jsxs(
                                "div",
                                {
                                  className: `gl-comp-sweep-value${z.isCurrent ? " is-current" : ""}${ue[s.pairKey] === z.value ? " is-staged" : ""}`,
                                  children: [
                                    /* @__PURE__ */ e.jsx(
                                      ns,
                                      {
                                        title: `${z.isCurrent ? `${r("Current")} · ` : ""}${(z.value * 100).toFixed(2)}%`,
                                        panel: z.preview.compensated,
                                        preview: z.preview,
                                        sourceLabel: s.source.label,
                                        receiverLabel: s.receiver.label,
                                        minimumSize: 150,
                                        maximumSize: 230,
                                        densitySmoothing: Nn
                                      }
                                    ),
                                    /* @__PURE__ */ e.jsxs("dl", { children: [
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: r("Shift") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: r("{value} MAD", { value: xe(z.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: r("Slope") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: xe(z.preview.evidence.residualSlope ?? 0, 4) })
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
                                        onClick: () => In(s.pairKey, z.value),
                                        children: r(z.isCurrent ? "Installed" : ue[s.pairKey] === z.value ? "Staged" : "Use this value")
                                      }
                                    )
                                  ]
                                },
                                `${s.pairKey}:${z.value}:${z.isCurrent}`
                              )) }) : /* @__PURE__ */ e.jsx("p", { children: r("Set or fast-preview the endpoints in the inspector, then run the four-value exact sweep. Panels use the same events and locked axes.") })
                            ] })
                          ] }, s.pairKey);
                        }) })
                      ] }),
                      y.kind !== "cytof" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section gl-comp-suggestions", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsxs("h4", { children: [
                            r(cn === "biological" ? "Conservative suggestions" : "Control-data suggestions"),
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
                        qe.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: r("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: qe.items.map((s) => {
                          const u = Vs(s, y.kind, cn);
                          return /* @__PURE__ */ e.jsxs("article", { className: Vn.has(s.pairKey) ? "is-flagged" : void 0, children: [
                            /* @__PURE__ */ e.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => ee(s.pairKey),
                                children: [
                                  /* @__PURE__ */ e.jsxs("strong", { children: [
                                    s.source.label,
                                    " → ",
                                    s.receiver.label
                                  ] }),
                                  /* @__PURE__ */ e.jsx("em", { className: `gl-comp-suggestion-badge is-${u.category}`, children: r(u.label) }),
                                  /* @__PURE__ */ e.jsxs("span", { children: [
                                    s.interaction && s.interaction !== "other" ? `${s.interaction} · ` : "",
                                    r("{coefficient}% · shift {shift} MAD · slope {slope}", {
                                      coefficient: (s.coefficient * 100).toFixed(1),
                                      shift: xe(s.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: xe(s.evidence.residualSlope ?? 0, 4)
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
                                  checked: Vn.has(s.pairKey),
                                  "aria-label": r("Flag suggested {source} to {receiver} for follow-up", {
                                    source: s.source.label,
                                    receiver: s.receiver.label
                                  }),
                                  onChange: (j) => dt(s.pairKey, j.currentTarget.checked)
                                }
                              ),
                              /* @__PURE__ */ e.jsx("span", { children: r("Follow up") })
                            ] })
                          ] }, s.pairKey);
                        }) })
                      ] })
                    ] })
                  ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: r("Install a profile-derived compensation layer before curating or sweeping pairs. The embedded FCS matrix remains inspectable in the Matrix view.") })
                ] }),
                Dt(),
                Kt()
              ]
            }
          ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: r(_ ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : n.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
          (y || _) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": r("Advanced compensation tools"), children: [
            L.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Matrix evidence") }),
              _ ? N ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-evidence-grid", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Profile ID") }),
                    /* @__PURE__ */ e.jsx("dd", { children: N.profileId })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Created") }),
                    /* @__PURE__ */ e.jsx("dd", { children: new Date(N.createdAt).toLocaleString() })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Matrix source") }),
                    /* @__PURE__ */ e.jsx("dd", { children: Bc(N, r) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Orientation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: r("Source rows → receiver columns") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Imported dimensions") }),
                    /* @__PURE__ */ e.jsx("dd", { children: r("{sources} sources × {receivers} receivers", {
                      sources: N.scientific.matrix.sourceChannels.length,
                      receivers: N.scientific.matrix.receiverChannels.length
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Applied solve") }),
                    /* @__PURE__ */ e.jsx("dd", { children: r("{count} exact $PnN channels · {status}", {
                      count: _.includedPnns.length,
                      status: J.state
                    }) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Matrix hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: N.matrixHash, children: [
                      N.matrixHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Profile hash") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: N.profileHash, children: [
                      N.profileHash.slice(0, 19),
                      "…"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Provenance") }),
                    /* @__PURE__ */ e.jsx("dd", { children: r(((Di = N.provenance) == null ? void 0 : Di.sourceDescription) ?? "No additional source note supplied") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: r("Estimation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: r(((Ki = N.provenance) == null ? void 0 : Ki.estimationMethod) ?? "Imported coefficients preserved exactly") })
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-method-card", "aria-label": r("Installed compensation method"), children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: r("Pipeline") }),
                    /* @__PURE__ */ e.jsx("strong", { children: r(N.scientific.kind === "cytof-spillover" ? "Original counts → NNLS → Compensated counts → arcsinh display" : "Original values → linear matrix inverse → Compensated values → display transform") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: r("Solver") }),
                    /* @__PURE__ */ e.jsx("strong", { children: N.scientific.solverVersion }),
                    /* @__PURE__ */ e.jsx("small", { children: N.scientific.solverSettings.map(({ key: s, value: u }) => `${s}=${String(u)}`).join(" · ") })
                  ] })
                ] }),
                Qe && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": r("Original versus Compensated preview"), children: [
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { children: r("Original → Compensated impact") }),
                    /* @__PURE__ */ e.jsx("span", { children: r("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                      events: Qe.previewEvents.toLocaleString(),
                      channels: _.includedPnns.length
                    }) })
                  ] }) }),
                  /* @__PURE__ */ e.jsxs("dl", { children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: r("Values changed") }),
                      /* @__PURE__ */ e.jsxs("dd", { children: [
                        Qe.changedValues.toLocaleString(),
                        " / ",
                        Qe.comparedValues.toLocaleString(),
                        " (",
                        Te(Qe.changedValues / Qe.comparedValues, !1, 4),
                        ")"
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: r("Median |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: xe(Qe.medianAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: r("Maximum |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: xe(Qe.maxAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: r("Largest median shift") }),
                      /* @__PURE__ */ e.jsxs("dd", { title: Qe.mostChangedChannel, children: [
                        Qe.mostChangedChannel,
                        " · ",
                        xe(Qe.mostChangedChannelMedianDelta, 5)
                      ] })
                    ] }),
                    _.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: r("Negative → zero") }),
                      /* @__PURE__ */ e.jsx("dd", { children: r("{count} preview values", { count: Qe.zeroedNegativeValues.toLocaleString() }) })
                    ] })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ e.jsx("p", { children: r("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
                profile: _.profileId,
                method: Ot,
                count: _.includedPnns.length,
                status: J.state
              }) }) : /* @__PURE__ */ e.jsx("p", { children: r("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
                channels: H.channels.length,
                warnings: Es.length || r("no")
              }) })
            ] }),
            L.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: r("Review queue") }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: r("Matrix integrity") }),
                Pt.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: Pt.map((s) => /* @__PURE__ */ e.jsx("li", { children: r(s) }, s)) }) : /* @__PURE__ */ e.jsx("p", { children: r("No matrix-level items currently require review.") })
              ] }),
              J.state === "ready" && y && y.kind !== "cytof" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: r("Residual-evidence shortlist") }),
                /* @__PURE__ */ e.jsx("p", { children: r("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                  screened: qe.screenedCount.toLocaleString(),
                  candidateSuffix: qe.candidateCount > qe.screenedCount ? r(" of {count}", { count: qe.candidateCount.toLocaleString() }) : "",
                  zeroSuffix: "",
                  modeNote: r(cn === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
                }) }),
                qe.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: qe.items.map((s) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => Pi(s.sourceIndex, s.receiverIndex),
                    children: [
                      /* @__PURE__ */ e.jsxs("span", { children: [
                        /* @__PURE__ */ e.jsxs("strong", { children: [
                          s.source.label,
                          " → ",
                          s.receiver.label
                        ] }),
                        /* @__PURE__ */ e.jsxs("small", { children: [
                          s.interaction && s.interaction !== "other" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                            s.interaction,
                            " · "
                          ] }) : null,
                          r("matrix {value}%", { value: (s.coefficient * 100).toFixed(1) })
                        ] })
                      ] }),
                      /* @__PURE__ */ e.jsxs("span", { children: [
                        r("shift {shift} MAD · slope {slope}", {
                          shift: xe(s.evidence.normalizedNegativeShift ?? 0, 3),
                          slope: xe(s.evidence.residualSlope ?? 0, 4)
                        }),
                        y.kind === "cytof" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                          " ",
                          r("· zero Δ {value} pp", { value: `${s.evidence.receiverZeroDeltaFraction >= 0 ? "+" : ""}${(s.evidence.receiverZeroDeltaFraction * 100).toFixed(1)}` })
                        ] }) : null
                      ] })
                    ]
                  },
                  s.pairKey
                )) }) : /* @__PURE__ */ e.jsx("p", { children: r("No pair had enough source-high, source-low, and receiver-negative events for this conservative screen. Visual inspection remains available from the matrix.") })
              ] })
            ] })
          ] }),
          La && y && /* @__PURE__ */ e.jsx(
            aa,
            {
              profileLabel: (N == null ? void 0 : N.name) ?? (V ? "SCE_spillover" : "embedded_FCS"),
              installedLabel: r(
                N ? "Installed matrix" : V ? "SCE spillover matrix" : "Embedded FCS matrix"
              ),
              installedMatrix: {
                sourceChannels: y.sourceAxisKeys,
                receiverChannels: y.receiverAxisKeys,
                matrix: y.matrix
              },
              workingMatrix: Va,
              pendingEditCount: Object.keys(ue).length,
              onClose: () => ci(!1)
            }
          ),
          Pa && /* @__PURE__ */ e.jsx(
            Rl,
            {
              sampleName: t,
              populationName: (de == null ? void 0 : de.name) ?? r("All Events"),
              filterLabel: ji,
              pairCount: yi.length,
              onExport: mr,
              onClose: () => di(!1)
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
function qc(n, t) {
  const a = n.visible !== !1, i = t.visible !== !1;
  return a || i ? !1 : n.sample === t.sample && n.stateKey === t.stateKey;
}
const Xc = A.memo(Wc, qc);
export {
  Xc as CompensationTab
};
