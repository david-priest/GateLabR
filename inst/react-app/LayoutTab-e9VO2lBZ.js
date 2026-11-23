import { V as sv, W as Ln, X as ya, u as It, j as g, Y as le, Z as ta, _ as qc, $ as ir, a0 as ia, a1 as vf, a2 as te, a3 as Ti, a4 as Lr, a5 as ki, a6 as Gn, a7 as lv, a8 as cv, a9 as uv, r as $, aa as dv, ab as fv, ac as rl, F as ba, o as ls, t as Uc, C as pv, ad as hv, ae as Zc, af as Jc, ag as Qc, ah as An, ai as Ma, aj as gv, ak as _i, s as mf, z as cs, al as us, am as oa, an as ji, ao as xf, ap as vv, aq as yf, ar as bf, f as mv, as as al, at as xv, au as or, w as yv, av as Ii, aw as wf, ax as Sf, ay as bv, az as tu, aA as wv, aB as Cf, aC as il, aD as ds, aE as Sv, aF as Cv, aG as kv, aH as kf, aI as Dr, aJ as Ef, aK as Zi, aL as Mf, aM as Wn, aN as Df, aO as Ri, aP as Ev, aQ as eu, aR as Tf, aS as _f, aT as ln, aU as Mv, aV as Dv, aW as Tv, aX as _v, aY as jv, aZ as Io, a_ as fs, a$ as nu, b0 as Iv, b1 as Rv, b2 as Pv, b3 as Nv, b4 as ru, b5 as Ov, b6 as Av, b7 as zv, b8 as Lv, b9 as Fv, ba as Bv, bb as Gv, bc as jf, bd as If, be as ps, bf as au, bg as iu, bh as ou, bi as $v, bj as Wv, bk as Yv, bl as Hv, bm as Xv, bn as Vv, bo as su, bp as Kv, bq as qv, br as Uv, bs as lu, bt as Zv, bu as Mn, bv as Ro, bw as Jv, H as cu, bx as Qv, by as tm, bz as em, bA as uu, bB as ri, bC as nm, bD as Po, bE as rm, bF as am, bG as Rf, bH as im, bI as om, bJ as mr, bK as du, bL as sm, bM as lm, bN as cm, bO as fu, bP as um, bQ as dm, bR as fm, bS as pu, bT as Pi, bU as No, bV as Pf, bW as hu, bX as gu, bY as Nf, bZ as pm, b_ as hm, b$ as gm, c0 as vm, c1 as mm, c2 as xm, c3 as ym, c4 as bm, c5 as vu, c6 as wm, c7 as Sm, c8 as mu, c9 as Cm, ca as Of, cb as xu, cc as yu, cd as km, ce as Em, cf as Mm, cg as Dm, ch as Tm, ci as _m, cj as jm, ck as Im, cl as Rm, cm as Pm, l as Oo, cn as bu, co as wu, cp as Su, cq as Nm, cr as Cu } from "./embed-D_eRnync.js";
const Vn = ["bold", "italic", "sup", "sub"], Om = { b: "bold", i: "italic", sup: "sup", sub: "sub" }, Am = { bold: "b", italic: "i", sup: "sup", sub: "sub" }, zm = 0.7, Lm = 0.2;
function Fm(t, e) {
  return Vn.every((n) => !t[n] == !e[n]);
}
function ol(t) {
  const e = {};
  for (const n of Vn) t[n] && (e[n] = !0);
  return e.sup && e.sub && delete e.sub, e;
}
function Fr(t) {
  const e = [];
  for (const n of t) {
    if (!n.text) continue;
    const r = e.at(-1);
    r && Fm(r, n) ? r.text += n.text : e.push({ ...ol(n), text: n.text });
  }
  return e;
}
function Af(t) {
  const e = [], n = { bold: 0, italic: 0, sup: 0, sub: 0 };
  let r = "";
  const a = () => {
    if (!r) return;
    const s = {};
    for (const l of Vn) n[l] > 0 && (s[l] = !0);
    e.push({ ...s, text: r }), r = "";
  }, i = /<(\/?)(b|i|sup|sub)>|&(lt|amp);/g;
  let o = 0;
  for (let s = i.exec(t); s; s = i.exec(t)) {
    if (r += t.slice(o, s.index), o = i.lastIndex, s[3]) {
      r += s[3] === "lt" ? "<" : "&";
      continue;
    }
    const l = Om[s[2]];
    s[1] && n[l] === 0 || (a(), n[l] += s[1] ? -1 : 1);
  }
  return r += t.slice(o), a(), Fr(e);
}
function Bm(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
function Gm(t) {
  return Fr(t).map((e) => {
    const n = Vn.filter((r) => e[r]).map((r) => Am[r]);
    return n.map((r) => `<${r}>`).join("") + Bm(e.text) + [...n].reverse().map((r) => `</${r}>`).join("");
  }).join("");
}
function Ni(t, e) {
  return e ? Af(t) : t ? [{ text: t }] : [];
}
function zf(t) {
  return t.map((e) => e.text).join("");
}
function Lf(t) {
  return t.rich ? zf(Af(t.text)) : t.text;
}
function $m(t) {
  return t.some((e) => Vn.some((n) => e[n]));
}
function Ff(t) {
  return $m(t) ? { text: Gm(t), rich: !0 } : { text: zf(t), rich: !1 };
}
function Wm(t) {
  return t.flatMap((e) => [...e.text].map((n) => ({ ch: n, marks: ol(e) })));
}
function sl(t) {
  return Fr(t.map((e) => ({ ...e.marks, text: e.ch })));
}
function hs(t, e, n) {
  const r = Ji(t), a = Math.min(e, n), i = Math.max(e, n), o = a === i ? r.filter((l) => l.at === (a > 0 ? a - 1 : 0)) : r.filter((l) => l.at >= a && l.at < i), s = { bold: !1, italic: !1, sup: !1, sub: !1 };
  if (!o.length) return s;
  for (const l of Vn) s[l] = o.every((c) => c.marks[l] === !0);
  return s;
}
function Ji(t) {
  let e = 0;
  return Wm(t).map((n) => {
    const r = { ...n, at: e };
    return e += n.ch.length, r;
  });
}
function ll(t, e, n) {
  const r = { ...t };
  return n ? (r[e] = !0, e === "sup" && delete r.sub, e === "sub" && delete r.sup) : delete r[e], r;
}
function Ym(t, e, n, r) {
  const a = Math.min(e, n), i = Math.max(e, n);
  if (a === i) return Fr(t);
  const o = !hs(t, a, i)[r];
  return sl(Ji(t).map((s) => s.at >= a && s.at < i ? { ch: s.ch, marks: ll(s.marks, r, o) } : s));
}
function ku(t, e) {
  let n = {};
  for (const r of Vn) t[r] && (n[r] = !0);
  for (const r of e) n = ll(n, r, !n[r]);
  return n;
}
function Hm(t, e, n, r, a) {
  const i = Math.min(e, n), o = Math.max(e, n), s = Ji(t), l = s.filter((u) => u.at < i), c = s.filter((u) => u.at >= o);
  return sl([...l, ...[...r].map((u) => ({ ch: u, marks: ol(a) })), ...c]);
}
const Xm = ["bright", "dim", "int", "hi", "lo"];
function Vm(t) {
  const e = Ji(t), n = e.map((i) => i.ch).join(""), r = /* @__PURE__ */ new Set(), a = (i) => /[A-Za-z]/.test(i) && /[A-Z0-9]/.test(i);
  for (const i of n.matchAll(/[A-Za-z0-9]+/g)) {
    const o = i[0], l = (i.index ?? 0) + o.length, c = Xm.find((f) => o.endsWith(f) && o.length > f.length);
    if (c) {
      const f = o.slice(0, -c.length);
      if (/[A-Z0-9]$/.test(f) && a(f)) for (let d = l - c.length; d < l; d++) r.add(d);
    }
    const u = n[l] === "−" ? "-" : n[l];
    if ((u === "+" || u === "-") && a(o)) {
      const f = n[l + 1];
      (f === void 0 || !/[A-Za-z0-9]/.test(f) || u === "+" && /[A-Z]/.test(f)) && r.add(l);
    }
  }
  return sl(e.map((i) => r.has(i.at) ? { ch: i.ch, marks: ll(i.marks, "sup", !0) } : i));
}
const Km = { B: "bold", STRONG: "bold", I: "italic", EM: "italic", SUP: "sup", SUB: "sub" };
function qm(t, e = document) {
  let n = e.createTextNode(t.text);
  for (const [r, a] of [["sub", "sub"], ["sup", "sup"], ["italic", "i"], ["bold", "b"]]) {
    if (!t[r]) continue;
    const i = e.createElement(a);
    i.appendChild(n), n = i;
  }
  return n;
}
function Eu(t, e) {
  var n;
  if (t.replaceChildren(...e.map((r) => qm(r, t.ownerDocument))), (n = e.at(-1)) != null && n.text.endsWith(`
`)) {
    const r = t.ownerDocument.createElement("br");
    r.dataset.tail = "", t.appendChild(r);
  }
}
function Bf(t, e) {
  const n = {};
  for (let r = t; r && r !== e; r = r.parentNode) {
    const a = r.nodeType === 1 ? Km[r.tagName] : void 0;
    a && (n[a] = !0);
  }
  return n;
}
function cl(t) {
  const e = [];
  let n = 0;
  const r = (i) => {
    for (const o of Array.from(i.childNodes))
      if (o.nodeType === 3) {
        const s = o.data.length;
        e.push({ node: o, start: n, length: s }), n += s;
      } else o.nodeName === "BR" ? (e.push({ node: o, start: n, length: 1 }), n += 1) : r(o);
  };
  r(t);
  const a = e.at(-1);
  return a && a.node.nodeName === "BR" && Um(a.node, t) && e.pop(), e;
}
function Um(t, e) {
  for (let n = t; n && n !== e; n = n.parentNode) if (n.nextSibling) return !1;
  return !0;
}
function Zm(t) {
  return Fr(cl(t).map((e) => ({ ...Bf(e.node, t), text: e.node.nodeType === 3 ? e.node.data : `
` })));
}
function Mu(t, e, n) {
  const r = cl(t);
  if (e.nodeType === 3) {
    const o = r.find((s) => s.node === e);
    return o ? o.start + Math.min(n, o.length) : 0;
  }
  const a = e.childNodes[n] ?? null;
  let i = 0;
  for (const o of r)
    (a ? (a.compareDocumentPosition(o.node) & Node.DOCUMENT_POSITION_PRECEDING) !== 0 && !a.contains(o.node) : e.contains(o.node) || (e.compareDocumentPosition(o.node) & Node.DOCUMENT_POSITION_PRECEDING) !== 0) && (i += o.length);
  return i;
}
function Du(t, e) {
  const n = cl(t);
  for (const a of n)
    if (a.node.nodeType === 3) {
      if (e <= a.start + a.length) return { node: a.node, offset: Math.max(0, e - a.start) };
    } else if (e <= a.start) {
      const i = a.node.parentNode;
      return { node: i, offset: Array.prototype.indexOf.call(i.childNodes, a.node) };
    }
  const r = n.at(-1);
  if (r && r.node.nodeType !== 3) {
    const a = r.node.parentNode;
    return { node: a, offset: Array.prototype.indexOf.call(a.childNodes, r.node) + 1 };
  }
  return { node: t, offset: t.childNodes.length };
}
function Ao(t) {
  const e = t.ownerDocument.getSelection();
  if (!e || !e.rangeCount) return null;
  const n = e.getRangeAt(0);
  return !t.contains(n.startContainer) || !t.contains(n.endContainer) ? null : { start: Mu(t, n.startContainer, n.startOffset), end: Mu(t, n.endContainer, n.endOffset) };
}
function Tu(t, e, n) {
  const r = t.ownerDocument.getSelection();
  if (!r) return;
  const a = Du(t, e), i = Du(t, n), o = t.ownerDocument.createRange();
  o.setStart(a.node, a.offset), o.setEnd(i.node, i.offset), r.removeAllRanges(), r.addRange(o);
}
const Jm = /* @__PURE__ */ new Set(["text", "shape"]);
function xe(t) {
  return t.recipe.kind === "text" && typeof t.recipe.letterFor == "string" && t.recipe.letterFor !== "";
}
function ul(t) {
  return !Jm.has(t.recipe.kind);
}
function _r(t) {
  return { ...sv, ...t.letterStyle ?? {} };
}
function Qm(t, e = "upper") {
  let n = Math.max(0, Math.floor(t)) + 1, r = "";
  for (; n > 0; ) {
    const a = (n - 1) % 26;
    r = String.fromCharCode(65 + a) + r, n = Math.floor((n - 1) / 26);
  }
  return e === "lower" ? r.toLowerCase() : r;
}
function t0(t, e) {
  return Math.min(t.y + t.height, e.y + e.height) - Math.max(t.y, e.y) > Math.min(t.height, e.height) / 2;
}
function Gf(t) {
  const e = [...t].sort((r, a) => r.y - a.y || r.x - a.x), n = [];
  for (const r of e) {
    const a = n.find((i) => i.some((o) => t0(o, r)));
    a ? a.push(r) : n.push([r]);
  }
  return n.sort((r, a) => Math.min(...r.map((i) => i.y)) - Math.min(...a.map((i) => i.y))), n.flatMap((r) => r.sort((a, i) => a.x - i.x || a.y - i.y));
}
function Da(t) {
  const e = new Map(t.items.map((r) => [r.id, r])), n = /* @__PURE__ */ new Map();
  for (const r of t.items) {
    if (!xe(r)) continue;
    const a = e.get(r.recipe.letterFor);
    !a || !ul(a) || n.has(a.id) || n.set(a.id, r);
  }
  return n;
}
function $f(t) {
  const e = Da(t), n = t.items.filter((a) => e.has(a.id)), r = _r(t);
  return new Map(Gf(n).map((a, i) => [e.get(a.id).id, Qm(i, r.case)]));
}
function Wf(t, e) {
  return {
    width: Math.max(24, Math.ceil(e.fontSize * 0.8 * Math.max(1, t.length) + 6)),
    height: Math.max(20, Math.ceil(e.fontSize * 1.2 + 6))
  };
}
function gs(t) {
  return { x: -t.width + 4, y: -t.height + 6 };
}
function Yf(t, e, n, r, a) {
  const i = Ln(t.page), o = ya(t.page), s = o.find((l) => e.x >= l.x && e.x < l.x + i.width && e.y >= l.y && e.y < l.y + i.height) ?? o[0] ?? { x: 0, y: 0 };
  return {
    x: Math.round(Math.min(s.x + i.width - a.width, Math.max(s.x, n))),
    y: Math.round(Math.min(s.y + i.height - a.height, Math.max(s.y, r)))
  };
}
function dl(t, e) {
  if (!t.items.some(xe)) return;
  const n = Da(t), r = new Set([...n.values()].map((s) => s.id));
  t.items = t.items.filter((s) => !xe(s) || r.has(s.id));
  const a = $f(t), i = _r(t), o = new Map(((e == null ? void 0 : e.items) ?? []).map((s) => [s.id, s]));
  for (const [s, l] of n) {
    const c = t.items.find((k) => k.id === s), u = l.recipe, f = a.get(l.id) ?? "", d = Wf(f, i);
    let h = u.letterOffset ?? gs(d);
    const m = o.get(l.id), v = o.get(s), y = !!m && (m.x !== l.x || m.y !== l.y), b = !v || v.x !== c.x || v.y !== c.y;
    y && !b && (h = { x: Math.round(l.x - c.x), y: Math.round(l.y - c.y) });
    const S = Yf(t, c, c.x + h.x, c.y + h.y, d), C = { ...u, text: f, fontSize: i.fontSize, letterOffset: h };
    i.bold ? C.bold = !0 : delete C.bold, l.recipe = C, l.x = S.x, l.y = S.y, l.width = d.width, l.height = d.height, l.showFrame = !1, c.group ? l.group = c.group : delete l.group, c.locked ? l.locked = !0 : l.locked = !1;
  }
}
function _u(t, e) {
  for (const n of e.sheets) dl(n, (t == null ? void 0 : t.sheets.find(({ id: r }) => r === n.id)) ?? null);
  return e;
}
function ju(t, e, n = () => crypto.randomUUID()) {
  const r = Da(t), a = t.items.filter((l) => ul(l) && !r.has(l.id) && (!e || e.length === 0 || e.includes(l.id)));
  if (!a.length) return [];
  let i = Math.max(0, ...t.items.map((l) => l.z));
  const o = _r(t), s = [];
  for (const l of a) {
    const c = Wf("A", o), u = Yf(t, l, l.x + gs(c).x, l.y + gs(c).y, c), f = n();
    s.push(f), t.items.push({
      id: f,
      x: u.x,
      y: u.y,
      width: c.width,
      height: c.height,
      z: ++i,
      recipe: { kind: "text", text: "", fontSize: o.fontSize, letterFor: l.id, letterOffset: { x: u.x - l.x, y: u.y - l.y } }
    });
  }
  return dl(t), s;
}
function Iu(t, e) {
  const n = !e || e.length === 0, r = t.items.length;
  t.items = t.items.filter((i) => !xe(i) || !(n || e.includes(i.id) || e.includes(i.recipe.letterFor)));
  const a = r - t.items.length;
  return a && dl(t), a;
}
function Ru(t, e) {
  t.letterStyle = { ..._r(t), ...e };
}
function Hf(t, e) {
  const n = [...e];
  for (const r of Da(t).values())
    xe(r) && e.includes(r.recipe.letterFor) && !n.includes(r.id) && n.push(r.id);
  return n;
}
function zo(t, e) {
  const n = Da(t), r = e.length ? t.items.filter((a) => e.includes(a.id)) : t.items;
  return {
    canAdd: r.some((a) => ul(a) && !n.has(a.id)),
    canRemove: r.some((a) => n.has(a.id) || xe(a) && [...n.values()].includes(a))
  };
}
function e0({
  canAdd: t,
  canRemove: e,
  onAdd: n,
  onRemove: r
}) {
  const { t: a } = It();
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: n, disabled: !t, title: a("Letter each selected plot, chart or figure at its top left, in reading order; with nothing selected, every one on the sheet. An item that has a letter keeps it."), children: a("Panel letters") }),
    /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: r, disabled: !e, title: a("Remove the panel letters of the selection; with nothing selected, every panel letter on the sheet"), children: a("Remove panel letters") })
  ] });
}
function Xf({
  style: t,
  onChange: e
}) {
  const { t: n } = It();
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-letter-style", role: "group", "aria-label": n("Panel letters"), children: [
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("Letter size"),
      /* @__PURE__ */ g.jsx(le, { "aria-label": n("Letter size"), min: 6, max: 72, integer: !0, value: t.fontSize, onCommit: (r) => e({ fontSize: r }) })
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ g.jsx("input", { type: "checkbox", "aria-label": n("Bold"), checked: t.bold, onChange: (r) => e({ bold: r.target.checked }) }),
      n("Bold")
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("Letters"),
      /* @__PURE__ */ g.jsxs("select", { "aria-label": n("Letters"), value: t.case, onChange: (r) => e({ case: r.target.value === "lower" ? "lower" : "upper" }), children: [
        /* @__PURE__ */ g.jsx("option", { value: "upper", children: n("A, B, C") }),
        /* @__PURE__ */ g.jsx("option", { value: "lower", children: n("a, b, c") })
      ] })
    ] })
  ] });
}
function n0({
  style: t,
  onChange: e
}) {
  const { t: n } = It();
  return /* @__PURE__ */ g.jsxs("section", { className: "gl-layout-letter-section", children: [
    /* @__PURE__ */ g.jsx("h4", { children: n("Panel letters") }),
    /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: n("How the sheet's panel letters are drawn. A letter sits at the top left of its item and moves with it; letters are given in reading order, rows from the top and left to right within a row, and renumber when items move.") }),
    /* @__PURE__ */ g.jsx(Xf, { style: t, onChange: e })
  ] });
}
function r0({
  owner: t,
  style: e,
  onChange: n
}) {
  const { t: r } = It();
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx("p", { className: "gl-layout-letter-owner", children: r("Panel letter of {item}", { item: t }) }),
    /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: r("The letter is its item's place in reading order and is not edited as text. Drag it to set where it sits against its item; its size and style are the sheet's.") }),
    /* @__PURE__ */ g.jsx(Xf, { style: e, onChange: n })
  ] });
}
const Oi = "Unassigned";
function Vf(t) {
  const e = {};
  for (const [n, r] of Object.entries(t[0] ?? {}))
    t.every((a) => (a == null ? void 0 : a[n]) === r) && (e[n] = r);
  return e;
}
function vs(t, e, n, r) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(n) : i === "N" ? String(r) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function Lo(t, e, n, r, a, i) {
  var c;
  const o = Lr(t), s = { ...t.recipe };
  let l;
  if (s.kind === "text") s.text = vs(s.text, s.readsFrom ? null : e, n, r);
  else {
    if (o && e && s.kind === "proportions") {
      const u = e.sampleIds ?? (e.populationId ? null : [e.id]);
      if (u && (s.settings = { ...s.settings, files: [...u] }, s.panel && !("legend" in s.panel))) {
        const { group: f, facet: d, ...h } = s.panel;
        s.panel = h;
      }
    } else o && e && e.populationId ? ("populationId" in s && (s.populationId = e.populationId), s.kind === "strategy" && ((c = s.populationIds) != null && c.length) && (s.populationIds = [e.populationId]), (s.kind === "biplot" || s.kind === "histogram") && s.populationIds && delete s.populationIds) : o && e && e.sampleIds ? ((s.kind === "biplot" || s.kind === "histogram") && e.sampleIds.length > 1 ? s.pool = { sampleIds: [...e.sampleIds] } : "pool" in s && delete s.pool, "sampleId" in s && !e.sampleIds.includes(s.sampleId) && e.sampleIds.length && (l = s.sampleId, s.sampleId = e.sampleIds[0])) : o && e && "sampleId" in s && ("pool" in s && delete s.pool, s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id));
    s.title && (s.title = vs(s.title, o ? e : null, n, r));
  }
  return {
    ...t,
    id: i === 0 && !a.x && !a.y ? t.id : `${t.id}::${i}`,
    templateId: t.id,
    unitId: o && e ? e.id : void 0,
    ...l ? { templateSampleId: l } : {},
    x: t.x + a.x,
    y: t.y + a.y,
    offset: a,
    position: { n, total: r },
    recipe: s
  };
}
function a0(t, e) {
  if (e)
    for (const n of t) {
      if (n.recipe.kind !== "text" || !n.recipe.readsFrom) continue;
      const r = n.recipe.readsFrom, a = t.find((o) => o.templateId === r && o.offset.x === n.offset.x && o.offset.y === n.offset.y);
      if (!a || !te(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId, a.unitId);
      i && (n.recipe = { ...n.recipe, text: Ti(n.recipe.text, i) });
    }
}
function i0(t, e, n) {
  const r = o0(t, e);
  for (const a of r) a0(a.items, n);
  return r;
}
function o0(t, e) {
  const n = t.iteration ?? vf;
  if (n.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((h) => Lo(h, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const r = e.length;
  if (n.arrangement.kind === "page-per-unit")
    return e.map((h, m) => ({
      index: m,
      units: [h],
      items: t.items.map((v) => Lo(v, h, m + 1, r, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = n.arrangement, l = ir(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const c = a * i, u = l.width + s, f = l.height + s, d = [];
  for (let h = 0; h < r; h += c) {
    const m = e.slice(h, h + c), v = [];
    m.forEach((y, b) => {
      const S = o === "row-major" ? Math.floor(b / i) : b % a, k = { x: (o === "row-major" ? b % i : Math.floor(b / a)) * u, y: S * f };
      for (const M of t.items) v.push(Lo(M, y, h + b + 1, r, k, b));
    }), d.push({ index: d.length, units: m, items: v });
  }
  return d;
}
function Kf(t, e, n, r) {
  return e.filter((a) => {
    var i;
    return t.kind === "all" ? !0 : t.kind === "checked" ? n.includes(a.id) : t.kind === "group" ? r[a.id] === t.groupId : (((i = a.metadata) == null ? void 0 : i[t.column]) ?? "") === t.value;
  });
}
function s0(t, e, n, r, a) {
  const i = (o) => {
    var s;
    return {
      id: o.id,
      name: o.name,
      fileName: o.fileName ?? o.name,
      groupName: (s = r.find((l) => l.id === a[o.id])) == null ? void 0 : s.name,
      metadata: o.metadata
    };
  };
  return Kf(t.source, e, n, a).map(i);
}
function l0(t, e, n, r, a, i) {
  var d;
  const o = t.column ?? "";
  if (!o) return [];
  const s = /* @__PURE__ */ new Map(), l = [];
  for (const h of Kf(t.source, e, n, a)) {
    const m = ((d = h.metadata) == null ? void 0 : d[o]) ?? "";
    if (!m) {
      l.push(h);
      continue;
    }
    s.set(m, [...s.get(m) ?? [], h]);
  }
  const c = [...s.keys()], u = i ? [...i.filter((h) => s.has(h)), ...c.filter((h) => !i.includes(h)).sort(qc)] : c.sort(qc), f = (h, m) => {
    const v = new Set(m.map((y) => {
      var b;
      return (b = r.find((S) => S.id === a[y.id])) == null ? void 0 : b.name;
    }));
    return {
      id: `meta:${o}=${h}`,
      name: h,
      fileName: `${m.length} files`,
      ...v.size === 1 && [...v][0] ? { groupName: [...v][0] } : {},
      // What the files share, and the value itself, so {meta:column} names the page, the files
      // without a value included.
      metadata: { ...Vf(m.map((y) => y.metadata)), [o]: h },
      sampleIds: m.map((y) => y.id)
    };
  };
  return [
    ...u.map((h) => f(h, s.get(h))),
    ...l.length ? [f(Oi, l)] : []
  ];
}
function c0(t, e, n) {
  var o;
  const r = e.root_population_id, a = ((o = t.populations) == null ? void 0 : o.kind) === "branch" ? t.populations.populationId : null, i = (s) => {
    var c, u;
    if (!a) return !0;
    let l = (c = e.populations[s]) == null ? void 0 : c.parent_id;
    for (; l; ) {
      if (l === a) return !0;
      l = (u = e.populations[l]) == null ? void 0 : u.parent_id;
    }
    return !1;
  };
  return ta(e.populations, r).filter(({ popId: s }) => s !== r && i(s)).map(({ popId: s }) => {
    var l;
    return {
      id: s,
      name: ((l = e.populations[s]) == null ? void 0 : l.name) ?? s,
      fileName: n.fileName ?? n.name,
      sampleName: n.name,
      // The page is one file's, so {meta:column} and {group} read that file.
      ...n.groupName ? { groupName: n.groupName } : {},
      ...n.metadata ? { metadata: n.metadata } : {},
      populationId: s
    };
  });
}
function Pu(t, e) {
  const n = ir(t.items);
  if (!n) return { columns: 1, rows: 1 };
  const r = ia(t.page.marginMm), a = (i, o, s) => Math.max(1, Math.min(u0, Math.floor((s - r - i + e) / Math.max(1, o + e))));
  return { columns: a(n.x, n.width, t.width), rows: a(n.y, n.height, t.height) };
}
const u0 = 12;
function d0(t, e) {
  return t.filter((n) => n.x + n.width > e.width + 0.5 || n.y + n.height > e.height + 0.5 || n.x < -0.5 || n.y < -0.5).length;
}
function f0(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const p0 = { identity: "linear", asinh: "arcsinh", logicle: "logicle" }, fl = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function pl(t, e, n, r, a) {
  var b, S, C, k, M;
  const i = e.find((E) => E.id === t.sampleId) ?? null, o = ((b = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : b.name) ?? "the population", s = t.files === "all" ? e : e.filter((E) => r.includes(E.id)), l = [], c = [], u = [], f = /* @__PURE__ */ new Set();
  for (const E of s) {
    let D = t.populationId;
    if (i && i.tree.id !== E.tree.id) {
      const _ = ki(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        E.tree,
        Gn(a)
      );
      if (!_.id) {
        c.push(E.name);
        continue;
      }
      D = _.id;
    }
    let j;
    if (t.statistic === "median") {
      const _ = t.channel ? E.sample.index(t.channel) : void 0, x = E.derived.masks[D];
      if (_ === void 0) {
        u.push(E.name);
        continue;
      }
      if (!x) {
        c.push(E.name);
        continue;
      }
      f.add(p0[E.sample.transformKind(_)] ?? E.sample.transformKind(_));
      const P = E.sample.displayColumn(_), I = [];
      for (let A = 0; A < P.length; A++) x[A] && Number.isFinite(P[A]) && I.push(P[A]);
      j = I.length ? lv(I) : null;
    } else if (j = E.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][D], j === void 0) {
      c.push(E.name);
      continue;
    }
    if (typeof j != "number" || !Number.isFinite(j)) continue;
    const R = t.groupBy ? ((C = (S = n[E.id]) == null ? void 0 : S[t.groupBy]) == null ? void 0 : C.trim()) || Oi : E.name;
    l.push({ sampleId: E.id, name: E.name, group: R, value: j });
  }
  const d = cv(l), h = t.channel ? ((M = (i == null ? void 0 : i.sample) ?? ((k = s[0]) == null ? void 0 : k.sample)) == null ? void 0 : M.labelForKey(t.channel)) ?? t.channel : "", m = f.size ? ` (${[...f].join(", ")})` : "", v = t.statistic === "median" ? `Median ${h}`.trim() + m : fl[t.statistic], y = t.groupBy ? d.filter((E) => E.label !== Oi) : [];
  return { points: l, groups: d, test: t.test && t.groupBy ? uv(y) : null, population: o, axis: v, missing: c, noChannel: u };
}
const Fo = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), h0 = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function g0({
  data: t,
  recipe: e,
  style: n,
  width: r,
  height: a,
  title: i
}) {
  const o = n.fontTick, s = n.fontAxis, l = n.fontTitle, c = t.groups, u = $.useMemo(() => dv(t.points.map((x) => x.value)), [t.points]), f = 8 + s + 6 + Math.max(...u.ticks.map((x) => Fo(x).length), 1) * o * 0.6 + 8, d = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), h = Math.max(0, ...c.map((x) => x.label.length)), m = c.length > 0 && h * o * 0.6 > (r - f - 8) / c.length, v = m ? fv(f, c.map((x) => x.label.length * o * 0.6), (x) => Math.max(20, r - x - 8), 45) : f, y = 8 + (m ? h * o * 0.45 + 10 : o + 8), b = Math.max(20, r - v - 8), S = Math.max(20, a - d - y), C = (x) => d + S - (x - u.min) / (u.max - u.min || 1) * S, k = c.length ? b / c.length : b, M = (x) => v + (x + 0.5) * k, E = Math.min(48, k * 0.6), D = n.pubStyle ? "#000000" : "#334155", j = n.pubStyle ? "#d4d4d8" : "#93c5fd", R = n.pubStyle ? "#000000" : "#1d4ed8", _ = C(Math.max(u.min, 0));
  return /* @__PURE__ */ g.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: r, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ g.jsxs("svg", { width: r, height: a, viewBox: `0 0 ${r} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ g.jsx("rect", { width: r, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ g.jsx("text", { x: r / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: D, children: i }),
    !t.points.length && /* @__PURE__ */ g.jsx("text", { x: r / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ g.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: D, children: [
      /* @__PURE__ */ g.jsx("line", { x1: v, x2: v, y1: d, y2: d + S, stroke: D }),
      u.ticks.map((x) => /* @__PURE__ */ g.jsxs("g", { children: [
        /* @__PURE__ */ g.jsx("line", { x1: v - 4, x2: v, y1: C(x), y2: C(x), stroke: D }),
        /* @__PURE__ */ g.jsx("text", { x: v - 6, y: C(x), textAnchor: "end", dominantBaseline: "central", children: Fo(x) })
      ] }, x)),
      /* @__PURE__ */ g.jsx("text", { transform: `translate(${8 + s} ${d + S / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ g.jsx("line", { x1: v, x2: v + b, y1: _, y2: _, stroke: D })
    ] }),
    /* @__PURE__ */ g.jsx("g", { className: "gl-layout-chart-groups", children: c.map((x, P) => {
      const I = M(P), A = e.showPoints || e.chartType === "dots" ? x.points : [];
      return /* @__PURE__ */ g.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(x.mean) && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
          /* @__PURE__ */ g.jsx("rect", { x: I - E / 2, y: Math.min(C(x.mean), _), width: E, height: Math.abs(_ - C(x.mean)), fill: j, stroke: D, strokeWidth: 0.8 }),
          x.n > 1 && x.sd > 0 && /* @__PURE__ */ g.jsxs("g", { stroke: D, strokeWidth: 1, children: [
            /* @__PURE__ */ g.jsx("line", { x1: I, x2: I, y1: C(x.mean - x.sd), y2: C(x.mean + x.sd) }),
            /* @__PURE__ */ g.jsx("line", { x1: I - E / 4, x2: I + E / 4, y1: C(x.mean + x.sd), y2: C(x.mean + x.sd) }),
            /* @__PURE__ */ g.jsx("line", { x1: I - E / 4, x2: I + E / 4, y1: C(x.mean - x.sd), y2: C(x.mean - x.sd) })
          ] })
        ] }),
        e.chartType === "box" && x.n > 0 && /* @__PURE__ */ g.jsxs("g", { stroke: D, strokeWidth: 1, fill: j, children: [
          /* @__PURE__ */ g.jsx("line", { x1: I, x2: I, y1: C(x.min), y2: C(x.q1) }),
          /* @__PURE__ */ g.jsx("line", { x1: I, x2: I, y1: C(x.q3), y2: C(x.max) }),
          /* @__PURE__ */ g.jsx("rect", { x: I - E / 2, y: C(x.q3), width: E, height: Math.max(0.5, C(x.q1) - C(x.q3)) }),
          /* @__PURE__ */ g.jsx("line", { x1: I - E / 2, x2: I + E / 2, y1: C(x.median), y2: C(x.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && x.n > 1 && /* @__PURE__ */ g.jsx("line", { x1: I - E / 2, x2: I + E / 2, y1: C(x.mean), y2: C(x.mean), stroke: D, strokeWidth: 2 }),
        A.map((B, q) => /* @__PURE__ */ g.jsx("circle", { cx: I + h0(q + P * 31) * E * 0.3, cy: C(B.value), r: Math.max(2, o * 0.28), fill: R, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ g.jsx("title", { children: `${B.name}: ${Fo(B.value)}` }) }, B.sampleId)),
        /* @__PURE__ */ g.jsx(
          "text",
          {
            x: I,
            y: d + S + 6,
            textAnchor: m ? "end" : "middle",
            dominantBaseline: "hanging",
            fontSize: o,
            fill: D,
            transform: m ? `rotate(-45 ${I} ${d + S + 6})` : void 0,
            children: x.label
          }
        )
      ] }, x.label || String(P));
    }) }),
    t.test && c.length >= 2 && /* @__PURE__ */ g.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: D, children: [
      /* @__PURE__ */ g.jsx("line", { x1: M(0), x2: M(c.length - 1), y1: d - 4, y2: d - 4, stroke: D }),
      /* @__PURE__ */ g.jsx("text", { x: (M(0) + M(c.length - 1)) / 2, y: d - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const hl = (t, e) => t.replace(/\{(\w+)\}/g, (n, r) => e && r in e ? String(e[r]) : n);
function v0(t) {
  const e = new Map(t.map((n) => [n.id, n]));
  return {
    fileName: (n) => {
      var r;
      return (r = e.get(n)) == null ? void 0 : r.name;
    },
    populationName: (n, r) => {
      var a, i;
      return (i = (a = e.get(n)) == null ? void 0 : a.tree.populations[r]) == null ? void 0 : i.name;
    }
  };
}
function qf(t, e = hl) {
  const n = t.recipe.kind;
  if (xe(t)) return e("Letter");
  switch (n) {
    case "biplot":
      return e("Plot");
    case "histogram":
      return e("Histogram");
    case "strategy":
      return e("Strategy");
    case "chart":
    case "proportions":
      return e("Chart");
    case "figure":
      return e("Figure");
    case "text":
      return e("Text");
    case "imagewall":
      return e("Images");
    case "cellpanel":
      return e("Cell panel");
    case "shape":
      return e("Shape");
    case "image":
      return e("Image");
    default:
      return n;
  }
}
function m0(t, e = 5) {
  const r = (t.split(`
`).map((a) => a.trim()).find(Boolean) ?? "").split(/\s+/).filter(Boolean);
  return r.length > e ? `${r.slice(0, e).join(" ")}…` : r.join(" ");
}
function ms(t, e, n = hl) {
  var o, s;
  const r = t.recipe;
  if (r.kind === "text")
    return xe(t) ? n("Panel letter {letter}", { letter: r.text || "?" }) : m0(r.text) || n("Text");
  if (r.kind === "figure") return ((s = (o = r.illustration.figure) == null ? void 0 : o.name) == null ? void 0 : s.trim()) || n("Figure");
  if (r.kind === "proportions") {
    const l = r.settings, c = l.valueKind === "cells" ? n("{channel} per cell", { channel: l.channel || n("Channel") }) : l.valueKind === "statistic" ? rl(l.statistic, l.channel || "channel") : l.plotType === "box" ? n("Boxplot") : n("Composition");
    if (!r.panel) return c;
    if ("legend" in r.panel) return `${c} · ${n("legend")}`;
    const u = r.panel, f = [u.population, u.group, u.facet, u.channel, u.page].filter((d) => !!d);
    return f.length ? `${c} · ${f.join(" · ")}` : c;
  }
  if (r.kind === "imagewall") return `${r.populationName || n("Population")} · ${r.fileName || n("images")}`;
  if (r.kind === "cellpanel") return `${r.cells.length === 1 ? n("1 cell") : n("{count} cells", { count: r.cells.length })} · ${r.fileName || n("images")}`;
  if (r.kind === "image") return r.fileName;
  if (!("sampleId" in r) || !("populationId" in r)) return qf(t, n);
  const a = e.populationName(r.sampleId, r.populationId) ?? n("Population");
  if (r.kind === "chart") return `${a} · ${n(fl[r.statistic])}`;
  if (r.kind === "strategy") return n("{population} strategy", { population: a });
  const i = (r.kind === "biplot" || r.kind === "histogram") && r.pool && r.pool.sampleIds.length > 1 ? r.pool.sampleIds.length : 0;
  return i ? `${a} · ${n("{count} files", { count: i })}` : `${a} · ${e.fileName(r.sampleId) ?? n("file")}`;
}
function x0(t, e, n = hl) {
  var r;
  return ((r = t.name) == null ? void 0 : r.trim()) || ms(t, e, n);
}
function y0(t, e, n) {
  const r = t.items.find((i) => i.id === e);
  if (!r) return;
  const a = n.trim();
  a ? r.name = a : delete r.name;
}
function b0(t, e, n) {
  for (const r of t.items)
    e.includes(r.id) && (n ? r.hidden = !0 : delete r.hidden);
}
function w0(t, e, n) {
  for (const r of t.items) e.includes(r.id) && (r.locked = n);
}
function Qi(t) {
  const e = /* @__PURE__ */ new Set();
  if (!t) return e;
  for (const n of t.items) n.hidden && e.add(n.id);
  if (!e.size) return e;
  for (const n of t.items) xe(n) && e.has(n.recipe.letterFor) && e.add(n.id);
  return e;
}
function S0(t, e) {
  const n = Qi(e);
  return n.size ? t.map((r) => ({ ...r, items: r.items.filter((a) => !n.has(a.templateId)) })) : t;
}
function Qn(t, e) {
  const n = [...e], r = Qi(t);
  if (!r.size) return n;
  const a = new Set(t.items.filter((i) => i.group && e.includes(i.id)).map((i) => i.group));
  for (const i of a) {
    const o = t.items.filter((s) => s.group === i);
    if (o.every((s) => r.has(s.id) || e.includes(s.id)))
      for (const s of o) r.has(s.id) && !n.includes(s.id) && n.push(s.id);
  }
  return n;
}
function C0(t, e) {
  const n = (o, s, l, c) => {
    const u = Math.abs(c - s) < 0.5 ? 1 : c / s;
    return { scale: u, shift: l - u * o };
  }, r = (o, s, l, c, u) => Math.abs(o.scale * s + o.shift - c) < 1 && Math.abs(o.scale * l - u) < 1, a = /* @__PURE__ */ new Map();
  for (const o of t.items) {
    const s = e[o.id];
    if (!s || !o.group) continue;
    const l = a.get(o.group);
    l === void 0 ? a.set(o.group, { x: n(o.x, o.width, s.x, s.width), y: n(o.y, o.height, s.y, s.height) }) : l && !(r(l.x, o.x, o.width, s.x, s.width) && r(l.y, o.y, o.height, s.y, s.height)) && a.set(o.group, null);
  }
  const i = Qn(t, Object.keys(e));
  for (const o of t.items) {
    const s = o.group ? a.get(o.group) : null;
    if (!(!s || e[o.id] || o.locked || !i.includes(o.id))) {
      if (s.x.scale === 1 && s.y.scale === 1) {
        o.x += s.x.shift, o.y += s.y.shift;
        continue;
      }
      o.x = Math.round(s.x.scale * o.x + s.x.shift), o.y = Math.round(s.y.scale * o.y + s.y.shift), o.width = Math.max(1, Math.round(s.x.scale * o.width)), o.height = Math.max(1, Math.round(s.y.scale * o.height));
    }
  }
}
function Uf(t) {
  const e = new Set(t.filter((n) => n.group && !n.hidden).map((n) => n.group));
  for (const n of t) n.hidden && !(n.group && e.has(n.group)) && delete n.hidden;
}
const k0 = (t) => `group:${t}`;
function gl(t) {
  const e = [...t.items].sort((a, i) => i.z - a.z), n = [], r = /* @__PURE__ */ new Set();
  for (const a of e) {
    if (!a.group) {
      n.push({ kind: "item", key: a.id, item: a });
      continue;
    }
    r.has(a.group) || (r.add(a.group), n.push({ kind: "group", key: k0(a.group), group: a.group, members: e.filter((i) => i.group === a.group) }));
  }
  return n;
}
function Nu(t) {
  return t.flatMap((e) => e.kind === "item" ? [e.item.id] : e.members.map((n) => n.id));
}
function Ou(t, e) {
  const n = new Map(t.items.map((r) => [r.id, r]));
  e.forEach((r, a) => {
    const i = n.get(r);
    i && (i.z = e.length - 1 - a);
  });
}
function Au(t, e, n) {
  const r = t.filter((o) => e.has(o));
  if (!r.length) return [...t];
  const a = t.slice(0, n).filter((o) => !e.has(o)), i = t.slice(n).filter((o) => !e.has(o));
  return [...a, ...r, ...i];
}
function Zf(t, e, n, r) {
  const a = gl(t), i = new Set(e);
  if (r) {
    const l = a.findIndex((d) => d.kind === "group" && d.group === r), c = a[l];
    if (!c || c.kind !== "group") return;
    const u = Au(c.members.map((d) => d.id), i, n), f = new Map(c.members.map((d) => [d.id, d]));
    a[l] = { ...c, members: u.map((d) => f.get(d)) }, Ou(t, Nu(a));
    return;
  }
  const o = new Map(a.map((l) => [l.key, l])), s = Au(a.map((l) => l.key), i, n);
  Ou(t, Nu(s.map((l) => o.get(l))));
}
function zu(t, e, n, r) {
  var c;
  const a = gl(t), i = r ? ((c = a.find((u) => u.kind === "group" && u.group === r)) == null ? void 0 : c.members.map((u) => u.id)) ?? [] : a.map((u) => u.key), o = new Set(e), s = i.map((u, f) => o.has(u) ? f : -1).filter((u) => u >= 0);
  if (!s.length) return;
  const l = n < 0 ? Math.max(0, s[0] - 1) : Math.min(i.length, s[s.length - 1] + 2);
  Zf(t, e, l, r);
}
function E0({ open: t }) {
  return /* @__PURE__ */ g.jsxs("svg", { width: "14", height: "12", viewBox: "0 0 14 12", "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ g.jsx("path", { d: "M1 6c1.6-2.8 3.6-4.2 6-4.2s4.4 1.4 6 4.2c-1.6 2.8-3.6 4.2-6 4.2S2.6 8.8 1 6z", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
    t ? /* @__PURE__ */ g.jsx("circle", { cx: "7", cy: "6", r: "1.8", fill: "currentColor" }) : /* @__PURE__ */ g.jsx("path", { d: "M2 11 12 1", stroke: "currentColor", strokeWidth: "1.2" })
  ] });
}
function M0({ sheet: t, selectedIds: e, samples: n, open: r, onOpenChange: a, onSelect: i, onChange: o }) {
  const { t: s } = It(), l = $.useMemo(() => v0(n), [n]), c = gl(t), u = Qi(t), f = new Set(e), [d, h] = $.useState(() => /* @__PURE__ */ new Set()), [m, v] = $.useState(null), [y, b] = $.useState(null), S = $.useRef(null), C = $.useRef(null), k = e[0];
  $.useEffect(() => {
    var N, W;
    if (!r || !k) return;
    const F = [...((N = C.current) == null ? void 0 : N.querySelectorAll("[data-object-id]")) ?? []].find((V) => V.dataset.objectId === k);
    (W = F == null ? void 0 : F.scrollIntoView) == null || W.call(F, { block: "nearest" });
  }, [r, k]);
  const M = (F, N) => {
    if (N.shiftKey || N.metaKey || N.ctrlKey) {
      const W = F.every((V) => f.has(V));
      i(W ? e.filter((V) => !F.includes(V)) : [...e, ...F.filter((V) => !f.has(V))]);
    } else i(F);
  }, E = (F) => M(F, { shiftKey: !0, metaKey: !1, ctrlKey: !1 }), D = (F, N, W) => {
    N.key === " " ? (N.preventDefault(), E(F)) : N.key === "F2" && W && (N.preventDefault(), W());
  }, j = (F, N, W) => {
    const X = (N ? c.find((J) => J.kind === "group" && J.group === N).members.map((J) => J.id) : c.map((J) => J.key)).filter((J) => f.has(J) || J.startsWith("group:") && c.find((et) => et.key === J).members.every((et) => f.has(et.id)));
    S.current = { keys: X.includes(F) ? X : [F], within: N }, W.dataTransfer.effectAllowed = "move", W.dataTransfer.setData("text/plain", F);
  }, R = (F, N, W) => {
    if (!S.current || S.current.within !== N) return;
    W.preventDefault(), W.stopPropagation();
    const V = W.currentTarget.getBoundingClientRect(), X = W.clientY - V.top > V.height / 2;
    b({ index: X ? F + 1 : F, within: N });
  }, _ = (F) => {
    F.preventDefault(), F.stopPropagation();
    const N = S.current, W = y;
    S.current = null, b(null), !(!N || !W || N.within !== W.within) && o((V) => Zf(V, N.keys, W.index, W.within));
  }, x = () => {
    S.current = null, b(null);
  }, P = (F, N) => y && y.within === N ? y.index === F ? " is-drop-before" : y.index === F + 1 ? " is-drop-after" : "" : "", I = (F, N, W = []) => [
    ...W,
    { label: s("Move up"), title: s("Draw it over the row above"), onClick: () => o((V) => zu(V, [F], -1, N)) },
    { label: s("Move down"), title: s("Draw it under the row below"), onClick: () => o((V) => zu(V, [F], 1, N)) }
  ], A = (F, N, W, V) => /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx(
      "button",
      {
        type: "button",
        className: "gl-layout-object-toggle",
        "aria-pressed": W,
        "aria-label": W ? s("Show {name}", { name: N }) : s("Hide {name}", { name: N }),
        title: s(W ? "Show: draw it on the page and in the export" : "Hide: not drawn, selected on the page or exported"),
        onClick: () => o((X) => b0(X, F, !W)),
        children: /* @__PURE__ */ g.jsx(E0, { open: !W })
      }
    ),
    /* @__PURE__ */ g.jsx(
      "button",
      {
        type: "button",
        className: `gl-layout-object-toggle${V ? "" : " is-off"}`,
        "aria-pressed": V,
        "aria-label": V ? s("Unlock {name}", { name: N }) : s("Lock {name}", { name: N }),
        title: s(V ? "Unlock: it can be moved and resized again" : "Lock: it keeps its place and size"),
        onClick: () => o((X) => w0(X, F, !V)),
        children: /* @__PURE__ */ g.jsx(hv, {})
      }
    )
  ] }), B = (F, N, W) => {
    const V = x0(F, l, s), X = u.has(F.id), J = () => v(F.id);
    return /* @__PURE__ */ g.jsxs(
      "li",
      {
        "data-object-id": F.id,
        className: `gl-layout-object${W ? " is-member" : ""}${f.has(F.id) ? " is-selected" : ""}${X ? " is-hidden" : ""}${P(N, W)}`,
        draggable: m !== F.id,
        onDragStart: (et) => j(F.id, W, et),
        onDragOver: (et) => R(N, W, et),
        onDrop: _,
        onDragEnd: x,
        children: [
          /* @__PURE__ */ g.jsx("span", { className: "gl-layout-object-kind", children: qf(F, s) }),
          m === F.id ? /* @__PURE__ */ g.jsx(
            D0,
            {
              initial: F.name ?? ms(F, l, s),
              label: s("Name of {name}", { name: V }),
              onCommit: (et) => {
                v(null), !(!F.name && et.trim() === ms(F, l, s)) && et.trim() !== (F.name ?? "") && o((at) => y0(at, F.id, et));
              },
              onCancel: () => v(null)
            }
          ) : /* @__PURE__ */ g.jsx(
            "button",
            {
              type: "button",
              className: "gl-layout-object-name",
              "aria-pressed": f.has(F.id),
              title: s("Click to select it on the page, Shift-click to add or remove; double-click to rename"),
              onClick: (et) => M([F.id], et),
              onDoubleClick: J,
              onKeyDown: (et) => D([F.id], et, J),
              onKeyUp: (et) => {
                et.key === " " && et.preventDefault();
              },
              children: V
            }
          ),
          A([F.id], V, X, F.locked === !0),
          /* @__PURE__ */ g.jsx(
            ls,
            {
              label: s("Actions for {name}", { name: V }),
              icon: /* @__PURE__ */ g.jsx(Uc, { size: 12 }),
              className: "gl-layout-object-menu",
              items: I(F.id, W, [{ label: s("Rename"), onClick: J }])
            }
          )
        ]
      },
      F.id
    );
  }, q = (F, N) => {
    const W = F.members.map((Q) => Q.id), V = s("Group of {count}", { count: F.members.length }), X = d.has(F.group), J = W.every((Q) => u.has(Q)), et = F.members.every((Q) => Q.locked === !0), at = W.every((Q) => f.has(Q));
    return /* @__PURE__ */ g.jsxs("li", { className: "gl-layout-object-group", children: [
      /* @__PURE__ */ g.jsxs(
        "div",
        {
          "data-object-id": F.key,
          className: `gl-layout-object${at ? " is-selected" : ""}${J ? " is-hidden" : ""}${P(N)}`,
          draggable: !0,
          onDragStart: (Q) => j(F.key, void 0, Q),
          onDragOver: (Q) => R(N, void 0, Q),
          onDrop: _,
          onDragEnd: x,
          children: [
            /* @__PURE__ */ g.jsx(
              "button",
              {
                type: "button",
                className: "gl-layout-object-fold",
                "aria-expanded": !X,
                "aria-label": X ? s("Unfold {name}", { name: V }) : s("Fold {name}", { name: V }),
                onClick: () => h((Q) => {
                  const it = new Set(Q);
                  return it.has(F.group) ? it.delete(F.group) : it.add(F.group), it;
                }),
                children: /* @__PURE__ */ g.jsx(pv, { open: !X, size: 10 })
              }
            ),
            /* @__PURE__ */ g.jsx(
              "button",
              {
                type: "button",
                className: "gl-layout-object-name",
                "aria-pressed": at,
                title: s("Click to select the group on the page, Shift-click to add or remove it"),
                onClick: (Q) => M(W, Q),
                onKeyDown: (Q) => D(W, Q),
                onKeyUp: (Q) => {
                  Q.key === " " && Q.preventDefault();
                },
                children: V
              }
            ),
            A(W, V, J, et),
            /* @__PURE__ */ g.jsx(ls, { label: s("Actions for {name}", { name: V }), icon: /* @__PURE__ */ g.jsx(Uc, { size: 12 }), className: "gl-layout-object-menu", items: I(F.key) })
          ]
        }
      ),
      !X && /* @__PURE__ */ g.jsx("ul", { className: "gl-layout-objects-list", "aria-label": V, children: F.members.map((Q, it) => B(Q, it, F.group)) })
    ] }, F.key);
  };
  return /* @__PURE__ */ g.jsxs("details", { className: "gl-layout-objects", open: r, onToggle: (F) => a(F.currentTarget.open), children: [
    /* @__PURE__ */ g.jsx(ba, { children: s("Objects") }),
    c.length ? /* @__PURE__ */ g.jsx("ul", { ref: C, className: "gl-layout-objects-list", "aria-label": s("Objects on the sheet, top of the stack first"), children: c.map((F, N) => F.kind === "item" ? B(F.item, N) : q(F, N)) }) : /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: s("Nothing on the sheet yet.") })
  ] });
}
function D0({ initial: t, label: e, onCommit: n, onCancel: r }) {
  const [a, i] = $.useState(t), o = $.useRef(!1), s = $.useRef(null);
  return $.useEffect(() => {
    var l, c;
    (l = s.current) == null || l.focus(), (c = s.current) == null || c.select();
  }, []), /* @__PURE__ */ g.jsx(
    "input",
    {
      ref: s,
      className: "gl-layout-object-rename",
      "aria-label": e,
      value: a,
      onChange: (l) => i(l.target.value),
      onKeyDown: (l) => {
        l.stopPropagation(), l.key === "Enter" ? (l.preventDefault(), o.current = !0, n(a)) : l.key === "Escape" && (l.preventDefault(), o.current = !0, r());
      },
      onBlur: () => {
        o.current || (o.current = !0, n(a));
      }
    }
  );
}
function vl(t, e) {
  for (var n = t.length, r = 0; r < n; ++r)
    if (e(t[r], r))
      return !0;
  return !1;
}
function Jf(t, e) {
  for (var n = t.length, r = 0; r < n; ++r)
    if (e(t[r], r))
      return t[r];
  return null;
}
function Qf(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function ml(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function T0() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function _0(t, e) {
  var n = ml("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return n ? n[3] : "";
}
function xs(t) {
  return t.replace(/_/g, ".");
}
function ea(t, e) {
  var n = null, r = "-1";
  return vl(t, function(a) {
    var i = ml("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (n = a, r = i[3] || "-1", a.versionAlias ? r = a.versionAlias : a.versionTest && (r = _0(a.versionTest.toLowerCase(), e) || r), r = xs(r), !0);
  }), {
    preset: n,
    version: r
  };
}
function ai(t, e) {
  var n = {
    brand: "",
    version: "-1"
  };
  return vl(t, function(r) {
    var a = tp(e, r);
    return a ? (n.brand = r.id, n.version = r.versionAlias || a.version, n.version !== "-1") : !1;
  }), n;
}
function tp(t, e) {
  return Jf(t, function(n) {
    var r = n.brand;
    return ml("" + e.test, r.toLowerCase());
  });
}
var ep = [{
  test: "phantomjs",
  id: "phantomjs"
}, {
  test: "whale",
  id: "whale"
}, {
  test: "edgios|edge|edg",
  id: "edge"
}, {
  test: "msie|trident|windows phone",
  id: "ie",
  versionTest: "iemobile|msie|rv"
}, {
  test: "miuibrowser",
  id: "miui browser"
}, {
  test: "samsungbrowser",
  id: "samsung internet"
}, {
  test: "samsung",
  id: "samsung internet",
  versionTest: "version"
}, {
  test: "chrome|crios",
  id: "chrome"
}, {
  test: "firefox|fxios",
  id: "firefox"
}, {
  test: "android",
  id: "android browser",
  versionTest: "version"
}, {
  test: "safari|iphone|ipad|ipod",
  id: "safari",
  versionTest: "version"
}], np = [{
  test: "(?=.*applewebkit/(53[0-7]|5[0-2]|[0-4]))(?=.*\\schrome)",
  id: "chrome",
  versionTest: "chrome"
}, {
  test: "chromium",
  id: "chrome"
}, {
  test: "whale",
  id: "chrome",
  versionAlias: "-1",
  brand: !0
}], ys = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], rp = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], ap = [{
  test: "windows phone",
  id: "windows phone"
}, {
  test: "windows 2000",
  id: "window",
  versionAlias: "5.0"
}, {
  test: "windows nt",
  id: "window"
}, {
  test: "win32|windows",
  id: "window"
}, {
  test: "iphone|ipad|ipod",
  id: "ios",
  versionTest: "iphone os|cpu os"
}, {
  test: "macos|macintel|mac os x",
  id: "mac"
}, {
  test: "android|linux armv81",
  id: "android"
}, {
  test: "tizen",
  id: "tizen"
}, {
  test: "webos|web0s",
  id: "webos"
}];
function ip(t) {
  return !!ea(rp, t).preset;
}
function j0(t) {
  var e = Qf(t), n = !!/mobi/g.exec(e), r = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: ip(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = ea(ep, e), o = i.preset, s = i.version, l = ea(ap, e), c = l.preset, u = l.version, f = ea(np, e);
  if (r.chromium = !!f.preset, r.chromiumVersion = f.version, !r.chromium) {
    var d = ea(ys, e);
    r.webkit = !!d.preset, r.webkitVersion = d.version;
  }
  return c && (a.name = c.id, a.version = u, a.majorVersion = parseInt(u, 10)), o && (r.name = o.id, r.version = s, r.webview && a.name === "ios" && r.name !== "safari" && (r.webview = !1)), r.majorVersion = parseInt(r.version, 10), {
    browser: r,
    os: a,
    isMobile: n,
    isHints: !1
  };
}
function I0(t) {
  var e = navigator.userAgentData, n = (e.uaList || e.brands).slice(), r = e.mobile || !1, a = n[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!ai(rp, n).brand || ip(Qf())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && vl(ys, function(d) {
    return tp(n, d);
  });
  var l = ai(np, n);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var c = ai(ys, n);
    o.webkit = !!c.brand, o.webkitVersion = c.version || "-1";
  }
  var u = Jf(ap, function(d) {
    return new RegExp("" + d.test, "g").exec(i);
  });
  s.name = u ? u.id : "";
  {
    var f = ai(ep, n);
    o.name = f.brand || o.name, o.version = f.brand && t ? t.uaFullVersion : f.version;
  }
  return o.webkit && (s.name = r ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = xs(s.version), o.version = xs(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: r,
    isHints: !0
  };
}
function R0(t) {
  return T0() ? I0() : j0(t);
}
function P0(t) {
  for (var e = [], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  return e.map(function(r) {
    return r.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function N0(t, e) {
  return e.replace(/([^}{]*){/gm, function(n, r) {
    return r.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function $n(t, e) {
  return function(n) {
    n && (t[e] = n);
  };
}
function op(t, e, n) {
  return function(r) {
    r && (t[e][n] = r);
  };
}
function O0(t, e) {
  return function(n) {
    var r = n.prototype;
    t.forEach(function(a) {
      e(r, a);
    });
  };
}
function sp(t, e) {
  return e === void 0 && (e = {}), function(n, r) {
    t.forEach(function(a) {
      var i = e[a] || a;
      i in n || (n[i] = function() {
        for (var o, s = [], l = 0; l < arguments.length; l++)
          s[l] = arguments[l];
        var c = (o = this[r])[a].apply(o, s);
        return c === this[r] ? this : c;
      });
    });
  };
}
var A0 = "function", z0 = "object", L0 = "string", F0 = "number", xl = "undefined", lp = typeof window !== xl, B0 = typeof document !== xl && document, G0 = [{
  open: "(",
  close: ")"
}, {
  open: '"',
  close: '"'
}, {
  open: "'",
  close: "'"
}, {
  open: '\\"',
  close: '\\"'
}, {
  open: "\\'",
  close: "\\'"
}], ce = 1e-7, ii = {
  cm: function(t) {
    return t * 96 / 2.54;
  },
  mm: function(t) {
    return t * 96 / 254;
  },
  in: function(t) {
    return t * 96;
  },
  pt: function(t) {
    return t * 96 / 72;
  },
  pc: function(t) {
    return t * 96 / 6;
  },
  "%": function(t, e) {
    return t * e / 100;
  },
  vw: function(t, e) {
    return e === void 0 && (e = window.innerWidth), t / 100 * e;
  },
  vh: function(t, e) {
    return e === void 0 && (e = window.innerHeight), t / 100 * e;
  },
  vmax: function(t, e) {
    return e === void 0 && (e = Math.max(window.innerWidth, window.innerHeight)), t / 100 * e;
  },
  vmin: function(t, e) {
    return e === void 0 && (e = Math.min(window.innerWidth, window.innerHeight)), t / 100 * e;
  }
};
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function $0() {
  for (var t = 0, e = 0, n = arguments.length; e < n; e++) t += arguments[e].length;
  for (var r = Array(t), a = 0, e = 0; e < n; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) r[a] = i[o];
  return r;
}
function Ai(t, e, n, r) {
  return (t * r + e * n) / (n + r);
}
function yl(t) {
  return typeof t === xl;
}
function Ae(t) {
  return t && typeof t === z0;
}
function re(t) {
  return Array.isArray(t);
}
function Ke(t) {
  return typeof t === L0;
}
function wa(t) {
  return typeof t === F0;
}
function to(t) {
  return typeof t === A0;
}
function W0(t, e) {
  var n = t === "" || t == " ", r = e === "" || e == " ";
  return r && n || t === e;
}
function cp(t, e, n, r, a) {
  var i = bl(t, e, n);
  return i ? n : Y0(t, e, n + 1, r, a);
}
function bl(t, e, n) {
  if (!t.ignore)
    return null;
  var r = e.slice(Math.max(n - 3, 0), n + 3).join("");
  return new RegExp(t.ignore).exec(r);
}
function Y0(t, e, n, r, a) {
  for (var i = function(c) {
    var u = e[c].trim();
    if (u === t.close && !bl(t, e, c))
      return {
        value: c
      };
    var f = c, d = ze(a, function(h) {
      var m = h.open;
      return m === u;
    });
    if (d && (f = cp(d, e, c, r, a)), f === -1)
      return o = c, "break";
    c = f, o = c;
  }, o, s = n; s < r; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function wl(t, e) {
  var n = Ke(e) ? {
    separator: e
  } : e, r = n.separator, a = r === void 0 ? "," : r, i = n.isSeparateFirst, o = n.isSeparateOnlyOpenClose, s = n.isSeparateOpenClose, l = s === void 0 ? o : s, c = n.openCloseCharacters, u = c === void 0 ? G0 : c, f = u.map(function(D) {
    var j = D.open, R = D.close;
    return j === R ? j : j + "|" + R;
  }).join("|"), d = "(\\s*" + a + "\\s*|" + f + "|\\s+)", h = new RegExp(d, "g"), m = t.split(h).filter(function(D) {
    return D && D !== "undefined";
  }), v = m.length, y = [], b = [];
  function S() {
    return b.length ? (y.push(b.join("")), b = [], !0) : !1;
  }
  for (var C = function(D) {
    var j = m[D].trim(), R = D, _ = ze(u, function(I) {
      var A = I.open;
      return A === j;
    }), x = ze(u, function(I) {
      var A = I.close;
      return A === j;
    });
    if (_) {
      if (R = cp(_, m, D, v, u), R !== -1 && l)
        return S() && i || (y.push(m.slice(D, R + 1).join("")), D = R, i) ? (k = D, "break") : (k = D, "continue");
    } else if (x && !bl(x, m, D)) {
      var P = $0(u);
      return P.splice(u.indexOf(x), 1), {
        value: wl(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: P
        })
      };
    } else if (W0(j, a) && !o)
      return S(), i ? (k = D, "break") : (k = D, "continue");
    R === -1 && (R = v - 1), b.push(m.slice(D, R + 1).join("")), D = R, k = D;
  }, k, M = 0; M < v; ++M) {
    var E = C(M);
    if (M = k, typeof E == "object") return E.value;
    if (E === "break") break;
  }
  return b.length && y.push(b.join("")), y;
}
function Yn(t) {
  return wl(t, "");
}
function ar(t) {
  return wl(t, ",");
}
function up(t) {
  var e = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(t);
  return !e || e.length < 4 ? {} : {
    prefix: e[1],
    value: e[2],
    suffix: e[3]
  };
}
function sr(t) {
  var e = /^([^\d|e|\-|\+]*)((?:\d|\.|-|e-|e\+)+)(\S*)$/g.exec(t);
  if (!e)
    return {
      prefix: "",
      unit: "",
      value: NaN
    };
  var n = e[1], r = e[2], a = e[3];
  return {
    prefix: n,
    unit: a,
    value: parseFloat(r)
  };
}
function bs(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, n) {
    return n.toUpperCase();
  });
}
function H0(t, e) {
  return t.replace(/([a-z])([A-Z])/g, function(n, r, a) {
    return "" + r + e + a.toLowerCase();
  });
}
function Sa() {
  return Date.now ? Date.now() : (/* @__PURE__ */ new Date()).getTime();
}
function jn(t, e, n) {
  n === void 0 && (n = -1);
  for (var r = t.length, a = 0; a < r; ++a)
    if (e(t[a], a, t))
      return a;
  return n;
}
function ze(t, e, n) {
  var r = jn(t, e);
  return r > -1 ? t[r] : n;
}
var dp = /* @__PURE__ */ (function() {
  var t = Sa(), e = lp && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(n) {
    var r = Sa(), a = setTimeout(function() {
      n(r - t);
    }, 1e3 / 60);
    return a;
  };
})(), X0 = /* @__PURE__ */ (function() {
  var t = lp && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function Br(t) {
  return Object.keys(t);
}
function Yt(t, e) {
  var n = sr(t), r = n.value, a = n.unit;
  if (Ae(e)) {
    var i = e[a];
    if (i) {
      if (to(i))
        return i(r);
      if (ii[a])
        return ii[a](r, i);
    }
  } else if (a === "%")
    return r * e / 100;
  return ii[a] ? ii[a](r) : r;
}
function zi(t, e, n) {
  return Math.max(e, Math.min(t, n));
}
function Lu(t, e, n, r) {
  return r === void 0 && (r = t[0] / t[1]), [[Et(e[0], ce), Et(e[0] / r, ce)], [Et(e[1] * r, ce), Et(e[1], ce)]].filter(function(a) {
    return a.every(function(i, o) {
      var s = e[o], l = Et(s, ce);
      return n ? i <= s || i <= l : i >= s || i >= l;
    });
  })[0] || t;
}
function Sl(t, e, n, r) {
  if (!r)
    return t.map(function(h, m) {
      return zi(h, e[m], n[m]);
    });
  var a = t[0], i = t[1], o = r === !0 ? a / i : r, s = Lu(t, e, !1, o), l = s[0], c = s[1], u = Lu(t, n, !0, o), f = u[0], d = u[1];
  return a < l || i < c ? (a = l, i = c) : (a > f || i > d) && (a = f, i = d), [a, i];
}
function V0(t) {
  for (var e = t.length, n = 0, r = e - 1; r >= 0; --r)
    n += t[r];
  return n;
}
function ws(t) {
  for (var e = t.length, n = 0, r = e - 1; r >= 0; --r)
    n += t[r];
  return e ? n / e : 0;
}
function ae(t, e) {
  var n = e[0] - t[0], r = e[1] - t[1], a = Math.atan2(r, n);
  return a >= 0 ? a : a + Math.PI * 2;
}
function K0(t) {
  return [0, 1].map(function(e) {
    return ws(t.map(function(n) {
      return n[e];
    }));
  });
}
function Fu(t) {
  var e = K0(t), n = ae(e, t[0]), r = ae(e, t[1]);
  return n < r && r - n < Math.PI || n > r && r - n < -Math.PI ? 1 : -1;
}
function vn(t, e) {
  return Math.sqrt(Math.pow((e ? e[0] : 0) - t[0], 2) + Math.pow((e ? e[1] : 0) - t[1], 2));
}
function Et(t, e) {
  if (!e)
    return t;
  var n = 1 / e;
  return Math.round(t / e) / n;
}
function Bu(t, e) {
  return t.forEach(function(n, r) {
    t[r] = Et(t[r], e);
  }), t;
}
function q0(t) {
  for (var e = [], n = 0; n < t; ++n)
    e.push(n);
  return e;
}
function U0(t) {
  return t.reduce(function(e, n) {
    return e.concat(n);
  }, []);
}
function ue(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function Cl(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function fp(t, e) {
  if (t.classList)
    t.classList.remove(e);
  else {
    var n = new RegExp("(\\s|^)" + e + "(\\s|$)");
    t.className = t.className.replace(n, " ");
  }
}
function se(t, e, n, r) {
  t.addEventListener(e, n, r);
}
function ne(t, e, n, r) {
  t.removeEventListener(e, n, r);
}
function sn(t) {
  return (t == null ? void 0 : t.ownerDocument) || B0;
}
function kl(t) {
  return sn(t).documentElement;
}
function Kn(t) {
  return sn(t).body;
}
function Xe(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function pp(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function Ca(t) {
  return Ae(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function Z0(t, e, n, r, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = n + o * a, l = r + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function J0(t, e, n, r, a) {
  for (var i = 0; i < a; ++i) {
    var o = n + i * a, s = r + i * a, l = t[o], c = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = c;
  }
}
function Q0(t, e, n, r, a) {
  for (var i = 0; i < r; ++i) {
    var o = n + i * r;
    t[o] /= a, e[o] /= a;
  }
}
function hp(t, e, n) {
  for (var r = t.slice(), a = 0; a < n; ++a)
    r[a * n + e - 1] = 0, r[(e - 1) * n + a] = 0;
  return r[(e - 1) * (n + 1)] = 1, r;
}
function un(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var n = t.slice(), r = Ut(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!Et(n[i], ce)) {
      for (var o = a + 1; o < e; ++o)
        if (n[e * a + o]) {
          J0(n, r, a, o, e);
          break;
        }
    }
    if (!Et(n[i], ce))
      return [];
    Q0(n, r, a, e, n[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, c = n[l];
      !Et(c, ce) || a === o || Z0(n, r, s, a, e, -c);
    }
  }
  return r;
}
function tx(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var n = [], r = 0; r < e; ++r)
    for (var a = 0; a < e; ++a)
      n[a * e + r] = t[e * r + a];
  return n;
}
function gp(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var n = [], r = t[e * e - 1], a = 0; a < e - 1; ++a)
    n[a] = t[e * (e - 1) + a] / r;
  return n[e - 1] = 0, n;
}
function ex(t, e) {
  for (var n = Ut(e), r = 0; r < e - 1; ++r)
    n[e * (e - 1) + r] = t[r] || 0;
  return n;
}
function lr(t, e) {
  for (var n = t.slice(), r = t.length; r < e - 1; ++r)
    n[r] = 0;
  return n[e - 1] = 1, n;
}
function dn(t, e, n) {
  if (e === void 0 && (e = Math.sqrt(t.length)), e === n)
    return t;
  for (var r = Ut(n), a = Math.min(e, n), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      r[i * n + o] = t[i * e + o];
    r[(i + 1) * n - 1] = t[(i + 1) * e - 1], r[(n - 1) * n + i] = t[(e - 1) * e + i];
  }
  return r[n * n - 1] = t[e * e - 1], r;
}
function Li(t) {
  for (var e = [], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  var r = Ut(t);
  return e.forEach(function(a) {
    r = Ht(r, a, t);
  }), r;
}
function Ht(t, e, n) {
  n === void 0 && (n = Math.sqrt(t.length));
  var r = [], a = t.length / n, i = e.length / a;
  if (a) {
    if (!i)
      return t;
  } else return e;
  for (var o = 0; o < n; ++o)
    for (var s = 0; s < i; ++s) {
      r[s * n + o] = 0;
      for (var l = 0; l < a; ++l)
        r[s * n + o] += t[l * n + o] * e[s * a + l];
    }
  return r;
}
function Bt(t, e) {
  for (var n = Math.min(t.length, e.length), r = t.slice(), a = 0; a < n; ++a)
    r[a] = r[a] + e[a];
  return r;
}
function bt(t, e) {
  for (var n = Math.min(t.length, e.length), r = t.slice(), a = 0; a < n; ++a)
    r[a] = r[a] - e[a];
  return r;
}
function nx(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function vp(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function Ee(t, e, n) {
  n === void 0 && (n = e.length);
  var r = Ht(t, e, n), a = r[n - 1];
  return r.map(function(i) {
    return i / a;
  });
}
function rx(t, e) {
  return Ht(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function ax(t, e) {
  return Ht(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function ix(t, e) {
  return Ht(t, _a(e, 4));
}
function oi(t, e) {
  var n = e[0], r = n === void 0 ? 1 : n, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return Ht(t, [r, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function Ta(t, e) {
  return Ee(_a(e, 3), lr(t, 3));
}
function Bo(t, e) {
  var n = e[0], r = n === void 0 ? 0 : n, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return Ht(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, r, i, s, 1], 4);
}
function Ss(t, e) {
  return Ht(t, e, 4);
}
function _a(t, e) {
  var n = Math.cos(t), r = Math.sin(t), a = Ut(e);
  return a[0] = n, a[1] = r, a[e] = -r, a[e + 1] = n, a;
}
function Ut(t) {
  for (var e = t * t, n = [], r = 0; r < e; ++r)
    n[r] = r % (t + 1) ? 0 : 1;
  return n;
}
function El(t, e) {
  for (var n = Ut(e), r = Math.min(t.length, e - 1), a = 0; a < r; ++a)
    n[(e + 1) * a] = t[a];
  return n;
}
function cr(t, e) {
  for (var n = Ut(e), r = Math.min(t.length, e - 1), a = 0; a < r; ++a)
    n[e * (e - 1) + a] = t[a];
  return n;
}
function Ml(t, e, n, r, a, i, o, s) {
  var l = t[0], c = t[1], u = e[0], f = e[1], d = n[0], h = n[1], m = r[0], v = r[1], y = a[0], b = a[1], S = i[0], C = i[1], k = o[0], M = o[1], E = s[0], D = s[1], j = [l, 0, u, 0, d, 0, m, 0, c, 0, f, 0, h, 0, v, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, u, 0, d, 0, m, 0, c, 0, f, 0, h, 0, v, 0, 1, 0, 1, 0, 1, 0, 1, -y * l, -b * l, -S * u, -C * u, -k * d, -M * d, -E * m, -D * m, -y * c, -b * c, -S * f, -C * f, -k * h, -M * h, -E * v, -D * v], R = un(j, 8);
  if (!R.length)
    return [];
  var _ = Ht(R, [y, b, S, C, k, M, E, D], 8);
  return _[8] = 1, dn(tx(_), 3, 4);
}
var sa = function() {
  return sa = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, sa.apply(this, arguments);
};
function Dl() {
  return [
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    1
  ];
}
function jr(t, e) {
  return e === void 0 && (e = 0), yr(Ir(t, e));
}
function Ei(t, e) {
  var n = Ee(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), r = n[3] || 1;
  return [
    n[0] / r,
    n[1] / r,
    n[2] / r
  ];
}
function ox(t, e) {
  e === void 0 && (e = document.body);
  for (var n = t, r = Dl(); n; ) {
    var a = getComputedStyle(n).transform;
    if (r = Ss(jr(a), r), n === e)
      break;
    n = n.parentElement;
  }
  return r = un(r, 4), r[12] = 0, r[13] = 0, r[14] = 0, r;
}
function yr(t) {
  var e = Dl();
  return t.forEach(function(n) {
    var r = n.matrixFunction, a = n.functionValue;
    r && (e = r(e, a));
  }), e;
}
function Ir(t, e) {
  e === void 0 && (e = 0);
  var n = re(t) ? t : Yn(t);
  return n.map(function(r) {
    var a = up(r), i = a.prefix, o = a.value, s = null, l = i, c = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var u = Ae(e) ? sa(sa({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, f = ar(o).map(function(I, A) {
        return A === 0 && "x%" in u ? u["%"] = e["x%"] : A === 1 && "y%" in u ? u["%"] = e["y%"] : u["%"] = e["o%"], Yt(I, u);
      }), d = f[0], h = f[1], m = h === void 0 ? 0 : h, v = f[2], y = v === void 0 ? 0 : v;
      s = Bo, c = [d, m, y];
    } else if (i === "translateY") {
      var b = Ae(e) ? sa({ "%": e["y%"] }, e) : {
        "%": e
      }, m = Yt(o, b);
      s = Bo, c = [0, m, 0];
    } else if (i === "translateZ") {
      var y = parseFloat(o);
      s = Bo, c = [0, 0, y];
    } else if (i === "scale" || i === "scale3d") {
      var S = ar(o).map(function(I) {
        return parseFloat(I);
      }), C = S[0], k = S[1], M = k === void 0 ? C : k, E = S[2], D = E === void 0 ? 1 : E;
      s = oi, c = [C, M, D];
    } else if (i === "scaleX") {
      var C = parseFloat(o);
      s = oi, c = [C, 1, 1];
    } else if (i === "scaleY") {
      var M = parseFloat(o);
      s = oi, c = [1, M, 1];
    } else if (i === "scaleZ") {
      var D = parseFloat(o);
      s = oi, c = [1, 1, D];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var j = sr(o), R = j.unit, _ = j.value, x = R === "rad" ? _ : _ * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = ix) : i === "rotateX" ? s = rx : i === "rotateY" && (s = ax), c = x;
    } else if (i === "matrix3d")
      s = Ss, c = ar(o).map(function(I) {
        return parseFloat(I);
      });
    else if (i === "matrix") {
      var P = ar(o).map(function(I) {
        return parseFloat(I);
      });
      s = Ss, c = [
        P[0],
        P[1],
        0,
        0,
        P[2],
        P[3],
        0,
        0,
        0,
        0,
        1,
        0,
        P[4],
        P[5],
        0,
        1
      ];
    } else
      l = "";
    return {
      name: i,
      functionName: l,
      value: o,
      matrixFunction: s,
      functionValue: c
    };
  });
}
var sx = /* @__PURE__ */ (function() {
  function t() {
    this.keys = [], this.values = [];
  }
  var e = t.prototype;
  return e.get = function(n) {
    return this.values[this.keys.indexOf(n)];
  }, e.set = function(n, r) {
    var a = this.keys, i = this.values, o = a.indexOf(n), s = o === -1 ? a.length : o;
    a[s] = n, i[s] = r;
  }, t;
})(), lx = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(n) {
    return this.object[n];
  }, e.set = function(n, r) {
    this.object[n] = r;
  }, t;
})(), cx = typeof Map == "function", ux = /* @__PURE__ */ (function() {
  function t() {
  }
  var e = t.prototype;
  return e.connect = function(n, r) {
    this.prev = n, this.next = r, n && (n.next = this), r && (r.prev = this);
  }, e.disconnect = function() {
    var n = this.prev, r = this.next;
    n && (n.next = r), r && (r.prev = n);
  }, e.getIndex = function() {
    for (var n = this, r = -1; n; )
      n = n.prev, ++r;
    return r;
  }, t;
})();
function dx(t, e) {
  var n = [], r = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new ux();
    n[i] = s, r[o] = s;
  }), n.forEach(function(a, i) {
    a.connect(n[i - 1]);
  }), t.filter(function(a, i) {
    return !e[i];
  }).map(function(a, i) {
    var o = a[0], s = a[1];
    if (o === s)
      return [0, 0];
    var l = n[o], c = r[s - 1], u = l.getIndex();
    l.disconnect(), c ? l.connect(c, c.next) : l.connect(void 0, n[0]);
    var f = l.getIndex();
    return [u, f];
  });
}
var fx = /* @__PURE__ */ (function() {
  function t(n, r, a, i, o, s, l, c) {
    this.prevList = n, this.list = r, this.added = a, this.removed = i, this.changed = o, this.maintained = s, this.changedBeforeAdded = l, this.fixed = c;
  }
  var e = t.prototype;
  return Object.defineProperty(e, "ordered", {
    get: function() {
      return this.cacheOrdered || this.caculateOrdered(), this.cacheOrdered;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "pureChanged", {
    get: function() {
      return this.cachePureChanged || this.caculateOrdered(), this.cachePureChanged;
    },
    enumerable: !0,
    configurable: !0
  }), e.caculateOrdered = function() {
    var n = dx(this.changedBeforeAdded, this.fixed), r = this.changed, a = [];
    this.cacheOrdered = n.filter(function(i, o) {
      var s = i[0], l = i[1], c = r[o], u = c[0], f = c[1];
      if (s !== l)
        return a.push([u, f]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function Tl(t, e, n) {
  var r = cx ? Map : n ? lx : sx, a = n || function(S) {
    return S;
  }, i = [], o = [], s = [], l = t.map(a), c = e.map(a), u = new r(), f = new r(), d = [], h = [], m = {}, v = [], y = 0, b = 0;
  return l.forEach(function(S, C) {
    u.set(S, C);
  }), c.forEach(function(S, C) {
    f.set(S, C);
  }), l.forEach(function(S, C) {
    var k = f.get(S);
    typeof k > "u" ? (++b, o.push(C)) : m[k] = b;
  }), c.forEach(function(S, C) {
    var k = u.get(S);
    typeof k > "u" ? (i.push(C), ++y) : (s.push([k, C]), b = m[C] || 0, d.push([k - b, C - y]), h.push(C === k), k !== C && v.push([k, C]));
  }), o.reverse(), new fx(t, e, i, o, v, s, d, h);
}
var px = /* @__PURE__ */ (function() {
  function t(n, r) {
    n === void 0 && (n = []), this.findKeyCallback = r, this.list = [].slice.call(n);
  }
  var e = t.prototype;
  return e.update = function(n) {
    var r = [].slice.call(n), a = Tl(this.list, r, this.findKeyCallback);
    return this.list = r, a;
  }, t;
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var Cs = function(t, e) {
  return Cs = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) r.hasOwnProperty(a) && (n[a] = r[a]);
  }, Cs(t, e);
};
function hx(t, e) {
  Cs(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var mp = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), xp = /* @__PURE__ */ (function(t) {
  hx(e, t);
  function e(n) {
    return n === void 0 && (n = []), t.call(this, n, mp) || this;
  }
  return e;
})(px);
function br(t, e) {
  return Tl(t, e, mp);
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var ks = function() {
  return ks = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, ks.apply(this, arguments);
};
function gx() {
  for (var t = 0, e = 0, n = arguments.length; e < n; e++) t += arguments[e].length;
  for (var r = Array(t), a = 0, e = 0; e < n; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) r[a] = i[o];
  return r;
}
var ja = /* @__PURE__ */ (function() {
  function t() {
    this._events = {};
  }
  var e = t.prototype;
  return e.on = function(n, r) {
    if (Ae(n))
      for (var a in n)
        this.on(a, n[a]);
    else
      this._addEvent(n, r, {});
    return this;
  }, e.off = function(n, r) {
    if (!n)
      this._events = {};
    else if (Ae(n))
      for (var a in n)
        this.off(a);
    else if (!r)
      this._events[n] = [];
    else {
      var i = this._events[n];
      if (i) {
        var o = jn(i, function(s) {
          return s.listener === r;
        });
        o > -1 && i.splice(o, 1);
      }
    }
    return this;
  }, e.once = function(n, r) {
    var a = this;
    return r && this._addEvent(n, r, {
      once: !0
    }), new Promise(function(i) {
      a._addEvent(n, i, {
        once: !0
      });
    });
  }, e.emit = function(n, r) {
    var a = this;
    r === void 0 && (r = {});
    var i = this._events[n];
    if (!n || !i)
      return !0;
    var o = !1;
    return r.eventType = n, r.stop = function() {
      o = !0;
    }, r.currentTarget = this, gx(i).forEach(function(s) {
      s.listener(r), s.once && a.off(n, s.listener);
    }), !o;
  }, e.trigger = function(n, r) {
    return r === void 0 && (r = {}), this.emit(n, r);
  }, e._addEvent = function(n, r, a) {
    var i = this._events;
    i[n] = i[n] || [];
    var o = i[n];
    o.push(ks({
      listener: r
    }, a));
  }, t;
})();
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var Es = function(t, e) {
  return Es = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) r.hasOwnProperty(a) && (n[a] = r[a]);
  }, Es(t, e);
};
function vx(t, e) {
  Es(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var wr = function() {
  return wr = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, wr.apply(this, arguments);
};
function mx(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function Gu(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function si(t) {
  if (t) {
    if (Ke(t))
      return document.querySelector(t);
  } else return null;
  if (to(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var yp = /* @__PURE__ */ (function(t) {
  vx(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r._startRect = null, r._startPos = [], r._prevTime = 0, r._timer = 0, r._prevScrollPos = [0, 0], r._isWait = !1, r._flag = !1, r._currentOptions = null, r._lock = !1, r._unregister = null, r._onScroll = function() {
      var a = r._currentOptions;
      r._lock || !a || r.emit("scrollDrag", {
        next: function(i) {
          r.checkScroll({
            container: a.container,
            inputEvent: i
          });
        }
      });
    }, r;
  }
  var n = e.prototype;
  return n.dragStart = function(r, a) {
    var i = si(a.container);
    if (!i) {
      this._flag = !1;
      return;
    }
    var o = 0, s = 0, l = 0, c = 0;
    if (i === document.body)
      l = window.innerWidth, c = window.innerHeight;
    else {
      var u = i.getBoundingClientRect();
      o = u.top, s = u.left, l = u.width, c = u.height;
    }
    this._flag = !0, this._startPos = [r.clientX, r.clientY], this._startRect = {
      top: o,
      left: s,
      width: l,
      height: c
    }, this._prevScrollPos = this._getScrollPosition([0, 0], a), this._currentOptions = a, this._registerScrollEvent(a);
  }, n.drag = function(r, a) {
    if (clearTimeout(this._timer), !!this._flag) {
      var i = r.clientX, o = r.clientY, s = a.threshold, l = s === void 0 ? 0 : s, c = this, u = c._startRect, f = c._startPos;
      this._currentOptions = a;
      var d = [0, 0];
      return u.top > o - l ? (f[1] > u.top || o < f[1]) && (d[1] = -1) : u.top + u.height < o + l && (f[1] < u.top + u.height || o > f[1]) && (d[1] = 1), u.left > i - l ? (f[0] > u.left || i < f[0]) && (d[0] = -1) : u.left + u.width < i + l && (f[0] < u.left + u.width || i > f[0]) && (d[0] = 1), !d[0] && !d[1] ? !1 : this._continueDrag(wr(wr({}, a), {
        direction: d,
        inputEvent: r,
        isDrag: !0
      }));
    }
  }, n.checkScroll = function(r) {
    var a = this;
    if (this._isWait)
      return !1;
    var i = r.prevScrollPos, o = i === void 0 ? this._prevScrollPos : i, s = r.direction, l = r.throttleTime, c = l === void 0 ? 0 : l, u = r.inputEvent, f = r.isDrag, d = this._getScrollPosition(s || [0, 0], r), h = d[0] - o[0], m = d[1] - o[1], v = s || [h ? Math.abs(h) / h : 0, m ? Math.abs(m) / m : 0];
    return this._prevScrollPos = d, this._lock = !1, !h && !m ? !1 : (this.emit("move", {
      offsetX: v[0] ? h : 0,
      offsetY: v[1] ? m : 0,
      inputEvent: u
    }), c && f && (clearTimeout(this._timer), this._timer = window.setTimeout(function() {
      a._continueDrag(r);
    }, c)), !0);
  }, n.dragEnd = function() {
    this._flag = !1, this._lock = !1, clearTimeout(this._timer), this._unregisterScrollEvent();
  }, n._getScrollPosition = function(r, a) {
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? mx : o;
    return s({
      container: si(i),
      direction: r
    });
  }, n._continueDrag = function(r) {
    var a = this, i, o = r.container, s = r.direction, l = r.throttleTime, c = r.useScroll, u = r.isDrag, f = r.inputEvent;
    if (!(!this._flag || u && this._isWait)) {
      var d = Sa(), h = Math.max(l + this._prevTime - d, 0);
      if (h > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(r);
        }, h), !1;
      this._prevTime = d;
      var m = this._getScrollPosition(s, r);
      this._prevScrollPos = m, u && (this._isWait = !0), c || (this._lock = !0);
      var v = {
        container: si(o),
        direction: s,
        inputEvent: f
      };
      return (i = r.requestScroll) === null || i === void 0 || i.call(r, v), this.emit("scroll", v), this._isWait = !1, c || this.checkScroll(wr(wr({}, r), {
        prevScrollPos: m,
        direction: s,
        inputEvent: f
      }));
    }
  }, n._registerScrollEvent = function(r) {
    this._unregisterScrollEvent();
    var a = r.checkScrollEvent;
    if (a) {
      var i = a === !0 ? Gu : a, o = si(r.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = Gu(window, this._onScroll) : this._unregister = i(o, this._onScroll);
    }
  }, n._unregisterScrollEvent = function() {
    var r;
    (r = this._unregister) === null || r === void 0 || r.call(this), this._unregister = null;
  }, e;
})(ja);
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
function xx() {
  for (var t = 0, e = 0, n = arguments.length; e < n; e++) t += arguments[e].length;
  for (var r = Array(t), a = 0, e = 0; e < n; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) r[a] = i[o];
  return r;
}
function Pe(t) {
  return Et(t, ce);
}
function yx(t, e) {
  return t.every(function(n, r) {
    return Pe(n - e[r]) === 0;
  });
}
function bx(t, e) {
  return !Pe(t[0] - e[0]) && !Pe(t[1] - e[1]);
}
function la(t) {
  return t.length < 3 ? 0 : Math.abs(V0(t.map(function(e, n) {
    var r = t[n + 1] || t[0];
    return e[0] * r[1] - r[0] * e[1];
  }))) / 2;
}
function Ms(t, e) {
  var n = e.width, r = e.height, a = e.left, i = e.top, o = ur(t), s = o.minX, l = o.minY, c = o.maxX, u = o.maxY, f = n / (c - s), d = r / (u - l);
  return t.map(function(h) {
    return [a + (h[0] - s) * f, i + (h[1] - l) * d];
  });
}
function ur(t) {
  var e = t.map(function(r) {
    return r[0];
  }), n = t.map(function(r) {
    return r[1];
  });
  return {
    minX: Math.min.apply(Math, e),
    minY: Math.min.apply(Math, n),
    maxX: Math.max.apply(Math, e),
    maxY: Math.max.apply(Math, n)
  };
}
function Fi(t, e, n) {
  var r = t[0], a = t[1], i = ur(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], c = Bi(l[0], l[1]), u = Ds(e), f = [];
  if (u.forEach(function(m) {
    var v = Bi(m[0], m[1]), y = m[0];
    if (yx(c, v))
      f.push({
        pos: t,
        line: m,
        type: "line"
      });
    else {
      var b = bp(_l(c, v), [l, m]);
      b.forEach(function(S) {
        m.some(function(C) {
          return bx(C, S);
        }) ? f.push({
          pos: S,
          line: m,
          type: "point"
        }) : Pe(y[1] - a) !== 0 && f.push({
          pos: S,
          line: m,
          type: "intersection"
        });
      });
    }
  }), ze(f, function(m) {
    return m[0] === r;
  }))
    return !0;
  var d = 0, h = {};
  return f.forEach(function(m) {
    var v = m.pos, y = m.type, b = m.line;
    if (!(v[0] > r))
      if (y === "intersection")
        ++d;
      else {
        if (y === "line")
          return;
        if (y === "point") {
          var S = ze(b, function(M) {
            return M[1] !== a;
          }), C = h[v[0]], k = S[1] > a ? 1 : -1;
          C ? C !== k && ++d : h[v[0]] = k;
        }
      }
  }), d % 2 === 1;
}
function Bi(t, e) {
  var n = t[0], r = t[1], a = e[0], i = e[1], o = a - n, s = i - r;
  Math.abs(o) < ce && (o = 0), Math.abs(s) < ce && (s = 0);
  var l = 0, c = 0, u = 0;
  return o ? s ? (l = -s / o, c = 1, u = -l * n - r) : (c = 1, u = -r) : s && (l = -1, u = n), [l, c, u];
}
function _l(t, e) {
  var n = t[0], r = t[1], a = t[2], i = e[0], o = e[1], s = e[2], l = n === 0 && i === 0, c = r === 0 && o === 0, u = [];
  if (l && c)
    return [];
  if (l) {
    var f = -a / r, d = -s / o;
    return f !== d ? [] : [[-1 / 0, f], [1 / 0, f]];
  } else if (c) {
    var h = -a / n, m = -s / i;
    return h !== m ? [] : [[h, -1 / 0], [h, 1 / 0]];
  } else if (n === 0) {
    var v = -a / r, y = -(o * v + s) / i;
    u = [[y, v]];
  } else if (i === 0) {
    var v = -s / o, y = -(r * v + a) / n;
    u = [[y, v]];
  } else if (r === 0) {
    var y = -a / n, v = -(i * y + s) / o;
    u = [[y, v]];
  } else if (o === 0) {
    var y = -s / i, v = -(n * y + a) / r;
    u = [[y, v]];
  } else {
    var y = (r * s - o * a) / (o * n - r * i), v = -(n * y + a) / r;
    u = [[y, v]];
  }
  return u.map(function(b) {
    return [b[0], b[1]];
  });
}
function bp(t, e) {
  var n = e.map(function(f) {
    return [0, 1].map(function(d) {
      return [Math.min(f[0][d], f[1][d]), Math.max(f[0][d], f[1][d])];
    });
  }), r = [];
  if (t.length === 2) {
    var a = t[0], i = a[0], o = a[1];
    if (Pe(i - t[1][0])) {
      if (!Pe(o - t[1][1])) {
        var c = Math.max.apply(Math, n.map(function(f) {
          return f[0][0];
        })), u = Math.min.apply(Math, n.map(function(f) {
          return f[0][1];
        }));
        if (Pe(c - u) > 0)
          return [];
        r = [[c, o], [u, o]];
      }
    } else {
      var s = Math.max.apply(Math, n.map(function(f) {
        return f[1][0];
      })), l = Math.min.apply(Math, n.map(function(f) {
        return f[1][1];
      }));
      if (Pe(s - l) > 0)
        return [];
      r = [[i, s], [i, l]];
    }
  }
  return r.length || (r = t.filter(function(f) {
    var d = f[0], h = f[1];
    return n.every(function(m) {
      return 0 <= Pe(d - m[0][0]) && 0 <= Pe(m[0][1] - d) && 0 <= Pe(h - m[1][0]) && 0 <= Pe(m[1][1] - h);
    });
  })), r.map(function(f) {
    return [Pe(f[0]), Pe(f[1])];
  });
}
function Ds(t) {
  return xx(t.slice(1), [t[0]]).map(function(e, n) {
    return [t[n], e];
  });
}
function wx(t, e) {
  var n = t.slice(), r = e.slice();
  Fu(n) === -1 && n.reverse(), Fu(r) === -1 && r.reverse();
  var a = Ds(n), i = Ds(r), o = a.map(function(u) {
    return Bi(u[0], u[1]);
  }), s = i.map(function(u) {
    return Bi(u[0], u[1]);
  }), l = [];
  o.forEach(function(u, f) {
    var d = a[f], h = [];
    s.forEach(function(m, v) {
      var y = _l(u, m), b = bp(y, [d, i[v]]);
      h.push.apply(h, b.map(function(S) {
        return {
          index1: f,
          index2: v,
          pos: S,
          type: "intersection"
        };
      }));
    }), h.sort(function(m, v) {
      return vn(d[0], m.pos) - vn(d[0], v.pos);
    }), l.push.apply(l, h), Fi(d[1], r) && l.push({
      index1: f,
      index2: -1,
      pos: d[1],
      type: "inside"
    });
  }), i.forEach(function(u, f) {
    if (Fi(u[1], n)) {
      var d = !1, h = jn(l, function(m) {
        var v = m.index2;
        return v === f ? (d = !0, !1) : !!d;
      });
      h === -1 && (d = !1, h = jn(l, function(m) {
        var v = m.index1, y = m.index2;
        return v === -1 && y + 1 === f ? (d = !0, !1) : !!d;
      })), h === -1 ? l.push({
        index1: -1,
        index2: f,
        pos: u[1],
        type: "inside"
      }) : l.splice(h, 0, {
        index1: -1,
        index2: f,
        pos: u[1],
        type: "inside"
      });
    }
  });
  var c = {};
  return l.filter(function(u) {
    var f = u.pos, d = f[0] + "x" + f[1];
    return c[d] ? !1 : (c[d] = !0, !0);
  });
}
function Ts(t, e) {
  var n = wx(t, e);
  return n.map(function(r) {
    var a = r.pos;
    return a;
  });
}
function Sx(t, e) {
  var n = Ts(t, e);
  return la(n);
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var _s = function(t, e) {
  return _s = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) r.hasOwnProperty(a) && (n[a] = r[a]);
  }, _s(t, e);
};
function Cx(t, e) {
  _s(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var ie = function() {
  return ie = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, ie.apply(this, arguments);
};
function kx(t, e) {
  var n = e[0] - t[0], r = e[1] - t[1], a = Math.atan2(r, n);
  return a >= 0 ? a : a + Math.PI * 2;
}
function Go(t) {
  return kx([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function Ex(t) {
  return t.touches && t.touches.length >= 2;
}
function li(t) {
  return t ? t.touches ? Dx(t.touches) : [wp(t)] : [];
}
function Mx(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function $u(t, e, n) {
  var r = n.length, a = ca(t, r), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, c = ca(e, r), u = c.clientX, f = c.clientY, d = ca(n, r), h = d.clientX, m = d.clientY, v = i - u, y = o - f, b = i - h, S = o - m;
  return {
    clientX: s,
    clientY: l,
    deltaX: v,
    deltaY: y,
    distX: b,
    distY: S
  };
}
function $o(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function Dx(t) {
  for (var e = Math.min(t.length, 2), n = [], r = 0; r < e; ++r)
    n.push(wp(t[r]));
  return n;
}
function wp(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY
  };
}
function ca(t, e) {
  e === void 0 && (e = t.length);
  for (var n = {
    clientX: 0,
    clientY: 0,
    originalClientX: 0,
    originalClientY: 0
  }, r = Math.min(t.length, e), a = 0; a < r; ++a) {
    var i = t[a];
    n.originalClientX += "originalClientX" in i ? i.originalClientX : i.clientX, n.originalClientY += "originalClientY" in i ? i.originalClientY : i.clientY, n.clientX += i.clientX, n.clientY += i.clientY;
  }
  return e ? {
    clientX: n.clientX / e,
    clientY: n.clientY / e,
    originalClientX: n.originalClientX / e,
    originalClientY: n.originalClientY / e
  } : n;
}
var Wo = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), Go(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), Go(e) - Go(this.startClients);
  }, t.prototype.getPosition = function(e, n) {
    e === void 0 && (e = this.prevClients);
    var r = $u(e || this.prevClients, this.prevClients, this.startClients), a = r.deltaX, i = r.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, r;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var n = this.prevClients, r = this.startClients, a = Math.min(this.length, n.length), i = [], o = 0; o < a; ++o)
      i[o] = $u([e[o]], [n[o]], [r[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var n = this.movement;
    if (!e)
      return n;
    var r = ca(e, this.length), a = ca(this.prevClients, this.length), i = r.clientX - a.clientX, o = r.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + n;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), $o(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), $o(e) / $o(this.startClients);
  }, t.prototype.move = function(e, n) {
    this.startClients.forEach(function(r) {
      r.clientX -= e, r.clientY -= n;
    }), this.prevClients.forEach(function(r) {
      r.clientX -= e, r.clientY -= n;
    });
  }, t;
})(), Wu = ["textarea", "input"], Sp = /* @__PURE__ */ (function(t) {
  Cx(e, t);
  function e(n, r) {
    r === void 0 && (r = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(d, h) {
      if (h === void 0 && (h = !0), !(!a.flag && d.cancelable === !1)) {
        var m = d.type.indexOf("drag") >= -1;
        if (!(a.flag && m)) {
          a._isDragAPI = !0;
          var v = a.options, y = v.container, b = v.pinchOutside, S = v.preventWheelClick, C = v.preventRightClick, k = v.preventDefault, M = v.checkInput, E = v.dragFocusedInput, D = v.preventClickEventOnDragStart, j = v.preventClickEventOnDrag, R = v.preventClickEventByCondition, _ = a._useTouch, x = !a.flag;
          if (a._isSecondaryButton = d.which === 3 || d.button === 2, S && (d.which === 2 || d.button === 1) || C && (d.which === 3 || d.button === 2))
            return a.stop(), !1;
          if (x) {
            var P = a._window.document.activeElement, I = d.target;
            if (I) {
              var A = I.tagName.toLowerCase(), B = Wu.indexOf(A) > -1, q = I.isContentEditable;
              if (B || q) {
                if (M || !E && P === I)
                  return !1;
                if (P && (P === I || q && P.isContentEditable && P.contains(I)))
                  if (E)
                    I.blur();
                  else
                    return !1;
              } else if ((k || d.type === "touchstart") && P) {
                var F = P.tagName.toLowerCase();
                (P.isContentEditable || Wu.indexOf(F) > -1) && P.blur();
              }
              (D || j || R) && se(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new Wo(li(d))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = h, a._dragFlag = !0, a._prevInputEvent = d, a.data = {}, a.doubleFlag = Sa() - a.prevTime < 200, a._isMouseEvent = Mx(d), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var N = a._preventMouseEvent || a.emit("dragStart", ie(ie({ data: a.data, datas: a.data, inputEvent: d, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: h, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
              d.preventDefault();
            }, preventDrag: function() {
              a._dragFlag = !1;
            } }));
            N === !1 && a.stop(), a._isMouseEvent && a.flag && k && d.preventDefault();
          }
          if (!a.flag)
            return !1;
          var W = 0;
          if (x ? (a._attchDragEvent(), _ && b && (W = setTimeout(function() {
            se(y, "touchstart", a.onDragStart, {
              passive: !1
            });
          }))) : _ && b && ne(y, "touchstart", a.onDragStart), a.flag && Ex(d)) {
            if (clearTimeout(W), x && d.touches.length !== d.changedTouches.length)
              return;
            a.pinchFlag || a.onPinchStart(d);
          }
        }
      }
    }, a.onDrag = function(d, h) {
      if (a.flag) {
        var m = a.options.preventDefault;
        !a._isMouseEvent && m && d.preventDefault(), a._prevInputEvent = d;
        var v = li(d), y = a.moveClients(v, d, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || y.deltaX || y.deltaY) {
            var b = a._preventMouseEvent || a.emit("drag", ie(ie({}, y), { isScroll: !!h, inputEvent: d }));
            if (b === !1) {
              a.stop();
              return;
            }
          }
          a.pinchFlag && a.onPinch(d, v);
        }
        a.getCurrentStore().getPosition(v, !0);
      }
    }, a.onDragEnd = function(d) {
      if (a.flag) {
        var h = a.options, m = h.pinchOutside, v = h.container, y = h.preventClickEventOnDrag, b = h.preventClickEventOnDragStart, S = h.preventClickEventByCondition, C = a.isDrag;
        (y || b || S) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !S && !b && y && !C && a._allowClickEvent(), a._useTouch && m && ne(v, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(d);
        var k = d != null && d.touches ? li(d) : [], M = k.length;
        M === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new Wo(k));
        var E = a._getPosition(), D = Sa(), j = !C && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = C || j ? 0 : D, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", ie({ data: a.data, datas: a.data, isDouble: j, isDrag: C, isClick: !C, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: d, isTrusted: a._isTrusted }, E)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
          a._preventMouseEvent = !1;
        }, 200)), a._isIdle = !0);
      }
    }, a.onBlur = function() {
      a.onDragEnd();
    }, a._allowClickEvent = function() {
      ne(a._window, "click", a._onClick, !0);
    }, a._onClick = function(d) {
      a._allowClickEvent(), a._allowMouseEvent();
      var h = a.options.preventClickEventByCondition;
      h != null && h(d) || (d.stopPropagation(), d.preventDefault());
    }, a._onContextMenu = function(d) {
      var h = a.options;
      h.preventRightClick ? a.onDragEnd(d) : d.preventDefault();
    }, a._passCallback = function() {
    };
    var i = [].concat(n), o = i[0];
    a._window = pp(o) ? o : Xe(o), a.options = ie({ checkInput: !1, container: o && !("document" in o) ? Xe(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, r);
    var s = a.options, l = s.container, c = s.events, u = s.checkWindowBlur;
    if (a._useDrag = c.indexOf("drag") > -1, a._useTouch = c.indexOf("touch") > -1, a._useMouse = c.indexOf("mouse") > -1, a.targets = i, a._useDrag && i.forEach(function(d) {
      se(d, "dragstart", a.onDragStart);
    }), a._useMouse && (i.forEach(function(d) {
      se(d, "mousedown", a.onDragStart), se(d, "mousemove", a._passCallback);
    }), se(l, "contextmenu", a._onContextMenu)), u && se(Xe(), "blur", a.onBlur), a._useTouch) {
      var f = {
        passive: !1
      };
      i.forEach(function(d) {
        se(d, "touchstart", a.onDragStart, f), se(d, "touchmove", a._passCallback, f);
      });
    }
    return a;
  }
  return e.prototype.stop = function() {
    this.isDrag = !1, this.data = {}, this.clientStores = [], this.pinchFlag = !1, this.doubleFlag = !1, this.prevTime = 0, this.flag = !1, this._isIdle = !0, this._allowClickEvent(), this._dettachDragEvent(), this._isDragAPI = !1;
  }, e.prototype.getMovement = function(n) {
    return this.getCurrentStore().getMovement(n) + this.clientStores.slice(1).reduce(function(r, a) {
      return r + a.movement;
    }, 0);
  }, e.prototype.isDragging = function() {
    return this.isDrag;
  }, e.prototype.isIdle = function() {
    return this._isIdle;
  }, e.prototype.isFlag = function() {
    return this.flag;
  }, e.prototype.isPinchFlag = function() {
    return this.pinchFlag;
  }, e.prototype.isDoubleFlag = function() {
    return this.doubleFlag;
  }, e.prototype.isPinching = function() {
    return this.isPinch;
  }, e.prototype.scrollBy = function(n, r, a, i) {
    i === void 0 && (i = !0), this.flag && (this.clientStores[0].move(n, r), i && this.onDrag(a, !0));
  }, e.prototype.move = function(n, r) {
    var a = n[0], i = n[1], o = this.getCurrentStore(), s = o.prevClients;
    return this.moveClients(s.map(function(l) {
      var c = l.clientX, u = l.clientY;
      return {
        clientX: c + a,
        clientY: u + i,
        originalClientX: c,
        originalClientY: u
      };
    }), r, !0);
  }, e.prototype.triggerDragStart = function(n) {
    this.onDragStart(n, !1);
  }, e.prototype.setEventData = function(n) {
    var r = this.data;
    for (var a in n)
      r[a] = n[a];
    return this;
  }, e.prototype.setEventDatas = function(n) {
    return this.setEventData(n);
  }, e.prototype.getCurrentEvent = function(n) {
    return n === void 0 && (n = this._prevInputEvent), ie(ie({ data: this.data, datas: this.data }, this._getPosition()), { movement: this.getMovement(), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, inputEvent: n });
  }, e.prototype.getEventData = function() {
    return this.data;
  }, e.prototype.getEventDatas = function() {
    return this.data;
  }, e.prototype.unset = function() {
    var n = this, r = this.targets, a = this.options.container;
    this.off(), ne(this._window, "blur", this.onBlur), this._useDrag && r.forEach(function(i) {
      ne(i, "dragstart", n.onDragStart);
    }), this._useMouse && (r.forEach(function(i) {
      ne(i, "mousedown", n.onDragStart);
    }), ne(a, "contextmenu", this._onContextMenu)), this._useTouch && (r.forEach(function(i) {
      ne(i, "touchstart", n.onDragStart);
    }), ne(a, "touchstart", this.onDragStart)), this._prevInputEvent = null, this._allowClickEvent(), this._dettachDragEvent();
  }, e.prototype.onPinchStart = function(n) {
    var r = this, a = this.options.pinchThreshold;
    if (!(this.isDrag && this.getMovement() > a)) {
      var i = new Wo(li(n));
      this.pinchFlag = !0, this._addStore(i);
      var o = this.emit("pinchStart", ie(ie({ data: this.data, datas: this.data, angle: i.getAngle(), touches: this.getCurrentStore().getPositions() }, i.getPosition()), { inputEvent: n, isTrusted: this._isTrusted, preventDefault: function() {
        n.preventDefault();
      }, preventDrag: function() {
        r._dragFlag = !1;
      } }));
      o === !1 && (this.pinchFlag = !1);
    }
  }, e.prototype.onPinch = function(n, r) {
    if (!(!this.flag || !this.pinchFlag || r.length < 2)) {
      var a = this.getCurrentStore();
      this.isPinch = !0, this.emit("pinch", ie(ie({ data: this.data, datas: this.data, movement: this.getMovement(r), angle: a.getAngle(r), rotation: a.getRotation(r), touches: a.getPositions(r), scale: a.getScale(r), distance: a.getDistance(r) }, a.getPosition(r)), { inputEvent: n, isTrusted: this._isTrusted }));
    }
  }, e.prototype.onPinchEnd = function(n) {
    if (this.pinchFlag) {
      var r = this.isPinch;
      this.isPinch = !1, this.pinchFlag = !1;
      var a = this.getCurrentStore();
      this.emit("pinchEnd", ie(ie({ data: this.data, datas: this.data, isPinch: r, touches: a.getPositions() }, a.getPosition()), { inputEvent: n }));
    }
  }, e.prototype.getCurrentStore = function() {
    return this.clientStores[0];
  }, e.prototype.moveClients = function(n, r, a) {
    var i = this._getPosition(n, a), o = this.isDrag;
    (i.deltaX || i.deltaY) && (this.isDrag = !0);
    var s = !1;
    return !o && this.isDrag && (s = !0), ie(ie({ data: this.data, datas: this.data }, i), { movement: this.getMovement(n), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, isMouseEvent: this._isMouseEvent, isSecondaryButton: this._isSecondaryButton, inputEvent: r, isTrusted: this._isTrusted, isFirstDrag: s });
  }, e.prototype._addStore = function(n) {
    this.clientStores.splice(0, 0, n);
  }, e.prototype._getPosition = function(n, r) {
    var a = this.getCurrentStore(), i = a.getPosition(n, r), o = this.clientStores.slice(1).reduce(function(c, u) {
      var f = u.getPosition();
      return c.distX += f.distX, c.distY += f.distY, c;
    }, i), s = o.distX, l = o.distY;
    return ie(ie({}, i), { distX: s, distY: l });
  }, e.prototype._attchDragEvent = function() {
    var n = this._window, r = this.options.container, a = {
      passive: !1
    };
    this._isDragAPI && (se(r, "dragover", this.onDrag, a), se(n, "dragend", this.onDragEnd)), this._useMouse && (se(r, "mousemove", this.onDrag), se(n, "mouseup", this.onDragEnd)), this._useTouch && (se(r, "touchmove", this.onDrag, a), se(n, "touchend", this.onDragEnd, a), se(n, "touchcancel", this.onDragEnd, a));
  }, e.prototype._dettachDragEvent = function() {
    var n = this._window, r = this.options.container;
    this._isDragAPI && (ne(r, "dragover", this.onDrag), ne(n, "dragend", this.onDragEnd)), this._useMouse && (ne(r, "mousemove", this.onDrag), ne(n, "mouseup", this.onDragEnd)), this._useTouch && (ne(r, "touchstart", this.onDragStart), ne(r, "touchmove", this.onDrag), ne(n, "touchend", this.onDragEnd), ne(n, "touchcancel", this.onDragEnd));
  }, e.prototype._allowMouseEvent = function() {
    this._preventMouseEvent = !1, clearTimeout(this._preventMouseEventId);
  }, e;
})(ja);
function Tx(t) {
  for (var e = 5381, n = t.length; n; )
    e = e * 33 ^ t.charCodeAt(--n);
  return e >>> 0;
}
var _x = Tx;
function jx(t) {
  return _x(t).toString(36);
}
function Ix(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function Rx(t, e, n) {
  return n.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(r, a) {
    var i = a.trim();
    return (i ? ar(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function Px(t, e, n, r, a) {
  var i = sn(r), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), n.nonce && o.setAttribute("nonce", n.nonce), o.innerHTML = Rx(t, e, n), (a || i.head || i.body).appendChild(o), o;
}
function Cp(t) {
  var e = "rCS" + jx(t);
  return {
    className: e,
    inject: function(n, r) {
      r === void 0 && (r = {});
      var a = Ix(n), i = (a || n.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = Px(e, t, r, n, a);
      else {
        var o = parseFloat(i.getAttribute("data-styled-count")) || 0;
        i.setAttribute("data-styled-count", "".concat(o + 1));
      }
      return {
        destroy: function() {
          var s, l = parseFloat(i.getAttribute("data-styled-count")) || 0;
          l <= 1 ? (i.remove ? i.remove() : (s = i.parentNode) === null || s === void 0 || s.removeChild(i), i = null) : i.setAttribute("data-styled-count", "".concat(l - 1));
        }
      };
    }
  };
}
var js = function() {
  return js = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, js.apply(this, arguments);
};
function Nx(t, e) {
  var n = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, r = Object.getOwnPropertySymbols(t); a < r.length; a++)
    e.indexOf(r[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[a]) && (n[r[a]] = t[r[a]]);
  return n;
}
function kp(t, e) {
  var n = Cp(e), r = n.className;
  return $.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = Nx(a, ["className", "cspNonce"]), c = $.useRef();
    return $.useImperativeHandle(i, function() {
      return c.current;
    }, []), $.useEffect(function() {
      var u = n.inject(c.current, {
        nonce: a.cspNonce
      });
      return function() {
        u.destroy();
      };
    }, []), $.createElement(t, js({
      ref: c,
      "data-styled-id": r,
      className: "".concat(s, " ").concat(r)
    }, l));
  });
}
var Is = function(t, e) {
  return Is = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (n[a] = r[a]);
  }, Is(t, e);
};
function Ia(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Is(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var O = function() {
  return O = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, O.apply(this, arguments);
};
function Ox(t, e) {
  var n = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, r = Object.getOwnPropertySymbols(t); a < r.length; a++)
      e.indexOf(r[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[a]) && (n[r[a]] = t[r[a]]);
  return n;
}
function Ax(t, e, n, r) {
  var a = arguments.length, i = a < 3 ? e : r, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, n, r);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, n, i) : o(e, n)) || i);
  return a > 3 && i && Object.defineProperty(e, n, i), i;
}
function zx(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, n = e && t[e], r = 0;
  if (n) return n.call(t);
  if (t && typeof t.length == "number") return {
    next: function() {
      return t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function L(t, e) {
  var n = typeof Symbol == "function" && t[Symbol.iterator];
  if (!n) return t;
  var r = n.call(t), a, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(a = r.next()).done; ) i.push(a.value);
  } catch (s) {
    o = { error: s };
  } finally {
    try {
      a && !a.done && (n = r.return) && n.call(r);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}
function ot(t, e, n) {
  if (arguments.length === 2) for (var r = 0, a = e.length, i; r < a; r++)
    (i || !(r in e)) && (i || (i = Array.prototype.slice.call(e, 0, r)), i[r] = e[r]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function Ra(t, e) {
  return O({ events: [], props: [], name: t }, e);
}
var Lx = ["n", "w", "s", "e"], jl = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function Fx(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function Bx(t) {
  var e = Fx(1, t), n = Math.round(t / 45) * 45 % 180, r = "ns-resize";
  return n === 135 ? r = "nwse-resize" : n === 45 ? r = "nesw-resize" : n === 90 && (r = "ew-resize"), "cursor:".concat(r, ";cursor: url('").concat(e, "') 16 16, ").concat(r, ";");
}
var Gr = R0(), Ep = Gr.browser.webkit, Mp = Ep && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), Dp = Gr.browser.name, Tp = parseInt(Gr.browser.version, 10), Gx = Dp === "chrome", $x = Gr.browser.chromium, Wx = parseInt(Gr.browser.chromiumVersion, 10) || 0, Yx = Gx && Tp >= 109 || $x && Wx >= 109, Hx = Dp === "firefox", Xx = parseInt(Gr.browser.webkitVersion, 10) >= 612 || Tp >= 15, Il = "moveable-", Vx = jl.map(function(t) {
  var e = "", n = "", r = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (n = "left: ".concat(i, ";"), r = "right"), t.indexOf("e") > -1 && (n = "left: 0px;", r = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(n).concat(e, `
        transform-origin: `).concat(r, " ").concat(a, `;
    }`);
}).join(`
`), Kx = `
{
position: absolute;
width: 1px;
height: 1px;
left: 0;
top: 0;
z-index: 3000;
--moveable-color: #4af;
--zoom: 1;
--zoompx: 1px;
--moveable-line-padding: 0;
--moveable-control-padding: 0;
will-change: transform;
outline: 1px solid transparent;
}
.control-box {
z-index: 0;
}
.line, .control {
position: absolute;
left: 0;
top: 0;
will-change: transform;
}
.control {
width: 14px;
height: 14px;
border-radius: 50%;
border: 2px solid #fff;
box-sizing: border-box;
background: #4af;
background: var(--moveable-color);
margin-top: -7px;
margin-left: -7px;
border: 2px solid #fff;
z-index: 10;
}
.around-control {
position: absolute;
will-change: transform;
width: calc(var(--moveable-control-padding, 20) * 1px);
height: calc(var(--moveable-control-padding, 20) * 1px);
left: calc(var(--moveable-control-padding, 20) * -0.5px);
top: calc(var(--moveable-control-padding, 20) * -0.5px);
box-sizing: border-box;
background: transparent;
z-index: 8;
cursor: alias;
transform-origin: center center;
}
`.concat(Vx, `
.padding {
position: absolute;
top: 0px;
left: 0px;
width: 100px;
height: 100px;
transform-origin: 0 0;
}
.line {
width: 1px;
height: 1px;
background: #4af;
background: var(--moveable-color);
transform-origin: 0px 50%;
}
.line.edge {
z-index: 1;
background: transparent;
}
.line.dashed {
box-sizing: border-box;
background: transparent;
}
.line.dashed.horizontal {
border-top: 1px dashed #4af;
border-top-color: #4af;
border-top-color: var(--moveable-color);
}
.line.dashed.vertical {
border-left: 1px dashed #4af;
border-left-color: #4af;
border-left-color: var(--moveable-color);
}
.line.vertical {
transform: translateX(-50%);
}
.line.horizontal {
transform: translateY(-50%);
}
.line.vertical.bold {
width: 2px;
}
.line.horizontal.bold {
height: 2px;
}

.control.origin {
border-color: #f55;
background: #fff;
width: 12px;
height: 12px;
margin-top: -6px;
margin-left: -6px;
pointer-events: none;
}
`).concat([0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165].map(function(t) {
  return `
.direction[data-rotation="`.concat(t, '"], :global .view-control-rotation').concat(t, ` {
`).concat(Bx(t), `
}
`);
}).join(`
`), `

.line.direction:before {
content: "";
position: absolute;
width: 100%;
height: calc(var(--moveable-line-padding, 0) * 1px);
bottom: 0;
left: 0;
}
.group {
z-index: -1;
}
.area {
position: absolute;
}
.area-pieces {
position: absolute;
top: 0;
left: 0;
display: none;
}
.area.avoid, .area.pass {
pointer-events: none;
}
.area.avoid+.area-pieces {
display: block;
}
.area-piece {
position: absolute;
}

`).concat(Mp ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), qx = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], Rs = 1e-4, Ie = 1e-7, ci = 1e-9, Ps = Math.pow(10, 10), Yu = -Ps, Ux = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, Rl = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, _p = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, Zx = [
  "isMoveableElement",
  "updateRect",
  "updateTarget",
  "destroy",
  "dragStart",
  "isInside",
  "hitTest",
  "setState",
  "getRect",
  "request",
  "isDragging",
  "getManager",
  "forceUpdate",
  "waitToChangeTarget",
  "updateSelectors",
  "getTargets",
  "stopDrag",
  "getControlBoxElement",
  "getMoveables",
  "getDragElement"
];
function Pa(t, e, n, r, a, i) {
  var o, s;
  i === void 0 && (i = "draggable");
  var l = (s = (o = e.gestos[i]) === null || o === void 0 ? void 0 : o.move(n, t.inputEvent)) !== null && s !== void 0 ? s : {}, c = l.originalDatas || l.datas, u = c[i] || (c[i] = {});
  return O(O({}, l), { isPinch: !!r, parentEvent: !0, datas: u, originalDatas: t.originalDatas });
}
var Rr = /* @__PURE__ */ (function() {
  function t(e) {
    var n;
    e === void 0 && (e = "draggable"), this.ableName = e, this.prevX = 0, this.prevY = 0, this.startX = 0, this.startY = 0, this.isDrag = !1, this.isFlag = !1, this.datas = {
      draggable: {}
    }, this.datas = (n = {}, n[e] = {}, n);
  }
  return t.prototype.dragStart = function(e, n) {
    this.isDrag = !1, this.isFlag = !1;
    var r = n.originalDatas;
    return this.datas = r, r[this.ableName] || (r[this.ableName] = {}), O(O({}, this.move(e, n.inputEvent)), { type: "dragstart" });
  }, t.prototype.drag = function(e, n) {
    return this.move([
      e[0] - this.prevX,
      e[1] - this.prevY
    ], n);
  }, t.prototype.move = function(e, n) {
    var r, a, i = !1;
    if (!this.isFlag)
      this.prevX = e[0], this.prevY = e[1], this.startX = e[0], this.startY = e[1], r = e[0], a = e[1], this.isFlag = !0;
    else {
      var o = this.isDrag;
      r = this.prevX + e[0], a = this.prevY + e[1], (e[0] || e[1]) && (this.isDrag = !0), !o && this.isDrag && (i = !0);
    }
    return this.prevX = r, this.prevY = a, {
      type: "drag",
      clientX: r,
      clientY: a,
      inputEvent: n,
      isFirstDrag: i,
      isDrag: this.isDrag,
      distX: r - this.startX,
      distY: a - this.startY,
      deltaX: e[0],
      deltaY: e[1],
      datas: this.datas[this.ableName],
      originalDatas: this.datas,
      parentEvent: !0,
      parentGesto: this
    };
  }, t;
})();
function Tr(t, e, n, r) {
  var a = t.length === 16, i = a ? 4 : 3, o = pr(t, n, r, i), s = L(o, 4), l = L(s[0], 2), c = l[0], u = l[1], f = L(s[1], 2), d = f[0], h = f[1], m = L(s[2], 2), v = m[0], y = m[1], b = L(s[3], 2), S = b[0], C = b[1], k = L(ee(t, e, i), 2), M = k[0], E = k[1], D = Math.min(c, d, v, S), j = Math.min(u, h, y, C), R = Math.max(c, d, v, S), _ = Math.max(u, h, y, C);
  c = c - D || 0, d = d - D || 0, v = v - D || 0, S = S - D || 0, u = u - j || 0, h = h - j || 0, y = y - j || 0, C = C - j || 0, M = M - D || 0, E = E - j || 0;
  var x = t[0], P = t[i + 1], I = _e(x * P);
  return {
    left: D,
    top: j,
    right: R,
    bottom: _,
    origin: [M, E],
    pos1: [c, u],
    pos2: [d, h],
    pos3: [v, y],
    pos4: [S, C],
    direction: I
  };
}
function jp(t, e) {
  var n = e.clientX, r = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, c = i.pos1, u = o.left, f = o.top, d = l ? 4 : 3, h = L(bt(Or(s, [n - u, r - f], d), c), 2), m = h[0], v = h[1], y = L(xn({ datas: a, distX: m, distY: v }), 2), b = y[0], S = y[1];
  return [b, S];
}
function fr(t, e) {
  var n = e.datas, r = t.state, a = r.allMatrix, i = r.beforeMatrix, o = r.is3d, s = r.left, l = r.top, c = r.origin, u = r.offsetMatrix, f = r.targetMatrix, d = r.transformOrigin, h = o ? 4 : 3;
  n.is3d = o, n.matrix = a, n.targetMatrix = f, n.beforeMatrix = i, n.offsetMatrix = u, n.transformOrigin = d, n.inverseMatrix = un(a, h), n.inverseBeforeMatrix = un(i, h), n.absoluteOrigin = lr(Bt([s, l], c), h), n.startDragBeforeDist = Ee(n.inverseBeforeMatrix, n.absoluteOrigin, h), n.startDragDist = Ee(n.inverseMatrix, n.absoluteOrigin, h);
}
function Jx(t) {
  return Tr(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function eo(t, e, n) {
  var r = e.datas, a = e.originalDatas.beforeRenderable, i = r.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, c = -1;
  i === -1 ? (n === "translate" ? c = 0 : n === "rotate" && (c = jn(o, function(h) {
    return h.match(/scale\(/g);
  })), c === -1 && (c = o.length), r.transformIndex = c) : ze(l, function(h) {
    return h.index === i && h.functionName === n;
  }) ? c = i : c = i + l.filter(function(h) {
    return h.index < i;
  }).length;
  var u = kb(o, t.state, c), f = u.targetFunction, d = n === "rotate" ? "rotateZ" : n;
  r.beforeFunctionTexts = u.beforeFunctionTexts, r.afterFunctionTexts = u.afterFunctionTexts, r.beforeTransform = u.beforeFunctionMatrix, r.beforeTransform2 = u.beforeFunctionMatrix2, r.targetTansform = u.targetFunctionMatrix, r.afterTransform = u.afterFunctionMatrix, r.afterTransform2 = u.afterFunctionMatrix2, r.targetAllTransform = u.allFunctionMatrix, f.functionName === d ? (r.afterFunctionTexts.splice(0, 1), r.isAppendTransform = !1) : s > c && (r.isAppendTransform = !0, a.nextTransformAppendedIndexes = ot(ot([], L(l), !1), [{
    functionName: n,
    index: c,
    isAppend: !0
  }], !1));
}
function no(t, e, n) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? n : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function Qx(t) {
  var e = t.datas, n = t.distX, r = t.distY, a = L(Rp({ datas: e, distX: n, distY: r }), 2), i = a[0], o = a[1], s = Ip(e, ex([i, o], 4));
  return Ee(s, lr([0, 0, 0], 4), 4);
}
function Ip(t, e, n) {
  var r = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = n ? Ht(s, e, 4) : Ht(e, s, 4), c = Ht(un(n ? i : r, 4), l, 4), u = Ht(c, un(n ? o : a, 4), 4);
  return u;
}
function Rp(t) {
  var e = t.datas, n = t.distX, r = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return bt(Ee(a, Bt(s, [n, r]), l), o);
}
function xn(t, e) {
  var n = t.datas, r = t.distX, a = t.distY, i = n.inverseBeforeMatrix, o = n.inverseMatrix, s = n.is3d, l = n.startDragBeforeDist, c = n.startDragDist, u = n.absoluteOrigin, f = s ? 4 : 3;
  return bt(Ee(e ? i : o, Bt(u, [r, a]), f), e ? l : c);
}
function ty(t, e) {
  var n = t.datas, r = t.distX, a = t.distY;
  n.beforeMatrix;
  var i = n.matrix, o = n.is3d;
  n.startDragBeforeDist;
  var s = n.startDragDist, l = n.absoluteOrigin, c = o ? 4 : 3;
  return bt(Ee(i, Bt(s, [r, a]), c), l);
}
function ey(t, e, n, r, a, i) {
  return r === void 0 && (r = e), a === void 0 && (a = n), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = sr(o), c = l.value, u = l.unit, f = s ? a : r, d = s ? n : e;
    if (o === "%" || isNaN(c)) {
      var h = f ? i[s] / f : 0;
      return d * h;
    } else if (u !== "%")
      return c;
    return d * c / 100;
  }) : i;
}
function Pp(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function ny(t, e) {
  return Pp(e).map(function(n) {
    return t[n];
  });
}
function Yo(t, e) {
  var n = (e + 1) / 2;
  return [
    Ai(t[0][0], t[1][0], n, 1 - n),
    Ai(t[0][1], t[1][1], n, 1 - n)
  ];
}
function pe(t, e) {
  var n = Yo([t[0], t[1]], e[0]), r = Yo([t[2], t[3]], e[0]);
  return Yo([n, r], e[1]);
}
function ry(t, e, n, r, a, i) {
  var o = pr(e, n, r, a), s = pe(o, i), l = t[0] - s[0], c = t[1] - s[1];
  return [l, c];
}
function Na(t, e, n, r) {
  return Ht(t, da(e, r, n), r);
}
function ay(t, e, n, r) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (Ke(n)) {
    var c = e.beforeTransform, u = e.afterTransform;
    r ? l = dn(jr(n), 4, s) : l = dn(Ht(Ht(c, jr([n]), 4), u, 4), 4, s);
  } else
    l = n;
  return Na(i, l, a, s);
}
function iy(t, e) {
  var n = t.transformOrigin, r = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return Na(r, Ht(o || i, El(e, s), s), n, s);
}
function ro(t, e) {
  var n = $r(e);
  return {
    setTransform: function(r, a) {
      a === void 0 && (a = -1), n.startTransforms = re(r) ? r : Yn(r), Ns(t, e, a);
    },
    setTransformIndex: function(r) {
      Ns(t, e, r);
    }
  };
}
function ao(t, e, n) {
  var r = $r(e), a = r.startTransforms;
  Ns(t, e, jn(a, function(i) {
    return i.indexOf("".concat(n, "(")) === 0;
  }));
}
function Ns(t, e, n) {
  var r = $r(e), a = e.datas;
  if (a.transformIndex = n, n !== -1) {
    var i = r.startTransforms[n];
    if (i) {
      var o = t.state, s = Ir([i], {
        "x%": function(l) {
          return l / 100 * o.offsetWidth;
        },
        "y%": function(l) {
          return l / 100 * o.offsetHeight;
        }
      });
      a.startValue = s[0].functionValue;
    }
  }
}
function Pl(t, e) {
  var n = $r(t);
  n.nextTransforms = Yn(e);
}
function $r(t) {
  return t.originalDatas.beforeRenderable;
}
function Gi(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function ui(t) {
  return (Gi(t) || []).join(" ");
}
function di(t) {
  return $r(t).nextStyle;
}
function Np(t, e, n, r, a) {
  Pl(a, e);
  var i = Te.drag(t, Pa(a, t.state, n, r)), o = i ? i.transform : e;
  return O(O({ transform: e, drag: i }, je({
    transform: o
  }, a)), { afterTransform: o });
}
function Nl(t, e, n, r, a, i) {
  var o = ay(t.state, a, e, i), s = ly(t, n, r, o);
  return s;
}
function Op(t, e, n, r, a, i, o) {
  var s = Nl(t, e, n, a, i, o), l = t.state, c = l.left, u = l.top, f = t.props.groupable, d = f ? c : 0, h = f ? u : 0, m = bt(r, s);
  return bt(m, [d, h]);
}
function oy(t, e, n, r, a, i, o) {
  var s = Op(t, e, n, r, a, i, o);
  return s;
}
function sy(t, e, n) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    n ? -1 + t[1] / (n / 2) : 0
  ];
}
function ly(t, e, n, r) {
  r === void 0 && (r = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, c = [
    i / 2 * (1 + e[0]) + n[0],
    o / 2 * (1 + e[1]) + n[1]
  ];
  return ee(r, c, l);
}
function cy(t, e, n) {
  var r = n.fixedDirection, a = n.fixedPosition, i = n.fixedOffset;
  return Op(t, "rotate(".concat(e, "deg)"), r, a, i, n);
}
function uy(t, e, n, r, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, c = s.offsetMatrix, u = s.is3d, f = s.width, d = s.height, h = s.left, m = s.top, v = i.fixedDirection, y = i.nextTargetMatrix || s.targetMatrix, b = u ? 4 : 3, S = ey(a, e, n, f, d, l), C = o ? h : 0, k = o ? m : 0, M = Na(c, y, S, b), E = ry(r, M, e, n, b, v);
  return bt(E, [C, k]);
}
function dy(t, e) {
  return pe(Ue(t.state), e);
}
function fy(t, e) {
  var n = t.targetGesto, r = t.controlGesto, a;
  return n != null && n.isFlag() && (a = n.getEventData()[e]), !a && (r != null && r.isFlag()) && (a = r.getEventData()[e]), a || {};
}
function py(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function hy(t) {
  var e = t("scale"), n = t("rotate"), r = t("translate"), a = [];
  return r && r !== "0px" && r !== "none" && a.push("translate(".concat(r.split(/\s+/).join(","), ")")), n && n !== "1" && n !== "none" && a.push("rotate(".concat(n, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function Ap(t, e, n) {
  for (var r = t, a = [], i = kl(t) || Kn(t), o = !n && t === e || t === i, s = o, l = !1, c = 3, u, f, d, h = !1, m = Ea(e, e, !0).offsetParent, v = 1; r && !s; ) {
    s = o;
    var y = Ne(r), b = y("position"), S = oh(r), C = b === "fixed", k = hy(y), M = nx(db(S)), E = void 0, D = !1, j = !1, R = 0, _ = 0, x = 0, P = 0, I = {
      hasTransform: !1,
      fixedContainer: null
    };
    C && (h = !0, I = vb(r), m = I.fixedContainer);
    var A = M.length;
    !l && (A === 16 || k.length) && (l = !0, c = 4, Bs(a), d && (d = dn(d, 3, 4))), l && A === 9 && (M = dn(M, 3, 4));
    var B = gb(r, t), q = B.tagName, F = B.hasOffset, N = B.isSVG, W = B.origin, V = B.targetOrigin, X = B.offset, J = L(X, 2), et = J[0], at = J[1];
    q === "svg" && !r.ownerSVGElement && d && (a.push({
      type: "target",
      target: r,
      matrix: mb(r, c)
    }), a.push({
      type: "offset",
      target: r,
      matrix: Ut(c)
    }));
    var Q = parseFloat(y("zoom")) || 1;
    if (C)
      E = I.fixedContainer, D = !0;
    else {
      var it = Ea(r, e, !1, !0, y), ut = it.offsetZoom;
      if (E = it.offsetParent, D = it.isEnd, j = it.isStatic, v *= ut, (it.isCustomElement || ut !== 1) && j)
        et -= E.offsetLeft, at -= E.offsetTop;
      else if (Hx || Yx) {
        var Z = it.parentSlotElement;
        if (Z) {
          for (var dt = E, ht = 0, tt = 0; dt && py(dt); )
            ht += dt.offsetLeft, tt += dt.offsetTop, dt = dt.offsetParent;
          et -= ht, at -= tt;
        }
      }
    }
    if (Ep && !Xx && F && !N && j && (b === "relative" || b === "static") && (et -= E.offsetLeft, at -= E.offsetTop, o = o || D), C)
      F && I.hasTransform && (x = E.clientLeft, P = E.clientTop);
    else if (F && m !== E && (R = E.clientLeft, _ = E.clientTop), F && E === i) {
      var ft = sh(r, !1);
      et += ft[0], at += ft[1];
    }
    if (a.push({
      type: "target",
      target: r,
      matrix: da(M, c, W)
    }), k.length && (a.push({
      type: "offset",
      target: r,
      matrix: Ut(c)
    }), a.push({
      type: "target",
      target: r,
      matrix: da(jr(k), c, W)
    })), F) {
      var Mt = r === t, xt = Mt ? 0 : r.scrollLeft, st = Mt ? 0 : r.scrollTop;
      a.push({
        type: "offset",
        target: r,
        matrix: cr([
          et - xt + R - x,
          at - st + _ - P
        ], c)
      });
    } else
      a.push({
        type: "offset",
        target: r,
        origin: W
      });
    if (Q !== 1 && a.push({
      type: "zoom",
      target: r,
      matrix: da(El([Q, Q], c), c, [0, 0])
    }), d || (d = M), u || (u = W), f || (f = V), s || C)
      break;
    r = E, o = D, (!n || r === i) && (s = o);
  }
  return d || (d = Ut(c)), u || (u = [0, 0]), f || (f = [0, 0]), {
    zoom: v,
    offsetContainer: m,
    matrixes: a,
    targetMatrix: d,
    transformOrigin: u,
    targetOrigin: f,
    is3d: l,
    hasFixed: h
  };
}
var tr = null, er = null, Sr = null;
function Pr(t) {
  t ? (window.Map && (tr = /* @__PURE__ */ new Map(), er = /* @__PURE__ */ new Map()), Sr = []) : (tr = null, Sr = null, er = null);
}
function gy(t) {
  var e = er == null ? void 0 : er.get(t);
  if (e)
    return e;
  var n = fa(t, !0);
  return er && er.set(t, n), n;
}
function vy(t, e) {
  if (Sr) {
    var n = ze(Sr, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (n)
      return n[1];
  }
  var r = Ap(t, e, !0);
  return Sr && Sr.push([[t, e], r]), r;
}
function Ne(t) {
  var e = tr == null ? void 0 : tr.get(t);
  if (!e) {
    var n = Xe(t).getComputedStyle(t);
    if (!tr)
      return function(i) {
        return n[i];
      };
    e = {
      style: n,
      cached: {}
    }, tr.set(t, e);
  }
  var r = e.cached, a = e.style;
  return function(i) {
    return i in r || (r[i] = a[i]), r[i];
  };
}
function cn(t, e, n) {
  var r = n.originalDatas;
  r.groupable = r.groupable || {};
  var a = r.groupable;
  a.childDatas = a.childDatas || [];
  var i = a.childDatas;
  return t.moveables.map(function(o, s) {
    return i[s] = i[s] || {}, i[s][e] = i[s][e] || {}, O(O({}, n), { isRequestChild: !0, datas: i[s][e], originalDatas: i[s] });
  });
}
function Ho(t, e, n, r, a, i, o) {
  var s = !!n.match(/Start$/g), l = !!n.match(/End$/g), c = a.isPinch, u = a.datas, f = cn(t, e.name, a), d = t.moveables, h = [], m = f.map(function(v, y) {
    var b = d[y], S = b.state, C = S.gestos, k = v;
    if (s)
      k = new Rr(o).dragStart(r, v), h.push(k);
    else {
      if (C[o] || (C[o] = u.childGestos[y]), !C[o])
        return;
      k = Pa(v, S, r, c, i, o), h.push(k);
    }
    var M = e[n](b, O(O({}, k), { parentFlag: !0 }));
    return l && (C[o] = null), M;
  });
  return s && (u.childGestos = d.map(function(v) {
    return v.state.gestos[o];
  })), {
    eventParams: m,
    childEvents: h
  };
}
function _n(t, e, n, r, a, i) {
  a === void 0 && (a = function(u, f) {
    return f;
  });
  var o = !!n.match(/End$/g), s = cn(t, e.name, r), l = t.moveables, c = s.map(function(u, f) {
    var d = l[f], h = u;
    h = a(d, u);
    var m = e[n](d, O(O({}, h), { parentFlag: !0 }));
    return o && (d.state.gestos = {}), m;
  });
  return c;
}
function $i(t, e, n, r) {
  var a = n.fixedDirection, i = n.fixedPosition, o = r.datas.startPositions || Ue(e.state), s = pe(o, a), l = L(Ee(_a(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), c = l[0], u = l[1];
  return r.datas.originalX = c, r.datas.originalY = u, r;
}
function zp(t, e, n, r) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = dr(t.props, e).zoom, c = ua(o / Math.PI * 180), u = {}, f = t.renderState;
  f.renderDirectionMap || (f.renderDirectionMap = {});
  var d = f.renderDirectionMap;
  n.forEach(function(m) {
    var v = m.dir;
    u[v] = !0;
  });
  var h = _e(s);
  return n.map(function(m) {
    var v = m.data, y = m.classNames, b = m.dir, S = Rl[b];
    if (!S || !u[b])
      return null;
    d[b] = !0;
    var C = (Et(c, 15) + h * _p[b] + 720) % 180, k = {};
    return Br(v).forEach(function(M) {
      k["data-".concat(M)] = v[M];
    }), r.createElement("div", O({ className: mt.apply(void 0, ot(["control", "direction", b, e], L(y), !1)), "data-rotation": C, "data-direction": b }, k, { key: "direction-".concat(b), style: Xi.apply(void 0, ot([o, l], L(S.map(function(M) {
      return i[M];
    })), !1)) }));
  });
}
function Lp(t, e, n, r) {
  var a = dr(t.props, n), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? jl : o;
  return ot(ot([], L(s ? $p(t, r, n, l) : []), !1), L(zp(t, n, l.map(function(c) {
    return {
      data: {},
      classNames: [],
      dir: c
    };
  }), r)), !1);
}
function ka(t, e, n, r, a, i) {
  for (var o = [], s = 6; s < arguments.length; s++)
    o[s - 6] = arguments[s];
  var l = ae(n, r), c = e ? Et(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: mt.apply(void 0, ot(["line", "direction", e ? "edge" : "", e], L(o), !1)), "data-rotation": c, "data-line-key": i, "data-direction": e, style: ra(n, r, a, l) });
}
function Fp(t, e, n, r, a) {
  var i = n === !0 ? Lx : n;
  return i.map(function(o, s) {
    var l = L(Rl[o], 2), c = l[0], u = l[1];
    if (u != null)
      return ka(t, o, r[c], r[u], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function Bp(t) {
  return function(e, n) {
    var r = dr(e.props, t).edge;
    return r && (r === !0 || r.length) ? ot(ot([], L(Fp(n, t, r, e.getState().renderPoses, e.props.zoom)), !1), L(my(e, t, n)), !1) : Gp(e, t, n);
  };
}
function Gp(t, e, n) {
  return Lp(t, jl, e, n);
}
function my(t, e, n) {
  return Lp(t, ["nw", "ne", "sw", "se"], e, n);
}
function $p(t, e, n, r) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, c = a.renderDirectionMap, u = t.props.zoom, f = _e(l), d = s / Math.PI * 180;
  return (r || Br(c)).map(function(h) {
    var m = Rl[h];
    if (!m)
      return null;
    var v = (Et(d, 15) + f * _p[h] + 720) % 180, y = ["around-control"];
    return n && y.push("direction", n), e.createElement("div", { className: mt.apply(void 0, ot([], L(y), !1)), "data-rotation": v, "data-direction": h, key: "direction-around-".concat(h), style: Xi.apply(void 0, ot([s, u], L(m.map(function(b) {
      return o[b];
    })), !1)) });
  });
}
function Ol(t, e, n) {
  var r = t || {}, a = r.position, i = a === void 0 ? "client" : a, o = r.left, s = o === void 0 ? -1 / 0 : o, l = r.top, c = l === void 0 ? -1 / 0 : l, u = r.right, f = u === void 0 ? 1 / 0 : u, d = r.bottom, h = d === void 0 ? 1 / 0 : d, m = {
    position: i,
    left: s,
    top: c,
    right: f,
    bottom: h
  };
  return {
    vertical: Hu(m, e, !0),
    horizontal: Hu(m, n, !1)
  };
}
function io(t, e) {
  var n = t.state, r = n.containerClientRect, a = r.clientHeight, i = r.clientWidth, o = r.clientLeft, s = r.clientTop, l = n.snapOffset, c = l.left, u = l.top, f = l.right, d = l.bottom, h = e || t.props.bounds || {}, m = h.position || "client", v = m === "css", y = h.left, b = y === void 0 ? -1 / 0 : y, S = h.top, C = S === void 0 ? -1 / 0 : S, k = h.right, M = k === void 0 ? v ? -1 / 0 : 1 / 0 : k, E = h.bottom, D = E === void 0 ? v ? -1 / 0 : 1 / 0 : E;
  return v && (M = i + f - c - M, D = a + d - u - D), {
    left: b + c - o,
    right: M + c - o,
    top: C + u - s,
    bottom: D + u - s
  };
}
function xy(t, e, n) {
  var r = io(t), a = r.left, i = r.top, o = r.right, s = r.bottom, l = L(n, 2), c = l[0], u = l[1], f = L(bt(n, e), 2), d = f[0], h = f[1];
  nt(d) < Ie && (d = 0), nt(h) < Ie && (h = 0);
  var m = h > 0, v = d > 0, y = {
    isBound: !1,
    offset: 0,
    pos: 0
  }, b = {
    isBound: !1,
    offset: 0,
    pos: 0
  };
  if (d === 0 && h === 0)
    return {
      vertical: y,
      horizontal: b
    };
  if (d === 0)
    m ? s < u && (b.pos = s, b.offset = u - s) : i > u && (b.pos = i, b.offset = u - i);
  else if (h === 0)
    v ? o < c && (y.pos = o, y.offset = c - o) : a > c && (y.pos = a, y.offset = c - a);
  else {
    var S = h / d, C = n[1] - S * c, k = 0, M = 0, E = !1;
    v && o <= c ? (k = S * o + C, M = o, E = !0) : !v && c <= a && (k = S * a + C, M = a, E = !0), E && (k < i || k > s) && (E = !1), E || (m && s <= u ? (k = s, M = (k - C) / S, E = !0) : !m && u <= i && (k = i, M = (k - C) / S, E = !0)), E && (y.isBound = !0, y.pos = M, y.offset = c - M, b.isBound = !0, b.pos = k, b.offset = u - k);
  }
  return {
    vertical: y,
    horizontal: b
  };
}
function Hu(t, e, n) {
  var r = t[n ? "left" : "top"], a = t[n ? "right" : "bottom"], i = Math.min.apply(Math, ot([], L(e), !1)), o = Math.max.apply(Math, ot([], L(e), !1)), s = [];
  return r + 1 > i && s.push({
    direction: "start",
    isBound: !0,
    offset: i - r,
    pos: r
  }), a - 1 < o && s.push({
    direction: "end",
    isBound: !0,
    offset: o - a,
    pos: a
  }), s.length || s.push({
    isBound: !1,
    offset: 0,
    pos: 0
  }), s.sort(function(l, c) {
    return nt(c.offset) - nt(l.offset);
  });
}
function Xu(t, e, n) {
  var r = n ? t.map(function(a) {
    return Ta(a, n);
  }) : t;
  return r.some(function(a) {
    return a[0] < e.left && nt(a[0] - e.left) > 0.1 || a[0] > e.right && nt(a[0] - e.right) > 0.1 || a[1] < e.top && nt(a[1] - e.top) > 0.1 || a[1] > e.bottom && nt(a[1] - e.bottom) > 0.1;
  });
}
function yy(t, e, n) {
  var r = qe(t), a = Math.sqrt(r * r - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return nt(i - t[n ? 0 : 1]) - nt(o - t[n ? 0 : 1]);
  }).map(function(i) {
    return ae([0, 0], n ? [i, e] : [e, i]);
  });
}
function by(t, e, n, r, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = io(t), s = o.left, l = o.top, c = o.right, u = o.bottom, f = s - r[0], d = c - r[0], h = l - r[1], m = u - r[1], v = {
    left: f,
    top: h,
    right: d,
    bottom: m
  };
  if (!Xu(n, v, 0))
    return [];
  var y = [];
  return [
    [f, 0],
    [d, 0],
    [h, 1],
    [m, 1]
  ].forEach(function(b) {
    var S = L(b, 2), C = S[0], k = S[1];
    n.forEach(function(M) {
      var E = ae([0, 0], M);
      y.push.apply(y, ot([], L(yy(M, C, k).map(function(D) {
        return i + D - E;
      }).filter(function(D) {
        return !Xu(e, v, D);
      }).map(function(D) {
        return Et(D * 180 / Math.PI, Ie);
      })), !1));
    });
  }), y;
}
var wy = ["left", "right", "center"], Sy = ["top", "bottom", "middle"], Vu = {
  left: "start",
  right: "end",
  center: "center",
  top: "start",
  bottom: "end",
  middle: "center"
}, Hn = {
  start: "left",
  end: "right",
  center: "center"
}, Xn = {
  start: "top",
  end: "bottom",
  center: "middle"
};
function Cr() {
  return {
    left: !1,
    top: !1,
    right: !1,
    bottom: !1
  };
}
function Wr(t, e) {
  var n = t.props, r = n.snappable, a = n.bounds, i = n.innerBounds, o = n.verticalGuidelines, s = n.horizontalGuidelines, l = n.snapGridWidth, c = n.snapGridHeight, u = t.state, f = u.guidelines, d = u.enableSnap;
  return !r || !d || e && r !== !0 && r.indexOf(e) < 0 ? !1 : !!(l || c || a || i || f && f.length || o && o.length || s && s.length);
}
function Al(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function Cy(t, e) {
  var n = Al(t), r = {};
  for (var a in n)
    a in e && n[a] && (r[a] = e[a]);
  return r;
}
function zl(t, e) {
  var n = Cy(t, e), r = Sy.filter(function(i) {
    return i in n;
  }), a = wy.filter(function(i) {
    return i in n;
  });
  return {
    horizontalNames: r,
    verticalNames: a,
    horizontal: r.map(function(i) {
      return n[i];
    }),
    vertical: a.map(function(i) {
      return n[i];
    })
  };
}
function ky(t, e, n) {
  var r = ee(t, [e.clientLeft, e.clientTop], n);
  return [
    e.left + r[0],
    e.top + r[1]
  ];
}
function Ey(t) {
  var e = L(t, 2), n = e[0], r = e[1], a = r[0] - n[0], i = r[1] - n[1];
  Math.abs(a) < ce && (a = 0), Math.abs(i) < ce && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * n[0] - n[1]) : (s = 1, l = -n[1]) : (o = -1, l = n[0]), [o, s, l].map(function(c) {
    return Et(c, ce);
  });
}
var Wp = "snapRotationThreshold", Yp = "snapRotationDegrees", Hp = "snapHorizontalThreshold", Xp = "snapVerticalThreshold";
function oo(t, e, n, r, a, i, o) {
  var s;
  r === void 0 && (r = []), a === void 0 && (a = []);
  var l = t.props, c = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], u = ld(o, l[Hp], 5), f = ld(i, l[Xp], 5);
  return Vp(t.state.guidelines, e, n, r, a, u, f, c);
}
function Vp(t, e, n, r, a, i, o, s) {
  return {
    vertical: qu(t, "vertical", e, o * s[0], r),
    horizontal: qu(t, "horizontal", n, i * s[1], a)
  };
}
function My(t, e, n) {
  var r = L(n, 2), a = r[0], i = r[1], o = L(e, 2), s = o[0], l = o[1], c = L(bt(n, e), 2), u = c[0], f = c[1], d = f > 0, h = u > 0;
  u = Vi(u), f = Vi(f);
  var m = {
    isSnap: !1,
    offset: 0,
    pos: 0
  }, v = {
    isSnap: !1,
    offset: 0,
    pos: 0
  };
  if (u === 0 && f === 0)
    return {
      vertical: m,
      horizontal: v
    };
  var y = oo(t, u ? [a] : [], f ? [i] : [], [], [], void 0, void 0), b = y.vertical, S = y.horizontal;
  b.posInfos.filter(function(q) {
    var F = q.pos;
    return h ? F >= s : F <= s;
  }), S.posInfos.filter(function(q) {
    var F = q.pos;
    return d ? F >= l : F <= l;
  }), b.isSnap = b.posInfos.length > 0, S.isSnap = S.posInfos.length > 0;
  var C = Os(b), k = C.isSnap, M = C.guideline, E = Os(S), D = E.isSnap, j = E.guideline, R = D ? j.pos[1] : 0, _ = k ? M.pos[0] : 0;
  if (u === 0)
    D && (v.isSnap = !0, v.pos = j.pos[1], v.offset = i - v.pos);
  else if (f === 0)
    k && (m.isSnap = !0, m.pos = _, m.offset = a - _);
  else {
    var x = f / u, P = n[1] - x * a, I = 0, A = 0, B = !1;
    k ? (A = _, I = x * A + P, B = !0) : D && (I = R, A = (I - P) / x, B = !0), B && (m.isSnap = !0, m.pos = A, m.offset = a - A, v.isSnap = !0, v.pos = I, v.offset = i - I);
  }
  return {
    vertical: m,
    horizontal: v
  };
}
function Fn(t) {
  var e = "";
  return t === -1 || t === "top" || t === "left" ? e = "start" : t === 0 || t === "center" || t === "middle" ? e = "center" : (t === 1 || t === "right" || t === "bottom") && (e = "end"), e;
}
function Ku(t, e, n, r) {
  var a = zl(t.props.snapDirections, e), i = oo(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return Fn(l);
  }), a.horizontalNames.map(function(l) {
    return Fn(l);
  }), n, r), o = Fn(a.horizontalNames[i.horizontal.index]), s = Fn(a.verticalNames[i.vertical.index]);
  return {
    vertical: O(O({}, i.vertical), { direction: s }),
    horizontal: O(O({}, i.horizontal), { direction: o })
  };
}
function Os(t) {
  var e = t.isSnap;
  if (!e)
    return {
      isSnap: !1,
      offset: 0,
      dist: -1,
      pos: 0,
      guideline: null
    };
  var n = t.posInfos[0], r = n.guidelineInfos[0], a = r.offset, i = r.dist, o = r.guideline;
  return {
    isSnap: e,
    offset: a,
    dist: i,
    pos: n.pos,
    guideline: o
  };
}
function qu(t, e, n, r, a) {
  var i, o;
  if (a === void 0 && (a = []), !t || !t.length)
    return {
      isSnap: !1,
      index: -1,
      direction: "",
      posInfos: []
    };
  var s = e === "vertical", l = s ? 0 : 1, c = n.map(function(f, d) {
    var h = a[d] || "", m = t.map(function(v) {
      var y = v.pos, b = f - y[l];
      return {
        offset: b,
        dist: nt(b),
        guideline: v,
        direction: h
      };
    }).filter(function(v) {
      var y = v.guideline, b = v.dist, S = y.type;
      return !(S !== e || b > r);
    }).sort(function(v, y) {
      return v.dist - y.dist;
    });
    return {
      pos: f,
      index: d,
      guidelineInfos: m,
      direction: h
    };
  }).filter(function(f) {
    return f.guidelineInfos.length > 0;
  }).sort(function(f, d) {
    return f.guidelineInfos[0].dist - d.guidelineInfos[0].dist;
  }), u = c.length > 0;
  return {
    isSnap: u,
    index: u ? c[0].index : -1,
    direction: (o = (i = c[0]) === null || i === void 0 ? void 0 : i.direction) !== null && o !== void 0 ? o : "",
    posInfos: c
  };
}
function Dy(t, e, n, r, a) {
  var i = [];
  n[0] && n[1] ? i = [
    n,
    [-n[0], n[1]],
    [n[0], -n[1]]
  ] : !n[0] && !n[1] ? [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1]
  ].forEach(function(d, h, m) {
    var v = m[h + 1] || m[0];
    i.push(d), i.push([
      (d[0] + v[0]) / 2,
      (d[1] + v[1]) / 2
    ]);
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], n) : (i.push.apply(i, ot([], L(ny([
    [-1, -1],
    [1, -1],
    [-1, -1],
    [1, 1]
  ], n)), !1)), i.length > 1 && i.push([
    (i[0][0] + i[1][0]) / 2,
    (i[0][1] + i[1][1]) / 2
  ]));
  var o = i.map(function(d) {
    return pe(e, d);
  }), s = o.map(function(d) {
    return d[0];
  }), l = o.map(function(d) {
    return d[1];
  }), c = oo(t, s, l, i.map(function(d) {
    return Fn(d[0]);
  }), i.map(function(d) {
    return Fn(d[1]);
  }), r, a), u = Fn(i.map(function(d) {
    return d[0];
  })[c.vertical.index]), f = Fn(i.map(function(d) {
    return d[1];
  })[c.horizontal.index]);
  return {
    vertical: O(O({}, c.vertical), { direction: u }),
    horizontal: O(O({}, c.horizontal), { direction: f })
  };
}
function Kp(t, e) {
  var n = nt(t.offset), r = nt(e.offset);
  return t.isBound && e.isBound ? r - n : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? r - n : t.isSnap ? -1 : e.isSnap || n < Ie ? 1 : r < Ie ? -1 : n - r;
}
function Wi(t, e) {
  return t.slice().sort(function(n, r) {
    var a = n.sign[e], i = r.sign[e], o = n.offset[e], s = r.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return Kp({ isBound: n.isBound, isSnap: n.isSnap, offset: o }, { isBound: r.isBound, isSnap: r.isSnap, offset: s });
  })[0];
}
function Ty(t, e, n) {
  var r = [];
  if (n)
    nt(e[0]) !== 1 || nt(e[1]) !== 1 ? r.push([e, [-1, -1]], [e, [-1, 1]], [e, [1, -1]], [e, [1, 1]]) : r.push([e, [t[0], -t[1]]], [e, [-t[0], t[1]]]), r.push([e, t]);
  else if (t[0] && t[1] || !t[0] && !t[1]) {
    var a = t[0] ? t : [1, 1];
    [1, -1].forEach(function(o) {
      [1, -1].forEach(function(s) {
        var l = [o * a[0], s * a[1]];
        e[0] === l[0] && e[1] === l[1] || r.push([e, l]);
      });
    });
  } else if (t[0]) {
    var i = nt(e[0]) === 1 ? [1] : [1, -1];
    i.forEach(function(o) {
      r.push([
        [e[0], -1],
        [o * t[0], -1]
      ], [
        [e[0], 0],
        [o * t[0], 0]
      ], [
        [e[0], 1],
        [o * t[0], 1]
      ]);
    });
  } else if (t[1]) {
    var i = nt(e[1]) === 1 ? [1] : [1, -1];
    i.forEach(function(s) {
      r.push([
        [-1, e[1]],
        [-1, s * t[1]]
      ], [
        [0, e[1]],
        [0, s * t[1]]
      ], [
        [1, e[1]],
        [1, s * t[1]]
      ]);
    });
  }
  return r;
}
function qp(t, e) {
  var n = ws([e[0][0], e[1][0]]), r = ws([e[0][1], e[1][1]]);
  return {
    vertical: n <= t[0],
    horizontal: r <= t[1]
  };
}
function Ll(t, e) {
  var n = L(e, 2), r = n[0], a = n[1], i = a[0] - r[0], o = a[1] - r[1];
  nt(i) < Ie && (i = 0), nt(o) < Ie && (o = 0);
  var s, l;
  if (!i)
    s = r[0], l = t[0];
  else if (!o)
    s = r[1], l = t[1];
  else {
    var c = o / i;
    s = c * (t[0] - r[0]) + r[1], l = t[1];
  }
  return s - l;
}
function Up(t, e, n, r) {
  return r === void 0 && (r = Ie), t.every(function(a) {
    var i = Ll(a, e), o = i <= 0;
    return o === n || nt(i) <= r;
  });
}
function Uu(t, e, n, r, a) {
  return a === void 0 && (a = 0), r && e - a <= t || !r && t <= n + a ? {
    isBound: !0,
    offset: r ? e - t : n - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function _y(t, e) {
  var n = e.line, r = e.centerSign, a = e.verticalSign, i = e.horizontalSign, o = e.lineConstants, s = t.props.innerBounds;
  if (!s)
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var l = s.left, c = s.top, u = s.width, f = s.height, d = [[l, c], [l, c + f]], h = [[l, c], [l + u, c]], m = [[l + u, c], [l + u, c + f]], v = [[l, c + f], [l + u, c + f]];
  if (Up([
    [l, c],
    [l + u, c],
    [l, c + f],
    [l + u, c + f]
  ], n, r))
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var y = Bn(n, o, h, a), b = Bn(n, o, v, a), S = Bn(n, o, d, i), C = Bn(n, o, m, i), k = y.isBound && b.isBound, M = y.isBound || b.isBound, E = S.isBound && C.isBound, D = S.isBound || C.isBound, j = Nr(y.offset, b.offset), R = Nr(S.offset, C.offset), _ = [0, 0], x = !1, P = !1;
  return nt(R) < nt(j) ? (_ = [j, 0], x = M, P = k) : (_ = [0, R], x = D, P = E), {
    isAllBound: P,
    isVerticalBound: M,
    isHorizontalBound: D,
    isBound: x,
    offset: _
  };
}
function Bn(t, e, n, r, a, i) {
  var o = L(e, 2), s = o[0], l = o[1], c = t[0], u = n[0], f = n[1], d = Vi(f[1] - u[1]), h = Vi(f[0] - u[0]), m = l, v = s, y = -s / l;
  if (h) {
    if (!d) {
      if (i && !m)
        return {
          isBound: !1,
          offset: 0
        };
      if (v) {
        var k = (u[1] - c[1]) / y + c[0];
        return Uu(k, u[0], f[0], r, a);
      } else {
        var S = u[1] - c[1], C = nt(S) <= (a || 0);
        return {
          isBound: C,
          offset: C ? S : 0
        };
      }
    }
  } else {
    if (i && !v)
      return {
        isBound: !1,
        offset: 0
      };
    if (m) {
      var b = y * (u[0] - c[0]) + c[1];
      return Uu(b, u[1], f[1], r, a);
    } else {
      var S = u[0] - c[0], C = nt(S) <= (a || 0);
      return {
        isBound: C,
        offset: C ? S : 0
      };
    }
  }
  return {
    isBound: !1,
    offset: 0
  };
}
function Zp(t, e, n) {
  return e.map(function(r) {
    var a = _y(t, r), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, c = r.multiple, u = xn({
      datas: n,
      distX: o[0],
      distY: o[1]
    }).map(function(f, d) {
      return f * (c[d] ? 2 / c[d] : 0);
    });
    return {
      sign: c,
      isBound: i,
      isVerticalBound: s,
      isHorizontalBound: l,
      isSnap: !1,
      offset: u
    };
  });
}
function jy(t, e, n) {
  var r, a = Fl(t, e, [0, 0], !1).map(function(d) {
    return O(O({}, d), { multiple: d.multiple.map(function(h) {
      return nt(h) * 2;
    }) });
  }), i = Zp(t, a, n), o = Wi(i, 0), s = Wi(i, 1), l = 0, c = 0, u = o.isVerticalBound || s.isVerticalBound, f = o.isHorizontalBound || s.isHorizontalBound;
  return (u || f) && (r = L(ty({
    datas: n,
    distX: -o.offset[0],
    distY: -s.offset[1]
  }), 2), l = r[0], c = r[1]), {
    vertical: {
      isBound: u,
      offset: l
    },
    horizontal: {
      isBound: f,
      offset: c
    }
  };
}
function Iy(t, e) {
  var n = [], r = t[0], a = t[1];
  return r && a ? n.push([[0, a * 2], t, [-r, a]], [[r * 2, 0], t, [r, -a]]) : r ? (n.push([[r * 2, 0], [r, 1], [r, -1]]), e && n.push([[0, -1], [r, -1], [-r, -1]], [[0, 1], [r, 1], [-r, 1]])) : a ? (n.push([[0, a * 2], [1, a], [-1, a]]), e && n.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : n.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), n;
}
function Fl(t, e, n, r) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = pr(i, 100, 100, o ? 4 : 3), l = pe(s, [0, 0]);
  return Iy(n, r).map(function(c) {
    var u = L(c, 3), f = u[0], d = u[1], h = u[2], m = [
      pe(s, d),
      pe(s, h)
    ], v = Ey(m), y = qp(l, m), b = y.vertical, S = y.horizontal, C = Ll(l, m) <= 0;
    return {
      multiple: f,
      centerSign: C,
      verticalSign: b,
      horizontalSign: S,
      lineConstants: v,
      line: [
        pe(e, d),
        pe(e, h)
      ]
    };
  });
}
function Zu(t, e, n, r) {
  var a = r ? t.map(function(i) {
    return Ta(i, r);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = Ll(n, i) <= 0;
    return !Up(e, i, o);
  });
}
function Ry(t) {
  var e = L(t, 2), n = e[0], r = e[1], a = r[0] - n[0], i = r[1] - n[1];
  if (!a)
    return nt(n[0]);
  if (!i)
    return nt(n[1]);
  var o = i / a;
  return nt((-o * n[0] + n[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function Py(t) {
  var e = L(t, 2), n = e[0], r = e[1], a = r[0] - n[0], i = r[1] - n[1];
  if (!a)
    return [n[0], 0];
  if (!i)
    return [0, n[1]];
  var o = i / a, s = -o * n[0] + n[1];
  return [
    -s / (o + 1 / o),
    s / (o * o + 1)
  ];
}
function Ny(t, e, n, r, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, c = i.width, u = i.height, f = s - r[0], d = s + c - r[0], h = l - r[1], m = l + u - r[1], v = [
    [f, h],
    [d, h],
    [f, m],
    [d, m]
  ], y = pe(n, [0, 0]);
  if (!Zu(n, v, y, 0))
    return [];
  var b = [], S = v.map(function(C) {
    return [
      qe(C),
      ae([0, 0], C)
    ];
  });
  return [
    [n[0], n[1]],
    [n[1], n[3]],
    [n[3], n[2]],
    [n[2], n[0]]
  ].forEach(function(C) {
    var k = ae([0, 0], Py(C)), M = Ry(C);
    b.push.apply(b, ot([], L(S.filter(function(E) {
      var D = L(E, 1), j = D[0];
      return j && M <= j;
    }).map(function(E) {
      var D = L(E, 2), j = D[0], R = D[1], _ = Math.acos(j ? M / j : 0), x = R + _, P = R - _;
      return [
        o + x - k,
        o + P - k
      ];
    }).reduce(function(E, D) {
      return E.push.apply(E, ot([], L(D), !1)), E;
    }, []).filter(function(E) {
      return !Zu(e, v, y, E);
    }).map(function(E) {
      return Et(E * 180 / Math.PI, Ie);
    })), !1));
  }), b;
}
function Oy(t) {
  var e = t.props.innerBounds, n = Cr();
  if (!e)
    return {
      boundMap: n,
      vertical: [],
      horizontal: []
    };
  var r = t.getRect(), a = r.pos1, i = r.pos2, o = r.pos3, s = r.pos4, l = [a, i, o, s], c = pe(l, [0, 0]), u = e.left, f = e.top, d = e.width, h = e.height, m = [[u, f], [u, f + h]], v = [[u, f], [u + d, f]], y = [[u + d, f], [u + d, f + h]], b = [[u, f + h], [u + d, f + h]], S = Fl(t, l, [0, 0], !1), C = [], k = [];
  return S.forEach(function(M) {
    var E = M.line, D = M.lineConstants, j = qp(c, E), R = j.horizontal, _ = j.vertical, x = Bn(E, D, v, _, 1, !0), P = Bn(E, D, b, _, 1, !0), I = Bn(E, D, m, R, 1, !0), A = Bn(E, D, y, R, 1, !0);
    x.isBound && !n.top && (C.push(f), n.top = !0), P.isBound && !n.bottom && (C.push(f + h), n.bottom = !0), I.isBound && !n.left && (k.push(u), n.left = !0), A.isBound && !n.right && (k.push(u + d), n.right = !0);
  }), {
    boundMap: n,
    horizontal: C,
    vertical: k
  };
}
function Ay(t, e, n, r) {
  var a = e[0] - t[0], i = e[1] - t[1];
  if (nt(a) < ce && (a = 0), nt(i) < ce && (i = 0), !a)
    return r ? [0, 0] : [0, n];
  if (!i)
    return r ? [n, 0] : [0, 0];
  var o = i / a, s = t[1] - o * t[0];
  if (r) {
    var l = o * (e[0] + n) + s;
    return [n, l - e[1]];
  } else {
    var c = (e[1] + n - s) / o;
    return [c - e[0], n];
  }
}
function As(t, e, n, r, a) {
  var i = Ay(t, e, n, r);
  if (!i)
    return {
      isOutside: !1,
      offset: [0, 0]
    };
  var o = vn(t, e), s = vn(i, t), l = vn(i, e), c = s > o || l > o, u = L(xn({
    datas: a,
    distX: i[0],
    distY: i[1]
  }), 2), f = u[0], d = u[1];
  return {
    offset: [f, d],
    isOutside: c
  };
}
function Yi(t, e) {
  return t.isBound ? t.offset : e.isSnap ? Os(e).offset : 0;
}
function zy(t, e, n, r, a) {
  var i = L(e, 2), o = i[0], s = i[1], l = L(n, 2), c = l[0], u = l[1], f = L(r, 2), d = f[0], h = f[1], m = L(a, 2), v = m[0], y = m[1], b = -v, S = -y;
  if (t && o && s) {
    b = 0, S = 0;
    var C = [];
    if (c && u ? C.push([0, y], [v, 0]) : c ? C.push([v, 0]) : u ? C.push([0, y]) : d && h ? C.push([0, y], [v, 0]) : d ? C.push([v, 0]) : h && C.push([0, y]), C.length) {
      C.sort(function(D, j) {
        return qe(bt([o, s], D)) - qe(bt([o, s], j));
      });
      var k = C[0];
      if (k[0] && nt(o) > ce)
        b = -k[0], S = s * nt(o + b) / nt(o) - s;
      else if (k[1] && nt(s) > ce) {
        var M = s;
        S = -k[1], b = o * nt(s + S) / nt(M) - o;
      }
      if (t && u && c)
        if (nt(b) > ce && nt(b) < nt(v)) {
          var E = nt(v) / nt(b);
          b *= E, S *= E;
        } else if (nt(S) > ce && nt(S) < nt(y)) {
          var E = nt(y) / nt(S);
          b *= E, S *= E;
        } else
          b = Nr(-v, b), S = Nr(-y, S);
    }
  } else
    b = o || c ? -v : 0, S = s || u ? -y : 0;
  return [b, S];
}
function Ly(t, e, n, r, a, i) {
  if (!Wr(t, "draggable"))
    return [
      {
        isSnap: !1,
        isBound: !1,
        offset: 0
      },
      {
        isSnap: !1,
        isBound: !1,
        offset: 0
      }
    ];
  var o = $l(i.absolutePoses, [e, n]), s = Ve(o), l = s.left, c = s.right, u = s.top, f = s.bottom, d = {
    horizontal: o.map(function(A) {
      return A[1];
    }),
    vertical: o.map(function(A) {
      return A[0];
    })
  }, h = Al(t.props.snapDirections), m = zl(h, {
    left: l,
    right: c,
    top: u,
    bottom: f,
    center: (l + c) / 2,
    middle: (u + f) / 2
  }), v = so(t, a, m, d), y = v.vertical, b = v.horizontal, S = jy(t, o, i), C = S.vertical, k = S.horizontal, M = y.isSnap, E = b.isSnap, D = y.isBound || C.isBound, j = b.isBound || k.isBound, R = Nr(y.offset, C.offset), _ = Nr(b.offset, k.offset), x = L(zy(r, [e, n], [D, j], [M, E], [R, _]), 2), P = x[0], I = x[1];
  return [
    {
      isBound: D,
      isSnap: M,
      offset: P
    },
    {
      isBound: j,
      isSnap: E,
      offset: I
    }
  ];
}
function so(t, e, n, r) {
  r === void 0 && (r = n);
  var a = Ol(io(t), r.vertical, r.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : oo(t, n.vertical, n.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, c = s.vertical, u = Yi(i[0], l), f = Yi(o[0], c), d = nt(u), h = nt(f);
  return {
    horizontal: {
      isBound: i[0].isBound,
      isSnap: l.isSnap,
      snapIndex: l.index,
      offset: u,
      dist: d,
      bounds: i,
      snap: l
    },
    vertical: {
      isBound: o[0].isBound,
      isSnap: c.isSnap,
      snapIndex: c.index,
      offset: f,
      dist: h,
      bounds: o,
      snap: c
    }
  };
}
function Ju(t, e, n, r, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = Ol(e, n, r), l = s.horizontal, c = s.vertical, u = Vp(t, n, r, [], [], a, i, o), f = u.horizontal, d = u.vertical, h = Yi(l[0], f), m = Yi(c[0], d), v = nt(h), y = nt(m);
  return {
    horizontal: {
      isBound: l[0].isBound,
      isSnap: f.isSnap,
      snapIndex: f.index,
      offset: h,
      dist: v,
      bounds: l,
      snap: f
    },
    vertical: {
      isBound: c[0].isBound,
      isSnap: d.isSnap,
      snapIndex: d.index,
      offset: m,
      dist: y,
      bounds: c,
      snap: d
    }
  };
}
function Fy(t, e, n, r) {
  var a = ae(t, e) / Math.PI * 180, i = n.vertical, o = i.isBound, s = i.isSnap, l = i.dist, c = n.horizontal, u = c.isBound, f = c.isSnap, d = c.dist, h = a % 180, m = h < 3 || h > 177, v = h > 87 && h < 93;
  return d < l && (o || s && !v && (!r || !m)) ? "vertical" : u || f && !m && (!r || !v) ? "horizontal" : "";
}
function By(t, e, n, r, a, i) {
  return n.map(function(o) {
    var s = L(o, 2), l = s[0], c = s[1], u = pe(e, l), f = pe(e, c), d = r ? Gy(t, u, f, a) : so(t, a, {
      vertical: [f[0]],
      horizontal: [f[1]]
    }), h = d.horizontal, m = h.offset, v = h.isBound, y = h.isSnap, b = d.vertical, S = b.offset, C = b.isBound, k = b.isSnap, M = bt(c, l);
    if (!S && !m)
      return {
        isBound: C || v,
        isSnap: k || y,
        sign: M,
        offset: [0, 0]
      };
    var E = Fy(u, f, d, r);
    if (!E)
      return {
        sign: M,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var D = E === "vertical", j = [0, 0];
    return !r && nt(c[0]) === 1 && nt(c[1]) === 1 && l[0] !== c[0] && l[1] !== c[1] ? j = xn({
      datas: i,
      distX: -S,
      distY: -m
    }) : j = As(u, f, -(D ? S : m), D, i).offset, j = j.map(function(R, _) {
      return R * (M[_] ? 2 / M[_] : 0);
    }), {
      sign: M,
      isBound: D ? C : v,
      isSnap: D ? k : y,
      offset: j
    };
  });
}
function Qu(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function Gy(t, e, n, r) {
  var a = xy(t, e, n), i = a.horizontal, o = a.vertical, s = r ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : My(t, e, n), l = s.horizontal, c = s.vertical, u = Qu(i, l), f = Qu(o, c), d = nt(u), h = nt(f);
  return {
    horizontal: {
      isBound: i.isBound,
      isSnap: l.isSnap,
      offset: u,
      dist: d
    },
    vertical: {
      isBound: o.isBound,
      isSnap: c.isSnap,
      offset: f,
      dist: h
    }
  };
}
function $y(t, e, n, r, a) {
  var i = [-n[0], -n[1]], o = t.state, s = o.width, l = o.height, c = t.props.bounds, u = 1 / 0, f = 1 / 0;
  if (c) {
    var d = [
      [n[0], -n[1]],
      [-n[0], n[1]]
    ], h = c.left, m = h === void 0 ? -1 / 0 : h, v = c.top, y = v === void 0 ? -1 / 0 : v, b = c.right, S = b === void 0 ? 1 / 0 : b, C = c.bottom, k = C === void 0 ? 1 / 0 : C;
    d.forEach(function(M) {
      var E = M[0] !== i[0], D = M[1] !== i[1], j = pe(e, M), R = ae(r, j) * 360 / Math.PI;
      if (D) {
        var _ = j.slice();
        (nt(R - 360) < 2 || nt(R - 180) < 2) && (_[1] = r[1]);
        var x = As(r, _, (r[1] < j[1] ? k : y) - j[1], !1, a), P = L(x.offset, 2), I = P[1], A = x.isOutside;
        isNaN(I) || (f = l + (A ? 1 : -1) * nt(I));
      }
      if (E) {
        var _ = j.slice();
        (nt(R - 90) < 2 || nt(R - 270) < 2) && (_[0] = r[0]);
        var B = As(r, _, (r[0] < j[0] ? S : m) - j[0], !0, a), q = L(B.offset, 1), F = q[0], N = B.isOutside;
        isNaN(F) || (u = s + (N ? 1 : -1) * nt(F));
      }
    });
  }
  return {
    maxWidth: u,
    maxHeight: f
  };
}
var Te = {
  name: "draggable",
  props: [
    "draggable",
    "throttleDrag",
    "throttleDragRotate",
    "hideThrottleDragRotateLine",
    "startDragRotate",
    "edgeDraggable"
  ],
  events: [
    "dragStart",
    "drag",
    "dragEnd",
    "dragGroupStart",
    "dragGroup",
    "dragGroupEnd"
  ],
  requestStyle: function() {
    return ["left", "top", "right", "bottom"];
  },
  requestChildStyle: function() {
    return ["left", "top", "right", "bottom"];
  },
  render: function(t, e) {
    var n = t.props, r = n.hideThrottleDragRotateLine, a = n.throttleDragRotate, i = n.zoom, o = t.getState(), s = o.dragInfo, l = o.beforeOrigin;
    if (r || !a || !s)
      return [];
    var c = s.dist;
    if (!c[0] && !c[1])
      return [];
    var u = qe(c), f = ae(c, [0, 0]);
    return [e.createElement("div", { className: mt("line", "horizontal", "dragline", "dashed"), key: "dragRotateGuideline", style: {
      width: "".concat(u, "px"),
      transform: "translate(".concat(l[0], "px, ").concat(l[1], "px) rotate(").concat(f, "rad) scaleY(").concat(i, ")")
    } })];
  },
  dragStart: function(t, e) {
    var n = e.datas, r = e.parentEvent, a = e.parentGesto, i = t.state, o = i.gestos, s = i.style;
    if (o.draggable)
      return !1;
    o.draggable = a || t.targetGesto, n.datas = {}, n.left = parseFloat(s.left || "") || 0, n.top = parseFloat(s.top || "") || 0, n.bottom = parseFloat(s.bottom || "") || 0, n.right = parseFloat(s.right || "") || 0, n.startValue = [0, 0], fr(t, e), ao(t, e, "translate"), sb(t, n), n.prevDist = [0, 0], n.prevBeforeDist = [0, 0], n.isDrag = !1, n.deltaOffset = [0, 0];
    var l = Rt(t, e, O({ set: function(u) {
      n.startValue = u;
    } }, ro(t, e))), c = r || pt(t, "onDragStart", l);
    return c !== !1 ? (n.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, n.isPinch = !1), n.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      eo(t, e, "translate");
      var n = e.datas, r = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, c = e.isGroup, u = e.parentThrottleDrag, f = e.distX, d = e.distY, h = n.isDrag, m = n.prevDist, v = n.prevBeforeDist, y = n.startValue;
      if (h) {
        o && (f += o[0], d += o[1]);
        var b = t.props, S = b.parentMoveable, C = c ? 0 : b.throttleDrag || u || 0, k = r ? 0 : b.throttleDragRotate || 0, M = 0, E = !1, D = !1, j = !1, R = !1;
        if (!r && k > 0 && (f || d)) {
          var _ = b.startDragRotate || 0, x = Et(_ + ae([0, 0], [f, d]) * 180 / Math.PI, k) - _, P = d * Math.abs(Math.cos((x - 90) / 180 * Math.PI)), I = f * Math.abs(Math.cos(x / 180 * Math.PI)), A = qe([I, P]);
          M = x * Math.PI / 180, f = A * Math.cos(M), d = A * Math.sin(M);
        }
        if (!i && !r && !a) {
          var B = L(Ly(t, f, d, k, !s && l || o, n), 2), q = B[0], F = B[1];
          E = q.isSnap, D = q.isBound, j = F.isSnap, R = F.isBound;
          var N = q.offset, W = F.offset;
          f += N, d += W;
        }
        var V = Bt(Rp({ datas: n, distX: f, distY: d }), y), X = Bt(Qx({ datas: n, distX: f, distY: d }), y);
        Bu(X, Ie), Bu(V, Ie), k || (!E && !D && (X[0] = Et(X[0], C), V[0] = Et(V[0], C)), !j && !R && (X[1] = Et(X[1], C), V[1] = Et(V[1], C)));
        var J = bt(V, y), et = bt(X, y), at = bt(et, m), Q = bt(J, v);
        n.prevDist = et, n.prevBeforeDist = J, n.passDelta = at, n.passDist = et;
        var it = n.left + J[0], ut = n.top + J[1], Z = n.right - J[0], dt = n.bottom - J[1], ht = no(n, "translate(".concat(X[0], "px, ").concat(X[1], "px)"), "translate(".concat(et[0], "px, ").concat(et[1], "px)"));
        if (Pl(e, ht), t.state.dragInfo.dist = r ? [0, 0] : et, !(!r && !S && at.every(function(st) {
          return !st;
        }) && Q.some(function(st) {
          return !st;
        }))) {
          var tt = t.state, ft = tt.width, Mt = tt.height, xt = Rt(t, e, O({ transform: ht, dist: et, delta: at, translate: X, beforeDist: J, beforeDelta: Q, beforeTranslate: V, left: it, top: ut, right: Z, bottom: dt, width: ft, height: Mt, isPinch: i }, je({
            transform: ht
          }, e)));
          return !r && pt(t, "onDrag", xt), xt;
        }
      }
    }
  },
  dragAfter: function(t, e) {
    var n = e.datas, r = n.deltaOffset;
    return r[0] || r[1] ? (n.deltaOffset = [0, 0], this.drag(t, O(O({}, e), { deltaOffset: r }))) : !1;
  },
  dragEnd: function(t, e) {
    var n = e.parentEvent, r = e.datas;
    if (t.state.dragInfo = null, !!r.isDrag) {
      r.isDrag = !1;
      var a = Le(t, e, {});
      return !n && pt(t, "onDragEnd", a), a;
    }
  },
  dragGroupStart: function(t, e) {
    var n, r, a = e.datas, i = e.clientX, o = e.clientY, s = this.dragStart(t, e);
    if (!s)
      return !1;
    var l = Ho(t, this, "dragStart", [
      i || 0,
      o || 0
    ], e, !1, "draggable"), c = l.childEvents, u = l.eventParams, f = O(O({}, s), { targets: t.props.targets, events: u }), d = pt(t, "onDragGroupStart", f);
    a.isDrag = d !== !1;
    var h = (r = (n = c[0]) === null || n === void 0 ? void 0 : n.datas.startValue) !== null && r !== void 0 ? r : [0, 0];
    return a.throttleOffset = [h[0] % 1, h[1] % 1], a.isDrag ? s : !1;
  },
  dragGroup: function(t, e) {
    var n = e.datas;
    if (n.isDrag) {
      var r = this.drag(t, O(O({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = Ho(t, this, "drag", a, e, !1, "draggable").eventParams;
      if (r) {
        var o = O({ targets: t.props.targets, events: i }, r);
        return pt(t, "onDragGroup", o), o;
      }
    }
  },
  dragGroupEnd: function(t, e) {
    var n = e.isDrag, r = e.datas;
    if (r.isDrag) {
      this.dragEnd(t, e);
      var a = Ho(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
      return pt(t, "onDragGroupEnd", Le(t, e, {
        targets: t.props.targets,
        events: a
      })), n;
    }
  },
  /**
       * @method Moveable.Draggable#request
       * @param {object} [e] - the draggable's request parameter
       * @param {number} [e.x] - x position
       * @param {number} [e.y] - y position
       * @param {number} [e.deltaX] - X number to move
       * @param {number} [e.deltaY] - Y number to move
       * @return {Moveable.Requester} Moveable Requester
       * @example
  
       * // Instantly Request (requestStart - request - requestEnd)
       * // Use Relative Value
       * moveable.request("draggable", { deltaX: 10, deltaY: 10 }, true);
       * // Use Absolute Value
       * moveable.request("draggable", { x: 200, y: 100 }, true);
       *
       * // requestStart
       * const requester = moveable.request("draggable");
       *
       * // request
       * // Use Relative Value
       * requester.request({ deltaX: 10, deltaY: 10 });
       * requester.request({ deltaX: 10, deltaY: 10 });
       * requester.request({ deltaX: 10, deltaY: 10 });
       * // Use Absolute Value
       * moveable.request("draggable", { x: 200, y: 100 });
       * moveable.request("draggable", { x: 220, y: 100 });
       * moveable.request("draggable", { x: 240, y: 100 });
       *
       * // requestEnd
       * requester.requestEnd();
       */
  request: function(t) {
    var e = {}, n = t.getRect(), r = 0, a = 0, i = !1;
    return {
      isControl: !1,
      requestStart: function(o) {
        return i = o.useSnap, { datas: e, useSnap: i };
      },
      request: function(o) {
        return "x" in o ? r = o.x - n.left : "deltaX" in o && (r += o.deltaX), "y" in o ? a = o.y - n.top : "deltaY" in o && (a += o.deltaY), { datas: e, distX: r, distY: a, useSnap: i };
      },
      requestEnd: function() {
        return { datas: e, isDrag: !0, useSnap: i };
      }
    };
  },
  unset: function(t) {
    t.state.gestos.draggable = null, t.state.dragInfo = null;
  }
};
function Jp(t, e) {
  var n = pe(t, e), r = [0, 0];
  return {
    fixedPosition: n,
    fixedDirection: e,
    fixedOffset: r
  };
}
function Wy(t, e) {
  var n = t.allMatrix, r = t.is3d, a = t.width, i = t.height, o = r ? 4 : 3, s = [
    a / 2 * (1 + e[0]),
    i / 2 * (1 + e[1])
  ], l = ee(n, s, o), c = [0, 0];
  return {
    fixedPosition: l,
    fixedDirection: e,
    fixedOffset: c
  };
}
function Qp(t, e) {
  var n = t.allMatrix, r = t.is3d, a = t.width, i = t.height, o = r ? 4 : 3, s = sy(e, a, i), l = ee(n, e, o), c = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: c
  };
}
var td = Hl("resizable"), zs = {
  name: "resizable",
  ableGroup: "size",
  canPinch: !0,
  props: [
    "resizable",
    "throttleResize",
    "renderDirections",
    "displayAroundControls",
    "keepRatio",
    "resizeFormat",
    "keepRatioFinally",
    "edge",
    "checkResizableError"
  ],
  events: [
    "resizeStart",
    "beforeResize",
    "resize",
    "resizeEnd",
    "resizeGroupStart",
    "beforeResizeGroup",
    "resizeGroup",
    "resizeGroupEnd"
  ],
  render: Bp("resizable"),
  dragControlCondition: td,
  viewClassName: Yl("resizable"),
  dragControlStart: function(t, e) {
    var n, r = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, c = e.parentFixedDirection, u = e.parentEvent, f = fh(o, a, r, l), d = t.state, h = d.target, m = d.width, v = d.height, y = d.gestos;
    if (!f || !h || y.resizable)
      return !1;
    y.resizable = s || t.controlGesto, !a && fr(t, e), l.datas = {}, l.direction = f, l.startOffsetWidth = m, l.startOffsetHeight = v, l.prevWidth = 0, l.prevHeight = 0, l.minSize = [0, 0], l.startWidth = d.inlineCSSWidth || d.cssWidth, l.startHeight = d.inlineCSSHeight || d.cssHeight, l.maxSize = [1 / 0, 1 / 0], i || (l.minSize = [
      d.minOffsetWidth,
      d.minOffsetHeight
    ], l.maxSize = [
      d.maxOffsetWidth,
      d.maxOffsetHeight
    ]);
    var b = t.props.transformOrigin || "% %";
    l.transformOrigin = Ke(b) ? b.split(" ") : b, l.startOffsetMatrix = d.offsetMatrix, l.startTransformOrigin = d.transformOrigin, l.isWidth = (n = e == null ? void 0 : e.parentIsWidth) !== null && n !== void 0 ? n : !f[0] && !f[1] || f[0] || !f[1];
    function S(R) {
      l.ratio = R && isFinite(R) ? R : 0;
    }
    l.startPositions = Ue(t.state);
    function C(R) {
      var _ = Jp(l.startPositions, R);
      l.fixedDirection = _.fixedDirection, l.fixedPosition = _.fixedPosition, l.fixedOffset = _.fixedOffset;
    }
    function k(R) {
      var _ = Qp(t.state, R);
      l.fixedDirection = _.fixedDirection, l.fixedPosition = _.fixedPosition, l.fixedOffset = _.fixedOffset;
    }
    function M(R) {
      l.minSize = [
        Yt("".concat(R[0]), 0) || 0,
        Yt("".concat(R[1]), 0) || 0
      ];
    }
    function E(R) {
      var _ = [
        R[0] || 1 / 0,
        R[1] || 1 / 0
      ];
      (!wa(_[0]) || isFinite(_[0])) && (_[0] = Yt("".concat(_[0]), 0) || 1 / 0), (!wa(_[1]) || isFinite(_[1])) && (_[1] = Yt("".concat(_[1]), 0) || 1 / 0), l.maxSize = _;
    }
    S(m / v), C(c || [-f[0], -f[1]]), l.setFixedDirection = C, l.setFixedPosition = k, l.setMin = M, l.setMax = E;
    var D = Rt(t, e, {
      direction: f,
      startRatio: l.ratio,
      set: function(R) {
        var _ = L(R, 2), x = _[0], P = _[1];
        l.startWidth = x, l.startHeight = P;
      },
      setMin: M,
      setMax: E,
      setRatio: S,
      setFixedDirection: C,
      setFixedPosition: k,
      setOrigin: function(R) {
        l.transformOrigin = R;
      },
      dragStart: Te.dragStart(t, new Rr().dragStart([0, 0], e))
    }), j = u || pt(t, "onResizeStart", D);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, j !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: f
    }), l.isResize ? D : !1;
  },
  dragControl: function(t, e) {
    var n, r = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, c = e.useSnap, u = e.isRequest, f = e.isGroup, d = e.parentEvent, h = e.resolveMatrix, m = r.isResize, v = r.transformOrigin, y = r.startWidth, b = r.startHeight, S = r.prevWidth, C = r.prevHeight, k = r.minSize, M = r.maxSize, E = r.ratio, D = r.startOffsetWidth, j = r.startOffsetHeight, R = r.isWidth;
    if (!m)
      return;
    if (h) {
      var _ = t.state.is3d, x = r.startOffsetMatrix, P = r.startTransformOrigin, I = _ ? 4 : 3, A = jr(Gi(e)), B = Math.sqrt(A.length);
      I !== B && (A = dn(A, B, I));
      var q = Na(x, A, P, I), F = pr(q, D, j, I);
      r.startPositions = F, r.nextTargetMatrix = A, r.nextAllMatrix = q;
    }
    var N = dr(t.props, "resizable"), W = N.resizeFormat, V = N.throttleResize, X = V === void 0 ? a ? 0 : 1 : V, J = N.parentMoveable, et = N.keepRatioFinally, at = r.direction, Q = at, it = 0, ut = 0;
    !at[0] && !at[1] && (Q = [1, 1]);
    var Z = E && (o ?? N.keepRatio) || !1;
    function dt() {
      var Nt = r.fixedDirection, Ft = xh(Q, Z, r, e);
      it = Ft.distWidth, ut = Ft.distHeight;
      var Ct = Q[0] - Nt[0] || Z ? Math.max(D + it, Ie) : D, Jt = Q[1] - Nt[1] || Z ? Math.max(j + ut, Ie) : j;
      return Z && D && j && (R ? Jt = Ct / E : Ct = Jt * E), [Ct, Jt];
    }
    var ht = L(dt(), 2), tt = ht[0], ft = ht[1];
    d || (r.setFixedDirection(r.fixedDirection), pt(t, "onBeforeResize", Rt(t, e, {
      startFixedDirection: r.startFixedDirection,
      startFixedPosition: r.startFixedPosition,
      setFixedDirection: function(Nt) {
        var Ft;
        return r.setFixedDirection(Nt), Ft = L(dt(), 2), tt = Ft[0], ft = Ft[1], [tt, ft];
      },
      setFixedPosition: function(Nt) {
        var Ft;
        return r.setFixedPosition(Nt), Ft = L(dt(), 2), tt = Ft[0], ft = Ft[1], [tt, ft];
      },
      boundingWidth: tt,
      boundingHeight: ft,
      setSize: function(Nt) {
        var Ft;
        Ft = L(Nt, 2), tt = Ft[0], ft = Ft[1];
      }
    }, !0)));
    var Mt = s;
    s || (!a && i ? Mt = dy(t, [0, 0]) : Mt = r.fixedPosition);
    var xt = [0, 0];
    i || (xt = ib(t, tt, ft, at, Mt, !c && u, r)), l && (!l[0] && (xt[0] = 0), !l[1] && (xt[1] = 0));
    function st() {
      var Nt;
      W && (Nt = L(W([tt, ft]), 2), tt = Nt[0], ft = Nt[1]), tt = Et(tt, X), ft = Et(ft, X);
    }
    if (Z) {
      Q[0] && Q[1] && xt[0] && xt[1] && (nt(xt[0]) > nt(xt[1]) ? xt[1] = 0 : xt[0] = 0);
      var St = !xt[0] && !xt[1];
      St && st(), Q[0] && !Q[1] || xt[0] && !xt[1] || St && R ? (tt += xt[0], ft = tt / E) : (!Q[0] && Q[1] || !xt[0] && xt[1] || St && !R) && (ft += xt[1], tt = ft * E);
    } else
      tt += xt[0], ft += xt[1], tt = Math.max(0, tt), ft = Math.max(0, ft);
    n = L(Sl([tt, ft], k, M, Z ? E : !1), 2), tt = n[0], ft = n[1], st(), Z && (f || et) && (R ? ft = tt / E : tt = ft * E), it = tt - D, ut = ft - j;
    var Pt = [it - S, ut - C];
    r.prevWidth = it, r.prevHeight = ut;
    var Tt = uy(t, tt, ft, Mt, v, r);
    if (!(!J && Pt.every(function(Nt) {
      return !Nt;
    }) && Tt.every(function(Nt) {
      return !Nt;
    }))) {
      var vt = Te.drag(t, Pa(e, t.state, Tt, !!i, !1, "draggable")), gt = vt.transform, At = y + it, _t = b + ut, Xt = Rt(t, e, O({ width: At, height: _t, offsetWidth: Math.round(tt), offsetHeight: Math.round(ft), startRatio: E, boundingWidth: tt, boundingHeight: ft, direction: at, dist: [it, ut], delta: Pt, isPinch: !!i, drag: vt }, hh({
        style: {
          width: "".concat(At, "px"),
          height: "".concat(_t, "px")
        },
        transform: gt
      }, vt, e)));
      return !d && pt(t, "onResize", Xt), Xt;
    }
  },
  dragControlAfter: function(t, e) {
    var n = e.datas, r = n.isResize, a = n.startOffsetWidth, i = n.startOffsetHeight, o = n.prevWidth, s = n.prevHeight;
    if (!(!r || t.props.checkResizableError === !1)) {
      var l = t.state, c = l.width, u = l.height, f = c - (a + o), d = u - (i + s), h = nt(f) > 3, m = nt(d) > 3;
      if (h && (n.startWidth += f, n.startOffsetWidth += f, n.prevWidth += f), m && (n.startHeight += d, n.startOffsetHeight += d, n.prevHeight += d), h || m)
        return this.dragControl(t, e);
    }
  },
  dragControlEnd: function(t, e) {
    var n = e.datas, r = e.parentEvent;
    if (n.isResize) {
      n.isResize = !1;
      var a = Le(t, e, {});
      return !r && pt(t, "onResizeEnd", a), a;
    }
  },
  dragGroupControlCondition: td,
  dragGroupControlStart: function(t, e) {
    var n = e.datas, r = this.dragControlStart(t, O(O({}, e), { isGroup: !0 }));
    if (!r)
      return !1;
    var a = cn(t, "resizable", e), i = n.startOffsetWidth, o = n.startOffsetHeight;
    function s() {
      var h = n.minSize;
      a.forEach(function(m) {
        var v = m.datas, y = v.minSize, b = v.startOffsetWidth, S = v.startOffsetHeight, C = i * (b ? y[0] / b : 0), k = o * (S ? y[1] / S : 0);
        h[0] = Math.max(h[0], C), h[1] = Math.max(h[1], k);
      });
    }
    function l() {
      var h = n.maxSize;
      a.forEach(function(m) {
        var v = m.datas, y = v.maxSize, b = v.startOffsetWidth, S = v.startOffsetHeight, C = i * (b ? y[0] / b : 0), k = o * (S ? y[1] / S : 0);
        h[0] = Math.min(h[0], C), h[1] = Math.min(h[1], k);
      });
    }
    var c = _n(t, this, "dragControlStart", e, function(h, m) {
      return $i(t, h, n, m);
    });
    s(), l();
    var u = function(h) {
      r.setFixedDirection(h), c.forEach(function(m, v) {
        m.setFixedDirection(h), $i(t, m.moveable, n, a[v]);
      });
    };
    n.setFixedDirection = u;
    var f = O(O({}, r), { targets: t.props.targets, events: c.map(function(h) {
      return O(O({}, h), { setMin: function(m) {
        h.setMin(m), s();
      }, setMax: function(m) {
        h.setMax(m), l();
      } });
    }), setFixedDirection: u, setMin: function(h) {
      r.setMin(h), s();
    }, setMax: function(h) {
      r.setMax(h), l();
    } }), d = pt(t, "onResizeGroupStart", f);
    return n.isResize = d !== !1, n.isResize ? r : !1;
  },
  dragGroupControl: function(t, e) {
    var n = e.datas;
    if (n.isResize) {
      var r = dr(t.props, "resizable");
      co(t, "onBeforeResize", function(h) {
        pt(t, "onBeforeResizeGroup", Rt(t, e, O(O({}, h), { targets: r.targets }), !0));
      });
      var a = this.dragControl(t, O(O({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = r.keepRatio, c = [
          i / (i - s[0]),
          o / (o - s[1])
        ], u = n.fixedPosition, f = _n(t, this, "dragControl", e, function(h, m) {
          var v = L(Ee(_a(t.rotation / 180 * Math.PI, 3), [
            m.datas.originalX * c[0],
            m.datas.originalY * c[1],
            1
          ], 3), 2), y = v[0], b = v[1];
          return O(O({}, m), { parentDist: null, parentScale: c, dragClient: Bt(u, [y, b]), parentKeepRatio: l });
        }), d = O({ targets: r.targets, events: f }, a);
        return pt(t, "onResizeGroup", d), d;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var n = e.isDrag, r = e.datas;
    if (r.isResize) {
      this.dragControlEnd(t, e);
      var a = _n(t, this, "dragControlEnd", e), i = Le(t, e, {
        targets: t.props.targets,
        events: a
      });
      return pt(t, "onResizeGroupEnd", i), n;
    }
  },
  /**
       * @method Moveable.Resizable#request
       * @param {Moveable.Resizable.ResizableRequestParam} e - the Resizable's request parameter
       * @return {Moveable.Requester} Moveable Requester
       * @example
  
       * // Instantly Request (requestStart - request - requestEnd)
       * // Use Relative Value
       * moveable.request("resizable", { deltaWidth: 10, deltaHeight: 10 }, true);
       *
       * // Use Absolute Value
       * moveable.request("resizable", { offsetWidth: 100, offsetHeight: 100 }, true);
       *
       * // requestStart
       * const requester = moveable.request("resizable");
       *
       * // request
       * // Use Relative Value
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       *
       * // Use Absolute Value
       * moveable.request("resizable", { offsetWidth: 100, offsetHeight: 100 });
       * moveable.request("resizable", { offsetWidth: 110, offsetHeight: 100 });
       * moveable.request("resizable", { offsetWidth: 120, offsetHeight: 100 });
       *
       * // requestEnd
       * requester.requestEnd();
       */
  request: function(t) {
    var e = {}, n = 0, r = 0, a = !1, i = t.getRect();
    return {
      isControl: !0,
      requestStart: function(o) {
        var s;
        return a = o.useSnap, {
          datas: e,
          parentDirection: o.direction || [1, 1],
          parentIsWidth: (s = o == null ? void 0 : o.horizontal) !== null && s !== void 0 ? s : !0,
          useSnap: a
        };
      },
      request: function(o) {
        return "offsetWidth" in o ? n = o.offsetWidth - i.offsetWidth : "deltaWidth" in o && (n += o.deltaWidth), "offsetHeight" in o ? r = o.offsetHeight - i.offsetHeight : "deltaHeight" in o && (r += o.deltaHeight), {
          datas: e,
          parentDist: [n, r],
          parentKeepRatio: o.keepRatio,
          useSnap: a
        };
      },
      requestEnd: function() {
        return { datas: e, isDrag: !0, useSnap: a };
      }
    };
  },
  unset: function(t) {
    t.state.gestos.resizable = null;
  }
};
function Xo(t, e, n, r, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, c = ee(
    t.state.rootMatrix,
    // TO-DO #710
    bt([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), u = Bt([a.left, a.top], c);
  e.startAbsoluteOrigin = u, e.prevDeg = ae(u, [n, r]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = vn(u, [n, r]);
}
function Mi(t, e, n) {
  var r = n.defaultDeg, a = n.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - r);
  return n.prevDeg = r + s, s;
}
function Vo(t, e, n, r) {
  return Mi(ae(r.startAbsoluteOrigin, [t, e]) / Math.PI * 180, n, r);
}
function Ko(t, e, n, r, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = n.prevSnapDeg, c = 0, u = !1;
  if (i) {
    var f = ab(t, e, r, a + r);
    u = f.isSnap, c = a + f.dist;
  }
  u || (c = Et(a + r, s));
  var d = c - a;
  return n.prevSnapDeg = d, [d - l, d, c];
}
function th(t, e, n) {
  var r = L(e, 4), a = r[0], i = r[1], o = r[2], s = r[3];
  if (t === "none")
    return [];
  if (re(t))
    return t.map(function(y) {
      return th(y, [a, i, o, s], n)[0];
    });
  var l = L((t || "top").split("-"), 2), c = l[0], u = l[1], f = [a, i];
  c === "left" ? f = [o, a] : c === "right" ? f = [i, s] : c === "bottom" && (f = [s, o]);
  var d = [
    (f[0][0] + f[1][0]) / 2,
    (f[0][1] + f[1][1]) / 2
  ], h = uh(f, n);
  if (u) {
    var m = u === "top" || u === "left", v = c === "bottom" || c === "left";
    d = f[m && !v || !m && v ? 0 : 1];
  }
  return [[d, h]];
}
function Ls(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var n = e.inputEvent.target;
  if (ue(n, mt("rotation-control")) || t.props.rotateAroundControls && ue(n, mt("around-control")) || ue(n, mt("control")) && ue(n, mt("rotatable")))
    return !0;
  var r = t.props.rotationTarget;
  return r ? Xl(r, !0).some(function(a) {
    return a ? n === a || n.contains(a) : !1;
  }) : !1;
}
var Yy = `.rotation {
position: absolute;
height: 40px;
width: 1px;
transform-origin: 50% 100%;
height: calc(40px * var(--zoom));
top: auto;
left: 0;
bottom: 100%;
will-change: transform;
}
.rotation .rotation-line {
display: block;
width: 100%;
height: 100%;
transform-origin: 50% 50%;
}
.rotation .rotation-control {
border-color: #4af;
border-color: var(--moveable-color);
background:#fff;
cursor: alias;
}
:global .view-rotation-dragging, .rotatable.direction.control {
cursor: alias;
}
.rotatable.direction.control.move {
cursor: move;
}
`, Hy = {
  name: "rotatable",
  canPinch: !0,
  props: [
    "rotatable",
    "rotationPosition",
    "throttleRotate",
    "renderDirections",
    "rotationTarget",
    "rotateAroundControls",
    "edge",
    "resolveAblesWithRotatable",
    "displayAroundControls"
  ],
  events: [
    "rotateStart",
    "beforeRotate",
    "rotate",
    "rotateEnd",
    "rotateGroupStart",
    "beforeRotateGroup",
    "rotateGroup",
    "rotateGroupEnd"
  ],
  css: [Yy],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? mt("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var n = dr(t.props, "rotatable"), r = n.rotatable, a = n.rotationPosition, i = n.zoom, o = n.renderDirections, s = n.rotateAroundControls, l = n.resolveAblesWithRotatable, c = t.getState(), u = c.renderPoses, f = c.direction;
    if (!r)
      return null;
    var d = th(a, u, f), h = [];
    if (d.forEach(function(b, S) {
      var C = L(b, 2), k = C[0], M = C[1];
      h.push(e.createElement(
        "div",
        { key: "rotation".concat(S), className: mt("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(k[0], "px, ").concat(k[1], "px) rotate(").concat(M, "rad)")
        } },
        e.createElement("div", { className: mt("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: mt("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var m = Br(l || {}), v = {};
      m.forEach(function(b) {
        l[b].forEach(function(S) {
          v[S] = b;
        });
      });
      var y = [];
      re(o) && (y = o.map(function(b) {
        var S = v[b];
        return {
          data: S ? { resolve: S } : {},
          classNames: S ? ["move"] : [],
          dir: b
        };
      })), h.push.apply(h, ot([], L(zp(t, "rotatable", y, e)), !1));
    }
    return s && h.push.apply(h, ot([], L($p(t, e)), !1)), h;
  },
  dragControlCondition: Ls,
  dragControlStart: function(t, e) {
    var n, r, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, c = e.isPinch, u = e.isRequest, f = t.state, d = f.target, h = f.left, m = f.top, v = f.direction, y = f.beforeDirection, b = f.targetTransform, S = f.moveableClientRect, C = f.offsetMatrix, k = f.targetMatrix, M = f.allMatrix, E = f.width, D = f.height;
    if (!u && !d)
      return !1;
    var j = t.getRect();
    a.rect = j, a.transform = b, a.left = h, a.top = m;
    var R = function(Q) {
      var it = Qp(t.state, Q);
      a.fixedDirection = it.fixedDirection, a.fixedOffset = it.fixedOffset, a.fixedPosition = it.fixedPosition, X && X.setFixedPosition(Q);
    }, _ = function(Q) {
      var it = Wy(t.state, Q);
      a.fixedDirection = it.fixedDirection, a.fixedOffset = it.fixedOffset, a.fixedPosition = it.fixedPosition, X && X.setFixedDirection(Q);
    }, x = i, P = o;
    if (u || c || l) {
      var I = s || 0;
      a.beforeInfo = {
        origin: j.beforeOrigin,
        prevDeg: I,
        defaultDeg: I,
        prevSnapDeg: 0,
        startDist: 0
      }, a.afterInfo = O(O({}, a.beforeInfo), { origin: j.origin }), a.absoluteInfo = O(O({}, a.beforeInfo), { origin: j.origin, startValue: I });
    } else {
      var A = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
      if (A) {
        var B = A.getAttribute("data-direction") || "", q = Ux[B];
        if (q) {
          a.isControl = !0, a.isAroundControl = ue(A, mt("around-control")), a.controlDirection = q;
          var F = A.getAttribute("data-resolve");
          F && (a.resolveAble = F);
          var N = bb(f.rootMatrix, f.renderPoses, S);
          n = L(pe(N, q), 2), x = n[0], P = n[1];
        }
      }
      a.beforeInfo = { origin: j.beforeOrigin }, a.afterInfo = { origin: j.origin }, a.absoluteInfo = {
        origin: j.origin,
        startValue: j.rotation
      };
      var W = R;
      R = function(Q) {
        var it = f.is3d ? 4 : 3, ut = L(Bt(gp(k, it), Q), 2), Z = ut[0], dt = ut[1], ht = Ee(C, lr([Z, dt], it)), tt = Ee(M, lr([Q[0], Q[1]], it));
        W(Q);
        var ft = f.posDelta;
        a.beforeInfo.origin = bt(ht, ft), a.afterInfo.origin = bt(tt, ft), a.absoluteInfo.origin = bt(tt, ft), Xo(t, a.beforeInfo, x, P, S), Xo(t, a.afterInfo, x, P, S), Xo(t, a.absoluteInfo, x, P, S);
      }, _ = function(Q) {
        var it = pe([
          [0, 0],
          [E, 0],
          [0, D],
          [E, D]
        ], Q);
        R(it);
      };
    }
    a.startClientX = x, a.startClientY = P, a.direction = v, a.beforeDirection = y, a.startValue = 0, a.datas = {}, ao(t, e, "rotate");
    var V = !1, X = !1;
    if (a.isControl && a.resolveAble) {
      var J = a.resolveAble;
      J === "resizable" && (X = zs.dragControlStart(t, O(O({}, new Rr("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    X || (V = Te.dragStart(t, new Rr().dragStart([0, 0], e))), R(wb(t));
    var et = Rt(t, e, O(O({ set: function(Q) {
      a.startValue = Q * Math.PI / 180;
    }, setFixedDirection: _, setFixedPosition: R }, ro(t, e)), { dragStart: V, resizeStart: X })), at = pt(t, "onRotateStart", et);
    return a.isRotate = at !== !1, f.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? et : !1;
  },
  dragControl: function(t, e) {
    var n, r, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, c = e.parentFlag, u = e.isPinch, f = e.groupDelta, d = e.resolveMatrix, h = i.beforeDirection, m = i.beforeInfo, v = i.afterInfo, y = i.absoluteInfo, b = i.isRotate, S = i.startValue, C = i.rect, k = i.startClientX, M = i.startClientY;
    if (b) {
      eo(t, e, "rotate");
      var E = Jx(e), D = h * E, j = t.props.parentMoveable, R = 0, _, x, P = 0, I, A, B = 0, q, F, N = 180 / Math.PI * S, W = y.startValue, V = !1, X = k + o, J = M + s;
      if (!c && "parentDist" in e) {
        var et = e.parentDist;
        _ = et, I = et, q = et;
      } else u || c ? (_ = Mi(l, h, m), I = Mi(l, D, v), q = Mi(l, D, y)) : (_ = Vo(X, J, h, m), I = Vo(X, J, D, v), q = Vo(X, J, D, y), V = !0);
      if (x = N + _, A = N + I, F = W + q, pt(t, "onBeforeRotate", Rt(t, e, {
        beforeRotation: x,
        rotation: A,
        absoluteRotation: F,
        setRotation: function(Mt) {
          I = Mt - N, _ = I, q = I;
        }
      }, !0)), n = L(Ko(t, C, m, _, N, V), 3), R = n[0], _ = n[1], x = n[2], r = L(Ko(t, C, v, I, N, V), 3), P = r[0], I = r[1], A = r[2], a = L(Ko(t, C, y, q, W, V), 3), B = a[0], q = a[1], F = a[2], !(!B && !P && !R && !j && !d)) {
        var at = no(i, "rotate(".concat(A, "deg)"), "rotate(".concat(I, "deg)"));
        d && (i.fixedPosition = Nl(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var Q = cy(t, I, i), it = bt(Bt(f || [0, 0], Q), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = Q, i.requestValue = null;
        var ut = Np(t, at, it, u, e), Z = ut, dt = vn([X, J], y.startAbsoluteOrigin) - y.startDist, ht = void 0;
        if (i.resolveAble === "resizable") {
          var tt = zs.dragControl(t, O(O({}, Pa(e, t.state, [e.deltaX, e.deltaY], !!u, !1, "resizable")), { resolveMatrix: !0, parentDistance: dt }));
          tt && (ht = tt, Z = hh(Z, tt, e));
        }
        var ft = Rt(t, e, O(O({ delta: P, dist: I, rotate: A, rotation: A, beforeDist: _, beforeDelta: R, beforeRotate: x, beforeRotation: x, absoluteDist: q, absoluteDelta: B, absoluteRotate: F, absoluteRotation: F, isPinch: !!u, resize: ht }, ut), Z));
        return pt(t, "onRotate", ft), ft;
      }
    }
  },
  dragControlEnd: function(t, e) {
    var n = e.datas;
    if (n.isRotate) {
      n.isRotate = !1;
      var r = Le(t, e, {});
      return pt(t, "onRotateEnd", r), r;
    }
  },
  dragGroupControlCondition: Ls,
  dragGroupControlStart: function(t, e) {
    var n = e.datas, r = t.state, a = r.left, i = r.top, o = r.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(n.beforeDirection * t.rotation);
    var l = _n(t, this, "dragControlStart", e, function(f, d) {
      var h = f.state, m = h.left, v = h.top, y = h.beforeOrigin, b = Bt(bt([m, v], [a, i]), bt(y, o));
      return d.datas.startGroupClient = b, d.datas.groupClient = b, O(O({}, d), { parentRotate: 0 });
    }), c = O(O({}, s), { targets: t.props.targets, events: l }), u = pt(t, "onRotateGroupStart", c);
    return n.isRotate = u !== !1, n.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var n = e.datas;
    if (n.isRotate) {
      co(t, "onBeforeRotate", function(c) {
        pt(t, "onBeforeRotateGroup", Rt(t, e, O(O({}, c), { targets: t.props.targets }), !0));
      });
      var r = this.dragControl(t, e);
      if (r) {
        var a = n.beforeDirection, i = r.beforeDist, o = i / 180 * Math.PI, s = _n(t, this, "dragControl", e, function(c, u) {
          var f = u.datas.startGroupClient, d = L(u.datas.groupClient, 2), h = d[0], m = d[1], v = L(Ta(f, o * a), 2), y = v[0], b = v[1], S = [y - h, b - m];
          return u.datas.groupClient = [y, b], O(O({}, u), { parentRotate: i, groupDelta: S });
        });
        t.rotation = a * r.beforeRotation;
        var l = O({ targets: t.props.targets, events: s, set: function(c) {
          t.rotation = c;
        }, setGroupRotation: function(c) {
          t.rotation = c;
        } }, r);
        return pt(t, "onRotateGroup", l), l;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var n = e.isDrag, r = e.datas;
    if (r.isRotate) {
      this.dragControlEnd(t, e);
      var a = _n(t, this, "dragControlEnd", e), i = Le(t, e, {
        targets: t.props.targets,
        events: a
      });
      return pt(t, "onRotateGroupEnd", i), n;
    }
  },
  /**
       * @method Moveable.Rotatable#request
       * @param {object} [e] - the Resizable's request parameter
       * @param {number} [e.deltaRotate=0] -  delta number of rotation
       * @param {number} [e.rotate=0] - absolute number of moveable's rotation
       * @return {Moveable.Requester} Moveable Requester
       * @example
  
       * // Instantly Request (requestStart - request - requestEnd)
       * moveable.request("rotatable", { deltaRotate: 10 }, true);
       *
       * * moveable.request("rotatable", { rotate: 10 }, true);
       *
       * // requestStart
       * const requester = moveable.request("rotatable");
       *
       * // request
       * requester.request({ deltaRotate: 10 });
       * requester.request({ deltaRotate: 10 });
       * requester.request({ deltaRotate: 10 });
       *
       * requester.request({ rotate: 10 });
       * requester.request({ rotate: 20 });
       * requester.request({ rotate: 30 });
       *
       * // requestEnd
       * requester.requestEnd();
       */
  request: function(t) {
    var e = {}, n = 0, r = t.getRotation();
    return {
      isControl: !0,
      requestStart: function() {
        return { datas: e };
      },
      request: function(a) {
        return "deltaRotate" in a ? n += a.deltaRotate : "rotate" in a && (n = a.rotate - r), { datas: e, parentDist: n };
      },
      requestEnd: function() {
        return { datas: e, isDrag: !0 };
      }
    };
  }
};
function Xy(t, e) {
  var n, r = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, c = r === "horizontal", u = c ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (n = {}, n[c ? "width" : "height"] = "".concat(i), n.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(u, "(-50%) scale").concat(u, "(").concat(s, ")"), n)
  });
}
function Bl(t, e) {
  return Xy(O(O({}, t), { classNames: ot([
    mt("line", "guideline", t.direction)
  ], L(t.classNames), !1).filter(function(n) {
    return n;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(n) {
    return "".concat(Et(n, 0.1), "px");
  }) }), e);
}
function ed(t, e, n, r, a, i, o, s) {
  var l = t.props.zoom;
  return n.map(function(c, u) {
    var f = c.type, d = c.pos, h = [0, 0];
    return h[o] = r, h[o ? 0 : 1] = -a + d, Bl({
      key: "".concat(e, "TargetGuideline").concat(u),
      classNames: [mt("target", "bold", f)],
      posValue: h,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function nd(t, e, n, r, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, c = e === "horizontal" ? Hn : Xn, u = a[c.start], f = a[c.end];
  return n.filter(function(d) {
    var h = d.hide, m = d.elementRect;
    if (h)
      return !1;
    if (l && m) {
      var v = m.rect;
      if (v[c.start] <= u && f <= v[c.end])
        return !1;
    }
    return !0;
  }).map(function(d, h) {
    var m = d.pos, v = d.size, y = d.element, b = d.className, S = [
      -r[0] + m[0],
      -r[1] + m[1]
    ];
    return Bl({
      key: "".concat(e, "-default-guideline-").concat(h),
      classNames: y ? [mt("bold"), b] : [mt("normal"), b],
      direction: e,
      posValue: S,
      sizeValue: v,
      zoom: s
    }, i);
  });
}
function na(t, e, n, r, a, i, o, s) {
  var l, c = t.props, u = c.snapDigit, f = u === void 0 ? 0 : u, d = c.isDisplaySnapDigit, h = d === void 0 ? !0 : d, m = c.snapDistFormat, v = m === void 0 ? function(M, E) {
    return M;
  } : m, y = c.zoom, b = e === "horizontal" ? "X" : "Y", S = e === "vertical" ? "height" : "width", C = Math.abs(a), k = h ? parseFloat(C.toFixed(f)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(n, "-guideline-").concat(r), className: mt("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[S] = "".concat(C, "px"), l) },
    Bl({
      direction: e,
      classNames: [mt(n), o],
      size: "100%",
      posValue: [0, 0],
      sizeValue: C,
      zoom: y
    }, s),
    s.createElement("div", { className: mt("size-value", "gap"), style: {
      transform: "translate".concat(b, "(-50%) scale(").concat(y, ")")
    } }, k > 0 ? v(k, e) : "")
  );
}
function Vy(t, e, n, r) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? Hn : Xn, s = n[o.start], l = n[o.end];
  return gh(e, function(c) {
    return c.pos[a];
  }).map(function(c) {
    var u = [], f = [], d = [];
    return c.forEach(function(h) {
      var m, v, y = h.element, b = h.elementRect.rect;
      if (b[o.end] < s)
        u.push(h);
      else if (l < b[o.start])
        f.push(h);
      else if (b[o.start] <= s && l <= b[o.end] && r) {
        var S = h.pos, C = { element: y, rect: O(O({}, b), (m = {}, m[o.end] = b[o.start], m)) }, k = { element: y, rect: O(O({}, b), (v = {}, v[o.start] = b[o.end], v)) }, M = [0, 0], E = [0, 0];
        M[a] = S[a], M[i] = S[i], E[a] = S[a], E[i] = S[i] + h.size, u.push({
          type: t,
          pos: M,
          size: 0,
          elementRect: C,
          direction: "",
          elementDirection: "end"
        }), f.push({
          type: t,
          pos: E,
          size: 0,
          elementRect: k,
          direction: "",
          elementDirection: "start"
        });
      }
    }), u.sort(function(h, m) {
      return m.pos[i] - h.pos[i];
    }), f.sort(function(h, m) {
      return h.pos[i] - m.pos[i];
    }), {
      total: c,
      start: u,
      end: f,
      inner: d
    };
  });
}
function Ky(t, e, n, r, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(y) {
      return y.type === s;
    }), c = s === "vertical" ? 1 : 0, u = c ? 0 : 1, f = Vy(s, l, r, i), d = c ? Xn : Hn, h = c ? Hn : Xn, m = r[d.start], v = r[d.end];
    f.forEach(function(y) {
      var b = y.total, S = y.start, C = y.end, k = y.inner, M = n[u] + b[0].pos[u] - r[h.start], E = r;
      S.forEach(function(D) {
        var j = D.elementRect.rect, R = E[d.start] - j[d.end];
        if (R > 0) {
          var _ = [0, 0];
          _[c] = n[c] + E[d.start] - m - R, _[u] = M, o.push(na(t, s, "dashed", o.length, R, _, D.className, a));
        }
        E = j;
      }), E = r, C.forEach(function(D) {
        var j = D.elementRect.rect, R = j[d.start] - E[d.end];
        if (R > 0) {
          var _ = [0, 0];
          _[c] = n[c] + E[d.end] - m, _[u] = M, o.push(na(t, s, "dashed", o.length, R, _, D.className, a));
        }
        E = j;
      }), k.forEach(function(D) {
        var j = D.elementRect.rect, R = m - j[d.start], _ = j[d.end] - v, x = [0, 0], P = [0, 0];
        x[c] = n[c] - R, x[u] = M, P[c] = n[c] + v - m, P[u] = M, o.push(na(t, s, "dashed", o.length, R, x, D.className, a)), o.push(na(t, s, "dashed", o.length, _, P, D.className, a));
      });
    });
  }), o;
}
function qy(t, e, n, r, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(y) {
      return y.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, c = l ? 0 : 1, u = l ? Xn : Hn, f = l ? Hn : Xn, d = r[u.start], h = r[u.end], m = r[f.start], v = r[f.end];
    s.forEach(function(y) {
      var b = y.gap, S = y.gapRects, C = Math.max.apply(Math, ot([m], L(S.map(function(E) {
        var D = E.rect;
        return D[f.start];
      })), !1)), k = Math.min.apply(Math, ot([v], L(S.map(function(E) {
        var D = E.rect;
        return D[f.end];
      })), !1)), M = (C + k) / 2;
      C === k || M === (m + v) / 2 || S.forEach(function(E) {
        var D = E.rect, j = E.className, R = [n[0], n[1]];
        if (D[u.end] < d)
          R[l] += D[u.end] - d;
        else if (h < D[u.start])
          R[l] += D[u.start] - d - b;
        else
          return;
        R[c] += M - m, i.push(na(t, l ? "vertical" : "horizontal", "gap", i.length, b, R, j, a));
      });
    });
  }), i;
}
function Fs(t) {
  var e, n, r = t.state, a = r.containerClientRect, i = r.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, c = a.clientHeight, u = a.clientWidth, f = a.clientLeft, d = a.clientTop, h = t.props, m = h.snapGap, v = m === void 0 ? !0 : m, y = h.verticalGuidelines, b = h.horizontalGuidelines, S = h.snapThreshold, C = S === void 0 ? 5 : S, k = h.maxSnapElementGuidelineDistance, M = k === void 0 ? 1 / 0 : k, E = h.isDisplayGridGuidelines, D = Ve(Ue(t.state)), j = D.top, R = D.left, _ = D.bottom, x = D.right, P = { top: j, left: R, bottom: _, right: x, center: (R + x) / 2, middle: (j + _) / 2 }, I = Qy(t), A = ot([], L(I), !1), B = ((n = (e = r.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && n !== void 0 ? n : [1, 1]).map(function(W) {
    return W * C;
  });
  v && A.push.apply(A, ot([], L(Uy(t, P, B)), !1));
  var q = O({}, r.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (A.push.apply(A, ot([], L(Jy(t, o ? l : u, o ? s : c, f, d, q, E)), !1)), i) {
    var F = a.left, N = a.top;
    q.left += F, q.top += N, q.right += F, q.bottom += N;
  }
  return A.push.apply(A, ot([], L(nh(b || !1, y || !1, o ? l : u, o ? s : c, f, d, q)), !1)), A = A.filter(function(W) {
    var V = W.element, X = W.elementRect, J = W.type;
    if (!V || !X)
      return !0;
    var et = X.rect;
    return eh(P, et, J, M);
  }), A;
}
function Uy(t, e, n) {
  var r = t.props, a = r.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = r.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, c = [];
  return [
    ["vertical", Hn, Xn],
    ["horizontal", Xn, Hn]
  ].forEach(function(u) {
    var f = L(u, 3), d = f[0], h = f[1], m = f[2], v = e[h.start], y = e[h.end], b = e[h.center], S = e[m.start], C = e[m.end], k = {
      left: n[0],
      top: n[1]
    };
    function M(j) {
      var R = j.rect, _ = k[h.start];
      return R[h.end] < v + _ ? v - R[h.end] : y - _ < R[h.start] ? R[h.start] - y : -1;
    }
    var E = l.filter(function(j) {
      var R = j.rect;
      return R[m.start] > C || R[m.end] < S ? !1 : M(j) > 0;
    }).sort(function(j, R) {
      return M(j) - M(R);
    }), D = [];
    E.forEach(function(j) {
      E.forEach(function(R) {
        if (j !== R) {
          var _ = j.rect, x = R.rect, P = _[m.start], I = _[m.end], A = x[m.start], B = x[m.end];
          P > B || A > I || D.push([j, R]);
        }
      });
    }), D.forEach(function(j) {
      var R = L(j, 2), _ = R[0], x = R[1], P = _.rect, I = x.rect, A = P[h.start], B = P[h.end], q = I[h.start], F = I[h.end], N = k[h.start], W = 0, V = 0, X = !1, J = !1, et = !1;
      if (B <= v && y <= q) {
        if (J = !0, W = (q - B - (y - v)) / 2, V = B + W + (y - v) / 2, nt(V - b) > N)
          return;
      } else if (B < q && F < v + N) {
        if (X = !0, W = q - B, V = F + W, nt(V - v) > N)
          return;
      } else if (B < q && y - N < A) {
        if (et = !0, W = q - B, V = A - W, nt(V - y) > N)
          return;
      } else
        return;
      W && eh(e, I, d, i) && (W > s || c.push({
        type: d,
        pos: d === "vertical" ? [V, 0] : [0, V],
        element: x.element,
        size: 0,
        className: x.className,
        isStart: X,
        isCenter: J,
        isEnd: et,
        gap: W,
        hide: !0,
        gapRects: [_, x],
        direction: "",
        elementDirection: ""
      }));
    });
  }), c;
}
function Zy(t, e, n, r) {
  var a, i, o = t.props, s = t.state, l = o.snapGridAll, c = o.snapGridWidth, u = c === void 0 ? 0 : c, f = o.snapGridHeight, d = f === void 0 ? 0 : f, h = s.snapRenderInfo, m = h && (((a = h.direction) === null || a === void 0 ? void 0 : a[0]) || ((i = h.direction) === null || i === void 0 ? void 0 : i[1])), v = t.moveables;
  if (l && v && m && (u || d)) {
    if (s.snapThresholdInfo)
      return;
    s.snapThresholdInfo = {
      multiples: [1, 1],
      offset: [0, 0]
    };
    var y = t.getRect(), b = y.children, S = h.direction;
    if (b) {
      var C = S.map(function(M, E) {
        var D = E === 0 ? {
          snapSize: u,
          posName: "left",
          sizeName: "width",
          clientOffset: r.left - e
        } : {
          snapSize: d,
          posName: "top",
          sizeName: "height",
          clientOffset: r.top - n
        }, j = D.snapSize, R = D.posName, _ = D.sizeName, x = D.clientOffset;
        if (!j)
          return {
            dir: M,
            multiple: 1,
            snapSize: j,
            snapOffset: 0
          };
        var P = y[_], I = y[R], A = U0(b.map(function(X) {
          return [
            X[R] - I,
            X[_],
            P - X[_] - X[R] + I
          ];
        })).filter(function(X) {
          return X;
        }).sort(function(X, J) {
          return X - J;
        }), B = A[0], q = A.map(function(X) {
          return Et(X / B, 0.1) * j;
        }), F = 1, N = Et(P / B, 0.1);
        for (F = 1; F <= 10 && !q.every(function(X) {
          return X * F % 1 === 0;
        }); ++F)
          ;
        var W = (-M + 1) / 2, V = Ai(I - x, I - x + P, W, 1 - W);
        return {
          multiple: N * F,
          dir: M,
          snapSize: j,
          snapOffset: Math.round(V / j)
        };
      }), k = C.map(function(M) {
        return M.multiple || 1;
      });
      s.snapThresholdInfo.multiples = k, s.snapThresholdInfo.offset = C.map(function(M) {
        return M.snapOffset;
      }), C.forEach(function(M, E) {
        M.snapSize;
      });
    }
  } else
    s.snapThresholdInfo = null;
}
function Jy(t, e, n, r, a, i, o) {
  r === void 0 && (r = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, c = s.snapGridWidth, u = c === void 0 ? 0 : c, f = s.snapGridHeight, d = f === void 0 ? 0 : f, h = [], m = i.left, v = i.top, y = [0, 0];
  Zy(t, r, a, i);
  var b = l.snapThresholdInfo, S = u, C = d;
  if (b && (u *= b.multiples[0] || 1, d *= b.multiples[1] || 1, y = b.offset), d) {
    for (var k = function(E) {
      h.push({
        type: "horizontal",
        pos: [
          m,
          Et(y[1] * C + E - a + v, 0.1)
        ],
        className: mt("grid-guideline"),
        size: e,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, M = 0; M <= n * 2; M += d)
      k(M);
    for (var M = -d; M >= -n; M -= d)
      k(M);
  }
  if (u) {
    for (var k = function(D) {
      h.push({
        type: "vertical",
        pos: [
          Et(y[0] * S + D - r + m, 0.1),
          v
        ],
        className: mt("grid-guideline"),
        size: n,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, M = 0; M <= e * 2; M += u)
      k(M);
    for (var M = -u; M >= -e; M -= u)
      k(M);
  }
  return h;
}
function eh(t, e, n, r) {
  return n === "horizontal" ? nt(t.right - e.left) <= r || nt(t.left - e.right) <= r || t.left <= e.right && e.left <= t.right : n === "vertical" ? nt(t.bottom - e.top) <= r || nt(t.top - e.bottom) <= r || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function Qy(t) {
  var e = t.state, n = t.props.elementGuidelines, r = n === void 0 ? [] : n;
  if (!r.length)
    return e.elementRects = [], [];
  var a = (e.elementRects || []).filter(function(d) {
    return !d.refresh;
  }), i = r.map(function(d) {
    return Ae(d) && "element" in d ? O(O({}, d), { element: mn(d.element, !0) }) : {
      element: mn(d, !0)
    };
  }).filter(function(d) {
    return d.element;
  }), o = br(a.map(function(d) {
    return d.element;
  }), i.map(function(d) {
    return d.element;
  })), s = o.maintained, l = o.added, c = [];
  s.forEach(function(d) {
    var h = L(d, 2), m = h[0], v = h[1];
    c[v] = a[m];
  }), tb(t, l.map(function(d) {
    return i[d];
  })).map(function(d, h) {
    c[l[h]] = d;
  }), e.elementRects = c;
  var u = Al(t.props.elementSnapDirections), f = [];
  return c.forEach(function(d) {
    var h = d.element, m = d.top, v = m === void 0 ? u.top : m, y = d.left, b = y === void 0 ? u.left : y, S = d.right, C = S === void 0 ? u.right : S, k = d.bottom, M = k === void 0 ? u.bottom : k, E = d.center, D = E === void 0 ? u.center : E, j = d.middle, R = j === void 0 ? u.middle : j, _ = d.className, x = d.rect, P = zl({
      top: v,
      right: C,
      left: b,
      bottom: M,
      center: D,
      middle: R
    }, x), I = P.horizontal, A = P.vertical, B = P.horizontalNames, q = P.verticalNames, F = x.top, N = x.left, W = x.right - N, V = x.bottom - F, X = [W, V];
    A.forEach(function(J, et) {
      f.push({
        type: "vertical",
        element: h,
        pos: [
          Et(J, 0.1),
          F
        ],
        size: V,
        sizes: X,
        className: _,
        elementRect: d,
        elementDirection: Vu[q[et]] || q[et],
        direction: ""
      });
    }), I.forEach(function(J, et) {
      f.push({
        type: "horizontal",
        element: h,
        pos: [
          N,
          Et(J, 0.1)
        ],
        size: W,
        sizes: X,
        className: _,
        elementRect: d,
        elementDirection: Vu[B[et]] || B[et],
        direction: ""
      });
    });
  }), f;
}
function rd(t, e) {
  return t ? t.map(function(n) {
    var r = Ae(n) ? n : { pos: n }, a = r.pos;
    return wa(a) ? r : O(O({}, r), { pos: Yt(a, e) });
  }) : [];
}
function nh(t, e, n, r, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, c = o.top, u = o.bottom, f = o.right, d = n + f - l, h = r + u - c;
  return rd(t, h).forEach(function(m) {
    s.push({
      type: "horizontal",
      pos: [
        l,
        Et(m.pos - i + c, 0.1)
      ],
      size: d,
      className: m.className,
      direction: ""
    });
  }), rd(e, d).forEach(function(m) {
    s.push({
      type: "vertical",
      pos: [
        Et(m.pos - a + l, 0.1),
        c
      ],
      size: h,
      className: m.className,
      direction: ""
    });
  }), s;
}
function tb(t, e) {
  if (!e.length)
    return [];
  var n = t.props.groupable, r = t.state, a = r.containerClientRect, i = r.rootMatrix, o = r.is3d, s = r.offsetDelta, l = o ? 4 : 3, c = L(ky(i, a, l), 2), u = c[0], f = c[1], d = n ? 0 : s[0], h = n ? 0 : s[1];
  return e.map(function(m) {
    var v = m.element.getBoundingClientRect(), y = v.left - u - d, b = v.top - f - h, S = b + v.height, C = y + v.width, k = L(Or(i, [y, b], l), 2), M = k[0], E = k[1], D = L(Or(i, [C, S], l), 2), j = D[0], R = D[1];
    return O(O({}, m), { rect: {
      left: M,
      right: j,
      top: E,
      bottom: R,
      center: (M + j) / 2,
      middle: (E + R) / 2
    } });
  });
}
function fi(t) {
  var e = t.state, n = e.container, r = t.props.snapContainer || n;
  if (e.snapContainer === r && e.guidelines && e.guidelines.length)
    return !1;
  var a = e.containerClientRect, i = {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  };
  if (n !== r) {
    var o = mn(r, !0);
    if (o) {
      var s = fa(o), l = cd(e, [
        s.left - a.left,
        s.top - a.top
      ]), c = cd(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = Et(l[0], 1e-5), i.top = Et(l[1], 1e-5), i.right = Et(c[0], 1e-5), i.bottom = Et(c[1], 1e-5);
    }
  }
  return e.snapContainer = r, e.snapOffset = i, e.guidelines = Fs(t), e.enableSnap = !0, !0;
}
function rh(t, e, n, r, a, i) {
  var o = pr(t, e, n, i ? 4 : 3), s = pe(o, r);
  return $l(o, bt(a, s));
}
function ad(t) {
  return t ? t / nt(t) : 0;
}
function eb(t, e, n, r, a, i) {
  var o = i.fixedDirection, s = Ty(n, o, r), l = Fl(t, e, n, r), c = ot(ot([], L(By(t, e, s, r, a, i)), !1), L(Zp(t, l, i)), !1), u = Wi(c, 0), f = Wi(c, 1);
  return {
    width: {
      isBound: u.isBound,
      offset: u.offset[0]
    },
    height: {
      isBound: f.isBound,
      offset: f.offset[1]
    }
  };
}
function nb(t, e, n, r, a, i, o, s, l) {
  var c = pe(e, o), u = so(t, s, {
    vertical: [c[0]],
    horizontal: [c[1]]
  }), f = u.horizontal.offset, d = u.vertical.offset;
  if (Et(d, Rs) || Et(f, Rs)) {
    var h = L(xn({
      datas: l,
      distX: -d,
      distY: -f
    }), 2), m = h[0], v = h[1], y = Math.min(a || 1 / 0, n + o[0] * m), b = Math.min(i || 1 / 0, r + o[1] * v);
    return [y - n, b - r];
  }
  return [0, 0];
}
function ah(t, e, n, r, a, i, o, s) {
  for (var l = Ue(t.state), c = t.props.keepRatio, u = 0, f = 0, d = 0; d < 2; ++d) {
    var h = e(u, f), m = eb(t, h, a, c, o, s), v = m.width, y = m.height, b = v.isBound, S = y.isBound, C = v.offset, k = y.offset;
    if (d === 1 && (b || (C = 0), S || (k = 0)), d === 0 && o && !b && !S)
      return [0, 0];
    if (c) {
      var M = nt(C) * (n ? 1 / n : 1), E = nt(k) * (r ? 1 / r : 1), D = b && S ? M < E : S || !b && M < E;
      D ? C = n * k / r : k = r * C / n;
    }
    u += C, f += k;
  }
  if (!c && a[0] && a[1]) {
    var j = $y(t, l, a, i, s), R = j.maxWidth, _ = j.maxHeight, x = L(nb(t, e(u, f).map(function(A) {
      return A.map(function(B) {
        return Et(B, Rs);
      });
    }), n + u, r + f, R, _, a, o, s), 2), C = x[0], k = x[1];
    u += C, f += k;
  }
  return [u, f];
}
function ua(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function rb(t, e) {
  e = ua(e);
  var n = Math.floor(t / 360), r = n * 360 + 360 - e, a = n * 360 + e;
  return nt(t - r) < nt(t - a) ? r : a;
}
function qo(t, e) {
  t = ua(t), e = ua(e);
  var n = ua(t - e);
  return Math.min(n, 360 - n);
}
function ab(t, e, n, r) {
  var a, i = t.props, o = (a = i[Wp]) !== null && a !== void 0 ? a : 5, s = i[Yp];
  if (Wr(t, "rotatable")) {
    var l = e.pos1, c = e.pos2, u = e.pos3, f = e.pos4, d = e.origin, h = n * Math.PI / 180, m = [l, c, u, f].map(function(k) {
      return bt(k, d);
    }), v = m.map(function(k) {
      return Ta(k, h);
    }), y = ot(ot([], L(by(t, m, v, d, n)), !1), L(Ny(t, m, v, d, n)), !1);
    y.sort(function(k, M) {
      return nt(k - n) - nt(M - n);
    });
    var b = y.length > 0;
    if (b)
      return {
        isSnap: b,
        dist: b ? y[0] : n
      };
  }
  if (s != null && s.length && o) {
    var S = s.slice().sort(function(k, M) {
      return qo(k, r) - qo(M, r);
    }), C = S[0];
    if (qo(C, r) <= o)
      return {
        isSnap: !0,
        dist: n + rb(r, C) - r
      };
  }
  return {
    isSnap: !1,
    dist: n
  };
}
function ib(t, e, n, r, a, i, o) {
  if (!Wr(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, c = t.state, u = c.allMatrix, f = c.is3d;
  return ah(t, function(d, h) {
    return rh(l || u, e + d, n + h, s, a, f);
  }, e, n, r, a, i, o);
}
function ob(t, e, n, r, a) {
  if (!Wr(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, c = a.is3d, u = ah(t, function(f, d) {
    return rh(iy(a, Bt(e, [f / i, d / o])), i, o, l, s, c);
  }, i, o, n, s, r, a);
  return [u[0] / i, u[1] / o];
}
function sb(t, e) {
  e.absolutePoses = Ue(t.state);
}
function id(t) {
  var e = [];
  return t.forEach(function(n) {
    n.guidelineInfos.forEach(function(r) {
      var a = r.guideline;
      ze(e, function(i) {
        return i.guideline === a;
      }) || (a.direction = "", e.push({ guideline: a, posInfo: n }));
    });
  }), e.map(function(n) {
    var r = n.guideline, a = n.posInfo;
    return O(O({}, r), { direction: a.direction });
  });
}
function od(t, e, n, r, a, i) {
  var o = Ol(io(t, i), e, n), s = o.vertical, l = o.horizontal, c = Cr();
  s.forEach(function(m) {
    m.isBound && (m.direction === "start" && (c.left = !0), m.direction === "end" && (c.right = !0), r.push({
      type: "bounds",
      pos: m.pos
    }));
  }), l.forEach(function(m) {
    m.isBound && (m.direction === "start" && (c.top = !0), m.direction === "end" && (c.bottom = !0), a.push({
      type: "bounds",
      pos: m.pos
    }));
  });
  var u = Oy(t), f = u.boundMap, d = u.vertical, h = u.horizontal;
  return d.forEach(function(m) {
    jn(r, function(v) {
      var y = v.type, b = v.pos;
      return y === "bounds" && b === m;
    }) >= 0 || r.push({
      type: "bounds",
      pos: m
    });
  }), h.forEach(function(m) {
    jn(a, function(v) {
      var y = v.type, b = v.pos;
      return y === "bounds" && b === m;
    }) >= 0 || a.push({
      type: "bounds",
      pos: m
    });
  }), {
    boundMap: c,
    innerBoundMap: f
  };
}
var lb = Hl("", ["resizable", "scalable"]), cb = {
  name: "snappable",
  dragRelation: "strong",
  props: [
    "snappable",
    "snapContainer",
    "snapDirections",
    "elementSnapDirections",
    "snapGap",
    "snapGridWidth",
    "snapGridHeight",
    "isDisplaySnapDigit",
    "isDisplayInnerSnapDigit",
    "isDisplayGridGuidelines",
    "snapDigit",
    "snapThreshold",
    "snapRenderThreshold",
    "snapGridAll",
    Wp,
    Yp,
    Hp,
    Xp,
    "horizontalGuidelines",
    "verticalGuidelines",
    "elementGuidelines",
    "bounds",
    "innerBounds",
    "snapDistFormat",
    "maxSnapElementGuidelineDistance",
    "maxSnapElementGapDistance"
  ],
  events: ["snap", "bound"],
  css: [
    `:host {
--bounds-color: #d66;
}
.guideline {
pointer-events: none;
z-index: 2;
}
.guideline.bounds {
background: #d66;
background: var(--bounds-color);
}
.guideline-group {
position: absolute;
top: 0;
left: 0;
}
.guideline-group .size-value {
position: absolute;
color: #f55;
font-size: 12px;
font-size: calc(12px * var(--zoom));
font-weight: bold;
}
.guideline-group.horizontal .size-value {
transform-origin: 50% 100%;
transform: translateX(-50%);
left: 50%;
bottom: 5px;
bottom: calc(2px + 3px * var(--zoom));
}
.guideline-group.vertical .size-value {
transform-origin: 0% 50%;
top: 50%;
transform: translateY(-50%);
left: 5px;
left: calc(2px + 3px * var(--zoom));
}
.guideline.gap {
background: #f55;
}
.size-value.gap {
color: #f55;
}
`
  ],
  render: function(t, e) {
    var n = t.state, r = n.top, a = n.left, i = n.pos1, o = n.pos2, s = n.pos3, l = n.pos4, c = n.snapRenderInfo, u = t.props.snapRenderThreshold, f = u === void 0 ? 1 : u;
    if (!c || !c.render || !Wr(t, ""))
      return Er(t, "boundMap", Cr(), function(at) {
        return JSON.stringify(at);
      }), Er(t, "innerBoundMap", Cr(), function(at) {
        return JSON.stringify(at);
      }), [];
    n.guidelines = Fs(t);
    var d = Math.min(i[0], o[0], s[0], l[0]), h = Math.min(i[1], o[1], s[1], l[1]), m = c.externalPoses || [], v = Ue(t.state), y = [], b = [], S = [], C = [], k = [], M = Ve(v), E = M.width, D = M.height, j = M.top, R = M.left, _ = M.bottom, x = M.right, P = { left: R, right: x, top: j, bottom: _, center: (R + x) / 2, middle: (j + _) / 2 }, I = m.length > 0, A = I ? Ve(m) : {};
    if (!c.request) {
      if (c.direction && k.push(Dy(t, v, c.direction, f, f)), c.snap) {
        var B = Ve(v);
        c.center && (B.middle = (B.top + B.bottom) / 2, B.center = (B.left + B.right) / 2), k.push(Ku(t, B, f, f));
      }
      I && (c.center && (A.middle = (A.top + A.bottom) / 2, A.center = (A.left + A.right) / 2), k.push(Ku(t, A, f, f))), k.forEach(function(at) {
        var Q = at.vertical.posInfos, it = at.horizontal.posInfos;
        y.push.apply(y, ot([], L(Q.filter(function(ut) {
          var Z = ut.guidelineInfos;
          return Z.some(function(dt) {
            var ht = dt.guideline;
            return !ht.hide;
          });
        }).map(function(ut) {
          return {
            type: "snap",
            pos: ut.pos
          };
        })), !1)), b.push.apply(b, ot([], L(it.filter(function(ut) {
          var Z = ut.guidelineInfos;
          return Z.some(function(dt) {
            var ht = dt.guideline;
            return !ht.hide;
          });
        }).map(function(ut) {
          return {
            type: "snap",
            pos: ut.pos
          };
        })), !1)), S.push.apply(S, ot([], L(id(Q)), !1)), C.push.apply(C, ot([], L(id(it)), !1));
      });
    }
    var q = od(t, [R, x], [j, _], y, b), F = q.boundMap, N = q.innerBoundMap;
    I && od(t, [A.left, A.right], [A.top, A.bottom], y, b, c.externalBounds);
    var W = ot(ot([], L(S), !1), L(C), !1), V = W.filter(function(at) {
      return at.element && !at.gapRects;
    }), X = W.filter(function(at) {
      return at.gapRects;
    }).sort(function(at, Q) {
      return at.gap - Q.gap;
    });
    pt(t, "onSnap", {
      guidelines: W.filter(function(at) {
        var Q = at.element;
        return !Q;
      }),
      elements: V,
      gaps: X
    }, !0);
    var J = Er(t, "boundMap", F, function(at) {
      return JSON.stringify(at);
    }, Cr()), et = Er(t, "innerBoundMap", N, function(at) {
      return JSON.stringify(at);
    }, Cr());
    return (F === J || N === et) && pt(t, "onBound", {
      bounds: F,
      innerBounds: N
    }, !0), ot(ot(ot(ot(ot(ot([], L(Ky(t, V, [d, h], P, e)), !1), L(qy(t, X, [d, h], P, e)), !1), L(nd(t, "horizontal", C, [a, r], P, e)), !1), L(nd(t, "vertical", S, [a, r], P, e)), !1), L(ed(t, "horizontal", b, d, r, E, 0, e)), !1), L(ed(t, "vertical", y, h, a, D, 1, e)), !1);
  },
  dragStart: function(t, e) {
    t.state.snapRenderInfo = {
      request: e.isRequest,
      snap: !0,
      center: !0
    }, fi(t);
  },
  drag: function(t) {
    var e = t.state;
    fi(t) || (e.guidelines = Fs(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (lb(t, e) || Ls(t, e))
      return !0;
    if (!e.isRequest && e.inputEvent)
      return ue(e.inputEvent.target, mt("snap-control"));
  },
  dragControlStart: function(t) {
    t.state.snapRenderInfo = null, fi(t);
  },
  dragControl: function(t) {
    this.drag(t);
  },
  dragControlEnd: function(t) {
    this.unset(t);
  },
  dragGroupStart: function(t, e) {
    this.dragStart(t, e);
  },
  dragGroup: function(t) {
    this.drag(t);
  },
  dragGroupEnd: function(t) {
    this.unset(t);
  },
  dragGroupControlStart: function(t) {
    t.state.snapRenderInfo = null, fi(t);
  },
  dragGroupControl: function(t) {
    this.drag(t);
  },
  dragGroupControlEnd: function(t) {
    this.unset(t);
  },
  unset: function(t) {
    var e = t.state;
    e.enableSnap = !1, e.guidelines = [], e.snapRenderInfo = null, e.elementRects = [];
  }
};
function ub(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function mt() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return P0.apply(void 0, ot([Il], L(t), !1));
}
function ih(t) {
  t();
}
function db(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : Ae(t) ? t : jr(t);
}
function da(t, e, n) {
  return Li(e, cr(n, e), t, cr(n.map(function(r) {
    return -r;
  }), e));
}
function fb(t, e, n) {
  if (e === "%") {
    var r = Gl(t.ownerSVGElement);
    return r[n ? "width" : "height"] / 100;
  }
  return 1;
}
function pb(t) {
  var e = hb(Wl(t, ":before"));
  return e.map(function(n, r) {
    var a = sr(n), i = a.value, o = a.unit;
    return i * fb(t, o, r === 0);
  });
}
function Hi(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function hb(t) {
  return Hi(t.transformOrigin);
}
function oh(t) {
  var e = Ne(t), n = e("transform");
  if (n && n !== "none")
    return n;
  if ("transform" in t) {
    var r = t.transform, a = r.baseVal;
    if (!a)
      return "";
    var i = a.length;
    if (!i)
      return "";
    for (var o = [], s = function(c) {
      var u = a[c].matrix;
      o.push("matrix(".concat(["a", "b", "c", "d", "e", "f"].map(function(f) {
        return u[f];
      }).join(", "), ")"));
    }, l = 0; l < i; ++l)
      s(l);
    return o.join(" ");
  }
  return "";
}
function Ea(t, e, n, r, a) {
  var i, o, s = kl(t) || Kn(t), l = !1, c, u;
  if (!t || n)
    c = t;
  else {
    var f = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, d = t.parentElement;
    f ? (l = !0, u = d, c = f) : c = d;
  }
  for (var h = !1, m = t === e || c === e, v = "relative", y = 1, b = parseFloat(a == null ? void 0 : a("zoom")) || 1, S = a == null ? void 0 : a("position"); c && c !== s; ) {
    e === c && (m = !0);
    var C = Ne(c), k = c.tagName.toLowerCase(), M = oh(c), E = C("willChange"), D = parseFloat(C("zoom")) || 1;
    if (v = C("position"), r && D !== 1) {
      y = D;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !n && r && b !== 1 && S && S !== "absolute" || k === "svg" || k === "foreignobject" || v !== "static" || M && M !== "none" || E === "transform"
    )
      break;
    var j = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, R = c.parentNode;
    j && (l = !0, u = R);
    var _ = R;
    if (_ && _.nodeType === 11) {
      c = _.host, h = !0, v = Ne(c)("position");
      break;
    }
    c = _, v = "relative";
  }
  return {
    offsetZoom: y,
    hasSlot: l,
    parentSlotElement: u,
    isCustomElement: h,
    isStatic: v === "static",
    isEnd: m || !c || c === s,
    offsetParent: c || s
  };
}
function gb(t, e) {
  var n, r = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = Ne(t), s = yl(a), l = !s, c, u;
  return !l && (r !== "svg" || t.ownerSVGElement) ? (c = Mp ? pb(t) : Hi(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), u = c.slice(), l = !0, r === "svg" ? (a = 0, i = 0) : (n = L(xb(t, c, t === e && e.tagName.toLowerCase() === "g"), 4), a = n[0], i = n[1], c[0] = n[2], c[1] = n[3])) : (c = Hi(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), u = c.slice()), {
    tagName: r,
    isSVG: s,
    hasOffset: l,
    offset: [a || 0, i || 0],
    origin: c,
    targetOrigin: u
  };
}
function sh(t, e) {
  var n = Ne(t), r = Ne(Kn(t)), a = r("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(r("marginLeft"), 10), o = parseInt(r("marginTop"), 10);
  return n("position") === "absolute" && ((n("top") !== "auto" || n("bottom") !== "auto") && (o = 0), (n("left") !== "auto" || n("right") !== "auto") && (i = 0)), [i, o];
}
function Bs(t) {
  t.forEach(function(e) {
    var n = e.matrix;
    n && (e.matrix = dn(n, 3, 4));
  });
}
function vb(t) {
  for (var e = t.parentElement, n = !1, r = Kn(t); e; ) {
    var a = Wl(e).transform;
    if (a && a !== "none") {
      n = !0;
      break;
    }
    if (e === r)
      break;
    e = e.parentElement;
  }
  return {
    fixedContainer: e || r,
    hasTransform: n
  };
}
function lo(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(vp(t, !e).join(","), ")");
}
function Gl(t) {
  var e = t.clientWidth, n = t.clientHeight;
  if (!t)
    return { x: 0, y: 0, width: 0, height: 0, clientWidth: e, clientHeight: n };
  var r = t.viewBox, a = r && r.baseVal || { x: 0, y: 0, width: 0, height: 0 };
  return {
    x: a.x,
    y: a.y,
    width: a.width || e,
    height: a.height || n,
    clientWidth: e,
    clientHeight: n
  };
}
function mb(t, e) {
  var n, r = Gl(t), a = r.width, i = r.height, o = r.clientWidth, s = r.clientHeight, l = o / a, c = s / i, u = t.preserveAspectRatio.baseVal, f = u.align, d = u.meetOrSlice, h = [0, 0], m = [l, c], v = [0, 0];
  if (f !== 1) {
    var y = (f - 2) % 3, b = Math.floor((f - 2) / 3);
    h[0] = a * y / 2, h[1] = i * b / 2;
    var S = d === 2 ? Math.max(c, l) : Math.min(l, c);
    m[0] = S, m[1] = S, v[0] = (o - a) / 2 * y, v[1] = (s - i) / 2 * b;
  }
  var C = El(m, e);
  return n = L(v, 2), C[e * (e - 1)] = n[0], C[e * (e - 1) + 1] = n[1], da(C, e, h);
}
function xb(t, e, n) {
  var r = t.tagName.toLowerCase();
  if (!t.getBBox || !n && r === "g")
    return [0, 0, 0, 0];
  var a = Ne(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = Gl(t.ownerSVGElement), l = o.x, c = o.y;
  r === "foreignobject" && !l && !c && (l = parseFloat(t.getAttribute("x")) || 0, c = parseFloat(t.getAttribute("y")) || 0);
  var u = l - s.x, f = c - s.y, d = i ? e[0] : e[0] - u, h = i ? e[1] : e[1] - f;
  return [u, f, d, h];
}
function ee(t, e, n) {
  return Ee(t, lr(e, n), n);
}
function pr(t, e, n, r) {
  return [[0, 0], [e, 0], [0, n], [e, n]].map(function(a) {
    return ee(t, a, r);
  });
}
function Ve(t) {
  var e = t.map(function(c) {
    return c[0];
  }), n = t.map(function(c) {
    return c[1];
  }), r = Math.min.apply(Math, ot([], L(e), !1)), a = Math.min.apply(Math, ot([], L(n), !1)), i = Math.max.apply(Math, ot([], L(e), !1)), o = Math.max.apply(Math, ot([], L(n), !1)), s = i - r, l = o - a;
  return {
    left: r,
    top: a,
    right: i,
    bottom: o,
    width: s,
    height: l
  };
}
function sd(t, e, n, r) {
  var a = pr(t, e, n, r);
  return Ve(a);
}
function yb(t, e, n, r, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, c = ch(o), u = c.offsetWidth, f = c.offsetHeight, d = n.getBoundingClientRect(), h = [0, 0];
  n === Kn(n) && (h = sh(o, !0));
  for (var m = o.getBoundingClientRect(), v = m.left - d.left + n.scrollLeft - (n.clientLeft || 0) + h[0], y = m.top - d.top + n.scrollTop - (n.clientTop || 0) + h[1], b = m.width, S = m.height, C = Li(r, a, l), k = sd(C, u, f, r), M = k.left, E = k.top, D = k.width, j = k.height, R = ee(C, s, r), _ = bt(R, [M, E]), x = [
    v + _[0] * b / D,
    y + _[1] * S / j
  ], P = [0, 0], I = 0; ++I < 10; ) {
    var A = un(a, r);
    i = L(bt(ee(A, x, r), ee(A, R, r)), 2), P[0] = i[0], P[1] = i[1];
    var B = Li(r, a, cr(P, r), l), q = sd(B, u, f, r), F = q.left, N = q.top, W = F - v, V = N - y;
    if (nt(W) < 2 && nt(V) < 2)
      break;
    x[0] -= W, x[1] -= V;
  }
  return P.map(function(X) {
    return Math.round(X);
  });
}
function bb(t, e, n) {
  var r = t.length === 16, a = r ? 4 : 3, i = e.map(function(l) {
    return ee(t, l, a);
  }), o = n.left, s = n.top;
  return i.map(function(l) {
    return [l[0] + o, l[1] + s];
  });
}
function qe(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
}
function lh(t, e) {
  return qe([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function ra(t, e, n, r) {
  n === void 0 && (n = 1), r === void 0 && (r = ae(t, e));
  var a = lh(t, e);
  return {
    transform: "translateY(-50%) translate(".concat(t[0], "px, ").concat(t[1], "px) rotate(").concat(r, "rad) scaleY(").concat(n, ")"),
    width: "".concat(a, "px")
  };
}
function Xi(t, e) {
  for (var n = [], r = 2; r < arguments.length; r++)
    n[r - 2] = arguments[r];
  var a = n.length, i = n.reduce(function(s, l) {
    return s + l[0];
  }, 0) / a, o = n.reduce(function(s, l) {
    return s + l[1];
  }, 0) / a;
  return {
    transform: "translateZ(0px) translate(".concat(i, "px, ").concat(o, "px) rotate(").concat(t, "rad) scale(").concat(e, ")")
  };
}
function dr(t, e) {
  var n = t[e];
  return Ae(n) ? O(O({}, t), n) : t;
}
function ch(t) {
  var e = t && !yl(t.offsetWidth), n = 0, r = 0, a = 0, i = 0, o = 0, s = 0, l = 0, c = 0, u = 0, f = 0, d = 0, h = 0, m = 1 / 0, v = 1 / 0, y = 1 / 0, b = 1 / 0, S = 0, C = 0, k = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var M = t.getBBox();
      k = !0, n = M.width, r = M.height, o = n, s = r, l = n, c = r, a = n, i = r;
    } else {
      var E = Ne(t), D = t.style, j = E("boxSizing") === "border-box", R = parseFloat(E("borderLeftWidth")) || 0, _ = parseFloat(E("borderRightWidth")) || 0, x = parseFloat(E("borderTopWidth")) || 0, P = parseFloat(E("borderBottomWidth")) || 0, I = parseFloat(E("paddingLeft")) || 0, A = parseFloat(E("paddingRight")) || 0, B = parseFloat(E("paddingTop")) || 0, q = parseFloat(E("paddingBottom")) || 0, F = I + A, N = B + q, W = R + _, V = x + P, X = F + W, J = N + V, et = E("position"), at = 0, Q = 0;
      if ("clientLeft" in t) {
        var it = null;
        if (et === "absolute") {
          var ut = Ea(t, Kn(t));
          it = ut.offsetParent;
        } else
          it = t.parentElement;
        if (it) {
          var Z = Ne(it);
          at = parseFloat(Z("width")), Q = parseFloat(Z("height"));
        }
      }
      u = Math.max(F, Yt(E("minWidth"), at) || 0), f = Math.max(N, Yt(E("minHeight"), Q) || 0), m = Yt(E("maxWidth"), at), v = Yt(E("maxHeight"), Q), isNaN(m) && (m = 1 / 0), isNaN(v) && (v = 1 / 0), S = Yt(D.width, 0) || 0, C = Yt(D.height, 0) || 0, o = parseFloat(E("width")) || 0, s = parseFloat(E("height")) || 0, l = nt(o - S) < 1 ? zi(u, S || o, m) : o, c = nt(s - C) < 1 ? zi(f, C || s, v) : s, n = l, r = c, a = l, i = c, j ? (y = m, b = v, d = u, h = f, l = n - X, c = r - J) : (y = m + X, b = v + J, d = u + X, h = f + J, n = l + X, r = c + J), a = l + F, i = c + N;
    }
  return {
    svg: k,
    offsetWidth: n,
    offsetHeight: r,
    clientWidth: a,
    clientHeight: i,
    contentWidth: l,
    contentHeight: c,
    inlineCSSWidth: S,
    inlineCSSHeight: C,
    cssWidth: o,
    cssHeight: s,
    minWidth: u,
    minHeight: f,
    maxWidth: m,
    maxHeight: v,
    minOffsetWidth: d,
    minOffsetHeight: h,
    maxOffsetWidth: y,
    maxOffsetHeight: b
  };
}
function uh(t, e) {
  return ae(e > 0 ? t[0] : t[1], e > 0 ? t[1] : t[0]);
}
function pi() {
  return {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    right: 0,
    bottom: 0,
    clientLeft: 0,
    clientTop: 0,
    clientWidth: 0,
    clientHeight: 0,
    scrollWidth: 0,
    scrollHeight: 0
  };
}
function dh(t, e) {
  var n = t === Kn(t) || t === kl(t), r = {
    clientLeft: t.clientLeft,
    clientTop: t.clientTop,
    clientWidth: t.clientWidth,
    clientHeight: t.clientHeight,
    scrollWidth: t.scrollWidth,
    scrollHeight: t.scrollHeight,
    overflow: !1
  };
  return n && (r.clientHeight = Math.max(e.height, r.clientHeight), r.scrollHeight = Math.max(e.height, r.scrollHeight)), r.overflow = Ne(t)("overflow") !== "visible", O(O({}, e), r);
}
function Uo(t, e, n, r) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, c = e.left, u = {
    left: c + a,
    top: l + o,
    right: c + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return n && r ? dh(n, u) : u;
}
function fa(t, e) {
  var n = 0, r = 0, a = 0, i = 0;
  if (t) {
    var o = t.getBoundingClientRect();
    n = o.left, r = o.top, a = o.width, i = o.height;
  }
  var s = {
    left: n,
    top: r,
    width: a,
    height: i,
    right: n + a,
    bottom: r + i
  };
  return t && e ? dh(t, s) : s;
}
function wb(t) {
  var e = t.props, n = e.groupable, r = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !n && s && r ? Vl(r, i, o) : l;
}
function fh(t, e, n, r) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = n.target;
    a = ph(i, r);
  }
  return a;
}
function ph(t, e) {
  if (t) {
    var n = t.getAttribute("data-rotation") || "", r = t.getAttribute("data-direction");
    if (e.deg = n, !!r) {
      var a = [0, 0];
      return r.indexOf("w") > -1 && (a[0] = -1), r.indexOf("e") > -1 && (a[0] = 1), r.indexOf("n") > -1 && (a[1] = -1), r.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function $l(t, e) {
  return [
    Bt(e, t[0]),
    Bt(e, t[1]),
    Bt(e, t[2]),
    Bt(e, t[3])
  ];
}
function Ue(t) {
  var e = t.left, n = t.top, r = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return $l([r, a, i, o], [e, n]);
}
function Gs(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(n) {
    n.unset && n.unset(t);
  });
}
function kr(t, e) {
  var n = e ? "controlGesto" : "targetGesto", r = t[n];
  (r == null ? void 0 : r.isIdle()) === !1 && Gs(t, e), r == null || r.unset(), t[n] = null;
}
function je(t, e) {
  if (e) {
    var n = $r(e);
    n.nextStyle = O(O({}, n.nextStyle), t);
  }
  return {
    style: t,
    cssText: Br(t).map(function(r) {
      return "".concat(H0(r, "-"), ": ").concat(t[r], ";");
    }).join("")
  };
}
function hh(t, e, n) {
  var r = e.afterTransform || e.transform;
  return O(O({}, je(O(O(O({}, t.style), e.style), { transform: r }), n)), { afterTransform: r, transform: t.transform });
}
function Rt(t, e, n, r) {
  var a = e.datas;
  a.datas || (a.datas = {});
  var i = O(O({}, n), { target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, moveable: t, datas: a.datas, isRequest: e.isRequest, isRequestChild: e.isRequestChild, isFirstDrag: !!e.isFirstDrag, isTrusted: e.isTrusted !== !1, stopAble: function() {
    a.isEventStart = !1;
  }, stopDrag: function() {
    var o;
    (o = e.stop) === null || o === void 0 || o.call(e);
  } });
  return a.isStartEvent ? r || (a.lastEvent = i) : a.isStartEvent = !0, i;
}
function Le(t, e, n) {
  var r = e.datas, a = "isDrag" in n ? n.isDrag : e.isDrag;
  return r.datas || (r.datas = {}), O(O({ isDrag: a }, n), { moveable: t, target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, lastEvent: r.lastEvent, isDouble: e.isDouble, datas: r.datas, isFirstDrag: !!e.isFirstDrag });
}
function co(t, e, n) {
  t._emitter.on(e, n);
}
function pt(t, e, n, r, a) {
  return t.triggerEvent(e, n, r, a);
}
function Wl(t, e) {
  return Xe(t).getComputedStyle(t, e);
}
function hi(t, e, n) {
  var r = {}, a = {};
  return t.filter(function(i) {
    var o = i.name;
    if (r[o] || !e.some(function(s) {
      return i[s];
    }))
      return !1;
    if (!n && i.ableGroup) {
      if (a[i.ableGroup])
        return !1;
      a[i.ableGroup] = !0;
    }
    return r[o] = !0, !0;
  });
}
function $s(t, e) {
  return t === e || t == null && e == null;
}
function ld() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var n = t.length - 1, r = 0; r < n; ++r) {
    var a = t[r];
    if (!yl(a))
      return a;
  }
  return t[n];
}
function gh(t, e) {
  var n = [], r = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = r.indexOf(o), l = n[s] || [];
    s === -1 && (r.push(o), n.push(l)), l.push(a);
  }), n;
}
function Sb(t, e) {
  var n = [], r = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = r[o];
    s || (s = [], r[o] = s, n.push(s)), s.push(a);
  }), n;
}
function vh(t) {
  return t.reduce(function(e, n) {
    return e.concat(n);
  }, []);
}
function Nr() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return t.sort(function(n, r) {
    return nt(r) - nt(n);
  }), t[0];
}
function Or(t, e, n) {
  return Ee(un(t, n), lr(e, n), n);
}
function Cb(t, e) {
  var n, r = t.is3d, a = t.rootMatrix, i = r ? 4 : 3;
  return n = L(Or(a, [e.distX, e.distY], i), 2), e.distX = n[0], e.distY = n[1], e;
}
function We(t, e, n, r) {
  if (!n[0] && !n[1])
    return e;
  var a = ee(t, [ad(n[0] || 1), 0], r), i = ee(t, [0, ad(n[1] || 1)], r), o = ee(t, [
    n[0] / qe(a),
    n[1] / qe(i)
  ], r);
  return Bt(e, o);
}
function on(t, e, n) {
  return n ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function Vi(t) {
  return nt(t) <= Ie ? 0 : t;
}
function Yl(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var n = fy(e, t), r = n.deg;
    return r ? mt("view-control-rotation".concat(r)) : "";
  };
}
function Hl(t, e) {
  return e === void 0 && (e = [t]), function(n, r) {
    if (r.isRequest)
      return e.some(function(i) {
        return r.requestAble === i;
      }) ? r.parentDirection : !1;
    var a = r.inputEvent.target;
    return ue(a, mt("direction")) && (!t || ue(a, mt(t)));
  };
}
function kb(t, e, n) {
  var r, a = Ir(t, {
    "x%": function(M) {
      return M / 100 * e.offsetWidth;
    },
    "y%": function(M) {
      return M / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, n < 0 ? void 0 : n), o = t.slice(0, n < 0 ? void 0 : n + 1), s = t[n] || "", l = n < 0 ? [] : t.slice(n), c = n < 0 ? [] : t.slice(n + 1), u = a.slice(0, n < 0 ? void 0 : n), f = a.slice(0, n < 0 ? void 0 : n + 1), d = (r = a[n]) !== null && r !== void 0 ? r : Ir([""])[0], h = n < 0 ? [] : a.slice(n), m = n < 0 ? [] : a.slice(n + 1), v = d ? [d] : [], y = yr(u), b = yr(f), S = yr(h), C = yr(m), k = Ht(y, S, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: y,
    beforeFunctionMatrix2: b,
    targetFunctionMatrix: yr(v),
    afterFunctionMatrix: S,
    afterFunctionMatrix2: C,
    allFunctionMatrix: k,
    beforeFunctions: u,
    beforeFunctions2: f,
    targetFunction: v[0],
    afterFunctions: h,
    afterFunctions2: m,
    beforeFunctionTexts: i,
    beforeFunctionTexts2: o,
    targetFunctionText: s,
    afterFunctionTexts: l,
    afterFunctionTexts2: c
  };
}
function Eb(t) {
  return !t || !Ae(t) || Ca(t) ? !1 : re(t) || "length" in t;
}
function mn(t, e) {
  return t ? Ca(t) ? t : Ke(t) ? e ? document.querySelector(t) : t : to(t) ? t() : pp(t) ? t : "current" in t ? t.current : t : null;
}
function Xl(t, e) {
  if (!t)
    return [];
  var n = Eb(t) ? [].slice.call(t) : [t];
  return n.reduce(function(r, a) {
    return Ke(a) && e ? ot(ot([], L(r), !1), L([].slice.call(document.querySelectorAll(a))), !1) : (re(a) ? r.push(Xl(a, e)) : r.push(mn(a, e)), r);
  }, []);
}
function Mb(t, e, n) {
  var r = ae(t, e) / Math.PI * 180;
  return r = n >= 0 ? r : 180 - r, r = r >= 0 ? r : 360 + r, r;
}
function cd(t, e) {
  var n = t.rootMatrix, r = t.is3d, a = r ? 4 : 3, i = un(n, a);
  return r || (i = dn(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, Ei(i, e);
}
function mh(t, e, n, r, a) {
  var i = L(t, 2), o = i[0], s = i[1], l = 0, c = 0;
  if (a && o && s) {
    var u = ae([0, 0], e), f = ae([0, 0], r), d = qe(e), h = Math.cos(u - f) * d;
    if (!r[0])
      c = h, l = c * n;
    else if (!r[1])
      l = h, c = l / n;
    else {
      var m = r[0] * o, v = r[1] * s, y = Math.atan2(m + e[0], v + e[1]), b = Math.atan2(m, v);
      y < 0 && (y += Math.PI * 2), b < 0 && (b += Math.PI * 2);
      var S = 0;
      nt(y - b) < Math.PI / 2 || nt(y - b) > Math.PI / 2 * 3 || (b += Math.PI), S = y - b, S > Math.PI * 2 ? S -= Math.PI * 2 : S > Math.PI ? S = 2 * Math.PI - S : S < -Math.PI && (S = -2 * Math.PI - S);
      var C = qe([m + e[0], v + e[1]]) * Math.cos(S);
      l = C * Math.sin(b) - m, c = C * Math.cos(b) - v, r[0] < 0 && (l *= -1), r[1] < 0 && (c *= -1);
    }
  } else
    l = r[0] * e[0], c = r[1] * e[1];
  return [l, c];
}
function xh(t, e, n, r) {
  var a, i = n.ratio, o = n.startOffsetWidth, s = n.startOffsetHeight, l = 0, c = 0, u = r.distX, f = r.distY, d = r.pinchScale, h = r.parentDistance, m = r.parentDist, v = r.parentScale, y = n.fixedDirection, b = [0, 1].map(function(D) {
    return nt(t[D] - y[D]);
  }), S = [0, 1].map(function(D) {
    var j = b[D];
    return j !== 0 && (j = 2 / j), j;
  });
  if (m)
    l = m[0], c = m[1], e && (l ? c || (c = l / i) : l = c * i);
  else if (wa(d))
    l = (d - 1) * o, c = (d - 1) * s;
  else if (v)
    l = (v[0] - 1) * o, c = (v[1] - 1) * s;
  else if (h) {
    var C = o * b[0], k = s * b[1], M = qe([C, k]);
    l = h / M * C * S[0], c = h / M * k * S[1];
  } else {
    var E = xn({ datas: n, distX: u, distY: f });
    E = S.map(function(D, j) {
      return E[j] * D;
    }), a = L(mh([o, s], E, i, t, e), 2), l = a[0], c = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: c
  };
}
function Ws(t, e) {
  if (e) {
    if (t === "left")
      return { x: "0%", y: "50%" };
    if (t === "top")
      return { x: "50%", y: "50%" };
    if (t === "center")
      return { x: "50%", y: "50%" };
    if (t === "right")
      return { x: "100%", y: "50%" };
    if (t === "bottom")
      return { x: "50%", y: "100%" };
    var n = L(t.split(" "), 2), r = n[0], a = n[1], i = Ws(r || ""), o = Ws(a || ""), s = O(O({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function Vl(t, e, n) {
  var r = Ws(t, !0), a = r.x, i = r.y;
  return [
    Yt(a, e) || 0,
    Yt(i, n) || 0
  ];
}
function Db(t, e, n) {
  var r = t.map(function(i) {
    return bt(i, e);
  }), a = r.map(function(i) {
    return Ta(i, n);
  });
  return {
    prev: r,
    next: a,
    result: a.map(function(i) {
      return Bt(i, e);
    })
  };
}
function yh(t, e) {
  return t.length === e.length && t.every(function(n, r) {
    var a = e[r], i = re(n), o = re(a);
    return i && o ? yh(n, a) : !i && !o ? n === a : !1;
  });
}
function Er(t, e, n, r, a) {
  var i = t._store, o = i[e];
  if (!(e in i))
    if (a != null)
      i[e] = a, o = a;
    else
      return i[e] = n, n;
  return o === n || r(o) === r(n) ? o : (i[e] = n, n);
}
function _e(t) {
  return t >= 0 ? 1 : -1;
}
function nt(t) {
  return Math.abs(t);
}
function Zo(t, e) {
  return q0(t).map(function(n) {
    return e(n);
  });
}
function bh(t) {
  return wa(t) ? {
    top: t,
    left: t,
    right: t,
    bottom: t
  } : {
    left: t.left || 0,
    top: t.top || 0,
    right: t.right || 0,
    bottom: t.bottom || 0
  };
}
var Tb = Ra("pinchable", {
  props: [
    "pinchable"
  ],
  events: [
    "pinchStart",
    "pinch",
    "pinchEnd",
    "pinchGroupStart",
    "pinchGroup",
    "pinchGroupEnd"
  ],
  dragStart: function() {
    return !0;
  },
  pinchStart: function(t, e) {
    var n = e.datas, r = e.targets, a = e.angle, i = e.originalDatas, o = t.props, s = o.pinchable, l = o.ables;
    if (!s)
      return !1;
    var c = "onPinch".concat(r ? "Group" : "", "Start"), u = "drag".concat(r ? "Group" : "", "ControlStart"), f = (s === !0 ? t.controlAbles : l.filter(function(v) {
      return s.indexOf(v.name) > -1;
    })).filter(function(v) {
      return v.canPinch && v[u];
    }), d = Rt(t, e, {});
    r && (d.targets = r);
    var h = pt(t, c, d);
    n.isPinch = h !== !1, n.ables = f;
    var m = n.isPinch;
    return m ? (f.forEach(function(v) {
      if (i[v.name] = i[v.name] || {}, !!v[u]) {
        var y = O(O({}, e), { datas: i[v.name], parentRotate: a, isPinch: !0 });
        v[u](t, y);
      }
    }), t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: [0, 0]
    }, m) : !1;
  },
  pinch: function(t, e) {
    var n = e.datas, r = e.scale, a = e.distance, i = e.originalDatas, o = e.inputEvent, s = e.targets, l = e.angle;
    if (n.isPinch) {
      var c = a * (1 - 1 / r), u = Rt(t, e, {});
      s && (u.targets = s);
      var f = "onPinch".concat(s ? "Group" : "");
      pt(t, f, u);
      var d = n.ables, h = "drag".concat(s ? "Group" : "", "Control");
      return d.forEach(function(m) {
        m[h] && m[h](t, O(O({}, e), { datas: i[m.name], inputEvent: o, resolveMatrix: !0, pinchScale: r, parentDistance: c, parentRotate: l, isPinch: !0 }));
      }), u;
    }
  },
  pinchEnd: function(t, e) {
    var n = e.datas, r = e.isPinch, a = e.inputEvent, i = e.targets, o = e.originalDatas;
    if (n.isPinch) {
      var s = "onPinch".concat(i ? "Group" : "", "End"), l = Le(t, e, { isDrag: r });
      i && (l.targets = i), pt(t, s, l);
      var c = n.ables, u = "drag".concat(i ? "Group" : "", "ControlEnd");
      return c.forEach(function(f) {
        f[u] && f[u](t, O(O({}, e), { isDrag: r, datas: o[f.name], inputEvent: a, isPinch: !0 }));
      }), r;
    }
  },
  pinchGroupStart: function(t, e) {
    return this.pinchStart(t, O(O({}, e), { targets: t.props.targets }));
  },
  pinchGroup: function(t, e) {
    return this.pinch(t, O(O({}, e), { targets: t.props.targets }));
  },
  pinchGroupEnd: function(t, e) {
    return this.pinchEnd(t, O(O({}, e), { targets: t.props.targets }));
  }
}), ud = Hl("scalable"), _b = {
  name: "scalable",
  ableGroup: "size",
  canPinch: !0,
  props: [
    "scalable",
    "throttleScale",
    "renderDirections",
    "keepRatio",
    "edge",
    "displayAroundControls"
  ],
  events: [
    "scaleStart",
    "beforeScale",
    "scale",
    "scaleEnd",
    "scaleGroupStart",
    "beforeScaleGroup",
    "scaleGroup",
    "scaleGroupEnd"
  ],
  render: Bp("scalable"),
  dragControlCondition: ud,
  viewClassName: Yl("scalable"),
  dragControlStart: function(t, e) {
    var n = e.datas, r = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = fh(i, r, a, n), s = t.state, l = s.width, c = s.height, u = s.targetTransform, f = s.target, d = s.pos1, h = s.pos2, m = s.pos4;
    if (!o || !f)
      return !1;
    r || fr(t, e), n.datas = {}, n.transform = u, n.prevDist = [1, 1], n.direction = o, n.startOffsetWidth = l, n.startOffsetHeight = c, n.startValue = [1, 1];
    var v = !o[0] && !o[1] || o[0] || !o[1];
    ao(t, e, "scale"), n.isWidth = v;
    function y(E) {
      n.ratio = E && isFinite(E) ? E : 0;
    }
    n.startPositions = Ue(t.state);
    function b(E) {
      var D = Jp(n.startPositions, E);
      n.fixedDirection = D.fixedDirection, n.fixedPosition = D.fixedPosition, n.fixedOffset = D.fixedOffset;
    }
    n.setFixedDirection = b, y(vn(d, h) / vn(h, m)), b([-o[0], -o[1]]);
    var S = function(E) {
      n.minScaleSize = E;
    }, C = function(E) {
      n.maxScaleSize = E;
    };
    S([-1 / 0, -1 / 0]), C([1 / 0, 1 / 0]);
    var k = Rt(t, e, O(O({ direction: o, set: function(E) {
      n.startValue = E;
    }, setRatio: y, setFixedDirection: b, setMinScaleSize: S, setMaxScaleSize: C }, ro(t, e)), { dragStart: Te.dragStart(t, new Rr().dragStart([0, 0], e)) })), M = pt(t, "onScaleStart", k);
    return n.startFixedDirection = n.fixedDirection, M !== !1 && (n.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), n.isScale ? k : !1;
  },
  dragControl: function(t, e) {
    eo(t, e, "scale");
    var n = e.datas, r = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, c = e.resolveMatrix, u = n.prevDist, f = n.direction, d = n.startOffsetWidth, h = n.startOffsetHeight, m = n.isScale, v = n.startValue, y = n.isWidth, b = n.ratio;
    if (!m)
      return !1;
    var S = t.props, C = S.throttleScale, k = S.parentMoveable, M = f;
    !f[0] && !f[1] && (M = [1, 1]);
    var E = b && (r ?? S.keepRatio) || !1, D = t.state, j = [
      v[0],
      v[1]
    ];
    function R() {
      var tt = xh(M, E, n, e), ft = tt.distWidth, Mt = tt.distHeight, xt = d ? (d + ft) / d : 1, st = h ? (h + Mt) / h : 1;
      v[0] || (j[0] = ft / d), v[1] || (j[1] = Mt / h);
      var St = (M[0] || E ? xt : 1) * j[0], Pt = (M[1] || E ? st : 1) * j[1];
      return St === 0 && (St = _e(u[0]) * ci), Pt === 0 && (Pt = _e(u[1]) * ci), [St, Pt];
    }
    var _ = R();
    if (!i && t.props.groupable) {
      var x = D.snapRenderInfo || {}, P = x.direction;
      re(P) && (P[0] || P[1]) && (D.snapRenderInfo = { direction: f, request: e.isRequest });
    }
    pt(t, "onBeforeScale", Rt(t, e, {
      scale: _,
      setFixedDirection: function(tt) {
        return n.setFixedDirection(tt), _ = R(), _;
      },
      startFixedDirection: n.startFixedDirection,
      setScale: function(tt) {
        _ = tt;
      }
    }, !0));
    var I = [
      _[0] / j[0],
      _[1] / j[1]
    ], A = o, B = [0, 0], q = _e(I[0] * I[1]), F = !o && !a && i;
    if (F || c ? A = Nl(t, n.targetAllTransform, [0, 0], [0, 0], n) : o || (A = n.fixedPosition), i || (B = ob(t, I, f, !l && s, n)), E) {
      M[0] && M[1] && B[0] && B[1] && (Math.abs(B[0] * d) > Math.abs(B[1] * h) ? B[1] = 0 : B[0] = 0);
      var N = !B[0] && !B[1];
      if (N && (y ? I[0] = Et(I[0] * j[0], C) / j[0] : I[1] = Et(I[1] * j[1], C) / j[1]), M[0] && !M[1] || B[0] && !B[1] || N && y) {
        I[0] += B[0];
        var W = d * I[0] * j[0] / b;
        I[1] = _e(q * I[0]) * nt(W / h / j[1]);
      } else if (!M[0] && M[1] || !B[0] && B[1] || N && !y) {
        I[1] += B[1];
        var V = h * I[1] * j[1] * b;
        I[0] = _e(q * I[1]) * nt(V / d / j[0]);
      }
    } else
      I[0] += B[0], I[1] += B[1], B[0] || (I[0] = Et(I[0] * j[0], C) / j[0]), B[1] || (I[1] = Et(I[1] * j[1], C) / j[1]);
    I[0] === 0 && (I[0] = _e(u[0]) * ci), I[1] === 0 && (I[1] = _e(u[1]) * ci), _ = ub(I, [j[0], j[1]]);
    var X = [
      d,
      h
    ], J = [
      d * _[0],
      h * _[1]
    ];
    J = Sl(J, n.minScaleSize, n.maxScaleSize, E ? b : !1), _ = Zo(2, function(tt) {
      return X[tt] ? J[tt] / X[tt] : J[tt];
    }), I = Zo(2, function(tt) {
      return _[tt] / j[tt];
    });
    var et = Zo(2, function(tt) {
      return u[tt] ? I[tt] / u[tt] : I[tt];
    }), at = "scale(".concat(I.join(", "), ")"), Q = "scale(".concat(_.join(", "), ")"), it = no(n, Q, at), ut = !v[0] || !v[1], Z = oy(t, ut ? Q : at, n.fixedDirection, A, n.fixedOffset, n, ut), dt = F ? Z : bt(Z, n.prevInverseDist || [0, 0]);
    if (n.prevDist = I, n.prevInverseDist = Z, _[0] === u[0] && _[1] === u[1] && dt.every(function(tt) {
      return !tt;
    }) && !k && !F)
      return !1;
    var ht = Rt(t, e, O({ offsetWidth: d, offsetHeight: h, direction: f, scale: _, dist: I, delta: et, isPinch: !!i }, Np(t, it, dt, i, e)));
    return pt(t, "onScale", ht), ht;
  },
  dragControlEnd: function(t, e) {
    var n = e.datas;
    if (!n.isScale)
      return !1;
    n.isScale = !1;
    var r = Le(t, e, {});
    return pt(t, "onScaleEnd", r), r;
  },
  dragGroupControlCondition: ud,
  dragGroupControlStart: function(t, e) {
    var n = e.datas, r = this.dragControlStart(t, e);
    if (!r)
      return !1;
    var a = cn(t, "resizable", e);
    n.moveableScale = t.scale;
    var i = _n(t, this, "dragControlStart", e, function(c, u) {
      return $i(t, c, n, u);
    }), o = function(c) {
      r.setFixedDirection(c), i.forEach(function(u, f) {
        u.setFixedDirection(c), $i(t, u.moveable, n, a[f]);
      });
    };
    n.setFixedDirection = o;
    var s = O(O({}, r), { targets: t.props.targets, events: i, setFixedDirection: o }), l = pt(t, "onScaleGroupStart", s);
    return n.isScale = l !== !1, n.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var n = e.datas;
    if (n.isScale) {
      co(t, "onBeforeScale", function(u) {
        pt(t, "onBeforeScaleGroup", Rt(t, e, O(O({}, u), { targets: t.props.targets }), !0));
      });
      var r = this.dragControl(t, e);
      if (r) {
        var a = r.dist, i = n.moveableScale;
        t.scale = [
          a[0] * i[0],
          a[1] * i[1]
        ];
        var o = t.props.keepRatio, s = n.fixedPosition, l = _n(t, this, "dragControl", e, function(u, f) {
          var d = L(Ee(_a(t.rotation / 180 * Math.PI, 3), [
            f.datas.originalX * a[0],
            f.datas.originalY * a[1],
            1
          ], 3), 2), h = d[0], m = d[1];
          return O(O({}, f), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: Bt(s, [h, m])
          });
        }), c = O({ targets: t.props.targets, events: l }, r);
        return pt(t, "onScaleGroup", c), c;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var n = e.isDrag, r = e.datas;
    if (r.isScale) {
      this.dragControlEnd(t, e);
      var a = _n(t, this, "dragControlEnd", e), i = Le(t, e, {
        targets: t.props.targets,
        events: a
      });
      return pt(t, "onScaleGroupEnd", i), n;
    }
  },
  /**
       * @method Moveable.Scalable#request
       * @param {Moveable.Scalable.ScalableRequestParam} e - the Scalable's request parameter
       * @return {Moveable.Requester} Moveable Requester
       * @example
  
       * // Instantly Request (requestStart - request - requestEnd)
       * moveable.request("scalable", { deltaWidth: 10, deltaHeight: 10 }, true);
       *
       * // requestStart
       * const requester = moveable.request("scalable");
       *
       * // request
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       * requester.request({ deltaWidth: 10, deltaHeight: 10 });
       *
       * // requestEnd
       * requester.requestEnd();
       */
  request: function() {
    var t = {}, e = 0, n = 0, r = !1;
    return {
      isControl: !0,
      requestStart: function(a) {
        return r = a.useSnap, {
          datas: t,
          parentDirection: a.direction || [1, 1],
          useSnap: r
        };
      },
      request: function(a) {
        return e += a.deltaWidth, n += a.deltaHeight, {
          datas: t,
          parentDist: [e, n],
          parentKeepRatio: a.keepRatio,
          useSnap: r
        };
      },
      requestEnd: function() {
        return { datas: t, isDrag: !0, useSnap: r };
      }
    };
  }
};
function On(t, e) {
  return t.map(function(n, r) {
    return Ai(n, e[r], 1, 2);
  });
}
function dd(t, e, n) {
  var r = ae(t, e), a = ae(t, n), i = a - r;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function jb(t, e) {
  var n = dd(t[0], t[1], t[2]), r = dd(e[0], e[1], e[2]), a = Math.PI;
  return !(n >= a && r <= a || n <= a && r >= a);
}
var Ib = {
  name: "warpable",
  ableGroup: "size",
  props: [
    "warpable",
    "renderDirections",
    "edge",
    "displayAroundControls"
  ],
  events: [
    "warpStart",
    "warp",
    "warpEnd"
  ],
  viewClassName: Yl("warpable"),
  render: function(t, e) {
    var n = t.props, r = n.resizable, a = n.scalable, i = n.warpable, o = n.zoom;
    if (r || a || !i)
      return [];
    var s = t.state, l = s.pos1, c = s.pos2, u = s.pos3, f = s.pos4, d = On(l, c), h = On(c, l), m = On(l, u), v = On(u, l), y = On(u, f), b = On(f, u), S = On(c, f), C = On(f, c);
    return ot([
      e.createElement("div", { className: mt("line"), key: "middeLine1", style: ra(d, y, o) }),
      e.createElement("div", { className: mt("line"), key: "middeLine2", style: ra(h, b, o) }),
      e.createElement("div", { className: mt("line"), key: "middeLine3", style: ra(m, S, o) }),
      e.createElement("div", { className: mt("line"), key: "middeLine4", style: ra(v, C, o) })
    ], L(Gp(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var n = e.inputEvent.target;
    return ue(n, mt("direction")) && ue(n, mt("warpable"));
  },
  dragControlStart: function(t, e) {
    var n = e.datas, r = e.inputEvent, a = t.props.target, i = r.target, o = ph(i, n);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, c = s.is3d, u = s.targetTransform, f = s.targetMatrix, d = s.width, h = s.height, m = s.left, v = s.top;
    n.datas = {}, n.targetTransform = u, n.warpTargetMatrix = c ? f : dn(f, 3, 4), n.targetInverseMatrix = hp(un(n.warpTargetMatrix, 4), 3, 4), n.direction = o, n.left = m, n.top = v, n.poses = [
      [0, 0],
      [d, 0],
      [0, h],
      [d, h]
    ].map(function(S) {
      return bt(S, l);
    }), n.nextPoses = n.poses.map(function(S) {
      var C = L(S, 2), k = C[0], M = C[1];
      return Ee(n.warpTargetMatrix, [k, M, 0, 1], 4);
    }), n.startValue = Ut(4), n.prevMatrix = Ut(4), n.absolutePoses = Ue(s), n.posIndexes = Pp(o), fr(t, e), ao(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var y = Rt(t, e, O({ set: function(S) {
      n.startValue = S;
    } }, ro(t, e))), b = pt(t, "onWarpStart", y);
    return b !== !1 && (n.isWarp = !0), n.isWarp;
  },
  dragControl: function(t, e) {
    var n = e.datas, r = e.isRequest, a = e.distX, i = e.distY, o = n.targetInverseMatrix, s = n.prevMatrix, l = n.isWarp, c = n.startValue, u = n.poses, f = n.posIndexes, d = n.absolutePoses;
    if (!l)
      return !1;
    if (eo(t, e, "matrix3d"), Wr(t, "warpable")) {
      var h = f.map(function(R) {
        return d[R];
      });
      h.length > 1 && h.push([
        (h[0][0] + h[1][0]) / 2,
        (h[0][1] + h[1][1]) / 2
      ]);
      var m = so(t, r, {
        horizontal: h.map(function(R) {
          return R[1] + i;
        }),
        vertical: h.map(function(R) {
          return R[0] + a;
        })
      }), v = m.horizontal, y = m.vertical;
      i -= v.offset, a -= y.offset;
    }
    var b = xn({ datas: n, distX: a, distY: i }, !0), S = n.nextPoses.slice();
    if (f.forEach(function(R) {
      S[R] = Bt(S[R], b);
    }), !qx.every(function(R) {
      return jb(R.map(function(_) {
        return u[_];
      }), R.map(function(_) {
        return S[_];
      }));
    }))
      return !1;
    var C = Ml(u[0], u[2], u[1], u[3], S[0], S[2], S[1], S[3]);
    if (!C.length)
      return !1;
    var k = Ht(o, C, 4), M = Ip(n, k, !0), E = Ht(un(s, 4), M, 4);
    n.prevMatrix = M;
    var D = Ht(c, M, 4), j = no(n, "matrix3d(".concat(D.join(", "), ")"), "matrix3d(".concat(M.join(", "), ")"));
    return Pl(e, j), pt(t, "onWarp", Rt(t, e, O({ delta: E, matrix: D, dist: M, multiply: Ht, transform: j }, je({
      transform: j
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var n = e.datas, r = e.isDrag;
    return n.isWarp ? (n.isWarp = !1, pt(t, "onWarpEnd", Le(t, e, {})), r) : !1;
  }
}, Rb = /* @__PURE__ */ mt("area-pieces"), gi = /* @__PURE__ */ mt("area-piece"), wh = /* @__PURE__ */ mt("avoid"), Pb = mt("view-dragging");
function Jo(t) {
  var e = t.areaElement;
  if (e) {
    var n = t.state, r = n.width, a = n.height;
    fp(e, wh), e.style.cssText += "left: 0px; top: 0px; width: ".concat(r, "px; height: ").concat(a, "px");
  }
}
function fd(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: Rb },
    t.createElement("div", { className: gi }),
    t.createElement("div", { className: gi }),
    t.createElement("div", { className: gi }),
    t.createElement("div", { className: gi })
  );
}
var Sh = {
  name: "dragArea",
  props: [
    "dragArea",
    "passDragArea"
  ],
  events: [
    "click",
    "clickGroup"
  ],
  render: function(t, e) {
    var n = t.props, r = n.target, a = n.dragArea, i = n.groupable, o = n.passDragArea, s = t.getState(), l = s.width, c = s.height, u = s.renderPoses, f = o ? mt("area", "pass") : mt("area");
    if (i)
      return [
        e.createElement("div", { key: "area", ref: $n(t, "areaElement"), className: f }),
        fd(e)
      ];
    if (!r || !a)
      return [];
    var d = Ml([0, 0], [l, 0], [0, c], [l, c], u[0], u[1], u[2], u[3]), h = d.length ? lo(d, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: $n(t, "areaElement"), className: f, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(c, "px"),
        transformOrigin: "0 0",
        transform: h
      } }),
      fd(e)
    ];
  },
  dragStart: function(t, e) {
    var n = e.datas, r = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    n.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, c = s.renderPoses, u = s.rootMatrix, f = s.is3d, d = l.left, h = l.top, m = Ve(c), v = m.left, y = m.top, b = m.width, S = m.height, C = f ? 4 : 3, k = L(Or(u, [r - d, a - h], C), 2), M = k[0], E = k[1];
    M -= v, E -= y;
    var D = [
      { left: v, top: y, width: b, height: E - 10 },
      { left: v, top: y, width: M - 10, height: S },
      { left: v, top: y + E + 10, width: b, height: S - E - 10 },
      { left: v + M + 10, top: y, width: b - M - 10, height: S }
    ], j = [].slice.call(o.nextElementSibling.children);
    D.forEach(function(R, _) {
      j[_].style.cssText = "left: ".concat(R.left, "px;top: ").concat(R.top, "px; width: ").concat(R.width, "px; height: ").concat(R.height, "px;");
    }), Cl(o, wh), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var n = e.datas, r = e.inputEvent;
    if (this.enableNativeEvent(t), !r)
      return !1;
    n.isDragArea || (n.isDragArea = !0, Jo(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var n = e.inputEvent, r = e.datas;
    if (!n)
      return !1;
    r.isDragArea || Jo(t);
  },
  dragGroupStart: function(t, e) {
    return this.dragStart(t, e);
  },
  dragGroup: function(t, e) {
    return this.drag(t, e);
  },
  dragGroupEnd: function(t, e) {
    return this.dragEnd(t, e);
  },
  unset: function(t) {
    Jo(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && dp(function() {
      e.disableNativeEvent = !1;
    });
  }
}, Nb = Ra("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var n = t.props, r = n.zoom, a = n.svgOrigin, i = n.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, c = o.svg, u = o.allMatrix, f = o.is3d, d = o.left, h = o.top, m = o.offsetWidth, v = o.offsetHeight, y;
    if (!i && c && a) {
      var b = L(Vl(a, m, v), 2), S = b[0], C = b[1], k = f ? 4 : 3, M = ee(u, [S, C], k);
      y = Xi(l, r, bt(M, [d, h]));
    } else
      y = Xi(l, r, s);
    return [
      e.createElement("div", { className: mt("control", "origin"), style: y, key: "beforeOrigin" })
    ];
  }
});
function Ob(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var Ab = {
  name: "scrollable",
  canPinch: !0,
  props: [
    "scrollable",
    "scrollContainer",
    "scrollThreshold",
    "scrollThrottleTime",
    "getScrollPosition",
    "scrollOptions"
  ],
  events: [
    "scroll",
    "scrollGroup"
  ],
  dragRelation: "strong",
  dragStart: function(t, e) {
    var n = t.props, r = n.scrollContainer, a = r === void 0 ? t.getContainer() : r, i = n.scrollOptions, o = new yp(), s = mn(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", c = e.targets;
    o.on("scroll", function(u) {
      var f = u.container, d = u.direction, h = Rt(t, e, {
        scrollContainer: f,
        direction: d
      }), m = c ? "onScrollGroup" : "onScroll";
      c && (h.targets = c), pt(t, m, h);
    }).on("move", function(u) {
      var f = u.offsetX, d = u.offsetY, h = u.inputEvent;
      t[l].scrollBy(f, d, h.inputEvent, !1);
    }).on("scrollDrag", function(u) {
      var f = u.next;
      f(t[l].getCurrentEvent());
    }), o.dragStart(e, O({ container: s }, i));
  },
  checkScroll: function(t, e) {
    var n = e.datas.dragScroll;
    if (n) {
      var r = t.props, a = r.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = r.scrollThreshold, s = o === void 0 ? 0 : o, l = r.scrollThrottleTime, c = l === void 0 ? 0 : l, u = r.getScrollPosition, f = u === void 0 ? Ob : u, d = r.scrollOptions;
      return n.drag(e, O({ container: i, threshold: s, throttleTime: c, getScrollPosition: function(h) {
        return f({ scrollContainer: h.container, direction: h.direction });
      } }, d)), !0;
    }
  },
  drag: function(t, e) {
    return this.checkScroll(t, e);
  },
  dragEnd: function(t, e) {
    e.datas.dragScroll.dragEnd(), e.datas.dragScroll = null;
  },
  dragControlStart: function(t, e) {
    return this.dragStart(t, O(O({}, e), { isControl: !0 }));
  },
  dragControl: function(t, e) {
    return this.drag(t, e);
  },
  dragControlEnd: function(t, e) {
    return this.dragEnd(t, e);
  },
  dragGroupStart: function(t, e) {
    return this.dragStart(t, O(O({}, e), { targets: t.props.targets }));
  },
  dragGroup: function(t, e) {
    return this.drag(t, O(O({}, e), { targets: t.props.targets }));
  },
  dragGroupEnd: function(t, e) {
    return this.dragEnd(t, O(O({}, e), { targets: t.props.targets }));
  },
  dragGroupControlStart: function(t, e) {
    return this.dragStart(t, O(O({}, e), { targets: t.props.targets, isControl: !0 }));
  },
  dragGroupControl: function(t, e) {
    return this.drag(t, O(O({}, e), { targets: t.props.targets }));
  },
  dragGroupControEnd: function(t, e) {
    return this.dragEnd(t, O(O({}, e), { targets: t.props.targets }));
  },
  unset: function(t) {
    var e, n = t.state;
    (e = n.dragScroll) === null || e === void 0 || e.dragEnd(), n.dragScroll = null;
  }
}, Ch = {
  name: "",
  props: [
    "target",
    "dragTargetSelf",
    "dragTarget",
    "dragContainer",
    "container",
    "warpSelf",
    "rootContainer",
    "useResizeObserver",
    "useMutationObserver",
    "zoom",
    "dragFocusedInput",
    "transformOrigin",
    "ables",
    "className",
    "pinchThreshold",
    "pinchOutside",
    "triggerAblesSimultaneously",
    "checkInput",
    "cspNonce",
    "translateZ",
    "hideDefaultLines",
    "props",
    "flushSync",
    "stopPropagation",
    "preventClickEventOnDrag",
    "preventClickDefault",
    "viewContainer",
    "persistData",
    "useAccuratePosition",
    "firstRenderState",
    "linePadding",
    "controlPadding",
    "preventDefault",
    "preventRightClick",
    "preventWheelClick",
    "requestStyles"
  ],
  events: [
    "changeTargets"
  ]
}, zb = Ra("padding", {
  props: ["padding"],
  render: function(t, e) {
    var n = t.props;
    if (n.dragArea)
      return [];
    var r = bh(n.padding || {}), a = r.left, i = r.top, o = r.right, s = r.bottom, l = t.getState(), c = l.renderPoses, u = l.pos1, f = l.pos2, d = l.pos3, h = l.pos4, m = [u, f, d, h], v = [];
    return a > 0 && v.push([0, 2]), i > 0 && v.push([0, 1]), o > 0 && v.push([1, 3]), s > 0 && v.push([2, 3]), v.map(function(y, b) {
      var S = L(y, 2), C = S[0], k = S[1], M = m[C], E = m[k], D = c[C], j = c[k], R = Ml([0, 0], [100, 0], [0, 100], [100, 100], M, E, D, j);
      if (R.length)
        return e.createElement("div", { key: "padding".concat(b), className: mt("padding"), style: {
          transform: lo(R, !0)
        } });
    });
  }
}), pd = ["nw", "ne", "se", "sw"];
function vi(t, e) {
  var n = t[0] + t[1], r = n > e ? e / n : 1;
  return t[0] *= r, t[1] = e - t[1] * r, t;
}
var Lb = [1, 2, 5, 6], Fb = [0, 3, 4, 7], nr = [1, -1, -1, 1], rr = [1, 1, -1, -1];
function Kl(t, e, n, r, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = n), s === void 0 && (s = r);
  var l = [], c = !1, u = t.filter(function(d) {
    return !d.virtual;
  }), f = u.map(function(d) {
    var h = d.horizontal, m = d.vertical, v = d.pos;
    if (m && !c && (c = !0, l.push("/")), c) {
      var y = Math.max(0, m === 1 ? v[1] - i : s - v[1]);
      return l.push(on(y, r, e)), y;
    } else {
      var y = Math.max(0, h === 1 ? v[0] - a : o - v[0]);
      return l.push(on(y, n, e)), y;
    }
  });
  return {
    radiusPoses: u,
    styles: l,
    raws: f
  };
}
function kh(t) {
  for (var e = [0, 0], n = [0, 0], r = t.length, a = 0; a < r; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, n[0] = a + 1), i.vertical && (n[1] === 0 && (n[0] = a), n[1] = a - n[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: n
  };
}
function Eh(t, e, n, r, a, i, o) {
  var s, l, c, u;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var f = t.indexOf("/"), d = (f > -1 ? t.slice(0, f) : t).length, h = t.slice(0, d), m = t.slice(d + 1), v = h.length, y = m.length, b = y > 0, S = L(h, 4), C = S[0], k = C === void 0 ? "0px" : C, M = S[1], E = M === void 0 ? k : M, D = S[2], j = D === void 0 ? k : D, R = S[3], _ = R === void 0 ? E : R, x = L(m, 4), P = x[0], I = P === void 0 ? k : P, A = x[1], B = A === void 0 ? b ? I : E : A, q = x[2], F = q === void 0 ? b ? I : j : q, N = x[3], W = N === void 0 ? b ? B : _ : N, V = [k, E, j, _].map(function(it) {
    return Yt(it, e);
  }), X = [I, B, F, W].map(function(it) {
    return Yt(it, n);
  }), J = V.slice(), et = X.slice();
  s = L(vi([J[0], J[1]], e), 2), J[0] = s[0], J[1] = s[1], l = L(vi([J[3], J[2]], e), 2), J[3] = l[0], J[2] = l[1], c = L(vi([et[0], et[3]], n), 2), et[0] = c[0], et[3] = c[1], u = L(vi([et[1], et[2]], n), 2), et[1] = u[0], et[2] = u[1];
  var at = o ? J : J.slice(0, Math.max(i[0], v)), Q = o ? et : et.slice(0, Math.max(i[1], y));
  return ot(ot([], L(at.map(function(it, ut) {
    var Z = pd[ut];
    return {
      virtual: ut >= v,
      horizontal: nr[ut],
      vertical: 0,
      pos: [r + it, a + (rr[ut] === -1 ? n : 0)],
      sub: !0,
      raw: V[ut],
      direction: Z
    };
  })), !1), L(Q.map(function(it, ut) {
    var Z = pd[ut];
    return {
      virtual: ut >= y,
      horizontal: 0,
      vertical: rr[ut],
      pos: [r + (nr[ut] === -1 ? e : 0), a + it],
      sub: !0,
      raw: X[ut],
      direction: Z
    };
  })), !1);
}
function Bb(t, e, n, r, a) {
  a === void 0 && (a = e.length);
  var i = kh(t.slice(r)), o = i.horizontalRange, s = i.verticalRange, l = n - r, c = 0;
  if (l === 0)
    c = a;
  else if (l > 0 && l < o[1])
    c = o[1] - l;
  else if (l >= s[0])
    c = s[0] + s[1] - l;
  else
    return;
  t.splice(n, c), e.splice(n, c);
}
function Gb(t, e, n, r, a, i, o, s, l, c, u) {
  c === void 0 && (c = 0), u === void 0 && (u = 0);
  var f = kh(t.slice(n)), d = f.horizontalRange, h = f.verticalRange;
  if (r > -1)
    for (var m = nr[r] === 1 ? i - c : s - i, v = d[1]; v <= r; ++v) {
      var y = rr[v] === 1 ? u : l, b = 0;
      if (r === v ? b = i : v === 0 ? b = c + m : nr[v] === -1 && (b = s - (e[n][0] - c)), t.splice(n + v, 0, {
        horizontal: nr[v],
        vertical: 0,
        pos: [b, y]
      }), e.splice(n + v, 0, [b, y]), v === 0)
        break;
    }
  else if (a > -1) {
    var S = rr[a] === 1 ? o - u : l - o;
    if (d[1] === 0 && h[1] === 0) {
      var C = [
        c + S,
        u
      ];
      t.push({
        horizontal: nr[0],
        vertical: 0,
        pos: C
      }), e.push(C);
    }
    for (var k = h[0], v = h[1]; v <= a; ++v) {
      var b = nr[v] === 1 ? c : s, y = 0;
      if (a === v ? y = o : v === 0 ? y = u + S : rr[v] === 1 ? y = e[n + k][1] : rr[v] === -1 && (y = l - (e[n + k][1] - u)), t.push({
        horizontal: 0,
        vertical: rr[v],
        pos: [b, y]
      }), e.push([b, y]), v === 0)
        break;
    }
  }
}
function $b(t, e) {
  e === void 0 && (e = t.map(function(a) {
    return a.raw;
  }));
  var n = t.map(function(a, i) {
    return a.horizontal ? e[i] : null;
  }).filter(function(a) {
    return a != null;
  }), r = t.map(function(a, i) {
    return a.vertical ? e[i] : null;
  }).filter(function(a) {
    return a != null;
  });
  return {
    horizontals: n,
    verticals: r
  };
}
var Wb = [
  [0, -1, "n"],
  [1, 0, "e"]
], Yb = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function ql(t, e, n) {
  var r = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, c = s.poses, u = l === "rect", f = l === "circle";
  if (l === "polygon")
    return n.map(function(E) {
      return "".concat(on(E[0], i, r), " ").concat(on(E[1], o, r));
    });
  if (u || l === "inset") {
    var d = n[1][1], h = n[3][0], m = n[7][0], v = n[5][1];
    if (u)
      return [
        d,
        h,
        v,
        m
      ].map(function(E) {
        return "".concat(E, "px");
      });
    var y = [d, i - h, o - v, m].map(function(E, D) {
      return on(E, D % 2 ? i : o, r);
    });
    if (n.length > 8) {
      var b = L(bt(n[4], n[0]), 2), S = b[0], C = b[1];
      y.push.apply(y, ot(["round"], L(Kl(c.slice(8).map(function(E, D) {
        return O(O({}, E), { pos: n[D] });
      }), r, S, C, m, d, h, v).styles), !1));
    }
    return y;
  } else if (f || l === "ellipse") {
    var k = n[0], M = on(nt(n[1][1] - k[1]), f ? Math.sqrt((i * i + o * o) / 2) : o, r), y = f ? [M] : [on(nt(n[2][0] - k[0]), i, r), M];
    return y.push("at", on(k[0], i, r), on(k[1], o, r)), y;
  }
}
function Ki(t, e, n, r) {
  var a = [r, (r + e) / 2, e], i = [t, (t + n) / 2, n];
  return Yb.map(function(o) {
    var s = L(o, 3), l = s[0], c = s[1], u = s[2], f = a[l + 1], d = i[c + 1];
    return {
      vertical: nt(c),
      horizontal: nt(l),
      direction: u,
      pos: [f, d]
    };
  });
}
function Mh(t) {
  var e = [1 / 0, -1 / 0], n = [1 / 0, -1 / 0];
  return t.forEach(function(r) {
    var a = r.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), n[0] = Math.min(n[0], a[1]), n[1] = Math.max(n[1], a[1]);
  }), [
    nt(e[1] - e[0]),
    nt(n[1] - n[0])
  ];
}
function hd(t, e, n, r, a) {
  var i, o, s, l, c, u, f, d, h;
  if (t) {
    var m = a;
    if (!m) {
      var v = Ne(t), y = v("clipPath");
      m = y !== "none" ? y : v("clip");
    }
    if (!((!m || m === "none" || m === "auto") && (m = r, !m))) {
      var b = up(m), S = b.prefix, C = S === void 0 ? m : S, k = b.value, M = k === void 0 ? "" : k, E = C === "circle", D = " ";
      if (C === "polygon") {
        var j = ar(M || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        D = ",";
        var R = j.map(function(At) {
          var _t = L(At.split(" "), 2), Xt = _t[0], Nt = _t[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              Yt(Xt, e),
              Yt(Nt, n)
            ]
          };
        }), _ = ur(R.map(function(At) {
          return At.pos;
        }));
        return {
          type: C,
          clipText: m,
          poses: R,
          splitter: D,
          left: _.minX,
          right: _.maxX,
          top: _.minY,
          bottom: _.maxY
        };
      } else if (E || C === "ellipse") {
        var x = "", P = "", I = 0, A = 0, j = Yn(M);
        if (E) {
          var B = "";
          i = L(j, 4), o = i[0], B = o === void 0 ? "50%" : o, s = i[2], x = s === void 0 ? "50%" : s, l = i[3], P = l === void 0 ? "50%" : l, I = Yt(B, Math.sqrt((e * e + n * n) / 2)), A = I;
        } else {
          var q = "", F = "";
          c = L(j, 5), u = c[0], q = u === void 0 ? "50%" : u, f = c[1], F = f === void 0 ? "50%" : f, d = c[3], x = d === void 0 ? "50%" : d, h = c[4], P = h === void 0 ? "50%" : h, I = Yt(q, e), A = Yt(F, n);
        }
        var N = [
          Yt(x, e),
          Yt(P, n)
        ], R = ot([
          {
            vertical: 1,
            horizontal: 1,
            pos: N,
            direction: "nesw"
          }
        ], L(Wb.slice(0, E ? 1 : 2).map(function(Xt) {
          return {
            vertical: nt(Xt[1]),
            horizontal: Xt[0],
            direction: Xt[2],
            sub: !0,
            pos: [
              N[0] + Xt[0] * I,
              N[1] + Xt[1] * A
            ]
          };
        })), !1);
        return {
          type: C,
          clipText: m,
          radiusX: I,
          radiusY: A,
          left: N[0] - I,
          top: N[1] - A,
          right: N[0] + I,
          bottom: N[1] + A,
          poses: R,
          splitter: D
        };
      } else if (C === "inset") {
        var j = Yn(M || "0 0 0 0"), W = j.indexOf("round"), V = (W > -1 ? j.slice(0, W) : j).length, X = j.slice(V + 1), J = L(j.slice(0, V), 4), et = J[0], at = J[1], Q = at === void 0 ? et : at, it = J[2], ut = it === void 0 ? et : it, Z = J[3], dt = Z === void 0 ? Q : Z, ht = L([et, ut].map(function(Xt) {
          return Yt(Xt, n);
        }), 2), tt = ht[0], ft = ht[1], Mt = L([dt, Q].map(function(Xt) {
          return Yt(Xt, e);
        }), 2), xt = Mt[0], st = Mt[1], St = e - st, Pt = n - ft, Tt = Eh(X, St - xt, Pt - tt, xt, tt), R = ot(ot([], L(Ki(tt, St, Pt, xt)), !1), L(Tt), !1);
        return {
          type: "inset",
          clipText: m,
          poses: R,
          top: tt,
          left: xt,
          right: St,
          bottom: Pt,
          radius: X,
          splitter: D
        };
      } else if (C === "rect") {
        var j = ar(M || "0px, ".concat(e, "px, ").concat(n, "px, 0px"));
        D = ",";
        var vt = L(j.map(function(Ct) {
          var Jt = sr(Ct).value;
          return Jt;
        }), 4), gt = vt[0], st = vt[1], ft = vt[2], xt = vt[3], R = Ki(gt, st, ft, xt);
        return {
          type: "rect",
          clipText: m,
          poses: R,
          top: gt,
          right: st,
          bottom: ft,
          left: xt,
          values: j,
          splitter: D
        };
      }
    }
  }
}
function Hb(t, e, n, r, a) {
  var i = t[e], o = i.direction, s = i.sub, l = t.map(function() {
    return [0, 0];
  }), c = o ? o.split("") : [];
  if (r && e < 8) {
    var u = c.filter(function(I) {
      return I === "w" || I === "e";
    }), f = c.filter(function(I) {
      return I === "n" || I === "s";
    }), d = u[0], h = f[0];
    l[e] = n;
    var m = L(Mh(t), 2), v = m[0], y = m[1], b = v && y ? v / y : 0;
    if (b && a) {
      var S = (e + 4) % 8, C = t[S].pos, k = [0, 0];
      o.indexOf("w") > -1 ? k[0] = -1 : o.indexOf("e") > -1 && (k[0] = 1), o.indexOf("n") > -1 ? k[1] = -1 : o.indexOf("s") > -1 && (k[1] = 1);
      var M = mh([v, y], n, b, k, !0), E = v + M[0], D = y + M[1], j = C[1], R = C[1], _ = C[0], x = C[0];
      k[0] === -1 ? _ = x - E : k[0] === 1 ? x = _ + E : (_ = _ - E / 2, x = x + E / 2), k[1] === -1 ? j = R - D : (k[1] === 1 || (j = R - D / 2), R = j + D);
      var P = Ki(j, x, R, _);
      t.forEach(function(I, A) {
        l[A][0] = P[A].pos[0] - I.pos[0], l[A][1] = P[A].pos[1] - I.pos[1];
      });
    } else
      t.forEach(function(I, A) {
        var B = I.direction;
        B && (B.indexOf(d) > -1 && (l[A][0] = n[0]), B.indexOf(h) > -1 && (l[A][1] = n[1]));
      }), d && (l[1][0] = n[0] / 2, l[5][0] = n[0] / 2), h && (l[3][1] = n[1] / 2, l[7][1] = n[1] / 2);
  } else o && !s ? c.forEach(function(I) {
    var A = I === "n" || I === "s";
    t.forEach(function(B, q) {
      var F = B.direction, N = B.horizontal, W = B.vertical;
      !F || F.indexOf(I) === -1 || (l[q] = [
        A || !N ? 0 : n[0],
        !A || !W ? 0 : n[1]
      ]);
    });
  }) : l[e] = n;
  return l;
}
function Xb(t, e) {
  var n = L(jp(t, e), 2), r = n[0], a = n[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, c = l.type, u = l.poses, f = l.splitter, d = u.map(function(S) {
    return S.pos;
  });
  if (c === "polygon")
    d.splice(s, 0, [r, a]);
  else if (c === "inset") {
    var h = Lb.indexOf(s), m = Fb.indexOf(s), v = u.length;
    if (Gb(u, d, 8, h, m, r, a, d[4][0], d[4][1], d[0][0], d[0][1]), v === u.length)
      return;
  } else
    return;
  var y = ql(t, o, d), b = "".concat(c, "(").concat(y.join(f), ")");
  pt(t, "onClip", Rt(t, e, O({ clipEventType: "added", clipType: c, poses: d, clipStyles: y, clipStyle: b, distX: 0, distY: 0 }, je({
    clipPath: b
  }, e))));
}
function Vb(t, e) {
  var n = e.datas, r = n.clipPath, a = n.clipIndex, i = r, o = i.type, s = i.poses, l = i.splitter, c = s.map(function(h) {
    return h.pos;
  }), u = c.length;
  if (o === "polygon")
    s.splice(a, 1), c.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (Bb(s, c, a, 8, u), u === s.length))
      return;
  } else
    return;
  var f = ql(t, r, c), d = "".concat(o, "(").concat(f.join(l), ")");
  pt(t, "onClip", Rt(t, e, O({ clipEventType: "removed", clipType: o, poses: c, clipStyles: f, clipStyle: d, distX: 0, distY: 0 }, je({
    clipPath: d
  }, e))));
}
var Kb = {
  name: "clippable",
  props: [
    "clippable",
    "defaultClipPath",
    "customClipPath",
    "keepRatio",
    "clipRelative",
    "clipArea",
    "dragWithClip",
    "clipTargetBounds",
    "clipVerticalGuidelines",
    "clipHorizontalGuidelines",
    "clipSnapThreshold"
  ],
  events: [
    "clipStart",
    "clip",
    "clipEnd"
  ],
  css: [
    `.control.clip-control {
background: #6d6;
cursor: pointer;
}
.control.clip-control.clip-radius {
background: #d66;
}
.line.clip-line {
background: #6e6;
cursor: move;
z-index: 1;
}
.clip-area {
position: absolute;
top: 0;
left: 0;
}
.clip-ellipse {
position: absolute;
cursor: move;
border: 1px solid #6d6;
border: var(--zoompx) solid #6d6;
border-radius: 50%;
transform-origin: 0px 0px;
}`,
    `:host {
--bounds-color: #d66;
}`,
    `.guideline {
pointer-events: none;
z-index: 2;
}`,
    `.line.guideline.bounds {
background: #d66;
background: var(--bounds-color);
}`
  ],
  render: function(t, e) {
    var n = t.props, r = n.customClipPath, a = n.defaultClipPath, i = n.clipArea, o = n.zoom, s = n.groupable, l = t.getState(), c = l.target, u = l.width, f = l.height, d = l.allMatrix, h = l.is3d, m = l.left, v = l.top, y = l.pos1, b = l.pos2, S = l.pos3, C = l.pos4, k = l.clipPathState, M = l.snapBoundInfos, E = l.rotation;
    if (!c || s)
      return [];
    var D = hd(c, u, f, a || "inset", k || r);
    if (!D)
      return [];
    var j = h ? 4 : 3, R = D.type, _ = D.poses, x = _.map(function(st) {
      var St = ee(d, st.pos, j);
      return [
        St[0] - m,
        St[1] - v
      ];
    }), P = [], I = [], A = R === "rect", B = R === "inset", q = R === "polygon";
    if (A || B || q) {
      var F = B ? x.slice(0, 8) : x;
      I = F.map(function(st, St) {
        var Pt = St === 0 ? F[F.length - 1] : F[St - 1], Tt = ae(Pt, st), vt = lh(Pt, st);
        return e.createElement("div", { key: "clipLine".concat(St), className: mt("line", "clip-line", "snap-control"), "data-clip-index": St, style: {
          width: "".concat(vt, "px"),
          transform: "translate(".concat(Pt[0], "px, ").concat(Pt[1], "px) rotate(").concat(Tt, "rad) scaleY(").concat(o, ")")
        } });
      });
    }
    if (P = x.map(function(st, St) {
      return e.createElement("div", { key: "clipControl".concat(St), className: mt("control", "clip-control", "snap-control"), "data-clip-index": St, style: {
        transform: "translate(".concat(st[0], "px, ").concat(st[1], "px) rotate(").concat(E, "rad) scale(").concat(o, ")")
      } });
    }), B && P.push.apply(P, ot([], L(x.slice(8).map(function(st, St) {
      return e.createElement("div", { key: "clipRadiusControl".concat(St), className: mt("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + St, style: {
        transform: "translate(".concat(st[0], "px, ").concat(st[1], "px) rotate(").concat(E, "rad) scale(").concat(o, ")")
      } });
    })), !1)), R === "circle" || R === "ellipse") {
      var N = D.left, W = D.top, V = D.radiusX, X = D.radiusY, J = L(bt(ee(d, [N, W], j), ee(d, [0, 0], j)), 2), et = J[0], at = J[1], Q = "none";
      if (!i) {
        for (var it = Math.max(10, V / 5, X / 5), ut = [], Z = 0; Z <= it; ++Z) {
          var dt = Math.PI * 2 / it * Z;
          ut.push([
            V + (V - o) * Math.cos(dt),
            X + (X - o) * Math.sin(dt)
          ]);
        }
        ut.push([V, -2]), ut.push([-2, -2]), ut.push([-2, X * 2 + 2]), ut.push([V * 2 + 2, X * 2 + 2]), ut.push([V * 2 + 2, -2]), ut.push([V, -2]), Q = "polygon(".concat(ut.map(function(st) {
          return "".concat(st[0], "px ").concat(st[1], "px");
        }).join(", "), ")");
      }
      P.push(e.createElement("div", { key: "clipEllipse", className: mt("clip-ellipse", "snap-control"), style: {
        width: "".concat(V * 2, "px"),
        height: "".concat(X * 2, "px"),
        clipPath: Q,
        transform: "translate(".concat(-m + et, "px, ").concat(-v + at, "px) ").concat(lo(d))
      } }));
    }
    if (i) {
      var ht = Ve(ot([y, b, S, C], L(x), !1)), tt = ht.width, ft = ht.height, Mt = ht.left, xt = ht.top;
      if (q || A || B) {
        var ut = B ? x.slice(0, 8) : x;
        P.push(e.createElement("div", { key: "clipArea", className: mt("clip-area", "snap-control"), style: {
          width: "".concat(tt, "px"),
          height: "".concat(ft, "px"),
          transform: "translate(".concat(Mt, "px, ").concat(xt, "px)"),
          clipPath: "polygon(".concat(ut.map(function(St) {
            return "".concat(St[0] - Mt, "px ").concat(St[1] - xt, "px");
          }).join(", "), ")")
        } }));
      }
    }
    return M && ["vertical", "horizontal"].forEach(function(st) {
      var St = M[st], Pt = st === "horizontal";
      St.isSnap && I.push.apply(I, ot([], L(St.snap.posInfos.map(function(Tt, vt) {
        var gt = Tt.pos, At = bt(ee(d, Pt ? [0, gt] : [gt, 0], j), [m, v]), _t = bt(ee(d, Pt ? [u, gt] : [gt, f], j), [m, v]);
        return ka(e, "", At, _t, o, "clip".concat(st, "snap").concat(vt), "guideline");
      })), !1)), St.isBound && I.push.apply(I, ot([], L(St.bounds.map(function(Tt, vt) {
        var gt = Tt.pos, At = bt(ee(d, Pt ? [0, gt] : [gt, 0], j), [m, v]), _t = bt(ee(d, Pt ? [u, gt] : [gt, f], j), [m, v]);
        return ka(e, "", At, _t, o, "clip".concat(st, "bounds").concat(vt), "guideline", "bounds", "bold");
      })), !1));
    }), ot(ot([], L(P), !1), L(I), !1);
  },
  dragControlCondition: function(t, e) {
    return e.inputEvent && (e.inputEvent.target.getAttribute("class") || "").indexOf("clip") > -1;
  },
  dragStart: function(t, e) {
    var n = t.props, r = n.dragWithClip, a = r === void 0 ? !0 : r;
    return a ? !1 : this.dragControlStart(t, e);
  },
  drag: function(t, e) {
    return this.dragControl(t, O(O({}, e), { isDragTarget: !0 }));
  },
  dragEnd: function(t, e) {
    return this.dragControlEnd(t, e);
  },
  dragControlStart: function(t, e) {
    var n = t.state, r = t.props, a = r.defaultClipPath, i = r.customClipPath, o = n.target, s = n.width, l = n.height, c = e.inputEvent ? e.inputEvent.target : null, u = c && c.getAttribute("class") || "", f = e.datas, d = hd(o, s, l, a || "inset", i);
    if (!d)
      return !1;
    var h = d.clipText, m = d.type, v = d.poses, y = pt(t, "onClipStart", Rt(t, e, {
      clipType: m,
      clipStyle: h,
      poses: v.map(function(b) {
        return b.pos;
      })
    }));
    return y === !1 ? (f.isClipStart = !1, !1) : (f.isControl = u && u.indexOf("clip-control") > -1, f.isLine = u.indexOf("clip-line") > -1, f.isArea = u.indexOf("clip-area") > -1 || u.indexOf("clip-ellipse") > -1, f.clipIndex = c ? parseInt(c.getAttribute("data-clip-index"), 10) : -1, f.clipPath = d, f.isClipStart = !0, n.clipPathState = h, fr(t, e), !0);
  },
  dragControl: function(t, e) {
    var n, r, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, c = l.isControl, u = l.isLine, f = l.isArea, d = l.clipIndex, h = l.clipPath;
    if (!h)
      return !1;
    var m = dr(t.props, "clippable"), v = m.keepRatio, y = 0, b = 0, S = o.draggable, C = xn(e);
    s && S ? (n = L(S.prevBeforeDist, 2), y = n[0], b = n[1]) : (r = L(C, 2), y = r[0], b = r[1]);
    var k = [y, b], M = t.state, E = M.width, D = M.height, j = !f && !c && !u, R = h.type, _ = h.poses, x = h.splitter, P = _.map(function(Ot) {
      return Ot.pos;
    });
    j && (y = -y, b = -b);
    var I = !c || _[d].direction === "nesw", A = R === "inset" || R === "rect", B = _.map(function() {
      return [0, 0];
    });
    if (c && !I) {
      var q = _[d], F = q.horizontal, N = q.vertical, W = [
        y * nt(F),
        b * nt(N)
      ];
      B = Hb(_, d, W, A, v);
    } else I && (B = P.map(function() {
      return [y, b];
    }));
    var V = P.map(function(Ot, qt) {
      return Bt(Ot, B[qt]);
    }), X = ot([], L(V), !1);
    M.snapBoundInfos = null;
    var J = h.type === "circle", et = h.type === "ellipse";
    if (J || et) {
      var at = Ve(V), Q = nt(at.bottom - at.top), it = nt(et ? at.right - at.left : Q), ut = V[0][1] + Q, Z = V[0][0] - it, dt = V[0][0] + it;
      J && (X.push([dt, at.bottom]), B.push([1, 0])), X.push([at.left, ut]), B.push([0, 1]), X.push([Z, at.bottom]), B.push([1, 0]);
    }
    var ht = nh((m.clipHorizontalGuidelines || []).map(function(Ot) {
      return Yt("".concat(Ot), D);
    }), (m.clipVerticalGuidelines || []).map(function(Ot) {
      return Yt("".concat(Ot), E);
    }), E, D), tt = [], ft = [];
    if (J || et)
      tt = [X[4][0], X[2][0]], ft = [X[1][1], X[3][1]];
    else if (A) {
      var Mt = [X[0], X[2], X[4], X[6]], xt = [B[0], B[2], B[4], B[6]];
      tt = Mt.filter(function(Ot, qt) {
        return xt[qt][0];
      }).map(function(Ot) {
        return Ot[0];
      }), ft = Mt.filter(function(Ot, qt) {
        return xt[qt][1];
      }).map(function(Ot) {
        return Ot[1];
      });
    } else
      tt = X.filter(function(Ot, qt) {
        return B[qt][0];
      }).map(function(Ot) {
        return Ot[0];
      }), ft = X.filter(function(Ot, qt) {
        return B[qt][1];
      }).map(function(Ot) {
        return Ot[1];
      });
    var st = [0, 0], St = Ju(ht, m.clipTargetBounds && { left: 0, top: 0, right: E, bottom: D }, tt, ft, 5, 5), Pt = St.horizontal, Tt = St.vertical, vt = Pt.offset, gt = Tt.offset;
    if (Pt.isBound && (st[1] += vt), Tt.isBound && (st[0] += gt), (et || J) && B[0][0] === 0 && B[0][1] === 0) {
      var at = Ve(V), At = at.bottom - at.top, _t = et ? at.right - at.left : At, Xt = Tt.isBound ? nt(gt) : Tt.snapIndex === 0 ? -gt : gt, Nt = Pt.isBound ? nt(vt) : Pt.snapIndex === 0 ? -vt : vt;
      _t -= Xt, At -= Nt, J && (At = Kp(Tt, Pt) > 0 ? At : _t, _t = At);
      var Ft = X[0];
      X[1][1] = Ft[1] - At, X[2][0] = Ft[0] + _t, X[3][1] = Ft[1] + At, X[4][0] = Ft[0] - _t;
    } else if (A && v && c) {
      var Ct = L(Mh(_), 2), Jt = Ct[0], Me = Ct[1], De = Jt && Me ? Jt / Me : 0, In = _[d], Ze = In.direction || "", Qt = X[1][1], ut = X[5][1], Z = X[7][0], dt = X[3][0];
      nt(vt) <= nt(gt) ? vt = _e(vt) * nt(gt) / De : gt = _e(gt) * nt(vt) * De, Ze.indexOf("w") > -1 ? Z -= gt : Ze.indexOf("e") > -1 ? dt -= gt : (Z += gt / 2, dt -= gt / 2), Ze.indexOf("n") > -1 ? Qt -= vt : Ze.indexOf("s") > -1 ? ut -= vt : (Qt += vt / 2, ut -= vt / 2);
      var ye = Ki(Qt, dt, ut, Z);
      X.forEach(function(Qe, Be) {
        var de;
        de = L(ye[Be].pos, 2), Qe[0] = de[0], Qe[1] = de[1];
      });
    } else
      X.forEach(function(Ot, qt) {
        var Fe = B[qt];
        Fe[0] && (Ot[0] -= gt), Fe[1] && (Ot[1] -= vt);
      });
    var be = ql(t, h, V), fn = "".concat(R, "(").concat(be.join(x), ")");
    if (M.clipPathState = fn, J || et)
      tt = [X[4][0], X[2][0]], ft = [X[1][1], X[3][1]];
    else if (A) {
      var Mt = [X[0], X[2], X[4], X[6]];
      tt = Mt.map(function(qt) {
        return qt[0];
      }), ft = Mt.map(function(qt) {
        return qt[1];
      });
    } else
      tt = X.map(function(Ot) {
        return Ot[0];
      }), ft = X.map(function(Ot) {
        return Ot[1];
      });
    if (M.snapBoundInfos = Ju(ht, m.clipTargetBounds && { left: 0, top: 0, right: E, bottom: D }, tt, ft, 1, 1), S) {
      var Je = M.is3d, pn = M.allMatrix, he = Je ? 4 : 3, yn = st;
      s && (yn = [
        k[0] + st[0] - C[0],
        k[1] + st[1] - C[1]
      ]), S.deltaOffset = Ht(pn, [yn[0], yn[1], 0, 0], he);
    }
    return pt(t, "onClip", Rt(t, e, O({ clipEventType: "changed", clipType: R, poses: V, clipStyle: fn, clipStyles: be, distX: y, distY: b }, je((a = {}, a[R === "rect" ? "clip" : "clipPath"] = fn, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var n = e.isDrag, r = e.datas, a = e.isDouble, i = r.isLine, o = r.isClipStart, s = r.isControl;
    return o ? (pt(t, "onClipEnd", Le(t, e, {})), a && (s ? Vb(t, e) : i && Xb(t, e)), a || n) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, qb = {
  name: "originDraggable",
  props: [
    "originDraggable",
    "originRelative"
  ],
  events: [
    "dragOriginStart",
    "dragOrigin",
    "dragOriginEnd"
  ],
  css: [
    `:host[data-able-origindraggable] .control.origin {
pointer-events: auto;
}`
  ],
  dragControlCondition: function(t, e) {
    return e.isRequest ? e.requestAble === "originDraggable" : ue(e.inputEvent.target, mt("origin"));
  },
  dragControlStart: function(t, e) {
    var n = e.datas;
    fr(t, e);
    var r = Rt(t, e, {
      dragStart: Te.dragStart(t, new Rr().dragStart([0, 0], e))
    }), a = pt(t, "onDragOriginStart", r);
    return n.startOrigin = t.state.transformOrigin, n.startTargetOrigin = t.state.targetOrigin, n.prevOrigin = [0, 0], n.isDragOrigin = !0, a === !1 ? (n.isDragOrigin = !1, !1) : r;
  },
  dragControl: function(t, e) {
    var n = e.datas, r = e.isPinch, a = e.isRequest;
    if (!n.isDragOrigin)
      return !1;
    var i = L(xn(e), 2), o = i[0], s = i[1], l = t.state, c = l.width, u = l.height, f = l.offsetMatrix, d = l.targetMatrix, h = l.is3d, m = t.props.originRelative, v = m === void 0 ? !0 : m, y = h ? 4 : 3, b = [o, s];
    if (a) {
      var S = e.distOrigin;
      (S[0] || S[1]) && (b = S);
    }
    var C = Bt(n.startOrigin, b), k = Bt(n.startTargetOrigin, b), M = bt(b, n.prevOrigin), E = Na(f, d, C, y), D = t.getRect(), j = Ve(pr(E, c, u, y)), R = [
      D.left - j.left,
      D.top - j.top
    ];
    n.prevOrigin = b;
    var _ = [
      on(k[0], c, v),
      on(k[1], u, v)
    ].join(" "), x = Te.drag(t, Pa(e, t.state, R, !!r)), P = Rt(t, e, O(O({ width: c, height: u, origin: C, dist: b, delta: M, transformOrigin: _, drag: x }, je({
      transformOrigin: _,
      transform: x.transform
    }, e)), { afterTransform: x.transform }));
    return pt(t, "onDragOrigin", P), P;
  },
  dragControlEnd: function(t, e) {
    var n = e.datas;
    return n.isDragOrigin ? (pt(t, "onDragOriginEnd", Le(t, e, {})), !0) : !1;
  },
  dragGroupControlCondition: function(t, e) {
    return this.dragControlCondition(t, e);
  },
  dragGroupControlStart: function(t, e) {
    var n = this.dragControlStart(t, e);
    return !!n;
  },
  dragGroupControl: function(t, e) {
    var n = this.dragControl(t, e);
    return n ? (t.transformOrigin = n.transformOrigin, !0) : !1;
  },
  /**
      * @method Moveable.OriginDraggable#request
      * @param {object} e - the OriginDraggable's request parameter
      * @param {number} [e.x] - x position
      * @param {number} [e.y] - y position
      * @param {number} [e.deltaX] - x number to move
      * @param {number} [e.deltaY] - y number to move
      * @param {array} [e.deltaOrigin] - left, top number to move transform-origin
      * @param {array} [e.origin] - transform-origin position
      * @param {number} [e.isInstant] - Whether to execute the request instantly
      * @return {Moveable.Requester} Moveable Requester
      * @example
  
      * // Instantly Request (requestStart - request - requestEnd)
      * // Use Relative Value
      * moveable.request("originDraggable", { deltaX: 10, deltaY: 10 }, true);
      * // Use Absolute Value
      * moveable.request("originDraggable", { x: 200, y: 100 }, true);
      * // Use Transform Value
      * moveable.request("originDraggable", { deltaOrigin: [10, 0] }, true);
      * moveable.request("originDraggable", { origin: [100, 0] }, true);
      * // requestStart
      * const requester = moveable.request("originDraggable");
      *
      * // request
      * // Use Relative Value
      * requester.request({ deltaX: 10, deltaY: 10 });
      * requester.request({ deltaX: 10, deltaY: 10 });
      * requester.request({ deltaX: 10, deltaY: 10 });
      * // Use Absolute Value
      * moveable.request("originDraggable", { x: 200, y: 100 });
      * moveable.request("originDraggable", { x: 220, y: 100 });
      * moveable.request("originDraggable", { x: 240, y: 100 });
      *
      * // requestEnd
      * requester.requestEnd();
      */
  request: function(t) {
    var e = {}, n = t.getRect(), r = 0, a = 0, i = n.transformOrigin, o = [0, 0];
    return {
      isControl: !0,
      requestStart: function() {
        return { datas: e };
      },
      request: function(s) {
        return "deltaOrigin" in s ? (o[0] += s.deltaOrigin[0], o[1] += s.deltaOrigin[1]) : "origin" in s ? (o[0] = s.origin[0] - i[0], o[1] = s.origin[1] - i[1]) : ("x" in s ? r = s.x - n.left : "deltaX" in s && (r += s.deltaX), "y" in s ? a = s.y - n.top : "deltaY" in s && (a += s.deltaY)), { datas: e, distX: r, distY: a, distOrigin: o };
      },
      requestEnd: function() {
        return { datas: e, isDrag: !0 };
      }
    };
  }
};
function Ub(t, e, n, r) {
  var a = t.filter(function(l) {
    var c = l.virtual, u = l.horizontal;
    return u && !c;
  }).length, i = t.filter(function(l) {
    var c = l.virtual, u = l.vertical;
    return u && !c;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    Zb(t, o), o < 4 ? s.pos[0] = n : s.pos[1] = r;
  }
}
function Zb(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(n) {
    n.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(n) {
    n.virtual = !1;
  }));
}
function Jb(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(n) {
    n.virtual = !0;
  }) : t.slice(e).forEach(function(n) {
    n.virtual = !0;
  });
}
function gd(t, e, n, r, a) {
  r === void 0 && (r = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = Yn(t), Eh(i, e, n, 0, 0, r, a);
}
function vd(t, e, n, r, a) {
  var i = t.state, o = i.width, s = i.height, l = Kl(a, t.props.roundRelative, o, s), c = l.raws, u = l.styles, f = l.radiusPoses, d = $b(f, c), h = d.horizontals, m = d.verticals, v = u.join(" ");
  i.borderRadiusState = v;
  var y = Rt(t, e, O({ horizontals: h, verticals: m, borderRadius: v, width: o, height: s, delta: r, dist: n }, je({
    borderRadius: v
  }, e)));
  return pt(t, "onRound", y), y;
}
function md(t) {
  var e, n, r = t.getState().style, a = r.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (n = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && n !== void 0 ? n : "", r.borderRadius = a) : (a = Wl(o).borderRadius, r.borderRadius = a));
  }
  return a;
}
var Qb = {
  name: "roundable",
  props: [
    "roundable",
    "roundRelative",
    "minRoundControls",
    "maxRoundControls",
    "roundClickable",
    "roundPadding",
    "isDisplayShadowRoundControls"
  ],
  events: [
    "roundStart",
    "round",
    "roundEnd",
    "roundGroupStart",
    "roundGroup",
    "roundGroupEnd"
  ],
  css: [
    `.control.border-radius {
background: #d66;
cursor: pointer;
z-index: 3;
}`,
    `.control.border-radius.vertical {
background: #d6d;
z-index: 2;
}`,
    `.control.border-radius.virtual {
opacity: 0.5;
z-index: 1;
}`,
    `:host.round-line-clickable .line.direction {
cursor: pointer;
}`
  ],
  className: function(t) {
    var e = t.props.roundClickable;
    return e === !0 || e === "line" ? mt("round-line-clickable") : "";
  },
  requestStyle: function() {
    return ["borderRadius"];
  },
  requestChildStyle: function() {
    return ["borderRadius"];
  },
  render: function(t, e) {
    var n = t.getState(), r = n.target, a = n.width, i = n.height, o = n.allMatrix, s = n.is3d, l = n.left, c = n.top, u = n.borderRadiusState, f = t.props, d = f.minRoundControls, h = d === void 0 ? [0, 0] : d, m = f.maxRoundControls, v = m === void 0 ? [4, 4] : m, y = f.zoom, b = f.roundPadding, S = b === void 0 ? 0 : b, C = f.isDisplayShadowRoundControls, k = f.groupable;
    if (!r)
      return null;
    var M = u || md(t), E = s ? 4 : 3, D = gd(M, a, i, h, !0);
    if (!D)
      return null;
    var j = 0, R = 0, _ = k ? [0, 0] : [l, c];
    return D.map(function(x, P) {
      var I = x.horizontal, A = x.vertical, B = x.direction || "", q = ot([], L(x.pos), !1);
      R += Math.abs(I), j += Math.abs(A), I && B.indexOf("n") > -1 && (q[1] -= S), A && B.indexOf("w") > -1 && (q[0] -= S), I && B.indexOf("s") > -1 && (q[1] += S), A && B.indexOf("e") > -1 && (q[0] += S);
      var F = bt(ee(o, q, E), _), N = C && C !== "horizontal", W = x.vertical ? j <= v[1] && (N || !x.virtual) : R <= v[0] && (C || !x.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(P), className: mt("control", "border-radius", x.vertical ? "vertical" : "", x.virtual ? "virtual" : ""), "data-radius-index": P, style: {
        display: W ? "block" : "none",
        transform: "translate(".concat(F[0], "px, ").concat(F[1], "px) scale(").concat(y, ")")
      } });
    });
  },
  dragControlCondition: function(t, e) {
    if (!e.inputEvent || e.isRequest)
      return !1;
    var n = e.inputEvent.target.getAttribute("class") || "";
    return n.indexOf("border-radius") > -1 || n.indexOf("moveable-line") > -1 && n.indexOf("moveable-direction") > -1;
  },
  dragGroupControlCondition: function(t, e) {
    return this.dragControlCondition(t, e);
  },
  dragControlStart: function(t, e) {
    var n = e.inputEvent, r = e.datas, a = n.target, i = a.getAttribute("class") || "", o = i.indexOf("border-radius") > -1, s = i.indexOf("moveable-line") > -1 && i.indexOf("moveable-direction") > -1, l = o ? parseInt(a.getAttribute("data-radius-index"), 10) : -1, c = -1;
    if (s) {
      var u = a.getAttribute("data-line-key") || "";
      u && (c = parseInt(u.replace(/render-line-/g, ""), 10), isNaN(c) && (c = -1));
    }
    if (!o && !s)
      return !1;
    var f = Rt(t, e, {}), d = pt(t, "onRoundStart", f);
    if (d === !1)
      return !1;
    r.lineIndex = c, r.controlIndex = l, r.isControl = o, r.isLine = s, fr(t, e);
    var h = t.props, m = h.roundRelative, v = h.minRoundControls, y = v === void 0 ? [0, 0] : v, b = t.state, S = b.width, C = b.height;
    r.isRound = !0, r.prevDist = [0, 0];
    var k = md(t), M = gd(k || "", S, C, y, !0) || [];
    return r.controlPoses = M, b.borderRadiusState = Kl(M, m, S, C).styles.join(" "), f;
  },
  dragControl: function(t, e) {
    var n = e.datas, r = n.controlPoses;
    if (!n.isRound || !n.isControl || !r.length)
      return !1;
    var a = n.controlIndex, i = L(xn(e), 2), o = i[0], s = i[1], l = [o, s], c = bt(l, n.prevDist), u = t.props.maxRoundControls, f = u === void 0 ? [4, 4] : u, d = t.state, h = d.width, m = d.height, v = r[a], y = v.vertical, b = v.horizontal, S = r.map(function(k) {
      var M = k.horizontal, E = k.vertical, D = [
        M * b * l[0],
        E * y * l[1]
      ];
      if (M) {
        if (f[0] === 1)
          return D;
        if (f[0] < 4 && M !== b)
          return D;
      } else {
        if (f[1] === 0)
          return D[1] = E * b * l[0] / h * m, D;
        if (y) {
          if (f[1] === 1)
            return D;
          if (f[1] < 4 && E !== y)
            return D;
        }
      }
      return [0, 0];
    });
    S[a] = l;
    var C = r.map(function(k, M) {
      return O(O({}, k), { pos: Bt(k.pos, S[M]) });
    });
    return a < 4 ? C.slice(0, a + 1).forEach(function(k) {
      k.virtual = !1;
    }) : C.slice(4, a + 1).forEach(function(k) {
      k.virtual = !1;
    }), n.prevDist = [o, s], vd(t, e, l, c, C);
  },
  dragControlEnd: function(t, e) {
    var n = t.state;
    n.borderRadiusState = "";
    var r = e.datas, a = e.isDouble;
    if (!r.isRound)
      return !1;
    var i = r.isControl, o = r.controlIndex, s = r.isLine, l = r.lineIndex, c = r.controlPoses, u = c.filter(function(b) {
      var S = b.virtual;
      return S;
    }).length, f = t.props.roundClickable, d = f === void 0 ? !0 : f;
    if (a && d) {
      if (i && (d === !0 || d === "control"))
        Jb(c, o);
      else if (s && (d === !0 || d === "line")) {
        var h = L(jp(t, e), 2), m = h[0], v = h[1];
        Ub(c, l, m, v);
      }
      u !== c.filter(function(b) {
        var S = b.virtual;
        return S;
      }).length && vd(t, e, [0, 0], [0, 0], c);
    }
    var y = Le(t, e, {});
    return pt(t, "onRoundEnd", y), n.borderRadiusState = "", y;
  },
  dragGroupControlStart: function(t, e) {
    var n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var r = t.moveables, a = t.props.targets, i = cn(t, "roundable", e), o = O({ targets: t.props.targets, events: i.map(function(s, l) {
      return O(O({}, s), { target: a[l], moveable: r[l], currentTarget: r[l] });
    }) }, n);
    return pt(t, "onRoundGroupStart", o), n;
  },
  dragGroupControl: function(t, e) {
    var n = this.dragControl(t, e);
    if (!n)
      return !1;
    var r = t.moveables, a = t.props.targets, i = cn(t, "roundable", e), o = O({ targets: t.props.targets, events: i.map(function(s, l) {
      return O(O(O({}, s), { target: a[l], moveable: r[l], currentTarget: r[l] }), je({
        borderRadius: n.borderRadius
      }, s));
    }) }, n);
    return pt(t, "onRoundGroup", o), o;
  },
  dragGroupControlEnd: function(t, e) {
    var n = t.moveables, r = t.props.targets, a = cn(t, "roundable", e);
    co(t, "onRound", function(s) {
      var l = O({ targets: t.props.targets, events: a.map(function(c, u) {
        return O(O(O({}, c), { target: r[u], moveable: n[u], currentTarget: n[u] }), je({
          borderRadius: s.borderRadius
        }, c));
      }) }, s);
      pt(t, "onRoundGroup", l);
    });
    var i = this.dragControlEnd(t, e);
    if (!i)
      return !1;
    var o = O({ targets: t.props.targets, events: a.map(function(s, l) {
      var c;
      return O(O({}, s), { target: r[l], moveable: n[l], currentTarget: n[l], lastEvent: (c = s.datas) === null || c === void 0 ? void 0 : c.lastEvent });
    }) }, i);
    return pt(t, "onRoundGroupEnd", o), o;
  },
  unset: function(t) {
    t.state.borderRadiusState = "";
  }
};
function t1(t, e) {
  var n = e ? 4 : 3, r = Ut(n), a = "matrix".concat(e ? "3d" : "", "(").concat(r.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var Dh = {
  isPinch: !0,
  name: "beforeRenderable",
  props: [],
  events: [
    "beforeRenderStart",
    "beforeRender",
    "beforeRenderEnd",
    "beforeRenderGroupStart",
    "beforeRenderGroup",
    "beforeRenderGroupEnd"
  ],
  dragRelation: "weak",
  setTransform: function(t, e) {
    var n = t.state, r = n.is3d, a = n.targetMatrix, i = n.inlineTransform, o = r ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(vp(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = t1(s, r) ? [] : Yn(s);
  },
  resetStyle: function(t) {
    var e = t.datas;
    e.nextStyle = {}, e.nextTransforms = t.datas.startTransforms, e.nextTransformAppendedIndexes = [];
  },
  fillDragStartParams: function(t, e) {
    return Rt(t, e, {
      setTransform: function(n) {
        e.datas.startTransforms = re(n) ? n : Yn(n);
      },
      isPinch: !!e.isPinch
    });
  },
  fillDragParams: function(t, e) {
    return Rt(t, e, {
      isPinch: !!e.isPinch
    });
  },
  dragStart: function(t, e) {
    this.setTransform(t, e), this.resetStyle(e), pt(t, "onBeforeRenderStart", this.fillDragStartParams(t, e));
  },
  drag: function(t, e) {
    e.datas.startTransforms || this.setTransform(t, e), this.resetStyle(e), pt(t, "onBeforeRender", Rt(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  dragEnd: function(t, e) {
    e.datas.startTransforms || (this.setTransform(t, e), this.resetStyle(e)), pt(t, "onBeforeRenderEnd", Rt(t, e, {
      isPinch: !!e.isPinch,
      isDrag: e.isDrag
    }));
  },
  dragGroupStart: function(t, e) {
    var n = this;
    this.dragStart(t, e);
    var r = cn(t, "beforeRenderable", e), a = t.moveables, i = r.map(function(o, s) {
      var l = a[s];
      return n.setTransform(l, o), n.resetStyle(o), n.fillDragStartParams(l, o);
    });
    pt(t, "onBeforeRenderGroupStart", Rt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets,
      setTransform: function() {
      },
      events: i
    }));
  },
  dragGroup: function(t, e) {
    var n = this;
    this.drag(t, e);
    var r = cn(t, "beforeRenderable", e), a = t.moveables, i = r.map(function(o, s) {
      var l = a[s];
      return n.resetStyle(o), n.fillDragParams(l, o);
    });
    pt(t, "onBeforeRenderGroup", Rt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets,
      events: i
    }));
  },
  dragGroupEnd: function(t, e) {
    this.dragEnd(t, e), pt(t, "onBeforeRenderGroupEnd", Rt(t, e, {
      isPinch: !!e.isPinch,
      isDrag: e.isDrag,
      targets: t.props.targets
    }));
  },
  dragControlStart: function(t, e) {
    return this.dragStart(t, e);
  },
  dragControl: function(t, e) {
    return this.drag(t, e);
  },
  dragControlEnd: function(t, e) {
    return this.dragEnd(t, e);
  },
  dragGroupControlStart: function(t, e) {
    return this.dragGroupStart(t, e);
  },
  dragGroupControl: function(t, e) {
    return this.dragGroup(t, e);
  },
  dragGroupControlEnd: function(t, e) {
    return this.dragGroupEnd(t, e);
  }
}, Th = {
  name: "renderable",
  props: [],
  events: [
    "renderStart",
    "render",
    "renderEnd",
    "renderGroupStart",
    "renderGroup",
    "renderGroupEnd"
  ],
  dragRelation: "weak",
  dragStart: function(t, e) {
    pt(t, "onRenderStart", Rt(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  drag: function(t, e) {
    pt(t, "onRender", this.fillDragParams(t, e));
  },
  dragAfter: function(t, e) {
    return this.drag(t, e);
  },
  dragEnd: function(t, e) {
    pt(t, "onRenderEnd", this.fillDragEndParams(t, e));
  },
  dragGroupStart: function(t, e) {
    pt(t, "onRenderGroupStart", Rt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets
    }));
  },
  dragGroup: function(t, e) {
    var n = this, r = cn(t, "beforeRenderable", e), a = t.moveables, i = r.map(function(o, s) {
      var l = a[s];
      return n.fillDragParams(l, o);
    });
    pt(t, "onRenderGroup", Rt(t, e, O(O({ isPinch: !!e.isPinch, targets: t.props.targets, transform: ui(e), transformObject: {} }, je(di(e))), { events: i })));
  },
  dragGroupEnd: function(t, e) {
    var n = this, r = cn(t, "beforeRenderable", e), a = t.moveables, i = r.map(function(o, s) {
      var l = a[s];
      return n.fillDragEndParams(l, o);
    });
    pt(t, "onRenderGroupEnd", Rt(t, e, O({ isPinch: !!e.isPinch, isDrag: e.isDrag, targets: t.props.targets, events: i, transformObject: {}, transform: ui(e) }, je(di(e)))));
  },
  dragControlStart: function(t, e) {
    return this.dragStart(t, e);
  },
  dragControl: function(t, e) {
    return this.drag(t, e);
  },
  dragControlAfter: function(t, e) {
    return this.dragAfter(t, e);
  },
  dragControlEnd: function(t, e) {
    return this.dragEnd(t, e);
  },
  dragGroupControlStart: function(t, e) {
    return this.dragGroupStart(t, e);
  },
  dragGroupControl: function(t, e) {
    return this.dragGroup(t, e);
  },
  dragGroupControlEnd: function(t, e) {
    return this.dragGroupEnd(t, e);
  },
  fillDragParams: function(t, e) {
    var n = {};
    return Ir(Gi(e) || []).forEach(function(r) {
      n[r.name] = r.functionValue;
    }), Rt(t, e, O({ isPinch: !!e.isPinch, transformObject: n, transform: ui(e) }, je(di(e))));
  },
  fillDragEndParams: function(t, e) {
    var n = {};
    return Ir(Gi(e) || []).forEach(function(r) {
      n[r.name] = r.functionValue;
    }), Rt(t, e, O({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: n, transform: ui(e) }, je(di(e))));
  }
};
function pa(t, e, n, r, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", c = a === "After", u = t.state.target, f = i.isRequest, d = r.indexOf("Control") > -1;
  if (!u || s && d && !f && t.areaElement === i.inputEvent.target)
    return !1;
  var h = ot([], L(e), !1);
  if (f) {
    var m = i.requestAble;
    h.some(function(P) {
      return P.name === m;
    }) || h.push.apply(h, ot([], L(t.props.ables.filter(function(P) {
      return P.name === m;
    })), !1));
  }
  if (!h.length || h.every(function(P) {
    return P.dragRelation;
  }))
    return !1;
  var v = i.inputEvent, y;
  l && v && (y = document.elementFromPoint(i.clientX, i.clientY) || v.target);
  var b = !1, S = function() {
    var P;
    b = !0, (P = i.stop) === null || P === void 0 || P.call(i);
  }, C = s && (!t.targetGesto || !t.controlGesto || !t.targetGesto.isFlag() || !t.controlGesto.isFlag());
  C && t.updateRect(a, !0, !1);
  var k = i.datas, M = d ? "controlGesto" : "targetGesto", E = t[M], D = function(P, I, A) {
    if (!(I in P) || E !== t[M])
      return !1;
    var B = P.name, q = k[B] || (k[B] = {});
    if (s && (q.isEventStart = !A || !P[A] || P[A](t, i)), !q.isEventStart)
      return !1;
    var F = P[I](t, O(O({}, i), { stop: S, datas: q, originalDatas: k, inputTarget: y }));
    return t._emitter.off(), s && F === !1 && (q.isEventStart = !1), F;
  };
  C && h.forEach(function(P) {
    P.unset && P.unset(t);
  }), D(Dh, "drag".concat(r).concat(a));
  var j = 0, R = 0;
  n.forEach(function(P) {
    if (b)
      return !1;
    var I = "".concat(P).concat(r).concat(a), A = "".concat(P).concat(r, "Condition");
    a === "" && !f && Cb(t.state, i);
    var B = h.filter(function(N) {
      return N[I];
    });
    B = B.filter(function(N, W) {
      return N.name && B.indexOf(N) === W;
    });
    var q = B.filter(function(N) {
      return D(N, I, A);
    }), F = q.length;
    b && ++j, F && ++R, !b && s && B.length && !F && (j += B.filter(function(N) {
      var W = N.name, V = k[W];
      return V.isEventStart ? N.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!c || R) && D(Th, "drag".concat(r).concat(a));
  var _ = E !== t[M] || j === n.length;
  if ((l || b || _) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(P) {
    P.state.gestos = {};
  }), h.forEach(function(P) {
    P.unset && P.unset(t);
  })), s && !_ && !f && R && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || _)
    return !1;
  if (!s && R && !o || l) {
    var x = t.props.flushSync || ih;
    x(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !c && R && !o && pa(t, e, n, r, a + "After", i), !0;
}
function Ul(t, e) {
  return function(n, r) {
    var a;
    r === void 0 && (r = n.inputEvent.target);
    var i = r, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || ue(i, "moveable-area") || ue(i, "moveable-padding") || ue(i, "moveable-edgeDraggable");
  };
}
function _h(t, e, n) {
  var r = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(r), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var c = Ul(t);
  return Ih(t, a, "targetAbles", n, {
    dragStart: c,
    pinchStart: c
  });
}
function jh(t, e) {
  var n = t.controlBox, r = [];
  r.push(n);
  var a = Ul(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === n)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return Ih(t, r, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function Ih(t, e, n, r, a) {
  a === void 0 && (a = {});
  var i = n === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, c = o.preventClickEventOnDrag, u = o.preventClickDefault, f = o.checkInput, d = o.dragFocusedInput, h = o.preventDefault, m = h === void 0 ? !0 : h, v = o.preventRightClick, y = v === void 0 ? !0 : v, b = o.preventWheelClick, S = b === void 0 ? !0 : b, C = o.dragContainer, k = mn(C, !0), M = {
    preventDefault: m,
    preventRightClick: y,
    preventWheelClick: S,
    container: k || Xe(t.getControlBoxElement()),
    pinchThreshold: l,
    pinchOutside: s,
    preventClickEventOnDrag: i ? c : !1,
    preventClickEventOnDragStart: i ? u : !1,
    preventClickEventByCondition: i ? null : function(j) {
      return t.controlBox.contains(j.target);
    },
    checkInput: i ? f : !1,
    dragFocusedInput: d
  }, E = new Sp(e, M), D = r === "Control";
  return ["drag", "pinch"].forEach(function(j) {
    ["Start", "", "End"].forEach(function(R) {
      E.on("".concat(j).concat(R), function(_) {
        var x, P = _.eventType, I = j === "drag" && _.isPinch;
        if (a[P] && !a[P](_)) {
          _.stop();
          return;
        }
        if (!I) {
          var A = j === "drag" ? [j] : ["drag", j], B = ot([], L(t[n]), !1), q = pa(t, B, A, r, R, _);
          q ? (t.props.stopPropagation || R === "Start" && D) && ((x = _ == null ? void 0 : _.inputEvent) === null || x === void 0 || x.stopPropagation()) : _.stop();
        }
      });
    });
  }), E;
}
var e1 = /* @__PURE__ */ (function() {
  function t(e, n, r) {
    var a = this;
    this.target = e, this.moveable = n, this.eventName = r, this.ables = [], this._onEvent = function(i) {
      var o = a.eventName, s = a.moveable;
      s.state.disableNativeEvent || a.ables.forEach(function(l) {
        l[o](s, {
          inputEvent: i
        });
      });
    }, e.addEventListener(r.toLowerCase(), this._onEvent);
  }
  return t.prototype.setAbles = function(e) {
    this.ables = e;
  }, t.prototype.destroy = function() {
    this.target.removeEventListener(this.eventName.toLowerCase(), this._onEvent), this.target = null, this.moveable = null;
  }, t;
})();
function n1(t, e, n, r) {
  var a;
  n === void 0 && (n = e);
  var i = Ap(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, c = i.transformOrigin, u = i.targetOrigin, f = i.offsetContainer, d = i.hasFixed, h = i.zoom, m = vy(f, n), v = m.matrixes, y = m.is3d, b = m.offsetContainer, S = m.zoom, C = r, k = 4, M = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, E = l, D = Ut(k), j = Ut(k), R = Ut(k), _ = Ut(k), x = o.length, P = v.map(function(W) {
    return O(O({}, W), { matrix: W.matrix ? ot([], L(W.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && C && (E = dn(E, 3, 4), Bs(o)), !y && C && Bs(P), P.forEach(function(W) {
    j = Ht(j, W.matrix, k);
  });
  var I = n || Kn(t), A = ((a = P[0]) === null || a === void 0 ? void 0 : a.target) || Ea(I, I, !0).offsetParent, B = P.slice(1).reduce(function(W, V) {
    return Ht(W, V.matrix, k);
  }, Ut(k));
  o.forEach(function(W, V) {
    if (x - 2 === V && (R = D.slice()), x - 1 === V && (_ = D.slice()), !W.matrix) {
      var X = o[V + 1], J = yb(W, X, A, k, Ht(B, D, k));
      W.matrix = cr(J, k);
    }
    D = Ht(D, W.matrix, k);
  });
  var q = !M && s;
  E || (E = Ut(q ? 4 : 3));
  var F = lo(M && E.length === 16 ? dn(E, 4, 3) : E, q), N = j;
  return j = hp(j, k, k), {
    hasZoom: h !== 1 || S !== 1,
    hasFixed: d,
    matrixes: o,
    rootMatrix: j,
    originalRootMatrix: N,
    beforeMatrix: R,
    offsetMatrix: _,
    allMatrix: D,
    targetMatrix: E,
    targetTransform: F,
    inlineTransform: t.style.transform,
    transformOrigin: c,
    targetOrigin: u,
    is3d: C,
    offsetContainer: f,
    offsetRootContainer: b
  };
}
function r1(t, e, n, r) {
  n === void 0 && (n = e);
  var a = 0, i = 0, o = 0, s = {}, l = ch(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var c = n1(t, e, n, r), u = Tr(c.allMatrix, c.transformOrigin, a, i);
    s = O(O({}, c), u);
    var f = Tr(c.allMatrix, [50, 50], 100, 100);
    o = uh([f.pos1, f.pos2], f.direction);
  }
  var d = 4;
  return O(O(O({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: Ut(d), rootMatrix: Ut(d), beforeMatrix: Ut(d), offsetMatrix: Ut(d), allMatrix: Ut(d), targetMatrix: Ut(d), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function Ys(t, e, n, r, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = pi(), c = pi(), u = pi(), f = pi(), d = [0, 0], h = {}, m = r1(e, n, a, !0);
  if (e) {
    var v = Ne(e);
    i.forEach(function(P) {
      h[P] = v(P);
    });
    var y = m.is3d ? 4 : 3, b = Tr(m.offsetMatrix, Bt(m.transformOrigin, gp(m.targetMatrix, y)), m.width, m.height);
    o = b.direction, s = Bt(b.origin, [b.left - m.left, b.top - m.top]), f = fa(m.offsetRootContainer);
    var S = Ea(r, r, !0).offsetParent || m.offsetRootContainer;
    if (m.hasZoom) {
      var C = Tr(Ht(m.originalRootMatrix, m.allMatrix), m.transformOrigin, m.width, m.height), k = Tr(m.originalRootMatrix, Hi(Ne(S)("transformOrigin")).map(function(P) {
        return parseFloat(P);
      }), S.offsetWidth, S.offsetHeight);
      if (l = Uo(C, f), u = Uo(k, f, S, !0), t) {
        var M = C.left, E = C.top;
        c = Uo({
          left: M,
          top: E,
          bottom: E,
          right: E
        }, f);
      }
    } else {
      l = fa(e), u = gy(S), t && (c = fa(t));
      var D = u.left, j = u.top, R = u.clientLeft, _ = u.clientTop, x = [
        l.left - D,
        l.top - j
      ];
      d = bt(Or(m.rootMatrix, x, 4), [R + m.left, _ + m.top]);
    }
  }
  return O({ targetClientRect: l, containerClientRect: u, moveableClientRect: c, rootContainerClientRect: f, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: h, offsetDelta: d }, m);
}
function xd(t) {
  var e = t.pos1, n = t.pos2, r = t.pos3, a = t.pos4;
  if (!e || !n || !r || !a)
    return null;
  var i = ur([e, n, r, a]), o = [i.minX, i.minY], s = bt(t.origin, o);
  return e = bt(e, o), n = bt(n, o), r = bt(r, o), a = bt(a, o), O(O({}, t), {
    left: t.left,
    top: t.top,
    posDelta: o,
    pos1: e,
    pos2: n,
    pos3: r,
    pos4: a,
    origin: s,
    beforeOrigin: s,
    // originalBeforeOrigin: origin,
    isPersisted: !0
  });
}
var Ar = /* @__PURE__ */ (function(t) {
  Ia(e, t);
  function e() {
    var n = t !== null && t.apply(this, arguments) || this;
    return n.state = O({ container: null, gestos: {}, renderLines: [
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]]
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, Ys(null)), n.renderState = {}, n.enabledAbles = [], n.targetAbles = [], n.controlAbles = [], n.rotation = 0, n.scale = [1, 1], n.isMoveableMounted = !1, n.isUnmounted = !1, n.events = {
      mouseEnter: null,
      mouseLeave: null
    }, n._emitter = new ja(), n._prevOriginalDragTarget = null, n._originalDragTarget = null, n._prevDragTarget = null, n._dragTarget = null, n._prevPropTarget = null, n._propTarget = null, n._prevDragArea = !1, n._isPropTargetChanged = !1, n._hasFirstTarget = !1, n._reiszeObserver = null, n._observerId = 0, n._mutationObserver = null, n._rootContainer = null, n._viewContainer = null, n._viewClassNames = [], n._store = {}, n.checkUpdateRect = function() {
      if (!n.isDragging()) {
        var r = n.props.parentMoveable;
        if (r) {
          r.checkUpdateRect();
          return;
        }
        X0(n._observerId), n._observerId = dp(function() {
          n.isDragging() || n.updateRect();
        });
      }
    }, n._onPreventClick = function(r) {
      r.stopPropagation(), r.preventDefault();
    }, n;
  }
  return e.prototype.render = function() {
    var n = this.props, r = this.getState(), a = n.parentPosition, i = n.className, o = n.target, s = n.zoom, l = n.cspNonce, c = n.translateZ, u = n.cssStyled, f = n.groupable, d = n.linePadding, h = n.controlPadding;
    this._checkUpdateRootContainer(), this.checkUpdate(), this.updateRenderPoses();
    var m = L(a || [0, 0], 2), v = m[0], y = m[1], b = r.left, S = r.top, C = r.target, k = r.direction, M = r.hasFixed, E = r.offsetDelta, D = n.targets, j = this.isDragging(), R = {};
    this.getEnabledAbles().forEach(function(B) {
      R["data-able-".concat(B.name.toLowerCase())] = !0;
    });
    var _ = this._getAbleClassName(), x = D && D.length && (C || f) || o || !this._hasFirstTarget && this.state.isPersisted, P = this.controlBox || this.props.firstRenderState || this.props.persistData, I = [b - v, S - y];
    !f && n.useAccuratePosition && (I[0] += E[0], I[1] += E[1]);
    var A = {
      position: M ? "fixed" : "absolute",
      display: x ? "block" : "none",
      visibility: P ? "visible" : "hidden",
      transform: "translate3d(".concat(I[0], "px, ").concat(I[1], "px, ").concat(c, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return d && (A["--moveable-line-padding"] = d), h && (A["--moveable-control-padding"] = h), $.createElement(
      u,
      O({ cspNonce: l, ref: $n(this, "controlBox"), className: "".concat(mt("control-box", k === -1 ? "reverse" : "", j ? "dragging" : ""), " ").concat(_, " ").concat(i) }, R, { onClick: this._onPreventClick, style: A }),
      this.renderAbles(),
      this._renderLines()
    );
  }, e.prototype.componentDidMount = function() {
    this.isMoveableMounted = !0, this.isUnmounted = !1;
    var n = this.props, r = n.parentMoveable, a = n.container;
    this._checkUpdateRootContainer(), this._checkUpdateViewContainer(), this._updateTargets(), this._updateNativeEvents(), this._updateEvents(), this.updateCheckInput(), this._updateObserver(this.props), !a && !r && !this.state.isPersisted && (this.updateRect("", !1, !1), this.forceUpdate());
  }, e.prototype.componentDidUpdate = function(n) {
    this._checkUpdateRootContainer(), this._checkUpdateViewContainer(), this._updateNativeEvents(), this._updateTargets(), this._updateEvents(), this.updateCheckInput(), this._updateObserver(n);
  }, e.prototype.componentWillUnmount = function() {
    var n, r;
    this.isMoveableMounted = !1, this.isUnmounted = !0, this._emitter.off(), (n = this._reiszeObserver) === null || n === void 0 || n.disconnect(), (r = this._mutationObserver) === null || r === void 0 || r.disconnect();
    var a = this._viewContainer;
    a && this._changeAbleViewClassNames([]), kr(this, !1), kr(this, !0);
    var i = this.events;
    for (var o in i) {
      var s = i[o];
      s && s.destroy();
    }
  }, e.prototype.getTargets = function() {
    var n = this.props.target;
    return n ? [n] : [];
  }, e.prototype.getAble = function(n) {
    var r = this.props.ables || [];
    return ze(r, function(a) {
      return a.name === n;
    });
  }, e.prototype.getContainer = function() {
    var n = this.props, r = n.parentMoveable, a = n.wrapperMoveable, i = n.container;
    return i || a && a.getContainer() || r && r.getContainer() || this.controlBox.parentElement;
  }, e.prototype.getControlBoxElement = function() {
    return this.controlBox;
  }, e.prototype.getDragElement = function() {
    return this._dragTarget;
  }, e.prototype.isMoveableElement = function(n) {
    var r;
    return n && (((r = n.getAttribute) === null || r === void 0 ? void 0 : r.call(n, "class")) || "").indexOf(Il) > -1;
  }, e.prototype.dragStart = function(n, r) {
    r === void 0 && (r = n.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && Ul(this)({ inputEvent: n }, r) ? a.isFlag() || a.triggerDragStart(n) : i && this.isMoveableElement(r) && (i.isFlag() || i.triggerDragStart(n)), this;
  }, e.prototype.hitTest = function(n) {
    var r = this.state, a = r.target, i = r.pos1, o = r.pos2, s = r.pos3, l = r.pos4, c = r.targetClientRect;
    if (!a)
      return 0;
    var u;
    if (Ca(n)) {
      var f = n.getBoundingClientRect();
      u = {
        left: f.left,
        top: f.top,
        width: f.width,
        height: f.height
      };
    } else
      u = O({ width: 0, height: 0 }, n);
    var d = u.left, h = u.top, m = u.width, v = u.height, y = Ms([i, o, l, s], c), b = Sx(y, [
      [d, h],
      [d + m, h],
      [d + m, h + v],
      [d, h + v]
    ]), S = la(y);
    return !b || !S ? 0 : Math.min(100, b / S * 100);
  }, e.prototype.isInside = function(n, r) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, c = a.pos4, u = a.targetClientRect;
    return i ? Fi([n, r], Ms([o, s, c, l], u)) : !1;
  }, e.prototype.updateRect = function(n, r, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && Pr(!0);
    var s = i.parentMoveable, l = this.state, c = l.target || i.target, u = this.getContainer(), f = s ? s._rootContainer : this._rootContainer, d = Ys(this.controlBox, c, u, u, f || u, this._getRequestStyles());
    if (!c && this._hasFirstTarget && i.persistData) {
      var h = xd(i.persistData);
      for (var m in h)
        d[m] = h[m];
    }
    o && Pr(), this.updateState(d, s ? !1 : a);
  }, e.prototype.isDragging = function(n) {
    var r, a, i = this.targetGesto, o = this.controlGesto;
    if (i != null && i.isFlag()) {
      if (!n)
        return !0;
      var s = i.getEventData();
      return !!(!((r = s[n]) === null || r === void 0) && r.isEventStart);
    }
    if (o != null && o.isFlag()) {
      if (!n)
        return !0;
      var s = o.getEventData();
      return !!(!((a = s[n]) === null || a === void 0) && a.isEventStart);
    }
    return !1;
  }, e.prototype.updateTarget = function(n) {
    this.updateRect(n, !0);
  }, e.prototype.getRect = function() {
    var n = this.state, r = Ue(this.state), a = L(r, 4), i = a[0], o = a[1], s = a[2], l = a[3], c = Ve(r), u = n.width, f = n.height, d = c.width, h = c.height, m = c.left, v = c.top, y = [n.left, n.top], b = Bt(y, n.origin), S = Bt(y, n.beforeOrigin), C = n.transformOrigin;
    return {
      width: d,
      height: h,
      left: m,
      top: v,
      pos1: i,
      pos2: o,
      pos3: s,
      pos4: l,
      offsetWidth: u,
      offsetHeight: f,
      beforeOrigin: S,
      origin: b,
      transformOrigin: C,
      rotation: this.getRotation()
    };
  }, e.prototype.getManager = function() {
    return this;
  }, e.prototype.stopDrag = function(n) {
    if (!n || n === "target") {
      var r = this.targetGesto;
      (r == null ? void 0 : r.isIdle()) === !1 && Gs(this, !1), r == null || r.stop();
    }
    if (!n || n === "control") {
      var r = this.controlGesto;
      (r == null ? void 0 : r.isIdle()) === !1 && Gs(this, !0), r == null || r.stop();
    }
  }, e.prototype.getRotation = function() {
    var n = this.state, r = n.pos1, a = n.pos2, i = n.direction;
    return Mb(r, a, i);
  }, e.prototype.request = function(n, r, a) {
    r === void 0 && (r = {});
    var i = this, o = i.props, s = o.parentMoveable || o.wrapperMoveable || i, l = s.props.ables, c = o.groupable, u = ze(l, function(b) {
      return b.name === n;
    });
    if (this.isDragging() || !u || !u.request)
      return {
        request: function() {
          return this;
        },
        requestEnd: function() {
          return this;
        }
      };
    var f = u.request(i), d = a || r.isInstant, h = f.isControl ? "controlAbles" : "targetAbles", m = "".concat(c ? "Group" : "").concat(f.isControl ? "Control" : ""), v = ot([], L(s[h]), !1), y = {
      request: function(b) {
        return pa(i, v, ["drag"], m, "", O(O({}, f.request(b)), { requestAble: n, isRequest: !0 }), d), y;
      },
      requestEnd: function() {
        return pa(i, v, ["drag"], m, "End", O(O({}, f.requestEnd()), { requestAble: n, isRequest: !0 }), d), y;
      }
    };
    return pa(i, v, ["drag"], m, "Start", O(O({}, f.requestStart(r)), { requestAble: n, isRequest: !0 }), d), d ? y.request(r).requestEnd() : y;
  }, e.prototype.getMoveables = function() {
    return [this];
  }, e.prototype.destroy = function() {
    this.componentWillUnmount();
  }, e.prototype.updateRenderPoses = function() {
    var n = this.getState(), r = this.props, a = r.padding, i = n.originalBeforeOrigin, o = n.transformOrigin, s = n.allMatrix, l = n.is3d, c = n.pos1, u = n.pos2, f = n.pos3, d = n.pos4, h = n.left, m = n.top, v = n.isPersisted, y = r.zoom || 1;
    if (!a && y <= 1) {
      n.renderPoses = [
        c,
        u,
        f,
        d
      ], n.renderLines = [
        [c, u],
        [u, d],
        [d, f],
        [f, c]
      ];
      return;
    }
    var b = bh(a || {}), S = b.left, C = b.top, k = b.bottom, M = b.right, E = l ? 4 : 3, D = [];
    v ? D = o : this.controlBox && r.groupable ? D = i : D = Bt(i, [h, m]);
    var j = Li(E, cr(D.map(function(A) {
      return -A;
    }), E), s, cr(o, E)), R = We(j, c, [-S, -C], E), _ = We(j, u, [M, -C], E), x = We(j, f, [-S, k], E), P = We(j, d, [M, k], E);
    n.renderPoses = [
      R,
      _,
      x,
      P
    ], n.renderLines = [
      [R, _],
      [_, P],
      [P, x],
      [x, R]
    ];
    {
      var I = y / 2;
      n.renderLines = [
        [
          We(j, c, [-S - I, -C], E),
          We(j, u, [M + I, -C], E)
        ],
        [
          We(j, u, [M, -C - I], E),
          We(j, d, [M, k + I], E)
        ],
        [
          We(j, d, [M + I, k], E),
          We(j, f, [-S - I, k], E)
        ],
        [
          We(j, f, [-S, k + I], E),
          We(j, c, [-S, -C - I], E)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var n = this.props, r = n.target, a = n.container, i = n.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !r)) {
      this.updateAbles();
      var c = !$s(s, r), u = c || !$s(l, a);
      if (u) {
        var f = a || this.controlBox;
        f && this.unsetAbles(), this.updateState({ target: r, container: a }), !i && f && this.updateRect("End", !1, !1), this._isPropTargetChanged = c;
      }
    }
  }, e.prototype.waitToChangeTarget = function() {
    return new Promise(function() {
    });
  }, e.prototype.triggerEvent = function(n, r) {
    var a = this.props;
    if (this._emitter.trigger(n, r), a.parentMoveable && r.isRequest && !r.isRequestChild)
      return a.parentMoveable.triggerEvent(n, r, !0);
    var i = a[n];
    return i && i(r);
  }, e.prototype.useCSS = function(n, r) {
    var a = this.props.customStyledMap, i = n + r;
    return a[i] || (a[i] = kp(n, r)), a[i];
  }, e.prototype.getState = function() {
    var n, r = this.props;
    (r.target || !((n = r.targets) === null || n === void 0) && n.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = r.persistData, o = r.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = xd(i);
      if (s)
        return this.updateState(s, !1), this.state;
    }
    return this.state.isPersisted = !1, this.state;
  }, e.prototype.updateSelectors = function() {
  }, e.prototype.unsetAbles = function() {
    var n = this;
    this.targetAbles.forEach(function(r) {
      r.unset && r.unset(n);
    });
  }, e.prototype.updateAbles = function(n, r) {
    n === void 0 && (n = this.props.ables), r === void 0 && (r = "");
    var a = this.props, i = a.triggerAblesSimultaneously, o = this.getEnabledAbles(n), s = "drag".concat(r, "Start"), l = "pinch".concat(r, "Start"), c = "drag".concat(r, "ControlStart"), u = hi(o, [s, l], i), f = hi(o, [c], i);
    this.enabledAbles = o, this.targetAbles = u, this.controlAbles = f;
  }, e.prototype.updateState = function(n, r) {
    if (r) {
      if (this.isUnmounted)
        return;
      this.setState(n);
    } else {
      var a = this.state;
      for (var i in n)
        a[i] = n[i];
    }
  }, e.prototype.getEnabledAbles = function(n) {
    n === void 0 && (n = this.props.ables);
    var r = this.props;
    return n.filter(function(a) {
      return a && (a.always && r[a.name] !== !1 || r[a.name]);
    });
  }, e.prototype.renderAbles = function() {
    var n = this, r = this.props, a = r.triggerAblesSimultaneously, i = {
      createElement: $.createElement
    };
    return this.renderState = {}, Sb(vh(hi(this.getEnabledAbles(), ["render"], a).map(function(o) {
      var s = o.render;
      return s(n, i) || [];
    })).filter(function(o) {
      return o;
    }), function(o) {
      var s = o.key;
      return s;
    }).map(function(o) {
      return o[0];
    });
  }, e.prototype.updateCheckInput = function() {
    this.targetGesto && (this.targetGesto.options.checkInput = this.props.checkInput);
  }, e.prototype._getRequestStyles = function() {
    var n = this.getEnabledAbles().reduce(function(r, a) {
      var i, o, s = (o = (i = a.requestStyle) === null || i === void 0 ? void 0 : i.call(a)) !== null && o !== void 0 ? o : [];
      return ot(ot([], L(r), !1), L(s), !1);
    }, ot([], L(this.props.requestStyles || []), !1));
    return n;
  }, e.prototype._updateObserver = function(n) {
    this._updateResizeObserver(n), this._updateMutationObserver(n);
  }, e.prototype._updateEvents = function() {
    var n = this.targetAbles.length, r = this.controlAbles.length, a = this._dragTarget, i = !n && this.targetGesto || this._isTargetChanged(!0);
    i && (kr(this, !1), this.updateState({ gestos: {} })), r || kr(this, !0), a && n && !this.targetGesto && (this.targetGesto = _h(this, a, "")), !this.controlGesto && r && (this.controlGesto = jh(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var n = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = n.dragArea, this._propTarget = n.target, this._originalDragTarget = n.dragTarget || n.target, this._dragTarget = mn(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var n = this.props, r = n, a = r.zoom, i = r.hideDefaultLines, o = r.hideChildMoveableDefaultLines, s = r.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), c = {
      createElement: $.createElement
    };
    return l.renderLines.map(function(u, f) {
      return ka(c, "", u[0], u[1], a, "render-line-".concat(f));
    });
  }, e.prototype._isTargetChanged = function(n) {
    var r = this.props, a = r.dragTarget || r.target, i = this._prevOriginalDragTarget, o = this._prevDragArea, s = r.dragArea, l = !s && i !== a, c = (n || s) && o !== s;
    return l || c || this._prevPropTarget != this._propTarget;
  }, e.prototype._updateNativeEvents = function() {
    var n = this, r = this.props, a = r.dragArea ? this.areaElement : this.state.target, i = this.events, o = Br(i);
    if (this._isTargetChanged())
      for (var s in i) {
        var l = i[s];
        l && l.destroy(), i[s] = null;
      }
    if (a) {
      var c = this.enabledAbles;
      o.forEach(function(u) {
        var f = hi(c, [u]), d = f.length > 0, h = i[u];
        if (!d) {
          h && (h.destroy(), i[u] = null);
          return;
        }
        h || (h = new e1(a, n, u), i[u] = h), h.setAbles(f);
      });
    }
  }, e.prototype._checkUpdateRootContainer = function() {
    var n = this.props.rootContainer;
    !this._rootContainer && n && (this._rootContainer = mn(n, !0));
  }, e.prototype._checkUpdateViewContainer = function() {
    var n = this.props.viewContainer;
    !this._viewContainer && n && (this._viewContainer = mn(n, !0));
    var r = this._viewContainer;
    r && this._changeAbleViewClassNames(ot(ot([], L(this._getAbleViewClassNames()), !1), [
      this.isDragging() ? Pb : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(n) {
    var r = this._viewContainer, a = gh(n.filter(Boolean), function(c) {
      return c;
    }).map(function(c) {
      var u = L(c, 1), f = u[0];
      return f;
    }), i = this._viewClassNames, o = Tl(i, a), s = o.removed, l = o.added;
    s.forEach(function(c) {
      fp(r, i[c]);
    }), l.forEach(function(c) {
      Cl(r, a[c]);
    }), this._viewClassNames = a;
  }, e.prototype._getAbleViewClassNames = function() {
    var n = this;
    return (this.getEnabledAbles().map(function(r) {
      var a;
      return ((a = r.viewClassName) === null || a === void 0 ? void 0 : a.call(r, n)) || "";
    }).join(" ") + " ".concat(this._getAbleClassName("-view"))).split(/\s+/g);
  }, e.prototype._getAbleClassName = function(n) {
    var r = this;
    n === void 0 && (n = "");
    var a = this.getEnabledAbles(), i = this.targetGesto, o = this.controlGesto, s = i != null && i.isFlag() ? i.getEventData() : {}, l = o != null && o.isFlag() ? o.getEventData() : {};
    return a.map(function(c) {
      var u, f, d, h = c.name, m = ((u = c.className) === null || u === void 0 ? void 0 : u.call(c, r)) || "";
      return (!((f = s[h]) === null || f === void 0) && f.isEventStart || !((d = l[h]) === null || d === void 0) && d.isEventStart) && (m += " ".concat(mt("".concat(h).concat(n, "-dragging")))), m.trim();
    }).filter(Boolean).join(" ");
  }, e.prototype._updateResizeObserver = function(n) {
    var r, a = this.props, i = a.target, o = Xe(this.getControlBoxElement());
    if (!o.ResizeObserver || !i || !a.useResizeObserver) {
      (r = this._reiszeObserver) === null || r === void 0 || r.disconnect();
      return;
    }
    if (!(n.target === i && this._reiszeObserver)) {
      var s = new o.ResizeObserver(this.checkUpdateRect);
      s.observe(i, {
        box: "border-box"
      }), this._reiszeObserver = s;
    }
  }, e.prototype._updateMutationObserver = function(n) {
    var r = this, a, i = this.props, o = i.target, s = Xe(this.getControlBoxElement());
    if (!s.MutationObserver || !o || !i.useMutationObserver) {
      (a = this._mutationObserver) === null || a === void 0 || a.disconnect();
      return;
    }
    if (!(n.target === o && this._mutationObserver)) {
      var l = new s.MutationObserver(function(c) {
        var u, f;
        try {
          for (var d = zx(c), h = d.next(); !h.done; h = d.next()) {
            var m = h.value;
            m.type === "attributes" && m.attributeName === "style" && r.checkUpdateRect();
          }
        } catch (v) {
          u = { error: v };
        } finally {
          try {
            h && !h.done && (f = d.return) && f.call(d);
          } finally {
            if (u) throw u.error;
          }
        }
      });
      l.observe(o, {
        attributes: !0
      }), this._mutationObserver = l;
    }
  }, e.defaultProps = {
    dragTargetSelf: !1,
    target: null,
    dragTarget: null,
    container: null,
    rootContainer: null,
    origin: !0,
    parentMoveable: null,
    wrapperMoveable: null,
    isWrapperMounted: !1,
    parentPosition: null,
    warpSelf: !1,
    svgOrigin: "",
    dragContainer: null,
    useResizeObserver: !1,
    useMutationObserver: !1,
    preventDefault: !0,
    preventRightClick: !0,
    preventWheelClick: !0,
    linePadding: 0,
    controlPadding: 0,
    ables: [],
    pinchThreshold: 20,
    dragArea: !1,
    passDragArea: !1,
    transformOrigin: "",
    className: "",
    zoom: 1,
    triggerAblesSimultaneously: !1,
    padding: {},
    pinchOutside: !0,
    checkInput: !1,
    dragFocusedInput: !1,
    groupable: !1,
    hideDefaultLines: !1,
    cspNonce: "",
    translateZ: 0,
    cssStyled: null,
    customStyledMap: {},
    props: {},
    stopPropagation: !1,
    preventClickDefault: !1,
    preventClickEventOnDrag: !0,
    flushSync: ih,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})($.PureComponent), Zl = {
  name: "groupable",
  props: [
    "defaultGroupRotate",
    "useDefaultGroupRotate",
    "defaultGroupOrigin",
    "groupable",
    "groupableProps",
    "targetGroups",
    "hideChildMoveableDefaultLines"
  ],
  events: [],
  render: function(t, e) {
    var n, r = t.props, a = r.targets || [], i = t.getState(), o = i.left, s = i.top, l = i.isPersisted, c = r.zoom || 1, u = t.renderGroupRects, f = ((n = r.persistData) === null || n === void 0 ? void 0 : n.children) || [];
    l ? a = f.map(function() {
      return null;
    }) : f = [];
    var d = Er(t, "parentPosition", [o, s], function(m) {
      return m.join(",");
    }), h = Er(t, "requestStyles", t.getRequestChildStyles(), function(m) {
      return m.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), ot(ot([], L(a.map(function(m, v) {
      return e.createElement(Ar, { key: "moveable" + v, ref: op(t, "moveables", v), target: m, origin: !1, requestStyles: h, cssStyled: r.cssStyled, customStyledMap: r.customStyledMap, useResizeObserver: r.useResizeObserver, useMutationObserver: r.useMutationObserver, hideChildMoveableDefaultLines: r.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: f[v], zoom: c });
    })), !1), L(vh(u.map(function(m, v) {
      var y = m.pos1, b = m.pos2, S = m.pos3, C = m.pos4, k = [y, b, S, C];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(M, E) {
        var D = L(M, 2), j = D[0], R = D[1];
        return ka(e, "", bt(k[j], d), bt(k[R], d), c, "group-rect-".concat(v, "-").concat(E));
      });
    }))), !1);
  }
}, a1 = Ra("clickable", {
  props: [
    "clickable"
  ],
  events: [
    "click",
    "clickGroup"
  ],
  always: !0,
  dragRelation: "weak",
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  dragStart: function() {
  },
  dragControlStart: function() {
  },
  dragGroupStart: function(t, e) {
    e.datas.inputTarget = e.inputEvent && e.inputEvent.target;
  },
  dragEnd: function(t, e) {
    var n = t.props.target, r = e.inputEvent, a = e.inputTarget, i = t.isMoveableElement(a), o = !i && t.controlBox.contains(a);
    if (!(!r || !a || e.isDrag || t.isMoveableElement(a) || o)) {
      var s = n.contains(a);
      pt(t, "onClick", Rt(t, e, {
        isDouble: e.isDouble,
        inputTarget: a,
        isTarget: n === a,
        moveableTarget: t.props.target,
        containsTarget: s
      }));
    }
  },
  dragGroupEnd: function(t, e) {
    var n = e.inputEvent, r = e.inputTarget;
    if (!(!n || !r || e.isDrag || t.isMoveableElement(r) || e.datas.inputTarget === r)) {
      var a = t.props.targets, i = a.indexOf(r), o = i > -1, s = !1;
      i === -1 && (i = jn(a, function(l) {
        return l.contains(r);
      }), s = i > -1), pt(t, "onClickGroup", Rt(t, e, {
        isDouble: e.isDouble,
        targets: a,
        inputTarget: r,
        targetIndex: i,
        isTarget: o,
        containsTarget: s,
        moveableTarget: a[i]
      }));
    }
  },
  dragControlEnd: function(t, e) {
    this.dragEnd(t, e);
  },
  dragGroupControlEnd: function(t, e) {
    this.dragEnd(t, e);
  }
});
function xr(t) {
  var e = t.originalDatas.draggable;
  return e || (t.originalDatas.draggable = {}, e = t.originalDatas.draggable), O(O({}, t), { datas: e });
}
var i1 = Ra("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var n = t.props, r = n.edgeDraggable;
    return r ? Fp(e, "edgeDraggable", r, t.getState().renderPoses, n.zoom) : [];
  },
  dragCondition: function(t, e) {
    var n, r = t.props, a = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
    return !r.edgeDraggable || !a ? !1 : !r.draggable && ue(a, mt("direction")) && ue(a, mt("edge")) && ue(a, mt("edgeDraggable"));
  },
  dragStart: function(t, e) {
    return Te.dragStart(t, xr(e));
  },
  drag: function(t, e) {
    return Te.drag(t, xr(e));
  },
  dragEnd: function(t, e) {
    return Te.dragEnd(t, xr(e));
  },
  dragGroupCondition: function(t, e) {
    var n, r = t.props, a = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
    return !r.edgeDraggable || !a ? !1 : !r.draggable && ue(a, mt("direction")) && ue(a, mt("line"));
  },
  dragGroupStart: function(t, e) {
    return Te.dragGroupStart(t, xr(e));
  },
  dragGroup: function(t, e) {
    return Te.dragGroup(t, xr(e));
  },
  dragGroupEnd: function(t, e) {
    return Te.dragGroupEnd(t, xr(e));
  },
  unset: function(t) {
    return Te.unset(t);
  }
}), Rh = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, o1 = [
  Dh,
  Ch,
  cb,
  Tb,
  Te,
  i1,
  zs,
  _b,
  Ib,
  Hy,
  Ab,
  zb,
  Nb,
  qb,
  Kb,
  Qb,
  Zl,
  Rh,
  a1,
  Sh,
  Th
];
function yd(t, e) {
  var n = L(t, 3), r = n[0], a = n[1], i = n[2];
  return (r * e[0] + a * e[1] + i) / Math.sqrt(r * r + a * a);
}
function mi(t, e) {
  var n = L(t, 2), r = n[0], a = n[1];
  return -r * e[0] - a * e[1];
}
function bd(t, e) {
  return Math.max.apply(Math, ot([], L(t.map(function(n) {
    var r = L(n, 4), a = r[0], i = r[1], o = r[2], s = r[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function wd(t, e) {
  return Math.min.apply(Math, ot([], L(t.map(function(n) {
    var r = L(n, 4), a = r[0], i = r[1], o = r[2], s = r[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function s1(t, e) {
  var n, r, a, i = [0, 0], o = [0, 0], s = [0, 0], l = [0, 0], c = 0, u = 0;
  if (!t.length)
    return {
      pos1: i,
      pos2: o,
      pos3: s,
      pos4: l,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
      width: c,
      height: u,
      rotation: e
    };
  var f = Et(e, Ie);
  if (f % 90) {
    var d = f / 180 * Math.PI, h = Math.tan(d), m = -1 / h, v = [Ps, Yu], y = [[0, 0], [0, 0]], b = [Ps, Yu], S = [[0, 0], [0, 0]];
    t.forEach(function(et) {
      et.forEach(function(at) {
        var Q = yd([-h, 1, 0], at), it = yd([-m, 1, 0], at);
        v[0] > Q && (y[0] = at, v[0] = Q), v[1] < Q && (y[1] = at, v[1] = Q), b[0] > it && (S[0] = at, b[0] = it), b[1] < it && (S[1] = at, b[1] = it);
      });
    });
    var C = L(y, 2), k = C[0], M = C[1], E = L(S, 2), D = E[0], j = E[1], R = [-h, 1, mi([-h, 1], k)], _ = [-h, 1, mi([-h, 1], M)], x = [-m, 1, mi([-m, 1], D)], P = [-m, 1, mi([-m, 1], j)];
    n = L([
      [R, x],
      [R, P],
      [_, x],
      [_, P]
    ].map(function(et) {
      var at = L(et, 2), Q = at[0], it = at[1];
      return _l(Q, it)[0];
    }), 4), i = n[0], o = n[1], s = n[2], l = n[3], c = b[1] - b[0], u = v[1] - v[0];
  } else {
    var I = wd(t, 0), A = wd(t, 1), B = bd(t, 0), q = bd(t, 1);
    if (i = [I, A], o = [B, A], s = [I, q], l = [B, q], c = B - I, u = q - A, f % 180) {
      var F = [s, i, l, o];
      r = L(F, 4), i = r[0], o = r[1], s = r[2], l = r[3], c = q - A, u = B - I;
    }
  }
  if (f % 360 > 180) {
    var F = [l, s, o, i];
    a = L(F, 4), i = a[0], o = a[1], s = a[2], l = a[3];
  }
  var N = ur([i, o, s, l]), W = N.minX, V = N.minY, X = N.maxX, J = N.maxY;
  return {
    pos1: i,
    pos2: o,
    pos3: s,
    pos4: l,
    width: c,
    height: u,
    minX: W,
    minY: V,
    maxX: X,
    maxY: J,
    rotation: e
  };
}
function Ph(t, e) {
  var n = e.map(function(r) {
    if (re(r)) {
      var a = Ph(t, r), i = a.length;
      return i > 1 ? a : i === 1 ? a[0] : null;
    } else {
      var o = ze(t, function(s) {
        var l = s.manager;
        return l.props.target === r;
      });
      return o ? (o.finded = !0, o.manager) : null;
    }
  }).filter(Boolean);
  return n.length === 1 && re(n[0]) ? n[0] : n;
}
var l1 = /* @__PURE__ */ (function(t) {
  Ia(e, t);
  function e() {
    var n = t !== null && t.apply(this, arguments) || this;
    return n.differ = new xp(), n.moveables = [], n.transformOrigin = "50% 50%", n.renderGroupRects = [], n._targetGroups = [], n._hasFirstTargets = !1, n;
  }
  return e.prototype.componentDidMount = function() {
    t.prototype.componentDidMount.call(this);
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1, this.updateAbles();
  }, e.prototype.getTargets = function() {
    return this.props.targets;
  }, e.prototype.updateRect = function(n, r, a) {
    var i;
    a === void 0 && (a = !0);
    var o = this.state;
    if (!this.controlBox || o.isPersisted)
      return;
    Pr(!0), this.moveables.forEach(function(Z) {
      Z.updateRect(n, !1, !1);
    });
    var s = this.props, l = this.moveables, c = o.target || s.target, u = l.map(function(Z) {
      return { finded: !1, manager: Z };
    }), f = this.props.targetGroups || [], d = Ph(u, f), h = s.useDefaultGroupRotate;
    d.push.apply(d, ot([], L(u.filter(function(Z) {
      var dt = Z.finded;
      return !dt;
    }).map(function(Z) {
      var dt = Z.manager;
      return dt;
    })), !1));
    var m = [], v = !r || n !== "" && s.updateGroup, y = s.defaultGroupRotate || 0;
    if (!this._hasFirstTargets) {
      var b = (i = s.persistData) === null || i === void 0 ? void 0 : i.rotation;
      b != null && (y = b);
    }
    function S(Z, dt, ht) {
      var tt = Z.map(function(Tt) {
        if (re(Tt)) {
          var vt = S(Tt, dt), gt = [vt.pos1, vt.pos2, vt.pos3, vt.pos4];
          return m.push(vt), { poses: gt, rotation: vt.rotation };
        } else
          return {
            poses: Ue(Tt.state),
            rotation: Tt.getRotation()
          };
      }), ft = tt.map(function(Tt) {
        var vt = Tt.rotation;
        return vt;
      }), Mt = 0, xt = ft[0], st = ft.every(function(Tt) {
        return Math.abs(xt - Tt) < 0.1;
      });
      v ? Mt = !h && st ? xt : y : Mt = !h && !ht && st ? xt : dt;
      var St = tt.map(function(Tt) {
        var vt = Tt.poses;
        return vt;
      }), Pt = s1(St, Mt);
      return Pt;
    }
    var C = S(d, this.rotation, !0);
    v && (this.rotation = C.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = f, this.renderGroupRects = m;
    var k = this.transformOrigin, M = this.rotation, E = this.scale, D = C.width, j = C.height, R = C.minX, _ = C.minY, x = Db([
      [0, 0],
      [D, 0],
      [0, j],
      [D, j]
    ], Vl(k, D, j), this.rotation / 180 * Math.PI), P = ur(x.result), I = P.minX, A = P.minY, B = " rotate(".concat(M, "deg)") + " scale(".concat(_e(E[0]), ", ").concat(_e(E[1]), ")"), q = "translate(".concat(-I, "px, ").concat(-A, "px)").concat(B);
    this.controlBox.style.transform = "translate3d(".concat(R, "px, ").concat(_, "px, ").concat(this.props.translateZ || 0, ")"), c.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(k, ";") + "width:".concat(D, "px;height:").concat(j, "px;") + "transform: ".concat(q), o.width = D, o.height = j;
    var F = this.getContainer(), N = Ys(this.controlBox, c, this.controlBox, this.getContainer(), this._rootContainer || F, []), W = [N.left, N.top], V = L(Ue(N), 4), X = V[0], J = V[1], et = V[2], at = V[3], Q = ur([X, J, et, at]), it = [Q.minX, Q.minY], ut = _e(E[0] * E[1]);
    N.pos1 = bt(X, it), N.pos2 = bt(J, it), N.pos3 = bt(et, it), N.pos4 = bt(at, it), N.left = R - N.left + it[0], N.top = _ - N.top + it[1], N.origin = bt(Bt(W, N.origin), it), N.beforeOrigin = bt(Bt(W, N.beforeOrigin), it), N.originalBeforeOrigin = Bt(W, N.originalBeforeOrigin), N.transformOrigin = bt(Bt(W, N.transformOrigin), it), c.style.transform = "translate(".concat(-I - it[0], "px, ").concat(-A - it[1], "px)") + B, Pr(), this.updateState(O(O({}, N), { posDelta: it, direction: ut, beforeDirection: ut }), a);
  }, e.prototype.getRect = function() {
    return O(O({}, t.prototype.getRect.call(this)), { children: this.moveables.map(function(n) {
      return n.getRect();
    }) });
  }, e.prototype.triggerEvent = function(n, r, a) {
    if (a || n.indexOf("Group") > -1)
      return t.prototype.triggerEvent.call(this, n, r);
    this._emitter.trigger(n, r);
  }, e.prototype.getRequestChildStyles = function() {
    var n = this.getEnabledAbles().reduce(function(r, a) {
      var i, o, s = (o = (i = a.requestChildStyle) === null || i === void 0 ? void 0 : i.call(a)) !== null && o !== void 0 ? o : [];
      return ot(ot([], L(r), !1), L(s), !1);
    }, []);
    return n;
  }, e.prototype.getMoveables = function() {
    return ot([], L(this.moveables), !1);
  }, e.prototype.updateAbles = function() {
    t.prototype.updateAbles.call(this, ot(ot([], L(this.props.ables), !1), [Zl], !1), "Group");
  }, e.prototype._updateTargets = function() {
    t.prototype._updateTargets.call(this), this._originalDragTarget = this.props.dragTarget || this.areaElement, this._dragTarget = mn(this._originalDragTarget, !0);
  }, e.prototype._updateEvents = function() {
    var n = this.state, r = this.props, a = this._prevDragTarget, i = r.dragTarget || this.areaElement, o = r.targets, s = this.differ.update(o), l = s.added, c = s.changed, u = s.removed, f = l.length || u.length;
    (f || this._prevOriginalDragTarget !== this._originalDragTarget) && (kr(this, !1), kr(this, !0), this.updateState({ gestos: {} })), a !== i && (n.target = null), n.target || (n.target = this.areaElement, this.controlBox.style.display = "block"), n.target && (this.targetGesto || (this.targetGesto = _h(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = jh(this, "GroupControl")));
    var d = !$s(n.container, r.container);
    d && (n.container = r.container), (d || f || this.transformOrigin !== (r.defaultGroupOrigin || "50% 50%") || c.length || o.length && !yh(this._targetGroups, r.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!f;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = O(O({}, Ar.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Ar), c1 = /* @__PURE__ */ (function(t) {
  Ia(e, t);
  function e() {
    var n = t !== null && t.apply(this, arguments) || this;
    return n.moveables = [], n;
  }
  return e.prototype.render = function() {
    var n = this, r, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], c = l.length, u = this.isUnmounted || !c, f = (r = s == null ? void 0 : s.children) !== null && r !== void 0 ? r : [];
    return u && !c && f.length ? l = f.map(function() {
      return null;
    }) : u || (f = []), $.createElement(o, { cspNonce: i, ref: $n(this, "controlBox"), className: mt("control-box") }, l.map(function(d, h) {
      var m, v, y = (v = (m = a.individualGroupableProps) === null || m === void 0 ? void 0 : m.call(a, d, h)) !== null && v !== void 0 ? v : {};
      return $.createElement(Ar, O({ key: "moveable" + h, ref: op(n, "moveables", h) }, a, y, { target: d, wrapperMoveable: n, isWrapperMounted: n.isMoveableMounted, persistData: f[h] }));
    }));
  }, e.prototype.componentDidMount = function() {
  }, e.prototype.componentDidUpdate = function() {
  }, e.prototype.getTargets = function() {
    return this.props.targets;
  }, e.prototype.updateRect = function(n, r, a) {
    a === void 0 && (a = !0), Pr(!0), this.moveables.forEach(function(i) {
      i.updateRect(n, r, a);
    }), Pr();
  }, e.prototype.getRect = function() {
    return O(O({}, t.prototype.getRect.call(this)), { children: this.moveables.map(function(n) {
      return n.getRect();
    }) });
  }, e.prototype.request = function(n, r, a) {
    r === void 0 && (r = {});
    var i = this.moveables.map(function(l) {
      return l.request(n, O(O({}, r), { isInstant: !1 }), !1);
    }), o = a || r.isInstant, s = {
      request: function(l) {
        return i.forEach(function(c) {
          return c.request(l);
        }), this;
      },
      requestEnd: function() {
        return i.forEach(function(l) {
          return l.requestEnd();
        }), this;
      }
    };
    return o ? s.request(r).requestEnd() : s;
  }, e.prototype.dragStart = function(n, r) {
    r === void 0 && (r = n.target);
    var a = r, i = ze(this.moveables, function(o) {
      var s = o.getTargets()[0], l = o.getControlBoxElement(), c = o.getDragElement();
      return !s || !c ? !1 : c === a || c.contains(a) || c !== s && s === a || s.contains(a) || l === a || l.contains(a);
    });
    return i && i.dragStart(n, r), this;
  }, e.prototype.hitTest = function() {
    return 0;
  }, e.prototype.isInside = function() {
    return !1;
  }, e.prototype.isDragging = function() {
    return !1;
  }, e.prototype.getDragElement = function() {
    return null;
  }, e.prototype.getMoveables = function() {
    return ot([], L(this.moveables), !1);
  }, e.prototype.updateRenderPoses = function() {
  }, e.prototype.checkUpdate = function() {
  }, e.prototype.triggerEvent = function() {
  }, e.prototype.updateAbles = function() {
  }, e.prototype._updateEvents = function() {
  }, e.prototype._updateObserver = function() {
  }, e;
})(Ar);
function Nh(t, e) {
  var n = [];
  return t.forEach(function(r) {
    if (r) {
      if (Ke(r)) {
        e[r] && n.push.apply(n, ot([], L(e[r]), !1));
        return;
      }
      re(r) ? n.push.apply(n, ot([], L(Nh(r, e)), !1)) : n.push(r);
    }
  }), n;
}
function Oh(t, e) {
  var n = [];
  return t.forEach(function(r) {
    if (r) {
      if (Ke(r)) {
        e[r] && n.push.apply(n, ot([], L(e[r]), !1));
        return;
      }
      re(r) ? n.push(Oh(r, e)) : n.push(r);
    }
  }), n;
}
function Ah(t, e) {
  return t.length !== e.length || t.some(function(n, r) {
    var a = e[r];
    return !n && !a ? !1 : n != a ? re(n) && re(a) ? Ah(n, a) : !0 : !1;
  });
}
var u1 = /* @__PURE__ */ (function(t) {
  Ia(e, t);
  function e() {
    var n = t !== null && t.apply(this, arguments) || this;
    return n.refTargets = [], n.selectorMap = {}, n._differ = new xp(), n._elementTargets = [], n._tmpRefTargets = [], n._tmpSelectorMap = {}, n._onChangeTargets = null, n;
  }
  return e.makeStyled = function() {
    var n = {}, r = this.getTotalAbles();
    r.forEach(function(i) {
      var o = i.css;
      o && o.forEach(function(s) {
        n[s] = !0;
      });
    });
    var a = Br(n).join(`
`);
    this.defaultStyled = kp("div", N0(Il, Kx + a));
  }, e.getTotalAbles = function() {
    return ot([Ch, Zl, Rh, Sh], L(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var n, r = this.constructor;
    r.defaultStyled || r.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = Ox(a, ["ables", "props"]), l = L(this._updateRefs(!0), 2), c = l[0], u = l[1], f = Nh(c, u), d = f.length > 1, h = r.getTotalAbles(), m = ot(ot([], L(h), !1), L(i || []), !1), v = O(O(O({}, s), o || {}), { ables: m, cssStyled: r.defaultStyled, customStyledMap: r.customStyledMap });
    this._elementTargets = f;
    var y = null, b = this.moveable, S = s.persistData;
    if (S != null && S.children && (d = !0), s.individualGroupable)
      return $.createElement(c1, O({ key: "individual-group", ref: $n(this, "moveable") }, v, { target: null, targets: f }));
    if (d) {
      var C = Oh(c, u);
      if (b && !b.props.groupable && !b.props.individualGroupable) {
        var k = b.props.target;
        k && f.indexOf(k) > -1 && (y = O({}, b.state));
      }
      return $.createElement(l1, O({ key: "group", ref: $n(this, "moveable") }, v, (n = s.groupableProps) !== null && n !== void 0 ? n : {}, { target: null, targets: f, targetGroups: C, firstRenderState: y }));
    } else {
      var M = f[0];
      if (b && (b.props.groupable || b.props.individualGroupable)) {
        var E = b.moveables || [], D = ze(E, function(j) {
          return j.props.target === M;
        });
        D && (y = O({}, D.state));
      }
      return $.createElement(Ar, O({ key: "single", ref: $n(this, "moveable") }, v, { target: M, firstRenderState: y }));
    }
  }, e.prototype.componentDidMount = function() {
    this._checkChangeTargets();
  }, e.prototype.componentDidUpdate = function() {
    this._checkChangeTargets();
  }, e.prototype.componentWillUnmount = function() {
    this.selectorMap = {}, this.refTargets = [];
  }, e.prototype.getTargets = function() {
    var n, r;
    return (r = (n = this.moveable) === null || n === void 0 ? void 0 : n.getTargets()) !== null && r !== void 0 ? r : [];
  }, e.prototype.updateSelectors = function() {
    this.selectorMap = {}, this._updateRefs(), this.forceUpdate();
  }, e.prototype.waitToChangeTarget = function() {
    var n = this, r;
    return this._onChangeTargets = function() {
      n._onChangeTargets = null, r();
    }, new Promise(function(a) {
      r = a;
    });
  }, e.prototype.waitToChangeTargets = function() {
    return this.waitToChangeTarget();
  }, e.prototype.getManager = function() {
    return this.moveable;
  }, e.prototype.getMoveables = function() {
    return this.moveable.getMoveables();
  }, e.prototype.getDragElement = function() {
    return this.moveable.getDragElement();
  }, e.prototype._updateRefs = function(n) {
    var r = this.refTargets, a = Xl(this.props.target || this.props.targets), i = typeof document < "u", o = Ah(r, a), s = this.selectorMap, l = {};
    return this.refTargets.forEach(function c(u) {
      if (Ke(u)) {
        var f = s[u];
        f ? l[u] = s[u] : i && (o = !0, l[u] = [].slice.call(document.querySelectorAll(u)));
      } else re(u) && u.forEach(c);
    }), this._tmpRefTargets = a, this._tmpSelectorMap = l, [
      a,
      l,
      !n && o
    ];
  }, e.prototype._checkChangeTargets = function() {
    var n, r, a;
    this.refTargets = this._tmpRefTargets, this.selectorMap = this._tmpSelectorMap;
    var i = this._differ.update(this._elementTargets), o = i.added, s = i.removed, l = o.length || s.length;
    l && ((r = (n = this.props).onChangeTargets) === null || r === void 0 || r.call(n, {
      moveable: this.moveable,
      targets: this._elementTargets
    }), (a = this._onChangeTargets) === null || a === void 0 || a.call(this));
    var c = L(this._updateRefs(), 3), u = c[0], f = c[1], d = c[2];
    this.refTargets = u, this.selectorMap = f, d && this.forceUpdate();
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, Ax([
    sp(Zx)
  ], e.prototype, "moveable", void 0), e;
})($.PureComponent), d1 = /* @__PURE__ */ (function(t) {
  Ia(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = o1, e;
})(u1), Hs = function(t, e) {
  return Hs = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (n[a] = r[a]);
  }, Hs(t, e);
};
function f1(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Hs(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
function p1(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var Oa = p1(function(t, e) {
  function n(l) {
    if (l && typeof l == "object") {
      var c = l.which || l.keyCode || l.charCode;
      c && (l = c);
    }
    if (typeof l == "number") return o[l];
    var u = String(l), f = r[u.toLowerCase()];
    if (f) return f;
    var f = a[u.toLowerCase()];
    if (f) return f;
    if (u.length === 1) return u.charCodeAt(0);
  }
  n.isEventKey = function(c, u) {
    if (c && typeof c == "object") {
      var f = c.which || c.keyCode || c.charCode;
      if (f == null)
        return !1;
      if (typeof u == "string") {
        var d = r[u.toLowerCase()];
        if (d)
          return d === f;
        var d = a[u.toLowerCase()];
        if (d)
          return d === f;
      } else if (typeof u == "number")
        return u === f;
      return !1;
    }
  }, e = t.exports = n;
  var r = e.code = e.codes = {
    backspace: 8,
    tab: 9,
    enter: 13,
    shift: 16,
    ctrl: 17,
    alt: 18,
    "pause/break": 19,
    "caps lock": 20,
    esc: 27,
    space: 32,
    "page up": 33,
    "page down": 34,
    end: 35,
    home: 36,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    insert: 45,
    delete: 46,
    command: 91,
    "left command": 91,
    "right command": 93,
    "numpad *": 106,
    "numpad +": 107,
    "numpad -": 109,
    "numpad .": 110,
    "numpad /": 111,
    "num lock": 144,
    "scroll lock": 145,
    "my computer": 182,
    "my calculator": 183,
    ";": 186,
    "=": 187,
    ",": 188,
    "-": 189,
    ".": 190,
    "/": 191,
    "`": 192,
    "[": 219,
    "\\": 220,
    "]": 221,
    "'": 222
  }, a = e.aliases = {
    windows: 91,
    "⇧": 16,
    "⌥": 18,
    "⌃": 17,
    "⌘": 91,
    ctl: 17,
    control: 17,
    option: 18,
    pause: 19,
    break: 19,
    caps: 20,
    return: 13,
    escape: 27,
    spc: 32,
    spacebar: 32,
    pgup: 33,
    pgdn: 34,
    ins: 45,
    del: 46,
    cmd: 91
  };
  /*!
   * Programatically add the following
   */
  for (i = 97; i < 123; i++) r[String.fromCharCode(i)] = i - 32;
  for (var i = 48; i < 58; i++) r[i - 48] = i;
  for (i = 1; i < 13; i++) r["f" + i] = i + 111;
  for (i = 0; i < 10; i++) r["numpad " + i] = i + 96;
  var o = e.names = e.title = {};
  for (i in r) o[r[i]] = i;
  for (var s in a)
    r[s] = a[s];
});
Oa.code;
Oa.codes;
Oa.aliases;
var h1 = Oa.names;
Oa.title;
var Sd = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, Cd = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function zh(t, e) {
  var n = (h1[t] || e || "").toLowerCase();
  for (var r in Sd)
    n = n.replace(r, Sd[r]);
  return n.replace(/\s/g, "");
}
function Lh(t, e) {
  e === void 0 && (e = zh(t.keyCode, t.key));
  var n = g1(t);
  return n.indexOf(e) === -1 && n.push(e), n.filter(Boolean);
}
function g1(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function kd(t) {
  var e = t.slice();
  return e.sort(function(n, r) {
    var a = Cd[n] || 5, i = Cd[r] || 5;
    return a - i;
  }), e;
}
var Ed, v1 = /* @__PURE__ */ (function(t) {
  f1(e, t);
  function e(r) {
    r === void 0 && (r = window);
    var a = t.call(this) || this;
    return a.container = r, a.ctrlKey = !1, a.altKey = !1, a.shiftKey = !1, a.metaKey = !1, a.clear = function() {
      return a.ctrlKey = !1, a.altKey = !1, a.shiftKey = !1, a.metaKey = !1, a;
    }, a.keydownEvent = function(i) {
      a.triggerEvent("keydown", i);
    }, a.keyupEvent = function(i) {
      a.triggerEvent("keyup", i);
    }, a.blur = function() {
      a.clear(), a.trigger("blur");
    }, se(r, "blur", a.blur), se(r, "keydown", a.keydownEvent), se(r, "keyup", a.keyupEvent), a;
  }
  var n = e.prototype;
  return Object.defineProperty(e, "global", {
    /**
     */
    get: function() {
      return Ed || (Ed = new e());
    },
    enumerable: !1,
    configurable: !0
  }), e.setGlobal = function() {
    return this.global;
  }, n.destroy = function() {
    var r = this.container;
    this.clear(), this.off(), ne(r, "blur", this.blur), ne(r, "keydown", this.keydownEvent), ne(r, "keyup", this.keyupEvent);
  }, n.keydown = function(r, a) {
    return this.addEvent("keydown", r, a);
  }, n.offKeydown = function(r, a) {
    return this.removeEvent("keydown", r, a);
  }, n.offKeyup = function(r, a) {
    return this.removeEvent("keyup", r, a);
  }, n.keyup = function(r, a) {
    return this.addEvent("keyup", r, a);
  }, n.addEvent = function(r, a, i) {
    return re(a) ? this.on("".concat(r, ".").concat(kd(a).join(".")), i) : Ke(a) ? this.on("".concat(r, ".").concat(a), i) : this.on(r, a), this;
  }, n.removeEvent = function(r, a, i) {
    return re(a) ? this.off("".concat(r, ".").concat(kd(a).join(".")), i) : Ke(a) ? this.off("".concat(r, ".").concat(a), i) : this.off(r, a), this;
  }, n.triggerEvent = function(r, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = zh(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
      key: i,
      isToggle: o,
      inputEvent: a,
      keyCode: a.keyCode,
      ctrlKey: a.ctrlKey,
      altKey: a.altKey,
      shiftKey: a.shiftKey,
      metaKey: a.metaKey
    };
    this.trigger(r, s), this.trigger("".concat(r, ".").concat(i), s);
    var l = Lh(a, i);
    l.length > 1 && this.trigger("".concat(r, ".").concat(l.join(".")), s);
  }, e;
})(ja), Xs = function(t, e) {
  return Xs = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (n[a] = r[a]);
  }, Xs(t, e);
};
function Fh(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Xs(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var oe = function() {
  return oe = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, oe.apply(this, arguments);
};
function m1(t, e) {
  var n = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, r = Object.getOwnPropertySymbols(t); a < r.length; a++)
    e.indexOf(r[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[a]) && (n[r[a]] = t[r[a]]);
  return n;
}
function x1(t, e, n, r) {
  var a = arguments.length, i = a < 3 ? e : r === null ? r = Object.getOwnPropertyDescriptor(e, n) : r, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, n, r);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, n, i) : o(e, n)) || i);
  return a > 3 && i && Object.defineProperty(e, n, i), i;
}
function ha(t, e, n) {
  for (var r = 0, a = e.length, i; r < a; r++)
    (i || !(r in e)) && (i || (i = Array.prototype.slice.call(e, 0, r)), i[r] = e[r]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function y1(t) {
  if ("touches" in t) {
    var e = t.touches[0] || t.changedTouches[0];
    return {
      clientX: e.clientX,
      clientY: e.clientY
    };
  } else
    return {
      clientX: t.clientX,
      clientY: t.clientY
    };
}
function b1(t) {
  if (typeof Map > "u")
    return t.filter(function(n, r) {
      return t.indexOf(n) === r;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(n) {
    return e.has(n) ? !1 : (e.set(n, !0), !0);
  });
}
function w1(t, e, n) {
  var r = sn(t);
  return r.elementFromPoint && r.elementFromPoint(e, n) || null;
}
function Bh(t, e, n) {
  var r = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || sn(n).createElement(r);
  for (var c in i)
    l.setAttribute(c, i[c]);
  var u = l.children;
  if (a.forEach(function(d, h) {
    Bh(d, u[h], l);
  }), o && o.split(/\s+/g).forEach(function(d) {
    d && !ue(l, d) && Cl(l, d);
  }), s) {
    var f = l.style;
    for (var c in s)
      f[c] = s[c];
  }
  return !e && n && n.appendChild(l), l;
}
function S1(t, e) {
  for (var n = [], r = 2; r < arguments.length; r++)
    n[r - 2] = arguments[r];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, c = m1(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: c,
    children: n
  };
}
function Qo(t, e, n) {
  t !== e && n(t, e);
}
function Md(t, e, n) {
  var r;
  n === void 0 && (n = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, c = l.startX, u = l.startY;
  if (e > 0) {
    var f = Math.sqrt((i * i + s * s) / (1 + e * e)), d = e * f;
    i = (i >= 0 ? 1 : -1) * d, s = (s >= 0 ? 1 : -1) * f;
  }
  var h = Math.abs(i), m = Math.abs(s), v = i < 0 ? c - n.left : n.right - c, y = s < 0 ? u - n.top : n.bottom - u;
  r = Sl([h, m], [0, 0], [v, y], !!e), h = r[0], m = r[1], i = (i >= 0 ? 1 : -1) * h, s = (s >= 0 ? 1 : -1) * m;
  var b = Math.min(0, i), S = Math.min(0, s), C = c + b, k = u + S;
  return {
    left: C,
    top: k,
    right: C + h,
    bottom: k + m,
    width: h,
    height: m
  };
}
function xi(t) {
  var e = t.getBoundingClientRect(), n = e.left, r = e.top, a = e.width, i = e.height;
  return {
    pos1: [n, r],
    pos2: [n + a, r],
    pos3: [n, r + i],
    pos4: [n + a, r + i]
  };
}
function Dd(t, e, n) {
  var r = br(t, e), a = r.list, i = r.prevList, o = r.added, s = r.removed, l = r.maintained;
  return ha(ha(ha([], o.map(function(c) {
    return a[c];
  }), !0), s.map(function(c) {
    return i[c];
  }), !0), n ? l.map(function(c) {
    var u = c[1];
    return a[u];
  }) : []);
}
function Td(t) {
  for (var e = 0, n = t.length, r = 1; r < n; ++r)
    e = Math.max(vn(t[r], t[r - 1]), e);
  return e;
}
var Gh = Cp(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), Vs = "selecto-selection ".concat(Gh.className), Jl = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], C1 = ha([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], Jl), $h = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], k1 = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], E1 = /* @__PURE__ */ (function(t) {
  Fh(e, t);
  function e(r) {
    r === void 0 && (r = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new yp(), a._onDragStart = function(s, l) {
      var c = s.data, u = s.clientX, f = s.clientY, d = s.inputEvent, h = a.options, m = h.selectFromInside, v = h.selectByClick, y = h.rootContainer, b = h.boundContainer, S = h.preventDragFromInside, C = S === void 0 ? !0 : S, k = h.clickBySelectEnd, M = h.dragCondition;
      if (M && !M(s)) {
        s.stop();
        return;
      }
      c.data = {};
      var E = Xe(a.container);
      c.innerWidth = E.innerWidth, c.innerHeight = E.innerHeight, a.findSelectableTargets(c), c.startSelectedTargets = a.selectedTargets, c.scaleMatrix = Dl(), c.containerX = 0, c.containerY = 0;
      var D = a.container, j = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (y) {
        var R = a.container.getBoundingClientRect();
        c.containerX = R.left, c.containerY = R.top, c.scaleMatrix = ox(a.container, y);
      }
      if (b) {
        var _ = Ae(b) && "element" in b ? oe({
          left: !0,
          top: !0,
          bottom: !0,
          right: !0
        }, b) : {
          element: b,
          left: !0,
          top: !0,
          bottom: !0,
          right: !0
        }, x = _.element, P = void 0;
        if (x) {
          Ke(x) ? P = sn(D).querySelector(x) : x === !0 ? P = a.container : P = x;
          var I = P.getBoundingClientRect();
          _.left && (j.left = I.left), _.top && (j.top = I.top), _.right && (j.right = I.right), _.bottom && (j.bottom = I.bottom);
        }
      }
      c.boundArea = j;
      var A = {
        left: u,
        top: f,
        right: u,
        bottom: f,
        width: 0,
        height: 0
      }, B = [], q = v && !k, F = !1;
      if (!m || q) {
        var N = a._findElement(
          l || d.target,
          // elementFromPoint(clientX, clientY),
          c.selectableTargets
        );
        F = !!N, q && (B = N ? [N] : []);
      }
      var W = !m && F;
      if (W && !v)
        return s.stop(), !1;
      var V = d.type, X = V === "mousedown" || V === "touchstart", J = !s.isClick && X ? a.emit("dragStart", oe(oe({}, s), {
        data: c.data
      })) : !0;
      if (!J)
        return s.stop(), !1;
      if (a.continueSelect ? (B = Dd(a.selectedTargets, B, a.continueSelectWithoutDeselect), c.startPassedTargets = a.selectedTargets) : c.startPassedTargets = [], a._select(B, A, s, !0, W && v && !k && C), c.startX = u, c.startY = f, c.selectFlag = !1, c.preventDragFromInside = !1, d.target) {
        var et = Ei(c.scaleMatrix, [u - c.containerX, f - c.containerY]);
        a.target.style.cssText += "position: ".concat(y ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(et[0], "px, ").concat(et[1], "px)");
      }
      if (W && v && !k)
        d.preventDefault(), C && (a._selectEnd(c.startSelectedTargets, c.startPassedTargets, A, s, !0), c.preventDragFromInside = !0);
      else {
        c.selectFlag = !0;
        var at = a.options, Q = at.scrollOptions, it = at.innerScrollOptions, ut = !1;
        if (it) {
          for (var Z = s.inputEvent, dt = Z.target, ht = null, tt = dt; tt && tt !== sn(D).body; ) {
            var ft = getComputedStyle(tt).overflow !== "visible";
            if (ft) {
              ht = tt;
              break;
            }
            tt = tt.parentElement;
          }
          ht && (c.innerScrollOptions = oe({
            container: ht,
            checkScrollEvent: !0
          }, it === !0 ? {} : it), a.dragScroll.dragStart(s, c.innerScrollOptions), ut = !0);
        }
        !ut && Q && Q.container && a.dragScroll.dragStart(s, Q), W && v && k && (c.selectFlag = !1, s.preventDrag());
      }
      return !0;
    }, a._onDrag = function(s) {
      if (s.data.selectFlag) {
        var l = a.scrollOptions, c = s.data.innerScrollOptions, u = c || (l == null ? void 0 : l.container);
        if (u && !s.isScroll && a.dragScroll.drag(s, c || l))
          return;
      }
      a._checkSelected(s);
    }, a._onDragEnd = function(s) {
      var l = s.data, c = s.inputEvent, u = Md(s, a.options.ratio), f = l.selectFlag, d = a.container;
      if (c && a.emit("dragEnd", oe(oe({
        isDouble: !!s.isDouble,
        isClick: !!s.isClick,
        isDrag: !1,
        isSelect: f
      }, s), {
        data: l.data,
        rect: u
      })), a.target.style.cssText += "display: none;", f)
        l.selectFlag = !1, a.dragScroll.dragEnd();
      else if (a.selectByClick && a.clickBySelectEnd) {
        var h = a._findElement((c == null ? void 0 : c.target) || w1(d, s.clientX, s.clientY), l.selectableTargets);
        a._select(h ? [h] : [], u, s);
      }
      l.preventDragFromInside || a._selectEnd(l.startSelectedTargets, l.startPassedTargets, u, s);
    }, a._onKeyDown = function(s) {
      var l = a.options, c = !1;
      if (!a._keydownContinueSelect) {
        var u = a._sameCombiKey(s, l.toggleContinueSelect);
        a._keydownContinueSelect = u, c || (c = u);
      }
      if (!a._keydownContinueSelectWithoutDeselection) {
        var u = a._sameCombiKey(s, l.toggleContinueSelectWithoutDeselect);
        a._keydownContinueSelectWithoutDeselection = u, c || (c = u);
      }
      c && a.emit("keydown", {
        keydownContinueSelect: a._keydownContinueSelect,
        keydownContinueSelectWithoutDeselection: a._keydownContinueSelectWithoutDeselection
      });
    }, a._onKeyUp = function(s) {
      var l = a.options, c = !1;
      if (a._keydownContinueSelect) {
        var u = a._sameCombiKey(s, l.toggleContinueSelect, !0);
        a._keydownContinueSelect = !u, c || (c = u);
      }
      if (a._keydownContinueSelectWithoutDeselection) {
        var u = a._sameCombiKey(s, l.toggleContinueSelectWithoutDeselect, !0);
        a._keydownContinueSelectWithoutDeselection = !u, c || (c = u);
      }
      c && a.emit("keyup", {
        keydownContinueSelect: a._keydownContinueSelect,
        keydownContinueSelectWithoutDeselection: a._keydownContinueSelectWithoutDeselection
      });
    }, a._onBlur = function() {
      (a._keydownContinueSelect || a._keydownContinueSelectWithoutDeselection) && (a._keydownContinueSelect = !1, a._keydownContinueSelectWithoutDeselection = !1, a.emit("keyup", {
        keydownContinueSelect: a._keydownContinueSelect,
        keydownContinueSelectWithoutDeselection: a._keydownContinueSelectWithoutDeselection
      }));
    }, a._onDocumentSelectStart = function(s) {
      var l = sn(a.container);
      if (a.gesto.isFlag()) {
        var c = a.dragContainer;
        c === Xe(a.container) && (c = l.documentElement);
        var u = Ca(c) ? [c] : [].slice.call(c), f = s.target;
        u.some(function(d) {
          if (d === f || d.contains(f))
            return s.preventDefault(), !0;
        });
      }
    }, a.target = r.portalContainer;
    var i = r.container;
    a.options = oe({
      className: "",
      portalContainer: null,
      container: null,
      dragContainer: null,
      selectableTargets: [],
      selectByClick: !0,
      selectFromInside: !0,
      clickBySelectEnd: !1,
      hitRate: 100,
      continueSelect: !1,
      continueSelectWithoutDeselect: !1,
      toggleContinueSelect: null,
      toggleContinueSelectWithoutDeselect: null,
      keyContainer: null,
      scrollOptions: null,
      checkInput: !1,
      preventDefault: !1,
      boundContainer: !1,
      preventDragFromInside: !0,
      dragCondition: null,
      rootContainer: null,
      checkOverflow: !1,
      innerScrollOptions: !1,
      getElementRect: xi,
      cspNonce: "",
      ratio: 0
    }, r);
    var o = a.options.portalContainer;
    return o && (i = o.parentElement), a.container = i || document.body, a.initElement(), a.initDragScroll(), a.setKeyController(), a;
  }
  var n = e.prototype;
  return n.setSelectedTargets = function(r) {
    var a = this.selectedTargets, i = br(a, r), o = i.added, s = i.removed, l = i.prevList, c = i.list;
    return this.selectedTargets = r, {
      added: o.map(function(u) {
        return c[u];
      }),
      removed: s.map(function(u) {
        return l[u];
      }),
      beforeSelected: a,
      selected: r
    };
  }, n.setSelectedTargetsByPoints = function(r, a) {
    var i = Math.min(r[0], a[0]), o = Math.min(r[1], a[1]), s = Math.max(r[0], a[0]), l = Math.max(r[1], a[1]), c = {
      left: i,
      top: o,
      right: s,
      bottom: l,
      width: s - i,
      height: l - o
    }, u = {
      ignoreClick: !0
    };
    this.findSelectableTargets(u);
    var f = this.hitTest(c, u, !0, null), d = this.setSelectedTargets(f);
    return oe(oe({}, d), {
      rect: c
    });
  }, n.selectTargetsByPoints = function(r, a) {
    var i = new MouseEvent("mousedown", {
      clientX: r[0],
      clientY: r[1],
      cancelable: !0,
      bubbles: !0
    }), o = new MouseEvent("mousemove", {
      clientX: a[0],
      clientY: a[1],
      cancelable: !0,
      bubbles: !0
    }), s = new MouseEvent("mousemove", {
      clientX: a[0],
      clientY: a[1],
      cancelable: !0,
      bubbles: !0
    }), l = this.gesto, c = l.onDragStart(i);
    c !== !1 && (l.onDrag(o), l.onDragEnd(s));
  }, n.getSelectedTargets = function() {
    return this.selectedTargets;
  }, n.triggerDragStart = function(r) {
    return this.gesto.triggerDragStart(r), this;
  }, n.destroy = function() {
    var r;
    this.off(), this.keycon && this.keycon.destroy(), this.gesto.unset(), this.injectResult.destroy(), this.dragScroll.dragEnd(), ne(document, "selectstart", this._onDocumentSelectStart), this.options.portalContainer || (r = this.target.parentElement) === null || r === void 0 || r.removeChild(this.target), this.keycon = null, this.gesto = null, this.injectResult = null, this.target = null, this.container = null, this.options = null;
  }, n.getElementPoints = function(r) {
    var a = this.getElementRect || xi, i = a(r), o = [i.pos1, i.pos2, i.pos4, i.pos3];
    if (a !== xi) {
      var s = r.getBoundingClientRect();
      return Ms(o, s);
    }
    return o;
  }, n.getSelectableElements = function() {
    var r = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (to(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (Ca(i))
        a.push(i);
      else if (Ae(i))
        a.push(i.value || i.current);
      else {
        var s = [].slice.call(sn(r).querySelectorAll(i));
        a.push.apply(a, s);
      }
    }), a;
  }, n.checkScroll = function() {
    if (this.gesto.isFlag()) {
      var r = this.scrollOptions, a = this.gesto.getEventData().innerScrollOptions, i = a || (r == null ? void 0 : r.container);
      i && this.dragScroll.checkScroll(oe({
        inputEvent: this.gesto.getCurrentEvent()
      }, a || r));
    }
  }, n.findSelectableTargets = function(r) {
    var a = this;
    r === void 0 && (r = this.gesto.getEventData());
    var i = this.getSelectableElements(), o = i.map(function(f) {
      return a.getElementPoints(f);
    });
    r.selectableTargets = i, r.selectablePoints = o, r.selectableParentMap = null;
    var s = this.options, l = s.checkOverflow || s.innerScrollOptions, c = sn(this.container);
    if (l) {
      var u = /* @__PURE__ */ new Map();
      r.selectableInnerScrollParentMap = u, r.selectableInnerScrollPathsList = i.map(function(f, d) {
        for (var h = f.parentElement, m = [], v = [], y = function() {
          var b = u.get(h);
          if (!b) {
            var S = getComputedStyle(h).overflow !== "visible";
            if (S) {
              var C = xi(h);
              b = {
                parentElement: h,
                indexes: [],
                points: [C.pos1, C.pos2, C.pos4, C.pos3],
                paths: ha([], v)
              }, m.push(h), m.forEach(function(k) {
                u.set(k, b);
              }), m = [];
            }
          }
          b ? (h = b.parentElement, u.get(h).indexes.push(d), v.push(h)) : m.push(h), h = h.parentElement;
        }; h && h !== c.body; )
          y();
        return v;
      });
    }
    return s.checkOverflow || (r.selectableInners = i.map(function() {
      return !0;
    })), this._refreshGroups(r), i;
  }, n.clickTarget = function(r, a) {
    var i = y1(r), o = i.clientX, s = i.clientY, l = {
      data: {
        selectFlag: !1
      },
      clientX: o,
      clientY: s,
      inputEvent: r,
      isClick: !0,
      isTrusted: !1,
      stop: function() {
        return !1;
      }
    };
    return this._onDragStart(l, a) && this._onDragEnd(l), this;
  }, n.setKeyController = function() {
    var r = this.options, a = r.keyContainer, i = r.toggleContinueSelect, o = r.toggleContinueSelectWithoutDeselect;
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new v1(a || Xe(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, n.setClassName = function(r) {
    this.options.className = r, this.target.setAttribute("class", "".concat(Vs, " ").concat(r || ""));
  }, n.setKeyEvent = function() {
    var r = this.options, a = r.toggleContinueSelect, i = r.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, n.setKeyContainer = function(r) {
    var a = this, i = this.options;
    Qo(i.keyContainer, r, function() {
      i.keyContainer = r, a.setKeyController();
    });
  }, n.getContinueSelect = function() {
    var r = this.options, a = r.continueSelect, i = r.toggleContinueSelect;
    return !i || !this._keydownContinueSelect ? a : !a;
  }, n.getContinueSelectWithoutDeselect = function() {
    var r = this.options, a = r.continueSelectWithoutDeselect, i = r.toggleContinueSelectWithoutDeselect;
    return !i || !this._keydownContinueSelectWithoutDeselection ? a : !a;
  }, n.setToggleContinueSelect = function(r) {
    var a = this, i = this.options;
    Qo(i.toggleContinueSelect, r, function() {
      i.toggleContinueSelect = r, a.setKeyEvent();
    });
  }, n.setToggleContinueSelectWithoutDeselect = function(r) {
    var a = this, i = this.options;
    Qo(i.toggleContinueSelectWithoutDeselect, r, function() {
      i.toggleContinueSelectWithoutDeselect = r, a.setKeyEvent();
    });
  }, n.setPreventDefault = function(r) {
    this.gesto.options.preventDefault = r;
  }, n.setCheckInput = function(r) {
    this.gesto.options.checkInput = r;
  }, n.initElement = function() {
    var r = this.options, a = r.dragContainer, i = r.checkInput, o = r.preventDefault, s = r.preventClickEventOnDragStart, l = r.preventClickEventOnDrag, c = r.preventClickEventByCondition, u = r.preventRightClick, f = u === void 0 ? !0 : u, d = r.className, h = this.container;
    this.target = Bh(S1("div", {
      className: "".concat(Vs, " ").concat(d || "")
    }), this.target, h);
    var m = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(sn(h).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new Sp(this.dragContainer, {
      checkWindowBlur: !0,
      container: Xe(h),
      checkInput: i,
      preventDefault: o,
      preventClickEventOnDragStart: s,
      preventClickEventOnDrag: l,
      preventClickEventByCondition: c,
      preventRightClick: f
    }).on({
      dragStart: this._onDragStart,
      drag: this._onDrag,
      dragEnd: this._onDragEnd
    }), se(document, "selectstart", this._onDocumentSelectStart), this.injectResult = Gh.inject(m, {
      nonce: this.options.cspNonce
    });
  }, n.hitTest = function(r, a, i, o) {
    var s = this.options, l = s.hitRate, c = s.selectByClick, u = r.left, f = r.top, d = r.right, h = r.bottom, m = a.innerGroups, v = a.innerWidth, y = a.innerHeight, b = o == null ? void 0 : o.clientX, S = o == null ? void 0 : o.clientY, C = a.ignoreClick, k = [[u, f], [d, f], [d, h], [u, h]], M = function(N, W) {
      var V = sr(typeof l == "function" ? "".concat(l(W)) : "".concat(l)), X = C ? !1 : Fi([b, S], N);
      if (!i && c && X)
        return !0;
      var J = Ts(k, N);
      if (!J.length)
        return !1;
      var et = la(J), at = 0;
      if (et === 0 && la(N) === 0 ? (at = Td(N), et = Td(J)) : at = la(N), V.unit === "px")
        return et >= V.value;
      var Q = zi(Math.round(et / at * 100), 0, 100);
      return Q >= Math.min(100, V.value);
    }, E = a.selectableTargets, D = a.selectablePoints, j = a.selectableInners;
    if (!m)
      return E.filter(function(N, W) {
        return j[W] ? M(D[W], E[W]) : !1;
      });
    for (var R = [], _ = Math.floor(u / v), x = Math.floor(d / v), P = Math.floor(f / y), I = Math.floor(h / y), A = _; A <= x; ++A) {
      var B = m[A];
      if (B)
        for (var q = P; q <= I; ++q) {
          var F = B[q];
          F && F.forEach(function(N) {
            var W = D[N], V = j[N], X = E[N];
            V && M(W, X) && R.push(X);
          });
        }
    }
    return b1(R);
  }, n.initDragScroll = function() {
    var r = this;
    this.dragScroll.on("scrollDrag", function(a) {
      var i = a.next;
      i(r.gesto.getCurrentEvent());
    }).on("scroll", function(a) {
      var i = a.container, o = a.direction, s = r.gesto.getEventData().innerScrollOptions;
      s ? r.emit("innerScroll", {
        container: i,
        direction: o
      }) : r.emit("scroll", {
        container: i,
        direction: o
      });
    }).on("move", function(a) {
      var i = a.offsetX, o = a.offsetY, s = a.inputEvent, l = r.gesto;
      if (!(!l || !l.isFlag())) {
        var c = r.gesto.getEventData(), u = c.boundArea;
        c.startX -= i, c.startY -= o;
        var f = r.gesto.getEventData().innerScrollOptions, d = f == null ? void 0 : f.container, h = !1;
        if (d) {
          var m = c.selectableInnerScrollParentMap, v = m.get(d);
          v && (v.paths.forEach(function(y) {
            var b = m.get(y);
            b.points.forEach(function(S) {
              S[0] -= i, S[1] -= o;
            });
          }), v.indexes.forEach(function(y) {
            c.selectablePoints[y].forEach(function(b) {
              b[0] -= i, b[1] -= o;
            });
          }), h = !0);
        }
        h || c.selectablePoints.forEach(function(y) {
          y.forEach(function(b) {
            b[0] -= i, b[1] -= o;
          });
        }), r._refreshGroups(c), u.left -= i, u.right -= i, u.top -= o, u.bottom -= o, r.gesto.scrollBy(i, o, s.inputEvent), r._checkSelected(r.gesto.getCurrentEvent());
      }
    });
  }, n._select = function(r, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = i.inputEvent, c = i.data, u = this.setSelectedTargets(r), f = br(c.startSelectedTargets, r), d = f.added, h = f.removed, m = f.prevList, v = f.list, y = {
      startSelected: m,
      startAdded: d.map(function(b) {
        return v[b];
      }),
      startRemoved: h.map(function(b) {
        return m[b];
      })
    };
    o && this.emit("selectStart", oe(oe(oe({}, u), y), {
      rect: a,
      inputEvent: l,
      data: c.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    })), (u.added.length || u.removed.length) && this.emit("select", oe(oe(oe({}, u), y), {
      rect: a,
      inputEvent: l,
      data: c.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    }));
  }, n._selectEnd = function(r, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = o.inputEvent, c = o.isDouble, u = o.data, f = l && l.type, d = f === "mousedown" || f === "touchstart", h = br(r, this.selectedTargets), m = h.added, v = h.removed, y = h.prevList, b = h.list, S = br(a, this.selectedTargets), C = S.added, k = S.removed, M = S.prevList, E = S.list;
    this.emit("selectEnd", {
      startSelected: r,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: m.map(function(D) {
        return b[D];
      }),
      removed: v.map(function(D) {
        return y[D];
      }),
      afterAdded: C.map(function(D) {
        return E[D];
      }),
      afterRemoved: k.map(function(D) {
        return M[D];
      }),
      isDragStart: d && s,
      isDragStartEnd: d && s,
      isClick: !!o.isClick,
      isDouble: !!c,
      rect: i,
      inputEvent: l,
      data: u.data,
      isTrusted: o.isTrusted
    });
  }, n._checkSelected = function(r, a) {
    a === void 0 && (a = Md(r, this.options.ratio));
    var i = r.data, o = a.top, s = a.left, l = a.width, c = a.height, u = i.selectFlag, f = i.containerX, d = i.containerY, h = i.scaleMatrix, m = Ei(h, [s - f, o - d]), v = Ei(h, [l, c]), y = [];
    if (u) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(m[0], "px, ").concat(m[1], "px);") + "width:".concat(v[0], "px;height:").concat(v[1], "px;");
      var b = this.hitTest(a, i, !0, r);
      y = Dd(i.startPassedTargets, b, this.continueSelect && this.continueSelectWithoutDeselect);
    }
    var S = this.emit("drag", oe(oe({}, r), {
      data: i.data,
      isSelect: u,
      rect: a
    }));
    if (S === !1) {
      this.target.style.cssText += "display: none;", r.stop();
      return;
    }
    u && this._select(y, a, r);
  }, n._sameCombiKey = function(r, a, i) {
    if (!a)
      return !1;
    var o = Lh(r.inputEvent, r.key), s = [].concat(a), l = re(s[0]) ? s : [s];
    if (i) {
      var c = r.key;
      return l.some(function(u) {
        return u.some(function(f) {
          return f === c;
        });
      });
    }
    return l.some(function(u) {
      return u.every(function(f) {
        return o.indexOf(f) > -1;
      });
    });
  }, n._findElement = function(r, a) {
    for (var i = r; i && !(a.indexOf(i) > -1); )
      i = i.parentElement;
    return i;
  }, n._refreshGroups = function(r) {
    var a, i = r.innerWidth, o = r.innerHeight, s = r.selectablePoints;
    if (this.options.checkOverflow) {
      var l = (a = this.gesto.getEventData().innerScrollOptions) === null || a === void 0 ? void 0 : a.container, c = r.selectableInnerScrollParentMap, u = r.selectableInnerScrollPathsList;
      r.selectableInners = u.map(function(h, m) {
        var v = !1;
        return h.every(function(y) {
          if (v)
            return !0;
          if (y === l)
            return v = !0, !0;
          var b = c.get(y);
          if (b) {
            var S = s[m], C = b.points, k = Ts(S, C);
            if (!k.length)
              return !1;
          }
          return !0;
        });
      });
    }
    if (!i || !o)
      r.innerGroups = null;
    else {
      var f = r.selectablePoints, d = {};
      f.forEach(function(h, m) {
        var v = 1 / 0, y = -1 / 0, b = 1 / 0, S = -1 / 0;
        h.forEach(function(M) {
          var E = Math.floor(M[0] / i), D = Math.floor(M[1] / o);
          v = Math.min(E, v), y = Math.max(E, y), b = Math.min(D, b), S = Math.max(D, S);
        });
        for (var C = v; C <= y; ++C)
          for (var k = b; k <= S; ++k)
            d[C] = d[C] || {}, d[C][k] = d[C][k] || [], d[C][k].push(m);
      }), r.innerGroups = d;
    }
  }, e = x1([O0(Jl, function(r, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = bs("get ".concat(a));
    r[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = bs("set ".concat(a));
    r[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(r, a, i);
  })], e), e;
})(ja), M1 = /* @__PURE__ */ (function(t) {
  Fh(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})(E1), Ks = function(t, e) {
  return Ks = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (n[a] = r[a]);
  }, Ks(t, e);
};
function D1(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Ks(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var qi = function() {
  return qi = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, qi.apply(this, arguments);
};
function T1(t, e, n, r) {
  var a = arguments.length, i = a < 3 ? e : r, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, n, r);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, n, i) : o(e, n)) || i);
  return a > 3 && i && Object.defineProperty(e, n, i), i;
}
var _d = $h.map(function(t) {
  return bs("on ".concat(t));
}), _1 = /* @__PURE__ */ (function(t) {
  D1(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var n = e.prototype;
  return n.render = function() {
    return $.createElement("div", {
      className: Vs,
      ref: $n(this, "selectionElement")
    });
  }, n.componentDidMount = function() {
    var r = this, a = this.props, i = {};
    C1.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new M1(qi(qi({}, i), {
      portalContainer: this.selectionElement
    })), $h.forEach(function(o, s) {
      r.selecto.on(o, function(l) {
        var c = r.props, u = c[_d[s]] && c[_d[s]](l);
        u === !1 && l.stop();
      });
    });
  }, n.componentDidUpdate = function(r) {
    var a = this.props, i = this.selecto;
    Jl.forEach(function(o) {
      r[o] !== a[o] && (i[o] = a[o]);
    });
  }, n.componentWillUnmount = function() {
    this.selecto.destroy();
  }, T1([sp(k1)], e.prototype, "selecto", void 0), e;
})($.PureComponent);
function yi(t, e, n) {
  const r = e + n;
  if (r < 0 || r >= t.length) return t.slice();
  const a = t.slice(), [i] = a.splice(e, 1);
  return a.splice(r, 0, i), a;
}
function j1({ recipe: t, onChange: e }) {
  const { t: n } = It(), r = (u) => e({ ...t, ...u }), a = (u) => {
    var f;
    return ((f = t.display.find((d) => d.slot === u)) == null ? void 0 : f.name) ?? `#${u}`;
  }, i = (u) => {
    var f;
    return ((f = t.display.find((d) => d.slot === u)) == null ? void 0 : f.colour) ?? "#888";
  }, o = (u, f) => r({ columns: t.columns.map((d, h) => h === u ? { ...d, ...f } : d) }), s = new Set(t.columns.filter((u) => u.kind === "channel").map((u) => u.slot)), l = t.columns.some((u) => u.kind === "merge"), c = t.display.filter((u) => !s.has(u.slot));
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-cellpanel-editor", children: [
    /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: n("Cells from the Images tab as rows and image channels as columns; every part can be changed here. The pictures are drawn from the file's images.") }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
      n("Title"),
      /* @__PURE__ */ g.jsx("input", { value: t.title ?? "", onChange: (u) => r({ title: u.target.value }) })
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("Tile size"),
      /* @__PURE__ */ g.jsx("input", { type: "number", min: 16, max: 240, value: t.tile, onChange: (u) => r({ tile: Math.max(16, Math.min(240, Math.round(Number(u.target.value) || 64))) }) })
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("Exposure"),
      /* @__PURE__ */ g.jsx("input", { type: "range", min: -2, max: 2, step: 0.05, value: Math.log2(t.exposure), onChange: (u) => r({ exposure: Math.pow(2, Number(u.target.value)) }) })
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: t.transpose === !0, onChange: (u) => r({ transpose: u.target.checked }) }),
      n("Cells as columns")
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: t.showHeaders !== !1, onChange: (u) => r({ showHeaders: u.target.checked }) }),
      n("Channel names")
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: t.showLabels !== !1, onChange: (u) => r({ showLabels: u.target.checked }) }),
      n("Cell labels")
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: t.outline === !0, onChange: (u) => r({ outline: u.target.checked }) }),
      n("Mask outline")
    ] }),
    /* @__PURE__ */ g.jsx("div", { className: "gl-cellpanel-section", children: n("Channels shown") }),
    /* @__PURE__ */ g.jsx("ol", { className: "gl-cellpanel-list", "aria-label": n("Channels shown"), children: t.columns.map((u, f) => {
      var d;
      return /* @__PURE__ */ g.jsxs("li", { className: "gl-cellpanel-row" + (u.hidden ? " is-off" : ""), children: [
        /* @__PURE__ */ g.jsx(
          "input",
          {
            type: "checkbox",
            checked: !u.hidden,
            "aria-label": n("Show {column}", { column: u.header || a(u.slot ?? -1) }),
            title: n("Show this column"),
            disabled: !u.hidden && t.columns.filter((h) => !h.hidden).length <= 1,
            onChange: (h) => o(f, { hidden: !h.target.checked })
          }
        ),
        u.kind === "channel" && u.slot !== void 0 ? /* @__PURE__ */ g.jsx("span", { className: "gl-cell-chip", style: { background: u.grey ? "#bdbdbd" : i(u.slot) }, title: a(u.slot) }) : /* @__PURE__ */ g.jsx("span", { className: "gl-cellpanel-merge-mark", title: n("Merge"), children: "+" }),
        /* @__PURE__ */ g.jsx(
          "input",
          {
            className: "gl-cellpanel-text",
            value: u.header,
            "aria-label": n("Column name"),
            onChange: (h) => o(f, { header: h.target.value })
          }
        ),
        u.kind === "channel" && u.slot !== void 0 && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
          /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: n("Draw this channel in grey rather than its colour"), children: [
            /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: u.grey === !0, onChange: (h) => o(f, { grey: h.target.checked }) }),
            n("Grey")
          ] }),
          /* @__PURE__ */ g.jsx(
            "input",
            {
              type: "range",
              min: -2,
              max: 2,
              step: 0.05,
              "aria-label": n("Brightness of {channel}", { channel: a(u.slot) }),
              title: n("Brightness of {channel}", { channel: a(u.slot) }),
              value: Math.log2(((d = t.gain) == null ? void 0 : d[u.slot]) ?? 1),
              onChange: (h) => r({ gain: { ...t.gain ?? {}, [u.slot]: Math.pow(2, Number(h.target.value)) } })
            }
          )
        ] }),
        u.kind === "merge" && /* @__PURE__ */ g.jsx("span", { className: "gl-cellpanel-merge", children: t.display.map((h) => /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: h.name, children: [
          /* @__PURE__ */ g.jsx(
            "input",
            {
              type: "checkbox",
              checked: (u.slots ?? []).includes(h.slot),
              onChange: (m) => {
                const v = new Set(u.slots ?? []);
                m.target.checked ? v.add(h.slot) : v.delete(h.slot), o(f, { slots: t.display.map((y) => y.slot).filter((y) => v.has(y)) });
              }
            }
          ),
          /* @__PURE__ */ g.jsx("span", { className: "gl-cell-chip", style: { background: h.colour } })
        ] }, h.slot)) }),
        /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Move up"), "aria-label": n("Move up"), disabled: f === 0, onClick: () => r({ columns: yi(t.columns, f, -1) }), children: /* @__PURE__ */ g.jsx(Zc, { size: 12 }) }),
        /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Move down"), "aria-label": n("Move down"), disabled: f === t.columns.length - 1, onClick: () => r({ columns: yi(t.columns, f, 1) }), children: /* @__PURE__ */ g.jsx(Jc, { size: 12 }) }),
        u.kind === "merge" && /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Remove"), "aria-label": n("Remove"), onClick: () => r({ columns: t.columns.filter((h, m) => m !== f) }), children: /* @__PURE__ */ g.jsx(Qc, { size: 12 }) })
      ] }, `${u.kind}-${u.slot ?? "m"}-${f}`);
    }) }),
    (c.length > 0 || !l) && /* @__PURE__ */ g.jsxs(
      "select",
      {
        className: "gl-cellpanel-add",
        value: "",
        "aria-label": n("Add a column"),
        onChange: (u) => {
          const f = u.target.value;
          if (f === "merge")
            r({ columns: [...t.columns, { kind: "merge", slots: t.display.filter((d) => d.enabled).map((d) => d.slot), header: n("Merge") }] });
          else if (f) {
            const d = Number(f);
            r({ columns: [...t.columns, { kind: "channel", slot: d, header: a(d) }] });
          }
        },
        children: [
          /* @__PURE__ */ g.jsx("option", { value: "", children: n("Add a column…") }),
          c.map((u) => /* @__PURE__ */ g.jsx("option", { value: String(u.slot), children: u.name }, u.slot)),
          !l && /* @__PURE__ */ g.jsx("option", { value: "merge", children: n("Merge") })
        ]
      }
    ),
    /* @__PURE__ */ g.jsx("div", { className: "gl-cellpanel-section", children: n("Cells shown") }),
    /* @__PURE__ */ g.jsx("ol", { className: "gl-cellpanel-list", "aria-label": n("Cells shown"), children: t.cells.map((u, f) => /* @__PURE__ */ g.jsxs("li", { className: "gl-cellpanel-row", children: [
      /* @__PURE__ */ g.jsx(
        "input",
        {
          className: "gl-cellpanel-text",
          value: u.label,
          "aria-label": n("Label of event {index}", { index: u.event.toLocaleString() }),
          onChange: (d) => r({ cells: t.cells.map((h, m) => m === f ? { ...h, label: d.target.value } : h) })
        }
      ),
      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Move up"), "aria-label": n("Move up"), disabled: f === 0, onClick: () => r({ cells: yi(t.cells, f, -1) }), children: /* @__PURE__ */ g.jsx(Zc, { size: 12 }) }),
      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Move down"), "aria-label": n("Move down"), disabled: f === t.cells.length - 1, onClick: () => r({ cells: yi(t.cells, f, 1) }), children: /* @__PURE__ */ g.jsx(Jc, { size: 12 }) }),
      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Remove"), "aria-label": n("Remove"), disabled: t.cells.length <= 1, onClick: () => r({ cells: t.cells.filter((d, h) => h !== f) }), children: /* @__PURE__ */ g.jsx(Qc, { size: 12 }) })
    ] }, `${u.event}-${f}`)) })
  ] });
}
const I1 = "http://www.w3.org/2000/svg";
function R1(t, e, n, r, a, i) {
  const o = e.querySelector("svg.gl-layout-shape > .gl-layout-shape-art");
  if (!o) return !1;
  const s = Number(e.dataset.zoom) || 1, l = document.createElementNS(I1, "g");
  l.setAttribute("id", i ?? An("shape", r, a)), l.setAttribute("transform", `translate(${jd(n.left)},${jd(n.top)})${s === 1 ? "" : ` scale(${s})`}`);
  for (const c of [...o.children]) {
    const u = c.cloneNode(!0);
    u.removeAttribute("class"), l.appendChild(u);
  }
  return t.appendChild(l), !0;
}
const jd = (t) => Math.round(t * 1e3) / 1e3, P1 = "http://www.w3.org/2000/svg";
function N1(t) {
  if (typeof document.createRange != "function") return null;
  const e = document.createRange();
  if (typeof e.getBoundingClientRect != "function") return null;
  const n = [], r = document.createTreeWalker(t, NodeFilter.SHOW_TEXT);
  for (let a = r.nextNode(); a; a = r.nextNode()) {
    const i = a.textContent ?? "";
    for (let o = 0; o < i.length; o++) {
      e.setStart(a, o), e.setEnd(a, o + 1);
      const s = e.getBoundingClientRect();
      if (!s.width && !s.height) continue;
      const l = n.at(-1);
      l && Math.abs(l.top - s.top) < 1 ? (l.text += i[o], l.width = s.right - l.left) : i[o].trim() && n.push({ text: i[o], left: s.left, top: s.top, width: s.width, height: s.height });
    }
  }
  return n.length ? n : null;
}
function O1(t, e, n, r) {
  const { box: a, padding: i, align: o, fontSize: s } = n;
  if (e != null && e.length)
    return e.flatMap((u) => {
      const f = u.text.trim();
      if (!f) return [];
      const d = r(u);
      return [{ text: f, x: d.left, y: d.top + s * 0.82, anchor: "start" }];
    });
  const l = t.trim();
  if (!l) return [];
  const c = a.top + i.top + s * 0.82;
  return o === "center" ? [{ text: l, x: a.left + i.left + (a.width - i.left - i.right) / 2, y: c, anchor: "middle" }] : o === "right" || o === "end" ? [{ text: l, x: a.left + a.width - i.right, y: c, anchor: "end" }] : [{ text: l, x: a.left + i.left, y: c, anchor: "start" }];
}
function A1(t, e, n, r) {
  for (const a of e) {
    const i = document.createElementNS(P1, "text");
    i.setAttribute("x", String(a.x)), i.setAttribute("y", String(a.y)), a.anchor !== "start" && i.setAttribute("text-anchor", a.anchor), i.setAttribute("font-size", String(n)), i.setAttribute("font-family", r.fontFamily || Ma), i.setAttribute("font-weight", r.fontWeight || "400"), i.setAttribute("fill", r.color || "#1e293b"), i.textContent = a.text, t.appendChild(i);
  }
}
const Id = 8 * 1024 * 1024, z1 = ".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg", L1 = "http://www.w3.org/2000/svg";
function qs(t) {
  return t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / (1024 * 1024)).toFixed(1)} MB`;
}
function F1(t) {
  return new TextEncoder().encode(t.content).length;
}
function B1(t) {
  if (t.length >= 8 && t[0] === 137 && t[1] === 80 && t[2] === 78 && t[3] === 71 && t[4] === 13 && t[5] === 10 && t[6] === 26 && t[7] === 10) return "image/png";
  if (t.length >= 3 && t[0] === 255 && t[1] === 216 && t[2] === 255) return "image/jpeg";
  const e = new TextDecoder().decode(t.subarray(0, 4096));
  return /<svg[\s>]/i.test(e) ? "image/svg+xml" : null;
}
function G1(t, e) {
  if (e === "image/png") {
    if (t.length < 24) return null;
    const r = new DataView(t.buffer, t.byteOffset, t.byteLength), a = r.getUint32(16), i = r.getUint32(20);
    return a > 0 && i > 0 ? { width: a, height: i } : null;
  }
  let n = 2;
  for (; n + 9 < t.length; ) {
    if (t[n] !== 255) return null;
    const r = t[n + 1];
    if (r === 255) {
      n += 1;
      continue;
    }
    if (r >= 192 && r <= 207 && r !== 196 && r !== 200 && r !== 204) {
      const i = t[n + 5] << 8 | t[n + 6], o = t[n + 7] << 8 | t[n + 8];
      return o > 0 && i > 0 ? { width: o, height: i } : null;
    }
    n += 2 + (t[n + 2] << 8 | t[n + 3]);
  }
  return null;
}
const $1 = { "": 1, px: 1, pt: 96 / 72, pc: 16, mm: 96 / 25.4, cm: 96 / 2.54, in: 96 };
function Rd(t) {
  const e = t == null ? void 0 : t.trim().match(/^([0-9]*\.?[0-9]+(?:e[-+]?\d+)?)\s*(px|pt|pc|mm|cm|in)?$/i);
  if (!e) return null;
  const n = Number(e[1]) * $1[(e[2] ?? "").toLowerCase()];
  return Number.isFinite(n) && n > 0 ? n : null;
}
function Wh(t) {
  const e = (t.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
  return e.length === 4 && e.every(Number.isFinite) && e[2] > 0 && e[3] > 0 ? { width: e[2], height: e[3] } : null;
}
function Yh(t) {
  const e = Rd(t.getAttribute("width")), n = Rd(t.getAttribute("height")), r = Wh(t), a = (i) => Math.round(i * 100) / 100;
  return e && n ? { width: a(e), height: a(n) } : r && e ? { width: a(e), height: a(e * r.height / r.width) } : r && n ? { width: a(n * r.width / r.height), height: a(n) } : r ? { width: a(r.width), height: a(r.height) } : { width: e ?? 300, height: n ?? 150 };
}
function Hh(t) {
  const e = new DOMParser().parseFromString(t, "image/svg+xml"), n = e.documentElement;
  return !n || n.localName !== "svg" || n.namespaceURI !== L1 || e.getElementsByTagName("parsererror").length ? null : n;
}
function W1(t) {
  let e = "";
  for (let n = 0; n < t.length; n += 32768) e += String.fromCharCode(...t.subarray(n, n + 32768));
  return btoa(e);
}
async function Y1(t, e) {
  if (t.size > Id)
    return { error: e("{name} is {size}; a placed image can be at most {limit}.", { name: t.name, size: qs(t.size), limit: qs(Id) }) };
  const n = new Uint8Array(await t.arrayBuffer()), r = B1(n);
  if (!r) return { error: e("{name} is not an SVG, PNG or JPEG file.", { name: t.name }) };
  const a = t.name || "image";
  if (r === "image/svg+xml") {
    const o = new TextDecoder().decode(n), s = Hh(o);
    if (!s) return { error: e("{name} could not be read as SVG.", { name: t.name }) };
    const l = Yh(s);
    return { recipe: { kind: "image", fileName: a, mediaType: r, naturalWidth: l.width, naturalHeight: l.height, content: o } };
  }
  const i = G1(n, r);
  return i ? { recipe: { kind: "image", fileName: a, mediaType: r, naturalWidth: i.width, naturalHeight: i.height, content: `data:${r};base64,${W1(n)}` } } : { error: e("{name} could not be read as {type}.", { name: t.name, type: r === "image/png" ? "PNG" : "JPEG" }) };
}
function Ql() {
  return new Promise((t) => {
    const e = document.createElement("input");
    e.type = "file", e.accept = z1, e.addEventListener("change", () => {
      var n;
      return t(((n = e.files) == null ? void 0 : n[0]) ?? null);
    }, { once: !0 }), e.addEventListener("cancel", () => t(null), { once: !0 }), e.click();
  });
}
function H1(t, e) {
  const n = Ln(e), r = ia(e.marginMm), a = { width: Math.max(1, n.width - 2 * r), height: Math.max(1, n.height - 2 * r) }, i = Math.min(1, a.width / t.naturalWidth, a.height / t.naturalHeight), o = (s) => Math.max(1, i < 1 ? Math.floor(s * i + 1e-6) : Math.round(s));
  return { width: o(t.naturalWidth), height: o(t.naturalHeight) };
}
const X1 = /* @__PURE__ */ new Set(["script", "foreignobject", "iframe", "object", "embed", "audio", "video", "handler", "listener", "set", "animate", "animatemotion", "animatetransform", "animatecolor"]), Xh = /url\(\s*(['"]?)(?!\s*#|\s*data:image\/)[^)]*\1\s*\)/gi, V1 = (t) => /^\s*(#|data:image\/)/i.test(t);
function Vh(t, e) {
  return t.replace(/url\(\s*(['"]?)#([^'")\s]+)\1\s*\)/g, (n, r, a) => e.has(a) ? `url(${r}#${e.get(a)}${r})` : n);
}
function K1(t, e, n) {
  const r = t.replace(/@import[^;]*;?/gi, "").replace(Xh, "none");
  return Vh(r, n).replace(/([^{}]*)\{/g, (a, i) => {
    var c;
    const o = i.trim();
    if (!o || o.startsWith("@")) return a;
    const s = i.replace(/#([A-Za-z_][\w-]*)/g, (u, f) => n.has(f) ? `#${n.get(f)}` : u);
    return e ? `${((c = i.match(/^\s*/)) == null ? void 0 : c[0]) ?? ""}${s.trim().split(",").map((u) => `#${e} ${u.trim()}`).join(", ")} {` : `${s}{`;
  });
}
function Kh(t, e = {}) {
  const n = Hh(t);
  if (!n) return null;
  for (const o of [...n.querySelectorAll("*")]) X1.has(o.localName.toLowerCase()) && o.remove();
  const r = [n, ...n.querySelectorAll("*")], a = /* @__PURE__ */ new Map();
  if (e.idPrefix) for (const o of r) {
    const s = o.getAttribute("id");
    s && a.set(s, `${e.idPrefix}${s}`);
  }
  for (const o of r) {
    for (const s of [...o.attributes]) {
      const l = s.localName.toLowerCase();
      if (l.startsWith("on")) {
        o.removeAttributeNode(s);
        continue;
      }
      if (l === "href") {
        if (!V1(s.value)) {
          o.removeAttributeNode(s);
          continue;
        }
        const c = s.value.trim().slice(1);
        s.value.trim().startsWith("#") && a.has(c) && (s.value = `#${a.get(c)}`);
        continue;
      }
      if (l === "id" && a.has(s.value)) {
        s.value = a.get(s.value);
        continue;
      }
      /url\(/i.test(s.value) && (s.value = Vh(s.value.replace(Xh, "none"), a));
    }
    o.localName === "style" && (o.textContent = K1(o.textContent ?? "", e.scope, a));
  }
  const i = e.natural ?? Yh(n);
  return Wh(n) || n.setAttribute("viewBox", `0 0 ${i.width} ${i.height}`), n.setAttribute("preserveAspectRatio", "none"), e.scope && n.setAttribute("id", e.scope), n;
}
function q1(t) {
  if (t.mediaType !== "image/svg+xml") return t.content;
  const e = Kh(t.content, { natural: { width: t.naturalWidth, height: t.naturalHeight } });
  return e ? (e.setAttribute("width", String(t.naturalWidth)), e.setAttribute("height", String(t.naturalHeight)), `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(e))}`) : "";
}
function U1(t) {
  const e = "data:image/svg+xml;charset=utf-8,";
  if (!t.startsWith(e)) return null;
  try {
    return decodeURIComponent(t.slice(e.length));
  } catch {
    return null;
  }
}
function Us(t) {
  const e = Number(t.dataset.rotation);
  return e === 90 || e === 180 || e === 270 ? e : 0;
}
function qh(t, e, n) {
  if (!n) return t;
  const r = e.left + e.width / 2, a = e.top + e.height / 2, i = t.left + t.width / 2 - r, o = t.top + t.height / 2 - a, [s, l] = n === 90 ? [o, -i] : n === 180 ? [-i, -o] : [-o, i], c = n !== 180, u = c ? t.height : t.width, f = c ? t.width : t.height;
  return { left: r + s - u / 2, top: a + l - f / 2, width: u, height: f };
}
function Uh(t, e, n) {
  n && t.setAttribute("transform", `rotate(${n} ${Pd(e.left + e.width / 2)} ${Pd(e.top + e.height / 2)})`);
}
const Pd = (t) => Math.round(t * 1e3) / 1e3, Nd = "http://www.w3.org/2000/svg";
function Z1(t, e, n, r) {
  const a = e.querySelector("img.gl-layout-placed-image");
  if (!a) return !1;
  const i = a.getAttribute("src") ?? "", o = document.createElementNS(Nd, "g");
  o.setAttribute("id", r);
  const s = Us(e);
  Uh(o, n, s);
  const l = qh(n, n, s), c = (f) => {
    f.setAttribute("x", String(bi(l.left))), f.setAttribute("y", String(bi(l.top))), f.setAttribute("width", String(bi(l.width))), f.setAttribute("height", String(bi(l.height))), o.appendChild(f);
  }, u = U1(i);
  if (u !== null) {
    const f = Kh(u, { idPrefix: `${r}-`, scope: `${r}-art` });
    f && c(document.importNode(f, !0));
  } else if (/^data:image\/(png|jpeg);base64,/.test(i)) {
    const f = document.createElementNS(Nd, "image");
    f.setAttribute("href", i), f.setAttribute("preserveAspectRatio", "none"), c(f);
  }
  return t.appendChild(o), !0;
}
const bi = (t) => Math.round(t * 1e3) / 1e3, Di = "http://www.w3.org/2000/svg";
function qC(t, e) {
  t.__layoutCanvas = e;
}
function UC(t, e, n, r, a, i) {
  if (!e) {
    i === void 0 ? t.fillText(n, r, a) : t.fillText(n, r, a, i);
    return;
  }
  const o = /^(?:(?:normal|italic|oblique)\s+)?(?:(normal|bold|\d{3})\s+)?([\d.]+)px\s+(.+)$/.exec(t.font.trim()), s = i !== void 0 && t.measureText(n).width > i ? i : void 0;
  e.push({
    text: n,
    x: r,
    y: a,
    size: o ? Number(o[2]) : 10,
    weight: (o == null ? void 0 : o[1]) === "bold" ? "700" : (o == null ? void 0 : o[1]) ?? "400",
    family: (o == null ? void 0 : o[3]) ?? Ma,
    fill: typeof t.fillStyle == "string" ? t.fillStyle : "#000000",
    align: t.textAlign,
    baseline: t.textBaseline,
    ...s !== void 0 ? { fit: s } : {}
  });
}
const J1 = 16384;
function Q1(t, e, n, r, a, i, o) {
  var v;
  const s = e.querySelector(".gl-layout-imagewall > canvas, .gl-layout-cellpanel > canvas");
  if (!s) return !1;
  const l = a ?? An((v = s.parentElement) != null && v.classList.contains("gl-layout-cellpanel") ? "cellpanel" : "imagewall", i, o), c = n(s), u = document.createElementNS(Di, "g");
  u.setAttribute("id", l), u.setAttribute("transform", `translate(${zn(c.left)},${zn(c.top)})`);
  const f = document.createElementNS(Di, "image");
  f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("width", String(zn(c.width))), f.setAttribute("height", String(zn(c.height))), f.setAttribute("id", `${l}-images`), u.appendChild(f);
  const d = s.__layoutCanvas, h = [];
  let m = null;
  if (d && d.width > 0 && d.height > 0) {
    const y = c.width / d.width, b = Math.min(Math.max(0.05, y * r / 96), J1 / Math.max(d.width, d.height)), S = document.createElement("canvas");
    S.width = Math.max(1, Math.ceil(d.width * b)), S.height = Math.max(1, Math.ceil(d.height * b));
    const C = S.getContext("2d");
    if (C)
      try {
        C.setTransform(b, 0, 0, b, 0, 0), d.draw(C, h), m = S.toDataURL("image/png");
        const k = document.createElementNS(Di, "g");
        k.setAttribute("transform", `scale(${zn(y)})`);
        for (const M of h) k.appendChild(tw(M));
        h.length && u.appendChild(k);
      } catch {
        m = null;
      }
  }
  return f.setAttribute("href", m ?? s.toDataURL("image/png")), t.appendChild(u), !0;
}
function tw(t) {
  const e = document.createElementNS(Di, "text"), n = t.align === "center" ? "middle" : t.align === "right" || t.align === "end" ? "end" : "start", r = t.baseline === "middle" ? 0.35 : t.baseline === "bottom" || t.baseline === "ideographic" ? -0.21 : t.baseline === "top" || t.baseline === "hanging" ? 0.8 : 0;
  return e.setAttribute("x", String(zn(t.x))), e.setAttribute("y", String(zn(t.y + r * t.size))), e.setAttribute("font-size", String(t.size)), e.setAttribute("font-family", t.family), e.setAttribute("font-weight", t.weight), e.setAttribute("fill", t.fill), n !== "start" && e.setAttribute("text-anchor", n), t.fit !== void 0 && (e.setAttribute("textLength", String(zn(t.fit))), e.setAttribute("lengthAdjust", "spacingAndGlyphs")), e.setAttribute("xml:space", "preserve"), e.textContent = t.text, e;
}
const zn = (t) => Math.round(t * 1e3) / 1e3, Od = "http://www.w3.org/2000/svg";
function ew(t, e) {
  return !!t.querySelector("b, i, sup, sub") || e.fontStyle === "italic" || e.textAlign === "center" || e.textAlign === "right";
}
function Ad(t) {
  const e = [], n = (r) => {
    var a;
    for (const i of Array.from(r.childNodes))
      if (i.nodeType === 3) {
        const o = i, s = Bf(o, t);
        for (let l = 0; l < o.data.length; l++) e.push({ ch: o.data[l], node: o, index: l, run: { ...s, text: o.data[l] } });
      } else i.nodeName === "BR" ? !((a = i.dataset) != null && a.tail) && (i.nextSibling || i.parentNode !== t) && e.push({ ch: `
`, node: null, index: 0, run: { text: `
` } }) : n(i);
  };
  return n(t), e;
}
function nw(t, e, n) {
  const r = t instanceof HTMLTextAreaElement ? null : t, a = () => {
    const l = r ? Ad(r) : [...t.value].map((u) => ({ run: { text: u } })), c = [{ runs: [], left: 0, top: 0 }];
    for (const u of l)
      u.run.text === `
` ? c.push({ runs: [], left: 0, top: c.length * n * 1.3 }) : c[c.length - 1].runs.push(u.run);
    return c;
  };
  if (typeof document.createRange != "function") return a();
  const i = document.createRange();
  if (typeof i.getBoundingClientRect != "function") return a();
  const o = (parseFloat(e.paddingLeft) || 0) + (parseFloat(e.paddingRight) || 0), s = document.createElement("div");
  Object.assign(s.style, {
    position: "fixed",
    left: "-100000px",
    top: "0",
    visibility: "hidden",
    width: `${Math.max(1, t.clientWidth - o)}px`,
    boxSizing: "content-box",
    padding: "0",
    margin: "0",
    border: "0",
    fontFamily: e.fontFamily,
    fontSize: e.fontSize,
    fontWeight: e.fontWeight,
    fontStyle: e.fontStyle,
    lineHeight: e.lineHeight,
    letterSpacing: e.letterSpacing,
    textAlign: e.textAlign,
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordBreak: e.wordBreak
  }), s.className = "gl-layout-text-surface", r ? s.append(...Array.from(r.childNodes).map((l) => l.cloneNode(!0))) : s.textContent = t.value, document.body.appendChild(s);
  try {
    const l = s.getBoundingClientRect(), c = [];
    let u = !0;
    for (const f of Ad(s)) {
      if (f.ch === `
` || !f.node) {
        u = !0;
        continue;
      }
      i.setStart(f.node, f.index), i.setEnd(f.node, f.index + 1);
      const d = i.getBoundingClientRect();
      if (!d.width && !d.height) continue;
      const h = d.top - l.top, m = h + d.height / 2, v = c.at(-1), y = f.run.sup || f.run.sub;
      v && !u && m < v.bottom ? (v.runs.push(f.run), !y && v.runs.every((b) => b === f.run || b.sup || b.sub) && (v.top = h, v.bottom = h + d.height)) : c.push({ runs: [f.run], left: d.left - l.left, top: h, bottom: h + d.height }), u = !1;
    }
    return c.length ? c : a();
  } finally {
    s.remove();
  }
}
function rw(t, e, n, r) {
  const a = getComputedStyle(e);
  if (!ew(e, a)) return !1;
  const i = (parseFloat(a.fontSize) || 14) * r, o = (parseFloat(a.paddingLeft) || 0) * r, s = (parseFloat(a.paddingRight) || 0) * r, l = (parseFloat(a.paddingTop) || 0) * r, c = n.left + o, u = Math.max(0, n.width - o - s), f = a.textAlign === "center" ? "middle" : a.textAlign === "right" ? "end" : "start", d = a.fontWeight || "400";
  for (const h of nw(e, a, i / r)) {
    const m = Fr(h.runs);
    for (; m.length && /\s$/.test(m[m.length - 1].text); ) {
      const b = m[m.length - 1];
      b.text = b.text.replace(/\s+$/, ""), b.text || m.pop();
    }
    if (!m.length) continue;
    const v = document.createElementNS(Od, "text");
    v.setAttribute("x", String(f === "middle" ? c + u / 2 : f === "end" ? c + u : c + h.left * r)), v.setAttribute("y", String(n.top + l + h.top * r + i * 0.82)), v.setAttribute("font-size", String(i)), v.setAttribute("font-family", a.fontFamily || Ma), v.setAttribute("font-weight", d), a.fontStyle === "italic" && v.setAttribute("font-style", "italic"), f !== "start" && v.setAttribute("text-anchor", f), v.setAttribute("fill", a.color || "#1e293b"), v.setAttribute("xml:space", "preserve");
    let y = 0;
    for (const b of m) {
      const S = document.createElementNS(Od, "tspan");
      b.bold && S.setAttribute("font-weight", "700"), b.italic && S.setAttribute("font-style", "italic");
      const C = b.sup ? -0.33 * i : b.sub ? Lm * i : 0;
      C !== y && S.setAttribute("dy", String(+(C - y).toFixed(3))), y = C, (b.sup || b.sub) && S.setAttribute("font-size", String(+(i * zm).toFixed(3))), S.textContent = b.text, v.appendChild(S);
    }
    t.appendChild(v);
  }
  return !0;
}
function aw(t, e) {
  const n = gv(t ?? "");
  if (!n) return null;
  const r = /^[A-Za-z_]/.test(n) ? n : `_${n}`;
  let a = r;
  for (let i = 2; e.has(a); i++) a = `${r}-${i}`;
  return e.add(a), a;
}
const He = "http://www.w3.org/2000/svg";
function wi(t, e) {
  const n = URL.createObjectURL(t), r = document.createElement("a");
  r.href = n, r.download = e, document.body.appendChild(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
function Dn(t, e, n, r = { x: 0, y: 0 }) {
  const a = t.getBoundingClientRect();
  return {
    left: (a.left - e.left) / n - r.x,
    top: (a.top - e.top) / n - r.y,
    width: a.width / n,
    height: a.height / n
  };
}
function iw(t, e, n, r, a, i) {
  e.forEach((o) => {
    if (!o.text) return;
    const s = document.createElementNS(He, "text");
    s.setAttribute("x", String(n + o.left)), s.setAttribute("y", String(r + o.top + a * 0.82)), s.setAttribute("font-size", String(a)), s.setAttribute("font-family", i.fontFamily || Ma), s.setAttribute("font-weight", i.fontWeight || "400"), s.setAttribute("fill", i.color || "#1e293b"), s.setAttribute("xml:space", "preserve"), s.textContent = o.text, t.appendChild(s);
  });
}
function ow(t, e) {
  if (typeof document.createRange != "function" || !e.trim()) return null;
  const n = document.createRange();
  if (typeof n.getBoundingClientRect != "function") return null;
  const r = getComputedStyle(t), a = (parseFloat(r.paddingLeft) || 0) + (parseFloat(r.paddingRight) || 0), i = document.createElement("div");
  Object.assign(i.style, {
    position: "fixed",
    left: "-100000px",
    top: "0",
    visibility: "hidden",
    width: `${Math.max(1, t.clientWidth - a)}px`,
    boxSizing: "content-box",
    padding: "0",
    margin: "0",
    border: "0",
    fontFamily: r.fontFamily,
    fontSize: r.fontSize,
    fontWeight: r.fontWeight,
    fontStyle: r.fontStyle,
    lineHeight: r.lineHeight,
    letterSpacing: r.letterSpacing,
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordBreak: r.wordBreak
  }), i.textContent = e, document.body.appendChild(i);
  try {
    const o = i.firstChild;
    if (!o) return null;
    const s = i.getBoundingClientRect(), l = [];
    for (let c = 0; c < e.length; c++) {
      if (e[c] === `
`) continue;
      n.setStart(o, c), n.setEnd(o, c + 1);
      const u = n.getBoundingClientRect();
      if (!u.width && !u.height) continue;
      const f = u.top - s.top, d = l.at(-1);
      d && Math.abs(d.top - f) < 1 ? d.text += e[c] : l.push({ text: e[c], left: u.left - s.left, top: f });
    }
    return l.length ? l : null;
  } finally {
    i.remove();
  }
}
function zd(t, e, n, r, a, i, o) {
  const s = Dn(e, n, r, i), l = document.createElementNS(He, "g");
  l.setAttribute("transform", `translate(${Math.round(s.left)},${Math.round(s.top)})`);
  const c = e.querySelector("canvas");
  if (c) {
    const f = document.createElementNS(He, "image"), d = Dn(c, n, r, i);
    f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("width", String(Math.round(d.width || s.width))), f.setAttribute("height", String(Math.round(d.height || s.height)));
    const h = d.width || s.width, m = c.offsetWidth || h, v = m > 0 ? h / m : 1;
    f.setAttribute("href", xv(e, a * v, Math.round(m)) ?? c.toDataURL("image/png")), l.appendChild(f);
  }
  const u = e.querySelector("svg");
  if (u) {
    const f = u.cloneNode(!0), d = u.clientWidth || Number(u.getAttribute("width")) || s.width, h = d > 0 ? s.width / d : 1;
    if (Math.abs(h - 1) > 1e-3) {
      const m = document.createElementNS(He, "g");
      m.setAttribute("transform", `scale(${h})`), m.appendChild(f), l.appendChild(m);
    } else l.appendChild(f);
  }
  yf(l, o), t.appendChild(l);
}
function Ld(t, e, n, r) {
  return [...t.querySelectorAll(".gl-layout-item")].sort((a, i) => (Number(a.style.zIndex) || 0) - (Number(i.style.zIndex) || 0)).map((a) => ({ item: a, frame: Dn(a, e, n, r) }));
}
function sw(t, e, n, r) {
  let a = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const { frame: f } of t)
    f.left >= e || f.top >= n || f.left + f.width <= 0 || f.top + f.height <= 0 || (a = Math.min(a, f.left), i = Math.min(i, f.top), o = Math.max(o, f.left + f.width), s = Math.max(s, f.top + f.height));
  if (!Number.isFinite(a)) return null;
  const l = Math.max(0, r) * or, c = Math.max(0, Math.floor(a - l)), u = Math.max(0, Math.floor(i - l));
  return { x: c, y: u, width: Math.min(e, Math.ceil(o + l)) - c, height: Math.min(n, Math.ceil(s + l)) - u };
}
function lw(t, e, n) {
  var y, b;
  const r = Ln(e.page), a = ya(e.page)[n.pageIndex ?? 0] ?? { x: 0, y: 0 }, i = t.getBoundingClientRect(), o = new DOMRect(i.left + t.clientLeft * n.zoom, i.top + t.clientTop * n.zoom, i.width, i.height), s = n.crop ? sw(Ld(t, o, n.zoom, a), r.width, r.height, n.crop.paddingMm) : null, l = s ? { x: a.x + s.x, y: a.y + s.y } : a, c = s ? s.width : r.width, u = s ? s.height : r.height, f = document.createElementNS(He, "svg");
  f.setAttribute("xmlns", He), f.setAttribute("width", String(c)), f.setAttribute("height", String(u)), f.setAttribute("viewBox", `0 0 ${c} ${u}`);
  const d = document.createElementNS(He, "rect");
  d.setAttribute("width", "100%"), d.setAttribute("height", "100%"), d.setAttribute("fill", "#ffffff"), f.appendChild(d);
  let h = 0;
  const m = /* @__PURE__ */ new Set();
  for (const { item: S, frame: C } of Ld(t, o, n.zoom, l)) {
    if (C.left >= c || C.top >= u || C.left + C.width <= 0 || C.top + C.height <= 0) continue;
    h += 1;
    const k = S.dataset.title ?? ((y = S.querySelector(".gl-layout-item-head span")) == null ? void 0 : y.textContent) ?? "", M = aw(S.dataset.objectName, m);
    if (R1(f, S, C, h, k, M)) continue;
    if (S.classList.contains("has-frame")) {
      const _ = document.createElementNS(He, "rect");
      _.setAttribute("x", String(Math.round(C.left) + 0.5)), _.setAttribute("y", String(Math.round(C.top) + 0.5)), _.setAttribute("width", String(Math.round(C.width) - 1)), _.setAttribute("height", String(Math.round(C.height) - 1)), _.setAttribute("fill", "none"), _.setAttribute("stroke", "#94a3b8"), _.setAttribute("id", An("frame", h, k)), f.appendChild(_);
    }
    if (Z1(f, S, C, M ?? An("image", h, k))) continue;
    const E = S.querySelector(".gl-layout-text-surface");
    if (E) {
      const _ = E instanceof HTMLTextAreaElement ? E.value : E.textContent ?? "", x = getComputedStyle(E), P = qh(Dn(E, o, n.zoom, l), C, Us(S)), I = Number(S.dataset.zoom) || 1, A = (parseFloat(x.fontSize) || 14) * I, B = (parseFloat(x.paddingLeft) || 0) * I, q = (parseFloat(x.paddingTop) || 0) * I, F = ((b = ow(E, _)) == null ? void 0 : b.map((W) => ({ text: W.text, left: W.left * I, top: W.top * I }))) ?? _.split(`
`).map((W, V) => ({ text: W, left: 0, top: V * A * 1.3 })), N = document.createElementNS(He, "g");
      N.setAttribute("id", M ?? An("text", h, _.trim().split(/\s+/).slice(0, 4).join(" "))), Uh(N, C, Us(S)), rw(N, E, P, I) || iw(N, F, P.left + B, P.top + q, A, x), f.appendChild(N);
      continue;
    }
    if (Q1(f, S, (_) => Dn(_, o, n.zoom, l), n.dpi, M, h, k)) continue;
    const D = S.querySelector(".gl-layout-plot-host");
    if (!D) continue;
    if (D.__miniPlotCfg) {
      zd(f, D, o, n.zoom, n.dpi, l, M ?? An("plot", h, k));
      continue;
    }
    const j = D.querySelector(".gl-prop-chart");
    if (j) {
      const _ = vv(j);
      if (_) {
        const x = Dn(j, o, n.zoom, l), P = _.width > 0 ? x.width / _.width : 1, I = document.createElementNS(He, "g");
        I.setAttribute("id", M ?? An("chart", h, k)), I.setAttribute("transform", `translate(${x.left},${x.top}) scale(${P})`), I.appendChild(_.root), f.appendChild(I);
      }
      continue;
    }
    D.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((_) => {
      const x = (_.textContent ?? "").trim();
      if (!x) return;
      const P = getComputedStyle(_), I = Dn(_, o, n.zoom, l), A = _.offsetWidth > 0 ? I.width / _.offsetWidth : 1, B = (parseFloat(P.fontSize) || 12) * A, q = {
        left: (parseFloat(P.paddingLeft) || 0) * A,
        right: (parseFloat(P.paddingRight) || 0) * A,
        top: (parseFloat(P.paddingTop) || 0) * A
      }, F = (W) => ({ left: (W.left - o.left) / n.zoom - l.x, top: (W.top - o.top) / n.zoom - l.y, width: W.width / n.zoom, height: W.height / n.zoom }), N = O1(x, N1(_), { box: I, padding: q, align: P.textAlign, fontSize: B }, F);
      A1(f, N, B, P);
    });
    const R = M ?? An(D.querySelector(".gl-figure-grid") ? "figure" : "strategy", h, k);
    D.querySelectorAll(".mini-plot-cell").forEach((_, x) => zd(f, _, o, n.zoom, n.dpi, l, `${R}-panel-${x + 1}`)), D.querySelectorAll("svg.gl-strategy-arrows").forEach((_) => {
      const x = Dn(_, o, n.zoom, l), P = Number(_.getAttribute("width")) || _.clientWidth || x.width, I = P > 0 ? x.width / P : 1, A = document.createElementNS(He, "g");
      A.setAttribute("transform", `translate(${Math.round(x.left)},${Math.round(x.top)}) scale(${I})`), Array.from(_.childNodes).forEach((B) => A.appendChild(B.cloneNode(!0))), yf(A, `${R}-arrows`), f.appendChild(A);
    }), D.querySelectorAll(".gl-figure-chart svg.gl-prop-panel").forEach((_, x) => {
      const P = Dn(_, o, n.zoom, l), I = Number(_.getAttribute("width")) || _.clientWidth || P.width, A = I > 0 ? P.width / I : 1, B = document.createElementNS(He, "g");
      B.setAttribute("transform", `translate(${Math.round(P.left)},${Math.round(P.top)}) scale(${A})`), B.setAttribute("font-family", getComputedStyle(_).fontFamily || Ma), B.appendChild(_.cloneNode(!0)), B.setAttribute("id", `${R}-chart-${x + 1}`), f.appendChild(B);
    });
  }
  const v = s ? { widthMm: c / or, heightMm: u / or } : bf(e.page);
  return mv(f, { widthPx: c, heightPx: u, ...v }), { root: f, width: c, height: u, ...v };
}
function Fd(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
function Zh(t, e, n) {
  return ya(e.page).map((r, a) => lw(t, e, { dpi: e.page.dpi, zoom: n.zoom, pageIndex: a, crop: n.crop }));
}
const Bd = 72 / 25.4;
function Gd(t, e, n, r) {
  const a = e.label ? _i(e.label) : "";
  return `${t}-p${n + 1}${a ? `-${a}` : ""}.${r}`;
}
async function cw(t, e, n) {
  const r = e.page.dpi, a = { loweredDpi: null, rasterPages: [] }, i = (f) => {
    const d = al(f.width, f.height);
    return r <= d ? r : (a.loweredDpi = Math.min(a.loweredDpi ?? d, d), d);
  }, o = _i(e.name) || "layout";
  if (!t.length) return a;
  if (n === "svg") {
    if (t.length === 1)
      return wi(new Blob([Fd(t[0].root)], { type: "image/svg+xml" }), `${o}.svg`), a;
    const f = {};
    return t.forEach((d, h) => {
      f[Gd(o, d, h, "svg")] = mf(Fd(d.root));
    }), wi(new Blob([cs(f)], { type: "application/zip" }), `${o}.zip`), a;
  }
  if (n === "png") {
    if (t.length === 1) {
      const d = i(t[0]);
      return wi(await us(await oa(t[0], d), d), `${o}.png`), a;
    }
    const f = {};
    for (const [d, h] of t.entries()) {
      const m = i(h), v = await oa(h, m);
      f[Gd(o, t[d], d, "png")] = new Uint8Array(await (await us(v, m)).arrayBuffer()), await ji();
    }
    return wi(new Blob([cs(f)], { type: "application/zip" }), `${o}.zip`), a;
  }
  const s = (f) => {
    const d = f.widthMm * Bd, h = f.heightMm * Bd;
    return { width: d, height: h, orientation: d >= h ? "landscape" : "portrait" };
  }, { jsPDF: l } = await import("./jspdf.es.min-DmhW3_Sa.js").then((f) => f.j), c = s(t[0]), u = new l({ orientation: c.orientation, unit: "pt", format: [c.width, c.height], compress: !0 });
  for (const [f, d] of t.entries()) {
    const { width: h, height: m, orientation: v } = s(d);
    if (f > 0 && u.addPage([h, m], v), !await xf(u, d.root, { width: h, height: m })) {
      const y = await oa(d, i(d));
      u.addImage(y, "PNG", 0, 0, h, m, void 0, "FAST"), a.rasterPages.push(f + 1);
    }
    await ji();
  }
  return u.save(`${o}.pdf`), a;
}
const uw = 20;
function dw(t) {
  if (!(t.metaKey || t.ctrlKey) || t.altKey) return null;
  const e = t.key.toLowerCase();
  return e === "c" && !t.shiftKey ? "copy" : e === "x" && !t.shiftKey ? "cut" : e === "v" ? t.shiftKey ? "paste-in-place" : "paste" : null;
}
function fw(t, e) {
  const n = Hf(t, Qn(t, e)), r = t.items.filter((a) => n.includes(a.id)).sort((a, i) => a.z - i.z);
  return r.length ? { sheetId: t.id, items: structuredClone(r), pastes: {} } : null;
}
function pw(t, e, n, r) {
  const a = t.id === e.sheetId, i = e.pastes[t.id] ?? 0, { copies: o } = Ii(e.items, r);
  Uf(o);
  let s = 0, l = 0;
  if (!n) {
    const d = (a ? i + 1 : i) * uw, h = a ? { dx: 0, dy: 0 } : gw(t, e.items);
    s = h.dx + d, l = h.dy + d;
  }
  const c = a ? o.map((d) => d.recipe) : wf(t, o.map(({ recipe: d }) => {
    if (!te(d) || !("iterated" in d)) return d;
    const { iterated: h, ...m } = d;
    return m;
  }));
  let u = Math.max(0, ...t.items.map((d) => d.z));
  const f = o.map((d, h) => (t.items.push({ ...d, recipe: c[h], x: d.x + s, y: d.y + l, z: ++u }), d.id));
  return Sf(t), {
    created: f,
    clipboard: n ? e : { ...e, pastes: { ...e.pastes, [t.id]: i + 1 } }
  };
}
function hw({ sheet: t, mutateActiveSheet: e, removeItems: n, selectMany: r, removable: a }) {
  const [i, o] = yv("layout.clipboard", null), s = $.useRef(t);
  s.current = t;
  const l = (d) => {
    const h = s.current ? fw(s.current, d) : null;
    return h && o(h), h !== null;
  }, c = (d) => {
    const h = a ? a(d) : d;
    h.length && l(h) && n(h);
  }, u = (d) => {
    if (!i) return;
    let h = null;
    e((v) => {
      h = pw(v, i, d);
    });
    const m = h;
    m && (o(m.clipboard), r(m.created));
  };
  return { canPaste: i !== null, copy: l, cut: c, paste: u, run: (d, h) => {
    d === "copy" ? l(h) : d === "cut" ? c(h) : u(d === "paste-in-place");
  } };
}
function gw(t, e) {
  const { width: n, height: r } = bv(t.page), a = Math.min(...e.map((c) => c.x)), i = Math.min(...e.map((c) => c.y)), o = Math.max(...e.map((c) => c.x + c.width)), s = Math.max(...e.map((c) => c.y + c.height)), l = (c, u, f) => c < 0 || u - c > f ? -c : u > f ? f - u : 0;
  return { dx: l(a, o, n), dy: l(i, s, r) };
}
function vw(t, e, n, r) {
  try {
    const a = wv(t, e, n).figure;
    return a ? Cf(a, e, Gn(n), void 0, r).map((i) => i.label) : [];
  } catch {
    return [];
  }
}
function mw({
  recipe: t,
  files: e,
  state: n,
  columnLevels: r,
  onChange: a
}) {
  const { t: i } = It(), o = $.useMemo(() => vw(t, e, n, r), [t, e, n, r]);
  return o.length <= 1 ? null : /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: i("The page of the figure this block draws"), children: [
    i("Page"),
    /* @__PURE__ */ g.jsx("select", { "aria-label": i("Page"), value: Math.min(t.page, o.length - 1), onChange: (s) => a(Number(s.target.value)), children: o.map((s, l) => /* @__PURE__ */ g.jsx("option", { value: l, children: s || i("Page {n}", { n: l + 1 }) }, l)) })
  ] });
}
function xw(t, e, n, r, a, i, o) {
  const s = t.settings, { model: l, cellModel: c, channels: u } = il(s, e, n, r, a, i), f = ds(e), d = { groups: Cv(s, f, r, o), facets: Sv(s, f, r, o) }, h = u.length > 1 ? u.map((b) => b.key) : void 0, m = kv({ ...s, ...h ? { channels: h } : {} }, c ? null : l, c, d), v = kf(s, c ? c.hasFacet : l.hasFacet), y = { group: Dr(s.groupSel), facet: Dr(s.facetSel), channels: Object.fromEntries(u.map((b) => [b.key, b.label])) };
  return m.map((b) => ({ page: b, label: v ? Ef({ facet: b, group: b, population: b, channel: b }, v, y) : b }));
}
function yw({
  recipe: t,
  samples: e,
  state: n,
  metadataById: r,
  divisionProfiles: a,
  dataRevision: i = "",
  metadataLevels: o,
  onChange: s
}) {
  const { t: l } = It(), c = !t.panel || tu(t.panel), u = $.useMemo(
    () => c ? xw(t, e, n, r, a, i, o) : [],
    [c, t, e, n, r, a, i, o]
  );
  if (u.length <= 1) return null;
  const f = tu(t.panel) ? u.findIndex((d) => d.page === t.panel.page) : -1;
  return /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: l("The page of the chart this block draws, or the whole chart"), children: [
    l("Page"),
    /* @__PURE__ */ g.jsxs("select", { "aria-label": l("Page"), value: f < 0 ? "" : String(f), onChange: (d) => s(d.target.value === "" ? void 0 : { page: u[Number(d.target.value)].page }), children: [
      /* @__PURE__ */ g.jsx("option", { value: "", children: l("Whole chart") }),
      u.map((d, h) => /* @__PURE__ */ g.jsx("option", { value: h, children: d.label }, d.page))
    ] })
  ] });
}
function zr(t) {
  return Math.round(t * 100) / 100;
}
function ga(t, e) {
  return e === "mm" ? Math.round(t / or * 10) / 10 : zr(t);
}
function Ui(t, e) {
  return zr(e === "mm" ? t * or : t);
}
function Jh(t) {
  return t === "biplot" || t === "histogram" ? { width: 1, height: 1 } : Mf(t);
}
function bw(t, e, n, r) {
  if (e === "x" || e === "y") return { [e]: Math.max(0, n) };
  const a = Jh(t.recipe.kind), i = Math.max(a[e], n);
  if (!r || t.width <= 0 || t.height <= 0) return { [e]: i };
  if (e === "width") {
    const s = zr(Math.max(a.height, i * t.height / t.width));
    return { width: i, height: s };
  }
  return { width: zr(Math.max(a.width, i * t.width / t.height)), height: i };
}
function uo(t, e) {
  return t.items.filter((n) => e.includes(n.id) && !n.locked && !xe(n));
}
function ww(t, e) {
  const n = t.items.filter((i) => e.includes(i.id) && !xe(i));
  if (n.length < 2) return null;
  const r = ir(n), a = (i) => Math.hypot(i.x - r.x, i.y - r.y);
  return [...n].sort((i, o) => a(i) - a(o) || i.y - o.y || i.x - o.x)[0];
}
function Sw(t, e, n) {
  const r = ww(t, e);
  if (!r) return null;
  for (const a of uo(t, e)) {
    if (a.id === r.id) continue;
    const i = Mf(a.recipe.kind);
    n !== "height" && (a.width = Math.max(i.width, r.width)), n !== "width" && (a.height = Math.max(i.height, r.height));
  }
  return r.id;
}
function $d(t, e) {
  for (const n of t.items) {
    const r = Wn(n);
    !e.includes(n.id) || n.locked || r === 1 || (n.width = Math.max(1, Math.round(n.width / r)), n.height = Math.max(1, Math.round(n.height / r)), delete n.zoom);
  }
}
function Cw(t) {
  return Math.max(1, Math.ceil(Math.sqrt(Math.max(1, t))));
}
function Wd(t, e) {
  return Zi(uo(t, e)).length;
}
function Zs(t, e, n) {
  for (const r of t)
    r.x = zr(r.x + e), r.y = zr(r.y + n);
}
function kw(t, e, n) {
  const r = Zi(uo(t, e)).map((m, v) => ({ unit: m, ...ir(m), id: String(v) }));
  if (r.length < 2) return;
  const a = Gf(r), i = Math.max(1, Math.min(a.length, Math.round(n.columns))), o = Math.ceil(a.length / i), s = Math.max(0, n.gapPx), l = (m) => n.order === "across" ? { row: Math.floor(m / i), column: m % i } : { row: m % o, column: Math.floor(m / o) }, c = new Array(i).fill(0), u = new Array(o).fill(0);
  a.forEach((m, v) => {
    const { row: y, column: b } = l(v);
    c[b] = Math.max(c[b], m.width), u[y] = Math.max(u[y], m.height);
  });
  const f = ir(r), d = (m) => f.x + c.slice(0, m).reduce((v, y) => v + y + s, 0), h = (m) => f.y + u.slice(0, m).reduce((v, y) => v + y + s, 0);
  a.forEach((m, v) => {
    const { row: y, column: b } = l(v);
    Zs(m.unit, d(b) - m.x, h(y) - m.y);
  });
}
function Ew(t, e, n, r) {
  const a = Zi(uo(t, e)).map((l) => ({ unit: l, bounds: ir(l) }));
  if (a.length < 2) return;
  const i = r === "across", o = [...a].sort((l, c) => i ? l.bounds.x - c.bounds.x || l.bounds.y - c.bounds.y : l.bounds.y - c.bounds.y || l.bounds.x - c.bounds.x);
  let s = i ? o[0].bounds.x + o[0].bounds.width : o[0].bounds.y + o[0].bounds.height;
  for (const { unit: l, bounds: c } of o.slice(1)) {
    const u = s + Math.max(0, n);
    i ? Zs(l, u - c.x, 0) : Zs(l, 0, u - c.y), s = u + (i ? c.width : c.height);
  }
}
function Mw() {
  const [t, e] = $.useState("mm"), [n, r] = $.useState(!1), [a, i] = $.useState(4);
  return { unit: t, setUnit: e, keepRatio: n, setKeepRatio: r, gapMm: a, setGapMm: i };
}
const Dw = { x: "X", y: "Y", width: "Width", height: "Height" };
function Tw({
  item: t,
  prefs: e,
  ratioLocked: n = !1,
  origin: r = { x: 0, y: 0 },
  onCommit: a
}) {
  const { t: i } = It(), { unit: o, setUnit: s, setKeepRatio: l } = e, c = e.keepRatio || n, u = Jh(t.recipe.kind), f = (h) => h === "x" ? r.x : h === "y" ? r.y : 0, d = (h) => /* @__PURE__ */ g.jsxs("label", { children: [
    i(Dw[h]),
    " (",
    o,
    ")",
    /* @__PURE__ */ g.jsx(
      le,
      {
        "aria-label": `Item ${h}`,
        min: h === "width" || h === "height" ? ga(u[h], o) : -ga(f(h), o),
        step: o === "mm" ? 0.1 : 1,
        value: ga(t[h] - f(h), o),
        onCommit: (m) => a(bw(t, h, f(h) + Ui(m, o), c))
      },
      f(h)
    )
  ] }, h);
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-dimensions", children: [
      d("x"),
      d("y"),
      d("width"),
      d("height")
    ] }),
    /* @__PURE__ */ g.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: i("Typing a width sets the height to keep the item's proportions, and the reverse; dragging a handle keeps them too, and Shift frees them"), children: [
        /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: c, disabled: n, onChange: (h) => l(h.target.checked) }),
        i("Keep proportions")
      ] }),
      /* @__PURE__ */ g.jsx("span", { role: "group", "aria-label": i("Unit"), style: { display: "inline-flex", gap: 2 }, children: ["mm", "px"].map((h) => /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", "aria-pressed": o === h, onClick: () => s(h), title: i("Show X, Y, width and height in {unit}", { unit: h }), children: h }, h)) })
    ] })
  ] });
}
function Yd({ items: t, onReset: e }) {
  const { t: n } = It(), r = t.filter((i) => Wn(i) !== 1);
  if (!r.length) return null;
  const a = new Set(r.map((i) => Math.round(Wn(i) * 100)));
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions", children: [
    /* @__PURE__ */ g.jsx("span", { className: "gl-hint", children: a.size === 1 && r.length === t.length ? n("Shown at {percent}%", { percent: [...a][0] }) : n("Shown at several scales") }),
    /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", disabled: r.every((i) => i.locked), onClick: e, title: n("Draw unscaled: the frame becomes the size the item is drawn at, its top-left corner kept; locked items are not changed"), children: n("Reset scale") })
  ] });
}
function Qh({
  label: t,
  title: e,
  disabled: n,
  dialogLabel: r,
  children: a
}) {
  const [i, o] = $.useState(!1), s = $.useRef(null);
  return $.useEffect(() => {
    if (!i) return;
    const l = (u) => {
      s.current && !s.current.contains(u.target) && o(!1);
    }, c = (u) => {
      u.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", l), document.addEventListener("keydown", c), () => {
      document.removeEventListener("mousedown", l), document.removeEventListener("keydown", c);
    };
  }, [i]), $.useEffect(() => {
    n && o(!1);
  }, [n]), /* @__PURE__ */ g.jsxs("span", { ref: s, style: { position: "relative", display: "inline-flex" }, children: [
    /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", "aria-expanded": i, disabled: n, onClick: () => o((l) => !l), title: e, children: t }),
    i && /* @__PURE__ */ g.jsx("div", { className: "gl-menu-popover", role: "dialog", "aria-label": r, style: { display: "grid", gap: 6, padding: 8, minWidth: 200 }, children: a(() => o(!1)) })
  ] });
}
function tg({ prefs: t }) {
  const { t: e } = It();
  return /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
    e("Gap (mm)"),
    /* @__PURE__ */ g.jsx(le, { "aria-label": e("Gap (mm)"), min: 0, max: 500, step: 0.5, value: t.gapMm, onCommit: t.setGapMm })
  ] });
}
function _w({
  itemCount: t,
  unitCount: e,
  prefs: n,
  onMatch: r,
  onGrid: a
}) {
  const { t: i } = It(), o = i("the item nearest the top left of the selection"), s = [
    { how: "width", label: i("Match width"), title: i("Give each selected item the width of {reference}, keeping each top-left corner; locked items are not changed", { reference: o }) },
    { how: "height", label: i("Match height"), title: i("Give each selected item the height of {reference}, keeping each top-left corner; locked items are not changed", { reference: o }) },
    { how: "size", label: i("Match size"), title: i("Give each selected item the width and height of {reference}, keeping each top-left corner; locked items are not changed", { reference: o }) }
  ];
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions", children: [
    s.map(({ how: l, label: c, title: u }) => /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", disabled: t < 2, onClick: () => r(l), title: u, children: c }, l)),
    /* @__PURE__ */ g.jsx(
      Qh,
      {
        label: i("Arrange in grid…"),
        dialogLabel: i("Arrange in grid"),
        title: i("Place the selected items in a grid in reading order, from the selection's top-left corner; locked items stay where they are"),
        disabled: e < 2,
        children: (l) => /* @__PURE__ */ g.jsx(jw, { count: e, prefs: n, onApply: (c) => {
          a(c), l();
        } }, e)
      }
    )
  ] });
}
function jw({ count: t, prefs: e, onApply: n }) {
  const { t: r } = It(), [a, i] = $.useState(Cw(t)), [o, s] = $.useState("across");
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      r("Columns"),
      /* @__PURE__ */ g.jsx(le, { "aria-label": r("Columns"), integer: !0, min: 1, max: Math.max(1, t), value: a, onCommit: i })
    ] }),
    /* @__PURE__ */ g.jsx(tg, { prefs: e }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      r("Order"),
      /* @__PURE__ */ g.jsxs("select", { "aria-label": r("Order"), value: o, onChange: (l) => s(l.target.value), children: [
        /* @__PURE__ */ g.jsx("option", { value: "across", children: r("Across, then down") }),
        /* @__PURE__ */ g.jsx("option", { value: "down", children: r("Down, then across") })
      ] })
    ] }),
    /* @__PURE__ */ g.jsx("div", { children: /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => n({ columns: a, gapMm: e.gapMm, order: o }), children: r("Apply") }) })
  ] });
}
function Iw({
  unitCount: t,
  disabled: e,
  prefs: n,
  onSpace: r
}) {
  const { t: a } = It(), [i, o] = $.useState("across");
  return /* @__PURE__ */ g.jsx(
    Qh,
    {
      label: a("Space…"),
      dialogLabel: a("Space at a gap"),
      title: a("Space two or more items or groups at a typed gap; the first stays and each next one is put after the one before"),
      disabled: e || t < 2,
      children: (s) => /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
        /* @__PURE__ */ g.jsx(tg, { prefs: n }),
        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
          a("Direction"),
          /* @__PURE__ */ g.jsxs("select", { "aria-label": a("Direction"), value: i, onChange: (l) => o(l.target.value), children: [
            /* @__PURE__ */ g.jsx("option", { value: "across", children: a("Across") }),
            /* @__PURE__ */ g.jsx("option", { value: "down", children: a("Down") })
          ] })
        ] }),
        /* @__PURE__ */ g.jsx("div", { children: /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => {
          r(n.gapMm, i), s();
        }, children: a("Apply") }) })
      ] })
    }
  );
}
function Rw({
  x: t,
  y: e,
  populations: n,
  defaultPopulation: r,
  metadataColumns: a,
  onAdd: i,
  onTakePlotting: o,
  onClose: s
}) {
  var S;
  const { t: l } = It(), c = $.useRef(null), [u, f] = $.useState(r || ((S = n[0]) == null ? void 0 : S.popId) || ""), [d, h] = $.useState("percent_of_parent"), [m, v] = $.useState(a[0] ?? "");
  $.useEffect(() => {
    var M, E;
    const C = (D) => {
      c.current && !c.current.contains(D.target) && s();
    }, k = (D) => {
      D.key === "Escape" && s();
    };
    return document.addEventListener("mousedown", C), document.addEventListener("keydown", k), (E = (M = c.current) == null ? void 0 : M.querySelector("select")) == null || E.focus(), () => {
      document.removeEventListener("mousedown", C), document.removeEventListener("keydown", k);
    };
  }, [s]);
  const y = Math.max(4, Math.min(t, window.innerWidth - 260)), b = Math.max(4, Math.min(e, window.innerHeight - 200));
  return /* @__PURE__ */ g.jsxs(
    "div",
    {
      ref: c,
      className: "gl-menu-popover gl-layout-chart-start",
      role: "dialog",
      "aria-label": l("New chart"),
      style: { position: "fixed", left: y, top: b, display: "grid", gap: 6, padding: 8, zIndex: 50 },
      children: [
        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
          l("Population"),
          /* @__PURE__ */ g.jsx("select", { "aria-label": l("Population"), value: u, onChange: (C) => f(C.target.value), children: n.map(({ popId: C, depth: k, name: M }) => /* @__PURE__ */ g.jsxs("option", { value: C, children: [
            " ".repeat(k * 2),
            M
          ] }, C)) })
        ] }),
        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
          l("Statistic"),
          /* @__PURE__ */ g.jsxs("select", { "aria-label": l("Statistic"), value: d, onChange: (C) => h(C.target.value), children: [
            /* @__PURE__ */ g.jsx("option", { value: "percent_of_parent", children: l("% of parent") }),
            /* @__PURE__ */ g.jsx("option", { value: "percent_of_total", children: l("% of total") }),
            /* @__PURE__ */ g.jsx("option", { value: "count", children: l("Count") })
          ] })
        ] }),
        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
          l("Group by"),
          /* @__PURE__ */ g.jsxs("select", { "aria-label": l("Group by"), value: m, onChange: (C) => v(C.target.value), children: [
            /* @__PURE__ */ g.jsx("option", { value: "", children: l("Each file") }),
            a.map((C) => /* @__PURE__ */ g.jsx("option", { value: C, children: C }, C))
          ] })
        ] }),
        /* @__PURE__ */ g.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
          /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", disabled: !u, onClick: () => i({ populationId: u, statistic: d, groupBy: m }), children: l("Add") }),
          o && /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: l("Add the Plotting tab's current chart as one block, drawn here as it is there"), onClick: o, children: l("Take the Plotting tab's chart") })
        ] })
      ]
    }
  );
}
const Pw = {
  bars: "bar",
  dots: "dots",
  box: "box"
}, Nw = {
  percent_of_parent: "parent",
  percent_of_total: "total",
  count: "count"
}, Hd = (t, e) => Math.max(eu[t][0], Math.min(eu[t][1], e));
function Ow(t, e, n, r) {
  const a = e.populations[t.populationId], i = e.root_population_id ?? "", o = t.files === "all" ? [...n.all] : n.all.filter((l) => n.checked.includes(l)), s = t.statistic === "median";
  return {
    ...Ev,
    files: o,
    hierarchy: e.id,
    categoryKind: "population",
    valueKind: s ? "statistic" : "proportion",
    plotType: Pw[t.chartType],
    channel: s ? t.channel ?? "" : "",
    xAxis: "groups",
    statistic: "median",
    errorBar: "sd",
    test: t.test && !!t.groupBy,
    proportionValue: t.statistic === "median" ? "parent" : Nw[t.statistic],
    parent: (a == null ? void 0 : a.parent_id) ?? i,
    selectedPops: [t.populationId],
    includeUngated: !0,
    groupSel: t.groupBy || Ri,
    unitSel: Ri,
    facetSel: Df,
    points: t.chartType === "dots" ? !0 : t.showPoints,
    // The summary chart names its groups under the axis and has no legend.
    legend: !1,
    ...r ? { fontTick: Hd("fontTick", r.fontTick), fontAxis: Hd("fontAxis", r.fontAxis) } : {}
  };
}
function eg(t, e, n, r) {
  var a;
  return {
    kind: "proportions",
    settings: Ow(t, e, n, r),
    ...t.title ? { title: t.title } : {},
    panel: { populationId: t.populationId, population: ((a = e.populations[t.populationId]) == null ? void 0 : a.name) ?? "" },
    textSize: "sheet"
  };
}
function Aw(t, e, n, r) {
  return eg(
    { ...t, files: "checked", chartType: "bars", showPoints: !0, test: !0 },
    e,
    n,
    r
  );
}
function Js(t, e, n, r) {
  var o;
  const a = ((o = t.pool) == null ? void 0 : o.sampleIds) ?? [t.sampleId];
  return (a.includes(t.sampleId) ? [t.sampleId, ...a.filter((s) => s !== t.sampleId)] : a).flatMap((s) => {
    const l = e.find((u) => u.id === s);
    if (!l) return [];
    const c = ln(t.populationId, l.tree, n, r);
    return [{ id: l.id, name: l.name, sample: l.sample, tree: l.tree, gating: l.derived, populationId: c.missing ? "" : c.id }];
  });
}
const Xd = /* @__PURE__ */ new WeakMap();
function ng(t, e, n, r) {
  var u, f;
  const a = Js(t, e, n, r), i = JSON.stringify([t.sampleId, t.populationId, t.populationIds, t.fullPath, t.pool, r]), o = JSON.stringify([
    a.map((d) => [d.id, d.populationId, d.sample.dataRevision, d.sample.activeLayer, d.sample.channels]),
    Object.values(n).map((d) => [d.id, d.gates, d.gate_order, d.populations, d.root_population_id, d.source_hierarchy_id, d.source_gate_ids, d.source_population_ids])
  ]);
  let s = Xd.get(e);
  s || Xd.set(e, s = /* @__PURE__ */ new Map());
  const l = s.get(i);
  if ((l == null ? void 0 : l.signature) === o) return { drawn: a.filter((d) => l.drawnIds.has(d.id)), leftOut: l.leftOut };
  const c = (u = t.populationIds) != null && u.length ? Tf(a, t.populationIds, r ?? ((f = a[0]) == null ? void 0 : f.tree.id) ?? "", n, { maxEvents: 1, globalScales: {} }) : _f(a, n, { fullPath: t.fullPath, maxEvents: 1 });
  return s.set(i, { signature: o, drawnIds: new Set(c.drawn.map((d) => d.id)), leftOut: c.leftOut }), { drawn: c.drawn, leftOut: c.leftOut };
}
const ts = (t) => `Boxes show the median and quartiles of the ${t}; whiskers extend to the most extreme ${rg(t)} within 1.5 times the interquartile range.`;
function rg(t) {
  return t === "cells" ? "cell" : t === "files" ? "file" : t === "events" ? "event" : t.endsWith("s") ? t.slice(0, -1) : t;
}
function zw(t) {
  if (t === Ri || t === Df) return { one: "file", many: "files" };
  if (t === zv) return { one: "sample", many: "samples" };
  if (/^[A-Za-z][A-Za-z ]*$/.test(t)) {
    const e = t.trim().toLowerCase();
    return { one: e, many: e.endsWith("s") ? e : `${e}s` };
  }
  return { one: `unit of ${t}`, many: `units of ${t}` };
}
function Tn(t) {
  return t.length <= 1 ? t[0] ?? "" : `${t.slice(0, -1).join(", ")} and ${t[t.length - 1]}`;
}
const Jr = (t) => t.toLocaleString("en-US");
function fo(t) {
  return (e) => {
    var r;
    const n = t.files.find((a) => a.id === e);
    return n ? n.fileName ?? n.name : ((r = t.samples.find((a) => a.id === e)) == null ? void 0 : r.name) ?? e;
  };
}
function Lw(t, e, n) {
  var y, b;
  const r = n.describePlot(e, t.templateSampleId, t.unitId), a = n.samples.find((S) => S.id === e.sampleId) ?? null, i = fo(n), o = e.pool && e.pool.sampleIds.length > 1 ? e.pool.sampleIds : null, s = (o ?? [e.sampleId]).map(i), l = (S) => a ? a.sample.labelForKey(S) : S, c = [e.xChannel, ...e.kind === "biplot" && e.yChannel ? [e.yChannel] : []].filter(Boolean).map(l);
  let u = r != null && r.population ? [r.population] : [], f = typeof (r == null ? void 0 : r.count) == "number" ? [r.count] : void 0;
  if (e.populationIds && e.populationIds.length > 1 && a && ((y = r == null ? void 0 : r.counts) != null && y.length)) {
    const S = Gn(n.state), C = t.templateSampleId && t.templateSampleId !== e.sampleId ? (b = n.samples.find((k) => k.id === t.templateSampleId)) == null ? void 0 : b.tree.id : void 0;
    u = e.populationIds.flatMap((k) => {
      const M = ln(k, a.tree, S, C), E = M.missing ? void 0 : a.tree.populations[M.id];
      return E ? [E.name] : [];
    }), f = [...r.counts];
  }
  const d = e.kind === "histogram" ? `Histogram of ${c[0] ?? "a channel"}` : `${c[0] ?? "X"} against ${c[1] ?? "Y"}`, h = u.length > 1 ? "overlay" : o ? "pool" : "plot", m = o ? `${s.length} files pooled` : s[0] ?? "", v = u.length > 1 ? `${Tn(u)} overlaid` : `${u[0] ?? "the population"} cells`;
  return {
    kind: h,
    shows: `${d} of ${v}${m ? ` in ${m}` : ""}`,
    files: s,
    populations: u,
    channels: c,
    ...f ? { counts: f } : {},
    unit: "events",
    follows: Lr(t)
  };
}
function Fw(t, e, n) {
  var m, v;
  const r = n.samples.find((y) => y.id === e.sampleId) ?? null, a = fo(n), i = Gn(n.state), o = t.templateSampleId && t.templateSampleId !== e.sampleId ? (m = n.samples.find((y) => y.id === t.templateSampleId)) == null ? void 0 : m.tree.id : void 0, s = (v = e.populationIds) != null && v.length ? e.populationIds : [e.populationId], l = e.pool && e.pool.sampleIds.length > 1 ? e.pool.sampleIds : null, c = l ? ng(e, n.samples, i, o) : null, u = r ? s.flatMap((y) => {
    const b = ln(y, r.tree, i, o), S = b.missing ? void 0 : r.tree.populations[b.id], C = c ? c.drawn.reduce((k, M) => {
      const E = ln(y, M.tree, i, o);
      return k + (E.missing ? 0 : M.gating.stats.event_count[E.id] ?? 0);
    }, 0) : r.derived.stats.event_count[b.id] ?? 0;
    return S ? [{ name: S.name, count: C }] : [];
  }) : [], f = a(e.sampleId), d = c && l ? `${c.drawn.length === l.length ? l.length : `${c.drawn.length} of ${l.length}`} files pooled` : f, h = c != null && c.leftOut.length ? `; not pooled: ${c.leftOut.map((y) => `${y.name} (${y.reason})`).join(", ")}` : "";
  return {
    kind: "strategy",
    shows: `Gating steps leading to ${Tn(u.map((y) => y.name)) || "the population"} in ${d}${h}`,
    files: c ? c.drawn.map((y) => a(y.id)) : [f],
    populations: u.map((y) => y.name),
    channels: [],
    counts: u.map((y) => y.count),
    unit: "events",
    follows: Lr(t)
  };
}
function Bw(t, e, n) {
  const r = e.illustration.figure, a = fo(n), i = ((r == null ? void 0 : r.sampleIds) ?? []).filter((d) => n.files.some((h) => h.id === d) || n.samples.some((h) => h.id === d)).map(a), o = [...new Set(((r == null ? void 0 : r.populations) ?? []).map((d) => d.label).filter(Boolean))], s = (d) => {
    const h = n.files.find((m) => r == null ? void 0 : r.sampleIds.includes(m.id));
    return h ? h.sample.labelForKey(d) : d;
  }, l = (r == null ? void 0 : r.plots) ?? [], c = [...new Set(l.flatMap((d) => [d.x, d.type === "biplot" ? d.y : ""]).filter(Boolean))].map(s), u = [...new Set(l.map((d) => d.type === "histogram" ? "histograms" : d.type === "heatmap" ? "heatmaps" : "biplots"))], f = (r == null ? void 0 : r.composition) === "pool" ? ", files pooled" : (r == null ? void 0 : r.composition) === "overlay" ? ", files overlaid" : "";
  return {
    kind: "figure",
    shows: `${u.length ? Tn(u).replace(/^./, (d) => d.toUpperCase()) : "Plots"} of ${Tn(o) || "the populations"} in ${i.length === 1 ? i[0] : `${i.length} files`}${f}`,
    files: i,
    populations: o,
    channels: c,
    unit: "events",
    follows: Lr(t)
  };
}
function Gw(t, e) {
  var s;
  const n = pl(t, e.samples, e.metadataById, e.checkedSampleIds, e.state), r = t.statistic === "median" && t.channel ? ((s = e.samples.find((l) => l.id === t.sampleId) ?? e.samples[0]) == null ? void 0 : s.sample.labelForKey(t.channel)) ?? t.channel : "", a = t.chartType === "bars" ? "Bars show the mean and error bars the standard deviation." : t.chartType === "box" ? "Boxes show the median and quartiles; whiskers extend to the lowest and highest file." : "Points show each file and the line the mean.", i = !!t.groupBy, o = t.statistic === "median" ? "median" : t.statistic === "count" ? "event count" : "percentage";
  return {
    kind: "chart",
    shows: `${n.axis} of ${n.population} per file`,
    files: n.points.map((l) => l.name),
    populations: [n.population],
    channels: r ? [r] : [],
    value: n.axis,
    statistic: o,
    unit: "files",
    ...i ? { groupTitle: t.groupBy } : {},
    groups: n.groups.map((l) => ({ label: l.label, n: l.n })),
    centre: a,
    testAsked: t.test && i,
    tests: n.test ? [{ panel: "", name: n.test.name, p: n.test.p }] : [],
    follows: !1
  };
}
function Qs(t, e) {
  return !t || "legend" in t ? !0 : (t.facet === void 0 || (e.facet ?? "") === t.facet) && (t.group === void 0 || e.group === null || e.group === t.group) && (t.populationId !== void 0 && e.populationId ? e.populationId === t.populationId : t.population === void 0 || e.population === null || e.population === t.population);
}
function $w(t, e, n) {
  var ut;
  const r = e.settings, a = Lr(t), i = fo(n), o = r.files.filter((Z) => n.files.some((dt) => dt.id === Z)).map(i), s = e.panel && !("legend" in e.panel) && Mv(e.panel) || void 0;
  if (e.panel && "legend" in e.panel)
    return { kind: "legend", shows: "Legend of a Plotting chart", files: o, populations: [], channels: [], follows: a };
  const { model: l, cellModel: c, channels: u } = il(r, n.files, n.state, n.metadataById, n.divisionProfiles, n.dataRevision), f = Dr(r.groupSel), d = r.groupSel === Ri, h = zw(r.unitSel), m = kf({ ...r, channels: u.map((Z) => Z.key) }, c ? c.hasFacet : l.hasFacet), v = Dv(e.panel), y = Tv(e.panel, m), b = Object.fromEntries(u.map((Z) => [Z.key, Z.label])), S = v !== void 0 && m ? Ef({ facet: v, group: v, population: v, channel: v }, m, { group: f, facet: Dr(r.facetSel), channels: b }) : void 0, C = u.find((Z) => y && !("legend" in y) && Z.key === y.channel), k = (C == null ? void 0 : C.model) ?? c, M = C && y && !("legend" in y) ? (({ channel: Z, ...dt }) => dt)(y) : y, E = !C && u.length > 1 ? u.map((Z) => Z.label) : null, D = { files: o, follows: a, ...s && v === void 0 ? { panel: s } : {}, ...S ? { page: S } : {}, ...f && !d ? { groupTitle: f } : {} };
  if (r.valueKind === "statistic" && k) {
    const Z = r.plotType === "bar" ? "bar" : r.plotType === "dots" ? "dots" : "box", dt = _v(k, { ...r, plotType: Z }, f, Dr(r.facetSel)), ht = M && !("legend" in M) ? jv(dt.panels, M, (vt) => vt).slice(0, S ? void 0 : 1) : dt.panels, tt = [];
    for (const vt of ht)
      for (const gt of vt.slots) {
        if (!gt.points.length) continue;
        const At = r.xAxis === "groups" ? gt.label : vt.group ?? "", _t = gt.cat !== void 0 ? k.catLevels[gt.cat] ?? "" : r.xAxis === "groups" ? vt.population ?? "" : gt.label;
        tt.push({ label: At, population: _t, n: gt.points.length });
      }
    const ft = [...new Set(tt.map((vt) => vt.population ?? ""))].filter(Boolean), Mt = E ? Tn(E) : k.channelLabel || r.channel, xt = rl(r.statistic, Mt), st = r.errorBar === "sem" ? "standard error of the mean" : "standard deviation", St = Z === "box" ? ts(h.many) : Z === "bar" ? `Bars show the mean of the ${h.many} and error bars the ${st}.` : `Points show each ${h.one}; lines show the mean and error bars the ${st}.`, Pt = r.test && Io(r) === "groups", Tt = Pt && r.comparisons === "pairwise";
    return {
      ...D,
      kind: "statistic",
      shows: `${xt} of ${Tn(ft) || "the populations'"} cells per ${h.one}`,
      populations: ft,
      channels: E ?? [Mt],
      value: xt,
      statistic: r.statistic === "geomean" ? "geometric mean" : r.statistic,
      unit: h.many,
      groups: tt,
      centre: St,
      testAsked: Pt,
      tests: Pt ? ht.flatMap((vt) => vt.test ? [{ panel: vt.title, name: vt.test.name, p: vt.test.p }] : []) : [],
      ...Tt ? {
        comparisons: ht.flatMap((vt) => tl(vt.title, nu(vt.comparisons, r.comparisonsShow))),
        testDescription: fs(r, dt.groups.length)
      } : {}
    };
  }
  if (r.valueKind === "cells" && k) {
    const Z = k.violins.filter((st) => {
      var St;
      return Qs(M, { facet: st.facet, group: st.group, population: k.catLevels[st.cat] ?? null, populationId: ((St = k.levels[st.cat]) == null ? void 0 : St.popId) ?? null });
    }), dt = [];
    for (const st of Z) {
      if (!st.values.length) continue;
      const St = k.catLevels[st.cat], Pt = dt.find((Tt) => Tt.label === st.group && Tt.population === St);
      Pt ? Pt.n += st.values.length : dt.push({ label: st.group, population: St, n: st.values.length });
    }
    const ht = [...new Set(dt.map((st) => st.population ?? ""))].filter(Boolean), tt = E ? Tn(E) : k.channelLabel || r.channel, ft = r.plotType === "box" ? ts("cells") : r.plotType === "ridgeline" ? "Ridgelines show the density of the cells (Silverman's bandwidth), each row scaled to its own peak." : r.plotType === "splitViolin" && new Set(dt.map((st) => st.label)).size === 2 && Io(r) === "groups" ? `Split violins show the density of each group's cells on its own half (Silverman's bandwidth), with each half's median${r.violinBox ? " and quartiles" : ""} marked across it.` : `Violins show the density of the cells (Silverman's bandwidth)${r.violinBox ? ", with the median and quartiles marked inside" : ""}.`, Mt = r.test && Io(r) === "groups" && r.replicateMarks !== "none" && (C ? C.unitModel : Ww(r, n)), xt = Mt ? Yw(r, k, Mt, M) : null;
    return {
      ...D,
      ...xt ?? {},
      kind: "cells",
      shows: `${tt} in each cell of ${Tn(ht) || "the populations"}, the cells of each group's files pooled`,
      populations: ht,
      channels: E ?? [tt],
      value: `${tt} per cell`,
      statistic: "value per cell",
      unit: "cells",
      groups: dt,
      centre: ft
    };
  }
  const j = r.plotType !== "stacked", R = Iv(r, n.state), _ = r.categoryKind === "division" ? Rv(l.divisionWithin) : (ut = R[r.parent]) != null && ut.parent_id ? R[r.parent].name : null, x = Pv(r.categoryKind, _, r.includeUngated), P = l.catLevels.map((Z, dt) => {
    var ht, tt;
    return { population: Z, cat: dt, populationId: ((tt = (ht = l.levels) == null ? void 0 : ht[dt]) == null ? void 0 : tt.popId) ?? null };
  }).filter((Z) => Qs(M && !("legend" in M) ? { ...M, facet: void 0 } : M, { facet: null, group: null, population: Z.population, populationId: Z.populationId })), I = l.perSample.filter((Z) => !M || "legend" in M || M.facet === void 0 || (Z.facet ?? "") === M.facet), A = Nv(I, l.catLevels.length), B = [...new Set(A.map((Z) => Z.group))], q = !j && !r.averagePerUnit, F = q ? B.map((Z) => ({ label: Z, n: I.filter((dt) => dt.group === Z).reduce((dt, ht) => dt + ht.catCounts.reduce((tt, ft) => tt + ft, 0), 0) })) : B.map((Z) => ({ label: Z, n: A.filter((dt) => dt.group === Z).length })), N = P.map((Z) => Z.population), W = j ? ts(h.many) : q ? "Each bar shows the composition of its group's events, pooled over its files." : `Each bar shows the mean composition of the ${h.many} in its group.`, V = j && r.test, X = ru(l.perSample.map((Z) => Z.group)), J = l.hasFacet ? ru(l.perSample.map((Z) => Z.facet ?? "")) : [null], et = { comparisons: r.comparisons, comparisonsShow: r.comparisonsShow, paired: Ov(r) }, at = V ? Av(l, J, X, r.proportionValue, et) : /* @__PURE__ */ new Map(), Q = J.flatMap((Z, dt) => P.map((ht) => ({ title: [ht.population, l.hasFacet ? Z || "(NA)" : null].filter(Boolean).join(" · "), facet: Z, tests: at.get(`p${dt}-${ht.cat}`) }))).filter((Z) => Z.tests && (!M || "legend" in M || M.facet === void 0 || (Z.facet ?? "") === M.facet)), it = r.comparisons === "pairwise" || et.paired;
  return {
    ...D,
    ...V ? {
      testAsked: !0,
      tests: Q.flatMap((Z) => Z.tests.overall ? [{ panel: Q.length > 1 ? Z.title : "", name: Z.tests.overall.name, p: Z.tests.overall.p }] : []),
      ...it ? {
        comparisons: Q.flatMap((Z) => tl(Q.length > 1 ? Z.title : "", nu(Z.tests.pairs, r.comparisonsShow))),
        testDescription: fs(r, X.length)
      } : {}
    } : {},
    kind: "proportion",
    shows: `${x} for ${Tn(N) || "the populations"}${q ? ", events pooled per group" : ` per ${h.one}`}`,
    populations: N,
    channels: [],
    value: x,
    statistic: "percentage",
    unit: q ? "events" : h.many,
    groups: F,
    centre: W
  };
}
function tl(t, e) {
  return e.flatMap((n) => n.p !== null && n.pAdjusted !== null ? [{ panel: t, groupA: n.groupA, groupB: n.groupB, name: n.test, p: n.p, pAdjusted: n.pAdjusted }] : []);
}
function Ww(t, e) {
  return il(t, e.files, e.state, e.metadataById, e.divisionProfiles, e.dataRevision).unitModel;
}
function Yw(t, e, n, r) {
  const { panels: a, groups: i } = Lv(e, t.xAxis, void 0, Dr(t.facetSel)), o = Fv(e, a, i, t.xAxis, { unitModel: n, statistic: t.replicateMarks === "mean" ? "mean" : "median", unitSel: t.unitSel, test: !0, comparisons: t }), s = a.filter((c) => Qs(r, c)), l = (c) => s.length > 1 ? c.title : "";
  return {
    testAsked: !0,
    tests: s.flatMap((c) => {
      const u = o.tests.get(c.key);
      return u ? [{ panel: l(c), name: u.name, p: u.p }] : [];
    }),
    ...t.comparisons === "pairwise" ? {
      comparisons: s.flatMap((c) => tl(l(c), o.comparisons.get(c.key) ?? [])),
      testDescription: fs(t, i.length)
    } : {}
  };
}
function Hw(t, e) {
  const n = t.recipe;
  return n.kind === "biplot" || n.kind === "histogram" ? Lw(t, n, e) : n.kind === "strategy" ? Fw(t, n, e) : n.kind === "figure" ? Bw(t, n, e) : n.kind === "chart" ? Gw(n, e) : n.kind === "proportions" ? $w(t, n, e) : null;
}
function va(t) {
  if (!Number.isFinite(t)) return "p not computed";
  if (t >= 1e-3) return `p = ${t.toPrecision(2)}`;
  const [e, n] = t.toExponential(1).split("e");
  return `p = ${e} × 10^${Number(n)}`;
}
function ma(t) {
  return t === "Wilcoxon rank-sum" ? "Wilcoxon rank-sum test" : t === "Wilcoxon signed-rank" ? "Wilcoxon signed-rank test" : "Kruskal–Wallis test";
}
function tc(t) {
  const e = t.tests ?? [], n = t.comparisons ?? [];
  if (t.testDescription) {
    const i = [`${t.testDescription}.`], o = tc({ tests: e, testAsked: !1 });
    return o && i.push(o), n.length ? i.push(`Pairs, Holm-adjusted: ${n.map((s) => `${s.panel ? `${s.panel}, ` : ""}${s.groupA} against ${s.groupB}, ${va(s.pAdjusted)}`).join("; ")}.`) : !o && t.testAsked && i.push("No pair could be tested: each group needs two or more values."), i.join(" ");
  }
  if (!e.length) return t.testAsked ? "No test was made: each group needs two or more values, and there must be two or more groups." : "";
  const r = [...new Set(e.map((i) => i.name))];
  return e.length === 1 ? `${ma(e[0].name)}, ${va(e[0].p)}.` : `${r.length === 1 ? `${ma(r[0])} in each panel` : "Tests in each panel"}: ${e.map((i) => `${i.panel ? `${i.panel}, ` : ""}${r.length === 1 ? "" : `${ma(i.name)}, `}${va(i.p)}`).join("; ")}.`;
}
function ec(t) {
  var n, r;
  const e = t.unit ?? "";
  return (n = t.groups) != null && n.length ? [...new Set(t.groups.map((i) => i.label))].map((i) => {
    const o = t.groups.filter((u) => u.label === i).map((u) => u.n), s = Math.min(...o), l = Math.max(...o), c = s === l ? Jr(s) : `${Jr(s)} to ${Jr(l)}`;
    return `${i || "(none)"}, n = ${c} ${l === 1 ? rg(e) : e}`.trim();
  }).join("; ") : (r = t.counts) != null && r.length ? t.counts.length === 1 ? `n = ${Jr(t.counts[0])} ${t.counts[0] === 1 ? "event" : "events"}` : t.populations.map((a, i) => {
    const o = t.counts[i] ?? 0;
    return `${a}, n = ${Jr(o)} ${o === 1 ? "event" : "events"}`;
  }).join("; ") : "";
}
const Xw = [
  { token: "{files}", label: "Files" },
  { token: "{sizes}", label: "n per group" },
  { token: "{unit}", label: "What n counts" },
  { token: "{channel}", label: "Channel" },
  { token: "{statistic}", label: "Statistic" },
  { token: "{test}", label: "Test" },
  { token: "{p}", label: "p" }
];
function ag(t) {
  const e = t.tests ?? [];
  return {
    files: t.files.length <= 3 ? t.files.join(", ") : `${t.files.length} files`,
    sizes: ec(t),
    unit: t.unit ?? "",
    channel: t.channels.join(" vs "),
    statistic: t.value ?? t.statistic ?? "",
    test: [.../* @__PURE__ */ new Set([...e.map((n) => ma(n.name)), ...(t.comparisons ?? []).map((n) => ma(n.name))])].join(", "),
    p: [...e.map((n) => va(n.p)), ...(t.comparisons ?? []).map((n) => `${n.groupA} against ${n.groupB}, adjusted ${va(n.pAdjusted)}`)].join("; ")
  };
}
const Vw = /\{(files|sizes|unit|channel|statistic|test|p)\}/g;
function el(t) {
  return /\{(files|sizes|unit|channel|statistic|test|p)\}/.test(t);
}
function nl(t, e) {
  if (!e) return t;
  const n = ag(e);
  return t.replace(Vw, (r, a) => n[a] ?? "");
}
function Vd(t) {
  return t.length <= 3 ? { value: t.join(", ") } : { value: `${t.slice(0, 3).join(", ")} + ${t.length - 3} more`, full: t.join(", ") };
}
function Kw(t) {
  const e = [{ term: "Shows", value: t.shows }];
  t.panel && e.push({ term: "Panel", value: t.panel }), t.page && e.push({ term: "Page", value: t.page }), t.files.length && e.push({ term: t.files.length === 1 ? "File" : "Files", ...t.files.length > 1 ? { count: t.files.length } : {}, ...Vd(t.files) }), t.populations.length && e.push({ term: t.populations.length === 1 ? "Population" : "Populations", ...Vd(t.populations) }), t.channels.length && e.push({ term: t.channels.length === 1 ? "Channel" : "Channels", value: t.channels.join(", ") }), t.value && e.push({ term: "Value", value: t.value }), t.groupTitle && e.push({ term: "Grouped by", value: t.groupTitle });
  const n = ec(t);
  n && e.push({ term: "n", value: n }), t.centre && e.push({ term: "Drawn", value: t.centre });
  const r = tc(t);
  return r && e.push({ term: "Test", value: r }), e.push({ term: "Iteration", value: t.follows ? "Drawn for each unit of the sheet's iteration" : "Drawn once" }), e;
}
function qw(t, e, n) {
  const r = t.recipe;
  if (r.kind === "text" && r.readsFrom && el(r.text)) {
    const a = r.readsFrom, i = e.find((o) => o.templateId === a && o.offset.x === t.offset.x && o.offset.y === t.offset.y);
    return i ? { ...t, recipe: { ...r, text: nl(r.text, n(i)) } } : t;
  }
  return r.kind === "chart" && r.title && el(r.title) ? { ...t, recipe: { ...r, title: nl(r.title, n(t)) } } : t;
}
function ig({ source: t }) {
  const { t: e } = It();
  return /* @__PURE__ */ g.jsx("dl", { className: "gl-layout-source-list", children: Kw(t).map((n) => /* @__PURE__ */ g.jsxs($.Fragment, { children: [
    /* @__PURE__ */ g.jsx("dt", { children: n.count === void 0 ? e(n.term) : `${e(n.term)} (${n.count})` }),
    /* @__PURE__ */ g.jsx("dd", { title: n.full, children: n.value })
  ] }, n.term)) });
}
function Uw({ source: t }) {
  const { t: e } = It();
  if (!t) return null;
  const n = ag(t);
  return /* @__PURE__ */ g.jsxs("section", { className: "gl-layout-source", "aria-label": e("Data"), children: [
    /* @__PURE__ */ g.jsx("strong", { children: e("Data") }),
    /* @__PURE__ */ g.jsx(ig, { source: t }),
    /* @__PURE__ */ g.jsxs("details", { className: "gl-layout-source-placeholders", children: [
      /* @__PURE__ */ g.jsx(ba, { children: e("Placeholders") }),
      /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: e("This block's title, and a text block that reads from it, may use these. {n} stays the page number of an iteration.") }),
      /* @__PURE__ */ g.jsx("dl", { className: "gl-layout-source-list", children: Xw.map(({ token: r, label: a }) => /* @__PURE__ */ g.jsxs($.Fragment, { children: [
        /* @__PURE__ */ g.jsx("dt", { children: /* @__PURE__ */ g.jsx("code", { children: r }) }),
        /* @__PURE__ */ g.jsx("dd", { title: e(a), children: n[r.slice(1, -1)] || "–" })
      ] }, r)) })
    ] })
  ] });
}
const Zw = 500;
function Jw({
  container: t,
  describe: e
}) {
  const [n, r] = $.useState(null), a = $.useRef(e);
  if (a.current = e, $.useEffect(() => {
    if (!t) return;
    let s = 0, l = null, c = null;
    const u = () => {
      c && c.element.setAttribute("title", c.title), c = null;
    }, f = () => {
      window.clearTimeout(s), s = 0, u(), r(null);
    }, d = (m) => {
      var S, C;
      if (m.buttons) {
        l = null, f();
        return;
      }
      const v = ((C = (S = m.target) == null ? void 0 : S.closest) == null ? void 0 : C.call(S, ".gl-layout-item")) ?? null;
      if (v === l) return;
      l = v, f();
      const y = v == null ? void 0 : v.dataset.itemId;
      if (!v || !y) return;
      const b = { x: m.clientX, y: m.clientY };
      s = window.setTimeout(() => {
        s = 0;
        const k = a.current(y);
        if (!k) return;
        const M = v.getAttribute("title");
        M !== null && (c = { element: v, title: M }, v.removeAttribute("title")), r({ source: k, ...b });
      }, Zw);
    }, h = () => {
      l = null, f();
    };
    return t.addEventListener("mousemove", d), t.addEventListener("mouseleave", h), t.addEventListener("mousedown", h, !0), t.addEventListener("wheel", h, { passive: !0 }), () => {
      t.removeEventListener("mousemove", d), t.removeEventListener("mouseleave", h), t.removeEventListener("mousedown", h, !0), t.removeEventListener("wheel", h), window.clearTimeout(s), u();
    };
  }, [t]), !n || typeof document > "u") return null;
  const i = 360, o = Math.max(8, Math.min(n.x + 14, (window.innerWidth || i + 16) - i - 8));
  return Bv.createPortal(
    /* @__PURE__ */ g.jsx("div", { className: "gl-layout-source-tip", role: "tooltip", style: { left: o, top: n.y + 16, maxWidth: i }, children: /* @__PURE__ */ g.jsx(ig, { source: n.source }) }),
    document.body
  );
}
function Qw({ date: t, onRegenerate: e }) {
  const { t: n, language: r } = It();
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-legend-mark", children: [
    /* @__PURE__ */ g.jsx("span", { children: n("Legend written {date}", { date: t }) }),
    /* @__PURE__ */ g.jsx(
      "button",
      {
        type: "button",
        className: "gl-mini-btn",
        title: n("Write this legend again from the sheet as it is now"),
        onClick: () => {
          window.confirm(n("Replace this legend's text with a new one written from the sheet? Edits made to it are lost; Undo brings them back.")) && e();
        },
        children: n("Regenerate")
      }
    ),
    r !== "en" && /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: n("The legend is written in English, as journals take it.") })
  ] });
}
function tS(t) {
  const e = [...t].sort((r, a) => r.y - a.y || r.x - a.x), n = [];
  for (const r of e) {
    const a = n[n.length - 1], i = a == null ? void 0 : a[0];
    i && r.y - i.y < Math.min(i.height, r.height) / 2 ? a.push(r) : n.push([r]);
  }
  return n.flatMap((r) => r.sort((a, i) => a.x - i.x));
}
function eS(t) {
  return `Panel ${t + 1}.`;
}
function nS(t, e) {
  return t.length - e.length || t.toUpperCase().localeCompare(e.toUpperCase());
}
function Kd(t) {
  const e = ec(t), n = t.groupTitle ? `, grouped by ${t.groupTitle}` : "", r = t.panel ? ` (panel ${t.panel})` : t.page ? ` (page ${t.page})` : "", a = [`${t.shows}${r}${n}${e ? ` (${e})` : ""}.`];
  t.follows && a.push("Drawn for each unit of the sheet's iteration; this page is shown."), t.centre && a.push(t.centre);
  const i = tc(t);
  return i && a.push(i), a.join(" ");
}
function rS(t, e, n) {
  const r = tS(t).flatMap((o) => {
    const s = e(o);
    return s && s.kind !== "legend" ? [{ source: s, letter: n == null ? void 0 : n(o) }] : [];
  }), a = r.filter((o) => o.letter).sort((o, s) => nS(o.letter, s.letter)), i = r.filter((o) => !o.letter);
  return [
    ...a.map(({ source: o, letter: s }) => `${s}. ${Kd(o)}`),
    ...i.map(({ source: o }, s) => `${eS(s)} ${Kd(o)}`)
  ].join(`
`);
}
function og(t = /* @__PURE__ */ new Date()) {
  const e = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${e(t.getMonth() + 1)}-${e(t.getDate())}`;
}
function aS(t, e) {
  if (!t.length) return { x: e, y: e, width: 480 };
  const n = Math.min(...t.map((i) => i.x)), r = Math.max(...t.map((i) => i.x + i.width)), a = Math.max(...t.map((i) => i.y + i.height));
  return { x: n, y: a + 12, width: Math.max(320, r - n) };
}
const Si = 10;
function qd(t, e, n, r = /* @__PURE__ */ new Date(), a) {
  const i = rS(t, e, a);
  if (!i) return null;
  const { x: o, y: s, width: l } = aS(t, n), c = Gv(i, Si, l), u = i.split(`
`).reduce((d, h) => d + Math.max(1, Math.ceil(h.length * Si * 0.5 / l)), 0), f = Math.max(20, c ? c.height : Math.ceil(u * Si * 1.4) + 8);
  return {
    recipe: { kind: "text", text: i, fontSize: Si, legendGenerated: og(r) },
    frame: { x: o, y: s, width: l, height: f }
  };
}
const iS = ["line", "arrow", "bracket", "rectangle", "ellipse"], wt = (t) => String(Math.round(t * 1e3) / 1e3 || 0);
function oS(t, e) {
  return t === "dashed" ? `${wt(4 * e)} ${wt(3 * e)}` : t === "dotted" ? `${wt(e)} ${wt(1.5 * e)}` : null;
}
function sg(t, e, n) {
  const r = t ?? "top-left", a = r.endsWith("left"), i = r.startsWith("top");
  return {
    start: { x: a ? 0 : e, y: i ? 0 : n },
    end: { x: a ? e : 0, y: i ? n : 0 }
  };
}
function lg(t) {
  const e = 4 + 4 * t;
  return { length: e, halfWidth: e * 0.45 };
}
function sS(t, e, n) {
  const r = t.x - e.x, a = t.y - e.y, i = Math.hypot(r, a);
  if (i < 1e-6) return null;
  const o = r / i, s = a / i, { length: l, halfWidth: c } = lg(n), u = t.x - o * l, f = t.y - s * l;
  return `M${wt(t.x)} ${wt(t.y)} L${wt(u - s * c)} ${wt(f + o * c)} L${wt(u + s * c)} ${wt(f - o * c)} Z`;
}
function cg(t, e, n, r) {
  const a = Math.max(0, e);
  switch (t ?? "down") {
    case "up":
      return `M0 ${wt(r - a)} L0 ${wt(r)} L${wt(n)} ${wt(r)} L${wt(n)} ${wt(r - a)}`;
    case "right":
      return `M${wt(a)} 0 L0 0 L0 ${wt(r)} L${wt(a)} ${wt(r)}`;
    case "left":
      return `M${wt(n - a)} 0 L${wt(n)} 0 L${wt(n)} ${wt(r)} L${wt(n - a)} ${wt(r)}`;
    default:
      return `M0 ${wt(a)} L0 0 L${wt(n)} 0 L${wt(n)} ${wt(a)}`;
  }
}
function lS(t) {
  const e = oS(t.dash, t.strokeWidth);
  return {
    stroke: t.stroke,
    "stroke-width": wt(t.strokeWidth),
    ...e ? { "stroke-dasharray": e } : {}
  };
}
function cS(t, e, n) {
  const r = Math.max(0, e), a = Math.max(0, n), i = lS(t);
  if (t.shape === "rectangle") {
    const S = Math.min(t.cornerRadius ?? 0, r / 2, a / 2);
    return [{
      tag: "rect",
      attrs: { x: "0", y: "0", width: wt(r), height: wt(a), ...S > 0 ? { rx: wt(S), ry: wt(S) } : {}, fill: t.fill ?? "none", ...i }
    }];
  }
  if (t.shape === "ellipse")
    return [{ tag: "ellipse", attrs: { cx: wt(r / 2), cy: wt(a / 2), rx: wt(r / 2), ry: wt(a / 2), fill: t.fill ?? "none", ...i } }];
  if (t.shape === "bracket")
    return [{ tag: "path", attrs: { d: cg(t.side, t.ends ?? 0, r, a), fill: "none", "stroke-linejoin": "miter", ...i } }];
  const { start: o, end: s } = sg(t.from, r, a), l = t.arrows ?? "none", c = l === "start" || l === "both", u = l === "end" || l === "both", f = Math.hypot(s.x - o.x, s.y - o.y), d = f > 0 ? (s.x - o.x) / f : 0, h = f > 0 ? (s.y - o.y) / f : 0, m = lg(t.strokeWidth).length * 0.8, v = c ? Math.min(m, f / 2) : 0, y = u ? Math.min(m, f / 2) : 0, b = [{
    tag: "line",
    attrs: {
      x1: wt(o.x + d * v),
      y1: wt(o.y + h * v),
      x2: wt(s.x - d * y),
      y2: wt(s.y - h * y),
      fill: "none",
      ...i
    }
  }];
  for (const [S, C] of [...c ? [[o, s]] : [], ...u ? [[s, o]] : []]) {
    const k = sS(S, C, t.strokeWidth);
    k && b.push({ tag: "path", attrs: { d: k, fill: t.stroke, stroke: "none" } });
  }
  return b;
}
function uS(t, e, n) {
  const r = Math.max(0, e), a = Math.max(0, n);
  if (t.shape === "line") {
    const { start: i, end: o } = sg(t.from, r, a);
    return { tag: "line", attrs: { x1: wt(i.x), y1: wt(i.y), x2: wt(o.x), y2: wt(o.y) } };
  }
  return t.shape === "bracket" ? { tag: "path", attrs: { d: cg(t.side, t.ends ?? 0, r, a) } } : t.shape === "ellipse" ? { tag: "ellipse", attrs: { cx: wt(r / 2), cy: wt(a / 2), rx: wt(r / 2), ry: wt(a / 2) } } : { tag: "rect", attrs: { x: "0", y: "0", width: wt(r), height: wt(a) } };
}
const Ud = Math.tan(Math.PI / 8);
function ug(t, e) {
  const n = Math.abs(t), r = Math.abs(e);
  if (r <= n * Ud) return { dx: t, dy: 0 };
  if (n <= r * Ud) return { dx: 0, dy: e };
  const a = Math.max(n, r);
  return { dx: Math.sign(t) * a, dy: Math.sign(e) * a };
}
function dS(t, e) {
  const n = Math.max(Math.abs(t), Math.abs(e));
  return { dx: (t < 0 ? -1 : 1) * n, dy: (e < 0 ? -1 : 1) * n };
}
function fS(t) {
  return t === "line" || t === "arrow" ? { width: 120, height: 0 } : t === "bracket" ? { width: 120, height: 12 } : { width: 120, height: 80 };
}
function pS(t, e, n, r) {
  let a = Math.round(n.x - e.x), i = Math.round(n.y - e.y);
  const o = t === "line" || t === "arrow";
  r && ({ dx: a, dy: i } = o ? ug(a, i) : dS(a, i));
  const s = Math.round(Math.min(e.x, e.x + a)), l = Math.round(Math.min(e.y, e.y + i)), c = { x: s, y: l, width: Math.abs(a), height: Math.abs(i) }, u = If(t);
  if (o)
    u.from = `${i < 0 ? "bottom" : "top"}-${a < 0 ? "right" : "left"}`;
  else if (t === "bracket") {
    const f = c.height > c.width, d = f ? c.width : c.height;
    return { recipe: jf({ ...u, side: f ? "right" : "down", ends: d >= 2 ? d : u.ends }), frame: c };
  }
  return { recipe: u, frame: c };
}
function hS(t, e) {
  return { recipe: If(t), frame: { x: Math.round(e.x), y: Math.round(e.y), ...fS(t) } };
}
function gS(t, e, n) {
  if (!n || !t || t.kind !== "shape" || t.shape !== "line") return null;
  const { dx: r, dy: a } = ug(e.width, e.height), i = Math.abs(r), o = Math.abs(a), [s, l] = e.direction ?? [1, 1];
  return {
    width: i,
    height: o,
    // A handle on the left or the top moves that edge: the right or bottom edge stays put.
    left: s < 0 ? e.drag.left + e.width - i : e.drag.left,
    top: l < 0 ? e.drag.top + e.height - o : e.drag.top
  };
}
const vS = {
  line: ["arrows", "from"],
  bracket: ["side", "ends"],
  rectangle: ["fill", "cornerRadius"],
  ellipse: ["fill"]
}, mS = ["stroke", "strokeWidth", "dash"];
function dg(t, e) {
  return mS.includes(e) || vS[t].includes(e);
}
function xS(t, e) {
  const n = { ...t };
  for (const [r, a] of Object.entries(e))
    r === "kind" || r === "shape" || !dg(t.shape, r) || (a === null ? delete n[r] : n[r] = a);
  return jf(n) ?? t;
}
const yS = (t) => Object.fromEntries(Object.entries(t).map(([e, n]) => [e.replace(/-([a-z])/g, (r, a) => a.toUpperCase()), n])), Zd = (t, e, n = {}) => $.createElement(t.tag, { key: e, ...yS(t.attrs), ...n });
function fg({ recipe: t, width: e, height: n, hit: r = !0 }) {
  const a = (t.shape === "rectangle" || t.shape === "ellipse") && !!t.fill;
  return /* @__PURE__ */ g.jsxs(
    "svg",
    {
      className: "gl-layout-shape",
      "data-shape": t.shape,
      width: Math.max(1, e),
      height: Math.max(1, n),
      overflow: "visible",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ g.jsx("g", { className: "gl-layout-shape-art", children: cS(t, e, n).map((i, o) => Zd(i, o)) }),
        r && Zd(uS(t, e, n), "hit", {
          className: "gl-layout-shape-hit",
          fill: a ? "transparent" : "none",
          stroke: "transparent",
          pointerEvents: a ? "all" : "stroke",
          // Ten screen pixels at any zoom (--gl-hair is one screen pixel in page px), or the stroke and a margin when that is wider.
          style: { strokeWidth: `max(calc(10 * var(--gl-hair, 1px)), ${t.strokeWidth + 4}px)` }
        })
      ]
    }
  );
}
function bS(t, e, n) {
  return {
    grid: t,
    vertical: [...e.vertical, ...n.flatMap((r) => [r.x, r.x + r.width / 2, r.x + r.width])],
    horizontal: [...e.horizontal, ...n.flatMap((r) => [r.y, r.y + r.height / 2, r.y + r.height])]
  };
}
function Jd(t, e, n, r) {
  let a = t, i = n;
  for (const o of e) {
    const s = Math.abs(o - t);
    s <= i && (a = o, i = s);
  }
  return a !== t || i < n ? a : r > 0 ? Math.round(t / r) * r : t;
}
function wS({
  tool: t,
  zoom: e,
  snap: n,
  onDraw: r,
  onCancel: a
}) {
  const { t: i } = It(), o = $.useRef(null), [s, l] = $.useState(null), c = $.useRef({ tool: t, zoom: e, snap: n, onDraw: r, onCancel: a });
  return c.current = { tool: t, zoom: e, snap: n, onDraw: r, onCancel: a }, $.useEffect(() => {
    const u = (f) => {
      f.key === "Escape" && c.current.onCancel();
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, []), $.useEffect(() => {
    const u = o.current;
    if (!u) return;
    const f = (m, v) => {
      const y = u.getBoundingClientRect(), { zoom: b, snap: S } = c.current, C = { x: (m.clientX - y.left) / b, y: (m.clientY - y.top) / b };
      if (m.metaKey || m.ctrlKey) return C;
      const k = 6 / b;
      return { x: Jd(C.x, S.vertical, k, S.grid), y: Jd(C.y, S.horizontal, k, S.grid) };
    }, d = (m) => {
      if (m.button !== 0) return;
      m.stopPropagation(), m.preventDefault();
      const v = f(m), y = { x: m.clientX, y: m.clientY }, b = (k) => pS(c.current.tool, v, f(k), k.shiftKey), S = (k) => l(b(k)), C = (k) => {
        window.removeEventListener("mousemove", S, !0), window.removeEventListener("mouseup", C, !0), l(null);
        const M = Math.hypot(k.clientX - y.x, k.clientY - y.y) >= 3;
        c.current.onDraw(M ? b(k) : hS(c.current.tool, v));
      };
      window.addEventListener("mousemove", S, !0), window.addEventListener("mouseup", C, !0);
    }, h = (m) => m.stopPropagation();
    return u.addEventListener("mousedown", d), u.addEventListener("pointerdown", h), u.addEventListener("touchstart", h), () => {
      u.removeEventListener("mousedown", d), u.removeEventListener("pointerdown", h), u.removeEventListener("touchstart", h);
    };
  }, []), /* @__PURE__ */ g.jsx(
    "div",
    {
      ref: o,
      className: "gl-layout-shape-draw",
      "data-tool": t,
      title: i("Drag on the page to draw; click to place one; Shift holds a line to 45° steps; Escape cancels"),
      onContextMenu: (u) => {
        u.preventDefault(), u.stopPropagation(), a();
      },
      children: s && /* @__PURE__ */ g.jsx("div", { className: "gl-layout-shape-preview", style: { left: s.frame.x, top: s.frame.y, width: s.frame.width, height: s.frame.height }, children: /* @__PURE__ */ g.jsx(fg, { recipe: s.recipe, width: s.frame.width, height: s.frame.height, hit: !1 }) })
    }
  );
}
const fe = 18, es = [1, 5, 10, 50, 100, 500], SS = 6, CS = 34;
function kS(t) {
  const e = or * Math.max(t, 1e-6), n = (i) => es.find((o) => o * e >= i) ?? es[es.length - 1], r = n(SS), a = Math.max(r, n(CS));
  return { tickMm: r, labelMm: a };
}
function ES(t, e, n) {
  const { tickMm: r, labelMm: a } = kS(n), i = or * n, o = Math.ceil(-t / i / r) * r, s = (e - t) / i, l = [];
  for (let c = o; c <= s && l.length < 2e3; c += r) {
    const u = Math.round(c) || 0;
    l.push({ at: t + u * i, mm: u, major: u % a === 0 });
  }
  return l;
}
const MS = 6;
function Qd(t, e, n, r, a) {
  const i = r * n, o = [];
  for (let s = 0; s < a; s++) {
    const l = t + s * i, c = s === a - 1, u = c ? 1 / 0 : l + i;
    if (!(u < 0 || s > 0 && l > e))
      for (const f of ES(l, e, n)) {
        if (s > 0 && f.at < l || f.at >= u) continue;
        const d = !c && f.major && u - f.at < 4 + String(f.mm).length * MS;
        o.push(d ? { ...f, major: !1 } : f);
      }
  }
  return o;
}
function pg(t) {
  return Math.round(t * 100) / 100;
}
function DS(t) {
  const e = [], n = [];
  for (const r of (t == null ? void 0 : t.guides) ?? []) (r.axis === "x" ? e : n).push(r.at);
  return { vertical: e, horizontal: n };
}
function TS(t) {
  var e;
  return (e = t.guides) != null && e.length ? { guides: t.guides.map((n) => ({ ...n })) } : {};
}
function _S(t, e) {
  t.guides = [...t.guides ?? [], { axis: e.axis, at: pg(e.at) }];
}
function jS(t, e, n) {
  var r;
  (r = t.guides) != null && r[e] && (t.guides = t.guides.map((a, i) => i === e ? { ...a, at: pg(n) } : a));
}
function IS(t, e) {
  var r;
  if (!((r = t.guides) != null && r[e])) return;
  const n = t.guides.filter((a, i) => i !== e);
  n.length ? t.guides = n : delete t.guides;
}
function RS(t) {
  delete t.guides;
}
function PS(t, e, n, r) {
  return t === "y" ? r < e.top + fe : n < e.left + fe;
}
const NS = (t, e) => t.width === e.width && t.height === e.height && t.originX === e.originX && t.originY === e.originY;
function OS({
  scroller: t,
  page: e,
  zoom: n,
  pages: r,
  selected: a,
  onAddGuide: i
}) {
  const { t: o } = It(), s = ir(a), [l, c] = $.useState({ width: 0, height: 0, originX: 0, originY: 0 }), [u, f] = $.useState(null), [d, h] = $.useState(null), m = $.useRef({ scroller: t, page: e, zoom: n, onAddGuide: i });
  m.current = { scroller: t, page: e, zoom: n, onAddGuide: i };
  const v = () => {
    const { scroller: C, page: k } = m.current;
    if (!C || !k) return;
    const M = C.getBoundingClientRect(), E = k.getBoundingClientRect(), D = {
      width: C.clientWidth || M.width,
      height: C.clientHeight || M.height,
      originX: E.left - M.left,
      originY: E.top - M.top
    };
    c((j) => NS(j, D) ? j : D);
  };
  $.useLayoutEffect(v), $.useEffect(() => {
    if (!t) return;
    const C = () => v(), k = (D) => {
      const j = t.getBoundingClientRect();
      f({ x: D.clientX - j.left, y: D.clientY - j.top });
    }, M = () => f(null);
    t.addEventListener("scroll", C, { passive: !0 }), t.addEventListener("mousemove", k), t.addEventListener("mouseleave", M), window.addEventListener("resize", C);
    const E = typeof ResizeObserver > "u" ? null : new ResizeObserver(C);
    return E == null || E.observe(t), () => {
      t.removeEventListener("scroll", C), t.removeEventListener("mousemove", k), t.removeEventListener("mouseleave", M), window.removeEventListener("resize", C), E == null || E.disconnect();
    };
  }, [t]);
  const y = (C) => (k) => {
    if (k.button !== 0 || !t) return;
    k.preventDefault();
    const M = (j) => {
      const R = t.getBoundingClientRect();
      return { x: j.clientX - R.left, y: j.clientY - R.top };
    }, E = (j) => h({ axis: C, ...M(j) }), D = (j) => {
      window.removeEventListener("mousemove", E, !0), window.removeEventListener("mouseup", D, !0), h(null);
      const { scroller: R, page: _, zoom: x, onAddGuide: P } = m.current;
      if (!R || !_) return;
      const I = R.getBoundingClientRect(), A = R.clientWidth || I.width, B = R.clientHeight || I.height, q = j.clientX - I.left, F = j.clientY - I.top;
      if (!(q >= 0 && F >= 0 && q <= A && F <= B && (C === "y" ? F >= fe : q >= fe))) return;
      const W = _.getBoundingClientRect();
      P({ axis: C, at: C === "y" ? (j.clientY - W.top) / x : (j.clientX - W.left) / x });
    };
    window.addEventListener("mousemove", E, !0), window.addEventListener("mouseup", D, !0), h({ axis: C, ...M(k.nativeEvent) });
  }, b = (C) => C * n, S = (C) => {
    const k = C === "top", M = k ? l.width : l.height, E = k ? l.originX : l.originY, D = Ln(r), j = k ? Qd(E, M, n, D.width, r.columns) : Qd(E, M, n, D.height, r.rows), R = s ? { from: E + b(k ? s.x : s.y), size: b(k ? s.width : s.height) } : null, _ = u ? k ? u.x : u.y : null;
    return /* @__PURE__ */ g.jsx(
      "div",
      {
        className: `gl-layout-ruler is-${C}`,
        style: k ? { width: l.width, height: fe } : { width: fe, height: l.height },
        title: o(k ? "Drag onto the page to place a horizontal guide" : "Drag onto the page to place a vertical guide"),
        onMouseDown: y(k ? "y" : "x"),
        children: /* @__PURE__ */ g.jsxs("svg", { width: k ? l.width : fe, height: k ? fe : l.height, "aria-hidden": "true", children: [
          R && (k ? /* @__PURE__ */ g.jsx("rect", { className: "gl-layout-ruler-selection", x: R.from, y: 0, width: R.size, height: fe }) : /* @__PURE__ */ g.jsx("rect", { className: "gl-layout-ruler-selection", x: 0, y: R.from, width: fe, height: R.size })),
          j.map((x) => {
            const P = x.major ? fe : x.mm % 5 === 0 ? fe * 0.45 : fe * 0.3;
            return k ? /* @__PURE__ */ g.jsx("line", { x1: x.at, x2: x.at, y1: fe - P, y2: fe }, x.at) : /* @__PURE__ */ g.jsx("line", { y1: x.at, y2: x.at, x1: fe - P, x2: fe }, x.at);
          }),
          j.filter((x) => x.major).map((x) => k ? /* @__PURE__ */ g.jsx("text", { x: x.at + 2, y: 9, children: x.mm }, `l${x.at}`) : /* @__PURE__ */ g.jsx("text", { x: 9, y: x.at + 2, transform: `rotate(-90 9 ${x.at + 2})`, textAnchor: "end", children: x.mm }, `l${x.at}`)),
          _ !== null && (k ? /* @__PURE__ */ g.jsx("line", { className: "gl-layout-ruler-pointer", x1: _, x2: _, y1: 0, y2: fe }) : /* @__PURE__ */ g.jsx("line", { className: "gl-layout-ruler-pointer", y1: _, y2: _, x1: 0, x2: fe }))
        ] })
      }
    );
  };
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-rulers", "data-testid": "layout-rulers", children: [
    S("top"),
    S("left"),
    /* @__PURE__ */ g.jsx("div", { className: "gl-layout-ruler-corner", title: o("Rulers in mm from each page's top-left corner"), children: "mm" }),
    d && (d.axis === "y" ? /* @__PURE__ */ g.jsx("div", { className: "gl-layout-guide-draft is-y", style: { top: d.y, width: l.width } }) : /* @__PURE__ */ g.jsx("div", { className: "gl-layout-guide-draft is-x", style: { left: d.x, height: l.height } }))
  ] });
}
function AS({ on: t, onToggle: e }) {
  const { t: n } = It();
  return /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": t, onClick: e, title: n("Show rulers in mm along the top and left of the page; drag from a ruler to place a guide"), children: n("Rulers") });
}
const zS = 4, tf = (t, e, n) => e === "x" ? ps(t, n, 0).x : ps(t, 0, n).y;
function LS({
  guides: t,
  width: e,
  height: n,
  pages: r,
  zoom: a,
  scroller: i,
  onMove: o,
  onRemove: s
}) {
  const { t: l } = It(), c = $.useRef(null), [u, f] = $.useState(null), [d, h] = $.useState(null), m = $.useRef({ guides: t, zoom: a, scroller: i, onMove: o, onRemove: s });
  m.current = { guides: t, zoom: a, scroller: i, onMove: o, onRemove: s }, $.useEffect(() => {
    const y = c.current;
    if (!y) return;
    const b = (C) => {
      const k = C.target.closest(".gl-layout-guide");
      if (!k || C.button !== 0) return;
      C.stopPropagation(), C.preventDefault(), k.focus({ preventScroll: !0 });
      const M = Number(k.dataset.guideIndex), E = m.current.guides[M];
      if (!E) return;
      const D = { x: C.clientX, y: C.clientY }, j = (P) => {
        const I = y.getBoundingClientRect(), A = m.current.zoom;
        return E.axis === "x" ? (P.clientX - I.left) / A : (P.clientY - I.top) / A;
      }, R = (P) => Math.hypot(P.clientX - D.x, P.clientY - D.y) >= 3, _ = (P) => {
        R(P) && f({ index: M, at: j(P) });
      }, x = (P) => {
        var A;
        if (window.removeEventListener("mousemove", _, !0), window.removeEventListener("mouseup", x, !0), f(null), !R(P)) return;
        const I = (A = m.current.scroller) == null ? void 0 : A.getBoundingClientRect();
        I && PS(E.axis, I, P.clientX, P.clientY) ? m.current.onRemove(M) : m.current.onMove(M, j(P));
      };
      window.addEventListener("mousemove", _, !0), window.addEventListener("mouseup", x, !0);
    }, S = (C) => {
      C.target.closest(".gl-layout-guide, .gl-layout-guide-field") && C.stopPropagation();
    };
    return y.addEventListener("mousedown", b), y.addEventListener("pointerdown", S), y.addEventListener("touchstart", S), () => {
      y.removeEventListener("mousedown", b), y.removeEventListener("pointerdown", S), y.removeEventListener("touchstart", S);
    };
  }, []);
  const v = (zS * 2 + 1) / a;
  return /* @__PURE__ */ g.jsxs("div", { ref: c, className: "gl-layout-guides", "aria-label": l("Guides"), children: [
    t.map((y, b) => {
      const S = (u == null ? void 0 : u.index) === b ? u.at : y.at, C = ga(S - tf(r, y.axis, S), "mm");
      return /* @__PURE__ */ g.jsx(
        "div",
        {
          className: `gl-layout-guide is-${y.axis}`,
          "data-guide-index": b,
          role: "separator",
          "aria-orientation": y.axis === "x" ? "vertical" : "horizontal",
          "aria-label": y.axis === "x" ? l("Vertical guide at {mm} mm", { mm: C }) : l("Horizontal guide at {mm} mm", { mm: C }),
          title: l("Drag to move; drag onto its ruler or press Delete to remove; double-click to type its position"),
          tabIndex: 0,
          style: y.axis === "x" ? { left: S - v / 2, top: 0, width: v, height: n } : { top: S - v / 2, left: 0, height: v, width: e },
          onDoubleClick: (k) => {
            k.stopPropagation(), h(b);
          },
          onKeyDown: (k) => {
            k.key === "Delete" || k.key === "Backspace" ? (k.preventDefault(), k.stopPropagation(), s(b)) : k.key === "Enter" && (k.preventDefault(), k.stopPropagation(), h(b));
          }
        },
        b
      );
    }),
    d !== null && t[d] && /* @__PURE__ */ g.jsx(
      FS,
      {
        guide: t[d],
        edge: tf(r, t[d].axis, t[d].at),
        zoom: a,
        onCommit: (y) => {
          h(null), y !== t[d].at && o(d, y);
        },
        onCancel: () => h(null)
      }
    )
  ] });
}
function FS({ guide: t, edge: e, zoom: n, onCommit: r, onCancel: a }) {
  const { t: i } = It(), o = $.useRef(!1), s = (c) => {
    if (o.current) return;
    o.current = !0;
    const u = Number(c);
    c.trim() === "" || !Number.isFinite(u) ? a() : r(e + Ui(u, "mm"));
  }, l = t.axis === "x" ? { left: t.at + 4 / n, top: 4 / n } : { top: t.at + 4 / n, left: 4 / n };
  return /* @__PURE__ */ g.jsxs("label", { className: "gl-layout-guide-field", style: { ...l, transform: `scale(${1 / n})` }, children: [
    t.axis === "x" ? i("X (mm)") : i("Y (mm)"),
    /* @__PURE__ */ g.jsx(
      "input",
      {
        type: "number",
        step: 0.1,
        autoFocus: !0,
        "aria-label": i("Guide position (mm)"),
        defaultValue: ga(t.at - e, "mm"),
        onKeyDown: (c) => {
          c.stopPropagation(), c.key === "Enter" ? s(c.currentTarget.value) : c.key === "Escape" && (o.current = !0, a());
        },
        onBlur: (c) => s(c.currentTarget.value)
      }
    )
  ] });
}
function BS({ count: t, onClear: e }) {
  const { t: n } = It();
  return /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: e, disabled: !t, title: n("Remove every guide on this sheet"), children: n("Clear guides") });
}
const hg = {
  line: "Line",
  arrow: "Arrow",
  bracket: "Bracket",
  rectangle: "Rectangle",
  ellipse: "Ellipse"
};
function gg(t) {
  return t.shape === "line" ? t.arrows && t.arrows !== "none" ? "Arrow" : "Line" : hg[t.shape];
}
function ef(t) {
  return t.filter((e) => e.recipe.kind === "shape");
}
function vg(t, e, n) {
  return iS.map((r) => ({
    label: t(hg[r]),
    className: `gl-layout-shape-tool-${r}`,
    checked: e === r,
    onClick: () => n(r)
  }));
}
function GS(t, e, n) {
  return ["separator", { section: t("+ Shape") }, ...vg(t, e, n)];
}
function $S({ armed: t, onArm: e }) {
  const { t: n } = It();
  return /* @__PURE__ */ g.jsx(
    ls,
    {
      label: n("+ Shape"),
      className: "gl-layout-shape-menu",
      title: n("Draw a line, arrow, bracket, rectangle or ellipse: choose one, then drag on the page"),
      items: vg(n, t, e)
    }
  );
}
const WS = { solid: "Solid", dashed: "Dashed", dotted: "Dotted" }, YS = { none: "None", end: "At the end", start: "At the start", both: "At both ends" }, HS = {
  "top-left": "Top left to bottom right",
  "bottom-right": "Bottom right to top left",
  "bottom-left": "Bottom left to top right",
  "top-right": "Top right to bottom left"
}, XS = { down: "Down", up: "Up", left: "Left", right: "Right" };
function nf({ shapes: t, onChange: e }) {
  const { t: n } = It();
  if (!t.length) return null;
  const r = (l) => t.find((c) => dg(c.shape, l)), a = (l) => !!r(l), i = t[0], o = r("fill"), s = (l, c, u, f, d) => /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
    n(l),
    /* @__PURE__ */ g.jsx("select", { "aria-label": n(l), value: c, onChange: (h) => d(h.target.value), children: u.map((h) => /* @__PURE__ */ g.jsx("option", { value: h, children: n(f[h]) }, h)) })
  ] });
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-shape-fields", "aria-label": n("Shape"), children: [
    /* @__PURE__ */ g.jsx("strong", { children: t.length === 1 ? n(gg(i)) : n("{n} shapes", { n: t.length }) }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-layout-shape-colour", children: [
      /* @__PURE__ */ g.jsx("input", { type: "color", "aria-label": n("Line colour"), value: i.stroke, onChange: (l) => e({ stroke: l.target.value }) }),
      n("Line colour")
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("Line width (px)"),
      /* @__PURE__ */ g.jsx(
        le,
        {
          "aria-label": n("Line width (px)"),
          min: au[0],
          max: au[1],
          step: 0.25,
          value: i.strokeWidth,
          onCommit: (l) => e({ strokeWidth: l })
        }
      )
    ] }),
    s("Dash", i.dash, $v, WS, (l) => e({ dash: l })),
    a("arrows") && s("Arrowheads", r("arrows").arrows ?? "none", Wv, YS, (l) => e({ arrows: l })),
    a("from") && s("Direction", r("from").from ?? "top-left", Yv, HS, (l) => e({ from: l })),
    a("side") && s("Ends point", r("side").side ?? "down", Hv, XS, (l) => e({ side: l })),
    a("ends") && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("End length (px)"),
      /* @__PURE__ */ g.jsx(
        le,
        {
          "aria-label": n("End length (px)"),
          min: iu[0],
          max: iu[1],
          step: 1,
          value: r("ends").ends ?? 0,
          onCommit: (l) => e({ ends: l })
        }
      )
    ] }),
    o && /* @__PURE__ */ g.jsxs("label", { className: "gl-layout-shape-colour", children: [
      /* @__PURE__ */ g.jsx("input", { type: "checkbox", "aria-label": n("Fill"), checked: !!o.fill, onChange: (l) => e({ fill: l.target.checked ? o.fill ?? "#d9d9d9" : null }) }),
      n("Fill"),
      /* @__PURE__ */ g.jsx("input", { type: "color", "aria-label": n("Fill colour"), value: o.fill ?? "#d9d9d9", onChange: (l) => e({ fill: l.target.value }) })
    ] }),
    a("cornerRadius") && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("Corner radius (px)"),
      /* @__PURE__ */ g.jsx(
        le,
        {
          "aria-label": n("Corner radius (px)"),
          min: ou[0],
          max: ou[1],
          step: 1,
          value: r("cornerRadius").cornerRadius ?? 0,
          onCommit: (l) => e({ cornerRadius: l })
        }
      )
    ] })
  ] });
}
function VS({ recipe: t }) {
  const e = $.useMemo(() => q1(t), [t]);
  return /* @__PURE__ */ g.jsx("img", { className: "gl-layout-placed-image", src: e, alt: t.fileName, draggable: !1, "data-media-type": t.mediaType });
}
function rf(t) {
  const { t: e } = It(), n = $.useRef(t);
  n.current = t;
  const r = $.useRef(e);
  return r.current = e, $.useRef((a, i) => {
    Y1(a, r.current).then((o) => n.current(o, i));
  }).current;
}
function KS({ onFile: t }) {
  const { t: e } = It();
  return /* @__PURE__ */ g.jsx(
    "button",
    {
      className: "gl-mini-btn",
      type: "button",
      title: e("Place an SVG, PNG or JPEG file on the page, kept in the workspace; or drop the file on the page"),
      onClick: () => void Ql().then((n) => n && t(n)),
      children: e("+ Image…")
    }
  );
}
function qS(t, e) {
  return { label: t("+ Image…"), onClick: () => void Ql().then((n) => n && e(n)) };
}
function US(t, e) {
  const n = (r) => {
    var a;
    return [...((a = r.dataTransfer) == null ? void 0 : a.types) ?? []].includes("Files");
  };
  return {
    onDragOver: (r) => {
      n(r) && (r.preventDefault(), r.dataTransfer.dropEffect = "copy");
    },
    onDrop: (r) => {
      var o, s;
      const a = (s = (o = r.dataTransfer) == null ? void 0 : o.files) == null ? void 0 : s[0];
      if (!a) return;
      r.preventDefault();
      const i = r.currentTarget.getBoundingClientRect();
      e(a, { x: (r.clientX - i.left) / t, y: (r.clientY - i.top) / t });
    }
  };
}
const ZS = { "image/svg+xml": "SVG", "image/png": "PNG", "image/jpeg": "JPEG" };
function JS({ recipe: t, onReplace: e }) {
  const { t: n } = It();
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-image-fields", "aria-label": n("Image"), children: [
    /* @__PURE__ */ g.jsxs("dl", { children: [
      /* @__PURE__ */ g.jsx("dt", { children: n("File") }),
      /* @__PURE__ */ g.jsxs("dd", { className: "gl-layout-image-file", children: [
        t.fileName,
        " (",
        ZS[t.mediaType],
        ")"
      ] }),
      /* @__PURE__ */ g.jsx("dt", { children: n("Natural size") }),
      /* @__PURE__ */ g.jsx("dd", { className: "gl-layout-image-natural", children: n("{width} × {height} px", { width: t.naturalWidth, height: t.naturalHeight }) }),
      /* @__PURE__ */ g.jsx("dt", { children: n("Stored size") }),
      /* @__PURE__ */ g.jsx("dd", { className: "gl-layout-image-stored", children: qs(F1(t)) })
    ] }),
    /* @__PURE__ */ g.jsx(
      "button",
      {
        type: "button",
        className: "gl-mini-btn",
        title: n("Take another SVG, PNG or JPEG file in place of this one, in the same frame"),
        onClick: () => void Ql().then((r) => r && e(r)),
        children: n("Replace…")
      }
    )
  ] });
}
function nc(t) {
  return t.rotation ?? 0;
}
function rc(t) {
  return t.recipe.kind === "text" && !xe(t) || t.recipe.kind === "image";
}
function mg(t) {
  return t.length > 0 && t.every(rc);
}
const af = (t, e) => Number.isInteger(t) ? t + Math.trunc(e) : Math.round(t + e);
function QS(t, e) {
  const n = (nc(t) + (e === "right" ? 90 : 270)) % 360, { width: r, height: a } = t;
  t.width = a, t.height = r, t.x = af(t.x, (r - a) / 2), t.y = af(t.y, (a - r) / 2), n ? t.rotation = n : delete t.rotation;
}
function ns(t, e, n) {
  let r = !1;
  for (const a of t.items)
    !e.includes(a.id) || a.locked || !rc(a) || (QS(a, n), r = !0);
  return r;
}
function tC(t, e) {
  if (!(e > 0)) return;
  const n = nc(t);
  if (n === 90 || n === 270) {
    n === 90 && (t.x -= e), t.width += e;
    return;
  }
  n === 180 && (t.y -= e), t.height += e;
}
function eC(t, e, n) {
  if (!t) return;
  const r = t !== 180, a = r ? n : e, i = r ? e : n;
  return {
    width: a,
    height: i,
    marginLeft: (e - a) / 2,
    marginTop: (n - i) / 2,
    transform: `rotate(${t}deg)`
  };
}
const nC = "Turn the text or image 90° anticlockwise; its frame turns about its centre", rC = "Turn the text or image 90° clockwise; its frame turns about its centre", xg = (t) => t.some((e) => !e.locked && rc(e));
function of({ items: t, onTurn: e }) {
  const { t: n } = It();
  if (!mg(t)) return null;
  const r = !xg(t), a = t.length === 1 ? nc(t[0]) : 0;
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions gl-layout-rotation", children: [
    /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", disabled: r, onClick: () => e("left"), title: n(nC), children: n("Rotate left") }),
    /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", disabled: r, onClick: () => e("right"), title: n(rC), children: n("Rotate right") }),
    a !== 0 && /* @__PURE__ */ g.jsx("span", { className: "gl-hint gl-layout-rotation-state", children: n("Turned {degrees}°", { degrees: a }) })
  ] });
}
function aC(t, e, n) {
  if (!mg(e)) return [];
  const r = !xg(e);
  return [
    { label: t("Rotate left"), disabled: r, onClick: () => n("left") },
    { label: t("Rotate right"), disabled: r, onClick: () => n("right") }
  ];
}
function sf({ turn: t, width: e, height: n, children: r }) {
  const a = eC(t ?? 0, e, n);
  return a ? /* @__PURE__ */ g.jsx("div", { className: "gl-layout-turned", "data-turn": t, style: a, children: r }) : /* @__PURE__ */ g.jsx(g.Fragment, { children: r });
}
function iC(t, e) {
  return t > 0 ? Math.ceil(t * e) : 0;
}
function oC(t) {
  return {
    ...t != null && t.italic ? { fontStyle: "italic" } : {},
    ...t != null && t.color ? { color: t.color } : {},
    ...t != null && t.align ? { textAlign: t.align } : {}
  };
}
function sC(t, e) {
  let n = t.text;
  return t.sub && (n = /* @__PURE__ */ g.jsx("sub", { children: n })), t.sup && (n = /* @__PURE__ */ g.jsx("sup", { children: n })), t.italic && (n = /* @__PURE__ */ g.jsx("i", { children: n })), t.bold && (n = /* @__PURE__ */ g.jsx("b", { children: n })), /* @__PURE__ */ g.jsx($.Fragment, { children: n }, e);
}
function lC({ text: t, rich: e }) {
  var r;
  if (!e) return /* @__PURE__ */ g.jsx(g.Fragment, { children: t });
  const n = Ni(t, !0);
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    n.map(sC),
    (r = n.at(-1)) != null && r.text.endsWith(`
`) ? /* @__PURE__ */ g.jsx("br", {}) : null
  ] });
}
const rs = {
  bold: { label: "Bold", title: "Bold (Cmd-B)", glyph: /* @__PURE__ */ g.jsx("b", { children: "B" }) },
  italic: { label: "Italic", title: "Italic (Cmd-I)", glyph: /* @__PURE__ */ g.jsx("i", { children: "I" }) },
  sup: { label: "Superscript", title: "Superscript", glyph: /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    "x",
    /* @__PURE__ */ g.jsx("sup", { children: "2" })
  ] }) },
  sub: { label: "Subscript", title: "Subscript", glyph: /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    "x",
    /* @__PURE__ */ g.jsx("sub", { children: "2" })
  ] }) }
}, yg = { bold: !1, italic: !1, sup: !1, sub: !1 };
function bg({ state: t, onToggle: e }) {
  const { t: n } = It();
  return /* @__PURE__ */ g.jsx("div", { className: "gl-layout-text-bar", role: "toolbar", "aria-label": n("Text formatting"), children: Vn.map((r) => /* @__PURE__ */ g.jsx(
    "button",
    {
      type: "button",
      className: "gl-mini-btn" + (t[r] ? " is-active" : ""),
      "aria-label": n(rs[r].label),
      "aria-pressed": t[r],
      title: n(rs[r].title),
      onMouseDown: (a) => a.preventDefault(),
      onClick: () => e(r),
      children: rs[r].glyph
    },
    r
  )) });
}
function wg(t) {
  if (!(t.metaKey || t.ctrlKey) || t.altKey || t.shiftKey) return null;
  const e = t.key.toLowerCase();
  return e === "b" ? "bold" : e === "i" ? "italic" : null;
}
function Sg(t, e, n, r, a) {
  return e !== n ? { runs: Ym(t, e, n, a), start: e, end: n, pending: r } : { runs: t, start: e, end: n, pending: r.includes(a) ? r.filter((i) => i !== a) : [...r, a] };
}
function cC({
  areaRef: t,
  draft: e,
  setDraft: n,
  templateText: r,
  rich: a,
  style: i,
  onCommit: o,
  onEditEnd: s,
  onFocus: l
}) {
  const [c, u] = $.useState(
    () => a ? { runs: Ni(r, !0), start: -1, end: -1, pending: [] } : null
  ), f = $.useRef(!1);
  if (c)
    return /* @__PURE__ */ g.jsx(
      uC,
      {
        start: c,
        templateText: r,
        wasRich: a === !0,
        style: i,
        onCommit: o,
        onEditEnd: s,
        onFocus: l
      }
    );
  const d = (h) => {
    const m = t.current, v = (m == null ? void 0 : m.selectionStart) ?? e.length, y = (m == null ? void 0 : m.selectionEnd) ?? e.length;
    f.current = !0, u(Sg(Ni(e, !1), v, y, [], h));
  };
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx(bg, { state: yg, onToggle: d }),
    /* @__PURE__ */ g.jsx(
      "textarea",
      {
        ref: t,
        className: "gl-layout-text-surface",
        "aria-label": "Layout text",
        value: e,
        style: i,
        onChange: (h) => n(h.target.value),
        onFocus: l,
        onBlur: (h) => {
          f.current || (e !== r && o(e, h.currentTarget.scrollHeight - h.currentTarget.clientHeight), s());
        },
        onKeyDown: (h) => {
          h.stopPropagation();
          const m = wg(h);
          if (m) {
            h.preventDefault(), d(m);
            return;
          }
          h.key === "Escape" && h.currentTarget.blur();
        }
      }
    )
  ] });
}
function uC({
  start: t,
  templateText: e,
  wasRich: n,
  style: r,
  onCommit: a,
  onEditEnd: i,
  onFocus: o
}) {
  const s = $.useRef(null), l = $.useRef(t.runs), c = $.useRef({ marks: t.pending, at: t.start }), [u, f] = $.useState(yg), d = () => {
    const y = s.current;
    if (!y) return;
    const b = Ao(y);
    if (!b) return;
    c.current.marks.length && (b.start !== b.end || b.start !== c.current.at) && (c.current = { marks: [], at: -1 });
    const S = hs(l.current, b.start, b.end), C = ku(S, c.current.marks);
    f({ bold: !!C.bold, italic: !!C.italic, sup: !!C.sup, sub: !!C.sub });
  };
  $.useLayoutEffect(() => {
    const y = s.current;
    if (!y) return;
    Eu(y, l.current), y.focus({ preventScroll: !0 });
    const b = l.current.reduce((k, M) => k + M.text.length, 0), S = t.start < 0 ? b : t.start, C = t.end < 0 ? b : t.end;
    Tu(y, S, C), c.current.at < 0 && (c.current.at = S), d();
  }, []), $.useEffect(() => {
    const y = () => d(), b = s.current, S = (C) => {
      !c.current.marks.length || C.isComposing || C.inputType !== "insertText" || !C.data || (C.preventDefault(), v(C.data));
    };
    return document.addEventListener("selectionchange", y), b == null || b.addEventListener("beforeinput", S), () => {
      document.removeEventListener("selectionchange", y), b == null || b.removeEventListener("beforeinput", S);
    };
  }, []);
  const h = (y, b, S) => {
    const C = s.current;
    C && (l.current = y, Eu(C, y), Tu(C, b, S), d());
  }, m = (y) => {
    const b = s.current;
    if (!b) return;
    const S = Ao(b) ?? { start: c.current.at, end: c.current.at }, C = Math.min(S.start, S.end), k = Math.max(S.start, S.end), M = Sg(l.current, C, k, c.current.marks, y);
    c.current = { marks: M.pending, at: C }, C !== k ? h(M.runs, C, k) : d();
  }, v = (y) => {
    const b = s.current;
    if (!b) return;
    const S = Ao(b);
    if (!S) return;
    const C = Math.min(S.start, S.end), k = Math.max(S.start, S.end), M = ku(hs(l.current, C, C === k ? C : k), c.current.marks);
    c.current = { marks: [], at: -1 }, h(Hm(l.current, C, k, y, M), C + y.length, C + y.length);
  };
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx(bg, { state: u, onToggle: m }),
    /* @__PURE__ */ g.jsx(
      "div",
      {
        ref: s,
        className: "gl-layout-text-surface is-rich-editor",
        role: "textbox",
        "aria-multiline": "true",
        "aria-label": "Layout text",
        contentEditable: !0,
        suppressContentEditableWarning: !0,
        tabIndex: 0,
        style: r,
        onFocus: o,
        onInput: (y) => {
          l.current = Zm(y.currentTarget), d();
        },
        onPaste: (y) => {
          y.preventDefault(), v(y.clipboardData.getData("text/plain").replace(/\r\n?/g, `
`));
        },
        onBlur: (y) => {
          const b = Ff(l.current);
          (b.text !== e || b.rich !== n) && a(b.text, y.currentTarget.scrollHeight - y.currentTarget.clientHeight, b.rich), i();
        },
        onKeyDown: (y) => {
          if (y.stopPropagation(), y.nativeEvent.isComposing) return;
          const b = wg(y);
          if (b) {
            y.preventDefault(), m(b);
            return;
          }
          if (y.key === "Escape") {
            y.currentTarget.blur();
            return;
          }
          if (y.key === "Enter") {
            y.preventDefault(), v(`
`);
            return;
          }
          c.current.marks.length && y.key.length === 1 && !y.metaKey && !y.ctrlKey && !y.altKey && (y.preventDefault(), v(y.key));
        }
      }
    )
  ] });
}
function dC(t, e) {
  if (e.italic === !0 ? t.italic = !0 : e.italic === !1 && delete t.italic, typeof e.color == "string" ? t.color = e.color.toLowerCase() : e.color === null && delete t.color, e.align === "center" || e.align === "right" ? t.align = e.align : e.align === "left" && delete t.align, e.markerSigns) {
    const n = Ff(Vm(Ni(t.text, t.rich)));
    n.rich && (t.text = n.text, t.rich = !0);
  }
}
const fC = "#1e293b";
function pC({
  texts: t,
  onChange: e
}) {
  const { t: n } = It();
  if (!t.length) return null;
  const r = [...new Set(t.map((i) => i.color ?? fC))], a = [...new Set(t.map((i) => i.align ?? "left"))];
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: t.every((i) => i.italic === !0), onChange: (i) => e({ italic: i.target.checked }) }),
      n("Italic")
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: r.length > 1 ? n("The selected text blocks differ: {values}", { values: r.join(", ") }) : void 0, children: [
      n("Text colour"),
      /* @__PURE__ */ g.jsx("input", { type: "color", "aria-label": n("Text colour"), value: r[0], onChange: (i) => e({ color: i.target.value }) }),
      t.some((i) => i.color) && /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => e({ color: null }), title: n("The page's text colour"), children: n("Default") })
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("Align"),
      /* @__PURE__ */ g.jsxs("select", { "aria-label": n("Text alignment"), value: a.length === 1 ? a[0] : "", onChange: (i) => e({ align: i.target.value }), children: [
        a.length > 1 && /* @__PURE__ */ g.jsx("option", { value: "", disabled: !0, children: n("mixed") }),
        /* @__PURE__ */ g.jsx("option", { value: "left", children: n("Left") }),
        /* @__PURE__ */ g.jsx("option", { value: "center", children: n("Centre") }),
        /* @__PURE__ */ g.jsx("option", { value: "right", children: n("Right") })
      ] })
    ] }),
    /* @__PURE__ */ g.jsx(
      "button",
      {
        type: "button",
        className: "gl-mini-btn",
        onClick: () => e({ markerSigns: !0 }),
        title: n("Set +, -, hi, lo, dim, bright and int after a marker name as superscripts (CD4+ becomes CD4 with a raised +)"),
        children: n("Superscript marker signs")
      }
    )
  ] });
}
function hC() {
  const { t } = It();
  return /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: t("This text has formatting; double-click it on the page to edit it.") });
}
function gC(t) {
  if (!(t.metaKey || t.ctrlKey) || t.altKey) return null;
  const { key: e, code: n } = t;
  return e === "0" || n === "Digit0" || n === "Numpad0" ? "fit" : e === "1" || n === "Digit1" || n === "Numpad1" ? "actual" : e === "2" || n === "Digit2" || n === "Numpad2" ? "selection" : e === "=" || e === "+" || n === "Equal" || n === "NumpadAdd" ? "in" : e === "-" || e === "_" || n === "Minus" || n === "NumpadSubtract" ? "out" : null;
}
function vC(t) {
  if (!t.length) return null;
  const e = Math.min(...t.map((i) => i.x)), n = Math.min(...t.map((i) => i.y)), r = Math.max(...t.map((i) => i.x + i.width)), a = Math.max(...t.map((i) => i.y + i.height));
  return { x: e, y: n, width: Math.max(1, r - e), height: Math.max(1, a - n) };
}
function mC(t, e) {
  const n = { width: e.width - 36, height: e.height - 36 };
  if (n.width <= 0 || n.height <= 0) return null;
  const r = Math.min(n.width / t.width, n.height / t.height);
  return Math.max(0.1, Math.min(4, Math.floor(r * 100) / 100));
}
function xC(t) {
  const e = t;
  return !e || typeof e.closest != "function" ? !1 : !!e.closest("input, textarea, select, [contenteditable='true'], [contenteditable='']") || e.isContentEditable === !0;
}
const lf = (t) => t.key === " " || t.code === "Space";
function yC({ canvasEl: t, zoom: e, setZoom: n, fitZoom: r, stepZoom: a, items: i, selected: o }) {
  const s = $.useRef(null), l = (f) => {
    if (!t) return;
    const d = f.length ? i.filter((v) => f.includes(v.templateId)) : i, h = vC(d);
    if (!h) {
      r();
      return;
    }
    const m = mC(h, { width: t.clientWidth, height: t.clientHeight });
    m !== null && (s.current = { x: h.x + h.width / 2, y: h.y + h.height / 2 }, m === e ? c() : n(m));
  }, c = () => {
    const f = s.current;
    if (!t || !f) return;
    s.current = null;
    const d = t.querySelector(".gl-layout-zoom"), h = t.getBoundingClientRect(), m = d == null ? void 0 : d.getBoundingClientRect(), v = m ? m.left - h.left + t.scrollLeft : 0, y = m ? m.top - h.top + t.scrollTop : 0;
    t.scrollLeft = Math.max(0, v + f.x * e - t.clientWidth / 2), t.scrollTop = Math.max(0, y + f.y * e - t.clientHeight / 2);
  };
  $.useLayoutEffect(c, [e, t]);
  const u = $.useRef({ zoomTo: l, selected: o, setZoom: n, fitZoom: r, stepZoom: a });
  return u.current = { zoomTo: l, selected: o, setZoom: n, fitZoom: r, stepZoom: a }, $.useEffect(() => {
    if (!t) return;
    const f = (d) => {
      var S;
      const h = gC(d);
      if (!h) return;
      const m = d.target, v = t.closest(".gl-layout-tab"), y = (S = m == null ? void 0 : m.closest) == null ? void 0 : S.call(m, ".gl-layout-canvas-scroll, .gl-layout-controls");
      if (!y || v && !v.contains(y)) return;
      d.preventDefault(), d.stopPropagation();
      const b = u.current;
      h === "fit" ? b.fitZoom() : h === "actual" ? b.setZoom(1) : h === "selection" ? b.zoomTo(b.selected) : b.stepZoom(h === "in" ? 1 : -1);
    };
    return window.addEventListener("keydown", f, !0), () => window.removeEventListener("keydown", f, !0);
  }, [t]), $.useEffect(() => {
    if (!t) return;
    let f = !1, d = !1, h = null, m = !1;
    const v = () => {
      h ? t.dataset.pan = "active" : d ? t.dataset.pan = "ready" : delete t.dataset.pan;
    }, y = (_) => _ instanceof Node && t.contains(_), b = (_) => {
      f = y(_.target);
    }, S = (_) => {
      !lf(_) || _.metaKey || _.ctrlKey || _.altKey || xC(_.target) || !d && !f && !y(_.target) || (_.preventDefault(), _.stopPropagation(), d || (d = !0, v()));
    }, C = () => {
      d = !1, h = null, v();
    }, k = (_) => {
      !lf(_) || !d || (_.preventDefault(), _.stopPropagation(), d = !1, v());
    }, M = (_) => {
      y(_.target) && (d || _.button === 1) && _.stopPropagation();
    }, E = (_) => {
      !y(_.target) || !(d || _.button === 1) || (_.preventDefault(), _.stopPropagation(), h = { x: _.clientX, y: _.clientY, left: t.scrollLeft, top: t.scrollTop }, v());
    }, D = (_) => {
      b(_), h && (_.preventDefault(), t.scrollLeft = h.left - (_.clientX - h.x), t.scrollTop = h.top - (_.clientY - h.y));
    }, j = (_) => {
      h && (_.preventDefault(), _.stopPropagation(), h = null, m = !0, window.setTimeout(() => {
        m = !1;
      }, 0), v());
    }, R = (_) => {
      (d || m) && y(_.target) && (_.preventDefault(), _.stopPropagation(), m = !1);
    };
    return window.addEventListener("mouseover", b, !0), window.addEventListener("keydown", S, !0), window.addEventListener("keyup", k, !0), window.addEventListener("blur", C), window.addEventListener("pointerdown", M, !0), window.addEventListener("mousedown", E, !0), window.addEventListener("mousemove", D, !0), window.addEventListener("mouseup", j, !0), window.addEventListener("click", R, !0), window.addEventListener("dblclick", R, !0), window.addEventListener("auxclick", R, !0), () => {
      window.removeEventListener("mouseover", b, !0), window.removeEventListener("keydown", S, !0), window.removeEventListener("keyup", k, !0), window.removeEventListener("blur", C), window.removeEventListener("pointerdown", M, !0), window.removeEventListener("mousedown", E, !0), window.removeEventListener("mousemove", D, !0), window.removeEventListener("mouseup", j, !0), window.removeEventListener("click", R, !0), window.removeEventListener("dblclick", R, !0), window.removeEventListener("auxclick", R, !0), delete t.dataset.pan;
    };
  }, [t]), { zoomToSelection: l };
}
function cf(t, e, n) {
  const r = t.sheets.findIndex((o) => o.id === e), a = Math.max(0, Math.min(t.sheets.length - 1, n));
  if (r < 0 || r === a) return !1;
  const [i] = t.sheets.splice(r, 1);
  return t.sheets.splice(a, 0, i), !0;
}
function bC(t, e, n, r) {
  const a = t.findIndex((o) => o.id === e), i = t.findIndex((o) => o.id === n) + (r === "after" ? 1 : 0);
  return i > a ? i - 1 : i;
}
function wC(t, e) {
  const n = t.sheets.find((a) => a.id === e);
  if (!n) return;
  const r = {
    ...n,
    id: crypto.randomUUID(),
    page: { ...n.page },
    ...n.iteration ? { iteration: structuredClone(n.iteration) } : {},
    name: `${n.name} copy`,
    // Headings that read from a plot read the copy's plot, not the original sheet's.
    items: Ii(n.items).copies
  };
  t.sheets.push(r), t.activeSheetId = r.id;
}
function SC(t, e) {
  if (t.sheets.length <= 1) return;
  const n = t.sheets.findIndex((r) => r.id === e);
  n < 0 || (t.sheets.splice(n, 1), t.activeSheetId === e && (t.activeSheetId = t.sheets[Math.max(0, n - 1)].id));
}
function CC({ workspace: t, mutate: e, rename: n, openMenu: r, clearSelection: a }) {
  const { t: i } = It(), o = $.useRef(null), s = (f, d) => {
    const h = { ...t, sheets: [...t.sheets] };
    cf(h, f, d) && e((m) => {
      cf(m, f, d);
    });
  }, l = (f) => {
    const d = f.currentTarget.getBoundingClientRect();
    return f.clientX > d.left + d.width / 2 ? "after" : "before";
  }, c = (f) => {
    const d = t.sheets.findIndex((m) => m.id === f), h = t.sheets.length - 1;
    return [
      { label: i("Move left"), disabled: d <= 0, onClick: () => s(f, d - 1) },
      { label: i("Move right"), disabled: d >= h, onClick: () => s(f, d + 1) },
      "separator",
      { label: i("Rename"), onClick: () => n(f) },
      { label: i("Duplicate"), onClick: () => {
        e((m) => wC(m, f)), a();
      } },
      { label: i("Delete"), disabled: t.sheets.length <= 1, onClick: () => {
        e((m) => SC(m, f)), a();
      } }
    ];
  };
  return { tabProps: (f) => ({
    draggable: !0,
    onDragStart: (d) => {
      var h;
      o.current = f, (h = d.dataTransfer) == null || h.setData("text/plain", f), d.dataTransfer && (d.dataTransfer.effectAllowed = "move");
    },
    onDragOver: (d) => {
      !o.current || o.current === f || (d.preventDefault(), d.currentTarget.dataset.drop = l(d));
    },
    onDragLeave: (d) => {
      delete d.currentTarget.dataset.drop;
    },
    onDrop: (d) => {
      const h = o.current;
      delete d.currentTarget.dataset.drop, o.current = null, !(!h || h === f) && (d.preventDefault(), s(h, bC(t.sheets, h, f, l(d))));
    },
    onDragEnd: () => {
      o.current = null;
    },
    onContextMenu: (d) => {
      var m;
      d.preventDefault();
      const h = ((m = t.sheets.find((v) => v.id === f)) == null ? void 0 : m.name) ?? "";
      r({ x: d.clientX, y: d.clientY, items: c(f), label: h });
    }
  }), menuFor: c };
}
const uf = "layout-sheets", df = 72 / 25.4;
function kC(t, e) {
  const n = URL.createObjectURL(t), r = document.createElement("a");
  r.href = n, r.download = e, document.body.appendChild(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
function EC(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.map(({ sheet: r, pages: a }) => {
    const i = _i(r.name) || "layout", o = (n.get(i) ?? 0) + 1;
    n.set(i, o);
    const s = o > 1 ? `${i}-${o}` : i;
    return a.length === 1 ? [`${s}/${i}.${e}`] : a.map((l, c) => {
      const u = l.label ? _i(l.label) : "";
      return `${s}/${i}-p${c + 1}${u ? `-${u}` : ""}.${e}`;
    });
  });
}
const MC = (t) => `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
async function DC(t, e) {
  const n = { loweredDpi: null, rasterPages: [] }, r = (u, f) => {
    const d = al(u.width, u.height);
    return f <= d ? f : (n.loweredDpi = Math.min(n.loweredDpi ?? d, d), d);
  }, a = t.filter(({ pages: u }) => u.length > 0);
  if (!a.length) return n;
  if (e === "svg" || e === "png") {
    const u = EC(a, e), f = {};
    for (const [d, { sheet: h, pages: m }] of a.entries())
      for (const [v, y] of m.entries()) {
        const b = u[d][v];
        if (e === "svg") f[b] = mf(MC(y.root));
        else {
          const S = r(y, h.page.dpi), C = await oa(y, S);
          f[b] = new Uint8Array(await (await us(C, S)).arrayBuffer()), await ji();
        }
      }
    return kC(new Blob([cs(f)], { type: "application/zip" }), `${uf}.zip`), n;
  }
  const i = (u) => {
    const f = u.widthMm * df, d = u.heightMm * df;
    return { width: f, height: d, orientation: f >= d ? "landscape" : "portrait" };
  }, { jsPDF: o } = await import("./jspdf.es.min-DmhW3_Sa.js").then((u) => u.j), s = i(a[0].pages[0]), l = new o({ orientation: s.orientation, unit: "pt", format: [s.width, s.height], compress: !0 });
  let c = 0;
  for (const { sheet: u, pages: f } of a)
    for (const d of f) {
      const { width: h, height: m, orientation: v } = i(d);
      if (c > 0 && l.addPage([h, m], v), c += 1, !await xf(l, d.root, { width: h, height: m })) {
        const y = await oa(d, r(d, u.page.dpi));
        l.addImage(y, "PNG", 0, 0, h, m, void 0, "FAST"), n.rasterPages.push(c);
      }
      await ji();
    }
  return l.save(`${uf}.pdf`), n;
}
function TC(t) {
  const e = $.useRef(t);
  e.current = t;
  const [n, r] = $.useState(null), a = t.workspace.sheets.filter((o) => o.items.length > 0);
  return { exportAll: async () => {
    var u, f, d, h, m, v, y;
    const o = e.current;
    if (o.exporting || !o.page) return;
    const s = o.workspace.sheets.filter((b) => b.items.length > 0);
    if (!s.length) return;
    const l = {
      sheetId: o.workspace.activeSheetId,
      page: o.pageIndex,
      zoom: o.zoom,
      left: ((u = o.canvas) == null ? void 0 : u.scrollLeft) ?? 0,
      top: ((f = o.canvas) == null ? void 0 : f.scrollTop) ?? 0,
      selected: [...o.selectedIds]
    };
    o.setExporting(!0);
    let c = !1;
    try {
      const b = [];
      for (const [C, k] of s.entries()) {
        r({ n: C + 1, count: s.length }), e.current.workspace.activeSheetId !== k.id && e.current.showSheet(k.id), e.current.setPageIndex(0), await e.current.settle() || (c = !0);
        const M = [], E = e.current.pages;
        for (let D = 0; D < Math.max(1, E.length); D++) {
          E.length > 1 && (e.current.setPageIndex(D), await e.current.settle() || (c = !0));
          const j = e.current;
          if (!j.page) throw new Error("The page went away during the export.");
          const R = ((d = E[D]) == null ? void 0 : d.units.length) === 1 ? E[D].units[0].name : void 0;
          M.push(...Zh(j.page, k, { zoom: j.zoom, crop: j.crop }).map((_) => R ? { ..._, label: R } : _));
        }
        b.push({ sheet: k, pages: M });
      }
      const S = await DC(b, o.format);
      (m = (h = e.current).onExported) == null || m.call(h), (y = (v = e.current).onWritten) == null || y.call(v, S, c);
    } catch (b) {
      e.current.onError(b instanceof Error ? b.message : String(b));
    } finally {
      e.current.workspace.activeSheetId !== l.sheetId && e.current.showSheet(l.sheetId), e.current.setPageIndex(l.page), await e.current.settle(), e.current.setZoom(l.zoom), await e.current.settle();
      const b = e.current.canvas;
      b && (b.scrollLeft = l.left, b.scrollTop = l.top), e.current.setSelectedIds(l.selected), r(null), e.current.setExporting(!1);
    }
  }, progress: n, canExport: a.length > 0 };
}
const _C = [
  {
    title: "Select",
    entries: [
      { keys: "Click", action: "Select an item" },
      { keys: "Drag empty page", action: "Select several" },
      { keys: "Shift-click", action: "Add to or remove from the selection" },
      { keys: "Cmd-A", action: "Select all", presses: ["Mod+A"] },
      { keys: "Escape", action: "Select nothing; cancel a drag or a shape being drawn", presses: ["Escape"] },
      { keys: "Enter", action: "Edit the selected text block", presses: ["Enter"] }
    ]
  },
  {
    title: "Move and resize",
    entries: [
      { keys: "Drag", action: "Move; Shift holds the direction" },
      { keys: "Drag a corner or an edge", action: "Resize; Shift keeps the proportions, Option resizes from the centre" },
      { keys: "Cmd while dragging", action: "Snapping off" },
      { keys: "Arrow keys", action: "Nudge 1 px; Shift: 10 px", presses: ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Shift+ArrowLeft", "Shift+ArrowRight", "Shift+ArrowUp", "Shift+ArrowDown"] }
    ]
  },
  {
    title: "Copy and paste",
    entries: [
      { keys: "Cmd-C", action: "Copy", presses: ["Mod+C"] },
      { keys: "Cmd-X", action: "Cut", presses: ["Mod+X"] },
      { keys: "Cmd-V", action: "Paste", presses: ["Mod+V"] },
      { keys: "Shift-Cmd-V", action: "Paste in place", presses: ["Mod+Shift+V"] },
      { keys: "Cmd-D", action: "Duplicate", presses: ["Mod+D"] },
      { keys: "Option-drag", action: "Copy where it is dropped" },
      { keys: "Delete or Backspace", action: "Remove", presses: ["Delete", "Backspace"] }
    ]
  },
  {
    title: "Order and group",
    entries: [
      { keys: "Cmd-] and Cmd-[", action: "Bring forward and send backward", presses: ["Mod+]", "Mod+["] },
      { keys: "Shift-Cmd-] and Shift-Cmd-[", action: "Bring to front and send to back", presses: ["Mod+Shift+]", "Mod+Shift+["] },
      { keys: "Cmd-G", action: "Group", presses: ["Mod+G"] },
      { keys: "Shift-Cmd-G", action: "Ungroup", presses: ["Mod+Shift+G"] },
      { keys: "Shift-Cmd-L", action: "Lock or unlock", presses: ["Mod+Shift+L"] },
      { keys: "Cmd-Z", action: "Undo", presses: ["Mod+Z"] },
      { keys: "Shift-Cmd-Z", action: "Redo", presses: ["Mod+Shift+Z"] }
    ]
  },
  {
    title: "View",
    entries: [
      { keys: "Space-drag", action: "Move the view", presses: ["Space"] },
      { keys: "Middle-button drag", action: "Move the view" },
      { keys: "Option-scroll or pinch", action: "Zoom about the pointer" },
      { keys: "Cmd-0", action: "Fit the page", presses: ["Mod+0"] },
      { keys: "Cmd-1", action: "100 %", presses: ["Mod+1"] },
      { keys: "Cmd-2", action: "Zoom to the selection, or to everything", presses: ["Mod+2"] },
      { keys: "Cmd-= and Cmd--", action: "Zoom in and out", presses: ["Mod+=", "Mod+-"] }
    ]
  }
], Cg = "gatelab.layout.keysOpen";
function jC() {
  try {
    return localStorage.getItem(Cg) === "1";
  } catch {
    return !1;
  }
}
function IC() {
  const { t } = It(), [e, n] = $.useState(jC);
  return /* @__PURE__ */ g.jsxs(
    "details",
    {
      className: "gl-layout-keys",
      open: e,
      onToggle: (r) => {
        const a = r.currentTarget.open;
        if (a !== e) {
          n(a);
          try {
            localStorage.setItem(Cg, a ? "1" : "0");
          } catch {
          }
        }
      },
      children: [
        /* @__PURE__ */ g.jsx(ba, { children: t("Keys") }),
        _C.map((r) => /* @__PURE__ */ g.jsxs("section", { children: [
          /* @__PURE__ */ g.jsx("h4", { children: t(r.title) }),
          /* @__PURE__ */ g.jsx("dl", { children: r.entries.map((a) => /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-key", children: [
            /* @__PURE__ */ g.jsx("dt", { children: /* @__PURE__ */ g.jsx("kbd", { children: t(a.keys) }) }),
            /* @__PURE__ */ g.jsx("dd", { children: t(a.action) })
          ] }, a.keys)) })
        ] }, r.title))
      ]
    }
  );
}
const RC = $.lazy(Of("LayoutImageWall", async () => ({ default: (await import("./LayoutImageWall-C7ju4QpP.js")).LayoutImageWall }))), PC = $.lazy(Of("LayoutCellPanel", async () => ({ default: (await import("./LayoutCellPanel-D7kE0Ae6.js")).LayoutCellPanel }))), Ci = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), Qr = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], as = 10, NC = { index: 0, units: [], items: [] }, OC = {}, ff = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, AC = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], zC = [
  { how: "horizontal", label: "Distribute ↔", title: "Equal spacing between three or more items or groups, left to right; the outer two stay where they are" },
  { how: "vertical", label: "Distribute ↕", title: "Equal spacing between three or more items or groups, top to bottom; the outer two stay where they are" }
];
function LC(t) {
  var n, r, a;
  if (!t) return;
  t.stopDrag();
  const e = (n = t.getManager) == null ? void 0 : n.call(t);
  for (const i of ((r = e == null ? void 0 : e.getMoveables) == null ? void 0 : r.call(e)) ?? []) i !== e && ((a = i.stopDrag) == null || a.call(i));
}
function FC(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function kg(t, e, n) {
  return e ? n.some((r) => !!r && (t === `${e} · ${r}` || t.startsWith(`${e} · ${r} · `))) : !1;
}
const pf = 128;
function is(t, e, n) {
  const r = Wn(t);
  if (t.recipe.kind !== "biplot" && t.recipe.kind !== "histogram") return xu(r);
  const a = Math.min(e, n) / pf, i = r < 1 && Math.min(t.width, t.height) / r <= pf + 1;
  return xu(Math.min(i ? 1 : r, a));
}
function aa(t) {
  var e;
  return t.kind === "strategy" && !!((e = t.populationIds) != null && e.length);
}
function Ye(t, e, n) {
  var s, l, c;
  const r = t.recipe;
  if (r.kind === "text") return Lf(r).split(`
`)[0] || "Text";
  if ((s = r.title) != null && s.trim() && r.title.trim() !== Pf) return r.title.trim();
  if (r.kind === "figure") return ((c = (l = r.illustration.figure) == null ? void 0 : l.name) == null ? void 0 : c.trim()) || "Figure";
  if (r.kind === "proportions") {
    const u = r.settings.valueKind === "cells" ? `${r.settings.channel || "Channel"} per cell` : r.settings.valueKind === "statistic" ? rl(r.settings.statistic, r.settings.channel || "channel") : r.settings.plotType === "box" ? "Boxplot" : "Composition";
    if (!r.panel) return u;
    if ("legend" in r.panel) return `${u} · legend`;
    const f = [r.panel.population, r.panel.group, r.panel.facet, r.panel.channel, r.panel.page === void 0 ? void 0 : `page ${r.panel.page}`].filter((d) => d !== void 0 && d !== "");
    return f.length ? `${u} · ${f.join(" · ")}` : u;
  }
  if (r.kind === "imagewall") return `${r.populationName || "Population"} · ${r.fileName || "images"}`;
  if (r.kind === "cellpanel") return `${r.cells.length} ${r.cells.length === 1 ? "cell" : "cells"} · ${r.fileName || "images"}`;
  if (r.kind === "shape") return gg(r);
  if (r.kind === "image") return r.fileName;
  const a = e.find(({ id: u }) => u === r.sampleId), i = a == null ? void 0 : a.tree.populations[r.populationId];
  if (r.kind === "chart") return `${(i == null ? void 0 : i.name) ?? "Population"} · ${fl[r.statistic]}`;
  if (r.kind === "strategy")
    return `${(i == null ? void 0 : i.name) ?? "Population"} strategy`;
  const o = xa(r);
  return o ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${o.length} ${Nf("files")}` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function xa(t) {
  return (t.kind === "biplot" || t.kind === "histogram" || t.kind === "strategy") && t.pool && t.pool.sampleIds.length > 1 ? t.pool.sampleIds : null;
}
function Mr(t, e, n, r) {
  var c;
  const a = ((c = t.pool) == null ? void 0 : c.sampleIds) ?? [t.sampleId], i = e.find(({ id: u }) => u === t.sampleId) ?? e.find(({ id: u }) => a.includes(u)) ?? null, o = [], s = [];
  if (!i) return { members: o, leftOut: s };
  const l = t.kind === "histogram" ? null : t.yChannel;
  for (const u of [i.id, ...a.filter((f) => f !== i.id)]) {
    const f = e.find((m) => m.id === u);
    if (!f) {
      s.push({ name: u, reason: "not loaded" });
      continue;
    }
    const d = ln(t.populationId, f.tree, n, r ?? i.tree.id);
    if (d.missing) {
      s.push({ name: f.name, reason: "no corresponding population" });
      continue;
    }
    const h = f === i ? null : im(i.sample, f.sample, t.xChannel, l);
    if (h) {
      s.push({ name: f.name, reason: h });
      continue;
    }
    o.push({ id: f.id, name: f.name, sample: f.sample, tree: f.tree, gating: f.derived, populationId: d.id });
  }
  return { members: o, leftOut: s };
}
function BC({
  files: t,
  pool: e,
  checkedSampleIds: n,
  groups: r,
  fileGroups: a,
  report: i,
  onChange: o
}) {
  const { t: s } = It(), [l, c] = $.useState(""), u = $.useMemo(
    () => Object.fromEntries(t.filter((v) => v.metadata).map((v) => [v.id, v.metadata])),
    [t]
  ), f = $.useMemo(
    () => pm(u, [...new Set(Object.values(u).flatMap((v) => Object.keys(v)))].map((v) => ({ name: v }))),
    [u]
  ), d = $.useMemo(() => new Set(t.filter((v) => !e.includes(v.id)).map((v) => v.id)), [t, e]), h = (v) => t.filter((y) => v instanceof Set ? v.has(y.id) : v.includes(y.id)).map((y) => y.id), m = l.trim().toLowerCase();
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-pool", children: [
    /* @__PURE__ */ g.jsxs("div", { className: "gl-figure-actions gl-figure-list-actions", children: [
      /* @__PURE__ */ g.jsx("button", { type: "button", onClick: () => o(h(n)), children: s("Checked files") }),
      /* @__PURE__ */ g.jsx("button", { type: "button", onClick: () => o(t.map((v) => v.id)), children: s("All files") }),
      r.map((v) => /* @__PURE__ */ g.jsx("button", { type: "button", onClick: () => o(t.filter((y) => a[y.id] === v.id).map((y) => y.id)), children: s("Group {name}", { name: v.name }) }, v.id))
    ] }),
    /* @__PURE__ */ g.jsx(
      "input",
      {
        type: "search",
        "aria-label": s("Find files to pool"),
        placeholder: s("Find file / sample…"),
        value: l,
        onChange: (v) => c(v.target.value)
      }
    ),
    /* @__PURE__ */ g.jsx("div", { className: "gl-figure-list gl-layout-pool-list", children: t.filter((v) => !m || `${v.name} ${v.fileName ?? ""}`.toLowerCase().includes(m)).map((v) => /* @__PURE__ */ g.jsxs("label", { className: "gl-figure-row", title: v.fileName && v.fileName !== v.name ? `${v.name} · ${v.fileName}` : v.name, children: [
      /* @__PURE__ */ g.jsx(
        "input",
        {
          type: "checkbox",
          checked: e.includes(v.id),
          onChange: () => o(e.includes(v.id) ? e.filter((y) => y !== v.id) : h([...e, v.id]))
        }
      ),
      /* @__PURE__ */ g.jsx("span", { className: "gl-figure-row-name", children: v.name })
    ] }, v.id)) }),
    f.length > 0 && /* @__PURE__ */ g.jsx("div", { className: "gl-sample-facets gl-figure-facets", "aria-label": s("Select pooled files by metadata"), children: f.map((v) => /* @__PURE__ */ g.jsxs("div", { className: "gl-sample-facet-row", children: [
      /* @__PURE__ */ g.jsx("span", { className: "gl-sample-facet-lock", "aria-hidden": "true" }),
      /* @__PURE__ */ g.jsx("span", { className: "gl-sample-facet-name", title: v.name, children: v.name }),
      /* @__PURE__ */ g.jsx("div", { className: "gl-sample-facet-values", children: v.values.map((y) => {
        const b = hm(y.sampleIds, d), S = y.sampleIds.length, C = b === S ? "all" : b === 0 ? "none" : "some", k = S > 0 ? Math.round(b / S * 100) : 0;
        return /* @__PURE__ */ g.jsxs(
          "button",
          {
            type: "button",
            className: `gl-sample-facet-chip is-${C}`,
            style: C === "some" ? { "--gl-facet-fill": `${k}%` } : void 0,
            "aria-pressed": b === S,
            title: `${y.value}: ${b} of ${S} pooled — ${b === S ? `click to drop all ${S}` : `click to pool all ${S}`}`,
            onClick: () => o(h(new Set(t.filter((M) => !gm(y.sampleIds, d).has(M.id)).map((M) => M.id)))),
            children: [
              /* @__PURE__ */ g.jsx("span", { className: "gl-sample-facet-label", children: y.value }),
              /* @__PURE__ */ g.jsxs("span", { className: "gl-sample-facet-count", children: [
                b,
                "/",
                S
              ] })
            ]
          },
          y.value
        );
      }) })
    ] }, v.name)) }),
    i && /* @__PURE__ */ g.jsxs("p", { className: "gl-hint", children: [
      s("{n} of {m} files pooled", { n: i.pooled, m: i.total }),
      i.leftOut.length > 0 && ` · ${s("Not pooled: {files}", { files: i.leftOut.map((v) => `${v.name} (${v.reason})`).join(", ") })}`,
      i.omittedGates.length > 0 && ` · ${s("Gates not shown: {names} — they differ between the pooled files", { names: i.omittedGates.join(", ") })}`
    ] })
  ] });
}
const hf = ["#2671c6", "#bc642c", "#69882b", "#8855a6", "#15938c", "#b74169"];
function Eg(t) {
  if (!t.length) return null;
  const e = t.map((o) => Rf(o)), n = e.every(Boolean) && new Set(e).size === e.length, r = t.map((o, s) => ({
    x: o.plot.x,
    y: o.plot.y,
    name: o.name,
    color: n ? e[s] : hf[s % hf.length]
  })), a = Math.max(0, r.findIndex((o) => {
    var s;
    return (s = o.x) == null ? void 0 : s.length;
  })), i = [r[a], ...r.filter((o, s) => s !== a)];
  return {
    color: i[0].color,
    config: {
      ...t[a].plot,
      x: i[0].x,
      y: i[0].y,
      overlay_traces: i.slice(1),
      legend_entries: r.map(({ name: o, color: s }) => ({ name: o, color: s })),
      n_events: t.reduce((o, s) => o + Number(s.plot.n_events ?? 0), 0),
      population_memberships: !0
    }
  };
}
function GC({
  populations: t,
  tree: e,
  chosen: n,
  onChange: r
}) {
  const { t: a } = It();
  return /* @__PURE__ */ g.jsx(
    vm,
    {
      compact: !0,
      collapsible: !1,
      label: a("Populations overlaid on this plot"),
      summary: a("{count} populations overlaid, each in its population's colour", { count: String(n.size) }),
      rows: t.map(({ popId: i, depth: o, isLastPath: s }) => {
        var l;
        return {
          key: i,
          name: ((l = e.populations[i]) == null ? void 0 : l.name) ?? i,
          depth: o,
          isLastPath: s,
          color: Rf(e.populations[i])
        };
      }),
      selected: t.map((i) => i.popId).filter((i) => n.has(i)),
      onToggle: (i) => {
        const o = n.has(i), s = t.map((l) => l.popId).filter((l) => l === i ? !o : n.has(l));
        s.length && r(s);
      }
    }
  );
}
function $C({
  item: t,
  samples: e,
  state: n,
  globalScales: r,
  dataRevision: a,
  densityColorPower: i,
  style: o,
  canvasScale: s,
  titleTemplate: l,
  describe: c,
  onContentBox: u
}) {
  var F;
  const { t: f } = It(), d = $.useRef(null), h = $.useRef(u);
  h.current = u;
  const m = $.useRef(null), v = t.recipe, y = JSON.stringify(o), b = $.useMemo(() => Gn(n), [n]), S = v.kind === "text" ? null : e.find(({ id: N }) => N === v.sampleId) ?? null, C = xa(v), k = (C == null ? void 0 : C.join("|")) ?? "", M = $.useMemo(
    () => k ? k.split("|").map((N) => e.find((W) => W.id === N) ?? null) : null,
    [e, k]
  ), E = S ? { ...n, ...S.tree } : n, D = v.kind !== "text" && t.templateSampleId && t.templateSampleId !== v.sampleId ? e.find(({ id: N }) => N === t.templateSampleId) ?? null : null, j = (v.kind === "biplot" || v.kind === "histogram") && v.populationIds && v.populationIds.length > 1 ? v.populationIds : null, R = j && S ? j.flatMap((N) => {
    const W = ln(N, S.tree, b, D == null ? void 0 : D.tree.id);
    return W.missing ? [] : [{ asked: N, id: W.id }];
  }) : [], _ = v.kind === "text" || !S ? { id: v.kind === "text" ? "" : v.populationId, missing: !1 } : R.length ? { id: R[0].id, missing: !1 } : ln(v.populationId, S.tree, b, D == null ? void 0 : D.tree.id), x = _.id, P = _.missing ? ((F = D == null ? void 0 : D.tree.populations[v.kind === "text" ? "" : v.populationId]) == null ? void 0 : F.name) ?? "the population" : null, I = v.kind === "text" ? null : c({ ...v, populationId: x, ...j ? { populationIds: R.map((N) => N.id) } : {} }, void 0, t.unitId), B = ((N) => I ? Ti(N, I) : N)(l), q = JSON.stringify(v);
  return $.useEffect(() => {
    const N = d.current;
    if (!N || v.kind === "text") return;
    N.dataset.layoutPending = "1";
    const W = () => {
      var xt, st, St, Pt, Tt, vt;
      if (N.innerHTML = "", !S) {
        N.textContent = Nf("The referenced file is unavailable or still loading."), N.className = "gl-layout-plot-host is-missing", N.dataset.layoutPending = "source";
        return;
      }
      const X = E.populations[x];
      if (!(v.kind === "strategy" && !!((xt = v.populationIds) != null && xt.length)) && (P || !X)) {
        N.textContent = P ? `${S.name} has no population corresponding to ${P}.` : "The referenced population is unavailable.", N.className = "gl-layout-plot-host is-missing";
        return;
      }
      N.className = "gl-layout-plot-host";
      const et = Math.max(120, t.width - 8), at = Math.max(120, t.height - 8);
      if (v.kind === "strategy" && ((st = v.populationIds) != null && st.length)) {
        const gt = S.tree, At = gt.root_population_id ?? "", _t = v.populationIds.map((de) => ln(de, gt, b, D == null ? void 0 : D.tree.id)).filter((de) => !de.missing).map((de) => de.id), Xt = yu(S.sample, gt.gates, r), Nt = M ? Tf(Js(v, e, b, D == null ? void 0 : D.tree.id), v.populationIds, (D == null ? void 0 : D.tree.id) ?? gt.id, b, { maxEvents: o.maxEvents, globalScales: Xt }).nodes : km(S.sample, gt.gates, gt.populations, At, S.derived.masks, _t, { maxEvents: o.maxEvents, globalScales: Xt }), Ft = Math.max(1, v.columns ?? 4), Ct = v.layout === "flow" ? Em(Nt, Ft, gt.populations) : Mm(Nt, gt.populations);
        if (!Ct.length) {
          N.textContent = `${S.name} has none of the strategy's populations.`, N.className = "gl-layout-plot-host is-missing";
          return;
        }
        const Jt = v.showArrows !== !1, Me = Jt ? Dm(Ct, gt.populations) : [], De = Jt ? Tm(Me) : 8, In = Jt ? _m(Me) : 8, Ze = Math.max(120, Math.min(800, v.plotSize ?? 200));
        N.removeAttribute("id");
        const Qt = document.createElement("div");
        Qt.id = `layout-strategy-${t.id}`, Qt.style.width = "max-content", N.appendChild(Qt);
        const ye = (de) => {
          const Re = Nm(Ct, {
            displayMode: v.displayMode,
            plotSize: Ze,
            contourThreshold: o.contourThreshold,
            contourLevels: o.contourLevels,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateEdgeMode: v.gateEdgeMode,
            gateLabelFormat: o.gateLabels,
            gateLabelBold: v.gateLabelBold,
            labelBackground: v.labelBackground,
            gridGap: De,
            gridRowGap: In,
            canvasScale: s * de,
            fontSizes: Ci(o),
            contextTitle: B
          });
          Oo().renderMultiStrategyGrid(Qt.id, Re);
        }, be = Wn(t), fn = (de, Re) => de > 0 && Re > 0 ? Math.max(0.1 / be, Math.min(4 / be, et / de, at / Re)) : 1, Je = (de) => Math.abs(de - 1) > 0.01 ? Math.max(0.1, Math.min(4, de * be)) : 1, pn = m.current, he = pn ? Je(fn(pn.width, pn.height)) : 1;
        ye(he), Me.length && jm(Qt);
        const yn = ((St = Qt.querySelector(".multi-strategy-grid")) == null ? void 0 : St.offsetWidth) ?? 0;
        yn > 0 && (Qt.style.width = `${yn}px`);
        const Ot = Qt.scrollWidth, qt = Qt.scrollHeight;
        m.current = { width: Ot, height: qt };
        const Fe = fn(Ot, qt);
        Math.abs(Fe - 1) > 0.01 && (Qt.style.zoom = String(Fe)), Je(Fe) !== he && ye(Je(Fe)), Im(Qt, Me, { color: v.arrowColor ?? (o.pubStyle ? "#444444" : null), width: v.arrowWidth ?? 1.5, anchor: v.arrowAnchor ?? "label" });
        const Qe = Ot * Fe + 8, Be = qt * Fe + 8;
        Ot > 0 && qt > 0 && ((t.width - Qe) * be > 2 || (t.height - Be) * be > 2) && ((Pt = h.current) == null || Pt.call(h, Math.min(t.width, Qe), Math.min(t.height, Be)));
        return;
      }
      if (v.kind === "strategy") {
        const gt = M ? _f(Js(v, e, b, D == null ? void 0 : D.tree.id), b, { fullPath: v.fullPath, maxEvents: o.maxEvents }) : null, At = gt ? gt.steps : Rm(
          S.sample,
          E.gates,
          E.populations,
          E.root_population_id ?? "",
          x,
          { fullPath: v.fullPath, maxEvents: o.maxEvents }
        ), _t = 8, Xt = 26, Nt = Math.max(1, At.length), Ft = v.columns ? Math.min(v.columns, Nt) : 0, Ct = Math.max(1, t.width - 8), Jt = Math.max(1, t.height - 8);
        let Me = 1, De = 0;
        for (let ye = Ft || 1; ye <= (Ft || Nt); ye++) {
          const be = Math.ceil(Nt / ye), fn = Math.floor((Ct - _t * (ye - 1)) / ye), Je = Math.floor((Jt - Xt - _t * (be - 1)) / be), pn = Math.min(fn, Je);
          pn > De && (De = pn, Me = ye);
        }
        const In = De < 120 ? Math.max(1, De) / 120 : 1;
        De = Math.max(120, Math.min(800, De));
        const Ze = Pm(
          gt ? gt.drawn.map((ye) => ({ sample: ye.sample, finalMask: null })) : [{ sample: S.sample, finalMask: null }],
          At,
          yu(S.sample, E.gates, r),
          {
            gateView: ["forward"],
            displayMode: v.displayMode,
            maxEvents: o.maxEvents,
            nColumns: Me,
            plotSize: De,
            fitToColumns: !1,
            contourThreshold: o.contourThreshold,
            contourLevels: o.contourLevels,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateEdgeMode: v.gateEdgeMode,
            gateLabelFormat: o.gateLabels,
            gateLabelBold: v.gateLabelBold,
            labelBackground: v.labelBackground,
            fontSizes: Ci(o),
            contextTitle: B
          }
        );
        N.id = `layout-strategy-${t.id}`;
        for (const ye of Object.values(Ze.plots ?? {})) ye.canvas_scale = s;
        Oo().renderStrategyGrid(N.id, Ze);
        const Qt = In < 1 ? N.querySelector(".strategy-grid") : null;
        Qt && (Qt.style.zoom = String(In));
        return;
      }
      const Q = Math.max(120, Math.min(et, at)), it = v.kind === "histogram" ? null : v.yChannel, ut = v.kind === "histogram" && v.histOverlayMode ? v.histOverlayMode : "front_opaque", Z = {
        displayMode: v.displayMode,
        maxEvents: o.maxEvents,
        nColumns: 1,
        plotSize: Q,
        fitToColumns: !1,
        contourThreshold: o.contourThreshold,
        pointAlpha: o.pointAlpha,
        densityColorPower: i,
        pointSize: o.pointSize,
        kdeBandwidth: o.kdeBandwidth,
        colorByPop: !1,
        overlayPops: !1,
        populationColors: {},
        histLineWidth: o.histLineWidth,
        histFill: o.histFill,
        histFillAlpha: o.histFillAlpha,
        histOverlayMode: ut,
        histLayout: "grid",
        ridgeOverlap: 0.7,
        ridgeColGap: 8,
        ridgeGradient: !1,
        pubStyle: o.pubStyle,
        gateLineWidth: o.gateLineWidth,
        gateLabelFormat: o.gateLabels,
        fontSizes: Ci(o),
        scaleFontsWithPlot: !0,
        // A population with no events is drawn as its axes and gates, as the Illustration tab
        // draws it, rather than replaced by a message.
        includeEmpty: !0
      }, dt = (gt, At, _t = "#334155") => Oo().renderMiniPlot(N, {
        ...gt,
        display_mode: v.displayMode,
        plot_size: Q,
        canvas_scale: s,
        contour_threshold: o.contourThreshold,
        point_alpha: o.pointAlpha,
        density_color_power: i,
        point_size: o.pointSize,
        kde_bandwidth: o.kdeBandwidth,
        hist_line_width: o.histLineWidth,
        hist_fill: o.histFill,
        hist_fill_alpha: o.histFillAlpha,
        hist_overlay_mode: ut,
        title: B,
        contour_levels: o.contourLevels,
        font_sizes: Ci(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: _t,
        gates: At
      }), ht = R.filter((gt) => E.populations[gt.id]);
      if (ht.length > 1) {
        const gt = M ? ht.flatMap(({ asked: _t, id: Xt }) => {
          const { members: Nt } = Mr({ ...v, populationId: _t }, e, b, D == null ? void 0 : D.tree.id), Ft = Nt.length ? bu(Nt, v.xChannel, it, r, Z, b) : null, Ct = E.populations[Xt];
          return Ft ? [{ plot: Ft.config, name: Ct.name, colorSlot: Ct.colorSlot, color: Ct.color }] : [];
        }) : (() => {
          const _t = ht.map((Nt) => Nt.id), Xt = wu(
            S.sample,
            E.gates,
            Su(E.populations, E.gates, E.gate_order, _t[0]),
            E.populations,
            S.derived.masks,
            S.derived.stats.event_count,
            _t,
            [v.xChannel],
            it,
            r,
            { ...Z, gateOrderIsScope: !0 },
            S.derived.gateMasks
          );
          return _t.flatMap((Nt) => {
            var Jt;
            const Ft = (Jt = Xt.plots) == null ? void 0 : Jt[`${Nt}|${v.xChannel}`], Ct = E.populations[Nt];
            return Ft && Ct ? [{ plot: Ft, name: Ct.name, colorSlot: Ct.colorSlot, color: Ct.color }] : [];
          });
        })(), At = Eg(gt);
        if (At) {
          dt(At.config, [], At.color);
          return;
        }
      }
      if (M) {
        const { members: gt } = Mr(R.length ? { ...v, populationId: R[0].asked } : v, e, b, D == null ? void 0 : D.tree.id), At = gt.length ? bu(gt, v.xChannel, it, r, Z, b) : null;
        if (!At) {
          N.textContent = "No events are available for this FCS/population combination.", N.className = "gl-layout-plot-host is-missing";
          return;
        }
        dt(At.config, At.gates);
        return;
      }
      const tt = wu(
        S.sample,
        E.gates,
        // Only the plot's branch, as the Illustration and Gating tabs draw it: the gates drawn on
        // this population and its descendants, not every gate sharing these channels.
        Su(E.populations, E.gates, E.gate_order, x),
        E.populations,
        S.derived.masks,
        S.derived.stats.event_count,
        [x],
        [v.xChannel],
        it,
        r,
        { ...Z, gateOrderIsScope: !0 },
        S.derived.gateMasks
      ), ft = `${x}|${v.xChannel}`, Mt = (Tt = tt.plots) == null ? void 0 : Tt[ft];
      if (!Mt) {
        N.textContent = "No events are available for this FCS/population combination.", N.className = "gl-layout-plot-host is-missing";
        return;
      }
      dt(Mt, ((vt = tt.gate_overlays) == null ? void 0 : vt[ft]) ?? []);
    }, V = window.setTimeout(() => {
      try {
        W();
      } catch (X) {
        console.error(X), N.innerHTML = "", N.textContent = `${f("This block could not be drawn")}: ${X instanceof Error ? X.message : String(X)}`, N.className = "gl-layout-plot-host is-missing";
      } finally {
        N.dataset.layoutPending === "1" && delete N.dataset.layoutPending;
      }
    }, 80);
    return () => window.clearTimeout(V);
  }, [
    a,
    i,
    y,
    r,
    t.height,
    t.id,
    t.width,
    q,
    S,
    E.gate_order,
    E.gate_version,
    E.gates,
    E.stored_hierarchies,
    E.populations,
    E.root_population_id,
    x,
    P,
    s,
    B,
    M,
    b
  ]), v.kind === "text" ? /* @__PURE__ */ g.jsx(
    "div",
    {
      className: "gl-layout-text-surface",
      style: { fontSize: v.fontSize, fontWeight: v.bold ? 700 : 400 },
      children: v.text
    }
  ) : /* @__PURE__ */ g.jsx("div", { ref: d, className: "gl-layout-plot-host" });
}
function WC({
  item: t,
  templateText: e,
  chartFiles: n,
  selected: r,
  samples: a,
  state: i,
  globalScales: o,
  dataRevision: s,
  densityColorPower: l,
  style: c,
  titleTemplate: u,
  describe: f,
  checkedSampleIds: d,
  metadataById: h,
  metadataLevels: m,
  files: v,
  sources: y,
  divisionProfiles: b,
  imageService: S,
  canvasScale: C,
  onTextChange: k,
  onTextFocus: M,
  textEditing: E,
  onTextEditStart: D,
  onTextEditEnd: j,
  onIsolate: R,
  onHug: _
}) {
  var F;
  const { t: x } = It(), P = Wn(t), I = P === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / P)), height: Math.max(1, Math.round(t.height / P)) }, A = t.recipe.kind === "chart" ? JSON.stringify(t.recipe) : "", B = d.join("\0"), q = $.useMemo(
    () => t.recipe.kind === "chart" ? pl(t.recipe, a, h, d, i) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [A, a, h, B, i, o, s]
  );
  return /* @__PURE__ */ g.jsx(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": P === 1 ? void 0 : P,
      "data-object-name": t.name || void 0,
      "data-rotation": t.rotation,
      title: `${t.locked ? `${x("Locked")} · ` : ""}${Ye(t, a)}`,
      "data-title": Ye(t, a),
      onDoubleClick: R ? (N) => {
        N.stopPropagation(), R();
      } : void 0,
      className: `gl-layout-item${r ? " is-selected" : ""}${t.showFrame ? " has-frame" : ""}${t.recipe.kind === "text" ? " is-text" : ""}${t.locked ? " is-locked" : ""}`,
      style: {
        left: t.x,
        top: t.y,
        width: t.width,
        height: t.height,
        zIndex: t.z
      },
      children: /* @__PURE__ */ g.jsx("div", { className: "gl-layout-item-body", style: P === 1 ? void 0 : { zoom: P, width: I.width, height: I.height }, children: t.recipe.kind === "text" ? /* @__PURE__ */ g.jsx(sf, { turn: t.rotation, width: I.width, height: I.height, children: /* @__PURE__ */ g.jsx(
        XC,
        {
          text: t.recipe.text,
          templateText: e ?? t.recipe.text,
          fontSize: t.recipe.fontSize,
          bold: t.recipe.bold,
          format: t.recipe,
          editing: E,
          onEditStart: D,
          onEditEnd: j,
          onCommit: k,
          onFocus: M
        }
      ) }) : t.recipe.kind === "figure" ? /* @__PURE__ */ g.jsx(
        wm,
        {
          recipe: t.recipe,
          files: v,
          sources: y,
          state: i,
          globalScales: o,
          width: Math.max(120, I.width - 8),
          height: Math.max(80, I.height - 8),
          columnLevels: m,
          containerId: `layout-figure-${t.id}`
        }
      ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ g.jsx(
        Sm,
        {
          recipe: t.recipe,
          samples: v,
          state: i,
          metadataById: h,
          divisionProfiles: b,
          width: Math.max(120, I.width - 8),
          height: Math.max(80, I.height - 8),
          containerId: `layout-proportions-${t.id}`,
          globalScales: o,
          chartFiles: n,
          dataRevision: s,
          metadataLevels: m,
          sheetStyle: c
        }
      ) : t.recipe.kind === "shape" ? /* @__PURE__ */ g.jsx(fg, { recipe: t.recipe, width: I.width, height: I.height }) : t.recipe.kind === "image" ? /* @__PURE__ */ g.jsx(sf, { turn: t.rotation, width: I.width, height: I.height, children: /* @__PURE__ */ g.jsx(VS, { recipe: t.recipe }) }) : t.recipe.kind === "cellpanel" ? /* @__PURE__ */ g.jsx($.Suspense, { fallback: /* @__PURE__ */ g.jsx("div", { className: "gl-layout-plot-host", "data-layout-pending": "1" }), children: /* @__PURE__ */ g.jsx(
        PC,
        {
          recipe: t.recipe,
          service: S ?? null,
          width: Math.max(120, I.width - 8),
          height: Math.max(80, I.height - 8)
        }
      ) }) : t.recipe.kind === "imagewall" ? /* @__PURE__ */ g.jsx($.Suspense, { fallback: /* @__PURE__ */ g.jsx("div", { className: "gl-layout-plot-host", "data-layout-pending": "1" }), children: /* @__PURE__ */ g.jsx(
        RC,
        {
          recipe: t.recipe,
          service: S ?? null,
          width: Math.max(120, I.width - 8),
          height: Math.max(80, I.height - 8)
        }
      ) }) : t.recipe.kind === "chart" ? /* @__PURE__ */ g.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ g.jsx(
        g0,
        {
          data: q,
          recipe: t.recipe,
          style: c,
          width: Math.max(120, I.width - 8),
          height: Math.max(80, I.height - 8),
          title: ((F = t.recipe.title) == null ? void 0 : F.trim()) || Ye(t, a)
        }
      ) }) : /* @__PURE__ */ g.jsx(
        $C,
        {
          item: I,
          samples: a,
          state: i,
          globalScales: o,
          dataRevision: s,
          densityColorPower: l,
          style: c,
          canvasScale: C,
          titleTemplate: u,
          describe: f,
          onContentBox: _ ? (N, W) => _(Math.round(N * P), Math.round(W * P)) : void 0
        }
      ) })
    }
  );
}
const Mg = [
  { key: "pointSize", label: "Point size", step: 0.1 },
  { key: "pointAlpha", label: "Point opacity", step: 0.05 },
  { key: "maxEvents", label: "Events drawn", step: 1e3, integer: !0 },
  { key: "contourThreshold", label: "Contour threshold (%)", step: 0.5 },
  { key: "contourLevels", label: "Contour levels", step: 1, integer: !0 },
  { key: "kdeBandwidth", label: "Smoothing (0 = automatic)", step: 0.1 },
  { key: "gateLineWidth", label: "Gate line width", step: 0.25 },
  { key: "histLineWidth", label: "Histogram line width", step: 0.2 },
  { key: "histFillAlpha", label: "Histogram fill opacity", step: 0.05 },
  { key: "fontTick", label: "Tick font", step: 1 },
  { key: "fontAxis", label: "Axis font", step: 1 },
  { key: "fontTitle", label: "Title font", step: 1 },
  { key: "fontGate", label: "Gate label font", step: 1 },
  { key: "fontLegend", label: "Chart legend font", step: 1 }
], po = ["fontTick", "fontAxis", "fontTitle", "fontGate"], YC = [...po, "fontLegend", "gateLineWidth", "histLineWidth", "pubStyle"], gf = [...po, "fontLegend"], HC = { fontTick: "Tick", fontAxis: "Axis", fontTitle: "Plot title", fontGate: "Gate label" };
function os({
  styles: t,
  showTitle: e = !0,
  texts: n = [],
  onChange: r,
  onTextChange: a
}) {
  const { t: i } = It();
  if (!t.length && !n.length) return null;
  const o = (l) => l > 1 ? ` (${i("mixed")})` : "", s = [...new Set(n.map((l) => l.fontSize))];
  return /* @__PURE__ */ g.jsxs("fieldset", { className: "gl-layout-font-fields", children: [
    /* @__PURE__ */ g.jsx("legend", { children: i("Fonts (px)") }),
    t.length > 0 && Mg.filter(({ key: l }) => po.includes(l) && (e || l !== "fontTitle")).map(({ key: l, label: c, step: u }) => {
      const f = [...new Set(t.map((d) => d[l]))];
      return /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: f.length > 1 ? i("The selected plots differ: {values}", { values: f.join(", ") }) : void 0, children: [
        i(HC[l]),
        o(f.length),
        /* @__PURE__ */ g.jsx(
          le,
          {
            "aria-label": i(c),
            value: f[0],
            min: Pi[l][0],
            max: Pi[l][1],
            step: u,
            onCommit: (d) => r({ [l]: d })
          }
        )
      ] }, l);
    }),
    n.length > 0 && a && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: s.length > 1 ? i("The selected text blocks differ: {values}", { values: s.join(", ") }) : void 0, children: [
        i("Text box"),
        o(s.length),
        /* @__PURE__ */ g.jsx(le, { "aria-label": i("Text font"), min: 8, max: 72, integer: !0, value: s[0], onCommit: (l) => a({ fontSize: l }) })
      ] }),
      /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
        /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: n.every((l) => l.bold), onChange: (l) => a({ bold: l.target.checked }) }),
        i("Bold")
      ] }),
      /* @__PURE__ */ g.jsx(pC, { texts: n, onChange: a })
    ] })
  ] });
}
function ss({
  effective: t,
  own: e,
  onChange: n,
  omit: r = []
}) {
  const { t: a } = It();
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-style-fields", children: [
    Mg.filter(({ key: i }) => !r.includes(i)).map(({ key: i, label: o, step: s, integer: l }) => /* @__PURE__ */ g.jsxs($.Fragment, { children: [
      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline" + (i in e ? " is-own" : ""), children: [
        a(o),
        /* @__PURE__ */ g.jsx(
          le,
          {
            "aria-label": a(o),
            value: i === "maxEvents" && t.maxEvents === 0 ? hu.maxEvents : t[i],
            min: Pi[i][0],
            max: Pi[i][1],
            step: s,
            integer: l,
            disabled: i === "maxEvents" && t.maxEvents === 0,
            onCommit: (c) => n({ [i]: c })
          }
        )
      ] }),
      i === "maxEvents" && // An event cap of 0 is every event, as on the Gating tab: a pooled plot of a whole SCE
      // can then be drawn as the Gating tab's pooled view draws it.
      /* @__PURE__ */ g.jsxs("label", { className: "gl-check" + ("maxEvents" in e ? " is-own" : ""), title: a("Draw every event of the plot's files rather than a sample of them; a plot of a million points repaints slowly. Counts and percentages always use every event."), children: [
        /* @__PURE__ */ g.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.maxEvents === 0,
            onChange: (c) => n({ maxEvents: c.target.checked ? 0 : hu.maxEvents })
          }
        ),
        a("All events")
      ] })
    ] }, i)),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline" + ("gateLabels" in e ? " is-own" : ""), children: [
      a("Gate labels"),
      /* @__PURE__ */ g.jsxs(
        "select",
        {
          "aria-label": a("Gate labels"),
          value: t.gateLabels,
          onChange: (i) => n({ gateLabels: i.target.value }),
          children: [
            /* @__PURE__ */ g.jsx("option", { value: "name-percent", children: a("Name and percentage") }),
            /* @__PURE__ */ g.jsx("option", { value: "percent", children: a("Percentage") }),
            /* @__PURE__ */ g.jsx("option", { value: "number", children: a("Number only") }),
            /* @__PURE__ */ g.jsx("option", { value: "name", children: a("Name only") }),
            /* @__PURE__ */ g.jsx("option", { value: "none", children: a("None") })
          ]
        }
      )
    ] }),
    !r.includes("pubStyle") && /* @__PURE__ */ g.jsxs("label", { className: "gl-check" + ("pubStyle" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ g.jsx(
        "input",
        {
          type: "checkbox",
          checked: t.pubStyle,
          onChange: (i) => n({ pubStyle: i.target.checked })
        }
      ),
      a("Publication style (black gates and labels)")
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-check" + ("histFill" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ g.jsx(
        "input",
        {
          type: "checkbox",
          checked: t.histFill,
          onChange: (i) => n({ histFill: i.target.checked })
        }
      ),
      a("Fill histograms")
    ] })
  ] });
}
function XC({
  text: t,
  templateText: e,
  fontSize: n,
  bold: r,
  format: a,
  editing: i,
  onEditStart: o,
  onEditEnd: s,
  onCommit: l,
  onFocus: c
}) {
  const { t: u } = It(), [f, d] = $.useState(e), h = $.useRef(null);
  $.useEffect(() => {
    if (!i) return;
    d(e);
    const v = h.current;
    v && (v.focus({ preventScroll: !0 }), v.setSelectionRange(v.value.length, v.value.length));
  }, [i]);
  const m = { fontSize: n, fontWeight: r ? 700 : 400, ...oC(a) };
  return i ? /* @__PURE__ */ g.jsx(
    cC,
    {
      areaRef: h,
      draft: f,
      setDraft: d,
      templateText: e,
      rich: a == null ? void 0 : a.rich,
      style: m,
      onCommit: l,
      onEditEnd: s,
      onFocus: c
    }
  ) : /* @__PURE__ */ g.jsx(
    "div",
    {
      className: "gl-layout-text-surface is-static",
      style: m,
      title: u("Double-click to edit"),
      onDoubleClick: (v) => {
        v.stopPropagation(), o();
      },
      children: /* @__PURE__ */ g.jsx(lC, { text: t, rich: a == null ? void 0 : a.rich })
    }
  );
}
function VC({
  workspace: t,
  onChange: e,
  takeUndoSeed: n,
  history: r,
  samples: a,
  checkedSampleIds: i = [],
  groups: o = [],
  fileGroups: s = {},
  metadataColumns: l = [],
  metadataLevels: c,
  populationMetadata: u,
  activeSampleId: f,
  activePopulationId: d,
  state: h,
  globalScales: m,
  defaultX: v,
  defaultY: y,
  illustrationConfig: b,
  onOpenInIllustration: S,
  plottingSettings: C,
  divisionProfiles: k = OC,
  imageService: M = null,
  onOpenInPlotting: E,
  dataRevision: D,
  densityColorPower: j,
  onOpenInGating: R,
  onExported: _
}) {
  var Fc, Bc, Gc, $c, Wc, Yc, Hc, Xc;
  const { t: x } = It(), P = Xv(), [I, A] = $.useState([]), [B, q] = $.useState(null), [F, N] = $.useState(!0), [W, V] = $.useState(!0), X = Mw(), [J, et] = $.useState(null), [at, Q] = $.useState(null), [it, ut] = $.useState([]), [Z, dt] = $.useState([]), ht = $.useRef(null), tt = $.useRef(null), [ft, Mt] = $.useState(null), [xt, st] = $.useState(null), [St, Pt] = $.useState(
    f ?? ((Fc = a[0]) == null ? void 0 : Fc.id) ?? ""
  ), [Tt, vt] = $.useState("item"), [gt, At] = $.useState(!0), [_t, Xt] = $.useState(!1), [Nt, Ft] = $.useState({ shift: !1, meta: !1 });
  $.useEffect(() => {
    const p = (T) => Ft((z) => {
      const G = { shift: T.shiftKey, meta: T.metaKey || T.ctrlKey };
      return G.shift === z.shift && G.meta === z.meta ? z : G;
    }), w = () => Ft((T) => T.shift || T.meta ? { shift: !1, meta: !1 } : T);
    return window.addEventListener("keydown", p), window.addEventListener("keyup", p), window.addEventListener("blur", w), () => {
      window.removeEventListener("keydown", p), window.removeEventListener("keyup", p), window.removeEventListener("blur", w);
    };
  }, []);
  const [Ct, Jt] = $.useState(1), Me = $.useRef(Ct);
  Me.current = Ct;
  const [De, In] = $.useState(Ct);
  $.useEffect(() => {
    const p = window.setTimeout(() => In(Ct), 250);
    return () => window.clearTimeout(p);
  }, [Ct]);
  const Ze = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * De)), [Qt, ye] = $.useState("pdf"), [be, fn] = $.useState(!1), [Je, pn] = $.useState(3), [he, yn] = $.useState(!1), Ot = $.useRef(null), qt = $.useRef(void 0), Fe = (p) => {
    p && (qt.current = document.activeElement, st(null)), yn(p);
  };
  $.useEffect(() => {
    if (he || qt.current === void 0) return;
    const p = qt.current;
    qt.current = void 0;
    const w = p instanceof HTMLElement && p.isConnected && p !== document.body ? p : Ot.current;
    w == null || w.focus({ preventScroll: !0 });
  }, [he]);
  const Qe = $.useRef(null), Be = (p) => {
    var w;
    A(p), (w = Ot.current) == null || w.focus({ preventScroll: !0 });
  }, de = (p) => Be(p ? [p] : []), Re = Vv(
    a,
    a.map((p) => p.id),
    h,
    D
  ), ac = $.useRef(/* @__PURE__ */ new WeakMap()), jt = $.useMemo(
    () => Re.current ? Re.sources.map((p) => {
      let w = ac.current.get(p);
      return w || ac.current.set(p, w = { ...p, derived: p.gating }), w;
    }) : [],
    [Re.current, Re.sources]
  ), tn = $.useMemo(
    () => Object.fromEntries(a.map((p) => [p.id, p.metadata])),
    [a]
  ), Se = $.useMemo(() => Gn(h), [h]), ge = a.length === 0 || Re.current && Re.pending === 0, Dg = $.useRef([]), Tg = $.useRef([]), hn = (r == null ? void 0 : r.undo) ?? Dg, hr = (r == null ? void 0 : r.redo) ?? Tg, [, _g] = $.useState(0);
  $.useEffect(() => {
    const p = n == null ? void 0 : n();
    p && (hn.current = [p, ...hn.current].slice(0, 30), hr.current = [], _g((w) => w + 1));
  }, [t, n]);
  const H = t.sheets.find(({ id: p }) => p === t.activeSheetId) ?? t.sheets[0], ct = (H == null ? void 0 : H.iteration) ?? vf;
  Tt === "iterate" && ct.mode === "off" && vt("item");
  const ve = $.useMemo(() => {
    const p = H == null ? void 0 : H.items.find((T) => te(T.recipe) && T.recipe.iterated === !0), w = p && "sampleId" in p.recipe ? p.recipe.sampleId : f;
    return jt.find(({ id: T }) => T === w) ?? jt[0] ?? null;
  }, [H, jt, f]), Ge = $.useMemo(
    () => {
      var p;
      return ct.mode === "populations" ? ve ? c0(ct, ve.tree, {
        ...a.find(({ id: w }) => w === ve.id) ?? ve,
        groupName: (p = o.find((w) => w.id === s[ve.id])) == null ? void 0 : p.name
      }) : [] : ct.mode === "metadata" ? l0(ct, a, i, o, s, c == null ? void 0 : c[ct.column ?? ""]) : s0(ct, a, i, o, s);
    },
    [ct, a, i, o, s, ve, c]
  ), Rn = $.useCallback((p, w, T) => {
    var $t, ei, Vc, Kc;
    const z = a.find(({ id: me }) => me === p.sampleId) ?? null, G = jt.find(({ id: me }) => me === p.sampleId) ?? null;
    let Y = p.populationId;
    if (G) {
      const me = w && w !== p.sampleId ? ($t = jt.find(({ id: vr }) => vr === w)) == null ? void 0 : $t.tree.id : void 0, ke = ln(p.populationId, G.tree, Se, me);
      ke.missing || (Y = ke.id);
    }
    const U = G == null ? void 0 : G.tree.populations[Y], rt = xa(p), kt = w && w !== p.sampleId ? (ei = jt.find(({ id: me }) => me === w)) == null ? void 0 : ei.tree.id : void 0, lt = p.kind !== "strategy" && p.populationIds && p.populationIds.length > 1 && G ? p.populationIds.flatMap((me) => {
      var an;
      const ke = ln(me, G.tree, Se, kt), vr = ke.missing ? void 0 : G.tree.populations[ke.id];
      if (!vr) return [];
      const ni = rt ? Mr({ ...p, populationId: me }, jt, Se, w ? (an = jt.find(({ id: Oe }) => Oe === w)) == null ? void 0 : an.tree.id : void 0).members.reduce((Oe, Zr) => Oe + (Zr.gating.stats.event_count[Zr.populationId] ?? 0), 0) : G.derived.stats.event_count[ke.id] ?? 0;
      return [{ name: vr.name, count: ni }];
    }) : [], Lt = (me) => lt.length ? { ...me, population: om(lt.map((ke) => ke.name), p.kind === "strategy" ? void 0 : p.label), counts: lt.map((ke) => ke.count) } : me;
    if (rt) {
      const me = w ? (Vc = jt.find(({ id: Oe }) => Oe === w)) == null ? void 0 : Vc.tree.id : void 0, ke = p.kind === "strategy" ? ng(p, jt, Se, me).drawn : Mr(p, jt, Se, me).members, vr = ke.reduce((Oe, Zr) => Oe + (Zr.gating.stats.event_count[Zr.populationId] ?? 0), 0), ni = p.kind === "strategy" && ke.length !== rt.length ? `${ke.length} of ${rt.length} files` : `${rt.length} files`, an = T ? Ge.find((Oe) => Oe.id === T) : void 0;
      return Lt(su(
        p.kind === "strategy" ? {} : p,
        { name: an != null && an.sampleIds ? an.name : ni, fileName: ni, metadata: an != null && an.sampleIds ? an.metadata : Vf((p.kind === "strategy" ? ke.map((Oe) => Oe.id) : rt).map((Oe) => tn[Oe])) },
        U ? { id: Y, name: U.name } : null,
        ke.length ? vr : void 0,
        u
      ));
    }
    const Ce = G == null ? void 0 : G.derived.stats.event_count[Y], rn = z ? (Kc = o.find((me) => me.id === s[z.id])) == null ? void 0 : Kc.name : void 0;
    return Lt(su(
      p.kind === "strategy" ? {} : p,
      z ? { name: z.name, fileName: z.fileName ?? z.name, groupName: rn, metadata: z.metadata } : null,
      U ? { id: Y, name: U.name } : null,
      typeof Ce == "number" ? Ce : void 0,
      u
    ));
  }, [a, jt, h, u, Se, tn, Ge, o, s]), we = $.useMemo(
    () => H ? S0(i0(H, Ge, Rn), H) : [],
    [H, Ge, Rn]
  ), qn = $.useCallback(
    (p) => Hw(p, { files: a, samples: jt, state: h, metadataById: tn, checkedSampleIds: i, divisionProfiles: k, dataRevision: D, describePlot: Rn }),
    [a, jt, h, tn, i, k, D, Rn]
  ), [ho, Un] = $.useState(0), [ic, jg] = $.useState(!1), [Ig, Rg] = $.useState(" · "), oc = $.useMemo(
    () => [...new Set(Object.values(u ?? {}).flatMap((p) => Object.keys(p)))].sort(),
    [u]
  ), sc = $.useMemo(() => Kv(l, oc), [l, oc]), en = Math.min(ho, Math.max(0, we.length - 1)), Gt = we[en] ?? NC, go = ((Bc = H == null ? void 0 : H.titleTemplate) == null ? void 0 : Bc.trim()) || qv(
    we.flatMap((p) => p.items).flatMap((p) => {
      var w;
      return te(p.recipe) ? [{ sampleId: ((w = xa(p.recipe)) == null ? void 0 : w.join(",")) ?? p.recipe.sampleId, populationId: p.recipe.populationId, label: p.recipe.kind === "strategy" ? void 0 : p.recipe.label }] : [];
    }),
    ct.mode === "metadata" ? { metadataColumn: ct.column } : void 0
  ), vo = (p) => {
    var w;
    return te(p.recipe) && (((w = p.recipe.title) == null ? void 0 : w.trim()) || go).trim() !== Pf;
  };
  $.useEffect(() => {
    ho !== en && Un(en);
  }, [ho, en]);
  const Yr = (p) => p.split("::")[0], zt = [...new Set(I.map(Yr))], Zt = (H == null ? void 0 : H.items.filter(({ id: p }) => zt.includes(p))) ?? [], K = Zt.length === 1 ? Zt[0] : null, bn = Zt.filter((p) => te(p.recipe)), lc = (p) => yt((w) => {
    w.style = No({ ...w.style, ...p });
    for (const T of w.items) {
      if (!te(T.recipe) || !T.recipe.style) continue;
      const z = { ...T.recipe.style };
      for (const U of Object.keys(p)) delete z[U];
      const { style: G, ...Y } = T.recipe;
      T.recipe = Object.keys(z).length ? { ...Y, style: z } : Y;
    }
  }), cc = Zt.flatMap((p) => p.recipe.kind === "text" && !xe(p) ? [{ fontSize: p.recipe.fontSize, bold: p.recipe.bold === !0, italic: p.recipe.italic, color: p.recipe.color, align: p.recipe.align, rich: p.recipe.rich }] : []), uc = (p) => yt((w) => {
    for (const T of w.items) {
      if (!zt.includes(T.id) || T.recipe.kind !== "text") continue;
      const z = { ...T.recipe, ...p.fontSize !== void 0 ? { fontSize: p.fontSize } : {} };
      p.bold === !0 ? z.bold = !0 : p.bold === !1 && delete z.bold, dC(z, p), T.recipe = z;
    }
  }), mo = (p) => yt((w) => {
    for (const T of w.items)
      !zt.includes(T.id) || !te(T.recipe) || (T.recipe = { ...T.recipe, style: No({ ...T.recipe.style, ...p }) });
  }), Vt = K ? Gt.items.find((p) => p.templateId === K.id) ?? null : null, Pg = $.useMemo(() => Vt ? qn(Vt) : null, [Vt, qn]), Aa = (K == null ? void 0 : K.recipe.kind) === "chart" ? K.recipe : null, $e = $.useMemo(() => {
    if (!Aa) return null;
    const { missing: p, noChannel: w, groups: T } = pl(Aa, jt, tn, i, h), z = !!Aa.groupBy && T.some((G) => G.label === Oi);
    return p.length || w.length || z ? { missing: p, noChannel: w, unassigned: z } : null;
  }, [Aa, jt, tn, i, h]), dc = (p) => p.split("::")[1] ?? "", za = (p) => {
    var w;
    return (w = Gt.items.find((T) => T.id === p)) == null ? void 0 : w.group;
  }, fc = (p) => {
    const w = new Set(p.map(za).filter((G) => !!G));
    if (!w.size) return [...p];
    const T = new Set(p.map(dc)), z = new Set(p);
    for (const G of Gt.items) G.group && w.has(G.group) && T.has(dc(G.id)) && z.add(G.id);
    return [...z];
  }, Hr = Zi(Zt).length, Ng = Zt.length > 1 && Zt.every((p) => p.group && p.group === Zt[0].group), pc = (p, w) => {
    var G;
    if (!te(p.recipe)) return "";
    const T = ((G = p.recipe.title) == null ? void 0 : G.trim()) ?? "";
    if (!T) return "";
    const z = Rn(p.recipe, w);
    return z && kg(T, z.population, [z.file, z.sample]) ? "" : T;
  }, Og = Vt && te(Vt.recipe) ? Ti(go, Rn(Vt.recipe, Vt.templateSampleId, Vt.unitId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", xo = Zt.some((p) => p.locked), La = new Set(((H == null ? void 0 : H.items) ?? []).filter((p) => p.locked).map((p) => p.id)), wn = it.filter((p) => !La.has(Yr(p.dataset.itemId ?? "")) && p.dataset.itemId !== B), Xr = wn.length > 1 && wn.every((p) => !za(p.dataset.itemId ?? "")), hc = $.useRef(wn);
  hc.current = wn;
  const Fa = $.useRef(!1), yo = Qi(H);
  $.useEffect(() => {
    I.length && I.some((p) => !Gt.items.some((w) => w.id === p) && !yo.has(p)) && A((p) => p.filter((w) => Gt.items.some((T) => T.id === w) || yo.has(w)));
  }, [Gt, I]), $.useLayoutEffect(() => {
    var p;
    (p = ht.current) == null || p.updateRect();
  }, [Gt, Ct, De]), $.useLayoutEffect(() => {
    var G;
    if (!J) return;
    const p = [...J.querySelectorAll("[data-item-id]")], w = (Y, U) => Y.length === U.length && Y.every((rt, kt) => rt === U[kt]), T = p.filter((Y) => I.includes(Y.dataset.itemId ?? "")), z = p.filter((Y) => !I.includes(Y.dataset.itemId ?? ""));
    ut((Y) => w(Y, T) ? Y : T), dt((Y) => w(Y, z) ? Y : z), (G = tt.current) == null || G.setSelectedTargets(T);
  }, [J, I, Gt, H == null ? void 0 : H.id]), $.useEffect(() => {
    Do();
  }, [H == null ? void 0 : H.id]);
  const Vr = (p, w = !0) => {
    w && (hn.current = [
      mr(t),
      ...hn.current
    ].slice(0, 30), hr.current = []), e(_u(t, p));
  }, Kr = $.useRef(t);
  Kr.current = t;
  const Ag = (p, w, T) => {
    var U;
    const z = Kr.current, G = mr(z), Y = (U = G.sheets.find(({ id: rt }) => rt === G.activeSheetId)) == null ? void 0 : U.items.find(({ id: rt }) => rt === p);
    !Y || !aa(Y.recipe) || w < 1 || T < 1 || Y.width - w <= 2 && Y.height - T <= 2 || (Y.x += Math.round((Y.width - Math.min(Y.width, w)) / 2), Y.width = Math.min(Y.width, w), Y.height = Math.min(Y.height, T), Kr.current = G, e(_u(z, G)));
  }, gc = (p) => {
    const w = mr(t);
    p(w), Vr(w);
  }, vc = $.useRef(gc);
  vc.current = gc;
  const Zn = (p) => vc.current(p), yt = (p) => {
    Zn((w) => {
      const T = w.sheets.find(({ id: z }) => z === w.activeSheetId);
      T && p(T);
    });
  }, Sn = $.useRef(null), [zg, Ba] = $.useState(null), [Ga, $a] = $.useState(null), Cn = (p, w) => {
    let T = "";
    const z = Sn.current;
    Sn.current = null, yt((G) => {
      if (T = crypto.randomUUID(), !z) {
        mu(G, p, w, T);
        return;
      }
      G.items.push({
        id: T,
        ...Cm(G, w == null ? void 0 : w.width, w == null ? void 0 : w.height),
        x: Math.max(0, Math.round(z.x)),
        y: Math.max(0, Math.round(z.y)),
        recipe: p
      });
    }), de(T), Pc(T);
  }, Kt = jt.find(({ id: p }) => p === St) ?? jt[0] ?? null, bo = Kt && d ? ki(
    {
      hierarchyId: h.active_hierarchy_id,
      populationId: d
    },
    Kt.tree,
    Gn(h)
  ) : null, Pn = (bo == null ? void 0 : bo.id) ?? (Kt == null ? void 0 : Kt.tree.root_population_id) ?? "", Wa = (p) => {
    var w, T, z;
    if (!Kt || !Pn) {
      st(x("Check an FCS file and select a population first."));
      return;
    }
    Cn({
      kind: p,
      sampleId: Kt.id,
      populationId: Pn,
      ...ct.mode !== "off" ? { iterated: !0 } : {},
      xChannel: Kt.sample.index(v) !== void 0 ? v : ((w = Kt.sample.channels[0]) == null ? void 0 : w.key) ?? "",
      yChannel: p === "histogram" ? null : Kt.sample.index(y) !== void 0 ? y : ((T = Kt.sample.channels[1]) == null ? void 0 : T.key) ?? ((z = Kt.sample.channels[0]) == null ? void 0 : z.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, [kn, qr] = $.useState(null), Lg = $.useCallback(() => qr(null), []), mc = (p) => {
    const w = Mn(H, p, P);
    return { fontTick: w.fontTick, fontAxis: w.fontAxis };
  }, Fg = (p) => {
    const w = (kn == null ? void 0 : kn.at) ?? null;
    if (qr(null), !Kt || !H) {
      st(x("Check an FCS file and select a population first."));
      return;
    }
    const T = Aw(
      { sampleId: Kt.id, ...p },
      Kt.tree,
      { all: a.map((G) => G.id), checked: i },
      mc()
    ), z = fu(T.settings, ds(a), h, tn, k, m, T.panel);
    Sn.current = w, Cn(T, z ? z(H, P) : { width: 320, height: 240 });
  }, Bg = () => {
    Sn.current = (kn == null ? void 0 : kn.at) ?? null, qr(null), Yg(), Sn.current = null;
  }, xc = () => Cn({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), Gg = ({ recipe: p, frame: w }) => {
    $a(null), Sn.current = { x: w.x, y: w.y }, Cn(p, w);
  }, yc = (p) => yt((w) => {
    for (const T of w.items) zt.includes(T.id) && T.recipe.kind === "shape" && (T.recipe = xS(T.recipe, p));
  }), wo = rf((p, w) => {
    if ("error" in p) return st(p.error);
    Sn.current = w, Cn(p.recipe, H1(p.recipe, H.page));
  }), $g = rf((p, w) => "error" in p ? st(p.error) : wc(w, (T) => T.kind === "image" ? p.recipe : T)), bc = () => {
    const p = $f(H), w = new Map(H.items.flatMap((T) => xe(T) && p.has(T.id) ? [[T.recipe.letterFor, p.get(T.id)]] : []));
    return (T) => w.get(T.id) ?? (T.templateId ? w.get(T.templateId) : void 0);
  }, Wg = () => {
    const p = qd(Gt.items, qn, Math.max(24, ia(H.page.marginMm)), void 0, bc());
    if (!p) {
      st(x("Nothing on this page draws data to write a legend from."));
      return;
    }
    Sn.current = { x: p.frame.x, y: p.frame.y }, Cn(p.recipe, p.frame);
  }, wc = (p, w) => {
    yt((T) => {
      const z = T.items.find((G) => G.id === p);
      z && (z.recipe = w(z.recipe));
    });
  }, Sc = (p) => {
    p.preventDefault();
    const w = p.target.closest("[data-item-id]");
    if (w != null && w.dataset.itemId) {
      const Y = w.dataset.itemId, U = H == null ? void 0 : H.items.find(({ id: $t }) => $t === Yr(Y));
      if (!U) return;
      const rt = I.includes(Y);
      rt || Be(fc([Y]));
      const kt = U.group ? ((H == null ? void 0 : H.items) ?? []).filter(($t) => $t.group === U.group).map(({ id: $t }) => $t) : [U.id], lt = rt && zt.length > 1 ? zt : kt, Lt = lt.length > 1, Ce = te(U.recipe), rn = [
        { label: Lt ? x("Duplicate {n} items", { n: lt.length }) : x("Duplicate"), onClick: () => Ur(lt) },
        { label: x("Copy"), onClick: () => nn.copy(lt) },
        { label: x("Cut"), onClick: () => nn.cut(lt) },
        { label: x("Paste"), disabled: !nn.canPaste, onClick: () => nn.paste(!1) },
        { label: x("Paste in place"), disabled: !nn.canPaste, onClick: () => nn.paste(!0) },
        { label: x("Zoom to selection"), onClick: () => ev.zoomToSelection(lt) },
        { label: x("Bring to front"), onClick: () => En(lt, "front") },
        { label: x("Bring forward"), onClick: () => En(lt, "forward") },
        { label: x("Send backward"), onClick: () => En(lt, "backward") },
        { label: x("Send to back"), onClick: () => En(lt, "back") },
        { label: U.locked ? x("Unlock") : x("Lock"), onClick: () => Xa(lt, !U.locked) },
        ...aC(x, ((H == null ? void 0 : H.items) ?? []).filter(({ id: $t }) => lt.includes($t)), ($t) => yt((ei) => {
          ns(ei, lt, $t);
        })),
        ...rt && Hr > 1 ? [{ label: x("Group"), onClick: Ha }] : [],
        ...U.group ? [{ label: x("Ungroup"), onClick: () => yt(($t) => pu($t, lt)) }] : [],
        ...H ? [{ label: x("Panel letters"), disabled: !zo(H, lt).canAdd, onClick: () => yt(($t) => {
          ju($t, lt);
        }) }, { label: x("Remove panel letters"), disabled: !zo(H, lt).canRemove, onClick: () => yt(($t) => {
          Iu($t, lt);
        }) }] : [],
        "separator",
        ...ct.mode !== "off" && (Ce || ct.mode !== "populations" && U.recipe.kind === "proportions" && U.recipe.panel) ? [
          {
            label: "iterated" in U.recipe && U.recipe.iterated ? x("Stop following the iteration") : x("Follow the iteration"),
            onClick: () => wc(U.id, ($t) => te($t) || $t.kind === "proportions" ? { ...$t, iterated: !$t.iterated } : $t)
          },
          "separator"
        ] : [],
        ...Ce ? [{ label: x("Open in Gating"), onClick: () => R(U.recipe) }] : [],
        ...U.recipe.kind === "figure" && S ? [{ label: x("Edit in Illustration"), onClick: () => S(structuredClone(U.recipe.illustration)) }] : [],
        ...U.recipe.kind === "proportions" && E ? [{ label: x("Edit in Plotting"), onClick: () => {
          var $t;
          return E(structuredClone(U.recipe.settings), (($t = U.name) == null ? void 0 : $t.trim()) || Ye(U, jt));
        } }] : [],
        { label: Lt ? x("Remove {n} items", { n: lt.length }) : x("Remove"), onClick: () => Ya(lt) }
      ];
      Ba({ x: p.clientX, y: p.clientY, items: rn, label: Ye(U, jt) });
      return;
    }
    const T = p.currentTarget.getBoundingClientRect(), z = { x: (p.clientX - T.left) / Ct, y: (p.clientY - T.top) / Ct }, G = (Y) => () => {
      Sn.current = z, Y();
    };
    Ba({
      x: p.clientX,
      y: p.clientY,
      label: x("Page"),
      items: [
        { label: x("+ Biplot"), disabled: !ge, onClick: G(() => Wa("biplot")) },
        { label: x("+ Histogram"), disabled: !ge, onClick: G(() => Wa("histogram")) },
        { label: x("+ Gating strategy"), disabled: !ge, onClick: G(kc) },
        { label: x("+ Chart"), disabled: !ge, onClick: () => qr({ x: p.clientX, y: p.clientY, at: z }) },
        { label: x("+ Text"), onClick: G(xc) },
        { label: x("+ Illustration figure"), disabled: !ge || !(b != null && b.figure), onClick: G(Cc) },
        qS(x, (Y) => wo(Y, z)),
        ...GS(x, Ga, $a),
        "separator",
        { label: x("Paste"), disabled: !nn.canPaste, onClick: () => nn.paste(!1) },
        { label: x("Paste in place"), disabled: !nn.canPaste, onClick: () => nn.paste(!0) },
        // With a selection on the page, the menu on blank paper offers what the selection's own menu does for grouping, as Illustrator's does.
        ...Hr > 1 ? [{ label: x("Group"), onClick: Ha }] : [],
        ...Zt.some((Y) => Y.group) ? [{ label: x("Ungroup"), onClick: ko }] : [],
        { label: x("Select all"), disabled: !Gt.items.length, onClick: () => Be(Gt.items.filter((Y) => !La.has(Y.templateId)).map(({ id: Y }) => Y)) }
      ]
    });
  }, Cc = () => {
    if (!(b != null && b.figure)) {
      st(x("Make a figure on the Illustration tab first."));
      return;
    }
    H && Cn({ kind: "figure", illustration: structuredClone(b), page: 0 }, cm(b, a, h, H, c));
  }, Yg = () => {
    if (!C || !H) return;
    const p = C(), w = fu(p, ds(a), h, tn, k, m);
    if (!w) {
      st(p.valueKind !== "proportion" ? x("Choose files, populations and a channel on the Plotting tab first.") : x("Choose files and populations on the Plotting tab first."));
      return;
    }
    Cn({ kind: "proportions", settings: p, textSize: "sheet" }, w(H, P));
  }, kc = () => {
    var T;
    if (!Kt || !Pn) {
      st(x("Check an FCS file and select a population first."));
      return;
    }
    const p = Kt.tree.root_population_id ?? "", w = Pn !== p ? Pn : ((T = ta(Kt.tree.populations, p).filter(({ popId: z }) => z !== p).at(-1)) == null ? void 0 : T.popId) ?? Pn;
    Cn(
      {
        kind: "strategy",
        sampleId: Kt.id,
        populationId: w,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...ct.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, Hg = () => {
    var z;
    if (!b) {
      st(x("Render or configure an Illustration selection first."));
      return;
    }
    if (!b.figure && b.plotType === "heatmap") {
      st(
        x("Heatmap layout blocks are planned for the next Layout phase.")
      );
      return;
    }
    const p = b.figure;
    let w = [];
    if (p)
      try {
        w = Cf(p, a, Se, u, c).flatMap((Y) => Y.panels).flatMap(
          (Y) => Y.plot.type === "chart" ? sm(Y, p, b, (U) => jt.some(({ id: rt }) => rt === U), Se) ?? [] : lm([Y], p, b, (U) => jt.find(({ id: rt }) => rt === U), Se)
        );
      } catch (G) {
        st(G instanceof Error ? G.message : String(G));
        return;
      }
    else
      for (const G of jt) {
        const Y = b.selectionMode === "matrix" ? ((z = b.selectedPopulationsBySample) == null ? void 0 : z[G.id]) ?? [] : b.popIds;
        for (const U of Y)
          for (const rt of b.xChannels) {
            const kt = b.plotType === "histogram" ? "histogram" : "biplot";
            w.push({
              kind: kt,
              sampleId: G.id,
              populationId: U,
              xChannel: rt,
              yChannel: kt === "histogram" ? null : b.yChannel,
              displayMode: b.displayMode === "dots" ? "scatter" : b.displayMode
            });
          }
      }
    const T = w.slice(0, 60);
    if (T.length === 0) {
      st(
        x("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    yt((G) => {
      for (const Y of wf(G, T)) mu(G, Y);
    }), st(
      w.length > T.length ? x(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: T.length
        }
      ) : x("Added {count} Illustration plots.", { count: T.length })
    );
  }, Dt = (p) => {
    K && yt((w) => {
      const T = w.items.find(({ id: G }) => G === K.id);
      if (!T) return;
      const z = T.recipe;
      if (T.recipe = p(T.recipe), z.kind === "cellpanel" && T.recipe.kind === "cellpanel") {
        const G = gu(z), Y = gu(T.recipe), U = Math.max(0.1, Math.min(T.width / Math.max(1, G.width), T.height / Math.max(1, G.height)));
        T.width = Math.max(40, Math.round(Y.width * U)), T.height = Math.max(30, Math.round(Y.height * U));
      }
    });
  }, So = (p) => Dt((w) => {
    if (w.kind !== "biplot" && w.kind !== "histogram") return w;
    const T = p ? a.filter((Y) => p.includes(Y.id)).map((Y) => Y.id) : [];
    if (!T.length) {
      const { pool: Y, ...U } = w;
      return U;
    }
    const z = T.includes(w.sampleId) ? w.sampleId : T[0];
    let G = w.populationId;
    if (z !== w.sampleId) {
      const Y = jt.find(({ id: rt }) => rt === w.sampleId), U = jt.find(({ id: rt }) => rt === z);
      Y && U && (G = ki({ hierarchyId: Y.tree.id, populationId: G }, U.tree, Se).id ?? U.tree.root_population_id ?? G);
    }
    return { ...w, sampleId: z, populationId: G, pool: { sampleIds: T } };
  }), Xg = $.useMemo(() => {
    var Y;
    const p = K == null ? void 0 : K.recipe;
    if (!p || !te(p) || p.kind === "strategy" || !p.pool) return null;
    const w = Vt != null && Vt.templateSampleId ? (Y = jt.find(({ id: U }) => U === Vt.templateSampleId)) == null ? void 0 : Y.tree.id : void 0, { members: T, leftOut: z } = Mr(p, jt, Se, w), G = p.kind === "biplot" && p.yChannel && T.length > 1 ? Uv(Se, T.map((U) => U.tree.id), p.xChannel, p.yChannel).omitted.map((U) => U.name) : [];
    return { pooled: T.length, total: p.pool.sampleIds.length, leftOut: z, omittedGates: G };
  }, [K, Vt, jt, Se]), Ec = $.useMemo(() => {
    var U;
    const p = Vt == null ? void 0 : Vt.recipe;
    if (!p || !te(p) || !(Vt != null && Vt.unitId)) return null;
    const w = Ge.find((rt) => rt.id === Vt.unitId);
    if (!w) return null;
    if (w.populationId) return x("This page draws {name}; the population chosen here is the template's.", { name: w.name });
    if (!w.sampleIds) return x("This page draws {name}; the file chosen here is the template's.", { name: w.name });
    const T = (rt) => {
      var kt;
      return ((kt = a.find((lt) => lt.id === rt)) == null ? void 0 : kt.name) ?? rt;
    };
    if (p.kind === "strategy") return x("This page is {value}: a strategy is drawn for one file, {file}, not pooled.", { value: w.name, file: T(p.sampleId) });
    if (!p.pool) return x("This page is {value}: {file} alone.", { value: w.name, file: T(p.sampleId) });
    const z = Vt.templateSampleId ? (U = jt.find(({ id: rt }) => rt === Vt.templateSampleId)) == null ? void 0 : U.tree.id : void 0, { members: G, leftOut: Y } = Mr(p, jt, Se, z);
    return x("This page is {value}: {n} of {m} files pooled", { value: w.name, n: G.length, m: p.pool.sampleIds.length }) + (Y.length ? ` · ${x("Not pooled: {files}", { files: Y.map((rt) => `${rt.name} (${rt.reason})`).join(", ") })}` : "");
  }, [Vt, Ge, a, jt, Se, x]), Co = (p) => {
    yt((w) => {
      w.items = w.items.filter((T) => !p.includes(T.id)), Sf(w);
    }), A((w) => w.filter((T) => !p.includes(T)));
  }, Mc = (p) => {
    const w = Kr.current.sheets.find(({ id: G }) => G === Kr.current.activeSheetId);
    if (!w) return [...p];
    const T = Qn(w, p), z = T.filter((G) => w.items.some((Y) => Y.id === G && Y.locked));
    return z.length && st(z.length === 1 ? x("1 locked item was left in place.") : x("{count} locked items were left in place.", { count: z.length })), T.filter((G) => !z.includes(G));
  }, Ya = (p) => {
    const w = Mc(p);
    w.length && Co(w);
  }, Ur = (p, w) => {
    const T = [];
    return yt((z) => {
      let G = Math.max(0, ...z.items.map((rt) => rt.z));
      const Y = Hf(z, Qn(z, p)).flatMap((rt) => z.items.filter((kt) => kt.id === rt)), { copies: U } = Ii(Y);
      Uf(U), U.forEach((rt, kt) => {
        const lt = Y[kt];
        T.push(rt.id);
        const Lt = w && lt.group ? Y.find(($t) => $t.group === lt.group && w[$t.id]) : void 0, Ce = Lt ? { x: w[Lt.id].x - Lt.x, y: w[Lt.id].y - Lt.y } : { x: 20, y: 20 }, rn = (w == null ? void 0 : w[lt.id]) ?? { x: lt.x + Ce.x, y: lt.y + Ce.y, width: lt.width, height: lt.height };
        z.items.push({ ...rt, ...rn, locked: !1, z: ++G });
      });
    }), T.length && Be(T), T;
  }, nn = hw({ sheet: H, mutateActiveSheet: yt, removeItems: Co, selectMany: Be, removable: Mc }), Dc = $.useRef(null), Vg = (p, w, T) => {
    const z = Date.now(), G = Dc.current, Y = p.join(`
`), U = !!G && G.ids === Y && z - G.at < 1e3 && G.step !== void 0 && hn.current[0] === G.step, rt = mr(t), kt = rt.sheets.find(({ id: lt }) => lt === rt.activeSheetId);
    if (kt) {
      const lt = Qn(kt, p);
      for (const Lt of kt.items)
        !lt.includes(Lt.id) || Lt.locked || (Lt.x += w, Lt.y += T);
    }
    Vr(rt, !U), Dc.current = { ids: Y, at: z, step: hn.current[0] };
  }, En = (p, w) => {
    yt((T) => {
      const z = [...T.items].sort((rt, kt) => rt.z - kt.z), G = z.filter((rt) => p.includes(rt.id)), Y = z.filter((rt) => !p.includes(rt.id));
      let U;
      if (w === "front") U = [...Y, ...G];
      else if (w === "back") U = [...G, ...Y];
      else {
        U = z;
        const rt = U.map((kt, lt) => lt);
        w === "forward" && rt.reverse();
        for (const kt of rt) {
          const lt = w === "forward" ? kt + 1 : kt - 1;
          !p.includes(U[kt].id) || lt < 0 || lt >= U.length || p.includes(U[lt].id) || ([U[kt], U[lt]] = [U[lt], U[kt]]);
        }
      }
      U.forEach((rt, kt) => {
        rt.z = kt;
      });
    });
  }, Ha = () => {
    Hr < 2 || yt((p) => {
      fm(p, zt);
    });
  }, ko = () => {
    Zt.some((p) => p.group) && yt((p) => pu(p, zt));
  }, Xa = (p, w) => {
    yt((T) => {
      for (const z of T.items) p.includes(z.id) && (z.locked = w);
    });
  }, Kg = (p) => {
    yt((w) => um(w, Qn(w, zt).filter((T) => {
      var z;
      return !((z = w.items.find((G) => G.id === T)) != null && z.locked);
    }), p));
  }, qg = (p) => {
    yt((w) => dm(w, Qn(w, zt).filter((T) => {
      var z;
      return !((z = w.items.find((G) => G.id === T)) != null && z.locked);
    }), p));
  }, Va = (p, w) => {
    const T = {};
    for (const G of p) {
      const Y = G.dataset.itemId, U = Gt.items.find((lt) => lt.id === Y);
      if (!U) continue;
      const { id: rt, ...kt } = f0(U, FC(G));
      T[rt] = kt;
    }
    const z = Object.keys(T);
    if (z.length) {
      if (w) {
        for (const G of p) {
          const Y = Gt.items.find((U) => U.id === G.dataset.itemId);
          Y && Object.assign(G.style, { left: `${Y.x}px`, top: `${Y.y}px`, width: `${Y.width}px`, height: `${Y.height}px` });
        }
        Ur(z, T);
        return;
      }
      yt((G) => {
        C0(G, T);
        for (const Y of G.items) {
          const U = T[Y.id];
          if (!U) continue;
          const { zoom: rt } = is(Y, U.width, U.height);
          Object.assign(Y, U), rt === void 0 ? delete Y.zoom : Y.zoom = rt;
        }
      });
    }
  }, Tc = (p) => p.flatMap((w) => {
    if (!(w instanceof HTMLElement) || !w.parentElement) return [];
    const T = w.cloneNode(!0);
    T.classList.add("gl-layout-ghost"), T.classList.remove("is-selected"), T.removeAttribute("data-item-id"), T.setAttribute("aria-hidden", "true");
    const z = w.querySelectorAll("canvas");
    return T.querySelectorAll("canvas").forEach((G, Y) => {
      var rt;
      const U = z[Y];
      U && (G.width = U.width, G.height = U.height, (rt = G.getContext("2d")) == null || rt.drawImage(U, 0, 0));
    }), w.parentElement.insertBefore(T, w), [T];
  }), Ka = (p) => {
    if (Array.isArray(p)) for (const w of p) w.remove();
  }, Eo = (p) => {
    for (const w of p) {
      const T = Gt.items.find((Y) => Y.id === w.dataset.itemId);
      if (!T) continue;
      Object.assign(w.style, { left: `${T.x}px`, top: `${T.y}px`, width: `${T.width}px`, height: `${T.height}px` });
      const z = w.querySelector(":scope > .gl-layout-item-body"), G = Wn(T);
      z && Object.assign(z.style, G === 1 ? { zoom: "", width: "", height: "" } : { zoom: String(G), width: `${Math.max(1, Math.round(T.width / G))}px`, height: `${Math.max(1, Math.round(T.height / G))}px` });
    }
  }, _c = $.useRef(Eo);
  _c.current = Eo;
  const Nn = $.useRef(null), qa = (p, w) => {
    const T = { targets: p, ghosts: w, cancelled: !1 };
    Nn.current = T;
    const z = () => {
      window.removeEventListener("mouseup", z, !0), window.removeEventListener("touchend", z, !0), window.setTimeout(() => {
        Nn.current === T && (Nn.current = null, Ka(T.ghosts));
      }, 0);
    };
    window.addEventListener("mouseup", z, !0), window.addEventListener("touchend", z, !0);
  }, Ua = (p, w, T, z) => {
    const G = Nn.current;
    Nn.current = null, Ka(G == null ? void 0 : G.ghosts);
    const Y = w == null ? void 0 : w.dist, U = !Y || Math.hypot(Y[0] ?? 0, Y[1] ?? 0) >= 3;
    G != null && G.cancelled || !T || !U ? Eo(p) : z();
  }, jc = (p) => {
    var G;
    p.target.style.left = `${p.left}px`, p.target.style.top = `${p.top}px`;
    const w = (G = p.datas) == null ? void 0 : G.companions;
    if (!(w != null && w.length)) return;
    const T = p.left - p.datas.startLeft, z = p.top - p.datas.startTop;
    for (const { el: Y, left: U, top: rt } of w)
      Y.style.left = `${U + T}px`, Y.style.top = `${rt + z}px`;
  }, Ic = (p) => {
    var T;
    const w = (T = p.datas) == null ? void 0 : T.companions;
    return [p.target, ...(w ?? []).map(({ el: z }) => z)];
  }, Ug = (p) => {
    var G;
    p.datas.alt = !!((G = p.inputEvent) != null && G.altKey);
    const w = p.target, T = Xr ? hc.current.filter((Y) => Y !== w) : [];
    p.datas.startLeft = parseFloat(w.style.left) || 0, p.datas.startTop = parseFloat(w.style.top) || 0, p.datas.companions = T.map((Y) => ({ el: Y, left: parseFloat(Y.style.left) || 0, top: parseFloat(Y.style.top) || 0 }));
    const z = Ic(p);
    qa(z, p.datas.alt ? Tc(z) : void 0);
  }, Rc = (p) => {
    var U, rt;
    const w = gS((U = Gt.items.find((kt) => kt.id === p.target.dataset.itemId)) == null ? void 0 : U.recipe, p, !!((rt = p.inputEvent) != null && rt.shiftKey));
    w && (p = { ...p, width: w.width, height: w.height, drag: { ...p.drag, left: w.left, top: w.top } }), p.target.style.width = `${p.width}px`, p.target.style.height = `${p.height}px`, p.target.style.left = `${p.drag.left}px`, p.target.style.top = `${p.drag.top}px`;
    const T = p.target, z = Gt.items.find((kt) => kt.id === T.dataset.itemId), G = T.querySelector(":scope > .gl-layout-item-body");
    if (!z || !G) return;
    const Y = is(z, p.width, p.height).zoom ?? 1;
    Object.assign(G.style, Y === 1 && !T.dataset.zoom ? { zoom: "", width: "", height: "" } : { zoom: String(Y), width: `${Math.round(p.width / Y)}px`, height: `${Math.round(p.height / Y)}px` });
  }, Zg = (p) => {
    var z;
    const w = (z = p.inputEvent) == null ? void 0 : z.target;
    if (!w) return;
    const T = ht.current;
    if (T != null && T.isMoveableElement(w)) {
      p.stop();
      return;
    }
    if (wn.some((G) => G === w || G.contains(w)) && (p.stop(), wn.length > 1 && !Xr)) {
      T == null || T.dragStart(p.inputEvent);
      const G = p.inputEvent, Y = (U) => {
        var rt;
        window.removeEventListener("mouseup", Y), Math.hypot(U.clientX - G.clientX, U.clientY - G.clientY) < 4 && ((rt = tt.current) == null || rt.clickTarget(G, w));
      };
      window.addEventListener("mouseup", Y);
    }
  }, Jg = (p) => {
    var G, Y, U;
    const w = p.isClick || p.isDragStart, T = new Set((p.removed ?? []).map((rt) => za(rt.dataset.itemId ?? "")).filter(Boolean)), z = fc(
      p.selected.map((rt) => rt.dataset.itemId ?? "").filter((rt) => rt && (w || !La.has(Yr(rt))))
    ).filter((rt) => !T.has(za(rt)));
    if (Be(z), p.isDragStart && !p.isClick) {
      if (!z.filter((lt) => !La.has(Yr(lt)) && lt !== B).length) return;
      (Y = (G = p.inputEvent) == null ? void 0 : G.preventDefault) == null || Y.call(G), Fa.current = !0;
      const kt = () => {
        Fa.current = !1;
      };
      window.setTimeout(() => window.addEventListener("mousedown", kt, { capture: !0, once: !0 }), 0), (U = ht.current) == null || U.waitToChangeTarget().then(() => {
        var lt;
        return (lt = ht.current) == null ? void 0 : lt.dragStart(p.inputEvent);
      });
    }
  }, Pc = (p) => {
    window.requestAnimationFrame(() => {
      var w, T, z;
      (z = (T = (w = Qe.current) == null ? void 0 : w.querySelector(`[data-item-id="${p}"]`)) == null ? void 0 : T.scrollIntoView) == null || z.call(T, { block: "nearest", inline: "nearest" });
    });
  }, Jn = (p) => {
    yt((w) => mm(w, xm(p)));
  }, Qg = () => {
    let p = !1;
    yt((w) => {
      p = ym(w);
    }), p && st(x("The page stopped at 2000 mm, the largest a page may be, and the content was scaled down to fit on it."));
  }, tv = () => yt((p) => bm(p, zt)), Mo = (() => {
    const p = [], w = [];
    if (!H) return { vertical: p, horizontal: w };
    const T = Ln(H.page), z = ia(H.page.marginMm);
    for (const Y of ya(H.page))
      p.push(Y.x, Y.x + z, Y.x + T.width / 2, Y.x + T.width - z, Y.x + T.width), w.push(Y.y, Y.y + z, Y.y + T.height / 2, Y.y + T.height - z, Y.y + T.height);
    const G = DS(H);
    return p.push(...G.vertical), w.push(...G.horizontal), { vertical: [...new Set(p)], horizontal: [...new Set(w)] };
  })(), Do = () => {
    const p = Ot.current;
    if (!p || !H) return;
    const w = { width: p.clientWidth - 36, height: p.clientHeight - 36 };
    if (w.width <= 0 || w.height <= 0) return;
    const T = Math.min(w.width / H.width, w.height / H.height);
    Jt(Math.max(0.1, Math.min(4, Math.floor(T * 100) / 100)));
  };
  $.useEffect(() => {
    const p = at;
    if (!p) return;
    const w = (T) => {
      if (!(T.altKey || T.shiftKey || T.ctrlKey)) return;
      const z = T.deltaY || T.deltaX;
      if (!z) return;
      T.preventDefault();
      const G = Me.current, Y = Math.max(0.1, Math.min(4, Math.round(G * Math.exp(-z * 25e-4) * 100) / 100));
      if (Y === G) return;
      Me.current = Y, Jt(Y);
      const U = p.getBoundingClientRect(), rt = T.clientX - U.left, kt = T.clientY - U.top, lt = Y / G, Lt = (p.scrollLeft + rt) * lt - rt, Ce = (p.scrollTop + kt) * lt - kt;
      requestAnimationFrame(() => {
        p.scrollLeft = Lt, p.scrollTop = Ce;
      });
    };
    return p.addEventListener("wheel", w, { passive: !1 }), () => p.removeEventListener("wheel", w);
  }, [at]);
  const To = (p) => {
    const w = p > 0 ? Qr.find((T) => T > Ct + 1e-3) : [...Qr].reverse().find((T) => T < Ct - 1e-3);
    w && Jt(w);
  }, Nc = $.useRef(ge);
  Nc.current = ge;
  const Oc = async () => {
    const p = () => new Promise((z) => window.requestAnimationFrame(() => z())), w = () => {
      var z;
      return [...((z = Qe.current) == null ? void 0 : z.querySelectorAll("[data-layout-pending]")) ?? []].some((G) => G.dataset.layoutPending !== "source" || !Nc.current);
    };
    await new Promise((z) => window.setTimeout(z, 150));
    const T = Date.now();
    for (; ; ) {
      for (; w() && Date.now() - T < 2e4; )
        await new Promise((z) => window.setTimeout(z, 50));
      if (await p(), await p(), !w()) return !0;
      if (Date.now() - T >= 2e4) return !1;
    }
  }, Ac = (p, w) => {
    const T = [];
    w && T.push(x("Some blocks had not finished drawing after 20 s and may be written blank or incomplete.")), p != null && p.loweredDpi && T.push(x("The resolution was lowered to {dpi} dpi, the most a browser can draw a page of this size at as one image.", { dpi: p.loweredDpi }));
    const z = (p == null ? void 0 : p.rasterPages) ?? [];
    return z.length && T.push(z.length === 1 ? x("The PDF writer could not take page {pages} as vector art; it is written as one image.", { pages: z[0] }) : x("The PDF writer could not take pages {pages} as vector art; they are written as one image each.", { pages: z.join(", ") })), T;
  }, zc = async () => {
    var z;
    const p = Qe.current;
    if (!p || !H || he) return;
    Fe(!0);
    const w = en;
    let T = !1;
    try {
      const G = [];
      for (let kt = 0; kt < we.length; kt++) {
        we.length > 1 && Un(kt), await Oc() || (T = !0);
        const lt = ((z = we[kt]) == null ? void 0 : z.units.length) === 1 ? we[kt].units[0].name : void 0;
        G.push(...Zh(p, H, { zoom: Me.current, crop: be ? { paddingMm: Je } : void 0 }).map((Lt) => lt ? { ...Lt, label: lt } : Lt));
      }
      const Y = await cw(G, H, Qt);
      _ == null || _();
      const U = lu(H).length, rt = Ac(Y, T);
      U ? st([U === 1 ? x("Exported. 1 item lies outside the sheet's pages and was cut off or left out; Export has a button that adds the pages to hold it.") : x("Exported. {count} items lie outside the sheet's pages and were cut off or left out; Export has a button that adds the pages to hold them.", { count: U }), ...rt].join(" ")) : rt.length && st([x("Exported."), ...rt].join(" "));
    } catch (G) {
      st(G instanceof Error ? G.message : String(G));
    } finally {
      we.length > 1 && Un(w), yn(!1);
    }
  }, gr = H ? lu(H).length : 0, ev = yC({ canvasEl: at, zoom: Ct, setZoom: Jt, fitZoom: Do, stepZoom: To, items: Gt.items, selected: zt }), nv = CC({ workspace: t, mutate: Zn, rename: Mt, openMenu: Ba, clearSelection: () => A([]) }), Za = TC({
    workspace: t,
    pages: we,
    pageIndex: en,
    setPageIndex: Un,
    zoom: Ct,
    setZoom: Jt,
    canvas: Ot.current,
    page: Qe.current,
    showSheet: (p) => Vr({ ...t, activeSheetId: p }, !1),
    settle: Oc,
    format: Qt,
    crop: be ? { paddingMm: Je } : void 0,
    exporting: he,
    setExporting: Fe,
    selectedIds: I,
    setSelectedIds: A,
    onError: st,
    onExported: _,
    onWritten: (p, w) => {
      const T = Ac(p, w);
      T.length && st([x("Exported."), ...T].join(" "));
    }
  }), gn = (p) => {
    yt((w) => {
      var T;
      if (p.mode === "off") {
        delete w.iteration;
        return;
      }
      if ((((T = w.iteration) == null ? void 0 : T.mode) ?? "off") === "off" && !w.items.some(Lr))
        for (const z of w.items) te(z.recipe) && (z.recipe.iterated = !0);
      w.iteration = p;
    }), Un(0);
  }, rv = (p) => [...new Set(a.map((w) => {
    var T;
    return ((T = w.metadata) == null ? void 0 : T[p]) ?? "";
  }).filter(Boolean))], av = ct.source.kind === "group" ? `group:${ct.source.groupId}` : ct.source.kind === "metadata" ? `meta:${ct.source.column}=${ct.source.value}` : ct.source.kind, iv = (p) => {
    if (p === "all") return { kind: "all" };
    if (p.startsWith("group:")) return { kind: "group", groupId: p.slice(6) };
    if (p.startsWith("meta:")) {
      const [w, ...T] = p.slice(5).split("=");
      return { kind: "metadata", column: w, value: T.join("=") };
    }
    return { kind: "checked" };
  }, ov = (p) => {
    if (he) return;
    const w = du(p.nativeEvent);
    if (w) {
      p.preventDefault(), w === "undo" ? Ja() : Qa();
      return;
    }
    if (p.target.closest("input, textarea, select")) return;
    const T = p.metaKey || p.ctrlKey;
    if (p.key === "Escape") {
      A([]);
      return;
    }
    if (T && p.key.toLowerCase() === "a") {
      p.preventDefault(), Be(((H == null ? void 0 : H.items) ?? []).filter((rt) => !rt.locked && !yo.has(rt.id)).map((rt) => rt.id));
      return;
    }
    const z = dw(p);
    if (z && !B) {
      p.preventDefault(), nn.run(z, zt);
      return;
    }
    if (!I.length) return;
    if (p.key === "Enter" && I.length === 1) {
      const rt = Gt.items.find((kt) => kt.id === I[0]);
      if ((rt == null ? void 0 : rt.recipe.kind) === "text" && !xe(rt)) {
        p.preventDefault(), q(rt.id);
        return;
      }
    }
    if (p.key === "Delete" || p.key === "Backspace") {
      p.preventDefault(), Ya(zt);
      return;
    }
    if (T && p.key.toLowerCase() === "d") {
      p.preventDefault(), Ur(zt);
      return;
    }
    if (T && (p.key === "]" || p.key === "[")) {
      p.preventDefault(), En(zt, p.key === "]" ? p.shiftKey ? "front" : "forward" : p.shiftKey ? "back" : "backward");
      return;
    }
    if (T && p.key.toLowerCase() === "g") {
      p.preventDefault(), p.shiftKey ? ko() : Ha();
      return;
    }
    if (T && p.shiftKey && p.key.toLowerCase() === "l") {
      p.preventDefault(), Xa(zt, !xo);
      return;
    }
    const G = p.shiftKey ? 10 : 1, U = {
      ArrowLeft: [-G, 0],
      ArrowRight: [G, 0],
      ArrowUp: [0, -G],
      ArrowDown: [0, G]
    }[p.key];
    U && (p.preventDefault(), Vg(zt, U[0], U[1]));
  }, _o = K == null ? void 0 : K.recipe, Wt = _o && "sampleId" in _o ? jt.find(({ id: p }) => p === _o.sampleId) ?? null : null, Lc = Wt ? Wt.sample.channels.map((p) => ({
    value: p.key,
    label: Wt.sample.channelLabel(Wt.sample.index(p.key) ?? 0)
  })) : [], jo = Wt ? ta(
    Wt.tree.populations,
    Wt.tree.root_population_id ?? ""
  ) : [], Ja = () => {
    const p = hn.current.shift();
    p && (hr.current = [
      mr(t),
      ...hr.current
    ].slice(0, 30), Vr(p, !1));
  }, Qa = () => {
    const p = hr.current.shift();
    p && (hn.current = [
      mr(t),
      ...hn.current
    ].slice(0, 30), Vr(p, !1));
  }, ti = $.useRef({ undo: Ja, redo: Qa, exporting: he });
  return ti.current = { undo: Ja, redo: Qa, exporting: he }, $.useEffect(() => {
    const p = (T) => {
      var G, Y;
      if (T.key === "Escape" && Nn.current) {
        const U = Nn.current;
        U.cancelled = !0, T.preventDefault(), T.stopPropagation(), _c.current(U.targets), Ka(U.ghosts), U.ghosts = void 0, LC(ht.current);
        return;
      }
      const z = du(T);
      z && ((Y = (G = T.target) == null ? void 0 : G.closest) != null && Y.call(G, "input, textarea, select, [contenteditable='true']") || (T.preventDefault(), T.stopPropagation(), !ti.current.exporting && (z === "undo" ? ti.current.undo() : ti.current.redo())));
    }, w = () => {
      const T = Nn.current;
      T && (Ka(T.ghosts), T.ghosts = void 0);
    };
    return window.addEventListener("keydown", p, !0), window.addEventListener("blur", w), () => {
      window.removeEventListener("keydown", p, !0), window.removeEventListener("blur", w);
    };
  }, []), H ? /* @__PURE__ */ g.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${_t ? " is-preview" : ""}`,
      ...he ? { inert: "", "aria-busy": !0 } : {},
      children: [
        /* @__PURE__ */ g.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": x("Layout sheets"),
            children: [
              t.sheets.map((p) => /* @__PURE__ */ g.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: ft === p.id ? /* @__PURE__ */ g.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: p.name,
                  autoFocus: !0,
                  onFocus: (w) => w.currentTarget.select(),
                  onBlur: (w) => {
                    const T = w.currentTarget.value.trim();
                    T && Zn((z) => {
                      const G = z.sheets.find(
                        ({ id: Y }) => Y === p.id
                      );
                      G && (G.name = T);
                    }), Mt(null);
                  },
                  onKeyDown: (w) => {
                    w.key === "Enter" && w.currentTarget.blur(), w.key === "Escape" && Mt(null);
                  }
                }
              ) : /* @__PURE__ */ g.jsx(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": t.activeSheetId === p.id,
                  className: `gl-layout-sheet-tab${t.activeSheetId === p.id ? " active" : ""}`,
                  title: x("Drag to reorder; double-click to rename; right-click for more"),
                  ...nv.tabProps(p.id),
                  onClick: () => {
                    t.activeSheetId !== p.id && Zn((w) => {
                      w.activeSheetId = p.id;
                    });
                  },
                  onDoubleClick: () => Mt(p.id),
                  children: p.name
                }
              ) }, p.id)),
              /* @__PURE__ */ g.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-layout-sheet-add",
                  title: x("New blank layout"),
                  onClick: () => {
                    const p = { ...Zv(
                      `Layout ${t.sheets.length + 1}`,
                      { ...H.page }
                    ), followFigureStyle: !0 };
                    Zn((w) => {
                      w.sheets.push(p), w.activeSheetId = p.id;
                    }), A([]);
                  },
                  children: "+"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ g.jsxs(
          "div",
          {
            className: "gl-layout-toolbar",
            onMouseDown: (p) => {
              p.target.closest("button") && p.preventDefault();
            },
            children: [
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Wa("biplot"), disabled: !ge, title: x(ge ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: x("+ Biplot") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Wa("histogram"), disabled: !ge, title: x(ge ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: x("+ Histogram") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: kc, disabled: !ge, title: x(ge ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: x("+ Gating strategy") }),
                /* @__PURE__ */ g.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: x("Add a text block; edit it on the page"),
                    onClick: xc,
                    children: x("+ Text")
                  }
                ),
                /* @__PURE__ */ g.jsx($S, { armed: Ga, onArm: $a }),
                /* @__PURE__ */ g.jsx(KS, { onFile: (p) => wo(p, null) }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Hg, disabled: !ge, title: x("Add one plot per file and plot of the Illustration tab's current selection"), children: x("Add Illustration selection") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Cc, disabled: !ge, title: x("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: x("+ Illustration figure") }),
                /* @__PURE__ */ g.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    onClick: (p) => {
                      const w = p.currentTarget.getBoundingClientRect();
                      qr({ x: w.left, y: w.bottom + 4, at: null });
                    },
                    disabled: !ge,
                    title: x(ge ? "Add a chart: one statistic of a population per file, grouped by a metadata column, or the Plotting tab's current chart" : "Preparing the files…"),
                    children: x("+ Chart")
                  }
                ),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Wg, disabled: !ge || !H.items.length, title: x("Add a text block under the sheet's content: a legend with a sentence group per block, in reading order, giving n, the centre and spread drawn, and the tests"), children: x("Write legend") }),
                /* @__PURE__ */ g.jsx(e0, { ...zo(H, zt), onAdd: () => yt((p) => {
                  ju(p, zt);
                }), onRemove: () => yt((p) => {
                  Iu(p, zt);
                }) }),
                kn && /* @__PURE__ */ g.jsx(
                  Rw,
                  {
                    x: kn.x,
                    y: kn.y,
                    populations: Kt ? ta(Kt.tree.populations, Kt.tree.root_population_id ?? "").filter(({ popId: p }) => p !== Kt.tree.root_population_id).map(({ popId: p, depth: w }) => {
                      var T;
                      return { popId: p, depth: Math.max(0, w - 1), name: ((T = Kt.tree.populations[p]) == null ? void 0 : T.name) ?? p };
                    }) : [],
                    defaultPopulation: Pn !== (Kt == null ? void 0 : Kt.tree.root_population_id) ? Pn : "",
                    metadataColumns: l,
                    onAdd: Fg,
                    onTakePlotting: C ? Bg : void 0,
                    onClose: Lg
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": x("Arrange"), children: [
                AC.map(({ how: p, label: w, title: T }) => /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Kg(p), disabled: !I.length || _t, title: x(T), children: x(w) }, p)),
                zC.map(({ how: p, label: w, title: T }) => /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => qg(p), disabled: Hr < 3 || _t, title: x(T), children: x(w) }, p)),
                /* @__PURE__ */ g.jsx(Iw, { unitCount: H ? Wd(H, zt) : 0, disabled: _t, prefs: X, onSpace: (p, w) => yt((T) => Ew(T, zt, Ui(p, "mm"), w)) }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": F, onClick: () => N((p) => !p), title: x("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: x("Snap grid") }),
                /* @__PURE__ */ g.jsx(AS, { on: W, onToggle: () => V((p) => !p) })
              ] }),
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": _t, onClick: () => Xt(!_t), title: x("Show the page as it exports, without grid, margins or handles"), children: x(_t ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !hn.current.length, onClick: Ja, title: x("Undo the last layout edit (Cmd-Z)"), children: x("Undo") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !hr.current.length, onClick: Qa, title: x("Redo the undone edit (Shift-Cmd-Z)"), children: x("Redo") }),
                /* @__PURE__ */ g.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: x("Copy this sheet, with its page and items, as a new sheet"),
                    onClick: () => {
                      const p = {
                        ...H,
                        id: crypto.randomUUID(),
                        page: { ...H.page },
                        ...H.iteration ? { iteration: structuredClone(H.iteration) } : {},
                        ...TS(H),
                        name: `${H.name} copy`,
                        // Headings that read from a plot read the copy's plot, not the original sheet's.
                        items: Ii(H.items).copies
                      };
                      Zn((w) => {
                        w.sheets.push(p), w.activeSheetId = p.id;
                      }), A([]);
                    },
                    children: x("Duplicate sheet")
                  }
                ),
                /* @__PURE__ */ g.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    disabled: t.sheets.length <= 1,
                    title: x("Remove this sheet; the layout keeps at least one"),
                    onClick: () => {
                      Zn((p) => {
                        const w = p.sheets.findIndex(
                          ({ id: T }) => T === p.activeSheetId
                        );
                        p.sheets.splice(w, 1), p.activeSheetId = p.sheets[Math.max(0, w - 1)].id;
                      }), A([]);
                    },
                    children: x("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": x("Zoom"), children: [
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Do, title: x("Fit the page to the window"), children: x("Fit") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => To(-1), "aria-label": x("Zoom out"), title: x("Zoom out"), disabled: Ct <= Qr[0], children: "−" }),
                /* @__PURE__ */ g.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(Ct * 100),
                  "%"
                ] }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => To(1), "aria-label": x("Zoom in"), title: x("Zoom in"), disabled: Ct >= Qr[Qr.length - 1], children: "+" })
              ] }),
              (we.length > 1 || ct.mode !== "off") && /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": x("Pages of the iteration"), children: [
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Un(Math.max(0, en - 1)), disabled: en === 0, "aria-label": x("Previous page"), title: x("Previous page"), children: "◀" }),
                /* @__PURE__ */ g.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  x("Page {n} of {count}", { n: en + 1, count: Math.max(1, we.length) }),
                  Gt.units.length > 0 && ` · ${Gt.units.map((p) => p.name).join(", ")}`
                ] }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Un(Math.min(we.length - 1, en + 1)), disabled: en >= we.length - 1, "aria-label": x("Next page"), title: x("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ g.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void zc(), disabled: he || !H.items.length, title: we.length > 1 ? x("Write every page of the iteration; the format is chosen under Export") : x("Write every page of this sheet at its page size; the format is chosen under Export"), children: he ? x("Exporting…") : x("Export {format}", { format: Qt.toUpperCase() }) }) }),
              /* @__PURE__ */ g.jsx("span", { className: "gl-layout-performance-note", children: x("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        xt && /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ g.jsx("span", { children: xt }),
          /* @__PURE__ */ g.jsx("button", { type: "button", title: x("Dismiss"), "aria-label": x("Dismiss"), onClick: () => st(null), children: "×" })
        ] }),
        /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ g.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ g.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style", "export"].filter((p) => p !== "iterate" || ct.mode !== "off").map((p) => /* @__PURE__ */ g.jsx(
              "button",
              {
                "aria-pressed": Tt === p,
                title: x(p === "item" ? "The selected item, or the file new plots take" : p === "page" ? "Page size, margin and the number of pages" : p === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : p === "export" ? "Write the sheet's pages as PDF, SVG or PNG" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => vt(p),
                children: x(p === "item" ? "Items" : p === "page" ? "Page" : p === "iterate" ? "Iterate" : p === "export" ? "Export" : "Style")
              },
              p
            )) }),
            Tt === "item" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("File for new plots"),
                /* @__PURE__ */ g.jsx(
                  "select",
                  {
                    value: St,
                    onChange: (p) => Pt(p.target.value),
                    children: a.map((p) => /* @__PURE__ */ g.jsx("option", { value: p.id, children: p.name }, p.id))
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("Placed plots keep their own file and hierarchy, independently of the Gating selection.") }),
              Re.error && /* @__PURE__ */ g.jsx("p", { role: "alert", children: Re.error }),
              /* @__PURE__ */ g.jsx(
                M0,
                {
                  sheet: H,
                  selectedIds: zt,
                  samples: jt,
                  open: gt,
                  onOpenChange: At,
                  onSelect: (p) => {
                    A(p.map((w) => {
                      var T;
                      return ((T = Gt.items.find((z) => z.templateId === w)) == null ? void 0 : T.id) ?? w;
                    })), p.length === 1 && Pc(p[0]);
                  },
                  onChange: yt
                }
              ),
              Zt.length > 1 && /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-inspector", "aria-label": x("Selected layout items"), children: [
                /* @__PURE__ */ g.jsx("strong", { children: Ng ? x("{count} items selected, one group", { count: Zt.length }) : x("{count} items selected", { count: Zt.length }) }),
                /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions", children: [
                  Hr > 1 && /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Ha, title: x("One group: selected, moved, aligned and distributed together (Cmd-G)"), children: x("Group") }),
                  Zt.some((p) => p.group) && /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: ko, title: x("Dissolve the group; the items stay where they are (Shift-Cmd-G)"), children: x("Ungroup") }),
                  /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ur(zt), title: x("Copies of every selected item, 20 px down and right (Cmd-D)"), children: x("Duplicate") }),
                  /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => En(zt, "front"), title: x("Draw the selected items over every other"), children: x("Bring to front") }),
                  /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => En(zt, "back"), title: x("Draw the selected items under every other"), children: x("Send to back") }),
                  /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Xa(zt, !xo), title: x("Lock or unlock the selected items"), children: x(xo ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ya(zt), title: x("Remove the selected items (Delete)"), children: x("Remove") })
                ] }),
                /* @__PURE__ */ g.jsx(of, { items: Zt, onTurn: (p) => yt((w) => {
                  ns(w, zt, p);
                }) }),
                /* @__PURE__ */ g.jsx(_w, { itemCount: Zt.filter((p) => !xe(p)).length, unitCount: H ? Wd(H, zt) : 0, prefs: X, onMatch: (p) => yt((w) => {
                  Sw(w, zt, p);
                }), onGrid: ({ columns: p, gapMm: w, order: T }) => yt((z) => kw(z, zt, { columns: p, gapPx: Ui(w, "mm"), order: T })) }),
                /* @__PURE__ */ g.jsx(Yd, { items: Zt, onReset: () => yt((p) => $d(p, zt)) }),
                /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("Align and distribute them with the toolbar; drag any of them to move them together; Cmd-G makes them one group.") }),
                /* @__PURE__ */ g.jsx(
                  os,
                  {
                    styles: bn.map((p) => Mn(H, p.recipe, P)),
                    showTitle: bn.some(vo),
                    texts: cc,
                    onChange: mo,
                    onTextChange: uc
                  }
                ),
                bn.length > 0 && // A field set here is set on every selected plot, so a grid sent from the
                // Illustration tab is tuned together, not one plot at a time.
                /* @__PURE__ */ g.jsxs("details", { className: "gl-layout-item-style", children: [
                  /* @__PURE__ */ g.jsx(ba, { children: x("Style of the {count} selected plots", { count: bn.length }) }),
                  /* @__PURE__ */ g.jsx(
                    ss,
                    {
                      effective: Mn(H, bn[0].recipe, P),
                      own: bn[0].recipe.style ?? {},
                      omit: gf,
                      onChange: mo
                    }
                  ),
                  bn.some((p) => Object.keys(p.recipe.style ?? {}).length > 0) && /* @__PURE__ */ g.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: x("Drop the selected plots' own values; they then follow the sheet's style"),
                      onClick: () => yt((p) => {
                        for (const w of p.items) {
                          if (!zt.includes(w.id) || !te(w.recipe)) continue;
                          const { style: T, ...z } = w.recipe;
                          w.recipe = z;
                        }
                      }),
                      children: x("Follow the sheet")
                    }
                  )
                ] })
              ] }),
              !Zt.length && /* @__PURE__ */ g.jsx(g.Fragment, { children: /* @__PURE__ */ g.jsx(IC, {}) }),
              !K && ef(Zt).length > 0 && /* @__PURE__ */ g.jsx(nf, { shapes: ef(Zt).map((p) => p.recipe), onChange: yc }),
              K && /* @__PURE__ */ g.jsxs(
                "div",
                {
                  className: "gl-layout-inspector",
                  "aria-label": x("Selected layout item"),
                  children: [
                    /* @__PURE__ */ g.jsx("strong", { children: x("Selected") }),
                    /* @__PURE__ */ g.jsx(
                      os,
                      {
                        styles: bn.map((p) => Mn(H, p.recipe, P)),
                        showTitle: bn.some(vo),
                        texts: cc,
                        onChange: mo,
                        onTextChange: uc
                      }
                    ),
                    K.recipe.kind !== "shape" && /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
                      /* @__PURE__ */ g.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: K.showFrame === !0,
                          onChange: (p) => yt((w) => {
                            const T = w.items.find(
                              (z) => z.id === K.id
                            );
                            T && (T.showFrame = p.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ur([K.id]), title: x("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: x("Duplicate") }),
                      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => En([K.id], "front"), title: x("Draw this item over every other"), children: x("Bring to front") }),
                      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => En([K.id], "back"), title: x("Draw this item under every other"), children: x("Send to back") }),
                      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ya([K.id]), title: x("Remove this item from the page (Delete)"), children: x("Remove") })
                    ] }),
                    /* @__PURE__ */ g.jsx(of, { items: [K], onTurn: (p) => yt((w) => {
                      ns(w, [K.id], p);
                    }) }),
                    /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: x("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ g.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: K.locked === !0,
                          onChange: (p) => Xa([K.id], p.target.checked)
                        }
                      ),
                      x("Locked")
                    ] }),
                    /* @__PURE__ */ g.jsx(
                      Tw,
                      {
                        item: K,
                        prefs: X,
                        ratioLocked: aa(K.recipe),
                        origin: ps(H.page, K.x + K.width / 2, K.y + K.height / 2),
                        onCommit: (p) => yt((w) => {
                          const T = w.items.find(
                            (G) => G.id === K.id
                          );
                          if (!T) return;
                          const { zoom: z } = is(T, p.width ?? T.width, p.height ?? T.height);
                          Object.assign(T, p), z === void 0 ? delete T.zoom : T.zoom = z;
                        })
                      }
                    ),
                    /* @__PURE__ */ g.jsx(Yd, { items: [K], onReset: () => yt((p) => $d(p, [K.id])) }),
                    /* @__PURE__ */ g.jsx(Uw, { source: Pg }),
                    K.recipe.kind === "text" && K.recipe.legendGenerated && /* @__PURE__ */ g.jsx(
                      Qw,
                      {
                        date: K.recipe.legendGenerated,
                        onRegenerate: () => {
                          const p = qd(Gt.items.filter((w) => w.templateId !== K.id), qn, 0, void 0, bc());
                          Dt((w) => w.kind === "text" && p ? { ...w, text: p.recipe.text, legendGenerated: og() } : w);
                        }
                      }
                    ),
                    xe(K) ? /* @__PURE__ */ g.jsx(r0, { owner: ((p) => p ? Ye(p, jt) : "")(H.items.find(({ id: p }) => p === K.recipe.letterFor)), style: _r(H), onChange: (p) => yt((w) => Ru(w, p)) }) : K.recipe.kind === "text" ? /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Text"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            value: K.recipe.rich ? Lf(K.recipe) : K.recipe.text,
                            readOnly: K.recipe.rich,
                            onChange: (p) => Dt(
                              (w) => w.kind === "text" ? { ...w, text: p.target.value } : w
                            )
                          }
                        )
                      ] }),
                      K.recipe.rich && /* @__PURE__ */ g.jsx(hC, {}),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Reads from"),
                        /* @__PURE__ */ g.jsxs(
                          "select",
                          {
                            "aria-label": x("Reads from"),
                            value: K.recipe.readsFrom ?? "",
                            onChange: (p) => Dt((w) => {
                              if (w.kind !== "text") return w;
                              const T = { ...w };
                              return p.target.value ? T.readsFrom = p.target.value : delete T.readsFrom, T;
                            }),
                            children: [
                              /* @__PURE__ */ g.jsx("option", { value: "", children: x("Nothing: plain text") }),
                              H.items.filter((p) => p.recipe.kind !== "text").map((p) => /* @__PURE__ */ g.jsx("option", { value: p.id, children: Ye(p, jt) }, p.id))
                            ]
                          }
                        )
                      ] }),
                      K.recipe.readsFrom && /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: Ro }) })
                    ] }) : K.recipe.kind === "figure" ? /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                      /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ g.jsx(
                        mw,
                        {
                          recipe: K.recipe,
                          files: a,
                          state: h,
                          columnLevels: c,
                          onChange: (p) => Dt((w) => w.kind === "figure" ? { ...w, page: p } : w)
                        }
                      ),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        x("Title"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            placeholder: Ye(K, jt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => Dt((w) => w.kind === "figure" ? { ...w, title: p.target.value } : w)
                          }
                        )
                      ] }),
                      S && /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: x("Load this figure into the Illustration tab"),
                          onClick: () => S(structuredClone(K.recipe.illustration)),
                          children: x("Edit in Illustration")
                        }
                      ),
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !(b != null && b.figure),
                          title: x("Take the Illustration tab's current figure in place of this one"),
                          onClick: () => Dt(
                            (p) => p.kind === "figure" && b ? { ...p, illustration: structuredClone(b) } : p
                          ),
                          children: x("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : K.recipe.kind === "shape" ? /* @__PURE__ */ g.jsx(nf, { shapes: [K.recipe], onChange: yc }) : K.recipe.kind === "image" ? /* @__PURE__ */ g.jsx(JS, { recipe: K.recipe, onReplace: (p) => $g(p, K.id) }) : K.recipe.kind === "cellpanel" ? /* @__PURE__ */ g.jsx(
                      j1,
                      {
                        recipe: K.recipe,
                        onChange: (p) => Dt((w) => w.kind === "cellpanel" ? p : w)
                      }
                    ) : K.recipe.kind === "imagewall" ? /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                      /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("The cells as the Images tab showed them when the wall was added; their images are drawn from the file's waveform file.") }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        x("Title"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            placeholder: K.recipe.populationName,
                            value: K.recipe.title ?? "",
                            onChange: (p) => Dt((w) => w.kind === "imagewall" ? { ...w, title: p.target.value } : w)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Tile size"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "number",
                            min: 16,
                            max: 200,
                            value: K.recipe.tile,
                            onChange: (p) => Dt((w) => w.kind === "imagewall" ? { ...w, tile: Math.max(16, Math.min(200, Math.round(Number(p.target.value) || 56))) } : w)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Columns"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "number",
                            min: 1,
                            max: 24,
                            value: K.recipe.columns,
                            onChange: (p) => Dt((w) => w.kind === "imagewall" ? { ...w, columns: Math.max(1, Math.min(24, Math.round(Number(p.target.value) || 8))) } : w)
                          }
                        )
                      ] })
                    ] }) : K.recipe.kind === "proportions" ? /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                      /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ g.jsx(
                        Jv,
                        {
                          recipe: (Vt == null ? void 0 : Vt.recipe.kind) === "proportions" ? Vt.recipe : K.recipe,
                          samples: a,
                          state: h,
                          metadataById: tn,
                          divisionProfiles: k,
                          dataRevision: D
                        }
                      ),
                      /* @__PURE__ */ g.jsx(
                        yw,
                        {
                          recipe: K.recipe,
                          samples: a,
                          state: h,
                          metadataById: tn,
                          divisionProfiles: k,
                          dataRevision: D,
                          metadataLevels: c,
                          onChange: (p) => Dt((w) => {
                            if (w.kind !== "proportions") return w;
                            const { panel: T, ...z } = w;
                            return p ? { ...z, panel: p } : z;
                          })
                        }
                      ),
                      K.recipe.panel && ct.mode !== "off" && ct.mode !== "populations" && /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: ct.mode === "metadata" ? x("Drawn once per value of {column}, from that value's files; unticked, it shows its own files on every page", { column: ct.column ?? "" }) : x("Drawn once per file of the iteration, from that file; unticked, it shows its own files on every page"), children: [
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.iterated === !0,
                            onChange: (p) => Dt((w) => w.kind === "proportions" ? { ...w, iterated: p.target.checked } : w)
                          }
                        ),
                        x("Follows the iteration")
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: x("The sheet's style: drawn at the frame's size with the sheet's tick, axis, title and legend sizes. The chart's own: its Plotting sizes, scaled to fit the frame."), children: [
                        x("Text size"),
                        /* @__PURE__ */ g.jsxs(
                          "select",
                          {
                            value: K.recipe.textSize === "sheet" ? "sheet" : "chart",
                            onChange: (p) => Dt((w) => w.kind === "proportions" ? { ...w, textSize: p.target.value === "sheet" ? "sheet" : "chart" } : w),
                            children: [
                              /* @__PURE__ */ g.jsx("option", { value: "sheet", children: x("sheet style") }),
                              /* @__PURE__ */ g.jsx("option", { value: "chart", children: x("chart's own (scaled)") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        x("Title"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            placeholder: Ye(K, jt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => Dt((w) => w.kind === "proportions" ? { ...w, title: p.target.value } : w)
                          }
                        )
                      ] }),
                      E && /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: x("Open this chart's settings in the Plotting tab as a new chart"),
                          onClick: () => {
                            var p;
                            return E(structuredClone(K.recipe.settings), ((p = K.name) == null ? void 0 : p.trim()) || Ye(K, jt));
                          },
                          children: x("Edit in Plotting")
                        }
                      ),
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !C,
                          title: x("Take the Plotting tab's current chart in place of this one"),
                          onClick: () => {
                            const p = C == null ? void 0 : C();
                            p && Dt((w) => w.kind === "proportions" ? { ...w, settings: p } : w);
                          },
                          children: x("Replace with the current Plotting chart")
                        }
                      )
                    ] }) : K.recipe.kind === "chart" ? /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Population"),
                        /* @__PURE__ */ g.jsx(
                          "select",
                          {
                            value: K.recipe.populationId,
                            onChange: (p) => Dt((w) => w.kind === "chart" ? { ...w, populationId: p.target.value } : w),
                            children: jo.map(({ popId: p, depth: w }) => {
                              var T;
                              return /* @__PURE__ */ g.jsxs("option", { value: p, children: [
                                " ".repeat(w * 2),
                                ((T = Wt == null ? void 0 : Wt.tree.populations[p]) == null ? void 0 : T.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Statistic"),
                        /* @__PURE__ */ g.jsxs(
                          "select",
                          {
                            value: K.recipe.statistic,
                            onChange: (p) => Dt((w) => {
                              var G;
                              if (w.kind !== "chart") return w;
                              const T = p.target.value, z = T === "median" && !w.channel ? (G = Wt == null ? void 0 : Wt.sample.channels[0]) == null ? void 0 : G.key : w.channel;
                              return { ...w, statistic: T, ...z ? { channel: z } : {} };
                            }),
                            children: [
                              /* @__PURE__ */ g.jsx("option", { value: "percent_of_parent", children: x("% of parent") }),
                              /* @__PURE__ */ g.jsx("option", { value: "percent_of_total", children: x("% of total") }),
                              /* @__PURE__ */ g.jsx("option", { value: "count", children: x("Events") }),
                              /* @__PURE__ */ g.jsx("option", { value: "median", children: x("Median of a channel") })
                            ]
                          }
                        )
                      ] }),
                      K.recipe.statistic === "median" && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Channel"),
                        /* @__PURE__ */ g.jsx(
                          "select",
                          {
                            value: K.recipe.channel ?? "",
                            onChange: (p) => Dt((w) => w.kind === "chart" ? { ...w, channel: p.target.value } : w),
                            children: ((Wt == null ? void 0 : Wt.sample.channels) ?? []).map((p) => /* @__PURE__ */ g.jsx("option", { value: p.key, children: (Wt == null ? void 0 : Wt.sample.labelForKey(p.key)) ?? p.key }, p.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Files"),
                        /* @__PURE__ */ g.jsxs(
                          "select",
                          {
                            value: K.recipe.files,
                            onChange: (p) => Dt((w) => w.kind === "chart" ? { ...w, files: p.target.value === "all" ? "all" : "checked" } : w),
                            children: [
                              /* @__PURE__ */ g.jsx("option", { value: "checked", children: x("Checked files") }),
                              /* @__PURE__ */ g.jsx("option", { value: "all", children: x("All files") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Group by"),
                        /* @__PURE__ */ g.jsxs(
                          "select",
                          {
                            value: K.recipe.groupBy,
                            onChange: (p) => Dt((w) => w.kind === "chart" ? { ...w, groupBy: p.target.value } : w),
                            children: [
                              /* @__PURE__ */ g.jsx("option", { value: "", children: x("Each file") }),
                              l.map((p) => /* @__PURE__ */ g.jsx("option", { value: p, children: p }, p))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Chart"),
                        /* @__PURE__ */ g.jsxs(
                          "select",
                          {
                            value: K.recipe.chartType,
                            onChange: (p) => Dt((w) => w.kind === "chart" ? { ...w, chartType: p.target.value } : w),
                            children: [
                              /* @__PURE__ */ g.jsx("option", { value: "bars", children: x("Bars (mean ± SD)") }),
                              /* @__PURE__ */ g.jsx("option", { value: "dots", children: x("Points with the mean") }),
                              /* @__PURE__ */ g.jsx("option", { value: "box", children: x("Boxes (median, quartiles)") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.showPoints,
                            onChange: (p) => Dt((w) => w.kind === "chart" ? { ...w, showPoints: p.target.checked } : w)
                          }
                        ),
                        x("Show each file as a point")
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: x("Wilcoxon rank-sum between two groups, Kruskal–Wallis among more; every group needs two files"), children: [
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.test,
                            onChange: (p) => Dt((w) => w.kind === "chart" ? { ...w, test: p.target.checked } : w)
                          }
                        ),
                        x("Test between groups")
                      ] }),
                      $e && ($e.missing.length > 0 || $e.noChannel.length > 0) && /* @__PURE__ */ g.jsxs("p", { className: "gl-hint gl-layout-warning", children: [
                        $e.missing.length > 0 && x("No point for {files}: the population is not on these files.", { files: $e.missing.join(", ") }),
                        $e.missing.length > 0 && $e.noChannel.length > 0 && " ",
                        $e.noChannel.length > 0 && x("No point for {files}: the channel is not on these files.", { files: $e.noChannel.join(", ") })
                      ] }),
                      ($e == null ? void 0 : $e.unassigned) && /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x(K.recipe.test ? "Files without a value in the column are drawn as Unassigned and left out of the test." : "Files without a value in the column are drawn as Unassigned.") }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        x("Title"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            placeholder: Ye(K, jt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => Dt((w) => w.kind === "chart" ? { ...w, title: p.target.value } : w)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !Wt,
                          title: x("Replace this chart with a Plotting chart of the same files, population, statistic, grouping, plot type and test, in the same frame"),
                          onClick: () => {
                            const p = Wt;
                            p && Dt(
                              (w) => w.kind === "chart" ? eg(w, p.tree, { all: a.map((T) => T.id), checked: i }, mc(w)) : w
                            );
                          },
                          children: x("Convert to a Plotting chart")
                        }
                      )
                    ] }) : /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                      !xa(K.recipe) && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("FCS"),
                        /* @__PURE__ */ g.jsx(
                          "select",
                          {
                            value: K.recipe.sampleId,
                            onChange: (p) => Dt((w) => {
                              if (w.kind === "text" || w.kind === "figure" || w.kind === "proportions" || w.kind === "imagewall" || w.kind === "cellpanel" || w.kind === "shape" || w.kind === "image") return w;
                              const T = jt.find(
                                (G) => G.id === p.target.value
                              );
                              if (!T) return w;
                              const z = Wt && ki(
                                {
                                  hierarchyId: Wt.tree.id,
                                  populationId: w.populationId
                                },
                                T.tree,
                                Gn(h)
                              );
                              return {
                                ...w,
                                sampleId: T.id,
                                populationId: (z == null ? void 0 : z.id) ?? T.tree.root_population_id ?? ""
                              };
                            }),
                            children: jt.map((p) => /* @__PURE__ */ g.jsx("option", { value: p.id, children: p.name }, p.id))
                          }
                        )
                      ] }),
                      (K.recipe.kind === "biplot" || K.recipe.kind === "histogram") && /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: x("Draw the events of several files on this plot, as the Gating tab pools the checked files; a gate is drawn where every pooled file has it alike, with the pooled percentage"), children: [
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: !!K.recipe.pool,
                            onChange: (p) => {
                              if (!p.target.checked) {
                                So(null);
                                return;
                              }
                              const w = K.recipe.kind === "biplot" || K.recipe.kind === "histogram" ? K.recipe.sampleId : "";
                              So(i.includes(w) ? i : [w]);
                            }
                          }
                        ),
                        x("Pool files")
                      ] }),
                      (K.recipe.kind === "biplot" || K.recipe.kind === "histogram") && K.recipe.pool && /* @__PURE__ */ g.jsx(
                        BC,
                        {
                          files: a,
                          pool: K.recipe.pool.sampleIds,
                          checkedSampleIds: i,
                          groups: o,
                          fileGroups: s,
                          report: Xg,
                          onChange: So
                        }
                      ),
                      (K.recipe.kind === "biplot" || K.recipe.kind === "histogram") && Wt && (((Gc = K.recipe.populationIds) == null ? void 0 : Gc.length) ?? 0) > 1 ? (
                        // An overlay is edited as its populations; down to one, it is a plot of that one.
                        /* @__PURE__ */ g.jsx(
                          GC,
                          {
                            populations: jo,
                            tree: Wt.tree,
                            chosen: new Set((K.recipe.populationIds ?? []).map((p) => ln(p, Wt.tree, Se).id)),
                            onChange: (p) => Dt((w) => {
                              if (w.kind !== "biplot" && w.kind !== "histogram") return w;
                              if (p.length > 1) return { ...w, populationId: p[0], populationIds: p };
                              const { populationIds: T, ...z } = w;
                              return { ...z, populationId: p[0] };
                            })
                          }
                        )
                      ) : /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Population"),
                        /* @__PURE__ */ g.jsx(
                          "select",
                          {
                            value: K.recipe.populationId,
                            onChange: (p) => Dt(
                              (w) => w.kind === "text" ? w : {
                                ...w,
                                populationId: p.target.value
                              }
                            ),
                            children: jo.map(({ popId: p, depth: w }) => {
                              var T;
                              return /* @__PURE__ */ g.jsxs("option", { value: p, children: [
                                " ".repeat(w * 2),
                                ((T = Wt == null ? void 0 : Wt.tree.populations[p]) == null ? void 0 : T.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      K.recipe.kind !== "strategy" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ g.jsx(
                            cu,
                            {
                              label: x("X channel"),
                              value: K.recipe.xChannel,
                              options: Lc,
                              onChange: (p) => Dt(
                                (w) => w.kind === "biplot" || w.kind === "histogram" ? { ...w, xChannel: p } : w
                              )
                            }
                          )
                        ] }),
                        K.recipe.kind === "biplot" && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ g.jsx(
                            cu,
                            {
                              label: x("Y channel"),
                              value: K.recipe.yChannel ?? "",
                              options: Lc,
                              onChange: (p) => Dt(
                                (w) => w.kind === "biplot" ? { ...w, yChannel: p } : w
                              )
                            }
                          )
                        ] })
                      ] }),
                      K.recipe.kind === "strategy" && (($c = K.recipe.populationIds) == null ? void 0 : $c.length) && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                        /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("{count} populations; the grid follows the live gates", { count: K.recipe.populationIds.length }) }),
                        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: x("Tree: a column per depth and a row per leaf. Wrapped: the tree walked depth first and wrapped into rows of the columns beside."), children: [
                          x("Layout"),
                          /* @__PURE__ */ g.jsxs(
                            "select",
                            {
                              value: K.recipe.layout ?? "tree",
                              onChange: (p) => Dt((w) => w.kind === "strategy" ? { ...w, layout: p.target.value === "flow" ? "flow" : "tree" } : w),
                              children: [
                                /* @__PURE__ */ g.jsx("option", { value: "tree", children: x("Tree") }),
                                /* @__PURE__ */ g.jsx("option", { value: "flow", children: x("Wrapped") })
                              ]
                            }
                          )
                        ] }),
                        (K.recipe.layout ?? "tree") === "flow" && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                          x("Columns"),
                          /* @__PURE__ */ g.jsx(le, { min: 1, max: 24, integer: !0, value: K.recipe.columns ?? 4, onCommit: (p) => Dt((w) => w.kind === "strategy" ? { ...w, columns: p } : w) })
                        ] }),
                        /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: x("An arrow from each gate to the panel of the population it makes, through the gutters"), children: [
                          /* @__PURE__ */ g.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: K.recipe.showArrows !== !1,
                              onChange: (p) => Dt((w) => w.kind === "strategy" ? { ...w, showArrows: p.target.checked } : w)
                            }
                          ),
                          x("Arrows")
                        ] }),
                        K.recipe.showArrows !== !1 && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                          /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: x("The arrows' colour; unticked, each takes its gate's"), children: [
                            /* @__PURE__ */ g.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: !!K.recipe.arrowColor,
                                onChange: (p) => Dt((w) => w.kind === "strategy" ? { ...w, arrowColor: p.target.checked ? "#444444" : void 0 } : w)
                              }
                            ),
                            x("One colour"),
                            K.recipe.arrowColor && /* @__PURE__ */ g.jsx(
                              "input",
                              {
                                type: "color",
                                value: K.recipe.arrowColor,
                                onChange: (p) => Dt((w) => w.kind === "strategy" ? { ...w, arrowColor: p.target.value } : w)
                              }
                            )
                          ] }),
                          /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: x("Where an arrow leaves its panel: level with the gate's label, or with the centre of the gate itself"), children: [
                            x("Arrows from"),
                            /* @__PURE__ */ g.jsxs(
                              "select",
                              {
                                value: K.recipe.arrowAnchor ?? "label",
                                onChange: (p) => Dt((w) => w.kind === "strategy" ? { ...w, arrowAnchor: p.target.value === "gate" ? "gate" : void 0 } : w),
                                children: [
                                  /* @__PURE__ */ g.jsx("option", { value: "label", children: x("Gate label") }),
                                  /* @__PURE__ */ g.jsx("option", { value: "gate", children: x("Gate centre") })
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                            x("Arrow width"),
                            /* @__PURE__ */ g.jsx(le, { min: 0.5, max: 6, step: 0.25, value: K.recipe.arrowWidth ?? 1.5, onCommit: (p) => Dt((w) => w.kind === "strategy" ? { ...w, arrowWidth: p } : w) })
                          ] })
                        ] })
                      ] }),
                      K.recipe.kind === "strategy" && !((Wc = K.recipe.populationIds) != null && Wc.length) && /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.fullPath,
                            onChange: (p) => Dt(
                              (w) => w.kind === "strategy" ? {
                                ...w,
                                fullPath: p.target.checked
                              } : w
                            )
                          }
                        ),
                        x("Full path from root")
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Display"),
                        /* @__PURE__ */ g.jsxs(
                          "select",
                          {
                            value: K.recipe.displayMode,
                            onChange: (p) => Dt(
                              (w) => w.kind === "text" ? w : {
                                ...w,
                                displayMode: p.target.value
                              }
                            ),
                            children: [
                              /* @__PURE__ */ g.jsx("option", { value: "pseudocolor", children: x("Pseudocolor") }),
                              /* @__PURE__ */ g.jsx("option", { value: "scatter", children: x("Scatter") }),
                              /* @__PURE__ */ g.jsx("option", { value: "contour", children: x("Contour") })
                            ]
                          }
                        )
                      ] }),
                      ct.mode !== "off" && /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: ct.mode === "populations" ? x("Drawn once per population of the iteration, for that population; unticked, it shows its own population on every page") : ct.mode === "metadata" ? x("Drawn once per value of {column}, pooling that value's files; unticked, it shows its own files on every page", { column: ct.column ?? "" }) : x("Drawn once per file of the iteration, for that file; unticked, it shows this file on every page"), children: [
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.iterated === !0,
                            onChange: (p) => Dt(
                              (w) => w.kind === "text" ? w : { ...w, iterated: p.target.checked }
                            )
                          }
                        ),
                        x("Follows the iteration")
                      ] }),
                      Ec && /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: Ec }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: x("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: Ro }), children: [
                        x("Title"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            placeholder: Og || Ye(K, jt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => Dt(
                              (w) => w.kind === "text" || w.kind === "shape" || w.kind === "image" ? w : { ...w, title: p.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ g.jsxs(ba, { children: [
                          x("Style"),
                          Object.keys(K.recipe.style ?? {}).length > 0 ? ` · ${x("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ g.jsx(
                          ss,
                          {
                            effective: Mn(H, K.recipe, P),
                            own: K.recipe.style ?? {},
                            omit: gf,
                            onChange: (p) => Dt(
                              (w) => te(w) ? { ...w, style: No({ ...w.style, ...p }) } : w
                            )
                          }
                        ),
                        Object.keys(K.recipe.style ?? {}).length > 0 && /* @__PURE__ */ g.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: x("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => Dt((p) => {
                              if (!te(p)) return p;
                              const { style: w, ...T } = p;
                              return T;
                            }),
                            children: x("Follow the sheet")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => R(
                            K.recipe
                          ),
                          children: x("Open in Gating")
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            Tt === "page" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
              /* @__PURE__ */ g.jsx("h3", { children: x("Page") }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Size"),
                /* @__PURE__ */ g.jsxs(
                  "select",
                  {
                    value: H.page.preset,
                    onChange: (p) => Jn(tm(p.target.value, H.page.orientation, H.page)),
                    children: [
                      Object.entries(Qv).map(([p, w]) => /* @__PURE__ */ g.jsx("option", { value: p, children: w.label }, p)),
                      /* @__PURE__ */ g.jsx("option", { value: "custom", children: x("Custom") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Orientation"),
                /* @__PURE__ */ g.jsxs(
                  "select",
                  {
                    value: H.page.orientation,
                    onChange: (p) => Jn({ ...H.page, orientation: p.target.value }),
                    children: [
                      /* @__PURE__ */ g.jsx("option", { value: "portrait", children: x("Portrait") }),
                      /* @__PURE__ */ g.jsx("option", { value: "landscape", children: x("Landscape") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsx("div", { className: "gl-layout-dimensions", children: ["width", "height"].map((p) => /* @__PURE__ */ g.jsxs("label", { children: [
                x(p === "width" ? "Width (mm)" : "Height (mm)"),
                /* @__PURE__ */ g.jsx(
                  le,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": x(p === "width" ? "Width (mm)" : "Height (mm)"),
                    value: bf(H.page)[p === "width" ? "widthMm" : "heightMm"],
                    onCommit: (w) => {
                      const T = H.page.orientation === "landscape", z = p === "width" == !T ? "widthMm" : "heightMm";
                      Jn({ ...H.page, preset: "custom", [z]: w });
                    }
                  }
                )
              ] }, p)) }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Margin (mm)"),
                /* @__PURE__ */ g.jsx(
                  le,
                  {
                    min: 0,
                    max: em(H.page),
                    step: 1,
                    value: H.page.marginMm,
                    onCommit: (p) => Jn({ ...H.page, marginMm: p })
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ g.jsxs("label", { children: [
                  x("Pages across"),
                  /* @__PURE__ */ g.jsx(le, { min: 1, max: uu, step: 1, integer: !0, "aria-label": x("Pages across"), value: H.page.columns, onCommit: (p) => Jn({ ...H.page, columns: p }) })
                ] }),
                /* @__PURE__ */ g.jsxs("label", { children: [
                  x("Pages down"),
                  /* @__PURE__ */ g.jsx(le, { min: 1, max: uu, step: 1, integer: !0, "aria-label": x("Pages down"), value: H.page.rows, onCommit: (p) => Jn({ ...H.page, rows: p }) })
                ] })
              ] }),
              gr > 0 && /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-export-warning", role: "alert", children: [
                /* @__PURE__ */ g.jsx("span", { children: gr === 1 ? x("1 item lies partly or wholly outside the sheet's pages. An export writes the pages only, so it would be cut off or left out.") : x("{count} items lie partly or wholly outside the sheet's pages. An export writes the pages only, so they would be cut off or left out.", { count: gr }) }),
                /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => yt(Cu), title: x("Add rows and columns of pages until every item is on one; no item moves"), children: x("Add pages to hold them") })
              ] }),
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Qg, disabled: !H.items.length, title: x("Make the page a custom size that holds every item inside the margin, as one page"), children: x("Fit page to content") }),
                /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: tv, disabled: !H.items.length, title: zt.length ? x("Scale and centre the selected items to fill the page they are on, inside its margin; items selected on several pages are each fitted to their own page") : x("Scale and centre the items on each page to fill that page inside its margin; select items to fit those alone"), children: zt.length ? x("Fit selection to page") : x("Fit content to page") }),
                /* @__PURE__ */ g.jsx(BS, { count: ((Yc = H.guides) == null ? void 0 : Yc.length) ?? 0, onClear: () => yt(RS) })
              ] })
            ] }),
            Tt === "export" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
              /* @__PURE__ */ g.jsx("h3", { children: x("Export") }),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: H.page.columns * H.page.rows === 1 ? x("This sheet is one page.") : x("This sheet is {count} pages: {columns} across and {rows} down.", { count: H.page.columns * H.page.rows, columns: H.page.columns, rows: H.page.rows }) }),
              gr > 0 && /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-export-warning", role: "alert", children: [
                /* @__PURE__ */ g.jsx("span", { children: gr === 1 ? x("1 item lies partly or wholly outside the sheet's pages. An export writes the pages only, so it would be cut off or left out.") : x("{count} items lie partly or wholly outside the sheet's pages. An export writes the pages only, so they would be cut off or left out.", { count: gr }) }),
                /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => yt(Cu), title: x("Add rows and columns of pages until every item is on one; no item moves"), children: x("Add pages to hold them") })
              ] }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Format"),
                /* @__PURE__ */ g.jsxs("select", { value: Qt, onChange: (p) => ye(p.target.value), children: [
                  /* @__PURE__ */ g.jsx("option", { value: "pdf", children: x("PDF · the page at its size") }),
                  /* @__PURE__ */ g.jsx("option", { value: "svg", children: x("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ g.jsx("option", { value: "png", children: x("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Resolution (dpi)"),
                /* @__PURE__ */ g.jsx(
                  le,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: H.page.dpi,
                    onCommit: (p) => Jn({ ...H.page, dpi: p })
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("As one image (a PNG, or a PDF page the writer cannot take as vector art), a page of this size can be drawn at {dpi} dpi at most; a higher resolution is lowered to it.", { dpi: al(Ln(H.page).width, Ln(H.page).height) }) }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: be, onChange: (p) => fn(p.target.checked) }),
                x("Crop to content")
              ] }),
              be && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Padding (mm)"),
                /* @__PURE__ */ g.jsx(le, { min: 0, max: 50, step: 0.5, "aria-label": x("Padding (mm)"), value: Je, onCommit: pn })
              ] }),
              /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void zc(), disabled: he || !H.items.length, children: x(he ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void Za.exportAll(), disabled: he || !Za.canExport, title: x("Write every sheet that has items: as PDF one file with each sheet's pages in sheet order; as SVG or PNG one zip with a folder per sheet"), children: Za.progress ? x("Sheet {n} of {count}", Za.progress) : x("Export all sheets") }),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x(be ? "The export is cut down to the items on each page plus the padding, so a figure comes out without the paper around it; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above." : "The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            Tt === "iterate" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
              /* @__PURE__ */ g.jsx("h3", { children: x("Iterate") }),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("Iteration is being retired from Layout. Pages per file or group are now made in Illustration or Plotting and sent here with “Every page, one sheet each”. This sheet keeps working as it is.") }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Draw the sheet"),
                /* @__PURE__ */ g.jsxs(
                  "select",
                  {
                    value: ct.mode,
                    onChange: (p) => {
                      const w = p.target.value;
                      if (w === "metadata") {
                        const T = ct.column && l.includes(ct.column) ? ct.column : l[0] ?? "";
                        gn({ ...ct, mode: "metadata", column: T, source: ct.source.kind === "metadata" ? { kind: "checked" } : ct.source });
                        return;
                      }
                      gn({ ...ct, mode: w === "files" ? "files" : w === "populations" ? "populations" : "off" });
                    },
                    children: [
                      /* @__PURE__ */ g.jsx("option", { value: "off", children: x("Once") }),
                      /* @__PURE__ */ g.jsx("option", { value: "files", children: x("Once per file") }),
                      /* @__PURE__ */ g.jsx("option", { value: "populations", children: x("Once per population") }),
                      /* @__PURE__ */ g.jsx("option", { value: "metadata", disabled: !l.length, children: x("Once per value of a metadata column") })
                    ]
                  }
                )
              ] }),
              ct.mode === "metadata" && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Column"),
                /* @__PURE__ */ g.jsx("select", { value: ct.column ?? "", onChange: (p) => gn({ ...ct, column: p.target.value }), children: l.map((p) => /* @__PURE__ */ g.jsx("option", { value: p, children: p }, p)) })
              ] }),
              ct.mode !== "off" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                ct.mode === "populations" && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                  x("Populations"),
                  /* @__PURE__ */ g.jsxs(
                    "select",
                    {
                      value: ((Hc = ct.populations) == null ? void 0 : Hc.kind) === "branch" ? ct.populations.populationId : "all",
                      onChange: (p) => gn({
                        ...ct,
                        populations: p.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: p.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ g.jsx("option", { value: "all", children: x("All in the tree") }),
                        (ve ? ta(ve.tree.populations, ve.tree.root_population_id ?? "") : []).filter(({ popId: p }) => p !== (ve == null ? void 0 : ve.tree.root_population_id)).map(({ popId: p, depth: w }) => {
                          var T;
                          return /* @__PURE__ */ g.jsxs("option", { value: p, children: [
                            " ".repeat(w * 2),
                            x("Under {name}", { name: ((T = ve == null ? void 0 : ve.tree.populations[p]) == null ? void 0 : T.name) ?? p })
                          ] }, p);
                        })
                      ]
                    }
                  )
                ] }),
                (ct.mode === "files" || ct.mode === "metadata") && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                  x("Files"),
                  /* @__PURE__ */ g.jsxs("select", { value: av, onChange: (p) => gn({ ...ct, source: iv(p.target.value) }), children: [
                    /* @__PURE__ */ g.jsx("option", { value: "checked", children: x("Checked files") }),
                    /* @__PURE__ */ g.jsx("option", { value: "all", children: x("All files") }),
                    o.map((p) => /* @__PURE__ */ g.jsx("option", { value: `group:${p.id}`, children: x("Group {name}", { name: p.name }) }, p.id)),
                    ct.mode === "files" && l.flatMap(
                      (p) => rv(p).map((w) => /* @__PURE__ */ g.jsxs("option", { value: `meta:${p}=${w}`, children: [
                        p,
                        " = ",
                        w
                      ] }, `${p}=${w}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                  x("Arrangement"),
                  /* @__PURE__ */ g.jsxs(
                    "select",
                    {
                      value: ct.arrangement.kind,
                      onChange: (p) => gn({
                        ...ct,
                        // Tiles start at as many as fit the paper, so none is cut off by default.
                        arrangement: p.target.value === "tiles" ? { kind: "tiles", ...Pu(H, 24), order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ g.jsx("option", { value: "page-per-unit", children: ct.mode === "populations" ? x("One page per population") : ct.mode === "metadata" ? x("One page per value") : x("One page per file") }),
                        /* @__PURE__ */ g.jsx("option", { value: "tiles", children: x("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                ct.arrangement.kind === "tiles" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                  /* @__PURE__ */ g.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((p) => /* @__PURE__ */ g.jsxs("label", { children: [
                    x(p === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ g.jsx(
                      le,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": x(p === "columns" ? "Tiles across" : "Tiles down"),
                        value: ct.arrangement.kind === "tiles" ? ct.arrangement[p] : 1,
                        onCommit: (w) => {
                          ct.arrangement.kind === "tiles" && gn({ ...ct, arrangement: { ...ct.arrangement, [p]: w } });
                        }
                      }
                    )
                  ] }, p)) }),
                  /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                    x("Order"),
                    /* @__PURE__ */ g.jsxs(
                      "select",
                      {
                        value: ct.arrangement.order,
                        onChange: (p) => ct.arrangement.kind === "tiles" && gn({ ...ct, arrangement: { ...ct.arrangement, order: p.target.value === "column-major" ? "column-major" : "row-major" } }),
                        children: [
                          /* @__PURE__ */ g.jsx("option", { value: "row-major", children: x("Across, then down") }),
                          /* @__PURE__ */ g.jsx("option", { value: "column-major", children: x("Down, then across") })
                        ]
                      }
                    )
                  ] }),
                  (() => {
                    const p = d0(Gt.items, H);
                    if (!p || ct.arrangement.kind !== "tiles") return null;
                    const w = Pu(H, ct.arrangement.gap);
                    return /* @__PURE__ */ g.jsxs("p", { className: "gl-hint gl-layout-warning", role: "status", children: [
                      x("{n} of {m} items on this page reach beyond the paper; the export cuts them off. {across} across × {down} down fit.", { n: p, m: Gt.items.length, across: w.columns, down: w.rows }),
                      " ",
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => ct.arrangement.kind === "tiles" && gn({ ...ct, arrangement: { ...ct.arrangement, ...w } }),
                          children: x("Fit the tiles to the page")
                        }
                      )
                    ] });
                  })(),
                  /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                    x("Gap between tiles (px)"),
                    /* @__PURE__ */ g.jsx(
                      le,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: ct.arrangement.gap,
                        onCommit: (p) => {
                          ct.arrangement.kind === "tiles" && gn({ ...ct, arrangement: { ...ct.arrangement, gap: p } });
                        }
                      }
                    )
                  ] })
                ] }),
                Ge.length === 0 && /* @__PURE__ */ g.jsx("p", { className: "gl-hint gl-layout-warning", role: "status", children: ct.mode === "populations" ? x("No populations to draw: the file has none under this choice. The sheet is shown once, with its placeholders unfilled.") : x("No files to draw: the source names none (are any files checked in the Samples pane?). The sheet is shown once, with its placeholders unfilled.") }),
                /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: ct.mode === "populations" ? x("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: Ge.length, of: (ve == null ? void 0 : ve.name) ?? "the file", pages: Math.max(1, we.length) }) : ct.mode === "metadata" ? x("{values} values of {column} over {files} files → {pages} pages. Items marked “Follows the iteration” pool the files of each value; the others repeat. Text and titles may use {sample} (the value), {meta:column}, {file} (how many files), {n} and {N}; a plot title may also use {population} and {count}.", { values: Ge.length, column: ct.column ?? "", files: Ge.reduce((p, w) => {
                  var T;
                  return p + (((T = w.sampleIds) == null ? void 0 : T.length) ?? 0);
                }, 0), pages: Math.max(1, we.length) }) : x("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: Ge.length, pages: Math.max(1, we.length) }) })
              ] })
            ] }),
            Tt === "style" && H && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
              /* @__PURE__ */ g.jsx("h3", { children: x("Style") }),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Plot titles"),
                /* @__PURE__ */ g.jsxs(
                  "select",
                  {
                    "aria-label": x("Plot titles"),
                    value: ic ? "custom" : ((Xc = ri.find((p) => p.template === (H.titleTemplate ?? ""))) == null ? void 0 : Xc.id) ?? "custom",
                    onChange: (p) => {
                      const w = ri.find((T) => T.id === p.target.value);
                      jg(!w), yt((T) => {
                        var z;
                        w ? w.template ? T.titleTemplate = w.template : delete T.titleTemplate : T.titleTemplate = ((z = T.titleTemplate) == null ? void 0 : z.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      ri.map((p) => /* @__PURE__ */ g.jsx("option", { value: p.id, children: x(p.label) }, p.id)),
                      /* @__PURE__ */ g.jsx("option", { value: "custom", children: x("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const p = H.items.filter((w) => pc(w));
                return p.length ? /* @__PURE__ */ g.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  x("{count} plots keep a title of their own, so the template does not reach them.", { count: p.length }),
                  " ",
                  /* @__PURE__ */ g.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: x("Drop those plots' own titles so every plot on the sheet follows the template"),
                      onClick: () => yt((w) => {
                        for (const T of w.items) te(T.recipe) && delete T.recipe.title;
                      }),
                      children: x("Use the template for all")
                    }
                  )
                ] }) : null;
              })(),
              (ic || !ri.some((p) => p.template === (H.titleTemplate ?? ""))) && (() => {
                var kt;
                const p = H.titleTemplate ?? "", w = nm(p), T = (w == null ? void 0 : w.tokens) ?? [], z = (w == null ? void 0 : w.separator) ?? Ig, G = (lt) => {
                  var Lt;
                  return ((Lt = sc.find((Ce) => Ce.token === lt)) == null ? void 0 : Lt.label) ?? lt;
                }, Y = (lt) => yt((Lt) => {
                  Lt.titleTemplate = vu(lt, z);
                }), U = Gt.items.find((lt) => te(lt.recipe)), rt = U && te(U.recipe) ? Ti(p, Rn(U.recipe, U.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ g.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": x("Title builder"), children: [
                  /* @__PURE__ */ g.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": x("Fields in the title"), children: [
                    T.length === 0 && /* @__PURE__ */ g.jsx("span", { className: "gl-hint", children: x(w === null && p ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    T.map((lt, Lt) => /* @__PURE__ */ g.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": x("Remove {field}", { field: G(lt) }),
                        title: x("Remove {field} from the title", { field: G(lt) }),
                        onClick: () => Y(T.filter((Ce, rn) => rn !== Lt)),
                        children: [
                          G(lt),
                          " ×"
                        ]
                      },
                      `${lt}-${Lt}`
                    ))
                  ] }),
                  /* @__PURE__ */ g.jsx("div", { className: "gl-title-builder-fields", "aria-label": x("Fields to add"), children: sc.map((lt) => /* @__PURE__ */ g.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-chip",
                      "aria-label": x("Add {field}", { field: lt.label }),
                      title: lt.token,
                      onClick: () => Y([...T, lt.token]),
                      children: lt.label
                    },
                    lt.token
                  )) }),
                  /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                    x("Between fields"),
                    /* @__PURE__ */ g.jsx(
                      "select",
                      {
                        "aria-label": x("Separator"),
                        value: ((kt = Po.find((lt) => lt.value === z)) == null ? void 0 : kt.id) ?? "dot",
                        onChange: (lt) => {
                          var Ce;
                          const Lt = ((Ce = Po.find((rn) => rn.id === lt.target.value)) == null ? void 0 : Ce.value) ?? " · ";
                          Rg(Lt), T.length && yt((rn) => {
                            rn.titleTemplate = vu(T, Lt);
                          });
                        },
                        children: Po.map((lt) => /* @__PURE__ */ g.jsx("option", { value: lt.id, children: x(lt.label) }, lt.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                    x("Template"),
                    /* @__PURE__ */ g.jsx(
                      "input",
                      {
                        "aria-label": x("Title template"),
                        value: p,
                        onChange: (lt) => yt((Lt) => {
                          Lt.titleTemplate = lt.target.value;
                        })
                      }
                    )
                  ] }),
                  rt && /* @__PURE__ */ g.jsx("div", { className: "gl-hint gl-title-builder-preview", children: x("First plot reads: {title}", { title: rt }) })
                ] });
              })(),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise; on an iterated sheet it looks across every page, so each page is titled alike and names what it is drawn for.`, { list: Ro }) }),
              /* @__PURE__ */ g.jsx(
                rm,
                {
                  following: H.followFigureStyle === !0,
                  onFollow: (p) => yt((w) => {
                    p ? w.followFigureStyle = !0 : delete w.followFigureStyle;
                  })
                }
              ),
              H.followFigureStyle !== !0 && /* @__PURE__ */ g.jsx(
                os,
                {
                  styles: (() => {
                    const p = H.items.filter((w) => te(w.recipe));
                    return p.length ? p.map((w) => Mn(H, w.recipe, P)) : [Mn(H, null, P)];
                  })(),
                  showTitle: !H.items.some((p) => te(p.recipe)) || H.items.some(vo),
                  onChange: lc
                }
              ),
              /* @__PURE__ */ g.jsx(
                ss,
                {
                  effective: Mn(H, null, P),
                  own: H.style ?? {},
                  omit: H.followFigureStyle === !0 ? YC : po,
                  onChange: lc
                }
              ),
              Object.keys(H.style ?? {}).length > 0 && /* @__PURE__ */ g.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  onClick: () => yt((p) => {
                    delete p.style;
                  }),
                  children: x("Reset to defaults")
                }
              ),
              /* @__PURE__ */ g.jsx(n0, { style: _r(H), onChange: (p) => yt((w) => Ru(w, p)) })
            ] })
          ] }),
          /* @__PURE__ */ g.jsx(am, { menu: zg, onClose: () => Ba(null) }),
          /* @__PURE__ */ g.jsx(Jw, { container: J, describe: (p) => {
            const w = Gt.items.find((T) => T.id === p);
            return w ? qn(w) : null;
          } }),
          !_t && W && /* @__PURE__ */ g.jsx(OS, { scroller: at, page: J, zoom: Ct, pages: H.page, selected: Zt, onAddGuide: (p) => yt((w) => _S(w, p)) }),
          /* @__PURE__ */ g.jsxs(
            "div",
            {
              ref: (p) => {
                Ot.current = p, Q(p);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": x("Layout page"),
              onKeyDown: ov,
              children: [
                !_t && at && /* @__PURE__ */ g.jsx(
                  _1,
                  {
                    ref: tt,
                    container: at,
                    dragContainer: at,
                    selectableTargets: [".gl-layout-item"],
                    selectByClick: !0,
                    selectFromInside: !1,
                    continueSelect: !1,
                    toggleContinueSelect: ["shift"],
                    hitRate: 0,
                    ratio: 0,
                    dragCondition: (p) => {
                      var w, T, z;
                      return !((z = (T = (w = p.inputEvent) == null ? void 0 : w.target) == null ? void 0 : T.closest) != null && z.call(T, "textarea, input, select, button, [contenteditable]"));
                    },
                    onDragStart: Zg,
                    onSelectEnd: Jg
                  }
                ),
                /* @__PURE__ */ g.jsx(
                  "div",
                  {
                    className: "gl-layout-zoom",
                    style: { width: H.width * Ct, height: H.height * Ct },
                    children: /* @__PURE__ */ g.jsxs(
                      "section",
                      {
                        ref: (p) => {
                          Qe.current = p, et(p);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": H.name,
                        onContextMenu: Sc,
                        onContextMenuCapture: (p) => {
                          var w, T;
                          (T = (w = p.target).closest) != null && T.call(w, ".mini-plot-cell") && (p.stopPropagation(), Sc(p));
                        },
                        ...US(Ct, wo),
                        style: {
                          width: H.width,
                          height: H.height,
                          transform: `scale(${Ct})`,
                          "--gl-hair": `${1 / Ct}px`,
                          backgroundImage: `linear-gradient(#eef2f7 ${1 / Ct}px, transparent ${1 / Ct}px), linear-gradient(90deg, #eef2f7 ${1 / Ct}px, transparent ${1 / Ct}px)`
                        },
                        children: [
                          ya(H.page).map((p) => {
                            const w = Ln(H.page), T = ia(H.page.marginMm);
                            return /* @__PURE__ */ g.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: p.x, top: p.y, width: w.width, height: w.height }, children: T > 0 && /* @__PURE__ */ g.jsx("div", { className: "gl-layout-page-margin", style: { inset: T } }) }, `${p.row}-${p.column}`);
                          }),
                          Gt.items.length === 0 && /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ g.jsx("strong", { children: x("Blank layout") }),
                            /* @__PURE__ */ g.jsx("span", { children: x(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          Gt.items.map((p) => /* @__PURE__ */ g.jsx(
                            WC,
                            {
                              item: qw(p, Gt.items, qn),
                              templateText: (() => {
                                const w = H.items.find((T) => T.id === p.templateId);
                                return (w == null ? void 0 : w.recipe.kind) === "text" ? w.recipe.text : void 0;
                              })(),
                              chartFiles: (() => {
                                const w = H.items.find((T) => T.id === p.templateId);
                                return (w == null ? void 0 : w.recipe.kind) === "proportions" ? w.recipe.settings.files : void 0;
                              })(),
                              selected: I.includes(p.id),
                              samples: jt,
                              state: h,
                              globalScales: m,
                              dataRevision: D,
                              densityColorPower: j,
                              style: Mn(H, p.recipe, P),
                              titleTemplate: ((w) => el(w) ? nl(w, qn(p)) : w)(vs(pc(p, p.templateSampleId) || go, p.unitId && Ge.find((w) => w.id === p.unitId) || null, p.position.n, p.position.total)),
                              describe: Rn,
                              checkedSampleIds: i,
                              metadataById: tn,
                              metadataLevels: c,
                              files: a,
                              sources: Re.sources,
                              divisionProfiles: k,
                              imageService: M,
                              canvasScale: Ze,
                              onTextChange: (w, T, z) => {
                                if (!w.trim()) {
                                  Co([p.templateId]);
                                  return;
                                }
                                yt((G) => {
                                  const Y = G.items.find(
                                    (U) => U.id === p.templateId
                                  );
                                  (Y == null ? void 0 : Y.recipe.kind) === "text" && (Y.recipe.text = w, z === !0 ? Y.recipe.rich = !0 : z === !1 && delete Y.recipe.rich, tC(Y, iC(T, Wn(Y))));
                                });
                              },
                              onTextFocus: () => {
                                (!I.includes(p.id) || I.length > 1) && A([p.id]);
                              },
                              textEditing: B === p.id,
                              onTextEditStart: () => {
                                A([p.id]), xe(p) || q(p.id);
                              },
                              onIsolate: p.group && I.includes(p.id) && I.length > 1 ? () => A([p.id]) : void 0,
                              onHug: ct.mode === "off" && p.id === p.templateId && aa(p.recipe) ? (w, T) => Ag(p.templateId, w, T) : void 0,
                              onTextEditEnd: () => {
                                var w;
                                q((T) => T === p.id ? null : T), (w = Ot.current) == null || w.focus({ preventScroll: !0 });
                              }
                            },
                            p.id
                          )),
                          !_t && /* @__PURE__ */ g.jsx(
                            d1,
                            {
                              ref: ht,
                              target: wn.length === 1 ? wn[0] : wn,
                              zoom: 1 / Ct,
                              origin: !1,
                              checkInput: !0,
                              passDragArea: !0,
                              draggable: !0,
                              resizable: !0,
                              useMutationObserver: !0,
                              useResizeObserver: !0,
                              keepRatio: (Zt.some((p) => aa(p.recipe)) || X.keepRatio !== Nt.shift) && !Zt.some((p) => p.recipe.kind === "shape" && p.recipe.shape === "line"),
                              throttleDragRotate: Nt.shift ? 45 : 0,
                              snappable: !Nt.meta,
                              snapThreshold: 6,
                              isDisplaySnapDigit: !1,
                              isDisplayInnerSnapDigit: !1,
                              snapDirections: ff,
                              elementSnapDirections: ff,
                              elementGuidelines: Z,
                              verticalGuidelines: Mo.vertical,
                              horizontalGuidelines: Mo.horizontal,
                              snapGridWidth: F ? as : 0,
                              snapGridHeight: F ? as : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              individualGroupable: Xr,
                              container: Xr ? J : void 0,
                              onDragStart: Ug,
                              onDrag: jc,
                              onDragEnd: (p) => {
                                const w = Ic(p);
                                Ua(w, p.lastEvent, p.isDrag, () => Va(w, !!p.datas.alt));
                              },
                              onDragGroupStart: (p) => {
                                var w;
                                p.datas.alt = !!((w = p.inputEvent) != null && w.altKey), qa([...p.targets ?? []], p.datas.alt ? Tc(p.targets ?? []) : void 0);
                              },
                              onDragGroup: (p) => p.events.forEach(jc),
                              onDragGroupEnd: (p) => Ua(p.targets, p.lastEvent, p.isDrag, () => Va(p.targets, !!p.datas.alt)),
                              onResizeStart: (p) => {
                                var w;
                                qa([p.target]), (w = p.inputEvent) != null && w.altKey && p.setFixedDirection([0, 0]);
                              },
                              onResize: Rc,
                              onResizeEnd: (p) => Ua([p.target], p.lastEvent, p.isDrag, () => Va([p.target], !1)),
                              onResizeGroupStart: (p) => {
                                var w;
                                qa([...p.targets ?? []]), (w = p.inputEvent) != null && w.altKey && p.events.forEach((T) => T.setFixedDirection([0, 0]));
                              },
                              onResizeGroup: (p) => p.events.forEach(Rc),
                              onResizeGroupEnd: (p) => Ua(p.targets, p.lastEvent, p.isDrag, () => Va(p.targets, !1)),
                              onClick: (p) => {
                                var w, T;
                                if (Fa.current) {
                                  Fa.current = !1;
                                  return;
                                }
                                ((w = p.inputEvent) != null && w.shiftKey || Xr) && ((T = tt.current) == null || T.clickTarget(p.inputEvent, p.inputTarget));
                              },
                              onClickGroup: (p) => {
                                var w;
                                (w = tt.current) == null || w.clickTarget(p.inputEvent, p.inputTarget);
                              }
                            }
                          ),
                          !_t && Ga && /* @__PURE__ */ g.jsx(wS, { tool: Ga, zoom: Ct, snap: bS(F ? as : 0, Mo, Gt.items), onDraw: Gg, onCancel: () => $a(null) }),
                          !_t && H.guides && /* @__PURE__ */ g.jsx(LS, { guides: H.guides, width: H.width, height: H.height, pages: H.page, zoom: Ct, scroller: at, onMove: (p, w) => yt((T) => jS(T, p, w)), onRemove: (p) => yt((w) => IS(w, p)) })
                        ]
                      }
                    )
                  }
                )
              ]
            }
          )
        ] })
      ]
    }
  ) : null;
}
const ZC = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  LayoutTab: VC,
  isBakedTitle: kg,
  overlaidPlot: Eg,
  scaledAsAWhole: aa
}, Symbol.toStringTag, { value: "Module" }));
export {
  ZC as L,
  UC as f,
  qC as k
};
