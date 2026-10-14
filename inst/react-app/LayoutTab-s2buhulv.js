import { a as et, t as ha, w as nf, s as af, z as vs, x as gs, y as Za, A as ms, B as of, E as yi, G as an, H as sf, I as Rl, J as Pl, f as lf, K as uf, L as cf, M as bi, N as fa, O as xs, P as Ol, Q as ff, R as ie, j as C, T as Ir, U as cr, V as df, u as En, W as pf, X as hf, Y as vf, Z as ys, _ as gf, $ as de, a0 as mf, S as bs, a1 as Ja, a2 as xf, a3 as yf, a4 as Ss, a5 as bf, a6 as Si, a7 as Sf, a8 as $n, a9 as Cs, aa as Cf, ab as wf, ac as Ef, ad as Df, ae as Nl, af as Mf, ag as kf, ah as _f, ai as ws, aj as Es, ak as Tf, al as If, am as Rf, an as Ds, ao as Pf, ap as Of, aq as Nf, ar as Ms, as as jf, at as Af, au as zf, av as Bf, aw as Gf, ax as Ff, ay as Lf, az as Wf, aA as Yf, aB as Xf, aC as Hf, l as Qa, aD as $f, aE as qf, aF as Vf, aG as Uf, aH as Kf, aI as Zf, aJ as ks } from "./embed-v78cfaSj.js";
function to(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return !0;
  return !1;
}
function jl(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return t[n];
  return null;
}
function Al(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function eo(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function Jf() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function Qf(t, e) {
  var r = eo("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return r ? r[3] : "";
}
function Ci(t) {
  return t.replace(/_/g, ".");
}
function sn(t, e) {
  var r = null, n = "-1";
  return to(t, function(a) {
    var i = eo("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (r = a, n = i[3] || "-1", a.versionAlias ? n = a.versionAlias : a.versionTest && (n = Qf(a.versionTest.toLowerCase(), e) || n), n = Ci(n), !0);
  }), {
    preset: r,
    version: n
  };
}
function qn(t, e) {
  var r = {
    brand: "",
    version: "-1"
  };
  return to(t, function(n) {
    var a = zl(e, n);
    return a ? (r.brand = n.id, r.version = n.versionAlias || a.version, r.version !== "-1") : !1;
  }), r;
}
function zl(t, e) {
  return jl(t, function(r) {
    var n = r.brand;
    return eo("" + e.test, n.toLowerCase());
  });
}
var Bl = [{
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
}], Gl = [{
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
}], wi = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], Fl = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], Ll = [{
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
function Wl(t) {
  return !!sn(Fl, t).preset;
}
function td(t) {
  var e = Al(t), r = !!/mobi/g.exec(e), n = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: Wl(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = sn(Bl, e), o = i.preset, s = i.version, l = sn(Ll, e), u = l.preset, c = l.version, f = sn(Gl, e);
  if (n.chromium = !!f.preset, n.chromiumVersion = f.version, !n.chromium) {
    var d = sn(wi, e);
    n.webkit = !!d.preset, n.webkitVersion = d.version;
  }
  return u && (a.name = u.id, a.version = c, a.majorVersion = parseInt(c, 10)), o && (n.name = o.id, n.version = s, n.webview && a.name === "ios" && n.name !== "safari" && (n.webview = !1)), n.majorVersion = parseInt(n.version, 10), {
    browser: n,
    os: a,
    isMobile: r,
    isHints: !1
  };
}
function ed(t) {
  var e = navigator.userAgentData, r = (e.uaList || e.brands).slice(), n = e.mobile || !1, a = r[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!qn(Fl, r).brand || Wl(Al())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && to(wi, function(d) {
    return zl(r, d);
  });
  var l = qn(Gl, r);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var u = qn(wi, r);
    o.webkit = !!u.brand, o.webkitVersion = u.version || "-1";
  }
  var c = jl(Ll, function(d) {
    return new RegExp("" + d.test, "g").exec(i);
  });
  s.name = c ? c.id : "";
  {
    var f = qn(Bl, r);
    o.name = f.brand || o.name, o.version = f.brand && t ? t.uaFullVersion : f.version;
  }
  return o.webkit && (s.name = n ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = Ci(s.version), o.version = Ci(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: n,
    isHints: !0
  };
}
function rd(t) {
  return Jf() ? ed() : td(t);
}
function nd(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  return e.map(function(n) {
    return n.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function ad(t, e) {
  return e.replace(/([^}{]*){/gm, function(r, n) {
    return n.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function rr(t, e) {
  return function(r) {
    r && (t[e] = r);
  };
}
function Yl(t, e, r) {
  return function(n) {
    n && (t[e][r] = n);
  };
}
function id(t, e) {
  return function(r) {
    var n = r.prototype;
    t.forEach(function(a) {
      e(n, a);
    });
  };
}
function Xl(t, e) {
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
var od = "function", sd = "object", ld = "string", ud = "number", ro = "undefined", Hl = typeof window !== ro, cd = typeof document !== ro && document, fd = [{
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
}], Qt = 1e-7, Vn = {
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
function dd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function va(t, e, r, n) {
  return (t * n + e * r) / (r + n);
}
function no(t) {
  return typeof t === ro;
}
function me(t) {
  return t && typeof t === sd;
}
function Ht(t) {
  return Array.isArray(t);
}
function Ee(t) {
  return typeof t === ld;
}
function yn(t) {
  return typeof t === ud;
}
function Ia(t) {
  return typeof t === od;
}
function pd(t, e) {
  var r = t === "" || t == " ", n = e === "" || e == " ";
  return n && r || t === e;
}
function $l(t, e, r, n, a) {
  var i = ao(t, e, r);
  return i ? r : hd(t, e, r + 1, n, a);
}
function ao(t, e, r) {
  if (!t.ignore)
    return null;
  var n = e.slice(Math.max(r - 3, 0), r + 3).join("");
  return new RegExp(t.ignore).exec(n);
}
function hd(t, e, r, n, a) {
  for (var i = function(u) {
    var c = e[u].trim();
    if (c === t.close && !ao(t, e, u))
      return {
        value: u
      };
    var f = u, d = xe(a, function(h) {
      var v = h.open;
      return v === c;
    });
    if (d && (f = $l(d, e, u, n, a)), f === -1)
      return o = u, "break";
    u = f, o = u;
  }, o, s = r; s < n; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function io(t, e) {
  var r = Ee(e) ? {
    separator: e
  } : e, n = r.separator, a = n === void 0 ? "," : n, i = r.isSeparateFirst, o = r.isSeparateOnlyOpenClose, s = r.isSeparateOpenClose, l = s === void 0 ? o : s, u = r.openCloseCharacters, c = u === void 0 ? fd : u, f = c.map(function(k) {
    var T = k.open, m = k.close;
    return T === m ? T : T + "|" + m;
  }).join("|"), d = "(\\s*" + a + "\\s*|" + f + "|\\s+)", h = new RegExp(d, "g"), v = t.split(h).filter(function(k) {
    return k && k !== "undefined";
  }), g = v.length, x = [], y = [];
  function S() {
    return y.length ? (x.push(y.join("")), y = [], !0) : !1;
  }
  for (var w = function(k) {
    var T = v[k].trim(), m = k, _ = xe(c, function(R) {
      var A = R.open;
      return A === T;
    }), j = xe(c, function(R) {
      var A = R.close;
      return A === T;
    });
    if (_) {
      if (m = $l(_, v, k, g, c), m !== -1 && l)
        return S() && i || (x.push(v.slice(k, m + 1).join("")), k = m, i) ? (E = k, "break") : (E = k, "continue");
    } else if (j && !ao(j, v, k)) {
      var O = dd(c);
      return O.splice(c.indexOf(j), 1), {
        value: io(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: O
        })
      };
    } else if (pd(T, a) && !o)
      return S(), i ? (E = k, "break") : (E = k, "continue");
    m === -1 && (m = g - 1), y.push(v.slice(k, m + 1).join("")), k = m, E = k;
  }, E, M = 0; M < g; ++M) {
    var D = w(M);
    if (M = E, typeof D == "object") return D.value;
    if (D === "break") break;
  }
  return y.length && x.push(y.join("")), x;
}
function nr(t) {
  return io(t, "");
}
function vr(t) {
  return io(t, ",");
}
function ql(t) {
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
function Ei(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, r) {
    return r.toUpperCase();
  });
}
function vd(t, e) {
  return t.replace(/([a-z])([A-Z])/g, function(r, n, a) {
    return "" + n + e + a.toLowerCase();
  });
}
function bn() {
  return Date.now ? Date.now() : (/* @__PURE__ */ new Date()).getTime();
}
function qe(t, e, r) {
  r === void 0 && (r = -1);
  for (var n = t.length, a = 0; a < n; ++a)
    if (e(t[a], a, t))
      return a;
  return r;
}
function xe(t, e, r) {
  var n = qe(t, e);
  return n > -1 ? t[n] : r;
}
var Vl = /* @__PURE__ */ (function() {
  var t = bn(), e = Hl && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(r) {
    var n = bn(), a = setTimeout(function() {
      r(n - t);
    }, 1e3 / 60);
    return a;
  };
})(), gd = /* @__PURE__ */ (function() {
  var t = Hl && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function $r(t) {
  return Object.keys(t);
}
function Nt(t, e) {
  var r = mr(t), n = r.value, a = r.unit;
  if (me(e)) {
    var i = e[a];
    if (i) {
      if (Ia(i))
        return i(n);
      if (Vn[a])
        return Vn[a](n, i);
    }
  } else if (a === "%")
    return n * e / 100;
  return Vn[a] ? Vn[a](n) : n;
}
function ga(t, e, r) {
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
function oo(t, e, r, n) {
  if (!n)
    return t.map(function(h, v) {
      return ga(h, e[v], r[v]);
    });
  var a = t[0], i = t[1], o = n === !0 ? a / i : n, s = _s(t, e, !1, o), l = s[0], u = s[1], c = _s(t, r, !0, o), f = c[0], d = c[1];
  return a < l || i < u ? (a = l, i = u) : (a > f || i > d) && (a = f, i = d), [a, i];
}
function md(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return r;
}
function Di(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return e ? r / e : 0;
}
function $t(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function xd(t) {
  return [0, 1].map(function(e) {
    return Di(t.map(function(r) {
      return r[e];
    }));
  });
}
function Ts(t) {
  var e = xd(t), r = $t(e, t[0]), n = $t(e, t[1]);
  return r < n && n - r < Math.PI || r > n && n - r < -Math.PI ? 1 : -1;
}
function Be(t, e) {
  return Math.sqrt(Math.pow((e ? e[0] : 0) - t[0], 2) + Math.pow((e ? e[1] : 0) - t[1], 2));
}
function St(t, e) {
  if (!e)
    return t;
  var r = 1 / e;
  return Math.round(t / e) / r;
}
function Is(t, e) {
  return t.forEach(function(r, n) {
    t[n] = St(t[n], e);
  }), t;
}
function yd(t) {
  for (var e = [], r = 0; r < t; ++r)
    e.push(r);
  return e;
}
function bd(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function te(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function so(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function Ul(t, e) {
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
function Ie(t) {
  return (t == null ? void 0 : t.ownerDocument) || cd;
}
function lo(t) {
  return Ie(t).documentElement;
}
function or(t) {
  return Ie(t).body;
}
function Ce(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function Kl(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function Sn(t) {
  return me(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function Sd(t, e, r, n, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = r + o * a, l = n + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function Cd(t, e, r, n, a) {
  for (var i = 0; i < a; ++i) {
    var o = r + i * a, s = n + i * a, l = t[o], u = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = u;
  }
}
function wd(t, e, r, n, a) {
  for (var i = 0; i < n; ++i) {
    var o = r + i * n;
    t[o] /= a, e[o] /= a;
  }
}
function Zl(t, e, r) {
  for (var n = t.slice(), a = 0; a < r; ++a)
    n[a * r + e - 1] = 0, n[(e - 1) * r + a] = 0;
  return n[(e - 1) * (r + 1)] = 1, n;
}
function Pe(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = t.slice(), n = At(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!St(r[i], Qt)) {
      for (var o = a + 1; o < e; ++o)
        if (r[e * a + o]) {
          Cd(r, n, a, o, e);
          break;
        }
    }
    if (!St(r[i], Qt))
      return [];
    wd(r, n, a, e, r[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, u = r[l];
      !St(u, Qt) || a === o || Sd(r, n, s, a, e, -u);
    }
  }
  return n;
}
function Ed(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = 0; n < e; ++n)
    for (var a = 0; a < e; ++a)
      r[a * e + n] = t[e * n + a];
  return r;
}
function Jl(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = t[e * e - 1], a = 0; a < e - 1; ++a)
    r[a] = t[e * (e - 1) + a] / n;
  return r[e - 1] = 0, r;
}
function Dd(t, e) {
  for (var r = At(e), n = 0; n < e - 1; ++n)
    r[e * (e - 1) + n] = t[n] || 0;
  return r;
}
function xr(t, e) {
  for (var r = t.slice(), n = t.length; n < e - 1; ++n)
    r[n] = 0;
  return r[e - 1] = 1, r;
}
function Oe(t, e, r) {
  if (e === void 0 && (e = Math.sqrt(t.length)), e === r)
    return t;
  for (var n = At(r), a = Math.min(e, r), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      n[i * r + o] = t[i * e + o];
    n[(i + 1) * r - 1] = t[(i + 1) * e - 1], n[(r - 1) * r + i] = t[(e - 1) * e + i];
  }
  return n[r * r - 1] = t[e * e - 1], n;
}
function ma(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  var n = At(t);
  return e.forEach(function(a) {
    n = jt(n, a, t);
  }), n;
}
function jt(t, e, r) {
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
function mt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] - e[a];
  return n;
}
function Md(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function Ql(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function oe(t, e, r) {
  r === void 0 && (r = e.length);
  var n = jt(t, e, r), a = n[r - 1];
  return n.map(function(i) {
    return i / a;
  });
}
function kd(t, e) {
  return jt(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function _d(t, e) {
  return jt(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function Td(t, e) {
  return jt(t, Mn(e, 4));
}
function Un(t, e) {
  var r = e[0], n = r === void 0 ? 1 : r, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return jt(t, [n, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function Dn(t, e) {
  return oe(Mn(e, 3), xr(t, 3));
}
function ti(t, e) {
  var r = e[0], n = r === void 0 ? 0 : r, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return jt(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, n, i, s, 1], 4);
}
function Mi(t, e) {
  return jt(t, e, 4);
}
function Mn(t, e) {
  var r = Math.cos(t), n = Math.sin(t), a = At(e);
  return a[0] = r, a[1] = n, a[e] = -n, a[e + 1] = r, a;
}
function At(t) {
  for (var e = t * t, r = [], n = 0; n < e; ++n)
    r[n] = n % (t + 1) ? 0 : 1;
  return r;
}
function uo(t, e) {
  for (var r = At(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[(e + 1) * a] = t[a];
  return r;
}
function yr(t, e) {
  for (var r = At(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[e * (e - 1) + a] = t[a];
  return r;
}
function co(t, e, r, n, a, i, o, s) {
  var l = t[0], u = t[1], c = e[0], f = e[1], d = r[0], h = r[1], v = n[0], g = n[1], x = a[0], y = a[1], S = i[0], w = i[1], E = o[0], M = o[1], D = s[0], k = s[1], T = [l, 0, c, 0, d, 0, v, 0, u, 0, f, 0, h, 0, g, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, c, 0, d, 0, v, 0, u, 0, f, 0, h, 0, g, 0, 1, 0, 1, 0, 1, 0, 1, -x * l, -y * l, -S * c, -w * c, -E * d, -M * d, -D * v, -k * v, -x * u, -y * u, -S * f, -w * f, -E * h, -M * h, -D * g, -k * g], m = Pe(T, 8);
  if (!m.length)
    return [];
  var _ = jt(m, [x, y, S, w, E, M, D, k], 8);
  return _[8] = 1, Oe(Ed(_), 3, 4);
}
var cn = function() {
  return cn = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, cn.apply(this, arguments);
};
function fo() {
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
function da(t, e) {
  var r = oe(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), n = r[3] || 1;
  return [
    r[0] / n,
    r[1] / n,
    r[2] / n
  ];
}
function Id(t, e) {
  e === void 0 && (e = document.body);
  for (var r = t, n = fo(); r; ) {
    var a = getComputedStyle(r).transform;
    if (n = Mi(Gr(a), n), r === e)
      break;
    r = r.parentElement;
  }
  return n = Pe(n, 4), n[12] = 0, n[13] = 0, n[14] = 0, n;
}
function Rr(t) {
  var e = fo();
  return t.forEach(function(r) {
    var n = r.matrixFunction, a = r.functionValue;
    n && (e = n(e, a));
  }), e;
}
function Fr(t, e) {
  e === void 0 && (e = 0);
  var r = Ht(t) ? t : nr(t);
  return r.map(function(n) {
    var a = ql(n), i = a.prefix, o = a.value, s = null, l = i, u = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var c = me(e) ? cn(cn({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, f = vr(o).map(function(R, A) {
        return A === 0 && "x%" in c ? c["%"] = e["x%"] : A === 1 && "y%" in c ? c["%"] = e["y%"] : c["%"] = e["o%"], Nt(R, c);
      }), d = f[0], h = f[1], v = h === void 0 ? 0 : h, g = f[2], x = g === void 0 ? 0 : g;
      s = ti, u = [d, v, x];
    } else if (i === "translateY") {
      var y = me(e) ? cn({ "%": e["y%"] }, e) : {
        "%": e
      }, v = Nt(o, y);
      s = ti, u = [0, v, 0];
    } else if (i === "translateZ") {
      var x = parseFloat(o);
      s = ti, u = [0, 0, x];
    } else if (i === "scale" || i === "scale3d") {
      var S = vr(o).map(function(R) {
        return parseFloat(R);
      }), w = S[0], E = S[1], M = E === void 0 ? w : E, D = S[2], k = D === void 0 ? 1 : D;
      s = Un, u = [w, M, k];
    } else if (i === "scaleX") {
      var w = parseFloat(o);
      s = Un, u = [w, 1, 1];
    } else if (i === "scaleY") {
      var M = parseFloat(o);
      s = Un, u = [1, M, 1];
    } else if (i === "scaleZ") {
      var k = parseFloat(o);
      s = Un, u = [1, 1, k];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var T = mr(o), m = T.unit, _ = T.value, j = m === "rad" ? _ : _ * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = Td) : i === "rotateX" ? s = kd : i === "rotateY" && (s = _d), u = j;
    } else if (i === "matrix3d")
      s = Mi, u = vr(o).map(function(R) {
        return parseFloat(R);
      });
    else if (i === "matrix") {
      var O = vr(o).map(function(R) {
        return parseFloat(R);
      });
      s = Mi, u = [
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
var Rd = /* @__PURE__ */ (function() {
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
})(), Pd = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(r) {
    return this.object[r];
  }, e.set = function(r, n) {
    this.object[r] = n;
  }, t;
})(), Od = typeof Map == "function", Nd = /* @__PURE__ */ (function() {
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
function jd(t, e) {
  var r = [], n = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new Nd();
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
var Ad = /* @__PURE__ */ (function() {
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
    var r = jd(this.changedBeforeAdded, this.fixed), n = this.changed, a = [];
    this.cacheOrdered = r.filter(function(i, o) {
      var s = i[0], l = i[1], u = n[o], c = u[0], f = u[1];
      if (s !== l)
        return a.push([c, f]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function po(t, e, r) {
  var n = Od ? Map : r ? Pd : Rd, a = r || function(S) {
    return S;
  }, i = [], o = [], s = [], l = t.map(a), u = e.map(a), c = new n(), f = new n(), d = [], h = [], v = {}, g = [], x = 0, y = 0;
  return l.forEach(function(S, w) {
    c.set(S, w);
  }), u.forEach(function(S, w) {
    f.set(S, w);
  }), l.forEach(function(S, w) {
    var E = f.get(S);
    typeof E > "u" ? (++y, o.push(w)) : v[E] = y;
  }), u.forEach(function(S, w) {
    var E = c.get(S);
    typeof E > "u" ? (i.push(w), ++x) : (s.push([E, w]), y = v[w] || 0, d.push([E - y, w - x]), h.push(w === E), E !== w && g.push([E, w]));
  }), o.reverse(), new Ad(t, e, i, o, g, s, d, h);
}
var zd = /* @__PURE__ */ (function() {
  function t(r, n) {
    r === void 0 && (r = []), this.findKeyCallback = n, this.list = [].slice.call(r);
  }
  var e = t.prototype;
  return e.update = function(r) {
    var n = [].slice.call(r), a = po(this.list, n, this.findKeyCallback);
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
var ki = function(t, e) {
  return ki = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, ki(t, e);
};
function Bd(t, e) {
  ki(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var tu = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), eu = /* @__PURE__ */ (function(t) {
  Bd(e, t);
  function e(r) {
    return r === void 0 && (r = []), t.call(this, r, tu) || this;
  }
  return e;
})(zd);
function Pr(t, e) {
  return po(t, e, tu);
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
function Gd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
var kn = /* @__PURE__ */ (function() {
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
        var o = qe(i, function(s) {
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
    }, n.currentTarget = this, Gd(i).forEach(function(s) {
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
var Ti = function(t, e) {
  return Ti = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Ti(t, e);
};
function Fd(t, e) {
  Ti(t, e);
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
function Ld(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function Rs(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function Kn(t) {
  if (t) {
    if (Ee(t))
      return document.querySelector(t);
  } else return null;
  if (Ia(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var ru = /* @__PURE__ */ (function(t) {
  Fd(e, t);
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
    var i = Kn(a.container);
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
    var i = n.prevScrollPos, o = i === void 0 ? this._prevScrollPos : i, s = n.direction, l = n.throttleTime, u = l === void 0 ? 0 : l, c = n.inputEvent, f = n.isDrag, d = this._getScrollPosition(s || [0, 0], n), h = d[0] - o[0], v = d[1] - o[1], g = s || [h ? Math.abs(h) / h : 0, v ? Math.abs(v) / v : 0];
    return this._prevScrollPos = d, this._lock = !1, !h && !v ? !1 : (this.emit("move", {
      offsetX: g[0] ? h : 0,
      offsetY: g[1] ? v : 0,
      inputEvent: c
    }), u && f && (clearTimeout(this._timer), this._timer = window.setTimeout(function() {
      a._continueDrag(n);
    }, u)), !0);
  }, r.dragEnd = function() {
    this._flag = !1, this._lock = !1, clearTimeout(this._timer), this._unregisterScrollEvent();
  }, r._getScrollPosition = function(n, a) {
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? Ld : o;
    return s({
      container: Kn(i),
      direction: n
    });
  }, r._continueDrag = function(n) {
    var a = this, i, o = n.container, s = n.direction, l = n.throttleTime, u = n.useScroll, c = n.isDrag, f = n.inputEvent;
    if (!(!this._flag || c && this._isWait)) {
      var d = bn(), h = Math.max(l + this._prevTime - d, 0);
      if (h > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(n);
        }, h), !1;
      this._prevTime = d;
      var v = this._getScrollPosition(s, n);
      this._prevScrollPos = v, c && (this._isWait = !0), u || (this._lock = !0);
      var g = {
        container: Kn(o),
        direction: s,
        inputEvent: f
      };
      return (i = n.requestScroll) === null || i === void 0 || i.call(n, g), this.emit("scroll", g), this._isWait = !1, u || this.checkScroll(Or(Or({}, n), {
        prevScrollPos: v,
        direction: s,
        inputEvent: f
      }));
    }
  }, r._registerScrollEvent = function(n) {
    this._unregisterScrollEvent();
    var a = n.checkScrollEvent;
    if (a) {
      var i = a === !0 ? Rs : a, o = Kn(n.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = Rs(window, this._onScroll) : this._unregister = i(o, this._onScroll);
    }
  }, r._unregisterScrollEvent = function() {
    var n;
    (n = this._unregister) === null || n === void 0 || n.call(this), this._unregister = null;
  }, e;
})(kn);
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
function Wd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function pe(t) {
  return St(t, Qt);
}
function Yd(t, e) {
  return t.every(function(r, n) {
    return pe(r - e[n]) === 0;
  });
}
function Xd(t, e) {
  return !pe(t[0] - e[0]) && !pe(t[1] - e[1]);
}
function fn(t) {
  return t.length < 3 ? 0 : Math.abs(md(t.map(function(e, r) {
    var n = t[r + 1] || t[0];
    return e[0] * n[1] - n[0] * e[1];
  }))) / 2;
}
function Ii(t, e) {
  var r = e.width, n = e.height, a = e.left, i = e.top, o = br(t), s = o.minX, l = o.minY, u = o.maxX, c = o.maxY, f = r / (u - s), d = n / (c - l);
  return t.map(function(h) {
    return [a + (h[0] - s) * f, i + (h[1] - l) * d];
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
function xa(t, e, r) {
  var n = t[0], a = t[1], i = br(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], u = ya(l[0], l[1]), c = Ri(e), f = [];
  if (c.forEach(function(v) {
    var g = ya(v[0], v[1]), x = v[0];
    if (Yd(u, g))
      f.push({
        pos: t,
        line: v,
        type: "line"
      });
    else {
      var y = nu(ho(u, g), [l, v]);
      y.forEach(function(S) {
        v.some(function(w) {
          return Xd(w, S);
        }) ? f.push({
          pos: S,
          line: v,
          type: "point"
        }) : pe(x[1] - a) !== 0 && f.push({
          pos: S,
          line: v,
          type: "intersection"
        });
      });
    }
  }), xe(f, function(v) {
    return v[0] === n;
  }))
    return !0;
  var d = 0, h = {};
  return f.forEach(function(v) {
    var g = v.pos, x = v.type, y = v.line;
    if (!(g[0] > n))
      if (x === "intersection")
        ++d;
      else {
        if (x === "line")
          return;
        if (x === "point") {
          var S = xe(y, function(M) {
            return M[1] !== a;
          }), w = h[g[0]], E = S[1] > a ? 1 : -1;
          w ? w !== E && ++d : h[g[0]] = E;
        }
      }
  }), d % 2 === 1;
}
function ya(t, e) {
  var r = t[0], n = t[1], a = e[0], i = e[1], o = a - r, s = i - n;
  Math.abs(o) < Qt && (o = 0), Math.abs(s) < Qt && (s = 0);
  var l = 0, u = 0, c = 0;
  return o ? s ? (l = -s / o, u = 1, c = -l * r - n) : (u = 1, c = -n) : s && (l = -1, c = r), [l, u, c];
}
function ho(t, e) {
  var r = t[0], n = t[1], a = t[2], i = e[0], o = e[1], s = e[2], l = r === 0 && i === 0, u = n === 0 && o === 0, c = [];
  if (l && u)
    return [];
  if (l) {
    var f = -a / n, d = -s / o;
    return f !== d ? [] : [[-1 / 0, f], [1 / 0, f]];
  } else if (u) {
    var h = -a / r, v = -s / i;
    return h !== v ? [] : [[h, -1 / 0], [h, 1 / 0]];
  } else if (r === 0) {
    var g = -a / n, x = -(o * g + s) / i;
    c = [[x, g]];
  } else if (i === 0) {
    var g = -s / o, x = -(n * g + a) / r;
    c = [[x, g]];
  } else if (n === 0) {
    var x = -a / r, g = -(i * x + s) / o;
    c = [[x, g]];
  } else if (o === 0) {
    var x = -s / i, g = -(r * x + a) / n;
    c = [[x, g]];
  } else {
    var x = (n * s - o * a) / (o * r - n * i), g = -(r * x + a) / n;
    c = [[x, g]];
  }
  return c.map(function(y) {
    return [y[0], y[1]];
  });
}
function nu(t, e) {
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
    var d = f[0], h = f[1];
    return r.every(function(v) {
      return 0 <= pe(d - v[0][0]) && 0 <= pe(v[0][1] - d) && 0 <= pe(h - v[1][0]) && 0 <= pe(v[1][1] - h);
    });
  })), n.map(function(f) {
    return [pe(f[0]), pe(f[1])];
  });
}
function Ri(t) {
  return Wd(t.slice(1), [t[0]]).map(function(e, r) {
    return [t[r], e];
  });
}
function Hd(t, e) {
  var r = t.slice(), n = e.slice();
  Ts(r) === -1 && r.reverse(), Ts(n) === -1 && n.reverse();
  var a = Ri(r), i = Ri(n), o = a.map(function(c) {
    return ya(c[0], c[1]);
  }), s = i.map(function(c) {
    return ya(c[0], c[1]);
  }), l = [];
  o.forEach(function(c, f) {
    var d = a[f], h = [];
    s.forEach(function(v, g) {
      var x = ho(c, v), y = nu(x, [d, i[g]]);
      h.push.apply(h, y.map(function(S) {
        return {
          index1: f,
          index2: g,
          pos: S,
          type: "intersection"
        };
      }));
    }), h.sort(function(v, g) {
      return Be(d[0], v.pos) - Be(d[0], g.pos);
    }), l.push.apply(l, h), xa(d[1], n) && l.push({
      index1: f,
      index2: -1,
      pos: d[1],
      type: "inside"
    });
  }), i.forEach(function(c, f) {
    if (xa(c[1], r)) {
      var d = !1, h = qe(l, function(v) {
        var g = v.index2;
        return g === f ? (d = !0, !1) : !!d;
      });
      h === -1 && (d = !1, h = qe(l, function(v) {
        var g = v.index1, x = v.index2;
        return g === -1 && x + 1 === f ? (d = !0, !1) : !!d;
      })), h === -1 ? l.push({
        index1: -1,
        index2: f,
        pos: c[1],
        type: "inside"
      }) : l.splice(h, 0, {
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
function Pi(t, e) {
  var r = Hd(t, e);
  return r.map(function(n) {
    var a = n.pos;
    return a;
  });
}
function $d(t, e) {
  var r = Pi(t, e);
  return fn(r);
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
var Oi = function(t, e) {
  return Oi = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Oi(t, e);
};
function qd(t, e) {
  Oi(t, e);
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
function Vd(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function ei(t) {
  return Vd([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function Ud(t) {
  return t.touches && t.touches.length >= 2;
}
function Zn(t) {
  return t ? t.touches ? Zd(t.touches) : [au(t)] : [];
}
function Kd(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function Ps(t, e, r) {
  var n = r.length, a = dn(t, n), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, u = dn(e, n), c = u.clientX, f = u.clientY, d = dn(r, n), h = d.clientX, v = d.clientY, g = i - c, x = o - f, y = i - h, S = o - v;
  return {
    clientX: s,
    clientY: l,
    deltaX: g,
    deltaY: x,
    distX: y,
    distY: S
  };
}
function ri(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function Zd(t) {
  for (var e = Math.min(t.length, 2), r = [], n = 0; n < e; ++n)
    r.push(au(t[n]));
  return r;
}
function au(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY
  };
}
function dn(t, e) {
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
var ni = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), ei(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), ei(e) - ei(this.startClients);
  }, t.prototype.getPosition = function(e, r) {
    e === void 0 && (e = this.prevClients);
    var n = Ps(e || this.prevClients, this.prevClients, this.startClients), a = n.deltaX, i = n.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, n;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var r = this.prevClients, n = this.startClients, a = Math.min(this.length, r.length), i = [], o = 0; o < a; ++o)
      i[o] = Ps([e[o]], [r[o]], [n[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var r = this.movement;
    if (!e)
      return r;
    var n = dn(e, this.length), a = dn(this.prevClients, this.length), i = n.clientX - a.clientX, o = n.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + r;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), ri(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), ri(e) / ri(this.startClients);
  }, t.prototype.move = function(e, r) {
    this.startClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    }), this.prevClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    });
  }, t;
})(), Os = ["textarea", "input"], iu = /* @__PURE__ */ (function(t) {
  qd(e, t);
  function e(r, n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(d, h) {
      if (h === void 0 && (h = !0), !(!a.flag && d.cancelable === !1)) {
        var v = d.type.indexOf("drag") >= -1;
        if (!(a.flag && v)) {
          a._isDragAPI = !0;
          var g = a.options, x = g.container, y = g.pinchOutside, S = g.preventWheelClick, w = g.preventRightClick, E = g.preventDefault, M = g.checkInput, D = g.dragFocusedInput, k = g.preventClickEventOnDragStart, T = g.preventClickEventOnDrag, m = g.preventClickEventByCondition, _ = a._useTouch, j = !a.flag;
          if (a._isSecondaryButton = d.which === 3 || d.button === 2, S && (d.which === 2 || d.button === 1) || w && (d.which === 3 || d.button === 2))
            return a.stop(), !1;
          if (j) {
            var O = a._window.document.activeElement, R = d.target;
            if (R) {
              var A = R.tagName.toLowerCase(), z = Os.indexOf(A) > -1, W = R.isContentEditable;
              if (z || W) {
                if (M || !D && O === R)
                  return !1;
                if (O && (O === R || W && O.isContentEditable && O.contains(R)))
                  if (D)
                    R.blur();
                  else
                    return !1;
              } else if ((E || d.type === "touchstart") && O) {
                var H = O.tagName.toLowerCase();
                (O.isContentEditable || Os.indexOf(H) > -1) && O.blur();
              }
              (k || T || m) && Jt(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new ni(Zn(d))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = h, a._dragFlag = !0, a._prevInputEvent = d, a.data = {}, a.doubleFlag = bn() - a.prevTime < 200, a._isMouseEvent = Kd(d), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var F = a._preventMouseEvent || a.emit("dragStart", Kt(Kt({ data: a.data, datas: a.data, inputEvent: d, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: h, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
              d.preventDefault();
            }, preventDrag: function() {
              a._dragFlag = !1;
            } }));
            F === !1 && a.stop(), a._isMouseEvent && a.flag && E && d.preventDefault();
          }
          if (!a.flag)
            return !1;
          var q = 0;
          if (j ? (a._attchDragEvent(), _ && y && (q = setTimeout(function() {
            Jt(x, "touchstart", a.onDragStart, {
              passive: !1
            });
          }))) : _ && y && Xt(x, "touchstart", a.onDragStart), a.flag && Ud(d)) {
            if (clearTimeout(q), j && d.touches.length !== d.changedTouches.length)
              return;
            a.pinchFlag || a.onPinchStart(d);
          }
        }
      }
    }, a.onDrag = function(d, h) {
      if (a.flag) {
        var v = a.options.preventDefault;
        !a._isMouseEvent && v && d.preventDefault(), a._prevInputEvent = d;
        var g = Zn(d), x = a.moveClients(g, d, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || x.deltaX || x.deltaY) {
            var y = a._preventMouseEvent || a.emit("drag", Kt(Kt({}, x), { isScroll: !!h, inputEvent: d }));
            if (y === !1) {
              a.stop();
              return;
            }
          }
          a.pinchFlag && a.onPinch(d, g);
        }
        a.getCurrentStore().getPosition(g, !0);
      }
    }, a.onDragEnd = function(d) {
      if (a.flag) {
        var h = a.options, v = h.pinchOutside, g = h.container, x = h.preventClickEventOnDrag, y = h.preventClickEventOnDragStart, S = h.preventClickEventByCondition, w = a.isDrag;
        (x || y || S) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !S && !y && x && !w && a._allowClickEvent(), a._useTouch && v && Xt(g, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(d);
        var E = d != null && d.touches ? Zn(d) : [], M = E.length;
        M === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new ni(E));
        var D = a._getPosition(), k = bn(), T = !w && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = w || T ? 0 : k, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", Kt({ data: a.data, datas: a.data, isDouble: T, isDrag: w, isClick: !w, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: d, isTrusted: a._isTrusted }, D)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
          a._preventMouseEvent = !1;
        }, 200)), a._isIdle = !0);
      }
    }, a.onBlur = function() {
      a.onDragEnd();
    }, a._allowClickEvent = function() {
      Xt(a._window, "click", a._onClick, !0);
    }, a._onClick = function(d) {
      a._allowClickEvent(), a._allowMouseEvent();
      var h = a.options.preventClickEventByCondition;
      h != null && h(d) || (d.stopPropagation(), d.preventDefault());
    }, a._onContextMenu = function(d) {
      var h = a.options;
      h.preventRightClick ? a.onDragEnd(d) : d.preventDefault();
    }, a._passCallback = function() {
    };
    var i = [].concat(r), o = i[0];
    a._window = Kl(o) ? o : Ce(o), a.options = Kt({ checkInput: !1, container: o && !("document" in o) ? Ce(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, n);
    var s = a.options, l = s.container, u = s.events, c = s.checkWindowBlur;
    if (a._useDrag = u.indexOf("drag") > -1, a._useTouch = u.indexOf("touch") > -1, a._useMouse = u.indexOf("mouse") > -1, a.targets = i, a._useDrag && i.forEach(function(d) {
      Jt(d, "dragstart", a.onDragStart);
    }), a._useMouse && (i.forEach(function(d) {
      Jt(d, "mousedown", a.onDragStart), Jt(d, "mousemove", a._passCallback);
    }), Jt(l, "contextmenu", a._onContextMenu)), c && Jt(Ce(), "blur", a.onBlur), a._useTouch) {
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
      var i = new ni(Zn(r));
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
})(kn);
function Jd(t) {
  for (var e = 5381, r = t.length; r; )
    e = e * 33 ^ t.charCodeAt(--r);
  return e >>> 0;
}
var Qd = Jd;
function tp(t) {
  return Qd(t).toString(36);
}
function ep(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function rp(t, e, r) {
  return r.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(n, a) {
    var i = a.trim();
    return (i ? vr(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function np(t, e, r, n, a) {
  var i = Ie(n), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), r.nonce && o.setAttribute("nonce", r.nonce), o.innerHTML = rp(t, e, r), (a || i.head || i.body).appendChild(o), o;
}
function ou(t) {
  var e = "rCS" + tp(t);
  return {
    className: e,
    inject: function(r, n) {
      n === void 0 && (n = {});
      var a = ep(r), i = (a || r.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = np(e, t, n, r, a);
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
var Ni = function() {
  return Ni = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ni.apply(this, arguments);
};
function ap(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function su(t, e) {
  var r = ou(e), n = r.className;
  return et.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = ap(a, ["className", "cspNonce"]), u = et.useRef();
    return et.useImperativeHandle(i, function() {
      return u.current;
    }, []), et.useEffect(function() {
      var c = r.inject(u.current, {
        nonce: a.cspNonce
      });
      return function() {
        c.destroy();
      };
    }, []), et.createElement(t, Ni({
      ref: u,
      "data-styled-id": n,
      className: "".concat(s, " ").concat(n)
    }, l));
  });
}
var ji = function(t, e) {
  return ji = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, ji(t, e);
};
function _n(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  ji(t, e);
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
function ip(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
      e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function op(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function sp(t) {
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
function Tn(t, e) {
  return P({ events: [], props: [], name: t }, e);
}
var lp = ["n", "w", "s", "e"], vo = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function up(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function cp(t) {
  var e = up(1, t), r = Math.round(t / 45) * 45 % 180, n = "ns-resize";
  return r === 135 ? n = "nwse-resize" : r === 45 ? n = "nesw-resize" : r === 90 && (n = "ew-resize"), "cursor:".concat(n, ";cursor: url('").concat(e, "') 16 16, ").concat(n, ";");
}
var qr = rd(), lu = qr.browser.webkit, uu = lu && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), cu = qr.browser.name, fu = parseInt(qr.browser.version, 10), fp = cu === "chrome", dp = qr.browser.chromium, pp = parseInt(qr.browser.chromiumVersion, 10) || 0, hp = fp && fu >= 109 || dp && pp >= 109, vp = cu === "firefox", gp = parseInt(qr.browser.webkitVersion, 10) >= 612 || fu >= 15, go = "moveable-", mp = vo.map(function(t) {
  var e = "", r = "", n = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (r = "left: ".concat(i, ";"), n = "right"), t.indexOf("e") > -1 && (r = "left: 0px;", n = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(r).concat(e, `
        transform-origin: `).concat(n, " ").concat(a, `;
    }`);
}).join(`
`), xp = `
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
`.concat(mp, `
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
`).concat(cp(t), `
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

`).concat(uu ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), yp = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], Ai = 1e-4, ce = 1e-7, Jn = 1e-9, zi = Math.pow(10, 10), Ns = -zi, bp = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, mo = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, du = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, Sp = [
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
function In(t, e, r, n, a, i) {
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
  var a = t.length === 16, i = a ? 4 : 3, o = wr(t, r, n, i), s = N(o, 4), l = N(s[0], 2), u = l[0], c = l[1], f = N(s[1], 2), d = f[0], h = f[1], v = N(s[2], 2), g = v[0], x = v[1], y = N(s[3], 2), S = y[0], w = y[1], E = N(Ft(t, e, i), 2), M = E[0], D = E[1], k = Math.min(u, d, g, S), T = Math.min(c, h, x, w), m = Math.max(u, d, g, S), _ = Math.max(c, h, x, w);
  u = u - k || 0, d = d - k || 0, g = g - k || 0, S = S - k || 0, c = c - T || 0, h = h - T || 0, x = x - T || 0, w = w - T || 0, M = M - k || 0, D = D - T || 0;
  var j = t[0], O = t[i + 1], R = le(j * O);
  return {
    left: k,
    top: T,
    right: m,
    bottom: _,
    origin: [M, D],
    pos1: [u, c],
    pos2: [d, h],
    pos3: [g, x],
    pos4: [S, w],
    direction: R
  };
}
function pu(t, e) {
  var r = e.clientX, n = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, u = i.pos1, c = o.left, f = o.top, d = l ? 4 : 3, h = N(mt(Xr(s, [r - c, n - f], d), u), 2), v = h[0], g = h[1], x = N(Fe({ datas: a, distX: v, distY: g }), 2), y = x[0], S = x[1];
  return [y, S];
}
function Cr(t, e) {
  var r = e.datas, n = t.state, a = n.allMatrix, i = n.beforeMatrix, o = n.is3d, s = n.left, l = n.top, u = n.origin, c = n.offsetMatrix, f = n.targetMatrix, d = n.transformOrigin, h = o ? 4 : 3;
  r.is3d = o, r.matrix = a, r.targetMatrix = f, r.beforeMatrix = i, r.offsetMatrix = c, r.transformOrigin = d, r.inverseMatrix = Pe(a, h), r.inverseBeforeMatrix = Pe(i, h), r.absoluteOrigin = xr(It([s, l], u), h), r.startDragBeforeDist = oe(r.inverseBeforeMatrix, r.absoluteOrigin, h), r.startDragDist = oe(r.inverseMatrix, r.absoluteOrigin, h);
}
function Cp(t) {
  return Br(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function Ra(t, e, r) {
  var n = e.datas, a = e.originalDatas.beforeRenderable, i = n.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, u = -1;
  i === -1 ? (r === "translate" ? u = 0 : r === "rotate" && (u = qe(o, function(h) {
    return h.match(/scale\(/g);
  })), u === -1 && (u = o.length), n.transformIndex = u) : xe(l, function(h) {
    return h.index === i && h.functionName === r;
  }) ? u = i : u = i + l.filter(function(h) {
    return h.index < i;
  }).length;
  var c = Vh(o, t.state, u), f = c.targetFunction, d = r === "rotate" ? "rotateZ" : r;
  n.beforeFunctionTexts = c.beforeFunctionTexts, n.afterFunctionTexts = c.afterFunctionTexts, n.beforeTransform = c.beforeFunctionMatrix, n.beforeTransform2 = c.beforeFunctionMatrix2, n.targetTansform = c.targetFunctionMatrix, n.afterTransform = c.afterFunctionMatrix, n.afterTransform2 = c.afterFunctionMatrix2, n.targetAllTransform = c.allFunctionMatrix, f.functionName === d ? (n.afterFunctionTexts.splice(0, 1), n.isAppendTransform = !1) : s > u && (n.isAppendTransform = !0, a.nextTransformAppendedIndexes = Q(Q([], N(l), !1), [{
    functionName: r,
    index: u,
    isAppend: !0
  }], !1));
}
function Pa(t, e, r) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? r : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function wp(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = N(vu({ datas: e, distX: r, distY: n }), 2), i = a[0], o = a[1], s = hu(e, Dd([i, o], 4));
  return oe(s, xr([0, 0, 0], 4), 4);
}
function hu(t, e, r) {
  var n = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = r ? jt(s, e, 4) : jt(e, s, 4), u = jt(Pe(r ? i : n, 4), l, 4), c = jt(u, Pe(r ? o : a, 4), 4);
  return c;
}
function vu(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return mt(oe(a, It(s, [r, n]), l), o);
}
function Fe(t, e) {
  var r = t.datas, n = t.distX, a = t.distY, i = r.inverseBeforeMatrix, o = r.inverseMatrix, s = r.is3d, l = r.startDragBeforeDist, u = r.startDragDist, c = r.absoluteOrigin, f = s ? 4 : 3;
  return mt(oe(e ? i : o, It(c, [n, a]), f), e ? l : u);
}
function Ep(t, e) {
  var r = t.datas, n = t.distX, a = t.distY;
  r.beforeMatrix;
  var i = r.matrix, o = r.is3d;
  r.startDragBeforeDist;
  var s = r.startDragDist, l = r.absoluteOrigin, u = o ? 4 : 3;
  return mt(oe(i, It(s, [n, a]), u), l);
}
function Dp(t, e, r, n, a, i) {
  return n === void 0 && (n = e), a === void 0 && (a = r), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = mr(o), u = l.value, c = l.unit, f = s ? a : n, d = s ? r : e;
    if (o === "%" || isNaN(u)) {
      var h = f ? i[s] / f : 0;
      return d * h;
    } else if (c !== "%")
      return u;
    return d * u / 100;
  }) : i;
}
function gu(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function Mp(t, e) {
  return gu(e).map(function(r) {
    return t[r];
  });
}
function ai(t, e) {
  var r = (e + 1) / 2;
  return [
    va(t[0][0], t[1][0], r, 1 - r),
    va(t[0][1], t[1][1], r, 1 - r)
  ];
}
function re(t, e) {
  var r = ai([t[0], t[1]], e[0]), n = ai([t[2], t[3]], e[0]);
  return ai([r, n], e[1]);
}
function kp(t, e, r, n, a, i) {
  var o = wr(e, r, n, a), s = re(o, i), l = t[0] - s[0], u = t[1] - s[1];
  return [l, u];
}
function Rn(t, e, r, n) {
  return jt(t, hn(e, n, r), n);
}
function _p(t, e, r, n) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (Ee(r)) {
    var u = e.beforeTransform, c = e.afterTransform;
    n ? l = Oe(Gr(r), 4, s) : l = Oe(jt(jt(u, Gr([r]), 4), c, 4), 4, s);
  } else
    l = r;
  return Rn(i, l, a, s);
}
function Tp(t, e) {
  var r = t.transformOrigin, n = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return Rn(n, jt(o || i, uo(e, s), s), r, s);
}
function Oa(t, e) {
  var r = Vr(e);
  return {
    setTransform: function(n, a) {
      a === void 0 && (a = -1), r.startTransforms = Ht(n) ? n : nr(n), Bi(t, e, a);
    },
    setTransformIndex: function(n) {
      Bi(t, e, n);
    }
  };
}
function Na(t, e, r) {
  var n = Vr(e), a = n.startTransforms;
  Bi(t, e, qe(a, function(i) {
    return i.indexOf("".concat(r, "(")) === 0;
  }));
}
function Bi(t, e, r) {
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
function xo(t, e) {
  var r = Vr(t);
  r.nextTransforms = nr(e);
}
function Vr(t) {
  return t.originalDatas.beforeRenderable;
}
function ba(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function Qn(t) {
  return (ba(t) || []).join(" ");
}
function ta(t) {
  return Vr(t).nextStyle;
}
function mu(t, e, r, n, a) {
  xo(a, e);
  var i = se.drag(t, In(a, t.state, r, n)), o = i ? i.transform : e;
  return P(P({ transform: e, drag: i }, ue({
    transform: o
  }, a)), { afterTransform: o });
}
function yo(t, e, r, n, a, i) {
  var o = _p(t.state, a, e, i), s = Pp(t, r, n, o);
  return s;
}
function xu(t, e, r, n, a, i, o) {
  var s = yo(t, e, r, a, i, o), l = t.state, u = l.left, c = l.top, f = t.props.groupable, d = f ? u : 0, h = f ? c : 0, v = mt(n, s);
  return mt(v, [d, h]);
}
function Ip(t, e, r, n, a, i, o) {
  var s = xu(t, e, r, n, a, i, o);
  return s;
}
function Rp(t, e, r) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    r ? -1 + t[1] / (r / 2) : 0
  ];
}
function Pp(t, e, r, n) {
  n === void 0 && (n = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, u = [
    i / 2 * (1 + e[0]) + r[0],
    o / 2 * (1 + e[1]) + r[1]
  ];
  return Ft(n, u, l);
}
function Op(t, e, r) {
  var n = r.fixedDirection, a = r.fixedPosition, i = r.fixedOffset;
  return xu(t, "rotate(".concat(e, "deg)"), n, a, i, r);
}
function Np(t, e, r, n, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, u = s.offsetMatrix, c = s.is3d, f = s.width, d = s.height, h = s.left, v = s.top, g = i.fixedDirection, x = i.nextTargetMatrix || s.targetMatrix, y = c ? 4 : 3, S = Dp(a, e, r, f, d, l), w = o ? h : 0, E = o ? v : 0, M = Rn(u, x, S, y), D = kp(n, M, e, r, y, g);
  return mt(D, [w, E]);
}
function jp(t, e) {
  return re(Me(t.state), e);
}
function Ap(t, e) {
  var r = t.targetGesto, n = t.controlGesto, a;
  return r != null && r.isFlag() && (a = r.getEventData()[e]), !a && (n != null && n.isFlag()) && (a = n.getEventData()[e]), a || {};
}
function zp(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function Bp(t) {
  var e = t("scale"), r = t("rotate"), n = t("translate"), a = [];
  return n && n !== "0px" && n !== "none" && a.push("translate(".concat(n.split(/\s+/).join(","), ")")), r && r !== "1" && r !== "none" && a.push("rotate(".concat(r, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function yu(t, e, r) {
  for (var n = t, a = [], i = lo(t) || or(t), o = !r && t === e || t === i, s = o, l = !1, u = 3, c, f, d, h = !1, v = wn(e, e, !0).offsetParent, g = 1; n && !s; ) {
    s = o;
    var x = he(n), y = x("position"), S = Yu(n), w = y === "fixed", E = Bp(x), M = Md(jh(S)), D = void 0, k = !1, T = !1, m = 0, _ = 0, j = 0, O = 0, R = {
      hasTransform: !1,
      fixedContainer: null
    };
    w && (h = !0, R = Fh(n), v = R.fixedContainer);
    var A = M.length;
    !l && (A === 16 || E.length) && (l = !0, u = 4, Xi(a), d && (d = Oe(d, 3, 4))), l && A === 9 && (M = Oe(M, 3, 4));
    var z = Gh(n, t), W = z.tagName, H = z.hasOffset, F = z.isSVG, q = z.origin, V = z.targetOrigin, L = z.offset, rt = N(L, 2), at = rt[0], Z = rt[1];
    W === "svg" && !n.ownerSVGElement && d && (a.push({
      type: "target",
      target: n,
      matrix: Lh(n, u)
    }), a.push({
      type: "offset",
      target: n,
      matrix: At(u)
    }));
    var nt = parseFloat(x("zoom")) || 1;
    if (w)
      D = R.fixedContainer, k = !0;
    else {
      var tt = wn(n, e, !1, !0, x), ot = tt.offsetZoom;
      if (D = tt.offsetParent, k = tt.isEnd, T = tt.isStatic, g *= ot, (tt.isCustomElement || ot !== 1) && T)
        at -= D.offsetLeft, Z -= D.offsetTop;
      else if (vp || hp) {
        var it = tt.parentSlotElement;
        if (it) {
          for (var ft = D, bt = 0, J = 0; ft && zp(ft); )
            bt += ft.offsetLeft, J += ft.offsetTop, ft = ft.offsetParent;
          at -= bt, Z -= J;
        }
      }
    }
    if (lu && !gp && H && !F && T && (y === "relative" || y === "static") && (at -= D.offsetLeft, Z -= D.offsetTop, o = o || k), w)
      H && R.hasTransform && (j = D.clientLeft, O = D.clientTop);
    else if (H && v !== D && (m = D.clientLeft, _ = D.clientTop), H && D === i) {
      var lt = Xu(n, !1);
      at += lt[0], Z += lt[1];
    }
    if (a.push({
      type: "target",
      target: n,
      matrix: hn(M, u, q)
    }), E.length && (a.push({
      type: "offset",
      target: n,
      matrix: At(u)
    }), a.push({
      type: "target",
      target: n,
      matrix: hn(Gr(E), u, q)
    })), H) {
      var wt = n === t, pt = wt ? 0 : n.scrollLeft, ht = wt ? 0 : n.scrollTop;
      a.push({
        type: "offset",
        target: n,
        matrix: yr([
          at - pt + m - j,
          Z - ht + _ - O
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
      matrix: hn(uo([nt, nt], u), u, [0, 0])
    }), d || (d = M), c || (c = q), f || (f = V), s || w)
      break;
    n = D, o = k, (!r || n === i) && (s = o);
  }
  return d || (d = At(u)), c || (c = [0, 0]), f || (f = [0, 0]), {
    zoom: g,
    offsetContainer: v,
    matrixes: a,
    targetMatrix: d,
    transformOrigin: c,
    targetOrigin: f,
    is3d: l,
    hasFixed: h
  };
}
var fr = null, dr = null, Nr = null;
function Wr(t) {
  t ? (window.Map && (fr = /* @__PURE__ */ new Map(), dr = /* @__PURE__ */ new Map()), Nr = []) : (fr = null, Nr = null, dr = null);
}
function Gp(t) {
  var e = dr == null ? void 0 : dr.get(t);
  if (e)
    return e;
  var r = vn(t, !0);
  return dr && dr.set(t, r), r;
}
function Fp(t, e) {
  if (Nr) {
    var r = xe(Nr, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (r)
      return r[1];
  }
  var n = yu(t, e, !0);
  return Nr && Nr.push([[t, e], n]), n;
}
function he(t) {
  var e = fr == null ? void 0 : fr.get(t);
  if (!e) {
    var r = Ce(t).getComputedStyle(t);
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
function Re(t, e, r) {
  var n = r.originalDatas;
  n.groupable = n.groupable || {};
  var a = n.groupable;
  a.childDatas = a.childDatas || [];
  var i = a.childDatas;
  return t.moveables.map(function(o, s) {
    return i[s] = i[s] || {}, i[s][e] = i[s][e] || {}, P(P({}, r), { isRequestChild: !0, datas: i[s][e], originalDatas: i[s] });
  });
}
function ii(t, e, r, n, a, i, o) {
  var s = !!r.match(/Start$/g), l = !!r.match(/End$/g), u = a.isPinch, c = a.datas, f = Re(t, e.name, a), d = t.moveables, h = [], v = f.map(function(g, x) {
    var y = d[x], S = y.state, w = S.gestos, E = g;
    if (s)
      E = new Lr(o).dragStart(n, g), h.push(E);
    else {
      if (w[o] || (w[o] = c.childGestos[x]), !w[o])
        return;
      E = In(g, S, n, u, i, o), h.push(E);
    }
    var M = e[r](y, P(P({}, E), { parentFlag: !0 }));
    return l && (w[o] = null), M;
  });
  return s && (c.childGestos = d.map(function(g) {
    return g.state.gestos[o];
  })), {
    eventParams: v,
    childEvents: h
  };
}
function $e(t, e, r, n, a, i) {
  a === void 0 && (a = function(c, f) {
    return f;
  });
  var o = !!r.match(/End$/g), s = Re(t, e.name, n), l = t.moveables, u = s.map(function(c, f) {
    var d = l[f], h = c;
    h = a(d, c);
    var v = e[r](d, P(P({}, h), { parentFlag: !0 }));
    return o && (d.state.gestos = {}), v;
  });
  return u;
}
function Sa(t, e, r, n) {
  var a = r.fixedDirection, i = r.fixedPosition, o = n.datas.startPositions || Me(e.state), s = re(o, a), l = N(oe(Mn(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), u = l[0], c = l[1];
  return n.datas.originalX = u, n.datas.originalY = c, n;
}
function bu(t, e, r, n) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = Sr(t.props, e).zoom, u = pn(o / Math.PI * 180), c = {}, f = t.renderState;
  f.renderDirectionMap || (f.renderDirectionMap = {});
  var d = f.renderDirectionMap;
  r.forEach(function(v) {
    var g = v.dir;
    c[g] = !0;
  });
  var h = le(s);
  return r.map(function(v) {
    var g = v.data, x = v.classNames, y = v.dir, S = mo[y];
    if (!S || !c[y])
      return null;
    d[y] = !0;
    var w = (St(u, 15) + h * du[y] + 720) % 180, E = {};
    return $r(g).forEach(function(M) {
      E["data-".concat(M)] = g[M];
    }), n.createElement("div", P({ className: gt.apply(void 0, Q(["control", "direction", y, e], N(x), !1)), "data-rotation": w, "data-direction": y }, E, { key: "direction-".concat(y), style: Da.apply(void 0, Q([o, l], N(S.map(function(M) {
      return i[M];
    })), !1)) }));
  });
}
function Su(t, e, r, n) {
  var a = Sr(t.props, r), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? vo : o;
  return Q(Q([], N(s ? Du(t, n, r, l) : []), !1), N(bu(t, r, l.map(function(u) {
    return {
      data: {},
      classNames: [],
      dir: u
    };
  }), n)), !1);
}
function Cn(t, e, r, n, a, i) {
  for (var o = [], s = 6; s < arguments.length; s++)
    o[s - 6] = arguments[s];
  var l = $t(r, n), u = e ? St(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: gt.apply(void 0, Q(["line", "direction", e ? "edge" : "", e], N(o), !1)), "data-rotation": u, "data-line-key": i, "data-direction": e, style: un(r, n, a, l) });
}
function Cu(t, e, r, n, a) {
  var i = r === !0 ? lp : r;
  return i.map(function(o, s) {
    var l = N(mo[o], 2), u = l[0], c = l[1];
    if (c != null)
      return Cn(t, o, n[u], n[c], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function wu(t) {
  return function(e, r) {
    var n = Sr(e.props, t).edge;
    return n && (n === !0 || n.length) ? Q(Q([], N(Cu(r, t, n, e.getState().renderPoses, e.props.zoom)), !1), N(Lp(e, t, r)), !1) : Eu(e, t, r);
  };
}
function Eu(t, e, r) {
  return Su(t, vo, e, r);
}
function Lp(t, e, r) {
  return Su(t, ["nw", "ne", "sw", "se"], e, r);
}
function Du(t, e, r, n) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, u = a.renderDirectionMap, c = t.props.zoom, f = le(l), d = s / Math.PI * 180;
  return (n || $r(u)).map(function(h) {
    var v = mo[h];
    if (!v)
      return null;
    var g = (St(d, 15) + f * du[h] + 720) % 180, x = ["around-control"];
    return r && x.push("direction", r), e.createElement("div", { className: gt.apply(void 0, Q([], N(x), !1)), "data-rotation": g, "data-direction": h, key: "direction-around-".concat(h), style: Da.apply(void 0, Q([s, c], N(v.map(function(y) {
      return o[y];
    })), !1)) });
  });
}
function bo(t, e, r) {
  var n = t || {}, a = n.position, i = a === void 0 ? "client" : a, o = n.left, s = o === void 0 ? -1 / 0 : o, l = n.top, u = l === void 0 ? -1 / 0 : l, c = n.right, f = c === void 0 ? 1 / 0 : c, d = n.bottom, h = d === void 0 ? 1 / 0 : d, v = {
    position: i,
    left: s,
    top: u,
    right: f,
    bottom: h
  };
  return {
    vertical: js(v, e, !0),
    horizontal: js(v, r, !1)
  };
}
function ja(t, e) {
  var r = t.state, n = r.containerClientRect, a = n.clientHeight, i = n.clientWidth, o = n.clientLeft, s = n.clientTop, l = r.snapOffset, u = l.left, c = l.top, f = l.right, d = l.bottom, h = e || t.props.bounds || {}, v = h.position || "client", g = v === "css", x = h.left, y = x === void 0 ? -1 / 0 : x, S = h.top, w = S === void 0 ? -1 / 0 : S, E = h.right, M = E === void 0 ? g ? -1 / 0 : 1 / 0 : E, D = h.bottom, k = D === void 0 ? g ? -1 / 0 : 1 / 0 : D;
  return g && (M = i + f - u - M, k = a + d - c - k), {
    left: y + u - o,
    right: M + u - o,
    top: w + c - s,
    bottom: k + c - s
  };
}
function Wp(t, e, r) {
  var n = ja(t), a = n.left, i = n.top, o = n.right, s = n.bottom, l = N(r, 2), u = l[0], c = l[1], f = N(mt(r, e), 2), d = f[0], h = f[1];
  X(d) < ce && (d = 0), X(h) < ce && (h = 0);
  var v = h > 0, g = d > 0, x = {
    isBound: !1,
    offset: 0,
    pos: 0
  }, y = {
    isBound: !1,
    offset: 0,
    pos: 0
  };
  if (d === 0 && h === 0)
    return {
      vertical: x,
      horizontal: y
    };
  if (d === 0)
    v ? s < c && (y.pos = s, y.offset = c - s) : i > c && (y.pos = i, y.offset = c - i);
  else if (h === 0)
    g ? o < u && (x.pos = o, x.offset = u - o) : a > u && (x.pos = a, x.offset = u - a);
  else {
    var S = h / d, w = r[1] - S * u, E = 0, M = 0, D = !1;
    g && o <= u ? (E = S * o + w, M = o, D = !0) : !g && u <= a && (E = S * a + w, M = a, D = !0), D && (E < i || E > s) && (D = !1), D || (v && s <= c ? (E = s, M = (E - w) / S, D = !0) : !v && c <= i && (E = i, M = (E - w) / S, D = !0)), D && (x.isBound = !0, x.pos = M, x.offset = u - M, y.isBound = !0, y.pos = E, y.offset = c - E);
  }
  return {
    vertical: x,
    horizontal: y
  };
}
function js(t, e, r) {
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
    return X(u.offset) - X(l.offset);
  });
}
function As(t, e, r) {
  var n = r ? t.map(function(a) {
    return Dn(a, r);
  }) : t;
  return n.some(function(a) {
    return a[0] < e.left && X(a[0] - e.left) > 0.1 || a[0] > e.right && X(a[0] - e.right) > 0.1 || a[1] < e.top && X(a[1] - e.top) > 0.1 || a[1] > e.bottom && X(a[1] - e.bottom) > 0.1;
  });
}
function Yp(t, e, r) {
  var n = De(t), a = Math.sqrt(n * n - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return X(i - t[r ? 0 : 1]) - X(o - t[r ? 0 : 1]);
  }).map(function(i) {
    return $t([0, 0], r ? [i, e] : [e, i]);
  });
}
function Xp(t, e, r, n, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = ja(t), s = o.left, l = o.top, u = o.right, c = o.bottom, f = s - n[0], d = u - n[0], h = l - n[1], v = c - n[1], g = {
    left: f,
    top: h,
    right: d,
    bottom: v
  };
  if (!As(r, g, 0))
    return [];
  var x = [];
  return [
    [f, 0],
    [d, 0],
    [h, 1],
    [v, 1]
  ].forEach(function(y) {
    var S = N(y, 2), w = S[0], E = S[1];
    r.forEach(function(M) {
      var D = $t([0, 0], M);
      x.push.apply(x, Q([], N(Yp(M, w, E).map(function(k) {
        return i + k - D;
      }).filter(function(k) {
        return !As(e, g, k);
      }).map(function(k) {
        return St(k * 180 / Math.PI, ce);
      })), !1));
    });
  }), x;
}
var Hp = ["left", "right", "center"], $p = ["top", "bottom", "middle"], zs = {
  left: "start",
  right: "end",
  center: "center",
  top: "start",
  bottom: "end",
  middle: "center"
}, ar = {
  start: "left",
  end: "right",
  center: "center"
}, ir = {
  start: "top",
  end: "bottom",
  center: "middle"
};
function jr() {
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
function So(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function qp(t, e) {
  var r = So(t), n = {};
  for (var a in r)
    a in e && r[a] && (n[a] = e[a]);
  return n;
}
function Co(t, e) {
  var r = qp(t, e), n = $p.filter(function(i) {
    return i in r;
  }), a = Hp.filter(function(i) {
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
function Vp(t, e, r) {
  var n = Ft(t, [e.clientLeft, e.clientTop], r);
  return [
    e.left + n[0],
    e.top + n[1]
  ];
}
function Up(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  Math.abs(a) < Qt && (a = 0), Math.abs(i) < Qt && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * r[0] - r[1]) : (s = 1, l = -r[1]) : (o = -1, l = r[0]), [o, s, l].map(function(u) {
    return St(u, Qt);
  });
}
var Mu = "snapRotationThreshold", ku = "snapRotationDegrees", _u = "snapHorizontalThreshold", Tu = "snapVerticalThreshold";
function Aa(t, e, r, n, a, i, o) {
  var s;
  n === void 0 && (n = []), a === void 0 && (a = []);
  var l = t.props, u = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], c = Js(o, l[_u], 5), f = Js(i, l[Tu], 5);
  return Iu(t.state.guidelines, e, r, n, a, c, f, u);
}
function Iu(t, e, r, n, a, i, o, s) {
  return {
    vertical: Gs(t, "vertical", e, o * s[0], n),
    horizontal: Gs(t, "horizontal", r, i * s[1], a)
  };
}
function Kp(t, e, r) {
  var n = N(r, 2), a = n[0], i = n[1], o = N(e, 2), s = o[0], l = o[1], u = N(mt(r, e), 2), c = u[0], f = u[1], d = f > 0, h = c > 0;
  c = Ma(c), f = Ma(f);
  var v = {
    isSnap: !1,
    offset: 0,
    pos: 0
  }, g = {
    isSnap: !1,
    offset: 0,
    pos: 0
  };
  if (c === 0 && f === 0)
    return {
      vertical: v,
      horizontal: g
    };
  var x = Aa(t, c ? [a] : [], f ? [i] : [], [], [], void 0, void 0), y = x.vertical, S = x.horizontal;
  y.posInfos.filter(function(W) {
    var H = W.pos;
    return h ? H >= s : H <= s;
  }), S.posInfos.filter(function(W) {
    var H = W.pos;
    return d ? H >= l : H <= l;
  }), y.isSnap = y.posInfos.length > 0, S.isSnap = S.posInfos.length > 0;
  var w = Gi(y), E = w.isSnap, M = w.guideline, D = Gi(S), k = D.isSnap, T = D.guideline, m = k ? T.pos[1] : 0, _ = E ? M.pos[0] : 0;
  if (c === 0)
    k && (g.isSnap = !0, g.pos = T.pos[1], g.offset = i - g.pos);
  else if (f === 0)
    E && (v.isSnap = !0, v.pos = _, v.offset = a - _);
  else {
    var j = f / c, O = r[1] - j * a, R = 0, A = 0, z = !1;
    E ? (A = _, R = j * A + O, z = !0) : k && (R = m, A = (R - O) / j, z = !0), z && (v.isSnap = !0, v.pos = A, v.offset = a - A, g.isSnap = !0, g.pos = R, g.offset = i - R);
  }
  return {
    vertical: v,
    horizontal: g
  };
}
function tr(t) {
  var e = "";
  return t === -1 || t === "top" || t === "left" ? e = "start" : t === 0 || t === "center" || t === "middle" ? e = "center" : (t === 1 || t === "right" || t === "bottom") && (e = "end"), e;
}
function Bs(t, e, r, n) {
  var a = Co(t.props.snapDirections, e), i = Aa(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return tr(l);
  }), a.horizontalNames.map(function(l) {
    return tr(l);
  }), r, n), o = tr(a.horizontalNames[i.horizontal.index]), s = tr(a.verticalNames[i.vertical.index]);
  return {
    vertical: P(P({}, i.vertical), { direction: s }),
    horizontal: P(P({}, i.horizontal), { direction: o })
  };
}
function Gi(t) {
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
function Gs(t, e, r, n, a) {
  var i, o;
  if (a === void 0 && (a = []), !t || !t.length)
    return {
      isSnap: !1,
      index: -1,
      direction: "",
      posInfos: []
    };
  var s = e === "vertical", l = s ? 0 : 1, u = r.map(function(f, d) {
    var h = a[d] || "", v = t.map(function(g) {
      var x = g.pos, y = f - x[l];
      return {
        offset: y,
        dist: X(y),
        guideline: g,
        direction: h
      };
    }).filter(function(g) {
      var x = g.guideline, y = g.dist, S = x.type;
      return !(S !== e || y > n);
    }).sort(function(g, x) {
      return g.dist - x.dist;
    });
    return {
      pos: f,
      index: d,
      guidelineInfos: v,
      direction: h
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
function Zp(t, e, r, n, a) {
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
  ].forEach(function(d, h, v) {
    var g = v[h + 1] || v[0];
    i.push(d), i.push([
      (d[0] + g[0]) / 2,
      (d[1] + g[1]) / 2
    ]);
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], r) : (i.push.apply(i, Q([], N(Mp([
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
  }), u = Aa(t, s, l, i.map(function(d) {
    return tr(d[0]);
  }), i.map(function(d) {
    return tr(d[1]);
  }), n, a), c = tr(i.map(function(d) {
    return d[0];
  })[u.vertical.index]), f = tr(i.map(function(d) {
    return d[1];
  })[u.horizontal.index]);
  return {
    vertical: P(P({}, u.vertical), { direction: c }),
    horizontal: P(P({}, u.horizontal), { direction: f })
  };
}
function Ru(t, e) {
  var r = X(t.offset), n = X(e.offset);
  return t.isBound && e.isBound ? n - r : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? n - r : t.isSnap ? -1 : e.isSnap || r < ce ? 1 : n < ce ? -1 : r - n;
}
function Ca(t, e) {
  return t.slice().sort(function(r, n) {
    var a = r.sign[e], i = n.sign[e], o = r.offset[e], s = n.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return Ru({ isBound: r.isBound, isSnap: r.isSnap, offset: o }, { isBound: n.isBound, isSnap: n.isSnap, offset: s });
  })[0];
}
function Jp(t, e, r) {
  var n = [];
  if (r)
    X(e[0]) !== 1 || X(e[1]) !== 1 ? n.push([e, [-1, -1]], [e, [-1, 1]], [e, [1, -1]], [e, [1, 1]]) : n.push([e, [t[0], -t[1]]], [e, [-t[0], t[1]]]), n.push([e, t]);
  else if (t[0] && t[1] || !t[0] && !t[1]) {
    var a = t[0] ? t : [1, 1];
    [1, -1].forEach(function(o) {
      [1, -1].forEach(function(s) {
        var l = [o * a[0], s * a[1]];
        e[0] === l[0] && e[1] === l[1] || n.push([e, l]);
      });
    });
  } else if (t[0]) {
    var i = X(e[0]) === 1 ? [1] : [1, -1];
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
    var i = X(e[1]) === 1 ? [1] : [1, -1];
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
function Pu(t, e) {
  var r = Di([e[0][0], e[1][0]]), n = Di([e[0][1], e[1][1]]);
  return {
    vertical: r <= t[0],
    horizontal: n <= t[1]
  };
}
function wo(t, e) {
  var r = N(e, 2), n = r[0], a = r[1], i = a[0] - n[0], o = a[1] - n[1];
  X(i) < ce && (i = 0), X(o) < ce && (o = 0);
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
function Ou(t, e, r, n) {
  return n === void 0 && (n = ce), t.every(function(a) {
    var i = wo(a, e), o = i <= 0;
    return o === r || X(i) <= n;
  });
}
function Fs(t, e, r, n, a) {
  return a === void 0 && (a = 0), n && e - a <= t || !n && t <= r + a ? {
    isBound: !0,
    offset: n ? e - t : r - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function Qp(t, e) {
  var r = e.line, n = e.centerSign, a = e.verticalSign, i = e.horizontalSign, o = e.lineConstants, s = t.props.innerBounds;
  if (!s)
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var l = s.left, u = s.top, c = s.width, f = s.height, d = [[l, u], [l, u + f]], h = [[l, u], [l + c, u]], v = [[l + c, u], [l + c, u + f]], g = [[l, u + f], [l + c, u + f]];
  if (Ou([
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
  var x = er(r, o, h, a), y = er(r, o, g, a), S = er(r, o, d, i), w = er(r, o, v, i), E = x.isBound && y.isBound, M = x.isBound || y.isBound, D = S.isBound && w.isBound, k = S.isBound || w.isBound, T = Yr(x.offset, y.offset), m = Yr(S.offset, w.offset), _ = [0, 0], j = !1, O = !1;
  return X(m) < X(T) ? (_ = [T, 0], j = M, O = E) : (_ = [0, m], j = k, O = D), {
    isAllBound: O,
    isVerticalBound: M,
    isHorizontalBound: k,
    isBound: j,
    offset: _
  };
}
function er(t, e, r, n, a, i) {
  var o = N(e, 2), s = o[0], l = o[1], u = t[0], c = r[0], f = r[1], d = Ma(f[1] - c[1]), h = Ma(f[0] - c[0]), v = l, g = s, x = -s / l;
  if (h) {
    if (!d) {
      if (i && !v)
        return {
          isBound: !1,
          offset: 0
        };
      if (g) {
        var E = (c[1] - u[1]) / x + u[0];
        return Fs(E, c[0], f[0], n, a);
      } else {
        var S = c[1] - u[1], w = X(S) <= (a || 0);
        return {
          isBound: w,
          offset: w ? S : 0
        };
      }
    }
  } else {
    if (i && !g)
      return {
        isBound: !1,
        offset: 0
      };
    if (v) {
      var y = x * (c[0] - u[0]) + u[1];
      return Fs(y, c[1], f[1], n, a);
    } else {
      var S = c[0] - u[0], w = X(S) <= (a || 0);
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
function Nu(t, e, r) {
  return e.map(function(n) {
    var a = Qp(t, n), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, u = n.multiple, c = Fe({
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
function th(t, e, r) {
  var n, a = Eo(t, e, [0, 0], !1).map(function(d) {
    return P(P({}, d), { multiple: d.multiple.map(function(h) {
      return X(h) * 2;
    }) });
  }), i = Nu(t, a, r), o = Ca(i, 0), s = Ca(i, 1), l = 0, u = 0, c = o.isVerticalBound || s.isVerticalBound, f = o.isHorizontalBound || s.isHorizontalBound;
  return (c || f) && (n = N(Ep({
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
function eh(t, e) {
  var r = [], n = t[0], a = t[1];
  return n && a ? r.push([[0, a * 2], t, [-n, a]], [[n * 2, 0], t, [n, -a]]) : n ? (r.push([[n * 2, 0], [n, 1], [n, -1]]), e && r.push([[0, -1], [n, -1], [-n, -1]], [[0, 1], [n, 1], [-n, 1]])) : a ? (r.push([[0, a * 2], [1, a], [-1, a]]), e && r.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : r.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), r;
}
function Eo(t, e, r, n) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = wr(i, 100, 100, o ? 4 : 3), l = re(s, [0, 0]);
  return eh(r, n).map(function(u) {
    var c = N(u, 3), f = c[0], d = c[1], h = c[2], v = [
      re(s, d),
      re(s, h)
    ], g = Up(v), x = Pu(l, v), y = x.vertical, S = x.horizontal, w = wo(l, v) <= 0;
    return {
      multiple: f,
      centerSign: w,
      verticalSign: y,
      horizontalSign: S,
      lineConstants: g,
      line: [
        re(e, d),
        re(e, h)
      ]
    };
  });
}
function Ls(t, e, r, n) {
  var a = n ? t.map(function(i) {
    return Dn(i, n);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = wo(r, i) <= 0;
    return !Ou(e, i, o);
  });
}
function rh(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  if (!a)
    return X(r[0]);
  if (!i)
    return X(r[1]);
  var o = i / a;
  return X((-o * r[0] + r[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function nh(t) {
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
function ah(t, e, r, n, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, u = i.width, c = i.height, f = s - n[0], d = s + u - n[0], h = l - n[1], v = l + c - n[1], g = [
    [f, h],
    [d, h],
    [f, v],
    [d, v]
  ], x = re(r, [0, 0]);
  if (!Ls(r, g, x, 0))
    return [];
  var y = [], S = g.map(function(w) {
    return [
      De(w),
      $t([0, 0], w)
    ];
  });
  return [
    [r[0], r[1]],
    [r[1], r[3]],
    [r[3], r[2]],
    [r[2], r[0]]
  ].forEach(function(w) {
    var E = $t([0, 0], nh(w)), M = rh(w);
    y.push.apply(y, Q([], N(S.filter(function(D) {
      var k = N(D, 1), T = k[0];
      return T && M <= T;
    }).map(function(D) {
      var k = N(D, 2), T = k[0], m = k[1], _ = Math.acos(T ? M / T : 0), j = m + _, O = m - _;
      return [
        o + j - E,
        o + O - E
      ];
    }).reduce(function(D, k) {
      return D.push.apply(D, Q([], N(k), !1)), D;
    }, []).filter(function(D) {
      return !Ls(e, g, x, D);
    }).map(function(D) {
      return St(D * 180 / Math.PI, ce);
    })), !1));
  }), y;
}
function ih(t) {
  var e = t.props.innerBounds, r = jr();
  if (!e)
    return {
      boundMap: r,
      vertical: [],
      horizontal: []
    };
  var n = t.getRect(), a = n.pos1, i = n.pos2, o = n.pos3, s = n.pos4, l = [a, i, o, s], u = re(l, [0, 0]), c = e.left, f = e.top, d = e.width, h = e.height, v = [[c, f], [c, f + h]], g = [[c, f], [c + d, f]], x = [[c + d, f], [c + d, f + h]], y = [[c, f + h], [c + d, f + h]], S = Eo(t, l, [0, 0], !1), w = [], E = [];
  return S.forEach(function(M) {
    var D = M.line, k = M.lineConstants, T = Pu(u, D), m = T.horizontal, _ = T.vertical, j = er(D, k, g, _, 1, !0), O = er(D, k, y, _, 1, !0), R = er(D, k, v, m, 1, !0), A = er(D, k, x, m, 1, !0);
    j.isBound && !r.top && (w.push(f), r.top = !0), O.isBound && !r.bottom && (w.push(f + h), r.bottom = !0), R.isBound && !r.left && (E.push(c), r.left = !0), A.isBound && !r.right && (E.push(c + d), r.right = !0);
  }), {
    boundMap: r,
    horizontal: w,
    vertical: E
  };
}
function oh(t, e, r, n) {
  var a = e[0] - t[0], i = e[1] - t[1];
  if (X(a) < Qt && (a = 0), X(i) < Qt && (i = 0), !a)
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
function Fi(t, e, r, n, a) {
  var i = oh(t, e, r, n);
  if (!i)
    return {
      isOutside: !1,
      offset: [0, 0]
    };
  var o = Be(t, e), s = Be(i, t), l = Be(i, e), u = s > o || l > o, c = N(Fe({
    datas: a,
    distX: i[0],
    distY: i[1]
  }), 2), f = c[0], d = c[1];
  return {
    offset: [f, d],
    isOutside: u
  };
}
function wa(t, e) {
  return t.isBound ? t.offset : e.isSnap ? Gi(e).offset : 0;
}
function sh(t, e, r, n, a) {
  var i = N(e, 2), o = i[0], s = i[1], l = N(r, 2), u = l[0], c = l[1], f = N(n, 2), d = f[0], h = f[1], v = N(a, 2), g = v[0], x = v[1], y = -g, S = -x;
  if (t && o && s) {
    y = 0, S = 0;
    var w = [];
    if (u && c ? w.push([0, x], [g, 0]) : u ? w.push([g, 0]) : c ? w.push([0, x]) : d && h ? w.push([0, x], [g, 0]) : d ? w.push([g, 0]) : h && w.push([0, x]), w.length) {
      w.sort(function(k, T) {
        return De(mt([o, s], k)) - De(mt([o, s], T));
      });
      var E = w[0];
      if (E[0] && X(o) > Qt)
        y = -E[0], S = s * X(o + y) / X(o) - s;
      else if (E[1] && X(s) > Qt) {
        var M = s;
        S = -E[1], y = o * X(s + S) / X(M) - o;
      }
      if (t && c && u)
        if (X(y) > Qt && X(y) < X(g)) {
          var D = X(g) / X(y);
          y *= D, S *= D;
        } else if (X(S) > Qt && X(S) < X(x)) {
          var D = X(x) / X(S);
          y *= D, S *= D;
        } else
          y = Yr(-g, y), S = Yr(-x, S);
    }
  } else
    y = o || u ? -g : 0, S = s || c ? -x : 0;
  return [y, S];
}
function lh(t, e, r, n, a, i) {
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
  var o = ko(i.absolutePoses, [e, r]), s = we(o), l = s.left, u = s.right, c = s.top, f = s.bottom, d = {
    horizontal: o.map(function(A) {
      return A[1];
    }),
    vertical: o.map(function(A) {
      return A[0];
    })
  }, h = So(t.props.snapDirections), v = Co(h, {
    left: l,
    right: u,
    top: c,
    bottom: f,
    center: (l + u) / 2,
    middle: (c + f) / 2
  }), g = za(t, a, v, d), x = g.vertical, y = g.horizontal, S = th(t, o, i), w = S.vertical, E = S.horizontal, M = x.isSnap, D = y.isSnap, k = x.isBound || w.isBound, T = y.isBound || E.isBound, m = Yr(x.offset, w.offset), _ = Yr(y.offset, E.offset), j = N(sh(n, [e, r], [k, T], [M, D], [m, _]), 2), O = j[0], R = j[1];
  return [
    {
      isBound: k,
      isSnap: M,
      offset: O
    },
    {
      isBound: T,
      isSnap: D,
      offset: R
    }
  ];
}
function za(t, e, r, n) {
  n === void 0 && (n = r);
  var a = bo(ja(t), n.vertical, n.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : Aa(t, r.vertical, r.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, u = s.vertical, c = wa(i[0], l), f = wa(o[0], u), d = X(c), h = X(f);
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
      dist: h,
      bounds: o,
      snap: u
    }
  };
}
function Ws(t, e, r, n, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = bo(e, r, n), l = s.horizontal, u = s.vertical, c = Iu(t, r, n, [], [], a, i, o), f = c.horizontal, d = c.vertical, h = wa(l[0], f), v = wa(u[0], d), g = X(h), x = X(v);
  return {
    horizontal: {
      isBound: l[0].isBound,
      isSnap: f.isSnap,
      snapIndex: f.index,
      offset: h,
      dist: g,
      bounds: l,
      snap: f
    },
    vertical: {
      isBound: u[0].isBound,
      isSnap: d.isSnap,
      snapIndex: d.index,
      offset: v,
      dist: x,
      bounds: u,
      snap: d
    }
  };
}
function uh(t, e, r, n) {
  var a = $t(t, e) / Math.PI * 180, i = r.vertical, o = i.isBound, s = i.isSnap, l = i.dist, u = r.horizontal, c = u.isBound, f = u.isSnap, d = u.dist, h = a % 180, v = h < 3 || h > 177, g = h > 87 && h < 93;
  return d < l && (o || s && !g && (!n || !v)) ? "vertical" : c || f && !v && (!n || !g) ? "horizontal" : "";
}
function ch(t, e, r, n, a, i) {
  return r.map(function(o) {
    var s = N(o, 2), l = s[0], u = s[1], c = re(e, l), f = re(e, u), d = n ? fh(t, c, f, a) : za(t, a, {
      vertical: [f[0]],
      horizontal: [f[1]]
    }), h = d.horizontal, v = h.offset, g = h.isBound, x = h.isSnap, y = d.vertical, S = y.offset, w = y.isBound, E = y.isSnap, M = mt(u, l);
    if (!S && !v)
      return {
        isBound: w || g,
        isSnap: E || x,
        sign: M,
        offset: [0, 0]
      };
    var D = uh(c, f, d, n);
    if (!D)
      return {
        sign: M,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var k = D === "vertical", T = [0, 0];
    return !n && X(u[0]) === 1 && X(u[1]) === 1 && l[0] !== u[0] && l[1] !== u[1] ? T = Fe({
      datas: i,
      distX: -S,
      distY: -v
    }) : T = Fi(c, f, -(k ? S : v), k, i).offset, T = T.map(function(m, _) {
      return m * (M[_] ? 2 / M[_] : 0);
    }), {
      sign: M,
      isBound: k ? w : g,
      isSnap: k ? E : x,
      offset: T
    };
  });
}
function Ys(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function fh(t, e, r, n) {
  var a = Wp(t, e, r), i = a.horizontal, o = a.vertical, s = n ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : Kp(t, e, r), l = s.horizontal, u = s.vertical, c = Ys(i, l), f = Ys(o, u), d = X(c), h = X(f);
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
      dist: h
    }
  };
}
function dh(t, e, r, n, a) {
  var i = [-r[0], -r[1]], o = t.state, s = o.width, l = o.height, u = t.props.bounds, c = 1 / 0, f = 1 / 0;
  if (u) {
    var d = [
      [r[0], -r[1]],
      [-r[0], r[1]]
    ], h = u.left, v = h === void 0 ? -1 / 0 : h, g = u.top, x = g === void 0 ? -1 / 0 : g, y = u.right, S = y === void 0 ? 1 / 0 : y, w = u.bottom, E = w === void 0 ? 1 / 0 : w;
    d.forEach(function(M) {
      var D = M[0] !== i[0], k = M[1] !== i[1], T = re(e, M), m = $t(n, T) * 360 / Math.PI;
      if (k) {
        var _ = T.slice();
        (X(m - 360) < 2 || X(m - 180) < 2) && (_[1] = n[1]);
        var j = Fi(n, _, (n[1] < T[1] ? E : x) - T[1], !1, a), O = N(j.offset, 2), R = O[1], A = j.isOutside;
        isNaN(R) || (f = l + (A ? 1 : -1) * X(R));
      }
      if (D) {
        var _ = T.slice();
        (X(m - 90) < 2 || X(m - 270) < 2) && (_[0] = n[0]);
        var z = Fi(n, _, (n[0] < T[0] ? S : v) - T[0], !0, a), W = N(z.offset, 1), H = W[0], F = z.isOutside;
        isNaN(H) || (c = s + (F ? 1 : -1) * X(H));
      }
    });
  }
  return {
    maxWidth: c,
    maxHeight: f
  };
}
var se = {
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
    var c = De(u), f = $t(u, [0, 0]);
    return [e.createElement("div", { className: gt("line", "horizontal", "dragline", "dashed"), key: "dragRotateGuideline", style: {
      width: "".concat(c, "px"),
      transform: "translate(".concat(l[0], "px, ").concat(l[1], "px) rotate(").concat(f, "rad) scaleY(").concat(i, ")")
    } })];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.parentEvent, a = e.parentGesto, i = t.state, o = i.gestos, s = i.style;
    if (o.draggable)
      return !1;
    o.draggable = a || t.targetGesto, r.datas = {}, r.left = parseFloat(s.left || "") || 0, r.top = parseFloat(s.top || "") || 0, r.bottom = parseFloat(s.bottom || "") || 0, r.right = parseFloat(s.right || "") || 0, r.startValue = [0, 0], Cr(t, e), Na(t, e, "translate"), Rh(t, r), r.prevDist = [0, 0], r.prevBeforeDist = [0, 0], r.isDrag = !1, r.deltaOffset = [0, 0];
    var l = Et(t, e, P({ set: function(c) {
      r.startValue = c;
    } }, Oa(t, e))), u = n || ct(t, "onDragStart", l);
    return u !== !1 ? (r.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, r.isPinch = !1), r.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      Ra(t, e, "translate");
      var r = e.datas, n = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, u = e.isGroup, c = e.parentThrottleDrag, f = e.distX, d = e.distY, h = r.isDrag, v = r.prevDist, g = r.prevBeforeDist, x = r.startValue;
      if (h) {
        o && (f += o[0], d += o[1]);
        var y = t.props, S = y.parentMoveable, w = u ? 0 : y.throttleDrag || c || 0, E = n ? 0 : y.throttleDragRotate || 0, M = 0, D = !1, k = !1, T = !1, m = !1;
        if (!n && E > 0 && (f || d)) {
          var _ = y.startDragRotate || 0, j = St(_ + $t([0, 0], [f, d]) * 180 / Math.PI, E) - _, O = d * Math.abs(Math.cos((j - 90) / 180 * Math.PI)), R = f * Math.abs(Math.cos(j / 180 * Math.PI)), A = De([R, O]);
          M = j * Math.PI / 180, f = A * Math.cos(M), d = A * Math.sin(M);
        }
        if (!i && !n && !a) {
          var z = N(lh(t, f, d, E, !s && l || o, r), 2), W = z[0], H = z[1];
          D = W.isSnap, k = W.isBound, T = H.isSnap, m = H.isBound;
          var F = W.offset, q = H.offset;
          f += F, d += q;
        }
        var V = It(vu({ datas: r, distX: f, distY: d }), x), L = It(wp({ datas: r, distX: f, distY: d }), x);
        Is(L, ce), Is(V, ce), E || (!D && !k && (L[0] = St(L[0], w), V[0] = St(V[0], w)), !T && !m && (L[1] = St(L[1], w), V[1] = St(V[1], w)));
        var rt = mt(V, x), at = mt(L, x), Z = mt(at, v), nt = mt(rt, g);
        r.prevDist = at, r.prevBeforeDist = rt, r.passDelta = Z, r.passDist = at;
        var tt = r.left + rt[0], ot = r.top + rt[1], it = r.right - rt[0], ft = r.bottom - rt[1], bt = Pa(r, "translate(".concat(L[0], "px, ").concat(L[1], "px)"), "translate(".concat(at[0], "px, ").concat(at[1], "px)"));
        if (xo(e, bt), t.state.dragInfo.dist = n ? [0, 0] : at, !(!n && !S && Z.every(function(ht) {
          return !ht;
        }) && nt.some(function(ht) {
          return !ht;
        }))) {
          var J = t.state, lt = J.width, wt = J.height, pt = Et(t, e, P({ transform: bt, dist: at, delta: Z, translate: L, beforeDist: rt, beforeDelta: nt, beforeTranslate: V, left: tt, top: ot, right: it, bottom: ft, width: lt, height: wt, isPinch: i }, ue({
            transform: bt
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
    var l = ii(t, this, "dragStart", [
      i || 0,
      o || 0
    ], e, !1, "draggable"), u = l.childEvents, c = l.eventParams, f = P(P({}, s), { targets: t.props.targets, events: c }), d = ct(t, "onDragGroupStart", f);
    a.isDrag = d !== !1;
    var h = (n = (r = u[0]) === null || r === void 0 ? void 0 : r.datas.startValue) !== null && n !== void 0 ? n : [0, 0];
    return a.throttleOffset = [h[0] % 1, h[1] % 1], a.isDrag ? s : !1;
  },
  dragGroup: function(t, e) {
    var r = e.datas;
    if (r.isDrag) {
      var n = this.drag(t, P(P({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = ii(t, this, "drag", a, e, !1, "draggable").eventParams;
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
      var a = ii(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
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
function ju(t, e) {
  var r = re(t, e), n = [0, 0];
  return {
    fixedPosition: r,
    fixedDirection: e,
    fixedOffset: n
  };
}
function ph(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = [
    a / 2 * (1 + e[0]),
    i / 2 * (1 + e[1])
  ], l = Ft(r, s, o), u = [0, 0];
  return {
    fixedPosition: l,
    fixedDirection: e,
    fixedOffset: u
  };
}
function Au(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = Rp(e, a, i), l = Ft(r, e, o), u = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: u
  };
}
var Xs = Io("resizable"), Li = {
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
  render: wu("resizable"),
  dragControlCondition: Xs,
  viewClassName: To("resizable"),
  dragControlStart: function(t, e) {
    var r, n = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, u = e.parentFixedDirection, c = e.parentEvent, f = Uu(o, a, n, l), d = t.state, h = d.target, v = d.width, g = d.height, x = d.gestos;
    if (!f || !h || x.resizable)
      return !1;
    x.resizable = s || t.controlGesto, !a && Cr(t, e), l.datas = {}, l.direction = f, l.startOffsetWidth = v, l.startOffsetHeight = g, l.prevWidth = 0, l.prevHeight = 0, l.minSize = [0, 0], l.startWidth = d.inlineCSSWidth || d.cssWidth, l.startHeight = d.inlineCSSHeight || d.cssHeight, l.maxSize = [1 / 0, 1 / 0], i || (l.minSize = [
      d.minOffsetWidth,
      d.minOffsetHeight
    ], l.maxSize = [
      d.maxOffsetWidth,
      d.maxOffsetHeight
    ]);
    var y = t.props.transformOrigin || "% %";
    l.transformOrigin = Ee(y) ? y.split(" ") : y, l.startOffsetMatrix = d.offsetMatrix, l.startTransformOrigin = d.transformOrigin, l.isWidth = (r = e == null ? void 0 : e.parentIsWidth) !== null && r !== void 0 ? r : !f[0] && !f[1] || f[0] || !f[1];
    function S(m) {
      l.ratio = m && isFinite(m) ? m : 0;
    }
    l.startPositions = Me(t.state);
    function w(m) {
      var _ = ju(l.startPositions, m);
      l.fixedDirection = _.fixedDirection, l.fixedPosition = _.fixedPosition, l.fixedOffset = _.fixedOffset;
    }
    function E(m) {
      var _ = Au(t.state, m);
      l.fixedDirection = _.fixedDirection, l.fixedPosition = _.fixedPosition, l.fixedOffset = _.fixedOffset;
    }
    function M(m) {
      l.minSize = [
        Nt("".concat(m[0]), 0) || 0,
        Nt("".concat(m[1]), 0) || 0
      ];
    }
    function D(m) {
      var _ = [
        m[0] || 1 / 0,
        m[1] || 1 / 0
      ];
      (!yn(_[0]) || isFinite(_[0])) && (_[0] = Nt("".concat(_[0]), 0) || 1 / 0), (!yn(_[1]) || isFinite(_[1])) && (_[1] = Nt("".concat(_[1]), 0) || 1 / 0), l.maxSize = _;
    }
    S(v / g), w(u || [-f[0], -f[1]]), l.setFixedDirection = w, l.setFixedPosition = E, l.setMin = M, l.setMax = D;
    var k = Et(t, e, {
      direction: f,
      startRatio: l.ratio,
      set: function(m) {
        var _ = N(m, 2), j = _[0], O = _[1];
        l.startWidth = j, l.startHeight = O;
      },
      setMin: M,
      setMax: D,
      setRatio: S,
      setFixedDirection: w,
      setFixedPosition: E,
      setOrigin: function(m) {
        l.transformOrigin = m;
      },
      dragStart: se.dragStart(t, new Lr().dragStart([0, 0], e))
    }), T = c || ct(t, "onResizeStart", k);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, T !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: f
    }), l.isResize ? k : !1;
  },
  dragControl: function(t, e) {
    var r, n = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, u = e.useSnap, c = e.isRequest, f = e.isGroup, d = e.parentEvent, h = e.resolveMatrix, v = n.isResize, g = n.transformOrigin, x = n.startWidth, y = n.startHeight, S = n.prevWidth, w = n.prevHeight, E = n.minSize, M = n.maxSize, D = n.ratio, k = n.startOffsetWidth, T = n.startOffsetHeight, m = n.isWidth;
    if (!v)
      return;
    if (h) {
      var _ = t.state.is3d, j = n.startOffsetMatrix, O = n.startTransformOrigin, R = _ ? 4 : 3, A = Gr(ba(e)), z = Math.sqrt(A.length);
      R !== z && (A = Oe(A, z, R));
      var W = Rn(j, A, O, R), H = wr(W, k, T, R);
      n.startPositions = H, n.nextTargetMatrix = A, n.nextAllMatrix = W;
    }
    var F = Sr(t.props, "resizable"), q = F.resizeFormat, V = F.throttleResize, L = V === void 0 ? a ? 0 : 1 : V, rt = F.parentMoveable, at = F.keepRatioFinally, Z = n.direction, nt = Z, tt = 0, ot = 0;
    !Z[0] && !Z[1] && (nt = [1, 1]);
    var it = D && (o ?? F.keepRatio) || !1;
    function ft() {
      var Rt = n.fixedDirection, Gt = ec(nt, it, n, e);
      tt = Gt.distWidth, ot = Gt.distHeight;
      var ve = nt[0] - Rt[0] || it ? Math.max(k + tt, ce) : k, Ne = nt[1] - Rt[1] || it ? Math.max(T + ot, ce) : T;
      return it && k && T && (m ? Ne = ve / D : ve = Ne * D), [ve, Ne];
    }
    var bt = N(ft(), 2), J = bt[0], lt = bt[1];
    d || (n.setFixedDirection(n.fixedDirection), ct(t, "onBeforeResize", Et(t, e, {
      startFixedDirection: n.startFixedDirection,
      startFixedPosition: n.startFixedPosition,
      setFixedDirection: function(Rt) {
        var Gt;
        return n.setFixedDirection(Rt), Gt = N(ft(), 2), J = Gt[0], lt = Gt[1], [J, lt];
      },
      setFixedPosition: function(Rt) {
        var Gt;
        return n.setFixedPosition(Rt), Gt = N(ft(), 2), J = Gt[0], lt = Gt[1], [J, lt];
      },
      boundingWidth: J,
      boundingHeight: lt,
      setSize: function(Rt) {
        var Gt;
        Gt = N(Rt, 2), J = Gt[0], lt = Gt[1];
      }
    }, !0)));
    var wt = s;
    s || (!a && i ? wt = jp(t, [0, 0]) : wt = n.fixedPosition);
    var pt = [0, 0];
    i || (pt = Th(t, J, lt, Z, wt, !u && c, n)), l && (!l[0] && (pt[0] = 0), !l[1] && (pt[1] = 0));
    function ht() {
      var Rt;
      q && (Rt = N(q([J, lt]), 2), J = Rt[0], lt = Rt[1]), J = St(J, L), lt = St(lt, L);
    }
    if (it) {
      nt[0] && nt[1] && pt[0] && pt[1] && (X(pt[0]) > X(pt[1]) ? pt[1] = 0 : pt[0] = 0);
      var yt = !pt[0] && !pt[1];
      yt && ht(), nt[0] && !nt[1] || pt[0] && !pt[1] || yt && m ? (J += pt[0], lt = J / D) : (!nt[0] && nt[1] || !pt[0] && pt[1] || yt && !m) && (lt += pt[1], J = lt * D);
    } else
      J += pt[0], lt += pt[1], J = Math.max(0, J), lt = Math.max(0, lt);
    r = N(oo([J, lt], E, M, it ? D : !1), 2), J = r[0], lt = r[1], ht(), it && (f || at) && (m ? lt = J / D : J = lt * D), tt = J - k, ot = lt - T;
    var Tt = [tt - S, ot - w];
    n.prevWidth = tt, n.prevHeight = ot;
    var xt = Np(t, J, lt, wt, g, n);
    if (!(!rt && Tt.every(function(Rt) {
      return !Rt;
    }) && xt.every(function(Rt) {
      return !Rt;
    }))) {
      var vt = se.drag(t, In(e, t.state, xt, !!i, !1, "draggable")), kt = vt.transform, zt = x + tt, qt = y + ot, Lt = Et(t, e, P({ width: zt, height: qt, offsetWidth: Math.round(J), offsetHeight: Math.round(lt), startRatio: D, boundingWidth: J, boundingHeight: lt, direction: Z, dist: [tt, ot], delta: Tt, isPinch: !!i, drag: vt }, Zu({
        style: {
          width: "".concat(zt, "px"),
          height: "".concat(qt, "px")
        },
        transform: kt
      }, vt, e)));
      return !d && ct(t, "onResize", Lt), Lt;
    }
  },
  dragControlAfter: function(t, e) {
    var r = e.datas, n = r.isResize, a = r.startOffsetWidth, i = r.startOffsetHeight, o = r.prevWidth, s = r.prevHeight;
    if (!(!n || t.props.checkResizableError === !1)) {
      var l = t.state, u = l.width, c = l.height, f = u - (a + o), d = c - (i + s), h = X(f) > 3, v = X(d) > 3;
      if (h && (r.startWidth += f, r.startOffsetWidth += f, r.prevWidth += f), v && (r.startHeight += d, r.startOffsetHeight += d, r.prevHeight += d), h || v)
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
  dragGroupControlCondition: Xs,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, P(P({}, e), { isGroup: !0 }));
    if (!n)
      return !1;
    var a = Re(t, "resizable", e), i = r.startOffsetWidth, o = r.startOffsetHeight;
    function s() {
      var h = r.minSize;
      a.forEach(function(v) {
        var g = v.datas, x = g.minSize, y = g.startOffsetWidth, S = g.startOffsetHeight, w = i * (y ? x[0] / y : 0), E = o * (S ? x[1] / S : 0);
        h[0] = Math.max(h[0], w), h[1] = Math.max(h[1], E);
      });
    }
    function l() {
      var h = r.maxSize;
      a.forEach(function(v) {
        var g = v.datas, x = g.maxSize, y = g.startOffsetWidth, S = g.startOffsetHeight, w = i * (y ? x[0] / y : 0), E = o * (S ? x[1] / S : 0);
        h[0] = Math.min(h[0], w), h[1] = Math.min(h[1], E);
      });
    }
    var u = $e(t, this, "dragControlStart", e, function(h, v) {
      return Sa(t, h, r, v);
    });
    s(), l();
    var c = function(h) {
      n.setFixedDirection(h), u.forEach(function(v, g) {
        v.setFixedDirection(h), Sa(t, v.moveable, r, a[g]);
      });
    };
    r.setFixedDirection = c;
    var f = P(P({}, n), { targets: t.props.targets, events: u.map(function(h) {
      return P(P({}, h), { setMin: function(v) {
        h.setMin(v), s();
      }, setMax: function(v) {
        h.setMax(v), l();
      } });
    }), setFixedDirection: c, setMin: function(h) {
      n.setMin(h), s();
    }, setMax: function(h) {
      n.setMax(h), l();
    } }), d = ct(t, "onResizeGroupStart", f);
    return r.isResize = d !== !1, r.isResize ? n : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isResize) {
      var n = Sr(t.props, "resizable");
      Ga(t, "onBeforeResize", function(h) {
        ct(t, "onBeforeResizeGroup", Et(t, e, P(P({}, h), { targets: n.targets }), !0));
      });
      var a = this.dragControl(t, P(P({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = n.keepRatio, u = [
          i / (i - s[0]),
          o / (o - s[1])
        ], c = r.fixedPosition, f = $e(t, this, "dragControl", e, function(h, v) {
          var g = N(oe(Mn(t.rotation / 180 * Math.PI, 3), [
            v.datas.originalX * u[0],
            v.datas.originalY * u[1],
            1
          ], 3), 2), x = g[0], y = g[1];
          return P(P({}, v), { parentDist: null, parentScale: u, dragClient: It(c, [x, y]), parentKeepRatio: l });
        }), d = P({ targets: n.targets, events: f }, a);
        return ct(t, "onResizeGroup", d), d;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isResize) {
      this.dragControlEnd(t, e);
      var a = $e(t, this, "dragControlEnd", e), i = ye(t, e, {
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
function oi(t, e, r, n, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, u = Ft(
    t.state.rootMatrix,
    // TO-DO #710
    mt([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), c = It([a.left, a.top], u);
  e.startAbsoluteOrigin = c, e.prevDeg = $t(c, [r, n]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = Be(c, [r, n]);
}
function pa(t, e, r) {
  var n = r.defaultDeg, a = r.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - n);
  return r.prevDeg = n + s, s;
}
function si(t, e, r, n) {
  return pa($t(n.startAbsoluteOrigin, [t, e]) / Math.PI * 180, r, n);
}
function li(t, e, r, n, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = r.prevSnapDeg, u = 0, c = !1;
  if (i) {
    var f = _h(t, e, n, a + n);
    c = f.isSnap, u = a + f.dist;
  }
  c || (u = St(a + n, s));
  var d = u - a;
  return r.prevSnapDeg = d, [d - l, d, u];
}
function zu(t, e, r) {
  var n = N(e, 4), a = n[0], i = n[1], o = n[2], s = n[3];
  if (t === "none")
    return [];
  if (Ht(t))
    return t.map(function(x) {
      return zu(x, [a, i, o, s], r)[0];
    });
  var l = N((t || "top").split("-"), 2), u = l[0], c = l[1], f = [a, i];
  u === "left" ? f = [o, a] : u === "right" ? f = [i, s] : u === "bottom" && (f = [s, o]);
  var d = [
    (f[0][0] + f[1][0]) / 2,
    (f[0][1] + f[1][1]) / 2
  ], h = qu(f, r);
  if (c) {
    var v = c === "top" || c === "left", g = u === "bottom" || u === "left";
    d = f[v && !g || !v && g ? 0 : 1];
  }
  return [[d, h]];
}
function Wi(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var r = e.inputEvent.target;
  if (te(r, gt("rotation-control")) || t.props.rotateAroundControls && te(r, gt("around-control")) || te(r, gt("control")) && te(r, gt("rotatable")))
    return !0;
  var n = t.props.rotationTarget;
  return n ? Ro(n, !0).some(function(a) {
    return a ? r === a || r.contains(a) : !1;
  }) : !1;
}
var hh = `.rotation {
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
`, vh = {
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
  css: [hh],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? gt("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var r = Sr(t.props, "rotatable"), n = r.rotatable, a = r.rotationPosition, i = r.zoom, o = r.renderDirections, s = r.rotateAroundControls, l = r.resolveAblesWithRotatable, u = t.getState(), c = u.renderPoses, f = u.direction;
    if (!n)
      return null;
    var d = zu(a, c, f), h = [];
    if (d.forEach(function(y, S) {
      var w = N(y, 2), E = w[0], M = w[1];
      h.push(e.createElement(
        "div",
        { key: "rotation".concat(S), className: gt("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(E[0], "px, ").concat(E[1], "px) rotate(").concat(M, "rad)")
        } },
        e.createElement("div", { className: gt("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: gt("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var v = $r(l || {}), g = {};
      v.forEach(function(y) {
        l[y].forEach(function(S) {
          g[S] = y;
        });
      });
      var x = [];
      Ht(o) && (x = o.map(function(y) {
        var S = g[y];
        return {
          data: S ? { resolve: S } : {},
          classNames: S ? ["move"] : [],
          dir: y
        };
      })), h.push.apply(h, Q([], N(bu(t, "rotatable", x, e)), !1));
    }
    return s && h.push.apply(h, Q([], N(Du(t, e)), !1)), h;
  },
  dragControlCondition: Wi,
  dragControlStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, u = e.isPinch, c = e.isRequest, f = t.state, d = f.target, h = f.left, v = f.top, g = f.direction, x = f.beforeDirection, y = f.targetTransform, S = f.moveableClientRect, w = f.offsetMatrix, E = f.targetMatrix, M = f.allMatrix, D = f.width, k = f.height;
    if (!c && !d)
      return !1;
    var T = t.getRect();
    a.rect = T, a.transform = y, a.left = h, a.top = v;
    var m = function(nt) {
      var tt = Au(t.state, nt);
      a.fixedDirection = tt.fixedDirection, a.fixedOffset = tt.fixedOffset, a.fixedPosition = tt.fixedPosition, L && L.setFixedPosition(nt);
    }, _ = function(nt) {
      var tt = ph(t.state, nt);
      a.fixedDirection = tt.fixedDirection, a.fixedOffset = tt.fixedOffset, a.fixedPosition = tt.fixedPosition, L && L.setFixedDirection(nt);
    }, j = i, O = o;
    if (c || u || l) {
      var R = s || 0;
      a.beforeInfo = {
        origin: T.beforeOrigin,
        prevDeg: R,
        defaultDeg: R,
        prevSnapDeg: 0,
        startDist: 0
      }, a.afterInfo = P(P({}, a.beforeInfo), { origin: T.origin }), a.absoluteInfo = P(P({}, a.beforeInfo), { origin: T.origin, startValue: R });
    } else {
      var A = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
      if (A) {
        var z = A.getAttribute("data-direction") || "", W = bp[z];
        if (W) {
          a.isControl = !0, a.isAroundControl = te(A, gt("around-control")), a.controlDirection = W;
          var H = A.getAttribute("data-resolve");
          H && (a.resolveAble = H);
          var F = Xh(f.rootMatrix, f.renderPoses, S);
          r = N(re(F, W), 2), j = r[0], O = r[1];
        }
      }
      a.beforeInfo = { origin: T.beforeOrigin }, a.afterInfo = { origin: T.origin }, a.absoluteInfo = {
        origin: T.origin,
        startValue: T.rotation
      };
      var q = m;
      m = function(nt) {
        var tt = f.is3d ? 4 : 3, ot = N(It(Jl(E, tt), nt), 2), it = ot[0], ft = ot[1], bt = oe(w, xr([it, ft], tt)), J = oe(M, xr([nt[0], nt[1]], tt));
        q(nt);
        var lt = f.posDelta;
        a.beforeInfo.origin = mt(bt, lt), a.afterInfo.origin = mt(J, lt), a.absoluteInfo.origin = mt(J, lt), oi(t, a.beforeInfo, j, O, S), oi(t, a.afterInfo, j, O, S), oi(t, a.absoluteInfo, j, O, S);
      }, _ = function(nt) {
        var tt = re([
          [0, 0],
          [D, 0],
          [0, k],
          [D, k]
        ], nt);
        m(tt);
      };
    }
    a.startClientX = j, a.startClientY = O, a.direction = g, a.beforeDirection = x, a.startValue = 0, a.datas = {}, Na(t, e, "rotate");
    var V = !1, L = !1;
    if (a.isControl && a.resolveAble) {
      var rt = a.resolveAble;
      rt === "resizable" && (L = Li.dragControlStart(t, P(P({}, new Lr("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    L || (V = se.dragStart(t, new Lr().dragStart([0, 0], e))), m(Hh(t));
    var at = Et(t, e, P(P({ set: function(nt) {
      a.startValue = nt * Math.PI / 180;
    }, setFixedDirection: _, setFixedPosition: m }, Oa(t, e)), { dragStart: V, resizeStart: L })), Z = ct(t, "onRotateStart", at);
    return a.isRotate = Z !== !1, f.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? at : !1;
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, u = e.parentFlag, c = e.isPinch, f = e.groupDelta, d = e.resolveMatrix, h = i.beforeDirection, v = i.beforeInfo, g = i.afterInfo, x = i.absoluteInfo, y = i.isRotate, S = i.startValue, w = i.rect, E = i.startClientX, M = i.startClientY;
    if (y) {
      Ra(t, e, "rotate");
      var D = Cp(e), k = h * D, T = t.props.parentMoveable, m = 0, _, j, O = 0, R, A, z = 0, W, H, F = 180 / Math.PI * S, q = x.startValue, V = !1, L = E + o, rt = M + s;
      if (!u && "parentDist" in e) {
        var at = e.parentDist;
        _ = at, R = at, W = at;
      } else c || u ? (_ = pa(l, h, v), R = pa(l, k, g), W = pa(l, k, x)) : (_ = si(L, rt, h, v), R = si(L, rt, k, g), W = si(L, rt, k, x), V = !0);
      if (j = F + _, A = F + R, H = q + W, ct(t, "onBeforeRotate", Et(t, e, {
        beforeRotation: j,
        rotation: A,
        absoluteRotation: H,
        setRotation: function(wt) {
          R = wt - F, _ = R, W = R;
        }
      }, !0)), r = N(li(t, w, v, _, F, V), 3), m = r[0], _ = r[1], j = r[2], n = N(li(t, w, g, R, F, V), 3), O = n[0], R = n[1], A = n[2], a = N(li(t, w, x, W, q, V), 3), z = a[0], W = a[1], H = a[2], !(!z && !O && !m && !T && !d)) {
        var Z = Pa(i, "rotate(".concat(A, "deg)"), "rotate(".concat(R, "deg)"));
        d && (i.fixedPosition = yo(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var nt = Op(t, R, i), tt = mt(It(f || [0, 0], nt), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = nt, i.requestValue = null;
        var ot = mu(t, Z, tt, c, e), it = ot, ft = Be([L, rt], x.startAbsoluteOrigin) - x.startDist, bt = void 0;
        if (i.resolveAble === "resizable") {
          var J = Li.dragControl(t, P(P({}, In(e, t.state, [e.deltaX, e.deltaY], !!c, !1, "resizable")), { resolveMatrix: !0, parentDistance: ft }));
          J && (bt = J, it = Zu(it, J, e));
        }
        var lt = Et(t, e, P(P({ delta: O, dist: R, rotate: A, rotation: A, beforeDist: _, beforeDelta: m, beforeRotate: j, beforeRotation: j, absoluteDist: W, absoluteDelta: z, absoluteRotate: H, absoluteRotation: H, isPinch: !!c, resize: bt }, ot), it));
        return ct(t, "onRotate", lt), lt;
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
  dragGroupControlCondition: Wi,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = t.state, a = n.left, i = n.top, o = n.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(r.beforeDirection * t.rotation);
    var l = $e(t, this, "dragControlStart", e, function(f, d) {
      var h = f.state, v = h.left, g = h.top, x = h.beforeOrigin, y = It(mt([v, g], [a, i]), mt(x, o));
      return d.datas.startGroupClient = y, d.datas.groupClient = y, P(P({}, d), { parentRotate: 0 });
    }), u = P(P({}, s), { targets: t.props.targets, events: l }), c = ct(t, "onRotateGroupStart", u);
    return r.isRotate = c !== !1, r.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      Ga(t, "onBeforeRotate", function(u) {
        ct(t, "onBeforeRotateGroup", Et(t, e, P(P({}, u), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = r.beforeDirection, i = n.beforeDist, o = i / 180 * Math.PI, s = $e(t, this, "dragControl", e, function(u, c) {
          var f = c.datas.startGroupClient, d = N(c.datas.groupClient, 2), h = d[0], v = d[1], g = N(Dn(f, o * a), 2), x = g[0], y = g[1], S = [x - h, y - v];
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
      var a = $e(t, this, "dragControlEnd", e), i = ye(t, e, {
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
function gh(t, e) {
  var r, n = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, u = n === "horizontal", c = u ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (r = {}, r[u ? "width" : "height"] = "".concat(i), r.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(c, "(-50%) scale").concat(c, "(").concat(s, ")"), r)
  });
}
function Do(t, e) {
  return gh(P(P({}, t), { classNames: Q([
    gt("line", "guideline", t.direction)
  ], N(t.classNames), !1).filter(function(r) {
    return r;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(r) {
    return "".concat(St(r, 0.1), "px");
  }) }), e);
}
function Hs(t, e, r, n, a, i, o, s) {
  var l = t.props.zoom;
  return r.map(function(u, c) {
    var f = u.type, d = u.pos, h = [0, 0];
    return h[o] = n, h[o ? 0 : 1] = -a + d, Do({
      key: "".concat(e, "TargetGuideline").concat(c),
      classNames: [gt("target", "bold", f)],
      posValue: h,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function $s(t, e, r, n, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, u = e === "horizontal" ? ar : ir, c = a[u.start], f = a[u.end];
  return r.filter(function(d) {
    var h = d.hide, v = d.elementRect;
    if (h)
      return !1;
    if (l && v) {
      var g = v.rect;
      if (g[u.start] <= c && f <= g[u.end])
        return !1;
    }
    return !0;
  }).map(function(d, h) {
    var v = d.pos, g = d.size, x = d.element, y = d.className, S = [
      -n[0] + v[0],
      -n[1] + v[1]
    ];
    return Do({
      key: "".concat(e, "-default-guideline-").concat(h),
      classNames: x ? [gt("bold"), y] : [gt("normal"), y],
      direction: e,
      posValue: S,
      sizeValue: g,
      zoom: s
    }, i);
  });
}
function ln(t, e, r, n, a, i, o, s) {
  var l, u = t.props, c = u.snapDigit, f = c === void 0 ? 0 : c, d = u.isDisplaySnapDigit, h = d === void 0 ? !0 : d, v = u.snapDistFormat, g = v === void 0 ? function(M, D) {
    return M;
  } : v, x = u.zoom, y = e === "horizontal" ? "X" : "Y", S = e === "vertical" ? "height" : "width", w = Math.abs(a), E = h ? parseFloat(w.toFixed(f)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(r, "-guideline-").concat(n), className: gt("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[S] = "".concat(w, "px"), l) },
    Do({
      direction: e,
      classNames: [gt(r), o],
      size: "100%",
      posValue: [0, 0],
      sizeValue: w,
      zoom: x
    }, s),
    s.createElement("div", { className: gt("size-value", "gap"), style: {
      transform: "translate".concat(y, "(-50%) scale(").concat(x, ")")
    } }, E > 0 ? g(E, e) : "")
  );
}
function mh(t, e, r, n) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? ar : ir, s = r[o.start], l = r[o.end];
  return Ju(e, function(u) {
    return u.pos[a];
  }).map(function(u) {
    var c = [], f = [], d = [];
    return u.forEach(function(h) {
      var v, g, x = h.element, y = h.elementRect.rect;
      if (y[o.end] < s)
        c.push(h);
      else if (l < y[o.start])
        f.push(h);
      else if (y[o.start] <= s && l <= y[o.end] && n) {
        var S = h.pos, w = { element: x, rect: P(P({}, y), (v = {}, v[o.end] = y[o.start], v)) }, E = { element: x, rect: P(P({}, y), (g = {}, g[o.start] = y[o.end], g)) }, M = [0, 0], D = [0, 0];
        M[a] = S[a], M[i] = S[i], D[a] = S[a], D[i] = S[i] + h.size, c.push({
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
    }), c.sort(function(h, v) {
      return v.pos[i] - h.pos[i];
    }), f.sort(function(h, v) {
      return h.pos[i] - v.pos[i];
    }), {
      total: u,
      start: c,
      end: f,
      inner: d
    };
  });
}
function xh(t, e, r, n, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(x) {
      return x.type === s;
    }), u = s === "vertical" ? 1 : 0, c = u ? 0 : 1, f = mh(s, l, n, i), d = u ? ir : ar, h = u ? ar : ir, v = n[d.start], g = n[d.end];
    f.forEach(function(x) {
      var y = x.total, S = x.start, w = x.end, E = x.inner, M = r[c] + y[0].pos[c] - n[h.start], D = n;
      S.forEach(function(k) {
        var T = k.elementRect.rect, m = D[d.start] - T[d.end];
        if (m > 0) {
          var _ = [0, 0];
          _[u] = r[u] + D[d.start] - v - m, _[c] = M, o.push(ln(t, s, "dashed", o.length, m, _, k.className, a));
        }
        D = T;
      }), D = n, w.forEach(function(k) {
        var T = k.elementRect.rect, m = T[d.start] - D[d.end];
        if (m > 0) {
          var _ = [0, 0];
          _[u] = r[u] + D[d.end] - v, _[c] = M, o.push(ln(t, s, "dashed", o.length, m, _, k.className, a));
        }
        D = T;
      }), E.forEach(function(k) {
        var T = k.elementRect.rect, m = v - T[d.start], _ = T[d.end] - g, j = [0, 0], O = [0, 0];
        j[u] = r[u] - m, j[c] = M, O[u] = r[u] + g - v, O[c] = M, o.push(ln(t, s, "dashed", o.length, m, j, k.className, a)), o.push(ln(t, s, "dashed", o.length, _, O, k.className, a));
      });
    });
  }), o;
}
function yh(t, e, r, n, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(x) {
      return x.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, u = l ? 0 : 1, c = l ? ir : ar, f = l ? ar : ir, d = n[c.start], h = n[c.end], v = n[f.start], g = n[f.end];
    s.forEach(function(x) {
      var y = x.gap, S = x.gapRects, w = Math.max.apply(Math, Q([v], N(S.map(function(D) {
        var k = D.rect;
        return k[f.start];
      })), !1)), E = Math.min.apply(Math, Q([g], N(S.map(function(D) {
        var k = D.rect;
        return k[f.end];
      })), !1)), M = (w + E) / 2;
      w === E || M === (v + g) / 2 || S.forEach(function(D) {
        var k = D.rect, T = D.className, m = [r[0], r[1]];
        if (k[c.end] < d)
          m[l] += k[c.end] - d;
        else if (h < k[c.start])
          m[l] += k[c.start] - d - y;
        else
          return;
        m[u] += M - v, i.push(ln(t, l ? "vertical" : "horizontal", "gap", i.length, y, m, T, a));
      });
    });
  }), i;
}
function Yi(t) {
  var e, r, n = t.state, a = n.containerClientRect, i = n.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, u = a.clientHeight, c = a.clientWidth, f = a.clientLeft, d = a.clientTop, h = t.props, v = h.snapGap, g = v === void 0 ? !0 : v, x = h.verticalGuidelines, y = h.horizontalGuidelines, S = h.snapThreshold, w = S === void 0 ? 5 : S, E = h.maxSnapElementGuidelineDistance, M = E === void 0 ? 1 / 0 : E, D = h.isDisplayGridGuidelines, k = we(Me(t.state)), T = k.top, m = k.left, _ = k.bottom, j = k.right, O = { top: T, left: m, bottom: _, right: j, center: (m + j) / 2, middle: (T + _) / 2 }, R = wh(t), A = Q([], N(R), !1), z = ((r = (e = n.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && r !== void 0 ? r : [1, 1]).map(function(q) {
    return q * w;
  });
  g && A.push.apply(A, Q([], N(bh(t, O, z)), !1));
  var W = P({}, n.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (A.push.apply(A, Q([], N(Ch(t, o ? l : c, o ? s : u, f, d, W, D)), !1)), i) {
    var H = a.left, F = a.top;
    W.left += H, W.top += F, W.right += H, W.bottom += F;
  }
  return A.push.apply(A, Q([], N(Gu(y || !1, x || !1, o ? l : c, o ? s : u, f, d, W)), !1)), A = A.filter(function(q) {
    var V = q.element, L = q.elementRect, rt = q.type;
    if (!V || !L)
      return !0;
    var at = L.rect;
    return Bu(O, at, rt, M);
  }), A;
}
function bh(t, e, r) {
  var n = t.props, a = n.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = n.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, u = [];
  return [
    ["vertical", ar, ir],
    ["horizontal", ir, ar]
  ].forEach(function(c) {
    var f = N(c, 3), d = f[0], h = f[1], v = f[2], g = e[h.start], x = e[h.end], y = e[h.center], S = e[v.start], w = e[v.end], E = {
      left: r[0],
      top: r[1]
    };
    function M(T) {
      var m = T.rect, _ = E[h.start];
      return m[h.end] < g + _ ? g - m[h.end] : x - _ < m[h.start] ? m[h.start] - x : -1;
    }
    var D = l.filter(function(T) {
      var m = T.rect;
      return m[v.start] > w || m[v.end] < S ? !1 : M(T) > 0;
    }).sort(function(T, m) {
      return M(T) - M(m);
    }), k = [];
    D.forEach(function(T) {
      D.forEach(function(m) {
        if (T !== m) {
          var _ = T.rect, j = m.rect, O = _[v.start], R = _[v.end], A = j[v.start], z = j[v.end];
          O > z || A > R || k.push([T, m]);
        }
      });
    }), k.forEach(function(T) {
      var m = N(T, 2), _ = m[0], j = m[1], O = _.rect, R = j.rect, A = O[h.start], z = O[h.end], W = R[h.start], H = R[h.end], F = E[h.start], q = 0, V = 0, L = !1, rt = !1, at = !1;
      if (z <= g && x <= W) {
        if (rt = !0, q = (W - z - (x - g)) / 2, V = z + q + (x - g) / 2, X(V - y) > F)
          return;
      } else if (z < W && H < g + F) {
        if (L = !0, q = W - z, V = H + q, X(V - g) > F)
          return;
      } else if (z < W && x - F < A) {
        if (at = !0, q = W - z, V = A - q, X(V - x) > F)
          return;
      } else
        return;
      q && Bu(e, R, d, i) && (q > s || u.push({
        type: d,
        pos: d === "vertical" ? [V, 0] : [0, V],
        element: j.element,
        size: 0,
        className: j.className,
        isStart: L,
        isCenter: rt,
        isEnd: at,
        gap: q,
        hide: !0,
        gapRects: [_, j],
        direction: "",
        elementDirection: ""
      }));
    });
  }), u;
}
function Sh(t, e, r, n) {
  var a, i, o = t.props, s = t.state, l = o.snapGridAll, u = o.snapGridWidth, c = u === void 0 ? 0 : u, f = o.snapGridHeight, d = f === void 0 ? 0 : f, h = s.snapRenderInfo, v = h && (((a = h.direction) === null || a === void 0 ? void 0 : a[0]) || ((i = h.direction) === null || i === void 0 ? void 0 : i[1])), g = t.moveables;
  if (l && g && v && (c || d)) {
    if (s.snapThresholdInfo)
      return;
    s.snapThresholdInfo = {
      multiples: [1, 1],
      offset: [0, 0]
    };
    var x = t.getRect(), y = x.children, S = h.direction;
    if (y) {
      var w = S.map(function(M, D) {
        var k = D === 0 ? {
          snapSize: c,
          posName: "left",
          sizeName: "width",
          clientOffset: n.left - e
        } : {
          snapSize: d,
          posName: "top",
          sizeName: "height",
          clientOffset: n.top - r
        }, T = k.snapSize, m = k.posName, _ = k.sizeName, j = k.clientOffset;
        if (!T)
          return {
            dir: M,
            multiple: 1,
            snapSize: T,
            snapOffset: 0
          };
        var O = x[_], R = x[m], A = bd(y.map(function(L) {
          return [
            L[m] - R,
            L[_],
            O - L[_] - L[m] + R
          ];
        })).filter(function(L) {
          return L;
        }).sort(function(L, rt) {
          return L - rt;
        }), z = A[0], W = A.map(function(L) {
          return St(L / z, 0.1) * T;
        }), H = 1, F = St(O / z, 0.1);
        for (H = 1; H <= 10 && !W.every(function(L) {
          return L * H % 1 === 0;
        }); ++H)
          ;
        var q = (-M + 1) / 2, V = va(R - j, R - j + O, q, 1 - q);
        return {
          multiple: F * H,
          dir: M,
          snapSize: T,
          snapOffset: Math.round(V / T)
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
function Ch(t, e, r, n, a, i, o) {
  n === void 0 && (n = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, u = s.snapGridWidth, c = u === void 0 ? 0 : u, f = s.snapGridHeight, d = f === void 0 ? 0 : f, h = [], v = i.left, g = i.top, x = [0, 0];
  Sh(t, n, a, i);
  var y = l.snapThresholdInfo, S = c, w = d;
  if (y && (c *= y.multiples[0] || 1, d *= y.multiples[1] || 1, x = y.offset), d) {
    for (var E = function(D) {
      h.push({
        type: "horizontal",
        pos: [
          v,
          St(x[1] * w + D - a + g, 0.1)
        ],
        className: gt("grid-guideline"),
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
    for (var E = function(k) {
      h.push({
        type: "vertical",
        pos: [
          St(x[0] * S + k - n + v, 0.1),
          g
        ],
        className: gt("grid-guideline"),
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
  return h;
}
function Bu(t, e, r, n) {
  return r === "horizontal" ? X(t.right - e.left) <= n || X(t.left - e.right) <= n || t.left <= e.right && e.left <= t.right : r === "vertical" ? X(t.bottom - e.top) <= n || X(t.top - e.bottom) <= n || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function wh(t) {
  var e = t.state, r = t.props.elementGuidelines, n = r === void 0 ? [] : r;
  if (!n.length)
    return e.elementRects = [], [];
  var a = (e.elementRects || []).filter(function(d) {
    return !d.refresh;
  }), i = n.map(function(d) {
    return me(d) && "element" in d ? P(P({}, d), { element: Ge(d.element, !0) }) : {
      element: Ge(d, !0)
    };
  }).filter(function(d) {
    return d.element;
  }), o = Pr(a.map(function(d) {
    return d.element;
  }), i.map(function(d) {
    return d.element;
  })), s = o.maintained, l = o.added, u = [];
  s.forEach(function(d) {
    var h = N(d, 2), v = h[0], g = h[1];
    u[g] = a[v];
  }), Eh(t, l.map(function(d) {
    return i[d];
  })).map(function(d, h) {
    u[l[h]] = d;
  }), e.elementRects = u;
  var c = So(t.props.elementSnapDirections), f = [];
  return u.forEach(function(d) {
    var h = d.element, v = d.top, g = v === void 0 ? c.top : v, x = d.left, y = x === void 0 ? c.left : x, S = d.right, w = S === void 0 ? c.right : S, E = d.bottom, M = E === void 0 ? c.bottom : E, D = d.center, k = D === void 0 ? c.center : D, T = d.middle, m = T === void 0 ? c.middle : T, _ = d.className, j = d.rect, O = Co({
      top: g,
      right: w,
      left: y,
      bottom: M,
      center: k,
      middle: m
    }, j), R = O.horizontal, A = O.vertical, z = O.horizontalNames, W = O.verticalNames, H = j.top, F = j.left, q = j.right - F, V = j.bottom - H, L = [q, V];
    A.forEach(function(rt, at) {
      f.push({
        type: "vertical",
        element: h,
        pos: [
          St(rt, 0.1),
          H
        ],
        size: V,
        sizes: L,
        className: _,
        elementRect: d,
        elementDirection: zs[W[at]] || W[at],
        direction: ""
      });
    }), R.forEach(function(rt, at) {
      f.push({
        type: "horizontal",
        element: h,
        pos: [
          F,
          St(rt, 0.1)
        ],
        size: q,
        sizes: L,
        className: _,
        elementRect: d,
        elementDirection: zs[z[at]] || z[at],
        direction: ""
      });
    });
  }), f;
}
function qs(t, e) {
  return t ? t.map(function(r) {
    var n = me(r) ? r : { pos: r }, a = n.pos;
    return yn(a) ? n : P(P({}, n), { pos: Nt(a, e) });
  }) : [];
}
function Gu(t, e, r, n, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, u = o.top, c = o.bottom, f = o.right, d = r + f - l, h = n + c - u;
  return qs(t, h).forEach(function(v) {
    s.push({
      type: "horizontal",
      pos: [
        l,
        St(v.pos - i + u, 0.1)
      ],
      size: d,
      className: v.className,
      direction: ""
    });
  }), qs(e, d).forEach(function(v) {
    s.push({
      type: "vertical",
      pos: [
        St(v.pos - a + l, 0.1),
        u
      ],
      size: h,
      className: v.className,
      direction: ""
    });
  }), s;
}
function Eh(t, e) {
  if (!e.length)
    return [];
  var r = t.props.groupable, n = t.state, a = n.containerClientRect, i = n.rootMatrix, o = n.is3d, s = n.offsetDelta, l = o ? 4 : 3, u = N(Vp(i, a, l), 2), c = u[0], f = u[1], d = r ? 0 : s[0], h = r ? 0 : s[1];
  return e.map(function(v) {
    var g = v.element.getBoundingClientRect(), x = g.left - c - d, y = g.top - f - h, S = y + g.height, w = x + g.width, E = N(Xr(i, [x, y], l), 2), M = E[0], D = E[1], k = N(Xr(i, [w, S], l), 2), T = k[0], m = k[1];
    return P(P({}, v), { rect: {
      left: M,
      right: T,
      top: D,
      bottom: m,
      center: (M + T) / 2,
      middle: (D + m) / 2
    } });
  });
}
function ea(t) {
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
    var o = Ge(n, !0);
    if (o) {
      var s = vn(o), l = Qs(e, [
        s.left - a.left,
        s.top - a.top
      ]), u = Qs(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = St(l[0], 1e-5), i.top = St(l[1], 1e-5), i.right = St(u[0], 1e-5), i.bottom = St(u[1], 1e-5);
    }
  }
  return e.snapContainer = n, e.snapOffset = i, e.guidelines = Yi(t), e.enableSnap = !0, !0;
}
function Fu(t, e, r, n, a, i) {
  var o = wr(t, e, r, i ? 4 : 3), s = re(o, n);
  return ko(o, mt(a, s));
}
function Vs(t) {
  return t ? t / X(t) : 0;
}
function Dh(t, e, r, n, a, i) {
  var o = i.fixedDirection, s = Jp(r, o, n), l = Eo(t, e, r, n), u = Q(Q([], N(ch(t, e, s, n, a, i)), !1), N(Nu(t, l, i)), !1), c = Ca(u, 0), f = Ca(u, 1);
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
function Mh(t, e, r, n, a, i, o, s, l) {
  var u = re(e, o), c = za(t, s, {
    vertical: [u[0]],
    horizontal: [u[1]]
  }), f = c.horizontal.offset, d = c.vertical.offset;
  if (St(d, Ai) || St(f, Ai)) {
    var h = N(Fe({
      datas: l,
      distX: -d,
      distY: -f
    }), 2), v = h[0], g = h[1], x = Math.min(a || 1 / 0, r + o[0] * v), y = Math.min(i || 1 / 0, n + o[1] * g);
    return [x - r, y - n];
  }
  return [0, 0];
}
function Lu(t, e, r, n, a, i, o, s) {
  for (var l = Me(t.state), u = t.props.keepRatio, c = 0, f = 0, d = 0; d < 2; ++d) {
    var h = e(c, f), v = Dh(t, h, a, u, o, s), g = v.width, x = v.height, y = g.isBound, S = x.isBound, w = g.offset, E = x.offset;
    if (d === 1 && (y || (w = 0), S || (E = 0)), d === 0 && o && !y && !S)
      return [0, 0];
    if (u) {
      var M = X(w) * (r ? 1 / r : 1), D = X(E) * (n ? 1 / n : 1), k = y && S ? M < D : S || !y && M < D;
      k ? w = r * E / n : E = n * w / r;
    }
    c += w, f += E;
  }
  if (!u && a[0] && a[1]) {
    var T = dh(t, l, a, i, s), m = T.maxWidth, _ = T.maxHeight, j = N(Mh(t, e(c, f).map(function(A) {
      return A.map(function(z) {
        return St(z, Ai);
      });
    }), r + c, n + f, m, _, a, o, s), 2), w = j[0], E = j[1];
    c += w, f += E;
  }
  return [c, f];
}
function pn(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function kh(t, e) {
  e = pn(e);
  var r = Math.floor(t / 360), n = r * 360 + 360 - e, a = r * 360 + e;
  return X(t - n) < X(t - a) ? n : a;
}
function ui(t, e) {
  t = pn(t), e = pn(e);
  var r = pn(t - e);
  return Math.min(r, 360 - r);
}
function _h(t, e, r, n) {
  var a, i = t.props, o = (a = i[Mu]) !== null && a !== void 0 ? a : 5, s = i[ku];
  if (Ur(t, "rotatable")) {
    var l = e.pos1, u = e.pos2, c = e.pos3, f = e.pos4, d = e.origin, h = r * Math.PI / 180, v = [l, u, c, f].map(function(E) {
      return mt(E, d);
    }), g = v.map(function(E) {
      return Dn(E, h);
    }), x = Q(Q([], N(Xp(t, v, g, d, r)), !1), N(ah(t, v, g, d, r)), !1);
    x.sort(function(E, M) {
      return X(E - r) - X(M - r);
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
      return ui(E, n) - ui(M, n);
    }), w = S[0];
    if (ui(w, n) <= o)
      return {
        isSnap: !0,
        dist: r + kh(n, w) - n
      };
  }
  return {
    isSnap: !1,
    dist: r
  };
}
function Th(t, e, r, n, a, i, o) {
  if (!Ur(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, u = t.state, c = u.allMatrix, f = u.is3d;
  return Lu(t, function(d, h) {
    return Fu(l || c, e + d, r + h, s, a, f);
  }, e, r, n, a, i, o);
}
function Ih(t, e, r, n, a) {
  if (!Ur(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, u = a.is3d, c = Lu(t, function(f, d) {
    return Fu(Tp(a, It(e, [f / i, d / o])), i, o, l, s, u);
  }, i, o, r, s, n, a);
  return [c[0] / i, c[1] / o];
}
function Rh(t, e) {
  e.absolutePoses = Me(t.state);
}
function Us(t) {
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
function Ks(t, e, r, n, a, i) {
  var o = bo(ja(t, i), e, r), s = o.vertical, l = o.horizontal, u = jr();
  s.forEach(function(v) {
    v.isBound && (v.direction === "start" && (u.left = !0), v.direction === "end" && (u.right = !0), n.push({
      type: "bounds",
      pos: v.pos
    }));
  }), l.forEach(function(v) {
    v.isBound && (v.direction === "start" && (u.top = !0), v.direction === "end" && (u.bottom = !0), a.push({
      type: "bounds",
      pos: v.pos
    }));
  });
  var c = ih(t), f = c.boundMap, d = c.vertical, h = c.horizontal;
  return d.forEach(function(v) {
    qe(n, function(g) {
      var x = g.type, y = g.pos;
      return x === "bounds" && y === v;
    }) >= 0 || n.push({
      type: "bounds",
      pos: v
    });
  }), h.forEach(function(v) {
    qe(a, function(g) {
      var x = g.type, y = g.pos;
      return x === "bounds" && y === v;
    }) >= 0 || a.push({
      type: "bounds",
      pos: v
    });
  }), {
    boundMap: u,
    innerBoundMap: f
  };
}
var Ph = Io("", ["resizable", "scalable"]), Oh = {
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
    Mu,
    ku,
    _u,
    Tu,
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
      return zr(t, "boundMap", jr(), function(Z) {
        return JSON.stringify(Z);
      }), zr(t, "innerBoundMap", jr(), function(Z) {
        return JSON.stringify(Z);
      }), [];
    r.guidelines = Yi(t);
    var d = Math.min(i[0], o[0], s[0], l[0]), h = Math.min(i[1], o[1], s[1], l[1]), v = u.externalPoses || [], g = Me(t.state), x = [], y = [], S = [], w = [], E = [], M = we(g), D = M.width, k = M.height, T = M.top, m = M.left, _ = M.bottom, j = M.right, O = { left: m, right: j, top: T, bottom: _, center: (m + j) / 2, middle: (T + _) / 2 }, R = v.length > 0, A = R ? we(v) : {};
    if (!u.request) {
      if (u.direction && E.push(Zp(t, g, u.direction, f, f)), u.snap) {
        var z = we(g);
        u.center && (z.middle = (z.top + z.bottom) / 2, z.center = (z.left + z.right) / 2), E.push(Bs(t, z, f, f));
      }
      R && (u.center && (A.middle = (A.top + A.bottom) / 2, A.center = (A.left + A.right) / 2), E.push(Bs(t, A, f, f))), E.forEach(function(Z) {
        var nt = Z.vertical.posInfos, tt = Z.horizontal.posInfos;
        x.push.apply(x, Q([], N(nt.filter(function(ot) {
          var it = ot.guidelineInfos;
          return it.some(function(ft) {
            var bt = ft.guideline;
            return !bt.hide;
          });
        }).map(function(ot) {
          return {
            type: "snap",
            pos: ot.pos
          };
        })), !1)), y.push.apply(y, Q([], N(tt.filter(function(ot) {
          var it = ot.guidelineInfos;
          return it.some(function(ft) {
            var bt = ft.guideline;
            return !bt.hide;
          });
        }).map(function(ot) {
          return {
            type: "snap",
            pos: ot.pos
          };
        })), !1)), S.push.apply(S, Q([], N(Us(nt)), !1)), w.push.apply(w, Q([], N(Us(tt)), !1));
      });
    }
    var W = Ks(t, [m, j], [T, _], x, y), H = W.boundMap, F = W.innerBoundMap;
    R && Ks(t, [A.left, A.right], [A.top, A.bottom], x, y, u.externalBounds);
    var q = Q(Q([], N(S), !1), N(w), !1), V = q.filter(function(Z) {
      return Z.element && !Z.gapRects;
    }), L = q.filter(function(Z) {
      return Z.gapRects;
    }).sort(function(Z, nt) {
      return Z.gap - nt.gap;
    });
    ct(t, "onSnap", {
      guidelines: q.filter(function(Z) {
        var nt = Z.element;
        return !nt;
      }),
      elements: V,
      gaps: L
    }, !0);
    var rt = zr(t, "boundMap", H, function(Z) {
      return JSON.stringify(Z);
    }, jr()), at = zr(t, "innerBoundMap", F, function(Z) {
      return JSON.stringify(Z);
    }, jr());
    return (H === rt || F === at) && ct(t, "onBound", {
      bounds: H,
      innerBounds: F
    }, !0), Q(Q(Q(Q(Q(Q([], N(xh(t, V, [d, h], O, e)), !1), N(yh(t, L, [d, h], O, e)), !1), N($s(t, "horizontal", w, [a, n], O, e)), !1), N($s(t, "vertical", S, [a, n], O, e)), !1), N(Hs(t, "horizontal", y, d, n, D, 0, e)), !1), N(Hs(t, "vertical", x, h, a, k, 1, e)), !1);
  },
  dragStart: function(t, e) {
    t.state.snapRenderInfo = {
      request: e.isRequest,
      snap: !0,
      center: !0
    }, ea(t);
  },
  drag: function(t) {
    var e = t.state;
    ea(t) || (e.guidelines = Yi(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (Ph(t, e) || Wi(t, e))
      return !0;
    if (!e.isRequest && e.inputEvent)
      return te(e.inputEvent.target, gt("snap-control"));
  },
  dragControlStart: function(t) {
    t.state.snapRenderInfo = null, ea(t);
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
    t.state.snapRenderInfo = null, ea(t);
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
function Nh(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function gt() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return nd.apply(void 0, Q([go], N(t), !1));
}
function Wu(t) {
  t();
}
function jh(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : me(t) ? t : Gr(t);
}
function hn(t, e, r) {
  return ma(e, yr(r, e), t, yr(r.map(function(n) {
    return -n;
  }), e));
}
function Ah(t, e, r) {
  if (e === "%") {
    var n = Mo(t.ownerSVGElement);
    return n[r ? "width" : "height"] / 100;
  }
  return 1;
}
function zh(t) {
  var e = Bh(_o(t, ":before"));
  return e.map(function(r, n) {
    var a = mr(r), i = a.value, o = a.unit;
    return i * Ah(t, o, n === 0);
  });
}
function Ea(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function Bh(t) {
  return Ea(t.transformOrigin);
}
function Yu(t) {
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
function wn(t, e, r, n, a) {
  var i, o, s = lo(t) || or(t), l = !1, u, c;
  if (!t || r)
    u = t;
  else {
    var f = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, d = t.parentElement;
    f ? (l = !0, c = d, u = f) : u = d;
  }
  for (var h = !1, v = t === e || u === e, g = "relative", x = 1, y = parseFloat(a == null ? void 0 : a("zoom")) || 1, S = a == null ? void 0 : a("position"); u && u !== s; ) {
    e === u && (v = !0);
    var w = he(u), E = u.tagName.toLowerCase(), M = Yu(u), D = w("willChange"), k = parseFloat(w("zoom")) || 1;
    if (g = w("position"), n && k !== 1) {
      x = k;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !r && n && y !== 1 && S && S !== "absolute" || E === "svg" || E === "foreignobject" || g !== "static" || M && M !== "none" || D === "transform"
    )
      break;
    var T = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, m = u.parentNode;
    T && (l = !0, c = m);
    var _ = m;
    if (_ && _.nodeType === 11) {
      u = _.host, h = !0, g = he(u)("position");
      break;
    }
    u = _, g = "relative";
  }
  return {
    offsetZoom: x,
    hasSlot: l,
    parentSlotElement: c,
    isCustomElement: h,
    isStatic: g === "static",
    isEnd: v || !u || u === s,
    offsetParent: u || s
  };
}
function Gh(t, e) {
  var r, n = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = he(t), s = no(a), l = !s, u, c;
  return !l && (n !== "svg" || t.ownerSVGElement) ? (u = uu ? zh(t) : Ea(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), c = u.slice(), l = !0, n === "svg" ? (a = 0, i = 0) : (r = N(Wh(t, u, t === e && e.tagName.toLowerCase() === "g"), 4), a = r[0], i = r[1], u[0] = r[2], u[1] = r[3])) : (u = Ea(o("transformOrigin")).map(function(f) {
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
function Xu(t, e) {
  var r = he(t), n = he(or(t)), a = n("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(n("marginLeft"), 10), o = parseInt(n("marginTop"), 10);
  return r("position") === "absolute" && ((r("top") !== "auto" || r("bottom") !== "auto") && (o = 0), (r("left") !== "auto" || r("right") !== "auto") && (i = 0)), [i, o];
}
function Xi(t) {
  t.forEach(function(e) {
    var r = e.matrix;
    r && (e.matrix = Oe(r, 3, 4));
  });
}
function Fh(t) {
  for (var e = t.parentElement, r = !1, n = or(t); e; ) {
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
function Ba(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(Ql(t, !e).join(","), ")");
}
function Mo(t) {
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
function Lh(t, e) {
  var r, n = Mo(t), a = n.width, i = n.height, o = n.clientWidth, s = n.clientHeight, l = o / a, u = s / i, c = t.preserveAspectRatio.baseVal, f = c.align, d = c.meetOrSlice, h = [0, 0], v = [l, u], g = [0, 0];
  if (f !== 1) {
    var x = (f - 2) % 3, y = Math.floor((f - 2) / 3);
    h[0] = a * x / 2, h[1] = i * y / 2;
    var S = d === 2 ? Math.max(u, l) : Math.min(l, u);
    v[0] = S, v[1] = S, g[0] = (o - a) / 2 * x, g[1] = (s - i) / 2 * y;
  }
  var w = uo(v, e);
  return r = N(g, 2), w[e * (e - 1)] = r[0], w[e * (e - 1) + 1] = r[1], hn(w, e, h);
}
function Wh(t, e, r) {
  var n = t.tagName.toLowerCase();
  if (!t.getBBox || !r && n === "g")
    return [0, 0, 0, 0];
  var a = he(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = Mo(t.ownerSVGElement), l = o.x, u = o.y;
  n === "foreignobject" && !l && !u && (l = parseFloat(t.getAttribute("x")) || 0, u = parseFloat(t.getAttribute("y")) || 0);
  var c = l - s.x, f = u - s.y, d = i ? e[0] : e[0] - c, h = i ? e[1] : e[1] - f;
  return [c, f, d, h];
}
function Ft(t, e, r) {
  return oe(t, xr(e, r), r);
}
function wr(t, e, r, n) {
  return [[0, 0], [e, 0], [0, r], [e, r]].map(function(a) {
    return Ft(t, a, n);
  });
}
function we(t) {
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
function Zs(t, e, r, n) {
  var a = wr(t, e, r, n);
  return we(a);
}
function Yh(t, e, r, n, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, u = $u(o), c = u.offsetWidth, f = u.offsetHeight, d = r.getBoundingClientRect(), h = [0, 0];
  r === or(r) && (h = Xu(o, !0));
  for (var v = o.getBoundingClientRect(), g = v.left - d.left + r.scrollLeft - (r.clientLeft || 0) + h[0], x = v.top - d.top + r.scrollTop - (r.clientTop || 0) + h[1], y = v.width, S = v.height, w = ma(n, a, l), E = Zs(w, c, f, n), M = E.left, D = E.top, k = E.width, T = E.height, m = Ft(w, s, n), _ = mt(m, [M, D]), j = [
    g + _[0] * y / k,
    x + _[1] * S / T
  ], O = [0, 0], R = 0; ++R < 10; ) {
    var A = Pe(a, n);
    i = N(mt(Ft(A, j, n), Ft(A, m, n)), 2), O[0] = i[0], O[1] = i[1];
    var z = ma(n, a, yr(O, n), l), W = Zs(z, c, f, n), H = W.left, F = W.top, q = H - g, V = F - x;
    if (X(q) < 2 && X(V) < 2)
      break;
    j[0] -= q, j[1] -= V;
  }
  return O.map(function(L) {
    return Math.round(L);
  });
}
function Xh(t, e, r) {
  var n = t.length === 16, a = n ? 4 : 3, i = e.map(function(l) {
    return Ft(t, l, a);
  }), o = r.left, s = r.top;
  return i.map(function(l) {
    return [l[0] + o, l[1] + s];
  });
}
function De(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
}
function Hu(t, e) {
  return De([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function un(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = $t(t, e));
  var a = Hu(t, e);
  return {
    transform: "translateY(-50%) translate(".concat(t[0], "px, ").concat(t[1], "px) rotate(").concat(n, "rad) scaleY(").concat(r, ")"),
    width: "".concat(a, "px")
  };
}
function Da(t, e) {
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
  return me(r) ? P(P({}, t), r) : t;
}
function $u(t) {
  var e = t && !no(t.offsetWidth), r = 0, n = 0, a = 0, i = 0, o = 0, s = 0, l = 0, u = 0, c = 0, f = 0, d = 0, h = 0, v = 1 / 0, g = 1 / 0, x = 1 / 0, y = 1 / 0, S = 0, w = 0, E = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var M = t.getBBox();
      E = !0, r = M.width, n = M.height, o = r, s = n, l = r, u = n, a = r, i = n;
    } else {
      var D = he(t), k = t.style, T = D("boxSizing") === "border-box", m = parseFloat(D("borderLeftWidth")) || 0, _ = parseFloat(D("borderRightWidth")) || 0, j = parseFloat(D("borderTopWidth")) || 0, O = parseFloat(D("borderBottomWidth")) || 0, R = parseFloat(D("paddingLeft")) || 0, A = parseFloat(D("paddingRight")) || 0, z = parseFloat(D("paddingTop")) || 0, W = parseFloat(D("paddingBottom")) || 0, H = R + A, F = z + W, q = m + _, V = j + O, L = H + q, rt = F + V, at = D("position"), Z = 0, nt = 0;
      if ("clientLeft" in t) {
        var tt = null;
        if (at === "absolute") {
          var ot = wn(t, or(t));
          tt = ot.offsetParent;
        } else
          tt = t.parentElement;
        if (tt) {
          var it = he(tt);
          Z = parseFloat(it("width")), nt = parseFloat(it("height"));
        }
      }
      c = Math.max(H, Nt(D("minWidth"), Z) || 0), f = Math.max(F, Nt(D("minHeight"), nt) || 0), v = Nt(D("maxWidth"), Z), g = Nt(D("maxHeight"), nt), isNaN(v) && (v = 1 / 0), isNaN(g) && (g = 1 / 0), S = Nt(k.width, 0) || 0, w = Nt(k.height, 0) || 0, o = parseFloat(D("width")) || 0, s = parseFloat(D("height")) || 0, l = X(o - S) < 1 ? ga(c, S || o, v) : o, u = X(s - w) < 1 ? ga(f, w || s, g) : s, r = l, n = u, a = l, i = u, T ? (x = v, y = g, d = c, h = f, l = r - L, u = n - rt) : (x = v + L, y = g + rt, d = c + L, h = f + rt, r = l + L, n = u + rt), a = l + H, i = u + F;
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
    maxWidth: v,
    maxHeight: g,
    minOffsetWidth: d,
    minOffsetHeight: h,
    maxOffsetWidth: x,
    maxOffsetHeight: y
  };
}
function qu(t, e) {
  return $t(e > 0 ? t[0] : t[1], e > 0 ? t[1] : t[0]);
}
function ra() {
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
function Vu(t, e) {
  var r = t === or(t) || t === lo(t), n = {
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
function ci(t, e, r, n) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, u = e.left, c = {
    left: u + a,
    top: l + o,
    right: u + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return r && n ? Vu(r, c) : c;
}
function vn(t, e) {
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
  return t && e ? Vu(t, s) : s;
}
function Hh(t) {
  var e = t.props, r = e.groupable, n = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !r && s && n ? Po(n, i, o) : l;
}
function Uu(t, e, r, n) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = r.target;
    a = Ku(i, n);
  }
  return a;
}
function Ku(t, e) {
  if (t) {
    var r = t.getAttribute("data-rotation") || "", n = t.getAttribute("data-direction");
    if (e.deg = r, !!n) {
      var a = [0, 0];
      return n.indexOf("w") > -1 && (a[0] = -1), n.indexOf("e") > -1 && (a[0] = 1), n.indexOf("n") > -1 && (a[1] = -1), n.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function ko(t, e) {
  return [
    It(e, t[0]),
    It(e, t[1]),
    It(e, t[2]),
    It(e, t[3])
  ];
}
function Me(t) {
  var e = t.left, r = t.top, n = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return ko([n, a, i, o], [e, r]);
}
function Hi(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(r) {
    r.unset && r.unset(t);
  });
}
function Ar(t, e) {
  var r = e ? "controlGesto" : "targetGesto", n = t[r];
  (n == null ? void 0 : n.isIdle()) === !1 && Hi(t, e), n == null || n.unset(), t[r] = null;
}
function ue(t, e) {
  if (e) {
    var r = Vr(e);
    r.nextStyle = P(P({}, r.nextStyle), t);
  }
  return {
    style: t,
    cssText: $r(t).map(function(n) {
      return "".concat(vd(n, "-"), ": ").concat(t[n], ";");
    }).join("")
  };
}
function Zu(t, e, r) {
  var n = e.afterTransform || e.transform;
  return P(P({}, ue(P(P(P({}, t.style), e.style), { transform: n }), r)), { afterTransform: n, transform: t.transform });
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
function Ga(t, e, r) {
  t._emitter.on(e, r);
}
function ct(t, e, r, n, a) {
  return t.triggerEvent(e, r, n, a);
}
function _o(t, e) {
  return Ce(t).getComputedStyle(t, e);
}
function na(t, e, r) {
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
function $i(t, e) {
  return t === e || t == null && e == null;
}
function Js() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var r = t.length - 1, n = 0; n < r; ++n) {
    var a = t[n];
    if (!no(a))
      return a;
  }
  return t[r];
}
function Ju(t, e) {
  var r = [], n = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n.indexOf(o), l = r[s] || [];
    s === -1 && (n.push(o), r.push(l)), l.push(a);
  }), r;
}
function $h(t, e) {
  var r = [], n = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n[o];
    s || (s = [], n[o] = s, r.push(s)), s.push(a);
  }), r;
}
function Qu(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function Yr() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return t.sort(function(r, n) {
    return X(n) - X(r);
  }), t[0];
}
function Xr(t, e, r) {
  return oe(Pe(t, r), xr(e, r), r);
}
function qh(t, e) {
  var r, n = t.is3d, a = t.rootMatrix, i = n ? 4 : 3;
  return r = N(Xr(a, [e.distX, e.distY], i), 2), e.distX = r[0], e.distY = r[1], e;
}
function Se(t, e, r, n) {
  if (!r[0] && !r[1])
    return e;
  var a = Ft(t, [Vs(r[0] || 1), 0], n), i = Ft(t, [0, Vs(r[1] || 1)], n), o = Ft(t, [
    r[0] / De(a),
    r[1] / De(i)
  ], n);
  return It(e, o);
}
function _e(t, e, r) {
  return r ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function Ma(t) {
  return X(t) <= ce ? 0 : t;
}
function To(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var r = Ap(e, t), n = r.deg;
    return n ? gt("view-control-rotation".concat(n)) : "";
  };
}
function Io(t, e) {
  return e === void 0 && (e = [t]), function(r, n) {
    if (n.isRequest)
      return e.some(function(i) {
        return n.requestAble === i;
      }) ? n.parentDirection : !1;
    var a = n.inputEvent.target;
    return te(a, gt("direction")) && (!t || te(a, gt(t)));
  };
}
function Vh(t, e, r) {
  var n, a = Fr(t, {
    "x%": function(M) {
      return M / 100 * e.offsetWidth;
    },
    "y%": function(M) {
      return M / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, r < 0 ? void 0 : r), o = t.slice(0, r < 0 ? void 0 : r + 1), s = t[r] || "", l = r < 0 ? [] : t.slice(r), u = r < 0 ? [] : t.slice(r + 1), c = a.slice(0, r < 0 ? void 0 : r), f = a.slice(0, r < 0 ? void 0 : r + 1), d = (n = a[r]) !== null && n !== void 0 ? n : Fr([""])[0], h = r < 0 ? [] : a.slice(r), v = r < 0 ? [] : a.slice(r + 1), g = d ? [d] : [], x = Rr(c), y = Rr(f), S = Rr(h), w = Rr(v), E = jt(x, S, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: x,
    beforeFunctionMatrix2: y,
    targetFunctionMatrix: Rr(g),
    afterFunctionMatrix: S,
    afterFunctionMatrix2: w,
    allFunctionMatrix: E,
    beforeFunctions: c,
    beforeFunctions2: f,
    targetFunction: g[0],
    afterFunctions: h,
    afterFunctions2: v,
    beforeFunctionTexts: i,
    beforeFunctionTexts2: o,
    targetFunctionText: s,
    afterFunctionTexts: l,
    afterFunctionTexts2: u
  };
}
function Uh(t) {
  return !t || !me(t) || Sn(t) ? !1 : Ht(t) || "length" in t;
}
function Ge(t, e) {
  return t ? Sn(t) ? t : Ee(t) ? e ? document.querySelector(t) : t : Ia(t) ? t() : Kl(t) ? t : "current" in t ? t.current : t : null;
}
function Ro(t, e) {
  if (!t)
    return [];
  var r = Uh(t) ? [].slice.call(t) : [t];
  return r.reduce(function(n, a) {
    return Ee(a) && e ? Q(Q([], N(n), !1), N([].slice.call(document.querySelectorAll(a))), !1) : (Ht(a) ? n.push(Ro(a, e)) : n.push(Ge(a, e)), n);
  }, []);
}
function Kh(t, e, r) {
  var n = $t(t, e) / Math.PI * 180;
  return n = r >= 0 ? n : 180 - n, n = n >= 0 ? n : 360 + n, n;
}
function Qs(t, e) {
  var r = t.rootMatrix, n = t.is3d, a = n ? 4 : 3, i = Pe(r, a);
  return n || (i = Oe(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, da(i, e);
}
function tc(t, e, r, n, a) {
  var i = N(t, 2), o = i[0], s = i[1], l = 0, u = 0;
  if (a && o && s) {
    var c = $t([0, 0], e), f = $t([0, 0], n), d = De(e), h = Math.cos(c - f) * d;
    if (!n[0])
      u = h, l = u * r;
    else if (!n[1])
      l = h, u = l / r;
    else {
      var v = n[0] * o, g = n[1] * s, x = Math.atan2(v + e[0], g + e[1]), y = Math.atan2(v, g);
      x < 0 && (x += Math.PI * 2), y < 0 && (y += Math.PI * 2);
      var S = 0;
      X(x - y) < Math.PI / 2 || X(x - y) > Math.PI / 2 * 3 || (y += Math.PI), S = x - y, S > Math.PI * 2 ? S -= Math.PI * 2 : S > Math.PI ? S = 2 * Math.PI - S : S < -Math.PI && (S = -2 * Math.PI - S);
      var w = De([v + e[0], g + e[1]]) * Math.cos(S);
      l = w * Math.sin(y) - v, u = w * Math.cos(y) - g, n[0] < 0 && (l *= -1), n[1] < 0 && (u *= -1);
    }
  } else
    l = n[0] * e[0], u = n[1] * e[1];
  return [l, u];
}
function ec(t, e, r, n) {
  var a, i = r.ratio, o = r.startOffsetWidth, s = r.startOffsetHeight, l = 0, u = 0, c = n.distX, f = n.distY, d = n.pinchScale, h = n.parentDistance, v = n.parentDist, g = n.parentScale, x = r.fixedDirection, y = [0, 1].map(function(k) {
    return X(t[k] - x[k]);
  }), S = [0, 1].map(function(k) {
    var T = y[k];
    return T !== 0 && (T = 2 / T), T;
  });
  if (v)
    l = v[0], u = v[1], e && (l ? u || (u = l / i) : l = u * i);
  else if (yn(d))
    l = (d - 1) * o, u = (d - 1) * s;
  else if (g)
    l = (g[0] - 1) * o, u = (g[1] - 1) * s;
  else if (h) {
    var w = o * y[0], E = s * y[1], M = De([w, E]);
    l = h / M * w * S[0], u = h / M * E * S[1];
  } else {
    var D = Fe({ datas: r, distX: c, distY: f });
    D = S.map(function(k, T) {
      return D[T] * k;
    }), a = N(tc([o, s], D, i, t, e), 2), l = a[0], u = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: u
  };
}
function qi(t, e) {
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
    var r = N(t.split(" "), 2), n = r[0], a = r[1], i = qi(n || ""), o = qi(a || ""), s = P(P({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function Po(t, e, r) {
  var n = qi(t, !0), a = n.x, i = n.y;
  return [
    Nt(a, e) || 0,
    Nt(i, r) || 0
  ];
}
function Zh(t, e, r) {
  var n = t.map(function(i) {
    return mt(i, e);
  }), a = n.map(function(i) {
    return Dn(i, r);
  });
  return {
    prev: n,
    next: a,
    result: a.map(function(i) {
      return It(i, e);
    })
  };
}
function rc(t, e) {
  return t.length === e.length && t.every(function(r, n) {
    var a = e[n], i = Ht(r), o = Ht(a);
    return i && o ? rc(r, a) : !i && !o ? r === a : !1;
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
function le(t) {
  return t >= 0 ? 1 : -1;
}
function X(t) {
  return Math.abs(t);
}
function fi(t, e) {
  return yd(t).map(function(r) {
    return e(r);
  });
}
function nc(t) {
  return yn(t) ? {
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
var Jh = Tn("pinchable", {
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
    var u = "onPinch".concat(n ? "Group" : "", "Start"), c = "drag".concat(n ? "Group" : "", "ControlStart"), f = (s === !0 ? t.controlAbles : l.filter(function(g) {
      return s.indexOf(g.name) > -1;
    })).filter(function(g) {
      return g.canPinch && g[c];
    }), d = Et(t, e, {});
    n && (d.targets = n);
    var h = ct(t, u, d);
    r.isPinch = h !== !1, r.ables = f;
    var v = r.isPinch;
    return v ? (f.forEach(function(g) {
      if (i[g.name] = i[g.name] || {}, !!g[c]) {
        var x = P(P({}, e), { datas: i[g.name], parentRotate: a, isPinch: !0 });
        g[c](t, x);
      }
    }), t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: [0, 0]
    }, v) : !1;
  },
  pinch: function(t, e) {
    var r = e.datas, n = e.scale, a = e.distance, i = e.originalDatas, o = e.inputEvent, s = e.targets, l = e.angle;
    if (r.isPinch) {
      var u = a * (1 - 1 / n), c = Et(t, e, {});
      s && (c.targets = s);
      var f = "onPinch".concat(s ? "Group" : "");
      ct(t, f, c);
      var d = r.ables, h = "drag".concat(s ? "Group" : "", "Control");
      return d.forEach(function(v) {
        v[h] && v[h](t, P(P({}, e), { datas: i[v.name], inputEvent: o, resolveMatrix: !0, pinchScale: n, parentDistance: u, parentRotate: l, isPinch: !0 }));
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
}), tl = Io("scalable"), Qh = {
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
  render: wu("scalable"),
  dragControlCondition: tl,
  viewClassName: To("scalable"),
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = Uu(i, n, a, r), s = t.state, l = s.width, u = s.height, c = s.targetTransform, f = s.target, d = s.pos1, h = s.pos2, v = s.pos4;
    if (!o || !f)
      return !1;
    n || Cr(t, e), r.datas = {}, r.transform = c, r.prevDist = [1, 1], r.direction = o, r.startOffsetWidth = l, r.startOffsetHeight = u, r.startValue = [1, 1];
    var g = !o[0] && !o[1] || o[0] || !o[1];
    Na(t, e, "scale"), r.isWidth = g;
    function x(D) {
      r.ratio = D && isFinite(D) ? D : 0;
    }
    r.startPositions = Me(t.state);
    function y(D) {
      var k = ju(r.startPositions, D);
      r.fixedDirection = k.fixedDirection, r.fixedPosition = k.fixedPosition, r.fixedOffset = k.fixedOffset;
    }
    r.setFixedDirection = y, x(Be(d, h) / Be(h, v)), y([-o[0], -o[1]]);
    var S = function(D) {
      r.minScaleSize = D;
    }, w = function(D) {
      r.maxScaleSize = D;
    };
    S([-1 / 0, -1 / 0]), w([1 / 0, 1 / 0]);
    var E = Et(t, e, P(P({ direction: o, set: function(D) {
      r.startValue = D;
    }, setRatio: x, setFixedDirection: y, setMinScaleSize: S, setMaxScaleSize: w }, Oa(t, e)), { dragStart: se.dragStart(t, new Lr().dragStart([0, 0], e)) })), M = ct(t, "onScaleStart", E);
    return r.startFixedDirection = r.fixedDirection, M !== !1 && (r.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), r.isScale ? E : !1;
  },
  dragControl: function(t, e) {
    Ra(t, e, "scale");
    var r = e.datas, n = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, u = e.resolveMatrix, c = r.prevDist, f = r.direction, d = r.startOffsetWidth, h = r.startOffsetHeight, v = r.isScale, g = r.startValue, x = r.isWidth, y = r.ratio;
    if (!v)
      return !1;
    var S = t.props, w = S.throttleScale, E = S.parentMoveable, M = f;
    !f[0] && !f[1] && (M = [1, 1]);
    var D = y && (n ?? S.keepRatio) || !1, k = t.state, T = [
      g[0],
      g[1]
    ];
    function m() {
      var J = ec(M, D, r, e), lt = J.distWidth, wt = J.distHeight, pt = d ? (d + lt) / d : 1, ht = h ? (h + wt) / h : 1;
      g[0] || (T[0] = lt / d), g[1] || (T[1] = wt / h);
      var yt = (M[0] || D ? pt : 1) * T[0], Tt = (M[1] || D ? ht : 1) * T[1];
      return yt === 0 && (yt = le(c[0]) * Jn), Tt === 0 && (Tt = le(c[1]) * Jn), [yt, Tt];
    }
    var _ = m();
    if (!i && t.props.groupable) {
      var j = k.snapRenderInfo || {}, O = j.direction;
      Ht(O) && (O[0] || O[1]) && (k.snapRenderInfo = { direction: f, request: e.isRequest });
    }
    ct(t, "onBeforeScale", Et(t, e, {
      scale: _,
      setFixedDirection: function(J) {
        return r.setFixedDirection(J), _ = m(), _;
      },
      startFixedDirection: r.startFixedDirection,
      setScale: function(J) {
        _ = J;
      }
    }, !0));
    var R = [
      _[0] / T[0],
      _[1] / T[1]
    ], A = o, z = [0, 0], W = le(R[0] * R[1]), H = !o && !a && i;
    if (H || u ? A = yo(t, r.targetAllTransform, [0, 0], [0, 0], r) : o || (A = r.fixedPosition), i || (z = Ih(t, R, f, !l && s, r)), D) {
      M[0] && M[1] && z[0] && z[1] && (Math.abs(z[0] * d) > Math.abs(z[1] * h) ? z[1] = 0 : z[0] = 0);
      var F = !z[0] && !z[1];
      if (F && (x ? R[0] = St(R[0] * T[0], w) / T[0] : R[1] = St(R[1] * T[1], w) / T[1]), M[0] && !M[1] || z[0] && !z[1] || F && x) {
        R[0] += z[0];
        var q = d * R[0] * T[0] / y;
        R[1] = le(W * R[0]) * X(q / h / T[1]);
      } else if (!M[0] && M[1] || !z[0] && z[1] || F && !x) {
        R[1] += z[1];
        var V = h * R[1] * T[1] * y;
        R[0] = le(W * R[1]) * X(V / d / T[0]);
      }
    } else
      R[0] += z[0], R[1] += z[1], z[0] || (R[0] = St(R[0] * T[0], w) / T[0]), z[1] || (R[1] = St(R[1] * T[1], w) / T[1]);
    R[0] === 0 && (R[0] = le(c[0]) * Jn), R[1] === 0 && (R[1] = le(c[1]) * Jn), _ = Nh(R, [T[0], T[1]]);
    var L = [
      d,
      h
    ], rt = [
      d * _[0],
      h * _[1]
    ];
    rt = oo(rt, r.minScaleSize, r.maxScaleSize, D ? y : !1), _ = fi(2, function(J) {
      return L[J] ? rt[J] / L[J] : rt[J];
    }), R = fi(2, function(J) {
      return _[J] / T[J];
    });
    var at = fi(2, function(J) {
      return c[J] ? R[J] / c[J] : R[J];
    }), Z = "scale(".concat(R.join(", "), ")"), nt = "scale(".concat(_.join(", "), ")"), tt = Pa(r, nt, Z), ot = !g[0] || !g[1], it = Ip(t, ot ? nt : Z, r.fixedDirection, A, r.fixedOffset, r, ot), ft = H ? it : mt(it, r.prevInverseDist || [0, 0]);
    if (r.prevDist = R, r.prevInverseDist = it, _[0] === c[0] && _[1] === c[1] && ft.every(function(J) {
      return !J;
    }) && !E && !H)
      return !1;
    var bt = Et(t, e, P({ offsetWidth: d, offsetHeight: h, direction: f, scale: _, dist: R, delta: at, isPinch: !!i }, mu(t, tt, ft, i, e)));
    return ct(t, "onScale", bt), bt;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (!r.isScale)
      return !1;
    r.isScale = !1;
    var n = ye(t, e, {});
    return ct(t, "onScaleEnd", n), n;
  },
  dragGroupControlCondition: tl,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var a = Re(t, "resizable", e);
    r.moveableScale = t.scale;
    var i = $e(t, this, "dragControlStart", e, function(u, c) {
      return Sa(t, u, r, c);
    }), o = function(u) {
      n.setFixedDirection(u), i.forEach(function(c, f) {
        c.setFixedDirection(u), Sa(t, c.moveable, r, a[f]);
      });
    };
    r.setFixedDirection = o;
    var s = P(P({}, n), { targets: t.props.targets, events: i, setFixedDirection: o }), l = ct(t, "onScaleGroupStart", s);
    return r.isScale = l !== !1, r.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isScale) {
      Ga(t, "onBeforeScale", function(c) {
        ct(t, "onBeforeScaleGroup", Et(t, e, P(P({}, c), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = n.dist, i = r.moveableScale;
        t.scale = [
          a[0] * i[0],
          a[1] * i[1]
        ];
        var o = t.props.keepRatio, s = r.fixedPosition, l = $e(t, this, "dragControl", e, function(c, f) {
          var d = N(oe(Mn(t.rotation / 180 * Math.PI, 3), [
            f.datas.originalX * a[0],
            f.datas.originalY * a[1],
            1
          ], 3), 2), h = d[0], v = d[1];
          return P(P({}, f), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: It(s, [h, v])
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
      var a = $e(t, this, "dragControlEnd", e), i = ye(t, e, {
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
function Qe(t, e) {
  return t.map(function(r, n) {
    return va(r, e[n], 1, 2);
  });
}
function el(t, e, r) {
  var n = $t(t, e), a = $t(t, r), i = a - n;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function tv(t, e) {
  var r = el(t[0], t[1], t[2]), n = el(e[0], e[1], e[2]), a = Math.PI;
  return !(r >= a && n <= a || r <= a && n >= a);
}
var ev = {
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
  viewClassName: To("warpable"),
  render: function(t, e) {
    var r = t.props, n = r.resizable, a = r.scalable, i = r.warpable, o = r.zoom;
    if (n || a || !i)
      return [];
    var s = t.state, l = s.pos1, u = s.pos2, c = s.pos3, f = s.pos4, d = Qe(l, u), h = Qe(u, l), v = Qe(l, c), g = Qe(c, l), x = Qe(c, f), y = Qe(f, c), S = Qe(u, f), w = Qe(f, u);
    return Q([
      e.createElement("div", { className: gt("line"), key: "middeLine1", style: un(d, x, o) }),
      e.createElement("div", { className: gt("line"), key: "middeLine2", style: un(h, y, o) }),
      e.createElement("div", { className: gt("line"), key: "middeLine3", style: un(v, S, o) }),
      e.createElement("div", { className: gt("line"), key: "middeLine4", style: un(g, w, o) })
    ], N(Eu(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var r = e.inputEvent.target;
    return te(r, gt("direction")) && te(r, gt("warpable"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.inputEvent, a = t.props.target, i = n.target, o = Ku(i, r);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, u = s.is3d, c = s.targetTransform, f = s.targetMatrix, d = s.width, h = s.height, v = s.left, g = s.top;
    r.datas = {}, r.targetTransform = c, r.warpTargetMatrix = u ? f : Oe(f, 3, 4), r.targetInverseMatrix = Zl(Pe(r.warpTargetMatrix, 4), 3, 4), r.direction = o, r.left = v, r.top = g, r.poses = [
      [0, 0],
      [d, 0],
      [0, h],
      [d, h]
    ].map(function(S) {
      return mt(S, l);
    }), r.nextPoses = r.poses.map(function(S) {
      var w = N(S, 2), E = w[0], M = w[1];
      return oe(r.warpTargetMatrix, [E, M, 0, 1], 4);
    }), r.startValue = At(4), r.prevMatrix = At(4), r.absolutePoses = Me(s), r.posIndexes = gu(o), Cr(t, e), Na(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var x = Et(t, e, P({ set: function(S) {
      r.startValue = S;
    } }, Oa(t, e))), y = ct(t, "onWarpStart", x);
    return y !== !1 && (r.isWarp = !0), r.isWarp;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isRequest, a = e.distX, i = e.distY, o = r.targetInverseMatrix, s = r.prevMatrix, l = r.isWarp, u = r.startValue, c = r.poses, f = r.posIndexes, d = r.absolutePoses;
    if (!l)
      return !1;
    if (Ra(t, e, "matrix3d"), Ur(t, "warpable")) {
      var h = f.map(function(m) {
        return d[m];
      });
      h.length > 1 && h.push([
        (h[0][0] + h[1][0]) / 2,
        (h[0][1] + h[1][1]) / 2
      ]);
      var v = za(t, n, {
        horizontal: h.map(function(m) {
          return m[1] + i;
        }),
        vertical: h.map(function(m) {
          return m[0] + a;
        })
      }), g = v.horizontal, x = v.vertical;
      i -= g.offset, a -= x.offset;
    }
    var y = Fe({ datas: r, distX: a, distY: i }, !0), S = r.nextPoses.slice();
    if (f.forEach(function(m) {
      S[m] = It(S[m], y);
    }), !yp.every(function(m) {
      return tv(m.map(function(_) {
        return c[_];
      }), m.map(function(_) {
        return S[_];
      }));
    }))
      return !1;
    var w = co(c[0], c[2], c[1], c[3], S[0], S[2], S[1], S[3]);
    if (!w.length)
      return !1;
    var E = jt(o, w, 4), M = hu(r, E, !0), D = jt(Pe(s, 4), M, 4);
    r.prevMatrix = M;
    var k = jt(u, M, 4), T = Pa(r, "matrix3d(".concat(k.join(", "), ")"), "matrix3d(".concat(M.join(", "), ")"));
    return xo(e, T), ct(t, "onWarp", Et(t, e, P({ delta: D, matrix: k, dist: M, multiply: jt, transform: T }, ue({
      transform: T
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.isDrag;
    return r.isWarp ? (r.isWarp = !1, ct(t, "onWarpEnd", ye(t, e, {})), n) : !1;
  }
}, rv = /* @__PURE__ */ gt("area-pieces"), aa = /* @__PURE__ */ gt("area-piece"), ac = /* @__PURE__ */ gt("avoid"), nv = gt("view-dragging");
function di(t) {
  var e = t.areaElement;
  if (e) {
    var r = t.state, n = r.width, a = r.height;
    Ul(e, ac), e.style.cssText += "left: 0px; top: 0px; width: ".concat(n, "px; height: ").concat(a, "px");
  }
}
function rl(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: rv },
    t.createElement("div", { className: aa }),
    t.createElement("div", { className: aa }),
    t.createElement("div", { className: aa }),
    t.createElement("div", { className: aa })
  );
}
var ic = {
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
    var r = t.props, n = r.target, a = r.dragArea, i = r.groupable, o = r.passDragArea, s = t.getState(), l = s.width, u = s.height, c = s.renderPoses, f = o ? gt("area", "pass") : gt("area");
    if (i)
      return [
        e.createElement("div", { key: "area", ref: rr(t, "areaElement"), className: f }),
        rl(e)
      ];
    if (!n || !a)
      return [];
    var d = co([0, 0], [l, 0], [0, u], [l, u], c[0], c[1], c[2], c[3]), h = d.length ? Ba(d, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: rr(t, "areaElement"), className: f, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(u, "px"),
        transformOrigin: "0 0",
        transform: h
      } }),
      rl(e)
    ];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    r.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, u = s.renderPoses, c = s.rootMatrix, f = s.is3d, d = l.left, h = l.top, v = we(u), g = v.left, x = v.top, y = v.width, S = v.height, w = f ? 4 : 3, E = N(Xr(c, [n - d, a - h], w), 2), M = E[0], D = E[1];
    M -= g, D -= x;
    var k = [
      { left: g, top: x, width: y, height: D - 10 },
      { left: g, top: x, width: M - 10, height: S },
      { left: g, top: x + D + 10, width: y, height: S - D - 10 },
      { left: g + M + 10, top: x, width: y - M - 10, height: S }
    ], T = [].slice.call(o.nextElementSibling.children);
    k.forEach(function(m, _) {
      T[_].style.cssText = "left: ".concat(m.left, "px;top: ").concat(m.top, "px; width: ").concat(m.width, "px; height: ").concat(m.height, "px;");
    }), so(o, ac), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var r = e.datas, n = e.inputEvent;
    if (this.enableNativeEvent(t), !n)
      return !1;
    r.isDragArea || (r.isDragArea = !0, di(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var r = e.inputEvent, n = e.datas;
    if (!r)
      return !1;
    n.isDragArea || di(t);
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
    di(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && Vl(function() {
      e.disableNativeEvent = !1;
    });
  }
}, av = Tn("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var r = t.props, n = r.zoom, a = r.svgOrigin, i = r.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, u = o.svg, c = o.allMatrix, f = o.is3d, d = o.left, h = o.top, v = o.offsetWidth, g = o.offsetHeight, x;
    if (!i && u && a) {
      var y = N(Po(a, v, g), 2), S = y[0], w = y[1], E = f ? 4 : 3, M = Ft(c, [S, w], E);
      x = Da(l, n, mt(M, [d, h]));
    } else
      x = Da(l, n, s);
    return [
      e.createElement("div", { className: gt("control", "origin"), style: x, key: "beforeOrigin" })
    ];
  }
});
function iv(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var ov = {
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
    var r = t.props, n = r.scrollContainer, a = n === void 0 ? t.getContainer() : n, i = r.scrollOptions, o = new ru(), s = Ge(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", u = e.targets;
    o.on("scroll", function(c) {
      var f = c.container, d = c.direction, h = Et(t, e, {
        scrollContainer: f,
        direction: d
      }), v = u ? "onScrollGroup" : "onScroll";
      u && (h.targets = u), ct(t, v, h);
    }).on("move", function(c) {
      var f = c.offsetX, d = c.offsetY, h = c.inputEvent;
      t[l].scrollBy(f, d, h.inputEvent, !1);
    }).on("scrollDrag", function(c) {
      var f = c.next;
      f(t[l].getCurrentEvent());
    }), o.dragStart(e, P({ container: s }, i));
  },
  checkScroll: function(t, e) {
    var r = e.datas.dragScroll;
    if (r) {
      var n = t.props, a = n.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = n.scrollThreshold, s = o === void 0 ? 0 : o, l = n.scrollThrottleTime, u = l === void 0 ? 0 : l, c = n.getScrollPosition, f = c === void 0 ? iv : c, d = n.scrollOptions;
      return r.drag(e, P({ container: i, threshold: s, throttleTime: u, getScrollPosition: function(h) {
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
}, oc = {
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
}, sv = Tn("padding", {
  props: ["padding"],
  render: function(t, e) {
    var r = t.props;
    if (r.dragArea)
      return [];
    var n = nc(r.padding || {}), a = n.left, i = n.top, o = n.right, s = n.bottom, l = t.getState(), u = l.renderPoses, c = l.pos1, f = l.pos2, d = l.pos3, h = l.pos4, v = [c, f, d, h], g = [];
    return a > 0 && g.push([0, 2]), i > 0 && g.push([0, 1]), o > 0 && g.push([1, 3]), s > 0 && g.push([2, 3]), g.map(function(x, y) {
      var S = N(x, 2), w = S[0], E = S[1], M = v[w], D = v[E], k = u[w], T = u[E], m = co([0, 0], [100, 0], [0, 100], [100, 100], M, D, k, T);
      if (m.length)
        return e.createElement("div", { key: "padding".concat(y), className: gt("padding"), style: {
          transform: Ba(m, !0)
        } });
    });
  }
}), nl = ["nw", "ne", "se", "sw"];
function ia(t, e) {
  var r = t[0] + t[1], n = r > e ? e / r : 1;
  return t[0] *= n, t[1] = e - t[1] * n, t;
}
var lv = [1, 2, 5, 6], uv = [0, 3, 4, 7], pr = [1, -1, -1, 1], hr = [1, 1, -1, -1];
function Oo(t, e, r, n, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = r), s === void 0 && (s = n);
  var l = [], u = !1, c = t.filter(function(d) {
    return !d.virtual;
  }), f = c.map(function(d) {
    var h = d.horizontal, v = d.vertical, g = d.pos;
    if (v && !u && (u = !0, l.push("/")), u) {
      var x = Math.max(0, v === 1 ? g[1] - i : s - g[1]);
      return l.push(_e(x, n, e)), x;
    } else {
      var x = Math.max(0, h === 1 ? g[0] - a : o - g[0]);
      return l.push(_e(x, r, e)), x;
    }
  });
  return {
    radiusPoses: c,
    styles: l,
    raws: f
  };
}
function sc(t) {
  for (var e = [0, 0], r = [0, 0], n = t.length, a = 0; a < n; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, r[0] = a + 1), i.vertical && (r[1] === 0 && (r[0] = a), r[1] = a - r[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: r
  };
}
function lc(t, e, r, n, a, i, o) {
  var s, l, u, c;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var f = t.indexOf("/"), d = (f > -1 ? t.slice(0, f) : t).length, h = t.slice(0, d), v = t.slice(d + 1), g = h.length, x = v.length, y = x > 0, S = N(h, 4), w = S[0], E = w === void 0 ? "0px" : w, M = S[1], D = M === void 0 ? E : M, k = S[2], T = k === void 0 ? E : k, m = S[3], _ = m === void 0 ? D : m, j = N(v, 4), O = j[0], R = O === void 0 ? E : O, A = j[1], z = A === void 0 ? y ? R : D : A, W = j[2], H = W === void 0 ? y ? R : T : W, F = j[3], q = F === void 0 ? y ? z : _ : F, V = [E, D, T, _].map(function(tt) {
    return Nt(tt, e);
  }), L = [R, z, H, q].map(function(tt) {
    return Nt(tt, r);
  }), rt = V.slice(), at = L.slice();
  s = N(ia([rt[0], rt[1]], e), 2), rt[0] = s[0], rt[1] = s[1], l = N(ia([rt[3], rt[2]], e), 2), rt[3] = l[0], rt[2] = l[1], u = N(ia([at[0], at[3]], r), 2), at[0] = u[0], at[3] = u[1], c = N(ia([at[1], at[2]], r), 2), at[1] = c[0], at[2] = c[1];
  var Z = o ? rt : rt.slice(0, Math.max(i[0], g)), nt = o ? at : at.slice(0, Math.max(i[1], x));
  return Q(Q([], N(Z.map(function(tt, ot) {
    var it = nl[ot];
    return {
      virtual: ot >= g,
      horizontal: pr[ot],
      vertical: 0,
      pos: [n + tt, a + (hr[ot] === -1 ? r : 0)],
      sub: !0,
      raw: V[ot],
      direction: it
    };
  })), !1), N(nt.map(function(tt, ot) {
    var it = nl[ot];
    return {
      virtual: ot >= x,
      horizontal: 0,
      vertical: hr[ot],
      pos: [n + (pr[ot] === -1 ? e : 0), a + tt],
      sub: !0,
      raw: L[ot],
      direction: it
    };
  })), !1);
}
function cv(t, e, r, n, a) {
  a === void 0 && (a = e.length);
  var i = sc(t.slice(n)), o = i.horizontalRange, s = i.verticalRange, l = r - n, u = 0;
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
function fv(t, e, r, n, a, i, o, s, l, u, c) {
  u === void 0 && (u = 0), c === void 0 && (c = 0);
  var f = sc(t.slice(r)), d = f.horizontalRange, h = f.verticalRange;
  if (n > -1)
    for (var v = pr[n] === 1 ? i - u : s - i, g = d[1]; g <= n; ++g) {
      var x = hr[g] === 1 ? c : l, y = 0;
      if (n === g ? y = i : g === 0 ? y = u + v : pr[g] === -1 && (y = s - (e[r][0] - u)), t.splice(r + g, 0, {
        horizontal: pr[g],
        vertical: 0,
        pos: [y, x]
      }), e.splice(r + g, 0, [y, x]), g === 0)
        break;
    }
  else if (a > -1) {
    var S = hr[a] === 1 ? o - c : l - o;
    if (d[1] === 0 && h[1] === 0) {
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
    for (var E = h[0], g = h[1]; g <= a; ++g) {
      var y = pr[g] === 1 ? u : s, x = 0;
      if (a === g ? x = o : g === 0 ? x = c + S : hr[g] === 1 ? x = e[r + E][1] : hr[g] === -1 && (x = l - (e[r + E][1] - c)), t.push({
        horizontal: 0,
        vertical: hr[g],
        pos: [y, x]
      }), e.push([y, x]), g === 0)
        break;
    }
  }
}
function dv(t, e) {
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
var pv = [
  [0, -1, "n"],
  [1, 0, "e"]
], hv = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function No(t, e, r) {
  var n = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, u = s.poses, c = l === "rect", f = l === "circle";
  if (l === "polygon")
    return r.map(function(D) {
      return "".concat(_e(D[0], i, n), " ").concat(_e(D[1], o, n));
    });
  if (c || l === "inset") {
    var d = r[1][1], h = r[3][0], v = r[7][0], g = r[5][1];
    if (c)
      return [
        d,
        h,
        g,
        v
      ].map(function(D) {
        return "".concat(D, "px");
      });
    var x = [d, i - h, o - g, v].map(function(D, k) {
      return _e(D, k % 2 ? i : o, n);
    });
    if (r.length > 8) {
      var y = N(mt(r[4], r[0]), 2), S = y[0], w = y[1];
      x.push.apply(x, Q(["round"], N(Oo(u.slice(8).map(function(D, k) {
        return P(P({}, D), { pos: r[k] });
      }), n, S, w, v, d, h, g).styles), !1));
    }
    return x;
  } else if (f || l === "ellipse") {
    var E = r[0], M = _e(X(r[1][1] - E[1]), f ? Math.sqrt((i * i + o * o) / 2) : o, n), x = f ? [M] : [_e(X(r[2][0] - E[0]), i, n), M];
    return x.push("at", _e(E[0], i, n), _e(E[1], o, n)), x;
  }
}
function ka(t, e, r, n) {
  var a = [n, (n + e) / 2, e], i = [t, (t + r) / 2, r];
  return hv.map(function(o) {
    var s = N(o, 3), l = s[0], u = s[1], c = s[2], f = a[l + 1], d = i[u + 1];
    return {
      vertical: X(u),
      horizontal: X(l),
      direction: c,
      pos: [f, d]
    };
  });
}
function uc(t) {
  var e = [1 / 0, -1 / 0], r = [1 / 0, -1 / 0];
  return t.forEach(function(n) {
    var a = n.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), r[0] = Math.min(r[0], a[1]), r[1] = Math.max(r[1], a[1]);
  }), [
    X(e[1] - e[0]),
    X(r[1] - r[0])
  ];
}
function al(t, e, r, n, a) {
  var i, o, s, l, u, c, f, d, h;
  if (t) {
    var v = a;
    if (!v) {
      var g = he(t), x = g("clipPath");
      v = x !== "none" ? x : g("clip");
    }
    if (!((!v || v === "none" || v === "auto") && (v = n, !v))) {
      var y = ql(v), S = y.prefix, w = S === void 0 ? v : S, E = y.value, M = E === void 0 ? "" : E, D = w === "circle", k = " ";
      if (w === "polygon") {
        var T = vr(M || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        k = ",";
        var m = T.map(function(zt) {
          var qt = N(zt.split(" "), 2), Lt = qt[0], Rt = qt[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              Nt(Lt, e),
              Nt(Rt, r)
            ]
          };
        }), _ = br(m.map(function(zt) {
          return zt.pos;
        }));
        return {
          type: w,
          clipText: v,
          poses: m,
          splitter: k,
          left: _.minX,
          right: _.maxX,
          top: _.minY,
          bottom: _.maxY
        };
      } else if (D || w === "ellipse") {
        var j = "", O = "", R = 0, A = 0, T = nr(M);
        if (D) {
          var z = "";
          i = N(T, 4), o = i[0], z = o === void 0 ? "50%" : o, s = i[2], j = s === void 0 ? "50%" : s, l = i[3], O = l === void 0 ? "50%" : l, R = Nt(z, Math.sqrt((e * e + r * r) / 2)), A = R;
        } else {
          var W = "", H = "";
          u = N(T, 5), c = u[0], W = c === void 0 ? "50%" : c, f = u[1], H = f === void 0 ? "50%" : f, d = u[3], j = d === void 0 ? "50%" : d, h = u[4], O = h === void 0 ? "50%" : h, R = Nt(W, e), A = Nt(H, r);
        }
        var F = [
          Nt(j, e),
          Nt(O, r)
        ], m = Q([
          {
            vertical: 1,
            horizontal: 1,
            pos: F,
            direction: "nesw"
          }
        ], N(pv.slice(0, D ? 1 : 2).map(function(Lt) {
          return {
            vertical: X(Lt[1]),
            horizontal: Lt[0],
            direction: Lt[2],
            sub: !0,
            pos: [
              F[0] + Lt[0] * R,
              F[1] + Lt[1] * A
            ]
          };
        })), !1);
        return {
          type: w,
          clipText: v,
          radiusX: R,
          radiusY: A,
          left: F[0] - R,
          top: F[1] - A,
          right: F[0] + R,
          bottom: F[1] + A,
          poses: m,
          splitter: k
        };
      } else if (w === "inset") {
        var T = nr(M || "0 0 0 0"), q = T.indexOf("round"), V = (q > -1 ? T.slice(0, q) : T).length, L = T.slice(V + 1), rt = N(T.slice(0, V), 4), at = rt[0], Z = rt[1], nt = Z === void 0 ? at : Z, tt = rt[2], ot = tt === void 0 ? at : tt, it = rt[3], ft = it === void 0 ? nt : it, bt = N([at, ot].map(function(Lt) {
          return Nt(Lt, r);
        }), 2), J = bt[0], lt = bt[1], wt = N([ft, nt].map(function(Lt) {
          return Nt(Lt, e);
        }), 2), pt = wt[0], ht = wt[1], yt = e - ht, Tt = r - lt, xt = lc(L, yt - pt, Tt - J, pt, J), m = Q(Q([], N(ka(J, yt, Tt, pt)), !1), N(xt), !1);
        return {
          type: "inset",
          clipText: v,
          poses: m,
          top: J,
          left: pt,
          right: yt,
          bottom: Tt,
          radius: L,
          splitter: k
        };
      } else if (w === "rect") {
        var T = vr(M || "0px, ".concat(e, "px, ").concat(r, "px, 0px"));
        k = ",";
        var vt = N(T.map(function(ve) {
          var Ne = mr(ve).value;
          return Ne;
        }), 4), kt = vt[0], ht = vt[1], lt = vt[2], pt = vt[3], m = ka(kt, ht, lt, pt);
        return {
          type: "rect",
          clipText: v,
          poses: m,
          top: kt,
          right: ht,
          bottom: lt,
          left: pt,
          values: T,
          splitter: k
        };
      }
    }
  }
}
function vv(t, e, r, n, a) {
  var i = t[e], o = i.direction, s = i.sub, l = t.map(function() {
    return [0, 0];
  }), u = o ? o.split("") : [];
  if (n && e < 8) {
    var c = u.filter(function(R) {
      return R === "w" || R === "e";
    }), f = u.filter(function(R) {
      return R === "n" || R === "s";
    }), d = c[0], h = f[0];
    l[e] = r;
    var v = N(uc(t), 2), g = v[0], x = v[1], y = g && x ? g / x : 0;
    if (y && a) {
      var S = (e + 4) % 8, w = t[S].pos, E = [0, 0];
      o.indexOf("w") > -1 ? E[0] = -1 : o.indexOf("e") > -1 && (E[0] = 1), o.indexOf("n") > -1 ? E[1] = -1 : o.indexOf("s") > -1 && (E[1] = 1);
      var M = tc([g, x], r, y, E, !0), D = g + M[0], k = x + M[1], T = w[1], m = w[1], _ = w[0], j = w[0];
      E[0] === -1 ? _ = j - D : E[0] === 1 ? j = _ + D : (_ = _ - D / 2, j = j + D / 2), E[1] === -1 ? T = m - k : (E[1] === 1 || (T = m - k / 2), m = T + k);
      var O = ka(T, j, m, _);
      t.forEach(function(R, A) {
        l[A][0] = O[A].pos[0] - R.pos[0], l[A][1] = O[A].pos[1] - R.pos[1];
      });
    } else
      t.forEach(function(R, A) {
        var z = R.direction;
        z && (z.indexOf(d) > -1 && (l[A][0] = r[0]), z.indexOf(h) > -1 && (l[A][1] = r[1]));
      }), d && (l[1][0] = r[0] / 2, l[5][0] = r[0] / 2), h && (l[3][1] = r[1] / 2, l[7][1] = r[1] / 2);
  } else o && !s ? u.forEach(function(R) {
    var A = R === "n" || R === "s";
    t.forEach(function(z, W) {
      var H = z.direction, F = z.horizontal, q = z.vertical;
      !H || H.indexOf(R) === -1 || (l[W] = [
        A || !F ? 0 : r[0],
        !A || !q ? 0 : r[1]
      ]);
    });
  }) : l[e] = r;
  return l;
}
function gv(t, e) {
  var r = N(pu(t, e), 2), n = r[0], a = r[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, u = l.type, c = l.poses, f = l.splitter, d = c.map(function(S) {
    return S.pos;
  });
  if (u === "polygon")
    d.splice(s, 0, [n, a]);
  else if (u === "inset") {
    var h = lv.indexOf(s), v = uv.indexOf(s), g = c.length;
    if (fv(c, d, 8, h, v, n, a, d[4][0], d[4][1], d[0][0], d[0][1]), g === c.length)
      return;
  } else
    return;
  var x = No(t, o, d), y = "".concat(u, "(").concat(x.join(f), ")");
  ct(t, "onClip", Et(t, e, P({ clipEventType: "added", clipType: u, poses: d, clipStyles: x, clipStyle: y, distX: 0, distY: 0 }, ue({
    clipPath: y
  }, e))));
}
function mv(t, e) {
  var r = e.datas, n = r.clipPath, a = r.clipIndex, i = n, o = i.type, s = i.poses, l = i.splitter, u = s.map(function(h) {
    return h.pos;
  }), c = u.length;
  if (o === "polygon")
    s.splice(a, 1), u.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (cv(s, u, a, 8, c), c === s.length))
      return;
  } else
    return;
  var f = No(t, n, u), d = "".concat(o, "(").concat(f.join(l), ")");
  ct(t, "onClip", Et(t, e, P({ clipEventType: "removed", clipType: o, poses: u, clipStyles: f, clipStyle: d, distX: 0, distY: 0 }, ue({
    clipPath: d
  }, e))));
}
var xv = {
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
    var r = t.props, n = r.customClipPath, a = r.defaultClipPath, i = r.clipArea, o = r.zoom, s = r.groupable, l = t.getState(), u = l.target, c = l.width, f = l.height, d = l.allMatrix, h = l.is3d, v = l.left, g = l.top, x = l.pos1, y = l.pos2, S = l.pos3, w = l.pos4, E = l.clipPathState, M = l.snapBoundInfos, D = l.rotation;
    if (!u || s)
      return [];
    var k = al(u, c, f, a || "inset", E || n);
    if (!k)
      return [];
    var T = h ? 4 : 3, m = k.type, _ = k.poses, j = _.map(function(ht) {
      var yt = Ft(d, ht.pos, T);
      return [
        yt[0] - v,
        yt[1] - g
      ];
    }), O = [], R = [], A = m === "rect", z = m === "inset", W = m === "polygon";
    if (A || z || W) {
      var H = z ? j.slice(0, 8) : j;
      R = H.map(function(ht, yt) {
        var Tt = yt === 0 ? H[H.length - 1] : H[yt - 1], xt = $t(Tt, ht), vt = Hu(Tt, ht);
        return e.createElement("div", { key: "clipLine".concat(yt), className: gt("line", "clip-line", "snap-control"), "data-clip-index": yt, style: {
          width: "".concat(vt, "px"),
          transform: "translate(".concat(Tt[0], "px, ").concat(Tt[1], "px) rotate(").concat(xt, "rad) scaleY(").concat(o, ")")
        } });
      });
    }
    if (O = j.map(function(ht, yt) {
      return e.createElement("div", { key: "clipControl".concat(yt), className: gt("control", "clip-control", "snap-control"), "data-clip-index": yt, style: {
        transform: "translate(".concat(ht[0], "px, ").concat(ht[1], "px) rotate(").concat(D, "rad) scale(").concat(o, ")")
      } });
    }), z && O.push.apply(O, Q([], N(j.slice(8).map(function(ht, yt) {
      return e.createElement("div", { key: "clipRadiusControl".concat(yt), className: gt("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + yt, style: {
        transform: "translate(".concat(ht[0], "px, ").concat(ht[1], "px) rotate(").concat(D, "rad) scale(").concat(o, ")")
      } });
    })), !1)), m === "circle" || m === "ellipse") {
      var F = k.left, q = k.top, V = k.radiusX, L = k.radiusY, rt = N(mt(Ft(d, [F, q], T), Ft(d, [0, 0], T)), 2), at = rt[0], Z = rt[1], nt = "none";
      if (!i) {
        for (var tt = Math.max(10, V / 5, L / 5), ot = [], it = 0; it <= tt; ++it) {
          var ft = Math.PI * 2 / tt * it;
          ot.push([
            V + (V - o) * Math.cos(ft),
            L + (L - o) * Math.sin(ft)
          ]);
        }
        ot.push([V, -2]), ot.push([-2, -2]), ot.push([-2, L * 2 + 2]), ot.push([V * 2 + 2, L * 2 + 2]), ot.push([V * 2 + 2, -2]), ot.push([V, -2]), nt = "polygon(".concat(ot.map(function(ht) {
          return "".concat(ht[0], "px ").concat(ht[1], "px");
        }).join(", "), ")");
      }
      O.push(e.createElement("div", { key: "clipEllipse", className: gt("clip-ellipse", "snap-control"), style: {
        width: "".concat(V * 2, "px"),
        height: "".concat(L * 2, "px"),
        clipPath: nt,
        transform: "translate(".concat(-v + at, "px, ").concat(-g + Z, "px) ").concat(Ba(d))
      } }));
    }
    if (i) {
      var bt = we(Q([x, y, S, w], N(j), !1)), J = bt.width, lt = bt.height, wt = bt.left, pt = bt.top;
      if (W || A || z) {
        var ot = z ? j.slice(0, 8) : j;
        O.push(e.createElement("div", { key: "clipArea", className: gt("clip-area", "snap-control"), style: {
          width: "".concat(J, "px"),
          height: "".concat(lt, "px"),
          transform: "translate(".concat(wt, "px, ").concat(pt, "px)"),
          clipPath: "polygon(".concat(ot.map(function(yt) {
            return "".concat(yt[0] - wt, "px ").concat(yt[1] - pt, "px");
          }).join(", "), ")")
        } }));
      }
    }
    return M && ["vertical", "horizontal"].forEach(function(ht) {
      var yt = M[ht], Tt = ht === "horizontal";
      yt.isSnap && R.push.apply(R, Q([], N(yt.snap.posInfos.map(function(xt, vt) {
        var kt = xt.pos, zt = mt(Ft(d, Tt ? [0, kt] : [kt, 0], T), [v, g]), qt = mt(Ft(d, Tt ? [c, kt] : [kt, f], T), [v, g]);
        return Cn(e, "", zt, qt, o, "clip".concat(ht, "snap").concat(vt), "guideline");
      })), !1)), yt.isBound && R.push.apply(R, Q([], N(yt.bounds.map(function(xt, vt) {
        var kt = xt.pos, zt = mt(Ft(d, Tt ? [0, kt] : [kt, 0], T), [v, g]), qt = mt(Ft(d, Tt ? [c, kt] : [kt, f], T), [v, g]);
        return Cn(e, "", zt, qt, o, "clip".concat(ht, "bounds").concat(vt), "guideline", "bounds", "bold");
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
    var r = t.state, n = t.props, a = n.defaultClipPath, i = n.customClipPath, o = r.target, s = r.width, l = r.height, u = e.inputEvent ? e.inputEvent.target : null, c = u && u.getAttribute("class") || "", f = e.datas, d = al(o, s, l, a || "inset", i);
    if (!d)
      return !1;
    var h = d.clipText, v = d.type, g = d.poses, x = ct(t, "onClipStart", Et(t, e, {
      clipType: v,
      clipStyle: h,
      poses: g.map(function(y) {
        return y.pos;
      })
    }));
    return x === !1 ? (f.isClipStart = !1, !1) : (f.isControl = c && c.indexOf("clip-control") > -1, f.isLine = c.indexOf("clip-line") > -1, f.isArea = c.indexOf("clip-area") > -1 || c.indexOf("clip-ellipse") > -1, f.clipIndex = u ? parseInt(u.getAttribute("data-clip-index"), 10) : -1, f.clipPath = d, f.isClipStart = !0, r.clipPathState = h, Cr(t, e), !0);
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, u = l.isControl, c = l.isLine, f = l.isArea, d = l.clipIndex, h = l.clipPath;
    if (!h)
      return !1;
    var v = Sr(t.props, "clippable"), g = v.keepRatio, x = 0, y = 0, S = o.draggable, w = Fe(e);
    s && S ? (r = N(S.prevBeforeDist, 2), x = r[0], y = r[1]) : (n = N(w, 2), x = n[0], y = n[1]);
    var E = [x, y], M = t.state, D = M.width, k = M.height, T = !f && !u && !c, m = h.type, _ = h.poses, j = h.splitter, O = _.map(function(Ct) {
      return Ct.pos;
    });
    T && (x = -x, y = -y);
    var R = !u || _[d].direction === "nesw", A = m === "inset" || m === "rect", z = _.map(function() {
      return [0, 0];
    });
    if (u && !R) {
      var W = _[d], H = W.horizontal, F = W.vertical, q = [
        x * X(H),
        y * X(F)
      ];
      z = vv(_, d, q, A, g);
    } else R && (z = O.map(function() {
      return [x, y];
    }));
    var V = O.map(function(Ct, Wt) {
      return It(Ct, z[Wt]);
    }), L = Q([], N(V), !1);
    M.snapBoundInfos = null;
    var rt = h.type === "circle", at = h.type === "ellipse";
    if (rt || at) {
      var Z = we(V), nt = X(Z.bottom - Z.top), tt = X(at ? Z.right - Z.left : nt), ot = V[0][1] + nt, it = V[0][0] - tt, ft = V[0][0] + tt;
      rt && (L.push([ft, Z.bottom]), z.push([1, 0])), L.push([Z.left, ot]), z.push([0, 1]), L.push([it, Z.bottom]), z.push([1, 0]);
    }
    var bt = Gu((v.clipHorizontalGuidelines || []).map(function(Ct) {
      return Nt("".concat(Ct), k);
    }), (v.clipVerticalGuidelines || []).map(function(Ct) {
      return Nt("".concat(Ct), D);
    }), D, k), J = [], lt = [];
    if (rt || at)
      J = [L[4][0], L[2][0]], lt = [L[1][1], L[3][1]];
    else if (A) {
      var wt = [L[0], L[2], L[4], L[6]], pt = [z[0], z[2], z[4], z[6]];
      J = wt.filter(function(Ct, Wt) {
        return pt[Wt][0];
      }).map(function(Ct) {
        return Ct[0];
      }), lt = wt.filter(function(Ct, Wt) {
        return pt[Wt][1];
      }).map(function(Ct) {
        return Ct[1];
      });
    } else
      J = L.filter(function(Ct, Wt) {
        return z[Wt][0];
      }).map(function(Ct) {
        return Ct[0];
      }), lt = L.filter(function(Ct, Wt) {
        return z[Wt][1];
      }).map(function(Ct) {
        return Ct[1];
      });
    var ht = [0, 0], yt = Ws(bt, v.clipTargetBounds && { left: 0, top: 0, right: D, bottom: k }, J, lt, 5, 5), Tt = yt.horizontal, xt = yt.vertical, vt = Tt.offset, kt = xt.offset;
    if (Tt.isBound && (ht[1] += vt), xt.isBound && (ht[0] += kt), (at || rt) && z[0][0] === 0 && z[0][1] === 0) {
      var Z = we(V), zt = Z.bottom - Z.top, qt = at ? Z.right - Z.left : zt, Lt = xt.isBound ? X(kt) : xt.snapIndex === 0 ? -kt : kt, Rt = Tt.isBound ? X(vt) : Tt.snapIndex === 0 ? -vt : vt;
      qt -= Lt, zt -= Rt, rt && (zt = Ru(xt, Tt) > 0 ? zt : qt, qt = zt);
      var Gt = L[0];
      L[1][1] = Gt[1] - zt, L[2][0] = Gt[0] + qt, L[3][1] = Gt[1] + zt, L[4][0] = Gt[0] - qt;
    } else if (A && g && u) {
      var ve = N(uc(_), 2), Ne = ve[0], Kr = ve[1], On = Ne && Kr ? Ne / Kr : 0, sr = _[d], lr = sr.direction || "", Ve = L[1][1], ot = L[5][1], it = L[7][0], ft = L[3][0];
      X(vt) <= X(kt) ? vt = le(vt) * X(kt) / On : kt = le(kt) * X(vt) * On, lr.indexOf("w") > -1 ? it -= kt : lr.indexOf("e") > -1 ? ft -= kt : (it += kt / 2, ft -= kt / 2), lr.indexOf("n") > -1 ? Ve -= vt : lr.indexOf("s") > -1 ? ot -= vt : (Ve += vt / 2, ot -= vt / 2);
      var Zr = ka(Ve, ft, ot, it);
      L.forEach(function(U, dt) {
        var Yt;
        Yt = N(Zr[dt].pos, 2), U[0] = Yt[0], U[1] = Yt[1];
      });
    } else
      L.forEach(function(Ct, Wt) {
        var Ue = z[Wt];
        Ue[0] && (Ct[0] -= kt), Ue[1] && (Ct[1] -= vt);
      });
    var Le = No(t, h, V), Jr = "".concat(m, "(").concat(Le.join(j), ")");
    if (M.clipPathState = Jr, rt || at)
      J = [L[4][0], L[2][0]], lt = [L[1][1], L[3][1]];
    else if (A) {
      var wt = [L[0], L[2], L[4], L[6]];
      J = wt.map(function(Wt) {
        return Wt[0];
      }), lt = wt.map(function(Wt) {
        return Wt[1];
      });
    } else
      J = L.map(function(Ct) {
        return Ct[0];
      }), lt = L.map(function(Ct) {
        return Ct[1];
      });
    if (M.snapBoundInfos = Ws(bt, v.clipTargetBounds && { left: 0, top: 0, right: D, bottom: k }, J, lt, 1, 1), S) {
      var ke = M.is3d, Pt = M.allMatrix, Er = ke ? 4 : 3, je = ht;
      s && (je = [
        E[0] + ht[0] - w[0],
        E[1] + ht[1] - w[1]
      ]), S.deltaOffset = jt(Pt, [je[0], je[1], 0, 0], Er);
    }
    return ct(t, "onClip", Et(t, e, P({ clipEventType: "changed", clipType: m, poses: V, clipStyle: Jr, clipStyles: Le, distX: x, distY: y }, ue((a = {}, a[m === "rect" ? "clip" : "clipPath"] = Jr, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var r = e.isDrag, n = e.datas, a = e.isDouble, i = n.isLine, o = n.isClipStart, s = n.isControl;
    return o ? (ct(t, "onClipEnd", ye(t, e, {})), a && (s ? mv(t, e) : i && gv(t, e)), a || r) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, yv = {
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
    return e.isRequest ? e.requestAble === "originDraggable" : te(e.inputEvent.target, gt("origin"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas;
    Cr(t, e);
    var n = Et(t, e, {
      dragStart: se.dragStart(t, new Lr().dragStart([0, 0], e))
    }), a = ct(t, "onDragOriginStart", n);
    return r.startOrigin = t.state.transformOrigin, r.startTargetOrigin = t.state.targetOrigin, r.prevOrigin = [0, 0], r.isDragOrigin = !0, a === !1 ? (r.isDragOrigin = !1, !1) : n;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.isRequest;
    if (!r.isDragOrigin)
      return !1;
    var i = N(Fe(e), 2), o = i[0], s = i[1], l = t.state, u = l.width, c = l.height, f = l.offsetMatrix, d = l.targetMatrix, h = l.is3d, v = t.props.originRelative, g = v === void 0 ? !0 : v, x = h ? 4 : 3, y = [o, s];
    if (a) {
      var S = e.distOrigin;
      (S[0] || S[1]) && (y = S);
    }
    var w = It(r.startOrigin, y), E = It(r.startTargetOrigin, y), M = mt(y, r.prevOrigin), D = Rn(f, d, w, x), k = t.getRect(), T = we(wr(D, u, c, x)), m = [
      k.left - T.left,
      k.top - T.top
    ];
    r.prevOrigin = y;
    var _ = [
      _e(E[0], u, g),
      _e(E[1], c, g)
    ].join(" "), j = se.drag(t, In(e, t.state, m, !!n)), O = Et(t, e, P(P({ width: u, height: c, origin: w, dist: y, delta: M, transformOrigin: _, drag: j }, ue({
      transformOrigin: _,
      transform: j.transform
    }, e)), { afterTransform: j.transform }));
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
function bv(t, e, r, n) {
  var a = t.filter(function(l) {
    var u = l.virtual, c = l.horizontal;
    return c && !u;
  }).length, i = t.filter(function(l) {
    var u = l.virtual, c = l.vertical;
    return c && !u;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    Sv(t, o), o < 4 ? s.pos[0] = r : s.pos[1] = n;
  }
}
function Sv(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(r) {
    r.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(r) {
    r.virtual = !1;
  }));
}
function Cv(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(r) {
    r.virtual = !0;
  }) : t.slice(e).forEach(function(r) {
    r.virtual = !0;
  });
}
function il(t, e, r, n, a) {
  n === void 0 && (n = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = nr(t), lc(i, e, r, 0, 0, n, a);
}
function ol(t, e, r, n, a) {
  var i = t.state, o = i.width, s = i.height, l = Oo(a, t.props.roundRelative, o, s), u = l.raws, c = l.styles, f = l.radiusPoses, d = dv(f, u), h = d.horizontals, v = d.verticals, g = c.join(" ");
  i.borderRadiusState = g;
  var x = Et(t, e, P({ horizontals: h, verticals: v, borderRadius: g, width: o, height: s, delta: n, dist: r }, ue({
    borderRadius: g
  }, e)));
  return ct(t, "onRound", x), x;
}
function sl(t) {
  var e, r, n = t.getState().style, a = n.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (r = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && r !== void 0 ? r : "", n.borderRadius = a) : (a = _o(o).borderRadius, n.borderRadius = a));
  }
  return a;
}
var wv = {
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
    return e === !0 || e === "line" ? gt("round-line-clickable") : "";
  },
  requestStyle: function() {
    return ["borderRadius"];
  },
  requestChildStyle: function() {
    return ["borderRadius"];
  },
  render: function(t, e) {
    var r = t.getState(), n = r.target, a = r.width, i = r.height, o = r.allMatrix, s = r.is3d, l = r.left, u = r.top, c = r.borderRadiusState, f = t.props, d = f.minRoundControls, h = d === void 0 ? [0, 0] : d, v = f.maxRoundControls, g = v === void 0 ? [4, 4] : v, x = f.zoom, y = f.roundPadding, S = y === void 0 ? 0 : y, w = f.isDisplayShadowRoundControls, E = f.groupable;
    if (!n)
      return null;
    var M = c || sl(t), D = s ? 4 : 3, k = il(M, a, i, h, !0);
    if (!k)
      return null;
    var T = 0, m = 0, _ = E ? [0, 0] : [l, u];
    return k.map(function(j, O) {
      var R = j.horizontal, A = j.vertical, z = j.direction || "", W = Q([], N(j.pos), !1);
      m += Math.abs(R), T += Math.abs(A), R && z.indexOf("n") > -1 && (W[1] -= S), A && z.indexOf("w") > -1 && (W[0] -= S), R && z.indexOf("s") > -1 && (W[1] += S), A && z.indexOf("e") > -1 && (W[0] += S);
      var H = mt(Ft(o, W, D), _), F = w && w !== "horizontal", q = j.vertical ? T <= g[1] && (F || !j.virtual) : m <= g[0] && (w || !j.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(O), className: gt("control", "border-radius", j.vertical ? "vertical" : "", j.virtual ? "virtual" : ""), "data-radius-index": O, style: {
        display: q ? "block" : "none",
        transform: "translate(".concat(H[0], "px, ").concat(H[1], "px) scale(").concat(x, ")")
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
    n.lineIndex = u, n.controlIndex = l, n.isControl = o, n.isLine = s, Cr(t, e);
    var h = t.props, v = h.roundRelative, g = h.minRoundControls, x = g === void 0 ? [0, 0] : g, y = t.state, S = y.width, w = y.height;
    n.isRound = !0, n.prevDist = [0, 0];
    var E = sl(t), M = il(E || "", S, w, x, !0) || [];
    return n.controlPoses = M, y.borderRadiusState = Oo(M, v, S, w).styles.join(" "), f;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = r.controlPoses;
    if (!r.isRound || !r.isControl || !n.length)
      return !1;
    var a = r.controlIndex, i = N(Fe(e), 2), o = i[0], s = i[1], l = [o, s], u = mt(l, r.prevDist), c = t.props.maxRoundControls, f = c === void 0 ? [4, 4] : c, d = t.state, h = d.width, v = d.height, g = n[a], x = g.vertical, y = g.horizontal, S = n.map(function(E) {
      var M = E.horizontal, D = E.vertical, k = [
        M * y * l[0],
        D * x * l[1]
      ];
      if (M) {
        if (f[0] === 1)
          return k;
        if (f[0] < 4 && M !== y)
          return k;
      } else {
        if (f[1] === 0)
          return k[1] = D * y * l[0] / h * v, k;
        if (x) {
          if (f[1] === 1)
            return k;
          if (f[1] < 4 && D !== x)
            return k;
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
    }), r.prevDist = [o, s], ol(t, e, l, u, w);
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
        Cv(u, o);
      else if (s && (d === !0 || d === "line")) {
        var h = N(pu(t, e), 2), v = h[0], g = h[1];
        bv(u, l, v, g);
      }
      c !== u.filter(function(y) {
        var S = y.virtual;
        return S;
      }).length && ol(t, e, [0, 0], [0, 0], u);
    }
    var x = ye(t, e, {});
    return ct(t, "onRoundEnd", x), r.borderRadiusState = "", x;
  },
  dragGroupControlStart: function(t, e) {
    var r = this.dragControlStart(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Re(t, "roundable", e), o = P({ targets: t.props.targets, events: i.map(function(s, l) {
      return P(P({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] });
    }) }, r);
    return ct(t, "onRoundGroupStart", o), r;
  },
  dragGroupControl: function(t, e) {
    var r = this.dragControl(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Re(t, "roundable", e), o = P({ targets: t.props.targets, events: i.map(function(s, l) {
      return P(P(P({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] }), ue({
        borderRadius: r.borderRadius
      }, s));
    }) }, r);
    return ct(t, "onRoundGroup", o), o;
  },
  dragGroupControlEnd: function(t, e) {
    var r = t.moveables, n = t.props.targets, a = Re(t, "roundable", e);
    Ga(t, "onRound", function(s) {
      var l = P({ targets: t.props.targets, events: a.map(function(u, c) {
        return P(P(P({}, u), { target: n[c], moveable: r[c], currentTarget: r[c] }), ue({
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
function Ev(t, e) {
  var r = e ? 4 : 3, n = At(r), a = "matrix".concat(e ? "3d" : "", "(").concat(n.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var cc = {
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
    var r = t.state, n = r.is3d, a = r.targetMatrix, i = r.inlineTransform, o = n ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(Ql(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = Ev(s, n) ? [] : nr(s);
  },
  resetStyle: function(t) {
    var e = t.datas;
    e.nextStyle = {}, e.nextTransforms = t.datas.startTransforms, e.nextTransformAppendedIndexes = [];
  },
  fillDragStartParams: function(t, e) {
    return Et(t, e, {
      setTransform: function(r) {
        e.datas.startTransforms = Ht(r) ? r : nr(r);
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
    var n = Re(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
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
    var n = Re(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
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
}, fc = {
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
    var r = this, n = Re(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragParams(l, o);
    });
    ct(t, "onRenderGroup", Et(t, e, P(P({ isPinch: !!e.isPinch, targets: t.props.targets, transform: Qn(e), transformObject: {} }, ue(ta(e))), { events: i })));
  },
  dragGroupEnd: function(t, e) {
    var r = this, n = Re(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragEndParams(l, o);
    });
    ct(t, "onRenderGroupEnd", Et(t, e, P({ isPinch: !!e.isPinch, isDrag: e.isDrag, targets: t.props.targets, events: i, transformObject: {}, transform: Qn(e) }, ue(ta(e)))));
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
    return Fr(ba(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), Et(t, e, P({ isPinch: !!e.isPinch, transformObject: r, transform: Qn(e) }, ue(ta(e))));
  },
  fillDragEndParams: function(t, e) {
    var r = {};
    return Fr(ba(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), Et(t, e, P({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: r, transform: Qn(e) }, ue(ta(e))));
  }
};
function gn(t, e, r, n, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", u = a === "After", c = t.state.target, f = i.isRequest, d = n.indexOf("Control") > -1;
  if (!c || s && d && !f && t.areaElement === i.inputEvent.target)
    return !1;
  var h = Q([], N(e), !1);
  if (f) {
    var v = i.requestAble;
    h.some(function(O) {
      return O.name === v;
    }) || h.push.apply(h, Q([], N(t.props.ables.filter(function(O) {
      return O.name === v;
    })), !1));
  }
  if (!h.length || h.every(function(O) {
    return O.dragRelation;
  }))
    return !1;
  var g = i.inputEvent, x;
  l && g && (x = document.elementFromPoint(i.clientX, i.clientY) || g.target);
  var y = !1, S = function() {
    var O;
    y = !0, (O = i.stop) === null || O === void 0 || O.call(i);
  }, w = s && (!t.targetGesto || !t.controlGesto || !t.targetGesto.isFlag() || !t.controlGesto.isFlag());
  w && t.updateRect(a, !0, !1);
  var E = i.datas, M = d ? "controlGesto" : "targetGesto", D = t[M], k = function(O, R, A) {
    if (!(R in O) || D !== t[M])
      return !1;
    var z = O.name, W = E[z] || (E[z] = {});
    if (s && (W.isEventStart = !A || !O[A] || O[A](t, i)), !W.isEventStart)
      return !1;
    var H = O[R](t, P(P({}, i), { stop: S, datas: W, originalDatas: E, inputTarget: x }));
    return t._emitter.off(), s && H === !1 && (W.isEventStart = !1), H;
  };
  w && h.forEach(function(O) {
    O.unset && O.unset(t);
  }), k(cc, "drag".concat(n).concat(a));
  var T = 0, m = 0;
  r.forEach(function(O) {
    if (y)
      return !1;
    var R = "".concat(O).concat(n).concat(a), A = "".concat(O).concat(n, "Condition");
    a === "" && !f && qh(t.state, i);
    var z = h.filter(function(F) {
      return F[R];
    });
    z = z.filter(function(F, q) {
      return F.name && z.indexOf(F) === q;
    });
    var W = z.filter(function(F) {
      return k(F, R, A);
    }), H = W.length;
    y && ++T, H && ++m, !y && s && z.length && !H && (T += z.filter(function(F) {
      var q = F.name, V = E[q];
      return V.isEventStart ? F.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!u || m) && k(fc, "drag".concat(n).concat(a));
  var _ = D !== t[M] || T === r.length;
  if ((l || y || _) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(O) {
    O.state.gestos = {};
  }), h.forEach(function(O) {
    O.unset && O.unset(t);
  })), s && !_ && !f && m && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || _)
    return !1;
  if (!s && m && !o || l) {
    var j = t.props.flushSync || Wu;
    j(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !u && m && !o && gn(t, e, r, n, a + "After", i), !0;
}
function jo(t, e) {
  return function(r, n) {
    var a;
    n === void 0 && (n = r.inputEvent.target);
    var i = n, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || te(i, "moveable-area") || te(i, "moveable-padding") || te(i, "moveable-edgeDraggable");
  };
}
function dc(t, e, r) {
  var n = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(n), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var u = jo(t);
  return hc(t, a, "targetAbles", r, {
    dragStart: u,
    pinchStart: u
  });
}
function pc(t, e) {
  var r = t.controlBox, n = [];
  n.push(r);
  var a = jo(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === r)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return hc(t, n, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function hc(t, e, r, n, a) {
  a === void 0 && (a = {});
  var i = r === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, u = o.preventClickEventOnDrag, c = o.preventClickDefault, f = o.checkInput, d = o.dragFocusedInput, h = o.preventDefault, v = h === void 0 ? !0 : h, g = o.preventRightClick, x = g === void 0 ? !0 : g, y = o.preventWheelClick, S = y === void 0 ? !0 : y, w = o.dragContainer, E = Ge(w, !0), M = {
    preventDefault: v,
    preventRightClick: x,
    preventWheelClick: S,
    container: E || Ce(t.getControlBoxElement()),
    pinchThreshold: l,
    pinchOutside: s,
    preventClickEventOnDrag: i ? u : !1,
    preventClickEventOnDragStart: i ? c : !1,
    preventClickEventByCondition: i ? null : function(T) {
      return t.controlBox.contains(T.target);
    },
    checkInput: i ? f : !1,
    dragFocusedInput: d
  }, D = new iu(e, M), k = n === "Control";
  return ["drag", "pinch"].forEach(function(T) {
    ["Start", "", "End"].forEach(function(m) {
      D.on("".concat(T).concat(m), function(_) {
        var j, O = _.eventType, R = T === "drag" && _.isPinch;
        if (a[O] && !a[O](_)) {
          _.stop();
          return;
        }
        if (!R) {
          var A = T === "drag" ? [T] : ["drag", T], z = Q([], N(t[r]), !1), W = gn(t, z, A, n, m, _);
          W ? (t.props.stopPropagation || m === "Start" && k) && ((j = _ == null ? void 0 : _.inputEvent) === null || j === void 0 || j.stopPropagation()) : _.stop();
        }
      });
    });
  }), D;
}
var Dv = /* @__PURE__ */ (function() {
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
function Mv(t, e, r, n) {
  var a;
  r === void 0 && (r = e);
  var i = yu(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, u = i.transformOrigin, c = i.targetOrigin, f = i.offsetContainer, d = i.hasFixed, h = i.zoom, v = Fp(f, r), g = v.matrixes, x = v.is3d, y = v.offsetContainer, S = v.zoom, w = n, E = 4, M = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, D = l, k = At(E), T = At(E), m = At(E), _ = At(E), j = o.length, O = g.map(function(q) {
    return P(P({}, q), { matrix: q.matrix ? Q([], N(q.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && w && (D = Oe(D, 3, 4), Xi(o)), !x && w && Xi(O), O.forEach(function(q) {
    T = jt(T, q.matrix, E);
  });
  var R = r || or(t), A = ((a = O[0]) === null || a === void 0 ? void 0 : a.target) || wn(R, R, !0).offsetParent, z = O.slice(1).reduce(function(q, V) {
    return jt(q, V.matrix, E);
  }, At(E));
  o.forEach(function(q, V) {
    if (j - 2 === V && (m = k.slice()), j - 1 === V && (_ = k.slice()), !q.matrix) {
      var L = o[V + 1], rt = Yh(q, L, A, E, jt(z, k, E));
      q.matrix = yr(rt, E);
    }
    k = jt(k, q.matrix, E);
  });
  var W = !M && s;
  D || (D = At(W ? 4 : 3));
  var H = Ba(M && D.length === 16 ? Oe(D, 4, 3) : D, W), F = T;
  return T = Zl(T, E, E), {
    hasZoom: h !== 1 || S !== 1,
    hasFixed: d,
    matrixes: o,
    rootMatrix: T,
    originalRootMatrix: F,
    beforeMatrix: m,
    offsetMatrix: _,
    allMatrix: k,
    targetMatrix: D,
    targetTransform: H,
    inlineTransform: t.style.transform,
    transformOrigin: u,
    targetOrigin: c,
    is3d: w,
    offsetContainer: f,
    offsetRootContainer: y
  };
}
function kv(t, e, r, n) {
  r === void 0 && (r = e);
  var a = 0, i = 0, o = 0, s = {}, l = $u(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var u = Mv(t, e, r, n), c = Br(u.allMatrix, u.transformOrigin, a, i);
    s = P(P({}, u), c);
    var f = Br(u.allMatrix, [50, 50], 100, 100);
    o = qu([f.pos1, f.pos2], f.direction);
  }
  var d = 4;
  return P(P(P({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: At(d), rootMatrix: At(d), beforeMatrix: At(d), offsetMatrix: At(d), allMatrix: At(d), targetMatrix: At(d), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function Vi(t, e, r, n, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = ra(), u = ra(), c = ra(), f = ra(), d = [0, 0], h = {}, v = kv(e, r, a, !0);
  if (e) {
    var g = he(e);
    i.forEach(function(O) {
      h[O] = g(O);
    });
    var x = v.is3d ? 4 : 3, y = Br(v.offsetMatrix, It(v.transformOrigin, Jl(v.targetMatrix, x)), v.width, v.height);
    o = y.direction, s = It(y.origin, [y.left - v.left, y.top - v.top]), f = vn(v.offsetRootContainer);
    var S = wn(n, n, !0).offsetParent || v.offsetRootContainer;
    if (v.hasZoom) {
      var w = Br(jt(v.originalRootMatrix, v.allMatrix), v.transformOrigin, v.width, v.height), E = Br(v.originalRootMatrix, Ea(he(S)("transformOrigin")).map(function(O) {
        return parseFloat(O);
      }), S.offsetWidth, S.offsetHeight);
      if (l = ci(w, f), c = ci(E, f, S, !0), t) {
        var M = w.left, D = w.top;
        u = ci({
          left: M,
          top: D,
          bottom: D,
          right: D
        }, f);
      }
    } else {
      l = vn(e), c = Gp(S), t && (u = vn(t));
      var k = c.left, T = c.top, m = c.clientLeft, _ = c.clientTop, j = [
        l.left - k,
        l.top - T
      ];
      d = mt(Xr(v.rootMatrix, j, 4), [m + v.left, _ + v.top]);
    }
  }
  return P({ targetClientRect: l, containerClientRect: c, moveableClientRect: u, rootContainerClientRect: f, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: h, offsetDelta: d }, v);
}
function ll(t) {
  var e = t.pos1, r = t.pos2, n = t.pos3, a = t.pos4;
  if (!e || !r || !n || !a)
    return null;
  var i = br([e, r, n, a]), o = [i.minX, i.minY], s = mt(t.origin, o);
  return e = mt(e, o), r = mt(r, o), n = mt(n, o), a = mt(a, o), P(P({}, t), {
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
  _n(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.state = P({ container: null, gestos: {}, renderLines: [
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]]
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, Vi(null)), r.renderState = {}, r.enabledAbles = [], r.targetAbles = [], r.controlAbles = [], r.rotation = 0, r.scale = [1, 1], r.isMoveableMounted = !1, r.isUnmounted = !1, r.events = {
      mouseEnter: null,
      mouseLeave: null
    }, r._emitter = new kn(), r._prevOriginalDragTarget = null, r._originalDragTarget = null, r._prevDragTarget = null, r._dragTarget = null, r._prevPropTarget = null, r._propTarget = null, r._prevDragArea = !1, r._isPropTargetChanged = !1, r._hasFirstTarget = !1, r._reiszeObserver = null, r._observerId = 0, r._mutationObserver = null, r._rootContainer = null, r._viewContainer = null, r._viewClassNames = [], r._store = {}, r.checkUpdateRect = function() {
      if (!r.isDragging()) {
        var n = r.props.parentMoveable;
        if (n) {
          n.checkUpdateRect();
          return;
        }
        gd(r._observerId), r._observerId = Vl(function() {
          r.isDragging() || r.updateRect();
        });
      }
    }, r._onPreventClick = function(n) {
      n.stopPropagation(), n.preventDefault();
    }, r;
  }
  return e.prototype.render = function() {
    var r = this.props, n = this.getState(), a = r.parentPosition, i = r.className, o = r.target, s = r.zoom, l = r.cspNonce, u = r.translateZ, c = r.cssStyled, f = r.groupable, d = r.linePadding, h = r.controlPadding;
    this._checkUpdateRootContainer(), this.checkUpdate(), this.updateRenderPoses();
    var v = N(a || [0, 0], 2), g = v[0], x = v[1], y = n.left, S = n.top, w = n.target, E = n.direction, M = n.hasFixed, D = n.offsetDelta, k = r.targets, T = this.isDragging(), m = {};
    this.getEnabledAbles().forEach(function(z) {
      m["data-able-".concat(z.name.toLowerCase())] = !0;
    });
    var _ = this._getAbleClassName(), j = k && k.length && (w || f) || o || !this._hasFirstTarget && this.state.isPersisted, O = this.controlBox || this.props.firstRenderState || this.props.persistData, R = [y - g, S - x];
    !f && r.useAccuratePosition && (R[0] += D[0], R[1] += D[1]);
    var A = {
      position: M ? "fixed" : "absolute",
      display: j ? "block" : "none",
      visibility: O ? "visible" : "hidden",
      transform: "translate3d(".concat(R[0], "px, ").concat(R[1], "px, ").concat(u, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return d && (A["--moveable-line-padding"] = d), h && (A["--moveable-control-padding"] = h), et.createElement(
      c,
      P({ cspNonce: l, ref: rr(this, "controlBox"), className: "".concat(gt("control-box", E === -1 ? "reverse" : "", T ? "dragging" : ""), " ").concat(_, " ").concat(i) }, m, { onClick: this._onPreventClick, style: A }),
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
    a && this._changeAbleViewClassNames([]), Ar(this, !1), Ar(this, !0);
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
    return r && (((n = r.getAttribute) === null || n === void 0 ? void 0 : n.call(r, "class")) || "").indexOf(go) > -1;
  }, e.prototype.dragStart = function(r, n) {
    n === void 0 && (n = r.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && jo(this)({ inputEvent: r }, n) ? a.isFlag() || a.triggerDragStart(r) : i && this.isMoveableElement(n) && (i.isFlag() || i.triggerDragStart(r)), this;
  }, e.prototype.hitTest = function(r) {
    var n = this.state, a = n.target, i = n.pos1, o = n.pos2, s = n.pos3, l = n.pos4, u = n.targetClientRect;
    if (!a)
      return 0;
    var c;
    if (Sn(r)) {
      var f = r.getBoundingClientRect();
      c = {
        left: f.left,
        top: f.top,
        width: f.width,
        height: f.height
      };
    } else
      c = P({ width: 0, height: 0 }, r);
    var d = c.left, h = c.top, v = c.width, g = c.height, x = Ii([i, o, l, s], u), y = $d(x, [
      [d, h],
      [d + v, h],
      [d + v, h + g],
      [d, h + g]
    ]), S = fn(x);
    return !y || !S ? 0 : Math.min(100, y / S * 100);
  }, e.prototype.isInside = function(r, n) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, u = a.pos4, c = a.targetClientRect;
    return i ? xa([r, n], Ii([o, s, u, l], c)) : !1;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && Wr(!0);
    var s = i.parentMoveable, l = this.state, u = l.target || i.target, c = this.getContainer(), f = s ? s._rootContainer : this._rootContainer, d = Vi(this.controlBox, u, c, c, f || c, this._getRequestStyles());
    if (!u && this._hasFirstTarget && i.persistData) {
      var h = ll(i.persistData);
      for (var v in h)
        d[v] = h[v];
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
    var r = this.state, n = Me(this.state), a = N(n, 4), i = a[0], o = a[1], s = a[2], l = a[3], u = we(n), c = r.width, f = r.height, d = u.width, h = u.height, v = u.left, g = u.top, x = [r.left, r.top], y = It(x, r.origin), S = It(x, r.beforeOrigin), w = r.transformOrigin;
    return {
      width: d,
      height: h,
      left: v,
      top: g,
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
      (n == null ? void 0 : n.isIdle()) === !1 && Hi(this, !1), n == null || n.stop();
    }
    if (!r || r === "control") {
      var n = this.controlGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && Hi(this, !0), n == null || n.stop();
    }
  }, e.prototype.getRotation = function() {
    var r = this.state, n = r.pos1, a = r.pos2, i = r.direction;
    return Kh(n, a, i);
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
    var f = c.request(i), d = a || n.isInstant, h = f.isControl ? "controlAbles" : "targetAbles", v = "".concat(u ? "Group" : "").concat(f.isControl ? "Control" : ""), g = Q([], N(s[h]), !1), x = {
      request: function(y) {
        return gn(i, g, ["drag"], v, "", P(P({}, f.request(y)), { requestAble: r, isRequest: !0 }), d), x;
      },
      requestEnd: function() {
        return gn(i, g, ["drag"], v, "End", P(P({}, f.requestEnd()), { requestAble: r, isRequest: !0 }), d), x;
      }
    };
    return gn(i, g, ["drag"], v, "Start", P(P({}, f.requestStart(n)), { requestAble: r, isRequest: !0 }), d), d ? x.request(n).requestEnd() : x;
  }, e.prototype.getMoveables = function() {
    return [this];
  }, e.prototype.destroy = function() {
    this.componentWillUnmount();
  }, e.prototype.updateRenderPoses = function() {
    var r = this.getState(), n = this.props, a = n.padding, i = r.originalBeforeOrigin, o = r.transformOrigin, s = r.allMatrix, l = r.is3d, u = r.pos1, c = r.pos2, f = r.pos3, d = r.pos4, h = r.left, v = r.top, g = r.isPersisted, x = n.zoom || 1;
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
    var y = nc(a || {}), S = y.left, w = y.top, E = y.bottom, M = y.right, D = l ? 4 : 3, k = [];
    g ? k = o : this.controlBox && n.groupable ? k = i : k = It(i, [h, v]);
    var T = ma(D, yr(k.map(function(A) {
      return -A;
    }), D), s, yr(o, D)), m = Se(T, u, [-S, -w], D), _ = Se(T, c, [M, -w], D), j = Se(T, f, [-S, E], D), O = Se(T, d, [M, E], D);
    r.renderPoses = [
      m,
      _,
      j,
      O
    ], r.renderLines = [
      [m, _],
      [_, O],
      [O, j],
      [j, m]
    ];
    {
      var R = x / 2;
      r.renderLines = [
        [
          Se(T, u, [-S - R, -w], D),
          Se(T, c, [M + R, -w], D)
        ],
        [
          Se(T, c, [M, -w - R], D),
          Se(T, d, [M, E + R], D)
        ],
        [
          Se(T, d, [M + R, E], D),
          Se(T, f, [-S - R, E], D)
        ],
        [
          Se(T, f, [-S, E + R], D),
          Se(T, u, [-S, -w - R], D)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var r = this.props, n = r.target, a = r.container, i = r.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !n)) {
      this.updateAbles();
      var u = !$i(s, n), c = u || !$i(l, a);
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
    return a[i] || (a[i] = su(r, n)), a[i];
  }, e.prototype.getState = function() {
    var r, n = this.props;
    (n.target || !((r = n.targets) === null || r === void 0) && r.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = n.persistData, o = n.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = ll(i);
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
    var a = this.props, i = a.triggerAblesSimultaneously, o = this.getEnabledAbles(r), s = "drag".concat(n, "Start"), l = "pinch".concat(n, "Start"), u = "drag".concat(n, "ControlStart"), c = na(o, [s, l], i), f = na(o, [u], i);
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
      createElement: et.createElement
    };
    return this.renderState = {}, $h(Qu(na(this.getEnabledAbles(), ["render"], a).map(function(o) {
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
    i && (Ar(this, !1), this.updateState({ gestos: {} })), n || Ar(this, !0), a && r && !this.targetGesto && (this.targetGesto = dc(this, a, "")), !this.controlGesto && n && (this.controlGesto = pc(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var r = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = r.dragArea, this._propTarget = r.target, this._originalDragTarget = r.dragTarget || r.target, this._dragTarget = Ge(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var r = this.props, n = r, a = n.zoom, i = n.hideDefaultLines, o = n.hideChildMoveableDefaultLines, s = n.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), u = {
      createElement: et.createElement
    };
    return l.renderLines.map(function(c, f) {
      return Cn(u, "", c[0], c[1], a, "render-line-".concat(f));
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
        var f = na(u, [c]), d = f.length > 0, h = i[c];
        if (!d) {
          h && (h.destroy(), i[c] = null);
          return;
        }
        h || (h = new Dv(a, r, c), i[c] = h), h.setAbles(f);
      });
    }
  }, e.prototype._checkUpdateRootContainer = function() {
    var r = this.props.rootContainer;
    !this._rootContainer && r && (this._rootContainer = Ge(r, !0));
  }, e.prototype._checkUpdateViewContainer = function() {
    var r = this.props.viewContainer;
    !this._viewContainer && r && (this._viewContainer = Ge(r, !0));
    var n = this._viewContainer;
    n && this._changeAbleViewClassNames(Q(Q([], N(this._getAbleViewClassNames()), !1), [
      this.isDragging() ? nv : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(r) {
    var n = this._viewContainer, a = Ju(r.filter(Boolean), function(u) {
      return u;
    }).map(function(u) {
      var c = N(u, 1), f = c[0];
      return f;
    }), i = this._viewClassNames, o = po(i, a), s = o.removed, l = o.added;
    s.forEach(function(u) {
      Ul(n, i[u]);
    }), l.forEach(function(u) {
      so(n, a[u]);
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
      var c, f, d, h = u.name, v = ((c = u.className) === null || c === void 0 ? void 0 : c.call(u, n)) || "";
      return (!((f = s[h]) === null || f === void 0) && f.isEventStart || !((d = l[h]) === null || d === void 0) && d.isEventStart) && (v += " ".concat(gt("".concat(h).concat(r, "-dragging")))), v.trim();
    }).filter(Boolean).join(" ");
  }, e.prototype._updateResizeObserver = function(r) {
    var n, a = this.props, i = a.target, o = Ce(this.getControlBoxElement());
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
    var n = this, a, i = this.props, o = i.target, s = Ce(this.getControlBoxElement());
    if (!s.MutationObserver || !o || !i.useMutationObserver) {
      (a = this._mutationObserver) === null || a === void 0 || a.disconnect();
      return;
    }
    if (!(r.target === o && this._mutationObserver)) {
      var l = new s.MutationObserver(function(u) {
        var c, f;
        try {
          for (var d = sp(u), h = d.next(); !h.done; h = d.next()) {
            var v = h.value;
            v.type === "attributes" && v.attributeName === "style" && n.checkUpdateRect();
          }
        } catch (g) {
          c = { error: g };
        } finally {
          try {
            h && !h.done && (f = d.return) && f.call(d);
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
    flushSync: Wu,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})(et.PureComponent), Ao = {
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
    var d = zr(t, "parentPosition", [o, s], function(v) {
      return v.join(",");
    }), h = zr(t, "requestStyles", t.getRequestChildStyles(), function(v) {
      return v.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), Q(Q([], N(a.map(function(v, g) {
      return e.createElement(Hr, { key: "moveable" + g, ref: Yl(t, "moveables", g), target: v, origin: !1, requestStyles: h, cssStyled: n.cssStyled, customStyledMap: n.customStyledMap, useResizeObserver: n.useResizeObserver, useMutationObserver: n.useMutationObserver, hideChildMoveableDefaultLines: n.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: f[g], zoom: u });
    })), !1), N(Qu(c.map(function(v, g) {
      var x = v.pos1, y = v.pos2, S = v.pos3, w = v.pos4, E = [x, y, S, w];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(M, D) {
        var k = N(M, 2), T = k[0], m = k[1];
        return Cn(e, "", mt(E[T], d), mt(E[m], d), u, "group-rect-".concat(g, "-").concat(D));
      });
    }))), !1);
  }
}, _v = Tn("clickable", {
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
      i === -1 && (i = qe(a, function(l) {
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
function Tr(t) {
  var e = t.originalDatas.draggable;
  return e || (t.originalDatas.draggable = {}, e = t.originalDatas.draggable), P(P({}, t), { datas: e });
}
var Tv = Tn("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var r = t.props, n = r.edgeDraggable;
    return n ? Cu(e, "edgeDraggable", n, t.getState().renderPoses, r.zoom) : [];
  },
  dragCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && te(a, gt("direction")) && te(a, gt("edge")) && te(a, gt("edgeDraggable"));
  },
  dragStart: function(t, e) {
    return se.dragStart(t, Tr(e));
  },
  drag: function(t, e) {
    return se.drag(t, Tr(e));
  },
  dragEnd: function(t, e) {
    return se.dragEnd(t, Tr(e));
  },
  dragGroupCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && te(a, gt("direction")) && te(a, gt("line"));
  },
  dragGroupStart: function(t, e) {
    return se.dragGroupStart(t, Tr(e));
  },
  dragGroup: function(t, e) {
    return se.dragGroup(t, Tr(e));
  },
  dragGroupEnd: function(t, e) {
    return se.dragGroupEnd(t, Tr(e));
  },
  unset: function(t) {
    return se.unset(t);
  }
}), vc = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, Iv = [
  cc,
  oc,
  Oh,
  Jh,
  se,
  Tv,
  Li,
  Qh,
  ev,
  vh,
  ov,
  sv,
  av,
  yv,
  xv,
  wv,
  Ao,
  vc,
  _v,
  ic,
  fc
];
function ul(t, e) {
  var r = N(t, 3), n = r[0], a = r[1], i = r[2];
  return (n * e[0] + a * e[1] + i) / Math.sqrt(n * n + a * a);
}
function oa(t, e) {
  var r = N(t, 2), n = r[0], a = r[1];
  return -n * e[0] - a * e[1];
}
function cl(t, e) {
  return Math.max.apply(Math, Q([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function fl(t, e) {
  return Math.min.apply(Math, Q([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function Rv(t, e) {
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
  var f = St(e, ce);
  if (f % 90) {
    var d = f / 180 * Math.PI, h = Math.tan(d), v = -1 / h, g = [zi, Ns], x = [[0, 0], [0, 0]], y = [zi, Ns], S = [[0, 0], [0, 0]];
    t.forEach(function(at) {
      at.forEach(function(Z) {
        var nt = ul([-h, 1, 0], Z), tt = ul([-v, 1, 0], Z);
        g[0] > nt && (x[0] = Z, g[0] = nt), g[1] < nt && (x[1] = Z, g[1] = nt), y[0] > tt && (S[0] = Z, y[0] = tt), y[1] < tt && (S[1] = Z, y[1] = tt);
      });
    });
    var w = N(x, 2), E = w[0], M = w[1], D = N(S, 2), k = D[0], T = D[1], m = [-h, 1, oa([-h, 1], E)], _ = [-h, 1, oa([-h, 1], M)], j = [-v, 1, oa([-v, 1], k)], O = [-v, 1, oa([-v, 1], T)];
    r = N([
      [m, j],
      [m, O],
      [_, j],
      [_, O]
    ].map(function(at) {
      var Z = N(at, 2), nt = Z[0], tt = Z[1];
      return ho(nt, tt)[0];
    }), 4), i = r[0], o = r[1], s = r[2], l = r[3], u = y[1] - y[0], c = g[1] - g[0];
  } else {
    var R = fl(t, 0), A = fl(t, 1), z = cl(t, 0), W = cl(t, 1);
    if (i = [R, A], o = [z, A], s = [R, W], l = [z, W], u = z - R, c = W - A, f % 180) {
      var H = [s, i, l, o];
      n = N(H, 4), i = n[0], o = n[1], s = n[2], l = n[3], u = W - A, c = z - R;
    }
  }
  if (f % 360 > 180) {
    var H = [l, s, o, i];
    a = N(H, 4), i = a[0], o = a[1], s = a[2], l = a[3];
  }
  var F = br([i, o, s, l]), q = F.minX, V = F.minY, L = F.maxX, rt = F.maxY;
  return {
    pos1: i,
    pos2: o,
    pos3: s,
    pos4: l,
    width: u,
    height: c,
    minX: q,
    minY: V,
    maxX: L,
    maxY: rt,
    rotation: e
  };
}
function gc(t, e) {
  var r = e.map(function(n) {
    if (Ht(n)) {
      var a = gc(t, n), i = a.length;
      return i > 1 ? a : i === 1 ? a[0] : null;
    } else {
      var o = xe(t, function(s) {
        var l = s.manager;
        return l.props.target === n;
      });
      return o ? (o.finded = !0, o.manager) : null;
    }
  }).filter(Boolean);
  return r.length === 1 && Ht(r[0]) ? r[0] : r;
}
var Pv = /* @__PURE__ */ (function(t) {
  _n(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.differ = new eu(), r.moveables = [], r.transformOrigin = "50% 50%", r.renderGroupRects = [], r._targetGroups = [], r._hasFirstTargets = !1, r;
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
    }), f = this.props.targetGroups || [], d = gc(c, f), h = s.useDefaultGroupRotate;
    d.push.apply(d, Q([], N(c.filter(function(it) {
      var ft = it.finded;
      return !ft;
    }).map(function(it) {
      var ft = it.manager;
      return ft;
    })), !1));
    var v = [], g = !n || r !== "" && s.updateGroup, x = s.defaultGroupRotate || 0;
    if (!this._hasFirstTargets) {
      var y = (i = s.persistData) === null || i === void 0 ? void 0 : i.rotation;
      y != null && (x = y);
    }
    function S(it, ft, bt) {
      var J = it.map(function(xt) {
        if (Ht(xt)) {
          var vt = S(xt, ft), kt = [vt.pos1, vt.pos2, vt.pos3, vt.pos4];
          return v.push(vt), { poses: kt, rotation: vt.rotation };
        } else
          return {
            poses: Me(xt.state),
            rotation: xt.getRotation()
          };
      }), lt = J.map(function(xt) {
        var vt = xt.rotation;
        return vt;
      }), wt = 0, pt = lt[0], ht = lt.every(function(xt) {
        return Math.abs(pt - xt) < 0.1;
      });
      g ? wt = !h && ht ? pt : x : wt = !h && !bt && ht ? pt : ft;
      var yt = J.map(function(xt) {
        var vt = xt.poses;
        return vt;
      }), Tt = Rv(yt, wt);
      return Tt;
    }
    var w = S(d, this.rotation, !0);
    g && (this.rotation = w.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = f, this.renderGroupRects = v;
    var E = this.transformOrigin, M = this.rotation, D = this.scale, k = w.width, T = w.height, m = w.minX, _ = w.minY, j = Zh([
      [0, 0],
      [k, 0],
      [0, T],
      [k, T]
    ], Po(E, k, T), this.rotation / 180 * Math.PI), O = br(j.result), R = O.minX, A = O.minY, z = " rotate(".concat(M, "deg)") + " scale(".concat(le(D[0]), ", ").concat(le(D[1]), ")"), W = "translate(".concat(-R, "px, ").concat(-A, "px)").concat(z);
    this.controlBox.style.transform = "translate3d(".concat(m, "px, ").concat(_, "px, ").concat(this.props.translateZ || 0, ")"), u.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(E, ";") + "width:".concat(k, "px;height:").concat(T, "px;") + "transform: ".concat(W), o.width = k, o.height = T;
    var H = this.getContainer(), F = Vi(this.controlBox, u, this.controlBox, this.getContainer(), this._rootContainer || H, []), q = [F.left, F.top], V = N(Me(F), 4), L = V[0], rt = V[1], at = V[2], Z = V[3], nt = br([L, rt, at, Z]), tt = [nt.minX, nt.minY], ot = le(D[0] * D[1]);
    F.pos1 = mt(L, tt), F.pos2 = mt(rt, tt), F.pos3 = mt(at, tt), F.pos4 = mt(Z, tt), F.left = m - F.left + tt[0], F.top = _ - F.top + tt[1], F.origin = mt(It(q, F.origin), tt), F.beforeOrigin = mt(It(q, F.beforeOrigin), tt), F.originalBeforeOrigin = It(q, F.originalBeforeOrigin), F.transformOrigin = mt(It(q, F.transformOrigin), tt), u.style.transform = "translate(".concat(-R - tt[0], "px, ").concat(-A - tt[1], "px)") + z, Wr(), this.updateState(P(P({}, F), { posDelta: tt, direction: ot, beforeDirection: ot }), a);
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
    t.prototype._updateTargets.call(this), this._originalDragTarget = this.props.dragTarget || this.areaElement, this._dragTarget = Ge(this._originalDragTarget, !0);
  }, e.prototype._updateEvents = function() {
    var r = this.state, n = this.props, a = this._prevDragTarget, i = n.dragTarget || this.areaElement, o = n.targets, s = this.differ.update(o), l = s.added, u = s.changed, c = s.removed, f = l.length || c.length;
    (f || this._prevOriginalDragTarget !== this._originalDragTarget) && (Ar(this, !1), Ar(this, !0), this.updateState({ gestos: {} })), a !== i && (r.target = null), r.target || (r.target = this.areaElement, this.controlBox.style.display = "block"), r.target && (this.targetGesto || (this.targetGesto = dc(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = pc(this, "GroupControl")));
    var d = !$i(r.container, n.container);
    d && (r.container = n.container), (d || f || this.transformOrigin !== (n.defaultGroupOrigin || "50% 50%") || u.length || o.length && !rc(this._targetGroups, n.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!f;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = P(P({}, Hr.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Hr), Ov = /* @__PURE__ */ (function(t) {
  _n(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.moveables = [], r;
  }
  return e.prototype.render = function() {
    var r = this, n, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], u = l.length, c = this.isUnmounted || !u, f = (n = s == null ? void 0 : s.children) !== null && n !== void 0 ? n : [];
    return c && !u && f.length ? l = f.map(function() {
      return null;
    }) : c || (f = []), et.createElement(o, { cspNonce: i, ref: rr(this, "controlBox"), className: gt("control-box") }, l.map(function(d, h) {
      var v, g, x = (g = (v = a.individualGroupableProps) === null || v === void 0 ? void 0 : v.call(a, d, h)) !== null && g !== void 0 ? g : {};
      return et.createElement(Hr, P({ key: "moveable" + h, ref: Yl(r, "moveables", h) }, a, x, { target: d, wrapperMoveable: r, isWrapperMounted: r.isMoveableMounted, persistData: f[h] }));
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
    return Q([], N(this.moveables), !1);
  }, e.prototype.updateRenderPoses = function() {
  }, e.prototype.checkUpdate = function() {
  }, e.prototype.triggerEvent = function() {
  }, e.prototype.updateAbles = function() {
  }, e.prototype._updateEvents = function() {
  }, e.prototype._updateObserver = function() {
  }, e;
})(Hr);
function mc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (Ee(n)) {
        e[n] && r.push.apply(r, Q([], N(e[n]), !1));
        return;
      }
      Ht(n) ? r.push.apply(r, Q([], N(mc(n, e)), !1)) : r.push(n);
    }
  }), r;
}
function xc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (Ee(n)) {
        e[n] && r.push.apply(r, Q([], N(e[n]), !1));
        return;
      }
      Ht(n) ? r.push(xc(n, e)) : r.push(n);
    }
  }), r;
}
function yc(t, e) {
  return t.length !== e.length || t.some(function(r, n) {
    var a = e[n];
    return !r && !a ? !1 : r != a ? Ht(r) && Ht(a) ? yc(r, a) : !0 : !1;
  });
}
var Nv = /* @__PURE__ */ (function(t) {
  _n(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.refTargets = [], r.selectorMap = {}, r._differ = new eu(), r._elementTargets = [], r._tmpRefTargets = [], r._tmpSelectorMap = {}, r._onChangeTargets = null, r;
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
    this.defaultStyled = su("div", ad(go, xp + a));
  }, e.getTotalAbles = function() {
    return Q([oc, Ao, vc, ic], N(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var r, n = this.constructor;
    n.defaultStyled || n.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = ip(a, ["ables", "props"]), l = N(this._updateRefs(!0), 2), u = l[0], c = l[1], f = mc(u, c), d = f.length > 1, h = n.getTotalAbles(), v = Q(Q([], N(h), !1), N(i || []), !1), g = P(P(P({}, s), o || {}), { ables: v, cssStyled: n.defaultStyled, customStyledMap: n.customStyledMap });
    this._elementTargets = f;
    var x = null, y = this.moveable, S = s.persistData;
    if (S != null && S.children && (d = !0), s.individualGroupable)
      return et.createElement(Ov, P({ key: "individual-group", ref: rr(this, "moveable") }, g, { target: null, targets: f }));
    if (d) {
      var w = xc(u, c);
      if (y && !y.props.groupable && !y.props.individualGroupable) {
        var E = y.props.target;
        E && f.indexOf(E) > -1 && (x = P({}, y.state));
      }
      return et.createElement(Pv, P({ key: "group", ref: rr(this, "moveable") }, g, (r = s.groupableProps) !== null && r !== void 0 ? r : {}, { target: null, targets: f, targetGroups: w, firstRenderState: x }));
    } else {
      var M = f[0];
      if (y && (y.props.groupable || y.props.individualGroupable)) {
        var D = y.moveables || [], k = xe(D, function(T) {
          return T.props.target === M;
        });
        k && (x = P({}, k.state));
      }
      return et.createElement(Hr, P({ key: "single", ref: rr(this, "moveable") }, g, { target: M, firstRenderState: x }));
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
    var n = this.refTargets, a = Ro(this.props.target || this.props.targets), i = typeof document < "u", o = yc(n, a), s = this.selectorMap, l = {};
    return this.refTargets.forEach(function u(c) {
      if (Ee(c)) {
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
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, op([
    Xl(Sp)
  ], e.prototype, "moveable", void 0), e;
})(et.PureComponent), jv = /* @__PURE__ */ (function(t) {
  _n(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = Iv, e;
})(Nv), Ui = function(t, e) {
  return Ui = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Ui(t, e);
};
function Av(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Ui(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
function zv(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var Pn = zv(function(t, e) {
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
Pn.code;
Pn.codes;
Pn.aliases;
var Bv = Pn.names;
Pn.title;
var dl = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, pl = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function bc(t, e) {
  var r = (Bv[t] || e || "").toLowerCase();
  for (var n in dl)
    r = r.replace(n, dl[n]);
  return r.replace(/\s/g, "");
}
function Sc(t, e) {
  e === void 0 && (e = bc(t.keyCode, t.key));
  var r = Gv(t);
  return r.indexOf(e) === -1 && r.push(e), r.filter(Boolean);
}
function Gv(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function hl(t) {
  var e = t.slice();
  return e.sort(function(r, n) {
    var a = pl[r] || 5, i = pl[n] || 5;
    return a - i;
  }), e;
}
var vl, Fv = /* @__PURE__ */ (function(t) {
  Av(e, t);
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
    return Ht(a) ? this.on("".concat(n, ".").concat(hl(a).join(".")), i) : Ee(a) ? this.on("".concat(n, ".").concat(a), i) : this.on(n, a), this;
  }, r.removeEvent = function(n, a, i) {
    return Ht(a) ? this.off("".concat(n, ".").concat(hl(a).join(".")), i) : Ee(a) ? this.off("".concat(n, ".").concat(a), i) : this.off(n, a), this;
  }, r.triggerEvent = function(n, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = bc(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
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
    var l = Sc(a, i);
    l.length > 1 && this.trigger("".concat(n, ".").concat(l.join(".")), s);
  }, e;
})(kn), Ki = function(t, e) {
  return Ki = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Ki(t, e);
};
function Cc(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Ki(t, e);
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
function Lv(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Wv(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function mn(t, e, r) {
  for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function Yv(t) {
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
function Xv(t) {
  if (typeof Map > "u")
    return t.filter(function(r, n) {
      return t.indexOf(r) === n;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(r) {
    return e.has(r) ? !1 : (e.set(r, !0), !0);
  });
}
function Hv(t, e, r) {
  var n = Ie(t);
  return n.elementFromPoint && n.elementFromPoint(e, r) || null;
}
function wc(t, e, r) {
  var n = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || Ie(r).createElement(n);
  for (var u in i)
    l.setAttribute(u, i[u]);
  var c = l.children;
  if (a.forEach(function(d, h) {
    wc(d, c[h], l);
  }), o && o.split(/\s+/g).forEach(function(d) {
    d && !te(l, d) && so(l, d);
  }), s) {
    var f = l.style;
    for (var u in s)
      f[u] = s[u];
  }
  return !e && r && r.appendChild(l), l;
}
function $v(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, u = Lv(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: u,
    children: r
  };
}
function pi(t, e, r) {
  t !== e && r(t, e);
}
function gl(t, e, r) {
  var n;
  r === void 0 && (r = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, u = l.startX, c = l.startY;
  if (e > 0) {
    var f = Math.sqrt((i * i + s * s) / (1 + e * e)), d = e * f;
    i = (i >= 0 ? 1 : -1) * d, s = (s >= 0 ? 1 : -1) * f;
  }
  var h = Math.abs(i), v = Math.abs(s), g = i < 0 ? u - r.left : r.right - u, x = s < 0 ? c - r.top : r.bottom - c;
  n = oo([h, v], [0, 0], [g, x], !!e), h = n[0], v = n[1], i = (i >= 0 ? 1 : -1) * h, s = (s >= 0 ? 1 : -1) * v;
  var y = Math.min(0, i), S = Math.min(0, s), w = u + y, E = c + S;
  return {
    left: w,
    top: E,
    right: w + h,
    bottom: E + v,
    width: h,
    height: v
  };
}
function sa(t) {
  var e = t.getBoundingClientRect(), r = e.left, n = e.top, a = e.width, i = e.height;
  return {
    pos1: [r, n],
    pos2: [r + a, n],
    pos3: [r, n + i],
    pos4: [r + a, n + i]
  };
}
function ml(t, e, r) {
  var n = Pr(t, e), a = n.list, i = n.prevList, o = n.added, s = n.removed, l = n.maintained;
  return mn(mn(mn([], o.map(function(u) {
    return a[u];
  }), !0), s.map(function(u) {
    return i[u];
  }), !0), r ? l.map(function(u) {
    var c = u[1];
    return a[c];
  }) : []);
}
function xl(t) {
  for (var e = 0, r = t.length, n = 1; n < r; ++n)
    e = Math.max(Be(t[n], t[n - 1]), e);
  return e;
}
var Ec = ou(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), Zi = "selecto-selection ".concat(Ec.className), zo = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], qv = mn([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], zo), Dc = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], Vv = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], Uv = /* @__PURE__ */ (function(t) {
  Cc(e, t);
  function e(n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new ru(), a._onDragStart = function(s, l) {
      var u = s.data, c = s.clientX, f = s.clientY, d = s.inputEvent, h = a.options, v = h.selectFromInside, g = h.selectByClick, x = h.rootContainer, y = h.boundContainer, S = h.preventDragFromInside, w = S === void 0 ? !0 : S, E = h.clickBySelectEnd, M = h.dragCondition;
      if (M && !M(s)) {
        s.stop();
        return;
      }
      u.data = {};
      var D = Ce(a.container);
      u.innerWidth = D.innerWidth, u.innerHeight = D.innerHeight, a.findSelectableTargets(u), u.startSelectedTargets = a.selectedTargets, u.scaleMatrix = fo(), u.containerX = 0, u.containerY = 0;
      var k = a.container, T = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (x) {
        var m = a.container.getBoundingClientRect();
        u.containerX = m.left, u.containerY = m.top, u.scaleMatrix = Id(a.container, x);
      }
      if (y) {
        var _ = me(y) && "element" in y ? Zt({
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
        }, j = _.element, O = void 0;
        if (j) {
          Ee(j) ? O = Ie(k).querySelector(j) : j === !0 ? O = a.container : O = j;
          var R = O.getBoundingClientRect();
          _.left && (T.left = R.left), _.top && (T.top = R.top), _.right && (T.right = R.right), _.bottom && (T.bottom = R.bottom);
        }
      }
      u.boundArea = T;
      var A = {
        left: c,
        top: f,
        right: c,
        bottom: f,
        width: 0,
        height: 0
      }, z = [], W = g && !E, H = !1;
      if (!v || W) {
        var F = a._findElement(
          l || d.target,
          // elementFromPoint(clientX, clientY),
          u.selectableTargets
        );
        H = !!F, W && (z = F ? [F] : []);
      }
      var q = !v && H;
      if (q && !g)
        return s.stop(), !1;
      var V = d.type, L = V === "mousedown" || V === "touchstart", rt = !s.isClick && L ? a.emit("dragStart", Zt(Zt({}, s), {
        data: u.data
      })) : !0;
      if (!rt)
        return s.stop(), !1;
      if (a.continueSelect ? (z = ml(a.selectedTargets, z, a.continueSelectWithoutDeselect), u.startPassedTargets = a.selectedTargets) : u.startPassedTargets = [], a._select(z, A, s, !0, q && g && !E && w), u.startX = c, u.startY = f, u.selectFlag = !1, u.preventDragFromInside = !1, d.target) {
        var at = da(u.scaleMatrix, [c - u.containerX, f - u.containerY]);
        a.target.style.cssText += "position: ".concat(x ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(at[0], "px, ").concat(at[1], "px)");
      }
      if (q && g && !E)
        d.preventDefault(), w && (a._selectEnd(u.startSelectedTargets, u.startPassedTargets, A, s, !0), u.preventDragFromInside = !0);
      else {
        u.selectFlag = !0;
        var Z = a.options, nt = Z.scrollOptions, tt = Z.innerScrollOptions, ot = !1;
        if (tt) {
          for (var it = s.inputEvent, ft = it.target, bt = null, J = ft; J && J !== Ie(k).body; ) {
            var lt = getComputedStyle(J).overflow !== "visible";
            if (lt) {
              bt = J;
              break;
            }
            J = J.parentElement;
          }
          bt && (u.innerScrollOptions = Zt({
            container: bt,
            checkScrollEvent: !0
          }, tt === !0 ? {} : tt), a.dragScroll.dragStart(s, u.innerScrollOptions), ot = !0);
        }
        !ot && nt && nt.container && a.dragScroll.dragStart(s, nt), q && g && E && (u.selectFlag = !1, s.preventDrag());
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
      var l = s.data, u = s.inputEvent, c = gl(s, a.options.ratio), f = l.selectFlag, d = a.container;
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
        var h = a._findElement((u == null ? void 0 : u.target) || Hv(d, s.clientX, s.clientY), l.selectableTargets);
        a._select(h ? [h] : [], c, s);
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
      var l = Ie(a.container);
      if (a.gesto.isFlag()) {
        var u = a.dragContainer;
        u === Ce(a.container) && (u = l.documentElement);
        var c = Sn(u) ? [u] : [].slice.call(u), f = s.target;
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
      getElementRect: sa,
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
    var a = this.getElementRect || sa, i = a(n), o = [i.pos1, i.pos2, i.pos4, i.pos3];
    if (a !== sa) {
      var s = n.getBoundingClientRect();
      return Ii(o, s);
    }
    return o;
  }, r.getSelectableElements = function() {
    var n = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (Ia(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (Sn(i))
        a.push(i);
      else if (me(i))
        a.push(i.value || i.current);
      else {
        var s = [].slice.call(Ie(n).querySelectorAll(i));
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
    var s = this.options, l = s.checkOverflow || s.innerScrollOptions, u = Ie(this.container);
    if (l) {
      var c = /* @__PURE__ */ new Map();
      n.selectableInnerScrollParentMap = c, n.selectableInnerScrollPathsList = i.map(function(f, d) {
        for (var h = f.parentElement, v = [], g = [], x = function() {
          var y = c.get(h);
          if (!y) {
            var S = getComputedStyle(h).overflow !== "visible";
            if (S) {
              var w = sa(h);
              y = {
                parentElement: h,
                indexes: [],
                points: [w.pos1, w.pos2, w.pos4, w.pos3],
                paths: mn([], g)
              }, v.push(h), v.forEach(function(E) {
                c.set(E, y);
              }), v = [];
            }
          }
          y ? (h = y.parentElement, c.get(h).indexes.push(d), g.push(h)) : v.push(h), h = h.parentElement;
        }; h && h !== u.body; )
          x();
        return g;
      });
    }
    return s.checkOverflow || (n.selectableInners = i.map(function() {
      return !0;
    })), this._refreshGroups(n), i;
  }, r.clickTarget = function(n, a) {
    var i = Yv(n), o = i.clientX, s = i.clientY, l = {
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
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new Fv(a || Ce(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, r.setClassName = function(n) {
    this.options.className = n, this.target.setAttribute("class", "".concat(Zi, " ").concat(n || ""));
  }, r.setKeyEvent = function() {
    var n = this.options, a = n.toggleContinueSelect, i = n.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, r.setKeyContainer = function(n) {
    var a = this, i = this.options;
    pi(i.keyContainer, n, function() {
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
    pi(i.toggleContinueSelect, n, function() {
      i.toggleContinueSelect = n, a.setKeyEvent();
    });
  }, r.setToggleContinueSelectWithoutDeselect = function(n) {
    var a = this, i = this.options;
    pi(i.toggleContinueSelectWithoutDeselect, n, function() {
      i.toggleContinueSelectWithoutDeselect = n, a.setKeyEvent();
    });
  }, r.setPreventDefault = function(n) {
    this.gesto.options.preventDefault = n;
  }, r.setCheckInput = function(n) {
    this.gesto.options.checkInput = n;
  }, r.initElement = function() {
    var n = this.options, a = n.dragContainer, i = n.checkInput, o = n.preventDefault, s = n.preventClickEventOnDragStart, l = n.preventClickEventOnDrag, u = n.preventClickEventByCondition, c = n.preventRightClick, f = c === void 0 ? !0 : c, d = n.className, h = this.container;
    this.target = wc($v("div", {
      className: "".concat(Zi, " ").concat(d || "")
    }), this.target, h);
    var v = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(Ie(h).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new iu(this.dragContainer, {
      checkWindowBlur: !0,
      container: Ce(h),
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
    }), Jt(document, "selectstart", this._onDocumentSelectStart), this.injectResult = Ec.inject(v, {
      nonce: this.options.cspNonce
    });
  }, r.hitTest = function(n, a, i, o) {
    var s = this.options, l = s.hitRate, u = s.selectByClick, c = n.left, f = n.top, d = n.right, h = n.bottom, v = a.innerGroups, g = a.innerWidth, x = a.innerHeight, y = o == null ? void 0 : o.clientX, S = o == null ? void 0 : o.clientY, w = a.ignoreClick, E = [[c, f], [d, f], [d, h], [c, h]], M = function(F, q) {
      var V = mr(typeof l == "function" ? "".concat(l(q)) : "".concat(l)), L = w ? !1 : xa([y, S], F);
      if (!i && u && L)
        return !0;
      var rt = Pi(E, F);
      if (!rt.length)
        return !1;
      var at = fn(rt), Z = 0;
      if (at === 0 && fn(F) === 0 ? (Z = xl(F), at = xl(rt)) : Z = fn(F), V.unit === "px")
        return at >= V.value;
      var nt = ga(Math.round(at / Z * 100), 0, 100);
      return nt >= Math.min(100, V.value);
    }, D = a.selectableTargets, k = a.selectablePoints, T = a.selectableInners;
    if (!v)
      return D.filter(function(F, q) {
        return T[q] ? M(k[q], D[q]) : !1;
      });
    for (var m = [], _ = Math.floor(c / g), j = Math.floor(d / g), O = Math.floor(f / x), R = Math.floor(h / x), A = _; A <= j; ++A) {
      var z = v[A];
      if (z)
        for (var W = O; W <= R; ++W) {
          var H = z[W];
          H && H.forEach(function(F) {
            var q = k[F], V = T[F], L = D[F];
            V && M(q, L) && m.push(L);
          });
        }
    }
    return Xv(m);
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
        var f = n.gesto.getEventData().innerScrollOptions, d = f == null ? void 0 : f.container, h = !1;
        if (d) {
          var v = u.selectableInnerScrollParentMap, g = v.get(d);
          g && (g.paths.forEach(function(x) {
            var y = v.get(x);
            y.points.forEach(function(S) {
              S[0] -= i, S[1] -= o;
            });
          }), g.indexes.forEach(function(x) {
            u.selectablePoints[x].forEach(function(y) {
              y[0] -= i, y[1] -= o;
            });
          }), h = !0);
        }
        h || u.selectablePoints.forEach(function(x) {
          x.forEach(function(y) {
            y[0] -= i, y[1] -= o;
          });
        }), n._refreshGroups(u), c.left -= i, c.right -= i, c.top -= o, c.bottom -= o, n.gesto.scrollBy(i, o, s.inputEvent), n._checkSelected(n.gesto.getCurrentEvent());
      }
    });
  }, r._select = function(n, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = i.inputEvent, u = i.data, c = this.setSelectedTargets(n), f = Pr(u.startSelectedTargets, n), d = f.added, h = f.removed, v = f.prevList, g = f.list, x = {
      startSelected: v,
      startAdded: d.map(function(y) {
        return g[y];
      }),
      startRemoved: h.map(function(y) {
        return v[y];
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
    var l = o.inputEvent, u = o.isDouble, c = o.data, f = l && l.type, d = f === "mousedown" || f === "touchstart", h = Pr(n, this.selectedTargets), v = h.added, g = h.removed, x = h.prevList, y = h.list, S = Pr(a, this.selectedTargets), w = S.added, E = S.removed, M = S.prevList, D = S.list;
    this.emit("selectEnd", {
      startSelected: n,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: v.map(function(k) {
        return y[k];
      }),
      removed: g.map(function(k) {
        return x[k];
      }),
      afterAdded: w.map(function(k) {
        return D[k];
      }),
      afterRemoved: E.map(function(k) {
        return M[k];
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
    a === void 0 && (a = gl(n, this.options.ratio));
    var i = n.data, o = a.top, s = a.left, l = a.width, u = a.height, c = i.selectFlag, f = i.containerX, d = i.containerY, h = i.scaleMatrix, v = da(h, [s - f, o - d]), g = da(h, [l, u]), x = [];
    if (c) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(v[0], "px, ").concat(v[1], "px);") + "width:".concat(g[0], "px;height:").concat(g[1], "px;");
      var y = this.hitTest(a, i, !0, n);
      x = ml(i.startPassedTargets, y, this.continueSelect && this.continueSelectWithoutDeselect);
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
    var o = Sc(n.inputEvent, n.key), s = [].concat(a), l = Ht(s[0]) ? s : [s];
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
      n.selectableInners = c.map(function(h, v) {
        var g = !1;
        return h.every(function(x) {
          if (g)
            return !0;
          if (x === l)
            return g = !0, !0;
          var y = u.get(x);
          if (y) {
            var S = s[v], w = y.points, E = Pi(S, w);
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
      f.forEach(function(h, v) {
        var g = 1 / 0, x = -1 / 0, y = 1 / 0, S = -1 / 0;
        h.forEach(function(M) {
          var D = Math.floor(M[0] / i), k = Math.floor(M[1] / o);
          g = Math.min(D, g), x = Math.max(D, x), y = Math.min(k, y), S = Math.max(k, S);
        });
        for (var w = g; w <= x; ++w)
          for (var E = y; E <= S; ++E)
            d[w] = d[w] || {}, d[w][E] = d[w][E] || [], d[w][E].push(v);
      }), n.innerGroups = d;
    }
  }, e = Wv([id(zo, function(n, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = Ei("get ".concat(a));
    n[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = Ei("set ".concat(a));
    n[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(n, a, i);
  })], e), e;
})(kn), Kv = /* @__PURE__ */ (function(t) {
  Cc(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})(Uv), Ji = function(t, e) {
  return Ji = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Ji(t, e);
};
function Zv(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Ji(t, e);
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
function Jv(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
var yl = Dc.map(function(t) {
  return Ei("on ".concat(t));
}), Qv = /* @__PURE__ */ (function(t) {
  Zv(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var r = e.prototype;
  return r.render = function() {
    return et.createElement("div", {
      className: Zi,
      ref: rr(this, "selectionElement")
    });
  }, r.componentDidMount = function() {
    var n = this, a = this.props, i = {};
    qv.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new Kv(_a(_a({}, i), {
      portalContainer: this.selectionElement
    })), Dc.forEach(function(o, s) {
      n.selecto.on(o, function(l) {
        var u = n.props, c = u[yl[s]] && u[yl[s]](l);
        c === !1 && l.stop();
      });
    });
  }, r.componentDidUpdate = function(n) {
    var a = this.props, i = this.selecto;
    zo.forEach(function(o) {
      n[o] !== a[o] && (i[o] = a[o]);
    });
  }, r.componentWillUnmount = function() {
    this.selecto.destroy();
  }, Jv([Xl(Vv)], e.prototype, "selecto", void 0), e;
})(et.PureComponent);
const Te = "http://www.w3.org/2000/svg";
function la(t, e) {
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
function bl(t, e, r, n, a, i) {
  e.forEach((o) => {
    if (!o.text) return;
    const s = document.createElementNS(Te, "text");
    s.setAttribute("x", String(r + o.left)), s.setAttribute("y", String(n + o.top + a * 0.82)), s.setAttribute("font-size", String(a)), s.setAttribute("font-family", i.fontFamily || uf), s.setAttribute("font-weight", i.fontWeight || "400"), s.setAttribute("fill", i.color || "#1e293b"), s.setAttribute("xml:space", "preserve"), s.textContent = o.text, t.appendChild(s);
  });
}
function tg(t, e) {
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
function Sl(t, e, r, n, a, i, o) {
  const s = gr(e, r, n, i), l = document.createElementNS(Te, "g");
  l.setAttribute("transform", `translate(${Math.round(s.left)},${Math.round(s.top)})`);
  const u = e.querySelector("canvas");
  if (u) {
    const f = document.createElementNS(Te, "image"), d = gr(u, r, n, i);
    f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("width", String(Math.round(d.width || s.width))), f.setAttribute("height", String(Math.round(d.height || s.height))), f.setAttribute("href", cf(e, a, Math.round(d.width || s.width)) ?? u.toDataURL("image/png")), l.appendChild(f);
  }
  const c = e.querySelector("svg");
  if (c) {
    const f = c.cloneNode(!0), d = c.clientWidth || Number(c.getAttribute("width")) || s.width, h = d > 0 ? s.width / d : 1;
    if (Math.abs(h - 1) > 1e-3) {
      const v = document.createElementNS(Te, "g");
      v.setAttribute("transform", `scale(${h})`), v.appendChild(f), l.appendChild(v);
    } else l.appendChild(f);
  }
  Rl(l, o), t.appendChild(l);
}
function Cl(t, e, r, n) {
  return [...t.querySelectorAll(".gl-layout-item")].sort((a, i) => (Number(a.style.zIndex) || 0) - (Number(i.style.zIndex) || 0)).map((a) => ({ item: a, frame: gr(a, e, r, n) }));
}
function eg(t, e, r, n) {
  let a = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const { frame: f } of t)
    f.left >= e || f.top >= r || f.left + f.width <= 0 || f.top + f.height <= 0 || (a = Math.min(a, f.left), i = Math.min(i, f.top), o = Math.max(o, f.left + f.width), s = Math.max(s, f.top + f.height));
  if (!Number.isFinite(a)) return null;
  const l = Math.max(0, n) * bi, u = Math.max(0, Math.floor(a - l)), c = Math.max(0, Math.floor(i - l));
  return { x: u, y: c, width: Math.min(e, Math.ceil(o + l)) - u, height: Math.min(r, Math.ceil(s + l)) - c };
}
function rg(t, e, r) {
  var v, g;
  const n = yi(e.page), a = ha(e.page)[r.pageIndex ?? 0] ?? { x: 0, y: 0 }, i = t.getBoundingClientRect(), o = r.crop ? eg(Cl(t, i, r.zoom, a), n.width, n.height, r.crop.paddingMm) : null, s = o ? { x: a.x + o.x, y: a.y + o.y } : a, l = o ? o.width : n.width, u = o ? o.height : n.height, c = document.createElementNS(Te, "svg");
  c.setAttribute("xmlns", Te), c.setAttribute("width", String(l)), c.setAttribute("height", String(u)), c.setAttribute("viewBox", `0 0 ${l} ${u}`);
  const f = document.createElementNS(Te, "rect");
  f.setAttribute("width", "100%"), f.setAttribute("height", "100%"), f.setAttribute("fill", "#ffffff"), c.appendChild(f);
  let d = 0;
  for (const { item: x, frame: y } of Cl(t, i, r.zoom, s)) {
    if (y.left >= l || y.top >= u || y.left + y.width <= 0 || y.top + y.height <= 0) continue;
    d += 1;
    const S = x.dataset.title ?? ((v = x.querySelector(".gl-layout-item-head span")) == null ? void 0 : v.textContent) ?? "";
    if (x.classList.contains("has-frame")) {
      const k = document.createElementNS(Te, "rect");
      k.setAttribute("x", String(Math.round(y.left) + 0.5)), k.setAttribute("y", String(Math.round(y.top) + 0.5)), k.setAttribute("width", String(Math.round(y.width) - 1)), k.setAttribute("height", String(Math.round(y.height) - 1)), k.setAttribute("fill", "none"), k.setAttribute("stroke", "#94a3b8"), k.setAttribute("id", an("frame", d, S)), c.appendChild(k);
    }
    const w = x.querySelector(".gl-layout-text-surface");
    if (w) {
      const k = w instanceof HTMLTextAreaElement ? w.value : w.textContent ?? "", T = getComputedStyle(w), m = gr(w, i, r.zoom, s), _ = Number(x.dataset.zoom) || 1, j = (parseFloat(T.fontSize) || 14) * _, O = (parseFloat(T.paddingLeft) || 0) * _, R = (parseFloat(T.paddingTop) || 0) * _, A = ((g = tg(w, k)) == null ? void 0 : g.map((W) => ({ text: W.text, left: W.left * _, top: W.top * _ }))) ?? k.split(`
`).map((W, H) => ({ text: W, left: 0, top: H * j * 1.3 })), z = document.createElementNS(Te, "g");
      z.setAttribute("id", an("text", d, k.trim().split(/\s+/).slice(0, 4).join(" "))), bl(z, A, m.left + O, m.top + R, j, T), c.appendChild(z);
      continue;
    }
    const E = x.querySelector(".gl-layout-plot-host");
    if (!E) continue;
    if (E.__miniPlotCfg) {
      Sl(c, E, i, r.zoom, r.dpi, s, an("plot", d, S));
      continue;
    }
    const M = E.querySelector(".gl-prop-chart");
    if (M) {
      const k = sf(M);
      if (k) {
        const T = gr(M, i, r.zoom, s), m = k.width > 0 ? T.width / k.width : 1, _ = document.createElementNS(Te, "g");
        _.setAttribute("id", an("chart", d, S)), _.setAttribute("transform", `translate(${T.left},${T.top}) scale(${m})`), _.appendChild(k.root), c.appendChild(_);
      }
      continue;
    }
    E.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((k) => {
      const T = (k.textContent ?? "").trim();
      if (!T) return;
      const m = getComputedStyle(k), _ = gr(k, i, r.zoom, s), j = k.offsetWidth > 0 ? _.width / k.offsetWidth : 1;
      bl(c, [{ text: T, left: 0, top: 0 }], _.left, _.top, (parseFloat(m.fontSize) || 12) * j, m);
    });
    const D = an(E.querySelector(".gl-figure-grid") ? "figure" : "strategy", d, S);
    E.querySelectorAll(".mini-plot-cell").forEach((k, T) => Sl(c, k, i, r.zoom, r.dpi, s, `${D}-panel-${T + 1}`)), E.querySelectorAll("svg.gl-strategy-arrows").forEach((k) => {
      const T = gr(k, i, r.zoom, s), m = Number(k.getAttribute("width")) || k.clientWidth || T.width, _ = m > 0 ? T.width / m : 1, j = document.createElementNS(Te, "g");
      j.setAttribute("transform", `translate(${Math.round(T.left)},${Math.round(T.top)}) scale(${_})`), Array.from(k.childNodes).forEach((O) => j.appendChild(O.cloneNode(!0))), Rl(j, `${D}-arrows`), c.appendChild(j);
    });
  }
  const h = o ? { widthMm: l / bi, heightMm: u / bi } : Pl(e.page);
  return lf(c, { widthPx: l, heightPx: u, ...h }), { root: c, width: l, height: u, ...h };
}
function wl(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
function ng(t, e, r) {
  return ha(e.page).map((n, a) => rg(t, e, { dpi: e.page.dpi, zoom: r.zoom, pageIndex: a, crop: r.crop }));
}
const El = 72 / 25.4;
async function ag(t, e, r) {
  const n = e.page.dpi, a = nf(e.name) || "layout";
  if (!t.length) return;
  if (r === "svg") {
    if (t.length === 1) {
      la(new Blob([wl(t[0].root)], { type: "image/svg+xml" }), `${a}.svg`);
      return;
    }
    const u = {};
    t.forEach((c, f) => {
      u[`${a}-p${f + 1}.svg`] = af(wl(c.root));
    }), la(new Blob([vs(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  if (r === "png") {
    if (t.length === 1) {
      la(await gs(await Za(t[0], n), n), `${a}.png`);
      return;
    }
    const u = {};
    for (const [c, f] of t.entries()) {
      const d = await Za(f, n);
      u[`${a}-p${c + 1}.png`] = new Uint8Array(await (await gs(d, n)).arrayBuffer()), await ms();
    }
    la(new Blob([vs(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const i = (u) => {
    const c = u.widthMm * El, f = u.heightMm * El;
    return { width: c, height: f, orientation: c >= f ? "landscape" : "portrait" };
  }, { jsPDF: o } = await import("./jspdf.es.min-DiQX6pdj.js").then((u) => u.j), s = i(t[0]), l = new o({ orientation: s.orientation, unit: "pt", format: [s.width, s.height], compress: !0 });
  for (const [u, c] of t.entries()) {
    const { width: f, height: d, orientation: h } = i(c);
    if (u > 0 && l.addPage([f, d], h), !await of(l, c.root, { width: f, height: d })) {
      const v = await Za(c, n);
      l.addImage(v, "PNG", 0, 0, f, d, void 0, "FAST");
    }
    await ms();
  }
  l.save(`${a}.pdf`);
}
const ig = "", Mc = "{none}", ua = [
  { id: "auto", label: "What differs across the page", template: ig },
  { id: "population", label: "Population", template: "{population}" },
  { id: "file", label: "File", template: "{file}" },
  { id: "sample", label: "Sample id", template: "{sample}" },
  { id: "population-file", label: "Population · file", template: "{population} · {file}" },
  { id: "population-plot", label: "Population · plot", template: "{population} · {plot}" },
  { id: "none", label: "No title", template: Mc }
], hi = "{population}, {file}, {sample}, {x}, {y}, {plot}, {count}, {meta:column}, {popmeta:field}";
function og(t, e) {
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
function Dl(t, e) {
  return t.join(e);
}
function sg(t) {
  const e = t.match(/\{[^}]+\}/g) ?? [];
  if (!e.length) return null;
  const r = t.split(/\{[^}]+\}/);
  if (r[0] !== "" || r[r.length - 1] !== "") return null;
  const n = r.slice(1, -1), a = n[0] ?? " · ";
  return n.some((i) => i !== a) ? null : { tokens: e, separator: a };
}
function Ml(t, e, r, n, a) {
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
function Ta(t, e) {
  return t.trim() === Mc ? "" : t.replace(/\{(population|file|sample|x|y|plot|count|meta:[^}]+|popmeta:[^}]+)\}/g, (n, a) => {
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
function lg(t, e) {
  const r = new Set(t.map((o) => o.sampleId)), n = new Set(t.map((o) => o.populationId)), a = t.some((o) => o.label), i = e != null && e.metadataColumn ? n.size > 1 ? `{meta:${e.metadataColumn}} · {population}` : `{meta:${e.metadataColumn}}` : r.size <= 1 && n.size > 1 ? "{population}" : n.size <= 1 && r.size > 1 ? "{file}" : "{population} · {file}";
  return a ? `${i} · {plot}` : i;
}
const ug = "Unassigned";
function kc(t) {
  const e = {};
  for (const [r, n] of Object.entries(t[0] ?? {}))
    t.every((a) => (a == null ? void 0 : a[r]) === n) && (e[r] = n);
  return e;
}
function _c(t) {
  return ie(t.recipe) && t.recipe.iterated === !0;
}
function kl(t, e, r, n) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(r) : i === "N" ? String(n) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function gi(t, e, r, n, a, i) {
  const o = _c(t), s = { ...t.recipe };
  let l;
  return s.kind === "text" ? s.text = kl(s.text, s.readsFrom ? null : e, r, n) : (o && e && e.populationId ? "populationId" in s && (s.populationId = e.populationId) : o && e && e.sampleIds ? ((s.kind === "biplot" || s.kind === "histogram") && e.sampleIds.length > 1 ? s.pool = { sampleIds: [...e.sampleIds] } : "pool" in s && delete s.pool, "sampleId" in s && !e.sampleIds.includes(s.sampleId) && e.sampleIds.length && (l = s.sampleId, s.sampleId = e.sampleIds[0])) : o && e && "sampleId" in s && s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id), s.title && (s.title = kl(s.title, e, r, n))), {
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
function cg(t, e) {
  if (e)
    for (const r of t) {
      if (r.recipe.kind !== "text" || !r.recipe.readsFrom) continue;
      const n = r.recipe.readsFrom, a = t.find((o) => o.templateId === n && o.offset.x === r.offset.x && o.offset.y === r.offset.y);
      if (!a || !ie(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId, a.unitId);
      i && (r.recipe = { ...r.recipe, text: Ta(r.recipe.text, i) });
    }
}
function fg(t, e, r) {
  const n = dg(t, e);
  for (const a of n) cg(a.items, r);
  return n;
}
function dg(t, e) {
  const r = t.iteration ?? Ol;
  if (r.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((h) => gi(h, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const n = e.length;
  if (r.arrangement.kind === "page-per-unit")
    return e.map((h, v) => ({
      index: v,
      units: [h],
      items: t.items.map((g) => gi(g, h, v + 1, n, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = r.arrangement, l = ff(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const u = a * i, c = l.width + s, f = l.height + s, d = [];
  for (let h = 0; h < n; h += u) {
    const v = e.slice(h, h + u), g = [];
    v.forEach((x, y) => {
      const S = o === "row-major" ? Math.floor(y / i) : y % a, E = { x: (o === "row-major" ? y % i : Math.floor(y / a)) * c, y: S * f };
      for (const M of t.items) g.push(gi(M, x, h + y + 1, n, E, y));
    }), d.push({ index: d.length, units: v, items: g });
  }
  return d;
}
function Tc(t, e, r, n) {
  return e.filter((a) => {
    var i;
    return t.kind === "all" ? !0 : t.kind === "checked" ? r.includes(a.id) : t.kind === "group" ? n[a.id] === t.groupId : (((i = a.metadata) == null ? void 0 : i[t.column]) ?? "") === t.value;
  });
}
function pg(t, e, r, n, a) {
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
  return Tc(t.source, e, r, a).map(i);
}
function hg(t, e, r, n, a, i) {
  var d;
  const o = t.column ?? "";
  if (!o) return [];
  const s = /* @__PURE__ */ new Map(), l = [];
  for (const h of Tc(t.source, e, r, a)) {
    const v = ((d = h.metadata) == null ? void 0 : d[o]) ?? "";
    if (!v) {
      l.push(h);
      continue;
    }
    s.set(v, [...s.get(v) ?? [], h]);
  }
  const u = [...s.keys()], c = i ? [...i.filter((h) => s.has(h)), ...u.filter((h) => !i.includes(h)).sort(xs)] : u.sort(xs), f = (h, v) => {
    const g = new Set(v.map((x) => {
      var y;
      return (y = n.find((S) => S.id === a[x.id])) == null ? void 0 : y.name;
    }));
    return {
      id: `meta:${o}=${h}`,
      name: h,
      fileName: `${v.length} files`,
      ...g.size === 1 && [...g][0] ? { groupName: [...g][0] } : {},
      metadata: kc(v.map((x) => x.metadata)),
      sampleIds: v.map((x) => x.id)
    };
  };
  return [
    ...c.map((h) => f(h, s.get(h))),
    ...l.length ? [f(ug, l)] : []
  ];
}
function vg(t, e, r) {
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
  return fa(e.populations, n).filter(({ popId: s }) => s !== n && i(s)).map(({ popId: s }) => {
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
function gg(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const mg = (t) => [...t].sort((e, r) => e - r);
function mi(t, e) {
  const r = mg(t);
  if (!r.length) return NaN;
  const n = (r.length - 1) * e, a = Math.floor(n), i = Math.ceil(n);
  return r[a] + (r[i] - r[a]) * (n - a);
}
function xg(t, e) {
  const r = e.map((o) => o.value), n = r.length, a = n ? r.reduce((o, s) => o + s, 0) / n : NaN, i = n > 1 ? Math.sqrt(r.reduce((o, s) => o + (s - a) ** 2, 0) / (n - 1)) : 0;
  return {
    label: t,
    points: e,
    n,
    mean: a,
    sd: i,
    median: mi(r, 0.5),
    q1: mi(r, 0.25),
    q3: mi(r, 0.75),
    min: n ? Math.min(...r) : NaN,
    max: n ? Math.max(...r) : NaN
  };
}
function yg(t) {
  const e = [], r = /* @__PURE__ */ new Map();
  for (const n of t)
    r.has(n.group) || (r.set(n.group, []), e.push(n.group)), r.get(n.group).push(n);
  return e.map((n) => xg(n, r.get(n)));
}
function Ic(t) {
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
function bg(t) {
  const e = Math.abs(t) / Math.SQRT2, r = 1 / (1 + 0.3275911 * e), i = r * (0.254829592 + r * (-0.284496736 + r * (1.421413741 + r * (-1.453152027 + r * 1.061405429)))) * Math.exp(-e * e) / 2;
  return t >= 0 ? i : 1 - i;
}
function Sg(t, e) {
  if (e <= 0) return 0;
  const r = Cg(t);
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
function Cg(t) {
  const e = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18];
  let r = t, n = t, a = r + 5.5;
  a -= (r + 0.5) * Math.log(a);
  let i = 1.000000000190015;
  for (const o of e) i += o / ++n;
  return -a + Math.log(2.5066282746310007 * i / r);
}
function wg(t, e) {
  return t > 0 ? Math.max(0, Math.min(1, 1 - Sg(e / 2, t / 2))) : 1;
}
function Eg(t, e) {
  if (t.length < 2 || e.length < 2) return null;
  const r = t.length, n = e.length, { rank: a, ties: i } = Ic([...t, ...e]), s = a.slice(0, r).reduce((h, v) => h + v, 0) - r * (r + 1) / 2, l = r + n, u = r * n / 2, c = Math.sqrt(r * n / 12 * (l + 1 - i / (l * (l - 1))));
  if (!(c > 0)) return { name: "Wilcoxon rank-sum", statistic: s, p: 1, label: "Wilcoxon p = 1" };
  const f = (Math.abs(s - u) - 0.5) / c, d = Math.min(1, 2 * bg(Math.max(0, f)));
  return { name: "Wilcoxon rank-sum", statistic: s, p: d, label: `Wilcoxon ${Rc(d)}` };
}
function Dg(t) {
  const e = t.filter((c) => c.length > 0);
  if (e.length < 2 || e.some((c) => c.length < 2)) return null;
  const r = e.flat(), n = r.length, { rank: a, ties: i } = Ic(r);
  let o = 0, s = 0;
  for (const c of e) {
    const f = a.slice(o, o + c.length).reduce((d, h) => d + h, 0);
    s += f * f / c.length, o += c.length;
  }
  s = 12 / (n * (n + 1)) * s - 3 * (n + 1);
  const l = 1 - i / (n ** 3 - n);
  l > 0 && (s /= l);
  const u = wg(s, e.length - 1);
  return { name: "Kruskal–Wallis", statistic: s, p: u, label: `Kruskal–Wallis ${Rc(u)}` };
}
function Mg(t) {
  const e = t.map((r) => r.points.map((n) => n.value));
  return e.length === 2 ? Eg(e[0], e[1]) : e.length > 2 ? Dg(e) : null;
}
function Rc(t) {
  return Number.isFinite(t) ? t < 1e-3 ? "p < 0.001" : `p = ${t < 0.01 ? t.toFixed(3) : t.toFixed(2)}` : "p = ?";
}
function kg(t, e = 5) {
  const r = t.filter((d) => Number.isFinite(d)), n = Math.min(0, ...r), a = Math.max(...r, n + 1e-9), o = (a - n || 1) / e, s = 10 ** Math.floor(Math.log10(o)), l = [1, 2, 2.5, 5, 10].map((d) => d * s).find((d) => d >= o) ?? s * 10, u = Math.floor(n / l) * l, c = Math.ceil((a + l * 0.15) / l) * l, f = [];
  for (let d = u; d <= c + l / 2; d += l) f.push(Number(d.toFixed(10)));
  return { min: u, max: c, ticks: f };
}
const Pc = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function _g(t, e, r, n, a) {
  var d, h;
  const i = e.find((v) => v.id === t.sampleId) ?? null, o = ((d = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : d.name) ?? "the population", s = t.files === "all" ? e : e.filter((v) => n.includes(v.id)), l = [], u = [];
  for (const v of s) {
    let g = t.populationId;
    if (i && i.tree.id !== v.tree.id) {
      const S = Ir(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        v.tree,
        cr(a)
      );
      if (!S.id) {
        u.push(v.name);
        continue;
      }
      g = S.id;
    }
    let x;
    if (t.statistic === "median") {
      const S = t.channel ? v.sample.index(t.channel) : void 0, w = v.derived.masks[g];
      if (S === void 0 || !w) x = null;
      else {
        const E = v.sample.displayColumn(S), M = [];
        for (let D = 0; D < E.length; D++) w[D] && Number.isFinite(E[D]) && M.push(E[D]);
        x = M.length ? df(M) : null;
      }
    } else
      x = v.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][g];
    if (typeof x != "number" || !Number.isFinite(x)) continue;
    const y = t.groupBy ? ((h = r[v.id]) == null ? void 0 : h[t.groupBy]) ?? "" : v.name;
    l.push({ sampleId: v.id, name: v.name, group: y, value: x });
  }
  const c = yg(l), f = t.statistic === "median" ? `Median ${t.channel ?? ""}`.trim() : Pc[t.statistic];
  return { points: l, groups: c, test: t.test && t.groupBy ? Mg(c) : null, population: o, axis: f, missing: u };
}
const xi = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), Tg = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function Ig({
  data: t,
  recipe: e,
  style: r,
  width: n,
  height: a,
  title: i
}) {
  const o = r.fontTick, s = r.fontAxis, l = r.fontTitle, u = t.groups, c = et.useMemo(() => kg(t.points.map((_) => _.value)), [t.points]), f = 8 + s + 6 + Math.max(...c.ticks.map((_) => xi(_).length), 1) * o * 0.6 + 8, d = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), h = Math.max(0, ...u.map((_) => _.label.length)), v = u.length > 0 && h * o * 0.6 > (n - f - 8) / u.length, g = 8 + (v ? h * o * 0.45 + 10 : o + 8), x = Math.max(20, n - f - 8), y = Math.max(20, a - d - g), S = (_) => d + y - (_ - c.min) / (c.max - c.min || 1) * y, w = u.length ? x / u.length : x, E = (_) => f + (_ + 0.5) * w, M = Math.min(48, w * 0.6), D = r.pubStyle ? "#000000" : "#334155", k = r.pubStyle ? "#d4d4d8" : "#93c5fd", T = r.pubStyle ? "#000000" : "#1d4ed8", m = S(Math.max(c.min, 0));
  return /* @__PURE__ */ C.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: n, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ C.jsxs("svg", { width: n, height: a, viewBox: `0 0 ${n} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ C.jsx("rect", { width: n, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ C.jsx("text", { x: n / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: D, children: i }),
    !t.points.length && /* @__PURE__ */ C.jsx("text", { x: n / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ C.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: D, children: [
      /* @__PURE__ */ C.jsx("line", { x1: f, x2: f, y1: d, y2: d + y, stroke: D }),
      c.ticks.map((_) => /* @__PURE__ */ C.jsxs("g", { children: [
        /* @__PURE__ */ C.jsx("line", { x1: f - 4, x2: f, y1: S(_), y2: S(_), stroke: D }),
        /* @__PURE__ */ C.jsx("text", { x: f - 6, y: S(_), textAnchor: "end", dominantBaseline: "central", children: xi(_) })
      ] }, _)),
      /* @__PURE__ */ C.jsx("text", { transform: `translate(${8 + s} ${d + y / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ C.jsx("line", { x1: f, x2: f + x, y1: m, y2: m, stroke: D })
    ] }),
    /* @__PURE__ */ C.jsx("g", { className: "gl-layout-chart-groups", children: u.map((_, j) => {
      const O = E(j), R = e.showPoints || e.chartType === "dots" ? _.points : [];
      return /* @__PURE__ */ C.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(_.mean) && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
          /* @__PURE__ */ C.jsx("rect", { x: O - M / 2, y: Math.min(S(_.mean), m), width: M, height: Math.abs(m - S(_.mean)), fill: k, stroke: D, strokeWidth: 0.8 }),
          _.n > 1 && _.sd > 0 && /* @__PURE__ */ C.jsxs("g", { stroke: D, strokeWidth: 1, children: [
            /* @__PURE__ */ C.jsx("line", { x1: O, x2: O, y1: S(_.mean - _.sd), y2: S(_.mean + _.sd) }),
            /* @__PURE__ */ C.jsx("line", { x1: O - M / 4, x2: O + M / 4, y1: S(_.mean + _.sd), y2: S(_.mean + _.sd) }),
            /* @__PURE__ */ C.jsx("line", { x1: O - M / 4, x2: O + M / 4, y1: S(_.mean - _.sd), y2: S(_.mean - _.sd) })
          ] })
        ] }),
        e.chartType === "box" && _.n > 0 && /* @__PURE__ */ C.jsxs("g", { stroke: D, strokeWidth: 1, fill: k, children: [
          /* @__PURE__ */ C.jsx("line", { x1: O, x2: O, y1: S(_.min), y2: S(_.q1) }),
          /* @__PURE__ */ C.jsx("line", { x1: O, x2: O, y1: S(_.q3), y2: S(_.max) }),
          /* @__PURE__ */ C.jsx("rect", { x: O - M / 2, y: S(_.q3), width: M, height: Math.max(0.5, S(_.q1) - S(_.q3)) }),
          /* @__PURE__ */ C.jsx("line", { x1: O - M / 2, x2: O + M / 2, y1: S(_.median), y2: S(_.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && _.n > 1 && /* @__PURE__ */ C.jsx("line", { x1: O - M / 2, x2: O + M / 2, y1: S(_.mean), y2: S(_.mean), stroke: D, strokeWidth: 2 }),
        R.map((A, z) => /* @__PURE__ */ C.jsx("circle", { cx: O + Tg(z + j * 31) * M * 0.3, cy: S(A.value), r: Math.max(2, o * 0.28), fill: T, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ C.jsx("title", { children: `${A.name}: ${xi(A.value)}` }) }, A.sampleId)),
        /* @__PURE__ */ C.jsx(
          "text",
          {
            x: O,
            y: d + y + 6,
            textAnchor: v ? "end" : "middle",
            dominantBaseline: "hanging",
            fontSize: o,
            fill: D,
            transform: v ? `rotate(-45 ${O} ${d + y + 6})` : void 0,
            children: _.label
          }
        )
      ] }, _.label || String(j));
    }) }),
    t.test && u.length >= 2 && /* @__PURE__ */ C.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: D, children: [
      /* @__PURE__ */ C.jsx("line", { x1: E(0), x2: E(u.length - 1), y1: d - 4, y2: d - 4, stroke: D }),
      /* @__PURE__ */ C.jsx("text", { x: (E(0) + E(u.length - 1)) / 2, y: d - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const Rg = et.lazy(jf("LayoutImageWall", async () => ({ default: (await import("./LayoutImageWall-apqoDhrd.js")).LayoutImageWall }))), ca = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), Pg = { x: "X (px)", y: "Y (px)", width: "Width (px)", height: "Height (px)" }, on = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], _l = 10, Og = { index: 0, units: [], items: [] }, Ng = {}, Tl = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, jg = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], Ag = [
  { how: "horizontal", label: "Distribute ↔", title: "Equal spacing between three or more items or groups, left to right; the outer two stay where they are" },
  { how: "vertical", label: "Distribute ↕", title: "Equal spacing between three or more items or groups, top to bottom; the outer two stay where they are" }
];
function zg(t) {
  var r, n, a;
  if (!t) return;
  t.stopDrag();
  const e = (r = t.getManager) == null ? void 0 : r.call(t);
  for (const i of ((n = e == null ? void 0 : e.getMoveables) == null ? void 0 : n.call(e)) ?? []) i !== e && ((a = i.stopDrag) == null || a.call(i));
}
function Bg(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function Gg(t, e, r) {
  return e ? r.some((n) => !!n && (t === `${e} · ${n}` || t.startsWith(`${e} · ${n} · `))) : !1;
}
function He(t, e, r) {
  var s, l, u;
  const n = t.recipe;
  if (n.kind === "text") return n.text.split(`
`)[0] || "Text";
  if ((s = n.title) != null && s.trim()) return n.title.trim();
  if (n.kind === "figure") return ((u = (l = n.illustration.figure) == null ? void 0 : l.name) == null ? void 0 : u.trim()) || "Figure";
  if (n.kind === "proportions") return n.settings.plotType === "box" ? "Boxplot" : "Composition";
  if (n.kind === "imagewall") return `${n.populationName || "Population"} · ${n.fileName || "images"}`;
  const a = e.find(({ id: c }) => c === n.sampleId), i = a == null ? void 0 : a.tree.populations[n.populationId];
  if (n.kind === "chart") return `${(i == null ? void 0 : i.name) ?? "Population"} · ${Pc[n.statistic]}`;
  if (n.kind === "strategy")
    return `${(i == null ? void 0 : i.name) ?? "Population"} strategy`;
  const o = xn(n);
  return o ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${o.length} ${Nl("files")}` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function xn(t) {
  return (t.kind === "biplot" || t.kind === "histogram") && t.pool && t.pool.sampleIds.length > 1 ? t.pool.sampleIds : null;
}
function Qi(t, e, r, n) {
  var u;
  const a = ((u = t.pool) == null ? void 0 : u.sampleIds) ?? [t.sampleId], i = e.find(({ id: c }) => c === t.sampleId) ?? e.find(({ id: c }) => a.includes(c)) ?? null, o = [], s = [];
  if (!i) return { members: o, leftOut: s };
  const l = t.kind === "histogram" ? null : t.yChannel;
  for (const c of [i.id, ...a.filter((f) => f !== i.id)]) {
    const f = e.find((v) => v.id === c);
    if (!f) {
      s.push({ name: c, reason: "not loaded" });
      continue;
    }
    const d = Si(t.populationId, f.tree, r, n ?? i.tree.id);
    if (d.missing) {
      s.push({ name: f.name, reason: "no corresponding population" });
      continue;
    }
    const h = f === i ? null : Sf(i.sample, f.sample, t.xChannel, l);
    if (h) {
      s.push({ name: f.name, reason: h });
      continue;
    }
    o.push({ id: f.id, name: f.name, sample: f.sample, tree: f.tree, gating: f.derived, populationId: d.id });
  }
  return { members: o, leftOut: s };
}
function Fg({
  files: t,
  pool: e,
  checkedSampleIds: r,
  groups: n,
  fileGroups: a,
  report: i,
  onChange: o
}) {
  const { t: s } = En(), [l, u] = et.useState(""), c = et.useMemo(
    () => Object.fromEntries(t.filter((g) => g.metadata).map((g) => [g.id, g.metadata])),
    [t]
  ), f = et.useMemo(
    () => Mf(c, [...new Set(Object.values(c).flatMap((g) => Object.keys(g)))].map((g) => ({ name: g }))),
    [c]
  ), d = et.useMemo(() => new Set(t.filter((g) => !e.includes(g.id)).map((g) => g.id)), [t, e]), h = (g) => t.filter((x) => g instanceof Set ? g.has(x.id) : g.includes(x.id)).map((x) => x.id), v = l.trim().toLowerCase();
  return /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-pool", children: [
    /* @__PURE__ */ C.jsxs("div", { className: "gl-figure-actions gl-figure-list-actions", children: [
      /* @__PURE__ */ C.jsx("button", { type: "button", onClick: () => o(h(r)), children: s("Checked files") }),
      /* @__PURE__ */ C.jsx("button", { type: "button", onClick: () => o(t.map((g) => g.id)), children: s("All files") }),
      n.map((g) => /* @__PURE__ */ C.jsx("button", { type: "button", onClick: () => o(t.filter((x) => a[x.id] === g.id).map((x) => x.id)), children: s("Group {name}", { name: g.name }) }, g.id))
    ] }),
    /* @__PURE__ */ C.jsx(
      "input",
      {
        type: "search",
        "aria-label": s("Find files to pool"),
        placeholder: s("Find file / sample…"),
        value: l,
        onChange: (g) => u(g.target.value)
      }
    ),
    /* @__PURE__ */ C.jsx("div", { className: "gl-figure-list gl-layout-pool-list", children: t.filter((g) => !v || `${g.name} ${g.fileName ?? ""}`.toLowerCase().includes(v)).map((g) => /* @__PURE__ */ C.jsxs("label", { className: "gl-figure-row", title: g.fileName && g.fileName !== g.name ? `${g.name} · ${g.fileName}` : g.name, children: [
      /* @__PURE__ */ C.jsx(
        "input",
        {
          type: "checkbox",
          checked: e.includes(g.id),
          onChange: () => o(e.includes(g.id) ? e.filter((x) => x !== g.id) : h([...e, g.id]))
        }
      ),
      /* @__PURE__ */ C.jsx("span", { className: "gl-figure-row-name", children: g.name })
    ] }, g.id)) }),
    f.length > 0 && /* @__PURE__ */ C.jsx("div", { className: "gl-sample-facets gl-figure-facets", "aria-label": s("Select pooled files by metadata"), children: f.map((g) => /* @__PURE__ */ C.jsxs("div", { className: "gl-sample-facet-row", children: [
      /* @__PURE__ */ C.jsx("span", { className: "gl-sample-facet-lock", "aria-hidden": "true" }),
      /* @__PURE__ */ C.jsx("span", { className: "gl-sample-facet-name", title: g.name, children: g.name }),
      /* @__PURE__ */ C.jsx("div", { className: "gl-sample-facet-values", children: g.values.map((x) => {
        const y = kf(x.sampleIds, d), S = x.sampleIds.length, w = y === S ? "all" : y === 0 ? "none" : "some", E = S > 0 ? Math.round(y / S * 100) : 0;
        return /* @__PURE__ */ C.jsxs(
          "button",
          {
            type: "button",
            className: `gl-sample-facet-chip is-${w}`,
            style: w === "some" ? { "--gl-facet-fill": `${E}%` } : void 0,
            "aria-pressed": y === S,
            title: `${x.value}: ${y} of ${S} pooled — ${y === S ? `click to drop all ${S}` : `click to pool all ${S}`}`,
            onClick: () => o(h(new Set(t.filter((M) => !_f(x.sampleIds, d).has(M.id)).map((M) => M.id)))),
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
    ] }, g.name)) }),
    i && /* @__PURE__ */ C.jsxs("p", { className: "gl-hint", children: [
      s("{n} of {m} files pooled", { n: i.pooled, m: i.total }),
      i.leftOut.length > 0 && ` · ${s("Not pooled: {files}", { files: i.leftOut.map((g) => `${g.name} (${g.reason})`).join(", ") })}`,
      i.omittedGates.length > 0 && ` · ${s("Gates not shown: {names} — they differ between the pooled files", { names: i.omittedGates.join(", ") })}`
    ] })
  ] });
}
function Lg({
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
  var j, O;
  const c = et.useRef(null), f = t.recipe, d = JSON.stringify(o), h = et.useMemo(() => cr(r), [r]), v = f.kind === "text" ? null : e.find(({ id: R }) => R === f.sampleId) ?? null, g = xn(f), x = (g == null ? void 0 : g.join("|")) ?? "", y = et.useMemo(
    () => x ? x.split("|").map((R) => e.find((A) => A.id === R) ?? null) : null,
    [e, x]
  ), S = v ? { ...r, ...v.tree } : r, w = f.kind !== "text" && t.templateSampleId && t.templateSampleId !== f.sampleId ? e.find(({ id: R }) => R === t.templateSampleId) ?? null : null, E = f.kind === "text" || !v ? { id: f.kind === "text" ? "" : f.populationId, missing: !1 } : Si(f.populationId, v.tree, h, w == null ? void 0 : w.tree.id), M = E.id, D = E.missing ? ((j = w == null ? void 0 : w.tree.populations[f.kind === "text" ? "" : f.populationId]) == null ? void 0 : j.name) ?? "the population" : null, k = f.kind === "text" ? null : u({ ...f, populationId: M }, void 0, t.unitId), T = (R) => k ? Ta(R, k) : R, m = f.kind === "strategy" ? T(((O = f.title) == null ? void 0 : O.trim()) || "{population}") : T(l), _ = JSON.stringify(f);
  return et.useEffect(() => {
    const R = c.current;
    if (!R || f.kind === "text") return;
    const A = window.setTimeout(() => {
      var nt, tt, ot;
      if (R.innerHTML = "", !v) {
        R.textContent = Nl("The referenced file is unavailable or still loading."), R.className = "gl-layout-plot-host is-missing";
        return;
      }
      const z = S.populations[M];
      if (D || !z) {
        R.textContent = D ? `${v.name} has no population corresponding to ${D}.` : "The referenced population is unavailable.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      R.className = "gl-layout-plot-host";
      const W = Math.max(120, t.width - 8), H = Math.max(120, t.height - 8);
      if (f.kind === "strategy" && ((nt = f.populationIds) != null && nt.length)) {
        const it = v.tree, ft = it.root_population_id ?? "", bt = f.populationIds.map((Rt) => Si(Rt, it, h, w == null ? void 0 : w.tree.id)).filter((Rt) => !Rt.missing).map((Rt) => Rt.id), J = Af(v.sample, it.gates, it.populations, ft, v.derived.masks, bt, { maxEvents: o.maxEvents, globalScales: n }), lt = Math.max(1, f.columns ?? 4), wt = f.layout === "flow" ? zf(J, lt, it.populations) : Bf(J, it.populations);
        if (!wt.length) {
          R.textContent = `${v.name} has none of the strategy's populations.`, R.className = "gl-layout-plot-host is-missing";
          return;
        }
        const pt = f.showArrows !== !1, ht = pt ? Gf(wt, it.populations) : [], yt = pt ? Ff(ht) : 8, Tt = pt ? Lf(ht) : 8, xt = Math.max(120, Math.min(800, f.plotSize ?? 200));
        R.removeAttribute("id");
        const vt = document.createElement("div");
        vt.id = `layout-strategy-${t.id}`, vt.style.width = "max-content", R.appendChild(vt);
        const kt = (Rt) => {
          const Gt = Vf(wt, {
            displayMode: f.displayMode,
            plotSize: xt,
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
            gridGap: yt,
            gridRowGap: Tt,
            canvasScale: s * Rt,
            fontSizes: ca(o),
            contextTitle: m
          });
          Qa().renderMultiStrategyGrid(vt.id, Gt);
        };
        kt(1), pt && Wf(vt);
        const zt = vt.scrollWidth, qt = vt.scrollHeight, Lt = zt > 0 && qt > 0 ? Math.max(0.1, Math.min(4, W / zt, H / qt)) : 1;
        Math.abs(Lt - 1) > 0.01 && (vt.style.zoom = String(Lt), kt(Lt)), Yf(vt, ht, { color: f.arrowColor ?? (o.pubStyle ? "#444444" : null), width: f.arrowWidth ?? 1.5, anchor: f.arrowAnchor ?? "label" });
        return;
      }
      if (f.kind === "strategy") {
        const it = Xf(
          v.sample,
          S.gates,
          S.populations,
          S.root_population_id ?? "",
          M,
          { fullPath: f.fullPath, maxEvents: o.maxEvents }
        ), ft = 8, bt = 26, J = Math.max(1, it.length);
        let lt = 1, wt = 0;
        for (let ht = 1; ht <= J; ht++) {
          const yt = Math.ceil(J / ht), Tt = Math.floor((W - ft * (ht - 1)) / ht), xt = Math.floor((H - bt - ft * (yt - 1)) / yt), vt = Math.min(Tt, xt);
          vt > wt && (wt = vt, lt = ht);
        }
        wt = Math.max(100, Math.min(800, wt));
        const pt = Hf(
          v.sample,
          it,
          null,
          n,
          {
            gateView: ["forward"],
            displayMode: f.displayMode,
            maxEvents: o.maxEvents,
            nColumns: lt,
            plotSize: wt,
            fitToColumns: !1,
            contourThreshold: o.contourThreshold,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateLabelFormat: o.gateLabels,
            fontSizes: ca(o),
            contextTitle: m
          }
        );
        R.id = `layout-strategy-${t.id}`;
        for (const ht of Object.values(pt.plots ?? {})) ht.canvas_scale = s;
        Qa().renderStrategyGrid(R.id, pt);
        return;
      }
      const F = Math.max(120, Math.min(W, H)), q = f.kind === "histogram" ? null : f.yChannel, V = {
        displayMode: f.displayMode,
        maxEvents: o.maxEvents,
        nColumns: 1,
        plotSize: F,
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
        fontSizes: ca(o),
        scaleFontsWithPlot: !0
      }, L = (it, ft) => Qa().renderMiniPlot(R, {
        ...it,
        display_mode: f.displayMode,
        plot_size: F,
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
        title: m,
        contour_levels: o.contourLevels,
        font_sizes: ca(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: "#334155",
        gates: ft
      });
      if (y) {
        const { members: it } = Qi(f, e, h, w == null ? void 0 : w.tree.id), ft = it.length ? $f(it, f.xChannel, q, n, V, h) : null;
        if (!ft) {
          R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
          return;
        }
        L(ft.config, ft.gates);
        return;
      }
      const rt = qf(
        v.sample,
        S.gates,
        S.gate_order,
        S.populations,
        v.derived.masks,
        v.derived.stats.event_count,
        [M],
        [f.xChannel],
        q,
        n,
        V,
        v.derived.gateMasks
      ), at = `${M}|${f.xChannel}`, Z = (tt = rt.plots) == null ? void 0 : tt[at];
      if (!Z) {
        R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      L(Z, ((ot = rt.gate_overlays) == null ? void 0 : ot[at]) ?? []);
    }, 80);
    return () => window.clearTimeout(A);
  }, [
    a,
    i,
    d,
    n,
    t.height,
    t.id,
    t.width,
    _,
    v,
    S.gate_order,
    S.gate_version,
    S.gates,
    S.stored_hierarchies,
    S.populations,
    S.root_population_id,
    M,
    D,
    s,
    m,
    y,
    h
  ]), f.kind === "text" ? /* @__PURE__ */ C.jsx(
    "div",
    {
      className: "gl-layout-text-surface",
      style: { fontSize: f.fontSize, fontWeight: f.bold ? 700 : 400 },
      children: f.text
    }
  ) : /* @__PURE__ */ C.jsx("div", { ref: c, className: "gl-layout-plot-host" });
}
function Wg({
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
  files: h,
  sources: v,
  divisionProfiles: g,
  imageService: x,
  canvasScale: y,
  onTextChange: S,
  onTextFocus: w,
  textEditing: E,
  onTextEditStart: M,
  onTextEditEnd: D,
  onIsolate: k
}) {
  var j;
  const { t: T } = En(), m = Pf(t), _ = m === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / m)), height: Math.max(1, Math.round(t.height / m)) };
  return /* @__PURE__ */ C.jsx(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": m === 1 ? void 0 : m,
      title: `${t.locked ? `${T("Locked")} · ` : ""}${He(t, n)}`,
      "data-title": He(t, n),
      onDoubleClick: k ? (O) => {
        O.stopPropagation(), k();
      } : void 0,
      className: `gl-layout-item${r ? " is-selected" : ""}${t.showFrame ? " has-frame" : ""}${t.recipe.kind === "text" ? " is-text" : ""}${t.locked ? " is-locked" : ""}`,
      style: {
        left: t.x,
        top: t.y,
        width: t.width,
        height: t.height,
        zIndex: t.z
      },
      children: /* @__PURE__ */ C.jsx("div", { className: "gl-layout-item-body", style: m === 1 ? void 0 : { zoom: m, width: _.width, height: _.height }, children: t.recipe.kind === "text" ? /* @__PURE__ */ C.jsx(
        Xg,
        {
          text: t.recipe.text,
          templateText: e ?? t.recipe.text,
          fontSize: t.recipe.fontSize,
          bold: t.recipe.bold,
          editing: E,
          onEditStart: M,
          onEditEnd: D,
          onCommit: S,
          onFocus: w
        }
      ) : t.recipe.kind === "figure" ? /* @__PURE__ */ C.jsx(
        Of,
        {
          recipe: t.recipe,
          files: h,
          sources: v,
          state: a,
          globalScales: i,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8)
        }
      ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ C.jsx(
        Nf,
        {
          recipe: t.recipe,
          samples: h,
          state: a,
          metadataById: d,
          divisionProfiles: g,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8),
          containerId: `layout-proportions-${t.id}`
        }
      ) : t.recipe.kind === "imagewall" ? /* @__PURE__ */ C.jsx(et.Suspense, { fallback: /* @__PURE__ */ C.jsx("div", { className: "gl-layout-plot-host" }), children: /* @__PURE__ */ C.jsx(
        Rg,
        {
          recipe: t.recipe,
          service: x ?? null,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8)
        }
      ) }) : t.recipe.kind === "chart" ? /* @__PURE__ */ C.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ C.jsx(
        Ig,
        {
          data: _g(t.recipe, n, d, f, a),
          recipe: t.recipe,
          style: l,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8),
          title: ((j = t.recipe.title) == null ? void 0 : j.trim()) || He(t, n)
        }
      ) }) : /* @__PURE__ */ C.jsx(
        Lg,
        {
          item: _,
          samples: n,
          state: a,
          globalScales: i,
          dataRevision: o,
          densityColorPower: s,
          style: l,
          canvasScale: y,
          titleTemplate: u,
          describe: c
        }
      ) })
    }
  );
}
const Yg = [
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
function Il({
  effective: t,
  own: e,
  onChange: r
}) {
  const { t: n } = En();
  return /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-style-fields", children: [
    Yg.map(({ key: a, label: i, step: o, integer: s }) => /* @__PURE__ */ C.jsxs(et.Fragment, { children: [
      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline" + (a in e ? " is-own" : ""), children: [
        n(i),
        /* @__PURE__ */ C.jsx(
          de,
          {
            "aria-label": n(i),
            value: a === "maxEvents" && t.maxEvents === 0 ? Es.maxEvents : t[a],
            min: ws[a][0],
            max: ws[a][1],
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
            onChange: (l) => r({ maxEvents: l.target.checked ? 0 : Es.maxEvents })
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
function Xg({
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
  const { t: u } = En(), [c, f] = et.useState(e), d = et.useRef(null);
  et.useEffect(() => {
    if (!a) return;
    f(e);
    const v = d.current;
    v && (v.focus({ preventScroll: !0 }), v.setSelectionRange(v.value.length, v.value.length));
  }, [a]);
  const h = { fontSize: r, fontWeight: n ? 700 : 400 };
  return a ? /* @__PURE__ */ C.jsx(
    "textarea",
    {
      ref: d,
      className: "gl-layout-text-surface",
      "aria-label": "Layout text",
      value: c,
      style: h,
      onChange: (v) => f(v.target.value),
      onFocus: l,
      onBlur: (v) => {
        c !== e && s(c, v.currentTarget.scrollHeight), o();
      },
      onKeyDown: (v) => {
        v.stopPropagation(), v.key === "Escape" && v.currentTarget.blur();
      }
    }
  ) : /* @__PURE__ */ C.jsx(
    "div",
    {
      className: "gl-layout-text-surface is-static",
      style: h,
      title: u("Double-click to edit"),
      onDoubleClick: (v) => {
        v.stopPropagation(), i();
      },
      children: t
    }
  );
}
function $g({
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
  defaultX: h,
  defaultY: v,
  illustrationConfig: g,
  onOpenInIllustration: x,
  plottingSettings: y,
  divisionProfiles: S = Ng,
  imageService: w = null,
  onOpenInPlotting: E,
  dataRevision: M,
  densityColorPower: D,
  onOpenInGating: k,
  onExported: T
}) {
  var ls, us, cs, fs, ds, ps;
  const { t: m } = En(), [_, j] = et.useState([]), [O, R] = et.useState(null), [A, z] = et.useState(!0), [W, H] = et.useState(null), [F, q] = et.useState(null), [V, L] = et.useState([]), [rt, at] = et.useState([]), Z = et.useRef(null), nt = et.useRef(null), [tt, ot] = et.useState(null), [it, ft] = et.useState(null), [bt, J] = et.useState(
    u ?? ((ls = r[0]) == null ? void 0 : ls.id) ?? ""
  ), [lt, wt] = et.useState("item"), [pt, ht] = et.useState(!1), [yt, Tt] = et.useState({ shift: !1, meta: !1 });
  et.useEffect(() => {
    const p = (I) => Tt((B) => {
      const G = { shift: I.shiftKey, meta: I.metaKey || I.ctrlKey };
      return G.shift === B.shift && G.meta === B.meta ? B : G;
    }), b = () => Tt((I) => I.shift || I.meta ? { shift: !1, meta: !1 } : I);
    return window.addEventListener("keydown", p), window.addEventListener("keyup", p), window.addEventListener("blur", b), () => {
      window.removeEventListener("keydown", p), window.removeEventListener("keyup", p), window.removeEventListener("blur", b);
    };
  }, []);
  const [xt, vt] = et.useState(1), kt = et.useRef(xt);
  kt.current = xt;
  const [zt, qt] = et.useState(xt);
  et.useEffect(() => {
    const p = window.setTimeout(() => qt(xt), 250);
    return () => window.clearTimeout(p);
  }, [xt]);
  const Lt = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * zt)), [Rt, Gt] = et.useState("pdf"), [ve, Ne] = et.useState(!1), [Kr, On] = et.useState(3), [sr, lr] = et.useState(!1), Ve = et.useRef(null), Zr = et.useRef(null), Le = (p) => {
    var b;
    j(p), (b = Ve.current) == null || b.focus({ preventScroll: !0 });
  }, Jr = (p) => Le(p ? [p] : []), ke = pf(
    r,
    r.map((p) => p.id),
    f,
    M
  ), Pt = et.useMemo(
    () => ke.current ? ke.sources.map((p) => ({ ...p, derived: p.gating })) : [],
    [ke.current, ke.sources]
  ), Er = et.useMemo(
    () => Object.fromEntries(r.map((p) => [p.id, p.metadata])),
    [r]
  ), je = et.useMemo(() => cr(f), [f]), Ct = r.length === 0 || ke.current && ke.pending === 0, Wt = et.useRef([]), Ue = et.useRef([]), U = t.sheets.find(({ id: p }) => p === t.activeSheetId) ?? t.sheets[0], dt = (U == null ? void 0 : U.iteration) ?? Ol, Yt = et.useMemo(() => {
    const p = U == null ? void 0 : U.items.find((I) => ie(I.recipe) && I.recipe.iterated === !0), b = p && "sampleId" in p.recipe ? p.recipe.sampleId : u;
    return Pt.find(({ id: I }) => I === b) ?? Pt[0] ?? null;
  }, [U, Pt, u]), Ke = et.useMemo(
    () => dt.mode === "populations" ? Yt ? vg(dt, Yt.tree, r.find(({ id: p }) => p === Yt.id) ?? Yt) : [] : dt.mode === "metadata" ? hg(dt, r, n, a, i, s == null ? void 0 : s[dt.column ?? ""]) : pg(dt, r, n, a, i),
    [dt, r, n, a, i, Yt, s]
  ), Dr = et.useCallback((p, b, I) => {
    var ut;
    const B = r.find(({ id: _t }) => _t === p.sampleId) ?? null, G = Pt.find(({ id: _t }) => _t === p.sampleId) ?? null;
    let $ = p.populationId;
    if (G && b && b !== p.sampleId) {
      const _t = Pt.find(({ id: ee }) => ee === b);
      if (_t && _t.tree.id !== G.tree.id) {
        const ee = Ir({ hierarchyId: _t.tree.id, populationId: p.populationId }, G.tree, cr(f));
        ee.id && ($ = ee.id);
      }
    }
    const Y = G == null ? void 0 : G.tree.populations[$], st = xn(p);
    if (st && p.kind !== "strategy") {
      const { members: _t } = Qi(p, Pt, je, b ? (ut = Pt.find(({ id: Ut }) => Ut === b)) == null ? void 0 : ut.tree.id : void 0), ee = _t.reduce((Ut, hs) => Ut + (hs.gating.stats.event_count[hs.populationId] ?? 0), 0), be = I ? Ke.find((Ut) => Ut.id === I) : void 0;
      return Ml(
        p,
        { name: be != null && be.sampleIds ? be.name : `${st.length} files`, fileName: `${st.length} files`, metadata: kc(st.map((Ut) => Er[Ut])) },
        Y ? { id: $, name: Y.name } : null,
        _t.length ? ee : void 0,
        l
      );
    }
    const Dt = G == null ? void 0 : G.derived.stats.event_count[$];
    return Ml(
      p.kind === "strategy" ? {} : p,
      B ? { name: B.name, fileName: B.fileName ?? B.name, metadata: B.metadata } : null,
      Y ? { id: $, name: Y.name } : null,
      typeof Dt == "number" ? Dt : void 0,
      l
    );
  }, [r, Pt, f, l, je, Er, Ke]), ge = et.useMemo(
    () => U ? fg(U, Ke, Dr) : [],
    [U, Ke, Dr]
  ), [Fa, Mr] = et.useState(0), [Bo, Oc] = et.useState(!1), [Nc, jc] = et.useState(" · "), Go = et.useMemo(
    () => [...new Set(Object.values(l ?? {}).flatMap((p) => Object.keys(p)))].sort(),
    [l]
  ), Fo = et.useMemo(() => og(o, Go), [o, Go]), Ae = Math.min(Fa, Math.max(0, ge.length - 1)), Vt = ge[Ae] ?? Og, Lo = ((us = U == null ? void 0 : U.titleTemplate) == null ? void 0 : us.trim()) || lg(
    Vt.items.flatMap((p) => {
      var b;
      return ie(p.recipe) ? [{ sampleId: ((b = xn(p.recipe)) == null ? void 0 : b.join(",")) ?? p.recipe.sampleId, populationId: p.recipe.populationId, label: p.recipe.kind === "strategy" ? void 0 : p.recipe.label }] : [];
    }),
    dt.mode === "metadata" ? { metadataColumn: dt.column } : void 0
  );
  et.useEffect(() => {
    Fa !== Ae && Mr(Ae);
  }, [Fa, Ae]);
  const Qr = (p) => p.split("::")[0], ae = [...new Set(_.map(Qr))], fe = (U == null ? void 0 : U.items.filter(({ id: p }) => ae.includes(p))) ?? [], K = fe.length === 1 ? fe[0] : null, ze = K ? Vt.items.find((p) => p.templateId === K.id) ?? null : null, Wo = (p) => p.split("::")[1] ?? "", Nn = (p) => {
    var b;
    return (b = Vt.items.find((I) => I.id === p)) == null ? void 0 : b.group;
  }, Yo = (p) => {
    const b = new Set(p.map(Nn).filter((G) => !!G));
    if (!b.size) return [...p];
    const I = new Set(p.map(Wo)), B = new Set(p);
    for (const G of Vt.items) G.group && b.has(G.group) && I.has(Wo(G.id)) && B.add(G.id);
    return [...B];
  }, tn = hf(fe).length, Ac = fe.length > 1 && fe.every((p) => p.group && p.group === fe[0].group), Xo = (p, b) => {
    var G;
    if (!ie(p.recipe)) return "";
    const I = ((G = p.recipe.title) == null ? void 0 : G.trim()) ?? "";
    if (!I) return "";
    const B = Dr(p.recipe, b);
    return B && Gg(I, B.population, [B.file, B.sample]) ? "" : I;
  }, zc = ze && ie(ze.recipe) ? Ta(Lo, Dr(ze.recipe, ze.templateSampleId, ze.unitId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", La = fe.some((p) => p.locked), jn = new Set(((U == null ? void 0 : U.items) ?? []).filter((p) => p.locked).map((p) => p.id)), We = V.filter((p) => !jn.has(Qr(p.dataset.itemId ?? "")) && p.dataset.itemId !== O), en = We.length > 1 && We.every((p) => !Nn(p.dataset.itemId ?? "")), Ho = et.useRef(We);
  Ho.current = We;
  const An = et.useRef(!1);
  et.useEffect(() => {
    _.length && _.some((p) => !Vt.items.some((b) => b.id === p)) && j((p) => p.filter((b) => Vt.items.some((I) => I.id === b)));
  }, [Vt, _]), et.useLayoutEffect(() => {
    var p;
    (p = Z.current) == null || p.updateRect();
  }, [Vt, xt, zt]), et.useLayoutEffect(() => {
    var G;
    if (!W) return;
    const p = [...W.querySelectorAll("[data-item-id]")], b = ($, Y) => $.length === Y.length && $.every((st, Dt) => st === Y[Dt]), I = p.filter(($) => _.includes($.dataset.itemId ?? "")), B = p.filter(($) => !_.includes($.dataset.itemId ?? ""));
    L(($) => b($, I) ? $ : I), at(($) => b($, B) ? $ : B), (G = nt.current) == null || G.setSelectedTargets(I);
  }, [W, _, Vt, U == null ? void 0 : U.id]), et.useEffect(() => {
    ns();
  }, [U == null ? void 0 : U.id]);
  const Wa = (p, b = !0) => {
    b && (Wt.current = [
      $n(t),
      ...Wt.current
    ].slice(0, 30), Ue.current = []), e(p);
  }, kr = (p) => {
    const b = $n(t);
    p(b), Wa(b);
  }, Ot = (p) => {
    kr((b) => {
      const I = b.sheets.find(({ id: B }) => B === b.activeSheetId);
      I && p(I);
    });
  }, Ya = et.useRef(null), [Bc, Xa] = et.useState(null), _r = (p, b) => {
    let I = "";
    const B = Ya.current;
    Ya.current = null, Ot((G) => {
      I = crypto.randomUUID();
      const $ = Ms(G, b == null ? void 0 : b.width, b == null ? void 0 : b.height);
      B && ($.x = Math.max(0, Math.round(B.x)), $.y = Math.max(0, Math.round(B.y))), G.items.push({
        id: I,
        ...$,
        recipe: p
      });
    }), Jr(I), Uc(I);
  }, ne = Pt.find(({ id: p }) => p === bt) ?? Pt[0] ?? null, Ha = ne && c ? Ir(
    {
      hierarchyId: f.active_hierarchy_id,
      populationId: c
    },
    ne.tree,
    cr(f)
  ) : null, Ze = (Ha == null ? void 0 : Ha.id) ?? (ne == null ? void 0 : ne.tree.root_population_id) ?? "", zn = (p) => {
    var b, I, B;
    if (!ne || !Ze) {
      ft(m("Check an FCS file and select a population first."));
      return;
    }
    _r({
      kind: p,
      sampleId: ne.id,
      populationId: Ze,
      ...dt.mode !== "off" ? { iterated: !0 } : {},
      xChannel: ne.sample.index(h) !== void 0 ? h : ((b = ne.sample.channels[0]) == null ? void 0 : b.key) ?? "",
      yChannel: p === "histogram" ? null : ne.sample.index(v) !== void 0 ? v : ((I = ne.sample.channels[1]) == null ? void 0 : I.key) ?? ((B = ne.sample.channels[0]) == null ? void 0 : B.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, $o = () => {
    if (!ne || !Ze) {
      ft(m("Check an FCS file and select a population first."));
      return;
    }
    _r(
      {
        kind: "chart",
        sampleId: ne.id,
        populationId: Ze,
        statistic: "percent_of_parent",
        files: "checked",
        groupBy: o[0] ?? "",
        chartType: "bars",
        showPoints: !0,
        test: !0
      },
      { width: 320, height: 240 }
    );
  }, qo = () => _r({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), Gc = (p, b) => {
    Ot((I) => {
      const B = I.items.find((G) => G.id === p);
      B && (B.recipe = b(B.recipe));
    });
  }, Fc = (p) => {
    p.preventDefault();
    const b = p.target.closest("[data-item-id]");
    if (b != null && b.dataset.itemId) {
      const $ = b.dataset.itemId, Y = U == null ? void 0 : U.items.find(({ id: Ut }) => Ut === Qr($));
      if (!Y) return;
      const st = _.includes($);
      st || Le(Yo([$]));
      const Dt = Y.group ? ((U == null ? void 0 : U.items) ?? []).filter((Ut) => Ut.group === Y.group).map(({ id: Ut }) => Ut) : [Y.id], ut = st && ae.length > 1 ? ae : Dt, _t = ut.length > 1, ee = ie(Y.recipe), be = [
        { label: _t ? m("Duplicate {n} items", { n: ut.length }) : m("Duplicate"), onClick: () => nn(ut) },
        { label: m("Bring to front"), onClick: () => Ye(ut, "front") },
        { label: m("Bring forward"), onClick: () => Ye(ut, "forward") },
        { label: m("Send backward"), onClick: () => Ye(ut, "backward") },
        { label: m("Send to back"), onClick: () => Ye(ut, "back") },
        { label: Y.locked ? m("Unlock") : m("Lock"), onClick: () => Gn(ut, !Y.locked) },
        ...st && tn > 1 ? [{ label: m("Group"), onClick: Bn }] : [],
        ...Y.group ? [{ label: m("Ungroup"), onClick: () => Ot((Ut) => Ds(Ut, ut)) }] : [],
        "separator",
        ...dt.mode !== "off" && ee ? [
          {
            label: "iterated" in Y.recipe && Y.recipe.iterated ? m("Stop following the iteration") : m("Follow the iteration"),
            onClick: () => Gc(Y.id, (Ut) => ie(Ut) ? { ...Ut, iterated: !Ut.iterated } : Ut)
          },
          "separator"
        ] : [],
        ...ee ? [{ label: m("Open in Gating"), onClick: () => k(Y.recipe) }] : [],
        ...Y.recipe.kind === "figure" && x ? [{ label: m("Edit in Illustration"), onClick: () => x(structuredClone(Y.recipe.illustration)) }] : [],
        ...Y.recipe.kind === "proportions" && E ? [{ label: m("Edit in Plotting"), onClick: () => E(structuredClone(Y.recipe.settings)) }] : [],
        { label: _t ? m("Remove {n} items", { n: ut.length }) : m("Remove"), onClick: () => rn(ut) }
      ];
      Xa({ x: p.clientX, y: p.clientY, items: be, label: He(Y, Pt) });
      return;
    }
    const I = p.currentTarget.getBoundingClientRect(), B = { x: (p.clientX - I.left) / xt, y: (p.clientY - I.top) / xt }, G = ($) => () => {
      Ya.current = B, $();
    };
    Xa({
      x: p.clientX,
      y: p.clientY,
      label: m("Page"),
      items: [
        { label: m("+ Biplot"), disabled: !Ct, onClick: G(() => zn("biplot")) },
        { label: m("+ Histogram"), disabled: !Ct, onClick: G(() => zn("histogram")) },
        { label: m("+ Gating strategy"), disabled: !Ct, onClick: G(Ko) },
        { label: m("+ Chart"), disabled: !Ct, onClick: G($o) },
        { label: m("+ Text"), onClick: G(qo) },
        { label: m("+ Illustration figure"), disabled: !Ct || !(g != null && g.figure), onClick: G(Vo) },
        { label: m("+ Plotting chart"), disabled: !Ct || !y, onClick: G(Uo) },
        "separator",
        // With a selection on the page, the menu on blank paper offers what the selection's own menu does for grouping, as Illustrator's does.
        ...tn > 1 ? [{ label: m("Group"), onClick: Bn }] : [],
        ...fe.some(($) => $.group) ? [{ label: m("Ungroup"), onClick: qa }] : [],
        { label: m("Select all"), disabled: !Vt.items.length, onClick: () => Le(Vt.items.filter(($) => !jn.has($.templateId)).map(({ id: $ }) => $)) }
      ]
    });
  }, Vo = () => {
    if (!(g != null && g.figure)) {
      ft(m("Make a figure on the Illustration tab first."));
      return;
    }
    U && _r({ kind: "figure", illustration: structuredClone(g), page: 0 }, Cf(g, r, f, U));
  }, Uo = () => {
    if (!y || !U) return;
    const p = y(), b = wf(p, Ef(r), f, Er, S);
    if (!b.catLevels.length || !b.perSample.length) {
      ft(m("Choose files and populations on the Plotting tab first."));
      return;
    }
    _r({ kind: "proportions", settings: p }, Df(p, b, U));
  }, Ko = () => {
    var I;
    if (!ne || !Ze) {
      ft(m("Check an FCS file and select a population first."));
      return;
    }
    const p = ne.tree.root_population_id ?? "", b = Ze !== p ? Ze : ((I = fa(ne.tree.populations, p).filter(({ popId: B }) => B !== p).at(-1)) == null ? void 0 : I.popId) ?? Ze;
    _r(
      {
        kind: "strategy",
        sampleId: ne.id,
        populationId: b,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...dt.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, Lc = () => {
    var G, $;
    if (!g) {
      ft(m("Render or configure an Illustration selection first."));
      return;
    }
    if (!g.figure && g.plotType === "heatmap") {
      ft(
        m("Heatmap layout blocks are planned for the next Layout phase.")
      );
      return;
    }
    const p = new Map(Pt.map((Y) => [Y.id, Y])), b = [], I = g.figure;
    for (const Y of Pt) {
      if (I) {
        if (!I.sampleIds.includes(Y.id)) continue;
        for (const Dt of I.plots)
          if (Dt.type !== "heatmap")
            for (const ut of Dt.population ? [Dt.population] : ((G = I.samplePopulations) == null ? void 0 : G[Y.id]) ?? I.populations) {
              const _t = Ir(
                ut,
                Y.tree,
                cr(f)
              );
              _t.id && _t.status !== "changed" && b.push({
                sampleId: Y.id,
                populationId: _t.id,
                xChannel: Dt.x,
                yChannel: Dt.y,
                type: Dt.type
              });
            }
        continue;
      }
      const st = g.selectionMode === "matrix" ? (($ = g.selectedPopulationsBySample) == null ? void 0 : $[Y.id]) ?? [] : g.popIds;
      for (const Dt of st)
        for (const ut of g.xChannels)
          b.push({ sampleId: Y.id, populationId: Dt, xChannel: ut });
    }
    const B = b.slice(0, 60);
    if (B.length === 0) {
      ft(
        m("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    Ot((Y) => {
      for (const st of B) {
        if (!p.get(st.sampleId)) continue;
        const ut = st.type ?? (g.plotType === "histogram" ? "histogram" : "biplot");
        Y.items.push({
          id: crypto.randomUUID(),
          ...Ms(Y),
          recipe: {
            kind: ut,
            sampleId: st.sampleId,
            populationId: st.populationId,
            xChannel: st.xChannel,
            yChannel: ut === "histogram" ? null : st.yChannel ?? g.yChannel,
            displayMode: g.displayMode === "dots" ? "scatter" : g.displayMode
          }
        });
      }
    }), ft(
      b.length > B.length ? m(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: B.length
        }
      ) : m("Added {count} Illustration plots.", { count: B.length })
    );
  }, Mt = (p) => {
    K && Ot((b) => {
      const I = b.items.find(({ id: B }) => B === K.id);
      I && (I.recipe = p(I.recipe));
    });
  }, $a = (p) => Mt((b) => {
    if (b.kind !== "biplot" && b.kind !== "histogram") return b;
    const I = p ? r.filter(($) => p.includes($.id)).map(($) => $.id) : [];
    if (!I.length) {
      const { pool: $, ...Y } = b;
      return Y;
    }
    const B = I.includes(b.sampleId) ? b.sampleId : I[0];
    let G = b.populationId;
    if (B !== b.sampleId) {
      const $ = Pt.find(({ id: st }) => st === b.sampleId), Y = Pt.find(({ id: st }) => st === B);
      $ && Y && (G = Ir({ hierarchyId: $.tree.id, populationId: G }, Y.tree, je).id ?? Y.tree.root_population_id ?? G);
    }
    return { ...b, sampleId: B, populationId: G, pool: { sampleIds: I } };
  }), Wc = et.useMemo(() => {
    var $;
    const p = K == null ? void 0 : K.recipe;
    if (!p || !ie(p) || p.kind === "strategy" || !p.pool) return null;
    const b = ze != null && ze.templateSampleId ? ($ = Pt.find(({ id: Y }) => Y === ze.templateSampleId)) == null ? void 0 : $.tree.id : void 0, { members: I, leftOut: B } = Qi(p, Pt, je, b), G = p.kind === "biplot" && p.yChannel && I.length > 1 ? vf(je, I.map((Y) => Y.tree.id), p.xChannel, p.yChannel).omitted.map((Y) => Y.name) : [];
    return { pooled: I.length, total: p.pool.sampleIds.length, leftOut: B, omittedGates: G };
  }, [K, ze, Pt, je]), rn = (p) => {
    Ot((b) => {
      b.items = b.items.filter((I) => !p.includes(I.id));
    }), j((b) => b.filter((I) => !p.includes(I)));
  }, nn = (p, b) => {
    const I = [];
    return Ot((B) => {
      let G = Math.max(0, ...B.items.map((Y) => Y.z));
      const $ = /* @__PURE__ */ new Map();
      for (const Y of p) {
        const st = B.items.find((ee) => ee.id === Y);
        if (!st) continue;
        const Dt = crypto.randomUUID();
        I.push(Dt);
        const ut = (b == null ? void 0 : b[Y]) ?? { x: st.x + 20, y: st.y + 20, width: st.width, height: st.height }, _t = st.group ? $.get(st.group) ?? crypto.randomUUID() : void 0;
        st.group && _t && $.set(st.group, _t), B.items.push({ ...st, ...ut, id: Dt, locked: !1, z: ++G, recipe: { ...st.recipe }, ..._t ? { group: _t } : {} });
      }
    }), I.length && Le(I), I;
  }, Yc = (p, b, I) => {
    Ot((B) => {
      for (const G of B.items)
        !p.includes(G.id) || G.locked || (G.x += b, G.y += I);
    });
  }, Ye = (p, b) => {
    Ot((I) => {
      const B = [...I.items].sort((st, Dt) => st.z - Dt.z), G = B.filter((st) => p.includes(st.id)), $ = B.filter((st) => !p.includes(st.id));
      let Y;
      if (b === "front") Y = [...$, ...G];
      else if (b === "back") Y = [...G, ...$];
      else {
        Y = B;
        const st = Y.map((Dt, ut) => ut);
        b === "forward" && st.reverse();
        for (const Dt of st) {
          const ut = b === "forward" ? Dt + 1 : Dt - 1;
          !p.includes(Y[Dt].id) || ut < 0 || ut >= Y.length || p.includes(Y[ut].id) || ([Y[Dt], Y[ut]] = [Y[ut], Y[Dt]]);
        }
      }
      Y.forEach((st, Dt) => {
        st.z = Dt;
      });
    });
  }, Bn = () => {
    tn < 2 || Ot((p) => {
      Uf(p, ae);
    });
  }, qa = () => {
    fe.some((p) => p.group) && Ot((p) => Ds(p, ae));
  }, Gn = (p, b) => {
    Ot((I) => {
      for (const B of I.items) p.includes(B.id) && (B.locked = b);
    });
  }, Xc = (p) => {
    Ot((b) => Kf(b, ae.filter((I) => {
      var B;
      return !((B = b.items.find((G) => G.id === I)) != null && B.locked);
    }), p));
  }, Hc = (p) => {
    Ot((b) => Zf(b, ae.filter((I) => {
      var B;
      return !((B = b.items.find((G) => G.id === I)) != null && B.locked);
    }), p));
  }, Fn = (p, b) => {
    const I = {};
    for (const G of p) {
      const $ = G.dataset.itemId, Y = Vt.items.find((ut) => ut.id === $);
      if (!Y) continue;
      const { id: st, ...Dt } = gg(Y, Bg(G));
      I[st] = Dt;
    }
    const B = Object.keys(I);
    if (B.length) {
      if (b) {
        for (const G of p) {
          const $ = Vt.items.find((Y) => Y.id === G.dataset.itemId);
          $ && Object.assign(G.style, { left: `${$.x}px`, top: `${$.y}px`, width: `${$.width}px`, height: `${$.height}px` });
        }
        nn(B, I);
        return;
      }
      Ot((G) => {
        for (const $ of G.items) I[$.id] && Object.assign($, I[$.id]);
      });
    }
  }, Zo = (p) => p.flatMap((b) => {
    if (!(b instanceof HTMLElement) || !b.parentElement) return [];
    const I = b.cloneNode(!0);
    I.classList.add("gl-layout-ghost"), I.classList.remove("is-selected"), I.removeAttribute("data-item-id"), I.setAttribute("aria-hidden", "true");
    const B = b.querySelectorAll("canvas");
    return I.querySelectorAll("canvas").forEach((G, $) => {
      var st;
      const Y = B[$];
      Y && (G.width = Y.width, G.height = Y.height, (st = G.getContext("2d")) == null || st.drawImage(Y, 0, 0));
    }), b.parentElement.insertBefore(I, b), [I];
  }), Ln = (p) => {
    if (Array.isArray(p)) for (const b of p) b.remove();
  }, Va = (p) => {
    for (const b of p) {
      const I = Vt.items.find((B) => B.id === b.dataset.itemId);
      I && Object.assign(b.style, { left: `${I.x}px`, top: `${I.y}px`, width: `${I.width}px`, height: `${I.height}px` });
    }
  }, Jo = et.useRef(Va);
  Jo.current = Va;
  const Je = et.useRef(null), Wn = (p, b) => {
    const I = { targets: p, ghosts: b, cancelled: !1 };
    Je.current = I;
    const B = () => {
      window.removeEventListener("mouseup", B, !0), window.removeEventListener("touchend", B, !0), window.setTimeout(() => {
        Je.current === I && (Je.current = null, Ln(I.ghosts));
      }, 0);
    };
    window.addEventListener("mouseup", B, !0), window.addEventListener("touchend", B, !0);
  }, Yn = (p, b, I, B) => {
    const G = Je.current;
    Je.current = null, Ln(G == null ? void 0 : G.ghosts);
    const $ = b == null ? void 0 : b.dist, Y = !$ || Math.hypot($[0] ?? 0, $[1] ?? 0) >= 3;
    G != null && G.cancelled || !I || !Y ? Va(p) : B();
  }, Qo = (p) => {
    var G;
    p.target.style.left = `${p.left}px`, p.target.style.top = `${p.top}px`;
    const b = (G = p.datas) == null ? void 0 : G.companions;
    if (!(b != null && b.length)) return;
    const I = p.left - p.datas.startLeft, B = p.top - p.datas.startTop;
    for (const { el: $, left: Y, top: st } of b)
      $.style.left = `${Y + I}px`, $.style.top = `${st + B}px`;
  }, ts = (p) => {
    var I;
    const b = (I = p.datas) == null ? void 0 : I.companions;
    return [p.target, ...(b ?? []).map(({ el: B }) => B)];
  }, $c = (p) => {
    var G;
    p.datas.alt = !!((G = p.inputEvent) != null && G.altKey);
    const b = p.target, I = en ? Ho.current.filter(($) => $ !== b) : [];
    p.datas.startLeft = parseFloat(b.style.left) || 0, p.datas.startTop = parseFloat(b.style.top) || 0, p.datas.companions = I.map(($) => ({ el: $, left: parseFloat($.style.left) || 0, top: parseFloat($.style.top) || 0 }));
    const B = ts(p);
    Wn(B, p.datas.alt ? Zo(B) : void 0);
  }, es = (p) => {
    p.target.style.width = `${p.width}px`, p.target.style.height = `${p.height}px`, p.target.style.left = `${p.drag.left}px`, p.target.style.top = `${p.drag.top}px`;
  }, qc = (p) => {
    var B;
    const b = (B = p.inputEvent) == null ? void 0 : B.target;
    if (!b) return;
    const I = Z.current;
    if (I != null && I.isMoveableElement(b)) {
      p.stop();
      return;
    }
    if (We.some((G) => G === b || G.contains(b)) && (p.stop(), We.length > 1 && !en)) {
      I == null || I.dragStart(p.inputEvent);
      const G = p.inputEvent, $ = (Y) => {
        var st;
        window.removeEventListener("mouseup", $), Math.hypot(Y.clientX - G.clientX, Y.clientY - G.clientY) < 4 && ((st = nt.current) == null || st.clickTarget(G, b));
      };
      window.addEventListener("mouseup", $);
    }
  }, Vc = (p) => {
    var G, $, Y;
    const b = p.isClick || p.isDragStart, I = new Set((p.removed ?? []).map((st) => Nn(st.dataset.itemId ?? "")).filter(Boolean)), B = Yo(
      p.selected.map((st) => st.dataset.itemId ?? "").filter((st) => st && (b || !jn.has(Qr(st))))
    ).filter((st) => !I.has(Nn(st)));
    if (Le(B), p.isDragStart && !p.isClick) {
      if (!B.filter((ut) => !jn.has(Qr(ut)) && ut !== O).length) return;
      ($ = (G = p.inputEvent) == null ? void 0 : G.preventDefault) == null || $.call(G), An.current = !0;
      const Dt = () => {
        An.current = !1;
      };
      window.setTimeout(() => window.addEventListener("mousedown", Dt, { capture: !0, once: !0 }), 0), (Y = Z.current) == null || Y.waitToChangeTarget().then(() => {
        var ut;
        return (ut = Z.current) == null ? void 0 : ut.dragStart(p.inputEvent);
      });
    }
  }, Uc = (p) => {
    window.requestAnimationFrame(() => {
      var b, I, B;
      (B = (I = (b = Zr.current) == null ? void 0 : b.querySelector(`[data-item-id="${p}"]`)) == null ? void 0 : I.scrollIntoView) == null || B.call(I, { block: "nearest", inline: "nearest" });
    });
  }, ur = (p) => {
    Ot((b) => Tf(b, p));
  }, Kc = () => Ot((p) => If(p)), Zc = () => Ot((p) => Rf(p)), rs = (() => {
    const p = [], b = [];
    if (!U) return { vertical: p, horizontal: b };
    const I = yi(U.page), B = ys(U.page.marginMm);
    for (const G of ha(U.page))
      p.push(G.x, G.x + B, G.x + I.width / 2, G.x + I.width - B, G.x + I.width), b.push(G.y, G.y + B, G.y + I.height / 2, G.y + I.height - B, G.y + I.height);
    return { vertical: [...new Set(p)], horizontal: [...new Set(b)] };
  })(), ns = () => {
    const p = Ve.current;
    if (!p || !U) return;
    const b = { width: p.clientWidth - 36, height: p.clientHeight - 36 };
    if (b.width <= 0 || b.height <= 0) return;
    const I = Math.min(b.width / U.width, b.height / U.height);
    vt(Math.max(0.1, Math.min(4, Math.floor(I * 100) / 100)));
  };
  et.useEffect(() => {
    const p = F;
    if (!p) return;
    const b = (I) => {
      if (!(I.altKey || I.shiftKey || I.ctrlKey)) return;
      const B = I.deltaY || I.deltaX;
      if (!B) return;
      I.preventDefault();
      const G = kt.current, $ = Math.max(0.1, Math.min(4, Math.round(G * Math.exp(-B * 25e-4) * 100) / 100));
      if ($ === G) return;
      kt.current = $, vt($);
      const Y = p.getBoundingClientRect(), st = I.clientX - Y.left, Dt = I.clientY - Y.top, ut = $ / G, _t = (p.scrollLeft + st) * ut - st, ee = (p.scrollTop + Dt) * ut - Dt;
      requestAnimationFrame(() => {
        p.scrollLeft = _t, p.scrollTop = ee;
      });
    };
    return p.addEventListener("wheel", b, { passive: !1 }), () => p.removeEventListener("wheel", b);
  }, [F]);
  const as = (p) => {
    const b = p > 0 ? on.find((I) => I > xt + 1e-3) : [...on].reverse().find((I) => I < xt - 1e-3);
    b && vt(b);
  }, Jc = () => new Promise((p) => {
    window.setTimeout(() => window.requestAnimationFrame(() => window.requestAnimationFrame(() => p())), 450);
  }), is = async () => {
    const p = Zr.current;
    if (!p || !U || sr) return;
    lr(!0);
    const b = Ae;
    try {
      const I = [];
      for (let B = 0; B < ge.length; B++)
        ge.length > 1 && (Mr(B), await Jc()), I.push(...ng(p, U, { zoom: xt, crop: ve ? { paddingMm: Kr } : void 0 }));
      await ag(I, U, Rt), T == null || T();
    } catch (I) {
      ft(I instanceof Error ? I.message : String(I));
    } finally {
      ge.length > 1 && Mr(b), lr(!1);
    }
  }, Xe = (p) => {
    Ot((b) => {
      var I;
      if (p.mode === "off") {
        delete b.iteration;
        return;
      }
      if ((((I = b.iteration) == null ? void 0 : I.mode) ?? "off") === "off" && !b.items.some(_c))
        for (const B of b.items) ie(B.recipe) && (B.recipe.iterated = !0);
      b.iteration = p;
    }), Mr(0);
  }, Qc = (p) => [...new Set(r.map((b) => {
    var I;
    return ((I = b.metadata) == null ? void 0 : I[p]) ?? "";
  }).filter(Boolean))], tf = dt.source.kind === "group" ? `group:${dt.source.groupId}` : dt.source.kind === "metadata" ? `meta:${dt.source.column}=${dt.source.value}` : dt.source.kind, ef = (p) => {
    if (p === "all") return { kind: "all" };
    if (p.startsWith("group:")) return { kind: "group", groupId: p.slice(6) };
    if (p.startsWith("meta:")) {
      const [b, ...I] = p.slice(5).split("=");
      return { kind: "metadata", column: b, value: I.join("=") };
    }
    return { kind: "checked" };
  }, rf = (p) => {
    const b = Cs(p.nativeEvent);
    if (b) {
      p.preventDefault(), b === "undo" ? Xn() : Hn();
      return;
    }
    if (p.target.closest("input, textarea, select")) return;
    const I = p.metaKey || p.ctrlKey;
    if (p.key === "Escape") {
      j([]);
      return;
    }
    if (I && p.key.toLowerCase() === "a") {
      p.preventDefault(), Le(((U == null ? void 0 : U.items) ?? []).filter((Y) => !Y.locked).map((Y) => Y.id));
      return;
    }
    if (!_.length) return;
    if (p.key === "Enter" && _.length === 1) {
      const Y = Vt.items.find((st) => st.id === _[0]);
      if ((Y == null ? void 0 : Y.recipe.kind) === "text") {
        p.preventDefault(), R(Y.id);
        return;
      }
    }
    if (p.key === "Delete" || p.key === "Backspace") {
      p.preventDefault(), rn(ae);
      return;
    }
    if (I && p.key.toLowerCase() === "d") {
      p.preventDefault(), nn(ae);
      return;
    }
    if (I && (p.key === "]" || p.key === "[")) {
      p.preventDefault(), Ye(ae, p.key === "]" ? p.shiftKey ? "front" : "forward" : p.shiftKey ? "back" : "backward");
      return;
    }
    if (I && p.key.toLowerCase() === "g") {
      p.preventDefault(), p.shiftKey ? qa() : Bn();
      return;
    }
    if (I && p.shiftKey && p.key.toLowerCase() === "l") {
      p.preventDefault(), Gn(ae, !La);
      return;
    }
    const B = p.shiftKey ? 10 : 1, $ = {
      ArrowLeft: [-B, 0],
      ArrowRight: [B, 0],
      ArrowUp: [0, -B],
      ArrowDown: [0, B]
    }[p.key];
    $ && (p.preventDefault(), Yc(ae, $[0], $[1]));
  }, Ua = K == null ? void 0 : K.recipe, Bt = Ua && "sampleId" in Ua ? Pt.find(({ id: p }) => p === Ua.sampleId) ?? null : null, os = Bt ? Bt.sample.channels.map((p) => ({
    value: p.key,
    label: Bt.sample.channelLabel(Bt.sample.index(p.key) ?? 0)
  })) : [], ss = Bt ? fa(
    Bt.tree.populations,
    Bt.tree.root_population_id ?? ""
  ) : [], Xn = () => {
    const p = Wt.current.shift();
    p && (Ue.current = [
      $n(t),
      ...Ue.current
    ].slice(0, 30), Wa(p, !1));
  }, Hn = () => {
    const p = Ue.current.shift();
    p && (Wt.current = [
      $n(t),
      ...Wt.current
    ].slice(0, 30), Wa(p, !1));
  }, Ka = et.useRef({ undo: Xn, redo: Hn });
  return Ka.current = { undo: Xn, redo: Hn }, et.useEffect(() => {
    const p = (I) => {
      var G, $;
      if (I.key === "Escape" && Je.current) {
        const Y = Je.current;
        Y.cancelled = !0, I.preventDefault(), I.stopPropagation(), Jo.current(Y.targets), Ln(Y.ghosts), Y.ghosts = void 0, zg(Z.current);
        return;
      }
      const B = Cs(I);
      B && (($ = (G = I.target) == null ? void 0 : G.closest) != null && $.call(G, "input, textarea, select, [contenteditable='true']") || (I.preventDefault(), I.stopPropagation(), B === "undo" ? Ka.current.undo() : Ka.current.redo()));
    }, b = () => {
      const I = Je.current;
      I && (Ln(I.ghosts), I.ghosts = void 0);
    };
    return window.addEventListener("keydown", p, !0), window.addEventListener("blur", b), () => {
      window.removeEventListener("keydown", p, !0), window.removeEventListener("blur", b);
    };
  }, []), U ? /* @__PURE__ */ C.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${pt ? " is-preview" : ""}`,
      children: [
        /* @__PURE__ */ C.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": m("Layout sheets"),
            children: [
              t.sheets.map((p) => /* @__PURE__ */ C.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: tt === p.id ? /* @__PURE__ */ C.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: p.name,
                  autoFocus: !0,
                  onFocus: (b) => b.currentTarget.select(),
                  onBlur: (b) => {
                    const I = b.currentTarget.value.trim();
                    I && kr((B) => {
                      const G = B.sheets.find(
                        ({ id: $ }) => $ === p.id
                      );
                      G && (G.name = I);
                    }), ot(null);
                  },
                  onKeyDown: (b) => {
                    b.key === "Enter" && b.currentTarget.blur(), b.key === "Escape" && ot(null);
                  }
                }
              ) : /* @__PURE__ */ C.jsx(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": t.activeSheetId === p.id,
                  className: `gl-layout-sheet-tab${t.activeSheetId === p.id ? " active" : ""}`,
                  title: m("Double-click to rename"),
                  onClick: () => kr((b) => {
                    b.activeSheetId = p.id;
                  }),
                  onDoubleClick: () => ot(p.id),
                  children: p.name
                }
              ) }, p.id)),
              /* @__PURE__ */ C.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-layout-sheet-add",
                  title: m("New blank layout"),
                  onClick: () => {
                    const p = gf(
                      `Layout ${t.sheets.length + 1}`,
                      { ...U.page }
                    );
                    kr((b) => {
                      b.sheets.push(p), b.activeSheetId = p.id;
                    }), j([]);
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
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => zn("biplot"), disabled: !Ct, title: m(Ct ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: m("+ Biplot") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => zn("histogram"), disabled: !Ct, title: m(Ct ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: m("+ Histogram") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Ko, disabled: !Ct, title: m(Ct ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: m("+ Gating strategy") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: $o, disabled: !Ct, title: m(Ct ? "Add a summary chart: one statistic of a population per file, grouped by a metadata column, with a test between the groups" : "Preparing the files…"), children: m("+ Chart") }),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: m("Add a text block; edit it on the page"),
                    onClick: qo,
                    children: m("+ Text")
                  }
                ),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Lc, disabled: !Ct, title: m("Add one plot per file and plot of the Illustration tab's current selection"), children: m("Add Illustration selection") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Vo, disabled: !Ct, title: m("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: m("+ Illustration figure") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Uo, disabled: !Ct || !y, title: m("Add the Plotting tab's current chart as one block, drawn here as it is there"), children: m("+ Plotting chart") })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": m("Arrange"), children: [
                jg.map(({ how: p, label: b, title: I }) => /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Xc(p), disabled: !_.length || pt, title: m(I), children: m(b) }, p)),
                Ag.map(({ how: p, label: b, title: I }) => /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Hc(p), disabled: tn < 3 || pt, title: m(I), children: m(b) }, p)),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": A, onClick: () => z((p) => !p), title: m("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: m("Snap grid") })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": pt, onClick: () => ht(!pt), title: m("Show the page as it exports, without grid, margins or handles"), children: m(pt ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Wt.current.length, onClick: Xn, title: m("Undo the last layout edit (Cmd-Z)"), children: m("Undo") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Ue.current.length, onClick: Hn, title: m("Redo the undone edit (Shift-Cmd-Z)"), children: m("Redo") }),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: m("Copy this sheet, with its page and items, as a new sheet"),
                    onClick: () => {
                      const p = {
                        ...U,
                        id: crypto.randomUUID(),
                        page: { ...U.page },
                        name: `${U.name} copy`,
                        items: U.items.map((b) => ({
                          ...b,
                          id: crypto.randomUUID(),
                          recipe: { ...b.recipe }
                        }))
                      };
                      kr((b) => {
                        b.sheets.push(p), b.activeSheetId = p.id;
                      }), j([]);
                    },
                    children: m("Duplicate sheet")
                  }
                ),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    disabled: t.sheets.length <= 1,
                    title: m("Remove this sheet; the layout keeps at least one"),
                    onClick: () => {
                      kr((p) => {
                        const b = p.sheets.findIndex(
                          ({ id: I }) => I === p.activeSheetId
                        );
                        p.sheets.splice(b, 1), p.activeSheetId = p.sheets[Math.max(0, b - 1)].id;
                      }), j([]);
                    },
                    children: m("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": m("Zoom"), children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: ns, title: m("Fit the page to the window"), children: m("Fit") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => as(-1), "aria-label": m("Zoom out"), title: m("Zoom out"), disabled: xt <= on[0], children: "−" }),
                /* @__PURE__ */ C.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(xt * 100),
                  "%"
                ] }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => as(1), "aria-label": m("Zoom in"), title: m("Zoom in"), disabled: xt >= on[on.length - 1], children: "+" })
              ] }),
              (ge.length > 1 || dt.mode !== "off") && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": m("Pages of the iteration"), children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Mr(Math.max(0, Ae - 1)), disabled: Ae === 0, "aria-label": m("Previous page"), title: m("Previous page"), children: "◀" }),
                /* @__PURE__ */ C.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  m("Page {n} of {count}", { n: Ae + 1, count: Math.max(1, ge.length) }),
                  Vt.units.length > 0 && ` · ${Vt.units.map((p) => p.name).join(", ")}`
                ] }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Mr(Math.min(ge.length - 1, Ae + 1)), disabled: Ae >= ge.length - 1, "aria-label": m("Next page"), title: m("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ C.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void is(), disabled: sr || !U.items.length, title: ge.length > 1 ? m("Write every page of the iteration; the format is chosen under Page") : m("Write this sheet at its page size; the format is chosen under Page"), children: sr ? m("Exporting…") : m("Export {format}", { format: Rt.toUpperCase() }) }) }),
              /* @__PURE__ */ C.jsx("span", { className: "gl-layout-performance-note", children: m("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        it && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ C.jsx("span", { children: it }),
          /* @__PURE__ */ C.jsx("button", { type: "button", title: m("Dismiss"), "aria-label": m("Dismiss"), onClick: () => ft(null), children: "×" })
        ] }),
        /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ C.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ C.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style"].map((p) => /* @__PURE__ */ C.jsx(
              "button",
              {
                "aria-pressed": lt === p,
                title: m(p === "item" ? "The selected item, or the file new plots take" : p === "page" ? "Page size, margins, pages and export" : p === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => wt(p),
                children: m(p === "item" ? "Items" : p === "page" ? "Page" : p === "iterate" ? "Iterate" : "Style")
              },
              p
            )) }),
            lt === "item" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("File for new plots"),
                /* @__PURE__ */ C.jsx(
                  "select",
                  {
                    value: bt,
                    onChange: (p) => J(p.target.value),
                    children: r.map((p) => /* @__PURE__ */ C.jsx("option", { value: p.id, children: p.name }, p.id))
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("Placed plots keep their own file and hierarchy, independently of the Gating selection.") }),
              ke.error && /* @__PURE__ */ C.jsx("p", { role: "alert", children: ke.error }),
              fe.length > 1 && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-inspector", "aria-label": m("Selected layout items"), children: [
                /* @__PURE__ */ C.jsx("strong", { children: Ac ? m("{count} items selected, one group", { count: fe.length }) : m("{count} items selected", { count: fe.length }) }),
                /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                  tn > 1 && /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Bn, title: m("One group: selected, moved, aligned and distributed together (Cmd-G)"), children: m("Group") }),
                  fe.some((p) => p.group) && /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: qa, title: m("Dissolve the group; the items stay where they are (Shift-Cmd-G)"), children: m("Ungroup") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => nn(ae), title: m("Copies of every selected item, 20 px down and right (Cmd-D)"), children: m("Duplicate") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ye(ae, "front"), title: m("Draw the selected items over every other"), children: m("Bring to front") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ye(ae, "back"), title: m("Draw the selected items under every other"), children: m("Send to back") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Gn(ae, !La), title: m("Lock or unlock the selected items"), children: m(La ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => rn(ae), title: m("Remove the selected items (Delete)"), children: m("Remove") })
                ] }),
                /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("Align and distribute them with the toolbar; drag any of them to move them together; Cmd-G makes them one group.") })
              ] }),
              !fe.length && /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("Click an item to select it, drag empty page to select several, Shift-click to add or remove. Drag to move, Shift holds the direction; drag a corner handle or an edge to resize, Shift keeps the proportions, Option resizes from the centre; Cmd turns snapping off; Option-drag copies. Delete removes, arrows nudge (Shift: 10 px), Cmd-D duplicates, Cmd-A selects all, Cmd-] and Cmd-[ bring forward and send backward (Shift: to the front or back), Cmd-G groups and Shift-Cmd-G ungroups, Shift-Cmd-L locks, Cmd-Z undoes.") }),
              K && /* @__PURE__ */ C.jsxs(
                "div",
                {
                  className: "gl-layout-inspector",
                  "aria-label": m("Selected layout item"),
                  children: [
                    /* @__PURE__ */ C.jsx("strong", { children: m("Selected") }),
                    /* @__PURE__ */ C.jsxs("label", { className: "gl-check", children: [
                      /* @__PURE__ */ C.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: K.showFrame === !0,
                          onChange: (p) => Ot((b) => {
                            const I = b.items.find(
                              (B) => B.id === K.id
                            );
                            I && (I.showFrame = p.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => nn([K.id]), title: m("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: m("Duplicate") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ye([K.id], "front"), title: m("Draw this item over every other"), children: m("Bring to front") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ye([K.id], "back"), title: m("Draw this item under every other"), children: m("Send to back") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => rn([K.id]), title: m("Remove this item from the page (Delete)"), children: m("Remove") })
                    ] }),
                    /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: m("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ C.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: K.locked === !0,
                          onChange: (p) => Gn([K.id], p.target.checked)
                        }
                      ),
                      m("Locked")
                    ] }),
                    /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["x", "y", "width", "height"].map((p) => /* @__PURE__ */ C.jsxs("label", { children: [
                      Pg[p],
                      /* @__PURE__ */ C.jsx(
                        de,
                        {
                          "aria-label": `Item ${p}`,
                          min: p === "width" || p === "height" ? mf(K.recipe.kind)[p] : 0,
                          integer: !0,
                          value: K[p],
                          onCommit: (b) => Ot((I) => {
                            const B = I.items.find(
                              (G) => G.id === K.id
                            );
                            B && (B[p] = b);
                          })
                        }
                      )
                    ] }, p)) }),
                    K.recipe.kind === "text" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Text"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            value: K.recipe.text,
                            onChange: (p) => Mt(
                              (b) => b.kind === "text" ? { ...b, text: p.target.value } : b
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Reads from"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            "aria-label": m("Reads from"),
                            value: K.recipe.readsFrom ?? "",
                            onChange: (p) => Mt((b) => {
                              if (b.kind !== "text") return b;
                              const I = { ...b };
                              return p.target.value ? I.readsFrom = p.target.value : delete I.readsFrom, I;
                            }),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: m("Nothing: plain text") }),
                              U.items.filter((p) => ie(p.recipe)).map((p) => /* @__PURE__ */ C.jsx("option", { value: p.id, children: He(p, Pt) }, p.id))
                            ]
                          }
                        )
                      ] }),
                      K.recipe.readsFrom && /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: hi }) }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Font"),
                        /* @__PURE__ */ C.jsx(
                          de,
                          {
                            min: 8,
                            max: 72,
                            integer: !0,
                            value: K.recipe.fontSize,
                            onCommit: (p) => Mt(
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
                            checked: K.recipe.bold === !0,
                            onChange: (p) => Mt((b) => {
                              if (b.kind !== "text") return b;
                              const I = { ...b };
                              return p.target.checked ? I.bold = !0 : delete I.bold, I;
                            })
                          }
                        ),
                        m("Bold")
                      ] })
                    ] }) : K.recipe.kind === "figure" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Figure page"),
                        /* @__PURE__ */ C.jsx(
                          de,
                          {
                            "aria-label": m("Figure page"),
                            value: K.recipe.page + 1,
                            min: 1,
                            integer: !0,
                            onCommit: (p) => Mt((b) => b.kind === "figure" ? { ...b, page: Math.max(0, p - 1) } : b)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: He(K, Pt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => Mt((b) => b.kind === "figure" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      x && /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: m("Load this figure into the Illustration tab"),
                          onClick: () => x(structuredClone(K.recipe.illustration)),
                          children: m("Edit in Illustration")
                        }
                      ),
                      /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !(g != null && g.figure),
                          title: m("Take the Illustration tab's current figure in place of this one"),
                          onClick: () => Mt(
                            (p) => p.kind === "figure" && g ? { ...p, illustration: structuredClone(g) } : p
                          ),
                          children: m("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : K.recipe.kind === "imagewall" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("The cells as the Images tab showed them when the wall was added; their images are drawn from the file's waveform file.") }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: K.recipe.populationName,
                            value: K.recipe.title ?? "",
                            onChange: (p) => Mt((b) => b.kind === "imagewall" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Tile size"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "number",
                            min: 16,
                            max: 200,
                            value: K.recipe.tile,
                            onChange: (p) => Mt((b) => b.kind === "imagewall" ? { ...b, tile: Math.max(16, Math.min(200, Math.round(Number(p.target.value) || 56))) } : b)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Columns"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "number",
                            min: 1,
                            max: 24,
                            value: K.recipe.columns,
                            onChange: (p) => Mt((b) => b.kind === "imagewall" ? { ...b, columns: Math.max(1, Math.min(24, Math.round(Number(p.target.value) || 8))) } : b)
                          }
                        )
                      ] })
                    ] }) : K.recipe.kind === "proportions" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: He(K, Pt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => Mt((b) => b.kind === "proportions" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      E && /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: m("Load this chart's settings into the Plotting tab"),
                          onClick: () => E(structuredClone(K.recipe.settings)),
                          children: m("Edit in Plotting")
                        }
                      ),
                      /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !y,
                          title: m("Take the Plotting tab's current chart in place of this one"),
                          onClick: () => {
                            const p = y == null ? void 0 : y();
                            p && Mt((b) => b.kind === "proportions" ? { ...b, settings: p } : b);
                          },
                          children: m("Replace with the current Plotting chart")
                        }
                      )
                    ] }) : K.recipe.kind === "chart" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Population"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: K.recipe.populationId,
                            onChange: (p) => Mt((b) => b.kind === "chart" ? { ...b, populationId: p.target.value } : b),
                            children: ss.map(({ popId: p, depth: b }) => {
                              var I;
                              return /* @__PURE__ */ C.jsxs("option", { value: p, children: [
                                " ".repeat(b * 2),
                                ((I = Bt == null ? void 0 : Bt.tree.populations[p]) == null ? void 0 : I.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Statistic"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: K.recipe.statistic,
                            onChange: (p) => Mt((b) => {
                              var G;
                              if (b.kind !== "chart") return b;
                              const I = p.target.value, B = I === "median" && !b.channel ? (G = Bt == null ? void 0 : Bt.sample.channels[0]) == null ? void 0 : G.key : b.channel;
                              return { ...b, statistic: I, ...B ? { channel: B } : {} };
                            }),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "percent_of_parent", children: m("% of parent") }),
                              /* @__PURE__ */ C.jsx("option", { value: "percent_of_total", children: m("% of total") }),
                              /* @__PURE__ */ C.jsx("option", { value: "count", children: m("Events") }),
                              /* @__PURE__ */ C.jsx("option", { value: "median", children: m("Median of a channel") })
                            ]
                          }
                        )
                      ] }),
                      K.recipe.statistic === "median" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Channel"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: K.recipe.channel ?? "",
                            onChange: (p) => Mt((b) => b.kind === "chart" ? { ...b, channel: p.target.value } : b),
                            children: ((Bt == null ? void 0 : Bt.sample.channels) ?? []).map((p) => /* @__PURE__ */ C.jsx("option", { value: p.key, children: (Bt == null ? void 0 : Bt.sample.labelForKey(p.key)) ?? p.key }, p.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Files"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: K.recipe.files,
                            onChange: (p) => Mt((b) => b.kind === "chart" ? { ...b, files: p.target.value === "all" ? "all" : "checked" } : b),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "checked", children: m("Checked files") }),
                              /* @__PURE__ */ C.jsx("option", { value: "all", children: m("All files") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Group by"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: K.recipe.groupBy,
                            onChange: (p) => Mt((b) => b.kind === "chart" ? { ...b, groupBy: p.target.value } : b),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: m("Each file") }),
                              o.map((p) => /* @__PURE__ */ C.jsx("option", { value: p, children: p }, p))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Chart"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: K.recipe.chartType,
                            onChange: (p) => Mt((b) => b.kind === "chart" ? { ...b, chartType: p.target.value } : b),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "bars", children: m("Bars (mean ± SD)") }),
                              /* @__PURE__ */ C.jsx("option", { value: "dots", children: m("Points with the mean") }),
                              /* @__PURE__ */ C.jsx("option", { value: "box", children: m("Boxes (median, quartiles)") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.showPoints,
                            onChange: (p) => Mt((b) => b.kind === "chart" ? { ...b, showPoints: p.target.checked } : b)
                          }
                        ),
                        m("Show each file as a point")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: m("Wilcoxon rank-sum between two groups, Kruskal–Wallis among more; every group needs two files"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.test,
                            onChange: (p) => Mt((b) => b.kind === "chart" ? { ...b, test: p.target.checked } : b)
                          }
                        ),
                        m("Test between groups")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: He(K, Pt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => Mt((b) => b.kind === "chart" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] })
                    ] }) : /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      !xn(K.recipe) && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("FCS"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: K.recipe.sampleId,
                            onChange: (p) => Mt((b) => {
                              if (b.kind === "text" || b.kind === "figure" || b.kind === "proportions" || b.kind === "imagewall") return b;
                              const I = Pt.find(
                                (G) => G.id === p.target.value
                              );
                              if (!I) return b;
                              const B = Bt && Ir(
                                {
                                  hierarchyId: Bt.tree.id,
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
                      (K.recipe.kind === "biplot" || K.recipe.kind === "histogram") && /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: m("Draw the events of several files on this plot, as the Gating tab pools the checked files; a gate is drawn where every pooled file has it alike, with the pooled percentage"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: !!K.recipe.pool,
                            onChange: (p) => {
                              if (!p.target.checked) {
                                $a(null);
                                return;
                              }
                              const b = K.recipe.kind === "biplot" || K.recipe.kind === "histogram" ? K.recipe.sampleId : "";
                              $a(n.includes(b) ? n : [b]);
                            }
                          }
                        ),
                        m("Pool files")
                      ] }),
                      (K.recipe.kind === "biplot" || K.recipe.kind === "histogram") && K.recipe.pool && /* @__PURE__ */ C.jsx(
                        Fg,
                        {
                          files: r,
                          pool: K.recipe.pool.sampleIds,
                          checkedSampleIds: n,
                          groups: a,
                          fileGroups: i,
                          report: Wc,
                          onChange: $a
                        }
                      ),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Population"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: K.recipe.populationId,
                            onChange: (p) => Mt(
                              (b) => b.kind === "text" ? b : {
                                ...b,
                                populationId: p.target.value
                              }
                            ),
                            children: ss.map(({ popId: p, depth: b }) => {
                              var I;
                              return /* @__PURE__ */ C.jsxs("option", { value: p, children: [
                                " ".repeat(b * 2),
                                ((I = Bt == null ? void 0 : Bt.tree.populations[p]) == null ? void 0 : I.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      K.recipe.kind !== "strategy" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                        /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ C.jsx(
                            bs,
                            {
                              label: m("X channel"),
                              value: K.recipe.xChannel,
                              options: os,
                              onChange: (p) => Mt(
                                (b) => b.kind === "biplot" || b.kind === "histogram" ? { ...b, xChannel: p } : b
                              )
                            }
                          )
                        ] }),
                        K.recipe.kind === "biplot" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ C.jsx(
                            bs,
                            {
                              label: m("Y channel"),
                              value: K.recipe.yChannel ?? "",
                              options: os,
                              onChange: (p) => Mt(
                                (b) => b.kind === "biplot" ? { ...b, yChannel: p } : b
                              )
                            }
                          )
                        ] })
                      ] }),
                      K.recipe.kind === "strategy" && ((cs = K.recipe.populationIds) == null ? void 0 : cs.length) && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                        /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("{count} populations; the grid follows the live gates", { count: K.recipe.populationIds.length }) }),
                        /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", title: m("Tree: a column per depth and a row per leaf. Wrapped: the tree walked depth first and wrapped into rows of the columns beside."), children: [
                          m("Layout"),
                          /* @__PURE__ */ C.jsxs(
                            "select",
                            {
                              value: K.recipe.layout ?? "tree",
                              onChange: (p) => Mt((b) => b.kind === "strategy" ? { ...b, layout: p.target.value === "flow" ? "flow" : "tree" } : b),
                              children: [
                                /* @__PURE__ */ C.jsx("option", { value: "tree", children: m("Tree") }),
                                /* @__PURE__ */ C.jsx("option", { value: "flow", children: m("Wrapped") })
                              ]
                            }
                          )
                        ] }),
                        (K.recipe.layout ?? "tree") === "flow" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                          m("Columns"),
                          /* @__PURE__ */ C.jsx(de, { min: 1, max: 24, integer: !0, value: K.recipe.columns ?? 4, onCommit: (p) => Mt((b) => b.kind === "strategy" ? { ...b, columns: p } : b) })
                        ] }),
                        /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: m("An arrow from each gate to the panel of the population it makes, through the gutters"), children: [
                          /* @__PURE__ */ C.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: K.recipe.showArrows !== !1,
                              onChange: (p) => Mt((b) => b.kind === "strategy" ? { ...b, showArrows: p.target.checked } : b)
                            }
                          ),
                          m("Arrows")
                        ] }),
                        K.recipe.showArrows !== !1 && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                          /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", title: m("The arrows' colour; unticked, each takes its gate's"), children: [
                            /* @__PURE__ */ C.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: !!K.recipe.arrowColor,
                                onChange: (p) => Mt((b) => b.kind === "strategy" ? { ...b, arrowColor: p.target.checked ? "#444444" : void 0 } : b)
                              }
                            ),
                            m("One colour"),
                            K.recipe.arrowColor && /* @__PURE__ */ C.jsx(
                              "input",
                              {
                                type: "color",
                                value: K.recipe.arrowColor,
                                onChange: (p) => Mt((b) => b.kind === "strategy" ? { ...b, arrowColor: p.target.value } : b)
                              }
                            )
                          ] }),
                          /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", title: m("Where an arrow leaves its panel: level with the gate's label, or with the centre of the gate itself"), children: [
                            m("Arrows from"),
                            /* @__PURE__ */ C.jsxs(
                              "select",
                              {
                                value: K.recipe.arrowAnchor ?? "label",
                                onChange: (p) => Mt((b) => b.kind === "strategy" ? { ...b, arrowAnchor: p.target.value === "gate" ? "gate" : void 0 } : b),
                                children: [
                                  /* @__PURE__ */ C.jsx("option", { value: "label", children: m("Gate label") }),
                                  /* @__PURE__ */ C.jsx("option", { value: "gate", children: m("Gate centre") })
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                            m("Arrow width"),
                            /* @__PURE__ */ C.jsx(de, { min: 0.5, max: 6, step: 0.25, value: K.recipe.arrowWidth ?? 1.5, onCommit: (p) => Mt((b) => b.kind === "strategy" ? { ...b, arrowWidth: p } : b) })
                          ] })
                        ] })
                      ] }),
                      K.recipe.kind === "strategy" && !((fs = K.recipe.populationIds) != null && fs.length) && /* @__PURE__ */ C.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.fullPath,
                            onChange: (p) => Mt(
                              (b) => b.kind === "strategy" ? {
                                ...b,
                                fullPath: p.target.checked
                              } : b
                            )
                          }
                        ),
                        m("Full path from root")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Display"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: K.recipe.displayMode,
                            onChange: (p) => Mt(
                              (b) => b.kind === "text" ? b : {
                                ...b,
                                displayMode: p.target.value
                              }
                            ),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "pseudocolor", children: m("Pseudocolor") }),
                              /* @__PURE__ */ C.jsx("option", { value: "scatter", children: m("Scatter") }),
                              /* @__PURE__ */ C.jsx("option", { value: "contour", children: m("Contour") })
                            ]
                          }
                        )
                      ] }),
                      dt.mode !== "off" && /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: dt.mode === "populations" ? m("Drawn once per population of the iteration, for that population; unticked, it shows its own population on every page") : dt.mode === "metadata" ? m("Drawn once per value of {column}, pooling that value's files; unticked, it shows its own files on every page", { column: dt.column ?? "" }) : m("Drawn once per file of the iteration, for that file; unticked, it shows this file on every page"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: K.recipe.iterated === !0,
                            onChange: (p) => Mt(
                              (b) => b.kind === "text" ? b : { ...b, iterated: p.target.checked }
                            )
                          }
                        ),
                        m("Follows the iteration")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: m("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: hi }), children: [
                        m("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: zc || He(K, Pt),
                            value: K.recipe.title ?? "",
                            onChange: (p) => Mt(
                              (b) => b.kind === "text" ? b : { ...b, title: p.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ C.jsxs("summary", { children: [
                          m("Style"),
                          Object.keys(K.recipe.style ?? {}).length > 0 ? ` · ${m("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ C.jsx(
                          Il,
                          {
                            effective: Ja(U, K.recipe),
                            own: K.recipe.style ?? {},
                            onChange: (p) => Mt(
                              (b) => ie(b) ? { ...b, style: ks({ ...b.style, ...p }) } : b
                            )
                          }
                        ),
                        Object.keys(K.recipe.style ?? {}).length > 0 && /* @__PURE__ */ C.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: m("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => Mt((p) => {
                              if (!ie(p)) return p;
                              const { style: b, ...I } = p;
                              return I;
                            }),
                            children: m("Follow the sheet")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => k(
                            K.recipe
                          ),
                          children: m("Open in Gating")
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            lt === "page" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: m("Page") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Size"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    value: U.page.preset,
                    onChange: (p) => ur(yf(p.target.value, U.page.orientation, U.page)),
                    children: [
                      Object.entries(xf).map(([p, b]) => /* @__PURE__ */ C.jsx("option", { value: p, children: b.label }, p)),
                      /* @__PURE__ */ C.jsx("option", { value: "custom", children: m("Custom") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Orientation"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    value: U.page.orientation,
                    onChange: (p) => ur({ ...U.page, orientation: p.target.value }),
                    children: [
                      /* @__PURE__ */ C.jsx("option", { value: "portrait", children: m("Portrait") }),
                      /* @__PURE__ */ C.jsx("option", { value: "landscape", children: m("Landscape") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["width", "height"].map((p) => /* @__PURE__ */ C.jsxs("label", { children: [
                m(p === "width" ? "Width (mm)" : "Height (mm)"),
                /* @__PURE__ */ C.jsx(
                  de,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": m(p === "width" ? "Width (mm)" : "Height (mm)"),
                    value: Pl(U.page)[p === "width" ? "widthMm" : "heightMm"],
                    onCommit: (b) => {
                      const I = U.page.orientation === "landscape", B = p === "width" == !I ? "widthMm" : "heightMm";
                      ur({ ...U.page, preset: "custom", [B]: b });
                    }
                  }
                )
              ] }, p)) }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Margin (mm)"),
                /* @__PURE__ */ C.jsx(
                  de,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: U.page.marginMm,
                    onCommit: (p) => ur({ ...U.page, marginMm: p })
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ C.jsxs("label", { children: [
                  m("Pages across"),
                  /* @__PURE__ */ C.jsx(de, { min: 1, max: Ss, step: 1, integer: !0, "aria-label": m("Pages across"), value: U.page.columns, onCommit: (p) => ur({ ...U.page, columns: p }) })
                ] }),
                /* @__PURE__ */ C.jsxs("label", { children: [
                  m("Pages down"),
                  /* @__PURE__ */ C.jsx(de, { min: 1, max: Ss, step: 1, integer: !0, "aria-label": m("Pages down"), value: U.page.rows, onCommit: (p) => ur({ ...U.page, rows: p }) })
                ] })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Kc, disabled: !U.items.length, title: m("Make the page a custom size that holds every item inside the margin, as one page"), children: m("Fit page to content") }),
                /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Zc, disabled: !U.items.length, title: m("Scale and centre every item, as one group, to fill the first page inside its margin"), children: m("Fit content to page") })
              ] }),
              /* @__PURE__ */ C.jsx("h3", { children: m("Export") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Format"),
                /* @__PURE__ */ C.jsxs("select", { value: Rt, onChange: (p) => Gt(p.target.value), children: [
                  /* @__PURE__ */ C.jsx("option", { value: "pdf", children: m("PDF · the page at its size") }),
                  /* @__PURE__ */ C.jsx("option", { value: "svg", children: m("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ C.jsx("option", { value: "png", children: m("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Resolution (dpi)"),
                /* @__PURE__ */ C.jsx(
                  de,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: U.page.dpi,
                    onCommit: (p) => ur({ ...U.page, dpi: p })
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                /* @__PURE__ */ C.jsx("input", { type: "checkbox", checked: ve, onChange: (p) => Ne(p.target.checked) }),
                m("Crop to content")
              ] }),
              ve && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Padding (mm)"),
                /* @__PURE__ */ C.jsx(de, { min: 0, max: 50, step: 0.5, "aria-label": m("Padding (mm)"), value: Kr, onCommit: On })
              ] }),
              /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void is(), disabled: sr || !U.items.length, children: m(sr ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m(ve ? "The export is cut down to the items on each page plus the padding, so a figure comes out without the paper around it; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above." : "The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            lt === "iterate" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: m("Iterate") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Draw the sheet"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    value: dt.mode,
                    onChange: (p) => {
                      const b = p.target.value;
                      if (b === "metadata") {
                        const I = dt.column && o.includes(dt.column) ? dt.column : o[0] ?? "";
                        Xe({ ...dt, mode: "metadata", column: I, source: dt.source.kind === "metadata" ? { kind: "checked" } : dt.source });
                        return;
                      }
                      Xe({ ...dt, mode: b === "files" ? "files" : b === "populations" ? "populations" : "off" });
                    },
                    children: [
                      /* @__PURE__ */ C.jsx("option", { value: "off", children: m("Once") }),
                      /* @__PURE__ */ C.jsx("option", { value: "files", children: m("Once per file") }),
                      /* @__PURE__ */ C.jsx("option", { value: "populations", children: m("Once per population") }),
                      /* @__PURE__ */ C.jsx("option", { value: "metadata", disabled: !o.length, children: m("Once per value of a metadata column") })
                    ]
                  }
                )
              ] }),
              dt.mode === "metadata" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Column"),
                /* @__PURE__ */ C.jsx("select", { value: dt.column ?? "", onChange: (p) => Xe({ ...dt, column: p.target.value }), children: o.map((p) => /* @__PURE__ */ C.jsx("option", { value: p, children: p }, p)) })
              ] }),
              dt.mode !== "off" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                dt.mode === "populations" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  m("Populations"),
                  /* @__PURE__ */ C.jsxs(
                    "select",
                    {
                      value: ((ds = dt.populations) == null ? void 0 : ds.kind) === "branch" ? dt.populations.populationId : "all",
                      onChange: (p) => Xe({
                        ...dt,
                        populations: p.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: p.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ C.jsx("option", { value: "all", children: m("All in the tree") }),
                        (Yt ? fa(Yt.tree.populations, Yt.tree.root_population_id ?? "") : []).filter(({ popId: p }) => p !== (Yt == null ? void 0 : Yt.tree.root_population_id)).map(({ popId: p, depth: b }) => {
                          var I;
                          return /* @__PURE__ */ C.jsxs("option", { value: p, children: [
                            " ".repeat(b * 2),
                            m("Under {name}", { name: ((I = Yt == null ? void 0 : Yt.tree.populations[p]) == null ? void 0 : I.name) ?? p })
                          ] }, p);
                        })
                      ]
                    }
                  )
                ] }),
                (dt.mode === "files" || dt.mode === "metadata") && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  m("Files"),
                  /* @__PURE__ */ C.jsxs("select", { value: tf, onChange: (p) => Xe({ ...dt, source: ef(p.target.value) }), children: [
                    /* @__PURE__ */ C.jsx("option", { value: "checked", children: m("Checked files") }),
                    /* @__PURE__ */ C.jsx("option", { value: "all", children: m("All files") }),
                    a.map((p) => /* @__PURE__ */ C.jsx("option", { value: `group:${p.id}`, children: m("Group {name}", { name: p.name }) }, p.id)),
                    dt.mode === "files" && o.flatMap(
                      (p) => Qc(p).map((b) => /* @__PURE__ */ C.jsxs("option", { value: `meta:${p}=${b}`, children: [
                        p,
                        " = ",
                        b
                      ] }, `${p}=${b}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  m("Arrangement"),
                  /* @__PURE__ */ C.jsxs(
                    "select",
                    {
                      value: dt.arrangement.kind,
                      onChange: (p) => Xe({
                        ...dt,
                        arrangement: p.target.value === "tiles" ? { kind: "tiles", rows: 2, columns: 2, order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ C.jsx("option", { value: "page-per-unit", children: dt.mode === "populations" ? m("One page per population") : dt.mode === "metadata" ? m("One page per value") : m("One page per file") }),
                        /* @__PURE__ */ C.jsx("option", { value: "tiles", children: m("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                dt.arrangement.kind === "tiles" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                  /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((p) => /* @__PURE__ */ C.jsxs("label", { children: [
                    m(p === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ C.jsx(
                      de,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": m(p === "columns" ? "Tiles across" : "Tiles down"),
                        value: dt.arrangement.kind === "tiles" ? dt.arrangement[p] : 1,
                        onCommit: (b) => {
                          dt.arrangement.kind === "tiles" && Xe({ ...dt, arrangement: { ...dt.arrangement, [p]: b } });
                        }
                      }
                    )
                  ] }, p)) }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                    m("Order"),
                    /* @__PURE__ */ C.jsxs(
                      "select",
                      {
                        value: dt.arrangement.order,
                        onChange: (p) => dt.arrangement.kind === "tiles" && Xe({ ...dt, arrangement: { ...dt.arrangement, order: p.target.value === "column-major" ? "column-major" : "row-major" } }),
                        children: [
                          /* @__PURE__ */ C.jsx("option", { value: "row-major", children: m("Across, then down") }),
                          /* @__PURE__ */ C.jsx("option", { value: "column-major", children: m("Down, then across") })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                    m("Gap between tiles (px)"),
                    /* @__PURE__ */ C.jsx(
                      de,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: dt.arrangement.gap,
                        onCommit: (p) => {
                          dt.arrangement.kind === "tiles" && Xe({ ...dt, arrangement: { ...dt.arrangement, gap: p } });
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: dt.mode === "populations" ? m("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: Ke.length, of: (Yt == null ? void 0 : Yt.name) ?? "the file", pages: Math.max(1, ge.length) }) : dt.mode === "metadata" ? m("{values} values of {column} over {files} files → {pages} pages. Items marked “Follows the iteration” pool the files of each value; the others repeat. Text and titles may use {sample} (the value), {meta:column}, {file} (how many files), {n} and {N}; a plot title may also use {population} and {count}.", { values: Ke.length, column: dt.column ?? "", files: Ke.reduce((p, b) => {
                  var I;
                  return p + (((I = b.sampleIds) == null ? void 0 : I.length) ?? 0);
                }, 0), pages: Math.max(1, ge.length) }) : m("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: Ke.length, pages: Math.max(1, ge.length) }) })
              ] })
            ] }),
            lt === "style" && U && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: m("Style") }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Plot titles"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    "aria-label": m("Plot titles"),
                    value: Bo ? "custom" : ((ps = ua.find((p) => p.template === (U.titleTemplate ?? ""))) == null ? void 0 : ps.id) ?? "custom",
                    onChange: (p) => {
                      const b = ua.find((I) => I.id === p.target.value);
                      Oc(!b), Ot((I) => {
                        var B;
                        b ? b.template ? I.titleTemplate = b.template : delete I.titleTemplate : I.titleTemplate = ((B = I.titleTemplate) == null ? void 0 : B.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      ua.map((p) => /* @__PURE__ */ C.jsx("option", { value: p.id, children: m(p.label) }, p.id)),
                      /* @__PURE__ */ C.jsx("option", { value: "custom", children: m("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const p = U.items.filter((b) => Xo(b));
                return p.length ? /* @__PURE__ */ C.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  m("{count} plots keep a title of their own, so the template does not reach them.", { count: p.length }),
                  " ",
                  /* @__PURE__ */ C.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: m("Drop those plots' own titles so every plot on the sheet follows the template"),
                      onClick: () => Ot((b) => {
                        for (const I of b.items) ie(I.recipe) && delete I.recipe.title;
                      }),
                      children: m("Use the template for all")
                    }
                  )
                ] }) : null;
              })(),
              (Bo || !ua.some((p) => p.template === (U.titleTemplate ?? ""))) && (() => {
                var Dt;
                const p = U.titleTemplate ?? "", b = sg(p), I = (b == null ? void 0 : b.tokens) ?? [], B = (b == null ? void 0 : b.separator) ?? Nc, G = (ut) => {
                  var _t;
                  return ((_t = Fo.find((ee) => ee.token === ut)) == null ? void 0 : _t.label) ?? ut;
                }, $ = (ut) => Ot((_t) => {
                  _t.titleTemplate = Dl(ut, B);
                }), Y = Vt.items.find((ut) => ie(ut.recipe)), st = Y && ie(Y.recipe) ? Ta(p, Dr(Y.recipe, Y.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ C.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": m("Title builder"), children: [
                  /* @__PURE__ */ C.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": m("Fields in the title"), children: [
                    I.length === 0 && /* @__PURE__ */ C.jsx("span", { className: "gl-hint", children: m(b === null && p ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    I.map((ut, _t) => /* @__PURE__ */ C.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": m("Remove {field}", { field: G(ut) }),
                        title: m("Remove {field} from the title", { field: G(ut) }),
                        onClick: () => $(I.filter((ee, be) => be !== _t)),
                        children: [
                          G(ut),
                          " ×"
                        ]
                      },
                      `${ut}-${_t}`
                    ))
                  ] }),
                  /* @__PURE__ */ C.jsx("div", { className: "gl-title-builder-fields", "aria-label": m("Fields to add"), children: Fo.map((ut) => /* @__PURE__ */ C.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-chip",
                      "aria-label": m("Add {field}", { field: ut.label }),
                      title: ut.token,
                      onClick: () => $([...I, ut.token]),
                      children: ut.label
                    },
                    ut.token
                  )) }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                    m("Between fields"),
                    /* @__PURE__ */ C.jsx(
                      "select",
                      {
                        "aria-label": m("Separator"),
                        value: ((Dt = vi.find((ut) => ut.value === B)) == null ? void 0 : Dt.id) ?? "dot",
                        onChange: (ut) => {
                          var ee;
                          const _t = ((ee = vi.find((be) => be.id === ut.target.value)) == null ? void 0 : ee.value) ?? " · ";
                          jc(_t), I.length && Ot((be) => {
                            be.titleTemplate = Dl(I, _t);
                          });
                        },
                        children: vi.map((ut) => /* @__PURE__ */ C.jsx("option", { value: ut.id, children: m(ut.label) }, ut.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                    m("Template"),
                    /* @__PURE__ */ C.jsx(
                      "input",
                      {
                        "aria-label": m("Title template"),
                        value: p,
                        onChange: (ut) => Ot((_t) => {
                          _t.titleTemplate = ut.target.value;
                        })
                      }
                    )
                  ] }),
                  st && /* @__PURE__ */ C.jsx("div", { className: "gl-hint gl-title-builder-preview", children: m("First plot reads: {title}", { title: st }) })
                ] });
              })(),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise.`, { list: hi }) }),
              /* @__PURE__ */ C.jsx(
                Il,
                {
                  effective: Ja(U),
                  own: U.style ?? {},
                  onChange: (p) => Ot((b) => {
                    b.style = ks({ ...b.style, ...p });
                  })
                }
              ),
              Object.keys(U.style ?? {}).length > 0 && /* @__PURE__ */ C.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  onClick: () => Ot((p) => {
                    delete p.style;
                  }),
                  children: m("Reset to defaults")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ C.jsx(bf, { menu: Bc, onClose: () => Xa(null) }),
          /* @__PURE__ */ C.jsxs(
            "div",
            {
              ref: (p) => {
                Ve.current = p, q(p);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": m("Layout page"),
              onKeyDown: rf,
              children: [
                !pt && F && /* @__PURE__ */ C.jsx(
                  Qv,
                  {
                    ref: nt,
                    container: F,
                    dragContainer: F,
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
                    onDragStart: qc,
                    onSelectEnd: Vc
                  }
                ),
                /* @__PURE__ */ C.jsx(
                  "div",
                  {
                    className: "gl-layout-zoom",
                    style: { width: U.width * xt, height: U.height * xt },
                    children: /* @__PURE__ */ C.jsxs(
                      "section",
                      {
                        ref: (p) => {
                          Zr.current = p, H(p);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": U.name,
                        onContextMenu: Fc,
                        style: { width: U.width, height: U.height, transform: `scale(${xt})` },
                        children: [
                          ha(U.page).map((p) => {
                            const b = yi(U.page), I = ys(U.page.marginMm);
                            return /* @__PURE__ */ C.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: p.x, top: p.y, width: b.width, height: b.height }, children: I > 0 && /* @__PURE__ */ C.jsx("div", { className: "gl-layout-page-margin", style: { inset: I } }) }, `${p.row}-${p.column}`);
                          }),
                          Vt.items.length === 0 && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ C.jsx("strong", { children: m("Blank layout") }),
                            /* @__PURE__ */ C.jsx("span", { children: m(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          Vt.items.map((p) => /* @__PURE__ */ C.jsx(
                            Wg,
                            {
                              item: p,
                              templateText: (() => {
                                const b = U.items.find((I) => I.id === p.templateId);
                                return (b == null ? void 0 : b.recipe.kind) === "text" ? b.recipe.text : void 0;
                              })(),
                              selected: _.includes(p.id),
                              samples: Pt,
                              state: f,
                              globalScales: d,
                              dataRevision: M,
                              densityColorPower: D,
                              style: Ja(U, p.recipe),
                              titleTemplate: Xo(p, p.templateSampleId) || Lo,
                              describe: Dr,
                              checkedSampleIds: n,
                              metadataById: Er,
                              files: r,
                              sources: ke.sources,
                              divisionProfiles: S,
                              imageService: w,
                              canvasScale: Lt,
                              onTextChange: (b, I) => {
                                if (!b.trim()) {
                                  rn([p.templateId]);
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
                                (!_.includes(p.id) || _.length > 1) && j([p.id]);
                              },
                              textEditing: O === p.id,
                              onTextEditStart: () => {
                                j([p.id]), R(p.id);
                              },
                              onIsolate: p.group && _.includes(p.id) && _.length > 1 ? () => j([p.id]) : void 0,
                              onTextEditEnd: () => {
                                var b;
                                R((I) => I === p.id ? null : I), (b = Ve.current) == null || b.focus({ preventScroll: !0 });
                              }
                            },
                            p.id
                          )),
                          !pt && /* @__PURE__ */ C.jsx(
                            jv,
                            {
                              ref: Z,
                              target: We.length === 1 ? We[0] : We,
                              zoom: 1 / xt,
                              origin: !1,
                              checkInput: !0,
                              passDragArea: !0,
                              draggable: !0,
                              resizable: !0,
                              useMutationObserver: !0,
                              useResizeObserver: !0,
                              keepRatio: yt.shift,
                              throttleDragRotate: yt.shift ? 45 : 0,
                              snappable: !yt.meta,
                              snapThreshold: 6,
                              isDisplaySnapDigit: !1,
                              isDisplayInnerSnapDigit: !1,
                              snapDirections: Tl,
                              elementSnapDirections: Tl,
                              elementGuidelines: rt,
                              verticalGuidelines: rs.vertical,
                              horizontalGuidelines: rs.horizontal,
                              snapGridWidth: A ? _l : 0,
                              snapGridHeight: A ? _l : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              individualGroupable: en,
                              container: en ? W : void 0,
                              onDragStart: $c,
                              onDrag: Qo,
                              onDragEnd: (p) => {
                                const b = ts(p);
                                Yn(b, p.lastEvent, p.isDrag, () => Fn(b, !!p.datas.alt));
                              },
                              onDragGroupStart: (p) => {
                                var b;
                                p.datas.alt = !!((b = p.inputEvent) != null && b.altKey), Wn([...p.targets ?? []], p.datas.alt ? Zo(p.targets ?? []) : void 0);
                              },
                              onDragGroup: (p) => p.events.forEach(Qo),
                              onDragGroupEnd: (p) => Yn(p.targets, p.lastEvent, p.isDrag, () => Fn(p.targets, !!p.datas.alt)),
                              onResizeStart: (p) => {
                                var b;
                                Wn([p.target]), (b = p.inputEvent) != null && b.altKey && p.setFixedDirection([0, 0]);
                              },
                              onResize: es,
                              onResizeEnd: (p) => Yn([p.target], p.lastEvent, p.isDrag, () => Fn([p.target], !1)),
                              onResizeGroupStart: (p) => {
                                var b;
                                Wn([...p.targets ?? []]), (b = p.inputEvent) != null && b.altKey && p.events.forEach((I) => I.setFixedDirection([0, 0]));
                              },
                              onResizeGroup: (p) => p.events.forEach(es),
                              onResizeGroupEnd: (p) => Yn(p.targets, p.lastEvent, p.isDrag, () => Fn(p.targets, !1)),
                              onClick: (p) => {
                                var b, I;
                                if (An.current) {
                                  An.current = !1;
                                  return;
                                }
                                ((b = p.inputEvent) != null && b.shiftKey || en) && ((I = nt.current) == null || I.clickTarget(p.inputEvent, p.inputTarget));
                              },
                              onClickGroup: (p) => {
                                var b;
                                (b = nt.current) == null || b.clickTarget(p.inputEvent, p.inputTarget);
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
  $g as LayoutTab,
  Gg as isBakedTitle
};
