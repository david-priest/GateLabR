import { a as at, t as pa, w as ef, s as rf, z as vs, x as hs, y as Ka, A as gs, B as nf, E as xi, G as en, H as af, I as Il, J as Rl, f as of, K as sf, L as lf, M as yi, N as ca, O as ms, P as Pl, Q as uf, R as oe, j as C, T as Ir, U as cr, V as cf, u as Sn, W as ff, X as df, Y as pf, Z as xs, _ as vf, $ as pe, a0 as hf, S as ys, a1 as Za, a2 as gf, a3 as mf, a4 as bs, a5 as xf, a6 as bi, a7 as yf, a8 as Hn, a9 as Ss, aa as bf, ab as Sf, ac as Cf, ad as wf, ae as Ef, af as Df, ag as Mf, ah as Cs, ai as ws, aj as _f, ak as kf, al as Tf, am as Es, an as If, ao as Rf, ap as Pf, aq as Ds, ar as Of, as as Nf, at as Af, au as jf, av as zf, aw as Bf, ax as Gf, ay as Ff, az as Lf, aA as Wf, l as Ja, aB as Yf, aC as Xf, aD as Hf, aE as $f, aF as qf, aG as Vf, aH as Ms } from "./embed-B-rwNMXB.js";
function Qi(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return !0;
  return !1;
}
function Ol(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return t[n];
  return null;
}
function Nl(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function to(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function Uf() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function Kf(t, e) {
  var r = to("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return r ? r[3] : "";
}
function Si(t) {
  return t.replace(/_/g, ".");
}
function nn(t, e) {
  var r = null, n = "-1";
  return Qi(t, function(a) {
    var i = to("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (r = a, n = i[3] || "-1", a.versionAlias ? n = a.versionAlias : a.versionTest && (n = Kf(a.versionTest.toLowerCase(), e) || n), n = Si(n), !0);
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
  return Qi(t, function(n) {
    var a = Al(e, n);
    return a ? (r.brand = n.id, r.version = n.versionAlias || a.version, r.version !== "-1") : !1;
  }), r;
}
function Al(t, e) {
  return Ol(t, function(r) {
    var n = r.brand;
    return to("" + e.test, n.toLowerCase());
  });
}
var jl = [{
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
}], zl = [{
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
}], Ci = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], Bl = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], Gl = [{
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
function Fl(t) {
  return !!nn(Bl, t).preset;
}
function Zf(t) {
  var e = Nl(t), r = !!/mobi/g.exec(e), n = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: Fl(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = nn(jl, e), o = i.preset, s = i.version, l = nn(Gl, e), u = l.preset, c = l.version, f = nn(zl, e);
  if (n.chromium = !!f.preset, n.chromiumVersion = f.version, !n.chromium) {
    var d = nn(Ci, e);
    n.webkit = !!d.preset, n.webkitVersion = d.version;
  }
  return u && (a.name = u.id, a.version = c, a.majorVersion = parseInt(c, 10)), o && (n.name = o.id, n.version = s, n.webview && a.name === "ios" && n.name !== "safari" && (n.webview = !1)), n.majorVersion = parseInt(n.version, 10), {
    browser: n,
    os: a,
    isMobile: r,
    isHints: !1
  };
}
function Jf(t) {
  var e = navigator.userAgentData, r = (e.uaList || e.brands).slice(), n = e.mobile || !1, a = r[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!$n(Bl, r).brand || Fl(Nl())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && Qi(Ci, function(d) {
    return Al(r, d);
  });
  var l = $n(zl, r);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var u = $n(Ci, r);
    o.webkit = !!u.brand, o.webkitVersion = u.version || "-1";
  }
  var c = Ol(Gl, function(d) {
    return new RegExp("" + d.test, "g").exec(i);
  });
  s.name = c ? c.id : "";
  {
    var f = $n(jl, r);
    o.name = f.brand || o.name, o.version = f.brand && t ? t.uaFullVersion : f.version;
  }
  return o.webkit && (s.name = n ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = Si(s.version), o.version = Si(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: n,
    isHints: !0
  };
}
function Qf(t) {
  return Uf() ? Jf() : Zf(t);
}
function td(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  return e.map(function(n) {
    return n.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function ed(t, e) {
  return e.replace(/([^}{]*){/gm, function(r, n) {
    return n.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function nr(t, e) {
  return function(r) {
    r && (t[e] = r);
  };
}
function Ll(t, e, r) {
  return function(n) {
    n && (t[e][r] = n);
  };
}
function rd(t, e) {
  return function(r) {
    var n = r.prototype;
    t.forEach(function(a) {
      e(n, a);
    });
  };
}
function Wl(t, e) {
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
var nd = "function", ad = "object", id = "string", od = "number", eo = "undefined", Yl = typeof window !== eo, sd = typeof document !== eo && document, ld = [{
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
}], Qt = 1e-7, qn = {
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
function ud() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function va(t, e, r, n) {
  return (t * n + e * r) / (r + n);
}
function ro(t) {
  return typeof t === eo;
}
function xe(t) {
  return t && typeof t === ad;
}
function Ht(t) {
  return Array.isArray(t);
}
function Me(t) {
  return typeof t === id;
}
function gn(t) {
  return typeof t === od;
}
function Ta(t) {
  return typeof t === nd;
}
function cd(t, e) {
  var r = t === "" || t == " ", n = e === "" || e == " ";
  return n && r || t === e;
}
function Xl(t, e, r, n, a) {
  var i = no(t, e, r);
  return i ? r : fd(t, e, r + 1, n, a);
}
function no(t, e, r) {
  if (!t.ignore)
    return null;
  var n = e.slice(Math.max(r - 3, 0), r + 3).join("");
  return new RegExp(t.ignore).exec(n);
}
function fd(t, e, r, n, a) {
  for (var i = function(u) {
    var c = e[u].trim();
    if (c === t.close && !no(t, e, u))
      return {
        value: u
      };
    var f = u, d = ye(a, function(v) {
      var h = v.open;
      return h === c;
    });
    if (d && (f = Xl(d, e, u, n, a)), f === -1)
      return o = u, "break";
    u = f, o = u;
  }, o, s = r; s < n; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function ao(t, e) {
  var r = Me(e) ? {
    separator: e
  } : e, n = r.separator, a = n === void 0 ? "," : n, i = r.isSeparateFirst, o = r.isSeparateOnlyOpenClose, s = r.isSeparateOpenClose, l = s === void 0 ? o : s, u = r.openCloseCharacters, c = u === void 0 ? ld : u, f = c.map(function(_) {
    var g = _.open, T = _.close;
    return g === T ? g : g + "|" + T;
  }).join("|"), d = "(\\s*" + a + "\\s*|" + f + "|\\s+)", v = new RegExp(d, "g"), h = t.split(v).filter(function(_) {
    return _ && _ !== "undefined";
  }), m = h.length, x = [], y = [];
  function S() {
    return y.length ? (x.push(y.join("")), y = [], !0) : !1;
  }
  for (var w = function(_) {
    var g = h[_].trim(), T = _, k = ye(c, function(R) {
      var j = R.open;
      return j === g;
    }), A = ye(c, function(R) {
      var j = R.close;
      return j === g;
    });
    if (k) {
      if (T = Xl(k, h, _, m, c), T !== -1 && l)
        return S() && i || (x.push(h.slice(_, T + 1).join("")), _ = T, i) ? (E = _, "break") : (E = _, "continue");
    } else if (A && !no(A, h, _)) {
      var O = ud(c);
      return O.splice(c.indexOf(A), 1), {
        value: ao(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: O
        })
      };
    } else if (cd(g, a) && !o)
      return S(), i ? (E = _, "break") : (E = _, "continue");
    T === -1 && (T = m - 1), y.push(h.slice(_, T + 1).join("")), _ = T, E = _;
  }, E, M = 0; M < m; ++M) {
    var D = w(M);
    if (M = E, typeof D == "object") return D.value;
    if (D === "break") break;
  }
  return y.length && x.push(y.join("")), x;
}
function ar(t) {
  return ao(t, "");
}
function hr(t) {
  return ao(t, ",");
}
function Hl(t) {
  var e = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(t);
  return !e || e.length < 4 ? {} : {
    prefix: e[1],
    value: e[2],
    suffix: e[3]
  };
}
function mr(t) {
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
function wi(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, r) {
    return r.toUpperCase();
  });
}
function dd(t, e) {
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
function ye(t, e, r) {
  var n = Ve(t, e);
  return n > -1 ? t[n] : r;
}
var $l = /* @__PURE__ */ (function() {
  var t = mn(), e = Yl && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(r) {
    var n = mn(), a = setTimeout(function() {
      r(n - t);
    }, 1e3 / 60);
    return a;
  };
})(), pd = /* @__PURE__ */ (function() {
  var t = Yl && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function $r(t) {
  return Object.keys(t);
}
function Nt(t, e) {
  var r = mr(t), n = r.value, a = r.unit;
  if (xe(e)) {
    var i = e[a];
    if (i) {
      if (Ta(i))
        return i(n);
      if (qn[a])
        return qn[a](n, i);
    }
  } else if (a === "%")
    return n * e / 100;
  return qn[a] ? qn[a](n) : n;
}
function ha(t, e, r) {
  return Math.max(e, Math.min(t, r));
}
function _s(t, e, r, n) {
  return n === void 0 && (n = t[0] / t[1]), [[St(e[0], Qt), St(e[0] / n, Qt)], [St(e[1] * n, Qt), St(e[1], Qt)]].filter(function(a) {
    return a.every(function(i, o) {
      var s = e[o], l = St(s, Qt);
      return r ? i <= s || i <= l : i >= s || i >= l;
    });
  })[0] || t;
}
function io(t, e, r, n) {
  if (!n)
    return t.map(function(v, h) {
      return ha(v, e[h], r[h]);
    });
  var a = t[0], i = t[1], o = n === !0 ? a / i : n, s = _s(t, e, !1, o), l = s[0], u = s[1], c = _s(t, r, !0, o), f = c[0], d = c[1];
  return a < l || i < u ? (a = l, i = u) : (a > f || i > d) && (a = f, i = d), [a, i];
}
function vd(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return r;
}
function Ei(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return e ? r / e : 0;
}
function $t(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function hd(t) {
  return [0, 1].map(function(e) {
    return Ei(t.map(function(r) {
      return r[e];
    }));
  });
}
function ks(t) {
  var e = hd(t), r = $t(e, t[0]), n = $t(e, t[1]);
  return r < n && n - r < Math.PI || r > n && n - r < -Math.PI ? 1 : -1;
}
function Ge(t, e) {
  return Math.sqrt(Math.pow((e ? e[0] : 0) - t[0], 2) + Math.pow((e ? e[1] : 0) - t[1], 2));
}
function St(t, e) {
  if (!e)
    return t;
  var r = 1 / e;
  return Math.round(t / e) / r;
}
function Ts(t, e) {
  return t.forEach(function(r, n) {
    t[n] = St(t[n], e);
  }), t;
}
function gd(t) {
  for (var e = [], r = 0; r < t; ++r)
    e.push(r);
  return e;
}
function md(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function te(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function oo(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function ql(t, e) {
  if (t.classList)
    t.classList.remove(e);
  else {
    var r = new RegExp("(\\s|^)" + e + "(\\s|$)");
    t.className = t.className.replace(r, " ");
  }
}
function Jt(t, e, r, n) {
  t.addEventListener(e, r, n);
}
function Xt(t, e, r, n) {
  t.removeEventListener(e, r, n);
}
function Pe(t) {
  return (t == null ? void 0 : t.ownerDocument) || sd;
}
function so(t) {
  return Pe(t).documentElement;
}
function sr(t) {
  return Pe(t).body;
}
function Ee(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function Vl(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function xn(t) {
  return xe(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function xd(t, e, r, n, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = r + o * a, l = n + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function yd(t, e, r, n, a) {
  for (var i = 0; i < a; ++i) {
    var o = r + i * a, s = n + i * a, l = t[o], u = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = u;
  }
}
function bd(t, e, r, n, a) {
  for (var i = 0; i < n; ++i) {
    var o = r + i * n;
    t[o] /= a, e[o] /= a;
  }
}
function Ul(t, e, r) {
  for (var n = t.slice(), a = 0; a < r; ++a)
    n[a * r + e - 1] = 0, n[(e - 1) * r + a] = 0;
  return n[(e - 1) * (r + 1)] = 1, n;
}
function Ne(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = t.slice(), n = zt(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!St(r[i], Qt)) {
      for (var o = a + 1; o < e; ++o)
        if (r[e * a + o]) {
          yd(r, n, a, o, e);
          break;
        }
    }
    if (!St(r[i], Qt))
      return [];
    bd(r, n, a, e, r[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, u = r[l];
      !St(u, Qt) || a === o || xd(r, n, s, a, e, -u);
    }
  }
  return n;
}
function Sd(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = 0; n < e; ++n)
    for (var a = 0; a < e; ++a)
      r[a * e + n] = t[e * n + a];
  return r;
}
function Kl(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = t[e * e - 1], a = 0; a < e - 1; ++a)
    r[a] = t[e * (e - 1) + a] / n;
  return r[e - 1] = 0, r;
}
function Cd(t, e) {
  for (var r = zt(e), n = 0; n < e - 1; ++n)
    r[e * (e - 1) + n] = t[n] || 0;
  return r;
}
function xr(t, e) {
  for (var r = t.slice(), n = t.length; n < e - 1; ++n)
    r[n] = 0;
  return r[e - 1] = 1, r;
}
function Ae(t, e, r) {
  if (e === void 0 && (e = Math.sqrt(t.length)), e === r)
    return t;
  for (var n = zt(r), a = Math.min(e, r), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      n[i * r + o] = t[i * e + o];
    n[(i + 1) * r - 1] = t[(i + 1) * e - 1], n[(r - 1) * r + i] = t[(e - 1) * e + i];
  }
  return n[r * r - 1] = t[e * e - 1], n;
}
function ga(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  var n = zt(t);
  return e.forEach(function(a) {
    n = At(n, a, t);
  }), n;
}
function At(t, e, r) {
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
function It(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] + e[a];
  return n;
}
function gt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] - e[a];
  return n;
}
function wd(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function Zl(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function se(t, e, r) {
  r === void 0 && (r = e.length);
  var n = At(t, e, r), a = n[r - 1];
  return n.map(function(i) {
    return i / a;
  });
}
function Ed(t, e) {
  return At(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function Dd(t, e) {
  return At(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function Md(t, e) {
  return At(t, wn(e, 4));
}
function Vn(t, e) {
  var r = e[0], n = r === void 0 ? 1 : r, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return At(t, [n, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function Cn(t, e) {
  return se(wn(e, 3), xr(t, 3));
}
function Qa(t, e) {
  var r = e[0], n = r === void 0 ? 0 : r, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return At(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, n, i, s, 1], 4);
}
function Di(t, e) {
  return At(t, e, 4);
}
function wn(t, e) {
  var r = Math.cos(t), n = Math.sin(t), a = zt(e);
  return a[0] = r, a[1] = n, a[e] = -n, a[e + 1] = r, a;
}
function zt(t) {
  for (var e = t * t, r = [], n = 0; n < e; ++n)
    r[n] = n % (t + 1) ? 0 : 1;
  return r;
}
function lo(t, e) {
  for (var r = zt(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[(e + 1) * a] = t[a];
  return r;
}
function yr(t, e) {
  for (var r = zt(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[e * (e - 1) + a] = t[a];
  return r;
}
function uo(t, e, r, n, a, i, o, s) {
  var l = t[0], u = t[1], c = e[0], f = e[1], d = r[0], v = r[1], h = n[0], m = n[1], x = a[0], y = a[1], S = i[0], w = i[1], E = o[0], M = o[1], D = s[0], _ = s[1], g = [l, 0, c, 0, d, 0, h, 0, u, 0, f, 0, v, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, c, 0, d, 0, h, 0, u, 0, f, 0, v, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, -x * l, -y * l, -S * c, -w * c, -E * d, -M * d, -D * h, -_ * h, -x * u, -y * u, -S * f, -w * f, -E * v, -M * v, -D * m, -_ * m], T = Ne(g, 8);
  if (!T.length)
    return [];
  var k = At(T, [x, y, S, w, E, M, D, _], 8);
  return k[8] = 1, Ae(Sd(k), 3, 4);
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
function co() {
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
  return e === void 0 && (e = 0), Rr(Fr(t, e));
}
function fa(t, e) {
  var r = se(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), n = r[3] || 1;
  return [
    r[0] / n,
    r[1] / n,
    r[2] / n
  ];
}
function _d(t, e) {
  e === void 0 && (e = document.body);
  for (var r = t, n = co(); r; ) {
    var a = getComputedStyle(r).transform;
    if (n = Di(Gr(a), n), r === e)
      break;
    r = r.parentElement;
  }
  return n = Ne(n, 4), n[12] = 0, n[13] = 0, n[14] = 0, n;
}
function Rr(t) {
  var e = co();
  return t.forEach(function(r) {
    var n = r.matrixFunction, a = r.functionValue;
    n && (e = n(e, a));
  }), e;
}
function Fr(t, e) {
  e === void 0 && (e = 0);
  var r = Ht(t) ? t : ar(t);
  return r.map(function(n) {
    var a = Hl(n), i = a.prefix, o = a.value, s = null, l = i, u = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var c = xe(e) ? sn(sn({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, f = hr(o).map(function(R, j) {
        return j === 0 && "x%" in c ? c["%"] = e["x%"] : j === 1 && "y%" in c ? c["%"] = e["y%"] : c["%"] = e["o%"], Nt(R, c);
      }), d = f[0], v = f[1], h = v === void 0 ? 0 : v, m = f[2], x = m === void 0 ? 0 : m;
      s = Qa, u = [d, h, x];
    } else if (i === "translateY") {
      var y = xe(e) ? sn({ "%": e["y%"] }, e) : {
        "%": e
      }, h = Nt(o, y);
      s = Qa, u = [0, h, 0];
    } else if (i === "translateZ") {
      var x = parseFloat(o);
      s = Qa, u = [0, 0, x];
    } else if (i === "scale" || i === "scale3d") {
      var S = hr(o).map(function(R) {
        return parseFloat(R);
      }), w = S[0], E = S[1], M = E === void 0 ? w : E, D = S[2], _ = D === void 0 ? 1 : D;
      s = Vn, u = [w, M, _];
    } else if (i === "scaleX") {
      var w = parseFloat(o);
      s = Vn, u = [w, 1, 1];
    } else if (i === "scaleY") {
      var M = parseFloat(o);
      s = Vn, u = [1, M, 1];
    } else if (i === "scaleZ") {
      var _ = parseFloat(o);
      s = Vn, u = [1, 1, _];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var g = mr(o), T = g.unit, k = g.value, A = T === "rad" ? k : k * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = Md) : i === "rotateX" ? s = Ed : i === "rotateY" && (s = Dd), u = A;
    } else if (i === "matrix3d")
      s = Di, u = hr(o).map(function(R) {
        return parseFloat(R);
      });
    else if (i === "matrix") {
      var O = hr(o).map(function(R) {
        return parseFloat(R);
      });
      s = Di, u = [
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
var kd = /* @__PURE__ */ (function() {
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
})(), Td = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(r) {
    return this.object[r];
  }, e.set = function(r, n) {
    this.object[r] = n;
  }, t;
})(), Id = typeof Map == "function", Rd = /* @__PURE__ */ (function() {
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
function Pd(t, e) {
  var r = [], n = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new Rd();
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
var Od = /* @__PURE__ */ (function() {
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
    var r = Pd(this.changedBeforeAdded, this.fixed), n = this.changed, a = [];
    this.cacheOrdered = r.filter(function(i, o) {
      var s = i[0], l = i[1], u = n[o], c = u[0], f = u[1];
      if (s !== l)
        return a.push([c, f]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function fo(t, e, r) {
  var n = Id ? Map : r ? Td : kd, a = r || function(S) {
    return S;
  }, i = [], o = [], s = [], l = t.map(a), u = e.map(a), c = new n(), f = new n(), d = [], v = [], h = {}, m = [], x = 0, y = 0;
  return l.forEach(function(S, w) {
    c.set(S, w);
  }), u.forEach(function(S, w) {
    f.set(S, w);
  }), l.forEach(function(S, w) {
    var E = f.get(S);
    typeof E > "u" ? (++y, o.push(w)) : h[E] = y;
  }), u.forEach(function(S, w) {
    var E = c.get(S);
    typeof E > "u" ? (i.push(w), ++x) : (s.push([E, w]), y = h[w] || 0, d.push([E - y, w - x]), v.push(w === E), E !== w && m.push([E, w]));
  }), o.reverse(), new Od(t, e, i, o, m, s, d, v);
}
var Nd = /* @__PURE__ */ (function() {
  function t(r, n) {
    r === void 0 && (r = []), this.findKeyCallback = n, this.list = [].slice.call(r);
  }
  var e = t.prototype;
  return e.update = function(r) {
    var n = [].slice.call(r), a = fo(this.list, n, this.findKeyCallback);
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
var Mi = function(t, e) {
  return Mi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Mi(t, e);
};
function Ad(t, e) {
  Mi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Jl = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), Ql = /* @__PURE__ */ (function(t) {
  Ad(e, t);
  function e(r) {
    return r === void 0 && (r = []), t.call(this, r, Jl) || this;
  }
  return e;
})(Nd);
function Pr(t, e) {
  return fo(t, e, Jl);
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
var _i = function() {
  return _i = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, _i.apply(this, arguments);
};
function jd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
var En = /* @__PURE__ */ (function() {
  function t() {
    this._events = {};
  }
  var e = t.prototype;
  return e.on = function(r, n) {
    if (xe(r))
      for (var a in r)
        this.on(a, r[a]);
    else
      this._addEvent(r, n, {});
    return this;
  }, e.off = function(r, n) {
    if (!r)
      this._events = {};
    else if (xe(r))
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
    }, n.currentTarget = this, jd(i).forEach(function(s) {
      s.listener(n), s.once && a.off(r, s.listener);
    }), !o;
  }, e.trigger = function(r, n) {
    return n === void 0 && (n = {}), this.emit(r, n);
  }, e._addEvent = function(r, n, a) {
    var i = this._events;
    i[r] = i[r] || [];
    var o = i[r];
    o.push(_i({
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
var ki = function(t, e) {
  return ki = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, ki(t, e);
};
function zd(t, e) {
  ki(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Or = function() {
  return Or = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Or.apply(this, arguments);
};
function Bd(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function Is(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function Un(t) {
  if (t) {
    if (Me(t))
      return document.querySelector(t);
  } else return null;
  if (Ta(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var tu = /* @__PURE__ */ (function(t) {
  zd(e, t);
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
      return c.top > o - l ? (f[1] > c.top || o < f[1]) && (d[1] = -1) : c.top + c.height < o + l && (f[1] < c.top + c.height || o > f[1]) && (d[1] = 1), c.left > i - l ? (f[0] > c.left || i < f[0]) && (d[0] = -1) : c.left + c.width < i + l && (f[0] < c.left + c.width || i > f[0]) && (d[0] = 1), !d[0] && !d[1] ? !1 : this._continueDrag(Or(Or({}, a), {
        direction: d,
        inputEvent: n,
        isDrag: !0
      }));
    }
  }, r.checkScroll = function(n) {
    var a = this;
    if (this._isWait)
      return !1;
    var i = n.prevScrollPos, o = i === void 0 ? this._prevScrollPos : i, s = n.direction, l = n.throttleTime, u = l === void 0 ? 0 : l, c = n.inputEvent, f = n.isDrag, d = this._getScrollPosition(s || [0, 0], n), v = d[0] - o[0], h = d[1] - o[1], m = s || [v ? Math.abs(v) / v : 0, h ? Math.abs(h) / h : 0];
    return this._prevScrollPos = d, this._lock = !1, !v && !h ? !1 : (this.emit("move", {
      offsetX: m[0] ? v : 0,
      offsetY: m[1] ? h : 0,
      inputEvent: c
    }), u && f && (clearTimeout(this._timer), this._timer = window.setTimeout(function() {
      a._continueDrag(n);
    }, u)), !0);
  }, r.dragEnd = function() {
    this._flag = !1, this._lock = !1, clearTimeout(this._timer), this._unregisterScrollEvent();
  }, r._getScrollPosition = function(n, a) {
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? Bd : o;
    return s({
      container: Un(i),
      direction: n
    });
  }, r._continueDrag = function(n) {
    var a = this, i, o = n.container, s = n.direction, l = n.throttleTime, u = n.useScroll, c = n.isDrag, f = n.inputEvent;
    if (!(!this._flag || c && this._isWait)) {
      var d = mn(), v = Math.max(l + this._prevTime - d, 0);
      if (v > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(n);
        }, v), !1;
      this._prevTime = d;
      var h = this._getScrollPosition(s, n);
      this._prevScrollPos = h, c && (this._isWait = !0), u || (this._lock = !0);
      var m = {
        container: Un(o),
        direction: s,
        inputEvent: f
      };
      return (i = n.requestScroll) === null || i === void 0 || i.call(n, m), this.emit("scroll", m), this._isWait = !1, u || this.checkScroll(Or(Or({}, n), {
        prevScrollPos: h,
        direction: s,
        inputEvent: f
      }));
    }
  }, r._registerScrollEvent = function(n) {
    this._unregisterScrollEvent();
    var a = n.checkScrollEvent;
    if (a) {
      var i = a === !0 ? Is : a, o = Un(n.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = Is(window, this._onScroll) : this._unregister = i(o, this._onScroll);
    }
  }, r._unregisterScrollEvent = function() {
    var n;
    (n = this._unregister) === null || n === void 0 || n.call(this), this._unregister = null;
  }, e;
})(En);
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
function Gd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function ve(t) {
  return St(t, Qt);
}
function Fd(t, e) {
  return t.every(function(r, n) {
    return ve(r - e[n]) === 0;
  });
}
function Ld(t, e) {
  return !ve(t[0] - e[0]) && !ve(t[1] - e[1]);
}
function ln(t) {
  return t.length < 3 ? 0 : Math.abs(vd(t.map(function(e, r) {
    var n = t[r + 1] || t[0];
    return e[0] * n[1] - n[0] * e[1];
  }))) / 2;
}
function Ti(t, e) {
  var r = e.width, n = e.height, a = e.left, i = e.top, o = br(t), s = o.minX, l = o.minY, u = o.maxX, c = o.maxY, f = r / (u - s), d = n / (c - l);
  return t.map(function(v) {
    return [a + (v[0] - s) * f, i + (v[1] - l) * d];
  });
}
function br(t) {
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
function ma(t, e, r) {
  var n = t[0], a = t[1], i = br(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], u = xa(l[0], l[1]), c = Ii(e), f = [];
  if (c.forEach(function(h) {
    var m = xa(h[0], h[1]), x = h[0];
    if (Fd(u, m))
      f.push({
        pos: t,
        line: h,
        type: "line"
      });
    else {
      var y = eu(po(u, m), [l, h]);
      y.forEach(function(S) {
        h.some(function(w) {
          return Ld(w, S);
        }) ? f.push({
          pos: S,
          line: h,
          type: "point"
        }) : ve(x[1] - a) !== 0 && f.push({
          pos: S,
          line: h,
          type: "intersection"
        });
      });
    }
  }), ye(f, function(h) {
    return h[0] === n;
  }))
    return !0;
  var d = 0, v = {};
  return f.forEach(function(h) {
    var m = h.pos, x = h.type, y = h.line;
    if (!(m[0] > n))
      if (x === "intersection")
        ++d;
      else {
        if (x === "line")
          return;
        if (x === "point") {
          var S = ye(y, function(M) {
            return M[1] !== a;
          }), w = v[m[0]], E = S[1] > a ? 1 : -1;
          w ? w !== E && ++d : v[m[0]] = E;
        }
      }
  }), d % 2 === 1;
}
function xa(t, e) {
  var r = t[0], n = t[1], a = e[0], i = e[1], o = a - r, s = i - n;
  Math.abs(o) < Qt && (o = 0), Math.abs(s) < Qt && (s = 0);
  var l = 0, u = 0, c = 0;
  return o ? s ? (l = -s / o, u = 1, c = -l * r - n) : (u = 1, c = -n) : s && (l = -1, c = r), [l, u, c];
}
function po(t, e) {
  var r = t[0], n = t[1], a = t[2], i = e[0], o = e[1], s = e[2], l = r === 0 && i === 0, u = n === 0 && o === 0, c = [];
  if (l && u)
    return [];
  if (l) {
    var f = -a / n, d = -s / o;
    return f !== d ? [] : [[-1 / 0, f], [1 / 0, f]];
  } else if (u) {
    var v = -a / r, h = -s / i;
    return v !== h ? [] : [[v, -1 / 0], [v, 1 / 0]];
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
function eu(t, e) {
  var r = e.map(function(f) {
    return [0, 1].map(function(d) {
      return [Math.min(f[0][d], f[1][d]), Math.max(f[0][d], f[1][d])];
    });
  }), n = [];
  if (t.length === 2) {
    var a = t[0], i = a[0], o = a[1];
    if (ve(i - t[1][0])) {
      if (!ve(o - t[1][1])) {
        var u = Math.max.apply(Math, r.map(function(f) {
          return f[0][0];
        })), c = Math.min.apply(Math, r.map(function(f) {
          return f[0][1];
        }));
        if (ve(u - c) > 0)
          return [];
        n = [[u, o], [c, o]];
      }
    } else {
      var s = Math.max.apply(Math, r.map(function(f) {
        return f[1][0];
      })), l = Math.min.apply(Math, r.map(function(f) {
        return f[1][1];
      }));
      if (ve(s - l) > 0)
        return [];
      n = [[i, s], [i, l]];
    }
  }
  return n.length || (n = t.filter(function(f) {
    var d = f[0], v = f[1];
    return r.every(function(h) {
      return 0 <= ve(d - h[0][0]) && 0 <= ve(h[0][1] - d) && 0 <= ve(v - h[1][0]) && 0 <= ve(h[1][1] - v);
    });
  })), n.map(function(f) {
    return [ve(f[0]), ve(f[1])];
  });
}
function Ii(t) {
  return Gd(t.slice(1), [t[0]]).map(function(e, r) {
    return [t[r], e];
  });
}
function Wd(t, e) {
  var r = t.slice(), n = e.slice();
  ks(r) === -1 && r.reverse(), ks(n) === -1 && n.reverse();
  var a = Ii(r), i = Ii(n), o = a.map(function(c) {
    return xa(c[0], c[1]);
  }), s = i.map(function(c) {
    return xa(c[0], c[1]);
  }), l = [];
  o.forEach(function(c, f) {
    var d = a[f], v = [];
    s.forEach(function(h, m) {
      var x = po(c, h), y = eu(x, [d, i[m]]);
      v.push.apply(v, y.map(function(S) {
        return {
          index1: f,
          index2: m,
          pos: S,
          type: "intersection"
        };
      }));
    }), v.sort(function(h, m) {
      return Ge(d[0], h.pos) - Ge(d[0], m.pos);
    }), l.push.apply(l, v), ma(d[1], n) && l.push({
      index1: f,
      index2: -1,
      pos: d[1],
      type: "inside"
    });
  }), i.forEach(function(c, f) {
    if (ma(c[1], r)) {
      var d = !1, v = Ve(l, function(h) {
        var m = h.index2;
        return m === f ? (d = !0, !1) : !!d;
      });
      v === -1 && (d = !1, v = Ve(l, function(h) {
        var m = h.index1, x = h.index2;
        return m === -1 && x + 1 === f ? (d = !0, !1) : !!d;
      })), v === -1 ? l.push({
        index1: -1,
        index2: f,
        pos: c[1],
        type: "inside"
      }) : l.splice(v, 0, {
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
function Ri(t, e) {
  var r = Wd(t, e);
  return r.map(function(n) {
    var a = n.pos;
    return a;
  });
}
function Yd(t, e) {
  var r = Ri(t, e);
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
var Pi = function(t, e) {
  return Pi = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Pi(t, e);
};
function Xd(t, e) {
  Pi(t, e);
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
function Hd(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function ti(t) {
  return Hd([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function $d(t) {
  return t.touches && t.touches.length >= 2;
}
function Kn(t) {
  return t ? t.touches ? Vd(t.touches) : [ru(t)] : [];
}
function qd(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function Rs(t, e, r) {
  var n = r.length, a = un(t, n), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, u = un(e, n), c = u.clientX, f = u.clientY, d = un(r, n), v = d.clientX, h = d.clientY, m = i - c, x = o - f, y = i - v, S = o - h;
  return {
    clientX: s,
    clientY: l,
    deltaX: m,
    deltaY: x,
    distX: y,
    distY: S
  };
}
function ei(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function Vd(t) {
  for (var e = Math.min(t.length, 2), r = [], n = 0; n < e; ++n)
    r.push(ru(t[n]));
  return r;
}
function ru(t) {
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
var ri = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), ti(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), ti(e) - ti(this.startClients);
  }, t.prototype.getPosition = function(e, r) {
    e === void 0 && (e = this.prevClients);
    var n = Rs(e || this.prevClients, this.prevClients, this.startClients), a = n.deltaX, i = n.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, n;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var r = this.prevClients, n = this.startClients, a = Math.min(this.length, r.length), i = [], o = 0; o < a; ++o)
      i[o] = Rs([e[o]], [r[o]], [n[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var r = this.movement;
    if (!e)
      return r;
    var n = un(e, this.length), a = un(this.prevClients, this.length), i = n.clientX - a.clientX, o = n.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + r;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), ei(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), ei(e) / ei(this.startClients);
  }, t.prototype.move = function(e, r) {
    this.startClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    }), this.prevClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    });
  }, t;
})(), Ps = ["textarea", "input"], nu = /* @__PURE__ */ (function(t) {
  Xd(e, t);
  function e(r, n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(d, v) {
      if (v === void 0 && (v = !0), !(!a.flag && d.cancelable === !1)) {
        var h = d.type.indexOf("drag") >= -1;
        if (!(a.flag && h)) {
          a._isDragAPI = !0;
          var m = a.options, x = m.container, y = m.pinchOutside, S = m.preventWheelClick, w = m.preventRightClick, E = m.preventDefault, M = m.checkInput, D = m.dragFocusedInput, _ = m.preventClickEventOnDragStart, g = m.preventClickEventOnDrag, T = m.preventClickEventByCondition, k = a._useTouch, A = !a.flag;
          if (a._isSecondaryButton = d.which === 3 || d.button === 2, S && (d.which === 2 || d.button === 1) || w && (d.which === 3 || d.button === 2))
            return a.stop(), !1;
          if (A) {
            var O = a._window.document.activeElement, R = d.target;
            if (R) {
              var j = R.tagName.toLowerCase(), z = Ps.indexOf(j) > -1, W = R.isContentEditable;
              if (z || W) {
                if (M || !D && O === R)
                  return !1;
                if (O && (O === R || W && O.isContentEditable && O.contains(R)))
                  if (D)
                    R.blur();
                  else
                    return !1;
              } else if ((E || d.type === "touchstart") && O) {
                var Y = O.tagName.toLowerCase();
                (O.isContentEditable || Ps.indexOf(Y) > -1) && O.blur();
              }
              (_ || g || T) && Jt(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new ri(Kn(d))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = v, a._dragFlag = !0, a._prevInputEvent = d, a.data = {}, a.doubleFlag = mn() - a.prevTime < 200, a._isMouseEvent = qd(d), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var L = a._preventMouseEvent || a.emit("dragStart", Kt(Kt({ data: a.data, datas: a.data, inputEvent: d, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: v, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
              d.preventDefault();
            }, preventDrag: function() {
              a._dragFlag = !1;
            } }));
            L === !1 && a.stop(), a._isMouseEvent && a.flag && E && d.preventDefault();
          }
          if (!a.flag)
            return !1;
          var q = 0;
          if (A ? (a._attchDragEvent(), k && y && (q = setTimeout(function() {
            Jt(x, "touchstart", a.onDragStart, {
              passive: !1
            });
          }))) : k && y && Xt(x, "touchstart", a.onDragStart), a.flag && $d(d)) {
            if (clearTimeout(q), A && d.touches.length !== d.changedTouches.length)
              return;
            a.pinchFlag || a.onPinchStart(d);
          }
        }
      }
    }, a.onDrag = function(d, v) {
      if (a.flag) {
        var h = a.options.preventDefault;
        !a._isMouseEvent && h && d.preventDefault(), a._prevInputEvent = d;
        var m = Kn(d), x = a.moveClients(m, d, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || x.deltaX || x.deltaY) {
            var y = a._preventMouseEvent || a.emit("drag", Kt(Kt({}, x), { isScroll: !!v, inputEvent: d }));
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
        var v = a.options, h = v.pinchOutside, m = v.container, x = v.preventClickEventOnDrag, y = v.preventClickEventOnDragStart, S = v.preventClickEventByCondition, w = a.isDrag;
        (x || y || S) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !S && !y && x && !w && a._allowClickEvent(), a._useTouch && h && Xt(m, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(d);
        var E = d != null && d.touches ? Kn(d) : [], M = E.length;
        M === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new ri(E));
        var D = a._getPosition(), _ = mn(), g = !w && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = w || g ? 0 : _, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", Kt({ data: a.data, datas: a.data, isDouble: g, isDrag: w, isClick: !w, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: d, isTrusted: a._isTrusted }, D)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
          a._preventMouseEvent = !1;
        }, 200)), a._isIdle = !0);
      }
    }, a.onBlur = function() {
      a.onDragEnd();
    }, a._allowClickEvent = function() {
      Xt(a._window, "click", a._onClick, !0);
    }, a._onClick = function(d) {
      a._allowClickEvent(), a._allowMouseEvent();
      var v = a.options.preventClickEventByCondition;
      v != null && v(d) || (d.stopPropagation(), d.preventDefault());
    }, a._onContextMenu = function(d) {
      var v = a.options;
      v.preventRightClick ? a.onDragEnd(d) : d.preventDefault();
    }, a._passCallback = function() {
    };
    var i = [].concat(r), o = i[0];
    a._window = Vl(o) ? o : Ee(o), a.options = Kt({ checkInput: !1, container: o && !("document" in o) ? Ee(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, n);
    var s = a.options, l = s.container, u = s.events, c = s.checkWindowBlur;
    if (a._useDrag = u.indexOf("drag") > -1, a._useTouch = u.indexOf("touch") > -1, a._useMouse = u.indexOf("mouse") > -1, a.targets = i, a._useDrag && i.forEach(function(d) {
      Jt(d, "dragstart", a.onDragStart);
    }), a._useMouse && (i.forEach(function(d) {
      Jt(d, "mousedown", a.onDragStart), Jt(d, "mousemove", a._passCallback);
    }), Jt(l, "contextmenu", a._onContextMenu)), c && Jt(Ee(), "blur", a.onBlur), a._useTouch) {
      var f = {
        passive: !1
      };
      i.forEach(function(d) {
        Jt(d, "touchstart", a.onDragStart, f), Jt(d, "touchmove", a._passCallback, f);
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
    return r === void 0 && (r = this._prevInputEvent), Kt(Kt({ data: this.data, datas: this.data }, this._getPosition()), { movement: this.getMovement(), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, inputEvent: r });
  }, e.prototype.getEventData = function() {
    return this.data;
  }, e.prototype.getEventDatas = function() {
    return this.data;
  }, e.prototype.unset = function() {
    var r = this, n = this.targets, a = this.options.container;
    this.off(), Xt(this._window, "blur", this.onBlur), this._useDrag && n.forEach(function(i) {
      Xt(i, "dragstart", r.onDragStart);
    }), this._useMouse && (n.forEach(function(i) {
      Xt(i, "mousedown", r.onDragStart);
    }), Xt(a, "contextmenu", this._onContextMenu)), this._useTouch && (n.forEach(function(i) {
      Xt(i, "touchstart", r.onDragStart);
    }), Xt(a, "touchstart", this.onDragStart)), this._prevInputEvent = null, this._allowClickEvent(), this._dettachDragEvent();
  }, e.prototype.onPinchStart = function(r) {
    var n = this, a = this.options.pinchThreshold;
    if (!(this.isDrag && this.getMovement() > a)) {
      var i = new ri(Kn(r));
      this.pinchFlag = !0, this._addStore(i);
      var o = this.emit("pinchStart", Kt(Kt({ data: this.data, datas: this.data, angle: i.getAngle(), touches: this.getCurrentStore().getPositions() }, i.getPosition()), { inputEvent: r, isTrusted: this._isTrusted, preventDefault: function() {
        r.preventDefault();
      }, preventDrag: function() {
        n._dragFlag = !1;
      } }));
      o === !1 && (this.pinchFlag = !1);
    }
  }, e.prototype.onPinch = function(r, n) {
    if (!(!this.flag || !this.pinchFlag || n.length < 2)) {
      var a = this.getCurrentStore();
      this.isPinch = !0, this.emit("pinch", Kt(Kt({ data: this.data, datas: this.data, movement: this.getMovement(n), angle: a.getAngle(n), rotation: a.getRotation(n), touches: a.getPositions(n), scale: a.getScale(n), distance: a.getDistance(n) }, a.getPosition(n)), { inputEvent: r, isTrusted: this._isTrusted }));
    }
  }, e.prototype.onPinchEnd = function(r) {
    if (this.pinchFlag) {
      var n = this.isPinch;
      this.isPinch = !1, this.pinchFlag = !1;
      var a = this.getCurrentStore();
      this.emit("pinchEnd", Kt(Kt({ data: this.data, datas: this.data, isPinch: n, touches: a.getPositions() }, a.getPosition()), { inputEvent: r }));
    }
  }, e.prototype.getCurrentStore = function() {
    return this.clientStores[0];
  }, e.prototype.moveClients = function(r, n, a) {
    var i = this._getPosition(r, a), o = this.isDrag;
    (i.deltaX || i.deltaY) && (this.isDrag = !0);
    var s = !1;
    return !o && this.isDrag && (s = !0), Kt(Kt({ data: this.data, datas: this.data }, i), { movement: this.getMovement(r), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, isMouseEvent: this._isMouseEvent, isSecondaryButton: this._isSecondaryButton, inputEvent: n, isTrusted: this._isTrusted, isFirstDrag: s });
  }, e.prototype._addStore = function(r) {
    this.clientStores.splice(0, 0, r);
  }, e.prototype._getPosition = function(r, n) {
    var a = this.getCurrentStore(), i = a.getPosition(r, n), o = this.clientStores.slice(1).reduce(function(u, c) {
      var f = c.getPosition();
      return u.distX += f.distX, u.distY += f.distY, u;
    }, i), s = o.distX, l = o.distY;
    return Kt(Kt({}, i), { distX: s, distY: l });
  }, e.prototype._attchDragEvent = function() {
    var r = this._window, n = this.options.container, a = {
      passive: !1
    };
    this._isDragAPI && (Jt(n, "dragover", this.onDrag, a), Jt(r, "dragend", this.onDragEnd)), this._useMouse && (Jt(n, "mousemove", this.onDrag), Jt(r, "mouseup", this.onDragEnd)), this._useTouch && (Jt(n, "touchmove", this.onDrag, a), Jt(r, "touchend", this.onDragEnd, a), Jt(r, "touchcancel", this.onDragEnd, a));
  }, e.prototype._dettachDragEvent = function() {
    var r = this._window, n = this.options.container;
    this._isDragAPI && (Xt(n, "dragover", this.onDrag), Xt(r, "dragend", this.onDragEnd)), this._useMouse && (Xt(n, "mousemove", this.onDrag), Xt(r, "mouseup", this.onDragEnd)), this._useTouch && (Xt(n, "touchstart", this.onDragStart), Xt(n, "touchmove", this.onDrag), Xt(r, "touchend", this.onDragEnd), Xt(r, "touchcancel", this.onDragEnd));
  }, e.prototype._allowMouseEvent = function() {
    this._preventMouseEvent = !1, clearTimeout(this._preventMouseEventId);
  }, e;
})(En);
function Ud(t) {
  for (var e = 5381, r = t.length; r; )
    e = e * 33 ^ t.charCodeAt(--r);
  return e >>> 0;
}
var Kd = Ud;
function Zd(t) {
  return Kd(t).toString(36);
}
function Jd(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function Qd(t, e, r) {
  return r.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(n, a) {
    var i = a.trim();
    return (i ? hr(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function tp(t, e, r, n, a) {
  var i = Pe(n), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), r.nonce && o.setAttribute("nonce", r.nonce), o.innerHTML = Qd(t, e, r), (a || i.head || i.body).appendChild(o), o;
}
function au(t) {
  var e = "rCS" + Zd(t);
  return {
    className: e,
    inject: function(r, n) {
      n === void 0 && (n = {});
      var a = Jd(r), i = (a || r.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = tp(e, t, n, r, a);
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
var Oi = function() {
  return Oi = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Oi.apply(this, arguments);
};
function ep(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function iu(t, e) {
  var r = au(e), n = r.className;
  return at.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = ep(a, ["className", "cspNonce"]), u = at.useRef();
    return at.useImperativeHandle(i, function() {
      return u.current;
    }, []), at.useEffect(function() {
      var c = r.inject(u.current, {
        nonce: a.cspNonce
      });
      return function() {
        c.destroy();
      };
    }, []), at.createElement(t, Oi({
      ref: u,
      "data-styled-id": n,
      className: "".concat(s, " ").concat(n)
    }, l));
  });
}
var Ni = function(t, e) {
  return Ni = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Ni(t, e);
};
function Dn(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Ni(t, e);
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
function rp(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
      e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function np(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function ap(t) {
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
function Q(t, e, r) {
  if (arguments.length === 2) for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function Mn(t, e) {
  return P({ events: [], props: [], name: t }, e);
}
var ip = ["n", "w", "s", "e"], vo = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function op(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function sp(t) {
  var e = op(1, t), r = Math.round(t / 45) * 45 % 180, n = "ns-resize";
  return r === 135 ? n = "nwse-resize" : r === 45 ? n = "nesw-resize" : r === 90 && (n = "ew-resize"), "cursor:".concat(n, ";cursor: url('").concat(e, "') 16 16, ").concat(n, ";");
}
var qr = Qf(), ou = qr.browser.webkit, su = ou && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), lu = qr.browser.name, uu = parseInt(qr.browser.version, 10), lp = lu === "chrome", up = qr.browser.chromium, cp = parseInt(qr.browser.chromiumVersion, 10) || 0, fp = lp && uu >= 109 || up && cp >= 109, dp = lu === "firefox", pp = parseInt(qr.browser.webkitVersion, 10) >= 612 || uu >= 15, ho = "moveable-", vp = vo.map(function(t) {
  var e = "", r = "", n = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (r = "left: ".concat(i, ";"), n = "right"), t.indexOf("e") > -1 && (r = "left: 0px;", n = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(r).concat(e, `
        transform-origin: `).concat(n, " ").concat(a, `;
    }`);
}).join(`
`), hp = `
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
`.concat(vp, `
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
`).concat(sp(t), `
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

`).concat(su ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), gp = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], Ai = 1e-4, fe = 1e-7, Zn = 1e-9, ji = Math.pow(10, 10), Os = -ji, mp = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, go = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, cu = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, xp = [
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
function _n(t, e, r, n, a, i) {
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
function Br(t, e, r, n) {
  var a = t.length === 16, i = a ? 4 : 3, o = wr(t, r, n, i), s = N(o, 4), l = N(s[0], 2), u = l[0], c = l[1], f = N(s[1], 2), d = f[0], v = f[1], h = N(s[2], 2), m = h[0], x = h[1], y = N(s[3], 2), S = y[0], w = y[1], E = N(Lt(t, e, i), 2), M = E[0], D = E[1], _ = Math.min(u, d, m, S), g = Math.min(c, v, x, w), T = Math.max(u, d, m, S), k = Math.max(c, v, x, w);
  u = u - _ || 0, d = d - _ || 0, m = m - _ || 0, S = S - _ || 0, c = c - g || 0, v = v - g || 0, x = x - g || 0, w = w - g || 0, M = M - _ || 0, D = D - g || 0;
  var A = t[0], O = t[i + 1], R = ue(A * O);
  return {
    left: _,
    top: g,
    right: T,
    bottom: k,
    origin: [M, D],
    pos1: [u, c],
    pos2: [d, v],
    pos3: [m, x],
    pos4: [S, w],
    direction: R
  };
}
function fu(t, e) {
  var r = e.clientX, n = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, u = i.pos1, c = o.left, f = o.top, d = l ? 4 : 3, v = N(gt(Xr(s, [r - c, n - f], d), u), 2), h = v[0], m = v[1], x = N(Le({ datas: a, distX: h, distY: m }), 2), y = x[0], S = x[1];
  return [y, S];
}
function Cr(t, e) {
  var r = e.datas, n = t.state, a = n.allMatrix, i = n.beforeMatrix, o = n.is3d, s = n.left, l = n.top, u = n.origin, c = n.offsetMatrix, f = n.targetMatrix, d = n.transformOrigin, v = o ? 4 : 3;
  r.is3d = o, r.matrix = a, r.targetMatrix = f, r.beforeMatrix = i, r.offsetMatrix = c, r.transformOrigin = d, r.inverseMatrix = Ne(a, v), r.inverseBeforeMatrix = Ne(i, v), r.absoluteOrigin = xr(It([s, l], u), v), r.startDragBeforeDist = se(r.inverseBeforeMatrix, r.absoluteOrigin, v), r.startDragDist = se(r.inverseMatrix, r.absoluteOrigin, v);
}
function yp(t) {
  return Br(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function Ia(t, e, r) {
  var n = e.datas, a = e.originalDatas.beforeRenderable, i = n.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, u = -1;
  i === -1 ? (r === "translate" ? u = 0 : r === "rotate" && (u = Ve(o, function(v) {
    return v.match(/scale\(/g);
  })), u === -1 && (u = o.length), n.transformIndex = u) : ye(l, function(v) {
    return v.index === i && v.functionName === r;
  }) ? u = i : u = i + l.filter(function(v) {
    return v.index < i;
  }).length;
  var c = Hv(o, t.state, u), f = c.targetFunction, d = r === "rotate" ? "rotateZ" : r;
  n.beforeFunctionTexts = c.beforeFunctionTexts, n.afterFunctionTexts = c.afterFunctionTexts, n.beforeTransform = c.beforeFunctionMatrix, n.beforeTransform2 = c.beforeFunctionMatrix2, n.targetTansform = c.targetFunctionMatrix, n.afterTransform = c.afterFunctionMatrix, n.afterTransform2 = c.afterFunctionMatrix2, n.targetAllTransform = c.allFunctionMatrix, f.functionName === d ? (n.afterFunctionTexts.splice(0, 1), n.isAppendTransform = !1) : s > u && (n.isAppendTransform = !0, a.nextTransformAppendedIndexes = Q(Q([], N(l), !1), [{
    functionName: r,
    index: u,
    isAppend: !0
  }], !1));
}
function Ra(t, e, r) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? r : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function bp(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = N(pu({ datas: e, distX: r, distY: n }), 2), i = a[0], o = a[1], s = du(e, Cd([i, o], 4));
  return se(s, xr([0, 0, 0], 4), 4);
}
function du(t, e, r) {
  var n = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = r ? At(s, e, 4) : At(e, s, 4), u = At(Ne(r ? i : n, 4), l, 4), c = At(u, Ne(r ? o : a, 4), 4);
  return c;
}
function pu(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return gt(se(a, It(s, [r, n]), l), o);
}
function Le(t, e) {
  var r = t.datas, n = t.distX, a = t.distY, i = r.inverseBeforeMatrix, o = r.inverseMatrix, s = r.is3d, l = r.startDragBeforeDist, u = r.startDragDist, c = r.absoluteOrigin, f = s ? 4 : 3;
  return gt(se(e ? i : o, It(c, [n, a]), f), e ? l : u);
}
function Sp(t, e) {
  var r = t.datas, n = t.distX, a = t.distY;
  r.beforeMatrix;
  var i = r.matrix, o = r.is3d;
  r.startDragBeforeDist;
  var s = r.startDragDist, l = r.absoluteOrigin, u = o ? 4 : 3;
  return gt(se(i, It(s, [n, a]), u), l);
}
function Cp(t, e, r, n, a, i) {
  return n === void 0 && (n = e), a === void 0 && (a = r), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = mr(o), u = l.value, c = l.unit, f = s ? a : n, d = s ? r : e;
    if (o === "%" || isNaN(u)) {
      var v = f ? i[s] / f : 0;
      return d * v;
    } else if (c !== "%")
      return u;
    return d * u / 100;
  }) : i;
}
function vu(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function wp(t, e) {
  return vu(e).map(function(r) {
    return t[r];
  });
}
function ni(t, e) {
  var r = (e + 1) / 2;
  return [
    va(t[0][0], t[1][0], r, 1 - r),
    va(t[0][1], t[1][1], r, 1 - r)
  ];
}
function ne(t, e) {
  var r = ni([t[0], t[1]], e[0]), n = ni([t[2], t[3]], e[0]);
  return ni([r, n], e[1]);
}
function Ep(t, e, r, n, a, i) {
  var o = wr(e, r, n, a), s = ne(o, i), l = t[0] - s[0], u = t[1] - s[1];
  return [l, u];
}
function kn(t, e, r, n) {
  return At(t, fn(e, n, r), n);
}
function Dp(t, e, r, n) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (Me(r)) {
    var u = e.beforeTransform, c = e.afterTransform;
    n ? l = Ae(Gr(r), 4, s) : l = Ae(At(At(u, Gr([r]), 4), c, 4), 4, s);
  } else
    l = r;
  return kn(i, l, a, s);
}
function Mp(t, e) {
  var r = t.transformOrigin, n = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return kn(n, At(o || i, lo(e, s), s), r, s);
}
function Pa(t, e) {
  var r = Vr(e);
  return {
    setTransform: function(n, a) {
      a === void 0 && (a = -1), r.startTransforms = Ht(n) ? n : ar(n), zi(t, e, a);
    },
    setTransformIndex: function(n) {
      zi(t, e, n);
    }
  };
}
function Oa(t, e, r) {
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
function mo(t, e) {
  var r = Vr(t);
  r.nextTransforms = ar(e);
}
function Vr(t) {
  return t.originalDatas.beforeRenderable;
}
function ya(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function Jn(t) {
  return (ya(t) || []).join(" ");
}
function Qn(t) {
  return Vr(t).nextStyle;
}
function hu(t, e, r, n, a) {
  mo(a, e);
  var i = le.drag(t, _n(a, t.state, r, n)), o = i ? i.transform : e;
  return P(P({ transform: e, drag: i }, ce({
    transform: o
  }, a)), { afterTransform: o });
}
function xo(t, e, r, n, a, i) {
  var o = Dp(t.state, a, e, i), s = Tp(t, r, n, o);
  return s;
}
function gu(t, e, r, n, a, i, o) {
  var s = xo(t, e, r, a, i, o), l = t.state, u = l.left, c = l.top, f = t.props.groupable, d = f ? u : 0, v = f ? c : 0, h = gt(n, s);
  return gt(h, [d, v]);
}
function _p(t, e, r, n, a, i, o) {
  var s = gu(t, e, r, n, a, i, o);
  return s;
}
function kp(t, e, r) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    r ? -1 + t[1] / (r / 2) : 0
  ];
}
function Tp(t, e, r, n) {
  n === void 0 && (n = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, u = [
    i / 2 * (1 + e[0]) + r[0],
    o / 2 * (1 + e[1]) + r[1]
  ];
  return Lt(n, u, l);
}
function Ip(t, e, r) {
  var n = r.fixedDirection, a = r.fixedPosition, i = r.fixedOffset;
  return gu(t, "rotate(".concat(e, "deg)"), n, a, i, r);
}
function Rp(t, e, r, n, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, u = s.offsetMatrix, c = s.is3d, f = s.width, d = s.height, v = s.left, h = s.top, m = i.fixedDirection, x = i.nextTargetMatrix || s.targetMatrix, y = c ? 4 : 3, S = Cp(a, e, r, f, d, l), w = o ? v : 0, E = o ? h : 0, M = kn(u, x, S, y), D = Ep(n, M, e, r, y, m);
  return gt(D, [w, E]);
}
function Pp(t, e) {
  return ne(ke(t.state), e);
}
function Op(t, e) {
  var r = t.targetGesto, n = t.controlGesto, a;
  return r != null && r.isFlag() && (a = r.getEventData()[e]), !a && (n != null && n.isFlag()) && (a = n.getEventData()[e]), a || {};
}
function Np(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function Ap(t) {
  var e = t("scale"), r = t("rotate"), n = t("translate"), a = [];
  return n && n !== "0px" && n !== "none" && a.push("translate(".concat(n.split(/\s+/).join(","), ")")), r && r !== "1" && r !== "none" && a.push("rotate(".concat(r, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function mu(t, e, r) {
  for (var n = t, a = [], i = so(t) || sr(t), o = !r && t === e || t === i, s = o, l = !1, u = 3, c, f, d, v = !1, h = bn(e, e, !0).offsetParent, m = 1; n && !s; ) {
    s = o;
    var x = he(n), y = x("position"), S = Lu(n), w = y === "fixed", E = Ap(x), M = wd(Pv(S)), D = void 0, _ = !1, g = !1, T = 0, k = 0, A = 0, O = 0, R = {
      hasTransform: !1,
      fixedContainer: null
    };
    w && (v = !0, R = zv(n), h = R.fixedContainer);
    var j = M.length;
    !l && (j === 16 || E.length) && (l = !0, u = 4, Yi(a), d && (d = Ae(d, 3, 4))), l && j === 9 && (M = Ae(M, 3, 4));
    var z = jv(n, t), W = z.tagName, Y = z.hasOffset, L = z.isSVG, q = z.origin, V = z.targetOrigin, F = z.offset, rt = N(F, 2), et = rt[0], Z = rt[1];
    W === "svg" && !n.ownerSVGElement && d && (a.push({
      type: "target",
      target: n,
      matrix: Bv(n, u)
    }), a.push({
      type: "offset",
      target: n,
      matrix: zt(u)
    }));
    var it = parseFloat(x("zoom")) || 1;
    if (w)
      D = R.fixedContainer, _ = !0;
    else {
      var tt = bn(n, e, !1, !0, x), st = tt.offsetZoom;
      if (D = tt.offsetParent, _ = tt.isEnd, g = tt.isStatic, m *= st, (tt.isCustomElement || st !== 1) && g)
        et -= D.offsetLeft, Z -= D.offsetTop;
      else if (dp || fp) {
        var nt = tt.parentSlotElement;
        if (nt) {
          for (var pt = D, Ct = 0, U = 0; pt && Np(pt); )
            Ct += pt.offsetLeft, U += pt.offsetTop, pt = pt.offsetParent;
          et -= Ct, Z -= U;
        }
      }
    }
    if (ou && !pp && Y && !L && g && (y === "relative" || y === "static") && (et -= D.offsetLeft, Z -= D.offsetTop, o = o || _), w)
      Y && R.hasTransform && (A = D.clientLeft, O = D.clientTop);
    else if (Y && h !== D && (T = D.clientLeft, k = D.clientTop), Y && D === i) {
      var ut = Wu(n, !1);
      et += ut[0], Z += ut[1];
    }
    if (a.push({
      type: "target",
      target: n,
      matrix: fn(M, u, q)
    }), E.length && (a.push({
      type: "offset",
      target: n,
      matrix: zt(u)
    }), a.push({
      type: "target",
      target: n,
      matrix: fn(Gr(E), u, q)
    })), Y) {
      var yt = n === t, mt = yt ? 0 : n.scrollLeft, dt = yt ? 0 : n.scrollTop;
      a.push({
        type: "offset",
        target: n,
        matrix: yr([
          et - mt + T - A,
          Z - dt + k - O
        ], u)
      });
    } else
      a.push({
        type: "offset",
        target: n,
        origin: q
      });
    if (it !== 1 && a.push({
      type: "zoom",
      target: n,
      matrix: fn(lo([it, it], u), u, [0, 0])
    }), d || (d = M), c || (c = q), f || (f = V), s || w)
      break;
    n = D, o = _, (!r || n === i) && (s = o);
  }
  return d || (d = zt(u)), c || (c = [0, 0]), f || (f = [0, 0]), {
    zoom: m,
    offsetContainer: h,
    matrixes: a,
    targetMatrix: d,
    transformOrigin: c,
    targetOrigin: f,
    is3d: l,
    hasFixed: v
  };
}
var fr = null, dr = null, Nr = null;
function Wr(t) {
  t ? (window.Map && (fr = /* @__PURE__ */ new Map(), dr = /* @__PURE__ */ new Map()), Nr = []) : (fr = null, Nr = null, dr = null);
}
function jp(t) {
  var e = dr == null ? void 0 : dr.get(t);
  if (e)
    return e;
  var r = dn(t, !0);
  return dr && dr.set(t, r), r;
}
function zp(t, e) {
  if (Nr) {
    var r = ye(Nr, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (r)
      return r[1];
  }
  var n = mu(t, e, !0);
  return Nr && Nr.push([[t, e], n]), n;
}
function he(t) {
  var e = fr == null ? void 0 : fr.get(t);
  if (!e) {
    var r = Ee(t).getComputedStyle(t);
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
function Oe(t, e, r) {
  var n = r.originalDatas;
  n.groupable = n.groupable || {};
  var a = n.groupable;
  a.childDatas = a.childDatas || [];
  var i = a.childDatas;
  return t.moveables.map(function(o, s) {
    return i[s] = i[s] || {}, i[s][e] = i[s][e] || {}, P(P({}, r), { isRequestChild: !0, datas: i[s][e], originalDatas: i[s] });
  });
}
function ai(t, e, r, n, a, i, o) {
  var s = !!r.match(/Start$/g), l = !!r.match(/End$/g), u = a.isPinch, c = a.datas, f = Oe(t, e.name, a), d = t.moveables, v = [], h = f.map(function(m, x) {
    var y = d[x], S = y.state, w = S.gestos, E = m;
    if (s)
      E = new Lr(o).dragStart(n, m), v.push(E);
    else {
      if (w[o] || (w[o] = c.childGestos[x]), !w[o])
        return;
      E = _n(m, S, n, u, i, o), v.push(E);
    }
    var M = e[r](y, P(P({}, E), { parentFlag: !0 }));
    return l && (w[o] = null), M;
  });
  return s && (c.childGestos = d.map(function(m) {
    return m.state.gestos[o];
  })), {
    eventParams: h,
    childEvents: v
  };
}
function qe(t, e, r, n, a, i) {
  a === void 0 && (a = function(c, f) {
    return f;
  });
  var o = !!r.match(/End$/g), s = Oe(t, e.name, n), l = t.moveables, u = s.map(function(c, f) {
    var d = l[f], v = c;
    v = a(d, c);
    var h = e[r](d, P(P({}, v), { parentFlag: !0 }));
    return o && (d.state.gestos = {}), h;
  });
  return u;
}
function ba(t, e, r, n) {
  var a = r.fixedDirection, i = r.fixedPosition, o = n.datas.startPositions || ke(e.state), s = ne(o, a), l = N(se(wn(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), u = l[0], c = l[1];
  return n.datas.originalX = u, n.datas.originalY = c, n;
}
function xu(t, e, r, n) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = Sr(t.props, e).zoom, u = cn(o / Math.PI * 180), c = {}, f = t.renderState;
  f.renderDirectionMap || (f.renderDirectionMap = {});
  var d = f.renderDirectionMap;
  r.forEach(function(h) {
    var m = h.dir;
    c[m] = !0;
  });
  var v = ue(s);
  return r.map(function(h) {
    var m = h.data, x = h.classNames, y = h.dir, S = go[y];
    if (!S || !c[y])
      return null;
    d[y] = !0;
    var w = (St(u, 15) + v * cu[y] + 720) % 180, E = {};
    return $r(m).forEach(function(M) {
      E["data-".concat(M)] = m[M];
    }), n.createElement("div", P({ className: ht.apply(void 0, Q(["control", "direction", y, e], N(x), !1)), "data-rotation": w, "data-direction": y }, E, { key: "direction-".concat(y), style: Ea.apply(void 0, Q([o, l], N(S.map(function(M) {
      return i[M];
    })), !1)) }));
  });
}
function yu(t, e, r, n) {
  var a = Sr(t.props, r), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? vo : o;
  return Q(Q([], N(s ? wu(t, n, r, l) : []), !1), N(xu(t, r, l.map(function(u) {
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
  var l = $t(r, n), u = e ? St(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: ht.apply(void 0, Q(["line", "direction", e ? "edge" : "", e], N(o), !1)), "data-rotation": u, "data-line-key": i, "data-direction": e, style: on(r, n, a, l) });
}
function bu(t, e, r, n, a) {
  var i = r === !0 ? ip : r;
  return i.map(function(o, s) {
    var l = N(go[o], 2), u = l[0], c = l[1];
    if (c != null)
      return yn(t, o, n[u], n[c], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function Su(t) {
  return function(e, r) {
    var n = Sr(e.props, t).edge;
    return n && (n === !0 || n.length) ? Q(Q([], N(bu(r, t, n, e.getState().renderPoses, e.props.zoom)), !1), N(Bp(e, t, r)), !1) : Cu(e, t, r);
  };
}
function Cu(t, e, r) {
  return yu(t, vo, e, r);
}
function Bp(t, e, r) {
  return yu(t, ["nw", "ne", "sw", "se"], e, r);
}
function wu(t, e, r, n) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, u = a.renderDirectionMap, c = t.props.zoom, f = ue(l), d = s / Math.PI * 180;
  return (n || $r(u)).map(function(v) {
    var h = go[v];
    if (!h)
      return null;
    var m = (St(d, 15) + f * cu[v] + 720) % 180, x = ["around-control"];
    return r && x.push("direction", r), e.createElement("div", { className: ht.apply(void 0, Q([], N(x), !1)), "data-rotation": m, "data-direction": v, key: "direction-around-".concat(v), style: Ea.apply(void 0, Q([s, c], N(h.map(function(y) {
      return o[y];
    })), !1)) });
  });
}
function yo(t, e, r) {
  var n = t || {}, a = n.position, i = a === void 0 ? "client" : a, o = n.left, s = o === void 0 ? -1 / 0 : o, l = n.top, u = l === void 0 ? -1 / 0 : l, c = n.right, f = c === void 0 ? 1 / 0 : c, d = n.bottom, v = d === void 0 ? 1 / 0 : d, h = {
    position: i,
    left: s,
    top: u,
    right: f,
    bottom: v
  };
  return {
    vertical: Ns(h, e, !0),
    horizontal: Ns(h, r, !1)
  };
}
function Na(t, e) {
  var r = t.state, n = r.containerClientRect, a = n.clientHeight, i = n.clientWidth, o = n.clientLeft, s = n.clientTop, l = r.snapOffset, u = l.left, c = l.top, f = l.right, d = l.bottom, v = e || t.props.bounds || {}, h = v.position || "client", m = h === "css", x = v.left, y = x === void 0 ? -1 / 0 : x, S = v.top, w = S === void 0 ? -1 / 0 : S, E = v.right, M = E === void 0 ? m ? -1 / 0 : 1 / 0 : E, D = v.bottom, _ = D === void 0 ? m ? -1 / 0 : 1 / 0 : D;
  return m && (M = i + f - u - M, _ = a + d - c - _), {
    left: y + u - o,
    right: M + u - o,
    top: w + c - s,
    bottom: _ + c - s
  };
}
function Gp(t, e, r) {
  var n = Na(t), a = n.left, i = n.top, o = n.right, s = n.bottom, l = N(r, 2), u = l[0], c = l[1], f = N(gt(r, e), 2), d = f[0], v = f[1];
  H(d) < fe && (d = 0), H(v) < fe && (v = 0);
  var h = v > 0, m = d > 0, x = {
    isBound: !1,
    offset: 0,
    pos: 0
  }, y = {
    isBound: !1,
    offset: 0,
    pos: 0
  };
  if (d === 0 && v === 0)
    return {
      vertical: x,
      horizontal: y
    };
  if (d === 0)
    h ? s < c && (y.pos = s, y.offset = c - s) : i > c && (y.pos = i, y.offset = c - i);
  else if (v === 0)
    m ? o < u && (x.pos = o, x.offset = u - o) : a > u && (x.pos = a, x.offset = u - a);
  else {
    var S = v / d, w = r[1] - S * u, E = 0, M = 0, D = !1;
    m && o <= u ? (E = S * o + w, M = o, D = !0) : !m && u <= a && (E = S * a + w, M = a, D = !0), D && (E < i || E > s) && (D = !1), D || (h && s <= c ? (E = s, M = (E - w) / S, D = !0) : !h && c <= i && (E = i, M = (E - w) / S, D = !0)), D && (x.isBound = !0, x.pos = M, x.offset = u - M, y.isBound = !0, y.pos = E, y.offset = c - E);
  }
  return {
    vertical: x,
    horizontal: y
  };
}
function Ns(t, e, r) {
  var n = t[r ? "left" : "top"], a = t[r ? "right" : "bottom"], i = Math.min.apply(Math, Q([], N(e), !1)), o = Math.max.apply(Math, Q([], N(e), !1)), s = [];
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
function As(t, e, r) {
  var n = r ? t.map(function(a) {
    return Cn(a, r);
  }) : t;
  return n.some(function(a) {
    return a[0] < e.left && H(a[0] - e.left) > 0.1 || a[0] > e.right && H(a[0] - e.right) > 0.1 || a[1] < e.top && H(a[1] - e.top) > 0.1 || a[1] > e.bottom && H(a[1] - e.bottom) > 0.1;
  });
}
function Fp(t, e, r) {
  var n = _e(t), a = Math.sqrt(n * n - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return H(i - t[r ? 0 : 1]) - H(o - t[r ? 0 : 1]);
  }).map(function(i) {
    return $t([0, 0], r ? [i, e] : [e, i]);
  });
}
function Lp(t, e, r, n, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = Na(t), s = o.left, l = o.top, u = o.right, c = o.bottom, f = s - n[0], d = u - n[0], v = l - n[1], h = c - n[1], m = {
    left: f,
    top: v,
    right: d,
    bottom: h
  };
  if (!As(r, m, 0))
    return [];
  var x = [];
  return [
    [f, 0],
    [d, 0],
    [v, 1],
    [h, 1]
  ].forEach(function(y) {
    var S = N(y, 2), w = S[0], E = S[1];
    r.forEach(function(M) {
      var D = $t([0, 0], M);
      x.push.apply(x, Q([], N(Fp(M, w, E).map(function(_) {
        return i + _ - D;
      }).filter(function(_) {
        return !As(e, m, _);
      }).map(function(_) {
        return St(_ * 180 / Math.PI, fe);
      })), !1));
    });
  }), x;
}
var Wp = ["left", "right", "center"], Yp = ["top", "bottom", "middle"], js = {
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
function Ar() {
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
function bo(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function Xp(t, e) {
  var r = bo(t), n = {};
  for (var a in r)
    a in e && r[a] && (n[a] = e[a]);
  return n;
}
function So(t, e) {
  var r = Xp(t, e), n = Yp.filter(function(i) {
    return i in r;
  }), a = Wp.filter(function(i) {
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
function Hp(t, e, r) {
  var n = Lt(t, [e.clientLeft, e.clientTop], r);
  return [
    e.left + n[0],
    e.top + n[1]
  ];
}
function $p(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  Math.abs(a) < Qt && (a = 0), Math.abs(i) < Qt && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * r[0] - r[1]) : (s = 1, l = -r[1]) : (o = -1, l = r[0]), [o, s, l].map(function(u) {
    return St(u, Qt);
  });
}
var Eu = "snapRotationThreshold", Du = "snapRotationDegrees", Mu = "snapHorizontalThreshold", _u = "snapVerticalThreshold";
function Aa(t, e, r, n, a, i, o) {
  var s;
  n === void 0 && (n = []), a === void 0 && (a = []);
  var l = t.props, u = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], c = Zs(o, l[Mu], 5), f = Zs(i, l[_u], 5);
  return ku(t.state.guidelines, e, r, n, a, c, f, u);
}
function ku(t, e, r, n, a, i, o, s) {
  return {
    vertical: Bs(t, "vertical", e, o * s[0], n),
    horizontal: Bs(t, "horizontal", r, i * s[1], a)
  };
}
function qp(t, e, r) {
  var n = N(r, 2), a = n[0], i = n[1], o = N(e, 2), s = o[0], l = o[1], u = N(gt(r, e), 2), c = u[0], f = u[1], d = f > 0, v = c > 0;
  c = Da(c), f = Da(f);
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
  var x = Aa(t, c ? [a] : [], f ? [i] : [], [], [], void 0, void 0), y = x.vertical, S = x.horizontal;
  y.posInfos.filter(function(W) {
    var Y = W.pos;
    return v ? Y >= s : Y <= s;
  }), S.posInfos.filter(function(W) {
    var Y = W.pos;
    return d ? Y >= l : Y <= l;
  }), y.isSnap = y.posInfos.length > 0, S.isSnap = S.posInfos.length > 0;
  var w = Bi(y), E = w.isSnap, M = w.guideline, D = Bi(S), _ = D.isSnap, g = D.guideline, T = _ ? g.pos[1] : 0, k = E ? M.pos[0] : 0;
  if (c === 0)
    _ && (m.isSnap = !0, m.pos = g.pos[1], m.offset = i - m.pos);
  else if (f === 0)
    E && (h.isSnap = !0, h.pos = k, h.offset = a - k);
  else {
    var A = f / c, O = r[1] - A * a, R = 0, j = 0, z = !1;
    E ? (j = k, R = A * j + O, z = !0) : _ && (R = T, j = (R - O) / A, z = !0), z && (h.isSnap = !0, h.pos = j, h.offset = a - j, m.isSnap = !0, m.pos = R, m.offset = i - R);
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
function zs(t, e, r, n) {
  var a = So(t.props.snapDirections, e), i = Aa(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return er(l);
  }), a.horizontalNames.map(function(l) {
    return er(l);
  }), r, n), o = er(a.horizontalNames[i.horizontal.index]), s = er(a.verticalNames[i.vertical.index]);
  return {
    vertical: P(P({}, i.vertical), { direction: s }),
    horizontal: P(P({}, i.horizontal), { direction: o })
  };
}
function Bi(t) {
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
function Bs(t, e, r, n, a) {
  var i, o;
  if (a === void 0 && (a = []), !t || !t.length)
    return {
      isSnap: !1,
      index: -1,
      direction: "",
      posInfos: []
    };
  var s = e === "vertical", l = s ? 0 : 1, u = r.map(function(f, d) {
    var v = a[d] || "", h = t.map(function(m) {
      var x = m.pos, y = f - x[l];
      return {
        offset: y,
        dist: H(y),
        guideline: m,
        direction: v
      };
    }).filter(function(m) {
      var x = m.guideline, y = m.dist, S = x.type;
      return !(S !== e || y > n);
    }).sort(function(m, x) {
      return m.dist - x.dist;
    });
    return {
      pos: f,
      index: d,
      guidelineInfos: h,
      direction: v
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
function Vp(t, e, r, n, a) {
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
  ].forEach(function(d, v, h) {
    var m = h[v + 1] || h[0];
    i.push(d), i.push([
      (d[0] + m[0]) / 2,
      (d[1] + m[1]) / 2
    ]);
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], r) : (i.push.apply(i, Q([], N(wp([
    [-1, -1],
    [1, -1],
    [-1, -1],
    [1, 1]
  ], r)), !1)), i.length > 1 && i.push([
    (i[0][0] + i[1][0]) / 2,
    (i[0][1] + i[1][1]) / 2
  ]));
  var o = i.map(function(d) {
    return ne(e, d);
  }), s = o.map(function(d) {
    return d[0];
  }), l = o.map(function(d) {
    return d[1];
  }), u = Aa(t, s, l, i.map(function(d) {
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
function Tu(t, e) {
  var r = H(t.offset), n = H(e.offset);
  return t.isBound && e.isBound ? n - r : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? n - r : t.isSnap ? -1 : e.isSnap || r < fe ? 1 : n < fe ? -1 : r - n;
}
function Sa(t, e) {
  return t.slice().sort(function(r, n) {
    var a = r.sign[e], i = n.sign[e], o = r.offset[e], s = n.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return Tu({ isBound: r.isBound, isSnap: r.isSnap, offset: o }, { isBound: n.isBound, isSnap: n.isSnap, offset: s });
  })[0];
}
function Up(t, e, r) {
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
function Iu(t, e) {
  var r = Ei([e[0][0], e[1][0]]), n = Ei([e[0][1], e[1][1]]);
  return {
    vertical: r <= t[0],
    horizontal: n <= t[1]
  };
}
function Co(t, e) {
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
function Ru(t, e, r, n) {
  return n === void 0 && (n = fe), t.every(function(a) {
    var i = Co(a, e), o = i <= 0;
    return o === r || H(i) <= n;
  });
}
function Gs(t, e, r, n, a) {
  return a === void 0 && (a = 0), n && e - a <= t || !n && t <= r + a ? {
    isBound: !0,
    offset: n ? e - t : r - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function Kp(t, e) {
  var r = e.line, n = e.centerSign, a = e.verticalSign, i = e.horizontalSign, o = e.lineConstants, s = t.props.innerBounds;
  if (!s)
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var l = s.left, u = s.top, c = s.width, f = s.height, d = [[l, u], [l, u + f]], v = [[l, u], [l + c, u]], h = [[l + c, u], [l + c, u + f]], m = [[l, u + f], [l + c, u + f]];
  if (Ru([
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
  var x = rr(r, o, v, a), y = rr(r, o, m, a), S = rr(r, o, d, i), w = rr(r, o, h, i), E = x.isBound && y.isBound, M = x.isBound || y.isBound, D = S.isBound && w.isBound, _ = S.isBound || w.isBound, g = Yr(x.offset, y.offset), T = Yr(S.offset, w.offset), k = [0, 0], A = !1, O = !1;
  return H(T) < H(g) ? (k = [g, 0], A = M, O = E) : (k = [0, T], A = _, O = D), {
    isAllBound: O,
    isVerticalBound: M,
    isHorizontalBound: _,
    isBound: A,
    offset: k
  };
}
function rr(t, e, r, n, a, i) {
  var o = N(e, 2), s = o[0], l = o[1], u = t[0], c = r[0], f = r[1], d = Da(f[1] - c[1]), v = Da(f[0] - c[0]), h = l, m = s, x = -s / l;
  if (v) {
    if (!d) {
      if (i && !h)
        return {
          isBound: !1,
          offset: 0
        };
      if (m) {
        var E = (c[1] - u[1]) / x + u[0];
        return Gs(E, c[0], f[0], n, a);
      } else {
        var S = c[1] - u[1], w = H(S) <= (a || 0);
        return {
          isBound: w,
          offset: w ? S : 0
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
      return Gs(y, c[1], f[1], n, a);
    } else {
      var S = c[0] - u[0], w = H(S) <= (a || 0);
      return {
        isBound: w,
        offset: w ? S : 0
      };
    }
  }
  return {
    isBound: !1,
    offset: 0
  };
}
function Pu(t, e, r) {
  return e.map(function(n) {
    var a = Kp(t, n), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, u = n.multiple, c = Le({
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
function Zp(t, e, r) {
  var n, a = wo(t, e, [0, 0], !1).map(function(d) {
    return P(P({}, d), { multiple: d.multiple.map(function(v) {
      return H(v) * 2;
    }) });
  }), i = Pu(t, a, r), o = Sa(i, 0), s = Sa(i, 1), l = 0, u = 0, c = o.isVerticalBound || s.isVerticalBound, f = o.isHorizontalBound || s.isHorizontalBound;
  return (c || f) && (n = N(Sp({
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
function Jp(t, e) {
  var r = [], n = t[0], a = t[1];
  return n && a ? r.push([[0, a * 2], t, [-n, a]], [[n * 2, 0], t, [n, -a]]) : n ? (r.push([[n * 2, 0], [n, 1], [n, -1]]), e && r.push([[0, -1], [n, -1], [-n, -1]], [[0, 1], [n, 1], [-n, 1]])) : a ? (r.push([[0, a * 2], [1, a], [-1, a]]), e && r.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : r.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), r;
}
function wo(t, e, r, n) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = wr(i, 100, 100, o ? 4 : 3), l = ne(s, [0, 0]);
  return Jp(r, n).map(function(u) {
    var c = N(u, 3), f = c[0], d = c[1], v = c[2], h = [
      ne(s, d),
      ne(s, v)
    ], m = $p(h), x = Iu(l, h), y = x.vertical, S = x.horizontal, w = Co(l, h) <= 0;
    return {
      multiple: f,
      centerSign: w,
      verticalSign: y,
      horizontalSign: S,
      lineConstants: m,
      line: [
        ne(e, d),
        ne(e, v)
      ]
    };
  });
}
function Fs(t, e, r, n) {
  var a = n ? t.map(function(i) {
    return Cn(i, n);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = Co(r, i) <= 0;
    return !Ru(e, i, o);
  });
}
function Qp(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  if (!a)
    return H(r[0]);
  if (!i)
    return H(r[1]);
  var o = i / a;
  return H((-o * r[0] + r[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function tv(t) {
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
function ev(t, e, r, n, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, u = i.width, c = i.height, f = s - n[0], d = s + u - n[0], v = l - n[1], h = l + c - n[1], m = [
    [f, v],
    [d, v],
    [f, h],
    [d, h]
  ], x = ne(r, [0, 0]);
  if (!Fs(r, m, x, 0))
    return [];
  var y = [], S = m.map(function(w) {
    return [
      _e(w),
      $t([0, 0], w)
    ];
  });
  return [
    [r[0], r[1]],
    [r[1], r[3]],
    [r[3], r[2]],
    [r[2], r[0]]
  ].forEach(function(w) {
    var E = $t([0, 0], tv(w)), M = Qp(w);
    y.push.apply(y, Q([], N(S.filter(function(D) {
      var _ = N(D, 1), g = _[0];
      return g && M <= g;
    }).map(function(D) {
      var _ = N(D, 2), g = _[0], T = _[1], k = Math.acos(g ? M / g : 0), A = T + k, O = T - k;
      return [
        o + A - E,
        o + O - E
      ];
    }).reduce(function(D, _) {
      return D.push.apply(D, Q([], N(_), !1)), D;
    }, []).filter(function(D) {
      return !Fs(e, m, x, D);
    }).map(function(D) {
      return St(D * 180 / Math.PI, fe);
    })), !1));
  }), y;
}
function rv(t) {
  var e = t.props.innerBounds, r = Ar();
  if (!e)
    return {
      boundMap: r,
      vertical: [],
      horizontal: []
    };
  var n = t.getRect(), a = n.pos1, i = n.pos2, o = n.pos3, s = n.pos4, l = [a, i, o, s], u = ne(l, [0, 0]), c = e.left, f = e.top, d = e.width, v = e.height, h = [[c, f], [c, f + v]], m = [[c, f], [c + d, f]], x = [[c + d, f], [c + d, f + v]], y = [[c, f + v], [c + d, f + v]], S = wo(t, l, [0, 0], !1), w = [], E = [];
  return S.forEach(function(M) {
    var D = M.line, _ = M.lineConstants, g = Iu(u, D), T = g.horizontal, k = g.vertical, A = rr(D, _, m, k, 1, !0), O = rr(D, _, y, k, 1, !0), R = rr(D, _, h, T, 1, !0), j = rr(D, _, x, T, 1, !0);
    A.isBound && !r.top && (w.push(f), r.top = !0), O.isBound && !r.bottom && (w.push(f + v), r.bottom = !0), R.isBound && !r.left && (E.push(c), r.left = !0), j.isBound && !r.right && (E.push(c + d), r.right = !0);
  }), {
    boundMap: r,
    horizontal: w,
    vertical: E
  };
}
function nv(t, e, r, n) {
  var a = e[0] - t[0], i = e[1] - t[1];
  if (H(a) < Qt && (a = 0), H(i) < Qt && (i = 0), !a)
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
function Gi(t, e, r, n, a) {
  var i = nv(t, e, r, n);
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
function Ca(t, e) {
  return t.isBound ? t.offset : e.isSnap ? Bi(e).offset : 0;
}
function av(t, e, r, n, a) {
  var i = N(e, 2), o = i[0], s = i[1], l = N(r, 2), u = l[0], c = l[1], f = N(n, 2), d = f[0], v = f[1], h = N(a, 2), m = h[0], x = h[1], y = -m, S = -x;
  if (t && o && s) {
    y = 0, S = 0;
    var w = [];
    if (u && c ? w.push([0, x], [m, 0]) : u ? w.push([m, 0]) : c ? w.push([0, x]) : d && v ? w.push([0, x], [m, 0]) : d ? w.push([m, 0]) : v && w.push([0, x]), w.length) {
      w.sort(function(_, g) {
        return _e(gt([o, s], _)) - _e(gt([o, s], g));
      });
      var E = w[0];
      if (E[0] && H(o) > Qt)
        y = -E[0], S = s * H(o + y) / H(o) - s;
      else if (E[1] && H(s) > Qt) {
        var M = s;
        S = -E[1], y = o * H(s + S) / H(M) - o;
      }
      if (t && c && u)
        if (H(y) > Qt && H(y) < H(m)) {
          var D = H(m) / H(y);
          y *= D, S *= D;
        } else if (H(S) > Qt && H(S) < H(x)) {
          var D = H(x) / H(S);
          y *= D, S *= D;
        } else
          y = Yr(-m, y), S = Yr(-x, S);
    }
  } else
    y = o || u ? -m : 0, S = s || c ? -x : 0;
  return [y, S];
}
function iv(t, e, r, n, a, i) {
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
  var o = Mo(i.absolutePoses, [e, r]), s = De(o), l = s.left, u = s.right, c = s.top, f = s.bottom, d = {
    horizontal: o.map(function(j) {
      return j[1];
    }),
    vertical: o.map(function(j) {
      return j[0];
    })
  }, v = bo(t.props.snapDirections), h = So(v, {
    left: l,
    right: u,
    top: c,
    bottom: f,
    center: (l + u) / 2,
    middle: (c + f) / 2
  }), m = ja(t, a, h, d), x = m.vertical, y = m.horizontal, S = Zp(t, o, i), w = S.vertical, E = S.horizontal, M = x.isSnap, D = y.isSnap, _ = x.isBound || w.isBound, g = y.isBound || E.isBound, T = Yr(x.offset, w.offset), k = Yr(y.offset, E.offset), A = N(av(n, [e, r], [_, g], [M, D], [T, k]), 2), O = A[0], R = A[1];
  return [
    {
      isBound: _,
      isSnap: M,
      offset: O
    },
    {
      isBound: g,
      isSnap: D,
      offset: R
    }
  ];
}
function ja(t, e, r, n) {
  n === void 0 && (n = r);
  var a = yo(Na(t), n.vertical, n.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : Aa(t, r.vertical, r.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, u = s.vertical, c = Ca(i[0], l), f = Ca(o[0], u), d = H(c), v = H(f);
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
      dist: v,
      bounds: o,
      snap: u
    }
  };
}
function Ls(t, e, r, n, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = yo(e, r, n), l = s.horizontal, u = s.vertical, c = ku(t, r, n, [], [], a, i, o), f = c.horizontal, d = c.vertical, v = Ca(l[0], f), h = Ca(u[0], d), m = H(v), x = H(h);
  return {
    horizontal: {
      isBound: l[0].isBound,
      isSnap: f.isSnap,
      snapIndex: f.index,
      offset: v,
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
function ov(t, e, r, n) {
  var a = $t(t, e) / Math.PI * 180, i = r.vertical, o = i.isBound, s = i.isSnap, l = i.dist, u = r.horizontal, c = u.isBound, f = u.isSnap, d = u.dist, v = a % 180, h = v < 3 || v > 177, m = v > 87 && v < 93;
  return d < l && (o || s && !m && (!n || !h)) ? "vertical" : c || f && !h && (!n || !m) ? "horizontal" : "";
}
function sv(t, e, r, n, a, i) {
  return r.map(function(o) {
    var s = N(o, 2), l = s[0], u = s[1], c = ne(e, l), f = ne(e, u), d = n ? lv(t, c, f, a) : ja(t, a, {
      vertical: [f[0]],
      horizontal: [f[1]]
    }), v = d.horizontal, h = v.offset, m = v.isBound, x = v.isSnap, y = d.vertical, S = y.offset, w = y.isBound, E = y.isSnap, M = gt(u, l);
    if (!S && !h)
      return {
        isBound: w || m,
        isSnap: E || x,
        sign: M,
        offset: [0, 0]
      };
    var D = ov(c, f, d, n);
    if (!D)
      return {
        sign: M,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var _ = D === "vertical", g = [0, 0];
    return !n && H(u[0]) === 1 && H(u[1]) === 1 && l[0] !== u[0] && l[1] !== u[1] ? g = Le({
      datas: i,
      distX: -S,
      distY: -h
    }) : g = Gi(c, f, -(_ ? S : h), _, i).offset, g = g.map(function(T, k) {
      return T * (M[k] ? 2 / M[k] : 0);
    }), {
      sign: M,
      isBound: _ ? w : m,
      isSnap: _ ? E : x,
      offset: g
    };
  });
}
function Ws(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function lv(t, e, r, n) {
  var a = Gp(t, e, r), i = a.horizontal, o = a.vertical, s = n ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : qp(t, e, r), l = s.horizontal, u = s.vertical, c = Ws(i, l), f = Ws(o, u), d = H(c), v = H(f);
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
      dist: v
    }
  };
}
function uv(t, e, r, n, a) {
  var i = [-r[0], -r[1]], o = t.state, s = o.width, l = o.height, u = t.props.bounds, c = 1 / 0, f = 1 / 0;
  if (u) {
    var d = [
      [r[0], -r[1]],
      [-r[0], r[1]]
    ], v = u.left, h = v === void 0 ? -1 / 0 : v, m = u.top, x = m === void 0 ? -1 / 0 : m, y = u.right, S = y === void 0 ? 1 / 0 : y, w = u.bottom, E = w === void 0 ? 1 / 0 : w;
    d.forEach(function(M) {
      var D = M[0] !== i[0], _ = M[1] !== i[1], g = ne(e, M), T = $t(n, g) * 360 / Math.PI;
      if (_) {
        var k = g.slice();
        (H(T - 360) < 2 || H(T - 180) < 2) && (k[1] = n[1]);
        var A = Gi(n, k, (n[1] < g[1] ? E : x) - g[1], !1, a), O = N(A.offset, 2), R = O[1], j = A.isOutside;
        isNaN(R) || (f = l + (j ? 1 : -1) * H(R));
      }
      if (D) {
        var k = g.slice();
        (H(T - 90) < 2 || H(T - 270) < 2) && (k[0] = n[0]);
        var z = Gi(n, k, (n[0] < g[0] ? S : h) - g[0], !0, a), W = N(z.offset, 1), Y = W[0], L = z.isOutside;
        isNaN(Y) || (c = s + (L ? 1 : -1) * H(Y));
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
    var c = _e(u), f = $t(u, [0, 0]);
    return [e.createElement("div", { className: ht("line", "horizontal", "dragline", "dashed"), key: "dragRotateGuideline", style: {
      width: "".concat(c, "px"),
      transform: "translate(".concat(l[0], "px, ").concat(l[1], "px) rotate(").concat(f, "rad) scaleY(").concat(i, ")")
    } })];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.parentEvent, a = e.parentGesto, i = t.state, o = i.gestos, s = i.style;
    if (o.draggable)
      return !1;
    o.draggable = a || t.targetGesto, r.datas = {}, r.left = parseFloat(s.left || "") || 0, r.top = parseFloat(s.top || "") || 0, r.bottom = parseFloat(s.bottom || "") || 0, r.right = parseFloat(s.right || "") || 0, r.startValue = [0, 0], Cr(t, e), Oa(t, e, "translate"), kv(t, r), r.prevDist = [0, 0], r.prevBeforeDist = [0, 0], r.isDrag = !1, r.deltaOffset = [0, 0];
    var l = wt(t, e, P({ set: function(c) {
      r.startValue = c;
    } }, Pa(t, e))), u = n || ct(t, "onDragStart", l);
    return u !== !1 ? (r.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, r.isPinch = !1), r.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      Ia(t, e, "translate");
      var r = e.datas, n = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, u = e.isGroup, c = e.parentThrottleDrag, f = e.distX, d = e.distY, v = r.isDrag, h = r.prevDist, m = r.prevBeforeDist, x = r.startValue;
      if (v) {
        o && (f += o[0], d += o[1]);
        var y = t.props, S = y.parentMoveable, w = u ? 0 : y.throttleDrag || c || 0, E = n ? 0 : y.throttleDragRotate || 0, M = 0, D = !1, _ = !1, g = !1, T = !1;
        if (!n && E > 0 && (f || d)) {
          var k = y.startDragRotate || 0, A = St(k + $t([0, 0], [f, d]) * 180 / Math.PI, E) - k, O = d * Math.abs(Math.cos((A - 90) / 180 * Math.PI)), R = f * Math.abs(Math.cos(A / 180 * Math.PI)), j = _e([R, O]);
          M = A * Math.PI / 180, f = j * Math.cos(M), d = j * Math.sin(M);
        }
        if (!i && !n && !a) {
          var z = N(iv(t, f, d, E, !s && l || o, r), 2), W = z[0], Y = z[1];
          D = W.isSnap, _ = W.isBound, g = Y.isSnap, T = Y.isBound;
          var L = W.offset, q = Y.offset;
          f += L, d += q;
        }
        var V = It(pu({ datas: r, distX: f, distY: d }), x), F = It(bp({ datas: r, distX: f, distY: d }), x);
        Ts(F, fe), Ts(V, fe), E || (!D && !_ && (F[0] = St(F[0], w), V[0] = St(V[0], w)), !g && !T && (F[1] = St(F[1], w), V[1] = St(V[1], w)));
        var rt = gt(V, x), et = gt(F, x), Z = gt(et, h), it = gt(rt, m);
        r.prevDist = et, r.prevBeforeDist = rt, r.passDelta = Z, r.passDist = et;
        var tt = r.left + rt[0], st = r.top + rt[1], nt = r.right - rt[0], pt = r.bottom - rt[1], Ct = Ra(r, "translate(".concat(F[0], "px, ").concat(F[1], "px)"), "translate(".concat(et[0], "px, ").concat(et[1], "px)"));
        if (mo(e, Ct), t.state.dragInfo.dist = n ? [0, 0] : et, !(!n && !S && Z.every(function(dt) {
          return !dt;
        }) && it.some(function(dt) {
          return !dt;
        }))) {
          var U = t.state, ut = U.width, yt = U.height, mt = wt(t, e, P({ transform: Ct, dist: et, delta: Z, translate: F, beforeDist: rt, beforeDelta: it, beforeTranslate: V, left: tt, top: st, right: nt, bottom: pt, width: ut, height: yt, isPinch: i }, ce({
            transform: Ct
          }, e)));
          return !n && ct(t, "onDrag", mt), mt;
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
      var a = be(t, e, {});
      return !r && ct(t, "onDragEnd", a), a;
    }
  },
  dragGroupStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = this.dragStart(t, e);
    if (!s)
      return !1;
    var l = ai(t, this, "dragStart", [
      i || 0,
      o || 0
    ], e, !1, "draggable"), u = l.childEvents, c = l.eventParams, f = P(P({}, s), { targets: t.props.targets, events: c }), d = ct(t, "onDragGroupStart", f);
    a.isDrag = d !== !1;
    var v = (n = (r = u[0]) === null || r === void 0 ? void 0 : r.datas.startValue) !== null && n !== void 0 ? n : [0, 0];
    return a.throttleOffset = [v[0] % 1, v[1] % 1], a.isDrag ? s : !1;
  },
  dragGroup: function(t, e) {
    var r = e.datas;
    if (r.isDrag) {
      var n = this.drag(t, P(P({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = ai(t, this, "drag", a, e, !1, "draggable").eventParams;
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
      var a = ai(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
      return ct(t, "onDragGroupEnd", be(t, e, {
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
function Ou(t, e) {
  var r = ne(t, e), n = [0, 0];
  return {
    fixedPosition: r,
    fixedDirection: e,
    fixedOffset: n
  };
}
function cv(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = [
    a / 2 * (1 + e[0]),
    i / 2 * (1 + e[1])
  ], l = Lt(r, s, o), u = [0, 0];
  return {
    fixedPosition: l,
    fixedDirection: e,
    fixedOffset: u
  };
}
function Nu(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = kp(e, a, i), l = Lt(r, e, o), u = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: u
  };
}
var Ys = To("resizable"), Fi = {
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
  render: Su("resizable"),
  dragControlCondition: Ys,
  viewClassName: ko("resizable"),
  dragControlStart: function(t, e) {
    var r, n = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, u = e.parentFixedDirection, c = e.parentEvent, f = qu(o, a, n, l), d = t.state, v = d.target, h = d.width, m = d.height, x = d.gestos;
    if (!f || !v || x.resizable)
      return !1;
    x.resizable = s || t.controlGesto, !a && Cr(t, e), l.datas = {}, l.direction = f, l.startOffsetWidth = h, l.startOffsetHeight = m, l.prevWidth = 0, l.prevHeight = 0, l.minSize = [0, 0], l.startWidth = d.inlineCSSWidth || d.cssWidth, l.startHeight = d.inlineCSSHeight || d.cssHeight, l.maxSize = [1 / 0, 1 / 0], i || (l.minSize = [
      d.minOffsetWidth,
      d.minOffsetHeight
    ], l.maxSize = [
      d.maxOffsetWidth,
      d.maxOffsetHeight
    ]);
    var y = t.props.transformOrigin || "% %";
    l.transformOrigin = Me(y) ? y.split(" ") : y, l.startOffsetMatrix = d.offsetMatrix, l.startTransformOrigin = d.transformOrigin, l.isWidth = (r = e == null ? void 0 : e.parentIsWidth) !== null && r !== void 0 ? r : !f[0] && !f[1] || f[0] || !f[1];
    function S(T) {
      l.ratio = T && isFinite(T) ? T : 0;
    }
    l.startPositions = ke(t.state);
    function w(T) {
      var k = Ou(l.startPositions, T);
      l.fixedDirection = k.fixedDirection, l.fixedPosition = k.fixedPosition, l.fixedOffset = k.fixedOffset;
    }
    function E(T) {
      var k = Nu(t.state, T);
      l.fixedDirection = k.fixedDirection, l.fixedPosition = k.fixedPosition, l.fixedOffset = k.fixedOffset;
    }
    function M(T) {
      l.minSize = [
        Nt("".concat(T[0]), 0) || 0,
        Nt("".concat(T[1]), 0) || 0
      ];
    }
    function D(T) {
      var k = [
        T[0] || 1 / 0,
        T[1] || 1 / 0
      ];
      (!gn(k[0]) || isFinite(k[0])) && (k[0] = Nt("".concat(k[0]), 0) || 1 / 0), (!gn(k[1]) || isFinite(k[1])) && (k[1] = Nt("".concat(k[1]), 0) || 1 / 0), l.maxSize = k;
    }
    S(h / m), w(u || [-f[0], -f[1]]), l.setFixedDirection = w, l.setFixedPosition = E, l.setMin = M, l.setMax = D;
    var _ = wt(t, e, {
      direction: f,
      startRatio: l.ratio,
      set: function(T) {
        var k = N(T, 2), A = k[0], O = k[1];
        l.startWidth = A, l.startHeight = O;
      },
      setMin: M,
      setMax: D,
      setRatio: S,
      setFixedDirection: w,
      setFixedPosition: E,
      setOrigin: function(T) {
        l.transformOrigin = T;
      },
      dragStart: le.dragStart(t, new Lr().dragStart([0, 0], e))
    }), g = c || ct(t, "onResizeStart", _);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, g !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: f
    }), l.isResize ? _ : !1;
  },
  dragControl: function(t, e) {
    var r, n = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, u = e.useSnap, c = e.isRequest, f = e.isGroup, d = e.parentEvent, v = e.resolveMatrix, h = n.isResize, m = n.transformOrigin, x = n.startWidth, y = n.startHeight, S = n.prevWidth, w = n.prevHeight, E = n.minSize, M = n.maxSize, D = n.ratio, _ = n.startOffsetWidth, g = n.startOffsetHeight, T = n.isWidth;
    if (!h)
      return;
    if (v) {
      var k = t.state.is3d, A = n.startOffsetMatrix, O = n.startTransformOrigin, R = k ? 4 : 3, j = Gr(ya(e)), z = Math.sqrt(j.length);
      R !== z && (j = Ae(j, z, R));
      var W = kn(A, j, O, R), Y = wr(W, _, g, R);
      n.startPositions = Y, n.nextTargetMatrix = j, n.nextAllMatrix = W;
    }
    var L = Sr(t.props, "resizable"), q = L.resizeFormat, V = L.throttleResize, F = V === void 0 ? a ? 0 : 1 : V, rt = L.parentMoveable, et = L.keepRatioFinally, Z = n.direction, it = Z, tt = 0, st = 0;
    !Z[0] && !Z[1] && (it = [1, 1]);
    var nt = D && (o ?? L.keepRatio) || !1;
    function pt() {
      var Rt = n.fixedDirection, jt = Qu(it, nt, n, e);
      tt = jt.distWidth, st = jt.distHeight;
      var je = it[0] - Rt[0] || nt ? Math.max(_ + tt, fe) : _, Te = it[1] - Rt[1] || nt ? Math.max(g + st, fe) : g;
      return nt && _ && g && (T ? Te = je / D : je = Te * D), [je, Te];
    }
    var Ct = N(pt(), 2), U = Ct[0], ut = Ct[1];
    d || (n.setFixedDirection(n.fixedDirection), ct(t, "onBeforeResize", wt(t, e, {
      startFixedDirection: n.startFixedDirection,
      startFixedPosition: n.startFixedPosition,
      setFixedDirection: function(Rt) {
        var jt;
        return n.setFixedDirection(Rt), jt = N(pt(), 2), U = jt[0], ut = jt[1], [U, ut];
      },
      setFixedPosition: function(Rt) {
        var jt;
        return n.setFixedPosition(Rt), jt = N(pt(), 2), U = jt[0], ut = jt[1], [U, ut];
      },
      boundingWidth: U,
      boundingHeight: ut,
      setSize: function(Rt) {
        var jt;
        jt = N(Rt, 2), U = jt[0], ut = jt[1];
      }
    }, !0)));
    var yt = s;
    s || (!a && i ? yt = Pp(t, [0, 0]) : yt = n.fixedPosition);
    var mt = [0, 0];
    i || (mt = Mv(t, U, ut, Z, yt, !u && c, n)), l && (!l[0] && (mt[0] = 0), !l[1] && (mt[1] = 0));
    function dt() {
      var Rt;
      q && (Rt = N(q([U, ut]), 2), U = Rt[0], ut = Rt[1]), U = St(U, F), ut = St(ut, F);
    }
    if (nt) {
      it[0] && it[1] && mt[0] && mt[1] && (H(mt[0]) > H(mt[1]) ? mt[1] = 0 : mt[0] = 0);
      var bt = !mt[0] && !mt[1];
      bt && dt(), it[0] && !it[1] || mt[0] && !mt[1] || bt && T ? (U += mt[0], ut = U / D) : (!it[0] && it[1] || !mt[0] && mt[1] || bt && !T) && (ut += mt[1], U = ut * D);
    } else
      U += mt[0], ut += mt[1], U = Math.max(0, U), ut = Math.max(0, ut);
    r = N(io([U, ut], E, M, nt ? D : !1), 2), U = r[0], ut = r[1], dt(), nt && (f || et) && (T ? ut = U / D : U = ut * D), tt = U - _, st = ut - g;
    var xt = [tt - S, st - w];
    n.prevWidth = tt, n.prevHeight = st;
    var kt = Rp(t, U, ut, yt, m, n);
    if (!(!rt && xt.every(function(Rt) {
      return !Rt;
    }) && kt.every(function(Rt) {
      return !Rt;
    }))) {
      var vt = le.drag(t, _n(e, t.state, kt, !!i, !1, "draggable")), Mt = vt.transform, Ft = x + tt, qt = y + st, Bt = wt(t, e, P({ width: Ft, height: qt, offsetWidth: Math.round(U), offsetHeight: Math.round(ut), startRatio: D, boundingWidth: U, boundingHeight: ut, direction: Z, dist: [tt, st], delta: xt, isPinch: !!i, drag: vt }, Uu({
        style: {
          width: "".concat(Ft, "px"),
          height: "".concat(qt, "px")
        },
        transform: Mt
      }, vt, e)));
      return !d && ct(t, "onResize", Bt), Bt;
    }
  },
  dragControlAfter: function(t, e) {
    var r = e.datas, n = r.isResize, a = r.startOffsetWidth, i = r.startOffsetHeight, o = r.prevWidth, s = r.prevHeight;
    if (!(!n || t.props.checkResizableError === !1)) {
      var l = t.state, u = l.width, c = l.height, f = u - (a + o), d = c - (i + s), v = H(f) > 3, h = H(d) > 3;
      if (v && (r.startWidth += f, r.startOffsetWidth += f, r.prevWidth += f), h && (r.startHeight += d, r.startOffsetHeight += d, r.prevHeight += d), v || h)
        return this.dragControl(t, e);
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.parentEvent;
    if (r.isResize) {
      r.isResize = !1;
      var a = be(t, e, {});
      return !n && ct(t, "onResizeEnd", a), a;
    }
  },
  dragGroupControlCondition: Ys,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, P(P({}, e), { isGroup: !0 }));
    if (!n)
      return !1;
    var a = Oe(t, "resizable", e), i = r.startOffsetWidth, o = r.startOffsetHeight;
    function s() {
      var v = r.minSize;
      a.forEach(function(h) {
        var m = h.datas, x = m.minSize, y = m.startOffsetWidth, S = m.startOffsetHeight, w = i * (y ? x[0] / y : 0), E = o * (S ? x[1] / S : 0);
        v[0] = Math.max(v[0], w), v[1] = Math.max(v[1], E);
      });
    }
    function l() {
      var v = r.maxSize;
      a.forEach(function(h) {
        var m = h.datas, x = m.maxSize, y = m.startOffsetWidth, S = m.startOffsetHeight, w = i * (y ? x[0] / y : 0), E = o * (S ? x[1] / S : 0);
        v[0] = Math.min(v[0], w), v[1] = Math.min(v[1], E);
      });
    }
    var u = qe(t, this, "dragControlStart", e, function(v, h) {
      return ba(t, v, r, h);
    });
    s(), l();
    var c = function(v) {
      n.setFixedDirection(v), u.forEach(function(h, m) {
        h.setFixedDirection(v), ba(t, h.moveable, r, a[m]);
      });
    };
    r.setFixedDirection = c;
    var f = P(P({}, n), { targets: t.props.targets, events: u.map(function(v) {
      return P(P({}, v), { setMin: function(h) {
        v.setMin(h), s();
      }, setMax: function(h) {
        v.setMax(h), l();
      } });
    }), setFixedDirection: c, setMin: function(v) {
      n.setMin(v), s();
    }, setMax: function(v) {
      n.setMax(v), l();
    } }), d = ct(t, "onResizeGroupStart", f);
    return r.isResize = d !== !1, r.isResize ? n : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isResize) {
      var n = Sr(t.props, "resizable");
      Ba(t, "onBeforeResize", function(v) {
        ct(t, "onBeforeResizeGroup", wt(t, e, P(P({}, v), { targets: n.targets }), !0));
      });
      var a = this.dragControl(t, P(P({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = n.keepRatio, u = [
          i / (i - s[0]),
          o / (o - s[1])
        ], c = r.fixedPosition, f = qe(t, this, "dragControl", e, function(v, h) {
          var m = N(se(wn(t.rotation / 180 * Math.PI, 3), [
            h.datas.originalX * u[0],
            h.datas.originalY * u[1],
            1
          ], 3), 2), x = m[0], y = m[1];
          return P(P({}, h), { parentDist: null, parentScale: u, dragClient: It(c, [x, y]), parentKeepRatio: l });
        }), d = P({ targets: n.targets, events: f }, a);
        return ct(t, "onResizeGroup", d), d;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isResize) {
      this.dragControlEnd(t, e);
      var a = qe(t, this, "dragControlEnd", e), i = be(t, e, {
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
function ii(t, e, r, n, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, u = Lt(
    t.state.rootMatrix,
    // TO-DO #710
    gt([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), c = It([a.left, a.top], u);
  e.startAbsoluteOrigin = c, e.prevDeg = $t(c, [r, n]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = Ge(c, [r, n]);
}
function da(t, e, r) {
  var n = r.defaultDeg, a = r.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - n);
  return r.prevDeg = n + s, s;
}
function oi(t, e, r, n) {
  return da($t(n.startAbsoluteOrigin, [t, e]) / Math.PI * 180, r, n);
}
function si(t, e, r, n, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = r.prevSnapDeg, u = 0, c = !1;
  if (i) {
    var f = Dv(t, e, n, a + n);
    c = f.isSnap, u = a + f.dist;
  }
  c || (u = St(a + n, s));
  var d = u - a;
  return r.prevSnapDeg = d, [d - l, d, u];
}
function Au(t, e, r) {
  var n = N(e, 4), a = n[0], i = n[1], o = n[2], s = n[3];
  if (t === "none")
    return [];
  if (Ht(t))
    return t.map(function(x) {
      return Au(x, [a, i, o, s], r)[0];
    });
  var l = N((t || "top").split("-"), 2), u = l[0], c = l[1], f = [a, i];
  u === "left" ? f = [o, a] : u === "right" ? f = [i, s] : u === "bottom" && (f = [s, o]);
  var d = [
    (f[0][0] + f[1][0]) / 2,
    (f[0][1] + f[1][1]) / 2
  ], v = Hu(f, r);
  if (c) {
    var h = c === "top" || c === "left", m = u === "bottom" || u === "left";
    d = f[h && !m || !h && m ? 0 : 1];
  }
  return [[d, v]];
}
function Li(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var r = e.inputEvent.target;
  if (te(r, ht("rotation-control")) || t.props.rotateAroundControls && te(r, ht("around-control")) || te(r, ht("control")) && te(r, ht("rotatable")))
    return !0;
  var n = t.props.rotationTarget;
  return n ? Io(n, !0).some(function(a) {
    return a ? r === a || r.contains(a) : !1;
  }) : !1;
}
var fv = `.rotation {
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
`, dv = {
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
  css: [fv],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? ht("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var r = Sr(t.props, "rotatable"), n = r.rotatable, a = r.rotationPosition, i = r.zoom, o = r.renderDirections, s = r.rotateAroundControls, l = r.resolveAblesWithRotatable, u = t.getState(), c = u.renderPoses, f = u.direction;
    if (!n)
      return null;
    var d = Au(a, c, f), v = [];
    if (d.forEach(function(y, S) {
      var w = N(y, 2), E = w[0], M = w[1];
      v.push(e.createElement(
        "div",
        { key: "rotation".concat(S), className: ht("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(E[0], "px, ").concat(E[1], "px) rotate(").concat(M, "rad)")
        } },
        e.createElement("div", { className: ht("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: ht("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var h = $r(l || {}), m = {};
      h.forEach(function(y) {
        l[y].forEach(function(S) {
          m[S] = y;
        });
      });
      var x = [];
      Ht(o) && (x = o.map(function(y) {
        var S = m[y];
        return {
          data: S ? { resolve: S } : {},
          classNames: S ? ["move"] : [],
          dir: y
        };
      })), v.push.apply(v, Q([], N(xu(t, "rotatable", x, e)), !1));
    }
    return s && v.push.apply(v, Q([], N(wu(t, e)), !1)), v;
  },
  dragControlCondition: Li,
  dragControlStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, u = e.isPinch, c = e.isRequest, f = t.state, d = f.target, v = f.left, h = f.top, m = f.direction, x = f.beforeDirection, y = f.targetTransform, S = f.moveableClientRect, w = f.offsetMatrix, E = f.targetMatrix, M = f.allMatrix, D = f.width, _ = f.height;
    if (!c && !d)
      return !1;
    var g = t.getRect();
    a.rect = g, a.transform = y, a.left = v, a.top = h;
    var T = function(it) {
      var tt = Nu(t.state, it);
      a.fixedDirection = tt.fixedDirection, a.fixedOffset = tt.fixedOffset, a.fixedPosition = tt.fixedPosition, F && F.setFixedPosition(it);
    }, k = function(it) {
      var tt = cv(t.state, it);
      a.fixedDirection = tt.fixedDirection, a.fixedOffset = tt.fixedOffset, a.fixedPosition = tt.fixedPosition, F && F.setFixedDirection(it);
    }, A = i, O = o;
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
        var z = j.getAttribute("data-direction") || "", W = mp[z];
        if (W) {
          a.isControl = !0, a.isAroundControl = te(j, ht("around-control")), a.controlDirection = W;
          var Y = j.getAttribute("data-resolve");
          Y && (a.resolveAble = Y);
          var L = Lv(f.rootMatrix, f.renderPoses, S);
          r = N(ne(L, W), 2), A = r[0], O = r[1];
        }
      }
      a.beforeInfo = { origin: g.beforeOrigin }, a.afterInfo = { origin: g.origin }, a.absoluteInfo = {
        origin: g.origin,
        startValue: g.rotation
      };
      var q = T;
      T = function(it) {
        var tt = f.is3d ? 4 : 3, st = N(It(Kl(E, tt), it), 2), nt = st[0], pt = st[1], Ct = se(w, xr([nt, pt], tt)), U = se(M, xr([it[0], it[1]], tt));
        q(it);
        var ut = f.posDelta;
        a.beforeInfo.origin = gt(Ct, ut), a.afterInfo.origin = gt(U, ut), a.absoluteInfo.origin = gt(U, ut), ii(t, a.beforeInfo, A, O, S), ii(t, a.afterInfo, A, O, S), ii(t, a.absoluteInfo, A, O, S);
      }, k = function(it) {
        var tt = ne([
          [0, 0],
          [D, 0],
          [0, _],
          [D, _]
        ], it);
        T(tt);
      };
    }
    a.startClientX = A, a.startClientY = O, a.direction = m, a.beforeDirection = x, a.startValue = 0, a.datas = {}, Oa(t, e, "rotate");
    var V = !1, F = !1;
    if (a.isControl && a.resolveAble) {
      var rt = a.resolveAble;
      rt === "resizable" && (F = Fi.dragControlStart(t, P(P({}, new Lr("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    F || (V = le.dragStart(t, new Lr().dragStart([0, 0], e))), T(Wv(t));
    var et = wt(t, e, P(P({ set: function(it) {
      a.startValue = it * Math.PI / 180;
    }, setFixedDirection: k, setFixedPosition: T }, Pa(t, e)), { dragStart: V, resizeStart: F })), Z = ct(t, "onRotateStart", et);
    return a.isRotate = Z !== !1, f.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? et : !1;
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, u = e.parentFlag, c = e.isPinch, f = e.groupDelta, d = e.resolveMatrix, v = i.beforeDirection, h = i.beforeInfo, m = i.afterInfo, x = i.absoluteInfo, y = i.isRotate, S = i.startValue, w = i.rect, E = i.startClientX, M = i.startClientY;
    if (y) {
      Ia(t, e, "rotate");
      var D = yp(e), _ = v * D, g = t.props.parentMoveable, T = 0, k, A, O = 0, R, j, z = 0, W, Y, L = 180 / Math.PI * S, q = x.startValue, V = !1, F = E + o, rt = M + s;
      if (!u && "parentDist" in e) {
        var et = e.parentDist;
        k = et, R = et, W = et;
      } else c || u ? (k = da(l, v, h), R = da(l, _, m), W = da(l, _, x)) : (k = oi(F, rt, v, h), R = oi(F, rt, _, m), W = oi(F, rt, _, x), V = !0);
      if (A = L + k, j = L + R, Y = q + W, ct(t, "onBeforeRotate", wt(t, e, {
        beforeRotation: A,
        rotation: j,
        absoluteRotation: Y,
        setRotation: function(yt) {
          R = yt - L, k = R, W = R;
        }
      }, !0)), r = N(si(t, w, h, k, L, V), 3), T = r[0], k = r[1], A = r[2], n = N(si(t, w, m, R, L, V), 3), O = n[0], R = n[1], j = n[2], a = N(si(t, w, x, W, q, V), 3), z = a[0], W = a[1], Y = a[2], !(!z && !O && !T && !g && !d)) {
        var Z = Ra(i, "rotate(".concat(j, "deg)"), "rotate(".concat(R, "deg)"));
        d && (i.fixedPosition = xo(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var it = Ip(t, R, i), tt = gt(It(f || [0, 0], it), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = it, i.requestValue = null;
        var st = hu(t, Z, tt, c, e), nt = st, pt = Ge([F, rt], x.startAbsoluteOrigin) - x.startDist, Ct = void 0;
        if (i.resolveAble === "resizable") {
          var U = Fi.dragControl(t, P(P({}, _n(e, t.state, [e.deltaX, e.deltaY], !!c, !1, "resizable")), { resolveMatrix: !0, parentDistance: pt }));
          U && (Ct = U, nt = Uu(nt, U, e));
        }
        var ut = wt(t, e, P(P({ delta: O, dist: R, rotate: j, rotation: j, beforeDist: k, beforeDelta: T, beforeRotate: A, beforeRotation: A, absoluteDist: W, absoluteDelta: z, absoluteRotate: Y, absoluteRotation: Y, isPinch: !!c, resize: Ct }, st), nt));
        return ct(t, "onRotate", ut), ut;
      }
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      r.isRotate = !1;
      var n = be(t, e, {});
      return ct(t, "onRotateEnd", n), n;
    }
  },
  dragGroupControlCondition: Li,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = t.state, a = n.left, i = n.top, o = n.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(r.beforeDirection * t.rotation);
    var l = qe(t, this, "dragControlStart", e, function(f, d) {
      var v = f.state, h = v.left, m = v.top, x = v.beforeOrigin, y = It(gt([h, m], [a, i]), gt(x, o));
      return d.datas.startGroupClient = y, d.datas.groupClient = y, P(P({}, d), { parentRotate: 0 });
    }), u = P(P({}, s), { targets: t.props.targets, events: l }), c = ct(t, "onRotateGroupStart", u);
    return r.isRotate = c !== !1, r.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      Ba(t, "onBeforeRotate", function(u) {
        ct(t, "onBeforeRotateGroup", wt(t, e, P(P({}, u), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = r.beforeDirection, i = n.beforeDist, o = i / 180 * Math.PI, s = qe(t, this, "dragControl", e, function(u, c) {
          var f = c.datas.startGroupClient, d = N(c.datas.groupClient, 2), v = d[0], h = d[1], m = N(Cn(f, o * a), 2), x = m[0], y = m[1], S = [x - v, y - h];
          return c.datas.groupClient = [x, y], P(P({}, c), { parentRotate: i, groupDelta: S });
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
      var a = qe(t, this, "dragControlEnd", e), i = be(t, e, {
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
function pv(t, e) {
  var r, n = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, u = n === "horizontal", c = u ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (r = {}, r[u ? "width" : "height"] = "".concat(i), r.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(c, "(-50%) scale").concat(c, "(").concat(s, ")"), r)
  });
}
function Eo(t, e) {
  return pv(P(P({}, t), { classNames: Q([
    ht("line", "guideline", t.direction)
  ], N(t.classNames), !1).filter(function(r) {
    return r;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(r) {
    return "".concat(St(r, 0.1), "px");
  }) }), e);
}
function Xs(t, e, r, n, a, i, o, s) {
  var l = t.props.zoom;
  return r.map(function(u, c) {
    var f = u.type, d = u.pos, v = [0, 0];
    return v[o] = n, v[o ? 0 : 1] = -a + d, Eo({
      key: "".concat(e, "TargetGuideline").concat(c),
      classNames: [ht("target", "bold", f)],
      posValue: v,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function Hs(t, e, r, n, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, u = e === "horizontal" ? ir : or, c = a[u.start], f = a[u.end];
  return r.filter(function(d) {
    var v = d.hide, h = d.elementRect;
    if (v)
      return !1;
    if (l && h) {
      var m = h.rect;
      if (m[u.start] <= c && f <= m[u.end])
        return !1;
    }
    return !0;
  }).map(function(d, v) {
    var h = d.pos, m = d.size, x = d.element, y = d.className, S = [
      -n[0] + h[0],
      -n[1] + h[1]
    ];
    return Eo({
      key: "".concat(e, "-default-guideline-").concat(v),
      classNames: x ? [ht("bold"), y] : [ht("normal"), y],
      direction: e,
      posValue: S,
      sizeValue: m,
      zoom: s
    }, i);
  });
}
function an(t, e, r, n, a, i, o, s) {
  var l, u = t.props, c = u.snapDigit, f = c === void 0 ? 0 : c, d = u.isDisplaySnapDigit, v = d === void 0 ? !0 : d, h = u.snapDistFormat, m = h === void 0 ? function(M, D) {
    return M;
  } : h, x = u.zoom, y = e === "horizontal" ? "X" : "Y", S = e === "vertical" ? "height" : "width", w = Math.abs(a), E = v ? parseFloat(w.toFixed(f)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(r, "-guideline-").concat(n), className: ht("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[S] = "".concat(w, "px"), l) },
    Eo({
      direction: e,
      classNames: [ht(r), o],
      size: "100%",
      posValue: [0, 0],
      sizeValue: w,
      zoom: x
    }, s),
    s.createElement("div", { className: ht("size-value", "gap"), style: {
      transform: "translate".concat(y, "(-50%) scale(").concat(x, ")")
    } }, E > 0 ? m(E, e) : "")
  );
}
function vv(t, e, r, n) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? ir : or, s = r[o.start], l = r[o.end];
  return Ku(e, function(u) {
    return u.pos[a];
  }).map(function(u) {
    var c = [], f = [], d = [];
    return u.forEach(function(v) {
      var h, m, x = v.element, y = v.elementRect.rect;
      if (y[o.end] < s)
        c.push(v);
      else if (l < y[o.start])
        f.push(v);
      else if (y[o.start] <= s && l <= y[o.end] && n) {
        var S = v.pos, w = { element: x, rect: P(P({}, y), (h = {}, h[o.end] = y[o.start], h)) }, E = { element: x, rect: P(P({}, y), (m = {}, m[o.start] = y[o.end], m)) }, M = [0, 0], D = [0, 0];
        M[a] = S[a], M[i] = S[i], D[a] = S[a], D[i] = S[i] + v.size, c.push({
          type: t,
          pos: M,
          size: 0,
          elementRect: w,
          direction: "",
          elementDirection: "end"
        }), f.push({
          type: t,
          pos: D,
          size: 0,
          elementRect: E,
          direction: "",
          elementDirection: "start"
        });
      }
    }), c.sort(function(v, h) {
      return h.pos[i] - v.pos[i];
    }), f.sort(function(v, h) {
      return v.pos[i] - h.pos[i];
    }), {
      total: u,
      start: c,
      end: f,
      inner: d
    };
  });
}
function hv(t, e, r, n, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(x) {
      return x.type === s;
    }), u = s === "vertical" ? 1 : 0, c = u ? 0 : 1, f = vv(s, l, n, i), d = u ? or : ir, v = u ? ir : or, h = n[d.start], m = n[d.end];
    f.forEach(function(x) {
      var y = x.total, S = x.start, w = x.end, E = x.inner, M = r[c] + y[0].pos[c] - n[v.start], D = n;
      S.forEach(function(_) {
        var g = _.elementRect.rect, T = D[d.start] - g[d.end];
        if (T > 0) {
          var k = [0, 0];
          k[u] = r[u] + D[d.start] - h - T, k[c] = M, o.push(an(t, s, "dashed", o.length, T, k, _.className, a));
        }
        D = g;
      }), D = n, w.forEach(function(_) {
        var g = _.elementRect.rect, T = g[d.start] - D[d.end];
        if (T > 0) {
          var k = [0, 0];
          k[u] = r[u] + D[d.end] - h, k[c] = M, o.push(an(t, s, "dashed", o.length, T, k, _.className, a));
        }
        D = g;
      }), E.forEach(function(_) {
        var g = _.elementRect.rect, T = h - g[d.start], k = g[d.end] - m, A = [0, 0], O = [0, 0];
        A[u] = r[u] - T, A[c] = M, O[u] = r[u] + m - h, O[c] = M, o.push(an(t, s, "dashed", o.length, T, A, _.className, a)), o.push(an(t, s, "dashed", o.length, k, O, _.className, a));
      });
    });
  }), o;
}
function gv(t, e, r, n, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(x) {
      return x.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, u = l ? 0 : 1, c = l ? or : ir, f = l ? ir : or, d = n[c.start], v = n[c.end], h = n[f.start], m = n[f.end];
    s.forEach(function(x) {
      var y = x.gap, S = x.gapRects, w = Math.max.apply(Math, Q([h], N(S.map(function(D) {
        var _ = D.rect;
        return _[f.start];
      })), !1)), E = Math.min.apply(Math, Q([m], N(S.map(function(D) {
        var _ = D.rect;
        return _[f.end];
      })), !1)), M = (w + E) / 2;
      w === E || M === (h + m) / 2 || S.forEach(function(D) {
        var _ = D.rect, g = D.className, T = [r[0], r[1]];
        if (_[c.end] < d)
          T[l] += _[c.end] - d;
        else if (v < _[c.start])
          T[l] += _[c.start] - d - y;
        else
          return;
        T[u] += M - h, i.push(an(t, l ? "vertical" : "horizontal", "gap", i.length, y, T, g, a));
      });
    });
  }), i;
}
function Wi(t) {
  var e, r, n = t.state, a = n.containerClientRect, i = n.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, u = a.clientHeight, c = a.clientWidth, f = a.clientLeft, d = a.clientTop, v = t.props, h = v.snapGap, m = h === void 0 ? !0 : h, x = v.verticalGuidelines, y = v.horizontalGuidelines, S = v.snapThreshold, w = S === void 0 ? 5 : S, E = v.maxSnapElementGuidelineDistance, M = E === void 0 ? 1 / 0 : E, D = v.isDisplayGridGuidelines, _ = De(ke(t.state)), g = _.top, T = _.left, k = _.bottom, A = _.right, O = { top: g, left: T, bottom: k, right: A, center: (T + A) / 2, middle: (g + k) / 2 }, R = bv(t), j = Q([], N(R), !1), z = ((r = (e = n.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && r !== void 0 ? r : [1, 1]).map(function(q) {
    return q * w;
  });
  m && j.push.apply(j, Q([], N(mv(t, O, z)), !1));
  var W = P({}, n.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (j.push.apply(j, Q([], N(yv(t, o ? l : c, o ? s : u, f, d, W, D)), !1)), i) {
    var Y = a.left, L = a.top;
    W.left += Y, W.top += L, W.right += Y, W.bottom += L;
  }
  return j.push.apply(j, Q([], N(zu(y || !1, x || !1, o ? l : c, o ? s : u, f, d, W)), !1)), j = j.filter(function(q) {
    var V = q.element, F = q.elementRect, rt = q.type;
    if (!V || !F)
      return !0;
    var et = F.rect;
    return ju(O, et, rt, M);
  }), j;
}
function mv(t, e, r) {
  var n = t.props, a = n.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = n.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, u = [];
  return [
    ["vertical", ir, or],
    ["horizontal", or, ir]
  ].forEach(function(c) {
    var f = N(c, 3), d = f[0], v = f[1], h = f[2], m = e[v.start], x = e[v.end], y = e[v.center], S = e[h.start], w = e[h.end], E = {
      left: r[0],
      top: r[1]
    };
    function M(g) {
      var T = g.rect, k = E[v.start];
      return T[v.end] < m + k ? m - T[v.end] : x - k < T[v.start] ? T[v.start] - x : -1;
    }
    var D = l.filter(function(g) {
      var T = g.rect;
      return T[h.start] > w || T[h.end] < S ? !1 : M(g) > 0;
    }).sort(function(g, T) {
      return M(g) - M(T);
    }), _ = [];
    D.forEach(function(g) {
      D.forEach(function(T) {
        if (g !== T) {
          var k = g.rect, A = T.rect, O = k[h.start], R = k[h.end], j = A[h.start], z = A[h.end];
          O > z || j > R || _.push([g, T]);
        }
      });
    }), _.forEach(function(g) {
      var T = N(g, 2), k = T[0], A = T[1], O = k.rect, R = A.rect, j = O[v.start], z = O[v.end], W = R[v.start], Y = R[v.end], L = E[v.start], q = 0, V = 0, F = !1, rt = !1, et = !1;
      if (z <= m && x <= W) {
        if (rt = !0, q = (W - z - (x - m)) / 2, V = z + q + (x - m) / 2, H(V - y) > L)
          return;
      } else if (z < W && Y < m + L) {
        if (F = !0, q = W - z, V = Y + q, H(V - m) > L)
          return;
      } else if (z < W && x - L < j) {
        if (et = !0, q = W - z, V = j - q, H(V - x) > L)
          return;
      } else
        return;
      q && ju(e, R, d, i) && (q > s || u.push({
        type: d,
        pos: d === "vertical" ? [V, 0] : [0, V],
        element: A.element,
        size: 0,
        className: A.className,
        isStart: F,
        isCenter: rt,
        isEnd: et,
        gap: q,
        hide: !0,
        gapRects: [k, A],
        direction: "",
        elementDirection: ""
      }));
    });
  }), u;
}
function xv(t, e, r, n) {
  var a, i, o = t.props, s = t.state, l = o.snapGridAll, u = o.snapGridWidth, c = u === void 0 ? 0 : u, f = o.snapGridHeight, d = f === void 0 ? 0 : f, v = s.snapRenderInfo, h = v && (((a = v.direction) === null || a === void 0 ? void 0 : a[0]) || ((i = v.direction) === null || i === void 0 ? void 0 : i[1])), m = t.moveables;
  if (l && m && h && (c || d)) {
    if (s.snapThresholdInfo)
      return;
    s.snapThresholdInfo = {
      multiples: [1, 1],
      offset: [0, 0]
    };
    var x = t.getRect(), y = x.children, S = v.direction;
    if (y) {
      var w = S.map(function(M, D) {
        var _ = D === 0 ? {
          snapSize: c,
          posName: "left",
          sizeName: "width",
          clientOffset: n.left - e
        } : {
          snapSize: d,
          posName: "top",
          sizeName: "height",
          clientOffset: n.top - r
        }, g = _.snapSize, T = _.posName, k = _.sizeName, A = _.clientOffset;
        if (!g)
          return {
            dir: M,
            multiple: 1,
            snapSize: g,
            snapOffset: 0
          };
        var O = x[k], R = x[T], j = md(y.map(function(F) {
          return [
            F[T] - R,
            F[k],
            O - F[k] - F[T] + R
          ];
        })).filter(function(F) {
          return F;
        }).sort(function(F, rt) {
          return F - rt;
        }), z = j[0], W = j.map(function(F) {
          return St(F / z, 0.1) * g;
        }), Y = 1, L = St(O / z, 0.1);
        for (Y = 1; Y <= 10 && !W.every(function(F) {
          return F * Y % 1 === 0;
        }); ++Y)
          ;
        var q = (-M + 1) / 2, V = va(R - A, R - A + O, q, 1 - q);
        return {
          multiple: L * Y,
          dir: M,
          snapSize: g,
          snapOffset: Math.round(V / g)
        };
      }), E = w.map(function(M) {
        return M.multiple || 1;
      });
      s.snapThresholdInfo.multiples = E, s.snapThresholdInfo.offset = w.map(function(M) {
        return M.snapOffset;
      }), w.forEach(function(M, D) {
        M.snapSize;
      });
    }
  } else
    s.snapThresholdInfo = null;
}
function yv(t, e, r, n, a, i, o) {
  n === void 0 && (n = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, u = s.snapGridWidth, c = u === void 0 ? 0 : u, f = s.snapGridHeight, d = f === void 0 ? 0 : f, v = [], h = i.left, m = i.top, x = [0, 0];
  xv(t, n, a, i);
  var y = l.snapThresholdInfo, S = c, w = d;
  if (y && (c *= y.multiples[0] || 1, d *= y.multiples[1] || 1, x = y.offset), d) {
    for (var E = function(D) {
      v.push({
        type: "horizontal",
        pos: [
          h,
          St(x[1] * w + D - a + m, 0.1)
        ],
        className: ht("grid-guideline"),
        size: e,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, M = 0; M <= r * 2; M += d)
      E(M);
    for (var M = -d; M >= -r; M -= d)
      E(M);
  }
  if (c) {
    for (var E = function(_) {
      v.push({
        type: "vertical",
        pos: [
          St(x[0] * S + _ - n + h, 0.1),
          m
        ],
        className: ht("grid-guideline"),
        size: r,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, M = 0; M <= e * 2; M += c)
      E(M);
    for (var M = -c; M >= -e; M -= c)
      E(M);
  }
  return v;
}
function ju(t, e, r, n) {
  return r === "horizontal" ? H(t.right - e.left) <= n || H(t.left - e.right) <= n || t.left <= e.right && e.left <= t.right : r === "vertical" ? H(t.bottom - e.top) <= n || H(t.top - e.bottom) <= n || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function bv(t) {
  var e = t.state, r = t.props.elementGuidelines, n = r === void 0 ? [] : r;
  if (!n.length)
    return e.elementRects = [], [];
  var a = (e.elementRects || []).filter(function(d) {
    return !d.refresh;
  }), i = n.map(function(d) {
    return xe(d) && "element" in d ? P(P({}, d), { element: Fe(d.element, !0) }) : {
      element: Fe(d, !0)
    };
  }).filter(function(d) {
    return d.element;
  }), o = Pr(a.map(function(d) {
    return d.element;
  }), i.map(function(d) {
    return d.element;
  })), s = o.maintained, l = o.added, u = [];
  s.forEach(function(d) {
    var v = N(d, 2), h = v[0], m = v[1];
    u[m] = a[h];
  }), Sv(t, l.map(function(d) {
    return i[d];
  })).map(function(d, v) {
    u[l[v]] = d;
  }), e.elementRects = u;
  var c = bo(t.props.elementSnapDirections), f = [];
  return u.forEach(function(d) {
    var v = d.element, h = d.top, m = h === void 0 ? c.top : h, x = d.left, y = x === void 0 ? c.left : x, S = d.right, w = S === void 0 ? c.right : S, E = d.bottom, M = E === void 0 ? c.bottom : E, D = d.center, _ = D === void 0 ? c.center : D, g = d.middle, T = g === void 0 ? c.middle : g, k = d.className, A = d.rect, O = So({
      top: m,
      right: w,
      left: y,
      bottom: M,
      center: _,
      middle: T
    }, A), R = O.horizontal, j = O.vertical, z = O.horizontalNames, W = O.verticalNames, Y = A.top, L = A.left, q = A.right - L, V = A.bottom - Y, F = [q, V];
    j.forEach(function(rt, et) {
      f.push({
        type: "vertical",
        element: v,
        pos: [
          St(rt, 0.1),
          Y
        ],
        size: V,
        sizes: F,
        className: k,
        elementRect: d,
        elementDirection: js[W[et]] || W[et],
        direction: ""
      });
    }), R.forEach(function(rt, et) {
      f.push({
        type: "horizontal",
        element: v,
        pos: [
          L,
          St(rt, 0.1)
        ],
        size: q,
        sizes: F,
        className: k,
        elementRect: d,
        elementDirection: js[z[et]] || z[et],
        direction: ""
      });
    });
  }), f;
}
function $s(t, e) {
  return t ? t.map(function(r) {
    var n = xe(r) ? r : { pos: r }, a = n.pos;
    return gn(a) ? n : P(P({}, n), { pos: Nt(a, e) });
  }) : [];
}
function zu(t, e, r, n, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, u = o.top, c = o.bottom, f = o.right, d = r + f - l, v = n + c - u;
  return $s(t, v).forEach(function(h) {
    s.push({
      type: "horizontal",
      pos: [
        l,
        St(h.pos - i + u, 0.1)
      ],
      size: d,
      className: h.className,
      direction: ""
    });
  }), $s(e, d).forEach(function(h) {
    s.push({
      type: "vertical",
      pos: [
        St(h.pos - a + l, 0.1),
        u
      ],
      size: v,
      className: h.className,
      direction: ""
    });
  }), s;
}
function Sv(t, e) {
  if (!e.length)
    return [];
  var r = t.props.groupable, n = t.state, a = n.containerClientRect, i = n.rootMatrix, o = n.is3d, s = n.offsetDelta, l = o ? 4 : 3, u = N(Hp(i, a, l), 2), c = u[0], f = u[1], d = r ? 0 : s[0], v = r ? 0 : s[1];
  return e.map(function(h) {
    var m = h.element.getBoundingClientRect(), x = m.left - c - d, y = m.top - f - v, S = y + m.height, w = x + m.width, E = N(Xr(i, [x, y], l), 2), M = E[0], D = E[1], _ = N(Xr(i, [w, S], l), 2), g = _[0], T = _[1];
    return P(P({}, h), { rect: {
      left: M,
      right: g,
      top: D,
      bottom: T,
      center: (M + g) / 2,
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
      var s = dn(o), l = Js(e, [
        s.left - a.left,
        s.top - a.top
      ]), u = Js(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = St(l[0], 1e-5), i.top = St(l[1], 1e-5), i.right = St(u[0], 1e-5), i.bottom = St(u[1], 1e-5);
    }
  }
  return e.snapContainer = n, e.snapOffset = i, e.guidelines = Wi(t), e.enableSnap = !0, !0;
}
function Bu(t, e, r, n, a, i) {
  var o = wr(t, e, r, i ? 4 : 3), s = ne(o, n);
  return Mo(o, gt(a, s));
}
function qs(t) {
  return t ? t / H(t) : 0;
}
function Cv(t, e, r, n, a, i) {
  var o = i.fixedDirection, s = Up(r, o, n), l = wo(t, e, r, n), u = Q(Q([], N(sv(t, e, s, n, a, i)), !1), N(Pu(t, l, i)), !1), c = Sa(u, 0), f = Sa(u, 1);
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
function wv(t, e, r, n, a, i, o, s, l) {
  var u = ne(e, o), c = ja(t, s, {
    vertical: [u[0]],
    horizontal: [u[1]]
  }), f = c.horizontal.offset, d = c.vertical.offset;
  if (St(d, Ai) || St(f, Ai)) {
    var v = N(Le({
      datas: l,
      distX: -d,
      distY: -f
    }), 2), h = v[0], m = v[1], x = Math.min(a || 1 / 0, r + o[0] * h), y = Math.min(i || 1 / 0, n + o[1] * m);
    return [x - r, y - n];
  }
  return [0, 0];
}
function Gu(t, e, r, n, a, i, o, s) {
  for (var l = ke(t.state), u = t.props.keepRatio, c = 0, f = 0, d = 0; d < 2; ++d) {
    var v = e(c, f), h = Cv(t, v, a, u, o, s), m = h.width, x = h.height, y = m.isBound, S = x.isBound, w = m.offset, E = x.offset;
    if (d === 1 && (y || (w = 0), S || (E = 0)), d === 0 && o && !y && !S)
      return [0, 0];
    if (u) {
      var M = H(w) * (r ? 1 / r : 1), D = H(E) * (n ? 1 / n : 1), _ = y && S ? M < D : S || !y && M < D;
      _ ? w = r * E / n : E = n * w / r;
    }
    c += w, f += E;
  }
  if (!u && a[0] && a[1]) {
    var g = uv(t, l, a, i, s), T = g.maxWidth, k = g.maxHeight, A = N(wv(t, e(c, f).map(function(j) {
      return j.map(function(z) {
        return St(z, Ai);
      });
    }), r + c, n + f, T, k, a, o, s), 2), w = A[0], E = A[1];
    c += w, f += E;
  }
  return [c, f];
}
function cn(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function Ev(t, e) {
  e = cn(e);
  var r = Math.floor(t / 360), n = r * 360 + 360 - e, a = r * 360 + e;
  return H(t - n) < H(t - a) ? n : a;
}
function li(t, e) {
  t = cn(t), e = cn(e);
  var r = cn(t - e);
  return Math.min(r, 360 - r);
}
function Dv(t, e, r, n) {
  var a, i = t.props, o = (a = i[Eu]) !== null && a !== void 0 ? a : 5, s = i[Du];
  if (Ur(t, "rotatable")) {
    var l = e.pos1, u = e.pos2, c = e.pos3, f = e.pos4, d = e.origin, v = r * Math.PI / 180, h = [l, u, c, f].map(function(E) {
      return gt(E, d);
    }), m = h.map(function(E) {
      return Cn(E, v);
    }), x = Q(Q([], N(Lp(t, h, m, d, r)), !1), N(ev(t, h, m, d, r)), !1);
    x.sort(function(E, M) {
      return H(E - r) - H(M - r);
    });
    var y = x.length > 0;
    if (y)
      return {
        isSnap: y,
        dist: y ? x[0] : r
      };
  }
  if (s != null && s.length && o) {
    var S = s.slice().sort(function(E, M) {
      return li(E, n) - li(M, n);
    }), w = S[0];
    if (li(w, n) <= o)
      return {
        isSnap: !0,
        dist: r + Ev(n, w) - n
      };
  }
  return {
    isSnap: !1,
    dist: r
  };
}
function Mv(t, e, r, n, a, i, o) {
  if (!Ur(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, u = t.state, c = u.allMatrix, f = u.is3d;
  return Gu(t, function(d, v) {
    return Bu(l || c, e + d, r + v, s, a, f);
  }, e, r, n, a, i, o);
}
function _v(t, e, r, n, a) {
  if (!Ur(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, u = a.is3d, c = Gu(t, function(f, d) {
    return Bu(Mp(a, It(e, [f / i, d / o])), i, o, l, s, u);
  }, i, o, r, s, n, a);
  return [c[0] / i, c[1] / o];
}
function kv(t, e) {
  e.absolutePoses = ke(t.state);
}
function Vs(t) {
  var e = [];
  return t.forEach(function(r) {
    r.guidelineInfos.forEach(function(n) {
      var a = n.guideline;
      ye(e, function(i) {
        return i.guideline === a;
      }) || (a.direction = "", e.push({ guideline: a, posInfo: r }));
    });
  }), e.map(function(r) {
    var n = r.guideline, a = r.posInfo;
    return P(P({}, n), { direction: a.direction });
  });
}
function Us(t, e, r, n, a, i) {
  var o = yo(Na(t, i), e, r), s = o.vertical, l = o.horizontal, u = Ar();
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
  var c = rv(t), f = c.boundMap, d = c.vertical, v = c.horizontal;
  return d.forEach(function(h) {
    Ve(n, function(m) {
      var x = m.type, y = m.pos;
      return x === "bounds" && y === h;
    }) >= 0 || n.push({
      type: "bounds",
      pos: h
    });
  }), v.forEach(function(h) {
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
var Tv = To("", ["resizable", "scalable"]), Iv = {
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
    Eu,
    Du,
    Mu,
    _u,
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
      return zr(t, "boundMap", Ar(), function(Z) {
        return JSON.stringify(Z);
      }), zr(t, "innerBoundMap", Ar(), function(Z) {
        return JSON.stringify(Z);
      }), [];
    r.guidelines = Wi(t);
    var d = Math.min(i[0], o[0], s[0], l[0]), v = Math.min(i[1], o[1], s[1], l[1]), h = u.externalPoses || [], m = ke(t.state), x = [], y = [], S = [], w = [], E = [], M = De(m), D = M.width, _ = M.height, g = M.top, T = M.left, k = M.bottom, A = M.right, O = { left: T, right: A, top: g, bottom: k, center: (T + A) / 2, middle: (g + k) / 2 }, R = h.length > 0, j = R ? De(h) : {};
    if (!u.request) {
      if (u.direction && E.push(Vp(t, m, u.direction, f, f)), u.snap) {
        var z = De(m);
        u.center && (z.middle = (z.top + z.bottom) / 2, z.center = (z.left + z.right) / 2), E.push(zs(t, z, f, f));
      }
      R && (u.center && (j.middle = (j.top + j.bottom) / 2, j.center = (j.left + j.right) / 2), E.push(zs(t, j, f, f))), E.forEach(function(Z) {
        var it = Z.vertical.posInfos, tt = Z.horizontal.posInfos;
        x.push.apply(x, Q([], N(it.filter(function(st) {
          var nt = st.guidelineInfos;
          return nt.some(function(pt) {
            var Ct = pt.guideline;
            return !Ct.hide;
          });
        }).map(function(st) {
          return {
            type: "snap",
            pos: st.pos
          };
        })), !1)), y.push.apply(y, Q([], N(tt.filter(function(st) {
          var nt = st.guidelineInfos;
          return nt.some(function(pt) {
            var Ct = pt.guideline;
            return !Ct.hide;
          });
        }).map(function(st) {
          return {
            type: "snap",
            pos: st.pos
          };
        })), !1)), S.push.apply(S, Q([], N(Vs(it)), !1)), w.push.apply(w, Q([], N(Vs(tt)), !1));
      });
    }
    var W = Us(t, [T, A], [g, k], x, y), Y = W.boundMap, L = W.innerBoundMap;
    R && Us(t, [j.left, j.right], [j.top, j.bottom], x, y, u.externalBounds);
    var q = Q(Q([], N(S), !1), N(w), !1), V = q.filter(function(Z) {
      return Z.element && !Z.gapRects;
    }), F = q.filter(function(Z) {
      return Z.gapRects;
    }).sort(function(Z, it) {
      return Z.gap - it.gap;
    });
    ct(t, "onSnap", {
      guidelines: q.filter(function(Z) {
        var it = Z.element;
        return !it;
      }),
      elements: V,
      gaps: F
    }, !0);
    var rt = zr(t, "boundMap", Y, function(Z) {
      return JSON.stringify(Z);
    }, Ar()), et = zr(t, "innerBoundMap", L, function(Z) {
      return JSON.stringify(Z);
    }, Ar());
    return (Y === rt || L === et) && ct(t, "onBound", {
      bounds: Y,
      innerBounds: L
    }, !0), Q(Q(Q(Q(Q(Q([], N(hv(t, V, [d, v], O, e)), !1), N(gv(t, F, [d, v], O, e)), !1), N(Hs(t, "horizontal", w, [a, n], O, e)), !1), N(Hs(t, "vertical", S, [a, n], O, e)), !1), N(Xs(t, "horizontal", y, d, n, D, 0, e)), !1), N(Xs(t, "vertical", x, v, a, _, 1, e)), !1);
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
    ta(t) || (e.guidelines = Wi(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (Tv(t, e) || Li(t, e))
      return !0;
    if (!e.isRequest && e.inputEvent)
      return te(e.inputEvent.target, ht("snap-control"));
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
function Rv(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function ht() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return td.apply(void 0, Q([ho], N(t), !1));
}
function Fu(t) {
  t();
}
function Pv(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : xe(t) ? t : Gr(t);
}
function fn(t, e, r) {
  return ga(e, yr(r, e), t, yr(r.map(function(n) {
    return -n;
  }), e));
}
function Ov(t, e, r) {
  if (e === "%") {
    var n = Do(t.ownerSVGElement);
    return n[r ? "width" : "height"] / 100;
  }
  return 1;
}
function Nv(t) {
  var e = Av(_o(t, ":before"));
  return e.map(function(r, n) {
    var a = mr(r), i = a.value, o = a.unit;
    return i * Ov(t, o, n === 0);
  });
}
function wa(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function Av(t) {
  return wa(t.transformOrigin);
}
function Lu(t) {
  var e = he(t), r = e("transform");
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
  var i, o, s = so(t) || sr(t), l = !1, u, c;
  if (!t || r)
    u = t;
  else {
    var f = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, d = t.parentElement;
    f ? (l = !0, c = d, u = f) : u = d;
  }
  for (var v = !1, h = t === e || u === e, m = "relative", x = 1, y = parseFloat(a == null ? void 0 : a("zoom")) || 1, S = a == null ? void 0 : a("position"); u && u !== s; ) {
    e === u && (h = !0);
    var w = he(u), E = u.tagName.toLowerCase(), M = Lu(u), D = w("willChange"), _ = parseFloat(w("zoom")) || 1;
    if (m = w("position"), n && _ !== 1) {
      x = _;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !r && n && y !== 1 && S && S !== "absolute" || E === "svg" || E === "foreignobject" || m !== "static" || M && M !== "none" || D === "transform"
    )
      break;
    var g = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, T = u.parentNode;
    g && (l = !0, c = T);
    var k = T;
    if (k && k.nodeType === 11) {
      u = k.host, v = !0, m = he(u)("position");
      break;
    }
    u = k, m = "relative";
  }
  return {
    offsetZoom: x,
    hasSlot: l,
    parentSlotElement: c,
    isCustomElement: v,
    isStatic: m === "static",
    isEnd: h || !u || u === s,
    offsetParent: u || s
  };
}
function jv(t, e) {
  var r, n = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = he(t), s = ro(a), l = !s, u, c;
  return !l && (n !== "svg" || t.ownerSVGElement) ? (u = su ? Nv(t) : wa(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), c = u.slice(), l = !0, n === "svg" ? (a = 0, i = 0) : (r = N(Gv(t, u, t === e && e.tagName.toLowerCase() === "g"), 4), a = r[0], i = r[1], u[0] = r[2], u[1] = r[3])) : (u = wa(o("transformOrigin")).map(function(f) {
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
function Wu(t, e) {
  var r = he(t), n = he(sr(t)), a = n("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(n("marginLeft"), 10), o = parseInt(n("marginTop"), 10);
  return r("position") === "absolute" && ((r("top") !== "auto" || r("bottom") !== "auto") && (o = 0), (r("left") !== "auto" || r("right") !== "auto") && (i = 0)), [i, o];
}
function Yi(t) {
  t.forEach(function(e) {
    var r = e.matrix;
    r && (e.matrix = Ae(r, 3, 4));
  });
}
function zv(t) {
  for (var e = t.parentElement, r = !1, n = sr(t); e; ) {
    var a = _o(e).transform;
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
function za(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(Zl(t, !e).join(","), ")");
}
function Do(t) {
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
function Bv(t, e) {
  var r, n = Do(t), a = n.width, i = n.height, o = n.clientWidth, s = n.clientHeight, l = o / a, u = s / i, c = t.preserveAspectRatio.baseVal, f = c.align, d = c.meetOrSlice, v = [0, 0], h = [l, u], m = [0, 0];
  if (f !== 1) {
    var x = (f - 2) % 3, y = Math.floor((f - 2) / 3);
    v[0] = a * x / 2, v[1] = i * y / 2;
    var S = d === 2 ? Math.max(u, l) : Math.min(l, u);
    h[0] = S, h[1] = S, m[0] = (o - a) / 2 * x, m[1] = (s - i) / 2 * y;
  }
  var w = lo(h, e);
  return r = N(m, 2), w[e * (e - 1)] = r[0], w[e * (e - 1) + 1] = r[1], fn(w, e, v);
}
function Gv(t, e, r) {
  var n = t.tagName.toLowerCase();
  if (!t.getBBox || !r && n === "g")
    return [0, 0, 0, 0];
  var a = he(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = Do(t.ownerSVGElement), l = o.x, u = o.y;
  n === "foreignobject" && !l && !u && (l = parseFloat(t.getAttribute("x")) || 0, u = parseFloat(t.getAttribute("y")) || 0);
  var c = l - s.x, f = u - s.y, d = i ? e[0] : e[0] - c, v = i ? e[1] : e[1] - f;
  return [c, f, d, v];
}
function Lt(t, e, r) {
  return se(t, xr(e, r), r);
}
function wr(t, e, r, n) {
  return [[0, 0], [e, 0], [0, r], [e, r]].map(function(a) {
    return Lt(t, a, n);
  });
}
function De(t) {
  var e = t.map(function(u) {
    return u[0];
  }), r = t.map(function(u) {
    return u[1];
  }), n = Math.min.apply(Math, Q([], N(e), !1)), a = Math.min.apply(Math, Q([], N(r), !1)), i = Math.max.apply(Math, Q([], N(e), !1)), o = Math.max.apply(Math, Q([], N(r), !1)), s = i - n, l = o - a;
  return {
    left: n,
    top: a,
    right: i,
    bottom: o,
    width: s,
    height: l
  };
}
function Ks(t, e, r, n) {
  var a = wr(t, e, r, n);
  return De(a);
}
function Fv(t, e, r, n, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, u = Xu(o), c = u.offsetWidth, f = u.offsetHeight, d = r.getBoundingClientRect(), v = [0, 0];
  r === sr(r) && (v = Wu(o, !0));
  for (var h = o.getBoundingClientRect(), m = h.left - d.left + r.scrollLeft - (r.clientLeft || 0) + v[0], x = h.top - d.top + r.scrollTop - (r.clientTop || 0) + v[1], y = h.width, S = h.height, w = ga(n, a, l), E = Ks(w, c, f, n), M = E.left, D = E.top, _ = E.width, g = E.height, T = Lt(w, s, n), k = gt(T, [M, D]), A = [
    m + k[0] * y / _,
    x + k[1] * S / g
  ], O = [0, 0], R = 0; ++R < 10; ) {
    var j = Ne(a, n);
    i = N(gt(Lt(j, A, n), Lt(j, T, n)), 2), O[0] = i[0], O[1] = i[1];
    var z = ga(n, a, yr(O, n), l), W = Ks(z, c, f, n), Y = W.left, L = W.top, q = Y - m, V = L - x;
    if (H(q) < 2 && H(V) < 2)
      break;
    A[0] -= q, A[1] -= V;
  }
  return O.map(function(F) {
    return Math.round(F);
  });
}
function Lv(t, e, r) {
  var n = t.length === 16, a = n ? 4 : 3, i = e.map(function(l) {
    return Lt(t, l, a);
  }), o = r.left, s = r.top;
  return i.map(function(l) {
    return [l[0] + o, l[1] + s];
  });
}
function _e(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
}
function Yu(t, e) {
  return _e([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function on(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = $t(t, e));
  var a = Yu(t, e);
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
function Sr(t, e) {
  var r = t[e];
  return xe(r) ? P(P({}, t), r) : t;
}
function Xu(t) {
  var e = t && !ro(t.offsetWidth), r = 0, n = 0, a = 0, i = 0, o = 0, s = 0, l = 0, u = 0, c = 0, f = 0, d = 0, v = 0, h = 1 / 0, m = 1 / 0, x = 1 / 0, y = 1 / 0, S = 0, w = 0, E = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var M = t.getBBox();
      E = !0, r = M.width, n = M.height, o = r, s = n, l = r, u = n, a = r, i = n;
    } else {
      var D = he(t), _ = t.style, g = D("boxSizing") === "border-box", T = parseFloat(D("borderLeftWidth")) || 0, k = parseFloat(D("borderRightWidth")) || 0, A = parseFloat(D("borderTopWidth")) || 0, O = parseFloat(D("borderBottomWidth")) || 0, R = parseFloat(D("paddingLeft")) || 0, j = parseFloat(D("paddingRight")) || 0, z = parseFloat(D("paddingTop")) || 0, W = parseFloat(D("paddingBottom")) || 0, Y = R + j, L = z + W, q = T + k, V = A + O, F = Y + q, rt = L + V, et = D("position"), Z = 0, it = 0;
      if ("clientLeft" in t) {
        var tt = null;
        if (et === "absolute") {
          var st = bn(t, sr(t));
          tt = st.offsetParent;
        } else
          tt = t.parentElement;
        if (tt) {
          var nt = he(tt);
          Z = parseFloat(nt("width")), it = parseFloat(nt("height"));
        }
      }
      c = Math.max(Y, Nt(D("minWidth"), Z) || 0), f = Math.max(L, Nt(D("minHeight"), it) || 0), h = Nt(D("maxWidth"), Z), m = Nt(D("maxHeight"), it), isNaN(h) && (h = 1 / 0), isNaN(m) && (m = 1 / 0), S = Nt(_.width, 0) || 0, w = Nt(_.height, 0) || 0, o = parseFloat(D("width")) || 0, s = parseFloat(D("height")) || 0, l = H(o - S) < 1 ? ha(c, S || o, h) : o, u = H(s - w) < 1 ? ha(f, w || s, m) : s, r = l, n = u, a = l, i = u, g ? (x = h, y = m, d = c, v = f, l = r - F, u = n - rt) : (x = h + F, y = m + rt, d = c + F, v = f + rt, r = l + F, n = u + rt), a = l + Y, i = u + L;
    }
  return {
    svg: E,
    offsetWidth: r,
    offsetHeight: n,
    clientWidth: a,
    clientHeight: i,
    contentWidth: l,
    contentHeight: u,
    inlineCSSWidth: S,
    inlineCSSHeight: w,
    cssWidth: o,
    cssHeight: s,
    minWidth: c,
    minHeight: f,
    maxWidth: h,
    maxHeight: m,
    minOffsetWidth: d,
    minOffsetHeight: v,
    maxOffsetWidth: x,
    maxOffsetHeight: y
  };
}
function Hu(t, e) {
  return $t(e > 0 ? t[0] : t[1], e > 0 ? t[1] : t[0]);
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
function $u(t, e) {
  var r = t === sr(t) || t === so(t), n = {
    clientLeft: t.clientLeft,
    clientTop: t.clientTop,
    clientWidth: t.clientWidth,
    clientHeight: t.clientHeight,
    scrollWidth: t.scrollWidth,
    scrollHeight: t.scrollHeight,
    overflow: !1
  };
  return r && (n.clientHeight = Math.max(e.height, n.clientHeight), n.scrollHeight = Math.max(e.height, n.scrollHeight)), n.overflow = he(t)("overflow") !== "visible", P(P({}, e), n);
}
function ui(t, e, r, n) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, u = e.left, c = {
    left: u + a,
    top: l + o,
    right: u + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return r && n ? $u(r, c) : c;
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
  return t && e ? $u(t, s) : s;
}
function Wv(t) {
  var e = t.props, r = e.groupable, n = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !r && s && n ? Ro(n, i, o) : l;
}
function qu(t, e, r, n) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = r.target;
    a = Vu(i, n);
  }
  return a;
}
function Vu(t, e) {
  if (t) {
    var r = t.getAttribute("data-rotation") || "", n = t.getAttribute("data-direction");
    if (e.deg = r, !!n) {
      var a = [0, 0];
      return n.indexOf("w") > -1 && (a[0] = -1), n.indexOf("e") > -1 && (a[0] = 1), n.indexOf("n") > -1 && (a[1] = -1), n.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function Mo(t, e) {
  return [
    It(e, t[0]),
    It(e, t[1]),
    It(e, t[2]),
    It(e, t[3])
  ];
}
function ke(t) {
  var e = t.left, r = t.top, n = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return Mo([n, a, i, o], [e, r]);
}
function Xi(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(r) {
    r.unset && r.unset(t);
  });
}
function jr(t, e) {
  var r = e ? "controlGesto" : "targetGesto", n = t[r];
  (n == null ? void 0 : n.isIdle()) === !1 && Xi(t, e), n == null || n.unset(), t[r] = null;
}
function ce(t, e) {
  if (e) {
    var r = Vr(e);
    r.nextStyle = P(P({}, r.nextStyle), t);
  }
  return {
    style: t,
    cssText: $r(t).map(function(n) {
      return "".concat(dd(n, "-"), ": ").concat(t[n], ";");
    }).join("")
  };
}
function Uu(t, e, r) {
  var n = e.afterTransform || e.transform;
  return P(P({}, ce(P(P(P({}, t.style), e.style), { transform: n }), r)), { afterTransform: n, transform: t.transform });
}
function wt(t, e, r, n) {
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
function be(t, e, r) {
  var n = e.datas, a = "isDrag" in r ? r.isDrag : e.isDrag;
  return n.datas || (n.datas = {}), P(P({ isDrag: a }, r), { moveable: t, target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, lastEvent: n.lastEvent, isDouble: e.isDouble, datas: n.datas, isFirstDrag: !!e.isFirstDrag });
}
function Ba(t, e, r) {
  t._emitter.on(e, r);
}
function ct(t, e, r, n, a) {
  return t.triggerEvent(e, r, n, a);
}
function _o(t, e) {
  return Ee(t).getComputedStyle(t, e);
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
function Hi(t, e) {
  return t === e || t == null && e == null;
}
function Zs() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var r = t.length - 1, n = 0; n < r; ++n) {
    var a = t[n];
    if (!ro(a))
      return a;
  }
  return t[r];
}
function Ku(t, e) {
  var r = [], n = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n.indexOf(o), l = r[s] || [];
    s === -1 && (n.push(o), r.push(l)), l.push(a);
  }), r;
}
function Yv(t, e) {
  var r = [], n = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n[o];
    s || (s = [], n[o] = s, r.push(s)), s.push(a);
  }), r;
}
function Zu(t) {
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
  return se(Ne(t, r), xr(e, r), r);
}
function Xv(t, e) {
  var r, n = t.is3d, a = t.rootMatrix, i = n ? 4 : 3;
  return r = N(Xr(a, [e.distX, e.distY], i), 2), e.distX = r[0], e.distY = r[1], e;
}
function we(t, e, r, n) {
  if (!r[0] && !r[1])
    return e;
  var a = Lt(t, [qs(r[0] || 1), 0], n), i = Lt(t, [0, qs(r[1] || 1)], n), o = Lt(t, [
    r[0] / _e(a),
    r[1] / _e(i)
  ], n);
  return It(e, o);
}
function Ie(t, e, r) {
  return r ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function Da(t) {
  return H(t) <= fe ? 0 : t;
}
function ko(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var r = Op(e, t), n = r.deg;
    return n ? ht("view-control-rotation".concat(n)) : "";
  };
}
function To(t, e) {
  return e === void 0 && (e = [t]), function(r, n) {
    if (n.isRequest)
      return e.some(function(i) {
        return n.requestAble === i;
      }) ? n.parentDirection : !1;
    var a = n.inputEvent.target;
    return te(a, ht("direction")) && (!t || te(a, ht(t)));
  };
}
function Hv(t, e, r) {
  var n, a = Fr(t, {
    "x%": function(M) {
      return M / 100 * e.offsetWidth;
    },
    "y%": function(M) {
      return M / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, r < 0 ? void 0 : r), o = t.slice(0, r < 0 ? void 0 : r + 1), s = t[r] || "", l = r < 0 ? [] : t.slice(r), u = r < 0 ? [] : t.slice(r + 1), c = a.slice(0, r < 0 ? void 0 : r), f = a.slice(0, r < 0 ? void 0 : r + 1), d = (n = a[r]) !== null && n !== void 0 ? n : Fr([""])[0], v = r < 0 ? [] : a.slice(r), h = r < 0 ? [] : a.slice(r + 1), m = d ? [d] : [], x = Rr(c), y = Rr(f), S = Rr(v), w = Rr(h), E = At(x, S, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: x,
    beforeFunctionMatrix2: y,
    targetFunctionMatrix: Rr(m),
    afterFunctionMatrix: S,
    afterFunctionMatrix2: w,
    allFunctionMatrix: E,
    beforeFunctions: c,
    beforeFunctions2: f,
    targetFunction: m[0],
    afterFunctions: v,
    afterFunctions2: h,
    beforeFunctionTexts: i,
    beforeFunctionTexts2: o,
    targetFunctionText: s,
    afterFunctionTexts: l,
    afterFunctionTexts2: u
  };
}
function $v(t) {
  return !t || !xe(t) || xn(t) ? !1 : Ht(t) || "length" in t;
}
function Fe(t, e) {
  return t ? xn(t) ? t : Me(t) ? e ? document.querySelector(t) : t : Ta(t) ? t() : Vl(t) ? t : "current" in t ? t.current : t : null;
}
function Io(t, e) {
  if (!t)
    return [];
  var r = $v(t) ? [].slice.call(t) : [t];
  return r.reduce(function(n, a) {
    return Me(a) && e ? Q(Q([], N(n), !1), N([].slice.call(document.querySelectorAll(a))), !1) : (Ht(a) ? n.push(Io(a, e)) : n.push(Fe(a, e)), n);
  }, []);
}
function qv(t, e, r) {
  var n = $t(t, e) / Math.PI * 180;
  return n = r >= 0 ? n : 180 - n, n = n >= 0 ? n : 360 + n, n;
}
function Js(t, e) {
  var r = t.rootMatrix, n = t.is3d, a = n ? 4 : 3, i = Ne(r, a);
  return n || (i = Ae(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, fa(i, e);
}
function Ju(t, e, r, n, a) {
  var i = N(t, 2), o = i[0], s = i[1], l = 0, u = 0;
  if (a && o && s) {
    var c = $t([0, 0], e), f = $t([0, 0], n), d = _e(e), v = Math.cos(c - f) * d;
    if (!n[0])
      u = v, l = u * r;
    else if (!n[1])
      l = v, u = l / r;
    else {
      var h = n[0] * o, m = n[1] * s, x = Math.atan2(h + e[0], m + e[1]), y = Math.atan2(h, m);
      x < 0 && (x += Math.PI * 2), y < 0 && (y += Math.PI * 2);
      var S = 0;
      H(x - y) < Math.PI / 2 || H(x - y) > Math.PI / 2 * 3 || (y += Math.PI), S = x - y, S > Math.PI * 2 ? S -= Math.PI * 2 : S > Math.PI ? S = 2 * Math.PI - S : S < -Math.PI && (S = -2 * Math.PI - S);
      var w = _e([h + e[0], m + e[1]]) * Math.cos(S);
      l = w * Math.sin(y) - h, u = w * Math.cos(y) - m, n[0] < 0 && (l *= -1), n[1] < 0 && (u *= -1);
    }
  } else
    l = n[0] * e[0], u = n[1] * e[1];
  return [l, u];
}
function Qu(t, e, r, n) {
  var a, i = r.ratio, o = r.startOffsetWidth, s = r.startOffsetHeight, l = 0, u = 0, c = n.distX, f = n.distY, d = n.pinchScale, v = n.parentDistance, h = n.parentDist, m = n.parentScale, x = r.fixedDirection, y = [0, 1].map(function(_) {
    return H(t[_] - x[_]);
  }), S = [0, 1].map(function(_) {
    var g = y[_];
    return g !== 0 && (g = 2 / g), g;
  });
  if (h)
    l = h[0], u = h[1], e && (l ? u || (u = l / i) : l = u * i);
  else if (gn(d))
    l = (d - 1) * o, u = (d - 1) * s;
  else if (m)
    l = (m[0] - 1) * o, u = (m[1] - 1) * s;
  else if (v) {
    var w = o * y[0], E = s * y[1], M = _e([w, E]);
    l = v / M * w * S[0], u = v / M * E * S[1];
  } else {
    var D = Le({ datas: r, distX: c, distY: f });
    D = S.map(function(_, g) {
      return D[g] * _;
    }), a = N(Ju([o, s], D, i, t, e), 2), l = a[0], u = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: u
  };
}
function $i(t, e) {
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
    var r = N(t.split(" "), 2), n = r[0], a = r[1], i = $i(n || ""), o = $i(a || ""), s = P(P({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function Ro(t, e, r) {
  var n = $i(t, !0), a = n.x, i = n.y;
  return [
    Nt(a, e) || 0,
    Nt(i, r) || 0
  ];
}
function Vv(t, e, r) {
  var n = t.map(function(i) {
    return gt(i, e);
  }), a = n.map(function(i) {
    return Cn(i, r);
  });
  return {
    prev: n,
    next: a,
    result: a.map(function(i) {
      return It(i, e);
    })
  };
}
function tc(t, e) {
  return t.length === e.length && t.every(function(r, n) {
    var a = e[n], i = Ht(r), o = Ht(a);
    return i && o ? tc(r, a) : !i && !o ? r === a : !1;
  });
}
function zr(t, e, r, n, a) {
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
function ci(t, e) {
  return gd(t).map(function(r) {
    return e(r);
  });
}
function ec(t) {
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
var Uv = Mn("pinchable", {
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
    }), d = wt(t, e, {});
    n && (d.targets = n);
    var v = ct(t, u, d);
    r.isPinch = v !== !1, r.ables = f;
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
      var u = a * (1 - 1 / n), c = wt(t, e, {});
      s && (c.targets = s);
      var f = "onPinch".concat(s ? "Group" : "");
      ct(t, f, c);
      var d = r.ables, v = "drag".concat(s ? "Group" : "", "Control");
      return d.forEach(function(h) {
        h[v] && h[v](t, P(P({}, e), { datas: i[h.name], inputEvent: o, resolveMatrix: !0, pinchScale: n, parentDistance: u, parentRotate: l, isPinch: !0 }));
      }), c;
    }
  },
  pinchEnd: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.targets, o = e.originalDatas;
    if (r.isPinch) {
      var s = "onPinch".concat(i ? "Group" : "", "End"), l = be(t, e, { isDrag: n });
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
}), Qs = To("scalable"), Kv = {
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
  render: Su("scalable"),
  dragControlCondition: Qs,
  viewClassName: ko("scalable"),
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = qu(i, n, a, r), s = t.state, l = s.width, u = s.height, c = s.targetTransform, f = s.target, d = s.pos1, v = s.pos2, h = s.pos4;
    if (!o || !f)
      return !1;
    n || Cr(t, e), r.datas = {}, r.transform = c, r.prevDist = [1, 1], r.direction = o, r.startOffsetWidth = l, r.startOffsetHeight = u, r.startValue = [1, 1];
    var m = !o[0] && !o[1] || o[0] || !o[1];
    Oa(t, e, "scale"), r.isWidth = m;
    function x(D) {
      r.ratio = D && isFinite(D) ? D : 0;
    }
    r.startPositions = ke(t.state);
    function y(D) {
      var _ = Ou(r.startPositions, D);
      r.fixedDirection = _.fixedDirection, r.fixedPosition = _.fixedPosition, r.fixedOffset = _.fixedOffset;
    }
    r.setFixedDirection = y, x(Ge(d, v) / Ge(v, h)), y([-o[0], -o[1]]);
    var S = function(D) {
      r.minScaleSize = D;
    }, w = function(D) {
      r.maxScaleSize = D;
    };
    S([-1 / 0, -1 / 0]), w([1 / 0, 1 / 0]);
    var E = wt(t, e, P(P({ direction: o, set: function(D) {
      r.startValue = D;
    }, setRatio: x, setFixedDirection: y, setMinScaleSize: S, setMaxScaleSize: w }, Pa(t, e)), { dragStart: le.dragStart(t, new Lr().dragStart([0, 0], e)) })), M = ct(t, "onScaleStart", E);
    return r.startFixedDirection = r.fixedDirection, M !== !1 && (r.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), r.isScale ? E : !1;
  },
  dragControl: function(t, e) {
    Ia(t, e, "scale");
    var r = e.datas, n = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, u = e.resolveMatrix, c = r.prevDist, f = r.direction, d = r.startOffsetWidth, v = r.startOffsetHeight, h = r.isScale, m = r.startValue, x = r.isWidth, y = r.ratio;
    if (!h)
      return !1;
    var S = t.props, w = S.throttleScale, E = S.parentMoveable, M = f;
    !f[0] && !f[1] && (M = [1, 1]);
    var D = y && (n ?? S.keepRatio) || !1, _ = t.state, g = [
      m[0],
      m[1]
    ];
    function T() {
      var U = Qu(M, D, r, e), ut = U.distWidth, yt = U.distHeight, mt = d ? (d + ut) / d : 1, dt = v ? (v + yt) / v : 1;
      m[0] || (g[0] = ut / d), m[1] || (g[1] = yt / v);
      var bt = (M[0] || D ? mt : 1) * g[0], xt = (M[1] || D ? dt : 1) * g[1];
      return bt === 0 && (bt = ue(c[0]) * Zn), xt === 0 && (xt = ue(c[1]) * Zn), [bt, xt];
    }
    var k = T();
    if (!i && t.props.groupable) {
      var A = _.snapRenderInfo || {}, O = A.direction;
      Ht(O) && (O[0] || O[1]) && (_.snapRenderInfo = { direction: f, request: e.isRequest });
    }
    ct(t, "onBeforeScale", wt(t, e, {
      scale: k,
      setFixedDirection: function(U) {
        return r.setFixedDirection(U), k = T(), k;
      },
      startFixedDirection: r.startFixedDirection,
      setScale: function(U) {
        k = U;
      }
    }, !0));
    var R = [
      k[0] / g[0],
      k[1] / g[1]
    ], j = o, z = [0, 0], W = ue(R[0] * R[1]), Y = !o && !a && i;
    if (Y || u ? j = xo(t, r.targetAllTransform, [0, 0], [0, 0], r) : o || (j = r.fixedPosition), i || (z = _v(t, R, f, !l && s, r)), D) {
      M[0] && M[1] && z[0] && z[1] && (Math.abs(z[0] * d) > Math.abs(z[1] * v) ? z[1] = 0 : z[0] = 0);
      var L = !z[0] && !z[1];
      if (L && (x ? R[0] = St(R[0] * g[0], w) / g[0] : R[1] = St(R[1] * g[1], w) / g[1]), M[0] && !M[1] || z[0] && !z[1] || L && x) {
        R[0] += z[0];
        var q = d * R[0] * g[0] / y;
        R[1] = ue(W * R[0]) * H(q / v / g[1]);
      } else if (!M[0] && M[1] || !z[0] && z[1] || L && !x) {
        R[1] += z[1];
        var V = v * R[1] * g[1] * y;
        R[0] = ue(W * R[1]) * H(V / d / g[0]);
      }
    } else
      R[0] += z[0], R[1] += z[1], z[0] || (R[0] = St(R[0] * g[0], w) / g[0]), z[1] || (R[1] = St(R[1] * g[1], w) / g[1]);
    R[0] === 0 && (R[0] = ue(c[0]) * Zn), R[1] === 0 && (R[1] = ue(c[1]) * Zn), k = Rv(R, [g[0], g[1]]);
    var F = [
      d,
      v
    ], rt = [
      d * k[0],
      v * k[1]
    ];
    rt = io(rt, r.minScaleSize, r.maxScaleSize, D ? y : !1), k = ci(2, function(U) {
      return F[U] ? rt[U] / F[U] : rt[U];
    }), R = ci(2, function(U) {
      return k[U] / g[U];
    });
    var et = ci(2, function(U) {
      return c[U] ? R[U] / c[U] : R[U];
    }), Z = "scale(".concat(R.join(", "), ")"), it = "scale(".concat(k.join(", "), ")"), tt = Ra(r, it, Z), st = !m[0] || !m[1], nt = _p(t, st ? it : Z, r.fixedDirection, j, r.fixedOffset, r, st), pt = Y ? nt : gt(nt, r.prevInverseDist || [0, 0]);
    if (r.prevDist = R, r.prevInverseDist = nt, k[0] === c[0] && k[1] === c[1] && pt.every(function(U) {
      return !U;
    }) && !E && !Y)
      return !1;
    var Ct = wt(t, e, P({ offsetWidth: d, offsetHeight: v, direction: f, scale: k, dist: R, delta: et, isPinch: !!i }, hu(t, tt, pt, i, e)));
    return ct(t, "onScale", Ct), Ct;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (!r.isScale)
      return !1;
    r.isScale = !1;
    var n = be(t, e, {});
    return ct(t, "onScaleEnd", n), n;
  },
  dragGroupControlCondition: Qs,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var a = Oe(t, "resizable", e);
    r.moveableScale = t.scale;
    var i = qe(t, this, "dragControlStart", e, function(u, c) {
      return ba(t, u, r, c);
    }), o = function(u) {
      n.setFixedDirection(u), i.forEach(function(c, f) {
        c.setFixedDirection(u), ba(t, c.moveable, r, a[f]);
      });
    };
    r.setFixedDirection = o;
    var s = P(P({}, n), { targets: t.props.targets, events: i, setFixedDirection: o }), l = ct(t, "onScaleGroupStart", s);
    return r.isScale = l !== !1, r.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isScale) {
      Ba(t, "onBeforeScale", function(c) {
        ct(t, "onBeforeScaleGroup", wt(t, e, P(P({}, c), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = n.dist, i = r.moveableScale;
        t.scale = [
          a[0] * i[0],
          a[1] * i[1]
        ];
        var o = t.props.keepRatio, s = r.fixedPosition, l = qe(t, this, "dragControl", e, function(c, f) {
          var d = N(se(wn(t.rotation / 180 * Math.PI, 3), [
            f.datas.originalX * a[0],
            f.datas.originalY * a[1],
            1
          ], 3), 2), v = d[0], h = d[1];
          return P(P({}, f), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: It(s, [v, h])
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
      var a = qe(t, this, "dragControlEnd", e), i = be(t, e, {
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
    return va(r, e[n], 1, 2);
  });
}
function tl(t, e, r) {
  var n = $t(t, e), a = $t(t, r), i = a - n;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function Zv(t, e) {
  var r = tl(t[0], t[1], t[2]), n = tl(e[0], e[1], e[2]), a = Math.PI;
  return !(r >= a && n <= a || r <= a && n >= a);
}
var Jv = {
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
  viewClassName: ko("warpable"),
  render: function(t, e) {
    var r = t.props, n = r.resizable, a = r.scalable, i = r.warpable, o = r.zoom;
    if (n || a || !i)
      return [];
    var s = t.state, l = s.pos1, u = s.pos2, c = s.pos3, f = s.pos4, d = tr(l, u), v = tr(u, l), h = tr(l, c), m = tr(c, l), x = tr(c, f), y = tr(f, c), S = tr(u, f), w = tr(f, u);
    return Q([
      e.createElement("div", { className: ht("line"), key: "middeLine1", style: on(d, x, o) }),
      e.createElement("div", { className: ht("line"), key: "middeLine2", style: on(v, y, o) }),
      e.createElement("div", { className: ht("line"), key: "middeLine3", style: on(h, S, o) }),
      e.createElement("div", { className: ht("line"), key: "middeLine4", style: on(m, w, o) })
    ], N(Cu(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var r = e.inputEvent.target;
    return te(r, ht("direction")) && te(r, ht("warpable"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.inputEvent, a = t.props.target, i = n.target, o = Vu(i, r);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, u = s.is3d, c = s.targetTransform, f = s.targetMatrix, d = s.width, v = s.height, h = s.left, m = s.top;
    r.datas = {}, r.targetTransform = c, r.warpTargetMatrix = u ? f : Ae(f, 3, 4), r.targetInverseMatrix = Ul(Ne(r.warpTargetMatrix, 4), 3, 4), r.direction = o, r.left = h, r.top = m, r.poses = [
      [0, 0],
      [d, 0],
      [0, v],
      [d, v]
    ].map(function(S) {
      return gt(S, l);
    }), r.nextPoses = r.poses.map(function(S) {
      var w = N(S, 2), E = w[0], M = w[1];
      return se(r.warpTargetMatrix, [E, M, 0, 1], 4);
    }), r.startValue = zt(4), r.prevMatrix = zt(4), r.absolutePoses = ke(s), r.posIndexes = vu(o), Cr(t, e), Oa(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var x = wt(t, e, P({ set: function(S) {
      r.startValue = S;
    } }, Pa(t, e))), y = ct(t, "onWarpStart", x);
    return y !== !1 && (r.isWarp = !0), r.isWarp;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isRequest, a = e.distX, i = e.distY, o = r.targetInverseMatrix, s = r.prevMatrix, l = r.isWarp, u = r.startValue, c = r.poses, f = r.posIndexes, d = r.absolutePoses;
    if (!l)
      return !1;
    if (Ia(t, e, "matrix3d"), Ur(t, "warpable")) {
      var v = f.map(function(T) {
        return d[T];
      });
      v.length > 1 && v.push([
        (v[0][0] + v[1][0]) / 2,
        (v[0][1] + v[1][1]) / 2
      ]);
      var h = ja(t, n, {
        horizontal: v.map(function(T) {
          return T[1] + i;
        }),
        vertical: v.map(function(T) {
          return T[0] + a;
        })
      }), m = h.horizontal, x = h.vertical;
      i -= m.offset, a -= x.offset;
    }
    var y = Le({ datas: r, distX: a, distY: i }, !0), S = r.nextPoses.slice();
    if (f.forEach(function(T) {
      S[T] = It(S[T], y);
    }), !gp.every(function(T) {
      return Zv(T.map(function(k) {
        return c[k];
      }), T.map(function(k) {
        return S[k];
      }));
    }))
      return !1;
    var w = uo(c[0], c[2], c[1], c[3], S[0], S[2], S[1], S[3]);
    if (!w.length)
      return !1;
    var E = At(o, w, 4), M = du(r, E, !0), D = At(Ne(s, 4), M, 4);
    r.prevMatrix = M;
    var _ = At(u, M, 4), g = Ra(r, "matrix3d(".concat(_.join(", "), ")"), "matrix3d(".concat(M.join(", "), ")"));
    return mo(e, g), ct(t, "onWarp", wt(t, e, P({ delta: D, matrix: _, dist: M, multiply: At, transform: g }, ce({
      transform: g
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.isDrag;
    return r.isWarp ? (r.isWarp = !1, ct(t, "onWarpEnd", be(t, e, {})), n) : !1;
  }
}, Qv = /* @__PURE__ */ ht("area-pieces"), na = /* @__PURE__ */ ht("area-piece"), rc = /* @__PURE__ */ ht("avoid"), th = ht("view-dragging");
function fi(t) {
  var e = t.areaElement;
  if (e) {
    var r = t.state, n = r.width, a = r.height;
    ql(e, rc), e.style.cssText += "left: 0px; top: 0px; width: ".concat(n, "px; height: ").concat(a, "px");
  }
}
function el(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: Qv },
    t.createElement("div", { className: na }),
    t.createElement("div", { className: na }),
    t.createElement("div", { className: na }),
    t.createElement("div", { className: na })
  );
}
var nc = {
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
    var r = t.props, n = r.target, a = r.dragArea, i = r.groupable, o = r.passDragArea, s = t.getState(), l = s.width, u = s.height, c = s.renderPoses, f = o ? ht("area", "pass") : ht("area");
    if (i)
      return [
        e.createElement("div", { key: "area", ref: nr(t, "areaElement"), className: f }),
        el(e)
      ];
    if (!n || !a)
      return [];
    var d = uo([0, 0], [l, 0], [0, u], [l, u], c[0], c[1], c[2], c[3]), v = d.length ? za(d, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: nr(t, "areaElement"), className: f, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(u, "px"),
        transformOrigin: "0 0",
        transform: v
      } }),
      el(e)
    ];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    r.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, u = s.renderPoses, c = s.rootMatrix, f = s.is3d, d = l.left, v = l.top, h = De(u), m = h.left, x = h.top, y = h.width, S = h.height, w = f ? 4 : 3, E = N(Xr(c, [n - d, a - v], w), 2), M = E[0], D = E[1];
    M -= m, D -= x;
    var _ = [
      { left: m, top: x, width: y, height: D - 10 },
      { left: m, top: x, width: M - 10, height: S },
      { left: m, top: x + D + 10, width: y, height: S - D - 10 },
      { left: m + M + 10, top: x, width: y - M - 10, height: S }
    ], g = [].slice.call(o.nextElementSibling.children);
    _.forEach(function(T, k) {
      g[k].style.cssText = "left: ".concat(T.left, "px;top: ").concat(T.top, "px; width: ").concat(T.width, "px; height: ").concat(T.height, "px;");
    }), oo(o, rc), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var r = e.datas, n = e.inputEvent;
    if (this.enableNativeEvent(t), !n)
      return !1;
    r.isDragArea || (r.isDragArea = !0, fi(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var r = e.inputEvent, n = e.datas;
    if (!r)
      return !1;
    n.isDragArea || fi(t);
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
    fi(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && $l(function() {
      e.disableNativeEvent = !1;
    });
  }
}, eh = Mn("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var r = t.props, n = r.zoom, a = r.svgOrigin, i = r.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, u = o.svg, c = o.allMatrix, f = o.is3d, d = o.left, v = o.top, h = o.offsetWidth, m = o.offsetHeight, x;
    if (!i && u && a) {
      var y = N(Ro(a, h, m), 2), S = y[0], w = y[1], E = f ? 4 : 3, M = Lt(c, [S, w], E);
      x = Ea(l, n, gt(M, [d, v]));
    } else
      x = Ea(l, n, s);
    return [
      e.createElement("div", { className: ht("control", "origin"), style: x, key: "beforeOrigin" })
    ];
  }
});
function rh(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var nh = {
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
    var r = t.props, n = r.scrollContainer, a = n === void 0 ? t.getContainer() : n, i = r.scrollOptions, o = new tu(), s = Fe(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", u = e.targets;
    o.on("scroll", function(c) {
      var f = c.container, d = c.direction, v = wt(t, e, {
        scrollContainer: f,
        direction: d
      }), h = u ? "onScrollGroup" : "onScroll";
      u && (v.targets = u), ct(t, h, v);
    }).on("move", function(c) {
      var f = c.offsetX, d = c.offsetY, v = c.inputEvent;
      t[l].scrollBy(f, d, v.inputEvent, !1);
    }).on("scrollDrag", function(c) {
      var f = c.next;
      f(t[l].getCurrentEvent());
    }), o.dragStart(e, P({ container: s }, i));
  },
  checkScroll: function(t, e) {
    var r = e.datas.dragScroll;
    if (r) {
      var n = t.props, a = n.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = n.scrollThreshold, s = o === void 0 ? 0 : o, l = n.scrollThrottleTime, u = l === void 0 ? 0 : l, c = n.getScrollPosition, f = c === void 0 ? rh : c, d = n.scrollOptions;
      return r.drag(e, P({ container: i, threshold: s, throttleTime: u, getScrollPosition: function(v) {
        return f({ scrollContainer: v.container, direction: v.direction });
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
}, ac = {
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
}, ah = Mn("padding", {
  props: ["padding"],
  render: function(t, e) {
    var r = t.props;
    if (r.dragArea)
      return [];
    var n = ec(r.padding || {}), a = n.left, i = n.top, o = n.right, s = n.bottom, l = t.getState(), u = l.renderPoses, c = l.pos1, f = l.pos2, d = l.pos3, v = l.pos4, h = [c, f, d, v], m = [];
    return a > 0 && m.push([0, 2]), i > 0 && m.push([0, 1]), o > 0 && m.push([1, 3]), s > 0 && m.push([2, 3]), m.map(function(x, y) {
      var S = N(x, 2), w = S[0], E = S[1], M = h[w], D = h[E], _ = u[w], g = u[E], T = uo([0, 0], [100, 0], [0, 100], [100, 100], M, D, _, g);
      if (T.length)
        return e.createElement("div", { key: "padding".concat(y), className: ht("padding"), style: {
          transform: za(T, !0)
        } });
    });
  }
}), rl = ["nw", "ne", "se", "sw"];
function aa(t, e) {
  var r = t[0] + t[1], n = r > e ? e / r : 1;
  return t[0] *= n, t[1] = e - t[1] * n, t;
}
var ih = [1, 2, 5, 6], oh = [0, 3, 4, 7], pr = [1, -1, -1, 1], vr = [1, 1, -1, -1];
function Po(t, e, r, n, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = r), s === void 0 && (s = n);
  var l = [], u = !1, c = t.filter(function(d) {
    return !d.virtual;
  }), f = c.map(function(d) {
    var v = d.horizontal, h = d.vertical, m = d.pos;
    if (h && !u && (u = !0, l.push("/")), u) {
      var x = Math.max(0, h === 1 ? m[1] - i : s - m[1]);
      return l.push(Ie(x, n, e)), x;
    } else {
      var x = Math.max(0, v === 1 ? m[0] - a : o - m[0]);
      return l.push(Ie(x, r, e)), x;
    }
  });
  return {
    radiusPoses: c,
    styles: l,
    raws: f
  };
}
function ic(t) {
  for (var e = [0, 0], r = [0, 0], n = t.length, a = 0; a < n; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, r[0] = a + 1), i.vertical && (r[1] === 0 && (r[0] = a), r[1] = a - r[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: r
  };
}
function oc(t, e, r, n, a, i, o) {
  var s, l, u, c;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var f = t.indexOf("/"), d = (f > -1 ? t.slice(0, f) : t).length, v = t.slice(0, d), h = t.slice(d + 1), m = v.length, x = h.length, y = x > 0, S = N(v, 4), w = S[0], E = w === void 0 ? "0px" : w, M = S[1], D = M === void 0 ? E : M, _ = S[2], g = _ === void 0 ? E : _, T = S[3], k = T === void 0 ? D : T, A = N(h, 4), O = A[0], R = O === void 0 ? E : O, j = A[1], z = j === void 0 ? y ? R : D : j, W = A[2], Y = W === void 0 ? y ? R : g : W, L = A[3], q = L === void 0 ? y ? z : k : L, V = [E, D, g, k].map(function(tt) {
    return Nt(tt, e);
  }), F = [R, z, Y, q].map(function(tt) {
    return Nt(tt, r);
  }), rt = V.slice(), et = F.slice();
  s = N(aa([rt[0], rt[1]], e), 2), rt[0] = s[0], rt[1] = s[1], l = N(aa([rt[3], rt[2]], e), 2), rt[3] = l[0], rt[2] = l[1], u = N(aa([et[0], et[3]], r), 2), et[0] = u[0], et[3] = u[1], c = N(aa([et[1], et[2]], r), 2), et[1] = c[0], et[2] = c[1];
  var Z = o ? rt : rt.slice(0, Math.max(i[0], m)), it = o ? et : et.slice(0, Math.max(i[1], x));
  return Q(Q([], N(Z.map(function(tt, st) {
    var nt = rl[st];
    return {
      virtual: st >= m,
      horizontal: pr[st],
      vertical: 0,
      pos: [n + tt, a + (vr[st] === -1 ? r : 0)],
      sub: !0,
      raw: V[st],
      direction: nt
    };
  })), !1), N(it.map(function(tt, st) {
    var nt = rl[st];
    return {
      virtual: st >= x,
      horizontal: 0,
      vertical: vr[st],
      pos: [n + (pr[st] === -1 ? e : 0), a + tt],
      sub: !0,
      raw: F[st],
      direction: nt
    };
  })), !1);
}
function sh(t, e, r, n, a) {
  a === void 0 && (a = e.length);
  var i = ic(t.slice(n)), o = i.horizontalRange, s = i.verticalRange, l = r - n, u = 0;
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
function lh(t, e, r, n, a, i, o, s, l, u, c) {
  u === void 0 && (u = 0), c === void 0 && (c = 0);
  var f = ic(t.slice(r)), d = f.horizontalRange, v = f.verticalRange;
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
    var S = vr[a] === 1 ? o - c : l - o;
    if (d[1] === 0 && v[1] === 0) {
      var w = [
        u + S,
        c
      ];
      t.push({
        horizontal: pr[0],
        vertical: 0,
        pos: w
      }), e.push(w);
    }
    for (var E = v[0], m = v[1]; m <= a; ++m) {
      var y = pr[m] === 1 ? u : s, x = 0;
      if (a === m ? x = o : m === 0 ? x = c + S : vr[m] === 1 ? x = e[r + E][1] : vr[m] === -1 && (x = l - (e[r + E][1] - c)), t.push({
        horizontal: 0,
        vertical: vr[m],
        pos: [y, x]
      }), e.push([y, x]), m === 0)
        break;
    }
  }
}
function uh(t, e) {
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
var ch = [
  [0, -1, "n"],
  [1, 0, "e"]
], fh = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function Oo(t, e, r) {
  var n = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, u = s.poses, c = l === "rect", f = l === "circle";
  if (l === "polygon")
    return r.map(function(D) {
      return "".concat(Ie(D[0], i, n), " ").concat(Ie(D[1], o, n));
    });
  if (c || l === "inset") {
    var d = r[1][1], v = r[3][0], h = r[7][0], m = r[5][1];
    if (c)
      return [
        d,
        v,
        m,
        h
      ].map(function(D) {
        return "".concat(D, "px");
      });
    var x = [d, i - v, o - m, h].map(function(D, _) {
      return Ie(D, _ % 2 ? i : o, n);
    });
    if (r.length > 8) {
      var y = N(gt(r[4], r[0]), 2), S = y[0], w = y[1];
      x.push.apply(x, Q(["round"], N(Po(u.slice(8).map(function(D, _) {
        return P(P({}, D), { pos: r[_] });
      }), n, S, w, h, d, v, m).styles), !1));
    }
    return x;
  } else if (f || l === "ellipse") {
    var E = r[0], M = Ie(H(r[1][1] - E[1]), f ? Math.sqrt((i * i + o * o) / 2) : o, n), x = f ? [M] : [Ie(H(r[2][0] - E[0]), i, n), M];
    return x.push("at", Ie(E[0], i, n), Ie(E[1], o, n)), x;
  }
}
function Ma(t, e, r, n) {
  var a = [n, (n + e) / 2, e], i = [t, (t + r) / 2, r];
  return fh.map(function(o) {
    var s = N(o, 3), l = s[0], u = s[1], c = s[2], f = a[l + 1], d = i[u + 1];
    return {
      vertical: H(u),
      horizontal: H(l),
      direction: c,
      pos: [f, d]
    };
  });
}
function sc(t) {
  var e = [1 / 0, -1 / 0], r = [1 / 0, -1 / 0];
  return t.forEach(function(n) {
    var a = n.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), r[0] = Math.min(r[0], a[1]), r[1] = Math.max(r[1], a[1]);
  }), [
    H(e[1] - e[0]),
    H(r[1] - r[0])
  ];
}
function nl(t, e, r, n, a) {
  var i, o, s, l, u, c, f, d, v;
  if (t) {
    var h = a;
    if (!h) {
      var m = he(t), x = m("clipPath");
      h = x !== "none" ? x : m("clip");
    }
    if (!((!h || h === "none" || h === "auto") && (h = n, !h))) {
      var y = Hl(h), S = y.prefix, w = S === void 0 ? h : S, E = y.value, M = E === void 0 ? "" : E, D = w === "circle", _ = " ";
      if (w === "polygon") {
        var g = hr(M || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        _ = ",";
        var T = g.map(function(Ft) {
          var qt = N(Ft.split(" "), 2), Bt = qt[0], Rt = qt[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              Nt(Bt, e),
              Nt(Rt, r)
            ]
          };
        }), k = br(T.map(function(Ft) {
          return Ft.pos;
        }));
        return {
          type: w,
          clipText: h,
          poses: T,
          splitter: _,
          left: k.minX,
          right: k.maxX,
          top: k.minY,
          bottom: k.maxY
        };
      } else if (D || w === "ellipse") {
        var A = "", O = "", R = 0, j = 0, g = ar(M);
        if (D) {
          var z = "";
          i = N(g, 4), o = i[0], z = o === void 0 ? "50%" : o, s = i[2], A = s === void 0 ? "50%" : s, l = i[3], O = l === void 0 ? "50%" : l, R = Nt(z, Math.sqrt((e * e + r * r) / 2)), j = R;
        } else {
          var W = "", Y = "";
          u = N(g, 5), c = u[0], W = c === void 0 ? "50%" : c, f = u[1], Y = f === void 0 ? "50%" : f, d = u[3], A = d === void 0 ? "50%" : d, v = u[4], O = v === void 0 ? "50%" : v, R = Nt(W, e), j = Nt(Y, r);
        }
        var L = [
          Nt(A, e),
          Nt(O, r)
        ], T = Q([
          {
            vertical: 1,
            horizontal: 1,
            pos: L,
            direction: "nesw"
          }
        ], N(ch.slice(0, D ? 1 : 2).map(function(Bt) {
          return {
            vertical: H(Bt[1]),
            horizontal: Bt[0],
            direction: Bt[2],
            sub: !0,
            pos: [
              L[0] + Bt[0] * R,
              L[1] + Bt[1] * j
            ]
          };
        })), !1);
        return {
          type: w,
          clipText: h,
          radiusX: R,
          radiusY: j,
          left: L[0] - R,
          top: L[1] - j,
          right: L[0] + R,
          bottom: L[1] + j,
          poses: T,
          splitter: _
        };
      } else if (w === "inset") {
        var g = ar(M || "0 0 0 0"), q = g.indexOf("round"), V = (q > -1 ? g.slice(0, q) : g).length, F = g.slice(V + 1), rt = N(g.slice(0, V), 4), et = rt[0], Z = rt[1], it = Z === void 0 ? et : Z, tt = rt[2], st = tt === void 0 ? et : tt, nt = rt[3], pt = nt === void 0 ? it : nt, Ct = N([et, st].map(function(Bt) {
          return Nt(Bt, r);
        }), 2), U = Ct[0], ut = Ct[1], yt = N([pt, it].map(function(Bt) {
          return Nt(Bt, e);
        }), 2), mt = yt[0], dt = yt[1], bt = e - dt, xt = r - ut, kt = oc(F, bt - mt, xt - U, mt, U), T = Q(Q([], N(Ma(U, bt, xt, mt)), !1), N(kt), !1);
        return {
          type: "inset",
          clipText: h,
          poses: T,
          top: U,
          left: mt,
          right: bt,
          bottom: xt,
          radius: F,
          splitter: _
        };
      } else if (w === "rect") {
        var g = hr(M || "0px, ".concat(e, "px, ").concat(r, "px, 0px"));
        _ = ",";
        var vt = N(g.map(function(je) {
          var Te = mr(je).value;
          return Te;
        }), 4), Mt = vt[0], dt = vt[1], ut = vt[2], mt = vt[3], T = Ma(Mt, dt, ut, mt);
        return {
          type: "rect",
          clipText: h,
          poses: T,
          top: Mt,
          right: dt,
          bottom: ut,
          left: mt,
          values: g,
          splitter: _
        };
      }
    }
  }
}
function dh(t, e, r, n, a) {
  var i = t[e], o = i.direction, s = i.sub, l = t.map(function() {
    return [0, 0];
  }), u = o ? o.split("") : [];
  if (n && e < 8) {
    var c = u.filter(function(R) {
      return R === "w" || R === "e";
    }), f = u.filter(function(R) {
      return R === "n" || R === "s";
    }), d = c[0], v = f[0];
    l[e] = r;
    var h = N(sc(t), 2), m = h[0], x = h[1], y = m && x ? m / x : 0;
    if (y && a) {
      var S = (e + 4) % 8, w = t[S].pos, E = [0, 0];
      o.indexOf("w") > -1 ? E[0] = -1 : o.indexOf("e") > -1 && (E[0] = 1), o.indexOf("n") > -1 ? E[1] = -1 : o.indexOf("s") > -1 && (E[1] = 1);
      var M = Ju([m, x], r, y, E, !0), D = m + M[0], _ = x + M[1], g = w[1], T = w[1], k = w[0], A = w[0];
      E[0] === -1 ? k = A - D : E[0] === 1 ? A = k + D : (k = k - D / 2, A = A + D / 2), E[1] === -1 ? g = T - _ : (E[1] === 1 || (g = T - _ / 2), T = g + _);
      var O = Ma(g, A, T, k);
      t.forEach(function(R, j) {
        l[j][0] = O[j].pos[0] - R.pos[0], l[j][1] = O[j].pos[1] - R.pos[1];
      });
    } else
      t.forEach(function(R, j) {
        var z = R.direction;
        z && (z.indexOf(d) > -1 && (l[j][0] = r[0]), z.indexOf(v) > -1 && (l[j][1] = r[1]));
      }), d && (l[1][0] = r[0] / 2, l[5][0] = r[0] / 2), v && (l[3][1] = r[1] / 2, l[7][1] = r[1] / 2);
  } else o && !s ? u.forEach(function(R) {
    var j = R === "n" || R === "s";
    t.forEach(function(z, W) {
      var Y = z.direction, L = z.horizontal, q = z.vertical;
      !Y || Y.indexOf(R) === -1 || (l[W] = [
        j || !L ? 0 : r[0],
        !j || !q ? 0 : r[1]
      ]);
    });
  }) : l[e] = r;
  return l;
}
function ph(t, e) {
  var r = N(fu(t, e), 2), n = r[0], a = r[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, u = l.type, c = l.poses, f = l.splitter, d = c.map(function(S) {
    return S.pos;
  });
  if (u === "polygon")
    d.splice(s, 0, [n, a]);
  else if (u === "inset") {
    var v = ih.indexOf(s), h = oh.indexOf(s), m = c.length;
    if (lh(c, d, 8, v, h, n, a, d[4][0], d[4][1], d[0][0], d[0][1]), m === c.length)
      return;
  } else
    return;
  var x = Oo(t, o, d), y = "".concat(u, "(").concat(x.join(f), ")");
  ct(t, "onClip", wt(t, e, P({ clipEventType: "added", clipType: u, poses: d, clipStyles: x, clipStyle: y, distX: 0, distY: 0 }, ce({
    clipPath: y
  }, e))));
}
function vh(t, e) {
  var r = e.datas, n = r.clipPath, a = r.clipIndex, i = n, o = i.type, s = i.poses, l = i.splitter, u = s.map(function(v) {
    return v.pos;
  }), c = u.length;
  if (o === "polygon")
    s.splice(a, 1), u.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (sh(s, u, a, 8, c), c === s.length))
      return;
  } else
    return;
  var f = Oo(t, n, u), d = "".concat(o, "(").concat(f.join(l), ")");
  ct(t, "onClip", wt(t, e, P({ clipEventType: "removed", clipType: o, poses: u, clipStyles: f, clipStyle: d, distX: 0, distY: 0 }, ce({
    clipPath: d
  }, e))));
}
var hh = {
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
    var r = t.props, n = r.customClipPath, a = r.defaultClipPath, i = r.clipArea, o = r.zoom, s = r.groupable, l = t.getState(), u = l.target, c = l.width, f = l.height, d = l.allMatrix, v = l.is3d, h = l.left, m = l.top, x = l.pos1, y = l.pos2, S = l.pos3, w = l.pos4, E = l.clipPathState, M = l.snapBoundInfos, D = l.rotation;
    if (!u || s)
      return [];
    var _ = nl(u, c, f, a || "inset", E || n);
    if (!_)
      return [];
    var g = v ? 4 : 3, T = _.type, k = _.poses, A = k.map(function(dt) {
      var bt = Lt(d, dt.pos, g);
      return [
        bt[0] - h,
        bt[1] - m
      ];
    }), O = [], R = [], j = T === "rect", z = T === "inset", W = T === "polygon";
    if (j || z || W) {
      var Y = z ? A.slice(0, 8) : A;
      R = Y.map(function(dt, bt) {
        var xt = bt === 0 ? Y[Y.length - 1] : Y[bt - 1], kt = $t(xt, dt), vt = Yu(xt, dt);
        return e.createElement("div", { key: "clipLine".concat(bt), className: ht("line", "clip-line", "snap-control"), "data-clip-index": bt, style: {
          width: "".concat(vt, "px"),
          transform: "translate(".concat(xt[0], "px, ").concat(xt[1], "px) rotate(").concat(kt, "rad) scaleY(").concat(o, ")")
        } });
      });
    }
    if (O = A.map(function(dt, bt) {
      return e.createElement("div", { key: "clipControl".concat(bt), className: ht("control", "clip-control", "snap-control"), "data-clip-index": bt, style: {
        transform: "translate(".concat(dt[0], "px, ").concat(dt[1], "px) rotate(").concat(D, "rad) scale(").concat(o, ")")
      } });
    }), z && O.push.apply(O, Q([], N(A.slice(8).map(function(dt, bt) {
      return e.createElement("div", { key: "clipRadiusControl".concat(bt), className: ht("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + bt, style: {
        transform: "translate(".concat(dt[0], "px, ").concat(dt[1], "px) rotate(").concat(D, "rad) scale(").concat(o, ")")
      } });
    })), !1)), T === "circle" || T === "ellipse") {
      var L = _.left, q = _.top, V = _.radiusX, F = _.radiusY, rt = N(gt(Lt(d, [L, q], g), Lt(d, [0, 0], g)), 2), et = rt[0], Z = rt[1], it = "none";
      if (!i) {
        for (var tt = Math.max(10, V / 5, F / 5), st = [], nt = 0; nt <= tt; ++nt) {
          var pt = Math.PI * 2 / tt * nt;
          st.push([
            V + (V - o) * Math.cos(pt),
            F + (F - o) * Math.sin(pt)
          ]);
        }
        st.push([V, -2]), st.push([-2, -2]), st.push([-2, F * 2 + 2]), st.push([V * 2 + 2, F * 2 + 2]), st.push([V * 2 + 2, -2]), st.push([V, -2]), it = "polygon(".concat(st.map(function(dt) {
          return "".concat(dt[0], "px ").concat(dt[1], "px");
        }).join(", "), ")");
      }
      O.push(e.createElement("div", { key: "clipEllipse", className: ht("clip-ellipse", "snap-control"), style: {
        width: "".concat(V * 2, "px"),
        height: "".concat(F * 2, "px"),
        clipPath: it,
        transform: "translate(".concat(-h + et, "px, ").concat(-m + Z, "px) ").concat(za(d))
      } }));
    }
    if (i) {
      var Ct = De(Q([x, y, S, w], N(A), !1)), U = Ct.width, ut = Ct.height, yt = Ct.left, mt = Ct.top;
      if (W || j || z) {
        var st = z ? A.slice(0, 8) : A;
        O.push(e.createElement("div", { key: "clipArea", className: ht("clip-area", "snap-control"), style: {
          width: "".concat(U, "px"),
          height: "".concat(ut, "px"),
          transform: "translate(".concat(yt, "px, ").concat(mt, "px)"),
          clipPath: "polygon(".concat(st.map(function(bt) {
            return "".concat(bt[0] - yt, "px ").concat(bt[1] - mt, "px");
          }).join(", "), ")")
        } }));
      }
    }
    return M && ["vertical", "horizontal"].forEach(function(dt) {
      var bt = M[dt], xt = dt === "horizontal";
      bt.isSnap && R.push.apply(R, Q([], N(bt.snap.posInfos.map(function(kt, vt) {
        var Mt = kt.pos, Ft = gt(Lt(d, xt ? [0, Mt] : [Mt, 0], g), [h, m]), qt = gt(Lt(d, xt ? [c, Mt] : [Mt, f], g), [h, m]);
        return yn(e, "", Ft, qt, o, "clip".concat(dt, "snap").concat(vt), "guideline");
      })), !1)), bt.isBound && R.push.apply(R, Q([], N(bt.bounds.map(function(kt, vt) {
        var Mt = kt.pos, Ft = gt(Lt(d, xt ? [0, Mt] : [Mt, 0], g), [h, m]), qt = gt(Lt(d, xt ? [c, Mt] : [Mt, f], g), [h, m]);
        return yn(e, "", Ft, qt, o, "clip".concat(dt, "bounds").concat(vt), "guideline", "bounds", "bold");
      })), !1));
    }), Q(Q([], N(O), !1), N(R), !1);
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
    var r = t.state, n = t.props, a = n.defaultClipPath, i = n.customClipPath, o = r.target, s = r.width, l = r.height, u = e.inputEvent ? e.inputEvent.target : null, c = u && u.getAttribute("class") || "", f = e.datas, d = nl(o, s, l, a || "inset", i);
    if (!d)
      return !1;
    var v = d.clipText, h = d.type, m = d.poses, x = ct(t, "onClipStart", wt(t, e, {
      clipType: h,
      clipStyle: v,
      poses: m.map(function(y) {
        return y.pos;
      })
    }));
    return x === !1 ? (f.isClipStart = !1, !1) : (f.isControl = c && c.indexOf("clip-control") > -1, f.isLine = c.indexOf("clip-line") > -1, f.isArea = c.indexOf("clip-area") > -1 || c.indexOf("clip-ellipse") > -1, f.clipIndex = u ? parseInt(u.getAttribute("data-clip-index"), 10) : -1, f.clipPath = d, f.isClipStart = !0, r.clipPathState = v, Cr(t, e), !0);
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, u = l.isControl, c = l.isLine, f = l.isArea, d = l.clipIndex, v = l.clipPath;
    if (!v)
      return !1;
    var h = Sr(t.props, "clippable"), m = h.keepRatio, x = 0, y = 0, S = o.draggable, w = Le(e);
    s && S ? (r = N(S.prevBeforeDist, 2), x = r[0], y = r[1]) : (n = N(w, 2), x = n[0], y = n[1]);
    var E = [x, y], M = t.state, D = M.width, _ = M.height, g = !f && !u && !c, T = v.type, k = v.poses, A = v.splitter, O = k.map(function(Tt) {
      return Tt.pos;
    });
    g && (x = -x, y = -y);
    var R = !u || k[d].direction === "nesw", j = T === "inset" || T === "rect", z = k.map(function() {
      return [0, 0];
    });
    if (u && !R) {
      var W = k[d], Y = W.horizontal, L = W.vertical, q = [
        x * H(Y),
        y * H(L)
      ];
      z = dh(k, d, q, j, m);
    } else R && (z = O.map(function() {
      return [x, y];
    }));
    var V = O.map(function(Tt, Yt) {
      return It(Tt, z[Yt]);
    }), F = Q([], N(V), !1);
    M.snapBoundInfos = null;
    var rt = v.type === "circle", et = v.type === "ellipse";
    if (rt || et) {
      var Z = De(V), it = H(Z.bottom - Z.top), tt = H(et ? Z.right - Z.left : it), st = V[0][1] + it, nt = V[0][0] - tt, pt = V[0][0] + tt;
      rt && (F.push([pt, Z.bottom]), z.push([1, 0])), F.push([Z.left, st]), z.push([0, 1]), F.push([nt, Z.bottom]), z.push([1, 0]);
    }
    var Ct = zu((h.clipHorizontalGuidelines || []).map(function(Tt) {
      return Nt("".concat(Tt), _);
    }), (h.clipVerticalGuidelines || []).map(function(Tt) {
      return Nt("".concat(Tt), D);
    }), D, _), U = [], ut = [];
    if (rt || et)
      U = [F[4][0], F[2][0]], ut = [F[1][1], F[3][1]];
    else if (j) {
      var yt = [F[0], F[2], F[4], F[6]], mt = [z[0], z[2], z[4], z[6]];
      U = yt.filter(function(Tt, Yt) {
        return mt[Yt][0];
      }).map(function(Tt) {
        return Tt[0];
      }), ut = yt.filter(function(Tt, Yt) {
        return mt[Yt][1];
      }).map(function(Tt) {
        return Tt[1];
      });
    } else
      U = F.filter(function(Tt, Yt) {
        return z[Yt][0];
      }).map(function(Tt) {
        return Tt[0];
      }), ut = F.filter(function(Tt, Yt) {
        return z[Yt][1];
      }).map(function(Tt) {
        return Tt[1];
      });
    var dt = [0, 0], bt = Ls(Ct, h.clipTargetBounds && { left: 0, top: 0, right: D, bottom: _ }, U, ut, 5, 5), xt = bt.horizontal, kt = bt.vertical, vt = xt.offset, Mt = kt.offset;
    if (xt.isBound && (dt[1] += vt), kt.isBound && (dt[0] += Mt), (et || rt) && z[0][0] === 0 && z[0][1] === 0) {
      var Z = De(V), Ft = Z.bottom - Z.top, qt = et ? Z.right - Z.left : Ft, Bt = kt.isBound ? H(Mt) : kt.snapIndex === 0 ? -Mt : Mt, Rt = xt.isBound ? H(vt) : xt.snapIndex === 0 ? -vt : vt;
      qt -= Bt, Ft -= Rt, rt && (Ft = Tu(kt, xt) > 0 ? Ft : qt, qt = Ft);
      var jt = F[0];
      F[1][1] = jt[1] - Ft, F[2][0] = jt[0] + qt, F[3][1] = jt[1] + Ft, F[4][0] = jt[0] - qt;
    } else if (j && m && u) {
      var je = N(sc(k), 2), Te = je[0], In = je[1], Ue = Te && In ? Te / In : 0, Rn = k[d], We = Rn.direction || "", lr = F[1][1], st = F[5][1], nt = F[7][0], pt = F[3][0];
      H(vt) <= H(Mt) ? vt = ue(vt) * H(Mt) / Ue : Mt = ue(Mt) * H(vt) * Ue, We.indexOf("w") > -1 ? nt -= Mt : We.indexOf("e") > -1 ? pt -= Mt : (nt += Mt / 2, pt -= Mt / 2), We.indexOf("n") > -1 ? lr -= vt : We.indexOf("s") > -1 ? st -= vt : (lr += vt / 2, st -= vt / 2);
      var Ke = Ma(lr, pt, st, nt);
      F.forEach(function(ft, ee) {
        var Se;
        Se = N(Ke[ee].pos, 2), ft[0] = Se[0], ft[1] = Se[1];
      });
    } else
      F.forEach(function(Tt, Yt) {
        var K = z[Yt];
        K[0] && (Tt[0] -= Mt), K[1] && (Tt[1] -= vt);
      });
    var Pn = Oo(t, v, V), ge = "".concat(T, "(").concat(Pn.join(A), ")");
    if (M.clipPathState = ge, rt || et)
      U = [F[4][0], F[2][0]], ut = [F[1][1], F[3][1]];
    else if (j) {
      var yt = [F[0], F[2], F[4], F[6]];
      U = yt.map(function(Yt) {
        return Yt[0];
      }), ut = yt.map(function(Yt) {
        return Yt[1];
      });
    } else
      U = F.map(function(Tt) {
        return Tt[0];
      }), ut = F.map(function(Tt) {
        return Tt[1];
      });
    if (M.snapBoundInfos = Ls(Ct, h.clipTargetBounds && { left: 0, top: 0, right: D, bottom: _ }, U, ut, 1, 1), S) {
      var Pt = M.is3d, Er = M.allMatrix, Ze = Pt ? 4 : 3, Wt = dt;
      s && (Wt = [
        E[0] + dt[0] - w[0],
        E[1] + dt[1] - w[1]
      ]), S.deltaOffset = At(Er, [Wt[0], Wt[1], 0, 0], Ze);
    }
    return ct(t, "onClip", wt(t, e, P({ clipEventType: "changed", clipType: T, poses: V, clipStyle: ge, clipStyles: Pn, distX: x, distY: y }, ce((a = {}, a[T === "rect" ? "clip" : "clipPath"] = ge, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var r = e.isDrag, n = e.datas, a = e.isDouble, i = n.isLine, o = n.isClipStart, s = n.isControl;
    return o ? (ct(t, "onClipEnd", be(t, e, {})), a && (s ? vh(t, e) : i && ph(t, e)), a || r) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, gh = {
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
    return e.isRequest ? e.requestAble === "originDraggable" : te(e.inputEvent.target, ht("origin"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas;
    Cr(t, e);
    var n = wt(t, e, {
      dragStart: le.dragStart(t, new Lr().dragStart([0, 0], e))
    }), a = ct(t, "onDragOriginStart", n);
    return r.startOrigin = t.state.transformOrigin, r.startTargetOrigin = t.state.targetOrigin, r.prevOrigin = [0, 0], r.isDragOrigin = !0, a === !1 ? (r.isDragOrigin = !1, !1) : n;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.isRequest;
    if (!r.isDragOrigin)
      return !1;
    var i = N(Le(e), 2), o = i[0], s = i[1], l = t.state, u = l.width, c = l.height, f = l.offsetMatrix, d = l.targetMatrix, v = l.is3d, h = t.props.originRelative, m = h === void 0 ? !0 : h, x = v ? 4 : 3, y = [o, s];
    if (a) {
      var S = e.distOrigin;
      (S[0] || S[1]) && (y = S);
    }
    var w = It(r.startOrigin, y), E = It(r.startTargetOrigin, y), M = gt(y, r.prevOrigin), D = kn(f, d, w, x), _ = t.getRect(), g = De(wr(D, u, c, x)), T = [
      _.left - g.left,
      _.top - g.top
    ];
    r.prevOrigin = y;
    var k = [
      Ie(E[0], u, m),
      Ie(E[1], c, m)
    ].join(" "), A = le.drag(t, _n(e, t.state, T, !!n)), O = wt(t, e, P(P({ width: u, height: c, origin: w, dist: y, delta: M, transformOrigin: k, drag: A }, ce({
      transformOrigin: k,
      transform: A.transform
    }, e)), { afterTransform: A.transform }));
    return ct(t, "onDragOrigin", O), O;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    return r.isDragOrigin ? (ct(t, "onDragOriginEnd", be(t, e, {})), !0) : !1;
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
function mh(t, e, r, n) {
  var a = t.filter(function(l) {
    var u = l.virtual, c = l.horizontal;
    return c && !u;
  }).length, i = t.filter(function(l) {
    var u = l.virtual, c = l.vertical;
    return c && !u;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    xh(t, o), o < 4 ? s.pos[0] = r : s.pos[1] = n;
  }
}
function xh(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(r) {
    r.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(r) {
    r.virtual = !1;
  }));
}
function yh(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(r) {
    r.virtual = !0;
  }) : t.slice(e).forEach(function(r) {
    r.virtual = !0;
  });
}
function al(t, e, r, n, a) {
  n === void 0 && (n = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = ar(t), oc(i, e, r, 0, 0, n, a);
}
function il(t, e, r, n, a) {
  var i = t.state, o = i.width, s = i.height, l = Po(a, t.props.roundRelative, o, s), u = l.raws, c = l.styles, f = l.radiusPoses, d = uh(f, u), v = d.horizontals, h = d.verticals, m = c.join(" ");
  i.borderRadiusState = m;
  var x = wt(t, e, P({ horizontals: v, verticals: h, borderRadius: m, width: o, height: s, delta: n, dist: r }, ce({
    borderRadius: m
  }, e)));
  return ct(t, "onRound", x), x;
}
function ol(t) {
  var e, r, n = t.getState().style, a = n.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (r = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && r !== void 0 ? r : "", n.borderRadius = a) : (a = _o(o).borderRadius, n.borderRadius = a));
  }
  return a;
}
var bh = {
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
    return e === !0 || e === "line" ? ht("round-line-clickable") : "";
  },
  requestStyle: function() {
    return ["borderRadius"];
  },
  requestChildStyle: function() {
    return ["borderRadius"];
  },
  render: function(t, e) {
    var r = t.getState(), n = r.target, a = r.width, i = r.height, o = r.allMatrix, s = r.is3d, l = r.left, u = r.top, c = r.borderRadiusState, f = t.props, d = f.minRoundControls, v = d === void 0 ? [0, 0] : d, h = f.maxRoundControls, m = h === void 0 ? [4, 4] : h, x = f.zoom, y = f.roundPadding, S = y === void 0 ? 0 : y, w = f.isDisplayShadowRoundControls, E = f.groupable;
    if (!n)
      return null;
    var M = c || ol(t), D = s ? 4 : 3, _ = al(M, a, i, v, !0);
    if (!_)
      return null;
    var g = 0, T = 0, k = E ? [0, 0] : [l, u];
    return _.map(function(A, O) {
      var R = A.horizontal, j = A.vertical, z = A.direction || "", W = Q([], N(A.pos), !1);
      T += Math.abs(R), g += Math.abs(j), R && z.indexOf("n") > -1 && (W[1] -= S), j && z.indexOf("w") > -1 && (W[0] -= S), R && z.indexOf("s") > -1 && (W[1] += S), j && z.indexOf("e") > -1 && (W[0] += S);
      var Y = gt(Lt(o, W, D), k), L = w && w !== "horizontal", q = A.vertical ? g <= m[1] && (L || !A.virtual) : T <= m[0] && (w || !A.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(O), className: ht("control", "border-radius", A.vertical ? "vertical" : "", A.virtual ? "virtual" : ""), "data-radius-index": O, style: {
        display: q ? "block" : "none",
        transform: "translate(".concat(Y[0], "px, ").concat(Y[1], "px) scale(").concat(x, ")")
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
    var f = wt(t, e, {}), d = ct(t, "onRoundStart", f);
    if (d === !1)
      return !1;
    n.lineIndex = u, n.controlIndex = l, n.isControl = o, n.isLine = s, Cr(t, e);
    var v = t.props, h = v.roundRelative, m = v.minRoundControls, x = m === void 0 ? [0, 0] : m, y = t.state, S = y.width, w = y.height;
    n.isRound = !0, n.prevDist = [0, 0];
    var E = ol(t), M = al(E || "", S, w, x, !0) || [];
    return n.controlPoses = M, y.borderRadiusState = Po(M, h, S, w).styles.join(" "), f;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = r.controlPoses;
    if (!r.isRound || !r.isControl || !n.length)
      return !1;
    var a = r.controlIndex, i = N(Le(e), 2), o = i[0], s = i[1], l = [o, s], u = gt(l, r.prevDist), c = t.props.maxRoundControls, f = c === void 0 ? [4, 4] : c, d = t.state, v = d.width, h = d.height, m = n[a], x = m.vertical, y = m.horizontal, S = n.map(function(E) {
      var M = E.horizontal, D = E.vertical, _ = [
        M * y * l[0],
        D * x * l[1]
      ];
      if (M) {
        if (f[0] === 1)
          return _;
        if (f[0] < 4 && M !== y)
          return _;
      } else {
        if (f[1] === 0)
          return _[1] = D * y * l[0] / v * h, _;
        if (x) {
          if (f[1] === 1)
            return _;
          if (f[1] < 4 && D !== x)
            return _;
        }
      }
      return [0, 0];
    });
    S[a] = l;
    var w = n.map(function(E, M) {
      return P(P({}, E), { pos: It(E.pos, S[M]) });
    });
    return a < 4 ? w.slice(0, a + 1).forEach(function(E) {
      E.virtual = !1;
    }) : w.slice(4, a + 1).forEach(function(E) {
      E.virtual = !1;
    }), r.prevDist = [o, s], il(t, e, l, u, w);
  },
  dragControlEnd: function(t, e) {
    var r = t.state;
    r.borderRadiusState = "";
    var n = e.datas, a = e.isDouble;
    if (!n.isRound)
      return !1;
    var i = n.isControl, o = n.controlIndex, s = n.isLine, l = n.lineIndex, u = n.controlPoses, c = u.filter(function(y) {
      var S = y.virtual;
      return S;
    }).length, f = t.props.roundClickable, d = f === void 0 ? !0 : f;
    if (a && d) {
      if (i && (d === !0 || d === "control"))
        yh(u, o);
      else if (s && (d === !0 || d === "line")) {
        var v = N(fu(t, e), 2), h = v[0], m = v[1];
        mh(u, l, h, m);
      }
      c !== u.filter(function(y) {
        var S = y.virtual;
        return S;
      }).length && il(t, e, [0, 0], [0, 0], u);
    }
    var x = be(t, e, {});
    return ct(t, "onRoundEnd", x), r.borderRadiusState = "", x;
  },
  dragGroupControlStart: function(t, e) {
    var r = this.dragControlStart(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Oe(t, "roundable", e), o = P({ targets: t.props.targets, events: i.map(function(s, l) {
      return P(P({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] });
    }) }, r);
    return ct(t, "onRoundGroupStart", o), r;
  },
  dragGroupControl: function(t, e) {
    var r = this.dragControl(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Oe(t, "roundable", e), o = P({ targets: t.props.targets, events: i.map(function(s, l) {
      return P(P(P({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] }), ce({
        borderRadius: r.borderRadius
      }, s));
    }) }, r);
    return ct(t, "onRoundGroup", o), o;
  },
  dragGroupControlEnd: function(t, e) {
    var r = t.moveables, n = t.props.targets, a = Oe(t, "roundable", e);
    Ba(t, "onRound", function(s) {
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
function Sh(t, e) {
  var r = e ? 4 : 3, n = zt(r), a = "matrix".concat(e ? "3d" : "", "(").concat(n.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var lc = {
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
    var r = t.state, n = r.is3d, a = r.targetMatrix, i = r.inlineTransform, o = n ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(Zl(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = Sh(s, n) ? [] : ar(s);
  },
  resetStyle: function(t) {
    var e = t.datas;
    e.nextStyle = {}, e.nextTransforms = t.datas.startTransforms, e.nextTransformAppendedIndexes = [];
  },
  fillDragStartParams: function(t, e) {
    return wt(t, e, {
      setTransform: function(r) {
        e.datas.startTransforms = Ht(r) ? r : ar(r);
      },
      isPinch: !!e.isPinch
    });
  },
  fillDragParams: function(t, e) {
    return wt(t, e, {
      isPinch: !!e.isPinch
    });
  },
  dragStart: function(t, e) {
    this.setTransform(t, e), this.resetStyle(e), ct(t, "onBeforeRenderStart", this.fillDragStartParams(t, e));
  },
  drag: function(t, e) {
    e.datas.startTransforms || this.setTransform(t, e), this.resetStyle(e), ct(t, "onBeforeRender", wt(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  dragEnd: function(t, e) {
    e.datas.startTransforms || (this.setTransform(t, e), this.resetStyle(e)), ct(t, "onBeforeRenderEnd", wt(t, e, {
      isPinch: !!e.isPinch,
      isDrag: e.isDrag
    }));
  },
  dragGroupStart: function(t, e) {
    var r = this;
    this.dragStart(t, e);
    var n = Oe(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.setTransform(l, o), r.resetStyle(o), r.fillDragStartParams(l, o);
    });
    ct(t, "onBeforeRenderGroupStart", wt(t, e, {
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
    var n = Oe(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.resetStyle(o), r.fillDragParams(l, o);
    });
    ct(t, "onBeforeRenderGroup", wt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets,
      events: i
    }));
  },
  dragGroupEnd: function(t, e) {
    this.dragEnd(t, e), ct(t, "onBeforeRenderGroupEnd", wt(t, e, {
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
}, uc = {
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
    ct(t, "onRenderStart", wt(t, e, {
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
    ct(t, "onRenderGroupStart", wt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets
    }));
  },
  dragGroup: function(t, e) {
    var r = this, n = Oe(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragParams(l, o);
    });
    ct(t, "onRenderGroup", wt(t, e, P(P({ isPinch: !!e.isPinch, targets: t.props.targets, transform: Jn(e), transformObject: {} }, ce(Qn(e))), { events: i })));
  },
  dragGroupEnd: function(t, e) {
    var r = this, n = Oe(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragEndParams(l, o);
    });
    ct(t, "onRenderGroupEnd", wt(t, e, P({ isPinch: !!e.isPinch, isDrag: e.isDrag, targets: t.props.targets, events: i, transformObject: {}, transform: Jn(e) }, ce(Qn(e)))));
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
    return Fr(ya(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), wt(t, e, P({ isPinch: !!e.isPinch, transformObject: r, transform: Jn(e) }, ce(Qn(e))));
  },
  fillDragEndParams: function(t, e) {
    var r = {};
    return Fr(ya(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), wt(t, e, P({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: r, transform: Jn(e) }, ce(Qn(e))));
  }
};
function pn(t, e, r, n, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", u = a === "After", c = t.state.target, f = i.isRequest, d = n.indexOf("Control") > -1;
  if (!c || s && d && !f && t.areaElement === i.inputEvent.target)
    return !1;
  var v = Q([], N(e), !1);
  if (f) {
    var h = i.requestAble;
    v.some(function(O) {
      return O.name === h;
    }) || v.push.apply(v, Q([], N(t.props.ables.filter(function(O) {
      return O.name === h;
    })), !1));
  }
  if (!v.length || v.every(function(O) {
    return O.dragRelation;
  }))
    return !1;
  var m = i.inputEvent, x;
  l && m && (x = document.elementFromPoint(i.clientX, i.clientY) || m.target);
  var y = !1, S = function() {
    var O;
    y = !0, (O = i.stop) === null || O === void 0 || O.call(i);
  }, w = s && (!t.targetGesto || !t.controlGesto || !t.targetGesto.isFlag() || !t.controlGesto.isFlag());
  w && t.updateRect(a, !0, !1);
  var E = i.datas, M = d ? "controlGesto" : "targetGesto", D = t[M], _ = function(O, R, j) {
    if (!(R in O) || D !== t[M])
      return !1;
    var z = O.name, W = E[z] || (E[z] = {});
    if (s && (W.isEventStart = !j || !O[j] || O[j](t, i)), !W.isEventStart)
      return !1;
    var Y = O[R](t, P(P({}, i), { stop: S, datas: W, originalDatas: E, inputTarget: x }));
    return t._emitter.off(), s && Y === !1 && (W.isEventStart = !1), Y;
  };
  w && v.forEach(function(O) {
    O.unset && O.unset(t);
  }), _(lc, "drag".concat(n).concat(a));
  var g = 0, T = 0;
  r.forEach(function(O) {
    if (y)
      return !1;
    var R = "".concat(O).concat(n).concat(a), j = "".concat(O).concat(n, "Condition");
    a === "" && !f && Xv(t.state, i);
    var z = v.filter(function(L) {
      return L[R];
    });
    z = z.filter(function(L, q) {
      return L.name && z.indexOf(L) === q;
    });
    var W = z.filter(function(L) {
      return _(L, R, j);
    }), Y = W.length;
    y && ++g, Y && ++T, !y && s && z.length && !Y && (g += z.filter(function(L) {
      var q = L.name, V = E[q];
      return V.isEventStart ? L.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!u || T) && _(uc, "drag".concat(n).concat(a));
  var k = D !== t[M] || g === r.length;
  if ((l || y || k) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(O) {
    O.state.gestos = {};
  }), v.forEach(function(O) {
    O.unset && O.unset(t);
  })), s && !k && !f && T && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || k)
    return !1;
  if (!s && T && !o || l) {
    var A = t.props.flushSync || Fu;
    A(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !u && T && !o && pn(t, e, r, n, a + "After", i), !0;
}
function No(t, e) {
  return function(r, n) {
    var a;
    n === void 0 && (n = r.inputEvent.target);
    var i = n, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || te(i, "moveable-area") || te(i, "moveable-padding") || te(i, "moveable-edgeDraggable");
  };
}
function cc(t, e, r) {
  var n = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(n), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var u = No(t);
  return dc(t, a, "targetAbles", r, {
    dragStart: u,
    pinchStart: u
  });
}
function fc(t, e) {
  var r = t.controlBox, n = [];
  n.push(r);
  var a = No(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === r)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return dc(t, n, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function dc(t, e, r, n, a) {
  a === void 0 && (a = {});
  var i = r === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, u = o.preventClickEventOnDrag, c = o.preventClickDefault, f = o.checkInput, d = o.dragFocusedInput, v = o.preventDefault, h = v === void 0 ? !0 : v, m = o.preventRightClick, x = m === void 0 ? !0 : m, y = o.preventWheelClick, S = y === void 0 ? !0 : y, w = o.dragContainer, E = Fe(w, !0), M = {
    preventDefault: h,
    preventRightClick: x,
    preventWheelClick: S,
    container: E || Ee(t.getControlBoxElement()),
    pinchThreshold: l,
    pinchOutside: s,
    preventClickEventOnDrag: i ? u : !1,
    preventClickEventOnDragStart: i ? c : !1,
    preventClickEventByCondition: i ? null : function(g) {
      return t.controlBox.contains(g.target);
    },
    checkInput: i ? f : !1,
    dragFocusedInput: d
  }, D = new nu(e, M), _ = n === "Control";
  return ["drag", "pinch"].forEach(function(g) {
    ["Start", "", "End"].forEach(function(T) {
      D.on("".concat(g).concat(T), function(k) {
        var A, O = k.eventType, R = g === "drag" && k.isPinch;
        if (a[O] && !a[O](k)) {
          k.stop();
          return;
        }
        if (!R) {
          var j = g === "drag" ? [g] : ["drag", g], z = Q([], N(t[r]), !1), W = pn(t, z, j, n, T, k);
          W ? (t.props.stopPropagation || T === "Start" && _) && ((A = k == null ? void 0 : k.inputEvent) === null || A === void 0 || A.stopPropagation()) : k.stop();
        }
      });
    });
  }), D;
}
var Ch = /* @__PURE__ */ (function() {
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
function wh(t, e, r, n) {
  var a;
  r === void 0 && (r = e);
  var i = mu(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, u = i.transformOrigin, c = i.targetOrigin, f = i.offsetContainer, d = i.hasFixed, v = i.zoom, h = zp(f, r), m = h.matrixes, x = h.is3d, y = h.offsetContainer, S = h.zoom, w = n, E = 4, M = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, D = l, _ = zt(E), g = zt(E), T = zt(E), k = zt(E), A = o.length, O = m.map(function(q) {
    return P(P({}, q), { matrix: q.matrix ? Q([], N(q.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && w && (D = Ae(D, 3, 4), Yi(o)), !x && w && Yi(O), O.forEach(function(q) {
    g = At(g, q.matrix, E);
  });
  var R = r || sr(t), j = ((a = O[0]) === null || a === void 0 ? void 0 : a.target) || bn(R, R, !0).offsetParent, z = O.slice(1).reduce(function(q, V) {
    return At(q, V.matrix, E);
  }, zt(E));
  o.forEach(function(q, V) {
    if (A - 2 === V && (T = _.slice()), A - 1 === V && (k = _.slice()), !q.matrix) {
      var F = o[V + 1], rt = Fv(q, F, j, E, At(z, _, E));
      q.matrix = yr(rt, E);
    }
    _ = At(_, q.matrix, E);
  });
  var W = !M && s;
  D || (D = zt(W ? 4 : 3));
  var Y = za(M && D.length === 16 ? Ae(D, 4, 3) : D, W), L = g;
  return g = Ul(g, E, E), {
    hasZoom: v !== 1 || S !== 1,
    hasFixed: d,
    matrixes: o,
    rootMatrix: g,
    originalRootMatrix: L,
    beforeMatrix: T,
    offsetMatrix: k,
    allMatrix: _,
    targetMatrix: D,
    targetTransform: Y,
    inlineTransform: t.style.transform,
    transformOrigin: u,
    targetOrigin: c,
    is3d: w,
    offsetContainer: f,
    offsetRootContainer: y
  };
}
function Eh(t, e, r, n) {
  r === void 0 && (r = e);
  var a = 0, i = 0, o = 0, s = {}, l = Xu(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var u = wh(t, e, r, n), c = Br(u.allMatrix, u.transformOrigin, a, i);
    s = P(P({}, u), c);
    var f = Br(u.allMatrix, [50, 50], 100, 100);
    o = Hu([f.pos1, f.pos2], f.direction);
  }
  var d = 4;
  return P(P(P({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: zt(d), rootMatrix: zt(d), beforeMatrix: zt(d), offsetMatrix: zt(d), allMatrix: zt(d), targetMatrix: zt(d), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function qi(t, e, r, n, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = ea(), u = ea(), c = ea(), f = ea(), d = [0, 0], v = {}, h = Eh(e, r, a, !0);
  if (e) {
    var m = he(e);
    i.forEach(function(O) {
      v[O] = m(O);
    });
    var x = h.is3d ? 4 : 3, y = Br(h.offsetMatrix, It(h.transformOrigin, Kl(h.targetMatrix, x)), h.width, h.height);
    o = y.direction, s = It(y.origin, [y.left - h.left, y.top - h.top]), f = dn(h.offsetRootContainer);
    var S = bn(n, n, !0).offsetParent || h.offsetRootContainer;
    if (h.hasZoom) {
      var w = Br(At(h.originalRootMatrix, h.allMatrix), h.transformOrigin, h.width, h.height), E = Br(h.originalRootMatrix, wa(he(S)("transformOrigin")).map(function(O) {
        return parseFloat(O);
      }), S.offsetWidth, S.offsetHeight);
      if (l = ui(w, f), c = ui(E, f, S, !0), t) {
        var M = w.left, D = w.top;
        u = ui({
          left: M,
          top: D,
          bottom: D,
          right: D
        }, f);
      }
    } else {
      l = dn(e), c = jp(S), t && (u = dn(t));
      var _ = c.left, g = c.top, T = c.clientLeft, k = c.clientTop, A = [
        l.left - _,
        l.top - g
      ];
      d = gt(Xr(h.rootMatrix, A, 4), [T + h.left, k + h.top]);
    }
  }
  return P({ targetClientRect: l, containerClientRect: c, moveableClientRect: u, rootContainerClientRect: f, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: v, offsetDelta: d }, h);
}
function sl(t) {
  var e = t.pos1, r = t.pos2, n = t.pos3, a = t.pos4;
  if (!e || !r || !n || !a)
    return null;
  var i = br([e, r, n, a]), o = [i.minX, i.minY], s = gt(t.origin, o);
  return e = gt(e, o), r = gt(r, o), n = gt(n, o), a = gt(a, o), P(P({}, t), {
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
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, qi(null)), r.renderState = {}, r.enabledAbles = [], r.targetAbles = [], r.controlAbles = [], r.rotation = 0, r.scale = [1, 1], r.isMoveableMounted = !1, r.isUnmounted = !1, r.events = {
      mouseEnter: null,
      mouseLeave: null
    }, r._emitter = new En(), r._prevOriginalDragTarget = null, r._originalDragTarget = null, r._prevDragTarget = null, r._dragTarget = null, r._prevPropTarget = null, r._propTarget = null, r._prevDragArea = !1, r._isPropTargetChanged = !1, r._hasFirstTarget = !1, r._reiszeObserver = null, r._observerId = 0, r._mutationObserver = null, r._rootContainer = null, r._viewContainer = null, r._viewClassNames = [], r._store = {}, r.checkUpdateRect = function() {
      if (!r.isDragging()) {
        var n = r.props.parentMoveable;
        if (n) {
          n.checkUpdateRect();
          return;
        }
        pd(r._observerId), r._observerId = $l(function() {
          r.isDragging() || r.updateRect();
        });
      }
    }, r._onPreventClick = function(n) {
      n.stopPropagation(), n.preventDefault();
    }, r;
  }
  return e.prototype.render = function() {
    var r = this.props, n = this.getState(), a = r.parentPosition, i = r.className, o = r.target, s = r.zoom, l = r.cspNonce, u = r.translateZ, c = r.cssStyled, f = r.groupable, d = r.linePadding, v = r.controlPadding;
    this._checkUpdateRootContainer(), this.checkUpdate(), this.updateRenderPoses();
    var h = N(a || [0, 0], 2), m = h[0], x = h[1], y = n.left, S = n.top, w = n.target, E = n.direction, M = n.hasFixed, D = n.offsetDelta, _ = r.targets, g = this.isDragging(), T = {};
    this.getEnabledAbles().forEach(function(z) {
      T["data-able-".concat(z.name.toLowerCase())] = !0;
    });
    var k = this._getAbleClassName(), A = _ && _.length && (w || f) || o || !this._hasFirstTarget && this.state.isPersisted, O = this.controlBox || this.props.firstRenderState || this.props.persistData, R = [y - m, S - x];
    !f && r.useAccuratePosition && (R[0] += D[0], R[1] += D[1]);
    var j = {
      position: M ? "fixed" : "absolute",
      display: A ? "block" : "none",
      visibility: O ? "visible" : "hidden",
      transform: "translate3d(".concat(R[0], "px, ").concat(R[1], "px, ").concat(u, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return d && (j["--moveable-line-padding"] = d), v && (j["--moveable-control-padding"] = v), at.createElement(
      c,
      P({ cspNonce: l, ref: nr(this, "controlBox"), className: "".concat(ht("control-box", E === -1 ? "reverse" : "", g ? "dragging" : ""), " ").concat(k, " ").concat(i) }, T, { onClick: this._onPreventClick, style: j }),
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
    a && this._changeAbleViewClassNames([]), jr(this, !1), jr(this, !0);
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
    return ye(n, function(a) {
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
    return r && (((n = r.getAttribute) === null || n === void 0 ? void 0 : n.call(r, "class")) || "").indexOf(ho) > -1;
  }, e.prototype.dragStart = function(r, n) {
    n === void 0 && (n = r.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && No(this)({ inputEvent: r }, n) ? a.isFlag() || a.triggerDragStart(r) : i && this.isMoveableElement(n) && (i.isFlag() || i.triggerDragStart(r)), this;
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
    var d = c.left, v = c.top, h = c.width, m = c.height, x = Ti([i, o, l, s], u), y = Yd(x, [
      [d, v],
      [d + h, v],
      [d + h, v + m],
      [d, v + m]
    ]), S = ln(x);
    return !y || !S ? 0 : Math.min(100, y / S * 100);
  }, e.prototype.isInside = function(r, n) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, u = a.pos4, c = a.targetClientRect;
    return i ? ma([r, n], Ti([o, s, u, l], c)) : !1;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && Wr(!0);
    var s = i.parentMoveable, l = this.state, u = l.target || i.target, c = this.getContainer(), f = s ? s._rootContainer : this._rootContainer, d = qi(this.controlBox, u, c, c, f || c, this._getRequestStyles());
    if (!u && this._hasFirstTarget && i.persistData) {
      var v = sl(i.persistData);
      for (var h in v)
        d[h] = v[h];
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
    var r = this.state, n = ke(this.state), a = N(n, 4), i = a[0], o = a[1], s = a[2], l = a[3], u = De(n), c = r.width, f = r.height, d = u.width, v = u.height, h = u.left, m = u.top, x = [r.left, r.top], y = It(x, r.origin), S = It(x, r.beforeOrigin), w = r.transformOrigin;
    return {
      width: d,
      height: v,
      left: h,
      top: m,
      pos1: i,
      pos2: o,
      pos3: s,
      pos4: l,
      offsetWidth: c,
      offsetHeight: f,
      beforeOrigin: S,
      origin: y,
      transformOrigin: w,
      rotation: this.getRotation()
    };
  }, e.prototype.getManager = function() {
    return this;
  }, e.prototype.stopDrag = function(r) {
    if (!r || r === "target") {
      var n = this.targetGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && Xi(this, !1), n == null || n.stop();
    }
    if (!r || r === "control") {
      var n = this.controlGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && Xi(this, !0), n == null || n.stop();
    }
  }, e.prototype.getRotation = function() {
    var r = this.state, n = r.pos1, a = r.pos2, i = r.direction;
    return qv(n, a, i);
  }, e.prototype.request = function(r, n, a) {
    n === void 0 && (n = {});
    var i = this, o = i.props, s = o.parentMoveable || o.wrapperMoveable || i, l = s.props.ables, u = o.groupable, c = ye(l, function(y) {
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
    var f = c.request(i), d = a || n.isInstant, v = f.isControl ? "controlAbles" : "targetAbles", h = "".concat(u ? "Group" : "").concat(f.isControl ? "Control" : ""), m = Q([], N(s[v]), !1), x = {
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
    var r = this.getState(), n = this.props, a = n.padding, i = r.originalBeforeOrigin, o = r.transformOrigin, s = r.allMatrix, l = r.is3d, u = r.pos1, c = r.pos2, f = r.pos3, d = r.pos4, v = r.left, h = r.top, m = r.isPersisted, x = n.zoom || 1;
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
    var y = ec(a || {}), S = y.left, w = y.top, E = y.bottom, M = y.right, D = l ? 4 : 3, _ = [];
    m ? _ = o : this.controlBox && n.groupable ? _ = i : _ = It(i, [v, h]);
    var g = ga(D, yr(_.map(function(j) {
      return -j;
    }), D), s, yr(o, D)), T = we(g, u, [-S, -w], D), k = we(g, c, [M, -w], D), A = we(g, f, [-S, E], D), O = we(g, d, [M, E], D);
    r.renderPoses = [
      T,
      k,
      A,
      O
    ], r.renderLines = [
      [T, k],
      [k, O],
      [O, A],
      [A, T]
    ];
    {
      var R = x / 2;
      r.renderLines = [
        [
          we(g, u, [-S - R, -w], D),
          we(g, c, [M + R, -w], D)
        ],
        [
          we(g, c, [M, -w - R], D),
          we(g, d, [M, E + R], D)
        ],
        [
          we(g, d, [M + R, E], D),
          we(g, f, [-S - R, E], D)
        ],
        [
          we(g, f, [-S, E + R], D),
          we(g, u, [-S, -w - R], D)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var r = this.props, n = r.target, a = r.container, i = r.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !n)) {
      this.updateAbles();
      var u = !Hi(s, n), c = u || !Hi(l, a);
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
    return a[i] || (a[i] = iu(r, n)), a[i];
  }, e.prototype.getState = function() {
    var r, n = this.props;
    (n.target || !((r = n.targets) === null || r === void 0) && r.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = n.persistData, o = n.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = sl(i);
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
      createElement: at.createElement
    };
    return this.renderState = {}, Yv(Zu(ra(this.getEnabledAbles(), ["render"], a).map(function(o) {
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
      return Q(Q([], N(n), !1), N(s), !1);
    }, Q([], N(this.props.requestStyles || []), !1));
    return r;
  }, e.prototype._updateObserver = function(r) {
    this._updateResizeObserver(r), this._updateMutationObserver(r);
  }, e.prototype._updateEvents = function() {
    var r = this.targetAbles.length, n = this.controlAbles.length, a = this._dragTarget, i = !r && this.targetGesto || this._isTargetChanged(!0);
    i && (jr(this, !1), this.updateState({ gestos: {} })), n || jr(this, !0), a && r && !this.targetGesto && (this.targetGesto = cc(this, a, "")), !this.controlGesto && n && (this.controlGesto = fc(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var r = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = r.dragArea, this._propTarget = r.target, this._originalDragTarget = r.dragTarget || r.target, this._dragTarget = Fe(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var r = this.props, n = r, a = n.zoom, i = n.hideDefaultLines, o = n.hideChildMoveableDefaultLines, s = n.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), u = {
      createElement: at.createElement
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
        var f = ra(u, [c]), d = f.length > 0, v = i[c];
        if (!d) {
          v && (v.destroy(), i[c] = null);
          return;
        }
        v || (v = new Ch(a, r, c), i[c] = v), v.setAbles(f);
      });
    }
  }, e.prototype._checkUpdateRootContainer = function() {
    var r = this.props.rootContainer;
    !this._rootContainer && r && (this._rootContainer = Fe(r, !0));
  }, e.prototype._checkUpdateViewContainer = function() {
    var r = this.props.viewContainer;
    !this._viewContainer && r && (this._viewContainer = Fe(r, !0));
    var n = this._viewContainer;
    n && this._changeAbleViewClassNames(Q(Q([], N(this._getAbleViewClassNames()), !1), [
      this.isDragging() ? th : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(r) {
    var n = this._viewContainer, a = Ku(r.filter(Boolean), function(u) {
      return u;
    }).map(function(u) {
      var c = N(u, 1), f = c[0];
      return f;
    }), i = this._viewClassNames, o = fo(i, a), s = o.removed, l = o.added;
    s.forEach(function(u) {
      ql(n, i[u]);
    }), l.forEach(function(u) {
      oo(n, a[u]);
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
      var c, f, d, v = u.name, h = ((c = u.className) === null || c === void 0 ? void 0 : c.call(u, n)) || "";
      return (!((f = s[v]) === null || f === void 0) && f.isEventStart || !((d = l[v]) === null || d === void 0) && d.isEventStart) && (h += " ".concat(ht("".concat(v).concat(r, "-dragging")))), h.trim();
    }).filter(Boolean).join(" ");
  }, e.prototype._updateResizeObserver = function(r) {
    var n, a = this.props, i = a.target, o = Ee(this.getControlBoxElement());
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
    var n = this, a, i = this.props, o = i.target, s = Ee(this.getControlBoxElement());
    if (!s.MutationObserver || !o || !i.useMutationObserver) {
      (a = this._mutationObserver) === null || a === void 0 || a.disconnect();
      return;
    }
    if (!(r.target === o && this._mutationObserver)) {
      var l = new s.MutationObserver(function(u) {
        var c, f;
        try {
          for (var d = ap(u), v = d.next(); !v.done; v = d.next()) {
            var h = v.value;
            h.type === "attributes" && h.attributeName === "style" && n.checkUpdateRect();
          }
        } catch (m) {
          c = { error: m };
        } finally {
          try {
            v && !v.done && (f = d.return) && f.call(d);
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
    flushSync: Fu,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})(at.PureComponent), Ao = {
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
    var d = zr(t, "parentPosition", [o, s], function(h) {
      return h.join(",");
    }), v = zr(t, "requestStyles", t.getRequestChildStyles(), function(h) {
      return h.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), Q(Q([], N(a.map(function(h, m) {
      return e.createElement(Hr, { key: "moveable" + m, ref: Ll(t, "moveables", m), target: h, origin: !1, requestStyles: v, cssStyled: n.cssStyled, customStyledMap: n.customStyledMap, useResizeObserver: n.useResizeObserver, useMutationObserver: n.useMutationObserver, hideChildMoveableDefaultLines: n.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: f[m], zoom: u });
    })), !1), N(Zu(c.map(function(h, m) {
      var x = h.pos1, y = h.pos2, S = h.pos3, w = h.pos4, E = [x, y, S, w];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(M, D) {
        var _ = N(M, 2), g = _[0], T = _[1];
        return yn(e, "", gt(E[g], d), gt(E[T], d), u, "group-rect-".concat(m, "-").concat(D));
      });
    }))), !1);
  }
}, Dh = Mn("clickable", {
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
      ct(t, "onClick", wt(t, e, {
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
      }), s = i > -1), ct(t, "onClickGroup", wt(t, e, {
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
function Tr(t) {
  var e = t.originalDatas.draggable;
  return e || (t.originalDatas.draggable = {}, e = t.originalDatas.draggable), P(P({}, t), { datas: e });
}
var Mh = Mn("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var r = t.props, n = r.edgeDraggable;
    return n ? bu(e, "edgeDraggable", n, t.getState().renderPoses, r.zoom) : [];
  },
  dragCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && te(a, ht("direction")) && te(a, ht("edge")) && te(a, ht("edgeDraggable"));
  },
  dragStart: function(t, e) {
    return le.dragStart(t, Tr(e));
  },
  drag: function(t, e) {
    return le.drag(t, Tr(e));
  },
  dragEnd: function(t, e) {
    return le.dragEnd(t, Tr(e));
  },
  dragGroupCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && te(a, ht("direction")) && te(a, ht("line"));
  },
  dragGroupStart: function(t, e) {
    return le.dragGroupStart(t, Tr(e));
  },
  dragGroup: function(t, e) {
    return le.dragGroup(t, Tr(e));
  },
  dragGroupEnd: function(t, e) {
    return le.dragGroupEnd(t, Tr(e));
  },
  unset: function(t) {
    return le.unset(t);
  }
}), pc = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, _h = [
  lc,
  ac,
  Iv,
  Uv,
  le,
  Mh,
  Fi,
  Kv,
  Jv,
  dv,
  nh,
  ah,
  eh,
  gh,
  hh,
  bh,
  Ao,
  pc,
  Dh,
  nc,
  uc
];
function ll(t, e) {
  var r = N(t, 3), n = r[0], a = r[1], i = r[2];
  return (n * e[0] + a * e[1] + i) / Math.sqrt(n * n + a * a);
}
function ia(t, e) {
  var r = N(t, 2), n = r[0], a = r[1];
  return -n * e[0] - a * e[1];
}
function ul(t, e) {
  return Math.max.apply(Math, Q([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function cl(t, e) {
  return Math.min.apply(Math, Q([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function kh(t, e) {
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
  var f = St(e, fe);
  if (f % 90) {
    var d = f / 180 * Math.PI, v = Math.tan(d), h = -1 / v, m = [ji, Os], x = [[0, 0], [0, 0]], y = [ji, Os], S = [[0, 0], [0, 0]];
    t.forEach(function(et) {
      et.forEach(function(Z) {
        var it = ll([-v, 1, 0], Z), tt = ll([-h, 1, 0], Z);
        m[0] > it && (x[0] = Z, m[0] = it), m[1] < it && (x[1] = Z, m[1] = it), y[0] > tt && (S[0] = Z, y[0] = tt), y[1] < tt && (S[1] = Z, y[1] = tt);
      });
    });
    var w = N(x, 2), E = w[0], M = w[1], D = N(S, 2), _ = D[0], g = D[1], T = [-v, 1, ia([-v, 1], E)], k = [-v, 1, ia([-v, 1], M)], A = [-h, 1, ia([-h, 1], _)], O = [-h, 1, ia([-h, 1], g)];
    r = N([
      [T, A],
      [T, O],
      [k, A],
      [k, O]
    ].map(function(et) {
      var Z = N(et, 2), it = Z[0], tt = Z[1];
      return po(it, tt)[0];
    }), 4), i = r[0], o = r[1], s = r[2], l = r[3], u = y[1] - y[0], c = m[1] - m[0];
  } else {
    var R = cl(t, 0), j = cl(t, 1), z = ul(t, 0), W = ul(t, 1);
    if (i = [R, j], o = [z, j], s = [R, W], l = [z, W], u = z - R, c = W - j, f % 180) {
      var Y = [s, i, l, o];
      n = N(Y, 4), i = n[0], o = n[1], s = n[2], l = n[3], u = W - j, c = z - R;
    }
  }
  if (f % 360 > 180) {
    var Y = [l, s, o, i];
    a = N(Y, 4), i = a[0], o = a[1], s = a[2], l = a[3];
  }
  var L = br([i, o, s, l]), q = L.minX, V = L.minY, F = L.maxX, rt = L.maxY;
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
    maxY: rt,
    rotation: e
  };
}
function vc(t, e) {
  var r = e.map(function(n) {
    if (Ht(n)) {
      var a = vc(t, n), i = a.length;
      return i > 1 ? a : i === 1 ? a[0] : null;
    } else {
      var o = ye(t, function(s) {
        var l = s.manager;
        return l.props.target === n;
      });
      return o ? (o.finded = !0, o.manager) : null;
    }
  }).filter(Boolean);
  return r.length === 1 && Ht(r[0]) ? r[0] : r;
}
var Th = /* @__PURE__ */ (function(t) {
  Dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.differ = new Ql(), r.moveables = [], r.transformOrigin = "50% 50%", r.renderGroupRects = [], r._targetGroups = [], r._hasFirstTargets = !1, r;
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
    Wr(!0), this.moveables.forEach(function(nt) {
      nt.updateRect(r, !1, !1);
    });
    var s = this.props, l = this.moveables, u = o.target || s.target, c = l.map(function(nt) {
      return { finded: !1, manager: nt };
    }), f = this.props.targetGroups || [], d = vc(c, f), v = s.useDefaultGroupRotate;
    d.push.apply(d, Q([], N(c.filter(function(nt) {
      var pt = nt.finded;
      return !pt;
    }).map(function(nt) {
      var pt = nt.manager;
      return pt;
    })), !1));
    var h = [], m = !n || r !== "" && s.updateGroup, x = s.defaultGroupRotate || 0;
    if (!this._hasFirstTargets) {
      var y = (i = s.persistData) === null || i === void 0 ? void 0 : i.rotation;
      y != null && (x = y);
    }
    function S(nt, pt, Ct) {
      var U = nt.map(function(kt) {
        if (Ht(kt)) {
          var vt = S(kt, pt), Mt = [vt.pos1, vt.pos2, vt.pos3, vt.pos4];
          return h.push(vt), { poses: Mt, rotation: vt.rotation };
        } else
          return {
            poses: ke(kt.state),
            rotation: kt.getRotation()
          };
      }), ut = U.map(function(kt) {
        var vt = kt.rotation;
        return vt;
      }), yt = 0, mt = ut[0], dt = ut.every(function(kt) {
        return Math.abs(mt - kt) < 0.1;
      });
      m ? yt = !v && dt ? mt : x : yt = !v && !Ct && dt ? mt : pt;
      var bt = U.map(function(kt) {
        var vt = kt.poses;
        return vt;
      }), xt = kh(bt, yt);
      return xt;
    }
    var w = S(d, this.rotation, !0);
    m && (this.rotation = w.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = f, this.renderGroupRects = h;
    var E = this.transformOrigin, M = this.rotation, D = this.scale, _ = w.width, g = w.height, T = w.minX, k = w.minY, A = Vv([
      [0, 0],
      [_, 0],
      [0, g],
      [_, g]
    ], Ro(E, _, g), this.rotation / 180 * Math.PI), O = br(A.result), R = O.minX, j = O.minY, z = " rotate(".concat(M, "deg)") + " scale(".concat(ue(D[0]), ", ").concat(ue(D[1]), ")"), W = "translate(".concat(-R, "px, ").concat(-j, "px)").concat(z);
    this.controlBox.style.transform = "translate3d(".concat(T, "px, ").concat(k, "px, ").concat(this.props.translateZ || 0, ")"), u.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(E, ";") + "width:".concat(_, "px;height:").concat(g, "px;") + "transform: ".concat(W), o.width = _, o.height = g;
    var Y = this.getContainer(), L = qi(this.controlBox, u, this.controlBox, this.getContainer(), this._rootContainer || Y, []), q = [L.left, L.top], V = N(ke(L), 4), F = V[0], rt = V[1], et = V[2], Z = V[3], it = br([F, rt, et, Z]), tt = [it.minX, it.minY], st = ue(D[0] * D[1]);
    L.pos1 = gt(F, tt), L.pos2 = gt(rt, tt), L.pos3 = gt(et, tt), L.pos4 = gt(Z, tt), L.left = T - L.left + tt[0], L.top = k - L.top + tt[1], L.origin = gt(It(q, L.origin), tt), L.beforeOrigin = gt(It(q, L.beforeOrigin), tt), L.originalBeforeOrigin = It(q, L.originalBeforeOrigin), L.transformOrigin = gt(It(q, L.transformOrigin), tt), u.style.transform = "translate(".concat(-R - tt[0], "px, ").concat(-j - tt[1], "px)") + z, Wr(), this.updateState(P(P({}, L), { posDelta: tt, direction: st, beforeDirection: st }), a);
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
      return Q(Q([], N(n), !1), N(s), !1);
    }, []);
    return r;
  }, e.prototype.getMoveables = function() {
    return Q([], N(this.moveables), !1);
  }, e.prototype.updateAbles = function() {
    t.prototype.updateAbles.call(this, Q(Q([], N(this.props.ables), !1), [Ao], !1), "Group");
  }, e.prototype._updateTargets = function() {
    t.prototype._updateTargets.call(this), this._originalDragTarget = this.props.dragTarget || this.areaElement, this._dragTarget = Fe(this._originalDragTarget, !0);
  }, e.prototype._updateEvents = function() {
    var r = this.state, n = this.props, a = this._prevDragTarget, i = n.dragTarget || this.areaElement, o = n.targets, s = this.differ.update(o), l = s.added, u = s.changed, c = s.removed, f = l.length || c.length;
    (f || this._prevOriginalDragTarget !== this._originalDragTarget) && (jr(this, !1), jr(this, !0), this.updateState({ gestos: {} })), a !== i && (r.target = null), r.target || (r.target = this.areaElement, this.controlBox.style.display = "block"), r.target && (this.targetGesto || (this.targetGesto = cc(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = fc(this, "GroupControl")));
    var d = !Hi(r.container, n.container);
    d && (r.container = n.container), (d || f || this.transformOrigin !== (n.defaultGroupOrigin || "50% 50%") || u.length || o.length && !tc(this._targetGroups, n.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!f;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = P(P({}, Hr.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Hr), Ih = /* @__PURE__ */ (function(t) {
  Dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.moveables = [], r;
  }
  return e.prototype.render = function() {
    var r = this, n, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], u = l.length, c = this.isUnmounted || !u, f = (n = s == null ? void 0 : s.children) !== null && n !== void 0 ? n : [];
    return c && !u && f.length ? l = f.map(function() {
      return null;
    }) : c || (f = []), at.createElement(o, { cspNonce: i, ref: nr(this, "controlBox"), className: ht("control-box") }, l.map(function(d, v) {
      var h, m, x = (m = (h = a.individualGroupableProps) === null || h === void 0 ? void 0 : h.call(a, d, v)) !== null && m !== void 0 ? m : {};
      return at.createElement(Hr, P({ key: "moveable" + v, ref: Ll(r, "moveables", v) }, a, x, { target: d, wrapperMoveable: r, isWrapperMounted: r.isMoveableMounted, persistData: f[v] }));
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
    var a = n, i = ye(this.moveables, function(o) {
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
    return Q([], N(this.moveables), !1);
  }, e.prototype.updateRenderPoses = function() {
  }, e.prototype.checkUpdate = function() {
  }, e.prototype.triggerEvent = function() {
  }, e.prototype.updateAbles = function() {
  }, e.prototype._updateEvents = function() {
  }, e.prototype._updateObserver = function() {
  }, e;
})(Hr);
function hc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (Me(n)) {
        e[n] && r.push.apply(r, Q([], N(e[n]), !1));
        return;
      }
      Ht(n) ? r.push.apply(r, Q([], N(hc(n, e)), !1)) : r.push(n);
    }
  }), r;
}
function gc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (Me(n)) {
        e[n] && r.push.apply(r, Q([], N(e[n]), !1));
        return;
      }
      Ht(n) ? r.push(gc(n, e)) : r.push(n);
    }
  }), r;
}
function mc(t, e) {
  return t.length !== e.length || t.some(function(r, n) {
    var a = e[n];
    return !r && !a ? !1 : r != a ? Ht(r) && Ht(a) ? mc(r, a) : !0 : !1;
  });
}
var Rh = /* @__PURE__ */ (function(t) {
  Dn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.refTargets = [], r.selectorMap = {}, r._differ = new Ql(), r._elementTargets = [], r._tmpRefTargets = [], r._tmpSelectorMap = {}, r._onChangeTargets = null, r;
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
    this.defaultStyled = iu("div", ed(ho, hp + a));
  }, e.getTotalAbles = function() {
    return Q([ac, Ao, pc, nc], N(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var r, n = this.constructor;
    n.defaultStyled || n.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = rp(a, ["ables", "props"]), l = N(this._updateRefs(!0), 2), u = l[0], c = l[1], f = hc(u, c), d = f.length > 1, v = n.getTotalAbles(), h = Q(Q([], N(v), !1), N(i || []), !1), m = P(P(P({}, s), o || {}), { ables: h, cssStyled: n.defaultStyled, customStyledMap: n.customStyledMap });
    this._elementTargets = f;
    var x = null, y = this.moveable, S = s.persistData;
    if (S != null && S.children && (d = !0), s.individualGroupable)
      return at.createElement(Ih, P({ key: "individual-group", ref: nr(this, "moveable") }, m, { target: null, targets: f }));
    if (d) {
      var w = gc(u, c);
      if (y && !y.props.groupable && !y.props.individualGroupable) {
        var E = y.props.target;
        E && f.indexOf(E) > -1 && (x = P({}, y.state));
      }
      return at.createElement(Th, P({ key: "group", ref: nr(this, "moveable") }, m, (r = s.groupableProps) !== null && r !== void 0 ? r : {}, { target: null, targets: f, targetGroups: w, firstRenderState: x }));
    } else {
      var M = f[0];
      if (y && (y.props.groupable || y.props.individualGroupable)) {
        var D = y.moveables || [], _ = ye(D, function(g) {
          return g.props.target === M;
        });
        _ && (x = P({}, _.state));
      }
      return at.createElement(Hr, P({ key: "single", ref: nr(this, "moveable") }, m, { target: M, firstRenderState: x }));
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
    var n = this.refTargets, a = Io(this.props.target || this.props.targets), i = typeof document < "u", o = mc(n, a), s = this.selectorMap, l = {};
    return this.refTargets.forEach(function u(c) {
      if (Me(c)) {
        var f = s[c];
        f ? l[c] = s[c] : i && (o = !0, l[c] = [].slice.call(document.querySelectorAll(c)));
      } else Ht(c) && c.forEach(u);
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
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, np([
    Wl(xp)
  ], e.prototype, "moveable", void 0), e;
})(at.PureComponent), Ph = /* @__PURE__ */ (function(t) {
  Dn(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = _h, e;
})(Rh), Vi = function(t, e) {
  return Vi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Vi(t, e);
};
function Oh(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Vi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
function Nh(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var Tn = Nh(function(t, e) {
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
var Ah = Tn.names;
Tn.title;
var fl = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, dl = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function xc(t, e) {
  var r = (Ah[t] || e || "").toLowerCase();
  for (var n in fl)
    r = r.replace(n, fl[n]);
  return r.replace(/\s/g, "");
}
function yc(t, e) {
  e === void 0 && (e = xc(t.keyCode, t.key));
  var r = jh(t);
  return r.indexOf(e) === -1 && r.push(e), r.filter(Boolean);
}
function jh(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function pl(t) {
  var e = t.slice();
  return e.sort(function(r, n) {
    var a = dl[r] || 5, i = dl[n] || 5;
    return a - i;
  }), e;
}
var vl, zh = /* @__PURE__ */ (function(t) {
  Oh(e, t);
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
    }, Jt(n, "blur", a.blur), Jt(n, "keydown", a.keydownEvent), Jt(n, "keyup", a.keyupEvent), a;
  }
  var r = e.prototype;
  return Object.defineProperty(e, "global", {
    /**
     */
    get: function() {
      return vl || (vl = new e());
    },
    enumerable: !1,
    configurable: !0
  }), e.setGlobal = function() {
    return this.global;
  }, r.destroy = function() {
    var n = this.container;
    this.clear(), this.off(), Xt(n, "blur", this.blur), Xt(n, "keydown", this.keydownEvent), Xt(n, "keyup", this.keyupEvent);
  }, r.keydown = function(n, a) {
    return this.addEvent("keydown", n, a);
  }, r.offKeydown = function(n, a) {
    return this.removeEvent("keydown", n, a);
  }, r.offKeyup = function(n, a) {
    return this.removeEvent("keyup", n, a);
  }, r.keyup = function(n, a) {
    return this.addEvent("keyup", n, a);
  }, r.addEvent = function(n, a, i) {
    return Ht(a) ? this.on("".concat(n, ".").concat(pl(a).join(".")), i) : Me(a) ? this.on("".concat(n, ".").concat(a), i) : this.on(n, a), this;
  }, r.removeEvent = function(n, a, i) {
    return Ht(a) ? this.off("".concat(n, ".").concat(pl(a).join(".")), i) : Me(a) ? this.off("".concat(n, ".").concat(a), i) : this.off(n, a), this;
  }, r.triggerEvent = function(n, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = xc(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
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
    var l = yc(a, i);
    l.length > 1 && this.trigger("".concat(n, ".").concat(l.join(".")), s);
  }, e;
})(En), Ui = function(t, e) {
  return Ui = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Ui(t, e);
};
function bc(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Ui(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Zt = function() {
  return Zt = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Zt.apply(this, arguments);
};
function Bh(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Gh(t, e, r, n) {
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
function Fh(t) {
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
function Lh(t) {
  if (typeof Map > "u")
    return t.filter(function(r, n) {
      return t.indexOf(r) === n;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(r) {
    return e.has(r) ? !1 : (e.set(r, !0), !0);
  });
}
function Wh(t, e, r) {
  var n = Pe(t);
  return n.elementFromPoint && n.elementFromPoint(e, r) || null;
}
function Sc(t, e, r) {
  var n = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || Pe(r).createElement(n);
  for (var u in i)
    l.setAttribute(u, i[u]);
  var c = l.children;
  if (a.forEach(function(d, v) {
    Sc(d, c[v], l);
  }), o && o.split(/\s+/g).forEach(function(d) {
    d && !te(l, d) && oo(l, d);
  }), s) {
    var f = l.style;
    for (var u in s)
      f[u] = s[u];
  }
  return !e && r && r.appendChild(l), l;
}
function Yh(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, u = Bh(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: u,
    children: r
  };
}
function di(t, e, r) {
  t !== e && r(t, e);
}
function hl(t, e, r) {
  var n;
  r === void 0 && (r = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, u = l.startX, c = l.startY;
  if (e > 0) {
    var f = Math.sqrt((i * i + s * s) / (1 + e * e)), d = e * f;
    i = (i >= 0 ? 1 : -1) * d, s = (s >= 0 ? 1 : -1) * f;
  }
  var v = Math.abs(i), h = Math.abs(s), m = i < 0 ? u - r.left : r.right - u, x = s < 0 ? c - r.top : r.bottom - c;
  n = io([v, h], [0, 0], [m, x], !!e), v = n[0], h = n[1], i = (i >= 0 ? 1 : -1) * v, s = (s >= 0 ? 1 : -1) * h;
  var y = Math.min(0, i), S = Math.min(0, s), w = u + y, E = c + S;
  return {
    left: w,
    top: E,
    right: w + v,
    bottom: E + h,
    width: v,
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
function gl(t, e, r) {
  var n = Pr(t, e), a = n.list, i = n.prevList, o = n.added, s = n.removed, l = n.maintained;
  return vn(vn(vn([], o.map(function(u) {
    return a[u];
  }), !0), s.map(function(u) {
    return i[u];
  }), !0), r ? l.map(function(u) {
    var c = u[1];
    return a[c];
  }) : []);
}
function ml(t) {
  for (var e = 0, r = t.length, n = 1; n < r; ++n)
    e = Math.max(Ge(t[n], t[n - 1]), e);
  return e;
}
var Cc = au(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), Ki = "selecto-selection ".concat(Cc.className), jo = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], Xh = vn([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], jo), wc = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], Hh = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], $h = /* @__PURE__ */ (function(t) {
  bc(e, t);
  function e(n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new tu(), a._onDragStart = function(s, l) {
      var u = s.data, c = s.clientX, f = s.clientY, d = s.inputEvent, v = a.options, h = v.selectFromInside, m = v.selectByClick, x = v.rootContainer, y = v.boundContainer, S = v.preventDragFromInside, w = S === void 0 ? !0 : S, E = v.clickBySelectEnd, M = v.dragCondition;
      if (M && !M(s)) {
        s.stop();
        return;
      }
      u.data = {};
      var D = Ee(a.container);
      u.innerWidth = D.innerWidth, u.innerHeight = D.innerHeight, a.findSelectableTargets(u), u.startSelectedTargets = a.selectedTargets, u.scaleMatrix = co(), u.containerX = 0, u.containerY = 0;
      var _ = a.container, g = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (x) {
        var T = a.container.getBoundingClientRect();
        u.containerX = T.left, u.containerY = T.top, u.scaleMatrix = _d(a.container, x);
      }
      if (y) {
        var k = xe(y) && "element" in y ? Zt({
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
        }, A = k.element, O = void 0;
        if (A) {
          Me(A) ? O = Pe(_).querySelector(A) : A === !0 ? O = a.container : O = A;
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
      }, z = [], W = m && !E, Y = !1;
      if (!h || W) {
        var L = a._findElement(
          l || d.target,
          // elementFromPoint(clientX, clientY),
          u.selectableTargets
        );
        Y = !!L, W && (z = L ? [L] : []);
      }
      var q = !h && Y;
      if (q && !m)
        return s.stop(), !1;
      var V = d.type, F = V === "mousedown" || V === "touchstart", rt = !s.isClick && F ? a.emit("dragStart", Zt(Zt({}, s), {
        data: u.data
      })) : !0;
      if (!rt)
        return s.stop(), !1;
      if (a.continueSelect ? (z = gl(a.selectedTargets, z, a.continueSelectWithoutDeselect), u.startPassedTargets = a.selectedTargets) : u.startPassedTargets = [], a._select(z, j, s, !0, q && m && !E && w), u.startX = c, u.startY = f, u.selectFlag = !1, u.preventDragFromInside = !1, d.target) {
        var et = fa(u.scaleMatrix, [c - u.containerX, f - u.containerY]);
        a.target.style.cssText += "position: ".concat(x ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(et[0], "px, ").concat(et[1], "px)");
      }
      if (q && m && !E)
        d.preventDefault(), w && (a._selectEnd(u.startSelectedTargets, u.startPassedTargets, j, s, !0), u.preventDragFromInside = !0);
      else {
        u.selectFlag = !0;
        var Z = a.options, it = Z.scrollOptions, tt = Z.innerScrollOptions, st = !1;
        if (tt) {
          for (var nt = s.inputEvent, pt = nt.target, Ct = null, U = pt; U && U !== Pe(_).body; ) {
            var ut = getComputedStyle(U).overflow !== "visible";
            if (ut) {
              Ct = U;
              break;
            }
            U = U.parentElement;
          }
          Ct && (u.innerScrollOptions = Zt({
            container: Ct,
            checkScrollEvent: !0
          }, tt === !0 ? {} : tt), a.dragScroll.dragStart(s, u.innerScrollOptions), st = !0);
        }
        !st && it && it.container && a.dragScroll.dragStart(s, it), q && m && E && (u.selectFlag = !1, s.preventDrag());
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
      var l = s.data, u = s.inputEvent, c = hl(s, a.options.ratio), f = l.selectFlag, d = a.container;
      if (u && a.emit("dragEnd", Zt(Zt({
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
        var v = a._findElement((u == null ? void 0 : u.target) || Wh(d, s.clientX, s.clientY), l.selectableTargets);
        a._select(v ? [v] : [], c, s);
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
      var l = Pe(a.container);
      if (a.gesto.isFlag()) {
        var u = a.dragContainer;
        u === Ee(a.container) && (u = l.documentElement);
        var c = xn(u) ? [u] : [].slice.call(u), f = s.target;
        c.some(function(d) {
          if (d === f || d.contains(f))
            return s.preventDefault(), !0;
        });
      }
    }, a.target = n.portalContainer;
    var i = n.container;
    a.options = Zt({
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
    var a = this.selectedTargets, i = Pr(a, n), o = i.added, s = i.removed, l = i.prevList, u = i.list;
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
    return Zt(Zt({}, d), {
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
    this.off(), this.keycon && this.keycon.destroy(), this.gesto.unset(), this.injectResult.destroy(), this.dragScroll.dragEnd(), Xt(document, "selectstart", this._onDocumentSelectStart), this.options.portalContainer || (n = this.target.parentElement) === null || n === void 0 || n.removeChild(this.target), this.keycon = null, this.gesto = null, this.injectResult = null, this.target = null, this.container = null, this.options = null;
  }, r.getElementPoints = function(n) {
    var a = this.getElementRect || oa, i = a(n), o = [i.pos1, i.pos2, i.pos4, i.pos3];
    if (a !== oa) {
      var s = n.getBoundingClientRect();
      return Ti(o, s);
    }
    return o;
  }, r.getSelectableElements = function() {
    var n = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (Ta(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (xn(i))
        a.push(i);
      else if (xe(i))
        a.push(i.value || i.current);
      else {
        var s = [].slice.call(Pe(n).querySelectorAll(i));
        a.push.apply(a, s);
      }
    }), a;
  }, r.checkScroll = function() {
    if (this.gesto.isFlag()) {
      var n = this.scrollOptions, a = this.gesto.getEventData().innerScrollOptions, i = a || (n == null ? void 0 : n.container);
      i && this.dragScroll.checkScroll(Zt({
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
    var s = this.options, l = s.checkOverflow || s.innerScrollOptions, u = Pe(this.container);
    if (l) {
      var c = /* @__PURE__ */ new Map();
      n.selectableInnerScrollParentMap = c, n.selectableInnerScrollPathsList = i.map(function(f, d) {
        for (var v = f.parentElement, h = [], m = [], x = function() {
          var y = c.get(v);
          if (!y) {
            var S = getComputedStyle(v).overflow !== "visible";
            if (S) {
              var w = oa(v);
              y = {
                parentElement: v,
                indexes: [],
                points: [w.pos1, w.pos2, w.pos4, w.pos3],
                paths: vn([], m)
              }, h.push(v), h.forEach(function(E) {
                c.set(E, y);
              }), h = [];
            }
          }
          y ? (v = y.parentElement, c.get(v).indexes.push(d), m.push(v)) : h.push(v), v = v.parentElement;
        }; v && v !== u.body; )
          x();
        return m;
      });
    }
    return s.checkOverflow || (n.selectableInners = i.map(function() {
      return !0;
    })), this._refreshGroups(n), i;
  }, r.clickTarget = function(n, a) {
    var i = Fh(n), o = i.clientX, s = i.clientY, l = {
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
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new zh(a || Ee(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, r.setClassName = function(n) {
    this.options.className = n, this.target.setAttribute("class", "".concat(Ki, " ").concat(n || ""));
  }, r.setKeyEvent = function() {
    var n = this.options, a = n.toggleContinueSelect, i = n.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, r.setKeyContainer = function(n) {
    var a = this, i = this.options;
    di(i.keyContainer, n, function() {
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
    di(i.toggleContinueSelect, n, function() {
      i.toggleContinueSelect = n, a.setKeyEvent();
    });
  }, r.setToggleContinueSelectWithoutDeselect = function(n) {
    var a = this, i = this.options;
    di(i.toggleContinueSelectWithoutDeselect, n, function() {
      i.toggleContinueSelectWithoutDeselect = n, a.setKeyEvent();
    });
  }, r.setPreventDefault = function(n) {
    this.gesto.options.preventDefault = n;
  }, r.setCheckInput = function(n) {
    this.gesto.options.checkInput = n;
  }, r.initElement = function() {
    var n = this.options, a = n.dragContainer, i = n.checkInput, o = n.preventDefault, s = n.preventClickEventOnDragStart, l = n.preventClickEventOnDrag, u = n.preventClickEventByCondition, c = n.preventRightClick, f = c === void 0 ? !0 : c, d = n.className, v = this.container;
    this.target = Sc(Yh("div", {
      className: "".concat(Ki, " ").concat(d || "")
    }), this.target, v);
    var h = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(Pe(v).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new nu(this.dragContainer, {
      checkWindowBlur: !0,
      container: Ee(v),
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
    }), Jt(document, "selectstart", this._onDocumentSelectStart), this.injectResult = Cc.inject(h, {
      nonce: this.options.cspNonce
    });
  }, r.hitTest = function(n, a, i, o) {
    var s = this.options, l = s.hitRate, u = s.selectByClick, c = n.left, f = n.top, d = n.right, v = n.bottom, h = a.innerGroups, m = a.innerWidth, x = a.innerHeight, y = o == null ? void 0 : o.clientX, S = o == null ? void 0 : o.clientY, w = a.ignoreClick, E = [[c, f], [d, f], [d, v], [c, v]], M = function(L, q) {
      var V = mr(typeof l == "function" ? "".concat(l(q)) : "".concat(l)), F = w ? !1 : ma([y, S], L);
      if (!i && u && F)
        return !0;
      var rt = Ri(E, L);
      if (!rt.length)
        return !1;
      var et = ln(rt), Z = 0;
      if (et === 0 && ln(L) === 0 ? (Z = ml(L), et = ml(rt)) : Z = ln(L), V.unit === "px")
        return et >= V.value;
      var it = ha(Math.round(et / Z * 100), 0, 100);
      return it >= Math.min(100, V.value);
    }, D = a.selectableTargets, _ = a.selectablePoints, g = a.selectableInners;
    if (!h)
      return D.filter(function(L, q) {
        return g[q] ? M(_[q], D[q]) : !1;
      });
    for (var T = [], k = Math.floor(c / m), A = Math.floor(d / m), O = Math.floor(f / x), R = Math.floor(v / x), j = k; j <= A; ++j) {
      var z = h[j];
      if (z)
        for (var W = O; W <= R; ++W) {
          var Y = z[W];
          Y && Y.forEach(function(L) {
            var q = _[L], V = g[L], F = D[L];
            V && M(q, F) && T.push(F);
          });
        }
    }
    return Lh(T);
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
        var f = n.gesto.getEventData().innerScrollOptions, d = f == null ? void 0 : f.container, v = !1;
        if (d) {
          var h = u.selectableInnerScrollParentMap, m = h.get(d);
          m && (m.paths.forEach(function(x) {
            var y = h.get(x);
            y.points.forEach(function(S) {
              S[0] -= i, S[1] -= o;
            });
          }), m.indexes.forEach(function(x) {
            u.selectablePoints[x].forEach(function(y) {
              y[0] -= i, y[1] -= o;
            });
          }), v = !0);
        }
        v || u.selectablePoints.forEach(function(x) {
          x.forEach(function(y) {
            y[0] -= i, y[1] -= o;
          });
        }), n._refreshGroups(u), c.left -= i, c.right -= i, c.top -= o, c.bottom -= o, n.gesto.scrollBy(i, o, s.inputEvent), n._checkSelected(n.gesto.getCurrentEvent());
      }
    });
  }, r._select = function(n, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = i.inputEvent, u = i.data, c = this.setSelectedTargets(n), f = Pr(u.startSelectedTargets, n), d = f.added, v = f.removed, h = f.prevList, m = f.list, x = {
      startSelected: h,
      startAdded: d.map(function(y) {
        return m[y];
      }),
      startRemoved: v.map(function(y) {
        return h[y];
      })
    };
    o && this.emit("selectStart", Zt(Zt(Zt({}, c), x), {
      rect: a,
      inputEvent: l,
      data: u.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    })), (c.added.length || c.removed.length) && this.emit("select", Zt(Zt(Zt({}, c), x), {
      rect: a,
      inputEvent: l,
      data: u.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    }));
  }, r._selectEnd = function(n, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = o.inputEvent, u = o.isDouble, c = o.data, f = l && l.type, d = f === "mousedown" || f === "touchstart", v = Pr(n, this.selectedTargets), h = v.added, m = v.removed, x = v.prevList, y = v.list, S = Pr(a, this.selectedTargets), w = S.added, E = S.removed, M = S.prevList, D = S.list;
    this.emit("selectEnd", {
      startSelected: n,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: h.map(function(_) {
        return y[_];
      }),
      removed: m.map(function(_) {
        return x[_];
      }),
      afterAdded: w.map(function(_) {
        return D[_];
      }),
      afterRemoved: E.map(function(_) {
        return M[_];
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
    a === void 0 && (a = hl(n, this.options.ratio));
    var i = n.data, o = a.top, s = a.left, l = a.width, u = a.height, c = i.selectFlag, f = i.containerX, d = i.containerY, v = i.scaleMatrix, h = fa(v, [s - f, o - d]), m = fa(v, [l, u]), x = [];
    if (c) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(h[0], "px, ").concat(h[1], "px);") + "width:".concat(m[0], "px;height:").concat(m[1], "px;");
      var y = this.hitTest(a, i, !0, n);
      x = gl(i.startPassedTargets, y, this.continueSelect && this.continueSelectWithoutDeselect);
    }
    var S = this.emit("drag", Zt(Zt({}, n), {
      data: i.data,
      isSelect: c,
      rect: a
    }));
    if (S === !1) {
      this.target.style.cssText += "display: none;", n.stop();
      return;
    }
    c && this._select(x, a, n);
  }, r._sameCombiKey = function(n, a, i) {
    if (!a)
      return !1;
    var o = yc(n.inputEvent, n.key), s = [].concat(a), l = Ht(s[0]) ? s : [s];
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
      n.selectableInners = c.map(function(v, h) {
        var m = !1;
        return v.every(function(x) {
          if (m)
            return !0;
          if (x === l)
            return m = !0, !0;
          var y = u.get(x);
          if (y) {
            var S = s[h], w = y.points, E = Ri(S, w);
            if (!E.length)
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
      f.forEach(function(v, h) {
        var m = 1 / 0, x = -1 / 0, y = 1 / 0, S = -1 / 0;
        v.forEach(function(M) {
          var D = Math.floor(M[0] / i), _ = Math.floor(M[1] / o);
          m = Math.min(D, m), x = Math.max(D, x), y = Math.min(_, y), S = Math.max(_, S);
        });
        for (var w = m; w <= x; ++w)
          for (var E = y; E <= S; ++E)
            d[w] = d[w] || {}, d[w][E] = d[w][E] || [], d[w][E].push(h);
      }), n.innerGroups = d;
    }
  }, e = Gh([rd(jo, function(n, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = wi("get ".concat(a));
    n[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = wi("set ".concat(a));
    n[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(n, a, i);
  })], e), e;
})(En), qh = /* @__PURE__ */ (function(t) {
  bc(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})($h), Zi = function(t, e) {
  return Zi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Zi(t, e);
};
function Vh(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Zi(t, e);
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
function Uh(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
var xl = wc.map(function(t) {
  return wi("on ".concat(t));
}), Kh = /* @__PURE__ */ (function(t) {
  Vh(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var r = e.prototype;
  return r.render = function() {
    return at.createElement("div", {
      className: Ki,
      ref: nr(this, "selectionElement")
    });
  }, r.componentDidMount = function() {
    var n = this, a = this.props, i = {};
    Xh.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new qh(_a(_a({}, i), {
      portalContainer: this.selectionElement
    })), wc.forEach(function(o, s) {
      n.selecto.on(o, function(l) {
        var u = n.props, c = u[xl[s]] && u[xl[s]](l);
        c === !1 && l.stop();
      });
    });
  }, r.componentDidUpdate = function(n) {
    var a = this.props, i = this.selecto;
    jo.forEach(function(o) {
      n[o] !== a[o] && (i[o] = a[o]);
    });
  }, r.componentWillUnmount = function() {
    this.selecto.destroy();
  }, Uh([Wl(Hh)], e.prototype, "selecto", void 0), e;
})(at.PureComponent);
const Re = "http://www.w3.org/2000/svg";
function sa(t, e) {
  const r = URL.createObjectURL(t), n = document.createElement("a");
  n.href = r, n.download = e, document.body.appendChild(n), n.click(), n.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function gr(t, e, r, n = { x: 0, y: 0 }) {
  const a = t.getBoundingClientRect();
  return {
    left: (a.left - e.left) / r - n.x,
    top: (a.top - e.top) / r - n.y,
    width: a.width / r,
    height: a.height / r
  };
}
function yl(t, e, r, n, a, i) {
  e.forEach((o) => {
    if (!o.text) return;
    const s = document.createElementNS(Re, "text");
    s.setAttribute("x", String(r + o.left)), s.setAttribute("y", String(n + o.top + a * 0.82)), s.setAttribute("font-size", String(a)), s.setAttribute("font-family", i.fontFamily || sf), s.setAttribute("font-weight", i.fontWeight || "400"), s.setAttribute("fill", i.color || "#1e293b"), s.setAttribute("xml:space", "preserve"), s.textContent = o.text, t.appendChild(s);
  });
}
function Zh(t, e) {
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
function bl(t, e, r, n, a, i, o) {
  const s = gr(e, r, n, i), l = document.createElementNS(Re, "g");
  l.setAttribute("transform", `translate(${Math.round(s.left)},${Math.round(s.top)})`);
  const u = e.querySelector("canvas");
  if (u) {
    const f = document.createElementNS(Re, "image"), d = gr(u, r, n, i);
    f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("width", String(Math.round(d.width || s.width))), f.setAttribute("height", String(Math.round(d.height || s.height))), f.setAttribute("href", lf(e, a, Math.round(d.width || s.width)) ?? u.toDataURL("image/png")), l.appendChild(f);
  }
  const c = e.querySelector("svg");
  if (c) {
    const f = c.cloneNode(!0), d = c.clientWidth || Number(c.getAttribute("width")) || s.width, v = d > 0 ? s.width / d : 1;
    if (Math.abs(v - 1) > 1e-3) {
      const h = document.createElementNS(Re, "g");
      h.setAttribute("transform", `scale(${v})`), h.appendChild(f), l.appendChild(h);
    } else l.appendChild(f);
  }
  Il(l, o), t.appendChild(l);
}
function Sl(t, e, r, n) {
  return [...t.querySelectorAll(".gl-layout-item")].sort((a, i) => (Number(a.style.zIndex) || 0) - (Number(i.style.zIndex) || 0)).map((a) => ({ item: a, frame: gr(a, e, r, n) }));
}
function Jh(t, e, r, n) {
  let a = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const { frame: f } of t)
    f.left >= e || f.top >= r || f.left + f.width <= 0 || f.top + f.height <= 0 || (a = Math.min(a, f.left), i = Math.min(i, f.top), o = Math.max(o, f.left + f.width), s = Math.max(s, f.top + f.height));
  if (!Number.isFinite(a)) return null;
  const l = Math.max(0, n) * yi, u = Math.max(0, Math.floor(a - l)), c = Math.max(0, Math.floor(i - l));
  return { x: u, y: c, width: Math.min(e, Math.ceil(o + l)) - u, height: Math.min(r, Math.ceil(s + l)) - c };
}
function Qh(t, e, r) {
  var h, m;
  const n = xi(e.page), a = pa(e.page)[r.pageIndex ?? 0] ?? { x: 0, y: 0 }, i = t.getBoundingClientRect(), o = r.crop ? Jh(Sl(t, i, r.zoom, a), n.width, n.height, r.crop.paddingMm) : null, s = o ? { x: a.x + o.x, y: a.y + o.y } : a, l = o ? o.width : n.width, u = o ? o.height : n.height, c = document.createElementNS(Re, "svg");
  c.setAttribute("xmlns", Re), c.setAttribute("width", String(l)), c.setAttribute("height", String(u)), c.setAttribute("viewBox", `0 0 ${l} ${u}`);
  const f = document.createElementNS(Re, "rect");
  f.setAttribute("width", "100%"), f.setAttribute("height", "100%"), f.setAttribute("fill", "#ffffff"), c.appendChild(f);
  let d = 0;
  for (const { item: x, frame: y } of Sl(t, i, r.zoom, s)) {
    if (y.left >= l || y.top >= u || y.left + y.width <= 0 || y.top + y.height <= 0) continue;
    d += 1;
    const S = x.dataset.title ?? ((h = x.querySelector(".gl-layout-item-head span")) == null ? void 0 : h.textContent) ?? "";
    if (x.classList.contains("has-frame")) {
      const _ = document.createElementNS(Re, "rect");
      _.setAttribute("x", String(Math.round(y.left) + 0.5)), _.setAttribute("y", String(Math.round(y.top) + 0.5)), _.setAttribute("width", String(Math.round(y.width) - 1)), _.setAttribute("height", String(Math.round(y.height) - 1)), _.setAttribute("fill", "none"), _.setAttribute("stroke", "#94a3b8"), _.setAttribute("id", en("frame", d, S)), c.appendChild(_);
    }
    const w = x.querySelector(".gl-layout-text-surface");
    if (w) {
      const _ = w instanceof HTMLTextAreaElement ? w.value : w.textContent ?? "", g = getComputedStyle(w), T = gr(w, i, r.zoom, s), k = Number(x.dataset.zoom) || 1, A = (parseFloat(g.fontSize) || 14) * k, O = (parseFloat(g.paddingLeft) || 0) * k, R = (parseFloat(g.paddingTop) || 0) * k, j = ((m = Zh(w, _)) == null ? void 0 : m.map((W) => ({ text: W.text, left: W.left * k, top: W.top * k }))) ?? _.split(`
`).map((W, Y) => ({ text: W, left: 0, top: Y * A * 1.3 })), z = document.createElementNS(Re, "g");
      z.setAttribute("id", en("text", d, _.trim().split(/\s+/).slice(0, 4).join(" "))), yl(z, j, T.left + O, T.top + R, A, g), c.appendChild(z);
      continue;
    }
    const E = x.querySelector(".gl-layout-plot-host");
    if (!E) continue;
    if (E.__miniPlotCfg) {
      bl(c, E, i, r.zoom, r.dpi, s, en("plot", d, S));
      continue;
    }
    const M = E.querySelector(".gl-prop-chart");
    if (M) {
      const _ = af(M);
      if (_) {
        const g = gr(M, i, r.zoom, s), T = _.width > 0 ? g.width / _.width : 1, k = document.createElementNS(Re, "g");
        k.setAttribute("id", en("chart", d, S)), k.setAttribute("transform", `translate(${g.left},${g.top}) scale(${T})`), k.appendChild(_.root), c.appendChild(k);
      }
      continue;
    }
    E.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((_) => {
      const g = (_.textContent ?? "").trim();
      if (!g) return;
      const T = getComputedStyle(_), k = gr(_, i, r.zoom, s), A = _.offsetWidth > 0 ? k.width / _.offsetWidth : 1;
      yl(c, [{ text: g, left: 0, top: 0 }], k.left, k.top, (parseFloat(T.fontSize) || 12) * A, T);
    });
    const D = en(E.querySelector(".gl-figure-grid") ? "figure" : "strategy", d, S);
    E.querySelectorAll(".mini-plot-cell").forEach((_, g) => bl(c, _, i, r.zoom, r.dpi, s, `${D}-panel-${g + 1}`)), E.querySelectorAll("svg.gl-strategy-arrows").forEach((_) => {
      const g = gr(_, i, r.zoom, s), T = Number(_.getAttribute("width")) || _.clientWidth || g.width, k = T > 0 ? g.width / T : 1, A = document.createElementNS(Re, "g");
      A.setAttribute("transform", `translate(${Math.round(g.left)},${Math.round(g.top)}) scale(${k})`), Array.from(_.childNodes).forEach((O) => A.appendChild(O.cloneNode(!0))), Il(A, `${D}-arrows`), c.appendChild(A);
    });
  }
  const v = o ? { widthMm: l / yi, heightMm: u / yi } : Rl(e.page);
  return of(c, { widthPx: l, heightPx: u, ...v }), { root: c, width: l, height: u, ...v };
}
function Cl(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
function tg(t, e, r) {
  return pa(e.page).map((n, a) => Qh(t, e, { dpi: e.page.dpi, zoom: r.zoom, pageIndex: a, crop: r.crop }));
}
const wl = 72 / 25.4;
async function eg(t, e, r) {
  const n = e.page.dpi, a = ef(e.name) || "layout";
  if (!t.length) return;
  if (r === "svg") {
    if (t.length === 1) {
      sa(new Blob([Cl(t[0].root)], { type: "image/svg+xml" }), `${a}.svg`);
      return;
    }
    const u = {};
    t.forEach((c, f) => {
      u[`${a}-p${f + 1}.svg`] = rf(Cl(c.root));
    }), sa(new Blob([vs(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  if (r === "png") {
    if (t.length === 1) {
      sa(await hs(await Ka(t[0], n), n), `${a}.png`);
      return;
    }
    const u = {};
    for (const [c, f] of t.entries()) {
      const d = await Ka(f, n);
      u[`${a}-p${c + 1}.png`] = new Uint8Array(await (await hs(d, n)).arrayBuffer()), await gs();
    }
    sa(new Blob([vs(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const i = (u) => {
    const c = u.widthMm * wl, f = u.heightMm * wl;
    return { width: c, height: f, orientation: c >= f ? "landscape" : "portrait" };
  }, { jsPDF: o } = await import("./jspdf.es.min-CDmEd3wX.js").then((u) => u.j), s = i(t[0]), l = new o({ orientation: s.orientation, unit: "pt", format: [s.width, s.height], compress: !0 });
  for (const [u, c] of t.entries()) {
    const { width: f, height: d, orientation: v } = i(c);
    if (u > 0 && l.addPage([f, d], v), !await nf(l, c.root, { width: f, height: d })) {
      const h = await Ka(c, n);
      l.addImage(h, "PNG", 0, 0, f, d, void 0, "FAST");
    }
    await gs();
  }
  l.save(`${a}.pdf`);
}
const rg = "", Ec = "{none}", la = [
  { id: "auto", label: "What differs across the page", template: rg },
  { id: "population", label: "Population", template: "{population}" },
  { id: "file", label: "File", template: "{file}" },
  { id: "sample", label: "Sample id", template: "{sample}" },
  { id: "population-file", label: "Population · file", template: "{population} · {file}" },
  { id: "population-plot", label: "Population · plot", template: "{population} · {plot}" },
  { id: "none", label: "No title", template: Ec }
], pi = "{population}, {file}, {sample}, {x}, {y}, {plot}, {count}, {meta:column}, {popmeta:field}";
function ng(t, e) {
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
const vi = [
  { id: "dot", label: "·", value: " · " },
  { id: "space", label: "space", value: " " },
  { id: "comma", label: ",", value: ", " },
  { id: "slash", label: "/", value: " / " },
  { id: "dash", label: "–", value: " – " }
];
function El(t, e) {
  return t.join(e);
}
function ag(t) {
  const e = t.match(/\{[^}]+\}/g) ?? [];
  if (!e.length) return null;
  const r = t.split(/\{[^}]+\}/);
  if (r[0] !== "" || r[r.length - 1] !== "") return null;
  const n = r.slice(1, -1), a = n[0] ?? " · ";
  return n.some((i) => i !== a) ? null : { tokens: e, separator: a };
}
function Dl(t, e, r, n, a) {
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
function ka(t, e) {
  return t.trim() === Ec ? "" : t.replace(/\{(population|file|sample|x|y|plot|count|meta:[^}]+|popmeta:[^}]+)\}/g, (n, a) => {
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
function ig(t, e) {
  const r = new Set(t.map((o) => o.sampleId)), n = new Set(t.map((o) => o.populationId)), a = t.some((o) => o.label), i = e != null && e.metadataColumn ? n.size > 1 ? `{meta:${e.metadataColumn}} · {population}` : `{meta:${e.metadataColumn}}` : r.size <= 1 && n.size > 1 ? "{population}" : n.size <= 1 && r.size > 1 ? "{file}" : "{population} · {file}";
  return a ? `${i} · {plot}` : i;
}
const og = "Unassigned";
function Dc(t) {
  const e = {};
  for (const [r, n] of Object.entries(t[0] ?? {}))
    t.every((a) => (a == null ? void 0 : a[r]) === n) && (e[r] = n);
  return e;
}
function Mc(t) {
  return oe(t.recipe) && t.recipe.iterated === !0;
}
function Ml(t, e, r, n) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(r) : i === "N" ? String(n) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function hi(t, e, r, n, a, i) {
  const o = Mc(t), s = { ...t.recipe };
  let l;
  return s.kind === "text" ? s.text = Ml(s.text, s.readsFrom ? null : e, r, n) : (o && e && e.populationId ? "populationId" in s && (s.populationId = e.populationId) : o && e && e.sampleIds ? ((s.kind === "biplot" || s.kind === "histogram") && e.sampleIds.length > 1 ? s.pool = { sampleIds: [...e.sampleIds] } : "pool" in s && delete s.pool, "sampleId" in s && !e.sampleIds.includes(s.sampleId) && e.sampleIds.length && (l = s.sampleId, s.sampleId = e.sampleIds[0])) : o && e && "sampleId" in s && s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id), s.title && (s.title = Ml(s.title, e, r, n))), {
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
function sg(t, e) {
  if (e)
    for (const r of t) {
      if (r.recipe.kind !== "text" || !r.recipe.readsFrom) continue;
      const n = r.recipe.readsFrom, a = t.find((o) => o.templateId === n && o.offset.x === r.offset.x && o.offset.y === r.offset.y);
      if (!a || !oe(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId, a.unitId);
      i && (r.recipe = { ...r.recipe, text: ka(r.recipe.text, i) });
    }
}
function lg(t, e, r) {
  const n = ug(t, e);
  for (const a of n) sg(a.items, r);
  return n;
}
function ug(t, e) {
  const r = t.iteration ?? Pl;
  if (r.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((v) => hi(v, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const n = e.length;
  if (r.arrangement.kind === "page-per-unit")
    return e.map((v, h) => ({
      index: h,
      units: [v],
      items: t.items.map((m) => hi(m, v, h + 1, n, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = r.arrangement, l = uf(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const u = a * i, c = l.width + s, f = l.height + s, d = [];
  for (let v = 0; v < n; v += u) {
    const h = e.slice(v, v + u), m = [];
    h.forEach((x, y) => {
      const S = o === "row-major" ? Math.floor(y / i) : y % a, E = { x: (o === "row-major" ? y % i : Math.floor(y / a)) * c, y: S * f };
      for (const M of t.items) m.push(hi(M, x, v + y + 1, n, E, y));
    }), d.push({ index: d.length, units: h, items: m });
  }
  return d;
}
function _c(t, e, r, n) {
  return e.filter((a) => {
    var i;
    return t.kind === "all" ? !0 : t.kind === "checked" ? r.includes(a.id) : t.kind === "group" ? n[a.id] === t.groupId : (((i = a.metadata) == null ? void 0 : i[t.column]) ?? "") === t.value;
  });
}
function cg(t, e, r, n, a) {
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
  return _c(t.source, e, r, a).map(i);
}
function fg(t, e, r, n, a, i) {
  var d;
  const o = t.column ?? "";
  if (!o) return [];
  const s = /* @__PURE__ */ new Map(), l = [];
  for (const v of _c(t.source, e, r, a)) {
    const h = ((d = v.metadata) == null ? void 0 : d[o]) ?? "";
    if (!h) {
      l.push(v);
      continue;
    }
    s.set(h, [...s.get(h) ?? [], v]);
  }
  const u = [...s.keys()], c = i ? [...i.filter((v) => s.has(v)), ...u.filter((v) => !i.includes(v)).sort(ms)] : u.sort(ms), f = (v, h) => {
    const m = new Set(h.map((x) => {
      var y;
      return (y = n.find((S) => S.id === a[x.id])) == null ? void 0 : y.name;
    }));
    return {
      id: `meta:${o}=${v}`,
      name: v,
      fileName: `${h.length} files`,
      ...m.size === 1 && [...m][0] ? { groupName: [...m][0] } : {},
      metadata: Dc(h.map((x) => x.metadata)),
      sampleIds: h.map((x) => x.id)
    };
  };
  return [
    ...c.map((v) => f(v, s.get(v))),
    ...l.length ? [f(og, l)] : []
  ];
}
function dg(t, e, r) {
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
  return ca(e.populations, n).filter(({ popId: s }) => s !== n && i(s)).map(({ popId: s }) => {
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
function pg(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const vg = (t) => [...t].sort((e, r) => e - r);
function gi(t, e) {
  const r = vg(t);
  if (!r.length) return NaN;
  const n = (r.length - 1) * e, a = Math.floor(n), i = Math.ceil(n);
  return r[a] + (r[i] - r[a]) * (n - a);
}
function hg(t, e) {
  const r = e.map((o) => o.value), n = r.length, a = n ? r.reduce((o, s) => o + s, 0) / n : NaN, i = n > 1 ? Math.sqrt(r.reduce((o, s) => o + (s - a) ** 2, 0) / (n - 1)) : 0;
  return {
    label: t,
    points: e,
    n,
    mean: a,
    sd: i,
    median: gi(r, 0.5),
    q1: gi(r, 0.25),
    q3: gi(r, 0.75),
    min: n ? Math.min(...r) : NaN,
    max: n ? Math.max(...r) : NaN
  };
}
function gg(t) {
  const e = [], r = /* @__PURE__ */ new Map();
  for (const n of t)
    r.has(n.group) || (r.set(n.group, []), e.push(n.group)), r.get(n.group).push(n);
  return e.map((n) => hg(n, r.get(n)));
}
function kc(t) {
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
function mg(t) {
  const e = Math.abs(t) / Math.SQRT2, r = 1 / (1 + 0.3275911 * e), i = r * (0.254829592 + r * (-0.284496736 + r * (1.421413741 + r * (-1.453152027 + r * 1.061405429)))) * Math.exp(-e * e) / 2;
  return t >= 0 ? i : 1 - i;
}
function xg(t, e) {
  if (e <= 0) return 0;
  const r = yg(t);
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
function yg(t) {
  const e = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18];
  let r = t, n = t, a = r + 5.5;
  a -= (r + 0.5) * Math.log(a);
  let i = 1.000000000190015;
  for (const o of e) i += o / ++n;
  return -a + Math.log(2.5066282746310007 * i / r);
}
function bg(t, e) {
  return t > 0 ? Math.max(0, Math.min(1, 1 - xg(e / 2, t / 2))) : 1;
}
function Sg(t, e) {
  if (t.length < 2 || e.length < 2) return null;
  const r = t.length, n = e.length, { rank: a, ties: i } = kc([...t, ...e]), s = a.slice(0, r).reduce((v, h) => v + h, 0) - r * (r + 1) / 2, l = r + n, u = r * n / 2, c = Math.sqrt(r * n / 12 * (l + 1 - i / (l * (l - 1))));
  if (!(c > 0)) return { name: "Wilcoxon rank-sum", statistic: s, p: 1, label: "Wilcoxon p = 1" };
  const f = (Math.abs(s - u) - 0.5) / c, d = Math.min(1, 2 * mg(Math.max(0, f)));
  return { name: "Wilcoxon rank-sum", statistic: s, p: d, label: `Wilcoxon ${Tc(d)}` };
}
function Cg(t) {
  const e = t.filter((c) => c.length > 0);
  if (e.length < 2 || e.some((c) => c.length < 2)) return null;
  const r = e.flat(), n = r.length, { rank: a, ties: i } = kc(r);
  let o = 0, s = 0;
  for (const c of e) {
    const f = a.slice(o, o + c.length).reduce((d, v) => d + v, 0);
    s += f * f / c.length, o += c.length;
  }
  s = 12 / (n * (n + 1)) * s - 3 * (n + 1);
  const l = 1 - i / (n ** 3 - n);
  l > 0 && (s /= l);
  const u = bg(s, e.length - 1);
  return { name: "Kruskal–Wallis", statistic: s, p: u, label: `Kruskal–Wallis ${Tc(u)}` };
}
function wg(t) {
  const e = t.map((r) => r.points.map((n) => n.value));
  return e.length === 2 ? Sg(e[0], e[1]) : e.length > 2 ? Cg(e) : null;
}
function Tc(t) {
  return Number.isFinite(t) ? t < 1e-3 ? "p < 0.001" : `p = ${t < 0.01 ? t.toFixed(3) : t.toFixed(2)}` : "p = ?";
}
function Eg(t, e = 5) {
  const r = t.filter((d) => Number.isFinite(d)), n = Math.min(0, ...r), a = Math.max(...r, n + 1e-9), o = (a - n || 1) / e, s = 10 ** Math.floor(Math.log10(o)), l = [1, 2, 2.5, 5, 10].map((d) => d * s).find((d) => d >= o) ?? s * 10, u = Math.floor(n / l) * l, c = Math.ceil((a + l * 0.15) / l) * l, f = [];
  for (let d = u; d <= c + l / 2; d += l) f.push(Number(d.toFixed(10)));
  return { min: u, max: c, ticks: f };
}
const Ic = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function Dg(t, e, r, n, a) {
  var d, v;
  const i = e.find((h) => h.id === t.sampleId) ?? null, o = ((d = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : d.name) ?? "the population", s = t.files === "all" ? e : e.filter((h) => n.includes(h.id)), l = [], u = [];
  for (const h of s) {
    let m = t.populationId;
    if (i && i.tree.id !== h.tree.id) {
      const S = Ir(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        h.tree,
        cr(a)
      );
      if (!S.id) {
        u.push(h.name);
        continue;
      }
      m = S.id;
    }
    let x;
    if (t.statistic === "median") {
      const S = t.channel ? h.sample.index(t.channel) : void 0, w = h.derived.masks[m];
      if (S === void 0 || !w) x = null;
      else {
        const E = h.sample.displayColumn(S), M = [];
        for (let D = 0; D < E.length; D++) w[D] && Number.isFinite(E[D]) && M.push(E[D]);
        x = M.length ? cf(M) : null;
      }
    } else
      x = h.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][m];
    if (typeof x != "number" || !Number.isFinite(x)) continue;
    const y = t.groupBy ? ((v = r[h.id]) == null ? void 0 : v[t.groupBy]) ?? "" : h.name;
    l.push({ sampleId: h.id, name: h.name, group: y, value: x });
  }
  const c = gg(l), f = t.statistic === "median" ? `Median ${t.channel ?? ""}`.trim() : Ic[t.statistic];
  return { points: l, groups: c, test: t.test && t.groupBy ? wg(c) : null, population: o, axis: f, missing: u };
}
const mi = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), Mg = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function _g({
  data: t,
  recipe: e,
  style: r,
  width: n,
  height: a,
  title: i
}) {
  const o = r.fontTick, s = r.fontAxis, l = r.fontTitle, u = t.groups, c = at.useMemo(() => Eg(t.points.map((k) => k.value)), [t.points]), f = 8 + s + 6 + Math.max(...c.ticks.map((k) => mi(k).length), 1) * o * 0.6 + 8, d = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), v = Math.max(0, ...u.map((k) => k.label.length)), h = u.length > 0 && v * o * 0.6 > (n - f - 8) / u.length, m = 8 + (h ? v * o * 0.45 + 10 : o + 8), x = Math.max(20, n - f - 8), y = Math.max(20, a - d - m), S = (k) => d + y - (k - c.min) / (c.max - c.min || 1) * y, w = u.length ? x / u.length : x, E = (k) => f + (k + 0.5) * w, M = Math.min(48, w * 0.6), D = r.pubStyle ? "#000000" : "#334155", _ = r.pubStyle ? "#d4d4d8" : "#93c5fd", g = r.pubStyle ? "#000000" : "#1d4ed8", T = S(Math.max(c.min, 0));
  return /* @__PURE__ */ C.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: n, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ C.jsxs("svg", { width: n, height: a, viewBox: `0 0 ${n} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ C.jsx("rect", { width: n, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ C.jsx("text", { x: n / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: D, children: i }),
    !t.points.length && /* @__PURE__ */ C.jsx("text", { x: n / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ C.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: D, children: [
      /* @__PURE__ */ C.jsx("line", { x1: f, x2: f, y1: d, y2: d + y, stroke: D }),
      c.ticks.map((k) => /* @__PURE__ */ C.jsxs("g", { children: [
        /* @__PURE__ */ C.jsx("line", { x1: f - 4, x2: f, y1: S(k), y2: S(k), stroke: D }),
        /* @__PURE__ */ C.jsx("text", { x: f - 6, y: S(k), textAnchor: "end", dominantBaseline: "central", children: mi(k) })
      ] }, k)),
      /* @__PURE__ */ C.jsx("text", { transform: `translate(${8 + s} ${d + y / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ C.jsx("line", { x1: f, x2: f + x, y1: T, y2: T, stroke: D })
    ] }),
    /* @__PURE__ */ C.jsx("g", { className: "gl-layout-chart-groups", children: u.map((k, A) => {
      const O = E(A), R = e.showPoints || e.chartType === "dots" ? k.points : [];
      return /* @__PURE__ */ C.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(k.mean) && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
          /* @__PURE__ */ C.jsx("rect", { x: O - M / 2, y: Math.min(S(k.mean), T), width: M, height: Math.abs(T - S(k.mean)), fill: _, stroke: D, strokeWidth: 0.8 }),
          k.n > 1 && k.sd > 0 && /* @__PURE__ */ C.jsxs("g", { stroke: D, strokeWidth: 1, children: [
            /* @__PURE__ */ C.jsx("line", { x1: O, x2: O, y1: S(k.mean - k.sd), y2: S(k.mean + k.sd) }),
            /* @__PURE__ */ C.jsx("line", { x1: O - M / 4, x2: O + M / 4, y1: S(k.mean + k.sd), y2: S(k.mean + k.sd) }),
            /* @__PURE__ */ C.jsx("line", { x1: O - M / 4, x2: O + M / 4, y1: S(k.mean - k.sd), y2: S(k.mean - k.sd) })
          ] })
        ] }),
        e.chartType === "box" && k.n > 0 && /* @__PURE__ */ C.jsxs("g", { stroke: D, strokeWidth: 1, fill: _, children: [
          /* @__PURE__ */ C.jsx("line", { x1: O, x2: O, y1: S(k.min), y2: S(k.q1) }),
          /* @__PURE__ */ C.jsx("line", { x1: O, x2: O, y1: S(k.q3), y2: S(k.max) }),
          /* @__PURE__ */ C.jsx("rect", { x: O - M / 2, y: S(k.q3), width: M, height: Math.max(0.5, S(k.q1) - S(k.q3)) }),
          /* @__PURE__ */ C.jsx("line", { x1: O - M / 2, x2: O + M / 2, y1: S(k.median), y2: S(k.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && k.n > 1 && /* @__PURE__ */ C.jsx("line", { x1: O - M / 2, x2: O + M / 2, y1: S(k.mean), y2: S(k.mean), stroke: D, strokeWidth: 2 }),
        R.map((j, z) => /* @__PURE__ */ C.jsx("circle", { cx: O + Mg(z + A * 31) * M * 0.3, cy: S(j.value), r: Math.max(2, o * 0.28), fill: g, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ C.jsx("title", { children: `${j.name}: ${mi(j.value)}` }) }, j.sampleId)),
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
      ] }, k.label || String(A));
    }) }),
    t.test && u.length >= 2 && /* @__PURE__ */ C.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: D, children: [
      /* @__PURE__ */ C.jsx("line", { x1: E(0), x2: E(u.length - 1), y1: d - 4, y2: d - 4, stroke: D }),
      /* @__PURE__ */ C.jsx("text", { x: (E(0) + E(u.length - 1)) / 2, y: d - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const ua = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), kg = { x: "X (px)", y: "Y (px)", width: "Width (px)", height: "Height (px)" }, rn = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], _l = 10, Tg = { index: 0, units: [], items: [] }, Ig = {}, kl = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, Rg = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], Pg = [
  { how: "horizontal", label: "Distribute ↔", title: "Equal spacing between three or more items or groups, left to right; the outer two stay where they are" },
  { how: "vertical", label: "Distribute ↕", title: "Equal spacing between three or more items or groups, top to bottom; the outer two stay where they are" }
];
function Og(t) {
  var r, n, a;
  if (!t) return;
  t.stopDrag();
  const e = (r = t.getManager) == null ? void 0 : r.call(t);
  for (const i of ((n = e == null ? void 0 : e.getMoveables) == null ? void 0 : n.call(e)) ?? []) i !== e && ((a = i.stopDrag) == null || a.call(i));
}
function Ng(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function Ag(t, e, r) {
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
  if (n.kind === "chart") return `${(i == null ? void 0 : i.name) ?? "Population"} · ${Ic[n.statistic]}`;
  if (n.kind === "strategy")
    return `${(i == null ? void 0 : i.name) ?? "Population"} strategy`;
  const o = hn(n);
  return o ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${o.length} files` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function hn(t) {
  return (t.kind === "biplot" || t.kind === "histogram") && t.pool && t.pool.sampleIds.length > 1 ? t.pool.sampleIds : null;
}
function Ji(t, e, r, n) {
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
    const d = bi(t.populationId, f.tree, r, n ?? i.tree.id);
    if (d.missing) {
      s.push({ name: f.name, reason: "no corresponding population" });
      continue;
    }
    const v = f === i ? null : yf(i.sample, f.sample, t.xChannel, l);
    if (v) {
      s.push({ name: f.name, reason: v });
      continue;
    }
    o.push({ id: f.id, name: f.name, sample: f.sample, tree: f.tree, gating: f.derived, populationId: d.id });
  }
  return { members: o, leftOut: s };
}
function jg({
  files: t,
  pool: e,
  checkedSampleIds: r,
  groups: n,
  fileGroups: a,
  report: i,
  onChange: o
}) {
  const { t: s } = Sn(), [l, u] = at.useState(""), c = at.useMemo(
    () => Object.fromEntries(t.filter((m) => m.metadata).map((m) => [m.id, m.metadata])),
    [t]
  ), f = at.useMemo(
    () => Ef(c, [...new Set(Object.values(c).flatMap((m) => Object.keys(m)))].map((m) => ({ name: m }))),
    [c]
  ), d = at.useMemo(() => new Set(t.filter((m) => !e.includes(m.id)).map((m) => m.id)), [t, e]), v = (m) => t.filter((x) => m instanceof Set ? m.has(x.id) : m.includes(x.id)).map((x) => x.id), h = l.trim().toLowerCase();
  return /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-pool", children: [
    /* @__PURE__ */ C.jsxs("div", { className: "gl-figure-actions gl-figure-list-actions", children: [
      /* @__PURE__ */ C.jsx("button", { type: "button", onClick: () => o(v(r)), children: s("Checked files") }),
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
          onChange: () => o(e.includes(m.id) ? e.filter((x) => x !== m.id) : v([...e, m.id]))
        }
      ),
      /* @__PURE__ */ C.jsx("span", { className: "gl-figure-row-name", children: m.name })
    ] }, m.id)) }),
    f.length > 0 && /* @__PURE__ */ C.jsx("div", { className: "gl-sample-facets gl-figure-facets", "aria-label": s("Select pooled files by metadata"), children: f.map((m) => /* @__PURE__ */ C.jsxs("div", { className: "gl-sample-facet-row", children: [
      /* @__PURE__ */ C.jsx("span", { className: "gl-sample-facet-lock", "aria-hidden": "true" }),
      /* @__PURE__ */ C.jsx("span", { className: "gl-sample-facet-name", title: m.name, children: m.name }),
      /* @__PURE__ */ C.jsx("div", { className: "gl-sample-facet-values", children: m.values.map((x) => {
        const y = Df(x.sampleIds, d), S = x.sampleIds.length, w = y === S ? "all" : y === 0 ? "none" : "some", E = S > 0 ? Math.round(y / S * 100) : 0;
        return /* @__PURE__ */ C.jsxs(
          "button",
          {
            type: "button",
            className: `gl-sample-facet-chip is-${w}`,
            style: w === "some" ? { "--gl-facet-fill": `${E}%` } : void 0,
            "aria-pressed": y === S,
            title: `${x.value}: ${y} of ${S} pooled — ${y === S ? `click to drop all ${S}` : `click to pool all ${S}`}`,
            onClick: () => o(v(new Set(t.filter((M) => !Mf(x.sampleIds, d).has(M.id)).map((M) => M.id)))),
            children: [
              /* @__PURE__ */ C.jsx("span", { className: "gl-sample-facet-label", children: x.value }),
              /* @__PURE__ */ C.jsxs("span", { className: "gl-sample-facet-count", children: [
                y,
                "/",
                S
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
function zg({
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
  var A, O;
  const c = at.useRef(null), f = t.recipe, d = JSON.stringify(o), v = at.useMemo(() => cr(r), [r]), h = f.kind === "text" ? null : e.find(({ id: R }) => R === f.sampleId) ?? null, m = hn(f), x = (m == null ? void 0 : m.join("|")) ?? "", y = at.useMemo(
    () => x ? x.split("|").map((R) => e.find((j) => j.id === R) ?? null) : null,
    [e, x]
  ), S = h ? { ...r, ...h.tree } : r, w = f.kind !== "text" && t.templateSampleId && t.templateSampleId !== f.sampleId ? e.find(({ id: R }) => R === t.templateSampleId) ?? null : null, E = f.kind === "text" || !h ? { id: f.kind === "text" ? "" : f.populationId, missing: !1 } : bi(f.populationId, h.tree, v, w == null ? void 0 : w.tree.id), M = E.id, D = E.missing ? ((A = w == null ? void 0 : w.tree.populations[f.kind === "text" ? "" : f.populationId]) == null ? void 0 : A.name) ?? "the population" : null, _ = f.kind === "text" ? null : u({ ...f, populationId: M }, void 0, t.unitId), g = (R) => _ ? ka(R, _) : R, T = f.kind === "strategy" ? g(((O = f.title) == null ? void 0 : O.trim()) || "{population}") : g(l), k = JSON.stringify(f);
  return at.useEffect(() => {
    const R = c.current;
    if (!R || f.kind === "text") return;
    const j = window.setTimeout(() => {
      var it, tt, st;
      if (R.innerHTML = "", !h) {
        R.textContent = "The referenced file is unavailable or still loading.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      const z = S.populations[M];
      if (D || !z) {
        R.textContent = D ? `${h.name} has no population corresponding to ${D}.` : "The referenced population is unavailable.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      R.className = "gl-layout-plot-host";
      const W = Math.max(120, t.width - 8), Y = Math.max(120, t.height - 8);
      if (f.kind === "strategy" && ((it = f.populationIds) != null && it.length)) {
        const nt = h.tree, pt = nt.root_population_id ?? "", Ct = f.populationIds.map((Rt) => bi(Rt, nt, v, w == null ? void 0 : w.tree.id)).filter((Rt) => !Rt.missing).map((Rt) => Rt.id), U = Of(h.sample, nt.gates, nt.populations, pt, h.derived.masks, Ct, { maxEvents: o.maxEvents, globalScales: n }), ut = Math.max(1, f.columns ?? 4), yt = f.layout === "flow" ? Nf(U, ut, nt.populations) : Af(U, nt.populations);
        if (!yt.length) {
          R.textContent = `${h.name} has none of the strategy's populations.`, R.className = "gl-layout-plot-host is-missing";
          return;
        }
        const mt = f.showArrows !== !1, dt = mt ? jf(yt, nt.populations) : [], bt = mt ? zf(dt) : 8, xt = mt ? Bf(dt) : 8, kt = Math.max(120, Math.min(800, f.plotSize ?? 200));
        R.removeAttribute("id");
        const vt = document.createElement("div");
        vt.id = `layout-strategy-${t.id}`, vt.style.width = "max-content", R.appendChild(vt);
        const Mt = (Rt) => {
          const jt = Hf(yt, {
            displayMode: f.displayMode,
            plotSize: kt,
            contourThreshold: o.contourThreshold,
            contourLevels: o.contourLevels,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateLabelFormat: o.gateLabels,
            gateLabelBold: f.gateLabelBold,
            labelBackground: f.labelBackground,
            gridGap: bt,
            gridRowGap: xt,
            canvasScale: s * Rt,
            fontSizes: ua(o),
            contextTitle: T
          });
          Ja().renderMultiStrategyGrid(vt.id, jt);
        };
        Mt(1), mt && Gf(vt);
        const Ft = vt.scrollWidth, qt = vt.scrollHeight, Bt = Ft > 0 && qt > 0 ? Math.max(0.1, Math.min(4, W / Ft, Y / qt)) : 1;
        Math.abs(Bt - 1) > 0.01 && (vt.style.zoom = String(Bt), Mt(Bt)), Ff(vt, dt, { color: f.arrowColor ?? (o.pubStyle ? "#444444" : null), width: f.arrowWidth ?? 1.5, anchor: f.arrowAnchor ?? "label" });
        return;
      }
      if (f.kind === "strategy") {
        const nt = Lf(
          h.sample,
          S.gates,
          S.populations,
          S.root_population_id ?? "",
          M,
          { fullPath: f.fullPath, maxEvents: o.maxEvents }
        ), pt = 8, Ct = 26, U = Math.max(1, nt.length);
        let ut = 1, yt = 0;
        for (let dt = 1; dt <= U; dt++) {
          const bt = Math.ceil(U / dt), xt = Math.floor((W - pt * (dt - 1)) / dt), kt = Math.floor((Y - Ct - pt * (bt - 1)) / bt), vt = Math.min(xt, kt);
          vt > yt && (yt = vt, ut = dt);
        }
        yt = Math.max(100, Math.min(800, yt));
        const mt = Wf(
          h.sample,
          nt,
          null,
          n,
          {
            gateView: ["forward"],
            displayMode: f.displayMode,
            maxEvents: o.maxEvents,
            nColumns: ut,
            plotSize: yt,
            fitToColumns: !1,
            contourThreshold: o.contourThreshold,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateLabelFormat: o.gateLabels,
            fontSizes: ua(o),
            contextTitle: T
          }
        );
        R.id = `layout-strategy-${t.id}`;
        for (const dt of Object.values(mt.plots ?? {})) dt.canvas_scale = s;
        Ja().renderStrategyGrid(R.id, mt);
        return;
      }
      const L = Math.max(120, Math.min(W, Y)), q = f.kind === "histogram" ? null : f.yChannel, V = {
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
        fontSizes: ua(o),
        scaleFontsWithPlot: !0
      }, F = (nt, pt) => Ja().renderMiniPlot(R, {
        ...nt,
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
        font_sizes: ua(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: "#334155",
        gates: pt
      });
      if (y) {
        const { members: nt } = Ji(f, e, v, w == null ? void 0 : w.tree.id), pt = nt.length ? Yf(nt, f.xChannel, q, n, V, v) : null;
        if (!pt) {
          R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
          return;
        }
        F(pt.config, pt.gates);
        return;
      }
      const rt = Xf(
        h.sample,
        S.gates,
        S.gate_order,
        S.populations,
        h.derived.masks,
        h.derived.stats.event_count,
        [M],
        [f.xChannel],
        q,
        n,
        V,
        h.derived.gateMasks
      ), et = `${M}|${f.xChannel}`, Z = (tt = rt.plots) == null ? void 0 : tt[et];
      if (!Z) {
        R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      F(Z, ((st = rt.gate_overlays) == null ? void 0 : st[et]) ?? []);
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
    S.gate_order,
    S.gate_version,
    S.gates,
    S.stored_hierarchies,
    S.populations,
    S.root_population_id,
    M,
    D,
    s,
    T,
    y,
    v
  ]), f.kind === "text" ? /* @__PURE__ */ C.jsx(
    "div",
    {
      className: "gl-layout-text-surface",
      style: { fontSize: f.fontSize, fontWeight: f.bold ? 700 : 400 },
      children: f.text
    }
  ) : /* @__PURE__ */ C.jsx("div", { ref: c, className: "gl-layout-plot-host" });
}
function Bg({
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
  files: v,
  sources: h,
  divisionProfiles: m,
  canvasScale: x,
  onTextChange: y,
  onTextFocus: S,
  textEditing: w,
  onTextEditStart: E,
  onTextEditEnd: M,
  onIsolate: D
}) {
  var k;
  const { t: _ } = Sn(), g = If(t), T = g === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / g)), height: Math.max(1, Math.round(t.height / g)) };
  return /* @__PURE__ */ C.jsx(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": g === 1 ? void 0 : g,
      title: `${t.locked ? `${_("Locked")} · ` : ""}${$e(t, n)}`,
      "data-title": $e(t, n),
      onDoubleClick: D ? (A) => {
        A.stopPropagation(), D();
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
        Fg,
        {
          text: t.recipe.text,
          templateText: e ?? t.recipe.text,
          fontSize: t.recipe.fontSize,
          bold: t.recipe.bold,
          editing: w,
          onEditStart: E,
          onEditEnd: M,
          onCommit: y,
          onFocus: S
        }
      ) : t.recipe.kind === "figure" ? /* @__PURE__ */ C.jsx(
        Rf,
        {
          recipe: t.recipe,
          files: v,
          sources: h,
          state: a,
          globalScales: i,
          width: Math.max(120, T.width - 8),
          height: Math.max(80, T.height - 8)
        }
      ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ C.jsx(
        Pf,
        {
          recipe: t.recipe,
          samples: v,
          state: a,
          metadataById: d,
          divisionProfiles: m,
          width: Math.max(120, T.width - 8),
          height: Math.max(80, T.height - 8),
          containerId: `layout-proportions-${t.id}`
        }
      ) : t.recipe.kind === "chart" ? /* @__PURE__ */ C.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ C.jsx(
        _g,
        {
          data: Dg(t.recipe, n, d, f, a),
          recipe: t.recipe,
          style: l,
          width: Math.max(120, T.width - 8),
          height: Math.max(80, T.height - 8),
          title: ((k = t.recipe.title) == null ? void 0 : k.trim()) || $e(t, n)
        }
      ) }) : /* @__PURE__ */ C.jsx(
        zg,
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
const Gg = [
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
function Tl({
  effective: t,
  own: e,
  onChange: r
}) {
  const { t: n } = Sn();
  return /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-style-fields", children: [
    Gg.map(({ key: a, label: i, step: o, integer: s }) => /* @__PURE__ */ C.jsxs(at.Fragment, { children: [
      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline" + (a in e ? " is-own" : ""), children: [
        n(i),
        /* @__PURE__ */ C.jsx(
          pe,
          {
            "aria-label": n(i),
            value: a === "maxEvents" && t.maxEvents === 0 ? ws.maxEvents : t[a],
            min: Cs[a][0],
            max: Cs[a][1],
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
            onChange: (l) => r({ maxEvents: l.target.checked ? 0 : ws.maxEvents })
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
function Fg({
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
  const { t: u } = Sn(), [c, f] = at.useState(e), d = at.useRef(null);
  at.useEffect(() => {
    if (!a) return;
    f(e);
    const h = d.current;
    h && (h.focus({ preventScroll: !0 }), h.setSelectionRange(h.value.length, h.value.length));
  }, [a]);
  const v = { fontSize: r, fontWeight: n ? 700 : 400 };
  return a ? /* @__PURE__ */ C.jsx(
    "textarea",
    {
      ref: d,
      className: "gl-layout-text-surface",
      "aria-label": "Layout text",
      value: c,
      style: v,
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
      style: v,
      title: u("Double-click to edit"),
      onDoubleClick: (h) => {
        h.stopPropagation(), i();
      },
      children: t
    }
  );
}
function Wg({
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
  defaultX: v,
  defaultY: h,
  illustrationConfig: m,
  onOpenInIllustration: x,
  plottingSettings: y,
  divisionProfiles: S = Ig,
  onOpenInPlotting: w,
  dataRevision: E,
  densityColorPower: M,
  onOpenInGating: D,
  onExported: _
}) {
  var ss, ls, us, cs, fs, ds;
  const { t: g } = Sn(), [T, k] = at.useState([]), [A, O] = at.useState(null), [R, j] = at.useState(!0), [z, W] = at.useState(null), [Y, L] = at.useState(null), [q, V] = at.useState([]), [F, rt] = at.useState([]), et = at.useRef(null), Z = at.useRef(null), [it, tt] = at.useState(null), [st, nt] = at.useState(null), [pt, Ct] = at.useState(
    u ?? ((ss = r[0]) == null ? void 0 : ss.id) ?? ""
  ), [U, ut] = at.useState("item"), [yt, mt] = at.useState(!1), [dt, bt] = at.useState({ shift: !1, meta: !1 });
  at.useEffect(() => {
    const p = (I) => bt((B) => {
      const G = { shift: I.shiftKey, meta: I.metaKey || I.ctrlKey };
      return G.shift === B.shift && G.meta === B.meta ? B : G;
    }), b = () => bt((I) => I.shift || I.meta ? { shift: !1, meta: !1 } : I);
    return window.addEventListener("keydown", p), window.addEventListener("keyup", p), window.addEventListener("blur", b), () => {
      window.removeEventListener("keydown", p), window.removeEventListener("keyup", p), window.removeEventListener("blur", b);
    };
  }, []);
  const [xt, kt] = at.useState(1), vt = at.useRef(xt);
  vt.current = xt;
  const [Mt, Ft] = at.useState(xt);
  at.useEffect(() => {
    const p = window.setTimeout(() => Ft(xt), 250);
    return () => window.clearTimeout(p);
  }, [xt]);
  const qt = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * Mt)), [Bt, Rt] = at.useState("pdf"), [jt, je] = at.useState(!1), [Te, In] = at.useState(3), [Ue, Rn] = at.useState(!1), We = at.useRef(null), lr = at.useRef(null), Ke = (p) => {
    var b;
    k(p), (b = We.current) == null || b.focus({ preventScroll: !0 });
  }, Pn = (p) => Ke(p ? [p] : []), ge = ff(
    r,
    r.map((p) => p.id),
    f,
    E
  ), Pt = at.useMemo(
    () => ge.current ? ge.sources.map((p) => ({ ...p, derived: p.gating })) : [],
    [ge.current, ge.sources]
  ), Er = at.useMemo(
    () => Object.fromEntries(r.map((p) => [p.id, p.metadata])),
    [r]
  ), Ze = at.useMemo(() => cr(f), [f]), Wt = r.length === 0 || ge.current && ge.pending === 0, Tt = at.useRef([]), Yt = at.useRef([]), K = t.sheets.find(({ id: p }) => p === t.activeSheetId) ?? t.sheets[0], ft = (K == null ? void 0 : K.iteration) ?? Pl, ee = at.useMemo(() => {
    const p = K == null ? void 0 : K.items.find((I) => oe(I.recipe) && I.recipe.iterated === !0), b = p && "sampleId" in p.recipe ? p.recipe.sampleId : u;
    return Pt.find(({ id: I }) => I === b) ?? Pt[0] ?? null;
  }, [K, Pt, u]), Se = at.useMemo(
    () => ft.mode === "populations" ? ee ? dg(ft, ee.tree, r.find(({ id: p }) => p === ee.id) ?? ee) : [] : ft.mode === "metadata" ? fg(ft, r, n, a, i, s == null ? void 0 : s[ft.column ?? ""]) : cg(ft, r, n, a, i),
    [ft, r, n, a, i, ee, s]
  ), Dr = at.useCallback((p, b, I) => {
    var lt;
    const B = r.find(({ id: Dt }) => Dt === p.sampleId) ?? null, G = Pt.find(({ id: Dt }) => Dt === p.sampleId) ?? null;
    let $ = p.populationId;
    if (G && b && b !== p.sampleId) {
      const Dt = Pt.find(({ id: re }) => re === b);
      if (Dt && Dt.tree.id !== G.tree.id) {
        const re = Ir({ hierarchyId: Dt.tree.id, populationId: p.populationId }, G.tree, cr(f));
        re.id && ($ = re.id);
      }
    }
    const X = G == null ? void 0 : G.tree.populations[$], ot = hn(p);
    if (ot && p.kind !== "strategy") {
      const { members: Dt } = Ji(p, Pt, Ze, b ? (lt = Pt.find(({ id: Ut }) => Ut === b)) == null ? void 0 : lt.tree.id : void 0), re = Dt.reduce((Ut, ps) => Ut + (ps.gating.stats.event_count[ps.populationId] ?? 0), 0), Ce = I ? Se.find((Ut) => Ut.id === I) : void 0;
      return Dl(
        p,
        { name: Ce != null && Ce.sampleIds ? Ce.name : `${ot.length} files`, fileName: `${ot.length} files`, metadata: Dc(ot.map((Ut) => Er[Ut])) },
        X ? { id: $, name: X.name } : null,
        Dt.length ? re : void 0,
        l
      );
    }
    const Et = G == null ? void 0 : G.derived.stats.event_count[$];
    return Dl(
      p.kind === "strategy" ? {} : p,
      B ? { name: B.name, fileName: B.fileName ?? B.name, metadata: B.metadata } : null,
      X ? { id: $, name: X.name } : null,
      typeof Et == "number" ? Et : void 0,
      l
    );
  }, [r, Pt, f, l, Ze, Er, Se]), me = at.useMemo(
    () => K ? lg(K, Se, Dr) : [],
    [K, Se, Dr]
  ), [Ga, Mr] = at.useState(0), [zo, Rc] = at.useState(!1), [Pc, Oc] = at.useState(" · "), Bo = at.useMemo(
    () => [...new Set(Object.values(l ?? {}).flatMap((p) => Object.keys(p)))].sort(),
    [l]
  ), Go = at.useMemo(() => ng(o, Bo), [o, Bo]), ze = Math.min(Ga, Math.max(0, me.length - 1)), Vt = me[ze] ?? Tg, Fo = ((ls = K == null ? void 0 : K.titleTemplate) == null ? void 0 : ls.trim()) || ig(
    Vt.items.flatMap((p) => {
      var b;
      return oe(p.recipe) ? [{ sampleId: ((b = hn(p.recipe)) == null ? void 0 : b.join(",")) ?? p.recipe.sampleId, populationId: p.recipe.populationId, label: p.recipe.kind === "strategy" ? void 0 : p.recipe.label }] : [];
    }),
    ft.mode === "metadata" ? { metadataColumn: ft.column } : void 0
  );
  at.useEffect(() => {
    Ga !== ze && Mr(ze);
  }, [Ga, ze]);
  const Kr = (p) => p.split("::")[0], ie = [...new Set(T.map(Kr))], de = (K == null ? void 0 : K.items.filter(({ id: p }) => ie.includes(p))) ?? [], J = de.length === 1 ? de[0] : null, Be = J ? Vt.items.find((p) => p.templateId === J.id) ?? null : null, Lo = (p) => p.split("::")[1] ?? "", On = (p) => {
    var b;
    return (b = Vt.items.find((I) => I.id === p)) == null ? void 0 : b.group;
  }, Wo = (p) => {
    const b = new Set(p.map(On).filter((G) => !!G));
    if (!b.size) return [...p];
    const I = new Set(p.map(Lo)), B = new Set(p);
    for (const G of Vt.items) G.group && b.has(G.group) && I.has(Lo(G.id)) && B.add(G.id);
    return [...B];
  }, Zr = df(de).length, Nc = de.length > 1 && de.every((p) => p.group && p.group === de[0].group), Yo = (p, b) => {
    var G;
    if (!oe(p.recipe)) return "";
    const I = ((G = p.recipe.title) == null ? void 0 : G.trim()) ?? "";
    if (!I) return "";
    const B = Dr(p.recipe, b);
    return B && Ag(I, B.population, [B.file, B.sample]) ? "" : I;
  }, Ac = Be && oe(Be.recipe) ? ka(Fo, Dr(Be.recipe, Be.templateSampleId, Be.unitId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", Fa = de.some((p) => p.locked), Nn = new Set(((K == null ? void 0 : K.items) ?? []).filter((p) => p.locked).map((p) => p.id)), Ye = q.filter((p) => !Nn.has(Kr(p.dataset.itemId ?? "")) && p.dataset.itemId !== A), Jr = Ye.length > 1 && Ye.every((p) => !On(p.dataset.itemId ?? "")), Xo = at.useRef(Ye);
  Xo.current = Ye;
  const An = at.useRef(!1);
  at.useEffect(() => {
    T.length && T.some((p) => !Vt.items.some((b) => b.id === p)) && k((p) => p.filter((b) => Vt.items.some((I) => I.id === b)));
  }, [Vt, T]), at.useLayoutEffect(() => {
    var p;
    (p = et.current) == null || p.updateRect();
  }, [Vt, xt, Mt]), at.useLayoutEffect(() => {
    var G;
    if (!z) return;
    const p = [...z.querySelectorAll("[data-item-id]")], b = ($, X) => $.length === X.length && $.every((ot, Et) => ot === X[Et]), I = p.filter(($) => T.includes($.dataset.itemId ?? "")), B = p.filter(($) => !T.includes($.dataset.itemId ?? ""));
    V(($) => b($, I) ? $ : I), rt(($) => b($, B) ? $ : B), (G = Z.current) == null || G.setSelectedTargets(I);
  }, [z, T, Vt, K == null ? void 0 : K.id]), at.useEffect(() => {
    rs();
  }, [K == null ? void 0 : K.id]);
  const La = (p, b = !0) => {
    b && (Tt.current = [
      Hn(t),
      ...Tt.current
    ].slice(0, 30), Yt.current = []), e(p);
  }, _r = (p) => {
    const b = Hn(t);
    p(b), La(b);
  }, Ot = (p) => {
    _r((b) => {
      const I = b.sheets.find(({ id: B }) => B === b.activeSheetId);
      I && p(I);
    });
  }, Wa = at.useRef(null), [jc, Ya] = at.useState(null), kr = (p, b) => {
    let I = "";
    const B = Wa.current;
    Wa.current = null, Ot((G) => {
      I = crypto.randomUUID();
      const $ = Ds(G, b == null ? void 0 : b.width, b == null ? void 0 : b.height);
      B && ($.x = Math.max(0, Math.round(B.x)), $.y = Math.max(0, Math.round(B.y))), G.items.push({
        id: I,
        ...$,
        recipe: p
      });
    }), Pn(I), qc(I);
  }, ae = Pt.find(({ id: p }) => p === pt) ?? Pt[0] ?? null, Xa = ae && c ? Ir(
    {
      hierarchyId: f.active_hierarchy_id,
      populationId: c
    },
    ae.tree,
    cr(f)
  ) : null, Je = (Xa == null ? void 0 : Xa.id) ?? (ae == null ? void 0 : ae.tree.root_population_id) ?? "", jn = (p) => {
    var b, I, B;
    if (!ae || !Je) {
      nt(g("Check an FCS file and select a population first."));
      return;
    }
    kr({
      kind: p,
      sampleId: ae.id,
      populationId: Je,
      ...ft.mode !== "off" ? { iterated: !0 } : {},
      xChannel: ae.sample.index(v) !== void 0 ? v : ((b = ae.sample.channels[0]) == null ? void 0 : b.key) ?? "",
      yChannel: p === "histogram" ? null : ae.sample.index(h) !== void 0 ? h : ((I = ae.sample.channels[1]) == null ? void 0 : I.key) ?? ((B = ae.sample.channels[0]) == null ? void 0 : B.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, Ho = () => {
    if (!ae || !Je) {
      nt(g("Check an FCS file and select a population first."));
      return;
    }
    kr(
      {
        kind: "chart",
        sampleId: ae.id,
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
  }, $o = () => kr({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), zc = (p, b) => {
    Ot((I) => {
      const B = I.items.find((G) => G.id === p);
      B && (B.recipe = b(B.recipe));
    });
  }, Bc = (p) => {
    p.preventDefault();
    const b = p.target.closest("[data-item-id]");
    if (b != null && b.dataset.itemId) {
      const $ = b.dataset.itemId, X = K == null ? void 0 : K.items.find(({ id: Ut }) => Ut === Kr($));
      if (!X) return;
      const ot = T.includes($);
      ot || Ke(Wo([$]));
      const Et = X.group ? ((K == null ? void 0 : K.items) ?? []).filter((Ut) => Ut.group === X.group).map(({ id: Ut }) => Ut) : [X.id], lt = ot && ie.length > 1 ? ie : Et, Dt = lt.length > 1, re = oe(X.recipe), Ce = [
        { label: Dt ? g("Duplicate {n} items", { n: lt.length }) : g("Duplicate"), onClick: () => tn(lt) },
        { label: g("Bring to front"), onClick: () => Xe(lt, "front") },
        { label: g("Bring forward"), onClick: () => Xe(lt, "forward") },
        { label: g("Send backward"), onClick: () => Xe(lt, "backward") },
        { label: g("Send to back"), onClick: () => Xe(lt, "back") },
        { label: X.locked ? g("Unlock") : g("Lock"), onClick: () => Bn(lt, !X.locked) },
        ...ot && Zr > 1 ? [{ label: g("Group"), onClick: zn }] : [],
        ...X.group ? [{ label: g("Ungroup"), onClick: () => Ot((Ut) => Es(Ut, lt)) }] : [],
        "separator",
        ...ft.mode !== "off" && re ? [
          {
            label: "iterated" in X.recipe && X.recipe.iterated ? g("Stop following the iteration") : g("Follow the iteration"),
            onClick: () => zc(X.id, (Ut) => oe(Ut) ? { ...Ut, iterated: !Ut.iterated } : Ut)
          },
          "separator"
        ] : [],
        ...re ? [{ label: g("Open in Gating"), onClick: () => D(X.recipe) }] : [],
        ...X.recipe.kind === "figure" && x ? [{ label: g("Edit in Illustration"), onClick: () => x(structuredClone(X.recipe.illustration)) }] : [],
        ...X.recipe.kind === "proportions" && w ? [{ label: g("Edit in Plotting"), onClick: () => w(structuredClone(X.recipe.settings)) }] : [],
        { label: Dt ? g("Remove {n} items", { n: lt.length }) : g("Remove"), onClick: () => Qr(lt) }
      ];
      Ya({ x: p.clientX, y: p.clientY, items: Ce, label: $e(X, Pt) });
      return;
    }
    const I = p.currentTarget.getBoundingClientRect(), B = { x: (p.clientX - I.left) / xt, y: (p.clientY - I.top) / xt }, G = ($) => () => {
      Wa.current = B, $();
    };
    Ya({
      x: p.clientX,
      y: p.clientY,
      label: g("Page"),
      items: [
        { label: g("+ Biplot"), disabled: !Wt, onClick: G(() => jn("biplot")) },
        { label: g("+ Histogram"), disabled: !Wt, onClick: G(() => jn("histogram")) },
        { label: g("+ Gating strategy"), disabled: !Wt, onClick: G(Uo) },
        { label: g("+ Chart"), disabled: !Wt, onClick: G(Ho) },
        { label: g("+ Text"), onClick: G($o) },
        { label: g("+ Illustration figure"), disabled: !Wt || !(m != null && m.figure), onClick: G(qo) },
        { label: g("+ Plotting chart"), disabled: !Wt || !y, onClick: G(Vo) },
        "separator",
        // With a selection on the page, the menu on blank paper offers what the selection's own menu does for grouping, as Illustrator's does.
        ...Zr > 1 ? [{ label: g("Group"), onClick: zn }] : [],
        ...de.some(($) => $.group) ? [{ label: g("Ungroup"), onClick: $a }] : [],
        { label: g("Select all"), disabled: !Vt.items.length, onClick: () => Ke(Vt.items.filter(($) => !Nn.has($.templateId)).map(({ id: $ }) => $)) }
      ]
    });
  }, qo = () => {
    if (!(m != null && m.figure)) {
      nt(g("Make a figure on the Illustration tab first."));
      return;
    }
    K && kr({ kind: "figure", illustration: structuredClone(m), page: 0 }, bf(m, r, f, K));
  }, Vo = () => {
    if (!y || !K) return;
    const p = y(), b = Sf(p, Cf(r), f, Er, S);
    if (!b.catLevels.length || !b.perSample.length) {
      nt(g("Choose files and populations on the Plotting tab first."));
      return;
    }
    kr({ kind: "proportions", settings: p }, wf(p, b, K));
  }, Uo = () => {
    var I;
    if (!ae || !Je) {
      nt(g("Check an FCS file and select a population first."));
      return;
    }
    const p = ae.tree.root_population_id ?? "", b = Je !== p ? Je : ((I = ca(ae.tree.populations, p).filter(({ popId: B }) => B !== p).at(-1)) == null ? void 0 : I.popId) ?? Je;
    kr(
      {
        kind: "strategy",
        sampleId: ae.id,
        populationId: b,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...ft.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, Gc = () => {
    var G, $;
    if (!m) {
      nt(g("Render or configure an Illustration selection first."));
      return;
    }
    if (!m.figure && m.plotType === "heatmap") {
      nt(
        g("Heatmap layout blocks are planned for the next Layout phase.")
      );
      return;
    }
    const p = new Map(Pt.map((X) => [X.id, X])), b = [], I = m.figure;
    for (const X of Pt) {
      if (I) {
        if (!I.sampleIds.includes(X.id)) continue;
        for (const Et of I.plots)
          if (Et.type !== "heatmap")
            for (const lt of Et.population ? [Et.population] : ((G = I.samplePopulations) == null ? void 0 : G[X.id]) ?? I.populations) {
              const Dt = Ir(
                lt,
                X.tree,
                cr(f)
              );
              Dt.id && Dt.status !== "changed" && b.push({
                sampleId: X.id,
                populationId: Dt.id,
                xChannel: Et.x,
                yChannel: Et.y,
                type: Et.type
              });
            }
        continue;
      }
      const ot = m.selectionMode === "matrix" ? (($ = m.selectedPopulationsBySample) == null ? void 0 : $[X.id]) ?? [] : m.popIds;
      for (const Et of ot)
        for (const lt of m.xChannels)
          b.push({ sampleId: X.id, populationId: Et, xChannel: lt });
    }
    const B = b.slice(0, 60);
    if (B.length === 0) {
      nt(
        g("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    Ot((X) => {
      for (const ot of B) {
        if (!p.get(ot.sampleId)) continue;
        const lt = ot.type ?? (m.plotType === "histogram" ? "histogram" : "biplot");
        X.items.push({
          id: crypto.randomUUID(),
          ...Ds(X),
          recipe: {
            kind: lt,
            sampleId: ot.sampleId,
            populationId: ot.populationId,
            xChannel: ot.xChannel,
            yChannel: lt === "histogram" ? null : ot.yChannel ?? m.yChannel,
            displayMode: m.displayMode === "dots" ? "scatter" : m.displayMode
          }
        });
      }
    }), nt(
      b.length > B.length ? g(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: B.length
        }
      ) : g("Added {count} Illustration plots.", { count: B.length })
    );
  }, _t = (p) => {
    J && Ot((b) => {
      const I = b.items.find(({ id: B }) => B === J.id);
      I && (I.recipe = p(I.recipe));
    });
  }, Ha = (p) => _t((b) => {
    if (b.kind !== "biplot" && b.kind !== "histogram") return b;
    const I = p ? r.filter(($) => p.includes($.id)).map(($) => $.id) : [];
    if (!I.length) {
      const { pool: $, ...X } = b;
      return X;
    }
    const B = I.includes(b.sampleId) ? b.sampleId : I[0];
    let G = b.populationId;
    if (B !== b.sampleId) {
      const $ = Pt.find(({ id: ot }) => ot === b.sampleId), X = Pt.find(({ id: ot }) => ot === B);
      $ && X && (G = Ir({ hierarchyId: $.tree.id, populationId: G }, X.tree, Ze).id ?? X.tree.root_population_id ?? G);
    }
    return { ...b, sampleId: B, populationId: G, pool: { sampleIds: I } };
  }), Fc = at.useMemo(() => {
    var $;
    const p = J == null ? void 0 : J.recipe;
    if (!p || !oe(p) || p.kind === "strategy" || !p.pool) return null;
    const b = Be != null && Be.templateSampleId ? ($ = Pt.find(({ id: X }) => X === Be.templateSampleId)) == null ? void 0 : $.tree.id : void 0, { members: I, leftOut: B } = Ji(p, Pt, Ze, b), G = p.kind === "biplot" && p.yChannel && I.length > 1 ? pf(Ze, I.map((X) => X.tree.id), p.xChannel, p.yChannel).omitted.map((X) => X.name) : [];
    return { pooled: I.length, total: p.pool.sampleIds.length, leftOut: B, omittedGates: G };
  }, [J, Be, Pt, Ze]), Qr = (p) => {
    Ot((b) => {
      b.items = b.items.filter((I) => !p.includes(I.id));
    }), k((b) => b.filter((I) => !p.includes(I)));
  }, tn = (p, b) => {
    const I = [];
    return Ot((B) => {
      let G = Math.max(0, ...B.items.map((X) => X.z));
      const $ = /* @__PURE__ */ new Map();
      for (const X of p) {
        const ot = B.items.find((re) => re.id === X);
        if (!ot) continue;
        const Et = crypto.randomUUID();
        I.push(Et);
        const lt = (b == null ? void 0 : b[X]) ?? { x: ot.x + 20, y: ot.y + 20, width: ot.width, height: ot.height }, Dt = ot.group ? $.get(ot.group) ?? crypto.randomUUID() : void 0;
        ot.group && Dt && $.set(ot.group, Dt), B.items.push({ ...ot, ...lt, id: Et, locked: !1, z: ++G, recipe: { ...ot.recipe }, ...Dt ? { group: Dt } : {} });
      }
    }), I.length && Ke(I), I;
  }, Lc = (p, b, I) => {
    Ot((B) => {
      for (const G of B.items)
        !p.includes(G.id) || G.locked || (G.x += b, G.y += I);
    });
  }, Xe = (p, b) => {
    Ot((I) => {
      const B = [...I.items].sort((ot, Et) => ot.z - Et.z), G = B.filter((ot) => p.includes(ot.id)), $ = B.filter((ot) => !p.includes(ot.id));
      let X;
      if (b === "front") X = [...$, ...G];
      else if (b === "back") X = [...G, ...$];
      else {
        X = B;
        const ot = X.map((Et, lt) => lt);
        b === "forward" && ot.reverse();
        for (const Et of ot) {
          const lt = b === "forward" ? Et + 1 : Et - 1;
          !p.includes(X[Et].id) || lt < 0 || lt >= X.length || p.includes(X[lt].id) || ([X[Et], X[lt]] = [X[lt], X[Et]]);
        }
      }
      X.forEach((ot, Et) => {
        ot.z = Et;
      });
    });
  }, zn = () => {
    Zr < 2 || Ot((p) => {
      $f(p, ie);
    });
  }, $a = () => {
    de.some((p) => p.group) && Ot((p) => Es(p, ie));
  }, Bn = (p, b) => {
    Ot((I) => {
      for (const B of I.items) p.includes(B.id) && (B.locked = b);
    });
  }, Wc = (p) => {
    Ot((b) => qf(b, ie.filter((I) => {
      var B;
      return !((B = b.items.find((G) => G.id === I)) != null && B.locked);
    }), p));
  }, Yc = (p) => {
    Ot((b) => Vf(b, ie.filter((I) => {
      var B;
      return !((B = b.items.find((G) => G.id === I)) != null && B.locked);
    }), p));
  }, Gn = (p, b) => {
    const I = {};
    for (const G of p) {
      const $ = G.dataset.itemId, X = Vt.items.find((lt) => lt.id === $);
      if (!X) continue;
      const { id: ot, ...Et } = pg(X, Ng(G));
      I[ot] = Et;
    }
    const B = Object.keys(I);
    if (B.length) {
      if (b) {
        for (const G of p) {
          const $ = Vt.items.find((X) => X.id === G.dataset.itemId);
          $ && Object.assign(G.style, { left: `${$.x}px`, top: `${$.y}px`, width: `${$.width}px`, height: `${$.height}px` });
        }
        tn(B, I);
        return;
      }
      Ot((G) => {
        for (const $ of G.items) I[$.id] && Object.assign($, I[$.id]);
      });
    }
  }, Ko = (p) => p.flatMap((b) => {
    if (!(b instanceof HTMLElement) || !b.parentElement) return [];
    const I = b.cloneNode(!0);
    I.classList.add("gl-layout-ghost"), I.classList.remove("is-selected"), I.removeAttribute("data-item-id"), I.setAttribute("aria-hidden", "true");
    const B = b.querySelectorAll("canvas");
    return I.querySelectorAll("canvas").forEach((G, $) => {
      var ot;
      const X = B[$];
      X && (G.width = X.width, G.height = X.height, (ot = G.getContext("2d")) == null || ot.drawImage(X, 0, 0));
    }), b.parentElement.insertBefore(I, b), [I];
  }), Fn = (p) => {
    if (Array.isArray(p)) for (const b of p) b.remove();
  }, qa = (p) => {
    for (const b of p) {
      const I = Vt.items.find((B) => B.id === b.dataset.itemId);
      I && Object.assign(b.style, { left: `${I.x}px`, top: `${I.y}px`, width: `${I.width}px`, height: `${I.height}px` });
    }
  }, Zo = at.useRef(qa);
  Zo.current = qa;
  const Qe = at.useRef(null), Ln = (p, b) => {
    const I = { targets: p, ghosts: b, cancelled: !1 };
    Qe.current = I;
    const B = () => {
      window.removeEventListener("mouseup", B, !0), window.removeEventListener("touchend", B, !0), window.setTimeout(() => {
        Qe.current === I && (Qe.current = null, Fn(I.ghosts));
      }, 0);
    };
    window.addEventListener("mouseup", B, !0), window.addEventListener("touchend", B, !0);
  }, Wn = (p, b, I, B) => {
    const G = Qe.current;
    Qe.current = null, Fn(G == null ? void 0 : G.ghosts);
    const $ = b == null ? void 0 : b.dist, X = !$ || Math.hypot($[0] ?? 0, $[1] ?? 0) >= 3;
    G != null && G.cancelled || !I || !X ? qa(p) : B();
  }, Jo = (p) => {
    var G;
    p.target.style.left = `${p.left}px`, p.target.style.top = `${p.top}px`;
    const b = (G = p.datas) == null ? void 0 : G.companions;
    if (!(b != null && b.length)) return;
    const I = p.left - p.datas.startLeft, B = p.top - p.datas.startTop;
    for (const { el: $, left: X, top: ot } of b)
      $.style.left = `${X + I}px`, $.style.top = `${ot + B}px`;
  }, Qo = (p) => {
    var I;
    const b = (I = p.datas) == null ? void 0 : I.companions;
    return [p.target, ...(b ?? []).map(({ el: B }) => B)];
  }, Xc = (p) => {
    var G;
    p.datas.alt = !!((G = p.inputEvent) != null && G.altKey);
    const b = p.target, I = Jr ? Xo.current.filter(($) => $ !== b) : [];
    p.datas.startLeft = parseFloat(b.style.left) || 0, p.datas.startTop = parseFloat(b.style.top) || 0, p.datas.companions = I.map(($) => ({ el: $, left: parseFloat($.style.left) || 0, top: parseFloat($.style.top) || 0 }));
    const B = Qo(p);
    Ln(B, p.datas.alt ? Ko(B) : void 0);
  }, ts = (p) => {
    p.target.style.width = `${p.width}px`, p.target.style.height = `${p.height}px`, p.target.style.left = `${p.drag.left}px`, p.target.style.top = `${p.drag.top}px`;
  }, Hc = (p) => {
    var B;
    const b = (B = p.inputEvent) == null ? void 0 : B.target;
    if (!b) return;
    const I = et.current;
    if (I != null && I.isMoveableElement(b)) {
      p.stop();
      return;
    }
    if (Ye.some((G) => G === b || G.contains(b)) && (p.stop(), Ye.length > 1 && !Jr)) {
      I == null || I.dragStart(p.inputEvent);
      const G = p.inputEvent, $ = (X) => {
        var ot;
        window.removeEventListener("mouseup", $), Math.hypot(X.clientX - G.clientX, X.clientY - G.clientY) < 4 && ((ot = Z.current) == null || ot.clickTarget(G, b));
      };
      window.addEventListener("mouseup", $);
    }
  }, $c = (p) => {
    var G, $, X;
    const b = p.isClick || p.isDragStart, I = new Set((p.removed ?? []).map((ot) => On(ot.dataset.itemId ?? "")).filter(Boolean)), B = Wo(
      p.selected.map((ot) => ot.dataset.itemId ?? "").filter((ot) => ot && (b || !Nn.has(Kr(ot))))
    ).filter((ot) => !I.has(On(ot)));
    if (Ke(B), p.isDragStart && !p.isClick) {
      if (!B.filter((lt) => !Nn.has(Kr(lt)) && lt !== A).length) return;
      ($ = (G = p.inputEvent) == null ? void 0 : G.preventDefault) == null || $.call(G), An.current = !0;
      const Et = () => {
        An.current = !1;
      };
      window.setTimeout(() => window.addEventListener("mousedown", Et, { capture: !0, once: !0 }), 0), (X = et.current) == null || X.waitToChangeTarget().then(() => {
        var lt;
        return (lt = et.current) == null ? void 0 : lt.dragStart(p.inputEvent);
      });
    }
  }, qc = (p) => {
    window.requestAnimationFrame(() => {
      var b, I, B;
      (B = (I = (b = lr.current) == null ? void 0 : b.querySelector(`[data-item-id="${p}"]`)) == null ? void 0 : I.scrollIntoView) == null || B.call(I, { block: "nearest", inline: "nearest" });
    });
  }, ur = (p) => {
    Ot((b) => _f(b, p));
  }, Vc = () => Ot((p) => kf(p)), Uc = () => Ot((p) => Tf(p)), es = (() => {
    const p = [], b = [];
    if (!K) return { vertical: p, horizontal: b };
    const I = xi(K.page), B = xs(K.page.marginMm);
    for (const G of pa(K.page))
      p.push(G.x, G.x + B, G.x + I.width / 2, G.x + I.width - B, G.x + I.width), b.push(G.y, G.y + B, G.y + I.height / 2, G.y + I.height - B, G.y + I.height);
    return { vertical: [...new Set(p)], horizontal: [...new Set(b)] };
  })(), rs = () => {
    const p = We.current;
    if (!p || !K) return;
    const b = { width: p.clientWidth - 36, height: p.clientHeight - 36 };
    if (b.width <= 0 || b.height <= 0) return;
    const I = Math.min(b.width / K.width, b.height / K.height);
    kt(Math.max(0.1, Math.min(4, Math.floor(I * 100) / 100)));
  };
  at.useEffect(() => {
    const p = Y;
    if (!p) return;
    const b = (I) => {
      if (!(I.altKey || I.shiftKey || I.ctrlKey)) return;
      const B = I.deltaY || I.deltaX;
      if (!B) return;
      I.preventDefault();
      const G = vt.current, $ = Math.max(0.1, Math.min(4, Math.round(G * Math.exp(-B * 25e-4) * 100) / 100));
      if ($ === G) return;
      vt.current = $, kt($);
      const X = p.getBoundingClientRect(), ot = I.clientX - X.left, Et = I.clientY - X.top, lt = $ / G, Dt = (p.scrollLeft + ot) * lt - ot, re = (p.scrollTop + Et) * lt - Et;
      requestAnimationFrame(() => {
        p.scrollLeft = Dt, p.scrollTop = re;
      });
    };
    return p.addEventListener("wheel", b, { passive: !1 }), () => p.removeEventListener("wheel", b);
  }, [Y]);
  const ns = (p) => {
    const b = p > 0 ? rn.find((I) => I > xt + 1e-3) : [...rn].reverse().find((I) => I < xt - 1e-3);
    b && kt(b);
  }, Kc = () => new Promise((p) => {
    window.setTimeout(() => window.requestAnimationFrame(() => window.requestAnimationFrame(() => p())), 450);
  }), as = async () => {
    const p = lr.current;
    if (!p || !K || Ue) return;
    Rn(!0);
    const b = ze;
    try {
      const I = [];
      for (let B = 0; B < me.length; B++)
        me.length > 1 && (Mr(B), await Kc()), I.push(...tg(p, K, { zoom: xt, crop: jt ? { paddingMm: Te } : void 0 }));
      await eg(I, K, Bt), _ == null || _();
    } catch (I) {
      nt(I instanceof Error ? I.message : String(I));
    } finally {
      me.length > 1 && Mr(b), Rn(!1);
    }
  }, He = (p) => {
    Ot((b) => {
      var I;
      if (p.mode === "off") {
        delete b.iteration;
        return;
      }
      if ((((I = b.iteration) == null ? void 0 : I.mode) ?? "off") === "off" && !b.items.some(Mc))
        for (const B of b.items) oe(B.recipe) && (B.recipe.iterated = !0);
      b.iteration = p;
    }), Mr(0);
  }, Zc = (p) => [...new Set(r.map((b) => {
    var I;
    return ((I = b.metadata) == null ? void 0 : I[p]) ?? "";
  }).filter(Boolean))], Jc = ft.source.kind === "group" ? `group:${ft.source.groupId}` : ft.source.kind === "metadata" ? `meta:${ft.source.column}=${ft.source.value}` : ft.source.kind, Qc = (p) => {
    if (p === "all") return { kind: "all" };
    if (p.startsWith("group:")) return { kind: "group", groupId: p.slice(6) };
    if (p.startsWith("meta:")) {
      const [b, ...I] = p.slice(5).split("=");
      return { kind: "metadata", column: b, value: I.join("=") };
    }
    return { kind: "checked" };
  }, tf = (p) => {
    const b = Ss(p.nativeEvent);
    if (b) {
      p.preventDefault(), b === "undo" ? Yn() : Xn();
      return;
    }
    if (p.target.closest("input, textarea, select")) return;
    const I = p.metaKey || p.ctrlKey;
    if (p.key === "Escape") {
      k([]);
      return;
    }
    if (I && p.key.toLowerCase() === "a") {
      p.preventDefault(), Ke(((K == null ? void 0 : K.items) ?? []).filter((X) => !X.locked).map((X) => X.id));
      return;
    }
    if (!T.length) return;
    if (p.key === "Enter" && T.length === 1) {
      const X = Vt.items.find((ot) => ot.id === T[0]);
      if ((X == null ? void 0 : X.recipe.kind) === "text") {
        p.preventDefault(), O(X.id);
        return;
      }
    }
    if (p.key === "Delete" || p.key === "Backspace") {
      p.preventDefault(), Qr(ie);
      return;
    }
    if (I && p.key.toLowerCase() === "d") {
      p.preventDefault(), tn(ie);
      return;
    }
    if (I && (p.key === "]" || p.key === "[")) {
      p.preventDefault(), Xe(ie, p.key === "]" ? p.shiftKey ? "front" : "forward" : p.shiftKey ? "back" : "backward");
      return;
    }
    if (I && p.key.toLowerCase() === "g") {
      p.preventDefault(), p.shiftKey ? $a() : zn();
      return;
    }
    if (I && p.shiftKey && p.key.toLowerCase() === "l") {
      p.preventDefault(), Bn(ie, !Fa);
      return;
    }
    const B = p.shiftKey ? 10 : 1, $ = {
      ArrowLeft: [-B, 0],
      ArrowRight: [B, 0],
      ArrowUp: [0, -B],
      ArrowDown: [0, B]
    }[p.key];
    $ && (p.preventDefault(), Lc(ie, $[0], $[1]));
  }, Va = J == null ? void 0 : J.recipe, Gt = Va && "sampleId" in Va ? Pt.find(({ id: p }) => p === Va.sampleId) ?? null : null, is = Gt ? Gt.sample.channels.map((p) => ({
    value: p.key,
    label: Gt.sample.channelLabel(Gt.sample.index(p.key) ?? 0)
  })) : [], os = Gt ? ca(
    Gt.tree.populations,
    Gt.tree.root_population_id ?? ""
  ) : [], Yn = () => {
    const p = Tt.current.shift();
    p && (Yt.current = [
      Hn(t),
      ...Yt.current
    ].slice(0, 30), La(p, !1));
  }, Xn = () => {
    const p = Yt.current.shift();
    p && (Tt.current = [
      Hn(t),
      ...Tt.current
    ].slice(0, 30), La(p, !1));
  }, Ua = at.useRef({ undo: Yn, redo: Xn });
  return Ua.current = { undo: Yn, redo: Xn }, at.useEffect(() => {
    const p = (I) => {
      var G, $;
      if (I.key === "Escape" && Qe.current) {
        const X = Qe.current;
        X.cancelled = !0, I.preventDefault(), I.stopPropagation(), Zo.current(X.targets), Fn(X.ghosts), X.ghosts = void 0, Og(et.current);
        return;
      }
      const B = Ss(I);
      B && (($ = (G = I.target) == null ? void 0 : G.closest) != null && $.call(G, "input, textarea, select, [contenteditable='true']") || (I.preventDefault(), I.stopPropagation(), B === "undo" ? Ua.current.undo() : Ua.current.redo()));
    }, b = () => {
      const I = Qe.current;
      I && (Fn(I.ghosts), I.ghosts = void 0);
    };
    return window.addEventListener("keydown", p, !0), window.addEventListener("blur", b), () => {
      window.removeEventListener("keydown", p, !0), window.removeEventListener("blur", b);
    };
  }, []), K ? /* @__PURE__ */ C.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${yt ? " is-preview" : ""}`,
      children: [
        /* @__PURE__ */ C.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": g("Layout sheets"),
            children: [
              t.sheets.map((p) => /* @__PURE__ */ C.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: it === p.id ? /* @__PURE__ */ C.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: p.name,
                  autoFocus: !0,
                  onFocus: (b) => b.currentTarget.select(),
                  onBlur: (b) => {
                    const I = b.currentTarget.value.trim();
                    I && _r((B) => {
                      const G = B.sheets.find(
                        ({ id: $ }) => $ === p.id
                      );
                      G && (G.name = I);
                    }), tt(null);
                  },
                  onKeyDown: (b) => {
                    b.key === "Enter" && b.currentTarget.blur(), b.key === "Escape" && tt(null);
                  }
                }
              ) : /* @__PURE__ */ C.jsx(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": t.activeSheetId === p.id,
                  className: `gl-layout-sheet-tab${t.activeSheetId === p.id ? " active" : ""}`,
                  title: g("Double-click to rename"),
                  onClick: () => _r((b) => {
                    b.activeSheetId = p.id;
                  }),
                  onDoubleClick: () => tt(p.id),
                  children: p.name
                }
              ) }, p.id)),
              /* @__PURE__ */ C.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-layout-sheet-add",
                  title: g("New blank layout"),
                  onClick: () => {
                    const p = vf(
                      `Layout ${t.sheets.length + 1}`,
                      { ...K.page }
                    );
                    _r((b) => {
                      b.sheets.push(p), b.activeSheetId = p.id;
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
            onMouseDown: (p) => {
              p.target.closest("button") && p.preventDefault();
            },
            children: [
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => jn("biplot"), disabled: !Wt, title: g(Wt ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: g("+ Biplot") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => jn("histogram"), disabled: !Wt, title: g(Wt ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: g("+ Histogram") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Uo, disabled: !Wt, title: g(Wt ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: g("+ Gating strategy") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Ho, disabled: !Wt, title: g(Wt ? "Add a summary chart: one statistic of a population per file, grouped by a metadata column, with a test between the groups" : "Preparing the files…"), children: g("+ Chart") }),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: g("Add a text block; edit it on the page"),
                    onClick: $o,
                    children: g("+ Text")
                  }
                ),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Gc, disabled: !Wt, title: g("Add one plot per file and plot of the Illustration tab's current selection"), children: g("Add Illustration selection") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: qo, disabled: !Wt, title: g("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: g("+ Illustration figure") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Vo, disabled: !Wt || !y, title: g("Add the Plotting tab's current chart as one block, drawn here as it is there"), children: g("+ Plotting chart") })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": g("Arrange"), children: [
                Rg.map(({ how: p, label: b, title: I }) => /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Wc(p), disabled: !T.length || yt, title: g(I), children: g(b) }, p)),
                Pg.map(({ how: p, label: b, title: I }) => /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Yc(p), disabled: Zr < 3 || yt, title: g(I), children: g(b) }, p)),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": R, onClick: () => j((p) => !p), title: g("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: g("Snap grid") })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": yt, onClick: () => mt(!yt), title: g("Show the page as it exports, without grid, margins or handles"), children: g(yt ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Tt.current.length, onClick: Yn, title: g("Undo the last layout edit (Cmd-Z)"), children: g("Undo") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Yt.current.length, onClick: Xn, title: g("Redo the undone edit (Shift-Cmd-Z)"), children: g("Redo") }),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: g("Copy this sheet, with its page and items, as a new sheet"),
                    onClick: () => {
                      const p = {
                        ...K,
                        id: crypto.randomUUID(),
                        page: { ...K.page },
                        name: `${K.name} copy`,
                        items: K.items.map((b) => ({
                          ...b,
                          id: crypto.randomUUID(),
                          recipe: { ...b.recipe }
                        }))
                      };
                      _r((b) => {
                        b.sheets.push(p), b.activeSheetId = p.id;
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
                      _r((p) => {
                        const b = p.sheets.findIndex(
                          ({ id: I }) => I === p.activeSheetId
                        );
                        p.sheets.splice(b, 1), p.activeSheetId = p.sheets[Math.max(0, b - 1)].id;
                      }), k([]);
                    },
                    children: g("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": g("Zoom"), children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: rs, title: g("Fit the page to the window"), children: g("Fit") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => ns(-1), "aria-label": g("Zoom out"), title: g("Zoom out"), disabled: xt <= rn[0], children: "−" }),
                /* @__PURE__ */ C.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(xt * 100),
                  "%"
                ] }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => ns(1), "aria-label": g("Zoom in"), title: g("Zoom in"), disabled: xt >= rn[rn.length - 1], children: "+" })
              ] }),
              (me.length > 1 || ft.mode !== "off") && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": g("Pages of the iteration"), children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Mr(Math.max(0, ze - 1)), disabled: ze === 0, "aria-label": g("Previous page"), title: g("Previous page"), children: "◀" }),
                /* @__PURE__ */ C.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  g("Page {n} of {count}", { n: ze + 1, count: Math.max(1, me.length) }),
                  Vt.units.length > 0 && ` · ${Vt.units.map((p) => p.name).join(", ")}`
                ] }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Mr(Math.min(me.length - 1, ze + 1)), disabled: ze >= me.length - 1, "aria-label": g("Next page"), title: g("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ C.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void as(), disabled: Ue || !K.items.length, title: me.length > 1 ? g("Write every page of the iteration; the format is chosen under Page") : g("Write this sheet at its page size; the format is chosen under Page"), children: Ue ? g("Exporting…") : g("Export {format}", { format: Bt.toUpperCase() }) }) }),
              /* @__PURE__ */ C.jsx("span", { className: "gl-layout-performance-note", children: g("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        st && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ C.jsx("span", { children: st }),
          /* @__PURE__ */ C.jsx("button", { type: "button", title: g("Dismiss"), "aria-label": g("Dismiss"), onClick: () => nt(null), children: "×" })
        ] }),
        /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ C.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ C.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style"].map((p) => /* @__PURE__ */ C.jsx(
              "button",
              {
                "aria-pressed": U === p,
                title: g(p === "item" ? "The selected item, or the file new plots take" : p === "page" ? "Page size, margins, pages and export" : p === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => ut(p),
                children: g(p === "item" ? "Items" : p === "page" ? "Page" : p === "iterate" ? "Iterate" : "Style")
              },
              p
            )) }),
            U === "item" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                "File for new plots",
                /* @__PURE__ */ C.jsx(
                  "select",
                  {
                    value: pt,
                    onChange: (p) => Ct(p.target.value),
                    children: r.map((p) => /* @__PURE__ */ C.jsx("option", { value: p.id, children: p.name }, p.id))
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: "Placed plots keep their own file and hierarchy, independently of the Gating selection." }),
              ge.error && /* @__PURE__ */ C.jsx("p", { role: "alert", children: ge.error }),
              de.length > 1 && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-inspector", "aria-label": g("Selected layout items"), children: [
                /* @__PURE__ */ C.jsx("strong", { children: Nc ? g("{count} items selected, one group", { count: de.length }) : g("{count} items selected", { count: de.length }) }),
                /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                  Zr > 1 && /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: zn, title: g("One group: selected, moved, aligned and distributed together (Cmd-G)"), children: g("Group") }),
                  de.some((p) => p.group) && /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: $a, title: g("Dissolve the group; the items stay where they are (Shift-Cmd-G)"), children: g("Ungroup") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => tn(ie), title: g("Copies of every selected item, 20 px down and right (Cmd-D)"), children: g("Duplicate") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Xe(ie, "front"), title: g("Draw the selected items over every other"), children: g("Bring to front") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Xe(ie, "back"), title: g("Draw the selected items under every other"), children: g("Send to back") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Bn(ie, !Fa), title: g("Lock or unlock the selected items"), children: g(Fa ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Qr(ie), title: g("Remove the selected items (Delete)"), children: g("Remove") })
                ] }),
                /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("Align and distribute them with the toolbar; drag any of them to move them together; Cmd-G makes them one group.") })
              ] }),
              !de.length && /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("Click an item to select it, drag empty page to select several, Shift-click to add or remove. Drag to move, Shift holds the direction; drag a corner handle or an edge to resize, Shift keeps the proportions, Option resizes from the centre; Cmd turns snapping off; Option-drag copies. Delete removes, arrows nudge (Shift: 10 px), Cmd-D duplicates, Cmd-A selects all, Cmd-] and Cmd-[ bring forward and send backward (Shift: to the front or back), Cmd-G groups and Shift-Cmd-G ungroups, Shift-Cmd-L locks, Cmd-Z undoes.") }),
              J && /* @__PURE__ */ C.jsxs(
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
                          checked: J.showFrame === !0,
                          onChange: (p) => Ot((b) => {
                            const I = b.items.find(
                              (B) => B.id === J.id
                            );
                            I && (I.showFrame = p.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => tn([J.id]), title: g("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: g("Duplicate") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Xe([J.id], "front"), title: g("Draw this item over every other"), children: g("Bring to front") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Xe([J.id], "back"), title: g("Draw this item under every other"), children: g("Send to back") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Qr([J.id]), title: g("Remove this item from the page (Delete)"), children: g("Remove") })
                    ] }),
                    /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: g("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ C.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: J.locked === !0,
                          onChange: (p) => Bn([J.id], p.target.checked)
                        }
                      ),
                      g("Locked")
                    ] }),
                    /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["x", "y", "width", "height"].map((p) => /* @__PURE__ */ C.jsxs("label", { children: [
                      kg[p],
                      /* @__PURE__ */ C.jsx(
                        pe,
                        {
                          "aria-label": `Item ${p}`,
                          min: p === "width" || p === "height" ? hf(J.recipe.kind)[p] : 0,
                          integer: !0,
                          value: J[p],
                          onCommit: (b) => Ot((I) => {
                            const B = I.items.find(
                              (G) => G.id === J.id
                            );
                            B && (B[p] = b);
                          })
                        }
                      )
                    ] }, p)) }),
                    J.recipe.kind === "text" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Text"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            value: J.recipe.text,
                            onChange: (p) => _t(
                              (b) => b.kind === "text" ? { ...b, text: p.target.value } : b
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
                            value: J.recipe.readsFrom ?? "",
                            onChange: (p) => _t((b) => {
                              if (b.kind !== "text") return b;
                              const I = { ...b };
                              return p.target.value ? I.readsFrom = p.target.value : delete I.readsFrom, I;
                            }),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: g("Nothing: plain text") }),
                              K.items.filter((p) => oe(p.recipe)).map((p) => /* @__PURE__ */ C.jsx("option", { value: p.id, children: $e(p, Pt) }, p.id))
                            ]
                          }
                        )
                      ] }),
                      J.recipe.readsFrom && /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: pi }) }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Font"),
                        /* @__PURE__ */ C.jsx(
                          pe,
                          {
                            min: 8,
                            max: 72,
                            integer: !0,
                            value: J.recipe.fontSize,
                            onCommit: (p) => _t(
                              (b) => b.kind === "text" ? { ...b, fontSize: p } : b
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: J.recipe.bold === !0,
                            onChange: (p) => _t((b) => {
                              if (b.kind !== "text") return b;
                              const I = { ...b };
                              return p.target.checked ? I.bold = !0 : delete I.bold, I;
                            })
                          }
                        ),
                        g("Bold")
                      ] })
                    ] }) : J.recipe.kind === "figure" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Figure page"),
                        /* @__PURE__ */ C.jsx(
                          pe,
                          {
                            "aria-label": g("Figure page"),
                            value: J.recipe.page + 1,
                            min: 1,
                            integer: !0,
                            onCommit: (p) => _t((b) => b.kind === "figure" ? { ...b, page: Math.max(0, p - 1) } : b)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        g("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: $e(J, Pt),
                            value: J.recipe.title ?? "",
                            onChange: (p) => _t((b) => b.kind === "figure" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      x && /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: g("Load this figure into the Illustration tab"),
                          onClick: () => x(structuredClone(J.recipe.illustration)),
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
                          onClick: () => _t(
                            (p) => p.kind === "figure" && m ? { ...p, illustration: structuredClone(m) } : p
                          ),
                          children: g("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : J.recipe.kind === "proportions" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        g("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: $e(J, Pt),
                            value: J.recipe.title ?? "",
                            onChange: (p) => _t((b) => b.kind === "proportions" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      w && /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: g("Load this chart's settings into the Plotting tab"),
                          onClick: () => w(structuredClone(J.recipe.settings)),
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
                            const p = y == null ? void 0 : y();
                            p && _t((b) => b.kind === "proportions" ? { ...b, settings: p } : b);
                          },
                          children: g("Replace with the current Plotting chart")
                        }
                      )
                    ] }) : J.recipe.kind === "chart" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Population"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: J.recipe.populationId,
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, populationId: p.target.value } : b),
                            children: os.map(({ popId: p, depth: b }) => {
                              var I;
                              return /* @__PURE__ */ C.jsxs("option", { value: p, children: [
                                " ".repeat(b * 2),
                                ((I = Gt == null ? void 0 : Gt.tree.populations[p]) == null ? void 0 : I.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Statistic"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: J.recipe.statistic,
                            onChange: (p) => _t((b) => {
                              var G;
                              if (b.kind !== "chart") return b;
                              const I = p.target.value, B = I === "median" && !b.channel ? (G = Gt == null ? void 0 : Gt.sample.channels[0]) == null ? void 0 : G.key : b.channel;
                              return { ...b, statistic: I, ...B ? { channel: B } : {} };
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
                      J.recipe.statistic === "median" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Channel"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: J.recipe.channel ?? "",
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, channel: p.target.value } : b),
                            children: ((Gt == null ? void 0 : Gt.sample.channels) ?? []).map((p) => /* @__PURE__ */ C.jsx("option", { value: p.key, children: (Gt == null ? void 0 : Gt.sample.labelForKey(p.key)) ?? p.key }, p.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Files"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: J.recipe.files,
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, files: p.target.value === "all" ? "all" : "checked" } : b),
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
                            value: J.recipe.groupBy,
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, groupBy: p.target.value } : b),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: g("Each file") }),
                              o.map((p) => /* @__PURE__ */ C.jsx("option", { value: p, children: p }, p))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Chart"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: J.recipe.chartType,
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, chartType: p.target.value } : b),
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
                            checked: J.recipe.showPoints,
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, showPoints: p.target.checked } : b)
                          }
                        ),
                        g("Show each file as a point")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: g("Wilcoxon rank-sum between two groups, Kruskal–Wallis among more; every group needs two files"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: J.recipe.test,
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, test: p.target.checked } : b)
                          }
                        ),
                        g("Test between groups")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        g("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: $e(J, Pt),
                            value: J.recipe.title ?? "",
                            onChange: (p) => _t((b) => b.kind === "chart" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] })
                    ] }) : /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      !hn(J.recipe) && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("FCS"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: J.recipe.sampleId,
                            onChange: (p) => _t((b) => {
                              if (b.kind === "text" || b.kind === "figure" || b.kind === "proportions") return b;
                              const I = Pt.find(
                                (G) => G.id === p.target.value
                              );
                              if (!I) return b;
                              const B = Gt && Ir(
                                {
                                  hierarchyId: Gt.tree.id,
                                  populationId: b.populationId
                                },
                                I.tree,
                                cr(f)
                              );
                              return {
                                ...b,
                                sampleId: I.id,
                                populationId: (B == null ? void 0 : B.id) ?? I.tree.root_population_id ?? ""
                              };
                            }),
                            children: Pt.map((p) => /* @__PURE__ */ C.jsx("option", { value: p.id, children: p.name }, p.id))
                          }
                        )
                      ] }),
                      (J.recipe.kind === "biplot" || J.recipe.kind === "histogram") && /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: g("Draw the events of several files on this plot, as the Gating tab pools the checked files; a gate is drawn where every pooled file has it alike, with the pooled percentage"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: !!J.recipe.pool,
                            onChange: (p) => {
                              if (!p.target.checked) {
                                Ha(null);
                                return;
                              }
                              const b = J.recipe.kind === "biplot" || J.recipe.kind === "histogram" ? J.recipe.sampleId : "";
                              Ha(n.includes(b) ? n : [b]);
                            }
                          }
                        ),
                        g("Pool files")
                      ] }),
                      (J.recipe.kind === "biplot" || J.recipe.kind === "histogram") && J.recipe.pool && /* @__PURE__ */ C.jsx(
                        jg,
                        {
                          files: r,
                          pool: J.recipe.pool.sampleIds,
                          checkedSampleIds: n,
                          groups: a,
                          fileGroups: i,
                          report: Fc,
                          onChange: Ha
                        }
                      ),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        g("Population"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: J.recipe.populationId,
                            onChange: (p) => _t(
                              (b) => b.kind === "text" ? b : {
                                ...b,
                                populationId: p.target.value
                              }
                            ),
                            children: os.map(({ popId: p, depth: b }) => {
                              var I;
                              return /* @__PURE__ */ C.jsxs("option", { value: p, children: [
                                " ".repeat(b * 2),
                                ((I = Gt == null ? void 0 : Gt.tree.populations[p]) == null ? void 0 : I.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      J.recipe.kind !== "strategy" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                        /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ C.jsx(
                            ys,
                            {
                              label: g("X channel"),
                              value: J.recipe.xChannel,
                              options: is,
                              onChange: (p) => _t(
                                (b) => b.kind === "biplot" || b.kind === "histogram" ? { ...b, xChannel: p } : b
                              )
                            }
                          )
                        ] }),
                        J.recipe.kind === "biplot" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ C.jsx(
                            ys,
                            {
                              label: g("Y channel"),
                              value: J.recipe.yChannel ?? "",
                              options: is,
                              onChange: (p) => _t(
                                (b) => b.kind === "biplot" ? { ...b, yChannel: p } : b
                              )
                            }
                          )
                        ] })
                      ] }),
                      J.recipe.kind === "strategy" && ((us = J.recipe.populationIds) == null ? void 0 : us.length) && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                        /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("{count} populations; the grid follows the live gates", { count: J.recipe.populationIds.length }) }),
                        /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", title: g("Tree: a column per depth and a row per leaf. Wrapped: the tree walked depth first and wrapped into rows of the columns beside."), children: [
                          g("Layout"),
                          /* @__PURE__ */ C.jsxs(
                            "select",
                            {
                              value: J.recipe.layout ?? "tree",
                              onChange: (p) => _t((b) => b.kind === "strategy" ? { ...b, layout: p.target.value === "flow" ? "flow" : "tree" } : b),
                              children: [
                                /* @__PURE__ */ C.jsx("option", { value: "tree", children: g("Tree") }),
                                /* @__PURE__ */ C.jsx("option", { value: "flow", children: g("Wrapped") })
                              ]
                            }
                          )
                        ] }),
                        (J.recipe.layout ?? "tree") === "flow" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                          g("Columns"),
                          /* @__PURE__ */ C.jsx(pe, { min: 1, max: 24, integer: !0, value: J.recipe.columns ?? 4, onCommit: (p) => _t((b) => b.kind === "strategy" ? { ...b, columns: p } : b) })
                        ] }),
                        /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: g("An arrow from each gate to the panel of the population it makes, through the gutters"), children: [
                          /* @__PURE__ */ C.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: J.recipe.showArrows !== !1,
                              onChange: (p) => _t((b) => b.kind === "strategy" ? { ...b, showArrows: p.target.checked } : b)
                            }
                          ),
                          g("Arrows")
                        ] }),
                        J.recipe.showArrows !== !1 && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                          /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", title: g("The arrows' colour; unticked, each takes its gate's"), children: [
                            /* @__PURE__ */ C.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: !!J.recipe.arrowColor,
                                onChange: (p) => _t((b) => b.kind === "strategy" ? { ...b, arrowColor: p.target.checked ? "#444444" : void 0 } : b)
                              }
                            ),
                            g("One colour"),
                            J.recipe.arrowColor && /* @__PURE__ */ C.jsx(
                              "input",
                              {
                                type: "color",
                                value: J.recipe.arrowColor,
                                onChange: (p) => _t((b) => b.kind === "strategy" ? { ...b, arrowColor: p.target.value } : b)
                              }
                            )
                          ] }),
                          /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", title: g("Where an arrow leaves its panel: level with the gate's label, or with the centre of the gate itself"), children: [
                            g("Arrows from"),
                            /* @__PURE__ */ C.jsxs(
                              "select",
                              {
                                value: J.recipe.arrowAnchor ?? "label",
                                onChange: (p) => _t((b) => b.kind === "strategy" ? { ...b, arrowAnchor: p.target.value === "gate" ? "gate" : void 0 } : b),
                                children: [
                                  /* @__PURE__ */ C.jsx("option", { value: "label", children: g("Gate label") }),
                                  /* @__PURE__ */ C.jsx("option", { value: "gate", children: g("Gate centre") })
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                            g("Arrow width"),
                            /* @__PURE__ */ C.jsx(pe, { min: 0.5, max: 6, step: 0.25, value: J.recipe.arrowWidth ?? 1.5, onCommit: (p) => _t((b) => b.kind === "strategy" ? { ...b, arrowWidth: p } : b) })
                          ] })
                        ] })
                      ] }),
                      J.recipe.kind === "strategy" && !((cs = J.recipe.populationIds) != null && cs.length) && /* @__PURE__ */ C.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: J.recipe.fullPath,
                            onChange: (p) => _t(
                              (b) => b.kind === "strategy" ? {
                                ...b,
                                fullPath: p.target.checked
                              } : b
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
                            value: J.recipe.displayMode,
                            onChange: (p) => _t(
                              (b) => b.kind === "text" ? b : {
                                ...b,
                                displayMode: p.target.value
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
                            checked: J.recipe.iterated === !0,
                            onChange: (p) => _t(
                              (b) => b.kind === "text" ? b : { ...b, iterated: p.target.checked }
                            )
                          }
                        ),
                        g("Follows the iteration")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: g("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: pi }), children: [
                        g("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: Ac || $e(J, Pt),
                            value: J.recipe.title ?? "",
                            onChange: (p) => _t(
                              (b) => b.kind === "text" ? b : { ...b, title: p.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ C.jsxs("summary", { children: [
                          g("Style"),
                          Object.keys(J.recipe.style ?? {}).length > 0 ? ` · ${g("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ C.jsx(
                          Tl,
                          {
                            effective: Za(K, J.recipe),
                            own: J.recipe.style ?? {},
                            onChange: (p) => _t(
                              (b) => oe(b) ? { ...b, style: Ms({ ...b.style, ...p }) } : b
                            )
                          }
                        ),
                        Object.keys(J.recipe.style ?? {}).length > 0 && /* @__PURE__ */ C.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: g("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => _t((p) => {
                              if (!oe(p)) return p;
                              const { style: b, ...I } = p;
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
                            J.recipe
                          ),
                          children: g("Open in Gating")
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            U === "page" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: g("Page") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Size"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    value: K.page.preset,
                    onChange: (p) => ur(mf(p.target.value, K.page.orientation, K.page)),
                    children: [
                      Object.entries(gf).map(([p, b]) => /* @__PURE__ */ C.jsx("option", { value: p, children: b.label }, p)),
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
                    value: K.page.orientation,
                    onChange: (p) => ur({ ...K.page, orientation: p.target.value }),
                    children: [
                      /* @__PURE__ */ C.jsx("option", { value: "portrait", children: g("Portrait") }),
                      /* @__PURE__ */ C.jsx("option", { value: "landscape", children: g("Landscape") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["width", "height"].map((p) => /* @__PURE__ */ C.jsxs("label", { children: [
                g(p === "width" ? "Width (mm)" : "Height (mm)"),
                /* @__PURE__ */ C.jsx(
                  pe,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": g(p === "width" ? "Width (mm)" : "Height (mm)"),
                    value: Rl(K.page)[p === "width" ? "widthMm" : "heightMm"],
                    onCommit: (b) => {
                      const I = K.page.orientation === "landscape", B = p === "width" == !I ? "widthMm" : "heightMm";
                      ur({ ...K.page, preset: "custom", [B]: b });
                    }
                  }
                )
              ] }, p)) }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Margin (mm)"),
                /* @__PURE__ */ C.jsx(
                  pe,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: K.page.marginMm,
                    onCommit: (p) => ur({ ...K.page, marginMm: p })
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ C.jsxs("label", { children: [
                  g("Pages across"),
                  /* @__PURE__ */ C.jsx(pe, { min: 1, max: bs, step: 1, integer: !0, "aria-label": g("Pages across"), value: K.page.columns, onCommit: (p) => ur({ ...K.page, columns: p }) })
                ] }),
                /* @__PURE__ */ C.jsxs("label", { children: [
                  g("Pages down"),
                  /* @__PURE__ */ C.jsx(pe, { min: 1, max: bs, step: 1, integer: !0, "aria-label": g("Pages down"), value: K.page.rows, onCommit: (p) => ur({ ...K.page, rows: p }) })
                ] })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Vc, disabled: !K.items.length, title: g("Make the page a custom size that holds every item inside the margin, as one page"), children: g("Fit page to content") }),
                /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Uc, disabled: !K.items.length, title: g("Scale and centre every item, as one group, to fill the first page inside its margin"), children: g("Fit content to page") })
              ] }),
              /* @__PURE__ */ C.jsx("h3", { children: g("Export") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Format"),
                /* @__PURE__ */ C.jsxs("select", { value: Bt, onChange: (p) => Rt(p.target.value), children: [
                  /* @__PURE__ */ C.jsx("option", { value: "pdf", children: g("PDF · the page at its size") }),
                  /* @__PURE__ */ C.jsx("option", { value: "svg", children: g("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ C.jsx("option", { value: "png", children: g("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Resolution (dpi)"),
                /* @__PURE__ */ C.jsx(
                  pe,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: K.page.dpi,
                    onCommit: (p) => ur({ ...K.page, dpi: p })
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                /* @__PURE__ */ C.jsx("input", { type: "checkbox", checked: jt, onChange: (p) => je(p.target.checked) }),
                g("Crop to content")
              ] }),
              jt && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Padding (mm)"),
                /* @__PURE__ */ C.jsx(pe, { min: 0, max: 50, step: 0.5, "aria-label": g("Padding (mm)"), value: Te, onCommit: In })
              ] }),
              /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void as(), disabled: Ue || !K.items.length, children: g(Ue ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g(jt ? "The export is cut down to the items on each page plus the padding, so a figure comes out without the paper around it; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above." : "The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            U === "iterate" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: g("Iterate") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Draw the sheet"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    value: ft.mode,
                    onChange: (p) => {
                      const b = p.target.value;
                      if (b === "metadata") {
                        const I = ft.column && o.includes(ft.column) ? ft.column : o[0] ?? "";
                        He({ ...ft, mode: "metadata", column: I, source: ft.source.kind === "metadata" ? { kind: "checked" } : ft.source });
                        return;
                      }
                      He({ ...ft, mode: b === "files" ? "files" : b === "populations" ? "populations" : "off" });
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
                /* @__PURE__ */ C.jsx("select", { value: ft.column ?? "", onChange: (p) => He({ ...ft, column: p.target.value }), children: o.map((p) => /* @__PURE__ */ C.jsx("option", { value: p, children: p }, p)) })
              ] }),
              ft.mode !== "off" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                ft.mode === "populations" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  g("Populations"),
                  /* @__PURE__ */ C.jsxs(
                    "select",
                    {
                      value: ((fs = ft.populations) == null ? void 0 : fs.kind) === "branch" ? ft.populations.populationId : "all",
                      onChange: (p) => He({
                        ...ft,
                        populations: p.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: p.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ C.jsx("option", { value: "all", children: g("All in the tree") }),
                        (ee ? ca(ee.tree.populations, ee.tree.root_population_id ?? "") : []).filter(({ popId: p }) => p !== (ee == null ? void 0 : ee.tree.root_population_id)).map(({ popId: p, depth: b }) => {
                          var I;
                          return /* @__PURE__ */ C.jsxs("option", { value: p, children: [
                            " ".repeat(b * 2),
                            g("Under {name}", { name: ((I = ee == null ? void 0 : ee.tree.populations[p]) == null ? void 0 : I.name) ?? p })
                          ] }, p);
                        })
                      ]
                    }
                  )
                ] }),
                (ft.mode === "files" || ft.mode === "metadata") && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  g("Files"),
                  /* @__PURE__ */ C.jsxs("select", { value: Jc, onChange: (p) => He({ ...ft, source: Qc(p.target.value) }), children: [
                    /* @__PURE__ */ C.jsx("option", { value: "checked", children: g("Checked files") }),
                    /* @__PURE__ */ C.jsx("option", { value: "all", children: g("All files") }),
                    a.map((p) => /* @__PURE__ */ C.jsx("option", { value: `group:${p.id}`, children: g("Group {name}", { name: p.name }) }, p.id)),
                    ft.mode === "files" && o.flatMap(
                      (p) => Zc(p).map((b) => /* @__PURE__ */ C.jsxs("option", { value: `meta:${p}=${b}`, children: [
                        p,
                        " = ",
                        b
                      ] }, `${p}=${b}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  g("Arrangement"),
                  /* @__PURE__ */ C.jsxs(
                    "select",
                    {
                      value: ft.arrangement.kind,
                      onChange: (p) => He({
                        ...ft,
                        arrangement: p.target.value === "tiles" ? { kind: "tiles", rows: 2, columns: 2, order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ C.jsx("option", { value: "page-per-unit", children: ft.mode === "populations" ? g("One page per population") : ft.mode === "metadata" ? g("One page per value") : g("One page per file") }),
                        /* @__PURE__ */ C.jsx("option", { value: "tiles", children: g("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                ft.arrangement.kind === "tiles" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                  /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((p) => /* @__PURE__ */ C.jsxs("label", { children: [
                    g(p === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ C.jsx(
                      pe,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": g(p === "columns" ? "Tiles across" : "Tiles down"),
                        value: ft.arrangement.kind === "tiles" ? ft.arrangement[p] : 1,
                        onCommit: (b) => {
                          ft.arrangement.kind === "tiles" && He({ ...ft, arrangement: { ...ft.arrangement, [p]: b } });
                        }
                      }
                    )
                  ] }, p)) }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                    g("Order"),
                    /* @__PURE__ */ C.jsxs(
                      "select",
                      {
                        value: ft.arrangement.order,
                        onChange: (p) => ft.arrangement.kind === "tiles" && He({ ...ft, arrangement: { ...ft.arrangement, order: p.target.value === "column-major" ? "column-major" : "row-major" } }),
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
                      pe,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: ft.arrangement.gap,
                        onCommit: (p) => {
                          ft.arrangement.kind === "tiles" && He({ ...ft, arrangement: { ...ft.arrangement, gap: p } });
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: ft.mode === "populations" ? g("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: Se.length, of: (ee == null ? void 0 : ee.name) ?? "the file", pages: Math.max(1, me.length) }) : ft.mode === "metadata" ? g("{values} values of {column} over {files} files → {pages} pages. Items marked “Follows the iteration” pool the files of each value; the others repeat. Text and titles may use {sample} (the value), {meta:column}, {file} (how many files), {n} and {N}; a plot title may also use {population} and {count}.", { values: Se.length, column: ft.column ?? "", files: Se.reduce((p, b) => {
                  var I;
                  return p + (((I = b.sampleIds) == null ? void 0 : I.length) ?? 0);
                }, 0), pages: Math.max(1, me.length) }) : g("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: Se.length, pages: Math.max(1, me.length) }) })
              ] })
            ] }),
            U === "style" && K && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: g("Style") }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                g("Plot titles"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    "aria-label": g("Plot titles"),
                    value: zo ? "custom" : ((ds = la.find((p) => p.template === (K.titleTemplate ?? ""))) == null ? void 0 : ds.id) ?? "custom",
                    onChange: (p) => {
                      const b = la.find((I) => I.id === p.target.value);
                      Rc(!b), Ot((I) => {
                        var B;
                        b ? b.template ? I.titleTemplate = b.template : delete I.titleTemplate : I.titleTemplate = ((B = I.titleTemplate) == null ? void 0 : B.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      la.map((p) => /* @__PURE__ */ C.jsx("option", { value: p.id, children: g(p.label) }, p.id)),
                      /* @__PURE__ */ C.jsx("option", { value: "custom", children: g("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const p = K.items.filter((b) => Yo(b));
                return p.length ? /* @__PURE__ */ C.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  g("{count} plots keep a title of their own, so the template does not reach them.", { count: p.length }),
                  " ",
                  /* @__PURE__ */ C.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: g("Drop those plots' own titles so every plot on the sheet follows the template"),
                      onClick: () => Ot((b) => {
                        for (const I of b.items) oe(I.recipe) && delete I.recipe.title;
                      }),
                      children: g("Use the template for all")
                    }
                  )
                ] }) : null;
              })(),
              (zo || !la.some((p) => p.template === (K.titleTemplate ?? ""))) && (() => {
                var Et;
                const p = K.titleTemplate ?? "", b = ag(p), I = (b == null ? void 0 : b.tokens) ?? [], B = (b == null ? void 0 : b.separator) ?? Pc, G = (lt) => {
                  var Dt;
                  return ((Dt = Go.find((re) => re.token === lt)) == null ? void 0 : Dt.label) ?? lt;
                }, $ = (lt) => Ot((Dt) => {
                  Dt.titleTemplate = El(lt, B);
                }), X = Vt.items.find((lt) => oe(lt.recipe)), ot = X && oe(X.recipe) ? ka(p, Dr(X.recipe, X.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ C.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": g("Title builder"), children: [
                  /* @__PURE__ */ C.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": g("Fields in the title"), children: [
                    I.length === 0 && /* @__PURE__ */ C.jsx("span", { className: "gl-hint", children: g(b === null && p ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    I.map((lt, Dt) => /* @__PURE__ */ C.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": g("Remove {field}", { field: G(lt) }),
                        title: g("Remove {field} from the title", { field: G(lt) }),
                        onClick: () => $(I.filter((re, Ce) => Ce !== Dt)),
                        children: [
                          G(lt),
                          " ×"
                        ]
                      },
                      `${lt}-${Dt}`
                    ))
                  ] }),
                  /* @__PURE__ */ C.jsx("div", { className: "gl-title-builder-fields", "aria-label": g("Fields to add"), children: Go.map((lt) => /* @__PURE__ */ C.jsx(
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
                        value: ((Et = vi.find((lt) => lt.value === B)) == null ? void 0 : Et.id) ?? "dot",
                        onChange: (lt) => {
                          var re;
                          const Dt = ((re = vi.find((Ce) => Ce.id === lt.target.value)) == null ? void 0 : re.value) ?? " · ";
                          Oc(Dt), I.length && Ot((Ce) => {
                            Ce.titleTemplate = El(I, Dt);
                          });
                        },
                        children: vi.map((lt) => /* @__PURE__ */ C.jsx("option", { value: lt.id, children: g(lt.label) }, lt.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                    g("Template"),
                    /* @__PURE__ */ C.jsx(
                      "input",
                      {
                        "aria-label": g("Title template"),
                        value: p,
                        onChange: (lt) => Ot((Dt) => {
                          Dt.titleTemplate = lt.target.value;
                        })
                      }
                    )
                  ] }),
                  ot && /* @__PURE__ */ C.jsx("div", { className: "gl-hint gl-title-builder-preview", children: g("First plot reads: {title}", { title: ot }) })
                ] });
              })(),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: g(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise.`, { list: pi }) }),
              /* @__PURE__ */ C.jsx(
                Tl,
                {
                  effective: Za(K),
                  own: K.style ?? {},
                  onChange: (p) => Ot((b) => {
                    b.style = Ms({ ...b.style, ...p });
                  })
                }
              ),
              Object.keys(K.style ?? {}).length > 0 && /* @__PURE__ */ C.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  onClick: () => Ot((p) => {
                    delete p.style;
                  }),
                  children: g("Reset to defaults")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ C.jsx(xf, { menu: jc, onClose: () => Ya(null) }),
          /* @__PURE__ */ C.jsxs(
            "div",
            {
              ref: (p) => {
                We.current = p, L(p);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": g("Layout page"),
              onKeyDown: tf,
              children: [
                !yt && Y && /* @__PURE__ */ C.jsx(
                  Kh,
                  {
                    ref: Z,
                    container: Y,
                    dragContainer: Y,
                    selectableTargets: [".gl-layout-item"],
                    selectByClick: !0,
                    selectFromInside: !1,
                    continueSelect: !1,
                    toggleContinueSelect: ["shift"],
                    hitRate: 0,
                    ratio: 0,
                    dragCondition: (p) => {
                      var b, I, B;
                      return !((B = (I = (b = p.inputEvent) == null ? void 0 : b.target) == null ? void 0 : I.closest) != null && B.call(I, "textarea, input, select, button"));
                    },
                    onDragStart: Hc,
                    onSelectEnd: $c
                  }
                ),
                /* @__PURE__ */ C.jsx(
                  "div",
                  {
                    className: "gl-layout-zoom",
                    style: { width: K.width * xt, height: K.height * xt },
                    children: /* @__PURE__ */ C.jsxs(
                      "section",
                      {
                        ref: (p) => {
                          lr.current = p, W(p);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": K.name,
                        onContextMenu: Bc,
                        style: { width: K.width, height: K.height, transform: `scale(${xt})` },
                        children: [
                          pa(K.page).map((p) => {
                            const b = xi(K.page), I = xs(K.page.marginMm);
                            return /* @__PURE__ */ C.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: p.x, top: p.y, width: b.width, height: b.height }, children: I > 0 && /* @__PURE__ */ C.jsx("div", { className: "gl-layout-page-margin", style: { inset: I } }) }, `${p.row}-${p.column}`);
                          }),
                          Vt.items.length === 0 && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ C.jsx("strong", { children: g("Blank layout") }),
                            /* @__PURE__ */ C.jsx("span", { children: g(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          Vt.items.map((p) => /* @__PURE__ */ C.jsx(
                            Bg,
                            {
                              item: p,
                              templateText: (() => {
                                const b = K.items.find((I) => I.id === p.templateId);
                                return (b == null ? void 0 : b.recipe.kind) === "text" ? b.recipe.text : void 0;
                              })(),
                              selected: T.includes(p.id),
                              samples: Pt,
                              state: f,
                              globalScales: d,
                              dataRevision: E,
                              densityColorPower: M,
                              style: Za(K, p.recipe),
                              titleTemplate: Yo(p, p.templateSampleId) || Fo,
                              describe: Dr,
                              checkedSampleIds: n,
                              metadataById: Er,
                              files: r,
                              sources: ge.sources,
                              divisionProfiles: S,
                              canvasScale: qt,
                              onTextChange: (b, I) => {
                                if (!b.trim()) {
                                  Qr([p.templateId]);
                                  return;
                                }
                                Ot((B) => {
                                  const G = B.items.find(
                                    ($) => $.id === p.templateId
                                  );
                                  (G == null ? void 0 : G.recipe.kind) === "text" && (G.recipe.text = b, I > 0 && (G.height = Math.max(G.height, Math.ceil(I) + 4)));
                                });
                              },
                              onTextFocus: () => {
                                (!T.includes(p.id) || T.length > 1) && k([p.id]);
                              },
                              textEditing: A === p.id,
                              onTextEditStart: () => {
                                k([p.id]), O(p.id);
                              },
                              onIsolate: p.group && T.includes(p.id) && T.length > 1 ? () => k([p.id]) : void 0,
                              onTextEditEnd: () => {
                                var b;
                                O((I) => I === p.id ? null : I), (b = We.current) == null || b.focus({ preventScroll: !0 });
                              }
                            },
                            p.id
                          )),
                          !yt && /* @__PURE__ */ C.jsx(
                            Ph,
                            {
                              ref: et,
                              target: Ye.length === 1 ? Ye[0] : Ye,
                              zoom: 1 / xt,
                              origin: !1,
                              checkInput: !0,
                              passDragArea: !0,
                              draggable: !0,
                              resizable: !0,
                              useMutationObserver: !0,
                              useResizeObserver: !0,
                              keepRatio: dt.shift,
                              throttleDragRotate: dt.shift ? 45 : 0,
                              snappable: !dt.meta,
                              snapThreshold: 6,
                              isDisplaySnapDigit: !1,
                              isDisplayInnerSnapDigit: !1,
                              snapDirections: kl,
                              elementSnapDirections: kl,
                              elementGuidelines: F,
                              verticalGuidelines: es.vertical,
                              horizontalGuidelines: es.horizontal,
                              snapGridWidth: R ? _l : 0,
                              snapGridHeight: R ? _l : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              individualGroupable: Jr,
                              container: Jr ? z : void 0,
                              onDragStart: Xc,
                              onDrag: Jo,
                              onDragEnd: (p) => {
                                const b = Qo(p);
                                Wn(b, p.lastEvent, p.isDrag, () => Gn(b, !!p.datas.alt));
                              },
                              onDragGroupStart: (p) => {
                                var b;
                                p.datas.alt = !!((b = p.inputEvent) != null && b.altKey), Ln([...p.targets ?? []], p.datas.alt ? Ko(p.targets ?? []) : void 0);
                              },
                              onDragGroup: (p) => p.events.forEach(Jo),
                              onDragGroupEnd: (p) => Wn(p.targets, p.lastEvent, p.isDrag, () => Gn(p.targets, !!p.datas.alt)),
                              onResizeStart: (p) => {
                                var b;
                                Ln([p.target]), (b = p.inputEvent) != null && b.altKey && p.setFixedDirection([0, 0]);
                              },
                              onResize: ts,
                              onResizeEnd: (p) => Wn([p.target], p.lastEvent, p.isDrag, () => Gn([p.target], !1)),
                              onResizeGroupStart: (p) => {
                                var b;
                                Ln([...p.targets ?? []]), (b = p.inputEvent) != null && b.altKey && p.events.forEach((I) => I.setFixedDirection([0, 0]));
                              },
                              onResizeGroup: (p) => p.events.forEach(ts),
                              onResizeGroupEnd: (p) => Wn(p.targets, p.lastEvent, p.isDrag, () => Gn(p.targets, !1)),
                              onClick: (p) => {
                                var b, I;
                                if (An.current) {
                                  An.current = !1;
                                  return;
                                }
                                ((b = p.inputEvent) != null && b.shiftKey || Jr) && ((I = Z.current) == null || I.clickTarget(p.inputEvent, p.inputTarget));
                              },
                              onClickGroup: (p) => {
                                var b;
                                (b = Z.current) == null || b.clickTarget(p.inputEvent, p.inputTarget);
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
  Wg as LayoutTab,
  Ag as isBakedTitle
};
