import { a as rt, t as da, w as Jc, s as Qc, z as cs, x as fs, y as Ua, A as ds, B as tf, E as mi, G as en, H as ef, I as Ml, f as rf, J as nf, K as af, L as of, M as xi, N as ua, O as ps, P as kl, Q as sf, R as oe, j as C, T as Tr, U as cr, V as lf, u as Sn, W as uf, X as cf, Y as ff, Z as vs, _ as df, $ as Ee, a0 as pf, S as hs, a1 as Ka, a2 as vf, a3 as hf, a4 as gs, a5 as gf, a6 as Tl, a7 as mf, a8 as Hn, a9 as ms, aa as xf, ab as yf, ac as bf, ad as Sf, ae as Cf, af as Ef, ag as wf, ah as xs, ai as ys, aj as Df, ak as _f, al as Mf, am as bs, an as kf, ao as Tf, ap as If, aq as Ss, ar as Rf, as as Pf, l as Cs, at as Of, au as Nf, av as zf, aw as jf, ax as Af, ay as Es } from "./embed-BhzwMNnS.js";
function Zi(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return !0;
  return !1;
}
function Il(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return t[n];
  return null;
}
function Rl(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function Ji(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function Bf() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function Gf(t, e) {
  var r = Ji("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return r ? r[3] : "";
}
function yi(t) {
  return t.replace(/_/g, ".");
}
function nn(t, e) {
  var r = null, n = "-1";
  return Zi(t, function(a) {
    var i = Ji("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (r = a, n = i[3] || "-1", a.versionAlias ? n = a.versionAlias : a.versionTest && (n = Gf(a.versionTest.toLowerCase(), e) || n), n = yi(n), !0);
  }), {
    preset: r,
    version: n
  };
}
function $n(t, e) {
  var r = {
    brand: "",
    version: "-1"
  };
  return Zi(t, function(n) {
    var a = Pl(e, n);
    return a ? (r.brand = n.id, r.version = n.versionAlias || a.version, r.version !== "-1") : !1;
  }), r;
}
function Pl(t, e) {
  return Il(t, function(r) {
    var n = r.brand;
    return Ji("" + e.test, n.toLowerCase());
  });
}
var Ol = [{
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
}], Nl = [{
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
}], bi = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], zl = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], jl = [{
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
function Al(t) {
  return !!nn(zl, t).preset;
}
function Ff(t) {
  var e = Rl(t), r = !!/mobi/g.exec(e), n = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: Al(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = nn(Ol, e), o = i.preset, s = i.version, l = nn(jl, e), u = l.preset, c = l.version, f = nn(Nl, e);
  if (n.chromium = !!f.preset, n.chromiumVersion = f.version, !n.chromium) {
    var d = nn(bi, e);
    n.webkit = !!d.preset, n.webkitVersion = d.version;
  }
  return u && (a.name = u.id, a.version = c, a.majorVersion = parseInt(c, 10)), o && (n.name = o.id, n.version = s, n.webview && a.name === "ios" && n.name !== "safari" && (n.webview = !1)), n.majorVersion = parseInt(n.version, 10), {
    browser: n,
    os: a,
    isMobile: r,
    isHints: !1
  };
}
function Lf(t) {
  var e = navigator.userAgentData, r = (e.uaList || e.brands).slice(), n = e.mobile || !1, a = r[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!$n(zl, r).brand || Al(Rl())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && Zi(bi, function(d) {
    return Pl(r, d);
  });
  var l = $n(Nl, r);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var u = $n(bi, r);
    o.webkit = !!u.brand, o.webkitVersion = u.version || "-1";
  }
  var c = Il(jl, function(d) {
    return new RegExp("" + d.test, "g").exec(i);
  });
  s.name = c ? c.id : "";
  {
    var f = $n(Ol, r);
    o.name = f.brand || o.name, o.version = f.brand && t ? t.uaFullVersion : f.version;
  }
  return o.webkit && (s.name = n ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = yi(s.version), o.version = yi(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: n,
    isHints: !0
  };
}
function Wf(t) {
  return Bf() ? Lf() : Ff(t);
}
function Yf(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  return e.map(function(n) {
    return n.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function Xf(t, e) {
  return e.replace(/([^}{]*){/gm, function(r, n) {
    return n.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function nr(t, e) {
  return function(r) {
    r && (t[e] = r);
  };
}
function Bl(t, e, r) {
  return function(n) {
    n && (t[e][r] = n);
  };
}
function Hf(t, e) {
  return function(r) {
    var n = r.prototype;
    t.forEach(function(a) {
      e(n, a);
    });
  };
}
function Gl(t, e) {
  return e === void 0 && (e = {}), function(r, n) {
    t.forEach(function(a) {
      var i = e[a] || a;
      i in r || (r[i] = function() {
        for (var o, s = [], l = 0; l < arguments.length; l++)
          s[l] = arguments[l];
        var u = (o = this[n])[a].apply(o, s);
        return u === this[n] ? this : u;
      });
    });
  };
}
var $f = "function", qf = "object", Vf = "string", Uf = "number", Qi = "undefined", Fl = typeof window !== Qi, Kf = typeof document !== Qi && document, Zf = [{
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
}], Jt = 1e-7, qn = {
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
function Jf() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function pa(t, e, r, n) {
  return (t * n + e * r) / (r + n);
}
function to(t) {
  return typeof t === Qi;
}
function me(t) {
  return t && typeof t === qf;
}
function Yt(t) {
  return Array.isArray(t);
}
function _e(t) {
  return typeof t === Vf;
}
function gn(t) {
  return typeof t === Uf;
}
function ka(t) {
  return typeof t === $f;
}
function Qf(t, e) {
  var r = t === "" || t == " ", n = e === "" || e == " ";
  return n && r || t === e;
}
function Ll(t, e, r, n, a) {
  var i = eo(t, e, r);
  return i ? r : td(t, e, r + 1, n, a);
}
function eo(t, e, r) {
  if (!t.ignore)
    return null;
  var n = e.slice(Math.max(r - 3, 0), r + 3).join("");
  return new RegExp(t.ignore).exec(n);
}
function td(t, e, r, n, a) {
  for (var i = function(u) {
    var c = e[u].trim();
    if (c === t.close && !eo(t, e, u))
      return {
        value: u
      };
    var f = u, d = xe(a, function(p) {
      var h = p.open;
      return h === c;
    });
    if (d && (f = Ll(d, e, u, n, a)), f === -1)
      return o = u, "break";
    u = f, o = u;
  }, o, s = r; s < n; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function ro(t, e) {
  var r = _e(e) ? {
    separator: e
  } : e, n = r.separator, a = n === void 0 ? "," : n, i = r.isSeparateFirst, o = r.isSeparateOnlyOpenClose, s = r.isSeparateOpenClose, l = s === void 0 ? o : s, u = r.openCloseCharacters, c = u === void 0 ? Zf : u, f = c.map(function(M) {
    var g = M.open, T = M.close;
    return g === T ? g : g + "|" + T;
  }).join("|"), d = "(\\s*" + a + "\\s*|" + f + "|\\s+)", p = new RegExp(d, "g"), h = t.split(p).filter(function(M) {
    return M && M !== "undefined";
  }), m = h.length, x = [], y = [];
  function b() {
    return y.length ? (x.push(y.join("")), y = [], !0) : !1;
  }
  for (var E = function(M) {
    var g = h[M].trim(), T = M, k = xe(c, function(R) {
      var j = R.open;
      return j === g;
    }), z = xe(c, function(R) {
      var j = R.close;
      return j === g;
    });
    if (k) {
      if (T = Ll(k, h, M, m, c), T !== -1 && l)
        return b() && i || (x.push(h.slice(M, T + 1).join("")), M = T, i) ? (w = M, "break") : (w = M, "continue");
    } else if (z && !eo(z, h, M)) {
      var O = Jf(c);
      return O.splice(c.indexOf(z), 1), {
        value: ro(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: O
        })
      };
    } else if (Qf(g, a) && !o)
      return b(), i ? (w = M, "break") : (w = M, "continue");
    T === -1 && (T = m - 1), y.push(h.slice(M, T + 1).join("")), M = T, w = M;
  }, w, _ = 0; _ < m; ++_) {
    var D = E(_);
    if (_ = w, typeof D == "object") return D.value;
    if (D === "break") break;
  }
  return y.length && x.push(y.join("")), x;
}
function ar(t) {
  return ro(t, "");
}
function hr(t) {
  return ro(t, ",");
}
function Wl(t) {
  var e = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(t);
  return !e || e.length < 4 ? {} : {
    prefix: e[1],
    value: e[2],
    suffix: e[3]
  };
}
function gr(t) {
  var e = /^([^\d|e|\-|\+]*)((?:\d|\.|-|e-|e\+)+)(\S*)$/g.exec(t);
  if (!e)
    return {
      prefix: "",
      unit: "",
      value: NaN
    };
  var r = e[1], n = e[2], a = e[3];
  return {
    prefix: r,
    unit: a,
    value: parseFloat(n)
  };
}
function Si(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, r) {
    return r.toUpperCase();
  });
}
function ed(t, e) {
  return t.replace(/([a-z])([A-Z])/g, function(r, n, a) {
    return "" + n + e + a.toLowerCase();
  });
}
function mn() {
  return Date.now ? Date.now() : (/* @__PURE__ */ new Date()).getTime();
}
function Ve(t, e, r) {
  r === void 0 && (r = -1);
  for (var n = t.length, a = 0; a < n; ++a)
    if (e(t[a], a, t))
      return a;
  return r;
}
function xe(t, e, r) {
  var n = Ve(t, e);
  return n > -1 ? t[n] : r;
}
var Yl = /* @__PURE__ */ (function() {
  var t = mn(), e = Fl && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(r) {
    var n = mn(), a = setTimeout(function() {
      r(n - t);
    }, 1e3 / 60);
    return a;
  };
})(), rd = /* @__PURE__ */ (function() {
  var t = Fl && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function $r(t) {
  return Object.keys(t);
}
function Ot(t, e) {
  var r = gr(t), n = r.value, a = r.unit;
  if (me(e)) {
    var i = e[a];
    if (i) {
      if (ka(i))
        return i(n);
      if (qn[a])
        return qn[a](n, i);
    }
  } else if (a === "%")
    return n * e / 100;
  return qn[a] ? qn[a](n) : n;
}
function va(t, e, r) {
  return Math.max(e, Math.min(t, r));
}
function ws(t, e, r, n) {
  return n === void 0 && (n = t[0] / t[1]), [[xt(e[0], Jt), xt(e[0] / n, Jt)], [xt(e[1] * n, Jt), xt(e[1], Jt)]].filter(function(a) {
    return a.every(function(i, o) {
      var s = e[o], l = xt(s, Jt);
      return r ? i <= s || i <= l : i >= s || i >= l;
    });
  })[0] || t;
}
function no(t, e, r, n) {
  if (!n)
    return t.map(function(p, h) {
      return va(p, e[h], r[h]);
    });
  var a = t[0], i = t[1], o = n === !0 ? a / i : n, s = ws(t, e, !1, o), l = s[0], u = s[1], c = ws(t, r, !0, o), f = c[0], d = c[1];
  return a < l || i < u ? (a = l, i = u) : (a > f || i > d) && (a = f, i = d), [a, i];
}
function nd(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return r;
}
function Ci(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return e ? r / e : 0;
}
function Xt(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function ad(t) {
  return [0, 1].map(function(e) {
    return Ci(t.map(function(r) {
      return r[e];
    }));
  });
}
function Ds(t) {
  var e = ad(t), r = Xt(e, t[0]), n = Xt(e, t[1]);
  return r < n && n - r < Math.PI || r > n && n - r < -Math.PI ? 1 : -1;
}
function Ge(t, e) {
  return Math.sqrt(Math.pow((e ? e[0] : 0) - t[0], 2) + Math.pow((e ? e[1] : 0) - t[1], 2));
}
function xt(t, e) {
  if (!e)
    return t;
  var r = 1 / e;
  return Math.round(t / e) / r;
}
function _s(t, e) {
  return t.forEach(function(r, n) {
    t[n] = xt(t[n], e);
  }), t;
}
function id(t) {
  for (var e = [], r = 0; r < t; ++r)
    e.push(r);
  return e;
}
function od(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function Qt(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function ao(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function Xl(t, e) {
  if (t.classList)
    t.classList.remove(e);
  else {
    var r = new RegExp("(\\s|^)" + e + "(\\s|$)");
    t.className = t.className.replace(r, " ");
  }
}
function Zt(t, e, r, n) {
  t.addEventListener(e, r, n);
}
function Wt(t, e, r, n) {
  t.removeEventListener(e, r, n);
}
function Re(t) {
  return (t == null ? void 0 : t.ownerDocument) || Kf;
}
function io(t) {
  return Re(t).documentElement;
}
function sr(t) {
  return Re(t).body;
}
function we(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function Hl(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function xn(t) {
  return me(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function sd(t, e, r, n, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = r + o * a, l = n + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function ld(t, e, r, n, a) {
  for (var i = 0; i < a; ++i) {
    var o = r + i * a, s = n + i * a, l = t[o], u = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = u;
  }
}
function ud(t, e, r, n, a) {
  for (var i = 0; i < n; ++i) {
    var o = r + i * n;
    t[o] /= a, e[o] /= a;
  }
}
function $l(t, e, r) {
  for (var n = t.slice(), a = 0; a < r; ++a)
    n[a * r + e - 1] = 0, n[(e - 1) * r + a] = 0;
  return n[(e - 1) * (r + 1)] = 1, n;
}
function Oe(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = t.slice(), n = zt(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!xt(r[i], Jt)) {
      for (var o = a + 1; o < e; ++o)
        if (r[e * a + o]) {
          ld(r, n, a, o, e);
          break;
        }
    }
    if (!xt(r[i], Jt))
      return [];
    ud(r, n, a, e, r[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, u = r[l];
      !xt(u, Jt) || a === o || sd(r, n, s, a, e, -u);
    }
  }
  return n;
}
function cd(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = 0; n < e; ++n)
    for (var a = 0; a < e; ++a)
      r[a * e + n] = t[e * n + a];
  return r;
}
function ql(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = t[e * e - 1], a = 0; a < e - 1; ++a)
    r[a] = t[e * (e - 1) + a] / n;
  return r[e - 1] = 0, r;
}
function fd(t, e) {
  for (var r = zt(e), n = 0; n < e - 1; ++n)
    r[e * (e - 1) + n] = t[n] || 0;
  return r;
}
function mr(t, e) {
  for (var r = t.slice(), n = t.length; n < e - 1; ++n)
    r[n] = 0;
  return r[e - 1] = 1, r;
}
function Ne(t, e, r) {
  if (e === void 0 && (e = Math.sqrt(t.length)), e === r)
    return t;
  for (var n = zt(r), a = Math.min(e, r), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      n[i * r + o] = t[i * e + o];
    n[(i + 1) * r - 1] = t[(i + 1) * e - 1], n[(r - 1) * r + i] = t[(e - 1) * e + i];
  }
  return n[r * r - 1] = t[e * e - 1], n;
}
function ha(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  var n = zt(t);
  return e.forEach(function(a) {
    n = Nt(n, a, t);
  }), n;
}
function Nt(t, e, r) {
  r === void 0 && (r = Math.sqrt(t.length));
  var n = [], a = t.length / r, i = e.length / a;
  if (a) {
    if (!i)
      return t;
  } else return e;
  for (var o = 0; o < r; ++o)
    for (var s = 0; s < i; ++s) {
      n[s * r + o] = 0;
      for (var l = 0; l < a; ++l)
        n[s * r + o] += t[l * r + o] * e[s * a + l];
    }
  return n;
}
function Tt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] + e[a];
  return n;
}
function vt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] - e[a];
  return n;
}
function dd(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function Vl(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function se(t, e, r) {
  r === void 0 && (r = e.length);
  var n = Nt(t, e, r), a = n[r - 1];
  return n.map(function(i) {
    return i / a;
  });
}
function pd(t, e) {
  return Nt(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function vd(t, e) {
  return Nt(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function hd(t, e) {
  return Nt(t, En(e, 4));
}
function Vn(t, e) {
  var r = e[0], n = r === void 0 ? 1 : r, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return Nt(t, [n, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function Cn(t, e) {
  return se(En(e, 3), mr(t, 3));
}
function Za(t, e) {
  var r = e[0], n = r === void 0 ? 0 : r, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return Nt(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, n, i, s, 1], 4);
}
function Ei(t, e) {
  return Nt(t, e, 4);
}
function En(t, e) {
  var r = Math.cos(t), n = Math.sin(t), a = zt(e);
  return a[0] = r, a[1] = n, a[e] = -n, a[e + 1] = r, a;
}
function zt(t) {
  for (var e = t * t, r = [], n = 0; n < e; ++n)
    r[n] = n % (t + 1) ? 0 : 1;
  return r;
}
function oo(t, e) {
  for (var r = zt(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[(e + 1) * a] = t[a];
  return r;
}
function xr(t, e) {
  for (var r = zt(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[e * (e - 1) + a] = t[a];
  return r;
}
function so(t, e, r, n, a, i, o, s) {
  var l = t[0], u = t[1], c = e[0], f = e[1], d = r[0], p = r[1], h = n[0], m = n[1], x = a[0], y = a[1], b = i[0], E = i[1], w = o[0], _ = o[1], D = s[0], M = s[1], g = [l, 0, c, 0, d, 0, h, 0, u, 0, f, 0, p, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, c, 0, d, 0, h, 0, u, 0, f, 0, p, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, -x * l, -y * l, -b * c, -E * c, -w * d, -_ * d, -D * h, -M * h, -x * u, -y * u, -b * f, -E * f, -w * p, -_ * p, -D * m, -M * m], T = Oe(g, 8);
  if (!T.length)
    return [];
  var k = Nt(T, [x, y, b, E, w, _, D, M], 8);
  return k[8] = 1, Ne(cd(k), 3, 4);
}
var sn = function() {
  return sn = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, sn.apply(this, arguments);
};
function lo() {
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
function Gr(t, e) {
  return e === void 0 && (e = 0), Ir(Fr(t, e));
}
function ca(t, e) {
  var r = se(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), n = r[3] || 1;
  return [
    r[0] / n,
    r[1] / n,
    r[2] / n
  ];
}
function gd(t, e) {
  e === void 0 && (e = document.body);
  for (var r = t, n = lo(); r; ) {
    var a = getComputedStyle(r).transform;
    if (n = Ei(Gr(a), n), r === e)
      break;
    r = r.parentElement;
  }
  return n = Oe(n, 4), n[12] = 0, n[13] = 0, n[14] = 0, n;
}
function Ir(t) {
  var e = lo();
  return t.forEach(function(r) {
    var n = r.matrixFunction, a = r.functionValue;
    n && (e = n(e, a));
  }), e;
}
function Fr(t, e) {
  e === void 0 && (e = 0);
  var r = Yt(t) ? t : ar(t);
  return r.map(function(n) {
    var a = Wl(n), i = a.prefix, o = a.value, s = null, l = i, u = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var c = me(e) ? sn(sn({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, f = hr(o).map(function(R, j) {
        return j === 0 && "x%" in c ? c["%"] = e["x%"] : j === 1 && "y%" in c ? c["%"] = e["y%"] : c["%"] = e["o%"], Ot(R, c);
      }), d = f[0], p = f[1], h = p === void 0 ? 0 : p, m = f[2], x = m === void 0 ? 0 : m;
      s = Za, u = [d, h, x];
    } else if (i === "translateY") {
      var y = me(e) ? sn({ "%": e["y%"] }, e) : {
        "%": e
      }, h = Ot(o, y);
      s = Za, u = [0, h, 0];
    } else if (i === "translateZ") {
      var x = parseFloat(o);
      s = Za, u = [0, 0, x];
    } else if (i === "scale" || i === "scale3d") {
      var b = hr(o).map(function(R) {
        return parseFloat(R);
      }), E = b[0], w = b[1], _ = w === void 0 ? E : w, D = b[2], M = D === void 0 ? 1 : D;
      s = Vn, u = [E, _, M];
    } else if (i === "scaleX") {
      var E = parseFloat(o);
      s = Vn, u = [E, 1, 1];
    } else if (i === "scaleY") {
      var _ = parseFloat(o);
      s = Vn, u = [1, _, 1];
    } else if (i === "scaleZ") {
      var M = parseFloat(o);
      s = Vn, u = [1, 1, M];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var g = gr(o), T = g.unit, k = g.value, z = T === "rad" ? k : k * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = hd) : i === "rotateX" ? s = pd : i === "rotateY" && (s = vd), u = z;
    } else if (i === "matrix3d")
      s = Ei, u = hr(o).map(function(R) {
        return parseFloat(R);
      });
    else if (i === "matrix") {
      var O = hr(o).map(function(R) {
        return parseFloat(R);
      });
      s = Ei, u = [
        O[0],
        O[1],
        0,
        0,
        O[2],
        O[3],
        0,
        0,
        0,
        0,
        1,
        0,
        O[4],
        O[5],
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
      functionValue: u
    };
  });
}
var md = /* @__PURE__ */ (function() {
  function t() {
    this.keys = [], this.values = [];
  }
  var e = t.prototype;
  return e.get = function(r) {
    return this.values[this.keys.indexOf(r)];
  }, e.set = function(r, n) {
    var a = this.keys, i = this.values, o = a.indexOf(r), s = o === -1 ? a.length : o;
    a[s] = r, i[s] = n;
  }, t;
})(), xd = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(r) {
    return this.object[r];
  }, e.set = function(r, n) {
    this.object[r] = n;
  }, t;
})(), yd = typeof Map == "function", bd = /* @__PURE__ */ (function() {
  function t() {
  }
  var e = t.prototype;
  return e.connect = function(r, n) {
    this.prev = r, this.next = n, r && (r.next = this), n && (n.prev = this);
  }, e.disconnect = function() {
    var r = this.prev, n = this.next;
    r && (r.next = n), n && (n.prev = r);
  }, e.getIndex = function() {
    for (var r = this, n = -1; r; )
      r = r.prev, ++n;
    return n;
  }, t;
})();
function Sd(t, e) {
  var r = [], n = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new bd();
    r[i] = s, n[o] = s;
  }), r.forEach(function(a, i) {
    a.connect(r[i - 1]);
  }), t.filter(function(a, i) {
    return !e[i];
  }).map(function(a, i) {
    var o = a[0], s = a[1];
    if (o === s)
      return [0, 0];
    var l = r[o], u = n[s - 1], c = l.getIndex();
    l.disconnect(), u ? l.connect(u, u.next) : l.connect(void 0, r[0]);
    var f = l.getIndex();
    return [c, f];
  });
}
var Cd = /* @__PURE__ */ (function() {
  function t(r, n, a, i, o, s, l, u) {
    this.prevList = r, this.list = n, this.added = a, this.removed = i, this.changed = o, this.maintained = s, this.changedBeforeAdded = l, this.fixed = u;
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
    var r = Sd(this.changedBeforeAdded, this.fixed), n = this.changed, a = [];
    this.cacheOrdered = r.filter(function(i, o) {
      var s = i[0], l = i[1], u = n[o], c = u[0], f = u[1];
      if (s !== l)
        return a.push([c, f]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function uo(t, e, r) {
  var n = yd ? Map : r ? xd : md, a = r || function(b) {
    return b;
  }, i = [], o = [], s = [], l = t.map(a), u = e.map(a), c = new n(), f = new n(), d = [], p = [], h = {}, m = [], x = 0, y = 0;
  return l.forEach(function(b, E) {
    c.set(b, E);
  }), u.forEach(function(b, E) {
    f.set(b, E);
  }), l.forEach(function(b, E) {
    var w = f.get(b);
    typeof w > "u" ? (++y, o.push(E)) : h[w] = y;
  }), u.forEach(function(b, E) {
    var w = c.get(b);
    typeof w > "u" ? (i.push(E), ++x) : (s.push([w, E]), y = h[E] || 0, d.push([w - y, E - x]), p.push(E === w), w !== E && m.push([w, E]));
  }), o.reverse(), new Cd(t, e, i, o, m, s, d, p);
}
var Ed = /* @__PURE__ */ (function() {
  function t(r, n) {
    r === void 0 && (r = []), this.findKeyCallback = n, this.list = [].slice.call(r);
  }
  var e = t.prototype;
  return e.update = function(r) {
    var n = [].slice.call(r), a = uo(this.list, n, this.findKeyCallback);
    return this.list = n, a;
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
var wi = function(t, e) {
  return wi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, wi(t, e);
};
function wd(t, e) {
  wi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Ul = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), Kl = /* @__PURE__ */ (function(t) {
  wd(e, t);
  function e(r) {
    return r === void 0 && (r = []), t.call(this, r, Ul) || this;
  }
  return e;
})(Ed);
function Rr(t, e) {
  return uo(t, e, Ul);
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
var Di = function() {
  return Di = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Di.apply(this, arguments);
};
function Dd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
var wn = /* @__PURE__ */ (function() {
  function t() {
    this._events = {};
  }
  var e = t.prototype;
  return e.on = function(r, n) {
    if (me(r))
      for (var a in r)
        this.on(a, r[a]);
    else
      this._addEvent(r, n, {});
    return this;
  }, e.off = function(r, n) {
    if (!r)
      this._events = {};
    else if (me(r))
      for (var a in r)
        this.off(a);
    else if (!n)
      this._events[r] = [];
    else {
      var i = this._events[r];
      if (i) {
        var o = Ve(i, function(s) {
          return s.listener === n;
        });
        o > -1 && i.splice(o, 1);
      }
    }
    return this;
  }, e.once = function(r, n) {
    var a = this;
    return n && this._addEvent(r, n, {
      once: !0
    }), new Promise(function(i) {
      a._addEvent(r, i, {
        once: !0
      });
    });
  }, e.emit = function(r, n) {
    var a = this;
    n === void 0 && (n = {});
    var i = this._events[r];
    if (!r || !i)
      return !0;
    var o = !1;
    return n.eventType = r, n.stop = function() {
      o = !0;
    }, n.currentTarget = this, Dd(i).forEach(function(s) {
      s.listener(n), s.once && a.off(r, s.listener);
    }), !o;
  }, e.trigger = function(r, n) {
    return n === void 0 && (n = {}), this.emit(r, n);
  }, e._addEvent = function(r, n, a) {
    var i = this._events;
    i[r] = i[r] || [];
    var o = i[r];
    o.push(Di({
      listener: n
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
var _i = function(t, e) {
  return _i = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, _i(t, e);
};
function _d(t, e) {
  _i(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Pr = function() {
  return Pr = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Pr.apply(this, arguments);
};
function Md(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function Ms(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function Un(t) {
  if (t) {
    if (_e(t))
      return document.querySelector(t);
  } else return null;
  if (ka(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var Zl = /* @__PURE__ */ (function(t) {
  _d(e, t);
  function e() {
    var n = t !== null && t.apply(this, arguments) || this;
    return n._startRect = null, n._startPos = [], n._prevTime = 0, n._timer = 0, n._prevScrollPos = [0, 0], n._isWait = !1, n._flag = !1, n._currentOptions = null, n._lock = !1, n._unregister = null, n._onScroll = function() {
      var a = n._currentOptions;
      n._lock || !a || n.emit("scrollDrag", {
        next: function(i) {
          n.checkScroll({
            container: a.container,
            inputEvent: i
          });
        }
      });
    }, n;
  }
  var r = e.prototype;
  return r.dragStart = function(n, a) {
    var i = Un(a.container);
    if (!i) {
      this._flag = !1;
      return;
    }
    var o = 0, s = 0, l = 0, u = 0;
    if (i === document.body)
      l = window.innerWidth, u = window.innerHeight;
    else {
      var c = i.getBoundingClientRect();
      o = c.top, s = c.left, l = c.width, u = c.height;
    }
    this._flag = !0, this._startPos = [n.clientX, n.clientY], this._startRect = {
      top: o,
      left: s,
      width: l,
      height: u
    }, this._prevScrollPos = this._getScrollPosition([0, 0], a), this._currentOptions = a, this._registerScrollEvent(a);
  }, r.drag = function(n, a) {
    if (clearTimeout(this._timer), !!this._flag) {
      var i = n.clientX, o = n.clientY, s = a.threshold, l = s === void 0 ? 0 : s, u = this, c = u._startRect, f = u._startPos;
      this._currentOptions = a;
      var d = [0, 0];
      return c.top > o - l ? (f[1] > c.top || o < f[1]) && (d[1] = -1) : c.top + c.height < o + l && (f[1] < c.top + c.height || o > f[1]) && (d[1] = 1), c.left > i - l ? (f[0] > c.left || i < f[0]) && (d[0] = -1) : c.left + c.width < i + l && (f[0] < c.left + c.width || i > f[0]) && (d[0] = 1), !d[0] && !d[1] ? !1 : this._continueDrag(Pr(Pr({}, a), {
        direction: d,
        inputEvent: n,
        isDrag: !0
      }));
    }
  }, r.checkScroll = function(n) {
    var a = this;
    if (this._isWait)
      return !1;
    var i = n.prevScrollPos, o = i === void 0 ? this._prevScrollPos : i, s = n.direction, l = n.throttleTime, u = l === void 0 ? 0 : l, c = n.inputEvent, f = n.isDrag, d = this._getScrollPosition(s || [0, 0], n), p = d[0] - o[0], h = d[1] - o[1], m = s || [p ? Math.abs(p) / p : 0, h ? Math.abs(h) / h : 0];
    return this._prevScrollPos = d, this._lock = !1, !p && !h ? !1 : (this.emit("move", {
      offsetX: m[0] ? p : 0,
      offsetY: m[1] ? h : 0,
      inputEvent: c
    }), u && f && (clearTimeout(this._timer), this._timer = window.setTimeout(function() {
      a._continueDrag(n);
    }, u)), !0);
  }, r.dragEnd = function() {
    this._flag = !1, this._lock = !1, clearTimeout(this._timer), this._unregisterScrollEvent();
  }, r._getScrollPosition = function(n, a) {
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? Md : o;
    return s({
      container: Un(i),
      direction: n
    });
  }, r._continueDrag = function(n) {
    var a = this, i, o = n.container, s = n.direction, l = n.throttleTime, u = n.useScroll, c = n.isDrag, f = n.inputEvent;
    if (!(!this._flag || c && this._isWait)) {
      var d = mn(), p = Math.max(l + this._prevTime - d, 0);
      if (p > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(n);
        }, p), !1;
      this._prevTime = d;
      var h = this._getScrollPosition(s, n);
      this._prevScrollPos = h, c && (this._isWait = !0), u || (this._lock = !0);
      var m = {
        container: Un(o),
        direction: s,
        inputEvent: f
      };
      return (i = n.requestScroll) === null || i === void 0 || i.call(n, m), this.emit("scroll", m), this._isWait = !1, u || this.checkScroll(Pr(Pr({}, n), {
        prevScrollPos: h,
        direction: s,
        inputEvent: f
      }));
    }
  }, r._registerScrollEvent = function(n) {
    this._unregisterScrollEvent();
    var a = n.checkScrollEvent;
    if (a) {
      var i = a === !0 ? Ms : a, o = Un(n.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = Ms(window, this._onScroll) : this._unregister = i(o, this._onScroll);
    }
  }, r._unregisterScrollEvent = function() {
    var n;
    (n = this._unregister) === null || n === void 0 || n.call(this), this._unregister = null;
  }, e;
})(wn);
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
function kd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function pe(t) {
  return xt(t, Jt);
}
function Td(t, e) {
  return t.every(function(r, n) {
    return pe(r - e[n]) === 0;
  });
}
function Id(t, e) {
  return !pe(t[0] - e[0]) && !pe(t[1] - e[1]);
}
function ln(t) {
  return t.length < 3 ? 0 : Math.abs(nd(t.map(function(e, r) {
    var n = t[r + 1] || t[0];
    return e[0] * n[1] - n[0] * e[1];
  }))) / 2;
}
function Mi(t, e) {
  var r = e.width, n = e.height, a = e.left, i = e.top, o = yr(t), s = o.minX, l = o.minY, u = o.maxX, c = o.maxY, f = r / (u - s), d = n / (c - l);
  return t.map(function(p) {
    return [a + (p[0] - s) * f, i + (p[1] - l) * d];
  });
}
function yr(t) {
  var e = t.map(function(n) {
    return n[0];
  }), r = t.map(function(n) {
    return n[1];
  });
  return {
    minX: Math.min.apply(Math, e),
    minY: Math.min.apply(Math, r),
    maxX: Math.max.apply(Math, e),
    maxY: Math.max.apply(Math, r)
  };
}
function ga(t, e, r) {
  var n = t[0], a = t[1], i = yr(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], u = ma(l[0], l[1]), c = ki(e), f = [];
  if (c.forEach(function(h) {
    var m = ma(h[0], h[1]), x = h[0];
    if (Td(u, m))
      f.push({
        pos: t,
        line: h,
        type: "line"
      });
    else {
      var y = Jl(co(u, m), [l, h]);
      y.forEach(function(b) {
        h.some(function(E) {
          return Id(E, b);
        }) ? f.push({
          pos: b,
          line: h,
          type: "point"
        }) : pe(x[1] - a) !== 0 && f.push({
          pos: b,
          line: h,
          type: "intersection"
        });
      });
    }
  }), xe(f, function(h) {
    return h[0] === n;
  }))
    return !0;
  var d = 0, p = {};
  return f.forEach(function(h) {
    var m = h.pos, x = h.type, y = h.line;
    if (!(m[0] > n))
      if (x === "intersection")
        ++d;
      else {
        if (x === "line")
          return;
        if (x === "point") {
          var b = xe(y, function(_) {
            return _[1] !== a;
          }), E = p[m[0]], w = b[1] > a ? 1 : -1;
          E ? E !== w && ++d : p[m[0]] = w;
        }
      }
  }), d % 2 === 1;
}
function ma(t, e) {
  var r = t[0], n = t[1], a = e[0], i = e[1], o = a - r, s = i - n;
  Math.abs(o) < Jt && (o = 0), Math.abs(s) < Jt && (s = 0);
  var l = 0, u = 0, c = 0;
  return o ? s ? (l = -s / o, u = 1, c = -l * r - n) : (u = 1, c = -n) : s && (l = -1, c = r), [l, u, c];
}
function co(t, e) {
  var r = t[0], n = t[1], a = t[2], i = e[0], o = e[1], s = e[2], l = r === 0 && i === 0, u = n === 0 && o === 0, c = [];
  if (l && u)
    return [];
  if (l) {
    var f = -a / n, d = -s / o;
    return f !== d ? [] : [[-1 / 0, f], [1 / 0, f]];
  } else if (u) {
    var p = -a / r, h = -s / i;
    return p !== h ? [] : [[p, -1 / 0], [p, 1 / 0]];
  } else if (r === 0) {
    var m = -a / n, x = -(o * m + s) / i;
    c = [[x, m]];
  } else if (i === 0) {
    var m = -s / o, x = -(n * m + a) / r;
    c = [[x, m]];
  } else if (n === 0) {
    var x = -a / r, m = -(i * x + s) / o;
    c = [[x, m]];
  } else if (o === 0) {
    var x = -s / i, m = -(r * x + a) / n;
    c = [[x, m]];
  } else {
    var x = (n * s - o * a) / (o * r - n * i), m = -(r * x + a) / n;
    c = [[x, m]];
  }
  return c.map(function(y) {
    return [y[0], y[1]];
  });
}
function Jl(t, e) {
  var r = e.map(function(f) {
    return [0, 1].map(function(d) {
      return [Math.min(f[0][d], f[1][d]), Math.max(f[0][d], f[1][d])];
    });
  }), n = [];
  if (t.length === 2) {
    var a = t[0], i = a[0], o = a[1];
    if (pe(i - t[1][0])) {
      if (!pe(o - t[1][1])) {
        var u = Math.max.apply(Math, r.map(function(f) {
          return f[0][0];
        })), c = Math.min.apply(Math, r.map(function(f) {
          return f[0][1];
        }));
        if (pe(u - c) > 0)
          return [];
        n = [[u, o], [c, o]];
      }
    } else {
      var s = Math.max.apply(Math, r.map(function(f) {
        return f[1][0];
      })), l = Math.min.apply(Math, r.map(function(f) {
        return f[1][1];
      }));
      if (pe(s - l) > 0)
        return [];
      n = [[i, s], [i, l]];
    }
  }
  return n.length || (n = t.filter(function(f) {
    var d = f[0], p = f[1];
    return r.every(function(h) {
      return 0 <= pe(d - h[0][0]) && 0 <= pe(h[0][1] - d) && 0 <= pe(p - h[1][0]) && 0 <= pe(h[1][1] - p);
    });
  })), n.map(function(f) {
    return [pe(f[0]), pe(f[1])];
  });
}
function ki(t) {
  return kd(t.slice(1), [t[0]]).map(function(e, r) {
    return [t[r], e];
  });
}
function Rd(t, e) {
  var r = t.slice(), n = e.slice();
  Ds(r) === -1 && r.reverse(), Ds(n) === -1 && n.reverse();
  var a = ki(r), i = ki(n), o = a.map(function(c) {
    return ma(c[0], c[1]);
  }), s = i.map(function(c) {
    return ma(c[0], c[1]);
  }), l = [];
  o.forEach(function(c, f) {
    var d = a[f], p = [];
    s.forEach(function(h, m) {
      var x = co(c, h), y = Jl(x, [d, i[m]]);
      p.push.apply(p, y.map(function(b) {
        return {
          index1: f,
          index2: m,
          pos: b,
          type: "intersection"
        };
      }));
    }), p.sort(function(h, m) {
      return Ge(d[0], h.pos) - Ge(d[0], m.pos);
    }), l.push.apply(l, p), ga(d[1], n) && l.push({
      index1: f,
      index2: -1,
      pos: d[1],
      type: "inside"
    });
  }), i.forEach(function(c, f) {
    if (ga(c[1], r)) {
      var d = !1, p = Ve(l, function(h) {
        var m = h.index2;
        return m === f ? (d = !0, !1) : !!d;
      });
      p === -1 && (d = !1, p = Ve(l, function(h) {
        var m = h.index1, x = h.index2;
        return m === -1 && x + 1 === f ? (d = !0, !1) : !!d;
      })), p === -1 ? l.push({
        index1: -1,
        index2: f,
        pos: c[1],
        type: "inside"
      }) : l.splice(p, 0, {
        index1: -1,
        index2: f,
        pos: c[1],
        type: "inside"
      });
    }
  });
  var u = {};
  return l.filter(function(c) {
    var f = c.pos, d = f[0] + "x" + f[1];
    return u[d] ? !1 : (u[d] = !0, !0);
  });
}
function Ti(t, e) {
  var r = Rd(t, e);
  return r.map(function(n) {
    var a = n.pos;
    return a;
  });
}
function Pd(t, e) {
  var r = Ti(t, e);
  return ln(r);
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
var Ii = function(t, e) {
  return Ii = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Ii(t, e);
};
function Od(t, e) {
  Ii(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Ut = function() {
  return Ut = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ut.apply(this, arguments);
};
function Nd(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function Ja(t) {
  return Nd([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function zd(t) {
  return t.touches && t.touches.length >= 2;
}
function Kn(t) {
  return t ? t.touches ? Ad(t.touches) : [Ql(t)] : [];
}
function jd(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function ks(t, e, r) {
  var n = r.length, a = un(t, n), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, u = un(e, n), c = u.clientX, f = u.clientY, d = un(r, n), p = d.clientX, h = d.clientY, m = i - c, x = o - f, y = i - p, b = o - h;
  return {
    clientX: s,
    clientY: l,
    deltaX: m,
    deltaY: x,
    distX: y,
    distY: b
  };
}
function Qa(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function Ad(t) {
  for (var e = Math.min(t.length, 2), r = [], n = 0; n < e; ++n)
    r.push(Ql(t[n]));
  return r;
}
function Ql(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY
  };
}
function un(t, e) {
  e === void 0 && (e = t.length);
  for (var r = {
    clientX: 0,
    clientY: 0,
    originalClientX: 0,
    originalClientY: 0
  }, n = Math.min(t.length, e), a = 0; a < n; ++a) {
    var i = t[a];
    r.originalClientX += "originalClientX" in i ? i.originalClientX : i.clientX, r.originalClientY += "originalClientY" in i ? i.originalClientY : i.clientY, r.clientX += i.clientX, r.clientY += i.clientY;
  }
  return e ? {
    clientX: r.clientX / e,
    clientY: r.clientY / e,
    originalClientX: r.originalClientX / e,
    originalClientY: r.originalClientY / e
  } : r;
}
var ti = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), Ja(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), Ja(e) - Ja(this.startClients);
  }, t.prototype.getPosition = function(e, r) {
    e === void 0 && (e = this.prevClients);
    var n = ks(e || this.prevClients, this.prevClients, this.startClients), a = n.deltaX, i = n.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, n;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var r = this.prevClients, n = this.startClients, a = Math.min(this.length, r.length), i = [], o = 0; o < a; ++o)
      i[o] = ks([e[o]], [r[o]], [n[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var r = this.movement;
    if (!e)
      return r;
    var n = un(e, this.length), a = un(this.prevClients, this.length), i = n.clientX - a.clientX, o = n.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + r;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), Qa(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), Qa(e) / Qa(this.startClients);
  }, t.prototype.move = function(e, r) {
    this.startClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    }), this.prevClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    });
  }, t;
})(), Ts = ["textarea", "input"], tu = /* @__PURE__ */ (function(t) {
  Od(e, t);
  function e(r, n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(d, p) {
      if (p === void 0 && (p = !0), !(!a.flag && d.cancelable === !1)) {
        var h = d.type.indexOf("drag") >= -1;
        if (!(a.flag && h)) {
          a._isDragAPI = !0;
          var m = a.options, x = m.container, y = m.pinchOutside, b = m.preventWheelClick, E = m.preventRightClick, w = m.preventDefault, _ = m.checkInput, D = m.dragFocusedInput, M = m.preventClickEventOnDragStart, g = m.preventClickEventOnDrag, T = m.preventClickEventByCondition, k = a._useTouch, z = !a.flag;
          if (a._isSecondaryButton = d.which === 3 || d.button === 2, b && (d.which === 2 || d.button === 1) || E && (d.which === 3 || d.button === 2))
            return a.stop(), !1;
          if (z) {
            var O = a._window.document.activeElement, R = d.target;
            if (R) {
              var j = R.tagName.toLowerCase(), A = Ts.indexOf(j) > -1, W = R.isContentEditable;
              if (A || W) {
                if (_ || !D && O === R)
                  return !1;
                if (O && (O === R || W && O.isContentEditable && O.contains(R)))
                  if (D)
                    R.blur();
                  else
                    return !1;
              } else if ((w || d.type === "touchstart") && O) {
                var X = O.tagName.toLowerCase();
                (O.isContentEditable || Ts.indexOf(X) > -1) && O.blur();
              }
              (M || g || T) && Zt(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new ti(Kn(d))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = p, a._dragFlag = !0, a._prevInputEvent = d, a.data = {}, a.doubleFlag = mn() - a.prevTime < 200, a._isMouseEvent = jd(d), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var L = a._preventMouseEvent || a.emit("dragStart", Ut(Ut({ data: a.data, datas: a.data, inputEvent: d, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: p, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
              d.preventDefault();
            }, preventDrag: function() {
              a._dragFlag = !1;
            } }));
            L === !1 && a.stop(), a._isMouseEvent && a.flag && w && d.preventDefault();
          }
          if (!a.flag)
            return !1;
          var q = 0;
          if (z ? (a._attchDragEvent(), k && y && (q = setTimeout(function() {
            Zt(x, "touchstart", a.onDragStart, {
              passive: !1
            });
          }))) : k && y && Wt(x, "touchstart", a.onDragStart), a.flag && zd(d)) {
            if (clearTimeout(q), z && d.touches.length !== d.changedTouches.length)
              return;
            a.pinchFlag || a.onPinchStart(d);
          }
        }
      }
    }, a.onDrag = function(d, p) {
      if (a.flag) {
        var h = a.options.preventDefault;
        !a._isMouseEvent && h && d.preventDefault(), a._prevInputEvent = d;
        var m = Kn(d), x = a.moveClients(m, d, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || x.deltaX || x.deltaY) {
            var y = a._preventMouseEvent || a.emit("drag", Ut(Ut({}, x), { isScroll: !!p, inputEvent: d }));
            if (y === !1) {
              a.stop();
              return;
            }
          }
          a.pinchFlag && a.onPinch(d, m);
        }
        a.getCurrentStore().getPosition(m, !0);
      }
    }, a.onDragEnd = function(d) {
      if (a.flag) {
        var p = a.options, h = p.pinchOutside, m = p.container, x = p.preventClickEventOnDrag, y = p.preventClickEventOnDragStart, b = p.preventClickEventByCondition, E = a.isDrag;
        (x || y || b) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !b && !y && x && !E && a._allowClickEvent(), a._useTouch && h && Wt(m, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(d);
        var w = d != null && d.touches ? Kn(d) : [], _ = w.length;
        _ === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new ti(w));
        var D = a._getPosition(), M = mn(), g = !E && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = E || g ? 0 : M, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", Ut({ data: a.data, datas: a.data, isDouble: g, isDrag: E, isClick: !E, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: d, isTrusted: a._isTrusted }, D)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
          a._preventMouseEvent = !1;
        }, 200)), a._isIdle = !0);
      }
    }, a.onBlur = function() {
      a.onDragEnd();
    }, a._allowClickEvent = function() {
      Wt(a._window, "click", a._onClick, !0);
    }, a._onClick = function(d) {
      a._allowClickEvent(), a._allowMouseEvent();
      var p = a.options.preventClickEventByCondition;
      p != null && p(d) || (d.stopPropagation(), d.preventDefault());
    }, a._onContextMenu = function(d) {
      var p = a.options;
      p.preventRightClick ? a.onDragEnd(d) : d.preventDefault();
    }, a._passCallback = function() {
    };
    var i = [].concat(r), o = i[0];
    a._window = Hl(o) ? o : we(o), a.options = Ut({ checkInput: !1, container: o && !("document" in o) ? we(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, n);
    var s = a.options, l = s.container, u = s.events, c = s.checkWindowBlur;
    if (a._useDrag = u.indexOf("drag") > -1, a._useTouch = u.indexOf("touch") > -1, a._useMouse = u.indexOf("mouse") > -1, a.targets = i, a._useDrag && i.forEach(function(d) {
      Zt(d, "dragstart", a.onDragStart);
    }), a._useMouse && (i.forEach(function(d) {
      Zt(d, "mousedown", a.onDragStart), Zt(d, "mousemove", a._passCallback);
    }), Zt(l, "contextmenu", a._onContextMenu)), c && Zt(we(), "blur", a.onBlur), a._useTouch) {
      var f = {
        passive: !1
      };
      i.forEach(function(d) {
        Zt(d, "touchstart", a.onDragStart, f), Zt(d, "touchmove", a._passCallback, f);
      });
    }
    return a;
  }
  return e.prototype.stop = function() {
    this.isDrag = !1, this.data = {}, this.clientStores = [], this.pinchFlag = !1, this.doubleFlag = !1, this.prevTime = 0, this.flag = !1, this._isIdle = !0, this._allowClickEvent(), this._dettachDragEvent(), this._isDragAPI = !1;
  }, e.prototype.getMovement = function(r) {
    return this.getCurrentStore().getMovement(r) + this.clientStores.slice(1).reduce(function(n, a) {
      return n + a.movement;
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
  }, e.prototype.scrollBy = function(r, n, a, i) {
    i === void 0 && (i = !0), this.flag && (this.clientStores[0].move(r, n), i && this.onDrag(a, !0));
  }, e.prototype.move = function(r, n) {
    var a = r[0], i = r[1], o = this.getCurrentStore(), s = o.prevClients;
    return this.moveClients(s.map(function(l) {
      var u = l.clientX, c = l.clientY;
      return {
        clientX: u + a,
        clientY: c + i,
        originalClientX: u,
        originalClientY: c
      };
    }), n, !0);
  }, e.prototype.triggerDragStart = function(r) {
    this.onDragStart(r, !1);
  }, e.prototype.setEventData = function(r) {
    var n = this.data;
    for (var a in r)
      n[a] = r[a];
    return this;
  }, e.prototype.setEventDatas = function(r) {
    return this.setEventData(r);
  }, e.prototype.getCurrentEvent = function(r) {
    return r === void 0 && (r = this._prevInputEvent), Ut(Ut({ data: this.data, datas: this.data }, this._getPosition()), { movement: this.getMovement(), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, inputEvent: r });
  }, e.prototype.getEventData = function() {
    return this.data;
  }, e.prototype.getEventDatas = function() {
    return this.data;
  }, e.prototype.unset = function() {
    var r = this, n = this.targets, a = this.options.container;
    this.off(), Wt(this._window, "blur", this.onBlur), this._useDrag && n.forEach(function(i) {
      Wt(i, "dragstart", r.onDragStart);
    }), this._useMouse && (n.forEach(function(i) {
      Wt(i, "mousedown", r.onDragStart);
    }), Wt(a, "contextmenu", this._onContextMenu)), this._useTouch && (n.forEach(function(i) {
      Wt(i, "touchstart", r.onDragStart);
    }), Wt(a, "touchstart", this.onDragStart)), this._prevInputEvent = null, this._allowClickEvent(), this._dettachDragEvent();
  }, e.prototype.onPinchStart = function(r) {
    var n = this, a = this.options.pinchThreshold;
    if (!(this.isDrag && this.getMovement() > a)) {
      var i = new ti(Kn(r));
      this.pinchFlag = !0, this._addStore(i);
      var o = this.emit("pinchStart", Ut(Ut({ data: this.data, datas: this.data, angle: i.getAngle(), touches: this.getCurrentStore().getPositions() }, i.getPosition()), { inputEvent: r, isTrusted: this._isTrusted, preventDefault: function() {
        r.preventDefault();
      }, preventDrag: function() {
        n._dragFlag = !1;
      } }));
      o === !1 && (this.pinchFlag = !1);
    }
  }, e.prototype.onPinch = function(r, n) {
    if (!(!this.flag || !this.pinchFlag || n.length < 2)) {
      var a = this.getCurrentStore();
      this.isPinch = !0, this.emit("pinch", Ut(Ut({ data: this.data, datas: this.data, movement: this.getMovement(n), angle: a.getAngle(n), rotation: a.getRotation(n), touches: a.getPositions(n), scale: a.getScale(n), distance: a.getDistance(n) }, a.getPosition(n)), { inputEvent: r, isTrusted: this._isTrusted }));
    }
  }, e.prototype.onPinchEnd = function(r) {
    if (this.pinchFlag) {
      var n = this.isPinch;
      this.isPinch = !1, this.pinchFlag = !1;
      var a = this.getCurrentStore();
      this.emit("pinchEnd", Ut(Ut({ data: this.data, datas: this.data, isPinch: n, touches: a.getPositions() }, a.getPosition()), { inputEvent: r }));
    }
  }, e.prototype.getCurrentStore = function() {
    return this.clientStores[0];
  }, e.prototype.moveClients = function(r, n, a) {
    var i = this._getPosition(r, a), o = this.isDrag;
    (i.deltaX || i.deltaY) && (this.isDrag = !0);
    var s = !1;
    return !o && this.isDrag && (s = !0), Ut(Ut({ data: this.data, datas: this.data }, i), { movement: this.getMovement(r), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, isMouseEvent: this._isMouseEvent, isSecondaryButton: this._isSecondaryButton, inputEvent: n, isTrusted: this._isTrusted, isFirstDrag: s });
  }, e.prototype._addStore = function(r) {
    this.clientStores.splice(0, 0, r);
  }, e.prototype._getPosition = function(r, n) {
    var a = this.getCurrentStore(), i = a.getPosition(r, n), o = this.clientStores.slice(1).reduce(function(u, c) {
      var f = c.getPosition();
      return u.distX += f.distX, u.distY += f.distY, u;
    }, i), s = o.distX, l = o.distY;
    return Ut(Ut({}, i), { distX: s, distY: l });
  }, e.prototype._attchDragEvent = function() {
    var r = this._window, n = this.options.container, a = {
      passive: !1
    };
    this._isDragAPI && (Zt(n, "dragover", this.onDrag, a), Zt(r, "dragend", this.onDragEnd)), this._useMouse && (Zt(n, "mousemove", this.onDrag), Zt(r, "mouseup", this.onDragEnd)), this._useTouch && (Zt(n, "touchmove", this.onDrag, a), Zt(r, "touchend", this.onDragEnd, a), Zt(r, "touchcancel", this.onDragEnd, a));
  }, e.prototype._dettachDragEvent = function() {
    var r = this._window, n = this.options.container;
    this._isDragAPI && (Wt(n, "dragover", this.onDrag), Wt(r, "dragend", this.onDragEnd)), this._useMouse && (Wt(n, "mousemove", this.onDrag), Wt(r, "mouseup", this.onDragEnd)), this._useTouch && (Wt(n, "touchstart", this.onDragStart), Wt(n, "touchmove", this.onDrag), Wt(r, "touchend", this.onDragEnd), Wt(r, "touchcancel", this.onDragEnd));
  }, e.prototype._allowMouseEvent = function() {
    this._preventMouseEvent = !1, clearTimeout(this._preventMouseEventId);
  }, e;
})(wn);
function Bd(t) {
  for (var e = 5381, r = t.length; r; )
    e = e * 33 ^ t.charCodeAt(--r);
  return e >>> 0;
}
var Gd = Bd;
function Fd(t) {
  return Gd(t).toString(36);
}
function Ld(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function Wd(t, e, r) {
  return r.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(n, a) {
    var i = a.trim();
    return (i ? hr(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function Yd(t, e, r, n, a) {
  var i = Re(n), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), r.nonce && o.setAttribute("nonce", r.nonce), o.innerHTML = Wd(t, e, r), (a || i.head || i.body).appendChild(o), o;
}
function eu(t) {
  var e = "rCS" + Fd(t);
  return {
    className: e,
    inject: function(r, n) {
      n === void 0 && (n = {});
      var a = Ld(r), i = (a || r.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = Yd(e, t, n, r, a);
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
var Ri = function() {
  return Ri = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ri.apply(this, arguments);
};
function Xd(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function ru(t, e) {
  var r = eu(e), n = r.className;
  return rt.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = Xd(a, ["className", "cspNonce"]), u = rt.useRef();
    return rt.useImperativeHandle(i, function() {
      return u.current;
    }, []), rt.useEffect(function() {
      var c = r.inject(u.current, {
        nonce: a.cspNonce
      });
      return function() {
        c.destroy();
      };
    }, []), rt.createElement(t, Ri({
      ref: u,
      "data-styled-id": n,
      className: "".concat(s, " ").concat(n)
    }, l));
  });
}
var Pi = function(t, e) {
  return Pi = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Pi(t, e);
};
function Dn(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Pi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var P = function() {
  return P = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, P.apply(this, arguments);
};
function Hd(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
      e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function $d(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function qd(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, r = e && t[e], n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number") return {
    next: function() {
      return t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function N(t, e) {
  var r = typeof Symbol == "function" && t[Symbol.iterator];
  if (!r) return t;
  var n = r.call(t), a, i = [], o;
  try {
    for (; (e === void 0 || e-- > 0) && !(a = n.next()).done; ) i.push(a.value);
  } catch (s) {
    o = { error: s };
  } finally {
    try {
      a && !a.done && (r = n.return) && r.call(n);
    } finally {
      if (o) throw o.error;
    }
  }
  return i;
}
function J(t, e, r) {
  if (arguments.length === 2) for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function _n(t, e) {
  return P({ events: [], props: [], name: t }, e);
}
var Vd = ["n", "w", "s", "e"], fo = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function Ud(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function Kd(t) {
  var e = Ud(1, t), r = Math.round(t / 45) * 45 % 180, n = "ns-resize";
  return r === 135 ? n = "nwse-resize" : r === 45 ? n = "nesw-resize" : r === 90 && (n = "ew-resize"), "cursor:".concat(n, ";cursor: url('").concat(e, "') 16 16, ").concat(n, ";");
}
var qr = Wf(), nu = qr.browser.webkit, au = nu && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), iu = qr.browser.name, ou = parseInt(qr.browser.version, 10), Zd = iu === "chrome", Jd = qr.browser.chromium, Qd = parseInt(qr.browser.chromiumVersion, 10) || 0, tp = Zd && ou >= 109 || Jd && Qd >= 109, ep = iu === "firefox", rp = parseInt(qr.browser.webkitVersion, 10) >= 612 || ou >= 15, po = "moveable-", np = fo.map(function(t) {
  var e = "", r = "", n = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (r = "left: ".concat(i, ";"), n = "right"), t.indexOf("e") > -1 && (r = "left: 0px;", n = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(r).concat(e, `
        transform-origin: `).concat(n, " ").concat(a, `;
    }`);
}).join(`
`), ap = `
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
`.concat(np, `
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
`).concat(Kd(t), `
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

`).concat(au ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), ip = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], Oi = 1e-4, fe = 1e-7, Zn = 1e-9, Ni = Math.pow(10, 10), Is = -Ni, op = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, vo = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, su = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, sp = [
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
function Mn(t, e, r, n, a, i) {
  var o, s;
  i === void 0 && (i = "draggable");
  var l = (s = (o = e.gestos[i]) === null || o === void 0 ? void 0 : o.move(r, t.inputEvent)) !== null && s !== void 0 ? s : {}, u = l.originalDatas || l.datas, c = u[i] || (u[i] = {});
  return P(P({}, l), { isPinch: !!n, parentEvent: !0, datas: c, originalDatas: t.originalDatas });
}
var Lr = /* @__PURE__ */ (function() {
  function t(e) {
    var r;
    e === void 0 && (e = "draggable"), this.ableName = e, this.prevX = 0, this.prevY = 0, this.startX = 0, this.startY = 0, this.isDrag = !1, this.isFlag = !1, this.datas = {
      draggable: {}
    }, this.datas = (r = {}, r[e] = {}, r);
  }
  return t.prototype.dragStart = function(e, r) {
    this.isDrag = !1, this.isFlag = !1;
    var n = r.originalDatas;
    return this.datas = n, n[this.ableName] || (n[this.ableName] = {}), P(P({}, this.move(e, r.inputEvent)), { type: "dragstart" });
  }, t.prototype.drag = function(e, r) {
    return this.move([
      e[0] - this.prevX,
      e[1] - this.prevY
    ], r);
  }, t.prototype.move = function(e, r) {
    var n, a, i = !1;
    if (!this.isFlag)
      this.prevX = e[0], this.prevY = e[1], this.startX = e[0], this.startY = e[1], n = e[0], a = e[1], this.isFlag = !0;
    else {
      var o = this.isDrag;
      n = this.prevX + e[0], a = this.prevY + e[1], (e[0] || e[1]) && (this.isDrag = !0), !o && this.isDrag && (i = !0);
    }
    return this.prevX = n, this.prevY = a, {
      type: "drag",
      clientX: n,
      clientY: a,
      inputEvent: r,
      isFirstDrag: i,
      isDrag: this.isDrag,
      distX: n - this.startX,
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
function Ar(t, e, r, n) {
  var a = t.length === 16, i = a ? 4 : 3, o = Cr(t, r, n, i), s = N(o, 4), l = N(s[0], 2), u = l[0], c = l[1], f = N(s[1], 2), d = f[0], p = f[1], h = N(s[2], 2), m = h[0], x = h[1], y = N(s[3], 2), b = y[0], E = y[1], w = N(Bt(t, e, i), 2), _ = w[0], D = w[1], M = Math.min(u, d, m, b), g = Math.min(c, p, x, E), T = Math.max(u, d, m, b), k = Math.max(c, p, x, E);
  u = u - M || 0, d = d - M || 0, m = m - M || 0, b = b - M || 0, c = c - g || 0, p = p - g || 0, x = x - g || 0, E = E - g || 0, _ = _ - M || 0, D = D - g || 0;
  var z = t[0], O = t[i + 1], R = ue(z * O);
  return {
    left: M,
    top: g,
    right: T,
    bottom: k,
    origin: [_, D],
    pos1: [u, c],
    pos2: [d, p],
    pos3: [m, x],
    pos4: [b, E],
    direction: R
  };
}
function lu(t, e) {
  var r = e.clientX, n = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, u = i.pos1, c = o.left, f = o.top, d = l ? 4 : 3, p = N(vt(Xr(s, [r - c, n - f], d), u), 2), h = p[0], m = p[1], x = N(Le({ datas: a, distX: h, distY: m }), 2), y = x[0], b = x[1];
  return [y, b];
}
function Sr(t, e) {
  var r = e.datas, n = t.state, a = n.allMatrix, i = n.beforeMatrix, o = n.is3d, s = n.left, l = n.top, u = n.origin, c = n.offsetMatrix, f = n.targetMatrix, d = n.transformOrigin, p = o ? 4 : 3;
  r.is3d = o, r.matrix = a, r.targetMatrix = f, r.beforeMatrix = i, r.offsetMatrix = c, r.transformOrigin = d, r.inverseMatrix = Oe(a, p), r.inverseBeforeMatrix = Oe(i, p), r.absoluteOrigin = mr(Tt([s, l], u), p), r.startDragBeforeDist = se(r.inverseBeforeMatrix, r.absoluteOrigin, p), r.startDragDist = se(r.inverseMatrix, r.absoluteOrigin, p);
}
function lp(t) {
  return Ar(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function Ta(t, e, r) {
  var n = e.datas, a = e.originalDatas.beforeRenderable, i = n.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, u = -1;
  i === -1 ? (r === "translate" ? u = 0 : r === "rotate" && (u = Ve(o, function(p) {
    return p.match(/scale\(/g);
  })), u === -1 && (u = o.length), n.transformIndex = u) : xe(l, function(p) {
    return p.index === i && p.functionName === r;
  }) ? u = i : u = i + l.filter(function(p) {
    return p.index < i;
  }).length;
  var c = Nv(o, t.state, u), f = c.targetFunction, d = r === "rotate" ? "rotateZ" : r;
  n.beforeFunctionTexts = c.beforeFunctionTexts, n.afterFunctionTexts = c.afterFunctionTexts, n.beforeTransform = c.beforeFunctionMatrix, n.beforeTransform2 = c.beforeFunctionMatrix2, n.targetTansform = c.targetFunctionMatrix, n.afterTransform = c.afterFunctionMatrix, n.afterTransform2 = c.afterFunctionMatrix2, n.targetAllTransform = c.allFunctionMatrix, f.functionName === d ? (n.afterFunctionTexts.splice(0, 1), n.isAppendTransform = !1) : s > u && (n.isAppendTransform = !0, a.nextTransformAppendedIndexes = J(J([], N(l), !1), [{
    functionName: r,
    index: u,
    isAppend: !0
  }], !1));
}
function Ia(t, e, r) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? r : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function up(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = N(cu({ datas: e, distX: r, distY: n }), 2), i = a[0], o = a[1], s = uu(e, fd([i, o], 4));
  return se(s, mr([0, 0, 0], 4), 4);
}
function uu(t, e, r) {
  var n = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = r ? Nt(s, e, 4) : Nt(e, s, 4), u = Nt(Oe(r ? i : n, 4), l, 4), c = Nt(u, Oe(r ? o : a, 4), 4);
  return c;
}
function cu(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return vt(se(a, Tt(s, [r, n]), l), o);
}
function Le(t, e) {
  var r = t.datas, n = t.distX, a = t.distY, i = r.inverseBeforeMatrix, o = r.inverseMatrix, s = r.is3d, l = r.startDragBeforeDist, u = r.startDragDist, c = r.absoluteOrigin, f = s ? 4 : 3;
  return vt(se(e ? i : o, Tt(c, [n, a]), f), e ? l : u);
}
function cp(t, e) {
  var r = t.datas, n = t.distX, a = t.distY;
  r.beforeMatrix;
  var i = r.matrix, o = r.is3d;
  r.startDragBeforeDist;
  var s = r.startDragDist, l = r.absoluteOrigin, u = o ? 4 : 3;
  return vt(se(i, Tt(s, [n, a]), u), l);
}
function fp(t, e, r, n, a, i) {
  return n === void 0 && (n = e), a === void 0 && (a = r), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = gr(o), u = l.value, c = l.unit, f = s ? a : n, d = s ? r : e;
    if (o === "%" || isNaN(u)) {
      var p = f ? i[s] / f : 0;
      return d * p;
    } else if (c !== "%")
      return u;
    return d * u / 100;
  }) : i;
}
function fu(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function dp(t, e) {
  return fu(e).map(function(r) {
    return t[r];
  });
}
function ei(t, e) {
  var r = (e + 1) / 2;
  return [
    pa(t[0][0], t[1][0], r, 1 - r),
    pa(t[0][1], t[1][1], r, 1 - r)
  ];
}
function re(t, e) {
  var r = ei([t[0], t[1]], e[0]), n = ei([t[2], t[3]], e[0]);
  return ei([r, n], e[1]);
}
function pp(t, e, r, n, a, i) {
  var o = Cr(e, r, n, a), s = re(o, i), l = t[0] - s[0], u = t[1] - s[1];
  return [l, u];
}
function kn(t, e, r, n) {
  return Nt(t, fn(e, n, r), n);
}
function vp(t, e, r, n) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (_e(r)) {
    var u = e.beforeTransform, c = e.afterTransform;
    n ? l = Ne(Gr(r), 4, s) : l = Ne(Nt(Nt(u, Gr([r]), 4), c, 4), 4, s);
  } else
    l = r;
  return kn(i, l, a, s);
}
function hp(t, e) {
  var r = t.transformOrigin, n = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return kn(n, Nt(o || i, oo(e, s), s), r, s);
}
function Ra(t, e) {
  var r = Vr(e);
  return {
    setTransform: function(n, a) {
      a === void 0 && (a = -1), r.startTransforms = Yt(n) ? n : ar(n), zi(t, e, a);
    },
    setTransformIndex: function(n) {
      zi(t, e, n);
    }
  };
}
function Pa(t, e, r) {
  var n = Vr(e), a = n.startTransforms;
  zi(t, e, Ve(a, function(i) {
    return i.indexOf("".concat(r, "(")) === 0;
  }));
}
function zi(t, e, r) {
  var n = Vr(e), a = e.datas;
  if (a.transformIndex = r, r !== -1) {
    var i = n.startTransforms[r];
    if (i) {
      var o = t.state, s = Fr([i], {
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
function ho(t, e) {
  var r = Vr(t);
  r.nextTransforms = ar(e);
}
function Vr(t) {
  return t.originalDatas.beforeRenderable;
}
function xa(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function Jn(t) {
  return (xa(t) || []).join(" ");
}
function Qn(t) {
  return Vr(t).nextStyle;
}
function du(t, e, r, n, a) {
  ho(a, e);
  var i = le.drag(t, Mn(a, t.state, r, n)), o = i ? i.transform : e;
  return P(P({ transform: e, drag: i }, ce({
    transform: o
  }, a)), { afterTransform: o });
}
function go(t, e, r, n, a, i) {
  var o = vp(t.state, a, e, i), s = xp(t, r, n, o);
  return s;
}
function pu(t, e, r, n, a, i, o) {
  var s = go(t, e, r, a, i, o), l = t.state, u = l.left, c = l.top, f = t.props.groupable, d = f ? u : 0, p = f ? c : 0, h = vt(n, s);
  return vt(h, [d, p]);
}
function gp(t, e, r, n, a, i, o) {
  var s = pu(t, e, r, n, a, i, o);
  return s;
}
function mp(t, e, r) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    r ? -1 + t[1] / (r / 2) : 0
  ];
}
function xp(t, e, r, n) {
  n === void 0 && (n = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, u = [
    i / 2 * (1 + e[0]) + r[0],
    o / 2 * (1 + e[1]) + r[1]
  ];
  return Bt(n, u, l);
}
function yp(t, e, r) {
  var n = r.fixedDirection, a = r.fixedPosition, i = r.fixedOffset;
  return pu(t, "rotate(".concat(e, "deg)"), n, a, i, r);
}
function bp(t, e, r, n, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, u = s.offsetMatrix, c = s.is3d, f = s.width, d = s.height, p = s.left, h = s.top, m = i.fixedDirection, x = i.nextTargetMatrix || s.targetMatrix, y = c ? 4 : 3, b = fp(a, e, r, f, d, l), E = o ? p : 0, w = o ? h : 0, _ = kn(u, x, b, y), D = pp(n, _, e, r, y, m);
  return vt(D, [E, w]);
}
function Sp(t, e) {
  return re(ke(t.state), e);
}
function Cp(t, e) {
  var r = t.targetGesto, n = t.controlGesto, a;
  return r != null && r.isFlag() && (a = r.getEventData()[e]), !a && (n != null && n.isFlag()) && (a = n.getEventData()[e]), a || {};
}
function Ep(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function wp(t) {
  var e = t("scale"), r = t("rotate"), n = t("translate"), a = [];
  return n && n !== "0px" && n !== "none" && a.push("translate(".concat(n.split(/\s+/).join(","), ")")), r && r !== "1" && r !== "none" && a.push("rotate(".concat(r, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function vu(t, e, r) {
  for (var n = t, a = [], i = io(t) || sr(t), o = !r && t === e || t === i, s = o, l = !1, u = 3, c, f, d, p = !1, h = bn(e, e, !0).offsetParent, m = 1; n && !s; ) {
    s = o;
    var x = ve(n), y = x("position"), b = Bu(n), E = y === "fixed", w = wp(x), _ = dd(Sv(b)), D = void 0, M = !1, g = !1, T = 0, k = 0, z = 0, O = 0, R = {
      hasTransform: !1,
      fixedContainer: null
    };
    E && (p = !0, R = _v(n), h = R.fixedContainer);
    var j = _.length;
    !l && (j === 16 || w.length) && (l = !0, u = 4, Li(a), d && (d = Ne(d, 3, 4))), l && j === 9 && (_ = Ne(_, 3, 4));
    var A = Dv(n, t), W = A.tagName, X = A.hasOffset, L = A.isSVG, q = A.origin, V = A.targetOrigin, F = A.offset, et = N(F, 2), tt = et[0], K = et[1];
    W === "svg" && !n.ownerSVGElement && d && (a.push({
      type: "target",
      target: n,
      matrix: Mv(n, u)
    }), a.push({
      type: "offset",
      target: n,
      matrix: zt(u)
    }));
    var nt = parseFloat(x("zoom")) || 1;
    if (E)
      D = R.fixedContainer, M = !0;
    else {
      var Q = bn(n, e, !1, !0, x), at = Q.offsetZoom;
      if (D = Q.offsetParent, M = Q.isEnd, g = Q.isStatic, m *= at, (Q.isCustomElement || at !== 1) && g)
        tt -= D.offsetLeft, K -= D.offsetTop;
      else if (ep || tp) {
        var it = Q.parentSlotElement;
        if (it) {
          for (var mt = D, yt = 0, Z = 0; mt && Ep(mt); )
            yt += mt.offsetLeft, Z += mt.offsetTop, mt = mt.offsetParent;
          tt -= yt, K -= Z;
        }
      }
    }
    if (nu && !rp && X && !L && g && (y === "relative" || y === "static") && (tt -= D.offsetLeft, K -= D.offsetTop, o = o || M), E)
      X && R.hasTransform && (z = D.clientLeft, O = D.clientTop);
    else if (X && h !== D && (T = D.clientLeft, k = D.clientTop), X && D === i) {
      var ut = Gu(n, !1);
      tt += ut[0], K += ut[1];
    }
    if (a.push({
      type: "target",
      target: n,
      matrix: fn(_, u, q)
    }), w.length && (a.push({
      type: "offset",
      target: n,
      matrix: zt(u)
    }), a.push({
      type: "target",
      target: n,
      matrix: fn(Gr(w), u, q)
    })), X) {
      var Ct = n === t, pt = Ct ? 0 : n.scrollLeft, ht = Ct ? 0 : n.scrollTop;
      a.push({
        type: "offset",
        target: n,
        matrix: xr([
          tt - pt + T - z,
          K - ht + k - O
        ], u)
      });
    } else
      a.push({
        type: "offset",
        target: n,
        origin: q
      });
    if (nt !== 1 && a.push({
      type: "zoom",
      target: n,
      matrix: fn(oo([nt, nt], u), u, [0, 0])
    }), d || (d = _), c || (c = q), f || (f = V), s || E)
      break;
    n = D, o = M, (!r || n === i) && (s = o);
  }
  return d || (d = zt(u)), c || (c = [0, 0]), f || (f = [0, 0]), {
    zoom: m,
    offsetContainer: h,
    matrixes: a,
    targetMatrix: d,
    transformOrigin: c,
    targetOrigin: f,
    is3d: l,
    hasFixed: p
  };
}
var fr = null, dr = null, Or = null;
function Wr(t) {
  t ? (window.Map && (fr = /* @__PURE__ */ new Map(), dr = /* @__PURE__ */ new Map()), Or = []) : (fr = null, Or = null, dr = null);
}
function Dp(t) {
  var e = dr == null ? void 0 : dr.get(t);
  if (e)
    return e;
  var r = dn(t, !0);
  return dr && dr.set(t, r), r;
}
function _p(t, e) {
  if (Or) {
    var r = xe(Or, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (r)
      return r[1];
  }
  var n = vu(t, e, !0);
  return Or && Or.push([[t, e], n]), n;
}
function ve(t) {
  var e = fr == null ? void 0 : fr.get(t);
  if (!e) {
    var r = we(t).getComputedStyle(t);
    if (!fr)
      return function(i) {
        return r[i];
      };
    e = {
      style: r,
      cached: {}
    }, fr.set(t, e);
  }
  var n = e.cached, a = e.style;
  return function(i) {
    return i in n || (n[i] = a[i]), n[i];
  };
}
function Pe(t, e, r) {
  var n = r.originalDatas;
  n.groupable = n.groupable || {};
  var a = n.groupable;
  a.childDatas = a.childDatas || [];
  var i = a.childDatas;
  return t.moveables.map(function(o, s) {
    return i[s] = i[s] || {}, i[s][e] = i[s][e] || {}, P(P({}, r), { isRequestChild: !0, datas: i[s][e], originalDatas: i[s] });
  });
}
function ri(t, e, r, n, a, i, o) {
  var s = !!r.match(/Start$/g), l = !!r.match(/End$/g), u = a.isPinch, c = a.datas, f = Pe(t, e.name, a), d = t.moveables, p = [], h = f.map(function(m, x) {
    var y = d[x], b = y.state, E = b.gestos, w = m;
    if (s)
      w = new Lr(o).dragStart(n, m), p.push(w);
    else {
      if (E[o] || (E[o] = c.childGestos[x]), !E[o])
        return;
      w = Mn(m, b, n, u, i, o), p.push(w);
    }
    var _ = e[r](y, P(P({}, w), { parentFlag: !0 }));
    return l && (E[o] = null), _;
  });
  return s && (c.childGestos = d.map(function(m) {
    return m.state.gestos[o];
  })), {
    eventParams: h,
    childEvents: p
  };
}
function qe(t, e, r, n, a, i) {
  a === void 0 && (a = function(c, f) {
    return f;
  });
  var o = !!r.match(/End$/g), s = Pe(t, e.name, n), l = t.moveables, u = s.map(function(c, f) {
    var d = l[f], p = c;
    p = a(d, c);
    var h = e[r](d, P(P({}, p), { parentFlag: !0 }));
    return o && (d.state.gestos = {}), h;
  });
  return u;
}
function ya(t, e, r, n) {
  var a = r.fixedDirection, i = r.fixedPosition, o = n.datas.startPositions || ke(e.state), s = re(o, a), l = N(se(En(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), u = l[0], c = l[1];
  return n.datas.originalX = u, n.datas.originalY = c, n;
}
function hu(t, e, r, n) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = br(t.props, e).zoom, u = cn(o / Math.PI * 180), c = {}, f = t.renderState;
  f.renderDirectionMap || (f.renderDirectionMap = {});
  var d = f.renderDirectionMap;
  r.forEach(function(h) {
    var m = h.dir;
    c[m] = !0;
  });
  var p = ue(s);
  return r.map(function(h) {
    var m = h.data, x = h.classNames, y = h.dir, b = vo[y];
    if (!b || !c[y])
      return null;
    d[y] = !0;
    var E = (xt(u, 15) + p * su[y] + 720) % 180, w = {};
    return $r(m).forEach(function(_) {
      w["data-".concat(_)] = m[_];
    }), n.createElement("div", P({ className: dt.apply(void 0, J(["control", "direction", y, e], N(x), !1)), "data-rotation": E, "data-direction": y }, w, { key: "direction-".concat(y), style: Ea.apply(void 0, J([o, l], N(b.map(function(_) {
      return i[_];
    })), !1)) }));
  });
}
function gu(t, e, r, n) {
  var a = br(t.props, r), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? fo : o;
  return J(J([], N(s ? bu(t, n, r, l) : []), !1), N(hu(t, r, l.map(function(u) {
    return {
      data: {},
      classNames: [],
      dir: u
    };
  }), n)), !1);
}
function yn(t, e, r, n, a, i) {
  for (var o = [], s = 6; s < arguments.length; s++)
    o[s - 6] = arguments[s];
  var l = Xt(r, n), u = e ? xt(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: dt.apply(void 0, J(["line", "direction", e ? "edge" : "", e], N(o), !1)), "data-rotation": u, "data-line-key": i, "data-direction": e, style: on(r, n, a, l) });
}
function mu(t, e, r, n, a) {
  var i = r === !0 ? Vd : r;
  return i.map(function(o, s) {
    var l = N(vo[o], 2), u = l[0], c = l[1];
    if (c != null)
      return yn(t, o, n[u], n[c], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function xu(t) {
  return function(e, r) {
    var n = br(e.props, t).edge;
    return n && (n === !0 || n.length) ? J(J([], N(mu(r, t, n, e.getState().renderPoses, e.props.zoom)), !1), N(Mp(e, t, r)), !1) : yu(e, t, r);
  };
}
function yu(t, e, r) {
  return gu(t, fo, e, r);
}
function Mp(t, e, r) {
  return gu(t, ["nw", "ne", "sw", "se"], e, r);
}
function bu(t, e, r, n) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, u = a.renderDirectionMap, c = t.props.zoom, f = ue(l), d = s / Math.PI * 180;
  return (n || $r(u)).map(function(p) {
    var h = vo[p];
    if (!h)
      return null;
    var m = (xt(d, 15) + f * su[p] + 720) % 180, x = ["around-control"];
    return r && x.push("direction", r), e.createElement("div", { className: dt.apply(void 0, J([], N(x), !1)), "data-rotation": m, "data-direction": p, key: "direction-around-".concat(p), style: Ea.apply(void 0, J([s, c], N(h.map(function(y) {
      return o[y];
    })), !1)) });
  });
}
function mo(t, e, r) {
  var n = t || {}, a = n.position, i = a === void 0 ? "client" : a, o = n.left, s = o === void 0 ? -1 / 0 : o, l = n.top, u = l === void 0 ? -1 / 0 : l, c = n.right, f = c === void 0 ? 1 / 0 : c, d = n.bottom, p = d === void 0 ? 1 / 0 : d, h = {
    position: i,
    left: s,
    top: u,
    right: f,
    bottom: p
  };
  return {
    vertical: Rs(h, e, !0),
    horizontal: Rs(h, r, !1)
  };
}
function Oa(t, e) {
  var r = t.state, n = r.containerClientRect, a = n.clientHeight, i = n.clientWidth, o = n.clientLeft, s = n.clientTop, l = r.snapOffset, u = l.left, c = l.top, f = l.right, d = l.bottom, p = e || t.props.bounds || {}, h = p.position || "client", m = h === "css", x = p.left, y = x === void 0 ? -1 / 0 : x, b = p.top, E = b === void 0 ? -1 / 0 : b, w = p.right, _ = w === void 0 ? m ? -1 / 0 : 1 / 0 : w, D = p.bottom, M = D === void 0 ? m ? -1 / 0 : 1 / 0 : D;
  return m && (_ = i + f - u - _, M = a + d - c - M), {
    left: y + u - o,
    right: _ + u - o,
    top: E + c - s,
    bottom: M + c - s
  };
}
function kp(t, e, r) {
  var n = Oa(t), a = n.left, i = n.top, o = n.right, s = n.bottom, l = N(r, 2), u = l[0], c = l[1], f = N(vt(r, e), 2), d = f[0], p = f[1];
  H(d) < fe && (d = 0), H(p) < fe && (p = 0);
  var h = p > 0, m = d > 0, x = {
    isBound: !1,
    offset: 0,
    pos: 0
  }, y = {
    isBound: !1,
    offset: 0,
    pos: 0
  };
  if (d === 0 && p === 0)
    return {
      vertical: x,
      horizontal: y
    };
  if (d === 0)
    h ? s < c && (y.pos = s, y.offset = c - s) : i > c && (y.pos = i, y.offset = c - i);
  else if (p === 0)
    m ? o < u && (x.pos = o, x.offset = u - o) : a > u && (x.pos = a, x.offset = u - a);
  else {
    var b = p / d, E = r[1] - b * u, w = 0, _ = 0, D = !1;
    m && o <= u ? (w = b * o + E, _ = o, D = !0) : !m && u <= a && (w = b * a + E, _ = a, D = !0), D && (w < i || w > s) && (D = !1), D || (h && s <= c ? (w = s, _ = (w - E) / b, D = !0) : !h && c <= i && (w = i, _ = (w - E) / b, D = !0)), D && (x.isBound = !0, x.pos = _, x.offset = u - _, y.isBound = !0, y.pos = w, y.offset = c - w);
  }
  return {
    vertical: x,
    horizontal: y
  };
}
function Rs(t, e, r) {
  var n = t[r ? "left" : "top"], a = t[r ? "right" : "bottom"], i = Math.min.apply(Math, J([], N(e), !1)), o = Math.max.apply(Math, J([], N(e), !1)), s = [];
  return n + 1 > i && s.push({
    direction: "start",
    isBound: !0,
    offset: i - n,
    pos: n
  }), a - 1 < o && s.push({
    direction: "end",
    isBound: !0,
    offset: o - a,
    pos: a
  }), s.length || s.push({
    isBound: !1,
    offset: 0,
    pos: 0
  }), s.sort(function(l, u) {
    return H(u.offset) - H(l.offset);
  });
}
function Ps(t, e, r) {
  var n = r ? t.map(function(a) {
    return Cn(a, r);
  }) : t;
  return n.some(function(a) {
    return a[0] < e.left && H(a[0] - e.left) > 0.1 || a[0] > e.right && H(a[0] - e.right) > 0.1 || a[1] < e.top && H(a[1] - e.top) > 0.1 || a[1] > e.bottom && H(a[1] - e.bottom) > 0.1;
  });
}
function Tp(t, e, r) {
  var n = Me(t), a = Math.sqrt(n * n - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return H(i - t[r ? 0 : 1]) - H(o - t[r ? 0 : 1]);
  }).map(function(i) {
    return Xt([0, 0], r ? [i, e] : [e, i]);
  });
}
function Ip(t, e, r, n, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = Oa(t), s = o.left, l = o.top, u = o.right, c = o.bottom, f = s - n[0], d = u - n[0], p = l - n[1], h = c - n[1], m = {
    left: f,
    top: p,
    right: d,
    bottom: h
  };
  if (!Ps(r, m, 0))
    return [];
  var x = [];
  return [
    [f, 0],
    [d, 0],
    [p, 1],
    [h, 1]
  ].forEach(function(y) {
    var b = N(y, 2), E = b[0], w = b[1];
    r.forEach(function(_) {
      var D = Xt([0, 0], _);
      x.push.apply(x, J([], N(Tp(_, E, w).map(function(M) {
        return i + M - D;
      }).filter(function(M) {
        return !Ps(e, m, M);
      }).map(function(M) {
        return xt(M * 180 / Math.PI, fe);
      })), !1));
    });
  }), x;
}
var Rp = ["left", "right", "center"], Pp = ["top", "bottom", "middle"], Os = {
  left: "start",
  right: "end",
  center: "center",
  top: "start",
  bottom: "end",
  middle: "center"
}, ir = {
  start: "left",
  end: "right",
  center: "center"
}, or = {
  start: "top",
  end: "bottom",
  center: "middle"
};
function Nr() {
  return {
    left: !1,
    top: !1,
    right: !1,
    bottom: !1
  };
}
function Ur(t, e) {
  var r = t.props, n = r.snappable, a = r.bounds, i = r.innerBounds, o = r.verticalGuidelines, s = r.horizontalGuidelines, l = r.snapGridWidth, u = r.snapGridHeight, c = t.state, f = c.guidelines, d = c.enableSnap;
  return !n || !d || e && n !== !0 && n.indexOf(e) < 0 ? !1 : !!(l || u || a || i || f && f.length || o && o.length || s && s.length);
}
function xo(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function Op(t, e) {
  var r = xo(t), n = {};
  for (var a in r)
    a in e && r[a] && (n[a] = e[a]);
  return n;
}
function yo(t, e) {
  var r = Op(t, e), n = Pp.filter(function(i) {
    return i in r;
  }), a = Rp.filter(function(i) {
    return i in r;
  });
  return {
    horizontalNames: n,
    verticalNames: a,
    horizontal: n.map(function(i) {
      return r[i];
    }),
    vertical: a.map(function(i) {
      return r[i];
    })
  };
}
function Np(t, e, r) {
  var n = Bt(t, [e.clientLeft, e.clientTop], r);
  return [
    e.left + n[0],
    e.top + n[1]
  ];
}
function zp(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  Math.abs(a) < Jt && (a = 0), Math.abs(i) < Jt && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * r[0] - r[1]) : (s = 1, l = -r[1]) : (o = -1, l = r[0]), [o, s, l].map(function(u) {
    return xt(u, Jt);
  });
}
var Su = "snapRotationThreshold", Cu = "snapRotationDegrees", Eu = "snapHorizontalThreshold", wu = "snapVerticalThreshold";
function Na(t, e, r, n, a, i, o) {
  var s;
  n === void 0 && (n = []), a === void 0 && (a = []);
  var l = t.props, u = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], c = Vs(o, l[Eu], 5), f = Vs(i, l[wu], 5);
  return Du(t.state.guidelines, e, r, n, a, c, f, u);
}
function Du(t, e, r, n, a, i, o, s) {
  return {
    vertical: zs(t, "vertical", e, o * s[0], n),
    horizontal: zs(t, "horizontal", r, i * s[1], a)
  };
}
function jp(t, e, r) {
  var n = N(r, 2), a = n[0], i = n[1], o = N(e, 2), s = o[0], l = o[1], u = N(vt(r, e), 2), c = u[0], f = u[1], d = f > 0, p = c > 0;
  c = wa(c), f = wa(f);
  var h = {
    isSnap: !1,
    offset: 0,
    pos: 0
  }, m = {
    isSnap: !1,
    offset: 0,
    pos: 0
  };
  if (c === 0 && f === 0)
    return {
      vertical: h,
      horizontal: m
    };
  var x = Na(t, c ? [a] : [], f ? [i] : [], [], [], void 0, void 0), y = x.vertical, b = x.horizontal;
  y.posInfos.filter(function(W) {
    var X = W.pos;
    return p ? X >= s : X <= s;
  }), b.posInfos.filter(function(W) {
    var X = W.pos;
    return d ? X >= l : X <= l;
  }), y.isSnap = y.posInfos.length > 0, b.isSnap = b.posInfos.length > 0;
  var E = ji(y), w = E.isSnap, _ = E.guideline, D = ji(b), M = D.isSnap, g = D.guideline, T = M ? g.pos[1] : 0, k = w ? _.pos[0] : 0;
  if (c === 0)
    M && (m.isSnap = !0, m.pos = g.pos[1], m.offset = i - m.pos);
  else if (f === 0)
    w && (h.isSnap = !0, h.pos = k, h.offset = a - k);
  else {
    var z = f / c, O = r[1] - z * a, R = 0, j = 0, A = !1;
    w ? (j = k, R = z * j + O, A = !0) : M && (R = T, j = (R - O) / z, A = !0), A && (h.isSnap = !0, h.pos = j, h.offset = a - j, m.isSnap = !0, m.pos = R, m.offset = i - R);
  }
  return {
    vertical: h,
    horizontal: m
  };
}
function er(t) {
  var e = "";
  return t === -1 || t === "top" || t === "left" ? e = "start" : t === 0 || t === "center" || t === "middle" ? e = "center" : (t === 1 || t === "right" || t === "bottom") && (e = "end"), e;
}
function Ns(t, e, r, n) {
  var a = yo(t.props.snapDirections, e), i = Na(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return er(l);
  }), a.horizontalNames.map(function(l) {
    return er(l);
  }), r, n), o = er(a.horizontalNames[i.horizontal.index]), s = er(a.verticalNames[i.vertical.index]);
  return {
    vertical: P(P({}, i.vertical), { direction: s }),
    horizontal: P(P({}, i.horizontal), { direction: o })
  };
}
function ji(t) {
  var e = t.isSnap;
  if (!e)
    return {
      isSnap: !1,
      offset: 0,
      dist: -1,
      pos: 0,
      guideline: null
    };
  var r = t.posInfos[0], n = r.guidelineInfos[0], a = n.offset, i = n.dist, o = n.guideline;
  return {
    isSnap: e,
    offset: a,
    dist: i,
    pos: r.pos,
    guideline: o
  };
}
function zs(t, e, r, n, a) {
  var i, o;
  if (a === void 0 && (a = []), !t || !t.length)
    return {
      isSnap: !1,
      index: -1,
      direction: "",
      posInfos: []
    };
  var s = e === "vertical", l = s ? 0 : 1, u = r.map(function(f, d) {
    var p = a[d] || "", h = t.map(function(m) {
      var x = m.pos, y = f - x[l];
      return {
        offset: y,
        dist: H(y),
        guideline: m,
        direction: p
      };
    }).filter(function(m) {
      var x = m.guideline, y = m.dist, b = x.type;
      return !(b !== e || y > n);
    }).sort(function(m, x) {
      return m.dist - x.dist;
    });
    return {
      pos: f,
      index: d,
      guidelineInfos: h,
      direction: p
    };
  }).filter(function(f) {
    return f.guidelineInfos.length > 0;
  }).sort(function(f, d) {
    return f.guidelineInfos[0].dist - d.guidelineInfos[0].dist;
  }), c = u.length > 0;
  return {
    isSnap: c,
    index: c ? u[0].index : -1,
    direction: (o = (i = u[0]) === null || i === void 0 ? void 0 : i.direction) !== null && o !== void 0 ? o : "",
    posInfos: u
  };
}
function Ap(t, e, r, n, a) {
  var i = [];
  r[0] && r[1] ? i = [
    r,
    [-r[0], r[1]],
    [r[0], -r[1]]
  ] : !r[0] && !r[1] ? [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1]
  ].forEach(function(d, p, h) {
    var m = h[p + 1] || h[0];
    i.push(d), i.push([
      (d[0] + m[0]) / 2,
      (d[1] + m[1]) / 2
    ]);
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], r) : (i.push.apply(i, J([], N(dp([
    [-1, -1],
    [1, -1],
    [-1, -1],
    [1, 1]
  ], r)), !1)), i.length > 1 && i.push([
    (i[0][0] + i[1][0]) / 2,
    (i[0][1] + i[1][1]) / 2
  ]));
  var o = i.map(function(d) {
    return re(e, d);
  }), s = o.map(function(d) {
    return d[0];
  }), l = o.map(function(d) {
    return d[1];
  }), u = Na(t, s, l, i.map(function(d) {
    return er(d[0]);
  }), i.map(function(d) {
    return er(d[1]);
  }), n, a), c = er(i.map(function(d) {
    return d[0];
  })[u.vertical.index]), f = er(i.map(function(d) {
    return d[1];
  })[u.horizontal.index]);
  return {
    vertical: P(P({}, u.vertical), { direction: c }),
    horizontal: P(P({}, u.horizontal), { direction: f })
  };
}
function _u(t, e) {
  var r = H(t.offset), n = H(e.offset);
  return t.isBound && e.isBound ? n - r : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? n - r : t.isSnap ? -1 : e.isSnap || r < fe ? 1 : n < fe ? -1 : r - n;
}
function ba(t, e) {
  return t.slice().sort(function(r, n) {
    var a = r.sign[e], i = n.sign[e], o = r.offset[e], s = n.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return _u({ isBound: r.isBound, isSnap: r.isSnap, offset: o }, { isBound: n.isBound, isSnap: n.isSnap, offset: s });
  })[0];
}
function Bp(t, e, r) {
  var n = [];
  if (r)
    H(e[0]) !== 1 || H(e[1]) !== 1 ? n.push([e, [-1, -1]], [e, [-1, 1]], [e, [1, -1]], [e, [1, 1]]) : n.push([e, [t[0], -t[1]]], [e, [-t[0], t[1]]]), n.push([e, t]);
  else if (t[0] && t[1] || !t[0] && !t[1]) {
    var a = t[0] ? t : [1, 1];
    [1, -1].forEach(function(o) {
      [1, -1].forEach(function(s) {
        var l = [o * a[0], s * a[1]];
        e[0] === l[0] && e[1] === l[1] || n.push([e, l]);
      });
    });
  } else if (t[0]) {
    var i = H(e[0]) === 1 ? [1] : [1, -1];
    i.forEach(function(o) {
      n.push([
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
    var i = H(e[1]) === 1 ? [1] : [1, -1];
    i.forEach(function(s) {
      n.push([
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
  return n;
}
function Mu(t, e) {
  var r = Ci([e[0][0], e[1][0]]), n = Ci([e[0][1], e[1][1]]);
  return {
    vertical: r <= t[0],
    horizontal: n <= t[1]
  };
}
function bo(t, e) {
  var r = N(e, 2), n = r[0], a = r[1], i = a[0] - n[0], o = a[1] - n[1];
  H(i) < fe && (i = 0), H(o) < fe && (o = 0);
  var s, l;
  if (!i)
    s = n[0], l = t[0];
  else if (!o)
    s = n[1], l = t[1];
  else {
    var u = o / i;
    s = u * (t[0] - n[0]) + n[1], l = t[1];
  }
  return s - l;
}
function ku(t, e, r, n) {
  return n === void 0 && (n = fe), t.every(function(a) {
    var i = bo(a, e), o = i <= 0;
    return o === r || H(i) <= n;
  });
}
function js(t, e, r, n, a) {
  return a === void 0 && (a = 0), n && e - a <= t || !n && t <= r + a ? {
    isBound: !0,
    offset: n ? e - t : r - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function Gp(t, e) {
  var r = e.line, n = e.centerSign, a = e.verticalSign, i = e.horizontalSign, o = e.lineConstants, s = t.props.innerBounds;
  if (!s)
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var l = s.left, u = s.top, c = s.width, f = s.height, d = [[l, u], [l, u + f]], p = [[l, u], [l + c, u]], h = [[l + c, u], [l + c, u + f]], m = [[l, u + f], [l + c, u + f]];
  if (ku([
    [l, u],
    [l + c, u],
    [l, u + f],
    [l + c, u + f]
  ], r, n))
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var x = rr(r, o, p, a), y = rr(r, o, m, a), b = rr(r, o, d, i), E = rr(r, o, h, i), w = x.isBound && y.isBound, _ = x.isBound || y.isBound, D = b.isBound && E.isBound, M = b.isBound || E.isBound, g = Yr(x.offset, y.offset), T = Yr(b.offset, E.offset), k = [0, 0], z = !1, O = !1;
  return H(T) < H(g) ? (k = [g, 0], z = _, O = w) : (k = [0, T], z = M, O = D), {
    isAllBound: O,
    isVerticalBound: _,
    isHorizontalBound: M,
    isBound: z,
    offset: k
  };
}
function rr(t, e, r, n, a, i) {
  var o = N(e, 2), s = o[0], l = o[1], u = t[0], c = r[0], f = r[1], d = wa(f[1] - c[1]), p = wa(f[0] - c[0]), h = l, m = s, x = -s / l;
  if (p) {
    if (!d) {
      if (i && !h)
        return {
          isBound: !1,
          offset: 0
        };
      if (m) {
        var w = (c[1] - u[1]) / x + u[0];
        return js(w, c[0], f[0], n, a);
      } else {
        var b = c[1] - u[1], E = H(b) <= (a || 0);
        return {
          isBound: E,
          offset: E ? b : 0
        };
      }
    }
  } else {
    if (i && !m)
      return {
        isBound: !1,
        offset: 0
      };
    if (h) {
      var y = x * (c[0] - u[0]) + u[1];
      return js(y, c[1], f[1], n, a);
    } else {
      var b = c[0] - u[0], E = H(b) <= (a || 0);
      return {
        isBound: E,
        offset: E ? b : 0
      };
    }
  }
  return {
    isBound: !1,
    offset: 0
  };
}
function Tu(t, e, r) {
  return e.map(function(n) {
    var a = Gp(t, n), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, u = n.multiple, c = Le({
      datas: r,
      distX: o[0],
      distY: o[1]
    }).map(function(f, d) {
      return f * (u[d] ? 2 / u[d] : 0);
    });
    return {
      sign: u,
      isBound: i,
      isVerticalBound: s,
      isHorizontalBound: l,
      isSnap: !1,
      offset: c
    };
  });
}
function Fp(t, e, r) {
  var n, a = So(t, e, [0, 0], !1).map(function(d) {
    return P(P({}, d), { multiple: d.multiple.map(function(p) {
      return H(p) * 2;
    }) });
  }), i = Tu(t, a, r), o = ba(i, 0), s = ba(i, 1), l = 0, u = 0, c = o.isVerticalBound || s.isVerticalBound, f = o.isHorizontalBound || s.isHorizontalBound;
  return (c || f) && (n = N(cp({
    datas: r,
    distX: -o.offset[0],
    distY: -s.offset[1]
  }), 2), l = n[0], u = n[1]), {
    vertical: {
      isBound: c,
      offset: l
    },
    horizontal: {
      isBound: f,
      offset: u
    }
  };
}
function Lp(t, e) {
  var r = [], n = t[0], a = t[1];
  return n && a ? r.push([[0, a * 2], t, [-n, a]], [[n * 2, 0], t, [n, -a]]) : n ? (r.push([[n * 2, 0], [n, 1], [n, -1]]), e && r.push([[0, -1], [n, -1], [-n, -1]], [[0, 1], [n, 1], [-n, 1]])) : a ? (r.push([[0, a * 2], [1, a], [-1, a]]), e && r.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : r.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), r;
}
function So(t, e, r, n) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = Cr(i, 100, 100, o ? 4 : 3), l = re(s, [0, 0]);
  return Lp(r, n).map(function(u) {
    var c = N(u, 3), f = c[0], d = c[1], p = c[2], h = [
      re(s, d),
      re(s, p)
    ], m = zp(h), x = Mu(l, h), y = x.vertical, b = x.horizontal, E = bo(l, h) <= 0;
    return {
      multiple: f,
      centerSign: E,
      verticalSign: y,
      horizontalSign: b,
      lineConstants: m,
      line: [
        re(e, d),
        re(e, p)
      ]
    };
  });
}
function As(t, e, r, n) {
  var a = n ? t.map(function(i) {
    return Cn(i, n);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = bo(r, i) <= 0;
    return !ku(e, i, o);
  });
}
function Wp(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  if (!a)
    return H(r[0]);
  if (!i)
    return H(r[1]);
  var o = i / a;
  return H((-o * r[0] + r[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function Yp(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  if (!a)
    return [r[0], 0];
  if (!i)
    return [0, r[1]];
  var o = i / a, s = -o * r[0] + r[1];
  return [
    -s / (o + 1 / o),
    s / (o * o + 1)
  ];
}
function Xp(t, e, r, n, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, u = i.width, c = i.height, f = s - n[0], d = s + u - n[0], p = l - n[1], h = l + c - n[1], m = [
    [f, p],
    [d, p],
    [f, h],
    [d, h]
  ], x = re(r, [0, 0]);
  if (!As(r, m, x, 0))
    return [];
  var y = [], b = m.map(function(E) {
    return [
      Me(E),
      Xt([0, 0], E)
    ];
  });
  return [
    [r[0], r[1]],
    [r[1], r[3]],
    [r[3], r[2]],
    [r[2], r[0]]
  ].forEach(function(E) {
    var w = Xt([0, 0], Yp(E)), _ = Wp(E);
    y.push.apply(y, J([], N(b.filter(function(D) {
      var M = N(D, 1), g = M[0];
      return g && _ <= g;
    }).map(function(D) {
      var M = N(D, 2), g = M[0], T = M[1], k = Math.acos(g ? _ / g : 0), z = T + k, O = T - k;
      return [
        o + z - w,
        o + O - w
      ];
    }).reduce(function(D, M) {
      return D.push.apply(D, J([], N(M), !1)), D;
    }, []).filter(function(D) {
      return !As(e, m, x, D);
    }).map(function(D) {
      return xt(D * 180 / Math.PI, fe);
    })), !1));
  }), y;
}
function Hp(t) {
  var e = t.props.innerBounds, r = Nr();
  if (!e)
    return {
      boundMap: r,
      vertical: [],
      horizontal: []
    };
  var n = t.getRect(), a = n.pos1, i = n.pos2, o = n.pos3, s = n.pos4, l = [a, i, o, s], u = re(l, [0, 0]), c = e.left, f = e.top, d = e.width, p = e.height, h = [[c, f], [c, f + p]], m = [[c, f], [c + d, f]], x = [[c + d, f], [c + d, f + p]], y = [[c, f + p], [c + d, f + p]], b = So(t, l, [0, 0], !1), E = [], w = [];
  return b.forEach(function(_) {
    var D = _.line, M = _.lineConstants, g = Mu(u, D), T = g.horizontal, k = g.vertical, z = rr(D, M, m, k, 1, !0), O = rr(D, M, y, k, 1, !0), R = rr(D, M, h, T, 1, !0), j = rr(D, M, x, T, 1, !0);
    z.isBound && !r.top && (E.push(f), r.top = !0), O.isBound && !r.bottom && (E.push(f + p), r.bottom = !0), R.isBound && !r.left && (w.push(c), r.left = !0), j.isBound && !r.right && (w.push(c + d), r.right = !0);
  }), {
    boundMap: r,
    horizontal: E,
    vertical: w
  };
}
function $p(t, e, r, n) {
  var a = e[0] - t[0], i = e[1] - t[1];
  if (H(a) < Jt && (a = 0), H(i) < Jt && (i = 0), !a)
    return n ? [0, 0] : [0, r];
  if (!i)
    return n ? [r, 0] : [0, 0];
  var o = i / a, s = t[1] - o * t[0];
  if (n) {
    var l = o * (e[0] + r) + s;
    return [r, l - e[1]];
  } else {
    var u = (e[1] + r - s) / o;
    return [u - e[0], r];
  }
}
function Ai(t, e, r, n, a) {
  var i = $p(t, e, r, n);
  if (!i)
    return {
      isOutside: !1,
      offset: [0, 0]
    };
  var o = Ge(t, e), s = Ge(i, t), l = Ge(i, e), u = s > o || l > o, c = N(Le({
    datas: a,
    distX: i[0],
    distY: i[1]
  }), 2), f = c[0], d = c[1];
  return {
    offset: [f, d],
    isOutside: u
  };
}
function Sa(t, e) {
  return t.isBound ? t.offset : e.isSnap ? ji(e).offset : 0;
}
function qp(t, e, r, n, a) {
  var i = N(e, 2), o = i[0], s = i[1], l = N(r, 2), u = l[0], c = l[1], f = N(n, 2), d = f[0], p = f[1], h = N(a, 2), m = h[0], x = h[1], y = -m, b = -x;
  if (t && o && s) {
    y = 0, b = 0;
    var E = [];
    if (u && c ? E.push([0, x], [m, 0]) : u ? E.push([m, 0]) : c ? E.push([0, x]) : d && p ? E.push([0, x], [m, 0]) : d ? E.push([m, 0]) : p && E.push([0, x]), E.length) {
      E.sort(function(M, g) {
        return Me(vt([o, s], M)) - Me(vt([o, s], g));
      });
      var w = E[0];
      if (w[0] && H(o) > Jt)
        y = -w[0], b = s * H(o + y) / H(o) - s;
      else if (w[1] && H(s) > Jt) {
        var _ = s;
        b = -w[1], y = o * H(s + b) / H(_) - o;
      }
      if (t && c && u)
        if (H(y) > Jt && H(y) < H(m)) {
          var D = H(m) / H(y);
          y *= D, b *= D;
        } else if (H(b) > Jt && H(b) < H(x)) {
          var D = H(x) / H(b);
          y *= D, b *= D;
        } else
          y = Yr(-m, y), b = Yr(-x, b);
    }
  } else
    y = o || u ? -m : 0, b = s || c ? -x : 0;
  return [y, b];
}
function Vp(t, e, r, n, a, i) {
  if (!Ur(t, "draggable"))
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
  var o = wo(i.absolutePoses, [e, r]), s = De(o), l = s.left, u = s.right, c = s.top, f = s.bottom, d = {
    horizontal: o.map(function(j) {
      return j[1];
    }),
    vertical: o.map(function(j) {
      return j[0];
    })
  }, p = xo(t.props.snapDirections), h = yo(p, {
    left: l,
    right: u,
    top: c,
    bottom: f,
    center: (l + u) / 2,
    middle: (c + f) / 2
  }), m = za(t, a, h, d), x = m.vertical, y = m.horizontal, b = Fp(t, o, i), E = b.vertical, w = b.horizontal, _ = x.isSnap, D = y.isSnap, M = x.isBound || E.isBound, g = y.isBound || w.isBound, T = Yr(x.offset, E.offset), k = Yr(y.offset, w.offset), z = N(qp(n, [e, r], [M, g], [_, D], [T, k]), 2), O = z[0], R = z[1];
  return [
    {
      isBound: M,
      isSnap: _,
      offset: O
    },
    {
      isBound: g,
      isSnap: D,
      offset: R
    }
  ];
}
function za(t, e, r, n) {
  n === void 0 && (n = r);
  var a = mo(Oa(t), n.vertical, n.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : Na(t, r.vertical, r.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, u = s.vertical, c = Sa(i[0], l), f = Sa(o[0], u), d = H(c), p = H(f);
  return {
    horizontal: {
      isBound: i[0].isBound,
      isSnap: l.isSnap,
      snapIndex: l.index,
      offset: c,
      dist: d,
      bounds: i,
      snap: l
    },
    vertical: {
      isBound: o[0].isBound,
      isSnap: u.isSnap,
      snapIndex: u.index,
      offset: f,
      dist: p,
      bounds: o,
      snap: u
    }
  };
}
function Bs(t, e, r, n, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = mo(e, r, n), l = s.horizontal, u = s.vertical, c = Du(t, r, n, [], [], a, i, o), f = c.horizontal, d = c.vertical, p = Sa(l[0], f), h = Sa(u[0], d), m = H(p), x = H(h);
  return {
    horizontal: {
      isBound: l[0].isBound,
      isSnap: f.isSnap,
      snapIndex: f.index,
      offset: p,
      dist: m,
      bounds: l,
      snap: f
    },
    vertical: {
      isBound: u[0].isBound,
      isSnap: d.isSnap,
      snapIndex: d.index,
      offset: h,
      dist: x,
      bounds: u,
      snap: d
    }
  };
}
function Up(t, e, r, n) {
  var a = Xt(t, e) / Math.PI * 180, i = r.vertical, o = i.isBound, s = i.isSnap, l = i.dist, u = r.horizontal, c = u.isBound, f = u.isSnap, d = u.dist, p = a % 180, h = p < 3 || p > 177, m = p > 87 && p < 93;
  return d < l && (o || s && !m && (!n || !h)) ? "vertical" : c || f && !h && (!n || !m) ? "horizontal" : "";
}
function Kp(t, e, r, n, a, i) {
  return r.map(function(o) {
    var s = N(o, 2), l = s[0], u = s[1], c = re(e, l), f = re(e, u), d = n ? Zp(t, c, f, a) : za(t, a, {
      vertical: [f[0]],
      horizontal: [f[1]]
    }), p = d.horizontal, h = p.offset, m = p.isBound, x = p.isSnap, y = d.vertical, b = y.offset, E = y.isBound, w = y.isSnap, _ = vt(u, l);
    if (!b && !h)
      return {
        isBound: E || m,
        isSnap: w || x,
        sign: _,
        offset: [0, 0]
      };
    var D = Up(c, f, d, n);
    if (!D)
      return {
        sign: _,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var M = D === "vertical", g = [0, 0];
    return !n && H(u[0]) === 1 && H(u[1]) === 1 && l[0] !== u[0] && l[1] !== u[1] ? g = Le({
      datas: i,
      distX: -b,
      distY: -h
    }) : g = Ai(c, f, -(M ? b : h), M, i).offset, g = g.map(function(T, k) {
      return T * (_[k] ? 2 / _[k] : 0);
    }), {
      sign: _,
      isBound: M ? E : m,
      isSnap: M ? w : x,
      offset: g
    };
  });
}
function Gs(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function Zp(t, e, r, n) {
  var a = kp(t, e, r), i = a.horizontal, o = a.vertical, s = n ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : jp(t, e, r), l = s.horizontal, u = s.vertical, c = Gs(i, l), f = Gs(o, u), d = H(c), p = H(f);
  return {
    horizontal: {
      isBound: i.isBound,
      isSnap: l.isSnap,
      offset: c,
      dist: d
    },
    vertical: {
      isBound: o.isBound,
      isSnap: u.isSnap,
      offset: f,
      dist: p
    }
  };
}
function Jp(t, e, r, n, a) {
  var i = [-r[0], -r[1]], o = t.state, s = o.width, l = o.height, u = t.props.bounds, c = 1 / 0, f = 1 / 0;
  if (u) {
    var d = [
      [r[0], -r[1]],
      [-r[0], r[1]]
    ], p = u.left, h = p === void 0 ? -1 / 0 : p, m = u.top, x = m === void 0 ? -1 / 0 : m, y = u.right, b = y === void 0 ? 1 / 0 : y, E = u.bottom, w = E === void 0 ? 1 / 0 : E;
    d.forEach(function(_) {
      var D = _[0] !== i[0], M = _[1] !== i[1], g = re(e, _), T = Xt(n, g) * 360 / Math.PI;
      if (M) {
        var k = g.slice();
        (H(T - 360) < 2 || H(T - 180) < 2) && (k[1] = n[1]);
        var z = Ai(n, k, (n[1] < g[1] ? w : x) - g[1], !1, a), O = N(z.offset, 2), R = O[1], j = z.isOutside;
        isNaN(R) || (f = l + (j ? 1 : -1) * H(R));
      }
      if (D) {
        var k = g.slice();
        (H(T - 90) < 2 || H(T - 270) < 2) && (k[0] = n[0]);
        var A = Ai(n, k, (n[0] < g[0] ? b : h) - g[0], !0, a), W = N(A.offset, 1), X = W[0], L = A.isOutside;
        isNaN(X) || (c = s + (L ? 1 : -1) * H(X));
      }
    });
  }
  return {
    maxWidth: c,
    maxHeight: f
  };
}
var le = {
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
    var r = t.props, n = r.hideThrottleDragRotateLine, a = r.throttleDragRotate, i = r.zoom, o = t.getState(), s = o.dragInfo, l = o.beforeOrigin;
    if (n || !a || !s)
      return [];
    var u = s.dist;
    if (!u[0] && !u[1])
      return [];
    var c = Me(u), f = Xt(u, [0, 0]);
    return [e.createElement("div", { className: dt("line", "horizontal", "dragline", "dashed"), key: "dragRotateGuideline", style: {
      width: "".concat(c, "px"),
      transform: "translate(".concat(l[0], "px, ").concat(l[1], "px) rotate(").concat(f, "rad) scaleY(").concat(i, ")")
    } })];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.parentEvent, a = e.parentGesto, i = t.state, o = i.gestos, s = i.style;
    if (o.draggable)
      return !1;
    o.draggable = a || t.targetGesto, r.datas = {}, r.left = parseFloat(s.left || "") || 0, r.top = parseFloat(s.top || "") || 0, r.bottom = parseFloat(s.bottom || "") || 0, r.right = parseFloat(s.right || "") || 0, r.startValue = [0, 0], Sr(t, e), Pa(t, e, "translate"), mv(t, r), r.prevDist = [0, 0], r.prevBeforeDist = [0, 0], r.isDrag = !1, r.deltaOffset = [0, 0];
    var l = Et(t, e, P({ set: function(c) {
      r.startValue = c;
    } }, Ra(t, e))), u = n || ct(t, "onDragStart", l);
    return u !== !1 ? (r.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, r.isPinch = !1), r.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      Ta(t, e, "translate");
      var r = e.datas, n = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, u = e.isGroup, c = e.parentThrottleDrag, f = e.distX, d = e.distY, p = r.isDrag, h = r.prevDist, m = r.prevBeforeDist, x = r.startValue;
      if (p) {
        o && (f += o[0], d += o[1]);
        var y = t.props, b = y.parentMoveable, E = u ? 0 : y.throttleDrag || c || 0, w = n ? 0 : y.throttleDragRotate || 0, _ = 0, D = !1, M = !1, g = !1, T = !1;
        if (!n && w > 0 && (f || d)) {
          var k = y.startDragRotate || 0, z = xt(k + Xt([0, 0], [f, d]) * 180 / Math.PI, w) - k, O = d * Math.abs(Math.cos((z - 90) / 180 * Math.PI)), R = f * Math.abs(Math.cos(z / 180 * Math.PI)), j = Me([R, O]);
          _ = z * Math.PI / 180, f = j * Math.cos(_), d = j * Math.sin(_);
        }
        if (!i && !n && !a) {
          var A = N(Vp(t, f, d, w, !s && l || o, r), 2), W = A[0], X = A[1];
          D = W.isSnap, M = W.isBound, g = X.isSnap, T = X.isBound;
          var L = W.offset, q = X.offset;
          f += L, d += q;
        }
        var V = Tt(cu({ datas: r, distX: f, distY: d }), x), F = Tt(up({ datas: r, distX: f, distY: d }), x);
        _s(F, fe), _s(V, fe), w || (!D && !M && (F[0] = xt(F[0], E), V[0] = xt(V[0], E)), !g && !T && (F[1] = xt(F[1], E), V[1] = xt(V[1], E)));
        var et = vt(V, x), tt = vt(F, x), K = vt(tt, h), nt = vt(et, m);
        r.prevDist = tt, r.prevBeforeDist = et, r.passDelta = K, r.passDist = tt;
        var Q = r.left + et[0], at = r.top + et[1], it = r.right - et[0], mt = r.bottom - et[1], yt = Ia(r, "translate(".concat(F[0], "px, ").concat(F[1], "px)"), "translate(".concat(tt[0], "px, ").concat(tt[1], "px)"));
        if (ho(e, yt), t.state.dragInfo.dist = n ? [0, 0] : tt, !(!n && !b && K.every(function(ht) {
          return !ht;
        }) && nt.some(function(ht) {
          return !ht;
        }))) {
          var Z = t.state, ut = Z.width, Ct = Z.height, pt = Et(t, e, P({ transform: yt, dist: tt, delta: K, translate: F, beforeDist: et, beforeDelta: nt, beforeTranslate: V, left: Q, top: at, right: it, bottom: mt, width: ut, height: Ct, isPinch: i }, ce({
            transform: yt
          }, e)));
          return !n && ct(t, "onDrag", pt), pt;
        }
      }
    }
  },
  dragAfter: function(t, e) {
    var r = e.datas, n = r.deltaOffset;
    return n[0] || n[1] ? (r.deltaOffset = [0, 0], this.drag(t, P(P({}, e), { deltaOffset: n }))) : !1;
  },
  dragEnd: function(t, e) {
    var r = e.parentEvent, n = e.datas;
    if (t.state.dragInfo = null, !!n.isDrag) {
      n.isDrag = !1;
      var a = ye(t, e, {});
      return !r && ct(t, "onDragEnd", a), a;
    }
  },
  dragGroupStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = this.dragStart(t, e);
    if (!s)
      return !1;
    var l = ri(t, this, "dragStart", [
      i || 0,
      o || 0
    ], e, !1, "draggable"), u = l.childEvents, c = l.eventParams, f = P(P({}, s), { targets: t.props.targets, events: c }), d = ct(t, "onDragGroupStart", f);
    a.isDrag = d !== !1;
    var p = (n = (r = u[0]) === null || r === void 0 ? void 0 : r.datas.startValue) !== null && n !== void 0 ? n : [0, 0];
    return a.throttleOffset = [p[0] % 1, p[1] % 1], a.isDrag ? s : !1;
  },
  dragGroup: function(t, e) {
    var r = e.datas;
    if (r.isDrag) {
      var n = this.drag(t, P(P({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = ri(t, this, "drag", a, e, !1, "draggable").eventParams;
      if (n) {
        var o = P({ targets: t.props.targets, events: i }, n);
        return ct(t, "onDragGroup", o), o;
      }
    }
  },
  dragGroupEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isDrag) {
      this.dragEnd(t, e);
      var a = ri(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
      return ct(t, "onDragGroupEnd", ye(t, e, {
        targets: t.props.targets,
        events: a
      })), r;
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
    var e = {}, r = t.getRect(), n = 0, a = 0, i = !1;
    return {
      isControl: !1,
      requestStart: function(o) {
        return i = o.useSnap, { datas: e, useSnap: i };
      },
      request: function(o) {
        return "x" in o ? n = o.x - r.left : "deltaX" in o && (n += o.deltaX), "y" in o ? a = o.y - r.top : "deltaY" in o && (a += o.deltaY), { datas: e, distX: n, distY: a, useSnap: i };
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
function Iu(t, e) {
  var r = re(t, e), n = [0, 0];
  return {
    fixedPosition: r,
    fixedDirection: e,
    fixedOffset: n
  };
}
function Qp(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = [
    a / 2 * (1 + e[0]),
    i / 2 * (1 + e[1])
  ], l = Bt(r, s, o), u = [0, 0];
  return {
    fixedPosition: l,
    fixedDirection: e,
    fixedOffset: u
  };
}
function Ru(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = mp(e, a, i), l = Bt(r, e, o), u = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: u
  };
}
var Fs = Mo("resizable"), Bi = {
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
  render: xu("resizable"),
  dragControlCondition: Fs,
  viewClassName: _o("resizable"),
  dragControlStart: function(t, e) {
    var r, n = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, u = e.parentFixedDirection, c = e.parentEvent, f = Xu(o, a, n, l), d = t.state, p = d.target, h = d.width, m = d.height, x = d.gestos;
    if (!f || !p || x.resizable)
      return !1;
    x.resizable = s || t.controlGesto, !a && Sr(t, e), l.datas = {}, l.direction = f, l.startOffsetWidth = h, l.startOffsetHeight = m, l.prevWidth = 0, l.prevHeight = 0, l.minSize = [0, 0], l.startWidth = d.inlineCSSWidth || d.cssWidth, l.startHeight = d.inlineCSSHeight || d.cssHeight, l.maxSize = [1 / 0, 1 / 0], i || (l.minSize = [
      d.minOffsetWidth,
      d.minOffsetHeight
    ], l.maxSize = [
      d.maxOffsetWidth,
      d.maxOffsetHeight
    ]);
    var y = t.props.transformOrigin || "% %";
    l.transformOrigin = _e(y) ? y.split(" ") : y, l.startOffsetMatrix = d.offsetMatrix, l.startTransformOrigin = d.transformOrigin, l.isWidth = (r = e == null ? void 0 : e.parentIsWidth) !== null && r !== void 0 ? r : !f[0] && !f[1] || f[0] || !f[1];
    function b(T) {
      l.ratio = T && isFinite(T) ? T : 0;
    }
    l.startPositions = ke(t.state);
    function E(T) {
      var k = Iu(l.startPositions, T);
      l.fixedDirection = k.fixedDirection, l.fixedPosition = k.fixedPosition, l.fixedOffset = k.fixedOffset;
    }
    function w(T) {
      var k = Ru(t.state, T);
      l.fixedDirection = k.fixedDirection, l.fixedPosition = k.fixedPosition, l.fixedOffset = k.fixedOffset;
    }
    function _(T) {
      l.minSize = [
        Ot("".concat(T[0]), 0) || 0,
        Ot("".concat(T[1]), 0) || 0
      ];
    }
    function D(T) {
      var k = [
        T[0] || 1 / 0,
        T[1] || 1 / 0
      ];
      (!gn(k[0]) || isFinite(k[0])) && (k[0] = Ot("".concat(k[0]), 0) || 1 / 0), (!gn(k[1]) || isFinite(k[1])) && (k[1] = Ot("".concat(k[1]), 0) || 1 / 0), l.maxSize = k;
    }
    b(h / m), E(u || [-f[0], -f[1]]), l.setFixedDirection = E, l.setFixedPosition = w, l.setMin = _, l.setMax = D;
    var M = Et(t, e, {
      direction: f,
      startRatio: l.ratio,
      set: function(T) {
        var k = N(T, 2), z = k[0], O = k[1];
        l.startWidth = z, l.startHeight = O;
      },
      setMin: _,
      setMax: D,
      setRatio: b,
      setFixedDirection: E,
      setFixedPosition: w,
      setOrigin: function(T) {
        l.transformOrigin = T;
      },
      dragStart: le.dragStart(t, new Lr().dragStart([0, 0], e))
    }), g = c || ct(t, "onResizeStart", M);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, g !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: f
    }), l.isResize ? M : !1;
  },
  dragControl: function(t, e) {
    var r, n = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, u = e.useSnap, c = e.isRequest, f = e.isGroup, d = e.parentEvent, p = e.resolveMatrix, h = n.isResize, m = n.transformOrigin, x = n.startWidth, y = n.startHeight, b = n.prevWidth, E = n.prevHeight, w = n.minSize, _ = n.maxSize, D = n.ratio, M = n.startOffsetWidth, g = n.startOffsetHeight, T = n.isWidth;
    if (!h)
      return;
    if (p) {
      var k = t.state.is3d, z = n.startOffsetMatrix, O = n.startTransformOrigin, R = k ? 4 : 3, j = Gr(xa(e)), A = Math.sqrt(j.length);
      R !== A && (j = Ne(j, A, R));
      var W = kn(z, j, O, R), X = Cr(W, M, g, R);
      n.startPositions = X, n.nextTargetMatrix = j, n.nextAllMatrix = W;
    }
    var L = br(t.props, "resizable"), q = L.resizeFormat, V = L.throttleResize, F = V === void 0 ? a ? 0 : 1 : V, et = L.parentMoveable, tt = L.keepRatioFinally, K = n.direction, nt = K, Q = 0, at = 0;
    !K[0] && !K[1] && (nt = [1, 1]);
    var it = D && (o ?? L.keepRatio) || !1;
    function mt() {
      var Gt = n.fixedDirection, jt = Ku(nt, it, n, e);
      Q = jt.distWidth, at = jt.distHeight;
      var ze = nt[0] - Gt[0] || it ? Math.max(M + Q, fe) : M, Te = nt[1] - Gt[1] || it ? Math.max(g + at, fe) : g;
      return it && M && g && (T ? Te = ze / D : ze = Te * D), [ze, Te];
    }
    var yt = N(mt(), 2), Z = yt[0], ut = yt[1];
    d || (n.setFixedDirection(n.fixedDirection), ct(t, "onBeforeResize", Et(t, e, {
      startFixedDirection: n.startFixedDirection,
      startFixedPosition: n.startFixedPosition,
      setFixedDirection: function(Gt) {
        var jt;
        return n.setFixedDirection(Gt), jt = N(mt(), 2), Z = jt[0], ut = jt[1], [Z, ut];
      },
      setFixedPosition: function(Gt) {
        var jt;
        return n.setFixedPosition(Gt), jt = N(mt(), 2), Z = jt[0], ut = jt[1], [Z, ut];
      },
      boundingWidth: Z,
      boundingHeight: ut,
      setSize: function(Gt) {
        var jt;
        jt = N(Gt, 2), Z = jt[0], ut = jt[1];
      }
    }, !0)));
    var Ct = s;
    s || (!a && i ? Ct = Sp(t, [0, 0]) : Ct = n.fixedPosition);
    var pt = [0, 0];
    i || (pt = hv(t, Z, ut, K, Ct, !u && c, n)), l && (!l[0] && (pt[0] = 0), !l[1] && (pt[1] = 0));
    function ht() {
      var Gt;
      q && (Gt = N(q([Z, ut]), 2), Z = Gt[0], ut = Gt[1]), Z = xt(Z, F), ut = xt(ut, F);
    }
    if (it) {
      nt[0] && nt[1] && pt[0] && pt[1] && (H(pt[0]) > H(pt[1]) ? pt[1] = 0 : pt[0] = 0);
      var bt = !pt[0] && !pt[1];
      bt && ht(), nt[0] && !nt[1] || pt[0] && !pt[1] || bt && T ? (Z += pt[0], ut = Z / D) : (!nt[0] && nt[1] || !pt[0] && pt[1] || bt && !T) && (ut += pt[1], Z = ut * D);
    } else
      Z += pt[0], ut += pt[1], Z = Math.max(0, Z), ut = Math.max(0, ut);
    r = N(no([Z, ut], w, _, it ? D : !1), 2), Z = r[0], ut = r[1], ht(), it && (f || tt) && (T ? ut = Z / D : Z = ut * D), Q = Z - M, at = ut - g;
    var gt = [Q - b, at - E];
    n.prevWidth = Q, n.prevHeight = at;
    var _t = bp(t, Z, ut, Ct, m, n);
    if (!(!et && gt.every(function(Gt) {
      return !Gt;
    }) && _t.every(function(Gt) {
      return !Gt;
    }))) {
      var St = le.drag(t, Mn(e, t.state, _t, !!i, !1, "draggable")), Mt = St.transform, Ht = x + Q, ae = y + at, $t = Et(t, e, P({ width: Ht, height: ae, offsetWidth: Math.round(Z), offsetHeight: Math.round(ut), startRatio: D, boundingWidth: Z, boundingHeight: ut, direction: K, dist: [Q, at], delta: gt, isPinch: !!i, drag: St }, $u({
        style: {
          width: "".concat(Ht, "px"),
          height: "".concat(ae, "px")
        },
        transform: Mt
      }, St, e)));
      return !d && ct(t, "onResize", $t), $t;
    }
  },
  dragControlAfter: function(t, e) {
    var r = e.datas, n = r.isResize, a = r.startOffsetWidth, i = r.startOffsetHeight, o = r.prevWidth, s = r.prevHeight;
    if (!(!n || t.props.checkResizableError === !1)) {
      var l = t.state, u = l.width, c = l.height, f = u - (a + o), d = c - (i + s), p = H(f) > 3, h = H(d) > 3;
      if (p && (r.startWidth += f, r.startOffsetWidth += f, r.prevWidth += f), h && (r.startHeight += d, r.startOffsetHeight += d, r.prevHeight += d), p || h)
        return this.dragControl(t, e);
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.parentEvent;
    if (r.isResize) {
      r.isResize = !1;
      var a = ye(t, e, {});
      return !n && ct(t, "onResizeEnd", a), a;
    }
  },
  dragGroupControlCondition: Fs,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, P(P({}, e), { isGroup: !0 }));
    if (!n)
      return !1;
    var a = Pe(t, "resizable", e), i = r.startOffsetWidth, o = r.startOffsetHeight;
    function s() {
      var p = r.minSize;
      a.forEach(function(h) {
        var m = h.datas, x = m.minSize, y = m.startOffsetWidth, b = m.startOffsetHeight, E = i * (y ? x[0] / y : 0), w = o * (b ? x[1] / b : 0);
        p[0] = Math.max(p[0], E), p[1] = Math.max(p[1], w);
      });
    }
    function l() {
      var p = r.maxSize;
      a.forEach(function(h) {
        var m = h.datas, x = m.maxSize, y = m.startOffsetWidth, b = m.startOffsetHeight, E = i * (y ? x[0] / y : 0), w = o * (b ? x[1] / b : 0);
        p[0] = Math.min(p[0], E), p[1] = Math.min(p[1], w);
      });
    }
    var u = qe(t, this, "dragControlStart", e, function(p, h) {
      return ya(t, p, r, h);
    });
    s(), l();
    var c = function(p) {
      n.setFixedDirection(p), u.forEach(function(h, m) {
        h.setFixedDirection(p), ya(t, h.moveable, r, a[m]);
      });
    };
    r.setFixedDirection = c;
    var f = P(P({}, n), { targets: t.props.targets, events: u.map(function(p) {
      return P(P({}, p), { setMin: function(h) {
        p.setMin(h), s();
      }, setMax: function(h) {
        p.setMax(h), l();
      } });
    }), setFixedDirection: c, setMin: function(p) {
      n.setMin(p), s();
    }, setMax: function(p) {
      n.setMax(p), l();
    } }), d = ct(t, "onResizeGroupStart", f);
    return r.isResize = d !== !1, r.isResize ? n : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isResize) {
      var n = br(t.props, "resizable");
      Aa(t, "onBeforeResize", function(p) {
        ct(t, "onBeforeResizeGroup", Et(t, e, P(P({}, p), { targets: n.targets }), !0));
      });
      var a = this.dragControl(t, P(P({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = n.keepRatio, u = [
          i / (i - s[0]),
          o / (o - s[1])
        ], c = r.fixedPosition, f = qe(t, this, "dragControl", e, function(p, h) {
          var m = N(se(En(t.rotation / 180 * Math.PI, 3), [
            h.datas.originalX * u[0],
            h.datas.originalY * u[1],
            1
          ], 3), 2), x = m[0], y = m[1];
          return P(P({}, h), { parentDist: null, parentScale: u, dragClient: Tt(c, [x, y]), parentKeepRatio: l });
        }), d = P({ targets: n.targets, events: f }, a);
        return ct(t, "onResizeGroup", d), d;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isResize) {
      this.dragControlEnd(t, e);
      var a = qe(t, this, "dragControlEnd", e), i = ye(t, e, {
        targets: t.props.targets,
        events: a
      });
      return ct(t, "onResizeGroupEnd", i), r;
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
    var e = {}, r = 0, n = 0, a = !1, i = t.getRect();
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
        return "offsetWidth" in o ? r = o.offsetWidth - i.offsetWidth : "deltaWidth" in o && (r += o.deltaWidth), "offsetHeight" in o ? n = o.offsetHeight - i.offsetHeight : "deltaHeight" in o && (n += o.deltaHeight), {
          datas: e,
          parentDist: [r, n],
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
function ni(t, e, r, n, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, u = Bt(
    t.state.rootMatrix,
    // TO-DO #710
    vt([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), c = Tt([a.left, a.top], u);
  e.startAbsoluteOrigin = c, e.prevDeg = Xt(c, [r, n]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = Ge(c, [r, n]);
}
function fa(t, e, r) {
  var n = r.defaultDeg, a = r.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - n);
  return r.prevDeg = n + s, s;
}
function ai(t, e, r, n) {
  return fa(Xt(n.startAbsoluteOrigin, [t, e]) / Math.PI * 180, r, n);
}
function ii(t, e, r, n, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = r.prevSnapDeg, u = 0, c = !1;
  if (i) {
    var f = vv(t, e, n, a + n);
    c = f.isSnap, u = a + f.dist;
  }
  c || (u = xt(a + n, s));
  var d = u - a;
  return r.prevSnapDeg = d, [d - l, d, u];
}
function Pu(t, e, r) {
  var n = N(e, 4), a = n[0], i = n[1], o = n[2], s = n[3];
  if (t === "none")
    return [];
  if (Yt(t))
    return t.map(function(x) {
      return Pu(x, [a, i, o, s], r)[0];
    });
  var l = N((t || "top").split("-"), 2), u = l[0], c = l[1], f = [a, i];
  u === "left" ? f = [o, a] : u === "right" ? f = [i, s] : u === "bottom" && (f = [s, o]);
  var d = [
    (f[0][0] + f[1][0]) / 2,
    (f[0][1] + f[1][1]) / 2
  ], p = Wu(f, r);
  if (c) {
    var h = c === "top" || c === "left", m = u === "bottom" || u === "left";
    d = f[h && !m || !h && m ? 0 : 1];
  }
  return [[d, p]];
}
function Gi(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var r = e.inputEvent.target;
  if (Qt(r, dt("rotation-control")) || t.props.rotateAroundControls && Qt(r, dt("around-control")) || Qt(r, dt("control")) && Qt(r, dt("rotatable")))
    return !0;
  var n = t.props.rotationTarget;
  return n ? ko(n, !0).some(function(a) {
    return a ? r === a || r.contains(a) : !1;
  }) : !1;
}
var tv = `.rotation {
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
`, ev = {
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
  css: [tv],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? dt("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var r = br(t.props, "rotatable"), n = r.rotatable, a = r.rotationPosition, i = r.zoom, o = r.renderDirections, s = r.rotateAroundControls, l = r.resolveAblesWithRotatable, u = t.getState(), c = u.renderPoses, f = u.direction;
    if (!n)
      return null;
    var d = Pu(a, c, f), p = [];
    if (d.forEach(function(y, b) {
      var E = N(y, 2), w = E[0], _ = E[1];
      p.push(e.createElement(
        "div",
        { key: "rotation".concat(b), className: dt("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(w[0], "px, ").concat(w[1], "px) rotate(").concat(_, "rad)")
        } },
        e.createElement("div", { className: dt("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: dt("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var h = $r(l || {}), m = {};
      h.forEach(function(y) {
        l[y].forEach(function(b) {
          m[b] = y;
        });
      });
      var x = [];
      Yt(o) && (x = o.map(function(y) {
        var b = m[y];
        return {
          data: b ? { resolve: b } : {},
          classNames: b ? ["move"] : [],
          dir: y
        };
      })), p.push.apply(p, J([], N(hu(t, "rotatable", x, e)), !1));
    }
    return s && p.push.apply(p, J([], N(bu(t, e)), !1)), p;
  },
  dragControlCondition: Gi,
  dragControlStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, u = e.isPinch, c = e.isRequest, f = t.state, d = f.target, p = f.left, h = f.top, m = f.direction, x = f.beforeDirection, y = f.targetTransform, b = f.moveableClientRect, E = f.offsetMatrix, w = f.targetMatrix, _ = f.allMatrix, D = f.width, M = f.height;
    if (!c && !d)
      return !1;
    var g = t.getRect();
    a.rect = g, a.transform = y, a.left = p, a.top = h;
    var T = function(nt) {
      var Q = Ru(t.state, nt);
      a.fixedDirection = Q.fixedDirection, a.fixedOffset = Q.fixedOffset, a.fixedPosition = Q.fixedPosition, F && F.setFixedPosition(nt);
    }, k = function(nt) {
      var Q = Qp(t.state, nt);
      a.fixedDirection = Q.fixedDirection, a.fixedOffset = Q.fixedOffset, a.fixedPosition = Q.fixedPosition, F && F.setFixedDirection(nt);
    }, z = i, O = o;
    if (c || u || l) {
      var R = s || 0;
      a.beforeInfo = {
        origin: g.beforeOrigin,
        prevDeg: R,
        defaultDeg: R,
        prevSnapDeg: 0,
        startDist: 0
      }, a.afterInfo = P(P({}, a.beforeInfo), { origin: g.origin }), a.absoluteInfo = P(P({}, a.beforeInfo), { origin: g.origin, startValue: R });
    } else {
      var j = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
      if (j) {
        var A = j.getAttribute("data-direction") || "", W = op[A];
        if (W) {
          a.isControl = !0, a.isAroundControl = Qt(j, dt("around-control")), a.controlDirection = W;
          var X = j.getAttribute("data-resolve");
          X && (a.resolveAble = X);
          var L = Iv(f.rootMatrix, f.renderPoses, b);
          r = N(re(L, W), 2), z = r[0], O = r[1];
        }
      }
      a.beforeInfo = { origin: g.beforeOrigin }, a.afterInfo = { origin: g.origin }, a.absoluteInfo = {
        origin: g.origin,
        startValue: g.rotation
      };
      var q = T;
      T = function(nt) {
        var Q = f.is3d ? 4 : 3, at = N(Tt(ql(w, Q), nt), 2), it = at[0], mt = at[1], yt = se(E, mr([it, mt], Q)), Z = se(_, mr([nt[0], nt[1]], Q));
        q(nt);
        var ut = f.posDelta;
        a.beforeInfo.origin = vt(yt, ut), a.afterInfo.origin = vt(Z, ut), a.absoluteInfo.origin = vt(Z, ut), ni(t, a.beforeInfo, z, O, b), ni(t, a.afterInfo, z, O, b), ni(t, a.absoluteInfo, z, O, b);
      }, k = function(nt) {
        var Q = re([
          [0, 0],
          [D, 0],
          [0, M],
          [D, M]
        ], nt);
        T(Q);
      };
    }
    a.startClientX = z, a.startClientY = O, a.direction = m, a.beforeDirection = x, a.startValue = 0, a.datas = {}, Pa(t, e, "rotate");
    var V = !1, F = !1;
    if (a.isControl && a.resolveAble) {
      var et = a.resolveAble;
      et === "resizable" && (F = Bi.dragControlStart(t, P(P({}, new Lr("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    F || (V = le.dragStart(t, new Lr().dragStart([0, 0], e))), T(Rv(t));
    var tt = Et(t, e, P(P({ set: function(nt) {
      a.startValue = nt * Math.PI / 180;
    }, setFixedDirection: k, setFixedPosition: T }, Ra(t, e)), { dragStart: V, resizeStart: F })), K = ct(t, "onRotateStart", tt);
    return a.isRotate = K !== !1, f.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? tt : !1;
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, u = e.parentFlag, c = e.isPinch, f = e.groupDelta, d = e.resolveMatrix, p = i.beforeDirection, h = i.beforeInfo, m = i.afterInfo, x = i.absoluteInfo, y = i.isRotate, b = i.startValue, E = i.rect, w = i.startClientX, _ = i.startClientY;
    if (y) {
      Ta(t, e, "rotate");
      var D = lp(e), M = p * D, g = t.props.parentMoveable, T = 0, k, z, O = 0, R, j, A = 0, W, X, L = 180 / Math.PI * b, q = x.startValue, V = !1, F = w + o, et = _ + s;
      if (!u && "parentDist" in e) {
        var tt = e.parentDist;
        k = tt, R = tt, W = tt;
      } else c || u ? (k = fa(l, p, h), R = fa(l, M, m), W = fa(l, M, x)) : (k = ai(F, et, p, h), R = ai(F, et, M, m), W = ai(F, et, M, x), V = !0);
      if (z = L + k, j = L + R, X = q + W, ct(t, "onBeforeRotate", Et(t, e, {
        beforeRotation: z,
        rotation: j,
        absoluteRotation: X,
        setRotation: function(Ct) {
          R = Ct - L, k = R, W = R;
        }
      }, !0)), r = N(ii(t, E, h, k, L, V), 3), T = r[0], k = r[1], z = r[2], n = N(ii(t, E, m, R, L, V), 3), O = n[0], R = n[1], j = n[2], a = N(ii(t, E, x, W, q, V), 3), A = a[0], W = a[1], X = a[2], !(!A && !O && !T && !g && !d)) {
        var K = Ia(i, "rotate(".concat(j, "deg)"), "rotate(".concat(R, "deg)"));
        d && (i.fixedPosition = go(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var nt = yp(t, R, i), Q = vt(Tt(f || [0, 0], nt), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = nt, i.requestValue = null;
        var at = du(t, K, Q, c, e), it = at, mt = Ge([F, et], x.startAbsoluteOrigin) - x.startDist, yt = void 0;
        if (i.resolveAble === "resizable") {
          var Z = Bi.dragControl(t, P(P({}, Mn(e, t.state, [e.deltaX, e.deltaY], !!c, !1, "resizable")), { resolveMatrix: !0, parentDistance: mt }));
          Z && (yt = Z, it = $u(it, Z, e));
        }
        var ut = Et(t, e, P(P({ delta: O, dist: R, rotate: j, rotation: j, beforeDist: k, beforeDelta: T, beforeRotate: z, beforeRotation: z, absoluteDist: W, absoluteDelta: A, absoluteRotate: X, absoluteRotation: X, isPinch: !!c, resize: yt }, at), it));
        return ct(t, "onRotate", ut), ut;
      }
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      r.isRotate = !1;
      var n = ye(t, e, {});
      return ct(t, "onRotateEnd", n), n;
    }
  },
  dragGroupControlCondition: Gi,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = t.state, a = n.left, i = n.top, o = n.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(r.beforeDirection * t.rotation);
    var l = qe(t, this, "dragControlStart", e, function(f, d) {
      var p = f.state, h = p.left, m = p.top, x = p.beforeOrigin, y = Tt(vt([h, m], [a, i]), vt(x, o));
      return d.datas.startGroupClient = y, d.datas.groupClient = y, P(P({}, d), { parentRotate: 0 });
    }), u = P(P({}, s), { targets: t.props.targets, events: l }), c = ct(t, "onRotateGroupStart", u);
    return r.isRotate = c !== !1, r.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      Aa(t, "onBeforeRotate", function(u) {
        ct(t, "onBeforeRotateGroup", Et(t, e, P(P({}, u), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = r.beforeDirection, i = n.beforeDist, o = i / 180 * Math.PI, s = qe(t, this, "dragControl", e, function(u, c) {
          var f = c.datas.startGroupClient, d = N(c.datas.groupClient, 2), p = d[0], h = d[1], m = N(Cn(f, o * a), 2), x = m[0], y = m[1], b = [x - p, y - h];
          return c.datas.groupClient = [x, y], P(P({}, c), { parentRotate: i, groupDelta: b });
        });
        t.rotation = a * n.beforeRotation;
        var l = P({ targets: t.props.targets, events: s, set: function(u) {
          t.rotation = u;
        }, setGroupRotation: function(u) {
          t.rotation = u;
        } }, n);
        return ct(t, "onRotateGroup", l), l;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isRotate) {
      this.dragControlEnd(t, e);
      var a = qe(t, this, "dragControlEnd", e), i = ye(t, e, {
        targets: t.props.targets,
        events: a
      });
      return ct(t, "onRotateGroupEnd", i), r;
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
    var e = {}, r = 0, n = t.getRotation();
    return {
      isControl: !0,
      requestStart: function() {
        return { datas: e };
      },
      request: function(a) {
        return "deltaRotate" in a ? r += a.deltaRotate : "rotate" in a && (r = a.rotate - n), { datas: e, parentDist: r };
      },
      requestEnd: function() {
        return { datas: e, isDrag: !0 };
      }
    };
  }
};
function rv(t, e) {
  var r, n = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, u = n === "horizontal", c = u ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (r = {}, r[u ? "width" : "height"] = "".concat(i), r.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(c, "(-50%) scale").concat(c, "(").concat(s, ")"), r)
  });
}
function Co(t, e) {
  return rv(P(P({}, t), { classNames: J([
    dt("line", "guideline", t.direction)
  ], N(t.classNames), !1).filter(function(r) {
    return r;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(r) {
    return "".concat(xt(r, 0.1), "px");
  }) }), e);
}
function Ls(t, e, r, n, a, i, o, s) {
  var l = t.props.zoom;
  return r.map(function(u, c) {
    var f = u.type, d = u.pos, p = [0, 0];
    return p[o] = n, p[o ? 0 : 1] = -a + d, Co({
      key: "".concat(e, "TargetGuideline").concat(c),
      classNames: [dt("target", "bold", f)],
      posValue: p,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function Ws(t, e, r, n, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, u = e === "horizontal" ? ir : or, c = a[u.start], f = a[u.end];
  return r.filter(function(d) {
    var p = d.hide, h = d.elementRect;
    if (p)
      return !1;
    if (l && h) {
      var m = h.rect;
      if (m[u.start] <= c && f <= m[u.end])
        return !1;
    }
    return !0;
  }).map(function(d, p) {
    var h = d.pos, m = d.size, x = d.element, y = d.className, b = [
      -n[0] + h[0],
      -n[1] + h[1]
    ];
    return Co({
      key: "".concat(e, "-default-guideline-").concat(p),
      classNames: x ? [dt("bold"), y] : [dt("normal"), y],
      direction: e,
      posValue: b,
      sizeValue: m,
      zoom: s
    }, i);
  });
}
function an(t, e, r, n, a, i, o, s) {
  var l, u = t.props, c = u.snapDigit, f = c === void 0 ? 0 : c, d = u.isDisplaySnapDigit, p = d === void 0 ? !0 : d, h = u.snapDistFormat, m = h === void 0 ? function(_, D) {
    return _;
  } : h, x = u.zoom, y = e === "horizontal" ? "X" : "Y", b = e === "vertical" ? "height" : "width", E = Math.abs(a), w = p ? parseFloat(E.toFixed(f)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(r, "-guideline-").concat(n), className: dt("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[b] = "".concat(E, "px"), l) },
    Co({
      direction: e,
      classNames: [dt(r), o],
      size: "100%",
      posValue: [0, 0],
      sizeValue: E,
      zoom: x
    }, s),
    s.createElement("div", { className: dt("size-value", "gap"), style: {
      transform: "translate".concat(y, "(-50%) scale(").concat(x, ")")
    } }, w > 0 ? m(w, e) : "")
  );
}
function nv(t, e, r, n) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? ir : or, s = r[o.start], l = r[o.end];
  return qu(e, function(u) {
    return u.pos[a];
  }).map(function(u) {
    var c = [], f = [], d = [];
    return u.forEach(function(p) {
      var h, m, x = p.element, y = p.elementRect.rect;
      if (y[o.end] < s)
        c.push(p);
      else if (l < y[o.start])
        f.push(p);
      else if (y[o.start] <= s && l <= y[o.end] && n) {
        var b = p.pos, E = { element: x, rect: P(P({}, y), (h = {}, h[o.end] = y[o.start], h)) }, w = { element: x, rect: P(P({}, y), (m = {}, m[o.start] = y[o.end], m)) }, _ = [0, 0], D = [0, 0];
        _[a] = b[a], _[i] = b[i], D[a] = b[a], D[i] = b[i] + p.size, c.push({
          type: t,
          pos: _,
          size: 0,
          elementRect: E,
          direction: "",
          elementDirection: "end"
        }), f.push({
          type: t,
          pos: D,
          size: 0,
          elementRect: w,
          direction: "",
          elementDirection: "start"
        });
      }
    }), c.sort(function(p, h) {
      return h.pos[i] - p.pos[i];
    }), f.sort(function(p, h) {
      return p.pos[i] - h.pos[i];
    }), {
      total: u,
      start: c,
      end: f,
      inner: d
    };
  });
}
function av(t, e, r, n, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(x) {
      return x.type === s;
    }), u = s === "vertical" ? 1 : 0, c = u ? 0 : 1, f = nv(s, l, n, i), d = u ? or : ir, p = u ? ir : or, h = n[d.start], m = n[d.end];
    f.forEach(function(x) {
      var y = x.total, b = x.start, E = x.end, w = x.inner, _ = r[c] + y[0].pos[c] - n[p.start], D = n;
      b.forEach(function(M) {
        var g = M.elementRect.rect, T = D[d.start] - g[d.end];
        if (T > 0) {
          var k = [0, 0];
          k[u] = r[u] + D[d.start] - h - T, k[c] = _, o.push(an(t, s, "dashed", o.length, T, k, M.className, a));
        }
        D = g;
      }), D = n, E.forEach(function(M) {
        var g = M.elementRect.rect, T = g[d.start] - D[d.end];
        if (T > 0) {
          var k = [0, 0];
          k[u] = r[u] + D[d.end] - h, k[c] = _, o.push(an(t, s, "dashed", o.length, T, k, M.className, a));
        }
        D = g;
      }), w.forEach(function(M) {
        var g = M.elementRect.rect, T = h - g[d.start], k = g[d.end] - m, z = [0, 0], O = [0, 0];
        z[u] = r[u] - T, z[c] = _, O[u] = r[u] + m - h, O[c] = _, o.push(an(t, s, "dashed", o.length, T, z, M.className, a)), o.push(an(t, s, "dashed", o.length, k, O, M.className, a));
      });
    });
  }), o;
}
function iv(t, e, r, n, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(x) {
      return x.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, u = l ? 0 : 1, c = l ? or : ir, f = l ? ir : or, d = n[c.start], p = n[c.end], h = n[f.start], m = n[f.end];
    s.forEach(function(x) {
      var y = x.gap, b = x.gapRects, E = Math.max.apply(Math, J([h], N(b.map(function(D) {
        var M = D.rect;
        return M[f.start];
      })), !1)), w = Math.min.apply(Math, J([m], N(b.map(function(D) {
        var M = D.rect;
        return M[f.end];
      })), !1)), _ = (E + w) / 2;
      E === w || _ === (h + m) / 2 || b.forEach(function(D) {
        var M = D.rect, g = D.className, T = [r[0], r[1]];
        if (M[c.end] < d)
          T[l] += M[c.end] - d;
        else if (p < M[c.start])
          T[l] += M[c.start] - d - y;
        else
          return;
        T[u] += _ - h, i.push(an(t, l ? "vertical" : "horizontal", "gap", i.length, y, T, g, a));
      });
    });
  }), i;
}
function Fi(t) {
  var e, r, n = t.state, a = n.containerClientRect, i = n.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, u = a.clientHeight, c = a.clientWidth, f = a.clientLeft, d = a.clientTop, p = t.props, h = p.snapGap, m = h === void 0 ? !0 : h, x = p.verticalGuidelines, y = p.horizontalGuidelines, b = p.snapThreshold, E = b === void 0 ? 5 : b, w = p.maxSnapElementGuidelineDistance, _ = w === void 0 ? 1 / 0 : w, D = p.isDisplayGridGuidelines, M = De(ke(t.state)), g = M.top, T = M.left, k = M.bottom, z = M.right, O = { top: g, left: T, bottom: k, right: z, center: (T + z) / 2, middle: (g + k) / 2 }, R = uv(t), j = J([], N(R), !1), A = ((r = (e = n.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && r !== void 0 ? r : [1, 1]).map(function(q) {
    return q * E;
  });
  m && j.push.apply(j, J([], N(ov(t, O, A)), !1));
  var W = P({}, n.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (j.push.apply(j, J([], N(lv(t, o ? l : c, o ? s : u, f, d, W, D)), !1)), i) {
    var X = a.left, L = a.top;
    W.left += X, W.top += L, W.right += X, W.bottom += L;
  }
  return j.push.apply(j, J([], N(Nu(y || !1, x || !1, o ? l : c, o ? s : u, f, d, W)), !1)), j = j.filter(function(q) {
    var V = q.element, F = q.elementRect, et = q.type;
    if (!V || !F)
      return !0;
    var tt = F.rect;
    return Ou(O, tt, et, _);
  }), j;
}
function ov(t, e, r) {
  var n = t.props, a = n.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = n.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, u = [];
  return [
    ["vertical", ir, or],
    ["horizontal", or, ir]
  ].forEach(function(c) {
    var f = N(c, 3), d = f[0], p = f[1], h = f[2], m = e[p.start], x = e[p.end], y = e[p.center], b = e[h.start], E = e[h.end], w = {
      left: r[0],
      top: r[1]
    };
    function _(g) {
      var T = g.rect, k = w[p.start];
      return T[p.end] < m + k ? m - T[p.end] : x - k < T[p.start] ? T[p.start] - x : -1;
    }
    var D = l.filter(function(g) {
      var T = g.rect;
      return T[h.start] > E || T[h.end] < b ? !1 : _(g) > 0;
    }).sort(function(g, T) {
      return _(g) - _(T);
    }), M = [];
    D.forEach(function(g) {
      D.forEach(function(T) {
        if (g !== T) {
          var k = g.rect, z = T.rect, O = k[h.start], R = k[h.end], j = z[h.start], A = z[h.end];
          O > A || j > R || M.push([g, T]);
        }
      });
    }), M.forEach(function(g) {
      var T = N(g, 2), k = T[0], z = T[1], O = k.rect, R = z.rect, j = O[p.start], A = O[p.end], W = R[p.start], X = R[p.end], L = w[p.start], q = 0, V = 0, F = !1, et = !1, tt = !1;
      if (A <= m && x <= W) {
        if (et = !0, q = (W - A - (x - m)) / 2, V = A + q + (x - m) / 2, H(V - y) > L)
          return;
      } else if (A < W && X < m + L) {
        if (F = !0, q = W - A, V = X + q, H(V - m) > L)
          return;
      } else if (A < W && x - L < j) {
        if (tt = !0, q = W - A, V = j - q, H(V - x) > L)
          return;
      } else
        return;
      q && Ou(e, R, d, i) && (q > s || u.push({
        type: d,
        pos: d === "vertical" ? [V, 0] : [0, V],
        element: z.element,
        size: 0,
        className: z.className,
        isStart: F,
        isCenter: et,
        isEnd: tt,
        gap: q,
        hide: !0,
        gapRects: [k, z],
        direction: "",
        elementDirection: ""
      }));
    });
  }), u;
}
function sv(t, e, r, n) {
  var a, i, o = t.props, s = t.state, l = o.snapGridAll, u = o.snapGridWidth, c = u === void 0 ? 0 : u, f = o.snapGridHeight, d = f === void 0 ? 0 : f, p = s.snapRenderInfo, h = p && (((a = p.direction) === null || a === void 0 ? void 0 : a[0]) || ((i = p.direction) === null || i === void 0 ? void 0 : i[1])), m = t.moveables;
  if (l && m && h && (c || d)) {
    if (s.snapThresholdInfo)
      return;
    s.snapThresholdInfo = {
      multiples: [1, 1],
      offset: [0, 0]
    };
    var x = t.getRect(), y = x.children, b = p.direction;
    if (y) {
      var E = b.map(function(_, D) {
        var M = D === 0 ? {
          snapSize: c,
          posName: "left",
          sizeName: "width",
          clientOffset: n.left - e
        } : {
          snapSize: d,
          posName: "top",
          sizeName: "height",
          clientOffset: n.top - r
        }, g = M.snapSize, T = M.posName, k = M.sizeName, z = M.clientOffset;
        if (!g)
          return {
            dir: _,
            multiple: 1,
            snapSize: g,
            snapOffset: 0
          };
        var O = x[k], R = x[T], j = od(y.map(function(F) {
          return [
            F[T] - R,
            F[k],
            O - F[k] - F[T] + R
          ];
        })).filter(function(F) {
          return F;
        }).sort(function(F, et) {
          return F - et;
        }), A = j[0], W = j.map(function(F) {
          return xt(F / A, 0.1) * g;
        }), X = 1, L = xt(O / A, 0.1);
        for (X = 1; X <= 10 && !W.every(function(F) {
          return F * X % 1 === 0;
        }); ++X)
          ;
        var q = (-_ + 1) / 2, V = pa(R - z, R - z + O, q, 1 - q);
        return {
          multiple: L * X,
          dir: _,
          snapSize: g,
          snapOffset: Math.round(V / g)
        };
      }), w = E.map(function(_) {
        return _.multiple || 1;
      });
      s.snapThresholdInfo.multiples = w, s.snapThresholdInfo.offset = E.map(function(_) {
        return _.snapOffset;
      }), E.forEach(function(_, D) {
        _.snapSize;
      });
    }
  } else
    s.snapThresholdInfo = null;
}
function lv(t, e, r, n, a, i, o) {
  n === void 0 && (n = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, u = s.snapGridWidth, c = u === void 0 ? 0 : u, f = s.snapGridHeight, d = f === void 0 ? 0 : f, p = [], h = i.left, m = i.top, x = [0, 0];
  sv(t, n, a, i);
  var y = l.snapThresholdInfo, b = c, E = d;
  if (y && (c *= y.multiples[0] || 1, d *= y.multiples[1] || 1, x = y.offset), d) {
    for (var w = function(D) {
      p.push({
        type: "horizontal",
        pos: [
          h,
          xt(x[1] * E + D - a + m, 0.1)
        ],
        className: dt("grid-guideline"),
        size: e,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, _ = 0; _ <= r * 2; _ += d)
      w(_);
    for (var _ = -d; _ >= -r; _ -= d)
      w(_);
  }
  if (c) {
    for (var w = function(M) {
      p.push({
        type: "vertical",
        pos: [
          xt(x[0] * b + M - n + h, 0.1),
          m
        ],
        className: dt("grid-guideline"),
        size: r,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, _ = 0; _ <= e * 2; _ += c)
      w(_);
    for (var _ = -c; _ >= -e; _ -= c)
      w(_);
  }
  return p;
}
function Ou(t, e, r, n) {
  return r === "horizontal" ? H(t.right - e.left) <= n || H(t.left - e.right) <= n || t.left <= e.right && e.left <= t.right : r === "vertical" ? H(t.bottom - e.top) <= n || H(t.top - e.bottom) <= n || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function uv(t) {
  var e = t.state, r = t.props.elementGuidelines, n = r === void 0 ? [] : r;
  if (!n.length)
    return e.elementRects = [], [];
  var a = (e.elementRects || []).filter(function(d) {
    return !d.refresh;
  }), i = n.map(function(d) {
    return me(d) && "element" in d ? P(P({}, d), { element: Fe(d.element, !0) }) : {
      element: Fe(d, !0)
    };
  }).filter(function(d) {
    return d.element;
  }), o = Rr(a.map(function(d) {
    return d.element;
  }), i.map(function(d) {
    return d.element;
  })), s = o.maintained, l = o.added, u = [];
  s.forEach(function(d) {
    var p = N(d, 2), h = p[0], m = p[1];
    u[m] = a[h];
  }), cv(t, l.map(function(d) {
    return i[d];
  })).map(function(d, p) {
    u[l[p]] = d;
  }), e.elementRects = u;
  var c = xo(t.props.elementSnapDirections), f = [];
  return u.forEach(function(d) {
    var p = d.element, h = d.top, m = h === void 0 ? c.top : h, x = d.left, y = x === void 0 ? c.left : x, b = d.right, E = b === void 0 ? c.right : b, w = d.bottom, _ = w === void 0 ? c.bottom : w, D = d.center, M = D === void 0 ? c.center : D, g = d.middle, T = g === void 0 ? c.middle : g, k = d.className, z = d.rect, O = yo({
      top: m,
      right: E,
      left: y,
      bottom: _,
      center: M,
      middle: T
    }, z), R = O.horizontal, j = O.vertical, A = O.horizontalNames, W = O.verticalNames, X = z.top, L = z.left, q = z.right - L, V = z.bottom - X, F = [q, V];
    j.forEach(function(et, tt) {
      f.push({
        type: "vertical",
        element: p,
        pos: [
          xt(et, 0.1),
          X
        ],
        size: V,
        sizes: F,
        className: k,
        elementRect: d,
        elementDirection: Os[W[tt]] || W[tt],
        direction: ""
      });
    }), R.forEach(function(et, tt) {
      f.push({
        type: "horizontal",
        element: p,
        pos: [
          L,
          xt(et, 0.1)
        ],
        size: q,
        sizes: F,
        className: k,
        elementRect: d,
        elementDirection: Os[A[tt]] || A[tt],
        direction: ""
      });
    });
  }), f;
}
function Ys(t, e) {
  return t ? t.map(function(r) {
    var n = me(r) ? r : { pos: r }, a = n.pos;
    return gn(a) ? n : P(P({}, n), { pos: Ot(a, e) });
  }) : [];
}
function Nu(t, e, r, n, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, u = o.top, c = o.bottom, f = o.right, d = r + f - l, p = n + c - u;
  return Ys(t, p).forEach(function(h) {
    s.push({
      type: "horizontal",
      pos: [
        l,
        xt(h.pos - i + u, 0.1)
      ],
      size: d,
      className: h.className,
      direction: ""
    });
  }), Ys(e, d).forEach(function(h) {
    s.push({
      type: "vertical",
      pos: [
        xt(h.pos - a + l, 0.1),
        u
      ],
      size: p,
      className: h.className,
      direction: ""
    });
  }), s;
}
function cv(t, e) {
  if (!e.length)
    return [];
  var r = t.props.groupable, n = t.state, a = n.containerClientRect, i = n.rootMatrix, o = n.is3d, s = n.offsetDelta, l = o ? 4 : 3, u = N(Np(i, a, l), 2), c = u[0], f = u[1], d = r ? 0 : s[0], p = r ? 0 : s[1];
  return e.map(function(h) {
    var m = h.element.getBoundingClientRect(), x = m.left - c - d, y = m.top - f - p, b = y + m.height, E = x + m.width, w = N(Xr(i, [x, y], l), 2), _ = w[0], D = w[1], M = N(Xr(i, [E, b], l), 2), g = M[0], T = M[1];
    return P(P({}, h), { rect: {
      left: _,
      right: g,
      top: D,
      bottom: T,
      center: (_ + g) / 2,
      middle: (D + T) / 2
    } });
  });
}
function ta(t) {
  var e = t.state, r = e.container, n = t.props.snapContainer || r;
  if (e.snapContainer === n && e.guidelines && e.guidelines.length)
    return !1;
  var a = e.containerClientRect, i = {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  };
  if (r !== n) {
    var o = Fe(n, !0);
    if (o) {
      var s = dn(o), l = Us(e, [
        s.left - a.left,
        s.top - a.top
      ]), u = Us(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = xt(l[0], 1e-5), i.top = xt(l[1], 1e-5), i.right = xt(u[0], 1e-5), i.bottom = xt(u[1], 1e-5);
    }
  }
  return e.snapContainer = n, e.snapOffset = i, e.guidelines = Fi(t), e.enableSnap = !0, !0;
}
function zu(t, e, r, n, a, i) {
  var o = Cr(t, e, r, i ? 4 : 3), s = re(o, n);
  return wo(o, vt(a, s));
}
function Xs(t) {
  return t ? t / H(t) : 0;
}
function fv(t, e, r, n, a, i) {
  var o = i.fixedDirection, s = Bp(r, o, n), l = So(t, e, r, n), u = J(J([], N(Kp(t, e, s, n, a, i)), !1), N(Tu(t, l, i)), !1), c = ba(u, 0), f = ba(u, 1);
  return {
    width: {
      isBound: c.isBound,
      offset: c.offset[0]
    },
    height: {
      isBound: f.isBound,
      offset: f.offset[1]
    }
  };
}
function dv(t, e, r, n, a, i, o, s, l) {
  var u = re(e, o), c = za(t, s, {
    vertical: [u[0]],
    horizontal: [u[1]]
  }), f = c.horizontal.offset, d = c.vertical.offset;
  if (xt(d, Oi) || xt(f, Oi)) {
    var p = N(Le({
      datas: l,
      distX: -d,
      distY: -f
    }), 2), h = p[0], m = p[1], x = Math.min(a || 1 / 0, r + o[0] * h), y = Math.min(i || 1 / 0, n + o[1] * m);
    return [x - r, y - n];
  }
  return [0, 0];
}
function ju(t, e, r, n, a, i, o, s) {
  for (var l = ke(t.state), u = t.props.keepRatio, c = 0, f = 0, d = 0; d < 2; ++d) {
    var p = e(c, f), h = fv(t, p, a, u, o, s), m = h.width, x = h.height, y = m.isBound, b = x.isBound, E = m.offset, w = x.offset;
    if (d === 1 && (y || (E = 0), b || (w = 0)), d === 0 && o && !y && !b)
      return [0, 0];
    if (u) {
      var _ = H(E) * (r ? 1 / r : 1), D = H(w) * (n ? 1 / n : 1), M = y && b ? _ < D : b || !y && _ < D;
      M ? E = r * w / n : w = n * E / r;
    }
    c += E, f += w;
  }
  if (!u && a[0] && a[1]) {
    var g = Jp(t, l, a, i, s), T = g.maxWidth, k = g.maxHeight, z = N(dv(t, e(c, f).map(function(j) {
      return j.map(function(A) {
        return xt(A, Oi);
      });
    }), r + c, n + f, T, k, a, o, s), 2), E = z[0], w = z[1];
    c += E, f += w;
  }
  return [c, f];
}
function cn(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function pv(t, e) {
  e = cn(e);
  var r = Math.floor(t / 360), n = r * 360 + 360 - e, a = r * 360 + e;
  return H(t - n) < H(t - a) ? n : a;
}
function oi(t, e) {
  t = cn(t), e = cn(e);
  var r = cn(t - e);
  return Math.min(r, 360 - r);
}
function vv(t, e, r, n) {
  var a, i = t.props, o = (a = i[Su]) !== null && a !== void 0 ? a : 5, s = i[Cu];
  if (Ur(t, "rotatable")) {
    var l = e.pos1, u = e.pos2, c = e.pos3, f = e.pos4, d = e.origin, p = r * Math.PI / 180, h = [l, u, c, f].map(function(w) {
      return vt(w, d);
    }), m = h.map(function(w) {
      return Cn(w, p);
    }), x = J(J([], N(Ip(t, h, m, d, r)), !1), N(Xp(t, h, m, d, r)), !1);
    x.sort(function(w, _) {
      return H(w - r) - H(_ - r);
    });
    var y = x.length > 0;
    if (y)
      return {
        isSnap: y,
        dist: y ? x[0] : r
      };
  }
  if (s != null && s.length && o) {
    var b = s.slice().sort(function(w, _) {
      return oi(w, n) - oi(_, n);
    }), E = b[0];
    if (oi(E, n) <= o)
      return {
        isSnap: !0,
        dist: r + pv(n, E) - n
      };
  }
  return {
    isSnap: !1,
    dist: r
  };
}
function hv(t, e, r, n, a, i, o) {
  if (!Ur(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, u = t.state, c = u.allMatrix, f = u.is3d;
  return ju(t, function(d, p) {
    return zu(l || c, e + d, r + p, s, a, f);
  }, e, r, n, a, i, o);
}
function gv(t, e, r, n, a) {
  if (!Ur(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, u = a.is3d, c = ju(t, function(f, d) {
    return zu(hp(a, Tt(e, [f / i, d / o])), i, o, l, s, u);
  }, i, o, r, s, n, a);
  return [c[0] / i, c[1] / o];
}
function mv(t, e) {
  e.absolutePoses = ke(t.state);
}
function Hs(t) {
  var e = [];
  return t.forEach(function(r) {
    r.guidelineInfos.forEach(function(n) {
      var a = n.guideline;
      xe(e, function(i) {
        return i.guideline === a;
      }) || (a.direction = "", e.push({ guideline: a, posInfo: r }));
    });
  }), e.map(function(r) {
    var n = r.guideline, a = r.posInfo;
    return P(P({}, n), { direction: a.direction });
  });
}
function $s(t, e, r, n, a, i) {
  var o = mo(Oa(t, i), e, r), s = o.vertical, l = o.horizontal, u = Nr();
  s.forEach(function(h) {
    h.isBound && (h.direction === "start" && (u.left = !0), h.direction === "end" && (u.right = !0), n.push({
      type: "bounds",
      pos: h.pos
    }));
  }), l.forEach(function(h) {
    h.isBound && (h.direction === "start" && (u.top = !0), h.direction === "end" && (u.bottom = !0), a.push({
      type: "bounds",
      pos: h.pos
    }));
  });
  var c = Hp(t), f = c.boundMap, d = c.vertical, p = c.horizontal;
  return d.forEach(function(h) {
    Ve(n, function(m) {
      var x = m.type, y = m.pos;
      return x === "bounds" && y === h;
    }) >= 0 || n.push({
      type: "bounds",
      pos: h
    });
  }), p.forEach(function(h) {
    Ve(a, function(m) {
      var x = m.type, y = m.pos;
      return x === "bounds" && y === h;
    }) >= 0 || a.push({
      type: "bounds",
      pos: h
    });
  }), {
    boundMap: u,
    innerBoundMap: f
  };
}
var xv = Mo("", ["resizable", "scalable"]), yv = {
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
    Su,
    Cu,
    Eu,
    wu,
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
    var r = t.state, n = r.top, a = r.left, i = r.pos1, o = r.pos2, s = r.pos3, l = r.pos4, u = r.snapRenderInfo, c = t.props.snapRenderThreshold, f = c === void 0 ? 1 : c;
    if (!u || !u.render || !Ur(t, ""))
      return jr(t, "boundMap", Nr(), function(K) {
        return JSON.stringify(K);
      }), jr(t, "innerBoundMap", Nr(), function(K) {
        return JSON.stringify(K);
      }), [];
    r.guidelines = Fi(t);
    var d = Math.min(i[0], o[0], s[0], l[0]), p = Math.min(i[1], o[1], s[1], l[1]), h = u.externalPoses || [], m = ke(t.state), x = [], y = [], b = [], E = [], w = [], _ = De(m), D = _.width, M = _.height, g = _.top, T = _.left, k = _.bottom, z = _.right, O = { left: T, right: z, top: g, bottom: k, center: (T + z) / 2, middle: (g + k) / 2 }, R = h.length > 0, j = R ? De(h) : {};
    if (!u.request) {
      if (u.direction && w.push(Ap(t, m, u.direction, f, f)), u.snap) {
        var A = De(m);
        u.center && (A.middle = (A.top + A.bottom) / 2, A.center = (A.left + A.right) / 2), w.push(Ns(t, A, f, f));
      }
      R && (u.center && (j.middle = (j.top + j.bottom) / 2, j.center = (j.left + j.right) / 2), w.push(Ns(t, j, f, f))), w.forEach(function(K) {
        var nt = K.vertical.posInfos, Q = K.horizontal.posInfos;
        x.push.apply(x, J([], N(nt.filter(function(at) {
          var it = at.guidelineInfos;
          return it.some(function(mt) {
            var yt = mt.guideline;
            return !yt.hide;
          });
        }).map(function(at) {
          return {
            type: "snap",
            pos: at.pos
          };
        })), !1)), y.push.apply(y, J([], N(Q.filter(function(at) {
          var it = at.guidelineInfos;
          return it.some(function(mt) {
            var yt = mt.guideline;
            return !yt.hide;
          });
        }).map(function(at) {
          return {
            type: "snap",
            pos: at.pos
          };
        })), !1)), b.push.apply(b, J([], N(Hs(nt)), !1)), E.push.apply(E, J([], N(Hs(Q)), !1));
      });
    }
    var W = $s(t, [T, z], [g, k], x, y), X = W.boundMap, L = W.innerBoundMap;
    R && $s(t, [j.left, j.right], [j.top, j.bottom], x, y, u.externalBounds);
    var q = J(J([], N(b), !1), N(E), !1), V = q.filter(function(K) {
      return K.element && !K.gapRects;
    }), F = q.filter(function(K) {
      return K.gapRects;
    }).sort(function(K, nt) {
      return K.gap - nt.gap;
    });
    ct(t, "onSnap", {
      guidelines: q.filter(function(K) {
        var nt = K.element;
        return !nt;
      }),
      elements: V,
      gaps: F
    }, !0);
    var et = jr(t, "boundMap", X, function(K) {
      return JSON.stringify(K);
    }, Nr()), tt = jr(t, "innerBoundMap", L, function(K) {
      return JSON.stringify(K);
    }, Nr());
    return (X === et || L === tt) && ct(t, "onBound", {
      bounds: X,
      innerBounds: L
    }, !0), J(J(J(J(J(J([], N(av(t, V, [d, p], O, e)), !1), N(iv(t, F, [d, p], O, e)), !1), N(Ws(t, "horizontal", E, [a, n], O, e)), !1), N(Ws(t, "vertical", b, [a, n], O, e)), !1), N(Ls(t, "horizontal", y, d, n, D, 0, e)), !1), N(Ls(t, "vertical", x, p, a, M, 1, e)), !1);
  },
  dragStart: function(t, e) {
    t.state.snapRenderInfo = {
      request: e.isRequest,
      snap: !0,
      center: !0
    }, ta(t);
  },
  drag: function(t) {
    var e = t.state;
    ta(t) || (e.guidelines = Fi(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (xv(t, e) || Gi(t, e))
      return !0;
    if (!e.isRequest && e.inputEvent)
      return Qt(e.inputEvent.target, dt("snap-control"));
  },
  dragControlStart: function(t) {
    t.state.snapRenderInfo = null, ta(t);
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
    t.state.snapRenderInfo = null, ta(t);
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
function bv(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function dt() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return Yf.apply(void 0, J([po], N(t), !1));
}
function Au(t) {
  t();
}
function Sv(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : me(t) ? t : Gr(t);
}
function fn(t, e, r) {
  return ha(e, xr(r, e), t, xr(r.map(function(n) {
    return -n;
  }), e));
}
function Cv(t, e, r) {
  if (e === "%") {
    var n = Eo(t.ownerSVGElement);
    return n[r ? "width" : "height"] / 100;
  }
  return 1;
}
function Ev(t) {
  var e = wv(Do(t, ":before"));
  return e.map(function(r, n) {
    var a = gr(r), i = a.value, o = a.unit;
    return i * Cv(t, o, n === 0);
  });
}
function Ca(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function wv(t) {
  return Ca(t.transformOrigin);
}
function Bu(t) {
  var e = ve(t), r = e("transform");
  if (r && r !== "none")
    return r;
  if ("transform" in t) {
    var n = t.transform, a = n.baseVal;
    if (!a)
      return "";
    var i = a.length;
    if (!i)
      return "";
    for (var o = [], s = function(u) {
      var c = a[u].matrix;
      o.push("matrix(".concat(["a", "b", "c", "d", "e", "f"].map(function(f) {
        return c[f];
      }).join(", "), ")"));
    }, l = 0; l < i; ++l)
      s(l);
    return o.join(" ");
  }
  return "";
}
function bn(t, e, r, n, a) {
  var i, o, s = io(t) || sr(t), l = !1, u, c;
  if (!t || r)
    u = t;
  else {
    var f = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, d = t.parentElement;
    f ? (l = !0, c = d, u = f) : u = d;
  }
  for (var p = !1, h = t === e || u === e, m = "relative", x = 1, y = parseFloat(a == null ? void 0 : a("zoom")) || 1, b = a == null ? void 0 : a("position"); u && u !== s; ) {
    e === u && (h = !0);
    var E = ve(u), w = u.tagName.toLowerCase(), _ = Bu(u), D = E("willChange"), M = parseFloat(E("zoom")) || 1;
    if (m = E("position"), n && M !== 1) {
      x = M;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !r && n && y !== 1 && b && b !== "absolute" || w === "svg" || w === "foreignobject" || m !== "static" || _ && _ !== "none" || D === "transform"
    )
      break;
    var g = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, T = u.parentNode;
    g && (l = !0, c = T);
    var k = T;
    if (k && k.nodeType === 11) {
      u = k.host, p = !0, m = ve(u)("position");
      break;
    }
    u = k, m = "relative";
  }
  return {
    offsetZoom: x,
    hasSlot: l,
    parentSlotElement: c,
    isCustomElement: p,
    isStatic: m === "static",
    isEnd: h || !u || u === s,
    offsetParent: u || s
  };
}
function Dv(t, e) {
  var r, n = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = ve(t), s = to(a), l = !s, u, c;
  return !l && (n !== "svg" || t.ownerSVGElement) ? (u = au ? Ev(t) : Ca(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), c = u.slice(), l = !0, n === "svg" ? (a = 0, i = 0) : (r = N(kv(t, u, t === e && e.tagName.toLowerCase() === "g"), 4), a = r[0], i = r[1], u[0] = r[2], u[1] = r[3])) : (u = Ca(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), c = u.slice()), {
    tagName: n,
    isSVG: s,
    hasOffset: l,
    offset: [a || 0, i || 0],
    origin: u,
    targetOrigin: c
  };
}
function Gu(t, e) {
  var r = ve(t), n = ve(sr(t)), a = n("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(n("marginLeft"), 10), o = parseInt(n("marginTop"), 10);
  return r("position") === "absolute" && ((r("top") !== "auto" || r("bottom") !== "auto") && (o = 0), (r("left") !== "auto" || r("right") !== "auto") && (i = 0)), [i, o];
}
function Li(t) {
  t.forEach(function(e) {
    var r = e.matrix;
    r && (e.matrix = Ne(r, 3, 4));
  });
}
function _v(t) {
  for (var e = t.parentElement, r = !1, n = sr(t); e; ) {
    var a = Do(e).transform;
    if (a && a !== "none") {
      r = !0;
      break;
    }
    if (e === n)
      break;
    e = e.parentElement;
  }
  return {
    fixedContainer: e || n,
    hasTransform: r
  };
}
function ja(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(Vl(t, !e).join(","), ")");
}
function Eo(t) {
  var e = t.clientWidth, r = t.clientHeight;
  if (!t)
    return { x: 0, y: 0, width: 0, height: 0, clientWidth: e, clientHeight: r };
  var n = t.viewBox, a = n && n.baseVal || { x: 0, y: 0, width: 0, height: 0 };
  return {
    x: a.x,
    y: a.y,
    width: a.width || e,
    height: a.height || r,
    clientWidth: e,
    clientHeight: r
  };
}
function Mv(t, e) {
  var r, n = Eo(t), a = n.width, i = n.height, o = n.clientWidth, s = n.clientHeight, l = o / a, u = s / i, c = t.preserveAspectRatio.baseVal, f = c.align, d = c.meetOrSlice, p = [0, 0], h = [l, u], m = [0, 0];
  if (f !== 1) {
    var x = (f - 2) % 3, y = Math.floor((f - 2) / 3);
    p[0] = a * x / 2, p[1] = i * y / 2;
    var b = d === 2 ? Math.max(u, l) : Math.min(l, u);
    h[0] = b, h[1] = b, m[0] = (o - a) / 2 * x, m[1] = (s - i) / 2 * y;
  }
  var E = oo(h, e);
  return r = N(m, 2), E[e * (e - 1)] = r[0], E[e * (e - 1) + 1] = r[1], fn(E, e, p);
}
function kv(t, e, r) {
  var n = t.tagName.toLowerCase();
  if (!t.getBBox || !r && n === "g")
    return [0, 0, 0, 0];
  var a = ve(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = Eo(t.ownerSVGElement), l = o.x, u = o.y;
  n === "foreignobject" && !l && !u && (l = parseFloat(t.getAttribute("x")) || 0, u = parseFloat(t.getAttribute("y")) || 0);
  var c = l - s.x, f = u - s.y, d = i ? e[0] : e[0] - c, p = i ? e[1] : e[1] - f;
  return [c, f, d, p];
}
function Bt(t, e, r) {
  return se(t, mr(e, r), r);
}
function Cr(t, e, r, n) {
  return [[0, 0], [e, 0], [0, r], [e, r]].map(function(a) {
    return Bt(t, a, n);
  });
}
function De(t) {
  var e = t.map(function(u) {
    return u[0];
  }), r = t.map(function(u) {
    return u[1];
  }), n = Math.min.apply(Math, J([], N(e), !1)), a = Math.min.apply(Math, J([], N(r), !1)), i = Math.max.apply(Math, J([], N(e), !1)), o = Math.max.apply(Math, J([], N(r), !1)), s = i - n, l = o - a;
  return {
    left: n,
    top: a,
    right: i,
    bottom: o,
    width: s,
    height: l
  };
}
function qs(t, e, r, n) {
  var a = Cr(t, e, r, n);
  return De(a);
}
function Tv(t, e, r, n, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, u = Lu(o), c = u.offsetWidth, f = u.offsetHeight, d = r.getBoundingClientRect(), p = [0, 0];
  r === sr(r) && (p = Gu(o, !0));
  for (var h = o.getBoundingClientRect(), m = h.left - d.left + r.scrollLeft - (r.clientLeft || 0) + p[0], x = h.top - d.top + r.scrollTop - (r.clientTop || 0) + p[1], y = h.width, b = h.height, E = ha(n, a, l), w = qs(E, c, f, n), _ = w.left, D = w.top, M = w.width, g = w.height, T = Bt(E, s, n), k = vt(T, [_, D]), z = [
    m + k[0] * y / M,
    x + k[1] * b / g
  ], O = [0, 0], R = 0; ++R < 10; ) {
    var j = Oe(a, n);
    i = N(vt(Bt(j, z, n), Bt(j, T, n)), 2), O[0] = i[0], O[1] = i[1];
    var A = ha(n, a, xr(O, n), l), W = qs(A, c, f, n), X = W.left, L = W.top, q = X - m, V = L - x;
    if (H(q) < 2 && H(V) < 2)
      break;
    z[0] -= q, z[1] -= V;
  }
  return O.map(function(F) {
    return Math.round(F);
  });
}
function Iv(t, e, r) {
  var n = t.length === 16, a = n ? 4 : 3, i = e.map(function(l) {
    return Bt(t, l, a);
  }), o = r.left, s = r.top;
  return i.map(function(l) {
    return [l[0] + o, l[1] + s];
  });
}
function Me(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
}
function Fu(t, e) {
  return Me([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function on(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = Xt(t, e));
  var a = Fu(t, e);
  return {
    transform: "translateY(-50%) translate(".concat(t[0], "px, ").concat(t[1], "px) rotate(").concat(n, "rad) scaleY(").concat(r, ")"),
    width: "".concat(a, "px")
  };
}
function Ea(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  var a = r.length, i = r.reduce(function(s, l) {
    return s + l[0];
  }, 0) / a, o = r.reduce(function(s, l) {
    return s + l[1];
  }, 0) / a;
  return {
    transform: "translateZ(0px) translate(".concat(i, "px, ").concat(o, "px) rotate(").concat(t, "rad) scale(").concat(e, ")")
  };
}
function br(t, e) {
  var r = t[e];
  return me(r) ? P(P({}, t), r) : t;
}
function Lu(t) {
  var e = t && !to(t.offsetWidth), r = 0, n = 0, a = 0, i = 0, o = 0, s = 0, l = 0, u = 0, c = 0, f = 0, d = 0, p = 0, h = 1 / 0, m = 1 / 0, x = 1 / 0, y = 1 / 0, b = 0, E = 0, w = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var _ = t.getBBox();
      w = !0, r = _.width, n = _.height, o = r, s = n, l = r, u = n, a = r, i = n;
    } else {
      var D = ve(t), M = t.style, g = D("boxSizing") === "border-box", T = parseFloat(D("borderLeftWidth")) || 0, k = parseFloat(D("borderRightWidth")) || 0, z = parseFloat(D("borderTopWidth")) || 0, O = parseFloat(D("borderBottomWidth")) || 0, R = parseFloat(D("paddingLeft")) || 0, j = parseFloat(D("paddingRight")) || 0, A = parseFloat(D("paddingTop")) || 0, W = parseFloat(D("paddingBottom")) || 0, X = R + j, L = A + W, q = T + k, V = z + O, F = X + q, et = L + V, tt = D("position"), K = 0, nt = 0;
      if ("clientLeft" in t) {
        var Q = null;
        if (tt === "absolute") {
          var at = bn(t, sr(t));
          Q = at.offsetParent;
        } else
          Q = t.parentElement;
        if (Q) {
          var it = ve(Q);
          K = parseFloat(it("width")), nt = parseFloat(it("height"));
        }
      }
      c = Math.max(X, Ot(D("minWidth"), K) || 0), f = Math.max(L, Ot(D("minHeight"), nt) || 0), h = Ot(D("maxWidth"), K), m = Ot(D("maxHeight"), nt), isNaN(h) && (h = 1 / 0), isNaN(m) && (m = 1 / 0), b = Ot(M.width, 0) || 0, E = Ot(M.height, 0) || 0, o = parseFloat(D("width")) || 0, s = parseFloat(D("height")) || 0, l = H(o - b) < 1 ? va(c, b || o, h) : o, u = H(s - E) < 1 ? va(f, E || s, m) : s, r = l, n = u, a = l, i = u, g ? (x = h, y = m, d = c, p = f, l = r - F, u = n - et) : (x = h + F, y = m + et, d = c + F, p = f + et, r = l + F, n = u + et), a = l + X, i = u + L;
    }
  return {
    svg: w,
    offsetWidth: r,
    offsetHeight: n,
    clientWidth: a,
    clientHeight: i,
    contentWidth: l,
    contentHeight: u,
    inlineCSSWidth: b,
    inlineCSSHeight: E,
    cssWidth: o,
    cssHeight: s,
    minWidth: c,
    minHeight: f,
    maxWidth: h,
    maxHeight: m,
    minOffsetWidth: d,
    minOffsetHeight: p,
    maxOffsetWidth: x,
    maxOffsetHeight: y
  };
}
function Wu(t, e) {
  return Xt(e > 0 ? t[0] : t[1], e > 0 ? t[1] : t[0]);
}
function ea() {
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
function Yu(t, e) {
  var r = t === sr(t) || t === io(t), n = {
    clientLeft: t.clientLeft,
    clientTop: t.clientTop,
    clientWidth: t.clientWidth,
    clientHeight: t.clientHeight,
    scrollWidth: t.scrollWidth,
    scrollHeight: t.scrollHeight,
    overflow: !1
  };
  return r && (n.clientHeight = Math.max(e.height, n.clientHeight), n.scrollHeight = Math.max(e.height, n.scrollHeight)), n.overflow = ve(t)("overflow") !== "visible", P(P({}, e), n);
}
function si(t, e, r, n) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, u = e.left, c = {
    left: u + a,
    top: l + o,
    right: u + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return r && n ? Yu(r, c) : c;
}
function dn(t, e) {
  var r = 0, n = 0, a = 0, i = 0;
  if (t) {
    var o = t.getBoundingClientRect();
    r = o.left, n = o.top, a = o.width, i = o.height;
  }
  var s = {
    left: r,
    top: n,
    width: a,
    height: i,
    right: r + a,
    bottom: n + i
  };
  return t && e ? Yu(t, s) : s;
}
function Rv(t) {
  var e = t.props, r = e.groupable, n = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !r && s && n ? To(n, i, o) : l;
}
function Xu(t, e, r, n) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = r.target;
    a = Hu(i, n);
  }
  return a;
}
function Hu(t, e) {
  if (t) {
    var r = t.getAttribute("data-rotation") || "", n = t.getAttribute("data-direction");
    if (e.deg = r, !!n) {
      var a = [0, 0];
      return n.indexOf("w") > -1 && (a[0] = -1), n.indexOf("e") > -1 && (a[0] = 1), n.indexOf("n") > -1 && (a[1] = -1), n.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function wo(t, e) {
  return [
    Tt(e, t[0]),
    Tt(e, t[1]),
    Tt(e, t[2]),
    Tt(e, t[3])
  ];
}
function ke(t) {
  var e = t.left, r = t.top, n = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return wo([n, a, i, o], [e, r]);
}
function Wi(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(r) {
    r.unset && r.unset(t);
  });
}
function zr(t, e) {
  var r = e ? "controlGesto" : "targetGesto", n = t[r];
  (n == null ? void 0 : n.isIdle()) === !1 && Wi(t, e), n == null || n.unset(), t[r] = null;
}
function ce(t, e) {
  if (e) {
    var r = Vr(e);
    r.nextStyle = P(P({}, r.nextStyle), t);
  }
  return {
    style: t,
    cssText: $r(t).map(function(n) {
      return "".concat(ed(n, "-"), ": ").concat(t[n], ";");
    }).join("")
  };
}
function $u(t, e, r) {
  var n = e.afterTransform || e.transform;
  return P(P({}, ce(P(P(P({}, t.style), e.style), { transform: n }), r)), { afterTransform: n, transform: t.transform });
}
function Et(t, e, r, n) {
  var a = e.datas;
  a.datas || (a.datas = {});
  var i = P(P({}, r), { target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, moveable: t, datas: a.datas, isRequest: e.isRequest, isRequestChild: e.isRequestChild, isFirstDrag: !!e.isFirstDrag, isTrusted: e.isTrusted !== !1, stopAble: function() {
    a.isEventStart = !1;
  }, stopDrag: function() {
    var o;
    (o = e.stop) === null || o === void 0 || o.call(e);
  } });
  return a.isStartEvent ? n || (a.lastEvent = i) : a.isStartEvent = !0, i;
}
function ye(t, e, r) {
  var n = e.datas, a = "isDrag" in r ? r.isDrag : e.isDrag;
  return n.datas || (n.datas = {}), P(P({ isDrag: a }, r), { moveable: t, target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, lastEvent: n.lastEvent, isDouble: e.isDouble, datas: n.datas, isFirstDrag: !!e.isFirstDrag });
}
function Aa(t, e, r) {
  t._emitter.on(e, r);
}
function ct(t, e, r, n, a) {
  return t.triggerEvent(e, r, n, a);
}
function Do(t, e) {
  return we(t).getComputedStyle(t, e);
}
function ra(t, e, r) {
  var n = {}, a = {};
  return t.filter(function(i) {
    var o = i.name;
    if (n[o] || !e.some(function(s) {
      return i[s];
    }))
      return !1;
    if (!r && i.ableGroup) {
      if (a[i.ableGroup])
        return !1;
      a[i.ableGroup] = !0;
    }
    return n[o] = !0, !0;
  });
}
function Yi(t, e) {
  return t === e || t == null && e == null;
}
function Vs() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var r = t.length - 1, n = 0; n < r; ++n) {
    var a = t[n];
    if (!to(a))
      return a;
  }
  return t[r];
}
function qu(t, e) {
  var r = [], n = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n.indexOf(o), l = r[s] || [];
    s === -1 && (n.push(o), r.push(l)), l.push(a);
  }), r;
}
function Pv(t, e) {
  var r = [], n = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n[o];
    s || (s = [], n[o] = s, r.push(s)), s.push(a);
  }), r;
}
function Vu(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function Yr() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return t.sort(function(r, n) {
    return H(n) - H(r);
  }), t[0];
}
function Xr(t, e, r) {
  return se(Oe(t, r), mr(e, r), r);
}
function Ov(t, e) {
  var r, n = t.is3d, a = t.rootMatrix, i = n ? 4 : 3;
  return r = N(Xr(a, [e.distX, e.distY], i), 2), e.distX = r[0], e.distY = r[1], e;
}
function Ce(t, e, r, n) {
  if (!r[0] && !r[1])
    return e;
  var a = Bt(t, [Xs(r[0] || 1), 0], n), i = Bt(t, [0, Xs(r[1] || 1)], n), o = Bt(t, [
    r[0] / Me(a),
    r[1] / Me(i)
  ], n);
  return Tt(e, o);
}
function Ie(t, e, r) {
  return r ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function wa(t) {
  return H(t) <= fe ? 0 : t;
}
function _o(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var r = Cp(e, t), n = r.deg;
    return n ? dt("view-control-rotation".concat(n)) : "";
  };
}
function Mo(t, e) {
  return e === void 0 && (e = [t]), function(r, n) {
    if (n.isRequest)
      return e.some(function(i) {
        return n.requestAble === i;
      }) ? n.parentDirection : !1;
    var a = n.inputEvent.target;
    return Qt(a, dt("direction")) && (!t || Qt(a, dt(t)));
  };
}
function Nv(t, e, r) {
  var n, a = Fr(t, {
    "x%": function(_) {
      return _ / 100 * e.offsetWidth;
    },
    "y%": function(_) {
      return _ / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, r < 0 ? void 0 : r), o = t.slice(0, r < 0 ? void 0 : r + 1), s = t[r] || "", l = r < 0 ? [] : t.slice(r), u = r < 0 ? [] : t.slice(r + 1), c = a.slice(0, r < 0 ? void 0 : r), f = a.slice(0, r < 0 ? void 0 : r + 1), d = (n = a[r]) !== null && n !== void 0 ? n : Fr([""])[0], p = r < 0 ? [] : a.slice(r), h = r < 0 ? [] : a.slice(r + 1), m = d ? [d] : [], x = Ir(c), y = Ir(f), b = Ir(p), E = Ir(h), w = Nt(x, b, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: x,
    beforeFunctionMatrix2: y,
    targetFunctionMatrix: Ir(m),
    afterFunctionMatrix: b,
    afterFunctionMatrix2: E,
    allFunctionMatrix: w,
    beforeFunctions: c,
    beforeFunctions2: f,
    targetFunction: m[0],
    afterFunctions: p,
    afterFunctions2: h,
    beforeFunctionTexts: i,
    beforeFunctionTexts2: o,
    targetFunctionText: s,
    afterFunctionTexts: l,
    afterFunctionTexts2: u
  };
}
function zv(t) {
  return !t || !me(t) || xn(t) ? !1 : Yt(t) || "length" in t;
}
function Fe(t, e) {
  return t ? xn(t) ? t : _e(t) ? e ? document.querySelector(t) : t : ka(t) ? t() : Hl(t) ? t : "current" in t ? t.current : t : null;
}
function ko(t, e) {
  if (!t)
    return [];
  var r = zv(t) ? [].slice.call(t) : [t];
  return r.reduce(function(n, a) {
    return _e(a) && e ? J(J([], N(n), !1), N([].slice.call(document.querySelectorAll(a))), !1) : (Yt(a) ? n.push(ko(a, e)) : n.push(Fe(a, e)), n);
  }, []);
}
function jv(t, e, r) {
  var n = Xt(t, e) / Math.PI * 180;
  return n = r >= 0 ? n : 180 - n, n = n >= 0 ? n : 360 + n, n;
}
function Us(t, e) {
  var r = t.rootMatrix, n = t.is3d, a = n ? 4 : 3, i = Oe(r, a);
  return n || (i = Ne(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, ca(i, e);
}
function Uu(t, e, r, n, a) {
  var i = N(t, 2), o = i[0], s = i[1], l = 0, u = 0;
  if (a && o && s) {
    var c = Xt([0, 0], e), f = Xt([0, 0], n), d = Me(e), p = Math.cos(c - f) * d;
    if (!n[0])
      u = p, l = u * r;
    else if (!n[1])
      l = p, u = l / r;
    else {
      var h = n[0] * o, m = n[1] * s, x = Math.atan2(h + e[0], m + e[1]), y = Math.atan2(h, m);
      x < 0 && (x += Math.PI * 2), y < 0 && (y += Math.PI * 2);
      var b = 0;
      H(x - y) < Math.PI / 2 || H(x - y) > Math.PI / 2 * 3 || (y += Math.PI), b = x - y, b > Math.PI * 2 ? b -= Math.PI * 2 : b > Math.PI ? b = 2 * Math.PI - b : b < -Math.PI && (b = -2 * Math.PI - b);
      var E = Me([h + e[0], m + e[1]]) * Math.cos(b);
      l = E * Math.sin(y) - h, u = E * Math.cos(y) - m, n[0] < 0 && (l *= -1), n[1] < 0 && (u *= -1);
    }
  } else
    l = n[0] * e[0], u = n[1] * e[1];
  return [l, u];
}
function Ku(t, e, r, n) {
  var a, i = r.ratio, o = r.startOffsetWidth, s = r.startOffsetHeight, l = 0, u = 0, c = n.distX, f = n.distY, d = n.pinchScale, p = n.parentDistance, h = n.parentDist, m = n.parentScale, x = r.fixedDirection, y = [0, 1].map(function(M) {
    return H(t[M] - x[M]);
  }), b = [0, 1].map(function(M) {
    var g = y[M];
    return g !== 0 && (g = 2 / g), g;
  });
  if (h)
    l = h[0], u = h[1], e && (l ? u || (u = l / i) : l = u * i);
  else if (gn(d))
    l = (d - 1) * o, u = (d - 1) * s;
  else if (m)
    l = (m[0] - 1) * o, u = (m[1] - 1) * s;
  else if (p) {
    var E = o * y[0], w = s * y[1], _ = Me([E, w]);
    l = p / _ * E * b[0], u = p / _ * w * b[1];
  } else {
    var D = Le({ datas: r, distX: c, distY: f });
    D = b.map(function(M, g) {
      return D[g] * M;
    }), a = N(Uu([o, s], D, i, t, e), 2), l = a[0], u = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: u
  };
}
function Xi(t, e) {
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
    var r = N(t.split(" "), 2), n = r[0], a = r[1], i = Xi(n || ""), o = Xi(a || ""), s = P(P({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function To(t, e, r) {
  var n = Xi(t, !0), a = n.x, i = n.y;
  return [
    Ot(a, e) || 0,
    Ot(i, r) || 0
  ];
}
function Av(t, e, r) {
  var n = t.map(function(i) {
    return vt(i, e);
  }), a = n.map(function(i) {
    return Cn(i, r);
  });
  return {
    prev: n,
    next: a,
    result: a.map(function(i) {
      return Tt(i, e);
    })
  };
}
function Zu(t, e) {
  return t.length === e.length && t.every(function(r, n) {
    var a = e[n], i = Yt(r), o = Yt(a);
    return i && o ? Zu(r, a) : !i && !o ? r === a : !1;
  });
}
function jr(t, e, r, n, a) {
  var i = t._store, o = i[e];
  if (!(e in i))
    if (a != null)
      i[e] = a, o = a;
    else
      return i[e] = r, r;
  return o === r || n(o) === n(r) ? o : (i[e] = r, r);
}
function ue(t) {
  return t >= 0 ? 1 : -1;
}
function H(t) {
  return Math.abs(t);
}
function li(t, e) {
  return id(t).map(function(r) {
    return e(r);
  });
}
function Ju(t) {
  return gn(t) ? {
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
var Bv = _n("pinchable", {
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
    var r = e.datas, n = e.targets, a = e.angle, i = e.originalDatas, o = t.props, s = o.pinchable, l = o.ables;
    if (!s)
      return !1;
    var u = "onPinch".concat(n ? "Group" : "", "Start"), c = "drag".concat(n ? "Group" : "", "ControlStart"), f = (s === !0 ? t.controlAbles : l.filter(function(m) {
      return s.indexOf(m.name) > -1;
    })).filter(function(m) {
      return m.canPinch && m[c];
    }), d = Et(t, e, {});
    n && (d.targets = n);
    var p = ct(t, u, d);
    r.isPinch = p !== !1, r.ables = f;
    var h = r.isPinch;
    return h ? (f.forEach(function(m) {
      if (i[m.name] = i[m.name] || {}, !!m[c]) {
        var x = P(P({}, e), { datas: i[m.name], parentRotate: a, isPinch: !0 });
        m[c](t, x);
      }
    }), t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: [0, 0]
    }, h) : !1;
  },
  pinch: function(t, e) {
    var r = e.datas, n = e.scale, a = e.distance, i = e.originalDatas, o = e.inputEvent, s = e.targets, l = e.angle;
    if (r.isPinch) {
      var u = a * (1 - 1 / n), c = Et(t, e, {});
      s && (c.targets = s);
      var f = "onPinch".concat(s ? "Group" : "");
      ct(t, f, c);
      var d = r.ables, p = "drag".concat(s ? "Group" : "", "Control");
      return d.forEach(function(h) {
        h[p] && h[p](t, P(P({}, e), { datas: i[h.name], inputEvent: o, resolveMatrix: !0, pinchScale: n, parentDistance: u, parentRotate: l, isPinch: !0 }));
      }), c;
    }
  },
  pinchEnd: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.targets, o = e.originalDatas;
    if (r.isPinch) {
      var s = "onPinch".concat(i ? "Group" : "", "End"), l = ye(t, e, { isDrag: n });
      i && (l.targets = i), ct(t, s, l);
      var u = r.ables, c = "drag".concat(i ? "Group" : "", "ControlEnd");
      return u.forEach(function(f) {
        f[c] && f[c](t, P(P({}, e), { isDrag: n, datas: o[f.name], inputEvent: a, isPinch: !0 }));
      }), n;
    }
  },
  pinchGroupStart: function(t, e) {
    return this.pinchStart(t, P(P({}, e), { targets: t.props.targets }));
  },
  pinchGroup: function(t, e) {
    return this.pinch(t, P(P({}, e), { targets: t.props.targets }));
  },
  pinchGroupEnd: function(t, e) {
    return this.pinchEnd(t, P(P({}, e), { targets: t.props.targets }));
  }
}), Ks = Mo("scalable"), Gv = {
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
  render: xu("scalable"),
  dragControlCondition: Ks,
  viewClassName: _o("scalable"),
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = Xu(i, n, a, r), s = t.state, l = s.width, u = s.height, c = s.targetTransform, f = s.target, d = s.pos1, p = s.pos2, h = s.pos4;
    if (!o || !f)
      return !1;
    n || Sr(t, e), r.datas = {}, r.transform = c, r.prevDist = [1, 1], r.direction = o, r.startOffsetWidth = l, r.startOffsetHeight = u, r.startValue = [1, 1];
    var m = !o[0] && !o[1] || o[0] || !o[1];
    Pa(t, e, "scale"), r.isWidth = m;
    function x(D) {
      r.ratio = D && isFinite(D) ? D : 0;
    }
    r.startPositions = ke(t.state);
    function y(D) {
      var M = Iu(r.startPositions, D);
      r.fixedDirection = M.fixedDirection, r.fixedPosition = M.fixedPosition, r.fixedOffset = M.fixedOffset;
    }
    r.setFixedDirection = y, x(Ge(d, p) / Ge(p, h)), y([-o[0], -o[1]]);
    var b = function(D) {
      r.minScaleSize = D;
    }, E = function(D) {
      r.maxScaleSize = D;
    };
    b([-1 / 0, -1 / 0]), E([1 / 0, 1 / 0]);
    var w = Et(t, e, P(P({ direction: o, set: function(D) {
      r.startValue = D;
    }, setRatio: x, setFixedDirection: y, setMinScaleSize: b, setMaxScaleSize: E }, Ra(t, e)), { dragStart: le.dragStart(t, new Lr().dragStart([0, 0], e)) })), _ = ct(t, "onScaleStart", w);
    return r.startFixedDirection = r.fixedDirection, _ !== !1 && (r.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), r.isScale ? w : !1;
  },
  dragControl: function(t, e) {
    Ta(t, e, "scale");
    var r = e.datas, n = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, u = e.resolveMatrix, c = r.prevDist, f = r.direction, d = r.startOffsetWidth, p = r.startOffsetHeight, h = r.isScale, m = r.startValue, x = r.isWidth, y = r.ratio;
    if (!h)
      return !1;
    var b = t.props, E = b.throttleScale, w = b.parentMoveable, _ = f;
    !f[0] && !f[1] && (_ = [1, 1]);
    var D = y && (n ?? b.keepRatio) || !1, M = t.state, g = [
      m[0],
      m[1]
    ];
    function T() {
      var Z = Ku(_, D, r, e), ut = Z.distWidth, Ct = Z.distHeight, pt = d ? (d + ut) / d : 1, ht = p ? (p + Ct) / p : 1;
      m[0] || (g[0] = ut / d), m[1] || (g[1] = Ct / p);
      var bt = (_[0] || D ? pt : 1) * g[0], gt = (_[1] || D ? ht : 1) * g[1];
      return bt === 0 && (bt = ue(c[0]) * Zn), gt === 0 && (gt = ue(c[1]) * Zn), [bt, gt];
    }
    var k = T();
    if (!i && t.props.groupable) {
      var z = M.snapRenderInfo || {}, O = z.direction;
      Yt(O) && (O[0] || O[1]) && (M.snapRenderInfo = { direction: f, request: e.isRequest });
    }
    ct(t, "onBeforeScale", Et(t, e, {
      scale: k,
      setFixedDirection: function(Z) {
        return r.setFixedDirection(Z), k = T(), k;
      },
      startFixedDirection: r.startFixedDirection,
      setScale: function(Z) {
        k = Z;
      }
    }, !0));
    var R = [
      k[0] / g[0],
      k[1] / g[1]
    ], j = o, A = [0, 0], W = ue(R[0] * R[1]), X = !o && !a && i;
    if (X || u ? j = go(t, r.targetAllTransform, [0, 0], [0, 0], r) : o || (j = r.fixedPosition), i || (A = gv(t, R, f, !l && s, r)), D) {
      _[0] && _[1] && A[0] && A[1] && (Math.abs(A[0] * d) > Math.abs(A[1] * p) ? A[1] = 0 : A[0] = 0);
      var L = !A[0] && !A[1];
      if (L && (x ? R[0] = xt(R[0] * g[0], E) / g[0] : R[1] = xt(R[1] * g[1], E) / g[1]), _[0] && !_[1] || A[0] && !A[1] || L && x) {
        R[0] += A[0];
        var q = d * R[0] * g[0] / y;
        R[1] = ue(W * R[0]) * H(q / p / g[1]);
      } else if (!_[0] && _[1] || !A[0] && A[1] || L && !x) {
        R[1] += A[1];
        var V = p * R[1] * g[1] * y;
        R[0] = ue(W * R[1]) * H(V / d / g[0]);
      }
    } else
      R[0] += A[0], R[1] += A[1], A[0] || (R[0] = xt(R[0] * g[0], E) / g[0]), A[1] || (R[1] = xt(R[1] * g[1], E) / g[1]);
    R[0] === 0 && (R[0] = ue(c[0]) * Zn), R[1] === 0 && (R[1] = ue(c[1]) * Zn), k = bv(R, [g[0], g[1]]);
    var F = [
      d,
      p
    ], et = [
      d * k[0],
      p * k[1]
    ];
    et = no(et, r.minScaleSize, r.maxScaleSize, D ? y : !1), k = li(2, function(Z) {
      return F[Z] ? et[Z] / F[Z] : et[Z];
    }), R = li(2, function(Z) {
      return k[Z] / g[Z];
    });
    var tt = li(2, function(Z) {
      return c[Z] ? R[Z] / c[Z] : R[Z];
    }), K = "scale(".concat(R.join(", "), ")"), nt = "scale(".concat(k.join(", "), ")"), Q = Ia(r, nt, K), at = !m[0] || !m[1], it = gp(t, at ? nt : K, r.fixedDirection, j, r.fixedOffset, r, at), mt = X ? it : vt(it, r.prevInverseDist || [0, 0]);
    if (r.prevDist = R, r.prevInverseDist = it, k[0] === c[0] && k[1] === c[1] && mt.every(function(Z) {
      return !Z;
    }) && !w && !X)
      return !1;
    var yt = Et(t, e, P({ offsetWidth: d, offsetHeight: p, direction: f, scale: k, dist: R, delta: tt, isPinch: !!i }, du(t, Q, mt, i, e)));
    return ct(t, "onScale", yt), yt;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (!r.isScale)
      return !1;
    r.isScale = !1;
    var n = ye(t, e, {});
    return ct(t, "onScaleEnd", n), n;
  },
  dragGroupControlCondition: Ks,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var a = Pe(t, "resizable", e);
    r.moveableScale = t.scale;
    var i = qe(t, this, "dragControlStart", e, function(u, c) {
      return ya(t, u, r, c);
    }), o = function(u) {
      n.setFixedDirection(u), i.forEach(function(c, f) {
        c.setFixedDirection(u), ya(t, c.moveable, r, a[f]);
      });
    };
    r.setFixedDirection = o;
    var s = P(P({}, n), { targets: t.props.targets, events: i, setFixedDirection: o }), l = ct(t, "onScaleGroupStart", s);
    return r.isScale = l !== !1, r.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isScale) {
      Aa(t, "onBeforeScale", function(c) {
        ct(t, "onBeforeScaleGroup", Et(t, e, P(P({}, c), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = n.dist, i = r.moveableScale;
        t.scale = [
          a[0] * i[0],
          a[1] * i[1]
        ];
        var o = t.props.keepRatio, s = r.fixedPosition, l = qe(t, this, "dragControl", e, function(c, f) {
          var d = N(se(En(t.rotation / 180 * Math.PI, 3), [
            f.datas.originalX * a[0],
            f.datas.originalY * a[1],
            1
          ], 3), 2), p = d[0], h = d[1];
          return P(P({}, f), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: Tt(s, [p, h])
          });
        }), u = P({ targets: t.props.targets, events: l }, n);
        return ct(t, "onScaleGroup", u), u;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isScale) {
      this.dragControlEnd(t, e);
      var a = qe(t, this, "dragControlEnd", e), i = ye(t, e, {
        targets: t.props.targets,
        events: a
      });
      return ct(t, "onScaleGroupEnd", i), r;
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
    var t = {}, e = 0, r = 0, n = !1;
    return {
      isControl: !0,
      requestStart: function(a) {
        return n = a.useSnap, {
          datas: t,
          parentDirection: a.direction || [1, 1],
          useSnap: n
        };
      },
      request: function(a) {
        return e += a.deltaWidth, r += a.deltaHeight, {
          datas: t,
          parentDist: [e, r],
          parentKeepRatio: a.keepRatio,
          useSnap: n
        };
      },
      requestEnd: function() {
        return { datas: t, isDrag: !0, useSnap: n };
      }
    };
  }
};
function tr(t, e) {
  return t.map(function(r, n) {
    return pa(r, e[n], 1, 2);
  });
}
function Zs(t, e, r) {
  var n = Xt(t, e), a = Xt(t, r), i = a - n;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function Fv(t, e) {
  var r = Zs(t[0], t[1], t[2]), n = Zs(e[0], e[1], e[2]), a = Math.PI;
  return !(r >= a && n <= a || r <= a && n >= a);
}
var Lv = {
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
  viewClassName: _o("warpable"),
  render: function(t, e) {
    var r = t.props, n = r.resizable, a = r.scalable, i = r.warpable, o = r.zoom;
    if (n || a || !i)
      return [];
    var s = t.state, l = s.pos1, u = s.pos2, c = s.pos3, f = s.pos4, d = tr(l, u), p = tr(u, l), h = tr(l, c), m = tr(c, l), x = tr(c, f), y = tr(f, c), b = tr(u, f), E = tr(f, u);
    return J([
      e.createElement("div", { className: dt("line"), key: "middeLine1", style: on(d, x, o) }),
      e.createElement("div", { className: dt("line"), key: "middeLine2", style: on(p, y, o) }),
      e.createElement("div", { className: dt("line"), key: "middeLine3", style: on(h, b, o) }),
      e.createElement("div", { className: dt("line"), key: "middeLine4", style: on(m, E, o) })
    ], N(yu(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var r = e.inputEvent.target;
    return Qt(r, dt("direction")) && Qt(r, dt("warpable"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.inputEvent, a = t.props.target, i = n.target, o = Hu(i, r);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, u = s.is3d, c = s.targetTransform, f = s.targetMatrix, d = s.width, p = s.height, h = s.left, m = s.top;
    r.datas = {}, r.targetTransform = c, r.warpTargetMatrix = u ? f : Ne(f, 3, 4), r.targetInverseMatrix = $l(Oe(r.warpTargetMatrix, 4), 3, 4), r.direction = o, r.left = h, r.top = m, r.poses = [
      [0, 0],
      [d, 0],
      [0, p],
      [d, p]
    ].map(function(b) {
      return vt(b, l);
    }), r.nextPoses = r.poses.map(function(b) {
      var E = N(b, 2), w = E[0], _ = E[1];
      return se(r.warpTargetMatrix, [w, _, 0, 1], 4);
    }), r.startValue = zt(4), r.prevMatrix = zt(4), r.absolutePoses = ke(s), r.posIndexes = fu(o), Sr(t, e), Pa(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var x = Et(t, e, P({ set: function(b) {
      r.startValue = b;
    } }, Ra(t, e))), y = ct(t, "onWarpStart", x);
    return y !== !1 && (r.isWarp = !0), r.isWarp;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isRequest, a = e.distX, i = e.distY, o = r.targetInverseMatrix, s = r.prevMatrix, l = r.isWarp, u = r.startValue, c = r.poses, f = r.posIndexes, d = r.absolutePoses;
    if (!l)
      return !1;
    if (Ta(t, e, "matrix3d"), Ur(t, "warpable")) {
      var p = f.map(function(T) {
        return d[T];
      });
      p.length > 1 && p.push([
        (p[0][0] + p[1][0]) / 2,
        (p[0][1] + p[1][1]) / 2
      ]);
      var h = za(t, n, {
        horizontal: p.map(function(T) {
          return T[1] + i;
        }),
        vertical: p.map(function(T) {
          return T[0] + a;
        })
      }), m = h.horizontal, x = h.vertical;
      i -= m.offset, a -= x.offset;
    }
    var y = Le({ datas: r, distX: a, distY: i }, !0), b = r.nextPoses.slice();
    if (f.forEach(function(T) {
      b[T] = Tt(b[T], y);
    }), !ip.every(function(T) {
      return Fv(T.map(function(k) {
        return c[k];
      }), T.map(function(k) {
        return b[k];
      }));
    }))
      return !1;
    var E = so(c[0], c[2], c[1], c[3], b[0], b[2], b[1], b[3]);
    if (!E.length)
      return !1;
    var w = Nt(o, E, 4), _ = uu(r, w, !0), D = Nt(Oe(s, 4), _, 4);
    r.prevMatrix = _;
    var M = Nt(u, _, 4), g = Ia(r, "matrix3d(".concat(M.join(", "), ")"), "matrix3d(".concat(_.join(", "), ")"));
    return ho(e, g), ct(t, "onWarp", Et(t, e, P({ delta: D, matrix: M, dist: _, multiply: Nt, transform: g }, ce({
      transform: g
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.isDrag;
    return r.isWarp ? (r.isWarp = !1, ct(t, "onWarpEnd", ye(t, e, {})), n) : !1;
  }
}, Wv = /* @__PURE__ */ dt("area-pieces"), na = /* @__PURE__ */ dt("area-piece"), Qu = /* @__PURE__ */ dt("avoid"), Yv = dt("view-dragging");
function ui(t) {
  var e = t.areaElement;
  if (e) {
    var r = t.state, n = r.width, a = r.height;
    Xl(e, Qu), e.style.cssText += "left: 0px; top: 0px; width: ".concat(n, "px; height: ").concat(a, "px");
  }
}
function Js(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: Wv },
    t.createElement("div", { className: na }),
    t.createElement("div", { className: na }),
    t.createElement("div", { className: na }),
    t.createElement("div", { className: na })
  );
}
var tc = {
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
    var r = t.props, n = r.target, a = r.dragArea, i = r.groupable, o = r.passDragArea, s = t.getState(), l = s.width, u = s.height, c = s.renderPoses, f = o ? dt("area", "pass") : dt("area");
    if (i)
      return [
        e.createElement("div", { key: "area", ref: nr(t, "areaElement"), className: f }),
        Js(e)
      ];
    if (!n || !a)
      return [];
    var d = so([0, 0], [l, 0], [0, u], [l, u], c[0], c[1], c[2], c[3]), p = d.length ? ja(d, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: nr(t, "areaElement"), className: f, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(u, "px"),
        transformOrigin: "0 0",
        transform: p
      } }),
      Js(e)
    ];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    r.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, u = s.renderPoses, c = s.rootMatrix, f = s.is3d, d = l.left, p = l.top, h = De(u), m = h.left, x = h.top, y = h.width, b = h.height, E = f ? 4 : 3, w = N(Xr(c, [n - d, a - p], E), 2), _ = w[0], D = w[1];
    _ -= m, D -= x;
    var M = [
      { left: m, top: x, width: y, height: D - 10 },
      { left: m, top: x, width: _ - 10, height: b },
      { left: m, top: x + D + 10, width: y, height: b - D - 10 },
      { left: m + _ + 10, top: x, width: y - _ - 10, height: b }
    ], g = [].slice.call(o.nextElementSibling.children);
    M.forEach(function(T, k) {
      g[k].style.cssText = "left: ".concat(T.left, "px;top: ").concat(T.top, "px; width: ").concat(T.width, "px; height: ").concat(T.height, "px;");
    }), ao(o, Qu), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var r = e.datas, n = e.inputEvent;
    if (this.enableNativeEvent(t), !n)
      return !1;
    r.isDragArea || (r.isDragArea = !0, ui(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var r = e.inputEvent, n = e.datas;
    if (!r)
      return !1;
    n.isDragArea || ui(t);
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
    ui(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && Yl(function() {
      e.disableNativeEvent = !1;
    });
  }
}, Xv = _n("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var r = t.props, n = r.zoom, a = r.svgOrigin, i = r.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, u = o.svg, c = o.allMatrix, f = o.is3d, d = o.left, p = o.top, h = o.offsetWidth, m = o.offsetHeight, x;
    if (!i && u && a) {
      var y = N(To(a, h, m), 2), b = y[0], E = y[1], w = f ? 4 : 3, _ = Bt(c, [b, E], w);
      x = Ea(l, n, vt(_, [d, p]));
    } else
      x = Ea(l, n, s);
    return [
      e.createElement("div", { className: dt("control", "origin"), style: x, key: "beforeOrigin" })
    ];
  }
});
function Hv(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var $v = {
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
    var r = t.props, n = r.scrollContainer, a = n === void 0 ? t.getContainer() : n, i = r.scrollOptions, o = new Zl(), s = Fe(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", u = e.targets;
    o.on("scroll", function(c) {
      var f = c.container, d = c.direction, p = Et(t, e, {
        scrollContainer: f,
        direction: d
      }), h = u ? "onScrollGroup" : "onScroll";
      u && (p.targets = u), ct(t, h, p);
    }).on("move", function(c) {
      var f = c.offsetX, d = c.offsetY, p = c.inputEvent;
      t[l].scrollBy(f, d, p.inputEvent, !1);
    }).on("scrollDrag", function(c) {
      var f = c.next;
      f(t[l].getCurrentEvent());
    }), o.dragStart(e, P({ container: s }, i));
  },
  checkScroll: function(t, e) {
    var r = e.datas.dragScroll;
    if (r) {
      var n = t.props, a = n.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = n.scrollThreshold, s = o === void 0 ? 0 : o, l = n.scrollThrottleTime, u = l === void 0 ? 0 : l, c = n.getScrollPosition, f = c === void 0 ? Hv : c, d = n.scrollOptions;
      return r.drag(e, P({ container: i, threshold: s, throttleTime: u, getScrollPosition: function(p) {
        return f({ scrollContainer: p.container, direction: p.direction });
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
    return this.dragStart(t, P(P({}, e), { isControl: !0 }));
  },
  dragControl: function(t, e) {
    return this.drag(t, e);
  },
  dragControlEnd: function(t, e) {
    return this.dragEnd(t, e);
  },
  dragGroupStart: function(t, e) {
    return this.dragStart(t, P(P({}, e), { targets: t.props.targets }));
  },
  dragGroup: function(t, e) {
    return this.drag(t, P(P({}, e), { targets: t.props.targets }));
  },
  dragGroupEnd: function(t, e) {
    return this.dragEnd(t, P(P({}, e), { targets: t.props.targets }));
  },
  dragGroupControlStart: function(t, e) {
    return this.dragStart(t, P(P({}, e), { targets: t.props.targets, isControl: !0 }));
  },
  dragGroupControl: function(t, e) {
    return this.drag(t, P(P({}, e), { targets: t.props.targets }));
  },
  dragGroupControEnd: function(t, e) {
    return this.dragEnd(t, P(P({}, e), { targets: t.props.targets }));
  },
  unset: function(t) {
    var e, r = t.state;
    (e = r.dragScroll) === null || e === void 0 || e.dragEnd(), r.dragScroll = null;
  }
}, ec = {
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
}, qv = _n("padding", {
  props: ["padding"],
  render: function(t, e) {
    var r = t.props;
    if (r.dragArea)
      return [];
    var n = Ju(r.padding || {}), a = n.left, i = n.top, o = n.right, s = n.bottom, l = t.getState(), u = l.renderPoses, c = l.pos1, f = l.pos2, d = l.pos3, p = l.pos4, h = [c, f, d, p], m = [];
    return a > 0 && m.push([0, 2]), i > 0 && m.push([0, 1]), o > 0 && m.push([1, 3]), s > 0 && m.push([2, 3]), m.map(function(x, y) {
      var b = N(x, 2), E = b[0], w = b[1], _ = h[E], D = h[w], M = u[E], g = u[w], T = so([0, 0], [100, 0], [0, 100], [100, 100], _, D, M, g);
      if (T.length)
        return e.createElement("div", { key: "padding".concat(y), className: dt("padding"), style: {
          transform: ja(T, !0)
        } });
    });
  }
}), Qs = ["nw", "ne", "se", "sw"];
function aa(t, e) {
  var r = t[0] + t[1], n = r > e ? e / r : 1;
  return t[0] *= n, t[1] = e - t[1] * n, t;
}
var Vv = [1, 2, 5, 6], Uv = [0, 3, 4, 7], pr = [1, -1, -1, 1], vr = [1, 1, -1, -1];
function Io(t, e, r, n, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = r), s === void 0 && (s = n);
  var l = [], u = !1, c = t.filter(function(d) {
    return !d.virtual;
  }), f = c.map(function(d) {
    var p = d.horizontal, h = d.vertical, m = d.pos;
    if (h && !u && (u = !0, l.push("/")), u) {
      var x = Math.max(0, h === 1 ? m[1] - i : s - m[1]);
      return l.push(Ie(x, n, e)), x;
    } else {
      var x = Math.max(0, p === 1 ? m[0] - a : o - m[0]);
      return l.push(Ie(x, r, e)), x;
    }
  });
  return {
    radiusPoses: c,
    styles: l,
    raws: f
  };
}
function rc(t) {
  for (var e = [0, 0], r = [0, 0], n = t.length, a = 0; a < n; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, r[0] = a + 1), i.vertical && (r[1] === 0 && (r[0] = a), r[1] = a - r[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: r
  };
}
function nc(t, e, r, n, a, i, o) {
  var s, l, u, c;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var f = t.indexOf("/"), d = (f > -1 ? t.slice(0, f) : t).length, p = t.slice(0, d), h = t.slice(d + 1), m = p.length, x = h.length, y = x > 0, b = N(p, 4), E = b[0], w = E === void 0 ? "0px" : E, _ = b[1], D = _ === void 0 ? w : _, M = b[2], g = M === void 0 ? w : M, T = b[3], k = T === void 0 ? D : T, z = N(h, 4), O = z[0], R = O === void 0 ? w : O, j = z[1], A = j === void 0 ? y ? R : D : j, W = z[2], X = W === void 0 ? y ? R : g : W, L = z[3], q = L === void 0 ? y ? A : k : L, V = [w, D, g, k].map(function(Q) {
    return Ot(Q, e);
  }), F = [R, A, X, q].map(function(Q) {
    return Ot(Q, r);
  }), et = V.slice(), tt = F.slice();
  s = N(aa([et[0], et[1]], e), 2), et[0] = s[0], et[1] = s[1], l = N(aa([et[3], et[2]], e), 2), et[3] = l[0], et[2] = l[1], u = N(aa([tt[0], tt[3]], r), 2), tt[0] = u[0], tt[3] = u[1], c = N(aa([tt[1], tt[2]], r), 2), tt[1] = c[0], tt[2] = c[1];
  var K = o ? et : et.slice(0, Math.max(i[0], m)), nt = o ? tt : tt.slice(0, Math.max(i[1], x));
  return J(J([], N(K.map(function(Q, at) {
    var it = Qs[at];
    return {
      virtual: at >= m,
      horizontal: pr[at],
      vertical: 0,
      pos: [n + Q, a + (vr[at] === -1 ? r : 0)],
      sub: !0,
      raw: V[at],
      direction: it
    };
  })), !1), N(nt.map(function(Q, at) {
    var it = Qs[at];
    return {
      virtual: at >= x,
      horizontal: 0,
      vertical: vr[at],
      pos: [n + (pr[at] === -1 ? e : 0), a + Q],
      sub: !0,
      raw: F[at],
      direction: it
    };
  })), !1);
}
function Kv(t, e, r, n, a) {
  a === void 0 && (a = e.length);
  var i = rc(t.slice(n)), o = i.horizontalRange, s = i.verticalRange, l = r - n, u = 0;
  if (l === 0)
    u = a;
  else if (l > 0 && l < o[1])
    u = o[1] - l;
  else if (l >= s[0])
    u = s[0] + s[1] - l;
  else
    return;
  t.splice(r, u), e.splice(r, u);
}
function Zv(t, e, r, n, a, i, o, s, l, u, c) {
  u === void 0 && (u = 0), c === void 0 && (c = 0);
  var f = rc(t.slice(r)), d = f.horizontalRange, p = f.verticalRange;
  if (n > -1)
    for (var h = pr[n] === 1 ? i - u : s - i, m = d[1]; m <= n; ++m) {
      var x = vr[m] === 1 ? c : l, y = 0;
      if (n === m ? y = i : m === 0 ? y = u + h : pr[m] === -1 && (y = s - (e[r][0] - u)), t.splice(r + m, 0, {
        horizontal: pr[m],
        vertical: 0,
        pos: [y, x]
      }), e.splice(r + m, 0, [y, x]), m === 0)
        break;
    }
  else if (a > -1) {
    var b = vr[a] === 1 ? o - c : l - o;
    if (d[1] === 0 && p[1] === 0) {
      var E = [
        u + b,
        c
      ];
      t.push({
        horizontal: pr[0],
        vertical: 0,
        pos: E
      }), e.push(E);
    }
    for (var w = p[0], m = p[1]; m <= a; ++m) {
      var y = pr[m] === 1 ? u : s, x = 0;
      if (a === m ? x = o : m === 0 ? x = c + b : vr[m] === 1 ? x = e[r + w][1] : vr[m] === -1 && (x = l - (e[r + w][1] - c)), t.push({
        horizontal: 0,
        vertical: vr[m],
        pos: [y, x]
      }), e.push([y, x]), m === 0)
        break;
    }
  }
}
function Jv(t, e) {
  e === void 0 && (e = t.map(function(a) {
    return a.raw;
  }));
  var r = t.map(function(a, i) {
    return a.horizontal ? e[i] : null;
  }).filter(function(a) {
    return a != null;
  }), n = t.map(function(a, i) {
    return a.vertical ? e[i] : null;
  }).filter(function(a) {
    return a != null;
  });
  return {
    horizontals: r,
    verticals: n
  };
}
var Qv = [
  [0, -1, "n"],
  [1, 0, "e"]
], th = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function Ro(t, e, r) {
  var n = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, u = s.poses, c = l === "rect", f = l === "circle";
  if (l === "polygon")
    return r.map(function(D) {
      return "".concat(Ie(D[0], i, n), " ").concat(Ie(D[1], o, n));
    });
  if (c || l === "inset") {
    var d = r[1][1], p = r[3][0], h = r[7][0], m = r[5][1];
    if (c)
      return [
        d,
        p,
        m,
        h
      ].map(function(D) {
        return "".concat(D, "px");
      });
    var x = [d, i - p, o - m, h].map(function(D, M) {
      return Ie(D, M % 2 ? i : o, n);
    });
    if (r.length > 8) {
      var y = N(vt(r[4], r[0]), 2), b = y[0], E = y[1];
      x.push.apply(x, J(["round"], N(Io(u.slice(8).map(function(D, M) {
        return P(P({}, D), { pos: r[M] });
      }), n, b, E, h, d, p, m).styles), !1));
    }
    return x;
  } else if (f || l === "ellipse") {
    var w = r[0], _ = Ie(H(r[1][1] - w[1]), f ? Math.sqrt((i * i + o * o) / 2) : o, n), x = f ? [_] : [Ie(H(r[2][0] - w[0]), i, n), _];
    return x.push("at", Ie(w[0], i, n), Ie(w[1], o, n)), x;
  }
}
function Da(t, e, r, n) {
  var a = [n, (n + e) / 2, e], i = [t, (t + r) / 2, r];
  return th.map(function(o) {
    var s = N(o, 3), l = s[0], u = s[1], c = s[2], f = a[l + 1], d = i[u + 1];
    return {
      vertical: H(u),
      horizontal: H(l),
      direction: c,
      pos: [f, d]
    };
  });
}
function ac(t) {
  var e = [1 / 0, -1 / 0], r = [1 / 0, -1 / 0];
  return t.forEach(function(n) {
    var a = n.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), r[0] = Math.min(r[0], a[1]), r[1] = Math.max(r[1], a[1]);
  }), [
    H(e[1] - e[0]),
    H(r[1] - r[0])
  ];
}
function tl(t, e, r, n, a) {
  var i, o, s, l, u, c, f, d, p;
  if (t) {
    var h = a;
    if (!h) {
      var m = ve(t), x = m("clipPath");
      h = x !== "none" ? x : m("clip");
    }
    if (!((!h || h === "none" || h === "auto") && (h = n, !h))) {
      var y = Wl(h), b = y.prefix, E = b === void 0 ? h : b, w = y.value, _ = w === void 0 ? "" : w, D = E === "circle", M = " ";
      if (E === "polygon") {
        var g = hr(_ || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        M = ",";
        var T = g.map(function(Ht) {
          var ae = N(Ht.split(" "), 2), $t = ae[0], Gt = ae[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              Ot($t, e),
              Ot(Gt, r)
            ]
          };
        }), k = yr(T.map(function(Ht) {
          return Ht.pos;
        }));
        return {
          type: E,
          clipText: h,
          poses: T,
          splitter: M,
          left: k.minX,
          right: k.maxX,
          top: k.minY,
          bottom: k.maxY
        };
      } else if (D || E === "ellipse") {
        var z = "", O = "", R = 0, j = 0, g = ar(_);
        if (D) {
          var A = "";
          i = N(g, 4), o = i[0], A = o === void 0 ? "50%" : o, s = i[2], z = s === void 0 ? "50%" : s, l = i[3], O = l === void 0 ? "50%" : l, R = Ot(A, Math.sqrt((e * e + r * r) / 2)), j = R;
        } else {
          var W = "", X = "";
          u = N(g, 5), c = u[0], W = c === void 0 ? "50%" : c, f = u[1], X = f === void 0 ? "50%" : f, d = u[3], z = d === void 0 ? "50%" : d, p = u[4], O = p === void 0 ? "50%" : p, R = Ot(W, e), j = Ot(X, r);
        }
        var L = [
          Ot(z, e),
          Ot(O, r)
        ], T = J([
          {
            vertical: 1,
            horizontal: 1,
            pos: L,
            direction: "nesw"
          }
        ], N(Qv.slice(0, D ? 1 : 2).map(function($t) {
          return {
            vertical: H($t[1]),
            horizontal: $t[0],
            direction: $t[2],
            sub: !0,
            pos: [
              L[0] + $t[0] * R,
              L[1] + $t[1] * j
            ]
          };
        })), !1);
        return {
          type: E,
          clipText: h,
          radiusX: R,
          radiusY: j,
          left: L[0] - R,
          top: L[1] - j,
          right: L[0] + R,
          bottom: L[1] + j,
          poses: T,
          splitter: M
        };
      } else if (E === "inset") {
        var g = ar(_ || "0 0 0 0"), q = g.indexOf("round"), V = (q > -1 ? g.slice(0, q) : g).length, F = g.slice(V + 1), et = N(g.slice(0, V), 4), tt = et[0], K = et[1], nt = K === void 0 ? tt : K, Q = et[2], at = Q === void 0 ? tt : Q, it = et[3], mt = it === void 0 ? nt : it, yt = N([tt, at].map(function($t) {
          return Ot($t, r);
        }), 2), Z = yt[0], ut = yt[1], Ct = N([mt, nt].map(function($t) {
          return Ot($t, e);
        }), 2), pt = Ct[0], ht = Ct[1], bt = e - ht, gt = r - ut, _t = nc(F, bt - pt, gt - Z, pt, Z), T = J(J([], N(Da(Z, bt, gt, pt)), !1), N(_t), !1);
        return {
          type: "inset",
          clipText: h,
          poses: T,
          top: Z,
          left: pt,
          right: bt,
          bottom: gt,
          radius: F,
          splitter: M
        };
      } else if (E === "rect") {
        var g = hr(_ || "0px, ".concat(e, "px, ").concat(r, "px, 0px"));
        M = ",";
        var St = N(g.map(function(ze) {
          var Te = gr(ze).value;
          return Te;
        }), 4), Mt = St[0], ht = St[1], ut = St[2], pt = St[3], T = Da(Mt, ht, ut, pt);
        return {
          type: "rect",
          clipText: h,
          poses: T,
          top: Mt,
          right: ht,
          bottom: ut,
          left: pt,
          values: g,
          splitter: M
        };
      }
    }
  }
}
function eh(t, e, r, n, a) {
  var i = t[e], o = i.direction, s = i.sub, l = t.map(function() {
    return [0, 0];
  }), u = o ? o.split("") : [];
  if (n && e < 8) {
    var c = u.filter(function(R) {
      return R === "w" || R === "e";
    }), f = u.filter(function(R) {
      return R === "n" || R === "s";
    }), d = c[0], p = f[0];
    l[e] = r;
    var h = N(ac(t), 2), m = h[0], x = h[1], y = m && x ? m / x : 0;
    if (y && a) {
      var b = (e + 4) % 8, E = t[b].pos, w = [0, 0];
      o.indexOf("w") > -1 ? w[0] = -1 : o.indexOf("e") > -1 && (w[0] = 1), o.indexOf("n") > -1 ? w[1] = -1 : o.indexOf("s") > -1 && (w[1] = 1);
      var _ = Uu([m, x], r, y, w, !0), D = m + _[0], M = x + _[1], g = E[1], T = E[1], k = E[0], z = E[0];
      w[0] === -1 ? k = z - D : w[0] === 1 ? z = k + D : (k = k - D / 2, z = z + D / 2), w[1] === -1 ? g = T - M : (w[1] === 1 || (g = T - M / 2), T = g + M);
      var O = Da(g, z, T, k);
      t.forEach(function(R, j) {
        l[j][0] = O[j].pos[0] - R.pos[0], l[j][1] = O[j].pos[1] - R.pos[1];
      });
    } else
      t.forEach(function(R, j) {
        var A = R.direction;
        A && (A.indexOf(d) > -1 && (l[j][0] = r[0]), A.indexOf(p) > -1 && (l[j][1] = r[1]));
      }), d && (l[1][0] = r[0] / 2, l[5][0] = r[0] / 2), p && (l[3][1] = r[1] / 2, l[7][1] = r[1] / 2);
  } else o && !s ? u.forEach(function(R) {
    var j = R === "n" || R === "s";
    t.forEach(function(A, W) {
      var X = A.direction, L = A.horizontal, q = A.vertical;
      !X || X.indexOf(R) === -1 || (l[W] = [
        j || !L ? 0 : r[0],
        !j || !q ? 0 : r[1]
      ]);
    });
  }) : l[e] = r;
  return l;
}
function rh(t, e) {
  var r = N(lu(t, e), 2), n = r[0], a = r[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, u = l.type, c = l.poses, f = l.splitter, d = c.map(function(b) {
    return b.pos;
  });
  if (u === "polygon")
    d.splice(s, 0, [n, a]);
  else if (u === "inset") {
    var p = Vv.indexOf(s), h = Uv.indexOf(s), m = c.length;
    if (Zv(c, d, 8, p, h, n, a, d[4][0], d[4][1], d[0][0], d[0][1]), m === c.length)
      return;
  } else
    return;
  var x = Ro(t, o, d), y = "".concat(u, "(").concat(x.join(f), ")");
  ct(t, "onClip", Et(t, e, P({ clipEventType: "added", clipType: u, poses: d, clipStyles: x, clipStyle: y, distX: 0, distY: 0 }, ce({
    clipPath: y
  }, e))));
}
function nh(t, e) {
  var r = e.datas, n = r.clipPath, a = r.clipIndex, i = n, o = i.type, s = i.poses, l = i.splitter, u = s.map(function(p) {
    return p.pos;
  }), c = u.length;
  if (o === "polygon")
    s.splice(a, 1), u.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (Kv(s, u, a, 8, c), c === s.length))
      return;
  } else
    return;
  var f = Ro(t, n, u), d = "".concat(o, "(").concat(f.join(l), ")");
  ct(t, "onClip", Et(t, e, P({ clipEventType: "removed", clipType: o, poses: u, clipStyles: f, clipStyle: d, distX: 0, distY: 0 }, ce({
    clipPath: d
  }, e))));
}
var ah = {
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
    var r = t.props, n = r.customClipPath, a = r.defaultClipPath, i = r.clipArea, o = r.zoom, s = r.groupable, l = t.getState(), u = l.target, c = l.width, f = l.height, d = l.allMatrix, p = l.is3d, h = l.left, m = l.top, x = l.pos1, y = l.pos2, b = l.pos3, E = l.pos4, w = l.clipPathState, _ = l.snapBoundInfos, D = l.rotation;
    if (!u || s)
      return [];
    var M = tl(u, c, f, a || "inset", w || n);
    if (!M)
      return [];
    var g = p ? 4 : 3, T = M.type, k = M.poses, z = k.map(function(ht) {
      var bt = Bt(d, ht.pos, g);
      return [
        bt[0] - h,
        bt[1] - m
      ];
    }), O = [], R = [], j = T === "rect", A = T === "inset", W = T === "polygon";
    if (j || A || W) {
      var X = A ? z.slice(0, 8) : z;
      R = X.map(function(ht, bt) {
        var gt = bt === 0 ? X[X.length - 1] : X[bt - 1], _t = Xt(gt, ht), St = Fu(gt, ht);
        return e.createElement("div", { key: "clipLine".concat(bt), className: dt("line", "clip-line", "snap-control"), "data-clip-index": bt, style: {
          width: "".concat(St, "px"),
          transform: "translate(".concat(gt[0], "px, ").concat(gt[1], "px) rotate(").concat(_t, "rad) scaleY(").concat(o, ")")
        } });
      });
    }
    if (O = z.map(function(ht, bt) {
      return e.createElement("div", { key: "clipControl".concat(bt), className: dt("control", "clip-control", "snap-control"), "data-clip-index": bt, style: {
        transform: "translate(".concat(ht[0], "px, ").concat(ht[1], "px) rotate(").concat(D, "rad) scale(").concat(o, ")")
      } });
    }), A && O.push.apply(O, J([], N(z.slice(8).map(function(ht, bt) {
      return e.createElement("div", { key: "clipRadiusControl".concat(bt), className: dt("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + bt, style: {
        transform: "translate(".concat(ht[0], "px, ").concat(ht[1], "px) rotate(").concat(D, "rad) scale(").concat(o, ")")
      } });
    })), !1)), T === "circle" || T === "ellipse") {
      var L = M.left, q = M.top, V = M.radiusX, F = M.radiusY, et = N(vt(Bt(d, [L, q], g), Bt(d, [0, 0], g)), 2), tt = et[0], K = et[1], nt = "none";
      if (!i) {
        for (var Q = Math.max(10, V / 5, F / 5), at = [], it = 0; it <= Q; ++it) {
          var mt = Math.PI * 2 / Q * it;
          at.push([
            V + (V - o) * Math.cos(mt),
            F + (F - o) * Math.sin(mt)
          ]);
        }
        at.push([V, -2]), at.push([-2, -2]), at.push([-2, F * 2 + 2]), at.push([V * 2 + 2, F * 2 + 2]), at.push([V * 2 + 2, -2]), at.push([V, -2]), nt = "polygon(".concat(at.map(function(ht) {
          return "".concat(ht[0], "px ").concat(ht[1], "px");
        }).join(", "), ")");
      }
      O.push(e.createElement("div", { key: "clipEllipse", className: dt("clip-ellipse", "snap-control"), style: {
        width: "".concat(V * 2, "px"),
        height: "".concat(F * 2, "px"),
        clipPath: nt,
        transform: "translate(".concat(-h + tt, "px, ").concat(-m + K, "px) ").concat(ja(d))
      } }));
    }
    if (i) {
      var yt = De(J([x, y, b, E], N(z), !1)), Z = yt.width, ut = yt.height, Ct = yt.left, pt = yt.top;
      if (W || j || A) {
        var at = A ? z.slice(0, 8) : z;
        O.push(e.createElement("div", { key: "clipArea", className: dt("clip-area", "snap-control"), style: {
          width: "".concat(Z, "px"),
          height: "".concat(ut, "px"),
          transform: "translate(".concat(Ct, "px, ").concat(pt, "px)"),
          clipPath: "polygon(".concat(at.map(function(bt) {
            return "".concat(bt[0] - Ct, "px ").concat(bt[1] - pt, "px");
          }).join(", "), ")")
        } }));
      }
    }
    return _ && ["vertical", "horizontal"].forEach(function(ht) {
      var bt = _[ht], gt = ht === "horizontal";
      bt.isSnap && R.push.apply(R, J([], N(bt.snap.posInfos.map(function(_t, St) {
        var Mt = _t.pos, Ht = vt(Bt(d, gt ? [0, Mt] : [Mt, 0], g), [h, m]), ae = vt(Bt(d, gt ? [c, Mt] : [Mt, f], g), [h, m]);
        return yn(e, "", Ht, ae, o, "clip".concat(ht, "snap").concat(St), "guideline");
      })), !1)), bt.isBound && R.push.apply(R, J([], N(bt.bounds.map(function(_t, St) {
        var Mt = _t.pos, Ht = vt(Bt(d, gt ? [0, Mt] : [Mt, 0], g), [h, m]), ae = vt(Bt(d, gt ? [c, Mt] : [Mt, f], g), [h, m]);
        return yn(e, "", Ht, ae, o, "clip".concat(ht, "bounds").concat(St), "guideline", "bounds", "bold");
      })), !1));
    }), J(J([], N(O), !1), N(R), !1);
  },
  dragControlCondition: function(t, e) {
    return e.inputEvent && (e.inputEvent.target.getAttribute("class") || "").indexOf("clip") > -1;
  },
  dragStart: function(t, e) {
    var r = t.props, n = r.dragWithClip, a = n === void 0 ? !0 : n;
    return a ? !1 : this.dragControlStart(t, e);
  },
  drag: function(t, e) {
    return this.dragControl(t, P(P({}, e), { isDragTarget: !0 }));
  },
  dragEnd: function(t, e) {
    return this.dragControlEnd(t, e);
  },
  dragControlStart: function(t, e) {
    var r = t.state, n = t.props, a = n.defaultClipPath, i = n.customClipPath, o = r.target, s = r.width, l = r.height, u = e.inputEvent ? e.inputEvent.target : null, c = u && u.getAttribute("class") || "", f = e.datas, d = tl(o, s, l, a || "inset", i);
    if (!d)
      return !1;
    var p = d.clipText, h = d.type, m = d.poses, x = ct(t, "onClipStart", Et(t, e, {
      clipType: h,
      clipStyle: p,
      poses: m.map(function(y) {
        return y.pos;
      })
    }));
    return x === !1 ? (f.isClipStart = !1, !1) : (f.isControl = c && c.indexOf("clip-control") > -1, f.isLine = c.indexOf("clip-line") > -1, f.isArea = c.indexOf("clip-area") > -1 || c.indexOf("clip-ellipse") > -1, f.clipIndex = u ? parseInt(u.getAttribute("data-clip-index"), 10) : -1, f.clipPath = d, f.isClipStart = !0, r.clipPathState = p, Sr(t, e), !0);
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, u = l.isControl, c = l.isLine, f = l.isArea, d = l.clipIndex, p = l.clipPath;
    if (!p)
      return !1;
    var h = br(t.props, "clippable"), m = h.keepRatio, x = 0, y = 0, b = o.draggable, E = Le(e);
    s && b ? (r = N(b.prevBeforeDist, 2), x = r[0], y = r[1]) : (n = N(E, 2), x = n[0], y = n[1]);
    var w = [x, y], _ = t.state, D = _.width, M = _.height, g = !f && !u && !c, T = p.type, k = p.poses, z = p.splitter, O = k.map(function(kt) {
      return kt.pos;
    });
    g && (x = -x, y = -y);
    var R = !u || k[d].direction === "nesw", j = T === "inset" || T === "rect", A = k.map(function() {
      return [0, 0];
    });
    if (u && !R) {
      var W = k[d], X = W.horizontal, L = W.vertical, q = [
        x * H(X),
        y * H(L)
      ];
      A = eh(k, d, q, j, m);
    } else R && (A = O.map(function() {
      return [x, y];
    }));
    var V = O.map(function(kt, Lt) {
      return Tt(kt, A[Lt]);
    }), F = J([], N(V), !1);
    _.snapBoundInfos = null;
    var et = p.type === "circle", tt = p.type === "ellipse";
    if (et || tt) {
      var K = De(V), nt = H(K.bottom - K.top), Q = H(tt ? K.right - K.left : nt), at = V[0][1] + nt, it = V[0][0] - Q, mt = V[0][0] + Q;
      et && (F.push([mt, K.bottom]), A.push([1, 0])), F.push([K.left, at]), A.push([0, 1]), F.push([it, K.bottom]), A.push([1, 0]);
    }
    var yt = Nu((h.clipHorizontalGuidelines || []).map(function(kt) {
      return Ot("".concat(kt), M);
    }), (h.clipVerticalGuidelines || []).map(function(kt) {
      return Ot("".concat(kt), D);
    }), D, M), Z = [], ut = [];
    if (et || tt)
      Z = [F[4][0], F[2][0]], ut = [F[1][1], F[3][1]];
    else if (j) {
      var Ct = [F[0], F[2], F[4], F[6]], pt = [A[0], A[2], A[4], A[6]];
      Z = Ct.filter(function(kt, Lt) {
        return pt[Lt][0];
      }).map(function(kt) {
        return kt[0];
      }), ut = Ct.filter(function(kt, Lt) {
        return pt[Lt][1];
      }).map(function(kt) {
        return kt[1];
      });
    } else
      Z = F.filter(function(kt, Lt) {
        return A[Lt][0];
      }).map(function(kt) {
        return kt[0];
      }), ut = F.filter(function(kt, Lt) {
        return A[Lt][1];
      }).map(function(kt) {
        return kt[1];
      });
    var ht = [0, 0], bt = Bs(yt, h.clipTargetBounds && { left: 0, top: 0, right: D, bottom: M }, Z, ut, 5, 5), gt = bt.horizontal, _t = bt.vertical, St = gt.offset, Mt = _t.offset;
    if (gt.isBound && (ht[1] += St), _t.isBound && (ht[0] += Mt), (tt || et) && A[0][0] === 0 && A[0][1] === 0) {
      var K = De(V), Ht = K.bottom - K.top, ae = tt ? K.right - K.left : Ht, $t = _t.isBound ? H(Mt) : _t.snapIndex === 0 ? -Mt : Mt, Gt = gt.isBound ? H(St) : gt.snapIndex === 0 ? -St : St;
      ae -= $t, Ht -= Gt, et && (Ht = _u(_t, gt) > 0 ? Ht : ae, ae = Ht);
      var jt = F[0];
      F[1][1] = jt[1] - Ht, F[2][0] = jt[0] + ae, F[3][1] = jt[1] + Ht, F[4][0] = jt[0] - ae;
    } else if (j && m && u) {
      var ze = N(ac(k), 2), Te = ze[0], In = ze[1], Ue = Te && In ? Te / In : 0, Rn = k[d], We = Rn.direction || "", lr = F[1][1], at = F[5][1], it = F[7][0], mt = F[3][0];
      H(St) <= H(Mt) ? St = ue(St) * H(Mt) / Ue : Mt = ue(Mt) * H(St) * Ue, We.indexOf("w") > -1 ? it -= Mt : We.indexOf("e") > -1 ? mt -= Mt : (it += Mt / 2, mt -= Mt / 2), We.indexOf("n") > -1 ? lr -= St : We.indexOf("s") > -1 ? at -= St : (lr += St / 2, at -= St / 2);
      var Ke = Da(lr, mt, at, it);
      F.forEach(function(ft, te) {
        var be;
        be = N(Ke[te].pos, 2), ft[0] = be[0], ft[1] = be[1];
      });
    } else
      F.forEach(function(kt, Lt) {
        var U = A[Lt];
        U[0] && (kt[0] -= Mt), U[1] && (kt[1] -= St);
      });
    var Pn = Ro(t, p, V), he = "".concat(T, "(").concat(Pn.join(z), ")");
    if (_.clipPathState = he, et || tt)
      Z = [F[4][0], F[2][0]], ut = [F[1][1], F[3][1]];
    else if (j) {
      var Ct = [F[0], F[2], F[4], F[6]];
      Z = Ct.map(function(Lt) {
        return Lt[0];
      }), ut = Ct.map(function(Lt) {
        return Lt[1];
      });
    } else
      Z = F.map(function(kt) {
        return kt[0];
      }), ut = F.map(function(kt) {
        return kt[1];
      });
    if (_.snapBoundInfos = Bs(yt, h.clipTargetBounds && { left: 0, top: 0, right: D, bottom: M }, Z, ut, 1, 1), b) {
      var It = _.is3d, Er = _.allMatrix, Ze = It ? 4 : 3, Ft = ht;
      s && (Ft = [
        w[0] + ht[0] - E[0],
        w[1] + ht[1] - E[1]
      ]), b.deltaOffset = Nt(Er, [Ft[0], Ft[1], 0, 0], Ze);
    }
    return ct(t, "onClip", Et(t, e, P({ clipEventType: "changed", clipType: T, poses: V, clipStyle: he, clipStyles: Pn, distX: x, distY: y }, ce((a = {}, a[T === "rect" ? "clip" : "clipPath"] = he, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var r = e.isDrag, n = e.datas, a = e.isDouble, i = n.isLine, o = n.isClipStart, s = n.isControl;
    return o ? (ct(t, "onClipEnd", ye(t, e, {})), a && (s ? nh(t, e) : i && rh(t, e)), a || r) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, ih = {
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
    return e.isRequest ? e.requestAble === "originDraggable" : Qt(e.inputEvent.target, dt("origin"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas;
    Sr(t, e);
    var n = Et(t, e, {
      dragStart: le.dragStart(t, new Lr().dragStart([0, 0], e))
    }), a = ct(t, "onDragOriginStart", n);
    return r.startOrigin = t.state.transformOrigin, r.startTargetOrigin = t.state.targetOrigin, r.prevOrigin = [0, 0], r.isDragOrigin = !0, a === !1 ? (r.isDragOrigin = !1, !1) : n;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.isRequest;
    if (!r.isDragOrigin)
      return !1;
    var i = N(Le(e), 2), o = i[0], s = i[1], l = t.state, u = l.width, c = l.height, f = l.offsetMatrix, d = l.targetMatrix, p = l.is3d, h = t.props.originRelative, m = h === void 0 ? !0 : h, x = p ? 4 : 3, y = [o, s];
    if (a) {
      var b = e.distOrigin;
      (b[0] || b[1]) && (y = b);
    }
    var E = Tt(r.startOrigin, y), w = Tt(r.startTargetOrigin, y), _ = vt(y, r.prevOrigin), D = kn(f, d, E, x), M = t.getRect(), g = De(Cr(D, u, c, x)), T = [
      M.left - g.left,
      M.top - g.top
    ];
    r.prevOrigin = y;
    var k = [
      Ie(w[0], u, m),
      Ie(w[1], c, m)
    ].join(" "), z = le.drag(t, Mn(e, t.state, T, !!n)), O = Et(t, e, P(P({ width: u, height: c, origin: E, dist: y, delta: _, transformOrigin: k, drag: z }, ce({
      transformOrigin: k,
      transform: z.transform
    }, e)), { afterTransform: z.transform }));
    return ct(t, "onDragOrigin", O), O;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    return r.isDragOrigin ? (ct(t, "onDragOriginEnd", ye(t, e, {})), !0) : !1;
  },
  dragGroupControlCondition: function(t, e) {
    return this.dragControlCondition(t, e);
  },
  dragGroupControlStart: function(t, e) {
    var r = this.dragControlStart(t, e);
    return !!r;
  },
  dragGroupControl: function(t, e) {
    var r = this.dragControl(t, e);
    return r ? (t.transformOrigin = r.transformOrigin, !0) : !1;
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
    var e = {}, r = t.getRect(), n = 0, a = 0, i = r.transformOrigin, o = [0, 0];
    return {
      isControl: !0,
      requestStart: function() {
        return { datas: e };
      },
      request: function(s) {
        return "deltaOrigin" in s ? (o[0] += s.deltaOrigin[0], o[1] += s.deltaOrigin[1]) : "origin" in s ? (o[0] = s.origin[0] - i[0], o[1] = s.origin[1] - i[1]) : ("x" in s ? n = s.x - r.left : "deltaX" in s && (n += s.deltaX), "y" in s ? a = s.y - r.top : "deltaY" in s && (a += s.deltaY)), { datas: e, distX: n, distY: a, distOrigin: o };
      },
      requestEnd: function() {
        return { datas: e, isDrag: !0 };
      }
    };
  }
};
function oh(t, e, r, n) {
  var a = t.filter(function(l) {
    var u = l.virtual, c = l.horizontal;
    return c && !u;
  }).length, i = t.filter(function(l) {
    var u = l.virtual, c = l.vertical;
    return c && !u;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    sh(t, o), o < 4 ? s.pos[0] = r : s.pos[1] = n;
  }
}
function sh(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(r) {
    r.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(r) {
    r.virtual = !1;
  }));
}
function lh(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(r) {
    r.virtual = !0;
  }) : t.slice(e).forEach(function(r) {
    r.virtual = !0;
  });
}
function el(t, e, r, n, a) {
  n === void 0 && (n = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = ar(t), nc(i, e, r, 0, 0, n, a);
}
function rl(t, e, r, n, a) {
  var i = t.state, o = i.width, s = i.height, l = Io(a, t.props.roundRelative, o, s), u = l.raws, c = l.styles, f = l.radiusPoses, d = Jv(f, u), p = d.horizontals, h = d.verticals, m = c.join(" ");
  i.borderRadiusState = m;
  var x = Et(t, e, P({ horizontals: p, verticals: h, borderRadius: m, width: o, height: s, delta: n, dist: r }, ce({
    borderRadius: m
  }, e)));
  return ct(t, "onRound", x), x;
}
function nl(t) {
  var e, r, n = t.getState().style, a = n.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (r = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && r !== void 0 ? r : "", n.borderRadius = a) : (a = Do(o).borderRadius, n.borderRadius = a));
  }
  return a;
}
var uh = {
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
    return e === !0 || e === "line" ? dt("round-line-clickable") : "";
  },
  requestStyle: function() {
    return ["borderRadius"];
  },
  requestChildStyle: function() {
    return ["borderRadius"];
  },
  render: function(t, e) {
    var r = t.getState(), n = r.target, a = r.width, i = r.height, o = r.allMatrix, s = r.is3d, l = r.left, u = r.top, c = r.borderRadiusState, f = t.props, d = f.minRoundControls, p = d === void 0 ? [0, 0] : d, h = f.maxRoundControls, m = h === void 0 ? [4, 4] : h, x = f.zoom, y = f.roundPadding, b = y === void 0 ? 0 : y, E = f.isDisplayShadowRoundControls, w = f.groupable;
    if (!n)
      return null;
    var _ = c || nl(t), D = s ? 4 : 3, M = el(_, a, i, p, !0);
    if (!M)
      return null;
    var g = 0, T = 0, k = w ? [0, 0] : [l, u];
    return M.map(function(z, O) {
      var R = z.horizontal, j = z.vertical, A = z.direction || "", W = J([], N(z.pos), !1);
      T += Math.abs(R), g += Math.abs(j), R && A.indexOf("n") > -1 && (W[1] -= b), j && A.indexOf("w") > -1 && (W[0] -= b), R && A.indexOf("s") > -1 && (W[1] += b), j && A.indexOf("e") > -1 && (W[0] += b);
      var X = vt(Bt(o, W, D), k), L = E && E !== "horizontal", q = z.vertical ? g <= m[1] && (L || !z.virtual) : T <= m[0] && (E || !z.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(O), className: dt("control", "border-radius", z.vertical ? "vertical" : "", z.virtual ? "virtual" : ""), "data-radius-index": O, style: {
        display: q ? "block" : "none",
        transform: "translate(".concat(X[0], "px, ").concat(X[1], "px) scale(").concat(x, ")")
      } });
    });
  },
  dragControlCondition: function(t, e) {
    if (!e.inputEvent || e.isRequest)
      return !1;
    var r = e.inputEvent.target.getAttribute("class") || "";
    return r.indexOf("border-radius") > -1 || r.indexOf("moveable-line") > -1 && r.indexOf("moveable-direction") > -1;
  },
  dragGroupControlCondition: function(t, e) {
    return this.dragControlCondition(t, e);
  },
  dragControlStart: function(t, e) {
    var r = e.inputEvent, n = e.datas, a = r.target, i = a.getAttribute("class") || "", o = i.indexOf("border-radius") > -1, s = i.indexOf("moveable-line") > -1 && i.indexOf("moveable-direction") > -1, l = o ? parseInt(a.getAttribute("data-radius-index"), 10) : -1, u = -1;
    if (s) {
      var c = a.getAttribute("data-line-key") || "";
      c && (u = parseInt(c.replace(/render-line-/g, ""), 10), isNaN(u) && (u = -1));
    }
    if (!o && !s)
      return !1;
    var f = Et(t, e, {}), d = ct(t, "onRoundStart", f);
    if (d === !1)
      return !1;
    n.lineIndex = u, n.controlIndex = l, n.isControl = o, n.isLine = s, Sr(t, e);
    var p = t.props, h = p.roundRelative, m = p.minRoundControls, x = m === void 0 ? [0, 0] : m, y = t.state, b = y.width, E = y.height;
    n.isRound = !0, n.prevDist = [0, 0];
    var w = nl(t), _ = el(w || "", b, E, x, !0) || [];
    return n.controlPoses = _, y.borderRadiusState = Io(_, h, b, E).styles.join(" "), f;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = r.controlPoses;
    if (!r.isRound || !r.isControl || !n.length)
      return !1;
    var a = r.controlIndex, i = N(Le(e), 2), o = i[0], s = i[1], l = [o, s], u = vt(l, r.prevDist), c = t.props.maxRoundControls, f = c === void 0 ? [4, 4] : c, d = t.state, p = d.width, h = d.height, m = n[a], x = m.vertical, y = m.horizontal, b = n.map(function(w) {
      var _ = w.horizontal, D = w.vertical, M = [
        _ * y * l[0],
        D * x * l[1]
      ];
      if (_) {
        if (f[0] === 1)
          return M;
        if (f[0] < 4 && _ !== y)
          return M;
      } else {
        if (f[1] === 0)
          return M[1] = D * y * l[0] / p * h, M;
        if (x) {
          if (f[1] === 1)
            return M;
          if (f[1] < 4 && D !== x)
            return M;
        }
      }
      return [0, 0];
    });
    b[a] = l;
    var E = n.map(function(w, _) {
      return P(P({}, w), { pos: Tt(w.pos, b[_]) });
    });
    return a < 4 ? E.slice(0, a + 1).forEach(function(w) {
      w.virtual = !1;
    }) : E.slice(4, a + 1).forEach(function(w) {
      w.virtual = !1;
    }), r.prevDist = [o, s], rl(t, e, l, u, E);
  },
  dragControlEnd: function(t, e) {
    var r = t.state;
    r.borderRadiusState = "";
    var n = e.datas, a = e.isDouble;
    if (!n.isRound)
      return !1;
    var i = n.isControl, o = n.controlIndex, s = n.isLine, l = n.lineIndex, u = n.controlPoses, c = u.filter(function(y) {
      var b = y.virtual;
      return b;
    }).length, f = t.props.roundClickable, d = f === void 0 ? !0 : f;
    if (a && d) {
      if (i && (d === !0 || d === "control"))
        lh(u, o);
      else if (s && (d === !0 || d === "line")) {
        var p = N(lu(t, e), 2), h = p[0], m = p[1];
        oh(u, l, h, m);
      }
      c !== u.filter(function(y) {
        var b = y.virtual;
        return b;
      }).length && rl(t, e, [0, 0], [0, 0], u);
    }
    var x = ye(t, e, {});
    return ct(t, "onRoundEnd", x), r.borderRadiusState = "", x;
  },
  dragGroupControlStart: function(t, e) {
    var r = this.dragControlStart(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Pe(t, "roundable", e), o = P({ targets: t.props.targets, events: i.map(function(s, l) {
      return P(P({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] });
    }) }, r);
    return ct(t, "onRoundGroupStart", o), r;
  },
  dragGroupControl: function(t, e) {
    var r = this.dragControl(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Pe(t, "roundable", e), o = P({ targets: t.props.targets, events: i.map(function(s, l) {
      return P(P(P({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] }), ce({
        borderRadius: r.borderRadius
      }, s));
    }) }, r);
    return ct(t, "onRoundGroup", o), o;
  },
  dragGroupControlEnd: function(t, e) {
    var r = t.moveables, n = t.props.targets, a = Pe(t, "roundable", e);
    Aa(t, "onRound", function(s) {
      var l = P({ targets: t.props.targets, events: a.map(function(u, c) {
        return P(P(P({}, u), { target: n[c], moveable: r[c], currentTarget: r[c] }), ce({
          borderRadius: s.borderRadius
        }, u));
      }) }, s);
      ct(t, "onRoundGroup", l);
    });
    var i = this.dragControlEnd(t, e);
    if (!i)
      return !1;
    var o = P({ targets: t.props.targets, events: a.map(function(s, l) {
      var u;
      return P(P({}, s), { target: n[l], moveable: r[l], currentTarget: r[l], lastEvent: (u = s.datas) === null || u === void 0 ? void 0 : u.lastEvent });
    }) }, i);
    return ct(t, "onRoundGroupEnd", o), o;
  },
  unset: function(t) {
    t.state.borderRadiusState = "";
  }
};
function ch(t, e) {
  var r = e ? 4 : 3, n = zt(r), a = "matrix".concat(e ? "3d" : "", "(").concat(n.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var ic = {
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
    var r = t.state, n = r.is3d, a = r.targetMatrix, i = r.inlineTransform, o = n ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(Vl(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = ch(s, n) ? [] : ar(s);
  },
  resetStyle: function(t) {
    var e = t.datas;
    e.nextStyle = {}, e.nextTransforms = t.datas.startTransforms, e.nextTransformAppendedIndexes = [];
  },
  fillDragStartParams: function(t, e) {
    return Et(t, e, {
      setTransform: function(r) {
        e.datas.startTransforms = Yt(r) ? r : ar(r);
      },
      isPinch: !!e.isPinch
    });
  },
  fillDragParams: function(t, e) {
    return Et(t, e, {
      isPinch: !!e.isPinch
    });
  },
  dragStart: function(t, e) {
    this.setTransform(t, e), this.resetStyle(e), ct(t, "onBeforeRenderStart", this.fillDragStartParams(t, e));
  },
  drag: function(t, e) {
    e.datas.startTransforms || this.setTransform(t, e), this.resetStyle(e), ct(t, "onBeforeRender", Et(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  dragEnd: function(t, e) {
    e.datas.startTransforms || (this.setTransform(t, e), this.resetStyle(e)), ct(t, "onBeforeRenderEnd", Et(t, e, {
      isPinch: !!e.isPinch,
      isDrag: e.isDrag
    }));
  },
  dragGroupStart: function(t, e) {
    var r = this;
    this.dragStart(t, e);
    var n = Pe(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.setTransform(l, o), r.resetStyle(o), r.fillDragStartParams(l, o);
    });
    ct(t, "onBeforeRenderGroupStart", Et(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets,
      setTransform: function() {
      },
      events: i
    }));
  },
  dragGroup: function(t, e) {
    var r = this;
    this.drag(t, e);
    var n = Pe(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.resetStyle(o), r.fillDragParams(l, o);
    });
    ct(t, "onBeforeRenderGroup", Et(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets,
      events: i
    }));
  },
  dragGroupEnd: function(t, e) {
    this.dragEnd(t, e), ct(t, "onBeforeRenderGroupEnd", Et(t, e, {
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
}, oc = {
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
    ct(t, "onRenderStart", Et(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  drag: function(t, e) {
    ct(t, "onRender", this.fillDragParams(t, e));
  },
  dragAfter: function(t, e) {
    return this.drag(t, e);
  },
  dragEnd: function(t, e) {
    ct(t, "onRenderEnd", this.fillDragEndParams(t, e));
  },
  dragGroupStart: function(t, e) {
    ct(t, "onRenderGroupStart", Et(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets
    }));
  },
  dragGroup: function(t, e) {
    var r = this, n = Pe(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragParams(l, o);
    });
    ct(t, "onRenderGroup", Et(t, e, P(P({ isPinch: !!e.isPinch, targets: t.props.targets, transform: Jn(e), transformObject: {} }, ce(Qn(e))), { events: i })));
  },
  dragGroupEnd: function(t, e) {
    var r = this, n = Pe(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragEndParams(l, o);
    });
    ct(t, "onRenderGroupEnd", Et(t, e, P({ isPinch: !!e.isPinch, isDrag: e.isDrag, targets: t.props.targets, events: i, transformObject: {}, transform: Jn(e) }, ce(Qn(e)))));
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
    var r = {};
    return Fr(xa(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), Et(t, e, P({ isPinch: !!e.isPinch, transformObject: r, transform: Jn(e) }, ce(Qn(e))));
  },
  fillDragEndParams: function(t, e) {
    var r = {};
    return Fr(xa(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), Et(t, e, P({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: r, transform: Jn(e) }, ce(Qn(e))));
  }
};
function pn(t, e, r, n, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", u = a === "After", c = t.state.target, f = i.isRequest, d = n.indexOf("Control") > -1;
  if (!c || s && d && !f && t.areaElement === i.inputEvent.target)
    return !1;
  var p = J([], N(e), !1);
  if (f) {
    var h = i.requestAble;
    p.some(function(O) {
      return O.name === h;
    }) || p.push.apply(p, J([], N(t.props.ables.filter(function(O) {
      return O.name === h;
    })), !1));
  }
  if (!p.length || p.every(function(O) {
    return O.dragRelation;
  }))
    return !1;
  var m = i.inputEvent, x;
  l && m && (x = document.elementFromPoint(i.clientX, i.clientY) || m.target);
  var y = !1, b = function() {
    var O;
    y = !0, (O = i.stop) === null || O === void 0 || O.call(i);
  }, E = s && (!t.targetGesto || !t.controlGesto || !t.targetGesto.isFlag() || !t.controlGesto.isFlag());
  E && t.updateRect(a, !0, !1);
  var w = i.datas, _ = d ? "controlGesto" : "targetGesto", D = t[_], M = function(O, R, j) {
    if (!(R in O) || D !== t[_])
      return !1;
    var A = O.name, W = w[A] || (w[A] = {});
    if (s && (W.isEventStart = !j || !O[j] || O[j](t, i)), !W.isEventStart)
      return !1;
    var X = O[R](t, P(P({}, i), { stop: b, datas: W, originalDatas: w, inputTarget: x }));
    return t._emitter.off(), s && X === !1 && (W.isEventStart = !1), X;
  };
  E && p.forEach(function(O) {
    O.unset && O.unset(t);
  }), M(ic, "drag".concat(n).concat(a));
  var g = 0, T = 0;
  r.forEach(function(O) {
    if (y)
      return !1;
    var R = "".concat(O).concat(n).concat(a), j = "".concat(O).concat(n, "Condition");
    a === "" && !f && Ov(t.state, i);
    var A = p.filter(function(L) {
      return L[R];
    });
    A = A.filter(function(L, q) {
      return L.name && A.indexOf(L) === q;
    });
    var W = A.filter(function(L) {
      return M(L, R, j);
    }), X = W.length;
    y && ++g, X && ++T, !y && s && A.length && !X && (g += A.filter(function(L) {
      var q = L.name, V = w[q];
      return V.isEventStart ? L.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!u || T) && M(oc, "drag".concat(n).concat(a));
  var k = D !== t[_] || g === r.length;
  if ((l || y || k) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(O) {
    O.state.gestos = {};
  }), p.forEach(function(O) {
    O.unset && O.unset(t);
  })), s && !k && !f && T && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || k)
    return !1;
  if (!s && T && !o || l) {
    var z = t.props.flushSync || Au;
    z(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !u && T && !o && pn(t, e, r, n, a + "After", i), !0;
}
function Po(t, e) {
  return function(r, n) {
    var a;
    n === void 0 && (n = r.inputEvent.target);
    var i = n, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || Qt(i, "moveable-area") || Qt(i, "moveable-padding") || Qt(i, "moveable-edgeDraggable");
  };
}
function sc(t, e, r) {
  var n = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(n), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var u = Po(t);
  return uc(t, a, "targetAbles", r, {
    dragStart: u,
    pinchStart: u
  });
}
function lc(t, e) {
  var r = t.controlBox, n = [];
  n.push(r);
  var a = Po(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === r)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return uc(t, n, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function uc(t, e, r, n, a) {
  a === void 0 && (a = {});
  var i = r === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, u = o.preventClickEventOnDrag, c = o.preventClickDefault, f = o.checkInput, d = o.dragFocusedInput, p = o.preventDefault, h = p === void 0 ? !0 : p, m = o.preventRightClick, x = m === void 0 ? !0 : m, y = o.preventWheelClick, b = y === void 0 ? !0 : y, E = o.dragContainer, w = Fe(E, !0), _ = {
    preventDefault: h,
    preventRightClick: x,
    preventWheelClick: b,
    container: w || we(t.getControlBoxElement()),
    pinchThreshold: l,
    pinchOutside: s,
    preventClickEventOnDrag: i ? u : !1,
    preventClickEventOnDragStart: i ? c : !1,
    preventClickEventByCondition: i ? null : function(g) {
      return t.controlBox.contains(g.target);
    },
    checkInput: i ? f : !1,
    dragFocusedInput: d
  }, D = new tu(e, _), M = n === "Control";
  return ["drag", "pinch"].forEach(function(g) {
    ["Start", "", "End"].forEach(function(T) {
      D.on("".concat(g).concat(T), function(k) {
        var z, O = k.eventType, R = g === "drag" && k.isPinch;
        if (a[O] && !a[O](k)) {
          k.stop();
          return;
        }
        if (!R) {
          var j = g === "drag" ? [g] : ["drag", g], A = J([], N(t[r]), !1), W = pn(t, A, j, n, T, k);
          W ? (t.props.stopPropagation || T === "Start" && M) && ((z = k == null ? void 0 : k.inputEvent) === null || z === void 0 || z.stopPropagation()) : k.stop();
        }
      });
    });
  }), D;
}
var fh = /* @__PURE__ */ (function() {
  function t(e, r, n) {
    var a = this;
    this.target = e, this.moveable = r, this.eventName = n, this.ables = [], this._onEvent = function(i) {
      var o = a.eventName, s = a.moveable;
      s.state.disableNativeEvent || a.ables.forEach(function(l) {
        l[o](s, {
          inputEvent: i
        });
      });
    }, e.addEventListener(n.toLowerCase(), this._onEvent);
  }
  return t.prototype.setAbles = function(e) {
    this.ables = e;
  }, t.prototype.destroy = function() {
    this.target.removeEventListener(this.eventName.toLowerCase(), this._onEvent), this.target = null, this.moveable = null;
  }, t;
})();
function dh(t, e, r, n) {
  var a;
  r === void 0 && (r = e);
  var i = vu(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, u = i.transformOrigin, c = i.targetOrigin, f = i.offsetContainer, d = i.hasFixed, p = i.zoom, h = _p(f, r), m = h.matrixes, x = h.is3d, y = h.offsetContainer, b = h.zoom, E = n, w = 4, _ = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, D = l, M = zt(w), g = zt(w), T = zt(w), k = zt(w), z = o.length, O = m.map(function(q) {
    return P(P({}, q), { matrix: q.matrix ? J([], N(q.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && E && (D = Ne(D, 3, 4), Li(o)), !x && E && Li(O), O.forEach(function(q) {
    g = Nt(g, q.matrix, w);
  });
  var R = r || sr(t), j = ((a = O[0]) === null || a === void 0 ? void 0 : a.target) || bn(R, R, !0).offsetParent, A = O.slice(1).reduce(function(q, V) {
    return Nt(q, V.matrix, w);
  }, zt(w));
  o.forEach(function(q, V) {
    if (z - 2 === V && (T = M.slice()), z - 1 === V && (k = M.slice()), !q.matrix) {
      var F = o[V + 1], et = Tv(q, F, j, w, Nt(A, M, w));
      q.matrix = xr(et, w);
    }
    M = Nt(M, q.matrix, w);
  });
  var W = !_ && s;
  D || (D = zt(W ? 4 : 3));
  var X = ja(_ && D.length === 16 ? Ne(D, 4, 3) : D, W), L = g;
  return g = $l(g, w, w), {
    hasZoom: p !== 1 || b !== 1,
    hasFixed: d,
    matrixes: o,
    rootMatrix: g,
    originalRootMatrix: L,
    beforeMatrix: T,
    offsetMatrix: k,
    allMatrix: M,
    targetMatrix: D,
    targetTransform: X,
    inlineTransform: t.style.transform,
    transformOrigin: u,
    targetOrigin: c,
    is3d: E,
    offsetContainer: f,
    offsetRootContainer: y
  };
}
function ph(t, e, r, n) {
  r === void 0 && (r = e);
  var a = 0, i = 0, o = 0, s = {}, l = Lu(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var u = dh(t, e, r, n), c = Ar(u.allMatrix, u.transformOrigin, a, i);
    s = P(P({}, u), c);
    var f = Ar(u.allMatrix, [50, 50], 100, 100);
    o = Wu([f.pos1, f.pos2], f.direction);
  }
  var d = 4;
  return P(P(P({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: zt(d), rootMatrix: zt(d), beforeMatrix: zt(d), offsetMatrix: zt(d), allMatrix: zt(d), targetMatrix: zt(d), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function Hi(t, e, r, n, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = ea(), u = ea(), c = ea(), f = ea(), d = [0, 0], p = {}, h = ph(e, r, a, !0);
  if (e) {
    var m = ve(e);
    i.forEach(function(O) {
      p[O] = m(O);
    });
    var x = h.is3d ? 4 : 3, y = Ar(h.offsetMatrix, Tt(h.transformOrigin, ql(h.targetMatrix, x)), h.width, h.height);
    o = y.direction, s = Tt(y.origin, [y.left - h.left, y.top - h.top]), f = dn(h.offsetRootContainer);
    var b = bn(n, n, !0).offsetParent || h.offsetRootContainer;
    if (h.hasZoom) {
      var E = Ar(Nt(h.originalRootMatrix, h.allMatrix), h.transformOrigin, h.width, h.height), w = Ar(h.originalRootMatrix, Ca(ve(b)("transformOrigin")).map(function(O) {
        return parseFloat(O);
      }), b.offsetWidth, b.offsetHeight);
      if (l = si(E, f), c = si(w, f, b, !0), t) {
        var _ = E.left, D = E.top;
        u = si({
          left: _,
          top: D,
          bottom: D,
          right: D
        }, f);
      }
    } else {
      l = dn(e), c = Dp(b), t && (u = dn(t));
      var M = c.left, g = c.top, T = c.clientLeft, k = c.clientTop, z = [
        l.left - M,
        l.top - g
      ];
      d = vt(Xr(h.rootMatrix, z, 4), [T + h.left, k + h.top]);
    }
  }
  return P({ targetClientRect: l, containerClientRect: c, moveableClientRect: u, rootContainerClientRect: f, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: p, offsetDelta: d }, h);
}
function al(t) {
  var e = t.pos1, r = t.pos2, n = t.pos3, a = t.pos4;
  if (!e || !r || !n || !a)
    return null;
  var i = yr([e, r, n, a]), o = [i.minX, i.minY], s = vt(t.origin, o);
  return e = vt(e, o), r = vt(r, o), n = vt(n, o), a = vt(a, o), P(P({}, t), {
    left: t.left,
    top: t.top,
    posDelta: o,
    pos1: e,
    pos2: r,
    pos3: n,
    pos4: a,
    origin: s,
    beforeOrigin: s,
    // originalBeforeOrigin: origin,
    isPersisted: !0
  });
}
var Hr = /* @__PURE__ */ (function(t) {
  Dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.state = P({ container: null, gestos: {}, renderLines: [
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]]
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, Hi(null)), r.renderState = {}, r.enabledAbles = [], r.targetAbles = [], r.controlAbles = [], r.rotation = 0, r.scale = [1, 1], r.isMoveableMounted = !1, r.isUnmounted = !1, r.events = {
      mouseEnter: null,
      mouseLeave: null
    }, r._emitter = new wn(), r._prevOriginalDragTarget = null, r._originalDragTarget = null, r._prevDragTarget = null, r._dragTarget = null, r._prevPropTarget = null, r._propTarget = null, r._prevDragArea = !1, r._isPropTargetChanged = !1, r._hasFirstTarget = !1, r._reiszeObserver = null, r._observerId = 0, r._mutationObserver = null, r._rootContainer = null, r._viewContainer = null, r._viewClassNames = [], r._store = {}, r.checkUpdateRect = function() {
      if (!r.isDragging()) {
        var n = r.props.parentMoveable;
        if (n) {
          n.checkUpdateRect();
          return;
        }
        rd(r._observerId), r._observerId = Yl(function() {
          r.isDragging() || r.updateRect();
        });
      }
    }, r._onPreventClick = function(n) {
      n.stopPropagation(), n.preventDefault();
    }, r;
  }
  return e.prototype.render = function() {
    var r = this.props, n = this.getState(), a = r.parentPosition, i = r.className, o = r.target, s = r.zoom, l = r.cspNonce, u = r.translateZ, c = r.cssStyled, f = r.groupable, d = r.linePadding, p = r.controlPadding;
    this._checkUpdateRootContainer(), this.checkUpdate(), this.updateRenderPoses();
    var h = N(a || [0, 0], 2), m = h[0], x = h[1], y = n.left, b = n.top, E = n.target, w = n.direction, _ = n.hasFixed, D = n.offsetDelta, M = r.targets, g = this.isDragging(), T = {};
    this.getEnabledAbles().forEach(function(A) {
      T["data-able-".concat(A.name.toLowerCase())] = !0;
    });
    var k = this._getAbleClassName(), z = M && M.length && (E || f) || o || !this._hasFirstTarget && this.state.isPersisted, O = this.controlBox || this.props.firstRenderState || this.props.persistData, R = [y - m, b - x];
    !f && r.useAccuratePosition && (R[0] += D[0], R[1] += D[1]);
    var j = {
      position: _ ? "fixed" : "absolute",
      display: z ? "block" : "none",
      visibility: O ? "visible" : "hidden",
      transform: "translate3d(".concat(R[0], "px, ").concat(R[1], "px, ").concat(u, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return d && (j["--moveable-line-padding"] = d), p && (j["--moveable-control-padding"] = p), rt.createElement(
      c,
      P({ cspNonce: l, ref: nr(this, "controlBox"), className: "".concat(dt("control-box", w === -1 ? "reverse" : "", g ? "dragging" : ""), " ").concat(k, " ").concat(i) }, T, { onClick: this._onPreventClick, style: j }),
      this.renderAbles(),
      this._renderLines()
    );
  }, e.prototype.componentDidMount = function() {
    this.isMoveableMounted = !0, this.isUnmounted = !1;
    var r = this.props, n = r.parentMoveable, a = r.container;
    this._checkUpdateRootContainer(), this._checkUpdateViewContainer(), this._updateTargets(), this._updateNativeEvents(), this._updateEvents(), this.updateCheckInput(), this._updateObserver(this.props), !a && !n && !this.state.isPersisted && (this.updateRect("", !1, !1), this.forceUpdate());
  }, e.prototype.componentDidUpdate = function(r) {
    this._checkUpdateRootContainer(), this._checkUpdateViewContainer(), this._updateNativeEvents(), this._updateTargets(), this._updateEvents(), this.updateCheckInput(), this._updateObserver(r);
  }, e.prototype.componentWillUnmount = function() {
    var r, n;
    this.isMoveableMounted = !1, this.isUnmounted = !0, this._emitter.off(), (r = this._reiszeObserver) === null || r === void 0 || r.disconnect(), (n = this._mutationObserver) === null || n === void 0 || n.disconnect();
    var a = this._viewContainer;
    a && this._changeAbleViewClassNames([]), zr(this, !1), zr(this, !0);
    var i = this.events;
    for (var o in i) {
      var s = i[o];
      s && s.destroy();
    }
  }, e.prototype.getTargets = function() {
    var r = this.props.target;
    return r ? [r] : [];
  }, e.prototype.getAble = function(r) {
    var n = this.props.ables || [];
    return xe(n, function(a) {
      return a.name === r;
    });
  }, e.prototype.getContainer = function() {
    var r = this.props, n = r.parentMoveable, a = r.wrapperMoveable, i = r.container;
    return i || a && a.getContainer() || n && n.getContainer() || this.controlBox.parentElement;
  }, e.prototype.getControlBoxElement = function() {
    return this.controlBox;
  }, e.prototype.getDragElement = function() {
    return this._dragTarget;
  }, e.prototype.isMoveableElement = function(r) {
    var n;
    return r && (((n = r.getAttribute) === null || n === void 0 ? void 0 : n.call(r, "class")) || "").indexOf(po) > -1;
  }, e.prototype.dragStart = function(r, n) {
    n === void 0 && (n = r.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && Po(this)({ inputEvent: r }, n) ? a.isFlag() || a.triggerDragStart(r) : i && this.isMoveableElement(n) && (i.isFlag() || i.triggerDragStart(r)), this;
  }, e.prototype.hitTest = function(r) {
    var n = this.state, a = n.target, i = n.pos1, o = n.pos2, s = n.pos3, l = n.pos4, u = n.targetClientRect;
    if (!a)
      return 0;
    var c;
    if (xn(r)) {
      var f = r.getBoundingClientRect();
      c = {
        left: f.left,
        top: f.top,
        width: f.width,
        height: f.height
      };
    } else
      c = P({ width: 0, height: 0 }, r);
    var d = c.left, p = c.top, h = c.width, m = c.height, x = Mi([i, o, l, s], u), y = Pd(x, [
      [d, p],
      [d + h, p],
      [d + h, p + m],
      [d, p + m]
    ]), b = ln(x);
    return !y || !b ? 0 : Math.min(100, y / b * 100);
  }, e.prototype.isInside = function(r, n) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, u = a.pos4, c = a.targetClientRect;
    return i ? ga([r, n], Mi([o, s, u, l], c)) : !1;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && Wr(!0);
    var s = i.parentMoveable, l = this.state, u = l.target || i.target, c = this.getContainer(), f = s ? s._rootContainer : this._rootContainer, d = Hi(this.controlBox, u, c, c, f || c, this._getRequestStyles());
    if (!u && this._hasFirstTarget && i.persistData) {
      var p = al(i.persistData);
      for (var h in p)
        d[h] = p[h];
    }
    o && Wr(), this.updateState(d, s ? !1 : a);
  }, e.prototype.isDragging = function(r) {
    var n, a, i = this.targetGesto, o = this.controlGesto;
    if (i != null && i.isFlag()) {
      if (!r)
        return !0;
      var s = i.getEventData();
      return !!(!((n = s[r]) === null || n === void 0) && n.isEventStart);
    }
    if (o != null && o.isFlag()) {
      if (!r)
        return !0;
      var s = o.getEventData();
      return !!(!((a = s[r]) === null || a === void 0) && a.isEventStart);
    }
    return !1;
  }, e.prototype.updateTarget = function(r) {
    this.updateRect(r, !0);
  }, e.prototype.getRect = function() {
    var r = this.state, n = ke(this.state), a = N(n, 4), i = a[0], o = a[1], s = a[2], l = a[3], u = De(n), c = r.width, f = r.height, d = u.width, p = u.height, h = u.left, m = u.top, x = [r.left, r.top], y = Tt(x, r.origin), b = Tt(x, r.beforeOrigin), E = r.transformOrigin;
    return {
      width: d,
      height: p,
      left: h,
      top: m,
      pos1: i,
      pos2: o,
      pos3: s,
      pos4: l,
      offsetWidth: c,
      offsetHeight: f,
      beforeOrigin: b,
      origin: y,
      transformOrigin: E,
      rotation: this.getRotation()
    };
  }, e.prototype.getManager = function() {
    return this;
  }, e.prototype.stopDrag = function(r) {
    if (!r || r === "target") {
      var n = this.targetGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && Wi(this, !1), n == null || n.stop();
    }
    if (!r || r === "control") {
      var n = this.controlGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && Wi(this, !0), n == null || n.stop();
    }
  }, e.prototype.getRotation = function() {
    var r = this.state, n = r.pos1, a = r.pos2, i = r.direction;
    return jv(n, a, i);
  }, e.prototype.request = function(r, n, a) {
    n === void 0 && (n = {});
    var i = this, o = i.props, s = o.parentMoveable || o.wrapperMoveable || i, l = s.props.ables, u = o.groupable, c = xe(l, function(y) {
      return y.name === r;
    });
    if (this.isDragging() || !c || !c.request)
      return {
        request: function() {
          return this;
        },
        requestEnd: function() {
          return this;
        }
      };
    var f = c.request(i), d = a || n.isInstant, p = f.isControl ? "controlAbles" : "targetAbles", h = "".concat(u ? "Group" : "").concat(f.isControl ? "Control" : ""), m = J([], N(s[p]), !1), x = {
      request: function(y) {
        return pn(i, m, ["drag"], h, "", P(P({}, f.request(y)), { requestAble: r, isRequest: !0 }), d), x;
      },
      requestEnd: function() {
        return pn(i, m, ["drag"], h, "End", P(P({}, f.requestEnd()), { requestAble: r, isRequest: !0 }), d), x;
      }
    };
    return pn(i, m, ["drag"], h, "Start", P(P({}, f.requestStart(n)), { requestAble: r, isRequest: !0 }), d), d ? x.request(n).requestEnd() : x;
  }, e.prototype.getMoveables = function() {
    return [this];
  }, e.prototype.destroy = function() {
    this.componentWillUnmount();
  }, e.prototype.updateRenderPoses = function() {
    var r = this.getState(), n = this.props, a = n.padding, i = r.originalBeforeOrigin, o = r.transformOrigin, s = r.allMatrix, l = r.is3d, u = r.pos1, c = r.pos2, f = r.pos3, d = r.pos4, p = r.left, h = r.top, m = r.isPersisted, x = n.zoom || 1;
    if (!a && x <= 1) {
      r.renderPoses = [
        u,
        c,
        f,
        d
      ], r.renderLines = [
        [u, c],
        [c, d],
        [d, f],
        [f, u]
      ];
      return;
    }
    var y = Ju(a || {}), b = y.left, E = y.top, w = y.bottom, _ = y.right, D = l ? 4 : 3, M = [];
    m ? M = o : this.controlBox && n.groupable ? M = i : M = Tt(i, [p, h]);
    var g = ha(D, xr(M.map(function(j) {
      return -j;
    }), D), s, xr(o, D)), T = Ce(g, u, [-b, -E], D), k = Ce(g, c, [_, -E], D), z = Ce(g, f, [-b, w], D), O = Ce(g, d, [_, w], D);
    r.renderPoses = [
      T,
      k,
      z,
      O
    ], r.renderLines = [
      [T, k],
      [k, O],
      [O, z],
      [z, T]
    ];
    {
      var R = x / 2;
      r.renderLines = [
        [
          Ce(g, u, [-b - R, -E], D),
          Ce(g, c, [_ + R, -E], D)
        ],
        [
          Ce(g, c, [_, -E - R], D),
          Ce(g, d, [_, w + R], D)
        ],
        [
          Ce(g, d, [_ + R, w], D),
          Ce(g, f, [-b - R, w], D)
        ],
        [
          Ce(g, f, [-b, w + R], D),
          Ce(g, u, [-b, -E - R], D)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var r = this.props, n = r.target, a = r.container, i = r.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !n)) {
      this.updateAbles();
      var u = !Yi(s, n), c = u || !Yi(l, a);
      if (c) {
        var f = a || this.controlBox;
        f && this.unsetAbles(), this.updateState({ target: n, container: a }), !i && f && this.updateRect("End", !1, !1), this._isPropTargetChanged = u;
      }
    }
  }, e.prototype.waitToChangeTarget = function() {
    return new Promise(function() {
    });
  }, e.prototype.triggerEvent = function(r, n) {
    var a = this.props;
    if (this._emitter.trigger(r, n), a.parentMoveable && n.isRequest && !n.isRequestChild)
      return a.parentMoveable.triggerEvent(r, n, !0);
    var i = a[r];
    return i && i(n);
  }, e.prototype.useCSS = function(r, n) {
    var a = this.props.customStyledMap, i = r + n;
    return a[i] || (a[i] = ru(r, n)), a[i];
  }, e.prototype.getState = function() {
    var r, n = this.props;
    (n.target || !((r = n.targets) === null || r === void 0) && r.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = n.persistData, o = n.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = al(i);
      if (s)
        return this.updateState(s, !1), this.state;
    }
    return this.state.isPersisted = !1, this.state;
  }, e.prototype.updateSelectors = function() {
  }, e.prototype.unsetAbles = function() {
    var r = this;
    this.targetAbles.forEach(function(n) {
      n.unset && n.unset(r);
    });
  }, e.prototype.updateAbles = function(r, n) {
    r === void 0 && (r = this.props.ables), n === void 0 && (n = "");
    var a = this.props, i = a.triggerAblesSimultaneously, o = this.getEnabledAbles(r), s = "drag".concat(n, "Start"), l = "pinch".concat(n, "Start"), u = "drag".concat(n, "ControlStart"), c = ra(o, [s, l], i), f = ra(o, [u], i);
    this.enabledAbles = o, this.targetAbles = c, this.controlAbles = f;
  }, e.prototype.updateState = function(r, n) {
    if (n) {
      if (this.isUnmounted)
        return;
      this.setState(r);
    } else {
      var a = this.state;
      for (var i in r)
        a[i] = r[i];
    }
  }, e.prototype.getEnabledAbles = function(r) {
    r === void 0 && (r = this.props.ables);
    var n = this.props;
    return r.filter(function(a) {
      return a && (a.always && n[a.name] !== !1 || n[a.name]);
    });
  }, e.prototype.renderAbles = function() {
    var r = this, n = this.props, a = n.triggerAblesSimultaneously, i = {
      createElement: rt.createElement
    };
    return this.renderState = {}, Pv(Vu(ra(this.getEnabledAbles(), ["render"], a).map(function(o) {
      var s = o.render;
      return s(r, i) || [];
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
    var r = this.getEnabledAbles().reduce(function(n, a) {
      var i, o, s = (o = (i = a.requestStyle) === null || i === void 0 ? void 0 : i.call(a)) !== null && o !== void 0 ? o : [];
      return J(J([], N(n), !1), N(s), !1);
    }, J([], N(this.props.requestStyles || []), !1));
    return r;
  }, e.prototype._updateObserver = function(r) {
    this._updateResizeObserver(r), this._updateMutationObserver(r);
  }, e.prototype._updateEvents = function() {
    var r = this.targetAbles.length, n = this.controlAbles.length, a = this._dragTarget, i = !r && this.targetGesto || this._isTargetChanged(!0);
    i && (zr(this, !1), this.updateState({ gestos: {} })), n || zr(this, !0), a && r && !this.targetGesto && (this.targetGesto = sc(this, a, "")), !this.controlGesto && n && (this.controlGesto = lc(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var r = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = r.dragArea, this._propTarget = r.target, this._originalDragTarget = r.dragTarget || r.target, this._dragTarget = Fe(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var r = this.props, n = r, a = n.zoom, i = n.hideDefaultLines, o = n.hideChildMoveableDefaultLines, s = n.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), u = {
      createElement: rt.createElement
    };
    return l.renderLines.map(function(c, f) {
      return yn(u, "", c[0], c[1], a, "render-line-".concat(f));
    });
  }, e.prototype._isTargetChanged = function(r) {
    var n = this.props, a = n.dragTarget || n.target, i = this._prevOriginalDragTarget, o = this._prevDragArea, s = n.dragArea, l = !s && i !== a, u = (r || s) && o !== s;
    return l || u || this._prevPropTarget != this._propTarget;
  }, e.prototype._updateNativeEvents = function() {
    var r = this, n = this.props, a = n.dragArea ? this.areaElement : this.state.target, i = this.events, o = $r(i);
    if (this._isTargetChanged())
      for (var s in i) {
        var l = i[s];
        l && l.destroy(), i[s] = null;
      }
    if (a) {
      var u = this.enabledAbles;
      o.forEach(function(c) {
        var f = ra(u, [c]), d = f.length > 0, p = i[c];
        if (!d) {
          p && (p.destroy(), i[c] = null);
          return;
        }
        p || (p = new fh(a, r, c), i[c] = p), p.setAbles(f);
      });
    }
  }, e.prototype._checkUpdateRootContainer = function() {
    var r = this.props.rootContainer;
    !this._rootContainer && r && (this._rootContainer = Fe(r, !0));
  }, e.prototype._checkUpdateViewContainer = function() {
    var r = this.props.viewContainer;
    !this._viewContainer && r && (this._viewContainer = Fe(r, !0));
    var n = this._viewContainer;
    n && this._changeAbleViewClassNames(J(J([], N(this._getAbleViewClassNames()), !1), [
      this.isDragging() ? Yv : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(r) {
    var n = this._viewContainer, a = qu(r.filter(Boolean), function(u) {
      return u;
    }).map(function(u) {
      var c = N(u, 1), f = c[0];
      return f;
    }), i = this._viewClassNames, o = uo(i, a), s = o.removed, l = o.added;
    s.forEach(function(u) {
      Xl(n, i[u]);
    }), l.forEach(function(u) {
      ao(n, a[u]);
    }), this._viewClassNames = a;
  }, e.prototype._getAbleViewClassNames = function() {
    var r = this;
    return (this.getEnabledAbles().map(function(n) {
      var a;
      return ((a = n.viewClassName) === null || a === void 0 ? void 0 : a.call(n, r)) || "";
    }).join(" ") + " ".concat(this._getAbleClassName("-view"))).split(/\s+/g);
  }, e.prototype._getAbleClassName = function(r) {
    var n = this;
    r === void 0 && (r = "");
    var a = this.getEnabledAbles(), i = this.targetGesto, o = this.controlGesto, s = i != null && i.isFlag() ? i.getEventData() : {}, l = o != null && o.isFlag() ? o.getEventData() : {};
    return a.map(function(u) {
      var c, f, d, p = u.name, h = ((c = u.className) === null || c === void 0 ? void 0 : c.call(u, n)) || "";
      return (!((f = s[p]) === null || f === void 0) && f.isEventStart || !((d = l[p]) === null || d === void 0) && d.isEventStart) && (h += " ".concat(dt("".concat(p).concat(r, "-dragging")))), h.trim();
    }).filter(Boolean).join(" ");
  }, e.prototype._updateResizeObserver = function(r) {
    var n, a = this.props, i = a.target, o = we(this.getControlBoxElement());
    if (!o.ResizeObserver || !i || !a.useResizeObserver) {
      (n = this._reiszeObserver) === null || n === void 0 || n.disconnect();
      return;
    }
    if (!(r.target === i && this._reiszeObserver)) {
      var s = new o.ResizeObserver(this.checkUpdateRect);
      s.observe(i, {
        box: "border-box"
      }), this._reiszeObserver = s;
    }
  }, e.prototype._updateMutationObserver = function(r) {
    var n = this, a, i = this.props, o = i.target, s = we(this.getControlBoxElement());
    if (!s.MutationObserver || !o || !i.useMutationObserver) {
      (a = this._mutationObserver) === null || a === void 0 || a.disconnect();
      return;
    }
    if (!(r.target === o && this._mutationObserver)) {
      var l = new s.MutationObserver(function(u) {
        var c, f;
        try {
          for (var d = qd(u), p = d.next(); !p.done; p = d.next()) {
            var h = p.value;
            h.type === "attributes" && h.attributeName === "style" && n.checkUpdateRect();
          }
        } catch (m) {
          c = { error: m };
        } finally {
          try {
            p && !p.done && (f = d.return) && f.call(d);
          } finally {
            if (c) throw c.error;
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
    flushSync: Au,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})(rt.PureComponent), Oo = {
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
    var r, n = t.props, a = n.targets || [], i = t.getState(), o = i.left, s = i.top, l = i.isPersisted, u = n.zoom || 1, c = t.renderGroupRects, f = ((r = n.persistData) === null || r === void 0 ? void 0 : r.children) || [];
    l ? a = f.map(function() {
      return null;
    }) : f = [];
    var d = jr(t, "parentPosition", [o, s], function(h) {
      return h.join(",");
    }), p = jr(t, "requestStyles", t.getRequestChildStyles(), function(h) {
      return h.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), J(J([], N(a.map(function(h, m) {
      return e.createElement(Hr, { key: "moveable" + m, ref: Bl(t, "moveables", m), target: h, origin: !1, requestStyles: p, cssStyled: n.cssStyled, customStyledMap: n.customStyledMap, useResizeObserver: n.useResizeObserver, useMutationObserver: n.useMutationObserver, hideChildMoveableDefaultLines: n.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: f[m], zoom: u });
    })), !1), N(Vu(c.map(function(h, m) {
      var x = h.pos1, y = h.pos2, b = h.pos3, E = h.pos4, w = [x, y, b, E];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(_, D) {
        var M = N(_, 2), g = M[0], T = M[1];
        return yn(e, "", vt(w[g], d), vt(w[T], d), u, "group-rect-".concat(m, "-").concat(D));
      });
    }))), !1);
  }
}, vh = _n("clickable", {
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
    var r = t.props.target, n = e.inputEvent, a = e.inputTarget, i = t.isMoveableElement(a), o = !i && t.controlBox.contains(a);
    if (!(!n || !a || e.isDrag || t.isMoveableElement(a) || o)) {
      var s = r.contains(a);
      ct(t, "onClick", Et(t, e, {
        isDouble: e.isDouble,
        inputTarget: a,
        isTarget: r === a,
        moveableTarget: t.props.target,
        containsTarget: s
      }));
    }
  },
  dragGroupEnd: function(t, e) {
    var r = e.inputEvent, n = e.inputTarget;
    if (!(!r || !n || e.isDrag || t.isMoveableElement(n) || e.datas.inputTarget === n)) {
      var a = t.props.targets, i = a.indexOf(n), o = i > -1, s = !1;
      i === -1 && (i = Ve(a, function(l) {
        return l.contains(n);
      }), s = i > -1), ct(t, "onClickGroup", Et(t, e, {
        isDouble: e.isDouble,
        targets: a,
        inputTarget: n,
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
function kr(t) {
  var e = t.originalDatas.draggable;
  return e || (t.originalDatas.draggable = {}, e = t.originalDatas.draggable), P(P({}, t), { datas: e });
}
var hh = _n("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var r = t.props, n = r.edgeDraggable;
    return n ? mu(e, "edgeDraggable", n, t.getState().renderPoses, r.zoom) : [];
  },
  dragCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && Qt(a, dt("direction")) && Qt(a, dt("edge")) && Qt(a, dt("edgeDraggable"));
  },
  dragStart: function(t, e) {
    return le.dragStart(t, kr(e));
  },
  drag: function(t, e) {
    return le.drag(t, kr(e));
  },
  dragEnd: function(t, e) {
    return le.dragEnd(t, kr(e));
  },
  dragGroupCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && Qt(a, dt("direction")) && Qt(a, dt("line"));
  },
  dragGroupStart: function(t, e) {
    return le.dragGroupStart(t, kr(e));
  },
  dragGroup: function(t, e) {
    return le.dragGroup(t, kr(e));
  },
  dragGroupEnd: function(t, e) {
    return le.dragGroupEnd(t, kr(e));
  },
  unset: function(t) {
    return le.unset(t);
  }
}), cc = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, gh = [
  ic,
  ec,
  yv,
  Bv,
  le,
  hh,
  Bi,
  Gv,
  Lv,
  ev,
  $v,
  qv,
  Xv,
  ih,
  ah,
  uh,
  Oo,
  cc,
  vh,
  tc,
  oc
];
function il(t, e) {
  var r = N(t, 3), n = r[0], a = r[1], i = r[2];
  return (n * e[0] + a * e[1] + i) / Math.sqrt(n * n + a * a);
}
function ia(t, e) {
  var r = N(t, 2), n = r[0], a = r[1];
  return -n * e[0] - a * e[1];
}
function ol(t, e) {
  return Math.max.apply(Math, J([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function sl(t, e) {
  return Math.min.apply(Math, J([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function mh(t, e) {
  var r, n, a, i = [0, 0], o = [0, 0], s = [0, 0], l = [0, 0], u = 0, c = 0;
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
      width: u,
      height: c,
      rotation: e
    };
  var f = xt(e, fe);
  if (f % 90) {
    var d = f / 180 * Math.PI, p = Math.tan(d), h = -1 / p, m = [Ni, Is], x = [[0, 0], [0, 0]], y = [Ni, Is], b = [[0, 0], [0, 0]];
    t.forEach(function(tt) {
      tt.forEach(function(K) {
        var nt = il([-p, 1, 0], K), Q = il([-h, 1, 0], K);
        m[0] > nt && (x[0] = K, m[0] = nt), m[1] < nt && (x[1] = K, m[1] = nt), y[0] > Q && (b[0] = K, y[0] = Q), y[1] < Q && (b[1] = K, y[1] = Q);
      });
    });
    var E = N(x, 2), w = E[0], _ = E[1], D = N(b, 2), M = D[0], g = D[1], T = [-p, 1, ia([-p, 1], w)], k = [-p, 1, ia([-p, 1], _)], z = [-h, 1, ia([-h, 1], M)], O = [-h, 1, ia([-h, 1], g)];
    r = N([
      [T, z],
      [T, O],
      [k, z],
      [k, O]
    ].map(function(tt) {
      var K = N(tt, 2), nt = K[0], Q = K[1];
      return co(nt, Q)[0];
    }), 4), i = r[0], o = r[1], s = r[2], l = r[3], u = y[1] - y[0], c = m[1] - m[0];
  } else {
    var R = sl(t, 0), j = sl(t, 1), A = ol(t, 0), W = ol(t, 1);
    if (i = [R, j], o = [A, j], s = [R, W], l = [A, W], u = A - R, c = W - j, f % 180) {
      var X = [s, i, l, o];
      n = N(X, 4), i = n[0], o = n[1], s = n[2], l = n[3], u = W - j, c = A - R;
    }
  }
  if (f % 360 > 180) {
    var X = [l, s, o, i];
    a = N(X, 4), i = a[0], o = a[1], s = a[2], l = a[3];
  }
  var L = yr([i, o, s, l]), q = L.minX, V = L.minY, F = L.maxX, et = L.maxY;
  return {
    pos1: i,
    pos2: o,
    pos3: s,
    pos4: l,
    width: u,
    height: c,
    minX: q,
    minY: V,
    maxX: F,
    maxY: et,
    rotation: e
  };
}
function fc(t, e) {
  var r = e.map(function(n) {
    if (Yt(n)) {
      var a = fc(t, n), i = a.length;
      return i > 1 ? a : i === 1 ? a[0] : null;
    } else {
      var o = xe(t, function(s) {
        var l = s.manager;
        return l.props.target === n;
      });
      return o ? (o.finded = !0, o.manager) : null;
    }
  }).filter(Boolean);
  return r.length === 1 && Yt(r[0]) ? r[0] : r;
}
var xh = /* @__PURE__ */ (function(t) {
  Dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.differ = new Kl(), r.moveables = [], r.transformOrigin = "50% 50%", r.renderGroupRects = [], r._targetGroups = [], r._hasFirstTargets = !1, r;
  }
  return e.prototype.componentDidMount = function() {
    t.prototype.componentDidMount.call(this);
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1, this.updateAbles();
  }, e.prototype.getTargets = function() {
    return this.props.targets;
  }, e.prototype.updateRect = function(r, n, a) {
    var i;
    a === void 0 && (a = !0);
    var o = this.state;
    if (!this.controlBox || o.isPersisted)
      return;
    Wr(!0), this.moveables.forEach(function(it) {
      it.updateRect(r, !1, !1);
    });
    var s = this.props, l = this.moveables, u = o.target || s.target, c = l.map(function(it) {
      return { finded: !1, manager: it };
    }), f = this.props.targetGroups || [], d = fc(c, f), p = s.useDefaultGroupRotate;
    d.push.apply(d, J([], N(c.filter(function(it) {
      var mt = it.finded;
      return !mt;
    }).map(function(it) {
      var mt = it.manager;
      return mt;
    })), !1));
    var h = [], m = !n || r !== "" && s.updateGroup, x = s.defaultGroupRotate || 0;
    if (!this._hasFirstTargets) {
      var y = (i = s.persistData) === null || i === void 0 ? void 0 : i.rotation;
      y != null && (x = y);
    }
    function b(it, mt, yt) {
      var Z = it.map(function(_t) {
        if (Yt(_t)) {
          var St = b(_t, mt), Mt = [St.pos1, St.pos2, St.pos3, St.pos4];
          return h.push(St), { poses: Mt, rotation: St.rotation };
        } else
          return {
            poses: ke(_t.state),
            rotation: _t.getRotation()
          };
      }), ut = Z.map(function(_t) {
        var St = _t.rotation;
        return St;
      }), Ct = 0, pt = ut[0], ht = ut.every(function(_t) {
        return Math.abs(pt - _t) < 0.1;
      });
      m ? Ct = !p && ht ? pt : x : Ct = !p && !yt && ht ? pt : mt;
      var bt = Z.map(function(_t) {
        var St = _t.poses;
        return St;
      }), gt = mh(bt, Ct);
      return gt;
    }
    var E = b(d, this.rotation, !0);
    m && (this.rotation = E.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = f, this.renderGroupRects = h;
    var w = this.transformOrigin, _ = this.rotation, D = this.scale, M = E.width, g = E.height, T = E.minX, k = E.minY, z = Av([
      [0, 0],
      [M, 0],
      [0, g],
      [M, g]
    ], To(w, M, g), this.rotation / 180 * Math.PI), O = yr(z.result), R = O.minX, j = O.minY, A = " rotate(".concat(_, "deg)") + " scale(".concat(ue(D[0]), ", ").concat(ue(D[1]), ")"), W = "translate(".concat(-R, "px, ").concat(-j, "px)").concat(A);
    this.controlBox.style.transform = "translate3d(".concat(T, "px, ").concat(k, "px, ").concat(this.props.translateZ || 0, ")"), u.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(w, ";") + "width:".concat(M, "px;height:").concat(g, "px;") + "transform: ".concat(W), o.width = M, o.height = g;
    var X = this.getContainer(), L = Hi(this.controlBox, u, this.controlBox, this.getContainer(), this._rootContainer || X, []), q = [L.left, L.top], V = N(ke(L), 4), F = V[0], et = V[1], tt = V[2], K = V[3], nt = yr([F, et, tt, K]), Q = [nt.minX, nt.minY], at = ue(D[0] * D[1]);
    L.pos1 = vt(F, Q), L.pos2 = vt(et, Q), L.pos3 = vt(tt, Q), L.pos4 = vt(K, Q), L.left = T - L.left + Q[0], L.top = k - L.top + Q[1], L.origin = vt(Tt(q, L.origin), Q), L.beforeOrigin = vt(Tt(q, L.beforeOrigin), Q), L.originalBeforeOrigin = Tt(q, L.originalBeforeOrigin), L.transformOrigin = vt(Tt(q, L.transformOrigin), Q), u.style.transform = "translate(".concat(-R - Q[0], "px, ").concat(-j - Q[1], "px)") + A, Wr(), this.updateState(P(P({}, L), { posDelta: Q, direction: at, beforeDirection: at }), a);
  }, e.prototype.getRect = function() {
    return P(P({}, t.prototype.getRect.call(this)), { children: this.moveables.map(function(r) {
      return r.getRect();
    }) });
  }, e.prototype.triggerEvent = function(r, n, a) {
    if (a || r.indexOf("Group") > -1)
      return t.prototype.triggerEvent.call(this, r, n);
    this._emitter.trigger(r, n);
  }, e.prototype.getRequestChildStyles = function() {
    var r = this.getEnabledAbles().reduce(function(n, a) {
      var i, o, s = (o = (i = a.requestChildStyle) === null || i === void 0 ? void 0 : i.call(a)) !== null && o !== void 0 ? o : [];
      return J(J([], N(n), !1), N(s), !1);
    }, []);
    return r;
  }, e.prototype.getMoveables = function() {
    return J([], N(this.moveables), !1);
  }, e.prototype.updateAbles = function() {
    t.prototype.updateAbles.call(this, J(J([], N(this.props.ables), !1), [Oo], !1), "Group");
  }, e.prototype._updateTargets = function() {
    t.prototype._updateTargets.call(this), this._originalDragTarget = this.props.dragTarget || this.areaElement, this._dragTarget = Fe(this._originalDragTarget, !0);
  }, e.prototype._updateEvents = function() {
    var r = this.state, n = this.props, a = this._prevDragTarget, i = n.dragTarget || this.areaElement, o = n.targets, s = this.differ.update(o), l = s.added, u = s.changed, c = s.removed, f = l.length || c.length;
    (f || this._prevOriginalDragTarget !== this._originalDragTarget) && (zr(this, !1), zr(this, !0), this.updateState({ gestos: {} })), a !== i && (r.target = null), r.target || (r.target = this.areaElement, this.controlBox.style.display = "block"), r.target && (this.targetGesto || (this.targetGesto = sc(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = lc(this, "GroupControl")));
    var d = !Yi(r.container, n.container);
    d && (r.container = n.container), (d || f || this.transformOrigin !== (n.defaultGroupOrigin || "50% 50%") || u.length || o.length && !Zu(this._targetGroups, n.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!f;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = P(P({}, Hr.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Hr), yh = /* @__PURE__ */ (function(t) {
  Dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.moveables = [], r;
  }
  return e.prototype.render = function() {
    var r = this, n, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], u = l.length, c = this.isUnmounted || !u, f = (n = s == null ? void 0 : s.children) !== null && n !== void 0 ? n : [];
    return c && !u && f.length ? l = f.map(function() {
      return null;
    }) : c || (f = []), rt.createElement(o, { cspNonce: i, ref: nr(this, "controlBox"), className: dt("control-box") }, l.map(function(d, p) {
      var h, m, x = (m = (h = a.individualGroupableProps) === null || h === void 0 ? void 0 : h.call(a, d, p)) !== null && m !== void 0 ? m : {};
      return rt.createElement(Hr, P({ key: "moveable" + p, ref: Bl(r, "moveables", p) }, a, x, { target: d, wrapperMoveable: r, isWrapperMounted: r.isMoveableMounted, persistData: f[p] }));
    }));
  }, e.prototype.componentDidMount = function() {
  }, e.prototype.componentDidUpdate = function() {
  }, e.prototype.getTargets = function() {
    return this.props.targets;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0), Wr(!0), this.moveables.forEach(function(i) {
      i.updateRect(r, n, a);
    }), Wr();
  }, e.prototype.getRect = function() {
    return P(P({}, t.prototype.getRect.call(this)), { children: this.moveables.map(function(r) {
      return r.getRect();
    }) });
  }, e.prototype.request = function(r, n, a) {
    n === void 0 && (n = {});
    var i = this.moveables.map(function(l) {
      return l.request(r, P(P({}, n), { isInstant: !1 }), !1);
    }), o = a || n.isInstant, s = {
      request: function(l) {
        return i.forEach(function(u) {
          return u.request(l);
        }), this;
      },
      requestEnd: function() {
        return i.forEach(function(l) {
          return l.requestEnd();
        }), this;
      }
    };
    return o ? s.request(n).requestEnd() : s;
  }, e.prototype.dragStart = function(r, n) {
    n === void 0 && (n = r.target);
    var a = n, i = xe(this.moveables, function(o) {
      var s = o.getTargets()[0], l = o.getControlBoxElement(), u = o.getDragElement();
      return !s || !u ? !1 : u === a || u.contains(a) || u !== s && s === a || s.contains(a) || l === a || l.contains(a);
    });
    return i && i.dragStart(r, n), this;
  }, e.prototype.hitTest = function() {
    return 0;
  }, e.prototype.isInside = function() {
    return !1;
  }, e.prototype.isDragging = function() {
    return !1;
  }, e.prototype.getDragElement = function() {
    return null;
  }, e.prototype.getMoveables = function() {
    return J([], N(this.moveables), !1);
  }, e.prototype.updateRenderPoses = function() {
  }, e.prototype.checkUpdate = function() {
  }, e.prototype.triggerEvent = function() {
  }, e.prototype.updateAbles = function() {
  }, e.prototype._updateEvents = function() {
  }, e.prototype._updateObserver = function() {
  }, e;
})(Hr);
function dc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (_e(n)) {
        e[n] && r.push.apply(r, J([], N(e[n]), !1));
        return;
      }
      Yt(n) ? r.push.apply(r, J([], N(dc(n, e)), !1)) : r.push(n);
    }
  }), r;
}
function pc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (_e(n)) {
        e[n] && r.push.apply(r, J([], N(e[n]), !1));
        return;
      }
      Yt(n) ? r.push(pc(n, e)) : r.push(n);
    }
  }), r;
}
function vc(t, e) {
  return t.length !== e.length || t.some(function(r, n) {
    var a = e[n];
    return !r && !a ? !1 : r != a ? Yt(r) && Yt(a) ? vc(r, a) : !0 : !1;
  });
}
var bh = /* @__PURE__ */ (function(t) {
  Dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.refTargets = [], r.selectorMap = {}, r._differ = new Kl(), r._elementTargets = [], r._tmpRefTargets = [], r._tmpSelectorMap = {}, r._onChangeTargets = null, r;
  }
  return e.makeStyled = function() {
    var r = {}, n = this.getTotalAbles();
    n.forEach(function(i) {
      var o = i.css;
      o && o.forEach(function(s) {
        r[s] = !0;
      });
    });
    var a = $r(r).join(`
`);
    this.defaultStyled = ru("div", Xf(po, ap + a));
  }, e.getTotalAbles = function() {
    return J([ec, Oo, cc, tc], N(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var r, n = this.constructor;
    n.defaultStyled || n.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = Hd(a, ["ables", "props"]), l = N(this._updateRefs(!0), 2), u = l[0], c = l[1], f = dc(u, c), d = f.length > 1, p = n.getTotalAbles(), h = J(J([], N(p), !1), N(i || []), !1), m = P(P(P({}, s), o || {}), { ables: h, cssStyled: n.defaultStyled, customStyledMap: n.customStyledMap });
    this._elementTargets = f;
    var x = null, y = this.moveable, b = s.persistData;
    if (b != null && b.children && (d = !0), s.individualGroupable)
      return rt.createElement(yh, P({ key: "individual-group", ref: nr(this, "moveable") }, m, { target: null, targets: f }));
    if (d) {
      var E = pc(u, c);
      if (y && !y.props.groupable && !y.props.individualGroupable) {
        var w = y.props.target;
        w && f.indexOf(w) > -1 && (x = P({}, y.state));
      }
      return rt.createElement(xh, P({ key: "group", ref: nr(this, "moveable") }, m, (r = s.groupableProps) !== null && r !== void 0 ? r : {}, { target: null, targets: f, targetGroups: E, firstRenderState: x }));
    } else {
      var _ = f[0];
      if (y && (y.props.groupable || y.props.individualGroupable)) {
        var D = y.moveables || [], M = xe(D, function(g) {
          return g.props.target === _;
        });
        M && (x = P({}, M.state));
      }
      return rt.createElement(Hr, P({ key: "single", ref: nr(this, "moveable") }, m, { target: _, firstRenderState: x }));
    }
  }, e.prototype.componentDidMount = function() {
    this._checkChangeTargets();
  }, e.prototype.componentDidUpdate = function() {
    this._checkChangeTargets();
  }, e.prototype.componentWillUnmount = function() {
    this.selectorMap = {}, this.refTargets = [];
  }, e.prototype.getTargets = function() {
    var r, n;
    return (n = (r = this.moveable) === null || r === void 0 ? void 0 : r.getTargets()) !== null && n !== void 0 ? n : [];
  }, e.prototype.updateSelectors = function() {
    this.selectorMap = {}, this._updateRefs(), this.forceUpdate();
  }, e.prototype.waitToChangeTarget = function() {
    var r = this, n;
    return this._onChangeTargets = function() {
      r._onChangeTargets = null, n();
    }, new Promise(function(a) {
      n = a;
    });
  }, e.prototype.waitToChangeTargets = function() {
    return this.waitToChangeTarget();
  }, e.prototype.getManager = function() {
    return this.moveable;
  }, e.prototype.getMoveables = function() {
    return this.moveable.getMoveables();
  }, e.prototype.getDragElement = function() {
    return this.moveable.getDragElement();
  }, e.prototype._updateRefs = function(r) {
    var n = this.refTargets, a = ko(this.props.target || this.props.targets), i = typeof document < "u", o = vc(n, a), s = this.selectorMap, l = {};
    return this.refTargets.forEach(function u(c) {
      if (_e(c)) {
        var f = s[c];
        f ? l[c] = s[c] : i && (o = !0, l[c] = [].slice.call(document.querySelectorAll(c)));
      } else Yt(c) && c.forEach(u);
    }), this._tmpRefTargets = a, this._tmpSelectorMap = l, [
      a,
      l,
      !r && o
    ];
  }, e.prototype._checkChangeTargets = function() {
    var r, n, a;
    this.refTargets = this._tmpRefTargets, this.selectorMap = this._tmpSelectorMap;
    var i = this._differ.update(this._elementTargets), o = i.added, s = i.removed, l = o.length || s.length;
    l && ((n = (r = this.props).onChangeTargets) === null || n === void 0 || n.call(r, {
      moveable: this.moveable,
      targets: this._elementTargets
    }), (a = this._onChangeTargets) === null || a === void 0 || a.call(this));
    var u = N(this._updateRefs(), 3), c = u[0], f = u[1], d = u[2];
    this.refTargets = c, this.selectorMap = f, d && this.forceUpdate();
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, $d([
    Gl(sp)
  ], e.prototype, "moveable", void 0), e;
})(rt.PureComponent), Sh = /* @__PURE__ */ (function(t) {
  Dn(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = gh, e;
})(bh), $i = function(t, e) {
  return $i = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, $i(t, e);
};
function Ch(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  $i(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
function Eh(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var Tn = Eh(function(t, e) {
  function r(l) {
    if (l && typeof l == "object") {
      var u = l.which || l.keyCode || l.charCode;
      u && (l = u);
    }
    if (typeof l == "number") return o[l];
    var c = String(l), f = n[c.toLowerCase()];
    if (f) return f;
    var f = a[c.toLowerCase()];
    if (f) return f;
    if (c.length === 1) return c.charCodeAt(0);
  }
  r.isEventKey = function(u, c) {
    if (u && typeof u == "object") {
      var f = u.which || u.keyCode || u.charCode;
      if (f == null)
        return !1;
      if (typeof c == "string") {
        var d = n[c.toLowerCase()];
        if (d)
          return d === f;
        var d = a[c.toLowerCase()];
        if (d)
          return d === f;
      } else if (typeof c == "number")
        return c === f;
      return !1;
    }
  }, e = t.exports = r;
  var n = e.code = e.codes = {
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
  for (i = 97; i < 123; i++) n[String.fromCharCode(i)] = i - 32;
  for (var i = 48; i < 58; i++) n[i - 48] = i;
  for (i = 1; i < 13; i++) n["f" + i] = i + 111;
  for (i = 0; i < 10; i++) n["numpad " + i] = i + 96;
  var o = e.names = e.title = {};
  for (i in n) o[n[i]] = i;
  for (var s in a)
    n[s] = a[s];
});
Tn.code;
Tn.codes;
Tn.aliases;
var wh = Tn.names;
Tn.title;
var ll = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, ul = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function hc(t, e) {
  var r = (wh[t] || e || "").toLowerCase();
  for (var n in ll)
    r = r.replace(n, ll[n]);
  return r.replace(/\s/g, "");
}
function gc(t, e) {
  e === void 0 && (e = hc(t.keyCode, t.key));
  var r = Dh(t);
  return r.indexOf(e) === -1 && r.push(e), r.filter(Boolean);
}
function Dh(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function cl(t) {
  var e = t.slice();
  return e.sort(function(r, n) {
    var a = ul[r] || 5, i = ul[n] || 5;
    return a - i;
  }), e;
}
var fl, _h = /* @__PURE__ */ (function(t) {
  Ch(e, t);
  function e(n) {
    n === void 0 && (n = window);
    var a = t.call(this) || this;
    return a.container = n, a.ctrlKey = !1, a.altKey = !1, a.shiftKey = !1, a.metaKey = !1, a.clear = function() {
      return a.ctrlKey = !1, a.altKey = !1, a.shiftKey = !1, a.metaKey = !1, a;
    }, a.keydownEvent = function(i) {
      a.triggerEvent("keydown", i);
    }, a.keyupEvent = function(i) {
      a.triggerEvent("keyup", i);
    }, a.blur = function() {
      a.clear(), a.trigger("blur");
    }, Zt(n, "blur", a.blur), Zt(n, "keydown", a.keydownEvent), Zt(n, "keyup", a.keyupEvent), a;
  }
  var r = e.prototype;
  return Object.defineProperty(e, "global", {
    /**
     */
    get: function() {
      return fl || (fl = new e());
    },
    enumerable: !1,
    configurable: !0
  }), e.setGlobal = function() {
    return this.global;
  }, r.destroy = function() {
    var n = this.container;
    this.clear(), this.off(), Wt(n, "blur", this.blur), Wt(n, "keydown", this.keydownEvent), Wt(n, "keyup", this.keyupEvent);
  }, r.keydown = function(n, a) {
    return this.addEvent("keydown", n, a);
  }, r.offKeydown = function(n, a) {
    return this.removeEvent("keydown", n, a);
  }, r.offKeyup = function(n, a) {
    return this.removeEvent("keyup", n, a);
  }, r.keyup = function(n, a) {
    return this.addEvent("keyup", n, a);
  }, r.addEvent = function(n, a, i) {
    return Yt(a) ? this.on("".concat(n, ".").concat(cl(a).join(".")), i) : _e(a) ? this.on("".concat(n, ".").concat(a), i) : this.on(n, a), this;
  }, r.removeEvent = function(n, a, i) {
    return Yt(a) ? this.off("".concat(n, ".").concat(cl(a).join(".")), i) : _e(a) ? this.off("".concat(n, ".").concat(a), i) : this.off(n, a), this;
  }, r.triggerEvent = function(n, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = hc(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
      key: i,
      isToggle: o,
      inputEvent: a,
      keyCode: a.keyCode,
      ctrlKey: a.ctrlKey,
      altKey: a.altKey,
      shiftKey: a.shiftKey,
      metaKey: a.metaKey
    };
    this.trigger(n, s), this.trigger("".concat(n, ".").concat(i), s);
    var l = gc(a, i);
    l.length > 1 && this.trigger("".concat(n, ".").concat(l.join(".")), s);
  }, e;
})(wn), qi = function(t, e) {
  return qi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, qi(t, e);
};
function mc(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  qi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Kt = function() {
  return Kt = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Kt.apply(this, arguments);
};
function Mh(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function kh(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function vn(t, e, r) {
  for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function Th(t) {
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
function Ih(t) {
  if (typeof Map > "u")
    return t.filter(function(r, n) {
      return t.indexOf(r) === n;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(r) {
    return e.has(r) ? !1 : (e.set(r, !0), !0);
  });
}
function Rh(t, e, r) {
  var n = Re(t);
  return n.elementFromPoint && n.elementFromPoint(e, r) || null;
}
function xc(t, e, r) {
  var n = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || Re(r).createElement(n);
  for (var u in i)
    l.setAttribute(u, i[u]);
  var c = l.children;
  if (a.forEach(function(d, p) {
    xc(d, c[p], l);
  }), o && o.split(/\s+/g).forEach(function(d) {
    d && !Qt(l, d) && ao(l, d);
  }), s) {
    var f = l.style;
    for (var u in s)
      f[u] = s[u];
  }
  return !e && r && r.appendChild(l), l;
}
function Ph(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, u = Mh(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: u,
    children: r
  };
}
function ci(t, e, r) {
  t !== e && r(t, e);
}
function dl(t, e, r) {
  var n;
  r === void 0 && (r = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, u = l.startX, c = l.startY;
  if (e > 0) {
    var f = Math.sqrt((i * i + s * s) / (1 + e * e)), d = e * f;
    i = (i >= 0 ? 1 : -1) * d, s = (s >= 0 ? 1 : -1) * f;
  }
  var p = Math.abs(i), h = Math.abs(s), m = i < 0 ? u - r.left : r.right - u, x = s < 0 ? c - r.top : r.bottom - c;
  n = no([p, h], [0, 0], [m, x], !!e), p = n[0], h = n[1], i = (i >= 0 ? 1 : -1) * p, s = (s >= 0 ? 1 : -1) * h;
  var y = Math.min(0, i), b = Math.min(0, s), E = u + y, w = c + b;
  return {
    left: E,
    top: w,
    right: E + p,
    bottom: w + h,
    width: p,
    height: h
  };
}
function oa(t) {
  var e = t.getBoundingClientRect(), r = e.left, n = e.top, a = e.width, i = e.height;
  return {
    pos1: [r, n],
    pos2: [r + a, n],
    pos3: [r, n + i],
    pos4: [r + a, n + i]
  };
}
function pl(t, e, r) {
  var n = Rr(t, e), a = n.list, i = n.prevList, o = n.added, s = n.removed, l = n.maintained;
  return vn(vn(vn([], o.map(function(u) {
    return a[u];
  }), !0), s.map(function(u) {
    return i[u];
  }), !0), r ? l.map(function(u) {
    var c = u[1];
    return a[c];
  }) : []);
}
function vl(t) {
  for (var e = 0, r = t.length, n = 1; n < r; ++n)
    e = Math.max(Ge(t[n], t[n - 1]), e);
  return e;
}
var yc = eu(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), Vi = "selecto-selection ".concat(yc.className), No = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], Oh = vn([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], No), bc = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], Nh = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], zh = /* @__PURE__ */ (function(t) {
  mc(e, t);
  function e(n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new Zl(), a._onDragStart = function(s, l) {
      var u = s.data, c = s.clientX, f = s.clientY, d = s.inputEvent, p = a.options, h = p.selectFromInside, m = p.selectByClick, x = p.rootContainer, y = p.boundContainer, b = p.preventDragFromInside, E = b === void 0 ? !0 : b, w = p.clickBySelectEnd, _ = p.dragCondition;
      if (_ && !_(s)) {
        s.stop();
        return;
      }
      u.data = {};
      var D = we(a.container);
      u.innerWidth = D.innerWidth, u.innerHeight = D.innerHeight, a.findSelectableTargets(u), u.startSelectedTargets = a.selectedTargets, u.scaleMatrix = lo(), u.containerX = 0, u.containerY = 0;
      var M = a.container, g = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (x) {
        var T = a.container.getBoundingClientRect();
        u.containerX = T.left, u.containerY = T.top, u.scaleMatrix = gd(a.container, x);
      }
      if (y) {
        var k = me(y) && "element" in y ? Kt({
          left: !0,
          top: !0,
          bottom: !0,
          right: !0
        }, y) : {
          element: y,
          left: !0,
          top: !0,
          bottom: !0,
          right: !0
        }, z = k.element, O = void 0;
        if (z) {
          _e(z) ? O = Re(M).querySelector(z) : z === !0 ? O = a.container : O = z;
          var R = O.getBoundingClientRect();
          k.left && (g.left = R.left), k.top && (g.top = R.top), k.right && (g.right = R.right), k.bottom && (g.bottom = R.bottom);
        }
      }
      u.boundArea = g;
      var j = {
        left: c,
        top: f,
        right: c,
        bottom: f,
        width: 0,
        height: 0
      }, A = [], W = m && !w, X = !1;
      if (!h || W) {
        var L = a._findElement(
          l || d.target,
          // elementFromPoint(clientX, clientY),
          u.selectableTargets
        );
        X = !!L, W && (A = L ? [L] : []);
      }
      var q = !h && X;
      if (q && !m)
        return s.stop(), !1;
      var V = d.type, F = V === "mousedown" || V === "touchstart", et = !s.isClick && F ? a.emit("dragStart", Kt(Kt({}, s), {
        data: u.data
      })) : !0;
      if (!et)
        return s.stop(), !1;
      if (a.continueSelect ? (A = pl(a.selectedTargets, A, a.continueSelectWithoutDeselect), u.startPassedTargets = a.selectedTargets) : u.startPassedTargets = [], a._select(A, j, s, !0, q && m && !w && E), u.startX = c, u.startY = f, u.selectFlag = !1, u.preventDragFromInside = !1, d.target) {
        var tt = ca(u.scaleMatrix, [c - u.containerX, f - u.containerY]);
        a.target.style.cssText += "position: ".concat(x ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(tt[0], "px, ").concat(tt[1], "px)");
      }
      if (q && m && !w)
        d.preventDefault(), E && (a._selectEnd(u.startSelectedTargets, u.startPassedTargets, j, s, !0), u.preventDragFromInside = !0);
      else {
        u.selectFlag = !0;
        var K = a.options, nt = K.scrollOptions, Q = K.innerScrollOptions, at = !1;
        if (Q) {
          for (var it = s.inputEvent, mt = it.target, yt = null, Z = mt; Z && Z !== Re(M).body; ) {
            var ut = getComputedStyle(Z).overflow !== "visible";
            if (ut) {
              yt = Z;
              break;
            }
            Z = Z.parentElement;
          }
          yt && (u.innerScrollOptions = Kt({
            container: yt,
            checkScrollEvent: !0
          }, Q === !0 ? {} : Q), a.dragScroll.dragStart(s, u.innerScrollOptions), at = !0);
        }
        !at && nt && nt.container && a.dragScroll.dragStart(s, nt), q && m && w && (u.selectFlag = !1, s.preventDrag());
      }
      return !0;
    }, a._onDrag = function(s) {
      if (s.data.selectFlag) {
        var l = a.scrollOptions, u = s.data.innerScrollOptions, c = u || (l == null ? void 0 : l.container);
        if (c && !s.isScroll && a.dragScroll.drag(s, u || l))
          return;
      }
      a._checkSelected(s);
    }, a._onDragEnd = function(s) {
      var l = s.data, u = s.inputEvent, c = dl(s, a.options.ratio), f = l.selectFlag, d = a.container;
      if (u && a.emit("dragEnd", Kt(Kt({
        isDouble: !!s.isDouble,
        isClick: !!s.isClick,
        isDrag: !1,
        isSelect: f
      }, s), {
        data: l.data,
        rect: c
      })), a.target.style.cssText += "display: none;", f)
        l.selectFlag = !1, a.dragScroll.dragEnd();
      else if (a.selectByClick && a.clickBySelectEnd) {
        var p = a._findElement((u == null ? void 0 : u.target) || Rh(d, s.clientX, s.clientY), l.selectableTargets);
        a._select(p ? [p] : [], c, s);
      }
      l.preventDragFromInside || a._selectEnd(l.startSelectedTargets, l.startPassedTargets, c, s);
    }, a._onKeyDown = function(s) {
      var l = a.options, u = !1;
      if (!a._keydownContinueSelect) {
        var c = a._sameCombiKey(s, l.toggleContinueSelect);
        a._keydownContinueSelect = c, u || (u = c);
      }
      if (!a._keydownContinueSelectWithoutDeselection) {
        var c = a._sameCombiKey(s, l.toggleContinueSelectWithoutDeselect);
        a._keydownContinueSelectWithoutDeselection = c, u || (u = c);
      }
      u && a.emit("keydown", {
        keydownContinueSelect: a._keydownContinueSelect,
        keydownContinueSelectWithoutDeselection: a._keydownContinueSelectWithoutDeselection
      });
    }, a._onKeyUp = function(s) {
      var l = a.options, u = !1;
      if (a._keydownContinueSelect) {
        var c = a._sameCombiKey(s, l.toggleContinueSelect, !0);
        a._keydownContinueSelect = !c, u || (u = c);
      }
      if (a._keydownContinueSelectWithoutDeselection) {
        var c = a._sameCombiKey(s, l.toggleContinueSelectWithoutDeselect, !0);
        a._keydownContinueSelectWithoutDeselection = !c, u || (u = c);
      }
      u && a.emit("keyup", {
        keydownContinueSelect: a._keydownContinueSelect,
        keydownContinueSelectWithoutDeselection: a._keydownContinueSelectWithoutDeselection
      });
    }, a._onBlur = function() {
      (a._keydownContinueSelect || a._keydownContinueSelectWithoutDeselection) && (a._keydownContinueSelect = !1, a._keydownContinueSelectWithoutDeselection = !1, a.emit("keyup", {
        keydownContinueSelect: a._keydownContinueSelect,
        keydownContinueSelectWithoutDeselection: a._keydownContinueSelectWithoutDeselection
      }));
    }, a._onDocumentSelectStart = function(s) {
      var l = Re(a.container);
      if (a.gesto.isFlag()) {
        var u = a.dragContainer;
        u === we(a.container) && (u = l.documentElement);
        var c = xn(u) ? [u] : [].slice.call(u), f = s.target;
        c.some(function(d) {
          if (d === f || d.contains(f))
            return s.preventDefault(), !0;
        });
      }
    }, a.target = n.portalContainer;
    var i = n.container;
    a.options = Kt({
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
      getElementRect: oa,
      cspNonce: "",
      ratio: 0
    }, n);
    var o = a.options.portalContainer;
    return o && (i = o.parentElement), a.container = i || document.body, a.initElement(), a.initDragScroll(), a.setKeyController(), a;
  }
  var r = e.prototype;
  return r.setSelectedTargets = function(n) {
    var a = this.selectedTargets, i = Rr(a, n), o = i.added, s = i.removed, l = i.prevList, u = i.list;
    return this.selectedTargets = n, {
      added: o.map(function(c) {
        return u[c];
      }),
      removed: s.map(function(c) {
        return l[c];
      }),
      beforeSelected: a,
      selected: n
    };
  }, r.setSelectedTargetsByPoints = function(n, a) {
    var i = Math.min(n[0], a[0]), o = Math.min(n[1], a[1]), s = Math.max(n[0], a[0]), l = Math.max(n[1], a[1]), u = {
      left: i,
      top: o,
      right: s,
      bottom: l,
      width: s - i,
      height: l - o
    }, c = {
      ignoreClick: !0
    };
    this.findSelectableTargets(c);
    var f = this.hitTest(u, c, !0, null), d = this.setSelectedTargets(f);
    return Kt(Kt({}, d), {
      rect: u
    });
  }, r.selectTargetsByPoints = function(n, a) {
    var i = new MouseEvent("mousedown", {
      clientX: n[0],
      clientY: n[1],
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
    }), l = this.gesto, u = l.onDragStart(i);
    u !== !1 && (l.onDrag(o), l.onDragEnd(s));
  }, r.getSelectedTargets = function() {
    return this.selectedTargets;
  }, r.triggerDragStart = function(n) {
    return this.gesto.triggerDragStart(n), this;
  }, r.destroy = function() {
    var n;
    this.off(), this.keycon && this.keycon.destroy(), this.gesto.unset(), this.injectResult.destroy(), this.dragScroll.dragEnd(), Wt(document, "selectstart", this._onDocumentSelectStart), this.options.portalContainer || (n = this.target.parentElement) === null || n === void 0 || n.removeChild(this.target), this.keycon = null, this.gesto = null, this.injectResult = null, this.target = null, this.container = null, this.options = null;
  }, r.getElementPoints = function(n) {
    var a = this.getElementRect || oa, i = a(n), o = [i.pos1, i.pos2, i.pos4, i.pos3];
    if (a !== oa) {
      var s = n.getBoundingClientRect();
      return Mi(o, s);
    }
    return o;
  }, r.getSelectableElements = function() {
    var n = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (ka(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (xn(i))
        a.push(i);
      else if (me(i))
        a.push(i.value || i.current);
      else {
        var s = [].slice.call(Re(n).querySelectorAll(i));
        a.push.apply(a, s);
      }
    }), a;
  }, r.checkScroll = function() {
    if (this.gesto.isFlag()) {
      var n = this.scrollOptions, a = this.gesto.getEventData().innerScrollOptions, i = a || (n == null ? void 0 : n.container);
      i && this.dragScroll.checkScroll(Kt({
        inputEvent: this.gesto.getCurrentEvent()
      }, a || n));
    }
  }, r.findSelectableTargets = function(n) {
    var a = this;
    n === void 0 && (n = this.gesto.getEventData());
    var i = this.getSelectableElements(), o = i.map(function(f) {
      return a.getElementPoints(f);
    });
    n.selectableTargets = i, n.selectablePoints = o, n.selectableParentMap = null;
    var s = this.options, l = s.checkOverflow || s.innerScrollOptions, u = Re(this.container);
    if (l) {
      var c = /* @__PURE__ */ new Map();
      n.selectableInnerScrollParentMap = c, n.selectableInnerScrollPathsList = i.map(function(f, d) {
        for (var p = f.parentElement, h = [], m = [], x = function() {
          var y = c.get(p);
          if (!y) {
            var b = getComputedStyle(p).overflow !== "visible";
            if (b) {
              var E = oa(p);
              y = {
                parentElement: p,
                indexes: [],
                points: [E.pos1, E.pos2, E.pos4, E.pos3],
                paths: vn([], m)
              }, h.push(p), h.forEach(function(w) {
                c.set(w, y);
              }), h = [];
            }
          }
          y ? (p = y.parentElement, c.get(p).indexes.push(d), m.push(p)) : h.push(p), p = p.parentElement;
        }; p && p !== u.body; )
          x();
        return m;
      });
    }
    return s.checkOverflow || (n.selectableInners = i.map(function() {
      return !0;
    })), this._refreshGroups(n), i;
  }, r.clickTarget = function(n, a) {
    var i = Th(n), o = i.clientX, s = i.clientY, l = {
      data: {
        selectFlag: !1
      },
      clientX: o,
      clientY: s,
      inputEvent: n,
      isClick: !0,
      isTrusted: !1,
      stop: function() {
        return !1;
      }
    };
    return this._onDragStart(l, a) && this._onDragEnd(l), this;
  }, r.setKeyController = function() {
    var n = this.options, a = n.keyContainer, i = n.toggleContinueSelect, o = n.toggleContinueSelectWithoutDeselect;
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new _h(a || we(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, r.setClassName = function(n) {
    this.options.className = n, this.target.setAttribute("class", "".concat(Vi, " ").concat(n || ""));
  }, r.setKeyEvent = function() {
    var n = this.options, a = n.toggleContinueSelect, i = n.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, r.setKeyContainer = function(n) {
    var a = this, i = this.options;
    ci(i.keyContainer, n, function() {
      i.keyContainer = n, a.setKeyController();
    });
  }, r.getContinueSelect = function() {
    var n = this.options, a = n.continueSelect, i = n.toggleContinueSelect;
    return !i || !this._keydownContinueSelect ? a : !a;
  }, r.getContinueSelectWithoutDeselect = function() {
    var n = this.options, a = n.continueSelectWithoutDeselect, i = n.toggleContinueSelectWithoutDeselect;
    return !i || !this._keydownContinueSelectWithoutDeselection ? a : !a;
  }, r.setToggleContinueSelect = function(n) {
    var a = this, i = this.options;
    ci(i.toggleContinueSelect, n, function() {
      i.toggleContinueSelect = n, a.setKeyEvent();
    });
  }, r.setToggleContinueSelectWithoutDeselect = function(n) {
    var a = this, i = this.options;
    ci(i.toggleContinueSelectWithoutDeselect, n, function() {
      i.toggleContinueSelectWithoutDeselect = n, a.setKeyEvent();
    });
  }, r.setPreventDefault = function(n) {
    this.gesto.options.preventDefault = n;
  }, r.setCheckInput = function(n) {
    this.gesto.options.checkInput = n;
  }, r.initElement = function() {
    var n = this.options, a = n.dragContainer, i = n.checkInput, o = n.preventDefault, s = n.preventClickEventOnDragStart, l = n.preventClickEventOnDrag, u = n.preventClickEventByCondition, c = n.preventRightClick, f = c === void 0 ? !0 : c, d = n.className, p = this.container;
    this.target = xc(Ph("div", {
      className: "".concat(Vi, " ").concat(d || "")
    }), this.target, p);
    var h = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(Re(p).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new tu(this.dragContainer, {
      checkWindowBlur: !0,
      container: we(p),
      checkInput: i,
      preventDefault: o,
      preventClickEventOnDragStart: s,
      preventClickEventOnDrag: l,
      preventClickEventByCondition: u,
      preventRightClick: f
    }).on({
      dragStart: this._onDragStart,
      drag: this._onDrag,
      dragEnd: this._onDragEnd
    }), Zt(document, "selectstart", this._onDocumentSelectStart), this.injectResult = yc.inject(h, {
      nonce: this.options.cspNonce
    });
  }, r.hitTest = function(n, a, i, o) {
    var s = this.options, l = s.hitRate, u = s.selectByClick, c = n.left, f = n.top, d = n.right, p = n.bottom, h = a.innerGroups, m = a.innerWidth, x = a.innerHeight, y = o == null ? void 0 : o.clientX, b = o == null ? void 0 : o.clientY, E = a.ignoreClick, w = [[c, f], [d, f], [d, p], [c, p]], _ = function(L, q) {
      var V = gr(typeof l == "function" ? "".concat(l(q)) : "".concat(l)), F = E ? !1 : ga([y, b], L);
      if (!i && u && F)
        return !0;
      var et = Ti(w, L);
      if (!et.length)
        return !1;
      var tt = ln(et), K = 0;
      if (tt === 0 && ln(L) === 0 ? (K = vl(L), tt = vl(et)) : K = ln(L), V.unit === "px")
        return tt >= V.value;
      var nt = va(Math.round(tt / K * 100), 0, 100);
      return nt >= Math.min(100, V.value);
    }, D = a.selectableTargets, M = a.selectablePoints, g = a.selectableInners;
    if (!h)
      return D.filter(function(L, q) {
        return g[q] ? _(M[q], D[q]) : !1;
      });
    for (var T = [], k = Math.floor(c / m), z = Math.floor(d / m), O = Math.floor(f / x), R = Math.floor(p / x), j = k; j <= z; ++j) {
      var A = h[j];
      if (A)
        for (var W = O; W <= R; ++W) {
          var X = A[W];
          X && X.forEach(function(L) {
            var q = M[L], V = g[L], F = D[L];
            V && _(q, F) && T.push(F);
          });
        }
    }
    return Ih(T);
  }, r.initDragScroll = function() {
    var n = this;
    this.dragScroll.on("scrollDrag", function(a) {
      var i = a.next;
      i(n.gesto.getCurrentEvent());
    }).on("scroll", function(a) {
      var i = a.container, o = a.direction, s = n.gesto.getEventData().innerScrollOptions;
      s ? n.emit("innerScroll", {
        container: i,
        direction: o
      }) : n.emit("scroll", {
        container: i,
        direction: o
      });
    }).on("move", function(a) {
      var i = a.offsetX, o = a.offsetY, s = a.inputEvent, l = n.gesto;
      if (!(!l || !l.isFlag())) {
        var u = n.gesto.getEventData(), c = u.boundArea;
        u.startX -= i, u.startY -= o;
        var f = n.gesto.getEventData().innerScrollOptions, d = f == null ? void 0 : f.container, p = !1;
        if (d) {
          var h = u.selectableInnerScrollParentMap, m = h.get(d);
          m && (m.paths.forEach(function(x) {
            var y = h.get(x);
            y.points.forEach(function(b) {
              b[0] -= i, b[1] -= o;
            });
          }), m.indexes.forEach(function(x) {
            u.selectablePoints[x].forEach(function(y) {
              y[0] -= i, y[1] -= o;
            });
          }), p = !0);
        }
        p || u.selectablePoints.forEach(function(x) {
          x.forEach(function(y) {
            y[0] -= i, y[1] -= o;
          });
        }), n._refreshGroups(u), c.left -= i, c.right -= i, c.top -= o, c.bottom -= o, n.gesto.scrollBy(i, o, s.inputEvent), n._checkSelected(n.gesto.getCurrentEvent());
      }
    });
  }, r._select = function(n, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = i.inputEvent, u = i.data, c = this.setSelectedTargets(n), f = Rr(u.startSelectedTargets, n), d = f.added, p = f.removed, h = f.prevList, m = f.list, x = {
      startSelected: h,
      startAdded: d.map(function(y) {
        return m[y];
      }),
      startRemoved: p.map(function(y) {
        return h[y];
      })
    };
    o && this.emit("selectStart", Kt(Kt(Kt({}, c), x), {
      rect: a,
      inputEvent: l,
      data: u.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    })), (c.added.length || c.removed.length) && this.emit("select", Kt(Kt(Kt({}, c), x), {
      rect: a,
      inputEvent: l,
      data: u.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    }));
  }, r._selectEnd = function(n, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = o.inputEvent, u = o.isDouble, c = o.data, f = l && l.type, d = f === "mousedown" || f === "touchstart", p = Rr(n, this.selectedTargets), h = p.added, m = p.removed, x = p.prevList, y = p.list, b = Rr(a, this.selectedTargets), E = b.added, w = b.removed, _ = b.prevList, D = b.list;
    this.emit("selectEnd", {
      startSelected: n,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: h.map(function(M) {
        return y[M];
      }),
      removed: m.map(function(M) {
        return x[M];
      }),
      afterAdded: E.map(function(M) {
        return D[M];
      }),
      afterRemoved: w.map(function(M) {
        return _[M];
      }),
      isDragStart: d && s,
      isDragStartEnd: d && s,
      isClick: !!o.isClick,
      isDouble: !!u,
      rect: i,
      inputEvent: l,
      data: c.data,
      isTrusted: o.isTrusted
    });
  }, r._checkSelected = function(n, a) {
    a === void 0 && (a = dl(n, this.options.ratio));
    var i = n.data, o = a.top, s = a.left, l = a.width, u = a.height, c = i.selectFlag, f = i.containerX, d = i.containerY, p = i.scaleMatrix, h = ca(p, [s - f, o - d]), m = ca(p, [l, u]), x = [];
    if (c) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(h[0], "px, ").concat(h[1], "px);") + "width:".concat(m[0], "px;height:").concat(m[1], "px;");
      var y = this.hitTest(a, i, !0, n);
      x = pl(i.startPassedTargets, y, this.continueSelect && this.continueSelectWithoutDeselect);
    }
    var b = this.emit("drag", Kt(Kt({}, n), {
      data: i.data,
      isSelect: c,
      rect: a
    }));
    if (b === !1) {
      this.target.style.cssText += "display: none;", n.stop();
      return;
    }
    c && this._select(x, a, n);
  }, r._sameCombiKey = function(n, a, i) {
    if (!a)
      return !1;
    var o = gc(n.inputEvent, n.key), s = [].concat(a), l = Yt(s[0]) ? s : [s];
    if (i) {
      var u = n.key;
      return l.some(function(c) {
        return c.some(function(f) {
          return f === u;
        });
      });
    }
    return l.some(function(c) {
      return c.every(function(f) {
        return o.indexOf(f) > -1;
      });
    });
  }, r._findElement = function(n, a) {
    for (var i = n; i && !(a.indexOf(i) > -1); )
      i = i.parentElement;
    return i;
  }, r._refreshGroups = function(n) {
    var a, i = n.innerWidth, o = n.innerHeight, s = n.selectablePoints;
    if (this.options.checkOverflow) {
      var l = (a = this.gesto.getEventData().innerScrollOptions) === null || a === void 0 ? void 0 : a.container, u = n.selectableInnerScrollParentMap, c = n.selectableInnerScrollPathsList;
      n.selectableInners = c.map(function(p, h) {
        var m = !1;
        return p.every(function(x) {
          if (m)
            return !0;
          if (x === l)
            return m = !0, !0;
          var y = u.get(x);
          if (y) {
            var b = s[h], E = y.points, w = Ti(b, E);
            if (!w.length)
              return !1;
          }
          return !0;
        });
      });
    }
    if (!i || !o)
      n.innerGroups = null;
    else {
      var f = n.selectablePoints, d = {};
      f.forEach(function(p, h) {
        var m = 1 / 0, x = -1 / 0, y = 1 / 0, b = -1 / 0;
        p.forEach(function(_) {
          var D = Math.floor(_[0] / i), M = Math.floor(_[1] / o);
          m = Math.min(D, m), x = Math.max(D, x), y = Math.min(M, y), b = Math.max(M, b);
        });
        for (var E = m; E <= x; ++E)
          for (var w = y; w <= b; ++w)
            d[E] = d[E] || {}, d[E][w] = d[E][w] || [], d[E][w].push(h);
      }), n.innerGroups = d;
    }
  }, e = kh([Hf(No, function(n, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = Si("get ".concat(a));
    n[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = Si("set ".concat(a));
    n[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(n, a, i);
  })], e), e;
})(wn), jh = /* @__PURE__ */ (function(t) {
  mc(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})(zh), Ui = function(t, e) {
  return Ui = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Ui(t, e);
};
function Ah(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Ui(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var _a = function() {
  return _a = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, _a.apply(this, arguments);
};
function Bh(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
var hl = bc.map(function(t) {
  return Si("on ".concat(t));
}), Gh = /* @__PURE__ */ (function(t) {
  Ah(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var r = e.prototype;
  return r.render = function() {
    return rt.createElement("div", {
      className: Vi,
      ref: nr(this, "selectionElement")
    });
  }, r.componentDidMount = function() {
    var n = this, a = this.props, i = {};
    Oh.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new jh(_a(_a({}, i), {
      portalContainer: this.selectionElement
    })), bc.forEach(function(o, s) {
      n.selecto.on(o, function(l) {
        var u = n.props, c = u[hl[s]] && u[hl[s]](l);
        c === !1 && l.stop();
      });
    });
  }, r.componentDidUpdate = function(n) {
    var a = this.props, i = this.selecto;
    No.forEach(function(o) {
      n[o] !== a[o] && (i[o] = a[o]);
    });
  }, r.componentWillUnmount = function() {
    this.selecto.destroy();
  }, Bh([Gl(Nh)], e.prototype, "selecto", void 0), e;
})(rt.PureComponent);
const Be = "http://www.w3.org/2000/svg";
function sa(t, e) {
  const r = URL.createObjectURL(t), n = document.createElement("a");
  n.href = r, n.download = e, document.body.appendChild(n), n.click(), n.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function Br(t, e, r, n = { x: 0, y: 0 }) {
  const a = t.getBoundingClientRect();
  return {
    left: (a.left - e.left) / r - n.x,
    top: (a.top - e.top) / r - n.y,
    width: a.width / r,
    height: a.height / r
  };
}
function gl(t, e, r, n, a, i) {
  e.forEach((o) => {
    if (!o.text) return;
    const s = document.createElementNS(Be, "text");
    s.setAttribute("x", String(r + o.left)), s.setAttribute("y", String(n + o.top + a * 0.82)), s.setAttribute("font-size", String(a)), s.setAttribute("font-family", i.fontFamily || nf), s.setAttribute("font-weight", i.fontWeight || "400"), s.setAttribute("fill", i.color || "#1e293b"), s.setAttribute("xml:space", "preserve"), s.textContent = o.text, t.appendChild(s);
  });
}
function Fh(t, e) {
  if (typeof document.createRange != "function" || !e.trim()) return null;
  const r = document.createRange();
  if (typeof r.getBoundingClientRect != "function") return null;
  const n = getComputedStyle(t), a = (parseFloat(n.paddingLeft) || 0) + (parseFloat(n.paddingRight) || 0), i = document.createElement("div");
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
    fontFamily: n.fontFamily,
    fontSize: n.fontSize,
    fontWeight: n.fontWeight,
    fontStyle: n.fontStyle,
    lineHeight: n.lineHeight,
    letterSpacing: n.letterSpacing,
    whiteSpace: "pre-wrap",
    overflowWrap: "break-word",
    wordBreak: n.wordBreak
  }), i.textContent = e, document.body.appendChild(i);
  try {
    const o = i.firstChild;
    if (!o) return null;
    const s = i.getBoundingClientRect(), l = [];
    for (let u = 0; u < e.length; u++) {
      if (e[u] === `
`) continue;
      r.setStart(o, u), r.setEnd(o, u + 1);
      const c = r.getBoundingClientRect();
      if (!c.width && !c.height) continue;
      const f = c.top - s.top, d = l.at(-1);
      d && Math.abs(d.top - f) < 1 ? d.text += e[u] : l.push({ text: e[u], left: c.left - s.left, top: f });
    }
    return l.length ? l : null;
  } finally {
    i.remove();
  }
}
function ml(t, e, r, n, a, i, o) {
  const s = Br(e, r, n, i), l = document.createElementNS(Be, "g");
  l.setAttribute("transform", `translate(${Math.round(s.left)},${Math.round(s.top)})`);
  const u = e.querySelector("canvas");
  if (u) {
    const f = document.createElementNS(Be, "image"), d = Br(u, r, n, i);
    f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("width", String(Math.round(d.width || s.width))), f.setAttribute("height", String(Math.round(d.height || s.height))), f.setAttribute("href", af(e, a, Math.round(d.width || s.width)) ?? u.toDataURL("image/png")), l.appendChild(f);
  }
  const c = e.querySelector("svg");
  if (c) {
    const f = c.cloneNode(!0), d = c.clientWidth || Number(c.getAttribute("width")) || s.width, p = d > 0 ? s.width / d : 1;
    if (Math.abs(p - 1) > 1e-3) {
      const h = document.createElementNS(Be, "g");
      h.setAttribute("transform", `scale(${p})`), h.appendChild(f), l.appendChild(h);
    } else l.appendChild(f);
  }
  of(l, o), t.appendChild(l);
}
function xl(t, e, r, n) {
  return [...t.querySelectorAll(".gl-layout-item")].sort((a, i) => (Number(a.style.zIndex) || 0) - (Number(i.style.zIndex) || 0)).map((a) => ({ item: a, frame: Br(a, e, r, n) }));
}
function Lh(t, e, r, n) {
  let a = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const { frame: f } of t)
    f.left >= e || f.top >= r || f.left + f.width <= 0 || f.top + f.height <= 0 || (a = Math.min(a, f.left), i = Math.min(i, f.top), o = Math.max(o, f.left + f.width), s = Math.max(s, f.top + f.height));
  if (!Number.isFinite(a)) return null;
  const l = Math.max(0, n) * xi, u = Math.max(0, Math.floor(a - l)), c = Math.max(0, Math.floor(i - l));
  return { x: u, y: c, width: Math.min(e, Math.ceil(o + l)) - u, height: Math.min(r, Math.ceil(s + l)) - c };
}
function Wh(t, e, r) {
  var h, m;
  const n = mi(e.page), a = da(e.page)[r.pageIndex ?? 0] ?? { x: 0, y: 0 }, i = t.getBoundingClientRect(), o = r.crop ? Lh(xl(t, i, r.zoom, a), n.width, n.height, r.crop.paddingMm) : null, s = o ? { x: a.x + o.x, y: a.y + o.y } : a, l = o ? o.width : n.width, u = o ? o.height : n.height, c = document.createElementNS(Be, "svg");
  c.setAttribute("xmlns", Be), c.setAttribute("width", String(l)), c.setAttribute("height", String(u)), c.setAttribute("viewBox", `0 0 ${l} ${u}`);
  const f = document.createElementNS(Be, "rect");
  f.setAttribute("width", "100%"), f.setAttribute("height", "100%"), f.setAttribute("fill", "#ffffff"), c.appendChild(f);
  let d = 0;
  for (const { item: x, frame: y } of xl(t, i, r.zoom, s)) {
    if (y.left >= l || y.top >= u || y.left + y.width <= 0 || y.top + y.height <= 0) continue;
    d += 1;
    const b = x.dataset.title ?? ((h = x.querySelector(".gl-layout-item-head span")) == null ? void 0 : h.textContent) ?? "";
    if (x.classList.contains("has-frame")) {
      const M = document.createElementNS(Be, "rect");
      M.setAttribute("x", String(Math.round(y.left) + 0.5)), M.setAttribute("y", String(Math.round(y.top) + 0.5)), M.setAttribute("width", String(Math.round(y.width) - 1)), M.setAttribute("height", String(Math.round(y.height) - 1)), M.setAttribute("fill", "none"), M.setAttribute("stroke", "#94a3b8"), M.setAttribute("id", en("frame", d, b)), c.appendChild(M);
    }
    const E = x.querySelector(".gl-layout-text-surface");
    if (E) {
      const M = E instanceof HTMLTextAreaElement ? E.value : E.textContent ?? "", g = getComputedStyle(E), T = Br(E, i, r.zoom, s), k = Number(x.dataset.zoom) || 1, z = (parseFloat(g.fontSize) || 14) * k, O = (parseFloat(g.paddingLeft) || 0) * k, R = (parseFloat(g.paddingTop) || 0) * k, j = ((m = Fh(E, M)) == null ? void 0 : m.map((W) => ({ text: W.text, left: W.left * k, top: W.top * k }))) ?? M.split(`
`).map((W, X) => ({ text: W, left: 0, top: X * z * 1.3 })), A = document.createElementNS(Be, "g");
      A.setAttribute("id", en("text", d, M.trim().split(/\s+/).slice(0, 4).join(" "))), gl(A, j, T.left + O, T.top + R, z, g), c.appendChild(A);
      continue;
    }
    const w = x.querySelector(".gl-layout-plot-host");
    if (!w) continue;
    if (w.__miniPlotCfg) {
      ml(c, w, i, r.zoom, r.dpi, s, en("plot", d, b));
      continue;
    }
    const _ = w.querySelector(".gl-prop-chart");
    if (_) {
      const M = ef(_);
      if (M) {
        const g = Br(_, i, r.zoom, s), T = M.width > 0 ? g.width / M.width : 1, k = document.createElementNS(Be, "g");
        k.setAttribute("id", en("chart", d, b)), k.setAttribute("transform", `translate(${g.left},${g.top}) scale(${T})`), k.appendChild(M.root), c.appendChild(k);
      }
      continue;
    }
    w.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((M) => {
      const g = (M.textContent ?? "").trim();
      if (!g) return;
      const T = getComputedStyle(M), k = Br(M, i, r.zoom, s), z = M.offsetWidth > 0 ? k.width / M.offsetWidth : 1;
      gl(c, [{ text: g, left: 0, top: 0 }], k.left, k.top, (parseFloat(T.fontSize) || 12) * z, T);
    });
    const D = en(w.querySelector(".gl-figure-grid") ? "figure" : "strategy", d, b);
    w.querySelectorAll(".mini-plot-cell").forEach((M, g) => ml(c, M, i, r.zoom, r.dpi, s, `${D}-panel-${g + 1}`));
  }
  const p = o ? { widthMm: l / xi, heightMm: u / xi } : Ml(e.page);
  return rf(c, { widthPx: l, heightPx: u, ...p }), { root: c, width: l, height: u, ...p };
}
function yl(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
function Yh(t, e, r) {
  return da(e.page).map((n, a) => Wh(t, e, { dpi: e.page.dpi, zoom: r.zoom, pageIndex: a, crop: r.crop }));
}
const bl = 72 / 25.4;
async function Xh(t, e, r) {
  const n = e.page.dpi, a = Jc(e.name) || "layout";
  if (!t.length) return;
  if (r === "svg") {
    if (t.length === 1) {
      sa(new Blob([yl(t[0].root)], { type: "image/svg+xml" }), `${a}.svg`);
      return;
    }
    const u = {};
    t.forEach((c, f) => {
      u[`${a}-p${f + 1}.svg`] = Qc(yl(c.root));
    }), sa(new Blob([cs(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  if (r === "png") {
    if (t.length === 1) {
      sa(await fs(await Ua(t[0], n), n), `${a}.png`);
      return;
    }
    const u = {};
    for (const [c, f] of t.entries()) {
      const d = await Ua(f, n);
      u[`${a}-p${c + 1}.png`] = new Uint8Array(await (await fs(d, n)).arrayBuffer()), await ds();
    }
    sa(new Blob([cs(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const i = (u) => {
    const c = u.widthMm * bl, f = u.heightMm * bl;
    return { width: c, height: f, orientation: c >= f ? "landscape" : "portrait" };
  }, { jsPDF: o } = await import("./jspdf.es.min-DRzgbvZm.js").then((u) => u.j), s = i(t[0]), l = new o({ orientation: s.orientation, unit: "pt", format: [s.width, s.height], compress: !0 });
  for (const [u, c] of t.entries()) {
    const { width: f, height: d, orientation: p } = i(c);
    if (u > 0 && l.addPage([f, d], p), !await tf(l, c.root, { width: f, height: d })) {
      const h = await Ua(c, n);
      l.addImage(h, "PNG", 0, 0, f, d, void 0, "FAST");
    }
    await ds();
  }
  l.save(`${a}.pdf`);
}
const Hh = "", Sc = "{none}", la = [
  { id: "auto", label: "What differs across the page", template: Hh },
  { id: "population", label: "Population", template: "{population}" },
  { id: "file", label: "File", template: "{file}" },
  { id: "sample", label: "Sample id", template: "{sample}" },
  { id: "population-file", label: "Population · file", template: "{population} · {file}" },
  { id: "population-plot", label: "Population · plot", template: "{population} · {plot}" },
  { id: "none", label: "No title", template: Sc }
], fi = "{population}, {file}, {sample}, {x}, {y}, {plot}, {count}, {meta:column}, {popmeta:field}";
function $h(t, e) {
  return [
    { token: "{population}", label: "Population", group: "population" },
    ...e.map((r) => ({ token: `{popmeta:${r}}`, label: r, group: "population" })),
    { token: "{file}", label: "File", group: "file" },
    { token: "{sample}", label: "Sample id", group: "file" },
    ...t.map((r) => ({ token: `{meta:${r}}`, label: r, group: "file" })),
    { token: "{plot}", label: "Plot", group: "plot" },
    { token: "{x}", label: "X", group: "plot" },
    { token: "{y}", label: "Y", group: "plot" },
    { token: "{count}", label: "Count", group: "plot" }
  ];
}
const di = [
  { id: "dot", label: "·", value: " · " },
  { id: "space", label: "space", value: " " },
  { id: "comma", label: ",", value: ", " },
  { id: "slash", label: "/", value: " / " },
  { id: "dash", label: "–", value: " – " }
];
function Sl(t, e) {
  return t.join(e);
}
function qh(t) {
  const e = t.match(/\{[^}]+\}/g) ?? [];
  if (!e.length) return null;
  const r = t.split(/\{[^}]+\}/);
  if (r[0] !== "" || r[r.length - 1] !== "") return null;
  const n = r.slice(1, -1), a = n[0] ?? " · ";
  return n.some((i) => i !== a) ? null : { tokens: e, separator: a };
}
function Cl(t, e, r, n, a) {
  return {
    population: (r == null ? void 0 : r.name) ?? "",
    file: (e == null ? void 0 : e.fileName) ?? (e == null ? void 0 : e.name) ?? "",
    sample: (e == null ? void 0 : e.name) ?? (e == null ? void 0 : e.fileName) ?? "",
    x: t.xChannel ?? "",
    y: t.yChannel ?? "",
    ...t.label ? { plot: t.label } : {},
    ...typeof n == "number" ? { count: n } : {},
    ...e != null && e.metadata ? { metadata: e.metadata } : {},
    ...r && (a != null && a[r.id]) ? { populationMetadata: a[r.id] } : {}
  };
}
function Ma(t, e) {
  return t.trim() === Sc ? "" : t.replace(/\{(population|file|sample|x|y|plot|count|meta:[^}]+|popmeta:[^}]+)\}/g, (n, a) => {
    var i, o;
    switch (a) {
      case "population":
        return e.population;
      case "file":
        return e.file;
      case "sample":
        return e.sample;
      case "x":
        return e.x;
      case "y":
        return e.y;
      case "plot":
        return e.plot ?? (e.y ? `${e.x} vs ${e.y}` : e.x);
      case "count":
        return typeof e.count == "number" ? e.count.toLocaleString() : "";
    }
    return a.startsWith("meta:") ? ((i = e.metadata) == null ? void 0 : i[a.slice(5)]) ?? "" : a.startsWith("popmeta:") ? ((o = e.populationMetadata) == null ? void 0 : o[a.slice(8)]) ?? "" : n;
  }).replace(/(\s*·\s*)+/g, " · ").replace(/^\s*·\s*/, "").replace(/\s*·\s*$/, "").trim();
}
function Vh(t, e) {
  const r = new Set(t.map((o) => o.sampleId)), n = new Set(t.map((o) => o.populationId)), a = t.some((o) => o.label), i = e != null && e.metadataColumn ? n.size > 1 ? `{meta:${e.metadataColumn}} · {population}` : `{meta:${e.metadataColumn}}` : r.size <= 1 && n.size > 1 ? "{population}" : n.size <= 1 && r.size > 1 ? "{file}" : "{population} · {file}";
  return a ? `${i} · {plot}` : i;
}
const Uh = "Unassigned";
function Cc(t) {
  const e = {};
  for (const [r, n] of Object.entries(t[0] ?? {}))
    t.every((a) => (a == null ? void 0 : a[r]) === n) && (e[r] = n);
  return e;
}
function Ec(t) {
  return oe(t.recipe) && t.recipe.iterated === !0;
}
function El(t, e, r, n) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(r) : i === "N" ? String(n) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function pi(t, e, r, n, a, i) {
  const o = Ec(t), s = { ...t.recipe };
  let l;
  return s.kind === "text" ? s.text = El(s.text, s.readsFrom ? null : e, r, n) : (o && e && e.populationId ? "populationId" in s && (s.populationId = e.populationId) : o && e && e.sampleIds ? ((s.kind === "biplot" || s.kind === "histogram") && e.sampleIds.length > 1 ? s.pool = { sampleIds: [...e.sampleIds] } : "pool" in s && delete s.pool, "sampleId" in s && !e.sampleIds.includes(s.sampleId) && e.sampleIds.length && (l = s.sampleId, s.sampleId = e.sampleIds[0])) : o && e && "sampleId" in s && s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id), s.title && (s.title = El(s.title, e, r, n))), {
    ...t,
    id: i === 0 && !a.x && !a.y ? t.id : `${t.id}::${i}`,
    templateId: t.id,
    unitId: o && e ? e.id : void 0,
    ...l ? { templateSampleId: l } : {},
    x: t.x + a.x,
    y: t.y + a.y,
    offset: a,
    recipe: s
  };
}
function Kh(t, e) {
  if (e)
    for (const r of t) {
      if (r.recipe.kind !== "text" || !r.recipe.readsFrom) continue;
      const n = r.recipe.readsFrom, a = t.find((o) => o.templateId === n && o.offset.x === r.offset.x && o.offset.y === r.offset.y);
      if (!a || !oe(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId, a.unitId);
      i && (r.recipe = { ...r.recipe, text: Ma(r.recipe.text, i) });
    }
}
function Zh(t, e, r) {
  const n = Jh(t, e);
  for (const a of n) Kh(a.items, r);
  return n;
}
function Jh(t, e) {
  const r = t.iteration ?? kl;
  if (r.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((p) => pi(p, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const n = e.length;
  if (r.arrangement.kind === "page-per-unit")
    return e.map((p, h) => ({
      index: h,
      units: [p],
      items: t.items.map((m) => pi(m, p, h + 1, n, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = r.arrangement, l = sf(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const u = a * i, c = l.width + s, f = l.height + s, d = [];
  for (let p = 0; p < n; p += u) {
    const h = e.slice(p, p + u), m = [];
    h.forEach((x, y) => {
      const b = o === "row-major" ? Math.floor(y / i) : y % a, w = { x: (o === "row-major" ? y % i : Math.floor(y / a)) * c, y: b * f };
      for (const _ of t.items) m.push(pi(_, x, p + y + 1, n, w, y));
    }), d.push({ index: d.length, units: h, items: m });
  }
  return d;
}
function wc(t, e, r, n) {
  return e.filter((a) => {
    var i;
    return t.kind === "all" ? !0 : t.kind === "checked" ? r.includes(a.id) : t.kind === "group" ? n[a.id] === t.groupId : (((i = a.metadata) == null ? void 0 : i[t.column]) ?? "") === t.value;
  });
}
function Qh(t, e, r, n, a) {
  const i = (o) => {
    var s;
    return {
      id: o.id,
      name: o.name,
      fileName: o.fileName ?? o.name,
      groupName: (s = n.find((l) => l.id === a[o.id])) == null ? void 0 : s.name,
      metadata: o.metadata
    };
  };
  return wc(t.source, e, r, a).map(i);
}
function tg(t, e, r, n, a, i) {
  var d;
  const o = t.column ?? "";
  if (!o) return [];
  const s = /* @__PURE__ */ new Map(), l = [];
  for (const p of wc(t.source, e, r, a)) {
    const h = ((d = p.metadata) == null ? void 0 : d[o]) ?? "";
    if (!h) {
      l.push(p);
      continue;
    }
    s.set(h, [...s.get(h) ?? [], p]);
  }
  const u = [...s.keys()], c = i ? [...i.filter((p) => s.has(p)), ...u.filter((p) => !i.includes(p)).sort(ps)] : u.sort(ps), f = (p, h) => {
    const m = new Set(h.map((x) => {
      var y;
      return (y = n.find((b) => b.id === a[x.id])) == null ? void 0 : y.name;
    }));
    return {
      id: `meta:${o}=${p}`,
      name: p,
      fileName: `${h.length} files`,
      ...m.size === 1 && [...m][0] ? { groupName: [...m][0] } : {},
      metadata: Cc(h.map((x) => x.metadata)),
      sampleIds: h.map((x) => x.id)
    };
  };
  return [
    ...c.map((p) => f(p, s.get(p))),
    ...l.length ? [f(Uh, l)] : []
  ];
}
function eg(t, e, r) {
  var o;
  const n = e.root_population_id, a = ((o = t.populations) == null ? void 0 : o.kind) === "branch" ? t.populations.populationId : null, i = (s) => {
    var u, c;
    if (!a) return !0;
    let l = (u = e.populations[s]) == null ? void 0 : u.parent_id;
    for (; l; ) {
      if (l === a) return !0;
      l = (c = e.populations[l]) == null ? void 0 : c.parent_id;
    }
    return !1;
  };
  return ua(e.populations, n).filter(({ popId: s }) => s !== n && i(s)).map(({ popId: s }) => {
    var l;
    return {
      id: s,
      name: ((l = e.populations[s]) == null ? void 0 : l.name) ?? s,
      fileName: r.fileName ?? r.name,
      sampleName: r.name,
      populationId: s
    };
  });
}
function rg(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const ng = (t) => [...t].sort((e, r) => e - r);
function vi(t, e) {
  const r = ng(t);
  if (!r.length) return NaN;
  const n = (r.length - 1) * e, a = Math.floor(n), i = Math.ceil(n);
  return r[a] + (r[i] - r[a]) * (n - a);
}
function ag(t, e) {
  const r = e.map((o) => o.value), n = r.length, a = n ? r.reduce((o, s) => o + s, 0) / n : NaN, i = n > 1 ? Math.sqrt(r.reduce((o, s) => o + (s - a) ** 2, 0) / (n - 1)) : 0;
  return {
    label: t,
    points: e,
    n,
    mean: a,
    sd: i,
    median: vi(r, 0.5),
    q1: vi(r, 0.25),
    q3: vi(r, 0.75),
    min: n ? Math.min(...r) : NaN,
    max: n ? Math.max(...r) : NaN
  };
}
function ig(t) {
  const e = [], r = /* @__PURE__ */ new Map();
  for (const n of t)
    r.has(n.group) || (r.set(n.group, []), e.push(n.group)), r.get(n.group).push(n);
  return e.map((n) => ag(n, r.get(n)));
}
function Dc(t) {
  const e = t.map((a, i) => ({ v: a, i })).sort((a, i) => a.v - i.v), r = new Array(t.length);
  let n = 0;
  for (let a = 0; a < e.length; ) {
    let i = a;
    for (; i + 1 < e.length && e[i + 1].v === e[a].v; ) i++;
    const o = i - a + 1, s = (a + i) / 2 + 1;
    for (let l = a; l <= i; l++) r[e[l].i] = s;
    o > 1 && (n += o ** 3 - o), a = i + 1;
  }
  return { rank: r, ties: n };
}
function og(t) {
  const e = Math.abs(t) / Math.SQRT2, r = 1 / (1 + 0.3275911 * e), i = r * (0.254829592 + r * (-0.284496736 + r * (1.421413741 + r * (-1.453152027 + r * 1.061405429)))) * Math.exp(-e * e) / 2;
  return t >= 0 ? i : 1 - i;
}
function sg(t, e) {
  if (e <= 0) return 0;
  const r = lg(t);
  if (e < t + 1) {
    let s = 1 / t, l = s;
    for (let u = 1; u < 500 && (l *= e / (t + u), s += l, !(Math.abs(l) < Math.abs(s) * 1e-14)); u++)
      ;
    return s * Math.exp(-e + t * Math.log(e) - r);
  }
  let n = e + 1 - t, a = 1 / 1e-300, i = 1 / n, o = i;
  for (let s = 1; s < 500; s++) {
    const l = -s * (s - t);
    n += 2, i = l * i + n, Math.abs(i) < 1e-300 && (i = 1e-300), a = n + l / a, Math.abs(a) < 1e-300 && (a = 1e-300), i = 1 / i;
    const u = i * a;
    if (o *= u, Math.abs(u - 1) < 1e-14) break;
  }
  return 1 - Math.exp(-e + t * Math.log(e) - r) * o;
}
function lg(t) {
  const e = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18];
  let r = t, n = t, a = r + 5.5;
  a -= (r + 0.5) * Math.log(a);
  let i = 1.000000000190015;
  for (const o of e) i += o / ++n;
  return -a + Math.log(2.5066282746310007 * i / r);
}
function ug(t, e) {
  return t > 0 ? Math.max(0, Math.min(1, 1 - sg(e / 2, t / 2))) : 1;
}
function cg(t, e) {
  if (t.length < 2 || e.length < 2) return null;
  const r = t.length, n = e.length, { rank: a, ties: i } = Dc([...t, ...e]), s = a.slice(0, r).reduce((p, h) => p + h, 0) - r * (r + 1) / 2, l = r + n, u = r * n / 2, c = Math.sqrt(r * n / 12 * (l + 1 - i / (l * (l - 1))));
  if (!(c > 0)) return { name: "Wilcoxon rank-sum", statistic: s, p: 1, label: "Wilcoxon p = 1" };
  const f = (Math.abs(s - u) - 0.5) / c, d = Math.min(1, 2 * og(Math.max(0, f)));
  return { name: "Wilcoxon rank-sum", statistic: s, p: d, label: `Wilcoxon ${_c(d)}` };
}
function fg(t) {
  const e = t.filter((c) => c.length > 0);
  if (e.length < 2 || e.some((c) => c.length < 2)) return null;
  const r = e.flat(), n = r.length, { rank: a, ties: i } = Dc(r);
  let o = 0, s = 0;
  for (const c of e) {
    const f = a.slice(o, o + c.length).reduce((d, p) => d + p, 0);
    s += f * f / c.length, o += c.length;
  }
  s = 12 / (n * (n + 1)) * s - 3 * (n + 1);
  const l = 1 - i / (n ** 3 - n);
  l > 0 && (s /= l);
  const u = ug(s, e.length - 1);
  return { name: "Kruskal–Wallis", statistic: s, p: u, label: `Kruskal–Wallis ${_c(u)}` };
}
function dg(t) {
  const e = t.map((r) => r.points.map((n) => n.value));
  return e.length === 2 ? cg(e[0], e[1]) : e.length > 2 ? fg(e) : null;
}
function _c(t) {
  return Number.isFinite(t) ? t < 1e-3 ? "p < 0.001" : `p = ${t < 0.01 ? t.toFixed(3) : t.toFixed(2)}` : "p = ?";
}
function pg(t, e = 5) {
  const r = t.filter((d) => Number.isFinite(d)), n = Math.min(0, ...r), a = Math.max(...r, n + 1e-9), o = (a - n || 1) / e, s = 10 ** Math.floor(Math.log10(o)), l = [1, 2, 2.5, 5, 10].map((d) => d * s).find((d) => d >= o) ?? s * 10, u = Math.floor(n / l) * l, c = Math.ceil((a + l * 0.15) / l) * l, f = [];
  for (let d = u; d <= c + l / 2; d += l) f.push(Number(d.toFixed(10)));
  return { min: u, max: c, ticks: f };
}
const Mc = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function vg(t, e, r, n, a) {
  var d, p;
  const i = e.find((h) => h.id === t.sampleId) ?? null, o = ((d = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : d.name) ?? "the population", s = t.files === "all" ? e : e.filter((h) => n.includes(h.id)), l = [], u = [];
  for (const h of s) {
    let m = t.populationId;
    if (i && i.tree.id !== h.tree.id) {
      const b = Tr(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        h.tree,
        cr(a)
      );
      if (!b.id) {
        u.push(h.name);
        continue;
      }
      m = b.id;
    }
    let x;
    if (t.statistic === "median") {
      const b = t.channel ? h.sample.index(t.channel) : void 0, E = h.derived.masks[m];
      if (b === void 0 || !E) x = null;
      else {
        const w = h.sample.displayColumn(b), _ = [];
        for (let D = 0; D < w.length; D++) E[D] && Number.isFinite(w[D]) && _.push(w[D]);
        x = _.length ? lf(_) : null;
      }
    } else
      x = h.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][m];
    if (typeof x != "number" || !Number.isFinite(x)) continue;
    const y = t.groupBy ? ((p = r[h.id]) == null ? void 0 : p[t.groupBy]) ?? "" : h.name;
    l.push({ sampleId: h.id, name: h.name, group: y, value: x });
  }
  const c = ig(l), f = t.statistic === "median" ? `Median ${t.channel ?? ""}`.trim() : Mc[t.statistic];
  return { points: l, groups: c, test: t.test && t.groupBy ? dg(c) : null, population: o, axis: f, missing: u };
}
const hi = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), hg = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function gg({
  data: t,
  recipe: e,
  style: r,
  width: n,
  height: a,
  title: i
}) {
  const o = r.fontTick, s = r.fontAxis, l = r.fontTitle, u = t.groups, c = rt.useMemo(() => pg(t.points.map((k) => k.value)), [t.points]), f = 8 + s + 6 + Math.max(...c.ticks.map((k) => hi(k).length), 1) * o * 0.6 + 8, d = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), p = Math.max(0, ...u.map((k) => k.label.length)), h = u.length > 0 && p * o * 0.6 > (n - f - 8) / u.length, m = 8 + (h ? p * o * 0.45 + 10 : o + 8), x = Math.max(20, n - f - 8), y = Math.max(20, a - d - m), b = (k) => d + y - (k - c.min) / (c.max - c.min || 1) * y, E = u.length ? x / u.length : x, w = (k) => f + (k + 0.5) * E, _ = Math.min(48, E * 0.6), D = r.pubStyle ? "#000000" : "#334155", M = r.pubStyle ? "#d4d4d8" : "#93c5fd", g = r.pubStyle ? "#000000" : "#1d4ed8", T = b(Math.max(c.min, 0));
  return /* @__PURE__ */ C.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: n, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ C.jsxs("svg", { width: n, height: a, viewBox: `0 0 ${n} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ C.jsx("rect", { width: n, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ C.jsx("text", { x: n / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: D, children: i }),
    !t.points.length && /* @__PURE__ */ C.jsx("text", { x: n / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ C.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: D, children: [
      /* @__PURE__ */ C.jsx("line", { x1: f, x2: f, y1: d, y2: d + y, stroke: D }),
      c.ticks.map((k) => /* @__PURE__ */ C.jsxs("g", { children: [
        /* @__PURE__ */ C.jsx("line", { x1: f - 4, x2: f, y1: b(k), y2: b(k), stroke: D }),
        /* @__PURE__ */ C.jsx("text", { x: f - 6, y: b(k), textAnchor: "end", dominantBaseline: "central", children: hi(k) })
      ] }, k)),
      /* @__PURE__ */ C.jsx("text", { transform: `translate(${8 + s} ${d + y / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ C.jsx("line", { x1: f, x2: f + x, y1: T, y2: T, stroke: D })
    ] }),
    /* @__PURE__ */ C.jsx("g", { className: "gl-layout-chart-groups", children: u.map((k, z) => {
      const O = w(z), R = e.showPoints || e.chartType === "dots" ? k.points : [];
      return /* @__PURE__ */ C.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(k.mean) && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
          /* @__PURE__ */ C.jsx("rect", { x: O - _ / 2, y: Math.min(b(k.mean), T), width: _, height: Math.abs(T - b(k.mean)), fill: M, stroke: D, strokeWidth: 0.8 }),
          k.n > 1 && k.sd > 0 && /* @__PURE__ */ C.jsxs("g", { stroke: D, strokeWidth: 1, children: [
            /* @__PURE__ */ C.jsx("line", { x1: O, x2: O, y1: b(k.mean - k.sd), y2: b(k.mean + k.sd) }),
            /* @__PURE__ */ C.jsx("line", { x1: O - _ / 4, x2: O + _ / 4, y1: b(k.mean + k.sd), y2: b(k.mean + k.sd) }),
            /* @__PURE__ */ C.jsx("line", { x1: O - _ / 4, x2: O + _ / 4, y1: b(k.mean - k.sd), y2: b(k.mean - k.sd) })
          ] })
        ] }),
        e.chartType === "box" && k.n > 0 && /* @__PURE__ */ C.jsxs("g", { stroke: D, strokeWidth: 1, fill: M, children: [
          /* @__PURE__ */ C.jsx("line", { x1: O, x2: O, y1: b(k.min), y2: b(k.q1) }),
          /* @__PURE__ */ C.jsx("line", { x1: O, x2: O, y1: b(k.q3), y2: b(k.max) }),
          /* @__PURE__ */ C.jsx("rect", { x: O - _ / 2, y: b(k.q3), width: _, height: Math.max(0.5, b(k.q1) - b(k.q3)) }),
          /* @__PURE__ */ C.jsx("line", { x1: O - _ / 2, x2: O + _ / 2, y1: b(k.median), y2: b(k.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && k.n > 1 && /* @__PURE__ */ C.jsx("line", { x1: O - _ / 2, x2: O + _ / 2, y1: b(k.mean), y2: b(k.mean), stroke: D, strokeWidth: 2 }),
        R.map((j, A) => /* @__PURE__ */ C.jsx("circle", { cx: O + hg(A + z * 31) * _ * 0.3, cy: b(j.value), r: Math.max(2, o * 0.28), fill: g, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ C.jsx("title", { children: `${j.name}: ${hi(j.value)}` }) }, j.sampleId)),
        /* @__PURE__ */ C.jsx(
          "text",
          {
            x: O,
            y: d + y + 6,
            textAnchor: h ? "end" : "middle",
            dominantBaseline: "hanging",
            fontSize: o,
            fill: D,
            transform: h ? `rotate(-45 ${O} ${d + y + 6})` : void 0,
            children: k.label
          }
        )
      ] }, k.label || String(z));
    }) }),
    t.test && u.length >= 2 && /* @__PURE__ */ C.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: D, children: [
      /* @__PURE__ */ C.jsx("line", { x1: w(0), x2: w(u.length - 1), y1: d - 4, y2: d - 4, stroke: D }),
      /* @__PURE__ */ C.jsx("text", { x: (w(0) + w(u.length - 1)) / 2, y: d - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const gi = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), mg = { x: "X (px)", y: "Y (px)", width: "Width (px)", height: "Height (px)" }, rn = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], wl = 10, xg = { index: 0, units: [], items: [] }, yg = {}, Dl = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, bg = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], Sg = [
  { how: "horizontal", label: "Distribute ↔", title: "Equal spacing between three or more items or groups, left to right; the outer two stay where they are" },
  { how: "vertical", label: "Distribute ↕", title: "Equal spacing between three or more items or groups, top to bottom; the outer two stay where they are" }
];
function Cg(t) {
  var r, n, a;
  if (!t) return;
  t.stopDrag();
  const e = (r = t.getManager) == null ? void 0 : r.call(t);
  for (const i of ((n = e == null ? void 0 : e.getMoveables) == null ? void 0 : n.call(e)) ?? []) i !== e && ((a = i.stopDrag) == null || a.call(i));
}
function Eg(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function wg(t, e, r) {
  return e ? r.some((n) => !!n && (t === `${e} · ${n}` || t.startsWith(`${e} · ${n} · `))) : !1;
}
function $e(t, e, r) {
  var s, l, u;
  const n = t.recipe;
  if (n.kind === "text") return n.text.split(`
`)[0] || "Text";
  if ((s = n.title) != null && s.trim()) return n.title.trim();
  if (n.kind === "figure") return ((u = (l = n.illustration.figure) == null ? void 0 : l.name) == null ? void 0 : u.trim()) || "Figure";
  if (n.kind === "proportions") return n.settings.plotType === "box" ? "Boxplot" : "Composition";
  const a = e.find(({ id: c }) => c === n.sampleId), i = a == null ? void 0 : a.tree.populations[n.populationId];
  if (n.kind === "chart") return `${(i == null ? void 0 : i.name) ?? "Population"} · ${Mc[n.statistic]}`;
  if (n.kind === "strategy")
    return `${(i == null ? void 0 : i.name) ?? "Population"} strategy`;
  const o = hn(n);
  return o ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${o.length} files` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function hn(t) {
  return (t.kind === "biplot" || t.kind === "histogram") && t.pool && t.pool.sampleIds.length > 1 ? t.pool.sampleIds : null;
}
function Ki(t, e, r, n) {
  var u;
  const a = ((u = t.pool) == null ? void 0 : u.sampleIds) ?? [t.sampleId], i = e.find(({ id: c }) => c === t.sampleId) ?? e.find(({ id: c }) => a.includes(c)) ?? null, o = [], s = [];
  if (!i) return { members: o, leftOut: s };
  const l = t.kind === "histogram" ? null : t.yChannel;
  for (const c of [i.id, ...a.filter((f) => f !== i.id)]) {
    const f = e.find((h) => h.id === c);
    if (!f) {
      s.push({ name: c, reason: "not loaded" });
      continue;
    }
    const d = Tl(t.populationId, f.tree, r, n ?? i.tree.id);
    if (d.missing) {
      s.push({ name: f.name, reason: "no corresponding population" });
      continue;
    }
    const p = f === i ? null : mf(i.sample, f.sample, t.xChannel, l);
    if (p) {
      s.push({ name: f.name, reason: p });
      continue;
    }
    o.push({ id: f.id, name: f.name, sample: f.sample, tree: f.tree, gating: f.derived, populationId: d.id });
  }
  return { members: o, leftOut: s };
}
function Dg({
  files: t,
  pool: e,
  checkedSampleIds: r,
  groups: n,
  fileGroups: a,
  report: i,
  onChange: o
}) {
  const { t: s } = Sn(), [l, u] = rt.useState(""), c = rt.useMemo(
    () => Object.fromEntries(t.filter((m) => m.metadata).map((m) => [m.id, m.metadata])),
    [t]
  ), f = rt.useMemo(
    () => Cf(c, [...new Set(Object.values(c).flatMap((m) => Object.keys(m)))].map((m) => ({ name: m }))),
    [c]
  ), d = rt.useMemo(() => new Set(t.filter((m) => !e.includes(m.id)).map((m) => m.id)), [t, e]), p = (m) => t.filter((x) => m instanceof Set ? m.has(x.id) : m.includes(x.id)).map((x) => x.id), h = l.trim().toLowerCase();
  return /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-pool", children: [
    /* @__PURE__ */ C.jsxs("div", { className: "gl-figure-actions gl-figure-list-actions", children: [
      /* @__PURE__ */ C.jsx("button", { type: "button", onClick: () => o(p(r)), children: s("Checked files") }),
      /* @__PURE__ */ C.jsx("button", { type: "button", onClick: () => o(t.map((m) => m.id)), children: s("All files") }),
      n.map((m) => /* @__PURE__ */ C.jsx("button", { type: "button", onClick: () => o(t.filter((x) => a[x.id] === m.id).map((x) => x.id)), children: s("Group {name}", { name: m.name }) }, m.id))
    ] }),
    /* @__PURE__ */ C.jsx(
      "input",
      {
        type: "search",
        "aria-label": s("Find files to pool"),
        placeholder: s("Find file / sample…"),
        value: l,
        onChange: (m) => u(m.target.value)
      }
    ),
    /* @__PURE__ */ C.jsx("div", { className: "gl-figure-list gl-layout-pool-list", children: t.filter((m) => !h || `${m.name} ${m.fileName ?? ""}`.toLowerCase().includes(h)).map((m) => /* @__PURE__ */ C.jsxs("label", { className: "gl-figure-row", title: m.fileName && m.fileName !== m.name ? `${m.name} · ${m.fileName}` : m.name, children: [
      /* @__PURE__ */ C.jsx(
        "input",
        {
          type: "checkbox",
          checked: e.includes(m.id),
          onChange: () => o(e.includes(m.id) ? e.filter((x) => x !== m.id) : p([...e, m.id]))
        }
      ),
      /* @__PURE__ */ C.jsx("span", { className: "gl-figure-row-name", children: m.name })
    ] }, m.id)) }),
    f.length > 0 && /* @__PURE__ */ C.jsx("div", { className: "gl-sample-facets gl-figure-facets", "aria-label": s("Select pooled files by metadata"), children: f.map((m) => /* @__PURE__ */ C.jsxs("div", { className: "gl-sample-facet-row", children: [
      /* @__PURE__ */ C.jsx("span", { className: "gl-sample-facet-lock", "aria-hidden": "true" }),
      /* @__PURE__ */ C.jsx("span", { className: "gl-sample-facet-name", title: m.name, children: m.name }),
      /* @__PURE__ */ C.jsx("div", { className: "gl-sample-facet-values", children: m.values.map((x) => {
        const y = Ef(x.sampleIds, d), b = x.sampleIds.length, E = y === b ? "all" : y === 0 ? "none" : "some", w = b > 0 ? Math.round(y / b * 100) : 0;
        return /* @__PURE__ */ C.jsxs(
          "button",
          {
            type: "button",
            className: `gl-sample-facet-chip is-${E}`,
            style: E === "some" ? { "--gl-facet-fill": `${w}%` } : void 0,
            "aria-pressed": y === b,
            title: `${x.value}: ${y} of ${b} pooled — ${y === b ? `click to drop all ${b}` : `click to pool all ${b}`}`,
            onClick: () => o(p(new Set(t.filter((_) => !wf(x.sampleIds, d).has(_.id)).map((_) => _.id)))),
            children: [
              /* @__PURE__ */ C.jsx("span", { className: "gl-sample-facet-label", children: x.value }),
              /* @__PURE__ */ C.jsxs("span", { className: "gl-sample-facet-count", children: [
                y,
                "/",
                b
              ] })
            ]
          },
          x.value
        );
      }) })
    ] }, m.name)) }),
    i && /* @__PURE__ */ C.jsxs("p", { className: "gl-hint", children: [
      s("{n} of {m} files pooled", { n: i.pooled, m: i.total }),
      i.leftOut.length > 0 && ` · ${s("Not pooled: {files}", { files: i.leftOut.map((m) => `${m.name} (${m.reason})`).join(", ") })}`,
      i.omittedGates.length > 0 && ` · ${s("Gates not shown: {names} — they differ between the pooled files", { names: i.omittedGates.join(", ") })}`
    ] })
  ] });
}
function _g({
  item: t,
  samples: e,
  state: r,
  globalScales: n,
  dataRevision: a,
  densityColorPower: i,
  style: o,
  canvasScale: s,
  titleTemplate: l,
  describe: u
}) {
  var z, O;
  const c = rt.useRef(null), f = t.recipe, d = JSON.stringify(o), p = rt.useMemo(() => cr(r), [r]), h = f.kind === "text" ? null : e.find(({ id: R }) => R === f.sampleId) ?? null, m = hn(f), x = (m == null ? void 0 : m.join("|")) ?? "", y = rt.useMemo(
    () => x ? x.split("|").map((R) => e.find((j) => j.id === R) ?? null) : null,
    [e, x]
  ), b = h ? { ...r, ...h.tree } : r, E = f.kind !== "text" && t.templateSampleId && t.templateSampleId !== f.sampleId ? e.find(({ id: R }) => R === t.templateSampleId) ?? null : null, w = f.kind === "text" || !h ? { id: f.kind === "text" ? "" : f.populationId, missing: !1 } : Tl(f.populationId, h.tree, p, E == null ? void 0 : E.tree.id), _ = w.id, D = w.missing ? ((z = E == null ? void 0 : E.tree.populations[f.kind === "text" ? "" : f.populationId]) == null ? void 0 : z.name) ?? "the population" : null, M = f.kind === "text" ? null : u({ ...f, populationId: _ }, void 0, t.unitId), g = (R) => M ? Ma(R, M) : R, T = f.kind === "strategy" ? g(((O = f.title) == null ? void 0 : O.trim()) || "{population}") : g(l), k = JSON.stringify(f);
  return rt.useEffect(() => {
    const R = c.current;
    if (!R || f.kind === "text") return;
    const j = window.setTimeout(() => {
      var nt, Q;
      if (R.innerHTML = "", !h) {
        R.textContent = "The referenced file is unavailable or still loading.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      const A = b.populations[_];
      if (D || !A) {
        R.textContent = D ? `${h.name} has no population corresponding to ${D}.` : "The referenced population is unavailable.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      R.className = "gl-layout-plot-host";
      const W = Math.max(120, t.width - 8), X = Math.max(120, t.height - 8);
      if (f.kind === "strategy") {
        const at = Rf(
          h.sample,
          b.gates,
          b.populations,
          b.root_population_id ?? "",
          _,
          { fullPath: f.fullPath, maxEvents: o.maxEvents }
        ), it = 8, mt = 26, yt = Math.max(1, at.length);
        let Z = 1, ut = 0;
        for (let pt = 1; pt <= yt; pt++) {
          const ht = Math.ceil(yt / pt), bt = Math.floor((W - it * (pt - 1)) / pt), gt = Math.floor((X - mt - it * (ht - 1)) / ht), _t = Math.min(bt, gt);
          _t > ut && (ut = _t, Z = pt);
        }
        ut = Math.max(100, Math.min(800, ut));
        const Ct = Pf(
          h.sample,
          at,
          null,
          n,
          {
            gateView: ["forward"],
            displayMode: f.displayMode,
            maxEvents: o.maxEvents,
            nColumns: Z,
            plotSize: ut,
            fitToColumns: !1,
            contourThreshold: o.contourThreshold,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateLabelFormat: o.gateLabels,
            fontSizes: gi(o),
            contextTitle: T
          }
        );
        R.id = `layout-strategy-${t.id}`;
        for (const pt of Object.values(Ct.plots ?? {})) pt.canvas_scale = s;
        Cs().renderStrategyGrid(R.id, Ct);
        return;
      }
      const L = Math.max(120, Math.min(W, X)), q = f.kind === "histogram" ? null : f.yChannel, V = {
        displayMode: f.displayMode,
        maxEvents: o.maxEvents,
        nColumns: 1,
        plotSize: L,
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
        histOverlayMode: "front_opaque",
        histLayout: "grid",
        ridgeOverlap: 0.7,
        ridgeColGap: 8,
        ridgeGradient: !1,
        pubStyle: o.pubStyle,
        gateLineWidth: o.gateLineWidth,
        gateLabelFormat: o.gateLabels,
        fontSizes: gi(o),
        scaleFontsWithPlot: !0
      }, F = (at, it) => Cs().renderMiniPlot(R, {
        ...at,
        display_mode: f.displayMode,
        plot_size: L,
        canvas_scale: s,
        contour_threshold: o.contourThreshold,
        point_alpha: o.pointAlpha,
        density_color_power: i,
        point_size: o.pointSize,
        kde_bandwidth: o.kdeBandwidth,
        hist_line_width: o.histLineWidth,
        hist_fill: o.histFill,
        hist_fill_alpha: o.histFillAlpha,
        hist_overlay_mode: "front_opaque",
        title: T,
        contour_levels: o.contourLevels,
        font_sizes: gi(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: "#334155",
        gates: it
      });
      if (y) {
        const { members: at } = Ki(f, e, p, E == null ? void 0 : E.tree.id), it = at.length ? Of(at, f.xChannel, q, n, V, p) : null;
        if (!it) {
          R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
          return;
        }
        F(it.config, it.gates);
        return;
      }
      const et = Nf(
        h.sample,
        b.gates,
        b.gate_order,
        b.populations,
        h.derived.masks,
        h.derived.stats.event_count,
        [_],
        [f.xChannel],
        q,
        n,
        V,
        h.derived.gateMasks
      ), tt = `${_}|${f.xChannel}`, K = (nt = et.plots) == null ? void 0 : nt[tt];
      if (!K) {
        R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      F(K, ((Q = et.gate_overlays) == null ? void 0 : Q[tt]) ?? []);
    }, 80);
    return () => window.clearTimeout(j);
  }, [
    a,
    i,
    d,
    n,
    t.height,
    t.id,
    t.width,
    k,
    h,
    b.gate_order,
    b.gate_version,
    b.gates,
    b.stored_hierarchies,
    b.populations,
    b.root_population_id,
    _,
    D,
    s,
    T,
    y,
    p
  ]), f.kind === "text" ? /* @__PURE__ */ C.jsx(
    "div",
    {
      className: "gl-layout-text-surface",
      style: { fontSize: f.fontSize, fontWeight: f.bold ? 700 : 400 },
      children: f.text
    }
  ) : /* @__PURE__ */ C.jsx("div", { ref: c, className: "gl-layout-plot-host" });
}
function Mg({
  item: t,
  templateText: e,
  selected: r,
  samples: n,
  state: a,
  globalScales: i,
  dataRevision: o,
  densityColorPower: s,
  style: l,
  titleTemplate: u,
  describe: c,
  checkedSampleIds: f,
  metadataById: d,
  files: p,
  sources: h,
  divisionProfiles: m,
  canvasScale: x,
  onTextChange: y,
  onTextFocus: b,
  textEditing: E,
  onTextEditStart: w,
  onTextEditEnd: _,
  onIsolate: D
}) {
  var k;
  const { t: M } = Sn(), g = kf(t), T = g === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / g)), height: Math.max(1, Math.round(t.height / g)) };
  return /* @__PURE__ */ C.jsx(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": g === 1 ? void 0 : g,
      title: `${t.locked ? `${M("Locked")} · ` : ""}${$e(t, n)}`,
      "data-title": $e(t, n),
      onDoubleClick: D ? (z) => {
        z.stopPropagation(), D();
      } : void 0,
      className: `gl-layout-item${r ? " is-selected" : ""}${t.showFrame ? " has-frame" : ""}${t.recipe.kind === "text" ? " is-text" : ""}${t.locked ? " is-locked" : ""}`,
      style: {
        left: t.x,
        top: t.y,
        width: t.width,
        height: t.height,
        zIndex: t.z
      },
      children: /* @__PURE__ */ C.jsx("div", { className: "gl-layout-item-body", style: g === 1 ? void 0 : { zoom: g, width: T.width, height: T.height }, children: t.recipe.kind === "text" ? /* @__PURE__ */ C.jsx(
        Tg,
        {
          text: t.recipe.text,
          templateText: e ?? t.recipe.text,
          fontSize: t.recipe.fontSize,
          bold: t.recipe.bold,
          editing: E,
          onEditStart: w,
          onEditEnd: _,
          onCommit: y,
          onFocus: b
        }
      ) : t.recipe.kind === "figure" ? /* @__PURE__ */ C.jsx(
        Tf,
        {
          recipe: t.recipe,
          files: p,
          sources: h,
          state: a,
          globalScales: i,
          width: Math.max(120, T.width - 8),
          height: Math.max(80, T.height - 8)
        }
      ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ C.jsx(
        If,
        {
          recipe: t.recipe,
          samples: p,
          state: a,
          metadataById: d,
          divisionProfiles: m,
          width: Math.max(120, T.width - 8),
          height: Math.max(80, T.height - 8),
          containerId: `layout-proportions-${t.id}`
        }
      ) : t.recipe.kind === "chart" ? /* @__PURE__ */ C.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ C.jsx(
        gg,
        {
          data: vg(t.recipe, n, d, f, a),
          recipe: t.recipe,
          style: l,
          width: Math.max(120, T.width - 8),
          height: Math.max(80, T.height - 8),
          title: ((k = t.recipe.title) == null ? void 0 : k.trim()) || $e(t, n)
        }
      ) }) : /* @__PURE__ */ C.jsx(
        _g,
        {
          item: T,
          samples: n,
          state: a,
          globalScales: i,
          dataRevision: o,
          densityColorPower: s,
          style: l,
          canvasScale: x,
          titleTemplate: u,
          describe: c
        }
      ) })
    }
  );
}
const kg = [
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
  { key: "fontGate", label: "Gate label font", step: 1 }
];
function _l({
  effective: t,
  own: e,
  onChange: r
}) {
  const { t: n } = Sn();
  return /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-style-fields", children: [
    kg.map(({ key: a, label: i, step: o, integer: s }) => /* @__PURE__ */ C.jsxs(rt.Fragment, { children: [
      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline" + (a in e ? " is-own" : ""), children: [
        n(i),
        /* @__PURE__ */ C.jsx(
          Ee,
          {
            "aria-label": n(i),
            value: a === "maxEvents" && t.maxEvents === 0 ? ys.maxEvents : t[a],
            min: xs[a][0],
            max: xs[a][1],
            step: o,
            integer: s,
            disabled: a === "maxEvents" && t.maxEvents === 0,
            onCommit: (l) => r({ [a]: l })
          }
        )
      ] }),
      a === "maxEvents" && // An event cap of 0 is every event, as on the Gating tab: a pooled plot of a whole SCE
      // can then be drawn as the Gating tab's pooled view draws it.
      /* @__PURE__ */ C.jsxs("label", { className: "gl-check" + ("maxEvents" in e ? " is-own" : ""), title: n("Draw every event of the plot's files rather than a sample of them; a plot of a million points repaints slowly. Counts and percentages always use every event."), children: [
        /* @__PURE__ */ C.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.maxEvents === 0,
            onChange: (l) => r({ maxEvents: l.target.checked ? 0 : ys.maxEvents })
          }
        ),
        n("All events")
      ] })
    ] }, a)),
    /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline" + ("gateLabels" in e ? " is-own" : ""), children: [
      n("Gate labels"),
      /* @__PURE__ */ C.jsxs(
        "select",
        {
          "aria-label": n("Gate labels"),
          value: t.gateLabels,
          onChange: (a) => r({ gateLabels: a.target.value }),
          children: [
            /* @__PURE__ */ C.jsx("option", { value: "name-percent", children: n("Name and percentage") }),
            /* @__PURE__ */ C.jsx("option", { value: "percent", children: n("Percentage") }),
            /* @__PURE__ */ C.jsx("option", { value: "number", children: n("Number only") }),
            /* @__PURE__ */ C.jsx("option", { value: "name", children: n("Name only") }),
            /* @__PURE__ */ C.jsx("option", { value: "none", children: n("None") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ C.jsxs("label", { className: "gl-check" + ("pubStyle" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ C.jsx(
        "input",
        {
          type: "checkbox",
          checked: t.pubStyle,
          onChange: (a) => r({ pubStyle: a.target.checked })
        }
      ),
      n("Publication style (black gates and labels)")
    ] }),
    /* @__PURE__ */ C.jsxs("label", { className: "gl-check" + ("histFill" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ C.jsx(
        "input",
        {
          type: "checkbox",
          checked: t.histFill,
          onChange: (a) => r({ histFill: a.target.checked })
        }
      ),
      n("Fill histograms")
    ] })
  ] });
}
function Tg({
  text: t,
  templateText: e,
  fontSize: r,
  bold: n,
  editing: a,
  onEditStart: i,
  onEditEnd: o,
  onCommit: s,
  onFocus: l
}) {
  const { t: u } = Sn(), [c, f] = rt.useState(e), d = rt.useRef(null);
  rt.useEffect(() => {
    if (!a) return;
    f(e);
    const h = d.current;
    h && (h.focus({ preventScroll: !0 }), h.setSelectionRange(h.value.length, h.value.length));
  }, [a]);
  const p = { fontSize: r, fontWeight: n ? 700 : 400 };
  return a ? /* @__PURE__ */ C.jsx(
    "textarea",
    {
      ref: d,
      className: "gl-layout-text-surface",
      "aria-label": "Layout text",
      value: c,
      style: p,
      onChange: (h) => f(h.target.value),
      onFocus: l,
      onBlur: (h) => {
        c !== e && s(c, h.currentTarget.scrollHeight), o();
      },
      onKeyDown: (h) => {
        h.stopPropagation(), h.key === "Escape" && h.currentTarget.blur();
      }
    }
  ) : /* @__PURE__ */ C.jsx(
    "div",
    {
      className: "gl-layout-text-surface is-static",
      style: p,
      title: u("Double-click to edit"),
      onDoubleClick: (h) => {
        h.stopPropagation(), i();
      },
      children: t
    }
  );
}
function Rg({
  workspace: t,
  onChange: e,
  samples: r,
  checkedSampleIds: n = [],
  groups: a = [],
  fileGroups: i = {},
  metadataColumns: o = [],
  metadataLevels: s,
  populationMetadata: l,
  activeSampleId: u,
  activePopulationId: c,
  state: f,
  globalScales: d,
  defaultX: p,
  defaultY: h,
  illustrationConfig: m,
  onOpenInIllustration: x,
  plottingSettings: y,
  divisionProfiles: b = yg,
  onOpenInPlotting: E,
  dataRevision: w,
  densityColorPower: _,
  onOpenInGating: D,
  onExported: M
}) {
  var is, os, ss, ls;
  const { t: g } = Sn(), [T, k] = rt.useState([]), [z, O] = rt.useState(null), [R, j] = rt.useState(!0), [A, W] = rt.useState(null), [X, L] = rt.useState(null), [q, V] = rt.useState([]), [F, et] = rt.useState([]), tt = rt.useRef(null), K = rt.useRef(null), [nt, Q] = rt.useState(null), [at, it] = rt.useState(null), [mt, yt] = rt.useState(
    u ?? ((is = r[0]) == null ? void 0 : is.id) ?? ""
  ), [Z, ut] = rt.useState("item"), [Ct, pt] = rt.useState(!1), [ht, bt] = rt.useState({ shift: !1, meta: !1 });
  rt.useEffect(() => {
    const v = (I) => bt((B) => {
      const G = { shift: I.shiftKey, meta: I.metaKey || I.ctrlKey };
      return G.shift === B.shift && G.meta === B.meta ? B : G;
    }), S = () => bt((I) => I.shift || I.meta ? { shift: !1, meta: !1 } : I);
    return window.addEventListener("keydown", v), window.addEventListener("keyup", v), window.addEventListener("blur", S), () => {
      window.removeEventListener("keydown", v), window.removeEventListener("keyup", v), window.removeEventListener("blur", S);
    };
  }, []);
  const [gt, _t] = rt.useState(1), St = rt.useRef(gt);
  St.current = gt;
  const [Mt, Ht] = rt.useState(gt);
  rt.useEffect(() => {
    const v = window.setTimeout(() => Ht(gt), 250);
    return () => window.clearTimeout(v);
  }, [gt]);
  const ae = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * Mt)), [$t, Gt] = rt.useState("pdf"), [jt, ze] = rt.useState(!1), [Te, In] = rt.useState(3), [Ue, Rn] = rt.useState(!1), We = rt.useRef(null), lr = rt.useRef(null), Ke = (v) => {
    var S;
    k(v), (S = We.current) == null || S.focus({ preventScroll: !0 });
  }, Pn = (v) => Ke(v ? [v] : []), he = uf(
    r,
    r.map((v) => v.id),
    f,
    w
  ), It = rt.useMemo(
    () => he.current ? he.sources.map((v) => ({ ...v, derived: v.gating })) : [],
    [he.current, he.sources]
  ), Er = rt.useMemo(
    () => Object.fromEntries(r.map((v) => [v.id, v.metadata])),
    [r]
  ), Ze = rt.useMemo(() => cr(f), [f]), Ft = r.length === 0 || he.current && he.pending === 0, kt = rt.useRef([]), Lt = rt.useRef([]), U = t.sheets.find(({ id: v }) => v === t.activeSheetId) ?? t.sheets[0], ft = (U == null ? void 0 : U.iteration) ?? kl, te = rt.useMemo(() => {
    const v = U == null ? void 0 : U.items.find((I) => oe(I.recipe) && I.recipe.iterated === !0), S = v && "sampleId" in v.recipe ? v.recipe.sampleId : u;
    return It.find(({ id: I }) => I === S) ?? It[0] ?? null;
  }, [U, It, u]), be = rt.useMemo(
    () => ft.mode === "populations" ? te ? eg(ft, te.tree, r.find(({ id: v }) => v === te.id) ?? te) : [] : ft.mode === "metadata" ? tg(ft, r, n, a, i, s == null ? void 0 : s[ft.column ?? ""]) : Qh(ft, r, n, a, i),
    [ft, r, n, a, i, te, s]
  ), wr = rt.useCallback((v, S, I) => {
    var lt;
    const B = r.find(({ id: Dt }) => Dt === v.sampleId) ?? null, G = It.find(({ id: Dt }) => Dt === v.sampleId) ?? null;
    let $ = v.populationId;
    if (G && S && S !== v.sampleId) {
      const Dt = It.find(({ id: ee }) => ee === S);
      if (Dt && Dt.tree.id !== G.tree.id) {
        const ee = Tr({ hierarchyId: Dt.tree.id, populationId: v.populationId }, G.tree, cr(f));
        ee.id && ($ = ee.id);
      }
    }
    const Y = G == null ? void 0 : G.tree.populations[$], st = hn(v);
    if (st && v.kind !== "strategy") {
      const { members: Dt } = Ki(v, It, Ze, S ? (lt = It.find(({ id: Vt }) => Vt === S)) == null ? void 0 : lt.tree.id : void 0), ee = Dt.reduce((Vt, us) => Vt + (us.gating.stats.event_count[us.populationId] ?? 0), 0), Se = I ? be.find((Vt) => Vt.id === I) : void 0;
      return Cl(
        v,
        { name: Se != null && Se.sampleIds ? Se.name : `${st.length} files`, fileName: `${st.length} files`, metadata: Cc(st.map((Vt) => Er[Vt])) },
        Y ? { id: $, name: Y.name } : null,
        Dt.length ? ee : void 0,
        l
      );
    }
    const wt = G == null ? void 0 : G.derived.stats.event_count[$];
    return Cl(
      v.kind === "strategy" ? {} : v,
      B ? { name: B.name, fileName: B.fileName ?? B.name, metadata: B.metadata } : null,
      Y ? { id: $, name: Y.name } : null,
      typeof wt == "number" ? wt : void 0,
      l
    );
  }, [r, It, f, l, Ze, Er, be]), ge = rt.useMemo(
    () => U ? Zh(U, be, wr) : [],
    [U, be, wr]
  ), [Ba, Dr] = rt.useState(0), [zo, kc] = rt.useState(!1), [Tc, Ic] = rt.useState(" · "), jo = rt.useMemo(
    () => [...new Set(Object.values(l ?? {}).flatMap((v) => Object.keys(v)))].sort(),
    [l]
  ), Ao = rt.useMemo(() => $h(o, jo), [o, jo]), je = Math.min(Ba, Math.max(0, ge.length - 1)), qt = ge[je] ?? xg, Bo = ((os = U == null ? void 0 : U.titleTemplate) == null ? void 0 : os.trim()) || Vh(
    qt.items.flatMap((v) => {
      var S;
      return oe(v.recipe) ? [{ sampleId: ((S = hn(v.recipe)) == null ? void 0 : S.join(",")) ?? v.recipe.sampleId, populationId: v.recipe.populationId, label: v.recipe.kind === "strategy" ? void 0 : v.recipe.label }] : [];
    }),
    ft.mode === "metadata" ? { metadataColumn: ft.column } : void 0
  );
  rt.useEffect(() => {
    Ba !== je && Dr(je);
  }, [Ba, je]);
  const Kr = (v) => v.split("::")[0], ie = [...new Set(T.map(Kr))], de = (U == null ? void 0 : U.items.filter(({ id: v }) => ie.includes(v))) ?? [], ot = de.length === 1 ? de[0] : null, Ae = ot ? qt.items.find((v) => v.templateId === ot.id) ?? null : null, Go = (v) => v.split("::")[1] ?? "", On = (v) => {
    var S;
    return (S = qt.items.find((I) => I.id === v)) == null ? void 0 : S.group;
  }, Fo = (v) => {
    const S = new Set(v.map(On).filter((G) => !!G));
    if (!S.size) return [...v];
    const I = new Set(v.map(Go)), B = new Set(v);
    for (const G of qt.items) G.group && S.has(G.group) && I.has(Go(G.id)) && B.add(G.id);
    return [...B];
  }, Zr = cf(de).length, Rc = de.length > 1 && de.every((v) => v.group && v.group === de[0].group), Lo = (v, S) => {
    var G;
    if (!oe(v.recipe)) return "";
    const I = ((G = v.recipe.title) == null ? void 0 : G.trim()) ?? "";
    if (!I) return "";
    const B = wr(v.recipe, S);
    return B && wg(I, B.population, [B.file, B.sample]) ? "" : I;
  }, Pc = Ae && oe(Ae.recipe) ? Ma(Bo, wr(Ae.recipe, Ae.templateSampleId, Ae.unitId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", Ga = de.some((v) => v.locked), Nn = new Set(((U == null ? void 0 : U.items) ?? []).filter((v) => v.locked).map((v) => v.id)), Ye = q.filter((v) => !Nn.has(Kr(v.dataset.itemId ?? "")) && v.dataset.itemId !== z), Jr = Ye.length > 1 && Ye.every((v) => !On(v.dataset.itemId ?? "")), Wo = rt.useRef(Ye);
  Wo.current = Ye;
  const zn = rt.useRef(!1);
  rt.useEffect(() => {
    T.length && T.some((v) => !qt.items.some((S) => S.id === v)) && k((v) => v.filter((S) => qt.items.some((I) => I.id === S)));
  }, [qt, T]), rt.useLayoutEffect(() => {
    var v;
    (v = tt.current) == null || v.updateRect();
  }, [qt, gt, Mt]), rt.useLayoutEffect(() => {
    var G;
    if (!A) return;
    const v = [...A.querySelectorAll("[data-item-id]")], S = ($, Y) => $.length === Y.length && $.every((st, wt) => st === Y[wt]), I = v.filter(($) => T.includes($.dataset.itemId ?? "")), B = v.filter(($) => !T.includes($.dataset.itemId ?? ""));
    V(($) => S($, I) ? $ : I), et(($) => S($, B) ? $ : B), (G = K.current) == null || G.setSelectedTargets(I);
  }, [A, T, qt, U == null ? void 0 : U.id]), rt.useEffect(() => {
    ts();
  }, [U == null ? void 0 : U.id]);
  const Fa = (v, S = !0) => {
    S && (kt.current = [
      Hn(t),
      ...kt.current
    ].slice(0, 30), Lt.current = []), e(v);
  }, _r = (v) => {
    const S = Hn(t);
    v(S), Fa(S);
  }, Rt = (v) => {
    _r((S) => {
      const I = S.sheets.find(({ id: B }) => B === S.activeSheetId);
      I && v(I);
    });
  }, La = rt.useRef(null), [Oc, Wa] = rt.useState(null), Mr = (v, S) => {
    let I = "";
    const B = La.current;
    La.current = null, Rt((G) => {
      I = crypto.randomUUID();
      const $ = Ss(G, S == null ? void 0 : S.width, S == null ? void 0 : S.height);
      B && ($.x = Math.max(0, Math.round(B.x)), $.y = Math.max(0, Math.round(B.y))), G.items.push({
        id: I,
        ...$,
        recipe: v
      });
    }), Pn(I), Xc(I);
  }, ne = It.find(({ id: v }) => v === mt) ?? It[0] ?? null, Ya = ne && c ? Tr(
    {
      hierarchyId: f.active_hierarchy_id,
      populationId: c
    },
    ne.tree,
    cr(f)
  ) : null, Je = (Ya == null ? void 0 : Ya.id) ?? (ne == null ? void 0 : ne.tree.root_population_id) ?? "", jn = (v) => {
    var S, I, B;
    if (!ne || !Je) {
      it(g("Check an FCS file and select a population first."));
      return;
    }
    Mr({
      kind: v,
      sampleId: ne.id,
      populationId: Je,
      ...ft.mode !== "off" ? { iterated: !0 } : {},
      xChannel: ne.sample.index(p) !== void 0 ? p : ((S = ne.sample.channels[0]) == null ? void 0 : S.key) ?? "",
      yChannel: v === "histogram" ? null : ne.sample.index(h) !== void 0 ? h : ((I = ne.sample.channels[1]) == null ? void 0 : I.key) ?? ((B = ne.sample.channels[0]) == null ? void 0 : B.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, Yo = () => {
    if (!ne || !Je) {
      it(g("Check an FCS file and select a population first."));
      return;
    }
    Mr(
      {
        kind: "chart",
        sampleId: ne.id,
        populationId: Je,
        statistic: "percent_of_parent",
        files: "checked",
        groupBy: o[0] ?? "",
        chartType: "bars",
        showPoints: !0,
        test: !0
      },
      { width: 320, height: 240 }
    );
  }, Xo = () => Mr({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), Nc = (v, S) => {
    Rt((I) => {
      const B = I.items.find((G) => G.id === v);
      B && (B.recipe = S(B.recipe));
    });
  }, zc = (v) => {
    v.preventDefault();
    const S = v.target.closest("[data-item-id]");
    if (S != null && S.dataset.itemId) {
      const $ = S.dataset.itemId, Y = U == null ? void 0 : U.items.find(({ id: Vt }) => Vt === Kr($));
      if (!Y) return;
      const st = T.includes($);
      st || Ke(Fo([$]));
      const wt = Y.group ? ((U == null ? void 0 : U.items) ?? []).filter((Vt) => Vt.group === Y.group).map(({ id: Vt }) => Vt) : [Y.id], lt = st && ie.length > 1 ? ie : wt, Dt = lt.length > 1, ee = oe(Y.recipe), Se = [
        { label: Dt ? g("Duplicate {n} items", { n: lt.length }) : g("Duplicate"), onClick: () => tn(lt) },
        { label: g("Bring to front"), onClick: () => Xe(lt, "front") },
        { label: g("Bring forward"), onClick: () => Xe(lt, "forward") },
        { label: g("Send backward"), onClick: () => Xe(lt, "backward") },
        { label: g("Send to back"), onClick: () => Xe(lt, "back") },
        { label: Y.locked ? g("Unlock") : g("Lock"), onClick: () => Bn(lt, !Y.locked) },
        ...st && Zr > 1 ? [{ label: g("Group"), onClick: An }] : [],
        ...Y.group ? [{ label: g("Ungroup"), onClick: () => Rt((Vt) => bs(Vt, lt)) }] : [],
        "separator",
        ...ft.mode !== "off" && ee ? [
          {
            label: "iterated" in Y.recipe && Y.recipe.iterated ? g("Stop following the iteration") : g("Follow the iteration"),
            onClick: () => Nc(Y.id, (Vt) => oe(Vt) ? { ...Vt, iterated: !Vt.iterated } : Vt)
          },
          "separator"
        ] : [],
        ...ee ? [{ label: g("Open in Gating"), onClick: () => D(Y.recipe) }] : [],
        ...Y.recipe.kind === "figure" && x ? [{ label: g("Edit in Illustration"), onClick: () => x(structuredClone(Y.recipe.illustration)) }] : [],
        ...Y.recipe.kind === "proportions" && E ? [{ label: g("Edit in Plotting"), onClick: () => E(structuredClone(Y.recipe.settings)) }] : [],
        { label: Dt ? g("Remove {n} items", { n: lt.length }) : g("Remove"), onClick: () => Qr(lt) }
      ];
      Wa({ x: v.clientX, y: v.clientY, items: Se, label: $e(Y, It) });
      return;
    }
    const I = v.currentTarget.getBoundingClientRect(), B = { x: (v.clientX - I.left) / gt, y: (v.clientY - I.top) / gt }, G = ($) => () => {
      La.current = B, $();
    };
    Wa({
      x: v.clientX,
      y: v.clientY,
      label: g("Page"),
      items: [
        { label: g("+ Biplot"), disabled: !Ft, onClick: G(() => jn("biplot")) },
        { label: g("+ Histogram"), disabled: !Ft, onClick: G(() => jn("histogram")) },
        { label: g("+ Gating strategy"), disabled: !Ft, onClick: G(qo) },
        { label: g("+ Chart"), disabled: !Ft, onClick: G(Yo) },
        { label: g("+ Text"), onClick: G(Xo) },
        { label: g("+ Illustration figure"), disabled: !Ft || !(m != null && m.figure), onClick: G(Ho) },
        { label: g("+ Plotting chart"), disabled: !Ft || !y, onClick: G($o) },
        "separator",
        // With a selection on the page, the menu on blank paper offers what the selection's own menu does for grouping, as Illustrator's does.
        ...Zr > 1 ? [{ label: g("Group"), onClick: An }] : [],
        ...de.some(($) => $.group) ? [{ label: g("Ungroup"), onClick: Ha }] : [],
        { label: g("Select all"), disabled: !qt.items.length, onClick: () => Ke(qt.items.filter(($) => !Nn.has($.templateId)).map(({ id: $ }) => $)) }
      ]
    });
  }, Ho = () => {
    if (!(m != null && m.figure)) {
      it(g("Make a figure on the Illustration tab first."));
      return;
    }
    U && Mr({ kind: "figure", illustration: structuredClone(m), page: 0 }, xf(m, r, f, U));
  }, $o = () => {
    if (!y || !U) return;
    const v = y(), S = yf(v, bf(r), f, Er, b);
    if (!S.catLevels.length || !S.perSample.length) {
      it(g("Choose files and populations on the Plotting tab first."));
      return;
    }
    Mr({ kind: "proportions", settings: v }, Sf(v, S, U));
  }, qo = () => {
    var I;
    if (!ne || !Je) {
      it(g("Check an FCS file and select a population first."));
      return;
    }
    const v = ne.tree.root_population_id ?? "", S = Je !== v ? Je : ((I = ua(ne.tree.populations, v).filter(({ popId: B }) => B !== v).at(-1)) == null ? void 0 : I.popId) ?? Je;
    Mr(
      {
        kind: "strategy",
        sampleId: ne.id,
        populationId: S,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...ft.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, jc = () => {
    var G, $;
    if (!m) {
      it(g("Render or configure an Illustration selection first."));
      return;
    }
    if (!m.figure && m.plotType === "heatmap") {
      it(
        g("Heatmap layout blocks are planned for the next Layout phase.")
      );
      return;
    }
    const v = new Map(It.map((Y) => [Y.id, Y])), S = [], I = m.figure;
    for (const Y of It) {
      if (I) {
        if (!I.sampleIds.includes(Y.id)) continue;
        for (const wt of I.plots)
          if (wt.type !== "heatmap")
            for (const lt of wt.population ? [wt.population] : ((G = I.samplePopulations) == null ? void 0 : G[Y.id]) ?? I.populations) {
              const Dt = Tr(
                lt,
                Y.tree,
                cr(f)
              );
              Dt.id && Dt.status !== "changed" && S.push({
                sampleId: Y.id,
                populationId: Dt.id,
                xChannel: wt.x,
                yChannel: wt.y,
                type: wt.type
              });
            }
        continue;
      }
      const st = m.selectionMode === "matrix" ? (($ = m.selectedPopulationsBySample) == null ? void 0 : $[Y.id]) ?? [] : m.popIds;
      for (const wt of st)
        for (const lt of m.xChannels)
          S.push({ sampleId: Y.id, populationId: wt, xChannel: lt });
    }
    const B = S.slice(0, 60);
    if (B.length === 0) {
      it(
        g("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    Rt((Y) => {
      for (const st of B) {
        if (!v.get(st.sampleId)) continue;
        const lt = st.type ?? (m.plotType === "histogram" ? "histogram" : "biplot");
        Y.items.push({
          id: crypto.randomUUID(),
          ...Ss(Y),
          recipe: {
            kind: lt,
            sampleId: st.sampleId,
            populationId: st.populationId,
            xChannel: st.xChannel,
            yChannel: lt === "histogram" ? null : st.yChannel ?? m.yChannel,
            displayMode: m.displayMode === "dots" ? "scatter" : m.displayMode
          }
        });
      }
    }), it(
      S.length > B.length ? g(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: B.length
        }
      ) : g("Added {count} Illustration plots.", { count: B.length })
    );
  }, Pt = (v) => {
    ot && Rt((S) => {
      const I = S.items.find(({ id: B }) => B === ot.id);
      I && (I.recipe = v(I.recipe));
    });
  }, Xa = (v) => Pt((S) => {
    if (S.kind !== "biplot" && S.kind !== "histogram") return S;
    const I = v ? r.filter(($) => v.includes($.id)).map(($) => $.id) : [];
    if (!I.length) {
      const { pool: $, ...Y } = S;
      return Y;
    }
    const B = I.includes(S.sampleId) ? S.sampleId : I[0];
    let G = S.populationId;
    if (B !== S.sampleId) {
      const $ = It.find(({ id: st }) => st === S.sampleId), Y = It.find(({ id: st }) => st === B);
      $ && Y && (G = Tr({ hierarchyId: $.tree.id, populationId: G }, Y.tree, Ze).id ?? Y.tree.root_population_id ?? G);
    }
    return { ...S, sampleId: B, populationId: G, pool: { sampleIds: I } };
  }), Ac = rt.useMemo(() => {
    var $;
    const v = ot == null ? void 0 : ot.recipe;
    if (!v || !oe(v) || v.kind === "strategy" || !v.pool) return null;
    const S = Ae != null && Ae.templateSampleId ? ($ = It.find(({ id: Y }) => Y === Ae.templateSampleId)) == null ? void 0 : $.tree.id : void 0, { members: I, leftOut: B } = Ki(v, It, Ze, S), G = v.kind === "biplot" && v.yChannel && I.length > 1 ? ff(Ze, I.map((Y) => Y.tree.id), v.xChannel, v.yChannel).omitted.map((Y) => Y.name) : [];
    return { pooled: I.length, total: v.pool.sampleIds.length, leftOut: B, omittedGates: G };
  }, [ot, Ae, It, Ze]), Qr = (v) => {
    Rt((S) => {
      S.items = S.items.filter((I) => !v.includes(I.id));
    }), k((S) => S.filter((I) => !v.includes(I)));
  }, tn = (v, S) => {
    const I = [];
    return Rt((B) => {
      let G = Math.max(0, ...B.items.map((Y) => Y.z));
      const $ = /* @__PURE__ */ new Map();
      for (const Y of v) {
        const st = B.items.find((ee) => ee.id === Y);
        if (!st) continue;
        const wt = crypto.randomUUID();
        I.push(wt);
        const lt = (S == null ? void 0 : S[Y]) ?? { x: st.x + 20, y: st.y + 20, width: st.width, height: st.height }, Dt = st.group ? $.get(st.group) ?? crypto.randomUUID() : void 0;
        st.group && Dt && $.set(st.group, Dt), B.items.push({ ...st, ...lt, id: wt, locked: !1, z: ++G, recipe: { ...st.recipe }, ...Dt ? { group: Dt } : {} });
      }
    }), I.length && Ke(I), I;
  }, Bc = (v, S, I) => {
    Rt((B) => {
      for (const G of B.items)
        !v.includes(G.id) || G.locked || (G.x += S, G.y += I);
    });
  }, Xe = (v, S) => {
    Rt((I) => {
      const B = [...I.items].sort((st, wt) => st.z - wt.z), G = B.filter((st) => v.includes(st.id)), $ = B.filter((st) => !v.includes(st.id));
      let Y;
      if (S === "front") Y = [...$, ...G];
      else if (S === "back") Y = [...G, ...$];
      else {
        Y = B;
        const st = Y.map((wt, lt) => lt);
        S === "forward" && st.reverse();
        for (const wt of st) {
          const lt = S === "forward" ? wt + 1 : wt - 1;
          !v.includes(Y[wt].id) || lt < 0 || lt >= Y.length || v.includes(Y[lt].id) || ([Y[wt], Y[lt]] = [Y[lt], Y[wt]]);
        }
      }
      Y.forEach((st, wt) => {
        st.z = wt;
      });
    });
  }, An = () => {
    Zr < 2 || Rt((v) => {
      zf(v, ie);
    });
  }, Ha = () => {
    de.some((v) => v.group) && Rt((v) => bs(v, ie));
  }, Bn = (v, S) => {
    Rt((I) => {
      for (const B of I.items) v.includes(B.id) && (B.locked = S);
    });
  }, Gc = (v) => {
    Rt((S) => jf(S, ie.filter((I) => {
      var B;
      return !((B = S.items.find((G) => G.id === I)) != null && B.locked);
    }), v));
  }, Fc = (v) => {
    Rt((S) => Af(S, ie.filter((I) => {
      var B;
      return !((B = S.items.find((G) => G.id === I)) != null && B.locked);
    }), v));
  }, Gn = (v, S) => {
    const I = {};
    for (const G of v) {
      const $ = G.dataset.itemId, Y = qt.items.find((lt) => lt.id === $);
      if (!Y) continue;
      const { id: st, ...wt } = rg(Y, Eg(G));
      I[st] = wt;
    }
    const B = Object.keys(I);
    if (B.length) {
      if (S) {
        for (const G of v) {
          const $ = qt.items.find((Y) => Y.id === G.dataset.itemId);
          $ && Object.assign(G.style, { left: `${$.x}px`, top: `${$.y}px`, width: `${$.width}px`, height: `${$.height}px` });
        }
        tn(B, I);
        return;
      }
      Rt((G) => {
        for (const $ of G.items) I[$.id] && Object.assign($, I[$.id]);
      });
    }
  }, Vo = (v) => v.flatMap((S) => {
    if (!(S instanceof HTMLElement) || !S.parentElement) return [];
    const I = S.cloneNode(!0);
    I.classList.add("gl-layout-ghost"), I.classList.remove("is-selected"), I.removeAttribute("data-item-id"), I.setAttribute("aria-hidden", "true");
    const B = S.querySelectorAll("canvas");
    return I.querySelectorAll("canvas").forEach((G, $) => {
      var st;
      const Y = B[$];
      Y && (G.width = Y.width, G.height = Y.height, (st = G.getContext("2d")) == null || st.drawImage(Y, 0, 0));
    }), S.parentElement.insertBefore(I, S), [I];
  }), Fn = (v) => {
    if (Array.isArray(v)) for (const S of v) S.remove();
  }, $a = (v) => {
    for (const S of v) {
      const I = qt.items.find((B) => B.id === S.dataset.itemId);
      I && Object.assign(S.style, { left: `${I.x}px`, top: `${I.y}px`, width: `${I.width}px`, height: `${I.height}px` });
    }
  }, Uo = rt.useRef($a);
  Uo.current = $a;
  const Qe = rt.useRef(null), Ln = (v, S) => {
    const I = { targets: v, ghosts: S, cancelled: !1 };
    Qe.current = I;
    const B = () => {
      window.removeEventListener("mouseup", B, !0), window.removeEventListener("touchend", B, !0), window.setTimeout(() => {
        Qe.current === I && (Qe.current = null, Fn(I.ghosts));
      }, 0);
    };
    window.addEventListener("mouseup", B, !0), window.addEventListener("touchend", B, !0);
  }, Wn = (v, S, I, B) => {
    const G = Qe.current;
    Qe.current = null, Fn(G == null ? void 0 : G.ghosts);
    const $ = S == null ? void 0 : S.dist, Y = !$ || Math.hypot($[0] ?? 0, $[1] ?? 0) >= 3;
    G != null && G.cancelled || !I || !Y ? $a(v) : B();
  }, Ko = (v) => {
    var G;
    v.target.style.left = `${v.left}px`, v.target.style.top = `${v.top}px`;
    const S = (G = v.datas) == null ? void 0 : G.companions;
    if (!(S != null && S.length)) return;
    const I = v.left - v.datas.startLeft, B = v.top - v.datas.startTop;
    for (const { el: $, left: Y, top: st } of S)
      $.style.left = `${Y + I}px`, $.style.top = `${st + B}px`;
  }, Zo = (v) => {
    var I;
    const S = (I = v.datas) == null ? void 0 : I.companions;
    return [v.target, ...(S ?? []).map(({ el: B }) => B)];
  }, Lc = (v) => {
    var G;
    v.datas.alt = !!((G = v.inputEvent) != null && G.altKey);
    const S = v.target, I = Jr ? Wo.current.filter(($) => $ !== S) : [];
    v.datas.startLeft = parseFloat(S.style.left) || 0, v.datas.startTop = parseFloat(S.style.top) || 0, v.datas.companions = I.map(($) => ({ el: $, left: parseFloat($.style.left) || 0, top: parseFloat($.style.top) || 0 }));
    const B = Zo(v);
    Ln(B, v.datas.alt ? Vo(B) : void 0);
  }, Jo = (v) => {
    v.target.style.width = `${v.width}px`, v.target.style.height = `${v.height}px`, v.target.style.left = `${v.drag.left}px`, v.target.style.top = `${v.drag.top}px`;
  }, Wc = (v) => {
    var B;
    const S = (B = v.inputEvent) == null ? void 0 : B.target;
    if (!S) return;
    const I = tt.current;
    if (I != null && I.isMoveableElement(S)) {
      v.stop();
      return;
    }
    if (Ye.some((G) => G === S || G.contains(S)) && (v.stop(), Ye.length > 1 && !Jr)) {
      I == null || I.dragStart(v.inputEvent);
      const G = v.inputEvent, $ = (Y) => {
        var st;
        window.removeEventListener("mouseup", $), Math.hypot(Y.clientX - G.clientX, Y.clientY - G.clientY) < 4 && ((st = K.current) == null || st.clickTarget(G, S));
      };
      window.addEventListener("mouseup", $);
    }
  }, Yc = (v) => {
    var G, $, Y;
    const S = v.isClick || v.isDragStart, I = new Set((v.removed ?? []).map((st) => On(st.dataset.itemId ?? "")).filter(Boolean)), B = Fo(
      v.selected.map((st) => st.dataset.itemId ?? "").filter((st) => st && (S || !Nn.has(Kr(st))))
    ).filter((st) => !I.has(On(st)));
    if (Ke(B), v.isDragStart && !v.isClick) {
      if (!B.filter((lt) => !Nn.has(Kr(lt)) && lt !== z).length) return;
      ($ = (G = v.inputEvent) == null ? void 0 : G.preventDefault) == null || $.call(G), zn.current = !0;
      const wt = () => {
        zn.current = !1;
      };
      window.setTimeout(() => window.addEventListener("mousedown", wt, { capture: !0, once: !0 }), 0), (Y = tt.current) == null || Y.waitToChangeTarget().then(() => {
        var lt;
        return (lt = tt.current) == null ? void 0 : lt.dragStart(v.inputEvent);
      });
    }
  }, Xc = (v) => {
    window.requestAnimationFrame(() => {
      var S, I, B;
      (B = (I = (S = lr.current) == null ? void 0 : S.querySelector(`[data-item-id="${v}"]`)) == null ? void 0 : I.scrollIntoView) == null || B.call(I, { block: "nearest", inline: "nearest" });
    });
  }, ur = (v) => {
    Rt((S) => Df(S, v));
  }, Hc = () => Rt((v) => _f(v)), $c = () => Rt((v) => Mf(v)), Qo = (() => {
    const v = [], S = [];
    if (!U) return { vertical: v, horizontal: S };
    const I = mi(U.page), B = vs(U.page.marginMm);
    for (const G of da(U.page))
      v.push(G.x, G.x + B, G.x + I.width / 2, G.x + I.width - B, G.x + I.width), S.push(G.y, G.y + B, G.y + I.height / 2, G.y + I.height - B, G.y + I.height);
    return { vertical: [...new Set(v)], horizontal: [...new Set(S)] };
  })(), ts = () => {
    const v = We.current;
    if (!v || !U) return;
    const S = { width: v.clientWidth - 36, height: v.clientHeight - 36 };
    if (S.width <= 0 || S.height <= 0) return;
    const I = Math.min(S.width / U.width, S.height / U.height);
    _t(Math.max(0.1, Math.min(4, Math.floor(I * 100) / 100)));
  };
  rt.useEffect(() => {
    const v = X;
    if (!v) return;
    const S = (I) => {
      if (!(I.altKey || I.shiftKey || I.ctrlKey)) return;
      const B = I.deltaY || I.deltaX;
      if (!B) return;
      I.preventDefault();
      const G = St.current, $ = Math.max(0.1, Math.min(4, Math.round(G * Math.exp(-B * 25e-4) * 100) / 100));
      if ($ === G) return;
      St.current = $, _t($);
      const Y = v.getBoundingClientRect(), st = I.clientX - Y.left, wt = I.clientY - Y.top, lt = $ / G, Dt = (v.scrollLeft + st) * lt - st, ee = (v.scrollTop + wt) * lt - wt;
      requestAnimationFrame(() => {
        v.scrollLeft = Dt, v.scrollTop = ee;
      });
    };
    return v.addEventListener("wheel", S, { passive: !1 }), () => v.removeEventListener("wheel", S);
  }, [X]);
  const es = (v) => {
    const S = v > 0 ? rn.find((I) => I > gt + 1e-3) : [...rn].reverse().find((I) => I < gt - 1e-3);
    S && _t(S);
  }, qc = () => new Promise((v) => {
    window.setTimeout(() => window.requestAnimationFrame(() => window.requestAnimationFrame(() => v())), 450);
  }), rs = async () => {
    const v = lr.current;
    if (!v || !U || Ue) return;
    Rn(!0);
    const S = je;
    try {
      const I = [];
      for (let B = 0; B < ge.length; B++)
        ge.length > 1 && (Dr(B), await qc()), I.push(...Yh(v, U, { zoom: gt, crop: jt ? { paddingMm: Te } : void 0 }));
      await Xh(I, U, $t), M == null || M();
    } catch (I) {
      it(I instanceof Error ? I.message : String(I));
    } finally {
      ge.length > 1 && Dr(S), Rn(!1);
    }
  }, He = (v) => {
    Rt((S) => {
      var I;
      if (v.mode === "off") {
        delete S.iteration;
        return;
      }
      if ((((I = S.iteration) == null ? void 0 : I.mode) ?? "off") === "off" && !S.items.some(Ec))
        for (const B of S.items) oe(B.recipe) && (B.recipe.iterated = !0);
      S.iteration = v;
    }), Dr(0);
  }, Vc = (v) => [...new Set(r.map((S) => {
    var I;
    return ((I = S.metadata) == null ? void 0 : I[v]) ?? "";
  }).filter(Boolean))], Uc = ft.source.kind === "group" ? `group:${ft.source.groupId}` : ft.source.kind === "metadata" ? `meta:${ft.source.column}=${ft.source.value}` : ft.source.kind, Kc = (v) => {
    if (v === "all") return { kind: "all" };
    if (v.startsWith("group:")) return { kind: "group", groupId: v.slice(6) };
    if (v.startsWith("meta:")) {
      const [S, ...I] = v.slice(5).split("=");
      return { kind: "metadata", column: S, value: I.join("=") };
    }
    return { kind: "checked" };
  }, Zc = (v) => {
    const S = ms(v.nativeEvent);
    if (S) {
      v.preventDefault(), S === "undo" ? Yn() : Xn();
      return;
    }
    if (v.target.closest("input, textarea, select")) return;
    const I = v.metaKey || v.ctrlKey;
    if (v.key === "Escape") {
      k([]);
      return;
    }
    if (I && v.key.toLowerCase() === "a") {
      v.preventDefault(), Ke(((U == null ? void 0 : U.items) ?? []).filter((Y) => !Y.locked).map((Y) => Y.id));
      return;
    }
    if (!T.length) return;
    if (v.key === "Enter" && T.length === 1) {
      const Y = qt.items.find((st) => st.id === T[0]);
      if ((Y == null ? void 0 : Y.recipe.kind) === "text") {
        v.preventDefault(), O(Y.id);
        return;
      }
    }
    if (v.key === "Delete" || v.key === "Backspace") {
      v.preventDefault(), Qr(ie);
      return;
    }
    if (I && v.key.toLowerCase() === "d") {
      v.preventDefault(), tn(ie);
      return;
    }
    if (I && (v.key === "]" || v.key === "[")) {
      v.preventDefault(), Xe(ie, v.key === "]" ? v.shiftKey ? "front" : "forward" : v.shiftKey ? "back" : "backward");
      return;
    }
    if (I && v.key.toLowerCase() === "g") {
      v.preventDefault(), v.shiftKey ? Ha() : An();
      return;
    }
    if (I && v.shiftKey && v.key.toLowerCase() === "l") {
      v.preventDefault(), Bn(ie, !Ga);
      return;
    }
    const B = v.shiftKey ? 10 : 1, $ = {
      ArrowLeft: [-B, 0],
      ArrowRight: [B, 0],
      ArrowUp: [0, -B],
      ArrowDown: [0, B]
    }[v.key];
    $ && (v.preventDefault(), Bc(ie, $[0], $[1]));
  }, qa = ot == null ? void 0 : ot.recipe, At = qa && "sampleId" in qa ? It.find(({ id: v }) => v === qa.sampleId) ?? null : null, ns = At ? At.sample.channels.map((v) => ({
    value: v.key,
    label: At.sample.channelLabel(At.sample.index(v.key) ?? 0)
  })) : [], as = At ? ua(
    At.tree.populations,
    At.tree.root_population_id ?? ""
  ) : [], Yn = () => {
    const v = kt.current.shift();
    v && (Lt.current = [
      Hn(t),
      ...Lt.current
    ].slice(0, 30), Fa(v, !1));
  }, Xn = () => {
    const v = Lt.current.shift();
    v && (kt.current = [
      Hn(t),
      ...kt.current
    ].slice(0, 30), Fa(v, !1));
  }, Va = rt.useRef({ undo: Yn, redo: Xn });
  return Va.current = { undo: Yn, redo: Xn }, rt.useEffect(() => {
    const v = (I) => {
      var G, $;
      if (I.key === "Escape" && Qe.current) {
        const Y = Qe.current;
        Y.cancelled = !0, I.preventDefault(), I.stopPropagation(), Uo.current(Y.targets), Fn(Y.ghosts), Y.ghosts = void 0, Cg(tt.current);
        return;
      }
      const B = ms(I);
      B && (($ = (G = I.target) == null ? void 0 : G.closest) != null && $.call(G, "input, textarea, select, [contenteditable='true']") || (I.preventDefault(), I.stopPropagation(), B === "undo" ? Va.current.undo() : Va.current.redo()));
    }, S = () => {
      const I = Qe.current;
      I && (Fn(I.ghosts), I.ghosts = void 0);
    };
    return window.addEventListener("keydown", v, !0), window.addEventListener("blur", S), () => {
      window.removeEventListener("keydown", v, !0), window.removeEventListener("blur", S);
    };
  }, []), U ? /* @__PURE__ */ C.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${Ct ? " is-preview" : ""}`,
      children: [
        /* @__PURE__ */ C.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": g("Layout sheets"),
            children: [
              t.sheets.map((v) => /* @__PURE__ */ C.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: nt === v.id ? /* @__PURE__ */ C.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: v.name,
                  autoFocus: !0,
                  onFocus: (S) => S.currentTarget.select(),
                  onBlur: (S) => {
                    const I = S.currentTarget.value.trim();
                    I && _r((B) => {
                      const G = B.sheets.find(
                        ({ id: $ }) => $ === v.id
                      );
                      G && (G.name = I);
                    }), Q(null);
                  },
                  onKeyDown: (S) => {
                    S.key === "Enter" && S.currentTarget.blur(), S.key === "Escape" && Q(null);
                  }
                }
              ) : /* @__PURE__ */ C.jsx(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": t.activeSheetId === v.id,
                  className: `gl-layout-sheet-tab${t.activeSheetId === v.id ? " active" : ""}`,
                  title: g("Double-click to rename"),
                  onClick: () => _r((S) => {
                    S.activeSheetId = v.id;
                  }),
                  onDoubleClick: () => Q(v.id),
                  children: v.name
                }
              ) }, v.id)),
              /* @__PURE__ */ C.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-layout-sheet-add",
                  title: g("New blank layout"),
                  onClick: () => {
                    const v = df(
                      `Layout ${t.sheets.length + 1}`,
                      { ...U.page }
                    );
                    _r((S) => {
                      S.sheets.push(v), S.activeSheetId = v.id;
                    }), k([]);
                  },
                  children: "+"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ C.jsxs(
          "div",
          {
            className: "gl-layout-toolbar",
            onMouseDown: (v) => {
              v.target.closest("button") && v.preventDefault();
            },
            children: [
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => jn("biplot"), disabled: !Ft, title: g(Ft ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: g("+ Biplot") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => jn("histogram"), disabled: !Ft, title: g(Ft ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: g("+ Histogram") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: qo, disabled: !Ft, title: g(Ft ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: g("+ Gating strategy") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Yo, disabled: !Ft, title: g(Ft ? "Add a summary chart: one statistic of a population per file, grouped by a metadata column, with a test between the groups" : "Preparing the files…"), children: g("+ Chart") }),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: g("Add a text block; edit it on the page"),
                    onClick: Xo,
                    children: g("+ Text")
                  }
                ),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: jc, disabled: !Ft, title: g("Add one plot per file and plot of the Illustration tab's current selection"), children: g("Add Illustration selection") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Ho, disabled: !Ft, title: g("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: g("+ Illustration figure") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: $o, disabled: !Ft || !y, title: g("Add the Plotting tab's current chart as one block, drawn here as it is there"), children: g("+ Plotting chart") })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": g("Arrange"), children: [
                bg.map(({ how: v, label: S, title: I }) => /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Gc(v), disabled: !T.length || Ct, title: g(I), children: g(S) }, v)),
                Sg.map(({ how: v, label: S, title: I }) => /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Fc(v), disabled: Zr < 3 || Ct, title: g(I), children: g(S) }, v)),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": R, onClick: () => j((v) => !v), title: g("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: g("Snap grid") })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": Ct, onClick: () => pt(!Ct), title: g("Show the page as it exports, without grid, margins or handles"), children: g(Ct ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !kt.current.length, onClick: Yn, title: g("Undo the last layout edit (Cmd-Z)"), children: g("Undo") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Lt.current.length, onClick: Xn, title: g("Redo the undone edit (Shift-Cmd-Z)"), children: g("Redo") }),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: g("Copy this sheet, with its page and items, as a new sheet"),
                    onClick: () => {
                      const v = {
                        ...U,
                        id: crypto.randomUUID(),
                        page: { ...U.page },
                        name: `${U.name} copy`,
                        items: U.items.map((S) => ({
                          ...S,
                          id: crypto.randomUUID(),
                          recipe: { ...S.recipe }
                        }))
                      };
                      _r((S) => {
                        S.sheets.push(v), S.activeSheetId = v.id;
                      }), k([]);
                    },
                    children: g("Duplicate sheet")
                  }
                ),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    disabled: t.sheets.length <= 1,
                    title: g("Remove this sheet; the layout keeps at least one"),
                    onClick: () => {
                      _r((v) => {
                        const S = v.sheets.findIndex(
                          ({ id: I }) => I === v.activeSheetId
                        );
                        v.sheets.splice(S, 1), v.activeSheetId = v.sheets[Math.max(0, S - 1)].id;
                      }), k([]);
                    },
                    children: g("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": g("Zoom"), children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: ts, title: g("Fit the page to the window"), children: g("Fit") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => es(-1), "aria-label": g("Zoom out"), title: g("Zoom out"), disabled: gt <= rn[0], children: "−" }),
                /* @__PURE__ */ C.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(gt * 100),
                  "%"
                ] }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => es(1), "aria-label": g("Zoom in"), title: g("Zoom in"), disabled: gt >= rn[rn.length - 1], children: "+" })
              ] }),
              (ge.length > 1 || ft.mode !== "off") && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": g("Pages of the iteration"), children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Dr(Math.max(0, je - 1)), disabled: je === 0, "aria-label": g("Previous page"), title: g("Previous page"), children: "◀" }),
                /* @__PURE__ */ C.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  g("Page {n} of {count}", { n: je + 1, count: Math.max(1, ge.length) }),
                  qt.units.length > 0 && ` · ${qt.units.map((v) => v.name).join(", ")}`
                ] }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Dr(Math.min(ge.length - 1, je + 1)), disabled: je >= ge.length - 1, "aria-label": g("Next page"), title: g("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ C.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void rs(), disabled: Ue || !U.items.length, title: ge.length > 1 ? g("Write every page of the iteration; the format is chosen under Page") : g("Write this sheet at its page size; the format is chosen under Page"), children: Ue ? g("Exporting…") : g("Export {format}", { format: $t.toUpperCase() }) }) }),
              /* @__PURE__ */ C.jsx("span", { className: "gl-layout-performance-note", children: g("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        at && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ C.jsx("span", { children: at }),
          /* @__PURE__ */ C.jsx("button", { type: "button", title: g("Dismiss"), "aria-label": g("Dismiss"), onClick: () => it(null), children: "×" })
        ] }),
        /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ C.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ C.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style"].map((v) => /* @__PURE__ */ C.jsx(
              "button",
              {
                "aria-pressed": Z === v,
                title: g(v === "item" ? "The selected item, or the file new plots take" : v === "page" ? "Page size, margins, pages and export" : v === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => ut(v),
                children: g(v === "item" ? "Items" : v === "page" ? "Page" : v === "iterate" ? "Iterate" : "Style")
              },
              v
            )) }),
            Z === "item" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                "File for new plots",
                /* @__PURE__ */ C.jsx(
                  "select",
                  {
                    value: mt,
                    onChange: (v) => yt(v.target.value),
                    children: r.map((v) => /* @__PURE__ */ C.jsx("option", { value: v.id, children: v.name }, v.id))
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: "Placed plots keep their own file and hierarchy, independently of the Gating selection." }),
              he.error && /* @__PURE__ */ C.jsx("p", { role: "alert", children: he.error }),
              de.length > 1 && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-inspector", "aria-label": g("Selected layout items"), children: [
                /* @__PURE__ */ C.jsx("strong", { children: Rc ? g("{count} items selected, one group", { count: de.length }) : g("{count} items selected", { count: de.length }) }),
                /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                  Zr > 1 && /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: An, title: g("One group: selected, moved, aligned and distributed together (Cmd-G)"), children: g("Group") }),
                  de.some((v) => v.group) && /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Ha, title: g("Dissolve the group; the items stay where they are (Shift-Cmd-G)"), children: g("Ungroup") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => tn(ie), title: g("Copies of every selected item, 20 px down and right (Cmd-D)"), children: g("Duplicate") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Xe(ie, "front"), title: g("Draw the selected items over every other"), children: g("Bring to front") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Xe(ie, "back"), title: g("Draw the selected items under every other"), children: g("Send to back") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Bn(ie, !Ga), title: g("Lock or unlock the selected items"), children: g(Ga ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Qr(ie), title: g("Remove the selected items (Delete)"), children: g("Remove") })
                ] }),
                /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("Align and distribute them with the toolbar; drag any of them to move them together; Cmd-G makes them one group.") })
              ] }),
              !de.length && /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("Click an item to select it, drag empty page to select several, Shift-click to add or remove. Drag to move, Shift holds the direction; drag a corner handle or an edge to resize, Shift keeps the proportions, Option resizes from the centre; Cmd turns snapping off; Option-drag copies. Delete removes, arrows nudge (Shift: 10 px), Cmd-D duplicates, Cmd-A selects all, Cmd-] and Cmd-[ bring forward and send backward (Shift: to the front or back), Cmd-G groups and Shift-Cmd-G ungroups, Shift-Cmd-L locks, Cmd-Z undoes.") }),
              ot && /* @__PURE__ */ C.jsxs(
                "div",
                {
                  className: "gl-layout-inspector",
                  "aria-label": g("Selected layout item"),
                  children: [
                    /* @__PURE__ */ C.jsx("strong", { children: g("Selected") }),
                    /* @__PURE__ */ C.jsxs("label", { className: "gl-check", children: [
                      /* @__PURE__ */ C.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: ot.showFrame === !0,
                          onChange: (v) => Rt((S) => {
                            const I = S.items.find(
                              (B) => B.id === ot.id
                            );
                            I && (I.showFrame = v.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => tn([ot.id]), title: g("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: g("Duplicate") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Xe([ot.id], "front"), title: g("Draw this item over every other"), children: g("Bring to front") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Xe([ot.id], "back"), title: g("Draw this item under every other"), children: g("Send to back") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Qr([ot.id]), title: g("Remove this item from the page (Delete)"), children: g("Remove") })
                    ] }),
                    /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: g("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ C.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: ot.locked === !0,
                          onChange: (v) => Bn([ot.id], v.target.checked)
                        }
                      ),
                      g("Locked")
                    ] }),
                    /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["x", "y", "width", "height"].map((v) => /* @__PURE__ */ C.jsxs("label", { children: [
                      mg[v],
                      /* @__PURE__ */ C.jsx(
                        Ee,
                        {
                          "aria-label": `Item ${v}`,
                          min: v === "width" || v === "height" ? pf(ot.recipe.kind)[v] : 0,
                          integer: !0,
                          value: ot[v],
                          onCommit: (S) => Rt((I) => {
                            const B = I.items.find(
                              (G) => G.id === ot.id
                            );
                            B && (B[v] = S);
                          })
                        }
                      )
                    ] }, v)) }),
                    ot.recipe.kind === "text" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Text"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            value: ot.recipe.text,
                            onChange: (v) => Pt(
                              (S) => S.kind === "text" ? { ...S, text: v.target.value } : S
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Reads from"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            "aria-label": g("Reads from"),
                            value: ot.recipe.readsFrom ?? "",
                            onChange: (v) => Pt((S) => {
                              if (S.kind !== "text") return S;
                              const I = { ...S };
                              return v.target.value ? I.readsFrom = v.target.value : delete I.readsFrom, I;
                            }),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: g("Nothing: plain text") }),
                              U.items.filter((v) => oe(v.recipe)).map((v) => /* @__PURE__ */ C.jsx("option", { value: v.id, children: $e(v, It) }, v.id))
                            ]
                          }
                        )
                      ] }),
                      ot.recipe.readsFrom && /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: fi }) }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Font"),
                        /* @__PURE__ */ C.jsx(
                          Ee,
                          {
                            min: 8,
                            max: 72,
                            integer: !0,
                            value: ot.recipe.fontSize,
                            onCommit: (v) => Pt(
                              (S) => S.kind === "text" ? { ...S, fontSize: v } : S
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ot.recipe.bold === !0,
                            onChange: (v) => Pt((S) => {
                              if (S.kind !== "text") return S;
                              const I = { ...S };
                              return v.target.checked ? I.bold = !0 : delete I.bold, I;
                            })
                          }
                        ),
                        g("Bold")
                      ] })
                    ] }) : ot.recipe.kind === "figure" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Figure page"),
                        /* @__PURE__ */ C.jsx(
                          Ee,
                          {
                            "aria-label": g("Figure page"),
                            value: ot.recipe.page + 1,
                            min: 1,
                            integer: !0,
                            onCommit: (v) => Pt((S) => S.kind === "figure" ? { ...S, page: Math.max(0, v - 1) } : S)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        g("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: $e(ot, It),
                            value: ot.recipe.title ?? "",
                            onChange: (v) => Pt((S) => S.kind === "figure" ? { ...S, title: v.target.value } : S)
                          }
                        )
                      ] }),
                      x && /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: g("Load this figure into the Illustration tab"),
                          onClick: () => x(structuredClone(ot.recipe.illustration)),
                          children: g("Edit in Illustration")
                        }
                      ),
                      /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !(m != null && m.figure),
                          title: g("Take the Illustration tab's current figure in place of this one"),
                          onClick: () => Pt(
                            (v) => v.kind === "figure" && m ? { ...v, illustration: structuredClone(m) } : v
                          ),
                          children: g("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : ot.recipe.kind === "proportions" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        g("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: $e(ot, It),
                            value: ot.recipe.title ?? "",
                            onChange: (v) => Pt((S) => S.kind === "proportions" ? { ...S, title: v.target.value } : S)
                          }
                        )
                      ] }),
                      E && /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: g("Load this chart's settings into the Plotting tab"),
                          onClick: () => E(structuredClone(ot.recipe.settings)),
                          children: g("Edit in Plotting")
                        }
                      ),
                      /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !y,
                          title: g("Take the Plotting tab's current chart in place of this one"),
                          onClick: () => {
                            const v = y == null ? void 0 : y();
                            v && Pt((S) => S.kind === "proportions" ? { ...S, settings: v } : S);
                          },
                          children: g("Replace with the current Plotting chart")
                        }
                      )
                    ] }) : ot.recipe.kind === "chart" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Population"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: ot.recipe.populationId,
                            onChange: (v) => Pt((S) => S.kind === "chart" ? { ...S, populationId: v.target.value } : S),
                            children: as.map(({ popId: v, depth: S }) => {
                              var I;
                              return /* @__PURE__ */ C.jsxs("option", { value: v, children: [
                                " ".repeat(S * 2),
                                ((I = At == null ? void 0 : At.tree.populations[v]) == null ? void 0 : I.name) ?? v
                              ] }, v);
                            })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Statistic"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: ot.recipe.statistic,
                            onChange: (v) => Pt((S) => {
                              var G;
                              if (S.kind !== "chart") return S;
                              const I = v.target.value, B = I === "median" && !S.channel ? (G = At == null ? void 0 : At.sample.channels[0]) == null ? void 0 : G.key : S.channel;
                              return { ...S, statistic: I, ...B ? { channel: B } : {} };
                            }),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "percent_of_parent", children: g("% of parent") }),
                              /* @__PURE__ */ C.jsx("option", { value: "percent_of_total", children: g("% of total") }),
                              /* @__PURE__ */ C.jsx("option", { value: "count", children: g("Events") }),
                              /* @__PURE__ */ C.jsx("option", { value: "median", children: g("Median of a channel") })
                            ]
                          }
                        )
                      ] }),
                      ot.recipe.statistic === "median" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Channel"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: ot.recipe.channel ?? "",
                            onChange: (v) => Pt((S) => S.kind === "chart" ? { ...S, channel: v.target.value } : S),
                            children: ((At == null ? void 0 : At.sample.channels) ?? []).map((v) => /* @__PURE__ */ C.jsx("option", { value: v.key, children: (At == null ? void 0 : At.sample.labelForKey(v.key)) ?? v.key }, v.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Files"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: ot.recipe.files,
                            onChange: (v) => Pt((S) => S.kind === "chart" ? { ...S, files: v.target.value === "all" ? "all" : "checked" } : S),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "checked", children: g("Checked files") }),
                              /* @__PURE__ */ C.jsx("option", { value: "all", children: g("All files") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Group by"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: ot.recipe.groupBy,
                            onChange: (v) => Pt((S) => S.kind === "chart" ? { ...S, groupBy: v.target.value } : S),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: g("Each file") }),
                              o.map((v) => /* @__PURE__ */ C.jsx("option", { value: v, children: v }, v))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Chart"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: ot.recipe.chartType,
                            onChange: (v) => Pt((S) => S.kind === "chart" ? { ...S, chartType: v.target.value } : S),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "bars", children: g("Bars (mean ± SD)") }),
                              /* @__PURE__ */ C.jsx("option", { value: "dots", children: g("Points with the mean") }),
                              /* @__PURE__ */ C.jsx("option", { value: "box", children: g("Boxes (median, quartiles)") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ot.recipe.showPoints,
                            onChange: (v) => Pt((S) => S.kind === "chart" ? { ...S, showPoints: v.target.checked } : S)
                          }
                        ),
                        g("Show each file as a point")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: g("Wilcoxon rank-sum between two groups, Kruskal–Wallis among more; every group needs two files"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ot.recipe.test,
                            onChange: (v) => Pt((S) => S.kind === "chart" ? { ...S, test: v.target.checked } : S)
                          }
                        ),
                        g("Test between groups")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        g("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: $e(ot, It),
                            value: ot.recipe.title ?? "",
                            onChange: (v) => Pt((S) => S.kind === "chart" ? { ...S, title: v.target.value } : S)
                          }
                        )
                      ] })
                    ] }) : /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      !hn(ot.recipe) && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("FCS"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: ot.recipe.sampleId,
                            onChange: (v) => Pt((S) => {
                              if (S.kind === "text" || S.kind === "figure" || S.kind === "proportions") return S;
                              const I = It.find(
                                (G) => G.id === v.target.value
                              );
                              if (!I) return S;
                              const B = At && Tr(
                                {
                                  hierarchyId: At.tree.id,
                                  populationId: S.populationId
                                },
                                I.tree,
                                cr(f)
                              );
                              return {
                                ...S,
                                sampleId: I.id,
                                populationId: (B == null ? void 0 : B.id) ?? I.tree.root_population_id ?? ""
                              };
                            }),
                            children: It.map((v) => /* @__PURE__ */ C.jsx("option", { value: v.id, children: v.name }, v.id))
                          }
                        )
                      ] }),
                      (ot.recipe.kind === "biplot" || ot.recipe.kind === "histogram") && /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: g("Draw the events of several files on this plot, as the Gating tab pools the checked files; a gate is drawn where every pooled file has it alike, with the pooled percentage"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: !!ot.recipe.pool,
                            onChange: (v) => {
                              if (!v.target.checked) {
                                Xa(null);
                                return;
                              }
                              const S = ot.recipe.kind === "biplot" || ot.recipe.kind === "histogram" ? ot.recipe.sampleId : "";
                              Xa(n.includes(S) ? n : [S]);
                            }
                          }
                        ),
                        g("Pool files")
                      ] }),
                      (ot.recipe.kind === "biplot" || ot.recipe.kind === "histogram") && ot.recipe.pool && /* @__PURE__ */ C.jsx(
                        Dg,
                        {
                          files: r,
                          pool: ot.recipe.pool.sampleIds,
                          checkedSampleIds: n,
                          groups: a,
                          fileGroups: i,
                          report: Ac,
                          onChange: Xa
                        }
                      ),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Population"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: ot.recipe.populationId,
                            onChange: (v) => Pt(
                              (S) => S.kind === "text" ? S : {
                                ...S,
                                populationId: v.target.value
                              }
                            ),
                            children: as.map(({ popId: v, depth: S }) => {
                              var I;
                              return /* @__PURE__ */ C.jsxs("option", { value: v, children: [
                                " ".repeat(S * 2),
                                ((I = At == null ? void 0 : At.tree.populations[v]) == null ? void 0 : I.name) ?? v
                              ] }, v);
                            })
                          }
                        )
                      ] }),
                      ot.recipe.kind !== "strategy" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                        /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ C.jsx(
                            hs,
                            {
                              label: g("X channel"),
                              value: ot.recipe.xChannel,
                              options: ns,
                              onChange: (v) => Pt(
                                (S) => S.kind === "biplot" || S.kind === "histogram" ? { ...S, xChannel: v } : S
                              )
                            }
                          )
                        ] }),
                        ot.recipe.kind === "biplot" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ C.jsx(
                            hs,
                            {
                              label: g("Y channel"),
                              value: ot.recipe.yChannel ?? "",
                              options: ns,
                              onChange: (v) => Pt(
                                (S) => S.kind === "biplot" ? { ...S, yChannel: v } : S
                              )
                            }
                          )
                        ] })
                      ] }),
                      ot.recipe.kind === "strategy" && /* @__PURE__ */ C.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ot.recipe.fullPath,
                            onChange: (v) => Pt(
                              (S) => S.kind === "strategy" ? {
                                ...S,
                                fullPath: v.target.checked
                              } : S
                            )
                          }
                        ),
                        g("Full path from root")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Display"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: ot.recipe.displayMode,
                            onChange: (v) => Pt(
                              (S) => S.kind === "text" ? S : {
                                ...S,
                                displayMode: v.target.value
                              }
                            ),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "pseudocolor", children: g("Pseudocolor") }),
                              /* @__PURE__ */ C.jsx("option", { value: "scatter", children: g("Scatter") }),
                              /* @__PURE__ */ C.jsx("option", { value: "contour", children: g("Contour") })
                            ]
                          }
                        )
                      ] }),
                      ft.mode !== "off" && /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: ft.mode === "populations" ? g("Drawn once per population of the iteration, for that population; unticked, it shows its own population on every page") : ft.mode === "metadata" ? g("Drawn once per value of {column}, pooling that value's files; unticked, it shows its own files on every page", { column: ft.column ?? "" }) : g("Drawn once per file of the iteration, for that file; unticked, it shows this file on every page"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ot.recipe.iterated === !0,
                            onChange: (v) => Pt(
                              (S) => S.kind === "text" ? S : { ...S, iterated: v.target.checked }
                            )
                          }
                        ),
                        g("Follows the iteration")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: g("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: fi }), children: [
                        g("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: Pc || $e(ot, It),
                            value: ot.recipe.title ?? "",
                            onChange: (v) => Pt(
                              (S) => S.kind === "text" ? S : { ...S, title: v.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ C.jsxs("summary", { children: [
                          g("Style"),
                          Object.keys(ot.recipe.style ?? {}).length > 0 ? ` · ${g("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ C.jsx(
                          _l,
                          {
                            effective: Ka(U, ot.recipe),
                            own: ot.recipe.style ?? {},
                            onChange: (v) => Pt(
                              (S) => oe(S) ? { ...S, style: Es({ ...S.style, ...v }) } : S
                            )
                          }
                        ),
                        Object.keys(ot.recipe.style ?? {}).length > 0 && /* @__PURE__ */ C.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: g("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => Pt((v) => {
                              if (!oe(v)) return v;
                              const { style: S, ...I } = v;
                              return I;
                            }),
                            children: g("Follow the sheet")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => D(
                            ot.recipe
                          ),
                          children: g("Open in Gating")
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            Z === "page" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: g("Page") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Size"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    value: U.page.preset,
                    onChange: (v) => ur(hf(v.target.value, U.page.orientation, U.page)),
                    children: [
                      Object.entries(vf).map(([v, S]) => /* @__PURE__ */ C.jsx("option", { value: v, children: S.label }, v)),
                      /* @__PURE__ */ C.jsx("option", { value: "custom", children: g("Custom") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Orientation"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    value: U.page.orientation,
                    onChange: (v) => ur({ ...U.page, orientation: v.target.value }),
                    children: [
                      /* @__PURE__ */ C.jsx("option", { value: "portrait", children: g("Portrait") }),
                      /* @__PURE__ */ C.jsx("option", { value: "landscape", children: g("Landscape") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["width", "height"].map((v) => /* @__PURE__ */ C.jsxs("label", { children: [
                g(v === "width" ? "Width (mm)" : "Height (mm)"),
                /* @__PURE__ */ C.jsx(
                  Ee,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": g(v === "width" ? "Width (mm)" : "Height (mm)"),
                    value: Ml(U.page)[v === "width" ? "widthMm" : "heightMm"],
                    onCommit: (S) => {
                      const I = U.page.orientation === "landscape", B = v === "width" == !I ? "widthMm" : "heightMm";
                      ur({ ...U.page, preset: "custom", [B]: S });
                    }
                  }
                )
              ] }, v)) }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Margin (mm)"),
                /* @__PURE__ */ C.jsx(
                  Ee,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: U.page.marginMm,
                    onCommit: (v) => ur({ ...U.page, marginMm: v })
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ C.jsxs("label", { children: [
                  g("Pages across"),
                  /* @__PURE__ */ C.jsx(Ee, { min: 1, max: gs, step: 1, integer: !0, "aria-label": g("Pages across"), value: U.page.columns, onCommit: (v) => ur({ ...U.page, columns: v }) })
                ] }),
                /* @__PURE__ */ C.jsxs("label", { children: [
                  g("Pages down"),
                  /* @__PURE__ */ C.jsx(Ee, { min: 1, max: gs, step: 1, integer: !0, "aria-label": g("Pages down"), value: U.page.rows, onCommit: (v) => ur({ ...U.page, rows: v }) })
                ] })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Hc, disabled: !U.items.length, title: g("Make the page a custom size that holds every item inside the margin, as one page"), children: g("Fit page to content") }),
                /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: $c, disabled: !U.items.length, title: g("Scale and centre every item, as one group, to fill the first page inside its margin"), children: g("Fit content to page") })
              ] }),
              /* @__PURE__ */ C.jsx("h3", { children: g("Export") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Format"),
                /* @__PURE__ */ C.jsxs("select", { value: $t, onChange: (v) => Gt(v.target.value), children: [
                  /* @__PURE__ */ C.jsx("option", { value: "pdf", children: g("PDF · the page at its size") }),
                  /* @__PURE__ */ C.jsx("option", { value: "svg", children: g("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ C.jsx("option", { value: "png", children: g("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Resolution (dpi)"),
                /* @__PURE__ */ C.jsx(
                  Ee,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: U.page.dpi,
                    onCommit: (v) => ur({ ...U.page, dpi: v })
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                /* @__PURE__ */ C.jsx("input", { type: "checkbox", checked: jt, onChange: (v) => ze(v.target.checked) }),
                g("Crop to content")
              ] }),
              jt && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Padding (mm)"),
                /* @__PURE__ */ C.jsx(Ee, { min: 0, max: 50, step: 0.5, "aria-label": g("Padding (mm)"), value: Te, onCommit: In })
              ] }),
              /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void rs(), disabled: Ue || !U.items.length, children: g(Ue ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g(jt ? "The export is cut down to the items on each page plus the padding, so a figure comes out without the paper around it; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above." : "The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            Z === "iterate" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: g("Iterate") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Draw the sheet"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    value: ft.mode,
                    onChange: (v) => {
                      const S = v.target.value;
                      if (S === "metadata") {
                        const I = ft.column && o.includes(ft.column) ? ft.column : o[0] ?? "";
                        He({ ...ft, mode: "metadata", column: I, source: ft.source.kind === "metadata" ? { kind: "checked" } : ft.source });
                        return;
                      }
                      He({ ...ft, mode: S === "files" ? "files" : S === "populations" ? "populations" : "off" });
                    },
                    children: [
                      /* @__PURE__ */ C.jsx("option", { value: "off", children: g("Once") }),
                      /* @__PURE__ */ C.jsx("option", { value: "files", children: g("Once per file") }),
                      /* @__PURE__ */ C.jsx("option", { value: "populations", children: g("Once per population") }),
                      /* @__PURE__ */ C.jsx("option", { value: "metadata", disabled: !o.length, children: g("Once per value of a metadata column") })
                    ]
                  }
                )
              ] }),
              ft.mode === "metadata" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Column"),
                /* @__PURE__ */ C.jsx("select", { value: ft.column ?? "", onChange: (v) => He({ ...ft, column: v.target.value }), children: o.map((v) => /* @__PURE__ */ C.jsx("option", { value: v, children: v }, v)) })
              ] }),
              ft.mode !== "off" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                ft.mode === "populations" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  g("Populations"),
                  /* @__PURE__ */ C.jsxs(
                    "select",
                    {
                      value: ((ss = ft.populations) == null ? void 0 : ss.kind) === "branch" ? ft.populations.populationId : "all",
                      onChange: (v) => He({
                        ...ft,
                        populations: v.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: v.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ C.jsx("option", { value: "all", children: g("All in the tree") }),
                        (te ? ua(te.tree.populations, te.tree.root_population_id ?? "") : []).filter(({ popId: v }) => v !== (te == null ? void 0 : te.tree.root_population_id)).map(({ popId: v, depth: S }) => {
                          var I;
                          return /* @__PURE__ */ C.jsxs("option", { value: v, children: [
                            " ".repeat(S * 2),
                            g("Under {name}", { name: ((I = te == null ? void 0 : te.tree.populations[v]) == null ? void 0 : I.name) ?? v })
                          ] }, v);
                        })
                      ]
                    }
                  )
                ] }),
                (ft.mode === "files" || ft.mode === "metadata") && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  g("Files"),
                  /* @__PURE__ */ C.jsxs("select", { value: Uc, onChange: (v) => He({ ...ft, source: Kc(v.target.value) }), children: [
                    /* @__PURE__ */ C.jsx("option", { value: "checked", children: g("Checked files") }),
                    /* @__PURE__ */ C.jsx("option", { value: "all", children: g("All files") }),
                    a.map((v) => /* @__PURE__ */ C.jsx("option", { value: `group:${v.id}`, children: g("Group {name}", { name: v.name }) }, v.id)),
                    ft.mode === "files" && o.flatMap(
                      (v) => Vc(v).map((S) => /* @__PURE__ */ C.jsxs("option", { value: `meta:${v}=${S}`, children: [
                        v,
                        " = ",
                        S
                      ] }, `${v}=${S}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  g("Arrangement"),
                  /* @__PURE__ */ C.jsxs(
                    "select",
                    {
                      value: ft.arrangement.kind,
                      onChange: (v) => He({
                        ...ft,
                        arrangement: v.target.value === "tiles" ? { kind: "tiles", rows: 2, columns: 2, order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ C.jsx("option", { value: "page-per-unit", children: ft.mode === "populations" ? g("One page per population") : ft.mode === "metadata" ? g("One page per value") : g("One page per file") }),
                        /* @__PURE__ */ C.jsx("option", { value: "tiles", children: g("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                ft.arrangement.kind === "tiles" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                  /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((v) => /* @__PURE__ */ C.jsxs("label", { children: [
                    g(v === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ C.jsx(
                      Ee,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": g(v === "columns" ? "Tiles across" : "Tiles down"),
                        value: ft.arrangement.kind === "tiles" ? ft.arrangement[v] : 1,
                        onCommit: (S) => {
                          ft.arrangement.kind === "tiles" && He({ ...ft, arrangement: { ...ft.arrangement, [v]: S } });
                        }
                      }
                    )
                  ] }, v)) }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                    g("Order"),
                    /* @__PURE__ */ C.jsxs(
                      "select",
                      {
                        value: ft.arrangement.order,
                        onChange: (v) => ft.arrangement.kind === "tiles" && He({ ...ft, arrangement: { ...ft.arrangement, order: v.target.value === "column-major" ? "column-major" : "row-major" } }),
                        children: [
                          /* @__PURE__ */ C.jsx("option", { value: "row-major", children: g("Across, then down") }),
                          /* @__PURE__ */ C.jsx("option", { value: "column-major", children: g("Down, then across") })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                    g("Gap between tiles (px)"),
                    /* @__PURE__ */ C.jsx(
                      Ee,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: ft.arrangement.gap,
                        onCommit: (v) => {
                          ft.arrangement.kind === "tiles" && He({ ...ft, arrangement: { ...ft.arrangement, gap: v } });
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: ft.mode === "populations" ? g("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: be.length, of: (te == null ? void 0 : te.name) ?? "the file", pages: Math.max(1, ge.length) }) : ft.mode === "metadata" ? g("{values} values of {column} over {files} files → {pages} pages. Items marked “Follows the iteration” pool the files of each value; the others repeat. Text and titles may use {sample} (the value), {meta:column}, {file} (how many files), {n} and {N}; a plot title may also use {population} and {count}.", { values: be.length, column: ft.column ?? "", files: be.reduce((v, S) => {
                  var I;
                  return v + (((I = S.sampleIds) == null ? void 0 : I.length) ?? 0);
                }, 0), pages: Math.max(1, ge.length) }) : g("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: be.length, pages: Math.max(1, ge.length) }) })
              ] })
            ] }),
            Z === "style" && U && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: g("Style") }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Plot titles"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    "aria-label": g("Plot titles"),
                    value: zo ? "custom" : ((ls = la.find((v) => v.template === (U.titleTemplate ?? ""))) == null ? void 0 : ls.id) ?? "custom",
                    onChange: (v) => {
                      const S = la.find((I) => I.id === v.target.value);
                      kc(!S), Rt((I) => {
                        var B;
                        S ? S.template ? I.titleTemplate = S.template : delete I.titleTemplate : I.titleTemplate = ((B = I.titleTemplate) == null ? void 0 : B.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      la.map((v) => /* @__PURE__ */ C.jsx("option", { value: v.id, children: g(v.label) }, v.id)),
                      /* @__PURE__ */ C.jsx("option", { value: "custom", children: g("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const v = U.items.filter((S) => Lo(S));
                return v.length ? /* @__PURE__ */ C.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  g("{count} plots keep a title of their own, so the template does not reach them.", { count: v.length }),
                  " ",
                  /* @__PURE__ */ C.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: g("Drop those plots' own titles so every plot on the sheet follows the template"),
                      onClick: () => Rt((S) => {
                        for (const I of S.items) oe(I.recipe) && delete I.recipe.title;
                      }),
                      children: g("Use the template for all")
                    }
                  )
                ] }) : null;
              })(),
              (zo || !la.some((v) => v.template === (U.titleTemplate ?? ""))) && (() => {
                var wt;
                const v = U.titleTemplate ?? "", S = qh(v), I = (S == null ? void 0 : S.tokens) ?? [], B = (S == null ? void 0 : S.separator) ?? Tc, G = (lt) => {
                  var Dt;
                  return ((Dt = Ao.find((ee) => ee.token === lt)) == null ? void 0 : Dt.label) ?? lt;
                }, $ = (lt) => Rt((Dt) => {
                  Dt.titleTemplate = Sl(lt, B);
                }), Y = qt.items.find((lt) => oe(lt.recipe)), st = Y && oe(Y.recipe) ? Ma(v, wr(Y.recipe, Y.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ C.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": g("Title builder"), children: [
                  /* @__PURE__ */ C.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": g("Fields in the title"), children: [
                    I.length === 0 && /* @__PURE__ */ C.jsx("span", { className: "gl-hint", children: g(S === null && v ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    I.map((lt, Dt) => /* @__PURE__ */ C.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": g("Remove {field}", { field: G(lt) }),
                        title: g("Remove {field} from the title", { field: G(lt) }),
                        onClick: () => $(I.filter((ee, Se) => Se !== Dt)),
                        children: [
                          G(lt),
                          " ×"
                        ]
                      },
                      `${lt}-${Dt}`
                    ))
                  ] }),
                  /* @__PURE__ */ C.jsx("div", { className: "gl-title-builder-fields", "aria-label": g("Fields to add"), children: Ao.map((lt) => /* @__PURE__ */ C.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-chip",
                      "aria-label": g("Add {field}", { field: lt.label }),
                      title: lt.token,
                      onClick: () => $([...I, lt.token]),
                      children: lt.label
                    },
                    lt.token
                  )) }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                    g("Between fields"),
                    /* @__PURE__ */ C.jsx(
                      "select",
                      {
                        "aria-label": g("Separator"),
                        value: ((wt = di.find((lt) => lt.value === B)) == null ? void 0 : wt.id) ?? "dot",
                        onChange: (lt) => {
                          var ee;
                          const Dt = ((ee = di.find((Se) => Se.id === lt.target.value)) == null ? void 0 : ee.value) ?? " · ";
                          Ic(Dt), I.length && Rt((Se) => {
                            Se.titleTemplate = Sl(I, Dt);
                          });
                        },
                        children: di.map((lt) => /* @__PURE__ */ C.jsx("option", { value: lt.id, children: g(lt.label) }, lt.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                    g("Template"),
                    /* @__PURE__ */ C.jsx(
                      "input",
                      {
                        "aria-label": g("Title template"),
                        value: v,
                        onChange: (lt) => Rt((Dt) => {
                          Dt.titleTemplate = lt.target.value;
                        })
                      }
                    )
                  ] }),
                  st && /* @__PURE__ */ C.jsx("div", { className: "gl-hint gl-title-builder-preview", children: g("First plot reads: {title}", { title: st }) })
                ] });
              })(),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise.`, { list: fi }) }),
              /* @__PURE__ */ C.jsx(
                _l,
                {
                  effective: Ka(U),
                  own: U.style ?? {},
                  onChange: (v) => Rt((S) => {
                    S.style = Es({ ...S.style, ...v });
                  })
                }
              ),
              Object.keys(U.style ?? {}).length > 0 && /* @__PURE__ */ C.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  onClick: () => Rt((v) => {
                    delete v.style;
                  }),
                  children: g("Reset to defaults")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ C.jsx(gf, { menu: Oc, onClose: () => Wa(null) }),
          /* @__PURE__ */ C.jsxs(
            "div",
            {
              ref: (v) => {
                We.current = v, L(v);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": g("Layout page"),
              onKeyDown: Zc,
              children: [
                !Ct && X && /* @__PURE__ */ C.jsx(
                  Gh,
                  {
                    ref: K,
                    container: X,
                    dragContainer: X,
                    selectableTargets: [".gl-layout-item"],
                    selectByClick: !0,
                    selectFromInside: !1,
                    continueSelect: !1,
                    toggleContinueSelect: ["shift"],
                    hitRate: 0,
                    ratio: 0,
                    dragCondition: (v) => {
                      var S, I, B;
                      return !((B = (I = (S = v.inputEvent) == null ? void 0 : S.target) == null ? void 0 : I.closest) != null && B.call(I, "textarea, input, select, button"));
                    },
                    onDragStart: Wc,
                    onSelectEnd: Yc
                  }
                ),
                /* @__PURE__ */ C.jsx(
                  "div",
                  {
                    className: "gl-layout-zoom",
                    style: { width: U.width * gt, height: U.height * gt },
                    children: /* @__PURE__ */ C.jsxs(
                      "section",
                      {
                        ref: (v) => {
                          lr.current = v, W(v);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": U.name,
                        onContextMenu: zc,
                        style: { width: U.width, height: U.height, transform: `scale(${gt})` },
                        children: [
                          da(U.page).map((v) => {
                            const S = mi(U.page), I = vs(U.page.marginMm);
                            return /* @__PURE__ */ C.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: v.x, top: v.y, width: S.width, height: S.height }, children: I > 0 && /* @__PURE__ */ C.jsx("div", { className: "gl-layout-page-margin", style: { inset: I } }) }, `${v.row}-${v.column}`);
                          }),
                          qt.items.length === 0 && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ C.jsx("strong", { children: g("Blank layout") }),
                            /* @__PURE__ */ C.jsx("span", { children: g(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          qt.items.map((v) => /* @__PURE__ */ C.jsx(
                            Mg,
                            {
                              item: v,
                              templateText: (() => {
                                const S = U.items.find((I) => I.id === v.templateId);
                                return (S == null ? void 0 : S.recipe.kind) === "text" ? S.recipe.text : void 0;
                              })(),
                              selected: T.includes(v.id),
                              samples: It,
                              state: f,
                              globalScales: d,
                              dataRevision: w,
                              densityColorPower: _,
                              style: Ka(U, v.recipe),
                              titleTemplate: Lo(v, v.templateSampleId) || Bo,
                              describe: wr,
                              checkedSampleIds: n,
                              metadataById: Er,
                              files: r,
                              sources: he.sources,
                              divisionProfiles: b,
                              canvasScale: ae,
                              onTextChange: (S, I) => {
                                if (!S.trim()) {
                                  Qr([v.templateId]);
                                  return;
                                }
                                Rt((B) => {
                                  const G = B.items.find(
                                    ($) => $.id === v.templateId
                                  );
                                  (G == null ? void 0 : G.recipe.kind) === "text" && (G.recipe.text = S, I > 0 && (G.height = Math.max(G.height, Math.ceil(I) + 4)));
                                });
                              },
                              onTextFocus: () => {
                                (!T.includes(v.id) || T.length > 1) && k([v.id]);
                              },
                              textEditing: z === v.id,
                              onTextEditStart: () => {
                                k([v.id]), O(v.id);
                              },
                              onIsolate: v.group && T.includes(v.id) && T.length > 1 ? () => k([v.id]) : void 0,
                              onTextEditEnd: () => {
                                var S;
                                O((I) => I === v.id ? null : I), (S = We.current) == null || S.focus({ preventScroll: !0 });
                              }
                            },
                            v.id
                          )),
                          !Ct && /* @__PURE__ */ C.jsx(
                            Sh,
                            {
                              ref: tt,
                              target: Ye.length === 1 ? Ye[0] : Ye,
                              zoom: 1 / gt,
                              origin: !1,
                              checkInput: !0,
                              passDragArea: !0,
                              draggable: !0,
                              resizable: !0,
                              useMutationObserver: !0,
                              useResizeObserver: !0,
                              keepRatio: ht.shift,
                              throttleDragRotate: ht.shift ? 45 : 0,
                              snappable: !ht.meta,
                              snapThreshold: 6,
                              isDisplaySnapDigit: !1,
                              isDisplayInnerSnapDigit: !1,
                              snapDirections: Dl,
                              elementSnapDirections: Dl,
                              elementGuidelines: F,
                              verticalGuidelines: Qo.vertical,
                              horizontalGuidelines: Qo.horizontal,
                              snapGridWidth: R ? wl : 0,
                              snapGridHeight: R ? wl : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              individualGroupable: Jr,
                              container: Jr ? A : void 0,
                              onDragStart: Lc,
                              onDrag: Ko,
                              onDragEnd: (v) => {
                                const S = Zo(v);
                                Wn(S, v.lastEvent, v.isDrag, () => Gn(S, !!v.datas.alt));
                              },
                              onDragGroupStart: (v) => {
                                var S;
                                v.datas.alt = !!((S = v.inputEvent) != null && S.altKey), Ln([...v.targets ?? []], v.datas.alt ? Vo(v.targets ?? []) : void 0);
                              },
                              onDragGroup: (v) => v.events.forEach(Ko),
                              onDragGroupEnd: (v) => Wn(v.targets, v.lastEvent, v.isDrag, () => Gn(v.targets, !!v.datas.alt)),
                              onResizeStart: (v) => {
                                var S;
                                Ln([v.target]), (S = v.inputEvent) != null && S.altKey && v.setFixedDirection([0, 0]);
                              },
                              onResize: Jo,
                              onResizeEnd: (v) => Wn([v.target], v.lastEvent, v.isDrag, () => Gn([v.target], !1)),
                              onResizeGroupStart: (v) => {
                                var S;
                                Ln([...v.targets ?? []]), (S = v.inputEvent) != null && S.altKey && v.events.forEach((I) => I.setFixedDirection([0, 0]));
                              },
                              onResizeGroup: (v) => v.events.forEach(Jo),
                              onResizeGroupEnd: (v) => Wn(v.targets, v.lastEvent, v.isDrag, () => Gn(v.targets, !1)),
                              onClick: (v) => {
                                var S, I;
                                if (zn.current) {
                                  zn.current = !1;
                                  return;
                                }
                                ((S = v.inputEvent) != null && S.shiftKey || Jr) && ((I = K.current) == null || I.clickTarget(v.inputEvent, v.inputTarget));
                              },
                              onClickGroup: (v) => {
                                var S;
                                (S = K.current) == null || S.clickTarget(v.inputEvent, v.inputTarget);
                              }
                            }
                          )
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
  Rg as LayoutTab,
  wg as isBakedTitle
};
