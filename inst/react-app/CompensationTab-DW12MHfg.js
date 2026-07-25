var zi = Object.defineProperty;
var _i = (n, i, r) => i in n ? zi(n, i, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[i] = r;
var Yn = (n, i, r) => _i(n, typeof i != "symbol" ? i + "" : i, r);
import { D as Ut, r as Ui, l as qi, s as Vi, z as Bi, u as Ke, a as A, j as e, b as ue, v as js, c as Gi, d as Wi, e as ws, f as Hi, F as Zi, g as Yi, C as Xi, h as Ji, i as Qi } from "./embed-RlN2Jv2r.js";
class he extends Error {
  constructor(r, a, o = {}) {
    super(a);
    Yn(this, "code");
    Yn(this, "row");
    Yn(this, "column");
    this.name = "CompensationMatrixTableError", this.code = r, this.row = o.row, this.column = o.column;
  }
}
const er = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
function Kt(n) {
  return n.trim().normalize("NFC");
}
function nr(n) {
  const i = Kt(n).toLowerCase();
  return i === "" || i === "x" || i === "row.names" || i === "channel" || i === "source";
}
function tr(n) {
  return n === "csv" ? "," : "	";
}
function sr(n) {
  let i = 0, r = 0, a = !1, o = !1, c = 1;
  const d = () => {
    if (i > 0 && r > 0)
      throw new he(
        "ambiguous-delimiter",
        "The matrix header mixes comma and tab delimiters. Choose CSV or TSV explicitly.",
        { row: c }
      );
    if (i === 0 && r === 0)
      throw new he(
        "missing-delimiter",
        "The matrix header must contain comma-separated or tab-separated columns.",
        { row: c }
      );
    return r > 0 ? "tsv" : "csv";
  };
  for (let p = 0; p < n.length; p++) {
    const v = n[p];
    if (v === '"') {
      o = !0, a && n[p + 1] === '"' ? p++ : a = !a;
      continue;
    }
    if (!a)
      if (v === ",")
        i++, o = !0;
      else if (v === "	")
        r++, o = !0;
      else if (v === "\r" || v === `
`) {
        if (o) return d();
        v === "\r" && n[p + 1] === `
` && p++, c++, i = 0, r = 0;
      } else /\s/.test(v) || (o = !0);
  }
  return d();
}
function ir(n, i) {
  const r = [];
  let a = [], o = "", c = !1, d = !1, p = 1, v = 1;
  const f = () => {
    a.push(o), o = "", d = !1;
  }, w = () => {
    f(), r.push({ cells: a, row: v }), a = [];
  };
  for (let M = 0; M < n.length; M++) {
    const b = n[M];
    if (c) {
      b === '"' ? n[M + 1] === '"' ? (o += '"', M++) : (c = !1, d = !0) : b === "\r" || b === `
` ? (b === "\r" && n[M + 1] === `
` && M++, o += `
`, p++) : o += b;
      continue;
    }
    if (d) {
      if (b === i)
        f();
      else if (b === "\r" || b === `
`)
        w(), b === "\r" && n[M + 1] === `
` && M++, p++, v = p;
      else if (b !== " ")
        throw new he(
          "malformed-quoted-field",
          "Unexpected text follows a closing quote in the compensation matrix.",
          { row: p, column: a.length + 1 }
        );
      continue;
    }
    if (b === '"') {
      if (o.length !== 0)
        throw new he(
          "malformed-quoted-field",
          "A quoted matrix field must begin with a quote.",
          { row: p, column: a.length + 1 }
        );
      c = !0;
    } else b === i ? f() : b === "\r" || b === `
` ? (w(), b === "\r" && n[M + 1] === `
` && M++, p++, v = p) : o += b;
  }
  if (c)
    throw new he(
      "malformed-quoted-field",
      "The compensation matrix contains an unclosed quoted field.",
      { row: v, column: a.length + 1 }
    );
  return (o.length > 0 || a.length > 0 || d) && w(), r.filter(
    ({ cells: M }) => !(M.length === 1 && M[0].trim().length === 0)
  );
}
function rr(n, i, r) {
  const a = n.trim();
  if (!er.test(a))
    throw new he(
      "invalid-coefficient",
      `Matrix coefficient at row ${i}, column ${r} is not a finite decimal number.`,
      { row: i, column: r }
    );
  const o = Number(a);
  if (!Number.isFinite(o))
    throw new he(
      "invalid-coefficient",
      `Matrix coefficient at row ${i}, column ${r} is outside the finite numeric range.`,
      { row: i, column: r }
    );
  return o;
}
function ar(n, i, r) {
  return Object.freeze({
    sourceChannels: Object.freeze(Array.from(n)),
    receiverChannels: Object.freeze(Array.from(i)),
    matrix: Object.freeze(r.map((a) => Object.freeze(Array.from(a))))
  });
}
function or(n, i = {}) {
  if (typeof n != "string")
    throw new he(
      "invalid-input",
      "The compensation matrix contents must be text."
    );
  const r = n.startsWith("\uFEFF") ? n.slice(1) : n;
  if (r.trim().length === 0)
    throw new he("empty-file", "The compensation matrix file is empty.");
  const a = i == null ? void 0 : i.delimiter;
  if (a !== void 0 && a !== "auto" && a !== "csv" && a !== "tsv")
    throw new he(
      "invalid-delimiter",
      "The compensation matrix delimiter must be auto, csv, or tsv."
    );
  const o = a ?? "auto", c = o === "auto" ? sr(r) : o, d = ir(r, tr(c));
  if (d.length === 0)
    throw new he("empty-file", "The compensation matrix file is empty.");
  const p = d[0];
  if (p.cells.length < 2)
    throw new he(
      "missing-receiver-columns",
      "The matrix header needs a source-channel column and at least one receiver channel.",
      { row: p.row }
    );
  const v = p.cells[0];
  if (!nr(v))
    throw new he(
      "missing-source-column",
      "The first column must identify source channels (blank, X, row.names, channel, or source).",
      { row: p.row, column: 1 }
    );
  if (d.length < 2)
    throw new he(
      "missing-data-rows",
      "The compensation matrix does not contain any source-channel rows.",
      { row: p.row + 1 }
    );
  const f = p.cells.slice(1).map(Kt), w = [], M = [];
  for (const b of d.slice(1)) {
    if (b.cells.length !== p.cells.length)
      throw new he(
        "row-width",
        `Matrix row ${b.row} has ${b.cells.length} columns; expected ${p.cells.length}.`,
        { row: b.row }
      );
    const N = Kt(b.cells[0]);
    if (N.length === 0)
      throw new he(
        "missing-source-channel",
        `Matrix row ${b.row} has no source-channel identity.`,
        { row: b.row, column: 1 }
      );
    w.push(N), M.push(
      b.cells.slice(1).map((T, P) => rr(T, b.row, P + 2))
    );
  }
  return Object.freeze({
    input: ar(w, f, M),
    format: Object.freeze({ delimiter: c, sourceColumnHeader: v })
  });
}
function Rt(n) {
  const i = n.trim().normalize("NFC"), r = i.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (r)
    return { element: r[1], mass: Number(r[2]) };
  const a = i.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return a ? { element: a[2], mass: Number(a[1]) } : null;
}
function Ns(n) {
  return n.map((i, r) => ({ channel: i, index: r, isotope: Rt(i) })).sort((i, r) => i.isotope && r.isotope ? i.isotope.mass - r.isotope.mass || i.isotope.element.localeCompare(r.isotope.element) || i.index - r.index : i.isotope ? -1 : r.isotope ? 1 : i.index - r.index).map(({ index: i }) => i);
}
function lr(n) {
  const i = Ns(n.sourceChannels), r = Ns(n.receiverChannels);
  return {
    sourceChannels: i.map((a) => n.sourceChannels[a]),
    receiverChannels: r.map((a) => n.receiverChannels[a]),
    matrix: i.map(
      (a) => r.map((o) => n.matrix[a][o])
    )
  };
}
function xn(n, i) {
  if (n === i) return "self";
  const r = Rt(n), a = Rt(i);
  if (!r || !a) return "other";
  const o = a.mass - r.mass;
  return r.element === a.element ? o === -1 ? "M-1" : o === 1 ? "M+1" : "same-element" : o === -1 ? "M-1" : o === 1 ? "M+1" : o === 16 ? "oxide (+16)" : "other";
}
function Jn(n, i) {
  const r = n.index(i);
  if (r !== void 0) return r;
  const a = n.channels.findIndex((o) => o.pnn === i);
  return a < 0 ? void 0 : a;
}
function en(n, i, r) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(i) || i <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (r && r.length !== n)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const a = r ? r.reduce((f, w) => f + (w ? 1 : 0), 0) : n, o = Math.min(a, i), c = new Uint32Array(o);
  if (o === 0) return c;
  if (!r) {
    if (o === 1) return c;
    for (let f = 0; f < o; f++)
      c[f] = Math.floor(f * (n - 1) / (o - 1));
    return c;
  }
  const d = Array.from({ length: o }, (f, w) => o === 1 ? 0 : Math.floor(w * (a - 1) / (o - 1)));
  let p = 0, v = 0;
  for (let f = 0; f < n && v < o; f++)
    r[f] && (p === d[v] && (c[v++] = f), p++);
  return c;
}
function tn(n, i) {
  if (n.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (n.length - 1), a = Math.floor(r), o = Math.ceil(r);
  return a === o ? n[a] : n[a] + (n[o] - n[a]) * (r - a);
}
function Qn(n) {
  const i = n.filter(Number.isFinite).sort((c, d) => c - d);
  if (i.length === 0) return [-1, 1];
  let r = tn(i, 2e-3), a = tn(i, 0.998);
  if (!(a > r)) {
    const c = Number.isFinite(r) ? r : 0, d = Math.max(1, Math.abs(c) * 0.05);
    return [c - d, c + d];
  }
  const o = (a - r) * 0.035;
  return r -= o, a += o, [r, a];
}
function Ie(n) {
  if (n.length === 0) return Number.NaN;
  const i = [...n].sort((r, a) => r - a);
  return tn(i, 0.5);
}
function et(n) {
  if (n.length === 0) return Number.NaN;
  const i = Ie(n), r = Ie(n.map((d) => Math.abs(d - i))) * 1.4826;
  if (Number.isFinite(r) && r > 0) return r;
  const a = n.reduce((d, p) => d + p, 0) / n.length, o = n.reduce((d, p) => d + (p - a) ** 2, 0) / Math.max(1, n.length - 1), c = Math.sqrt(o);
  return Number.isFinite(c) && c > 0 ? c : 1e-12;
}
function Ot(n, i, r = 12) {
  if (n.length !== i.length || n.length < r * 8) return null;
  const a = Array.from({ length: n.length }, (p, v) => v).sort((p, v) => n[p] - n[v]), o = [];
  for (let p = 0; p < r; p++) {
    const v = Math.floor(p * a.length / r), f = Math.floor((p + 1) * a.length / r), w = a.slice(v, f);
    if (w.length < 8) continue;
    const M = Ie(w.map((N) => n[N])), b = Ie(w.map((N) => i[N]));
    Number.isFinite(M) && Number.isFinite(b) && o.push({ x: M, y: b });
  }
  const c = [];
  for (let p = 0; p < o.length; p++)
    for (let v = p + 1; v < o.length; v++) {
      const f = o[v].x - o[p].x;
      if (f === 0) continue;
      const w = (o[v].y - o[p].y) / f;
      Number.isFinite(w) && c.push(w);
    }
  const d = Ie(c);
  return Number.isFinite(d) ? d : null;
}
function cr(n, i) {
  if (n.length !== i.length || n.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const r = Array.from({ length: n.length }, (k, O) => O).filter((k) => Number.isFinite(n[k]) && Number.isFinite(i[k])).sort((k, O) => n[k] - n[O]);
  if (r.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const a = Math.max(96, Math.floor(r.length * 0.8)), o = Math.min(r.length - 24, Math.floor(r.length * 0.9)), c = r.slice(0, a), d = r.slice(o);
  if (c.length < 96 || d.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const p = c.map((k) => n[k]), v = c.map((k) => i[k]), f = Ot(p, v, 10);
  if (f === null) return { excessMad: null, slopeDeltaMad: null };
  const w = Ie(c.map((k) => i[k] - f * n[k])), M = c.map((k) => i[k] - (w + f * n[k])), b = Math.max(
    et(M),
    et(v) * 0.05,
    1e-12
  ), N = d.map((k) => i[k] - (w + f * n[k])).sort((k, O) => k - O), T = tn(N, 0.75) / b, P = r.slice(Math.floor(r.length * 0.75)), I = P.map((k) => n[k]), E = P.map((k) => i[k]), $ = Ot(I, E, 4), F = tn(I, 0.9) - tn(I, 0.1), C = $ === null || !(F > 0) ? null : ($ - f) * F / b;
  return {
    excessMad: Number.isFinite(T) ? T : null,
    slopeDeltaMad: Number.isFinite(C) ? C : null
  };
}
function Ws(n, i, r, a, o, c) {
  const d = r.length, p = cr(r, a), v = Math.min(50, Math.max(12, Math.floor(d * 0.01))), f = (g = 0, D = 0, Q = 0) => ({
    status: "insufficient",
    sourceLowEvents: g,
    sourceHighEvents: D,
    destinationNegativeEvents: Q,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: p.excessMad,
    upperTailSlopeDeltaMad: p.slopeDeltaMad,
    receiverZeroDeltaFraction: d > 0 ? (c - o) / d : 0
  });
  if (d < v * 3) return f();
  const w = [...r].sort((g, D) => g - D), M = tn(w, 0.25), b = r.flatMap((g, D) => g <= M ? [D] : []);
  if (b.length < v) return f(b.length);
  const N = b.map((g) => r[g]), T = Ie(N), P = et(N);
  let I = r.flatMap((g, D) => g >= T + 3 * P ? [D] : []);
  if (I.length < v && (I = Array.from({ length: d }, (g, D) => D).sort((g, D) => r[D] - r[g]).slice(0, v)), I.length < v) return f(b.length, I.length);
  const E = b.map((g) => a[g]), $ = Ie(E), F = et(E), C = $ + 5 * F, k = a.flatMap((g, D) => g <= C ? [D] : []), O = new Set(k), L = b.filter((g) => O.has(g)), s = I.filter((g) => O.has(g));
  if (L.length < v || s.length < v)
    return f(b.length, I.length, k.length);
  const K = (Ie(s.map((g) => a[g])) - Ie(L.map((g) => a[g]))) / F, G = k.map((g) => n[g]), R = k.map((g) => i[g]);
  return {
    status: "ready",
    sourceLowEvents: b.length,
    sourceHighEvents: I.length,
    destinationNegativeEvents: k.length,
    normalizedNegativeShift: Number.isFinite(K) ? K : null,
    residualSlope: Ot(G, R),
    upperTailExcessMad: p.excessMad,
    upperTailSlopeDeltaMad: p.slopeDeltaMad,
    receiverZeroDeltaFraction: d > 0 ? (c - o) / d : 0
  };
}
function nt(n, i, r, a, o, c) {
  let d = 0, p = 0, v = 0;
  for (let f = 0; f < r.length; f++) {
    const w = Math.abs(r[f]) <= 1e-12, M = Math.abs(a[f]) <= 1e-12;
    w && d++, M && p++, w && M && v++;
  }
  return {
    x: n.map((f) => Math.max(o[0], Math.min(o[1], f))),
    y: i.map((f) => Math.max(c[0], Math.min(c[1], f))),
    zeroPile: Object.freeze({
      source: d,
      receiver: p,
      corner: v
    })
  };
}
function At(n, i, r, a = {}) {
  var g;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation to compare Original and Compensated data." };
  const c = Jn(n, i), d = Jn(n, r);
  if (c === void 0 || d === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (n.fcs.nEvents === 0)
    return { ready: !1, reason: "This sample contains no events." };
  const p = ((g = a.fixedEventIndices) == null ? void 0 : g.slice()) ?? en(
    n.fcs.nEvents,
    a.maxEvents ?? 15e3,
    a.eventMask
  );
  for (const D of p)
    if (D >= n.fcs.nEvents || a.eventMask && !a.eventMask[D])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const v = n.channels[c].key, f = n.channels[d].key, w = n.originalColumnData(c), M = n.originalColumnData(d), b = n.compensatedColumnData(c), N = n.compensatedColumnData(d), T = [], P = [], I = [], E = [], $ = [], F = [], C = [], k = [];
  for (const D of p) {
    const Q = n.rawToDisplay(v, w[D]), ee = n.rawToDisplay(f, M[D]), Se = n.rawToDisplay(v, b[D]), ce = n.rawToDisplay(f, N[D]);
    [Q, ee, Se, ce].every(Number.isFinite) && (T.push(Q), P.push(ee), I.push(w[D]), E.push(M[D]), $.push(Se), F.push(ce), C.push(b[D]), k.push(N[D]));
  }
  const O = Qn([...T, ...$]), L = Qn([...P, ...F]), s = n.channelTicks(c, [O[0], O[1]]), K = n.channelTicks(d, [L[0], L[1]]), G = nt(
    T,
    P,
    I,
    E,
    O,
    L
  ), R = nt(
    $,
    F,
    C,
    k,
    O,
    L
  );
  return {
    ready: !0,
    preview: {
      eventCount: T.length,
      totalEvents: a.eventMask ? a.eligibleEventCount ?? a.eventMask.reduce((D, Q) => D + (Q ? 1 : 0), 0) : n.fcs.nEvents,
      xRange: O,
      yRange: L,
      xTicks: s,
      yTicks: K,
      original: G,
      compensated: R,
      evidence: Ws(
        C,
        k,
        $,
        F,
        G.zeroPile.receiver,
        R.zeroPile.receiver
      )
    }
  };
}
function Tt(n, i, r, a, o, c, d = {}) {
  const p = Jn(n, i), v = Jn(n, r);
  if (p === void 0 || v === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (o.length !== a.length || c.length !== a.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const f = n.channels[p].key, w = n.channels[v].key, M = n.originalColumnData(p), b = n.originalColumnData(v), N = [], T = [], P = [], I = [], E = [], $ = [], F = [], C = [];
  for (let R = 0; R < a.length; R++) {
    const g = a[R];
    if (g >= n.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const D = M[g], Q = b[g], ee = o[R], Se = c[R], ce = n.rawToDisplay(f, D), Be = n.rawToDisplay(w, Q), jn = n.rawToDisplay(f, ee), Re = n.rawToDisplay(w, Se);
    [D, Q, ee, Se, ce, Be, jn, Re].every(Number.isFinite) && (N.push(ce), T.push(Be), P.push(D), I.push(Q), E.push(jn), $.push(Re), F.push(ee), C.push(Se));
  }
  const k = d.xRange ?? Qn([...N, ...E]), O = d.yRange ?? Qn([...T, ...$]), L = n.channelTicks(p, [k[0], k[1]]), s = n.channelTicks(v, [O[0], O[1]]), K = nt(N, T, P, I, k, O), G = nt(E, $, F, C, k, O);
  return {
    ready: !0,
    preview: {
      eventCount: N.length,
      totalEvents: d.totalEvents ?? n.fcs.nEvents,
      xRange: k,
      yRange: O,
      xTicks: L,
      yTicks: s,
      original: K,
      compensated: G,
      evidence: Ws(
        F,
        C,
        E,
        $,
        K.zeroPile.receiver,
        G.zeroPile.receiver
      )
    }
  };
}
const Cs = 0.5, dr = 0.01, ur = 1e-4, hr = 0.05, pr = 3, mr = 1, fr = 5;
function Hs(n, i) {
  const r = n.evidence.normalizedNegativeShift ?? 0, a = n.evidence.residualSlope ?? 0, o = Math.max(0, n.evidence.upperTailExcessMad ?? 0), c = Math.max(0, n.evidence.upperTailSlopeDeltaMad ?? 0), d = Math.abs(n.coefficient), p = Math.max(
    ur,
    d * hr
  );
  return {
    negativeShift: Math.max(0, -r),
    negativeSlope: Math.max(0, -a),
    zeroDelta: i === "cytof" ? Math.max(0, n.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, r),
    positiveSlope: Math.max(0, a),
    upperTailExcess: o,
    upperTailSlopeDelta: c,
    hasNegativeShift: r <= -Cs,
    hasNegativeSlope: a <= -p,
    hasNewZeroPile: i === "cytof" && n.evidence.receiverZeroDeltaFraction >= dr,
    hasPositiveShift: r >= Cs,
    hasPositiveSlope: a >= p,
    hasHighTailCurve: o >= pr && (c >= mr || o >= fr)
  };
}
function gr(n) {
  return Number(n.hasNegativeShift) + Number(n.hasNegativeSlope) + Number(n.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : n.hasNewZeroPile ? "new-zero-pile" : n.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function Dt(n, i, r = "biological") {
  const a = Hs(n, i), o = a.hasNegativeShift || a.hasNegativeSlope || a.hasNewZeroPile, c = a.hasPositiveShift || a.hasPositiveSlope, d = a.hasHighTailCurve || r === "control" && c;
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
    reason: gr(a),
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
function qe(n, i) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  const r = i.filter((o) => Number.isFinite(o) && o > 0).sort((o, c) => o - c);
  if (r.length === 0) return 0;
  let a = 0;
  for (const o of r)
    if (o <= n) a++;
    else break;
  return a / r.length;
}
function xr(n, i, r = "biological") {
  const a = n.map((T) => ({
    ...Hs(T, i),
    coefficient: Math.abs(T.coefficient)
  })), o = (T) => a.map((P) => typeof P[T] == "number" ? P[T] : 0), c = o("negativeShift"), d = o("negativeSlope"), p = o("zeroDelta"), v = o("positiveShift"), f = o("positiveSlope"), w = o("upperTailExcess"), M = o("upperTailSlopeDelta"), b = o("coefficient"), N = n.flatMap((T, P) => {
    const I = Dt(T, i, r);
    if (!I.automaticFollowup || I.reason === null) return [];
    const E = a[P], $ = 0.22 * qe(E.negativeShift, c) + 0.13 * qe(E.negativeSlope, d) + 0.14 * qe(E.zeroDelta, p) + (r === "control" ? 0.13 * qe(E.positiveShift, v) : 0) + (r === "control" ? 0.08 * qe(E.positiveSlope, f) : 0) + 0.12 * qe(E.upperTailExcess, w) + 0.08 * qe(E.upperTailSlopeDelta, M) + 0.05 * qe(E.coefficient, b) + 0.05 * Math.max(0, Math.min(1, T.physicalPrior));
    return [{
      index: P,
      relativePriority: $,
      reason: I.reason,
      category: I.category
    }];
  });
  return Object.freeze(N.sort((T, P) => P.relativePriority - T.relativePriority || T.index - P.index));
}
function vr(n, i) {
  const r = n.index(i);
  if (r !== void 0) return r;
  const a = n.channels.findIndex((o) => o.pnn === i);
  return a < 0 ? void 0 : a;
}
function Lt(n, i) {
  if (n.length === 0) return 0;
  const r = Math.max(0, Math.min(1, i)) * (n.length - 1), a = Math.floor(r), o = Math.ceil(r);
  return a === o ? n[a] : n[a] + (n[o] - n[a]) * (r - a);
}
function br(n) {
  const i = n.filter(Number.isFinite).sort((c, d) => c - d);
  if (i.length === 0) return [-1, 1];
  let r = Lt(i, 2e-3), a = Lt(i, 0.998);
  if (!(a > r)) {
    const c = Number.isFinite(r) ? r : 0, d = Math.max(1, Math.abs(c) * 0.05);
    return [c - d, c + d];
  }
  const o = (a - r) * 0.035;
  return r -= o, a += o, [r, a];
}
function yr(n) {
  if (n.length === 0) return "0:empty";
  let i = 2166136261;
  for (const r of n)
    i ^= r, i = Math.imul(i, 16777619) >>> 0;
  return `${n.length}:${n[0]}:${n[n.length - 1]}:${i.toString(16)}`;
}
function jr(n, i, r = {}) {
  var p;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const o = ((p = r.fixedEventIndices) == null ? void 0 : p.slice()) ?? en(
    n.fcs.nEvents,
    r.maxEvents ?? 2500,
    r.eventMask
  );
  for (const v of o)
    if (v >= n.fcs.nEvents || r.eventMask && !r.eventMask[v])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const c = /* @__PURE__ */ new Map();
  for (const v of Array.from(new Set(i))) {
    const f = vr(n, v);
    if (f === void 0) continue;
    const w = n.channels[f], M = n.originalColumnData(f), b = n.compensatedColumnData(f), N = new Float64Array(o.length), T = new Float64Array(o.length), P = new Float64Array(o.length), I = new Float64Array(o.length), E = [];
    for (let C = 0; C < o.length; C++) {
      const k = o[C], O = M[k], L = b[k], s = n.rawToDisplay(w.key, O), K = n.rawToDisplay(w.key, L);
      N[C] = O, T[C] = L, P[C] = s, I[C] = K, Number.isFinite(s) && E.push(s), Number.isFinite(K) && E.push(K);
    }
    const $ = br(E), F = Object.freeze({
      key: w.key,
      pnn: w.pnn,
      range: $,
      ticks: n.channelTicks(f, [$[0], $[1]]),
      originalRaw: N,
      compensatedRaw: T,
      originalDisplay: P,
      compensatedDisplay: I
    });
    c.set(v, F), c.set(w.key, F), c.set(w.pnn, F);
  }
  const d = r.eventMask ? r.eligibleEventCount ?? r.eventMask.reduce((v, f) => v + (f ? 1 : 0), 0) : n.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: o,
      eventSignature: yr(o),
      eligibleEventCount: d,
      channels: c
    })
  };
}
function Ss(n, i, r, a, o, c, d) {
  const p = [], v = [];
  let f = 0, w = 0, M = 0;
  for (const b of o) {
    p.push(Math.max(c[0], Math.min(c[1], n[b]))), v.push(Math.max(d[0], Math.min(d[1], i[b])));
    const N = Math.abs(r[b]) <= 1e-12, T = Math.abs(a[b]) <= 1e-12;
    N && f++, T && w++, N && T && M++;
  }
  return {
    x: p,
    y: v,
    zeroPile: Object.freeze({ source: f, receiver: w, corner: M })
  };
}
function Zs(n, i, r) {
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
      original: Ss(
        a.originalDisplay,
        o.originalDisplay,
        a.originalRaw,
        o.originalRaw,
        c,
        a.range,
        o.range
      ),
      compensated: Ss(
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
function Ms(n, i, r, a, o) {
  const c = Math.max(1, Math.min(24, Math.round(o) || 3)), d = 256, p = c, v = d + 2 * p, f = new Float64Array(v * v), w = Math.max(1e-12, i[1] - i[0]), M = Math.max(1e-12, r[1] - r[0]);
  for (let E = 0; E < n.x.length; E++) {
    const $ = Math.max(0, Math.min(
      v - 1,
      Math.floor((n.x[E] - i[0]) / w * d) + p
    )), F = Math.max(0, Math.min(
      v - 1,
      Math.floor((n.y[E] - r[0]) / M * d) + p
    ));
    f[F * v + $]++;
  }
  const b = new Float64Array(v * v), N = (c * 2 + 1) ** 2, T = v + 1, P = new Float64Array(T * T);
  for (let E = 0; E < v; E++) {
    let $ = 0;
    for (let F = 0; F < v; F++)
      $ += f[E * v + F], P[(E + 1) * T + F + 1] = P[E * T + F + 1] + $;
  }
  for (let E = c; E < v - c; E++) {
    const $ = E - c, F = E + c + 1;
    for (let C = c; C < v - c; C++) {
      const k = C - c, O = C + c + 1, L = P[F * T + O] - P[$ * T + O] - P[F * T + k] + P[$ * T + k];
      b[E * v + C] = L / N;
    }
  }
  const I = [];
  for (let E = p; E < p + d; E++)
    for (let $ = p; $ < p + d; $++) {
      const F = b[E * v + $];
      F > 0 && I.push(F);
    }
  return I.sort((E, $) => E - $), I.length === 0 ? 1 : Math.max(1e-12, Lt(I, a));
}
function qt(n, i) {
  const r = Math.max(1, Math.min(10, Number.isFinite(n) ? n : 6)), a = Math.max(1, (Number.isFinite(i) ? i : 220) - 50);
  return Math.max(1, Math.min(24, r * 170 / a));
}
function Vt(n, i = 0.95, r = 3, a = Ut) {
  const o = Math.max(
    Ms(n.original, n.xRange, n.yRange, i, r),
    Ms(n.compensated, n.xRange, n.yRange, i, r)
  );
  return Ui(o, a);
}
function tt(n, i) {
  const r = i.size / 220, a = Math.sqrt(r), o = Math.max(7, Math.min(11, 10 * a)), c = 20, d = Math.ceil(c + o + 4);
  qi().renderMiniPlot(n, {
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
const nn = "http://www.w3.org/2000/svg", Kn = 6, yn = 1123, st = 794;
function Ys(n) {
  return Math.ceil(Math.max(0, Math.floor(n)) / Kn);
}
function Es(n) {
  return n.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function Xs(n, i) {
  return `gatelab-compensation-${Es(n.replace(/\.[^.]+$/, ""))}-${Es(i)}`;
}
function zt(n, i, r, a) {
  const o = Xs(n, i);
  return r === "pdf" || a <= 1 ? `${o}.${r}` : `${o}-${r}-pages.zip`;
}
function vn(n, i, r, a, o = {}) {
  const c = document.createElementNS(nn, "text");
  return c.setAttribute("x", String(r)), c.setAttribute("y", String(a)), c.setAttribute("font-family", "Arial, Helvetica, sans-serif"), c.setAttribute("font-size", String(o.size ?? 10)), c.setAttribute("font-weight", String(o.weight ?? 400)), c.setAttribute("fill", o.fill ?? "#253247"), o.anchor && c.setAttribute("text-anchor", o.anchor), c.textContent = i, n.appendChild(c), c;
}
function ks(n, i) {
  return n.length <= i ? n : `${n.slice(0, Math.max(1, i - 1))}…`;
}
function As(n, i, r, a, o, c, d, p, v, f, w) {
  const M = document.createElement("div");
  tt(M, {
    title: a === "original" ? "Original" : "Compensated",
    panel: r[a],
    preview: r,
    sourceLabel: i.sourceLabel,
    receiverLabel: i.receiverLabel,
    size: d,
    densityColorCeiling: v,
    densitySmoothingRadius: p,
    densityColorPower: f,
    pointAlpha: w,
    canvasScale: 300 / 96
  });
  const b = M.querySelector("canvas"), N = M.querySelector("svg");
  if (!b || !N) throw new Error("GateLab could not render a compensation export panel.");
  const T = document.createElementNS(nn, "g");
  T.setAttribute("transform", `translate(${o},${c})`);
  const P = document.createElementNS(nn, "image");
  P.setAttribute("x", "0"), P.setAttribute("y", "0"), P.setAttribute("width", String(d)), P.setAttribute("height", String(d)), P.setAttribute("href", b.toDataURL("image/png")), T.appendChild(P), T.appendChild(N.cloneNode(!0)), n.appendChild(T);
}
function Ts(n, i, r, a) {
  const o = document.createElementNS(nn, "svg");
  o.setAttribute("xmlns", nn), o.setAttribute("width", String(yn)), o.setAttribute("height", String(st)), o.setAttribute("viewBox", `0 0 ${yn} ${st}`);
  const c = document.createElementNS(nn, "rect");
  c.setAttribute("width", "100%"), c.setAttribute("height", "100%"), c.setAttribute("fill", "#ffffff"), o.appendChild(c), vn(o, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), vn(
    o,
    ks(`${i.sampleName} · ${i.populationName} · ${i.profileName} · ${i.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), vn(o, `Page ${r + 1} of ${a}`, yn - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const d = 28, p = 18, v = 53, f = 771, w = (yn - d * 2 - p) / 2, M = (f - v) / 3, b = 204, N = 12, T = b * 2 + N;
  return n.forEach((P, I) => {
    const E = P.buildPreview(), $ = qt(i.densitySmoothing, b), F = Vt(
      E,
      0.95,
      $,
      i.densityColorPower
    ), C = I % 2, k = Math.floor(I / 2), O = d + C * (w + p), L = v + k * M, s = O + (w - T) / 2, K = L + 25, G = P.relationship && P.relationship !== "other" ? ` · ${P.relationship}` : "";
    if (vn(
      o,
      ks(`${P.sourceLabel} → ${P.receiverLabel}`, 58),
      O + 5,
      L + 14,
      { size: 10.5, weight: 700 }
    ), vn(
      o,
      `matrix ${(P.coefficient * 100).toFixed(1)}%${G}`,
      O + w - 5,
      L + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), As(o, P, E, "original", s, K, b, $, F, i.densityColorPower, i.pointAlpha), As(o, P, E, "compensated", s + b + N, K, b, $, F, i.densityColorPower, i.pointAlpha), k < 2) {
      const R = document.createElementNS(nn, "line");
      R.setAttribute("x1", String(O)), R.setAttribute("x2", String(O + w)), R.setAttribute("y1", String(L + M - 3)), R.setAttribute("y2", String(L + M - 3)), R.setAttribute("stroke", "#e6eaf0"), R.setAttribute("stroke-width", "1"), o.appendChild(R);
    }
  }), vn(
    o,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), o;
}
function Fs(n) {
  return `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(n)}`;
}
async function $s(n, i = 300) {
  const r = URL.createObjectURL(new Blob([n], { type: "image/svg+xml" }));
  try {
    const a = await new Promise((p, v) => {
      const f = new Image();
      f.onload = () => p(f), f.onerror = () => v(new Error("GateLab could not rasterize the compensation export page.")), f.src = r;
    }), o = Math.max(1, i / 96), c = document.createElement("canvas");
    c.width = Math.round(yn * o), c.height = Math.round(st * o);
    const d = c.getContext("2d");
    if (!d) throw new Error("Canvas export is unavailable in this browser.");
    return d.fillStyle = "#ffffff", d.fillRect(0, 0, c.width, c.height), d.scale(o, o), d.drawImage(a, 0, 0, yn, st), await new Promise((p, v) => {
      c.toBlob((f) => f ? p(f) : v(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(r);
  }
}
function Ps(n, i) {
  const r = URL.createObjectURL(n), a = document.createElement("a");
  a.href = r, a.download = i, document.body.appendChild(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function wr(n, i, r, a) {
  const o = Math.max(2, String(r).length);
  return `${n}-page-${String(i + 1).padStart(o, "0")}.${a}`;
}
async function Nr(n, i, r, a) {
  const o = Ys(n.length);
  if (o === 0) throw new Error("No compensation pairs are available to export.");
  const c = Xs(i.sampleName, i.populationName);
  if (r === "pdf") {
    const { jsPDF: f } = await import("./jspdf.es.min-18-uOzFH.js").then((N) => N.j), w = new f({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), M = w.internal.pageSize.getWidth(), b = w.internal.pageSize.getHeight();
    for (let N = 0; N < o; N++) {
      N > 0 && w.addPage("a4", "landscape");
      const T = n.slice(
        N * Kn,
        (N + 1) * Kn
      ), P = Fs(Ts(T, i, N, o)), I = await $s(P), E = await new Promise(($, F) => {
        const C = new FileReader();
        C.onload = () => $(String(C.result)), C.onerror = () => F(C.error ?? new Error("GateLab could not read an export page.")), C.readAsDataURL(I);
      });
      w.addImage(E, "PNG", 0, 0, M, b, void 0, "FAST"), a == null || a({ completedPages: N + 1, totalPages: o }), await new Promise(($) => setTimeout($, 0));
    }
    w.save(zt(i.sampleName, i.populationName, r, o));
    return;
  }
  const d = {};
  let p = null;
  for (let f = 0; f < o; f++) {
    const w = n.slice(
      f * Kn,
      (f + 1) * Kn
    ), M = Fs(Ts(w, i, f, o)), b = wr(c, f, o, r);
    if (r === "svg") {
      const N = Vi(M);
      d[b] = N, o === 1 && (p = new Blob([N], { type: "image/svg+xml" }));
    } else {
      const N = await $s(M), T = new Uint8Array(await N.arrayBuffer());
      d[b] = T, o === 1 && (p = N);
    }
    a == null || a({ completedPages: f + 1, totalPages: o }), await new Promise((N) => setTimeout(N, 0));
  }
  const v = zt(
    i.sampleName,
    i.populationName,
    r,
    o
  );
  Ps(o === 1 && p ? p : new Blob([Bi(d, { level: 6 })], { type: "application/zip" }), v);
}
const Cr = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function Sr({
  sampleName: n,
  populationName: i,
  filterLabel: r,
  pairCount: a,
  onExport: o,
  onClose: c
}) {
  const { t: d } = Ke(), [p, v] = A.useState("pdf"), [f, w] = A.useState(null), [M, b] = A.useState(null), N = Ys(a), T = f !== null && f.completedPages < f.totalPages, P = zt(n, i, p, N), I = async () => {
    b(null), w({ completedPages: 0, totalPages: N });
    try {
      await o(p, w), c();
    } catch ($) {
      w(null), b($ instanceof Error ? $.message : String($));
    }
  }, E = ($) => {
    $.key === "Escape" && !T && c();
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
          Cr.map(($) => /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-comparison-export-format",
                value: $.format,
                checked: p === $.format,
                disabled: T,
                onChange: () => v($.format)
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: $.title }),
              /* @__PURE__ */ e.jsx("small", { children: d($.detail) })
            ] })
          ] }, $.format))
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
            /* @__PURE__ */ e.jsx("dd", { children: d(N === 1 ? "{count} A4 landscape page · six pairs per page" : "{count} A4 landscape pages · six pairs per page", { count: N.toLocaleString() }) })
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
        M && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: d(M) }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: T, onClick: c, children: d("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: T || N === 0, onClick: () => void I(), children: T ? d("Rendering…") : d("Download {format}", { format: p.toUpperCase() }) })
        ] })
      ]
    }
  ) });
}
function Is(n) {
  return `"${n.replaceAll('"', '""')}"`;
}
function Ks(n, i) {
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
function Mr(n) {
  const i = Ks(n.sourceChannels, "source"), r = Ks(n.receiverChannels, "receiver");
  if (!Array.isArray(n.matrix) || n.matrix.length !== i.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const a = [
    ["channel", ...r].map(Is).join(",")
  ];
  return n.matrix.forEach((o, c) => {
    if (!Array.isArray(o) || o.length !== r.length)
      throw new Error(
        `Spill matrix row ${c + 1} does not match the receiver channel axis.`
      );
    const d = o.map((p, v) => {
      if (typeof p != "number" || !Number.isFinite(p))
        throw new Error(
          `Spill coefficient ${i[c]} → ${r[v]} is not finite.`
        );
      return Object.is(p, -0) ? "0" : String(p);
    });
    a.push([Is(i[c]), ...d].join(","));
  }), `${a.join(`
`)}
`;
}
function Er(n, i = "installed") {
  return `${n.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${i === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function kr(n) {
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
function Ar({
  profileLabel: n,
  installedLabel: i,
  installedMatrix: r,
  workingMatrix: a = null,
  pendingEditCount: o = 0,
  onClose: c
}) {
  const { t: d } = Ke(), [p, v] = A.useState("installed"), [f, w] = A.useState(null), M = p === "working" && a ? a : r, b = Er(n, p), N = A.useMemo(
    () => kr(b),
    [b]
  ), T = () => {
    w(null);
    try {
      const E = Mr(M), $ = URL.createObjectURL(new Blob([E], { type: "text/csv;charset=utf-8" })), F = document.createElement("a");
      F.href = $, F.download = b, document.body.appendChild(F), F.click(), F.remove(), setTimeout(() => URL.revokeObjectURL($), 1e3);
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
      await navigator.clipboard.writeText(N), w("R import code copied.");
    } catch {
      w("Clipboard access was denied; select the R code below and copy it manually.");
    }
  }, I = (E) => {
    E.key === "Escape" && c();
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
                onChange: () => v("installed")
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
                onChange: () => v("working")
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
            /* @__PURE__ */ e.jsx("dd", { children: b })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("Dimensions") }),
            /* @__PURE__ */ e.jsx("dd", { children: d("{sources} sources × {receivers} receivers", { sources: M.sourceChannels.length, receivers: M.receiverChannels.length }) })
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
        /* @__PURE__ */ e.jsx("pre", { className: "gl-comp-export-code", children: /* @__PURE__ */ e.jsx("code", { children: N }) }),
        f && /* @__PURE__ */ e.jsx("div", { className: f.includes("copied") ? "gl-comp-status" : "gl-comp-warning", role: "status", children: f }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: c, children: d("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", onClick: T, children: d("Download CSV") })
        ] })
      ]
    }
  ) });
}
function J(n, i) {
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
function Ve(n, i = !1, r = 3) {
  if (i && n === 0) return "·";
  const a = n * 100;
  return `${J(a, r)}%`;
}
function Ft(n) {
  const i = Math.max(0, Math.min(255, n)) / 255;
  return i <= 0.04045 ? i / 12.92 : ((i + 0.055) / 1.055) ** 2.4;
}
function Tr(n, i, r = !1) {
  if (r) return {};
  if (!Number.isFinite(n)) return { backgroundColor: "#ae3e3e", color: "#ffffff" };
  const a = i > 0 ? Math.min(1, Math.abs(n) / i) : 0;
  if (a === 0) return {};
  const o = 0.08 + 0.82 * Math.sqrt(a), c = n < 0 ? [47, 128, 237] : [211, 47, 47], d = c.map((v) => 255 + (v - 255) * o), p = 0.2126 * Ft(d[0]) + 0.7152 * Ft(d[1]) + 0.0722 * Ft(d[2]);
  return {
    backgroundColor: `rgba(${c.join(",")},${o})`,
    color: p < 0.25 ? "#ffffff" : "#26384e"
  };
}
function bn({
  value: n,
  onValueChange: i,
  scrubStep: r,
  className: a = "",
  disabled: o,
  min: c,
  max: d,
  step: p,
  title: v,
  onPointerDown: f,
  onPointerMove: w,
  onPointerUp: M,
  onPointerCancel: b,
  onLostPointerCapture: N,
  ...T
}) {
  const { t: P } = Ke(), I = A.useRef(null), [E, $] = A.useState(!1), F = (C) => {
    var k, O, L;
    ((k = I.current) == null ? void 0 : k.pointerId) === C.pointerId && (I.current = null, $(!1), (L = (O = C.currentTarget).hasPointerCapture) != null && L.call(O, C.pointerId) && C.currentTarget.releasePointerCapture(C.pointerId));
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
      step: p,
      title: v ?? P("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (C) => i(C.currentTarget.value),
      onPointerDown: (C) => {
        var G, R;
        if (f == null || f(C), C.defaultPrevented || o || C.button !== 0) return;
        const k = C.currentTarget.getBoundingClientRect();
        if (C.clientX >= k.right - 18) return;
        const O = Number(n), L = (r ?? Number(p)) || 0.1;
        if (!Number.isFinite(O) || !(L > 0)) return;
        const s = String(L), K = s.includes("e-") ? Number(s.split("e-")[1]) : s.includes(".") ? s.split(".")[1].length : 0;
        I.current = {
          pointerId: C.pointerId,
          startY: C.clientY,
          startValue: O,
          step: L,
          decimals: K,
          lastSteps: 0
        }, (R = (G = C.currentTarget).setPointerCapture) == null || R.call(G, C.pointerId);
      },
      onPointerMove: (C) => {
        w == null || w(C);
        const k = I.current;
        if (!k || k.pointerId !== C.pointerId) return;
        const O = k.startY - C.clientY;
        if (Math.abs(O) < 3) return;
        const L = O > 0 ? Math.floor(O / 4) : Math.ceil(O / 4);
        if (L === k.lastSteps) return;
        let s = k.startValue + L * k.step;
        const K = c === void 0 ? Number.NEGATIVE_INFINITY : Number(c), G = d === void 0 ? Number.POSITIVE_INFINITY : Number(d);
        Number.isFinite(K) && (s = Math.max(K, s)), Number.isFinite(G) && (s = Math.min(G, s)), I.current = { ...k, lastSteps: L }, $(!0), i(s.toFixed(Math.min(10, k.decimals))), C.preventDefault();
      },
      onPointerUp: (C) => {
        M == null || M(C), F(C);
      },
      onPointerCancel: (C) => {
        b == null || b(C), F(C);
      },
      onLostPointerCapture: (C) => {
        var k;
        N == null || N(C), ((k = I.current) == null ? void 0 : k.pointerId) === C.pointerId && (I.current = null, $(!1));
      }
    }
  );
}
const Bt = A.createContext(Ut), Gt = A.createContext(0.85), Rs = "", Xn = [];
let $t = !1;
function Fr(n) {
  const i = { cancelled: !1, run: n };
  Xn.push(i);
  const r = () => {
    if ($t) return;
    $t = !0;
    const a = () => {
      $t = !1;
      let c = Xn.shift();
      for (; c != null && c.cancelled; ) c = Xn.shift();
      c == null || c.run(), Xn.length > 0 && r();
    }, o = window;
    typeof o.requestIdleCallback == "function" ? o.requestIdleCallback(a, { timeout: 50 }) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(a) : setTimeout(a, 0);
  };
  return r(), () => {
    i.cancelled = !0;
  };
}
function it({
  title: n,
  panel: i,
  preview: r,
  sourceLabel: a,
  receiverLabel: o,
  minimumSize: c = 210,
  maximumSize: d = 420,
  densityColorCeiling: p,
  densitySmoothing: v,
  showZeroPile: f = !0
}) {
  const { t: w } = Ke(), M = A.useContext(Bt), b = A.useContext(Gt), N = A.useRef(null);
  A.useEffect(() => {
    const I = N.current;
    if (!I) return;
    let E = null, $ = 0;
    const F = () => {
      var K;
      E = null;
      const O = ((K = I.parentElement) == null ? void 0 : K.clientWidth) ?? 230, L = Math.max(c, Math.min(d, Math.floor(O)));
      if (L === $ && I.childElementCount > 0) return;
      $ = L;
      const s = qt(v, L);
      tt(I, {
        title: n,
        panel: i,
        preview: r,
        sourceLabel: a,
        receiverLabel: o,
        size: L,
        densityColorCeiling: p ?? Vt(
          r,
          0.95,
          s,
          M
        ),
        densitySmoothingRadius: s,
        densityColorPower: M,
        pointAlpha: b
      });
    }, C = () => {
      E !== null && cancelAnimationFrame(E), E = requestAnimationFrame(F);
    };
    C();
    const k = typeof ResizeObserver > "u" ? null : new ResizeObserver(C);
    return k == null || k.observe(I.parentElement ?? I), () => {
      k == null || k.disconnect(), E !== null && cancelAnimationFrame(E);
    };
  }, [p, M, v, d, c, i, b, r, o, a, n]);
  const T = (I) => r.eventCount > 0 ? `${(I / r.eventCount * 100).toFixed(1)}%` : "0.0%", P = i.zeroPile.source > 0 || i.zeroPile.receiver > 0 || i.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": w("{title} density biplot; {source} on x, {receiver} on y", {
    title: n,
    source: a,
    receiver: o
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: N, className: "gl-comp-biplot-surface" }),
    f && P && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: w("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: T(i.zeroPile.source),
      receiver: T(i.zeroPile.receiver),
      both: T(i.zeroPile.corner)
    }) })
  ] });
}
function $r({
  title: n,
  preview: i,
  sourceLabel: r,
  receiverLabel: a,
  minimumSize: o,
  maximumSize: c,
  densityColorCeiling: d,
  densitySmoothing: p
}) {
  const { t: v } = Ke(), f = A.useContext(Bt), w = A.useContext(Gt), M = A.useRef(null);
  return A.useEffect(() => {
    const b = M.current;
    if (!b) return;
    let N = null, T = 0;
    const P = () => {
      var G;
      N = null;
      const $ = ((G = b.parentElement) == null ? void 0 : G.clientWidth) ?? o, F = Math.max(o, Math.min(c, Math.floor($)));
      if (F === T && b.dataset.cacheReady === "true") return;
      T = F, b.dataset.cacheReady = "false";
      const C = qt(p, F), k = d ?? Vt(
        i,
        0.95,
        C,
        f
      );
      tt(b, {
        title: n,
        panel: i.original,
        preview: i,
        sourceLabel: r,
        receiverLabel: a,
        size: F,
        densityColorCeiling: k,
        densitySmoothingRadius: C,
        densityColorPower: f,
        pointAlpha: w,
        canvasScale: 2
      });
      const O = b.querySelector("canvas"), L = b.querySelector("svg"), s = document.createElement("div");
      tt(s, {
        title: n,
        panel: i.compensated,
        preview: i,
        sourceLabel: r,
        receiverLabel: a,
        size: F,
        densityColorCeiling: k,
        densitySmoothingRadius: C,
        densityColorPower: f,
        pointAlpha: w,
        canvasScale: 2
      });
      const K = s.querySelector("canvas");
      !O || !K || !L || (O.classList.add("gl-comp-cached-canvas", "is-original"), O.dataset.assayLayer = "original", K.classList.add("gl-comp-cached-canvas", "is-compensated"), K.dataset.assayLayer = "compensated", b.insertBefore(K, L), b.dataset.cacheReady = "true");
    }, I = () => {
      N == null || N(), N = Fr(P);
    };
    I();
    const E = typeof ResizeObserver > "u" ? null : new ResizeObserver(I);
    return E == null || E.observe(b.parentElement ?? b), () => {
      E == null || E.disconnect(), N == null || N();
    };
  }, [d, f, p, c, o, w, i, a, r, n]), /* @__PURE__ */ e.jsx(
    "figure",
    {
      className: "gl-comp-biplot",
      "aria-label": v("Cached uncompensated and compensated density biplot; {source} on x, {receiver} on y", {
        source: r,
        receiver: a
      }),
      children: /* @__PURE__ */ e.jsx(
        "div",
        {
          ref: M,
          className: "gl-comp-biplot-surface gl-comp-cached-biplot",
          "data-cache-mode": "dual-canvas"
        }
      )
    }
  );
}
function Os({
  preview: n,
  sourceLabel: i,
  receiverLabel: r,
  kind: a,
  densitySmoothing: o,
  compact: c = !1,
  compensatedTitle: d = "Compensated"
}) {
  const { t: p } = Ke(), v = n.eventCount > 0 ? n.original.zeroPile.receiver / n.eventCount * 100 : 0, f = n.eventCount > 0 ? n.compensated.zeroPile.receiver / n.eventCount * 100 : 0, w = f - v;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${c ? " is-compact" : ""}`, children: [
    !c && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: p("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: n.eventCount.toLocaleString(),
      sampled: n.totalEvents > n.eventCount ? p(" sampled from {total}", { total: n.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        it,
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
        it,
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
      original: v.toFixed(1),
      compensated: f.toFixed(1),
      delta: `${w >= 0 ? "+" : ""}${w.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: p("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: d
    }) }) }),
    !c && (n.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": p("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: p("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: p("{value} MAD", { value: J(n.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: p("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: J(n.evidence.residualSlope ?? 0, 4) })
      ] }),
      n.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: p("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: p("{value} MAD", { value: J(n.evidence.upperTailExcessMad, 3) }) })
      ] }),
      n.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: p("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: p("{value} MAD", { value: J(n.evidence.upperTailSlopeDeltaMad, 3) }) })
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
function Pr({
  matrixView: n,
  sourceChannels: i,
  receiverChannels: r,
  selectedSourceIndex: a,
  selectedReceiverIndex: o,
  stagedCoefficients: c,
  maximumAbsoluteOffDiagonal: d,
  onSelect: p
}) {
  const { t: v } = Ke(), f = 6, w = 74, M = 44, b = 10, N = r.length * f, T = i.length * f, P = w + N + w, I = M + T + b, E = A.useMemo(() => {
    const F = [];
    for (let C = 0; C < n.matrix.length; C++)
      for (let k = 0; k < n.matrix[C].length; k++) {
        const O = n.sourceAxisKeys[C], L = n.receiverAxisKeys[k], s = `${O}${Rs}${L}`, K = c[s] ?? n.matrix[C][k], G = O === L;
        if (!G && (!Number.isFinite(K) || K === 0)) continue;
        const R = d > 0 && Number.isFinite(K) ? Math.min(1, Math.abs(K) / d) : 0, g = R > 0 ? 0.12 + 0.82 * Math.sqrt(R) : 0;
        F.push({
          sourceIndex: C,
          receiverIndex: k,
          pairKey: s,
          value: K,
          diagonal: G,
          fill: G ? "#cfd4db" : Number.isFinite(K) ? K < 0 ? `rgba(47,128,237,${g})` : `rgba(211,47,47,${g})` : "#ae3e3e"
        });
      }
    return F;
  }, [n, d, c]), $ = (F) => {
    const C = F.currentTarget.getBoundingClientRect();
    if (!(C.width > 0) || !(C.height > 0)) return;
    const k = (F.clientX - C.left) * P / C.width, O = (F.clientY - C.top) * I / C.height, L = Math.floor((k - w) / f), s = Math.floor((O - M) / f);
    s < 0 || s >= i.length || L < 0 || L >= r.length || n.sourceAxisKeys[s] === n.receiverAxisKeys[L] || p(`${n.sourceAxisKeys[s]}${Rs}${n.receiverAxisKeys[L]}`);
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
        onPointerDown: $,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: w, y: M, width: N, height: T, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          r.map((F, C) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: w + (C + 0.55) * f,
              y: M - 3,
              transform: `rotate(-58 ${w + (C + 0.55) * f} ${M - 3})`,
              textAnchor: "start",
              className: C === o ? "is-selected" : void 0,
              children: F.pnn
            },
            F.key
          )),
          i.map((F, C) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: w - 3,
              y: M + (C + 0.72) * f,
              textAnchor: "end",
              className: C === a ? "is-selected" : void 0,
              children: F.pnn
            },
            F.key
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: w,
              y: M + a * f,
              width: N,
              height: f,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: w + o * f,
              y: M,
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
              y: M + F.sourceIndex * f,
              width: f,
              height: f,
              fill: F.fill,
              pointerEvents: "none",
              children: /* @__PURE__ */ e.jsx("title", { children: F.diagonal ? v("{channel} · self", { channel: i[F.sourceIndex].combined }) : `${i[F.sourceIndex].combined} → ${r[F.receiverIndex].combined} · ${Ve(F.value)}` })
            },
            F.pairKey
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: w + o * f,
              y: M + a * f,
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
function Ir({
  dataset: n,
  pair: i,
  plotSize: r,
  densitySmoothing: a,
  flagged: o,
  selected: c,
  onSelect: d,
  onFlag: p
}) {
  const { t: v } = Ke(), f = A.useRef(null), [w, M] = A.useState(() => typeof IntersectionObserver > "u");
  A.useEffect(() => {
    const T = f.current;
    if (!T || typeof IntersectionObserver > "u") {
      M(!0);
      return;
    }
    const P = new IntersectionObserver(
      (I) => M(I.some((E) => E.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return P.observe(T), () => P.disconnect();
  }, []);
  const b = A.useMemo(
    () => w ? Zs(n, i.source.key, i.receiver.key) : null,
    [n, i.receiver.key, i.source.key, w]
  ), N = b != null && b.ready ? b.preview : null;
  return /* @__PURE__ */ e.jsxs(
    "article",
    {
      ref: f,
      className: `gl-comp-global-tile${c ? " is-selected" : ""}${o ? " is-flagged" : ""}`,
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
              onClick: d,
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
              checked: o,
              "aria-label": v("Flag global inspector pair {source} to {receiver} for follow-up", {
                source: i.source.label,
                receiver: i.receiver.label
              }),
              onChange: (T) => p(T.currentTarget.checked)
            }
          ) })
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            type: "button",
            className: "gl-comp-global-plot-button",
            onClick: d,
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
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: r, height: r }, children: N ? /* @__PURE__ */ e.jsx(
              $r,
              {
                title: "",
                preview: N,
                sourceLabel: i.source.label,
                receiverLabel: i.receiver.label,
                minimumSize: r,
                maximumSize: r,
                densitySmoothing: a
              }
            ) : b && !b.ready ? /* @__PURE__ */ e.jsx("span", { children: b.reason }) : /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" }) })
          }
        )
      ]
    }
  );
}
function Kr({
  stateKey: n,
  header: i,
  children: r
}) {
  const { t: a } = Ke(), [o, c] = ue(
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
const Rr = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, Or = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], Pe = "", Ds = 2500, Ls = 400, Dr = 2500, zs = 15e3, _s = [2500, 5e3, 15e3, 5e4], Lr = 24, Us = 4, qs = 624, zr = Object.freeze({});
function Vs(n) {
  if (!Number.isFinite(n)) return String(n);
  const i = n * 100;
  if (i === 0) return "0.0";
  const r = Math.abs(i), a = r >= 1 ? 1 : r >= 0.1 ? 2 : 3;
  return i.toFixed(a);
}
function Pt(n) {
  return n.replace(/(?: · (?:edited|revised))+$/u, "");
}
function rt(n, i) {
  const r = n.index(i), a = r === void 0 ? i : n.channels[r].pnn, o = n.labelForKey(i);
  return {
    key: i,
    pnn: a,
    label: o,
    combined: o === a ? a : `${o} (${a})`
  };
}
function It(n, i) {
  const r = n.channels.find((a) => a.pnn === i);
  return rt(n, (r == null ? void 0 : r.key) ?? i);
}
function _r(n, i) {
  return n === "cytof-spillover" && i === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function Ur(n) {
  return n.replaceAll("-", " ");
}
function _t(n) {
  if (n.length === 0) return 0;
  n.sort((r, a) => r - a);
  const i = Math.floor(n.length / 2);
  return n.length % 2 === 0 ? (n[i - 1] + n[i]) / 2 : n[i];
}
function qr(n) {
  return Object.fromEntries(n.scientific.solverSettings.map(({ key: i, value: r }) => [i, r]));
}
function Vr(n, i) {
  const r = Object.freeze({ ...n.scientific.matrix, matrix: i }), a = qr(n);
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
function Bs(n, i, r, a) {
  const o = n.scientific.matrix.sourceChannels.indexOf(i), c = n.scientific.matrix.receiverChannels.indexOf(r);
  if (o < 0 || c < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(n.scientific.matrix.matrix.map(
    (d, p) => Object.freeze(d.map((v, f) => p === o && f === c ? a : v))
  ));
}
function Br(n, i, r) {
  var d;
  if (!n) return null;
  const a = n.scientific.matrix.sourceChannels.indexOf(i), o = n.scientific.matrix.receiverChannels.indexOf(r);
  if (a < 0 || o < 0) return null;
  const c = (d = n.scientific.matrix.matrix[a]) == null ? void 0 : d[o];
  return Number.isFinite(c) ? c : null;
}
function Gs(n, i, r) {
  const a = Math.max(Math.abs(n), Math.abs(i), 1e-3);
  return Object.freeze(r === "cytof" ? { lower: 0, upper: Math.max(n + a, a * 2) } : { lower: n - a, upper: n + a });
}
function Gr(n, i) {
  const r = (i - n) / 3;
  return Object.freeze([n, n + r, n + 2 * r, i]);
}
function Wr(n, i) {
  return n.length === i.length && n.every((r, a) => {
    var o;
    return r.length === ((o = i[a]) == null ? void 0 : o.length) && r.every((c, d) => c === i[a][d]);
  });
}
function Hr(n, i) {
  if (n.compensatedLayerStatus().state !== "ready" || i.length === 0 || n.fcs.nEvents === 0) return null;
  const a = i.flatMap((M) => {
    const b = n.channels.findIndex((N) => N.pnn === M);
    return b < 0 ? [] : [b];
  });
  if (a.length === 0) return null;
  const o = Math.min(2048, n.fcs.nEvents), c = [];
  let d = 0, p = 0, v = 0, f = "", w = -1;
  for (const M of a) {
    const b = n.originalColumnData(M), N = n.compensatedColumnData(M), T = [];
    for (let I = 0; I < o; I++) {
      const E = o === 1 ? 0 : Math.floor(I * (n.fcs.nEvents - 1) / (o - 1)), $ = b[E], F = N[E], C = Math.abs(F - $);
      T.push(C), c.push(C), C > Math.max(1e-6, Math.abs($) * 1e-6) && d++, $ < 0 && F === 0 && v++, p = Math.max(p, C);
    }
    const P = _t(T);
    P > w && (w = P, f = rt(n, n.channels[M].key).combined);
  }
  return {
    previewEvents: o,
    comparedValues: c.length,
    changedValues: d,
    medianAbsoluteDelta: _t(c),
    maxAbsoluteDelta: p,
    zeroedNegativeValues: v,
    mostChangedChannel: f,
    mostChangedChannelMedianDelta: Math.max(0, w)
  };
}
function Zr(n, i) {
  return n.origin.type === "uploaded" ? n.origin.fileName : n.origin.type === "embedded-fcs" ? `${n.origin.fileName} · ${i("embedded FCS")}` : `${n.origin.presetId} · ${i("bundled preset")} ${n.origin.presetVersion}`;
}
function Yr({
  sample: n,
  sampleName: i = "sample.fcs",
  compensationOn: r,
  onApplyProfile: a,
  onCancelApply: o,
  hasExistingGates: c = !1,
  applyStatus: d = null,
  installedProfile: p = null,
  applyTargetCount: v = 1,
  applyTargetEventCount: f,
  applyWorkerCount: w,
  applyWorkerLimit: M,
  onApplyWorkerCountChange: b,
  installedBaselineProfile: N = null,
  reviewPopulations: T = [],
  reviewPopulationMasks: P = zr,
  onPreviewCompensationCandidate: I,
  onSolveCompensationSweep: E,
  onCancelCompensationSweep: $,
  onSuspendBackgroundWork: F,
  visible: C = !0,
  stateKey: k,
  densityColorPower: O = Ut,
  onDensityColorPowerChange: L = () => {
  }
}) {
  var xs, vs;
  const { t: s } = Ke(), K = n.compensatedLayerStatus(), G = K.state === "missing" ? null : K.metadata, R = (G == null ? void 0 : G.runtimeIdentity) === "profile" ? G : null, g = (p == null ? void 0 : p.profileId) === (R == null ? void 0 : R.profileId) ? p : null, D = !R && n.instrument === "flow" ? n.spillover : null, [Q, ee] = ue(
    `compensation.${k}.selectedPair`,
    null
  ), [Se, ce] = A.useState(null), [Be, jn] = ue(
    `compensation.${k}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [Re, Wt] = ue(
    "compensation.inspectorWidth",
    qs
  ), [je, Rn] = ue(
    `compensation.${k}.workspaceView`,
    "matrix"
  ), [Me, On] = ue(
    `compensation.${k}.globalPairFilter`,
    "relevant"
  ), [Ee, Js] = ue(
    `compensation.${k}.globalLayout`,
    "compact"
  ), [Qs, ei] = ue(
    "compensation.globalPlotSize.v5",
    160
  ), [ni, ti] = ue(
    "compensation.densitySmoothing.v3",
    6
  ), [si, ii] = ue(
    "compensation.pointAlpha.v1",
    0.85
  ), [at, ri] = ue(
    "compensation.pairPreviewEventLimit.v1",
    zs
  ), [wn, Ht] = A.useState(""), [Nn, ot] = A.useState(!1), [lt, Zt] = A.useState(null), [sn, ct] = ue(
    `compensation.${k}.reviewPopulation`,
    "all"
  ), [Dn, ai] = ue(
    `compensation.${k}.flaggedPairs`,
    []
  ), [Oe, oi] = ue(
    `compensation.${k}.evidenceMode`,
    "biological"
  ), [li, ci] = ue(
    `compensation.${k}.sweepBounds`,
    {}
  ), [dt, ut] = ue(
    `compensation.${k}.sweepWorkers`,
    2
  ), [we, Yt] = A.useState(""), [be, ht] = A.useState(""), [di, pt] = A.useState(0), [W, Ln] = A.useState({}), [ui, Ge] = A.useState({}), [De, We] = A.useState({ state: "idle" }), [hi, _e] = A.useState({}), [pi, He] = A.useState({}), [ge, rn] = A.useState(null), [mi, Cn] = A.useState(null), [ae, an] = A.useState(null), [Xt, pe] = A.useState(null), [zn, mt] = A.useState(""), [fi, Jt] = A.useState(!1), [gi, Qt] = A.useState(!1), Ne = A.useRef(0), on = A.useRef(0), [es, me] = A.useState(null), [ns, Le] = A.useState(!1), [Z, ft] = A.useState(null), [Sn, ln] = A.useState(
    () => /* @__PURE__ */ new Set()
  ), [ts, Mn] = A.useState(null), [cn, En] = A.useState(!1), [_n, ke] = A.useState(null), [xi, dn] = A.useState(!1), [vi, un] = A.useState(null), hn = A.useRef(!1), gt = A.useRef(null), ss = A.useRef(null), pn = A.useRef(null), q = xi || d !== null, Ze = Math.max(0, Math.floor(v)), bi = Math.max(
    0,
    Math.floor(f ?? n.fcs.nEvents)
  ), ne = d ?? (_n ? {
    phase: "applying",
    profileName: vi ?? (Z == null ? void 0 : Z.fileName) ?? "Compensation",
    fraction: _n.fraction,
    processedEvents: _n.processedEvents,
    totalEvents: _n.totalEvents
  } : null);
  A.useEffect(() => {
    C || (on.current++, Ne.current++, We({ state: "idle" }), an(null), rn(null), F == null || F());
  }, [F, C]);
  const xt = A.useMemo(
    () => n.channels.map(({ pnn: t, columnIndex: l }) => ({ pnn: t, columnIndex: l })),
    [n]
  ), Ae = A.useMemo(() => {
    if (!D) return null;
    const t = D.channels.map((h) => {
      const x = n.index(h);
      return x === void 0 ? null : n.channels[x].pnn;
    });
    if (t.some((h) => h === null))
      return {
        validation: null,
        error: "The embedded matrix could not be mapped back to exact FCS channel identities.",
        keyword: void 0
      };
    const l = js({
      sourceChannels: t,
      receiverChannels: t,
      matrix: D.matrix
    }, "flow-spillover"), m = ["$SPILLOVER", "$SPILL", "SPILL"].find((h) => typeof n.fcs.keywords[h] == "string");
    return {
      validation: l,
      error: l.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${l.errors.map(({ message: h }) => h).join(" ")}`,
      keyword: m
    };
  }, [n, D]), H = sn === "all" ? null : T.find(({ id: t }) => t === sn) ?? null, oe = H ? P[H.id] ?? null : null, ie = oe ? (H == null ? void 0 : H.eventCount) ?? 0 : n.fcs.nEvents, Un = at === "all" ? "all" : _s.includes(Number(at)) ? Number(at) : zs, kn = A.useMemo(
    () => en(
      n.fcs.nEvents,
      Un === "all" ? Math.max(1, n.fcs.nEvents) : Un,
      oe
    ),
    [Un, ie, oe, n]
  ), An = A.useMemo(
    () => en(n.fcs.nEvents, 2048, oe),
    [oe, n]
  ), vt = A.useMemo(
    () => en(
      n.fcs.nEvents,
      Dr,
      oe
    ),
    [oe, n]
  );
  A.useEffect(() => {
    sn !== "all" && !T.some(({ id: t }) => t === sn) && ct("all");
  }, [sn, T, ct]), A.useEffect(() => {
    Ne.current++, $ == null || $(), _e({}), He({}), rn(null), an(null), pe(null);
  }, [sn, oe, $]);
  const fe = A.useMemo(() => Z ? Gi({
    kind: "cytof-spillover",
    matrix: Z.matrix,
    sampleChannels: xt,
    includedChannels: Array.from(Sn)
  }) : null, [Z, Sn, xt]), u = A.useMemo(() => {
    if (D)
      return {
        sourceAxisKeys: D.channels,
        receiverAxisKeys: D.channels,
        sourceChannels: D.channels.map((l) => rt(n, l)),
        receiverChannels: D.channels.map((l) => rt(n, l)),
        matrix: D.matrix,
        kind: "flow",
        title: "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: "Applying the embedded matrix leaves its coefficients unchanged."
      };
    if (!g || !R) return null;
    const t = g.scientific.kind === "cytof-spillover" ? lr(g.scientific.matrix) : g.scientific.matrix;
    return t.matrix.length !== t.sourceChannels.length || t.matrix.some((l) => !l || l.length !== t.receiverChannels.length) ? null : {
      sourceAxisKeys: t.sourceChannels,
      receiverAxisKeys: t.receiverChannels,
      sourceChannels: t.sourceChannels.map((l) => It(n, l)),
      receiverChannels: t.receiverChannels.map((l) => It(n, l)),
      matrix: t.matrix,
      kind: g.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: g.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: g.scientific.kind === "cytof-spillover" ? s("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: t.sourceChannels.length,
        receivers: t.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: g.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [R, g, n, D, s]), re = (u == null ? void 0 : u.sourceChannels) ?? [], le = (u == null ? void 0 : u.receiverChannels) ?? [];
  A.useEffect(() => {
    ut((t) => Math.max(1, Math.min(Us, Math.round(t) || 1)));
  }, [ut]);
  const qn = Se ?? Q, y = A.useMemo(() => {
    if (!u || !qn) return null;
    const [t, l] = qn.split(Pe), m = u.sourceAxisKeys.indexOf(t), h = u.receiverAxisKeys.indexOf(l);
    return m < 0 || h < 0 || u.sourceAxisKeys[m] === u.receiverAxisKeys[h] ? null : {
      pairKey: qn,
      sourceIndex: m,
      receiverIndex: h,
      source: re[m],
      receiver: le[h],
      value: u.matrix[m][h],
      interaction: u.kind === "cytof" ? xn(
        u.sourceAxisKeys[m],
        u.receiverAxisKeys[h]
      ) : null
    };
  }, [qn, u, le, re]);
  A.useEffect(() => {
    if (!y) {
      mt("");
      return;
    }
    const t = W[y.pairKey];
    mt(J((t ?? y.value) * 100, 6));
  }, [y == null ? void 0 : y.pairKey, y == null ? void 0 : y.value, W]);
  const xe = A.useMemo(() => y ? At(
    n,
    y.source.key,
    y.receiver.key,
    {
      eventMask: oe,
      fixedEventIndices: kn,
      eligibleEventCount: ie
    }
  ) : null, [r, K.state, kn, ie, oe, n, y]), ye = A.useMemo(() => {
    if (!u || K.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const t = [];
    for (let x = 0; x < u.matrix.length; x++)
      for (let j = 0; j < u.matrix[x].length; j++) {
        const S = u.sourceAxisKeys[x], z = u.receiverAxisKeys[j];
        if (S === z) continue;
        const U = u.matrix[x][j];
        if (!Number.isFinite(U)) continue;
        const _ = u.kind === "cytof" ? xn(S, z) : null, B = _ !== null && _ !== "self" && _ !== "other";
        U === 0 && !B && Oe === "biological" || t.push({
          sourceIndex: x,
          receiverIndex: j,
          pairKey: `${S}${Pe}${z}`,
          source: re[x],
          receiver: le[j],
          coefficient: U,
          interaction: _,
          physicalPrior: B ? 1 : 0
        });
      }
    t.sort((x, j) => j.physicalPrior - x.physicalPrior || Math.abs(j.coefficient) - Math.abs(x.coefficient));
    const l = t.slice(0, 240), m = l.flatMap((x) => {
      const j = At(
        n,
        x.source.key,
        x.receiver.key,
        {
          eventMask: oe,
          fixedEventIndices: An,
          eligibleEventCount: ie
        }
      );
      return j.ready ? [{ ...x, evidence: j.preview.evidence }] : [];
    }), h = xr(
      m.map(({ coefficient: x, physicalPrior: j, evidence: S }) => ({ coefficient: x, physicalPrior: j, evidence: S })),
      u.kind,
      Oe
    ).map(({ index: x, relativePriority: j }) => ({ ...m[x], relativePriority: j }));
    return {
      candidateCount: t.length,
      screenedCount: l.length,
      evaluableCount: m.length,
      items: h.slice(0, 8)
    };
  }, [di, Oe, K.state, u, le, An, ie, oe, n, re]), te = A.useMemo(() => new Set(
    g ? g.scientific.kind === "flow-spillover" ? g.scientific.matrix.receiverChannels : g.scientific.includedChannels : []
  ), [g]), se = A.useMemo(() => u ? jr(
    n,
    Array.from(/* @__PURE__ */ new Set([
      ...u.sourceAxisKeys,
      ...u.receiverAxisKeys
    ])),
    {
      eventMask: oe,
      fixedEventIndices: vt,
      eligibleEventCount: ie
    }
  ) : null, [
    r,
    vt,
    K.state,
    u,
    ie,
    oe,
    n
  ]);
  A.useEffect(() => {
    if (!u || te.size === 0) return;
    const t = te.has(we) ? we : u.sourceAxisKeys.find((m) => te.has(m)) ?? "", l = te.has(be) && be !== t ? be : u.receiverAxisKeys.find((m) => m !== t && te.has(m)) ?? "";
    t !== we && Yt(t), l !== be && ht(l);
  }, [te, be, we, u]);
  const mn = A.useMemo(() => new Set(Dn), [Dn]), bt = A.useMemo(() => {
    var m;
    if (!u) return [];
    const t = [], l = te.size > 0;
    for (let h = 0; h < u.sourceAxisKeys.length; h++) {
      const x = u.sourceAxisKeys[h];
      if (!(l && !te.has(x)))
        for (let j = 0; j < u.receiverAxisKeys.length; j++) {
          const S = u.receiverAxisKeys[j];
          if (x === S || l && !te.has(S)) continue;
          const z = (m = u.matrix[h]) == null ? void 0 : m[j];
          if (!Number.isFinite(z)) continue;
          const U = re[h], _ = le[j];
          if (!U || !_ || se != null && se.ready && (!se.dataset.channels.has(U.key) || !se.dataset.channels.has(_.key))) continue;
          const B = u.kind === "cytof" ? xn(x, S) : null, X = B !== null && B !== "self" && B !== "other";
          t.push({
            sourceIndex: h,
            receiverIndex: j,
            pairKey: `${x}${Pe}${S}`,
            source: U,
            receiver: _,
            coefficient: z,
            interaction: B,
            physicalPrior: X ? 1 : 0
          });
        }
    }
    return t;
  }, [se, te, u, le, re]), Te = A.useMemo(() => {
    const t = wn.trim().toLocaleLowerCase();
    return bt.filter((l) => {
      const m = Math.abs(l.coefficient) > 1e-12, h = l.physicalPrior > 0;
      return Me === "all" || Me === "relevant" && (m || h) || Me === "nonzero" && m || Me === "physical" && h || Me === "flagged" && mn.has(l.pairKey) ? t ? `${l.source.combined} ${l.receiver.combined}`.toLocaleLowerCase().includes(t) : !0 : !1;
    });
  }, [mn, bt, Me, wn]);
  A.useEffect(() => {
    var l;
    if (!lt || je !== "global") return;
    const t = [...((l = pn.current) == null ? void 0 : l.querySelectorAll(".gl-comp-global-tile")) ?? []].find((m) => m.dataset.pairKey === lt);
    t && (t.scrollIntoView({ block: "center", inline: "center" }), Zt(null));
  }, [Nn, Ee, lt, Te, je]);
  const yt = A.useMemo(() => {
    if (Ee === "compact") return [];
    const t = /* @__PURE__ */ new Map();
    for (const l of Te) {
      const m = Ee === "source" ? l.source : l.receiver, h = t.get(m.key);
      h ? h.pairs.push(l) : t.set(m.key, { channel: m, pairs: [l] });
    }
    return [...t.values()];
  }, [Ee, Te]), is = A.useMemo(
    () => Ee === "compact" ? Te : yt.flatMap((t) => t.pairs),
    [yt, Ee, Te]
  ), rs = `${s(Rr[Me])}${wn.trim() ? s(" · search “{query}”", { query: wn.trim() }) : ""}`, jt = Math.max(120, Math.min(220, Math.round(Qs) || 120)), Ue = Math.max(1, Math.min(10, Math.round(ni) || 6)), Vn = Math.max(0.1, Math.min(1, Number(si) || 0.85)), Y = A.useMemo(() => !g || !u || K.state !== "ready" ? [] : Dn.flatMap((t) => {
    const [l, m] = t.split(Pe), h = u.sourceAxisKeys.indexOf(l), x = u.receiverAxisKeys.indexOf(m);
    if (h < 0 || x < 0 || l === m || !te.has(l) || !te.has(m)) return [];
    const j = At(
      n,
      re[h].key,
      le[x].key,
      {
        eventMask: oe,
        fixedEventIndices: An,
        eligibleEventCount: ie
      }
    );
    if (!j.ready) return [];
    const S = ye.items.find((z) => z.pairKey === t);
    return [{
      sourceIndex: h,
      receiverIndex: x,
      pairKey: t,
      source: re[h],
      receiver: le[x],
      coefficient: u.matrix[h][x],
      interaction: u.kind === "cytof" ? xn(l, m) : null,
      physicalPrior: u.kind === "cytof" && xn(l, m) !== "other" ? 1 : 0,
      evidence: j.preview.evidence,
      relativePriority: (S == null ? void 0 : S.relativePriority) ?? 0
    }];
  }), [Dn, te, K.state, u, g, le, ye.items, An, ie, oe, n, re]), Fe = Y, as = A.useMemo(() => {
    if (!g) return 0.01;
    const t = [];
    for (let l = 0; l < g.scientific.matrix.matrix.length; l++) {
      const m = g.scientific.matrix.sourceChannels[l];
      for (let h = 0; h < g.scientific.matrix.matrix[l].length; h++) {
        if (m === g.scientific.matrix.receiverChannels[h]) continue;
        const x = Math.abs(g.scientific.matrix.matrix[l][h]);
        Number.isFinite(x) && x > 1e-12 && t.push(x);
      }
    }
    return t.length > 0 ? _t(t) : 0.01;
  }, [g]), wt = (t, l) => {
    const m = li[t];
    if (m) return m;
    const h = Gs(l, as, (u == null ? void 0 : u.kind) ?? "flow");
    return {
      lowerPercent: J(h.lower * 100, 5),
      upperPercent: J(h.upper * 100, 5)
    };
  }, Tn = (t, l) => {
    const m = wt(t, l), h = Number(m.lowerPercent) / 100, x = Number(m.upperPercent) / 100;
    return !Number.isFinite(h) || !Number.isFinite(x) ? { lower: h, upper: x, error: "Enter finite lower and upper sweep bounds." } : (u == null ? void 0 : u.kind) === "cytof" && h < 0 ? { lower: h, upper: x, error: "CyTOF NNLS sweep bounds cannot be negative." } : x > h ? { lower: h, upper: x, error: null } : { lower: h, upper: x, error: "The upper sweep bound must be greater than the lower bound." };
  }, Bn = (t, l, m, h) => {
    ci((x) => ({
      ...x,
      [t]: {
        ...x[t] ?? (() => {
          const j = Gs(l, as, (u == null ? void 0 : u.kind) ?? "flow");
          return {
            lowerPercent: J(j.lower * 100, 5),
            upperPercent: J(j.upper * 100, 5)
          };
        })(),
        [m]: h
      }
    })), _e((x) => {
      if (!(t in x)) return x;
      const j = { ...x };
      return delete j[t], j;
    }), He((x) => {
      if (!(t in x)) return x;
      const j = { ...x };
      return delete j[t], j;
    });
  }, Fn = (t, l) => {
    ai((m) => l ? m.includes(t) ? m : [...m, t] : m.filter((h) => h !== t)), l ? (ee(t), Cn(t)) : (_e((m) => {
      if (!(t in m)) return m;
      const h = { ...m };
      return delete h[t], h;
    }), He((m) => {
      if (!(t in m)) return m;
      const h = { ...m };
      return delete h[t], h;
    }));
  }, yi = () => {
    if (!u || !we || !be || we === be) return;
    if (!te.has(we) || !te.has(be)) {
      pe("Both channels must be included in the installed compensation solve.");
      return;
    }
    const t = `${we}${Pe}${be}`;
    Fn(t, !0), pe(null);
  }, Nt = Fe.reduce((t, l) => t + (Tn(l.pairKey, l.coefficient).error ? 1 : 0), 0), fn = A.useMemo(() => {
    if (!g) return null;
    const t = g.scientific.matrix.matrix.map((l) => Array.from(l));
    for (const [l, m] of Object.entries(W)) {
      const [h, x] = l.split(Pe), j = g.scientific.matrix.sourceChannels.indexOf(h), S = g.scientific.matrix.receiverChannels.indexOf(x);
      j >= 0 && S >= 0 && (t[j][S] = m);
    }
    return Object.freeze(t.map((l) => Object.freeze(l)));
  }, [g, W]);
  A.useEffect(() => {
    const t = Object.keys(W).length;
    if (!C || t === 0 || !g || g.scientific.kind !== "flow-spillover" || K.state !== "ready" || !fn || !y || !I) {
      on.current++, We({ state: "idle" });
      return;
    }
    const l = kn;
    if (l.length === 0) {
      We({
        state: "error",
        pairKey: y.pairKey,
        message: s("The selected review population contains no events.")
      });
      return;
    }
    const m = ++on.current, h = y.pairKey;
    We((j) => ({
      state: "updating",
      pairKey: h,
      ...(j.state === "ready" || j.state === "updating") && j.pairKey === h && j.preview ? { preview: j.preview } : {}
    }));
    const x = window.setTimeout(() => {
      I(
        g,
        l,
        fn
      ).then((j) => {
        if (on.current !== m) return;
        const S = j.sourceChannels.indexOf(y.source.pnn), z = j.sourceChannels.indexOf(y.receiver.pnn);
        if (S < 0 || z < 0)
          throw new Error(s("The preview result did not contain the selected flow channels."));
        const U = Tt(
          n,
          y.source.pnn,
          y.receiver.pnn,
          l,
          j.candidateColumns[S],
          j.candidateColumns[z],
          { totalEvents: ie }
        );
        if (!U.ready) throw new Error(U.reason);
        We({
          state: "ready",
          pairKey: h,
          preview: U.preview
        });
      }).catch((j) => {
        if (on.current !== m) return;
        const S = j instanceof Error ? j.message : String(j);
        /cancel|supersed|stale/i.test(S) || We({ state: "error", pairKey: h, message: S });
      });
    }, 90);
    return () => window.clearTimeout(x);
  }, [
    K.state,
    I,
    g,
    kn,
    ie,
    n,
    n.dataRevision,
    n.displayTransformContextKey,
    n.layerRevision,
    y,
    W,
    s,
    C,
    fn
  ]);
  const ji = A.useMemo(() => !u || Object.keys(W).length === 0 ? null : {
    sourceChannels: u.sourceAxisKeys,
    receiverChannels: u.receiverAxisKeys,
    matrix: u.matrix.map(
      (t, l) => t.map((m, h) => {
        const x = `${u.sourceAxisKeys[l]}${Pe}${u.receiverAxisKeys[h]}`;
        return W[x] ?? m;
      })
    )
  }, [u, W]), os = A.useMemo(() => {
    if (!u) return [];
    const t = [];
    for (let l = 0; l < u.matrix.length; l++)
      for (let m = 0; m < u.matrix[l].length; m++) {
        const h = u.matrix[l][m];
        u.sourceAxisKeys[l] === u.receiverAxisKeys[m] || !Number.isFinite(h) || h <= 1 || t.push(`${re[l].combined} → ${le[m].combined}`);
      }
    return t;
  }, [u, le, re]), Ct = A.useMemo(() => {
    if (!u) return [];
    const t = [];
    for (let l = 0; l < u.matrix.length; l++)
      for (let m = 0; m < u.matrix[l].length; m++) {
        const h = u.matrix[l][m], x = u.sourceAxisKeys[l] === u.receiverAxisKeys[m], j = `${re[l].combined} → ${le[m].combined}`;
        Number.isFinite(h) ? x && Math.abs(h - 1) > 1e-8 ? t.push(`${re[l].combined}: diagonal is ${Ve(h)}, not 100%`) : !x && h < 0 ? t.push(`${j}: negative coefficient (${Ve(h)})`) : !x && h > 1 && t.push(`${j}: coefficient above 100%`) : t.push(`${j}: non-finite coefficient (${String(h)})`);
      }
    return t;
  }, [u, le, re]), ls = A.useMemo(
    () => (u == null ? void 0 : u.matrix.some((t) => t.some((l) => !Number.isFinite(l)))) ?? !1,
    [u]
  ), Ce = A.useMemo(
    () => R && K.state === "ready" ? Hr(n, R.includedPnns) : null,
    [K.state, R, n]
  ), Gn = A.useMemo(() => {
    const t = [...Ct];
    return K.state === "stale" && t.push(...K.reasons.map((l) => `Profile unavailable: ${Ur(l)}`)), t;
  }, [K, Ct]), cs = R ? (g == null ? void 0 : g.name) ?? "Installed compensation profile" : D ? "Embedded FCS matrix" : "No compatible matrix", wi = R ? _r(R.kind, R.method) : D ? "Flow linear inverse" : "Not configured", Wn = s(wi), St = (R == null ? void 0 : R.includedPnns.length) ?? (D == null ? void 0 : D.channels.length) ?? 0, Hn = (g == null ? void 0 : g.name) ?? (R == null ? void 0 : R.profileId) ?? cs, ds = Pt(Hn), Ni = ds !== Hn || (g == null ? void 0 : g.recordType) === "revision" ? `${ds} · ${s("revised")}` : Hn, Ci = D !== null && !ls || R !== null && K.state === "ready", us = A.useMemo(() => {
    if (!u) return 0;
    let t = 0;
    for (let l = 0; l < u.matrix.length; l++)
      for (let m = 0; m < u.matrix[l].length; m++) {
        if (u.sourceAxisKeys[l] === u.receiverAxisKeys[m]) continue;
        const h = u.matrix[l][m];
        Number.isFinite(h) && (t = Math.max(t, Math.abs(h)));
      }
    return t;
  }, [u]), Zn = !!((g == null ? void 0 : g.scientific.kind) === "flow-spillover" && K.state === "ready" && u && Math.max(u.sourceAxisKeys.length, u.receiverAxisKeys.length) <= Lr), $n = u ? Zn ? Math.max(42, Math.min(54, Math.floor(960 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : Math.max(13, Math.min(38, Math.floor(760 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : 13;
  A.useEffect(() => {
    Ln({}), Ge({}), We({ state: "idle" }), on.current++;
  }, [g == null ? void 0 : g.profileId]), A.useEffect(() => {
    (u == null ? void 0 : u.kind) === "flow" && Me === "physical" && On("relevant");
  }, [Me, u == null ? void 0 : u.kind, On]);
  const Si = (t) => {
    jn((l) => ({ ...l, [t]: !l[t] }));
  }, hs = (t) => {
    var h;
    const l = ((h = pn.current) == null ? void 0 : h.getBoundingClientRect().width) ?? 1100, m = Math.max(360, Math.min(900, l - 440 - 8));
    return Math.max(360, Math.min(m, Math.round(t)));
  }, Mi = (t) => {
    var x;
    if (t.button !== 0) return;
    t.preventDefault();
    const l = t.currentTarget;
    (x = l.setPointerCapture) == null || x.call(l, t.pointerId);
    const m = (j) => {
      var z;
      const S = (z = pn.current) == null ? void 0 : z.getBoundingClientRect();
      S && Wt(hs(S.right - j.clientX));
    }, h = () => {
      var j;
      window.removeEventListener("pointermove", m), window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", h), (j = l.releasePointerCapture) == null || j.call(l, t.pointerId);
    };
    window.addEventListener("pointermove", m), window.addEventListener("pointerup", h), window.addEventListener("pointercancel", h);
  }, Ei = (t) => {
    let l = null;
    t.key === "ArrowLeft" ? l = Re + 40 : t.key === "ArrowRight" ? l = Re - 40 : t.key === "Home" && (l = qs), l !== null && (t.preventDefault(), Wt(hs(l)));
  }, ki = async (t) => {
    var m;
    const l = (m = t.currentTarget.files) == null ? void 0 : m[0];
    if (t.currentTarget.value = "", !!l) {
      Mn(null), me(null), Le(!1), ke(null), En(!1);
      try {
        const h = or(await l.text()), x = js(
          h.input,
          "cytof-spillover"
        );
        if (!x.ok)
          throw new Error(x.errors.map(({ message: z }) => z).join(" "));
        const j = /* @__PURE__ */ new Map();
        for (const { pnn: z } of xt) {
          const U = z.trim().normalize("NFC");
          j.set(U, (j.get(U) ?? 0) + 1);
        }
        const S = x.value.receiverChannels.filter(
          (z) => j.get(z) === 1
        );
        ft({
          fileName: l.name,
          parsed: h,
          matrix: x.value,
          validationWarnings: x.warnings
        }), ln(new Set(S));
      } catch (h) {
        ft(null), ln(/* @__PURE__ */ new Set()), Mn(h instanceof Error ? h.message : String(h));
      }
    }
  }, Ai = (t, l) => {
    ln((m) => {
      const h = new Set(m);
      return l ? h.add(t) : h.delete(t), h;
    });
  }, Ti = async () => {
    var t, l;
    if (!(hn.current || q || !Z || !(fe != null && fe.canApply) || !a)) {
      if (c && !cn) {
        Mn(
          s("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      Mn(null), me(null), ke(null), hn.current = !0, dn(!0), un(Z.fileName);
      try {
        const m = ((l = (t = globalThis.crypto) == null ? void 0 : t.randomUUID) == null ? void 0 : l.call(t)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, h = Z.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation", x = await ws(
          {
            kind: "cytof-spillover",
            method: "nnls",
            solverVersion: Xi,
            solverSettings: Yi,
            matrix: Z.matrix,
            includedChannels: Array.from(Sn)
          },
          {
            profileId: `cytof-${m}`,
            name: h,
            createdAt: /* @__PURE__ */ new Date(),
            origin: {
              type: "uploaded",
              fileName: Z.fileName,
              format: Z.parsed.format.delimiter,
              sourceColumnHeader: Z.parsed.format.sourceColumnHeader
            },
            provenance: {
              sourceDescription: "User-uploaded CyTOF spillover matrix",
              estimationMethod: "Imported; coefficients preserved exactly"
            }
          }
        );
        await a(x, ke), me(s("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: h,
          channels: Sn.size,
          files: Ze
        })), ft(null), ln(/* @__PURE__ */ new Set()), En(!1), ke(null);
      } catch (m) {
        const h = m instanceof Error ? m.message : String(m);
        /cancel/i.test(h) ? me(s("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : Mn(h);
      } finally {
        hn.current = !1, dn(!1), un(null);
      }
    }
  }, Fi = async () => {
    var l, m, h;
    if (hn.current || q || !D || !((l = Ae == null ? void 0 : Ae.validation) != null && l.ok) || !a) return;
    if (c && !cn) {
      Le(!0), me(
        s("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const t = `${i.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    me(null), Le(!1), ke(null), hn.current = !0, dn(!0), un(t);
    try {
      const x = ((h = (m = globalThis.crypto) == null ? void 0 : m.randomUUID) == null ? void 0 : h.call(m)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, j = await ws(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: Zi,
          solverSettings: Hi,
          matrix: Ae.validation.value
        },
        {
          profileId: `flow-${x}`,
          name: t,
          createdAt: /* @__PURE__ */ new Date(),
          origin: {
            type: "embedded-fcs",
            fileName: i,
            ...Ae.keyword ? { keyword: Ae.keyword } : {}
          },
          provenance: {
            sourceDescription: "Spillover matrix embedded in the source FCS file",
            estimationMethod: "Imported from FCS; coefficients preserved exactly"
          }
        }
      );
      await a(j, ke), En(!1), me(s("Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available."));
    } catch (x) {
      Le(!0), me(x instanceof Error ? x.message : String(x));
    } finally {
      hn.current = !1, dn(!1), un(null), ke(null);
    }
  }, ps = (t, l) => {
    var x, j;
    const m = re[t], h = le[l];
    !u || !m || !h || u.sourceAxisKeys[t] === u.receiverAxisKeys[l] || (ee(`${u.sourceAxisKeys[t]}${Pe}${u.receiverAxisKeys[l]}`), (j = (x = ss.current) == null ? void 0 : x.querySelector(
      `button[data-source-index="${t}"][data-receiver-index="${l}"]`
    )) == null || j.focus());
  }, $i = (t, l, m) => {
    if (!u) return;
    const h = u.sourceAxisKeys.length, x = u.receiverAxisKeys.length;
    let j = l, S = m;
    const z = (_, B) => {
      let X = _ + B;
      for (; X >= 0 && X < x; ) {
        if (u.sourceAxisKeys[l] !== u.receiverAxisKeys[X]) return X;
        X += B;
      }
      return _;
    }, U = (_, B) => {
      let X = _ + B;
      for (; X >= 0 && X < h; ) {
        if (u.sourceAxisKeys[X] !== u.receiverAxisKeys[m]) return X;
        X += B;
      }
      return _;
    };
    switch (t.key) {
      case "ArrowLeft":
        S = z(m, -1);
        break;
      case "ArrowRight":
        S = z(m, 1);
        break;
      case "ArrowUp":
        j = U(l, -1);
        break;
      case "ArrowDown":
        j = U(l, 1);
        break;
      case "Home": {
        S = u.sourceAxisKeys[l] === u.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const _ = x - 1;
        S = u.sourceAxisKeys[l] === u.receiverAxisKeys[_] ? _ - 1 : _;
        break;
      }
      default:
        return;
    }
    t.preventDefault(), ps(j, S);
  }, Pn = (t, l) => {
    if (!g || !Number.isFinite(l)) return;
    const [m, h] = t.split(Pe), x = g.scientific.matrix.sourceChannels.indexOf(m), j = g.scientific.matrix.receiverChannels.indexOf(h);
    if (x < 0 || j < 0) return;
    if (g.scientific.kind === "cytof-spillover" && l < 0) {
      Le(!0), me(s("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const S = g.scientific.matrix.matrix[x][j];
    Ln((z) => {
      const U = { ...z };
      return l === S ? delete U[t] : U[t] = l, U;
    }), Le(!1), me(s("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: m,
      receiver: h,
      value: (l * 100).toFixed(2)
    }));
  }, ms = (t, l, m, h) => {
    const x = m[0];
    if (!x) return null;
    const j = x.sourceChannels.indexOf(t.source.pnn), S = x.sourceChannels.indexOf(t.receiver.pnn);
    if (j < 0 || S < 0) return null;
    const z = Tt(
      n,
      t.source.pnn,
      t.receiver.pnn,
      h,
      x.currentColumns[j],
      x.currentColumns[S],
      { totalEvents: ie }
    );
    if (!z.ready) return null;
    const U = [{
      value: t.coefficient,
      isCurrent: !0,
      preview: z.preview
    }];
    return m.forEach((_, B) => {
      const X = _.sourceChannels.indexOf(t.source.pnn), $e = _.sourceChannels.indexOf(t.receiver.pnn);
      if (X < 0 || $e < 0) return;
      const ve = Tt(
        n,
        t.source.pnn,
        t.receiver.pnn,
        h,
        _.candidateColumns[X],
        _.candidateColumns[$e],
        {
          totalEvents: ie,
          xRange: z.preview.xRange,
          yRange: z.preview.yRange
        }
      );
      ve.ready && U.push({
        value: l[B],
        isCurrent: !1,
        preview: ve.preview
      });
    }), U.sort((_, B) => _.value - B.value || Number(B.isCurrent) - Number(_.isCurrent)), { pairKey: t.pairKey, values: Object.freeze(U) };
  }, Pi = async (t) => {
    if (!g || !u || !E || q || ae || ge) return;
    const l = Tn(t.pairKey, t.coefficient);
    if (l.error) {
      pe(l.error);
      return;
    }
    const m = en(
      n.fcs.nEvents,
      Ls,
      oe
    );
    if (m.length === 0) {
      pe(s("The selected review population contains no events."));
      return;
    }
    const h = ++Ne.current, x = [l.lower, l.upper];
    rn(t.pairKey), pe(null);
    try {
      const j = await E(
        g,
        m,
        x.map((z) => Bs(
          g,
          u.sourceAxisKeys[t.sourceIndex],
          u.receiverAxisKeys[t.receiverIndex],
          z
        )),
        void 0,
        1
      );
      if (Ne.current !== h) return;
      const S = ms(t, x, j, m);
      if (!S) throw new Error(s("The fast bounds preview could not be built for this pair."));
      He((z) => ({ ...z, [t.pairKey]: S }));
    } catch (j) {
      if (Ne.current !== h) return;
      const S = j instanceof Error ? j.message : String(j);
      pe(/cancel/i.test(S) ? s("Fast bounds preview cancelled.") : S);
    } finally {
      Ne.current === h && rn(null);
    }
  }, Ii = async () => {
    var h;
    if (!g || !E || Fe.length === 0 || q || ae !== null || ge !== null) return;
    if (Nt > 0) {
      pe(s("Fix the sweep bounds for {count} flagged pairs before running.", { count: Nt }));
      return;
    }
    const t = en(
      n.fcs.nEvents,
      Ds,
      oe
    );
    if (t.length === 0) {
      pe(s("The selected review population contains no events."));
      return;
    }
    const l = ++Ne.current, m = Fe.flatMap((x) => {
      const j = Tn(x.pairKey, x.coefficient);
      return Gr(j.lower, j.upper).map((S) => ({
        pair: x,
        value: S,
        matrix: Bs(
          g,
          u.sourceAxisKeys[x.sourceIndex],
          u.receiverAxisKeys[x.receiverIndex],
          S
        )
      }));
    });
    pe(null), _e({}), an({ completed: 0, total: m.length });
    try {
      const x = await E(
        g,
        t,
        m.map(({ matrix: S }) => S),
        (S, z) => {
          Ne.current === l && an({ completed: S, total: z });
        },
        dt
      );
      if (Ne.current !== l) return;
      if (x.length !== m.length)
        throw new Error(s("The compensation worker returned an incomplete coefficient sweep."));
      const j = {};
      for (const S of Fe) {
        const z = m.flatMap((_, B) => _.pair.pairKey === S.pairKey ? [B] : []), U = ms(
          S,
          z.map((_) => m[_].value),
          z.map((_) => x[_]),
          t
        );
        U && (j[S.pairKey] = U);
      }
      _e(j), Cn(((h = Fe[0]) == null ? void 0 : h.pairKey) ?? null);
    } catch (x) {
      if (Ne.current !== l) return;
      const j = x instanceof Error ? x.message : String(x);
      pe(/cancel/i.test(j) ? s("Exact coefficient sweep cancelled.") : j);
    } finally {
      Ne.current === l && an(null);
    }
  }, Ki = () => {
    Ne.current++, $ == null || $(), an(null), rn(null), pe(s("Exact coefficient sweep cancelled."));
  }, Ri = async () => {
    var l, m;
    if (!g || !fn || !a || Object.keys(W).length === 0) return;
    const t = `${Pt(g.name)} · edited`;
    me(null), Le(!1), dn(!0), un(t), ke(null);
    try {
      const x = {
        profileId: `comp-edit-${((m = (l = globalThis.crypto) == null ? void 0 : l.randomUUID) == null ? void 0 : m.call(l)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: t,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(W).length} compensation coefficient${Object.keys(W).length === 1 ? "" : "s"} in GateLab.`
      }, j = (N == null ? void 0 : N.recordType) === "baseline" && Wr(fn, N.scientific.matrix.matrix) ? await Ji(g, N, x) : await Qi(
        g,
        Vr(g, fn),
        x
      );
      await a(j, ke), Ln({}), Ge({}), _e({}), He({}), rn(null), pe(null), pt((S) => S + 1), Y.length > 0 && (Rn("attention"), ee(Y[0].pairKey), Cn(Y[0].pairKey)), me(s("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: Pt(j.name),
        flagged: Y.length > 0 ? s(
          Y.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: Y.length }
        ) : ""
      }));
    } catch (h) {
      Le(!0), me(h instanceof Error ? h.message : String(h));
    } finally {
      dn(!1), un(null), ke(null);
    }
  }, fs = (t) => {
    if (Y.length === 0) return;
    const l = Y.findIndex(({ pairKey: x }) => x === Q), m = l < 0 ? t > 0 ? 0 : Y.length - 1 : (l + t + Y.length) % Y.length, h = Y[m];
    ce(null), ee(h.pairKey), Cn(h.pairKey);
  }, Mt = () => /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "gl-comp-inspector-resize",
      role: "separator",
      "aria-label": s("Resize compensation inspector"),
      "aria-orientation": "vertical",
      "aria-valuemin": 360,
      "aria-valuemax": 900,
      "aria-valuenow": Re,
      tabIndex: 0,
      title: s("Drag to resize the coefficient inspector; use Left/Right arrow keys for fine control"),
      onPointerDown: Mi,
      onKeyDown: Ei,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), Oi = (t) => {
    ce(null), ee(t), ot(!0), bt.some((l) => l.pairKey === t) && (Te.some((l) => l.pairKey === t) || (On("all"), Ht("")), Zt(t));
  }, Et = (t, l = !1) => {
    const m = y ? mn.has(y.pairKey) : !1, h = y ? Y.find(({ pairKey: V }) => V === y.pairKey) ?? null : null, x = y ? wt(y.pairKey, y.value) : null, j = y ? Tn(y.pairKey, y.value) : null, S = y ? pi[y.pairKey] : null, z = y ? u.sourceAxisKeys[y.sourceIndex] : "", U = y ? u.receiverAxisKeys[y.receiverIndex] : "", _ = y != null && y.interaction && y.interaction !== "self" && y.interaction !== "other" ? 1 : 0, B = y && (xe != null && xe.ready) ? Dt({
      coefficient: y.value,
      physicalPrior: _,
      evidence: xe.preview.evidence
    }, u.kind, Oe) : null, X = y ? Br(N, z, U) : null, $e = (y == null ? void 0 : y.value) ?? null, ve = y ? W[y.pairKey] : void 0, gn = !!(y && (g == null ? void 0 : g.scientific.kind) === "flow-spillover" && I && Object.keys(W).length > 0), ze = De.state !== "idle" && De.state !== "error" && De.pairKey === (y == null ? void 0 : y.pairKey) ? De.preview : null, Ye = ze ?? (xe != null && xe.ready ? xe.preview : null), Xe = [];
    X !== null && $e !== null && ((g == null ? void 0 : g.recordType) === "revision" || X !== $e) && Xe.push({ label: s("Baseline"), value: X }), $e !== null && Xe.push({ label: s("Installed"), value: $e }), ve !== void 0 && Xe.push({ label: s("Staged"), value: ve });
    const Je = Y.findIndex(({ pairKey: V }) => V === Q);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${l ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: s("Selected coefficient") }),
          !l && /* @__PURE__ */ e.jsx("span", { children: s(Se ? "Hover preview · click to pin this pair." : Q ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inspector-actions", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flag-navigation", "aria-label": s("Flagged compensation pair navigation"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Previous flagged compensation pair"),
                disabled: Y.length === 0,
                onClick: () => fs(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: Je >= 0 ? s("{current} / {total} flagged", { current: Je + 1, total: Y.length }) : s("{total} flagged", { total: Y.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": s("Next flagged compensation pair"),
                disabled: Y.length === 0,
                onClick: () => fs(1),
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
        B && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${B.category}`,
            title: s(B.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: s(B.label) }),
              /* @__PURE__ */ e.jsx("span", { children: s(B.detail) })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: m,
              disabled: !g || !te.has(u.sourceAxisKeys[y.sourceIndex]) || !te.has(u.receiverAxisKeys[y.receiverIndex]),
              onChange: (V) => Fn(y.pairKey, V.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: s("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: s("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: s("Stored fraction: {value}", { value: J(y.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: s(W[y.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(W[y.pairKey] ?? y.value) ? `${((W[y.pairKey] ?? y.value) * 100).toFixed(1)}%` : String(W[y.pairKey] ?? y.value) })
        ] }),
        Xe.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": s("Coefficient history"), children: Xe.map((V, Qe) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          Qe > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: s("Exact fraction: {value}", { value: J(V.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: V.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (V.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${V.label}:${Qe}`)) }),
        g && Q === y.pairKey && !Se && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: s("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              bn,
              {
                step: "0.1",
                value: zn,
                disabled: q,
                onValueChange: (V) => {
                  mt(V), g.scientific.kind === "flow-spillover" && V.trim() !== "" && Number.isFinite(Number(V)) && Pn(y.pairKey, Number(V) / 100);
                }
              }
            )
          ] }),
          g.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: s("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: q || !Number.isFinite(Number(zn)) || zn.trim() === "",
              onClick: () => Pn(y.pairKey, Number(zn) / 100),
              children: s("Stage value")
            }
          ),
          W[y.pairKey] !== void 0 && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: q,
              onClick: () => {
                Pn(y.pairKey, y.value), Ge((V) => {
                  const Qe = { ...V };
                  return delete Qe[y.pairKey], Qe;
                });
              },
              children: s("Reset")
            }
          )
        ] }),
        gn && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-candidate-status${l ? " is-compact" : ""}`, "aria-label": s("Flow compensation coefficient preview"), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Coefficient preview") }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              s("Original remains fixed; the right panel shows the complete working matrix."),
              l ? s(" The gallery remains installed until Apply.") : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("em", { children: ve === void 0 ? s("Working matrix") : `${(y.value * 100).toFixed(1)}% → ${(ve * 100).toFixed(1)}%` }),
          De.state === "updating" && De.pairKey === y.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: s("Updating…") }),
          De.state === "error" && De.pairKey === y.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: s(De.message) })
        ] }),
        y.interaction && y.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          s("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: y.interaction })
        ] }),
        l && (Ye ? /* @__PURE__ */ e.jsx(
          Os,
          {
            preview: Ye,
            sourceLabel: y.source.label,
            receiverLabel: y.receiver.label,
            kind: u.kind,
            densitySmoothing: Ue,
            compact: !0,
            compensatedTitle: s(ze ? "Candidate" : "Compensated")
          }
        ) : xe && !xe.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(xe.reason) }) : null),
        l && /* @__PURE__ */ e.jsx(
          Pr,
          {
            matrixView: u,
            sourceChannels: re,
            receiverChannels: le,
            selectedSourceIndex: y.sourceIndex,
            selectedReceiverIndex: y.receiverIndex,
            stagedCoefficients: W,
            maximumAbsoluteOffDiagonal: us,
            onSelect: Oi
          }
        ),
        !l && (Ye ? /* @__PURE__ */ e.jsx(
          Os,
          {
            preview: Ye,
            sourceLabel: y.source.label,
            receiverLabel: y.receiver.label,
            kind: u.kind,
            densitySmoothing: Ue,
            compensatedTitle: s(ze ? "Candidate" : "Compensated")
          }
        ) : xe && !xe.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: s(xe.reason) }) : null),
        m && h && x && j && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: s("Sweep bounds") }),
            /* @__PURE__ */ e.jsx("span", { children: s("Four exact candidates will be interpolated across these endpoints.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-inputs", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Lower (%)") }),
              /* @__PURE__ */ e.jsx(
                bn,
                {
                  step: "0.1",
                  value: x.lowerPercent,
                  disabled: q || ae !== null || ge !== null,
                  onValueChange: (V) => Bn(y.pairKey, y.value, "lowerPercent", V)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: s("Upper (%)") }),
              /* @__PURE__ */ e.jsx(
                bn,
                {
                  step: "0.1",
                  value: x.upperPercent,
                  disabled: q || ae !== null || ge !== null,
                  onValueChange: (V) => Bn(y.pairKey, y.value, "upperPercent", V)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: q || ae !== null || ge !== null || j.error !== null,
                onClick: () => void Pi(h),
                children: s(ge === y.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          j.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: s(j.error) }) : /* @__PURE__ */ e.jsx("small", { children: s("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(ie, Ls).toLocaleString(),
            sweep: Math.min(ie, Ds).toLocaleString()
          }) }),
          S && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: S.values.map((V) => /* @__PURE__ */ e.jsx("div", { className: V.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            it,
            {
              title: `${V.isCurrent ? `${s("Current")} · ` : ""}${(V.value * 100).toFixed(2)}%`,
              panel: V.preview.compensated,
              preview: V.preview,
              sourceLabel: y.source.label,
              receiverLabel: y.receiver.label,
              minimumSize: 145,
              maximumSize: 220,
              densitySmoothing: Ue
            }
          ) }, `${y.pairKey}:bounds:${V.value}:${V.isCurrent}`)) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: s(u.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: s("No coefficient selected.") })
    ] });
  }, gs = (t, l) => /* @__PURE__ */ e.jsx(
    Ir,
    {
      dataset: l,
      pair: t,
      plotSize: jt,
      densitySmoothing: Ue,
      flagged: mn.has(t.pairKey),
      selected: Q === t.pairKey,
      onSelect: () => {
        ce(null), ee(t.pairKey), ot(!0);
      },
      onFlag: (m) => Fn(t.pairKey, m)
    },
    t.pairKey
  ), Di = async (t, l) => {
    if (!(se != null && se.ready) || !u)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const m = is.map((h) => ({
      pairKey: h.pairKey,
      sourceLabel: h.source.label,
      receiverLabel: h.receiver.label,
      coefficient: h.coefficient,
      relationship: h.interaction,
      buildPreview: () => {
        const x = Zs(
          se.dataset,
          h.source.key,
          h.receiver.key
        );
        if (!x.ready) throw new Error(x.reason);
        return x.preview;
      }
    }));
    await Nr(m, {
      sampleName: i,
      profileName: (g == null ? void 0 : g.name) ?? s(u.title),
      populationName: (H == null ? void 0 : H.name) ?? s("All Events"),
      filterLabel: rs,
      densitySmoothing: Ue,
      densityColorPower: O,
      pointAlpha: Vn
    }, t, l);
  };
  return C ? /* @__PURE__ */ e.jsx(Bt.Provider, { value: O, children: /* @__PURE__ */ e.jsx(Gt.Provider, { value: Vn, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-overview${je === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsx("h2", { className: "gl-tab-title", children: s("Compensation") }),
            !R && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: Wn })
          ] }),
          R ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${K.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: s("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: Hn,
                method: Wn,
                count: St,
                status: s(K.state === "ready" ? "Ready" : "Unavailable"),
                assay: s(r ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${K.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  s("{kind} compensation installed. Installed compensation profile.", {
                    kind: R.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                /* @__PURE__ */ e.jsx("strong", { children: Ni }),
                /* @__PURE__ */ e.jsx("span", { children: s("{method} · {count} ch · {status}", {
                  method: Wn,
                  count: St,
                  status: K.state === "ready" ? s("Ready") : s("Unavailable")
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
                source: s(cs),
                assay: s(r ? "Compensated assay active" : "Original assay active"),
                count: St
              })
            }
          ),
          R && n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: q,
              onClick: () => {
                var t;
                return (t = gt.current) == null ? void 0 : t.click();
              },
              children: s("Replace matrix…")
            }
          ),
          w !== void 0 && M !== void 0 && b && /* @__PURE__ */ e.jsxs(
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
                    value: w,
                    disabled: q,
                    onChange: (t) => b(Number(t.currentTarget.value)),
                    children: Array.from({ length: M }, (t, l) => l + 1).map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, t))
                  }
                ),
                /* @__PURE__ */ e.jsxs("small", { children: [
                  "/ ",
                  M
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
                value: (H == null ? void 0 : H.id) ?? "all",
                disabled: ae !== null || ge !== null,
                onChange: (t) => ct(t.currentTarget.value),
                children: [
                  /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All Events") }),
                  T.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: `${"· ".repeat(t.depth)}${t.name} (${t.eventCount.toLocaleString()})` }, t.id))
                ]
              }
            ),
            /* @__PURE__ */ e.jsx("small", { children: s("{count} events · applies to biplots, attention ranking, and sweeps; membership frozen from the current assay", {
              count: ie.toLocaleString()
            }) })
          ] }),
          je !== "global" && /* @__PURE__ */ e.jsxs(
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
                    value: String(Un),
                    disabled: q,
                    onChange: (t) => {
                      const l = t.currentTarget.value;
                      ri(l === "all" ? "all" : Number(l));
                    },
                    children: [
                      _s.map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: s("{count} events", { count: t.toLocaleString() }) }, t)),
                      /* @__PURE__ */ e.jsx("option", { value: "all", children: s("All available") })
                    ]
                  }
                ),
                /* @__PURE__ */ e.jsx("small", { children: s("Showing {shown} of {total}; Apply always uses all events.", {
                  shown: kn.length.toLocaleString(),
                  total: ie.toLocaleString()
                }) })
              ]
            }
          ),
          Ci && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-global-layer-note", children: s("Assay selection in the top bar applies to every tab.") })
        ] }),
        n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
          "input",
          {
            ref: gt,
            type: "file",
            accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
            className: "gl-sr-only",
            "aria-label": s("Choose CyTOF spillover matrix"),
            onChange: (t) => void ki(t)
          }
        ),
        es && /* @__PURE__ */ e.jsx("div", { className: ns ? "gl-comp-error" : "gl-comp-status", role: ns ? "alert" : "status", children: s(es) }),
        n.instrument === "flow" && D && !R && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-enable-heading", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { id: "comp-flow-enable-heading", children: s("Embedded FCS matrix") }),
            /* @__PURE__ */ e.jsx("span", { children: s("Install this exact matrix as the immutable baseline to edit coefficients and preview their effect.") })
          ] }),
          c && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "checkbox",
                checked: cn,
                disabled: q,
                onChange: (t) => En(t.currentTarget.checked)
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: s("Recompute existing gate memberships in compensated coordinates.") })
          ] }),
          Ae != null && Ae.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: Ae.error }) : q ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
            ne ? s("Preparing editor… {percent}%", { percent: Math.round(ne.fraction * 100) }) : s("Preparing editor…"),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-btn-ghost",
                disabled: (ne == null ? void 0 : ne.phase) === "cancelling",
                onClick: o,
                children: s((ne == null ? void 0 : ne.phase) === "cancelling" ? "Cancelling…" : "Cancel")
              }
            )
          ] }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-btn",
              disabled: !a || c && !cn,
              onClick: () => void Fi(),
              children: s("Enable matrix editing")
            }
          )
        ] }),
        n.instrument === "cytof" && (!R || Z) && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-cytof-import", "aria-labelledby": "comp-cytof-import-heading", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-import-head", children: [
            /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("h3", { id: "comp-cytof-import-heading", children: s("CyTOF spillover matrix") }),
              /* @__PURE__ */ e.jsx("span", { children: s("Linear counts → non-negative least squares → arcsinh display") })
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-import-actions", children: /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: Z ? "gl-btn-ghost" : "gl-btn",
                disabled: q,
                onClick: () => {
                  var t;
                  return (t = gt.current) == null ? void 0 : t.click();
                },
                children: s(Z ? "Choose another matrix…" : "Import matrix…")
              }
            ) })
          ] }),
          ts && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s(ts) }),
          Z && fe && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-body", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-summary", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("strong", { children: Z.fileName }),
                /* @__PURE__ */ e.jsx("span", { children: s("{sources} sources × {receivers} receivers", {
                  sources: Z.matrix.sourceChannels.length,
                  receivers: Z.matrix.receiverChannels.length
                }) })
              ] }),
              /* @__PURE__ */ e.jsxs("dl", { children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Exact matches") }),
                  /* @__PURE__ */ e.jsx("dd", { children: fe.matchedChannels.length })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Included") }),
                  /* @__PURE__ */ e.jsx("dd", { children: fe.includedChannels.length })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Not in FCS") }),
                  /* @__PURE__ */ e.jsx("dd", { children: fe.matrixOnlyChannels.length })
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
                    onClick: () => ln(new Set(fe.matchedChannels)),
                    children: s("All matched")
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-mini-btn",
                    disabled: q,
                    onClick: () => ln(/* @__PURE__ */ new Set()),
                    children: s("None")
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-channel-grid", children: Z.matrix.receiverChannels.map((t) => {
              const l = fe.matchedChannels.includes(t);
              return /* @__PURE__ */ e.jsxs("label", { className: l ? "" : "is-unavailable", title: l ? t : s("{channel} is not uniquely present in this FCS file", { channel: t }), children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Sn.has(t),
                    disabled: !l || q,
                    onChange: (m) => Ai(t, m.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: It(n, t).combined }),
                !l && /* @__PURE__ */ e.jsx("small", { children: s("not matched") })
              ] }, t);
            }) }),
            (Z.validationWarnings.length > 0 || fe.warnings.length > 0) && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: /* @__PURE__ */ e.jsx("span", { children: s("{count} review items: {messages}", {
              count: Z.validationWarnings.length + fe.warnings.length,
              messages: [
                ...Z.validationWarnings.map(({ message: t }) => t),
                ...fe.warnings.map(({ message: t }) => t)
              ].map((t) => s(t)).join(" ")
            }) }) }),
            fe.blockers.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: fe.blockers.map(({ message: t }) => s(t)).join(" ") }),
            c && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: cn,
                  disabled: q,
                  onChange: (t) => En(t.currentTarget.checked)
                }
              ),
              /* @__PURE__ */ e.jsx("span", { children: s("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                /* @__PURE__ */ e.jsx("span", { children: q ? ne ? s("{phase}… {percent}% ({processed} / {total} events)", {
                  phase: s(ne.phase === "cancelling" ? "Cancelling" : ne.phase === "preparing" ? "Preparing" : "Applying"),
                  percent: Math.round(ne.fraction * 100),
                  processed: ne.processedEvents.toLocaleString(),
                  total: ne.totalEvents.toLocaleString()
                }) : s("Preparing compensation…") : s("The Original assay is retained and can be restored at any time.") }),
                /* @__PURE__ */ e.jsx("strong", { className: Ze === 0 ? "is-empty" : void 0, children: Ze === 0 ? s("No FCS files are checked. Select at least one file in Samples.") : s("Applies atomically to {files} checked FCS files · {events} total events", {
                  files: Ze,
                  events: bi.toLocaleString()
                }) })
              ] }),
              q ? /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn-ghost",
                  disabled: (ne == null ? void 0 : ne.phase) === "cancelling",
                  onClick: o,
                  children: s((ne == null ? void 0 : ne.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                }
              ) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: !a || Ze === 0 || !fe.canApply || c && !cn,
                  onClick: () => void Ti(),
                  children: s("Apply NNLS compensation")
                }
              )
            ] })
          ] })
        ] }),
        ls && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: s("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
        os.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
          /* @__PURE__ */ e.jsx("span", { children: s("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
            count: os.length
          }) }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => jn((t) => ({ ...t, review: !0 })), children: s("Review details") })
        ] }),
        R && K.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
        u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-workspace-tabs", role: "tablist", "aria-label": s("Compensation workspace"), children: [
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": je === "matrix",
              className: je === "matrix" ? "active" : void 0,
              onClick: () => {
                ce(null), Rn("matrix");
              },
              children: s("Matrix")
            }
          ),
          /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": je === "global",
              className: je === "global" ? "active" : void 0,
              onClick: () => {
                ce(null), Rn("global");
              },
              children: s("Global inspector")
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              role: "tab",
              "aria-selected": je === "attention",
              className: je === "attention" ? "active" : void 0,
              onClick: () => {
                ce(null), Rn("attention");
              },
              children: [
                s("Flagged"),
                Y.length > 0 ? ` (${Y.length})` : ""
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
                    value: Ue,
                    "aria-label": s("Compensation biplot density smoothing"),
                    onChange: (t) => ti(Number(t.currentTarget.value))
                  }
                ),
                /* @__PURE__ */ e.jsx("output", { children: Ue })
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
                    value: Vn,
                    "aria-label": s("Compensation biplot point alpha"),
                    onChange: (t) => ii(Number(t.currentTarget.value))
                  }
                ),
                /* @__PURE__ */ e.jsx("output", { children: Vn.toFixed(2) })
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            Wi,
            {
              className: "gl-comp-density-colour",
              value: O,
              onChange: L
            }
          ),
          Object.keys(W).length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
            /* @__PURE__ */ e.jsxs("span", { children: [
              s("{count} pending edits", { count: Object.keys(W).length }),
              (g == null ? void 0 : g.scientific.kind) === "cytof-spillover" ? ` · ${s("{files} checked FCS files", { files: Ze })}` : ""
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: q,
                onClick: () => {
                  Ln({}), Ge({}), me(null);
                },
                children: s("Discard")
              }
            ),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-btn",
                disabled: q || ae !== null || ge !== null || !a || (g == null ? void 0 : g.scientific.kind) === "cytof-spillover" && Ze === 0,
                onClick: () => void Ri(),
                children: s("Apply revised matrix")
              }
            )
          ] })
        ] }),
        u && je === "matrix" ? /* @__PURE__ */ e.jsxs(
          "div",
          {
            ref: pn,
            className: "gl-comp-common-path",
            style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${Re}px` },
            children: [
              /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrix-panel", "aria-labelledby": "comp-matrix-heading", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-matrix-head", children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h3", { id: "comp-matrix-heading", children: s(u.title) }),
                    /* @__PURE__ */ e.jsx("span", { children: s(u.subtitle) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-head-actions", children: [
                    Zn && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-inline-edit-note", children: s("Edit cells directly (%)") }),
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
                        onClick: () => Jt(!0),
                        children: s("Export CSV…")
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-scroll", children: /* @__PURE__ */ e.jsxs(
                  "div",
                  {
                    className: `gl-comp-matrix-stage${Zn ? " is-flow-inline" : ""}`,
                    style: {
                      width: 112 + u.receiverAxisKeys.length * $n
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
                                gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${$n}px)`
                              },
                              children: le.map((t, l) => /* @__PURE__ */ e.jsx(
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
                                gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${$n}px)`
                              },
                              children: re.map((t, l) => /* @__PURE__ */ e.jsx(
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
                              ref: ss,
                              className: "gl-comp-matrix shows-values",
                              role: "grid",
                              "aria-label": s("Compensation matrix; source rows and receiver columns"),
                              "aria-rowcount": u.sourceAxisKeys.length,
                              "aria-colcount": u.receiverAxisKeys.length,
                              style: {
                                gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${$n}px)`,
                                gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${$n}px)`
                              },
                              children: u.matrix.map((t, l) => /* @__PURE__ */ e.jsx(
                                "div",
                                {
                                  role: "row",
                                  className: "gl-comp-matrix-row",
                                  "aria-rowindex": l + 1,
                                  children: t.map((m, h) => {
                                    const x = u.sourceAxisKeys[l], j = u.receiverAxisKeys[h], S = `${x}${Pe}${j}`, z = W[S], U = z ?? m, _ = x === j, B = (y == null ? void 0 : y.sourceIndex) === l && y.receiverIndex === h, X = (y == null ? void 0 : y.sourceIndex) === l, $e = (y == null ? void 0 : y.receiverIndex) === h, ve = re[l], gn = le[h], ze = u.kind === "cytof" ? xn(x, j) : null, Ye = Tr(
                                      U,
                                      us,
                                      _
                                    ), Xe = u.receiverAxisKeys.findIndex((de) => de !== x), Je = Q === S, V = Q === null && l === 0 && h === Xe, Qe = Number.isFinite(U) ? U === 0 ? "" : (U * 100).toFixed(1) : String(U), bs = ze && ze !== "other" && ze !== "self" ? ` · ${ze}` : "", Li = ui[S] ?? Vs(U);
                                    return Zn && !_ ? /* @__PURE__ */ e.jsx(
                                      bn,
                                      {
                                        role: "gridcell",
                                        className: `gl-comp-cell gl-comp-cell-input${B ? " selected" : ""}${Je ? " is-pinned" : ""}${z === void 0 ? "" : " is-staged"}${X ? " is-selected-source" : ""}${$e ? " is-selected-receiver" : ""}`,
                                        min: "0",
                                        step: "0.1",
                                        value: Li,
                                        disabled: q,
                                        "data-source-index": l,
                                        "data-receiver-index": h,
                                        "aria-colindex": h + 1,
                                        "aria-selected": Je,
                                        "aria-label": s("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                          source: ve.combined,
                                          receiver: gn.combined,
                                          pending: z === void 0 ? "" : s(", pending edit")
                                        }),
                                        title: s("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                          source: ve.combined,
                                          receiver: gn.combined,
                                          pending: z === void 0 ? "" : s(" · pending edit")
                                        }),
                                        style: Ye,
                                        onFocus: () => ee(S),
                                        onMouseEnter: () => ce(S),
                                        onMouseLeave: () => ce((de) => de === S ? null : de),
                                        onClick: () => ee(S),
                                        onValueChange: (de) => {
                                          ee(S), Ge((In) => ({ ...In, [S]: de })), de.trim() !== "" && Number.isFinite(Number(de)) && Pn(S, Number(de) / 100);
                                        },
                                        onBlur: (de) => {
                                          const In = de.currentTarget.value;
                                          if (In.trim() === "" || !Number.isFinite(Number(In))) {
                                            Ge((kt) => {
                                              const ys = { ...kt };
                                              return delete ys[S], ys;
                                            });
                                            return;
                                          }
                                          Ge((kt) => ({
                                            ...kt,
                                            [S]: Vs(Number(In) / 100)
                                          }));
                                        }
                                      },
                                      j
                                    ) : /* @__PURE__ */ e.jsx(
                                      "button",
                                      {
                                        type: "button",
                                        role: "gridcell",
                                        className: `gl-comp-cell${_ ? " diagonal" : ""}${B ? " selected" : ""}${Je ? " is-pinned" : ""}${z === void 0 ? "" : " is-staged"}${X ? " is-selected-source" : ""}${$e ? " is-selected-receiver" : ""}`,
                                        disabled: _,
                                        tabIndex: _ ? -1 : B || V ? 0 : -1,
                                        "data-source-index": l,
                                        "data-receiver-index": h,
                                        "data-interaction": ze ?? void 0,
                                        "aria-colindex": h + 1,
                                        "aria-pressed": _ ? void 0 : Je,
                                        "aria-label": _ ? s("{channel} diagonal: {value}", { channel: ve.combined, value: Ve(U) }) : s("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                          source: ve.combined,
                                          receiver: gn.combined,
                                          value: Ve(U),
                                          pending: z === void 0 ? "" : s(" (pending edit)"),
                                          interaction: bs
                                        }),
                                        title: _ ? `${ve.combined} · self · ${Ve(U)}` : `${ve.combined} → ${gn.combined} · ${Ve(U)}${z === void 0 ? "" : " · pending edit"}${bs}`,
                                        style: Ye,
                                        onFocus: () => {
                                          _ || ee(S);
                                        },
                                        onMouseEnter: () => {
                                          _ || ce(S);
                                        },
                                        onMouseLeave: () => ce((de) => de === S ? null : de),
                                        onClick: () => ee(S),
                                        onKeyDown: (de) => $i(de, l, h),
                                        children: /* @__PURE__ */ e.jsx("span", { children: Qe })
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
              Mt(),
              Et()
            ]
          }
        ) : u && je === "global" ? /* @__PURE__ */ e.jsxs(
          "div",
          {
            ref: pn,
            className: `gl-comp-common-path gl-comp-global-path${Nn ? " has-details" : ""}`,
            style: {
              gridTemplateColumns: Nn ? `minmax(440px, 1fr) 8px ${Re}px` : "minmax(0, 1fr)"
            },
            children: [
              /* @__PURE__ */ e.jsx(
                Kr,
                {
                  stateKey: k,
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
                        value: Me,
                        onChange: (t) => On(t.currentTarget.value),
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
                        value: Ee,
                        onChange: (t) => Js(t.currentTarget.value),
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
                        value: wn,
                        placeholder: s("Find channel…"),
                        "aria-label": s("Search global compensation pairs"),
                        onChange: (t) => Ht(t.currentTarget.value)
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
                          value: jt,
                          "aria-label": s("Global compensation plot size"),
                          onChange: (t) => ei(Number(t.currentTarget.value))
                        }
                      ),
                      /* @__PURE__ */ e.jsx("output", { children: s("{size}px", { size: jt }) })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-mini-btn gl-comp-global-export",
                        disabled: !(se != null && se.ready) || Te.length === 0,
                        title: s("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                        onClick: () => Qt(!0),
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
                          shown: vt.length.toLocaleString(),
                          total: ie.toLocaleString(),
                          population: (H == null ? void 0 : H.name) ?? s("All Events")
                        })
                      }
                    )
                  ] }),
                  children: se ? se.ready ? Te.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No pairs match the current filter. Choose another filter or clear the channel search.") }) : Ee === "compact" ? /* @__PURE__ */ e.jsx(
                    "div",
                    {
                      className: "gl-comp-global-gallery",
                      "data-event-signature": se.dataset.eventSignature,
                      children: Te.map((t) => gs(t, se.dataset))
                    }
                  ) : /* @__PURE__ */ e.jsx(
                    "div",
                    {
                      className: "gl-comp-global-groups",
                      "data-event-signature": se.dataset.eventSignature,
                      "data-layout": Ee,
                      children: yt.map((t) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                        /* @__PURE__ */ e.jsxs("header", { children: [
                          /* @__PURE__ */ e.jsx("span", { children: s(Ee === "source" ? "Source channel" : "Receiver") }),
                          /* @__PURE__ */ e.jsx("strong", { title: t.channel.combined, children: t.channel.label }),
                          /* @__PURE__ */ e.jsx("small", { children: t.channel.pnn }),
                          /* @__PURE__ */ e.jsx("em", { children: s("{count} pairs", { count: t.pairs.length }) })
                        ] }),
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: t.pairs.map((l) => gs(l, se.dataset)) })
                      ] }, t.channel.key))
                    }
                  ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s(se.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: s("No matrix is available for the global inspector.") })
                }
              ),
              Nn && Mt(),
              Nn && Et(() => ot(!1), !0)
            ]
          }
        ) : u ? /* @__PURE__ */ e.jsxs(
          "div",
          {
            ref: pn,
            className: "gl-comp-common-path",
            style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${Re}px` },
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
                          value: dt,
                          disabled: ae !== null || ge !== null,
                          onChange: (t) => ut(Number(t.currentTarget.value)),
                          children: Array.from({ length: Us }, (t, l) => l + 1).map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, t))
                        }
                      )
                    ] }),
                    ae ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: Ki, children: s("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn",
                        disabled: !g || !E || Fe.length === 0 || Nt > 0 || q || ge !== null,
                        onClick: () => void Ii(),
                        children: s("Run four-value sweeps ({count})", { count: Fe.length })
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-scope", children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Suggestions computed for {population} from up to {count} frozen events.", {
                    population: (H == null ? void 0 : H.name) ?? s("All Events"),
                    count: Math.min(ie, An.length).toLocaleString()
                  }) }),
                  /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-evidence-mode", children: [
                    /* @__PURE__ */ e.jsx("span", { children: s("Evidence mode") }),
                    /* @__PURE__ */ e.jsxs(
                      "select",
                      {
                        "aria-label": s("Compensation evidence mode"),
                        value: Oe,
                        disabled: q || ae !== null || ge !== null,
                        onChange: (t) => {
                          oi(t.currentTarget.value), pt((l) => l + 1), _e({}), He({}), pe(null);
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
                      disabled: q || ae !== null || ge !== null,
                      onClick: () => {
                        pt((t) => t + 1), _e({}), He({}), pe(null), Le(!1), me(
                          s(Y.length === 1 ? "Recomputed compensation suggestions for {population}. {count} flagged pair was retained." : "Recomputed compensation suggestions for {population}. {count} flagged pairs were retained.", {
                            population: (H == null ? void 0 : H.name) ?? s("All Events"),
                            count: Y.length
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
                ae && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-progress", role: "status", "aria-live": "polite", children: [
                  /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, ae.total), value: ae.completed }),
                  /* @__PURE__ */ e.jsx("span", { children: s("{completed} / {total} exact candidate solves · {workers} workers", {
                    completed: ae.completed,
                    total: ae.total,
                    workers: dt
                  }) })
                ] }),
                Xt && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: s(Xt) }),
                g ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": s("Add compensation pair for follow-up"), children: [
                    /* @__PURE__ */ e.jsx("strong", { children: s("Add a pair") }),
                    /* @__PURE__ */ e.jsxs("label", { children: [
                      /* @__PURE__ */ e.jsx("span", { children: s("Source channel") }),
                      /* @__PURE__ */ e.jsx(
                        "select",
                        {
                          "aria-label": s("Follow-up source channel"),
                          value: we,
                          onChange: (t) => {
                            const l = t.currentTarget.value;
                            Yt(l), be === l && ht(u.receiverAxisKeys.find((m) => m !== l && te.has(m)) ?? "");
                          },
                          children: u.sourceAxisKeys.map((t, l) => te.has(t) ? /* @__PURE__ */ e.jsx("option", { value: t, children: re[l].combined }, t) : null)
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
                          value: be,
                          onChange: (t) => ht(t.currentTarget.value),
                          children: u.receiverAxisKeys.map((t, l) => t !== we && te.has(t) ? /* @__PURE__ */ e.jsx("option", { value: t, children: le[l].combined }, t) : null)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-mini-btn",
                        disabled: !we || !be || we === be,
                        onClick: yi,
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
                        const m = hi[t.pairKey], h = mi === t.pairKey, x = Tn(t.pairKey, t.coefficient), j = wt(t.pairKey, t.coefficient);
                        return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${Q === t.pairKey ? " is-selected" : ""}`, children: [
                          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                            /* @__PURE__ */ e.jsxs(
                              "button",
                              {
                                type: "button",
                                className: "gl-comp-sweep-pair-head",
                                "aria-expanded": h,
                                onClick: () => {
                                  ee(t.pairKey), Cn(h ? null : t.pairKey);
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
                                    shift: J(t.evidence.normalizedNegativeShift ?? 0, 3),
                                    slope: J(t.evidence.residualSlope ?? 0, 4)
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
                                onChange: (S) => Fn(t.pairKey, S.currentTarget.checked)
                              }
                            ) })
                          ] }),
                          h && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-body", children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inline-bounds", children: [
                              /* @__PURE__ */ e.jsx("span", { children: s("Four values across") }),
                              /* @__PURE__ */ e.jsxs("label", { children: [
                                s("Lower (%)"),
                                /* @__PURE__ */ e.jsx(bn, { step: "0.1", value: j.lowerPercent, disabled: q || ae !== null || ge !== null, onValueChange: (S) => Bn(t.pairKey, t.coefficient, "lowerPercent", S) })
                              ] }),
                              /* @__PURE__ */ e.jsx("span", { children: s("to") }),
                              /* @__PURE__ */ e.jsxs("label", { children: [
                                s("Upper (%)"),
                                /* @__PURE__ */ e.jsx(bn, { step: "0.1", value: j.upperPercent, disabled: q || ae !== null || ge !== null, onValueChange: (S) => Bn(t.pairKey, t.coefficient, "upperPercent", S) })
                              ] }),
                              x.error && /* @__PURE__ */ e.jsx("small", { children: s(x.error) })
                            ] }),
                            m ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: m.values.map((S) => /* @__PURE__ */ e.jsxs(
                              "div",
                              {
                                className: `gl-comp-sweep-value${S.isCurrent ? " is-current" : ""}${W[t.pairKey] === S.value ? " is-staged" : ""}`,
                                children: [
                                  /* @__PURE__ */ e.jsx(
                                    it,
                                    {
                                      title: `${S.isCurrent ? `${s("Current")} · ` : ""}${(S.value * 100).toFixed(2)}%`,
                                      panel: S.preview.compensated,
                                      preview: S.preview,
                                      sourceLabel: t.source.label,
                                      receiverLabel: t.receiver.label,
                                      minimumSize: 150,
                                      maximumSize: 230,
                                      densitySmoothing: Ue
                                    }
                                  ),
                                  /* @__PURE__ */ e.jsxs("dl", { children: [
                                    /* @__PURE__ */ e.jsxs("div", { children: [
                                      /* @__PURE__ */ e.jsx("dt", { children: s("Shift") }),
                                      /* @__PURE__ */ e.jsx("dd", { children: s("{value} MAD", { value: J(S.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                    ] }),
                                    /* @__PURE__ */ e.jsxs("div", { children: [
                                      /* @__PURE__ */ e.jsx("dt", { children: s("Slope") }),
                                      /* @__PURE__ */ e.jsx("dd", { children: J(S.preview.evidence.residualSlope ?? 0, 4) })
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
                                      disabled: q || S.isCurrent,
                                      onClick: () => Pn(t.pairKey, S.value),
                                      children: s(S.isCurrent ? "Installed" : W[t.pairKey] === S.value ? "Staged" : "Use this value")
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
                          ye.items.length,
                          ")"
                        ] }),
                        /* @__PURE__ */ e.jsx("span", { children: s("{evaluable} evaluable of {screened} screened pairs for {population}. Inspect before flagging.", {
                          evaluable: ye.evaluableCount.toLocaleString(),
                          screened: ye.screenedCount.toLocaleString(),
                          population: (H == null ? void 0 : H.name) ?? s("All Events")
                        }) })
                      ] }) }),
                      ye.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: s("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: ye.items.map((t) => {
                        const l = Dt(t, u.kind, Oe);
                        return /* @__PURE__ */ e.jsxs("article", { className: mn.has(t.pairKey) ? "is-flagged" : void 0, children: [
                          /* @__PURE__ */ e.jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => ee(t.pairKey),
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
                                    shift: J(t.evidence.normalizedNegativeShift ?? 0, 3),
                                    slope: J(t.evidence.residualSlope ?? 0, 4)
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
                                checked: mn.has(t.pairKey),
                                "aria-label": s("Flag suggested {source} to {receiver} for follow-up", {
                                  source: t.source.label,
                                  receiver: t.receiver.label
                                }),
                                onChange: (m) => Fn(t.pairKey, m.currentTarget.checked)
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
              Mt(),
              Et()
            ]
          }
        ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: s(R ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : n.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
        (u || R) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": s("Advanced compensation tools"), children: [
          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: Or.map(({ id: t, label: l }) => /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              id: `comp-drawer-${t}-button`,
              className: "gl-comp-drawer-toggle",
              "aria-expanded": Be[t],
              "aria-controls": `comp-drawer-${t}`,
              onClick: () => Si(t),
              children: [
                /* @__PURE__ */ e.jsxs("span", { children: [
                  s(l),
                  t === "review" && Gn.length > 0 ? ` (${Gn.length})` : ""
                ] }),
                /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: Be[t] ? "▾" : "▸" })
              ]
            },
            t
          )) }),
          Be.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Matrix evidence") }),
            R ? g ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
              /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-evidence-grid", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Profile ID") }),
                  /* @__PURE__ */ e.jsx("dd", { children: g.profileId })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Created") }),
                  /* @__PURE__ */ e.jsx("dd", { children: new Date(g.createdAt).toLocaleString() })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Matrix source") }),
                  /* @__PURE__ */ e.jsx("dd", { children: Zr(g, s) })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Orientation") }),
                  /* @__PURE__ */ e.jsx("dd", { children: s("Source rows → receiver columns") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Imported dimensions") }),
                  /* @__PURE__ */ e.jsx("dd", { children: s("{sources} sources × {receivers} receivers", {
                    sources: g.scientific.matrix.sourceChannels.length,
                    receivers: g.scientific.matrix.receiverChannels.length
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Applied solve") }),
                  /* @__PURE__ */ e.jsx("dd", { children: s("{count} exact $PnN channels · {status}", {
                    count: R.includedPnns.length,
                    status: K.state
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Matrix hash") }),
                  /* @__PURE__ */ e.jsxs("dd", { title: g.matrixHash, children: [
                    g.matrixHash.slice(0, 19),
                    "…"
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Profile hash") }),
                  /* @__PURE__ */ e.jsxs("dd", { title: g.profileHash, children: [
                    g.profileHash.slice(0, 19),
                    "…"
                  ] })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Provenance") }),
                  /* @__PURE__ */ e.jsx("dd", { children: s(((xs = g.provenance) == null ? void 0 : xs.sourceDescription) ?? "No additional source note supplied") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("dt", { children: s("Estimation") }),
                  /* @__PURE__ */ e.jsx("dd", { children: s(((vs = g.provenance) == null ? void 0 : vs.estimationMethod) ?? "Imported coefficients preserved exactly") })
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-method-card", "aria-label": s("Installed compensation method"), children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Pipeline") }),
                  /* @__PURE__ */ e.jsx("strong", { children: s(g.scientific.kind === "cytof-spillover" ? "Original counts → NNLS → Compensated counts → arcsinh display" : "Original values → linear matrix inverse → Compensated values → display transform") })
                ] }),
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("span", { children: s("Solver") }),
                  /* @__PURE__ */ e.jsx("strong", { children: g.scientific.solverVersion }),
                  /* @__PURE__ */ e.jsx("small", { children: g.scientific.solverSettings.map(({ key: t, value: l }) => `${t}=${String(l)}`).join(" · ") })
                ] })
              ] }),
              Ce && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": s("Original versus Compensated preview"), children: [
                /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("h4", { children: s("Original → Compensated impact") }),
                  /* @__PURE__ */ e.jsx("span", { children: s("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                    events: Ce.previewEvents.toLocaleString(),
                    channels: R.includedPnns.length
                  }) })
                ] }) }),
                /* @__PURE__ */ e.jsxs("dl", { children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Values changed") }),
                    /* @__PURE__ */ e.jsxs("dd", { children: [
                      Ce.changedValues.toLocaleString(),
                      " / ",
                      Ce.comparedValues.toLocaleString(),
                      " (",
                      Ve(Ce.changedValues / Ce.comparedValues, !1, 4),
                      ")"
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Median |Δ|") }),
                    /* @__PURE__ */ e.jsx("dd", { children: J(Ce.medianAbsoluteDelta, 5) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Maximum |Δ|") }),
                    /* @__PURE__ */ e.jsx("dd", { children: J(Ce.maxAbsoluteDelta, 5) })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Largest median shift") }),
                    /* @__PURE__ */ e.jsxs("dd", { title: Ce.mostChangedChannel, children: [
                      Ce.mostChangedChannel,
                      " · ",
                      J(Ce.mostChangedChannelMedianDelta, 5)
                    ] })
                  ] }),
                  R.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: s("Negative → zero") }),
                    /* @__PURE__ */ e.jsx("dd", { children: s("{count} preview values", { count: Ce.zeroedNegativeValues.toLocaleString() }) })
                  ] })
                ] })
              ] })
            ] }) : /* @__PURE__ */ e.jsx("p", { children: s("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
              profile: R.profileId,
              method: Wn,
              count: R.includedPnns.length,
              status: K.state
            }) }) : /* @__PURE__ */ e.jsx("p", { children: s("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
              channels: D.channels.length,
              warnings: Ct.length || s("no")
            }) })
          ] }),
          Be.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
            /* @__PURE__ */ e.jsx("h3", { children: s("Review queue") }),
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
              /* @__PURE__ */ e.jsx("h4", { children: s("Matrix integrity") }),
              Gn.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: Gn.map((t) => /* @__PURE__ */ e.jsx("li", { children: s(t) }, t)) }) : /* @__PURE__ */ e.jsx("p", { children: s("No matrix-level items currently require review.") })
            ] }),
            K.state === "ready" && u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
              /* @__PURE__ */ e.jsx("h4", { children: s("Residual-evidence shortlist") }),
              /* @__PURE__ */ e.jsx("p", { children: s("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                screened: ye.screenedCount.toLocaleString(),
                candidateSuffix: ye.candidateCount > ye.screenedCount ? s(" of {count}", { count: ye.candidateCount.toLocaleString() }) : "",
                zeroSuffix: u.kind === "cytof" ? s(", and new exact-zero pile") : "",
                modeNote: s(Oe === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
              }) }),
              ye.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: ye.items.map((t) => /* @__PURE__ */ e.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => ps(t.sourceIndex, t.receiverIndex),
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
                        shift: J(t.evidence.normalizedNegativeShift ?? 0, 3),
                        slope: J(t.evidence.residualSlope ?? 0, 4)
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
        fi && u && /* @__PURE__ */ e.jsx(
          Ar,
          {
            profileLabel: (g == null ? void 0 : g.name) ?? "embedded_FCS",
            installedLabel: s(g ? "Installed matrix" : "Embedded FCS matrix"),
            installedMatrix: {
              sourceChannels: u.sourceAxisKeys,
              receiverChannels: u.receiverAxisKeys,
              matrix: u.matrix
            },
            workingMatrix: ji,
            pendingEditCount: Object.keys(W).length,
            onClose: () => Jt(!1)
          }
        ),
        gi && /* @__PURE__ */ e.jsx(
          Sr,
          {
            sampleName: i,
            populationName: (H == null ? void 0 : H.name) ?? s("All Events"),
            filterLabel: rs,
            pairCount: is.length,
            onExport: Di,
            onClose: () => Qt(!1)
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
function Xr(n, i) {
  const r = n.visible !== !1, a = i.visible !== !1;
  return r || a ? !1 : n.sample === i.sample && n.stateKey === i.stateKey;
}
const ea = A.memo(Yr, Xr);
export {
  ea as CompensationTab
};
