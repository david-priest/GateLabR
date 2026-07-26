var Yi = Object.defineProperty;
var Hi = (n, i, r) => i in n ? Yi(n, i, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[i] = r;
var nt = (n, i, r) => Hi(n, typeof i != "symbol" ? i + "" : i, r);
import { D as Wt, r as Xi, l as Ji, s as Qi, z as er, u as Re, a as M, j as e, b as me, v as As, c as nr, d as tr, e as Ts, f as sr, F as ir, g as rr, h as ar, C as or, i as lr } from "./embed-BCYqoIRV.js";
class fe extends Error {
  constructor(r, a, o = {}) {
    super(a);
    nt(this, "code");
    nt(this, "row");
    nt(this, "column");
    this.name = "CompensationMatrixTableError", this.code = r, this.row = o.row, this.column = o.column;
  }
}
const cr = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
function zt(n) {
  return n.trim().normalize("NFC");
}
function dr(n) {
  const i = zt(n).toLowerCase();
  return i === "" || i === "x" || i === "row.names" || i === "channel" || i === "source";
}
function ur(n) {
  return n === "csv" ? "," : "	";
}
function hr(n) {
  let i = 0, r = 0, a = !1, o = !1, c = 1;
  const d = () => {
    if (i > 0 && r > 0)
      throw new fe(
        "ambiguous-delimiter",
        "The matrix header mixes comma and tab delimiters. Choose CSV or TSV explicitly.",
        { row: c }
      );
    if (i === 0 && r === 0)
      throw new fe(
        "missing-delimiter",
        "The matrix header must contain comma-separated or tab-separated columns.",
        { row: c }
      );
    return r > 0 ? "tsv" : "csv";
  };
  for (let p = 0; p < n.length; p++) {
    const x = n[p];
    if (x === '"') {
      o = !0, a && n[p + 1] === '"' ? p++ : a = !a;
      continue;
    }
    if (!a)
      if (x === ",")
        i++, o = !0;
      else if (x === "	")
        r++, o = !0;
      else if (x === "\r" || x === `
`) {
        if (o) return d();
        x === "\r" && n[p + 1] === `
` && p++, c++, i = 0, r = 0;
      } else /\s/.test(x) || (o = !0);
  }
  return d();
}
function pr(n, i) {
  const r = [];
  let a = [], o = "", c = !1, d = !1, p = 1, x = 1;
  const f = () => {
    a.push(o), o = "", d = !1;
  }, N = () => {
    f(), r.push({ cells: a, row: x }), a = [];
  };
  for (let E = 0; E < n.length; E++) {
    const v = n[E];
    if (c) {
      v === '"' ? n[E + 1] === '"' ? (o += '"', E++) : (c = !1, d = !0) : v === "\r" || v === `
` ? (v === "\r" && n[E + 1] === `
` && E++, o += `
`, p++) : o += v;
      continue;
    }
    if (d) {
      if (v === i)
        f();
      else if (v === "\r" || v === `
`)
        N(), v === "\r" && n[E + 1] === `
` && E++, p++, x = p;
      else if (v !== " ")
        throw new fe(
          "malformed-quoted-field",
          "Unexpected text follows a closing quote in the compensation matrix.",
          { row: p, column: a.length + 1 }
        );
      continue;
    }
    if (v === '"') {
      if (o.length !== 0)
        throw new fe(
          "malformed-quoted-field",
          "A quoted matrix field must begin with a quote.",
          { row: p, column: a.length + 1 }
        );
      c = !0;
    } else v === i ? f() : v === "\r" || v === `
` ? (N(), v === "\r" && n[E + 1] === `
` && E++, p++, x = p) : o += v;
  }
  if (c)
    throw new fe(
      "malformed-quoted-field",
      "The compensation matrix contains an unclosed quoted field.",
      { row: x, column: a.length + 1 }
    );
  return (o.length > 0 || a.length > 0 || d) && N(), r.filter(
    ({ cells: E }) => !(E.length === 1 && E[0].trim().length === 0)
  );
}
function mr(n, i, r) {
  const a = n.trim();
  if (!cr.test(a))
    throw new fe(
      "invalid-coefficient",
      `Matrix coefficient at row ${i}, column ${r} is not a finite decimal number.`,
      { row: i, column: r }
    );
  const o = Number(a);
  if (!Number.isFinite(o))
    throw new fe(
      "invalid-coefficient",
      `Matrix coefficient at row ${i}, column ${r} is outside the finite numeric range.`,
      { row: i, column: r }
    );
  return o;
}
function fr(n, i, r) {
  return Object.freeze({
    sourceChannels: Object.freeze(Array.from(n)),
    receiverChannels: Object.freeze(Array.from(i)),
    matrix: Object.freeze(r.map((a) => Object.freeze(Array.from(a))))
  });
}
function gr(n, i = {}) {
  if (typeof n != "string")
    throw new fe(
      "invalid-input",
      "The compensation matrix contents must be text."
    );
  const r = n.startsWith("\uFEFF") ? n.slice(1) : n;
  if (r.trim().length === 0)
    throw new fe("empty-file", "The compensation matrix file is empty.");
  const a = i == null ? void 0 : i.delimiter;
  if (a !== void 0 && a !== "auto" && a !== "csv" && a !== "tsv")
    throw new fe(
      "invalid-delimiter",
      "The compensation matrix delimiter must be auto, csv, or tsv."
    );
  const o = a ?? "auto", c = o === "auto" ? hr(r) : o, d = pr(r, ur(c));
  if (d.length === 0)
    throw new fe("empty-file", "The compensation matrix file is empty.");
  const p = d[0];
  if (p.cells.length < 2)
    throw new fe(
      "missing-receiver-columns",
      "The matrix header needs a source-channel column and at least one receiver channel.",
      { row: p.row }
    );
  const x = p.cells[0];
  if (!dr(x))
    throw new fe(
      "missing-source-column",
      "The first column must identify source channels (blank, X, row.names, channel, or source).",
      { row: p.row, column: 1 }
    );
  if (d.length < 2)
    throw new fe(
      "missing-data-rows",
      "The compensation matrix does not contain any source-channel rows.",
      { row: p.row + 1 }
    );
  const f = p.cells.slice(1).map(zt), N = [], E = [];
  for (const v of d.slice(1)) {
    if (v.cells.length !== p.cells.length)
      throw new fe(
        "row-width",
        `Matrix row ${v.row} has ${v.cells.length} columns; expected ${p.cells.length}.`,
        { row: v.row }
      );
    const C = zt(v.cells[0]);
    if (C.length === 0)
      throw new fe(
        "missing-source-channel",
        `Matrix row ${v.row} has no source-channel identity.`,
        { row: v.row, column: 1 }
      );
    N.push(C), E.push(
      v.cells.slice(1).map(($, F) => mr($, v.row, F + 2))
    );
  }
  return Object.freeze({
    input: fr(N, f, E),
    format: Object.freeze({ delimiter: c, sourceColumnHeader: x })
  });
}
function _t(n) {
  const i = n.trim().normalize("NFC"), r = i.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (r)
    return { element: r[1], mass: Number(r[2]) };
  const a = i.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return a ? { element: a[2], mass: Number(a[1]) } : null;
}
function $s(n) {
  return n.map((i, r) => ({ channel: i, index: r, isotope: _t(i) })).sort((i, r) => i.isotope && r.isotope ? i.isotope.mass - r.isotope.mass || i.isotope.element.localeCompare(r.isotope.element) || i.index - r.index : i.isotope ? -1 : r.isotope ? 1 : i.index - r.index).map(({ index: i }) => i);
}
function xr(n) {
  const i = $s(n.sourceChannels), r = $s(n.receiverChannels);
  return {
    sourceChannels: i.map((a) => n.sourceChannels[a]),
    receiverChannels: r.map((a) => n.receiverChannels[a]),
    matrix: i.map(
      (a) => r.map((o) => n.matrix[a][o])
    )
  };
}
function wn(n, i) {
  if (n === i) return "self";
  const r = _t(n), a = _t(i);
  if (!r || !a) return "other";
  const o = a.mass - r.mass;
  return r.element === a.element ? o === -1 ? "M-1" : o === 1 ? "M+1" : "same-element" : o === -1 ? "M-1" : o === 1 ? "M+1" : o === 16 ? "oxide (+16)" : "other";
}
function st(n, i) {
  const r = n.index(i);
  if (r !== void 0) return r;
  const a = n.channels.findIndex((o) => o.pnn === i);
  return a < 0 ? void 0 : a;
}
function ln(n, i, r) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(i) || i <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (r && r.length !== n)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const a = r ? r.reduce((f, N) => f + (N ? 1 : 0), 0) : n, o = Math.min(a, i), c = new Uint32Array(o);
  if (o === 0) return c;
  if (!r) {
    if (o === 1) return c;
    for (let f = 0; f < o; f++)
      c[f] = Math.floor(f * (n - 1) / (o - 1));
    return c;
  }
  const d = Array.from({ length: o }, (f, N) => o === 1 ? 0 : Math.floor(N * (a - 1) / (o - 1)));
  let p = 0, x = 0;
  for (let f = 0; f < n && x < o; f++)
    r[f] && (p === d[x] && (c[x++] = f), p++);
  return c;
}
function dn(n, i) {
  if (n.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (n.length - 1), a = Math.floor(r), o = Math.ceil(r);
  return a === o ? n[a] : n[a] + (n[o] - n[a]) * (r - a);
}
function it(n) {
  const i = n.filter(Number.isFinite).sort((c, d) => c - d);
  if (i.length === 0) return [-1, 1];
  let r = dn(i, 2e-3), a = dn(i, 0.998);
  if (!(a > r)) {
    const c = Number.isFinite(r) ? r : 0, d = Math.max(1, Math.abs(c) * 0.05);
    return [c - d, c + d];
  }
  const o = (a - r) * 0.035;
  return r -= o, a += o, [r, a];
}
function Ke(n) {
  if (n.length === 0) return Number.NaN;
  const i = [...n].sort((r, a) => r - a);
  return dn(i, 0.5);
}
function rt(n) {
  if (n.length === 0) return Number.NaN;
  const i = Ke(n), r = Ke(n.map((d) => Math.abs(d - i))) * 1.4826;
  if (Number.isFinite(r) && r > 0) return r;
  const a = n.reduce((d, p) => d + p, 0) / n.length, o = n.reduce((d, p) => d + (p - a) ** 2, 0) / Math.max(1, n.length - 1), c = Math.sqrt(o);
  return Number.isFinite(c) && c > 0 ? c : 1e-12;
}
function Ut(n, i, r = 12) {
  if (n.length !== i.length || n.length < r * 8) return null;
  const a = Array.from({ length: n.length }, (p, x) => x).sort((p, x) => n[p] - n[x]), o = [];
  for (let p = 0; p < r; p++) {
    const x = Math.floor(p * a.length / r), f = Math.floor((p + 1) * a.length / r), N = a.slice(x, f);
    if (N.length < 8) continue;
    const E = Ke(N.map((C) => n[C])), v = Ke(N.map((C) => i[C]));
    Number.isFinite(E) && Number.isFinite(v) && o.push({ x: E, y: v });
  }
  const c = [];
  for (let p = 0; p < o.length; p++)
    for (let x = p + 1; x < o.length; x++) {
      const f = o[x].x - o[p].x;
      if (f === 0) continue;
      const N = (o[x].y - o[p].y) / f;
      Number.isFinite(N) && c.push(N);
    }
  const d = Ke(c);
  return Number.isFinite(d) ? d : null;
}
function vr(n, i) {
  if (n.length !== i.length || n.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const r = Array.from({ length: n.length }, (A, R) => R).filter((A) => Number.isFinite(n[A]) && Number.isFinite(i[A])).sort((A, R) => n[A] - n[R]);
  if (r.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const a = Math.max(96, Math.floor(r.length * 0.8)), o = Math.min(r.length - 24, Math.floor(r.length * 0.9)), c = r.slice(0, a), d = r.slice(o);
  if (c.length < 96 || d.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const p = c.map((A) => n[A]), x = c.map((A) => i[A]), f = Ut(p, x, 10);
  if (f === null) return { excessMad: null, slopeDeltaMad: null };
  const N = Ke(c.map((A) => i[A] - f * n[A])), E = c.map((A) => i[A] - (N + f * n[A])), v = Math.max(
    rt(E),
    rt(x) * 0.05,
    1e-12
  ), C = d.map((A) => i[A] - (N + f * n[A])).sort((A, R) => A - R), $ = dn(C, 0.75) / v, F = r.slice(Math.floor(r.length * 0.75)), I = F.map((A) => n[A]), k = F.map((A) => i[A]), P = Ut(I, k, 4), T = dn(I, 0.9) - dn(I, 0.1), w = P === null || !(T > 0) ? null : (P - f) * T / v;
  return {
    excessMad: Number.isFinite($) ? $ : null,
    slopeDeltaMad: Number.isFinite(w) ? w : null
  };
}
function ni(n, i, r, a, o, c) {
  const d = r.length, p = vr(r, a), x = Math.min(50, Math.max(12, Math.floor(d * 0.01))), f = (_ = 0, K = 0, b = 0) => ({
    status: "insufficient",
    sourceLowEvents: _,
    sourceHighEvents: K,
    destinationNegativeEvents: b,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: p.excessMad,
    upperTailSlopeDeltaMad: p.slopeDeltaMad,
    receiverZeroDeltaFraction: d > 0 ? (c - o) / d : 0
  });
  if (d < x * 3) return f();
  const N = [...r].sort((_, K) => _ - K), E = dn(N, 0.25), v = r.flatMap((_, K) => _ <= E ? [K] : []);
  if (v.length < x) return f(v.length);
  const C = v.map((_) => r[_]), $ = Ke(C), F = rt(C);
  let I = r.flatMap((_, K) => _ >= $ + 3 * F ? [K] : []);
  if (I.length < x && (I = Array.from({ length: d }, (_, K) => K).sort((_, K) => r[K] - r[_]).slice(0, x)), I.length < x) return f(v.length, I.length);
  const k = v.map((_) => a[_]), P = Ke(k), T = rt(k), w = P + 5 * T, A = a.flatMap((_, K) => _ <= w ? [K] : []), R = new Set(A), O = v.filter((_) => R.has(_)), U = I.filter((_) => R.has(_));
  if (O.length < x || U.length < x)
    return f(v.length, I.length, A.length);
  const V = (Ke(U.map((_) => a[_])) - Ke(O.map((_) => a[_]))) / T, s = A.map((_) => n[_]), D = A.map((_) => i[_]);
  return {
    status: "ready",
    sourceLowEvents: v.length,
    sourceHighEvents: I.length,
    destinationNegativeEvents: A.length,
    normalizedNegativeShift: Number.isFinite(V) ? V : null,
    residualSlope: Ut(s, D),
    upperTailExcessMad: p.excessMad,
    upperTailSlopeDeltaMad: p.slopeDeltaMad,
    receiverZeroDeltaFraction: d > 0 ? (c - o) / d : 0
  };
}
function at(n, i, r, a, o, c) {
  let d = 0, p = 0, x = 0;
  for (let f = 0; f < r.length; f++) {
    const N = Math.abs(r[f]) <= 1e-12, E = Math.abs(a[f]) <= 1e-12;
    N && d++, E && p++, N && E && x++;
  }
  return {
    x: n.map((f) => Math.max(o[0], Math.min(o[1], f))),
    y: i.map((f) => Math.max(c[0], Math.min(c[1], f))),
    zeroPile: Object.freeze({
      source: d,
      receiver: p,
      corner: x
    })
  };
}
function It(n, i, r, a = {}) {
  var _;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation to compare Original and Compensated data." };
  const c = st(n, i), d = st(n, r);
  if (c === void 0 || d === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (n.fcs.nEvents === 0)
    return { ready: !1, reason: "This sample contains no events." };
  const p = ((_ = a.fixedEventIndices) == null ? void 0 : _.slice()) ?? ln(
    n.fcs.nEvents,
    a.maxEvents ?? 15e3,
    a.eventMask
  );
  for (const K of p)
    if (K >= n.fcs.nEvents || a.eventMask && !a.eventMask[K])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const x = n.channels[c].key, f = n.channels[d].key, N = n.originalColumnData(c), E = n.originalColumnData(d), v = n.compensatedColumnData(c), C = n.compensatedColumnData(d), $ = [], F = [], I = [], k = [], P = [], T = [], w = [], A = [];
  for (const K of p) {
    const b = n.rawToDisplay(x, N[K]), Z = n.rawToDisplay(f, E[K]), he = n.rawToDisplay(x, v[K]), ie = n.rawToDisplay(f, C[K]);
    [b, Z, he, ie].every(Number.isFinite) && ($.push(b), F.push(Z), I.push(N[K]), k.push(E[K]), P.push(he), T.push(ie), w.push(v[K]), A.push(C[K]));
  }
  const R = it([...$, ...P]), O = it([...F, ...T]), U = n.channelTicks(c, [R[0], R[1]]), V = n.channelTicks(d, [O[0], O[1]]), s = at(
    $,
    F,
    I,
    k,
    R,
    O
  ), D = at(
    P,
    T,
    w,
    A,
    R,
    O
  );
  return {
    ready: !0,
    preview: {
      eventCount: $.length,
      totalEvents: a.eventMask ? a.eligibleEventCount ?? a.eventMask.reduce((K, b) => K + (b ? 1 : 0), 0) : n.fcs.nEvents,
      xRange: R,
      yRange: O,
      xTicks: U,
      yTicks: V,
      original: s,
      compensated: D,
      evidence: ni(
        w,
        A,
        P,
        T,
        s.zeroPile.receiver,
        D.zeroPile.receiver
      )
    }
  };
}
function Kt(n, i, r, a, o, c, d = {}) {
  const p = st(n, i), x = st(n, r);
  if (p === void 0 || x === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (o.length !== a.length || c.length !== a.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const f = n.channels[p].key, N = n.channels[x].key, E = n.originalColumnData(p), v = n.originalColumnData(x), C = [], $ = [], F = [], I = [], k = [], P = [], T = [], w = [];
  for (let D = 0; D < a.length; D++) {
    const _ = a[D];
    if (_ >= n.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const K = E[_], b = v[_], Z = o[D], he = c[D], ie = n.rawToDisplay(f, K), un = n.rawToDisplay(N, b), ye = n.rawToDisplay(f, Z), Je = n.rawToDisplay(N, he);
    [K, b, Z, he, ie, un, ye, Je].every(Number.isFinite) && (C.push(ie), $.push(un), F.push(K), I.push(b), k.push(ye), P.push(Je), T.push(Z), w.push(he));
  }
  const A = d.xRange ?? it([...C, ...k]), R = d.yRange ?? it([...$, ...P]), O = n.channelTicks(p, [A[0], A[1]]), U = n.channelTicks(x, [R[0], R[1]]), V = at(C, $, F, I, A, R), s = at(k, P, T, w, A, R);
  return {
    ready: !0,
    preview: {
      eventCount: C.length,
      totalEvents: d.totalEvents ?? n.fcs.nEvents,
      xRange: A,
      yRange: R,
      xTicks: O,
      yTicks: U,
      original: V,
      compensated: s,
      evidence: ni(
        T,
        w,
        k,
        P,
        V.zeroPile.receiver,
        s.zeroPile.receiver
      )
    }
  };
}
const Fs = 0.5, br = 0.01, yr = 1e-4, jr = 0.05, wr = 3, Nr = 1, Cr = 5;
function ti(n, i) {
  const r = n.evidence.normalizedNegativeShift ?? 0, a = n.evidence.residualSlope ?? 0, o = Math.max(0, n.evidence.upperTailExcessMad ?? 0), c = Math.max(0, n.evidence.upperTailSlopeDeltaMad ?? 0), d = Math.abs(n.coefficient), p = Math.max(
    yr,
    d * jr
  );
  return {
    negativeShift: Math.max(0, -r),
    negativeSlope: Math.max(0, -a),
    zeroDelta: i === "cytof" ? Math.max(0, n.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, r),
    positiveSlope: Math.max(0, a),
    upperTailExcess: o,
    upperTailSlopeDelta: c,
    hasNegativeShift: r <= -Fs,
    hasNegativeSlope: a <= -p,
    hasNewZeroPile: i === "cytof" && n.evidence.receiverZeroDeltaFraction >= br,
    hasPositiveShift: r >= Fs,
    hasPositiveSlope: a >= p,
    hasHighTailCurve: o >= wr && (c >= Nr || o >= Cr)
  };
}
function Sr(n) {
  return Number(n.hasNegativeShift) + Number(n.hasNegativeSlope) + Number(n.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : n.hasNewZeroPile ? "new-zero-pile" : n.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function qt(n, i, r = "biological") {
  const a = ti(n, i), o = a.hasNegativeShift || a.hasNegativeSlope || a.hasNewZeroPile, c = a.hasPositiveShift || a.hasPositiveSlope, d = a.hasHighTailCurve || r === "control" && c;
  return o && d ? {
    category: "mixed-evidence",
    label: "Mixed evidence · inspect",
    detail: "Positive and negative residual signals disagree. Inspect the matched plots and use a suitable control before changing the coefficient.",
    reason: "mixed-residual-signals",
    automaticFollowup: !0
  } : o ? {
    category: "overcompensation-like",
    label: "Overcompensation-like",
    detail: "A negative receiver shift, negative residual slope, or new NNLS zero pile is present. This is a review prompt, not an automatic coefficient verdict.",
    reason: Sr(a),
    automaticFollowup: !0
  } : a.hasHighTailCurve ? r === "control" ? {
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
  } : c ? r === "control" ? {
    category: "undercompensation-like",
    label: "Undercompensation-like · control",
    detail: "Positive source-associated residual signal is present. This interpretation is valid only because control-data mode was selected.",
    reason: Number(a.hasPositiveShift) + Number(a.hasPositiveSlope) > 1 ? "multiple-undercompensation-signals" : "positive-residual-control",
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
function He(n, i) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  const r = i.filter((o) => Number.isFinite(o) && o > 0).sort((o, c) => o - c);
  if (r.length === 0) return 0;
  let a = 0;
  for (const o of r)
    if (o <= n) a++;
    else break;
  return a / r.length;
}
function Mr(n, i, r = "biological") {
  const a = n.map(($) => ({
    ...ti($, i),
    coefficient: Math.abs($.coefficient)
  })), o = ($) => a.map((F) => typeof F[$] == "number" ? F[$] : 0), c = o("negativeShift"), d = o("negativeSlope"), p = o("zeroDelta"), x = o("positiveShift"), f = o("positiveSlope"), N = o("upperTailExcess"), E = o("upperTailSlopeDelta"), v = o("coefficient"), C = n.flatMap(($, F) => {
    const I = qt($, i, r);
    if (!I.automaticFollowup || I.reason === null) return [];
    const k = a[F], P = 0.22 * He(k.negativeShift, c) + 0.13 * He(k.negativeSlope, d) + 0.14 * He(k.zeroDelta, p) + (r === "control" ? 0.13 * He(k.positiveShift, x) : 0) + (r === "control" ? 0.08 * He(k.positiveSlope, f) : 0) + 0.12 * He(k.upperTailExcess, N) + 0.08 * He(k.upperTailSlopeDelta, E) + 0.05 * He(k.coefficient, v) + 0.05 * Math.max(0, Math.min(1, $.physicalPrior));
    return [{
      index: F,
      relativePriority: P,
      reason: I.reason,
      category: I.category
    }];
  });
  return Object.freeze(C.sort(($, F) => F.relativePriority - $.relativePriority || $.index - F.index));
}
function Er(n, i) {
  const r = n.index(i);
  if (r !== void 0) return r;
  const a = n.channels.findIndex((o) => o.pnn === i);
  return a < 0 ? void 0 : a;
}
function Vt(n, i) {
  if (n.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (n.length - 1), a = Math.floor(r), o = Math.ceil(r);
  return a === o ? n[a] : n[a] + (n[o] - n[a]) * (r - a);
}
function kr(n) {
  const i = n.filter(Number.isFinite).sort((c, d) => c - d);
  if (i.length === 0) return [-1, 1];
  let r = Vt(i, 2e-3), a = Vt(i, 0.998);
  if (!(a > r)) {
    const c = Number.isFinite(r) ? r : 0, d = Math.max(1, Math.abs(c) * 0.05);
    return [c - d, c + d];
  }
  const o = (a - r) * 0.035;
  return r -= o, a += o, [r, a];
}
function Ar(n) {
  if (n.length === 0) return "0:empty";
  let i = 2166136261;
  for (const r of n)
    i ^= r, i = Math.imul(i, 16777619) >>> 0;
  return `${n.length}:${n[0]}:${n[n.length - 1]}:${i.toString(16)}`;
}
function Tr(n, i, r = {}) {
  var p;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const o = ((p = r.fixedEventIndices) == null ? void 0 : p.slice()) ?? ln(
    n.fcs.nEvents,
    r.maxEvents ?? 2500,
    r.eventMask
  );
  for (const x of o)
    if (x >= n.fcs.nEvents || r.eventMask && !r.eventMask[x])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const c = /* @__PURE__ */ new Map();
  for (const x of Array.from(new Set(i))) {
    const f = Er(n, x);
    if (f === void 0) continue;
    const N = n.channels[f], E = n.originalColumnData(f), v = n.compensatedColumnData(f), C = new Float64Array(o.length), $ = new Float64Array(o.length), F = new Float64Array(o.length), I = new Float64Array(o.length), k = [];
    for (let w = 0; w < o.length; w++) {
      const A = o[w], R = E[A], O = v[A], U = n.rawToDisplay(N.key, R), V = n.rawToDisplay(N.key, O);
      C[w] = R, $[w] = O, F[w] = U, I[w] = V, Number.isFinite(U) && k.push(U), Number.isFinite(V) && k.push(V);
    }
    const P = kr(k), T = Object.freeze({
      key: N.key,
      pnn: N.pnn,
      range: P,
      ticks: n.channelTicks(f, [P[0], P[1]]),
      originalRaw: C,
      compensatedRaw: $,
      originalDisplay: F,
      compensatedDisplay: I
    });
    c.set(x, T), c.set(N.key, T), c.set(N.pnn, T);
  }
  const d = r.eventMask ? r.eligibleEventCount ?? r.eventMask.reduce((x, f) => x + (f ? 1 : 0), 0) : n.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: o,
      eventSignature: Ar(o),
      eligibleEventCount: d,
      channels: c
    })
  };
}
function Ps(n, i, r, a, o, c, d) {
  const p = [], x = [];
  let f = 0, N = 0, E = 0;
  for (const v of o) {
    p.push(Math.max(c[0], Math.min(c[1], n[v]))), x.push(Math.max(d[0], Math.min(d[1], i[v])));
    const C = Math.abs(r[v]) <= 1e-12, $ = Math.abs(a[v]) <= 1e-12;
    C && f++, $ && N++, C && $ && E++;
  }
  return {
    x: p,
    y: x,
    zeroPile: Object.freeze({ source: f, receiver: N, corner: E })
  };
}
function si(n, i, r) {
  const a = n.channels.get(i), o = n.channels.get(r);
  if (!a || !o)
    return { ready: !1, reason: "One or both channels are absent from the frozen global-inspector dataset." };
  const c = [];
  for (let d = 0; d < n.eventIndices.length; d++)
    [
      a.originalDisplay[d],
      o.originalDisplay[d],
      a.compensatedDisplay[d],
      o.compensatedDisplay[d]
    ].every(Number.isFinite) && c.push(d);
  return {
    ready: !0,
    preview: Object.freeze({
      eventCount: c.length,
      totalEvents: n.eligibleEventCount,
      eventSignature: n.eventSignature,
      xRange: a.range,
      yRange: o.range,
      xTicks: a.ticks,
      yTicks: o.ticks,
      original: Ps(
        a.originalDisplay,
        o.originalDisplay,
        a.originalRaw,
        o.originalRaw,
        c,
        a.range,
        o.range
      ),
      compensated: Ps(
        a.compensatedDisplay,
        o.compensatedDisplay,
        a.compensatedRaw,
        o.compensatedRaw,
        c,
        a.range,
        o.range
      )
    })
  };
}
function Is(n, i, r, a, o) {
  const c = Math.max(1, Math.min(24, Math.round(o) || 3)), d = 256, p = c, x = d + 2 * p, f = new Float64Array(x * x), N = Math.max(1e-12, i[1] - i[0]), E = Math.max(1e-12, r[1] - r[0]);
  for (let k = 0; k < n.x.length; k++) {
    const P = Math.max(0, Math.min(
      x - 1,
      Math.floor((n.x[k] - i[0]) / N * d) + p
    )), T = Math.max(0, Math.min(
      x - 1,
      Math.floor((n.y[k] - r[0]) / E * d) + p
    ));
    f[T * x + P]++;
  }
  const v = new Float64Array(x * x), C = (c * 2 + 1) ** 2, $ = x + 1, F = new Float64Array($ * $);
  for (let k = 0; k < x; k++) {
    let P = 0;
    for (let T = 0; T < x; T++)
      P += f[k * x + T], F[(k + 1) * $ + T + 1] = F[k * $ + T + 1] + P;
  }
  for (let k = c; k < x - c; k++) {
    const P = k - c, T = k + c + 1;
    for (let w = c; w < x - c; w++) {
      const A = w - c, R = w + c + 1, O = F[T * $ + R] - F[P * $ + R] - F[T * $ + A] + F[P * $ + A];
      v[k * x + w] = O / C;
    }
  }
  const I = [];
  for (let k = p; k < p + d; k++)
    for (let P = p; P < p + d; P++) {
      const T = v[k * x + P];
      T > 0 && I.push(T);
    }
  return I.sort((k, P) => k - P), I.length === 0 ? 1 : Math.max(1e-12, Vt(I, a));
}
function Zt(n, i) {
  const r = Math.max(1, Math.min(10, Number.isFinite(n) ? n : 6)), a = Math.max(1, (Number.isFinite(i) ? i : 220) - 50);
  return Math.max(1, Math.min(24, r * 170 / a));
}
function Yt(n, i = 0.95, r = 3, a = Wt) {
  const o = Math.max(
    Is(n.original, n.xRange, n.yRange, i, r),
    Is(n.compensated, n.xRange, n.yRange, i, r)
  );
  return Xi(o, a);
}
function ot(n, i) {
  const r = i.size / 220, a = Math.sqrt(r), o = Math.max(7, Math.min(11, 10 * a)), c = 20, d = Math.ceil(c + o + 4);
  Ji().renderMiniPlot(n, {
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
    point_size: Math.max(0.55, Math.min(1.2, 1.15 * r)),
    point_alpha: i.pointAlpha,
    density_clip_quantile: 0.95,
    density_color_power: i.densityColorPower,
    density_color_ceiling: i.densityColorCeiling,
    density_smoothing: i.densitySmoothingRadius,
    x_axis_label_offset: 24,
    y_axis_label_offset: c,
    axis_tick_size: 3,
    axis_outer_tick_size: 0,
    plot_margins: { top: 20, right: 2, bottom: 30, left: d },
    font_sizes: {
      tick: Math.max(6.5, Math.min(10, 9 * a)),
      axis_label: o,
      title: Math.max(7.5, Math.min(12, 11 * a)),
      gate_label: Math.max(6.5, Math.min(10, 9 * a))
    }
  });
}
const cn = "http://www.w3.org/2000/svg", On = 6, Sn = 1123, lt = 794;
function ii(n) {
  return Math.ceil(Math.max(0, Math.floor(n)) / On);
}
function Ks(n) {
  return n.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function ri(n, i) {
  return `gatelab-compensation-${Ks(n.replace(/\.[^.]+$/, ""))}-${Ks(i)}`;
}
function Bt(n, i, r, a) {
  const o = ri(n, i);
  return r === "pdf" || a <= 1 ? `${o}.${r}` : `${o}-${r}-pages.zip`;
}
function Nn(n, i, r, a, o = {}) {
  const c = document.createElementNS(cn, "text");
  return c.setAttribute("x", String(r)), c.setAttribute("y", String(a)), c.setAttribute("font-family", "Arial, Helvetica, sans-serif"), c.setAttribute("font-size", String(o.size ?? 10)), c.setAttribute("font-weight", String(o.weight ?? 400)), c.setAttribute("fill", o.fill ?? "#253247"), o.anchor && c.setAttribute("text-anchor", o.anchor), c.textContent = i, n.appendChild(c), c;
}
function Rs(n, i) {
  return n.length <= i ? n : `${n.slice(0, Math.max(1, i - 1))}…`;
}
function Os(n, i, r, a, o, c, d, p, x, f, N) {
  const E = document.createElement("div");
  ot(E, {
    title: a === "original" ? "Original" : "Compensated",
    panel: r[a],
    preview: r,
    sourceLabel: i.sourceLabel,
    receiverLabel: i.receiverLabel,
    size: d,
    densityColorCeiling: x,
    densitySmoothingRadius: p,
    densityColorPower: f,
    pointAlpha: N,
    canvasScale: 300 / 96
  });
  const v = E.querySelector("canvas"), C = E.querySelector("svg");
  if (!v || !C) throw new Error("GateLab could not render a compensation export panel.");
  const $ = document.createElementNS(cn, "g");
  $.setAttribute("transform", `translate(${o},${c})`);
  const F = document.createElementNS(cn, "image");
  F.setAttribute("x", "0"), F.setAttribute("y", "0"), F.setAttribute("width", String(d)), F.setAttribute("height", String(d)), F.setAttribute("href", v.toDataURL("image/png")), $.appendChild(F), $.appendChild(C.cloneNode(!0)), n.appendChild($);
}
function Ds(n, i, r, a) {
  const o = document.createElementNS(cn, "svg");
  o.setAttribute("xmlns", cn), o.setAttribute("width", String(Sn)), o.setAttribute("height", String(lt)), o.setAttribute("viewBox", `0 0 ${Sn} ${lt}`);
  const c = document.createElementNS(cn, "rect");
  c.setAttribute("width", "100%"), c.setAttribute("height", "100%"), c.setAttribute("fill", "#ffffff"), o.appendChild(c), Nn(o, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), Nn(
    o,
    Rs(`${i.sampleName} · ${i.populationName} · ${i.profileName} · ${i.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), Nn(o, `Page ${r + 1} of ${a}`, Sn - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const d = 28, p = 18, x = 53, f = 771, N = (Sn - d * 2 - p) / 2, E = (f - x) / 3, v = 204, C = 12, $ = v * 2 + C;
  return n.forEach((F, I) => {
    const k = F.buildPreview(), P = Zt(i.densitySmoothing, v), T = Yt(
      k,
      0.95,
      P,
      i.densityColorPower
    ), w = I % 2, A = Math.floor(I / 2), R = d + w * (N + p), O = x + A * E, U = R + (N - $) / 2, V = O + 25, s = F.relationship && F.relationship !== "other" ? ` · ${F.relationship}` : "";
    if (Nn(
      o,
      Rs(`${F.sourceLabel} → ${F.receiverLabel}`, 58),
      R + 5,
      O + 14,
      { size: 10.5, weight: 700 }
    ), Nn(
      o,
      `matrix ${(F.coefficient * 100).toFixed(1)}%${s}`,
      R + N - 5,
      O + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), Os(o, F, k, "original", U, V, v, P, T, i.densityColorPower, i.pointAlpha), Os(o, F, k, "compensated", U + v + C, V, v, P, T, i.densityColorPower, i.pointAlpha), A < 2) {
      const D = document.createElementNS(cn, "line");
      D.setAttribute("x1", String(R)), D.setAttribute("x2", String(R + N)), D.setAttribute("y1", String(O + E - 3)), D.setAttribute("y2", String(O + E - 3)), D.setAttribute("stroke", "#e6eaf0"), D.setAttribute("stroke-width", "1"), o.appendChild(D);
    }
  }), Nn(
    o,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), o;
}
function Ls(n) {
  return `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(n)}`;
}
async function zs(n, i = 300) {
  const r = URL.createObjectURL(new Blob([n], { type: "image/svg+xml" }));
  try {
    const a = await new Promise((p, x) => {
      const f = new Image();
      f.onload = () => p(f), f.onerror = () => x(new Error("GateLab could not rasterize the compensation export page.")), f.src = r;
    }), o = Math.max(1, i / 96), c = document.createElement("canvas");
    c.width = Math.round(Sn * o), c.height = Math.round(lt * o);
    const d = c.getContext("2d");
    if (!d) throw new Error("Canvas export is unavailable in this browser.");
    return d.fillStyle = "#ffffff", d.fillRect(0, 0, c.width, c.height), d.scale(o, o), d.drawImage(a, 0, 0, Sn, lt), await new Promise((p, x) => {
      c.toBlob((f) => f ? p(f) : x(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(r);
  }
}
function _s(n, i) {
  const r = URL.createObjectURL(n), a = document.createElement("a");
  a.href = r, a.download = i, document.body.appendChild(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function $r(n, i, r, a) {
  const o = Math.max(2, String(r).length);
  return `${n}-page-${String(i + 1).padStart(o, "0")}.${a}`;
}
async function Fr(n, i, r, a) {
  const o = ii(n.length);
  if (o === 0) throw new Error("No compensation pairs are available to export.");
  const c = ri(i.sampleName, i.populationName);
  if (r === "pdf") {
    const { jsPDF: f } = await import("./jspdf.es.min-BZlpfV23.js").then((C) => C.j), N = new f({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), E = N.internal.pageSize.getWidth(), v = N.internal.pageSize.getHeight();
    for (let C = 0; C < o; C++) {
      C > 0 && N.addPage("a4", "landscape");
      const $ = n.slice(
        C * On,
        (C + 1) * On
      ), F = Ls(Ds($, i, C, o)), I = await zs(F), k = await new Promise((P, T) => {
        const w = new FileReader();
        w.onload = () => P(String(w.result)), w.onerror = () => T(w.error ?? new Error("GateLab could not read an export page.")), w.readAsDataURL(I);
      });
      N.addImage(k, "PNG", 0, 0, E, v, void 0, "FAST"), a == null || a({ completedPages: C + 1, totalPages: o }), await new Promise((P) => setTimeout(P, 0));
    }
    N.save(Bt(i.sampleName, i.populationName, r, o));
    return;
  }
  const d = {};
  let p = null;
  for (let f = 0; f < o; f++) {
    const N = n.slice(
      f * On,
      (f + 1) * On
    ), E = Ls(Ds(N, i, f, o)), v = $r(c, f, o, r);
    if (r === "svg") {
      const C = Qi(E);
      d[v] = C, o === 1 && (p = new Blob([C], { type: "image/svg+xml" }));
    } else {
      const C = await zs(E), $ = new Uint8Array(await C.arrayBuffer());
      d[v] = $, o === 1 && (p = C);
    }
    a == null || a({ completedPages: f + 1, totalPages: o }), await new Promise((C) => setTimeout(C, 0));
  }
  const x = Bt(
    i.sampleName,
    i.populationName,
    r,
    o
  );
  _s(o === 1 && p ? p : new Blob([er(d, { level: 6 })], { type: "application/zip" }), x);
}
const Pr = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function Ir({
  sampleName: n,
  populationName: i,
  filterLabel: r,
  pairCount: a,
  onExport: o,
  onClose: c
}) {
  const { t: d } = Re(), [p, x] = M.useState("pdf"), [f, N] = M.useState(null), [E, v] = M.useState(null), C = ii(a), $ = f !== null && f.completedPages < f.totalPages, F = Bt(n, i, p, C), I = async () => {
    v(null), N({ completedPages: 0, totalPages: C });
    try {
      await o(p, N), c();
    } catch (P) {
      N(null), v(P instanceof Error ? P.message : String(P));
    }
  }, k = (P) => {
    P.key === "Escape" && !$ && c();
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: k, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-modal gl-comp-export-modal gl-comp-comparison-export-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "comp-comparison-export-title",
      children: [
        /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-comparison-export-title", children: d("Export compensation comparison") }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: d("Export the currently filtered channel pairs as clean paired Original and Compensated biplots. Every pair retains the same frozen events, axes, transform, density scale, and edge piling in both panels.") }),
        /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions gl-comp-comparison-export-formats", children: [
          /* @__PURE__ */ e.jsx("legend", { children: d("Format") }),
          Pr.map((P) => /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-comparison-export-format",
                value: P.format,
                checked: p === P.format,
                disabled: $,
                onChange: () => x(P.format)
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: P.title }),
              /* @__PURE__ */ e.jsx("small", { children: d(P.detail) })
            ] })
          ] }, P.format))
        ] }),
        /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary gl-comp-comparison-export-summary", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("File") }),
            /* @__PURE__ */ e.jsx("dd", { title: F, children: F })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("Scope") }),
            /* @__PURE__ */ e.jsx("dd", { children: d(a === 1 ? "{count} filtered pair · both assays" : "{count} filtered pairs · both assays", { count: a.toLocaleString() }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("Pages") }),
            /* @__PURE__ */ e.jsx("dd", { children: d(C === 1 ? "{count} A4 landscape page · six pairs per page" : "{count} A4 landscape pages · six pairs per page", { count: C.toLocaleString() }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("Population") }),
            /* @__PURE__ */ e.jsx("dd", { title: i, children: i })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("Filter") }),
            /* @__PURE__ */ e.jsx("dd", { title: r, children: r })
          ] })
        ] }),
        f && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-comparison-export-progress", role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, f.totalPages), value: f.completedPages }),
          /* @__PURE__ */ e.jsx("span", { children: d("Rendering page {current} of {total}", { current: Math.min(f.completedPages + 1, f.totalPages), total: f.totalPages }) })
        ] }),
        E && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: d(E) }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: $, onClick: c, children: d("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: $ || C === 0, onClick: () => void I(), children: $ ? d("Rendering…") : d("Download {format}", { format: p.toUpperCase() }) })
        ] })
      ]
    }
  ) });
}
function Us(n) {
  return `"${n.replaceAll('"', '""')}"`;
}
function qs(n, i) {
  if (!Array.isArray(n) || n.length === 0)
    throw new Error(`The ${i} channel axis is empty.`);
  const r = n.map((a, o) => {
    if (typeof a != "string" || a.trim().length === 0)
      throw new Error(`The ${i} channel at position ${o + 1} is blank or invalid.`);
    return a.trim().normalize("NFC");
  });
  if (new Set(r).size !== r.length)
    throw new Error(`The ${i} channel axis contains duplicate identities.`);
  return r;
}
function Kr(n) {
  const i = qs(n.sourceChannels, "source"), r = qs(n.receiverChannels, "receiver");
  if (!Array.isArray(n.matrix) || n.matrix.length !== i.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const a = [
    ["channel", ...r].map(Us).join(",")
  ];
  return n.matrix.forEach((o, c) => {
    if (!Array.isArray(o) || o.length !== r.length)
      throw new Error(
        `Spill matrix row ${c + 1} does not match the receiver channel axis.`
      );
    const d = o.map((p, x) => {
      if (typeof p != "number" || !Number.isFinite(p))
        throw new Error(
          `Spill coefficient ${i[c]} → ${r[x]} is not finite.`
        );
      return Object.is(p, -0) ? "0" : String(p);
    });
    a.push([Us(i[c]), ...d].join(","));
  }), `${a.join(`
`)}
`;
}
function Rr(n, i = "installed") {
  return `${n.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${i === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function Or(n) {
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
function Dr({
  profileLabel: n,
  installedLabel: i,
  installedMatrix: r,
  workingMatrix: a = null,
  pendingEditCount: o = 0,
  onClose: c
}) {
  const { t: d } = Re(), [p, x] = M.useState("installed"), [f, N] = M.useState(null), E = p === "working" && a ? a : r, v = Rr(n, p), C = M.useMemo(
    () => Or(v),
    [v]
  ), $ = () => {
    N(null);
    try {
      const k = Kr(E), P = URL.createObjectURL(new Blob([k], { type: "text/csv;charset=utf-8" })), T = document.createElement("a");
      T.href = P, T.download = v, document.body.appendChild(T), T.click(), T.remove(), setTimeout(() => URL.revokeObjectURL(P), 1e3);
    } catch (k) {
      N(k instanceof Error ? k.message : String(k));
    }
  }, F = async () => {
    var k;
    if (!((k = navigator.clipboard) != null && k.writeText)) {
      N("Clipboard access is unavailable; select the R code below and copy it manually.");
      return;
    }
    try {
      await navigator.clipboard.writeText(C), N("R import code copied.");
    } catch {
      N("Clipboard access was denied; select the R code below and copy it manually.");
    }
  }, I = (k) => {
    k.key === "Escape" && c();
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: I, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-modal gl-comp-export-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "comp-export-title",
      children: [
        /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-export-title", children: d("Export spill matrix") }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: d("Coefficients are exported as exact fractions, not the rounded percentages shown in the matrix. Source channels are rows and receiver channels are columns. The CSV can be imported by GateLab or base R.") }),
        a && o > 0 && /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions", children: [
          /* @__PURE__ */ e.jsx("legend", { children: d("Matrix version") }),
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-export-version",
                value: "installed",
                checked: p === "installed",
                onChange: () => x("installed")
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: i }),
              /* @__PURE__ */ e.jsx("small", { children: d("Current applied scientific record") })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-export-version",
                value: "working",
                checked: p === "working",
                onChange: () => x("working")
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: d("Working draft") }),
              /* @__PURE__ */ e.jsx("small", { children: d("{count} pending edits; not yet applied", { count: o }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("File") }),
            /* @__PURE__ */ e.jsx("dd", { children: v })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("Dimensions") }),
            /* @__PURE__ */ e.jsx("dd", { children: d("{sources} sources × {receivers} receivers", { sources: E.sourceChannels.length, receivers: E.receiverChannels.length }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("Units") }),
            /* @__PURE__ */ e.jsx("dd", { children: d("Fractions (2.9% is written as 0.029)") })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-export-r-head", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: d("Import in R") }),
            /* @__PURE__ */ e.jsx("span", { children: d("Run after placing the CSV in the R working directory.") })
          ] }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => void F(), children: d("Copy R code") })
        ] }),
        /* @__PURE__ */ e.jsx("pre", { className: "gl-comp-export-code", children: /* @__PURE__ */ e.jsx("code", { children: C }) }),
        f && /* @__PURE__ */ e.jsx("div", { className: f.includes("copied") ? "gl-comp-status" : "gl-comp-warning", role: "status", children: f }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: c, children: d("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", onClick: $, children: d("Download CSV") })
        ] })
      ]
    }
  ) });
}
function ee(n, i) {
  if (!Number.isFinite(n)) return String(n);
  if (Object.is(n, -0) || n === 0) return "0";
  const r = Math.abs(n);
  if (r >= 1e6 || r < 1e-8) return n.toExponential(Math.max(1, i - 1));
  const a = Math.min(
    10,
    Math.max(0, i - Math.floor(Math.log10(r)) - 1)
  );
  return n.toFixed(a).replace(/(?:\.0+|(\.\d*?[1-9])0+)$/, "$1");
}
function Xe(n, i = !1, r = 3) {
  if (i && n === 0) return "·";
  const a = n * 100;
  return `${ee(a, r)}%`;
}
function Rt(n) {
  const i = Math.max(0, Math.min(255, n)) / 255;
  return i <= 0.04045 ? i / 12.92 : ((i + 0.055) / 1.055) ** 2.4;
}
function Lr(n, i, r = !1) {
  if (r) return {};
  if (!Number.isFinite(n)) return { backgroundColor: "#ae3e3e", color: "#ffffff" };
  const a = i > 0 ? Math.min(1, Math.abs(n) / i) : 0;
  if (a === 0) return {};
  const o = 0.08 + 0.82 * Math.sqrt(a), c = n < 0 ? [47, 128, 237] : [211, 47, 47], d = c.map((x) => 255 + (x - 255) * o), p = 0.2126 * Rt(d[0]) + 0.7152 * Rt(d[1]) + 0.0722 * Rt(d[2]);
  return {
    backgroundColor: `rgba(${c.join(",")},${o})`,
    color: p < 0.25 ? "#ffffff" : "#26384e"
  };
}
function Cn({
  value: n,
  onValueChange: i,
  scrubStep: r,
  className: a = "",
  disabled: o,
  min: c,
  max: d,
  step: p,
  title: x,
  onPointerDown: f,
  onPointerMove: N,
  onPointerUp: E,
  onPointerCancel: v,
  onLostPointerCapture: C,
  ...$
}) {
  const { t: F } = Re(), I = M.useRef(null), [k, P] = M.useState(!1), T = (w) => {
    var A, R, O;
    ((A = I.current) == null ? void 0 : A.pointerId) === w.pointerId && (I.current = null, P(!1), (O = (R = w.currentTarget).hasPointerCapture) != null && O.call(R, w.pointerId) && w.currentTarget.releasePointerCapture(w.pointerId));
  };
  return /* @__PURE__ */ e.jsx(
    "input",
    {
      ...$,
      type: "number",
      className: `gl-scrubbable-number${k ? " is-scrubbing" : ""}${a ? ` ${a}` : ""}`,
      value: n,
      disabled: o,
      min: c,
      max: d,
      step: p,
      title: x ?? F("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (w) => i(w.currentTarget.value),
      onPointerDown: (w) => {
        var s, D;
        if (f == null || f(w), w.defaultPrevented || o || w.button !== 0) return;
        const A = w.currentTarget.getBoundingClientRect();
        if (w.clientX >= A.right - 18) return;
        const R = Number(n), O = (r ?? Number(p)) || 0.1;
        if (!Number.isFinite(R) || !(O > 0)) return;
        const U = String(O), V = U.includes("e-") ? Number(U.split("e-")[1]) : U.includes(".") ? U.split(".")[1].length : 0;
        I.current = {
          pointerId: w.pointerId,
          startY: w.clientY,
          startValue: R,
          step: O,
          decimals: V,
          lastSteps: 0
        }, (D = (s = w.currentTarget).setPointerCapture) == null || D.call(s, w.pointerId);
      },
      onPointerMove: (w) => {
        N == null || N(w);
        const A = I.current;
        if (!A || A.pointerId !== w.pointerId) return;
        const R = A.startY - w.clientY;
        if (Math.abs(R) < 3) return;
        const O = R > 0 ? Math.floor(R / 4) : Math.ceil(R / 4);
        if (O === A.lastSteps) return;
        let U = A.startValue + O * A.step;
        const V = c === void 0 ? Number.NEGATIVE_INFINITY : Number(c), s = d === void 0 ? Number.POSITIVE_INFINITY : Number(d);
        Number.isFinite(V) && (U = Math.max(V, U)), Number.isFinite(s) && (U = Math.min(s, U)), I.current = { ...A, lastSteps: O }, P(!0), i(U.toFixed(Math.min(10, A.decimals))), w.preventDefault();
      },
      onPointerUp: (w) => {
        E == null || E(w), T(w);
      },
      onPointerCancel: (w) => {
        v == null || v(w), T(w);
      },
      onLostPointerCapture: (w) => {
        var A;
        C == null || C(w), ((A = I.current) == null ? void 0 : A.pointerId) === w.pointerId && (I.current = null, P(!1));
      }
    }
  );
}
const Ht = M.createContext(Wt), Xt = M.createContext(0.85), Vs = "", tt = [];
let Ot = !1;
function zr(n) {
  const i = { cancelled: !1, run: n };
  tt.push(i);
  const r = () => {
    if (Ot) return;
    Ot = !0;
    const a = () => {
      Ot = !1;
      let c = tt.shift();
      for (; c != null && c.cancelled; ) c = tt.shift();
      c == null || c.run(), tt.length > 0 && r();
    }, o = window;
    typeof o.requestIdleCallback == "function" ? o.requestIdleCallback(a, { timeout: 50 }) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(a) : setTimeout(a, 0);
  };
  return r(), () => {
    i.cancelled = !0;
  };
}
function ct({
  title: n,
  panel: i,
  preview: r,
  sourceLabel: a,
  receiverLabel: o,
  minimumSize: c = 210,
  maximumSize: d = 420,
  densityColorCeiling: p,
  densitySmoothing: x,
  showZeroPile: f = !0
}) {
  const { t: N } = Re(), E = M.useContext(Ht), v = M.useContext(Xt), C = M.useRef(null);
  M.useEffect(() => {
    const I = C.current;
    if (!I) return;
    let k = null, P = 0;
    const T = () => {
      var V;
      k = null;
      const R = ((V = I.parentElement) == null ? void 0 : V.clientWidth) ?? 230, O = Math.max(c, Math.min(d, Math.floor(R)));
      if (O === P && I.childElementCount > 0) return;
      P = O;
      const U = Zt(x, O);
      ot(I, {
        title: n,
        panel: i,
        preview: r,
        sourceLabel: a,
        receiverLabel: o,
        size: O,
        densityColorCeiling: p ?? Yt(
          r,
          0.95,
          U,
          E
        ),
        densitySmoothingRadius: U,
        densityColorPower: E,
        pointAlpha: v
      });
    }, w = () => {
      k !== null && cancelAnimationFrame(k), k = requestAnimationFrame(T);
    };
    w();
    const A = typeof ResizeObserver > "u" ? null : new ResizeObserver(w);
    return A == null || A.observe(I.parentElement ?? I), () => {
      A == null || A.disconnect(), k !== null && cancelAnimationFrame(k);
    };
  }, [p, E, x, d, c, i, v, r, o, a, n]);
  const $ = (I) => r.eventCount > 0 ? `${(I / r.eventCount * 100).toFixed(1)}%` : "0.0%", F = i.zeroPile.source > 0 || i.zeroPile.receiver > 0 || i.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": N("{title} density biplot; {source} on x, {receiver} on y", {
    title: n,
    source: a,
    receiver: o
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: C, className: "gl-comp-biplot-surface" }),
    f && F && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: N("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: $(i.zeroPile.source),
      receiver: $(i.zeroPile.receiver),
      both: $(i.zeroPile.corner)
    }) })
  ] });
}
function _r({
  title: n,
  preview: i,
  sourceLabel: r,
  receiverLabel: a,
  minimumSize: o,
  maximumSize: c,
  densityColorCeiling: d,
  densitySmoothing: p
}) {
  const { t: x } = Re(), f = M.useContext(Ht), N = M.useContext(Xt), E = M.useRef(null);
  return M.useEffect(() => {
    const v = E.current;
    if (!v) return;
    let C = null, $ = 0;
    const F = () => {
      var s;
      C = null;
      const P = ((s = v.parentElement) == null ? void 0 : s.clientWidth) ?? o, T = Math.max(o, Math.min(c, Math.floor(P)));
      if (T === $ && v.dataset.cacheReady === "true") return;
      $ = T, v.dataset.cacheReady = "false";
      const w = Zt(p, T), A = d ?? Yt(
        i,
        0.95,
        w,
        f
      );
      ot(v, {
        title: n,
        panel: i.original,
        preview: i,
        sourceLabel: r,
        receiverLabel: a,
        size: T,
        densityColorCeiling: A,
        densitySmoothingRadius: w,
        densityColorPower: f,
        pointAlpha: N,
        canvasScale: 2
      });
      const R = v.querySelector("canvas"), O = v.querySelector("svg"), U = document.createElement("div");
      ot(U, {
        title: n,
        panel: i.compensated,
        preview: i,
        sourceLabel: r,
        receiverLabel: a,
        size: T,
        densityColorCeiling: A,
        densitySmoothingRadius: w,
        densityColorPower: f,
        pointAlpha: N,
        canvasScale: 2
      });
      const V = U.querySelector("canvas");
      !R || !V || !O || (R.classList.add("gl-comp-cached-canvas", "is-original"), R.dataset.assayLayer = "original", V.classList.add("gl-comp-cached-canvas", "is-compensated"), V.dataset.assayLayer = "compensated", v.insertBefore(V, O), v.dataset.cacheReady = "true");
    }, I = () => {
      C == null || C(), C = zr(F);
    };
    I();
    const k = typeof ResizeObserver > "u" ? null : new ResizeObserver(I);
    return k == null || k.observe(v.parentElement ?? v), () => {
      k == null || k.disconnect(), C == null || C();
    };
  }, [d, f, p, c, o, N, i, a, r, n]), /* @__PURE__ */ e.jsx(
    "figure",
    {
      className: "gl-comp-biplot",
      "aria-label": x("Cached uncompensated and compensated density biplot; {source} on x, {receiver} on y", {
        source: r,
        receiver: a
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
function Bs({
  preview: n,
  sourceLabel: i,
  receiverLabel: r,
  kind: a,
  densitySmoothing: o,
  compact: c = !1,
  compensatedTitle: d = "Compensated"
}) {
  const { t: p } = Re(), x = n.eventCount > 0 ? n.original.zeroPile.receiver / n.eventCount * 100 : 0, f = n.eventCount > 0 ? n.compensated.zeroPile.receiver / n.eventCount * 100 : 0, N = f - x;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${c ? " is-compact" : ""}`, children: [
    !c && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: p("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: n.eventCount.toLocaleString(),
      sampled: n.totalEvents > n.eventCount ? p(" sampled from {total}", { total: n.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        ct,
        {
          title: p("Original"),
          panel: n.original,
          preview: n,
          sourceLabel: i,
          receiverLabel: r,
          densitySmoothing: o,
          showZeroPile: !c
        }
      ),
      /* @__PURE__ */ e.jsx(
        ct,
        {
          title: d,
          panel: n.compensated,
          preview: n,
          sourceLabel: i,
          receiverLabel: r,
          densitySmoothing: o,
          showZeroPile: !c
        }
      )
    ] }),
    !c && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-diagnostic-note", children: a === "cytof" ? /* @__PURE__ */ e.jsx(e.Fragment, { children: p("Receiver events at exact zero: {original}% → {compensated}% ({delta} percentage points). A rise can be consistent with NNLS over-subtraction, while a residual source-associated rise can be consistent with under-compensation. Neither is a verdict without a suitable negative/control population.", {
      original: x.toFixed(1),
      compensated: f.toFixed(1),
      delta: `${N >= 0 ? "+" : ""}${N.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: p("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: d
    }) }) }),
    !c && (n.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": p("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: p("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: p("{value} MAD", { value: ee(n.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: p("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: ee(n.evidence.residualSlope ?? 0, 4) })
      ] }),
      n.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: p("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: p("{value} MAD", { value: ee(n.evidence.upperTailExcessMad, 3) }) })
      ] }),
      n.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: p("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: p("{value} MAD", { value: ee(n.evidence.upperTailSlopeDeltaMad, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: p("Evidence groups") }),
        /* @__PURE__ */ e.jsx("dd", { children: p("{high} source-high · {low} source-low", {
          high: n.evidence.sourceHighEvents.toLocaleString(),
          low: n.evidence.sourceLowEvents.toLocaleString()
        }) })
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-evidence-insufficient", children: p("Residual screening needs distinct source-low/source-high groups and enough receiver-negative events; this pair remains available for visual review.") }))
  ] });
}
function Ur({
  matrixView: n,
  sourceChannels: i,
  receiverChannels: r,
  selectedSourceIndex: a,
  selectedReceiverIndex: o,
  stagedCoefficients: c,
  maximumAbsoluteOffDiagonal: d,
  onSelect: p
}) {
  const { t: x } = Re(), f = 6, N = 74, E = 44, v = 10, C = r.length * f, $ = i.length * f, F = N + C + N, I = E + $ + v, k = M.useMemo(() => {
    const T = [];
    for (let w = 0; w < n.matrix.length; w++)
      for (let A = 0; A < n.matrix[w].length; A++) {
        const R = n.sourceAxisKeys[w], O = n.receiverAxisKeys[A], U = `${R}${Vs}${O}`, V = c[U] ?? n.matrix[w][A], s = R === O;
        if (!s && (!Number.isFinite(V) || V === 0)) continue;
        const D = d > 0 && Number.isFinite(V) ? Math.min(1, Math.abs(V) / d) : 0, _ = D > 0 ? 0.12 + 0.82 * Math.sqrt(D) : 0;
        T.push({
          sourceIndex: w,
          receiverIndex: A,
          pairKey: U,
          value: V,
          diagonal: s,
          fill: s ? "#cfd4db" : Number.isFinite(V) ? V < 0 ? `rgba(47,128,237,${_})` : `rgba(211,47,47,${_})` : "#ae3e3e"
        });
      }
    return T;
  }, [n, d, c]), P = (T) => {
    const w = T.currentTarget.getBoundingClientRect();
    if (!(w.width > 0) || !(w.height > 0)) return;
    const A = (T.clientX - w.left) * F / w.width, R = (T.clientY - w.top) * I / w.height, O = Math.floor((A - N) / f), U = Math.floor((R - E) / f);
    U < 0 || U >= i.length || O < 0 || O >= r.length || n.sourceAxisKeys[U] === n.receiverAxisKeys[O] || p(`${n.sourceAxisKeys[U]}${Vs}${n.receiverAxisKeys[O]}`);
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-mini-matrix", "aria-labelledby": "comp-mini-matrix-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-mini-matrix-head", children: [
      /* @__PURE__ */ e.jsx("strong", { id: "comp-mini-matrix-heading", children: x("Matrix map") }),
      /* @__PURE__ */ e.jsx("span", { children: x("Source ↓ · receiver → · click a cell") })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        width: F,
        height: I,
        viewBox: `0 0 ${F} ${I}`,
        role: "img",
        "aria-label": x("Mini compensation matrix with {sources} source rows and {receivers} receiver columns", {
          sources: i.length,
          receivers: r.length
        }),
        onPointerDown: P,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: N, y: E, width: C, height: $, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          r.map((T, w) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: N + (w + 0.55) * f,
              y: E - 3,
              transform: `rotate(-58 ${N + (w + 0.55) * f} ${E - 3})`,
              textAnchor: "start",
              className: w === o ? "is-selected" : void 0,
              children: T.pnn
            },
            T.key
          )),
          i.map((T, w) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: N - 3,
              y: E + (w + 0.72) * f,
              textAnchor: "end",
              className: w === a ? "is-selected" : void 0,
              children: T.pnn
            },
            T.key
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: N,
              y: E + a * f,
              width: C,
              height: f,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: N + o * f,
              y: E,
              width: f,
              height: $,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          k.map((T) => /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: N + T.receiverIndex * f,
              y: E + T.sourceIndex * f,
              width: f,
              height: f,
              fill: T.fill,
              pointerEvents: "none",
              children: /* @__PURE__ */ e.jsx("title", { children: T.diagonal ? x("{channel} · self", { channel: i[T.sourceIndex].combined }) : `${i[T.sourceIndex].combined} → ${r[T.receiverIndex].combined} · ${Xe(T.value)}` })
            },
            T.pairKey
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: N + o * f,
              y: E + a * f,
              width: f,
              height: f,
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
function qr({
  dataset: n,
  pair: i,
  plotSize: r,
  densitySmoothing: a,
  flagged: o,
  selected: c,
  onSelect: d,
  onFlag: p
}) {
  const { t: x } = Re(), f = M.useRef(null), [N, E] = M.useState(() => typeof IntersectionObserver > "u");
  M.useEffect(() => {
    const $ = f.current;
    if (!$ || typeof IntersectionObserver > "u") {
      E(!0);
      return;
    }
    const F = new IntersectionObserver(
      (I) => E(I.some((k) => k.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return F.observe($), () => F.disconnect();
  }, []);
  const v = M.useMemo(
    () => N ? si(n, i.source.key, i.receiver.key) : null,
    [n, i.receiver.key, i.source.key, N]
  ), C = v != null && v.ready ? v.preview : null;
  return /* @__PURE__ */ e.jsxs(
    "article",
    {
      ref: f,
      className: `gl-comp-global-tile${c ? " is-selected" : ""}${o ? " is-flagged" : ""}`,
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
              onClick: d,
              title: `${i.source.combined} → ${i.receiver.combined}`,
              "aria-label": x("Open details for {source} to {receiver}", {
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
          /* @__PURE__ */ e.jsx("label", { title: x("Keep this pair in Flagged"), children: /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: o,
              "aria-label": x("Flag global inspector pair {source} to {receiver} for follow-up", {
                source: i.source.label,
                receiver: i.receiver.label
              }),
              onChange: ($) => p($.currentTarget.checked)
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-comp-global-plot-button",
            onClick: d,
            title: x("{source} → {receiver} · {interaction}matrix {coefficient}%", {
              source: i.source.combined,
              receiver: i.receiver.combined,
              interaction: i.interaction && i.interaction !== "other" ? `${i.interaction} · ` : "",
              coefficient: (i.coefficient * 100).toFixed(1)
            }),
            "aria-label": x("Open details for {source} to {receiver}; matrix coefficient {coefficient}%", {
              source: i.source.label,
              receiver: i.receiver.label,
              coefficient: (i.coefficient * 100).toFixed(1)
            }),
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: r, height: r }, children: C ? /* @__PURE__ */ e.jsx(
              _r,
              {
                title: "",
                preview: C,
                sourceLabel: i.source.label,
                receiverLabel: i.receiver.label,
                minimumSize: r,
                maximumSize: r,
                densitySmoothing: a
              }
            ) : v && !v.ready ? /* @__PURE__ */ e.jsx("span", { children: v.reason }) : /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" }) })
          }
        )
      ]
    }
  );
}
function Vr({
  stateKey: n,
  header: i,
  children: r
}) {
  const { t: a } = Re(), [o, c] = me(
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
          i,
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "gl-comp-layer-toggle",
              "aria-pressed": o === "compensated",
              "aria-label": a("Showing {shown} data; click to show {other} data", {
                shown: a(o === "original" ? "uncompensated" : "compensated"),
                other: a(o === "original" ? "compensated" : "uncompensated")
              }),
              title: a("Toggle every plot between uncompensated and compensated data without changing its frame"),
              onClick: () => c((d) => d === "original" ? "compensated" : "original"),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "gl-comp-layer-toggle-track", "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", {}) }),
                /* @__PURE__ */ e.jsx("span", { children: a(o === "original" ? "Uncompensated" : "Compensated") })
              ]
            }
          )
        ] }),
        r
      ]
    }
  );
}
const Br = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, Gr = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], Ie = "", Gs = 2500, Ws = 400, Wr = 2500, Zs = 15e3, Ys = [2500, 5e3, 15e3, 5e4], Zr = 24, Hs = 4, Xs = 624, Yr = Object.freeze({});
function Js(n) {
  if (!Number.isFinite(n)) return String(n);
  const i = n * 100;
  if (i === 0) return "0.0";
  const r = Math.abs(i), a = r >= 1 ? 1 : r >= 0.1 ? 2 : 3;
  return i.toFixed(a);
}
function Dt(n) {
  return n.replace(/(?: · (?:edited|revised))+$/u, "");
}
function dt(n, i) {
  const r = n.index(i), a = r === void 0 ? i : n.channels[r].pnn, o = n.labelForKey(i);
  return {
    key: i,
    pnn: a,
    label: o,
    combined: o === a ? a : `${o} (${a})`
  };
}
function Lt(n, i) {
  const r = n.channels.find((a) => a.pnn === i);
  return dt(n, (r == null ? void 0 : r.key) ?? i);
}
function Hr(n, i) {
  return n === "cytof-spillover" && i === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function Xr(n) {
  return n.replaceAll("-", " ");
}
function Gt(n) {
  if (n.length === 0) return 0;
  n.sort((r, a) => r - a);
  const i = Math.floor(n.length / 2);
  return n.length % 2 === 0 ? (n[i - 1] + n[i]) / 2 : n[i];
}
function Jr(n) {
  return Object.fromEntries(n.scientific.solverSettings.map(({ key: i, value: r }) => [i, r]));
}
function Qr(n, i) {
  const r = Object.freeze({ ...n.scientific.matrix, matrix: i }), a = Jr(n);
  return n.scientific.kind === "flow-spillover" ? {
    kind: "flow-spillover",
    method: "matrix-inverse",
    solverVersion: n.scientific.solverVersion,
    solverSettings: {
      singularTolerance: Number(a.singularTolerance),
      conditionWarningThreshold: Number(a.conditionWarningThreshold)
    },
    matrix: r
  } : {
    kind: "cytof-spillover",
    method: "nnls",
    solverVersion: n.scientific.solverVersion,
    solverSettings: {
      tolerance: Number(a.tolerance),
      kktTolerance: Number(a.kktTolerance),
      maxIterations: Number(a.maxIterations),
      adaptationVersion: String(a.adaptationVersion)
    },
    matrix: r,
    includedChannels: n.scientific.includedChannels
  };
}
function Qs(n, i, r, a) {
  const o = n.scientific.matrix.sourceChannels.indexOf(i), c = n.scientific.matrix.receiverChannels.indexOf(r);
  if (o < 0 || c < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(n.scientific.matrix.matrix.map(
    (d, p) => Object.freeze(d.map((x, f) => p === o && f === c ? a : x))
  ));
}
function ea(n, i, r) {
  var d;
  if (!n) return null;
  const a = n.scientific.matrix.sourceChannels.indexOf(i), o = n.scientific.matrix.receiverChannels.indexOf(r);
  if (a < 0 || o < 0) return null;
  const c = (d = n.scientific.matrix.matrix[a]) == null ? void 0 : d[o];
  return Number.isFinite(c) ? c : null;
}
function ei(n, i, r) {
  const a = Math.max(Math.abs(n), Math.abs(i), 1e-3);
  return Object.freeze(r === "cytof" ? { lower: 0, upper: Math.max(n + a, a * 2) } : { lower: n - a, upper: n + a });
}
function na(n, i) {
  const r = (i - n) / 3;
  return Object.freeze([n, n + r, n + 2 * r, i]);
}
function ta(n, i) {
  return n.length === i.length && n.every((r, a) => {
    var o;
    return r.length === ((o = i[a]) == null ? void 0 : o.length) && r.every((c, d) => c === i[a][d]);
  });
}
function sa(n, i) {
  if (n.compensatedLayerStatus().state !== "ready" || i.length === 0 || n.fcs.nEvents === 0) return null;
  const a = i.flatMap((E) => {
    const v = n.channels.findIndex((C) => C.pnn === E);
    return v < 0 ? [] : [v];
  });
  if (a.length === 0) return null;
  const o = Math.min(2048, n.fcs.nEvents), c = [];
  let d = 0, p = 0, x = 0, f = "", N = -1;
  for (const E of a) {
    const v = n.originalColumnData(E), C = n.compensatedColumnData(E), $ = [];
    for (let I = 0; I < o; I++) {
      const k = o === 1 ? 0 : Math.floor(I * (n.fcs.nEvents - 1) / (o - 1)), P = v[k], T = C[k], w = Math.abs(T - P);
      $.push(w), c.push(w), w > Math.max(1e-6, Math.abs(P) * 1e-6) && d++, P < 0 && T === 0 && x++, p = Math.max(p, w);
    }
    const F = Gt($);
    F > N && (N = F, f = dt(n, n.channels[E].key).combined);
  }
  return {
    previewEvents: o,
    comparedValues: c.length,
    changedValues: d,
    medianAbsoluteDelta: Gt(c),
    maxAbsoluteDelta: p,
    zeroedNegativeValues: x,
    mostChangedChannel: f,
    mostChangedChannelMedianDelta: Math.max(0, N)
  };
}
function ia(n, i) {
  return n.origin.type === "uploaded" ? n.origin.fileName : n.origin.type === "embedded-fcs" ? `${n.origin.fileName} · ${i("embedded FCS")}` : `${n.origin.presetId} · ${i("bundled preset")} ${n.origin.presetVersion}`;
}
function ra({
  sample: n,
  sampleName: i = "sample.fcs",
  compensationOn: r,
  onApplyProfile: a,
  existingHostAssays: o = [],
  onAdoptExistingAssay: c,
  onCancelApply: d,
  hasExistingGates: p = !1,
  applyStatus: x = null,
  installedProfile: f = null,
  applyTargetCount: N = 1,
  applyTargetEventCount: E,
  applyWorkerCount: v,
  applyWorkerLimit: C,
  onApplyWorkerCountChange: $,
  installedBaselineProfile: F = null,
  reviewPopulations: I = [],
  reviewPopulationMasks: k = Yr,
  onPreviewCompensationCandidate: P,
  onSolveCompensationSweep: T,
  onCancelCompensationSweep: w,
  onSuspendBackgroundWork: A,
  visible: R = !0,
  stateKey: O,
  densityColorPower: U = Wt,
  onDensityColorPowerChange: V = () => {
  }
}) {
  var Ss, Ms;
  const { t: s } = Re(), D = n.compensatedLayerStatus(), _ = D.state === "missing" ? null : D.metadata, K = (_ == null ? void 0 : _.runtimeIdentity) === "profile" ? _ : null, b = (f == null ? void 0 : f.profileId) === (K == null ? void 0 : K.profileId) ? f : null, Z = !K && n.instrument === "flow" ? n.spillover : null, [he, ie] = me(
    `compensation.${O}.selectedPair`,
    null
  ), [un, ye] = M.useState(null), [Je, Jt] = me(
    `compensation.${O}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [hn, Qt] = me(
    "compensation.inspectorWidth",
    Xs
  ), [Ce, Dn] = me(
    `compensation.${O}.workspaceView`,
    "matrix"
  ), [ke, Ln] = me(
    `compensation.${O}.globalPairFilter`,
    "relevant"
  ), [Ae, ai] = me(
    `compensation.${O}.globalLayout`,
    "compact"
  ), [oi, li] = me(
    "compensation.globalPlotSize.v5",
    160
  ), [ci, di] = me(
    "compensation.densitySmoothing.v3",
    6
  ), [ui, hi] = me(
    "compensation.pointAlpha.v1",
    0.85
  ), [ut, pi] = me(
    "compensation.pairPreviewEventLimit.v1",
    Zs
  ), [Mn, es] = M.useState(""), [En, ht] = M.useState(!1), [pt, ns] = M.useState(null), [pn, mt] = me(
    `compensation.${O}.reviewPopulation`,
    "all"
  ), [zn, mi] = me(
    `compensation.${O}.flaggedPairs`,
    []
  ), [Oe, fi] = me(
    `compensation.${O}.evidenceMode`,
    "biological"
  ), [gi, xi] = me(
    `compensation.${O}.sweepBounds`,
    {}
  ), [ft, gt] = me(
    `compensation.${O}.sweepWorkers`,
    2
  ), [Se, ts] = M.useState(""), [je, xt] = M.useState(""), [vi, vt] = M.useState(0), [Y, _n] = M.useState({}), [bi, Qe] = M.useState({}), [De, en] = M.useState({ state: "idle" }), [yi, Ue] = M.useState({}), [ji, nn] = M.useState({}), [xe, mn] = M.useState(null), [wi, kn] = M.useState(null), [le, fn] = M.useState(null), [ss, ge] = M.useState(null), [Un, bt] = M.useState(""), [Ni, is] = M.useState(!1), [Ci, rs] = M.useState(!1), Me = M.useRef(0), gn = M.useRef(0), [as, ue] = M.useState(null), [os, Le] = M.useState(!1), [H, qn] = M.useState(null), [An, tn] = M.useState(
    () => /* @__PURE__ */ new Set()
  ), [ls, qe] = M.useState(null), [Ve, xn] = M.useState(!1), [Vn, cs] = M.useState(
    () => {
      var t;
      return ((t = o[0]) == null ? void 0 : t.id) ?? "";
    }
  ), [yt, Bn] = M.useState(!1), [Gn, we] = M.useState(null), [Si, Be] = M.useState(!1), [Mi, Ge] = M.useState(null), ze = M.useRef(!1), jt = M.useRef(null), ds = M.useRef(null), vn = M.useRef(null), B = Si || x !== null, We = Math.max(0, Math.floor(N)), Ei = Math.max(
    0,
    Math.floor(E ?? n.fcs.nEvents)
  ), Ze = o.find(
    ({ id: t }) => t === Vn
  ) ?? o[0] ?? null;
  M.useEffect(() => {
    var t;
    Vn && o.some(({ id: l }) => l === Vn) || (cs(((t = o[0]) == null ? void 0 : t.id) ?? ""), Bn(!1));
  }, [o, Vn]);
  const ne = x ?? (Gn ? {
    phase: "applying",
    profileName: Mi ?? (H == null ? void 0 : H.fileName) ?? "Compensation",
    fraction: Gn.fraction,
    processedEvents: Gn.processedEvents,
    totalEvents: Gn.totalEvents
  } : null);
  M.useEffect(() => {
    R || (gn.current++, Me.current++, en({ state: "idle" }), fn(null), mn(null), A == null || A());
  }, [A, R]);
  const wt = M.useMemo(
    () => n.channels.map(({ pnn: t, columnIndex: l }) => ({ pnn: t, columnIndex: l })),
    [n]
  ), Te = M.useMemo(() => {
    if (!Z) return null;
    const t = Z.channels.map((h) => {
      const g = n.index(h);
      return g === void 0 ? null : n.channels[g].pnn;
    });
    if (t.some((h) => h === null))
      return {
        validation: null,
        error: "The embedded matrix could not be mapped back to exact FCS channel identities.",
        keyword: void 0
      };
    const l = As({
      sourceChannels: t,
      receiverChannels: t,
      matrix: Z.matrix
    }, "flow-spillover"), m = ["$SPILLOVER", "$SPILL", "SPILL"].find((h) => typeof n.fcs.keywords[h] == "string");
    return {
      validation: l,
      error: l.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${l.errors.map(({ message: h }) => h).join(" ")}`,
      keyword: m
    };
  }, [n, Z]), X = pn === "all" ? null : I.find(({ id: t }) => t === pn) ?? null, ce = X ? k[X.id] ?? null : null, re = ce ? (X == null ? void 0 : X.eventCount) ?? 0 : n.fcs.nEvents, Wn = ut === "all" ? "all" : Ys.includes(Number(ut)) ? Number(ut) : Zs, Tn = M.useMemo(
    () => ln(
      n.fcs.nEvents,
      Wn === "all" ? Math.max(1, n.fcs.nEvents) : Wn,
      ce
    ),
    [Wn, re, ce, n]
  ), $n = M.useMemo(
    () => ln(n.fcs.nEvents, 2048, ce),
    [ce, n]
  ), Nt = M.useMemo(
    () => ln(
      n.fcs.nEvents,
      Wr,
      ce
    ),
    [ce, n]
  );
  M.useEffect(() => {
    pn !== "all" && !I.some(({ id: t }) => t === pn) && mt("all");
  }, [pn, I, mt]), M.useEffect(() => {
    Me.current++, w == null || w(), Ue({}), nn({}), mn(null), fn(null), ge(null);
  }, [pn, ce, w]);
  const ae = M.useMemo(() => H ? nr({
    kind: "cytof-spillover",
    matrix: H.matrix,
    sampleChannels: wt,
    includedChannels: Array.from(An)
  }) : null, [H, An, wt]), u = M.useMemo(() => {
    if (Z)
      return {
        sourceAxisKeys: Z.channels,
        receiverAxisKeys: Z.channels,
        sourceChannels: Z.channels.map((l) => dt(n, l)),
        receiverChannels: Z.channels.map((l) => dt(n, l)),
        matrix: Z.matrix,
        kind: "flow",
        title: "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: "Applying the embedded matrix leaves its coefficients unchanged."
      };
    if (!b || !K) return null;
    const t = b.scientific.kind === "cytof-spillover" ? xr(b.scientific.matrix) : b.scientific.matrix;
    return t.matrix.length !== t.sourceChannels.length || t.matrix.some((l) => !l || l.length !== t.receiverChannels.length) ? null : {
      sourceAxisKeys: t.sourceChannels,
      receiverAxisKeys: t.receiverChannels,
      sourceChannels: t.sourceChannels.map((l) => Lt(n, l)),
      receiverChannels: t.receiverChannels.map((l) => Lt(n, l)),
      matrix: t.matrix,
      kind: b.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: b.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: b.scientific.kind === "cytof-spillover" ? s("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: t.sourceChannels.length,
        receivers: t.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: b.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [K, b, n, Z, s]), oe = (u == null ? void 0 : u.sourceChannels) ?? [], de = (u == null ? void 0 : u.receiverChannels) ?? [];
  M.useEffect(() => {
    gt((t) => Math.max(1, Math.min(Hs, Math.round(t) || 1)));
  }, [gt]);
  const Zn = un ?? he, y = M.useMemo(() => {
    if (!u || !Zn) return null;
    const [t, l] = Zn.split(Ie), m = u.sourceAxisKeys.indexOf(t), h = u.receiverAxisKeys.indexOf(l);
    return m < 0 || h < 0 || u.sourceAxisKeys[m] === u.receiverAxisKeys[h] ? null : {
      pairKey: Zn,
      sourceIndex: m,
      receiverIndex: h,
      source: oe[m],
      receiver: de[h],
      value: u.matrix[m][h],
      interaction: u.kind === "cytof" ? wn(
        u.sourceAxisKeys[m],
        u.receiverAxisKeys[h]
      ) : null
    };
  }, [Zn, u, de, oe]);
  M.useEffect(() => {
    if (!y) {
      bt("");
      return;
    }
    const t = Y[y.pairKey];
    bt(ee((t ?? y.value) * 100, 6));
  }, [y == null ? void 0 : y.pairKey, y == null ? void 0 : y.value, Y]);
  const ve = M.useMemo(() => y ? It(
    n,
    y.source.key,
    y.receiver.key,
    {
      eventMask: ce,
      fixedEventIndices: Tn,
      eligibleEventCount: re
    }
  ) : null, [r, D.state, Tn, re, ce, n, y]), Ne = M.useMemo(() => {
    if (!u || D.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const t = [];
    for (let g = 0; g < u.matrix.length; g++)
      for (let j = 0; j < u.matrix[g].length; j++) {
        const S = u.sourceAxisKeys[g], L = u.receiverAxisKeys[j];
        if (S === L) continue;
        const q = u.matrix[g][j];
        if (!Number.isFinite(q)) continue;
        const z = u.kind === "cytof" ? wn(S, L) : null, W = z !== null && z !== "self" && z !== "other";
        q === 0 && !W && Oe === "biological" || t.push({
          sourceIndex: g,
          receiverIndex: j,
          pairKey: `${S}${Ie}${L}`,
          source: oe[g],
          receiver: de[j],
          coefficient: q,
          interaction: z,
          physicalPrior: W ? 1 : 0
        });
      }
    t.sort((g, j) => j.physicalPrior - g.physicalPrior || Math.abs(j.coefficient) - Math.abs(g.coefficient));
    const l = t.slice(0, 240), m = l.flatMap((g) => {
      const j = It(
        n,
        g.source.key,
        g.receiver.key,
        {
          eventMask: ce,
          fixedEventIndices: $n,
          eligibleEventCount: re
        }
      );
      return j.ready ? [{ ...g, evidence: j.preview.evidence }] : [];
    }), h = Mr(
      m.map(({ coefficient: g, physicalPrior: j, evidence: S }) => ({ coefficient: g, physicalPrior: j, evidence: S })),
      u.kind,
      Oe
    ).map(({ index: g, relativePriority: j }) => ({ ...m[g], relativePriority: j }));
    return {
      candidateCount: t.length,
      screenedCount: l.length,
      evaluableCount: m.length,
      items: h.slice(0, 8)
    };
  }, [vi, Oe, D.state, u, de, $n, re, ce, n, oe]), te = M.useMemo(() => new Set(
    b ? b.scientific.kind === "flow-spillover" ? b.scientific.matrix.receiverChannels : b.scientific.includedChannels : []
  ), [b]), se = M.useMemo(() => u ? Tr(
    n,
    Array.from(/* @__PURE__ */ new Set([
      ...u.sourceAxisKeys,
      ...u.receiverAxisKeys
    ])),
    {
      eventMask: ce,
      fixedEventIndices: Nt,
      eligibleEventCount: re
    }
  ) : null, [
    r,
    Nt,
    D.state,
    u,
    re,
    ce,
    n
  ]);
  M.useEffect(() => {
    if (!u || te.size === 0) return;
    const t = te.has(Se) ? Se : u.sourceAxisKeys.find((m) => te.has(m)) ?? "", l = te.has(je) && je !== t ? je : u.receiverAxisKeys.find((m) => m !== t && te.has(m)) ?? "";
    t !== Se && ts(t), l !== je && xt(l);
  }, [te, je, Se, u]);
  const bn = M.useMemo(() => new Set(zn), [zn]), Ct = M.useMemo(() => {
    var m;
    if (!u) return [];
    const t = [], l = te.size > 0;
    for (let h = 0; h < u.sourceAxisKeys.length; h++) {
      const g = u.sourceAxisKeys[h];
      if (!(l && !te.has(g)))
        for (let j = 0; j < u.receiverAxisKeys.length; j++) {
          const S = u.receiverAxisKeys[j];
          if (g === S || l && !te.has(S)) continue;
          const L = (m = u.matrix[h]) == null ? void 0 : m[j];
          if (!Number.isFinite(L)) continue;
          const q = oe[h], z = de[j];
          if (!q || !z || se != null && se.ready && (!se.dataset.channels.has(q.key) || !se.dataset.channels.has(z.key))) continue;
          const W = u.kind === "cytof" ? wn(g, S) : null, Q = W !== null && W !== "self" && W !== "other";
          t.push({
            sourceIndex: h,
            receiverIndex: j,
            pairKey: `${g}${Ie}${S}`,
            source: q,
            receiver: z,
            coefficient: L,
            interaction: W,
            physicalPrior: Q ? 1 : 0
          });
        }
    }
    return t;
  }, [se, te, u, de, oe]), $e = M.useMemo(() => {
    const t = Mn.trim().toLocaleLowerCase();
    return Ct.filter((l) => {
      const m = Math.abs(l.coefficient) > 1e-12, h = l.physicalPrior > 0;
      return ke === "all" || ke === "relevant" && (m || h) || ke === "nonzero" && m || ke === "physical" && h || ke === "flagged" && bn.has(l.pairKey) ? t ? `${l.source.combined} ${l.receiver.combined}`.toLocaleLowerCase().includes(t) : !0 : !1;
    });
  }, [bn, Ct, ke, Mn]);
  M.useEffect(() => {
    var l;
    if (!pt || Ce !== "global") return;
    const t = [...((l = vn.current) == null ? void 0 : l.querySelectorAll(".gl-comp-global-tile")) ?? []].find((m) => m.dataset.pairKey === pt);
    t && (t.scrollIntoView({ block: "center", inline: "center" }), ns(null));
  }, [En, Ae, pt, $e, Ce]);
  const St = M.useMemo(() => {
    if (Ae === "compact") return [];
    const t = /* @__PURE__ */ new Map();
    for (const l of $e) {
      const m = Ae === "source" ? l.source : l.receiver, h = t.get(m.key);
      h ? h.pairs.push(l) : t.set(m.key, { channel: m, pairs: [l] });
    }
    return [...t.values()];
  }, [Ae, $e]), us = M.useMemo(
    () => Ae === "compact" ? $e : St.flatMap((t) => t.pairs),
    [St, Ae, $e]
  ), hs = `${s(Br[ke])}${Mn.trim() ? s(" · search “{query}”", { query: Mn.trim() }) : ""}`, Mt = Math.max(120, Math.min(220, Math.round(oi) || 120)), Ye = Math.max(1, Math.min(10, Math.round(ci) || 6)), Yn = Math.max(0.1, Math.min(1, Number(ui) || 0.85)), J = M.useMemo(() => !b || !u || D.state !== "ready" ? [] : zn.flatMap((t) => {
    const [l, m] = t.split(Ie), h = u.sourceAxisKeys.indexOf(l), g = u.receiverAxisKeys.indexOf(m);
    if (h < 0 || g < 0 || l === m || !te.has(l) || !te.has(m)) return [];
    const j = It(
      n,
      oe[h].key,
      de[g].key,
      {
        eventMask: ce,
        fixedEventIndices: $n,
        eligibleEventCount: re
      }
    );
    if (!j.ready) return [];
    const S = Ne.items.find((L) => L.pairKey === t);
    return [{
      sourceIndex: h,
      receiverIndex: g,
      pairKey: t,
      source: oe[h],
      receiver: de[g],
      coefficient: u.matrix[h][g],
      interaction: u.kind === "cytof" ? wn(l, m) : null,
      physicalPrior: u.kind === "cytof" && wn(l, m) !== "other" ? 1 : 0,
      evidence: j.preview.evidence,
      relativePriority: (S == null ? void 0 : S.relativePriority) ?? 0
    }];
  }), [zn, te, D.state, u, b, de, Ne.items, $n, re, ce, n, oe]), Fe = J, ps = M.useMemo(() => {
    if (!b) return 0.01;
    const t = [];
    for (let l = 0; l < b.scientific.matrix.matrix.length; l++) {
      const m = b.scientific.matrix.sourceChannels[l];
      for (let h = 0; h < b.scientific.matrix.matrix[l].length; h++) {
        if (m === b.scientific.matrix.receiverChannels[h]) continue;
        const g = Math.abs(b.scientific.matrix.matrix[l][h]);
        Number.isFinite(g) && g > 1e-12 && t.push(g);
      }
    }
    return t.length > 0 ? Gt(t) : 0.01;
  }, [b]), Et = (t, l) => {
    const m = gi[t];
    if (m) return m;
    const h = ei(l, ps, (u == null ? void 0 : u.kind) ?? "flow");
    return {
      lowerPercent: ee(h.lower * 100, 5),
      upperPercent: ee(h.upper * 100, 5)
    };
  }, Fn = (t, l) => {
    const m = Et(t, l), h = Number(m.lowerPercent) / 100, g = Number(m.upperPercent) / 100;
    return !Number.isFinite(h) || !Number.isFinite(g) ? { lower: h, upper: g, error: "Enter finite lower and upper sweep bounds." } : (u == null ? void 0 : u.kind) === "cytof" && h < 0 ? { lower: h, upper: g, error: "CyTOF NNLS sweep bounds cannot be negative." } : g > h ? { lower: h, upper: g, error: null } : { lower: h, upper: g, error: "The upper sweep bound must be greater than the lower bound." };
  }, Hn = (t, l, m, h) => {
    xi((g) => ({
      ...g,
      [t]: {
        ...g[t] ?? (() => {
          const j = ei(l, ps, (u == null ? void 0 : u.kind) ?? "flow");
          return {
            lowerPercent: ee(j.lower * 100, 5),
            upperPercent: ee(j.upper * 100, 5)
          };
        })(),
        [m]: h
      }
    })), Ue((g) => {
      if (!(t in g)) return g;
      const j = { ...g };
      return delete j[t], j;
    }), nn((g) => {
      if (!(t in g)) return g;
      const j = { ...g };
      return delete j[t], j;
    });
  }, Pn = (t, l) => {
    mi((m) => l ? m.includes(t) ? m : [...m, t] : m.filter((h) => h !== t)), l ? (ie(t), kn(t)) : (Ue((m) => {
      if (!(t in m)) return m;
      const h = { ...m };
      return delete h[t], h;
    }), nn((m) => {
      if (!(t in m)) return m;
      const h = { ...m };
      return delete h[t], h;
    }));
  }, ki = () => {
    if (!u || !Se || !je || Se === je) return;
    if (!te.has(Se) || !te.has(je)) {
      ge("Both channels must be included in the installed compensation solve.");
      return;
    }
    const t = `${Se}${Ie}${je}`;
    Pn(t, !0), ge(null);
  }, kt = Fe.reduce((t, l) => t + (Fn(l.pairKey, l.coefficient).error ? 1 : 0), 0), yn = M.useMemo(() => {
    if (!b) return null;
    const t = b.scientific.matrix.matrix.map((l) => Array.from(l));
    for (const [l, m] of Object.entries(Y)) {
      const [h, g] = l.split(Ie), j = b.scientific.matrix.sourceChannels.indexOf(h), S = b.scientific.matrix.receiverChannels.indexOf(g);
      j >= 0 && S >= 0 && (t[j][S] = m);
    }
    return Object.freeze(t.map((l) => Object.freeze(l)));
  }, [b, Y]);
  M.useEffect(() => {
    const t = Object.keys(Y).length;
    if (!R || t === 0 || !b || b.scientific.kind !== "flow-spillover" || D.state !== "ready" || !yn || !y || !P) {
      gn.current++, en({ state: "idle" });
      return;
    }
    const l = Tn;
    if (l.length === 0) {
      en({
        state: "error",
        pairKey: y.pairKey,
        message: s("The selected review population contains no events.")
      });
      return;
    }
    const m = ++gn.current, h = y.pairKey;
    en((j) => ({
      state: "updating",
      pairKey: h,
      ...(j.state === "ready" || j.state === "updating") && j.pairKey === h && j.preview ? { preview: j.preview } : {}
    }));
    const g = window.setTimeout(() => {
      P(
        b,
        l,
        yn
      ).then((j) => {
        if (gn.current !== m) return;
        const S = j.sourceChannels.indexOf(y.source.pnn), L = j.sourceChannels.indexOf(y.receiver.pnn);
        if (S < 0 || L < 0)
          throw new Error(s("The preview result did not contain the selected flow channels."));
        const q = Kt(
          n,
          y.source.pnn,
          y.receiver.pnn,
          l,
          j.candidateColumns[S],
          j.candidateColumns[L],
          { totalEvents: re }
        );
        if (!q.ready) throw new Error(q.reason);
        en({
          state: "ready",
          pairKey: h,
          preview: q.preview
        });
      }).catch((j) => {
        if (gn.current !== m) return;
        const S = j instanceof Error ? j.message : String(j);
        /cancel|supersed|stale/i.test(S) || en({ state: "error", pairKey: h, message: S });
      });
    }, 90);
    return () => window.clearTimeout(g);
  }, [
    D.state,
    P,
    b,
    Tn,
    re,
    n,
    n.dataRevision,
    n.displayTransformContextKey,
    n.layerRevision,
    y,
    Y,
    s,
    R,
    yn
  ]);
  const Ai = M.useMemo(() => !u || Object.keys(Y).length === 0 ? null : {
    sourceChannels: u.sourceAxisKeys,
    receiverChannels: u.receiverAxisKeys,
    matrix: u.matrix.map(
      (t, l) => t.map((m, h) => {
        const g = `${u.sourceAxisKeys[l]}${Ie}${u.receiverAxisKeys[h]}`;
        return Y[g] ?? m;
      })
    )
  }, [u, Y]), ms = M.useMemo(() => {
    if (!u) return [];
    const t = [];
    for (let l = 0; l < u.matrix.length; l++)
      for (let m = 0; m < u.matrix[l].length; m++) {
        const h = u.matrix[l][m];
        u.sourceAxisKeys[l] === u.receiverAxisKeys[m] || !Number.isFinite(h) || h <= 1 || t.push(`${oe[l].combined} → ${de[m].combined}`);
      }
    return t;
  }, [u, de, oe]), At = M.useMemo(() => {
    if (!u) return [];
    const t = [];
    for (let l = 0; l < u.matrix.length; l++)
      for (let m = 0; m < u.matrix[l].length; m++) {
        const h = u.matrix[l][m], g = u.sourceAxisKeys[l] === u.receiverAxisKeys[m], j = `${oe[l].combined} → ${de[m].combined}`;
        Number.isFinite(h) ? g && Math.abs(h - 1) > 1e-8 ? t.push(`${oe[l].combined}: diagonal is ${Xe(h)}, not 100%`) : !g && h < 0 ? t.push(`${j}: negative coefficient (${Xe(h)})`) : !g && h > 1 && t.push(`${j}: coefficient above 100%`) : t.push(`${j}: non-finite coefficient (${String(h)})`);
      }
    return t;
  }, [u, de, oe]), fs = M.useMemo(
    () => (u == null ? void 0 : u.matrix.some((t) => t.some((l) => !Number.isFinite(l)))) ?? !1,
    [u]
  ), Ee = M.useMemo(
    () => K && D.state === "ready" ? sa(n, K.includedPnns) : null,
    [D.state, K, n]
  ), Xn = M.useMemo(() => {
    const t = [...At];
    return D.state === "stale" && t.push(...D.reasons.map((l) => `Profile unavailable: ${Xr(l)}`)), t;
  }, [D, At]), gs = K ? (b == null ? void 0 : b.name) ?? "Installed compensation profile" : Z ? "Embedded FCS matrix" : "No compatible matrix", Ti = K ? Hr(K.kind, K.method) : Z ? "Flow linear inverse" : "Not configured", Jn = s(Ti), Tt = (K == null ? void 0 : K.includedPnns.length) ?? (Z == null ? void 0 : Z.channels.length) ?? 0, Qn = (b == null ? void 0 : b.name) ?? (K == null ? void 0 : K.profileId) ?? gs, xs = Dt(Qn), $i = xs !== Qn || (b == null ? void 0 : b.recordType) === "revision" ? `${xs} · ${s("revised")}` : Qn, Fi = Z !== null && !fs || K !== null && D.state === "ready", vs = M.useMemo(() => {
    if (!u) return 0;
    let t = 0;
    for (let l = 0; l < u.matrix.length; l++)
      for (let m = 0; m < u.matrix[l].length; m++) {
        if (u.sourceAxisKeys[l] === u.receiverAxisKeys[m]) continue;
        const h = u.matrix[l][m];
        Number.isFinite(h) && (t = Math.max(t, Math.abs(h)));
      }
    return t;
  }, [u]), et = !!((b == null ? void 0 : b.scientific.kind) === "flow-spillover" && D.state === "ready" && u && Math.max(u.sourceAxisKeys.length, u.receiverAxisKeys.length) <= Zr), In = u ? et ? Math.max(42, Math.min(54, Math.floor(960 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : Math.max(13, Math.min(38, Math.floor(760 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : 13;
  M.useEffect(() => {
    _n({}), Qe({}), en({ state: "idle" }), gn.current++;
  }, [b == null ? void 0 : b.profileId]), M.useEffect(() => {
    (u == null ? void 0 : u.kind) === "flow" && ke === "physical" && Ln("relevant");
  }, [ke, u == null ? void 0 : u.kind, Ln]);
  const Pi = (t) => {
    Jt((l) => ({ ...l, [t]: !l[t] }));
  }, bs = (t) => {
    var h;
    const l = ((h = vn.current) == null ? void 0 : h.getBoundingClientRect().width) ?? 1100, m = Math.max(360, Math.min(900, l - 440 - 8));
    return Math.max(360, Math.min(m, Math.round(t)));
  }, Ii = (t) => {
    var g;
    if (t.button !== 0) return;
    t.preventDefault();
    const l = t.currentTarget;
    (g = l.setPointerCapture) == null || g.call(l, t.pointerId);
    const m = (j) => {
      var L;
      const S = (L = vn.current) == null ? void 0 : L.getBoundingClientRect();
      S && Qt(bs(S.right - j.clientX));
    }, h = () => {
      var j;
      window.removeEventListener("pointermove", m), window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", h), (j = l.releasePointerCapture) == null || j.call(l, t.pointerId);
    };
    window.addEventListener("pointermove", m), window.addEventListener("pointerup", h), window.addEventListener("pointercancel", h);
  }, Ki = (t) => {
    let l = null;
    t.key === "ArrowLeft" ? l = hn + 40 : t.key === "ArrowRight" ? l = hn - 40 : t.key === "Home" && (l = Xs), l !== null && (t.preventDefault(), Qt(bs(l)));
  }, Ri = async (t) => {
    var m;
    const l = (m = t.currentTarget.files) == null ? void 0 : m[0];
    if (t.currentTarget.value = "", !!l) {
      qe(null), ue(null), Le(!1), we(null), xn(!1);
      try {
        const h = gr(await l.text()), g = As(
          h.input,
          "cytof-spillover"
        );
        if (!g.ok)
          throw new Error(g.errors.map(({ message: L }) => L).join(" "));
        const j = /* @__PURE__ */ new Map();
        for (const { pnn: L } of wt) {
          const q = L.trim().normalize("NFC");
          j.set(q, (j.get(q) ?? 0) + 1);
        }
        const S = g.value.receiverChannels.filter(
          (L) => j.get(L) === 1
        );
        qn({
          fileName: l.name,
          parsed: h,
          matrix: g.value,
          validationWarnings: g.warnings
        }), tn(new Set(S));
      } catch (h) {
        qn(null), tn(/* @__PURE__ */ new Set()), qe(h instanceof Error ? h.message : String(h));
      }
    }
  }, Oi = (t, l) => {
    tn((m) => {
      const h = new Set(m);
      return l ? h.add(t) : h.delete(t), h;
    });
  }, ys = async () => {
    var m, h;
    if (!H)
      throw new Error(s("Choose a CyTOF spillover matrix first."));
    const t = ((h = (m = globalThis.crypto) == null ? void 0 : m.randomUUID) == null ? void 0 : h.call(m)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, l = H.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation";
    return Ts(
      {
        kind: "cytof-spillover",
        method: "nnls",
        solverVersion: or,
        solverSettings: lr,
        matrix: H.matrix,
        includedChannels: Array.from(An)
      },
      {
        profileId: `cytof-${t}`,
        name: l,
        createdAt: /* @__PURE__ */ new Date(),
        origin: {
          type: "uploaded",
          fileName: H.fileName,
          format: H.parsed.format.delimiter,
          sourceColumnHeader: H.parsed.format.sourceColumnHeader
        },
        provenance: {
          sourceDescription: "User-uploaded CyTOF spillover matrix",
          estimationMethod: "Imported; coefficients preserved exactly"
        }
      }
    );
  }, Di = async () => {
    if (!(ze.current || B || !H || !(ae != null && ae.canApply) || !a)) {
      if (p && !Ve) {
        qe(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      qe(null), ue(null), we(null), ze.current = !0, Be(!0), Ge(H.fileName);
      try {
        const t = await ys();
        await a(t, we), ue(s("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: t.name,
          channels: An.size,
          files: We
        })), qn(null), tn(/* @__PURE__ */ new Set()), xn(!1), we(null);
      } catch (t) {
        const l = t instanceof Error ? t.message : String(t);
        /cancel/i.test(l) ? ue(s("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : qe(l);
      } finally {
        ze.current = !1, Be(!1), Ge(null);
      }
    }
  }, Li = async () => {
    if (!(ze.current || B || !H || !(ae != null && ae.canApply) || !Ze || !c || !yt)) {
      if (p && !Ve) {
        qe(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before adopting the assay.")
        );
        return;
      }
      qe(null), ue(null), we(null), ze.current = !0, Be(!0), Ge(Ze.label);
      try {
        const t = await ys();
        await c(
          t,
          Ze,
          we
        ), ue(s("Using existing SCE assay {assay} with {matrix}. No assay values were recomputed.", {
          assay: Ze.label,
          matrix: t.name
        })), qn(null), tn(/* @__PURE__ */ new Set()), xn(!1), Bn(!1), we(null);
      } catch (t) {
        qe(t instanceof Error ? t.message : String(t));
      } finally {
        ze.current = !1, Be(!1), Ge(null);
      }
    }
  }, zi = async () => {
    var l, m, h;
    if (ze.current || B || !Z || !((l = Te == null ? void 0 : Te.validation) != null && l.ok) || !a) return;
    if (p && !Ve) {
      Le(!0), ue(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const t = `${i.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    ue(null), Le(!1), we(null), ze.current = !0, Be(!0), Ge(t);
    try {
      const g = ((h = (m = globalThis.crypto) == null ? void 0 : m.randomUUID) == null ? void 0 : h.call(m)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, j = await Ts(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: ir,
          solverSettings: sr,
          matrix: Te.validation.value
        },
        {
          profileId: `flow-${g}`,
          name: t,
          createdAt: /* @__PURE__ */ new Date(),
          origin: {
            type: "embedded-fcs",
            fileName: i,
            ...Te.keyword ? { keyword: Te.keyword } : {}
          },
          provenance: {
            sourceDescription: "Spillover matrix embedded in the source FCS file",
            estimationMethod: "Imported from FCS; coefficients preserved exactly"
          }
        }
      );
      await a(j, we), xn(!1), ue(s("Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available."));
    } catch (g) {
      Le(!0), ue(g instanceof Error ? g.message : String(g));
    } finally {
      ze.current = !1, Be(!1), Ge(null), we(null);
    }
  }, js = (t, l) => {
    var g, j;
    const m = oe[t], h = de[l];
    !u || !m || !h || u.sourceAxisKeys[t] === u.receiverAxisKeys[l] || (ie(`${u.sourceAxisKeys[t]}${Ie}${u.receiverAxisKeys[l]}`), (j = (g = ds.current) == null ? void 0 : g.querySelector(
      `button[data-source-index="${t}"][data-receiver-index="${l}"]`
    )) == null || j.focus());
  }, _i = (t, l, m) => {
    if (!u) return;
    const h = u.sourceAxisKeys.length, g = u.receiverAxisKeys.length;
    let j = l, S = m;
    const L = (z, W) => {
      let Q = z + W;
      for (; Q >= 0 && Q < g; ) {
        if (u.sourceAxisKeys[l] !== u.receiverAxisKeys[Q]) return Q;
        Q += W;
      }
      return z;
    }, q = (z, W) => {
      let Q = z + W;
      for (; Q >= 0 && Q < h; ) {
        if (u.sourceAxisKeys[Q] !== u.receiverAxisKeys[m]) return Q;
        Q += W;
      }
      return z;
    };
    switch (t.key) {
      case "ArrowLeft":
        S = L(m, -1);
        break;
      case "ArrowRight":
        S = L(m, 1);
        break;
      case "ArrowUp":
        j = q(l, -1);
        break;
      case "ArrowDown":
        j = q(l, 1);
        break;
      case "Home": {
        S = u.sourceAxisKeys[l] === u.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const z = g - 1;
        S = u.sourceAxisKeys[l] === u.receiverAxisKeys[z] ? z - 1 : z;
        break;
      }
      default:
        return;
    }
    t.preventDefault(), js(j, S);
  }, Kn = (t, l) => {
    if (!b || !Number.isFinite(l)) return;
    const [m, h] = t.split(Ie), g = b.scientific.matrix.sourceChannels.indexOf(m), j = b.scientific.matrix.receiverChannels.indexOf(h);
    if (g < 0 || j < 0) return;
    if (b.scientific.kind === "cytof-spillover" && l < 0) {
      Le(!0), ue(s("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const S = b.scientific.matrix.matrix[g][j];
    _n((L) => {
      const q = { ...L };
      return l === S ? delete q[t] : q[t] = l, q;
    }), Le(!1), ue(s("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: m,
      receiver: h,
      value: (l * 100).toFixed(2)
    }));
  }, ws = (t, l, m, h) => {
    const g = m[0];
    if (!g) return null;
    const j = g.sourceChannels.indexOf(t.source.pnn), S = g.sourceChannels.indexOf(t.receiver.pnn);
    if (j < 0 || S < 0) return null;
    const L = Kt(
      n,
      t.source.pnn,
      t.receiver.pnn,
      h,
      g.currentColumns[j],
      g.currentColumns[S],
      { totalEvents: re }
    );
    if (!L.ready) return null;
    const q = [{
      value: t.coefficient,
      isCurrent: !0,
      preview: L.preview
    }];
    return m.forEach((z, W) => {
      const Q = z.sourceChannels.indexOf(t.source.pnn), Pe = z.sourceChannels.indexOf(t.receiver.pnn);
      if (Q < 0 || Pe < 0) return;
      const be = Kt(
        n,
        t.source.pnn,
        t.receiver.pnn,
        h,
        z.candidateColumns[Q],
        z.candidateColumns[Pe],
        {
          totalEvents: re,
          xRange: L.preview.xRange,
          yRange: L.preview.yRange
        }
      );
      be.ready && q.push({
        value: l[W],
        isCurrent: !1,
        preview: be.preview
      });
    }), q.sort((z, W) => z.value - W.value || Number(W.isCurrent) - Number(z.isCurrent)), { pairKey: t.pairKey, values: Object.freeze(q) };
  }, Ui = async (t) => {
    if (!b || !u || !T || B || le || xe) return;
    const l = Fn(t.pairKey, t.coefficient);
    if (l.error) {
      ge(l.error);
      return;
    }
    const m = ln(
      n.fcs.nEvents,
      Ws,
      ce
    );
    if (m.length === 0) {
      ge(s("The selected review population contains no events."));
      return;
    }
    const h = ++Me.current, g = [l.lower, l.upper];
    mn(t.pairKey), ge(null);
    try {
      const j = await T(
        b,
        m,
        g.map((L) => Qs(
          b,
          u.sourceAxisKeys[t.sourceIndex],
          u.receiverAxisKeys[t.receiverIndex],
          L
        )),
        void 0,
        1
      );
      if (Me.current !== h) return;
      const S = ws(t, g, j, m);
      if (!S) throw new Error(s("The fast bounds preview could not be built for this pair."));
      nn((L) => ({ ...L, [t.pairKey]: S }));
    } catch (j) {
      if (Me.current !== h) return;
      const S = j instanceof Error ? j.message : String(j);
      ge(/cancel/i.test(S) ? s("Fast bounds preview cancelled.") : S);
    } finally {
      Me.current === h && mn(null);
    }
  }, qi = async () => {
    var h;
    if (!b || !T || Fe.length === 0 || B || le !== null || xe !== null) return;
    if (kt > 0) {
      ge(s("Fix the sweep bounds for {count} flagged pairs before running.", { count: kt }));
      return;
    }
    const t = ln(
      n.fcs.nEvents,
      Gs,
      ce
    );
    if (t.length === 0) {
      ge(s("The selected review population contains no events."));
      return;
    }
    const l = ++Me.current, m = Fe.flatMap((g) => {
      const j = Fn(g.pairKey, g.coefficient);
      return na(j.lower, j.upper).map((S) => ({
        pair: g,
        value: S,
        matrix: Qs(
          b,
          u.sourceAxisKeys[g.sourceIndex],
          u.receiverAxisKeys[g.receiverIndex],
          S
        )
      }));
    });
    ge(null), Ue({}), fn({ completed: 0, total: m.length });
    try {
      const g = await T(
        b,
        t,
        m.map(({ matrix: S }) => S),
        (S, L) => {
          Me.current === l && fn({ completed: S, total: L });
        },
        ft
      );
      if (Me.current !== l) return;
      if (g.length !== m.length)
        throw new Error(s("The compensation worker returned an incomplete coefficient sweep."));
      const j = {};
      for (const S of Fe) {
        const L = m.flatMap((z, W) => z.pair.pairKey === S.pairKey ? [W] : []), q = ws(
          S,
          L.map((z) => m[z].value),
          L.map((z) => g[z]),
          t
        );
        q && (j[S.pairKey] = q);
      }
      Ue(j), kn(((h = Fe[0]) == null ? void 0 : h.pairKey) ?? null);
    } catch (g) {
      if (Me.current !== l) return;
      const j = g instanceof Error ? g.message : String(g);
      ge(/cancel/i.test(j) ? s("Exact coefficient sweep cancelled.") : j);
    } finally {
      Me.current === l && fn(null);
    }
  }, Vi = () => {
    Me.current++, w == null || w(), fn(null), mn(null), ge(s("Exact coefficient sweep cancelled."));
  }, Bi = async () => {
    var l, m;
    if (!b || !yn || !a || Object.keys(Y).length === 0) return;
    const t = `${Dt(b.name)} · edited`;
    ue(null), Le(!1), Be(!0), Ge(t), we(null);
    try {
      const g = {
        profileId: `comp-edit-${((m = (l = globalThis.crypto) == null ? void 0 : l.randomUUID) == null ? void 0 : m.call(l)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: t,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(Y).length} compensation coefficient${Object.keys(Y).length === 1 ? "" : "s"} in GateLab.`
      }, j = (F == null ? void 0 : F.recordType) === "baseline" && ta(yn, F.scientific.matrix.matrix) ? await rr(b, F, g) : await ar(
        b,
        Qr(b, yn),
        g
      );
      await a(j, we), _n({}), Qe({}), Ue({}), nn({}), mn(null), ge(null), vt((S) => S + 1), J.length > 0 && (Dn("attention"), ie(J[0].pairKey), kn(J[0].pairKey)), ue(s("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: Dt(j.name),
        flagged: J.length > 0 ? s(
          J.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: J.length }
        ) : ""
      }));
    } catch (h) {
      Le(!0), ue(h instanceof Error ? h.message : String(h));
    } finally {
      Be(!1), Ge(null), we(null);
    }
  }, Ns = (t) => {
    if (J.length === 0) return;
    const l = J.findIndex(({ pairKey: g }) => g === he), m = l < 0 ? t > 0 ? 0 : J.length - 1 : (l + t + J.length) % J.length, h = J[m];
    ye(null), ie(h.pairKey), kn(h.pairKey);
  }, $t = () => /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "gl-comp-inspector-resize",
      role: "separator",
      "aria-label": s("Resize compensation inspector"),
      "aria-orientation": "vertical",
      "aria-valuemin": 360,
      "aria-valuemax": 900,
      "aria-valuenow": hn,
      tabIndex: 0,
      title: s("Drag to resize the coefficient inspector; use Left/Right arrow keys for fine control"),
      onPointerDown: Ii,
      onKeyDown: Ki,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), Gi = (t) => {
    ye(null), ie(t), ht(!0), Ct.some((l) => l.pairKey === t) && ($e.some((l) => l.pairKey === t) || (Ln("all"), es("")), ns(t));
  }, Ft = (t, l = !1) => {
    const m = y ? bn.has(y.pairKey) : !1, h = y ? J.find(({ pairKey: G }) => G === y.pairKey) ?? null : null, g = y ? Et(y.pairKey, y.value) : null, j = y ? Fn(y.pairKey, y.value) : null, S = y ? ji[y.pairKey] : null, L = y ? u.sourceAxisKeys[y.sourceIndex] : "", q = y ? u.receiverAxisKeys[y.receiverIndex] : "", z = y != null && y.interaction && y.interaction !== "self" && y.interaction !== "other" ? 1 : 0, W = y && (ve != null && ve.ready) ? qt({
      coefficient: y.value,
      physicalPrior: z,
      evidence: ve.preview.evidence
    }, u.kind, Oe) : null, Q = y ? ea(F, L, q) : null, Pe = (y == null ? void 0 : y.value) ?? null, be = y ? Y[y.pairKey] : void 0, jn = !!(y && (b == null ? void 0 : b.scientific.kind) === "flow-spillover" && P && Object.keys(Y).length > 0), _e = De.state !== "idle" && De.state !== "error" && De.pairKey === (y == null ? void 0 : y.pairKey) ? De.preview : null, sn = _e ?? (ve != null && ve.ready ? ve.preview : null), rn = [];
    Q !== null && Pe !== null && ((b == null ? void 0 : b.recordType) === "revision" || Q !== Pe) && rn.push({ label: s("Baseline"), value: Q }), Pe !== null && rn.push({ label: s("Installed"), value: Pe }), be !== void 0 && rn.push({ label: s("Staged"), value: be });
    const an = J.findIndex(({ pairKey: G }) => G === he);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${l ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: s("Selected coefficient") }),
          !l && /* @__PURE__ */ e.jsx("span", { children: s(un ? "Hover preview · click to pin this pair." : he ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inspector-actions", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flag-navigation", "aria-label": s("Flagged compensation pair navigation"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Previous flagged compensation pair"),
                disabled: J.length === 0,
                onClick: () => Ns(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: an >= 0 ? s("{current} / {total} flagged", { current: an + 1, total: J.length }) : s("{total} flagged", { total: J.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Next flagged compensation pair"),
                disabled: J.length === 0,
                onClick: () => Ns(1),
                children: "→"
              }
            )
          ] }),
          t && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-inspector-close",
              "aria-label": s("Close global compensation pair details"),
              title: s("Close details and return to the full gallery"),
              onClick: t,
              children: "×"
            }
          )
        ] })
      ] }),
      y ? /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-pair-detail${l ? " is-global" : ""}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pair-route", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
            /* @__PURE__ */ e.jsx("strong", { children: y.source.label }),
            /* @__PURE__ */ e.jsx("small", { children: y.source.pnn })
          ] }),
          /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Receiver") }),
            /* @__PURE__ */ e.jsx("strong", { children: y.receiver.label }),
            /* @__PURE__ */ e.jsx("small", { children: y.receiver.pnn })
          ] })
        ] }),
        W && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${W.category}`,
            title: s(W.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: s(W.label) }),
              /* @__PURE__ */ e.jsx("span", { children: s(W.detail) })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: m,
              disabled: !b || !te.has(u.sourceAxisKeys[y.sourceIndex]) || !te.has(u.receiverAxisKeys[y.receiverIndex]),
              onChange: (G) => Pn(y.pairKey, G.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: s("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: s("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: s("Stored fraction: {value}", { value: ee(y.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: s(Y[y.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(Y[y.pairKey] ?? y.value) ? `${((Y[y.pairKey] ?? y.value) * 100).toFixed(1)}%` : String(Y[y.pairKey] ?? y.value) })
        ] }),
        rn.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": s("Coefficient history"), children: rn.map((G, on) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          on > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: s("Exact fraction: {value}", { value: ee(G.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: G.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (G.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${G.label}:${on}`)) }),
        b && he === y.pairKey && !un && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              Cn,
              {
                step: "0.1",
                value: Un,
                disabled: B,
                onValueChange: (G) => {
                  bt(G), b.scientific.kind === "flow-spillover" && G.trim() !== "" && Number.isFinite(Number(G)) && Kn(y.pairKey, Number(G) / 100);
                }
              }
            )
          ] }),
          b.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: s("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: B || !Number.isFinite(Number(Un)) || Un.trim() === "",
              onClick: () => Kn(y.pairKey, Number(Un) / 100),
              children: s("Stage value")
            }
          ),
          Y[y.pairKey] !== void 0 && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: B,
              onClick: () => {
                Kn(y.pairKey, y.value), Qe((G) => {
                  const on = { ...G };
                  return delete on[y.pairKey], on;
                });
              },
              children: s("Reset")
            }
          )
        ] }),
        jn && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-candidate-status${l ? " is-compact" : ""}`, "aria-label": s("Flow compensation coefficient preview"), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Coefficient preview") }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              s("Original remains fixed; the right panel shows the complete working matrix."),
              l ? s(" The gallery remains installed until Apply.") : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("em", { children: be === void 0 ? s("Working matrix") : `${(y.value * 100).toFixed(1)}% → ${(be * 100).toFixed(1)}%` }),
          De.state === "updating" && De.pairKey === y.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: s("Updating…") }),
          De.state === "error" && De.pairKey === y.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: s(De.message) })
        ] }),
        y.interaction && y.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          s("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: y.interaction })
        ] }),
        l && (sn ? /* @__PURE__ */ e.jsx(
          Bs,
          {
            preview: sn,
            sourceLabel: y.source.label,
            receiverLabel: y.receiver.label,
            kind: u.kind,
            densitySmoothing: Ye,
            compact: !0,
            compensatedTitle: s(_e ? "Candidate" : "Compensated")
          }
        ) : ve && !ve.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(ve.reason) }) : null),
        l && /* @__PURE__ */ e.jsx(
          Ur,
          {
            matrixView: u,
            sourceChannels: oe,
            receiverChannels: de,
            selectedSourceIndex: y.sourceIndex,
            selectedReceiverIndex: y.receiverIndex,
            stagedCoefficients: Y,
            maximumAbsoluteOffDiagonal: vs,
            onSelect: Gi
          }
        ),
        !l && (sn ? /* @__PURE__ */ e.jsx(
          Bs,
          {
            preview: sn,
            sourceLabel: y.source.label,
            receiverLabel: y.receiver.label,
            kind: u.kind,
            densitySmoothing: Ye,
            compensatedTitle: s(_e ? "Candidate" : "Compensated")
          }
        ) : ve && !ve.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(ve.reason) }) : null),
        m && h && g && j && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Sweep bounds") }),
            /* @__PURE__ */ e.jsx("span", { children: s("Four exact candidates will be interpolated across these endpoints.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-inputs", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Lower (%)") }),
              /* @__PURE__ */ e.jsx(
                Cn,
                {
                  step: "0.1",
                  value: g.lowerPercent,
                  disabled: B || le !== null || xe !== null,
                  onValueChange: (G) => Hn(y.pairKey, y.value, "lowerPercent", G)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Upper (%)") }),
              /* @__PURE__ */ e.jsx(
                Cn,
                {
                  step: "0.1",
                  value: g.upperPercent,
                  disabled: B || le !== null || xe !== null,
                  onValueChange: (G) => Hn(y.pairKey, y.value, "upperPercent", G)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: B || le !== null || xe !== null || j.error !== null,
                onClick: () => void Ui(h),
                children: s(xe === y.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          j.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: s(j.error) }) : /* @__PURE__ */ e.jsx("small", { children: s("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(re, Ws).toLocaleString(),
            sweep: Math.min(re, Gs).toLocaleString()
          }) }),
          S && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: S.values.map((G) => /* @__PURE__ */ e.jsx("div", { className: G.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            ct,
            {
              title: `${G.isCurrent ? `${s("Current")} · ` : ""}${(G.value * 100).toFixed(2)}%`,
              panel: G.preview.compensated,
              preview: G.preview,
              sourceLabel: y.source.label,
              receiverLabel: y.receiver.label,
              minimumSize: 145,
              maximumSize: 220,
              densitySmoothing: Ye
            }
          ) }, `${y.pairKey}:bounds:${G.value}:${G.isCurrent}`)) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s(u.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: s("No coefficient selected.") })
    ] });
  }, Cs = (t, l) => /* @__PURE__ */ e.jsx(
    qr,
    {
      dataset: l,
      pair: t,
      plotSize: Mt,
      densitySmoothing: Ye,
      flagged: bn.has(t.pairKey),
      selected: he === t.pairKey,
      onSelect: () => {
        ye(null), ie(t.pairKey), ht(!0);
      },
      onFlag: (m) => Pn(t.pairKey, m)
    },
    t.pairKey
  ), Wi = async (t, l) => {
    if (!(se != null && se.ready) || !u)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const m = us.map((h) => ({
      pairKey: h.pairKey,
      sourceLabel: h.source.label,
      receiverLabel: h.receiver.label,
      coefficient: h.coefficient,
      relationship: h.interaction,
      buildPreview: () => {
        const g = si(
          se.dataset,
          h.source.key,
          h.receiver.key
        );
        if (!g.ready) throw new Error(g.reason);
        return g.preview;
      }
    }));
    await Fr(m, {
      sampleName: i,
      profileName: (b == null ? void 0 : b.name) ?? s(u.title),
      populationName: (X == null ? void 0 : X.name) ?? s("All Events"),
      filterLabel: hs,
      densitySmoothing: Ye,
      densityColorPower: U,
      pointAlpha: Yn
    }, t, l);
  };
  return R ? /* @__PURE__ */ e.jsx(Ht.Provider, { value: U, children: /* @__PURE__ */ e.jsx(Xt.Provider, { value: Yn, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-overview${Ce === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsx("h2", { className: "gl-tab-title", children: s("Compensation") }),
            !K && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: Jn })
          ] }),
          K ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${D.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: s("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: Qn,
                method: Jn,
                count: Tt,
                status: s(D.state === "ready" ? "Ready" : "Unavailable"),
                assay: s(r ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${D.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  s("{kind} compensation installed. Installed compensation profile.", {
                    kind: K.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                /* @__PURE__ */ e.jsx("strong", { children: $i }),
                /* @__PURE__ */ e.jsx("span", { children: s("{method} · {count} ch · {status}", {
                  method: Jn,
                  count: Tt,
                  status: D.state === "ready" ? s("Ready") : s("Unavailable")
                }) }),
                /* @__PURE__ */ e.jsx("em", { children: s(r ? "Comp active" : "Original active") })
              ]
            }
          ) : /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "gl-comp-summary",
              "aria-label": s("Compensation summary"),
              "data-active-layer": r ? "compensated" : "original",
              children: s("{source} · {assay} · {count} channels", {
                source: s(gs),
                assay: s(r ? "Compensated assay active" : "Original assay active"),
                count: Tt
              })
            }
          ),
          K && n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: B,
              onClick: () => {
                var t;
                return (t = jt.current) == null ? void 0 : t.click();
              },
              children: s("Replace matrix…")
            }
          ),
          v !== void 0 && C !== void 0 && $ && /* @__PURE__ */ e.jsxs(
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
                    value: v,
                    disabled: B,
                    onChange: (t) => $(Number(t.currentTarget.value)),
                    children: Array.from({ length: C }, (t, l) => l + 1).map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, t))
                  }
                ),
                /* @__PURE__ */ e.jsxs("small", { children: [
                  "/ ",
                  C
                ] })
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-review-population", children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Review population") }),
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                "aria-label": s("Compensation review population"),
                value: (X == null ? void 0 : X.id) ?? "all",
                disabled: le !== null || xe !== null,
                onChange: (t) => mt(t.currentTarget.value),
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All Events") }),
                  I.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: `${"· ".repeat(t.depth)}${t.name} (${t.eventCount.toLocaleString()})` }, t.id))
                ]
              }
            ),
            /* @__PURE__ */ e.jsx("small", { children: s("{count} events · applies to biplots, attention ranking, and sweeps; membership frozen from the current assay", {
              count: re.toLocaleString()
            }) })
          ] }),
          Ce !== "global" && /* @__PURE__ */ e.jsxs(
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
                    value: String(Wn),
                    disabled: B,
                    onChange: (t) => {
                      const l = t.currentTarget.value;
                      pi(l === "all" ? "all" : Number(l));
                    },
                    children: [
                      Ys.map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: s("{count} events", { count: t.toLocaleString() }) }, t)),
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All available") })
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsx("small", { children: s("Showing {shown} of {total}; Apply always uses all events.", {
                  shown: Tn.length.toLocaleString(),
                  total: re.toLocaleString()
                }) })
              ]
            }
          ),
          Fi && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-global-layer-note", children: s("Assay selection in the top bar applies to every tab.") })
        ] }),
        n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: jt,
            type: "file",
            accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
            className: "gl-sr-only",
            "aria-label": s("Choose CyTOF spillover matrix"),
            onChange: (t) => void Ri(t)
          }
        ),
        as && /* @__PURE__ */ e.jsx("div", { className: os ? "gl-comp-error" : "gl-comp-status", role: os ? "alert" : "status", children: s(as) }),
        n.instrument === "flow" && Z && !K && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-enable-heading", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { id: "comp-flow-enable-heading", children: s("Embedded FCS matrix") }),
            /* @__PURE__ */ e.jsx("span", { children: s("Install this exact matrix as the immutable baseline to edit coefficients and preview their effect.") })
          ] }),
          p && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "checkbox",
                checked: Ve,
                disabled: B,
                onChange: (t) => xn(t.currentTarget.checked)
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
          ] }),
          Te != null && Te.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: Te.error }) : B ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
            ne ? s("Preparing editor… {percent}%", { percent: Math.round(ne.fraction * 100) }) : s("Preparing editor…"),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-btn-ghost",
                disabled: (ne == null ? void 0 : ne.phase) === "cancelling",
                onClick: d,
                children: s((ne == null ? void 0 : ne.phase) === "cancelling" ? "Cancelling…" : "Cancel")
              }
            )
          ] }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-btn",
              disabled: !a || p && !Ve,
              onClick: () => void zi(),
              children: s("Enable matrix editing")
            }
          )
        ] }),
        n.instrument === "cytof" && (!K || H) && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-cytof-import", "aria-labelledby": "comp-cytof-import-heading", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-import-head", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("h3", { id: "comp-cytof-import-heading", children: s("CyTOF spillover matrix") }),
              /* @__PURE__ */ e.jsx("span", { children: s("Linear counts → non-negative least squares → arcsinh display") })
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-import-actions", children: /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: H ? "gl-btn-ghost" : "gl-btn",
                disabled: B,
                onClick: () => {
                  var t;
                  return (t = jt.current) == null ? void 0 : t.click();
                },
                children: s(H ? "Choose another matrix…" : "Import matrix…")
              }
            ) })
          ] }),
          ls && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s(ls) }),
          H && ae && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-body", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-summary", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: H.fileName }),
                /* @__PURE__ */ e.jsx("span", { children: s("{sources} sources × {receivers} receivers", {
                  sources: H.matrix.sourceChannels.length,
                  receivers: H.matrix.receiverChannels.length
                }) })
              ] }),
              /* @__PURE__ */ e.jsxs("dl", { children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Exact matches") }),
                  /* @__PURE__ */ e.jsx("dd", { children: ae.matchedChannels.length })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Included") }),
                  /* @__PURE__ */ e.jsx("dd", { children: ae.includedChannels.length })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Not in FCS") }),
                  /* @__PURE__ */ e.jsx("dd", { children: ae.matrixOnlyChannels.length })
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
                    onClick: () => tn(new Set(ae.matchedChannels)),
                    children: s("All matched")
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-mini-btn",
                    disabled: B,
                    onClick: () => tn(/* @__PURE__ */ new Set()),
                    children: s("None")
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-channel-grid", children: H.matrix.receiverChannels.map((t) => {
              const l = ae.matchedChannels.includes(t);
              return /* @__PURE__ */ e.jsxs("label", { className: l ? "" : "is-unavailable", title: l ? t : s("{channel} is not uniquely present in this FCS file", { channel: t }), children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: An.has(t),
                    disabled: !l || B,
                    onChange: (m) => Oi(t, m.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: Lt(n, t).combined }),
                !l && /* @__PURE__ */ e.jsx("small", { children: s("not matched") })
              ] }, t);
            }) }),
            (H.validationWarnings.length > 0 || ae.warnings.length > 0) && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: /* @__PURE__ */ e.jsx("span", { children: s("{count} review items: {messages}", {
              count: H.validationWarnings.length + ae.warnings.length,
              messages: [
                ...H.validationWarnings.map(({ message: t }) => t),
                ...ae.warnings.map(({ message: t }) => t)
              ].map((t) => s(t)).join(" ")
            }) }) }),
            ae.blockers.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: ae.blockers.map(({ message: t }) => s(t)).join(" ") }),
            p && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: Ve,
                  disabled: B,
                  onChange: (t) => xn(t.currentTarget.checked)
                }
              ),
              /* @__PURE__ */ e.jsx("span", { children: s("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                /* @__PURE__ */ e.jsx("span", { children: B ? ne ? s("{phase}… {percent}% ({processed} / {total} events)", {
                  phase: s(ne.phase === "cancelling" ? "Cancelling" : ne.phase === "preparing" ? "Preparing" : "Applying"),
                  percent: Math.round(ne.fraction * 100),
                  processed: ne.processedEvents.toLocaleString(),
                  total: ne.totalEvents.toLocaleString()
                }) : s("Preparing compensation…") : s("The Original assay is retained and can be restored at any time.") }),
                /* @__PURE__ */ e.jsx("strong", { className: We === 0 ? "is-empty" : void 0, children: We === 0 ? s("No FCS files are checked. Select at least one file in Samples.") : s("Applies atomically to {files} checked FCS files · {events} total events", {
                  files: We,
                  events: Ei.toLocaleString()
                }) })
              ] }),
              B ? /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn-ghost",
                  disabled: (ne == null ? void 0 : ne.phase) === "cancelling",
                  onClick: d,
                  children: s((ne == null ? void 0 : ne.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                }
              ) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: !a || We === 0 || !ae.canApply || p && !Ve,
                  onClick: () => void Di(),
                  children: s("Apply NNLS compensation")
                }
              )
            ] }),
            o.length > 0 && c && /* @__PURE__ */ e.jsxs(
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
                        value: (Ze == null ? void 0 : Ze.id) ?? "",
                        disabled: B,
                        onChange: (t) => {
                          cs(t.currentTarget.value), Bn(!1);
                        },
                        children: o.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.label === t.id ? t.id : `${t.label} (${t.id})` }, t.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-adopt-confirm", children: [
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: yt,
                        disabled: B,
                        onChange: (t) => Bn(t.currentTarget.checked)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { children: s("I confirm this assay was computed from the selected source assay using this exact matrix and channel set.") })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-btn-ghost",
                      disabled: B || !Ze || !yt || We === 0 || !ae.canApply || p && !Ve,
                      onClick: () => void Li(),
                      children: s("Use existing assay — no recomputation")
                    }
                  )
                ]
              }
            )
          ] })
        ] }),
        fs && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
        ms.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
          /* @__PURE__ */ e.jsx("span", { children: s("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
            count: ms.length
          }) }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Jt((t) => ({ ...t, review: !0 })), children: s("Review details") })
        ] }),
        K && D.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
        u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-workspace-tabs", role: "tablist", "aria-label": s("Compensation workspace"), children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": Ce === "matrix",
              className: Ce === "matrix" ? "active" : void 0,
              onClick: () => {
                ye(null), Dn("matrix");
              },
              children: s("Matrix")
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": Ce === "global",
              className: Ce === "global" ? "active" : void 0,
              onClick: () => {
                ye(null), Dn("global");
              },
              children: s("Global inspector")
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": Ce === "attention",
              className: Ce === "attention" ? "active" : void 0,
              onClick: () => {
                ye(null), Dn("attention");
              },
              children: [
                s("Flagged"),
                J.length > 0 ? ` (${J.length})` : ""
              ]
            }
          ),
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
                    value: Ye,
                    "aria-label": s("Compensation biplot density smoothing"),
                    onChange: (t) => di(Number(t.currentTarget.value))
                  }
                ),
                /* @__PURE__ */ e.jsx("output", { children: Ye })
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
                    value: Yn,
                    "aria-label": s("Compensation biplot point alpha"),
                    onChange: (t) => hi(Number(t.currentTarget.value))
                  }
                ),
                /* @__PURE__ */ e.jsx("output", { children: Yn.toFixed(2) })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            tr,
            {
              className: "gl-comp-density-colour",
              value: U,
              onChange: V
            }
          ),
          Object.keys(Y).length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              s("{count} pending edits", { count: Object.keys(Y).length }),
              (b == null ? void 0 : b.scientific.kind) === "cytof-spillover" ? ` · ${s("{files} checked FCS files", { files: We })}` : ""
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: B,
                onClick: () => {
                  _n({}), Qe({}), ue(null);
                },
                children: s("Discard")
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-btn",
                disabled: B || le !== null || xe !== null || !a || (b == null ? void 0 : b.scientific.kind) === "cytof-spillover" && We === 0,
                onClick: () => void Bi(),
                children: s("Apply revised matrix")
              }
            )
          ] })
        ] }),
        u && Ce === "matrix" ? /* @__PURE__ */ e.jsxs(
          "div",
          {
            ref: vn,
            className: "gl-comp-common-path",
            style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${hn}px` },
            children: [
              /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrix-panel", "aria-labelledby": "comp-matrix-heading", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-matrix-head", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h3", { id: "comp-matrix-heading", children: s(u.title) }),
                    /* @__PURE__ */ e.jsx("span", { children: s(u.subtitle) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-head-actions", children: [
                    et && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-inline-edit-note", children: s("Edit cells directly (%)") }),
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
                        onClick: () => is(!0),
                        children: s("Export CSV…")
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-scroll", children: /* @__PURE__ */ e.jsxs(
                  "div",
                  {
                    className: `gl-comp-matrix-stage${et ? " is-flow-inline" : ""}`,
                    style: {
                      width: 112 + u.receiverAxisKeys.length * In
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
                                gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${In}px)`
                              },
                              children: de.map((t, l) => /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  className: (y == null ? void 0 : y.receiverIndex) === l ? "is-selected" : void 0,
                                  title: t.combined,
                                  children: /* @__PURE__ */ e.jsx("span", { children: t.pnn })
                                },
                                u.receiverAxisKeys[l]
                              ))
                            }
                          ),
                          /* @__PURE__ */ e.jsx(
                            "div",
                            {
                              className: "gl-comp-row-labels",
                              "aria-label": s("Source channel labels"),
                              style: {
                                gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${In}px)`
                              },
                              children: oe.map((t, l) => /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  className: (y == null ? void 0 : y.sourceIndex) === l ? "is-selected" : void 0,
                                  title: t.combined,
                                  children: t.pnn
                                },
                                u.sourceAxisKeys[l]
                              ))
                            }
                          ),
                          /* @__PURE__ */ e.jsx(
                            "div",
                            {
                              ref: ds,
                              className: "gl-comp-matrix shows-values",
                              role: "grid",
                              "aria-label": s("Compensation matrix; source rows and receiver columns"),
                              "aria-rowcount": u.sourceAxisKeys.length,
                              "aria-colcount": u.receiverAxisKeys.length,
                              style: {
                                gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${In}px)`,
                                gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${In}px)`
                              },
                              children: u.matrix.map((t, l) => /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  role: "row",
                                  className: "gl-comp-matrix-row",
                                  "aria-rowindex": l + 1,
                                  children: t.map((m, h) => {
                                    const g = u.sourceAxisKeys[l], j = u.receiverAxisKeys[h], S = `${g}${Ie}${j}`, L = Y[S], q = L ?? m, z = g === j, W = (y == null ? void 0 : y.sourceIndex) === l && y.receiverIndex === h, Q = (y == null ? void 0 : y.sourceIndex) === l, Pe = (y == null ? void 0 : y.receiverIndex) === h, be = oe[l], jn = de[h], _e = u.kind === "cytof" ? wn(g, j) : null, sn = Lr(
                                      q,
                                      vs,
                                      z
                                    ), rn = u.receiverAxisKeys.findIndex((pe) => pe !== g), an = he === S, G = he === null && l === 0 && h === rn, on = Number.isFinite(q) ? q === 0 ? "" : (q * 100).toFixed(1) : String(q), Es = _e && _e !== "other" && _e !== "self" ? ` · ${_e}` : "", Zi = bi[S] ?? Js(q);
                                    return et && !z ? /* @__PURE__ */ e.jsx(
                                      Cn,
                                      {
                                        role: "gridcell",
                                        className: `gl-comp-cell gl-comp-cell-input${W ? " selected" : ""}${an ? " is-pinned" : ""}${L === void 0 ? "" : " is-staged"}${Q ? " is-selected-source" : ""}${Pe ? " is-selected-receiver" : ""}`,
                                        min: "0",
                                        step: "0.1",
                                        value: Zi,
                                        disabled: B,
                                        "data-source-index": l,
                                        "data-receiver-index": h,
                                        "aria-colindex": h + 1,
                                        "aria-selected": an,
                                        "aria-label": s("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                          source: be.combined,
                                          receiver: jn.combined,
                                          pending: L === void 0 ? "" : s(", pending edit")
                                        }),
                                        title: s("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                          source: be.combined,
                                          receiver: jn.combined,
                                          pending: L === void 0 ? "" : s(" · pending edit")
                                        }),
                                        style: sn,
                                        onFocus: () => ie(S),
                                        onMouseEnter: () => ye(S),
                                        onMouseLeave: () => ye((pe) => pe === S ? null : pe),
                                        onClick: () => ie(S),
                                        onValueChange: (pe) => {
                                          ie(S), Qe((Rn) => ({ ...Rn, [S]: pe })), pe.trim() !== "" && Number.isFinite(Number(pe)) && Kn(S, Number(pe) / 100);
                                        },
                                        onBlur: (pe) => {
                                          const Rn = pe.currentTarget.value;
                                          if (Rn.trim() === "" || !Number.isFinite(Number(Rn))) {
                                            Qe((Pt) => {
                                              const ks = { ...Pt };
                                              return delete ks[S], ks;
                                            });
                                            return;
                                          }
                                          Qe((Pt) => ({
                                            ...Pt,
                                            [S]: Js(Number(Rn) / 100)
                                          }));
                                        }
                                      },
                                      j
                                    ) : /* @__PURE__ */ e.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        role: "gridcell",
                                        className: `gl-comp-cell${z ? " diagonal" : ""}${W ? " selected" : ""}${an ? " is-pinned" : ""}${L === void 0 ? "" : " is-staged"}${Q ? " is-selected-source" : ""}${Pe ? " is-selected-receiver" : ""}`,
                                        disabled: z,
                                        tabIndex: z ? -1 : W || G ? 0 : -1,
                                        "data-source-index": l,
                                        "data-receiver-index": h,
                                        "data-interaction": _e ?? void 0,
                                        "aria-colindex": h + 1,
                                        "aria-pressed": z ? void 0 : an,
                                        "aria-label": z ? s("{channel} diagonal: {value}", { channel: be.combined, value: Xe(q) }) : s("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                          source: be.combined,
                                          receiver: jn.combined,
                                          value: Xe(q),
                                          pending: L === void 0 ? "" : s(" (pending edit)"),
                                          interaction: Es
                                        }),
                                        title: z ? `${be.combined} · self · ${Xe(q)}` : `${be.combined} → ${jn.combined} · ${Xe(q)}${L === void 0 ? "" : " · pending edit"}${Es}`,
                                        style: sn,
                                        onFocus: () => {
                                          z || ie(S);
                                        },
                                        onMouseEnter: () => {
                                          z || ye(S);
                                        },
                                        onMouseLeave: () => ye((pe) => pe === S ? null : pe),
                                        onClick: () => ie(S),
                                        onKeyDown: (pe) => _i(pe, l, h),
                                        children: /* @__PURE__ */ e.jsx("span", { children: on })
                                      },
                                      j
                                    );
                                  })
                                },
                                u.sourceAxisKeys[l]
                              ))
                            }
                          )
                        ] })
                      ] })
                    ]
                  }
                ) })
              ] }),
              $t(),
              Ft()
            ]
          }
        ) : u && Ce === "global" ? /* @__PURE__ */ e.jsxs(
          "div",
          {
            ref: vn,
            className: `gl-comp-common-path gl-comp-global-path${En ? " has-details" : ""}`,
            style: {
              gridTemplateColumns: En ? `minmax(440px, 1fr) 8px ${hn}px` : "minmax(0, 1fr)"
            },
            children: [
              /* @__PURE__ */ e.jsx(
                Vr,
                {
                  stateKey: O,
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
                        value: ke,
                        onChange: (t) => Ln(t.currentTarget.value),
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
                        value: Ae,
                        onChange: (t) => ai(t.currentTarget.value),
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
                        value: Mn,
                        placeholder: s("Find channel…"),
                        "aria-label": s("Search global compensation pairs"),
                        onChange: (t) => es(t.currentTarget.value)
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
                          value: Mt,
                          "aria-label": s("Global compensation plot size"),
                          onChange: (t) => li(Number(t.currentTarget.value))
                        }
                      ),
                      /* @__PURE__ */ e.jsx("output", { children: s("{size}px", { size: Mt }) })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-mini-btn gl-comp-global-export",
                        disabled: !(se != null && se.ready) || $e.length === 0,
                        title: s("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                        onClick: () => rs(!0),
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
                          shown: Nt.length.toLocaleString(),
                          total: re.toLocaleString(),
                          population: (X == null ? void 0 : X.name) ?? s("All Events")
                        })
                      }
                    )
                  ] }),
                  children: se ? se.ready ? $e.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No pairs match the current filter. Choose another filter or clear the channel search.") }) : Ae === "compact" ? /* @__PURE__ */ e.jsx(
                    "div",
                    {
                      className: "gl-comp-global-gallery",
                      "data-event-signature": se.dataset.eventSignature,
                      children: $e.map((t) => Cs(t, se.dataset))
                    }
                  ) : /* @__PURE__ */ e.jsx(
                    "div",
                    {
                      className: "gl-comp-global-groups",
                      "data-event-signature": se.dataset.eventSignature,
                      "data-layout": Ae,
                      children: St.map((t) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                        /* @__PURE__ */ e.jsxs("header", { children: [
                          /* @__PURE__ */ e.jsx("span", { children: s(Ae === "source" ? "Source channel" : "Receiver") }),
                          /* @__PURE__ */ e.jsx("strong", { title: t.channel.combined, children: t.channel.label }),
                          /* @__PURE__ */ e.jsx("small", { children: t.channel.pnn }),
                          /* @__PURE__ */ e.jsx("em", { children: s("{count} pairs", { count: t.pairs.length }) })
                        ] }),
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: t.pairs.map((l) => Cs(l, se.dataset)) })
                      ] }, t.channel.key))
                    }
                  ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s(se.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No matrix is available for the global inspector.") })
                }
              ),
              En && $t(),
              En && Ft(() => ht(!1), !0)
            ]
          }
        ) : u ? /* @__PURE__ */ e.jsxs(
          "div",
          {
            ref: vn,
            className: "gl-comp-common-path",
            style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${hn}px` },
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
                          value: ft,
                          disabled: le !== null || xe !== null,
                          onChange: (t) => gt(Number(t.currentTarget.value)),
                          children: Array.from({ length: Hs }, (t, l) => l + 1).map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, t))
                        }
                      )
                    ] }),
                    le ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: Vi, children: s("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn",
                        disabled: !b || !T || Fe.length === 0 || kt > 0 || B || xe !== null,
                        onClick: () => void qi(),
                        children: s("Run four-value sweeps ({count})", { count: Fe.length })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-scope", children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Suggestions computed for {population} from up to {count} frozen events.", {
                    population: (X == null ? void 0 : X.name) ?? s("All Events"),
                    count: Math.min(re, $n.length).toLocaleString()
                  }) }),
                  /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-evidence-mode", children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Evidence mode") }),
                    /* @__PURE__ */ e.jsxs(
                      "select",
                      {
                        "aria-label": s("Compensation evidence mode"),
                        value: Oe,
                        disabled: B || le !== null || xe !== null,
                        onChange: (t) => {
                          fi(t.currentTarget.value), vt((l) => l + 1), Ue({}), nn({}), ge(null);
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
                      disabled: B || le !== null || xe !== null,
                      onClick: () => {
                        vt((t) => t + 1), Ue({}), nn({}), ge(null), Le(!1), ue(
                          s(J.length === 1 ? "Recomputed compensation suggestions for {population}. {count} flagged pair was retained." : "Recomputed compensation suggestions for {population}. {count} flagged pairs were retained.", {
                            population: (X == null ? void 0 : X.name) ?? s("All Events"),
                            count: J.length
                          })
                        );
                      },
                      children: s("Recompute suggestions")
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("small", { children: [
                    s(Oe === "biological" ? "Broad positive association is excluded because co-expression and cell size can mimic spill. High-tail shapes remain control-sensitive review prompts." : "Positive residual association may enter the shortlist only because you declared suitable control data."),
                    " ",
                    s("Sweep workers are separate from full-Apply workers.")
                  ] })
                ] }),
                le && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-progress", role: "status", "aria-live": "polite", children: [
                  /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, le.total), value: le.completed }),
                  /* @__PURE__ */ e.jsx("span", { children: s("{completed} / {total} exact candidate solves · {workers} workers", {
                    completed: le.completed,
                    total: le.total,
                    workers: ft
                  }) })
                ] }),
                ss && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s(ss) }),
                b ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": s("Add compensation pair for follow-up"), children: [
                    /* @__PURE__ */ e.jsx("strong", { children: s("Add a pair") }),
                    /* @__PURE__ */ e.jsxs("label", { children: [
                      /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": s("Follow-up source channel"),
                          value: Se,
                          onChange: (t) => {
                            const l = t.currentTarget.value;
                            ts(l), je === l && xt(u.receiverAxisKeys.find((m) => m !== l && te.has(m)) ?? "");
                          },
                          children: u.sourceAxisKeys.map((t, l) => te.has(t) ? /* @__PURE__ */ e.jsx("option", { value: t, children: oe[l].combined }, t) : null)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
                    /* @__PURE__ */ e.jsxs("label", { children: [
                      /* @__PURE__ */ e.jsx("span", { children: s("Receiver") }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": s("Follow-up receiver channel"),
                          value: je,
                          onChange: (t) => xt(t.currentTarget.value),
                          children: u.receiverAxisKeys.map((t, l) => t !== Se && te.has(t) ? /* @__PURE__ */ e.jsx("option", { value: t, children: de[l].combined }, t) : null)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-mini-btn",
                        disabled: !Se || !je || Se === je,
                        onClick: ki,
                        children: s("Flag for follow-up")
                      }
                    )
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flagged-columns", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section", children: [
                      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                        /* @__PURE__ */ e.jsx("h4", { children: s("Flagged by you ({count})", { count: Fe.length }) }),
                        /* @__PURE__ */ e.jsx("span", { children: s("Only these pairs are included when you run sweeps.") })
                      ] }) }),
                      Fe.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pairs are flagged yet. Tick “Flag for follow-up” in the inspector, add a pair above, or accept a suggestion below.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-list", children: Fe.map((t, l) => {
                        const m = yi[t.pairKey], h = wi === t.pairKey, g = Fn(t.pairKey, t.coefficient), j = Et(t.pairKey, t.coefficient);
                        return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${he === t.pairKey ? " is-selected" : ""}`, children: [
                          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                            /* @__PURE__ */ e.jsxs(
                              "button",
                              {
                                type: "button",
                                className: "gl-comp-sweep-pair-head",
                                "aria-expanded": h,
                                onClick: () => {
                                  ie(t.pairKey), kn(h ? null : t.pairKey);
                                },
                                children: [
                                  /* @__PURE__ */ e.jsx("span", { className: "gl-comp-sweep-rank", children: l + 1 }),
                                  /* @__PURE__ */ e.jsxs("span", { children: [
                                    /* @__PURE__ */ e.jsxs("strong", { children: [
                                      t.source.label,
                                      " → ",
                                      t.receiver.label
                                    ] }),
                                    /* @__PURE__ */ e.jsxs("small", { children: [
                                      t.interaction && t.interaction !== "other" ? `${t.interaction} · ` : "",
                                      s("installed {value}%", { value: (t.coefficient * 100).toFixed(1) })
                                    ] })
                                  ] }),
                                  /* @__PURE__ */ e.jsx("span", { children: t.evidence.status === "ready" ? s("shift {shift} MAD · slope {slope}", {
                                    shift: ee(t.evidence.normalizedNegativeShift ?? 0, 3),
                                    slope: ee(t.evidence.residualSlope ?? 0, 4)
                                  }) : s("visual review · residual groups insufficient") }),
                                  /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: h ? "▾" : "▸" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ e.jsx("label", { className: "gl-comp-followup-list-toggle", title: s("Remove from follow-up queue"), children: /* @__PURE__ */ e.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: !0,
                                "aria-label": s("Flag {source} to {receiver} for follow-up", {
                                  source: t.source.label,
                                  receiver: t.receiver.label
                                }),
                                onChange: (S) => Pn(t.pairKey, S.currentTarget.checked)
                              }
                            ) })
                          ] }),
                          h && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-body", children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inline-bounds", children: [
                              /* @__PURE__ */ e.jsx("span", { children: s("Four values across") }),
                              /* @__PURE__ */ e.jsxs("label", { children: [
                                s("Lower (%)"),
                                /* @__PURE__ */ e.jsx(Cn, { step: "0.1", value: j.lowerPercent, disabled: B || le !== null || xe !== null, onValueChange: (S) => Hn(t.pairKey, t.coefficient, "lowerPercent", S) })
                              ] }),
                              /* @__PURE__ */ e.jsx("span", { children: s("to") }),
                              /* @__PURE__ */ e.jsxs("label", { children: [
                                s("Upper (%)"),
                                /* @__PURE__ */ e.jsx(Cn, { step: "0.1", value: j.upperPercent, disabled: B || le !== null || xe !== null, onValueChange: (S) => Hn(t.pairKey, t.coefficient, "upperPercent", S) })
                              ] }),
                              g.error && /* @__PURE__ */ e.jsx("small", { children: s(g.error) })
                            ] }),
                            m ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: m.values.map((S) => /* @__PURE__ */ e.jsxs(
                              "div",
                              {
                                className: `gl-comp-sweep-value${S.isCurrent ? " is-current" : ""}${Y[t.pairKey] === S.value ? " is-staged" : ""}`,
                                children: [
                                  /* @__PURE__ */ e.jsx(
                                    ct,
                                    {
                                      title: `${S.isCurrent ? `${s("Current")} · ` : ""}${(S.value * 100).toFixed(2)}%`,
                                      panel: S.preview.compensated,
                                      preview: S.preview,
                                      sourceLabel: t.source.label,
                                      receiverLabel: t.receiver.label,
                                      minimumSize: 150,
                                      maximumSize: 230,
                                      densitySmoothing: Ye
                                    }
                                  ),
                                  /* @__PURE__ */ e.jsxs("dl", { children: [
                                    /* @__PURE__ */ e.jsxs("div", { children: [
                                      /* @__PURE__ */ e.jsx("dt", { children: s("Shift") }),
                                      /* @__PURE__ */ e.jsx("dd", { children: s("{value} MAD", { value: ee(S.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                    ] }),
                                    /* @__PURE__ */ e.jsxs("div", { children: [
                                      /* @__PURE__ */ e.jsx("dt", { children: s("Slope") }),
                                      /* @__PURE__ */ e.jsx("dd", { children: ee(S.preview.evidence.residualSlope ?? 0, 4) })
                                    ] }),
                                    u.kind === "cytof" && /* @__PURE__ */ e.jsxs("div", { children: [
                                      /* @__PURE__ */ e.jsx("dt", { children: s("Receiver zero") }),
                                      /* @__PURE__ */ e.jsxs("dd", { children: [
                                        (S.preview.compensated.zeroPile.receiver / Math.max(1, S.preview.eventCount) * 100).toFixed(1),
                                        "%"
                                      ] })
                                    ] })
                                  ] }),
                                  /* @__PURE__ */ e.jsx(
                                    "button",
                                    {
                                      type: "button",
                                      className: "gl-mini-btn",
                                      disabled: B || S.isCurrent,
                                      onClick: () => Kn(t.pairKey, S.value),
                                      children: s(S.isCurrent ? "Installed" : Y[t.pairKey] === S.value ? "Staged" : "Use this value")
                                    }
                                  )
                                ]
                              },
                              `${t.pairKey}:${S.value}:${S.isCurrent}`
                            )) }) : /* @__PURE__ */ e.jsx("p", { children: s("Set or fast-preview the endpoints in the inspector, then run the four-value exact sweep. Panels use the same events and locked axes.") })
                          ] })
                        ] }, t.pairKey);
                      }) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section gl-comp-suggestions", children: [
                      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                        /* @__PURE__ */ e.jsxs("h4", { children: [
                          s(Oe === "biological" ? "Conservative suggestions" : "Control-data suggestions"),
                          " (",
                          Ne.items.length,
                          ")"
                        ] }),
                        /* @__PURE__ */ e.jsx("span", { children: s("{evaluable} evaluable of {screened} screened pairs for {population}. Inspect before flagging.", {
                          evaluable: Ne.evaluableCount.toLocaleString(),
                          screened: Ne.screenedCount.toLocaleString(),
                          population: (X == null ? void 0 : X.name) ?? s("All Events")
                        }) })
                      ] }) }),
                      Ne.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: Ne.items.map((t) => {
                        const l = qt(t, u.kind, Oe);
                        return /* @__PURE__ */ e.jsxs("article", { className: bn.has(t.pairKey) ? "is-flagged" : void 0, children: [
                          /* @__PURE__ */ e.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => ie(t.pairKey),
                              children: [
                                /* @__PURE__ */ e.jsxs("strong", { children: [
                                  t.source.label,
                                  " → ",
                                  t.receiver.label
                                ] }),
                                /* @__PURE__ */ e.jsx("em", { className: `gl-comp-suggestion-badge is-${l.category}`, children: s(l.label) }),
                                /* @__PURE__ */ e.jsxs("span", { children: [
                                  t.interaction && t.interaction !== "other" ? `${t.interaction} · ` : "",
                                  s("{coefficient}% · shift {shift} MAD · slope {slope}", {
                                    coefficient: (t.coefficient * 100).toFixed(1),
                                    shift: ee(t.evidence.normalizedNegativeShift ?? 0, 3),
                                    slope: ee(t.evidence.residualSlope ?? 0, 4)
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
                                checked: bn.has(t.pairKey),
                                "aria-label": s("Flag suggested {source} to {receiver} for follow-up", {
                                  source: t.source.label,
                                  receiver: t.receiver.label
                                }),
                                onChange: (m) => Pn(t.pairKey, m.currentTarget.checked)
                              }
                            ),
                            /* @__PURE__ */ e.jsx("span", { children: s("Follow up") })
                          ] })
                        ] }, t.pairKey);
                      }) })
                    ] })
                  ] })
                ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("Install a profile-derived compensation layer before curating or sweeping pairs. The embedded FCS matrix remains inspectable in the Matrix view.") })
              ] }),
              $t(),
              Ft()
            ]
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: s(K ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : n.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
        (u || K) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": s("Advanced compensation tools"), children: [
          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: Gr.map(({ id: t, label: l }) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              id: `comp-drawer-${t}-button`,
              className: "gl-comp-drawer-toggle",
              "aria-expanded": Je[t],
              "aria-controls": `comp-drawer-${t}`,
              onClick: () => Pi(t),
              children: [
                /* @__PURE__ */ e.jsxs("span", { children: [
                  s(l),
                  t === "review" && Xn.length > 0 ? ` (${Xn.length})` : ""
                ] }),
                /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: Je[t] ? "▾" : "▸" })
              ]
            },
            t
          )) }),
          Je.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Matrix evidence") }),
            K ? b ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-evidence-grid", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Profile ID") }),
                  /* @__PURE__ */ e.jsx("dd", { children: b.profileId })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Created") }),
                  /* @__PURE__ */ e.jsx("dd", { children: new Date(b.createdAt).toLocaleString() })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Matrix source") }),
                  /* @__PURE__ */ e.jsx("dd", { children: ia(b, s) })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Orientation") }),
                  /* @__PURE__ */ e.jsx("dd", { children: s("Source rows → receiver columns") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Imported dimensions") }),
                  /* @__PURE__ */ e.jsx("dd", { children: s("{sources} sources × {receivers} receivers", {
                    sources: b.scientific.matrix.sourceChannels.length,
                    receivers: b.scientific.matrix.receiverChannels.length
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Applied solve") }),
                  /* @__PURE__ */ e.jsx("dd", { children: s("{count} exact $PnN channels · {status}", {
                    count: K.includedPnns.length,
                    status: D.state
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Matrix hash") }),
                  /* @__PURE__ */ e.jsxs("dd", { title: b.matrixHash, children: [
                    b.matrixHash.slice(0, 19),
                    "…"
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Profile hash") }),
                  /* @__PURE__ */ e.jsxs("dd", { title: b.profileHash, children: [
                    b.profileHash.slice(0, 19),
                    "…"
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Provenance") }),
                  /* @__PURE__ */ e.jsx("dd", { children: s(((Ss = b.provenance) == null ? void 0 : Ss.sourceDescription) ?? "No additional source note supplied") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Estimation") }),
                  /* @__PURE__ */ e.jsx("dd", { children: s(((Ms = b.provenance) == null ? void 0 : Ms.estimationMethod) ?? "Imported coefficients preserved exactly") })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-method-card", "aria-label": s("Installed compensation method"), children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Pipeline") }),
                  /* @__PURE__ */ e.jsx("strong", { children: s(b.scientific.kind === "cytof-spillover" ? "Original counts → NNLS → Compensated counts → arcsinh display" : "Original values → linear matrix inverse → Compensated values → display transform") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Solver") }),
                  /* @__PURE__ */ e.jsx("strong", { children: b.scientific.solverVersion }),
                  /* @__PURE__ */ e.jsx("small", { children: b.scientific.solverSettings.map(({ key: t, value: l }) => `${t}=${String(l)}`).join(" · ") })
                ] })
              ] }),
              Ee && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": s("Original versus Compensated preview"), children: [
                /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("h4", { children: s("Original → Compensated impact") }),
                  /* @__PURE__ */ e.jsx("span", { children: s("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                    events: Ee.previewEvents.toLocaleString(),
                    channels: K.includedPnns.length
                  }) })
                ] }) }),
                /* @__PURE__ */ e.jsxs("dl", { children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Values changed") }),
                    /* @__PURE__ */ e.jsxs("dd", { children: [
                      Ee.changedValues.toLocaleString(),
                      " / ",
                      Ee.comparedValues.toLocaleString(),
                      " (",
                      Xe(Ee.changedValues / Ee.comparedValues, !1, 4),
                      ")"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Median |Δ|") }),
                    /* @__PURE__ */ e.jsx("dd", { children: ee(Ee.medianAbsoluteDelta, 5) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Maximum |Δ|") }),
                    /* @__PURE__ */ e.jsx("dd", { children: ee(Ee.maxAbsoluteDelta, 5) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Largest median shift") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: Ee.mostChangedChannel, children: [
                      Ee.mostChangedChannel,
                      " · ",
                      ee(Ee.mostChangedChannelMedianDelta, 5)
                    ] })
                  ] }),
                  K.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Negative → zero") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{count} preview values", { count: Ee.zeroedNegativeValues.toLocaleString() }) })
                  ] })
                ] })
              ] })
            ] }) : /* @__PURE__ */ e.jsx("p", { children: s("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
              profile: K.profileId,
              method: Jn,
              count: K.includedPnns.length,
              status: D.state
            }) }) : /* @__PURE__ */ e.jsx("p", { children: s("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
              channels: Z.channels.length,
              warnings: At.length || s("no")
            }) })
          ] }),
          Je.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Review queue") }),
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
              /* @__PURE__ */ e.jsx("h4", { children: s("Matrix integrity") }),
              Xn.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: Xn.map((t) => /* @__PURE__ */ e.jsx("li", { children: s(t) }, t)) }) : /* @__PURE__ */ e.jsx("p", { children: s("No matrix-level items currently require review.") })
            ] }),
            D.state === "ready" && u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
              /* @__PURE__ */ e.jsx("h4", { children: s("Residual-evidence shortlist") }),
              /* @__PURE__ */ e.jsx("p", { children: s("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                screened: Ne.screenedCount.toLocaleString(),
                candidateSuffix: Ne.candidateCount > Ne.screenedCount ? s(" of {count}", { count: Ne.candidateCount.toLocaleString() }) : "",
                zeroSuffix: u.kind === "cytof" ? s(", and new exact-zero pile") : "",
                modeNote: s(Oe === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
              }) }),
              Ne.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: Ne.items.map((t) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => js(t.sourceIndex, t.receiverIndex),
                  children: [
                    /* @__PURE__ */ e.jsxs("span", { children: [
                      /* @__PURE__ */ e.jsxs("strong", { children: [
                        t.source.label,
                        " → ",
                        t.receiver.label
                      ] }),
                      /* @__PURE__ */ e.jsxs("small", { children: [
                        t.interaction && t.interaction !== "other" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                          t.interaction,
                          " · "
                        ] }) : null,
                        s("matrix {value}%", { value: (t.coefficient * 100).toFixed(1) })
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsxs("span", { children: [
                      s("shift {shift} MAD · slope {slope}", {
                        shift: ee(t.evidence.normalizedNegativeShift ?? 0, 3),
                        slope: ee(t.evidence.residualSlope ?? 0, 4)
                      }),
                      u.kind === "cytof" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                        " ",
                        s("· zero Δ {value} pp", { value: `${t.evidence.receiverZeroDeltaFraction >= 0 ? "+" : ""}${(t.evidence.receiverZeroDeltaFraction * 100).toFixed(1)}` })
                      ] }) : null
                    ] })
                  ]
                },
                t.pairKey
              )) }) : /* @__PURE__ */ e.jsx("p", { children: s("No pair had enough source-high, source-low, and receiver-negative events for this conservative screen. Visual inspection remains available from the matrix.") })
            ] })
          ] })
        ] }),
        Ni && u && /* @__PURE__ */ e.jsx(
          Dr,
          {
            profileLabel: (b == null ? void 0 : b.name) ?? "embedded_FCS",
            installedLabel: s(b ? "Installed matrix" : "Embedded FCS matrix"),
            installedMatrix: {
              sourceChannels: u.sourceAxisKeys,
              receiverChannels: u.receiverAxisKeys,
              matrix: u.matrix
            },
            workingMatrix: Ai,
            pendingEditCount: Object.keys(Y).length,
            onClose: () => is(!1)
          }
        ),
        Ci && /* @__PURE__ */ e.jsx(
          Ir,
          {
            sampleName: i,
            populationName: (X == null ? void 0 : X.name) ?? s("All Events"),
            filterLabel: hs,
            pairCount: us.length,
            onExport: Wi,
            onClose: () => rs(!1)
          }
        )
      ]
    }
  ) }) }) : /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab",
      style: { display: "none" },
      "aria-hidden": "true",
      "data-compensation-dormant": "true"
    }
  );
}
function aa(n, i) {
  const r = n.visible !== !1, a = i.visible !== !1;
  return r || a ? !1 : n.sample === i.sample && n.stateKey === i.stateKey;
}
const ca = M.memo(ra, aa);
export {
  ca as CompensationTab
};
