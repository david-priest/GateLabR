var Js = Object.defineProperty;
var Qs = (n, s, r) => s in n ? Js(n, s, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[s] = r;
var st = (n, s, r) => Qs(n, typeof s != "symbol" ? s + "" : s, r);
import { D as Xt, r as er, l as nr, s as tr, z as ir, u as Le, a as M, j as e, b as me, c as ne, p as en, v as qt, d as sr, e as rr, f as ar, g as Pi, h as or, F as lr, i as cr, k as dr, C as ur, m as hr } from "./embed-ON0qzK9R.js";
class fe extends Error {
  constructor(r, a, o = {}) {
    super(a);
    st(this, "code");
    st(this, "row");
    st(this, "column");
    this.name = "CompensationMatrixTableError", this.code = r, this.row = o.row, this.column = o.column;
  }
}
const pr = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
function Vt(n) {
  return n.trim().normalize("NFC");
}
function mr(n) {
  const s = Vt(n).toLowerCase();
  return s === "" || s === "x" || s === "row.names" || s === "channel" || s === "source";
}
function fr(n) {
  return n === "csv" ? "," : "	";
}
function gr(n) {
  let s = 0, r = 0, a = !1, o = !1, c = 1;
  const d = () => {
    if (s > 0 && r > 0)
      throw new fe(
        "ambiguous-delimiter",
        "The matrix header mixes comma and tab delimiters. Choose CSV or TSV explicitly.",
        { row: c }
      );
    if (s === 0 && r === 0)
      throw new fe(
        "missing-delimiter",
        "The matrix header must contain comma-separated or tab-separated columns.",
        { row: c }
      );
    return r > 0 ? "tsv" : "csv";
  };
  for (let m = 0; m < n.length; m++) {
    const g = n[m];
    if (g === '"') {
      o = !0, a && n[m + 1] === '"' ? m++ : a = !a;
      continue;
    }
    if (!a)
      if (g === ",")
        s++, o = !0;
      else if (g === "	")
        r++, o = !0;
      else if (g === "\r" || g === `
`) {
        if (o) return d();
        g === "\r" && n[m + 1] === `
` && m++, c++, s = 0, r = 0;
      } else /\s/.test(g) || (o = !0);
  }
  return d();
}
function xr(n, s) {
  const r = [];
  let a = [], o = "", c = !1, d = !1, m = 1, g = 1;
  const f = () => {
    a.push(o), o = "", d = !1;
  }, w = () => {
    f(), r.push({ cells: a, row: g }), a = [];
  };
  for (let k = 0; k < n.length; k++) {
    const v = n[k];
    if (c) {
      v === '"' ? n[k + 1] === '"' ? (o += '"', k++) : (c = !1, d = !0) : v === "\r" || v === `
` ? (v === "\r" && n[k + 1] === `
` && k++, o += `
`, m++) : o += v;
      continue;
    }
    if (d) {
      if (v === s)
        f();
      else if (v === "\r" || v === `
`)
        w(), v === "\r" && n[k + 1] === `
` && k++, m++, g = m;
      else if (v !== " ")
        throw new fe(
          "malformed-quoted-field",
          "Unexpected text follows a closing quote in the compensation matrix.",
          { row: m, column: a.length + 1 }
        );
      continue;
    }
    if (v === '"') {
      if (o.length !== 0)
        throw new fe(
          "malformed-quoted-field",
          "A quoted matrix field must begin with a quote.",
          { row: m, column: a.length + 1 }
        );
      c = !0;
    } else v === s ? f() : v === "\r" || v === `
` ? (w(), v === "\r" && n[k + 1] === `
` && k++, m++, g = m) : o += v;
  }
  if (c)
    throw new fe(
      "malformed-quoted-field",
      "The compensation matrix contains an unclosed quoted field.",
      { row: g, column: a.length + 1 }
    );
  return (o.length > 0 || a.length > 0 || d) && w(), r.filter(
    ({ cells: k }) => !(k.length === 1 && k[0].trim().length === 0)
  );
}
function vr(n, s, r) {
  const a = n.trim();
  if (!pr.test(a))
    throw new fe(
      "invalid-coefficient",
      `Matrix coefficient at row ${s}, column ${r} is not a finite decimal number.`,
      { row: s, column: r }
    );
  const o = Number(a);
  if (!Number.isFinite(o))
    throw new fe(
      "invalid-coefficient",
      `Matrix coefficient at row ${s}, column ${r} is outside the finite numeric range.`,
      { row: s, column: r }
    );
  return o;
}
function br(n, s, r) {
  return Object.freeze({
    sourceChannels: Object.freeze(Array.from(n)),
    receiverChannels: Object.freeze(Array.from(s)),
    matrix: Object.freeze(r.map((a) => Object.freeze(Array.from(a))))
  });
}
function yr(n, s = {}) {
  if (typeof n != "string")
    throw new fe(
      "invalid-input",
      "The compensation matrix contents must be text."
    );
  const r = n.startsWith("\uFEFF") ? n.slice(1) : n;
  if (r.trim().length === 0)
    throw new fe("empty-file", "The compensation matrix file is empty.");
  const a = s == null ? void 0 : s.delimiter;
  if (a !== void 0 && a !== "auto" && a !== "csv" && a !== "tsv")
    throw new fe(
      "invalid-delimiter",
      "The compensation matrix delimiter must be auto, csv, or tsv."
    );
  const o = a ?? "auto", c = o === "auto" ? gr(r) : o, d = xr(r, fr(c));
  if (d.length === 0)
    throw new fe("empty-file", "The compensation matrix file is empty.");
  const m = d[0];
  if (m.cells.length < 2)
    throw new fe(
      "missing-receiver-columns",
      "The matrix header needs a source-channel column and at least one receiver channel.",
      { row: m.row }
    );
  const g = m.cells[0];
  if (!mr(g))
    throw new fe(
      "missing-source-column",
      "The first column must identify source channels (blank, X, row.names, channel, or source).",
      { row: m.row, column: 1 }
    );
  if (d.length < 2)
    throw new fe(
      "missing-data-rows",
      "The compensation matrix does not contain any source-channel rows.",
      { row: m.row + 1 }
    );
  const f = m.cells.slice(1).map(Vt), w = [], k = [];
  for (const v of d.slice(1)) {
    if (v.cells.length !== m.cells.length)
      throw new fe(
        "row-width",
        `Matrix row ${v.row} has ${v.cells.length} columns; expected ${m.cells.length}.`,
        { row: v.row }
      );
    const C = Vt(v.cells[0]);
    if (C.length === 0)
      throw new fe(
        "missing-source-channel",
        `Matrix row ${v.row} has no source-channel identity.`,
        { row: v.row, column: 1 }
      );
    w.push(C), k.push(
      v.cells.slice(1).map((T, P) => vr(T, v.row, P + 2))
    );
  }
  return Object.freeze({
    input: br(w, f, k),
    format: Object.freeze({ delimiter: c, sourceColumnHeader: g })
  });
}
function Bt(n) {
  const s = n.trim().normalize("NFC"), r = s.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (r)
    return { element: r[1], mass: Number(r[2]) };
  const a = s.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return a ? { element: a[2], mass: Number(a[1]) } : null;
}
function Ii(n) {
  return n.map((s, r) => ({ channel: s, index: r, isotope: Bt(s) })).sort((s, r) => s.isotope && r.isotope ? s.isotope.mass - r.isotope.mass || s.isotope.element.localeCompare(r.isotope.element) || s.index - r.index : s.isotope ? -1 : r.isotope ? 1 : s.index - r.index).map(({ index: s }) => s);
}
function jr(n) {
  const s = Ii(n.sourceChannels), r = Ii(n.receiverChannels);
  return {
    sourceChannels: s.map((a) => n.sourceChannels[a]),
    receiverChannels: r.map((a) => n.receiverChannels[a]),
    matrix: s.map(
      (a) => r.map((o) => n.matrix[a][o])
    )
  };
}
function Cn(n, s) {
  if (n === s) return "self";
  const r = Bt(n), a = Bt(s);
  if (!r || !a) return "other";
  const o = a.mass - r.mass;
  return r.element === a.element ? o === -1 ? "M-1" : o === 1 ? "M+1" : "same-element" : o === -1 ? "M-1" : o === 1 ? "M+1" : o === 16 ? "oxide (+16)" : "other";
}
function at(n, s) {
  const r = n.index(s);
  if (r !== void 0) return r;
  const a = n.channels.findIndex((o) => o.pnn === s);
  return a < 0 ? void 0 : a;
}
function dn(n, s, r) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(s) || s <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (r && r.length !== n)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const a = r ? r.reduce((f, w) => f + (w ? 1 : 0), 0) : n, o = Math.min(a, s), c = new Uint32Array(o);
  if (o === 0) return c;
  if (!r) {
    if (o === 1) return c;
    for (let f = 0; f < o; f++)
      c[f] = Math.floor(f * (n - 1) / (o - 1));
    return c;
  }
  const d = Array.from({ length: o }, (f, w) => o === 1 ? 0 : Math.floor(w * (a - 1) / (o - 1)));
  let m = 0, g = 0;
  for (let f = 0; f < n && g < o; f++)
    r[f] && (m === d[g] && (c[g++] = f), m++);
  return c;
}
function hn(n, s) {
  if (n.length === 0) return 0;
  const r = Math.max(0, Math.min(1, s)) * (n.length - 1), a = Math.floor(r), o = Math.ceil(r);
  return a === o ? n[a] : n[a] + (n[o] - n[a]) * (r - a);
}
function ot(n) {
  const s = n.filter(Number.isFinite).sort((c, d) => c - d);
  if (s.length === 0) return [-1, 1];
  let r = hn(s, 2e-3), a = hn(s, 0.998);
  if (!(a > r)) {
    const c = Number.isFinite(r) ? r : 0, d = Math.max(1, Math.abs(c) * 0.05);
    return [c - d, c + d];
  }
  const o = (a - r) * 0.035;
  return r -= o, a += o, [r, a];
}
function De(n) {
  if (n.length === 0) return Number.NaN;
  const s = [...n].sort((r, a) => r - a);
  return hn(s, 0.5);
}
function lt(n) {
  if (n.length === 0) return Number.NaN;
  const s = De(n), r = De(n.map((d) => Math.abs(d - s))) * 1.4826;
  if (Number.isFinite(r) && r > 0) return r;
  const a = n.reduce((d, m) => d + m, 0) / n.length, o = n.reduce((d, m) => d + (m - a) ** 2, 0) / Math.max(1, n.length - 1), c = Math.sqrt(o);
  return Number.isFinite(c) && c > 0 ? c : 1e-12;
}
function Gt(n, s, r = 12) {
  if (n.length !== s.length || n.length < r * 8) return null;
  const a = Array.from({ length: n.length }, (m, g) => g).sort((m, g) => n[m] - n[g]), o = [];
  for (let m = 0; m < r; m++) {
    const g = Math.floor(m * a.length / r), f = Math.floor((m + 1) * a.length / r), w = a.slice(g, f);
    if (w.length < 8) continue;
    const k = De(w.map((C) => n[C])), v = De(w.map((C) => s[C]));
    Number.isFinite(k) && Number.isFinite(v) && o.push({ x: k, y: v });
  }
  const c = [];
  for (let m = 0; m < o.length; m++)
    for (let g = m + 1; g < o.length; g++) {
      const f = o[g].x - o[m].x;
      if (f === 0) continue;
      const w = (o[g].y - o[m].y) / f;
      Number.isFinite(w) && c.push(w);
    }
  const d = De(c);
  return Number.isFinite(d) ? d : null;
}
function wr(n, s) {
  if (n.length !== s.length || n.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const r = Array.from({ length: n.length }, (A, K) => K).filter((A) => Number.isFinite(n[A]) && Number.isFinite(s[A])).sort((A, K) => n[A] - n[K]);
  if (r.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const a = Math.max(96, Math.floor(r.length * 0.8)), o = Math.min(r.length - 24, Math.floor(r.length * 0.9)), c = r.slice(0, a), d = r.slice(o);
  if (c.length < 96 || d.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const m = c.map((A) => n[A]), g = c.map((A) => s[A]), f = Gt(m, g, 10);
  if (f === null) return { excessMad: null, slopeDeltaMad: null };
  const w = De(c.map((A) => s[A] - f * n[A])), k = c.map((A) => s[A] - (w + f * n[A])), v = Math.max(
    lt(k),
    lt(g) * 0.05,
    1e-12
  ), C = d.map((A) => s[A] - (w + f * n[A])).sort((A, K) => A - K), T = hn(C, 0.75) / v, P = r.slice(Math.floor(r.length * 0.75)), $ = P.map((A) => n[A]), E = P.map((A) => s[A]), I = Gt($, E, 4), F = hn($, 0.9) - hn($, 0.1), N = I === null || !(F > 0) ? null : (I - f) * F / v;
  return {
    excessMad: Number.isFinite(T) ? T : null,
    slopeDeltaMad: Number.isFinite(N) ? N : null
  };
}
function ss(n, s, r, a, o, c) {
  const d = r.length, m = wr(r, a), g = Math.min(50, Math.max(12, Math.floor(d * 0.01))), f = (i = 0, R = 0, ge = 0) => ({
    status: "insufficient",
    sourceLowEvents: i,
    sourceHighEvents: R,
    destinationNegativeEvents: ge,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: m.excessMad,
    upperTailSlopeDeltaMad: m.slopeDeltaMad,
    receiverZeroDeltaFraction: d > 0 ? (c - o) / d : 0
  });
  if (d < g * 3) return f();
  const w = [...r].sort((i, R) => i - R), k = hn(w, 0.25), v = r.flatMap((i, R) => i <= k ? [R] : []);
  if (v.length < g) return f(v.length);
  const C = v.map((i) => r[i]), T = De(C), P = lt(C);
  let $ = r.flatMap((i, R) => i >= T + 3 * P ? [R] : []);
  if ($.length < g && ($ = Array.from({ length: d }, (i, R) => R).sort((i, R) => r[R] - r[i]).slice(0, g)), $.length < g) return f(v.length, $.length);
  const E = v.map((i) => a[i]), I = De(E), F = lt(E), N = I + 5 * F, A = a.flatMap((i, R) => i <= N ? [R] : []), K = new Set(A), O = v.filter((i) => K.has(i)), D = $.filter((i) => K.has(i));
  if (O.length < g || D.length < g)
    return f(v.length, $.length, A.length);
  const q = (De(D.map((i) => a[i])) - De(O.map((i) => a[i]))) / F, J = A.map((i) => n[i]), Z = A.map((i) => s[i]);
  return {
    status: "ready",
    sourceLowEvents: v.length,
    sourceHighEvents: $.length,
    destinationNegativeEvents: A.length,
    normalizedNegativeShift: Number.isFinite(q) ? q : null,
    residualSlope: Gt(J, Z),
    upperTailExcessMad: m.excessMad,
    upperTailSlopeDeltaMad: m.slopeDeltaMad,
    receiverZeroDeltaFraction: d > 0 ? (c - o) / d : 0
  };
}
function ct(n, s, r, a, o, c) {
  let d = 0, m = 0, g = 0;
  for (let f = 0; f < r.length; f++) {
    const w = Math.abs(r[f]) <= 1e-12, k = Math.abs(a[f]) <= 1e-12;
    w && d++, k && m++, w && k && g++;
  }
  return {
    x: n.map((f) => Math.max(o[0], Math.min(o[1], f))),
    y: s.map((f) => Math.max(c[0], Math.min(c[1], f))),
    zeroPile: Object.freeze({
      source: d,
      receiver: m,
      corner: g
    })
  };
}
function Dt(n, s, r, a = {}) {
  var i;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation to compare Original and Compensated data." };
  const c = at(n, s), d = at(n, r);
  if (c === void 0 || d === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (n.fcs.nEvents === 0)
    return { ready: !1, reason: "This sample contains no events." };
  const m = ((i = a.fixedEventIndices) == null ? void 0 : i.slice()) ?? dn(
    n.fcs.nEvents,
    a.maxEvents ?? 15e3,
    a.eventMask
  );
  for (const R of m)
    if (R >= n.fcs.nEvents || a.eventMask && !a.eventMask[R])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const g = n.channels[c].key, f = n.channels[d].key, w = n.originalColumnData(c), k = n.originalColumnData(d), v = n.compensatedColumnData(c), C = n.compensatedColumnData(d), T = [], P = [], $ = [], E = [], I = [], F = [], N = [], A = [];
  for (const R of m) {
    const ge = n.rawToDisplay(g, w[R]), _ = n.rawToDisplay(f, k[R]), j = n.rawToDisplay(g, v[R]), H = n.rawToDisplay(f, C[R]);
    [ge, _, j, H].every(Number.isFinite) && (T.push(ge), P.push(_), $.push(w[R]), E.push(k[R]), I.push(j), F.push(H), N.push(v[R]), A.push(C[R]));
  }
  const K = ot([...T, ...I]), O = ot([...P, ...F]), D = n.channelTicks(c, [K[0], K[1]]), q = n.channelTicks(d, [O[0], O[1]]), J = ct(
    T,
    P,
    $,
    E,
    K,
    O
  ), Z = ct(
    I,
    F,
    N,
    A,
    K,
    O
  );
  return {
    ready: !0,
    preview: {
      eventCount: T.length,
      totalEvents: a.eventMask ? a.eligibleEventCount ?? a.eventMask.reduce((R, ge) => R + (ge ? 1 : 0), 0) : n.fcs.nEvents,
      xRange: K,
      yRange: O,
      xTicks: D,
      yTicks: q,
      original: J,
      compensated: Z,
      evidence: ss(
        N,
        A,
        I,
        F,
        J.zeroPile.receiver,
        Z.zeroPile.receiver
      )
    }
  };
}
function Lt(n, s, r, a, o, c, d = {}) {
  const m = at(n, s), g = at(n, r);
  if (m === void 0 || g === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (o.length !== a.length || c.length !== a.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const f = n.channels[m].key, w = n.channels[g].key, k = n.originalColumnData(m), v = n.originalColumnData(g), C = [], T = [], P = [], $ = [], E = [], I = [], F = [], N = [];
  for (let Z = 0; Z < a.length; Z++) {
    const i = a[Z];
    if (i >= n.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const R = k[i], ge = v[i], _ = o[Z], j = c[Z], H = n.rawToDisplay(f, R), ue = n.rawToDisplay(w, ge), pn = n.rawToDisplay(f, _), Se = n.rawToDisplay(w, j);
    [R, ge, _, j, H, ue, pn, Se].every(Number.isFinite) && (C.push(H), T.push(ue), P.push(R), $.push(ge), E.push(pn), I.push(Se), F.push(_), N.push(j));
  }
  const A = d.xRange ?? ot([...C, ...E]), K = d.yRange ?? ot([...T, ...I]), O = n.channelTicks(m, [A[0], A[1]]), D = n.channelTicks(g, [K[0], K[1]]), q = ct(C, T, P, $, A, K), J = ct(E, I, F, N, A, K);
  return {
    ready: !0,
    preview: {
      eventCount: C.length,
      totalEvents: d.totalEvents ?? n.fcs.nEvents,
      xRange: A,
      yRange: K,
      xTicks: O,
      yTicks: D,
      original: q,
      compensated: J,
      evidence: ss(
        F,
        N,
        E,
        I,
        q.zeroPile.receiver,
        J.zeroPile.receiver
      )
    }
  };
}
const Ki = 0.5, Nr = 0.01, Cr = 1e-4, Sr = 0.05, Mr = 3, Er = 1, kr = 5;
function rs(n, s) {
  const r = n.evidence.normalizedNegativeShift ?? 0, a = n.evidence.residualSlope ?? 0, o = Math.max(0, n.evidence.upperTailExcessMad ?? 0), c = Math.max(0, n.evidence.upperTailSlopeDeltaMad ?? 0), d = Math.abs(n.coefficient), m = Math.max(
    Cr,
    d * Sr
  );
  return {
    negativeShift: Math.max(0, -r),
    negativeSlope: Math.max(0, -a),
    zeroDelta: s === "cytof" ? Math.max(0, n.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, r),
    positiveSlope: Math.max(0, a),
    upperTailExcess: o,
    upperTailSlopeDelta: c,
    hasNegativeShift: r <= -Ki,
    hasNegativeSlope: a <= -m,
    hasNewZeroPile: s === "cytof" && n.evidence.receiverZeroDeltaFraction >= Nr,
    hasPositiveShift: r >= Ki,
    hasPositiveSlope: a >= m,
    hasHighTailCurve: o >= Mr && (c >= Er || o >= kr)
  };
}
function Ar(n) {
  return Number(n.hasNegativeShift) + Number(n.hasNegativeSlope) + Number(n.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : n.hasNewZeroPile ? "new-zero-pile" : n.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function Wt(n, s, r = "biological") {
  const a = rs(n, s), o = a.hasNegativeShift || a.hasNegativeSlope || a.hasNewZeroPile, c = a.hasPositiveShift || a.hasPositiveSlope, d = a.hasHighTailCurve || r === "control" && c;
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
    reason: Ar(a),
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
function Qe(n, s) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  const r = s.filter((o) => Number.isFinite(o) && o > 0).sort((o, c) => o - c);
  if (r.length === 0) return 0;
  let a = 0;
  for (const o of r)
    if (o <= n) a++;
    else break;
  return a / r.length;
}
function Tr(n, s, r = "biological") {
  const a = n.map((T) => ({
    ...rs(T, s),
    coefficient: Math.abs(T.coefficient)
  })), o = (T) => a.map((P) => typeof P[T] == "number" ? P[T] : 0), c = o("negativeShift"), d = o("negativeSlope"), m = o("zeroDelta"), g = o("positiveShift"), f = o("positiveSlope"), w = o("upperTailExcess"), k = o("upperTailSlopeDelta"), v = o("coefficient"), C = n.flatMap((T, P) => {
    const $ = Wt(T, s, r);
    if (!$.automaticFollowup || $.reason === null) return [];
    const E = a[P], I = 0.22 * Qe(E.negativeShift, c) + 0.13 * Qe(E.negativeSlope, d) + 0.14 * Qe(E.zeroDelta, m) + (r === "control" ? 0.13 * Qe(E.positiveShift, g) : 0) + (r === "control" ? 0.08 * Qe(E.positiveSlope, f) : 0) + 0.12 * Qe(E.upperTailExcess, w) + 0.08 * Qe(E.upperTailSlopeDelta, k) + 0.05 * Qe(E.coefficient, v) + 0.05 * Math.max(0, Math.min(1, T.physicalPrior));
    return [{
      index: P,
      relativePriority: I,
      reason: $.reason,
      category: $.category
    }];
  });
  return Object.freeze(C.sort((T, P) => P.relativePriority - T.relativePriority || T.index - P.index));
}
function Fr(n, s) {
  const r = n.index(s);
  if (r !== void 0) return r;
  const a = n.channels.findIndex((o) => o.pnn === s);
  return a < 0 ? void 0 : a;
}
function Zt(n, s) {
  if (n.length === 0) return 0;
  const r = Math.max(0, Math.min(1, s)) * (n.length - 1), a = Math.floor(r), o = Math.ceil(r);
  return a === o ? n[a] : n[a] + (n[o] - n[a]) * (r - a);
}
function $r(n) {
  const s = n.filter(Number.isFinite).sort((c, d) => c - d);
  if (s.length === 0) return [-1, 1];
  let r = Zt(s, 2e-3), a = Zt(s, 0.998);
  if (!(a > r)) {
    const c = Number.isFinite(r) ? r : 0, d = Math.max(1, Math.abs(c) * 0.05);
    return [c - d, c + d];
  }
  const o = (a - r) * 0.035;
  return r -= o, a += o, [r, a];
}
function Pr(n) {
  if (n.length === 0) return "0:empty";
  let s = 2166136261;
  for (const r of n)
    s ^= r, s = Math.imul(s, 16777619) >>> 0;
  return `${n.length}:${n[0]}:${n[n.length - 1]}:${s.toString(16)}`;
}
function Ir(n, s, r = {}) {
  var m;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const o = ((m = r.fixedEventIndices) == null ? void 0 : m.slice()) ?? dn(
    n.fcs.nEvents,
    r.maxEvents ?? 2500,
    r.eventMask
  );
  for (const g of o)
    if (g >= n.fcs.nEvents || r.eventMask && !r.eventMask[g])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const c = /* @__PURE__ */ new Map();
  for (const g of Array.from(new Set(s))) {
    const f = Fr(n, g);
    if (f === void 0) continue;
    const w = n.channels[f], k = n.originalColumnData(f), v = n.compensatedColumnData(f), C = new Float64Array(o.length), T = new Float64Array(o.length), P = new Float64Array(o.length), $ = new Float64Array(o.length), E = [];
    for (let N = 0; N < o.length; N++) {
      const A = o[N], K = k[A], O = v[A], D = n.rawToDisplay(w.key, K), q = n.rawToDisplay(w.key, O);
      C[N] = K, T[N] = O, P[N] = D, $[N] = q, Number.isFinite(D) && E.push(D), Number.isFinite(q) && E.push(q);
    }
    const I = $r(E), F = Object.freeze({
      key: w.key,
      pnn: w.pnn,
      range: I,
      ticks: n.channelTicks(f, [I[0], I[1]]),
      originalRaw: C,
      compensatedRaw: T,
      originalDisplay: P,
      compensatedDisplay: $
    });
    c.set(g, F), c.set(w.key, F), c.set(w.pnn, F);
  }
  const d = r.eventMask ? r.eligibleEventCount ?? r.eventMask.reduce((g, f) => g + (f ? 1 : 0), 0) : n.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: o,
      eventSignature: Pr(o),
      eligibleEventCount: d,
      channels: c
    })
  };
}
function Ri(n, s, r, a, o, c, d) {
  const m = [], g = [];
  let f = 0, w = 0, k = 0;
  for (const v of o) {
    m.push(Math.max(c[0], Math.min(c[1], n[v]))), g.push(Math.max(d[0], Math.min(d[1], s[v])));
    const C = Math.abs(r[v]) <= 1e-12, T = Math.abs(a[v]) <= 1e-12;
    C && f++, T && w++, C && T && k++;
  }
  return {
    x: m,
    y: g,
    zeroPile: Object.freeze({ source: f, receiver: w, corner: k })
  };
}
function as(n, s, r) {
  const a = n.channels.get(s), o = n.channels.get(r);
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
      original: Ri(
        a.originalDisplay,
        o.originalDisplay,
        a.originalRaw,
        o.originalRaw,
        c,
        a.range,
        o.range
      ),
      compensated: Ri(
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
function Oi(n, s, r, a, o) {
  const c = Math.max(1, Math.min(24, Math.round(o) || 3)), d = 256, m = c, g = d + 2 * m, f = new Float64Array(g * g), w = Math.max(1e-12, s[1] - s[0]), k = Math.max(1e-12, r[1] - r[0]);
  for (let E = 0; E < n.x.length; E++) {
    const I = Math.max(0, Math.min(
      g - 1,
      Math.floor((n.x[E] - s[0]) / w * d) + m
    )), F = Math.max(0, Math.min(
      g - 1,
      Math.floor((n.y[E] - r[0]) / k * d) + m
    ));
    f[F * g + I]++;
  }
  const v = new Float64Array(g * g), C = (c * 2 + 1) ** 2, T = g + 1, P = new Float64Array(T * T);
  for (let E = 0; E < g; E++) {
    let I = 0;
    for (let F = 0; F < g; F++)
      I += f[E * g + F], P[(E + 1) * T + F + 1] = P[E * T + F + 1] + I;
  }
  for (let E = c; E < g - c; E++) {
    const I = E - c, F = E + c + 1;
    for (let N = c; N < g - c; N++) {
      const A = N - c, K = N + c + 1, O = P[F * T + K] - P[I * T + K] - P[F * T + A] + P[I * T + A];
      v[E * g + N] = O / C;
    }
  }
  const $ = [];
  for (let E = m; E < m + d; E++)
    for (let I = m; I < m + d; I++) {
      const F = v[E * g + I];
      F > 0 && $.push(F);
    }
  return $.sort((E, I) => E - I), $.length === 0 ? 1 : Math.max(1e-12, Zt($, a));
}
function Jt(n, s) {
  const r = Math.max(1, Math.min(10, Number.isFinite(n) ? n : 6)), a = Math.max(1, (Number.isFinite(s) ? s : 220) - 50);
  return Math.max(1, Math.min(24, r * 170 / a));
}
function Qt(n, s = 0.95, r = 3, a = Xt) {
  const o = Math.max(
    Oi(n.original, n.xRange, n.yRange, s, r),
    Oi(n.compensated, n.xRange, n.yRange, s, r)
  );
  return er(o, a);
}
function dt(n, s) {
  const r = s.size / 220, a = Math.sqrt(r), o = Math.max(7, Math.min(11, 10 * a)), c = 20, d = Math.ceil(c + o + 4);
  nr().renderMiniPlot(n, {
    plot_size: s.size,
    canvas_scale: s.canvasScale ?? 3,
    display_mode: "pseudocolor",
    x: s.panel.x,
    y: s.panel.y,
    x_range: s.preview.xRange,
    y_range: s.preview.yRange,
    x_is_logicle: !!s.preview.xTicks,
    x_logicle_ticks: s.preview.xTicks ?? null,
    y_is_logicle: !!s.preview.yTicks,
    y_logicle_ticks: s.preview.yTicks ?? null,
    x_label: s.sourceLabel,
    y_label: s.receiverLabel,
    title: s.title,
    point_size: Math.max(0.55, Math.min(1.2, 1.15 * r)),
    point_alpha: s.pointAlpha,
    density_clip_quantile: 0.95,
    density_color_power: s.densityColorPower,
    density_color_ceiling: s.densityColorCeiling,
    density_smoothing: s.densitySmoothingRadius,
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
const un = "http://www.w3.org/2000/svg", Ln = 6, En = 1123, ut = 794;
function os(n) {
  return Math.ceil(Math.max(0, Math.floor(n)) / Ln);
}
function Di(n) {
  return n.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function ls(n, s) {
  return `gatelab-compensation-${Di(n.replace(/\.[^.]+$/, ""))}-${Di(s)}`;
}
function Ht(n, s, r, a) {
  const o = ls(n, s);
  return r === "pdf" || a <= 1 ? `${o}.${r}` : `${o}-${r}-pages.zip`;
}
function Sn(n, s, r, a, o = {}) {
  const c = document.createElementNS(un, "text");
  return c.setAttribute("x", String(r)), c.setAttribute("y", String(a)), c.setAttribute("font-family", "Arial, Helvetica, sans-serif"), c.setAttribute("font-size", String(o.size ?? 10)), c.setAttribute("font-weight", String(o.weight ?? 400)), c.setAttribute("fill", o.fill ?? "#253247"), o.anchor && c.setAttribute("text-anchor", o.anchor), c.textContent = s, n.appendChild(c), c;
}
function Li(n, s) {
  return n.length <= s ? n : `${n.slice(0, Math.max(1, s - 1))}…`;
}
function zi(n, s, r, a, o, c, d, m, g, f, w) {
  const k = document.createElement("div");
  dt(k, {
    title: a === "original" ? "Original" : "Compensated",
    panel: r[a],
    preview: r,
    sourceLabel: s.sourceLabel,
    receiverLabel: s.receiverLabel,
    size: d,
    densityColorCeiling: g,
    densitySmoothingRadius: m,
    densityColorPower: f,
    pointAlpha: w,
    canvasScale: 300 / 96
  });
  const v = k.querySelector("canvas"), C = k.querySelector("svg");
  if (!v || !C) throw new Error("GateLab could not render a compensation export panel.");
  const T = document.createElementNS(un, "g");
  T.setAttribute("transform", `translate(${o},${c})`);
  const P = document.createElementNS(un, "image");
  P.setAttribute("x", "0"), P.setAttribute("y", "0"), P.setAttribute("width", String(d)), P.setAttribute("height", String(d)), P.setAttribute("href", v.toDataURL("image/png")), T.appendChild(P), T.appendChild(C.cloneNode(!0)), n.appendChild(T);
}
function _i(n, s, r, a) {
  const o = document.createElementNS(un, "svg");
  o.setAttribute("xmlns", un), o.setAttribute("width", String(En)), o.setAttribute("height", String(ut)), o.setAttribute("viewBox", `0 0 ${En} ${ut}`);
  const c = document.createElementNS(un, "rect");
  c.setAttribute("width", "100%"), c.setAttribute("height", "100%"), c.setAttribute("fill", "#ffffff"), o.appendChild(c), Sn(o, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), Sn(
    o,
    Li(`${s.sampleName} · ${s.populationName} · ${s.profileName} · ${s.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), Sn(o, `Page ${r + 1} of ${a}`, En - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const d = 28, m = 18, g = 53, f = 771, w = (En - d * 2 - m) / 2, k = (f - g) / 3, v = 204, C = 12, T = v * 2 + C;
  return n.forEach((P, $) => {
    const E = P.buildPreview(), I = Jt(s.densitySmoothing, v), F = Qt(
      E,
      0.95,
      I,
      s.densityColorPower
    ), N = $ % 2, A = Math.floor($ / 2), K = d + N * (w + m), O = g + A * k, D = K + (w - T) / 2, q = O + 25, J = P.relationship && P.relationship !== "other" ? ` · ${P.relationship}` : "";
    if (Sn(
      o,
      Li(`${P.sourceLabel} → ${P.receiverLabel}`, 58),
      K + 5,
      O + 14,
      { size: 10.5, weight: 700 }
    ), Sn(
      o,
      `matrix ${(P.coefficient * 100).toFixed(1)}%${J}`,
      K + w - 5,
      O + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), zi(o, P, E, "original", D, q, v, I, F, s.densityColorPower, s.pointAlpha), zi(o, P, E, "compensated", D + v + C, q, v, I, F, s.densityColorPower, s.pointAlpha), A < 2) {
      const Z = document.createElementNS(un, "line");
      Z.setAttribute("x1", String(K)), Z.setAttribute("x2", String(K + w)), Z.setAttribute("y1", String(O + k - 3)), Z.setAttribute("y2", String(O + k - 3)), Z.setAttribute("stroke", "#e6eaf0"), Z.setAttribute("stroke-width", "1"), o.appendChild(Z);
    }
  }), Sn(
    o,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), o;
}
function Ui(n) {
  return `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(n)}`;
}
async function qi(n, s = 300) {
  const r = URL.createObjectURL(new Blob([n], { type: "image/svg+xml" }));
  try {
    const a = await new Promise((m, g) => {
      const f = new Image();
      f.onload = () => m(f), f.onerror = () => g(new Error("GateLab could not rasterize the compensation export page.")), f.src = r;
    }), o = Math.max(1, s / 96), c = document.createElement("canvas");
    c.width = Math.round(En * o), c.height = Math.round(ut * o);
    const d = c.getContext("2d");
    if (!d) throw new Error("Canvas export is unavailable in this browser.");
    return d.fillStyle = "#ffffff", d.fillRect(0, 0, c.width, c.height), d.scale(o, o), d.drawImage(a, 0, 0, En, ut), await new Promise((m, g) => {
      c.toBlob((f) => f ? m(f) : g(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(r);
  }
}
function Vi(n, s) {
  const r = URL.createObjectURL(n), a = document.createElement("a");
  a.href = r, a.download = s, document.body.appendChild(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function Kr(n, s, r, a) {
  const o = Math.max(2, String(r).length);
  return `${n}-page-${String(s + 1).padStart(o, "0")}.${a}`;
}
async function Rr(n, s, r, a) {
  const o = os(n.length);
  if (o === 0) throw new Error("No compensation pairs are available to export.");
  const c = ls(s.sampleName, s.populationName);
  if (r === "pdf") {
    const { jsPDF: f } = await import("./jspdf.es.min-C0svm3nU.js").then((C) => C.j), w = new f({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), k = w.internal.pageSize.getWidth(), v = w.internal.pageSize.getHeight();
    for (let C = 0; C < o; C++) {
      C > 0 && w.addPage("a4", "landscape");
      const T = n.slice(
        C * Ln,
        (C + 1) * Ln
      ), P = Ui(_i(T, s, C, o)), $ = await qi(P), E = await new Promise((I, F) => {
        const N = new FileReader();
        N.onload = () => I(String(N.result)), N.onerror = () => F(N.error ?? new Error("GateLab could not read an export page.")), N.readAsDataURL($);
      });
      w.addImage(E, "PNG", 0, 0, k, v, void 0, "FAST"), a == null || a({ completedPages: C + 1, totalPages: o }), await new Promise((I) => setTimeout(I, 0));
    }
    w.save(Ht(s.sampleName, s.populationName, r, o));
    return;
  }
  const d = {};
  let m = null;
  for (let f = 0; f < o; f++) {
    const w = n.slice(
      f * Ln,
      (f + 1) * Ln
    ), k = Ui(_i(w, s, f, o)), v = Kr(c, f, o, r);
    if (r === "svg") {
      const C = tr(k);
      d[v] = C, o === 1 && (m = new Blob([C], { type: "image/svg+xml" }));
    } else {
      const C = await qi(k), T = new Uint8Array(await C.arrayBuffer());
      d[v] = T, o === 1 && (m = C);
    }
    a == null || a({ completedPages: f + 1, totalPages: o }), await new Promise((C) => setTimeout(C, 0));
  }
  const g = Ht(
    s.sampleName,
    s.populationName,
    r,
    o
  );
  Vi(o === 1 && m ? m : new Blob([ir(d, { level: 6 })], { type: "application/zip" }), g);
}
const Or = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function Dr({
  sampleName: n,
  populationName: s,
  filterLabel: r,
  pairCount: a,
  onExport: o,
  onClose: c
}) {
  const { t: d } = Le(), [m, g] = M.useState("pdf"), [f, w] = M.useState(null), [k, v] = M.useState(null), C = os(a), T = f !== null && f.completedPages < f.totalPages, P = Ht(n, s, m, C), $ = async () => {
    v(null), w({ completedPages: 0, totalPages: C });
    try {
      await o(m, w), c();
    } catch (I) {
      w(null), v(I instanceof Error ? I.message : String(I));
    }
  }, E = (I) => {
    I.key === "Escape" && !T && c();
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: E, children: /* @__PURE__ */ e.jsxs(
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
          Or.map((I) => /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-comparison-export-format",
                value: I.format,
                checked: m === I.format,
                disabled: T,
                onChange: () => g(I.format)
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: I.title }),
              /* @__PURE__ */ e.jsx("small", { children: d(I.detail) })
            ] })
          ] }, I.format))
        ] }),
        /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary gl-comp-comparison-export-summary", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("File") }),
            /* @__PURE__ */ e.jsx("dd", { title: P, children: P })
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
            /* @__PURE__ */ e.jsx("dd", { title: s, children: s })
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
        k && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: d(k) }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: T, onClick: c, children: d("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: T || C === 0, onClick: () => void $(), children: T ? d("Rendering…") : d("Download {format}", { format: m.toUpperCase() }) })
        ] })
      ]
    }
  ) });
}
function Bi(n) {
  return `"${n.replaceAll('"', '""')}"`;
}
function Gi(n, s) {
  if (!Array.isArray(n) || n.length === 0)
    throw new Error(`The ${s} channel axis is empty.`);
  const r = n.map((a, o) => {
    if (typeof a != "string" || a.trim().length === 0)
      throw new Error(`The ${s} channel at position ${o + 1} is blank or invalid.`);
    return a.trim().normalize("NFC");
  });
  if (new Set(r).size !== r.length)
    throw new Error(`The ${s} channel axis contains duplicate identities.`);
  return r;
}
function Lr(n) {
  const s = Gi(n.sourceChannels, "source"), r = Gi(n.receiverChannels, "receiver");
  if (!Array.isArray(n.matrix) || n.matrix.length !== s.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const a = [
    ["channel", ...r].map(Bi).join(",")
  ];
  return n.matrix.forEach((o, c) => {
    if (!Array.isArray(o) || o.length !== r.length)
      throw new Error(
        `Spill matrix row ${c + 1} does not match the receiver channel axis.`
      );
    const d = o.map((m, g) => {
      if (typeof m != "number" || !Number.isFinite(m))
        throw new Error(
          `Spill coefficient ${s[c]} → ${r[g]} is not finite.`
        );
      return Object.is(m, -0) ? "0" : String(m);
    });
    a.push([Bi(s[c]), ...d].join(","));
  }), `${a.join(`
`)}
`;
}
function zr(n, s = "installed") {
  return `${n.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${s === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function _r(n) {
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
function Ur({
  profileLabel: n,
  installedLabel: s,
  installedMatrix: r,
  workingMatrix: a = null,
  pendingEditCount: o = 0,
  onClose: c
}) {
  const { t: d } = Le(), [m, g] = M.useState("installed"), [f, w] = M.useState(null), k = m === "working" && a ? a : r, v = zr(n, m), C = M.useMemo(
    () => _r(v),
    [v]
  ), T = () => {
    w(null);
    try {
      const E = Lr(k), I = URL.createObjectURL(new Blob([E], { type: "text/csv;charset=utf-8" })), F = document.createElement("a");
      F.href = I, F.download = v, document.body.appendChild(F), F.click(), F.remove(), setTimeout(() => URL.revokeObjectURL(I), 1e3);
    } catch (E) {
      w(E instanceof Error ? E.message : String(E));
    }
  }, P = async () => {
    var E;
    if (!((E = navigator.clipboard) != null && E.writeText)) {
      w("Clipboard access is unavailable; select the R code below and copy it manually.");
      return;
    }
    try {
      await navigator.clipboard.writeText(C), w("R import code copied.");
    } catch {
      w("Clipboard access was denied; select the R code below and copy it manually.");
    }
  }, $ = (E) => {
    E.key === "Escape" && c();
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: $, children: /* @__PURE__ */ e.jsxs(
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
                checked: m === "installed",
                onChange: () => g("installed")
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: s }),
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
                checked: m === "working",
                onChange: () => g("working")
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
            /* @__PURE__ */ e.jsx("dd", { children: d("{sources} sources × {receivers} receivers", { sources: k.sourceChannels.length, receivers: k.receiverChannels.length }) })
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
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => void P(), children: d("Copy R code") })
        ] }),
        /* @__PURE__ */ e.jsx("pre", { className: "gl-comp-export-code", children: /* @__PURE__ */ e.jsx("code", { children: C }) }),
        f && /* @__PURE__ */ e.jsx("div", { className: f.includes("copied") ? "gl-comp-status" : "gl-comp-warning", role: "status", children: f }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: c, children: d("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", onClick: T, children: d("Download CSV") })
        ] })
      ]
    }
  ) });
}
function Mn({
  value: n,
  onValueChange: s,
  scrubStep: r,
  className: a = "",
  disabled: o,
  min: c,
  max: d,
  step: m,
  title: g,
  onPointerDown: f,
  onPointerMove: w,
  onPointerUp: k,
  onPointerCancel: v,
  onLostPointerCapture: C,
  ...T
}) {
  const { t: P } = Le(), $ = M.useRef(null), [E, I] = M.useState(!1), F = (N) => {
    var A, K, O;
    ((A = $.current) == null ? void 0 : A.pointerId) === N.pointerId && ($.current = null, I(!1), (O = (K = N.currentTarget).hasPointerCapture) != null && O.call(K, N.pointerId) && N.currentTarget.releasePointerCapture(N.pointerId));
  };
  return /* @__PURE__ */ e.jsx(
    "input",
    {
      ...T,
      type: "number",
      className: `gl-scrubbable-number${E ? " is-scrubbing" : ""}${a ? ` ${a}` : ""}`,
      value: n,
      disabled: o,
      min: c,
      max: d,
      step: m,
      title: g ?? P("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (N) => s(N.currentTarget.value),
      onPointerDown: (N) => {
        var J, Z;
        if (f == null || f(N), N.defaultPrevented || o || N.button !== 0) return;
        const A = N.currentTarget.getBoundingClientRect();
        if (N.clientX >= A.right - 18) return;
        const K = Number(n), O = (r ?? Number(m)) || 0.1;
        if (!Number.isFinite(K) || !(O > 0)) return;
        const D = String(O), q = D.includes("e-") ? Number(D.split("e-")[1]) : D.includes(".") ? D.split(".")[1].length : 0;
        $.current = {
          pointerId: N.pointerId,
          startY: N.clientY,
          startValue: K,
          step: O,
          decimals: q,
          lastSteps: 0
        }, (Z = (J = N.currentTarget).setPointerCapture) == null || Z.call(J, N.pointerId);
      },
      onPointerMove: (N) => {
        w == null || w(N);
        const A = $.current;
        if (!A || A.pointerId !== N.pointerId) return;
        const K = A.startY - N.clientY;
        if (Math.abs(K) < 3) return;
        const O = K > 0 ? Math.floor(K / 4) : Math.ceil(K / 4);
        if (O === A.lastSteps) return;
        let D = A.startValue + O * A.step;
        const q = c === void 0 ? Number.NEGATIVE_INFINITY : Number(c), J = d === void 0 ? Number.POSITIVE_INFINITY : Number(d);
        Number.isFinite(q) && (D = Math.max(q, D)), Number.isFinite(J) && (D = Math.min(J, D)), $.current = { ...A, lastSteps: O }, I(!0), s(D.toFixed(Math.min(10, A.decimals))), N.preventDefault();
      },
      onPointerUp: (N) => {
        k == null || k(N), F(N);
      },
      onPointerCancel: (N) => {
        v == null || v(N), F(N);
      },
      onLostPointerCapture: (N) => {
        var A;
        C == null || C(N), ((A = $.current) == null ? void 0 : A.pointerId) === N.pointerId && ($.current = null, I(!1));
      }
    }
  );
}
const ei = M.createContext(Xt), ni = M.createContext(0.85), Wi = "", rt = [];
let zt = !1;
function qr(n) {
  const s = { cancelled: !1, run: n };
  rt.push(s);
  const r = () => {
    if (zt) return;
    zt = !0;
    const a = () => {
      zt = !1;
      let c = rt.shift();
      for (; c != null && c.cancelled; ) c = rt.shift();
      c == null || c.run(), rt.length > 0 && r();
    }, o = window;
    typeof o.requestIdleCallback == "function" ? o.requestIdleCallback(a, { timeout: 50 }) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(a) : setTimeout(a, 0);
  };
  return r(), () => {
    s.cancelled = !0;
  };
}
function ht({
  title: n,
  panel: s,
  preview: r,
  sourceLabel: a,
  receiverLabel: o,
  minimumSize: c = 210,
  maximumSize: d = 420,
  densityColorCeiling: m,
  densitySmoothing: g,
  showZeroPile: f = !0
}) {
  const { t: w } = Le(), k = M.useContext(ei), v = M.useContext(ni), C = M.useRef(null);
  M.useEffect(() => {
    const $ = C.current;
    if (!$) return;
    let E = null, I = 0;
    const F = () => {
      var q;
      E = null;
      const K = ((q = $.parentElement) == null ? void 0 : q.clientWidth) ?? 230, O = Math.max(c, Math.min(d, Math.floor(K)));
      if (O === I && $.childElementCount > 0) return;
      I = O;
      const D = Jt(g, O);
      dt($, {
        title: n,
        panel: s,
        preview: r,
        sourceLabel: a,
        receiverLabel: o,
        size: O,
        densityColorCeiling: m ?? Qt(
          r,
          0.95,
          D,
          k
        ),
        densitySmoothingRadius: D,
        densityColorPower: k,
        pointAlpha: v
      });
    }, N = () => {
      E !== null && cancelAnimationFrame(E), E = requestAnimationFrame(F);
    };
    N();
    const A = typeof ResizeObserver > "u" ? null : new ResizeObserver(N);
    return A == null || A.observe($.parentElement ?? $), () => {
      A == null || A.disconnect(), E !== null && cancelAnimationFrame(E);
    };
  }, [m, k, g, d, c, s, v, r, o, a, n]);
  const T = ($) => r.eventCount > 0 ? `${($ / r.eventCount * 100).toFixed(1)}%` : "0.0%", P = s.zeroPile.source > 0 || s.zeroPile.receiver > 0 || s.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": w("{title} density biplot; {source} on x, {receiver} on y", {
    title: n,
    source: a,
    receiver: o
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: C, className: "gl-comp-biplot-surface" }),
    f && P && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: w("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: T(s.zeroPile.source),
      receiver: T(s.zeroPile.receiver),
      both: T(s.zeroPile.corner)
    }) })
  ] });
}
function Vr({
  title: n,
  preview: s,
  sourceLabel: r,
  receiverLabel: a,
  minimumSize: o,
  maximumSize: c,
  densityColorCeiling: d,
  densitySmoothing: m
}) {
  const { t: g } = Le(), f = M.useContext(ei), w = M.useContext(ni), k = M.useRef(null);
  return M.useEffect(() => {
    const v = k.current;
    if (!v) return;
    let C = null, T = 0;
    const P = () => {
      var J;
      C = null;
      const I = ((J = v.parentElement) == null ? void 0 : J.clientWidth) ?? o, F = Math.max(o, Math.min(c, Math.floor(I)));
      if (F === T && v.dataset.cacheReady === "true") return;
      T = F, v.dataset.cacheReady = "false";
      const N = Jt(m, F), A = d ?? Qt(
        s,
        0.95,
        N,
        f
      );
      dt(v, {
        title: n,
        panel: s.original,
        preview: s,
        sourceLabel: r,
        receiverLabel: a,
        size: F,
        densityColorCeiling: A,
        densitySmoothingRadius: N,
        densityColorPower: f,
        pointAlpha: w,
        canvasScale: 2
      });
      const K = v.querySelector("canvas"), O = v.querySelector("svg"), D = document.createElement("div");
      dt(D, {
        title: n,
        panel: s.compensated,
        preview: s,
        sourceLabel: r,
        receiverLabel: a,
        size: F,
        densityColorCeiling: A,
        densitySmoothingRadius: N,
        densityColorPower: f,
        pointAlpha: w,
        canvasScale: 2
      });
      const q = D.querySelector("canvas");
      !K || !q || !O || (K.classList.add("gl-comp-cached-canvas", "is-original"), K.dataset.assayLayer = "original", q.classList.add("gl-comp-cached-canvas", "is-compensated"), q.dataset.assayLayer = "compensated", v.insertBefore(q, O), v.dataset.cacheReady = "true");
    }, $ = () => {
      C == null || C(), C = qr(P);
    };
    $();
    const E = typeof ResizeObserver > "u" ? null : new ResizeObserver($);
    return E == null || E.observe(v.parentElement ?? v), () => {
      E == null || E.disconnect(), C == null || C();
    };
  }, [d, f, m, c, o, w, s, a, r, n]), /* @__PURE__ */ e.jsx(
    "figure",
    {
      className: "gl-comp-biplot",
      "aria-label": g("Cached uncompensated and compensated density biplot; {source} on x, {receiver} on y", {
        source: r,
        receiver: a
      }),
      children: /* @__PURE__ */ e.jsx(
        "div",
        {
          ref: k,
          className: "gl-comp-biplot-surface gl-comp-cached-biplot",
          "data-cache-mode": "dual-canvas"
        }
      )
    }
  );
}
function Zi({
  preview: n,
  sourceLabel: s,
  receiverLabel: r,
  kind: a,
  densitySmoothing: o,
  compact: c = !1,
  compensatedTitle: d = "Compensated"
}) {
  const { t: m } = Le(), g = n.eventCount > 0 ? n.original.zeroPile.receiver / n.eventCount * 100 : 0, f = n.eventCount > 0 ? n.compensated.zeroPile.receiver / n.eventCount * 100 : 0, w = f - g;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${c ? " is-compact" : ""}`, children: [
    !c && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: m("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: n.eventCount.toLocaleString(),
      sampled: n.totalEvents > n.eventCount ? m(" sampled from {total}", { total: n.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        ht,
        {
          title: m("Original"),
          panel: n.original,
          preview: n,
          sourceLabel: s,
          receiverLabel: r,
          densitySmoothing: o,
          showZeroPile: !c
        }
      ),
      /* @__PURE__ */ e.jsx(
        ht,
        {
          title: d,
          panel: n.compensated,
          preview: n,
          sourceLabel: s,
          receiverLabel: r,
          densitySmoothing: o,
          showZeroPile: !c
        }
      )
    ] }),
    !c && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-diagnostic-note", children: a === "cytof" ? /* @__PURE__ */ e.jsx(e.Fragment, { children: m("Receiver events at exact zero: {original}% → {compensated}% ({delta} percentage points). A rise can be consistent with NNLS over-subtraction, while a residual source-associated rise can be consistent with under-compensation. Neither is a verdict without a suitable negative/control population.", {
      original: g.toFixed(1),
      compensated: f.toFixed(1),
      delta: `${w >= 0 ? "+" : ""}${w.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: m("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: d
    }) }) }),
    !c && (n.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": m("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: m("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: m("{value} MAD", { value: ne(n.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: m("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: ne(n.evidence.residualSlope ?? 0, 4) })
      ] }),
      n.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: m("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: m("{value} MAD", { value: ne(n.evidence.upperTailExcessMad, 3) }) })
      ] }),
      n.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: m("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: m("{value} MAD", { value: ne(n.evidence.upperTailSlopeDeltaMad, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: m("Evidence groups") }),
        /* @__PURE__ */ e.jsx("dd", { children: m("{high} source-high · {low} source-low", {
          high: n.evidence.sourceHighEvents.toLocaleString(),
          low: n.evidence.sourceLowEvents.toLocaleString()
        }) })
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-evidence-insufficient", children: m("Residual screening needs distinct source-low/source-high groups and enough receiver-negative events; this pair remains available for visual review.") }))
  ] });
}
function Br({
  matrixView: n,
  sourceChannels: s,
  receiverChannels: r,
  selectedSourceIndex: a,
  selectedReceiverIndex: o,
  stagedCoefficients: c,
  maximumAbsoluteOffDiagonal: d,
  onSelect: m
}) {
  const { t: g } = Le(), f = 6, w = 74, k = 44, v = 10, C = r.length * f, T = s.length * f, P = w + C + w, $ = k + T + v, E = M.useMemo(() => {
    const F = [];
    for (let N = 0; N < n.matrix.length; N++)
      for (let A = 0; A < n.matrix[N].length; A++) {
        const K = n.sourceAxisKeys[N], O = n.receiverAxisKeys[A], D = `${K}${Wi}${O}`, q = c[D] ?? n.matrix[N][A], J = K === O;
        if (!J && (!Number.isFinite(q) || q === 0)) continue;
        const Z = d > 0 && Number.isFinite(q) ? Math.min(1, Math.abs(q) / d) : 0, i = Z > 0 ? 0.12 + 0.82 * Math.sqrt(Z) : 0;
        F.push({
          sourceIndex: N,
          receiverIndex: A,
          pairKey: D,
          value: q,
          diagonal: J,
          fill: J ? "#cfd4db" : Number.isFinite(q) ? q < 0 ? `rgba(47,128,237,${i})` : `rgba(211,47,47,${i})` : "#ae3e3e"
        });
      }
    return F;
  }, [n, d, c]), I = (F) => {
    const N = F.currentTarget.getBoundingClientRect();
    if (!(N.width > 0) || !(N.height > 0)) return;
    const A = (F.clientX - N.left) * P / N.width, K = (F.clientY - N.top) * $ / N.height, O = Math.floor((A - w) / f), D = Math.floor((K - k) / f);
    D < 0 || D >= s.length || O < 0 || O >= r.length || n.sourceAxisKeys[D] === n.receiverAxisKeys[O] || m(`${n.sourceAxisKeys[D]}${Wi}${n.receiverAxisKeys[O]}`);
  };
  return /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-mini-matrix", "aria-labelledby": "comp-mini-matrix-heading", children: [
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-mini-matrix-head", children: [
      /* @__PURE__ */ e.jsx("strong", { id: "comp-mini-matrix-heading", children: g("Matrix map") }),
      /* @__PURE__ */ e.jsx("span", { children: g("Source ↓ · receiver → · click a cell") })
    ] }),
    /* @__PURE__ */ e.jsxs(
      "svg",
      {
        width: P,
        height: $,
        viewBox: `0 0 ${P} ${$}`,
        role: "img",
        "aria-label": g("Mini compensation matrix with {sources} source rows and {receivers} receiver columns", {
          sources: s.length,
          receivers: r.length
        }),
        onPointerDown: I,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: w, y: k, width: C, height: T, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          r.map((F, N) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: w + (N + 0.55) * f,
              y: k - 3,
              transform: `rotate(-58 ${w + (N + 0.55) * f} ${k - 3})`,
              textAnchor: "start",
              className: N === o ? "is-selected" : void 0,
              children: F.pnn
            },
            F.key
          )),
          s.map((F, N) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: w - 3,
              y: k + (N + 0.72) * f,
              textAnchor: "end",
              className: N === a ? "is-selected" : void 0,
              children: F.pnn
            },
            F.key
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: w,
              y: k + a * f,
              width: C,
              height: f,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: w + o * f,
              y: k,
              width: f,
              height: T,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          E.map((F) => /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: w + F.receiverIndex * f,
              y: k + F.sourceIndex * f,
              width: f,
              height: f,
              fill: F.fill,
              pointerEvents: "none",
              children: /* @__PURE__ */ e.jsx("title", { children: F.diagonal ? g("{channel} · self", { channel: s[F.sourceIndex].combined }) : `${s[F.sourceIndex].combined} → ${r[F.receiverIndex].combined} · ${en(F.value)}` })
            },
            F.pairKey
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: w + o * f,
              y: k + a * f,
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
function Gr({
  dataset: n,
  pair: s,
  plotSize: r,
  densitySmoothing: a,
  flagged: o,
  selected: c,
  onSelect: d,
  onFlag: m
}) {
  const { t: g } = Le(), f = M.useRef(null), [w, k] = M.useState(() => typeof IntersectionObserver > "u");
  M.useEffect(() => {
    const T = f.current;
    if (!T || typeof IntersectionObserver > "u") {
      k(!0);
      return;
    }
    const P = new IntersectionObserver(
      ($) => k($.some((E) => E.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return P.observe(T), () => P.disconnect();
  }, []);
  const v = M.useMemo(
    () => w ? as(n, s.source.key, s.receiver.key) : null,
    [n, s.receiver.key, s.source.key, w]
  ), C = v != null && v.ready ? v.preview : null;
  return /* @__PURE__ */ e.jsxs(
    "article",
    {
      ref: f,
      className: `gl-comp-global-tile${c ? " is-selected" : ""}${o ? " is-flagged" : ""}`,
      "data-pair-key": s.pairKey,
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
              title: `${s.source.combined} → ${s.receiver.combined}`,
              "aria-label": g("Open details for {source} to {receiver}", {
                source: s.source.label,
                receiver: s.receiver.label
              }),
              children: [
                /* @__PURE__ */ e.jsxs("span", { children: [
                  s.source.label,
                  " → ",
                  s.receiver.label
                ] }),
                /* @__PURE__ */ e.jsxs("strong", { children: [
                  (s.coefficient * 100).toFixed(1),
                  "%"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx("label", { title: g("Keep this pair in Flagged"), children: /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: o,
              "aria-label": g("Flag global inspector pair {source} to {receiver} for follow-up", {
                source: s.source.label,
                receiver: s.receiver.label
              }),
              onChange: (T) => m(T.currentTarget.checked)
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-comp-global-plot-button",
            onClick: d,
            title: g("{source} → {receiver} · {interaction}matrix {coefficient}%", {
              source: s.source.combined,
              receiver: s.receiver.combined,
              interaction: s.interaction && s.interaction !== "other" ? `${s.interaction} · ` : "",
              coefficient: (s.coefficient * 100).toFixed(1)
            }),
            "aria-label": g("Open details for {source} to {receiver}; matrix coefficient {coefficient}%", {
              source: s.source.label,
              receiver: s.receiver.label,
              coefficient: (s.coefficient * 100).toFixed(1)
            }),
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: r, height: r }, children: C ? /* @__PURE__ */ e.jsx(
              Vr,
              {
                title: "",
                preview: C,
                sourceLabel: s.source.label,
                receiverLabel: s.receiver.label,
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
function Wr({
  stateKey: n,
  header: s,
  children: r
}) {
  const { t: a } = Le(), [o, c] = me(
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
          s,
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
const Zr = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, Hr = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], Oe = "", Hi = 2500, Yi = 400, Yr = 2500, Xi = 15e3, Ji = [2500, 5e3, 15e3, 5e4], Xr = 24, Qi = 4, es = 624, Jr = Object.freeze({});
function ns(n) {
  if (!Number.isFinite(n)) return String(n);
  const s = n * 100;
  if (s === 0) return "0.0";
  const r = Math.abs(s), a = r >= 1 ? 1 : r >= 0.1 ? 2 : 3;
  return s.toFixed(a);
}
function _t(n) {
  return n.replace(/(?: · (?:edited|revised))+$/u, "");
}
function pt(n, s) {
  const r = n.index(s), a = r === void 0 ? void 0 : n.channels[r], o = (a == null ? void 0 : a.pnn) ?? s, c = n.labelForKey(s), d = ((a == null ? void 0 : a.label) ?? "").trim() || ((a == null ? void 0 : a.marker) ?? "").trim(), m = d && d !== o ? `${d} (${o})` : o;
  return { key: s, pnn: o, label: c, combined: m };
}
function Ut(n, s) {
  const r = n.channels.find((a) => a.pnn === s);
  return pt(n, (r == null ? void 0 : r.key) ?? s);
}
function Qr(n, s) {
  return n === "cytof-spillover" && s === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function ea(n) {
  return n.replaceAll("-", " ");
}
function Yt(n) {
  if (n.length === 0) return 0;
  n.sort((r, a) => r - a);
  const s = Math.floor(n.length / 2);
  return n.length % 2 === 0 ? (n[s - 1] + n[s]) / 2 : n[s];
}
function na(n) {
  return Object.fromEntries(n.scientific.solverSettings.map(({ key: s, value: r }) => [s, r]));
}
function ta(n, s) {
  const r = Object.freeze({ ...n.scientific.matrix, matrix: s }), a = na(n);
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
function ts(n, s, r, a) {
  const o = n.scientific.matrix.sourceChannels.indexOf(s), c = n.scientific.matrix.receiverChannels.indexOf(r);
  if (o < 0 || c < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(n.scientific.matrix.matrix.map(
    (d, m) => Object.freeze(d.map((g, f) => m === o && f === c ? a : g))
  ));
}
function ia(n, s, r) {
  var d;
  if (!n) return null;
  const a = n.scientific.matrix.sourceChannels.indexOf(s), o = n.scientific.matrix.receiverChannels.indexOf(r);
  if (a < 0 || o < 0) return null;
  const c = (d = n.scientific.matrix.matrix[a]) == null ? void 0 : d[o];
  return Number.isFinite(c) ? c : null;
}
function is(n, s, r) {
  const a = Math.max(Math.abs(n), Math.abs(s), 1e-3);
  return Object.freeze(r === "cytof" ? { lower: 0, upper: Math.max(n + a, a * 2) } : { lower: n - a, upper: n + a });
}
function sa(n, s) {
  const r = (s - n) / 3;
  return Object.freeze([n, n + r, n + 2 * r, s]);
}
function ra(n, s) {
  return n.length === s.length && n.every((r, a) => {
    var o;
    return r.length === ((o = s[a]) == null ? void 0 : o.length) && r.every((c, d) => c === s[a][d]);
  });
}
function aa(n, s) {
  if (n.compensatedLayerStatus().state !== "ready" || s.length === 0 || n.fcs.nEvents === 0) return null;
  const a = s.flatMap((k) => {
    const v = n.channels.findIndex((C) => C.pnn === k);
    return v < 0 ? [] : [v];
  });
  if (a.length === 0) return null;
  const o = Math.min(2048, n.fcs.nEvents), c = [];
  let d = 0, m = 0, g = 0, f = "", w = -1;
  for (const k of a) {
    const v = n.originalColumnData(k), C = n.compensatedColumnData(k), T = [];
    for (let $ = 0; $ < o; $++) {
      const E = o === 1 ? 0 : Math.floor($ * (n.fcs.nEvents - 1) / (o - 1)), I = v[E], F = C[E], N = Math.abs(F - I);
      T.push(N), c.push(N), N > Math.max(1e-6, Math.abs(I) * 1e-6) && d++, I < 0 && F === 0 && g++, m = Math.max(m, N);
    }
    const P = Yt(T);
    P > w && (w = P, f = pt(n, n.channels[k].key).combined);
  }
  return {
    previewEvents: o,
    comparedValues: c.length,
    changedValues: d,
    medianAbsoluteDelta: Yt(c),
    maxAbsoluteDelta: m,
    zeroedNegativeValues: g,
    mostChangedChannel: f,
    mostChangedChannelMedianDelta: Math.max(0, w)
  };
}
function oa(n, s) {
  return n.origin.type === "uploaded" ? n.origin.fileName : n.origin.type === "embedded-fcs" ? `${n.origin.fileName} · ${s("embedded FCS")}` : `${n.origin.presetId} · ${s("bundled preset")} ${n.origin.presetVersion}`;
}
function la(n) {
  if (!n || n.kind !== "cytof-spillover")
    return { draft: null, error: null };
  const s = {
    input: {
      sourceChannels: n.sourceChannels,
      receiverChannels: n.receiverChannels,
      matrix: n.matrix
    },
    format: {
      delimiter: "csv",
      sourceColumnHeader: "source"
    }
  }, r = qt(
    s.input,
    "cytof-spillover"
  );
  return r.ok ? {
    draft: {
      fileName: n.name,
      source: "host",
      parsed: s,
      matrix: r.value,
      validationWarnings: r.warnings
    },
    error: null
  } : {
    draft: null,
    error: `The SCE spillover matrix is invalid. ${r.errors.map(({ message: a }) => a).join(" ")}`
  };
}
function ca({
  sample: n,
  sampleName: s = "sample.fcs",
  hostedCompensationMatrix: r = null,
  compensationOn: a,
  onApplyProfile: o,
  existingHostAssays: c = [],
  onAdoptExistingAssay: d,
  onCancelApply: m,
  hasExistingGates: g = !1,
  applyStatus: f = null,
  installedProfile: w = null,
  applyTargetCount: k = 1,
  applyTargetEventCount: v,
  applyWorkerCount: C,
  applyWorkerLimit: T,
  onApplyWorkerCountChange: P,
  installedBaselineProfile: $ = null,
  reviewPopulations: E = [],
  reviewPopulationMasks: I = Jr,
  onPreviewCompensationCandidate: F,
  onSolveCompensationSweep: N,
  onCancelCompensationSweep: A,
  onSuspendBackgroundWork: K,
  visible: O = !0,
  stateKey: D,
  densityColorPower: q = Xt,
  channelLabelMode: J = "marker",
  onDensityColorPowerChange: Z = () => {
  }
}) {
  var Ai, Ti;
  const { t: i } = Le(), R = n.compensatedLayerStatus(), ge = R.state === "missing" ? null : R.metadata, _ = (ge == null ? void 0 : ge.runtimeIdentity) === "profile" ? ge : null, j = (w == null ? void 0 : w.profileId) === (_ == null ? void 0 : _.profileId) ? w : null, H = !_ && n.instrument === "flow" ? n.spillover : null, ue = (r == null ? void 0 : r.kind) === "flow-spillover" ? r : null, pn = M.useMemo(
    () => la(r),
    [r]
  ), [Se, je] = me(
    `compensation.${D}.selectedPair`,
    null
  ), [mt, Te] = M.useState(null), [zn, ti] = me(
    `compensation.${D}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [mn, ii] = me(
    "compensation.inspectorWidth",
    es
  ), [Me, _n] = me(
    `compensation.${D}.workspaceView`,
    "matrix"
  ), [Fe, Un] = me(
    `compensation.${D}.globalPairFilter`,
    "relevant"
  ), [$e, cs] = me(
    `compensation.${D}.globalLayout`,
    "compact"
  ), [ds, us] = me(
    "compensation.globalPlotSize.v5",
    160
  ), [hs, ps] = me(
    "compensation.densitySmoothing.v3",
    6
  ), [ms, fs] = me(
    "compensation.pointAlpha.v1",
    0.85
  ), [ft, gs] = me(
    "compensation.pairPreviewEventLimit.v1",
    Xi
  ), [kn, si] = M.useState(""), [An, gt] = M.useState(!1), [xt, ri] = M.useState(null), [fn, vt] = me(
    `compensation.${D}.reviewPopulation`,
    "all"
  ), [qn, xs] = me(
    `compensation.${D}.flaggedPairs`,
    []
  ), [ze, vs] = me(
    `compensation.${D}.evidenceMode`,
    "biological"
  ), [bs, ys] = me(
    `compensation.${D}.sweepBounds`,
    {}
  ), [bt, yt] = me(
    `compensation.${D}.sweepWorkers`,
    2
  ), [Ee, ai] = M.useState(""), [we, jt] = M.useState(""), [js, wt] = M.useState(0), [Y, Vn] = M.useState({}), [ws, nn] = M.useState({}), [_e, tn] = M.useState({ state: "idle" }), [Ns, Be] = M.useState({}), [Cs, sn] = M.useState({}), [ve, gn] = M.useState(null), [Ss, Tn] = M.useState(null), [le, xn] = M.useState(null), [oi, xe] = M.useState(null), [Bn, Nt] = M.useState(""), [Ms, li] = M.useState(!1), [Es, ci] = M.useState(!1), ke = M.useRef(0), vn = M.useRef(0), [di, he] = M.useState(null), [ui, Ue] = M.useState(!1), [W, Gn] = M.useState(
    () => pn.draft
  ), [Fn, rn] = M.useState(
    () => {
      var p;
      const t = ((p = pn.draft) == null ? void 0 : p.matrix.receiverChannels) ?? [], l = /* @__PURE__ */ new Map();
      for (const h of n.channels) {
        const x = h.pnn.trim().normalize("NFC");
        l.set(x, (l.get(x) ?? 0) + 1);
      }
      return new Set(t.filter((h) => l.get(h) === 1));
    }
  ), [hi, Ge] = M.useState(
    () => pn.error
  ), [We, bn] = M.useState(!1), [Wn, pi] = M.useState(
    () => {
      var t;
      return ((t = c[0]) == null ? void 0 : t.id) ?? "";
    }
  ), [Ct, Zn] = M.useState(!1), [Hn, Ne] = M.useState(null), [ks, Ze] = M.useState(!1), [As, He] = M.useState(null), qe = M.useRef(!1), St = M.useRef(null), mi = M.useRef(null), yn = M.useRef(null), V = ks || f !== null, Ye = Math.max(0, Math.floor(k)), Ts = Math.max(
    0,
    Math.floor(v ?? n.fcs.nEvents)
  ), Xe = c.find(
    ({ id: t }) => t === Wn
  ) ?? c[0] ?? null;
  M.useEffect(() => {
    var t;
    Wn && c.some(({ id: l }) => l === Wn) || (pi(((t = c[0]) == null ? void 0 : t.id) ?? ""), Zn(!1));
  }, [c, Wn]);
  const te = f ?? (Hn ? {
    phase: "applying",
    profileName: As ?? (W == null ? void 0 : W.fileName) ?? "Compensation",
    fraction: Hn.fraction,
    processedEvents: Hn.processedEvents,
    totalEvents: Hn.totalEvents
  } : null);
  M.useEffect(() => {
    O || (vn.current++, ke.current++, tn({ state: "idle" }), xn(null), gn(null), K == null || K());
  }, [K, O]);
  const Mt = M.useMemo(
    () => n.channels.map(({ pnn: t, columnIndex: l }) => ({ pnn: t, columnIndex: l })),
    [n]
  ), Pe = M.useMemo(() => {
    if (!H) return null;
    const t = H.channels.map((h) => {
      const x = n.index(h);
      return x === void 0 ? null : n.channels[x].pnn;
    });
    if (t.some((h) => h === null))
      return {
        validation: null,
        error: "The embedded matrix could not be mapped back to exact FCS channel identities.",
        keyword: void 0
      };
    const l = qt({
      sourceChannels: t,
      receiverChannels: t,
      matrix: H.matrix
    }, "flow-spillover"), p = ["$SPILLOVER", "$SPILL", "SPILL"].find((h) => typeof n.fcs.keywords[h] == "string");
    return {
      validation: l,
      error: l.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${l.errors.map(({ message: h }) => h).join(" ")}`,
      keyword: p
    };
  }, [n, H]), X = fn === "all" ? null : E.find(({ id: t }) => t === fn) ?? null, ce = X ? I[X.id] ?? null : null, re = ce ? (X == null ? void 0 : X.eventCount) ?? 0 : n.fcs.nEvents, Yn = ft === "all" ? "all" : Ji.includes(Number(ft)) ? Number(ft) : Xi, $n = M.useMemo(
    () => dn(
      n.fcs.nEvents,
      Yn === "all" ? Math.max(1, n.fcs.nEvents) : Yn,
      ce
    ),
    [Yn, re, ce, n]
  ), Pn = M.useMemo(
    () => dn(n.fcs.nEvents, 2048, ce),
    [ce, n]
  ), Et = M.useMemo(
    () => dn(
      n.fcs.nEvents,
      Yr,
      ce
    ),
    [ce, n]
  );
  M.useEffect(() => {
    fn !== "all" && !E.some(({ id: t }) => t === fn) && vt("all");
  }, [fn, E, vt]), M.useEffect(() => {
    ke.current++, A == null || A(), Be({}), sn({}), gn(null), xn(null), xe(null);
  }, [fn, ce, A]);
  const ae = M.useMemo(() => W ? sr({
    kind: "cytof-spillover",
    matrix: W.matrix,
    sampleChannels: Mt,
    includedChannels: Array.from(Fn)
  }) : null, [W, Fn, Mt, J]), u = M.useMemo(() => {
    if (H) {
      const l = n.spilloverOrigin, p = l.kind === "external" ? l : null;
      return {
        sourceAxisKeys: H.channels,
        receiverAxisKeys: H.channels,
        sourceChannels: H.channels.map((h) => pt(n, h)),
        receiverChannels: H.channels.map((h) => pt(n, h)),
        matrix: H.matrix,
        kind: "flow",
        title: ue ? "SCE spillover matrix" : p ? `Compensation matrix from ${p.label}` : "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: p ? "This FCS carries no spillover matrix of its own; these coefficients came from the imported FlowJo workspace and are applied unchanged." + (p.droppedChannels.length ? ` ${p.droppedChannels.length} of its parameter(s) are not in this file (${p.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "") : "Applying the embedded matrix leaves its coefficients unchanged."
      };
    }
    if (!j || !_) return null;
    const t = j.scientific.kind === "cytof-spillover" ? jr(j.scientific.matrix) : j.scientific.matrix;
    return t.matrix.length !== t.sourceChannels.length || t.matrix.some((l) => !l || l.length !== t.receiverChannels.length) ? null : {
      sourceAxisKeys: t.sourceChannels,
      receiverAxisKeys: t.receiverChannels,
      sourceChannels: t.sourceChannels.map((l) => Ut(n, l)),
      receiverChannels: t.receiverChannels.map((l) => Ut(n, l)),
      matrix: t.matrix,
      kind: j.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: j.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: j.scientific.kind === "cytof-spillover" ? i("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: t.sourceChannels.length,
        receivers: t.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: j.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [ue, _, j, n, H, i, J]), oe = (u == null ? void 0 : u.sourceChannels) ?? [], de = (u == null ? void 0 : u.receiverChannels) ?? [];
  M.useEffect(() => {
    yt((t) => Math.max(1, Math.min(Qi, Math.round(t) || 1)));
  }, [yt]);
  const Xn = mt ?? Se, b = M.useMemo(() => {
    if (!u || !Xn) return null;
    const [t, l] = Xn.split(Oe), p = u.sourceAxisKeys.indexOf(t), h = u.receiverAxisKeys.indexOf(l);
    return p < 0 || h < 0 || u.sourceAxisKeys[p] === u.receiverAxisKeys[h] ? null : {
      pairKey: Xn,
      sourceIndex: p,
      receiverIndex: h,
      source: oe[p],
      receiver: de[h],
      value: u.matrix[p][h],
      interaction: u.kind === "cytof" ? Cn(
        u.sourceAxisKeys[p],
        u.receiverAxisKeys[h]
      ) : null
    };
  }, [Xn, u, de, oe]);
  M.useEffect(() => {
    if (!b) {
      Nt("");
      return;
    }
    const t = Y[b.pairKey];
    Nt(ne((t ?? b.value) * 100, 6));
  }, [b == null ? void 0 : b.pairKey, b == null ? void 0 : b.value, Y]);
  const be = M.useMemo(() => b ? Dt(
    n,
    b.source.key,
    b.receiver.key,
    {
      eventMask: ce,
      fixedEventIndices: $n,
      eligibleEventCount: re
    }
  ) : null, [a, R.state, $n, re, ce, n, b]), Ce = M.useMemo(() => {
    if (!u || R.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const t = [];
    for (let x = 0; x < u.matrix.length; x++)
      for (let y = 0; y < u.matrix[x].length; y++) {
        const S = u.sourceAxisKeys[x], L = u.receiverAxisKeys[y];
        if (S === L) continue;
        const U = u.matrix[x][y];
        if (!Number.isFinite(U)) continue;
        const z = u.kind === "cytof" ? Cn(S, L) : null, G = z !== null && z !== "self" && z !== "other";
        U === 0 && !G && ze === "biological" || t.push({
          sourceIndex: x,
          receiverIndex: y,
          pairKey: `${S}${Oe}${L}`,
          source: oe[x],
          receiver: de[y],
          coefficient: U,
          interaction: z,
          physicalPrior: G ? 1 : 0
        });
      }
    t.sort((x, y) => y.physicalPrior - x.physicalPrior || Math.abs(y.coefficient) - Math.abs(x.coefficient));
    const l = t.slice(0, 240), p = l.flatMap((x) => {
      const y = Dt(
        n,
        x.source.key,
        x.receiver.key,
        {
          eventMask: ce,
          fixedEventIndices: Pn,
          eligibleEventCount: re
        }
      );
      return y.ready ? [{ ...x, evidence: y.preview.evidence }] : [];
    }), h = Tr(
      p.map(({ coefficient: x, physicalPrior: y, evidence: S }) => ({ coefficient: x, physicalPrior: y, evidence: S })),
      u.kind,
      ze
    ).map(({ index: x, relativePriority: y }) => ({ ...p[x], relativePriority: y }));
    return {
      candidateCount: t.length,
      screenedCount: l.length,
      evaluableCount: p.length,
      items: h.slice(0, 8)
    };
  }, [js, ze, R.state, u, de, Pn, re, ce, n, oe]), ie = M.useMemo(() => new Set(
    j ? j.scientific.kind === "flow-spillover" ? j.scientific.matrix.receiverChannels : j.scientific.includedChannels : []
  ), [j]), se = M.useMemo(() => u ? Ir(
    n,
    Array.from(/* @__PURE__ */ new Set([
      ...u.sourceAxisKeys,
      ...u.receiverAxisKeys
    ])),
    {
      eventMask: ce,
      fixedEventIndices: Et,
      eligibleEventCount: re
    }
  ) : null, [
    a,
    Et,
    R.state,
    u,
    re,
    ce,
    n
  ]);
  M.useEffect(() => {
    if (!u || ie.size === 0) return;
    const t = ie.has(Ee) ? Ee : u.sourceAxisKeys.find((p) => ie.has(p)) ?? "", l = ie.has(we) && we !== t ? we : u.receiverAxisKeys.find((p) => p !== t && ie.has(p)) ?? "";
    t !== Ee && ai(t), l !== we && jt(l);
  }, [ie, we, Ee, u]);
  const jn = M.useMemo(() => new Set(qn), [qn]), kt = M.useMemo(() => {
    var p;
    if (!u) return [];
    const t = [], l = ie.size > 0;
    for (let h = 0; h < u.sourceAxisKeys.length; h++) {
      const x = u.sourceAxisKeys[h];
      if (!(l && !ie.has(x)))
        for (let y = 0; y < u.receiverAxisKeys.length; y++) {
          const S = u.receiverAxisKeys[y];
          if (x === S || l && !ie.has(S)) continue;
          const L = (p = u.matrix[h]) == null ? void 0 : p[y];
          if (!Number.isFinite(L)) continue;
          const U = oe[h], z = de[y];
          if (!U || !z || se != null && se.ready && (!se.dataset.channels.has(U.key) || !se.dataset.channels.has(z.key))) continue;
          const G = u.kind === "cytof" ? Cn(x, S) : null, ee = G !== null && G !== "self" && G !== "other";
          t.push({
            sourceIndex: h,
            receiverIndex: y,
            pairKey: `${x}${Oe}${S}`,
            source: U,
            receiver: z,
            coefficient: L,
            interaction: G,
            physicalPrior: ee ? 1 : 0
          });
        }
    }
    return t;
  }, [se, ie, u, de, oe]), Ie = M.useMemo(() => {
    const t = kn.trim().toLocaleLowerCase();
    return kt.filter((l) => {
      const p = Math.abs(l.coefficient) > 1e-12, h = l.physicalPrior > 0;
      return Fe === "all" || Fe === "relevant" && (p || h) || Fe === "nonzero" && p || Fe === "physical" && h || Fe === "flagged" && jn.has(l.pairKey) ? t ? `${l.source.combined} ${l.receiver.combined}`.toLocaleLowerCase().includes(t) : !0 : !1;
    });
  }, [jn, kt, Fe, kn]);
  M.useEffect(() => {
    var l;
    if (!xt || Me !== "global") return;
    const t = [...((l = yn.current) == null ? void 0 : l.querySelectorAll(".gl-comp-global-tile")) ?? []].find((p) => p.dataset.pairKey === xt);
    t && (t.scrollIntoView({ block: "center", inline: "center" }), ri(null));
  }, [An, $e, xt, Ie, Me]);
  const At = M.useMemo(() => {
    if ($e === "compact") return [];
    const t = /* @__PURE__ */ new Map();
    for (const l of Ie) {
      const p = $e === "source" ? l.source : l.receiver, h = t.get(p.key);
      h ? h.pairs.push(l) : t.set(p.key, { channel: p, pairs: [l] });
    }
    return [...t.values()];
  }, [$e, Ie]), fi = M.useMemo(
    () => $e === "compact" ? Ie : At.flatMap((t) => t.pairs),
    [At, $e, Ie]
  ), gi = `${i(Zr[Fe])}${kn.trim() ? i(" · search “{query}”", { query: kn.trim() }) : ""}`, Tt = Math.max(120, Math.min(220, Math.round(ds) || 120)), Je = Math.max(1, Math.min(10, Math.round(hs) || 6)), Jn = Math.max(0.1, Math.min(1, Number(ms) || 0.85)), Q = M.useMemo(() => !j || !u || R.state !== "ready" ? [] : qn.flatMap((t) => {
    const [l, p] = t.split(Oe), h = u.sourceAxisKeys.indexOf(l), x = u.receiverAxisKeys.indexOf(p);
    if (h < 0 || x < 0 || l === p || !ie.has(l) || !ie.has(p)) return [];
    const y = Dt(
      n,
      oe[h].key,
      de[x].key,
      {
        eventMask: ce,
        fixedEventIndices: Pn,
        eligibleEventCount: re
      }
    );
    if (!y.ready) return [];
    const S = Ce.items.find((L) => L.pairKey === t);
    return [{
      sourceIndex: h,
      receiverIndex: x,
      pairKey: t,
      source: oe[h],
      receiver: de[x],
      coefficient: u.matrix[h][x],
      interaction: u.kind === "cytof" ? Cn(l, p) : null,
      physicalPrior: u.kind === "cytof" && Cn(l, p) !== "other" ? 1 : 0,
      evidence: y.preview.evidence,
      relativePriority: (S == null ? void 0 : S.relativePriority) ?? 0
    }];
  }), [qn, ie, R.state, u, j, de, Ce.items, Pn, re, ce, n, oe]), Ke = Q, xi = M.useMemo(() => {
    if (!j) return 0.01;
    const t = [];
    for (let l = 0; l < j.scientific.matrix.matrix.length; l++) {
      const p = j.scientific.matrix.sourceChannels[l];
      for (let h = 0; h < j.scientific.matrix.matrix[l].length; h++) {
        if (p === j.scientific.matrix.receiverChannels[h]) continue;
        const x = Math.abs(j.scientific.matrix.matrix[l][h]);
        Number.isFinite(x) && x > 1e-12 && t.push(x);
      }
    }
    return t.length > 0 ? Yt(t) : 0.01;
  }, [j]), Ft = (t, l) => {
    const p = bs[t];
    if (p) return p;
    const h = is(l, xi, (u == null ? void 0 : u.kind) ?? "flow");
    return {
      lowerPercent: ne(h.lower * 100, 5),
      upperPercent: ne(h.upper * 100, 5)
    };
  }, In = (t, l) => {
    const p = Ft(t, l), h = Number(p.lowerPercent) / 100, x = Number(p.upperPercent) / 100;
    return !Number.isFinite(h) || !Number.isFinite(x) ? { lower: h, upper: x, error: "Enter finite lower and upper sweep bounds." } : (u == null ? void 0 : u.kind) === "cytof" && h < 0 ? { lower: h, upper: x, error: "CyTOF NNLS sweep bounds cannot be negative." } : x > h ? { lower: h, upper: x, error: null } : { lower: h, upper: x, error: "The upper sweep bound must be greater than the lower bound." };
  }, Qn = (t, l, p, h) => {
    ys((x) => ({
      ...x,
      [t]: {
        ...x[t] ?? (() => {
          const y = is(l, xi, (u == null ? void 0 : u.kind) ?? "flow");
          return {
            lowerPercent: ne(y.lower * 100, 5),
            upperPercent: ne(y.upper * 100, 5)
          };
        })(),
        [p]: h
      }
    })), Be((x) => {
      if (!(t in x)) return x;
      const y = { ...x };
      return delete y[t], y;
    }), sn((x) => {
      if (!(t in x)) return x;
      const y = { ...x };
      return delete y[t], y;
    });
  }, Kn = (t, l) => {
    xs((p) => l ? p.includes(t) ? p : [...p, t] : p.filter((h) => h !== t)), l ? (je(t), Tn(t)) : (Be((p) => {
      if (!(t in p)) return p;
      const h = { ...p };
      return delete h[t], h;
    }), sn((p) => {
      if (!(t in p)) return p;
      const h = { ...p };
      return delete h[t], h;
    }));
  }, Fs = () => {
    if (!u || !Ee || !we || Ee === we) return;
    if (!ie.has(Ee) || !ie.has(we)) {
      xe("Both channels must be included in the installed compensation solve.");
      return;
    }
    const t = `${Ee}${Oe}${we}`;
    Kn(t, !0), xe(null);
  }, $t = Ke.reduce((t, l) => t + (In(l.pairKey, l.coefficient).error ? 1 : 0), 0), wn = M.useMemo(() => {
    if (!j) return null;
    const t = j.scientific.matrix.matrix.map((l) => Array.from(l));
    for (const [l, p] of Object.entries(Y)) {
      const [h, x] = l.split(Oe), y = j.scientific.matrix.sourceChannels.indexOf(h), S = j.scientific.matrix.receiverChannels.indexOf(x);
      y >= 0 && S >= 0 && (t[y][S] = p);
    }
    return Object.freeze(t.map((l) => Object.freeze(l)));
  }, [j, Y]);
  M.useEffect(() => {
    const t = Object.keys(Y).length;
    if (!O || t === 0 || !j || j.scientific.kind !== "flow-spillover" || R.state !== "ready" || !wn || !b || !F) {
      vn.current++, tn({ state: "idle" });
      return;
    }
    const l = $n;
    if (l.length === 0) {
      tn({
        state: "error",
        pairKey: b.pairKey,
        message: i("The selected review population contains no events.")
      });
      return;
    }
    const p = ++vn.current, h = b.pairKey;
    tn((y) => ({
      state: "updating",
      pairKey: h,
      ...(y.state === "ready" || y.state === "updating") && y.pairKey === h && y.preview ? { preview: y.preview } : {}
    }));
    const x = window.setTimeout(() => {
      F(
        j,
        l,
        wn
      ).then((y) => {
        if (vn.current !== p) return;
        const S = y.sourceChannels.indexOf(b.source.pnn), L = y.sourceChannels.indexOf(b.receiver.pnn);
        if (S < 0 || L < 0)
          throw new Error(i("The preview result did not contain the selected flow channels."));
        const U = Lt(
          n,
          b.source.pnn,
          b.receiver.pnn,
          l,
          y.candidateColumns[S],
          y.candidateColumns[L],
          { totalEvents: re }
        );
        if (!U.ready) throw new Error(U.reason);
        tn({
          state: "ready",
          pairKey: h,
          preview: U.preview
        });
      }).catch((y) => {
        if (vn.current !== p) return;
        const S = y instanceof Error ? y.message : String(y);
        /cancel|supersed|stale/i.test(S) || tn({ state: "error", pairKey: h, message: S });
      });
    }, 90);
    return () => window.clearTimeout(x);
  }, [
    R.state,
    F,
    j,
    $n,
    re,
    n,
    n.dataRevision,
    n.displayTransformContextKey,
    n.layerRevision,
    b,
    Y,
    i,
    O,
    wn
  ]);
  const $s = M.useMemo(() => !u || Object.keys(Y).length === 0 ? null : {
    sourceChannels: u.sourceAxisKeys,
    receiverChannels: u.receiverAxisKeys,
    matrix: u.matrix.map(
      (t, l) => t.map((p, h) => {
        const x = `${u.sourceAxisKeys[l]}${Oe}${u.receiverAxisKeys[h]}`;
        return Y[x] ?? p;
      })
    )
  }, [u, Y]), vi = M.useMemo(() => {
    if (!u) return [];
    const t = [];
    for (let l = 0; l < u.matrix.length; l++)
      for (let p = 0; p < u.matrix[l].length; p++) {
        const h = u.matrix[l][p];
        u.sourceAxisKeys[l] === u.receiverAxisKeys[p] || !Number.isFinite(h) || h <= 1 || t.push(`${oe[l].combined} → ${de[p].combined}`);
      }
    return t;
  }, [u, de, oe]), Pt = M.useMemo(() => {
    if (!u) return [];
    const t = [];
    for (let l = 0; l < u.matrix.length; l++)
      for (let p = 0; p < u.matrix[l].length; p++) {
        const h = u.matrix[l][p], x = u.sourceAxisKeys[l] === u.receiverAxisKeys[p], y = `${oe[l].combined} → ${de[p].combined}`;
        Number.isFinite(h) ? x && Math.abs(h - 1) > 1e-8 ? t.push(`${oe[l].combined}: diagonal is ${en(h)}, not 100%`) : !x && h < 0 ? t.push(`${y}: negative coefficient (${en(h)})`) : !x && h > 1 && t.push(`${y}: coefficient above 100%`) : t.push(`${y}: non-finite coefficient (${String(h)})`);
      }
    return t;
  }, [u, de, oe]), bi = M.useMemo(
    () => (u == null ? void 0 : u.matrix.some((t) => t.some((l) => !Number.isFinite(l)))) ?? !1,
    [u]
  ), Ae = M.useMemo(
    () => _ && R.state === "ready" ? aa(n, _.includedPnns) : null,
    [R.state, _, n]
  ), et = M.useMemo(() => {
    const t = [...Pt];
    return R.state === "stale" && t.push(...R.reasons.map((l) => `Profile unavailable: ${ea(l)}`)), t;
  }, [R, Pt]), yi = _ ? (j == null ? void 0 : j.name) ?? "Installed compensation profile" : H ? ue ? "SCE spillover matrix" : "Embedded FCS matrix" : "No compatible matrix", Ps = _ ? Qr(_.kind, _.method) : H ? "Flow linear inverse" : "Not configured", nt = i(Ps), It = (_ == null ? void 0 : _.includedPnns.length) ?? (H == null ? void 0 : H.channels.length) ?? 0, tt = (j == null ? void 0 : j.name) ?? (_ == null ? void 0 : _.profileId) ?? yi, ji = _t(tt), Is = ji !== tt || (j == null ? void 0 : j.recordType) === "revision" ? `${ji} · ${i("revised")}` : tt, Ks = H !== null && !bi || _ !== null && R.state === "ready", wi = M.useMemo(() => {
    if (!u) return 0;
    let t = 0;
    for (let l = 0; l < u.matrix.length; l++)
      for (let p = 0; p < u.matrix[l].length; p++) {
        if (u.sourceAxisKeys[l] === u.receiverAxisKeys[p]) continue;
        const h = u.matrix[l][p];
        Number.isFinite(h) && (t = Math.max(t, Math.abs(h)));
      }
    return t;
  }, [u]), it = !!((j == null ? void 0 : j.scientific.kind) === "flow-spillover" && R.state === "ready" && u && Math.max(u.sourceAxisKeys.length, u.receiverAxisKeys.length) <= Xr), Rn = u ? it ? Math.max(42, Math.min(54, Math.floor(960 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : Math.max(13, Math.min(38, Math.floor(760 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : 13;
  M.useEffect(() => {
    Vn({}), nn({}), tn({ state: "idle" }), vn.current++;
  }, [j == null ? void 0 : j.profileId]), M.useEffect(() => {
    (u == null ? void 0 : u.kind) === "flow" && Fe === "physical" && Un("relevant");
  }, [Fe, u == null ? void 0 : u.kind, Un]);
  const Rs = (t) => {
    ti((l) => ({ ...l, [t]: !l[t] }));
  }, Ni = (t) => {
    var h;
    const l = ((h = yn.current) == null ? void 0 : h.getBoundingClientRect().width) ?? 1100, p = Math.max(360, Math.min(900, l - 440 - 8));
    return Math.max(360, Math.min(p, Math.round(t)));
  }, Os = (t) => {
    var x;
    if (t.button !== 0) return;
    t.preventDefault();
    const l = t.currentTarget;
    (x = l.setPointerCapture) == null || x.call(l, t.pointerId);
    const p = (y) => {
      var L;
      const S = (L = yn.current) == null ? void 0 : L.getBoundingClientRect();
      S && ii(Ni(S.right - y.clientX));
    }, h = () => {
      var y;
      window.removeEventListener("pointermove", p), window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", h), (y = l.releasePointerCapture) == null || y.call(l, t.pointerId);
    };
    window.addEventListener("pointermove", p), window.addEventListener("pointerup", h), window.addEventListener("pointercancel", h);
  }, Ds = (t) => {
    let l = null;
    t.key === "ArrowLeft" ? l = mn + 40 : t.key === "ArrowRight" ? l = mn - 40 : t.key === "Home" && (l = es), l !== null && (t.preventDefault(), ii(Ni(l)));
  }, Ls = async (t) => {
    var p;
    const l = (p = t.currentTarget.files) == null ? void 0 : p[0];
    if (t.currentTarget.value = "", !!l) {
      Ge(null), he(null), Ue(!1), Ne(null), bn(!1);
      try {
        const h = yr(await l.text()), x = qt(
          h.input,
          "cytof-spillover"
        );
        if (!x.ok)
          throw new Error(x.errors.map(({ message: L }) => L).join(" "));
        const y = /* @__PURE__ */ new Map();
        for (const { pnn: L } of Mt) {
          const U = L.trim().normalize("NFC");
          y.set(U, (y.get(U) ?? 0) + 1);
        }
        const S = x.value.receiverChannels.filter(
          (L) => y.get(L) === 1
        );
        Gn({
          fileName: l.name,
          source: "file",
          parsed: h,
          matrix: x.value,
          validationWarnings: x.warnings
        }), rn(new Set(S));
      } catch (h) {
        Gn(null), rn(/* @__PURE__ */ new Set()), Ge(h instanceof Error ? h.message : String(h));
      }
    }
  }, zs = (t, l) => {
    rn((p) => {
      const h = new Set(p);
      return l ? h.add(t) : h.delete(t), h;
    });
  }, Ci = async () => {
    var p, h;
    if (!W)
      throw new Error(i("Choose a CyTOF spillover matrix first."));
    const t = ((h = (p = globalThis.crypto) == null ? void 0 : p.randomUUID) == null ? void 0 : h.call(p)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, l = W.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation";
    return Pi(
      {
        kind: "cytof-spillover",
        method: "nnls",
        solverVersion: ur,
        solverSettings: hr,
        matrix: W.matrix,
        includedChannels: Array.from(Fn)
      },
      {
        profileId: `cytof-${t}`,
        name: l,
        createdAt: /* @__PURE__ */ new Date(),
        origin: {
          type: "uploaded",
          fileName: W.fileName,
          format: W.parsed.format.delimiter,
          sourceColumnHeader: W.parsed.format.sourceColumnHeader
        },
        provenance: {
          sourceDescription: W.source === "host" ? "CyTOF spillover matrix from metadata(sce)$spillover_matrix" : "User-uploaded CyTOF spillover matrix",
          estimationMethod: "Imported; coefficients preserved exactly"
        }
      }
    );
  }, _s = async () => {
    if (!(qe.current || V || !W || !(ae != null && ae.canApply) || !o)) {
      if (g && !We) {
        Ge(
          i("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      Ge(null), he(null), Ne(null), qe.current = !0, Ze(!0), He(W.fileName);
      try {
        const t = await Ci();
        await o(t, Ne), he(i("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: t.name,
          channels: Fn.size,
          files: Ye
        })), Gn(null), rn(/* @__PURE__ */ new Set()), bn(!1), Ne(null);
      } catch (t) {
        const l = t instanceof Error ? t.message : String(t);
        /cancel/i.test(l) ? he(i("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : Ge(l);
      } finally {
        qe.current = !1, Ze(!1), He(null);
      }
    }
  }, Us = async () => {
    if (!(qe.current || V || !W || !(ae != null && ae.canApply) || !Xe || !d || !Ct)) {
      if (g && !We) {
        Ge(
          i("Confirm that existing gate memberships will be recomputed in compensated coordinates before adopting the assay.")
        );
        return;
      }
      Ge(null), he(null), Ne(null), qe.current = !0, Ze(!0), He(Xe.label);
      try {
        const t = await Ci();
        await d(
          t,
          Xe,
          Ne
        ), he(i("Using existing SCE assay {assay} with {matrix}. No assay values were recomputed.", {
          assay: Xe.label,
          matrix: t.name
        })), Gn(null), rn(/* @__PURE__ */ new Set()), bn(!1), Zn(!1), Ne(null);
      } catch (t) {
        Ge(t instanceof Error ? t.message : String(t));
      } finally {
        qe.current = !1, Ze(!1), He(null);
      }
    }
  }, qs = async () => {
    var l, p, h;
    if (qe.current || V || !H || !((l = Pe == null ? void 0 : Pe.validation) != null && l.ok) || !o) return;
    if (g && !We) {
      Ue(!0), he(
        i("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const t = (ue == null ? void 0 : ue.name) || `${s.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    he(null), Ue(!1), Ne(null), qe.current = !0, Ze(!0), He(t);
    try {
      const x = ((h = (p = globalThis.crypto) == null ? void 0 : p.randomUUID) == null ? void 0 : h.call(p)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, y = await Pi(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: lr,
          solverSettings: or,
          matrix: Pe.validation.value
        },
        {
          profileId: `flow-${x}`,
          name: t,
          createdAt: /* @__PURE__ */ new Date(),
          origin: {
            ...ue ? {
              type: "uploaded",
              fileName: ue.name,
              format: "csv",
              sourceColumnHeader: "source"
            } : {
              type: "embedded-fcs",
              fileName: s,
              ...Pe.keyword ? { keyword: Pe.keyword } : {}
            }
          },
          provenance: {
            sourceDescription: ue ? "Flow spillover matrix from metadata(sce)$spillover_matrix" : "Spillover matrix embedded in the source FCS file",
            estimationMethod: ue ? "Imported from SCE metadata; coefficients preserved exactly" : "Imported from FCS; coefficients preserved exactly"
          }
        }
      );
      await o(y, Ne), bn(!1), he(i(ue ? "Flow matrix editing is ready. The exact hosted matrix is retained as the baseline, and Original measurements remain available." : "Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available."));
    } catch (x) {
      Ue(!0), he(x instanceof Error ? x.message : String(x));
    } finally {
      qe.current = !1, Ze(!1), He(null), Ne(null);
    }
  }, Si = (t, l) => {
    var x, y;
    const p = oe[t], h = de[l];
    !u || !p || !h || u.sourceAxisKeys[t] === u.receiverAxisKeys[l] || (je(`${u.sourceAxisKeys[t]}${Oe}${u.receiverAxisKeys[l]}`), (y = (x = mi.current) == null ? void 0 : x.querySelector(
      `button[data-source-index="${t}"][data-receiver-index="${l}"]`
    )) == null || y.focus());
  }, Vs = (t, l, p) => {
    if (!u) return;
    const h = u.sourceAxisKeys.length, x = u.receiverAxisKeys.length;
    let y = l, S = p;
    const L = (z, G) => {
      let ee = z + G;
      for (; ee >= 0 && ee < x; ) {
        if (u.sourceAxisKeys[l] !== u.receiverAxisKeys[ee]) return ee;
        ee += G;
      }
      return z;
    }, U = (z, G) => {
      let ee = z + G;
      for (; ee >= 0 && ee < h; ) {
        if (u.sourceAxisKeys[ee] !== u.receiverAxisKeys[p]) return ee;
        ee += G;
      }
      return z;
    };
    switch (t.key) {
      case "ArrowLeft":
        S = L(p, -1);
        break;
      case "ArrowRight":
        S = L(p, 1);
        break;
      case "ArrowUp":
        y = U(l, -1);
        break;
      case "ArrowDown":
        y = U(l, 1);
        break;
      case "Home": {
        S = u.sourceAxisKeys[l] === u.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const z = x - 1;
        S = u.sourceAxisKeys[l] === u.receiverAxisKeys[z] ? z - 1 : z;
        break;
      }
      default:
        return;
    }
    t.preventDefault(), Si(y, S);
  }, On = (t, l) => {
    if (!j || !Number.isFinite(l)) return;
    const [p, h] = t.split(Oe), x = j.scientific.matrix.sourceChannels.indexOf(p), y = j.scientific.matrix.receiverChannels.indexOf(h);
    if (x < 0 || y < 0) return;
    if (j.scientific.kind === "cytof-spillover" && l < 0) {
      Ue(!0), he(i("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const S = j.scientific.matrix.matrix[x][y];
    Vn((L) => {
      const U = { ...L };
      return l === S ? delete U[t] : U[t] = l, U;
    }), Ue(!1), he(i("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: p,
      receiver: h,
      value: (l * 100).toFixed(2)
    }));
  }, Mi = (t, l, p, h) => {
    const x = p[0];
    if (!x) return null;
    const y = x.sourceChannels.indexOf(t.source.pnn), S = x.sourceChannels.indexOf(t.receiver.pnn);
    if (y < 0 || S < 0) return null;
    const L = Lt(
      n,
      t.source.pnn,
      t.receiver.pnn,
      h,
      x.currentColumns[y],
      x.currentColumns[S],
      { totalEvents: re }
    );
    if (!L.ready) return null;
    const U = [{
      value: t.coefficient,
      isCurrent: !0,
      preview: L.preview
    }];
    return p.forEach((z, G) => {
      const ee = z.sourceChannels.indexOf(t.source.pnn), Re = z.sourceChannels.indexOf(t.receiver.pnn);
      if (ee < 0 || Re < 0) return;
      const ye = Lt(
        n,
        t.source.pnn,
        t.receiver.pnn,
        h,
        z.candidateColumns[ee],
        z.candidateColumns[Re],
        {
          totalEvents: re,
          xRange: L.preview.xRange,
          yRange: L.preview.yRange
        }
      );
      ye.ready && U.push({
        value: l[G],
        isCurrent: !1,
        preview: ye.preview
      });
    }), U.sort((z, G) => z.value - G.value || Number(G.isCurrent) - Number(z.isCurrent)), { pairKey: t.pairKey, values: Object.freeze(U) };
  }, Bs = async (t) => {
    if (!j || !u || !N || V || le || ve) return;
    const l = In(t.pairKey, t.coefficient);
    if (l.error) {
      xe(l.error);
      return;
    }
    const p = dn(
      n.fcs.nEvents,
      Yi,
      ce
    );
    if (p.length === 0) {
      xe(i("The selected review population contains no events."));
      return;
    }
    const h = ++ke.current, x = [l.lower, l.upper];
    gn(t.pairKey), xe(null);
    try {
      const y = await N(
        j,
        p,
        x.map((L) => ts(
          j,
          u.sourceAxisKeys[t.sourceIndex],
          u.receiverAxisKeys[t.receiverIndex],
          L
        )),
        void 0,
        1
      );
      if (ke.current !== h) return;
      const S = Mi(t, x, y, p);
      if (!S) throw new Error(i("The fast bounds preview could not be built for this pair."));
      sn((L) => ({ ...L, [t.pairKey]: S }));
    } catch (y) {
      if (ke.current !== h) return;
      const S = y instanceof Error ? y.message : String(y);
      xe(/cancel/i.test(S) ? i("Fast bounds preview cancelled.") : S);
    } finally {
      ke.current === h && gn(null);
    }
  }, Gs = async () => {
    var h;
    if (!j || !N || Ke.length === 0 || V || le !== null || ve !== null) return;
    if ($t > 0) {
      xe(i("Fix the sweep bounds for {count} flagged pairs before running.", { count: $t }));
      return;
    }
    const t = dn(
      n.fcs.nEvents,
      Hi,
      ce
    );
    if (t.length === 0) {
      xe(i("The selected review population contains no events."));
      return;
    }
    const l = ++ke.current, p = Ke.flatMap((x) => {
      const y = In(x.pairKey, x.coefficient);
      return sa(y.lower, y.upper).map((S) => ({
        pair: x,
        value: S,
        matrix: ts(
          j,
          u.sourceAxisKeys[x.sourceIndex],
          u.receiverAxisKeys[x.receiverIndex],
          S
        )
      }));
    });
    xe(null), Be({}), xn({ completed: 0, total: p.length });
    try {
      const x = await N(
        j,
        t,
        p.map(({ matrix: S }) => S),
        (S, L) => {
          ke.current === l && xn({ completed: S, total: L });
        },
        bt
      );
      if (ke.current !== l) return;
      if (x.length !== p.length)
        throw new Error(i("The compensation worker returned an incomplete coefficient sweep."));
      const y = {};
      for (const S of Ke) {
        const L = p.flatMap((z, G) => z.pair.pairKey === S.pairKey ? [G] : []), U = Mi(
          S,
          L.map((z) => p[z].value),
          L.map((z) => x[z]),
          t
        );
        U && (y[S.pairKey] = U);
      }
      Be(y), Tn(((h = Ke[0]) == null ? void 0 : h.pairKey) ?? null);
    } catch (x) {
      if (ke.current !== l) return;
      const y = x instanceof Error ? x.message : String(x);
      xe(/cancel/i.test(y) ? i("Exact coefficient sweep cancelled.") : y);
    } finally {
      ke.current === l && xn(null);
    }
  }, Ws = () => {
    ke.current++, A == null || A(), xn(null), gn(null), xe(i("Exact coefficient sweep cancelled."));
  }, Zs = async () => {
    var l, p;
    if (!j || !wn || !o || Object.keys(Y).length === 0) return;
    const t = `${_t(j.name)} · edited`;
    he(null), Ue(!1), Ze(!0), He(t), Ne(null);
    try {
      const x = {
        profileId: `comp-edit-${((p = (l = globalThis.crypto) == null ? void 0 : l.randomUUID) == null ? void 0 : p.call(l)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: t,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(Y).length} compensation coefficient${Object.keys(Y).length === 1 ? "" : "s"} in GateLab.`
      }, y = ($ == null ? void 0 : $.recordType) === "baseline" && ra(wn, $.scientific.matrix.matrix) ? await cr(j, $, x) : await dr(
        j,
        ta(j, wn),
        x
      );
      await o(y, Ne), Vn({}), nn({}), Be({}), sn({}), gn(null), xe(null), wt((S) => S + 1), Q.length > 0 && (_n("attention"), je(Q[0].pairKey), Tn(Q[0].pairKey)), he(i("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: _t(y.name),
        flagged: Q.length > 0 ? i(
          Q.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: Q.length }
        ) : ""
      }));
    } catch (h) {
      Ue(!0), he(h instanceof Error ? h.message : String(h));
    } finally {
      Ze(!1), He(null), Ne(null);
    }
  }, Ei = (t) => {
    if (Q.length === 0) return;
    const l = Q.findIndex(({ pairKey: x }) => x === Se), p = l < 0 ? t > 0 ? 0 : Q.length - 1 : (l + t + Q.length) % Q.length, h = Q[p];
    Te(null), je(h.pairKey), Tn(h.pairKey);
  }, Kt = () => /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "gl-comp-inspector-resize",
      role: "separator",
      "aria-label": i("Resize compensation inspector"),
      "aria-orientation": "vertical",
      "aria-valuemin": 360,
      "aria-valuemax": 900,
      "aria-valuenow": mn,
      tabIndex: 0,
      title: i("Drag to resize the coefficient inspector; use Left/Right arrow keys for fine control"),
      onPointerDown: Os,
      onKeyDown: Ds,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), Hs = (t) => {
    Te(null), je(t), gt(!0), kt.some((l) => l.pairKey === t) && (Ie.some((l) => l.pairKey === t) || (Un("all"), si("")), ri(t));
  }, Rt = (t, l = !1) => {
    const p = b ? jn.has(b.pairKey) : !1, h = b ? Q.find(({ pairKey: B }) => B === b.pairKey) ?? null : null, x = b ? Ft(b.pairKey, b.value) : null, y = b ? In(b.pairKey, b.value) : null, S = b ? Cs[b.pairKey] : null, L = b ? u.sourceAxisKeys[b.sourceIndex] : "", U = b ? u.receiverAxisKeys[b.receiverIndex] : "", z = b != null && b.interaction && b.interaction !== "self" && b.interaction !== "other" ? 1 : 0, G = b && (be != null && be.ready) ? Wt({
      coefficient: b.value,
      physicalPrior: z,
      evidence: be.preview.evidence
    }, u.kind, ze) : null, ee = b ? ia($, L, U) : null, Re = (b == null ? void 0 : b.value) ?? null, ye = b ? Y[b.pairKey] : void 0, Nn = !!(b && (j == null ? void 0 : j.scientific.kind) === "flow-spillover" && F && Object.keys(Y).length > 0), Ve = _e.state !== "idle" && _e.state !== "error" && _e.pairKey === (b == null ? void 0 : b.pairKey) ? _e.preview : null, an = Ve ?? (be != null && be.ready ? be.preview : null), on = [];
    ee !== null && Re !== null && ((j == null ? void 0 : j.recordType) === "revision" || ee !== Re) && on.push({ label: i("Baseline"), value: ee }), Re !== null && on.push({ label: i("Installed"), value: Re }), ye !== void 0 && on.push({ label: i("Staged"), value: ye });
    const ln = Q.findIndex(({ pairKey: B }) => B === Se);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${l ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: i("Selected coefficient") }),
          !l && /* @__PURE__ */ e.jsx("span", { children: i(mt ? "Hover preview · click to pin this pair." : Se ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inspector-actions", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flag-navigation", "aria-label": i("Flagged compensation pair navigation"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": i("Previous flagged compensation pair"),
                disabled: Q.length === 0,
                onClick: () => Ei(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: ln >= 0 ? i("{current} / {total} flagged", { current: ln + 1, total: Q.length }) : i("{total} flagged", { total: Q.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": i("Next flagged compensation pair"),
                disabled: Q.length === 0,
                onClick: () => Ei(1),
                children: "→"
              }
            )
          ] }),
          t && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-inspector-close",
              "aria-label": i("Close global compensation pair details"),
              title: i("Close details and return to the full gallery"),
              onClick: t,
              children: "×"
            }
          )
        ] })
      ] }),
      b ? /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-pair-detail${l ? " is-global" : ""}`, children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-pair-route", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: i("Source channel") }),
            /* @__PURE__ */ e.jsx("strong", { children: b.source.label }),
            /* @__PURE__ */ e.jsx("small", { children: b.source.pnn })
          ] }),
          /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("span", { children: i("Receiver") }),
            /* @__PURE__ */ e.jsx("strong", { children: b.receiver.label }),
            /* @__PURE__ */ e.jsx("small", { children: b.receiver.pnn })
          ] })
        ] }),
        G && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${G.category}`,
            title: i(G.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: i(G.label) }),
              /* @__PURE__ */ e.jsx("span", { children: i(G.detail) })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: p,
              disabled: !j || !ie.has(u.sourceAxisKeys[b.sourceIndex]) || !ie.has(u.receiverAxisKeys[b.receiverIndex]),
              onChange: (B) => Kn(b.pairKey, B.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: i("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: i("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: i("Stored fraction: {value}", { value: ne(b.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: i(Y[b.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(Y[b.pairKey] ?? b.value) ? `${((Y[b.pairKey] ?? b.value) * 100).toFixed(1)}%` : String(Y[b.pairKey] ?? b.value) })
        ] }),
        on.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": i("Coefficient history"), children: on.map((B, cn) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          cn > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: i("Exact fraction: {value}", { value: ne(B.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: B.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (B.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${B.label}:${cn}`)) }),
        j && Se === b.pairKey && !mt && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: i("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              Mn,
              {
                step: "0.1",
                value: Bn,
                disabled: V,
                onValueChange: (B) => {
                  Nt(B), j.scientific.kind === "flow-spillover" && B.trim() !== "" && Number.isFinite(Number(B)) && On(b.pairKey, Number(B) / 100);
                }
              }
            )
          ] }),
          j.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: i("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: V || !Number.isFinite(Number(Bn)) || Bn.trim() === "",
              onClick: () => On(b.pairKey, Number(Bn) / 100),
              children: i("Stage value")
            }
          ),
          Y[b.pairKey] !== void 0 && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: V,
              onClick: () => {
                On(b.pairKey, b.value), nn((B) => {
                  const cn = { ...B };
                  return delete cn[b.pairKey], cn;
                });
              },
              children: i("Reset")
            }
          )
        ] }),
        Nn && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-candidate-status${l ? " is-compact" : ""}`, "aria-label": i("Flow compensation coefficient preview"), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: i("Coefficient preview") }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              i("Original remains fixed; the right panel shows the complete working matrix."),
              l ? i(" The gallery remains installed until Apply.") : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("em", { children: ye === void 0 ? i("Working matrix") : `${(b.value * 100).toFixed(1)}% → ${(ye * 100).toFixed(1)}%` }),
          _e.state === "updating" && _e.pairKey === b.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: i("Updating…") }),
          _e.state === "error" && _e.pairKey === b.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: i(_e.message) })
        ] }),
        b.interaction && b.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          i("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: b.interaction })
        ] }),
        l && (an ? /* @__PURE__ */ e.jsx(
          Zi,
          {
            preview: an,
            sourceLabel: b.source.label,
            receiverLabel: b.receiver.label,
            kind: u.kind,
            densitySmoothing: Je,
            compact: !0,
            compensatedTitle: i(Ve ? "Candidate" : "Compensated")
          }
        ) : be && !be.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: i(be.reason) }) : null),
        l && /* @__PURE__ */ e.jsx(
          Br,
          {
            matrixView: u,
            sourceChannels: oe,
            receiverChannels: de,
            selectedSourceIndex: b.sourceIndex,
            selectedReceiverIndex: b.receiverIndex,
            stagedCoefficients: Y,
            maximumAbsoluteOffDiagonal: wi,
            onSelect: Hs
          }
        ),
        !l && (an ? /* @__PURE__ */ e.jsx(
          Zi,
          {
            preview: an,
            sourceLabel: b.source.label,
            receiverLabel: b.receiver.label,
            kind: u.kind,
            densitySmoothing: Je,
            compensatedTitle: i(Ve ? "Candidate" : "Compensated")
          }
        ) : be && !be.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: i(be.reason) }) : null),
        p && h && x && y && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: i("Sweep bounds") }),
            /* @__PURE__ */ e.jsx("span", { children: i("Four exact candidates will be interpolated across these endpoints.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-inputs", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: i("Lower (%)") }),
              /* @__PURE__ */ e.jsx(
                Mn,
                {
                  step: "0.1",
                  value: x.lowerPercent,
                  disabled: V || le !== null || ve !== null,
                  onValueChange: (B) => Qn(b.pairKey, b.value, "lowerPercent", B)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: i("Upper (%)") }),
              /* @__PURE__ */ e.jsx(
                Mn,
                {
                  step: "0.1",
                  value: x.upperPercent,
                  disabled: V || le !== null || ve !== null,
                  onValueChange: (B) => Qn(b.pairKey, b.value, "upperPercent", B)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: V || le !== null || ve !== null || y.error !== null,
                onClick: () => void Bs(h),
                children: i(ve === b.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          y.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: i(y.error) }) : /* @__PURE__ */ e.jsx("small", { children: i("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(re, Yi).toLocaleString(),
            sweep: Math.min(re, Hi).toLocaleString()
          }) }),
          S && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: S.values.map((B) => /* @__PURE__ */ e.jsx("div", { className: B.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            ht,
            {
              title: `${B.isCurrent ? `${i("Current")} · ` : ""}${(B.value * 100).toFixed(2)}%`,
              panel: B.preview.compensated,
              preview: B.preview,
              sourceLabel: b.source.label,
              receiverLabel: b.receiver.label,
              minimumSize: 145,
              maximumSize: 220,
              densitySmoothing: Je
            }
          ) }, `${b.pairKey}:bounds:${B.value}:${B.isCurrent}`)) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: i(u.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: i("No coefficient selected.") })
    ] });
  }, ki = (t, l) => /* @__PURE__ */ e.jsx(
    Gr,
    {
      dataset: l,
      pair: t,
      plotSize: Tt,
      densitySmoothing: Je,
      flagged: jn.has(t.pairKey),
      selected: Se === t.pairKey,
      onSelect: () => {
        Te(null), je(t.pairKey), gt(!0);
      },
      onFlag: (p) => Kn(t.pairKey, p)
    },
    t.pairKey
  ), Ys = async (t, l) => {
    if (!(se != null && se.ready) || !u)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const p = fi.map((h) => ({
      pairKey: h.pairKey,
      sourceLabel: h.source.label,
      receiverLabel: h.receiver.label,
      coefficient: h.coefficient,
      relationship: h.interaction,
      buildPreview: () => {
        const x = as(
          se.dataset,
          h.source.key,
          h.receiver.key
        );
        if (!x.ready) throw new Error(x.reason);
        return x.preview;
      }
    }));
    await Rr(p, {
      sampleName: s,
      profileName: (j == null ? void 0 : j.name) ?? i(u.title),
      populationName: (X == null ? void 0 : X.name) ?? i("All Events"),
      filterLabel: gi,
      densitySmoothing: Je,
      densityColorPower: q,
      pointAlpha: Jn
    }, t, l);
  };
  return O ? /* @__PURE__ */ e.jsx(ei.Provider, { value: q, children: /* @__PURE__ */ e.jsx(ni.Provider, { value: Jn, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-overview${Me === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsx("h2", { className: "gl-tab-title", children: i("Compensation") }),
            !_ && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: nt })
          ] }),
          _ ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${R.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: i("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: tt,
                method: nt,
                count: It,
                status: i(R.state === "ready" ? "Ready" : "Unavailable"),
                assay: i(a ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${R.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  i("{kind} compensation installed. Installed compensation profile.", {
                    kind: _.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                /* @__PURE__ */ e.jsx("strong", { children: Is }),
                /* @__PURE__ */ e.jsx("span", { children: i("{method} · {count} ch · {status}", {
                  method: nt,
                  count: It,
                  status: R.state === "ready" ? i("Ready") : i("Unavailable")
                }) }),
                /* @__PURE__ */ e.jsx("em", { children: i(a ? "Comp active" : "Original active") })
              ]
            }
          ) : /* @__PURE__ */ e.jsx(
            "span",
            {
              className: "gl-comp-summary",
              "aria-label": i("Compensation summary"),
              "data-active-layer": a ? "compensated" : "original",
              children: i("{source} · {assay} · {count} channels", {
                source: i(yi),
                assay: i(a ? "Compensated assay active" : "Original assay active"),
                count: It
              })
            }
          ),
          _ && n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: V,
              onClick: () => {
                var t;
                return (t = St.current) == null ? void 0 : t.click();
              },
              children: i("Replace matrix…")
            }
          ),
          C !== void 0 && T !== void 0 && P && /* @__PURE__ */ e.jsxs(
            "label",
            {
              className: "gl-comp-worker-control",
              title: i("Event-parallel Apply workers. The aggregate memory budget stays fixed; more workers are not always faster."),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: i("Apply workers") }),
                /* @__PURE__ */ e.jsx(
                  "select",
                  {
                    "aria-label": i("Compensation Apply worker count"),
                    value: C,
                    disabled: V,
                    onChange: (t) => P(Number(t.currentTarget.value)),
                    children: Array.from({ length: T }, (t, l) => l + 1).map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, t))
                  }
                ),
                /* @__PURE__ */ e.jsxs("small", { children: [
                  "/ ",
                  T
                ] })
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-review-population", children: [
            /* @__PURE__ */ e.jsx("span", { children: i("Review population") }),
            /* @__PURE__ */ e.jsxs(
              "select",
              {
                "aria-label": i("Compensation review population"),
                value: (X == null ? void 0 : X.id) ?? "all",
                disabled: le !== null || ve !== null,
                onChange: (t) => vt(t.currentTarget.value),
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "all", children: i("All Events") }),
                  E.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: `${"· ".repeat(t.depth)}${t.name} (${t.eventCount.toLocaleString()})` }, t.id))
                ]
              }
            ),
            /* @__PURE__ */ e.jsx("small", { children: i("{count} events · applies to biplots, attention ranking, and sweeps; membership frozen from the current assay", {
              count: re.toLocaleString()
            }) })
          ] }),
          Me !== "global" && /* @__PURE__ */ e.jsxs(
            "label",
            {
              className: "gl-comp-preview-events",
              title: i("Controls the frozen event set shown in the selected-pair Original and comparison biplots. Applying compensation still processes every event."),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: i("Pair preview") }),
                /* @__PURE__ */ e.jsxs(
                  "select",
                  {
                    "aria-label": i("Compensation pair preview event count"),
                    value: String(Yn),
                    disabled: V,
                    onChange: (t) => {
                      const l = t.currentTarget.value;
                      gs(l === "all" ? "all" : Number(l));
                    },
                    children: [
                      Ji.map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: i("{count} events", { count: t.toLocaleString() }) }, t)),
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: i("All available") })
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsx("small", { children: i("Showing {shown} of {total}; Apply always uses all events.", {
                  shown: $n.length.toLocaleString(),
                  total: re.toLocaleString()
                }) })
              ]
            }
          ),
          Ks && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-global-layer-note", children: i("Assay selection in the top bar applies to every tab.") })
        ] }),
        n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: St,
            type: "file",
            accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
            className: "gl-sr-only",
            "aria-label": i("Choose CyTOF spillover matrix"),
            onChange: (t) => void Ls(t)
          }
        ),
        di && /* @__PURE__ */ e.jsx("div", { className: ui ? "gl-comp-error" : "gl-comp-status", role: ui ? "alert" : "status", children: i(di) }),
        n.instrument === "flow" && H && !_ && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-enable-heading", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { id: "comp-flow-enable-heading", children: i(ue ? "SCE spillover matrix" : "Embedded FCS matrix") }),
            /* @__PURE__ */ e.jsx("span", { children: i("Install this exact matrix as the immutable baseline to edit coefficients and preview their effect.") })
          ] }),
          g && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "checkbox",
                checked: We,
                disabled: V,
                onChange: (t) => bn(t.currentTarget.checked)
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: i("Recompute existing gate memberships in compensated coordinates.") })
          ] }),
          Pe != null && Pe.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: Pe.error }) : V ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
            te ? i("Preparing editor… {percent}%", { percent: Math.round(te.fraction * 100) }) : i("Preparing editor…"),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-btn-ghost",
                disabled: (te == null ? void 0 : te.phase) === "cancelling",
                onClick: m,
                children: i((te == null ? void 0 : te.phase) === "cancelling" ? "Cancelling…" : "Cancel")
              }
            )
          ] }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-btn",
              disabled: !o || g && !We,
              onClick: () => void qs(),
              children: i("Enable matrix editing")
            }
          )
        ] }),
        n.instrument === "cytof" && (!_ || W) && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-cytof-import", "aria-labelledby": "comp-cytof-import-heading", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-import-head", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("h3", { id: "comp-cytof-import-heading", children: i("CyTOF spillover matrix") }),
              /* @__PURE__ */ e.jsx("span", { children: i("Linear counts → non-negative least squares → arcsinh display") })
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-import-actions", children: /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: W ? "gl-btn-ghost" : "gl-btn",
                disabled: V,
                onClick: () => {
                  var t;
                  return (t = St.current) == null ? void 0 : t.click();
                },
                children: i(W ? "Choose another matrix…" : "Import matrix…")
              }
            ) })
          ] }),
          hi && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: i(hi) }),
          W && ae && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-body", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-summary", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: W.fileName }),
                /* @__PURE__ */ e.jsx("span", { children: i("{sources} sources × {receivers} receivers", {
                  sources: W.matrix.sourceChannels.length,
                  receivers: W.matrix.receiverChannels.length
                }) })
              ] }),
              /* @__PURE__ */ e.jsxs("dl", { children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Exact matches") }),
                  /* @__PURE__ */ e.jsx("dd", { children: ae.matchedChannels.length })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Included") }),
                  /* @__PURE__ */ e.jsx("dd", { children: ae.includedChannels.length })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Not in FCS") }),
                  /* @__PURE__ */ e.jsx("dd", { children: ae.matrixOnlyChannels.length })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-channel-head", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("h4", { children: i("Channels included in NNLS") }),
                /* @__PURE__ */ e.jsx("span", { children: i("Exact, case-sensitive $PnN matching; unchecked channels pass through unchanged.") })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-mini-btn",
                    disabled: V,
                    onClick: () => rn(new Set(ae.matchedChannels)),
                    children: i("All matched")
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-mini-btn",
                    disabled: V,
                    onClick: () => rn(/* @__PURE__ */ new Set()),
                    children: i("None")
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-channel-grid", children: W.matrix.receiverChannels.map((t) => {
              const l = ae.matchedChannels.includes(t);
              return /* @__PURE__ */ e.jsxs("label", { className: l ? "" : "is-unavailable", title: l ? t : i("{channel} is not uniquely present in this FCS file", { channel: t }), children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Fn.has(t),
                    disabled: !l || V,
                    onChange: (p) => zs(t, p.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: Ut(n, t).combined }),
                !l && /* @__PURE__ */ e.jsx("small", { children: i("not matched") })
              ] }, t);
            }) }),
            (W.validationWarnings.length > 0 || ae.warnings.length > 0) && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: /* @__PURE__ */ e.jsx("span", { children: i("{count} review items: {messages}", {
              count: W.validationWarnings.length + ae.warnings.length,
              messages: [
                ...W.validationWarnings.map(({ message: t }) => t),
                ...ae.warnings.map(({ message: t }) => t)
              ].map((t) => i(t)).join(" ")
            }) }) }),
            ae.blockers.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: ae.blockers.map(({ message: t }) => i(t)).join(" ") }),
            g && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: We,
                  disabled: V,
                  onChange: (t) => bn(t.currentTarget.checked)
                }
              ),
              /* @__PURE__ */ e.jsx("span", { children: i("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                /* @__PURE__ */ e.jsx("span", { children: V ? te ? i("{phase}… {percent}% ({processed} / {total} events)", {
                  phase: i(te.phase === "cancelling" ? "Cancelling" : te.phase === "preparing" ? "Preparing" : "Applying"),
                  percent: Math.round(te.fraction * 100),
                  processed: te.processedEvents.toLocaleString(),
                  total: te.totalEvents.toLocaleString()
                }) : i("Preparing compensation…") : i("The Original assay is retained and can be restored at any time.") }),
                /* @__PURE__ */ e.jsx("strong", { className: Ye === 0 ? "is-empty" : void 0, children: Ye === 0 ? i("No FCS files are checked. Select at least one file in Samples.") : i("Applies atomically to {files} checked FCS files · {events} total events", {
                  files: Ye,
                  events: Ts.toLocaleString()
                }) })
              ] }),
              V ? /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn-ghost",
                  disabled: (te == null ? void 0 : te.phase) === "cancelling",
                  onClick: m,
                  children: i((te == null ? void 0 : te.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                }
              ) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: !o || Ye === 0 || !ae.canApply || g && !We,
                  onClick: () => void _s(),
                  children: i("Apply NNLS compensation")
                }
              )
            ] }),
            c.length > 0 && d && /* @__PURE__ */ e.jsxs(
              "div",
              {
                className: "gl-comp-adopt-existing",
                "aria-labelledby": "comp-adopt-existing-heading",
                children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-adopt-copy", children: [
                    /* @__PURE__ */ e.jsx("strong", { id: "comp-adopt-existing-heading", children: i("Use an existing SCE assay") }),
                    /* @__PURE__ */ e.jsx("span", { children: i("Records this matrix against data already computed in R. GateLabR will not recompute or overwrite the selected assay.") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("label", { children: [
                    /* @__PURE__ */ e.jsx("span", { children: i("Existing linear assay") }),
                    /* @__PURE__ */ e.jsx(
                      "select",
                      {
                        value: (Xe == null ? void 0 : Xe.id) ?? "",
                        disabled: V,
                        onChange: (t) => {
                          pi(t.currentTarget.value), Zn(!1);
                        },
                        children: c.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.label === t.id ? t.id : `${t.label} (${t.id})` }, t.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-adopt-confirm", children: [
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: Ct,
                        disabled: V,
                        onChange: (t) => Zn(t.currentTarget.checked)
                      }
                    ),
                    /* @__PURE__ */ e.jsx("span", { children: i("I confirm this assay was computed from the selected source assay using this exact matrix and channel set.") })
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-btn-ghost",
                      disabled: V || !Xe || !Ct || Ye === 0 || !ae.canApply || g && !We,
                      onClick: () => void Us(),
                      children: i("Use existing assay — no recomputation")
                    }
                  )
                ]
              }
            )
          ] })
        ] }),
        bi && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: i("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
        vi.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
          /* @__PURE__ */ e.jsx("span", { children: i("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
            count: vi.length
          }) }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => ti((t) => ({ ...t, review: !0 })), children: i("Review details") })
        ] }),
        _ && R.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: i("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
        u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-workspace-tabs", role: "tablist", "aria-label": i("Compensation workspace"), children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": Me === "matrix",
              className: Me === "matrix" ? "active" : void 0,
              onClick: () => {
                Te(null), _n("matrix");
              },
              children: i("Matrix")
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
                Te(null), _n("global");
              },
              children: i("Global inspector")
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
                Te(null), _n("attention");
              },
              children: [
                i("Flagged"),
                Q.length > 0 ? ` (${Q.length})` : ""
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "label",
            {
              className: "gl-comp-density-smoothing",
              title: i("Blur radius for every compensation biplot; both assay layers always use the same setting"),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: i("Density smooth") }),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "range",
                    min: "1",
                    max: "10",
                    step: "1",
                    value: Je,
                    "aria-label": i("Compensation biplot density smoothing"),
                    onChange: (t) => ps(Number(t.currentTarget.value))
                  }
                ),
                /* @__PURE__ */ e.jsx("output", { children: Je })
              ]
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "label",
            {
              className: "gl-comp-point-alpha",
              title: i("Point opacity for every compensation biplot"),
              children: [
                /* @__PURE__ */ e.jsx("span", { children: i("Point alpha") }),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "range",
                    min: "0.1",
                    max: "1",
                    step: "0.05",
                    value: Jn,
                    "aria-label": i("Compensation biplot point alpha"),
                    onChange: (t) => fs(Number(t.currentTarget.value))
                  }
                ),
                /* @__PURE__ */ e.jsx("output", { children: Jn.toFixed(2) })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            rr,
            {
              className: "gl-comp-density-colour",
              value: q,
              onChange: Z
            }
          ),
          Object.keys(Y).length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              i("{count} pending edits", { count: Object.keys(Y).length }),
              (j == null ? void 0 : j.scientific.kind) === "cytof-spillover" ? ` · ${i("{files} checked FCS files", { files: Ye })}` : ""
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: V,
                onClick: () => {
                  Vn({}), nn({}), he(null);
                },
                children: i("Discard")
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-btn",
                disabled: V || le !== null || ve !== null || !o || (j == null ? void 0 : j.scientific.kind) === "cytof-spillover" && Ye === 0,
                onClick: () => void Zs(),
                children: i("Apply revised matrix")
              }
            )
          ] })
        ] }),
        u && Me === "matrix" ? /* @__PURE__ */ e.jsxs(
          "div",
          {
            ref: yn,
            className: "gl-comp-common-path",
            style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${mn}px` },
            children: [
              /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrix-panel", "aria-labelledby": "comp-matrix-heading", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-matrix-head", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h3", { id: "comp-matrix-heading", children: i(u.title) }),
                    /* @__PURE__ */ e.jsx("span", { children: i(u.subtitle) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-head-actions", children: [
                    it && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-inline-edit-note", children: i("Edit cells directly (%)") }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-legend", "aria-label": i("Matrix colour key"), children: [
                      /* @__PURE__ */ e.jsxs("span", { children: [
                        /* @__PURE__ */ e.jsx("i", { className: "is-diagonal", "aria-hidden": "true" }),
                        i("Diagonal (self)")
                      ] }),
                      /* @__PURE__ */ e.jsxs("span", { children: [
                        /* @__PURE__ */ e.jsx("i", { className: "is-positive", "aria-hidden": "true" }),
                        i("Positive spill")
                      ] }),
                      /* @__PURE__ */ e.jsxs("span", { children: [
                        /* @__PURE__ */ e.jsx("i", { className: "is-negative", "aria-hidden": "true" }),
                        i("Negative")
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-mini-btn",
                        onClick: () => li(!0),
                        children: i("Export CSV…")
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-scroll", children: /* @__PURE__ */ e.jsxs(
                  "div",
                  {
                    className: `gl-comp-matrix-stage${it ? " is-flow-inline" : ""}`,
                    style: {
                      width: 112 + u.receiverAxisKeys.length * Rn
                    },
                    children: [
                      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-axis gl-comp-matrix-receiver-axis", children: i("Receiver channels →") }),
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-body", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-axis gl-comp-matrix-source-axis", children: i("Source channels ↓") }),
                        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-labelled", children: [
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-corner", "aria-hidden": "true", children: "%" }),
                          /* @__PURE__ */ e.jsx(
                            "div",
                            {
                              className: "gl-comp-column-labels",
                              "aria-label": i("Receiver channel labels"),
                              style: {
                                gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${Rn}px)`
                              },
                              children: de.map((t, l) => /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  className: (b == null ? void 0 : b.receiverIndex) === l ? "is-selected" : void 0,
                                  title: t.combined,
                                  children: /* @__PURE__ */ e.jsx("span", { children: t.combined })
                                },
                                u.receiverAxisKeys[l]
                              ))
                            }
                          ),
                          /* @__PURE__ */ e.jsx(
                            "div",
                            {
                              className: "gl-comp-row-labels",
                              "aria-label": i("Source channel labels"),
                              style: {
                                gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${Rn}px)`
                              },
                              children: oe.map((t, l) => /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  className: (b == null ? void 0 : b.sourceIndex) === l ? "is-selected" : void 0,
                                  title: t.combined,
                                  children: t.combined
                                },
                                u.sourceAxisKeys[l]
                              ))
                            }
                          ),
                          /* @__PURE__ */ e.jsx(
                            "div",
                            {
                              ref: mi,
                              className: "gl-comp-matrix shows-values",
                              role: "grid",
                              "aria-label": i("Compensation matrix; source rows and receiver columns"),
                              "aria-rowcount": u.sourceAxisKeys.length,
                              "aria-colcount": u.receiverAxisKeys.length,
                              style: {
                                gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${Rn}px)`,
                                gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${Rn}px)`
                              },
                              children: u.matrix.map((t, l) => /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  role: "row",
                                  className: "gl-comp-matrix-row",
                                  "aria-rowindex": l + 1,
                                  children: t.map((p, h) => {
                                    const x = u.sourceAxisKeys[l], y = u.receiverAxisKeys[h], S = `${x}${Oe}${y}`, L = Y[S], U = L ?? p, z = x === y, G = (b == null ? void 0 : b.sourceIndex) === l && b.receiverIndex === h, ee = (b == null ? void 0 : b.sourceIndex) === l, Re = (b == null ? void 0 : b.receiverIndex) === h, ye = oe[l], Nn = de[h], Ve = u.kind === "cytof" ? Cn(x, y) : null, an = ar(
                                      U,
                                      wi,
                                      z
                                    ), on = u.receiverAxisKeys.findIndex((pe) => pe !== x), ln = Se === S, B = Se === null && l === 0 && h === on, cn = Number.isFinite(U) ? U === 0 ? "" : (U * 100).toFixed(1) : String(U), Fi = Ve && Ve !== "other" && Ve !== "self" ? ` · ${Ve}` : "", Xs = ws[S] ?? ns(U);
                                    return it && !z ? /* @__PURE__ */ e.jsx(
                                      Mn,
                                      {
                                        role: "gridcell",
                                        className: `gl-comp-cell gl-comp-cell-input${G ? " selected" : ""}${ln ? " is-pinned" : ""}${L === void 0 ? "" : " is-staged"}${ee ? " is-selected-source" : ""}${Re ? " is-selected-receiver" : ""}`,
                                        min: "0",
                                        step: "0.1",
                                        value: Xs,
                                        disabled: V,
                                        "data-source-index": l,
                                        "data-receiver-index": h,
                                        "aria-colindex": h + 1,
                                        "aria-selected": ln,
                                        "aria-label": i("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                          source: ye.combined,
                                          receiver: Nn.combined,
                                          pending: L === void 0 ? "" : i(", pending edit")
                                        }),
                                        title: i("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                          source: ye.combined,
                                          receiver: Nn.combined,
                                          pending: L === void 0 ? "" : i(" · pending edit")
                                        }),
                                        style: an,
                                        onFocus: () => je(S),
                                        onMouseEnter: () => Te(S),
                                        onMouseLeave: () => Te((pe) => pe === S ? null : pe),
                                        onClick: () => je(S),
                                        onValueChange: (pe) => {
                                          je(S), nn((Dn) => ({ ...Dn, [S]: pe })), pe.trim() !== "" && Number.isFinite(Number(pe)) && On(S, Number(pe) / 100);
                                        },
                                        onBlur: (pe) => {
                                          const Dn = pe.currentTarget.value;
                                          if (Dn.trim() === "" || !Number.isFinite(Number(Dn))) {
                                            nn((Ot) => {
                                              const $i = { ...Ot };
                                              return delete $i[S], $i;
                                            });
                                            return;
                                          }
                                          nn((Ot) => ({
                                            ...Ot,
                                            [S]: ns(Number(Dn) / 100)
                                          }));
                                        }
                                      },
                                      y
                                    ) : /* @__PURE__ */ e.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        role: "gridcell",
                                        className: `gl-comp-cell${z ? " diagonal" : ""}${G ? " selected" : ""}${ln ? " is-pinned" : ""}${L === void 0 ? "" : " is-staged"}${ee ? " is-selected-source" : ""}${Re ? " is-selected-receiver" : ""}`,
                                        disabled: z,
                                        tabIndex: z ? -1 : G || B ? 0 : -1,
                                        "data-source-index": l,
                                        "data-receiver-index": h,
                                        "data-interaction": Ve ?? void 0,
                                        "aria-colindex": h + 1,
                                        "aria-pressed": z ? void 0 : ln,
                                        "aria-label": z ? i("{channel} diagonal: {value}", { channel: ye.combined, value: en(U) }) : i("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                          source: ye.combined,
                                          receiver: Nn.combined,
                                          value: en(U),
                                          pending: L === void 0 ? "" : i(" (pending edit)"),
                                          interaction: Fi
                                        }),
                                        title: z ? `${ye.combined} · self · ${en(U)}` : `${ye.combined} → ${Nn.combined} · ${en(U)}${L === void 0 ? "" : " · pending edit"}${Fi}`,
                                        style: an,
                                        onFocus: () => {
                                          z || je(S);
                                        },
                                        onMouseEnter: () => {
                                          z || Te(S);
                                        },
                                        onMouseLeave: () => Te((pe) => pe === S ? null : pe),
                                        onClick: () => je(S),
                                        onKeyDown: (pe) => Vs(pe, l, h),
                                        children: /* @__PURE__ */ e.jsx("span", { children: cn })
                                      },
                                      y
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
              Kt(),
              Rt()
            ]
          }
        ) : u && Me === "global" ? /* @__PURE__ */ e.jsxs(
          "div",
          {
            ref: yn,
            className: `gl-comp-common-path gl-comp-global-path${An ? " has-details" : ""}`,
            style: {
              gridTemplateColumns: An ? `minmax(440px, 1fr) 8px ${mn}px` : "minmax(0, 1fr)"
            },
            children: [
              /* @__PURE__ */ e.jsx(
                Wr,
                {
                  stateKey: D,
                  header: /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-head-title", children: [
                      /* @__PURE__ */ e.jsx("h3", { id: "comp-global-inspector-heading", children: i("Global data inspector") }),
                      /* @__PURE__ */ e.jsx(
                        "span",
                        {
                          className: "gl-comp-lock-pill",
                          title: i("The assay flip keeps the same events, axes, transform, density bins, colour scale, and tile geometry."),
                          children: i("View locked")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs(
                      "select",
                      {
                        "aria-label": i("Global compensation pair filter"),
                        title: i("Choose which channel pairs appear"),
                        value: Fe,
                        onChange: (t) => Un(t.currentTarget.value),
                        children: [
                          /* @__PURE__ */ e.jsx("option", { value: "relevant", children: i("Matrix-linked / relevant") }),
                          /* @__PURE__ */ e.jsx("option", { value: "nonzero", children: i("Non-zero coefficients") }),
                          u.kind === "cytof" && /* @__PURE__ */ e.jsx("option", { value: "physical", children: i("Physical CyTOF relationships") }),
                          /* @__PURE__ */ e.jsx("option", { value: "flagged", children: i("Flagged for follow-up") }),
                          /* @__PURE__ */ e.jsx("option", { value: "all", children: i("All included pairs") })
                        ]
                      }
                    ),
                    /* @__PURE__ */ e.jsxs(
                      "select",
                      {
                        className: "gl-comp-global-layout",
                        "aria-label": i("Global compensation plot layout"),
                        title: i("Show one compressed gallery or organise channel pairs into labelled rows"),
                        value: $e,
                        onChange: (t) => cs(t.currentTarget.value),
                        children: [
                          /* @__PURE__ */ e.jsx("option", { value: "compact", children: i("Compact gallery") }),
                          /* @__PURE__ */ e.jsx("option", { value: "source", children: i("Rows by source") }),
                          /* @__PURE__ */ e.jsx("option", { value: "receiver", children: i("Rows by receiver") })
                        ]
                      }
                    ),
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        className: "gl-comp-global-search",
                        type: "search",
                        value: kn,
                        placeholder: i("Find channel…"),
                        "aria-label": i("Search global compensation pairs"),
                        onChange: (t) => si(t.currentTarget.value)
                      }
                    ),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-global-size", children: [
                      /* @__PURE__ */ e.jsx("span", { className: "gl-sr-only", children: i("Plot size") }),
                      /* @__PURE__ */ e.jsx(
                        "input",
                        {
                          type: "range",
                          min: "120",
                          max: "220",
                          step: "4",
                          value: Tt,
                          "aria-label": i("Global compensation plot size"),
                          onChange: (t) => us(Number(t.currentTarget.value))
                        }
                      ),
                      /* @__PURE__ */ e.jsx("output", { children: i("{size}px", { size: Tt }) })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-mini-btn gl-comp-global-export",
                        disabled: !(se != null && se.ready) || Ie.length === 0,
                        title: i("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                        onClick: () => ci(!0),
                        children: i("Export…")
                      }
                    ),
                    /* @__PURE__ */ e.jsx(
                      "span",
                      {
                        className: "gl-comp-global-count",
                        title: i("The Global gallery uses one fixed representative event set so every pair and both assay layers remain directly comparable."),
                        children: i("{pairs} pairs · {shown} / {total} events · {population}", {
                          pairs: Ie.length.toLocaleString(),
                          shown: Et.length.toLocaleString(),
                          total: re.toLocaleString(),
                          population: (X == null ? void 0 : X.name) ?? i("All Events")
                        })
                      }
                    )
                  ] }),
                  children: se ? se.ready ? Ie.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: i("No pairs match the current filter. Choose another filter or clear the channel search.") }) : $e === "compact" ? /* @__PURE__ */ e.jsx(
                    "div",
                    {
                      className: "gl-comp-global-gallery",
                      "data-event-signature": se.dataset.eventSignature,
                      children: Ie.map((t) => ki(t, se.dataset))
                    }
                  ) : /* @__PURE__ */ e.jsx(
                    "div",
                    {
                      className: "gl-comp-global-groups",
                      "data-event-signature": se.dataset.eventSignature,
                      "data-layout": $e,
                      children: At.map((t) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                        /* @__PURE__ */ e.jsxs("header", { children: [
                          /* @__PURE__ */ e.jsx("span", { children: i($e === "source" ? "Source channel" : "Receiver") }),
                          /* @__PURE__ */ e.jsx("strong", { title: t.channel.combined, children: t.channel.label }),
                          /* @__PURE__ */ e.jsx("small", { children: t.channel.pnn }),
                          /* @__PURE__ */ e.jsx("em", { children: i("{count} pairs", { count: t.pairs.length }) })
                        ] }),
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: t.pairs.map((l) => ki(l, se.dataset)) })
                      ] }, t.channel.key))
                    }
                  ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: i(se.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: i("No matrix is available for the global inspector.") })
                }
              ),
              An && Kt(),
              An && Rt(() => gt(!1), !0)
            ]
          }
        ) : u ? /* @__PURE__ */ e.jsxs(
          "div",
          {
            ref: yn,
            className: "gl-comp-common-path",
            style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${mn}px` },
            children: [
              /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-attention gl-comp-attention-panel", "aria-labelledby": "comp-attention-heading", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-head", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h3", { id: "comp-attention-heading", children: i("Flagged pairs") }),
                    /* @__PURE__ */ e.jsx("p", { children: i("This is your follow-up queue. Suggestions are a population-scoped evidence screen, not a verdict and not automatically included. Exact sweeps change one coefficient at a time across four user-bounded values using the same frozen events.") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-actions", children: [
                    /* @__PURE__ */ e.jsxs("label", { children: [
                      /* @__PURE__ */ e.jsx("span", { children: i("Sweep workers") }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": i("Compensation sweep workers"),
                          value: bt,
                          disabled: le !== null || ve !== null,
                          onChange: (t) => yt(Number(t.currentTarget.value)),
                          children: Array.from({ length: Qi }, (t, l) => l + 1).map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, t))
                        }
                      )
                    ] }),
                    le ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: Ws, children: i("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn",
                        disabled: !j || !N || Ke.length === 0 || $t > 0 || V || ve !== null,
                        onClick: () => void Gs(),
                        children: i("Run four-value sweeps ({count})", { count: Ke.length })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-scope", children: [
                  /* @__PURE__ */ e.jsx("span", { children: i("Suggestions computed for {population} from up to {count} frozen events.", {
                    population: (X == null ? void 0 : X.name) ?? i("All Events"),
                    count: Math.min(re, Pn.length).toLocaleString()
                  }) }),
                  /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-evidence-mode", children: [
                    /* @__PURE__ */ e.jsx("span", { children: i("Evidence mode") }),
                    /* @__PURE__ */ e.jsxs(
                      "select",
                      {
                        "aria-label": i("Compensation evidence mode"),
                        value: ze,
                        disabled: V || le !== null || ve !== null,
                        onChange: (t) => {
                          vs(t.currentTarget.value), wt((l) => l + 1), Be({}), sn({}), xe(null);
                        },
                        children: [
                          /* @__PURE__ */ e.jsx("option", { value: "biological", children: i("Biological sample (conservative)") }),
                          /* @__PURE__ */ e.jsx("option", { value: "control", children: i("Single-stain / control") })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: V || le !== null || ve !== null,
                      onClick: () => {
                        wt((t) => t + 1), Be({}), sn({}), xe(null), Ue(!1), he(
                          i(Q.length === 1 ? "Recomputed compensation suggestions for {population}. {count} flagged pair was retained." : "Recomputed compensation suggestions for {population}. {count} flagged pairs were retained.", {
                            population: (X == null ? void 0 : X.name) ?? i("All Events"),
                            count: Q.length
                          })
                        );
                      },
                      children: i("Recompute suggestions")
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("small", { children: [
                    i(ze === "biological" ? "Broad positive association is excluded because co-expression and cell size can mimic spill. High-tail shapes remain control-sensitive review prompts." : "Positive residual association may enter the shortlist only because you declared suitable control data."),
                    " ",
                    i("Sweep workers are separate from full-Apply workers.")
                  ] })
                ] }),
                le && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-progress", role: "status", "aria-live": "polite", children: [
                  /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, le.total), value: le.completed }),
                  /* @__PURE__ */ e.jsx("span", { children: i("{completed} / {total} exact candidate solves · {workers} workers", {
                    completed: le.completed,
                    total: le.total,
                    workers: bt
                  }) })
                ] }),
                oi && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: i(oi) }),
                j ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": i("Add compensation pair for follow-up"), children: [
                    /* @__PURE__ */ e.jsx("strong", { children: i("Add a pair") }),
                    /* @__PURE__ */ e.jsxs("label", { children: [
                      /* @__PURE__ */ e.jsx("span", { children: i("Source channel") }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": i("Follow-up source channel"),
                          value: Ee,
                          onChange: (t) => {
                            const l = t.currentTarget.value;
                            ai(l), we === l && jt(u.receiverAxisKeys.find((p) => p !== l && ie.has(p)) ?? "");
                          },
                          children: u.sourceAxisKeys.map((t, l) => ie.has(t) ? /* @__PURE__ */ e.jsx("option", { value: t, children: oe[l].combined }, t) : null)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
                    /* @__PURE__ */ e.jsxs("label", { children: [
                      /* @__PURE__ */ e.jsx("span", { children: i("Receiver") }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": i("Follow-up receiver channel"),
                          value: we,
                          onChange: (t) => jt(t.currentTarget.value),
                          children: u.receiverAxisKeys.map((t, l) => t !== Ee && ie.has(t) ? /* @__PURE__ */ e.jsx("option", { value: t, children: de[l].combined }, t) : null)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-mini-btn",
                        disabled: !Ee || !we || Ee === we,
                        onClick: Fs,
                        children: i("Flag for follow-up")
                      }
                    )
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flagged-columns", children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section", children: [
                      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                        /* @__PURE__ */ e.jsx("h4", { children: i("Flagged by you ({count})", { count: Ke.length }) }),
                        /* @__PURE__ */ e.jsx("span", { children: i("Only these pairs are included when you run sweeps.") })
                      ] }) }),
                      Ke.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: i("No pairs are flagged yet. Tick “Flag for follow-up” in the inspector, add a pair above, or accept a suggestion below.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-list", children: Ke.map((t, l) => {
                        const p = Ns[t.pairKey], h = Ss === t.pairKey, x = In(t.pairKey, t.coefficient), y = Ft(t.pairKey, t.coefficient);
                        return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${Se === t.pairKey ? " is-selected" : ""}`, children: [
                          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                            /* @__PURE__ */ e.jsxs(
                              "button",
                              {
                                type: "button",
                                className: "gl-comp-sweep-pair-head",
                                "aria-expanded": h,
                                onClick: () => {
                                  je(t.pairKey), Tn(h ? null : t.pairKey);
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
                                      i("installed {value}%", { value: (t.coefficient * 100).toFixed(1) })
                                    ] })
                                  ] }),
                                  /* @__PURE__ */ e.jsx("span", { children: t.evidence.status === "ready" ? i("shift {shift} MAD · slope {slope}", {
                                    shift: ne(t.evidence.normalizedNegativeShift ?? 0, 3),
                                    slope: ne(t.evidence.residualSlope ?? 0, 4)
                                  }) : i("visual review · residual groups insufficient") }),
                                  /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: h ? "▾" : "▸" })
                                ]
                              }
                            ),
                            /* @__PURE__ */ e.jsx("label", { className: "gl-comp-followup-list-toggle", title: i("Remove from follow-up queue"), children: /* @__PURE__ */ e.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: !0,
                                "aria-label": i("Flag {source} to {receiver} for follow-up", {
                                  source: t.source.label,
                                  receiver: t.receiver.label
                                }),
                                onChange: (S) => Kn(t.pairKey, S.currentTarget.checked)
                              }
                            ) })
                          ] }),
                          h && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-body", children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inline-bounds", children: [
                              /* @__PURE__ */ e.jsx("span", { children: i("Four values across") }),
                              /* @__PURE__ */ e.jsxs("label", { children: [
                                i("Lower (%)"),
                                /* @__PURE__ */ e.jsx(Mn, { step: "0.1", value: y.lowerPercent, disabled: V || le !== null || ve !== null, onValueChange: (S) => Qn(t.pairKey, t.coefficient, "lowerPercent", S) })
                              ] }),
                              /* @__PURE__ */ e.jsx("span", { children: i("to") }),
                              /* @__PURE__ */ e.jsxs("label", { children: [
                                i("Upper (%)"),
                                /* @__PURE__ */ e.jsx(Mn, { step: "0.1", value: y.upperPercent, disabled: V || le !== null || ve !== null, onValueChange: (S) => Qn(t.pairKey, t.coefficient, "upperPercent", S) })
                              ] }),
                              x.error && /* @__PURE__ */ e.jsx("small", { children: i(x.error) })
                            ] }),
                            p ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: p.values.map((S) => /* @__PURE__ */ e.jsxs(
                              "div",
                              {
                                className: `gl-comp-sweep-value${S.isCurrent ? " is-current" : ""}${Y[t.pairKey] === S.value ? " is-staged" : ""}`,
                                children: [
                                  /* @__PURE__ */ e.jsx(
                                    ht,
                                    {
                                      title: `${S.isCurrent ? `${i("Current")} · ` : ""}${(S.value * 100).toFixed(2)}%`,
                                      panel: S.preview.compensated,
                                      preview: S.preview,
                                      sourceLabel: t.source.label,
                                      receiverLabel: t.receiver.label,
                                      minimumSize: 150,
                                      maximumSize: 230,
                                      densitySmoothing: Je
                                    }
                                  ),
                                  /* @__PURE__ */ e.jsxs("dl", { children: [
                                    /* @__PURE__ */ e.jsxs("div", { children: [
                                      /* @__PURE__ */ e.jsx("dt", { children: i("Shift") }),
                                      /* @__PURE__ */ e.jsx("dd", { children: i("{value} MAD", { value: ne(S.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                    ] }),
                                    /* @__PURE__ */ e.jsxs("div", { children: [
                                      /* @__PURE__ */ e.jsx("dt", { children: i("Slope") }),
                                      /* @__PURE__ */ e.jsx("dd", { children: ne(S.preview.evidence.residualSlope ?? 0, 4) })
                                    ] }),
                                    u.kind === "cytof" && /* @__PURE__ */ e.jsxs("div", { children: [
                                      /* @__PURE__ */ e.jsx("dt", { children: i("Receiver zero") }),
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
                                      disabled: V || S.isCurrent,
                                      onClick: () => On(t.pairKey, S.value),
                                      children: i(S.isCurrent ? "Installed" : Y[t.pairKey] === S.value ? "Staged" : "Use this value")
                                    }
                                  )
                                ]
                              },
                              `${t.pairKey}:${S.value}:${S.isCurrent}`
                            )) }) : /* @__PURE__ */ e.jsx("p", { children: i("Set or fast-preview the endpoints in the inspector, then run the four-value exact sweep. Panels use the same events and locked axes.") })
                          ] })
                        ] }, t.pairKey);
                      }) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section gl-comp-suggestions", children: [
                      /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                        /* @__PURE__ */ e.jsxs("h4", { children: [
                          i(ze === "biological" ? "Conservative suggestions" : "Control-data suggestions"),
                          " (",
                          Ce.items.length,
                          ")"
                        ] }),
                        /* @__PURE__ */ e.jsx("span", { children: i("{evaluable} evaluable of {screened} screened pairs for {population}. Inspect before flagging.", {
                          evaluable: Ce.evaluableCount.toLocaleString(),
                          screened: Ce.screenedCount.toLocaleString(),
                          population: (X == null ? void 0 : X.name) ?? i("All Events")
                        }) })
                      ] }) }),
                      Ce.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: i("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: Ce.items.map((t) => {
                        const l = Wt(t, u.kind, ze);
                        return /* @__PURE__ */ e.jsxs("article", { className: jn.has(t.pairKey) ? "is-flagged" : void 0, children: [
                          /* @__PURE__ */ e.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => je(t.pairKey),
                              children: [
                                /* @__PURE__ */ e.jsxs("strong", { children: [
                                  t.source.label,
                                  " → ",
                                  t.receiver.label
                                ] }),
                                /* @__PURE__ */ e.jsx("em", { className: `gl-comp-suggestion-badge is-${l.category}`, children: i(l.label) }),
                                /* @__PURE__ */ e.jsxs("span", { children: [
                                  t.interaction && t.interaction !== "other" ? `${t.interaction} · ` : "",
                                  i("{coefficient}% · shift {shift} MAD · slope {slope}", {
                                    coefficient: (t.coefficient * 100).toFixed(1),
                                    shift: ne(t.evidence.normalizedNegativeShift ?? 0, 3),
                                    slope: ne(t.evidence.residualSlope ?? 0, 4)
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
                                checked: jn.has(t.pairKey),
                                "aria-label": i("Flag suggested {source} to {receiver} for follow-up", {
                                  source: t.source.label,
                                  receiver: t.receiver.label
                                }),
                                onChange: (p) => Kn(t.pairKey, p.currentTarget.checked)
                              }
                            ),
                            /* @__PURE__ */ e.jsx("span", { children: i("Follow up") })
                          ] })
                        ] }, t.pairKey);
                      }) })
                    ] })
                  ] })
                ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: i("Install a profile-derived compensation layer before curating or sweeping pairs. The embedded FCS matrix remains inspectable in the Matrix view.") })
              ] }),
              Kt(),
              Rt()
            ]
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: i(_ ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : n.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
        (u || _) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": i("Advanced compensation tools"), children: [
          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: Hr.map(({ id: t, label: l }) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              id: `comp-drawer-${t}-button`,
              className: "gl-comp-drawer-toggle",
              "aria-expanded": zn[t],
              "aria-controls": `comp-drawer-${t}`,
              onClick: () => Rs(t),
              children: [
                /* @__PURE__ */ e.jsxs("span", { children: [
                  i(l),
                  t === "review" && et.length > 0 ? ` (${et.length})` : ""
                ] }),
                /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: zn[t] ? "▾" : "▸" })
              ]
            },
            t
          )) }),
          zn.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
            /* @__PURE__ */ e.jsx("h3", { children: i("Matrix evidence") }),
            _ ? j ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-evidence-grid", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Profile ID") }),
                  /* @__PURE__ */ e.jsx("dd", { children: j.profileId })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Created") }),
                  /* @__PURE__ */ e.jsx("dd", { children: new Date(j.createdAt).toLocaleString() })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Matrix source") }),
                  /* @__PURE__ */ e.jsx("dd", { children: oa(j, i) })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Orientation") }),
                  /* @__PURE__ */ e.jsx("dd", { children: i("Source rows → receiver columns") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Imported dimensions") }),
                  /* @__PURE__ */ e.jsx("dd", { children: i("{sources} sources × {receivers} receivers", {
                    sources: j.scientific.matrix.sourceChannels.length,
                    receivers: j.scientific.matrix.receiverChannels.length
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Applied solve") }),
                  /* @__PURE__ */ e.jsx("dd", { children: i("{count} exact $PnN channels · {status}", {
                    count: _.includedPnns.length,
                    status: R.state
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Matrix hash") }),
                  /* @__PURE__ */ e.jsxs("dd", { title: j.matrixHash, children: [
                    j.matrixHash.slice(0, 19),
                    "…"
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Profile hash") }),
                  /* @__PURE__ */ e.jsxs("dd", { title: j.profileHash, children: [
                    j.profileHash.slice(0, 19),
                    "…"
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Provenance") }),
                  /* @__PURE__ */ e.jsx("dd", { children: i(((Ai = j.provenance) == null ? void 0 : Ai.sourceDescription) ?? "No additional source note supplied") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: i("Estimation") }),
                  /* @__PURE__ */ e.jsx("dd", { children: i(((Ti = j.provenance) == null ? void 0 : Ti.estimationMethod) ?? "Imported coefficients preserved exactly") })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-method-card", "aria-label": i("Installed compensation method"), children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: i("Pipeline") }),
                  /* @__PURE__ */ e.jsx("strong", { children: i(j.scientific.kind === "cytof-spillover" ? "Original counts → NNLS → Compensated counts → arcsinh display" : "Original values → linear matrix inverse → Compensated values → display transform") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: i("Solver") }),
                  /* @__PURE__ */ e.jsx("strong", { children: j.scientific.solverVersion }),
                  /* @__PURE__ */ e.jsx("small", { children: j.scientific.solverSettings.map(({ key: t, value: l }) => `${t}=${String(l)}`).join(" · ") })
                ] })
              ] }),
              Ae && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": i("Original versus Compensated preview"), children: [
                /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("h4", { children: i("Original → Compensated impact") }),
                  /* @__PURE__ */ e.jsx("span", { children: i("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                    events: Ae.previewEvents.toLocaleString(),
                    channels: _.includedPnns.length
                  }) })
                ] }) }),
                /* @__PURE__ */ e.jsxs("dl", { children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: i("Values changed") }),
                    /* @__PURE__ */ e.jsxs("dd", { children: [
                      Ae.changedValues.toLocaleString(),
                      " / ",
                      Ae.comparedValues.toLocaleString(),
                      " (",
                      en(Ae.changedValues / Ae.comparedValues, !1, 4),
                      ")"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: i("Median |Δ|") }),
                    /* @__PURE__ */ e.jsx("dd", { children: ne(Ae.medianAbsoluteDelta, 5) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: i("Maximum |Δ|") }),
                    /* @__PURE__ */ e.jsx("dd", { children: ne(Ae.maxAbsoluteDelta, 5) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: i("Largest median shift") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: Ae.mostChangedChannel, children: [
                      Ae.mostChangedChannel,
                      " · ",
                      ne(Ae.mostChangedChannelMedianDelta, 5)
                    ] })
                  ] }),
                  _.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: i("Negative → zero") }),
                    /* @__PURE__ */ e.jsx("dd", { children: i("{count} preview values", { count: Ae.zeroedNegativeValues.toLocaleString() }) })
                  ] })
                ] })
              ] })
            ] }) : /* @__PURE__ */ e.jsx("p", { children: i("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
              profile: _.profileId,
              method: nt,
              count: _.includedPnns.length,
              status: R.state
            }) }) : /* @__PURE__ */ e.jsx("p", { children: i("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
              channels: H.channels.length,
              warnings: Pt.length || i("no")
            }) })
          ] }),
          zn.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
            /* @__PURE__ */ e.jsx("h3", { children: i("Review queue") }),
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
              /* @__PURE__ */ e.jsx("h4", { children: i("Matrix integrity") }),
              et.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: et.map((t) => /* @__PURE__ */ e.jsx("li", { children: i(t) }, t)) }) : /* @__PURE__ */ e.jsx("p", { children: i("No matrix-level items currently require review.") })
            ] }),
            R.state === "ready" && u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
              /* @__PURE__ */ e.jsx("h4", { children: i("Residual-evidence shortlist") }),
              /* @__PURE__ */ e.jsx("p", { children: i("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                screened: Ce.screenedCount.toLocaleString(),
                candidateSuffix: Ce.candidateCount > Ce.screenedCount ? i(" of {count}", { count: Ce.candidateCount.toLocaleString() }) : "",
                zeroSuffix: u.kind === "cytof" ? i(", and new exact-zero pile") : "",
                modeNote: i(ze === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
              }) }),
              Ce.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: Ce.items.map((t) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => Si(t.sourceIndex, t.receiverIndex),
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
                        i("matrix {value}%", { value: (t.coefficient * 100).toFixed(1) })
                      ] })
                    ] }),
                    /* @__PURE__ */ e.jsxs("span", { children: [
                      i("shift {shift} MAD · slope {slope}", {
                        shift: ne(t.evidence.normalizedNegativeShift ?? 0, 3),
                        slope: ne(t.evidence.residualSlope ?? 0, 4)
                      }),
                      u.kind === "cytof" ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                        " ",
                        i("· zero Δ {value} pp", { value: `${t.evidence.receiverZeroDeltaFraction >= 0 ? "+" : ""}${(t.evidence.receiverZeroDeltaFraction * 100).toFixed(1)}` })
                      ] }) : null
                    ] })
                  ]
                },
                t.pairKey
              )) }) : /* @__PURE__ */ e.jsx("p", { children: i("No pair had enough source-high, source-low, and receiver-negative events for this conservative screen. Visual inspection remains available from the matrix.") })
            ] })
          ] })
        ] }),
        Ms && u && /* @__PURE__ */ e.jsx(
          Ur,
          {
            profileLabel: (j == null ? void 0 : j.name) ?? (ue ? "SCE_spillover" : "embedded_FCS"),
            installedLabel: i(
              j ? "Installed matrix" : ue ? "SCE spillover matrix" : "Embedded FCS matrix"
            ),
            installedMatrix: {
              sourceChannels: u.sourceAxisKeys,
              receiverChannels: u.receiverAxisKeys,
              matrix: u.matrix
            },
            workingMatrix: $s,
            pendingEditCount: Object.keys(Y).length,
            onClose: () => li(!1)
          }
        ),
        Es && /* @__PURE__ */ e.jsx(
          Dr,
          {
            sampleName: s,
            populationName: (X == null ? void 0 : X.name) ?? i("All Events"),
            filterLabel: gi,
            pairCount: fi.length,
            onExport: Ys,
            onClose: () => ci(!1)
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
function da(n, s) {
  const r = n.visible !== !1, a = s.visible !== !1;
  return r || a ? !1 : n.sample === s.sample && n.stateKey === s.stateKey;
}
const pa = M.memo(ca, da);
export {
  pa as CompensationTab
};
