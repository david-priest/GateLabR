var pr = Object.defineProperty;
var fr = (n, s, r) => s in n ? pr(n, s, { enumerable: !0, configurable: !0, writable: !0, value: r }) : n[s] = r;
var lt = (n, s, r) => fr(n, typeof s != "symbol" ? s + "" : s, r);
import { D as ni, r as gr, l as xr, s as vr, z as br, u as Be, a as S, j as e, b as fe, c as ie, p as tn, v as dt, d as yr, e as jr, f as wr, S as Ui, g as Cr, h as Ut, i as Bi, F as qi, k as Nr, m as Sr, C as Mr, n as kr } from "./embed-8iuCsEkz.js";
class xe extends Error {
  constructor(r, a, l = {}) {
    super(a);
    lt(this, "code");
    lt(this, "row");
    lt(this, "column");
    this.name = "CompensationMatrixTableError", this.code = r, this.row = l.row, this.column = l.column;
  }
}
const Er = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;
function Ht(n) {
  return n.trim().normalize("NFC");
}
function Ar(n) {
  const s = Ht(n).toLowerCase();
  return s === "" || s === "x" || s === "row.names" || s === "channel" || s === "source";
}
function Tr(n) {
  return n === "csv" ? "," : "	";
}
function Fr(n) {
  let s = 0, r = 0, a = !1, l = !1, c = 1;
  const d = () => {
    if (s > 0 && r > 0)
      throw new xe(
        "ambiguous-delimiter",
        "The matrix header mixes comma and tab delimiters. Choose CSV or TSV explicitly.",
        { row: c }
      );
    if (s === 0 && r === 0)
      throw new xe(
        "missing-delimiter",
        "The matrix header must contain comma-separated or tab-separated columns.",
        { row: c }
      );
    return r > 0 ? "tsv" : "csv";
  };
  for (let f = 0; f < n.length; f++) {
    const v = n[f];
    if (v === '"') {
      l = !0, a && n[f + 1] === '"' ? f++ : a = !a;
      continue;
    }
    if (!a)
      if (v === ",")
        s++, l = !0;
      else if (v === "	")
        r++, l = !0;
      else if (v === "\r" || v === `
`) {
        if (l) return d();
        v === "\r" && n[f + 1] === `
` && f++, c++, s = 0, r = 0;
      } else /\s/.test(v) || (l = !0);
  }
  return d();
}
function $r(n, s) {
  const r = [];
  let a = [], l = "", c = !1, d = !1, f = 1, v = 1;
  const p = () => {
    a.push(l), l = "", d = !1;
  }, C = () => {
    p(), r.push({ cells: a, row: v }), a = [];
  };
  for (let k = 0; k < n.length; k++) {
    const w = n[k];
    if (c) {
      w === '"' ? n[k + 1] === '"' ? (l += '"', k++) : (c = !1, d = !0) : w === "\r" || w === `
` ? (w === "\r" && n[k + 1] === `
` && k++, l += `
`, f++) : l += w;
      continue;
    }
    if (d) {
      if (w === s)
        p();
      else if (w === "\r" || w === `
`)
        C(), w === "\r" && n[k + 1] === `
` && k++, f++, v = f;
      else if (w !== " ")
        throw new xe(
          "malformed-quoted-field",
          "Unexpected text follows a closing quote in the compensation matrix.",
          { row: f, column: a.length + 1 }
        );
      continue;
    }
    if (w === '"') {
      if (l.length !== 0)
        throw new xe(
          "malformed-quoted-field",
          "A quoted matrix field must begin with a quote.",
          { row: f, column: a.length + 1 }
        );
      c = !0;
    } else w === s ? p() : w === "\r" || w === `
` ? (C(), w === "\r" && n[k + 1] === `
` && k++, f++, v = f) : l += w;
  }
  if (c)
    throw new xe(
      "malformed-quoted-field",
      "The compensation matrix contains an unclosed quoted field.",
      { row: v, column: a.length + 1 }
    );
  return (l.length > 0 || a.length > 0 || d) && C(), r.filter(
    ({ cells: k }) => !(k.length === 1 && k[0].trim().length === 0)
  );
}
function Ir(n, s, r) {
  const a = n.trim();
  if (!Er.test(a))
    throw new xe(
      "invalid-coefficient",
      `Matrix coefficient at row ${s}, column ${r} is not a finite decimal number.`,
      { row: s, column: r }
    );
  const l = Number(a);
  if (!Number.isFinite(l))
    throw new xe(
      "invalid-coefficient",
      `Matrix coefficient at row ${s}, column ${r} is outside the finite numeric range.`,
      { row: s, column: r }
    );
  return l;
}
function Pr(n, s, r) {
  return Object.freeze({
    sourceChannels: Object.freeze(Array.from(n)),
    receiverChannels: Object.freeze(Array.from(s)),
    matrix: Object.freeze(r.map((a) => Object.freeze(Array.from(a))))
  });
}
function Rr(n, s = {}) {
  if (typeof n != "string")
    throw new xe(
      "invalid-input",
      "The compensation matrix contents must be text."
    );
  const r = n.startsWith("\uFEFF") ? n.slice(1) : n;
  if (r.trim().length === 0)
    throw new xe("empty-file", "The compensation matrix file is empty.");
  const a = s == null ? void 0 : s.delimiter;
  if (a !== void 0 && a !== "auto" && a !== "csv" && a !== "tsv")
    throw new xe(
      "invalid-delimiter",
      "The compensation matrix delimiter must be auto, csv, or tsv."
    );
  const l = a ?? "auto", c = l === "auto" ? Fr(r) : l, d = $r(r, Tr(c));
  if (d.length === 0)
    throw new xe("empty-file", "The compensation matrix file is empty.");
  const f = d[0];
  if (f.cells.length < 2)
    throw new xe(
      "missing-receiver-columns",
      "The matrix header needs a source-channel column and at least one receiver channel.",
      { row: f.row }
    );
  const v = f.cells[0];
  if (!Ar(v))
    throw new xe(
      "missing-source-column",
      "The first column must identify source channels (blank, X, row.names, channel, or source).",
      { row: f.row, column: 1 }
    );
  if (d.length < 2)
    throw new xe(
      "missing-data-rows",
      "The compensation matrix does not contain any source-channel rows.",
      { row: f.row + 1 }
    );
  const p = f.cells.slice(1).map(Ht), C = [], k = [];
  for (const w of d.slice(1)) {
    if (w.cells.length !== f.cells.length)
      throw new xe(
        "row-width",
        `Matrix row ${w.row} has ${w.cells.length} columns; expected ${f.cells.length}.`,
        { row: w.row }
      );
    const M = Ht(w.cells[0]);
    if (M.length === 0)
      throw new xe(
        "missing-source-channel",
        `Matrix row ${w.row} has no source-channel identity.`,
        { row: w.row, column: 1 }
      );
    C.push(M), k.push(
      w.cells.slice(1).map((A, I) => Ir(A, w.row, I + 2))
    );
  }
  return Object.freeze({
    input: Pr(C, p, k),
    format: Object.freeze({ delimiter: c, sourceColumnHeader: v })
  });
}
function Zt(n) {
  const s = n.trim().normalize("NFC"), r = s.match(/^([A-Z][a-z]?)(\d{2,3})(?:Di)?(?:$|[_\s(\-])/);
  if (r)
    return { element: r[1], mass: Number(r[2]) };
  const a = s.match(/^(\d{2,3})([A-Z][a-z]?)(?:Di)?(?:$|[_\s(\-])/);
  return a ? { element: a[2], mass: Number(a[1]) } : null;
}
function Vi(n) {
  return n.map((s, r) => ({ channel: s, index: r, isotope: Zt(s) })).sort((s, r) => s.isotope && r.isotope ? s.isotope.mass - r.isotope.mass || s.isotope.element.localeCompare(r.isotope.element) || s.index - r.index : s.isotope ? -1 : r.isotope ? 1 : s.index - r.index).map(({ index: s }) => s);
}
function Kr(n) {
  const s = Vi(n.sourceChannels), r = Vi(n.receiverChannels);
  return {
    sourceChannels: s.map((a) => n.sourceChannels[a]),
    receiverChannels: r.map((a) => n.receiverChannels[a]),
    matrix: s.map(
      (a) => r.map((l) => n.matrix[a][l])
    )
  };
}
function kn(n, s) {
  if (n === s) return "self";
  const r = Zt(n), a = Zt(s);
  if (!r || !a) return "other";
  const l = a.mass - r.mass;
  return r.element === a.element ? l === -1 ? "M-1" : l === 1 ? "M+1" : "same-element" : l === -1 ? "M-1" : l === 1 ? "M+1" : l === 16 ? "oxide (+16)" : "other";
}
function ut(n, s) {
  const r = n.index(s);
  if (r !== void 0) return r;
  const a = n.channels.findIndex((l) => l.pnn === s);
  return a < 0 ? void 0 : a;
}
function mn(n, s, r) {
  if (!Number.isSafeInteger(n) || n < 0)
    throw new RangeError("Compensation event count must be a non-negative safe integer.");
  if (!Number.isSafeInteger(s) || s <= 0)
    throw new RangeError("Compensation preview size must be a positive safe integer.");
  if (r && r.length !== n)
    throw new RangeError("Compensation population mask length does not match the sample.");
  const a = r ? r.reduce((p, C) => p + (C ? 1 : 0), 0) : n, l = Math.min(a, s), c = new Uint32Array(l);
  if (l === 0) return c;
  if (!r) {
    if (l === 1) return c;
    for (let p = 0; p < l; p++)
      c[p] = Math.floor(p * (n - 1) / (l - 1));
    return c;
  }
  const d = Array.from({ length: l }, (p, C) => l === 1 ? 0 : Math.floor(C * (a - 1) / (l - 1)));
  let f = 0, v = 0;
  for (let p = 0; p < n && v < l; p++)
    r[p] && (f === d[v] && (c[v++] = p), f++);
  return c;
}
function fn(n, s) {
  if (n.length === 0) return 0;
  const r = Math.max(0, Math.min(1, s)) * (n.length - 1), a = Math.floor(r), l = Math.ceil(r);
  return a === l ? n[a] : n[a] + (n[l] - n[a]) * (r - a);
}
function ht(n) {
  const s = n.filter(Number.isFinite).sort((c, d) => c - d);
  if (s.length === 0) return [-1, 1];
  let r = fn(s, 2e-3), a = fn(s, 0.998);
  if (!(a > r)) {
    const c = Number.isFinite(r) ? r : 0, d = Math.max(1, Math.abs(c) * 0.05);
    return [c - d, c + d];
  }
  const l = (a - r) * 0.035;
  return r -= l, a += l, [r, a];
}
function Ue(n) {
  if (n.length === 0) return Number.NaN;
  const s = [...n].sort((r, a) => r - a);
  return fn(s, 0.5);
}
function mt(n) {
  if (n.length === 0) return Number.NaN;
  const s = Ue(n), r = Ue(n.map((d) => Math.abs(d - s))) * 1.4826;
  if (Number.isFinite(r) && r > 0) return r;
  const a = n.reduce((d, f) => d + f, 0) / n.length, l = n.reduce((d, f) => d + (f - a) ** 2, 0) / Math.max(1, n.length - 1), c = Math.sqrt(l);
  return Number.isFinite(c) && c > 0 ? c : 1e-12;
}
function Yt(n, s, r = 12) {
  if (n.length !== s.length || n.length < r * 8) return null;
  const a = Array.from({ length: n.length }, (f, v) => v).sort((f, v) => n[f] - n[v]), l = [];
  for (let f = 0; f < r; f++) {
    const v = Math.floor(f * a.length / r), p = Math.floor((f + 1) * a.length / r), C = a.slice(v, p);
    if (C.length < 8) continue;
    const k = Ue(C.map((M) => n[M])), w = Ue(C.map((M) => s[M]));
    Number.isFinite(k) && Number.isFinite(w) && l.push({ x: k, y: w });
  }
  const c = [];
  for (let f = 0; f < l.length; f++)
    for (let v = f + 1; v < l.length; v++) {
      const p = l[v].x - l[f].x;
      if (p === 0) continue;
      const C = (l[v].y - l[f].y) / p;
      Number.isFinite(C) && c.push(C);
    }
  const d = Ue(c);
  return Number.isFinite(d) ? d : null;
}
function Lr(n, s) {
  if (n.length !== s.length || n.length < 120)
    return { excessMad: null, slopeDeltaMad: null };
  const r = Array.from({ length: n.length }, (F, R) => R).filter((F) => Number.isFinite(n[F]) && Number.isFinite(s[F])).sort((F, R) => n[F] - n[R]);
  if (r.length < 120) return { excessMad: null, slopeDeltaMad: null };
  const a = Math.max(96, Math.floor(r.length * 0.8)), l = Math.min(r.length - 24, Math.floor(r.length * 0.9)), c = r.slice(0, a), d = r.slice(l);
  if (c.length < 96 || d.length < 24)
    return { excessMad: null, slopeDeltaMad: null };
  const f = c.map((F) => n[F]), v = c.map((F) => s[F]), p = Yt(f, v, 10);
  if (p === null) return { excessMad: null, slopeDeltaMad: null };
  const C = Ue(c.map((F) => s[F] - p * n[F])), k = c.map((F) => s[F] - (C + p * n[F])), w = Math.max(
    mt(k),
    mt(v) * 0.05,
    1e-12
  ), M = d.map((F) => s[F] - (C + p * n[F])).sort((F, R) => F - R), A = fn(M, 0.75) / w, I = r.slice(Math.floor(r.length * 0.75)), P = I.map((F) => n[F]), E = I.map((F) => s[F]), T = Yt(P, E, 4), $ = fn(P, 0.9) - fn(P, 0.1), N = T === null || !($ > 0) ? null : (T - p) * $ / w;
  return {
    excessMad: Number.isFinite(A) ? A : null,
    slopeDeltaMad: Number.isFinite(N) ? N : null
  };
}
function gs(n, s, r, a, l, c) {
  const d = r.length, f = Lr(r, a), v = Math.min(50, Math.max(12, Math.floor(d * 0.01))), p = (q = 0, i = 0, V = 0) => ({
    status: "insufficient",
    sourceLowEvents: q,
    sourceHighEvents: i,
    destinationNegativeEvents: V,
    normalizedNegativeShift: null,
    residualSlope: null,
    upperTailExcessMad: f.excessMad,
    upperTailSlopeDeltaMad: f.slopeDeltaMad,
    receiverZeroDeltaFraction: d > 0 ? (c - l) / d : 0
  });
  if (d < v * 3) return p();
  const C = [...r].sort((q, i) => q - i), k = fn(C, 0.25), w = r.flatMap((q, i) => q <= k ? [i] : []);
  if (w.length < v) return p(w.length);
  const M = w.map((q) => r[q]), A = Ue(M), I = mt(M);
  let P = r.flatMap((q, i) => q >= A + 3 * I ? [i] : []);
  if (P.length < v && (P = Array.from({ length: d }, (q, i) => i).sort((q, i) => r[i] - r[q]).slice(0, v)), P.length < v) return p(w.length, P.length);
  const E = w.map((q) => a[q]), T = Ue(E), $ = mt(E), N = T + 5 * $, F = a.flatMap((q, i) => q <= N ? [i] : []), R = new Set(F), L = w.filter((q) => R.has(q)), O = P.filter((q) => R.has(q));
  if (L.length < v || O.length < v)
    return p(w.length, P.length, F.length);
  const _ = (Ue(O.map((q) => a[q])) - Ue(L.map((q) => a[q]))) / $, G = F.map((q) => n[q]), Z = F.map((q) => s[q]);
  return {
    status: "ready",
    sourceLowEvents: w.length,
    sourceHighEvents: P.length,
    destinationNegativeEvents: F.length,
    normalizedNegativeShift: Number.isFinite(_) ? _ : null,
    residualSlope: Yt(G, Z),
    upperTailExcessMad: f.excessMad,
    upperTailSlopeDeltaMad: f.slopeDeltaMad,
    receiverZeroDeltaFraction: d > 0 ? (c - l) / d : 0
  };
}
function pt(n, s, r, a, l, c) {
  let d = 0, f = 0, v = 0;
  for (let p = 0; p < r.length; p++) {
    const C = Math.abs(r[p]) <= 1e-12, k = Math.abs(a[p]) <= 1e-12;
    C && d++, k && f++, C && k && v++;
  }
  return {
    x: n.map((p) => Math.max(l[0], Math.min(l[1], p))),
    y: s.map((p) => Math.max(c[0], Math.min(c[1], p))),
    zeroPile: Object.freeze({
      source: d,
      receiver: f,
      corner: v
    })
  };
}
function Bt(n, s, r, a = {}) {
  var q;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation to compare Original and Compensated data." };
  const c = ut(n, s), d = ut(n, r);
  if (c === void 0 || d === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (n.fcs.nEvents === 0)
    return { ready: !1, reason: "This sample contains no events." };
  const f = ((q = a.fixedEventIndices) == null ? void 0 : q.slice()) ?? mn(
    n.fcs.nEvents,
    a.maxEvents ?? 15e3,
    a.eventMask
  );
  for (const i of f)
    if (i >= n.fcs.nEvents || a.eventMask && !a.eventMask[i])
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
  const v = n.channels[c].key, p = n.channels[d].key, C = n.originalColumnData(c), k = n.originalColumnData(d), w = n.compensatedColumnData(c), M = n.compensatedColumnData(d), A = [], I = [], P = [], E = [], T = [], $ = [], N = [], F = [];
  for (const i of f) {
    const V = n.rawToDisplay(v, C[i]), $e = n.rawToDisplay(p, k[i]), D = n.rawToDisplay(v, w[i]), j = n.rawToDisplay(p, M[i]);
    [V, $e, D, j].every(Number.isFinite) && (A.push(V), I.push($e), P.push(C[i]), E.push(k[i]), T.push(D), $.push(j), N.push(w[i]), F.push(M[i]));
  }
  const R = ht([...A, ...T]), L = ht([...I, ...$]), O = n.channelTicks(c, [R[0], R[1]]), _ = n.channelTicks(d, [L[0], L[1]]), G = pt(
    A,
    I,
    P,
    E,
    R,
    L
  ), Z = pt(
    T,
    $,
    N,
    F,
    R,
    L
  );
  return {
    ready: !0,
    preview: {
      eventCount: A.length,
      totalEvents: a.eventMask ? a.eligibleEventCount ?? a.eventMask.reduce((i, V) => i + (V ? 1 : 0), 0) : n.fcs.nEvents,
      xRange: R,
      yRange: L,
      xTicks: O,
      yTicks: _,
      original: G,
      compensated: Z,
      evidence: gs(
        N,
        F,
        T,
        $,
        G.zeroPile.receiver,
        Z.zeroPile.receiver
      )
    }
  };
}
function qt(n, s, r, a, l, c, d = {}) {
  const f = ut(n, s), v = ut(n, r);
  if (f === void 0 || v === void 0)
    return {
      ready: !1,
      reason: "This matrix pair is not present in the FCS file, so a data biplot cannot be drawn."
    };
  if (l.length !== a.length || c.length !== a.length)
    return { ready: !1, reason: "The solved compensation preview does not match the frozen event selection." };
  const p = n.channels[f].key, C = n.channels[v].key, k = n.originalColumnData(f), w = n.originalColumnData(v), M = [], A = [], I = [], P = [], E = [], T = [], $ = [], N = [];
  for (let Z = 0; Z < a.length; Z++) {
    const q = a[Z];
    if (q >= n.fcs.nEvents)
      return { ready: !1, reason: "The frozen compensation event selection is no longer valid." };
    const i = k[q], V = w[q], $e = l[Z], D = c[Z], j = n.rawToDisplay(p, i), ee = n.rawToDisplay(C, V), me = n.rawToDisplay(p, $e), gn = n.rawToDisplay(C, D);
    [i, V, $e, D, j, ee, me, gn].every(Number.isFinite) && (M.push(j), A.push(ee), I.push(i), P.push(V), E.push(me), T.push(gn), $.push($e), N.push(D));
  }
  const F = d.xRange ?? ht([...M, ...E]), R = d.yRange ?? ht([...A, ...T]), L = n.channelTicks(f, [F[0], F[1]]), O = n.channelTicks(v, [R[0], R[1]]), _ = pt(M, A, I, P, F, R), G = pt(E, T, $, N, F, R);
  return {
    ready: !0,
    preview: {
      eventCount: M.length,
      totalEvents: d.totalEvents ?? n.fcs.nEvents,
      xRange: F,
      yRange: R,
      xTicks: L,
      yTicks: O,
      original: _,
      compensated: G,
      evidence: gs(
        $,
        N,
        E,
        T,
        _.zeroPile.receiver,
        G.zeroPile.receiver
      )
    }
  };
}
const Wi = 0.5, Or = 0.01, Dr = 1e-4, zr = 0.05, _r = 3, Ur = 1, Br = 5;
function xs(n, s) {
  const r = n.evidence.normalizedNegativeShift ?? 0, a = n.evidence.residualSlope ?? 0, l = Math.max(0, n.evidence.upperTailExcessMad ?? 0), c = Math.max(0, n.evidence.upperTailSlopeDeltaMad ?? 0), d = Math.abs(n.coefficient), f = Math.max(
    Dr,
    d * zr
  );
  return {
    negativeShift: Math.max(0, -r),
    negativeSlope: Math.max(0, -a),
    zeroDelta: s === "cytof" ? Math.max(0, n.evidence.receiverZeroDeltaFraction) : 0,
    positiveShift: Math.max(0, r),
    positiveSlope: Math.max(0, a),
    upperTailExcess: l,
    upperTailSlopeDelta: c,
    hasNegativeShift: r <= -Wi,
    hasNegativeSlope: a <= -f,
    hasNewZeroPile: s === "cytof" && n.evidence.receiverZeroDeltaFraction >= Or,
    hasPositiveShift: r >= Wi,
    hasPositiveSlope: a >= f,
    hasHighTailCurve: l >= _r && (c >= Ur || l >= Br)
  };
}
function qr(n) {
  return Number(n.hasNegativeShift) + Number(n.hasNegativeSlope) + Number(n.hasNewZeroPile) > 1 ? "multiple-overcompensation-signals" : n.hasNewZeroPile ? "new-zero-pile" : n.hasNegativeShift ? "negative-receiver-shift" : "negative-residual-slope";
}
function Xt(n, s, r = "biological") {
  const a = xs(n, s), l = a.hasNegativeShift || a.hasNegativeSlope || a.hasNewZeroPile, c = a.hasPositiveShift || a.hasPositiveSlope, d = a.hasHighTailCurve || r === "control" && c;
  return l && d ? {
    category: "mixed-evidence",
    label: "Mixed evidence · inspect",
    detail: "Positive and negative residual signals disagree. Inspect the matched plots and use a suitable control before changing the coefficient.",
    reason: "mixed-residual-signals",
    automaticFollowup: !0
  } : l ? {
    category: "overcompensation-like",
    label: "Overcompensation-like",
    detail: "A negative receiver shift, negative residual slope, or new NNLS zero pile is present. This is a review prompt, not an automatic coefficient verdict.",
    reason: qr(a),
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
function nn(n, s) {
  if (!Number.isFinite(n) || n <= 0) return 0;
  const r = s.filter((l) => Number.isFinite(l) && l > 0).sort((l, c) => l - c);
  if (r.length === 0) return 0;
  let a = 0;
  for (const l of r)
    if (l <= n) a++;
    else break;
  return a / r.length;
}
function Vr(n, s, r = "biological") {
  const a = n.map((A) => ({
    ...xs(A, s),
    coefficient: Math.abs(A.coefficient)
  })), l = (A) => a.map((I) => typeof I[A] == "number" ? I[A] : 0), c = l("negativeShift"), d = l("negativeSlope"), f = l("zeroDelta"), v = l("positiveShift"), p = l("positiveSlope"), C = l("upperTailExcess"), k = l("upperTailSlopeDelta"), w = l("coefficient"), M = n.flatMap((A, I) => {
    const P = Xt(A, s, r);
    if (!P.automaticFollowup || P.reason === null) return [];
    const E = a[I], T = 0.22 * nn(E.negativeShift, c) + 0.13 * nn(E.negativeSlope, d) + 0.14 * nn(E.zeroDelta, f) + (r === "control" ? 0.13 * nn(E.positiveShift, v) : 0) + (r === "control" ? 0.08 * nn(E.positiveSlope, p) : 0) + 0.12 * nn(E.upperTailExcess, C) + 0.08 * nn(E.upperTailSlopeDelta, k) + 0.05 * nn(E.coefficient, w) + 0.05 * Math.max(0, Math.min(1, A.physicalPrior));
    return [{
      index: I,
      relativePriority: T,
      reason: P.reason,
      category: P.category
    }];
  });
  return Object.freeze(M.sort((A, I) => I.relativePriority - A.relativePriority || A.index - I.index));
}
function Wr(n, s) {
  const r = n.index(s);
  if (r !== void 0) return r;
  const a = n.channels.findIndex((l) => l.pnn === s);
  return a < 0 ? void 0 : a;
}
function Jt(n, s) {
  if (n.length === 0) return 0;
  const r = Math.max(0, Math.min(1, s)) * (n.length - 1), a = Math.floor(r), l = Math.ceil(r);
  return a === l ? n[a] : n[a] + (n[l] - n[a]) * (r - a);
}
function Gr(n) {
  const s = n.filter(Number.isFinite).sort((c, d) => c - d);
  if (s.length === 0) return [-1, 1];
  let r = Jt(s, 2e-3), a = Jt(s, 0.998);
  if (!(a > r)) {
    const c = Number.isFinite(r) ? r : 0, d = Math.max(1, Math.abs(c) * 0.05);
    return [c - d, c + d];
  }
  const l = (a - r) * 0.035;
  return r -= l, a += l, [r, a];
}
function Hr(n) {
  if (n.length === 0) return "0:empty";
  let s = 2166136261;
  for (const r of n)
    s ^= r, s = Math.imul(s, 16777619) >>> 0;
  return `${n.length}:${n[0]}:${n[n.length - 1]}:${s.toString(16)}`;
}
function Zr(n, s, r = {}) {
  var f;
  if (n.compensatedLayerStatus().state !== "ready")
    return { ready: !1, reason: "Apply compensation before comparing Uncompensated and Compensated data." };
  const l = ((f = r.fixedEventIndices) == null ? void 0 : f.slice()) ?? mn(
    n.fcs.nEvents,
    r.maxEvents ?? 2500,
    r.eventMask
  );
  for (const v of l)
    if (v >= n.fcs.nEvents || r.eventMask && !r.eventMask[v])
      return { ready: !1, reason: "The frozen global-inspector event selection is no longer valid." };
  const c = /* @__PURE__ */ new Map();
  for (const v of Array.from(new Set(s))) {
    const p = Wr(n, v);
    if (p === void 0) continue;
    const C = n.channels[p], k = n.originalColumnData(p), w = n.compensatedColumnData(p), M = new Float64Array(l.length), A = new Float64Array(l.length), I = new Float64Array(l.length), P = new Float64Array(l.length), E = [];
    for (let N = 0; N < l.length; N++) {
      const F = l[N], R = k[F], L = w[F], O = n.rawToDisplay(C.key, R), _ = n.rawToDisplay(C.key, L);
      M[N] = R, A[N] = L, I[N] = O, P[N] = _, Number.isFinite(O) && E.push(O), Number.isFinite(_) && E.push(_);
    }
    const T = Gr(E), $ = Object.freeze({
      key: C.key,
      pnn: C.pnn,
      range: T,
      ticks: n.channelTicks(p, [T[0], T[1]]),
      originalRaw: M,
      compensatedRaw: A,
      originalDisplay: I,
      compensatedDisplay: P
    });
    c.set(v, $), c.set(C.key, $), c.set(C.pnn, $);
  }
  const d = r.eventMask ? r.eligibleEventCount ?? r.eventMask.reduce((v, p) => v + (p ? 1 : 0), 0) : n.fcs.nEvents;
  return {
    ready: !0,
    dataset: Object.freeze({
      eventIndices: l,
      eventSignature: Hr(l),
      eligibleEventCount: d,
      channels: c
    })
  };
}
function Gi(n, s, r, a, l, c, d) {
  const f = [], v = [];
  let p = 0, C = 0, k = 0;
  for (const w of l) {
    f.push(Math.max(c[0], Math.min(c[1], n[w]))), v.push(Math.max(d[0], Math.min(d[1], s[w])));
    const M = Math.abs(r[w]) <= 1e-12, A = Math.abs(a[w]) <= 1e-12;
    M && p++, A && C++, M && A && k++;
  }
  return {
    x: f,
    y: v,
    zeroPile: Object.freeze({ source: p, receiver: C, corner: k })
  };
}
function vs(n, s, r) {
  const a = n.channels.get(s), l = n.channels.get(r);
  if (!a || !l)
    return { ready: !1, reason: "One or both channels are absent from the frozen global-inspector dataset." };
  const c = [];
  for (let d = 0; d < n.eventIndices.length; d++)
    [
      a.originalDisplay[d],
      l.originalDisplay[d],
      a.compensatedDisplay[d],
      l.compensatedDisplay[d]
    ].every(Number.isFinite) && c.push(d);
  return {
    ready: !0,
    preview: Object.freeze({
      eventCount: c.length,
      totalEvents: n.eligibleEventCount,
      eventSignature: n.eventSignature,
      xRange: a.range,
      yRange: l.range,
      xTicks: a.ticks,
      yTicks: l.ticks,
      original: Gi(
        a.originalDisplay,
        l.originalDisplay,
        a.originalRaw,
        l.originalRaw,
        c,
        a.range,
        l.range
      ),
      compensated: Gi(
        a.compensatedDisplay,
        l.compensatedDisplay,
        a.compensatedRaw,
        l.compensatedRaw,
        c,
        a.range,
        l.range
      )
    })
  };
}
function Hi(n, s, r, a, l) {
  const c = Math.max(1, Math.min(24, Math.round(l) || 3)), d = 256, f = c, v = d + 2 * f, p = new Float64Array(v * v), C = Math.max(1e-12, s[1] - s[0]), k = Math.max(1e-12, r[1] - r[0]);
  for (let E = 0; E < n.x.length; E++) {
    const T = Math.max(0, Math.min(
      v - 1,
      Math.floor((n.x[E] - s[0]) / C * d) + f
    )), $ = Math.max(0, Math.min(
      v - 1,
      Math.floor((n.y[E] - r[0]) / k * d) + f
    ));
    p[$ * v + T]++;
  }
  const w = new Float64Array(v * v), M = (c * 2 + 1) ** 2, A = v + 1, I = new Float64Array(A * A);
  for (let E = 0; E < v; E++) {
    let T = 0;
    for (let $ = 0; $ < v; $++)
      T += p[E * v + $], I[(E + 1) * A + $ + 1] = I[E * A + $ + 1] + T;
  }
  for (let E = c; E < v - c; E++) {
    const T = E - c, $ = E + c + 1;
    for (let N = c; N < v - c; N++) {
      const F = N - c, R = N + c + 1, L = I[$ * A + R] - I[T * A + R] - I[$ * A + F] + I[T * A + F];
      w[E * v + N] = L / M;
    }
  }
  const P = [];
  for (let E = f; E < f + d; E++)
    for (let T = f; T < f + d; T++) {
      const $ = w[E * v + T];
      $ > 0 && P.push($);
    }
  return P.sort((E, T) => E - T), P.length === 0 ? 1 : Math.max(1e-12, Jt(P, a));
}
function ti(n, s) {
  const r = Math.max(1, Math.min(10, Number.isFinite(n) ? n : 6)), a = Math.max(1, (Number.isFinite(s) ? s : 220) - 50);
  return Math.max(1, Math.min(24, r * 170 / a));
}
function ii(n, s = 0.95, r = 3, a = ni) {
  const l = Math.max(
    Hi(n.original, n.xRange, n.yRange, s, r),
    Hi(n.compensated, n.xRange, n.yRange, s, r)
  );
  return gr(l, a);
}
function ft(n, s) {
  const r = s.size / 220, a = Math.sqrt(r), l = Math.max(9, Math.min(12, 11 * a)), c = Math.max(10, Math.min(13, 12 * a));
  xr().renderMiniPlot(n, {
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
    point_size: Math.max(0.55, Math.min(1.2, 1.15 * r)) * (s.pointSize ?? 1),
    point_alpha: s.pointAlpha,
    density_clip_quantile: 0.95,
    density_color_power: s.densityColorPower,
    density_color_ceiling: s.densityColorCeiling,
    density_smoothing: s.densitySmoothingRadius,
    axis_tick_size: 6,
    axis_outer_tick_size: 0,
    plot_margins: { top: 22, right: 8 },
    font_sizes: {
      tick: l,
      axis_label: c,
      title: Math.max(10, Math.min(13, 12 * a)),
      gate_label: l
    }
  });
}
const pn = "http://www.w3.org/2000/svg", Un = 6, Tn = 1123, gt = 794;
function bs(n) {
  return Math.ceil(Math.max(0, Math.floor(n)) / Un);
}
function Zi(n) {
  return n.trim().replace(/[^a-z0-9._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "sample";
}
function ys(n, s) {
  return `gatelab-compensation-${Zi(n.replace(/\.[^.]+$/, ""))}-${Zi(s)}`;
}
function Qt(n, s, r, a) {
  const l = ys(n, s);
  return r === "pdf" || a <= 1 ? `${l}.${r}` : `${l}-${r}-pages.zip`;
}
function En(n, s, r, a, l = {}) {
  const c = document.createElementNS(pn, "text");
  return c.setAttribute("x", String(r)), c.setAttribute("y", String(a)), c.setAttribute("font-family", "Arial, Helvetica, sans-serif"), c.setAttribute("font-size", String(l.size ?? 10)), c.setAttribute("font-weight", String(l.weight ?? 400)), c.setAttribute("fill", l.fill ?? "#253247"), l.anchor && c.setAttribute("text-anchor", l.anchor), c.textContent = s, n.appendChild(c), c;
}
function Yi(n, s) {
  return n.length <= s ? n : `${n.slice(0, Math.max(1, s - 1))}…`;
}
function Xi(n, s, r, a, l, c, d, f, v, p, C, k) {
  const w = document.createElement("div");
  ft(w, {
    title: a === "original" ? "Original" : "Compensated",
    panel: r[a],
    preview: r,
    sourceLabel: s.sourceLabel,
    receiverLabel: s.receiverLabel,
    size: d,
    densityColorCeiling: v,
    densitySmoothingRadius: f,
    densityColorPower: p,
    pointAlpha: C,
    pointSize: k,
    canvasScale: 300 / 96
  });
  const M = w.querySelector("canvas"), A = w.querySelector("svg");
  if (!M || !A) throw new Error("GateLab could not render a compensation export panel.");
  const I = document.createElementNS(pn, "g");
  I.setAttribute("transform", `translate(${l},${c})`);
  const P = document.createElementNS(pn, "image");
  P.setAttribute("x", "0"), P.setAttribute("y", "0"), P.setAttribute("width", String(d)), P.setAttribute("height", String(d)), P.setAttribute("href", M.toDataURL("image/png")), I.appendChild(P), I.appendChild(A.cloneNode(!0)), n.appendChild(I);
}
function Ji(n, s, r, a) {
  const l = document.createElementNS(pn, "svg");
  l.setAttribute("xmlns", pn), l.setAttribute("width", String(Tn)), l.setAttribute("height", String(gt)), l.setAttribute("viewBox", `0 0 ${Tn} ${gt}`);
  const c = document.createElementNS(pn, "rect");
  c.setAttribute("width", "100%"), c.setAttribute("height", "100%"), c.setAttribute("fill", "#ffffff"), l.appendChild(c), En(l, "GateLab compensation comparison", 28, 23, { size: 15, weight: 700 }), En(
    l,
    Yi(`${s.sampleName} · ${s.populationName} · ${s.profileName} · ${s.filterLabel}`, 150),
    28,
    41,
    { size: 9, fill: "#5f6d80" }
  ), En(l, `Page ${r + 1} of ${a}`, Tn - 28, 23, {
    size: 9,
    fill: "#5f6d80",
    anchor: "end"
  });
  const d = 28, f = 18, v = 53, p = 771, C = (Tn - d * 2 - f) / 2, k = (p - v) / 3, w = 204, M = 12, A = w * 2 + M;
  return n.forEach((I, P) => {
    const E = I.buildPreview(), T = ti(s.densitySmoothing, w), $ = ii(
      E,
      0.95,
      T,
      s.densityColorPower
    ), N = P % 2, F = Math.floor(P / 2), R = d + N * (C + f), L = v + F * k, O = R + (C - A) / 2, _ = L + 25, G = I.relationship && I.relationship !== "other" ? ` · ${I.relationship}` : "";
    if (En(
      l,
      Yi(`${I.sourceLabel} → ${I.receiverLabel}`, 58),
      R + 5,
      L + 14,
      { size: 10.5, weight: 700 }
    ), En(
      l,
      `matrix ${(I.coefficient * 100).toFixed(1)}%${G}`,
      R + C - 5,
      L + 14,
      { size: 8.5, fill: "#5f6d80", anchor: "end" }
    ), Xi(l, I, E, "original", O, _, w, T, $, s.densityColorPower, s.pointAlpha, s.pointSize ?? 1), Xi(l, I, E, "compensated", O + w + M, _, w, T, $, s.densityColorPower, s.pointAlpha, s.pointSize ?? 1), F < 2) {
      const Z = document.createElementNS(pn, "line");
      Z.setAttribute("x1", String(R)), Z.setAttribute("x2", String(R + C)), Z.setAttribute("y1", String(L + k - 3)), Z.setAttribute("y2", String(L + k - 3)), Z.setAttribute("stroke", "#e6eaf0"), Z.setAttribute("stroke-width", "1"), l.appendChild(Z);
    }
  }), En(
    l,
    "Paired panels use the same frozen events, axes, transform, density scale, and off-scale edge piling.",
    28,
    786,
    { size: 8, fill: "#718096" }
  ), l;
}
function Qi(n) {
  return `<?xml version="1.0" encoding="UTF-8"?>
${new XMLSerializer().serializeToString(n)}`;
}
async function es(n, s = 300) {
  const r = URL.createObjectURL(new Blob([n], { type: "image/svg+xml" }));
  try {
    const a = await new Promise((f, v) => {
      const p = new Image();
      p.onload = () => f(p), p.onerror = () => v(new Error("GateLab could not rasterize the compensation export page.")), p.src = r;
    }), l = Math.max(1, s / 96), c = document.createElement("canvas");
    c.width = Math.round(Tn * l), c.height = Math.round(gt * l);
    const d = c.getContext("2d");
    if (!d) throw new Error("Canvas export is unavailable in this browser.");
    return d.fillStyle = "#ffffff", d.fillRect(0, 0, c.width, c.height), d.scale(l, l), d.drawImage(a, 0, 0, Tn, gt), await new Promise((f, v) => {
      c.toBlob((p) => p ? f(p) : v(new Error("GateLab could not encode the PNG export.")), "image/png");
    });
  } finally {
    URL.revokeObjectURL(r);
  }
}
function ns(n, s) {
  const r = URL.createObjectURL(n), a = document.createElement("a");
  a.href = r, a.download = s, document.body.appendChild(a), a.click(), a.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function Yr(n, s, r, a) {
  const l = Math.max(2, String(r).length);
  return `${n}-page-${String(s + 1).padStart(l, "0")}.${a}`;
}
async function Xr(n, s, r, a) {
  const l = bs(n.length);
  if (l === 0) throw new Error("No compensation pairs are available to export.");
  const c = ys(s.sampleName, s.populationName);
  if (r === "pdf") {
    const { jsPDF: p } = await import("./jspdf.es.min-8ev2qW9X.js").then((M) => M.j), C = new p({ orientation: "landscape", unit: "pt", format: "a4", compress: !0 }), k = C.internal.pageSize.getWidth(), w = C.internal.pageSize.getHeight();
    for (let M = 0; M < l; M++) {
      M > 0 && C.addPage("a4", "landscape");
      const A = n.slice(
        M * Un,
        (M + 1) * Un
      ), I = Qi(Ji(A, s, M, l)), P = await es(I), E = await new Promise((T, $) => {
        const N = new FileReader();
        N.onload = () => T(String(N.result)), N.onerror = () => $(N.error ?? new Error("GateLab could not read an export page.")), N.readAsDataURL(P);
      });
      C.addImage(E, "PNG", 0, 0, k, w, void 0, "FAST"), a == null || a({ completedPages: M + 1, totalPages: l }), await new Promise((T) => setTimeout(T, 0));
    }
    C.save(Qt(s.sampleName, s.populationName, r, l));
    return;
  }
  const d = {};
  let f = null;
  for (let p = 0; p < l; p++) {
    const C = n.slice(
      p * Un,
      (p + 1) * Un
    ), k = Qi(Ji(C, s, p, l)), w = Yr(c, p, l, r);
    if (r === "svg") {
      const M = vr(k);
      d[w] = M, l === 1 && (f = new Blob([M], { type: "image/svg+xml" }));
    } else {
      const M = await es(k), A = new Uint8Array(await M.arrayBuffer());
      d[w] = A, l === 1 && (f = M);
    }
    a == null || a({ completedPages: p + 1, totalPages: l }), await new Promise((M) => setTimeout(M, 0));
  }
  const v = Qt(
    s.sampleName,
    s.populationName,
    r,
    l
  );
  ns(l === 1 && f ? f : new Blob([br(d, { level: 6 })], { type: "application/zip" }), v);
}
const Jr = [
  { format: "pdf", title: "PDF", detail: "One multipage A4 landscape document." },
  { format: "png", title: "PNG", detail: "300 DPI numbered pages; multiple pages download as a ZIP." },
  { format: "svg", title: "SVG", detail: "Vector text and axes with embedded high-resolution density layers; multiple pages download as a ZIP." }
];
function Qr({
  sampleName: n,
  populationName: s,
  filterLabel: r,
  pairCount: a,
  onExport: l,
  onClose: c
}) {
  const { t: d } = Be(), [f, v] = S.useState("pdf"), [p, C] = S.useState(null), [k, w] = S.useState(null), M = bs(a), A = p !== null && p.completedPages < p.totalPages, I = Qt(n, s, f, M), P = async () => {
    w(null), C({ completedPages: 0, totalPages: M });
    try {
      await l(f, C), c();
    } catch (T) {
      C(null), w(T instanceof Error ? T.message : String(T));
    }
  }, E = (T) => {
    T.key === "Escape" && !A && c();
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
          Jr.map((T) => /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx(
              "input",
              {
                type: "radio",
                name: "compensation-comparison-export-format",
                value: T.format,
                checked: f === T.format,
                disabled: A,
                onChange: () => v(T.format)
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: T.title }),
              /* @__PURE__ */ e.jsx("small", { children: d(T.detail) })
            ] })
          ] }, T.format))
        ] }),
        /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary gl-comp-comparison-export-summary", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("File") }),
            /* @__PURE__ */ e.jsx("dd", { title: I, children: I })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("Scope") }),
            /* @__PURE__ */ e.jsx("dd", { children: d(a === 1 ? "{count} filtered pair · both assays" : "{count} filtered pairs · both assays", { count: a.toLocaleString() }) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("Pages") }),
            /* @__PURE__ */ e.jsx("dd", { children: d(M === 1 ? "{count} A4 landscape page · six pairs per page" : "{count} A4 landscape pages · six pairs per page", { count: M.toLocaleString() }) })
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
        p && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-comparison-export-progress", role: "status", "aria-live": "polite", children: [
          /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, p.totalPages), value: p.completedPages }),
          /* @__PURE__ */ e.jsx("span", { children: d("Rendering page {current} of {total}", { current: Math.min(p.completedPages + 1, p.totalPages), total: p.totalPages }) })
        ] }),
        k && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "alert", children: d(k) }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", disabled: A, onClick: c, children: d("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", disabled: A || M === 0, onClick: () => void P(), children: A ? d("Rendering…") : d("Download {format}", { format: f.toUpperCase() }) })
        ] })
      ]
    }
  ) });
}
function ts(n) {
  return `"${n.replaceAll('"', '""')}"`;
}
function is(n, s) {
  if (!Array.isArray(n) || n.length === 0)
    throw new Error(`The ${s} channel axis is empty.`);
  const r = n.map((a, l) => {
    if (typeof a != "string" || a.trim().length === 0)
      throw new Error(`The ${s} channel at position ${l + 1} is blank or invalid.`);
    return a.trim().normalize("NFC");
  });
  if (new Set(r).size !== r.length)
    throw new Error(`The ${s} channel axis contains duplicate identities.`);
  return r;
}
function ea(n) {
  const s = is(n.sourceChannels, "source"), r = is(n.receiverChannels, "receiver");
  if (!Array.isArray(n.matrix) || n.matrix.length !== s.length)
    throw new Error("The spill matrix row count does not match its source channel axis.");
  const a = [
    ["channel", ...r].map(ts).join(",")
  ];
  return n.matrix.forEach((l, c) => {
    if (!Array.isArray(l) || l.length !== r.length)
      throw new Error(
        `Spill matrix row ${c + 1} does not match the receiver channel axis.`
      );
    const d = l.map((f, v) => {
      if (typeof f != "number" || !Number.isFinite(f))
        throw new Error(
          `Spill coefficient ${s[c]} → ${r[v]} is not finite.`
        );
      return Object.is(f, -0) ? "0" : String(f);
    });
    a.push([ts(s[c]), ...d].join(","));
  }), `${a.join(`
`)}
`;
}
function na(n, s = "installed") {
  return `${n.replace(/\.(?:csv|tsv|txt)$/i, "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Za-z0-9._-]+/g, "_").replace(/_+/g, "_").replace(/^[._-]+|[._-]+$/g, "").slice(0, 90) || "gatelab"}${s === "working" ? "_working" : ""}_spill_matrix.csv`;
}
function ta(n) {
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
function ia({
  profileLabel: n,
  installedLabel: s,
  installedMatrix: r,
  workingMatrix: a = null,
  pendingEditCount: l = 0,
  onClose: c
}) {
  const { t: d } = Be(), [f, v] = S.useState("installed"), [p, C] = S.useState(null), k = f === "working" && a ? a : r, w = na(n, f), M = S.useMemo(
    () => ta(w),
    [w]
  ), A = () => {
    C(null);
    try {
      const E = ea(k), T = URL.createObjectURL(new Blob([E], { type: "text/csv;charset=utf-8" })), $ = document.createElement("a");
      $.href = T, $.download = w, document.body.appendChild($), $.click(), $.remove(), setTimeout(() => URL.revokeObjectURL(T), 1e3);
    } catch (E) {
      C(E instanceof Error ? E.message : String(E));
    }
  }, I = async () => {
    var E;
    if (!((E = navigator.clipboard) != null && E.writeText)) {
      C("Clipboard access is unavailable; select the R code below and copy it manually.");
      return;
    }
    try {
      await navigator.clipboard.writeText(M), C("R import code copied.");
    } catch {
      C("Clipboard access was denied; select the R code below and copy it manually.");
    }
  }, P = (E) => {
    E.key === "Escape" && c();
  };
  return /* @__PURE__ */ e.jsx("div", { className: "gl-modal-backdrop", onKeyDown: P, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-modal gl-comp-export-modal",
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": "comp-export-title",
      children: [
        /* @__PURE__ */ e.jsx("div", { className: "gl-modal-title", id: "comp-export-title", children: d("Export spill matrix") }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-comp-export-intro", children: d("Coefficients are exported as exact fractions, not the rounded percentages shown in the matrix. Source channels are rows and receiver channels are columns. The CSV can be imported by GateLab or base R.") }),
        a && l > 0 && /* @__PURE__ */ e.jsxs("fieldset", { className: "gl-comp-export-versions", children: [
          /* @__PURE__ */ e.jsx("legend", { children: d("Matrix version") }),
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
                checked: f === "working",
                onChange: () => v("working")
              }
            ),
            /* @__PURE__ */ e.jsxs("span", { children: [
              /* @__PURE__ */ e.jsx("strong", { children: d("Working draft") }),
              /* @__PURE__ */ e.jsx("small", { children: d("{count} pending edits; not yet applied", { count: l }) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-export-summary", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("dt", { children: d("File") }),
            /* @__PURE__ */ e.jsx("dd", { children: w })
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
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => void I(), children: d("Copy R code") })
        ] }),
        /* @__PURE__ */ e.jsx("pre", { className: "gl-comp-export-code", children: /* @__PURE__ */ e.jsx("code", { children: M }) }),
        p && /* @__PURE__ */ e.jsx("div", { className: p.includes("copied") ? "gl-comp-status" : "gl-comp-warning", role: "status", children: p }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-modal-actions", children: [
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: c, children: d("Cancel") }),
          /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn", onClick: A, children: d("Download CSV") })
        ] })
      ]
    }
  ) });
}
function An({
  value: n,
  onValueChange: s,
  scrubStep: r,
  className: a = "",
  disabled: l,
  min: c,
  max: d,
  step: f,
  title: v,
  onPointerDown: p,
  onPointerMove: C,
  onPointerUp: k,
  onPointerCancel: w,
  onLostPointerCapture: M,
  ...A
}) {
  const { t: I } = Be(), P = S.useRef(null), [E, T] = S.useState(!1), $ = (N) => {
    var F, R, L;
    ((F = P.current) == null ? void 0 : F.pointerId) === N.pointerId && (P.current = null, T(!1), (L = (R = N.currentTarget).hasPointerCapture) != null && L.call(R, N.pointerId) && N.currentTarget.releasePointerCapture(N.pointerId));
  };
  return /* @__PURE__ */ e.jsx(
    "input",
    {
      ...A,
      type: "number",
      className: `gl-scrubbable-number${E ? " is-scrubbing" : ""}${a ? ` ${a}` : ""}`,
      value: n,
      disabled: l,
      min: c,
      max: d,
      step: f,
      title: v ?? I("Type a value, use the arrows, or drag vertically to adjust"),
      onChange: (N) => s(N.currentTarget.value),
      onPointerDown: (N) => {
        var G, Z;
        if (p == null || p(N), N.defaultPrevented || l || N.button !== 0) return;
        const F = N.currentTarget.getBoundingClientRect();
        if (N.clientX >= F.right - 18) return;
        const R = Number(n), L = (r ?? Number(f)) || 0.1;
        if (!Number.isFinite(R) || !(L > 0)) return;
        const O = String(L), _ = O.includes("e-") ? Number(O.split("e-")[1]) : O.includes(".") ? O.split(".")[1].length : 0;
        P.current = {
          pointerId: N.pointerId,
          startY: N.clientY,
          startValue: R,
          step: L,
          decimals: _,
          lastSteps: 0
        }, (Z = (G = N.currentTarget).setPointerCapture) == null || Z.call(G, N.pointerId);
      },
      onPointerMove: (N) => {
        C == null || C(N);
        const F = P.current;
        if (!F || F.pointerId !== N.pointerId) return;
        const R = F.startY - N.clientY;
        if (Math.abs(R) < 3) return;
        const L = R > 0 ? Math.floor(R / 4) : Math.ceil(R / 4);
        if (L === F.lastSteps) return;
        let O = F.startValue + L * F.step;
        const _ = c === void 0 ? Number.NEGATIVE_INFINITY : Number(c), G = d === void 0 ? Number.POSITIVE_INFINITY : Number(d);
        Number.isFinite(_) && (O = Math.max(_, O)), Number.isFinite(G) && (O = Math.min(G, O)), P.current = { ...F, lastSteps: L }, T(!0), s(O.toFixed(Math.min(10, F.decimals))), N.preventDefault();
      },
      onPointerUp: (N) => {
        k == null || k(N), $(N);
      },
      onPointerCancel: (N) => {
        w == null || w(N), $(N);
      },
      onLostPointerCapture: (N) => {
        var F;
        M == null || M(N), ((F = P.current) == null ? void 0 : F.pointerId) === N.pointerId && (P.current = null, T(!1));
      }
    }
  );
}
const si = S.createContext(ni), ri = S.createContext(0.85), ai = S.createContext(1), ss = "", ct = [];
let Vt = !1;
function sa(n) {
  const s = { cancelled: !1, run: n };
  ct.push(s);
  const r = () => {
    if (Vt) return;
    Vt = !0;
    const a = () => {
      Vt = !1;
      let c = ct.shift();
      for (; c != null && c.cancelled; ) c = ct.shift();
      c == null || c.run(), ct.length > 0 && r();
    }, l = window;
    typeof l.requestIdleCallback == "function" ? l.requestIdleCallback(a, { timeout: 50 }) : typeof requestAnimationFrame == "function" ? requestAnimationFrame(a) : setTimeout(a, 0);
  };
  return r(), () => {
    s.cancelled = !0;
  };
}
function xt({
  title: n,
  panel: s,
  preview: r,
  sourceLabel: a,
  receiverLabel: l,
  minimumSize: c = 210,
  maximumSize: d = 420,
  densityColorCeiling: f,
  densitySmoothing: v,
  showZeroPile: p = !0
}) {
  const { t: C } = Be(), k = S.useContext(si), w = S.useContext(ri), M = S.useContext(ai), A = S.useRef(null);
  S.useEffect(() => {
    const E = A.current;
    if (!E) return;
    let T = null, $ = 0;
    const N = () => {
      var G;
      T = null;
      const L = ((G = E.parentElement) == null ? void 0 : G.clientWidth) ?? 230, O = Math.max(c, Math.min(d, Math.floor(L)));
      if (O === $ && E.childElementCount > 0) return;
      $ = O;
      const _ = ti(v, O);
      ft(E, {
        title: n,
        panel: s,
        preview: r,
        sourceLabel: a,
        receiverLabel: l,
        size: O,
        densityColorCeiling: f ?? ii(
          r,
          0.95,
          _,
          k
        ),
        densitySmoothingRadius: _,
        densityColorPower: k,
        pointAlpha: w,
        pointSize: M
      });
    }, F = () => {
      T !== null && cancelAnimationFrame(T), T = requestAnimationFrame(N);
    };
    F();
    const R = typeof ResizeObserver > "u" ? null : new ResizeObserver(F);
    return R == null || R.observe(E.parentElement ?? E), () => {
      R == null || R.disconnect(), T !== null && cancelAnimationFrame(T);
    };
  }, [f, k, v, d, c, s, w, M, r, l, a, n]);
  const I = (E) => r.eventCount > 0 ? `${(E / r.eventCount * 100).toFixed(1)}%` : "0.0%", P = s.zeroPile.source > 0 || s.zeroPile.receiver > 0 || s.zeroPile.corner > 0;
  return /* @__PURE__ */ e.jsxs("figure", { className: "gl-comp-biplot", "aria-label": C("{title} density biplot; {source} on x, {receiver} on y", {
    title: n,
    source: a,
    receiver: l
  }), children: [
    /* @__PURE__ */ e.jsx("div", { ref: A, className: "gl-comp-biplot-surface" }),
    p && P && /* @__PURE__ */ e.jsx("figcaption", { className: "gl-comp-zero-pile", children: C("Exact zero · source {source} · receiver {receiver} · both {both}", {
      source: I(s.zeroPile.source),
      receiver: I(s.zeroPile.receiver),
      both: I(s.zeroPile.corner)
    }) })
  ] });
}
function ra({
  title: n,
  preview: s,
  sourceLabel: r,
  receiverLabel: a,
  minimumSize: l,
  maximumSize: c,
  densityColorCeiling: d,
  densitySmoothing: f
}) {
  const { t: v } = Be(), p = S.useContext(si), C = S.useContext(ri), k = S.useContext(ai), w = S.useRef(null);
  return S.useEffect(() => {
    const M = w.current;
    if (!M) return;
    let A = null, I = 0;
    const P = () => {
      var Z;
      A = null;
      const $ = ((Z = M.parentElement) == null ? void 0 : Z.clientWidth) ?? l, N = Math.max(l, Math.min(c, Math.floor($)));
      if (N === I && M.dataset.cacheReady === "true") return;
      I = N, M.dataset.cacheReady = "false";
      const F = ti(f, N), R = d ?? ii(
        s,
        0.95,
        F,
        p
      );
      ft(M, {
        title: n,
        panel: s.original,
        preview: s,
        sourceLabel: r,
        receiverLabel: a,
        size: N,
        densityColorCeiling: R,
        densitySmoothingRadius: F,
        densityColorPower: p,
        pointAlpha: C,
        pointSize: k,
        canvasScale: 2
      });
      const L = M.querySelector("canvas"), O = M.querySelector("svg"), _ = document.createElement("div");
      ft(_, {
        title: n,
        panel: s.compensated,
        preview: s,
        sourceLabel: r,
        receiverLabel: a,
        size: N,
        densityColorCeiling: R,
        densitySmoothingRadius: F,
        densityColorPower: p,
        pointAlpha: C,
        pointSize: k,
        canvasScale: 2
      });
      const G = _.querySelector("canvas");
      !L || !G || !O || (L.classList.add("gl-comp-cached-canvas", "is-original"), L.dataset.assayLayer = "original", G.classList.add("gl-comp-cached-canvas", "is-compensated"), G.dataset.assayLayer = "compensated", M.insertBefore(G, O), M.dataset.cacheReady = "true");
    }, E = () => {
      A == null || A(), A = sa(P);
    };
    E();
    const T = typeof ResizeObserver > "u" ? null : new ResizeObserver(E);
    return T == null || T.observe(M.parentElement ?? M), () => {
      T == null || T.disconnect(), A == null || A();
    };
  }, [d, p, f, c, l, C, k, s, a, r, n]), /* @__PURE__ */ e.jsx(
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
          ref: w,
          className: "gl-comp-biplot-surface gl-comp-cached-biplot",
          "data-cache-mode": "dual-canvas"
        }
      )
    }
  );
}
function rs({
  preview: n,
  sourceLabel: s,
  receiverLabel: r,
  kind: a,
  densitySmoothing: l,
  compact: c = !1,
  compensatedTitle: d = "Compensated"
}) {
  const { t: f } = Be(), v = n.eventCount > 0 ? n.original.zeroPile.receiver / n.eventCount * 100 : 0, p = n.eventCount > 0 ? n.compensated.zeroPile.receiver / n.eventCount * 100 : 0, C = p - v;
  return /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-biplot-comparison${c ? " is-compact" : ""}`, children: [
    !c && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-note", children: f("Same {events} events{sampled} · locked axes · off-scale events piled at edges · colour clipped at the 95th percentile of occupied density bins", {
      events: n.eventCount.toLocaleString(),
      sampled: n.totalEvents > n.eventCount ? f(" sampled from {total}", { total: n.totalEvents.toLocaleString() }) : ""
    }) }),
    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-biplot-panels", children: [
      /* @__PURE__ */ e.jsx(
        xt,
        {
          title: f("Original"),
          panel: n.original,
          preview: n,
          sourceLabel: s,
          receiverLabel: r,
          densitySmoothing: l,
          showZeroPile: !c
        }
      ),
      /* @__PURE__ */ e.jsx(
        xt,
        {
          title: d,
          panel: n.compensated,
          preview: n,
          sourceLabel: s,
          receiverLabel: r,
          densitySmoothing: l,
          showZeroPile: !c
        }
      )
    ] }),
    !c && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-diagnostic-note", children: a === "cytof" ? /* @__PURE__ */ e.jsx(e.Fragment, { children: f("Receiver events at exact zero: {original}% → {compensated}% ({delta} percentage points). A rise can be consistent with NNLS over-subtraction, while a residual source-associated rise can be consistent with under-compensation. Neither is a verdict without a suitable negative/control population.", {
      original: v.toFixed(1),
      compensated: p.toFixed(1),
      delta: `${C >= 0 ? "+" : ""}${C.toFixed(1)}`
    }) }) : /* @__PURE__ */ e.jsx(e.Fragment, { children: f("Residual tilt can be consistent with under- or over-compensation, but spreading error and biological co-expression can produce similar shapes. Use the matched Original/{comparison} view as review evidence, not an automatic coefficient call.", {
      comparison: d
    }) }) }),
    !c && (n.evidence.status === "ready" ? /* @__PURE__ */ e.jsxs("dl", { className: "gl-comp-pair-evidence", "aria-label": f("Conservative residual evidence"), children: [
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: f("Receiver-negative shift") }),
        /* @__PURE__ */ e.jsx("dd", { children: f("{value} MAD", { value: ie(n.evidence.normalizedNegativeShift ?? 0, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: f("Robust residual slope") }),
        /* @__PURE__ */ e.jsx("dd", { children: ie(n.evidence.residualSlope ?? 0, 4) })
      ] }),
      n.evidence.upperTailExcessMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: f("Upper-tail departure") }),
        /* @__PURE__ */ e.jsx("dd", { children: f("{value} MAD", { value: ie(n.evidence.upperTailExcessMad, 3) }) })
      ] }),
      n.evidence.upperTailSlopeDeltaMad !== null && /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: f("Tail slope change") }),
        /* @__PURE__ */ e.jsx("dd", { children: f("{value} MAD", { value: ie(n.evidence.upperTailSlopeDeltaMad, 3) }) })
      ] }),
      /* @__PURE__ */ e.jsxs("div", { children: [
        /* @__PURE__ */ e.jsx("dt", { children: f("Evidence groups") }),
        /* @__PURE__ */ e.jsx("dd", { children: f("{high} source-high · {low} source-low", {
          high: n.evidence.sourceHighEvents.toLocaleString(),
          low: n.evidence.sourceLowEvents.toLocaleString()
        }) })
      ] })
    ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-evidence-insufficient", children: f("Residual screening needs distinct source-low/source-high groups and enough receiver-negative events; this pair remains available for visual review.") }))
  ] });
}
function aa({
  matrixView: n,
  sourceChannels: s,
  receiverChannels: r,
  selectedSourceIndex: a,
  selectedReceiverIndex: l,
  stagedCoefficients: c,
  maximumAbsoluteOffDiagonal: d,
  onSelect: f
}) {
  const { t: v } = Be(), p = 6, C = 74, k = 44, w = 10, M = r.length * p, A = s.length * p, I = C + M + C, P = k + A + w, E = S.useMemo(() => {
    const $ = [];
    for (let N = 0; N < n.matrix.length; N++)
      for (let F = 0; F < n.matrix[N].length; F++) {
        const R = n.sourceAxisKeys[N], L = n.receiverAxisKeys[F], O = `${R}${ss}${L}`, _ = c[O] ?? n.matrix[N][F], G = R === L;
        if (!G && (!Number.isFinite(_) || _ === 0)) continue;
        const Z = d > 0 && Number.isFinite(_) ? Math.min(1, Math.abs(_) / d) : 0, q = Z > 0 ? 0.12 + 0.82 * Math.sqrt(Z) : 0;
        $.push({
          sourceIndex: N,
          receiverIndex: F,
          pairKey: O,
          value: _,
          diagonal: G,
          fill: G ? "#cfd4db" : Number.isFinite(_) ? _ < 0 ? `rgba(47,128,237,${q})` : `rgba(211,47,47,${q})` : "#ae3e3e"
        });
      }
    return $;
  }, [n, d, c]), T = ($) => {
    const N = $.currentTarget.getBoundingClientRect();
    if (!(N.width > 0) || !(N.height > 0)) return;
    const F = ($.clientX - N.left) * I / N.width, R = ($.clientY - N.top) * P / N.height, L = Math.floor((F - C) / p), O = Math.floor((R - k) / p);
    O < 0 || O >= s.length || L < 0 || L >= r.length || n.sourceAxisKeys[O] === n.receiverAxisKeys[L] || f(`${n.sourceAxisKeys[O]}${ss}${n.receiverAxisKeys[L]}`);
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
          sources: s.length,
          receivers: r.length
        }),
        onPointerDown: T,
        children: [
          /* @__PURE__ */ e.jsx("rect", { x: C, y: k, width: M, height: A, fill: "#f8fafc", stroke: "#aeb8c6", strokeWidth: "0.7" }),
          r.map(($, N) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: C + (N + 0.55) * p,
              y: k - 3,
              transform: `rotate(-58 ${C + (N + 0.55) * p} ${k - 3})`,
              textAnchor: "start",
              className: N === l ? "is-selected" : void 0,
              children: $.pnn
            },
            $.key
          )),
          s.map(($, N) => /* @__PURE__ */ e.jsx(
            "text",
            {
              x: C - 3,
              y: k + (N + 0.72) * p,
              textAnchor: "end",
              className: N === a ? "is-selected" : void 0,
              children: $.pnn
            },
            $.key
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: C,
              y: k + a * p,
              width: M,
              height: p,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: C + l * p,
              y: k,
              width: p,
              height: A,
              fill: "rgba(47,128,237,0.08)",
              pointerEvents: "none"
            }
          ),
          E.map(($) => /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: C + $.receiverIndex * p,
              y: k + $.sourceIndex * p,
              width: p,
              height: p,
              fill: $.fill,
              pointerEvents: "none",
              children: /* @__PURE__ */ e.jsx("title", { children: $.diagonal ? v("{channel} · self", { channel: s[$.sourceIndex].combined }) : `${s[$.sourceIndex].combined} → ${r[$.receiverIndex].combined} · ${tn($.value)}` })
            },
            $.pairKey
          )),
          /* @__PURE__ */ e.jsx(
            "rect",
            {
              x: C + l * p,
              y: k + a * p,
              width: p,
              height: p,
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
function oa({
  dataset: n,
  pair: s,
  plotSize: r,
  densitySmoothing: a,
  flagged: l,
  selected: c,
  onSelect: d,
  onFlag: f
}) {
  const { t: v } = Be(), p = S.useRef(null), [C, k] = S.useState(() => typeof IntersectionObserver > "u");
  S.useEffect(() => {
    const A = p.current;
    if (!A || typeof IntersectionObserver > "u") {
      k(!0);
      return;
    }
    const I = new IntersectionObserver(
      (P) => k(P.some((E) => E.isIntersecting)),
      { rootMargin: "450px 0px" }
    );
    return I.observe(A), () => I.disconnect();
  }, []);
  const w = S.useMemo(
    () => C ? vs(n, s.source.key, s.receiver.key) : null,
    [n, s.receiver.key, s.source.key, C]
  ), M = w != null && w.ready ? w.preview : null;
  return /* @__PURE__ */ e.jsxs(
    "article",
    {
      ref: p,
      className: `gl-comp-global-tile${c ? " is-selected" : ""}${l ? " is-flagged" : ""}`,
      "data-pair-key": s.pairKey,
      "data-event-signature": M == null ? void 0 : M.eventSignature,
      "data-x-range": M ? `${M.xRange[0]},${M.xRange[1]}` : void 0,
      "data-y-range": M ? `${M.yRange[0]},${M.yRange[1]}` : void 0,
      style: { width: r, height: r },
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-global-tile-head", children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              onClick: d,
              title: `${s.source.combined} → ${s.receiver.combined}`,
              "aria-label": v("Open details for {source} to {receiver}", {
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
          /* @__PURE__ */ e.jsx("label", { title: v("Keep this pair in Flagged"), children: /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: l,
              "aria-label": v("Flag global inspector pair {source} to {receiver} for follow-up", {
                source: s.source.label,
                receiver: s.receiver.label
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
            onClick: d,
            title: v("{source} → {receiver} · {interaction}matrix {coefficient}%", {
              source: s.source.combined,
              receiver: s.receiver.combined,
              interaction: s.interaction && s.interaction !== "other" ? `${s.interaction} · ` : "",
              coefficient: (s.coefficient * 100).toFixed(1)
            }),
            "aria-label": v("Open details for {source} to {receiver}; matrix coefficient {coefficient}%", {
              source: s.source.label,
              receiver: s.receiver.label,
              coefficient: (s.coefficient * 100).toFixed(1)
            }),
            children: /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-plot", style: { width: r, height: r }, children: M ? /* @__PURE__ */ e.jsx(
              ra,
              {
                title: "",
                preview: M,
                sourceLabel: s.source.label,
                receiverLabel: s.receiver.label,
                minimumSize: r,
                maximumSize: r,
                densitySmoothing: a
              }
            ) : w && !w.ready ? /* @__PURE__ */ e.jsx("span", { children: w.reason }) : /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" }) })
          }
        )
      ]
    }
  );
}
function la({
  stateKey: n,
  header: s,
  children: r
}) {
  const { t: a } = Be(), [l, c] = fe(
    `compensation.${n}.globalInspectorLayer`,
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
          s,
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: "gl-comp-layer-toggle",
              "aria-pressed": l === "compensated",
              "aria-label": a("Showing {shown} data; click to show {other} data", {
                shown: a(l === "original" ? "uncompensated" : "compensated"),
                other: a(l === "original" ? "compensated" : "uncompensated")
              }),
              title: a("Toggle every plot between uncompensated and compensated data without changing its frame"),
              onClick: () => c((d) => d === "original" ? "compensated" : "original"),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: "gl-comp-layer-toggle-track", "aria-hidden": "true", children: /* @__PURE__ */ e.jsx("i", {}) }),
                /* @__PURE__ */ e.jsx("span", { children: a(l === "original" ? "Uncompensated" : "Compensated") })
              ]
            }
          )
        ] }),
        r
      ]
    }
  );
}
const ca = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', as = 58 * Math.PI / 180, da = {
  relevant: "Matrix-linked / relevant",
  nonzero: "Non-zero coefficients",
  physical: "Physical CyTOF relationships",
  flagged: "Flagged for follow-up",
  all: "All included pairs"
}, ua = [
  { id: "evidence", label: "Evidence" },
  { id: "review", label: "Review queue" }
], _e = "", os = 2500, ls = 400, ha = 2500, cs = 15e3, ds = [2500, 5e3, 15e3, 5e4], ma = 24, us = 4, hs = 624, pa = Object.freeze({});
function ms(n) {
  if (!Number.isFinite(n)) return String(n);
  const s = n * 100;
  if (s === 0) return "0.0";
  const r = Math.abs(s), a = r >= 1 ? 1 : r >= 0.1 ? 2 : 3;
  return s.toFixed(a);
}
function Wt(n) {
  return n.replace(/(?: · (?:edited|revised))+$/u, "");
}
function vt(n, s) {
  const r = n.index(s), a = r === void 0 ? void 0 : n.channels[r], l = (a == null ? void 0 : a.pnn) ?? s, c = n.labelForKey(s), d = ((a == null ? void 0 : a.label) ?? "").trim() || ((a == null ? void 0 : a.marker) ?? "").trim(), f = d && d !== l ? `${d} (${l})` : l;
  return { key: s, pnn: l, label: c, combined: f };
}
function Gt(n, s) {
  const r = n.channels.find((a) => a.pnn === s);
  return vt(n, (r == null ? void 0 : r.key) ?? s);
}
function fa(n, s) {
  return n === "cytof-spillover" && s === "nnls" ? "CyTOF NNLS" : "Flow linear inverse";
}
function ga(n) {
  return n.replaceAll("-", " ");
}
function ei(n) {
  if (n.length === 0) return 0;
  n.sort((r, a) => r - a);
  const s = Math.floor(n.length / 2);
  return n.length % 2 === 0 ? (n[s - 1] + n[s]) / 2 : n[s];
}
function xa(n) {
  return Object.fromEntries(n.scientific.solverSettings.map(({ key: s, value: r }) => [s, r]));
}
function va(n, s) {
  const r = Object.freeze({ ...n.scientific.matrix, matrix: s }), a = xa(n);
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
function ps(n, s, r, a) {
  const l = n.scientific.matrix.sourceChannels.indexOf(s), c = n.scientific.matrix.receiverChannels.indexOf(r);
  if (l < 0 || c < 0)
    throw new Error("The selected coefficient is absent from the installed profile axes.");
  return Object.freeze(n.scientific.matrix.matrix.map(
    (d, f) => Object.freeze(d.map((v, p) => f === l && p === c ? a : v))
  ));
}
function ba(n, s, r) {
  var d;
  if (!n) return null;
  const a = n.scientific.matrix.sourceChannels.indexOf(s), l = n.scientific.matrix.receiverChannels.indexOf(r);
  if (a < 0 || l < 0) return null;
  const c = (d = n.scientific.matrix.matrix[a]) == null ? void 0 : d[l];
  return Number.isFinite(c) ? c : null;
}
function fs(n, s, r) {
  const a = Math.max(Math.abs(n), Math.abs(s), 1e-3);
  return Object.freeze(r === "cytof" ? { lower: 0, upper: Math.max(n + a, a * 2) } : { lower: n - a, upper: n + a });
}
function ya(n, s) {
  const r = (s - n) / 3;
  return Object.freeze([n, n + r, n + 2 * r, s]);
}
function ja(n, s) {
  return n.length === s.length && n.every((r, a) => {
    var l;
    return r.length === ((l = s[a]) == null ? void 0 : l.length) && r.every((c, d) => c === s[a][d]);
  });
}
function wa(n, s) {
  if (n.compensatedLayerStatus().state !== "ready" || s.length === 0 || n.fcs.nEvents === 0) return null;
  const a = s.flatMap((k) => {
    const w = n.channels.findIndex((M) => M.pnn === k);
    return w < 0 ? [] : [w];
  });
  if (a.length === 0) return null;
  const l = Math.min(2048, n.fcs.nEvents), c = [];
  let d = 0, f = 0, v = 0, p = "", C = -1;
  for (const k of a) {
    const w = n.originalColumnData(k), M = n.compensatedColumnData(k), A = [];
    for (let P = 0; P < l; P++) {
      const E = l === 1 ? 0 : Math.floor(P * (n.fcs.nEvents - 1) / (l - 1)), T = w[E], $ = M[E], N = Math.abs($ - T);
      A.push(N), c.push(N), N > Math.max(1e-6, Math.abs(T) * 1e-6) && d++, T < 0 && $ === 0 && v++, f = Math.max(f, N);
    }
    const I = ei(A);
    I > C && (C = I, p = vt(n, n.channels[k].key).combined);
  }
  return {
    previewEvents: l,
    comparedValues: c.length,
    changedValues: d,
    medianAbsoluteDelta: ei(c),
    maxAbsoluteDelta: f,
    zeroedNegativeValues: v,
    mostChangedChannel: p,
    mostChangedChannelMedianDelta: Math.max(0, C)
  };
}
function Ca(n, s) {
  return n.origin.type === "uploaded" ? n.origin.fileName : n.origin.type === "embedded-fcs" ? `${n.origin.fileName} · ${s("embedded FCS")}` : n.origin.type === "manual" ? s("set by hand, from an empty matrix") : `${n.origin.presetId} · ${s("bundled preset")} ${n.origin.presetVersion}`;
}
function Na(n) {
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
  }, r = dt(
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
function Sa({
  sample: n,
  sampleName: s = "sample.fcs",
  hostedCompensationMatrix: r = null,
  compensationOn: a,
  onApplyProfile: l,
  onRemoveProfile: c,
  existingHostAssays: d = [],
  onAdoptExistingAssay: f,
  onCancelApply: v,
  hasExistingGates: p = !1,
  applyStatus: C = null,
  installedProfile: k = null,
  applyTargetCount: w = 1,
  applyTargetEventCount: M,
  applyWorkerCount: A,
  applyWorkerLimit: I,
  onApplyWorkerCountChange: P,
  installedBaselineProfile: E = null,
  reviewPopulations: T = [],
  reviewPopulationMasks: $ = pa,
  onPreviewCompensationCandidate: N,
  onSolveCompensationSweep: F,
  onCancelCompensationSweep: R,
  onSuspendBackgroundWork: L,
  visible: O = !0,
  stateKey: _,
  densityColorPower: G = ni,
  channelLabelMode: Z = "marker",
  onDensityColorPowerChange: q = () => {
  }
}) {
  var Oi, Di;
  const { t: i } = Be(), V = n.compensatedLayerStatus(), $e = V.state === "missing" ? null : V.metadata, D = ($e == null ? void 0 : $e.runtimeIdentity) === "profile" ? $e : null, j = (k == null ? void 0 : k.profileId) === (D == null ? void 0 : D.profileId) ? k : null, ee = !D && n.instrument === "flow" ? n.spillover : null, me = (r == null ? void 0 : r.kind) === "flow-spillover" ? r : null, gn = S.useMemo(
    () => Na(r),
    [r]
  ), [qe, Ce] = fe(
    `compensation.${_}.selectedPair`,
    null
  ), [bt, Ie] = S.useState(null), [Bn, oi] = fe(
    `compensation.${_}.openDrawers`,
    { evidence: !1, review: !1 }
  ), [xn, li] = fe(
    "compensation.inspectorWidth",
    hs
  ), [ke, qn] = fe(
    `compensation.${_}.workspaceView`,
    "matrix"
  ), [Pe, Vn] = fe(
    `compensation.${_}.globalPairFilter`,
    "relevant"
  ), [Re, js] = fe(
    `compensation.${_}.globalLayout`,
    "compact"
  ), [ws, Cs] = fe(
    "compensation.globalPlotSize.v5",
    160
  ), [Ns, Ss] = fe(
    "compensation.densitySmoothing.v3",
    6
  ), [Ms, ks] = fe(
    "compensation.pointAlpha.v1",
    0.85
  ), [Es, As] = fe(
    "compensation.pointSize.v1",
    1
  ), [yt, Ts] = fe(
    "compensation.pairPreviewEventLimit.v1",
    cs
  ), [Fn, ci] = S.useState(""), [$n, jt] = S.useState(!1), [wt, di] = S.useState(null), [vn, Ct] = fe(
    `compensation.${_}.reviewPopulation`,
    "all"
  ), [Wn, Fs] = fe(
    `compensation.${_}.flaggedPairs`,
    []
  ), [Ve, $s] = fe(
    `compensation.${_}.evidenceMode`,
    "biological"
  ), [Is, Ps] = fe(
    `compensation.${_}.sweepBounds`,
    {}
  ), [Nt, St] = fe(
    `compensation.${_}.sweepWorkers`,
    2
  ), [Ee, ui] = S.useState(""), [Ne, Mt] = S.useState(""), [Rs, kt] = S.useState(0), [Y, Gn] = S.useState({}), [Ks, sn] = S.useState({}), [We, rn] = S.useState({ state: "idle" }), [Ls, Ye] = S.useState({}), [Os, an] = S.useState({}), [ye, bn] = S.useState(null), [Ds, In] = S.useState(null), [ue, yn] = S.useState(null), [hi, ve] = S.useState(null), [Hn, Et] = S.useState(""), [zs, mi] = S.useState(!1), [_s, pi] = S.useState(!1), Ae = S.useRef(0), jn = S.useRef(0), [fi, J] = S.useState(null), [gi, pe] = S.useState(!1), [X, Zn] = S.useState(
    () => gn.draft
  ), [Pn, on] = S.useState(
    () => {
      var m;
      const t = ((m = gn.draft) == null ? void 0 : m.matrix.receiverChannels) ?? [], o = /* @__PURE__ */ new Map();
      for (const h of n.channels) {
        const g = h.pnn.trim().normalize("NFC");
        o.set(g, (o.get(g) ?? 0) + 1);
      }
      return new Set(t.filter((h) => o.get(h) === 1));
    }
  ), [xi, Xe] = S.useState(
    () => gn.error
  ), [Se, Ge] = S.useState(!1), [Yn, vi] = S.useState(!1), [Xn, bi] = S.useState(
    () => {
      var t;
      return ((t = d[0]) == null ? void 0 : t.id) ?? "";
    }
  ), [At, Jn] = S.useState(!1), [Qn, be] = S.useState(null), [Us, Ke] = S.useState(!1), [Bs, He] = S.useState(null), Te = S.useRef(!1), yi = S.useRef(null), ji = S.useRef(null), wn = S.useRef(null), B = Us || C !== null, Je = Math.max(0, Math.floor(w)), qs = Math.max(
    0,
    Math.floor(M ?? n.fcs.nEvents)
  ), Qe = d.find(
    ({ id: t }) => t === Xn
  ) ?? d[0] ?? null;
  S.useEffect(() => {
    var t;
    Xn && d.some(({ id: o }) => o === Xn) || (bi(((t = d[0]) == null ? void 0 : t.id) ?? ""), Jn(!1));
  }, [d, Xn]);
  const re = C ?? (Qn ? {
    phase: "applying",
    profileName: Bs ?? (X == null ? void 0 : X.fileName) ?? "Compensation",
    fraction: Qn.fraction,
    processedEvents: Qn.processedEvents,
    totalEvents: Qn.totalEvents
  } : null);
  S.useEffect(() => {
    O || (jn.current++, Ae.current++, rn({ state: "idle" }), yn(null), bn(null), L == null || L());
  }, [L, O]);
  const Tt = S.useMemo(
    () => n.channels.map(({ pnn: t, columnIndex: o }) => ({ pnn: t, columnIndex: o })),
    [n]
  ), Le = S.useMemo(() => {
    if (!ee) return null;
    const t = ee.channels.map((h) => {
      const g = n.index(h);
      return g === void 0 ? null : n.channels[g].pnn;
    });
    if (t.some((h) => h === null))
      return {
        validation: null,
        error: "The embedded matrix could not be mapped back to exact FCS channel identities.",
        keyword: void 0
      };
    const o = dt({
      sourceChannels: t,
      receiverChannels: t,
      matrix: ee.matrix
    }, "flow-spillover"), m = ["$SPILLOVER", "$SPILL", "SPILL"].find((h) => typeof n.fcs.keywords[h] == "string");
    return {
      validation: o,
      error: o.ok ? null : `The embedded compensation matrix cannot be applied or edited. ${o.errors.map(({ message: h }) => h).join(" ")}`,
      keyword: m
    };
  }, [n, ee]), Q = vn === "all" ? null : T.find(({ id: t }) => t === vn) ?? null, he = Q ? $[Q.id] ?? null : null, ce = he ? (Q == null ? void 0 : Q.eventCount) ?? 0 : n.fcs.nEvents, et = yt === "all" ? "all" : ds.includes(Number(yt)) ? Number(yt) : cs, Rn = S.useMemo(
    () => mn(
      n.fcs.nEvents,
      et === "all" ? Math.max(1, n.fcs.nEvents) : et,
      he
    ),
    [et, ce, he, n]
  ), Kn = S.useMemo(
    () => mn(n.fcs.nEvents, 2048, he),
    [he, n]
  ), Ft = S.useMemo(
    () => mn(
      n.fcs.nEvents,
      ha,
      he
    ),
    [he, n]
  );
  S.useEffect(() => {
    vn !== "all" && !T.some(({ id: t }) => t === vn) && Ct("all");
  }, [vn, T, Ct]), S.useEffect(() => {
    Ae.current++, R == null || R(), Ye({}), an({}), bn(null), yn(null), ve(null);
  }, [vn, he, R]);
  const de = S.useMemo(() => X ? yr({
    kind: "cytof-spillover",
    matrix: X.matrix,
    sampleChannels: Tt,
    includedChannels: Array.from(Pn)
  }) : null, [X, Pn, Tt, Z]), u = S.useMemo(() => {
    if (ee) {
      const o = n.spilloverOrigin, m = o.kind === "external" ? o : null;
      return {
        sourceAxisKeys: ee.channels,
        receiverAxisKeys: ee.channels,
        sourceChannels: ee.channels.map((h) => vt(n, h)),
        receiverChannels: ee.channels.map((h) => vt(n, h)),
        matrix: ee.matrix,
        kind: "flow",
        title: me ? "SCE spillover matrix" : m ? `Compensation matrix from ${m.label}` : "Embedded compensation matrix",
        subtitle: "Source rows ↓ · Receiver columns → · values are spillover percentages",
        coefficientNote: m ? "This FCS carries no spillover matrix of its own; these coefficients came from the imported FlowJo workspace and are applied unchanged." + (m.droppedChannels.length ? ` ${m.droppedChannels.length} of its parameter(s) are not in this file (${m.droppedChannels.join(", ")}) and were left out, which changes the result for the channels they spill into.` : "") : "Applying the embedded matrix leaves its coefficients unchanged."
      };
    }
    if (!j || !D) return null;
    const t = j.scientific.kind === "cytof-spillover" ? Kr(j.scientific.matrix) : j.scientific.matrix;
    return t.matrix.length !== t.sourceChannels.length || t.matrix.some((o) => !o || o.length !== t.receiverChannels.length) ? null : {
      sourceAxisKeys: t.sourceChannels,
      receiverAxisKeys: t.receiverChannels,
      sourceChannels: t.sourceChannels.map((o) => Gt(n, o)),
      receiverChannels: t.receiverChannels.map((o) => Gt(n, o)),
      matrix: t.matrix,
      kind: j.scientific.kind === "cytof-spillover" ? "cytof" : "flow",
      title: j.scientific.kind === "cytof-spillover" ? "Uploaded spill matrix" : "Applied compensation matrix",
      subtitle: j.scientific.kind === "cytof-spillover" ? i("{sources} source rows ↓ · {receivers} receiver columns → · isotope-mass order", {
        sources: t.sourceChannels.length,
        receivers: t.receiverChannels.length
      }) : "Source rows ↓ · Receiver columns → · exact installed coefficients",
      coefficientNote: j.scientific.kind === "cytof-spillover" ? "This is the exact uploaded matrix. The NNLS solve uses its selected, matched channels; original measurements remain stored separately." : "This is the exact installed matrix. Original measurements remain stored separately."
    };
  }, [me, D, j, n, ee, i, Z]), se = (u == null ? void 0 : u.sourceChannels) ?? [], ae = (u == null ? void 0 : u.receiverChannels) ?? [];
  S.useEffect(() => {
    St((t) => Math.max(1, Math.min(us, Math.round(t) || 1)));
  }, [St]);
  const nt = bt ?? qe, b = S.useMemo(() => {
    if (!u || !nt) return null;
    const [t, o] = nt.split(_e), m = u.sourceAxisKeys.indexOf(t), h = u.receiverAxisKeys.indexOf(o);
    return m < 0 || h < 0 || u.sourceAxisKeys[m] === u.receiverAxisKeys[h] ? null : {
      pairKey: nt,
      sourceIndex: m,
      receiverIndex: h,
      source: se[m],
      receiver: ae[h],
      value: u.matrix[m][h],
      interaction: u.kind === "cytof" ? kn(
        u.sourceAxisKeys[m],
        u.receiverAxisKeys[h]
      ) : null
    };
  }, [nt, u, ae, se]);
  S.useEffect(() => {
    if (!b) {
      Et("");
      return;
    }
    const t = Y[b.pairKey];
    Et(ie((t ?? b.value) * 100, 6));
  }, [b == null ? void 0 : b.pairKey, b == null ? void 0 : b.value, Y]);
  const je = S.useMemo(() => b ? Bt(
    n,
    b.source.key,
    b.receiver.key,
    {
      eventMask: he,
      fixedEventIndices: Rn,
      eligibleEventCount: ce
    }
  ) : null, [a, V.state, Rn, ce, he, n, b]), Me = S.useMemo(() => {
    if (!u || V.state !== "ready")
      return { candidateCount: 0, screenedCount: 0, evaluableCount: 0, items: [] };
    const t = [];
    for (let g = 0; g < u.matrix.length; g++)
      for (let x = 0; x < u.matrix[g].length; x++) {
        const y = u.sourceAxisKeys[g], z = u.receiverAxisKeys[x];
        if (y === z) continue;
        const U = u.matrix[g][x];
        if (!Number.isFinite(U)) continue;
        const K = u.kind === "cytof" ? kn(y, z) : null, W = K !== null && K !== "self" && K !== "other";
        U === 0 && !W && Ve === "biological" || t.push({
          sourceIndex: g,
          receiverIndex: x,
          pairKey: `${y}${_e}${z}`,
          source: se[g],
          receiver: ae[x],
          coefficient: U,
          interaction: K,
          physicalPrior: W ? 1 : 0
        });
      }
    t.sort((g, x) => x.physicalPrior - g.physicalPrior || Math.abs(x.coefficient) - Math.abs(g.coefficient));
    const o = t.slice(0, 240), m = o.flatMap((g) => {
      const x = Bt(
        n,
        g.source.key,
        g.receiver.key,
        {
          eventMask: he,
          fixedEventIndices: Kn,
          eligibleEventCount: ce
        }
      );
      return x.ready ? [{ ...g, evidence: x.preview.evidence }] : [];
    }), h = Vr(
      m.map(({ coefficient: g, physicalPrior: x, evidence: y }) => ({ coefficient: g, physicalPrior: x, evidence: y })),
      u.kind,
      Ve
    ).map(({ index: g, relativePriority: x }) => ({ ...m[g], relativePriority: x }));
    return {
      candidateCount: t.length,
      screenedCount: o.length,
      evaluableCount: m.length,
      items: h.slice(0, 8)
    };
  }, [Rs, Ve, V.state, u, ae, Kn, ce, he, n, se]), oe = S.useMemo(() => new Set(
    j ? j.scientific.kind === "flow-spillover" ? j.scientific.matrix.receiverChannels : j.scientific.includedChannels : []
  ), [j]), le = S.useMemo(() => u ? Zr(
    n,
    Array.from(/* @__PURE__ */ new Set([
      ...u.sourceAxisKeys,
      ...u.receiverAxisKeys
    ])),
    {
      eventMask: he,
      fixedEventIndices: Ft,
      eligibleEventCount: ce
    }
  ) : null, [
    a,
    Ft,
    V.state,
    u,
    ce,
    he,
    n
  ]);
  S.useEffect(() => {
    if (!u || oe.size === 0) return;
    const t = oe.has(Ee) ? Ee : u.sourceAxisKeys.find((m) => oe.has(m)) ?? "", o = oe.has(Ne) && Ne !== t ? Ne : u.receiverAxisKeys.find((m) => m !== t && oe.has(m)) ?? "";
    t !== Ee && ui(t), o !== Ne && Mt(o);
  }, [oe, Ne, Ee, u]);
  const Cn = S.useMemo(() => new Set(Wn), [Wn]), $t = S.useMemo(() => {
    var m;
    if (!u) return [];
    const t = [], o = oe.size > 0;
    for (let h = 0; h < u.sourceAxisKeys.length; h++) {
      const g = u.sourceAxisKeys[h];
      if (!(o && !oe.has(g)))
        for (let x = 0; x < u.receiverAxisKeys.length; x++) {
          const y = u.receiverAxisKeys[x];
          if (g === y || o && !oe.has(y)) continue;
          const z = (m = u.matrix[h]) == null ? void 0 : m[x];
          if (!Number.isFinite(z)) continue;
          const U = se[h], K = ae[x];
          if (!U || !K || le != null && le.ready && (!le.dataset.channels.has(U.key) || !le.dataset.channels.has(K.key))) continue;
          const W = u.kind === "cytof" ? kn(g, y) : null, te = W !== null && W !== "self" && W !== "other";
          t.push({
            sourceIndex: h,
            receiverIndex: x,
            pairKey: `${g}${_e}${y}`,
            source: U,
            receiver: K,
            coefficient: z,
            interaction: W,
            physicalPrior: te ? 1 : 0
          });
        }
    }
    return t;
  }, [le, oe, u, ae, se]), Oe = S.useMemo(() => {
    const t = Fn.trim().toLocaleLowerCase();
    return $t.filter((o) => {
      const m = Math.abs(o.coefficient) > 1e-12, h = o.physicalPrior > 0;
      return Pe === "all" || Pe === "relevant" && (m || h) || Pe === "nonzero" && m || Pe === "physical" && h || Pe === "flagged" && Cn.has(o.pairKey) ? t ? `${o.source.combined} ${o.receiver.combined}`.toLocaleLowerCase().includes(t) : !0 : !1;
    });
  }, [Cn, $t, Pe, Fn]);
  S.useEffect(() => {
    var o;
    if (!wt || ke !== "global") return;
    const t = [...((o = wn.current) == null ? void 0 : o.querySelectorAll(".gl-comp-global-tile")) ?? []].find((m) => m.dataset.pairKey === wt);
    t && (t.scrollIntoView({ block: "center", inline: "center" }), di(null));
  }, [$n, Re, wt, Oe, ke]);
  const It = S.useMemo(() => {
    if (Re === "compact") return [];
    const t = /* @__PURE__ */ new Map();
    for (const o of Oe) {
      const m = Re === "source" ? o.source : o.receiver, h = t.get(m.key);
      h ? h.pairs.push(o) : t.set(m.key, { channel: m, pairs: [o] });
    }
    return [...t.values()];
  }, [Re, Oe]), wi = S.useMemo(
    () => Re === "compact" ? Oe : It.flatMap((t) => t.pairs),
    [It, Re, Oe]
  ), Ci = `${i(da[Pe])}${Fn.trim() ? i(" · search “{query}”", { query: Fn.trim() }) : ""}`, Pt = Math.max(120, Math.min(220, Math.round(ws) || 120)), en = Math.max(1, Math.min(10, Math.round(Ns) || 6)), tt = Math.max(0.1, Math.min(1, Number(Ms) || 0.85)), it = Math.max(0.3, Math.min(3, Number(Es) || 1)), ne = S.useMemo(() => !j || !u || V.state !== "ready" ? [] : Wn.flatMap((t) => {
    const [o, m] = t.split(_e), h = u.sourceAxisKeys.indexOf(o), g = u.receiverAxisKeys.indexOf(m);
    if (h < 0 || g < 0 || o === m || !oe.has(o) || !oe.has(m)) return [];
    const x = Bt(
      n,
      se[h].key,
      ae[g].key,
      {
        eventMask: he,
        fixedEventIndices: Kn,
        eligibleEventCount: ce
      }
    );
    if (!x.ready) return [];
    const y = Me.items.find((z) => z.pairKey === t);
    return [{
      sourceIndex: h,
      receiverIndex: g,
      pairKey: t,
      source: se[h],
      receiver: ae[g],
      coefficient: u.matrix[h][g],
      interaction: u.kind === "cytof" ? kn(o, m) : null,
      physicalPrior: u.kind === "cytof" && kn(o, m) !== "other" ? 1 : 0,
      evidence: x.preview.evidence,
      relativePriority: (y == null ? void 0 : y.relativePriority) ?? 0
    }];
  }), [Wn, oe, V.state, u, j, ae, Me.items, Kn, ce, he, n, se]), De = ne, Ni = S.useMemo(() => {
    if (!j) return 0.01;
    const t = [];
    for (let o = 0; o < j.scientific.matrix.matrix.length; o++) {
      const m = j.scientific.matrix.sourceChannels[o];
      for (let h = 0; h < j.scientific.matrix.matrix[o].length; h++) {
        if (m === j.scientific.matrix.receiverChannels[h]) continue;
        const g = Math.abs(j.scientific.matrix.matrix[o][h]);
        Number.isFinite(g) && g > 1e-12 && t.push(g);
      }
    }
    return t.length > 0 ? ei(t) : 0.01;
  }, [j]), Rt = (t, o) => {
    const m = Is[t];
    if (m) return m;
    const h = fs(o, Ni, (u == null ? void 0 : u.kind) ?? "flow");
    return {
      lowerPercent: ie(h.lower * 100, 5),
      upperPercent: ie(h.upper * 100, 5)
    };
  }, Ln = (t, o) => {
    const m = Rt(t, o), h = Number(m.lowerPercent) / 100, g = Number(m.upperPercent) / 100;
    return !Number.isFinite(h) || !Number.isFinite(g) ? { lower: h, upper: g, error: "Enter finite lower and upper sweep bounds." } : (u == null ? void 0 : u.kind) === "cytof" && h < 0 ? { lower: h, upper: g, error: "CyTOF NNLS sweep bounds cannot be negative." } : g > h ? { lower: h, upper: g, error: null } : { lower: h, upper: g, error: "The upper sweep bound must be greater than the lower bound." };
  }, st = (t, o, m, h) => {
    Ps((g) => ({
      ...g,
      [t]: {
        ...g[t] ?? (() => {
          const x = fs(o, Ni, (u == null ? void 0 : u.kind) ?? "flow");
          return {
            lowerPercent: ie(x.lower * 100, 5),
            upperPercent: ie(x.upper * 100, 5)
          };
        })(),
        [m]: h
      }
    })), Ye((g) => {
      if (!(t in g)) return g;
      const x = { ...g };
      return delete x[t], x;
    }), an((g) => {
      if (!(t in g)) return g;
      const x = { ...g };
      return delete x[t], x;
    });
  }, On = (t, o) => {
    Fs((m) => o ? m.includes(t) ? m : [...m, t] : m.filter((h) => h !== t)), o ? (Ce(t), In(t)) : (Ye((m) => {
      if (!(t in m)) return m;
      const h = { ...m };
      return delete h[t], h;
    }), an((m) => {
      if (!(t in m)) return m;
      const h = { ...m };
      return delete h[t], h;
    }));
  }, Vs = () => {
    if (!u || !Ee || !Ne || Ee === Ne) return;
    if (!oe.has(Ee) || !oe.has(Ne)) {
      ve("Both channels must be included in the installed compensation solve.");
      return;
    }
    const t = `${Ee}${_e}${Ne}`;
    On(t, !0), ve(null);
  }, Kt = De.reduce((t, o) => t + (Ln(o.pairKey, o.coefficient).error ? 1 : 0), 0), Nn = S.useMemo(() => {
    if (!j) return null;
    const t = j.scientific.matrix.matrix.map((o) => Array.from(o));
    for (const [o, m] of Object.entries(Y)) {
      const [h, g] = o.split(_e), x = j.scientific.matrix.sourceChannels.indexOf(h), y = j.scientific.matrix.receiverChannels.indexOf(g);
      x >= 0 && y >= 0 && (t[x][y] = m);
    }
    return Object.freeze(t.map((o) => Object.freeze(o)));
  }, [j, Y]);
  S.useEffect(() => {
    const t = Object.keys(Y).length;
    if (!O || t === 0 || !j || j.scientific.kind !== "flow-spillover" || V.state !== "ready" || !Nn || !b || !N) {
      jn.current++, rn({ state: "idle" });
      return;
    }
    const o = Rn;
    if (o.length === 0) {
      rn({
        state: "error",
        pairKey: b.pairKey,
        message: i("The selected review population contains no events.")
      });
      return;
    }
    const m = ++jn.current, h = b.pairKey;
    rn((x) => ({
      state: "updating",
      pairKey: h,
      ...(x.state === "ready" || x.state === "updating") && x.pairKey === h && x.preview ? { preview: x.preview } : {}
    }));
    const g = window.setTimeout(() => {
      N(
        j,
        o,
        Nn
      ).then((x) => {
        if (jn.current !== m) return;
        const y = x.sourceChannels.indexOf(b.source.pnn), z = x.sourceChannels.indexOf(b.receiver.pnn);
        if (y < 0 || z < 0)
          throw new Error(i("The preview result did not contain the selected flow channels."));
        const U = qt(
          n,
          b.source.pnn,
          b.receiver.pnn,
          o,
          x.candidateColumns[y],
          x.candidateColumns[z],
          { totalEvents: ce }
        );
        if (!U.ready) throw new Error(U.reason);
        rn({
          state: "ready",
          pairKey: h,
          preview: U.preview
        });
      }).catch((x) => {
        if (jn.current !== m) return;
        const y = x instanceof Error ? x.message : String(x);
        /cancel|supersed|stale/i.test(y) || rn({ state: "error", pairKey: h, message: y });
      });
    }, 90);
    return () => window.clearTimeout(g);
  }, [
    V.state,
    N,
    j,
    Rn,
    ce,
    n,
    n.dataRevision,
    n.displayTransformContextKey,
    n.layerRevision,
    b,
    Y,
    i,
    O,
    Nn
  ]);
  const Ws = S.useMemo(() => !u || Object.keys(Y).length === 0 ? null : {
    sourceChannels: u.sourceAxisKeys,
    receiverChannels: u.receiverAxisKeys,
    matrix: u.matrix.map(
      (t, o) => t.map((m, h) => {
        const g = `${u.sourceAxisKeys[o]}${_e}${u.receiverAxisKeys[h]}`;
        return Y[g] ?? m;
      })
    )
  }, [u, Y]), Si = S.useMemo(() => {
    if (!u) return [];
    const t = [];
    for (let o = 0; o < u.matrix.length; o++)
      for (let m = 0; m < u.matrix[o].length; m++) {
        const h = u.matrix[o][m];
        u.sourceAxisKeys[o] === u.receiverAxisKeys[m] || !Number.isFinite(h) || h <= 1 || t.push(`${se[o].combined} → ${ae[m].combined}`);
      }
    return t;
  }, [u, ae, se]), Lt = S.useMemo(() => {
    if (!u) return [];
    const t = [];
    for (let o = 0; o < u.matrix.length; o++)
      for (let m = 0; m < u.matrix[o].length; m++) {
        const h = u.matrix[o][m], g = u.sourceAxisKeys[o] === u.receiverAxisKeys[m], x = `${se[o].combined} → ${ae[m].combined}`;
        Number.isFinite(h) ? g && Math.abs(h - 1) > 1e-8 ? t.push(`${se[o].combined}: diagonal is ${tn(h)}, not 100%`) : !g && h < 0 ? t.push(`${x}: negative coefficient (${tn(h)})`) : !g && h > 1 && t.push(`${x}: coefficient above 100%`) : t.push(`${x}: non-finite coefficient (${String(h)})`);
      }
    return t;
  }, [u, ae, se]), Mi = S.useMemo(
    () => (u == null ? void 0 : u.matrix.some((t) => t.some((o) => !Number.isFinite(o)))) ?? !1,
    [u]
  ), Fe = S.useMemo(
    () => D && V.state === "ready" ? wa(n, D.includedPnns) : null,
    [V.state, D, n]
  ), rt = S.useMemo(() => {
    const t = [...Lt];
    return V.state === "stale" && t.push(...V.reasons.map((o) => `Profile unavailable: ${ga(o)}`)), t;
  }, [V, Lt]), ki = D ? (j == null ? void 0 : j.name) ?? "Installed compensation profile" : ee ? me ? "SCE spillover matrix" : "Embedded FCS matrix" : "No compatible matrix", Gs = D ? fa(D.kind, D.method) : ee ? "Flow linear inverse" : "Not configured", at = i(Gs), Ot = (D == null ? void 0 : D.includedPnns.length) ?? (ee == null ? void 0 : ee.channels.length) ?? 0, ot = (j == null ? void 0 : j.name) ?? (D == null ? void 0 : D.profileId) ?? ki, Ei = Wt(ot), Hs = Ei !== ot || (j == null ? void 0 : j.recordType) === "revision" ? `${Ei} · ${i("revised")}` : ot, Zs = ee !== null && !Mi || D !== null && V.state === "ready", Ai = S.useMemo(() => {
    if (!u) return 0;
    let t = 0;
    for (let o = 0; o < u.matrix.length; o++)
      for (let m = 0; m < u.matrix[o].length; m++) {
        if (u.sourceAxisKeys[o] === u.receiverAxisKeys[m]) continue;
        const h = u.matrix[o][m];
        Number.isFinite(h) && (t = Math.max(t, Math.abs(h)));
      }
    return t;
  }, [u]), Sn = !!((j == null ? void 0 : j.scientific.kind) === "flow-spillover" && V.state === "ready" && u && Math.max(u.sourceAxisKeys.length, u.receiverAxisKeys.length) <= ma), ln = u ? Sn ? Math.max(42, Math.min(54, Math.floor(960 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : Math.max(13, Math.min(38, Math.floor(760 / Math.max(
    u.sourceAxisKeys.length,
    u.receiverAxisKeys.length
  )))) : 13, Dn = S.useMemo(() => {
    const t = Sn ? 9.5 : 8, o = [...se, ...ae].map((K) => K.combined), m = typeof document > "u" ? null : document.createElement("canvas").getContext("2d");
    m && (m.font = `${t}px ${ca}`);
    const h = (K) => m ? m.measureText(K).width : K.length * t * 0.55, g = o.reduce((K, W) => Math.max(K, h(W)), 0), x = Math.min(320, Math.max(94, Math.ceil(g) + 12)), y = Math.min(260, Math.max(82, Math.ceil(g) + 6)), z = Math.max(88, Math.ceil(y * Math.sin(as) + 12)), U = Math.max(0, Math.ceil(y * Math.cos(as) - ln / 2));
    return { rowLabelWidth: x, columnLabelWidth: y, columnLabelHeight: z, overhang: U };
  }, [Sn, ln, ae, se]);
  S.useEffect(() => {
    Gn({}), sn({}), rn({ state: "idle" }), jn.current++;
  }, [j == null ? void 0 : j.profileId]), S.useEffect(() => {
    (u == null ? void 0 : u.kind) === "flow" && Pe === "physical" && Vn("relevant");
  }, [Pe, u == null ? void 0 : u.kind, Vn]);
  const Ys = (t) => {
    oi((o) => ({ ...o, [t]: !o[t] }));
  }, Ti = (t) => {
    var h;
    const o = ((h = wn.current) == null ? void 0 : h.getBoundingClientRect().width) ?? 1100, m = Math.max(360, Math.min(900, o - 440 - 8));
    return Math.max(360, Math.min(m, Math.round(t)));
  }, Xs = (t) => {
    var g;
    if (t.button !== 0) return;
    t.preventDefault();
    const o = t.currentTarget;
    (g = o.setPointerCapture) == null || g.call(o, t.pointerId);
    const m = (x) => {
      var z;
      const y = (z = wn.current) == null ? void 0 : z.getBoundingClientRect();
      y && li(Ti(y.right - x.clientX));
    }, h = () => {
      var x;
      window.removeEventListener("pointermove", m), window.removeEventListener("pointerup", h), window.removeEventListener("pointercancel", h), (x = o.releasePointerCapture) == null || x.call(o, t.pointerId);
    };
    window.addEventListener("pointermove", m), window.addEventListener("pointerup", h), window.addEventListener("pointercancel", h);
  }, Js = (t) => {
    let o = null;
    t.key === "ArrowLeft" ? o = xn + 40 : t.key === "ArrowRight" ? o = xn - 40 : t.key === "Home" && (o = hs), o !== null && (t.preventDefault(), li(Ti(o)));
  }, Qs = async (t) => {
    var m;
    const o = (m = t.currentTarget.files) == null ? void 0 : m[0];
    t.currentTarget.value = "", o && await $i(o);
  }, Fi = () => void Cr(yi.current, { "text/csv": [".csv", ".tsv", ".txt"] }, "CyTOF spillover matrix").then((t) => {
    t != null && t[0] && $i(t[0]);
  }), $i = async (t) => {
    Xe(null), J(null), pe(!1), be(null), Ge(!1);
    try {
      const o = Rr(await t.text()), m = dt(
        o.input,
        "cytof-spillover"
      );
      if (!m.ok)
        throw new Error(m.errors.map(({ message: x }) => x).join(" "));
      const h = /* @__PURE__ */ new Map();
      for (const { pnn: x } of Tt) {
        const y = x.trim().normalize("NFC");
        h.set(y, (h.get(y) ?? 0) + 1);
      }
      const g = m.value.receiverChannels.filter(
        (x) => h.get(x) === 1
      );
      Zn({
        fileName: t.name,
        source: "file",
        parsed: o,
        matrix: m.value,
        validationWarnings: m.warnings
      }), on(new Set(g));
    } catch (o) {
      Zn(null), on(/* @__PURE__ */ new Set()), Xe(o instanceof Error ? o.message : String(o));
    }
  }, er = (t, o) => {
    on((m) => {
      const h = new Set(m);
      return o ? h.add(t) : h.delete(t), h;
    });
  }, Ii = async () => {
    var m, h;
    if (!X)
      throw new Error(i("Choose a CyTOF spillover matrix first."));
    const t = ((h = (m = globalThis.crypto) == null ? void 0 : m.randomUUID) == null ? void 0 : h.call(m)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, o = X.fileName.replace(/\.(?:csv|tsv|txt)$/i, "") || "CyTOF compensation";
    return Ut(
      {
        kind: "cytof-spillover",
        method: "nnls",
        solverVersion: Mr,
        solverSettings: kr,
        matrix: X.matrix,
        includedChannels: Array.from(Pn)
      },
      {
        profileId: `cytof-${t}`,
        name: o,
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
  }, nr = async () => {
    if (!(Te.current || B || !X || !(de != null && de.canApply) || !l)) {
      if (p && !Se) {
        Xe(
          i("Confirm that existing gate memberships will be recomputed in compensated coordinates before applying.")
        );
        return;
      }
      Xe(null), J(null), be(null), Te.current = !0, Ke(!0), He(X.fileName);
      try {
        const t = await Ii();
        await l(t, be), J(i("Applied {name} to {channels} channels across {files} checked FCS files. Original measurements remain available.", {
          name: t.name,
          channels: Pn.size,
          files: Je
        })), Zn(null), on(/* @__PURE__ */ new Set()), Ge(!1), be(null);
      } catch (t) {
        const o = t instanceof Error ? t.message : String(t);
        /cancel/i.test(o) ? J(i("CyTOF compensation was cancelled; the previous assay was left unchanged.")) : Xe(o);
      } finally {
        Te.current = !1, Ke(!1), He(null);
      }
    }
  }, tr = async () => {
    if (!(Te.current || B || !X || !(de != null && de.canApply) || !Qe || !f || !At)) {
      if (p && !Se) {
        Xe(
          i("Confirm that existing gate memberships will be recomputed in compensated coordinates before adopting the assay.")
        );
        return;
      }
      Xe(null), J(null), be(null), Te.current = !0, Ke(!0), He(Qe.label);
      try {
        const t = await Ii();
        await f(
          t,
          Qe,
          be
        ), J(i("Using existing SCE assay {assay} with {matrix}. No assay values were recomputed.", {
          assay: Qe.label,
          matrix: t.name
        })), Zn(null), on(/* @__PURE__ */ new Set()), Ge(!1), Jn(!1), be(null);
      } catch (t) {
        Xe(t instanceof Error ? t.message : String(t));
      } finally {
        Te.current = !1, Ke(!1), He(null);
      }
    }
  }, ir = async () => {
    var h, g;
    if (Te.current || B || !l) return;
    if (p && !Se) {
      pe(!0), J(
        i("Confirm that existing gate memberships will be recomputed in compensated coordinates before starting a matrix.")
      );
      return;
    }
    const t = n.channels.map((x, y) => ({ pnn: x.pnn, index: y })).filter(({ index: x }) => n.isFluorChannel(x) && !n.isImagingFeatureChannel(x)).map(({ pnn: x }) => x);
    if (t.length < 2) {
      pe(!0), J(i("An empty matrix needs at least two fluorescence channels."));
      return;
    }
    const o = dt({
      sourceChannels: t,
      receiverChannels: t,
      matrix: t.map((x, y) => t.map((z, U) => y === U ? 1 : 0))
    }, "flow-spillover");
    if (!o.ok) {
      pe(!0), J(o.errors.map(({ message: x }) => x).join(" "));
      return;
    }
    const m = `${s.replace(/\.fcs$/i, "") || "Flow"} manual matrix`;
    J(null), pe(!1), be(null), Te.current = !0, Ke(!0), He(m);
    try {
      const x = ((g = (h = globalThis.crypto) == null ? void 0 : h.randomUUID) == null ? void 0 : g.call(h)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, y = await Ut(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: qi,
          solverSettings: Bi,
          matrix: o.value
        },
        {
          profileId: `flow-manual-${x}`,
          name: m,
          createdAt: /* @__PURE__ */ new Date(),
          origin: { type: "manual", startedAs: "identity" },
          provenance: {
            sourceDescription: "Identity matrix over the file's fluorescence channels, to be set by hand in GateLab",
            estimationMethod: "Manual"
          }
        }
      );
      await l(y, be), Ge(!1), J(i("Manual matrix editing is ready: every spillover starts at zero. Select a pair and set its coefficient."));
    } catch (x) {
      pe(!0), J(x instanceof Error ? x.message : String(x));
    } finally {
      Te.current = !1, Ke(!1);
    }
  }, sr = async () => {
    if (!(!c || B || Yn)) {
      if (p && !Se) {
        pe(!0), J(
          i("Confirm that existing gate memberships will be recomputed in original coordinates before removing the matrix.")
        );
        return;
      }
      vi(!0);
      try {
        await c(), pe(!1), J(i("The matrix was removed. The original assay is active and every file reads its stored values."));
      } catch (t) {
        pe(!0), J(t instanceof Error ? t.message : String(t));
      } finally {
        vi(!1);
      }
    }
  }, rr = async () => {
    var o, m, h;
    if (Te.current || B || !ee || !((o = Le == null ? void 0 : Le.validation) != null && o.ok) || !l) return;
    if (p && !Se) {
      pe(!0), J(
        i("Confirm that existing gate memberships will be recomputed in compensated coordinates before enabling matrix editing.")
      );
      return;
    }
    const t = (me == null ? void 0 : me.name) || `${s.replace(/\.fcs$/i, "") || "Flow"} spillover`;
    J(null), pe(!1), be(null), Te.current = !0, Ke(!0), He(t);
    try {
      const g = ((h = (m = globalThis.crypto) == null ? void 0 : m.randomUUID) == null ? void 0 : h.call(m)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`, x = await Ut(
        {
          kind: "flow-spillover",
          method: "matrix-inverse",
          solverVersion: qi,
          solverSettings: Bi,
          matrix: Le.validation.value
        },
        {
          profileId: `flow-${g}`,
          name: t,
          createdAt: /* @__PURE__ */ new Date(),
          origin: {
            ...me ? {
              type: "uploaded",
              fileName: me.name,
              format: "csv",
              sourceColumnHeader: "source"
            } : {
              type: "embedded-fcs",
              fileName: s,
              ...Le.keyword ? { keyword: Le.keyword } : {}
            }
          },
          provenance: {
            sourceDescription: me ? "Flow spillover matrix from metadata(sce)$spillover_matrix" : "Spillover matrix embedded in the source FCS file",
            estimationMethod: me ? "Imported from SCE metadata; coefficients preserved exactly" : "Imported from FCS; coefficients preserved exactly"
          }
        }
      );
      await l(x, be), Ge(!1), J(i(me ? "Flow matrix editing is ready. The exact hosted matrix is retained as the baseline, and Original measurements remain available." : "Flow matrix editing is ready. The exact embedded matrix is retained as the baseline, and Original measurements remain available."));
    } catch (g) {
      pe(!0), J(g instanceof Error ? g.message : String(g));
    } finally {
      Te.current = !1, Ke(!1), He(null), be(null);
    }
  }, Pi = (t, o) => {
    var g, x;
    const m = se[t], h = ae[o];
    !u || !m || !h || u.sourceAxisKeys[t] === u.receiverAxisKeys[o] || (Ce(`${u.sourceAxisKeys[t]}${_e}${u.receiverAxisKeys[o]}`), (x = (g = ji.current) == null ? void 0 : g.querySelector(
      `button[data-source-index="${t}"][data-receiver-index="${o}"]`
    )) == null || x.focus());
  }, ar = (t, o, m) => {
    if (!u) return;
    const h = u.sourceAxisKeys.length, g = u.receiverAxisKeys.length;
    let x = o, y = m;
    const z = (K, W) => {
      let te = K + W;
      for (; te >= 0 && te < g; ) {
        if (u.sourceAxisKeys[o] !== u.receiverAxisKeys[te]) return te;
        te += W;
      }
      return K;
    }, U = (K, W) => {
      let te = K + W;
      for (; te >= 0 && te < h; ) {
        if (u.sourceAxisKeys[te] !== u.receiverAxisKeys[m]) return te;
        te += W;
      }
      return K;
    };
    switch (t.key) {
      case "ArrowLeft":
        y = z(m, -1);
        break;
      case "ArrowRight":
        y = z(m, 1);
        break;
      case "ArrowUp":
        x = U(o, -1);
        break;
      case "ArrowDown":
        x = U(o, 1);
        break;
      case "Home": {
        y = u.sourceAxisKeys[o] === u.receiverAxisKeys[0] ? 1 : 0;
        break;
      }
      case "End": {
        const K = g - 1;
        y = u.sourceAxisKeys[o] === u.receiverAxisKeys[K] ? K - 1 : K;
        break;
      }
      default:
        return;
    }
    t.preventDefault(), Pi(x, y);
  }, zn = (t, o) => {
    if (!j || !Number.isFinite(o)) return;
    const [m, h] = t.split(_e), g = j.scientific.matrix.sourceChannels.indexOf(m), x = j.scientific.matrix.receiverChannels.indexOf(h);
    if (g < 0 || x < 0) return;
    if (j.scientific.kind === "cytof-spillover" && o < 0) {
      pe(!0), J(i("CyTOF NNLS spill coefficients cannot be negative."));
      return;
    }
    const y = j.scientific.matrix.matrix[g][x];
    Gn((z) => {
      const U = { ...z };
      return o === y ? delete U[t] : U[t] = o, U;
    }), pe(!1), J(i("Staged {source} → {receiver} at {value}%. Apply the revised matrix to recompute the assay.", {
      source: m,
      receiver: h,
      value: (o * 100).toFixed(2)
    }));
  }, Ri = (t, o, m, h) => {
    const g = m[0];
    if (!g) return null;
    const x = g.sourceChannels.indexOf(t.source.pnn), y = g.sourceChannels.indexOf(t.receiver.pnn);
    if (x < 0 || y < 0) return null;
    const z = qt(
      n,
      t.source.pnn,
      t.receiver.pnn,
      h,
      g.currentColumns[x],
      g.currentColumns[y],
      { totalEvents: ce }
    );
    if (!z.ready) return null;
    const U = [{
      value: t.coefficient,
      isCurrent: !0,
      preview: z.preview
    }];
    return m.forEach((K, W) => {
      const te = K.sourceChannels.indexOf(t.source.pnn), ze = K.sourceChannels.indexOf(t.receiver.pnn);
      if (te < 0 || ze < 0) return;
      const we = qt(
        n,
        t.source.pnn,
        t.receiver.pnn,
        h,
        K.candidateColumns[te],
        K.candidateColumns[ze],
        {
          totalEvents: ce,
          xRange: z.preview.xRange,
          yRange: z.preview.yRange
        }
      );
      we.ready && U.push({
        value: o[W],
        isCurrent: !1,
        preview: we.preview
      });
    }), U.sort((K, W) => K.value - W.value || Number(W.isCurrent) - Number(K.isCurrent)), { pairKey: t.pairKey, values: Object.freeze(U) };
  }, or = async (t) => {
    if (!j || !u || !F || B || ue || ye) return;
    const o = Ln(t.pairKey, t.coefficient);
    if (o.error) {
      ve(o.error);
      return;
    }
    const m = mn(
      n.fcs.nEvents,
      ls,
      he
    );
    if (m.length === 0) {
      ve(i("The selected review population contains no events."));
      return;
    }
    const h = ++Ae.current, g = [o.lower, o.upper];
    bn(t.pairKey), ve(null);
    try {
      const x = await F(
        j,
        m,
        g.map((z) => ps(
          j,
          u.sourceAxisKeys[t.sourceIndex],
          u.receiverAxisKeys[t.receiverIndex],
          z
        )),
        void 0,
        1
      );
      if (Ae.current !== h) return;
      const y = Ri(t, g, x, m);
      if (!y) throw new Error(i("The fast bounds preview could not be built for this pair."));
      an((z) => ({ ...z, [t.pairKey]: y }));
    } catch (x) {
      if (Ae.current !== h) return;
      const y = x instanceof Error ? x.message : String(x);
      ve(/cancel/i.test(y) ? i("Fast bounds preview cancelled.") : y);
    } finally {
      Ae.current === h && bn(null);
    }
  }, lr = async () => {
    var h;
    if (!j || !F || De.length === 0 || B || ue !== null || ye !== null) return;
    if (Kt > 0) {
      ve(i("Fix the sweep bounds for {count} flagged pairs before running.", { count: Kt }));
      return;
    }
    const t = mn(
      n.fcs.nEvents,
      os,
      he
    );
    if (t.length === 0) {
      ve(i("The selected review population contains no events."));
      return;
    }
    const o = ++Ae.current, m = De.flatMap((g) => {
      const x = Ln(g.pairKey, g.coefficient);
      return ya(x.lower, x.upper).map((y) => ({
        pair: g,
        value: y,
        matrix: ps(
          j,
          u.sourceAxisKeys[g.sourceIndex],
          u.receiverAxisKeys[g.receiverIndex],
          y
        )
      }));
    });
    ve(null), Ye({}), yn({ completed: 0, total: m.length });
    try {
      const g = await F(
        j,
        t,
        m.map(({ matrix: y }) => y),
        (y, z) => {
          Ae.current === o && yn({ completed: y, total: z });
        },
        Nt
      );
      if (Ae.current !== o) return;
      if (g.length !== m.length)
        throw new Error(i("The compensation worker returned an incomplete coefficient sweep."));
      const x = {};
      for (const y of De) {
        const z = m.flatMap((K, W) => K.pair.pairKey === y.pairKey ? [W] : []), U = Ri(
          y,
          z.map((K) => m[K].value),
          z.map((K) => g[K]),
          t
        );
        U && (x[y.pairKey] = U);
      }
      Ye(x), In(((h = De[0]) == null ? void 0 : h.pairKey) ?? null);
    } catch (g) {
      if (Ae.current !== o) return;
      const x = g instanceof Error ? g.message : String(g);
      ve(/cancel/i.test(x) ? i("Exact coefficient sweep cancelled.") : x);
    } finally {
      Ae.current === o && yn(null);
    }
  }, cr = () => {
    Ae.current++, R == null || R(), yn(null), bn(null), ve(i("Exact coefficient sweep cancelled."));
  }, dr = async () => {
    var o, m;
    if (!j || !Nn || !l || Object.keys(Y).length === 0) return;
    const t = `${Wt(j.name)} · edited`;
    J(null), pe(!1), Ke(!0), He(t), be(null);
    try {
      const g = {
        profileId: `comp-edit-${((m = (o = globalThis.crypto) == null ? void 0 : o.randomUUID) == null ? void 0 : m.call(o)) ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`,
        name: t,
        createdAt: /* @__PURE__ */ new Date(),
        note: `Edited ${Object.keys(Y).length} compensation coefficient${Object.keys(Y).length === 1 ? "" : "s"} in GateLab.`
      }, x = (E == null ? void 0 : E.recordType) === "baseline" && ja(Nn, E.scientific.matrix.matrix) ? await Nr(j, E, g) : await Sr(
        j,
        va(j, Nn),
        g
      );
      await l(x, be), Gn({}), sn({}), Ye({}), an({}), bn(null), ve(null), kt((y) => y + 1), ne.length > 0 && (qn("attention"), Ce(ne[0].pairKey), In(ne[0].pairKey)), J(i("Applied revised matrix for {name}. Original measurements and the complete compensation revision history remain available.{flagged}", {
        name: Wt(x.name),
        flagged: ne.length > 0 ? i(
          ne.length === 1 ? " Retained {count} flagged pair for post-correction review." : " Retained {count} flagged pairs for post-correction review.",
          { count: ne.length }
        ) : ""
      }));
    } catch (h) {
      pe(!0), J(h instanceof Error ? h.message : String(h));
    } finally {
      Ke(!1), He(null), be(null);
    }
  }, Ki = (t) => {
    if (ne.length === 0) return;
    const o = ne.findIndex(({ pairKey: g }) => g === qe), m = o < 0 ? t > 0 ? 0 : ne.length - 1 : (o + t + ne.length) % ne.length, h = ne[m];
    Ie(null), Ce(h.pairKey), In(h.pairKey);
  }, Dt = () => /* @__PURE__ */ e.jsx(
    "div",
    {
      className: "gl-comp-inspector-resize",
      role: "separator",
      "aria-label": i("Resize compensation inspector"),
      "aria-orientation": "vertical",
      "aria-valuemin": 360,
      "aria-valuemax": 900,
      "aria-valuenow": xn,
      tabIndex: 0,
      title: i("Drag to resize the coefficient inspector; use Left/Right arrow keys for fine control"),
      onPointerDown: Xs,
      onKeyDown: Js,
      children: /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true" })
    }
  ), ur = (t) => {
    Ie(null), Ce(t), jt(!0), $t.some((o) => o.pairKey === t) && (Oe.some((o) => o.pairKey === t) || (Vn("all"), ci("")), di(t));
  }, zt = (t, o = !1) => {
    const m = b ? Cn.has(b.pairKey) : !1, h = b ? ne.find(({ pairKey: H }) => H === b.pairKey) ?? null : null, g = b ? Rt(b.pairKey, b.value) : null, x = b ? Ln(b.pairKey, b.value) : null, y = b ? Os[b.pairKey] : null, z = b ? u.sourceAxisKeys[b.sourceIndex] : "", U = b ? u.receiverAxisKeys[b.receiverIndex] : "", K = b != null && b.interaction && b.interaction !== "self" && b.interaction !== "other" ? 1 : 0, W = b && (je != null && je.ready) ? Xt({
      coefficient: b.value,
      physicalPrior: K,
      evidence: je.preview.evidence
    }, u.kind, Ve) : null, te = b ? ba(E, z, U) : null, ze = (b == null ? void 0 : b.value) ?? null, we = b ? Y[b.pairKey] : void 0, Mn = !!(b && (j == null ? void 0 : j.scientific.kind) === "flow-spillover" && N && Object.keys(Y).length > 0), Ze = We.state !== "idle" && We.state !== "error" && We.pairKey === (b == null ? void 0 : b.pairKey) ? We.preview : null, cn = Ze ?? (je != null && je.ready ? je.preview : null), dn = [];
    te !== null && ze !== null && ((j == null ? void 0 : j.recordType) === "revision" || te !== ze) && dn.push({ label: i("Baseline"), value: te }), ze !== null && dn.push({ label: i("Installed"), value: ze }), we !== void 0 && dn.push({ label: i("Staged"), value: we });
    const un = ne.findIndex(({ pairKey: H }) => H === qe);
    return /* @__PURE__ */ e.jsxs("section", { className: `gl-comp-inspector${o ? " is-global" : ""}`, "aria-labelledby": "comp-selected-heading", children: [
      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-inspector-head", children: [
        /* @__PURE__ */ e.jsxs("div", { children: [
          /* @__PURE__ */ e.jsx("h3", { id: "comp-selected-heading", children: i("Selected coefficient") }),
          !o && /* @__PURE__ */ e.jsx("span", { children: i(bt ? "Hover preview · click to pin this pair." : qe ? "Pinned pair · hover another cell to compare." : "Select a matrix cell or follow-up pair.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inspector-actions", children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flag-navigation", "aria-label": i("Flagged compensation pair navigation"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": i("Previous flagged compensation pair"),
                disabled: ne.length === 0,
                onClick: () => Ki(-1),
                children: "←"
              }
            ),
            /* @__PURE__ */ e.jsx("span", { children: un >= 0 ? i("{current} / {total} flagged", { current: un + 1, total: ne.length }) : i("{total} flagged", { total: ne.length }) }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                "aria-label": i("Next flagged compensation pair"),
                disabled: ne.length === 0,
                onClick: () => Ki(1),
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
      b ? /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-pair-detail${o ? " is-global" : ""}`, children: [
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
        W && /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `gl-comp-evidence-badge is-${W.category}`,
            title: i(W.detail),
            children: [
              /* @__PURE__ */ e.jsx("strong", { children: i(W.label) }),
              /* @__PURE__ */ e.jsx("span", { children: i(W.detail) })
            ]
          }
        ),
        /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-followup-toggle", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              type: "checkbox",
              checked: m,
              disabled: !j || !oe.has(u.sourceAxisKeys[b.sourceIndex]) || !oe.has(u.receiverAxisKeys[b.receiverIndex]),
              onChange: (H) => On(b.pairKey, H.currentTarget.checked)
            }
          ),
          /* @__PURE__ */ e.jsx("span", { children: i("Flag for follow-up") }),
          /* @__PURE__ */ e.jsx("small", { children: i("Add this pair to the curated Flagged queue.") })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-readout", title: i("Stored fraction: {value}", { value: ie(b.value, 10) }), children: [
          /* @__PURE__ */ e.jsx("span", { children: i(Y[b.pairKey] === void 0 ? "Matrix coefficient" : "Working coefficient") }),
          /* @__PURE__ */ e.jsx("strong", { children: Number.isFinite(Y[b.pairKey] ?? b.value) ? `${((Y[b.pairKey] ?? b.value) * 100).toFixed(1)}%` : String(Y[b.pairKey] ?? b.value) })
        ] }),
        dn.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-coefficient-history", "aria-label": i("Coefficient history"), children: dn.map((H, hn) => /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-history-step", children: [
          hn > 0 && /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
          /* @__PURE__ */ e.jsxs("div", { title: i("Exact fraction: {value}", { value: ie(H.value, 10) }), children: [
            /* @__PURE__ */ e.jsx("small", { children: H.label }),
            /* @__PURE__ */ e.jsxs("strong", { children: [
              (H.value * 100).toFixed(1),
              "%"
            ] })
          ] })
        ] }, `${H.label}:${hn}`)) }),
        j && qe === b.pairKey && !bt && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-coefficient-editor", children: [
          /* @__PURE__ */ e.jsxs("label", { children: [
            /* @__PURE__ */ e.jsx("span", { children: i("Coefficient (%)") }),
            /* @__PURE__ */ e.jsx(
              An,
              {
                step: "0.1",
                value: Hn,
                disabled: B,
                onValueChange: (H) => {
                  Et(H), j.scientific.kind === "flow-spillover" && H.trim() !== "" && Number.isFinite(Number(H)) && zn(b.pairKey, Number(H) / 100);
                }
              }
            )
          ] }),
          j.scientific.kind === "flow-spillover" ? /* @__PURE__ */ e.jsx("small", { className: "gl-comp-live-edit-hint", children: i("Type, use arrows, or drag ↕ · previews immediately") }) : /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: B || !Number.isFinite(Number(Hn)) || Hn.trim() === "",
              onClick: () => zn(b.pairKey, Number(Hn) / 100),
              children: i("Stage value")
            }
          ),
          Y[b.pairKey] !== void 0 && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn",
              disabled: B,
              onClick: () => {
                zn(b.pairKey, b.value), sn((H) => {
                  const hn = { ...H };
                  return delete hn[b.pairKey], hn;
                });
              },
              children: i("Reset")
            }
          )
        ] }),
        Mn && /* @__PURE__ */ e.jsxs("div", { className: `gl-comp-candidate-status${o ? " is-compact" : ""}`, "aria-label": i("Flow compensation coefficient preview"), children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: i("Coefficient preview") }),
            /* @__PURE__ */ e.jsxs("span", { children: [
              i("Original remains fixed; the right panel shows the complete working matrix."),
              o ? i(" The gallery remains installed until Apply.") : ""
            ] })
          ] }),
          /* @__PURE__ */ e.jsx("em", { children: we === void 0 ? i("Working matrix") : `${(b.value * 100).toFixed(1)}% → ${(we * 100).toFixed(1)}%` }),
          We.state === "updating" && We.pairKey === b.pairKey && /* @__PURE__ */ e.jsx("span", { role: "status", children: i("Updating…") }),
          We.state === "error" && We.pairKey === b.pairKey && /* @__PURE__ */ e.jsx("span", { className: "is-error", role: "alert", children: i(We.message) })
        ] }),
        b.interaction && b.interaction !== "other" && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-interaction-type", children: [
          i("Physical relationship:"),
          " ",
          /* @__PURE__ */ e.jsx("strong", { children: b.interaction })
        ] }),
        o && (cn ? /* @__PURE__ */ e.jsx(
          rs,
          {
            preview: cn,
            sourceLabel: b.source.label,
            receiverLabel: b.receiver.label,
            kind: u.kind,
            densitySmoothing: en,
            compact: !0,
            compensatedTitle: i(Ze ? "Candidate" : "Compensated")
          }
        ) : je && !je.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: i(je.reason) }) : null),
        o && /* @__PURE__ */ e.jsx(
          aa,
          {
            matrixView: u,
            sourceChannels: se,
            receiverChannels: ae,
            selectedSourceIndex: b.sourceIndex,
            selectedReceiverIndex: b.receiverIndex,
            stagedCoefficients: Y,
            maximumAbsoluteOffDiagonal: Ai,
            onSelect: ur
          }
        ),
        !o && (cn ? /* @__PURE__ */ e.jsx(
          rs,
          {
            preview: cn,
            sourceLabel: b.source.label,
            receiverLabel: b.receiver.label,
            kind: u.kind,
            densitySmoothing: en,
            compensatedTitle: i(Ze ? "Candidate" : "Compensated")
          }
        ) : je && !je.ready ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-biplot-unavailable", children: i(je.reason) }) : null),
        m && h && g && x && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-tool", children: [
          /* @__PURE__ */ e.jsxs("div", { children: [
            /* @__PURE__ */ e.jsx("strong", { children: i("Sweep bounds") }),
            /* @__PURE__ */ e.jsx("span", { children: i("Four exact candidates will be interpolated across these endpoints.") })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-bounds-inputs", children: [
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: i("Lower (%)") }),
              /* @__PURE__ */ e.jsx(
                An,
                {
                  step: "0.1",
                  value: g.lowerPercent,
                  disabled: B || ue !== null || ye !== null,
                  onValueChange: (H) => st(b.pairKey, b.value, "lowerPercent", H)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsxs("label", { children: [
              /* @__PURE__ */ e.jsx("span", { children: i("Upper (%)") }),
              /* @__PURE__ */ e.jsx(
                An,
                {
                  step: "0.1",
                  value: g.upperPercent,
                  disabled: B || ue !== null || ye !== null,
                  onValueChange: (H) => st(b.pairKey, b.value, "upperPercent", H)
                }
              )
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: B || ue !== null || ye !== null || x.error !== null,
                onClick: () => void or(h),
                children: i(ye === b.pairKey ? "Previewing…" : "Preview endpoints")
              }
            )
          ] }),
          x.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-error", children: i(x.error) }) : /* @__PURE__ */ e.jsx("small", { children: i("Fast preview: exact solver on {preview} frozen events. Screening only; the four-option sweep uses up to {sweep} events.", {
            preview: Math.min(ce, ls).toLocaleString(),
            sweep: Math.min(ce, os).toLocaleString()
          }) }),
          y && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-bounds-preview", children: y.values.map((H) => /* @__PURE__ */ e.jsx("div", { className: H.isCurrent ? "is-current" : void 0, children: /* @__PURE__ */ e.jsx(
            xt,
            {
              title: `${H.isCurrent ? `${i("Current")} · ` : ""}${(H.value * 100).toFixed(2)}%`,
              panel: H.preview.compensated,
              preview: H.preview,
              sourceLabel: b.source.label,
              receiverLabel: b.receiver.label,
              minimumSize: 145,
              maximumSize: 220,
              densitySmoothing: en
            }
          ) }, `${b.pairKey}:bounds:${H.value}:${H.isCurrent}`)) })
        ] }),
        /* @__PURE__ */ e.jsx("p", { className: "gl-hint", children: i(u.coefficientNote) })
      ] }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-inspector-empty", children: i("No coefficient selected.") })
    ] });
  }, Li = (t, o) => /* @__PURE__ */ e.jsx(
    oa,
    {
      dataset: o,
      pair: t,
      plotSize: Pt,
      densitySmoothing: en,
      flagged: Cn.has(t.pairKey),
      selected: qe === t.pairKey,
      onSelect: () => {
        Ie(null), Ce(t.pairKey), jt(!0);
      },
      onFlag: (m) => On(t.pairKey, m)
    },
    t.pairKey
  ), hr = async (t, o) => {
    if (!(le != null && le.ready) || !u)
      throw new Error("Apply compensation before exporting the Global inspector comparison.");
    const m = wi.map((h) => ({
      pairKey: h.pairKey,
      sourceLabel: h.source.label,
      receiverLabel: h.receiver.label,
      coefficient: h.coefficient,
      relationship: h.interaction,
      buildPreview: () => {
        const g = vs(
          le.dataset,
          h.source.key,
          h.receiver.key
        );
        if (!g.ready) throw new Error(g.reason);
        return g.preview;
      }
    }));
    await Xr(m, {
      sampleName: s,
      profileName: (j == null ? void 0 : j.name) ?? i(u.title),
      populationName: (Q == null ? void 0 : Q.name) ?? i("All Events"),
      filterLabel: Ci,
      densitySmoothing: en,
      densityColorPower: G,
      pointAlpha: tt,
      pointSize: it
    }, t, o);
  };
  return O ? /* @__PURE__ */ e.jsx(si.Provider, { value: G, children: /* @__PURE__ */ e.jsx(ri.Provider, { value: tt, children: /* @__PURE__ */ e.jsx(ai.Provider, { value: it, children: /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "gl-tab-panel gl-tab-fill gl-compensation-tab gl-plotting-workspace gl-comp-workspace",
      children: [
        /* @__PURE__ */ e.jsxs("div", { className: `gl-plotting-head gl-comp-head gl-comp-overview${ke === "global" ? " is-global-scan" : ""}`, children: [
          /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-overview-title", children: [
            /* @__PURE__ */ e.jsx("h2", { className: "gl-tab-title", children: i("Compensation") }),
            !D && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-method", children: at })
          ] }),
          D ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              id: "comp-profile-heading",
              className: `gl-comp-profile-pill${V.state === "ready" ? " is-ready" : " is-stale"}`,
              role: "status",
              title: i("{source} · {method} · {count} solve channels · {status} · {assay}", {
                source: ot,
                method: at,
                count: Ot,
                status: i(V.state === "ready" ? "Ready" : "Unavailable"),
                assay: i(a ? "Compensated assay active" : "Original assay active")
              }),
              children: [
                /* @__PURE__ */ e.jsx("span", { className: `gl-comp-status-dot${V.state === "ready" ? " is-ready" : " is-stale"}`, "aria-hidden": "true" }),
                /* @__PURE__ */ e.jsxs("span", { className: "gl-sr-only", children: [
                  i("{kind} compensation installed. Installed compensation profile.", {
                    kind: D.kind === "cytof-spillover" ? "CyTOF" : "Flow"
                  }),
                  " "
                ] }),
                /* @__PURE__ */ e.jsx("strong", { children: Hs }),
                /* @__PURE__ */ e.jsx("span", { children: i("{method} · {count} ch · {status}", {
                  method: at,
                  count: Ot,
                  status: V.state === "ready" ? i("Ready") : i("Unavailable")
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
                source: i(ki),
                assay: i(a ? "Compensated assay active" : "Original assay active"),
                count: Ot
              })
            }
          ),
          D && n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "gl-mini-btn gl-comp-header-replace",
              disabled: B,
              onClick: Fi,
              children: i("Replace matrix…")
            }
          ),
          D && c && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-header-remove", children: [
            p && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  type: "checkbox",
                  checked: Se,
                  disabled: B || Yn,
                  onChange: (t) => Ge(t.currentTarget.checked)
                }
              ),
              /* @__PURE__ */ e.jsx("span", { children: i("Recompute existing gate memberships in original coordinates.") })
            ] }),
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                className: "gl-mini-btn",
                disabled: B || Yn,
                title: i("Uninstall the matrix: every file returns to the original assay and the matrix leaves the workspace."),
                onClick: () => void sr(),
                children: i(Yn ? "Removing…" : "Remove the matrix")
              }
            )
          ] }),
          Zs && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-global-layer-note", children: i("Assay selection in the top bar applies to every tab.") })
        ] }),
        /* @__PURE__ */ e.jsxs("aside", { className: "gl-plotting-inspector gl-comp-inspector-left", "aria-label": i("Compensation controls"), children: [
          n.instrument === "flow" && !D && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-pane-matrix", children: [
            /* @__PURE__ */ e.jsx("h3", { children: i("Matrix") }),
            n.instrument === "flow" && ee && !D && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-enable-heading", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("strong", { id: "comp-flow-enable-heading", children: i(me ? "SCE spillover matrix" : "Embedded FCS matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: i("Install this exact matrix as the immutable baseline to edit coefficients and preview their effect.") })
              ] }),
              p && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Se,
                    disabled: B,
                    onChange: (t) => Ge(t.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: i("Recompute existing gate memberships in compensated coordinates.") })
              ] }),
              Le != null && Le.error ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: Le.error }) : B ? /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flow-enable-progress", role: "status", children: [
                re ? i("Preparing editor… {percent}%", { percent: Math.round(re.fraction * 100) }) : i("Preparing editor…"),
                /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (re == null ? void 0 : re.phase) === "cancelling",
                    onClick: v,
                    children: i((re == null ? void 0 : re.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                )
              ] }) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: !l || p && !Se,
                  onClick: () => void rr(),
                  children: i("Enable matrix editing")
                }
              )
            ] }),
            n.instrument === "flow" && !D && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-flow-enable", "aria-labelledby": "comp-flow-empty-heading", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("strong", { id: "comp-flow-empty-heading", children: i("Empty matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: i(ee ? "Or start from an identity matrix over the file's fluorescence channels, every spillover at zero, and set the coefficients by hand." : "Start from an identity matrix over the file's fluorescence channels, every spillover at zero, and set the coefficients by hand.") })
              ] }),
              p && !ee && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement is-compact", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Se,
                    disabled: B,
                    onChange: (t) => Ge(t.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: i("Recompute existing gate memberships in compensated coordinates.") })
              ] }),
              B ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-flow-enable-progress", role: "status", children: i("Preparing editor…") }) : /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: !l || p && !Se,
                  onClick: () => void ir(),
                  children: i("Start from an empty matrix")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: i("Review scope") }),
            /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-review-population", children: [
              /* @__PURE__ */ e.jsx("span", { children: i("Review population") }),
              /* @__PURE__ */ e.jsxs(
                "select",
                {
                  "aria-label": i("Compensation review population"),
                  value: (Q == null ? void 0 : Q.id) ?? "all",
                  disabled: ue !== null || ye !== null,
                  onChange: (t) => Ct(t.currentTarget.value),
                  children: [
                    /* @__PURE__ */ e.jsx("option", { value: "all", children: i("All Events") }),
                    T.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: `${"· ".repeat(t.depth)}${t.name} (${t.eventCount.toLocaleString()})` }, t.id))
                  ]
                }
              ),
              /* @__PURE__ */ e.jsx("small", { children: i("{count} events · applies to biplots, attention ranking, and sweeps; membership frozen from the current assay", {
                count: ce.toLocaleString()
              }) })
            ] }),
            ke !== "global" && /* @__PURE__ */ e.jsxs(
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
                      value: String(et),
                      disabled: B,
                      onChange: (t) => {
                        const o = t.currentTarget.value;
                        Ts(o === "all" ? "all" : Number(o));
                      },
                      children: [
                        ds.map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: i("{count} events", { count: t.toLocaleString() }) }, t)),
                        /* @__PURE__ */ e.jsx("option", { value: "all", children: i("All available") })
                      ]
                    }
                  ),
                  /* @__PURE__ */ e.jsx("small", { children: i("Showing {shown} of {total}; Apply always uses all events.", {
                    shown: Rn.length.toLocaleString(),
                    total: ce.toLocaleString()
                  }) })
                ]
              }
            )
          ] }),
          (A !== void 0 && I !== void 0 && P || u && Object.keys(Y).length > 0) && /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: i("Apply") }),
            A !== void 0 && I !== void 0 && P && /* @__PURE__ */ e.jsxs(
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
                      value: A,
                      disabled: B,
                      onChange: (t) => P(Number(t.currentTarget.value)),
                      children: Array.from({ length: I }, (t, o) => o + 1).map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, t))
                    }
                  ),
                  /* @__PURE__ */ e.jsxs("small", { children: [
                    "/ ",
                    I
                  ] })
                ]
              }
            ),
            u && Object.keys(Y).length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-staged-actions", children: [
              /* @__PURE__ */ e.jsxs("span", { children: [
                i("{count} pending edits", { count: Object.keys(Y).length }),
                (j == null ? void 0 : j.scientific.kind) === "cytof-spillover" ? ` · ${i("{files} checked FCS files", { files: Je })}` : ""
              ] }),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  disabled: B,
                  onClick: () => {
                    Gn({}), sn({}), J(null);
                  },
                  children: i("Discard")
                }
              ),
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-btn",
                  disabled: B || ue !== null || ye !== null || !l || (j == null ? void 0 : j.scientific.kind) === "cytof-spillover" && Je === 0,
                  onClick: () => void dr(),
                  children: i("Apply revised matrix")
                }
              )
            ] })
          ] }),
          u && /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: i("Biplot display") }),
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
                      value: en,
                      "aria-label": i("Compensation biplot density smoothing"),
                      onChange: (t) => Ss(Number(t.currentTarget.value))
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
                      value: tt,
                      "aria-label": i("Compensation biplot point alpha"),
                      onChange: (t) => ks(Number(t.currentTarget.value))
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
                title: i("Point size for every compensation biplot, as a factor on the size each panel's width gives"),
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: i("Point size") }),
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "range",
                      min: "0.3",
                      max: "3",
                      step: "0.1",
                      value: it,
                      "aria-label": i("Compensation biplot point size"),
                      onChange: (t) => As(Number(t.currentTarget.value))
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
              jr,
              {
                className: "gl-comp-density-colour",
                value: G,
                onChange: q
              }
            )
          ] }),
          (u || D) && /* @__PURE__ */ e.jsxs("section", { children: [
            /* @__PURE__ */ e.jsx("h3", { children: i("Tools") }),
            /* @__PURE__ */ e.jsx("div", { className: "gl-comp-drawer-buttons", children: ua.map(({ id: t, label: o }) => /* @__PURE__ */ e.jsxs(
              "button",
              {
                type: "button",
                id: `comp-drawer-${t}-button`,
                className: "gl-comp-drawer-toggle",
                "aria-expanded": Bn[t],
                "aria-controls": `comp-drawer-${t}`,
                onClick: () => Ys(t),
                children: [
                  /* @__PURE__ */ e.jsxs("span", { children: [
                    i(o),
                    t === "review" && rt.length > 0 ? ` (${rt.length})` : ""
                  ] }),
                  /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: Bn[t] ? "▾" : "▸" })
                ]
              },
              t
            )) })
          ] })
        ] }),
        /* @__PURE__ */ e.jsxs("div", { className: "gl-prop-body gl-comp-body", children: [
          u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-workspace-tabs", role: "tablist", "aria-label": i("Compensation workspace"), children: [
            /* @__PURE__ */ e.jsx(
              "button",
              {
                type: "button",
                role: "tab",
                "aria-selected": ke === "matrix",
                className: ke === "matrix" ? "active" : void 0,
                onClick: () => {
                  Ie(null), qn("matrix");
                },
                children: i("Matrix")
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
                  Ie(null), qn("global");
                },
                children: i("Global inspector")
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
                  Ie(null), qn("attention");
                },
                children: [
                  i("Flagged"),
                  ne.length > 0 ? ` (${ne.length})` : ""
                ]
              }
            )
          ] }),
          n.instrument === "cytof" && /* @__PURE__ */ e.jsx(
            "input",
            {
              ref: yi,
              type: "file",
              accept: ".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain",
              className: "gl-sr-only",
              "aria-label": i("Choose CyTOF spillover matrix"),
              onChange: (t) => void Qs(t)
            }
          ),
          fi && /* @__PURE__ */ e.jsx("div", { className: gi ? "gl-comp-error" : "gl-comp-status", role: gi ? "alert" : "status", children: i(fi) }),
          n.instrument === "cytof" && (!D || X) && /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-cytof-import", "aria-labelledby": "comp-cytof-import-heading", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-import-head", children: [
              /* @__PURE__ */ e.jsxs("div", { children: [
                /* @__PURE__ */ e.jsx("h3", { id: "comp-cytof-import-heading", children: i("CyTOF spillover matrix") }),
                /* @__PURE__ */ e.jsx("span", { children: i("Linear counts → non-negative least squares → arcsinh display") })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-import-actions", children: /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: X ? "gl-btn-ghost" : "gl-btn",
                  disabled: B,
                  onClick: Fi,
                  children: i(X ? "Choose another matrix…" : "Import matrix…")
                }
              ) })
            ] }),
            xi && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: i(xi) }),
            X && de && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-body", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-import-summary", children: [
                /* @__PURE__ */ e.jsxs("div", { children: [
                  /* @__PURE__ */ e.jsx("strong", { children: X.fileName }),
                  /* @__PURE__ */ e.jsx("span", { children: i("{sources} sources × {receivers} receivers", {
                    sources: X.matrix.sourceChannels.length,
                    receivers: X.matrix.receiverChannels.length
                  }) })
                ] }),
                /* @__PURE__ */ e.jsxs("dl", { children: [
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: i("Exact matches") }),
                    /* @__PURE__ */ e.jsx("dd", { children: de.matchedChannels.length })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: i("Included") }),
                    /* @__PURE__ */ e.jsx("dd", { children: de.includedChannels.length })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: i("Not in FCS") }),
                    /* @__PURE__ */ e.jsx("dd", { children: de.matrixOnlyChannels.length })
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
                      disabled: B,
                      onClick: () => on(new Set(de.matchedChannels)),
                      children: i("All matched")
                    }
                  ),
                  /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      disabled: B,
                      onClick: () => on(/* @__PURE__ */ new Set()),
                      children: i("None")
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "gl-comp-channel-grid", children: X.matrix.receiverChannels.map((t) => {
                const o = de.matchedChannels.includes(t);
                return /* @__PURE__ */ e.jsxs("label", { className: o ? "" : "is-unavailable", title: o ? t : i("{channel} is not uniquely present in this FCS file", { channel: t }), children: [
                  /* @__PURE__ */ e.jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: Pn.has(t),
                      disabled: !o || B,
                      onChange: (m) => er(t, m.currentTarget.checked)
                    }
                  ),
                  /* @__PURE__ */ e.jsx("span", { children: Gt(n, t).combined }),
                  !o && /* @__PURE__ */ e.jsx("small", { children: i("not matched") })
                ] }, t);
              }) }),
              (X.validationWarnings.length > 0 || de.warnings.length > 0) && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: /* @__PURE__ */ e.jsx("span", { children: i("{count} review items: {messages}", {
                count: X.validationWarnings.length + de.warnings.length,
                messages: [
                  ...X.validationWarnings.map(({ message: t }) => t),
                  ...de.warnings.map(({ message: t }) => t)
                ].map((t) => i(t)).join(" ")
              }) }) }),
              de.blockers.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: de.blockers.map(({ message: t }) => i(t)).join(" ") }),
              p && /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-gate-acknowledgement", children: [
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: Se,
                    disabled: B,
                    onChange: (t) => Ge(t.currentTarget.checked)
                  }
                ),
                /* @__PURE__ */ e.jsx("span", { children: i("I understand that existing gates are retained, but their memberships will be recomputed using the compensated coordinates.") })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-row", children: [
                /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-apply-copy", children: [
                  /* @__PURE__ */ e.jsx("span", { children: B ? re ? i("{phase}… {percent}% ({processed} / {total} events)", {
                    phase: i(re.phase === "cancelling" ? "Cancelling" : re.phase === "preparing" ? "Preparing" : "Applying"),
                    percent: Math.round(re.fraction * 100),
                    processed: re.processedEvents.toLocaleString(),
                    total: re.totalEvents.toLocaleString()
                  }) : i("Preparing compensation…") : i("The Original assay is retained and can be restored at any time.") }),
                  /* @__PURE__ */ e.jsx("strong", { className: Je === 0 ? "is-empty" : void 0, children: Je === 0 ? i("No FCS files are checked. Select at least one file in Samples.") : i("Applies atomically to {files} checked FCS files · {events} total events", {
                    files: Je,
                    events: qs.toLocaleString()
                  }) })
                ] }),
                B ? /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn-ghost",
                    disabled: (re == null ? void 0 : re.phase) === "cancelling",
                    onClick: v,
                    children: i((re == null ? void 0 : re.phase) === "cancelling" ? "Cancelling…" : "Cancel")
                  }
                ) : /* @__PURE__ */ e.jsx(
                  "button",
                  {
                    type: "button",
                    className: "gl-btn",
                    disabled: !l || Je === 0 || !de.canApply || p && !Se,
                    onClick: () => void nr(),
                    children: i("Apply NNLS compensation")
                  }
                )
              ] }),
              d.length > 0 && f && /* @__PURE__ */ e.jsxs(
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
                          value: (Qe == null ? void 0 : Qe.id) ?? "",
                          disabled: B,
                          onChange: (t) => {
                            bi(t.currentTarget.value), Jn(!1);
                          },
                          children: d.map((t) => /* @__PURE__ */ e.jsx("option", { value: t.id, children: t.label === t.id ? t.id : `${t.label} (${t.id})` }, t.id))
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
                          onChange: (t) => Jn(t.currentTarget.checked)
                        }
                      ),
                      /* @__PURE__ */ e.jsx("span", { children: i("I confirm this assay was computed from the selected source assay using this exact matrix and channel set.") })
                    ] }),
                    /* @__PURE__ */ e.jsx(
                      "button",
                      {
                        type: "button",
                        className: "gl-btn-ghost",
                        disabled: B || !Qe || !At || Je === 0 || !de.canApply || p && !Se,
                        onClick: () => void tr(),
                        children: i("Use existing assay — no recomputation")
                      }
                    )
                  ]
                }
              )
            ] })
          ] }),
          Mi && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-error", role: "alert", children: i("The embedded compensation matrix contains non-finite values and cannot be applied.") }),
          Si.length > 0 && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-warning", role: "status", children: [
            /* @__PURE__ */ e.jsx("span", { children: i("{count} off-diagonal coefficients are above 100%. Review the matrix source before applying it.", {
              count: Si.length
            }) }),
            /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => oi((t) => ({ ...t, review: !0 })), children: i("Review details") })
          ] }),
          D && V.state === "stale" && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: i("This profile cannot be applied to the current sample context. Open the review queue for exact reasons.") }),
          u && ke === "matrix" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: wn,
              className: "gl-comp-common-path",
              style: { gridTemplateColumns: `minmax(440px, 1fr) 8px ${xn}px` },
              children: [
                /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-matrix-panel", "aria-labelledby": "comp-matrix-heading", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-panel-head gl-comp-matrix-head", children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("h3", { id: "comp-matrix-heading", children: i(u.title) }),
                      /* @__PURE__ */ e.jsx("span", { children: i(u.subtitle) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-matrix-head-actions", children: [
                      Sn && /* @__PURE__ */ e.jsx("span", { className: "gl-comp-inline-edit-note", children: i("Edit cells directly (%)") }),
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
                          onClick: () => mi(!0),
                          children: i("Export CSV…")
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-matrix-scroll", children: /* @__PURE__ */ e.jsxs(
                    "div",
                    {
                      className: `gl-comp-matrix-stage${Sn ? " is-flow-inline" : ""}`,
                      style: {
                        width: 18 + Dn.rowLabelWidth + u.receiverAxisKeys.length * ln + Dn.overhang,
                        "--gl-comp-row-label-w": `${Dn.rowLabelWidth}px`,
                        "--gl-comp-col-label-w": `${Dn.columnLabelWidth}px`,
                        "--gl-comp-col-label-h": `${Dn.columnLabelHeight}px`
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
                                  gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${ln}px)`
                                },
                                children: ae.map((t, o) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (b == null ? void 0 : b.receiverIndex) === o ? "is-selected" : void 0,
                                    title: t.combined,
                                    children: /* @__PURE__ */ e.jsx("span", { children: t.combined })
                                  },
                                  u.receiverAxisKeys[o]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                className: "gl-comp-row-labels",
                                "aria-label": i("Source channel labels"),
                                style: {
                                  gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${ln}px)`
                                },
                                children: se.map((t, o) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    className: (b == null ? void 0 : b.sourceIndex) === o ? "is-selected" : void 0,
                                    title: t.combined,
                                    children: t.combined
                                  },
                                  u.sourceAxisKeys[o]
                                ))
                              }
                            ),
                            /* @__PURE__ */ e.jsx(
                              "div",
                              {
                                ref: ji,
                                className: "gl-comp-matrix shows-values",
                                role: "grid",
                                "aria-label": i("Compensation matrix; source rows and receiver columns"),
                                "aria-rowcount": u.sourceAxisKeys.length,
                                "aria-colcount": u.receiverAxisKeys.length,
                                style: {
                                  gridTemplateColumns: `repeat(${u.receiverAxisKeys.length}, ${ln}px)`,
                                  gridTemplateRows: `repeat(${u.sourceAxisKeys.length}, ${ln}px)`
                                },
                                children: u.matrix.map((t, o) => /* @__PURE__ */ e.jsx(
                                  "div",
                                  {
                                    role: "row",
                                    className: "gl-comp-matrix-row",
                                    "aria-rowindex": o + 1,
                                    children: t.map((m, h) => {
                                      const g = u.sourceAxisKeys[o], x = u.receiverAxisKeys[h], y = `${g}${_e}${x}`, z = Y[y], U = z ?? m, K = g === x, W = (b == null ? void 0 : b.sourceIndex) === o && b.receiverIndex === h, te = (b == null ? void 0 : b.sourceIndex) === o, ze = (b == null ? void 0 : b.receiverIndex) === h, we = se[o], Mn = ae[h], Ze = u.kind === "cytof" ? kn(g, x) : null, cn = wr(
                                        U,
                                        Ai,
                                        K
                                      ), dn = u.receiverAxisKeys.findIndex((ge) => ge !== g), un = qe === y, H = qe === null && o === 0 && h === dn, hn = Number.isFinite(U) ? U === 0 ? "" : (U * 100).toFixed(1) : String(U), zi = Ze && Ze !== "other" && Ze !== "self" ? ` · ${Ze}` : "", mr = Ks[y] ?? ms(U);
                                      return Sn && !K ? /* @__PURE__ */ e.jsx(
                                        An,
                                        {
                                          role: "gridcell",
                                          className: `gl-comp-cell gl-comp-cell-input${W ? " selected" : ""}${un ? " is-pinned" : ""}${z === void 0 ? "" : " is-staged"}${te ? " is-selected-source" : ""}${ze ? " is-selected-receiver" : ""}`,
                                          min: "0",
                                          step: "0.1",
                                          value: mr,
                                          disabled: B,
                                          "data-source-index": o,
                                          "data-receiver-index": h,
                                          "aria-colindex": h + 1,
                                          "aria-selected": un,
                                          "aria-label": i("{source} source to {receiver} receiver coefficient, percent{pending}", {
                                            source: we.combined,
                                            receiver: Mn.combined,
                                            pending: z === void 0 ? "" : i(", pending edit")
                                          }),
                                          title: i("{source} → {receiver} · type or drag vertically to edit spillover percentage{pending}", {
                                            source: we.combined,
                                            receiver: Mn.combined,
                                            pending: z === void 0 ? "" : i(" · pending edit")
                                          }),
                                          style: cn,
                                          onFocus: () => Ce(y),
                                          onMouseEnter: () => Ie(y),
                                          onMouseLeave: () => Ie((ge) => ge === y ? null : ge),
                                          onClick: () => Ce(y),
                                          onValueChange: (ge) => {
                                            Ce(y), sn((_n) => ({ ..._n, [y]: ge })), ge.trim() !== "" && Number.isFinite(Number(ge)) && zn(y, Number(ge) / 100);
                                          },
                                          onBlur: (ge) => {
                                            const _n = ge.currentTarget.value;
                                            if (_n.trim() === "" || !Number.isFinite(Number(_n))) {
                                              sn((_t) => {
                                                const _i = { ..._t };
                                                return delete _i[y], _i;
                                              });
                                              return;
                                            }
                                            sn((_t) => ({
                                              ..._t,
                                              [y]: ms(Number(_n) / 100)
                                            }));
                                          }
                                        },
                                        x
                                      ) : /* @__PURE__ */ e.jsx(
                                        "button",
                                        {
                                          type: "button",
                                          role: "gridcell",
                                          className: `gl-comp-cell${K ? " diagonal" : ""}${W ? " selected" : ""}${un ? " is-pinned" : ""}${z === void 0 ? "" : " is-staged"}${te ? " is-selected-source" : ""}${ze ? " is-selected-receiver" : ""}`,
                                          disabled: K,
                                          tabIndex: K ? -1 : W || H ? 0 : -1,
                                          "data-source-index": o,
                                          "data-receiver-index": h,
                                          "data-interaction": Ze ?? void 0,
                                          "aria-colindex": h + 1,
                                          "aria-pressed": K ? void 0 : un,
                                          "aria-label": K ? i("{channel} diagonal: {value}", { channel: we.combined, value: tn(U) }) : i("{source} source to {receiver} receiver: {value}{pending}{interaction}", {
                                            source: we.combined,
                                            receiver: Mn.combined,
                                            value: tn(U),
                                            pending: z === void 0 ? "" : i(" (pending edit)"),
                                            interaction: zi
                                          }),
                                          title: K ? `${we.combined} · self · ${tn(U)}` : `${we.combined} → ${Mn.combined} · ${tn(U)}${z === void 0 ? "" : " · pending edit"}${zi}`,
                                          style: cn,
                                          onFocus: () => {
                                            K || Ce(y);
                                          },
                                          onMouseEnter: () => {
                                            K || Ie(y);
                                          },
                                          onMouseLeave: () => Ie((ge) => ge === y ? null : ge),
                                          onClick: () => Ce(y),
                                          onKeyDown: (ge) => ar(ge, o, h),
                                          children: /* @__PURE__ */ e.jsx("span", { children: hn })
                                        },
                                        x
                                      );
                                    })
                                  },
                                  u.sourceAxisKeys[o]
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
          ) : u && ke === "global" ? /* @__PURE__ */ e.jsxs(
            "div",
            {
              ref: wn,
              className: `gl-comp-common-path gl-comp-global-path${$n ? " has-details" : ""}`,
              style: {
                gridTemplateColumns: $n ? `minmax(440px, 1fr) 8px ${xn}px` : "minmax(0, 1fr)"
              },
              children: [
                /* @__PURE__ */ e.jsx(
                  la,
                  {
                    stateKey: _,
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
                          value: Pe,
                          onChange: (t) => Vn(t.currentTarget.value),
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
                          value: Re,
                          onChange: (t) => js(t.currentTarget.value),
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
                          value: Fn,
                          placeholder: i("Find channel…"),
                          "aria-label": i("Search global compensation pairs"),
                          onChange: (t) => ci(t.currentTarget.value)
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
                            value: Pt,
                            "aria-label": i("Global compensation plot size"),
                            onChange: (t) => Cs(Number(t.currentTarget.value))
                          }
                        ),
                        /* @__PURE__ */ e.jsx("output", { children: i("{size}px", { size: Pt }) })
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn gl-comp-global-export",
                          disabled: !(le != null && le.ready) || Oe.length === 0,
                          title: i("Export the currently filtered pairs as locked Original and Compensated comparison pages"),
                          onClick: () => pi(!0),
                          children: i("Export…")
                        }
                      ),
                      /* @__PURE__ */ e.jsx(
                        "span",
                        {
                          className: "gl-comp-global-count",
                          title: i("The Global gallery uses one fixed representative event set so every pair and both assay layers remain directly comparable."),
                          children: i("{pairs} pairs · {shown} / {total} events · {population}", {
                            pairs: Oe.length.toLocaleString(),
                            shown: Ft.length.toLocaleString(),
                            total: ce.toLocaleString(),
                            population: (Q == null ? void 0 : Q.name) ?? i("All Events")
                          })
                        }
                      )
                    ] }),
                    children: le ? le.ready ? Oe.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: i("No pairs match the current filter. Choose another filter or clear the channel search.") }) : Re === "compact" ? /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-gallery",
                        "data-event-signature": le.dataset.eventSignature,
                        children: Oe.map((t) => Li(t, le.dataset))
                      }
                    ) : /* @__PURE__ */ e.jsx(
                      "div",
                      {
                        className: "gl-comp-global-groups",
                        "data-event-signature": le.dataset.eventSignature,
                        "data-layout": Re,
                        children: It.map((t) => /* @__PURE__ */ e.jsxs("section", { className: "gl-comp-global-group", children: [
                          /* @__PURE__ */ e.jsxs("header", { children: [
                            /* @__PURE__ */ e.jsx("span", { children: i(Re === "source" ? "Source channel" : "Receiver") }),
                            /* @__PURE__ */ e.jsx("strong", { title: t.channel.combined, children: t.channel.label }),
                            /* @__PURE__ */ e.jsx("small", { children: t.channel.pnn }),
                            /* @__PURE__ */ e.jsx("em", { children: i("{count} pairs", { count: t.pairs.length }) })
                          ] }),
                          /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-group-plots", children: t.pairs.map((o) => Li(o, le.dataset)) })
                        ] }, t.channel.key))
                      }
                    ) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: i(le.reason) }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-global-empty", children: i("No matrix is available for the global inspector.") })
                  }
                ),
                $n && Dt(),
                $n && zt(() => jt(!1), !0)
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
                            value: Nt,
                            disabled: ue !== null || ye !== null,
                            onChange: (t) => St(Number(t.currentTarget.value)),
                            children: Array.from({ length: us }, (t, o) => o + 1).map((t) => /* @__PURE__ */ e.jsx("option", { value: t, children: t }, t))
                          }
                        )
                      ] }),
                      ue ? /* @__PURE__ */ e.jsx("button", { type: "button", className: "gl-btn-ghost", onClick: cr, children: i("Cancel sweep") }) : /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-btn",
                          disabled: !j || !F || De.length === 0 || Kt > 0 || B || ye !== null,
                          onClick: () => void lr(),
                          children: i("Run four-value sweeps ({count})", { count: De.length })
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-scope", children: [
                    /* @__PURE__ */ e.jsx("span", { children: i("Suggestions computed for {population} from up to {count} frozen events.", {
                      population: (Q == null ? void 0 : Q.name) ?? i("All Events"),
                      count: Math.min(ce, Kn.length).toLocaleString()
                    }) }),
                    /* @__PURE__ */ e.jsxs("label", { className: "gl-comp-evidence-mode", children: [
                      /* @__PURE__ */ e.jsx("span", { children: i("Evidence mode") }),
                      /* @__PURE__ */ e.jsxs(
                        "select",
                        {
                          "aria-label": i("Compensation evidence mode"),
                          value: Ve,
                          disabled: B || ue !== null || ye !== null,
                          onChange: (t) => {
                            $s(t.currentTarget.value), kt((o) => o + 1), Ye({}), an({}), ve(null);
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
                        disabled: B || ue !== null || ye !== null,
                        onClick: () => {
                          kt((t) => t + 1), Ye({}), an({}), ve(null), pe(!1), J(
                            i(ne.length === 1 ? "Recomputed compensation suggestions for {population}. {count} flagged pair was retained." : "Recomputed compensation suggestions for {population}. {count} flagged pairs were retained.", {
                              population: (Q == null ? void 0 : Q.name) ?? i("All Events"),
                              count: ne.length
                            })
                          );
                        },
                        children: i("Recompute suggestions")
                      }
                    ),
                    /* @__PURE__ */ e.jsxs("small", { children: [
                      i(Ve === "biological" ? "Broad positive association is excluded because co-expression and cell size can mimic spill. High-tail shapes remain control-sensitive review prompts." : "Positive residual association may enter the shortlist only because you declared suitable control data."),
                      " ",
                      i("Sweep workers are separate from full-Apply workers.")
                    ] })
                  ] }),
                  ue && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-progress", role: "status", "aria-live": "polite", children: [
                    /* @__PURE__ */ e.jsx("progress", { max: Math.max(1, ue.total), value: ue.completed }),
                    /* @__PURE__ */ e.jsx("span", { children: i("{completed} / {total} exact candidate solves · {workers} workers", {
                      completed: ue.completed,
                      total: ue.total,
                      workers: Nt
                    }) })
                  ] }),
                  hi && /* @__PURE__ */ e.jsx("div", { className: "gl-comp-warning", role: "status", children: i(hi) }),
                  j ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-manual-followup", role: "group", "aria-label": i("Add compensation pair for follow-up"), children: [
                      /* @__PURE__ */ e.jsx("strong", { children: i("Add a pair") }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: i("Source channel") }),
                        /* @__PURE__ */ e.jsx(
                          Ui,
                          {
                            label: i("Follow-up source channel"),
                            value: Ee,
                            options: u.sourceAxisKeys.flatMap((t, o) => oe.has(t) ? [{ value: t, label: se[o].combined }] : []),
                            onChange: (t) => {
                              ui(t), Ne === t && Mt(u.receiverAxisKeys.find((o) => o !== t && oe.has(o)) ?? "");
                            }
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx("span", { "aria-hidden": "true", children: "→" }),
                      /* @__PURE__ */ e.jsxs("label", { children: [
                        /* @__PURE__ */ e.jsx("span", { children: i("Receiver") }),
                        /* @__PURE__ */ e.jsx(
                          Ui,
                          {
                            label: i("Follow-up receiver channel"),
                            value: Ne,
                            options: u.receiverAxisKeys.flatMap((t, o) => t !== Ee && oe.has(t) ? [{ value: t, label: ae[o].combined }] : []),
                            onChange: Mt
                          }
                        )
                      ] }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !Ee || !Ne || Ee === Ne,
                          onClick: Vs,
                          children: i("Flag for follow-up")
                        }
                      )
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-flagged-columns", children: [
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsx("h4", { children: i("Flagged by you ({count})", { count: De.length }) }),
                          /* @__PURE__ */ e.jsx("span", { children: i("Only these pairs are included when you run sweeps.") })
                        ] }) }),
                        De.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: i("No pairs are flagged yet. Tick “Flag for follow-up” in the inspector, add a pair above, or accept a suggestion below.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-list", children: De.map((t, o) => {
                          const m = Ls[t.pairKey], h = Ds === t.pairKey, g = Ln(t.pairKey, t.coefficient), x = Rt(t.pairKey, t.coefficient);
                          return /* @__PURE__ */ e.jsxs("article", { className: `gl-comp-sweep-pair${qe === t.pairKey ? " is-selected" : ""}`, children: [
                            /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-head-row", children: [
                              /* @__PURE__ */ e.jsxs(
                                "button",
                                {
                                  type: "button",
                                  className: "gl-comp-sweep-pair-head",
                                  "aria-expanded": h,
                                  onClick: () => {
                                    Ce(t.pairKey), In(h ? null : t.pairKey);
                                  },
                                  children: [
                                    /* @__PURE__ */ e.jsx("span", { className: "gl-comp-sweep-rank", children: o + 1 }),
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
                                      shift: ie(t.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: ie(t.evidence.residualSlope ?? 0, 4)
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
                                  onChange: (y) => On(t.pairKey, y.currentTarget.checked)
                                }
                              ) })
                            ] }),
                            h && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-sweep-pair-body", children: [
                              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-inline-bounds", children: [
                                /* @__PURE__ */ e.jsx("span", { children: i("Four values across") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  i("Lower (%)"),
                                  /* @__PURE__ */ e.jsx(An, { step: "0.1", value: x.lowerPercent, disabled: B || ue !== null || ye !== null, onValueChange: (y) => st(t.pairKey, t.coefficient, "lowerPercent", y) })
                                ] }),
                                /* @__PURE__ */ e.jsx("span", { children: i("to") }),
                                /* @__PURE__ */ e.jsxs("label", { children: [
                                  i("Upper (%)"),
                                  /* @__PURE__ */ e.jsx(An, { step: "0.1", value: x.upperPercent, disabled: B || ue !== null || ye !== null, onValueChange: (y) => st(t.pairKey, t.coefficient, "upperPercent", y) })
                                ] }),
                                g.error && /* @__PURE__ */ e.jsx("small", { children: i(g.error) })
                              ] }),
                              m ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-sweep-values", children: m.values.map((y) => /* @__PURE__ */ e.jsxs(
                                "div",
                                {
                                  className: `gl-comp-sweep-value${y.isCurrent ? " is-current" : ""}${Y[t.pairKey] === y.value ? " is-staged" : ""}`,
                                  children: [
                                    /* @__PURE__ */ e.jsx(
                                      xt,
                                      {
                                        title: `${y.isCurrent ? `${i("Current")} · ` : ""}${(y.value * 100).toFixed(2)}%`,
                                        panel: y.preview.compensated,
                                        preview: y.preview,
                                        sourceLabel: t.source.label,
                                        receiverLabel: t.receiver.label,
                                        minimumSize: 150,
                                        maximumSize: 230,
                                        densitySmoothing: en
                                      }
                                    ),
                                    /* @__PURE__ */ e.jsxs("dl", { children: [
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: i("Shift") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: i("{value} MAD", { value: ie(y.preview.evidence.normalizedNegativeShift ?? 0, 3) }) })
                                      ] }),
                                      /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: i("Slope") }),
                                        /* @__PURE__ */ e.jsx("dd", { children: ie(y.preview.evidence.residualSlope ?? 0, 4) })
                                      ] }),
                                      u.kind === "cytof" && /* @__PURE__ */ e.jsxs("div", { children: [
                                        /* @__PURE__ */ e.jsx("dt", { children: i("Receiver zero") }),
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
                                        onClick: () => zn(t.pairKey, y.value),
                                        children: i(y.isCurrent ? "Installed" : Y[t.pairKey] === y.value ? "Staged" : "Use this value")
                                      }
                                    )
                                  ]
                                },
                                `${t.pairKey}:${y.value}:${y.isCurrent}`
                              )) }) : /* @__PURE__ */ e.jsx("p", { children: i("Set or fast-preview the endpoints in the inspector, then run the four-value exact sweep. Panels use the same events and locked axes.") })
                            ] })
                          ] }, t.pairKey);
                        }) })
                      ] }),
                      /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-attention-section gl-comp-suggestions", children: [
                        /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-section-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                          /* @__PURE__ */ e.jsxs("h4", { children: [
                            i(Ve === "biological" ? "Conservative suggestions" : "Control-data suggestions"),
                            " (",
                            Me.items.length,
                            ")"
                          ] }),
                          /* @__PURE__ */ e.jsx("span", { children: i("{evaluable} evaluable of {screened} screened pairs for {population}. Inspect before flagging.", {
                            evaluable: Me.evaluableCount.toLocaleString(),
                            screened: Me.screenedCount.toLocaleString(),
                            population: (Q == null ? void 0 : Q.name) ?? i("All Events")
                          }) })
                        ] }) }),
                        Me.items.length === 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-attention-empty", children: i("No pair met the residual-screen evidence requirements. Manual flagging remains available.") }) : /* @__PURE__ */ e.jsx("div", { className: "gl-comp-suggestion-list", children: Me.items.map((t) => {
                          const o = Xt(t, u.kind, Ve);
                          return /* @__PURE__ */ e.jsxs("article", { className: Cn.has(t.pairKey) ? "is-flagged" : void 0, children: [
                            /* @__PURE__ */ e.jsxs(
                              "button",
                              {
                                type: "button",
                                onClick: () => Ce(t.pairKey),
                                children: [
                                  /* @__PURE__ */ e.jsxs("strong", { children: [
                                    t.source.label,
                                    " → ",
                                    t.receiver.label
                                  ] }),
                                  /* @__PURE__ */ e.jsx("em", { className: `gl-comp-suggestion-badge is-${o.category}`, children: i(o.label) }),
                                  /* @__PURE__ */ e.jsxs("span", { children: [
                                    t.interaction && t.interaction !== "other" ? `${t.interaction} · ` : "",
                                    i("{coefficient}% · shift {shift} MAD · slope {slope}", {
                                      coefficient: (t.coefficient * 100).toFixed(1),
                                      shift: ie(t.evidence.normalizedNegativeShift ?? 0, 3),
                                      slope: ie(t.evidence.residualSlope ?? 0, 4)
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
                                  checked: Cn.has(t.pairKey),
                                  "aria-label": i("Flag suggested {source} to {receiver} for follow-up", {
                                    source: t.source.label,
                                    receiver: t.receiver.label
                                  }),
                                  onChange: (m) => On(t.pairKey, m.currentTarget.checked)
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
                Dt(),
                zt()
              ]
            }
          ) : /* @__PURE__ */ e.jsx("div", { className: "gl-tab-placeholder gl-comp-empty", children: /* @__PURE__ */ e.jsx("p", { children: i(D ? "The compensated assay is installed, but its numerical profile record is unavailable for matrix inspection." : n.instrument === "cytof" ? "No CyTOF compensation profile is installed for this sample." : "This sample has no compatible embedded compensation matrix or imported profile.") }) }),
          (u || D) && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-advanced", role: "group", "aria-label": i("Advanced compensation tools"), children: [
            Bn.evidence && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-evidence", role: "region", "aria-labelledby": "comp-drawer-evidence-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: i("Matrix evidence") }),
              D ? j ? /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
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
                    /* @__PURE__ */ e.jsx("dd", { children: Ca(j, i) })
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
                      count: D.includedPnns.length,
                      status: V.state
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
                    /* @__PURE__ */ e.jsx("dd", { children: i(((Oi = j.provenance) == null ? void 0 : Oi.sourceDescription) ?? "No additional source note supplied") })
                  ] }),
                  /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("dt", { children: i("Estimation") }),
                    /* @__PURE__ */ e.jsx("dd", { children: i(((Di = j.provenance) == null ? void 0 : Di.estimationMethod) ?? "Imported coefficients preserved exactly") })
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
                    /* @__PURE__ */ e.jsx("small", { children: j.scientific.solverSettings.map(({ key: t, value: o }) => `${t}=${String(o)}`).join(" · ") })
                  ] })
                ] }),
                Fe && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-impact", "aria-label": i("Original versus Compensated preview"), children: [
                  /* @__PURE__ */ e.jsx("div", { className: "gl-comp-impact-head", children: /* @__PURE__ */ e.jsxs("div", { children: [
                    /* @__PURE__ */ e.jsx("h4", { children: i("Original → Compensated impact") }),
                    /* @__PURE__ */ e.jsx("span", { children: i("Deterministic preview of {events} evenly spaced events across {channels} solve channels", {
                      events: Fe.previewEvents.toLocaleString(),
                      channels: D.includedPnns.length
                    }) })
                  ] }) }),
                  /* @__PURE__ */ e.jsxs("dl", { children: [
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: i("Values changed") }),
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
                      /* @__PURE__ */ e.jsx("dt", { children: i("Median |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: ie(Fe.medianAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: i("Maximum |Δ|") }),
                      /* @__PURE__ */ e.jsx("dd", { children: ie(Fe.maxAbsoluteDelta, 5) })
                    ] }),
                    /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: i("Largest median shift") }),
                      /* @__PURE__ */ e.jsxs("dd", { title: Fe.mostChangedChannel, children: [
                        Fe.mostChangedChannel,
                        " · ",
                        ie(Fe.mostChangedChannelMedianDelta, 5)
                      ] })
                    ] }),
                    D.kind === "cytof-spillover" && /* @__PURE__ */ e.jsxs("div", { children: [
                      /* @__PURE__ */ e.jsx("dt", { children: i("Negative → zero") }),
                      /* @__PURE__ */ e.jsx("dd", { children: i("{count} preview values", { count: Fe.zeroedNegativeValues.toLocaleString() }) })
                    ] })
                  ] })
                ] })
              ] }) : /* @__PURE__ */ e.jsx("p", { children: i("{profile} · {method} · {count} exact $PnN channel bindings · {status}. The numerical profile record is not available in this live workspace state.", {
                profile: D.profileId,
                method: at,
                count: D.includedPnns.length,
                status: V.state
              }) }) : /* @__PURE__ */ e.jsx("p", { children: i("Embedded $SPILLOVER · {channels} matched channels · {warnings} coefficient warnings.", {
                channels: ee.channels.length,
                warnings: Lt.length || i("no")
              }) })
            ] }),
            Bn.review && /* @__PURE__ */ e.jsxs("section", { id: "comp-drawer-review", role: "region", "aria-labelledby": "comp-drawer-review-button", className: "gl-comp-drawer-region", children: [
              /* @__PURE__ */ e.jsx("h3", { children: i("Review queue") }),
              /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: i("Matrix integrity") }),
                rt.length > 0 ? /* @__PURE__ */ e.jsx("ul", { children: rt.map((t) => /* @__PURE__ */ e.jsx("li", { children: i(t) }, t)) }) : /* @__PURE__ */ e.jsx("p", { children: i("No matrix-level items currently require review.") })
              ] }),
              V.state === "ready" && u && /* @__PURE__ */ e.jsxs("div", { className: "gl-comp-review-section", children: [
                /* @__PURE__ */ e.jsx("h4", { children: i("Residual-evidence shortlist") }),
                /* @__PURE__ */ e.jsx("p", { children: i("Relative ranking of {screened}{candidateSuffix} non-zero or physically plausible pairs. It combines receiver-negative population shift, robust residual slope, upper-tail departure{zeroSuffix}.{modeNote} A high rank is a prompt to inspect, not proof that a coefficient is wrong.", {
                  screened: Me.screenedCount.toLocaleString(),
                  candidateSuffix: Me.candidateCount > Me.screenedCount ? i(" of {count}", { count: Me.candidateCount.toLocaleString() }) : "",
                  zeroSuffix: u.kind === "cytof" ? i(", and new exact-zero pile") : "",
                  modeNote: i(Ve === "biological" ? " Broad positive association is excluded because biological co-expression and cell size can mimic spill." : " Positive residual association is enabled because control-data mode is active.")
                }) }),
                Me.items.length > 0 ? /* @__PURE__ */ e.jsx("div", { className: "gl-comp-review-candidates", children: Me.items.map((t) => /* @__PURE__ */ e.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => Pi(t.sourceIndex, t.receiverIndex),
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
                          shift: ie(t.evidence.normalizedNegativeShift ?? 0, 3),
                          slope: ie(t.evidence.residualSlope ?? 0, 4)
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
          zs && u && /* @__PURE__ */ e.jsx(
            ia,
            {
              profileLabel: (j == null ? void 0 : j.name) ?? (me ? "SCE_spillover" : "embedded_FCS"),
              installedLabel: i(
                j ? "Installed matrix" : me ? "SCE spillover matrix" : "Embedded FCS matrix"
              ),
              installedMatrix: {
                sourceChannels: u.sourceAxisKeys,
                receiverChannels: u.receiverAxisKeys,
                matrix: u.matrix
              },
              workingMatrix: Ws,
              pendingEditCount: Object.keys(Y).length,
              onClose: () => mi(!1)
            }
          ),
          _s && /* @__PURE__ */ e.jsx(
            Qr,
            {
              sampleName: s,
              populationName: (Q == null ? void 0 : Q.name) ?? i("All Events"),
              filterLabel: Ci,
              pairCount: wi.length,
              onExport: hr,
              onClose: () => pi(!1)
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
function Ma(n, s) {
  const r = n.visible !== !1, a = s.visible !== !1;
  return r || a ? !1 : n.sample === s.sample && n.stateKey === s.stateKey;
}
const Aa = S.memo(Sa, Ma);
export {
  Aa as CompensationTab
};
