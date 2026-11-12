import { J as bg, K as ra, L as aa, u as Pt, j as g, N as ie, O as Br, P as Mc, Q as Vn, R as Yr, U as Ld, V as qt, W as fi, X as kr, Y as ci, Z as Dn, _ as wg, $ as Sg, a0 as Cg, a as G, a1 as kg, a2 as Eg, a3 as Bs, F as ia, c as Vo, d as Dc, C as Mg, a4 as Dg, a5 as Tc, a6 as _c, a7 as jc, a8 as Bn, a9 as zd, aa as Tg, ab as pi, s as Fd, z as Ko, ac as qo, ad as Xr, ae as hi, af as Bd, ag as _g, ah as Gd, ai as $d, f as jg, aj as Ig, ak as Kn, g as Rg, al as gi, am as Wd, an as Yd, ao as Pg, ap as Ic, aq as Ng, ar as Xd, as as Gs, at as Uo, au as Og, av as Ag, aw as Lg, ax as Hd, ay as pr, az as Vd, aA as Ai, aB as $s, aC as Kd, aD as vi, aE as zg, aF as Rc, aG as gn, aH as Fg, aI as Bg, aJ as Gg, aK as $g, aL as Wg, aM as mo, aN as Zo, aO as Pc, aP as Yg, aQ as Xg, aR as Hg, aS as Vg, aT as Nc, aU as Kg, aV as qg, aW as Ug, aX as Zg, aY as Jg, aZ as Qg, a_ as tv, a$ as qd, b0 as Ud, b1 as Oc, b2 as Ac, b3 as Lc, b4 as ev, b5 as nv, b6 as rv, b7 as av, b8 as iv, b9 as ov, ba as zc, bb as sv, bc as lv, bd as cv, be as uv, bf as pn, bg as xo, bh as dv, S as Fc, bi as fv, bj as pv, bk as Bc, bl as Ga, bm as hv, bn as yo, bo as gv, bp as vv, bq as Zd, br as mv, bs as xv, bt as $a, bu as Gc, bv as yv, bw as bv, bx as wv, by as $c, bz as Sv, bA as Cv, bB as kv, bC as Wc, bD as mi, bE as bo, bF as Jd, bG as Yc, bH as Xc, bI as Qd, bJ as Ev, bK as Mv, bL as Dv, bM as Tv, bN as _v, bO as jv, bP as Iv, bQ as Hc, bR as tf, bS as Rv, bT as Pv, bU as Vc, bV as ef, bW as Kc, bX as Nv, bY as Ov, bZ as Av, b_ as Lv, b$ as zv, c0 as Fv, c1 as Bv, c2 as Gv, c3 as $v, c4 as Wv, l as wo, c5 as qc, c6 as Uc, c7 as Zc, c8 as Yv } from "./embed-CyQ8URJR.js";
const Rn = ["bold", "italic", "sup", "sub"], Xv = { b: "bold", i: "italic", sup: "sup", sub: "sub" }, Hv = { bold: "b", italic: "i", sup: "sup", sub: "sub" }, Vv = 0.7, Kv = 0.2;
function qv(t, e) {
  return Rn.every((n) => !t[n] == !e[n]);
}
function Ws(t) {
  const e = {};
  for (const n of Rn) t[n] && (e[n] = !0);
  return e.sup && e.sub && delete e.sub, e;
}
function Er(t) {
  const e = [];
  for (const n of t) {
    if (!n.text) continue;
    const r = e.at(-1);
    r && qv(r, n) ? r.text += n.text : e.push({ ...Ws(n), text: n.text });
  }
  return e;
}
function nf(t) {
  const e = [], n = { bold: 0, italic: 0, sup: 0, sub: 0 };
  let r = "";
  const a = () => {
    if (!r) return;
    const s = {};
    for (const l of Rn) n[l] > 0 && (s[l] = !0);
    e.push({ ...s, text: r }), r = "";
  }, i = /<(\/?)(b|i|sup|sub)>|&(lt|amp);/g;
  let o = 0;
  for (let s = i.exec(t); s; s = i.exec(t)) {
    if (r += t.slice(o, s.index), o = i.lastIndex, s[3]) {
      r += s[3] === "lt" ? "<" : "&";
      continue;
    }
    const l = Xv[s[2]];
    s[1] && n[l] === 0 || (a(), n[l] += s[1] ? -1 : 1);
  }
  return r += t.slice(o), a(), Er(e);
}
function Uv(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
}
function Zv(t) {
  return Er(t).map((e) => {
    const n = Rn.filter((r) => e[r]).map((r) => Hv[r]);
    return n.map((r) => `<${r}>`).join("") + Uv(e.text) + [...n].reverse().map((r) => `</${r}>`).join("");
  }).join("");
}
function xi(t, e) {
  return e ? nf(t) : t ? [{ text: t }] : [];
}
function rf(t) {
  return t.map((e) => e.text).join("");
}
function af(t) {
  return t.rich ? rf(nf(t.text)) : t.text;
}
function Jv(t) {
  return t.some((e) => Rn.some((n) => e[n]));
}
function of(t) {
  return Jv(t) ? { text: Zv(t), rich: !0 } : { text: rf(t), rich: !1 };
}
function Qv(t) {
  return t.flatMap((e) => [...e.text].map((n) => ({ ch: n, marks: Ws(e) })));
}
function Ys(t) {
  return Er(t.map((e) => ({ ...e.marks, text: e.ch })));
}
function Jo(t, e, n) {
  const r = Li(t), a = Math.min(e, n), i = Math.max(e, n), o = a === i ? r.filter((l) => l.at === (a > 0 ? a - 1 : 0)) : r.filter((l) => l.at >= a && l.at < i), s = { bold: !1, italic: !1, sup: !1, sub: !1 };
  if (!o.length) return s;
  for (const l of Rn) s[l] = o.every((c) => c.marks[l] === !0);
  return s;
}
function Li(t) {
  let e = 0;
  return Qv(t).map((n) => {
    const r = { ...n, at: e };
    return e += n.ch.length, r;
  });
}
function Xs(t, e, n) {
  const r = { ...t };
  return n ? (r[e] = !0, e === "sup" && delete r.sub, e === "sub" && delete r.sup) : delete r[e], r;
}
function tm(t, e, n, r) {
  const a = Math.min(e, n), i = Math.max(e, n);
  if (a === i) return Er(t);
  const o = !Jo(t, a, i)[r];
  return Ys(Li(t).map((s) => s.at >= a && s.at < i ? { ch: s.ch, marks: Xs(s.marks, r, o) } : s));
}
function Jc(t, e) {
  let n = {};
  for (const r of Rn) t[r] && (n[r] = !0);
  for (const r of e) n = Xs(n, r, !n[r]);
  return n;
}
function em(t, e, n, r, a) {
  const i = Math.min(e, n), o = Math.max(e, n), s = Li(t), l = s.filter((u) => u.at < i), c = s.filter((u) => u.at >= o);
  return Ys([...l, ...[...r].map((u) => ({ ch: u, marks: Ws(a) })), ...c]);
}
const nm = ["bright", "dim", "int", "hi", "lo"];
function rm(t) {
  const e = Li(t), n = e.map((i) => i.ch).join(""), r = /* @__PURE__ */ new Set(), a = (i) => /[A-Za-z]/.test(i) && /[A-Z0-9]/.test(i);
  for (const i of n.matchAll(/[A-Za-z0-9]+/g)) {
    const o = i[0], l = (i.index ?? 0) + o.length, c = nm.find((d) => o.endsWith(d) && o.length > d.length);
    if (c) {
      const d = o.slice(0, -c.length);
      if (/[A-Z0-9]$/.test(d) && a(d)) for (let f = l - c.length; f < l; f++) r.add(f);
    }
    const u = n[l] === "−" ? "-" : n[l];
    if ((u === "+" || u === "-") && a(o)) {
      const d = n[l + 1];
      (d === void 0 || !/[A-Za-z0-9]/.test(d) || u === "+" && /[A-Z]/.test(d)) && r.add(l);
    }
  }
  return Ys(e.map((i) => r.has(i.at) ? { ch: i.ch, marks: Xs(i.marks, "sup", !0) } : i));
}
const am = { B: "bold", STRONG: "bold", I: "italic", EM: "italic", SUP: "sup", SUB: "sub" };
function im(t, e = document) {
  let n = e.createTextNode(t.text);
  for (const [r, a] of [["sub", "sub"], ["sup", "sup"], ["italic", "i"], ["bold", "b"]]) {
    if (!t[r]) continue;
    const i = e.createElement(a);
    i.appendChild(n), n = i;
  }
  return n;
}
function Qc(t, e) {
  var n;
  if (t.replaceChildren(...e.map((r) => im(r, t.ownerDocument))), (n = e.at(-1)) != null && n.text.endsWith(`
`)) {
    const r = t.ownerDocument.createElement("br");
    r.dataset.tail = "", t.appendChild(r);
  }
}
function sf(t, e) {
  const n = {};
  for (let r = t; r && r !== e; r = r.parentNode) {
    const a = r.nodeType === 1 ? am[r.tagName] : void 0;
    a && (n[a] = !0);
  }
  return n;
}
function Hs(t) {
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
  return a && a.node.nodeName === "BR" && om(a.node, t) && e.pop(), e;
}
function om(t, e) {
  for (let n = t; n && n !== e; n = n.parentNode) if (n.nextSibling) return !1;
  return !0;
}
function sm(t) {
  return Er(Hs(t).map((e) => ({ ...sf(e.node, t), text: e.node.nodeType === 3 ? e.node.data : `
` })));
}
function tu(t, e, n) {
  const r = Hs(t);
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
function eu(t, e) {
  const n = Hs(t);
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
function So(t) {
  const e = t.ownerDocument.getSelection();
  if (!e || !e.rangeCount) return null;
  const n = e.getRangeAt(0);
  return !t.contains(n.startContainer) || !t.contains(n.endContainer) ? null : { start: tu(t, n.startContainer, n.startOffset), end: tu(t, n.endContainer, n.endOffset) };
}
function nu(t, e, n) {
  const r = t.ownerDocument.getSelection();
  if (!r) return;
  const a = eu(t, e), i = eu(t, n), o = t.ownerDocument.createRange();
  o.setStart(a.node, a.offset), o.setEnd(i.node, i.offset), r.removeAllRanges(), r.addRange(o);
}
const lm = /* @__PURE__ */ new Set(["text", "shape"]);
function fe(t) {
  return t.recipe.kind === "text" && typeof t.recipe.letterFor == "string" && t.recipe.letterFor !== "";
}
function Vs(t) {
  return !lm.has(t.recipe.kind);
}
function gr(t) {
  return { ...bg, ...t.letterStyle ?? {} };
}
function cm(t, e = "upper") {
  let n = Math.max(0, Math.floor(t)) + 1, r = "";
  for (; n > 0; ) {
    const a = (n - 1) % 26;
    r = String.fromCharCode(65 + a) + r, n = Math.floor((n - 1) / 26);
  }
  return e === "lower" ? r.toLowerCase() : r;
}
function um(t, e) {
  return Math.min(t.y + t.height, e.y + e.height) - Math.max(t.y, e.y) > Math.min(t.height, e.height) / 2;
}
function lf(t) {
  const e = [...t].sort((r, a) => r.y - a.y || r.x - a.x), n = [];
  for (const r of e) {
    const a = n.find((i) => i.some((o) => um(o, r)));
    a ? a.push(r) : n.push([r]);
  }
  return n.sort((r, a) => Math.min(...r.map((i) => i.y)) - Math.min(...a.map((i) => i.y))), n.flatMap((r) => r.sort((a, i) => a.x - i.x || a.y - i.y));
}
function da(t) {
  const e = new Map(t.items.map((r) => [r.id, r])), n = /* @__PURE__ */ new Map();
  for (const r of t.items) {
    if (!fe(r)) continue;
    const a = e.get(r.recipe.letterFor);
    !a || !Vs(a) || n.has(a.id) || n.set(a.id, r);
  }
  return n;
}
function cf(t) {
  const e = da(t), n = t.items.filter((a) => e.has(a.id)), r = gr(t);
  return new Map(lf(n).map((a, i) => [e.get(a.id).id, cm(i, r.case)]));
}
function uf(t, e) {
  return {
    width: Math.max(24, Math.ceil(e.fontSize * 0.8 * Math.max(1, t.length) + 6)),
    height: Math.max(20, Math.ceil(e.fontSize * 1.2 + 6))
  };
}
function Qo(t) {
  return { x: -t.width + 4, y: -t.height + 6 };
}
function df(t, e, n, r, a) {
  const i = ra(t.page), o = aa(t.page), s = o.find((l) => e.x >= l.x && e.x < l.x + i.width && e.y >= l.y && e.y < l.y + i.height) ?? o[0] ?? { x: 0, y: 0 };
  return {
    x: Math.round(Math.min(s.x + i.width - a.width, Math.max(s.x, n))),
    y: Math.round(Math.min(s.y + i.height - a.height, Math.max(s.y, r)))
  };
}
function Ks(t, e) {
  if (!t.items.some(fe)) return;
  const n = da(t), r = new Set([...n.values()].map((s) => s.id));
  t.items = t.items.filter((s) => !fe(s) || r.has(s.id));
  const a = cf(t), i = gr(t), o = new Map(((e == null ? void 0 : e.items) ?? []).map((s) => [s.id, s]));
  for (const [s, l] of n) {
    const c = t.items.find((k) => k.id === s), u = l.recipe, d = a.get(l.id) ?? "", f = uf(d, i);
    let h = u.letterOffset ?? Qo(f);
    const v = o.get(l.id), m = o.get(s), y = !!v && (v.x !== l.x || v.y !== l.y), w = !m || m.x !== c.x || m.y !== c.y;
    y && !w && (h = { x: Math.round(l.x - c.x), y: Math.round(l.y - c.y) });
    const S = df(t, c, c.x + h.x, c.y + h.y, f), C = { ...u, text: d, fontSize: i.fontSize, letterOffset: h };
    i.bold ? C.bold = !0 : delete C.bold, l.recipe = C, l.x = S.x, l.y = S.y, l.width = f.width, l.height = f.height, l.showFrame = !1, c.group ? l.group = c.group : delete l.group, c.locked ? l.locked = !0 : l.locked = !1;
  }
}
function dm(t, e) {
  for (const n of e.sheets) Ks(n, (t == null ? void 0 : t.sheets.find(({ id: r }) => r === n.id)) ?? null);
  return e;
}
function ru(t, e, n = () => crypto.randomUUID()) {
  const r = da(t), a = t.items.filter((l) => Vs(l) && !r.has(l.id) && (!e || e.length === 0 || e.includes(l.id)));
  if (!a.length) return [];
  let i = Math.max(0, ...t.items.map((l) => l.z));
  const o = gr(t), s = [];
  for (const l of a) {
    const c = uf("A", o), u = df(t, l, l.x + Qo(c).x, l.y + Qo(c).y, c), d = n();
    s.push(d), t.items.push({
      id: d,
      x: u.x,
      y: u.y,
      width: c.width,
      height: c.height,
      z: ++i,
      recipe: { kind: "text", text: "", fontSize: o.fontSize, letterFor: l.id, letterOffset: { x: u.x - l.x, y: u.y - l.y } }
    });
  }
  return Ks(t), s;
}
function au(t, e) {
  const n = !e || e.length === 0, r = t.items.length;
  t.items = t.items.filter((i) => !fe(i) || !(n || e.includes(i.id) || e.includes(i.recipe.letterFor)));
  const a = r - t.items.length;
  return a && Ks(t), a;
}
function iu(t, e) {
  t.letterStyle = { ...gr(t), ...e };
}
function fm(t, e) {
  const n = [...e];
  for (const r of da(t).values())
    fe(r) && e.includes(r.recipe.letterFor) && !n.includes(r.id) && n.push(r.id);
  return n;
}
function Co(t, e) {
  const n = da(t), r = e.length ? t.items.filter((a) => e.includes(a.id)) : t.items;
  return {
    canAdd: r.some((a) => Vs(a) && !n.has(a.id)),
    canRemove: r.some((a) => n.has(a.id) || fe(a) && [...n.values()].includes(a))
  };
}
function pm({
  canAdd: t,
  canRemove: e,
  onAdd: n,
  onRemove: r
}) {
  const { t: a } = Pt();
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: n, disabled: !t, title: a("Letter each selected plot, chart or figure at its top left, in reading order; with nothing selected, every one on the sheet. An item that has a letter keeps it."), children: a("Panel letters") }),
    /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: r, disabled: !e, title: a("Remove the panel letters of the selection; with nothing selected, every panel letter on the sheet"), children: a("Remove panel letters") })
  ] });
}
function ff({
  style: t,
  onChange: e
}) {
  const { t: n } = Pt();
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-letter-style", role: "group", "aria-label": n("Panel letters"), children: [
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("Letter size"),
      /* @__PURE__ */ g.jsx(ie, { "aria-label": n("Letter size"), min: 6, max: 72, integer: !0, value: t.fontSize, onCommit: (r) => e({ fontSize: r }) })
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
function hm({
  style: t,
  onChange: e
}) {
  const { t: n } = Pt();
  return /* @__PURE__ */ g.jsxs("section", { className: "gl-layout-letter-section", children: [
    /* @__PURE__ */ g.jsx("h4", { children: n("Panel letters") }),
    /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: n("How the sheet's panel letters are drawn. A letter sits at the top left of its item and moves with it; letters are given in reading order, rows from the top and left to right within a row, and renumber when items move.") }),
    /* @__PURE__ */ g.jsx(ff, { style: t, onChange: e })
  ] });
}
function gm({
  owner: t,
  style: e,
  onChange: n
}) {
  const { t: r } = Pt();
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx("p", { className: "gl-layout-letter-owner", children: r("Panel letter of {item}", { item: t }) }),
    /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: r("The letter is its item's place in reading order and is not edited as text. Drag it to set where it sits against its item; its size and style are the sheet's.") }),
    /* @__PURE__ */ g.jsx(ff, { style: e, onChange: n })
  ] });
}
const yi = "Unassigned";
function pf(t) {
  const e = {};
  for (const [n, r] of Object.entries(t[0] ?? {}))
    t.every((a) => (a == null ? void 0 : a[n]) === r) && (e[n] = r);
  return e;
}
function ts(t, e, n, r) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(n) : i === "N" ? String(r) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function ko(t, e, n, r, a, i) {
  var c;
  const o = kr(t), s = { ...t.recipe };
  let l;
  if (s.kind === "text") s.text = ts(s.text, s.readsFrom ? null : e, n, r);
  else {
    if (o && e && s.kind === "proportions") {
      const u = e.sampleIds ?? (e.populationId ? null : [e.id]);
      if (u && (s.settings = { ...s.settings, files: [...u] }, s.panel && !("legend" in s.panel))) {
        const { group: d, facet: f, ...h } = s.panel;
        s.panel = h;
      }
    } else o && e && e.populationId ? ("populationId" in s && (s.populationId = e.populationId), s.kind === "strategy" && ((c = s.populationIds) != null && c.length) && (s.populationIds = [e.populationId]), (s.kind === "biplot" || s.kind === "histogram") && s.populationIds && delete s.populationIds) : o && e && e.sampleIds ? ((s.kind === "biplot" || s.kind === "histogram") && e.sampleIds.length > 1 ? s.pool = { sampleIds: [...e.sampleIds] } : "pool" in s && delete s.pool, "sampleId" in s && !e.sampleIds.includes(s.sampleId) && e.sampleIds.length && (l = s.sampleId, s.sampleId = e.sampleIds[0])) : o && e && "sampleId" in s && ("pool" in s && delete s.pool, s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id));
    s.title && (s.title = ts(s.title, o ? e : null, n, r));
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
function vm(t, e) {
  if (e)
    for (const n of t) {
      if (n.recipe.kind !== "text" || !n.recipe.readsFrom) continue;
      const r = n.recipe.readsFrom, a = t.find((o) => o.templateId === r && o.offset.x === n.offset.x && o.offset.y === n.offset.y);
      if (!a || !qt(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId, a.unitId);
      i && (n.recipe = { ...n.recipe, text: fi(n.recipe.text, i) });
    }
}
function mm(t, e, n) {
  const r = xm(t, e);
  for (const a of r) vm(a.items, n);
  return r;
}
function xm(t, e) {
  const n = t.iteration ?? Ld;
  if (n.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((h) => ko(h, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const r = e.length;
  if (n.arrangement.kind === "page-per-unit")
    return e.map((h, v) => ({
      index: v,
      units: [h],
      items: t.items.map((m) => ko(m, h, v + 1, r, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = n.arrangement, l = Vn(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const c = a * i, u = l.width + s, d = l.height + s, f = [];
  for (let h = 0; h < r; h += c) {
    const v = e.slice(h, h + c), m = [];
    v.forEach((y, w) => {
      const S = o === "row-major" ? Math.floor(w / i) : w % a, k = { x: (o === "row-major" ? w % i : Math.floor(w / a)) * u, y: S * d };
      for (const M of t.items) m.push(ko(M, y, h + w + 1, r, k, w));
    }), f.push({ index: f.length, units: v, items: m });
  }
  return f;
}
function hf(t, e, n, r) {
  return e.filter((a) => {
    var i;
    return t.kind === "all" ? !0 : t.kind === "checked" ? n.includes(a.id) : t.kind === "group" ? r[a.id] === t.groupId : (((i = a.metadata) == null ? void 0 : i[t.column]) ?? "") === t.value;
  });
}
function ym(t, e, n, r, a) {
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
  return hf(t.source, e, n, a).map(i);
}
function bm(t, e, n, r, a, i) {
  var f;
  const o = t.column ?? "";
  if (!o) return [];
  const s = /* @__PURE__ */ new Map(), l = [];
  for (const h of hf(t.source, e, n, a)) {
    const v = ((f = h.metadata) == null ? void 0 : f[o]) ?? "";
    if (!v) {
      l.push(h);
      continue;
    }
    s.set(v, [...s.get(v) ?? [], h]);
  }
  const c = [...s.keys()], u = i ? [...i.filter((h) => s.has(h)), ...c.filter((h) => !i.includes(h)).sort(Mc)] : c.sort(Mc), d = (h, v) => {
    const m = new Set(v.map((y) => {
      var w;
      return (w = r.find((S) => S.id === a[y.id])) == null ? void 0 : w.name;
    }));
    return {
      id: `meta:${o}=${h}`,
      name: h,
      fileName: `${v.length} files`,
      ...m.size === 1 && [...m][0] ? { groupName: [...m][0] } : {},
      // What the files share, and the value itself, so {meta:column} names the page, the files
      // without a value included.
      metadata: { ...pf(v.map((y) => y.metadata)), [o]: h },
      sampleIds: v.map((y) => y.id)
    };
  };
  return [
    ...u.map((h) => d(h, s.get(h))),
    ...l.length ? [d(yi, l)] : []
  ];
}
function wm(t, e, n) {
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
  return Br(e.populations, r).filter(({ popId: s }) => s !== r && i(s)).map(({ popId: s }) => {
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
function ou(t, e) {
  const n = Vn(t.items);
  if (!n) return { columns: 1, rows: 1 };
  const r = Yr(t.page.marginMm), a = (i, o, s) => Math.max(1, Math.min(Sm, Math.floor((s - r - i + e) / Math.max(1, o + e))));
  return { columns: a(n.x, n.width, t.width), rows: a(n.y, n.height, t.height) };
}
const Sm = 12;
function Cm(t, e) {
  return t.filter((n) => n.x + n.width > e.width + 0.5 || n.y + n.height > e.height + 0.5 || n.x < -0.5 || n.y < -0.5).length;
}
function km(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const Em = { identity: "linear", asinh: "arcsinh", logicle: "logicle" }, qs = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function Us(t, e, n, r, a) {
  var w, S, C, k, M;
  const i = e.find((E) => E.id === t.sampleId) ?? null, o = ((w = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : w.name) ?? "the population", s = t.files === "all" ? e : e.filter((E) => r.includes(E.id)), l = [], c = [], u = [], d = /* @__PURE__ */ new Set();
  for (const E of s) {
    let D = t.populationId;
    if (i && i.tree.id !== E.tree.id) {
      const x = ci(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        E.tree,
        Dn(a)
      );
      if (!x.id) {
        c.push(E.name);
        continue;
      }
      D = x.id;
    }
    let _;
    if (t.statistic === "median") {
      const x = t.channel ? E.sample.index(t.channel) : void 0, I = E.derived.masks[D];
      if (x === void 0) {
        u.push(E.name);
        continue;
      }
      if (!I) {
        c.push(E.name);
        continue;
      }
      d.add(Em[E.sample.transformKind(x)] ?? E.sample.transformKind(x));
      const P = E.sample.displayColumn(x), R = [];
      for (let N = 0; N < P.length; N++) I[N] && Number.isFinite(P[N]) && R.push(P[N]);
      _ = R.length ? wg(R) : null;
    } else if (_ = E.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][D], _ === void 0) {
      c.push(E.name);
      continue;
    }
    if (typeof _ != "number" || !Number.isFinite(_)) continue;
    const j = t.groupBy ? ((C = (S = n[E.id]) == null ? void 0 : S[t.groupBy]) == null ? void 0 : C.trim()) || yi : E.name;
    l.push({ sampleId: E.id, name: E.name, group: j, value: _ });
  }
  const f = Sg(l), h = t.channel ? ((M = (i == null ? void 0 : i.sample) ?? ((k = s[0]) == null ? void 0 : k.sample)) == null ? void 0 : M.labelForKey(t.channel)) ?? t.channel : "", v = d.size ? ` (${[...d].join(", ")})` : "", m = t.statistic === "median" ? `Median ${h}`.trim() + v : qs[t.statistic], y = t.groupBy ? f.filter((E) => E.label !== yi) : [];
  return { points: l, groups: f, test: t.test && t.groupBy ? Cg(y) : null, population: o, axis: m, missing: c, noChannel: u };
}
const Eo = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), Mm = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function Dm({
  data: t,
  recipe: e,
  style: n,
  width: r,
  height: a,
  title: i
}) {
  const o = n.fontTick, s = n.fontAxis, l = n.fontTitle, c = t.groups, u = G.useMemo(() => kg(t.points.map((I) => I.value)), [t.points]), d = 8 + s + 6 + Math.max(...u.ticks.map((I) => Eo(I).length), 1) * o * 0.6 + 8, f = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), h = Math.max(0, ...c.map((I) => I.label.length)), v = c.length > 0 && h * o * 0.6 > (r - d - 8) / c.length, m = v ? Eg(d, c.map((I) => I.label.length * o * 0.6), (I) => Math.max(20, r - I - 8), 45) : d, y = 8 + (v ? h * o * 0.45 + 10 : o + 8), w = Math.max(20, r - m - 8), S = Math.max(20, a - f - y), C = (I) => f + S - (I - u.min) / (u.max - u.min || 1) * S, k = c.length ? w / c.length : w, M = (I) => m + (I + 0.5) * k, E = Math.min(48, k * 0.6), D = n.pubStyle ? "#000000" : "#334155", _ = n.pubStyle ? "#d4d4d8" : "#93c5fd", j = n.pubStyle ? "#000000" : "#1d4ed8", x = C(Math.max(u.min, 0));
  return /* @__PURE__ */ g.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: r, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ g.jsxs("svg", { width: r, height: a, viewBox: `0 0 ${r} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ g.jsx("rect", { width: r, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ g.jsx("text", { x: r / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: D, children: i }),
    !t.points.length && /* @__PURE__ */ g.jsx("text", { x: r / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ g.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: D, children: [
      /* @__PURE__ */ g.jsx("line", { x1: m, x2: m, y1: f, y2: f + S, stroke: D }),
      u.ticks.map((I) => /* @__PURE__ */ g.jsxs("g", { children: [
        /* @__PURE__ */ g.jsx("line", { x1: m - 4, x2: m, y1: C(I), y2: C(I), stroke: D }),
        /* @__PURE__ */ g.jsx("text", { x: m - 6, y: C(I), textAnchor: "end", dominantBaseline: "central", children: Eo(I) })
      ] }, I)),
      /* @__PURE__ */ g.jsx("text", { transform: `translate(${8 + s} ${f + S / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ g.jsx("line", { x1: m, x2: m + w, y1: x, y2: x, stroke: D })
    ] }),
    /* @__PURE__ */ g.jsx("g", { className: "gl-layout-chart-groups", children: c.map((I, P) => {
      const R = M(P), N = e.showPoints || e.chartType === "dots" ? I.points : [];
      return /* @__PURE__ */ g.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(I.mean) && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
          /* @__PURE__ */ g.jsx("rect", { x: R - E / 2, y: Math.min(C(I.mean), x), width: E, height: Math.abs(x - C(I.mean)), fill: _, stroke: D, strokeWidth: 0.8 }),
          I.n > 1 && I.sd > 0 && /* @__PURE__ */ g.jsxs("g", { stroke: D, strokeWidth: 1, children: [
            /* @__PURE__ */ g.jsx("line", { x1: R, x2: R, y1: C(I.mean - I.sd), y2: C(I.mean + I.sd) }),
            /* @__PURE__ */ g.jsx("line", { x1: R - E / 4, x2: R + E / 4, y1: C(I.mean + I.sd), y2: C(I.mean + I.sd) }),
            /* @__PURE__ */ g.jsx("line", { x1: R - E / 4, x2: R + E / 4, y1: C(I.mean - I.sd), y2: C(I.mean - I.sd) })
          ] })
        ] }),
        e.chartType === "box" && I.n > 0 && /* @__PURE__ */ g.jsxs("g", { stroke: D, strokeWidth: 1, fill: _, children: [
          /* @__PURE__ */ g.jsx("line", { x1: R, x2: R, y1: C(I.min), y2: C(I.q1) }),
          /* @__PURE__ */ g.jsx("line", { x1: R, x2: R, y1: C(I.q3), y2: C(I.max) }),
          /* @__PURE__ */ g.jsx("rect", { x: R - E / 2, y: C(I.q3), width: E, height: Math.max(0.5, C(I.q1) - C(I.q3)) }),
          /* @__PURE__ */ g.jsx("line", { x1: R - E / 2, x2: R + E / 2, y1: C(I.median), y2: C(I.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && I.n > 1 && /* @__PURE__ */ g.jsx("line", { x1: R - E / 2, x2: R + E / 2, y1: C(I.mean), y2: C(I.mean), stroke: D, strokeWidth: 2 }),
        N.map((F, q) => /* @__PURE__ */ g.jsx("circle", { cx: R + Mm(q + P * 31) * E * 0.3, cy: C(F.value), r: Math.max(2, o * 0.28), fill: j, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ g.jsx("title", { children: `${F.name}: ${Eo(F.value)}` }) }, F.sampleId)),
        /* @__PURE__ */ g.jsx(
          "text",
          {
            x: R,
            y: f + S + 6,
            textAnchor: v ? "end" : "middle",
            dominantBaseline: "hanging",
            fontSize: o,
            fill: D,
            transform: v ? `rotate(-45 ${R} ${f + S + 6})` : void 0,
            children: I.label
          }
        )
      ] }, I.label || String(P));
    }) }),
    t.test && c.length >= 2 && /* @__PURE__ */ g.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: D, children: [
      /* @__PURE__ */ g.jsx("line", { x1: M(0), x2: M(c.length - 1), y1: f - 4, y2: f - 4, stroke: D }),
      /* @__PURE__ */ g.jsx("text", { x: (M(0) + M(c.length - 1)) / 2, y: f - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const Zs = (t, e) => t.replace(/\{(\w+)\}/g, (n, r) => e && r in e ? String(e[r]) : n);
function Tm(t) {
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
function gf(t, e = Zs) {
  const n = t.recipe.kind;
  if (fe(t)) return e("Letter");
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
function _m(t, e = 5) {
  const r = (t.split(`
`).map((a) => a.trim()).find(Boolean) ?? "").split(/\s+/).filter(Boolean);
  return r.length > e ? `${r.slice(0, e).join(" ")}…` : r.join(" ");
}
function es(t, e, n = Zs) {
  var o, s;
  const r = t.recipe;
  if (r.kind === "text")
    return fe(t) ? n("Panel letter {letter}", { letter: r.text || "?" }) : _m(r.text) || n("Text");
  if (r.kind === "figure") return ((s = (o = r.illustration.figure) == null ? void 0 : o.name) == null ? void 0 : s.trim()) || n("Figure");
  if (r.kind === "proportions") {
    const l = r.settings, c = l.valueKind === "cells" ? n("{channel} per cell", { channel: l.channel || n("Channel") }) : l.valueKind === "statistic" ? Bs(l.statistic, l.channel || "channel") : l.plotType === "box" ? n("Boxplot") : n("Composition");
    if (!r.panel) return c;
    if ("legend" in r.panel) return `${c} · ${n("legend")}`;
    const u = r.panel, d = [u.population, u.group, u.facet, u.channel, u.page].filter((f) => !!f);
    return d.length ? `${c} · ${d.join(" · ")}` : c;
  }
  if (r.kind === "imagewall") return `${r.populationName || n("Population")} · ${r.fileName || n("images")}`;
  if (r.kind === "cellpanel") return `${n("{count} cells", { count: r.cells.length })} · ${r.fileName || n("images")}`;
  if (r.kind === "image") return r.fileName;
  if (!("sampleId" in r) || !("populationId" in r)) return gf(t, n);
  const a = e.populationName(r.sampleId, r.populationId) ?? n("Population");
  if (r.kind === "chart") return `${a} · ${n(qs[r.statistic])}`;
  if (r.kind === "strategy") return n("{population} strategy", { population: a });
  const i = (r.kind === "biplot" || r.kind === "histogram") && r.pool && r.pool.sampleIds.length > 1 ? r.pool.sampleIds.length : 0;
  return i ? `${a} · ${n("{count} files", { count: i })}` : `${a} · ${e.fileName(r.sampleId) ?? n("file")}`;
}
function jm(t, e, n = Zs) {
  var r;
  return ((r = t.name) == null ? void 0 : r.trim()) || es(t, e, n);
}
function Im(t, e, n) {
  const r = t.items.find((i) => i.id === e);
  if (!r) return;
  const a = n.trim();
  a ? r.name = a : delete r.name;
}
function Rm(t, e, n) {
  for (const r of t.items)
    e.includes(r.id) && (n ? r.hidden = !0 : delete r.hidden);
}
function Pm(t, e, n) {
  for (const r of t.items) e.includes(r.id) && (r.locked = n);
}
function Js(t) {
  const e = /* @__PURE__ */ new Set();
  if (!t) return e;
  for (const n of t.items) n.hidden && e.add(n.id);
  if (!e.size) return e;
  for (const n of t.items) fe(n) && e.has(n.recipe.letterFor) && e.add(n.id);
  return e;
}
function Nm(t, e) {
  const n = Js(e);
  return n.size ? t.map((r) => ({ ...r, items: r.items.filter((a) => !n.has(a.templateId)) })) : t;
}
const Om = (t) => `group:${t}`;
function Qs(t) {
  const e = [...t.items].sort((a, i) => i.z - a.z), n = [], r = /* @__PURE__ */ new Set();
  for (const a of e) {
    if (!a.group) {
      n.push({ kind: "item", key: a.id, item: a });
      continue;
    }
    r.has(a.group) || (r.add(a.group), n.push({ kind: "group", key: Om(a.group), group: a.group, members: e.filter((i) => i.group === a.group) }));
  }
  return n;
}
function su(t) {
  return t.flatMap((e) => e.kind === "item" ? [e.item.id] : e.members.map((n) => n.id));
}
function lu(t, e) {
  const n = new Map(t.items.map((r) => [r.id, r]));
  e.forEach((r, a) => {
    const i = n.get(r);
    i && (i.z = e.length - 1 - a);
  });
}
function cu(t, e, n) {
  const r = t.filter((o) => e.has(o));
  if (!r.length) return [...t];
  const a = t.slice(0, n).filter((o) => !e.has(o)), i = t.slice(n).filter((o) => !e.has(o));
  return [...a, ...r, ...i];
}
function vf(t, e, n, r) {
  const a = Qs(t), i = new Set(e);
  if (r) {
    const l = a.findIndex((f) => f.kind === "group" && f.group === r), c = a[l];
    if (!c || c.kind !== "group") return;
    const u = cu(c.members.map((f) => f.id), i, n), d = new Map(c.members.map((f) => [f.id, f]));
    a[l] = { ...c, members: u.map((f) => d.get(f)) }, lu(t, su(a));
    return;
  }
  const o = new Map(a.map((l) => [l.key, l])), s = cu(a.map((l) => l.key), i, n);
  lu(t, su(s.map((l) => o.get(l))));
}
function uu(t, e, n, r) {
  var c;
  const a = Qs(t), i = r ? ((c = a.find((u) => u.kind === "group" && u.group === r)) == null ? void 0 : c.members.map((u) => u.id)) ?? [] : a.map((u) => u.key), o = new Set(e), s = i.map((u, d) => o.has(u) ? d : -1).filter((u) => u >= 0);
  if (!s.length) return;
  const l = n < 0 ? Math.max(0, s[0] - 1) : Math.min(i.length, s[s.length - 1] + 2);
  vf(t, e, l, r);
}
function Am({ open: t }) {
  return /* @__PURE__ */ g.jsxs("svg", { width: "14", height: "12", viewBox: "0 0 14 12", "aria-hidden": "true", focusable: "false", children: [
    /* @__PURE__ */ g.jsx("path", { d: "M1 6c1.6-2.8 3.6-4.2 6-4.2s4.4 1.4 6 4.2c-1.6 2.8-3.6 4.2-6 4.2S2.6 8.8 1 6z", fill: "none", stroke: "currentColor", strokeWidth: "1.2" }),
    t ? /* @__PURE__ */ g.jsx("circle", { cx: "7", cy: "6", r: "1.8", fill: "currentColor" }) : /* @__PURE__ */ g.jsx("path", { d: "M2 11 12 1", stroke: "currentColor", strokeWidth: "1.2" })
  ] });
}
function Lm({ sheet: t, selectedIds: e, samples: n, open: r, onOpenChange: a, onSelect: i, onChange: o }) {
  const { t: s } = Pt(), l = G.useMemo(() => Tm(n), [n]), c = Qs(t), u = Js(t), d = new Set(e), [f, h] = G.useState(() => /* @__PURE__ */ new Set()), [v, m] = G.useState(null), [y, w] = G.useState(null), S = G.useRef(null), C = G.useRef(null), k = e[0];
  G.useEffect(() => {
    var B, Y;
    if (!r || !k) return;
    const z = [...((B = C.current) == null ? void 0 : B.querySelectorAll("[data-object-id]")) ?? []].find((V) => V.dataset.objectId === k);
    (Y = z == null ? void 0 : z.scrollIntoView) == null || Y.call(z, { block: "nearest" });
  }, [r, k]);
  const M = (z, B) => {
    if (B.shiftKey || B.metaKey || B.ctrlKey) {
      const Y = z.every((V) => d.has(V));
      i(Y ? e.filter((V) => !z.includes(V)) : [...e, ...z.filter((V) => !d.has(V))]);
    } else i(z);
  }, E = (z) => M(z, { shiftKey: !0, metaKey: !1, ctrlKey: !1 }), D = (z, B, Y) => {
    B.key === " " ? (B.preventDefault(), E(z)) : B.key === "F2" && Y && (B.preventDefault(), Y());
  }, _ = (z, B, Y) => {
    const W = (B ? c.find((tt) => tt.kind === "group" && tt.group === B).members.map((tt) => tt.id) : c.map((tt) => tt.key)).filter((tt) => d.has(tt) || tt.startsWith("group:") && c.find((J) => J.key === tt).members.every((J) => d.has(J.id)));
    S.current = { keys: W.includes(z) ? W : [z], within: B }, Y.dataTransfer.effectAllowed = "move", Y.dataTransfer.setData("text/plain", z);
  }, j = (z, B, Y) => {
    if (!S.current || S.current.within !== B) return;
    Y.preventDefault(), Y.stopPropagation();
    const V = Y.currentTarget.getBoundingClientRect(), W = Y.clientY - V.top > V.height / 2;
    w({ index: W ? z + 1 : z, within: B });
  }, x = (z) => {
    z.preventDefault(), z.stopPropagation();
    const B = S.current, Y = y;
    S.current = null, w(null), !(!B || !Y || B.within !== Y.within) && o((V) => vf(V, B.keys, Y.index, Y.within));
  }, I = () => {
    S.current = null, w(null);
  }, P = (z, B) => y && y.within === B ? y.index === z ? " is-drop-before" : y.index === z + 1 ? " is-drop-after" : "" : "", R = (z, B, Y = []) => [
    ...Y,
    { label: s("Move up"), title: s("Draw it over the row above"), onClick: () => o((V) => uu(V, [z], -1, B)) },
    { label: s("Move down"), title: s("Draw it under the row below"), onClick: () => o((V) => uu(V, [z], 1, B)) }
  ], N = (z, B, Y, V) => /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx(
      "button",
      {
        type: "button",
        className: "gl-layout-object-toggle",
        "aria-pressed": Y,
        "aria-label": Y ? s("Show {name}", { name: B }) : s("Hide {name}", { name: B }),
        title: s(Y ? "Show: draw it on the page and in the export" : "Hide: not drawn, selected on the page or exported"),
        onClick: () => o((W) => Rm(W, z, !Y)),
        children: /* @__PURE__ */ g.jsx(Am, { open: !Y })
      }
    ),
    /* @__PURE__ */ g.jsx(
      "button",
      {
        type: "button",
        className: `gl-layout-object-toggle${V ? "" : " is-off"}`,
        "aria-pressed": V,
        "aria-label": V ? s("Unlock {name}", { name: B }) : s("Lock {name}", { name: B }),
        title: s(V ? "Unlock: it can be moved and resized again" : "Lock: it keeps its place and size"),
        onClick: () => o((W) => Pm(W, z, !V)),
        children: /* @__PURE__ */ g.jsx(Dg, {})
      }
    )
  ] }), F = (z, B, Y) => {
    const V = jm(z, l, s), W = u.has(z.id), tt = () => m(z.id);
    return /* @__PURE__ */ g.jsxs(
      "li",
      {
        "data-object-id": z.id,
        className: `gl-layout-object${Y ? " is-member" : ""}${d.has(z.id) ? " is-selected" : ""}${W ? " is-hidden" : ""}${P(B, Y)}`,
        draggable: v !== z.id,
        onDragStart: (J) => _(z.id, Y, J),
        onDragOver: (J) => j(B, Y, J),
        onDrop: x,
        onDragEnd: I,
        children: [
          /* @__PURE__ */ g.jsx("span", { className: "gl-layout-object-kind", children: gf(z, s) }),
          v === z.id ? /* @__PURE__ */ g.jsx(
            zm,
            {
              initial: z.name ?? es(z, l, s),
              label: s("Name of {name}", { name: V }),
              onCommit: (J) => {
                m(null), !(!z.name && J.trim() === es(z, l, s)) && J.trim() !== (z.name ?? "") && o((rt) => Im(rt, z.id, J));
              },
              onCancel: () => m(null)
            }
          ) : /* @__PURE__ */ g.jsx(
            "button",
            {
              type: "button",
              className: "gl-layout-object-name",
              "aria-pressed": d.has(z.id),
              title: s("Click to select it on the page, Shift-click to add or remove; double-click to rename"),
              onClick: (J) => M([z.id], J),
              onDoubleClick: tt,
              onKeyDown: (J) => D([z.id], J, tt),
              onKeyUp: (J) => {
                J.key === " " && J.preventDefault();
              },
              children: V
            }
          ),
          N([z.id], V, W, z.locked === !0),
          /* @__PURE__ */ g.jsx(
            Vo,
            {
              label: s("Actions for {name}", { name: V }),
              icon: /* @__PURE__ */ g.jsx(Dc, { size: 12 }),
              className: "gl-layout-object-menu",
              items: R(z.id, Y, [{ label: s("Rename"), onClick: tt }])
            }
          )
        ]
      },
      z.id
    );
  }, q = (z, B) => {
    const Y = z.members.map((Q) => Q.id), V = s("Group of {count}", { count: z.members.length }), W = f.has(z.group), tt = Y.every((Q) => u.has(Q)), J = z.members.every((Q) => Q.locked === !0), rt = Y.every((Q) => d.has(Q));
    return /* @__PURE__ */ g.jsxs("li", { className: "gl-layout-object-group", children: [
      /* @__PURE__ */ g.jsxs(
        "div",
        {
          "data-object-id": z.key,
          className: `gl-layout-object${rt ? " is-selected" : ""}${tt ? " is-hidden" : ""}${P(B)}`,
          draggable: !0,
          onDragStart: (Q) => _(z.key, void 0, Q),
          onDragOver: (Q) => j(B, void 0, Q),
          onDrop: x,
          onDragEnd: I,
          children: [
            /* @__PURE__ */ g.jsx(
              "button",
              {
                type: "button",
                className: "gl-layout-object-fold",
                "aria-expanded": !W,
                "aria-label": W ? s("Unfold {name}", { name: V }) : s("Fold {name}", { name: V }),
                onClick: () => h((Q) => {
                  const at = new Set(Q);
                  return at.has(z.group) ? at.delete(z.group) : at.add(z.group), at;
                }),
                children: /* @__PURE__ */ g.jsx(Mg, { open: !W, size: 10 })
              }
            ),
            /* @__PURE__ */ g.jsx(
              "button",
              {
                type: "button",
                className: "gl-layout-object-name",
                "aria-pressed": rt,
                title: s("Click to select the group on the page, Shift-click to add or remove it"),
                onClick: (Q) => M(Y, Q),
                onKeyDown: (Q) => D(Y, Q),
                onKeyUp: (Q) => {
                  Q.key === " " && Q.preventDefault();
                },
                children: V
              }
            ),
            N(Y, V, tt, J),
            /* @__PURE__ */ g.jsx(Vo, { label: s("Actions for {name}", { name: V }), icon: /* @__PURE__ */ g.jsx(Dc, { size: 12 }), className: "gl-layout-object-menu", items: R(z.key) })
          ]
        }
      ),
      !W && /* @__PURE__ */ g.jsx("ul", { className: "gl-layout-objects-list", "aria-label": V, children: z.members.map((Q, at) => F(Q, at, z.group)) })
    ] }, z.key);
  };
  return /* @__PURE__ */ g.jsxs("details", { className: "gl-layout-objects", open: r, onToggle: (z) => a(z.currentTarget.open), children: [
    /* @__PURE__ */ g.jsx(ia, { children: s("Objects") }),
    c.length ? /* @__PURE__ */ g.jsx("ul", { ref: C, className: "gl-layout-objects-list", "aria-label": s("Objects on the sheet, top of the stack first"), children: c.map((z, B) => z.kind === "item" ? F(z.item, B) : q(z, B)) }) : /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: s("Nothing on the sheet yet.") })
  ] });
}
function zm({ initial: t, label: e, onCommit: n, onCancel: r }) {
  const [a, i] = G.useState(t), o = G.useRef(!1), s = G.useRef(null);
  return G.useEffect(() => {
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
function tl(t, e) {
  for (var n = t.length, r = 0; r < n; ++r)
    if (e(t[r], r))
      return !0;
  return !1;
}
function mf(t, e) {
  for (var n = t.length, r = 0; r < n; ++r)
    if (e(t[r], r))
      return t[r];
  return null;
}
function xf(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function el(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function Fm() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function Bm(t, e) {
  var n = el("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return n ? n[3] : "";
}
function ns(t) {
  return t.replace(/_/g, ".");
}
function Gr(t, e) {
  var n = null, r = "-1";
  return tl(t, function(a) {
    var i = el("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (n = a, r = i[3] || "-1", a.versionAlias ? r = a.versionAlias : a.versionTest && (r = Bm(a.versionTest.toLowerCase(), e) || r), r = ns(r), !0);
  }), {
    preset: n,
    version: r
  };
}
function Wa(t, e) {
  var n = {
    brand: "",
    version: "-1"
  };
  return tl(t, function(r) {
    var a = yf(e, r);
    return a ? (n.brand = r.id, n.version = r.versionAlias || a.version, n.version !== "-1") : !1;
  }), n;
}
function yf(t, e) {
  return mf(t, function(n) {
    var r = n.brand;
    return el("" + e.test, r.toLowerCase());
  });
}
var bf = [{
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
}], wf = [{
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
}], rs = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], Sf = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], Cf = [{
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
function kf(t) {
  return !!Gr(Sf, t).preset;
}
function Gm(t) {
  var e = xf(t), n = !!/mobi/g.exec(e), r = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: kf(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = Gr(bf, e), o = i.preset, s = i.version, l = Gr(Cf, e), c = l.preset, u = l.version, d = Gr(wf, e);
  if (r.chromium = !!d.preset, r.chromiumVersion = d.version, !r.chromium) {
    var f = Gr(rs, e);
    r.webkit = !!f.preset, r.webkitVersion = f.version;
  }
  return c && (a.name = c.id, a.version = u, a.majorVersion = parseInt(u, 10)), o && (r.name = o.id, r.version = s, r.webview && a.name === "ios" && r.name !== "safari" && (r.webview = !1)), r.majorVersion = parseInt(r.version, 10), {
    browser: r,
    os: a,
    isMobile: n,
    isHints: !1
  };
}
function $m(t) {
  var e = navigator.userAgentData, n = (e.uaList || e.brands).slice(), r = e.mobile || !1, a = n[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!Wa(Sf, n).brand || kf(xf())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && tl(rs, function(f) {
    return yf(n, f);
  });
  var l = Wa(wf, n);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var c = Wa(rs, n);
    o.webkit = !!c.brand, o.webkitVersion = c.version || "-1";
  }
  var u = mf(Cf, function(f) {
    return new RegExp("" + f.test, "g").exec(i);
  });
  s.name = u ? u.id : "";
  {
    var d = Wa(bf, n);
    o.name = d.brand || o.name, o.version = d.brand && t ? t.uaFullVersion : d.version;
  }
  return o.webkit && (s.name = r ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = ns(s.version), o.version = ns(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: r,
    isHints: !0
  };
}
function Wm(t) {
  return Fm() ? $m() : Gm(t);
}
function Ym(t) {
  for (var e = [], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  return e.map(function(r) {
    return r.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function Xm(t, e) {
  return e.replace(/([^}{]*){/gm, function(n, r) {
    return r.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function Tn(t, e) {
  return function(n) {
    n && (t[e] = n);
  };
}
function Ef(t, e, n) {
  return function(r) {
    r && (t[e][n] = r);
  };
}
function Hm(t, e) {
  return function(n) {
    var r = n.prototype;
    t.forEach(function(a) {
      e(r, a);
    });
  };
}
function Mf(t, e) {
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
var Vm = "function", Km = "object", qm = "string", Um = "number", nl = "undefined", Df = typeof window !== nl, Zm = typeof document !== nl && document, Jm = [{
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
}], oe = 1e-7, Ya = {
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
function Qm() {
  for (var t = 0, e = 0, n = arguments.length; e < n; e++) t += arguments[e].length;
  for (var r = Array(t), a = 0, e = 0; e < n; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) r[a] = i[o];
  return r;
}
function bi(t, e, n, r) {
  return (t * r + e * n) / (n + r);
}
function rl(t) {
  return typeof t === nl;
}
function Te(t) {
  return t && typeof t === Km;
}
function te(t) {
  return Array.isArray(t);
}
function Fe(t) {
  return typeof t === qm;
}
function oa(t) {
  return typeof t === Um;
}
function zi(t) {
  return typeof t === Vm;
}
function t0(t, e) {
  var n = t === "" || t == " ", r = e === "" || e == " ";
  return r && n || t === e;
}
function Tf(t, e, n, r, a) {
  var i = al(t, e, n);
  return i ? n : e0(t, e, n + 1, r, a);
}
function al(t, e, n) {
  if (!t.ignore)
    return null;
  var r = e.slice(Math.max(n - 3, 0), n + 3).join("");
  return new RegExp(t.ignore).exec(r);
}
function e0(t, e, n, r, a) {
  for (var i = function(c) {
    var u = e[c].trim();
    if (u === t.close && !al(t, e, c))
      return {
        value: c
      };
    var d = c, f = _e(a, function(h) {
      var v = h.open;
      return v === u;
    });
    if (f && (d = Tf(f, e, c, r, a)), d === -1)
      return o = c, "break";
    c = d, o = c;
  }, o, s = n; s < r; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function il(t, e) {
  var n = Fe(e) ? {
    separator: e
  } : e, r = n.separator, a = r === void 0 ? "," : r, i = n.isSeparateFirst, o = n.isSeparateOnlyOpenClose, s = n.isSeparateOpenClose, l = s === void 0 ? o : s, c = n.openCloseCharacters, u = c === void 0 ? Jm : c, d = u.map(function(D) {
    var _ = D.open, j = D.close;
    return _ === j ? _ : _ + "|" + j;
  }).join("|"), f = "(\\s*" + a + "\\s*|" + d + "|\\s+)", h = new RegExp(f, "g"), v = t.split(h).filter(function(D) {
    return D && D !== "undefined";
  }), m = v.length, y = [], w = [];
  function S() {
    return w.length ? (y.push(w.join("")), w = [], !0) : !1;
  }
  for (var C = function(D) {
    var _ = v[D].trim(), j = D, x = _e(u, function(R) {
      var N = R.open;
      return N === _;
    }), I = _e(u, function(R) {
      var N = R.close;
      return N === _;
    });
    if (x) {
      if (j = Tf(x, v, D, m, u), j !== -1 && l)
        return S() && i || (y.push(v.slice(D, j + 1).join("")), D = j, i) ? (k = D, "break") : (k = D, "continue");
    } else if (I && !al(I, v, D)) {
      var P = Qm(u);
      return P.splice(u.indexOf(I), 1), {
        value: il(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: P
        })
      };
    } else if (t0(_, a) && !o)
      return S(), i ? (k = D, "break") : (k = D, "continue");
    j === -1 && (j = m - 1), w.push(v.slice(D, j + 1).join("")), D = j, k = D;
  }, k, M = 0; M < m; ++M) {
    var E = C(M);
    if (M = k, typeof E == "object") return E.value;
    if (E === "break") break;
  }
  return w.length && y.push(w.join("")), y;
}
function _n(t) {
  return il(t, "");
}
function Xn(t) {
  return il(t, ",");
}
function _f(t) {
  var e = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(t);
  return !e || e.length < 4 ? {} : {
    prefix: e[1],
    value: e[2],
    suffix: e[3]
  };
}
function qn(t) {
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
function as(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, n) {
    return n.toUpperCase();
  });
}
function n0(t, e) {
  return t.replace(/([a-z])([A-Z])/g, function(n, r, a) {
    return "" + r + e + a.toLowerCase();
  });
}
function sa() {
  return Date.now ? Date.now() : (/* @__PURE__ */ new Date()).getTime();
}
function mn(t, e, n) {
  n === void 0 && (n = -1);
  for (var r = t.length, a = 0; a < r; ++a)
    if (e(t[a], a, t))
      return a;
  return n;
}
function _e(t, e, n) {
  var r = mn(t, e);
  return r > -1 ? t[r] : n;
}
var jf = /* @__PURE__ */ (function() {
  var t = sa(), e = Df && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(n) {
    var r = sa(), a = setTimeout(function() {
      n(r - t);
    }, 1e3 / 60);
    return a;
  };
})(), r0 = /* @__PURE__ */ (function() {
  var t = Df && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function Mr(t) {
  return Object.keys(t);
}
function Ft(t, e) {
  var n = qn(t), r = n.value, a = n.unit;
  if (Te(e)) {
    var i = e[a];
    if (i) {
      if (zi(i))
        return i(r);
      if (Ya[a])
        return Ya[a](r, i);
    }
  } else if (a === "%")
    return r * e / 100;
  return Ya[a] ? Ya[a](r) : r;
}
function wi(t, e, n) {
  return Math.max(e, Math.min(t, n));
}
function du(t, e, n, r) {
  return r === void 0 && (r = t[0] / t[1]), [[Dt(e[0], oe), Dt(e[0] / r, oe)], [Dt(e[1] * r, oe), Dt(e[1], oe)]].filter(function(a) {
    return a.every(function(i, o) {
      var s = e[o], l = Dt(s, oe);
      return n ? i <= s || i <= l : i >= s || i >= l;
    });
  })[0] || t;
}
function ol(t, e, n, r) {
  if (!r)
    return t.map(function(h, v) {
      return wi(h, e[v], n[v]);
    });
  var a = t[0], i = t[1], o = r === !0 ? a / i : r, s = du(t, e, !1, o), l = s[0], c = s[1], u = du(t, n, !0, o), d = u[0], f = u[1];
  return a < l || i < c ? (a = l, i = c) : (a > d || i > f) && (a = d, i = f), [a, i];
}
function a0(t) {
  for (var e = t.length, n = 0, r = e - 1; r >= 0; --r)
    n += t[r];
  return n;
}
function is(t) {
  for (var e = t.length, n = 0, r = e - 1; r >= 0; --r)
    n += t[r];
  return e ? n / e : 0;
}
function ee(t, e) {
  var n = e[0] - t[0], r = e[1] - t[1], a = Math.atan2(r, n);
  return a >= 0 ? a : a + Math.PI * 2;
}
function i0(t) {
  return [0, 1].map(function(e) {
    return is(t.map(function(n) {
      return n[e];
    }));
  });
}
function fu(t) {
  var e = i0(t), n = ee(e, t[0]), r = ee(e, t[1]);
  return n < r && r - n < Math.PI || n > r && r - n < -Math.PI ? 1 : -1;
}
function Qe(t, e) {
  return Math.sqrt(Math.pow((e ? e[0] : 0) - t[0], 2) + Math.pow((e ? e[1] : 0) - t[1], 2));
}
function Dt(t, e) {
  if (!e)
    return t;
  var n = 1 / e;
  return Math.round(t / e) / n;
}
function pu(t, e) {
  return t.forEach(function(n, r) {
    t[r] = Dt(t[r], e);
  }), t;
}
function o0(t) {
  for (var e = [], n = 0; n < t; ++n)
    e.push(n);
  return e;
}
function s0(t) {
  return t.reduce(function(e, n) {
    return e.concat(n);
  }, []);
}
function se(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function sl(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function If(t, e) {
  if (t.classList)
    t.classList.remove(e);
  else {
    var n = new RegExp("(\\s|^)" + e + "(\\s|$)");
    t.className = t.className.replace(n, " ");
  }
}
function ae(t, e, n, r) {
  t.addEventListener(e, n, r);
}
function Qt(t, e, n, r) {
  t.removeEventListener(e, n, r);
}
function Ke(t) {
  return (t == null ? void 0 : t.ownerDocument) || Zm;
}
function ll(t) {
  return Ke(t).documentElement;
}
function Pn(t) {
  return Ke(t).body;
}
function Le(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function Rf(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function la(t) {
  return Te(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function l0(t, e, n, r, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = n + o * a, l = r + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function c0(t, e, n, r, a) {
  for (var i = 0; i < a; ++i) {
    var o = n + i * a, s = r + i * a, l = t[o], c = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = c;
  }
}
function u0(t, e, n, r, a) {
  for (var i = 0; i < r; ++i) {
    var o = n + i * r;
    t[o] /= a, e[o] /= a;
  }
}
function Pf(t, e, n) {
  for (var r = t.slice(), a = 0; a < n; ++a)
    r[a * n + e - 1] = 0, r[(e - 1) * n + a] = 0;
  return r[(e - 1) * (n + 1)] = 1, r;
}
function Ue(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var n = t.slice(), r = Xt(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!Dt(n[i], oe)) {
      for (var o = a + 1; o < e; ++o)
        if (n[e * a + o]) {
          c0(n, r, a, o, e);
          break;
        }
    }
    if (!Dt(n[i], oe))
      return [];
    u0(n, r, a, e, n[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, c = n[l];
      !Dt(c, oe) || a === o || l0(n, r, s, a, e, -c);
    }
  }
  return r;
}
function d0(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var n = [], r = 0; r < e; ++r)
    for (var a = 0; a < e; ++a)
      n[a * e + r] = t[e * r + a];
  return n;
}
function Nf(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var n = [], r = t[e * e - 1], a = 0; a < e - 1; ++a)
    n[a] = t[e * (e - 1) + a] / r;
  return n[e - 1] = 0, n;
}
function f0(t, e) {
  for (var n = Xt(e), r = 0; r < e - 1; ++r)
    n[e * (e - 1) + r] = t[r] || 0;
  return n;
}
function Un(t, e) {
  for (var n = t.slice(), r = t.length; r < e - 1; ++r)
    n[r] = 0;
  return n[e - 1] = 1, n;
}
function Ze(t, e, n) {
  if (e === void 0 && (e = Math.sqrt(t.length)), e === n)
    return t;
  for (var r = Xt(n), a = Math.min(e, n), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      r[i * n + o] = t[i * e + o];
    r[(i + 1) * n - 1] = t[(i + 1) * e - 1], r[(n - 1) * n + i] = t[(e - 1) * e + i];
  }
  return r[n * n - 1] = t[e * e - 1], r;
}
function Si(t) {
  for (var e = [], n = 1; n < arguments.length; n++)
    e[n - 1] = arguments[n];
  var r = Xt(t);
  return e.forEach(function(a) {
    r = Bt(r, a, t);
  }), r;
}
function Bt(t, e, n) {
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
function Ot(t, e) {
  for (var n = Math.min(t.length, e.length), r = t.slice(), a = 0; a < n; ++a)
    r[a] = r[a] + e[a];
  return r;
}
function wt(t, e) {
  for (var n = Math.min(t.length, e.length), r = t.slice(), a = 0; a < n; ++a)
    r[a] = r[a] - e[a];
  return r;
}
function p0(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function Of(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function ve(t, e, n) {
  n === void 0 && (n = e.length);
  var r = Bt(t, e, n), a = r[n - 1];
  return r.map(function(i) {
    return i / a;
  });
}
function h0(t, e) {
  return Bt(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function g0(t, e) {
  return Bt(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function v0(t, e) {
  return Bt(t, pa(e, 4));
}
function Xa(t, e) {
  var n = e[0], r = n === void 0 ? 1 : n, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return Bt(t, [r, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function fa(t, e) {
  return ve(pa(e, 3), Un(t, 3));
}
function Mo(t, e) {
  var n = e[0], r = n === void 0 ? 0 : n, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return Bt(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, r, i, s, 1], 4);
}
function os(t, e) {
  return Bt(t, e, 4);
}
function pa(t, e) {
  var n = Math.cos(t), r = Math.sin(t), a = Xt(e);
  return a[0] = n, a[1] = r, a[e] = -r, a[e + 1] = n, a;
}
function Xt(t) {
  for (var e = t * t, n = [], r = 0; r < e; ++r)
    n[r] = r % (t + 1) ? 0 : 1;
  return n;
}
function cl(t, e) {
  for (var n = Xt(e), r = Math.min(t.length, e - 1), a = 0; a < r; ++a)
    n[(e + 1) * a] = t[a];
  return n;
}
function Zn(t, e) {
  for (var n = Xt(e), r = Math.min(t.length, e - 1), a = 0; a < r; ++a)
    n[e * (e - 1) + a] = t[a];
  return n;
}
function ul(t, e, n, r, a, i, o, s) {
  var l = t[0], c = t[1], u = e[0], d = e[1], f = n[0], h = n[1], v = r[0], m = r[1], y = a[0], w = a[1], S = i[0], C = i[1], k = o[0], M = o[1], E = s[0], D = s[1], _ = [l, 0, u, 0, f, 0, v, 0, c, 0, d, 0, h, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, u, 0, f, 0, v, 0, c, 0, d, 0, h, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, -y * l, -w * l, -S * u, -C * u, -k * f, -M * f, -E * v, -D * v, -y * c, -w * c, -S * d, -C * d, -k * h, -M * h, -E * m, -D * m], j = Ue(_, 8);
  if (!j.length)
    return [];
  var x = Bt(j, [y, w, S, C, k, M, E, D], 8);
  return x[8] = 1, Ze(d0(x), 3, 4);
}
var Hr = function() {
  return Hr = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, Hr.apply(this, arguments);
};
function dl() {
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
function vr(t, e) {
  return e === void 0 && (e = 0), ir(mr(t, e));
}
function ui(t, e) {
  var n = ve(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), r = n[3] || 1;
  return [
    n[0] / r,
    n[1] / r,
    n[2] / r
  ];
}
function m0(t, e) {
  e === void 0 && (e = document.body);
  for (var n = t, r = dl(); n; ) {
    var a = getComputedStyle(n).transform;
    if (r = os(vr(a), r), n === e)
      break;
    n = n.parentElement;
  }
  return r = Ue(r, 4), r[12] = 0, r[13] = 0, r[14] = 0, r;
}
function ir(t) {
  var e = dl();
  return t.forEach(function(n) {
    var r = n.matrixFunction, a = n.functionValue;
    r && (e = r(e, a));
  }), e;
}
function mr(t, e) {
  e === void 0 && (e = 0);
  var n = te(t) ? t : _n(t);
  return n.map(function(r) {
    var a = _f(r), i = a.prefix, o = a.value, s = null, l = i, c = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var u = Te(e) ? Hr(Hr({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, d = Xn(o).map(function(R, N) {
        return N === 0 && "x%" in u ? u["%"] = e["x%"] : N === 1 && "y%" in u ? u["%"] = e["y%"] : u["%"] = e["o%"], Ft(R, u);
      }), f = d[0], h = d[1], v = h === void 0 ? 0 : h, m = d[2], y = m === void 0 ? 0 : m;
      s = Mo, c = [f, v, y];
    } else if (i === "translateY") {
      var w = Te(e) ? Hr({ "%": e["y%"] }, e) : {
        "%": e
      }, v = Ft(o, w);
      s = Mo, c = [0, v, 0];
    } else if (i === "translateZ") {
      var y = parseFloat(o);
      s = Mo, c = [0, 0, y];
    } else if (i === "scale" || i === "scale3d") {
      var S = Xn(o).map(function(R) {
        return parseFloat(R);
      }), C = S[0], k = S[1], M = k === void 0 ? C : k, E = S[2], D = E === void 0 ? 1 : E;
      s = Xa, c = [C, M, D];
    } else if (i === "scaleX") {
      var C = parseFloat(o);
      s = Xa, c = [C, 1, 1];
    } else if (i === "scaleY") {
      var M = parseFloat(o);
      s = Xa, c = [1, M, 1];
    } else if (i === "scaleZ") {
      var D = parseFloat(o);
      s = Xa, c = [1, 1, D];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var _ = qn(o), j = _.unit, x = _.value, I = j === "rad" ? x : x * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = v0) : i === "rotateX" ? s = h0 : i === "rotateY" && (s = g0), c = I;
    } else if (i === "matrix3d")
      s = os, c = Xn(o).map(function(R) {
        return parseFloat(R);
      });
    else if (i === "matrix") {
      var P = Xn(o).map(function(R) {
        return parseFloat(R);
      });
      s = os, c = [
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
var x0 = /* @__PURE__ */ (function() {
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
})(), y0 = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(n) {
    return this.object[n];
  }, e.set = function(n, r) {
    this.object[n] = r;
  }, t;
})(), b0 = typeof Map == "function", w0 = /* @__PURE__ */ (function() {
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
function S0(t, e) {
  var n = [], r = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new w0();
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
    var d = l.getIndex();
    return [u, d];
  });
}
var C0 = /* @__PURE__ */ (function() {
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
    var n = S0(this.changedBeforeAdded, this.fixed), r = this.changed, a = [];
    this.cacheOrdered = n.filter(function(i, o) {
      var s = i[0], l = i[1], c = r[o], u = c[0], d = c[1];
      if (s !== l)
        return a.push([u, d]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function fl(t, e, n) {
  var r = b0 ? Map : n ? y0 : x0, a = n || function(S) {
    return S;
  }, i = [], o = [], s = [], l = t.map(a), c = e.map(a), u = new r(), d = new r(), f = [], h = [], v = {}, m = [], y = 0, w = 0;
  return l.forEach(function(S, C) {
    u.set(S, C);
  }), c.forEach(function(S, C) {
    d.set(S, C);
  }), l.forEach(function(S, C) {
    var k = d.get(S);
    typeof k > "u" ? (++w, o.push(C)) : v[k] = w;
  }), c.forEach(function(S, C) {
    var k = u.get(S);
    typeof k > "u" ? (i.push(C), ++y) : (s.push([k, C]), w = v[C] || 0, f.push([k - w, C - y]), h.push(C === k), k !== C && m.push([k, C]));
  }), o.reverse(), new C0(t, e, i, o, m, s, f, h);
}
var k0 = /* @__PURE__ */ (function() {
  function t(n, r) {
    n === void 0 && (n = []), this.findKeyCallback = r, this.list = [].slice.call(n);
  }
  var e = t.prototype;
  return e.update = function(n) {
    var r = [].slice.call(n), a = fl(this.list, r, this.findKeyCallback);
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
var ss = function(t, e) {
  return ss = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) r.hasOwnProperty(a) && (n[a] = r[a]);
  }, ss(t, e);
};
function E0(t, e) {
  ss(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var Af = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), Lf = /* @__PURE__ */ (function(t) {
  E0(e, t);
  function e(n) {
    return n === void 0 && (n = []), t.call(this, n, Af) || this;
  }
  return e;
})(k0);
function or(t, e) {
  return fl(t, e, Af);
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
var ls = function() {
  return ls = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, ls.apply(this, arguments);
};
function M0() {
  for (var t = 0, e = 0, n = arguments.length; e < n; e++) t += arguments[e].length;
  for (var r = Array(t), a = 0, e = 0; e < n; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) r[a] = i[o];
  return r;
}
var ha = /* @__PURE__ */ (function() {
  function t() {
    this._events = {};
  }
  var e = t.prototype;
  return e.on = function(n, r) {
    if (Te(n))
      for (var a in n)
        this.on(a, n[a]);
    else
      this._addEvent(n, r, {});
    return this;
  }, e.off = function(n, r) {
    if (!n)
      this._events = {};
    else if (Te(n))
      for (var a in n)
        this.off(a);
    else if (!r)
      this._events[n] = [];
    else {
      var i = this._events[n];
      if (i) {
        var o = mn(i, function(s) {
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
    }, r.currentTarget = this, M0(i).forEach(function(s) {
      s.listener(r), s.once && a.off(n, s.listener);
    }), !o;
  }, e.trigger = function(n, r) {
    return r === void 0 && (r = {}), this.emit(n, r);
  }, e._addEvent = function(n, r, a) {
    var i = this._events;
    i[n] = i[n] || [];
    var o = i[n];
    o.push(ls({
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
var cs = function(t, e) {
  return cs = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) r.hasOwnProperty(a) && (n[a] = r[a]);
  }, cs(t, e);
};
function D0(t, e) {
  cs(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var sr = function() {
  return sr = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, sr.apply(this, arguments);
};
function T0(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function hu(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function Ha(t) {
  if (t) {
    if (Fe(t))
      return document.querySelector(t);
  } else return null;
  if (zi(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var zf = /* @__PURE__ */ (function(t) {
  D0(e, t);
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
    var i = Ha(a.container);
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
      var i = r.clientX, o = r.clientY, s = a.threshold, l = s === void 0 ? 0 : s, c = this, u = c._startRect, d = c._startPos;
      this._currentOptions = a;
      var f = [0, 0];
      return u.top > o - l ? (d[1] > u.top || o < d[1]) && (f[1] = -1) : u.top + u.height < o + l && (d[1] < u.top + u.height || o > d[1]) && (f[1] = 1), u.left > i - l ? (d[0] > u.left || i < d[0]) && (f[0] = -1) : u.left + u.width < i + l && (d[0] < u.left + u.width || i > d[0]) && (f[0] = 1), !f[0] && !f[1] ? !1 : this._continueDrag(sr(sr({}, a), {
        direction: f,
        inputEvent: r,
        isDrag: !0
      }));
    }
  }, n.checkScroll = function(r) {
    var a = this;
    if (this._isWait)
      return !1;
    var i = r.prevScrollPos, o = i === void 0 ? this._prevScrollPos : i, s = r.direction, l = r.throttleTime, c = l === void 0 ? 0 : l, u = r.inputEvent, d = r.isDrag, f = this._getScrollPosition(s || [0, 0], r), h = f[0] - o[0], v = f[1] - o[1], m = s || [h ? Math.abs(h) / h : 0, v ? Math.abs(v) / v : 0];
    return this._prevScrollPos = f, this._lock = !1, !h && !v ? !1 : (this.emit("move", {
      offsetX: m[0] ? h : 0,
      offsetY: m[1] ? v : 0,
      inputEvent: u
    }), c && d && (clearTimeout(this._timer), this._timer = window.setTimeout(function() {
      a._continueDrag(r);
    }, c)), !0);
  }, n.dragEnd = function() {
    this._flag = !1, this._lock = !1, clearTimeout(this._timer), this._unregisterScrollEvent();
  }, n._getScrollPosition = function(r, a) {
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? T0 : o;
    return s({
      container: Ha(i),
      direction: r
    });
  }, n._continueDrag = function(r) {
    var a = this, i, o = r.container, s = r.direction, l = r.throttleTime, c = r.useScroll, u = r.isDrag, d = r.inputEvent;
    if (!(!this._flag || u && this._isWait)) {
      var f = sa(), h = Math.max(l + this._prevTime - f, 0);
      if (h > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(r);
        }, h), !1;
      this._prevTime = f;
      var v = this._getScrollPosition(s, r);
      this._prevScrollPos = v, u && (this._isWait = !0), c || (this._lock = !0);
      var m = {
        container: Ha(o),
        direction: s,
        inputEvent: d
      };
      return (i = r.requestScroll) === null || i === void 0 || i.call(r, m), this.emit("scroll", m), this._isWait = !1, c || this.checkScroll(sr(sr({}, r), {
        prevScrollPos: v,
        direction: s,
        inputEvent: d
      }));
    }
  }, n._registerScrollEvent = function(r) {
    this._unregisterScrollEvent();
    var a = r.checkScrollEvent;
    if (a) {
      var i = a === !0 ? hu : a, o = Ha(r.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = hu(window, this._onScroll) : this._unregister = i(o, this._onScroll);
    }
  }, n._unregisterScrollEvent = function() {
    var r;
    (r = this._unregister) === null || r === void 0 || r.call(this), this._unregister = null;
  }, e;
})(ha);
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
function _0() {
  for (var t = 0, e = 0, n = arguments.length; e < n; e++) t += arguments[e].length;
  for (var r = Array(t), a = 0, e = 0; e < n; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) r[a] = i[o];
  return r;
}
function ke(t) {
  return Dt(t, oe);
}
function j0(t, e) {
  return t.every(function(n, r) {
    return ke(n - e[r]) === 0;
  });
}
function I0(t, e) {
  return !ke(t[0] - e[0]) && !ke(t[1] - e[1]);
}
function Vr(t) {
  return t.length < 3 ? 0 : Math.abs(a0(t.map(function(e, n) {
    var r = t[n + 1] || t[0];
    return e[0] * r[1] - r[0] * e[1];
  }))) / 2;
}
function us(t, e) {
  var n = e.width, r = e.height, a = e.left, i = e.top, o = Jn(t), s = o.minX, l = o.minY, c = o.maxX, u = o.maxY, d = n / (c - s), f = r / (u - l);
  return t.map(function(h) {
    return [a + (h[0] - s) * d, i + (h[1] - l) * f];
  });
}
function Jn(t) {
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
function Ci(t, e, n) {
  var r = t[0], a = t[1], i = Jn(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], c = ki(l[0], l[1]), u = ds(e), d = [];
  if (u.forEach(function(v) {
    var m = ki(v[0], v[1]), y = v[0];
    if (j0(c, m))
      d.push({
        pos: t,
        line: v,
        type: "line"
      });
    else {
      var w = Ff(pl(c, m), [l, v]);
      w.forEach(function(S) {
        v.some(function(C) {
          return I0(C, S);
        }) ? d.push({
          pos: S,
          line: v,
          type: "point"
        }) : ke(y[1] - a) !== 0 && d.push({
          pos: S,
          line: v,
          type: "intersection"
        });
      });
    }
  }), _e(d, function(v) {
    return v[0] === r;
  }))
    return !0;
  var f = 0, h = {};
  return d.forEach(function(v) {
    var m = v.pos, y = v.type, w = v.line;
    if (!(m[0] > r))
      if (y === "intersection")
        ++f;
      else {
        if (y === "line")
          return;
        if (y === "point") {
          var S = _e(w, function(M) {
            return M[1] !== a;
          }), C = h[m[0]], k = S[1] > a ? 1 : -1;
          C ? C !== k && ++f : h[m[0]] = k;
        }
      }
  }), f % 2 === 1;
}
function ki(t, e) {
  var n = t[0], r = t[1], a = e[0], i = e[1], o = a - n, s = i - r;
  Math.abs(o) < oe && (o = 0), Math.abs(s) < oe && (s = 0);
  var l = 0, c = 0, u = 0;
  return o ? s ? (l = -s / o, c = 1, u = -l * n - r) : (c = 1, u = -r) : s && (l = -1, u = n), [l, c, u];
}
function pl(t, e) {
  var n = t[0], r = t[1], a = t[2], i = e[0], o = e[1], s = e[2], l = n === 0 && i === 0, c = r === 0 && o === 0, u = [];
  if (l && c)
    return [];
  if (l) {
    var d = -a / r, f = -s / o;
    return d !== f ? [] : [[-1 / 0, d], [1 / 0, d]];
  } else if (c) {
    var h = -a / n, v = -s / i;
    return h !== v ? [] : [[h, -1 / 0], [h, 1 / 0]];
  } else if (n === 0) {
    var m = -a / r, y = -(o * m + s) / i;
    u = [[y, m]];
  } else if (i === 0) {
    var m = -s / o, y = -(r * m + a) / n;
    u = [[y, m]];
  } else if (r === 0) {
    var y = -a / n, m = -(i * y + s) / o;
    u = [[y, m]];
  } else if (o === 0) {
    var y = -s / i, m = -(n * y + a) / r;
    u = [[y, m]];
  } else {
    var y = (r * s - o * a) / (o * n - r * i), m = -(n * y + a) / r;
    u = [[y, m]];
  }
  return u.map(function(w) {
    return [w[0], w[1]];
  });
}
function Ff(t, e) {
  var n = e.map(function(d) {
    return [0, 1].map(function(f) {
      return [Math.min(d[0][f], d[1][f]), Math.max(d[0][f], d[1][f])];
    });
  }), r = [];
  if (t.length === 2) {
    var a = t[0], i = a[0], o = a[1];
    if (ke(i - t[1][0])) {
      if (!ke(o - t[1][1])) {
        var c = Math.max.apply(Math, n.map(function(d) {
          return d[0][0];
        })), u = Math.min.apply(Math, n.map(function(d) {
          return d[0][1];
        }));
        if (ke(c - u) > 0)
          return [];
        r = [[c, o], [u, o]];
      }
    } else {
      var s = Math.max.apply(Math, n.map(function(d) {
        return d[1][0];
      })), l = Math.min.apply(Math, n.map(function(d) {
        return d[1][1];
      }));
      if (ke(s - l) > 0)
        return [];
      r = [[i, s], [i, l]];
    }
  }
  return r.length || (r = t.filter(function(d) {
    var f = d[0], h = d[1];
    return n.every(function(v) {
      return 0 <= ke(f - v[0][0]) && 0 <= ke(v[0][1] - f) && 0 <= ke(h - v[1][0]) && 0 <= ke(v[1][1] - h);
    });
  })), r.map(function(d) {
    return [ke(d[0]), ke(d[1])];
  });
}
function ds(t) {
  return _0(t.slice(1), [t[0]]).map(function(e, n) {
    return [t[n], e];
  });
}
function R0(t, e) {
  var n = t.slice(), r = e.slice();
  fu(n) === -1 && n.reverse(), fu(r) === -1 && r.reverse();
  var a = ds(n), i = ds(r), o = a.map(function(u) {
    return ki(u[0], u[1]);
  }), s = i.map(function(u) {
    return ki(u[0], u[1]);
  }), l = [];
  o.forEach(function(u, d) {
    var f = a[d], h = [];
    s.forEach(function(v, m) {
      var y = pl(u, v), w = Ff(y, [f, i[m]]);
      h.push.apply(h, w.map(function(S) {
        return {
          index1: d,
          index2: m,
          pos: S,
          type: "intersection"
        };
      }));
    }), h.sort(function(v, m) {
      return Qe(f[0], v.pos) - Qe(f[0], m.pos);
    }), l.push.apply(l, h), Ci(f[1], r) && l.push({
      index1: d,
      index2: -1,
      pos: f[1],
      type: "inside"
    });
  }), i.forEach(function(u, d) {
    if (Ci(u[1], n)) {
      var f = !1, h = mn(l, function(v) {
        var m = v.index2;
        return m === d ? (f = !0, !1) : !!f;
      });
      h === -1 && (f = !1, h = mn(l, function(v) {
        var m = v.index1, y = v.index2;
        return m === -1 && y + 1 === d ? (f = !0, !1) : !!f;
      })), h === -1 ? l.push({
        index1: -1,
        index2: d,
        pos: u[1],
        type: "inside"
      }) : l.splice(h, 0, {
        index1: -1,
        index2: d,
        pos: u[1],
        type: "inside"
      });
    }
  });
  var c = {};
  return l.filter(function(u) {
    var d = u.pos, f = d[0] + "x" + d[1];
    return c[f] ? !1 : (c[f] = !0, !0);
  });
}
function fs(t, e) {
  var n = R0(t, e);
  return n.map(function(r) {
    var a = r.pos;
    return a;
  });
}
function P0(t, e) {
  var n = fs(t, e);
  return Vr(n);
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
var ps = function(t, e) {
  return ps = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) r.hasOwnProperty(a) && (n[a] = r[a]);
  }, ps(t, e);
};
function N0(t, e) {
  ps(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var ne = function() {
  return ne = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, ne.apply(this, arguments);
};
function O0(t, e) {
  var n = e[0] - t[0], r = e[1] - t[1], a = Math.atan2(r, n);
  return a >= 0 ? a : a + Math.PI * 2;
}
function Do(t) {
  return O0([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function A0(t) {
  return t.touches && t.touches.length >= 2;
}
function Va(t) {
  return t ? t.touches ? z0(t.touches) : [Bf(t)] : [];
}
function L0(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function gu(t, e, n) {
  var r = n.length, a = Kr(t, r), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, c = Kr(e, r), u = c.clientX, d = c.clientY, f = Kr(n, r), h = f.clientX, v = f.clientY, m = i - u, y = o - d, w = i - h, S = o - v;
  return {
    clientX: s,
    clientY: l,
    deltaX: m,
    deltaY: y,
    distX: w,
    distY: S
  };
}
function To(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function z0(t) {
  for (var e = Math.min(t.length, 2), n = [], r = 0; r < e; ++r)
    n.push(Bf(t[r]));
  return n;
}
function Bf(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY
  };
}
function Kr(t, e) {
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
var _o = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), Do(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), Do(e) - Do(this.startClients);
  }, t.prototype.getPosition = function(e, n) {
    e === void 0 && (e = this.prevClients);
    var r = gu(e || this.prevClients, this.prevClients, this.startClients), a = r.deltaX, i = r.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, r;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var n = this.prevClients, r = this.startClients, a = Math.min(this.length, n.length), i = [], o = 0; o < a; ++o)
      i[o] = gu([e[o]], [n[o]], [r[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var n = this.movement;
    if (!e)
      return n;
    var r = Kr(e, this.length), a = Kr(this.prevClients, this.length), i = r.clientX - a.clientX, o = r.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + n;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), To(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), To(e) / To(this.startClients);
  }, t.prototype.move = function(e, n) {
    this.startClients.forEach(function(r) {
      r.clientX -= e, r.clientY -= n;
    }), this.prevClients.forEach(function(r) {
      r.clientX -= e, r.clientY -= n;
    });
  }, t;
})(), vu = ["textarea", "input"], Gf = /* @__PURE__ */ (function(t) {
  N0(e, t);
  function e(n, r) {
    r === void 0 && (r = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(f, h) {
      if (h === void 0 && (h = !0), !(!a.flag && f.cancelable === !1)) {
        var v = f.type.indexOf("drag") >= -1;
        if (!(a.flag && v)) {
          a._isDragAPI = !0;
          var m = a.options, y = m.container, w = m.pinchOutside, S = m.preventWheelClick, C = m.preventRightClick, k = m.preventDefault, M = m.checkInput, E = m.dragFocusedInput, D = m.preventClickEventOnDragStart, _ = m.preventClickEventOnDrag, j = m.preventClickEventByCondition, x = a._useTouch, I = !a.flag;
          if (a._isSecondaryButton = f.which === 3 || f.button === 2, S && (f.which === 2 || f.button === 1) || C && (f.which === 3 || f.button === 2))
            return a.stop(), !1;
          if (I) {
            var P = a._window.document.activeElement, R = f.target;
            if (R) {
              var N = R.tagName.toLowerCase(), F = vu.indexOf(N) > -1, q = R.isContentEditable;
              if (F || q) {
                if (M || !E && P === R)
                  return !1;
                if (P && (P === R || q && P.isContentEditable && P.contains(R)))
                  if (E)
                    R.blur();
                  else
                    return !1;
              } else if ((k || f.type === "touchstart") && P) {
                var z = P.tagName.toLowerCase();
                (P.isContentEditable || vu.indexOf(z) > -1) && P.blur();
              }
              (D || _ || j) && ae(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new _o(Va(f))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = h, a._dragFlag = !0, a._prevInputEvent = f, a.data = {}, a.doubleFlag = sa() - a.prevTime < 200, a._isMouseEvent = L0(f), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var B = a._preventMouseEvent || a.emit("dragStart", ne(ne({ data: a.data, datas: a.data, inputEvent: f, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: h, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
              f.preventDefault();
            }, preventDrag: function() {
              a._dragFlag = !1;
            } }));
            B === !1 && a.stop(), a._isMouseEvent && a.flag && k && f.preventDefault();
          }
          if (!a.flag)
            return !1;
          var Y = 0;
          if (I ? (a._attchDragEvent(), x && w && (Y = setTimeout(function() {
            ae(y, "touchstart", a.onDragStart, {
              passive: !1
            });
          }))) : x && w && Qt(y, "touchstart", a.onDragStart), a.flag && A0(f)) {
            if (clearTimeout(Y), I && f.touches.length !== f.changedTouches.length)
              return;
            a.pinchFlag || a.onPinchStart(f);
          }
        }
      }
    }, a.onDrag = function(f, h) {
      if (a.flag) {
        var v = a.options.preventDefault;
        !a._isMouseEvent && v && f.preventDefault(), a._prevInputEvent = f;
        var m = Va(f), y = a.moveClients(m, f, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || y.deltaX || y.deltaY) {
            var w = a._preventMouseEvent || a.emit("drag", ne(ne({}, y), { isScroll: !!h, inputEvent: f }));
            if (w === !1) {
              a.stop();
              return;
            }
          }
          a.pinchFlag && a.onPinch(f, m);
        }
        a.getCurrentStore().getPosition(m, !0);
      }
    }, a.onDragEnd = function(f) {
      if (a.flag) {
        var h = a.options, v = h.pinchOutside, m = h.container, y = h.preventClickEventOnDrag, w = h.preventClickEventOnDragStart, S = h.preventClickEventByCondition, C = a.isDrag;
        (y || w || S) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !S && !w && y && !C && a._allowClickEvent(), a._useTouch && v && Qt(m, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(f);
        var k = f != null && f.touches ? Va(f) : [], M = k.length;
        M === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new _o(k));
        var E = a._getPosition(), D = sa(), _ = !C && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = C || _ ? 0 : D, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", ne({ data: a.data, datas: a.data, isDouble: _, isDrag: C, isClick: !C, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: f, isTrusted: a._isTrusted }, E)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
          a._preventMouseEvent = !1;
        }, 200)), a._isIdle = !0);
      }
    }, a.onBlur = function() {
      a.onDragEnd();
    }, a._allowClickEvent = function() {
      Qt(a._window, "click", a._onClick, !0);
    }, a._onClick = function(f) {
      a._allowClickEvent(), a._allowMouseEvent();
      var h = a.options.preventClickEventByCondition;
      h != null && h(f) || (f.stopPropagation(), f.preventDefault());
    }, a._onContextMenu = function(f) {
      var h = a.options;
      h.preventRightClick ? a.onDragEnd(f) : f.preventDefault();
    }, a._passCallback = function() {
    };
    var i = [].concat(n), o = i[0];
    a._window = Rf(o) ? o : Le(o), a.options = ne({ checkInput: !1, container: o && !("document" in o) ? Le(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, r);
    var s = a.options, l = s.container, c = s.events, u = s.checkWindowBlur;
    if (a._useDrag = c.indexOf("drag") > -1, a._useTouch = c.indexOf("touch") > -1, a._useMouse = c.indexOf("mouse") > -1, a.targets = i, a._useDrag && i.forEach(function(f) {
      ae(f, "dragstart", a.onDragStart);
    }), a._useMouse && (i.forEach(function(f) {
      ae(f, "mousedown", a.onDragStart), ae(f, "mousemove", a._passCallback);
    }), ae(l, "contextmenu", a._onContextMenu)), u && ae(Le(), "blur", a.onBlur), a._useTouch) {
      var d = {
        passive: !1
      };
      i.forEach(function(f) {
        ae(f, "touchstart", a.onDragStart, d), ae(f, "touchmove", a._passCallback, d);
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
    return n === void 0 && (n = this._prevInputEvent), ne(ne({ data: this.data, datas: this.data }, this._getPosition()), { movement: this.getMovement(), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, inputEvent: n });
  }, e.prototype.getEventData = function() {
    return this.data;
  }, e.prototype.getEventDatas = function() {
    return this.data;
  }, e.prototype.unset = function() {
    var n = this, r = this.targets, a = this.options.container;
    this.off(), Qt(this._window, "blur", this.onBlur), this._useDrag && r.forEach(function(i) {
      Qt(i, "dragstart", n.onDragStart);
    }), this._useMouse && (r.forEach(function(i) {
      Qt(i, "mousedown", n.onDragStart);
    }), Qt(a, "contextmenu", this._onContextMenu)), this._useTouch && (r.forEach(function(i) {
      Qt(i, "touchstart", n.onDragStart);
    }), Qt(a, "touchstart", this.onDragStart)), this._prevInputEvent = null, this._allowClickEvent(), this._dettachDragEvent();
  }, e.prototype.onPinchStart = function(n) {
    var r = this, a = this.options.pinchThreshold;
    if (!(this.isDrag && this.getMovement() > a)) {
      var i = new _o(Va(n));
      this.pinchFlag = !0, this._addStore(i);
      var o = this.emit("pinchStart", ne(ne({ data: this.data, datas: this.data, angle: i.getAngle(), touches: this.getCurrentStore().getPositions() }, i.getPosition()), { inputEvent: n, isTrusted: this._isTrusted, preventDefault: function() {
        n.preventDefault();
      }, preventDrag: function() {
        r._dragFlag = !1;
      } }));
      o === !1 && (this.pinchFlag = !1);
    }
  }, e.prototype.onPinch = function(n, r) {
    if (!(!this.flag || !this.pinchFlag || r.length < 2)) {
      var a = this.getCurrentStore();
      this.isPinch = !0, this.emit("pinch", ne(ne({ data: this.data, datas: this.data, movement: this.getMovement(r), angle: a.getAngle(r), rotation: a.getRotation(r), touches: a.getPositions(r), scale: a.getScale(r), distance: a.getDistance(r) }, a.getPosition(r)), { inputEvent: n, isTrusted: this._isTrusted }));
    }
  }, e.prototype.onPinchEnd = function(n) {
    if (this.pinchFlag) {
      var r = this.isPinch;
      this.isPinch = !1, this.pinchFlag = !1;
      var a = this.getCurrentStore();
      this.emit("pinchEnd", ne(ne({ data: this.data, datas: this.data, isPinch: r, touches: a.getPositions() }, a.getPosition()), { inputEvent: n }));
    }
  }, e.prototype.getCurrentStore = function() {
    return this.clientStores[0];
  }, e.prototype.moveClients = function(n, r, a) {
    var i = this._getPosition(n, a), o = this.isDrag;
    (i.deltaX || i.deltaY) && (this.isDrag = !0);
    var s = !1;
    return !o && this.isDrag && (s = !0), ne(ne({ data: this.data, datas: this.data }, i), { movement: this.getMovement(n), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, isMouseEvent: this._isMouseEvent, isSecondaryButton: this._isSecondaryButton, inputEvent: r, isTrusted: this._isTrusted, isFirstDrag: s });
  }, e.prototype._addStore = function(n) {
    this.clientStores.splice(0, 0, n);
  }, e.prototype._getPosition = function(n, r) {
    var a = this.getCurrentStore(), i = a.getPosition(n, r), o = this.clientStores.slice(1).reduce(function(c, u) {
      var d = u.getPosition();
      return c.distX += d.distX, c.distY += d.distY, c;
    }, i), s = o.distX, l = o.distY;
    return ne(ne({}, i), { distX: s, distY: l });
  }, e.prototype._attchDragEvent = function() {
    var n = this._window, r = this.options.container, a = {
      passive: !1
    };
    this._isDragAPI && (ae(r, "dragover", this.onDrag, a), ae(n, "dragend", this.onDragEnd)), this._useMouse && (ae(r, "mousemove", this.onDrag), ae(n, "mouseup", this.onDragEnd)), this._useTouch && (ae(r, "touchmove", this.onDrag, a), ae(n, "touchend", this.onDragEnd, a), ae(n, "touchcancel", this.onDragEnd, a));
  }, e.prototype._dettachDragEvent = function() {
    var n = this._window, r = this.options.container;
    this._isDragAPI && (Qt(r, "dragover", this.onDrag), Qt(n, "dragend", this.onDragEnd)), this._useMouse && (Qt(r, "mousemove", this.onDrag), Qt(n, "mouseup", this.onDragEnd)), this._useTouch && (Qt(r, "touchstart", this.onDragStart), Qt(r, "touchmove", this.onDrag), Qt(n, "touchend", this.onDragEnd), Qt(n, "touchcancel", this.onDragEnd));
  }, e.prototype._allowMouseEvent = function() {
    this._preventMouseEvent = !1, clearTimeout(this._preventMouseEventId);
  }, e;
})(ha);
function F0(t) {
  for (var e = 5381, n = t.length; n; )
    e = e * 33 ^ t.charCodeAt(--n);
  return e >>> 0;
}
var B0 = F0;
function G0(t) {
  return B0(t).toString(36);
}
function $0(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function W0(t, e, n) {
  return n.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(r, a) {
    var i = a.trim();
    return (i ? Xn(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function Y0(t, e, n, r, a) {
  var i = Ke(r), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), n.nonce && o.setAttribute("nonce", n.nonce), o.innerHTML = W0(t, e, n), (a || i.head || i.body).appendChild(o), o;
}
function $f(t) {
  var e = "rCS" + G0(t);
  return {
    className: e,
    inject: function(n, r) {
      r === void 0 && (r = {});
      var a = $0(n), i = (a || n.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = Y0(e, t, r, n, a);
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
var hs = function() {
  return hs = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, hs.apply(this, arguments);
};
function X0(t, e) {
  var n = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, r = Object.getOwnPropertySymbols(t); a < r.length; a++)
    e.indexOf(r[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[a]) && (n[r[a]] = t[r[a]]);
  return n;
}
function Wf(t, e) {
  var n = $f(e), r = n.className;
  return G.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = X0(a, ["className", "cspNonce"]), c = G.useRef();
    return G.useImperativeHandle(i, function() {
      return c.current;
    }, []), G.useEffect(function() {
      var u = n.inject(c.current, {
        nonce: a.cspNonce
      });
      return function() {
        u.destroy();
      };
    }, []), G.createElement(t, hs({
      ref: c,
      "data-styled-id": r,
      className: "".concat(s, " ").concat(r)
    }, l));
  });
}
var gs = function(t, e) {
  return gs = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (n[a] = r[a]);
  }, gs(t, e);
};
function ga(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  gs(t, e);
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
function H0(t, e) {
  var n = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, r = Object.getOwnPropertySymbols(t); a < r.length; a++)
      e.indexOf(r[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[a]) && (n[r[a]] = t[r[a]]);
  return n;
}
function V0(t, e, n, r) {
  var a = arguments.length, i = a < 3 ? e : r, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, n, r);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, n, i) : o(e, n)) || i);
  return a > 3 && i && Object.defineProperty(e, n, i), i;
}
function K0(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, n = e && t[e], r = 0;
  if (n) return n.call(t);
  if (t && typeof t.length == "number") return {
    next: function() {
      return t && r >= t.length && (t = void 0), { value: t && t[r++], done: !t };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function A(t, e) {
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
function va(t, e) {
  return O({ events: [], props: [], name: t }, e);
}
var q0 = ["n", "w", "s", "e"], hl = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function U0(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function Z0(t) {
  var e = U0(1, t), n = Math.round(t / 45) * 45 % 180, r = "ns-resize";
  return n === 135 ? r = "nwse-resize" : n === 45 ? r = "nesw-resize" : n === 90 && (r = "ew-resize"), "cursor:".concat(r, ";cursor: url('").concat(e, "') 16 16, ").concat(r, ";");
}
var Dr = Wm(), Yf = Dr.browser.webkit, Xf = Yf && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), Hf = Dr.browser.name, Vf = parseInt(Dr.browser.version, 10), J0 = Hf === "chrome", Q0 = Dr.browser.chromium, tx = parseInt(Dr.browser.chromiumVersion, 10) || 0, ex = J0 && Vf >= 109 || Q0 && tx >= 109, nx = Hf === "firefox", rx = parseInt(Dr.browser.webkitVersion, 10) >= 612 || Vf >= 15, gl = "moveable-", ax = hl.map(function(t) {
  var e = "", n = "", r = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (n = "left: ".concat(i, ";"), r = "right"), t.indexOf("e") > -1 && (n = "left: 0px;", r = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(n).concat(e, `
        transform-origin: `).concat(r, " ").concat(a, `;
    }`);
}).join(`
`), ix = `
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
`.concat(ax, `
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
`).concat(Z0(t), `
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

`).concat(Xf ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), ox = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], vs = 1e-4, Ce = 1e-7, Ka = 1e-9, ms = Math.pow(10, 10), mu = -ms, sx = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, vl = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, Kf = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, lx = [
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
function ma(t, e, n, r, a, i) {
  var o, s;
  i === void 0 && (i = "draggable");
  var l = (s = (o = e.gestos[i]) === null || o === void 0 ? void 0 : o.move(n, t.inputEvent)) !== null && s !== void 0 ? s : {}, c = l.originalDatas || l.datas, u = c[i] || (c[i] = {});
  return O(O({}, l), { isPinch: !!r, parentEvent: !0, datas: u, originalDatas: t.originalDatas });
}
var xr = /* @__PURE__ */ (function() {
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
function hr(t, e, n, r) {
  var a = t.length === 16, i = a ? 4 : 3, o = er(t, n, r, i), s = A(o, 4), l = A(s[0], 2), c = l[0], u = l[1], d = A(s[1], 2), f = d[0], h = d[1], v = A(s[2], 2), m = v[0], y = v[1], w = A(s[3], 2), S = w[0], C = w[1], k = A(Ut(t, e, i), 2), M = k[0], E = k[1], D = Math.min(c, f, m, S), _ = Math.min(u, h, y, C), j = Math.max(c, f, m, S), x = Math.max(u, h, y, C);
  c = c - D || 0, f = f - D || 0, m = m - D || 0, S = S - D || 0, u = u - _ || 0, h = h - _ || 0, y = y - _ || 0, C = C - _ || 0, M = M - D || 0, E = E - _ || 0;
  var I = t[0], P = t[i + 1], R = we(I * P);
  return {
    left: D,
    top: _,
    right: j,
    bottom: x,
    origin: [M, E],
    pos1: [c, u],
    pos2: [f, h],
    pos3: [m, y],
    pos4: [S, C],
    direction: R
  };
}
function qf(t, e) {
  var n = e.clientX, r = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, c = i.pos1, u = o.left, d = o.top, f = l ? 4 : 3, h = A(wt(wr(s, [n - u, r - d], f), c), 2), v = h[0], m = h[1], y = A(en({ datas: a, distX: v, distY: m }), 2), w = y[0], S = y[1];
  return [w, S];
}
function tr(t, e) {
  var n = e.datas, r = t.state, a = r.allMatrix, i = r.beforeMatrix, o = r.is3d, s = r.left, l = r.top, c = r.origin, u = r.offsetMatrix, d = r.targetMatrix, f = r.transformOrigin, h = o ? 4 : 3;
  n.is3d = o, n.matrix = a, n.targetMatrix = d, n.beforeMatrix = i, n.offsetMatrix = u, n.transformOrigin = f, n.inverseMatrix = Ue(a, h), n.inverseBeforeMatrix = Ue(i, h), n.absoluteOrigin = Un(Ot([s, l], c), h), n.startDragBeforeDist = ve(n.inverseBeforeMatrix, n.absoluteOrigin, h), n.startDragDist = ve(n.inverseMatrix, n.absoluteOrigin, h);
}
function cx(t) {
  return hr(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function Fi(t, e, n) {
  var r = e.datas, a = e.originalDatas.beforeRenderable, i = r.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, c = -1;
  i === -1 ? (n === "translate" ? c = 0 : n === "rotate" && (c = mn(o, function(h) {
    return h.match(/scale\(/g);
  })), c === -1 && (c = o.length), r.transformIndex = c) : _e(l, function(h) {
    return h.index === i && h.functionName === n;
  }) ? c = i : c = i + l.filter(function(h) {
    return h.index < i;
  }).length;
  var u = Oy(o, t.state, c), d = u.targetFunction, f = n === "rotate" ? "rotateZ" : n;
  r.beforeFunctionTexts = u.beforeFunctionTexts, r.afterFunctionTexts = u.afterFunctionTexts, r.beforeTransform = u.beforeFunctionMatrix, r.beforeTransform2 = u.beforeFunctionMatrix2, r.targetTansform = u.targetFunctionMatrix, r.afterTransform = u.afterFunctionMatrix, r.afterTransform2 = u.afterFunctionMatrix2, r.targetAllTransform = u.allFunctionMatrix, d.functionName === f ? (r.afterFunctionTexts.splice(0, 1), r.isAppendTransform = !1) : s > c && (r.isAppendTransform = !0, a.nextTransformAppendedIndexes = ot(ot([], A(l), !1), [{
    functionName: n,
    index: c,
    isAppend: !0
  }], !1));
}
function Bi(t, e, n) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? n : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function ux(t) {
  var e = t.datas, n = t.distX, r = t.distY, a = A(Zf({ datas: e, distX: n, distY: r }), 2), i = a[0], o = a[1], s = Uf(e, f0([i, o], 4));
  return ve(s, Un([0, 0, 0], 4), 4);
}
function Uf(t, e, n) {
  var r = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = n ? Bt(s, e, 4) : Bt(e, s, 4), c = Bt(Ue(n ? i : r, 4), l, 4), u = Bt(c, Ue(n ? o : a, 4), 4);
  return u;
}
function Zf(t) {
  var e = t.datas, n = t.distX, r = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return wt(ve(a, Ot(s, [n, r]), l), o);
}
function en(t, e) {
  var n = t.datas, r = t.distX, a = t.distY, i = n.inverseBeforeMatrix, o = n.inverseMatrix, s = n.is3d, l = n.startDragBeforeDist, c = n.startDragDist, u = n.absoluteOrigin, d = s ? 4 : 3;
  return wt(ve(e ? i : o, Ot(u, [r, a]), d), e ? l : c);
}
function dx(t, e) {
  var n = t.datas, r = t.distX, a = t.distY;
  n.beforeMatrix;
  var i = n.matrix, o = n.is3d;
  n.startDragBeforeDist;
  var s = n.startDragDist, l = n.absoluteOrigin, c = o ? 4 : 3;
  return wt(ve(i, Ot(s, [r, a]), c), l);
}
function fx(t, e, n, r, a, i) {
  return r === void 0 && (r = e), a === void 0 && (a = n), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = qn(o), c = l.value, u = l.unit, d = s ? a : r, f = s ? n : e;
    if (o === "%" || isNaN(c)) {
      var h = d ? i[s] / d : 0;
      return f * h;
    } else if (u !== "%")
      return c;
    return f * c / 100;
  }) : i;
}
function Jf(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function px(t, e) {
  return Jf(e).map(function(n) {
    return t[n];
  });
}
function jo(t, e) {
  var n = (e + 1) / 2;
  return [
    bi(t[0][0], t[1][0], n, 1 - n),
    bi(t[0][1], t[1][1], n, 1 - n)
  ];
}
function ce(t, e) {
  var n = jo([t[0], t[1]], e[0]), r = jo([t[2], t[3]], e[0]);
  return jo([n, r], e[1]);
}
function hx(t, e, n, r, a, i) {
  var o = er(e, n, r, a), s = ce(o, i), l = t[0] - s[0], c = t[1] - s[1];
  return [l, c];
}
function xa(t, e, n, r) {
  return Bt(t, Ur(e, r, n), r);
}
function gx(t, e, n, r) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (Fe(n)) {
    var c = e.beforeTransform, u = e.afterTransform;
    r ? l = Ze(vr(n), 4, s) : l = Ze(Bt(Bt(c, vr([n]), 4), u, 4), 4, s);
  } else
    l = n;
  return xa(i, l, a, s);
}
function vx(t, e) {
  var n = t.transformOrigin, r = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return xa(r, Bt(o || i, cl(e, s), s), n, s);
}
function Gi(t, e) {
  var n = Tr(e);
  return {
    setTransform: function(r, a) {
      a === void 0 && (a = -1), n.startTransforms = te(r) ? r : _n(r), xs(t, e, a);
    },
    setTransformIndex: function(r) {
      xs(t, e, r);
    }
  };
}
function $i(t, e, n) {
  var r = Tr(e), a = r.startTransforms;
  xs(t, e, mn(a, function(i) {
    return i.indexOf("".concat(n, "(")) === 0;
  }));
}
function xs(t, e, n) {
  var r = Tr(e), a = e.datas;
  if (a.transformIndex = n, n !== -1) {
    var i = r.startTransforms[n];
    if (i) {
      var o = t.state, s = mr([i], {
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
function ml(t, e) {
  var n = Tr(t);
  n.nextTransforms = _n(e);
}
function Tr(t) {
  return t.originalDatas.beforeRenderable;
}
function Ei(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function qa(t) {
  return (Ei(t) || []).join(" ");
}
function Ua(t) {
  return Tr(t).nextStyle;
}
function Qf(t, e, n, r, a) {
  ml(a, e);
  var i = be.drag(t, ma(a, t.state, n, r)), o = i ? i.transform : e;
  return O(O({ transform: e, drag: i }, Se({
    transform: o
  }, a)), { afterTransform: o });
}
function xl(t, e, n, r, a, i) {
  var o = gx(t.state, a, e, i), s = yx(t, n, r, o);
  return s;
}
function tp(t, e, n, r, a, i, o) {
  var s = xl(t, e, n, a, i, o), l = t.state, c = l.left, u = l.top, d = t.props.groupable, f = d ? c : 0, h = d ? u : 0, v = wt(r, s);
  return wt(v, [f, h]);
}
function mx(t, e, n, r, a, i, o) {
  var s = tp(t, e, n, r, a, i, o);
  return s;
}
function xx(t, e, n) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    n ? -1 + t[1] / (n / 2) : 0
  ];
}
function yx(t, e, n, r) {
  r === void 0 && (r = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, c = [
    i / 2 * (1 + e[0]) + n[0],
    o / 2 * (1 + e[1]) + n[1]
  ];
  return Ut(r, c, l);
}
function bx(t, e, n) {
  var r = n.fixedDirection, a = n.fixedPosition, i = n.fixedOffset;
  return tp(t, "rotate(".concat(e, "deg)"), r, a, i, n);
}
function wx(t, e, n, r, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, c = s.offsetMatrix, u = s.is3d, d = s.width, f = s.height, h = s.left, v = s.top, m = i.fixedDirection, y = i.nextTargetMatrix || s.targetMatrix, w = u ? 4 : 3, S = fx(a, e, n, d, f, l), C = o ? h : 0, k = o ? v : 0, M = xa(c, y, S, w), E = hx(r, M, e, n, w, m);
  return wt(E, [C, k]);
}
function Sx(t, e) {
  return ce(Ge(t.state), e);
}
function Cx(t, e) {
  var n = t.targetGesto, r = t.controlGesto, a;
  return n != null && n.isFlag() && (a = n.getEventData()[e]), !a && (r != null && r.isFlag()) && (a = r.getEventData()[e]), a || {};
}
function kx(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function Ex(t) {
  var e = t("scale"), n = t("rotate"), r = t("translate"), a = [];
  return r && r !== "0px" && r !== "none" && a.push("translate(".concat(r.split(/\s+/).join(","), ")")), n && n !== "1" && n !== "none" && a.push("rotate(".concat(n, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function ep(t, e, n) {
  for (var r = t, a = [], i = ll(t) || Pn(t), o = !n && t === e || t === i, s = o, l = !1, c = 3, u, d, f, h = !1, v = ua(e, e, !0).offsetParent, m = 1; r && !s; ) {
    s = o;
    var y = Ee(r), w = y("position"), S = Ep(r), C = w === "fixed", k = Ex(y), M = p0(Sy(S)), E = void 0, D = !1, _ = !1, j = 0, x = 0, I = 0, P = 0, R = {
      hasTransform: !1,
      fixedContainer: null
    };
    C && (h = !0, R = Dy(r), v = R.fixedContainer);
    var N = M.length;
    !l && (N === 16 || k.length) && (l = !0, c = 4, ks(a), f && (f = Ze(f, 3, 4))), l && N === 9 && (M = Ze(M, 3, 4));
    var F = My(r, t), q = F.tagName, z = F.hasOffset, B = F.isSVG, Y = F.origin, V = F.targetOrigin, W = F.offset, tt = A(W, 2), J = tt[0], rt = tt[1];
    q === "svg" && !r.ownerSVGElement && f && (a.push({
      type: "target",
      target: r,
      matrix: Ty(r, c)
    }), a.push({
      type: "offset",
      target: r,
      matrix: Xt(c)
    }));
    var Q = parseFloat(y("zoom")) || 1;
    if (C)
      E = R.fixedContainer, D = !0;
    else {
      var at = ua(r, e, !1, !0, y), ft = at.offsetZoom;
      if (E = at.offsetParent, D = at.isEnd, _ = at.isStatic, m *= ft, (at.isCustomElement || ft !== 1) && _)
        J -= E.offsetLeft, rt -= E.offsetTop;
      else if (nx || ex) {
        var Z = at.parentSlotElement;
        if (Z) {
          for (var ut = E, vt = 0, nt = 0; ut && kx(ut); )
            vt += ut.offsetLeft, nt += ut.offsetTop, ut = ut.offsetParent;
          J -= vt, rt -= nt;
        }
      }
    }
    if (Yf && !rx && z && !B && _ && (w === "relative" || w === "static") && (J -= E.offsetLeft, rt -= E.offsetTop, o = o || D), C)
      z && R.hasTransform && (I = E.clientLeft, P = E.clientTop);
    else if (z && v !== E && (j = E.clientLeft, x = E.clientTop), z && E === i) {
      var pt = Mp(r, !1);
      J += pt[0], rt += pt[1];
    }
    if (a.push({
      type: "target",
      target: r,
      matrix: Ur(M, c, Y)
    }), k.length && (a.push({
      type: "offset",
      target: r,
      matrix: Xt(c)
    }), a.push({
      type: "target",
      target: r,
      matrix: Ur(vr(k), c, Y)
    })), z) {
      var jt = r === t, st = jt ? 0 : r.scrollLeft, lt = jt ? 0 : r.scrollTop;
      a.push({
        type: "offset",
        target: r,
        matrix: Zn([
          J - st + j - I,
          rt - lt + x - P
        ], c)
      });
    } else
      a.push({
        type: "offset",
        target: r,
        origin: Y
      });
    if (Q !== 1 && a.push({
      type: "zoom",
      target: r,
      matrix: Ur(cl([Q, Q], c), c, [0, 0])
    }), f || (f = M), u || (u = Y), d || (d = V), s || C)
      break;
    r = E, o = D, (!n || r === i) && (s = o);
  }
  return f || (f = Xt(c)), u || (u = [0, 0]), d || (d = [0, 0]), {
    zoom: m,
    offsetContainer: v,
    matrixes: a,
    targetMatrix: f,
    transformOrigin: u,
    targetOrigin: d,
    is3d: l,
    hasFixed: h
  };
}
var Gn = null, $n = null, lr = null;
function yr(t) {
  t ? (window.Map && (Gn = /* @__PURE__ */ new Map(), $n = /* @__PURE__ */ new Map()), lr = []) : (Gn = null, lr = null, $n = null);
}
function Mx(t) {
  var e = $n == null ? void 0 : $n.get(t);
  if (e)
    return e;
  var n = Zr(t, !0);
  return $n && $n.set(t, n), n;
}
function Dx(t, e) {
  if (lr) {
    var n = _e(lr, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (n)
      return n[1];
  }
  var r = ep(t, e, !0);
  return lr && lr.push([[t, e], r]), r;
}
function Ee(t) {
  var e = Gn == null ? void 0 : Gn.get(t);
  if (!e) {
    var n = Le(t).getComputedStyle(t);
    if (!Gn)
      return function(i) {
        return n[i];
      };
    e = {
      style: n,
      cached: {}
    }, Gn.set(t, e);
  }
  var r = e.cached, a = e.style;
  return function(i) {
    return i in r || (r[i] = a[i]), r[i];
  };
}
function qe(t, e, n) {
  var r = n.originalDatas;
  r.groupable = r.groupable || {};
  var a = r.groupable;
  a.childDatas = a.childDatas || [];
  var i = a.childDatas;
  return t.moveables.map(function(o, s) {
    return i[s] = i[s] || {}, i[s][e] = i[s][e] || {}, O(O({}, n), { isRequestChild: !0, datas: i[s][e], originalDatas: i[s] });
  });
}
function Io(t, e, n, r, a, i, o) {
  var s = !!n.match(/Start$/g), l = !!n.match(/End$/g), c = a.isPinch, u = a.datas, d = qe(t, e.name, a), f = t.moveables, h = [], v = d.map(function(m, y) {
    var w = f[y], S = w.state, C = S.gestos, k = m;
    if (s)
      k = new xr(o).dragStart(r, m), h.push(k);
    else {
      if (C[o] || (C[o] = u.childGestos[y]), !C[o])
        return;
      k = ma(m, S, r, c, i, o), h.push(k);
    }
    var M = e[n](w, O(O({}, k), { parentFlag: !0 }));
    return l && (C[o] = null), M;
  });
  return s && (u.childGestos = f.map(function(m) {
    return m.state.gestos[o];
  })), {
    eventParams: v,
    childEvents: h
  };
}
function vn(t, e, n, r, a, i) {
  a === void 0 && (a = function(u, d) {
    return d;
  });
  var o = !!n.match(/End$/g), s = qe(t, e.name, r), l = t.moveables, c = s.map(function(u, d) {
    var f = l[d], h = u;
    h = a(f, u);
    var v = e[n](f, O(O({}, h), { parentFlag: !0 }));
    return o && (f.state.gestos = {}), v;
  });
  return c;
}
function Mi(t, e, n, r) {
  var a = n.fixedDirection, i = n.fixedPosition, o = r.datas.startPositions || Ge(e.state), s = ce(o, a), l = A(ve(pa(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), c = l[0], u = l[1];
  return r.datas.originalX = c, r.datas.originalY = u, r;
}
function np(t, e, n, r) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = Qn(t.props, e).zoom, c = qr(o / Math.PI * 180), u = {}, d = t.renderState;
  d.renderDirectionMap || (d.renderDirectionMap = {});
  var f = d.renderDirectionMap;
  n.forEach(function(v) {
    var m = v.dir;
    u[m] = !0;
  });
  var h = we(s);
  return n.map(function(v) {
    var m = v.data, y = v.classNames, w = v.dir, S = vl[w];
    if (!S || !u[w])
      return null;
    f[w] = !0;
    var C = (Dt(c, 15) + h * Kf[w] + 720) % 180, k = {};
    return Mr(m).forEach(function(M) {
      k["data-".concat(M)] = m[M];
    }), r.createElement("div", O({ className: bt.apply(void 0, ot(["control", "direction", w, e], A(y), !1)), "data-rotation": C, "data-direction": w }, k, { key: "direction-".concat(w), style: ji.apply(void 0, ot([o, l], A(S.map(function(M) {
      return i[M];
    })), !1)) }));
  });
}
function rp(t, e, n, r) {
  var a = Qn(t.props, n), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? hl : o;
  return ot(ot([], A(s ? sp(t, r, n, l) : []), !1), A(np(t, n, l.map(function(c) {
    return {
      data: {},
      classNames: [],
      dir: c
    };
  }), r)), !1);
}
function ca(t, e, n, r, a, i) {
  for (var o = [], s = 6; s < arguments.length; s++)
    o[s - 6] = arguments[s];
  var l = ee(n, r), c = e ? Dt(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: bt.apply(void 0, ot(["line", "direction", e ? "edge" : "", e], A(o), !1)), "data-rotation": c, "data-line-key": i, "data-direction": e, style: Wr(n, r, a, l) });
}
function ap(t, e, n, r, a) {
  var i = n === !0 ? q0 : n;
  return i.map(function(o, s) {
    var l = A(vl[o], 2), c = l[0], u = l[1];
    if (u != null)
      return ca(t, o, r[c], r[u], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function ip(t) {
  return function(e, n) {
    var r = Qn(e.props, t).edge;
    return r && (r === !0 || r.length) ? ot(ot([], A(ap(n, t, r, e.getState().renderPoses, e.props.zoom)), !1), A(Tx(e, t, n)), !1) : op(e, t, n);
  };
}
function op(t, e, n) {
  return rp(t, hl, e, n);
}
function Tx(t, e, n) {
  return rp(t, ["nw", "ne", "sw", "se"], e, n);
}
function sp(t, e, n, r) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, c = a.renderDirectionMap, u = t.props.zoom, d = we(l), f = s / Math.PI * 180;
  return (r || Mr(c)).map(function(h) {
    var v = vl[h];
    if (!v)
      return null;
    var m = (Dt(f, 15) + d * Kf[h] + 720) % 180, y = ["around-control"];
    return n && y.push("direction", n), e.createElement("div", { className: bt.apply(void 0, ot([], A(y), !1)), "data-rotation": m, "data-direction": h, key: "direction-around-".concat(h), style: ji.apply(void 0, ot([s, u], A(v.map(function(w) {
      return o[w];
    })), !1)) });
  });
}
function yl(t, e, n) {
  var r = t || {}, a = r.position, i = a === void 0 ? "client" : a, o = r.left, s = o === void 0 ? -1 / 0 : o, l = r.top, c = l === void 0 ? -1 / 0 : l, u = r.right, d = u === void 0 ? 1 / 0 : u, f = r.bottom, h = f === void 0 ? 1 / 0 : f, v = {
    position: i,
    left: s,
    top: c,
    right: d,
    bottom: h
  };
  return {
    vertical: xu(v, e, !0),
    horizontal: xu(v, n, !1)
  };
}
function Wi(t, e) {
  var n = t.state, r = n.containerClientRect, a = r.clientHeight, i = r.clientWidth, o = r.clientLeft, s = r.clientTop, l = n.snapOffset, c = l.left, u = l.top, d = l.right, f = l.bottom, h = e || t.props.bounds || {}, v = h.position || "client", m = v === "css", y = h.left, w = y === void 0 ? -1 / 0 : y, S = h.top, C = S === void 0 ? -1 / 0 : S, k = h.right, M = k === void 0 ? m ? -1 / 0 : 1 / 0 : k, E = h.bottom, D = E === void 0 ? m ? -1 / 0 : 1 / 0 : E;
  return m && (M = i + d - c - M, D = a + f - u - D), {
    left: w + c - o,
    right: M + c - o,
    top: C + u - s,
    bottom: D + u - s
  };
}
function _x(t, e, n) {
  var r = Wi(t), a = r.left, i = r.top, o = r.right, s = r.bottom, l = A(n, 2), c = l[0], u = l[1], d = A(wt(n, e), 2), f = d[0], h = d[1];
  et(f) < Ce && (f = 0), et(h) < Ce && (h = 0);
  var v = h > 0, m = f > 0, y = {
    isBound: !1,
    offset: 0,
    pos: 0
  }, w = {
    isBound: !1,
    offset: 0,
    pos: 0
  };
  if (f === 0 && h === 0)
    return {
      vertical: y,
      horizontal: w
    };
  if (f === 0)
    v ? s < u && (w.pos = s, w.offset = u - s) : i > u && (w.pos = i, w.offset = u - i);
  else if (h === 0)
    m ? o < c && (y.pos = o, y.offset = c - o) : a > c && (y.pos = a, y.offset = c - a);
  else {
    var S = h / f, C = n[1] - S * c, k = 0, M = 0, E = !1;
    m && o <= c ? (k = S * o + C, M = o, E = !0) : !m && c <= a && (k = S * a + C, M = a, E = !0), E && (k < i || k > s) && (E = !1), E || (v && s <= u ? (k = s, M = (k - C) / S, E = !0) : !v && u <= i && (k = i, M = (k - C) / S, E = !0)), E && (y.isBound = !0, y.pos = M, y.offset = c - M, w.isBound = !0, w.pos = k, w.offset = u - k);
  }
  return {
    vertical: y,
    horizontal: w
  };
}
function xu(t, e, n) {
  var r = t[n ? "left" : "top"], a = t[n ? "right" : "bottom"], i = Math.min.apply(Math, ot([], A(e), !1)), o = Math.max.apply(Math, ot([], A(e), !1)), s = [];
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
    return et(c.offset) - et(l.offset);
  });
}
function yu(t, e, n) {
  var r = n ? t.map(function(a) {
    return fa(a, n);
  }) : t;
  return r.some(function(a) {
    return a[0] < e.left && et(a[0] - e.left) > 0.1 || a[0] > e.right && et(a[0] - e.right) > 0.1 || a[1] < e.top && et(a[1] - e.top) > 0.1 || a[1] > e.bottom && et(a[1] - e.bottom) > 0.1;
  });
}
function jx(t, e, n) {
  var r = Be(t), a = Math.sqrt(r * r - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return et(i - t[n ? 0 : 1]) - et(o - t[n ? 0 : 1]);
  }).map(function(i) {
    return ee([0, 0], n ? [i, e] : [e, i]);
  });
}
function Ix(t, e, n, r, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = Wi(t), s = o.left, l = o.top, c = o.right, u = o.bottom, d = s - r[0], f = c - r[0], h = l - r[1], v = u - r[1], m = {
    left: d,
    top: h,
    right: f,
    bottom: v
  };
  if (!yu(n, m, 0))
    return [];
  var y = [];
  return [
    [d, 0],
    [f, 0],
    [h, 1],
    [v, 1]
  ].forEach(function(w) {
    var S = A(w, 2), C = S[0], k = S[1];
    n.forEach(function(M) {
      var E = ee([0, 0], M);
      y.push.apply(y, ot([], A(jx(M, C, k).map(function(D) {
        return i + D - E;
      }).filter(function(D) {
        return !yu(e, m, D);
      }).map(function(D) {
        return Dt(D * 180 / Math.PI, Ce);
      })), !1));
    });
  }), y;
}
var Rx = ["left", "right", "center"], Px = ["top", "bottom", "middle"], bu = {
  left: "start",
  right: "end",
  center: "center",
  top: "start",
  bottom: "end",
  middle: "center"
}, jn = {
  start: "left",
  end: "right",
  center: "center"
}, In = {
  start: "top",
  end: "bottom",
  center: "middle"
};
function cr() {
  return {
    left: !1,
    top: !1,
    right: !1,
    bottom: !1
  };
}
function _r(t, e) {
  var n = t.props, r = n.snappable, a = n.bounds, i = n.innerBounds, o = n.verticalGuidelines, s = n.horizontalGuidelines, l = n.snapGridWidth, c = n.snapGridHeight, u = t.state, d = u.guidelines, f = u.enableSnap;
  return !r || !f || e && r !== !0 && r.indexOf(e) < 0 ? !1 : !!(l || c || a || i || d && d.length || o && o.length || s && s.length);
}
function bl(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function Nx(t, e) {
  var n = bl(t), r = {};
  for (var a in n)
    a in e && n[a] && (r[a] = e[a]);
  return r;
}
function wl(t, e) {
  var n = Nx(t, e), r = Px.filter(function(i) {
    return i in n;
  }), a = Rx.filter(function(i) {
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
function Ox(t, e, n) {
  var r = Ut(t, [e.clientLeft, e.clientTop], n);
  return [
    e.left + r[0],
    e.top + r[1]
  ];
}
function Ax(t) {
  var e = A(t, 2), n = e[0], r = e[1], a = r[0] - n[0], i = r[1] - n[1];
  Math.abs(a) < oe && (a = 0), Math.abs(i) < oe && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * n[0] - n[1]) : (s = 1, l = -n[1]) : (o = -1, l = n[0]), [o, s, l].map(function(c) {
    return Dt(c, oe);
  });
}
var lp = "snapRotationThreshold", cp = "snapRotationDegrees", up = "snapHorizontalThreshold", dp = "snapVerticalThreshold";
function Yi(t, e, n, r, a, i, o) {
  var s;
  r === void 0 && (r = []), a === void 0 && (a = []);
  var l = t.props, c = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], u = Ou(o, l[up], 5), d = Ou(i, l[dp], 5);
  return fp(t.state.guidelines, e, n, r, a, u, d, c);
}
function fp(t, e, n, r, a, i, o, s) {
  return {
    vertical: Su(t, "vertical", e, o * s[0], r),
    horizontal: Su(t, "horizontal", n, i * s[1], a)
  };
}
function Lx(t, e, n) {
  var r = A(n, 2), a = r[0], i = r[1], o = A(e, 2), s = o[0], l = o[1], c = A(wt(n, e), 2), u = c[0], d = c[1], f = d > 0, h = u > 0;
  u = Ii(u), d = Ii(d);
  var v = {
    isSnap: !1,
    offset: 0,
    pos: 0
  }, m = {
    isSnap: !1,
    offset: 0,
    pos: 0
  };
  if (u === 0 && d === 0)
    return {
      vertical: v,
      horizontal: m
    };
  var y = Yi(t, u ? [a] : [], d ? [i] : [], [], [], void 0, void 0), w = y.vertical, S = y.horizontal;
  w.posInfos.filter(function(q) {
    var z = q.pos;
    return h ? z >= s : z <= s;
  }), S.posInfos.filter(function(q) {
    var z = q.pos;
    return f ? z >= l : z <= l;
  }), w.isSnap = w.posInfos.length > 0, S.isSnap = S.posInfos.length > 0;
  var C = ys(w), k = C.isSnap, M = C.guideline, E = ys(S), D = E.isSnap, _ = E.guideline, j = D ? _.pos[1] : 0, x = k ? M.pos[0] : 0;
  if (u === 0)
    D && (m.isSnap = !0, m.pos = _.pos[1], m.offset = i - m.pos);
  else if (d === 0)
    k && (v.isSnap = !0, v.pos = x, v.offset = a - x);
  else {
    var I = d / u, P = n[1] - I * a, R = 0, N = 0, F = !1;
    k ? (N = x, R = I * N + P, F = !0) : D && (R = j, N = (R - P) / I, F = !0), F && (v.isSnap = !0, v.pos = N, v.offset = a - N, m.isSnap = !0, m.pos = R, m.offset = i - R);
  }
  return {
    vertical: v,
    horizontal: m
  };
}
function En(t) {
  var e = "";
  return t === -1 || t === "top" || t === "left" ? e = "start" : t === 0 || t === "center" || t === "middle" ? e = "center" : (t === 1 || t === "right" || t === "bottom") && (e = "end"), e;
}
function wu(t, e, n, r) {
  var a = wl(t.props.snapDirections, e), i = Yi(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return En(l);
  }), a.horizontalNames.map(function(l) {
    return En(l);
  }), n, r), o = En(a.horizontalNames[i.horizontal.index]), s = En(a.verticalNames[i.vertical.index]);
  return {
    vertical: O(O({}, i.vertical), { direction: s }),
    horizontal: O(O({}, i.horizontal), { direction: o })
  };
}
function ys(t) {
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
function Su(t, e, n, r, a) {
  var i, o;
  if (a === void 0 && (a = []), !t || !t.length)
    return {
      isSnap: !1,
      index: -1,
      direction: "",
      posInfos: []
    };
  var s = e === "vertical", l = s ? 0 : 1, c = n.map(function(d, f) {
    var h = a[f] || "", v = t.map(function(m) {
      var y = m.pos, w = d - y[l];
      return {
        offset: w,
        dist: et(w),
        guideline: m,
        direction: h
      };
    }).filter(function(m) {
      var y = m.guideline, w = m.dist, S = y.type;
      return !(S !== e || w > r);
    }).sort(function(m, y) {
      return m.dist - y.dist;
    });
    return {
      pos: d,
      index: f,
      guidelineInfos: v,
      direction: h
    };
  }).filter(function(d) {
    return d.guidelineInfos.length > 0;
  }).sort(function(d, f) {
    return d.guidelineInfos[0].dist - f.guidelineInfos[0].dist;
  }), u = c.length > 0;
  return {
    isSnap: u,
    index: u ? c[0].index : -1,
    direction: (o = (i = c[0]) === null || i === void 0 ? void 0 : i.direction) !== null && o !== void 0 ? o : "",
    posInfos: c
  };
}
function zx(t, e, n, r, a) {
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
  ].forEach(function(f, h, v) {
    var m = v[h + 1] || v[0];
    i.push(f), i.push([
      (f[0] + m[0]) / 2,
      (f[1] + m[1]) / 2
    ]);
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], n) : (i.push.apply(i, ot([], A(px([
    [-1, -1],
    [1, -1],
    [-1, -1],
    [1, 1]
  ], n)), !1)), i.length > 1 && i.push([
    (i[0][0] + i[1][0]) / 2,
    (i[0][1] + i[1][1]) / 2
  ]));
  var o = i.map(function(f) {
    return ce(e, f);
  }), s = o.map(function(f) {
    return f[0];
  }), l = o.map(function(f) {
    return f[1];
  }), c = Yi(t, s, l, i.map(function(f) {
    return En(f[0]);
  }), i.map(function(f) {
    return En(f[1]);
  }), r, a), u = En(i.map(function(f) {
    return f[0];
  })[c.vertical.index]), d = En(i.map(function(f) {
    return f[1];
  })[c.horizontal.index]);
  return {
    vertical: O(O({}, c.vertical), { direction: u }),
    horizontal: O(O({}, c.horizontal), { direction: d })
  };
}
function pp(t, e) {
  var n = et(t.offset), r = et(e.offset);
  return t.isBound && e.isBound ? r - n : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? r - n : t.isSnap ? -1 : e.isSnap || n < Ce ? 1 : r < Ce ? -1 : n - r;
}
function Di(t, e) {
  return t.slice().sort(function(n, r) {
    var a = n.sign[e], i = r.sign[e], o = n.offset[e], s = r.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return pp({ isBound: n.isBound, isSnap: n.isSnap, offset: o }, { isBound: r.isBound, isSnap: r.isSnap, offset: s });
  })[0];
}
function Fx(t, e, n) {
  var r = [];
  if (n)
    et(e[0]) !== 1 || et(e[1]) !== 1 ? r.push([e, [-1, -1]], [e, [-1, 1]], [e, [1, -1]], [e, [1, 1]]) : r.push([e, [t[0], -t[1]]], [e, [-t[0], t[1]]]), r.push([e, t]);
  else if (t[0] && t[1] || !t[0] && !t[1]) {
    var a = t[0] ? t : [1, 1];
    [1, -1].forEach(function(o) {
      [1, -1].forEach(function(s) {
        var l = [o * a[0], s * a[1]];
        e[0] === l[0] && e[1] === l[1] || r.push([e, l]);
      });
    });
  } else if (t[0]) {
    var i = et(e[0]) === 1 ? [1] : [1, -1];
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
    var i = et(e[1]) === 1 ? [1] : [1, -1];
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
function hp(t, e) {
  var n = is([e[0][0], e[1][0]]), r = is([e[0][1], e[1][1]]);
  return {
    vertical: n <= t[0],
    horizontal: r <= t[1]
  };
}
function Sl(t, e) {
  var n = A(e, 2), r = n[0], a = n[1], i = a[0] - r[0], o = a[1] - r[1];
  et(i) < Ce && (i = 0), et(o) < Ce && (o = 0);
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
function gp(t, e, n, r) {
  return r === void 0 && (r = Ce), t.every(function(a) {
    var i = Sl(a, e), o = i <= 0;
    return o === n || et(i) <= r;
  });
}
function Cu(t, e, n, r, a) {
  return a === void 0 && (a = 0), r && e - a <= t || !r && t <= n + a ? {
    isBound: !0,
    offset: r ? e - t : n - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function Bx(t, e) {
  var n = e.line, r = e.centerSign, a = e.verticalSign, i = e.horizontalSign, o = e.lineConstants, s = t.props.innerBounds;
  if (!s)
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var l = s.left, c = s.top, u = s.width, d = s.height, f = [[l, c], [l, c + d]], h = [[l, c], [l + u, c]], v = [[l + u, c], [l + u, c + d]], m = [[l, c + d], [l + u, c + d]];
  if (gp([
    [l, c],
    [l + u, c],
    [l, c + d],
    [l + u, c + d]
  ], n, r))
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var y = Mn(n, o, h, a), w = Mn(n, o, m, a), S = Mn(n, o, f, i), C = Mn(n, o, v, i), k = y.isBound && w.isBound, M = y.isBound || w.isBound, E = S.isBound && C.isBound, D = S.isBound || C.isBound, _ = br(y.offset, w.offset), j = br(S.offset, C.offset), x = [0, 0], I = !1, P = !1;
  return et(j) < et(_) ? (x = [_, 0], I = M, P = k) : (x = [0, j], I = D, P = E), {
    isAllBound: P,
    isVerticalBound: M,
    isHorizontalBound: D,
    isBound: I,
    offset: x
  };
}
function Mn(t, e, n, r, a, i) {
  var o = A(e, 2), s = o[0], l = o[1], c = t[0], u = n[0], d = n[1], f = Ii(d[1] - u[1]), h = Ii(d[0] - u[0]), v = l, m = s, y = -s / l;
  if (h) {
    if (!f) {
      if (i && !v)
        return {
          isBound: !1,
          offset: 0
        };
      if (m) {
        var k = (u[1] - c[1]) / y + c[0];
        return Cu(k, u[0], d[0], r, a);
      } else {
        var S = u[1] - c[1], C = et(S) <= (a || 0);
        return {
          isBound: C,
          offset: C ? S : 0
        };
      }
    }
  } else {
    if (i && !m)
      return {
        isBound: !1,
        offset: 0
      };
    if (v) {
      var w = y * (u[0] - c[0]) + c[1];
      return Cu(w, u[1], d[1], r, a);
    } else {
      var S = u[0] - c[0], C = et(S) <= (a || 0);
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
function vp(t, e, n) {
  return e.map(function(r) {
    var a = Bx(t, r), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, c = r.multiple, u = en({
      datas: n,
      distX: o[0],
      distY: o[1]
    }).map(function(d, f) {
      return d * (c[f] ? 2 / c[f] : 0);
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
function Gx(t, e, n) {
  var r, a = Cl(t, e, [0, 0], !1).map(function(f) {
    return O(O({}, f), { multiple: f.multiple.map(function(h) {
      return et(h) * 2;
    }) });
  }), i = vp(t, a, n), o = Di(i, 0), s = Di(i, 1), l = 0, c = 0, u = o.isVerticalBound || s.isVerticalBound, d = o.isHorizontalBound || s.isHorizontalBound;
  return (u || d) && (r = A(dx({
    datas: n,
    distX: -o.offset[0],
    distY: -s.offset[1]
  }), 2), l = r[0], c = r[1]), {
    vertical: {
      isBound: u,
      offset: l
    },
    horizontal: {
      isBound: d,
      offset: c
    }
  };
}
function $x(t, e) {
  var n = [], r = t[0], a = t[1];
  return r && a ? n.push([[0, a * 2], t, [-r, a]], [[r * 2, 0], t, [r, -a]]) : r ? (n.push([[r * 2, 0], [r, 1], [r, -1]]), e && n.push([[0, -1], [r, -1], [-r, -1]], [[0, 1], [r, 1], [-r, 1]])) : a ? (n.push([[0, a * 2], [1, a], [-1, a]]), e && n.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : n.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), n;
}
function Cl(t, e, n, r) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = er(i, 100, 100, o ? 4 : 3), l = ce(s, [0, 0]);
  return $x(n, r).map(function(c) {
    var u = A(c, 3), d = u[0], f = u[1], h = u[2], v = [
      ce(s, f),
      ce(s, h)
    ], m = Ax(v), y = hp(l, v), w = y.vertical, S = y.horizontal, C = Sl(l, v) <= 0;
    return {
      multiple: d,
      centerSign: C,
      verticalSign: w,
      horizontalSign: S,
      lineConstants: m,
      line: [
        ce(e, f),
        ce(e, h)
      ]
    };
  });
}
function ku(t, e, n, r) {
  var a = r ? t.map(function(i) {
    return fa(i, r);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = Sl(n, i) <= 0;
    return !gp(e, i, o);
  });
}
function Wx(t) {
  var e = A(t, 2), n = e[0], r = e[1], a = r[0] - n[0], i = r[1] - n[1];
  if (!a)
    return et(n[0]);
  if (!i)
    return et(n[1]);
  var o = i / a;
  return et((-o * n[0] + n[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function Yx(t) {
  var e = A(t, 2), n = e[0], r = e[1], a = r[0] - n[0], i = r[1] - n[1];
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
function Xx(t, e, n, r, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, c = i.width, u = i.height, d = s - r[0], f = s + c - r[0], h = l - r[1], v = l + u - r[1], m = [
    [d, h],
    [f, h],
    [d, v],
    [f, v]
  ], y = ce(n, [0, 0]);
  if (!ku(n, m, y, 0))
    return [];
  var w = [], S = m.map(function(C) {
    return [
      Be(C),
      ee([0, 0], C)
    ];
  });
  return [
    [n[0], n[1]],
    [n[1], n[3]],
    [n[3], n[2]],
    [n[2], n[0]]
  ].forEach(function(C) {
    var k = ee([0, 0], Yx(C)), M = Wx(C);
    w.push.apply(w, ot([], A(S.filter(function(E) {
      var D = A(E, 1), _ = D[0];
      return _ && M <= _;
    }).map(function(E) {
      var D = A(E, 2), _ = D[0], j = D[1], x = Math.acos(_ ? M / _ : 0), I = j + x, P = j - x;
      return [
        o + I - k,
        o + P - k
      ];
    }).reduce(function(E, D) {
      return E.push.apply(E, ot([], A(D), !1)), E;
    }, []).filter(function(E) {
      return !ku(e, m, y, E);
    }).map(function(E) {
      return Dt(E * 180 / Math.PI, Ce);
    })), !1));
  }), w;
}
function Hx(t) {
  var e = t.props.innerBounds, n = cr();
  if (!e)
    return {
      boundMap: n,
      vertical: [],
      horizontal: []
    };
  var r = t.getRect(), a = r.pos1, i = r.pos2, o = r.pos3, s = r.pos4, l = [a, i, o, s], c = ce(l, [0, 0]), u = e.left, d = e.top, f = e.width, h = e.height, v = [[u, d], [u, d + h]], m = [[u, d], [u + f, d]], y = [[u + f, d], [u + f, d + h]], w = [[u, d + h], [u + f, d + h]], S = Cl(t, l, [0, 0], !1), C = [], k = [];
  return S.forEach(function(M) {
    var E = M.line, D = M.lineConstants, _ = hp(c, E), j = _.horizontal, x = _.vertical, I = Mn(E, D, m, x, 1, !0), P = Mn(E, D, w, x, 1, !0), R = Mn(E, D, v, j, 1, !0), N = Mn(E, D, y, j, 1, !0);
    I.isBound && !n.top && (C.push(d), n.top = !0), P.isBound && !n.bottom && (C.push(d + h), n.bottom = !0), R.isBound && !n.left && (k.push(u), n.left = !0), N.isBound && !n.right && (k.push(u + f), n.right = !0);
  }), {
    boundMap: n,
    horizontal: C,
    vertical: k
  };
}
function Vx(t, e, n, r) {
  var a = e[0] - t[0], i = e[1] - t[1];
  if (et(a) < oe && (a = 0), et(i) < oe && (i = 0), !a)
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
function bs(t, e, n, r, a) {
  var i = Vx(t, e, n, r);
  if (!i)
    return {
      isOutside: !1,
      offset: [0, 0]
    };
  var o = Qe(t, e), s = Qe(i, t), l = Qe(i, e), c = s > o || l > o, u = A(en({
    datas: a,
    distX: i[0],
    distY: i[1]
  }), 2), d = u[0], f = u[1];
  return {
    offset: [d, f],
    isOutside: c
  };
}
function Ti(t, e) {
  return t.isBound ? t.offset : e.isSnap ? ys(e).offset : 0;
}
function Kx(t, e, n, r, a) {
  var i = A(e, 2), o = i[0], s = i[1], l = A(n, 2), c = l[0], u = l[1], d = A(r, 2), f = d[0], h = d[1], v = A(a, 2), m = v[0], y = v[1], w = -m, S = -y;
  if (t && o && s) {
    w = 0, S = 0;
    var C = [];
    if (c && u ? C.push([0, y], [m, 0]) : c ? C.push([m, 0]) : u ? C.push([0, y]) : f && h ? C.push([0, y], [m, 0]) : f ? C.push([m, 0]) : h && C.push([0, y]), C.length) {
      C.sort(function(D, _) {
        return Be(wt([o, s], D)) - Be(wt([o, s], _));
      });
      var k = C[0];
      if (k[0] && et(o) > oe)
        w = -k[0], S = s * et(o + w) / et(o) - s;
      else if (k[1] && et(s) > oe) {
        var M = s;
        S = -k[1], w = o * et(s + S) / et(M) - o;
      }
      if (t && u && c)
        if (et(w) > oe && et(w) < et(m)) {
          var E = et(m) / et(w);
          w *= E, S *= E;
        } else if (et(S) > oe && et(S) < et(y)) {
          var E = et(y) / et(S);
          w *= E, S *= E;
        } else
          w = br(-m, w), S = br(-y, S);
    }
  } else
    w = o || c ? -m : 0, S = s || u ? -y : 0;
  return [w, S];
}
function qx(t, e, n, r, a, i) {
  if (!_r(t, "draggable"))
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
  var o = Ml(i.absolutePoses, [e, n]), s = ze(o), l = s.left, c = s.right, u = s.top, d = s.bottom, f = {
    horizontal: o.map(function(N) {
      return N[1];
    }),
    vertical: o.map(function(N) {
      return N[0];
    })
  }, h = bl(t.props.snapDirections), v = wl(h, {
    left: l,
    right: c,
    top: u,
    bottom: d,
    center: (l + c) / 2,
    middle: (u + d) / 2
  }), m = Xi(t, a, v, f), y = m.vertical, w = m.horizontal, S = Gx(t, o, i), C = S.vertical, k = S.horizontal, M = y.isSnap, E = w.isSnap, D = y.isBound || C.isBound, _ = w.isBound || k.isBound, j = br(y.offset, C.offset), x = br(w.offset, k.offset), I = A(Kx(r, [e, n], [D, _], [M, E], [j, x]), 2), P = I[0], R = I[1];
  return [
    {
      isBound: D,
      isSnap: M,
      offset: P
    },
    {
      isBound: _,
      isSnap: E,
      offset: R
    }
  ];
}
function Xi(t, e, n, r) {
  r === void 0 && (r = n);
  var a = yl(Wi(t), r.vertical, r.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : Yi(t, n.vertical, n.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, c = s.vertical, u = Ti(i[0], l), d = Ti(o[0], c), f = et(u), h = et(d);
  return {
    horizontal: {
      isBound: i[0].isBound,
      isSnap: l.isSnap,
      snapIndex: l.index,
      offset: u,
      dist: f,
      bounds: i,
      snap: l
    },
    vertical: {
      isBound: o[0].isBound,
      isSnap: c.isSnap,
      snapIndex: c.index,
      offset: d,
      dist: h,
      bounds: o,
      snap: c
    }
  };
}
function Eu(t, e, n, r, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = yl(e, n, r), l = s.horizontal, c = s.vertical, u = fp(t, n, r, [], [], a, i, o), d = u.horizontal, f = u.vertical, h = Ti(l[0], d), v = Ti(c[0], f), m = et(h), y = et(v);
  return {
    horizontal: {
      isBound: l[0].isBound,
      isSnap: d.isSnap,
      snapIndex: d.index,
      offset: h,
      dist: m,
      bounds: l,
      snap: d
    },
    vertical: {
      isBound: c[0].isBound,
      isSnap: f.isSnap,
      snapIndex: f.index,
      offset: v,
      dist: y,
      bounds: c,
      snap: f
    }
  };
}
function Ux(t, e, n, r) {
  var a = ee(t, e) / Math.PI * 180, i = n.vertical, o = i.isBound, s = i.isSnap, l = i.dist, c = n.horizontal, u = c.isBound, d = c.isSnap, f = c.dist, h = a % 180, v = h < 3 || h > 177, m = h > 87 && h < 93;
  return f < l && (o || s && !m && (!r || !v)) ? "vertical" : u || d && !v && (!r || !m) ? "horizontal" : "";
}
function Zx(t, e, n, r, a, i) {
  return n.map(function(o) {
    var s = A(o, 2), l = s[0], c = s[1], u = ce(e, l), d = ce(e, c), f = r ? Jx(t, u, d, a) : Xi(t, a, {
      vertical: [d[0]],
      horizontal: [d[1]]
    }), h = f.horizontal, v = h.offset, m = h.isBound, y = h.isSnap, w = f.vertical, S = w.offset, C = w.isBound, k = w.isSnap, M = wt(c, l);
    if (!S && !v)
      return {
        isBound: C || m,
        isSnap: k || y,
        sign: M,
        offset: [0, 0]
      };
    var E = Ux(u, d, f, r);
    if (!E)
      return {
        sign: M,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var D = E === "vertical", _ = [0, 0];
    return !r && et(c[0]) === 1 && et(c[1]) === 1 && l[0] !== c[0] && l[1] !== c[1] ? _ = en({
      datas: i,
      distX: -S,
      distY: -v
    }) : _ = bs(u, d, -(D ? S : v), D, i).offset, _ = _.map(function(j, x) {
      return j * (M[x] ? 2 / M[x] : 0);
    }), {
      sign: M,
      isBound: D ? C : m,
      isSnap: D ? k : y,
      offset: _
    };
  });
}
function Mu(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function Jx(t, e, n, r) {
  var a = _x(t, e, n), i = a.horizontal, o = a.vertical, s = r ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : Lx(t, e, n), l = s.horizontal, c = s.vertical, u = Mu(i, l), d = Mu(o, c), f = et(u), h = et(d);
  return {
    horizontal: {
      isBound: i.isBound,
      isSnap: l.isSnap,
      offset: u,
      dist: f
    },
    vertical: {
      isBound: o.isBound,
      isSnap: c.isSnap,
      offset: d,
      dist: h
    }
  };
}
function Qx(t, e, n, r, a) {
  var i = [-n[0], -n[1]], o = t.state, s = o.width, l = o.height, c = t.props.bounds, u = 1 / 0, d = 1 / 0;
  if (c) {
    var f = [
      [n[0], -n[1]],
      [-n[0], n[1]]
    ], h = c.left, v = h === void 0 ? -1 / 0 : h, m = c.top, y = m === void 0 ? -1 / 0 : m, w = c.right, S = w === void 0 ? 1 / 0 : w, C = c.bottom, k = C === void 0 ? 1 / 0 : C;
    f.forEach(function(M) {
      var E = M[0] !== i[0], D = M[1] !== i[1], _ = ce(e, M), j = ee(r, _) * 360 / Math.PI;
      if (D) {
        var x = _.slice();
        (et(j - 360) < 2 || et(j - 180) < 2) && (x[1] = r[1]);
        var I = bs(r, x, (r[1] < _[1] ? k : y) - _[1], !1, a), P = A(I.offset, 2), R = P[1], N = I.isOutside;
        isNaN(R) || (d = l + (N ? 1 : -1) * et(R));
      }
      if (E) {
        var x = _.slice();
        (et(j - 90) < 2 || et(j - 270) < 2) && (x[0] = r[0]);
        var F = bs(r, x, (r[0] < _[0] ? S : v) - _[0], !0, a), q = A(F.offset, 1), z = q[0], B = F.isOutside;
        isNaN(z) || (u = s + (B ? 1 : -1) * et(z));
      }
    });
  }
  return {
    maxWidth: u,
    maxHeight: d
  };
}
var be = {
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
    var u = Be(c), d = ee(c, [0, 0]);
    return [e.createElement("div", { className: bt("line", "horizontal", "dragline", "dashed"), key: "dragRotateGuideline", style: {
      width: "".concat(u, "px"),
      transform: "translate(".concat(l[0], "px, ").concat(l[1], "px) rotate(").concat(d, "rad) scaleY(").concat(i, ")")
    } })];
  },
  dragStart: function(t, e) {
    var n = e.datas, r = e.parentEvent, a = e.parentGesto, i = t.state, o = i.gestos, s = i.style;
    if (o.draggable)
      return !1;
    o.draggable = a || t.targetGesto, n.datas = {}, n.left = parseFloat(s.left || "") || 0, n.top = parseFloat(s.top || "") || 0, n.bottom = parseFloat(s.bottom || "") || 0, n.right = parseFloat(s.right || "") || 0, n.startValue = [0, 0], tr(t, e), $i(t, e, "translate"), xy(t, n), n.prevDist = [0, 0], n.prevBeforeDist = [0, 0], n.isDrag = !1, n.deltaOffset = [0, 0];
    var l = Rt(t, e, O({ set: function(u) {
      n.startValue = u;
    } }, Gi(t, e))), c = r || gt(t, "onDragStart", l);
    return c !== !1 ? (n.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, n.isPinch = !1), n.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      Fi(t, e, "translate");
      var n = e.datas, r = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, c = e.isGroup, u = e.parentThrottleDrag, d = e.distX, f = e.distY, h = n.isDrag, v = n.prevDist, m = n.prevBeforeDist, y = n.startValue;
      if (h) {
        o && (d += o[0], f += o[1]);
        var w = t.props, S = w.parentMoveable, C = c ? 0 : w.throttleDrag || u || 0, k = r ? 0 : w.throttleDragRotate || 0, M = 0, E = !1, D = !1, _ = !1, j = !1;
        if (!r && k > 0 && (d || f)) {
          var x = w.startDragRotate || 0, I = Dt(x + ee([0, 0], [d, f]) * 180 / Math.PI, k) - x, P = f * Math.abs(Math.cos((I - 90) / 180 * Math.PI)), R = d * Math.abs(Math.cos(I / 180 * Math.PI)), N = Be([R, P]);
          M = I * Math.PI / 180, d = N * Math.cos(M), f = N * Math.sin(M);
        }
        if (!i && !r && !a) {
          var F = A(qx(t, d, f, k, !s && l || o, n), 2), q = F[0], z = F[1];
          E = q.isSnap, D = q.isBound, _ = z.isSnap, j = z.isBound;
          var B = q.offset, Y = z.offset;
          d += B, f += Y;
        }
        var V = Ot(Zf({ datas: n, distX: d, distY: f }), y), W = Ot(ux({ datas: n, distX: d, distY: f }), y);
        pu(W, Ce), pu(V, Ce), k || (!E && !D && (W[0] = Dt(W[0], C), V[0] = Dt(V[0], C)), !_ && !j && (W[1] = Dt(W[1], C), V[1] = Dt(V[1], C)));
        var tt = wt(V, y), J = wt(W, y), rt = wt(J, v), Q = wt(tt, m);
        n.prevDist = J, n.prevBeforeDist = tt, n.passDelta = rt, n.passDist = J;
        var at = n.left + tt[0], ft = n.top + tt[1], Z = n.right - tt[0], ut = n.bottom - tt[1], vt = Bi(n, "translate(".concat(W[0], "px, ").concat(W[1], "px)"), "translate(".concat(J[0], "px, ").concat(J[1], "px)"));
        if (ml(e, vt), t.state.dragInfo.dist = r ? [0, 0] : J, !(!r && !S && rt.every(function(lt) {
          return !lt;
        }) && Q.some(function(lt) {
          return !lt;
        }))) {
          var nt = t.state, pt = nt.width, jt = nt.height, st = Rt(t, e, O({ transform: vt, dist: J, delta: rt, translate: W, beforeDist: tt, beforeDelta: Q, beforeTranslate: V, left: at, top: ft, right: Z, bottom: ut, width: pt, height: jt, isPinch: i }, Se({
            transform: vt
          }, e)));
          return !r && gt(t, "onDrag", st), st;
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
      var a = je(t, e, {});
      return !n && gt(t, "onDragEnd", a), a;
    }
  },
  dragGroupStart: function(t, e) {
    var n, r, a = e.datas, i = e.clientX, o = e.clientY, s = this.dragStart(t, e);
    if (!s)
      return !1;
    var l = Io(t, this, "dragStart", [
      i || 0,
      o || 0
    ], e, !1, "draggable"), c = l.childEvents, u = l.eventParams, d = O(O({}, s), { targets: t.props.targets, events: u }), f = gt(t, "onDragGroupStart", d);
    a.isDrag = f !== !1;
    var h = (r = (n = c[0]) === null || n === void 0 ? void 0 : n.datas.startValue) !== null && r !== void 0 ? r : [0, 0];
    return a.throttleOffset = [h[0] % 1, h[1] % 1], a.isDrag ? s : !1;
  },
  dragGroup: function(t, e) {
    var n = e.datas;
    if (n.isDrag) {
      var r = this.drag(t, O(O({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = Io(t, this, "drag", a, e, !1, "draggable").eventParams;
      if (r) {
        var o = O({ targets: t.props.targets, events: i }, r);
        return gt(t, "onDragGroup", o), o;
      }
    }
  },
  dragGroupEnd: function(t, e) {
    var n = e.isDrag, r = e.datas;
    if (r.isDrag) {
      this.dragEnd(t, e);
      var a = Io(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
      return gt(t, "onDragGroupEnd", je(t, e, {
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
function mp(t, e) {
  var n = ce(t, e), r = [0, 0];
  return {
    fixedPosition: n,
    fixedDirection: e,
    fixedOffset: r
  };
}
function ty(t, e) {
  var n = t.allMatrix, r = t.is3d, a = t.width, i = t.height, o = r ? 4 : 3, s = [
    a / 2 * (1 + e[0]),
    i / 2 * (1 + e[1])
  ], l = Ut(n, s, o), c = [0, 0];
  return {
    fixedPosition: l,
    fixedDirection: e,
    fixedOffset: c
  };
}
function xp(t, e) {
  var n = t.allMatrix, r = t.is3d, a = t.width, i = t.height, o = r ? 4 : 3, s = xx(e, a, i), l = Ut(n, e, o), c = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: c
  };
}
var Du = _l("resizable"), ws = {
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
  render: ip("resizable"),
  dragControlCondition: Du,
  viewClassName: Tl("resizable"),
  dragControlStart: function(t, e) {
    var n, r = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, c = e.parentFixedDirection, u = e.parentEvent, d = Ip(o, a, r, l), f = t.state, h = f.target, v = f.width, m = f.height, y = f.gestos;
    if (!d || !h || y.resizable)
      return !1;
    y.resizable = s || t.controlGesto, !a && tr(t, e), l.datas = {}, l.direction = d, l.startOffsetWidth = v, l.startOffsetHeight = m, l.prevWidth = 0, l.prevHeight = 0, l.minSize = [0, 0], l.startWidth = f.inlineCSSWidth || f.cssWidth, l.startHeight = f.inlineCSSHeight || f.cssHeight, l.maxSize = [1 / 0, 1 / 0], i || (l.minSize = [
      f.minOffsetWidth,
      f.minOffsetHeight
    ], l.maxSize = [
      f.maxOffsetWidth,
      f.maxOffsetHeight
    ]);
    var w = t.props.transformOrigin || "% %";
    l.transformOrigin = Fe(w) ? w.split(" ") : w, l.startOffsetMatrix = f.offsetMatrix, l.startTransformOrigin = f.transformOrigin, l.isWidth = (n = e == null ? void 0 : e.parentIsWidth) !== null && n !== void 0 ? n : !d[0] && !d[1] || d[0] || !d[1];
    function S(j) {
      l.ratio = j && isFinite(j) ? j : 0;
    }
    l.startPositions = Ge(t.state);
    function C(j) {
      var x = mp(l.startPositions, j);
      l.fixedDirection = x.fixedDirection, l.fixedPosition = x.fixedPosition, l.fixedOffset = x.fixedOffset;
    }
    function k(j) {
      var x = xp(t.state, j);
      l.fixedDirection = x.fixedDirection, l.fixedPosition = x.fixedPosition, l.fixedOffset = x.fixedOffset;
    }
    function M(j) {
      l.minSize = [
        Ft("".concat(j[0]), 0) || 0,
        Ft("".concat(j[1]), 0) || 0
      ];
    }
    function E(j) {
      var x = [
        j[0] || 1 / 0,
        j[1] || 1 / 0
      ];
      (!oa(x[0]) || isFinite(x[0])) && (x[0] = Ft("".concat(x[0]), 0) || 1 / 0), (!oa(x[1]) || isFinite(x[1])) && (x[1] = Ft("".concat(x[1]), 0) || 1 / 0), l.maxSize = x;
    }
    S(v / m), C(c || [-d[0], -d[1]]), l.setFixedDirection = C, l.setFixedPosition = k, l.setMin = M, l.setMax = E;
    var D = Rt(t, e, {
      direction: d,
      startRatio: l.ratio,
      set: function(j) {
        var x = A(j, 2), I = x[0], P = x[1];
        l.startWidth = I, l.startHeight = P;
      },
      setMin: M,
      setMax: E,
      setRatio: S,
      setFixedDirection: C,
      setFixedPosition: k,
      setOrigin: function(j) {
        l.transformOrigin = j;
      },
      dragStart: be.dragStart(t, new xr().dragStart([0, 0], e))
    }), _ = u || gt(t, "onResizeStart", D);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, _ !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: d
    }), l.isResize ? D : !1;
  },
  dragControl: function(t, e) {
    var n, r = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, c = e.useSnap, u = e.isRequest, d = e.isGroup, f = e.parentEvent, h = e.resolveMatrix, v = r.isResize, m = r.transformOrigin, y = r.startWidth, w = r.startHeight, S = r.prevWidth, C = r.prevHeight, k = r.minSize, M = r.maxSize, E = r.ratio, D = r.startOffsetWidth, _ = r.startOffsetHeight, j = r.isWidth;
    if (!v)
      return;
    if (h) {
      var x = t.state.is3d, I = r.startOffsetMatrix, P = r.startTransformOrigin, R = x ? 4 : 3, N = vr(Ei(e)), F = Math.sqrt(N.length);
      R !== F && (N = Ze(N, F, R));
      var q = xa(I, N, P, R), z = er(q, D, _, R);
      r.startPositions = z, r.nextTargetMatrix = N, r.nextAllMatrix = q;
    }
    var B = Qn(t.props, "resizable"), Y = B.resizeFormat, V = B.throttleResize, W = V === void 0 ? a ? 0 : 1 : V, tt = B.parentMoveable, J = B.keepRatioFinally, rt = r.direction, Q = rt, at = 0, ft = 0;
    !rt[0] && !rt[1] && (Q = [1, 1]);
    var Z = E && (o ?? B.keepRatio) || !1;
    function ut() {
      var Gt = r.fixedDirection, mt = Lp(Q, Z, r, e);
      at = mt.distWidth, ft = mt.distHeight;
      var pe = Q[0] - Gt[0] || Z ? Math.max(D + at, Ce) : D, me = Q[1] - Gt[1] || Z ? Math.max(_ + ft, Ce) : _;
      return Z && D && _ && (j ? me = pe / E : pe = me * E), [pe, me];
    }
    var vt = A(ut(), 2), nt = vt[0], pt = vt[1];
    f || (r.setFixedDirection(r.fixedDirection), gt(t, "onBeforeResize", Rt(t, e, {
      startFixedDirection: r.startFixedDirection,
      startFixedPosition: r.startFixedPosition,
      setFixedDirection: function(Gt) {
        var mt;
        return r.setFixedDirection(Gt), mt = A(ut(), 2), nt = mt[0], pt = mt[1], [nt, pt];
      },
      setFixedPosition: function(Gt) {
        var mt;
        return r.setFixedPosition(Gt), mt = A(ut(), 2), nt = mt[0], pt = mt[1], [nt, pt];
      },
      boundingWidth: nt,
      boundingHeight: pt,
      setSize: function(Gt) {
        var mt;
        mt = A(Gt, 2), nt = mt[0], pt = mt[1];
      }
    }, !0)));
    var jt = s;
    s || (!a && i ? jt = Sx(t, [0, 0]) : jt = r.fixedPosition);
    var st = [0, 0];
    i || (st = vy(t, nt, pt, rt, jt, !c && u, r)), l && (!l[0] && (st[0] = 0), !l[1] && (st[1] = 0));
    function lt() {
      var Gt;
      Y && (Gt = A(Y([nt, pt]), 2), nt = Gt[0], pt = Gt[1]), nt = Dt(nt, W), pt = Dt(pt, W);
    }
    if (Z) {
      Q[0] && Q[1] && st[0] && st[1] && (et(st[0]) > et(st[1]) ? st[1] = 0 : st[0] = 0);
      var xt = !st[0] && !st[1];
      xt && lt(), Q[0] && !Q[1] || st[0] && !st[1] || xt && j ? (nt += st[0], pt = nt / E) : (!Q[0] && Q[1] || !st[0] && st[1] || xt && !j) && (pt += st[1], nt = pt * E);
    } else
      nt += st[0], pt += st[1], nt = Math.max(0, nt), pt = Math.max(0, pt);
    n = A(ol([nt, pt], k, M, Z ? E : !1), 2), nt = n[0], pt = n[1], lt(), Z && (d || J) && (j ? pt = nt / E : nt = pt * E), at = nt - D, ft = pt - _;
    var Ct = [at - S, ft - C];
    r.prevWidth = at, r.prevHeight = ft;
    var Mt = wx(t, nt, pt, jt, m, r);
    if (!(!tt && Ct.every(function(Gt) {
      return !Gt;
    }) && Mt.every(function(Gt) {
      return !Gt;
    }))) {
      var ht = be.drag(t, ma(e, t.state, Mt, !!i, !1, "draggable")), yt = ht.transform, Et = y + at, Ht = w + ft, Vt = Rt(t, e, O({ width: Et, height: Ht, offsetWidth: Math.round(nt), offsetHeight: Math.round(pt), startRatio: E, boundingWidth: nt, boundingHeight: pt, direction: rt, dist: [at, ft], delta: Ct, isPinch: !!i, drag: ht }, Pp({
        style: {
          width: "".concat(Et, "px"),
          height: "".concat(Ht, "px")
        },
        transform: yt
      }, ht, e)));
      return !f && gt(t, "onResize", Vt), Vt;
    }
  },
  dragControlAfter: function(t, e) {
    var n = e.datas, r = n.isResize, a = n.startOffsetWidth, i = n.startOffsetHeight, o = n.prevWidth, s = n.prevHeight;
    if (!(!r || t.props.checkResizableError === !1)) {
      var l = t.state, c = l.width, u = l.height, d = c - (a + o), f = u - (i + s), h = et(d) > 3, v = et(f) > 3;
      if (h && (n.startWidth += d, n.startOffsetWidth += d, n.prevWidth += d), v && (n.startHeight += f, n.startOffsetHeight += f, n.prevHeight += f), h || v)
        return this.dragControl(t, e);
    }
  },
  dragControlEnd: function(t, e) {
    var n = e.datas, r = e.parentEvent;
    if (n.isResize) {
      n.isResize = !1;
      var a = je(t, e, {});
      return !r && gt(t, "onResizeEnd", a), a;
    }
  },
  dragGroupControlCondition: Du,
  dragGroupControlStart: function(t, e) {
    var n = e.datas, r = this.dragControlStart(t, O(O({}, e), { isGroup: !0 }));
    if (!r)
      return !1;
    var a = qe(t, "resizable", e), i = n.startOffsetWidth, o = n.startOffsetHeight;
    function s() {
      var h = n.minSize;
      a.forEach(function(v) {
        var m = v.datas, y = m.minSize, w = m.startOffsetWidth, S = m.startOffsetHeight, C = i * (w ? y[0] / w : 0), k = o * (S ? y[1] / S : 0);
        h[0] = Math.max(h[0], C), h[1] = Math.max(h[1], k);
      });
    }
    function l() {
      var h = n.maxSize;
      a.forEach(function(v) {
        var m = v.datas, y = m.maxSize, w = m.startOffsetWidth, S = m.startOffsetHeight, C = i * (w ? y[0] / w : 0), k = o * (S ? y[1] / S : 0);
        h[0] = Math.min(h[0], C), h[1] = Math.min(h[1], k);
      });
    }
    var c = vn(t, this, "dragControlStart", e, function(h, v) {
      return Mi(t, h, n, v);
    });
    s(), l();
    var u = function(h) {
      r.setFixedDirection(h), c.forEach(function(v, m) {
        v.setFixedDirection(h), Mi(t, v.moveable, n, a[m]);
      });
    };
    n.setFixedDirection = u;
    var d = O(O({}, r), { targets: t.props.targets, events: c.map(function(h) {
      return O(O({}, h), { setMin: function(v) {
        h.setMin(v), s();
      }, setMax: function(v) {
        h.setMax(v), l();
      } });
    }), setFixedDirection: u, setMin: function(h) {
      r.setMin(h), s();
    }, setMax: function(h) {
      r.setMax(h), l();
    } }), f = gt(t, "onResizeGroupStart", d);
    return n.isResize = f !== !1, n.isResize ? r : !1;
  },
  dragGroupControl: function(t, e) {
    var n = e.datas;
    if (n.isResize) {
      var r = Qn(t.props, "resizable");
      Vi(t, "onBeforeResize", function(h) {
        gt(t, "onBeforeResizeGroup", Rt(t, e, O(O({}, h), { targets: r.targets }), !0));
      });
      var a = this.dragControl(t, O(O({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = r.keepRatio, c = [
          i / (i - s[0]),
          o / (o - s[1])
        ], u = n.fixedPosition, d = vn(t, this, "dragControl", e, function(h, v) {
          var m = A(ve(pa(t.rotation / 180 * Math.PI, 3), [
            v.datas.originalX * c[0],
            v.datas.originalY * c[1],
            1
          ], 3), 2), y = m[0], w = m[1];
          return O(O({}, v), { parentDist: null, parentScale: c, dragClient: Ot(u, [y, w]), parentKeepRatio: l });
        }), f = O({ targets: r.targets, events: d }, a);
        return gt(t, "onResizeGroup", f), f;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var n = e.isDrag, r = e.datas;
    if (r.isResize) {
      this.dragControlEnd(t, e);
      var a = vn(t, this, "dragControlEnd", e), i = je(t, e, {
        targets: t.props.targets,
        events: a
      });
      return gt(t, "onResizeGroupEnd", i), n;
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
function Ro(t, e, n, r, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, c = Ut(
    t.state.rootMatrix,
    // TO-DO #710
    wt([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), u = Ot([a.left, a.top], c);
  e.startAbsoluteOrigin = u, e.prevDeg = ee(u, [n, r]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = Qe(u, [n, r]);
}
function di(t, e, n) {
  var r = n.defaultDeg, a = n.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - r);
  return n.prevDeg = r + s, s;
}
function Po(t, e, n, r) {
  return di(ee(r.startAbsoluteOrigin, [t, e]) / Math.PI * 180, n, r);
}
function No(t, e, n, r, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = n.prevSnapDeg, c = 0, u = !1;
  if (i) {
    var d = gy(t, e, r, a + r);
    u = d.isSnap, c = a + d.dist;
  }
  u || (c = Dt(a + r, s));
  var f = c - a;
  return n.prevSnapDeg = f, [f - l, f, c];
}
function yp(t, e, n) {
  var r = A(e, 4), a = r[0], i = r[1], o = r[2], s = r[3];
  if (t === "none")
    return [];
  if (te(t))
    return t.map(function(y) {
      return yp(y, [a, i, o, s], n)[0];
    });
  var l = A((t || "top").split("-"), 2), c = l[0], u = l[1], d = [a, i];
  c === "left" ? d = [o, a] : c === "right" ? d = [i, s] : c === "bottom" && (d = [s, o]);
  var f = [
    (d[0][0] + d[1][0]) / 2,
    (d[0][1] + d[1][1]) / 2
  ], h = _p(d, n);
  if (u) {
    var v = u === "top" || u === "left", m = c === "bottom" || c === "left";
    f = d[v && !m || !v && m ? 0 : 1];
  }
  return [[f, h]];
}
function Ss(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var n = e.inputEvent.target;
  if (se(n, bt("rotation-control")) || t.props.rotateAroundControls && se(n, bt("around-control")) || se(n, bt("control")) && se(n, bt("rotatable")))
    return !0;
  var r = t.props.rotationTarget;
  return r ? jl(r, !0).some(function(a) {
    return a ? n === a || n.contains(a) : !1;
  }) : !1;
}
var ey = `.rotation {
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
`, ny = {
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
  css: [ey],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? bt("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var n = Qn(t.props, "rotatable"), r = n.rotatable, a = n.rotationPosition, i = n.zoom, o = n.renderDirections, s = n.rotateAroundControls, l = n.resolveAblesWithRotatable, c = t.getState(), u = c.renderPoses, d = c.direction;
    if (!r)
      return null;
    var f = yp(a, u, d), h = [];
    if (f.forEach(function(w, S) {
      var C = A(w, 2), k = C[0], M = C[1];
      h.push(e.createElement(
        "div",
        { key: "rotation".concat(S), className: bt("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(k[0], "px, ").concat(k[1], "px) rotate(").concat(M, "rad)")
        } },
        e.createElement("div", { className: bt("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: bt("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var v = Mr(l || {}), m = {};
      v.forEach(function(w) {
        l[w].forEach(function(S) {
          m[S] = w;
        });
      });
      var y = [];
      te(o) && (y = o.map(function(w) {
        var S = m[w];
        return {
          data: S ? { resolve: S } : {},
          classNames: S ? ["move"] : [],
          dir: w
        };
      })), h.push.apply(h, ot([], A(np(t, "rotatable", y, e)), !1));
    }
    return s && h.push.apply(h, ot([], A(sp(t, e)), !1)), h;
  },
  dragControlCondition: Ss,
  dragControlStart: function(t, e) {
    var n, r, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, c = e.isPinch, u = e.isRequest, d = t.state, f = d.target, h = d.left, v = d.top, m = d.direction, y = d.beforeDirection, w = d.targetTransform, S = d.moveableClientRect, C = d.offsetMatrix, k = d.targetMatrix, M = d.allMatrix, E = d.width, D = d.height;
    if (!u && !f)
      return !1;
    var _ = t.getRect();
    a.rect = _, a.transform = w, a.left = h, a.top = v;
    var j = function(Q) {
      var at = xp(t.state, Q);
      a.fixedDirection = at.fixedDirection, a.fixedOffset = at.fixedOffset, a.fixedPosition = at.fixedPosition, W && W.setFixedPosition(Q);
    }, x = function(Q) {
      var at = ty(t.state, Q);
      a.fixedDirection = at.fixedDirection, a.fixedOffset = at.fixedOffset, a.fixedPosition = at.fixedPosition, W && W.setFixedDirection(Q);
    }, I = i, P = o;
    if (u || c || l) {
      var R = s || 0;
      a.beforeInfo = {
        origin: _.beforeOrigin,
        prevDeg: R,
        defaultDeg: R,
        prevSnapDeg: 0,
        startDist: 0
      }, a.afterInfo = O(O({}, a.beforeInfo), { origin: _.origin }), a.absoluteInfo = O(O({}, a.beforeInfo), { origin: _.origin, startValue: R });
    } else {
      var N = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
      if (N) {
        var F = N.getAttribute("data-direction") || "", q = sx[F];
        if (q) {
          a.isControl = !0, a.isAroundControl = se(N, bt("around-control")), a.controlDirection = q;
          var z = N.getAttribute("data-resolve");
          z && (a.resolveAble = z);
          var B = Iy(d.rootMatrix, d.renderPoses, S);
          n = A(ce(B, q), 2), I = n[0], P = n[1];
        }
      }
      a.beforeInfo = { origin: _.beforeOrigin }, a.afterInfo = { origin: _.origin }, a.absoluteInfo = {
        origin: _.origin,
        startValue: _.rotation
      };
      var Y = j;
      j = function(Q) {
        var at = d.is3d ? 4 : 3, ft = A(Ot(Nf(k, at), Q), 2), Z = ft[0], ut = ft[1], vt = ve(C, Un([Z, ut], at)), nt = ve(M, Un([Q[0], Q[1]], at));
        Y(Q);
        var pt = d.posDelta;
        a.beforeInfo.origin = wt(vt, pt), a.afterInfo.origin = wt(nt, pt), a.absoluteInfo.origin = wt(nt, pt), Ro(t, a.beforeInfo, I, P, S), Ro(t, a.afterInfo, I, P, S), Ro(t, a.absoluteInfo, I, P, S);
      }, x = function(Q) {
        var at = ce([
          [0, 0],
          [E, 0],
          [0, D],
          [E, D]
        ], Q);
        j(at);
      };
    }
    a.startClientX = I, a.startClientY = P, a.direction = m, a.beforeDirection = y, a.startValue = 0, a.datas = {}, $i(t, e, "rotate");
    var V = !1, W = !1;
    if (a.isControl && a.resolveAble) {
      var tt = a.resolveAble;
      tt === "resizable" && (W = ws.dragControlStart(t, O(O({}, new xr("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    W || (V = be.dragStart(t, new xr().dragStart([0, 0], e))), j(Ry(t));
    var J = Rt(t, e, O(O({ set: function(Q) {
      a.startValue = Q * Math.PI / 180;
    }, setFixedDirection: x, setFixedPosition: j }, Gi(t, e)), { dragStart: V, resizeStart: W })), rt = gt(t, "onRotateStart", J);
    return a.isRotate = rt !== !1, d.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? J : !1;
  },
  dragControl: function(t, e) {
    var n, r, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, c = e.parentFlag, u = e.isPinch, d = e.groupDelta, f = e.resolveMatrix, h = i.beforeDirection, v = i.beforeInfo, m = i.afterInfo, y = i.absoluteInfo, w = i.isRotate, S = i.startValue, C = i.rect, k = i.startClientX, M = i.startClientY;
    if (w) {
      Fi(t, e, "rotate");
      var E = cx(e), D = h * E, _ = t.props.parentMoveable, j = 0, x, I, P = 0, R, N, F = 0, q, z, B = 180 / Math.PI * S, Y = y.startValue, V = !1, W = k + o, tt = M + s;
      if (!c && "parentDist" in e) {
        var J = e.parentDist;
        x = J, R = J, q = J;
      } else u || c ? (x = di(l, h, v), R = di(l, D, m), q = di(l, D, y)) : (x = Po(W, tt, h, v), R = Po(W, tt, D, m), q = Po(W, tt, D, y), V = !0);
      if (I = B + x, N = B + R, z = Y + q, gt(t, "onBeforeRotate", Rt(t, e, {
        beforeRotation: I,
        rotation: N,
        absoluteRotation: z,
        setRotation: function(jt) {
          R = jt - B, x = R, q = R;
        }
      }, !0)), n = A(No(t, C, v, x, B, V), 3), j = n[0], x = n[1], I = n[2], r = A(No(t, C, m, R, B, V), 3), P = r[0], R = r[1], N = r[2], a = A(No(t, C, y, q, Y, V), 3), F = a[0], q = a[1], z = a[2], !(!F && !P && !j && !_ && !f)) {
        var rt = Bi(i, "rotate(".concat(N, "deg)"), "rotate(".concat(R, "deg)"));
        f && (i.fixedPosition = xl(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var Q = bx(t, R, i), at = wt(Ot(d || [0, 0], Q), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = Q, i.requestValue = null;
        var ft = Qf(t, rt, at, u, e), Z = ft, ut = Qe([W, tt], y.startAbsoluteOrigin) - y.startDist, vt = void 0;
        if (i.resolveAble === "resizable") {
          var nt = ws.dragControl(t, O(O({}, ma(e, t.state, [e.deltaX, e.deltaY], !!u, !1, "resizable")), { resolveMatrix: !0, parentDistance: ut }));
          nt && (vt = nt, Z = Pp(Z, nt, e));
        }
        var pt = Rt(t, e, O(O({ delta: P, dist: R, rotate: N, rotation: N, beforeDist: x, beforeDelta: j, beforeRotate: I, beforeRotation: I, absoluteDist: q, absoluteDelta: F, absoluteRotate: z, absoluteRotation: z, isPinch: !!u, resize: vt }, ft), Z));
        return gt(t, "onRotate", pt), pt;
      }
    }
  },
  dragControlEnd: function(t, e) {
    var n = e.datas;
    if (n.isRotate) {
      n.isRotate = !1;
      var r = je(t, e, {});
      return gt(t, "onRotateEnd", r), r;
    }
  },
  dragGroupControlCondition: Ss,
  dragGroupControlStart: function(t, e) {
    var n = e.datas, r = t.state, a = r.left, i = r.top, o = r.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(n.beforeDirection * t.rotation);
    var l = vn(t, this, "dragControlStart", e, function(d, f) {
      var h = d.state, v = h.left, m = h.top, y = h.beforeOrigin, w = Ot(wt([v, m], [a, i]), wt(y, o));
      return f.datas.startGroupClient = w, f.datas.groupClient = w, O(O({}, f), { parentRotate: 0 });
    }), c = O(O({}, s), { targets: t.props.targets, events: l }), u = gt(t, "onRotateGroupStart", c);
    return n.isRotate = u !== !1, n.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var n = e.datas;
    if (n.isRotate) {
      Vi(t, "onBeforeRotate", function(c) {
        gt(t, "onBeforeRotateGroup", Rt(t, e, O(O({}, c), { targets: t.props.targets }), !0));
      });
      var r = this.dragControl(t, e);
      if (r) {
        var a = n.beforeDirection, i = r.beforeDist, o = i / 180 * Math.PI, s = vn(t, this, "dragControl", e, function(c, u) {
          var d = u.datas.startGroupClient, f = A(u.datas.groupClient, 2), h = f[0], v = f[1], m = A(fa(d, o * a), 2), y = m[0], w = m[1], S = [y - h, w - v];
          return u.datas.groupClient = [y, w], O(O({}, u), { parentRotate: i, groupDelta: S });
        });
        t.rotation = a * r.beforeRotation;
        var l = O({ targets: t.props.targets, events: s, set: function(c) {
          t.rotation = c;
        }, setGroupRotation: function(c) {
          t.rotation = c;
        } }, r);
        return gt(t, "onRotateGroup", l), l;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var n = e.isDrag, r = e.datas;
    if (r.isRotate) {
      this.dragControlEnd(t, e);
      var a = vn(t, this, "dragControlEnd", e), i = je(t, e, {
        targets: t.props.targets,
        events: a
      });
      return gt(t, "onRotateGroupEnd", i), n;
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
function ry(t, e) {
  var n, r = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, c = r === "horizontal", u = c ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (n = {}, n[c ? "width" : "height"] = "".concat(i), n.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(u, "(-50%) scale").concat(u, "(").concat(s, ")"), n)
  });
}
function kl(t, e) {
  return ry(O(O({}, t), { classNames: ot([
    bt("line", "guideline", t.direction)
  ], A(t.classNames), !1).filter(function(n) {
    return n;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(n) {
    return "".concat(Dt(n, 0.1), "px");
  }) }), e);
}
function Tu(t, e, n, r, a, i, o, s) {
  var l = t.props.zoom;
  return n.map(function(c, u) {
    var d = c.type, f = c.pos, h = [0, 0];
    return h[o] = r, h[o ? 0 : 1] = -a + f, kl({
      key: "".concat(e, "TargetGuideline").concat(u),
      classNames: [bt("target", "bold", d)],
      posValue: h,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function _u(t, e, n, r, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, c = e === "horizontal" ? jn : In, u = a[c.start], d = a[c.end];
  return n.filter(function(f) {
    var h = f.hide, v = f.elementRect;
    if (h)
      return !1;
    if (l && v) {
      var m = v.rect;
      if (m[c.start] <= u && d <= m[c.end])
        return !1;
    }
    return !0;
  }).map(function(f, h) {
    var v = f.pos, m = f.size, y = f.element, w = f.className, S = [
      -r[0] + v[0],
      -r[1] + v[1]
    ];
    return kl({
      key: "".concat(e, "-default-guideline-").concat(h),
      classNames: y ? [bt("bold"), w] : [bt("normal"), w],
      direction: e,
      posValue: S,
      sizeValue: m,
      zoom: s
    }, i);
  });
}
function $r(t, e, n, r, a, i, o, s) {
  var l, c = t.props, u = c.snapDigit, d = u === void 0 ? 0 : u, f = c.isDisplaySnapDigit, h = f === void 0 ? !0 : f, v = c.snapDistFormat, m = v === void 0 ? function(M, E) {
    return M;
  } : v, y = c.zoom, w = e === "horizontal" ? "X" : "Y", S = e === "vertical" ? "height" : "width", C = Math.abs(a), k = h ? parseFloat(C.toFixed(d)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(n, "-guideline-").concat(r), className: bt("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[S] = "".concat(C, "px"), l) },
    kl({
      direction: e,
      classNames: [bt(n), o],
      size: "100%",
      posValue: [0, 0],
      sizeValue: C,
      zoom: y
    }, s),
    s.createElement("div", { className: bt("size-value", "gap"), style: {
      transform: "translate".concat(w, "(-50%) scale(").concat(y, ")")
    } }, k > 0 ? m(k, e) : "")
  );
}
function ay(t, e, n, r) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? jn : In, s = n[o.start], l = n[o.end];
  return Np(e, function(c) {
    return c.pos[a];
  }).map(function(c) {
    var u = [], d = [], f = [];
    return c.forEach(function(h) {
      var v, m, y = h.element, w = h.elementRect.rect;
      if (w[o.end] < s)
        u.push(h);
      else if (l < w[o.start])
        d.push(h);
      else if (w[o.start] <= s && l <= w[o.end] && r) {
        var S = h.pos, C = { element: y, rect: O(O({}, w), (v = {}, v[o.end] = w[o.start], v)) }, k = { element: y, rect: O(O({}, w), (m = {}, m[o.start] = w[o.end], m)) }, M = [0, 0], E = [0, 0];
        M[a] = S[a], M[i] = S[i], E[a] = S[a], E[i] = S[i] + h.size, u.push({
          type: t,
          pos: M,
          size: 0,
          elementRect: C,
          direction: "",
          elementDirection: "end"
        }), d.push({
          type: t,
          pos: E,
          size: 0,
          elementRect: k,
          direction: "",
          elementDirection: "start"
        });
      }
    }), u.sort(function(h, v) {
      return v.pos[i] - h.pos[i];
    }), d.sort(function(h, v) {
      return h.pos[i] - v.pos[i];
    }), {
      total: c,
      start: u,
      end: d,
      inner: f
    };
  });
}
function iy(t, e, n, r, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(y) {
      return y.type === s;
    }), c = s === "vertical" ? 1 : 0, u = c ? 0 : 1, d = ay(s, l, r, i), f = c ? In : jn, h = c ? jn : In, v = r[f.start], m = r[f.end];
    d.forEach(function(y) {
      var w = y.total, S = y.start, C = y.end, k = y.inner, M = n[u] + w[0].pos[u] - r[h.start], E = r;
      S.forEach(function(D) {
        var _ = D.elementRect.rect, j = E[f.start] - _[f.end];
        if (j > 0) {
          var x = [0, 0];
          x[c] = n[c] + E[f.start] - v - j, x[u] = M, o.push($r(t, s, "dashed", o.length, j, x, D.className, a));
        }
        E = _;
      }), E = r, C.forEach(function(D) {
        var _ = D.elementRect.rect, j = _[f.start] - E[f.end];
        if (j > 0) {
          var x = [0, 0];
          x[c] = n[c] + E[f.end] - v, x[u] = M, o.push($r(t, s, "dashed", o.length, j, x, D.className, a));
        }
        E = _;
      }), k.forEach(function(D) {
        var _ = D.elementRect.rect, j = v - _[f.start], x = _[f.end] - m, I = [0, 0], P = [0, 0];
        I[c] = n[c] - j, I[u] = M, P[c] = n[c] + m - v, P[u] = M, o.push($r(t, s, "dashed", o.length, j, I, D.className, a)), o.push($r(t, s, "dashed", o.length, x, P, D.className, a));
      });
    });
  }), o;
}
function oy(t, e, n, r, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(y) {
      return y.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, c = l ? 0 : 1, u = l ? In : jn, d = l ? jn : In, f = r[u.start], h = r[u.end], v = r[d.start], m = r[d.end];
    s.forEach(function(y) {
      var w = y.gap, S = y.gapRects, C = Math.max.apply(Math, ot([v], A(S.map(function(E) {
        var D = E.rect;
        return D[d.start];
      })), !1)), k = Math.min.apply(Math, ot([m], A(S.map(function(E) {
        var D = E.rect;
        return D[d.end];
      })), !1)), M = (C + k) / 2;
      C === k || M === (v + m) / 2 || S.forEach(function(E) {
        var D = E.rect, _ = E.className, j = [n[0], n[1]];
        if (D[u.end] < f)
          j[l] += D[u.end] - f;
        else if (h < D[u.start])
          j[l] += D[u.start] - f - w;
        else
          return;
        j[c] += M - v, i.push($r(t, l ? "vertical" : "horizontal", "gap", i.length, w, j, _, a));
      });
    });
  }), i;
}
function Cs(t) {
  var e, n, r = t.state, a = r.containerClientRect, i = r.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, c = a.clientHeight, u = a.clientWidth, d = a.clientLeft, f = a.clientTop, h = t.props, v = h.snapGap, m = v === void 0 ? !0 : v, y = h.verticalGuidelines, w = h.horizontalGuidelines, S = h.snapThreshold, C = S === void 0 ? 5 : S, k = h.maxSnapElementGuidelineDistance, M = k === void 0 ? 1 / 0 : k, E = h.isDisplayGridGuidelines, D = ze(Ge(t.state)), _ = D.top, j = D.left, x = D.bottom, I = D.right, P = { top: _, left: j, bottom: x, right: I, center: (j + I) / 2, middle: (_ + x) / 2 }, R = uy(t), N = ot([], A(R), !1), F = ((n = (e = r.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && n !== void 0 ? n : [1, 1]).map(function(Y) {
    return Y * C;
  });
  m && N.push.apply(N, ot([], A(sy(t, P, F)), !1));
  var q = O({}, r.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (N.push.apply(N, ot([], A(cy(t, o ? l : u, o ? s : c, d, f, q, E)), !1)), i) {
    var z = a.left, B = a.top;
    q.left += z, q.top += B, q.right += z, q.bottom += B;
  }
  return N.push.apply(N, ot([], A(wp(w || !1, y || !1, o ? l : u, o ? s : c, d, f, q)), !1)), N = N.filter(function(Y) {
    var V = Y.element, W = Y.elementRect, tt = Y.type;
    if (!V || !W)
      return !0;
    var J = W.rect;
    return bp(P, J, tt, M);
  }), N;
}
function sy(t, e, n) {
  var r = t.props, a = r.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = r.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, c = [];
  return [
    ["vertical", jn, In],
    ["horizontal", In, jn]
  ].forEach(function(u) {
    var d = A(u, 3), f = d[0], h = d[1], v = d[2], m = e[h.start], y = e[h.end], w = e[h.center], S = e[v.start], C = e[v.end], k = {
      left: n[0],
      top: n[1]
    };
    function M(_) {
      var j = _.rect, x = k[h.start];
      return j[h.end] < m + x ? m - j[h.end] : y - x < j[h.start] ? j[h.start] - y : -1;
    }
    var E = l.filter(function(_) {
      var j = _.rect;
      return j[v.start] > C || j[v.end] < S ? !1 : M(_) > 0;
    }).sort(function(_, j) {
      return M(_) - M(j);
    }), D = [];
    E.forEach(function(_) {
      E.forEach(function(j) {
        if (_ !== j) {
          var x = _.rect, I = j.rect, P = x[v.start], R = x[v.end], N = I[v.start], F = I[v.end];
          P > F || N > R || D.push([_, j]);
        }
      });
    }), D.forEach(function(_) {
      var j = A(_, 2), x = j[0], I = j[1], P = x.rect, R = I.rect, N = P[h.start], F = P[h.end], q = R[h.start], z = R[h.end], B = k[h.start], Y = 0, V = 0, W = !1, tt = !1, J = !1;
      if (F <= m && y <= q) {
        if (tt = !0, Y = (q - F - (y - m)) / 2, V = F + Y + (y - m) / 2, et(V - w) > B)
          return;
      } else if (F < q && z < m + B) {
        if (W = !0, Y = q - F, V = z + Y, et(V - m) > B)
          return;
      } else if (F < q && y - B < N) {
        if (J = !0, Y = q - F, V = N - Y, et(V - y) > B)
          return;
      } else
        return;
      Y && bp(e, R, f, i) && (Y > s || c.push({
        type: f,
        pos: f === "vertical" ? [V, 0] : [0, V],
        element: I.element,
        size: 0,
        className: I.className,
        isStart: W,
        isCenter: tt,
        isEnd: J,
        gap: Y,
        hide: !0,
        gapRects: [x, I],
        direction: "",
        elementDirection: ""
      }));
    });
  }), c;
}
function ly(t, e, n, r) {
  var a, i, o = t.props, s = t.state, l = o.snapGridAll, c = o.snapGridWidth, u = c === void 0 ? 0 : c, d = o.snapGridHeight, f = d === void 0 ? 0 : d, h = s.snapRenderInfo, v = h && (((a = h.direction) === null || a === void 0 ? void 0 : a[0]) || ((i = h.direction) === null || i === void 0 ? void 0 : i[1])), m = t.moveables;
  if (l && m && v && (u || f)) {
    if (s.snapThresholdInfo)
      return;
    s.snapThresholdInfo = {
      multiples: [1, 1],
      offset: [0, 0]
    };
    var y = t.getRect(), w = y.children, S = h.direction;
    if (w) {
      var C = S.map(function(M, E) {
        var D = E === 0 ? {
          snapSize: u,
          posName: "left",
          sizeName: "width",
          clientOffset: r.left - e
        } : {
          snapSize: f,
          posName: "top",
          sizeName: "height",
          clientOffset: r.top - n
        }, _ = D.snapSize, j = D.posName, x = D.sizeName, I = D.clientOffset;
        if (!_)
          return {
            dir: M,
            multiple: 1,
            snapSize: _,
            snapOffset: 0
          };
        var P = y[x], R = y[j], N = s0(w.map(function(W) {
          return [
            W[j] - R,
            W[x],
            P - W[x] - W[j] + R
          ];
        })).filter(function(W) {
          return W;
        }).sort(function(W, tt) {
          return W - tt;
        }), F = N[0], q = N.map(function(W) {
          return Dt(W / F, 0.1) * _;
        }), z = 1, B = Dt(P / F, 0.1);
        for (z = 1; z <= 10 && !q.every(function(W) {
          return W * z % 1 === 0;
        }); ++z)
          ;
        var Y = (-M + 1) / 2, V = bi(R - I, R - I + P, Y, 1 - Y);
        return {
          multiple: B * z,
          dir: M,
          snapSize: _,
          snapOffset: Math.round(V / _)
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
function cy(t, e, n, r, a, i, o) {
  r === void 0 && (r = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, c = s.snapGridWidth, u = c === void 0 ? 0 : c, d = s.snapGridHeight, f = d === void 0 ? 0 : d, h = [], v = i.left, m = i.top, y = [0, 0];
  ly(t, r, a, i);
  var w = l.snapThresholdInfo, S = u, C = f;
  if (w && (u *= w.multiples[0] || 1, f *= w.multiples[1] || 1, y = w.offset), f) {
    for (var k = function(E) {
      h.push({
        type: "horizontal",
        pos: [
          v,
          Dt(y[1] * C + E - a + m, 0.1)
        ],
        className: bt("grid-guideline"),
        size: e,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, M = 0; M <= n * 2; M += f)
      k(M);
    for (var M = -f; M >= -n; M -= f)
      k(M);
  }
  if (u) {
    for (var k = function(D) {
      h.push({
        type: "vertical",
        pos: [
          Dt(y[0] * S + D - r + v, 0.1),
          m
        ],
        className: bt("grid-guideline"),
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
function bp(t, e, n, r) {
  return n === "horizontal" ? et(t.right - e.left) <= r || et(t.left - e.right) <= r || t.left <= e.right && e.left <= t.right : n === "vertical" ? et(t.bottom - e.top) <= r || et(t.top - e.bottom) <= r || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function uy(t) {
  var e = t.state, n = t.props.elementGuidelines, r = n === void 0 ? [] : n;
  if (!r.length)
    return e.elementRects = [], [];
  var a = (e.elementRects || []).filter(function(f) {
    return !f.refresh;
  }), i = r.map(function(f) {
    return Te(f) && "element" in f ? O(O({}, f), { element: tn(f.element, !0) }) : {
      element: tn(f, !0)
    };
  }).filter(function(f) {
    return f.element;
  }), o = or(a.map(function(f) {
    return f.element;
  }), i.map(function(f) {
    return f.element;
  })), s = o.maintained, l = o.added, c = [];
  s.forEach(function(f) {
    var h = A(f, 2), v = h[0], m = h[1];
    c[m] = a[v];
  }), dy(t, l.map(function(f) {
    return i[f];
  })).map(function(f, h) {
    c[l[h]] = f;
  }), e.elementRects = c;
  var u = bl(t.props.elementSnapDirections), d = [];
  return c.forEach(function(f) {
    var h = f.element, v = f.top, m = v === void 0 ? u.top : v, y = f.left, w = y === void 0 ? u.left : y, S = f.right, C = S === void 0 ? u.right : S, k = f.bottom, M = k === void 0 ? u.bottom : k, E = f.center, D = E === void 0 ? u.center : E, _ = f.middle, j = _ === void 0 ? u.middle : _, x = f.className, I = f.rect, P = wl({
      top: m,
      right: C,
      left: w,
      bottom: M,
      center: D,
      middle: j
    }, I), R = P.horizontal, N = P.vertical, F = P.horizontalNames, q = P.verticalNames, z = I.top, B = I.left, Y = I.right - B, V = I.bottom - z, W = [Y, V];
    N.forEach(function(tt, J) {
      d.push({
        type: "vertical",
        element: h,
        pos: [
          Dt(tt, 0.1),
          z
        ],
        size: V,
        sizes: W,
        className: x,
        elementRect: f,
        elementDirection: bu[q[J]] || q[J],
        direction: ""
      });
    }), R.forEach(function(tt, J) {
      d.push({
        type: "horizontal",
        element: h,
        pos: [
          B,
          Dt(tt, 0.1)
        ],
        size: Y,
        sizes: W,
        className: x,
        elementRect: f,
        elementDirection: bu[F[J]] || F[J],
        direction: ""
      });
    });
  }), d;
}
function ju(t, e) {
  return t ? t.map(function(n) {
    var r = Te(n) ? n : { pos: n }, a = r.pos;
    return oa(a) ? r : O(O({}, r), { pos: Ft(a, e) });
  }) : [];
}
function wp(t, e, n, r, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, c = o.top, u = o.bottom, d = o.right, f = n + d - l, h = r + u - c;
  return ju(t, h).forEach(function(v) {
    s.push({
      type: "horizontal",
      pos: [
        l,
        Dt(v.pos - i + c, 0.1)
      ],
      size: f,
      className: v.className,
      direction: ""
    });
  }), ju(e, f).forEach(function(v) {
    s.push({
      type: "vertical",
      pos: [
        Dt(v.pos - a + l, 0.1),
        c
      ],
      size: h,
      className: v.className,
      direction: ""
    });
  }), s;
}
function dy(t, e) {
  if (!e.length)
    return [];
  var n = t.props.groupable, r = t.state, a = r.containerClientRect, i = r.rootMatrix, o = r.is3d, s = r.offsetDelta, l = o ? 4 : 3, c = A(Ox(i, a, l), 2), u = c[0], d = c[1], f = n ? 0 : s[0], h = n ? 0 : s[1];
  return e.map(function(v) {
    var m = v.element.getBoundingClientRect(), y = m.left - u - f, w = m.top - d - h, S = w + m.height, C = y + m.width, k = A(wr(i, [y, w], l), 2), M = k[0], E = k[1], D = A(wr(i, [C, S], l), 2), _ = D[0], j = D[1];
    return O(O({}, v), { rect: {
      left: M,
      right: _,
      top: E,
      bottom: j,
      center: (M + _) / 2,
      middle: (E + j) / 2
    } });
  });
}
function Za(t) {
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
    var o = tn(r, !0);
    if (o) {
      var s = Zr(o), l = Au(e, [
        s.left - a.left,
        s.top - a.top
      ]), c = Au(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = Dt(l[0], 1e-5), i.top = Dt(l[1], 1e-5), i.right = Dt(c[0], 1e-5), i.bottom = Dt(c[1], 1e-5);
    }
  }
  return e.snapContainer = r, e.snapOffset = i, e.guidelines = Cs(t), e.enableSnap = !0, !0;
}
function Sp(t, e, n, r, a, i) {
  var o = er(t, e, n, i ? 4 : 3), s = ce(o, r);
  return Ml(o, wt(a, s));
}
function Iu(t) {
  return t ? t / et(t) : 0;
}
function fy(t, e, n, r, a, i) {
  var o = i.fixedDirection, s = Fx(n, o, r), l = Cl(t, e, n, r), c = ot(ot([], A(Zx(t, e, s, r, a, i)), !1), A(vp(t, l, i)), !1), u = Di(c, 0), d = Di(c, 1);
  return {
    width: {
      isBound: u.isBound,
      offset: u.offset[0]
    },
    height: {
      isBound: d.isBound,
      offset: d.offset[1]
    }
  };
}
function py(t, e, n, r, a, i, o, s, l) {
  var c = ce(e, o), u = Xi(t, s, {
    vertical: [c[0]],
    horizontal: [c[1]]
  }), d = u.horizontal.offset, f = u.vertical.offset;
  if (Dt(f, vs) || Dt(d, vs)) {
    var h = A(en({
      datas: l,
      distX: -f,
      distY: -d
    }), 2), v = h[0], m = h[1], y = Math.min(a || 1 / 0, n + o[0] * v), w = Math.min(i || 1 / 0, r + o[1] * m);
    return [y - n, w - r];
  }
  return [0, 0];
}
function Cp(t, e, n, r, a, i, o, s) {
  for (var l = Ge(t.state), c = t.props.keepRatio, u = 0, d = 0, f = 0; f < 2; ++f) {
    var h = e(u, d), v = fy(t, h, a, c, o, s), m = v.width, y = v.height, w = m.isBound, S = y.isBound, C = m.offset, k = y.offset;
    if (f === 1 && (w || (C = 0), S || (k = 0)), f === 0 && o && !w && !S)
      return [0, 0];
    if (c) {
      var M = et(C) * (n ? 1 / n : 1), E = et(k) * (r ? 1 / r : 1), D = w && S ? M < E : S || !w && M < E;
      D ? C = n * k / r : k = r * C / n;
    }
    u += C, d += k;
  }
  if (!c && a[0] && a[1]) {
    var _ = Qx(t, l, a, i, s), j = _.maxWidth, x = _.maxHeight, I = A(py(t, e(u, d).map(function(N) {
      return N.map(function(F) {
        return Dt(F, vs);
      });
    }), n + u, r + d, j, x, a, o, s), 2), C = I[0], k = I[1];
    u += C, d += k;
  }
  return [u, d];
}
function qr(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function hy(t, e) {
  e = qr(e);
  var n = Math.floor(t / 360), r = n * 360 + 360 - e, a = n * 360 + e;
  return et(t - r) < et(t - a) ? r : a;
}
function Oo(t, e) {
  t = qr(t), e = qr(e);
  var n = qr(t - e);
  return Math.min(n, 360 - n);
}
function gy(t, e, n, r) {
  var a, i = t.props, o = (a = i[lp]) !== null && a !== void 0 ? a : 5, s = i[cp];
  if (_r(t, "rotatable")) {
    var l = e.pos1, c = e.pos2, u = e.pos3, d = e.pos4, f = e.origin, h = n * Math.PI / 180, v = [l, c, u, d].map(function(k) {
      return wt(k, f);
    }), m = v.map(function(k) {
      return fa(k, h);
    }), y = ot(ot([], A(Ix(t, v, m, f, n)), !1), A(Xx(t, v, m, f, n)), !1);
    y.sort(function(k, M) {
      return et(k - n) - et(M - n);
    });
    var w = y.length > 0;
    if (w)
      return {
        isSnap: w,
        dist: w ? y[0] : n
      };
  }
  if (s != null && s.length && o) {
    var S = s.slice().sort(function(k, M) {
      return Oo(k, r) - Oo(M, r);
    }), C = S[0];
    if (Oo(C, r) <= o)
      return {
        isSnap: !0,
        dist: n + hy(r, C) - r
      };
  }
  return {
    isSnap: !1,
    dist: n
  };
}
function vy(t, e, n, r, a, i, o) {
  if (!_r(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, c = t.state, u = c.allMatrix, d = c.is3d;
  return Cp(t, function(f, h) {
    return Sp(l || u, e + f, n + h, s, a, d);
  }, e, n, r, a, i, o);
}
function my(t, e, n, r, a) {
  if (!_r(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, c = a.is3d, u = Cp(t, function(d, f) {
    return Sp(vx(a, Ot(e, [d / i, f / o])), i, o, l, s, c);
  }, i, o, n, s, r, a);
  return [u[0] / i, u[1] / o];
}
function xy(t, e) {
  e.absolutePoses = Ge(t.state);
}
function Ru(t) {
  var e = [];
  return t.forEach(function(n) {
    n.guidelineInfos.forEach(function(r) {
      var a = r.guideline;
      _e(e, function(i) {
        return i.guideline === a;
      }) || (a.direction = "", e.push({ guideline: a, posInfo: n }));
    });
  }), e.map(function(n) {
    var r = n.guideline, a = n.posInfo;
    return O(O({}, r), { direction: a.direction });
  });
}
function Pu(t, e, n, r, a, i) {
  var o = yl(Wi(t, i), e, n), s = o.vertical, l = o.horizontal, c = cr();
  s.forEach(function(v) {
    v.isBound && (v.direction === "start" && (c.left = !0), v.direction === "end" && (c.right = !0), r.push({
      type: "bounds",
      pos: v.pos
    }));
  }), l.forEach(function(v) {
    v.isBound && (v.direction === "start" && (c.top = !0), v.direction === "end" && (c.bottom = !0), a.push({
      type: "bounds",
      pos: v.pos
    }));
  });
  var u = Hx(t), d = u.boundMap, f = u.vertical, h = u.horizontal;
  return f.forEach(function(v) {
    mn(r, function(m) {
      var y = m.type, w = m.pos;
      return y === "bounds" && w === v;
    }) >= 0 || r.push({
      type: "bounds",
      pos: v
    });
  }), h.forEach(function(v) {
    mn(a, function(m) {
      var y = m.type, w = m.pos;
      return y === "bounds" && w === v;
    }) >= 0 || a.push({
      type: "bounds",
      pos: v
    });
  }), {
    boundMap: c,
    innerBoundMap: d
  };
}
var yy = _l("", ["resizable", "scalable"]), by = {
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
    lp,
    cp,
    up,
    dp,
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
    var n = t.state, r = n.top, a = n.left, i = n.pos1, o = n.pos2, s = n.pos3, l = n.pos4, c = n.snapRenderInfo, u = t.props.snapRenderThreshold, d = u === void 0 ? 1 : u;
    if (!c || !c.render || !_r(t, ""))
      return dr(t, "boundMap", cr(), function(rt) {
        return JSON.stringify(rt);
      }), dr(t, "innerBoundMap", cr(), function(rt) {
        return JSON.stringify(rt);
      }), [];
    n.guidelines = Cs(t);
    var f = Math.min(i[0], o[0], s[0], l[0]), h = Math.min(i[1], o[1], s[1], l[1]), v = c.externalPoses || [], m = Ge(t.state), y = [], w = [], S = [], C = [], k = [], M = ze(m), E = M.width, D = M.height, _ = M.top, j = M.left, x = M.bottom, I = M.right, P = { left: j, right: I, top: _, bottom: x, center: (j + I) / 2, middle: (_ + x) / 2 }, R = v.length > 0, N = R ? ze(v) : {};
    if (!c.request) {
      if (c.direction && k.push(zx(t, m, c.direction, d, d)), c.snap) {
        var F = ze(m);
        c.center && (F.middle = (F.top + F.bottom) / 2, F.center = (F.left + F.right) / 2), k.push(wu(t, F, d, d));
      }
      R && (c.center && (N.middle = (N.top + N.bottom) / 2, N.center = (N.left + N.right) / 2), k.push(wu(t, N, d, d))), k.forEach(function(rt) {
        var Q = rt.vertical.posInfos, at = rt.horizontal.posInfos;
        y.push.apply(y, ot([], A(Q.filter(function(ft) {
          var Z = ft.guidelineInfos;
          return Z.some(function(ut) {
            var vt = ut.guideline;
            return !vt.hide;
          });
        }).map(function(ft) {
          return {
            type: "snap",
            pos: ft.pos
          };
        })), !1)), w.push.apply(w, ot([], A(at.filter(function(ft) {
          var Z = ft.guidelineInfos;
          return Z.some(function(ut) {
            var vt = ut.guideline;
            return !vt.hide;
          });
        }).map(function(ft) {
          return {
            type: "snap",
            pos: ft.pos
          };
        })), !1)), S.push.apply(S, ot([], A(Ru(Q)), !1)), C.push.apply(C, ot([], A(Ru(at)), !1));
      });
    }
    var q = Pu(t, [j, I], [_, x], y, w), z = q.boundMap, B = q.innerBoundMap;
    R && Pu(t, [N.left, N.right], [N.top, N.bottom], y, w, c.externalBounds);
    var Y = ot(ot([], A(S), !1), A(C), !1), V = Y.filter(function(rt) {
      return rt.element && !rt.gapRects;
    }), W = Y.filter(function(rt) {
      return rt.gapRects;
    }).sort(function(rt, Q) {
      return rt.gap - Q.gap;
    });
    gt(t, "onSnap", {
      guidelines: Y.filter(function(rt) {
        var Q = rt.element;
        return !Q;
      }),
      elements: V,
      gaps: W
    }, !0);
    var tt = dr(t, "boundMap", z, function(rt) {
      return JSON.stringify(rt);
    }, cr()), J = dr(t, "innerBoundMap", B, function(rt) {
      return JSON.stringify(rt);
    }, cr());
    return (z === tt || B === J) && gt(t, "onBound", {
      bounds: z,
      innerBounds: B
    }, !0), ot(ot(ot(ot(ot(ot([], A(iy(t, V, [f, h], P, e)), !1), A(oy(t, W, [f, h], P, e)), !1), A(_u(t, "horizontal", C, [a, r], P, e)), !1), A(_u(t, "vertical", S, [a, r], P, e)), !1), A(Tu(t, "horizontal", w, f, r, E, 0, e)), !1), A(Tu(t, "vertical", y, h, a, D, 1, e)), !1);
  },
  dragStart: function(t, e) {
    t.state.snapRenderInfo = {
      request: e.isRequest,
      snap: !0,
      center: !0
    }, Za(t);
  },
  drag: function(t) {
    var e = t.state;
    Za(t) || (e.guidelines = Cs(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (yy(t, e) || Ss(t, e))
      return !0;
    if (!e.isRequest && e.inputEvent)
      return se(e.inputEvent.target, bt("snap-control"));
  },
  dragControlStart: function(t) {
    t.state.snapRenderInfo = null, Za(t);
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
    t.state.snapRenderInfo = null, Za(t);
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
function wy(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function bt() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return Ym.apply(void 0, ot([gl], A(t), !1));
}
function kp(t) {
  t();
}
function Sy(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : Te(t) ? t : vr(t);
}
function Ur(t, e, n) {
  return Si(e, Zn(n, e), t, Zn(n.map(function(r) {
    return -r;
  }), e));
}
function Cy(t, e, n) {
  if (e === "%") {
    var r = El(t.ownerSVGElement);
    return r[n ? "width" : "height"] / 100;
  }
  return 1;
}
function ky(t) {
  var e = Ey(Dl(t, ":before"));
  return e.map(function(n, r) {
    var a = qn(n), i = a.value, o = a.unit;
    return i * Cy(t, o, r === 0);
  });
}
function _i(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function Ey(t) {
  return _i(t.transformOrigin);
}
function Ep(t) {
  var e = Ee(t), n = e("transform");
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
      o.push("matrix(".concat(["a", "b", "c", "d", "e", "f"].map(function(d) {
        return u[d];
      }).join(", "), ")"));
    }, l = 0; l < i; ++l)
      s(l);
    return o.join(" ");
  }
  return "";
}
function ua(t, e, n, r, a) {
  var i, o, s = ll(t) || Pn(t), l = !1, c, u;
  if (!t || n)
    c = t;
  else {
    var d = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, f = t.parentElement;
    d ? (l = !0, u = f, c = d) : c = f;
  }
  for (var h = !1, v = t === e || c === e, m = "relative", y = 1, w = parseFloat(a == null ? void 0 : a("zoom")) || 1, S = a == null ? void 0 : a("position"); c && c !== s; ) {
    e === c && (v = !0);
    var C = Ee(c), k = c.tagName.toLowerCase(), M = Ep(c), E = C("willChange"), D = parseFloat(C("zoom")) || 1;
    if (m = C("position"), r && D !== 1) {
      y = D;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !n && r && w !== 1 && S && S !== "absolute" || k === "svg" || k === "foreignobject" || m !== "static" || M && M !== "none" || E === "transform"
    )
      break;
    var _ = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, j = c.parentNode;
    _ && (l = !0, u = j);
    var x = j;
    if (x && x.nodeType === 11) {
      c = x.host, h = !0, m = Ee(c)("position");
      break;
    }
    c = x, m = "relative";
  }
  return {
    offsetZoom: y,
    hasSlot: l,
    parentSlotElement: u,
    isCustomElement: h,
    isStatic: m === "static",
    isEnd: v || !c || c === s,
    offsetParent: c || s
  };
}
function My(t, e) {
  var n, r = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = Ee(t), s = rl(a), l = !s, c, u;
  return !l && (r !== "svg" || t.ownerSVGElement) ? (c = Xf ? ky(t) : _i(o("transformOrigin")).map(function(d) {
    return parseFloat(d);
  }), u = c.slice(), l = !0, r === "svg" ? (a = 0, i = 0) : (n = A(_y(t, c, t === e && e.tagName.toLowerCase() === "g"), 4), a = n[0], i = n[1], c[0] = n[2], c[1] = n[3])) : (c = _i(o("transformOrigin")).map(function(d) {
    return parseFloat(d);
  }), u = c.slice()), {
    tagName: r,
    isSVG: s,
    hasOffset: l,
    offset: [a || 0, i || 0],
    origin: c,
    targetOrigin: u
  };
}
function Mp(t, e) {
  var n = Ee(t), r = Ee(Pn(t)), a = r("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(r("marginLeft"), 10), o = parseInt(r("marginTop"), 10);
  return n("position") === "absolute" && ((n("top") !== "auto" || n("bottom") !== "auto") && (o = 0), (n("left") !== "auto" || n("right") !== "auto") && (i = 0)), [i, o];
}
function ks(t) {
  t.forEach(function(e) {
    var n = e.matrix;
    n && (e.matrix = Ze(n, 3, 4));
  });
}
function Dy(t) {
  for (var e = t.parentElement, n = !1, r = Pn(t); e; ) {
    var a = Dl(e).transform;
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
function Hi(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(Of(t, !e).join(","), ")");
}
function El(t) {
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
function Ty(t, e) {
  var n, r = El(t), a = r.width, i = r.height, o = r.clientWidth, s = r.clientHeight, l = o / a, c = s / i, u = t.preserveAspectRatio.baseVal, d = u.align, f = u.meetOrSlice, h = [0, 0], v = [l, c], m = [0, 0];
  if (d !== 1) {
    var y = (d - 2) % 3, w = Math.floor((d - 2) / 3);
    h[0] = a * y / 2, h[1] = i * w / 2;
    var S = f === 2 ? Math.max(c, l) : Math.min(l, c);
    v[0] = S, v[1] = S, m[0] = (o - a) / 2 * y, m[1] = (s - i) / 2 * w;
  }
  var C = cl(v, e);
  return n = A(m, 2), C[e * (e - 1)] = n[0], C[e * (e - 1) + 1] = n[1], Ur(C, e, h);
}
function _y(t, e, n) {
  var r = t.tagName.toLowerCase();
  if (!t.getBBox || !n && r === "g")
    return [0, 0, 0, 0];
  var a = Ee(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = El(t.ownerSVGElement), l = o.x, c = o.y;
  r === "foreignobject" && !l && !c && (l = parseFloat(t.getAttribute("x")) || 0, c = parseFloat(t.getAttribute("y")) || 0);
  var u = l - s.x, d = c - s.y, f = i ? e[0] : e[0] - u, h = i ? e[1] : e[1] - d;
  return [u, d, f, h];
}
function Ut(t, e, n) {
  return ve(t, Un(e, n), n);
}
function er(t, e, n, r) {
  return [[0, 0], [e, 0], [0, n], [e, n]].map(function(a) {
    return Ut(t, a, r);
  });
}
function ze(t) {
  var e = t.map(function(c) {
    return c[0];
  }), n = t.map(function(c) {
    return c[1];
  }), r = Math.min.apply(Math, ot([], A(e), !1)), a = Math.min.apply(Math, ot([], A(n), !1)), i = Math.max.apply(Math, ot([], A(e), !1)), o = Math.max.apply(Math, ot([], A(n), !1)), s = i - r, l = o - a;
  return {
    left: r,
    top: a,
    right: i,
    bottom: o,
    width: s,
    height: l
  };
}
function Nu(t, e, n, r) {
  var a = er(t, e, n, r);
  return ze(a);
}
function jy(t, e, n, r, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, c = Tp(o), u = c.offsetWidth, d = c.offsetHeight, f = n.getBoundingClientRect(), h = [0, 0];
  n === Pn(n) && (h = Mp(o, !0));
  for (var v = o.getBoundingClientRect(), m = v.left - f.left + n.scrollLeft - (n.clientLeft || 0) + h[0], y = v.top - f.top + n.scrollTop - (n.clientTop || 0) + h[1], w = v.width, S = v.height, C = Si(r, a, l), k = Nu(C, u, d, r), M = k.left, E = k.top, D = k.width, _ = k.height, j = Ut(C, s, r), x = wt(j, [M, E]), I = [
    m + x[0] * w / D,
    y + x[1] * S / _
  ], P = [0, 0], R = 0; ++R < 10; ) {
    var N = Ue(a, r);
    i = A(wt(Ut(N, I, r), Ut(N, j, r)), 2), P[0] = i[0], P[1] = i[1];
    var F = Si(r, a, Zn(P, r), l), q = Nu(F, u, d, r), z = q.left, B = q.top, Y = z - m, V = B - y;
    if (et(Y) < 2 && et(V) < 2)
      break;
    I[0] -= Y, I[1] -= V;
  }
  return P.map(function(W) {
    return Math.round(W);
  });
}
function Iy(t, e, n) {
  var r = t.length === 16, a = r ? 4 : 3, i = e.map(function(l) {
    return Ut(t, l, a);
  }), o = n.left, s = n.top;
  return i.map(function(l) {
    return [l[0] + o, l[1] + s];
  });
}
function Be(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
}
function Dp(t, e) {
  return Be([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function Wr(t, e, n, r) {
  n === void 0 && (n = 1), r === void 0 && (r = ee(t, e));
  var a = Dp(t, e);
  return {
    transform: "translateY(-50%) translate(".concat(t[0], "px, ").concat(t[1], "px) rotate(").concat(r, "rad) scaleY(").concat(n, ")"),
    width: "".concat(a, "px")
  };
}
function ji(t, e) {
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
function Qn(t, e) {
  var n = t[e];
  return Te(n) ? O(O({}, t), n) : t;
}
function Tp(t) {
  var e = t && !rl(t.offsetWidth), n = 0, r = 0, a = 0, i = 0, o = 0, s = 0, l = 0, c = 0, u = 0, d = 0, f = 0, h = 0, v = 1 / 0, m = 1 / 0, y = 1 / 0, w = 1 / 0, S = 0, C = 0, k = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var M = t.getBBox();
      k = !0, n = M.width, r = M.height, o = n, s = r, l = n, c = r, a = n, i = r;
    } else {
      var E = Ee(t), D = t.style, _ = E("boxSizing") === "border-box", j = parseFloat(E("borderLeftWidth")) || 0, x = parseFloat(E("borderRightWidth")) || 0, I = parseFloat(E("borderTopWidth")) || 0, P = parseFloat(E("borderBottomWidth")) || 0, R = parseFloat(E("paddingLeft")) || 0, N = parseFloat(E("paddingRight")) || 0, F = parseFloat(E("paddingTop")) || 0, q = parseFloat(E("paddingBottom")) || 0, z = R + N, B = F + q, Y = j + x, V = I + P, W = z + Y, tt = B + V, J = E("position"), rt = 0, Q = 0;
      if ("clientLeft" in t) {
        var at = null;
        if (J === "absolute") {
          var ft = ua(t, Pn(t));
          at = ft.offsetParent;
        } else
          at = t.parentElement;
        if (at) {
          var Z = Ee(at);
          rt = parseFloat(Z("width")), Q = parseFloat(Z("height"));
        }
      }
      u = Math.max(z, Ft(E("minWidth"), rt) || 0), d = Math.max(B, Ft(E("minHeight"), Q) || 0), v = Ft(E("maxWidth"), rt), m = Ft(E("maxHeight"), Q), isNaN(v) && (v = 1 / 0), isNaN(m) && (m = 1 / 0), S = Ft(D.width, 0) || 0, C = Ft(D.height, 0) || 0, o = parseFloat(E("width")) || 0, s = parseFloat(E("height")) || 0, l = et(o - S) < 1 ? wi(u, S || o, v) : o, c = et(s - C) < 1 ? wi(d, C || s, m) : s, n = l, r = c, a = l, i = c, _ ? (y = v, w = m, f = u, h = d, l = n - W, c = r - tt) : (y = v + W, w = m + tt, f = u + W, h = d + tt, n = l + W, r = c + tt), a = l + z, i = c + B;
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
    minHeight: d,
    maxWidth: v,
    maxHeight: m,
    minOffsetWidth: f,
    minOffsetHeight: h,
    maxOffsetWidth: y,
    maxOffsetHeight: w
  };
}
function _p(t, e) {
  return ee(e > 0 ? t[0] : t[1], e > 0 ? t[1] : t[0]);
}
function Ja() {
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
function jp(t, e) {
  var n = t === Pn(t) || t === ll(t), r = {
    clientLeft: t.clientLeft,
    clientTop: t.clientTop,
    clientWidth: t.clientWidth,
    clientHeight: t.clientHeight,
    scrollWidth: t.scrollWidth,
    scrollHeight: t.scrollHeight,
    overflow: !1
  };
  return n && (r.clientHeight = Math.max(e.height, r.clientHeight), r.scrollHeight = Math.max(e.height, r.scrollHeight)), r.overflow = Ee(t)("overflow") !== "visible", O(O({}, e), r);
}
function Ao(t, e, n, r) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, c = e.left, u = {
    left: c + a,
    top: l + o,
    right: c + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return n && r ? jp(n, u) : u;
}
function Zr(t, e) {
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
  return t && e ? jp(t, s) : s;
}
function Ry(t) {
  var e = t.props, n = e.groupable, r = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !n && s && r ? Il(r, i, o) : l;
}
function Ip(t, e, n, r) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = n.target;
    a = Rp(i, r);
  }
  return a;
}
function Rp(t, e) {
  if (t) {
    var n = t.getAttribute("data-rotation") || "", r = t.getAttribute("data-direction");
    if (e.deg = n, !!r) {
      var a = [0, 0];
      return r.indexOf("w") > -1 && (a[0] = -1), r.indexOf("e") > -1 && (a[0] = 1), r.indexOf("n") > -1 && (a[1] = -1), r.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function Ml(t, e) {
  return [
    Ot(e, t[0]),
    Ot(e, t[1]),
    Ot(e, t[2]),
    Ot(e, t[3])
  ];
}
function Ge(t) {
  var e = t.left, n = t.top, r = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return Ml([r, a, i, o], [e, n]);
}
function Es(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(n) {
    n.unset && n.unset(t);
  });
}
function ur(t, e) {
  var n = e ? "controlGesto" : "targetGesto", r = t[n];
  (r == null ? void 0 : r.isIdle()) === !1 && Es(t, e), r == null || r.unset(), t[n] = null;
}
function Se(t, e) {
  if (e) {
    var n = Tr(e);
    n.nextStyle = O(O({}, n.nextStyle), t);
  }
  return {
    style: t,
    cssText: Mr(t).map(function(r) {
      return "".concat(n0(r, "-"), ": ").concat(t[r], ";");
    }).join("")
  };
}
function Pp(t, e, n) {
  var r = e.afterTransform || e.transform;
  return O(O({}, Se(O(O(O({}, t.style), e.style), { transform: r }), n)), { afterTransform: r, transform: t.transform });
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
function je(t, e, n) {
  var r = e.datas, a = "isDrag" in n ? n.isDrag : e.isDrag;
  return r.datas || (r.datas = {}), O(O({ isDrag: a }, n), { moveable: t, target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, lastEvent: r.lastEvent, isDouble: e.isDouble, datas: r.datas, isFirstDrag: !!e.isFirstDrag });
}
function Vi(t, e, n) {
  t._emitter.on(e, n);
}
function gt(t, e, n, r, a) {
  return t.triggerEvent(e, n, r, a);
}
function Dl(t, e) {
  return Le(t).getComputedStyle(t, e);
}
function Qa(t, e, n) {
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
function Ms(t, e) {
  return t === e || t == null && e == null;
}
function Ou() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var n = t.length - 1, r = 0; r < n; ++r) {
    var a = t[r];
    if (!rl(a))
      return a;
  }
  return t[n];
}
function Np(t, e) {
  var n = [], r = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = r.indexOf(o), l = n[s] || [];
    s === -1 && (r.push(o), n.push(l)), l.push(a);
  }), n;
}
function Py(t, e) {
  var n = [], r = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = r[o];
    s || (s = [], r[o] = s, n.push(s)), s.push(a);
  }), n;
}
function Op(t) {
  return t.reduce(function(e, n) {
    return e.concat(n);
  }, []);
}
function br() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return t.sort(function(n, r) {
    return et(r) - et(n);
  }), t[0];
}
function wr(t, e, n) {
  return ve(Ue(t, n), Un(e, n), n);
}
function Ny(t, e) {
  var n, r = t.is3d, a = t.rootMatrix, i = r ? 4 : 3;
  return n = A(wr(a, [e.distX, e.distY], i), 2), e.distX = n[0], e.distY = n[1], e;
}
function Oe(t, e, n, r) {
  if (!n[0] && !n[1])
    return e;
  var a = Ut(t, [Iu(n[0] || 1), 0], r), i = Ut(t, [0, Iu(n[1] || 1)], r), o = Ut(t, [
    n[0] / Be(a),
    n[1] / Be(i)
  ], r);
  return Ot(e, o);
}
function He(t, e, n) {
  return n ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function Ii(t) {
  return et(t) <= Ce ? 0 : t;
}
function Tl(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var n = Cx(e, t), r = n.deg;
    return r ? bt("view-control-rotation".concat(r)) : "";
  };
}
function _l(t, e) {
  return e === void 0 && (e = [t]), function(n, r) {
    if (r.isRequest)
      return e.some(function(i) {
        return r.requestAble === i;
      }) ? r.parentDirection : !1;
    var a = r.inputEvent.target;
    return se(a, bt("direction")) && (!t || se(a, bt(t)));
  };
}
function Oy(t, e, n) {
  var r, a = mr(t, {
    "x%": function(M) {
      return M / 100 * e.offsetWidth;
    },
    "y%": function(M) {
      return M / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, n < 0 ? void 0 : n), o = t.slice(0, n < 0 ? void 0 : n + 1), s = t[n] || "", l = n < 0 ? [] : t.slice(n), c = n < 0 ? [] : t.slice(n + 1), u = a.slice(0, n < 0 ? void 0 : n), d = a.slice(0, n < 0 ? void 0 : n + 1), f = (r = a[n]) !== null && r !== void 0 ? r : mr([""])[0], h = n < 0 ? [] : a.slice(n), v = n < 0 ? [] : a.slice(n + 1), m = f ? [f] : [], y = ir(u), w = ir(d), S = ir(h), C = ir(v), k = Bt(y, S, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: y,
    beforeFunctionMatrix2: w,
    targetFunctionMatrix: ir(m),
    afterFunctionMatrix: S,
    afterFunctionMatrix2: C,
    allFunctionMatrix: k,
    beforeFunctions: u,
    beforeFunctions2: d,
    targetFunction: m[0],
    afterFunctions: h,
    afterFunctions2: v,
    beforeFunctionTexts: i,
    beforeFunctionTexts2: o,
    targetFunctionText: s,
    afterFunctionTexts: l,
    afterFunctionTexts2: c
  };
}
function Ay(t) {
  return !t || !Te(t) || la(t) ? !1 : te(t) || "length" in t;
}
function tn(t, e) {
  return t ? la(t) ? t : Fe(t) ? e ? document.querySelector(t) : t : zi(t) ? t() : Rf(t) ? t : "current" in t ? t.current : t : null;
}
function jl(t, e) {
  if (!t)
    return [];
  var n = Ay(t) ? [].slice.call(t) : [t];
  return n.reduce(function(r, a) {
    return Fe(a) && e ? ot(ot([], A(r), !1), A([].slice.call(document.querySelectorAll(a))), !1) : (te(a) ? r.push(jl(a, e)) : r.push(tn(a, e)), r);
  }, []);
}
function Ly(t, e, n) {
  var r = ee(t, e) / Math.PI * 180;
  return r = n >= 0 ? r : 180 - r, r = r >= 0 ? r : 360 + r, r;
}
function Au(t, e) {
  var n = t.rootMatrix, r = t.is3d, a = r ? 4 : 3, i = Ue(n, a);
  return r || (i = Ze(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, ui(i, e);
}
function Ap(t, e, n, r, a) {
  var i = A(t, 2), o = i[0], s = i[1], l = 0, c = 0;
  if (a && o && s) {
    var u = ee([0, 0], e), d = ee([0, 0], r), f = Be(e), h = Math.cos(u - d) * f;
    if (!r[0])
      c = h, l = c * n;
    else if (!r[1])
      l = h, c = l / n;
    else {
      var v = r[0] * o, m = r[1] * s, y = Math.atan2(v + e[0], m + e[1]), w = Math.atan2(v, m);
      y < 0 && (y += Math.PI * 2), w < 0 && (w += Math.PI * 2);
      var S = 0;
      et(y - w) < Math.PI / 2 || et(y - w) > Math.PI / 2 * 3 || (w += Math.PI), S = y - w, S > Math.PI * 2 ? S -= Math.PI * 2 : S > Math.PI ? S = 2 * Math.PI - S : S < -Math.PI && (S = -2 * Math.PI - S);
      var C = Be([v + e[0], m + e[1]]) * Math.cos(S);
      l = C * Math.sin(w) - v, c = C * Math.cos(w) - m, r[0] < 0 && (l *= -1), r[1] < 0 && (c *= -1);
    }
  } else
    l = r[0] * e[0], c = r[1] * e[1];
  return [l, c];
}
function Lp(t, e, n, r) {
  var a, i = n.ratio, o = n.startOffsetWidth, s = n.startOffsetHeight, l = 0, c = 0, u = r.distX, d = r.distY, f = r.pinchScale, h = r.parentDistance, v = r.parentDist, m = r.parentScale, y = n.fixedDirection, w = [0, 1].map(function(D) {
    return et(t[D] - y[D]);
  }), S = [0, 1].map(function(D) {
    var _ = w[D];
    return _ !== 0 && (_ = 2 / _), _;
  });
  if (v)
    l = v[0], c = v[1], e && (l ? c || (c = l / i) : l = c * i);
  else if (oa(f))
    l = (f - 1) * o, c = (f - 1) * s;
  else if (m)
    l = (m[0] - 1) * o, c = (m[1] - 1) * s;
  else if (h) {
    var C = o * w[0], k = s * w[1], M = Be([C, k]);
    l = h / M * C * S[0], c = h / M * k * S[1];
  } else {
    var E = en({ datas: n, distX: u, distY: d });
    E = S.map(function(D, _) {
      return E[_] * D;
    }), a = A(Ap([o, s], E, i, t, e), 2), l = a[0], c = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: c
  };
}
function Ds(t, e) {
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
    var n = A(t.split(" "), 2), r = n[0], a = n[1], i = Ds(r || ""), o = Ds(a || ""), s = O(O({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function Il(t, e, n) {
  var r = Ds(t, !0), a = r.x, i = r.y;
  return [
    Ft(a, e) || 0,
    Ft(i, n) || 0
  ];
}
function zy(t, e, n) {
  var r = t.map(function(i) {
    return wt(i, e);
  }), a = r.map(function(i) {
    return fa(i, n);
  });
  return {
    prev: r,
    next: a,
    result: a.map(function(i) {
      return Ot(i, e);
    })
  };
}
function zp(t, e) {
  return t.length === e.length && t.every(function(n, r) {
    var a = e[r], i = te(n), o = te(a);
    return i && o ? zp(n, a) : !i && !o ? n === a : !1;
  });
}
function dr(t, e, n, r, a) {
  var i = t._store, o = i[e];
  if (!(e in i))
    if (a != null)
      i[e] = a, o = a;
    else
      return i[e] = n, n;
  return o === n || r(o) === r(n) ? o : (i[e] = n, n);
}
function we(t) {
  return t >= 0 ? 1 : -1;
}
function et(t) {
  return Math.abs(t);
}
function Lo(t, e) {
  return o0(t).map(function(n) {
    return e(n);
  });
}
function Fp(t) {
  return oa(t) ? {
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
var Fy = va("pinchable", {
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
    var c = "onPinch".concat(r ? "Group" : "", "Start"), u = "drag".concat(r ? "Group" : "", "ControlStart"), d = (s === !0 ? t.controlAbles : l.filter(function(m) {
      return s.indexOf(m.name) > -1;
    })).filter(function(m) {
      return m.canPinch && m[u];
    }), f = Rt(t, e, {});
    r && (f.targets = r);
    var h = gt(t, c, f);
    n.isPinch = h !== !1, n.ables = d;
    var v = n.isPinch;
    return v ? (d.forEach(function(m) {
      if (i[m.name] = i[m.name] || {}, !!m[u]) {
        var y = O(O({}, e), { datas: i[m.name], parentRotate: a, isPinch: !0 });
        m[u](t, y);
      }
    }), t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: [0, 0]
    }, v) : !1;
  },
  pinch: function(t, e) {
    var n = e.datas, r = e.scale, a = e.distance, i = e.originalDatas, o = e.inputEvent, s = e.targets, l = e.angle;
    if (n.isPinch) {
      var c = a * (1 - 1 / r), u = Rt(t, e, {});
      s && (u.targets = s);
      var d = "onPinch".concat(s ? "Group" : "");
      gt(t, d, u);
      var f = n.ables, h = "drag".concat(s ? "Group" : "", "Control");
      return f.forEach(function(v) {
        v[h] && v[h](t, O(O({}, e), { datas: i[v.name], inputEvent: o, resolveMatrix: !0, pinchScale: r, parentDistance: c, parentRotate: l, isPinch: !0 }));
      }), u;
    }
  },
  pinchEnd: function(t, e) {
    var n = e.datas, r = e.isPinch, a = e.inputEvent, i = e.targets, o = e.originalDatas;
    if (n.isPinch) {
      var s = "onPinch".concat(i ? "Group" : "", "End"), l = je(t, e, { isDrag: r });
      i && (l.targets = i), gt(t, s, l);
      var c = n.ables, u = "drag".concat(i ? "Group" : "", "ControlEnd");
      return c.forEach(function(d) {
        d[u] && d[u](t, O(O({}, e), { isDrag: r, datas: o[d.name], inputEvent: a, isPinch: !0 }));
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
}), Lu = _l("scalable"), By = {
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
  render: ip("scalable"),
  dragControlCondition: Lu,
  viewClassName: Tl("scalable"),
  dragControlStart: function(t, e) {
    var n = e.datas, r = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = Ip(i, r, a, n), s = t.state, l = s.width, c = s.height, u = s.targetTransform, d = s.target, f = s.pos1, h = s.pos2, v = s.pos4;
    if (!o || !d)
      return !1;
    r || tr(t, e), n.datas = {}, n.transform = u, n.prevDist = [1, 1], n.direction = o, n.startOffsetWidth = l, n.startOffsetHeight = c, n.startValue = [1, 1];
    var m = !o[0] && !o[1] || o[0] || !o[1];
    $i(t, e, "scale"), n.isWidth = m;
    function y(E) {
      n.ratio = E && isFinite(E) ? E : 0;
    }
    n.startPositions = Ge(t.state);
    function w(E) {
      var D = mp(n.startPositions, E);
      n.fixedDirection = D.fixedDirection, n.fixedPosition = D.fixedPosition, n.fixedOffset = D.fixedOffset;
    }
    n.setFixedDirection = w, y(Qe(f, h) / Qe(h, v)), w([-o[0], -o[1]]);
    var S = function(E) {
      n.minScaleSize = E;
    }, C = function(E) {
      n.maxScaleSize = E;
    };
    S([-1 / 0, -1 / 0]), C([1 / 0, 1 / 0]);
    var k = Rt(t, e, O(O({ direction: o, set: function(E) {
      n.startValue = E;
    }, setRatio: y, setFixedDirection: w, setMinScaleSize: S, setMaxScaleSize: C }, Gi(t, e)), { dragStart: be.dragStart(t, new xr().dragStart([0, 0], e)) })), M = gt(t, "onScaleStart", k);
    return n.startFixedDirection = n.fixedDirection, M !== !1 && (n.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), n.isScale ? k : !1;
  },
  dragControl: function(t, e) {
    Fi(t, e, "scale");
    var n = e.datas, r = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, c = e.resolveMatrix, u = n.prevDist, d = n.direction, f = n.startOffsetWidth, h = n.startOffsetHeight, v = n.isScale, m = n.startValue, y = n.isWidth, w = n.ratio;
    if (!v)
      return !1;
    var S = t.props, C = S.throttleScale, k = S.parentMoveable, M = d;
    !d[0] && !d[1] && (M = [1, 1]);
    var E = w && (r ?? S.keepRatio) || !1, D = t.state, _ = [
      m[0],
      m[1]
    ];
    function j() {
      var nt = Lp(M, E, n, e), pt = nt.distWidth, jt = nt.distHeight, st = f ? (f + pt) / f : 1, lt = h ? (h + jt) / h : 1;
      m[0] || (_[0] = pt / f), m[1] || (_[1] = jt / h);
      var xt = (M[0] || E ? st : 1) * _[0], Ct = (M[1] || E ? lt : 1) * _[1];
      return xt === 0 && (xt = we(u[0]) * Ka), Ct === 0 && (Ct = we(u[1]) * Ka), [xt, Ct];
    }
    var x = j();
    if (!i && t.props.groupable) {
      var I = D.snapRenderInfo || {}, P = I.direction;
      te(P) && (P[0] || P[1]) && (D.snapRenderInfo = { direction: d, request: e.isRequest });
    }
    gt(t, "onBeforeScale", Rt(t, e, {
      scale: x,
      setFixedDirection: function(nt) {
        return n.setFixedDirection(nt), x = j(), x;
      },
      startFixedDirection: n.startFixedDirection,
      setScale: function(nt) {
        x = nt;
      }
    }, !0));
    var R = [
      x[0] / _[0],
      x[1] / _[1]
    ], N = o, F = [0, 0], q = we(R[0] * R[1]), z = !o && !a && i;
    if (z || c ? N = xl(t, n.targetAllTransform, [0, 0], [0, 0], n) : o || (N = n.fixedPosition), i || (F = my(t, R, d, !l && s, n)), E) {
      M[0] && M[1] && F[0] && F[1] && (Math.abs(F[0] * f) > Math.abs(F[1] * h) ? F[1] = 0 : F[0] = 0);
      var B = !F[0] && !F[1];
      if (B && (y ? R[0] = Dt(R[0] * _[0], C) / _[0] : R[1] = Dt(R[1] * _[1], C) / _[1]), M[0] && !M[1] || F[0] && !F[1] || B && y) {
        R[0] += F[0];
        var Y = f * R[0] * _[0] / w;
        R[1] = we(q * R[0]) * et(Y / h / _[1]);
      } else if (!M[0] && M[1] || !F[0] && F[1] || B && !y) {
        R[1] += F[1];
        var V = h * R[1] * _[1] * w;
        R[0] = we(q * R[1]) * et(V / f / _[0]);
      }
    } else
      R[0] += F[0], R[1] += F[1], F[0] || (R[0] = Dt(R[0] * _[0], C) / _[0]), F[1] || (R[1] = Dt(R[1] * _[1], C) / _[1]);
    R[0] === 0 && (R[0] = we(u[0]) * Ka), R[1] === 0 && (R[1] = we(u[1]) * Ka), x = wy(R, [_[0], _[1]]);
    var W = [
      f,
      h
    ], tt = [
      f * x[0],
      h * x[1]
    ];
    tt = ol(tt, n.minScaleSize, n.maxScaleSize, E ? w : !1), x = Lo(2, function(nt) {
      return W[nt] ? tt[nt] / W[nt] : tt[nt];
    }), R = Lo(2, function(nt) {
      return x[nt] / _[nt];
    });
    var J = Lo(2, function(nt) {
      return u[nt] ? R[nt] / u[nt] : R[nt];
    }), rt = "scale(".concat(R.join(", "), ")"), Q = "scale(".concat(x.join(", "), ")"), at = Bi(n, Q, rt), ft = !m[0] || !m[1], Z = mx(t, ft ? Q : rt, n.fixedDirection, N, n.fixedOffset, n, ft), ut = z ? Z : wt(Z, n.prevInverseDist || [0, 0]);
    if (n.prevDist = R, n.prevInverseDist = Z, x[0] === u[0] && x[1] === u[1] && ut.every(function(nt) {
      return !nt;
    }) && !k && !z)
      return !1;
    var vt = Rt(t, e, O({ offsetWidth: f, offsetHeight: h, direction: d, scale: x, dist: R, delta: J, isPinch: !!i }, Qf(t, at, ut, i, e)));
    return gt(t, "onScale", vt), vt;
  },
  dragControlEnd: function(t, e) {
    var n = e.datas;
    if (!n.isScale)
      return !1;
    n.isScale = !1;
    var r = je(t, e, {});
    return gt(t, "onScaleEnd", r), r;
  },
  dragGroupControlCondition: Lu,
  dragGroupControlStart: function(t, e) {
    var n = e.datas, r = this.dragControlStart(t, e);
    if (!r)
      return !1;
    var a = qe(t, "resizable", e);
    n.moveableScale = t.scale;
    var i = vn(t, this, "dragControlStart", e, function(c, u) {
      return Mi(t, c, n, u);
    }), o = function(c) {
      r.setFixedDirection(c), i.forEach(function(u, d) {
        u.setFixedDirection(c), Mi(t, u.moveable, n, a[d]);
      });
    };
    n.setFixedDirection = o;
    var s = O(O({}, r), { targets: t.props.targets, events: i, setFixedDirection: o }), l = gt(t, "onScaleGroupStart", s);
    return n.isScale = l !== !1, n.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var n = e.datas;
    if (n.isScale) {
      Vi(t, "onBeforeScale", function(u) {
        gt(t, "onBeforeScaleGroup", Rt(t, e, O(O({}, u), { targets: t.props.targets }), !0));
      });
      var r = this.dragControl(t, e);
      if (r) {
        var a = r.dist, i = n.moveableScale;
        t.scale = [
          a[0] * i[0],
          a[1] * i[1]
        ];
        var o = t.props.keepRatio, s = n.fixedPosition, l = vn(t, this, "dragControl", e, function(u, d) {
          var f = A(ve(pa(t.rotation / 180 * Math.PI, 3), [
            d.datas.originalX * a[0],
            d.datas.originalY * a[1],
            1
          ], 3), 2), h = f[0], v = f[1];
          return O(O({}, d), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: Ot(s, [h, v])
          });
        }), c = O({ targets: t.props.targets, events: l }, r);
        return gt(t, "onScaleGroup", c), c;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var n = e.isDrag, r = e.datas;
    if (r.isScale) {
      this.dragControlEnd(t, e);
      var a = vn(t, this, "dragControlEnd", e), i = je(t, e, {
        targets: t.props.targets,
        events: a
      });
      return gt(t, "onScaleGroupEnd", i), n;
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
function kn(t, e) {
  return t.map(function(n, r) {
    return bi(n, e[r], 1, 2);
  });
}
function zu(t, e, n) {
  var r = ee(t, e), a = ee(t, n), i = a - r;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function Gy(t, e) {
  var n = zu(t[0], t[1], t[2]), r = zu(e[0], e[1], e[2]), a = Math.PI;
  return !(n >= a && r <= a || n <= a && r >= a);
}
var $y = {
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
  viewClassName: Tl("warpable"),
  render: function(t, e) {
    var n = t.props, r = n.resizable, a = n.scalable, i = n.warpable, o = n.zoom;
    if (r || a || !i)
      return [];
    var s = t.state, l = s.pos1, c = s.pos2, u = s.pos3, d = s.pos4, f = kn(l, c), h = kn(c, l), v = kn(l, u), m = kn(u, l), y = kn(u, d), w = kn(d, u), S = kn(c, d), C = kn(d, c);
    return ot([
      e.createElement("div", { className: bt("line"), key: "middeLine1", style: Wr(f, y, o) }),
      e.createElement("div", { className: bt("line"), key: "middeLine2", style: Wr(h, w, o) }),
      e.createElement("div", { className: bt("line"), key: "middeLine3", style: Wr(v, S, o) }),
      e.createElement("div", { className: bt("line"), key: "middeLine4", style: Wr(m, C, o) })
    ], A(op(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var n = e.inputEvent.target;
    return se(n, bt("direction")) && se(n, bt("warpable"));
  },
  dragControlStart: function(t, e) {
    var n = e.datas, r = e.inputEvent, a = t.props.target, i = r.target, o = Rp(i, n);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, c = s.is3d, u = s.targetTransform, d = s.targetMatrix, f = s.width, h = s.height, v = s.left, m = s.top;
    n.datas = {}, n.targetTransform = u, n.warpTargetMatrix = c ? d : Ze(d, 3, 4), n.targetInverseMatrix = Pf(Ue(n.warpTargetMatrix, 4), 3, 4), n.direction = o, n.left = v, n.top = m, n.poses = [
      [0, 0],
      [f, 0],
      [0, h],
      [f, h]
    ].map(function(S) {
      return wt(S, l);
    }), n.nextPoses = n.poses.map(function(S) {
      var C = A(S, 2), k = C[0], M = C[1];
      return ve(n.warpTargetMatrix, [k, M, 0, 1], 4);
    }), n.startValue = Xt(4), n.prevMatrix = Xt(4), n.absolutePoses = Ge(s), n.posIndexes = Jf(o), tr(t, e), $i(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var y = Rt(t, e, O({ set: function(S) {
      n.startValue = S;
    } }, Gi(t, e))), w = gt(t, "onWarpStart", y);
    return w !== !1 && (n.isWarp = !0), n.isWarp;
  },
  dragControl: function(t, e) {
    var n = e.datas, r = e.isRequest, a = e.distX, i = e.distY, o = n.targetInverseMatrix, s = n.prevMatrix, l = n.isWarp, c = n.startValue, u = n.poses, d = n.posIndexes, f = n.absolutePoses;
    if (!l)
      return !1;
    if (Fi(t, e, "matrix3d"), _r(t, "warpable")) {
      var h = d.map(function(j) {
        return f[j];
      });
      h.length > 1 && h.push([
        (h[0][0] + h[1][0]) / 2,
        (h[0][1] + h[1][1]) / 2
      ]);
      var v = Xi(t, r, {
        horizontal: h.map(function(j) {
          return j[1] + i;
        }),
        vertical: h.map(function(j) {
          return j[0] + a;
        })
      }), m = v.horizontal, y = v.vertical;
      i -= m.offset, a -= y.offset;
    }
    var w = en({ datas: n, distX: a, distY: i }, !0), S = n.nextPoses.slice();
    if (d.forEach(function(j) {
      S[j] = Ot(S[j], w);
    }), !ox.every(function(j) {
      return Gy(j.map(function(x) {
        return u[x];
      }), j.map(function(x) {
        return S[x];
      }));
    }))
      return !1;
    var C = ul(u[0], u[2], u[1], u[3], S[0], S[2], S[1], S[3]);
    if (!C.length)
      return !1;
    var k = Bt(o, C, 4), M = Uf(n, k, !0), E = Bt(Ue(s, 4), M, 4);
    n.prevMatrix = M;
    var D = Bt(c, M, 4), _ = Bi(n, "matrix3d(".concat(D.join(", "), ")"), "matrix3d(".concat(M.join(", "), ")"));
    return ml(e, _), gt(t, "onWarp", Rt(t, e, O({ delta: E, matrix: D, dist: M, multiply: Bt, transform: _ }, Se({
      transform: _
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var n = e.datas, r = e.isDrag;
    return n.isWarp ? (n.isWarp = !1, gt(t, "onWarpEnd", je(t, e, {})), r) : !1;
  }
}, Wy = /* @__PURE__ */ bt("area-pieces"), ti = /* @__PURE__ */ bt("area-piece"), Bp = /* @__PURE__ */ bt("avoid"), Yy = bt("view-dragging");
function zo(t) {
  var e = t.areaElement;
  if (e) {
    var n = t.state, r = n.width, a = n.height;
    If(e, Bp), e.style.cssText += "left: 0px; top: 0px; width: ".concat(r, "px; height: ").concat(a, "px");
  }
}
function Fu(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: Wy },
    t.createElement("div", { className: ti }),
    t.createElement("div", { className: ti }),
    t.createElement("div", { className: ti }),
    t.createElement("div", { className: ti })
  );
}
var Gp = {
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
    var n = t.props, r = n.target, a = n.dragArea, i = n.groupable, o = n.passDragArea, s = t.getState(), l = s.width, c = s.height, u = s.renderPoses, d = o ? bt("area", "pass") : bt("area");
    if (i)
      return [
        e.createElement("div", { key: "area", ref: Tn(t, "areaElement"), className: d }),
        Fu(e)
      ];
    if (!r || !a)
      return [];
    var f = ul([0, 0], [l, 0], [0, c], [l, c], u[0], u[1], u[2], u[3]), h = f.length ? Hi(f, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: Tn(t, "areaElement"), className: d, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(c, "px"),
        transformOrigin: "0 0",
        transform: h
      } }),
      Fu(e)
    ];
  },
  dragStart: function(t, e) {
    var n = e.datas, r = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    n.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, c = s.renderPoses, u = s.rootMatrix, d = s.is3d, f = l.left, h = l.top, v = ze(c), m = v.left, y = v.top, w = v.width, S = v.height, C = d ? 4 : 3, k = A(wr(u, [r - f, a - h], C), 2), M = k[0], E = k[1];
    M -= m, E -= y;
    var D = [
      { left: m, top: y, width: w, height: E - 10 },
      { left: m, top: y, width: M - 10, height: S },
      { left: m, top: y + E + 10, width: w, height: S - E - 10 },
      { left: m + M + 10, top: y, width: w - M - 10, height: S }
    ], _ = [].slice.call(o.nextElementSibling.children);
    D.forEach(function(j, x) {
      _[x].style.cssText = "left: ".concat(j.left, "px;top: ").concat(j.top, "px; width: ").concat(j.width, "px; height: ").concat(j.height, "px;");
    }), sl(o, Bp), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var n = e.datas, r = e.inputEvent;
    if (this.enableNativeEvent(t), !r)
      return !1;
    n.isDragArea || (n.isDragArea = !0, zo(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var n = e.inputEvent, r = e.datas;
    if (!n)
      return !1;
    r.isDragArea || zo(t);
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
    zo(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && jf(function() {
      e.disableNativeEvent = !1;
    });
  }
}, Xy = va("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var n = t.props, r = n.zoom, a = n.svgOrigin, i = n.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, c = o.svg, u = o.allMatrix, d = o.is3d, f = o.left, h = o.top, v = o.offsetWidth, m = o.offsetHeight, y;
    if (!i && c && a) {
      var w = A(Il(a, v, m), 2), S = w[0], C = w[1], k = d ? 4 : 3, M = Ut(u, [S, C], k);
      y = ji(l, r, wt(M, [f, h]));
    } else
      y = ji(l, r, s);
    return [
      e.createElement("div", { className: bt("control", "origin"), style: y, key: "beforeOrigin" })
    ];
  }
});
function Hy(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var Vy = {
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
    var n = t.props, r = n.scrollContainer, a = r === void 0 ? t.getContainer() : r, i = n.scrollOptions, o = new zf(), s = tn(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", c = e.targets;
    o.on("scroll", function(u) {
      var d = u.container, f = u.direction, h = Rt(t, e, {
        scrollContainer: d,
        direction: f
      }), v = c ? "onScrollGroup" : "onScroll";
      c && (h.targets = c), gt(t, v, h);
    }).on("move", function(u) {
      var d = u.offsetX, f = u.offsetY, h = u.inputEvent;
      t[l].scrollBy(d, f, h.inputEvent, !1);
    }).on("scrollDrag", function(u) {
      var d = u.next;
      d(t[l].getCurrentEvent());
    }), o.dragStart(e, O({ container: s }, i));
  },
  checkScroll: function(t, e) {
    var n = e.datas.dragScroll;
    if (n) {
      var r = t.props, a = r.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = r.scrollThreshold, s = o === void 0 ? 0 : o, l = r.scrollThrottleTime, c = l === void 0 ? 0 : l, u = r.getScrollPosition, d = u === void 0 ? Hy : u, f = r.scrollOptions;
      return n.drag(e, O({ container: i, threshold: s, throttleTime: c, getScrollPosition: function(h) {
        return d({ scrollContainer: h.container, direction: h.direction });
      } }, f)), !0;
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
}, $p = {
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
}, Ky = va("padding", {
  props: ["padding"],
  render: function(t, e) {
    var n = t.props;
    if (n.dragArea)
      return [];
    var r = Fp(n.padding || {}), a = r.left, i = r.top, o = r.right, s = r.bottom, l = t.getState(), c = l.renderPoses, u = l.pos1, d = l.pos2, f = l.pos3, h = l.pos4, v = [u, d, f, h], m = [];
    return a > 0 && m.push([0, 2]), i > 0 && m.push([0, 1]), o > 0 && m.push([1, 3]), s > 0 && m.push([2, 3]), m.map(function(y, w) {
      var S = A(y, 2), C = S[0], k = S[1], M = v[C], E = v[k], D = c[C], _ = c[k], j = ul([0, 0], [100, 0], [0, 100], [100, 100], M, E, D, _);
      if (j.length)
        return e.createElement("div", { key: "padding".concat(w), className: bt("padding"), style: {
          transform: Hi(j, !0)
        } });
    });
  }
}), Bu = ["nw", "ne", "se", "sw"];
function ei(t, e) {
  var n = t[0] + t[1], r = n > e ? e / n : 1;
  return t[0] *= r, t[1] = e - t[1] * r, t;
}
var qy = [1, 2, 5, 6], Uy = [0, 3, 4, 7], Wn = [1, -1, -1, 1], Yn = [1, 1, -1, -1];
function Rl(t, e, n, r, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = n), s === void 0 && (s = r);
  var l = [], c = !1, u = t.filter(function(f) {
    return !f.virtual;
  }), d = u.map(function(f) {
    var h = f.horizontal, v = f.vertical, m = f.pos;
    if (v && !c && (c = !0, l.push("/")), c) {
      var y = Math.max(0, v === 1 ? m[1] - i : s - m[1]);
      return l.push(He(y, r, e)), y;
    } else {
      var y = Math.max(0, h === 1 ? m[0] - a : o - m[0]);
      return l.push(He(y, n, e)), y;
    }
  });
  return {
    radiusPoses: u,
    styles: l,
    raws: d
  };
}
function Wp(t) {
  for (var e = [0, 0], n = [0, 0], r = t.length, a = 0; a < r; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, n[0] = a + 1), i.vertical && (n[1] === 0 && (n[0] = a), n[1] = a - n[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: n
  };
}
function Yp(t, e, n, r, a, i, o) {
  var s, l, c, u;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var d = t.indexOf("/"), f = (d > -1 ? t.slice(0, d) : t).length, h = t.slice(0, f), v = t.slice(f + 1), m = h.length, y = v.length, w = y > 0, S = A(h, 4), C = S[0], k = C === void 0 ? "0px" : C, M = S[1], E = M === void 0 ? k : M, D = S[2], _ = D === void 0 ? k : D, j = S[3], x = j === void 0 ? E : j, I = A(v, 4), P = I[0], R = P === void 0 ? k : P, N = I[1], F = N === void 0 ? w ? R : E : N, q = I[2], z = q === void 0 ? w ? R : _ : q, B = I[3], Y = B === void 0 ? w ? F : x : B, V = [k, E, _, x].map(function(at) {
    return Ft(at, e);
  }), W = [R, F, z, Y].map(function(at) {
    return Ft(at, n);
  }), tt = V.slice(), J = W.slice();
  s = A(ei([tt[0], tt[1]], e), 2), tt[0] = s[0], tt[1] = s[1], l = A(ei([tt[3], tt[2]], e), 2), tt[3] = l[0], tt[2] = l[1], c = A(ei([J[0], J[3]], n), 2), J[0] = c[0], J[3] = c[1], u = A(ei([J[1], J[2]], n), 2), J[1] = u[0], J[2] = u[1];
  var rt = o ? tt : tt.slice(0, Math.max(i[0], m)), Q = o ? J : J.slice(0, Math.max(i[1], y));
  return ot(ot([], A(rt.map(function(at, ft) {
    var Z = Bu[ft];
    return {
      virtual: ft >= m,
      horizontal: Wn[ft],
      vertical: 0,
      pos: [r + at, a + (Yn[ft] === -1 ? n : 0)],
      sub: !0,
      raw: V[ft],
      direction: Z
    };
  })), !1), A(Q.map(function(at, ft) {
    var Z = Bu[ft];
    return {
      virtual: ft >= y,
      horizontal: 0,
      vertical: Yn[ft],
      pos: [r + (Wn[ft] === -1 ? e : 0), a + at],
      sub: !0,
      raw: W[ft],
      direction: Z
    };
  })), !1);
}
function Zy(t, e, n, r, a) {
  a === void 0 && (a = e.length);
  var i = Wp(t.slice(r)), o = i.horizontalRange, s = i.verticalRange, l = n - r, c = 0;
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
function Jy(t, e, n, r, a, i, o, s, l, c, u) {
  c === void 0 && (c = 0), u === void 0 && (u = 0);
  var d = Wp(t.slice(n)), f = d.horizontalRange, h = d.verticalRange;
  if (r > -1)
    for (var v = Wn[r] === 1 ? i - c : s - i, m = f[1]; m <= r; ++m) {
      var y = Yn[m] === 1 ? u : l, w = 0;
      if (r === m ? w = i : m === 0 ? w = c + v : Wn[m] === -1 && (w = s - (e[n][0] - c)), t.splice(n + m, 0, {
        horizontal: Wn[m],
        vertical: 0,
        pos: [w, y]
      }), e.splice(n + m, 0, [w, y]), m === 0)
        break;
    }
  else if (a > -1) {
    var S = Yn[a] === 1 ? o - u : l - o;
    if (f[1] === 0 && h[1] === 0) {
      var C = [
        c + S,
        u
      ];
      t.push({
        horizontal: Wn[0],
        vertical: 0,
        pos: C
      }), e.push(C);
    }
    for (var k = h[0], m = h[1]; m <= a; ++m) {
      var w = Wn[m] === 1 ? c : s, y = 0;
      if (a === m ? y = o : m === 0 ? y = u + S : Yn[m] === 1 ? y = e[n + k][1] : Yn[m] === -1 && (y = l - (e[n + k][1] - u)), t.push({
        horizontal: 0,
        vertical: Yn[m],
        pos: [w, y]
      }), e.push([w, y]), m === 0)
        break;
    }
  }
}
function Qy(t, e) {
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
var tb = [
  [0, -1, "n"],
  [1, 0, "e"]
], eb = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function Pl(t, e, n) {
  var r = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, c = s.poses, u = l === "rect", d = l === "circle";
  if (l === "polygon")
    return n.map(function(E) {
      return "".concat(He(E[0], i, r), " ").concat(He(E[1], o, r));
    });
  if (u || l === "inset") {
    var f = n[1][1], h = n[3][0], v = n[7][0], m = n[5][1];
    if (u)
      return [
        f,
        h,
        m,
        v
      ].map(function(E) {
        return "".concat(E, "px");
      });
    var y = [f, i - h, o - m, v].map(function(E, D) {
      return He(E, D % 2 ? i : o, r);
    });
    if (n.length > 8) {
      var w = A(wt(n[4], n[0]), 2), S = w[0], C = w[1];
      y.push.apply(y, ot(["round"], A(Rl(c.slice(8).map(function(E, D) {
        return O(O({}, E), { pos: n[D] });
      }), r, S, C, v, f, h, m).styles), !1));
    }
    return y;
  } else if (d || l === "ellipse") {
    var k = n[0], M = He(et(n[1][1] - k[1]), d ? Math.sqrt((i * i + o * o) / 2) : o, r), y = d ? [M] : [He(et(n[2][0] - k[0]), i, r), M];
    return y.push("at", He(k[0], i, r), He(k[1], o, r)), y;
  }
}
function Ri(t, e, n, r) {
  var a = [r, (r + e) / 2, e], i = [t, (t + n) / 2, n];
  return eb.map(function(o) {
    var s = A(o, 3), l = s[0], c = s[1], u = s[2], d = a[l + 1], f = i[c + 1];
    return {
      vertical: et(c),
      horizontal: et(l),
      direction: u,
      pos: [d, f]
    };
  });
}
function Xp(t) {
  var e = [1 / 0, -1 / 0], n = [1 / 0, -1 / 0];
  return t.forEach(function(r) {
    var a = r.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), n[0] = Math.min(n[0], a[1]), n[1] = Math.max(n[1], a[1]);
  }), [
    et(e[1] - e[0]),
    et(n[1] - n[0])
  ];
}
function Gu(t, e, n, r, a) {
  var i, o, s, l, c, u, d, f, h;
  if (t) {
    var v = a;
    if (!v) {
      var m = Ee(t), y = m("clipPath");
      v = y !== "none" ? y : m("clip");
    }
    if (!((!v || v === "none" || v === "auto") && (v = r, !v))) {
      var w = _f(v), S = w.prefix, C = S === void 0 ? v : S, k = w.value, M = k === void 0 ? "" : k, E = C === "circle", D = " ";
      if (C === "polygon") {
        var _ = Xn(M || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        D = ",";
        var j = _.map(function(Et) {
          var Ht = A(Et.split(" "), 2), Vt = Ht[0], Gt = Ht[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              Ft(Vt, e),
              Ft(Gt, n)
            ]
          };
        }), x = Jn(j.map(function(Et) {
          return Et.pos;
        }));
        return {
          type: C,
          clipText: v,
          poses: j,
          splitter: D,
          left: x.minX,
          right: x.maxX,
          top: x.minY,
          bottom: x.maxY
        };
      } else if (E || C === "ellipse") {
        var I = "", P = "", R = 0, N = 0, _ = _n(M);
        if (E) {
          var F = "";
          i = A(_, 4), o = i[0], F = o === void 0 ? "50%" : o, s = i[2], I = s === void 0 ? "50%" : s, l = i[3], P = l === void 0 ? "50%" : l, R = Ft(F, Math.sqrt((e * e + n * n) / 2)), N = R;
        } else {
          var q = "", z = "";
          c = A(_, 5), u = c[0], q = u === void 0 ? "50%" : u, d = c[1], z = d === void 0 ? "50%" : d, f = c[3], I = f === void 0 ? "50%" : f, h = c[4], P = h === void 0 ? "50%" : h, R = Ft(q, e), N = Ft(z, n);
        }
        var B = [
          Ft(I, e),
          Ft(P, n)
        ], j = ot([
          {
            vertical: 1,
            horizontal: 1,
            pos: B,
            direction: "nesw"
          }
        ], A(tb.slice(0, E ? 1 : 2).map(function(Vt) {
          return {
            vertical: et(Vt[1]),
            horizontal: Vt[0],
            direction: Vt[2],
            sub: !0,
            pos: [
              B[0] + Vt[0] * R,
              B[1] + Vt[1] * N
            ]
          };
        })), !1);
        return {
          type: C,
          clipText: v,
          radiusX: R,
          radiusY: N,
          left: B[0] - R,
          top: B[1] - N,
          right: B[0] + R,
          bottom: B[1] + N,
          poses: j,
          splitter: D
        };
      } else if (C === "inset") {
        var _ = _n(M || "0 0 0 0"), Y = _.indexOf("round"), V = (Y > -1 ? _.slice(0, Y) : _).length, W = _.slice(V + 1), tt = A(_.slice(0, V), 4), J = tt[0], rt = tt[1], Q = rt === void 0 ? J : rt, at = tt[2], ft = at === void 0 ? J : at, Z = tt[3], ut = Z === void 0 ? Q : Z, vt = A([J, ft].map(function(Vt) {
          return Ft(Vt, n);
        }), 2), nt = vt[0], pt = vt[1], jt = A([ut, Q].map(function(Vt) {
          return Ft(Vt, e);
        }), 2), st = jt[0], lt = jt[1], xt = e - lt, Ct = n - pt, Mt = Yp(W, xt - st, Ct - nt, st, nt), j = ot(ot([], A(Ri(nt, xt, Ct, st)), !1), A(Mt), !1);
        return {
          type: "inset",
          clipText: v,
          poses: j,
          top: nt,
          left: st,
          right: xt,
          bottom: Ct,
          radius: W,
          splitter: D
        };
      } else if (C === "rect") {
        var _ = Xn(M || "0px, ".concat(e, "px, ").concat(n, "px, 0px"));
        D = ",";
        var ht = A(_.map(function(pe) {
          var me = qn(pe).value;
          return me;
        }), 4), yt = ht[0], lt = ht[1], pt = ht[2], st = ht[3], j = Ri(yt, lt, pt, st);
        return {
          type: "rect",
          clipText: v,
          poses: j,
          top: yt,
          right: lt,
          bottom: pt,
          left: st,
          values: _,
          splitter: D
        };
      }
    }
  }
}
function nb(t, e, n, r, a) {
  var i = t[e], o = i.direction, s = i.sub, l = t.map(function() {
    return [0, 0];
  }), c = o ? o.split("") : [];
  if (r && e < 8) {
    var u = c.filter(function(R) {
      return R === "w" || R === "e";
    }), d = c.filter(function(R) {
      return R === "n" || R === "s";
    }), f = u[0], h = d[0];
    l[e] = n;
    var v = A(Xp(t), 2), m = v[0], y = v[1], w = m && y ? m / y : 0;
    if (w && a) {
      var S = (e + 4) % 8, C = t[S].pos, k = [0, 0];
      o.indexOf("w") > -1 ? k[0] = -1 : o.indexOf("e") > -1 && (k[0] = 1), o.indexOf("n") > -1 ? k[1] = -1 : o.indexOf("s") > -1 && (k[1] = 1);
      var M = Ap([m, y], n, w, k, !0), E = m + M[0], D = y + M[1], _ = C[1], j = C[1], x = C[0], I = C[0];
      k[0] === -1 ? x = I - E : k[0] === 1 ? I = x + E : (x = x - E / 2, I = I + E / 2), k[1] === -1 ? _ = j - D : (k[1] === 1 || (_ = j - D / 2), j = _ + D);
      var P = Ri(_, I, j, x);
      t.forEach(function(R, N) {
        l[N][0] = P[N].pos[0] - R.pos[0], l[N][1] = P[N].pos[1] - R.pos[1];
      });
    } else
      t.forEach(function(R, N) {
        var F = R.direction;
        F && (F.indexOf(f) > -1 && (l[N][0] = n[0]), F.indexOf(h) > -1 && (l[N][1] = n[1]));
      }), f && (l[1][0] = n[0] / 2, l[5][0] = n[0] / 2), h && (l[3][1] = n[1] / 2, l[7][1] = n[1] / 2);
  } else o && !s ? c.forEach(function(R) {
    var N = R === "n" || R === "s";
    t.forEach(function(F, q) {
      var z = F.direction, B = F.horizontal, Y = F.vertical;
      !z || z.indexOf(R) === -1 || (l[q] = [
        N || !B ? 0 : n[0],
        !N || !Y ? 0 : n[1]
      ]);
    });
  }) : l[e] = n;
  return l;
}
function rb(t, e) {
  var n = A(qf(t, e), 2), r = n[0], a = n[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, c = l.type, u = l.poses, d = l.splitter, f = u.map(function(S) {
    return S.pos;
  });
  if (c === "polygon")
    f.splice(s, 0, [r, a]);
  else if (c === "inset") {
    var h = qy.indexOf(s), v = Uy.indexOf(s), m = u.length;
    if (Jy(u, f, 8, h, v, r, a, f[4][0], f[4][1], f[0][0], f[0][1]), m === u.length)
      return;
  } else
    return;
  var y = Pl(t, o, f), w = "".concat(c, "(").concat(y.join(d), ")");
  gt(t, "onClip", Rt(t, e, O({ clipEventType: "added", clipType: c, poses: f, clipStyles: y, clipStyle: w, distX: 0, distY: 0 }, Se({
    clipPath: w
  }, e))));
}
function ab(t, e) {
  var n = e.datas, r = n.clipPath, a = n.clipIndex, i = r, o = i.type, s = i.poses, l = i.splitter, c = s.map(function(h) {
    return h.pos;
  }), u = c.length;
  if (o === "polygon")
    s.splice(a, 1), c.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (Zy(s, c, a, 8, u), u === s.length))
      return;
  } else
    return;
  var d = Pl(t, r, c), f = "".concat(o, "(").concat(d.join(l), ")");
  gt(t, "onClip", Rt(t, e, O({ clipEventType: "removed", clipType: o, poses: c, clipStyles: d, clipStyle: f, distX: 0, distY: 0 }, Se({
    clipPath: f
  }, e))));
}
var ib = {
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
    var n = t.props, r = n.customClipPath, a = n.defaultClipPath, i = n.clipArea, o = n.zoom, s = n.groupable, l = t.getState(), c = l.target, u = l.width, d = l.height, f = l.allMatrix, h = l.is3d, v = l.left, m = l.top, y = l.pos1, w = l.pos2, S = l.pos3, C = l.pos4, k = l.clipPathState, M = l.snapBoundInfos, E = l.rotation;
    if (!c || s)
      return [];
    var D = Gu(c, u, d, a || "inset", k || r);
    if (!D)
      return [];
    var _ = h ? 4 : 3, j = D.type, x = D.poses, I = x.map(function(lt) {
      var xt = Ut(f, lt.pos, _);
      return [
        xt[0] - v,
        xt[1] - m
      ];
    }), P = [], R = [], N = j === "rect", F = j === "inset", q = j === "polygon";
    if (N || F || q) {
      var z = F ? I.slice(0, 8) : I;
      R = z.map(function(lt, xt) {
        var Ct = xt === 0 ? z[z.length - 1] : z[xt - 1], Mt = ee(Ct, lt), ht = Dp(Ct, lt);
        return e.createElement("div", { key: "clipLine".concat(xt), className: bt("line", "clip-line", "snap-control"), "data-clip-index": xt, style: {
          width: "".concat(ht, "px"),
          transform: "translate(".concat(Ct[0], "px, ").concat(Ct[1], "px) rotate(").concat(Mt, "rad) scaleY(").concat(o, ")")
        } });
      });
    }
    if (P = I.map(function(lt, xt) {
      return e.createElement("div", { key: "clipControl".concat(xt), className: bt("control", "clip-control", "snap-control"), "data-clip-index": xt, style: {
        transform: "translate(".concat(lt[0], "px, ").concat(lt[1], "px) rotate(").concat(E, "rad) scale(").concat(o, ")")
      } });
    }), F && P.push.apply(P, ot([], A(I.slice(8).map(function(lt, xt) {
      return e.createElement("div", { key: "clipRadiusControl".concat(xt), className: bt("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + xt, style: {
        transform: "translate(".concat(lt[0], "px, ").concat(lt[1], "px) rotate(").concat(E, "rad) scale(").concat(o, ")")
      } });
    })), !1)), j === "circle" || j === "ellipse") {
      var B = D.left, Y = D.top, V = D.radiusX, W = D.radiusY, tt = A(wt(Ut(f, [B, Y], _), Ut(f, [0, 0], _)), 2), J = tt[0], rt = tt[1], Q = "none";
      if (!i) {
        for (var at = Math.max(10, V / 5, W / 5), ft = [], Z = 0; Z <= at; ++Z) {
          var ut = Math.PI * 2 / at * Z;
          ft.push([
            V + (V - o) * Math.cos(ut),
            W + (W - o) * Math.sin(ut)
          ]);
        }
        ft.push([V, -2]), ft.push([-2, -2]), ft.push([-2, W * 2 + 2]), ft.push([V * 2 + 2, W * 2 + 2]), ft.push([V * 2 + 2, -2]), ft.push([V, -2]), Q = "polygon(".concat(ft.map(function(lt) {
          return "".concat(lt[0], "px ").concat(lt[1], "px");
        }).join(", "), ")");
      }
      P.push(e.createElement("div", { key: "clipEllipse", className: bt("clip-ellipse", "snap-control"), style: {
        width: "".concat(V * 2, "px"),
        height: "".concat(W * 2, "px"),
        clipPath: Q,
        transform: "translate(".concat(-v + J, "px, ").concat(-m + rt, "px) ").concat(Hi(f))
      } }));
    }
    if (i) {
      var vt = ze(ot([y, w, S, C], A(I), !1)), nt = vt.width, pt = vt.height, jt = vt.left, st = vt.top;
      if (q || N || F) {
        var ft = F ? I.slice(0, 8) : I;
        P.push(e.createElement("div", { key: "clipArea", className: bt("clip-area", "snap-control"), style: {
          width: "".concat(nt, "px"),
          height: "".concat(pt, "px"),
          transform: "translate(".concat(jt, "px, ").concat(st, "px)"),
          clipPath: "polygon(".concat(ft.map(function(xt) {
            return "".concat(xt[0] - jt, "px ").concat(xt[1] - st, "px");
          }).join(", "), ")")
        } }));
      }
    }
    return M && ["vertical", "horizontal"].forEach(function(lt) {
      var xt = M[lt], Ct = lt === "horizontal";
      xt.isSnap && R.push.apply(R, ot([], A(xt.snap.posInfos.map(function(Mt, ht) {
        var yt = Mt.pos, Et = wt(Ut(f, Ct ? [0, yt] : [yt, 0], _), [v, m]), Ht = wt(Ut(f, Ct ? [u, yt] : [yt, d], _), [v, m]);
        return ca(e, "", Et, Ht, o, "clip".concat(lt, "snap").concat(ht), "guideline");
      })), !1)), xt.isBound && R.push.apply(R, ot([], A(xt.bounds.map(function(Mt, ht) {
        var yt = Mt.pos, Et = wt(Ut(f, Ct ? [0, yt] : [yt, 0], _), [v, m]), Ht = wt(Ut(f, Ct ? [u, yt] : [yt, d], _), [v, m]);
        return ca(e, "", Et, Ht, o, "clip".concat(lt, "bounds").concat(ht), "guideline", "bounds", "bold");
      })), !1));
    }), ot(ot([], A(P), !1), A(R), !1);
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
    var n = t.state, r = t.props, a = r.defaultClipPath, i = r.customClipPath, o = n.target, s = n.width, l = n.height, c = e.inputEvent ? e.inputEvent.target : null, u = c && c.getAttribute("class") || "", d = e.datas, f = Gu(o, s, l, a || "inset", i);
    if (!f)
      return !1;
    var h = f.clipText, v = f.type, m = f.poses, y = gt(t, "onClipStart", Rt(t, e, {
      clipType: v,
      clipStyle: h,
      poses: m.map(function(w) {
        return w.pos;
      })
    }));
    return y === !1 ? (d.isClipStart = !1, !1) : (d.isControl = u && u.indexOf("clip-control") > -1, d.isLine = u.indexOf("clip-line") > -1, d.isArea = u.indexOf("clip-area") > -1 || u.indexOf("clip-ellipse") > -1, d.clipIndex = c ? parseInt(c.getAttribute("data-clip-index"), 10) : -1, d.clipPath = f, d.isClipStart = !0, n.clipPathState = h, tr(t, e), !0);
  },
  dragControl: function(t, e) {
    var n, r, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, c = l.isControl, u = l.isLine, d = l.isArea, f = l.clipIndex, h = l.clipPath;
    if (!h)
      return !1;
    var v = Qn(t.props, "clippable"), m = v.keepRatio, y = 0, w = 0, S = o.draggable, C = en(e);
    s && S ? (n = A(S.prevBeforeDist, 2), y = n[0], w = n[1]) : (r = A(C, 2), y = r[0], w = r[1]);
    var k = [y, w], M = t.state, E = M.width, D = M.height, _ = !d && !c && !u, j = h.type, x = h.poses, I = h.splitter, P = x.map(function(At) {
      return At.pos;
    });
    _ && (y = -y, w = -w);
    var R = !c || x[f].direction === "nesw", N = j === "inset" || j === "rect", F = x.map(function() {
      return [0, 0];
    });
    if (c && !R) {
      var q = x[f], z = q.horizontal, B = q.vertical, Y = [
        y * et(z),
        w * et(B)
      ];
      F = nb(x, f, Y, N, m);
    } else R && (F = P.map(function() {
      return [y, w];
    }));
    var V = P.map(function(At, Kt) {
      return Ot(At, F[Kt]);
    }), W = ot([], A(V), !1);
    M.snapBoundInfos = null;
    var tt = h.type === "circle", J = h.type === "ellipse";
    if (tt || J) {
      var rt = ze(V), Q = et(rt.bottom - rt.top), at = et(J ? rt.right - rt.left : Q), ft = V[0][1] + Q, Z = V[0][0] - at, ut = V[0][0] + at;
      tt && (W.push([ut, rt.bottom]), F.push([1, 0])), W.push([rt.left, ft]), F.push([0, 1]), W.push([Z, rt.bottom]), F.push([1, 0]);
    }
    var vt = wp((v.clipHorizontalGuidelines || []).map(function(At) {
      return Ft("".concat(At), D);
    }), (v.clipVerticalGuidelines || []).map(function(At) {
      return Ft("".concat(At), E);
    }), E, D), nt = [], pt = [];
    if (tt || J)
      nt = [W[4][0], W[2][0]], pt = [W[1][1], W[3][1]];
    else if (N) {
      var jt = [W[0], W[2], W[4], W[6]], st = [F[0], F[2], F[4], F[6]];
      nt = jt.filter(function(At, Kt) {
        return st[Kt][0];
      }).map(function(At) {
        return At[0];
      }), pt = jt.filter(function(At, Kt) {
        return st[Kt][1];
      }).map(function(At) {
        return At[1];
      });
    } else
      nt = W.filter(function(At, Kt) {
        return F[Kt][0];
      }).map(function(At) {
        return At[0];
      }), pt = W.filter(function(At, Kt) {
        return F[Kt][1];
      }).map(function(At) {
        return At[1];
      });
    var lt = [0, 0], xt = Eu(vt, v.clipTargetBounds && { left: 0, top: 0, right: E, bottom: D }, nt, pt, 5, 5), Ct = xt.horizontal, Mt = xt.vertical, ht = Ct.offset, yt = Mt.offset;
    if (Ct.isBound && (lt[1] += ht), Mt.isBound && (lt[0] += yt), (J || tt) && F[0][0] === 0 && F[0][1] === 0) {
      var rt = ze(V), Et = rt.bottom - rt.top, Ht = J ? rt.right - rt.left : Et, Vt = Mt.isBound ? et(yt) : Mt.snapIndex === 0 ? -yt : yt, Gt = Ct.isBound ? et(ht) : Ct.snapIndex === 0 ? -ht : ht;
      Ht -= Vt, Et -= Gt, tt && (Et = pp(Mt, Ct) > 0 ? Et : Ht, Ht = Et);
      var mt = W[0];
      W[1][1] = mt[1] - Et, W[2][0] = mt[0] + Ht, W[3][1] = mt[1] + Et, W[4][0] = mt[0] - Ht;
    } else if (N && m && c) {
      var pe = A(Xp(x), 2), me = pe[0], xn = pe[1], yn = me && xn ? me / xn : 0, $e = x[f], We = $e.direction || "", jr = W[1][1], ft = W[5][1], Z = W[7][0], ut = W[3][0];
      et(ht) <= et(yt) ? ht = we(ht) * et(yt) / yn : yt = we(yt) * et(ht) * yn, We.indexOf("w") > -1 ? Z -= yt : We.indexOf("e") > -1 ? ut -= yt : (Z += yt / 2, ut -= yt / 2), We.indexOf("n") > -1 ? jr -= ht : We.indexOf("s") > -1 ? ft -= ht : (jr += ht / 2, ft -= ht / 2);
      var Nn = Ri(jr, ut, ft, Z);
      W.forEach(function(Ie, Tt) {
        var xe;
        xe = A(Nn[Tt].pos, 2), Ie[0] = xe[0], Ie[1] = xe[1];
      });
    } else
      W.forEach(function(At, Kt) {
        var wa = F[Kt];
        wa[0] && (At[0] -= yt), wa[1] && (At[1] -= ht);
      });
    var ba = Pl(t, h, V), On = "".concat(j, "(").concat(ba.join(I), ")");
    if (M.clipPathState = On, tt || J)
      nt = [W[4][0], W[2][0]], pt = [W[1][1], W[3][1]];
    else if (N) {
      var jt = [W[0], W[2], W[4], W[6]];
      nt = jt.map(function(Kt) {
        return Kt[0];
      }), pt = jt.map(function(Kt) {
        return Kt[1];
      });
    } else
      nt = W.map(function(At) {
        return At[0];
      }), pt = W.map(function(At) {
        return At[1];
      });
    if (M.snapBoundInfos = Eu(vt, v.clipTargetBounds && { left: 0, top: 0, right: E, bottom: D }, nt, pt, 1, 1), S) {
      var Zi = M.is3d, nn = M.allMatrix, Ir = Zi ? 4 : 3, rn = lt;
      s && (rn = [
        k[0] + lt[0] - C[0],
        k[1] + lt[1] - C[1]
      ]), S.deltaOffset = Bt(nn, [rn[0], rn[1], 0, 0], Ir);
    }
    return gt(t, "onClip", Rt(t, e, O({ clipEventType: "changed", clipType: j, poses: V, clipStyle: On, clipStyles: ba, distX: y, distY: w }, Se((a = {}, a[j === "rect" ? "clip" : "clipPath"] = On, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var n = e.isDrag, r = e.datas, a = e.isDouble, i = r.isLine, o = r.isClipStart, s = r.isControl;
    return o ? (gt(t, "onClipEnd", je(t, e, {})), a && (s ? ab(t, e) : i && rb(t, e)), a || n) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, ob = {
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
    return e.isRequest ? e.requestAble === "originDraggable" : se(e.inputEvent.target, bt("origin"));
  },
  dragControlStart: function(t, e) {
    var n = e.datas;
    tr(t, e);
    var r = Rt(t, e, {
      dragStart: be.dragStart(t, new xr().dragStart([0, 0], e))
    }), a = gt(t, "onDragOriginStart", r);
    return n.startOrigin = t.state.transformOrigin, n.startTargetOrigin = t.state.targetOrigin, n.prevOrigin = [0, 0], n.isDragOrigin = !0, a === !1 ? (n.isDragOrigin = !1, !1) : r;
  },
  dragControl: function(t, e) {
    var n = e.datas, r = e.isPinch, a = e.isRequest;
    if (!n.isDragOrigin)
      return !1;
    var i = A(en(e), 2), o = i[0], s = i[1], l = t.state, c = l.width, u = l.height, d = l.offsetMatrix, f = l.targetMatrix, h = l.is3d, v = t.props.originRelative, m = v === void 0 ? !0 : v, y = h ? 4 : 3, w = [o, s];
    if (a) {
      var S = e.distOrigin;
      (S[0] || S[1]) && (w = S);
    }
    var C = Ot(n.startOrigin, w), k = Ot(n.startTargetOrigin, w), M = wt(w, n.prevOrigin), E = xa(d, f, C, y), D = t.getRect(), _ = ze(er(E, c, u, y)), j = [
      D.left - _.left,
      D.top - _.top
    ];
    n.prevOrigin = w;
    var x = [
      He(k[0], c, m),
      He(k[1], u, m)
    ].join(" "), I = be.drag(t, ma(e, t.state, j, !!r)), P = Rt(t, e, O(O({ width: c, height: u, origin: C, dist: w, delta: M, transformOrigin: x, drag: I }, Se({
      transformOrigin: x,
      transform: I.transform
    }, e)), { afterTransform: I.transform }));
    return gt(t, "onDragOrigin", P), P;
  },
  dragControlEnd: function(t, e) {
    var n = e.datas;
    return n.isDragOrigin ? (gt(t, "onDragOriginEnd", je(t, e, {})), !0) : !1;
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
function sb(t, e, n, r) {
  var a = t.filter(function(l) {
    var c = l.virtual, u = l.horizontal;
    return u && !c;
  }).length, i = t.filter(function(l) {
    var c = l.virtual, u = l.vertical;
    return u && !c;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    lb(t, o), o < 4 ? s.pos[0] = n : s.pos[1] = r;
  }
}
function lb(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(n) {
    n.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(n) {
    n.virtual = !1;
  }));
}
function cb(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(n) {
    n.virtual = !0;
  }) : t.slice(e).forEach(function(n) {
    n.virtual = !0;
  });
}
function $u(t, e, n, r, a) {
  r === void 0 && (r = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = _n(t), Yp(i, e, n, 0, 0, r, a);
}
function Wu(t, e, n, r, a) {
  var i = t.state, o = i.width, s = i.height, l = Rl(a, t.props.roundRelative, o, s), c = l.raws, u = l.styles, d = l.radiusPoses, f = Qy(d, c), h = f.horizontals, v = f.verticals, m = u.join(" ");
  i.borderRadiusState = m;
  var y = Rt(t, e, O({ horizontals: h, verticals: v, borderRadius: m, width: o, height: s, delta: r, dist: n }, Se({
    borderRadius: m
  }, e)));
  return gt(t, "onRound", y), y;
}
function Yu(t) {
  var e, n, r = t.getState().style, a = r.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (n = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && n !== void 0 ? n : "", r.borderRadius = a) : (a = Dl(o).borderRadius, r.borderRadius = a));
  }
  return a;
}
var ub = {
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
    return e === !0 || e === "line" ? bt("round-line-clickable") : "";
  },
  requestStyle: function() {
    return ["borderRadius"];
  },
  requestChildStyle: function() {
    return ["borderRadius"];
  },
  render: function(t, e) {
    var n = t.getState(), r = n.target, a = n.width, i = n.height, o = n.allMatrix, s = n.is3d, l = n.left, c = n.top, u = n.borderRadiusState, d = t.props, f = d.minRoundControls, h = f === void 0 ? [0, 0] : f, v = d.maxRoundControls, m = v === void 0 ? [4, 4] : v, y = d.zoom, w = d.roundPadding, S = w === void 0 ? 0 : w, C = d.isDisplayShadowRoundControls, k = d.groupable;
    if (!r)
      return null;
    var M = u || Yu(t), E = s ? 4 : 3, D = $u(M, a, i, h, !0);
    if (!D)
      return null;
    var _ = 0, j = 0, x = k ? [0, 0] : [l, c];
    return D.map(function(I, P) {
      var R = I.horizontal, N = I.vertical, F = I.direction || "", q = ot([], A(I.pos), !1);
      j += Math.abs(R), _ += Math.abs(N), R && F.indexOf("n") > -1 && (q[1] -= S), N && F.indexOf("w") > -1 && (q[0] -= S), R && F.indexOf("s") > -1 && (q[1] += S), N && F.indexOf("e") > -1 && (q[0] += S);
      var z = wt(Ut(o, q, E), x), B = C && C !== "horizontal", Y = I.vertical ? _ <= m[1] && (B || !I.virtual) : j <= m[0] && (C || !I.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(P), className: bt("control", "border-radius", I.vertical ? "vertical" : "", I.virtual ? "virtual" : ""), "data-radius-index": P, style: {
        display: Y ? "block" : "none",
        transform: "translate(".concat(z[0], "px, ").concat(z[1], "px) scale(").concat(y, ")")
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
    var d = Rt(t, e, {}), f = gt(t, "onRoundStart", d);
    if (f === !1)
      return !1;
    r.lineIndex = c, r.controlIndex = l, r.isControl = o, r.isLine = s, tr(t, e);
    var h = t.props, v = h.roundRelative, m = h.minRoundControls, y = m === void 0 ? [0, 0] : m, w = t.state, S = w.width, C = w.height;
    r.isRound = !0, r.prevDist = [0, 0];
    var k = Yu(t), M = $u(k || "", S, C, y, !0) || [];
    return r.controlPoses = M, w.borderRadiusState = Rl(M, v, S, C).styles.join(" "), d;
  },
  dragControl: function(t, e) {
    var n = e.datas, r = n.controlPoses;
    if (!n.isRound || !n.isControl || !r.length)
      return !1;
    var a = n.controlIndex, i = A(en(e), 2), o = i[0], s = i[1], l = [o, s], c = wt(l, n.prevDist), u = t.props.maxRoundControls, d = u === void 0 ? [4, 4] : u, f = t.state, h = f.width, v = f.height, m = r[a], y = m.vertical, w = m.horizontal, S = r.map(function(k) {
      var M = k.horizontal, E = k.vertical, D = [
        M * w * l[0],
        E * y * l[1]
      ];
      if (M) {
        if (d[0] === 1)
          return D;
        if (d[0] < 4 && M !== w)
          return D;
      } else {
        if (d[1] === 0)
          return D[1] = E * w * l[0] / h * v, D;
        if (y) {
          if (d[1] === 1)
            return D;
          if (d[1] < 4 && E !== y)
            return D;
        }
      }
      return [0, 0];
    });
    S[a] = l;
    var C = r.map(function(k, M) {
      return O(O({}, k), { pos: Ot(k.pos, S[M]) });
    });
    return a < 4 ? C.slice(0, a + 1).forEach(function(k) {
      k.virtual = !1;
    }) : C.slice(4, a + 1).forEach(function(k) {
      k.virtual = !1;
    }), n.prevDist = [o, s], Wu(t, e, l, c, C);
  },
  dragControlEnd: function(t, e) {
    var n = t.state;
    n.borderRadiusState = "";
    var r = e.datas, a = e.isDouble;
    if (!r.isRound)
      return !1;
    var i = r.isControl, o = r.controlIndex, s = r.isLine, l = r.lineIndex, c = r.controlPoses, u = c.filter(function(w) {
      var S = w.virtual;
      return S;
    }).length, d = t.props.roundClickable, f = d === void 0 ? !0 : d;
    if (a && f) {
      if (i && (f === !0 || f === "control"))
        cb(c, o);
      else if (s && (f === !0 || f === "line")) {
        var h = A(qf(t, e), 2), v = h[0], m = h[1];
        sb(c, l, v, m);
      }
      u !== c.filter(function(w) {
        var S = w.virtual;
        return S;
      }).length && Wu(t, e, [0, 0], [0, 0], c);
    }
    var y = je(t, e, {});
    return gt(t, "onRoundEnd", y), n.borderRadiusState = "", y;
  },
  dragGroupControlStart: function(t, e) {
    var n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var r = t.moveables, a = t.props.targets, i = qe(t, "roundable", e), o = O({ targets: t.props.targets, events: i.map(function(s, l) {
      return O(O({}, s), { target: a[l], moveable: r[l], currentTarget: r[l] });
    }) }, n);
    return gt(t, "onRoundGroupStart", o), n;
  },
  dragGroupControl: function(t, e) {
    var n = this.dragControl(t, e);
    if (!n)
      return !1;
    var r = t.moveables, a = t.props.targets, i = qe(t, "roundable", e), o = O({ targets: t.props.targets, events: i.map(function(s, l) {
      return O(O(O({}, s), { target: a[l], moveable: r[l], currentTarget: r[l] }), Se({
        borderRadius: n.borderRadius
      }, s));
    }) }, n);
    return gt(t, "onRoundGroup", o), o;
  },
  dragGroupControlEnd: function(t, e) {
    var n = t.moveables, r = t.props.targets, a = qe(t, "roundable", e);
    Vi(t, "onRound", function(s) {
      var l = O({ targets: t.props.targets, events: a.map(function(c, u) {
        return O(O(O({}, c), { target: r[u], moveable: n[u], currentTarget: n[u] }), Se({
          borderRadius: s.borderRadius
        }, c));
      }) }, s);
      gt(t, "onRoundGroup", l);
    });
    var i = this.dragControlEnd(t, e);
    if (!i)
      return !1;
    var o = O({ targets: t.props.targets, events: a.map(function(s, l) {
      var c;
      return O(O({}, s), { target: r[l], moveable: n[l], currentTarget: n[l], lastEvent: (c = s.datas) === null || c === void 0 ? void 0 : c.lastEvent });
    }) }, i);
    return gt(t, "onRoundGroupEnd", o), o;
  },
  unset: function(t) {
    t.state.borderRadiusState = "";
  }
};
function db(t, e) {
  var n = e ? 4 : 3, r = Xt(n), a = "matrix".concat(e ? "3d" : "", "(").concat(r.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var Hp = {
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
    var n = t.state, r = n.is3d, a = n.targetMatrix, i = n.inlineTransform, o = r ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(Of(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = db(s, r) ? [] : _n(s);
  },
  resetStyle: function(t) {
    var e = t.datas;
    e.nextStyle = {}, e.nextTransforms = t.datas.startTransforms, e.nextTransformAppendedIndexes = [];
  },
  fillDragStartParams: function(t, e) {
    return Rt(t, e, {
      setTransform: function(n) {
        e.datas.startTransforms = te(n) ? n : _n(n);
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
    this.setTransform(t, e), this.resetStyle(e), gt(t, "onBeforeRenderStart", this.fillDragStartParams(t, e));
  },
  drag: function(t, e) {
    e.datas.startTransforms || this.setTransform(t, e), this.resetStyle(e), gt(t, "onBeforeRender", Rt(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  dragEnd: function(t, e) {
    e.datas.startTransforms || (this.setTransform(t, e), this.resetStyle(e)), gt(t, "onBeforeRenderEnd", Rt(t, e, {
      isPinch: !!e.isPinch,
      isDrag: e.isDrag
    }));
  },
  dragGroupStart: function(t, e) {
    var n = this;
    this.dragStart(t, e);
    var r = qe(t, "beforeRenderable", e), a = t.moveables, i = r.map(function(o, s) {
      var l = a[s];
      return n.setTransform(l, o), n.resetStyle(o), n.fillDragStartParams(l, o);
    });
    gt(t, "onBeforeRenderGroupStart", Rt(t, e, {
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
    var r = qe(t, "beforeRenderable", e), a = t.moveables, i = r.map(function(o, s) {
      var l = a[s];
      return n.resetStyle(o), n.fillDragParams(l, o);
    });
    gt(t, "onBeforeRenderGroup", Rt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets,
      events: i
    }));
  },
  dragGroupEnd: function(t, e) {
    this.dragEnd(t, e), gt(t, "onBeforeRenderGroupEnd", Rt(t, e, {
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
}, Vp = {
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
    gt(t, "onRenderStart", Rt(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  drag: function(t, e) {
    gt(t, "onRender", this.fillDragParams(t, e));
  },
  dragAfter: function(t, e) {
    return this.drag(t, e);
  },
  dragEnd: function(t, e) {
    gt(t, "onRenderEnd", this.fillDragEndParams(t, e));
  },
  dragGroupStart: function(t, e) {
    gt(t, "onRenderGroupStart", Rt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets
    }));
  },
  dragGroup: function(t, e) {
    var n = this, r = qe(t, "beforeRenderable", e), a = t.moveables, i = r.map(function(o, s) {
      var l = a[s];
      return n.fillDragParams(l, o);
    });
    gt(t, "onRenderGroup", Rt(t, e, O(O({ isPinch: !!e.isPinch, targets: t.props.targets, transform: qa(e), transformObject: {} }, Se(Ua(e))), { events: i })));
  },
  dragGroupEnd: function(t, e) {
    var n = this, r = qe(t, "beforeRenderable", e), a = t.moveables, i = r.map(function(o, s) {
      var l = a[s];
      return n.fillDragEndParams(l, o);
    });
    gt(t, "onRenderGroupEnd", Rt(t, e, O({ isPinch: !!e.isPinch, isDrag: e.isDrag, targets: t.props.targets, events: i, transformObject: {}, transform: qa(e) }, Se(Ua(e)))));
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
    return mr(Ei(e) || []).forEach(function(r) {
      n[r.name] = r.functionValue;
    }), Rt(t, e, O({ isPinch: !!e.isPinch, transformObject: n, transform: qa(e) }, Se(Ua(e))));
  },
  fillDragEndParams: function(t, e) {
    var n = {};
    return mr(Ei(e) || []).forEach(function(r) {
      n[r.name] = r.functionValue;
    }), Rt(t, e, O({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: n, transform: qa(e) }, Se(Ua(e))));
  }
};
function Jr(t, e, n, r, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", c = a === "After", u = t.state.target, d = i.isRequest, f = r.indexOf("Control") > -1;
  if (!u || s && f && !d && t.areaElement === i.inputEvent.target)
    return !1;
  var h = ot([], A(e), !1);
  if (d) {
    var v = i.requestAble;
    h.some(function(P) {
      return P.name === v;
    }) || h.push.apply(h, ot([], A(t.props.ables.filter(function(P) {
      return P.name === v;
    })), !1));
  }
  if (!h.length || h.every(function(P) {
    return P.dragRelation;
  }))
    return !1;
  var m = i.inputEvent, y;
  l && m && (y = document.elementFromPoint(i.clientX, i.clientY) || m.target);
  var w = !1, S = function() {
    var P;
    w = !0, (P = i.stop) === null || P === void 0 || P.call(i);
  }, C = s && (!t.targetGesto || !t.controlGesto || !t.targetGesto.isFlag() || !t.controlGesto.isFlag());
  C && t.updateRect(a, !0, !1);
  var k = i.datas, M = f ? "controlGesto" : "targetGesto", E = t[M], D = function(P, R, N) {
    if (!(R in P) || E !== t[M])
      return !1;
    var F = P.name, q = k[F] || (k[F] = {});
    if (s && (q.isEventStart = !N || !P[N] || P[N](t, i)), !q.isEventStart)
      return !1;
    var z = P[R](t, O(O({}, i), { stop: S, datas: q, originalDatas: k, inputTarget: y }));
    return t._emitter.off(), s && z === !1 && (q.isEventStart = !1), z;
  };
  C && h.forEach(function(P) {
    P.unset && P.unset(t);
  }), D(Hp, "drag".concat(r).concat(a));
  var _ = 0, j = 0;
  n.forEach(function(P) {
    if (w)
      return !1;
    var R = "".concat(P).concat(r).concat(a), N = "".concat(P).concat(r, "Condition");
    a === "" && !d && Ny(t.state, i);
    var F = h.filter(function(B) {
      return B[R];
    });
    F = F.filter(function(B, Y) {
      return B.name && F.indexOf(B) === Y;
    });
    var q = F.filter(function(B) {
      return D(B, R, N);
    }), z = q.length;
    w && ++_, z && ++j, !w && s && F.length && !z && (_ += F.filter(function(B) {
      var Y = B.name, V = k[Y];
      return V.isEventStart ? B.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!c || j) && D(Vp, "drag".concat(r).concat(a));
  var x = E !== t[M] || _ === n.length;
  if ((l || w || x) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(P) {
    P.state.gestos = {};
  }), h.forEach(function(P) {
    P.unset && P.unset(t);
  })), s && !x && !d && j && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || x)
    return !1;
  if (!s && j && !o || l) {
    var I = t.props.flushSync || kp;
    I(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !c && j && !o && Jr(t, e, n, r, a + "After", i), !0;
}
function Nl(t, e) {
  return function(n, r) {
    var a;
    r === void 0 && (r = n.inputEvent.target);
    var i = r, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || se(i, "moveable-area") || se(i, "moveable-padding") || se(i, "moveable-edgeDraggable");
  };
}
function Kp(t, e, n) {
  var r = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(r), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var c = Nl(t);
  return Up(t, a, "targetAbles", n, {
    dragStart: c,
    pinchStart: c
  });
}
function qp(t, e) {
  var n = t.controlBox, r = [];
  r.push(n);
  var a = Nl(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === n)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return Up(t, r, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function Up(t, e, n, r, a) {
  a === void 0 && (a = {});
  var i = n === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, c = o.preventClickEventOnDrag, u = o.preventClickDefault, d = o.checkInput, f = o.dragFocusedInput, h = o.preventDefault, v = h === void 0 ? !0 : h, m = o.preventRightClick, y = m === void 0 ? !0 : m, w = o.preventWheelClick, S = w === void 0 ? !0 : w, C = o.dragContainer, k = tn(C, !0), M = {
    preventDefault: v,
    preventRightClick: y,
    preventWheelClick: S,
    container: k || Le(t.getControlBoxElement()),
    pinchThreshold: l,
    pinchOutside: s,
    preventClickEventOnDrag: i ? c : !1,
    preventClickEventOnDragStart: i ? u : !1,
    preventClickEventByCondition: i ? null : function(_) {
      return t.controlBox.contains(_.target);
    },
    checkInput: i ? d : !1,
    dragFocusedInput: f
  }, E = new Gf(e, M), D = r === "Control";
  return ["drag", "pinch"].forEach(function(_) {
    ["Start", "", "End"].forEach(function(j) {
      E.on("".concat(_).concat(j), function(x) {
        var I, P = x.eventType, R = _ === "drag" && x.isPinch;
        if (a[P] && !a[P](x)) {
          x.stop();
          return;
        }
        if (!R) {
          var N = _ === "drag" ? [_] : ["drag", _], F = ot([], A(t[n]), !1), q = Jr(t, F, N, r, j, x);
          q ? (t.props.stopPropagation || j === "Start" && D) && ((I = x == null ? void 0 : x.inputEvent) === null || I === void 0 || I.stopPropagation()) : x.stop();
        }
      });
    });
  }), E;
}
var fb = /* @__PURE__ */ (function() {
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
function pb(t, e, n, r) {
  var a;
  n === void 0 && (n = e);
  var i = ep(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, c = i.transformOrigin, u = i.targetOrigin, d = i.offsetContainer, f = i.hasFixed, h = i.zoom, v = Dx(d, n), m = v.matrixes, y = v.is3d, w = v.offsetContainer, S = v.zoom, C = r, k = 4, M = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, E = l, D = Xt(k), _ = Xt(k), j = Xt(k), x = Xt(k), I = o.length, P = m.map(function(Y) {
    return O(O({}, Y), { matrix: Y.matrix ? ot([], A(Y.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && C && (E = Ze(E, 3, 4), ks(o)), !y && C && ks(P), P.forEach(function(Y) {
    _ = Bt(_, Y.matrix, k);
  });
  var R = n || Pn(t), N = ((a = P[0]) === null || a === void 0 ? void 0 : a.target) || ua(R, R, !0).offsetParent, F = P.slice(1).reduce(function(Y, V) {
    return Bt(Y, V.matrix, k);
  }, Xt(k));
  o.forEach(function(Y, V) {
    if (I - 2 === V && (j = D.slice()), I - 1 === V && (x = D.slice()), !Y.matrix) {
      var W = o[V + 1], tt = jy(Y, W, N, k, Bt(F, D, k));
      Y.matrix = Zn(tt, k);
    }
    D = Bt(D, Y.matrix, k);
  });
  var q = !M && s;
  E || (E = Xt(q ? 4 : 3));
  var z = Hi(M && E.length === 16 ? Ze(E, 4, 3) : E, q), B = _;
  return _ = Pf(_, k, k), {
    hasZoom: h !== 1 || S !== 1,
    hasFixed: f,
    matrixes: o,
    rootMatrix: _,
    originalRootMatrix: B,
    beforeMatrix: j,
    offsetMatrix: x,
    allMatrix: D,
    targetMatrix: E,
    targetTransform: z,
    inlineTransform: t.style.transform,
    transformOrigin: c,
    targetOrigin: u,
    is3d: C,
    offsetContainer: d,
    offsetRootContainer: w
  };
}
function hb(t, e, n, r) {
  n === void 0 && (n = e);
  var a = 0, i = 0, o = 0, s = {}, l = Tp(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var c = pb(t, e, n, r), u = hr(c.allMatrix, c.transformOrigin, a, i);
    s = O(O({}, c), u);
    var d = hr(c.allMatrix, [50, 50], 100, 100);
    o = _p([d.pos1, d.pos2], d.direction);
  }
  var f = 4;
  return O(O(O({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: Xt(f), rootMatrix: Xt(f), beforeMatrix: Xt(f), offsetMatrix: Xt(f), allMatrix: Xt(f), targetMatrix: Xt(f), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function Ts(t, e, n, r, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = Ja(), c = Ja(), u = Ja(), d = Ja(), f = [0, 0], h = {}, v = hb(e, n, a, !0);
  if (e) {
    var m = Ee(e);
    i.forEach(function(P) {
      h[P] = m(P);
    });
    var y = v.is3d ? 4 : 3, w = hr(v.offsetMatrix, Ot(v.transformOrigin, Nf(v.targetMatrix, y)), v.width, v.height);
    o = w.direction, s = Ot(w.origin, [w.left - v.left, w.top - v.top]), d = Zr(v.offsetRootContainer);
    var S = ua(r, r, !0).offsetParent || v.offsetRootContainer;
    if (v.hasZoom) {
      var C = hr(Bt(v.originalRootMatrix, v.allMatrix), v.transformOrigin, v.width, v.height), k = hr(v.originalRootMatrix, _i(Ee(S)("transformOrigin")).map(function(P) {
        return parseFloat(P);
      }), S.offsetWidth, S.offsetHeight);
      if (l = Ao(C, d), u = Ao(k, d, S, !0), t) {
        var M = C.left, E = C.top;
        c = Ao({
          left: M,
          top: E,
          bottom: E,
          right: E
        }, d);
      }
    } else {
      l = Zr(e), u = Mx(S), t && (c = Zr(t));
      var D = u.left, _ = u.top, j = u.clientLeft, x = u.clientTop, I = [
        l.left - D,
        l.top - _
      ];
      f = wt(wr(v.rootMatrix, I, 4), [j + v.left, x + v.top]);
    }
  }
  return O({ targetClientRect: l, containerClientRect: u, moveableClientRect: c, rootContainerClientRect: d, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: h, offsetDelta: f }, v);
}
function Xu(t) {
  var e = t.pos1, n = t.pos2, r = t.pos3, a = t.pos4;
  if (!e || !n || !r || !a)
    return null;
  var i = Jn([e, n, r, a]), o = [i.minX, i.minY], s = wt(t.origin, o);
  return e = wt(e, o), n = wt(n, o), r = wt(r, o), a = wt(a, o), O(O({}, t), {
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
var Sr = /* @__PURE__ */ (function(t) {
  ga(e, t);
  function e() {
    var n = t !== null && t.apply(this, arguments) || this;
    return n.state = O({ container: null, gestos: {}, renderLines: [
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]]
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, Ts(null)), n.renderState = {}, n.enabledAbles = [], n.targetAbles = [], n.controlAbles = [], n.rotation = 0, n.scale = [1, 1], n.isMoveableMounted = !1, n.isUnmounted = !1, n.events = {
      mouseEnter: null,
      mouseLeave: null
    }, n._emitter = new ha(), n._prevOriginalDragTarget = null, n._originalDragTarget = null, n._prevDragTarget = null, n._dragTarget = null, n._prevPropTarget = null, n._propTarget = null, n._prevDragArea = !1, n._isPropTargetChanged = !1, n._hasFirstTarget = !1, n._reiszeObserver = null, n._observerId = 0, n._mutationObserver = null, n._rootContainer = null, n._viewContainer = null, n._viewClassNames = [], n._store = {}, n.checkUpdateRect = function() {
      if (!n.isDragging()) {
        var r = n.props.parentMoveable;
        if (r) {
          r.checkUpdateRect();
          return;
        }
        r0(n._observerId), n._observerId = jf(function() {
          n.isDragging() || n.updateRect();
        });
      }
    }, n._onPreventClick = function(r) {
      r.stopPropagation(), r.preventDefault();
    }, n;
  }
  return e.prototype.render = function() {
    var n = this.props, r = this.getState(), a = n.parentPosition, i = n.className, o = n.target, s = n.zoom, l = n.cspNonce, c = n.translateZ, u = n.cssStyled, d = n.groupable, f = n.linePadding, h = n.controlPadding;
    this._checkUpdateRootContainer(), this.checkUpdate(), this.updateRenderPoses();
    var v = A(a || [0, 0], 2), m = v[0], y = v[1], w = r.left, S = r.top, C = r.target, k = r.direction, M = r.hasFixed, E = r.offsetDelta, D = n.targets, _ = this.isDragging(), j = {};
    this.getEnabledAbles().forEach(function(F) {
      j["data-able-".concat(F.name.toLowerCase())] = !0;
    });
    var x = this._getAbleClassName(), I = D && D.length && (C || d) || o || !this._hasFirstTarget && this.state.isPersisted, P = this.controlBox || this.props.firstRenderState || this.props.persistData, R = [w - m, S - y];
    !d && n.useAccuratePosition && (R[0] += E[0], R[1] += E[1]);
    var N = {
      position: M ? "fixed" : "absolute",
      display: I ? "block" : "none",
      visibility: P ? "visible" : "hidden",
      transform: "translate3d(".concat(R[0], "px, ").concat(R[1], "px, ").concat(c, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return f && (N["--moveable-line-padding"] = f), h && (N["--moveable-control-padding"] = h), G.createElement(
      u,
      O({ cspNonce: l, ref: Tn(this, "controlBox"), className: "".concat(bt("control-box", k === -1 ? "reverse" : "", _ ? "dragging" : ""), " ").concat(x, " ").concat(i) }, j, { onClick: this._onPreventClick, style: N }),
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
    a && this._changeAbleViewClassNames([]), ur(this, !1), ur(this, !0);
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
    return _e(r, function(a) {
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
    return n && (((r = n.getAttribute) === null || r === void 0 ? void 0 : r.call(n, "class")) || "").indexOf(gl) > -1;
  }, e.prototype.dragStart = function(n, r) {
    r === void 0 && (r = n.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && Nl(this)({ inputEvent: n }, r) ? a.isFlag() || a.triggerDragStart(n) : i && this.isMoveableElement(r) && (i.isFlag() || i.triggerDragStart(n)), this;
  }, e.prototype.hitTest = function(n) {
    var r = this.state, a = r.target, i = r.pos1, o = r.pos2, s = r.pos3, l = r.pos4, c = r.targetClientRect;
    if (!a)
      return 0;
    var u;
    if (la(n)) {
      var d = n.getBoundingClientRect();
      u = {
        left: d.left,
        top: d.top,
        width: d.width,
        height: d.height
      };
    } else
      u = O({ width: 0, height: 0 }, n);
    var f = u.left, h = u.top, v = u.width, m = u.height, y = us([i, o, l, s], c), w = P0(y, [
      [f, h],
      [f + v, h],
      [f + v, h + m],
      [f, h + m]
    ]), S = Vr(y);
    return !w || !S ? 0 : Math.min(100, w / S * 100);
  }, e.prototype.isInside = function(n, r) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, c = a.pos4, u = a.targetClientRect;
    return i ? Ci([n, r], us([o, s, c, l], u)) : !1;
  }, e.prototype.updateRect = function(n, r, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && yr(!0);
    var s = i.parentMoveable, l = this.state, c = l.target || i.target, u = this.getContainer(), d = s ? s._rootContainer : this._rootContainer, f = Ts(this.controlBox, c, u, u, d || u, this._getRequestStyles());
    if (!c && this._hasFirstTarget && i.persistData) {
      var h = Xu(i.persistData);
      for (var v in h)
        f[v] = h[v];
    }
    o && yr(), this.updateState(f, s ? !1 : a);
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
    var n = this.state, r = Ge(this.state), a = A(r, 4), i = a[0], o = a[1], s = a[2], l = a[3], c = ze(r), u = n.width, d = n.height, f = c.width, h = c.height, v = c.left, m = c.top, y = [n.left, n.top], w = Ot(y, n.origin), S = Ot(y, n.beforeOrigin), C = n.transformOrigin;
    return {
      width: f,
      height: h,
      left: v,
      top: m,
      pos1: i,
      pos2: o,
      pos3: s,
      pos4: l,
      offsetWidth: u,
      offsetHeight: d,
      beforeOrigin: S,
      origin: w,
      transformOrigin: C,
      rotation: this.getRotation()
    };
  }, e.prototype.getManager = function() {
    return this;
  }, e.prototype.stopDrag = function(n) {
    if (!n || n === "target") {
      var r = this.targetGesto;
      (r == null ? void 0 : r.isIdle()) === !1 && Es(this, !1), r == null || r.stop();
    }
    if (!n || n === "control") {
      var r = this.controlGesto;
      (r == null ? void 0 : r.isIdle()) === !1 && Es(this, !0), r == null || r.stop();
    }
  }, e.prototype.getRotation = function() {
    var n = this.state, r = n.pos1, a = n.pos2, i = n.direction;
    return Ly(r, a, i);
  }, e.prototype.request = function(n, r, a) {
    r === void 0 && (r = {});
    var i = this, o = i.props, s = o.parentMoveable || o.wrapperMoveable || i, l = s.props.ables, c = o.groupable, u = _e(l, function(w) {
      return w.name === n;
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
    var d = u.request(i), f = a || r.isInstant, h = d.isControl ? "controlAbles" : "targetAbles", v = "".concat(c ? "Group" : "").concat(d.isControl ? "Control" : ""), m = ot([], A(s[h]), !1), y = {
      request: function(w) {
        return Jr(i, m, ["drag"], v, "", O(O({}, d.request(w)), { requestAble: n, isRequest: !0 }), f), y;
      },
      requestEnd: function() {
        return Jr(i, m, ["drag"], v, "End", O(O({}, d.requestEnd()), { requestAble: n, isRequest: !0 }), f), y;
      }
    };
    return Jr(i, m, ["drag"], v, "Start", O(O({}, d.requestStart(r)), { requestAble: n, isRequest: !0 }), f), f ? y.request(r).requestEnd() : y;
  }, e.prototype.getMoveables = function() {
    return [this];
  }, e.prototype.destroy = function() {
    this.componentWillUnmount();
  }, e.prototype.updateRenderPoses = function() {
    var n = this.getState(), r = this.props, a = r.padding, i = n.originalBeforeOrigin, o = n.transformOrigin, s = n.allMatrix, l = n.is3d, c = n.pos1, u = n.pos2, d = n.pos3, f = n.pos4, h = n.left, v = n.top, m = n.isPersisted, y = r.zoom || 1;
    if (!a && y <= 1) {
      n.renderPoses = [
        c,
        u,
        d,
        f
      ], n.renderLines = [
        [c, u],
        [u, f],
        [f, d],
        [d, c]
      ];
      return;
    }
    var w = Fp(a || {}), S = w.left, C = w.top, k = w.bottom, M = w.right, E = l ? 4 : 3, D = [];
    m ? D = o : this.controlBox && r.groupable ? D = i : D = Ot(i, [h, v]);
    var _ = Si(E, Zn(D.map(function(N) {
      return -N;
    }), E), s, Zn(o, E)), j = Oe(_, c, [-S, -C], E), x = Oe(_, u, [M, -C], E), I = Oe(_, d, [-S, k], E), P = Oe(_, f, [M, k], E);
    n.renderPoses = [
      j,
      x,
      I,
      P
    ], n.renderLines = [
      [j, x],
      [x, P],
      [P, I],
      [I, j]
    ];
    {
      var R = y / 2;
      n.renderLines = [
        [
          Oe(_, c, [-S - R, -C], E),
          Oe(_, u, [M + R, -C], E)
        ],
        [
          Oe(_, u, [M, -C - R], E),
          Oe(_, f, [M, k + R], E)
        ],
        [
          Oe(_, f, [M + R, k], E),
          Oe(_, d, [-S - R, k], E)
        ],
        [
          Oe(_, d, [-S, k + R], E),
          Oe(_, c, [-S, -C - R], E)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var n = this.props, r = n.target, a = n.container, i = n.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !r)) {
      this.updateAbles();
      var c = !Ms(s, r), u = c || !Ms(l, a);
      if (u) {
        var d = a || this.controlBox;
        d && this.unsetAbles(), this.updateState({ target: r, container: a }), !i && d && this.updateRect("End", !1, !1), this._isPropTargetChanged = c;
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
    return a[i] || (a[i] = Wf(n, r)), a[i];
  }, e.prototype.getState = function() {
    var n, r = this.props;
    (r.target || !((n = r.targets) === null || n === void 0) && n.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = r.persistData, o = r.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = Xu(i);
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
    var a = this.props, i = a.triggerAblesSimultaneously, o = this.getEnabledAbles(n), s = "drag".concat(r, "Start"), l = "pinch".concat(r, "Start"), c = "drag".concat(r, "ControlStart"), u = Qa(o, [s, l], i), d = Qa(o, [c], i);
    this.enabledAbles = o, this.targetAbles = u, this.controlAbles = d;
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
      createElement: G.createElement
    };
    return this.renderState = {}, Py(Op(Qa(this.getEnabledAbles(), ["render"], a).map(function(o) {
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
      return ot(ot([], A(r), !1), A(s), !1);
    }, ot([], A(this.props.requestStyles || []), !1));
    return n;
  }, e.prototype._updateObserver = function(n) {
    this._updateResizeObserver(n), this._updateMutationObserver(n);
  }, e.prototype._updateEvents = function() {
    var n = this.targetAbles.length, r = this.controlAbles.length, a = this._dragTarget, i = !n && this.targetGesto || this._isTargetChanged(!0);
    i && (ur(this, !1), this.updateState({ gestos: {} })), r || ur(this, !0), a && n && !this.targetGesto && (this.targetGesto = Kp(this, a, "")), !this.controlGesto && r && (this.controlGesto = qp(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var n = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = n.dragArea, this._propTarget = n.target, this._originalDragTarget = n.dragTarget || n.target, this._dragTarget = tn(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var n = this.props, r = n, a = r.zoom, i = r.hideDefaultLines, o = r.hideChildMoveableDefaultLines, s = r.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), c = {
      createElement: G.createElement
    };
    return l.renderLines.map(function(u, d) {
      return ca(c, "", u[0], u[1], a, "render-line-".concat(d));
    });
  }, e.prototype._isTargetChanged = function(n) {
    var r = this.props, a = r.dragTarget || r.target, i = this._prevOriginalDragTarget, o = this._prevDragArea, s = r.dragArea, l = !s && i !== a, c = (n || s) && o !== s;
    return l || c || this._prevPropTarget != this._propTarget;
  }, e.prototype._updateNativeEvents = function() {
    var n = this, r = this.props, a = r.dragArea ? this.areaElement : this.state.target, i = this.events, o = Mr(i);
    if (this._isTargetChanged())
      for (var s in i) {
        var l = i[s];
        l && l.destroy(), i[s] = null;
      }
    if (a) {
      var c = this.enabledAbles;
      o.forEach(function(u) {
        var d = Qa(c, [u]), f = d.length > 0, h = i[u];
        if (!f) {
          h && (h.destroy(), i[u] = null);
          return;
        }
        h || (h = new fb(a, n, u), i[u] = h), h.setAbles(d);
      });
    }
  }, e.prototype._checkUpdateRootContainer = function() {
    var n = this.props.rootContainer;
    !this._rootContainer && n && (this._rootContainer = tn(n, !0));
  }, e.prototype._checkUpdateViewContainer = function() {
    var n = this.props.viewContainer;
    !this._viewContainer && n && (this._viewContainer = tn(n, !0));
    var r = this._viewContainer;
    r && this._changeAbleViewClassNames(ot(ot([], A(this._getAbleViewClassNames()), !1), [
      this.isDragging() ? Yy : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(n) {
    var r = this._viewContainer, a = Np(n.filter(Boolean), function(c) {
      return c;
    }).map(function(c) {
      var u = A(c, 1), d = u[0];
      return d;
    }), i = this._viewClassNames, o = fl(i, a), s = o.removed, l = o.added;
    s.forEach(function(c) {
      If(r, i[c]);
    }), l.forEach(function(c) {
      sl(r, a[c]);
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
      var u, d, f, h = c.name, v = ((u = c.className) === null || u === void 0 ? void 0 : u.call(c, r)) || "";
      return (!((d = s[h]) === null || d === void 0) && d.isEventStart || !((f = l[h]) === null || f === void 0) && f.isEventStart) && (v += " ".concat(bt("".concat(h).concat(n, "-dragging")))), v.trim();
    }).filter(Boolean).join(" ");
  }, e.prototype._updateResizeObserver = function(n) {
    var r, a = this.props, i = a.target, o = Le(this.getControlBoxElement());
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
    var r = this, a, i = this.props, o = i.target, s = Le(this.getControlBoxElement());
    if (!s.MutationObserver || !o || !i.useMutationObserver) {
      (a = this._mutationObserver) === null || a === void 0 || a.disconnect();
      return;
    }
    if (!(n.target === o && this._mutationObserver)) {
      var l = new s.MutationObserver(function(c) {
        var u, d;
        try {
          for (var f = K0(c), h = f.next(); !h.done; h = f.next()) {
            var v = h.value;
            v.type === "attributes" && v.attributeName === "style" && r.checkUpdateRect();
          }
        } catch (m) {
          u = { error: m };
        } finally {
          try {
            h && !h.done && (d = f.return) && d.call(f);
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
    flushSync: kp,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})(G.PureComponent), Ol = {
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
    var n, r = t.props, a = r.targets || [], i = t.getState(), o = i.left, s = i.top, l = i.isPersisted, c = r.zoom || 1, u = t.renderGroupRects, d = ((n = r.persistData) === null || n === void 0 ? void 0 : n.children) || [];
    l ? a = d.map(function() {
      return null;
    }) : d = [];
    var f = dr(t, "parentPosition", [o, s], function(v) {
      return v.join(",");
    }), h = dr(t, "requestStyles", t.getRequestChildStyles(), function(v) {
      return v.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), ot(ot([], A(a.map(function(v, m) {
      return e.createElement(Sr, { key: "moveable" + m, ref: Ef(t, "moveables", m), target: v, origin: !1, requestStyles: h, cssStyled: r.cssStyled, customStyledMap: r.customStyledMap, useResizeObserver: r.useResizeObserver, useMutationObserver: r.useMutationObserver, hideChildMoveableDefaultLines: r.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: d[m], zoom: c });
    })), !1), A(Op(u.map(function(v, m) {
      var y = v.pos1, w = v.pos2, S = v.pos3, C = v.pos4, k = [y, w, S, C];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(M, E) {
        var D = A(M, 2), _ = D[0], j = D[1];
        return ca(e, "", wt(k[_], f), wt(k[j], f), c, "group-rect-".concat(m, "-").concat(E));
      });
    }))), !1);
  }
}, gb = va("clickable", {
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
      gt(t, "onClick", Rt(t, e, {
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
      i === -1 && (i = mn(a, function(l) {
        return l.contains(r);
      }), s = i > -1), gt(t, "onClickGroup", Rt(t, e, {
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
function ar(t) {
  var e = t.originalDatas.draggable;
  return e || (t.originalDatas.draggable = {}, e = t.originalDatas.draggable), O(O({}, t), { datas: e });
}
var vb = va("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var n = t.props, r = n.edgeDraggable;
    return r ? ap(e, "edgeDraggable", r, t.getState().renderPoses, n.zoom) : [];
  },
  dragCondition: function(t, e) {
    var n, r = t.props, a = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
    return !r.edgeDraggable || !a ? !1 : !r.draggable && se(a, bt("direction")) && se(a, bt("edge")) && se(a, bt("edgeDraggable"));
  },
  dragStart: function(t, e) {
    return be.dragStart(t, ar(e));
  },
  drag: function(t, e) {
    return be.drag(t, ar(e));
  },
  dragEnd: function(t, e) {
    return be.dragEnd(t, ar(e));
  },
  dragGroupCondition: function(t, e) {
    var n, r = t.props, a = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
    return !r.edgeDraggable || !a ? !1 : !r.draggable && se(a, bt("direction")) && se(a, bt("line"));
  },
  dragGroupStart: function(t, e) {
    return be.dragGroupStart(t, ar(e));
  },
  dragGroup: function(t, e) {
    return be.dragGroup(t, ar(e));
  },
  dragGroupEnd: function(t, e) {
    return be.dragGroupEnd(t, ar(e));
  },
  unset: function(t) {
    return be.unset(t);
  }
}), Zp = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, mb = [
  Hp,
  $p,
  by,
  Fy,
  be,
  vb,
  ws,
  By,
  $y,
  ny,
  Vy,
  Ky,
  Xy,
  ob,
  ib,
  ub,
  Ol,
  Zp,
  gb,
  Gp,
  Vp
];
function Hu(t, e) {
  var n = A(t, 3), r = n[0], a = n[1], i = n[2];
  return (r * e[0] + a * e[1] + i) / Math.sqrt(r * r + a * a);
}
function ni(t, e) {
  var n = A(t, 2), r = n[0], a = n[1];
  return -r * e[0] - a * e[1];
}
function Vu(t, e) {
  return Math.max.apply(Math, ot([], A(t.map(function(n) {
    var r = A(n, 4), a = r[0], i = r[1], o = r[2], s = r[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function Ku(t, e) {
  return Math.min.apply(Math, ot([], A(t.map(function(n) {
    var r = A(n, 4), a = r[0], i = r[1], o = r[2], s = r[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function xb(t, e) {
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
  var d = Dt(e, Ce);
  if (d % 90) {
    var f = d / 180 * Math.PI, h = Math.tan(f), v = -1 / h, m = [ms, mu], y = [[0, 0], [0, 0]], w = [ms, mu], S = [[0, 0], [0, 0]];
    t.forEach(function(J) {
      J.forEach(function(rt) {
        var Q = Hu([-h, 1, 0], rt), at = Hu([-v, 1, 0], rt);
        m[0] > Q && (y[0] = rt, m[0] = Q), m[1] < Q && (y[1] = rt, m[1] = Q), w[0] > at && (S[0] = rt, w[0] = at), w[1] < at && (S[1] = rt, w[1] = at);
      });
    });
    var C = A(y, 2), k = C[0], M = C[1], E = A(S, 2), D = E[0], _ = E[1], j = [-h, 1, ni([-h, 1], k)], x = [-h, 1, ni([-h, 1], M)], I = [-v, 1, ni([-v, 1], D)], P = [-v, 1, ni([-v, 1], _)];
    n = A([
      [j, I],
      [j, P],
      [x, I],
      [x, P]
    ].map(function(J) {
      var rt = A(J, 2), Q = rt[0], at = rt[1];
      return pl(Q, at)[0];
    }), 4), i = n[0], o = n[1], s = n[2], l = n[3], c = w[1] - w[0], u = m[1] - m[0];
  } else {
    var R = Ku(t, 0), N = Ku(t, 1), F = Vu(t, 0), q = Vu(t, 1);
    if (i = [R, N], o = [F, N], s = [R, q], l = [F, q], c = F - R, u = q - N, d % 180) {
      var z = [s, i, l, o];
      r = A(z, 4), i = r[0], o = r[1], s = r[2], l = r[3], c = q - N, u = F - R;
    }
  }
  if (d % 360 > 180) {
    var z = [l, s, o, i];
    a = A(z, 4), i = a[0], o = a[1], s = a[2], l = a[3];
  }
  var B = Jn([i, o, s, l]), Y = B.minX, V = B.minY, W = B.maxX, tt = B.maxY;
  return {
    pos1: i,
    pos2: o,
    pos3: s,
    pos4: l,
    width: c,
    height: u,
    minX: Y,
    minY: V,
    maxX: W,
    maxY: tt,
    rotation: e
  };
}
function Jp(t, e) {
  var n = e.map(function(r) {
    if (te(r)) {
      var a = Jp(t, r), i = a.length;
      return i > 1 ? a : i === 1 ? a[0] : null;
    } else {
      var o = _e(t, function(s) {
        var l = s.manager;
        return l.props.target === r;
      });
      return o ? (o.finded = !0, o.manager) : null;
    }
  }).filter(Boolean);
  return n.length === 1 && te(n[0]) ? n[0] : n;
}
var yb = /* @__PURE__ */ (function(t) {
  ga(e, t);
  function e() {
    var n = t !== null && t.apply(this, arguments) || this;
    return n.differ = new Lf(), n.moveables = [], n.transformOrigin = "50% 50%", n.renderGroupRects = [], n._targetGroups = [], n._hasFirstTargets = !1, n;
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
    yr(!0), this.moveables.forEach(function(Z) {
      Z.updateRect(n, !1, !1);
    });
    var s = this.props, l = this.moveables, c = o.target || s.target, u = l.map(function(Z) {
      return { finded: !1, manager: Z };
    }), d = this.props.targetGroups || [], f = Jp(u, d), h = s.useDefaultGroupRotate;
    f.push.apply(f, ot([], A(u.filter(function(Z) {
      var ut = Z.finded;
      return !ut;
    }).map(function(Z) {
      var ut = Z.manager;
      return ut;
    })), !1));
    var v = [], m = !r || n !== "" && s.updateGroup, y = s.defaultGroupRotate || 0;
    if (!this._hasFirstTargets) {
      var w = (i = s.persistData) === null || i === void 0 ? void 0 : i.rotation;
      w != null && (y = w);
    }
    function S(Z, ut, vt) {
      var nt = Z.map(function(Mt) {
        if (te(Mt)) {
          var ht = S(Mt, ut), yt = [ht.pos1, ht.pos2, ht.pos3, ht.pos4];
          return v.push(ht), { poses: yt, rotation: ht.rotation };
        } else
          return {
            poses: Ge(Mt.state),
            rotation: Mt.getRotation()
          };
      }), pt = nt.map(function(Mt) {
        var ht = Mt.rotation;
        return ht;
      }), jt = 0, st = pt[0], lt = pt.every(function(Mt) {
        return Math.abs(st - Mt) < 0.1;
      });
      m ? jt = !h && lt ? st : y : jt = !h && !vt && lt ? st : ut;
      var xt = nt.map(function(Mt) {
        var ht = Mt.poses;
        return ht;
      }), Ct = xb(xt, jt);
      return Ct;
    }
    var C = S(f, this.rotation, !0);
    m && (this.rotation = C.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = d, this.renderGroupRects = v;
    var k = this.transformOrigin, M = this.rotation, E = this.scale, D = C.width, _ = C.height, j = C.minX, x = C.minY, I = zy([
      [0, 0],
      [D, 0],
      [0, _],
      [D, _]
    ], Il(k, D, _), this.rotation / 180 * Math.PI), P = Jn(I.result), R = P.minX, N = P.minY, F = " rotate(".concat(M, "deg)") + " scale(".concat(we(E[0]), ", ").concat(we(E[1]), ")"), q = "translate(".concat(-R, "px, ").concat(-N, "px)").concat(F);
    this.controlBox.style.transform = "translate3d(".concat(j, "px, ").concat(x, "px, ").concat(this.props.translateZ || 0, ")"), c.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(k, ";") + "width:".concat(D, "px;height:").concat(_, "px;") + "transform: ".concat(q), o.width = D, o.height = _;
    var z = this.getContainer(), B = Ts(this.controlBox, c, this.controlBox, this.getContainer(), this._rootContainer || z, []), Y = [B.left, B.top], V = A(Ge(B), 4), W = V[0], tt = V[1], J = V[2], rt = V[3], Q = Jn([W, tt, J, rt]), at = [Q.minX, Q.minY], ft = we(E[0] * E[1]);
    B.pos1 = wt(W, at), B.pos2 = wt(tt, at), B.pos3 = wt(J, at), B.pos4 = wt(rt, at), B.left = j - B.left + at[0], B.top = x - B.top + at[1], B.origin = wt(Ot(Y, B.origin), at), B.beforeOrigin = wt(Ot(Y, B.beforeOrigin), at), B.originalBeforeOrigin = Ot(Y, B.originalBeforeOrigin), B.transformOrigin = wt(Ot(Y, B.transformOrigin), at), c.style.transform = "translate(".concat(-R - at[0], "px, ").concat(-N - at[1], "px)") + F, yr(), this.updateState(O(O({}, B), { posDelta: at, direction: ft, beforeDirection: ft }), a);
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
      return ot(ot([], A(r), !1), A(s), !1);
    }, []);
    return n;
  }, e.prototype.getMoveables = function() {
    return ot([], A(this.moveables), !1);
  }, e.prototype.updateAbles = function() {
    t.prototype.updateAbles.call(this, ot(ot([], A(this.props.ables), !1), [Ol], !1), "Group");
  }, e.prototype._updateTargets = function() {
    t.prototype._updateTargets.call(this), this._originalDragTarget = this.props.dragTarget || this.areaElement, this._dragTarget = tn(this._originalDragTarget, !0);
  }, e.prototype._updateEvents = function() {
    var n = this.state, r = this.props, a = this._prevDragTarget, i = r.dragTarget || this.areaElement, o = r.targets, s = this.differ.update(o), l = s.added, c = s.changed, u = s.removed, d = l.length || u.length;
    (d || this._prevOriginalDragTarget !== this._originalDragTarget) && (ur(this, !1), ur(this, !0), this.updateState({ gestos: {} })), a !== i && (n.target = null), n.target || (n.target = this.areaElement, this.controlBox.style.display = "block"), n.target && (this.targetGesto || (this.targetGesto = Kp(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = qp(this, "GroupControl")));
    var f = !Ms(n.container, r.container);
    f && (n.container = r.container), (f || d || this.transformOrigin !== (r.defaultGroupOrigin || "50% 50%") || c.length || o.length && !zp(this._targetGroups, r.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!d;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = O(O({}, Sr.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Sr), bb = /* @__PURE__ */ (function(t) {
  ga(e, t);
  function e() {
    var n = t !== null && t.apply(this, arguments) || this;
    return n.moveables = [], n;
  }
  return e.prototype.render = function() {
    var n = this, r, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], c = l.length, u = this.isUnmounted || !c, d = (r = s == null ? void 0 : s.children) !== null && r !== void 0 ? r : [];
    return u && !c && d.length ? l = d.map(function() {
      return null;
    }) : u || (d = []), G.createElement(o, { cspNonce: i, ref: Tn(this, "controlBox"), className: bt("control-box") }, l.map(function(f, h) {
      var v, m, y = (m = (v = a.individualGroupableProps) === null || v === void 0 ? void 0 : v.call(a, f, h)) !== null && m !== void 0 ? m : {};
      return G.createElement(Sr, O({ key: "moveable" + h, ref: Ef(n, "moveables", h) }, a, y, { target: f, wrapperMoveable: n, isWrapperMounted: n.isMoveableMounted, persistData: d[h] }));
    }));
  }, e.prototype.componentDidMount = function() {
  }, e.prototype.componentDidUpdate = function() {
  }, e.prototype.getTargets = function() {
    return this.props.targets;
  }, e.prototype.updateRect = function(n, r, a) {
    a === void 0 && (a = !0), yr(!0), this.moveables.forEach(function(i) {
      i.updateRect(n, r, a);
    }), yr();
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
    var a = r, i = _e(this.moveables, function(o) {
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
    return ot([], A(this.moveables), !1);
  }, e.prototype.updateRenderPoses = function() {
  }, e.prototype.checkUpdate = function() {
  }, e.prototype.triggerEvent = function() {
  }, e.prototype.updateAbles = function() {
  }, e.prototype._updateEvents = function() {
  }, e.prototype._updateObserver = function() {
  }, e;
})(Sr);
function Qp(t, e) {
  var n = [];
  return t.forEach(function(r) {
    if (r) {
      if (Fe(r)) {
        e[r] && n.push.apply(n, ot([], A(e[r]), !1));
        return;
      }
      te(r) ? n.push.apply(n, ot([], A(Qp(r, e)), !1)) : n.push(r);
    }
  }), n;
}
function th(t, e) {
  var n = [];
  return t.forEach(function(r) {
    if (r) {
      if (Fe(r)) {
        e[r] && n.push.apply(n, ot([], A(e[r]), !1));
        return;
      }
      te(r) ? n.push(th(r, e)) : n.push(r);
    }
  }), n;
}
function eh(t, e) {
  return t.length !== e.length || t.some(function(n, r) {
    var a = e[r];
    return !n && !a ? !1 : n != a ? te(n) && te(a) ? eh(n, a) : !0 : !1;
  });
}
var wb = /* @__PURE__ */ (function(t) {
  ga(e, t);
  function e() {
    var n = t !== null && t.apply(this, arguments) || this;
    return n.refTargets = [], n.selectorMap = {}, n._differ = new Lf(), n._elementTargets = [], n._tmpRefTargets = [], n._tmpSelectorMap = {}, n._onChangeTargets = null, n;
  }
  return e.makeStyled = function() {
    var n = {}, r = this.getTotalAbles();
    r.forEach(function(i) {
      var o = i.css;
      o && o.forEach(function(s) {
        n[s] = !0;
      });
    });
    var a = Mr(n).join(`
`);
    this.defaultStyled = Wf("div", Xm(gl, ix + a));
  }, e.getTotalAbles = function() {
    return ot([$p, Ol, Zp, Gp], A(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var n, r = this.constructor;
    r.defaultStyled || r.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = H0(a, ["ables", "props"]), l = A(this._updateRefs(!0), 2), c = l[0], u = l[1], d = Qp(c, u), f = d.length > 1, h = r.getTotalAbles(), v = ot(ot([], A(h), !1), A(i || []), !1), m = O(O(O({}, s), o || {}), { ables: v, cssStyled: r.defaultStyled, customStyledMap: r.customStyledMap });
    this._elementTargets = d;
    var y = null, w = this.moveable, S = s.persistData;
    if (S != null && S.children && (f = !0), s.individualGroupable)
      return G.createElement(bb, O({ key: "individual-group", ref: Tn(this, "moveable") }, m, { target: null, targets: d }));
    if (f) {
      var C = th(c, u);
      if (w && !w.props.groupable && !w.props.individualGroupable) {
        var k = w.props.target;
        k && d.indexOf(k) > -1 && (y = O({}, w.state));
      }
      return G.createElement(yb, O({ key: "group", ref: Tn(this, "moveable") }, m, (n = s.groupableProps) !== null && n !== void 0 ? n : {}, { target: null, targets: d, targetGroups: C, firstRenderState: y }));
    } else {
      var M = d[0];
      if (w && (w.props.groupable || w.props.individualGroupable)) {
        var E = w.moveables || [], D = _e(E, function(_) {
          return _.props.target === M;
        });
        D && (y = O({}, D.state));
      }
      return G.createElement(Sr, O({ key: "single", ref: Tn(this, "moveable") }, m, { target: M, firstRenderState: y }));
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
    var r = this.refTargets, a = jl(this.props.target || this.props.targets), i = typeof document < "u", o = eh(r, a), s = this.selectorMap, l = {};
    return this.refTargets.forEach(function c(u) {
      if (Fe(u)) {
        var d = s[u];
        d ? l[u] = s[u] : i && (o = !0, l[u] = [].slice.call(document.querySelectorAll(u)));
      } else te(u) && u.forEach(c);
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
    var c = A(this._updateRefs(), 3), u = c[0], d = c[1], f = c[2];
    this.refTargets = u, this.selectorMap = d, f && this.forceUpdate();
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, V0([
    Mf(lx)
  ], e.prototype, "moveable", void 0), e;
})(G.PureComponent), Sb = /* @__PURE__ */ (function(t) {
  ga(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = mb, e;
})(wb), _s = function(t, e) {
  return _s = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (n[a] = r[a]);
  }, _s(t, e);
};
function Cb(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  _s(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
function kb(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var ya = kb(function(t, e) {
  function n(l) {
    if (l && typeof l == "object") {
      var c = l.which || l.keyCode || l.charCode;
      c && (l = c);
    }
    if (typeof l == "number") return o[l];
    var u = String(l), d = r[u.toLowerCase()];
    if (d) return d;
    var d = a[u.toLowerCase()];
    if (d) return d;
    if (u.length === 1) return u.charCodeAt(0);
  }
  n.isEventKey = function(c, u) {
    if (c && typeof c == "object") {
      var d = c.which || c.keyCode || c.charCode;
      if (d == null)
        return !1;
      if (typeof u == "string") {
        var f = r[u.toLowerCase()];
        if (f)
          return f === d;
        var f = a[u.toLowerCase()];
        if (f)
          return f === d;
      } else if (typeof u == "number")
        return u === d;
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
ya.code;
ya.codes;
ya.aliases;
var Eb = ya.names;
ya.title;
var qu = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, Uu = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function nh(t, e) {
  var n = (Eb[t] || e || "").toLowerCase();
  for (var r in qu)
    n = n.replace(r, qu[r]);
  return n.replace(/\s/g, "");
}
function rh(t, e) {
  e === void 0 && (e = nh(t.keyCode, t.key));
  var n = Mb(t);
  return n.indexOf(e) === -1 && n.push(e), n.filter(Boolean);
}
function Mb(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function Zu(t) {
  var e = t.slice();
  return e.sort(function(n, r) {
    var a = Uu[n] || 5, i = Uu[r] || 5;
    return a - i;
  }), e;
}
var Ju, Db = /* @__PURE__ */ (function(t) {
  Cb(e, t);
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
    }, ae(r, "blur", a.blur), ae(r, "keydown", a.keydownEvent), ae(r, "keyup", a.keyupEvent), a;
  }
  var n = e.prototype;
  return Object.defineProperty(e, "global", {
    /**
     */
    get: function() {
      return Ju || (Ju = new e());
    },
    enumerable: !1,
    configurable: !0
  }), e.setGlobal = function() {
    return this.global;
  }, n.destroy = function() {
    var r = this.container;
    this.clear(), this.off(), Qt(r, "blur", this.blur), Qt(r, "keydown", this.keydownEvent), Qt(r, "keyup", this.keyupEvent);
  }, n.keydown = function(r, a) {
    return this.addEvent("keydown", r, a);
  }, n.offKeydown = function(r, a) {
    return this.removeEvent("keydown", r, a);
  }, n.offKeyup = function(r, a) {
    return this.removeEvent("keyup", r, a);
  }, n.keyup = function(r, a) {
    return this.addEvent("keyup", r, a);
  }, n.addEvent = function(r, a, i) {
    return te(a) ? this.on("".concat(r, ".").concat(Zu(a).join(".")), i) : Fe(a) ? this.on("".concat(r, ".").concat(a), i) : this.on(r, a), this;
  }, n.removeEvent = function(r, a, i) {
    return te(a) ? this.off("".concat(r, ".").concat(Zu(a).join(".")), i) : Fe(a) ? this.off("".concat(r, ".").concat(a), i) : this.off(r, a), this;
  }, n.triggerEvent = function(r, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = nh(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
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
    var l = rh(a, i);
    l.length > 1 && this.trigger("".concat(r, ".").concat(l.join(".")), s);
  }, e;
})(ha), js = function(t, e) {
  return js = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (n[a] = r[a]);
  }, js(t, e);
};
function ah(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  js(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var re = function() {
  return re = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, re.apply(this, arguments);
};
function Tb(t, e) {
  var n = {};
  for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, r = Object.getOwnPropertySymbols(t); a < r.length; a++)
    e.indexOf(r[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, r[a]) && (n[r[a]] = t[r[a]]);
  return n;
}
function _b(t, e, n, r) {
  var a = arguments.length, i = a < 3 ? e : r === null ? r = Object.getOwnPropertyDescriptor(e, n) : r, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, n, r);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, n, i) : o(e, n)) || i);
  return a > 3 && i && Object.defineProperty(e, n, i), i;
}
function Qr(t, e, n) {
  for (var r = 0, a = e.length, i; r < a; r++)
    (i || !(r in e)) && (i || (i = Array.prototype.slice.call(e, 0, r)), i[r] = e[r]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function jb(t) {
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
function Ib(t) {
  if (typeof Map > "u")
    return t.filter(function(n, r) {
      return t.indexOf(n) === r;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(n) {
    return e.has(n) ? !1 : (e.set(n, !0), !0);
  });
}
function Rb(t, e, n) {
  var r = Ke(t);
  return r.elementFromPoint && r.elementFromPoint(e, n) || null;
}
function ih(t, e, n) {
  var r = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || Ke(n).createElement(r);
  for (var c in i)
    l.setAttribute(c, i[c]);
  var u = l.children;
  if (a.forEach(function(f, h) {
    ih(f, u[h], l);
  }), o && o.split(/\s+/g).forEach(function(f) {
    f && !se(l, f) && sl(l, f);
  }), s) {
    var d = l.style;
    for (var c in s)
      d[c] = s[c];
  }
  return !e && n && n.appendChild(l), l;
}
function Pb(t, e) {
  for (var n = [], r = 2; r < arguments.length; r++)
    n[r - 2] = arguments[r];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, c = Tb(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: c,
    children: n
  };
}
function Fo(t, e, n) {
  t !== e && n(t, e);
}
function Qu(t, e, n) {
  var r;
  n === void 0 && (n = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, c = l.startX, u = l.startY;
  if (e > 0) {
    var d = Math.sqrt((i * i + s * s) / (1 + e * e)), f = e * d;
    i = (i >= 0 ? 1 : -1) * f, s = (s >= 0 ? 1 : -1) * d;
  }
  var h = Math.abs(i), v = Math.abs(s), m = i < 0 ? c - n.left : n.right - c, y = s < 0 ? u - n.top : n.bottom - u;
  r = ol([h, v], [0, 0], [m, y], !!e), h = r[0], v = r[1], i = (i >= 0 ? 1 : -1) * h, s = (s >= 0 ? 1 : -1) * v;
  var w = Math.min(0, i), S = Math.min(0, s), C = c + w, k = u + S;
  return {
    left: C,
    top: k,
    right: C + h,
    bottom: k + v,
    width: h,
    height: v
  };
}
function ri(t) {
  var e = t.getBoundingClientRect(), n = e.left, r = e.top, a = e.width, i = e.height;
  return {
    pos1: [n, r],
    pos2: [n + a, r],
    pos3: [n, r + i],
    pos4: [n + a, r + i]
  };
}
function td(t, e, n) {
  var r = or(t, e), a = r.list, i = r.prevList, o = r.added, s = r.removed, l = r.maintained;
  return Qr(Qr(Qr([], o.map(function(c) {
    return a[c];
  }), !0), s.map(function(c) {
    return i[c];
  }), !0), n ? l.map(function(c) {
    var u = c[1];
    return a[u];
  }) : []);
}
function ed(t) {
  for (var e = 0, n = t.length, r = 1; r < n; ++r)
    e = Math.max(Qe(t[r], t[r - 1]), e);
  return e;
}
var oh = $f(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), Is = "selecto-selection ".concat(oh.className), Al = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], Nb = Qr([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], Al), sh = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], Ob = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], Ab = /* @__PURE__ */ (function(t) {
  ah(e, t);
  function e(r) {
    r === void 0 && (r = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new zf(), a._onDragStart = function(s, l) {
      var c = s.data, u = s.clientX, d = s.clientY, f = s.inputEvent, h = a.options, v = h.selectFromInside, m = h.selectByClick, y = h.rootContainer, w = h.boundContainer, S = h.preventDragFromInside, C = S === void 0 ? !0 : S, k = h.clickBySelectEnd, M = h.dragCondition;
      if (M && !M(s)) {
        s.stop();
        return;
      }
      c.data = {};
      var E = Le(a.container);
      c.innerWidth = E.innerWidth, c.innerHeight = E.innerHeight, a.findSelectableTargets(c), c.startSelectedTargets = a.selectedTargets, c.scaleMatrix = dl(), c.containerX = 0, c.containerY = 0;
      var D = a.container, _ = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (y) {
        var j = a.container.getBoundingClientRect();
        c.containerX = j.left, c.containerY = j.top, c.scaleMatrix = m0(a.container, y);
      }
      if (w) {
        var x = Te(w) && "element" in w ? re({
          left: !0,
          top: !0,
          bottom: !0,
          right: !0
        }, w) : {
          element: w,
          left: !0,
          top: !0,
          bottom: !0,
          right: !0
        }, I = x.element, P = void 0;
        if (I) {
          Fe(I) ? P = Ke(D).querySelector(I) : I === !0 ? P = a.container : P = I;
          var R = P.getBoundingClientRect();
          x.left && (_.left = R.left), x.top && (_.top = R.top), x.right && (_.right = R.right), x.bottom && (_.bottom = R.bottom);
        }
      }
      c.boundArea = _;
      var N = {
        left: u,
        top: d,
        right: u,
        bottom: d,
        width: 0,
        height: 0
      }, F = [], q = m && !k, z = !1;
      if (!v || q) {
        var B = a._findElement(
          l || f.target,
          // elementFromPoint(clientX, clientY),
          c.selectableTargets
        );
        z = !!B, q && (F = B ? [B] : []);
      }
      var Y = !v && z;
      if (Y && !m)
        return s.stop(), !1;
      var V = f.type, W = V === "mousedown" || V === "touchstart", tt = !s.isClick && W ? a.emit("dragStart", re(re({}, s), {
        data: c.data
      })) : !0;
      if (!tt)
        return s.stop(), !1;
      if (a.continueSelect ? (F = td(a.selectedTargets, F, a.continueSelectWithoutDeselect), c.startPassedTargets = a.selectedTargets) : c.startPassedTargets = [], a._select(F, N, s, !0, Y && m && !k && C), c.startX = u, c.startY = d, c.selectFlag = !1, c.preventDragFromInside = !1, f.target) {
        var J = ui(c.scaleMatrix, [u - c.containerX, d - c.containerY]);
        a.target.style.cssText += "position: ".concat(y ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(J[0], "px, ").concat(J[1], "px)");
      }
      if (Y && m && !k)
        f.preventDefault(), C && (a._selectEnd(c.startSelectedTargets, c.startPassedTargets, N, s, !0), c.preventDragFromInside = !0);
      else {
        c.selectFlag = !0;
        var rt = a.options, Q = rt.scrollOptions, at = rt.innerScrollOptions, ft = !1;
        if (at) {
          for (var Z = s.inputEvent, ut = Z.target, vt = null, nt = ut; nt && nt !== Ke(D).body; ) {
            var pt = getComputedStyle(nt).overflow !== "visible";
            if (pt) {
              vt = nt;
              break;
            }
            nt = nt.parentElement;
          }
          vt && (c.innerScrollOptions = re({
            container: vt,
            checkScrollEvent: !0
          }, at === !0 ? {} : at), a.dragScroll.dragStart(s, c.innerScrollOptions), ft = !0);
        }
        !ft && Q && Q.container && a.dragScroll.dragStart(s, Q), Y && m && k && (c.selectFlag = !1, s.preventDrag());
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
      var l = s.data, c = s.inputEvent, u = Qu(s, a.options.ratio), d = l.selectFlag, f = a.container;
      if (c && a.emit("dragEnd", re(re({
        isDouble: !!s.isDouble,
        isClick: !!s.isClick,
        isDrag: !1,
        isSelect: d
      }, s), {
        data: l.data,
        rect: u
      })), a.target.style.cssText += "display: none;", d)
        l.selectFlag = !1, a.dragScroll.dragEnd();
      else if (a.selectByClick && a.clickBySelectEnd) {
        var h = a._findElement((c == null ? void 0 : c.target) || Rb(f, s.clientX, s.clientY), l.selectableTargets);
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
      var l = Ke(a.container);
      if (a.gesto.isFlag()) {
        var c = a.dragContainer;
        c === Le(a.container) && (c = l.documentElement);
        var u = la(c) ? [c] : [].slice.call(c), d = s.target;
        u.some(function(f) {
          if (f === d || f.contains(d))
            return s.preventDefault(), !0;
        });
      }
    }, a.target = r.portalContainer;
    var i = r.container;
    a.options = re({
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
      getElementRect: ri,
      cspNonce: "",
      ratio: 0
    }, r);
    var o = a.options.portalContainer;
    return o && (i = o.parentElement), a.container = i || document.body, a.initElement(), a.initDragScroll(), a.setKeyController(), a;
  }
  var n = e.prototype;
  return n.setSelectedTargets = function(r) {
    var a = this.selectedTargets, i = or(a, r), o = i.added, s = i.removed, l = i.prevList, c = i.list;
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
    var d = this.hitTest(c, u, !0, null), f = this.setSelectedTargets(d);
    return re(re({}, f), {
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
    this.off(), this.keycon && this.keycon.destroy(), this.gesto.unset(), this.injectResult.destroy(), this.dragScroll.dragEnd(), Qt(document, "selectstart", this._onDocumentSelectStart), this.options.portalContainer || (r = this.target.parentElement) === null || r === void 0 || r.removeChild(this.target), this.keycon = null, this.gesto = null, this.injectResult = null, this.target = null, this.container = null, this.options = null;
  }, n.getElementPoints = function(r) {
    var a = this.getElementRect || ri, i = a(r), o = [i.pos1, i.pos2, i.pos4, i.pos3];
    if (a !== ri) {
      var s = r.getBoundingClientRect();
      return us(o, s);
    }
    return o;
  }, n.getSelectableElements = function() {
    var r = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (zi(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (la(i))
        a.push(i);
      else if (Te(i))
        a.push(i.value || i.current);
      else {
        var s = [].slice.call(Ke(r).querySelectorAll(i));
        a.push.apply(a, s);
      }
    }), a;
  }, n.checkScroll = function() {
    if (this.gesto.isFlag()) {
      var r = this.scrollOptions, a = this.gesto.getEventData().innerScrollOptions, i = a || (r == null ? void 0 : r.container);
      i && this.dragScroll.checkScroll(re({
        inputEvent: this.gesto.getCurrentEvent()
      }, a || r));
    }
  }, n.findSelectableTargets = function(r) {
    var a = this;
    r === void 0 && (r = this.gesto.getEventData());
    var i = this.getSelectableElements(), o = i.map(function(d) {
      return a.getElementPoints(d);
    });
    r.selectableTargets = i, r.selectablePoints = o, r.selectableParentMap = null;
    var s = this.options, l = s.checkOverflow || s.innerScrollOptions, c = Ke(this.container);
    if (l) {
      var u = /* @__PURE__ */ new Map();
      r.selectableInnerScrollParentMap = u, r.selectableInnerScrollPathsList = i.map(function(d, f) {
        for (var h = d.parentElement, v = [], m = [], y = function() {
          var w = u.get(h);
          if (!w) {
            var S = getComputedStyle(h).overflow !== "visible";
            if (S) {
              var C = ri(h);
              w = {
                parentElement: h,
                indexes: [],
                points: [C.pos1, C.pos2, C.pos4, C.pos3],
                paths: Qr([], m)
              }, v.push(h), v.forEach(function(k) {
                u.set(k, w);
              }), v = [];
            }
          }
          w ? (h = w.parentElement, u.get(h).indexes.push(f), m.push(h)) : v.push(h), h = h.parentElement;
        }; h && h !== c.body; )
          y();
        return m;
      });
    }
    return s.checkOverflow || (r.selectableInners = i.map(function() {
      return !0;
    })), this._refreshGroups(r), i;
  }, n.clickTarget = function(r, a) {
    var i = jb(r), o = i.clientX, s = i.clientY, l = {
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
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new Db(a || Le(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, n.setClassName = function(r) {
    this.options.className = r, this.target.setAttribute("class", "".concat(Is, " ").concat(r || ""));
  }, n.setKeyEvent = function() {
    var r = this.options, a = r.toggleContinueSelect, i = r.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, n.setKeyContainer = function(r) {
    var a = this, i = this.options;
    Fo(i.keyContainer, r, function() {
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
    Fo(i.toggleContinueSelect, r, function() {
      i.toggleContinueSelect = r, a.setKeyEvent();
    });
  }, n.setToggleContinueSelectWithoutDeselect = function(r) {
    var a = this, i = this.options;
    Fo(i.toggleContinueSelectWithoutDeselect, r, function() {
      i.toggleContinueSelectWithoutDeselect = r, a.setKeyEvent();
    });
  }, n.setPreventDefault = function(r) {
    this.gesto.options.preventDefault = r;
  }, n.setCheckInput = function(r) {
    this.gesto.options.checkInput = r;
  }, n.initElement = function() {
    var r = this.options, a = r.dragContainer, i = r.checkInput, o = r.preventDefault, s = r.preventClickEventOnDragStart, l = r.preventClickEventOnDrag, c = r.preventClickEventByCondition, u = r.preventRightClick, d = u === void 0 ? !0 : u, f = r.className, h = this.container;
    this.target = ih(Pb("div", {
      className: "".concat(Is, " ").concat(f || "")
    }), this.target, h);
    var v = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(Ke(h).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new Gf(this.dragContainer, {
      checkWindowBlur: !0,
      container: Le(h),
      checkInput: i,
      preventDefault: o,
      preventClickEventOnDragStart: s,
      preventClickEventOnDrag: l,
      preventClickEventByCondition: c,
      preventRightClick: d
    }).on({
      dragStart: this._onDragStart,
      drag: this._onDrag,
      dragEnd: this._onDragEnd
    }), ae(document, "selectstart", this._onDocumentSelectStart), this.injectResult = oh.inject(v, {
      nonce: this.options.cspNonce
    });
  }, n.hitTest = function(r, a, i, o) {
    var s = this.options, l = s.hitRate, c = s.selectByClick, u = r.left, d = r.top, f = r.right, h = r.bottom, v = a.innerGroups, m = a.innerWidth, y = a.innerHeight, w = o == null ? void 0 : o.clientX, S = o == null ? void 0 : o.clientY, C = a.ignoreClick, k = [[u, d], [f, d], [f, h], [u, h]], M = function(B, Y) {
      var V = qn(typeof l == "function" ? "".concat(l(Y)) : "".concat(l)), W = C ? !1 : Ci([w, S], B);
      if (!i && c && W)
        return !0;
      var tt = fs(k, B);
      if (!tt.length)
        return !1;
      var J = Vr(tt), rt = 0;
      if (J === 0 && Vr(B) === 0 ? (rt = ed(B), J = ed(tt)) : rt = Vr(B), V.unit === "px")
        return J >= V.value;
      var Q = wi(Math.round(J / rt * 100), 0, 100);
      return Q >= Math.min(100, V.value);
    }, E = a.selectableTargets, D = a.selectablePoints, _ = a.selectableInners;
    if (!v)
      return E.filter(function(B, Y) {
        return _[Y] ? M(D[Y], E[Y]) : !1;
      });
    for (var j = [], x = Math.floor(u / m), I = Math.floor(f / m), P = Math.floor(d / y), R = Math.floor(h / y), N = x; N <= I; ++N) {
      var F = v[N];
      if (F)
        for (var q = P; q <= R; ++q) {
          var z = F[q];
          z && z.forEach(function(B) {
            var Y = D[B], V = _[B], W = E[B];
            V && M(Y, W) && j.push(W);
          });
        }
    }
    return Ib(j);
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
        var d = r.gesto.getEventData().innerScrollOptions, f = d == null ? void 0 : d.container, h = !1;
        if (f) {
          var v = c.selectableInnerScrollParentMap, m = v.get(f);
          m && (m.paths.forEach(function(y) {
            var w = v.get(y);
            w.points.forEach(function(S) {
              S[0] -= i, S[1] -= o;
            });
          }), m.indexes.forEach(function(y) {
            c.selectablePoints[y].forEach(function(w) {
              w[0] -= i, w[1] -= o;
            });
          }), h = !0);
        }
        h || c.selectablePoints.forEach(function(y) {
          y.forEach(function(w) {
            w[0] -= i, w[1] -= o;
          });
        }), r._refreshGroups(c), u.left -= i, u.right -= i, u.top -= o, u.bottom -= o, r.gesto.scrollBy(i, o, s.inputEvent), r._checkSelected(r.gesto.getCurrentEvent());
      }
    });
  }, n._select = function(r, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = i.inputEvent, c = i.data, u = this.setSelectedTargets(r), d = or(c.startSelectedTargets, r), f = d.added, h = d.removed, v = d.prevList, m = d.list, y = {
      startSelected: v,
      startAdded: f.map(function(w) {
        return m[w];
      }),
      startRemoved: h.map(function(w) {
        return v[w];
      })
    };
    o && this.emit("selectStart", re(re(re({}, u), y), {
      rect: a,
      inputEvent: l,
      data: c.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    })), (u.added.length || u.removed.length) && this.emit("select", re(re(re({}, u), y), {
      rect: a,
      inputEvent: l,
      data: c.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    }));
  }, n._selectEnd = function(r, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = o.inputEvent, c = o.isDouble, u = o.data, d = l && l.type, f = d === "mousedown" || d === "touchstart", h = or(r, this.selectedTargets), v = h.added, m = h.removed, y = h.prevList, w = h.list, S = or(a, this.selectedTargets), C = S.added, k = S.removed, M = S.prevList, E = S.list;
    this.emit("selectEnd", {
      startSelected: r,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: v.map(function(D) {
        return w[D];
      }),
      removed: m.map(function(D) {
        return y[D];
      }),
      afterAdded: C.map(function(D) {
        return E[D];
      }),
      afterRemoved: k.map(function(D) {
        return M[D];
      }),
      isDragStart: f && s,
      isDragStartEnd: f && s,
      isClick: !!o.isClick,
      isDouble: !!c,
      rect: i,
      inputEvent: l,
      data: u.data,
      isTrusted: o.isTrusted
    });
  }, n._checkSelected = function(r, a) {
    a === void 0 && (a = Qu(r, this.options.ratio));
    var i = r.data, o = a.top, s = a.left, l = a.width, c = a.height, u = i.selectFlag, d = i.containerX, f = i.containerY, h = i.scaleMatrix, v = ui(h, [s - d, o - f]), m = ui(h, [l, c]), y = [];
    if (u) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(v[0], "px, ").concat(v[1], "px);") + "width:".concat(m[0], "px;height:").concat(m[1], "px;");
      var w = this.hitTest(a, i, !0, r);
      y = td(i.startPassedTargets, w, this.continueSelect && this.continueSelectWithoutDeselect);
    }
    var S = this.emit("drag", re(re({}, r), {
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
    var o = rh(r.inputEvent, r.key), s = [].concat(a), l = te(s[0]) ? s : [s];
    if (i) {
      var c = r.key;
      return l.some(function(u) {
        return u.some(function(d) {
          return d === c;
        });
      });
    }
    return l.some(function(u) {
      return u.every(function(d) {
        return o.indexOf(d) > -1;
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
      r.selectableInners = u.map(function(h, v) {
        var m = !1;
        return h.every(function(y) {
          if (m)
            return !0;
          if (y === l)
            return m = !0, !0;
          var w = c.get(y);
          if (w) {
            var S = s[v], C = w.points, k = fs(S, C);
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
      var d = r.selectablePoints, f = {};
      d.forEach(function(h, v) {
        var m = 1 / 0, y = -1 / 0, w = 1 / 0, S = -1 / 0;
        h.forEach(function(M) {
          var E = Math.floor(M[0] / i), D = Math.floor(M[1] / o);
          m = Math.min(E, m), y = Math.max(E, y), w = Math.min(D, w), S = Math.max(D, S);
        });
        for (var C = m; C <= y; ++C)
          for (var k = w; k <= S; ++k)
            f[C] = f[C] || {}, f[C][k] = f[C][k] || [], f[C][k].push(v);
      }), r.innerGroups = f;
    }
  }, e = _b([Hm(Al, function(r, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = as("get ".concat(a));
    r[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = as("set ".concat(a));
    r[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(r, a, i);
  })], e), e;
})(ha), Lb = /* @__PURE__ */ (function(t) {
  ah(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})(Ab), Rs = function(t, e) {
  return Rs = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(n, r) {
    n.__proto__ = r;
  } || function(n, r) {
    for (var a in r) Object.prototype.hasOwnProperty.call(r, a) && (n[a] = r[a]);
  }, Rs(t, e);
};
function zb(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Rs(t, e);
  function n() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (n.prototype = e.prototype, new n());
}
var Pi = function() {
  return Pi = Object.assign || function(e) {
    for (var n, r = 1, a = arguments.length; r < a; r++) {
      n = arguments[r];
      for (var i in n) Object.prototype.hasOwnProperty.call(n, i) && (e[i] = n[i]);
    }
    return e;
  }, Pi.apply(this, arguments);
};
function Fb(t, e, n, r) {
  var a = arguments.length, i = a < 3 ? e : r, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, n, r);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, n, i) : o(e, n)) || i);
  return a > 3 && i && Object.defineProperty(e, n, i), i;
}
var nd = sh.map(function(t) {
  return as("on ".concat(t));
}), Bb = /* @__PURE__ */ (function(t) {
  zb(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var n = e.prototype;
  return n.render = function() {
    return G.createElement("div", {
      className: Is,
      ref: Tn(this, "selectionElement")
    });
  }, n.componentDidMount = function() {
    var r = this, a = this.props, i = {};
    Nb.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new Lb(Pi(Pi({}, i), {
      portalContainer: this.selectionElement
    })), sh.forEach(function(o, s) {
      r.selecto.on(o, function(l) {
        var c = r.props, u = c[nd[s]] && c[nd[s]](l);
        u === !1 && l.stop();
      });
    });
  }, n.componentDidUpdate = function(r) {
    var a = this.props, i = this.selecto;
    Al.forEach(function(o) {
      r[o] !== a[o] && (i[o] = a[o]);
    });
  }, n.componentWillUnmount = function() {
    this.selecto.destroy();
  }, Fb([Mf(Ob)], e.prototype, "selecto", void 0), e;
})(G.PureComponent);
function ai(t, e, n) {
  const r = e + n;
  if (r < 0 || r >= t.length) return t.slice();
  const a = t.slice(), [i] = a.splice(e, 1);
  return a.splice(r, 0, i), a;
}
function Gb({ recipe: t, onChange: e }) {
  const { t: n } = Pt(), r = (u) => e({ ...t, ...u }), a = (u) => {
    var d;
    return ((d = t.display.find((f) => f.slot === u)) == null ? void 0 : d.name) ?? `#${u}`;
  }, i = (u) => {
    var d;
    return ((d = t.display.find((f) => f.slot === u)) == null ? void 0 : d.colour) ?? "#888";
  }, o = (u, d) => r({ columns: t.columns.map((f, h) => h === u ? { ...f, ...d } : f) }), s = new Set(t.columns.filter((u) => u.kind === "channel").map((u) => u.slot)), l = t.columns.some((u) => u.kind === "merge"), c = t.display.filter((u) => !s.has(u.slot));
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
    /* @__PURE__ */ g.jsx("ol", { className: "gl-cellpanel-list", "aria-label": n("Channels shown"), children: t.columns.map((u, d) => {
      var f;
      return /* @__PURE__ */ g.jsxs("li", { className: "gl-cellpanel-row" + (u.hidden ? " is-off" : ""), children: [
        /* @__PURE__ */ g.jsx(
          "input",
          {
            type: "checkbox",
            checked: !u.hidden,
            "aria-label": n("Show {column}", { column: u.header || a(u.slot ?? -1) }),
            title: n("Show this column"),
            disabled: !u.hidden && t.columns.filter((h) => !h.hidden).length <= 1,
            onChange: (h) => o(d, { hidden: !h.target.checked })
          }
        ),
        u.kind === "channel" && u.slot !== void 0 ? /* @__PURE__ */ g.jsx("span", { className: "gl-cell-chip", style: { background: u.grey ? "#bdbdbd" : i(u.slot) }, title: a(u.slot) }) : /* @__PURE__ */ g.jsx("span", { className: "gl-cellpanel-merge-mark", title: n("Merge"), children: "+" }),
        /* @__PURE__ */ g.jsx(
          "input",
          {
            className: "gl-cellpanel-text",
            value: u.header,
            "aria-label": n("Column name"),
            onChange: (h) => o(d, { header: h.target.value })
          }
        ),
        u.kind === "channel" && u.slot !== void 0 && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
          /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: n("Draw this channel in grey rather than its colour"), children: [
            /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: u.grey === !0, onChange: (h) => o(d, { grey: h.target.checked }) }),
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
              value: Math.log2(((f = t.gain) == null ? void 0 : f[u.slot]) ?? 1),
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
              onChange: (v) => {
                const m = new Set(u.slots ?? []);
                v.target.checked ? m.add(h.slot) : m.delete(h.slot), o(d, { slots: t.display.map((y) => y.slot).filter((y) => m.has(y)) });
              }
            }
          ),
          /* @__PURE__ */ g.jsx("span", { className: "gl-cell-chip", style: { background: h.colour } })
        ] }, h.slot)) }),
        /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Move up"), "aria-label": n("Move up"), disabled: d === 0, onClick: () => r({ columns: ai(t.columns, d, -1) }), children: /* @__PURE__ */ g.jsx(Tc, { size: 12 }) }),
        /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Move down"), "aria-label": n("Move down"), disabled: d === t.columns.length - 1, onClick: () => r({ columns: ai(t.columns, d, 1) }), children: /* @__PURE__ */ g.jsx(_c, { size: 12 }) }),
        u.kind === "merge" && /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Remove"), "aria-label": n("Remove"), onClick: () => r({ columns: t.columns.filter((h, v) => v !== d) }), children: /* @__PURE__ */ g.jsx(jc, { size: 12 }) })
      ] }, `${u.kind}-${u.slot ?? "m"}-${d}`);
    }) }),
    (c.length > 0 || !l) && /* @__PURE__ */ g.jsxs(
      "select",
      {
        className: "gl-cellpanel-add",
        value: "",
        "aria-label": n("Add a column"),
        onChange: (u) => {
          const d = u.target.value;
          if (d === "merge")
            r({ columns: [...t.columns, { kind: "merge", slots: t.display.filter((f) => f.enabled).map((f) => f.slot), header: n("Merge") }] });
          else if (d) {
            const f = Number(d);
            r({ columns: [...t.columns, { kind: "channel", slot: f, header: a(f) }] });
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
    /* @__PURE__ */ g.jsx("ol", { className: "gl-cellpanel-list", "aria-label": n("Cells shown"), children: t.cells.map((u, d) => /* @__PURE__ */ g.jsxs("li", { className: "gl-cellpanel-row", children: [
      /* @__PURE__ */ g.jsx(
        "input",
        {
          className: "gl-cellpanel-text",
          value: u.label,
          "aria-label": n("Label of event {index}", { index: u.event.toLocaleString() }),
          onChange: (f) => r({ cells: t.cells.map((h, v) => v === d ? { ...h, label: f.target.value } : h) })
        }
      ),
      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Move up"), "aria-label": n("Move up"), disabled: d === 0, onClick: () => r({ cells: ai(t.cells, d, -1) }), children: /* @__PURE__ */ g.jsx(Tc, { size: 12 }) }),
      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Move down"), "aria-label": n("Move down"), disabled: d === t.cells.length - 1, onClick: () => r({ cells: ai(t.cells, d, 1) }), children: /* @__PURE__ */ g.jsx(_c, { size: 12 }) }),
      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: n("Remove"), "aria-label": n("Remove"), disabled: t.cells.length <= 1, onClick: () => r({ cells: t.cells.filter((f, h) => h !== d) }), children: /* @__PURE__ */ g.jsx(jc, { size: 12 }) })
    ] }, `${u.event}-${d}`)) })
  ] });
}
const $b = "http://www.w3.org/2000/svg";
function Wb(t, e, n, r, a) {
  const i = e.querySelector("svg.gl-layout-shape > .gl-layout-shape-art");
  if (!i) return !1;
  const o = Number(e.dataset.zoom) || 1, s = document.createElementNS($b, "g");
  s.setAttribute("id", Bn("shape", r, a)), s.setAttribute("transform", `translate(${rd(n.left)},${rd(n.top)})${o === 1 ? "" : ` scale(${o})`}`);
  for (const l of [...i.children]) {
    const c = l.cloneNode(!0);
    c.removeAttribute("class"), s.appendChild(c);
  }
  return t.appendChild(s), !0;
}
const rd = (t) => Math.round(t * 1e3) / 1e3, ad = 8 * 1024 * 1024, Yb = ".svg,.png,.jpg,.jpeg,image/svg+xml,image/png,image/jpeg", Xb = "http://www.w3.org/2000/svg";
function Ps(t) {
  return t < 1024 ? `${t} B` : t < 1024 * 1024 ? `${Math.round(t / 1024)} KB` : `${(t / (1024 * 1024)).toFixed(1)} MB`;
}
function Hb(t) {
  return new TextEncoder().encode(t.content).length;
}
function Vb(t) {
  if (t.length >= 8 && t[0] === 137 && t[1] === 80 && t[2] === 78 && t[3] === 71 && t[4] === 13 && t[5] === 10 && t[6] === 26 && t[7] === 10) return "image/png";
  if (t.length >= 3 && t[0] === 255 && t[1] === 216 && t[2] === 255) return "image/jpeg";
  const e = new TextDecoder().decode(t.subarray(0, 4096));
  return /<svg[\s>]/i.test(e) ? "image/svg+xml" : null;
}
function Kb(t, e) {
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
const qb = { "": 1, px: 1, pt: 96 / 72, pc: 16, mm: 96 / 25.4, cm: 96 / 2.54, in: 96 };
function id(t) {
  const e = t == null ? void 0 : t.trim().match(/^([0-9]*\.?[0-9]+(?:e[-+]?\d+)?)\s*(px|pt|pc|mm|cm|in)?$/i);
  if (!e) return null;
  const n = Number(e[1]) * qb[(e[2] ?? "").toLowerCase()];
  return Number.isFinite(n) && n > 0 ? n : null;
}
function lh(t) {
  const e = (t.getAttribute("viewBox") ?? "").trim().split(/[\s,]+/).map(Number);
  return e.length === 4 && e.every(Number.isFinite) && e[2] > 0 && e[3] > 0 ? { width: e[2], height: e[3] } : null;
}
function ch(t) {
  const e = id(t.getAttribute("width")), n = id(t.getAttribute("height")), r = lh(t), a = (i) => Math.round(i * 100) / 100;
  return e && n ? { width: a(e), height: a(n) } : r && e ? { width: a(e), height: a(e * r.height / r.width) } : r && n ? { width: a(n * r.width / r.height), height: a(n) } : r ? { width: a(r.width), height: a(r.height) } : { width: e ?? 300, height: n ?? 150 };
}
function uh(t) {
  const e = new DOMParser().parseFromString(t, "image/svg+xml"), n = e.documentElement;
  return !n || n.localName !== "svg" || n.namespaceURI !== Xb || e.getElementsByTagName("parsererror").length ? null : n;
}
function Ub(t) {
  let e = "";
  for (let n = 0; n < t.length; n += 32768) e += String.fromCharCode(...t.subarray(n, n + 32768));
  return btoa(e);
}
async function Zb(t, e) {
  if (t.size > ad)
    return { error: e("{name} is {size}; a placed image can be at most {limit}.", { name: t.name, size: Ps(t.size), limit: Ps(ad) }) };
  const n = new Uint8Array(await t.arrayBuffer()), r = Vb(n);
  if (!r) return { error: e("{name} is not an SVG, PNG or JPEG file.", { name: t.name }) };
  const a = t.name || "image";
  if (r === "image/svg+xml") {
    const o = new TextDecoder().decode(n), s = uh(o);
    if (!s) return { error: e("{name} could not be read as SVG.", { name: t.name }) };
    const l = ch(s);
    return { recipe: { kind: "image", fileName: a, mediaType: r, naturalWidth: l.width, naturalHeight: l.height, content: o } };
  }
  const i = Kb(n, r);
  return i ? { recipe: { kind: "image", fileName: a, mediaType: r, naturalWidth: i.width, naturalHeight: i.height, content: `data:${r};base64,${Ub(n)}` } } : { error: e("{name} could not be read as {type}.", { name: t.name, type: r === "image/png" ? "PNG" : "JPEG" }) };
}
function Ll() {
  return new Promise((t) => {
    const e = document.createElement("input");
    e.type = "file", e.accept = Yb, e.addEventListener("change", () => {
      var n;
      return t(((n = e.files) == null ? void 0 : n[0]) ?? null);
    }, { once: !0 }), e.addEventListener("cancel", () => t(null), { once: !0 }), e.click();
  });
}
function Jb(t, e) {
  const n = ra(e), r = Yr(e.marginMm), a = { width: Math.max(1, n.width - 2 * r), height: Math.max(1, n.height - 2 * r) }, i = Math.min(1, a.width / t.naturalWidth, a.height / t.naturalHeight), o = (s) => Math.max(1, i < 1 ? Math.floor(s * i + 1e-6) : Math.round(s));
  return { width: o(t.naturalWidth), height: o(t.naturalHeight) };
}
const Qb = /* @__PURE__ */ new Set(["script", "foreignobject", "iframe", "object", "embed", "audio", "video", "handler", "listener", "set", "animate", "animatemotion", "animatetransform", "animatecolor"]), dh = /url\(\s*(['"]?)(?!\s*#|\s*data:image\/)[^)]*\1\s*\)/gi, t1 = (t) => /^\s*(#|data:image\/)/i.test(t);
function fh(t, e) {
  return t.replace(/url\(\s*(['"]?)#([^'")\s]+)\1\s*\)/g, (n, r, a) => e.has(a) ? `url(${r}#${e.get(a)}${r})` : n);
}
function e1(t, e, n) {
  const r = t.replace(/@import[^;]*;?/gi, "").replace(dh, "none");
  return fh(r, n).replace(/([^{}]*)\{/g, (a, i) => {
    var c;
    const o = i.trim();
    if (!o || o.startsWith("@")) return a;
    const s = i.replace(/#([A-Za-z_][\w-]*)/g, (u, d) => n.has(d) ? `#${n.get(d)}` : u);
    return e ? `${((c = i.match(/^\s*/)) == null ? void 0 : c[0]) ?? ""}${s.trim().split(",").map((u) => `#${e} ${u.trim()}`).join(", ")} {` : `${s}{`;
  });
}
function ph(t, e = {}) {
  const n = uh(t);
  if (!n) return null;
  for (const o of [...n.querySelectorAll("*")]) Qb.has(o.localName.toLowerCase()) && o.remove();
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
        if (!t1(s.value)) {
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
      /url\(/i.test(s.value) && (s.value = fh(s.value.replace(dh, "none"), a));
    }
    o.localName === "style" && (o.textContent = e1(o.textContent ?? "", e.scope, a));
  }
  const i = e.natural ?? ch(n);
  return lh(n) || n.setAttribute("viewBox", `0 0 ${i.width} ${i.height}`), n.setAttribute("preserveAspectRatio", "none"), e.scope && n.setAttribute("id", e.scope), n;
}
function n1(t) {
  if (t.mediaType !== "image/svg+xml") return t.content;
  const e = ph(t.content, { natural: { width: t.naturalWidth, height: t.naturalHeight } });
  return e ? (e.setAttribute("width", String(t.naturalWidth)), e.setAttribute("height", String(t.naturalHeight)), `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(e))}`) : "";
}
function r1(t) {
  const e = "data:image/svg+xml;charset=utf-8,";
  if (!t.startsWith(e)) return null;
  try {
    return decodeURIComponent(t.slice(e.length));
  } catch {
    return null;
  }
}
function Ns(t) {
  const e = Number(t.dataset.rotation);
  return e === 90 || e === 180 || e === 270 ? e : 0;
}
function hh(t, e, n) {
  if (!n) return t;
  const r = e.left + e.width / 2, a = e.top + e.height / 2, i = t.left + t.width / 2 - r, o = t.top + t.height / 2 - a, [s, l] = n === 90 ? [o, -i] : n === 180 ? [-i, -o] : [-o, i], c = n !== 180, u = c ? t.height : t.width, d = c ? t.width : t.height;
  return { left: r + s - u / 2, top: a + l - d / 2, width: u, height: d };
}
function gh(t, e, n) {
  n && t.setAttribute("transform", `rotate(${n} ${od(e.left + e.width / 2)} ${od(e.top + e.height / 2)})`);
}
const od = (t) => Math.round(t * 1e3) / 1e3, sd = "http://www.w3.org/2000/svg";
function a1(t, e, n, r) {
  const a = e.querySelector("img.gl-layout-placed-image");
  if (!a) return !1;
  const i = a.getAttribute("src") ?? "", o = document.createElementNS(sd, "g");
  o.setAttribute("id", r);
  const s = Ns(e);
  gh(o, n, s);
  const l = hh(n, n, s), c = (d) => {
    d.setAttribute("x", String(ii(l.left))), d.setAttribute("y", String(ii(l.top))), d.setAttribute("width", String(ii(l.width))), d.setAttribute("height", String(ii(l.height))), o.appendChild(d);
  }, u = r1(i);
  if (u !== null) {
    const d = ph(u, { idPrefix: `${r}-`, scope: `${r}-art` });
    d && c(document.importNode(d, !0));
  } else if (/^data:image\/(png|jpeg);base64,/.test(i)) {
    const d = document.createElementNS(sd, "image");
    d.setAttribute("href", i), d.setAttribute("preserveAspectRatio", "none"), c(d);
  }
  return t.appendChild(o), !0;
}
const ii = (t) => Math.round(t * 1e3) / 1e3, ld = "http://www.w3.org/2000/svg";
function i1(t, e) {
  return !!t.querySelector("b, i, sup, sub") || e.fontStyle === "italic" || e.textAlign === "center" || e.textAlign === "right";
}
function cd(t) {
  const e = [], n = (r) => {
    var a;
    for (const i of Array.from(r.childNodes))
      if (i.nodeType === 3) {
        const o = i, s = sf(o, t);
        for (let l = 0; l < o.data.length; l++) e.push({ ch: o.data[l], node: o, index: l, run: { ...s, text: o.data[l] } });
      } else i.nodeName === "BR" ? !((a = i.dataset) != null && a.tail) && (i.nextSibling || i.parentNode !== t) && e.push({ ch: `
`, node: null, index: 0, run: { text: `
` } }) : n(i);
  };
  return n(t), e;
}
function o1(t, e, n) {
  const r = t instanceof HTMLTextAreaElement ? null : t, a = () => {
    const l = r ? cd(r) : [...t.value].map((u) => ({ run: { text: u } })), c = [{ runs: [], left: 0, top: 0 }];
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
    for (const d of cd(s)) {
      if (d.ch === `
` || !d.node) {
        u = !0;
        continue;
      }
      i.setStart(d.node, d.index), i.setEnd(d.node, d.index + 1);
      const f = i.getBoundingClientRect();
      if (!f.width && !f.height) continue;
      const h = f.top - l.top, v = h + f.height / 2, m = c.at(-1), y = d.run.sup || d.run.sub;
      m && !u && v < m.bottom ? (m.runs.push(d.run), !y && m.runs.every((w) => w === d.run || w.sup || w.sub) && (m.top = h, m.bottom = h + f.height)) : c.push({ runs: [d.run], left: f.left - l.left, top: h, bottom: h + f.height }), u = !1;
    }
    return c.length ? c : a();
  } finally {
    s.remove();
  }
}
function s1(t, e, n, r) {
  const a = getComputedStyle(e);
  if (!i1(e, a)) return !1;
  const i = (parseFloat(a.fontSize) || 14) * r, o = (parseFloat(a.paddingLeft) || 0) * r, s = (parseFloat(a.paddingRight) || 0) * r, l = (parseFloat(a.paddingTop) || 0) * r, c = n.left + o, u = Math.max(0, n.width - o - s), d = a.textAlign === "center" ? "middle" : a.textAlign === "right" ? "end" : "start", f = a.fontWeight || "400";
  for (const h of o1(e, a, i / r)) {
    const v = Er(h.runs);
    for (; v.length && /\s$/.test(v[v.length - 1].text); ) {
      const w = v[v.length - 1];
      w.text = w.text.replace(/\s+$/, ""), w.text || v.pop();
    }
    if (!v.length) continue;
    const m = document.createElementNS(ld, "text");
    m.setAttribute("x", String(d === "middle" ? c + u / 2 : d === "end" ? c + u : c + h.left * r)), m.setAttribute("y", String(n.top + l + h.top * r + i * 0.82)), m.setAttribute("font-size", String(i)), m.setAttribute("font-family", a.fontFamily || zd), m.setAttribute("font-weight", f), a.fontStyle === "italic" && m.setAttribute("font-style", "italic"), d !== "start" && m.setAttribute("text-anchor", d), m.setAttribute("fill", a.color || "#1e293b"), m.setAttribute("xml:space", "preserve");
    let y = 0;
    for (const w of v) {
      const S = document.createElementNS(ld, "tspan");
      w.bold && S.setAttribute("font-weight", "700"), w.italic && S.setAttribute("font-style", "italic");
      const C = w.sup ? -0.33 * i : w.sub ? Kv * i : 0;
      C !== y && S.setAttribute("dy", String(+(C - y).toFixed(3))), y = C, (w.sup || w.sub) && S.setAttribute("font-size", String(+(i * Vv).toFixed(3))), S.textContent = w.text, m.appendChild(S);
    }
    t.appendChild(m);
  }
  return !0;
}
function l1(t, e) {
  const n = Tg(t ?? "");
  if (!n) return null;
  const r = /^[A-Za-z_]/.test(n) ? n : `_${n}`;
  let a = r;
  for (let i = 2; e.has(a); i++) a = `${r}-${i}`;
  return e.add(a), a;
}
const Ve = "http://www.w3.org/2000/svg";
function oi(t, e) {
  const n = URL.createObjectURL(t), r = document.createElement("a");
  r.href = n, r.download = e, document.body.appendChild(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
function Hn(t, e, n, r = { x: 0, y: 0 }) {
  const a = t.getBoundingClientRect();
  return {
    left: (a.left - e.left) / n - r.x,
    top: (a.top - e.top) / n - r.y,
    width: a.width / n,
    height: a.height / n
  };
}
function ud(t, e, n, r, a, i) {
  e.forEach((o) => {
    if (!o.text) return;
    const s = document.createElementNS(Ve, "text");
    s.setAttribute("x", String(n + o.left)), s.setAttribute("y", String(r + o.top + a * 0.82)), s.setAttribute("font-size", String(a)), s.setAttribute("font-family", i.fontFamily || zd), s.setAttribute("font-weight", i.fontWeight || "400"), s.setAttribute("fill", i.color || "#1e293b"), s.setAttribute("xml:space", "preserve"), s.textContent = o.text, t.appendChild(s);
  });
}
function c1(t, e) {
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
      const d = u.top - s.top, f = l.at(-1);
      f && Math.abs(f.top - d) < 1 ? f.text += e[c] : l.push({ text: e[c], left: u.left - s.left, top: d });
    }
    return l.length ? l : null;
  } finally {
    i.remove();
  }
}
function dd(t, e, n, r, a, i, o) {
  const s = Hn(e, n, r, i), l = document.createElementNS(Ve, "g");
  l.setAttribute("transform", `translate(${Math.round(s.left)},${Math.round(s.top)})`);
  const c = e.querySelector("canvas");
  if (c) {
    const d = document.createElementNS(Ve, "image"), f = Hn(c, n, r, i);
    d.setAttribute("x", "0"), d.setAttribute("y", "0"), d.setAttribute("width", String(Math.round(f.width || s.width))), d.setAttribute("height", String(Math.round(f.height || s.height))), d.setAttribute("href", Ig(e, a, Math.round(f.width || s.width)) ?? c.toDataURL("image/png")), l.appendChild(d);
  }
  const u = e.querySelector("svg");
  if (u) {
    const d = u.cloneNode(!0), f = u.clientWidth || Number(u.getAttribute("width")) || s.width, h = f > 0 ? s.width / f : 1;
    if (Math.abs(h - 1) > 1e-3) {
      const v = document.createElementNS(Ve, "g");
      v.setAttribute("transform", `scale(${h})`), v.appendChild(d), l.appendChild(v);
    } else l.appendChild(d);
  }
  Gd(l, o), t.appendChild(l);
}
function fd(t, e, n, r) {
  return [...t.querySelectorAll(".gl-layout-item")].sort((a, i) => (Number(a.style.zIndex) || 0) - (Number(i.style.zIndex) || 0)).map((a) => ({ item: a, frame: Hn(a, e, n, r) }));
}
function u1(t, e, n, r) {
  let a = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const { frame: d } of t)
    d.left >= e || d.top >= n || d.left + d.width <= 0 || d.top + d.height <= 0 || (a = Math.min(a, d.left), i = Math.min(i, d.top), o = Math.max(o, d.left + d.width), s = Math.max(s, d.top + d.height));
  if (!Number.isFinite(a)) return null;
  const l = Math.max(0, r) * Kn, c = Math.max(0, Math.floor(a - l)), u = Math.max(0, Math.floor(i - l));
  return { x: c, y: u, width: Math.min(e, Math.ceil(o + l)) - c, height: Math.min(n, Math.ceil(s + l)) - u };
}
function d1(t, e, n) {
  var m, y;
  const r = ra(e.page), a = aa(e.page)[n.pageIndex ?? 0] ?? { x: 0, y: 0 }, i = t.getBoundingClientRect(), o = n.crop ? u1(fd(t, i, n.zoom, a), r.width, r.height, n.crop.paddingMm) : null, s = o ? { x: a.x + o.x, y: a.y + o.y } : a, l = o ? o.width : r.width, c = o ? o.height : r.height, u = document.createElementNS(Ve, "svg");
  u.setAttribute("xmlns", Ve), u.setAttribute("width", String(l)), u.setAttribute("height", String(c)), u.setAttribute("viewBox", `0 0 ${l} ${c}`);
  const d = document.createElementNS(Ve, "rect");
  d.setAttribute("width", "100%"), d.setAttribute("height", "100%"), d.setAttribute("fill", "#ffffff"), u.appendChild(d);
  let f = 0;
  const h = /* @__PURE__ */ new Set();
  for (const { item: w, frame: S } of fd(t, i, n.zoom, s)) {
    if (S.left >= l || S.top >= c || S.left + S.width <= 0 || S.top + S.height <= 0) continue;
    f += 1;
    const C = w.dataset.title ?? ((m = w.querySelector(".gl-layout-item-head span")) == null ? void 0 : m.textContent) ?? "";
    if (Wb(u, w, S, f, C)) continue;
    const k = l1(w.dataset.objectName, h);
    if (w.classList.contains("has-frame")) {
      const j = document.createElementNS(Ve, "rect");
      j.setAttribute("x", String(Math.round(S.left) + 0.5)), j.setAttribute("y", String(Math.round(S.top) + 0.5)), j.setAttribute("width", String(Math.round(S.width) - 1)), j.setAttribute("height", String(Math.round(S.height) - 1)), j.setAttribute("fill", "none"), j.setAttribute("stroke", "#94a3b8"), j.setAttribute("id", Bn("frame", f, C)), u.appendChild(j);
    }
    if (a1(u, w, S, k ?? Bn("image", f, C))) continue;
    const M = w.querySelector(".gl-layout-text-surface");
    if (M) {
      const j = M instanceof HTMLTextAreaElement ? M.value : M.textContent ?? "", x = getComputedStyle(M), I = hh(Hn(M, i, n.zoom, s), S, Ns(w)), P = Number(w.dataset.zoom) || 1, R = (parseFloat(x.fontSize) || 14) * P, N = (parseFloat(x.paddingLeft) || 0) * P, F = (parseFloat(x.paddingTop) || 0) * P, q = ((y = c1(M, j)) == null ? void 0 : y.map((B) => ({ text: B.text, left: B.left * P, top: B.top * P }))) ?? j.split(`
`).map((B, Y) => ({ text: B, left: 0, top: Y * R * 1.3 })), z = document.createElementNS(Ve, "g");
      z.setAttribute("id", k ?? Bn("text", f, j.trim().split(/\s+/).slice(0, 4).join(" "))), gh(z, S, Ns(w)), s1(z, M, I, P) || ud(z, q, I.left + N, I.top + F, R, x), u.appendChild(z);
      continue;
    }
    const E = w.querySelector(".gl-layout-plot-host");
    if (!E) continue;
    if (E.__miniPlotCfg) {
      dd(u, E, i, n.zoom, n.dpi, s, k ?? Bn("plot", f, C));
      continue;
    }
    const D = E.querySelector(".gl-prop-chart");
    if (D) {
      const j = _g(D);
      if (j) {
        const x = Hn(D, i, n.zoom, s), I = j.width > 0 ? x.width / j.width : 1, P = document.createElementNS(Ve, "g");
        P.setAttribute("id", k ?? Bn("chart", f, C)), P.setAttribute("transform", `translate(${x.left},${x.top}) scale(${I})`), P.appendChild(j.root), u.appendChild(P);
      }
      continue;
    }
    E.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((j) => {
      const x = (j.textContent ?? "").trim();
      if (!x) return;
      const I = getComputedStyle(j), P = Hn(j, i, n.zoom, s), R = j.offsetWidth > 0 ? P.width / j.offsetWidth : 1;
      ud(u, [{ text: x, left: 0, top: 0 }], P.left, P.top, (parseFloat(I.fontSize) || 12) * R, I);
    });
    const _ = k ?? Bn(E.querySelector(".gl-figure-grid") ? "figure" : "strategy", f, C);
    E.querySelectorAll(".mini-plot-cell").forEach((j, x) => dd(u, j, i, n.zoom, n.dpi, s, `${_}-panel-${x + 1}`)), E.querySelectorAll("svg.gl-strategy-arrows").forEach((j) => {
      const x = Hn(j, i, n.zoom, s), I = Number(j.getAttribute("width")) || j.clientWidth || x.width, P = I > 0 ? x.width / I : 1, R = document.createElementNS(Ve, "g");
      R.setAttribute("transform", `translate(${Math.round(x.left)},${Math.round(x.top)}) scale(${P})`), Array.from(j.childNodes).forEach((N) => R.appendChild(N.cloneNode(!0))), Gd(R, `${_}-arrows`), u.appendChild(R);
    });
  }
  const v = o ? { widthMm: l / Kn, heightMm: c / Kn } : $d(e.page);
  return jg(u, { widthPx: l, heightPx: c, ...v }), { root: u, width: l, height: c, ...v };
}
function pd(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
function vh(t, e, n) {
  return aa(e.page).map((r, a) => d1(t, e, { dpi: e.page.dpi, zoom: n.zoom, pageIndex: a, crop: n.crop }));
}
const hd = 72 / 25.4;
function gd(t, e, n, r) {
  const a = e.label ? pi(e.label) : "";
  return `${t}-p${n + 1}${a ? `-${a}` : ""}.${r}`;
}
async function f1(t, e, n) {
  const r = e.page.dpi, a = pi(e.name) || "layout";
  if (!t.length) return;
  if (n === "svg") {
    if (t.length === 1) {
      oi(new Blob([pd(t[0].root)], { type: "image/svg+xml" }), `${a}.svg`);
      return;
    }
    const c = {};
    t.forEach((u, d) => {
      c[gd(a, u, d, "svg")] = Fd(pd(u.root));
    }), oi(new Blob([Ko(c)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  if (n === "png") {
    if (t.length === 1) {
      oi(await qo(await Xr(t[0], r), r), `${a}.png`);
      return;
    }
    const c = {};
    for (const [u, d] of t.entries()) {
      const f = await Xr(d, r);
      c[gd(a, t[u], u, "png")] = new Uint8Array(await (await qo(f, r)).arrayBuffer()), await hi();
    }
    oi(new Blob([Ko(c)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const i = (c) => {
    const u = c.widthMm * hd, d = c.heightMm * hd;
    return { width: u, height: d, orientation: u >= d ? "landscape" : "portrait" };
  }, { jsPDF: o } = await import("./jspdf.es.min-BVIPXLY0.js").then((c) => c.j), s = i(t[0]), l = new o({ orientation: s.orientation, unit: "pt", format: [s.width, s.height], compress: !0 });
  for (const [c, u] of t.entries()) {
    const { width: d, height: f, orientation: h } = i(u);
    if (c > 0 && l.addPage([d, f], h), !await Bd(l, u.root, { width: d, height: f })) {
      const v = await Xr(u, r);
      l.addImage(v, "PNG", 0, 0, d, f, void 0, "FAST");
    }
    await hi();
  }
  l.save(`${a}.pdf`);
}
const p1 = 20;
function h1(t) {
  if (!(t.metaKey || t.ctrlKey) || t.altKey) return null;
  const e = t.key.toLowerCase();
  return e === "c" && !t.shiftKey ? "copy" : e === "x" && !t.shiftKey ? "cut" : e === "v" ? t.shiftKey ? "paste-in-place" : "paste" : null;
}
function g1(t, e) {
  const n = t.items.filter((r) => e.includes(r.id)).sort((r, a) => r.z - a.z);
  return n.length ? { sheetId: t.id, items: structuredClone(n), pastes: {} } : null;
}
function v1(t, e, n, r) {
  const a = t.id === e.sheetId, i = e.pastes[t.id] ?? 0, { copies: o } = gi(e.items, r);
  let s = 0, l = 0;
  if (!n) {
    const f = (a ? i + 1 : i) * p1, h = a ? { dx: 0, dy: 0 } : x1(t, e.items);
    s = h.dx + f, l = h.dy + f;
  }
  const c = a ? o.map((f) => f.recipe) : Wd(t, o.map(({ recipe: f }) => {
    if (!qt(f) || !("iterated" in f)) return f;
    const { iterated: h, ...v } = f;
    return v;
  }));
  let u = Math.max(0, ...t.items.map((f) => f.z));
  const d = o.map((f, h) => (t.items.push({ ...f, recipe: c[h], x: f.x + s, y: f.y + l, z: ++u }), f.id));
  return Yd(t), {
    created: d,
    clipboard: n ? e : { ...e, pastes: { ...e.pastes, [t.id]: i + 1 } }
  };
}
function m1({ sheet: t, mutateActiveSheet: e, removeItems: n, selectMany: r }) {
  const [a, i] = Rg("layout.clipboard", null), o = (u) => {
    const d = t ? g1(t, u) : null;
    return d && i(d), d !== null;
  }, s = (u) => {
    o(u) && n(u);
  }, l = (u) => {
    if (!a) return;
    let d = null;
    e((h) => {
      d = v1(h, a, u);
    });
    const f = d;
    f && (i(f.clipboard), r(f.created));
  };
  return { canPaste: a !== null, copy: o, cut: s, paste: l, run: (u, d) => {
    u === "copy" ? o(d) : u === "cut" ? s(d) : l(u === "paste-in-place");
  } };
}
function x1(t, e) {
  const { width: n, height: r } = Pg(t.page), a = Math.min(...e.map((c) => c.x)), i = Math.min(...e.map((c) => c.y)), o = Math.max(...e.map((c) => c.x + c.width)), s = Math.max(...e.map((c) => c.y + c.height)), l = (c, u, d) => c < 0 || u - c > d ? -c : u > d ? d - u : 0;
  return { dx: l(a, o, n), dy: l(i, s, r) };
}
function y1(t, e, n, r) {
  try {
    const a = Ng(t, e, n).figure;
    return a ? Xd(a, e, Dn(n), void 0, r).map((i) => i.label) : [];
  } catch {
    return [];
  }
}
function b1({
  recipe: t,
  files: e,
  state: n,
  columnLevels: r,
  onChange: a
}) {
  const { t: i } = Pt(), o = G.useMemo(() => y1(t, e, n, r), [t, e, n, r]);
  return o.length <= 1 ? null : /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: i("The page of the figure this block draws"), children: [
    i("Page"),
    /* @__PURE__ */ g.jsx("select", { "aria-label": i("Page"), value: Math.min(t.page, o.length - 1), onChange: (s) => a(Number(s.target.value)), children: o.map((s, l) => /* @__PURE__ */ g.jsx("option", { value: l, children: s || i("Page {n}", { n: l + 1 }) }, l)) })
  ] });
}
function w1(t, e, n, r, a, i, o) {
  const s = t.settings, { model: l, cellModel: c, channels: u } = Gs(s, e, n, r, a, i), d = Uo(e), f = { groups: Ag(s, d, r, o), facets: Og(s, d, r, o) }, h = u.length > 1 ? u.map((w) => w.key) : void 0, v = Lg({ ...s, ...h ? { channels: h } : {} }, c ? null : l, c, f), m = Hd(s, c ? c.hasFacet : l.hasFacet), y = { group: pr(s.groupSel), facet: pr(s.facetSel), channels: Object.fromEntries(u.map((w) => [w.key, w.label])) };
  return v.map((w) => ({ page: w, label: m ? Vd({ facet: w, group: w, population: w, channel: w }, m, y) : w }));
}
function S1({
  recipe: t,
  samples: e,
  state: n,
  metadataById: r,
  divisionProfiles: a,
  dataRevision: i = "",
  metadataLevels: o,
  onChange: s
}) {
  const { t: l } = Pt(), c = !t.panel || Ic(t.panel), u = G.useMemo(
    () => c ? w1(t, e, n, r, a, i, o) : [],
    [c, t, e, n, r, a, i, o]
  );
  if (u.length <= 1) return null;
  const d = Ic(t.panel) ? u.findIndex((f) => f.page === t.panel.page) : -1;
  return /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: l("The page of the chart this block draws, or the whole chart"), children: [
    l("Page"),
    /* @__PURE__ */ g.jsxs("select", { "aria-label": l("Page"), value: d < 0 ? "" : String(d), onChange: (f) => s(f.target.value === "" ? void 0 : { page: u[Number(f.target.value)].page }), children: [
      /* @__PURE__ */ g.jsx("option", { value: "", children: l("Whole chart") }),
      u.map((f, h) => /* @__PURE__ */ g.jsx("option", { value: h, children: f.label }, f.page))
    ] })
  ] });
}
function Cr(t) {
  return Math.round(t * 100) / 100;
}
function Ni(t, e) {
  return e === "mm" ? Math.round(t / Kn * 10) / 10 : Cr(t);
}
function Oi(t, e) {
  return Cr(e === "mm" ? t * Kn : t);
}
function C1(t, e, n, r) {
  if (e === "x" || e === "y") return { [e]: Math.max(0, n) };
  const a = $s(t.recipe.kind), i = Math.max(a[e], n);
  if (!r || t.width <= 0 || t.height <= 0) return { [e]: i };
  if (e === "width") {
    const s = Cr(Math.max(a.height, i * t.height / t.width));
    return { width: i, height: s };
  }
  return { width: Cr(Math.max(a.width, i * t.width / t.height)), height: i };
}
function Ki(t, e) {
  return t.items.filter((n) => e.includes(n.id) && !n.locked && !fe(n));
}
function k1(t, e) {
  const n = t.items.filter((i) => e.includes(i.id) && !fe(i));
  if (n.length < 2) return null;
  const r = Vn(n), a = (i) => Math.hypot(i.x - r.x, i.y - r.y);
  return [...n].sort((i, o) => a(i) - a(o) || i.y - o.y || i.x - o.x)[0];
}
function E1(t, e, n) {
  const r = k1(t, e);
  if (!r) return null;
  for (const a of Ki(t, e)) {
    if (a.id === r.id) continue;
    const i = $s(a.recipe.kind);
    n !== "height" && (a.width = Math.max(i.width, r.width)), n !== "width" && (a.height = Math.max(i.height, r.height));
  }
  return r.id;
}
function M1(t) {
  return Math.max(1, Math.ceil(Math.sqrt(Math.max(1, t))));
}
function vd(t, e) {
  return Ai(Ki(t, e)).length;
}
function Os(t, e, n) {
  for (const r of t)
    r.x = Cr(r.x + e), r.y = Cr(r.y + n);
}
function D1(t, e, n) {
  const r = Ai(Ki(t, e)).map((v, m) => ({ unit: v, ...Vn(v), id: String(m) }));
  if (r.length < 2) return;
  const a = lf(r), i = Math.max(1, Math.min(a.length, Math.round(n.columns))), o = Math.ceil(a.length / i), s = Math.max(0, n.gapPx), l = (v) => n.order === "across" ? { row: Math.floor(v / i), column: v % i } : { row: v % o, column: Math.floor(v / o) }, c = new Array(i).fill(0), u = new Array(o).fill(0);
  a.forEach((v, m) => {
    const { row: y, column: w } = l(m);
    c[w] = Math.max(c[w], v.width), u[y] = Math.max(u[y], v.height);
  });
  const d = Vn(r), f = (v) => d.x + c.slice(0, v).reduce((m, y) => m + y + s, 0), h = (v) => d.y + u.slice(0, v).reduce((m, y) => m + y + s, 0);
  a.forEach((v, m) => {
    const { row: y, column: w } = l(m);
    Os(v.unit, f(w) - v.x, h(y) - v.y);
  });
}
function T1(t, e, n, r) {
  const a = Ai(Ki(t, e)).map((l) => ({ unit: l, bounds: Vn(l) }));
  if (a.length < 2) return;
  const i = r === "across", o = [...a].sort((l, c) => i ? l.bounds.x - c.bounds.x || l.bounds.y - c.bounds.y : l.bounds.y - c.bounds.y || l.bounds.x - c.bounds.x);
  let s = i ? o[0].bounds.x + o[0].bounds.width : o[0].bounds.y + o[0].bounds.height;
  for (const { unit: l, bounds: c } of o.slice(1)) {
    const u = s + Math.max(0, n);
    i ? Os(l, u - c.x, 0) : Os(l, 0, u - c.y), s = u + (i ? c.width : c.height);
  }
}
function _1() {
  const [t, e] = G.useState("mm"), [n, r] = G.useState(!1), [a, i] = G.useState(4);
  return { unit: t, setUnit: e, keepRatio: n, setKeepRatio: r, gapMm: a, setGapMm: i };
}
const j1 = { x: "X", y: "Y", width: "Width", height: "Height" };
function I1({
  item: t,
  prefs: e,
  onCommit: n
}) {
  const { t: r } = Pt(), { unit: a, setUnit: i, keepRatio: o, setKeepRatio: s } = e, l = $s(t.recipe.kind), c = (u) => /* @__PURE__ */ g.jsxs("label", { children: [
    r(j1[u]),
    " (",
    a,
    ")",
    /* @__PURE__ */ g.jsx(
      ie,
      {
        "aria-label": `Item ${u}`,
        min: u === "width" || u === "height" ? Ni(l[u], a) : 0,
        step: a === "mm" ? 0.1 : 1,
        value: Ni(t[u], a),
        onCommit: (d) => n(C1(t, u, Oi(d, a), o))
      }
    )
  ] }, u);
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-dimensions", children: [
      c("x"),
      c("y"),
      c("width"),
      c("height")
    ] }),
    /* @__PURE__ */ g.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: r("Typing a width sets the height to keep the item's proportions, and the reverse; dragging a handle keeps them too, and Shift frees them"), children: [
        /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: o, onChange: (u) => s(u.target.checked) }),
        r("Keep proportions")
      ] }),
      /* @__PURE__ */ g.jsx("span", { role: "group", "aria-label": r("Unit"), style: { display: "inline-flex", gap: 2 }, children: ["mm", "px"].map((u) => /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", "aria-pressed": a === u, onClick: () => i(u), title: r("Show X, Y, width and height in {unit}", { unit: u }), children: u }, u)) })
    ] })
  ] });
}
function mh({
  label: t,
  title: e,
  disabled: n,
  dialogLabel: r,
  children: a
}) {
  const [i, o] = G.useState(!1), s = G.useRef(null);
  return G.useEffect(() => {
    if (!i) return;
    const l = (u) => {
      s.current && !s.current.contains(u.target) && o(!1);
    }, c = (u) => {
      u.key === "Escape" && o(!1);
    };
    return document.addEventListener("mousedown", l), document.addEventListener("keydown", c), () => {
      document.removeEventListener("mousedown", l), document.removeEventListener("keydown", c);
    };
  }, [i]), G.useEffect(() => {
    n && o(!1);
  }, [n]), /* @__PURE__ */ g.jsxs("span", { ref: s, style: { position: "relative", display: "inline-flex" }, children: [
    /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", "aria-expanded": i, disabled: n, onClick: () => o((l) => !l), title: e, children: t }),
    i && /* @__PURE__ */ g.jsx("div", { className: "gl-menu-popover", role: "dialog", "aria-label": r, style: { display: "grid", gap: 6, padding: 8, minWidth: 200 }, children: a(() => o(!1)) })
  ] });
}
function xh({ prefs: t }) {
  const { t: e } = Pt();
  return /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
    e("Gap (mm)"),
    /* @__PURE__ */ g.jsx(ie, { "aria-label": e("Gap (mm)"), min: 0, max: 500, step: 0.5, value: t.gapMm, onCommit: t.setGapMm })
  ] });
}
function R1({
  itemCount: t,
  unitCount: e,
  prefs: n,
  onMatch: r,
  onGrid: a
}) {
  const { t: i } = Pt(), o = i("the item nearest the top left of the selection"), s = [
    { how: "width", label: i("Match width"), title: i("Give each selected item the width of {reference}, keeping each top-left corner; locked items are not changed", { reference: o }) },
    { how: "height", label: i("Match height"), title: i("Give each selected item the height of {reference}, keeping each top-left corner; locked items are not changed", { reference: o }) },
    { how: "size", label: i("Match size"), title: i("Give each selected item the width and height of {reference}, keeping each top-left corner; locked items are not changed", { reference: o }) }
  ];
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions", children: [
    s.map(({ how: l, label: c, title: u }) => /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", disabled: t < 2, onClick: () => r(l), title: u, children: c }, l)),
    /* @__PURE__ */ g.jsx(
      mh,
      {
        label: i("Arrange in grid…"),
        dialogLabel: i("Arrange in grid"),
        title: i("Place the selected items in a grid in reading order, from the selection's top-left corner; locked items stay where they are"),
        disabled: e < 2,
        children: (l) => /* @__PURE__ */ g.jsx(P1, { count: e, prefs: n, onApply: (c) => {
          a(c), l();
        } }, e)
      }
    )
  ] });
}
function P1({ count: t, prefs: e, onApply: n }) {
  const { t: r } = Pt(), [a, i] = G.useState(M1(t)), [o, s] = G.useState("across");
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      r("Columns"),
      /* @__PURE__ */ g.jsx(ie, { "aria-label": r("Columns"), integer: !0, min: 1, max: Math.max(1, t), value: a, onCommit: i })
    ] }),
    /* @__PURE__ */ g.jsx(xh, { prefs: e }),
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
function N1({
  unitCount: t,
  disabled: e,
  prefs: n,
  onSpace: r
}) {
  const { t: a } = Pt(), [i, o] = G.useState("across");
  return /* @__PURE__ */ g.jsx(
    mh,
    {
      label: a("Space…"),
      dialogLabel: a("Space at a gap"),
      title: a("Space two or more items or groups at a typed gap; the first stays and each next one is put after the one before"),
      disabled: e || t < 2,
      children: (s) => /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
        /* @__PURE__ */ g.jsx(xh, { prefs: n }),
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
function O1({
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
  const { t: l } = Pt(), c = G.useRef(null), [u, d] = G.useState(r || ((S = n[0]) == null ? void 0 : S.popId) || ""), [f, h] = G.useState("percent_of_parent"), [v, m] = G.useState(a[0] ?? "");
  G.useEffect(() => {
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
  const y = Math.max(4, Math.min(t, window.innerWidth - 260)), w = Math.max(4, Math.min(e, window.innerHeight - 200));
  return /* @__PURE__ */ g.jsxs(
    "div",
    {
      ref: c,
      className: "gl-menu-popover gl-layout-chart-start",
      role: "dialog",
      "aria-label": l("New chart"),
      style: { position: "fixed", left: y, top: w, display: "grid", gap: 6, padding: 8, zIndex: 50 },
      children: [
        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
          l("Population"),
          /* @__PURE__ */ g.jsx("select", { "aria-label": l("Population"), value: u, onChange: (C) => d(C.target.value), children: n.map(({ popId: C, depth: k, name: M }) => /* @__PURE__ */ g.jsxs("option", { value: C, children: [
            " ".repeat(k * 2),
            M
          ] }, C)) })
        ] }),
        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
          l("Statistic"),
          /* @__PURE__ */ g.jsxs("select", { "aria-label": l("Statistic"), value: f, onChange: (C) => h(C.target.value), children: [
            /* @__PURE__ */ g.jsx("option", { value: "percent_of_parent", children: l("% of parent") }),
            /* @__PURE__ */ g.jsx("option", { value: "percent_of_total", children: l("% of total") }),
            /* @__PURE__ */ g.jsx("option", { value: "count", children: l("Count") })
          ] })
        ] }),
        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
          l("Group by"),
          /* @__PURE__ */ g.jsxs("select", { "aria-label": l("Group by"), value: v, onChange: (C) => m(C.target.value), children: [
            /* @__PURE__ */ g.jsx("option", { value: "", children: l("Each file") }),
            a.map((C) => /* @__PURE__ */ g.jsx("option", { value: C, children: C }, C))
          ] })
        ] }),
        /* @__PURE__ */ g.jsxs("div", { style: { display: "flex", gap: 6 }, children: [
          /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", disabled: !u, onClick: () => i({ populationId: u, statistic: f, groupBy: v }), children: l("Add") }),
          o && /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", title: l("Add the Plotting tab's current chart as one block, drawn here as it is there"), onClick: o, children: l("Take the Plotting tab's chart") })
        ] })
      ]
    }
  );
}
const A1 = {
  bars: "bar",
  dots: "dots",
  box: "box"
}, L1 = {
  percent_of_parent: "parent",
  percent_of_total: "total",
  count: "count"
}, md = (t, e) => Math.max(Rc[t][0], Math.min(Rc[t][1], e));
function z1(t, e, n, r) {
  const a = e.populations[t.populationId], i = e.root_population_id ?? "", o = t.files === "all" ? [...n.all] : n.all.filter((l) => n.checked.includes(l)), s = t.statistic === "median";
  return {
    ...zg,
    files: o,
    hierarchy: e.id,
    categoryKind: "population",
    valueKind: s ? "statistic" : "proportion",
    plotType: A1[t.chartType],
    channel: s ? t.channel ?? "" : "",
    xAxis: "groups",
    statistic: "median",
    errorBar: "sd",
    test: t.test && !!t.groupBy,
    proportionValue: t.statistic === "median" ? "parent" : L1[t.statistic],
    parent: (a == null ? void 0 : a.parent_id) ?? i,
    selectedPops: [t.populationId],
    includeUngated: !0,
    groupSel: t.groupBy || vi,
    unitSel: vi,
    facetSel: Kd,
    points: t.chartType === "dots" ? !0 : t.showPoints,
    // The summary chart names its groups under the axis and has no legend.
    legend: !1,
    ...r ? { fontTick: md("fontTick", r.fontTick), fontAxis: md("fontAxis", r.fontAxis) } : {}
  };
}
function yh(t, e, n, r) {
  var a;
  return {
    kind: "proportions",
    settings: z1(t, e, n, r),
    ...t.title ? { title: t.title } : {},
    panel: { populationId: t.populationId, population: ((a = e.populations[t.populationId]) == null ? void 0 : a.name) ?? "" },
    textSize: "sheet"
  };
}
function F1(t, e, n, r) {
  return yh(
    { ...t, files: "checked", chartType: "bars", showPoints: !0, test: !0 },
    e,
    n,
    r
  );
}
const Bo = (t) => `Boxes show the median and quartiles of the ${t}; whiskers extend to the most extreme ${bh(t)} within 1.5 times the interquartile range.`;
function bh(t) {
  return t === "cells" ? "cell" : t === "files" ? "file" : t === "events" ? "event" : t.endsWith("s") ? t.slice(0, -1) : t;
}
function B1(t) {
  if (t === vi || t === Kd) return { one: "file", many: "files" };
  if (t === Ug) return { one: "sample", many: "samples" };
  if (/^[A-Za-z][A-Za-z ]*$/.test(t)) {
    const e = t.trim().toLowerCase();
    return { one: e, many: e.endsWith("s") ? e : `${e}s` };
  }
  return { one: `unit of ${t}`, many: `units of ${t}` };
}
function hn(t) {
  return t.length <= 1 ? t[0] ?? "" : `${t.slice(0, -1).join(", ")} and ${t[t.length - 1]}`;
}
const zr = (t) => t.toLocaleString("en-US");
function qi(t) {
  return (e) => {
    var r;
    const n = t.files.find((a) => a.id === e);
    return n ? n.fileName ?? n.name : ((r = t.samples.find((a) => a.id === e)) == null ? void 0 : r.name) ?? e;
  };
}
function G1(t, e, n) {
  var y, w;
  const r = n.describePlot(e, t.templateSampleId, t.unitId), a = n.samples.find((S) => S.id === e.sampleId) ?? null, i = qi(n), o = e.pool && e.pool.sampleIds.length > 1 ? e.pool.sampleIds : null, s = (o ?? [e.sampleId]).map(i), l = (S) => a ? a.sample.labelForKey(S) : S, c = [e.xChannel, ...e.kind === "biplot" && e.yChannel ? [e.yChannel] : []].filter(Boolean).map(l);
  let u = r != null && r.population ? [r.population] : [], d = typeof (r == null ? void 0 : r.count) == "number" ? [r.count] : void 0;
  if (e.populationIds && e.populationIds.length > 1 && a && ((y = r == null ? void 0 : r.counts) != null && y.length)) {
    const S = Dn(n.state), C = t.templateSampleId && t.templateSampleId !== e.sampleId ? (w = n.samples.find((k) => k.id === t.templateSampleId)) == null ? void 0 : w.tree.id : void 0;
    u = e.populationIds.flatMap((k) => {
      const M = gn(k, a.tree, S, C), E = M.missing ? void 0 : a.tree.populations[M.id];
      return E ? [E.name] : [];
    }), d = [...r.counts];
  }
  const f = e.kind === "histogram" ? `Histogram of ${c[0] ?? "a channel"}` : `${c[0] ?? "X"} against ${c[1] ?? "Y"}`, h = u.length > 1 ? "overlay" : o ? "pool" : "plot", v = o ? `${s.length} files pooled` : s[0] ?? "", m = u.length > 1 ? `${hn(u)} overlaid` : `${u[0] ?? "the population"} cells`;
  return {
    kind: h,
    shows: `${f} of ${m}${v ? ` in ${v}` : ""}`,
    files: s,
    populations: u,
    channels: c,
    ...d ? { counts: d } : {},
    unit: "events",
    follows: kr(t)
  };
}
function $1(t, e, n) {
  var u, d;
  const r = n.samples.find((f) => f.id === e.sampleId) ?? null, a = qi(n), i = Dn(n.state), o = t.templateSampleId && t.templateSampleId !== e.sampleId ? (u = n.samples.find((f) => f.id === t.templateSampleId)) == null ? void 0 : u.tree.id : void 0, s = (d = e.populationIds) != null && d.length ? e.populationIds : [e.populationId], l = r ? s.flatMap((f) => {
    const h = gn(f, r.tree, i, o), v = h.missing ? void 0 : r.tree.populations[h.id];
    return v ? [{ name: v.name, count: r.derived.stats.event_count[h.id] ?? 0 }] : [];
  }) : [], c = a(e.sampleId);
  return {
    kind: "strategy",
    shows: `Gating steps leading to ${hn(l.map((f) => f.name)) || "the population"} in ${c}`,
    files: [c],
    populations: l.map((f) => f.name),
    channels: [],
    counts: l.map((f) => f.count),
    unit: "events",
    follows: kr(t)
  };
}
function W1(t, e, n) {
  const r = e.illustration.figure, a = qi(n), i = ((r == null ? void 0 : r.sampleIds) ?? []).filter((f) => n.files.some((h) => h.id === f) || n.samples.some((h) => h.id === f)).map(a), o = [...new Set(((r == null ? void 0 : r.populations) ?? []).map((f) => f.label).filter(Boolean))], s = (f) => {
    const h = n.files.find((v) => r == null ? void 0 : r.sampleIds.includes(v.id));
    return h ? h.sample.labelForKey(f) : f;
  }, l = (r == null ? void 0 : r.plots) ?? [], c = [...new Set(l.flatMap((f) => [f.x, f.type === "biplot" ? f.y : ""]).filter(Boolean))].map(s), u = [...new Set(l.map((f) => f.type === "histogram" ? "histograms" : f.type === "heatmap" ? "heatmaps" : "biplots"))], d = (r == null ? void 0 : r.composition) === "pool" ? ", files pooled" : (r == null ? void 0 : r.composition) === "overlay" ? ", files overlaid" : "";
  return {
    kind: "figure",
    shows: `${u.length ? hn(u).replace(/^./, (f) => f.toUpperCase()) : "Plots"} of ${hn(o) || "the populations"} in ${i.length === 1 ? i[0] : `${i.length} files`}${d}`,
    files: i,
    populations: o,
    channels: c,
    unit: "events",
    follows: kr(t)
  };
}
function Y1(t, e) {
  var s;
  const n = Us(t, e.samples, e.metadataById, e.checkedSampleIds, e.state), r = t.statistic === "median" && t.channel ? ((s = e.samples.find((l) => l.id === t.sampleId) ?? e.samples[0]) == null ? void 0 : s.sample.labelForKey(t.channel)) ?? t.channel : "", a = t.chartType === "bars" ? "Bars show the mean and error bars the standard deviation." : t.chartType === "box" ? "Boxes show the median and quartiles; whiskers extend to the lowest and highest file." : "Points show each file and the line the mean.", i = !!t.groupBy, o = t.statistic === "median" ? "median" : t.statistic === "count" ? "event count" : "percentage";
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
function As(t, e) {
  return !t || "legend" in t ? !0 : (t.facet === void 0 || (e.facet ?? "") === t.facet) && (t.group === void 0 || e.group === null || e.group === t.group) && (t.populationId !== void 0 && e.populationId ? e.populationId === t.populationId : t.population === void 0 || e.population === null || e.population === t.population);
}
function X1(t, e, n) {
  var ft;
  const r = e.settings, a = kr(t), i = qi(n), o = r.files.filter((Z) => n.files.some((ut) => ut.id === Z)).map(i), s = e.panel && !("legend" in e.panel) && Fg(e.panel) || void 0;
  if (e.panel && "legend" in e.panel)
    return { kind: "legend", shows: "Legend of a Plotting chart", files: o, populations: [], channels: [], follows: a };
  const { model: l, cellModel: c, channels: u } = Gs(r, n.files, n.state, n.metadataById, n.divisionProfiles, n.dataRevision), d = pr(r.groupSel), f = r.groupSel === vi, h = B1(r.unitSel), v = Hd({ ...r, channels: u.map((Z) => Z.key) }, c ? c.hasFacet : l.hasFacet), m = Bg(e.panel), y = Gg(e.panel, v), w = Object.fromEntries(u.map((Z) => [Z.key, Z.label])), S = m !== void 0 && v ? Vd({ facet: m, group: m, population: m, channel: m }, v, { group: d, facet: pr(r.facetSel), channels: w }) : void 0, C = u.find((Z) => y && !("legend" in y) && Z.key === y.channel), k = (C == null ? void 0 : C.model) ?? c, M = C && y && !("legend" in y) ? (({ channel: Z, ...ut }) => ut)(y) : y, E = !C && u.length > 1 ? u.map((Z) => Z.label) : null, D = { files: o, follows: a, ...s && m === void 0 ? { panel: s } : {}, ...S ? { page: S } : {}, ...d && !f ? { groupTitle: d } : {} };
  if (r.valueKind === "statistic" && k) {
    const Z = r.plotType === "bar" ? "bar" : r.plotType === "dots" ? "dots" : "box", ut = $g(k, { ...r, plotType: Z }, d, pr(r.facetSel)), vt = M && !("legend" in M) ? Wg(ut.panels, M, (ht) => ht).slice(0, S ? void 0 : 1) : ut.panels, nt = [];
    for (const ht of vt)
      for (const yt of ht.slots) {
        if (!yt.points.length) continue;
        const Et = r.xAxis === "groups" ? yt.label : ht.group ?? "", Ht = yt.cat !== void 0 ? k.catLevels[yt.cat] ?? "" : r.xAxis === "groups" ? ht.population ?? "" : yt.label;
        nt.push({ label: Et, population: Ht, n: yt.points.length });
      }
    const pt = [...new Set(nt.map((ht) => ht.population ?? ""))].filter(Boolean), jt = E ? hn(E) : k.channelLabel || r.channel, st = Bs(r.statistic, jt), lt = r.errorBar === "sem" ? "standard error of the mean" : "standard deviation", xt = Z === "box" ? Bo(h.many) : Z === "bar" ? `Bars show the mean of the ${h.many} and error bars the ${lt}.` : `Points show each ${h.one}; lines show the mean and error bars the ${lt}.`, Ct = r.test && mo(r) === "groups", Mt = Ct && r.comparisons === "pairwise";
    return {
      ...D,
      kind: "statistic",
      shows: `${st} of ${hn(pt) || "the populations'"} cells per ${h.one}`,
      populations: pt,
      channels: E ?? [jt],
      value: st,
      statistic: r.statistic === "geomean" ? "geometric mean" : r.statistic,
      unit: h.many,
      groups: nt,
      centre: xt,
      testAsked: Ct,
      tests: Ct ? vt.flatMap((ht) => ht.test ? [{ panel: ht.title, name: ht.test.name, p: ht.test.p }] : []) : [],
      ...Mt ? {
        comparisons: vt.flatMap((ht) => Ls(ht.title, Pc(ht.comparisons, r.comparisonsShow))),
        testDescription: Zo(r, ut.groups.length)
      } : {}
    };
  }
  if (r.valueKind === "cells" && k) {
    const Z = k.violins.filter((lt) => {
      var xt;
      return As(M, { facet: lt.facet, group: lt.group, population: k.catLevels[lt.cat] ?? null, populationId: ((xt = k.levels[lt.cat]) == null ? void 0 : xt.popId) ?? null });
    }), ut = [];
    for (const lt of Z) {
      if (!lt.values.length) continue;
      const xt = k.catLevels[lt.cat], Ct = ut.find((Mt) => Mt.label === lt.group && Mt.population === xt);
      Ct ? Ct.n += lt.values.length : ut.push({ label: lt.group, population: xt, n: lt.values.length });
    }
    const vt = [...new Set(ut.map((lt) => lt.population ?? ""))].filter(Boolean), nt = E ? hn(E) : k.channelLabel || r.channel, pt = r.plotType === "box" ? Bo("cells") : r.plotType === "ridgeline" ? "Ridgelines show the density of the cells (Silverman's bandwidth), each row scaled to its own peak." : r.plotType === "splitViolin" && new Set(ut.map((lt) => lt.label)).size === 2 && mo(r) === "groups" ? `Split violins show the density of each group's cells on its own half (Silverman's bandwidth), with each half's median${r.violinBox ? " and quartiles" : ""} marked across it.` : `Violins show the density of the cells (Silverman's bandwidth)${r.violinBox ? ", with the median and quartiles marked inside" : ""}.`, jt = r.test && mo(r) === "groups" && r.replicateMarks !== "none" && (C ? C.unitModel : H1(r, n)), st = jt ? V1(r, k, jt, M) : null;
    return {
      ...D,
      ...st ?? {},
      kind: "cells",
      shows: `${nt} in each cell of ${hn(vt) || "the populations"}, the cells of each group's files pooled`,
      populations: vt,
      channels: E ?? [nt],
      value: `${nt} per cell`,
      statistic: "value per cell",
      unit: "cells",
      groups: ut,
      centre: pt
    };
  }
  const _ = r.plotType !== "stacked", j = Yg(r, n.state), x = r.categoryKind === "division" ? Xg(l.divisionWithin) : (ft = j[r.parent]) != null && ft.parent_id ? j[r.parent].name : null, I = Hg(r.categoryKind, x, r.includeUngated), P = l.catLevels.map((Z, ut) => {
    var vt, nt;
    return { population: Z, cat: ut, populationId: ((nt = (vt = l.levels) == null ? void 0 : vt[ut]) == null ? void 0 : nt.popId) ?? null };
  }).filter((Z) => As(M && !("legend" in M) ? { ...M, facet: void 0 } : M, { facet: null, group: null, population: Z.population, populationId: Z.populationId })), R = l.perSample.filter((Z) => !M || "legend" in M || M.facet === void 0 || (Z.facet ?? "") === M.facet), N = Vg(R, l.catLevels.length), F = [...new Set(N.map((Z) => Z.group))], q = !_ && !r.averagePerUnit, z = q ? F.map((Z) => ({ label: Z, n: R.filter((ut) => ut.group === Z).reduce((ut, vt) => ut + vt.catCounts.reduce((nt, pt) => nt + pt, 0), 0) })) : F.map((Z) => ({ label: Z, n: N.filter((ut) => ut.group === Z).length })), B = P.map((Z) => Z.population), Y = _ ? Bo(h.many) : q ? "Each bar shows the composition of its group's events, pooled over its files." : `Each bar shows the mean composition of the ${h.many} in its group.`, V = _ && r.test, W = Nc(l.perSample.map((Z) => Z.group)), tt = l.hasFacet ? Nc(l.perSample.map((Z) => Z.facet ?? "")) : [null], J = { comparisons: r.comparisons, comparisonsShow: r.comparisonsShow, paired: Kg(r) }, rt = V ? qg(l, tt, W, r.proportionValue, J) : /* @__PURE__ */ new Map(), Q = tt.flatMap((Z, ut) => P.map((vt) => ({ title: [vt.population, l.hasFacet ? Z || "(NA)" : null].filter(Boolean).join(" · "), facet: Z, tests: rt.get(`p${ut}-${vt.cat}`) }))).filter((Z) => Z.tests && (!M || "legend" in M || M.facet === void 0 || (Z.facet ?? "") === M.facet)), at = r.comparisons === "pairwise" || J.paired;
  return {
    ...D,
    ...V ? {
      testAsked: !0,
      tests: Q.flatMap((Z) => Z.tests.overall ? [{ panel: Q.length > 1 ? Z.title : "", name: Z.tests.overall.name, p: Z.tests.overall.p }] : []),
      ...at ? {
        comparisons: Q.flatMap((Z) => Ls(Q.length > 1 ? Z.title : "", Pc(Z.tests.pairs, r.comparisonsShow))),
        testDescription: Zo(r, W.length)
      } : {}
    } : {},
    kind: "proportion",
    shows: `${I} for ${hn(B) || "the populations"}${q ? ", events pooled per group" : ` per ${h.one}`}`,
    populations: B,
    channels: [],
    value: I,
    statistic: "percentage",
    unit: q ? "events" : h.many,
    groups: z,
    centre: Y
  };
}
function Ls(t, e) {
  return e.flatMap((n) => n.p !== null && n.pAdjusted !== null ? [{ panel: t, groupA: n.groupA, groupB: n.groupB, name: n.test, p: n.p, pAdjusted: n.pAdjusted }] : []);
}
function H1(t, e) {
  return Gs(t, e.files, e.state, e.metadataById, e.divisionProfiles, e.dataRevision).unitModel;
}
function V1(t, e, n, r) {
  const { panels: a, groups: i } = Zg(e, t.xAxis, void 0, pr(t.facetSel)), o = Jg(e, a, i, t.xAxis, { unitModel: n, statistic: t.replicateMarks === "mean" ? "mean" : "median", unitSel: t.unitSel, test: !0, comparisons: t }), s = a.filter((c) => As(r, c)), l = (c) => s.length > 1 ? c.title : "";
  return {
    testAsked: !0,
    tests: s.flatMap((c) => {
      const u = o.tests.get(c.key);
      return u ? [{ panel: l(c), name: u.name, p: u.p }] : [];
    }),
    ...t.comparisons === "pairwise" ? {
      comparisons: s.flatMap((c) => Ls(l(c), o.comparisons.get(c.key) ?? [])),
      testDescription: Zo(t, i.length)
    } : {}
  };
}
function K1(t, e) {
  const n = t.recipe;
  return n.kind === "biplot" || n.kind === "histogram" ? G1(t, n, e) : n.kind === "strategy" ? $1(t, n, e) : n.kind === "figure" ? W1(t, n, e) : n.kind === "chart" ? Y1(n, e) : n.kind === "proportions" ? X1(t, n, e) : null;
}
function ta(t) {
  if (!Number.isFinite(t)) return "p not computed";
  if (t >= 1e-3) return `p = ${t.toPrecision(2)}`;
  const [e, n] = t.toExponential(1).split("e");
  return `p = ${e} × 10^${Number(n)}`;
}
function ea(t) {
  return t === "Wilcoxon rank-sum" ? "Wilcoxon rank-sum test" : t === "Wilcoxon signed-rank" ? "Wilcoxon signed-rank test" : "Kruskal–Wallis test";
}
function zl(t) {
  const e = t.tests ?? [], n = t.comparisons ?? [];
  if (t.testDescription) {
    const i = [`${t.testDescription}.`], o = zl({ tests: e, testAsked: !1 });
    return o && i.push(o), n.length ? i.push(`Pairs, Holm-adjusted: ${n.map((s) => `${s.panel ? `${s.panel}, ` : ""}${s.groupA} against ${s.groupB}, ${ta(s.pAdjusted)}`).join("; ")}.`) : !o && t.testAsked && i.push("No pair could be tested: each group needs two or more values."), i.join(" ");
  }
  if (!e.length) return t.testAsked ? "No test was made: each group needs two or more values, and there must be two or more groups." : "";
  const r = [...new Set(e.map((i) => i.name))];
  return e.length === 1 ? `${ea(e[0].name)}, ${ta(e[0].p)}.` : `${r.length === 1 ? `${ea(r[0])} in each panel` : "Tests in each panel"}: ${e.map((i) => `${i.panel ? `${i.panel}, ` : ""}${r.length === 1 ? "" : `${ea(i.name)}, `}${ta(i.p)}`).join("; ")}.`;
}
function Fl(t) {
  var n, r;
  const e = t.unit ?? "";
  return (n = t.groups) != null && n.length ? [...new Set(t.groups.map((i) => i.label))].map((i) => {
    const o = t.groups.filter((u) => u.label === i).map((u) => u.n), s = Math.min(...o), l = Math.max(...o), c = s === l ? zr(s) : `${zr(s)} to ${zr(l)}`;
    return `${i || "(none)"}, n = ${c} ${l === 1 ? bh(e) : e}`.trim();
  }).join("; ") : (r = t.counts) != null && r.length ? t.counts.length === 1 ? `n = ${zr(t.counts[0])} ${t.counts[0] === 1 ? "event" : "events"}` : t.populations.map((a, i) => {
    const o = t.counts[i] ?? 0;
    return `${a}, n = ${zr(o)} ${o === 1 ? "event" : "events"}`;
  }).join("; ") : "";
}
const q1 = [
  { token: "{files}", label: "Files" },
  { token: "{sizes}", label: "n per group" },
  { token: "{unit}", label: "What n counts" },
  { token: "{channel}", label: "Channel" },
  { token: "{statistic}", label: "Statistic" },
  { token: "{test}", label: "Test" },
  { token: "{p}", label: "p" }
];
function wh(t) {
  const e = t.tests ?? [];
  return {
    files: t.files.length <= 3 ? t.files.join(", ") : `${t.files.length} files`,
    sizes: Fl(t),
    unit: t.unit ?? "",
    channel: t.channels.join(" vs "),
    statistic: t.value ?? t.statistic ?? "",
    test: [.../* @__PURE__ */ new Set([...e.map((n) => ea(n.name)), ...(t.comparisons ?? []).map((n) => ea(n.name))])].join(", "),
    p: [...e.map((n) => ta(n.p)), ...(t.comparisons ?? []).map((n) => `${n.groupA} against ${n.groupB}, adjusted ${ta(n.pAdjusted)}`)].join("; ")
  };
}
const U1 = /\{(files|sizes|unit|channel|statistic|test|p)\}/g;
function zs(t) {
  return /\{(files|sizes|unit|channel|statistic|test|p)\}/.test(t);
}
function Fs(t, e) {
  if (!e) return t;
  const n = wh(e);
  return t.replace(U1, (r, a) => n[a] ?? "");
}
function xd(t) {
  return t.length <= 3 ? { value: t.join(", ") } : { value: `${t.slice(0, 3).join(", ")} + ${t.length - 3} more`, full: t.join(", ") };
}
function Z1(t) {
  const e = [{ term: "Shows", value: t.shows }];
  t.panel && e.push({ term: "Panel", value: t.panel }), t.page && e.push({ term: "Page", value: t.page }), t.files.length && e.push({ term: t.files.length === 1 ? "File" : "Files", ...t.files.length > 1 ? { count: t.files.length } : {}, ...xd(t.files) }), t.populations.length && e.push({ term: t.populations.length === 1 ? "Population" : "Populations", ...xd(t.populations) }), t.channels.length && e.push({ term: t.channels.length === 1 ? "Channel" : "Channels", value: t.channels.join(", ") }), t.value && e.push({ term: "Value", value: t.value }), t.groupTitle && e.push({ term: "Grouped by", value: t.groupTitle });
  const n = Fl(t);
  n && e.push({ term: "n", value: n }), t.centre && e.push({ term: "Drawn", value: t.centre });
  const r = zl(t);
  return r && e.push({ term: "Test", value: r }), e.push({ term: "Iteration", value: t.follows ? "Drawn for each unit of the sheet's iteration" : "Drawn once" }), e;
}
function J1(t, e, n) {
  const r = t.recipe;
  if (r.kind === "text" && r.readsFrom && zs(r.text)) {
    const a = r.readsFrom, i = e.find((o) => o.templateId === a && o.offset.x === t.offset.x && o.offset.y === t.offset.y);
    return i ? { ...t, recipe: { ...r, text: Fs(r.text, n(i)) } } : t;
  }
  return r.kind === "chart" && r.title && zs(r.title) ? { ...t, recipe: { ...r, title: Fs(r.title, n(t)) } } : t;
}
function Sh({ source: t }) {
  const { t: e } = Pt();
  return /* @__PURE__ */ g.jsx("dl", { className: "gl-layout-source-list", children: Z1(t).map((n) => /* @__PURE__ */ g.jsxs(G.Fragment, { children: [
    /* @__PURE__ */ g.jsx("dt", { children: n.count === void 0 ? e(n.term) : `${e(n.term)} (${n.count})` }),
    /* @__PURE__ */ g.jsx("dd", { title: n.full, children: n.value })
  ] }, n.term)) });
}
function Q1({ source: t }) {
  const { t: e } = Pt();
  if (!t) return null;
  const n = wh(t);
  return /* @__PURE__ */ g.jsxs("section", { className: "gl-layout-source", "aria-label": e("Data"), children: [
    /* @__PURE__ */ g.jsx("strong", { children: e("Data") }),
    /* @__PURE__ */ g.jsx(Sh, { source: t }),
    /* @__PURE__ */ g.jsxs("details", { className: "gl-layout-source-placeholders", children: [
      /* @__PURE__ */ g.jsx(ia, { children: e("Placeholders") }),
      /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: e("This block's title, and a text block that reads from it, may use these. {n} stays the page number of an iteration.") }),
      /* @__PURE__ */ g.jsx("dl", { className: "gl-layout-source-list", children: q1.map(({ token: r, label: a }) => /* @__PURE__ */ g.jsxs(G.Fragment, { children: [
        /* @__PURE__ */ g.jsx("dt", { children: /* @__PURE__ */ g.jsx("code", { children: r }) }),
        /* @__PURE__ */ g.jsx("dd", { title: e(a), children: n[r.slice(1, -1)] || "–" })
      ] }, r)) })
    ] })
  ] });
}
const tw = 500;
function ew({
  container: t,
  describe: e
}) {
  const [n, r] = G.useState(null), a = G.useRef(e);
  if (a.current = e, G.useEffect(() => {
    if (!t) return;
    let s = 0, l = null, c = null;
    const u = () => {
      c && c.element.setAttribute("title", c.title), c = null;
    }, d = () => {
      window.clearTimeout(s), s = 0, u(), r(null);
    }, f = (v) => {
      var S, C;
      if (v.buttons) {
        l = null, d();
        return;
      }
      const m = ((C = (S = v.target) == null ? void 0 : S.closest) == null ? void 0 : C.call(S, ".gl-layout-item")) ?? null;
      if (m === l) return;
      l = m, d();
      const y = m == null ? void 0 : m.dataset.itemId;
      if (!m || !y) return;
      const w = { x: v.clientX, y: v.clientY };
      s = window.setTimeout(() => {
        s = 0;
        const k = a.current(y);
        if (!k) return;
        const M = m.getAttribute("title");
        M !== null && (c = { element: m, title: M }, m.removeAttribute("title")), r({ source: k, ...w });
      }, tw);
    }, h = () => {
      l = null, d();
    };
    return t.addEventListener("mousemove", f), t.addEventListener("mouseleave", h), t.addEventListener("mousedown", h, !0), t.addEventListener("wheel", h, { passive: !0 }), () => {
      t.removeEventListener("mousemove", f), t.removeEventListener("mouseleave", h), t.removeEventListener("mousedown", h, !0), t.removeEventListener("wheel", h), window.clearTimeout(s), u();
    };
  }, [t]), !n || typeof document > "u") return null;
  const i = 360, o = Math.max(8, Math.min(n.x + 14, (window.innerWidth || i + 16) - i - 8));
  return Qg.createPortal(
    /* @__PURE__ */ g.jsx("div", { className: "gl-layout-source-tip", role: "tooltip", style: { left: o, top: n.y + 16, maxWidth: i }, children: /* @__PURE__ */ g.jsx(Sh, { source: n.source }) }),
    document.body
  );
}
function nw({ date: t, onRegenerate: e }) {
  const { t: n, language: r } = Pt();
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
function rw(t) {
  const e = [...t].sort((r, a) => r.y - a.y || r.x - a.x), n = [];
  for (const r of e) {
    const a = n[n.length - 1], i = a == null ? void 0 : a[0];
    i && r.y - i.y < Math.min(i.height, r.height) / 2 ? a.push(r) : n.push([r]);
  }
  return n.flatMap((r) => r.sort((a, i) => a.x - i.x));
}
function aw(t) {
  return `Panel ${t + 1}.`;
}
function iw(t, e) {
  return t.length - e.length || t.toUpperCase().localeCompare(e.toUpperCase());
}
function yd(t) {
  const e = Fl(t), n = t.groupTitle ? `, grouped by ${t.groupTitle}` : "", r = t.panel ? ` (panel ${t.panel})` : t.page ? ` (page ${t.page})` : "", a = [`${t.shows}${r}${n}${e ? ` (${e})` : ""}.`];
  t.follows && a.push("Drawn for each unit of the sheet's iteration; this page is shown."), t.centre && a.push(t.centre);
  const i = zl(t);
  return i && a.push(i), a.join(" ");
}
function ow(t, e, n) {
  const r = rw(t).flatMap((o) => {
    const s = e(o);
    return s && s.kind !== "legend" ? [{ source: s, letter: n == null ? void 0 : n(o) }] : [];
  }), a = r.filter((o) => o.letter).sort((o, s) => iw(o.letter, s.letter)), i = r.filter((o) => !o.letter);
  return [
    ...a.map(({ source: o, letter: s }) => `${s}. ${yd(o)}`),
    ...i.map(({ source: o }, s) => `${aw(s)} ${yd(o)}`)
  ].join(`
`);
}
function Ch(t = /* @__PURE__ */ new Date()) {
  const e = (n) => String(n).padStart(2, "0");
  return `${t.getFullYear()}-${e(t.getMonth() + 1)}-${e(t.getDate())}`;
}
function sw(t, e) {
  if (!t.length) return { x: e, y: e, width: 480 };
  const n = Math.min(...t.map((i) => i.x)), r = Math.max(...t.map((i) => i.x + i.width)), a = Math.max(...t.map((i) => i.y + i.height));
  return { x: n, y: a + 12, width: Math.max(320, r - n) };
}
const si = 10;
function bd(t, e, n, r = /* @__PURE__ */ new Date(), a) {
  const i = ow(t, e, a);
  if (!i) return null;
  const { x: o, y: s, width: l } = sw(t, n), c = tv(i, si, l), u = i.split(`
`).reduce((f, h) => f + Math.max(1, Math.ceil(h.length * si * 0.5 / l)), 0), d = Math.max(20, c ? c.height : Math.ceil(u * si * 1.4) + 8);
  return {
    recipe: { kind: "text", text: i, fontSize: si, legendGenerated: Ch(r) },
    frame: { x: o, y: s, width: l, height: d }
  };
}
const lw = ["line", "arrow", "bracket", "rectangle", "ellipse"], St = (t) => String(Math.round(t * 1e3) / 1e3 || 0);
function cw(t, e) {
  return t === "dashed" ? `${St(4 * e)} ${St(3 * e)}` : t === "dotted" ? `${St(e)} ${St(1.5 * e)}` : null;
}
function kh(t, e, n) {
  const r = t ?? "top-left", a = r.endsWith("left"), i = r.startsWith("top");
  return {
    start: { x: a ? 0 : e, y: i ? 0 : n },
    end: { x: a ? e : 0, y: i ? n : 0 }
  };
}
function Eh(t) {
  const e = 4 + 4 * t;
  return { length: e, halfWidth: e * 0.45 };
}
function uw(t, e, n) {
  const r = t.x - e.x, a = t.y - e.y, i = Math.hypot(r, a);
  if (i < 1e-6) return null;
  const o = r / i, s = a / i, { length: l, halfWidth: c } = Eh(n), u = t.x - o * l, d = t.y - s * l;
  return `M${St(t.x)} ${St(t.y)} L${St(u - s * c)} ${St(d + o * c)} L${St(u + s * c)} ${St(d - o * c)} Z`;
}
function Mh(t, e, n, r) {
  const a = Math.max(0, e);
  switch (t ?? "down") {
    case "up":
      return `M0 ${St(r - a)} L0 ${St(r)} L${St(n)} ${St(r)} L${St(n)} ${St(r - a)}`;
    case "right":
      return `M${St(a)} 0 L0 0 L0 ${St(r)} L${St(a)} ${St(r)}`;
    case "left":
      return `M${St(n - a)} 0 L${St(n)} 0 L${St(n)} ${St(r)} L${St(n - a)} ${St(r)}`;
    default:
      return `M0 ${St(a)} L0 0 L${St(n)} 0 L${St(n)} ${St(a)}`;
  }
}
function dw(t) {
  const e = cw(t.dash, t.strokeWidth);
  return {
    stroke: t.stroke,
    "stroke-width": St(t.strokeWidth),
    ...e ? { "stroke-dasharray": e } : {}
  };
}
function fw(t, e, n) {
  const r = Math.max(0, e), a = Math.max(0, n), i = dw(t);
  if (t.shape === "rectangle") {
    const S = Math.min(t.cornerRadius ?? 0, r / 2, a / 2);
    return [{
      tag: "rect",
      attrs: { x: "0", y: "0", width: St(r), height: St(a), ...S > 0 ? { rx: St(S), ry: St(S) } : {}, fill: t.fill ?? "none", ...i }
    }];
  }
  if (t.shape === "ellipse")
    return [{ tag: "ellipse", attrs: { cx: St(r / 2), cy: St(a / 2), rx: St(r / 2), ry: St(a / 2), fill: t.fill ?? "none", ...i } }];
  if (t.shape === "bracket")
    return [{ tag: "path", attrs: { d: Mh(t.side, t.ends ?? 0, r, a), fill: "none", "stroke-linejoin": "miter", ...i } }];
  const { start: o, end: s } = kh(t.from, r, a), l = t.arrows ?? "none", c = l === "start" || l === "both", u = l === "end" || l === "both", d = Math.hypot(s.x - o.x, s.y - o.y), f = d > 0 ? (s.x - o.x) / d : 0, h = d > 0 ? (s.y - o.y) / d : 0, v = Eh(t.strokeWidth).length * 0.8, m = c ? Math.min(v, d / 2) : 0, y = u ? Math.min(v, d / 2) : 0, w = [{
    tag: "line",
    attrs: {
      x1: St(o.x + f * m),
      y1: St(o.y + h * m),
      x2: St(s.x - f * y),
      y2: St(s.y - h * y),
      fill: "none",
      ...i
    }
  }];
  for (const [S, C] of [...c ? [[o, s]] : [], ...u ? [[s, o]] : []]) {
    const k = uw(S, C, t.strokeWidth);
    k && w.push({ tag: "path", attrs: { d: k, fill: t.stroke, stroke: "none" } });
  }
  return w;
}
function pw(t, e, n) {
  const r = Math.max(0, e), a = Math.max(0, n);
  if (t.shape === "line") {
    const { start: i, end: o } = kh(t.from, r, a);
    return { tag: "line", attrs: { x1: St(i.x), y1: St(i.y), x2: St(o.x), y2: St(o.y) } };
  }
  return t.shape === "bracket" ? { tag: "path", attrs: { d: Mh(t.side, t.ends ?? 0, r, a) } } : t.shape === "ellipse" ? { tag: "ellipse", attrs: { cx: St(r / 2), cy: St(a / 2), rx: St(r / 2), ry: St(a / 2) } } : { tag: "rect", attrs: { x: "0", y: "0", width: St(r), height: St(a) } };
}
const wd = Math.tan(Math.PI / 8);
function Dh(t, e) {
  const n = Math.abs(t), r = Math.abs(e);
  if (r <= n * wd) return { dx: t, dy: 0 };
  if (n <= r * wd) return { dx: 0, dy: e };
  const a = Math.max(n, r);
  return { dx: Math.sign(t) * a, dy: Math.sign(e) * a };
}
function hw(t, e) {
  const n = Math.max(Math.abs(t), Math.abs(e));
  return { dx: (t < 0 ? -1 : 1) * n, dy: (e < 0 ? -1 : 1) * n };
}
function gw(t) {
  return t === "line" || t === "arrow" ? { width: 120, height: 0 } : t === "bracket" ? { width: 120, height: 12 } : { width: 120, height: 80 };
}
function vw(t, e, n, r) {
  let a = Math.round(n.x - e.x), i = Math.round(n.y - e.y);
  const o = t === "line" || t === "arrow";
  r && ({ dx: a, dy: i } = o ? Dh(a, i) : hw(a, i));
  const s = Math.round(Math.min(e.x, e.x + a)), l = Math.round(Math.min(e.y, e.y + i)), c = { x: s, y: l, width: Math.abs(a), height: Math.abs(i) }, u = Ud(t);
  if (o)
    u.from = `${i < 0 ? "bottom" : "top"}-${a < 0 ? "right" : "left"}`;
  else if (t === "bracket") {
    const d = c.height > c.width, f = d ? c.width : c.height;
    return { recipe: qd({ ...u, side: d ? "right" : "down", ends: f >= 2 ? f : u.ends }), frame: c };
  }
  return { recipe: u, frame: c };
}
function mw(t, e) {
  return { recipe: Ud(t), frame: { x: Math.round(e.x), y: Math.round(e.y), ...gw(t) } };
}
function xw(t, e, n) {
  if (!n || !t || t.kind !== "shape" || t.shape !== "line") return null;
  const { dx: r, dy: a } = Dh(e.width, e.height), i = Math.abs(r), o = Math.abs(a), [s, l] = e.direction ?? [1, 1];
  return {
    width: i,
    height: o,
    // A handle on the left or the top moves that edge: the right or bottom edge stays put.
    left: s < 0 ? e.drag.left + e.width - i : e.drag.left,
    top: l < 0 ? e.drag.top + e.height - o : e.drag.top
  };
}
const yw = {
  line: ["arrows", "from"],
  bracket: ["side", "ends"],
  rectangle: ["fill", "cornerRadius"],
  ellipse: ["fill"]
}, bw = ["stroke", "strokeWidth", "dash"];
function Th(t, e) {
  return bw.includes(e) || yw[t].includes(e);
}
function ww(t, e) {
  const n = { ...t };
  for (const [r, a] of Object.entries(e))
    r === "kind" || r === "shape" || !Th(t.shape, r) || (a === null ? delete n[r] : n[r] = a);
  return qd(n) ?? t;
}
const Sw = (t) => Object.fromEntries(Object.entries(t).map(([e, n]) => [e.replace(/-([a-z])/g, (r, a) => a.toUpperCase()), n])), Sd = (t, e, n = {}) => G.createElement(t.tag, { key: e, ...Sw(t.attrs), ...n });
function _h({ recipe: t, width: e, height: n, hit: r = !0 }) {
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
        /* @__PURE__ */ g.jsx("g", { className: "gl-layout-shape-art", children: fw(t, e, n).map((i, o) => Sd(i, o)) }),
        r && Sd(pw(t, e, n), "hit", {
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
function Cw(t, e, n) {
  return {
    grid: t,
    vertical: [...e.vertical, ...n.flatMap((r) => [r.x, r.x + r.width / 2, r.x + r.width])],
    horizontal: [...e.horizontal, ...n.flatMap((r) => [r.y, r.y + r.height / 2, r.y + r.height])]
  };
}
function Cd(t, e, n, r) {
  let a = t, i = n;
  for (const o of e) {
    const s = Math.abs(o - t);
    s <= i && (a = o, i = s);
  }
  return a !== t || i < n ? a : r > 0 ? Math.round(t / r) * r : t;
}
function kw({
  tool: t,
  zoom: e,
  snap: n,
  onDraw: r,
  onCancel: a
}) {
  const { t: i } = Pt(), o = G.useRef(null), [s, l] = G.useState(null), c = G.useRef({ tool: t, zoom: e, snap: n, onDraw: r, onCancel: a });
  return c.current = { tool: t, zoom: e, snap: n, onDraw: r, onCancel: a }, G.useEffect(() => {
    const u = (d) => {
      d.key === "Escape" && c.current.onCancel();
    };
    return window.addEventListener("keydown", u), () => window.removeEventListener("keydown", u);
  }, []), G.useEffect(() => {
    const u = o.current;
    if (!u) return;
    const d = (v, m) => {
      const y = u.getBoundingClientRect(), { zoom: w, snap: S } = c.current, C = { x: (v.clientX - y.left) / w, y: (v.clientY - y.top) / w };
      if (v.metaKey || v.ctrlKey) return C;
      const k = 6 / w;
      return { x: Cd(C.x, S.vertical, k, S.grid), y: Cd(C.y, S.horizontal, k, S.grid) };
    }, f = (v) => {
      if (v.button !== 0) return;
      v.stopPropagation(), v.preventDefault();
      const m = d(v), y = { x: v.clientX, y: v.clientY }, w = (k) => vw(c.current.tool, m, d(k), k.shiftKey), S = (k) => l(w(k)), C = (k) => {
        window.removeEventListener("mousemove", S, !0), window.removeEventListener("mouseup", C, !0), l(null);
        const M = Math.hypot(k.clientX - y.x, k.clientY - y.y) >= 3;
        c.current.onDraw(M ? w(k) : mw(c.current.tool, m));
      };
      window.addEventListener("mousemove", S, !0), window.addEventListener("mouseup", C, !0);
    }, h = (v) => v.stopPropagation();
    return u.addEventListener("mousedown", f), u.addEventListener("pointerdown", h), u.addEventListener("touchstart", h), () => {
      u.removeEventListener("mousedown", f), u.removeEventListener("pointerdown", h), u.removeEventListener("touchstart", h);
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
      children: s && /* @__PURE__ */ g.jsx("div", { className: "gl-layout-shape-preview", style: { left: s.frame.x, top: s.frame.y, width: s.frame.width, height: s.frame.height }, children: /* @__PURE__ */ g.jsx(_h, { recipe: s.recipe, width: s.frame.width, height: s.frame.height, hit: !1 }) })
    }
  );
}
const le = 18, Go = [1, 5, 10, 50, 100, 500], Ew = 6, Mw = 34;
function Dw(t) {
  const e = Kn * Math.max(t, 1e-6), n = (i) => Go.find((o) => o * e >= i) ?? Go[Go.length - 1], r = n(Ew), a = Math.max(r, n(Mw));
  return { tickMm: r, labelMm: a };
}
function Tw(t, e, n) {
  const { tickMm: r, labelMm: a } = Dw(n), i = Kn * n, o = Math.ceil(-t / i / r) * r, s = (e - t) / i, l = [];
  for (let c = o; c <= s && l.length < 2e3; c += r) {
    const u = Math.round(c) || 0;
    l.push({ at: t + u * i, mm: u, major: u % a === 0 });
  }
  return l;
}
function jh(t) {
  return Math.round(t * 100) / 100;
}
function _w(t) {
  const e = [], n = [];
  for (const r of (t == null ? void 0 : t.guides) ?? []) (r.axis === "x" ? e : n).push(r.at);
  return { vertical: e, horizontal: n };
}
function jw(t) {
  var e;
  return (e = t.guides) != null && e.length ? { guides: t.guides.map((n) => ({ ...n })) } : {};
}
function Iw(t, e) {
  t.guides = [...t.guides ?? [], { axis: e.axis, at: jh(e.at) }];
}
function Rw(t, e, n) {
  var r;
  (r = t.guides) != null && r[e] && (t.guides = t.guides.map((a, i) => i === e ? { ...a, at: jh(n) } : a));
}
function Pw(t, e) {
  var r;
  if (!((r = t.guides) != null && r[e])) return;
  const n = t.guides.filter((a, i) => i !== e);
  n.length ? t.guides = n : delete t.guides;
}
function Nw(t) {
  delete t.guides;
}
function Ow(t, e, n, r) {
  return t === "y" ? r < e.top + le : n < e.left + le;
}
const Aw = (t, e) => t.width === e.width && t.height === e.height && t.originX === e.originX && t.originY === e.originY;
function Lw({
  scroller: t,
  page: e,
  zoom: n,
  selected: r,
  onAddGuide: a
}) {
  const { t: i } = Pt(), o = Vn(r), [s, l] = G.useState({ width: 0, height: 0, originX: 0, originY: 0 }), [c, u] = G.useState(null), [d, f] = G.useState(null), h = G.useRef({ scroller: t, page: e, zoom: n, onAddGuide: a });
  h.current = { scroller: t, page: e, zoom: n, onAddGuide: a };
  const v = () => {
    const { scroller: S, page: C } = h.current;
    if (!S || !C) return;
    const k = S.getBoundingClientRect(), M = C.getBoundingClientRect(), E = {
      width: S.clientWidth || k.width,
      height: S.clientHeight || k.height,
      originX: M.left - k.left,
      originY: M.top - k.top
    };
    l((D) => Aw(D, E) ? D : E);
  };
  G.useLayoutEffect(v), G.useEffect(() => {
    if (!t) return;
    const S = () => v(), C = (E) => {
      const D = t.getBoundingClientRect();
      u({ x: E.clientX - D.left, y: E.clientY - D.top });
    }, k = () => u(null);
    t.addEventListener("scroll", S, { passive: !0 }), t.addEventListener("mousemove", C), t.addEventListener("mouseleave", k), window.addEventListener("resize", S);
    const M = typeof ResizeObserver > "u" ? null : new ResizeObserver(S);
    return M == null || M.observe(t), () => {
      t.removeEventListener("scroll", S), t.removeEventListener("mousemove", C), t.removeEventListener("mouseleave", k), window.removeEventListener("resize", S), M == null || M.disconnect();
    };
  }, [t]);
  const m = (S) => (C) => {
    if (C.button !== 0 || !t) return;
    C.preventDefault();
    const k = (D) => {
      const _ = t.getBoundingClientRect();
      return { x: D.clientX - _.left, y: D.clientY - _.top };
    }, M = (D) => f({ axis: S, ...k(D) }), E = (D) => {
      window.removeEventListener("mousemove", M, !0), window.removeEventListener("mouseup", E, !0), f(null);
      const { scroller: _, page: j, zoom: x, onAddGuide: I } = h.current;
      if (!_ || !j) return;
      const P = _.getBoundingClientRect(), R = _.clientWidth || P.width, N = _.clientHeight || P.height, F = D.clientX - P.left, q = D.clientY - P.top;
      if (!(F >= 0 && q >= 0 && F <= R && q <= N && (S === "y" ? q >= le : F >= le))) return;
      const B = j.getBoundingClientRect();
      I({ axis: S, at: S === "y" ? (D.clientY - B.top) / x : (D.clientX - B.left) / x });
    };
    window.addEventListener("mousemove", M, !0), window.addEventListener("mouseup", E, !0), f({ axis: S, ...k(C.nativeEvent) });
  }, y = (S) => S * n, w = (S) => {
    const C = S === "top", k = C ? s.width : s.height, M = C ? s.originX : s.originY, E = Tw(M, k, n), D = o ? { from: M + y(C ? o.x : o.y), size: y(C ? o.width : o.height) } : null, _ = c ? C ? c.x : c.y : null;
    return /* @__PURE__ */ g.jsx(
      "div",
      {
        className: `gl-layout-ruler is-${S}`,
        style: C ? { width: s.width, height: le } : { width: le, height: s.height },
        title: i(C ? "Drag onto the page to place a horizontal guide" : "Drag onto the page to place a vertical guide"),
        onMouseDown: m(C ? "y" : "x"),
        children: /* @__PURE__ */ g.jsxs("svg", { width: C ? s.width : le, height: C ? le : s.height, "aria-hidden": "true", children: [
          D && (C ? /* @__PURE__ */ g.jsx("rect", { className: "gl-layout-ruler-selection", x: D.from, y: 0, width: D.size, height: le }) : /* @__PURE__ */ g.jsx("rect", { className: "gl-layout-ruler-selection", x: 0, y: D.from, width: le, height: D.size })),
          E.map((j) => {
            const x = j.major ? le : j.mm % 5 === 0 ? le * 0.45 : le * 0.3;
            return C ? /* @__PURE__ */ g.jsx("line", { x1: j.at, x2: j.at, y1: le - x, y2: le }, j.mm) : /* @__PURE__ */ g.jsx("line", { y1: j.at, y2: j.at, x1: le - x, x2: le }, j.mm);
          }),
          E.filter((j) => j.major).map((j) => C ? /* @__PURE__ */ g.jsx("text", { x: j.at + 2, y: 9, children: j.mm }, `l${j.mm}`) : /* @__PURE__ */ g.jsx("text", { x: 9, y: j.at + 2, transform: `rotate(-90 9 ${j.at + 2})`, textAnchor: "end", children: j.mm }, `l${j.mm}`)),
          _ !== null && (C ? /* @__PURE__ */ g.jsx("line", { className: "gl-layout-ruler-pointer", x1: _, x2: _, y1: 0, y2: le }) : /* @__PURE__ */ g.jsx("line", { className: "gl-layout-ruler-pointer", y1: _, y2: _, x1: 0, x2: le }))
        ] })
      }
    );
  };
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-rulers", "data-testid": "layout-rulers", children: [
    w("top"),
    w("left"),
    /* @__PURE__ */ g.jsx("div", { className: "gl-layout-ruler-corner", title: i("Rulers in mm from the first page's top-left corner"), children: "mm" }),
    d && (d.axis === "y" ? /* @__PURE__ */ g.jsx("div", { className: "gl-layout-guide-draft is-y", style: { top: d.y, width: s.width } }) : /* @__PURE__ */ g.jsx("div", { className: "gl-layout-guide-draft is-x", style: { left: d.x, height: s.height } }))
  ] });
}
function zw({ on: t, onToggle: e }) {
  const { t: n } = Pt();
  return /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": t, onClick: e, title: n("Show rulers in mm along the top and left of the page; drag from a ruler to place a guide"), children: n("Rulers") });
}
const Fw = 4;
function Bw({
  guides: t,
  width: e,
  height: n,
  zoom: r,
  scroller: a,
  onMove: i,
  onRemove: o
}) {
  const { t: s } = Pt(), l = G.useRef(null), [c, u] = G.useState(null), [d, f] = G.useState(null), h = G.useRef({ guides: t, zoom: r, scroller: a, onMove: i, onRemove: o });
  h.current = { guides: t, zoom: r, scroller: a, onMove: i, onRemove: o }, G.useEffect(() => {
    const m = l.current;
    if (!m) return;
    const y = (S) => {
      const C = S.target.closest(".gl-layout-guide");
      if (!C || S.button !== 0) return;
      S.stopPropagation(), S.preventDefault(), C.focus({ preventScroll: !0 });
      const k = Number(C.dataset.guideIndex), M = h.current.guides[k];
      if (!M) return;
      const E = { x: S.clientX, y: S.clientY }, D = (I) => {
        const P = m.getBoundingClientRect(), R = h.current.zoom;
        return M.axis === "x" ? (I.clientX - P.left) / R : (I.clientY - P.top) / R;
      }, _ = (I) => Math.hypot(I.clientX - E.x, I.clientY - E.y) >= 3, j = (I) => {
        _(I) && u({ index: k, at: D(I) });
      }, x = (I) => {
        var R;
        if (window.removeEventListener("mousemove", j, !0), window.removeEventListener("mouseup", x, !0), u(null), !_(I)) return;
        const P = (R = h.current.scroller) == null ? void 0 : R.getBoundingClientRect();
        P && Ow(M.axis, P, I.clientX, I.clientY) ? h.current.onRemove(k) : h.current.onMove(k, D(I));
      };
      window.addEventListener("mousemove", j, !0), window.addEventListener("mouseup", x, !0);
    }, w = (S) => {
      S.target.closest(".gl-layout-guide, .gl-layout-guide-field") && S.stopPropagation();
    };
    return m.addEventListener("mousedown", y), m.addEventListener("pointerdown", w), m.addEventListener("touchstart", w), () => {
      m.removeEventListener("mousedown", y), m.removeEventListener("pointerdown", w), m.removeEventListener("touchstart", w);
    };
  }, []);
  const v = (Fw * 2 + 1) / r;
  return /* @__PURE__ */ g.jsxs("div", { ref: l, className: "gl-layout-guides", "aria-label": s("Guides"), children: [
    t.map((m, y) => {
      const w = (c == null ? void 0 : c.index) === y ? c.at : m.at, S = Ni(w, "mm");
      return /* @__PURE__ */ g.jsx(
        "div",
        {
          className: `gl-layout-guide is-${m.axis}`,
          "data-guide-index": y,
          role: "separator",
          "aria-orientation": m.axis === "x" ? "vertical" : "horizontal",
          "aria-label": m.axis === "x" ? s("Vertical guide at {mm} mm", { mm: S }) : s("Horizontal guide at {mm} mm", { mm: S }),
          title: s("Drag to move; drag onto its ruler or press Delete to remove; double-click to type its position"),
          tabIndex: 0,
          style: m.axis === "x" ? { left: w - v / 2, top: 0, width: v, height: n } : { top: w - v / 2, left: 0, height: v, width: e },
          onDoubleClick: (C) => {
            C.stopPropagation(), f(y);
          },
          onKeyDown: (C) => {
            C.key === "Delete" || C.key === "Backspace" ? (C.preventDefault(), C.stopPropagation(), o(y)) : C.key === "Enter" && (C.preventDefault(), C.stopPropagation(), f(y));
          }
        },
        y
      );
    }),
    d !== null && t[d] && /* @__PURE__ */ g.jsx(
      Gw,
      {
        guide: t[d],
        zoom: r,
        onCommit: (m) => {
          f(null), m !== t[d].at && i(d, m);
        },
        onCancel: () => f(null)
      }
    )
  ] });
}
function Gw({ guide: t, zoom: e, onCommit: n, onCancel: r }) {
  const { t: a } = Pt(), i = G.useRef(!1), o = (l) => {
    if (i.current) return;
    i.current = !0;
    const c = Number(l);
    l.trim() === "" || !Number.isFinite(c) ? r() : n(Oi(c, "mm"));
  }, s = t.axis === "x" ? { left: t.at + 4 / e, top: 4 / e } : { top: t.at + 4 / e, left: 4 / e };
  return /* @__PURE__ */ g.jsxs("label", { className: "gl-layout-guide-field", style: { ...s, transform: `scale(${1 / e})` }, children: [
    t.axis === "x" ? a("X (mm)") : a("Y (mm)"),
    /* @__PURE__ */ g.jsx(
      "input",
      {
        type: "number",
        step: 0.1,
        autoFocus: !0,
        "aria-label": a("Guide position (mm)"),
        defaultValue: Ni(t.at, "mm"),
        onKeyDown: (l) => {
          l.stopPropagation(), l.key === "Enter" ? o(l.currentTarget.value) : l.key === "Escape" && (i.current = !0, r());
        },
        onBlur: (l) => o(l.currentTarget.value)
      }
    )
  ] });
}
function $w({ count: t, onClear: e }) {
  const { t: n } = Pt();
  return /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: e, disabled: !t, title: n("Remove every guide on this sheet"), children: n("Clear guides") });
}
const Ih = {
  line: "Line",
  arrow: "Arrow",
  bracket: "Bracket",
  rectangle: "Rectangle",
  ellipse: "Ellipse"
};
function Rh(t) {
  return t.shape === "line" ? t.arrows && t.arrows !== "none" ? "Arrow" : "Line" : Ih[t.shape];
}
function kd(t) {
  return t.filter((e) => e.recipe.kind === "shape");
}
function Ph(t, e, n) {
  return lw.map((r) => ({
    label: t(Ih[r]),
    className: `gl-layout-shape-tool-${r}`,
    checked: e === r,
    onClick: () => n(r)
  }));
}
function Ww(t, e, n) {
  return ["separator", { section: t("+ Shape") }, ...Ph(t, e, n)];
}
function Yw({ armed: t, onArm: e }) {
  const { t: n } = Pt();
  return /* @__PURE__ */ g.jsx(
    Vo,
    {
      label: n("+ Shape"),
      className: "gl-layout-shape-menu",
      title: n("Draw a line, arrow, bracket, rectangle or ellipse: choose one, then drag on the page"),
      items: Ph(n, t, e)
    }
  );
}
const Xw = { solid: "Solid", dashed: "Dashed", dotted: "Dotted" }, Hw = { none: "None", end: "At the end", start: "At the start", both: "At both ends" }, Vw = {
  "top-left": "Top left to bottom right",
  "bottom-right": "Bottom right to top left",
  "bottom-left": "Bottom left to top right",
  "top-right": "Top right to bottom left"
}, Kw = { down: "Down", up: "Up", left: "Left", right: "Right" };
function Ed({ shapes: t, onChange: e }) {
  const { t: n } = Pt();
  if (!t.length) return null;
  const r = (l) => t.find((c) => Th(c.shape, l)), a = (l) => !!r(l), i = t[0], o = r("fill"), s = (l, c, u, d, f) => /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
    n(l),
    /* @__PURE__ */ g.jsx("select", { "aria-label": n(l), value: c, onChange: (h) => f(h.target.value), children: u.map((h) => /* @__PURE__ */ g.jsx("option", { value: h, children: n(d[h]) }, h)) })
  ] });
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-shape-fields", "aria-label": n("Shape"), children: [
    /* @__PURE__ */ g.jsx("strong", { children: t.length === 1 ? n(Rh(i)) : n("{n} shapes", { n: t.length }) }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-layout-shape-colour", children: [
      /* @__PURE__ */ g.jsx("input", { type: "color", "aria-label": n("Line colour"), value: i.stroke, onChange: (l) => e({ stroke: l.target.value }) }),
      n("Line colour")
    ] }),
    /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("Line width (px)"),
      /* @__PURE__ */ g.jsx(
        ie,
        {
          "aria-label": n("Line width (px)"),
          min: Oc[0],
          max: Oc[1],
          step: 0.25,
          value: i.strokeWidth,
          onCommit: (l) => e({ strokeWidth: l })
        }
      )
    ] }),
    s("Dash", i.dash, ev, Xw, (l) => e({ dash: l })),
    a("arrows") && s("Arrowheads", r("arrows").arrows ?? "none", nv, Hw, (l) => e({ arrows: l })),
    a("from") && s("Direction", r("from").from ?? "top-left", rv, Vw, (l) => e({ from: l })),
    a("side") && s("Ends point", r("side").side ?? "down", av, Kw, (l) => e({ side: l })),
    a("ends") && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
      n("End length (px)"),
      /* @__PURE__ */ g.jsx(
        ie,
        {
          "aria-label": n("End length (px)"),
          min: Ac[0],
          max: Ac[1],
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
        ie,
        {
          "aria-label": n("Corner radius (px)"),
          min: Lc[0],
          max: Lc[1],
          step: 1,
          value: r("cornerRadius").cornerRadius ?? 0,
          onCommit: (l) => e({ cornerRadius: l })
        }
      )
    ] })
  ] });
}
function qw({ recipe: t }) {
  const e = G.useMemo(() => n1(t), [t]);
  return /* @__PURE__ */ g.jsx("img", { className: "gl-layout-placed-image", src: e, alt: t.fileName, draggable: !1, "data-media-type": t.mediaType });
}
function Md(t) {
  const { t: e } = Pt(), n = G.useRef(t);
  n.current = t;
  const r = G.useRef(e);
  return r.current = e, G.useRef((a, i) => {
    Zb(a, r.current).then((o) => n.current(o, i));
  }).current;
}
function Uw({ onFile: t }) {
  const { t: e } = Pt();
  return /* @__PURE__ */ g.jsx(
    "button",
    {
      className: "gl-mini-btn",
      type: "button",
      title: e("Place an SVG, PNG or JPEG file on the page, kept in the workspace; or drop the file on the page"),
      onClick: () => void Ll().then((n) => n && t(n)),
      children: e("+ Image…")
    }
  );
}
function Zw(t, e) {
  return { label: t("+ Image…"), onClick: () => void Ll().then((n) => n && e(n)) };
}
function Jw(t, e) {
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
const Qw = { "image/svg+xml": "SVG", "image/png": "PNG", "image/jpeg": "JPEG" };
function tS({ recipe: t, onReplace: e }) {
  const { t: n } = Pt();
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-image-fields", "aria-label": n("Image"), children: [
    /* @__PURE__ */ g.jsxs("dl", { children: [
      /* @__PURE__ */ g.jsx("dt", { children: n("File") }),
      /* @__PURE__ */ g.jsxs("dd", { className: "gl-layout-image-file", children: [
        t.fileName,
        " (",
        Qw[t.mediaType],
        ")"
      ] }),
      /* @__PURE__ */ g.jsx("dt", { children: n("Natural size") }),
      /* @__PURE__ */ g.jsx("dd", { className: "gl-layout-image-natural", children: n("{width} × {height} px", { width: t.naturalWidth, height: t.naturalHeight }) }),
      /* @__PURE__ */ g.jsx("dt", { children: n("Stored size") }),
      /* @__PURE__ */ g.jsx("dd", { className: "gl-layout-image-stored", children: Ps(Hb(t)) })
    ] }),
    /* @__PURE__ */ g.jsx(
      "button",
      {
        type: "button",
        className: "gl-mini-btn",
        title: n("Take another SVG, PNG or JPEG file in place of this one, in the same frame"),
        onClick: () => void Ll().then((r) => r && e(r)),
        children: n("Replace…")
      }
    )
  ] });
}
function Bl(t) {
  return t.rotation ?? 0;
}
function Gl(t) {
  return t.recipe.kind === "text" && !fe(t) || t.recipe.kind === "image";
}
function Nh(t) {
  return t.length > 0 && t.every(Gl);
}
function eS(t, e) {
  const n = (Bl(t) + (e === "right" ? 90 : 270)) % 360, r = t.x + t.width / 2, a = t.y + t.height / 2, { width: i, height: o } = t;
  t.width = o, t.height = i, t.x = r - t.width / 2, t.y = a - t.height / 2, n ? t.rotation = n : delete t.rotation;
}
function $o(t, e, n) {
  let r = !1;
  for (const a of t.items)
    !e.includes(a.id) || a.locked || !Gl(a) || (eS(a, n), r = !0);
  return r;
}
function nS(t, e) {
  const n = Math.ceil(e) + 4, r = Bl(t);
  if (r === 90 || r === 270) {
    if (n <= t.width) return;
    r === 90 && (t.x -= n - t.width), t.width = n;
    return;
  }
  n <= t.height || (r === 180 && (t.y -= n - t.height), t.height = n);
}
function rS(t, e, n) {
  if (!t) return;
  const r = t !== 180, a = r ? n : e, i = r ? e : n;
  return {
    width: `calc(${a}px - 2 * var(--gl-hair, 1px))`,
    height: `calc(${i}px - 2 * var(--gl-hair, 1px))`,
    marginLeft: (e - a) / 2,
    marginTop: (n - i) / 2,
    transform: `rotate(${t}deg)`
  };
}
const aS = "Turn the text or image 90° anticlockwise; its frame turns about its centre", iS = "Turn the text or image 90° clockwise; its frame turns about its centre", Oh = (t) => t.some((e) => !e.locked && Gl(e));
function Dd({ items: t, onTurn: e }) {
  const { t: n } = Pt();
  if (!Nh(t)) return null;
  const r = !Oh(t), a = t.length === 1 ? Bl(t[0]) : 0;
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions gl-layout-rotation", children: [
    /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", disabled: r, onClick: () => e("left"), title: n(aS), children: n("Rotate left") }),
    /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", disabled: r, onClick: () => e("right"), title: n(iS), children: n("Rotate right") }),
    a !== 0 && /* @__PURE__ */ g.jsx("span", { className: "gl-hint gl-layout-rotation-state", children: n("Turned {degrees}°", { degrees: a }) })
  ] });
}
function oS(t, e, n) {
  if (!Nh(e)) return [];
  const r = !Oh(e);
  return [
    { label: t("Rotate left"), disabled: r, onClick: () => n("left") },
    { label: t("Rotate right"), disabled: r, onClick: () => n("right") }
  ];
}
function Td({ turn: t, width: e, height: n, children: r }) {
  const a = rS(t ?? 0, e, n);
  return a ? /* @__PURE__ */ g.jsx("div", { className: "gl-layout-turned", "data-turn": t, style: a, children: r }) : /* @__PURE__ */ g.jsx(g.Fragment, { children: r });
}
function sS(t) {
  return {
    ...t != null && t.italic ? { fontStyle: "italic" } : {},
    ...t != null && t.color ? { color: t.color } : {},
    ...t != null && t.align ? { textAlign: t.align } : {}
  };
}
function lS(t, e) {
  let n = t.text;
  return t.sub && (n = /* @__PURE__ */ g.jsx("sub", { children: n })), t.sup && (n = /* @__PURE__ */ g.jsx("sup", { children: n })), t.italic && (n = /* @__PURE__ */ g.jsx("i", { children: n })), t.bold && (n = /* @__PURE__ */ g.jsx("b", { children: n })), /* @__PURE__ */ g.jsx(G.Fragment, { children: n }, e);
}
function cS({ text: t, rich: e }) {
  var r;
  if (!e) return /* @__PURE__ */ g.jsx(g.Fragment, { children: t });
  const n = xi(t, !0);
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    n.map(lS),
    (r = n.at(-1)) != null && r.text.endsWith(`
`) ? /* @__PURE__ */ g.jsx("br", {}) : null
  ] });
}
const Wo = {
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
}, Ah = { bold: !1, italic: !1, sup: !1, sub: !1 };
function Lh({ state: t, onToggle: e }) {
  const { t: n } = Pt();
  return /* @__PURE__ */ g.jsx("div", { className: "gl-layout-text-bar", role: "toolbar", "aria-label": n("Text formatting"), children: Rn.map((r) => /* @__PURE__ */ g.jsx(
    "button",
    {
      type: "button",
      className: "gl-mini-btn" + (t[r] ? " is-active" : ""),
      "aria-label": n(Wo[r].label),
      "aria-pressed": t[r],
      title: n(Wo[r].title),
      onMouseDown: (a) => a.preventDefault(),
      onClick: () => e(r),
      children: Wo[r].glyph
    },
    r
  )) });
}
function zh(t) {
  if (!(t.metaKey || t.ctrlKey) || t.altKey || t.shiftKey) return null;
  const e = t.key.toLowerCase();
  return e === "b" ? "bold" : e === "i" ? "italic" : null;
}
function Fh(t, e, n, r, a) {
  return e !== n ? { runs: tm(t, e, n, a), start: e, end: n, pending: r } : { runs: t, start: e, end: n, pending: r.includes(a) ? r.filter((i) => i !== a) : [...r, a] };
}
function uS({
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
  const [c, u] = G.useState(
    () => a ? { runs: xi(r, !0), start: -1, end: -1, pending: [] } : null
  ), d = G.useRef(!1);
  if (c)
    return /* @__PURE__ */ g.jsx(
      dS,
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
  const f = (h) => {
    const v = t.current, m = (v == null ? void 0 : v.selectionStart) ?? e.length, y = (v == null ? void 0 : v.selectionEnd) ?? e.length;
    d.current = !0, u(Fh(xi(e, !1), m, y, [], h));
  };
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx(Lh, { state: Ah, onToggle: f }),
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
          d.current || (e !== r && o(e, h.currentTarget.scrollHeight), s());
        },
        onKeyDown: (h) => {
          h.stopPropagation();
          const v = zh(h);
          if (v) {
            h.preventDefault(), f(v);
            return;
          }
          h.key === "Escape" && h.currentTarget.blur();
        }
      }
    )
  ] });
}
function dS({
  start: t,
  templateText: e,
  wasRich: n,
  style: r,
  onCommit: a,
  onEditEnd: i,
  onFocus: o
}) {
  const s = G.useRef(null), l = G.useRef(t.runs), c = G.useRef({ marks: t.pending, at: t.start }), [u, d] = G.useState(Ah), f = () => {
    const y = s.current;
    if (!y) return;
    const w = So(y);
    if (!w) return;
    c.current.marks.length && (w.start !== w.end || w.start !== c.current.at) && (c.current = { marks: [], at: -1 });
    const S = Jo(l.current, w.start, w.end), C = Jc(S, c.current.marks);
    d({ bold: !!C.bold, italic: !!C.italic, sup: !!C.sup, sub: !!C.sub });
  };
  G.useLayoutEffect(() => {
    const y = s.current;
    if (!y) return;
    Qc(y, l.current), y.focus({ preventScroll: !0 });
    const w = l.current.reduce((k, M) => k + M.text.length, 0), S = t.start < 0 ? w : t.start, C = t.end < 0 ? w : t.end;
    nu(y, S, C), c.current.at < 0 && (c.current.at = S), f();
  }, []), G.useEffect(() => {
    const y = () => f(), w = s.current, S = (C) => {
      !c.current.marks.length || C.isComposing || C.inputType !== "insertText" || !C.data || (C.preventDefault(), m(C.data));
    };
    return document.addEventListener("selectionchange", y), w == null || w.addEventListener("beforeinput", S), () => {
      document.removeEventListener("selectionchange", y), w == null || w.removeEventListener("beforeinput", S);
    };
  }, []);
  const h = (y, w, S) => {
    const C = s.current;
    C && (l.current = y, Qc(C, y), nu(C, w, S), f());
  }, v = (y) => {
    const w = s.current;
    if (!w) return;
    const S = So(w) ?? { start: c.current.at, end: c.current.at }, C = Math.min(S.start, S.end), k = Math.max(S.start, S.end), M = Fh(l.current, C, k, c.current.marks, y);
    c.current = { marks: M.pending, at: C }, C !== k ? h(M.runs, C, k) : f();
  }, m = (y) => {
    const w = s.current;
    if (!w) return;
    const S = So(w);
    if (!S) return;
    const C = Math.min(S.start, S.end), k = Math.max(S.start, S.end), M = Jc(Jo(l.current, C, C === k ? C : k), c.current.marks);
    c.current = { marks: [], at: -1 }, h(em(l.current, C, k, y, M), C + y.length, C + y.length);
  };
  return /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
    /* @__PURE__ */ g.jsx(Lh, { state: u, onToggle: v }),
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
          l.current = sm(y.currentTarget), f();
        },
        onPaste: (y) => {
          y.preventDefault(), m(y.clipboardData.getData("text/plain").replace(/\r\n?/g, `
`));
        },
        onBlur: (y) => {
          const w = of(l.current);
          (w.text !== e || w.rich !== n) && a(w.text, y.currentTarget.scrollHeight, w.rich), i();
        },
        onKeyDown: (y) => {
          if (y.stopPropagation(), y.nativeEvent.isComposing) return;
          const w = zh(y);
          if (w) {
            y.preventDefault(), v(w);
            return;
          }
          if (y.key === "Escape") {
            y.currentTarget.blur();
            return;
          }
          if (y.key === "Enter") {
            y.preventDefault(), m(`
`);
            return;
          }
          c.current.marks.length && y.key.length === 1 && !y.metaKey && !y.ctrlKey && !y.altKey && (y.preventDefault(), m(y.key));
        }
      }
    )
  ] });
}
function fS(t, e) {
  if (e.italic === !0 ? t.italic = !0 : e.italic === !1 && delete t.italic, typeof e.color == "string" ? t.color = e.color.toLowerCase() : e.color === null && delete t.color, e.align === "center" || e.align === "right" ? t.align = e.align : e.align === "left" && delete t.align, e.markerSigns) {
    const n = of(rm(xi(t.text, t.rich)));
    n.rich && (t.text = n.text, t.rich = !0);
  }
}
const pS = "#1e293b";
function hS({
  texts: t,
  onChange: e
}) {
  const { t: n } = Pt();
  if (!t.length) return null;
  const r = [...new Set(t.map((i) => i.color ?? pS))], a = [...new Set(t.map((i) => i.align ?? "left"))];
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
function gS() {
  const { t } = Pt();
  return /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: t("This text has formatting; double-click it on the page to edit it.") });
}
function vS(t) {
  if (!(t.metaKey || t.ctrlKey) || t.altKey) return null;
  const { key: e, code: n } = t;
  return e === "0" || n === "Digit0" || n === "Numpad0" ? "fit" : e === "1" || n === "Digit1" || n === "Numpad1" ? "actual" : e === "2" || n === "Digit2" || n === "Numpad2" ? "selection" : e === "=" || e === "+" || n === "Equal" || n === "NumpadAdd" ? "in" : e === "-" || e === "_" || n === "Minus" || n === "NumpadSubtract" ? "out" : null;
}
function mS(t) {
  if (!t.length) return null;
  const e = Math.min(...t.map((i) => i.x)), n = Math.min(...t.map((i) => i.y)), r = Math.max(...t.map((i) => i.x + i.width)), a = Math.max(...t.map((i) => i.y + i.height));
  return { x: e, y: n, width: Math.max(1, r - e), height: Math.max(1, a - n) };
}
function xS(t, e) {
  const n = { width: e.width - 36, height: e.height - 36 };
  if (n.width <= 0 || n.height <= 0) return null;
  const r = Math.min(n.width / t.width, n.height / t.height);
  return Math.max(0.1, Math.min(4, Math.floor(r * 100) / 100));
}
function yS(t) {
  const e = t;
  return !e || typeof e.closest != "function" ? !1 : !!e.closest("input, textarea, select, [contenteditable='true'], [contenteditable='']") || e.isContentEditable === !0;
}
const _d = (t) => t.key === " " || t.code === "Space";
function bS({ canvasEl: t, zoom: e, setZoom: n, fitZoom: r, stepZoom: a, items: i, selected: o }) {
  const s = G.useRef(null), l = (d) => {
    if (!t) return;
    const f = d.length ? i.filter((m) => d.includes(m.templateId)) : i, h = mS(f);
    if (!h) {
      r();
      return;
    }
    const v = xS(h, { width: t.clientWidth, height: t.clientHeight });
    v !== null && (s.current = { x: h.x + h.width / 2, y: h.y + h.height / 2 }, v === e ? c() : n(v));
  }, c = () => {
    const d = s.current;
    if (!t || !d) return;
    s.current = null;
    const f = t.querySelector(".gl-layout-zoom"), h = t.getBoundingClientRect(), v = f == null ? void 0 : f.getBoundingClientRect(), m = v ? v.left - h.left + t.scrollLeft : 0, y = v ? v.top - h.top + t.scrollTop : 0;
    t.scrollLeft = Math.max(0, m + d.x * e - t.clientWidth / 2), t.scrollTop = Math.max(0, y + d.y * e - t.clientHeight / 2);
  };
  G.useLayoutEffect(c, [e, t]);
  const u = G.useRef({ zoomTo: l, selected: o, setZoom: n, fitZoom: r, stepZoom: a });
  return u.current = { zoomTo: l, selected: o, setZoom: n, fitZoom: r, stepZoom: a }, G.useEffect(() => {
    if (!t) return;
    const d = (f) => {
      var S;
      const h = vS(f);
      if (!h) return;
      const v = f.target, m = t.closest(".gl-layout-tab"), y = (S = v == null ? void 0 : v.closest) == null ? void 0 : S.call(v, ".gl-layout-canvas-scroll, .gl-layout-controls");
      if (!y || m && !m.contains(y)) return;
      f.preventDefault(), f.stopPropagation();
      const w = u.current;
      h === "fit" ? w.fitZoom() : h === "actual" ? w.setZoom(1) : h === "selection" ? w.zoomTo(w.selected) : w.stepZoom(h === "in" ? 1 : -1);
    };
    return window.addEventListener("keydown", d, !0), () => window.removeEventListener("keydown", d, !0);
  }, [t]), G.useEffect(() => {
    if (!t) return;
    let d = !1, f = !1, h = null, v = !1;
    const m = () => {
      h ? t.dataset.pan = "active" : f ? t.dataset.pan = "ready" : delete t.dataset.pan;
    }, y = (x) => x instanceof Node && t.contains(x), w = (x) => {
      d = y(x.target);
    }, S = (x) => {
      !_d(x) || x.metaKey || x.ctrlKey || x.altKey || yS(x.target) || !f && !d && !y(x.target) || (x.preventDefault(), x.stopPropagation(), f || (f = !0, m()));
    }, C = () => {
      f = !1, h = null, m();
    }, k = (x) => {
      !_d(x) || !f || (x.preventDefault(), x.stopPropagation(), f = !1, m());
    }, M = (x) => {
      y(x.target) && (f || x.button === 1) && x.stopPropagation();
    }, E = (x) => {
      !y(x.target) || !(f || x.button === 1) || (x.preventDefault(), x.stopPropagation(), h = { x: x.clientX, y: x.clientY, left: t.scrollLeft, top: t.scrollTop }, m());
    }, D = (x) => {
      w(x), h && (x.preventDefault(), t.scrollLeft = h.left - (x.clientX - h.x), t.scrollTop = h.top - (x.clientY - h.y));
    }, _ = (x) => {
      h && (x.preventDefault(), x.stopPropagation(), h = null, v = !0, window.setTimeout(() => {
        v = !1;
      }, 0), m());
    }, j = (x) => {
      (f || v) && y(x.target) && (x.preventDefault(), x.stopPropagation(), v = !1);
    };
    return window.addEventListener("mouseover", w, !0), window.addEventListener("keydown", S, !0), window.addEventListener("keyup", k, !0), window.addEventListener("blur", C), window.addEventListener("pointerdown", M, !0), window.addEventListener("mousedown", E, !0), window.addEventListener("mousemove", D, !0), window.addEventListener("mouseup", _, !0), window.addEventListener("click", j, !0), window.addEventListener("dblclick", j, !0), window.addEventListener("auxclick", j, !0), () => {
      window.removeEventListener("mouseover", w, !0), window.removeEventListener("keydown", S, !0), window.removeEventListener("keyup", k, !0), window.removeEventListener("blur", C), window.removeEventListener("pointerdown", M, !0), window.removeEventListener("mousedown", E, !0), window.removeEventListener("mousemove", D, !0), window.removeEventListener("mouseup", _, !0), window.removeEventListener("click", j, !0), window.removeEventListener("dblclick", j, !0), window.removeEventListener("auxclick", j, !0), delete t.dataset.pan;
    };
  }, [t]), { zoomToSelection: l };
}
function jd(t, e, n) {
  const r = t.sheets.findIndex((o) => o.id === e), a = Math.max(0, Math.min(t.sheets.length - 1, n));
  if (r < 0 || r === a) return !1;
  const [i] = t.sheets.splice(r, 1);
  return t.sheets.splice(a, 0, i), !0;
}
function wS(t, e, n, r) {
  const a = t.findIndex((o) => o.id === e), i = t.findIndex((o) => o.id === n) + (r === "after" ? 1 : 0);
  return i > a ? i - 1 : i;
}
function SS(t, e) {
  const n = t.sheets.find((a) => a.id === e);
  if (!n) return;
  const r = {
    ...n,
    id: crypto.randomUUID(),
    page: { ...n.page },
    ...n.iteration ? { iteration: structuredClone(n.iteration) } : {},
    name: `${n.name} copy`,
    // Headings that read from a plot read the copy's plot, not the original sheet's.
    items: gi(n.items).copies
  };
  t.sheets.push(r), t.activeSheetId = r.id;
}
function CS(t, e) {
  if (t.sheets.length <= 1) return;
  const n = t.sheets.findIndex((r) => r.id === e);
  n < 0 || (t.sheets.splice(n, 1), t.activeSheetId === e && (t.activeSheetId = t.sheets[Math.max(0, n - 1)].id));
}
function kS({ workspace: t, mutate: e, rename: n, openMenu: r, clearSelection: a }) {
  const { t: i } = Pt(), o = G.useRef(null), s = (d, f) => {
    const h = { ...t, sheets: [...t.sheets] };
    jd(h, d, f) && e((v) => {
      jd(v, d, f);
    });
  }, l = (d) => {
    const f = d.currentTarget.getBoundingClientRect();
    return d.clientX > f.left + f.width / 2 ? "after" : "before";
  }, c = (d) => {
    const f = t.sheets.findIndex((v) => v.id === d), h = t.sheets.length - 1;
    return [
      { label: i("Move left"), disabled: f <= 0, onClick: () => s(d, f - 1) },
      { label: i("Move right"), disabled: f >= h, onClick: () => s(d, f + 1) },
      "separator",
      { label: i("Rename"), onClick: () => n(d) },
      { label: i("Duplicate"), onClick: () => {
        e((v) => SS(v, d)), a();
      } },
      { label: i("Delete"), disabled: t.sheets.length <= 1, onClick: () => {
        e((v) => CS(v, d)), a();
      } }
    ];
  };
  return { tabProps: (d) => ({
    draggable: !0,
    onDragStart: (f) => {
      var h;
      o.current = d, (h = f.dataTransfer) == null || h.setData("text/plain", d), f.dataTransfer && (f.dataTransfer.effectAllowed = "move");
    },
    onDragOver: (f) => {
      !o.current || o.current === d || (f.preventDefault(), f.currentTarget.dataset.drop = l(f));
    },
    onDragLeave: (f) => {
      delete f.currentTarget.dataset.drop;
    },
    onDrop: (f) => {
      const h = o.current;
      delete f.currentTarget.dataset.drop, o.current = null, !(!h || h === d) && (f.preventDefault(), s(h, wS(t.sheets, h, d, l(f))));
    },
    onDragEnd: () => {
      o.current = null;
    },
    onContextMenu: (f) => {
      var v;
      f.preventDefault();
      const h = ((v = t.sheets.find((m) => m.id === d)) == null ? void 0 : v.name) ?? "";
      r({ x: f.clientX, y: f.clientY, items: c(d), label: h });
    }
  }), menuFor: c };
}
const Id = "layout-sheets", Rd = 72 / 25.4;
function ES(t, e) {
  const n = URL.createObjectURL(t), r = document.createElement("a");
  r.href = n, r.download = e, document.body.appendChild(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 1e3);
}
function MS(t, e) {
  const n = /* @__PURE__ */ new Map();
  return t.map(({ sheet: r, pages: a }) => {
    const i = pi(r.name) || "layout", o = (n.get(i) ?? 0) + 1;
    n.set(i, o);
    const s = o > 1 ? `${i}-${o}` : i;
    return a.length === 1 ? [`${s}/${i}.${e}`] : a.map((l, c) => {
      const u = l.label ? pi(l.label) : "";
      return `${s}/${i}-p${c + 1}${u ? `-${u}` : ""}.${e}`;
    });
  });
}
const DS = (t) => `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
async function TS(t, e) {
  const n = t.filter(({ pages: l }) => l.length > 0);
  if (!n.length) return;
  if (e === "svg" || e === "png") {
    const l = MS(n, e), c = {};
    for (const [u, { sheet: d, pages: f }] of n.entries())
      for (const [h, v] of f.entries()) {
        const m = l[u][h];
        if (e === "svg") c[m] = Fd(DS(v.root));
        else {
          const y = await Xr(v, d.page.dpi);
          c[m] = new Uint8Array(await (await qo(y, d.page.dpi)).arrayBuffer()), await hi();
        }
      }
    ES(new Blob([Ko(c)], { type: "application/zip" }), `${Id}.zip`);
    return;
  }
  const r = (l) => {
    const c = l.widthMm * Rd, u = l.heightMm * Rd;
    return { width: c, height: u, orientation: c >= u ? "landscape" : "portrait" };
  }, { jsPDF: a } = await import("./jspdf.es.min-BVIPXLY0.js").then((l) => l.j), i = r(n[0].pages[0]), o = new a({ orientation: i.orientation, unit: "pt", format: [i.width, i.height], compress: !0 });
  let s = 0;
  for (const { sheet: l, pages: c } of n)
    for (const u of c) {
      const { width: d, height: f, orientation: h } = r(u);
      if (s > 0 && o.addPage([d, f], h), s += 1, !await Bd(o, u.root, { width: d, height: f })) {
        const v = await Xr(u, l.page.dpi);
        o.addImage(v, "PNG", 0, 0, d, f, void 0, "FAST");
      }
      await hi();
    }
  o.save(`${Id}.pdf`);
}
function _S(t) {
  const e = G.useRef(t);
  e.current = t;
  const [n, r] = G.useState(null), a = t.workspace.sheets.filter((o) => o.items.length > 0);
  return { exportAll: async () => {
    var c, u, d, f, h;
    const o = e.current;
    if (o.exporting || !o.page) return;
    const s = o.workspace.sheets.filter((v) => v.items.length > 0);
    if (!s.length) return;
    const l = {
      sheetId: o.workspace.activeSheetId,
      page: o.pageIndex,
      zoom: o.zoom,
      left: ((c = o.canvas) == null ? void 0 : c.scrollLeft) ?? 0,
      top: ((u = o.canvas) == null ? void 0 : u.scrollTop) ?? 0,
      selected: [...o.selectedIds]
    };
    o.setExporting(!0);
    try {
      const v = [];
      for (const [m, y] of s.entries()) {
        r({ n: m + 1, count: s.length }), e.current.workspace.activeSheetId !== y.id && e.current.showSheet(y.id), e.current.setPageIndex(0), await e.current.settle();
        const w = [], S = e.current.pages;
        for (let C = 0; C < Math.max(1, S.length); C++) {
          S.length > 1 && (e.current.setPageIndex(C), await e.current.settle());
          const k = e.current;
          if (!k.page) throw new Error("The page went away during the export.");
          const M = ((d = S[C]) == null ? void 0 : d.units.length) === 1 ? S[C].units[0].name : void 0;
          w.push(...vh(k.page, y, { zoom: k.zoom, crop: k.crop }).map((E) => M ? { ...E, label: M } : E));
        }
        v.push({ sheet: y, pages: w });
      }
      await TS(v, o.format), (h = (f = e.current).onExported) == null || h.call(f);
    } catch (v) {
      e.current.onError(v instanceof Error ? v.message : String(v));
    } finally {
      e.current.workspace.activeSheetId !== l.sheetId && e.current.showSheet(l.sheetId), e.current.setPageIndex(l.page), await e.current.settle(), e.current.setZoom(l.zoom), await e.current.settle();
      const v = e.current.canvas;
      v && (v.scrollLeft = l.left, v.scrollTop = l.top), e.current.setSelectedIds(l.selected), r(null), e.current.setExporting(!1);
    }
  }, progress: n, canExport: a.length > 0 };
}
const jS = [
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
], Bh = "gatelab.layout.keysOpen";
function IS() {
  try {
    return localStorage.getItem(Bh) === "1";
  } catch {
    return !1;
  }
}
function RS() {
  const { t } = Pt(), [e, n] = G.useState(IS);
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
            localStorage.setItem(Bh, a ? "1" : "0");
          } catch {
          }
        }
      },
      children: [
        /* @__PURE__ */ g.jsx(ia, { children: t("Keys") }),
        jS.map((r) => /* @__PURE__ */ g.jsxs("section", { children: [
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
const PS = G.lazy(ef("LayoutImageWall", async () => ({ default: (await import("./LayoutImageWall-C5BrZhiC.js")).LayoutImageWall }))), NS = G.lazy(ef("LayoutCellPanel", async () => ({ default: (await import("./LayoutCellPanel-CjRcVbyw.js")).LayoutCellPanel }))), li = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), Fr = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], Yo = 10, OS = { index: 0, units: [], items: [] }, AS = {}, Pd = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, LS = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], zS = [
  { how: "horizontal", label: "Distribute ↔", title: "Equal spacing between three or more items or groups, left to right; the outer two stay where they are" },
  { how: "vertical", label: "Distribute ↕", title: "Equal spacing between three or more items or groups, top to bottom; the outer two stay where they are" }
];
function FS(t) {
  var n, r, a;
  if (!t) return;
  t.stopDrag();
  const e = (n = t.getManager) == null ? void 0 : n.call(t);
  for (const i of ((r = e == null ? void 0 : e.getMoveables) == null ? void 0 : r.call(e)) ?? []) i !== e && ((a = i.stopDrag) == null || a.call(i));
}
function BS(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function GS(t, e, n) {
  return e ? n.some((r) => !!r && (t === `${e} · ${r}` || t.startsWith(`${e} · ${r} · `))) : !1;
}
const $S = 128;
function Nd(t, e, n) {
  const r = tf(t);
  return t.recipe.kind !== "biplot" && t.recipe.kind !== "histogram" ? Kc(r) : Kc(Math.min(r, Math.min(e, n) / $S));
}
function Ae(t, e, n) {
  var s, l, c;
  const r = t.recipe;
  if (r.kind === "text") return af(r).split(`
`)[0] || "Text";
  if ((s = r.title) != null && s.trim() && r.title.trim() !== Jd) return r.title.trim();
  if (r.kind === "figure") return ((c = (l = r.illustration.figure) == null ? void 0 : l.name) == null ? void 0 : c.trim()) || "Figure";
  if (r.kind === "proportions") {
    const u = r.settings.valueKind === "cells" ? `${r.settings.channel || "Channel"} per cell` : r.settings.valueKind === "statistic" ? Bs(r.settings.statistic, r.settings.channel || "channel") : r.settings.plotType === "box" ? "Boxplot" : "Composition";
    if (!r.panel) return u;
    if ("legend" in r.panel) return `${u} · legend`;
    const d = [r.panel.population, r.panel.group, r.panel.facet, r.panel.channel, r.panel.page === void 0 ? void 0 : `page ${r.panel.page}`].filter((f) => f !== void 0 && f !== "");
    return d.length ? `${u} · ${d.join(" · ")}` : u;
  }
  if (r.kind === "imagewall") return `${r.populationName || "Population"} · ${r.fileName || "images"}`;
  if (r.kind === "cellpanel") return `${r.cells.length} ${r.cells.length === 1 ? "cell" : "cells"} · ${r.fileName || "images"}`;
  if (r.kind === "shape") return Rh(r);
  if (r.kind === "image") return r.fileName;
  const a = e.find(({ id: u }) => u === r.sampleId), i = a == null ? void 0 : a.tree.populations[r.populationId];
  if (r.kind === "chart") return `${(i == null ? void 0 : i.name) ?? "Population"} · ${qs[r.statistic]}`;
  if (r.kind === "strategy")
    return `${(i == null ? void 0 : i.name) ?? "Population"} strategy`;
  const o = na(r);
  return o ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${o.length} ${Qd("files")}` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function na(t) {
  return (t.kind === "biplot" || t.kind === "histogram") && t.pool && t.pool.sampleIds.length > 1 ? t.pool.sampleIds : null;
}
function fr(t, e, n, r) {
  var c;
  const a = ((c = t.pool) == null ? void 0 : c.sampleIds) ?? [t.sampleId], i = e.find(({ id: u }) => u === t.sampleId) ?? e.find(({ id: u }) => a.includes(u)) ?? null, o = [], s = [];
  if (!i) return { members: o, leftOut: s };
  const l = t.kind === "histogram" ? null : t.yChannel;
  for (const u of [i.id, ...a.filter((d) => d !== i.id)]) {
    const d = e.find((v) => v.id === u);
    if (!d) {
      s.push({ name: u, reason: "not loaded" });
      continue;
    }
    const f = gn(t.populationId, d.tree, n, r ?? i.tree.id);
    if (f.missing) {
      s.push({ name: d.name, reason: "no corresponding population" });
      continue;
    }
    const h = d === i ? null : mv(i.sample, d.sample, t.xChannel, l);
    if (h) {
      s.push({ name: d.name, reason: h });
      continue;
    }
    o.push({ id: d.id, name: d.name, sample: d.sample, tree: d.tree, gating: d.derived, populationId: f.id });
  }
  return { members: o, leftOut: s };
}
function WS({
  files: t,
  pool: e,
  checkedSampleIds: n,
  groups: r,
  fileGroups: a,
  report: i,
  onChange: o
}) {
  const { t: s } = Pt(), [l, c] = G.useState(""), u = G.useMemo(
    () => Object.fromEntries(t.filter((m) => m.metadata).map((m) => [m.id, m.metadata])),
    [t]
  ), d = G.useMemo(
    () => Ev(u, [...new Set(Object.values(u).flatMap((m) => Object.keys(m)))].map((m) => ({ name: m }))),
    [u]
  ), f = G.useMemo(() => new Set(t.filter((m) => !e.includes(m.id)).map((m) => m.id)), [t, e]), h = (m) => t.filter((y) => m instanceof Set ? m.has(y.id) : m.includes(y.id)).map((y) => y.id), v = l.trim().toLowerCase();
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-pool", children: [
    /* @__PURE__ */ g.jsxs("div", { className: "gl-figure-actions gl-figure-list-actions", children: [
      /* @__PURE__ */ g.jsx("button", { type: "button", onClick: () => o(h(n)), children: s("Checked files") }),
      /* @__PURE__ */ g.jsx("button", { type: "button", onClick: () => o(t.map((m) => m.id)), children: s("All files") }),
      r.map((m) => /* @__PURE__ */ g.jsx("button", { type: "button", onClick: () => o(t.filter((y) => a[y.id] === m.id).map((y) => y.id)), children: s("Group {name}", { name: m.name }) }, m.id))
    ] }),
    /* @__PURE__ */ g.jsx(
      "input",
      {
        type: "search",
        "aria-label": s("Find files to pool"),
        placeholder: s("Find file / sample…"),
        value: l,
        onChange: (m) => c(m.target.value)
      }
    ),
    /* @__PURE__ */ g.jsx("div", { className: "gl-figure-list gl-layout-pool-list", children: t.filter((m) => !v || `${m.name} ${m.fileName ?? ""}`.toLowerCase().includes(v)).map((m) => /* @__PURE__ */ g.jsxs("label", { className: "gl-figure-row", title: m.fileName && m.fileName !== m.name ? `${m.name} · ${m.fileName}` : m.name, children: [
      /* @__PURE__ */ g.jsx(
        "input",
        {
          type: "checkbox",
          checked: e.includes(m.id),
          onChange: () => o(e.includes(m.id) ? e.filter((y) => y !== m.id) : h([...e, m.id]))
        }
      ),
      /* @__PURE__ */ g.jsx("span", { className: "gl-figure-row-name", children: m.name })
    ] }, m.id)) }),
    d.length > 0 && /* @__PURE__ */ g.jsx("div", { className: "gl-sample-facets gl-figure-facets", "aria-label": s("Select pooled files by metadata"), children: d.map((m) => /* @__PURE__ */ g.jsxs("div", { className: "gl-sample-facet-row", children: [
      /* @__PURE__ */ g.jsx("span", { className: "gl-sample-facet-lock", "aria-hidden": "true" }),
      /* @__PURE__ */ g.jsx("span", { className: "gl-sample-facet-name", title: m.name, children: m.name }),
      /* @__PURE__ */ g.jsx("div", { className: "gl-sample-facet-values", children: m.values.map((y) => {
        const w = Mv(y.sampleIds, f), S = y.sampleIds.length, C = w === S ? "all" : w === 0 ? "none" : "some", k = S > 0 ? Math.round(w / S * 100) : 0;
        return /* @__PURE__ */ g.jsxs(
          "button",
          {
            type: "button",
            className: `gl-sample-facet-chip is-${C}`,
            style: C === "some" ? { "--gl-facet-fill": `${k}%` } : void 0,
            "aria-pressed": w === S,
            title: `${y.value}: ${w} of ${S} pooled — ${w === S ? `click to drop all ${S}` : `click to pool all ${S}`}`,
            onClick: () => o(h(new Set(t.filter((M) => !Dv(y.sampleIds, f).has(M.id)).map((M) => M.id)))),
            children: [
              /* @__PURE__ */ g.jsx("span", { className: "gl-sample-facet-label", children: y.value }),
              /* @__PURE__ */ g.jsxs("span", { className: "gl-sample-facet-count", children: [
                w,
                "/",
                S
              ] })
            ]
          },
          y.value
        );
      }) })
    ] }, m.name)) }),
    i && /* @__PURE__ */ g.jsxs("p", { className: "gl-hint", children: [
      s("{n} of {m} files pooled", { n: i.pooled, m: i.total }),
      i.leftOut.length > 0 && ` · ${s("Not pooled: {files}", { files: i.leftOut.map((m) => `${m.name} (${m.reason})`).join(", ") })}`,
      i.omittedGates.length > 0 && ` · ${s("Gates not shown: {names} — they differ between the pooled files", { names: i.omittedGates.join(", ") })}`
    ] })
  ] });
}
const Od = ["#2671c6", "#bc642c", "#69882b", "#8855a6", "#15938c", "#b74169"];
function YS(t) {
  if (!t.length) return null;
  const e = t.map((o) => Zd(o)), n = e.every(Boolean) && new Set(e).size === e.length, r = t.map((o, s) => ({
    x: o.plot.x,
    y: o.plot.y,
    name: o.name,
    color: n ? e[s] : Od[s % Od.length]
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
function XS({
  populations: t,
  tree: e,
  chosen: n,
  onChange: r
}) {
  const { t: a } = Pt();
  return /* @__PURE__ */ g.jsx(
    Tv,
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
          color: Zd(e.populations[i])
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
function HS({
  item: t,
  samples: e,
  state: n,
  globalScales: r,
  dataRevision: a,
  densityColorPower: i,
  style: o,
  canvasScale: s,
  titleTemplate: l,
  describe: c
}) {
  var R;
  const u = G.useRef(null), d = t.recipe, f = JSON.stringify(o), h = G.useMemo(() => Dn(n), [n]), v = d.kind === "text" ? null : e.find(({ id: N }) => N === d.sampleId) ?? null, m = na(d), y = (m == null ? void 0 : m.join("|")) ?? "", w = G.useMemo(
    () => y ? y.split("|").map((N) => e.find((F) => F.id === N) ?? null) : null,
    [e, y]
  ), S = v ? { ...n, ...v.tree } : n, C = d.kind !== "text" && t.templateSampleId && t.templateSampleId !== d.sampleId ? e.find(({ id: N }) => N === t.templateSampleId) ?? null : null, k = (d.kind === "biplot" || d.kind === "histogram") && d.populationIds && d.populationIds.length > 1 ? d.populationIds : null, M = k && v ? k.flatMap((N) => {
    const F = gn(N, v.tree, h, C == null ? void 0 : C.tree.id);
    return F.missing ? [] : [{ asked: N, id: F.id }];
  }) : [], E = d.kind === "text" || !v ? { id: d.kind === "text" ? "" : d.populationId, missing: !1 } : M.length ? { id: M[0].id, missing: !1 } : gn(d.populationId, v.tree, h, C == null ? void 0 : C.tree.id), D = E.id, _ = E.missing ? ((R = C == null ? void 0 : C.tree.populations[d.kind === "text" ? "" : d.populationId]) == null ? void 0 : R.name) ?? "the population" : null, j = d.kind === "text" ? null : c({ ...d, populationId: D, ...k ? { populationIds: M.map((N) => N.id) } : {} }, void 0, t.unitId), I = ((N) => j ? fi(N, j) : N)(l), P = JSON.stringify(d);
  return G.useEffect(() => {
    const N = u.current;
    if (!N || d.kind === "text") return;
    N.dataset.layoutPending = "1";
    const F = () => {
      var vt, nt, pt, jt;
      if (N.innerHTML = "", !v) {
        N.textContent = Qd("The referenced file is unavailable or still loading."), N.className = "gl-layout-plot-host is-missing";
        return;
      }
      const z = S.populations[D];
      if (!(d.kind === "strategy" && !!((vt = d.populationIds) != null && vt.length)) && (_ || !z)) {
        N.textContent = _ ? `${v.name} has no population corresponding to ${_}.` : "The referenced population is unavailable.", N.className = "gl-layout-plot-host is-missing";
        return;
      }
      N.className = "gl-layout-plot-host";
      const Y = Math.max(120, t.width - 8), V = Math.max(120, t.height - 8);
      if (d.kind === "strategy" && ((nt = d.populationIds) != null && nt.length)) {
        const st = v.tree, lt = st.root_population_id ?? "", xt = d.populationIds.map(($e) => gn($e, st, h, C == null ? void 0 : C.tree.id)).filter(($e) => !$e.missing).map(($e) => $e.id), Ct = Nv(v.sample, st.gates, st.populations, lt, v.derived.masks, xt, { maxEvents: o.maxEvents, globalScales: r }), Mt = Math.max(1, d.columns ?? 4), ht = d.layout === "flow" ? Ov(Ct, Mt, st.populations) : Av(Ct, st.populations);
        if (!ht.length) {
          N.textContent = `${v.name} has none of the strategy's populations.`, N.className = "gl-layout-plot-host is-missing";
          return;
        }
        const yt = d.showArrows !== !1, Et = yt ? Lv(ht, st.populations) : [], Ht = yt ? zv(Et) : 8, Vt = yt ? Fv(Et) : 8, Gt = Math.max(120, Math.min(800, d.plotSize ?? 200));
        N.removeAttribute("id");
        const mt = document.createElement("div");
        mt.id = `layout-strategy-${t.id}`, mt.style.width = "max-content", N.appendChild(mt);
        const pe = ($e) => {
          const We = Yv(ht, {
            displayMode: d.displayMode,
            plotSize: Gt,
            contourThreshold: o.contourThreshold,
            contourLevels: o.contourLevels,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateLabelFormat: o.gateLabels,
            gateLabelBold: d.gateLabelBold,
            labelBackground: d.labelBackground,
            gridGap: Ht,
            gridRowGap: Vt,
            canvasScale: s * $e,
            fontSizes: li(o),
            contextTitle: I
          });
          wo().renderMultiStrategyGrid(mt.id, We);
        };
        pe(1), yt && Bv(mt);
        const me = mt.scrollWidth, xn = mt.scrollHeight, yn = me > 0 && xn > 0 ? Math.max(0.1, Math.min(4, Y / me, V / xn)) : 1;
        Math.abs(yn - 1) > 0.01 && (mt.style.zoom = String(yn), pe(yn)), Gv(mt, Et, { color: d.arrowColor ?? (o.pubStyle ? "#444444" : null), width: d.arrowWidth ?? 1.5, anchor: d.arrowAnchor ?? "label" });
        return;
      }
      if (d.kind === "strategy") {
        const st = $v(
          v.sample,
          S.gates,
          S.populations,
          S.root_population_id ?? "",
          D,
          { fullPath: d.fullPath, maxEvents: o.maxEvents }
        ), lt = 8, xt = 26, Ct = Math.max(1, st.length);
        let Mt = 1, ht = 0;
        for (let Et = 1; Et <= Ct; Et++) {
          const Ht = Math.ceil(Ct / Et), Vt = Math.floor((Y - lt * (Et - 1)) / Et), Gt = Math.floor((V - xt - lt * (Ht - 1)) / Ht), mt = Math.min(Vt, Gt);
          mt > ht && (ht = mt, Mt = Et);
        }
        ht = Math.max(100, Math.min(800, ht));
        const yt = Wv(
          v.sample,
          st,
          null,
          r,
          {
            gateView: ["forward"],
            displayMode: d.displayMode,
            maxEvents: o.maxEvents,
            nColumns: Mt,
            plotSize: ht,
            fitToColumns: !1,
            contourThreshold: o.contourThreshold,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateLabelFormat: o.gateLabels,
            fontSizes: li(o),
            contextTitle: I
          }
        );
        N.id = `layout-strategy-${t.id}`;
        for (const Et of Object.values(yt.plots ?? {})) Et.canvas_scale = s;
        wo().renderStrategyGrid(N.id, yt);
        return;
      }
      const W = Math.max(120, Math.min(Y, V)), tt = d.kind === "histogram" ? null : d.yChannel, J = d.kind === "histogram" && d.histOverlayMode ? d.histOverlayMode : "front_opaque", rt = {
        displayMode: d.displayMode,
        maxEvents: o.maxEvents,
        nColumns: 1,
        plotSize: W,
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
        histOverlayMode: J,
        histLayout: "grid",
        ridgeOverlap: 0.7,
        ridgeColGap: 8,
        ridgeGradient: !1,
        pubStyle: o.pubStyle,
        gateLineWidth: o.gateLineWidth,
        gateLabelFormat: o.gateLabels,
        fontSizes: li(o),
        scaleFontsWithPlot: !0,
        // A population with no events is drawn as its axes and gates, as the Illustration tab
        // draws it, rather than replaced by a message.
        includeEmpty: !0
      }, Q = (st, lt, xt = "#334155") => wo().renderMiniPlot(N, {
        ...st,
        display_mode: d.displayMode,
        plot_size: W,
        canvas_scale: s,
        contour_threshold: o.contourThreshold,
        point_alpha: o.pointAlpha,
        density_color_power: i,
        point_size: o.pointSize,
        kde_bandwidth: o.kdeBandwidth,
        hist_line_width: o.histLineWidth,
        hist_fill: o.histFill,
        hist_fill_alpha: o.histFillAlpha,
        hist_overlay_mode: J,
        title: I,
        contour_levels: o.contourLevels,
        font_sizes: li(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: xt,
        gates: lt
      }), at = M.filter((st) => S.populations[st.id]);
      if (at.length > 1) {
        const st = w ? at.flatMap(({ asked: xt, id: Ct }) => {
          const { members: Mt } = fr({ ...d, populationId: xt }, e, h, C == null ? void 0 : C.tree.id), ht = Mt.length ? qc(Mt, d.xChannel, tt, r, rt, h) : null, yt = S.populations[Ct];
          return ht ? [{ plot: ht.config, name: yt.name, colorSlot: yt.colorSlot, color: yt.color }] : [];
        }) : (() => {
          const xt = at.map((Mt) => Mt.id), Ct = Uc(
            v.sample,
            S.gates,
            Zc(S.populations, S.gates, S.gate_order, xt[0]),
            S.populations,
            v.derived.masks,
            v.derived.stats.event_count,
            xt,
            [d.xChannel],
            tt,
            r,
            rt,
            v.derived.gateMasks
          );
          return xt.flatMap((Mt) => {
            var Et;
            const ht = (Et = Ct.plots) == null ? void 0 : Et[`${Mt}|${d.xChannel}`], yt = S.populations[Mt];
            return ht && yt ? [{ plot: ht, name: yt.name, colorSlot: yt.colorSlot, color: yt.color }] : [];
          });
        })(), lt = YS(st);
        if (lt) {
          Q(lt.config, [], lt.color);
          return;
        }
      }
      if (w) {
        const { members: st } = fr(M.length ? { ...d, populationId: M[0].asked } : d, e, h, C == null ? void 0 : C.tree.id), lt = st.length ? qc(st, d.xChannel, tt, r, rt, h) : null;
        if (!lt) {
          N.textContent = "No events are available for this FCS/population combination.", N.className = "gl-layout-plot-host is-missing";
          return;
        }
        Q(lt.config, lt.gates);
        return;
      }
      const ft = Uc(
        v.sample,
        S.gates,
        // Only the plot's branch, as the Illustration and Gating tabs draw it: the gates drawn on
        // this population and its descendants, not every gate sharing these channels.
        Zc(S.populations, S.gates, S.gate_order, D),
        S.populations,
        v.derived.masks,
        v.derived.stats.event_count,
        [D],
        [d.xChannel],
        tt,
        r,
        rt,
        v.derived.gateMasks
      ), Z = `${D}|${d.xChannel}`, ut = (pt = ft.plots) == null ? void 0 : pt[Z];
      if (!ut) {
        N.textContent = "No events are available for this FCS/population combination.", N.className = "gl-layout-plot-host is-missing";
        return;
      }
      Q(ut, ((jt = ft.gate_overlays) == null ? void 0 : jt[Z]) ?? []);
    }, q = window.setTimeout(() => {
      try {
        F();
      } finally {
        delete N.dataset.layoutPending;
      }
    }, 80);
    return () => window.clearTimeout(q);
  }, [
    a,
    i,
    f,
    r,
    t.height,
    t.id,
    t.width,
    P,
    v,
    S.gate_order,
    S.gate_version,
    S.gates,
    S.stored_hierarchies,
    S.populations,
    S.root_population_id,
    D,
    _,
    s,
    I,
    w,
    h
  ]), d.kind === "text" ? /* @__PURE__ */ g.jsx(
    "div",
    {
      className: "gl-layout-text-surface",
      style: { fontSize: d.fontSize, fontWeight: d.bold ? 700 : 400 },
      children: d.text
    }
  ) : /* @__PURE__ */ g.jsx("div", { ref: u, className: "gl-layout-plot-host" });
}
function VS({
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
  describe: d,
  checkedSampleIds: f,
  metadataById: h,
  metadataLevels: v,
  files: m,
  sources: y,
  divisionProfiles: w,
  imageService: S,
  canvasScale: C,
  onTextChange: k,
  onTextFocus: M,
  textEditing: E,
  onTextEditStart: D,
  onTextEditEnd: _,
  onIsolate: j
}) {
  var R;
  const { t: x } = Pt(), I = tf(t), P = I === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / I)), height: Math.max(1, Math.round(t.height / I)) };
  return /* @__PURE__ */ g.jsx(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": I === 1 ? void 0 : I,
      "data-object-name": t.name || void 0,
      "data-rotation": t.rotation,
      title: `${t.locked ? `${x("Locked")} · ` : ""}${Ae(t, a)}`,
      "data-title": Ae(t, a),
      onDoubleClick: j ? (N) => {
        N.stopPropagation(), j();
      } : void 0,
      className: `gl-layout-item${r ? " is-selected" : ""}${t.showFrame ? " has-frame" : ""}${t.recipe.kind === "text" ? " is-text" : ""}${t.locked ? " is-locked" : ""}`,
      style: {
        left: t.x,
        top: t.y,
        width: t.width,
        height: t.height,
        zIndex: t.z
      },
      children: /* @__PURE__ */ g.jsx("div", { className: "gl-layout-item-body", style: I === 1 ? void 0 : { zoom: I, width: P.width, height: P.height }, children: t.recipe.kind === "text" ? /* @__PURE__ */ g.jsx(Td, { turn: t.rotation, width: P.width, height: P.height, children: /* @__PURE__ */ g.jsx(
        US,
        {
          text: t.recipe.text,
          templateText: e ?? t.recipe.text,
          fontSize: t.recipe.fontSize,
          bold: t.recipe.bold,
          format: t.recipe,
          editing: E,
          onEditStart: D,
          onEditEnd: _,
          onCommit: k,
          onFocus: M
        }
      ) }) : t.recipe.kind === "figure" ? /* @__PURE__ */ g.jsx(
        Rv,
        {
          recipe: t.recipe,
          files: m,
          sources: y,
          state: i,
          globalScales: o,
          width: Math.max(120, P.width - 8),
          height: Math.max(80, P.height - 8),
          columnLevels: v
        }
      ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ g.jsx(
        Pv,
        {
          recipe: t.recipe,
          samples: m,
          state: i,
          metadataById: h,
          divisionProfiles: w,
          width: Math.max(120, P.width - 8),
          height: Math.max(80, P.height - 8),
          containerId: `layout-proportions-${t.id}`,
          globalScales: o,
          chartFiles: n,
          dataRevision: s,
          metadataLevels: v,
          sheetStyle: c
        }
      ) : t.recipe.kind === "shape" ? /* @__PURE__ */ g.jsx(_h, { recipe: t.recipe, width: P.width, height: P.height }) : t.recipe.kind === "image" ? /* @__PURE__ */ g.jsx(Td, { turn: t.rotation, width: P.width, height: P.height, children: /* @__PURE__ */ g.jsx(qw, { recipe: t.recipe }) }) : t.recipe.kind === "cellpanel" ? /* @__PURE__ */ g.jsx(G.Suspense, { fallback: /* @__PURE__ */ g.jsx("div", { className: "gl-layout-plot-host" }), children: /* @__PURE__ */ g.jsx(
        NS,
        {
          recipe: t.recipe,
          service: S ?? null,
          width: Math.max(120, P.width - 8),
          height: Math.max(80, P.height - 8)
        }
      ) }) : t.recipe.kind === "imagewall" ? /* @__PURE__ */ g.jsx(G.Suspense, { fallback: /* @__PURE__ */ g.jsx("div", { className: "gl-layout-plot-host" }), children: /* @__PURE__ */ g.jsx(
        PS,
        {
          recipe: t.recipe,
          service: S ?? null,
          width: Math.max(120, P.width - 8),
          height: Math.max(80, P.height - 8)
        }
      ) }) : t.recipe.kind === "chart" ? /* @__PURE__ */ g.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ g.jsx(
        Dm,
        {
          data: Us(t.recipe, a, h, f, i),
          recipe: t.recipe,
          style: c,
          width: Math.max(120, P.width - 8),
          height: Math.max(80, P.height - 8),
          title: ((R = t.recipe.title) == null ? void 0 : R.trim()) || Ae(t, a)
        }
      ) }) : /* @__PURE__ */ g.jsx(
        HS,
        {
          item: P,
          samples: a,
          state: i,
          globalScales: o,
          dataRevision: s,
          densityColorPower: l,
          style: c,
          canvasScale: C,
          titleTemplate: u,
          describe: d
        }
      ) })
    }
  );
}
const Gh = [
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
], Ui = ["fontTick", "fontAxis", "fontTitle", "fontGate"], KS = [...Ui, "fontLegend", "gateLineWidth", "histLineWidth", "pubStyle"], Ad = [...Ui, "fontLegend"], qS = { fontTick: "Tick", fontAxis: "Axis", fontTitle: "Plot title", fontGate: "Gate label" };
function Xo({
  styles: t,
  showTitle: e = !0,
  texts: n = [],
  onChange: r,
  onTextChange: a
}) {
  const { t: i } = Pt();
  if (!t.length && !n.length) return null;
  const o = (l) => l > 1 ? ` (${i("mixed")})` : "", s = [...new Set(n.map((l) => l.fontSize))];
  return /* @__PURE__ */ g.jsxs("fieldset", { className: "gl-layout-font-fields", children: [
    /* @__PURE__ */ g.jsx("legend", { children: i("Fonts (px)") }),
    t.length > 0 && Gh.filter(({ key: l }) => Ui.includes(l) && (e || l !== "fontTitle")).map(({ key: l, label: c, step: u }) => {
      const d = [...new Set(t.map((f) => f[l]))];
      return /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: d.length > 1 ? i("The selected plots differ: {values}", { values: d.join(", ") }) : void 0, children: [
        i(qS[l]),
        o(d.length),
        /* @__PURE__ */ g.jsx(
          ie,
          {
            "aria-label": i(c),
            value: d[0],
            min: mi[l][0],
            max: mi[l][1],
            step: u,
            onCommit: (f) => r({ [l]: f })
          }
        )
      ] }, l);
    }),
    n.length > 0 && a && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: s.length > 1 ? i("The selected text blocks differ: {values}", { values: s.join(", ") }) : void 0, children: [
        i("Text box"),
        o(s.length),
        /* @__PURE__ */ g.jsx(ie, { "aria-label": i("Text font"), min: 8, max: 72, integer: !0, value: s[0], onCommit: (l) => a({ fontSize: l }) })
      ] }),
      /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
        /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: n.every((l) => l.bold), onChange: (l) => a({ bold: l.target.checked }) }),
        i("Bold")
      ] }),
      /* @__PURE__ */ g.jsx(hS, { texts: n, onChange: a })
    ] })
  ] });
}
function Ho({
  effective: t,
  own: e,
  onChange: n,
  omit: r = []
}) {
  const { t: a } = Pt();
  return /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-style-fields", children: [
    Gh.filter(({ key: i }) => !r.includes(i)).map(({ key: i, label: o, step: s, integer: l }) => /* @__PURE__ */ g.jsxs(G.Fragment, { children: [
      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline" + (i in e ? " is-own" : ""), children: [
        a(o),
        /* @__PURE__ */ g.jsx(
          ie,
          {
            "aria-label": a(o),
            value: i === "maxEvents" && t.maxEvents === 0 ? Yc.maxEvents : t[i],
            min: mi[i][0],
            max: mi[i][1],
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
            onChange: (c) => n({ maxEvents: c.target.checked ? 0 : Yc.maxEvents })
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
function US({
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
  const { t: u } = Pt(), [d, f] = G.useState(e), h = G.useRef(null);
  G.useEffect(() => {
    if (!i) return;
    f(e);
    const m = h.current;
    m && (m.focus({ preventScroll: !0 }), m.setSelectionRange(m.value.length, m.value.length));
  }, [i]);
  const v = { fontSize: n, fontWeight: r ? 700 : 400, ...sS(a) };
  return i ? /* @__PURE__ */ g.jsx(
    uS,
    {
      areaRef: h,
      draft: d,
      setDraft: f,
      templateText: e,
      rich: a == null ? void 0 : a.rich,
      style: v,
      onCommit: l,
      onEditEnd: s,
      onFocus: c
    }
  ) : /* @__PURE__ */ g.jsx(
    "div",
    {
      className: "gl-layout-text-surface is-static",
      style: v,
      title: u("Double-click to edit"),
      onDoubleClick: (m) => {
        m.stopPropagation(), o();
      },
      children: /* @__PURE__ */ g.jsx(cS, { text: t, rich: a == null ? void 0 : a.rich })
    }
  );
}
function JS({
  workspace: t,
  onChange: e,
  takeUndoSeed: n,
  samples: r,
  checkedSampleIds: a = [],
  groups: i = [],
  fileGroups: o = {},
  metadataColumns: s = [],
  metadataLevels: l,
  populationMetadata: c,
  activeSampleId: u,
  activePopulationId: d,
  state: f,
  globalScales: h,
  defaultX: v,
  defaultY: m,
  illustrationConfig: y,
  onOpenInIllustration: w,
  plottingSettings: S,
  divisionProfiles: C = AS,
  imageService: k = null,
  onOpenInPlotting: M,
  dataRevision: E,
  densityColorPower: D,
  onOpenInGating: _,
  onExported: j
}) {
  var gc, vc, mc, xc, yc, bc, wc, Sc;
  const { t: x } = Pt(), I = iv(), [P, R] = G.useState([]), [N, F] = G.useState(null), [q, z] = G.useState(!0), [B, Y] = G.useState(!0), V = _1(), [W, tt] = G.useState(null), [J, rt] = G.useState(null), [Q, at] = G.useState([]), [ft, Z] = G.useState([]), ut = G.useRef(null), vt = G.useRef(null), [nt, pt] = G.useState(null), [jt, st] = G.useState(null), [lt, xt] = G.useState(
    u ?? ((gc = r[0]) == null ? void 0 : gc.id) ?? ""
  ), [Ct, Mt] = G.useState("item"), [ht, yt] = G.useState(!0), [Et, Ht] = G.useState(!1), [Vt, Gt] = G.useState({ shift: !1, meta: !1 });
  G.useEffect(() => {
    const p = (T) => Gt((L) => {
      const $ = { shift: T.shiftKey, meta: T.metaKey || T.ctrlKey };
      return $.shift === L.shift && $.meta === L.meta ? L : $;
    }), b = () => Gt((T) => T.shift || T.meta ? { shift: !1, meta: !1 } : T);
    return window.addEventListener("keydown", p), window.addEventListener("keyup", p), window.addEventListener("blur", b), () => {
      window.removeEventListener("keydown", p), window.removeEventListener("keyup", p), window.removeEventListener("blur", b);
    };
  }, []);
  const [mt, pe] = G.useState(1), me = G.useRef(mt);
  me.current = mt;
  const [xn, yn] = G.useState(mt);
  G.useEffect(() => {
    const p = window.setTimeout(() => yn(mt), 250);
    return () => window.clearTimeout(p);
  }, [mt]);
  const $e = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * xn)), [We, jr] = G.useState("pdf"), [Nn, ba] = G.useState(!1), [On, Zi] = G.useState(3), [nn, Ir] = G.useState(!1), rn = G.useRef(null), At = G.useRef(null), Kt = (p) => {
    var b;
    R(p), (b = rn.current) == null || b.focus({ preventScroll: !0 });
  }, wa = (p) => Kt(p ? [p] : []), Ie = ov(
    r,
    r.map((p) => p.id),
    f,
    E
  ), Tt = G.useMemo(
    () => Ie.current ? Ie.sources.map((p) => ({ ...p, derived: p.gating })) : [],
    [Ie.current, Ie.sources]
  ), xe = G.useMemo(
    () => Object.fromEntries(r.map((p) => [p.id, p.metadata])),
    [r]
  ), ye = G.useMemo(() => Dn(f), [f]), ge = r.length === 0 || Ie.current && Ie.pending === 0, bn = G.useRef([]), nr = G.useRef([]), [, $h] = G.useState(0);
  G.useEffect(() => {
    const p = n == null ? void 0 : n();
    p && (bn.current = [p, ...bn.current].slice(0, 30), nr.current = [], $h((b) => b + 1));
  }, [t, n]);
  const H = t.sheets.find(({ id: p }) => p === t.activeSheetId) ?? t.sheets[0], dt = (H == null ? void 0 : H.iteration) ?? Ld;
  Ct === "iterate" && dt.mode === "off" && Mt("item");
  const ue = G.useMemo(() => {
    const p = H == null ? void 0 : H.items.find((T) => qt(T.recipe) && T.recipe.iterated === !0), b = p && "sampleId" in p.recipe ? p.recipe.sampleId : u;
    return Tt.find(({ id: T }) => T === b) ?? Tt[0] ?? null;
  }, [H, Tt, u]), Re = G.useMemo(
    () => {
      var p;
      return dt.mode === "populations" ? ue ? wm(dt, ue.tree, {
        ...r.find(({ id: b }) => b === ue.id) ?? ue,
        groupName: (p = i.find((b) => b.id === o[ue.id])) == null ? void 0 : p.name
      }) : [] : dt.mode === "metadata" ? bm(dt, r, a, i, o, l == null ? void 0 : l[dt.column ?? ""]) : ym(dt, r, a, i, o);
    },
    [dt, r, a, i, o, ue, l]
  ), wn = G.useCallback((p, b, T) => {
    var Yt, Ba, Cc, kc;
    const L = r.find(({ id: de }) => de === p.sampleId) ?? null, $ = Tt.find(({ id: de }) => de === p.sampleId) ?? null;
    let X = p.populationId;
    if ($) {
      const de = b && b !== p.sampleId ? (Yt = Tt.find(({ id: De }) => De === b)) == null ? void 0 : Yt.tree.id : void 0, Ne = gn(p.populationId, $.tree, ye, de);
      Ne.missing || (X = Ne.id);
    }
    const U = $ == null ? void 0 : $.tree.populations[X], it = na(p), It = b && b !== p.sampleId ? (Ba = Tt.find(({ id: de }) => de === b)) == null ? void 0 : Ba.tree.id : void 0, ct = p.kind !== "strategy" && p.populationIds && p.populationIds.length > 1 && $ ? p.populationIds.flatMap((de) => {
      var Lr;
      const Ne = gn(de, $.tree, ye, It), De = Ne.missing ? void 0 : $.tree.populations[Ne.id];
      if (!De) return [];
      const fn = it ? fr({ ...p, populationId: de }, Tt, ye, b ? (Lr = Tt.find(({ id: vo }) => vo === b)) == null ? void 0 : Lr.tree.id : void 0).members.reduce((vo, Ec) => vo + (Ec.gating.stats.event_count[Ec.populationId] ?? 0), 0) : $.derived.stats.event_count[Ne.id] ?? 0;
      return [{ name: De.name, count: fn }];
    }) : [], Jt = (de) => ct.length ? { ...de, population: xv(ct.map((Ne) => Ne.name), p.kind === "strategy" ? void 0 : p.label), counts: ct.map((Ne) => Ne.count) } : de;
    if (it && p.kind !== "strategy") {
      const { members: de } = fr(p, Tt, ye, b ? (Cc = Tt.find(({ id: fn }) => fn === b)) == null ? void 0 : Cc.tree.id : void 0), Ne = de.reduce((fn, Lr) => fn + (Lr.gating.stats.event_count[Lr.populationId] ?? 0), 0), De = T ? Re.find((fn) => fn.id === T) : void 0;
      return Jt(zc(
        p,
        { name: De != null && De.sampleIds ? De.name : `${it.length} files`, fileName: `${it.length} files`, metadata: De != null && De.sampleIds ? De.metadata : pf(it.map((fn) => xe[fn])) },
        U ? { id: X, name: U.name } : null,
        de.length ? Ne : void 0,
        c
      ));
    }
    const Me = $ == null ? void 0 : $.derived.stats.event_count[X], dn = L ? (kc = i.find((de) => de.id === o[L.id])) == null ? void 0 : kc.name : void 0;
    return Jt(zc(
      p.kind === "strategy" ? {} : p,
      L ? { name: L.name, fileName: L.fileName ?? L.name, groupName: dn, metadata: L.metadata } : null,
      U ? { id: X, name: U.name } : null,
      typeof Me == "number" ? Me : void 0,
      c
    ));
  }, [r, Tt, f, c, ye, xe, Re, i, o]), he = G.useMemo(
    () => H ? Nm(mm(H, Re, wn), H) : [],
    [H, Re, wn]
  ), An = G.useCallback(
    (p) => K1(p, { files: r, samples: Tt, state: f, metadataById: xe, checkedSampleIds: a, divisionProfiles: C, dataRevision: E, describePlot: wn }),
    [r, Tt, f, xe, a, C, E, wn]
  ), [Ji, Ln] = G.useState(0), [$l, Wh] = G.useState(!1), [Yh, Xh] = G.useState(" · "), Wl = G.useMemo(
    () => [...new Set(Object.values(c ?? {}).flatMap((p) => Object.keys(p)))].sort(),
    [c]
  ), Yl = G.useMemo(() => sv(s, Wl), [s, Wl]), Ye = Math.min(Ji, Math.max(0, he.length - 1)), Lt = he[Ye] ?? OS, Qi = ((vc = H == null ? void 0 : H.titleTemplate) == null ? void 0 : vc.trim()) || lv(
    he.flatMap((p) => p.items).flatMap((p) => {
      var b;
      return qt(p.recipe) ? [{ sampleId: ((b = na(p.recipe)) == null ? void 0 : b.join(",")) ?? p.recipe.sampleId, populationId: p.recipe.populationId, label: p.recipe.kind === "strategy" ? void 0 : p.recipe.label }] : [];
    }),
    dt.mode === "metadata" ? { metadataColumn: dt.column } : void 0
  ), to = (p) => {
    var b;
    return qt(p.recipe) && (((b = p.recipe.title) == null ? void 0 : b.trim()) || Qi).trim() !== Jd;
  };
  G.useEffect(() => {
    Ji !== Ye && Ln(Ye);
  }, [Ji, Ye]);
  const Rr = (p) => p.split("::")[0], Nt = [...new Set(P.map(Rr))], Zt = (H == null ? void 0 : H.items.filter(({ id: p }) => Nt.includes(p))) ?? [], K = Zt.length === 1 ? Zt[0] : null, an = Zt.filter((p) => qt(p.recipe)), Xl = (p) => kt((b) => {
    b.style = bo({ ...b.style, ...p });
    for (const T of b.items) {
      if (!qt(T.recipe) || !T.recipe.style) continue;
      const L = { ...T.recipe.style };
      for (const U of Object.keys(p)) delete L[U];
      const { style: $, ...X } = T.recipe;
      T.recipe = Object.keys(L).length ? { ...X, style: L } : X;
    }
  }), Hl = Zt.flatMap((p) => p.recipe.kind === "text" && !fe(p) ? [{ fontSize: p.recipe.fontSize, bold: p.recipe.bold === !0, italic: p.recipe.italic, color: p.recipe.color, align: p.recipe.align, rich: p.recipe.rich }] : []), Vl = (p) => kt((b) => {
    for (const T of b.items) {
      if (!Nt.includes(T.id) || T.recipe.kind !== "text") continue;
      const L = { ...T.recipe, ...p.fontSize !== void 0 ? { fontSize: p.fontSize } : {} };
      p.bold === !0 ? L.bold = !0 : p.bold === !1 && delete L.bold, fS(L, p), T.recipe = L;
    }
  }), eo = (p) => kt((b) => {
    for (const T of b.items)
      !Nt.includes(T.id) || !qt(T.recipe) || (T.recipe = { ...T.recipe, style: bo({ ...T.recipe.style, ...p }) });
  }), $t = K ? Lt.items.find((p) => p.templateId === K.id) ?? null : null, Hh = G.useMemo(() => $t ? An($t) : null, [$t, An]), Sa = (K == null ? void 0 : K.recipe.kind) === "chart" ? K.recipe : null, Pe = G.useMemo(() => {
    if (!Sa) return null;
    const { missing: p, noChannel: b, groups: T } = Us(Sa, Tt, xe, a, f), L = !!Sa.groupBy && T.some(($) => $.label === yi);
    return p.length || b.length || L ? { missing: p, noChannel: b, unassigned: L } : null;
  }, [Sa, Tt, xe, a, f]), Kl = (p) => p.split("::")[1] ?? "", Ca = (p) => {
    var b;
    return (b = Lt.items.find((T) => T.id === p)) == null ? void 0 : b.group;
  }, ql = (p) => {
    const b = new Set(p.map(Ca).filter(($) => !!$));
    if (!b.size) return [...p];
    const T = new Set(p.map(Kl)), L = new Set(p);
    for (const $ of Lt.items) $.group && b.has($.group) && T.has(Kl($.id)) && L.add($.id);
    return [...L];
  }, Pr = Ai(Zt).length, Vh = Zt.length > 1 && Zt.every((p) => p.group && p.group === Zt[0].group), Ul = (p, b) => {
    var $;
    if (!qt(p.recipe)) return "";
    const T = (($ = p.recipe.title) == null ? void 0 : $.trim()) ?? "";
    if (!T) return "";
    const L = wn(p.recipe, b);
    return L && GS(T, L.population, [L.file, L.sample]) ? "" : T;
  }, Kh = $t && qt($t.recipe) ? fi(Qi, wn($t.recipe, $t.templateSampleId, $t.unitId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", no = Zt.some((p) => p.locked), ka = new Set(((H == null ? void 0 : H.items) ?? []).filter((p) => p.locked).map((p) => p.id)), on = Q.filter((p) => !ka.has(Rr(p.dataset.itemId ?? "")) && p.dataset.itemId !== N), Nr = on.length > 1 && on.every((p) => !Ca(p.dataset.itemId ?? "")), Zl = G.useRef(on);
  Zl.current = on;
  const Ea = G.useRef(!1), ro = Js(H);
  G.useEffect(() => {
    P.length && P.some((p) => !Lt.items.some((b) => b.id === p) && !ro.has(p)) && R((p) => p.filter((b) => Lt.items.some((T) => T.id === b) || ro.has(b)));
  }, [Lt, P]), G.useLayoutEffect(() => {
    var p;
    (p = ut.current) == null || p.updateRect();
  }, [Lt, mt, xn]), G.useLayoutEffect(() => {
    var $;
    if (!W) return;
    const p = [...W.querySelectorAll("[data-item-id]")], b = (X, U) => X.length === U.length && X.every((it, It) => it === U[It]), T = p.filter((X) => P.includes(X.dataset.itemId ?? "")), L = p.filter((X) => !P.includes(X.dataset.itemId ?? ""));
    at((X) => b(X, T) ? X : T), Z((X) => b(X, L) ? X : L), ($ = vt.current) == null || $.setSelectedTargets(T);
  }, [W, P, Lt, H == null ? void 0 : H.id]), G.useEffect(() => {
    uo();
  }, [H == null ? void 0 : H.id]);
  const Ma = (p, b = !0) => {
    b && (bn.current = [
      $a(t),
      ...bn.current
    ].slice(0, 30), nr.current = []), e(dm(t, p));
  }, zn = (p) => {
    const b = $a(t);
    p(b), Ma(b);
  }, kt = (p) => {
    zn((b) => {
      const T = b.sheets.find(({ id: L }) => L === b.activeSheetId);
      T && p(T);
    });
  }, sn = G.useRef(null), [qh, Da] = G.useState(null), [Ta, _a] = G.useState(null), ln = (p, b) => {
    let T = "";
    const L = sn.current;
    sn.current = null, kt(($) => {
      T = crypto.randomUUID();
      const X = Vc($, b == null ? void 0 : b.width, b == null ? void 0 : b.height);
      L && (X.x = Math.max(0, Math.round(L.x)), X.y = Math.max(0, Math.round(L.y))), $.items.push({
        id: T,
        ...X,
        recipe: p
      });
    }), wa(T), dc(T);
  }, Wt = Tt.find(({ id: p }) => p === lt) ?? Tt[0] ?? null, ao = Wt && d ? ci(
    {
      hierarchyId: f.active_hierarchy_id,
      populationId: d
    },
    Wt.tree,
    Dn(f)
  ) : null, Sn = (ao == null ? void 0 : ao.id) ?? (Wt == null ? void 0 : Wt.tree.root_population_id) ?? "", ja = (p) => {
    var b, T, L;
    if (!Wt || !Sn) {
      st(x("Check an FCS file and select a population first."));
      return;
    }
    ln({
      kind: p,
      sampleId: Wt.id,
      populationId: Sn,
      ...dt.mode !== "off" ? { iterated: !0 } : {},
      xChannel: Wt.sample.index(v) !== void 0 ? v : ((b = Wt.sample.channels[0]) == null ? void 0 : b.key) ?? "",
      yChannel: p === "histogram" ? null : Wt.sample.index(m) !== void 0 ? m : ((T = Wt.sample.channels[1]) == null ? void 0 : T.key) ?? ((L = Wt.sample.channels[0]) == null ? void 0 : L.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, [cn, Or] = G.useState(null), Uh = G.useCallback(() => Or(null), []), Jl = (p) => {
    const b = pn(H, p, I);
    return { fontTick: b.fontTick, fontAxis: b.fontAxis };
  }, Zh = (p) => {
    const b = (cn == null ? void 0 : cn.at) ?? null;
    if (Or(null), !Wt || !H) {
      st(x("Check an FCS file and select a population first."));
      return;
    }
    const T = F1(
      { sampleId: Wt.id, ...p },
      Wt.tree,
      { all: r.map(($) => $.id), checked: a },
      Jl()
    ), L = $c(T.settings, Uo(r), f, xe, C, h, T.panel);
    sn.current = b, ln(T, L ? L(H, I) : { width: 320, height: 240 });
  }, Jh = () => {
    sn.current = (cn == null ? void 0 : cn.at) ?? null, Or(null), rg(), sn.current = null;
  }, Ql = () => ln({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), Qh = ({ recipe: p, frame: b }) => {
    _a(null), sn.current = { x: b.x, y: b.y }, ln(p, b);
  }, tc = (p) => kt((b) => {
    for (const T of b.items) Nt.includes(T.id) && T.recipe.kind === "shape" && (T.recipe = ww(T.recipe, p));
  }), io = Md((p, b) => {
    if ("error" in p) return st(p.error);
    sn.current = b, ln(p.recipe, Jb(p.recipe, H.page));
  }), tg = Md((p, b) => "error" in p ? st(p.error) : nc(b, (T) => T.kind === "image" ? p.recipe : T)), ec = () => {
    const p = cf(H), b = new Map(H.items.flatMap((T) => fe(T) && p.has(T.id) ? [[T.recipe.letterFor, p.get(T.id)]] : []));
    return (T) => b.get(T.id) ?? (T.templateId ? b.get(T.templateId) : void 0);
  }, eg = () => {
    const p = bd(Lt.items, An, Math.max(24, Yr(H.page.marginMm)), void 0, ec());
    if (!p) {
      st(x("Nothing on this page draws data to write a legend from."));
      return;
    }
    sn.current = { x: p.frame.x, y: p.frame.y }, ln(p.recipe, p.frame);
  }, nc = (p, b) => {
    kt((T) => {
      const L = T.items.find(($) => $.id === p);
      L && (L.recipe = b(L.recipe));
    });
  }, ng = (p) => {
    p.preventDefault();
    const b = p.target.closest("[data-item-id]");
    if (b != null && b.dataset.itemId) {
      const X = b.dataset.itemId, U = H == null ? void 0 : H.items.find(({ id: Yt }) => Yt === Rr(X));
      if (!U) return;
      const it = P.includes(X);
      it || Kt(ql([X]));
      const It = U.group ? ((H == null ? void 0 : H.items) ?? []).filter((Yt) => Yt.group === U.group).map(({ id: Yt }) => Yt) : [U.id], ct = it && Nt.length > 1 ? Nt : It, Jt = ct.length > 1, Me = qt(U.recipe), dn = [
        { label: Jt ? x("Duplicate {n} items", { n: ct.length }) : x("Duplicate"), onClick: () => Ar(ct) },
        { label: x("Copy"), onClick: () => Xe.copy(ct) },
        { label: x("Cut"), onClick: () => Xe.cut(ct) },
        { label: x("Paste"), disabled: !Xe.canPaste, onClick: () => Xe.paste(!1) },
        { label: x("Paste in place"), disabled: !Xe.canPaste, onClick: () => Xe.paste(!0) },
        { label: x("Zoom to selection"), onClick: () => hg.zoomToSelection(ct) },
        { label: x("Bring to front"), onClick: () => un(ct, "front") },
        { label: x("Bring forward"), onClick: () => un(ct, "forward") },
        { label: x("Send backward"), onClick: () => un(ct, "backward") },
        { label: x("Send to back"), onClick: () => un(ct, "back") },
        { label: U.locked ? x("Unlock") : x("Lock"), onClick: () => Ra(ct, !U.locked) },
        ...oS(x, ((H == null ? void 0 : H.items) ?? []).filter(({ id: Yt }) => ct.includes(Yt)), (Yt) => kt((Ba) => {
          $o(Ba, ct, Yt);
        })),
        ...it && Pr > 1 ? [{ label: x("Group"), onClick: Ia }] : [],
        ...U.group ? [{ label: x("Ungroup"), onClick: () => kt((Yt) => Wc(Yt, ct)) }] : [],
        ...H ? [{ label: x("Panel letters"), disabled: !Co(H, ct).canAdd, onClick: () => kt((Yt) => {
          ru(Yt, ct);
        }) }, { label: x("Remove panel letters"), disabled: !Co(H, ct).canRemove, onClick: () => kt((Yt) => {
          au(Yt, ct);
        }) }] : [],
        "separator",
        ...dt.mode !== "off" && (Me || dt.mode !== "populations" && U.recipe.kind === "proportions" && U.recipe.panel) ? [
          {
            label: "iterated" in U.recipe && U.recipe.iterated ? x("Stop following the iteration") : x("Follow the iteration"),
            onClick: () => nc(U.id, (Yt) => qt(Yt) || Yt.kind === "proportions" ? { ...Yt, iterated: !Yt.iterated } : Yt)
          },
          "separator"
        ] : [],
        ...Me ? [{ label: x("Open in Gating"), onClick: () => _(U.recipe) }] : [],
        ...U.recipe.kind === "figure" && w ? [{ label: x("Edit in Illustration"), onClick: () => w(structuredClone(U.recipe.illustration)) }] : [],
        ...U.recipe.kind === "proportions" && M ? [{ label: x("Edit in Plotting"), onClick: () => {
          var Yt;
          return M(structuredClone(U.recipe.settings), ((Yt = U.name) == null ? void 0 : Yt.trim()) || Ae(U, Tt));
        } }] : [],
        { label: Jt ? x("Remove {n} items", { n: ct.length }) : x("Remove"), onClick: () => rr(ct) }
      ];
      Da({ x: p.clientX, y: p.clientY, items: dn, label: Ae(U, Tt) });
      return;
    }
    const T = p.currentTarget.getBoundingClientRect(), L = { x: (p.clientX - T.left) / mt, y: (p.clientY - T.top) / mt }, $ = (X) => () => {
      sn.current = L, X();
    };
    Da({
      x: p.clientX,
      y: p.clientY,
      label: x("Page"),
      items: [
        { label: x("+ Biplot"), disabled: !ge, onClick: $(() => ja("biplot")) },
        { label: x("+ Histogram"), disabled: !ge, onClick: $(() => ja("histogram")) },
        { label: x("+ Gating strategy"), disabled: !ge, onClick: $(ac) },
        { label: x("+ Chart"), disabled: !ge, onClick: () => Or({ x: p.clientX, y: p.clientY, at: L }) },
        { label: x("+ Text"), onClick: $(Ql) },
        { label: x("+ Illustration figure"), disabled: !ge || !(y != null && y.figure), onClick: $(rc) },
        Zw(x, (X) => io(X, L)),
        ...Ww(x, Ta, _a),
        "separator",
        { label: x("Paste"), disabled: !Xe.canPaste, onClick: () => Xe.paste(!1) },
        { label: x("Paste in place"), disabled: !Xe.canPaste, onClick: () => Xe.paste(!0) },
        // With a selection on the page, the menu on blank paper offers what the selection's own menu does for grouping, as Illustrator's does.
        ...Pr > 1 ? [{ label: x("Group"), onClick: Ia }] : [],
        ...Zt.some((X) => X.group) ? [{ label: x("Ungroup"), onClick: so }] : [],
        { label: x("Select all"), disabled: !Lt.items.length, onClick: () => Kt(Lt.items.filter((X) => !ka.has(X.templateId)).map(({ id: X }) => X)) }
      ]
    });
  }, rc = () => {
    if (!(y != null && y.figure)) {
      st(x("Make a figure on the Illustration tab first."));
      return;
    }
    H && ln({ kind: "figure", illustration: structuredClone(y), page: 0 }, wv(y, r, f, H, l));
  }, rg = () => {
    if (!S || !H) return;
    const p = S(), b = $c(p, Uo(r), f, xe, C, h);
    if (!b) {
      st(p.valueKind !== "proportion" ? x("Choose files, populations and a channel on the Plotting tab first.") : x("Choose files and populations on the Plotting tab first."));
      return;
    }
    ln({ kind: "proportions", settings: p, textSize: "sheet" }, b(H, I));
  }, ac = () => {
    var T;
    if (!Wt || !Sn) {
      st(x("Check an FCS file and select a population first."));
      return;
    }
    const p = Wt.tree.root_population_id ?? "", b = Sn !== p ? Sn : ((T = Br(Wt.tree.populations, p).filter(({ popId: L }) => L !== p).at(-1)) == null ? void 0 : T.popId) ?? Sn;
    ln(
      {
        kind: "strategy",
        sampleId: Wt.id,
        populationId: b,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...dt.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, ag = () => {
    var L;
    if (!y) {
      st(x("Render or configure an Illustration selection first."));
      return;
    }
    if (!y.figure && y.plotType === "heatmap") {
      st(
        x("Heatmap layout blocks are planned for the next Layout phase.")
      );
      return;
    }
    const p = y.figure;
    let b = [];
    if (p)
      try {
        b = Xd(p, r, ye, c, l).flatMap((X) => X.panels).flatMap(
          (X) => X.plot.type === "chart" ? yv(X, p, y, (U) => Tt.some(({ id: it }) => it === U), ye) ?? [] : bv([X], p, y, (U) => Tt.find(({ id: it }) => it === U), ye)
        );
      } catch ($) {
        st($ instanceof Error ? $.message : String($));
        return;
      }
    else
      for (const $ of Tt) {
        const X = y.selectionMode === "matrix" ? ((L = y.selectedPopulationsBySample) == null ? void 0 : L[$.id]) ?? [] : y.popIds;
        for (const U of X)
          for (const it of y.xChannels) {
            const It = y.plotType === "histogram" ? "histogram" : "biplot";
            b.push({
              kind: It,
              sampleId: $.id,
              populationId: U,
              xChannel: it,
              yChannel: It === "histogram" ? null : y.yChannel,
              displayMode: y.displayMode === "dots" ? "scatter" : y.displayMode
            });
          }
      }
    const T = b.slice(0, 60);
    if (T.length === 0) {
      st(
        x("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    kt(($) => {
      for (const X of Wd($, T))
        $.items.push({
          id: crypto.randomUUID(),
          ...Vc($),
          recipe: X
        });
    }), st(
      b.length > T.length ? x(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: T.length
        }
      ) : x("Added {count} Illustration plots.", { count: T.length })
    );
  }, _t = (p) => {
    K && kt((b) => {
      const T = b.items.find(({ id: $ }) => $ === K.id);
      if (!T) return;
      const L = T.recipe;
      if (T.recipe = p(T.recipe), L.kind === "cellpanel" && T.recipe.kind === "cellpanel") {
        const $ = Xc(L), X = Xc(T.recipe), U = Math.max(0.1, Math.min(T.width / Math.max(1, $.width), T.height / Math.max(1, $.height)));
        T.width = Math.max(40, Math.round(X.width * U)), T.height = Math.max(30, Math.round(X.height * U));
      }
    });
  }, oo = (p) => _t((b) => {
    if (b.kind !== "biplot" && b.kind !== "histogram") return b;
    const T = p ? r.filter((X) => p.includes(X.id)).map((X) => X.id) : [];
    if (!T.length) {
      const { pool: X, ...U } = b;
      return U;
    }
    const L = T.includes(b.sampleId) ? b.sampleId : T[0];
    let $ = b.populationId;
    if (L !== b.sampleId) {
      const X = Tt.find(({ id: it }) => it === b.sampleId), U = Tt.find(({ id: it }) => it === L);
      X && U && ($ = ci({ hierarchyId: X.tree.id, populationId: $ }, U.tree, ye).id ?? U.tree.root_population_id ?? $);
    }
    return { ...b, sampleId: L, populationId: $, pool: { sampleIds: T } };
  }), ig = G.useMemo(() => {
    var X;
    const p = K == null ? void 0 : K.recipe;
    if (!p || !qt(p) || p.kind === "strategy" || !p.pool) return null;
    const b = $t != null && $t.templateSampleId ? (X = Tt.find(({ id: U }) => U === $t.templateSampleId)) == null ? void 0 : X.tree.id : void 0, { members: T, leftOut: L } = fr(p, Tt, ye, b), $ = p.kind === "biplot" && p.yChannel && T.length > 1 ? cv(ye, T.map((U) => U.tree.id), p.xChannel, p.yChannel).omitted.map((U) => U.name) : [];
    return { pooled: T.length, total: p.pool.sampleIds.length, leftOut: L, omittedGates: $ };
  }, [K, $t, Tt, ye]), ic = G.useMemo(() => {
    var U;
    const p = $t == null ? void 0 : $t.recipe;
    if (!p || !qt(p) || !($t != null && $t.unitId)) return null;
    const b = Re.find((it) => it.id === $t.unitId);
    if (!b) return null;
    if (b.populationId) return x("This page draws {name}; the population chosen here is the template's.", { name: b.name });
    if (!b.sampleIds) return x("This page draws {name}; the file chosen here is the template's.", { name: b.name });
    const T = (it) => {
      var It;
      return ((It = r.find((ct) => ct.id === it)) == null ? void 0 : It.name) ?? it;
    };
    if (p.kind === "strategy") return x("This page is {value}: a strategy is drawn for one file, {file}, not pooled.", { value: b.name, file: T(p.sampleId) });
    if (!p.pool) return x("This page is {value}: {file} alone.", { value: b.name, file: T(p.sampleId) });
    const L = $t.templateSampleId ? (U = Tt.find(({ id: it }) => it === $t.templateSampleId)) == null ? void 0 : U.tree.id : void 0, { members: $, leftOut: X } = fr(p, Tt, ye, L);
    return x("This page is {value}: {n} of {m} files pooled", { value: b.name, n: $.length, m: p.pool.sampleIds.length }) + (X.length ? ` · ${x("Not pooled: {files}", { files: X.map((it) => `${it.name} (${it.reason})`).join(", ") })}` : "");
  }, [$t, Re, r, Tt, ye, x]), rr = (p) => {
    kt((b) => {
      b.items = b.items.filter((T) => !p.includes(T.id)), Yd(b);
    }), R((b) => b.filter((T) => !p.includes(T)));
  }, Ar = (p, b) => {
    const T = [];
    return kt((L) => {
      let $ = Math.max(0, ...L.items.map((it) => it.z));
      const X = fm(L, p).flatMap((it) => L.items.filter((It) => It.id === it)), { copies: U } = gi(X);
      U.forEach((it, It) => {
        const ct = X[It];
        T.push(it.id);
        const Jt = (b == null ? void 0 : b[ct.id]) ?? { x: ct.x + 20, y: ct.y + 20, width: ct.width, height: ct.height };
        L.items.push({ ...it, ...Jt, locked: !1, z: ++$ });
      });
    }), T.length && Kt(T), T;
  }, Xe = m1({ sheet: H, mutateActiveSheet: kt, removeItems: rr, selectMany: Kt }), og = (p, b, T) => {
    kt((L) => {
      for (const $ of L.items)
        !p.includes($.id) || $.locked || ($.x += b, $.y += T);
    });
  }, un = (p, b) => {
    kt((T) => {
      const L = [...T.items].sort((it, It) => it.z - It.z), $ = L.filter((it) => p.includes(it.id)), X = L.filter((it) => !p.includes(it.id));
      let U;
      if (b === "front") U = [...X, ...$];
      else if (b === "back") U = [...$, ...X];
      else {
        U = L;
        const it = U.map((It, ct) => ct);
        b === "forward" && it.reverse();
        for (const It of it) {
          const ct = b === "forward" ? It + 1 : It - 1;
          !p.includes(U[It].id) || ct < 0 || ct >= U.length || p.includes(U[ct].id) || ([U[It], U[ct]] = [U[ct], U[It]]);
        }
      }
      U.forEach((it, It) => {
        it.z = It;
      });
    });
  }, Ia = () => {
    Pr < 2 || kt((p) => {
      kv(p, Nt);
    });
  }, so = () => {
    Zt.some((p) => p.group) && kt((p) => Wc(p, Nt));
  }, Ra = (p, b) => {
    kt((T) => {
      for (const L of T.items) p.includes(L.id) && (L.locked = b);
    });
  }, sg = (p) => {
    kt((b) => Sv(b, Nt.filter((T) => {
      var L;
      return !((L = b.items.find(($) => $.id === T)) != null && L.locked);
    }), p));
  }, lg = (p) => {
    kt((b) => Cv(b, Nt.filter((T) => {
      var L;
      return !((L = b.items.find(($) => $.id === T)) != null && L.locked);
    }), p));
  }, Pa = (p, b) => {
    const T = {};
    for (const $ of p) {
      const X = $.dataset.itemId, U = Lt.items.find((ct) => ct.id === X);
      if (!U) continue;
      const { id: it, ...It } = km(U, BS($));
      T[it] = It;
    }
    const L = Object.keys(T);
    if (L.length) {
      if (b) {
        for (const $ of p) {
          const X = Lt.items.find((U) => U.id === $.dataset.itemId);
          X && Object.assign($.style, { left: `${X.x}px`, top: `${X.y}px`, width: `${X.width}px`, height: `${X.height}px` });
        }
        Ar(L, T);
        return;
      }
      kt(($) => {
        for (const X of $.items) {
          const U = T[X.id];
          if (!U) continue;
          Object.assign(X, U);
          const { zoom: it } = Nd(X, U.width, U.height);
          it === void 0 ? delete X.zoom : X.zoom = it;
        }
      });
    }
  }, oc = (p) => p.flatMap((b) => {
    if (!(b instanceof HTMLElement) || !b.parentElement) return [];
    const T = b.cloneNode(!0);
    T.classList.add("gl-layout-ghost"), T.classList.remove("is-selected"), T.removeAttribute("data-item-id"), T.setAttribute("aria-hidden", "true");
    const L = b.querySelectorAll("canvas");
    return T.querySelectorAll("canvas").forEach(($, X) => {
      var it;
      const U = L[X];
      U && ($.width = U.width, $.height = U.height, (it = $.getContext("2d")) == null || it.drawImage(U, 0, 0));
    }), b.parentElement.insertBefore(T, b), [T];
  }), Na = (p) => {
    if (Array.isArray(p)) for (const b of p) b.remove();
  }, lo = (p) => {
    for (const b of p) {
      const T = Lt.items.find((L) => L.id === b.dataset.itemId);
      T && Object.assign(b.style, { left: `${T.x}px`, top: `${T.y}px`, width: `${T.width}px`, height: `${T.height}px` });
    }
  }, sc = G.useRef(lo);
  sc.current = lo;
  const Cn = G.useRef(null), Oa = (p, b) => {
    const T = { targets: p, ghosts: b, cancelled: !1 };
    Cn.current = T;
    const L = () => {
      window.removeEventListener("mouseup", L, !0), window.removeEventListener("touchend", L, !0), window.setTimeout(() => {
        Cn.current === T && (Cn.current = null, Na(T.ghosts));
      }, 0);
    };
    window.addEventListener("mouseup", L, !0), window.addEventListener("touchend", L, !0);
  }, Aa = (p, b, T, L) => {
    const $ = Cn.current;
    Cn.current = null, Na($ == null ? void 0 : $.ghosts);
    const X = b == null ? void 0 : b.dist, U = !X || Math.hypot(X[0] ?? 0, X[1] ?? 0) >= 3;
    $ != null && $.cancelled || !T || !U ? lo(p) : L();
  }, lc = (p) => {
    var $;
    p.target.style.left = `${p.left}px`, p.target.style.top = `${p.top}px`;
    const b = ($ = p.datas) == null ? void 0 : $.companions;
    if (!(b != null && b.length)) return;
    const T = p.left - p.datas.startLeft, L = p.top - p.datas.startTop;
    for (const { el: X, left: U, top: it } of b)
      X.style.left = `${U + T}px`, X.style.top = `${it + L}px`;
  }, cc = (p) => {
    var T;
    const b = (T = p.datas) == null ? void 0 : T.companions;
    return [p.target, ...(b ?? []).map(({ el: L }) => L)];
  }, cg = (p) => {
    var $;
    p.datas.alt = !!(($ = p.inputEvent) != null && $.altKey);
    const b = p.target, T = Nr ? Zl.current.filter((X) => X !== b) : [];
    p.datas.startLeft = parseFloat(b.style.left) || 0, p.datas.startTop = parseFloat(b.style.top) || 0, p.datas.companions = T.map((X) => ({ el: X, left: parseFloat(X.style.left) || 0, top: parseFloat(X.style.top) || 0 }));
    const L = cc(p);
    Oa(L, p.datas.alt ? oc(L) : void 0);
  }, uc = (p) => {
    var U, it;
    const b = xw((U = Lt.items.find((It) => It.id === p.target.dataset.itemId)) == null ? void 0 : U.recipe, p, !!((it = p.inputEvent) != null && it.shiftKey));
    b && (p = { ...p, width: b.width, height: b.height, drag: { ...p.drag, left: b.left, top: b.top } }), p.target.style.width = `${p.width}px`, p.target.style.height = `${p.height}px`, p.target.style.left = `${p.drag.left}px`, p.target.style.top = `${p.drag.top}px`;
    const T = p.target, L = Lt.items.find((It) => It.id === T.dataset.itemId), $ = T.querySelector(":scope > .gl-layout-item-body");
    if (!L || !$) return;
    const X = Nd(L, p.width, p.height).zoom ?? 1;
    Object.assign($.style, X === 1 && !T.dataset.zoom ? { zoom: "", width: "", height: "" } : { zoom: String(X), width: `${Math.round(p.width / X)}px`, height: `${Math.round(p.height / X)}px` });
  }, ug = (p) => {
    var L;
    const b = (L = p.inputEvent) == null ? void 0 : L.target;
    if (!b) return;
    const T = ut.current;
    if (T != null && T.isMoveableElement(b)) {
      p.stop();
      return;
    }
    if (on.some(($) => $ === b || $.contains(b)) && (p.stop(), on.length > 1 && !Nr)) {
      T == null || T.dragStart(p.inputEvent);
      const $ = p.inputEvent, X = (U) => {
        var it;
        window.removeEventListener("mouseup", X), Math.hypot(U.clientX - $.clientX, U.clientY - $.clientY) < 4 && ((it = vt.current) == null || it.clickTarget($, b));
      };
      window.addEventListener("mouseup", X);
    }
  }, dg = (p) => {
    var $, X, U;
    const b = p.isClick || p.isDragStart, T = new Set((p.removed ?? []).map((it) => Ca(it.dataset.itemId ?? "")).filter(Boolean)), L = ql(
      p.selected.map((it) => it.dataset.itemId ?? "").filter((it) => it && (b || !ka.has(Rr(it))))
    ).filter((it) => !T.has(Ca(it)));
    if (Kt(L), p.isDragStart && !p.isClick) {
      if (!L.filter((ct) => !ka.has(Rr(ct)) && ct !== N).length) return;
      (X = ($ = p.inputEvent) == null ? void 0 : $.preventDefault) == null || X.call($), Ea.current = !0;
      const It = () => {
        Ea.current = !1;
      };
      window.setTimeout(() => window.addEventListener("mousedown", It, { capture: !0, once: !0 }), 0), (U = ut.current) == null || U.waitToChangeTarget().then(() => {
        var ct;
        return (ct = ut.current) == null ? void 0 : ct.dragStart(p.inputEvent);
      });
    }
  }, dc = (p) => {
    window.requestAnimationFrame(() => {
      var b, T, L;
      (L = (T = (b = At.current) == null ? void 0 : b.querySelector(`[data-item-id="${p}"]`)) == null ? void 0 : T.scrollIntoView) == null || L.call(T, { block: "nearest", inline: "nearest" });
    });
  }, Fn = (p) => {
    kt((b) => _v(b, p));
  }, fg = () => kt((p) => jv(p)), pg = () => kt((p) => Iv(p)), co = (() => {
    const p = [], b = [];
    if (!H) return { vertical: p, horizontal: b };
    const T = ra(H.page), L = Yr(H.page.marginMm);
    for (const X of aa(H.page))
      p.push(X.x, X.x + L, X.x + T.width / 2, X.x + T.width - L, X.x + T.width), b.push(X.y, X.y + L, X.y + T.height / 2, X.y + T.height - L, X.y + T.height);
    const $ = _w(H);
    return p.push(...$.vertical), b.push(...$.horizontal), { vertical: [...new Set(p)], horizontal: [...new Set(b)] };
  })(), uo = () => {
    const p = rn.current;
    if (!p || !H) return;
    const b = { width: p.clientWidth - 36, height: p.clientHeight - 36 };
    if (b.width <= 0 || b.height <= 0) return;
    const T = Math.min(b.width / H.width, b.height / H.height);
    pe(Math.max(0.1, Math.min(4, Math.floor(T * 100) / 100)));
  };
  G.useEffect(() => {
    const p = J;
    if (!p) return;
    const b = (T) => {
      if (!(T.altKey || T.shiftKey || T.ctrlKey)) return;
      const L = T.deltaY || T.deltaX;
      if (!L) return;
      T.preventDefault();
      const $ = me.current, X = Math.max(0.1, Math.min(4, Math.round($ * Math.exp(-L * 25e-4) * 100) / 100));
      if (X === $) return;
      me.current = X, pe(X);
      const U = p.getBoundingClientRect(), it = T.clientX - U.left, It = T.clientY - U.top, ct = X / $, Jt = (p.scrollLeft + it) * ct - it, Me = (p.scrollTop + It) * ct - It;
      requestAnimationFrame(() => {
        p.scrollLeft = Jt, p.scrollTop = Me;
      });
    };
    return p.addEventListener("wheel", b, { passive: !1 }), () => p.removeEventListener("wheel", b);
  }, [J]);
  const fo = (p) => {
    const b = p > 0 ? Fr.find((T) => T > mt + 1e-3) : [...Fr].reverse().find((T) => T < mt - 1e-3);
    b && pe(b);
  }, fc = async () => {
    var T;
    const p = () => new Promise((L) => window.requestAnimationFrame(() => L()));
    await new Promise((L) => window.setTimeout(L, 150));
    const b = Date.now();
    for (; (T = At.current) != null && T.querySelector("[data-layout-pending]") && Date.now() - b < 2e4; )
      await new Promise((L) => window.setTimeout(L, 50));
    await p(), await p();
  }, pc = async () => {
    var T;
    const p = At.current;
    if (!p || !H || nn) return;
    Ir(!0);
    const b = Ye;
    try {
      const L = [];
      for (let $ = 0; $ < he.length; $++) {
        he.length > 1 && (Ln($), await fc());
        const X = ((T = he[$]) == null ? void 0 : T.units.length) === 1 ? he[$].units[0].name : void 0;
        L.push(...vh(p, H, { zoom: mt, crop: Nn ? { paddingMm: On } : void 0 }).map((U) => X ? { ...U, label: X } : U));
      }
      await f1(L, H, We), j == null || j();
    } catch (L) {
      st(L instanceof Error ? L.message : String(L));
    } finally {
      he.length > 1 && Ln(b), Ir(!1);
    }
  }, hg = bS({ canvasEl: J, zoom: mt, setZoom: pe, fitZoom: uo, stepZoom: fo, items: Lt.items, selected: Nt }), gg = kS({ workspace: t, mutate: zn, rename: pt, openMenu: Da, clearSelection: () => R([]) }), La = _S({
    workspace: t,
    pages: he,
    pageIndex: Ye,
    setPageIndex: Ln,
    zoom: mt,
    setZoom: pe,
    canvas: rn.current,
    page: At.current,
    showSheet: (p) => Ma({ ...t, activeSheetId: p }, !1),
    settle: fc,
    format: We,
    crop: Nn ? { paddingMm: On } : void 0,
    exporting: nn,
    setExporting: Ir,
    selectedIds: P,
    setSelectedIds: R,
    onError: st,
    onExported: j
  }), Je = (p) => {
    kt((b) => {
      var T;
      if (p.mode === "off") {
        delete b.iteration;
        return;
      }
      if ((((T = b.iteration) == null ? void 0 : T.mode) ?? "off") === "off" && !b.items.some(kr))
        for (const L of b.items) qt(L.recipe) && (L.recipe.iterated = !0);
      b.iteration = p;
    }), Ln(0);
  }, vg = (p) => [...new Set(r.map((b) => {
    var T;
    return ((T = b.metadata) == null ? void 0 : T[p]) ?? "";
  }).filter(Boolean))], mg = dt.source.kind === "group" ? `group:${dt.source.groupId}` : dt.source.kind === "metadata" ? `meta:${dt.source.column}=${dt.source.value}` : dt.source.kind, xg = (p) => {
    if (p === "all") return { kind: "all" };
    if (p.startsWith("group:")) return { kind: "group", groupId: p.slice(6) };
    if (p.startsWith("meta:")) {
      const [b, ...T] = p.slice(5).split("=");
      return { kind: "metadata", column: b, value: T.join("=") };
    }
    return { kind: "checked" };
  }, yg = (p) => {
    const b = Gc(p.nativeEvent);
    if (b) {
      p.preventDefault(), b === "undo" ? za() : Fa();
      return;
    }
    if (p.target.closest("input, textarea, select")) return;
    const T = p.metaKey || p.ctrlKey;
    if (p.key === "Escape") {
      R([]);
      return;
    }
    if (T && p.key.toLowerCase() === "a") {
      p.preventDefault(), Kt(((H == null ? void 0 : H.items) ?? []).filter((it) => !it.locked && !ro.has(it.id)).map((it) => it.id));
      return;
    }
    const L = h1(p);
    if (L && !N) {
      p.preventDefault(), Xe.run(L, Nt);
      return;
    }
    if (!P.length) return;
    if (p.key === "Enter" && P.length === 1) {
      const it = Lt.items.find((It) => It.id === P[0]);
      if ((it == null ? void 0 : it.recipe.kind) === "text" && !fe(it)) {
        p.preventDefault(), F(it.id);
        return;
      }
    }
    if (p.key === "Delete" || p.key === "Backspace") {
      p.preventDefault(), rr(Nt);
      return;
    }
    if (T && p.key.toLowerCase() === "d") {
      p.preventDefault(), Ar(Nt);
      return;
    }
    if (T && (p.key === "]" || p.key === "[")) {
      p.preventDefault(), un(Nt, p.key === "]" ? p.shiftKey ? "front" : "forward" : p.shiftKey ? "back" : "backward");
      return;
    }
    if (T && p.key.toLowerCase() === "g") {
      p.preventDefault(), p.shiftKey ? so() : Ia();
      return;
    }
    if (T && p.shiftKey && p.key.toLowerCase() === "l") {
      p.preventDefault(), Ra(Nt, !no);
      return;
    }
    const $ = p.shiftKey ? 10 : 1, U = {
      ArrowLeft: [-$, 0],
      ArrowRight: [$, 0],
      ArrowUp: [0, -$],
      ArrowDown: [0, $]
    }[p.key];
    U && (p.preventDefault(), og(Nt, U[0], U[1]));
  }, po = K == null ? void 0 : K.recipe, zt = po && "sampleId" in po ? Tt.find(({ id: p }) => p === po.sampleId) ?? null : null, hc = zt ? zt.sample.channels.map((p) => ({
    value: p.key,
    label: zt.sample.channelLabel(zt.sample.index(p.key) ?? 0)
  })) : [], ho = zt ? Br(
    zt.tree.populations,
    zt.tree.root_population_id ?? ""
  ) : [], za = () => {
    const p = bn.current.shift();
    p && (nr.current = [
      $a(t),
      ...nr.current
    ].slice(0, 30), Ma(p, !1));
  }, Fa = () => {
    const p = nr.current.shift();
    p && (bn.current = [
      $a(t),
      ...bn.current
    ].slice(0, 30), Ma(p, !1));
  }, go = G.useRef({ undo: za, redo: Fa });
  return go.current = { undo: za, redo: Fa }, G.useEffect(() => {
    const p = (T) => {
      var $, X;
      if (T.key === "Escape" && Cn.current) {
        const U = Cn.current;
        U.cancelled = !0, T.preventDefault(), T.stopPropagation(), sc.current(U.targets), Na(U.ghosts), U.ghosts = void 0, FS(ut.current);
        return;
      }
      const L = Gc(T);
      L && ((X = ($ = T.target) == null ? void 0 : $.closest) != null && X.call($, "input, textarea, select, [contenteditable='true']") || (T.preventDefault(), T.stopPropagation(), L === "undo" ? go.current.undo() : go.current.redo()));
    }, b = () => {
      const T = Cn.current;
      T && (Na(T.ghosts), T.ghosts = void 0);
    };
    return window.addEventListener("keydown", p, !0), window.addEventListener("blur", b), () => {
      window.removeEventListener("keydown", p, !0), window.removeEventListener("blur", b);
    };
  }, []), H ? /* @__PURE__ */ g.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${Et ? " is-preview" : ""}`,
      children: [
        /* @__PURE__ */ g.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": x("Layout sheets"),
            children: [
              t.sheets.map((p) => /* @__PURE__ */ g.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: nt === p.id ? /* @__PURE__ */ g.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: p.name,
                  autoFocus: !0,
                  onFocus: (b) => b.currentTarget.select(),
                  onBlur: (b) => {
                    const T = b.currentTarget.value.trim();
                    T && zn((L) => {
                      const $ = L.sheets.find(
                        ({ id: X }) => X === p.id
                      );
                      $ && ($.name = T);
                    }), pt(null);
                  },
                  onKeyDown: (b) => {
                    b.key === "Enter" && b.currentTarget.blur(), b.key === "Escape" && pt(null);
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
                  ...gg.tabProps(p.id),
                  onClick: () => zn((b) => {
                    b.activeSheetId = p.id;
                  }),
                  onDoubleClick: () => pt(p.id),
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
                    const p = { ...uv(
                      `Layout ${t.sheets.length + 1}`,
                      { ...H.page }
                    ), followFigureStyle: !0 };
                    zn((b) => {
                      b.sheets.push(p), b.activeSheetId = p.id;
                    }), R([]);
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
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => ja("biplot"), disabled: !ge, title: x(ge ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: x("+ Biplot") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => ja("histogram"), disabled: !ge, title: x(ge ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: x("+ Histogram") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: ac, disabled: !ge, title: x(ge ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: x("+ Gating strategy") }),
                /* @__PURE__ */ g.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: x("Add a text block; edit it on the page"),
                    onClick: Ql,
                    children: x("+ Text")
                  }
                ),
                /* @__PURE__ */ g.jsx(Yw, { armed: Ta, onArm: _a }),
                /* @__PURE__ */ g.jsx(Uw, { onFile: (p) => io(p, null) }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: ag, disabled: !ge, title: x("Add one plot per file and plot of the Illustration tab's current selection"), children: x("Add Illustration selection") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: rc, disabled: !ge, title: x("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: x("+ Illustration figure") }),
                /* @__PURE__ */ g.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    onClick: (p) => {
                      const b = p.currentTarget.getBoundingClientRect();
                      Or({ x: b.left, y: b.bottom + 4, at: null });
                    },
                    disabled: !ge,
                    title: x(ge ? "Add a chart: one statistic of a population per file, grouped by a metadata column, or the Plotting tab's current chart" : "Preparing the files…"),
                    children: x("+ Chart")
                  }
                ),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: eg, disabled: !ge || !H.items.length, title: x("Add a text block under the sheet's content: a legend with a sentence group per block, in reading order, giving n, the centre and spread drawn, and the tests"), children: x("Write legend") }),
                /* @__PURE__ */ g.jsx(pm, { ...Co(H, Nt), onAdd: () => kt((p) => {
                  ru(p, Nt);
                }), onRemove: () => kt((p) => {
                  au(p, Nt);
                }) }),
                cn && /* @__PURE__ */ g.jsx(
                  O1,
                  {
                    x: cn.x,
                    y: cn.y,
                    populations: Wt ? Br(Wt.tree.populations, Wt.tree.root_population_id ?? "").filter(({ popId: p }) => p !== Wt.tree.root_population_id).map(({ popId: p, depth: b }) => {
                      var T;
                      return { popId: p, depth: Math.max(0, b - 1), name: ((T = Wt.tree.populations[p]) == null ? void 0 : T.name) ?? p };
                    }) : [],
                    defaultPopulation: Sn !== (Wt == null ? void 0 : Wt.tree.root_population_id) ? Sn : "",
                    metadataColumns: s,
                    onAdd: Zh,
                    onTakePlotting: S ? Jh : void 0,
                    onClose: Uh
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": x("Arrange"), children: [
                LS.map(({ how: p, label: b, title: T }) => /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => sg(p), disabled: !P.length || Et, title: x(T), children: x(b) }, p)),
                zS.map(({ how: p, label: b, title: T }) => /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => lg(p), disabled: Pr < 3 || Et, title: x(T), children: x(b) }, p)),
                /* @__PURE__ */ g.jsx(N1, { unitCount: H ? vd(H, Nt) : 0, disabled: Et, prefs: V, onSpace: (p, b) => kt((T) => T1(T, Nt, Oi(p, "mm"), b)) }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": q, onClick: () => z((p) => !p), title: x("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: x("Snap grid") }),
                /* @__PURE__ */ g.jsx(zw, { on: B, onToggle: () => Y((p) => !p) })
              ] }),
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": Et, onClick: () => Ht(!Et), title: x("Show the page as it exports, without grid, margins or handles"), children: x(Et ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !bn.current.length, onClick: za, title: x("Undo the last layout edit (Cmd-Z)"), children: x("Undo") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !nr.current.length, onClick: Fa, title: x("Redo the undone edit (Shift-Cmd-Z)"), children: x("Redo") }),
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
                        ...jw(H),
                        name: `${H.name} copy`,
                        // Headings that read from a plot read the copy's plot, not the original sheet's.
                        items: gi(H.items).copies
                      };
                      zn((b) => {
                        b.sheets.push(p), b.activeSheetId = p.id;
                      }), R([]);
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
                      zn((p) => {
                        const b = p.sheets.findIndex(
                          ({ id: T }) => T === p.activeSheetId
                        );
                        p.sheets.splice(b, 1), p.activeSheetId = p.sheets[Math.max(0, b - 1)].id;
                      }), R([]);
                    },
                    children: x("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": x("Zoom"), children: [
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: uo, title: x("Fit the page to the window"), children: x("Fit") }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => fo(-1), "aria-label": x("Zoom out"), title: x("Zoom out"), disabled: mt <= Fr[0], children: "−" }),
                /* @__PURE__ */ g.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(mt * 100),
                  "%"
                ] }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => fo(1), "aria-label": x("Zoom in"), title: x("Zoom in"), disabled: mt >= Fr[Fr.length - 1], children: "+" })
              ] }),
              (he.length > 1 || dt.mode !== "off") && /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": x("Pages of the iteration"), children: [
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Ln(Math.max(0, Ye - 1)), disabled: Ye === 0, "aria-label": x("Previous page"), title: x("Previous page"), children: "◀" }),
                /* @__PURE__ */ g.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  x("Page {n} of {count}", { n: Ye + 1, count: Math.max(1, he.length) }),
                  Lt.units.length > 0 && ` · ${Lt.units.map((p) => p.name).join(", ")}`
                ] }),
                /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Ln(Math.min(he.length - 1, Ye + 1)), disabled: Ye >= he.length - 1, "aria-label": x("Next page"), title: x("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ g.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void pc(), disabled: nn || !H.items.length, title: he.length > 1 ? x("Write every page of the iteration; the format is chosen under Page") : x("Write this sheet at its page size; the format is chosen under Page"), children: nn ? x("Exporting…") : x("Export {format}", { format: We.toUpperCase() }) }) }),
              /* @__PURE__ */ g.jsx("span", { className: "gl-layout-performance-note", children: x("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        jt && /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ g.jsx("span", { children: jt }),
          /* @__PURE__ */ g.jsx("button", { type: "button", title: x("Dismiss"), "aria-label": x("Dismiss"), onClick: () => st(null), children: "×" })
        ] }),
        /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ g.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ g.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style"].filter((p) => p !== "iterate" || dt.mode !== "off").map((p) => /* @__PURE__ */ g.jsx(
              "button",
              {
                "aria-pressed": Ct === p,
                title: x(p === "item" ? "The selected item, or the file new plots take" : p === "page" ? "Page size, margins, pages and export" : p === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => Mt(p),
                children: x(p === "item" ? "Items" : p === "page" ? "Page" : p === "iterate" ? "Iterate" : "Style")
              },
              p
            )) }),
            Ct === "item" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("File for new plots"),
                /* @__PURE__ */ g.jsx(
                  "select",
                  {
                    value: lt,
                    onChange: (p) => xt(p.target.value),
                    children: r.map((p) => /* @__PURE__ */ g.jsx("option", { value: p.id, children: p.name }, p.id))
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("Placed plots keep their own file and hierarchy, independently of the Gating selection.") }),
              Ie.error && /* @__PURE__ */ g.jsx("p", { role: "alert", children: Ie.error }),
              /* @__PURE__ */ g.jsx(
                Lm,
                {
                  sheet: H,
                  selectedIds: Nt,
                  samples: Tt,
                  open: ht,
                  onOpenChange: yt,
                  onSelect: (p) => {
                    R(p.map((b) => {
                      var T;
                      return ((T = Lt.items.find((L) => L.templateId === b)) == null ? void 0 : T.id) ?? b;
                    })), p.length === 1 && dc(p[0]);
                  },
                  onChange: kt
                }
              ),
              Zt.length > 1 && /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-inspector", "aria-label": x("Selected layout items"), children: [
                /* @__PURE__ */ g.jsx("strong", { children: Vh ? x("{count} items selected, one group", { count: Zt.length }) : x("{count} items selected", { count: Zt.length }) }),
                /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions", children: [
                  Pr > 1 && /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Ia, title: x("One group: selected, moved, aligned and distributed together (Cmd-G)"), children: x("Group") }),
                  Zt.some((p) => p.group) && /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: so, title: x("Dissolve the group; the items stay where they are (Shift-Cmd-G)"), children: x("Ungroup") }),
                  /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ar(Nt), title: x("Copies of every selected item, 20 px down and right (Cmd-D)"), children: x("Duplicate") }),
                  /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => un(Nt, "front"), title: x("Draw the selected items over every other"), children: x("Bring to front") }),
                  /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => un(Nt, "back"), title: x("Draw the selected items under every other"), children: x("Send to back") }),
                  /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ra(Nt, !no), title: x("Lock or unlock the selected items"), children: x(no ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => rr(Nt), title: x("Remove the selected items (Delete)"), children: x("Remove") })
                ] }),
                /* @__PURE__ */ g.jsx(Dd, { items: Zt, onTurn: (p) => kt((b) => {
                  $o(b, Nt, p);
                }) }),
                /* @__PURE__ */ g.jsx(R1, { itemCount: Zt.filter((p) => !fe(p)).length, unitCount: H ? vd(H, Nt) : 0, prefs: V, onMatch: (p) => kt((b) => {
                  E1(b, Nt, p);
                }), onGrid: ({ columns: p, gapMm: b, order: T }) => kt((L) => D1(L, Nt, { columns: p, gapPx: Oi(b, "mm"), order: T })) }),
                /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("Align and distribute them with the toolbar; drag any of them to move them together; Cmd-G makes them one group.") }),
                /* @__PURE__ */ g.jsx(
                  Xo,
                  {
                    styles: an.map((p) => pn(H, p.recipe, I)),
                    showTitle: an.some(to),
                    texts: Hl,
                    onChange: eo,
                    onTextChange: Vl
                  }
                ),
                an.length > 0 && // A field set here is set on every selected plot, so a grid sent from the
                // Illustration tab is tuned together, not one plot at a time.
                /* @__PURE__ */ g.jsxs("details", { className: "gl-layout-item-style", children: [
                  /* @__PURE__ */ g.jsx(ia, { children: x("Style of the {count} selected plots", { count: an.length }) }),
                  /* @__PURE__ */ g.jsx(
                    Ho,
                    {
                      effective: pn(H, an[0].recipe, I),
                      own: an[0].recipe.style ?? {},
                      omit: Ad,
                      onChange: eo
                    }
                  ),
                  an.some((p) => Object.keys(p.recipe.style ?? {}).length > 0) && /* @__PURE__ */ g.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: x("Drop the selected plots' own values; they then follow the sheet's style"),
                      onClick: () => kt((p) => {
                        for (const b of p.items) {
                          if (!Nt.includes(b.id) || !qt(b.recipe)) continue;
                          const { style: T, ...L } = b.recipe;
                          b.recipe = L;
                        }
                      }),
                      children: x("Follow the sheet")
                    }
                  )
                ] })
              ] }),
              !Zt.length && /* @__PURE__ */ g.jsx(g.Fragment, { children: /* @__PURE__ */ g.jsx(RS, {}) }),
              !K && kd(Zt).length > 0 && /* @__PURE__ */ g.jsx(Ed, { shapes: kd(Zt).map((p) => p.recipe), onChange: tc }),
              K && /* @__PURE__ */ g.jsxs(
                "div",
                {
                  className: "gl-layout-inspector",
                  "aria-label": x("Selected layout item"),
                  children: [
                    /* @__PURE__ */ g.jsx("strong", { children: x("Selected") }),
                    /* @__PURE__ */ g.jsx(
                      Xo,
                      {
                        styles: an.map((p) => pn(H, p.recipe, I)),
                        showTitle: an.some(to),
                        texts: Hl,
                        onChange: eo,
                        onTextChange: Vl
                      }
                    ),
                    K.recipe.kind !== "shape" && /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
                      /* @__PURE__ */ g.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: K.showFrame === !0,
                          onChange: (p) => kt((b) => {
                            const T = b.items.find(
                              (L) => L.id === K.id
                            );
                            T && (T.showFrame = p.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ar([K.id]), title: x("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: x("Duplicate") }),
                      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => un([K.id], "front"), title: x("Draw this item over every other"), children: x("Bring to front") }),
                      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => un([K.id], "back"), title: x("Draw this item under every other"), children: x("Send to back") }),
                      /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => rr([K.id]), title: x("Remove this item from the page (Delete)"), children: x("Remove") })
                    ] }),
                    /* @__PURE__ */ g.jsx(Dd, { items: [K], onTurn: (p) => kt((b) => {
                      $o(b, [K.id], p);
                    }) }),
                    /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: x("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ g.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: K.locked === !0,
                          onChange: (p) => Ra([K.id], p.target.checked)
                        }
                      ),
                      x("Locked")
                    ] }),
                    /* @__PURE__ */ g.jsx(
                      I1,
                      {
                        item: K,
                        prefs: V,
                        onCommit: (p) => kt((b) => {
                          const T = b.items.find(
                            (L) => L.id === K.id
                          );
                          T && Object.assign(T, p);
                        })
                      }
                    ),
                    /* @__PURE__ */ g.jsx(Q1, { source: Hh }),
                    K.recipe.kind === "text" && K.recipe.legendGenerated && /* @__PURE__ */ g.jsx(
                      nw,
                      {
                        date: K.recipe.legendGenerated,
                        onRegenerate: () => {
                          const p = bd(Lt.items.filter((b) => b.templateId !== K.id), An, 0, void 0, ec());
                          _t((b) => b.kind === "text" && p ? { ...b, text: p.recipe.text, legendGenerated: Ch() } : b);
                        }
                      }
                    ),
                    fe(K) ? /* @__PURE__ */ g.jsx(gm, { owner: ((p) => p ? Ae(p, Tt) : "")(H.items.find(({ id: p }) => p === K.recipe.letterFor)), style: gr(H), onChange: (p) => kt((b) => iu(b, p)) }) : K.recipe.kind === "text" ? /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Text"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            value: K.recipe.rich ? af(K.recipe) : K.recipe.text,
                            readOnly: K.recipe.rich,
                            onChange: (p) => _t(
                              (b) => b.kind === "text" ? { ...b, text: p.target.value } : b
                            )
                          }
                        )
                      ] }),
                      K.recipe.rich && /* @__PURE__ */ g.jsx(gS, {}),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Reads from"),
                        /* @__PURE__ */ g.jsxs(
                          "select",
                          {
                            "aria-label": x("Reads from"),
                            value: K.recipe.readsFrom ?? "",
                            onChange: (p) => _t((b) => {
                              if (b.kind !== "text") return b;
                              const T = { ...b };
                              return p.target.value ? T.readsFrom = p.target.value : delete T.readsFrom, T;
                            }),
                            children: [
                              /* @__PURE__ */ g.jsx("option", { value: "", children: x("Nothing: plain text") }),
                              H.items.filter((p) => p.recipe.kind !== "text").map((p) => /* @__PURE__ */ g.jsx("option", { value: p.id, children: Ae(p, Tt) }, p.id))
                            ]
                          }
                        )
                      ] }),
                      K.recipe.readsFrom && /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: xo }) })
                    ] }) : K.recipe.kind === "figure" ? /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                      /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ g.jsx(
                        b1,
                        {
                          recipe: K.recipe,
                          files: r,
                          state: f,
                          columnLevels: l,
                          onChange: (p) => _t((b) => b.kind === "figure" ? { ...b, page: p } : b)
                        }
                      ),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        x("Title"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            placeholder: Ae(K, Tt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => _t((b) => b.kind === "figure" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      w && /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: x("Load this figure into the Illustration tab"),
                          onClick: () => w(structuredClone(K.recipe.illustration)),
                          children: x("Edit in Illustration")
                        }
                      ),
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !(y != null && y.figure),
                          title: x("Take the Illustration tab's current figure in place of this one"),
                          onClick: () => _t(
                            (p) => p.kind === "figure" && y ? { ...p, illustration: structuredClone(y) } : p
                          ),
                          children: x("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : K.recipe.kind === "shape" ? /* @__PURE__ */ g.jsx(Ed, { shapes: [K.recipe], onChange: tc }) : K.recipe.kind === "image" ? /* @__PURE__ */ g.jsx(tS, { recipe: K.recipe, onReplace: (p) => tg(p, K.id) }) : K.recipe.kind === "cellpanel" ? /* @__PURE__ */ g.jsx(
                      Gb,
                      {
                        recipe: K.recipe,
                        onChange: (p) => _t((b) => b.kind === "cellpanel" ? p : b)
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
                            onChange: (p) => _t((b) => b.kind === "imagewall" ? { ...b, title: p.target.value } : b)
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
                            onChange: (p) => _t((b) => b.kind === "imagewall" ? { ...b, tile: Math.max(16, Math.min(200, Math.round(Number(p.target.value) || 56))) } : b)
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
                            onChange: (p) => _t((b) => b.kind === "imagewall" ? { ...b, columns: Math.max(1, Math.min(24, Math.round(Number(p.target.value) || 8))) } : b)
                          }
                        )
                      ] })
                    ] }) : K.recipe.kind === "proportions" ? /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                      /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ g.jsx(
                        dv,
                        {
                          recipe: ($t == null ? void 0 : $t.recipe.kind) === "proportions" ? $t.recipe : K.recipe,
                          samples: r,
                          state: f,
                          metadataById: xe,
                          divisionProfiles: C,
                          dataRevision: E
                        }
                      ),
                      /* @__PURE__ */ g.jsx(
                        S1,
                        {
                          recipe: K.recipe,
                          samples: r,
                          state: f,
                          metadataById: xe,
                          divisionProfiles: C,
                          dataRevision: E,
                          metadataLevels: l,
                          onChange: (p) => _t((b) => {
                            if (b.kind !== "proportions") return b;
                            const { panel: T, ...L } = b;
                            return p ? { ...L, panel: p } : L;
                          })
                        }
                      ),
                      K.recipe.panel && dt.mode !== "off" && dt.mode !== "populations" && /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: dt.mode === "metadata" ? x("Drawn once per value of {column}, from that value's files; unticked, it shows its own files on every page", { column: dt.column ?? "" }) : x("Drawn once per file of the iteration, from that file; unticked, it shows its own files on every page"), children: [
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.iterated === !0,
                            onChange: (p) => _t((b) => b.kind === "proportions" ? { ...b, iterated: p.target.checked } : b)
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
                            onChange: (p) => _t((b) => b.kind === "proportions" ? { ...b, textSize: p.target.value === "sheet" ? "sheet" : "chart" } : b),
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
                            placeholder: Ae(K, Tt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => _t((b) => b.kind === "proportions" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      M && /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: x("Open this chart's settings in the Plotting tab as a new chart"),
                          onClick: () => {
                            var p;
                            return M(structuredClone(K.recipe.settings), ((p = K.name) == null ? void 0 : p.trim()) || Ae(K, Tt));
                          },
                          children: x("Edit in Plotting")
                        }
                      ),
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !S,
                          title: x("Take the Plotting tab's current chart in place of this one"),
                          onClick: () => {
                            const p = S == null ? void 0 : S();
                            p && _t((b) => b.kind === "proportions" ? { ...b, settings: p } : b);
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
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, populationId: p.target.value } : b),
                            children: ho.map(({ popId: p, depth: b }) => {
                              var T;
                              return /* @__PURE__ */ g.jsxs("option", { value: p, children: [
                                " ".repeat(b * 2),
                                ((T = zt == null ? void 0 : zt.tree.populations[p]) == null ? void 0 : T.name) ?? p
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
                            onChange: (p) => _t((b) => {
                              var $;
                              if (b.kind !== "chart") return b;
                              const T = p.target.value, L = T === "median" && !b.channel ? ($ = zt == null ? void 0 : zt.sample.channels[0]) == null ? void 0 : $.key : b.channel;
                              return { ...b, statistic: T, ...L ? { channel: L } : {} };
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
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, channel: p.target.value } : b),
                            children: ((zt == null ? void 0 : zt.sample.channels) ?? []).map((p) => /* @__PURE__ */ g.jsx("option", { value: p.key, children: (zt == null ? void 0 : zt.sample.labelForKey(p.key)) ?? p.key }, p.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Files"),
                        /* @__PURE__ */ g.jsxs(
                          "select",
                          {
                            value: K.recipe.files,
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, files: p.target.value === "all" ? "all" : "checked" } : b),
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
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, groupBy: p.target.value } : b),
                            children: [
                              /* @__PURE__ */ g.jsx("option", { value: "", children: x("Each file") }),
                              s.map((p) => /* @__PURE__ */ g.jsx("option", { value: p, children: p }, p))
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
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, chartType: p.target.value } : b),
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
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, showPoints: p.target.checked } : b)
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
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, test: p.target.checked } : b)
                          }
                        ),
                        x("Test between groups")
                      ] }),
                      Pe && (Pe.missing.length > 0 || Pe.noChannel.length > 0) && /* @__PURE__ */ g.jsxs("p", { className: "gl-hint gl-layout-warning", children: [
                        Pe.missing.length > 0 && x("No point for {files}: the population is not on these files.", { files: Pe.missing.join(", ") }),
                        Pe.missing.length > 0 && Pe.noChannel.length > 0 && " ",
                        Pe.noChannel.length > 0 && x("No point for {files}: the channel is not on these files.", { files: Pe.noChannel.join(", ") })
                      ] }),
                      (Pe == null ? void 0 : Pe.unassigned) && /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x(K.recipe.test ? "Files without a value in the column are drawn as Unassigned and left out of the test." : "Files without a value in the column are drawn as Unassigned.") }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        x("Title"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            placeholder: Ae(K, Tt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !zt,
                          title: x("Replace this chart with a Plotting chart of the same files, population, statistic, grouping, plot type and test, in the same frame"),
                          onClick: () => {
                            const p = zt;
                            p && _t(
                              (b) => b.kind === "chart" ? yh(b, p.tree, { all: r.map((T) => T.id), checked: a }, Jl(b)) : b
                            );
                          },
                          children: x("Convert to a Plotting chart")
                        }
                      )
                    ] }) : /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                      !na(K.recipe) && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("FCS"),
                        /* @__PURE__ */ g.jsx(
                          "select",
                          {
                            value: K.recipe.sampleId,
                            onChange: (p) => _t((b) => {
                              if (b.kind === "text" || b.kind === "figure" || b.kind === "proportions" || b.kind === "imagewall" || b.kind === "cellpanel" || b.kind === "shape" || b.kind === "image") return b;
                              const T = Tt.find(
                                ($) => $.id === p.target.value
                              );
                              if (!T) return b;
                              const L = zt && ci(
                                {
                                  hierarchyId: zt.tree.id,
                                  populationId: b.populationId
                                },
                                T.tree,
                                Dn(f)
                              );
                              return {
                                ...b,
                                sampleId: T.id,
                                populationId: (L == null ? void 0 : L.id) ?? T.tree.root_population_id ?? ""
                              };
                            }),
                            children: Tt.map((p) => /* @__PURE__ */ g.jsx("option", { value: p.id, children: p.name }, p.id))
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
                                oo(null);
                                return;
                              }
                              const b = K.recipe.kind === "biplot" || K.recipe.kind === "histogram" ? K.recipe.sampleId : "";
                              oo(a.includes(b) ? a : [b]);
                            }
                          }
                        ),
                        x("Pool files")
                      ] }),
                      (K.recipe.kind === "biplot" || K.recipe.kind === "histogram") && K.recipe.pool && /* @__PURE__ */ g.jsx(
                        WS,
                        {
                          files: r,
                          pool: K.recipe.pool.sampleIds,
                          checkedSampleIds: a,
                          groups: i,
                          fileGroups: o,
                          report: ig,
                          onChange: oo
                        }
                      ),
                      (K.recipe.kind === "biplot" || K.recipe.kind === "histogram") && zt && (((mc = K.recipe.populationIds) == null ? void 0 : mc.length) ?? 0) > 1 ? (
                        // An overlay is edited as its populations; down to one, it is a plot of that one.
                        /* @__PURE__ */ g.jsx(
                          XS,
                          {
                            populations: ho,
                            tree: zt.tree,
                            chosen: new Set((K.recipe.populationIds ?? []).map((p) => gn(p, zt.tree, ye).id)),
                            onChange: (p) => _t((b) => {
                              if (b.kind !== "biplot" && b.kind !== "histogram") return b;
                              if (p.length > 1) return { ...b, populationId: p[0], populationIds: p };
                              const { populationIds: T, ...L } = b;
                              return { ...L, populationId: p[0] };
                            })
                          }
                        )
                      ) : /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                        x("Population"),
                        /* @__PURE__ */ g.jsx(
                          "select",
                          {
                            value: K.recipe.populationId,
                            onChange: (p) => _t(
                              (b) => b.kind === "text" ? b : {
                                ...b,
                                populationId: p.target.value
                              }
                            ),
                            children: ho.map(({ popId: p, depth: b }) => {
                              var T;
                              return /* @__PURE__ */ g.jsxs("option", { value: p, children: [
                                " ".repeat(b * 2),
                                ((T = zt == null ? void 0 : zt.tree.populations[p]) == null ? void 0 : T.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      K.recipe.kind !== "strategy" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ g.jsx(
                            Fc,
                            {
                              label: x("X channel"),
                              value: K.recipe.xChannel,
                              options: hc,
                              onChange: (p) => _t(
                                (b) => b.kind === "biplot" || b.kind === "histogram" ? { ...b, xChannel: p } : b
                              )
                            }
                          )
                        ] }),
                        K.recipe.kind === "biplot" && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ g.jsx(
                            Fc,
                            {
                              label: x("Y channel"),
                              value: K.recipe.yChannel ?? "",
                              options: hc,
                              onChange: (p) => _t(
                                (b) => b.kind === "biplot" ? { ...b, yChannel: p } : b
                              )
                            }
                          )
                        ] })
                      ] }),
                      K.recipe.kind === "strategy" && ((xc = K.recipe.populationIds) == null ? void 0 : xc.length) && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                        /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("{count} populations; the grid follows the live gates", { count: K.recipe.populationIds.length }) }),
                        /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: x("Tree: a column per depth and a row per leaf. Wrapped: the tree walked depth first and wrapped into rows of the columns beside."), children: [
                          x("Layout"),
                          /* @__PURE__ */ g.jsxs(
                            "select",
                            {
                              value: K.recipe.layout ?? "tree",
                              onChange: (p) => _t((b) => b.kind === "strategy" ? { ...b, layout: p.target.value === "flow" ? "flow" : "tree" } : b),
                              children: [
                                /* @__PURE__ */ g.jsx("option", { value: "tree", children: x("Tree") }),
                                /* @__PURE__ */ g.jsx("option", { value: "flow", children: x("Wrapped") })
                              ]
                            }
                          )
                        ] }),
                        (K.recipe.layout ?? "tree") === "flow" && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                          x("Columns"),
                          /* @__PURE__ */ g.jsx(ie, { min: 1, max: 24, integer: !0, value: K.recipe.columns ?? 4, onCommit: (p) => _t((b) => b.kind === "strategy" ? { ...b, columns: p } : b) })
                        ] }),
                        /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: x("An arrow from each gate to the panel of the population it makes, through the gutters"), children: [
                          /* @__PURE__ */ g.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: K.recipe.showArrows !== !1,
                              onChange: (p) => _t((b) => b.kind === "strategy" ? { ...b, showArrows: p.target.checked } : b)
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
                                onChange: (p) => _t((b) => b.kind === "strategy" ? { ...b, arrowColor: p.target.checked ? "#444444" : void 0 } : b)
                              }
                            ),
                            x("One colour"),
                            K.recipe.arrowColor && /* @__PURE__ */ g.jsx(
                              "input",
                              {
                                type: "color",
                                value: K.recipe.arrowColor,
                                onChange: (p) => _t((b) => b.kind === "strategy" ? { ...b, arrowColor: p.target.value } : b)
                              }
                            )
                          ] }),
                          /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", title: x("Where an arrow leaves its panel: level with the gate's label, or with the centre of the gate itself"), children: [
                            x("Arrows from"),
                            /* @__PURE__ */ g.jsxs(
                              "select",
                              {
                                value: K.recipe.arrowAnchor ?? "label",
                                onChange: (p) => _t((b) => b.kind === "strategy" ? { ...b, arrowAnchor: p.target.value === "gate" ? "gate" : void 0 } : b),
                                children: [
                                  /* @__PURE__ */ g.jsx("option", { value: "label", children: x("Gate label") }),
                                  /* @__PURE__ */ g.jsx("option", { value: "gate", children: x("Gate centre") })
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                            x("Arrow width"),
                            /* @__PURE__ */ g.jsx(ie, { min: 0.5, max: 6, step: 0.25, value: K.recipe.arrowWidth ?? 1.5, onCommit: (p) => _t((b) => b.kind === "strategy" ? { ...b, arrowWidth: p } : b) })
                          ] })
                        ] })
                      ] }),
                      K.recipe.kind === "strategy" && !((yc = K.recipe.populationIds) != null && yc.length) && /* @__PURE__ */ g.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.fullPath,
                            onChange: (p) => _t(
                              (b) => b.kind === "strategy" ? {
                                ...b,
                                fullPath: p.target.checked
                              } : b
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
                            onChange: (p) => _t(
                              (b) => b.kind === "text" ? b : {
                                ...b,
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
                      dt.mode !== "off" && /* @__PURE__ */ g.jsxs("label", { className: "gl-check", title: dt.mode === "populations" ? x("Drawn once per population of the iteration, for that population; unticked, it shows its own population on every page") : dt.mode === "metadata" ? x("Drawn once per value of {column}, pooling that value's files; unticked, it shows its own files on every page", { column: dt.column ?? "" }) : x("Drawn once per file of the iteration, for that file; unticked, it shows this file on every page"), children: [
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.iterated === !0,
                            onChange: (p) => _t(
                              (b) => b.kind === "text" ? b : { ...b, iterated: p.target.checked }
                            )
                          }
                        ),
                        x("Follows the iteration")
                      ] }),
                      ic && /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: ic }),
                      /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: x("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: xo }), children: [
                        x("Title"),
                        /* @__PURE__ */ g.jsx(
                          "input",
                          {
                            placeholder: Kh || Ae(K, Tt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => _t(
                              (b) => b.kind === "text" || b.kind === "shape" || b.kind === "image" ? b : { ...b, title: p.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ g.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ g.jsxs(ia, { children: [
                          x("Style"),
                          Object.keys(K.recipe.style ?? {}).length > 0 ? ` · ${x("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ g.jsx(
                          Ho,
                          {
                            effective: pn(H, K.recipe, I),
                            own: K.recipe.style ?? {},
                            omit: Ad,
                            onChange: (p) => _t(
                              (b) => qt(b) ? { ...b, style: bo({ ...b.style, ...p }) } : b
                            )
                          }
                        ),
                        Object.keys(K.recipe.style ?? {}).length > 0 && /* @__PURE__ */ g.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: x("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => _t((p) => {
                              if (!qt(p)) return p;
                              const { style: b, ...T } = p;
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
                          onClick: () => _(
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
            Ct === "page" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
              /* @__PURE__ */ g.jsx("h3", { children: x("Page") }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Size"),
                /* @__PURE__ */ g.jsxs(
                  "select",
                  {
                    value: H.page.preset,
                    onChange: (p) => Fn(pv(p.target.value, H.page.orientation, H.page)),
                    children: [
                      Object.entries(fv).map(([p, b]) => /* @__PURE__ */ g.jsx("option", { value: p, children: b.label }, p)),
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
                    onChange: (p) => Fn({ ...H.page, orientation: p.target.value }),
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
                  ie,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": x(p === "width" ? "Width (mm)" : "Height (mm)"),
                    value: $d(H.page)[p === "width" ? "widthMm" : "heightMm"],
                    onCommit: (b) => {
                      const T = H.page.orientation === "landscape", L = p === "width" == !T ? "widthMm" : "heightMm";
                      Fn({ ...H.page, preset: "custom", [L]: b });
                    }
                  }
                )
              ] }, p)) }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Margin (mm)"),
                /* @__PURE__ */ g.jsx(
                  ie,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: H.page.marginMm,
                    onCommit: (p) => Fn({ ...H.page, marginMm: p })
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ g.jsxs("label", { children: [
                  x("Pages across"),
                  /* @__PURE__ */ g.jsx(ie, { min: 1, max: Bc, step: 1, integer: !0, "aria-label": x("Pages across"), value: H.page.columns, onCommit: (p) => Fn({ ...H.page, columns: p }) })
                ] }),
                /* @__PURE__ */ g.jsxs("label", { children: [
                  x("Pages down"),
                  /* @__PURE__ */ g.jsx(ie, { min: 1, max: Bc, step: 1, integer: !0, "aria-label": x("Pages down"), value: H.page.rows, onCommit: (p) => Fn({ ...H.page, rows: p }) })
                ] })
              ] }),
              /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: fg, disabled: !H.items.length, title: x("Make the page a custom size that holds every item inside the margin, as one page"), children: x("Fit page to content") }),
                /* @__PURE__ */ g.jsx("button", { type: "button", className: "gl-mini-btn", onClick: pg, disabled: !H.items.length, title: x("Scale and centre every item, as one group, to fill the first page inside its margin"), children: x("Fit content to page") }),
                /* @__PURE__ */ g.jsx($w, { count: ((bc = H.guides) == null ? void 0 : bc.length) ?? 0, onClear: () => kt(Nw) })
              ] }),
              /* @__PURE__ */ g.jsx("h3", { children: x("Export") }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Format"),
                /* @__PURE__ */ g.jsxs("select", { value: We, onChange: (p) => jr(p.target.value), children: [
                  /* @__PURE__ */ g.jsx("option", { value: "pdf", children: x("PDF · the page at its size") }),
                  /* @__PURE__ */ g.jsx("option", { value: "svg", children: x("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ g.jsx("option", { value: "png", children: x("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Resolution (dpi)"),
                /* @__PURE__ */ g.jsx(
                  ie,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: H.page.dpi,
                    onCommit: (p) => Fn({ ...H.page, dpi: p })
                  }
                )
              ] }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                /* @__PURE__ */ g.jsx("input", { type: "checkbox", checked: Nn, onChange: (p) => ba(p.target.checked) }),
                x("Crop to content")
              ] }),
              Nn && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Padding (mm)"),
                /* @__PURE__ */ g.jsx(ie, { min: 0, max: 50, step: 0.5, "aria-label": x("Padding (mm)"), value: On, onCommit: Zi })
              ] }),
              /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void pc(), disabled: nn || !H.items.length, children: x(nn ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ g.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void La.exportAll(), disabled: nn || !La.canExport, title: x("Write every sheet that has items: as PDF one file with each sheet's pages in sheet order; as SVG or PNG one zip with a folder per sheet"), children: La.progress ? x("Sheet {n} of {count}", La.progress) : x("Export all sheets") }),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x(Nn ? "The export is cut down to the items on each page plus the padding, so a figure comes out without the paper around it; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above." : "The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            Ct === "iterate" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
              /* @__PURE__ */ g.jsx("h3", { children: x("Iterate") }),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("Iteration is being retired from Layout. Pages per file or group are now made in Illustration or Plotting and sent here with “Every page, one sheet each”. This sheet keeps working as it is.") }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Draw the sheet"),
                /* @__PURE__ */ g.jsxs(
                  "select",
                  {
                    value: dt.mode,
                    onChange: (p) => {
                      const b = p.target.value;
                      if (b === "metadata") {
                        const T = dt.column && s.includes(dt.column) ? dt.column : s[0] ?? "";
                        Je({ ...dt, mode: "metadata", column: T, source: dt.source.kind === "metadata" ? { kind: "checked" } : dt.source });
                        return;
                      }
                      Je({ ...dt, mode: b === "files" ? "files" : b === "populations" ? "populations" : "off" });
                    },
                    children: [
                      /* @__PURE__ */ g.jsx("option", { value: "off", children: x("Once") }),
                      /* @__PURE__ */ g.jsx("option", { value: "files", children: x("Once per file") }),
                      /* @__PURE__ */ g.jsx("option", { value: "populations", children: x("Once per population") }),
                      /* @__PURE__ */ g.jsx("option", { value: "metadata", disabled: !s.length, children: x("Once per value of a metadata column") })
                    ]
                  }
                )
              ] }),
              dt.mode === "metadata" && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Column"),
                /* @__PURE__ */ g.jsx("select", { value: dt.column ?? "", onChange: (p) => Je({ ...dt, column: p.target.value }), children: s.map((p) => /* @__PURE__ */ g.jsx("option", { value: p, children: p }, p)) })
              ] }),
              dt.mode !== "off" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                dt.mode === "populations" && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                  x("Populations"),
                  /* @__PURE__ */ g.jsxs(
                    "select",
                    {
                      value: ((wc = dt.populations) == null ? void 0 : wc.kind) === "branch" ? dt.populations.populationId : "all",
                      onChange: (p) => Je({
                        ...dt,
                        populations: p.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: p.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ g.jsx("option", { value: "all", children: x("All in the tree") }),
                        (ue ? Br(ue.tree.populations, ue.tree.root_population_id ?? "") : []).filter(({ popId: p }) => p !== (ue == null ? void 0 : ue.tree.root_population_id)).map(({ popId: p, depth: b }) => {
                          var T;
                          return /* @__PURE__ */ g.jsxs("option", { value: p, children: [
                            " ".repeat(b * 2),
                            x("Under {name}", { name: ((T = ue == null ? void 0 : ue.tree.populations[p]) == null ? void 0 : T.name) ?? p })
                          ] }, p);
                        })
                      ]
                    }
                  )
                ] }),
                (dt.mode === "files" || dt.mode === "metadata") && /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                  x("Files"),
                  /* @__PURE__ */ g.jsxs("select", { value: mg, onChange: (p) => Je({ ...dt, source: xg(p.target.value) }), children: [
                    /* @__PURE__ */ g.jsx("option", { value: "checked", children: x("Checked files") }),
                    /* @__PURE__ */ g.jsx("option", { value: "all", children: x("All files") }),
                    i.map((p) => /* @__PURE__ */ g.jsx("option", { value: `group:${p.id}`, children: x("Group {name}", { name: p.name }) }, p.id)),
                    dt.mode === "files" && s.flatMap(
                      (p) => vg(p).map((b) => /* @__PURE__ */ g.jsxs("option", { value: `meta:${p}=${b}`, children: [
                        p,
                        " = ",
                        b
                      ] }, `${p}=${b}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                  x("Arrangement"),
                  /* @__PURE__ */ g.jsxs(
                    "select",
                    {
                      value: dt.arrangement.kind,
                      onChange: (p) => Je({
                        ...dt,
                        // Tiles start at as many as fit the paper, so none is cut off by default.
                        arrangement: p.target.value === "tiles" ? { kind: "tiles", ...ou(H, 24), order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ g.jsx("option", { value: "page-per-unit", children: dt.mode === "populations" ? x("One page per population") : dt.mode === "metadata" ? x("One page per value") : x("One page per file") }),
                        /* @__PURE__ */ g.jsx("option", { value: "tiles", children: x("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                dt.arrangement.kind === "tiles" && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
                  /* @__PURE__ */ g.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((p) => /* @__PURE__ */ g.jsxs("label", { children: [
                    x(p === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ g.jsx(
                      ie,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": x(p === "columns" ? "Tiles across" : "Tiles down"),
                        value: dt.arrangement.kind === "tiles" ? dt.arrangement[p] : 1,
                        onCommit: (b) => {
                          dt.arrangement.kind === "tiles" && Je({ ...dt, arrangement: { ...dt.arrangement, [p]: b } });
                        }
                      }
                    )
                  ] }, p)) }),
                  /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                    x("Order"),
                    /* @__PURE__ */ g.jsxs(
                      "select",
                      {
                        value: dt.arrangement.order,
                        onChange: (p) => dt.arrangement.kind === "tiles" && Je({ ...dt, arrangement: { ...dt.arrangement, order: p.target.value === "column-major" ? "column-major" : "row-major" } }),
                        children: [
                          /* @__PURE__ */ g.jsx("option", { value: "row-major", children: x("Across, then down") }),
                          /* @__PURE__ */ g.jsx("option", { value: "column-major", children: x("Down, then across") })
                        ]
                      }
                    )
                  ] }),
                  (() => {
                    const p = Cm(Lt.items, H);
                    if (!p || dt.arrangement.kind !== "tiles") return null;
                    const b = ou(H, dt.arrangement.gap);
                    return /* @__PURE__ */ g.jsxs("p", { className: "gl-hint gl-layout-warning", role: "status", children: [
                      x("{n} of {m} items on this page reach beyond the paper; the export cuts them off. {across} across × {down} down fit.", { n: p, m: Lt.items.length, across: b.columns, down: b.rows }),
                      " ",
                      /* @__PURE__ */ g.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => dt.arrangement.kind === "tiles" && Je({ ...dt, arrangement: { ...dt.arrangement, ...b } }),
                          children: x("Fit the tiles to the page")
                        }
                      )
                    ] });
                  })(),
                  /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                    x("Gap between tiles (px)"),
                    /* @__PURE__ */ g.jsx(
                      ie,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: dt.arrangement.gap,
                        onCommit: (p) => {
                          dt.arrangement.kind === "tiles" && Je({ ...dt, arrangement: { ...dt.arrangement, gap: p } });
                        }
                      }
                    )
                  ] })
                ] }),
                Re.length === 0 && /* @__PURE__ */ g.jsx("p", { className: "gl-hint gl-layout-warning", role: "status", children: dt.mode === "populations" ? x("No populations to draw: the file has none under this choice. The sheet is shown once, with its placeholders unfilled.") : x("No files to draw: the source names none (are any files checked in the Samples pane?). The sheet is shown once, with its placeholders unfilled.") }),
                /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: dt.mode === "populations" ? x("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: Re.length, of: (ue == null ? void 0 : ue.name) ?? "the file", pages: Math.max(1, he.length) }) : dt.mode === "metadata" ? x("{values} values of {column} over {files} files → {pages} pages. Items marked “Follows the iteration” pool the files of each value; the others repeat. Text and titles may use {sample} (the value), {meta:column}, {file} (how many files), {n} and {N}; a plot title may also use {population} and {count}.", { values: Re.length, column: dt.column ?? "", files: Re.reduce((p, b) => {
                  var T;
                  return p + (((T = b.sampleIds) == null ? void 0 : T.length) ?? 0);
                }, 0), pages: Math.max(1, he.length) }) : x("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: Re.length, pages: Math.max(1, he.length) }) })
              ] })
            ] }),
            Ct === "style" && H && /* @__PURE__ */ g.jsxs(g.Fragment, { children: [
              /* @__PURE__ */ g.jsx("h3", { children: x("Style") }),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                x("Plot titles"),
                /* @__PURE__ */ g.jsxs(
                  "select",
                  {
                    "aria-label": x("Plot titles"),
                    value: $l ? "custom" : ((Sc = Ga.find((p) => p.template === (H.titleTemplate ?? ""))) == null ? void 0 : Sc.id) ?? "custom",
                    onChange: (p) => {
                      const b = Ga.find((T) => T.id === p.target.value);
                      Wh(!b), kt((T) => {
                        var L;
                        b ? b.template ? T.titleTemplate = b.template : delete T.titleTemplate : T.titleTemplate = ((L = T.titleTemplate) == null ? void 0 : L.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      Ga.map((p) => /* @__PURE__ */ g.jsx("option", { value: p.id, children: x(p.label) }, p.id)),
                      /* @__PURE__ */ g.jsx("option", { value: "custom", children: x("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const p = H.items.filter((b) => Ul(b));
                return p.length ? /* @__PURE__ */ g.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  x("{count} plots keep a title of their own, so the template does not reach them.", { count: p.length }),
                  " ",
                  /* @__PURE__ */ g.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: x("Drop those plots' own titles so every plot on the sheet follows the template"),
                      onClick: () => kt((b) => {
                        for (const T of b.items) qt(T.recipe) && delete T.recipe.title;
                      }),
                      children: x("Use the template for all")
                    }
                  )
                ] }) : null;
              })(),
              ($l || !Ga.some((p) => p.template === (H.titleTemplate ?? ""))) && (() => {
                var It;
                const p = H.titleTemplate ?? "", b = hv(p), T = (b == null ? void 0 : b.tokens) ?? [], L = (b == null ? void 0 : b.separator) ?? Yh, $ = (ct) => {
                  var Jt;
                  return ((Jt = Yl.find((Me) => Me.token === ct)) == null ? void 0 : Jt.label) ?? ct;
                }, X = (ct) => kt((Jt) => {
                  Jt.titleTemplate = Hc(ct, L);
                }), U = Lt.items.find((ct) => qt(ct.recipe)), it = U && qt(U.recipe) ? fi(p, wn(U.recipe, U.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ g.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": x("Title builder"), children: [
                  /* @__PURE__ */ g.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": x("Fields in the title"), children: [
                    T.length === 0 && /* @__PURE__ */ g.jsx("span", { className: "gl-hint", children: x(b === null && p ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    T.map((ct, Jt) => /* @__PURE__ */ g.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": x("Remove {field}", { field: $(ct) }),
                        title: x("Remove {field} from the title", { field: $(ct) }),
                        onClick: () => X(T.filter((Me, dn) => dn !== Jt)),
                        children: [
                          $(ct),
                          " ×"
                        ]
                      },
                      `${ct}-${Jt}`
                    ))
                  ] }),
                  /* @__PURE__ */ g.jsx("div", { className: "gl-title-builder-fields", "aria-label": x("Fields to add"), children: Yl.map((ct) => /* @__PURE__ */ g.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-chip",
                      "aria-label": x("Add {field}", { field: ct.label }),
                      title: ct.token,
                      onClick: () => X([...T, ct.token]),
                      children: ct.label
                    },
                    ct.token
                  )) }),
                  /* @__PURE__ */ g.jsxs("label", { className: "gl-field-inline", children: [
                    x("Between fields"),
                    /* @__PURE__ */ g.jsx(
                      "select",
                      {
                        "aria-label": x("Separator"),
                        value: ((It = yo.find((ct) => ct.value === L)) == null ? void 0 : It.id) ?? "dot",
                        onChange: (ct) => {
                          var Me;
                          const Jt = ((Me = yo.find((dn) => dn.id === ct.target.value)) == null ? void 0 : Me.value) ?? " · ";
                          Xh(Jt), T.length && kt((dn) => {
                            dn.titleTemplate = Hc(T, Jt);
                          });
                        },
                        children: yo.map((ct) => /* @__PURE__ */ g.jsx("option", { value: ct.id, children: x(ct.label) }, ct.id))
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
                        onChange: (ct) => kt((Jt) => {
                          Jt.titleTemplate = ct.target.value;
                        })
                      }
                    )
                  ] }),
                  it && /* @__PURE__ */ g.jsx("div", { className: "gl-hint gl-title-builder-preview", children: x("First plot reads: {title}", { title: it }) })
                ] });
              })(),
              /* @__PURE__ */ g.jsx("p", { className: "gl-hint", children: x(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise; on an iterated sheet it looks across every page, so each page is titled alike and names what it is drawn for.`, { list: xo }) }),
              /* @__PURE__ */ g.jsx(
                gv,
                {
                  following: H.followFigureStyle === !0,
                  onFollow: (p) => kt((b) => {
                    p ? b.followFigureStyle = !0 : delete b.followFigureStyle;
                  })
                }
              ),
              H.followFigureStyle !== !0 && /* @__PURE__ */ g.jsx(
                Xo,
                {
                  styles: (() => {
                    const p = H.items.filter((b) => qt(b.recipe));
                    return p.length ? p.map((b) => pn(H, b.recipe, I)) : [pn(H, null, I)];
                  })(),
                  showTitle: !H.items.some((p) => qt(p.recipe)) || H.items.some(to),
                  onChange: Xl
                }
              ),
              /* @__PURE__ */ g.jsx(
                Ho,
                {
                  effective: pn(H, null, I),
                  own: H.style ?? {},
                  omit: H.followFigureStyle === !0 ? KS : Ui,
                  onChange: Xl
                }
              ),
              Object.keys(H.style ?? {}).length > 0 && /* @__PURE__ */ g.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  onClick: () => kt((p) => {
                    delete p.style;
                  }),
                  children: x("Reset to defaults")
                }
              ),
              /* @__PURE__ */ g.jsx(hm, { style: gr(H), onChange: (p) => kt((b) => iu(b, p)) })
            ] })
          ] }),
          /* @__PURE__ */ g.jsx(vv, { menu: qh, onClose: () => Da(null) }),
          /* @__PURE__ */ g.jsx(ew, { container: W, describe: (p) => {
            const b = Lt.items.find((T) => T.id === p);
            return b ? An(b) : null;
          } }),
          !Et && B && /* @__PURE__ */ g.jsx(Lw, { scroller: J, page: W, zoom: mt, selected: Zt, onAddGuide: (p) => kt((b) => Iw(b, p)) }),
          /* @__PURE__ */ g.jsxs(
            "div",
            {
              ref: (p) => {
                rn.current = p, rt(p);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": x("Layout page"),
              onKeyDown: yg,
              children: [
                !Et && J && /* @__PURE__ */ g.jsx(
                  Bb,
                  {
                    ref: vt,
                    container: J,
                    dragContainer: J,
                    selectableTargets: [".gl-layout-item"],
                    selectByClick: !0,
                    selectFromInside: !1,
                    continueSelect: !1,
                    toggleContinueSelect: ["shift"],
                    hitRate: 0,
                    ratio: 0,
                    dragCondition: (p) => {
                      var b, T, L;
                      return !((L = (T = (b = p.inputEvent) == null ? void 0 : b.target) == null ? void 0 : T.closest) != null && L.call(T, "textarea, input, select, button, [contenteditable]"));
                    },
                    onDragStart: ug,
                    onSelectEnd: dg
                  }
                ),
                /* @__PURE__ */ g.jsx(
                  "div",
                  {
                    className: "gl-layout-zoom",
                    style: { width: H.width * mt, height: H.height * mt },
                    children: /* @__PURE__ */ g.jsxs(
                      "section",
                      {
                        ref: (p) => {
                          At.current = p, tt(p);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": H.name,
                        onContextMenu: ng,
                        ...Jw(mt, io),
                        style: {
                          width: H.width,
                          height: H.height,
                          transform: `scale(${mt})`,
                          "--gl-hair": `${1 / mt}px`,
                          backgroundImage: `linear-gradient(#eef2f7 ${1 / mt}px, transparent ${1 / mt}px), linear-gradient(90deg, #eef2f7 ${1 / mt}px, transparent ${1 / mt}px)`
                        },
                        children: [
                          aa(H.page).map((p) => {
                            const b = ra(H.page), T = Yr(H.page.marginMm);
                            return /* @__PURE__ */ g.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: p.x, top: p.y, width: b.width, height: b.height }, children: T > 0 && /* @__PURE__ */ g.jsx("div", { className: "gl-layout-page-margin", style: { inset: T } }) }, `${p.row}-${p.column}`);
                          }),
                          Lt.items.length === 0 && /* @__PURE__ */ g.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ g.jsx("strong", { children: x("Blank layout") }),
                            /* @__PURE__ */ g.jsx("span", { children: x(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          Lt.items.map((p) => /* @__PURE__ */ g.jsx(
                            VS,
                            {
                              item: J1(p, Lt.items, An),
                              templateText: (() => {
                                const b = H.items.find((T) => T.id === p.templateId);
                                return (b == null ? void 0 : b.recipe.kind) === "text" ? b.recipe.text : void 0;
                              })(),
                              chartFiles: (() => {
                                const b = H.items.find((T) => T.id === p.templateId);
                                return (b == null ? void 0 : b.recipe.kind) === "proportions" ? b.recipe.settings.files : void 0;
                              })(),
                              selected: P.includes(p.id),
                              samples: Tt,
                              state: f,
                              globalScales: h,
                              dataRevision: E,
                              densityColorPower: D,
                              style: pn(H, p.recipe, I),
                              titleTemplate: ((b) => zs(b) ? Fs(b, An(p)) : b)(ts(Ul(p, p.templateSampleId) || Qi, p.unitId && Re.find((b) => b.id === p.unitId) || null, p.position.n, p.position.total)),
                              describe: wn,
                              checkedSampleIds: a,
                              metadataById: xe,
                              metadataLevels: l,
                              files: r,
                              sources: Ie.sources,
                              divisionProfiles: C,
                              imageService: k,
                              canvasScale: $e,
                              onTextChange: (b, T, L) => {
                                if (!b.trim()) {
                                  rr([p.templateId]);
                                  return;
                                }
                                kt(($) => {
                                  const X = $.items.find(
                                    (U) => U.id === p.templateId
                                  );
                                  (X == null ? void 0 : X.recipe.kind) === "text" && (X.recipe.text = b, L === !0 ? X.recipe.rich = !0 : L === !1 && delete X.recipe.rich, T > 0 && nS(X, T));
                                });
                              },
                              onTextFocus: () => {
                                (!P.includes(p.id) || P.length > 1) && R([p.id]);
                              },
                              textEditing: N === p.id,
                              onTextEditStart: () => {
                                R([p.id]), fe(p) || F(p.id);
                              },
                              onIsolate: p.group && P.includes(p.id) && P.length > 1 ? () => R([p.id]) : void 0,
                              onTextEditEnd: () => {
                                var b;
                                F((T) => T === p.id ? null : T), (b = rn.current) == null || b.focus({ preventScroll: !0 });
                              }
                            },
                            p.id
                          )),
                          !Et && /* @__PURE__ */ g.jsx(
                            Sb,
                            {
                              ref: ut,
                              target: on.length === 1 ? on[0] : on,
                              zoom: 1 / mt,
                              origin: !1,
                              checkInput: !0,
                              passDragArea: !0,
                              draggable: !0,
                              resizable: !0,
                              useMutationObserver: !0,
                              useResizeObserver: !0,
                              keepRatio: V.keepRatio !== Vt.shift && !Zt.some((p) => p.recipe.kind === "shape" && p.recipe.shape === "line"),
                              throttleDragRotate: Vt.shift ? 45 : 0,
                              snappable: !Vt.meta,
                              snapThreshold: 6,
                              isDisplaySnapDigit: !1,
                              isDisplayInnerSnapDigit: !1,
                              snapDirections: Pd,
                              elementSnapDirections: Pd,
                              elementGuidelines: ft,
                              verticalGuidelines: co.vertical,
                              horizontalGuidelines: co.horizontal,
                              snapGridWidth: q ? Yo : 0,
                              snapGridHeight: q ? Yo : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              individualGroupable: Nr,
                              container: Nr ? W : void 0,
                              onDragStart: cg,
                              onDrag: lc,
                              onDragEnd: (p) => {
                                const b = cc(p);
                                Aa(b, p.lastEvent, p.isDrag, () => Pa(b, !!p.datas.alt));
                              },
                              onDragGroupStart: (p) => {
                                var b;
                                p.datas.alt = !!((b = p.inputEvent) != null && b.altKey), Oa([...p.targets ?? []], p.datas.alt ? oc(p.targets ?? []) : void 0);
                              },
                              onDragGroup: (p) => p.events.forEach(lc),
                              onDragGroupEnd: (p) => Aa(p.targets, p.lastEvent, p.isDrag, () => Pa(p.targets, !!p.datas.alt)),
                              onResizeStart: (p) => {
                                var b;
                                Oa([p.target]), (b = p.inputEvent) != null && b.altKey && p.setFixedDirection([0, 0]);
                              },
                              onResize: uc,
                              onResizeEnd: (p) => Aa([p.target], p.lastEvent, p.isDrag, () => Pa([p.target], !1)),
                              onResizeGroupStart: (p) => {
                                var b;
                                Oa([...p.targets ?? []]), (b = p.inputEvent) != null && b.altKey && p.events.forEach((T) => T.setFixedDirection([0, 0]));
                              },
                              onResizeGroup: (p) => p.events.forEach(uc),
                              onResizeGroupEnd: (p) => Aa(p.targets, p.lastEvent, p.isDrag, () => Pa(p.targets, !1)),
                              onClick: (p) => {
                                var b, T;
                                if (Ea.current) {
                                  Ea.current = !1;
                                  return;
                                }
                                ((b = p.inputEvent) != null && b.shiftKey || Nr) && ((T = vt.current) == null || T.clickTarget(p.inputEvent, p.inputTarget));
                              },
                              onClickGroup: (p) => {
                                var b;
                                (b = vt.current) == null || b.clickTarget(p.inputEvent, p.inputTarget);
                              }
                            }
                          ),
                          !Et && Ta && /* @__PURE__ */ g.jsx(kw, { tool: Ta, zoom: mt, snap: Cw(q ? Yo : 0, co, Lt.items), onDraw: Qh, onCancel: () => _a(null) }),
                          !Et && H.guides && /* @__PURE__ */ g.jsx(Bw, { guides: H.guides, width: H.width, height: H.height, zoom: mt, scroller: J, onMove: (p, b) => kt((T) => Rw(T, p, b)), onRemove: (p) => kt((b) => Pw(b, p)) })
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
export {
  JS as LayoutTab,
  GS as isBakedTitle,
  YS as overlaidPlot
};
