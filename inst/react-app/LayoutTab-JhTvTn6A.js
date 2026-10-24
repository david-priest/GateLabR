import { a as tt, u as Ur, j as S, B as ks, E as Ms, G as _s, H as ba, I as Vl, s as kf, z as Ts, J as Is, K as si, L as Rs, N as Mf, O as Ti, P as sn, Q as _f, R as Ul, U as Kl, f as Tf, V as If, W as Rf, X as Ii, Y as ga, Z as Ps, _ as Zl, $ as Ri, a0 as Jl, a1 as oe, a2 as un, a3 as Nr, a4 as Pf, h as Of, a5 as Nf, a6 as Sa, a7 as jf, a8 as zf, a9 as Af, aa as Os, k as Bf, T as Gf, ab as ve, ac as Ff, S as Ns, ad as li, ae as Lf, af as Wf, ag as js, ah as Yf, ai as Xf, aj as Kn, ak as zs, al as Hf, am as $f, an as qf, ao as Vf, ap as As, aq as Ql, ar as Uf, as as Kf, at as Zf, au as Bs, av as Gs, aw as Jf, ax as Qf, ay as td, az as Fs, aA as ed, aB as rd, aC as nd, aD as Ls, aE as tu, aF as ad, aG as id, aH as od, aI as sd, aJ as ld, aK as ud, aL as cd, aM as fd, aN as dd, aO as pd, l as ui, aP as hd, aQ as vd, aR as gd, aS as md, aT as xd, aU as yd, aV as bd, aW as Sd, aX as Ws } from "./embed-C4wtq6TR.js";
function co(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return !0;
  return !1;
}
function eu(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return t[n];
  return null;
}
function ru(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function fo(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function Cd() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function wd(t, e) {
  var r = fo("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return r ? r[3] : "";
}
function Pi(t) {
  return t.replace(/_/g, ".");
}
function cn(t, e) {
  var r = null, n = "-1";
  return co(t, function(a) {
    var i = fo("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (r = a, n = i[3] || "-1", a.versionAlias ? n = a.versionAlias : a.versionTest && (n = wd(a.versionTest.toLowerCase(), e) || n), n = Pi(n), !0);
  }), {
    preset: r,
    version: n
  };
}
function Zn(t, e) {
  var r = {
    brand: "",
    version: "-1"
  };
  return co(t, function(n) {
    var a = nu(e, n);
    return a ? (r.brand = n.id, r.version = n.versionAlias || a.version, r.version !== "-1") : !1;
  }), r;
}
function nu(t, e) {
  return eu(t, function(r) {
    var n = r.brand;
    return fo("" + e.test, n.toLowerCase());
  });
}
var au = [{
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
}], iu = [{
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
}], Oi = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], ou = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], su = [{
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
function lu(t) {
  return !!cn(ou, t).preset;
}
function Ed(t) {
  var e = ru(t), r = !!/mobi/g.exec(e), n = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: lu(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = cn(au, e), o = i.preset, s = i.version, l = cn(su, e), u = l.preset, c = l.version, f = cn(iu, e);
  if (n.chromium = !!f.preset, n.chromiumVersion = f.version, !n.chromium) {
    var d = cn(Oi, e);
    n.webkit = !!d.preset, n.webkitVersion = d.version;
  }
  return u && (a.name = u.id, a.version = c, a.majorVersion = parseInt(c, 10)), o && (n.name = o.id, n.version = s, n.webview && a.name === "ios" && n.name !== "safari" && (n.webview = !1)), n.majorVersion = parseInt(n.version, 10), {
    browser: n,
    os: a,
    isMobile: r,
    isHints: !1
  };
}
function Dd(t) {
  var e = navigator.userAgentData, r = (e.uaList || e.brands).slice(), n = e.mobile || !1, a = r[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!Zn(ou, r).brand || lu(ru())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && co(Oi, function(d) {
    return nu(r, d);
  });
  var l = Zn(iu, r);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var u = Zn(Oi, r);
    o.webkit = !!u.brand, o.webkitVersion = u.version || "-1";
  }
  var c = eu(su, function(d) {
    return new RegExp("" + d.test, "g").exec(i);
  });
  s.name = c ? c.id : "";
  {
    var f = Zn(au, r);
    o.name = f.brand || o.name, o.version = f.brand && t ? t.uaFullVersion : f.version;
  }
  return o.webkit && (s.name = n ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = Pi(s.version), o.version = Pi(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: n,
    isHints: !0
  };
}
function kd(t) {
  return Cd() ? Dd() : Ed(t);
}
function Md(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  return e.map(function(n) {
    return n.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function _d(t, e) {
  return e.replace(/([^}{]*){/gm, function(r, n) {
    return n.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function ir(t, e) {
  return function(r) {
    r && (t[e] = r);
  };
}
function uu(t, e, r) {
  return function(n) {
    n && (t[e][r] = n);
  };
}
function Td(t, e) {
  return function(r) {
    var n = r.prototype;
    t.forEach(function(a) {
      e(n, a);
    });
  };
}
function cu(t, e) {
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
var Id = "function", Rd = "object", Pd = "string", Od = "number", po = "undefined", fu = typeof window !== po, Nd = typeof document !== po && document, jd = [{
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
}], Qt = 1e-7, Jn = {
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
function zd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function Ca(t, e, r, n) {
  return (t * n + e * r) / (r + n);
}
function ho(t) {
  return typeof t === po;
}
function ye(t) {
  return t && typeof t === Rd;
}
function qt(t) {
  return Array.isArray(t);
}
function Me(t) {
  return typeof t === Pd;
}
function Cn(t) {
  return typeof t === Od;
}
function Ba(t) {
  return typeof t === Id;
}
function Ad(t, e) {
  var r = t === "" || t == " ", n = e === "" || e == " ";
  return n && r || t === e;
}
function du(t, e, r, n, a) {
  var i = vo(t, e, r);
  return i ? r : Bd(t, e, r + 1, n, a);
}
function vo(t, e, r) {
  if (!t.ignore)
    return null;
  var n = e.slice(Math.max(r - 3, 0), r + 3).join("");
  return new RegExp(t.ignore).exec(n);
}
function Bd(t, e, r, n, a) {
  for (var i = function(u) {
    var c = e[u].trim();
    if (c === t.close && !vo(t, e, u))
      return {
        value: u
      };
    var f = u, d = be(a, function(h) {
      var v = h.open;
      return v === c;
    });
    if (d && (f = du(d, e, u, n, a)), f === -1)
      return o = u, "break";
    u = f, o = u;
  }, o, s = r; s < n; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function go(t, e) {
  var r = Me(e) ? {
    separator: e
  } : e, n = r.separator, a = n === void 0 ? "," : n, i = r.isSeparateFirst, o = r.isSeparateOnlyOpenClose, s = r.isSeparateOpenClose, l = s === void 0 ? o : s, u = r.openCloseCharacters, c = u === void 0 ? jd : u, f = c.map(function(k) {
    var T = k.open, g = k.close;
    return T === g ? T : T + "|" + g;
  }).join("|"), d = "(\\s*" + a + "\\s*|" + f + "|\\s+)", h = new RegExp(d, "g"), v = t.split(h).filter(function(k) {
    return k && k !== "undefined";
  }), m = v.length, x = [], y = [];
  function C() {
    return y.length ? (x.push(y.join("")), y = [], !0) : !1;
  }
  for (var w = function(k) {
    var T = v[k].trim(), g = k, _ = be(c, function(P) {
      var z = P.open;
      return z === T;
    }), j = be(c, function(P) {
      var z = P.close;
      return z === T;
    });
    if (_) {
      if (g = du(_, v, k, m, c), g !== -1 && l)
        return C() && i || (x.push(v.slice(k, g + 1).join("")), k = g, i) ? (D = k, "break") : (D = k, "continue");
    } else if (j && !vo(j, v, k)) {
      var R = zd(c);
      return R.splice(c.indexOf(j), 1), {
        value: go(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: R
        })
      };
    } else if (Ad(T, a) && !o)
      return C(), i ? (D = k, "break") : (D = k, "continue");
    g === -1 && (g = m - 1), y.push(v.slice(k, g + 1).join("")), k = g, D = k;
  }, D, M = 0; M < m; ++M) {
    var E = w(M);
    if (M = D, typeof E == "object") return E.value;
    if (E === "break") break;
  }
  return y.length && x.push(y.join("")), x;
}
function or(t) {
  return go(t, "");
}
function mr(t) {
  return go(t, ",");
}
function pu(t) {
  var e = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(t);
  return !e || e.length < 4 ? {} : {
    prefix: e[1],
    value: e[2],
    suffix: e[3]
  };
}
function yr(t) {
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
function Ni(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, r) {
    return r.toUpperCase();
  });
}
function Gd(t, e) {
  return t.replace(/([a-z])([A-Z])/g, function(r, n, a) {
    return "" + n + e + a.toLowerCase();
  });
}
function wn() {
  return Date.now ? Date.now() : (/* @__PURE__ */ new Date()).getTime();
}
function Je(t, e, r) {
  r === void 0 && (r = -1);
  for (var n = t.length, a = 0; a < n; ++a)
    if (e(t[a], a, t))
      return a;
  return r;
}
function be(t, e, r) {
  var n = Je(t, e);
  return n > -1 ? t[n] : r;
}
var hu = /* @__PURE__ */ (function() {
  var t = wn(), e = fu && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(r) {
    var n = wn(), a = setTimeout(function() {
      r(n - t);
    }, 1e3 / 60);
    return a;
  };
})(), Fd = /* @__PURE__ */ (function() {
  var t = fu && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function Kr(t) {
  return Object.keys(t);
}
function jt(t, e) {
  var r = yr(t), n = r.value, a = r.unit;
  if (ye(e)) {
    var i = e[a];
    if (i) {
      if (Ba(i))
        return i(n);
      if (Jn[a])
        return Jn[a](n, i);
    }
  } else if (a === "%")
    return n * e / 100;
  return Jn[a] ? Jn[a](n) : n;
}
function wa(t, e, r) {
  return Math.max(e, Math.min(t, r));
}
function Ys(t, e, r, n) {
  return n === void 0 && (n = t[0] / t[1]), [[Ct(e[0], Qt), Ct(e[0] / n, Qt)], [Ct(e[1] * n, Qt), Ct(e[1], Qt)]].filter(function(a) {
    return a.every(function(i, o) {
      var s = e[o], l = Ct(s, Qt);
      return r ? i <= s || i <= l : i >= s || i >= l;
    });
  })[0] || t;
}
function mo(t, e, r, n) {
  if (!n)
    return t.map(function(h, v) {
      return wa(h, e[v], r[v]);
    });
  var a = t[0], i = t[1], o = n === !0 ? a / i : n, s = Ys(t, e, !1, o), l = s[0], u = s[1], c = Ys(t, r, !0, o), f = c[0], d = c[1];
  return a < l || i < u ? (a = l, i = u) : (a > f || i > d) && (a = f, i = d), [a, i];
}
function Ld(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return r;
}
function ji(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return e ? r / e : 0;
}
function Vt(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function Wd(t) {
  return [0, 1].map(function(e) {
    return ji(t.map(function(r) {
      return r[e];
    }));
  });
}
function Xs(t) {
  var e = Wd(t), r = Vt(e, t[0]), n = Vt(e, t[1]);
  return r < n && n - r < Math.PI || r > n && n - r < -Math.PI ? 1 : -1;
}
function Xe(t, e) {
  return Math.sqrt(Math.pow((e ? e[0] : 0) - t[0], 2) + Math.pow((e ? e[1] : 0) - t[1], 2));
}
function Ct(t, e) {
  if (!e)
    return t;
  var r = 1 / e;
  return Math.round(t / e) / r;
}
function Hs(t, e) {
  return t.forEach(function(r, n) {
    t[n] = Ct(t[n], e);
  }), t;
}
function Yd(t) {
  for (var e = [], r = 0; r < t; ++r)
    e.push(r);
  return e;
}
function Xd(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function te(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function xo(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function vu(t, e) {
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
function $t(t, e, r, n) {
  t.removeEventListener(e, r, n);
}
function Oe(t) {
  return (t == null ? void 0 : t.ownerDocument) || Nd;
}
function yo(t) {
  return Oe(t).documentElement;
}
function ur(t) {
  return Oe(t).body;
}
function De(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function gu(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function En(t) {
  return ye(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function Hd(t, e, r, n, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = r + o * a, l = n + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function $d(t, e, r, n, a) {
  for (var i = 0; i < a; ++i) {
    var o = r + i * a, s = n + i * a, l = t[o], u = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = u;
  }
}
function qd(t, e, r, n, a) {
  for (var i = 0; i < n; ++i) {
    var o = r + i * n;
    t[o] /= a, e[o] /= a;
  }
}
function mu(t, e, r) {
  for (var n = t.slice(), a = 0; a < r; ++a)
    n[a * r + e - 1] = 0, n[(e - 1) * r + a] = 0;
  return n[(e - 1) * (r + 1)] = 1, n;
}
function je(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = t.slice(), n = Gt(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!Ct(r[i], Qt)) {
      for (var o = a + 1; o < e; ++o)
        if (r[e * a + o]) {
          $d(r, n, a, o, e);
          break;
        }
    }
    if (!Ct(r[i], Qt))
      return [];
    qd(r, n, a, e, r[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, u = r[l];
      !Ct(u, Qt) || a === o || Hd(r, n, s, a, e, -u);
    }
  }
  return n;
}
function Vd(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = 0; n < e; ++n)
    for (var a = 0; a < e; ++a)
      r[a * e + n] = t[e * n + a];
  return r;
}
function xu(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = t[e * e - 1], a = 0; a < e - 1; ++a)
    r[a] = t[e * (e - 1) + a] / n;
  return r[e - 1] = 0, r;
}
function Ud(t, e) {
  for (var r = Gt(e), n = 0; n < e - 1; ++n)
    r[e * (e - 1) + n] = t[n] || 0;
  return r;
}
function br(t, e) {
  for (var r = t.slice(), n = t.length; n < e - 1; ++n)
    r[n] = 0;
  return r[e - 1] = 1, r;
}
function ze(t, e, r) {
  if (e === void 0 && (e = Math.sqrt(t.length)), e === r)
    return t;
  for (var n = Gt(r), a = Math.min(e, r), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      n[i * r + o] = t[i * e + o];
    n[(i + 1) * r - 1] = t[(i + 1) * e - 1], n[(r - 1) * r + i] = t[(e - 1) * e + i];
  }
  return n[r * r - 1] = t[e * e - 1], n;
}
function Ea(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  var n = Gt(t);
  return e.forEach(function(a) {
    n = zt(n, a, t);
  }), n;
}
function zt(t, e, r) {
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
function Pt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] + e[a];
  return n;
}
function gt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] - e[a];
  return n;
}
function Kd(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function yu(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function le(t, e, r) {
  r === void 0 && (r = e.length);
  var n = zt(t, e, r), a = n[r - 1];
  return n.map(function(i) {
    return i / a;
  });
}
function Zd(t, e) {
  return zt(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function Jd(t, e) {
  return zt(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function Qd(t, e) {
  return zt(t, _n(e, 4));
}
function Qn(t, e) {
  var r = e[0], n = r === void 0 ? 1 : r, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return zt(t, [n, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function Mn(t, e) {
  return le(_n(e, 3), br(t, 3));
}
function ci(t, e) {
  var r = e[0], n = r === void 0 ? 0 : r, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return zt(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, n, i, s, 1], 4);
}
function zi(t, e) {
  return zt(t, e, 4);
}
function _n(t, e) {
  var r = Math.cos(t), n = Math.sin(t), a = Gt(e);
  return a[0] = r, a[1] = n, a[e] = -n, a[e + 1] = r, a;
}
function Gt(t) {
  for (var e = t * t, r = [], n = 0; n < e; ++n)
    r[n] = n % (t + 1) ? 0 : 1;
  return r;
}
function bo(t, e) {
  for (var r = Gt(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[(e + 1) * a] = t[a];
  return r;
}
function Sr(t, e) {
  for (var r = Gt(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[e * (e - 1) + a] = t[a];
  return r;
}
function So(t, e, r, n, a, i, o, s) {
  var l = t[0], u = t[1], c = e[0], f = e[1], d = r[0], h = r[1], v = n[0], m = n[1], x = a[0], y = a[1], C = i[0], w = i[1], D = o[0], M = o[1], E = s[0], k = s[1], T = [l, 0, c, 0, d, 0, v, 0, u, 0, f, 0, h, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, c, 0, d, 0, v, 0, u, 0, f, 0, h, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, -x * l, -y * l, -C * c, -w * c, -D * d, -M * d, -E * v, -k * v, -x * u, -y * u, -C * f, -w * f, -D * h, -M * h, -E * m, -k * m], g = je(T, 8);
  if (!g.length)
    return [];
  var _ = zt(g, [x, y, C, w, D, M, E, k], 8);
  return _[8] = 1, ze(Vd(_), 3, 4);
}
var pn = function() {
  return pn = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, pn.apply(this, arguments);
};
function Co() {
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
function Wr(t, e) {
  return e === void 0 && (e = 0), Or(Yr(t, e));
}
function ma(t, e) {
  var r = le(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), n = r[3] || 1;
  return [
    r[0] / n,
    r[1] / n,
    r[2] / n
  ];
}
function tp(t, e) {
  e === void 0 && (e = document.body);
  for (var r = t, n = Co(); r; ) {
    var a = getComputedStyle(r).transform;
    if (n = zi(Wr(a), n), r === e)
      break;
    r = r.parentElement;
  }
  return n = je(n, 4), n[12] = 0, n[13] = 0, n[14] = 0, n;
}
function Or(t) {
  var e = Co();
  return t.forEach(function(r) {
    var n = r.matrixFunction, a = r.functionValue;
    n && (e = n(e, a));
  }), e;
}
function Yr(t, e) {
  e === void 0 && (e = 0);
  var r = qt(t) ? t : or(t);
  return r.map(function(n) {
    var a = pu(n), i = a.prefix, o = a.value, s = null, l = i, u = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var c = ye(e) ? pn(pn({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, f = mr(o).map(function(P, z) {
        return z === 0 && "x%" in c ? c["%"] = e["x%"] : z === 1 && "y%" in c ? c["%"] = e["y%"] : c["%"] = e["o%"], jt(P, c);
      }), d = f[0], h = f[1], v = h === void 0 ? 0 : h, m = f[2], x = m === void 0 ? 0 : m;
      s = ci, u = [d, v, x];
    } else if (i === "translateY") {
      var y = ye(e) ? pn({ "%": e["y%"] }, e) : {
        "%": e
      }, v = jt(o, y);
      s = ci, u = [0, v, 0];
    } else if (i === "translateZ") {
      var x = parseFloat(o);
      s = ci, u = [0, 0, x];
    } else if (i === "scale" || i === "scale3d") {
      var C = mr(o).map(function(P) {
        return parseFloat(P);
      }), w = C[0], D = C[1], M = D === void 0 ? w : D, E = C[2], k = E === void 0 ? 1 : E;
      s = Qn, u = [w, M, k];
    } else if (i === "scaleX") {
      var w = parseFloat(o);
      s = Qn, u = [w, 1, 1];
    } else if (i === "scaleY") {
      var M = parseFloat(o);
      s = Qn, u = [1, M, 1];
    } else if (i === "scaleZ") {
      var k = parseFloat(o);
      s = Qn, u = [1, 1, k];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var T = yr(o), g = T.unit, _ = T.value, j = g === "rad" ? _ : _ * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = Qd) : i === "rotateX" ? s = Zd : i === "rotateY" && (s = Jd), u = j;
    } else if (i === "matrix3d")
      s = zi, u = mr(o).map(function(P) {
        return parseFloat(P);
      });
    else if (i === "matrix") {
      var R = mr(o).map(function(P) {
        return parseFloat(P);
      });
      s = zi, u = [
        R[0],
        R[1],
        0,
        0,
        R[2],
        R[3],
        0,
        0,
        0,
        0,
        1,
        0,
        R[4],
        R[5],
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
var ep = /* @__PURE__ */ (function() {
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
})(), rp = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(r) {
    return this.object[r];
  }, e.set = function(r, n) {
    this.object[r] = n;
  }, t;
})(), np = typeof Map == "function", ap = /* @__PURE__ */ (function() {
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
function ip(t, e) {
  var r = [], n = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new ap();
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
var op = /* @__PURE__ */ (function() {
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
    var r = ip(this.changedBeforeAdded, this.fixed), n = this.changed, a = [];
    this.cacheOrdered = r.filter(function(i, o) {
      var s = i[0], l = i[1], u = n[o], c = u[0], f = u[1];
      if (s !== l)
        return a.push([c, f]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function wo(t, e, r) {
  var n = np ? Map : r ? rp : ep, a = r || function(C) {
    return C;
  }, i = [], o = [], s = [], l = t.map(a), u = e.map(a), c = new n(), f = new n(), d = [], h = [], v = {}, m = [], x = 0, y = 0;
  return l.forEach(function(C, w) {
    c.set(C, w);
  }), u.forEach(function(C, w) {
    f.set(C, w);
  }), l.forEach(function(C, w) {
    var D = f.get(C);
    typeof D > "u" ? (++y, o.push(w)) : v[D] = y;
  }), u.forEach(function(C, w) {
    var D = c.get(C);
    typeof D > "u" ? (i.push(w), ++x) : (s.push([D, w]), y = v[w] || 0, d.push([D - y, w - x]), h.push(w === D), D !== w && m.push([D, w]));
  }), o.reverse(), new op(t, e, i, o, m, s, d, h);
}
var sp = /* @__PURE__ */ (function() {
  function t(r, n) {
    r === void 0 && (r = []), this.findKeyCallback = n, this.list = [].slice.call(r);
  }
  var e = t.prototype;
  return e.update = function(r) {
    var n = [].slice.call(r), a = wo(this.list, n, this.findKeyCallback);
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
var Ai = function(t, e) {
  return Ai = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Ai(t, e);
};
function lp(t, e) {
  Ai(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var bu = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), Su = /* @__PURE__ */ (function(t) {
  lp(e, t);
  function e(r) {
    return r === void 0 && (r = []), t.call(this, r, bu) || this;
  }
  return e;
})(sp);
function jr(t, e) {
  return wo(t, e, bu);
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
var Bi = function() {
  return Bi = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Bi.apply(this, arguments);
};
function up() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
var Tn = /* @__PURE__ */ (function() {
  function t() {
    this._events = {};
  }
  var e = t.prototype;
  return e.on = function(r, n) {
    if (ye(r))
      for (var a in r)
        this.on(a, r[a]);
    else
      this._addEvent(r, n, {});
    return this;
  }, e.off = function(r, n) {
    if (!r)
      this._events = {};
    else if (ye(r))
      for (var a in r)
        this.off(a);
    else if (!n)
      this._events[r] = [];
    else {
      var i = this._events[r];
      if (i) {
        var o = Je(i, function(s) {
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
    }, n.currentTarget = this, up(i).forEach(function(s) {
      s.listener(n), s.once && a.off(r, s.listener);
    }), !o;
  }, e.trigger = function(r, n) {
    return n === void 0 && (n = {}), this.emit(r, n);
  }, e._addEvent = function(r, n, a) {
    var i = this._events;
    i[r] = i[r] || [];
    var o = i[r];
    o.push(Bi({
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
var Gi = function(t, e) {
  return Gi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Gi(t, e);
};
function cp(t, e) {
  Gi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var zr = function() {
  return zr = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, zr.apply(this, arguments);
};
function fp(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function $s(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function ta(t) {
  if (t) {
    if (Me(t))
      return document.querySelector(t);
  } else return null;
  if (Ba(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var Cu = /* @__PURE__ */ (function(t) {
  cp(e, t);
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
    var i = ta(a.container);
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
      return c.top > o - l ? (f[1] > c.top || o < f[1]) && (d[1] = -1) : c.top + c.height < o + l && (f[1] < c.top + c.height || o > f[1]) && (d[1] = 1), c.left > i - l ? (f[0] > c.left || i < f[0]) && (d[0] = -1) : c.left + c.width < i + l && (f[0] < c.left + c.width || i > f[0]) && (d[0] = 1), !d[0] && !d[1] ? !1 : this._continueDrag(zr(zr({}, a), {
        direction: d,
        inputEvent: n,
        isDrag: !0
      }));
    }
  }, r.checkScroll = function(n) {
    var a = this;
    if (this._isWait)
      return !1;
    var i = n.prevScrollPos, o = i === void 0 ? this._prevScrollPos : i, s = n.direction, l = n.throttleTime, u = l === void 0 ? 0 : l, c = n.inputEvent, f = n.isDrag, d = this._getScrollPosition(s || [0, 0], n), h = d[0] - o[0], v = d[1] - o[1], m = s || [h ? Math.abs(h) / h : 0, v ? Math.abs(v) / v : 0];
    return this._prevScrollPos = d, this._lock = !1, !h && !v ? !1 : (this.emit("move", {
      offsetX: m[0] ? h : 0,
      offsetY: m[1] ? v : 0,
      inputEvent: c
    }), u && f && (clearTimeout(this._timer), this._timer = window.setTimeout(function() {
      a._continueDrag(n);
    }, u)), !0);
  }, r.dragEnd = function() {
    this._flag = !1, this._lock = !1, clearTimeout(this._timer), this._unregisterScrollEvent();
  }, r._getScrollPosition = function(n, a) {
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? fp : o;
    return s({
      container: ta(i),
      direction: n
    });
  }, r._continueDrag = function(n) {
    var a = this, i, o = n.container, s = n.direction, l = n.throttleTime, u = n.useScroll, c = n.isDrag, f = n.inputEvent;
    if (!(!this._flag || c && this._isWait)) {
      var d = wn(), h = Math.max(l + this._prevTime - d, 0);
      if (h > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(n);
        }, h), !1;
      this._prevTime = d;
      var v = this._getScrollPosition(s, n);
      this._prevScrollPos = v, c && (this._isWait = !0), u || (this._lock = !0);
      var m = {
        container: ta(o),
        direction: s,
        inputEvent: f
      };
      return (i = n.requestScroll) === null || i === void 0 || i.call(n, m), this.emit("scroll", m), this._isWait = !1, u || this.checkScroll(zr(zr({}, n), {
        prevScrollPos: v,
        direction: s,
        inputEvent: f
      }));
    }
  }, r._registerScrollEvent = function(n) {
    this._unregisterScrollEvent();
    var a = n.checkScrollEvent;
    if (a) {
      var i = a === !0 ? $s : a, o = ta(n.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = $s(window, this._onScroll) : this._unregister = i(o, this._onScroll);
    }
  }, r._unregisterScrollEvent = function() {
    var n;
    (n = this._unregister) === null || n === void 0 || n.call(this), this._unregister = null;
  }, e;
})(Tn);
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
function dp() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function ge(t) {
  return Ct(t, Qt);
}
function pp(t, e) {
  return t.every(function(r, n) {
    return ge(r - e[n]) === 0;
  });
}
function hp(t, e) {
  return !ge(t[0] - e[0]) && !ge(t[1] - e[1]);
}
function hn(t) {
  return t.length < 3 ? 0 : Math.abs(Ld(t.map(function(e, r) {
    var n = t[r + 1] || t[0];
    return e[0] * n[1] - n[0] * e[1];
  }))) / 2;
}
function Fi(t, e) {
  var r = e.width, n = e.height, a = e.left, i = e.top, o = Cr(t), s = o.minX, l = o.minY, u = o.maxX, c = o.maxY, f = r / (u - s), d = n / (c - l);
  return t.map(function(h) {
    return [a + (h[0] - s) * f, i + (h[1] - l) * d];
  });
}
function Cr(t) {
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
function Da(t, e, r) {
  var n = t[0], a = t[1], i = Cr(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], u = ka(l[0], l[1]), c = Li(e), f = [];
  if (c.forEach(function(v) {
    var m = ka(v[0], v[1]), x = v[0];
    if (pp(u, m))
      f.push({
        pos: t,
        line: v,
        type: "line"
      });
    else {
      var y = wu(Eo(u, m), [l, v]);
      y.forEach(function(C) {
        v.some(function(w) {
          return hp(w, C);
        }) ? f.push({
          pos: C,
          line: v,
          type: "point"
        }) : ge(x[1] - a) !== 0 && f.push({
          pos: C,
          line: v,
          type: "intersection"
        });
      });
    }
  }), be(f, function(v) {
    return v[0] === n;
  }))
    return !0;
  var d = 0, h = {};
  return f.forEach(function(v) {
    var m = v.pos, x = v.type, y = v.line;
    if (!(m[0] > n))
      if (x === "intersection")
        ++d;
      else {
        if (x === "line")
          return;
        if (x === "point") {
          var C = be(y, function(M) {
            return M[1] !== a;
          }), w = h[m[0]], D = C[1] > a ? 1 : -1;
          w ? w !== D && ++d : h[m[0]] = D;
        }
      }
  }), d % 2 === 1;
}
function ka(t, e) {
  var r = t[0], n = t[1], a = e[0], i = e[1], o = a - r, s = i - n;
  Math.abs(o) < Qt && (o = 0), Math.abs(s) < Qt && (s = 0);
  var l = 0, u = 0, c = 0;
  return o ? s ? (l = -s / o, u = 1, c = -l * r - n) : (u = 1, c = -n) : s && (l = -1, c = r), [l, u, c];
}
function Eo(t, e) {
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
function wu(t, e) {
  var r = e.map(function(f) {
    return [0, 1].map(function(d) {
      return [Math.min(f[0][d], f[1][d]), Math.max(f[0][d], f[1][d])];
    });
  }), n = [];
  if (t.length === 2) {
    var a = t[0], i = a[0], o = a[1];
    if (ge(i - t[1][0])) {
      if (!ge(o - t[1][1])) {
        var u = Math.max.apply(Math, r.map(function(f) {
          return f[0][0];
        })), c = Math.min.apply(Math, r.map(function(f) {
          return f[0][1];
        }));
        if (ge(u - c) > 0)
          return [];
        n = [[u, o], [c, o]];
      }
    } else {
      var s = Math.max.apply(Math, r.map(function(f) {
        return f[1][0];
      })), l = Math.min.apply(Math, r.map(function(f) {
        return f[1][1];
      }));
      if (ge(s - l) > 0)
        return [];
      n = [[i, s], [i, l]];
    }
  }
  return n.length || (n = t.filter(function(f) {
    var d = f[0], h = f[1];
    return r.every(function(v) {
      return 0 <= ge(d - v[0][0]) && 0 <= ge(v[0][1] - d) && 0 <= ge(h - v[1][0]) && 0 <= ge(v[1][1] - h);
    });
  })), n.map(function(f) {
    return [ge(f[0]), ge(f[1])];
  });
}
function Li(t) {
  return dp(t.slice(1), [t[0]]).map(function(e, r) {
    return [t[r], e];
  });
}
function vp(t, e) {
  var r = t.slice(), n = e.slice();
  Xs(r) === -1 && r.reverse(), Xs(n) === -1 && n.reverse();
  var a = Li(r), i = Li(n), o = a.map(function(c) {
    return ka(c[0], c[1]);
  }), s = i.map(function(c) {
    return ka(c[0], c[1]);
  }), l = [];
  o.forEach(function(c, f) {
    var d = a[f], h = [];
    s.forEach(function(v, m) {
      var x = Eo(c, v), y = wu(x, [d, i[m]]);
      h.push.apply(h, y.map(function(C) {
        return {
          index1: f,
          index2: m,
          pos: C,
          type: "intersection"
        };
      }));
    }), h.sort(function(v, m) {
      return Xe(d[0], v.pos) - Xe(d[0], m.pos);
    }), l.push.apply(l, h), Da(d[1], n) && l.push({
      index1: f,
      index2: -1,
      pos: d[1],
      type: "inside"
    });
  }), i.forEach(function(c, f) {
    if (Da(c[1], r)) {
      var d = !1, h = Je(l, function(v) {
        var m = v.index2;
        return m === f ? (d = !0, !1) : !!d;
      });
      h === -1 && (d = !1, h = Je(l, function(v) {
        var m = v.index1, x = v.index2;
        return m === -1 && x + 1 === f ? (d = !0, !1) : !!d;
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
function Wi(t, e) {
  var r = vp(t, e);
  return r.map(function(n) {
    var a = n.pos;
    return a;
  });
}
function gp(t, e) {
  var r = Wi(t, e);
  return hn(r);
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
var Yi = function(t, e) {
  return Yi = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Yi(t, e);
};
function mp(t, e) {
  Yi(t, e);
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
function xp(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function fi(t) {
  return xp([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function yp(t) {
  return t.touches && t.touches.length >= 2;
}
function ea(t) {
  return t ? t.touches ? Sp(t.touches) : [Eu(t)] : [];
}
function bp(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function qs(t, e, r) {
  var n = r.length, a = vn(t, n), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, u = vn(e, n), c = u.clientX, f = u.clientY, d = vn(r, n), h = d.clientX, v = d.clientY, m = i - c, x = o - f, y = i - h, C = o - v;
  return {
    clientX: s,
    clientY: l,
    deltaX: m,
    deltaY: x,
    distX: y,
    distY: C
  };
}
function di(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function Sp(t) {
  for (var e = Math.min(t.length, 2), r = [], n = 0; n < e; ++n)
    r.push(Eu(t[n]));
  return r;
}
function Eu(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY
  };
}
function vn(t, e) {
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
var pi = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), fi(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), fi(e) - fi(this.startClients);
  }, t.prototype.getPosition = function(e, r) {
    e === void 0 && (e = this.prevClients);
    var n = qs(e || this.prevClients, this.prevClients, this.startClients), a = n.deltaX, i = n.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, n;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var r = this.prevClients, n = this.startClients, a = Math.min(this.length, r.length), i = [], o = 0; o < a; ++o)
      i[o] = qs([e[o]], [r[o]], [n[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var r = this.movement;
    if (!e)
      return r;
    var n = vn(e, this.length), a = vn(this.prevClients, this.length), i = n.clientX - a.clientX, o = n.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + r;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), di(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), di(e) / di(this.startClients);
  }, t.prototype.move = function(e, r) {
    this.startClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    }), this.prevClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    });
  }, t;
})(), Vs = ["textarea", "input"], Du = /* @__PURE__ */ (function(t) {
  mp(e, t);
  function e(r, n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(d, h) {
      if (h === void 0 && (h = !0), !(!a.flag && d.cancelable === !1)) {
        var v = d.type.indexOf("drag") >= -1;
        if (!(a.flag && v)) {
          a._isDragAPI = !0;
          var m = a.options, x = m.container, y = m.pinchOutside, C = m.preventWheelClick, w = m.preventRightClick, D = m.preventDefault, M = m.checkInput, E = m.dragFocusedInput, k = m.preventClickEventOnDragStart, T = m.preventClickEventOnDrag, g = m.preventClickEventByCondition, _ = a._useTouch, j = !a.flag;
          if (a._isSecondaryButton = d.which === 3 || d.button === 2, C && (d.which === 2 || d.button === 1) || w && (d.which === 3 || d.button === 2))
            return a.stop(), !1;
          if (j) {
            var R = a._window.document.activeElement, P = d.target;
            if (P) {
              var z = P.tagName.toLowerCase(), B = Vs.indexOf(z) > -1, Y = P.isContentEditable;
              if (B || Y) {
                if (M || !E && R === P)
                  return !1;
                if (R && (R === P || Y && R.isContentEditable && R.contains(P)))
                  if (E)
                    P.blur();
                  else
                    return !1;
              } else if ((D || d.type === "touchstart") && R) {
                var H = R.tagName.toLowerCase();
                (R.isContentEditable || Vs.indexOf(H) > -1) && R.blur();
              }
              (k || T || g) && Jt(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new pi(ea(d))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = h, a._dragFlag = !0, a._prevInputEvent = d, a.data = {}, a.doubleFlag = wn() - a.prevTime < 200, a._isMouseEvent = bp(d), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var L = a._preventMouseEvent || a.emit("dragStart", Kt(Kt({ data: a.data, datas: a.data, inputEvent: d, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: h, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
              d.preventDefault();
            }, preventDrag: function() {
              a._dragFlag = !1;
            } }));
            L === !1 && a.stop(), a._isMouseEvent && a.flag && D && d.preventDefault();
          }
          if (!a.flag)
            return !1;
          var $ = 0;
          if (j ? (a._attchDragEvent(), _ && y && ($ = setTimeout(function() {
            Jt(x, "touchstart", a.onDragStart, {
              passive: !1
            });
          }))) : _ && y && $t(x, "touchstart", a.onDragStart), a.flag && yp(d)) {
            if (clearTimeout($), j && d.touches.length !== d.changedTouches.length)
              return;
            a.pinchFlag || a.onPinchStart(d);
          }
        }
      }
    }, a.onDrag = function(d, h) {
      if (a.flag) {
        var v = a.options.preventDefault;
        !a._isMouseEvent && v && d.preventDefault(), a._prevInputEvent = d;
        var m = ea(d), x = a.moveClients(m, d, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || x.deltaX || x.deltaY) {
            var y = a._preventMouseEvent || a.emit("drag", Kt(Kt({}, x), { isScroll: !!h, inputEvent: d }));
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
        var h = a.options, v = h.pinchOutside, m = h.container, x = h.preventClickEventOnDrag, y = h.preventClickEventOnDragStart, C = h.preventClickEventByCondition, w = a.isDrag;
        (x || y || C) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !C && !y && x && !w && a._allowClickEvent(), a._useTouch && v && $t(m, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(d);
        var D = d != null && d.touches ? ea(d) : [], M = D.length;
        M === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new pi(D));
        var E = a._getPosition(), k = wn(), T = !w && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = w || T ? 0 : k, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", Kt({ data: a.data, datas: a.data, isDouble: T, isDrag: w, isClick: !w, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: d, isTrusted: a._isTrusted }, E)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
          a._preventMouseEvent = !1;
        }, 200)), a._isIdle = !0);
      }
    }, a.onBlur = function() {
      a.onDragEnd();
    }, a._allowClickEvent = function() {
      $t(a._window, "click", a._onClick, !0);
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
    a._window = gu(o) ? o : De(o), a.options = Kt({ checkInput: !1, container: o && !("document" in o) ? De(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, n);
    var s = a.options, l = s.container, u = s.events, c = s.checkWindowBlur;
    if (a._useDrag = u.indexOf("drag") > -1, a._useTouch = u.indexOf("touch") > -1, a._useMouse = u.indexOf("mouse") > -1, a.targets = i, a._useDrag && i.forEach(function(d) {
      Jt(d, "dragstart", a.onDragStart);
    }), a._useMouse && (i.forEach(function(d) {
      Jt(d, "mousedown", a.onDragStart), Jt(d, "mousemove", a._passCallback);
    }), Jt(l, "contextmenu", a._onContextMenu)), c && Jt(De(), "blur", a.onBlur), a._useTouch) {
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
    this.off(), $t(this._window, "blur", this.onBlur), this._useDrag && n.forEach(function(i) {
      $t(i, "dragstart", r.onDragStart);
    }), this._useMouse && (n.forEach(function(i) {
      $t(i, "mousedown", r.onDragStart);
    }), $t(a, "contextmenu", this._onContextMenu)), this._useTouch && (n.forEach(function(i) {
      $t(i, "touchstart", r.onDragStart);
    }), $t(a, "touchstart", this.onDragStart)), this._prevInputEvent = null, this._allowClickEvent(), this._dettachDragEvent();
  }, e.prototype.onPinchStart = function(r) {
    var n = this, a = this.options.pinchThreshold;
    if (!(this.isDrag && this.getMovement() > a)) {
      var i = new pi(ea(r));
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
    this._isDragAPI && ($t(n, "dragover", this.onDrag), $t(r, "dragend", this.onDragEnd)), this._useMouse && ($t(n, "mousemove", this.onDrag), $t(r, "mouseup", this.onDragEnd)), this._useTouch && ($t(n, "touchstart", this.onDragStart), $t(n, "touchmove", this.onDrag), $t(r, "touchend", this.onDragEnd), $t(r, "touchcancel", this.onDragEnd));
  }, e.prototype._allowMouseEvent = function() {
    this._preventMouseEvent = !1, clearTimeout(this._preventMouseEventId);
  }, e;
})(Tn);
function Cp(t) {
  for (var e = 5381, r = t.length; r; )
    e = e * 33 ^ t.charCodeAt(--r);
  return e >>> 0;
}
var wp = Cp;
function Ep(t) {
  return wp(t).toString(36);
}
function Dp(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function kp(t, e, r) {
  return r.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(n, a) {
    var i = a.trim();
    return (i ? mr(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function Mp(t, e, r, n, a) {
  var i = Oe(n), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), r.nonce && o.setAttribute("nonce", r.nonce), o.innerHTML = kp(t, e, r), (a || i.head || i.body).appendChild(o), o;
}
function ku(t) {
  var e = "rCS" + Ep(t);
  return {
    className: e,
    inject: function(r, n) {
      n === void 0 && (n = {});
      var a = Dp(r), i = (a || r.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = Mp(e, t, n, r, a);
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
var Xi = function() {
  return Xi = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Xi.apply(this, arguments);
};
function _p(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Mu(t, e) {
  var r = ku(e), n = r.className;
  return tt.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = _p(a, ["className", "cspNonce"]), u = tt.useRef();
    return tt.useImperativeHandle(i, function() {
      return u.current;
    }, []), tt.useEffect(function() {
      var c = r.inject(u.current, {
        nonce: a.cspNonce
      });
      return function() {
        c.destroy();
      };
    }, []), tt.createElement(t, Xi({
      ref: u,
      "data-styled-id": n,
      className: "".concat(s, " ").concat(n)
    }, l));
  });
}
var Hi = function(t, e) {
  return Hi = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Hi(t, e);
};
function In(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Hi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var O = function() {
  return O = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, O.apply(this, arguments);
};
function Tp(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
      e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Ip(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function Rp(t) {
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
function et(t, e, r) {
  if (arguments.length === 2) for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function Rn(t, e) {
  return O({ events: [], props: [], name: t }, e);
}
var Pp = ["n", "w", "s", "e"], Do = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function Op(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function Np(t) {
  var e = Op(1, t), r = Math.round(t / 45) * 45 % 180, n = "ns-resize";
  return r === 135 ? n = "nwse-resize" : r === 45 ? n = "nesw-resize" : r === 90 && (n = "ew-resize"), "cursor:".concat(n, ";cursor: url('").concat(e, "') 16 16, ").concat(n, ";");
}
var Zr = kd(), _u = Zr.browser.webkit, Tu = _u && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), Iu = Zr.browser.name, Ru = parseInt(Zr.browser.version, 10), jp = Iu === "chrome", zp = Zr.browser.chromium, Ap = parseInt(Zr.browser.chromiumVersion, 10) || 0, Bp = jp && Ru >= 109 || zp && Ap >= 109, Gp = Iu === "firefox", Fp = parseInt(Zr.browser.webkitVersion, 10) >= 612 || Ru >= 15, ko = "moveable-", Lp = Do.map(function(t) {
  var e = "", r = "", n = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (r = "left: ".concat(i, ";"), n = "right"), t.indexOf("e") > -1 && (r = "left: 0px;", n = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(r).concat(e, `
        transform-origin: `).concat(n, " ").concat(a, `;
    }`);
}).join(`
`), Wp = `
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
`.concat(Lp, `
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
`).concat(Np(t), `
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

`).concat(Tu ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), Yp = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], $i = 1e-4, pe = 1e-7, ra = 1e-9, qi = Math.pow(10, 10), Us = -qi, Xp = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, Mo = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, Pu = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, Hp = [
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
function Pn(t, e, r, n, a, i) {
  var o, s;
  i === void 0 && (i = "draggable");
  var l = (s = (o = e.gestos[i]) === null || o === void 0 ? void 0 : o.move(r, t.inputEvent)) !== null && s !== void 0 ? s : {}, u = l.originalDatas || l.datas, c = u[i] || (u[i] = {});
  return O(O({}, l), { isPinch: !!n, parentEvent: !0, datas: c, originalDatas: t.originalDatas });
}
var Xr = /* @__PURE__ */ (function() {
  function t(e) {
    var r;
    e === void 0 && (e = "draggable"), this.ableName = e, this.prevX = 0, this.prevY = 0, this.startX = 0, this.startY = 0, this.isDrag = !1, this.isFlag = !1, this.datas = {
      draggable: {}
    }, this.datas = (r = {}, r[e] = {}, r);
  }
  return t.prototype.dragStart = function(e, r) {
    this.isDrag = !1, this.isFlag = !1;
    var n = r.originalDatas;
    return this.datas = n, n[this.ableName] || (n[this.ableName] = {}), O(O({}, this.move(e, r.inputEvent)), { type: "dragstart" });
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
function Lr(t, e, r, n) {
  var a = t.length === 16, i = a ? 4 : 3, o = Dr(t, r, n, i), s = N(o, 4), l = N(s[0], 2), u = l[0], c = l[1], f = N(s[1], 2), d = f[0], h = f[1], v = N(s[2], 2), m = v[0], x = v[1], y = N(s[3], 2), C = y[0], w = y[1], D = N(Wt(t, e, i), 2), M = D[0], E = D[1], k = Math.min(u, d, m, C), T = Math.min(c, h, x, w), g = Math.max(u, d, m, C), _ = Math.max(c, h, x, w);
  u = u - k || 0, d = d - k || 0, m = m - k || 0, C = C - k || 0, c = c - T || 0, h = h - T || 0, x = x - T || 0, w = w - T || 0, M = M - k || 0, E = E - T || 0;
  var j = t[0], R = t[i + 1], P = fe(j * R);
  return {
    left: k,
    top: T,
    right: g,
    bottom: _,
    origin: [M, E],
    pos1: [u, c],
    pos2: [d, h],
    pos3: [m, x],
    pos4: [C, w],
    direction: P
  };
}
function Ou(t, e) {
  var r = e.clientX, n = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, u = i.pos1, c = o.left, f = o.top, d = l ? 4 : 3, h = N(gt(qr(s, [r - c, n - f], d), u), 2), v = h[0], m = h[1], x = N($e({ datas: a, distX: v, distY: m }), 2), y = x[0], C = x[1];
  return [y, C];
}
function Er(t, e) {
  var r = e.datas, n = t.state, a = n.allMatrix, i = n.beforeMatrix, o = n.is3d, s = n.left, l = n.top, u = n.origin, c = n.offsetMatrix, f = n.targetMatrix, d = n.transformOrigin, h = o ? 4 : 3;
  r.is3d = o, r.matrix = a, r.targetMatrix = f, r.beforeMatrix = i, r.offsetMatrix = c, r.transformOrigin = d, r.inverseMatrix = je(a, h), r.inverseBeforeMatrix = je(i, h), r.absoluteOrigin = br(Pt([s, l], u), h), r.startDragBeforeDist = le(r.inverseBeforeMatrix, r.absoluteOrigin, h), r.startDragDist = le(r.inverseMatrix, r.absoluteOrigin, h);
}
function $p(t) {
  return Lr(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function Ga(t, e, r) {
  var n = e.datas, a = e.originalDatas.beforeRenderable, i = n.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, u = -1;
  i === -1 ? (r === "translate" ? u = 0 : r === "rotate" && (u = Je(o, function(h) {
    return h.match(/scale\(/g);
  })), u === -1 && (u = o.length), n.transformIndex = u) : be(l, function(h) {
    return h.index === i && h.functionName === r;
  }) ? u = i : u = i + l.filter(function(h) {
    return h.index < i;
  }).length;
  var c = xv(o, t.state, u), f = c.targetFunction, d = r === "rotate" ? "rotateZ" : r;
  n.beforeFunctionTexts = c.beforeFunctionTexts, n.afterFunctionTexts = c.afterFunctionTexts, n.beforeTransform = c.beforeFunctionMatrix, n.beforeTransform2 = c.beforeFunctionMatrix2, n.targetTansform = c.targetFunctionMatrix, n.afterTransform = c.afterFunctionMatrix, n.afterTransform2 = c.afterFunctionMatrix2, n.targetAllTransform = c.allFunctionMatrix, f.functionName === d ? (n.afterFunctionTexts.splice(0, 1), n.isAppendTransform = !1) : s > u && (n.isAppendTransform = !0, a.nextTransformAppendedIndexes = et(et([], N(l), !1), [{
    functionName: r,
    index: u,
    isAppend: !0
  }], !1));
}
function Fa(t, e, r) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? r : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function qp(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = N(ju({ datas: e, distX: r, distY: n }), 2), i = a[0], o = a[1], s = Nu(e, Ud([i, o], 4));
  return le(s, br([0, 0, 0], 4), 4);
}
function Nu(t, e, r) {
  var n = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = r ? zt(s, e, 4) : zt(e, s, 4), u = zt(je(r ? i : n, 4), l, 4), c = zt(u, je(r ? o : a, 4), 4);
  return c;
}
function ju(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return gt(le(a, Pt(s, [r, n]), l), o);
}
function $e(t, e) {
  var r = t.datas, n = t.distX, a = t.distY, i = r.inverseBeforeMatrix, o = r.inverseMatrix, s = r.is3d, l = r.startDragBeforeDist, u = r.startDragDist, c = r.absoluteOrigin, f = s ? 4 : 3;
  return gt(le(e ? i : o, Pt(c, [n, a]), f), e ? l : u);
}
function Vp(t, e) {
  var r = t.datas, n = t.distX, a = t.distY;
  r.beforeMatrix;
  var i = r.matrix, o = r.is3d;
  r.startDragBeforeDist;
  var s = r.startDragDist, l = r.absoluteOrigin, u = o ? 4 : 3;
  return gt(le(i, Pt(s, [n, a]), u), l);
}
function Up(t, e, r, n, a, i) {
  return n === void 0 && (n = e), a === void 0 && (a = r), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = yr(o), u = l.value, c = l.unit, f = s ? a : n, d = s ? r : e;
    if (o === "%" || isNaN(u)) {
      var h = f ? i[s] / f : 0;
      return d * h;
    } else if (c !== "%")
      return u;
    return d * u / 100;
  }) : i;
}
function zu(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function Kp(t, e) {
  return zu(e).map(function(r) {
    return t[r];
  });
}
function hi(t, e) {
  var r = (e + 1) / 2;
  return [
    Ca(t[0][0], t[1][0], r, 1 - r),
    Ca(t[0][1], t[1][1], r, 1 - r)
  ];
}
function ee(t, e) {
  var r = hi([t[0], t[1]], e[0]), n = hi([t[2], t[3]], e[0]);
  return hi([r, n], e[1]);
}
function Zp(t, e, r, n, a, i) {
  var o = Dr(e, r, n, a), s = ee(o, i), l = t[0] - s[0], u = t[1] - s[1];
  return [l, u];
}
function On(t, e, r, n) {
  return zt(t, mn(e, n, r), n);
}
function Jp(t, e, r, n) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (Me(r)) {
    var u = e.beforeTransform, c = e.afterTransform;
    n ? l = ze(Wr(r), 4, s) : l = ze(zt(zt(u, Wr([r]), 4), c, 4), 4, s);
  } else
    l = r;
  return On(i, l, a, s);
}
function Qp(t, e) {
  var r = t.transformOrigin, n = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return On(n, zt(o || i, bo(e, s), s), r, s);
}
function La(t, e) {
  var r = Jr(e);
  return {
    setTransform: function(n, a) {
      a === void 0 && (a = -1), r.startTransforms = qt(n) ? n : or(n), Vi(t, e, a);
    },
    setTransformIndex: function(n) {
      Vi(t, e, n);
    }
  };
}
function Wa(t, e, r) {
  var n = Jr(e), a = n.startTransforms;
  Vi(t, e, Je(a, function(i) {
    return i.indexOf("".concat(r, "(")) === 0;
  }));
}
function Vi(t, e, r) {
  var n = Jr(e), a = e.datas;
  if (a.transformIndex = r, r !== -1) {
    var i = n.startTransforms[r];
    if (i) {
      var o = t.state, s = Yr([i], {
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
function _o(t, e) {
  var r = Jr(t);
  r.nextTransforms = or(e);
}
function Jr(t) {
  return t.originalDatas.beforeRenderable;
}
function Ma(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function na(t) {
  return (Ma(t) || []).join(" ");
}
function aa(t) {
  return Jr(t).nextStyle;
}
function Au(t, e, r, n, a) {
  _o(a, e);
  var i = ce.drag(t, Pn(a, t.state, r, n)), o = i ? i.transform : e;
  return O(O({ transform: e, drag: i }, de({
    transform: o
  }, a)), { afterTransform: o });
}
function To(t, e, r, n, a, i) {
  var o = Jp(t.state, a, e, i), s = rh(t, r, n, o);
  return s;
}
function Bu(t, e, r, n, a, i, o) {
  var s = To(t, e, r, a, i, o), l = t.state, u = l.left, c = l.top, f = t.props.groupable, d = f ? u : 0, h = f ? c : 0, v = gt(n, s);
  return gt(v, [d, h]);
}
function th(t, e, r, n, a, i, o) {
  var s = Bu(t, e, r, n, a, i, o);
  return s;
}
function eh(t, e, r) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    r ? -1 + t[1] / (r / 2) : 0
  ];
}
function rh(t, e, r, n) {
  n === void 0 && (n = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, u = [
    i / 2 * (1 + e[0]) + r[0],
    o / 2 * (1 + e[1]) + r[1]
  ];
  return Wt(n, u, l);
}
function nh(t, e, r) {
  var n = r.fixedDirection, a = r.fixedPosition, i = r.fixedOffset;
  return Bu(t, "rotate(".concat(e, "deg)"), n, a, i, r);
}
function ah(t, e, r, n, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, u = s.offsetMatrix, c = s.is3d, f = s.width, d = s.height, h = s.left, v = s.top, m = i.fixedDirection, x = i.nextTargetMatrix || s.targetMatrix, y = c ? 4 : 3, C = Up(a, e, r, f, d, l), w = o ? h : 0, D = o ? v : 0, M = On(u, x, C, y), E = Zp(n, M, e, r, y, m);
  return gt(E, [w, D]);
}
function ih(t, e) {
  return ee(Te(t.state), e);
}
function oh(t, e) {
  var r = t.targetGesto, n = t.controlGesto, a;
  return r != null && r.isFlag() && (a = r.getEventData()[e]), !a && (n != null && n.isFlag()) && (a = n.getEventData()[e]), a || {};
}
function sh(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function lh(t) {
  var e = t("scale"), r = t("rotate"), n = t("translate"), a = [];
  return n && n !== "0px" && n !== "none" && a.push("translate(".concat(n.split(/\s+/).join(","), ")")), r && r !== "1" && r !== "none" && a.push("rotate(".concat(r, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function Gu(t, e, r) {
  for (var n = t, a = [], i = yo(t) || ur(t), o = !r && t === e || t === i, s = o, l = !1, u = 3, c, f, d, h = !1, v = kn(e, e, !0).offsetParent, m = 1; n && !s; ) {
    s = o;
    var x = me(n), y = x("position"), C = uc(n), w = y === "fixed", D = lh(x), M = Kd(iv(C)), E = void 0, k = !1, T = !1, g = 0, _ = 0, j = 0, R = 0, P = {
      hasTransform: !1,
      fixedContainer: null
    };
    w && (h = !0, P = cv(n), v = P.fixedContainer);
    var z = M.length;
    !l && (z === 16 || D.length) && (l = !0, u = 4, to(a), d && (d = ze(d, 3, 4))), l && z === 9 && (M = ze(M, 3, 4));
    var B = uv(n, t), Y = B.tagName, H = B.hasOffset, L = B.isSVG, $ = B.origin, Z = B.targetOrigin, F = B.offset, rt = N(F, 2), at = rt[0], Q = rt[1];
    Y === "svg" && !n.ownerSVGElement && d && (a.push({
      type: "target",
      target: n,
      matrix: fv(n, u)
    }), a.push({
      type: "offset",
      target: n,
      matrix: Gt(u)
    }));
    var nt = parseFloat(x("zoom")) || 1;
    if (w)
      E = P.fixedContainer, k = !0;
    else {
      var J = kn(n, e, !1, !0, x), st = J.offsetZoom;
      if (E = J.offsetParent, k = J.isEnd, T = J.isStatic, m *= st, (J.isCustomElement || st !== 1) && T)
        at -= E.offsetLeft, Q -= E.offsetTop;
      else if (Gp || Bp) {
        var dt = J.parentSlotElement;
        if (dt) {
          for (var yt = E, ft = 0, K = 0; yt && sh(yt); )
            ft += yt.offsetLeft, K += yt.offsetTop, yt = yt.offsetParent;
          at -= ft, Q -= K;
        }
      }
    }
    if (_u && !Fp && H && !L && T && (y === "relative" || y === "static") && (at -= E.offsetLeft, Q -= E.offsetTop, o = o || k), w)
      H && P.hasTransform && (j = E.clientLeft, R = E.clientTop);
    else if (H && v !== E && (g = E.clientLeft, _ = E.clientTop), H && E === i) {
      var ct = cc(n, !1);
      at += ct[0], Q += ct[1];
    }
    if (a.push({
      type: "target",
      target: n,
      matrix: mn(M, u, $)
    }), D.length && (a.push({
      type: "offset",
      target: n,
      matrix: Gt(u)
    }), a.push({
      type: "target",
      target: n,
      matrix: mn(Wr(D), u, $)
    })), H) {
      var wt = n === t, xt = wt ? 0 : n.scrollLeft, pt = wt ? 0 : n.scrollTop;
      a.push({
        type: "offset",
        target: n,
        matrix: Sr([
          at - xt + g - j,
          Q - pt + _ - R
        ], u)
      });
    } else
      a.push({
        type: "offset",
        target: n,
        origin: $
      });
    if (nt !== 1 && a.push({
      type: "zoom",
      target: n,
      matrix: mn(bo([nt, nt], u), u, [0, 0])
    }), d || (d = M), c || (c = $), f || (f = Z), s || w)
      break;
    n = E, o = k, (!r || n === i) && (s = o);
  }
  return d || (d = Gt(u)), c || (c = [0, 0]), f || (f = [0, 0]), {
    zoom: m,
    offsetContainer: v,
    matrixes: a,
    targetMatrix: d,
    transformOrigin: c,
    targetOrigin: f,
    is3d: l,
    hasFixed: h
  };
}
var pr = null, hr = null, Ar = null;
function Hr(t) {
  t ? (window.Map && (pr = /* @__PURE__ */ new Map(), hr = /* @__PURE__ */ new Map()), Ar = []) : (pr = null, Ar = null, hr = null);
}
function uh(t) {
  var e = hr == null ? void 0 : hr.get(t);
  if (e)
    return e;
  var r = xn(t, !0);
  return hr && hr.set(t, r), r;
}
function ch(t, e) {
  if (Ar) {
    var r = be(Ar, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (r)
      return r[1];
  }
  var n = Gu(t, e, !0);
  return Ar && Ar.push([[t, e], n]), n;
}
function me(t) {
  var e = pr == null ? void 0 : pr.get(t);
  if (!e) {
    var r = De(t).getComputedStyle(t);
    if (!pr)
      return function(i) {
        return r[i];
      };
    e = {
      style: r,
      cached: {}
    }, pr.set(t, e);
  }
  var n = e.cached, a = e.style;
  return function(i) {
    return i in n || (n[i] = a[i]), n[i];
  };
}
function Ne(t, e, r) {
  var n = r.originalDatas;
  n.groupable = n.groupable || {};
  var a = n.groupable;
  a.childDatas = a.childDatas || [];
  var i = a.childDatas;
  return t.moveables.map(function(o, s) {
    return i[s] = i[s] || {}, i[s][e] = i[s][e] || {}, O(O({}, r), { isRequestChild: !0, datas: i[s][e], originalDatas: i[s] });
  });
}
function vi(t, e, r, n, a, i, o) {
  var s = !!r.match(/Start$/g), l = !!r.match(/End$/g), u = a.isPinch, c = a.datas, f = Ne(t, e.name, a), d = t.moveables, h = [], v = f.map(function(m, x) {
    var y = d[x], C = y.state, w = C.gestos, D = m;
    if (s)
      D = new Xr(o).dragStart(n, m), h.push(D);
    else {
      if (w[o] || (w[o] = c.childGestos[x]), !w[o])
        return;
      D = Pn(m, C, n, u, i, o), h.push(D);
    }
    var M = e[r](y, O(O({}, D), { parentFlag: !0 }));
    return l && (w[o] = null), M;
  });
  return s && (c.childGestos = d.map(function(m) {
    return m.state.gestos[o];
  })), {
    eventParams: v,
    childEvents: h
  };
}
function Ze(t, e, r, n, a, i) {
  a === void 0 && (a = function(c, f) {
    return f;
  });
  var o = !!r.match(/End$/g), s = Ne(t, e.name, n), l = t.moveables, u = s.map(function(c, f) {
    var d = l[f], h = c;
    h = a(d, c);
    var v = e[r](d, O(O({}, h), { parentFlag: !0 }));
    return o && (d.state.gestos = {}), v;
  });
  return u;
}
function _a(t, e, r, n) {
  var a = r.fixedDirection, i = r.fixedPosition, o = n.datas.startPositions || Te(e.state), s = ee(o, a), l = N(le(_n(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), u = l[0], c = l[1];
  return n.datas.originalX = u, n.datas.originalY = c, n;
}
function Fu(t, e, r, n) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = wr(t.props, e).zoom, u = gn(o / Math.PI * 180), c = {}, f = t.renderState;
  f.renderDirectionMap || (f.renderDirectionMap = {});
  var d = f.renderDirectionMap;
  r.forEach(function(v) {
    var m = v.dir;
    c[m] = !0;
  });
  var h = fe(s);
  return r.map(function(v) {
    var m = v.data, x = v.classNames, y = v.dir, C = Mo[y];
    if (!C || !c[y])
      return null;
    d[y] = !0;
    var w = (Ct(u, 15) + h * Pu[y] + 720) % 180, D = {};
    return Kr(m).forEach(function(M) {
      D["data-".concat(M)] = m[M];
    }), n.createElement("div", O({ className: vt.apply(void 0, et(["control", "direction", y, e], N(x), !1)), "data-rotation": w, "data-direction": y }, D, { key: "direction-".concat(y), style: Pa.apply(void 0, et([o, l], N(C.map(function(M) {
      return i[M];
    })), !1)) }));
  });
}
function Lu(t, e, r, n) {
  var a = wr(t.props, r), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? Do : o;
  return et(et([], N(s ? Hu(t, n, r, l) : []), !1), N(Fu(t, r, l.map(function(u) {
    return {
      data: {},
      classNames: [],
      dir: u
    };
  }), n)), !1);
}
function Dn(t, e, r, n, a, i) {
  for (var o = [], s = 6; s < arguments.length; s++)
    o[s - 6] = arguments[s];
  var l = Vt(r, n), u = e ? Ct(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: vt.apply(void 0, et(["line", "direction", e ? "edge" : "", e], N(o), !1)), "data-rotation": u, "data-line-key": i, "data-direction": e, style: dn(r, n, a, l) });
}
function Wu(t, e, r, n, a) {
  var i = r === !0 ? Pp : r;
  return i.map(function(o, s) {
    var l = N(Mo[o], 2), u = l[0], c = l[1];
    if (c != null)
      return Dn(t, o, n[u], n[c], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function Yu(t) {
  return function(e, r) {
    var n = wr(e.props, t).edge;
    return n && (n === !0 || n.length) ? et(et([], N(Wu(r, t, n, e.getState().renderPoses, e.props.zoom)), !1), N(fh(e, t, r)), !1) : Xu(e, t, r);
  };
}
function Xu(t, e, r) {
  return Lu(t, Do, e, r);
}
function fh(t, e, r) {
  return Lu(t, ["nw", "ne", "sw", "se"], e, r);
}
function Hu(t, e, r, n) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, u = a.renderDirectionMap, c = t.props.zoom, f = fe(l), d = s / Math.PI * 180;
  return (n || Kr(u)).map(function(h) {
    var v = Mo[h];
    if (!v)
      return null;
    var m = (Ct(d, 15) + f * Pu[h] + 720) % 180, x = ["around-control"];
    return r && x.push("direction", r), e.createElement("div", { className: vt.apply(void 0, et([], N(x), !1)), "data-rotation": m, "data-direction": h, key: "direction-around-".concat(h), style: Pa.apply(void 0, et([s, c], N(v.map(function(y) {
      return o[y];
    })), !1)) });
  });
}
function Io(t, e, r) {
  var n = t || {}, a = n.position, i = a === void 0 ? "client" : a, o = n.left, s = o === void 0 ? -1 / 0 : o, l = n.top, u = l === void 0 ? -1 / 0 : l, c = n.right, f = c === void 0 ? 1 / 0 : c, d = n.bottom, h = d === void 0 ? 1 / 0 : d, v = {
    position: i,
    left: s,
    top: u,
    right: f,
    bottom: h
  };
  return {
    vertical: Ks(v, e, !0),
    horizontal: Ks(v, r, !1)
  };
}
function Ya(t, e) {
  var r = t.state, n = r.containerClientRect, a = n.clientHeight, i = n.clientWidth, o = n.clientLeft, s = n.clientTop, l = r.snapOffset, u = l.left, c = l.top, f = l.right, d = l.bottom, h = e || t.props.bounds || {}, v = h.position || "client", m = v === "css", x = h.left, y = x === void 0 ? -1 / 0 : x, C = h.top, w = C === void 0 ? -1 / 0 : C, D = h.right, M = D === void 0 ? m ? -1 / 0 : 1 / 0 : D, E = h.bottom, k = E === void 0 ? m ? -1 / 0 : 1 / 0 : E;
  return m && (M = i + f - u - M, k = a + d - c - k), {
    left: y + u - o,
    right: M + u - o,
    top: w + c - s,
    bottom: k + c - s
  };
}
function dh(t, e, r) {
  var n = Ya(t), a = n.left, i = n.top, o = n.right, s = n.bottom, l = N(r, 2), u = l[0], c = l[1], f = N(gt(r, e), 2), d = f[0], h = f[1];
  q(d) < pe && (d = 0), q(h) < pe && (h = 0);
  var v = h > 0, m = d > 0, x = {
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
    m ? o < u && (x.pos = o, x.offset = u - o) : a > u && (x.pos = a, x.offset = u - a);
  else {
    var C = h / d, w = r[1] - C * u, D = 0, M = 0, E = !1;
    m && o <= u ? (D = C * o + w, M = o, E = !0) : !m && u <= a && (D = C * a + w, M = a, E = !0), E && (D < i || D > s) && (E = !1), E || (v && s <= c ? (D = s, M = (D - w) / C, E = !0) : !v && c <= i && (D = i, M = (D - w) / C, E = !0)), E && (x.isBound = !0, x.pos = M, x.offset = u - M, y.isBound = !0, y.pos = D, y.offset = c - D);
  }
  return {
    vertical: x,
    horizontal: y
  };
}
function Ks(t, e, r) {
  var n = t[r ? "left" : "top"], a = t[r ? "right" : "bottom"], i = Math.min.apply(Math, et([], N(e), !1)), o = Math.max.apply(Math, et([], N(e), !1)), s = [];
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
    return q(u.offset) - q(l.offset);
  });
}
function Zs(t, e, r) {
  var n = r ? t.map(function(a) {
    return Mn(a, r);
  }) : t;
  return n.some(function(a) {
    return a[0] < e.left && q(a[0] - e.left) > 0.1 || a[0] > e.right && q(a[0] - e.right) > 0.1 || a[1] < e.top && q(a[1] - e.top) > 0.1 || a[1] > e.bottom && q(a[1] - e.bottom) > 0.1;
  });
}
function ph(t, e, r) {
  var n = _e(t), a = Math.sqrt(n * n - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return q(i - t[r ? 0 : 1]) - q(o - t[r ? 0 : 1]);
  }).map(function(i) {
    return Vt([0, 0], r ? [i, e] : [e, i]);
  });
}
function hh(t, e, r, n, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = Ya(t), s = o.left, l = o.top, u = o.right, c = o.bottom, f = s - n[0], d = u - n[0], h = l - n[1], v = c - n[1], m = {
    left: f,
    top: h,
    right: d,
    bottom: v
  };
  if (!Zs(r, m, 0))
    return [];
  var x = [];
  return [
    [f, 0],
    [d, 0],
    [h, 1],
    [v, 1]
  ].forEach(function(y) {
    var C = N(y, 2), w = C[0], D = C[1];
    r.forEach(function(M) {
      var E = Vt([0, 0], M);
      x.push.apply(x, et([], N(ph(M, w, D).map(function(k) {
        return i + k - E;
      }).filter(function(k) {
        return !Zs(e, m, k);
      }).map(function(k) {
        return Ct(k * 180 / Math.PI, pe);
      })), !1));
    });
  }), x;
}
var vh = ["left", "right", "center"], gh = ["top", "bottom", "middle"], Js = {
  left: "start",
  right: "end",
  center: "center",
  top: "start",
  bottom: "end",
  middle: "center"
}, sr = {
  start: "left",
  end: "right",
  center: "center"
}, lr = {
  start: "top",
  end: "bottom",
  center: "middle"
};
function Br() {
  return {
    left: !1,
    top: !1,
    right: !1,
    bottom: !1
  };
}
function Qr(t, e) {
  var r = t.props, n = r.snappable, a = r.bounds, i = r.innerBounds, o = r.verticalGuidelines, s = r.horizontalGuidelines, l = r.snapGridWidth, u = r.snapGridHeight, c = t.state, f = c.guidelines, d = c.enableSnap;
  return !n || !d || e && n !== !0 && n.indexOf(e) < 0 ? !1 : !!(l || u || a || i || f && f.length || o && o.length || s && s.length);
}
function Ro(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function mh(t, e) {
  var r = Ro(t), n = {};
  for (var a in r)
    a in e && r[a] && (n[a] = e[a]);
  return n;
}
function Po(t, e) {
  var r = mh(t, e), n = gh.filter(function(i) {
    return i in r;
  }), a = vh.filter(function(i) {
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
function xh(t, e, r) {
  var n = Wt(t, [e.clientLeft, e.clientTop], r);
  return [
    e.left + n[0],
    e.top + n[1]
  ];
}
function yh(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  Math.abs(a) < Qt && (a = 0), Math.abs(i) < Qt && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * r[0] - r[1]) : (s = 1, l = -r[1]) : (o = -1, l = r[0]), [o, s, l].map(function(u) {
    return Ct(u, Qt);
  });
}
var $u = "snapRotationThreshold", qu = "snapRotationDegrees", Vu = "snapHorizontalThreshold", Uu = "snapVerticalThreshold";
function Xa(t, e, r, n, a, i, o) {
  var s;
  n === void 0 && (n = []), a === void 0 && (a = []);
  var l = t.props, u = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], c = pl(o, l[Vu], 5), f = pl(i, l[Uu], 5);
  return Ku(t.state.guidelines, e, r, n, a, c, f, u);
}
function Ku(t, e, r, n, a, i, o, s) {
  return {
    vertical: tl(t, "vertical", e, o * s[0], n),
    horizontal: tl(t, "horizontal", r, i * s[1], a)
  };
}
function bh(t, e, r) {
  var n = N(r, 2), a = n[0], i = n[1], o = N(e, 2), s = o[0], l = o[1], u = N(gt(r, e), 2), c = u[0], f = u[1], d = f > 0, h = c > 0;
  c = Oa(c), f = Oa(f);
  var v = {
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
      vertical: v,
      horizontal: m
    };
  var x = Xa(t, c ? [a] : [], f ? [i] : [], [], [], void 0, void 0), y = x.vertical, C = x.horizontal;
  y.posInfos.filter(function(Y) {
    var H = Y.pos;
    return h ? H >= s : H <= s;
  }), C.posInfos.filter(function(Y) {
    var H = Y.pos;
    return d ? H >= l : H <= l;
  }), y.isSnap = y.posInfos.length > 0, C.isSnap = C.posInfos.length > 0;
  var w = Ui(y), D = w.isSnap, M = w.guideline, E = Ui(C), k = E.isSnap, T = E.guideline, g = k ? T.pos[1] : 0, _ = D ? M.pos[0] : 0;
  if (c === 0)
    k && (m.isSnap = !0, m.pos = T.pos[1], m.offset = i - m.pos);
  else if (f === 0)
    D && (v.isSnap = !0, v.pos = _, v.offset = a - _);
  else {
    var j = f / c, R = r[1] - j * a, P = 0, z = 0, B = !1;
    D ? (z = _, P = j * z + R, B = !0) : k && (P = g, z = (P - R) / j, B = !0), B && (v.isSnap = !0, v.pos = z, v.offset = a - z, m.isSnap = !0, m.pos = P, m.offset = i - P);
  }
  return {
    vertical: v,
    horizontal: m
  };
}
function nr(t) {
  var e = "";
  return t === -1 || t === "top" || t === "left" ? e = "start" : t === 0 || t === "center" || t === "middle" ? e = "center" : (t === 1 || t === "right" || t === "bottom") && (e = "end"), e;
}
function Qs(t, e, r, n) {
  var a = Po(t.props.snapDirections, e), i = Xa(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return nr(l);
  }), a.horizontalNames.map(function(l) {
    return nr(l);
  }), r, n), o = nr(a.horizontalNames[i.horizontal.index]), s = nr(a.verticalNames[i.vertical.index]);
  return {
    vertical: O(O({}, i.vertical), { direction: s }),
    horizontal: O(O({}, i.horizontal), { direction: o })
  };
}
function Ui(t) {
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
function tl(t, e, r, n, a) {
  var i, o;
  if (a === void 0 && (a = []), !t || !t.length)
    return {
      isSnap: !1,
      index: -1,
      direction: "",
      posInfos: []
    };
  var s = e === "vertical", l = s ? 0 : 1, u = r.map(function(f, d) {
    var h = a[d] || "", v = t.map(function(m) {
      var x = m.pos, y = f - x[l];
      return {
        offset: y,
        dist: q(y),
        guideline: m,
        direction: h
      };
    }).filter(function(m) {
      var x = m.guideline, y = m.dist, C = x.type;
      return !(C !== e || y > n);
    }).sort(function(m, x) {
      return m.dist - x.dist;
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
function Sh(t, e, r, n, a) {
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
    var m = v[h + 1] || v[0];
    i.push(d), i.push([
      (d[0] + m[0]) / 2,
      (d[1] + m[1]) / 2
    ]);
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], r) : (i.push.apply(i, et([], N(Kp([
    [-1, -1],
    [1, -1],
    [-1, -1],
    [1, 1]
  ], r)), !1)), i.length > 1 && i.push([
    (i[0][0] + i[1][0]) / 2,
    (i[0][1] + i[1][1]) / 2
  ]));
  var o = i.map(function(d) {
    return ee(e, d);
  }), s = o.map(function(d) {
    return d[0];
  }), l = o.map(function(d) {
    return d[1];
  }), u = Xa(t, s, l, i.map(function(d) {
    return nr(d[0]);
  }), i.map(function(d) {
    return nr(d[1]);
  }), n, a), c = nr(i.map(function(d) {
    return d[0];
  })[u.vertical.index]), f = nr(i.map(function(d) {
    return d[1];
  })[u.horizontal.index]);
  return {
    vertical: O(O({}, u.vertical), { direction: c }),
    horizontal: O(O({}, u.horizontal), { direction: f })
  };
}
function Zu(t, e) {
  var r = q(t.offset), n = q(e.offset);
  return t.isBound && e.isBound ? n - r : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? n - r : t.isSnap ? -1 : e.isSnap || r < pe ? 1 : n < pe ? -1 : r - n;
}
function Ta(t, e) {
  return t.slice().sort(function(r, n) {
    var a = r.sign[e], i = n.sign[e], o = r.offset[e], s = n.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return Zu({ isBound: r.isBound, isSnap: r.isSnap, offset: o }, { isBound: n.isBound, isSnap: n.isSnap, offset: s });
  })[0];
}
function Ch(t, e, r) {
  var n = [];
  if (r)
    q(e[0]) !== 1 || q(e[1]) !== 1 ? n.push([e, [-1, -1]], [e, [-1, 1]], [e, [1, -1]], [e, [1, 1]]) : n.push([e, [t[0], -t[1]]], [e, [-t[0], t[1]]]), n.push([e, t]);
  else if (t[0] && t[1] || !t[0] && !t[1]) {
    var a = t[0] ? t : [1, 1];
    [1, -1].forEach(function(o) {
      [1, -1].forEach(function(s) {
        var l = [o * a[0], s * a[1]];
        e[0] === l[0] && e[1] === l[1] || n.push([e, l]);
      });
    });
  } else if (t[0]) {
    var i = q(e[0]) === 1 ? [1] : [1, -1];
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
    var i = q(e[1]) === 1 ? [1] : [1, -1];
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
function Ju(t, e) {
  var r = ji([e[0][0], e[1][0]]), n = ji([e[0][1], e[1][1]]);
  return {
    vertical: r <= t[0],
    horizontal: n <= t[1]
  };
}
function Oo(t, e) {
  var r = N(e, 2), n = r[0], a = r[1], i = a[0] - n[0], o = a[1] - n[1];
  q(i) < pe && (i = 0), q(o) < pe && (o = 0);
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
function Qu(t, e, r, n) {
  return n === void 0 && (n = pe), t.every(function(a) {
    var i = Oo(a, e), o = i <= 0;
    return o === r || q(i) <= n;
  });
}
function el(t, e, r, n, a) {
  return a === void 0 && (a = 0), n && e - a <= t || !n && t <= r + a ? {
    isBound: !0,
    offset: n ? e - t : r - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function wh(t, e) {
  var r = e.line, n = e.centerSign, a = e.verticalSign, i = e.horizontalSign, o = e.lineConstants, s = t.props.innerBounds;
  if (!s)
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var l = s.left, u = s.top, c = s.width, f = s.height, d = [[l, u], [l, u + f]], h = [[l, u], [l + c, u]], v = [[l + c, u], [l + c, u + f]], m = [[l, u + f], [l + c, u + f]];
  if (Qu([
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
  var x = ar(r, o, h, a), y = ar(r, o, m, a), C = ar(r, o, d, i), w = ar(r, o, v, i), D = x.isBound && y.isBound, M = x.isBound || y.isBound, E = C.isBound && w.isBound, k = C.isBound || w.isBound, T = $r(x.offset, y.offset), g = $r(C.offset, w.offset), _ = [0, 0], j = !1, R = !1;
  return q(g) < q(T) ? (_ = [T, 0], j = M, R = D) : (_ = [0, g], j = k, R = E), {
    isAllBound: R,
    isVerticalBound: M,
    isHorizontalBound: k,
    isBound: j,
    offset: _
  };
}
function ar(t, e, r, n, a, i) {
  var o = N(e, 2), s = o[0], l = o[1], u = t[0], c = r[0], f = r[1], d = Oa(f[1] - c[1]), h = Oa(f[0] - c[0]), v = l, m = s, x = -s / l;
  if (h) {
    if (!d) {
      if (i && !v)
        return {
          isBound: !1,
          offset: 0
        };
      if (m) {
        var D = (c[1] - u[1]) / x + u[0];
        return el(D, c[0], f[0], n, a);
      } else {
        var C = c[1] - u[1], w = q(C) <= (a || 0);
        return {
          isBound: w,
          offset: w ? C : 0
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
      var y = x * (c[0] - u[0]) + u[1];
      return el(y, c[1], f[1], n, a);
    } else {
      var C = c[0] - u[0], w = q(C) <= (a || 0);
      return {
        isBound: w,
        offset: w ? C : 0
      };
    }
  }
  return {
    isBound: !1,
    offset: 0
  };
}
function tc(t, e, r) {
  return e.map(function(n) {
    var a = wh(t, n), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, u = n.multiple, c = $e({
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
function Eh(t, e, r) {
  var n, a = No(t, e, [0, 0], !1).map(function(d) {
    return O(O({}, d), { multiple: d.multiple.map(function(h) {
      return q(h) * 2;
    }) });
  }), i = tc(t, a, r), o = Ta(i, 0), s = Ta(i, 1), l = 0, u = 0, c = o.isVerticalBound || s.isVerticalBound, f = o.isHorizontalBound || s.isHorizontalBound;
  return (c || f) && (n = N(Vp({
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
function Dh(t, e) {
  var r = [], n = t[0], a = t[1];
  return n && a ? r.push([[0, a * 2], t, [-n, a]], [[n * 2, 0], t, [n, -a]]) : n ? (r.push([[n * 2, 0], [n, 1], [n, -1]]), e && r.push([[0, -1], [n, -1], [-n, -1]], [[0, 1], [n, 1], [-n, 1]])) : a ? (r.push([[0, a * 2], [1, a], [-1, a]]), e && r.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : r.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), r;
}
function No(t, e, r, n) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = Dr(i, 100, 100, o ? 4 : 3), l = ee(s, [0, 0]);
  return Dh(r, n).map(function(u) {
    var c = N(u, 3), f = c[0], d = c[1], h = c[2], v = [
      ee(s, d),
      ee(s, h)
    ], m = yh(v), x = Ju(l, v), y = x.vertical, C = x.horizontal, w = Oo(l, v) <= 0;
    return {
      multiple: f,
      centerSign: w,
      verticalSign: y,
      horizontalSign: C,
      lineConstants: m,
      line: [
        ee(e, d),
        ee(e, h)
      ]
    };
  });
}
function rl(t, e, r, n) {
  var a = n ? t.map(function(i) {
    return Mn(i, n);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = Oo(r, i) <= 0;
    return !Qu(e, i, o);
  });
}
function kh(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  if (!a)
    return q(r[0]);
  if (!i)
    return q(r[1]);
  var o = i / a;
  return q((-o * r[0] + r[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function Mh(t) {
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
function _h(t, e, r, n, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, u = i.width, c = i.height, f = s - n[0], d = s + u - n[0], h = l - n[1], v = l + c - n[1], m = [
    [f, h],
    [d, h],
    [f, v],
    [d, v]
  ], x = ee(r, [0, 0]);
  if (!rl(r, m, x, 0))
    return [];
  var y = [], C = m.map(function(w) {
    return [
      _e(w),
      Vt([0, 0], w)
    ];
  });
  return [
    [r[0], r[1]],
    [r[1], r[3]],
    [r[3], r[2]],
    [r[2], r[0]]
  ].forEach(function(w) {
    var D = Vt([0, 0], Mh(w)), M = kh(w);
    y.push.apply(y, et([], N(C.filter(function(E) {
      var k = N(E, 1), T = k[0];
      return T && M <= T;
    }).map(function(E) {
      var k = N(E, 2), T = k[0], g = k[1], _ = Math.acos(T ? M / T : 0), j = g + _, R = g - _;
      return [
        o + j - D,
        o + R - D
      ];
    }).reduce(function(E, k) {
      return E.push.apply(E, et([], N(k), !1)), E;
    }, []).filter(function(E) {
      return !rl(e, m, x, E);
    }).map(function(E) {
      return Ct(E * 180 / Math.PI, pe);
    })), !1));
  }), y;
}
function Th(t) {
  var e = t.props.innerBounds, r = Br();
  if (!e)
    return {
      boundMap: r,
      vertical: [],
      horizontal: []
    };
  var n = t.getRect(), a = n.pos1, i = n.pos2, o = n.pos3, s = n.pos4, l = [a, i, o, s], u = ee(l, [0, 0]), c = e.left, f = e.top, d = e.width, h = e.height, v = [[c, f], [c, f + h]], m = [[c, f], [c + d, f]], x = [[c + d, f], [c + d, f + h]], y = [[c, f + h], [c + d, f + h]], C = No(t, l, [0, 0], !1), w = [], D = [];
  return C.forEach(function(M) {
    var E = M.line, k = M.lineConstants, T = Ju(u, E), g = T.horizontal, _ = T.vertical, j = ar(E, k, m, _, 1, !0), R = ar(E, k, y, _, 1, !0), P = ar(E, k, v, g, 1, !0), z = ar(E, k, x, g, 1, !0);
    j.isBound && !r.top && (w.push(f), r.top = !0), R.isBound && !r.bottom && (w.push(f + h), r.bottom = !0), P.isBound && !r.left && (D.push(c), r.left = !0), z.isBound && !r.right && (D.push(c + d), r.right = !0);
  }), {
    boundMap: r,
    horizontal: w,
    vertical: D
  };
}
function Ih(t, e, r, n) {
  var a = e[0] - t[0], i = e[1] - t[1];
  if (q(a) < Qt && (a = 0), q(i) < Qt && (i = 0), !a)
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
function Ki(t, e, r, n, a) {
  var i = Ih(t, e, r, n);
  if (!i)
    return {
      isOutside: !1,
      offset: [0, 0]
    };
  var o = Xe(t, e), s = Xe(i, t), l = Xe(i, e), u = s > o || l > o, c = N($e({
    datas: a,
    distX: i[0],
    distY: i[1]
  }), 2), f = c[0], d = c[1];
  return {
    offset: [f, d],
    isOutside: u
  };
}
function Ia(t, e) {
  return t.isBound ? t.offset : e.isSnap ? Ui(e).offset : 0;
}
function Rh(t, e, r, n, a) {
  var i = N(e, 2), o = i[0], s = i[1], l = N(r, 2), u = l[0], c = l[1], f = N(n, 2), d = f[0], h = f[1], v = N(a, 2), m = v[0], x = v[1], y = -m, C = -x;
  if (t && o && s) {
    y = 0, C = 0;
    var w = [];
    if (u && c ? w.push([0, x], [m, 0]) : u ? w.push([m, 0]) : c ? w.push([0, x]) : d && h ? w.push([0, x], [m, 0]) : d ? w.push([m, 0]) : h && w.push([0, x]), w.length) {
      w.sort(function(k, T) {
        return _e(gt([o, s], k)) - _e(gt([o, s], T));
      });
      var D = w[0];
      if (D[0] && q(o) > Qt)
        y = -D[0], C = s * q(o + y) / q(o) - s;
      else if (D[1] && q(s) > Qt) {
        var M = s;
        C = -D[1], y = o * q(s + C) / q(M) - o;
      }
      if (t && c && u)
        if (q(y) > Qt && q(y) < q(m)) {
          var E = q(m) / q(y);
          y *= E, C *= E;
        } else if (q(C) > Qt && q(C) < q(x)) {
          var E = q(x) / q(C);
          y *= E, C *= E;
        } else
          y = $r(-m, y), C = $r(-x, C);
    }
  } else
    y = o || u ? -m : 0, C = s || c ? -x : 0;
  return [y, C];
}
function Ph(t, e, r, n, a, i) {
  if (!Qr(t, "draggable"))
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
  var o = Ao(i.absolutePoses, [e, r]), s = ke(o), l = s.left, u = s.right, c = s.top, f = s.bottom, d = {
    horizontal: o.map(function(z) {
      return z[1];
    }),
    vertical: o.map(function(z) {
      return z[0];
    })
  }, h = Ro(t.props.snapDirections), v = Po(h, {
    left: l,
    right: u,
    top: c,
    bottom: f,
    center: (l + u) / 2,
    middle: (c + f) / 2
  }), m = Ha(t, a, v, d), x = m.vertical, y = m.horizontal, C = Eh(t, o, i), w = C.vertical, D = C.horizontal, M = x.isSnap, E = y.isSnap, k = x.isBound || w.isBound, T = y.isBound || D.isBound, g = $r(x.offset, w.offset), _ = $r(y.offset, D.offset), j = N(Rh(n, [e, r], [k, T], [M, E], [g, _]), 2), R = j[0], P = j[1];
  return [
    {
      isBound: k,
      isSnap: M,
      offset: R
    },
    {
      isBound: T,
      isSnap: E,
      offset: P
    }
  ];
}
function Ha(t, e, r, n) {
  n === void 0 && (n = r);
  var a = Io(Ya(t), n.vertical, n.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : Xa(t, r.vertical, r.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, u = s.vertical, c = Ia(i[0], l), f = Ia(o[0], u), d = q(c), h = q(f);
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
function nl(t, e, r, n, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = Io(e, r, n), l = s.horizontal, u = s.vertical, c = Ku(t, r, n, [], [], a, i, o), f = c.horizontal, d = c.vertical, h = Ia(l[0], f), v = Ia(u[0], d), m = q(h), x = q(v);
  return {
    horizontal: {
      isBound: l[0].isBound,
      isSnap: f.isSnap,
      snapIndex: f.index,
      offset: h,
      dist: m,
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
function Oh(t, e, r, n) {
  var a = Vt(t, e) / Math.PI * 180, i = r.vertical, o = i.isBound, s = i.isSnap, l = i.dist, u = r.horizontal, c = u.isBound, f = u.isSnap, d = u.dist, h = a % 180, v = h < 3 || h > 177, m = h > 87 && h < 93;
  return d < l && (o || s && !m && (!n || !v)) ? "vertical" : c || f && !v && (!n || !m) ? "horizontal" : "";
}
function Nh(t, e, r, n, a, i) {
  return r.map(function(o) {
    var s = N(o, 2), l = s[0], u = s[1], c = ee(e, l), f = ee(e, u), d = n ? jh(t, c, f, a) : Ha(t, a, {
      vertical: [f[0]],
      horizontal: [f[1]]
    }), h = d.horizontal, v = h.offset, m = h.isBound, x = h.isSnap, y = d.vertical, C = y.offset, w = y.isBound, D = y.isSnap, M = gt(u, l);
    if (!C && !v)
      return {
        isBound: w || m,
        isSnap: D || x,
        sign: M,
        offset: [0, 0]
      };
    var E = Oh(c, f, d, n);
    if (!E)
      return {
        sign: M,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var k = E === "vertical", T = [0, 0];
    return !n && q(u[0]) === 1 && q(u[1]) === 1 && l[0] !== u[0] && l[1] !== u[1] ? T = $e({
      datas: i,
      distX: -C,
      distY: -v
    }) : T = Ki(c, f, -(k ? C : v), k, i).offset, T = T.map(function(g, _) {
      return g * (M[_] ? 2 / M[_] : 0);
    }), {
      sign: M,
      isBound: k ? w : m,
      isSnap: k ? D : x,
      offset: T
    };
  });
}
function al(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function jh(t, e, r, n) {
  var a = dh(t, e, r), i = a.horizontal, o = a.vertical, s = n ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : bh(t, e, r), l = s.horizontal, u = s.vertical, c = al(i, l), f = al(o, u), d = q(c), h = q(f);
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
function zh(t, e, r, n, a) {
  var i = [-r[0], -r[1]], o = t.state, s = o.width, l = o.height, u = t.props.bounds, c = 1 / 0, f = 1 / 0;
  if (u) {
    var d = [
      [r[0], -r[1]],
      [-r[0], r[1]]
    ], h = u.left, v = h === void 0 ? -1 / 0 : h, m = u.top, x = m === void 0 ? -1 / 0 : m, y = u.right, C = y === void 0 ? 1 / 0 : y, w = u.bottom, D = w === void 0 ? 1 / 0 : w;
    d.forEach(function(M) {
      var E = M[0] !== i[0], k = M[1] !== i[1], T = ee(e, M), g = Vt(n, T) * 360 / Math.PI;
      if (k) {
        var _ = T.slice();
        (q(g - 360) < 2 || q(g - 180) < 2) && (_[1] = n[1]);
        var j = Ki(n, _, (n[1] < T[1] ? D : x) - T[1], !1, a), R = N(j.offset, 2), P = R[1], z = j.isOutside;
        isNaN(P) || (f = l + (z ? 1 : -1) * q(P));
      }
      if (E) {
        var _ = T.slice();
        (q(g - 90) < 2 || q(g - 270) < 2) && (_[0] = n[0]);
        var B = Ki(n, _, (n[0] < T[0] ? C : v) - T[0], !0, a), Y = N(B.offset, 1), H = Y[0], L = B.isOutside;
        isNaN(H) || (c = s + (L ? 1 : -1) * q(H));
      }
    });
  }
  return {
    maxWidth: c,
    maxHeight: f
  };
}
var ce = {
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
    var c = _e(u), f = Vt(u, [0, 0]);
    return [e.createElement("div", { className: vt("line", "horizontal", "dragline", "dashed"), key: "dragRotateGuideline", style: {
      width: "".concat(c, "px"),
      transform: "translate(".concat(l[0], "px, ").concat(l[1], "px) rotate(").concat(f, "rad) scaleY(").concat(i, ")")
    } })];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.parentEvent, a = e.parentGesto, i = t.state, o = i.gestos, s = i.style;
    if (o.draggable)
      return !1;
    o.draggable = a || t.targetGesto, r.datas = {}, r.left = parseFloat(s.left || "") || 0, r.top = parseFloat(s.top || "") || 0, r.bottom = parseFloat(s.bottom || "") || 0, r.right = parseFloat(s.right || "") || 0, r.startValue = [0, 0], Er(t, e), Wa(t, e, "translate"), ev(t, r), r.prevDist = [0, 0], r.prevBeforeDist = [0, 0], r.isDrag = !1, r.deltaOffset = [0, 0];
    var l = Et(t, e, O({ set: function(c) {
      r.startValue = c;
    } }, La(t, e))), u = n || ut(t, "onDragStart", l);
    return u !== !1 ? (r.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, r.isPinch = !1), r.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      Ga(t, e, "translate");
      var r = e.datas, n = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, u = e.isGroup, c = e.parentThrottleDrag, f = e.distX, d = e.distY, h = r.isDrag, v = r.prevDist, m = r.prevBeforeDist, x = r.startValue;
      if (h) {
        o && (f += o[0], d += o[1]);
        var y = t.props, C = y.parentMoveable, w = u ? 0 : y.throttleDrag || c || 0, D = n ? 0 : y.throttleDragRotate || 0, M = 0, E = !1, k = !1, T = !1, g = !1;
        if (!n && D > 0 && (f || d)) {
          var _ = y.startDragRotate || 0, j = Ct(_ + Vt([0, 0], [f, d]) * 180 / Math.PI, D) - _, R = d * Math.abs(Math.cos((j - 90) / 180 * Math.PI)), P = f * Math.abs(Math.cos(j / 180 * Math.PI)), z = _e([P, R]);
          M = j * Math.PI / 180, f = z * Math.cos(M), d = z * Math.sin(M);
        }
        if (!i && !n && !a) {
          var B = N(Ph(t, f, d, D, !s && l || o, r), 2), Y = B[0], H = B[1];
          E = Y.isSnap, k = Y.isBound, T = H.isSnap, g = H.isBound;
          var L = Y.offset, $ = H.offset;
          f += L, d += $;
        }
        var Z = Pt(ju({ datas: r, distX: f, distY: d }), x), F = Pt(qp({ datas: r, distX: f, distY: d }), x);
        Hs(F, pe), Hs(Z, pe), D || (!E && !k && (F[0] = Ct(F[0], w), Z[0] = Ct(Z[0], w)), !T && !g && (F[1] = Ct(F[1], w), Z[1] = Ct(Z[1], w)));
        var rt = gt(Z, x), at = gt(F, x), Q = gt(at, v), nt = gt(rt, m);
        r.prevDist = at, r.prevBeforeDist = rt, r.passDelta = Q, r.passDist = at;
        var J = r.left + rt[0], st = r.top + rt[1], dt = r.right - rt[0], yt = r.bottom - rt[1], ft = Fa(r, "translate(".concat(F[0], "px, ").concat(F[1], "px)"), "translate(".concat(at[0], "px, ").concat(at[1], "px)"));
        if (_o(e, ft), t.state.dragInfo.dist = n ? [0, 0] : at, !(!n && !C && Q.every(function(pt) {
          return !pt;
        }) && nt.some(function(pt) {
          return !pt;
        }))) {
          var K = t.state, ct = K.width, wt = K.height, xt = Et(t, e, O({ transform: ft, dist: at, delta: Q, translate: F, beforeDist: rt, beforeDelta: nt, beforeTranslate: Z, left: J, top: st, right: dt, bottom: yt, width: ct, height: wt, isPinch: i }, de({
            transform: ft
          }, e)));
          return !n && ut(t, "onDrag", xt), xt;
        }
      }
    }
  },
  dragAfter: function(t, e) {
    var r = e.datas, n = r.deltaOffset;
    return n[0] || n[1] ? (r.deltaOffset = [0, 0], this.drag(t, O(O({}, e), { deltaOffset: n }))) : !1;
  },
  dragEnd: function(t, e) {
    var r = e.parentEvent, n = e.datas;
    if (t.state.dragInfo = null, !!n.isDrag) {
      n.isDrag = !1;
      var a = Se(t, e, {});
      return !r && ut(t, "onDragEnd", a), a;
    }
  },
  dragGroupStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = this.dragStart(t, e);
    if (!s)
      return !1;
    var l = vi(t, this, "dragStart", [
      i || 0,
      o || 0
    ], e, !1, "draggable"), u = l.childEvents, c = l.eventParams, f = O(O({}, s), { targets: t.props.targets, events: c }), d = ut(t, "onDragGroupStart", f);
    a.isDrag = d !== !1;
    var h = (n = (r = u[0]) === null || r === void 0 ? void 0 : r.datas.startValue) !== null && n !== void 0 ? n : [0, 0];
    return a.throttleOffset = [h[0] % 1, h[1] % 1], a.isDrag ? s : !1;
  },
  dragGroup: function(t, e) {
    var r = e.datas;
    if (r.isDrag) {
      var n = this.drag(t, O(O({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = vi(t, this, "drag", a, e, !1, "draggable").eventParams;
      if (n) {
        var o = O({ targets: t.props.targets, events: i }, n);
        return ut(t, "onDragGroup", o), o;
      }
    }
  },
  dragGroupEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isDrag) {
      this.dragEnd(t, e);
      var a = vi(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
      return ut(t, "onDragGroupEnd", Se(t, e, {
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
function ec(t, e) {
  var r = ee(t, e), n = [0, 0];
  return {
    fixedPosition: r,
    fixedDirection: e,
    fixedOffset: n
  };
}
function Ah(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = [
    a / 2 * (1 + e[0]),
    i / 2 * (1 + e[1])
  ], l = Wt(r, s, o), u = [0, 0];
  return {
    fixedPosition: l,
    fixedDirection: e,
    fixedOffset: u
  };
}
function rc(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = eh(e, a, i), l = Wt(r, e, o), u = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: u
  };
}
var il = Fo("resizable"), Zi = {
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
  render: Yu("resizable"),
  dragControlCondition: il,
  viewClassName: Go("resizable"),
  dragControlStart: function(t, e) {
    var r, n = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, u = e.parentFixedDirection, c = e.parentEvent, f = vc(o, a, n, l), d = t.state, h = d.target, v = d.width, m = d.height, x = d.gestos;
    if (!f || !h || x.resizable)
      return !1;
    x.resizable = s || t.controlGesto, !a && Er(t, e), l.datas = {}, l.direction = f, l.startOffsetWidth = v, l.startOffsetHeight = m, l.prevWidth = 0, l.prevHeight = 0, l.minSize = [0, 0], l.startWidth = d.inlineCSSWidth || d.cssWidth, l.startHeight = d.inlineCSSHeight || d.cssHeight, l.maxSize = [1 / 0, 1 / 0], i || (l.minSize = [
      d.minOffsetWidth,
      d.minOffsetHeight
    ], l.maxSize = [
      d.maxOffsetWidth,
      d.maxOffsetHeight
    ]);
    var y = t.props.transformOrigin || "% %";
    l.transformOrigin = Me(y) ? y.split(" ") : y, l.startOffsetMatrix = d.offsetMatrix, l.startTransformOrigin = d.transformOrigin, l.isWidth = (r = e == null ? void 0 : e.parentIsWidth) !== null && r !== void 0 ? r : !f[0] && !f[1] || f[0] || !f[1];
    function C(g) {
      l.ratio = g && isFinite(g) ? g : 0;
    }
    l.startPositions = Te(t.state);
    function w(g) {
      var _ = ec(l.startPositions, g);
      l.fixedDirection = _.fixedDirection, l.fixedPosition = _.fixedPosition, l.fixedOffset = _.fixedOffset;
    }
    function D(g) {
      var _ = rc(t.state, g);
      l.fixedDirection = _.fixedDirection, l.fixedPosition = _.fixedPosition, l.fixedOffset = _.fixedOffset;
    }
    function M(g) {
      l.minSize = [
        jt("".concat(g[0]), 0) || 0,
        jt("".concat(g[1]), 0) || 0
      ];
    }
    function E(g) {
      var _ = [
        g[0] || 1 / 0,
        g[1] || 1 / 0
      ];
      (!Cn(_[0]) || isFinite(_[0])) && (_[0] = jt("".concat(_[0]), 0) || 1 / 0), (!Cn(_[1]) || isFinite(_[1])) && (_[1] = jt("".concat(_[1]), 0) || 1 / 0), l.maxSize = _;
    }
    C(v / m), w(u || [-f[0], -f[1]]), l.setFixedDirection = w, l.setFixedPosition = D, l.setMin = M, l.setMax = E;
    var k = Et(t, e, {
      direction: f,
      startRatio: l.ratio,
      set: function(g) {
        var _ = N(g, 2), j = _[0], R = _[1];
        l.startWidth = j, l.startHeight = R;
      },
      setMin: M,
      setMax: E,
      setRatio: C,
      setFixedDirection: w,
      setFixedPosition: D,
      setOrigin: function(g) {
        l.transformOrigin = g;
      },
      dragStart: ce.dragStart(t, new Xr().dragStart([0, 0], e))
    }), T = c || ut(t, "onResizeStart", k);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, T !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: f
    }), l.isResize ? k : !1;
  },
  dragControl: function(t, e) {
    var r, n = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, u = e.useSnap, c = e.isRequest, f = e.isGroup, d = e.parentEvent, h = e.resolveMatrix, v = n.isResize, m = n.transformOrigin, x = n.startWidth, y = n.startHeight, C = n.prevWidth, w = n.prevHeight, D = n.minSize, M = n.maxSize, E = n.ratio, k = n.startOffsetWidth, T = n.startOffsetHeight, g = n.isWidth;
    if (!v)
      return;
    if (h) {
      var _ = t.state.is3d, j = n.startOffsetMatrix, R = n.startTransformOrigin, P = _ ? 4 : 3, z = Wr(Ma(e)), B = Math.sqrt(z.length);
      P !== B && (z = ze(z, B, P));
      var Y = On(j, z, R, P), H = Dr(Y, k, T, P);
      n.startPositions = H, n.nextTargetMatrix = z, n.nextAllMatrix = Y;
    }
    var L = wr(t.props, "resizable"), $ = L.resizeFormat, Z = L.throttleResize, F = Z === void 0 ? a ? 0 : 1 : Z, rt = L.parentMoveable, at = L.keepRatioFinally, Q = n.direction, nt = Q, J = 0, st = 0;
    !Q[0] && !Q[1] && (nt = [1, 1]);
    var dt = E && (o ?? L.keepRatio) || !1;
    function yt() {
      var Bt = n.fixedDirection, At = Sc(nt, dt, n, e);
      J = At.distWidth, st = At.distHeight;
      var re = nt[0] - Bt[0] || dt ? Math.max(k + J, pe) : k, ue = nt[1] - Bt[1] || dt ? Math.max(T + st, pe) : T;
      return dt && k && T && (g ? ue = re / E : re = ue * E), [re, ue];
    }
    var ft = N(yt(), 2), K = ft[0], ct = ft[1];
    d || (n.setFixedDirection(n.fixedDirection), ut(t, "onBeforeResize", Et(t, e, {
      startFixedDirection: n.startFixedDirection,
      startFixedPosition: n.startFixedPosition,
      setFixedDirection: function(Bt) {
        var At;
        return n.setFixedDirection(Bt), At = N(yt(), 2), K = At[0], ct = At[1], [K, ct];
      },
      setFixedPosition: function(Bt) {
        var At;
        return n.setFixedPosition(Bt), At = N(yt(), 2), K = At[0], ct = At[1], [K, ct];
      },
      boundingWidth: K,
      boundingHeight: ct,
      setSize: function(Bt) {
        var At;
        At = N(Bt, 2), K = At[0], ct = At[1];
      }
    }, !0)));
    var wt = s;
    s || (!a && i ? wt = ih(t, [0, 0]) : wt = n.fixedPosition);
    var xt = [0, 0];
    i || (xt = Qh(t, K, ct, Q, wt, !u && c, n)), l && (!l[0] && (xt[0] = 0), !l[1] && (xt[1] = 0));
    function pt() {
      var Bt;
      $ && (Bt = N($([K, ct]), 2), K = Bt[0], ct = Bt[1]), K = Ct(K, F), ct = Ct(ct, F);
    }
    if (dt) {
      nt[0] && nt[1] && xt[0] && xt[1] && (q(xt[0]) > q(xt[1]) ? xt[1] = 0 : xt[0] = 0);
      var bt = !xt[0] && !xt[1];
      bt && pt(), nt[0] && !nt[1] || xt[0] && !xt[1] || bt && g ? (K += xt[0], ct = K / E) : (!nt[0] && nt[1] || !xt[0] && xt[1] || bt && !g) && (ct += xt[1], K = ct * E);
    } else
      K += xt[0], ct += xt[1], K = Math.max(0, K), ct = Math.max(0, ct);
    r = N(mo([K, ct], D, M, dt ? E : !1), 2), K = r[0], ct = r[1], pt(), dt && (f || at) && (g ? ct = K / E : K = ct * E), J = K - k, st = ct - T;
    var St = [J - C, st - w];
    n.prevWidth = J, n.prevHeight = st;
    var _t = ah(t, K, ct, wt, m, n);
    if (!(!rt && St.every(function(Bt) {
      return !Bt;
    }) && _t.every(function(Bt) {
      return !Bt;
    }))) {
      var ht = ce.drag(t, Pn(e, t.state, _t, !!i, !1, "draggable")), kt = ht.transform, Tt = x + J, Yt = y + st, Xt = Et(t, e, O({ width: Tt, height: Yt, offsetWidth: Math.round(K), offsetHeight: Math.round(ct), startRatio: E, boundingWidth: K, boundingHeight: ct, direction: Q, dist: [J, st], delta: St, isPinch: !!i, drag: ht }, mc({
        style: {
          width: "".concat(Tt, "px"),
          height: "".concat(Yt, "px")
        },
        transform: kt
      }, ht, e)));
      return !d && ut(t, "onResize", Xt), Xt;
    }
  },
  dragControlAfter: function(t, e) {
    var r = e.datas, n = r.isResize, a = r.startOffsetWidth, i = r.startOffsetHeight, o = r.prevWidth, s = r.prevHeight;
    if (!(!n || t.props.checkResizableError === !1)) {
      var l = t.state, u = l.width, c = l.height, f = u - (a + o), d = c - (i + s), h = q(f) > 3, v = q(d) > 3;
      if (h && (r.startWidth += f, r.startOffsetWidth += f, r.prevWidth += f), v && (r.startHeight += d, r.startOffsetHeight += d, r.prevHeight += d), h || v)
        return this.dragControl(t, e);
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.parentEvent;
    if (r.isResize) {
      r.isResize = !1;
      var a = Se(t, e, {});
      return !n && ut(t, "onResizeEnd", a), a;
    }
  },
  dragGroupControlCondition: il,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, O(O({}, e), { isGroup: !0 }));
    if (!n)
      return !1;
    var a = Ne(t, "resizable", e), i = r.startOffsetWidth, o = r.startOffsetHeight;
    function s() {
      var h = r.minSize;
      a.forEach(function(v) {
        var m = v.datas, x = m.minSize, y = m.startOffsetWidth, C = m.startOffsetHeight, w = i * (y ? x[0] / y : 0), D = o * (C ? x[1] / C : 0);
        h[0] = Math.max(h[0], w), h[1] = Math.max(h[1], D);
      });
    }
    function l() {
      var h = r.maxSize;
      a.forEach(function(v) {
        var m = v.datas, x = m.maxSize, y = m.startOffsetWidth, C = m.startOffsetHeight, w = i * (y ? x[0] / y : 0), D = o * (C ? x[1] / C : 0);
        h[0] = Math.min(h[0], w), h[1] = Math.min(h[1], D);
      });
    }
    var u = Ze(t, this, "dragControlStart", e, function(h, v) {
      return _a(t, h, r, v);
    });
    s(), l();
    var c = function(h) {
      n.setFixedDirection(h), u.forEach(function(v, m) {
        v.setFixedDirection(h), _a(t, v.moveable, r, a[m]);
      });
    };
    r.setFixedDirection = c;
    var f = O(O({}, n), { targets: t.props.targets, events: u.map(function(h) {
      return O(O({}, h), { setMin: function(v) {
        h.setMin(v), s();
      }, setMax: function(v) {
        h.setMax(v), l();
      } });
    }), setFixedDirection: c, setMin: function(h) {
      n.setMin(h), s();
    }, setMax: function(h) {
      n.setMax(h), l();
    } }), d = ut(t, "onResizeGroupStart", f);
    return r.isResize = d !== !1, r.isResize ? n : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isResize) {
      var n = wr(t.props, "resizable");
      qa(t, "onBeforeResize", function(h) {
        ut(t, "onBeforeResizeGroup", Et(t, e, O(O({}, h), { targets: n.targets }), !0));
      });
      var a = this.dragControl(t, O(O({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = n.keepRatio, u = [
          i / (i - s[0]),
          o / (o - s[1])
        ], c = r.fixedPosition, f = Ze(t, this, "dragControl", e, function(h, v) {
          var m = N(le(_n(t.rotation / 180 * Math.PI, 3), [
            v.datas.originalX * u[0],
            v.datas.originalY * u[1],
            1
          ], 3), 2), x = m[0], y = m[1];
          return O(O({}, v), { parentDist: null, parentScale: u, dragClient: Pt(c, [x, y]), parentKeepRatio: l });
        }), d = O({ targets: n.targets, events: f }, a);
        return ut(t, "onResizeGroup", d), d;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isResize) {
      this.dragControlEnd(t, e);
      var a = Ze(t, this, "dragControlEnd", e), i = Se(t, e, {
        targets: t.props.targets,
        events: a
      });
      return ut(t, "onResizeGroupEnd", i), r;
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
function gi(t, e, r, n, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, u = Wt(
    t.state.rootMatrix,
    // TO-DO #710
    gt([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), c = Pt([a.left, a.top], u);
  e.startAbsoluteOrigin = c, e.prevDeg = Vt(c, [r, n]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = Xe(c, [r, n]);
}
function xa(t, e, r) {
  var n = r.defaultDeg, a = r.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - n);
  return r.prevDeg = n + s, s;
}
function mi(t, e, r, n) {
  return xa(Vt(n.startAbsoluteOrigin, [t, e]) / Math.PI * 180, r, n);
}
function xi(t, e, r, n, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = r.prevSnapDeg, u = 0, c = !1;
  if (i) {
    var f = Jh(t, e, n, a + n);
    c = f.isSnap, u = a + f.dist;
  }
  c || (u = Ct(a + n, s));
  var d = u - a;
  return r.prevSnapDeg = d, [d - l, d, u];
}
function nc(t, e, r) {
  var n = N(e, 4), a = n[0], i = n[1], o = n[2], s = n[3];
  if (t === "none")
    return [];
  if (qt(t))
    return t.map(function(x) {
      return nc(x, [a, i, o, s], r)[0];
    });
  var l = N((t || "top").split("-"), 2), u = l[0], c = l[1], f = [a, i];
  u === "left" ? f = [o, a] : u === "right" ? f = [i, s] : u === "bottom" && (f = [s, o]);
  var d = [
    (f[0][0] + f[1][0]) / 2,
    (f[0][1] + f[1][1]) / 2
  ], h = pc(f, r);
  if (c) {
    var v = c === "top" || c === "left", m = u === "bottom" || u === "left";
    d = f[v && !m || !v && m ? 0 : 1];
  }
  return [[d, h]];
}
function Ji(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var r = e.inputEvent.target;
  if (te(r, vt("rotation-control")) || t.props.rotateAroundControls && te(r, vt("around-control")) || te(r, vt("control")) && te(r, vt("rotatable")))
    return !0;
  var n = t.props.rotationTarget;
  return n ? Lo(n, !0).some(function(a) {
    return a ? r === a || r.contains(a) : !1;
  }) : !1;
}
var Bh = `.rotation {
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
`, Gh = {
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
  css: [Bh],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? vt("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var r = wr(t.props, "rotatable"), n = r.rotatable, a = r.rotationPosition, i = r.zoom, o = r.renderDirections, s = r.rotateAroundControls, l = r.resolveAblesWithRotatable, u = t.getState(), c = u.renderPoses, f = u.direction;
    if (!n)
      return null;
    var d = nc(a, c, f), h = [];
    if (d.forEach(function(y, C) {
      var w = N(y, 2), D = w[0], M = w[1];
      h.push(e.createElement(
        "div",
        { key: "rotation".concat(C), className: vt("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(D[0], "px, ").concat(D[1], "px) rotate(").concat(M, "rad)")
        } },
        e.createElement("div", { className: vt("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: vt("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var v = Kr(l || {}), m = {};
      v.forEach(function(y) {
        l[y].forEach(function(C) {
          m[C] = y;
        });
      });
      var x = [];
      qt(o) && (x = o.map(function(y) {
        var C = m[y];
        return {
          data: C ? { resolve: C } : {},
          classNames: C ? ["move"] : [],
          dir: y
        };
      })), h.push.apply(h, et([], N(Fu(t, "rotatable", x, e)), !1));
    }
    return s && h.push.apply(h, et([], N(Hu(t, e)), !1)), h;
  },
  dragControlCondition: Ji,
  dragControlStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, u = e.isPinch, c = e.isRequest, f = t.state, d = f.target, h = f.left, v = f.top, m = f.direction, x = f.beforeDirection, y = f.targetTransform, C = f.moveableClientRect, w = f.offsetMatrix, D = f.targetMatrix, M = f.allMatrix, E = f.width, k = f.height;
    if (!c && !d)
      return !1;
    var T = t.getRect();
    a.rect = T, a.transform = y, a.left = h, a.top = v;
    var g = function(nt) {
      var J = rc(t.state, nt);
      a.fixedDirection = J.fixedDirection, a.fixedOffset = J.fixedOffset, a.fixedPosition = J.fixedPosition, F && F.setFixedPosition(nt);
    }, _ = function(nt) {
      var J = Ah(t.state, nt);
      a.fixedDirection = J.fixedDirection, a.fixedOffset = J.fixedOffset, a.fixedPosition = J.fixedPosition, F && F.setFixedDirection(nt);
    }, j = i, R = o;
    if (c || u || l) {
      var P = s || 0;
      a.beforeInfo = {
        origin: T.beforeOrigin,
        prevDeg: P,
        defaultDeg: P,
        prevSnapDeg: 0,
        startDist: 0
      }, a.afterInfo = O(O({}, a.beforeInfo), { origin: T.origin }), a.absoluteInfo = O(O({}, a.beforeInfo), { origin: T.origin, startValue: P });
    } else {
      var z = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
      if (z) {
        var B = z.getAttribute("data-direction") || "", Y = Xp[B];
        if (Y) {
          a.isControl = !0, a.isAroundControl = te(z, vt("around-control")), a.controlDirection = Y;
          var H = z.getAttribute("data-resolve");
          H && (a.resolveAble = H);
          var L = hv(f.rootMatrix, f.renderPoses, C);
          r = N(ee(L, Y), 2), j = r[0], R = r[1];
        }
      }
      a.beforeInfo = { origin: T.beforeOrigin }, a.afterInfo = { origin: T.origin }, a.absoluteInfo = {
        origin: T.origin,
        startValue: T.rotation
      };
      var $ = g;
      g = function(nt) {
        var J = f.is3d ? 4 : 3, st = N(Pt(xu(D, J), nt), 2), dt = st[0], yt = st[1], ft = le(w, br([dt, yt], J)), K = le(M, br([nt[0], nt[1]], J));
        $(nt);
        var ct = f.posDelta;
        a.beforeInfo.origin = gt(ft, ct), a.afterInfo.origin = gt(K, ct), a.absoluteInfo.origin = gt(K, ct), gi(t, a.beforeInfo, j, R, C), gi(t, a.afterInfo, j, R, C), gi(t, a.absoluteInfo, j, R, C);
      }, _ = function(nt) {
        var J = ee([
          [0, 0],
          [E, 0],
          [0, k],
          [E, k]
        ], nt);
        g(J);
      };
    }
    a.startClientX = j, a.startClientY = R, a.direction = m, a.beforeDirection = x, a.startValue = 0, a.datas = {}, Wa(t, e, "rotate");
    var Z = !1, F = !1;
    if (a.isControl && a.resolveAble) {
      var rt = a.resolveAble;
      rt === "resizable" && (F = Zi.dragControlStart(t, O(O({}, new Xr("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    F || (Z = ce.dragStart(t, new Xr().dragStart([0, 0], e))), g(vv(t));
    var at = Et(t, e, O(O({ set: function(nt) {
      a.startValue = nt * Math.PI / 180;
    }, setFixedDirection: _, setFixedPosition: g }, La(t, e)), { dragStart: Z, resizeStart: F })), Q = ut(t, "onRotateStart", at);
    return a.isRotate = Q !== !1, f.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? at : !1;
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, u = e.parentFlag, c = e.isPinch, f = e.groupDelta, d = e.resolveMatrix, h = i.beforeDirection, v = i.beforeInfo, m = i.afterInfo, x = i.absoluteInfo, y = i.isRotate, C = i.startValue, w = i.rect, D = i.startClientX, M = i.startClientY;
    if (y) {
      Ga(t, e, "rotate");
      var E = $p(e), k = h * E, T = t.props.parentMoveable, g = 0, _, j, R = 0, P, z, B = 0, Y, H, L = 180 / Math.PI * C, $ = x.startValue, Z = !1, F = D + o, rt = M + s;
      if (!u && "parentDist" in e) {
        var at = e.parentDist;
        _ = at, P = at, Y = at;
      } else c || u ? (_ = xa(l, h, v), P = xa(l, k, m), Y = xa(l, k, x)) : (_ = mi(F, rt, h, v), P = mi(F, rt, k, m), Y = mi(F, rt, k, x), Z = !0);
      if (j = L + _, z = L + P, H = $ + Y, ut(t, "onBeforeRotate", Et(t, e, {
        beforeRotation: j,
        rotation: z,
        absoluteRotation: H,
        setRotation: function(wt) {
          P = wt - L, _ = P, Y = P;
        }
      }, !0)), r = N(xi(t, w, v, _, L, Z), 3), g = r[0], _ = r[1], j = r[2], n = N(xi(t, w, m, P, L, Z), 3), R = n[0], P = n[1], z = n[2], a = N(xi(t, w, x, Y, $, Z), 3), B = a[0], Y = a[1], H = a[2], !(!B && !R && !g && !T && !d)) {
        var Q = Fa(i, "rotate(".concat(z, "deg)"), "rotate(".concat(P, "deg)"));
        d && (i.fixedPosition = To(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var nt = nh(t, P, i), J = gt(Pt(f || [0, 0], nt), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = nt, i.requestValue = null;
        var st = Au(t, Q, J, c, e), dt = st, yt = Xe([F, rt], x.startAbsoluteOrigin) - x.startDist, ft = void 0;
        if (i.resolveAble === "resizable") {
          var K = Zi.dragControl(t, O(O({}, Pn(e, t.state, [e.deltaX, e.deltaY], !!c, !1, "resizable")), { resolveMatrix: !0, parentDistance: yt }));
          K && (ft = K, dt = mc(dt, K, e));
        }
        var ct = Et(t, e, O(O({ delta: R, dist: P, rotate: z, rotation: z, beforeDist: _, beforeDelta: g, beforeRotate: j, beforeRotation: j, absoluteDist: Y, absoluteDelta: B, absoluteRotate: H, absoluteRotation: H, isPinch: !!c, resize: ft }, st), dt));
        return ut(t, "onRotate", ct), ct;
      }
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      r.isRotate = !1;
      var n = Se(t, e, {});
      return ut(t, "onRotateEnd", n), n;
    }
  },
  dragGroupControlCondition: Ji,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = t.state, a = n.left, i = n.top, o = n.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(r.beforeDirection * t.rotation);
    var l = Ze(t, this, "dragControlStart", e, function(f, d) {
      var h = f.state, v = h.left, m = h.top, x = h.beforeOrigin, y = Pt(gt([v, m], [a, i]), gt(x, o));
      return d.datas.startGroupClient = y, d.datas.groupClient = y, O(O({}, d), { parentRotate: 0 });
    }), u = O(O({}, s), { targets: t.props.targets, events: l }), c = ut(t, "onRotateGroupStart", u);
    return r.isRotate = c !== !1, r.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      qa(t, "onBeforeRotate", function(u) {
        ut(t, "onBeforeRotateGroup", Et(t, e, O(O({}, u), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = r.beforeDirection, i = n.beforeDist, o = i / 180 * Math.PI, s = Ze(t, this, "dragControl", e, function(u, c) {
          var f = c.datas.startGroupClient, d = N(c.datas.groupClient, 2), h = d[0], v = d[1], m = N(Mn(f, o * a), 2), x = m[0], y = m[1], C = [x - h, y - v];
          return c.datas.groupClient = [x, y], O(O({}, c), { parentRotate: i, groupDelta: C });
        });
        t.rotation = a * n.beforeRotation;
        var l = O({ targets: t.props.targets, events: s, set: function(u) {
          t.rotation = u;
        }, setGroupRotation: function(u) {
          t.rotation = u;
        } }, n);
        return ut(t, "onRotateGroup", l), l;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isRotate) {
      this.dragControlEnd(t, e);
      var a = Ze(t, this, "dragControlEnd", e), i = Se(t, e, {
        targets: t.props.targets,
        events: a
      });
      return ut(t, "onRotateGroupEnd", i), r;
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
function Fh(t, e) {
  var r, n = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, u = n === "horizontal", c = u ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (r = {}, r[u ? "width" : "height"] = "".concat(i), r.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(c, "(-50%) scale").concat(c, "(").concat(s, ")"), r)
  });
}
function jo(t, e) {
  return Fh(O(O({}, t), { classNames: et([
    vt("line", "guideline", t.direction)
  ], N(t.classNames), !1).filter(function(r) {
    return r;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(r) {
    return "".concat(Ct(r, 0.1), "px");
  }) }), e);
}
function ol(t, e, r, n, a, i, o, s) {
  var l = t.props.zoom;
  return r.map(function(u, c) {
    var f = u.type, d = u.pos, h = [0, 0];
    return h[o] = n, h[o ? 0 : 1] = -a + d, jo({
      key: "".concat(e, "TargetGuideline").concat(c),
      classNames: [vt("target", "bold", f)],
      posValue: h,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function sl(t, e, r, n, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, u = e === "horizontal" ? sr : lr, c = a[u.start], f = a[u.end];
  return r.filter(function(d) {
    var h = d.hide, v = d.elementRect;
    if (h)
      return !1;
    if (l && v) {
      var m = v.rect;
      if (m[u.start] <= c && f <= m[u.end])
        return !1;
    }
    return !0;
  }).map(function(d, h) {
    var v = d.pos, m = d.size, x = d.element, y = d.className, C = [
      -n[0] + v[0],
      -n[1] + v[1]
    ];
    return jo({
      key: "".concat(e, "-default-guideline-").concat(h),
      classNames: x ? [vt("bold"), y] : [vt("normal"), y],
      direction: e,
      posValue: C,
      sizeValue: m,
      zoom: s
    }, i);
  });
}
function fn(t, e, r, n, a, i, o, s) {
  var l, u = t.props, c = u.snapDigit, f = c === void 0 ? 0 : c, d = u.isDisplaySnapDigit, h = d === void 0 ? !0 : d, v = u.snapDistFormat, m = v === void 0 ? function(M, E) {
    return M;
  } : v, x = u.zoom, y = e === "horizontal" ? "X" : "Y", C = e === "vertical" ? "height" : "width", w = Math.abs(a), D = h ? parseFloat(w.toFixed(f)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(r, "-guideline-").concat(n), className: vt("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[C] = "".concat(w, "px"), l) },
    jo({
      direction: e,
      classNames: [vt(r), o],
      size: "100%",
      posValue: [0, 0],
      sizeValue: w,
      zoom: x
    }, s),
    s.createElement("div", { className: vt("size-value", "gap"), style: {
      transform: "translate".concat(y, "(-50%) scale(").concat(x, ")")
    } }, D > 0 ? m(D, e) : "")
  );
}
function Lh(t, e, r, n) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? sr : lr, s = r[o.start], l = r[o.end];
  return xc(e, function(u) {
    return u.pos[a];
  }).map(function(u) {
    var c = [], f = [], d = [];
    return u.forEach(function(h) {
      var v, m, x = h.element, y = h.elementRect.rect;
      if (y[o.end] < s)
        c.push(h);
      else if (l < y[o.start])
        f.push(h);
      else if (y[o.start] <= s && l <= y[o.end] && n) {
        var C = h.pos, w = { element: x, rect: O(O({}, y), (v = {}, v[o.end] = y[o.start], v)) }, D = { element: x, rect: O(O({}, y), (m = {}, m[o.start] = y[o.end], m)) }, M = [0, 0], E = [0, 0];
        M[a] = C[a], M[i] = C[i], E[a] = C[a], E[i] = C[i] + h.size, c.push({
          type: t,
          pos: M,
          size: 0,
          elementRect: w,
          direction: "",
          elementDirection: "end"
        }), f.push({
          type: t,
          pos: E,
          size: 0,
          elementRect: D,
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
function Wh(t, e, r, n, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(x) {
      return x.type === s;
    }), u = s === "vertical" ? 1 : 0, c = u ? 0 : 1, f = Lh(s, l, n, i), d = u ? lr : sr, h = u ? sr : lr, v = n[d.start], m = n[d.end];
    f.forEach(function(x) {
      var y = x.total, C = x.start, w = x.end, D = x.inner, M = r[c] + y[0].pos[c] - n[h.start], E = n;
      C.forEach(function(k) {
        var T = k.elementRect.rect, g = E[d.start] - T[d.end];
        if (g > 0) {
          var _ = [0, 0];
          _[u] = r[u] + E[d.start] - v - g, _[c] = M, o.push(fn(t, s, "dashed", o.length, g, _, k.className, a));
        }
        E = T;
      }), E = n, w.forEach(function(k) {
        var T = k.elementRect.rect, g = T[d.start] - E[d.end];
        if (g > 0) {
          var _ = [0, 0];
          _[u] = r[u] + E[d.end] - v, _[c] = M, o.push(fn(t, s, "dashed", o.length, g, _, k.className, a));
        }
        E = T;
      }), D.forEach(function(k) {
        var T = k.elementRect.rect, g = v - T[d.start], _ = T[d.end] - m, j = [0, 0], R = [0, 0];
        j[u] = r[u] - g, j[c] = M, R[u] = r[u] + m - v, R[c] = M, o.push(fn(t, s, "dashed", o.length, g, j, k.className, a)), o.push(fn(t, s, "dashed", o.length, _, R, k.className, a));
      });
    });
  }), o;
}
function Yh(t, e, r, n, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(x) {
      return x.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, u = l ? 0 : 1, c = l ? lr : sr, f = l ? sr : lr, d = n[c.start], h = n[c.end], v = n[f.start], m = n[f.end];
    s.forEach(function(x) {
      var y = x.gap, C = x.gapRects, w = Math.max.apply(Math, et([v], N(C.map(function(E) {
        var k = E.rect;
        return k[f.start];
      })), !1)), D = Math.min.apply(Math, et([m], N(C.map(function(E) {
        var k = E.rect;
        return k[f.end];
      })), !1)), M = (w + D) / 2;
      w === D || M === (v + m) / 2 || C.forEach(function(E) {
        var k = E.rect, T = E.className, g = [r[0], r[1]];
        if (k[c.end] < d)
          g[l] += k[c.end] - d;
        else if (h < k[c.start])
          g[l] += k[c.start] - d - y;
        else
          return;
        g[u] += M - v, i.push(fn(t, l ? "vertical" : "horizontal", "gap", i.length, y, g, T, a));
      });
    });
  }), i;
}
function Qi(t) {
  var e, r, n = t.state, a = n.containerClientRect, i = n.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, u = a.clientHeight, c = a.clientWidth, f = a.clientLeft, d = a.clientTop, h = t.props, v = h.snapGap, m = v === void 0 ? !0 : v, x = h.verticalGuidelines, y = h.horizontalGuidelines, C = h.snapThreshold, w = C === void 0 ? 5 : C, D = h.maxSnapElementGuidelineDistance, M = D === void 0 ? 1 / 0 : D, E = h.isDisplayGridGuidelines, k = ke(Te(t.state)), T = k.top, g = k.left, _ = k.bottom, j = k.right, R = { top: T, left: g, bottom: _, right: j, center: (g + j) / 2, middle: (T + _) / 2 }, P = qh(t), z = et([], N(P), !1), B = ((r = (e = n.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && r !== void 0 ? r : [1, 1]).map(function($) {
    return $ * w;
  });
  m && z.push.apply(z, et([], N(Xh(t, R, B)), !1));
  var Y = O({}, n.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (z.push.apply(z, et([], N($h(t, o ? l : c, o ? s : u, f, d, Y, E)), !1)), i) {
    var H = a.left, L = a.top;
    Y.left += H, Y.top += L, Y.right += H, Y.bottom += L;
  }
  return z.push.apply(z, et([], N(ic(y || !1, x || !1, o ? l : c, o ? s : u, f, d, Y)), !1)), z = z.filter(function($) {
    var Z = $.element, F = $.elementRect, rt = $.type;
    if (!Z || !F)
      return !0;
    var at = F.rect;
    return ac(R, at, rt, M);
  }), z;
}
function Xh(t, e, r) {
  var n = t.props, a = n.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = n.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, u = [];
  return [
    ["vertical", sr, lr],
    ["horizontal", lr, sr]
  ].forEach(function(c) {
    var f = N(c, 3), d = f[0], h = f[1], v = f[2], m = e[h.start], x = e[h.end], y = e[h.center], C = e[v.start], w = e[v.end], D = {
      left: r[0],
      top: r[1]
    };
    function M(T) {
      var g = T.rect, _ = D[h.start];
      return g[h.end] < m + _ ? m - g[h.end] : x - _ < g[h.start] ? g[h.start] - x : -1;
    }
    var E = l.filter(function(T) {
      var g = T.rect;
      return g[v.start] > w || g[v.end] < C ? !1 : M(T) > 0;
    }).sort(function(T, g) {
      return M(T) - M(g);
    }), k = [];
    E.forEach(function(T) {
      E.forEach(function(g) {
        if (T !== g) {
          var _ = T.rect, j = g.rect, R = _[v.start], P = _[v.end], z = j[v.start], B = j[v.end];
          R > B || z > P || k.push([T, g]);
        }
      });
    }), k.forEach(function(T) {
      var g = N(T, 2), _ = g[0], j = g[1], R = _.rect, P = j.rect, z = R[h.start], B = R[h.end], Y = P[h.start], H = P[h.end], L = D[h.start], $ = 0, Z = 0, F = !1, rt = !1, at = !1;
      if (B <= m && x <= Y) {
        if (rt = !0, $ = (Y - B - (x - m)) / 2, Z = B + $ + (x - m) / 2, q(Z - y) > L)
          return;
      } else if (B < Y && H < m + L) {
        if (F = !0, $ = Y - B, Z = H + $, q(Z - m) > L)
          return;
      } else if (B < Y && x - L < z) {
        if (at = !0, $ = Y - B, Z = z - $, q(Z - x) > L)
          return;
      } else
        return;
      $ && ac(e, P, d, i) && ($ > s || u.push({
        type: d,
        pos: d === "vertical" ? [Z, 0] : [0, Z],
        element: j.element,
        size: 0,
        className: j.className,
        isStart: F,
        isCenter: rt,
        isEnd: at,
        gap: $,
        hide: !0,
        gapRects: [_, j],
        direction: "",
        elementDirection: ""
      }));
    });
  }), u;
}
function Hh(t, e, r, n) {
  var a, i, o = t.props, s = t.state, l = o.snapGridAll, u = o.snapGridWidth, c = u === void 0 ? 0 : u, f = o.snapGridHeight, d = f === void 0 ? 0 : f, h = s.snapRenderInfo, v = h && (((a = h.direction) === null || a === void 0 ? void 0 : a[0]) || ((i = h.direction) === null || i === void 0 ? void 0 : i[1])), m = t.moveables;
  if (l && m && v && (c || d)) {
    if (s.snapThresholdInfo)
      return;
    s.snapThresholdInfo = {
      multiples: [1, 1],
      offset: [0, 0]
    };
    var x = t.getRect(), y = x.children, C = h.direction;
    if (y) {
      var w = C.map(function(M, E) {
        var k = E === 0 ? {
          snapSize: c,
          posName: "left",
          sizeName: "width",
          clientOffset: n.left - e
        } : {
          snapSize: d,
          posName: "top",
          sizeName: "height",
          clientOffset: n.top - r
        }, T = k.snapSize, g = k.posName, _ = k.sizeName, j = k.clientOffset;
        if (!T)
          return {
            dir: M,
            multiple: 1,
            snapSize: T,
            snapOffset: 0
          };
        var R = x[_], P = x[g], z = Xd(y.map(function(F) {
          return [
            F[g] - P,
            F[_],
            R - F[_] - F[g] + P
          ];
        })).filter(function(F) {
          return F;
        }).sort(function(F, rt) {
          return F - rt;
        }), B = z[0], Y = z.map(function(F) {
          return Ct(F / B, 0.1) * T;
        }), H = 1, L = Ct(R / B, 0.1);
        for (H = 1; H <= 10 && !Y.every(function(F) {
          return F * H % 1 === 0;
        }); ++H)
          ;
        var $ = (-M + 1) / 2, Z = Ca(P - j, P - j + R, $, 1 - $);
        return {
          multiple: L * H,
          dir: M,
          snapSize: T,
          snapOffset: Math.round(Z / T)
        };
      }), D = w.map(function(M) {
        return M.multiple || 1;
      });
      s.snapThresholdInfo.multiples = D, s.snapThresholdInfo.offset = w.map(function(M) {
        return M.snapOffset;
      }), w.forEach(function(M, E) {
        M.snapSize;
      });
    }
  } else
    s.snapThresholdInfo = null;
}
function $h(t, e, r, n, a, i, o) {
  n === void 0 && (n = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, u = s.snapGridWidth, c = u === void 0 ? 0 : u, f = s.snapGridHeight, d = f === void 0 ? 0 : f, h = [], v = i.left, m = i.top, x = [0, 0];
  Hh(t, n, a, i);
  var y = l.snapThresholdInfo, C = c, w = d;
  if (y && (c *= y.multiples[0] || 1, d *= y.multiples[1] || 1, x = y.offset), d) {
    for (var D = function(E) {
      h.push({
        type: "horizontal",
        pos: [
          v,
          Ct(x[1] * w + E - a + m, 0.1)
        ],
        className: vt("grid-guideline"),
        size: e,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, M = 0; M <= r * 2; M += d)
      D(M);
    for (var M = -d; M >= -r; M -= d)
      D(M);
  }
  if (c) {
    for (var D = function(k) {
      h.push({
        type: "vertical",
        pos: [
          Ct(x[0] * C + k - n + v, 0.1),
          m
        ],
        className: vt("grid-guideline"),
        size: r,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, M = 0; M <= e * 2; M += c)
      D(M);
    for (var M = -c; M >= -e; M -= c)
      D(M);
  }
  return h;
}
function ac(t, e, r, n) {
  return r === "horizontal" ? q(t.right - e.left) <= n || q(t.left - e.right) <= n || t.left <= e.right && e.left <= t.right : r === "vertical" ? q(t.bottom - e.top) <= n || q(t.top - e.bottom) <= n || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function qh(t) {
  var e = t.state, r = t.props.elementGuidelines, n = r === void 0 ? [] : r;
  if (!n.length)
    return e.elementRects = [], [];
  var a = (e.elementRects || []).filter(function(d) {
    return !d.refresh;
  }), i = n.map(function(d) {
    return ye(d) && "element" in d ? O(O({}, d), { element: He(d.element, !0) }) : {
      element: He(d, !0)
    };
  }).filter(function(d) {
    return d.element;
  }), o = jr(a.map(function(d) {
    return d.element;
  }), i.map(function(d) {
    return d.element;
  })), s = o.maintained, l = o.added, u = [];
  s.forEach(function(d) {
    var h = N(d, 2), v = h[0], m = h[1];
    u[m] = a[v];
  }), Vh(t, l.map(function(d) {
    return i[d];
  })).map(function(d, h) {
    u[l[h]] = d;
  }), e.elementRects = u;
  var c = Ro(t.props.elementSnapDirections), f = [];
  return u.forEach(function(d) {
    var h = d.element, v = d.top, m = v === void 0 ? c.top : v, x = d.left, y = x === void 0 ? c.left : x, C = d.right, w = C === void 0 ? c.right : C, D = d.bottom, M = D === void 0 ? c.bottom : D, E = d.center, k = E === void 0 ? c.center : E, T = d.middle, g = T === void 0 ? c.middle : T, _ = d.className, j = d.rect, R = Po({
      top: m,
      right: w,
      left: y,
      bottom: M,
      center: k,
      middle: g
    }, j), P = R.horizontal, z = R.vertical, B = R.horizontalNames, Y = R.verticalNames, H = j.top, L = j.left, $ = j.right - L, Z = j.bottom - H, F = [$, Z];
    z.forEach(function(rt, at) {
      f.push({
        type: "vertical",
        element: h,
        pos: [
          Ct(rt, 0.1),
          H
        ],
        size: Z,
        sizes: F,
        className: _,
        elementRect: d,
        elementDirection: Js[Y[at]] || Y[at],
        direction: ""
      });
    }), P.forEach(function(rt, at) {
      f.push({
        type: "horizontal",
        element: h,
        pos: [
          L,
          Ct(rt, 0.1)
        ],
        size: $,
        sizes: F,
        className: _,
        elementRect: d,
        elementDirection: Js[B[at]] || B[at],
        direction: ""
      });
    });
  }), f;
}
function ll(t, e) {
  return t ? t.map(function(r) {
    var n = ye(r) ? r : { pos: r }, a = n.pos;
    return Cn(a) ? n : O(O({}, n), { pos: jt(a, e) });
  }) : [];
}
function ic(t, e, r, n, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, u = o.top, c = o.bottom, f = o.right, d = r + f - l, h = n + c - u;
  return ll(t, h).forEach(function(v) {
    s.push({
      type: "horizontal",
      pos: [
        l,
        Ct(v.pos - i + u, 0.1)
      ],
      size: d,
      className: v.className,
      direction: ""
    });
  }), ll(e, d).forEach(function(v) {
    s.push({
      type: "vertical",
      pos: [
        Ct(v.pos - a + l, 0.1),
        u
      ],
      size: h,
      className: v.className,
      direction: ""
    });
  }), s;
}
function Vh(t, e) {
  if (!e.length)
    return [];
  var r = t.props.groupable, n = t.state, a = n.containerClientRect, i = n.rootMatrix, o = n.is3d, s = n.offsetDelta, l = o ? 4 : 3, u = N(xh(i, a, l), 2), c = u[0], f = u[1], d = r ? 0 : s[0], h = r ? 0 : s[1];
  return e.map(function(v) {
    var m = v.element.getBoundingClientRect(), x = m.left - c - d, y = m.top - f - h, C = y + m.height, w = x + m.width, D = N(qr(i, [x, y], l), 2), M = D[0], E = D[1], k = N(qr(i, [w, C], l), 2), T = k[0], g = k[1];
    return O(O({}, v), { rect: {
      left: M,
      right: T,
      top: E,
      bottom: g,
      center: (M + T) / 2,
      middle: (E + g) / 2
    } });
  });
}
function ia(t) {
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
    var o = He(n, !0);
    if (o) {
      var s = xn(o), l = hl(e, [
        s.left - a.left,
        s.top - a.top
      ]), u = hl(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = Ct(l[0], 1e-5), i.top = Ct(l[1], 1e-5), i.right = Ct(u[0], 1e-5), i.bottom = Ct(u[1], 1e-5);
    }
  }
  return e.snapContainer = n, e.snapOffset = i, e.guidelines = Qi(t), e.enableSnap = !0, !0;
}
function oc(t, e, r, n, a, i) {
  var o = Dr(t, e, r, i ? 4 : 3), s = ee(o, n);
  return Ao(o, gt(a, s));
}
function ul(t) {
  return t ? t / q(t) : 0;
}
function Uh(t, e, r, n, a, i) {
  var o = i.fixedDirection, s = Ch(r, o, n), l = No(t, e, r, n), u = et(et([], N(Nh(t, e, s, n, a, i)), !1), N(tc(t, l, i)), !1), c = Ta(u, 0), f = Ta(u, 1);
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
function Kh(t, e, r, n, a, i, o, s, l) {
  var u = ee(e, o), c = Ha(t, s, {
    vertical: [u[0]],
    horizontal: [u[1]]
  }), f = c.horizontal.offset, d = c.vertical.offset;
  if (Ct(d, $i) || Ct(f, $i)) {
    var h = N($e({
      datas: l,
      distX: -d,
      distY: -f
    }), 2), v = h[0], m = h[1], x = Math.min(a || 1 / 0, r + o[0] * v), y = Math.min(i || 1 / 0, n + o[1] * m);
    return [x - r, y - n];
  }
  return [0, 0];
}
function sc(t, e, r, n, a, i, o, s) {
  for (var l = Te(t.state), u = t.props.keepRatio, c = 0, f = 0, d = 0; d < 2; ++d) {
    var h = e(c, f), v = Uh(t, h, a, u, o, s), m = v.width, x = v.height, y = m.isBound, C = x.isBound, w = m.offset, D = x.offset;
    if (d === 1 && (y || (w = 0), C || (D = 0)), d === 0 && o && !y && !C)
      return [0, 0];
    if (u) {
      var M = q(w) * (r ? 1 / r : 1), E = q(D) * (n ? 1 / n : 1), k = y && C ? M < E : C || !y && M < E;
      k ? w = r * D / n : D = n * w / r;
    }
    c += w, f += D;
  }
  if (!u && a[0] && a[1]) {
    var T = zh(t, l, a, i, s), g = T.maxWidth, _ = T.maxHeight, j = N(Kh(t, e(c, f).map(function(z) {
      return z.map(function(B) {
        return Ct(B, $i);
      });
    }), r + c, n + f, g, _, a, o, s), 2), w = j[0], D = j[1];
    c += w, f += D;
  }
  return [c, f];
}
function gn(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function Zh(t, e) {
  e = gn(e);
  var r = Math.floor(t / 360), n = r * 360 + 360 - e, a = r * 360 + e;
  return q(t - n) < q(t - a) ? n : a;
}
function yi(t, e) {
  t = gn(t), e = gn(e);
  var r = gn(t - e);
  return Math.min(r, 360 - r);
}
function Jh(t, e, r, n) {
  var a, i = t.props, o = (a = i[$u]) !== null && a !== void 0 ? a : 5, s = i[qu];
  if (Qr(t, "rotatable")) {
    var l = e.pos1, u = e.pos2, c = e.pos3, f = e.pos4, d = e.origin, h = r * Math.PI / 180, v = [l, u, c, f].map(function(D) {
      return gt(D, d);
    }), m = v.map(function(D) {
      return Mn(D, h);
    }), x = et(et([], N(hh(t, v, m, d, r)), !1), N(_h(t, v, m, d, r)), !1);
    x.sort(function(D, M) {
      return q(D - r) - q(M - r);
    });
    var y = x.length > 0;
    if (y)
      return {
        isSnap: y,
        dist: y ? x[0] : r
      };
  }
  if (s != null && s.length && o) {
    var C = s.slice().sort(function(D, M) {
      return yi(D, n) - yi(M, n);
    }), w = C[0];
    if (yi(w, n) <= o)
      return {
        isSnap: !0,
        dist: r + Zh(n, w) - n
      };
  }
  return {
    isSnap: !1,
    dist: r
  };
}
function Qh(t, e, r, n, a, i, o) {
  if (!Qr(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, u = t.state, c = u.allMatrix, f = u.is3d;
  return sc(t, function(d, h) {
    return oc(l || c, e + d, r + h, s, a, f);
  }, e, r, n, a, i, o);
}
function tv(t, e, r, n, a) {
  if (!Qr(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, u = a.is3d, c = sc(t, function(f, d) {
    return oc(Qp(a, Pt(e, [f / i, d / o])), i, o, l, s, u);
  }, i, o, r, s, n, a);
  return [c[0] / i, c[1] / o];
}
function ev(t, e) {
  e.absolutePoses = Te(t.state);
}
function cl(t) {
  var e = [];
  return t.forEach(function(r) {
    r.guidelineInfos.forEach(function(n) {
      var a = n.guideline;
      be(e, function(i) {
        return i.guideline === a;
      }) || (a.direction = "", e.push({ guideline: a, posInfo: r }));
    });
  }), e.map(function(r) {
    var n = r.guideline, a = r.posInfo;
    return O(O({}, n), { direction: a.direction });
  });
}
function fl(t, e, r, n, a, i) {
  var o = Io(Ya(t, i), e, r), s = o.vertical, l = o.horizontal, u = Br();
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
  var c = Th(t), f = c.boundMap, d = c.vertical, h = c.horizontal;
  return d.forEach(function(v) {
    Je(n, function(m) {
      var x = m.type, y = m.pos;
      return x === "bounds" && y === v;
    }) >= 0 || n.push({
      type: "bounds",
      pos: v
    });
  }), h.forEach(function(v) {
    Je(a, function(m) {
      var x = m.type, y = m.pos;
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
var rv = Fo("", ["resizable", "scalable"]), nv = {
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
    $u,
    qu,
    Vu,
    Uu,
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
    if (!u || !u.render || !Qr(t, ""))
      return Fr(t, "boundMap", Br(), function(Q) {
        return JSON.stringify(Q);
      }), Fr(t, "innerBoundMap", Br(), function(Q) {
        return JSON.stringify(Q);
      }), [];
    r.guidelines = Qi(t);
    var d = Math.min(i[0], o[0], s[0], l[0]), h = Math.min(i[1], o[1], s[1], l[1]), v = u.externalPoses || [], m = Te(t.state), x = [], y = [], C = [], w = [], D = [], M = ke(m), E = M.width, k = M.height, T = M.top, g = M.left, _ = M.bottom, j = M.right, R = { left: g, right: j, top: T, bottom: _, center: (g + j) / 2, middle: (T + _) / 2 }, P = v.length > 0, z = P ? ke(v) : {};
    if (!u.request) {
      if (u.direction && D.push(Sh(t, m, u.direction, f, f)), u.snap) {
        var B = ke(m);
        u.center && (B.middle = (B.top + B.bottom) / 2, B.center = (B.left + B.right) / 2), D.push(Qs(t, B, f, f));
      }
      P && (u.center && (z.middle = (z.top + z.bottom) / 2, z.center = (z.left + z.right) / 2), D.push(Qs(t, z, f, f))), D.forEach(function(Q) {
        var nt = Q.vertical.posInfos, J = Q.horizontal.posInfos;
        x.push.apply(x, et([], N(nt.filter(function(st) {
          var dt = st.guidelineInfos;
          return dt.some(function(yt) {
            var ft = yt.guideline;
            return !ft.hide;
          });
        }).map(function(st) {
          return {
            type: "snap",
            pos: st.pos
          };
        })), !1)), y.push.apply(y, et([], N(J.filter(function(st) {
          var dt = st.guidelineInfos;
          return dt.some(function(yt) {
            var ft = yt.guideline;
            return !ft.hide;
          });
        }).map(function(st) {
          return {
            type: "snap",
            pos: st.pos
          };
        })), !1)), C.push.apply(C, et([], N(cl(nt)), !1)), w.push.apply(w, et([], N(cl(J)), !1));
      });
    }
    var Y = fl(t, [g, j], [T, _], x, y), H = Y.boundMap, L = Y.innerBoundMap;
    P && fl(t, [z.left, z.right], [z.top, z.bottom], x, y, u.externalBounds);
    var $ = et(et([], N(C), !1), N(w), !1), Z = $.filter(function(Q) {
      return Q.element && !Q.gapRects;
    }), F = $.filter(function(Q) {
      return Q.gapRects;
    }).sort(function(Q, nt) {
      return Q.gap - nt.gap;
    });
    ut(t, "onSnap", {
      guidelines: $.filter(function(Q) {
        var nt = Q.element;
        return !nt;
      }),
      elements: Z,
      gaps: F
    }, !0);
    var rt = Fr(t, "boundMap", H, function(Q) {
      return JSON.stringify(Q);
    }, Br()), at = Fr(t, "innerBoundMap", L, function(Q) {
      return JSON.stringify(Q);
    }, Br());
    return (H === rt || L === at) && ut(t, "onBound", {
      bounds: H,
      innerBounds: L
    }, !0), et(et(et(et(et(et([], N(Wh(t, Z, [d, h], R, e)), !1), N(Yh(t, F, [d, h], R, e)), !1), N(sl(t, "horizontal", w, [a, n], R, e)), !1), N(sl(t, "vertical", C, [a, n], R, e)), !1), N(ol(t, "horizontal", y, d, n, E, 0, e)), !1), N(ol(t, "vertical", x, h, a, k, 1, e)), !1);
  },
  dragStart: function(t, e) {
    t.state.snapRenderInfo = {
      request: e.isRequest,
      snap: !0,
      center: !0
    }, ia(t);
  },
  drag: function(t) {
    var e = t.state;
    ia(t) || (e.guidelines = Qi(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (rv(t, e) || Ji(t, e))
      return !0;
    if (!e.isRequest && e.inputEvent)
      return te(e.inputEvent.target, vt("snap-control"));
  },
  dragControlStart: function(t) {
    t.state.snapRenderInfo = null, ia(t);
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
    t.state.snapRenderInfo = null, ia(t);
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
function av(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function vt() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return Md.apply(void 0, et([ko], N(t), !1));
}
function lc(t) {
  t();
}
function iv(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : ye(t) ? t : Wr(t);
}
function mn(t, e, r) {
  return Ea(e, Sr(r, e), t, Sr(r.map(function(n) {
    return -n;
  }), e));
}
function ov(t, e, r) {
  if (e === "%") {
    var n = zo(t.ownerSVGElement);
    return n[r ? "width" : "height"] / 100;
  }
  return 1;
}
function sv(t) {
  var e = lv(Bo(t, ":before"));
  return e.map(function(r, n) {
    var a = yr(r), i = a.value, o = a.unit;
    return i * ov(t, o, n === 0);
  });
}
function Ra(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function lv(t) {
  return Ra(t.transformOrigin);
}
function uc(t) {
  var e = me(t), r = e("transform");
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
function kn(t, e, r, n, a) {
  var i, o, s = yo(t) || ur(t), l = !1, u, c;
  if (!t || r)
    u = t;
  else {
    var f = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, d = t.parentElement;
    f ? (l = !0, c = d, u = f) : u = d;
  }
  for (var h = !1, v = t === e || u === e, m = "relative", x = 1, y = parseFloat(a == null ? void 0 : a("zoom")) || 1, C = a == null ? void 0 : a("position"); u && u !== s; ) {
    e === u && (v = !0);
    var w = me(u), D = u.tagName.toLowerCase(), M = uc(u), E = w("willChange"), k = parseFloat(w("zoom")) || 1;
    if (m = w("position"), n && k !== 1) {
      x = k;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !r && n && y !== 1 && C && C !== "absolute" || D === "svg" || D === "foreignobject" || m !== "static" || M && M !== "none" || E === "transform"
    )
      break;
    var T = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, g = u.parentNode;
    T && (l = !0, c = g);
    var _ = g;
    if (_ && _.nodeType === 11) {
      u = _.host, h = !0, m = me(u)("position");
      break;
    }
    u = _, m = "relative";
  }
  return {
    offsetZoom: x,
    hasSlot: l,
    parentSlotElement: c,
    isCustomElement: h,
    isStatic: m === "static",
    isEnd: v || !u || u === s,
    offsetParent: u || s
  };
}
function uv(t, e) {
  var r, n = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = me(t), s = ho(a), l = !s, u, c;
  return !l && (n !== "svg" || t.ownerSVGElement) ? (u = Tu ? sv(t) : Ra(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), c = u.slice(), l = !0, n === "svg" ? (a = 0, i = 0) : (r = N(dv(t, u, t === e && e.tagName.toLowerCase() === "g"), 4), a = r[0], i = r[1], u[0] = r[2], u[1] = r[3])) : (u = Ra(o("transformOrigin")).map(function(f) {
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
function cc(t, e) {
  var r = me(t), n = me(ur(t)), a = n("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(n("marginLeft"), 10), o = parseInt(n("marginTop"), 10);
  return r("position") === "absolute" && ((r("top") !== "auto" || r("bottom") !== "auto") && (o = 0), (r("left") !== "auto" || r("right") !== "auto") && (i = 0)), [i, o];
}
function to(t) {
  t.forEach(function(e) {
    var r = e.matrix;
    r && (e.matrix = ze(r, 3, 4));
  });
}
function cv(t) {
  for (var e = t.parentElement, r = !1, n = ur(t); e; ) {
    var a = Bo(e).transform;
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
function $a(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(yu(t, !e).join(","), ")");
}
function zo(t) {
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
function fv(t, e) {
  var r, n = zo(t), a = n.width, i = n.height, o = n.clientWidth, s = n.clientHeight, l = o / a, u = s / i, c = t.preserveAspectRatio.baseVal, f = c.align, d = c.meetOrSlice, h = [0, 0], v = [l, u], m = [0, 0];
  if (f !== 1) {
    var x = (f - 2) % 3, y = Math.floor((f - 2) / 3);
    h[0] = a * x / 2, h[1] = i * y / 2;
    var C = d === 2 ? Math.max(u, l) : Math.min(l, u);
    v[0] = C, v[1] = C, m[0] = (o - a) / 2 * x, m[1] = (s - i) / 2 * y;
  }
  var w = bo(v, e);
  return r = N(m, 2), w[e * (e - 1)] = r[0], w[e * (e - 1) + 1] = r[1], mn(w, e, h);
}
function dv(t, e, r) {
  var n = t.tagName.toLowerCase();
  if (!t.getBBox || !r && n === "g")
    return [0, 0, 0, 0];
  var a = me(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = zo(t.ownerSVGElement), l = o.x, u = o.y;
  n === "foreignobject" && !l && !u && (l = parseFloat(t.getAttribute("x")) || 0, u = parseFloat(t.getAttribute("y")) || 0);
  var c = l - s.x, f = u - s.y, d = i ? e[0] : e[0] - c, h = i ? e[1] : e[1] - f;
  return [c, f, d, h];
}
function Wt(t, e, r) {
  return le(t, br(e, r), r);
}
function Dr(t, e, r, n) {
  return [[0, 0], [e, 0], [0, r], [e, r]].map(function(a) {
    return Wt(t, a, n);
  });
}
function ke(t) {
  var e = t.map(function(u) {
    return u[0];
  }), r = t.map(function(u) {
    return u[1];
  }), n = Math.min.apply(Math, et([], N(e), !1)), a = Math.min.apply(Math, et([], N(r), !1)), i = Math.max.apply(Math, et([], N(e), !1)), o = Math.max.apply(Math, et([], N(r), !1)), s = i - n, l = o - a;
  return {
    left: n,
    top: a,
    right: i,
    bottom: o,
    width: s,
    height: l
  };
}
function dl(t, e, r, n) {
  var a = Dr(t, e, r, n);
  return ke(a);
}
function pv(t, e, r, n, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, u = dc(o), c = u.offsetWidth, f = u.offsetHeight, d = r.getBoundingClientRect(), h = [0, 0];
  r === ur(r) && (h = cc(o, !0));
  for (var v = o.getBoundingClientRect(), m = v.left - d.left + r.scrollLeft - (r.clientLeft || 0) + h[0], x = v.top - d.top + r.scrollTop - (r.clientTop || 0) + h[1], y = v.width, C = v.height, w = Ea(n, a, l), D = dl(w, c, f, n), M = D.left, E = D.top, k = D.width, T = D.height, g = Wt(w, s, n), _ = gt(g, [M, E]), j = [
    m + _[0] * y / k,
    x + _[1] * C / T
  ], R = [0, 0], P = 0; ++P < 10; ) {
    var z = je(a, n);
    i = N(gt(Wt(z, j, n), Wt(z, g, n)), 2), R[0] = i[0], R[1] = i[1];
    var B = Ea(n, a, Sr(R, n), l), Y = dl(B, c, f, n), H = Y.left, L = Y.top, $ = H - m, Z = L - x;
    if (q($) < 2 && q(Z) < 2)
      break;
    j[0] -= $, j[1] -= Z;
  }
  return R.map(function(F) {
    return Math.round(F);
  });
}
function hv(t, e, r) {
  var n = t.length === 16, a = n ? 4 : 3, i = e.map(function(l) {
    return Wt(t, l, a);
  }), o = r.left, s = r.top;
  return i.map(function(l) {
    return [l[0] + o, l[1] + s];
  });
}
function _e(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
}
function fc(t, e) {
  return _e([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function dn(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = Vt(t, e));
  var a = fc(t, e);
  return {
    transform: "translateY(-50%) translate(".concat(t[0], "px, ").concat(t[1], "px) rotate(").concat(n, "rad) scaleY(").concat(r, ")"),
    width: "".concat(a, "px")
  };
}
function Pa(t, e) {
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
function wr(t, e) {
  var r = t[e];
  return ye(r) ? O(O({}, t), r) : t;
}
function dc(t) {
  var e = t && !ho(t.offsetWidth), r = 0, n = 0, a = 0, i = 0, o = 0, s = 0, l = 0, u = 0, c = 0, f = 0, d = 0, h = 0, v = 1 / 0, m = 1 / 0, x = 1 / 0, y = 1 / 0, C = 0, w = 0, D = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var M = t.getBBox();
      D = !0, r = M.width, n = M.height, o = r, s = n, l = r, u = n, a = r, i = n;
    } else {
      var E = me(t), k = t.style, T = E("boxSizing") === "border-box", g = parseFloat(E("borderLeftWidth")) || 0, _ = parseFloat(E("borderRightWidth")) || 0, j = parseFloat(E("borderTopWidth")) || 0, R = parseFloat(E("borderBottomWidth")) || 0, P = parseFloat(E("paddingLeft")) || 0, z = parseFloat(E("paddingRight")) || 0, B = parseFloat(E("paddingTop")) || 0, Y = parseFloat(E("paddingBottom")) || 0, H = P + z, L = B + Y, $ = g + _, Z = j + R, F = H + $, rt = L + Z, at = E("position"), Q = 0, nt = 0;
      if ("clientLeft" in t) {
        var J = null;
        if (at === "absolute") {
          var st = kn(t, ur(t));
          J = st.offsetParent;
        } else
          J = t.parentElement;
        if (J) {
          var dt = me(J);
          Q = parseFloat(dt("width")), nt = parseFloat(dt("height"));
        }
      }
      c = Math.max(H, jt(E("minWidth"), Q) || 0), f = Math.max(L, jt(E("minHeight"), nt) || 0), v = jt(E("maxWidth"), Q), m = jt(E("maxHeight"), nt), isNaN(v) && (v = 1 / 0), isNaN(m) && (m = 1 / 0), C = jt(k.width, 0) || 0, w = jt(k.height, 0) || 0, o = parseFloat(E("width")) || 0, s = parseFloat(E("height")) || 0, l = q(o - C) < 1 ? wa(c, C || o, v) : o, u = q(s - w) < 1 ? wa(f, w || s, m) : s, r = l, n = u, a = l, i = u, T ? (x = v, y = m, d = c, h = f, l = r - F, u = n - rt) : (x = v + F, y = m + rt, d = c + F, h = f + rt, r = l + F, n = u + rt), a = l + H, i = u + L;
    }
  return {
    svg: D,
    offsetWidth: r,
    offsetHeight: n,
    clientWidth: a,
    clientHeight: i,
    contentWidth: l,
    contentHeight: u,
    inlineCSSWidth: C,
    inlineCSSHeight: w,
    cssWidth: o,
    cssHeight: s,
    minWidth: c,
    minHeight: f,
    maxWidth: v,
    maxHeight: m,
    minOffsetWidth: d,
    minOffsetHeight: h,
    maxOffsetWidth: x,
    maxOffsetHeight: y
  };
}
function pc(t, e) {
  return Vt(e > 0 ? t[0] : t[1], e > 0 ? t[1] : t[0]);
}
function oa() {
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
function hc(t, e) {
  var r = t === ur(t) || t === yo(t), n = {
    clientLeft: t.clientLeft,
    clientTop: t.clientTop,
    clientWidth: t.clientWidth,
    clientHeight: t.clientHeight,
    scrollWidth: t.scrollWidth,
    scrollHeight: t.scrollHeight,
    overflow: !1
  };
  return r && (n.clientHeight = Math.max(e.height, n.clientHeight), n.scrollHeight = Math.max(e.height, n.scrollHeight)), n.overflow = me(t)("overflow") !== "visible", O(O({}, e), n);
}
function bi(t, e, r, n) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, u = e.left, c = {
    left: u + a,
    top: l + o,
    right: u + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return r && n ? hc(r, c) : c;
}
function xn(t, e) {
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
  return t && e ? hc(t, s) : s;
}
function vv(t) {
  var e = t.props, r = e.groupable, n = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !r && s && n ? Wo(n, i, o) : l;
}
function vc(t, e, r, n) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = r.target;
    a = gc(i, n);
  }
  return a;
}
function gc(t, e) {
  if (t) {
    var r = t.getAttribute("data-rotation") || "", n = t.getAttribute("data-direction");
    if (e.deg = r, !!n) {
      var a = [0, 0];
      return n.indexOf("w") > -1 && (a[0] = -1), n.indexOf("e") > -1 && (a[0] = 1), n.indexOf("n") > -1 && (a[1] = -1), n.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function Ao(t, e) {
  return [
    Pt(e, t[0]),
    Pt(e, t[1]),
    Pt(e, t[2]),
    Pt(e, t[3])
  ];
}
function Te(t) {
  var e = t.left, r = t.top, n = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return Ao([n, a, i, o], [e, r]);
}
function eo(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(r) {
    r.unset && r.unset(t);
  });
}
function Gr(t, e) {
  var r = e ? "controlGesto" : "targetGesto", n = t[r];
  (n == null ? void 0 : n.isIdle()) === !1 && eo(t, e), n == null || n.unset(), t[r] = null;
}
function de(t, e) {
  if (e) {
    var r = Jr(e);
    r.nextStyle = O(O({}, r.nextStyle), t);
  }
  return {
    style: t,
    cssText: Kr(t).map(function(n) {
      return "".concat(Gd(n, "-"), ": ").concat(t[n], ";");
    }).join("")
  };
}
function mc(t, e, r) {
  var n = e.afterTransform || e.transform;
  return O(O({}, de(O(O(O({}, t.style), e.style), { transform: n }), r)), { afterTransform: n, transform: t.transform });
}
function Et(t, e, r, n) {
  var a = e.datas;
  a.datas || (a.datas = {});
  var i = O(O({}, r), { target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, moveable: t, datas: a.datas, isRequest: e.isRequest, isRequestChild: e.isRequestChild, isFirstDrag: !!e.isFirstDrag, isTrusted: e.isTrusted !== !1, stopAble: function() {
    a.isEventStart = !1;
  }, stopDrag: function() {
    var o;
    (o = e.stop) === null || o === void 0 || o.call(e);
  } });
  return a.isStartEvent ? n || (a.lastEvent = i) : a.isStartEvent = !0, i;
}
function Se(t, e, r) {
  var n = e.datas, a = "isDrag" in r ? r.isDrag : e.isDrag;
  return n.datas || (n.datas = {}), O(O({ isDrag: a }, r), { moveable: t, target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, lastEvent: n.lastEvent, isDouble: e.isDouble, datas: n.datas, isFirstDrag: !!e.isFirstDrag });
}
function qa(t, e, r) {
  t._emitter.on(e, r);
}
function ut(t, e, r, n, a) {
  return t.triggerEvent(e, r, n, a);
}
function Bo(t, e) {
  return De(t).getComputedStyle(t, e);
}
function sa(t, e, r) {
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
function ro(t, e) {
  return t === e || t == null && e == null;
}
function pl() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var r = t.length - 1, n = 0; n < r; ++n) {
    var a = t[n];
    if (!ho(a))
      return a;
  }
  return t[r];
}
function xc(t, e) {
  var r = [], n = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n.indexOf(o), l = r[s] || [];
    s === -1 && (n.push(o), r.push(l)), l.push(a);
  }), r;
}
function gv(t, e) {
  var r = [], n = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n[o];
    s || (s = [], n[o] = s, r.push(s)), s.push(a);
  }), r;
}
function yc(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function $r() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return t.sort(function(r, n) {
    return q(n) - q(r);
  }), t[0];
}
function qr(t, e, r) {
  return le(je(t, r), br(e, r), r);
}
function mv(t, e) {
  var r, n = t.is3d, a = t.rootMatrix, i = n ? 4 : 3;
  return r = N(qr(a, [e.distX, e.distY], i), 2), e.distX = r[0], e.distY = r[1], e;
}
function Ee(t, e, r, n) {
  if (!r[0] && !r[1])
    return e;
  var a = Wt(t, [ul(r[0] || 1), 0], n), i = Wt(t, [0, ul(r[1] || 1)], n), o = Wt(t, [
    r[0] / _e(a),
    r[1] / _e(i)
  ], n);
  return Pt(e, o);
}
function Re(t, e, r) {
  return r ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function Oa(t) {
  return q(t) <= pe ? 0 : t;
}
function Go(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var r = oh(e, t), n = r.deg;
    return n ? vt("view-control-rotation".concat(n)) : "";
  };
}
function Fo(t, e) {
  return e === void 0 && (e = [t]), function(r, n) {
    if (n.isRequest)
      return e.some(function(i) {
        return n.requestAble === i;
      }) ? n.parentDirection : !1;
    var a = n.inputEvent.target;
    return te(a, vt("direction")) && (!t || te(a, vt(t)));
  };
}
function xv(t, e, r) {
  var n, a = Yr(t, {
    "x%": function(M) {
      return M / 100 * e.offsetWidth;
    },
    "y%": function(M) {
      return M / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, r < 0 ? void 0 : r), o = t.slice(0, r < 0 ? void 0 : r + 1), s = t[r] || "", l = r < 0 ? [] : t.slice(r), u = r < 0 ? [] : t.slice(r + 1), c = a.slice(0, r < 0 ? void 0 : r), f = a.slice(0, r < 0 ? void 0 : r + 1), d = (n = a[r]) !== null && n !== void 0 ? n : Yr([""])[0], h = r < 0 ? [] : a.slice(r), v = r < 0 ? [] : a.slice(r + 1), m = d ? [d] : [], x = Or(c), y = Or(f), C = Or(h), w = Or(v), D = zt(x, C, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: x,
    beforeFunctionMatrix2: y,
    targetFunctionMatrix: Or(m),
    afterFunctionMatrix: C,
    afterFunctionMatrix2: w,
    allFunctionMatrix: D,
    beforeFunctions: c,
    beforeFunctions2: f,
    targetFunction: m[0],
    afterFunctions: h,
    afterFunctions2: v,
    beforeFunctionTexts: i,
    beforeFunctionTexts2: o,
    targetFunctionText: s,
    afterFunctionTexts: l,
    afterFunctionTexts2: u
  };
}
function yv(t) {
  return !t || !ye(t) || En(t) ? !1 : qt(t) || "length" in t;
}
function He(t, e) {
  return t ? En(t) ? t : Me(t) ? e ? document.querySelector(t) : t : Ba(t) ? t() : gu(t) ? t : "current" in t ? t.current : t : null;
}
function Lo(t, e) {
  if (!t)
    return [];
  var r = yv(t) ? [].slice.call(t) : [t];
  return r.reduce(function(n, a) {
    return Me(a) && e ? et(et([], N(n), !1), N([].slice.call(document.querySelectorAll(a))), !1) : (qt(a) ? n.push(Lo(a, e)) : n.push(He(a, e)), n);
  }, []);
}
function bv(t, e, r) {
  var n = Vt(t, e) / Math.PI * 180;
  return n = r >= 0 ? n : 180 - n, n = n >= 0 ? n : 360 + n, n;
}
function hl(t, e) {
  var r = t.rootMatrix, n = t.is3d, a = n ? 4 : 3, i = je(r, a);
  return n || (i = ze(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, ma(i, e);
}
function bc(t, e, r, n, a) {
  var i = N(t, 2), o = i[0], s = i[1], l = 0, u = 0;
  if (a && o && s) {
    var c = Vt([0, 0], e), f = Vt([0, 0], n), d = _e(e), h = Math.cos(c - f) * d;
    if (!n[0])
      u = h, l = u * r;
    else if (!n[1])
      l = h, u = l / r;
    else {
      var v = n[0] * o, m = n[1] * s, x = Math.atan2(v + e[0], m + e[1]), y = Math.atan2(v, m);
      x < 0 && (x += Math.PI * 2), y < 0 && (y += Math.PI * 2);
      var C = 0;
      q(x - y) < Math.PI / 2 || q(x - y) > Math.PI / 2 * 3 || (y += Math.PI), C = x - y, C > Math.PI * 2 ? C -= Math.PI * 2 : C > Math.PI ? C = 2 * Math.PI - C : C < -Math.PI && (C = -2 * Math.PI - C);
      var w = _e([v + e[0], m + e[1]]) * Math.cos(C);
      l = w * Math.sin(y) - v, u = w * Math.cos(y) - m, n[0] < 0 && (l *= -1), n[1] < 0 && (u *= -1);
    }
  } else
    l = n[0] * e[0], u = n[1] * e[1];
  return [l, u];
}
function Sc(t, e, r, n) {
  var a, i = r.ratio, o = r.startOffsetWidth, s = r.startOffsetHeight, l = 0, u = 0, c = n.distX, f = n.distY, d = n.pinchScale, h = n.parentDistance, v = n.parentDist, m = n.parentScale, x = r.fixedDirection, y = [0, 1].map(function(k) {
    return q(t[k] - x[k]);
  }), C = [0, 1].map(function(k) {
    var T = y[k];
    return T !== 0 && (T = 2 / T), T;
  });
  if (v)
    l = v[0], u = v[1], e && (l ? u || (u = l / i) : l = u * i);
  else if (Cn(d))
    l = (d - 1) * o, u = (d - 1) * s;
  else if (m)
    l = (m[0] - 1) * o, u = (m[1] - 1) * s;
  else if (h) {
    var w = o * y[0], D = s * y[1], M = _e([w, D]);
    l = h / M * w * C[0], u = h / M * D * C[1];
  } else {
    var E = $e({ datas: r, distX: c, distY: f });
    E = C.map(function(k, T) {
      return E[T] * k;
    }), a = N(bc([o, s], E, i, t, e), 2), l = a[0], u = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: u
  };
}
function no(t, e) {
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
    var r = N(t.split(" "), 2), n = r[0], a = r[1], i = no(n || ""), o = no(a || ""), s = O(O({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function Wo(t, e, r) {
  var n = no(t, !0), a = n.x, i = n.y;
  return [
    jt(a, e) || 0,
    jt(i, r) || 0
  ];
}
function Sv(t, e, r) {
  var n = t.map(function(i) {
    return gt(i, e);
  }), a = n.map(function(i) {
    return Mn(i, r);
  });
  return {
    prev: n,
    next: a,
    result: a.map(function(i) {
      return Pt(i, e);
    })
  };
}
function Cc(t, e) {
  return t.length === e.length && t.every(function(r, n) {
    var a = e[n], i = qt(r), o = qt(a);
    return i && o ? Cc(r, a) : !i && !o ? r === a : !1;
  });
}
function Fr(t, e, r, n, a) {
  var i = t._store, o = i[e];
  if (!(e in i))
    if (a != null)
      i[e] = a, o = a;
    else
      return i[e] = r, r;
  return o === r || n(o) === n(r) ? o : (i[e] = r, r);
}
function fe(t) {
  return t >= 0 ? 1 : -1;
}
function q(t) {
  return Math.abs(t);
}
function Si(t, e) {
  return Yd(t).map(function(r) {
    return e(r);
  });
}
function wc(t) {
  return Cn(t) ? {
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
var Cv = Rn("pinchable", {
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
    var h = ut(t, u, d);
    r.isPinch = h !== !1, r.ables = f;
    var v = r.isPinch;
    return v ? (f.forEach(function(m) {
      if (i[m.name] = i[m.name] || {}, !!m[c]) {
        var x = O(O({}, e), { datas: i[m.name], parentRotate: a, isPinch: !0 });
        m[c](t, x);
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
      ut(t, f, c);
      var d = r.ables, h = "drag".concat(s ? "Group" : "", "Control");
      return d.forEach(function(v) {
        v[h] && v[h](t, O(O({}, e), { datas: i[v.name], inputEvent: o, resolveMatrix: !0, pinchScale: n, parentDistance: u, parentRotate: l, isPinch: !0 }));
      }), c;
    }
  },
  pinchEnd: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.targets, o = e.originalDatas;
    if (r.isPinch) {
      var s = "onPinch".concat(i ? "Group" : "", "End"), l = Se(t, e, { isDrag: n });
      i && (l.targets = i), ut(t, s, l);
      var u = r.ables, c = "drag".concat(i ? "Group" : "", "ControlEnd");
      return u.forEach(function(f) {
        f[c] && f[c](t, O(O({}, e), { isDrag: n, datas: o[f.name], inputEvent: a, isPinch: !0 }));
      }), n;
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
}), vl = Fo("scalable"), wv = {
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
  render: Yu("scalable"),
  dragControlCondition: vl,
  viewClassName: Go("scalable"),
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = vc(i, n, a, r), s = t.state, l = s.width, u = s.height, c = s.targetTransform, f = s.target, d = s.pos1, h = s.pos2, v = s.pos4;
    if (!o || !f)
      return !1;
    n || Er(t, e), r.datas = {}, r.transform = c, r.prevDist = [1, 1], r.direction = o, r.startOffsetWidth = l, r.startOffsetHeight = u, r.startValue = [1, 1];
    var m = !o[0] && !o[1] || o[0] || !o[1];
    Wa(t, e, "scale"), r.isWidth = m;
    function x(E) {
      r.ratio = E && isFinite(E) ? E : 0;
    }
    r.startPositions = Te(t.state);
    function y(E) {
      var k = ec(r.startPositions, E);
      r.fixedDirection = k.fixedDirection, r.fixedPosition = k.fixedPosition, r.fixedOffset = k.fixedOffset;
    }
    r.setFixedDirection = y, x(Xe(d, h) / Xe(h, v)), y([-o[0], -o[1]]);
    var C = function(E) {
      r.minScaleSize = E;
    }, w = function(E) {
      r.maxScaleSize = E;
    };
    C([-1 / 0, -1 / 0]), w([1 / 0, 1 / 0]);
    var D = Et(t, e, O(O({ direction: o, set: function(E) {
      r.startValue = E;
    }, setRatio: x, setFixedDirection: y, setMinScaleSize: C, setMaxScaleSize: w }, La(t, e)), { dragStart: ce.dragStart(t, new Xr().dragStart([0, 0], e)) })), M = ut(t, "onScaleStart", D);
    return r.startFixedDirection = r.fixedDirection, M !== !1 && (r.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), r.isScale ? D : !1;
  },
  dragControl: function(t, e) {
    Ga(t, e, "scale");
    var r = e.datas, n = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, u = e.resolveMatrix, c = r.prevDist, f = r.direction, d = r.startOffsetWidth, h = r.startOffsetHeight, v = r.isScale, m = r.startValue, x = r.isWidth, y = r.ratio;
    if (!v)
      return !1;
    var C = t.props, w = C.throttleScale, D = C.parentMoveable, M = f;
    !f[0] && !f[1] && (M = [1, 1]);
    var E = y && (n ?? C.keepRatio) || !1, k = t.state, T = [
      m[0],
      m[1]
    ];
    function g() {
      var K = Sc(M, E, r, e), ct = K.distWidth, wt = K.distHeight, xt = d ? (d + ct) / d : 1, pt = h ? (h + wt) / h : 1;
      m[0] || (T[0] = ct / d), m[1] || (T[1] = wt / h);
      var bt = (M[0] || E ? xt : 1) * T[0], St = (M[1] || E ? pt : 1) * T[1];
      return bt === 0 && (bt = fe(c[0]) * ra), St === 0 && (St = fe(c[1]) * ra), [bt, St];
    }
    var _ = g();
    if (!i && t.props.groupable) {
      var j = k.snapRenderInfo || {}, R = j.direction;
      qt(R) && (R[0] || R[1]) && (k.snapRenderInfo = { direction: f, request: e.isRequest });
    }
    ut(t, "onBeforeScale", Et(t, e, {
      scale: _,
      setFixedDirection: function(K) {
        return r.setFixedDirection(K), _ = g(), _;
      },
      startFixedDirection: r.startFixedDirection,
      setScale: function(K) {
        _ = K;
      }
    }, !0));
    var P = [
      _[0] / T[0],
      _[1] / T[1]
    ], z = o, B = [0, 0], Y = fe(P[0] * P[1]), H = !o && !a && i;
    if (H || u ? z = To(t, r.targetAllTransform, [0, 0], [0, 0], r) : o || (z = r.fixedPosition), i || (B = tv(t, P, f, !l && s, r)), E) {
      M[0] && M[1] && B[0] && B[1] && (Math.abs(B[0] * d) > Math.abs(B[1] * h) ? B[1] = 0 : B[0] = 0);
      var L = !B[0] && !B[1];
      if (L && (x ? P[0] = Ct(P[0] * T[0], w) / T[0] : P[1] = Ct(P[1] * T[1], w) / T[1]), M[0] && !M[1] || B[0] && !B[1] || L && x) {
        P[0] += B[0];
        var $ = d * P[0] * T[0] / y;
        P[1] = fe(Y * P[0]) * q($ / h / T[1]);
      } else if (!M[0] && M[1] || !B[0] && B[1] || L && !x) {
        P[1] += B[1];
        var Z = h * P[1] * T[1] * y;
        P[0] = fe(Y * P[1]) * q(Z / d / T[0]);
      }
    } else
      P[0] += B[0], P[1] += B[1], B[0] || (P[0] = Ct(P[0] * T[0], w) / T[0]), B[1] || (P[1] = Ct(P[1] * T[1], w) / T[1]);
    P[0] === 0 && (P[0] = fe(c[0]) * ra), P[1] === 0 && (P[1] = fe(c[1]) * ra), _ = av(P, [T[0], T[1]]);
    var F = [
      d,
      h
    ], rt = [
      d * _[0],
      h * _[1]
    ];
    rt = mo(rt, r.minScaleSize, r.maxScaleSize, E ? y : !1), _ = Si(2, function(K) {
      return F[K] ? rt[K] / F[K] : rt[K];
    }), P = Si(2, function(K) {
      return _[K] / T[K];
    });
    var at = Si(2, function(K) {
      return c[K] ? P[K] / c[K] : P[K];
    }), Q = "scale(".concat(P.join(", "), ")"), nt = "scale(".concat(_.join(", "), ")"), J = Fa(r, nt, Q), st = !m[0] || !m[1], dt = th(t, st ? nt : Q, r.fixedDirection, z, r.fixedOffset, r, st), yt = H ? dt : gt(dt, r.prevInverseDist || [0, 0]);
    if (r.prevDist = P, r.prevInverseDist = dt, _[0] === c[0] && _[1] === c[1] && yt.every(function(K) {
      return !K;
    }) && !D && !H)
      return !1;
    var ft = Et(t, e, O({ offsetWidth: d, offsetHeight: h, direction: f, scale: _, dist: P, delta: at, isPinch: !!i }, Au(t, J, yt, i, e)));
    return ut(t, "onScale", ft), ft;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (!r.isScale)
      return !1;
    r.isScale = !1;
    var n = Se(t, e, {});
    return ut(t, "onScaleEnd", n), n;
  },
  dragGroupControlCondition: vl,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var a = Ne(t, "resizable", e);
    r.moveableScale = t.scale;
    var i = Ze(t, this, "dragControlStart", e, function(u, c) {
      return _a(t, u, r, c);
    }), o = function(u) {
      n.setFixedDirection(u), i.forEach(function(c, f) {
        c.setFixedDirection(u), _a(t, c.moveable, r, a[f]);
      });
    };
    r.setFixedDirection = o;
    var s = O(O({}, n), { targets: t.props.targets, events: i, setFixedDirection: o }), l = ut(t, "onScaleGroupStart", s);
    return r.isScale = l !== !1, r.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isScale) {
      qa(t, "onBeforeScale", function(c) {
        ut(t, "onBeforeScaleGroup", Et(t, e, O(O({}, c), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = n.dist, i = r.moveableScale;
        t.scale = [
          a[0] * i[0],
          a[1] * i[1]
        ];
        var o = t.props.keepRatio, s = r.fixedPosition, l = Ze(t, this, "dragControl", e, function(c, f) {
          var d = N(le(_n(t.rotation / 180 * Math.PI, 3), [
            f.datas.originalX * a[0],
            f.datas.originalY * a[1],
            1
          ], 3), 2), h = d[0], v = d[1];
          return O(O({}, f), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: Pt(s, [h, v])
          });
        }), u = O({ targets: t.props.targets, events: l }, n);
        return ut(t, "onScaleGroup", u), u;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isScale) {
      this.dragControlEnd(t, e);
      var a = Ze(t, this, "dragControlEnd", e), i = Se(t, e, {
        targets: t.props.targets,
        events: a
      });
      return ut(t, "onScaleGroupEnd", i), r;
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
function rr(t, e) {
  return t.map(function(r, n) {
    return Ca(r, e[n], 1, 2);
  });
}
function gl(t, e, r) {
  var n = Vt(t, e), a = Vt(t, r), i = a - n;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function Ev(t, e) {
  var r = gl(t[0], t[1], t[2]), n = gl(e[0], e[1], e[2]), a = Math.PI;
  return !(r >= a && n <= a || r <= a && n >= a);
}
var Dv = {
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
  viewClassName: Go("warpable"),
  render: function(t, e) {
    var r = t.props, n = r.resizable, a = r.scalable, i = r.warpable, o = r.zoom;
    if (n || a || !i)
      return [];
    var s = t.state, l = s.pos1, u = s.pos2, c = s.pos3, f = s.pos4, d = rr(l, u), h = rr(u, l), v = rr(l, c), m = rr(c, l), x = rr(c, f), y = rr(f, c), C = rr(u, f), w = rr(f, u);
    return et([
      e.createElement("div", { className: vt("line"), key: "middeLine1", style: dn(d, x, o) }),
      e.createElement("div", { className: vt("line"), key: "middeLine2", style: dn(h, y, o) }),
      e.createElement("div", { className: vt("line"), key: "middeLine3", style: dn(v, C, o) }),
      e.createElement("div", { className: vt("line"), key: "middeLine4", style: dn(m, w, o) })
    ], N(Xu(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var r = e.inputEvent.target;
    return te(r, vt("direction")) && te(r, vt("warpable"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.inputEvent, a = t.props.target, i = n.target, o = gc(i, r);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, u = s.is3d, c = s.targetTransform, f = s.targetMatrix, d = s.width, h = s.height, v = s.left, m = s.top;
    r.datas = {}, r.targetTransform = c, r.warpTargetMatrix = u ? f : ze(f, 3, 4), r.targetInverseMatrix = mu(je(r.warpTargetMatrix, 4), 3, 4), r.direction = o, r.left = v, r.top = m, r.poses = [
      [0, 0],
      [d, 0],
      [0, h],
      [d, h]
    ].map(function(C) {
      return gt(C, l);
    }), r.nextPoses = r.poses.map(function(C) {
      var w = N(C, 2), D = w[0], M = w[1];
      return le(r.warpTargetMatrix, [D, M, 0, 1], 4);
    }), r.startValue = Gt(4), r.prevMatrix = Gt(4), r.absolutePoses = Te(s), r.posIndexes = zu(o), Er(t, e), Wa(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var x = Et(t, e, O({ set: function(C) {
      r.startValue = C;
    } }, La(t, e))), y = ut(t, "onWarpStart", x);
    return y !== !1 && (r.isWarp = !0), r.isWarp;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isRequest, a = e.distX, i = e.distY, o = r.targetInverseMatrix, s = r.prevMatrix, l = r.isWarp, u = r.startValue, c = r.poses, f = r.posIndexes, d = r.absolutePoses;
    if (!l)
      return !1;
    if (Ga(t, e, "matrix3d"), Qr(t, "warpable")) {
      var h = f.map(function(g) {
        return d[g];
      });
      h.length > 1 && h.push([
        (h[0][0] + h[1][0]) / 2,
        (h[0][1] + h[1][1]) / 2
      ]);
      var v = Ha(t, n, {
        horizontal: h.map(function(g) {
          return g[1] + i;
        }),
        vertical: h.map(function(g) {
          return g[0] + a;
        })
      }), m = v.horizontal, x = v.vertical;
      i -= m.offset, a -= x.offset;
    }
    var y = $e({ datas: r, distX: a, distY: i }, !0), C = r.nextPoses.slice();
    if (f.forEach(function(g) {
      C[g] = Pt(C[g], y);
    }), !Yp.every(function(g) {
      return Ev(g.map(function(_) {
        return c[_];
      }), g.map(function(_) {
        return C[_];
      }));
    }))
      return !1;
    var w = So(c[0], c[2], c[1], c[3], C[0], C[2], C[1], C[3]);
    if (!w.length)
      return !1;
    var D = zt(o, w, 4), M = Nu(r, D, !0), E = zt(je(s, 4), M, 4);
    r.prevMatrix = M;
    var k = zt(u, M, 4), T = Fa(r, "matrix3d(".concat(k.join(", "), ")"), "matrix3d(".concat(M.join(", "), ")"));
    return _o(e, T), ut(t, "onWarp", Et(t, e, O({ delta: E, matrix: k, dist: M, multiply: zt, transform: T }, de({
      transform: T
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.isDrag;
    return r.isWarp ? (r.isWarp = !1, ut(t, "onWarpEnd", Se(t, e, {})), n) : !1;
  }
}, kv = /* @__PURE__ */ vt("area-pieces"), la = /* @__PURE__ */ vt("area-piece"), Ec = /* @__PURE__ */ vt("avoid"), Mv = vt("view-dragging");
function Ci(t) {
  var e = t.areaElement;
  if (e) {
    var r = t.state, n = r.width, a = r.height;
    vu(e, Ec), e.style.cssText += "left: 0px; top: 0px; width: ".concat(n, "px; height: ").concat(a, "px");
  }
}
function ml(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: kv },
    t.createElement("div", { className: la }),
    t.createElement("div", { className: la }),
    t.createElement("div", { className: la }),
    t.createElement("div", { className: la })
  );
}
var Dc = {
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
    var r = t.props, n = r.target, a = r.dragArea, i = r.groupable, o = r.passDragArea, s = t.getState(), l = s.width, u = s.height, c = s.renderPoses, f = o ? vt("area", "pass") : vt("area");
    if (i)
      return [
        e.createElement("div", { key: "area", ref: ir(t, "areaElement"), className: f }),
        ml(e)
      ];
    if (!n || !a)
      return [];
    var d = So([0, 0], [l, 0], [0, u], [l, u], c[0], c[1], c[2], c[3]), h = d.length ? $a(d, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: ir(t, "areaElement"), className: f, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(u, "px"),
        transformOrigin: "0 0",
        transform: h
      } }),
      ml(e)
    ];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    r.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, u = s.renderPoses, c = s.rootMatrix, f = s.is3d, d = l.left, h = l.top, v = ke(u), m = v.left, x = v.top, y = v.width, C = v.height, w = f ? 4 : 3, D = N(qr(c, [n - d, a - h], w), 2), M = D[0], E = D[1];
    M -= m, E -= x;
    var k = [
      { left: m, top: x, width: y, height: E - 10 },
      { left: m, top: x, width: M - 10, height: C },
      { left: m, top: x + E + 10, width: y, height: C - E - 10 },
      { left: m + M + 10, top: x, width: y - M - 10, height: C }
    ], T = [].slice.call(o.nextElementSibling.children);
    k.forEach(function(g, _) {
      T[_].style.cssText = "left: ".concat(g.left, "px;top: ").concat(g.top, "px; width: ").concat(g.width, "px; height: ").concat(g.height, "px;");
    }), xo(o, Ec), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var r = e.datas, n = e.inputEvent;
    if (this.enableNativeEvent(t), !n)
      return !1;
    r.isDragArea || (r.isDragArea = !0, Ci(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var r = e.inputEvent, n = e.datas;
    if (!r)
      return !1;
    n.isDragArea || Ci(t);
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
    Ci(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && hu(function() {
      e.disableNativeEvent = !1;
    });
  }
}, _v = Rn("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var r = t.props, n = r.zoom, a = r.svgOrigin, i = r.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, u = o.svg, c = o.allMatrix, f = o.is3d, d = o.left, h = o.top, v = o.offsetWidth, m = o.offsetHeight, x;
    if (!i && u && a) {
      var y = N(Wo(a, v, m), 2), C = y[0], w = y[1], D = f ? 4 : 3, M = Wt(c, [C, w], D);
      x = Pa(l, n, gt(M, [d, h]));
    } else
      x = Pa(l, n, s);
    return [
      e.createElement("div", { className: vt("control", "origin"), style: x, key: "beforeOrigin" })
    ];
  }
});
function Tv(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var Iv = {
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
    var r = t.props, n = r.scrollContainer, a = n === void 0 ? t.getContainer() : n, i = r.scrollOptions, o = new Cu(), s = He(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", u = e.targets;
    o.on("scroll", function(c) {
      var f = c.container, d = c.direction, h = Et(t, e, {
        scrollContainer: f,
        direction: d
      }), v = u ? "onScrollGroup" : "onScroll";
      u && (h.targets = u), ut(t, v, h);
    }).on("move", function(c) {
      var f = c.offsetX, d = c.offsetY, h = c.inputEvent;
      t[l].scrollBy(f, d, h.inputEvent, !1);
    }).on("scrollDrag", function(c) {
      var f = c.next;
      f(t[l].getCurrentEvent());
    }), o.dragStart(e, O({ container: s }, i));
  },
  checkScroll: function(t, e) {
    var r = e.datas.dragScroll;
    if (r) {
      var n = t.props, a = n.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = n.scrollThreshold, s = o === void 0 ? 0 : o, l = n.scrollThrottleTime, u = l === void 0 ? 0 : l, c = n.getScrollPosition, f = c === void 0 ? Tv : c, d = n.scrollOptions;
      return r.drag(e, O({ container: i, threshold: s, throttleTime: u, getScrollPosition: function(h) {
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
    var e, r = t.state;
    (e = r.dragScroll) === null || e === void 0 || e.dragEnd(), r.dragScroll = null;
  }
}, kc = {
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
}, Rv = Rn("padding", {
  props: ["padding"],
  render: function(t, e) {
    var r = t.props;
    if (r.dragArea)
      return [];
    var n = wc(r.padding || {}), a = n.left, i = n.top, o = n.right, s = n.bottom, l = t.getState(), u = l.renderPoses, c = l.pos1, f = l.pos2, d = l.pos3, h = l.pos4, v = [c, f, d, h], m = [];
    return a > 0 && m.push([0, 2]), i > 0 && m.push([0, 1]), o > 0 && m.push([1, 3]), s > 0 && m.push([2, 3]), m.map(function(x, y) {
      var C = N(x, 2), w = C[0], D = C[1], M = v[w], E = v[D], k = u[w], T = u[D], g = So([0, 0], [100, 0], [0, 100], [100, 100], M, E, k, T);
      if (g.length)
        return e.createElement("div", { key: "padding".concat(y), className: vt("padding"), style: {
          transform: $a(g, !0)
        } });
    });
  }
}), xl = ["nw", "ne", "se", "sw"];
function ua(t, e) {
  var r = t[0] + t[1], n = r > e ? e / r : 1;
  return t[0] *= n, t[1] = e - t[1] * n, t;
}
var Pv = [1, 2, 5, 6], Ov = [0, 3, 4, 7], vr = [1, -1, -1, 1], gr = [1, 1, -1, -1];
function Yo(t, e, r, n, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = r), s === void 0 && (s = n);
  var l = [], u = !1, c = t.filter(function(d) {
    return !d.virtual;
  }), f = c.map(function(d) {
    var h = d.horizontal, v = d.vertical, m = d.pos;
    if (v && !u && (u = !0, l.push("/")), u) {
      var x = Math.max(0, v === 1 ? m[1] - i : s - m[1]);
      return l.push(Re(x, n, e)), x;
    } else {
      var x = Math.max(0, h === 1 ? m[0] - a : o - m[0]);
      return l.push(Re(x, r, e)), x;
    }
  });
  return {
    radiusPoses: c,
    styles: l,
    raws: f
  };
}
function Mc(t) {
  for (var e = [0, 0], r = [0, 0], n = t.length, a = 0; a < n; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, r[0] = a + 1), i.vertical && (r[1] === 0 && (r[0] = a), r[1] = a - r[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: r
  };
}
function _c(t, e, r, n, a, i, o) {
  var s, l, u, c;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var f = t.indexOf("/"), d = (f > -1 ? t.slice(0, f) : t).length, h = t.slice(0, d), v = t.slice(d + 1), m = h.length, x = v.length, y = x > 0, C = N(h, 4), w = C[0], D = w === void 0 ? "0px" : w, M = C[1], E = M === void 0 ? D : M, k = C[2], T = k === void 0 ? D : k, g = C[3], _ = g === void 0 ? E : g, j = N(v, 4), R = j[0], P = R === void 0 ? D : R, z = j[1], B = z === void 0 ? y ? P : E : z, Y = j[2], H = Y === void 0 ? y ? P : T : Y, L = j[3], $ = L === void 0 ? y ? B : _ : L, Z = [D, E, T, _].map(function(J) {
    return jt(J, e);
  }), F = [P, B, H, $].map(function(J) {
    return jt(J, r);
  }), rt = Z.slice(), at = F.slice();
  s = N(ua([rt[0], rt[1]], e), 2), rt[0] = s[0], rt[1] = s[1], l = N(ua([rt[3], rt[2]], e), 2), rt[3] = l[0], rt[2] = l[1], u = N(ua([at[0], at[3]], r), 2), at[0] = u[0], at[3] = u[1], c = N(ua([at[1], at[2]], r), 2), at[1] = c[0], at[2] = c[1];
  var Q = o ? rt : rt.slice(0, Math.max(i[0], m)), nt = o ? at : at.slice(0, Math.max(i[1], x));
  return et(et([], N(Q.map(function(J, st) {
    var dt = xl[st];
    return {
      virtual: st >= m,
      horizontal: vr[st],
      vertical: 0,
      pos: [n + J, a + (gr[st] === -1 ? r : 0)],
      sub: !0,
      raw: Z[st],
      direction: dt
    };
  })), !1), N(nt.map(function(J, st) {
    var dt = xl[st];
    return {
      virtual: st >= x,
      horizontal: 0,
      vertical: gr[st],
      pos: [n + (vr[st] === -1 ? e : 0), a + J],
      sub: !0,
      raw: F[st],
      direction: dt
    };
  })), !1);
}
function Nv(t, e, r, n, a) {
  a === void 0 && (a = e.length);
  var i = Mc(t.slice(n)), o = i.horizontalRange, s = i.verticalRange, l = r - n, u = 0;
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
function jv(t, e, r, n, a, i, o, s, l, u, c) {
  u === void 0 && (u = 0), c === void 0 && (c = 0);
  var f = Mc(t.slice(r)), d = f.horizontalRange, h = f.verticalRange;
  if (n > -1)
    for (var v = vr[n] === 1 ? i - u : s - i, m = d[1]; m <= n; ++m) {
      var x = gr[m] === 1 ? c : l, y = 0;
      if (n === m ? y = i : m === 0 ? y = u + v : vr[m] === -1 && (y = s - (e[r][0] - u)), t.splice(r + m, 0, {
        horizontal: vr[m],
        vertical: 0,
        pos: [y, x]
      }), e.splice(r + m, 0, [y, x]), m === 0)
        break;
    }
  else if (a > -1) {
    var C = gr[a] === 1 ? o - c : l - o;
    if (d[1] === 0 && h[1] === 0) {
      var w = [
        u + C,
        c
      ];
      t.push({
        horizontal: vr[0],
        vertical: 0,
        pos: w
      }), e.push(w);
    }
    for (var D = h[0], m = h[1]; m <= a; ++m) {
      var y = vr[m] === 1 ? u : s, x = 0;
      if (a === m ? x = o : m === 0 ? x = c + C : gr[m] === 1 ? x = e[r + D][1] : gr[m] === -1 && (x = l - (e[r + D][1] - c)), t.push({
        horizontal: 0,
        vertical: gr[m],
        pos: [y, x]
      }), e.push([y, x]), m === 0)
        break;
    }
  }
}
function zv(t, e) {
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
var Av = [
  [0, -1, "n"],
  [1, 0, "e"]
], Bv = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function Xo(t, e, r) {
  var n = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, u = s.poses, c = l === "rect", f = l === "circle";
  if (l === "polygon")
    return r.map(function(E) {
      return "".concat(Re(E[0], i, n), " ").concat(Re(E[1], o, n));
    });
  if (c || l === "inset") {
    var d = r[1][1], h = r[3][0], v = r[7][0], m = r[5][1];
    if (c)
      return [
        d,
        h,
        m,
        v
      ].map(function(E) {
        return "".concat(E, "px");
      });
    var x = [d, i - h, o - m, v].map(function(E, k) {
      return Re(E, k % 2 ? i : o, n);
    });
    if (r.length > 8) {
      var y = N(gt(r[4], r[0]), 2), C = y[0], w = y[1];
      x.push.apply(x, et(["round"], N(Yo(u.slice(8).map(function(E, k) {
        return O(O({}, E), { pos: r[k] });
      }), n, C, w, v, d, h, m).styles), !1));
    }
    return x;
  } else if (f || l === "ellipse") {
    var D = r[0], M = Re(q(r[1][1] - D[1]), f ? Math.sqrt((i * i + o * o) / 2) : o, n), x = f ? [M] : [Re(q(r[2][0] - D[0]), i, n), M];
    return x.push("at", Re(D[0], i, n), Re(D[1], o, n)), x;
  }
}
function Na(t, e, r, n) {
  var a = [n, (n + e) / 2, e], i = [t, (t + r) / 2, r];
  return Bv.map(function(o) {
    var s = N(o, 3), l = s[0], u = s[1], c = s[2], f = a[l + 1], d = i[u + 1];
    return {
      vertical: q(u),
      horizontal: q(l),
      direction: c,
      pos: [f, d]
    };
  });
}
function Tc(t) {
  var e = [1 / 0, -1 / 0], r = [1 / 0, -1 / 0];
  return t.forEach(function(n) {
    var a = n.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), r[0] = Math.min(r[0], a[1]), r[1] = Math.max(r[1], a[1]);
  }), [
    q(e[1] - e[0]),
    q(r[1] - r[0])
  ];
}
function yl(t, e, r, n, a) {
  var i, o, s, l, u, c, f, d, h;
  if (t) {
    var v = a;
    if (!v) {
      var m = me(t), x = m("clipPath");
      v = x !== "none" ? x : m("clip");
    }
    if (!((!v || v === "none" || v === "auto") && (v = n, !v))) {
      var y = pu(v), C = y.prefix, w = C === void 0 ? v : C, D = y.value, M = D === void 0 ? "" : D, E = w === "circle", k = " ";
      if (w === "polygon") {
        var T = mr(M || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        k = ",";
        var g = T.map(function(Tt) {
          var Yt = N(Tt.split(" "), 2), Xt = Yt[0], Bt = Yt[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              jt(Xt, e),
              jt(Bt, r)
            ]
          };
        }), _ = Cr(g.map(function(Tt) {
          return Tt.pos;
        }));
        return {
          type: w,
          clipText: v,
          poses: g,
          splitter: k,
          left: _.minX,
          right: _.maxX,
          top: _.minY,
          bottom: _.maxY
        };
      } else if (E || w === "ellipse") {
        var j = "", R = "", P = 0, z = 0, T = or(M);
        if (E) {
          var B = "";
          i = N(T, 4), o = i[0], B = o === void 0 ? "50%" : o, s = i[2], j = s === void 0 ? "50%" : s, l = i[3], R = l === void 0 ? "50%" : l, P = jt(B, Math.sqrt((e * e + r * r) / 2)), z = P;
        } else {
          var Y = "", H = "";
          u = N(T, 5), c = u[0], Y = c === void 0 ? "50%" : c, f = u[1], H = f === void 0 ? "50%" : f, d = u[3], j = d === void 0 ? "50%" : d, h = u[4], R = h === void 0 ? "50%" : h, P = jt(Y, e), z = jt(H, r);
        }
        var L = [
          jt(j, e),
          jt(R, r)
        ], g = et([
          {
            vertical: 1,
            horizontal: 1,
            pos: L,
            direction: "nesw"
          }
        ], N(Av.slice(0, E ? 1 : 2).map(function(Xt) {
          return {
            vertical: q(Xt[1]),
            horizontal: Xt[0],
            direction: Xt[2],
            sub: !0,
            pos: [
              L[0] + Xt[0] * P,
              L[1] + Xt[1] * z
            ]
          };
        })), !1);
        return {
          type: w,
          clipText: v,
          radiusX: P,
          radiusY: z,
          left: L[0] - P,
          top: L[1] - z,
          right: L[0] + P,
          bottom: L[1] + z,
          poses: g,
          splitter: k
        };
      } else if (w === "inset") {
        var T = or(M || "0 0 0 0"), $ = T.indexOf("round"), Z = ($ > -1 ? T.slice(0, $) : T).length, F = T.slice(Z + 1), rt = N(T.slice(0, Z), 4), at = rt[0], Q = rt[1], nt = Q === void 0 ? at : Q, J = rt[2], st = J === void 0 ? at : J, dt = rt[3], yt = dt === void 0 ? nt : dt, ft = N([at, st].map(function(Xt) {
          return jt(Xt, r);
        }), 2), K = ft[0], ct = ft[1], wt = N([yt, nt].map(function(Xt) {
          return jt(Xt, e);
        }), 2), xt = wt[0], pt = wt[1], bt = e - pt, St = r - ct, _t = _c(F, bt - xt, St - K, xt, K), g = et(et([], N(Na(K, bt, St, xt)), !1), N(_t), !1);
        return {
          type: "inset",
          clipText: v,
          poses: g,
          top: K,
          left: xt,
          right: bt,
          bottom: St,
          radius: F,
          splitter: k
        };
      } else if (w === "rect") {
        var T = mr(M || "0px, ".concat(e, "px, ").concat(r, "px, 0px"));
        k = ",";
        var ht = N(T.map(function(re) {
          var ue = yr(re).value;
          return ue;
        }), 4), kt = ht[0], pt = ht[1], ct = ht[2], xt = ht[3], g = Na(kt, pt, ct, xt);
        return {
          type: "rect",
          clipText: v,
          poses: g,
          top: kt,
          right: pt,
          bottom: ct,
          left: xt,
          values: T,
          splitter: k
        };
      }
    }
  }
}
function Gv(t, e, r, n, a) {
  var i = t[e], o = i.direction, s = i.sub, l = t.map(function() {
    return [0, 0];
  }), u = o ? o.split("") : [];
  if (n && e < 8) {
    var c = u.filter(function(P) {
      return P === "w" || P === "e";
    }), f = u.filter(function(P) {
      return P === "n" || P === "s";
    }), d = c[0], h = f[0];
    l[e] = r;
    var v = N(Tc(t), 2), m = v[0], x = v[1], y = m && x ? m / x : 0;
    if (y && a) {
      var C = (e + 4) % 8, w = t[C].pos, D = [0, 0];
      o.indexOf("w") > -1 ? D[0] = -1 : o.indexOf("e") > -1 && (D[0] = 1), o.indexOf("n") > -1 ? D[1] = -1 : o.indexOf("s") > -1 && (D[1] = 1);
      var M = bc([m, x], r, y, D, !0), E = m + M[0], k = x + M[1], T = w[1], g = w[1], _ = w[0], j = w[0];
      D[0] === -1 ? _ = j - E : D[0] === 1 ? j = _ + E : (_ = _ - E / 2, j = j + E / 2), D[1] === -1 ? T = g - k : (D[1] === 1 || (T = g - k / 2), g = T + k);
      var R = Na(T, j, g, _);
      t.forEach(function(P, z) {
        l[z][0] = R[z].pos[0] - P.pos[0], l[z][1] = R[z].pos[1] - P.pos[1];
      });
    } else
      t.forEach(function(P, z) {
        var B = P.direction;
        B && (B.indexOf(d) > -1 && (l[z][0] = r[0]), B.indexOf(h) > -1 && (l[z][1] = r[1]));
      }), d && (l[1][0] = r[0] / 2, l[5][0] = r[0] / 2), h && (l[3][1] = r[1] / 2, l[7][1] = r[1] / 2);
  } else o && !s ? u.forEach(function(P) {
    var z = P === "n" || P === "s";
    t.forEach(function(B, Y) {
      var H = B.direction, L = B.horizontal, $ = B.vertical;
      !H || H.indexOf(P) === -1 || (l[Y] = [
        z || !L ? 0 : r[0],
        !z || !$ ? 0 : r[1]
      ]);
    });
  }) : l[e] = r;
  return l;
}
function Fv(t, e) {
  var r = N(Ou(t, e), 2), n = r[0], a = r[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, u = l.type, c = l.poses, f = l.splitter, d = c.map(function(C) {
    return C.pos;
  });
  if (u === "polygon")
    d.splice(s, 0, [n, a]);
  else if (u === "inset") {
    var h = Pv.indexOf(s), v = Ov.indexOf(s), m = c.length;
    if (jv(c, d, 8, h, v, n, a, d[4][0], d[4][1], d[0][0], d[0][1]), m === c.length)
      return;
  } else
    return;
  var x = Xo(t, o, d), y = "".concat(u, "(").concat(x.join(f), ")");
  ut(t, "onClip", Et(t, e, O({ clipEventType: "added", clipType: u, poses: d, clipStyles: x, clipStyle: y, distX: 0, distY: 0 }, de({
    clipPath: y
  }, e))));
}
function Lv(t, e) {
  var r = e.datas, n = r.clipPath, a = r.clipIndex, i = n, o = i.type, s = i.poses, l = i.splitter, u = s.map(function(h) {
    return h.pos;
  }), c = u.length;
  if (o === "polygon")
    s.splice(a, 1), u.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (Nv(s, u, a, 8, c), c === s.length))
      return;
  } else
    return;
  var f = Xo(t, n, u), d = "".concat(o, "(").concat(f.join(l), ")");
  ut(t, "onClip", Et(t, e, O({ clipEventType: "removed", clipType: o, poses: u, clipStyles: f, clipStyle: d, distX: 0, distY: 0 }, de({
    clipPath: d
  }, e))));
}
var Wv = {
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
    var r = t.props, n = r.customClipPath, a = r.defaultClipPath, i = r.clipArea, o = r.zoom, s = r.groupable, l = t.getState(), u = l.target, c = l.width, f = l.height, d = l.allMatrix, h = l.is3d, v = l.left, m = l.top, x = l.pos1, y = l.pos2, C = l.pos3, w = l.pos4, D = l.clipPathState, M = l.snapBoundInfos, E = l.rotation;
    if (!u || s)
      return [];
    var k = yl(u, c, f, a || "inset", D || n);
    if (!k)
      return [];
    var T = h ? 4 : 3, g = k.type, _ = k.poses, j = _.map(function(pt) {
      var bt = Wt(d, pt.pos, T);
      return [
        bt[0] - v,
        bt[1] - m
      ];
    }), R = [], P = [], z = g === "rect", B = g === "inset", Y = g === "polygon";
    if (z || B || Y) {
      var H = B ? j.slice(0, 8) : j;
      P = H.map(function(pt, bt) {
        var St = bt === 0 ? H[H.length - 1] : H[bt - 1], _t = Vt(St, pt), ht = fc(St, pt);
        return e.createElement("div", { key: "clipLine".concat(bt), className: vt("line", "clip-line", "snap-control"), "data-clip-index": bt, style: {
          width: "".concat(ht, "px"),
          transform: "translate(".concat(St[0], "px, ").concat(St[1], "px) rotate(").concat(_t, "rad) scaleY(").concat(o, ")")
        } });
      });
    }
    if (R = j.map(function(pt, bt) {
      return e.createElement("div", { key: "clipControl".concat(bt), className: vt("control", "clip-control", "snap-control"), "data-clip-index": bt, style: {
        transform: "translate(".concat(pt[0], "px, ").concat(pt[1], "px) rotate(").concat(E, "rad) scale(").concat(o, ")")
      } });
    }), B && R.push.apply(R, et([], N(j.slice(8).map(function(pt, bt) {
      return e.createElement("div", { key: "clipRadiusControl".concat(bt), className: vt("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + bt, style: {
        transform: "translate(".concat(pt[0], "px, ").concat(pt[1], "px) rotate(").concat(E, "rad) scale(").concat(o, ")")
      } });
    })), !1)), g === "circle" || g === "ellipse") {
      var L = k.left, $ = k.top, Z = k.radiusX, F = k.radiusY, rt = N(gt(Wt(d, [L, $], T), Wt(d, [0, 0], T)), 2), at = rt[0], Q = rt[1], nt = "none";
      if (!i) {
        for (var J = Math.max(10, Z / 5, F / 5), st = [], dt = 0; dt <= J; ++dt) {
          var yt = Math.PI * 2 / J * dt;
          st.push([
            Z + (Z - o) * Math.cos(yt),
            F + (F - o) * Math.sin(yt)
          ]);
        }
        st.push([Z, -2]), st.push([-2, -2]), st.push([-2, F * 2 + 2]), st.push([Z * 2 + 2, F * 2 + 2]), st.push([Z * 2 + 2, -2]), st.push([Z, -2]), nt = "polygon(".concat(st.map(function(pt) {
          return "".concat(pt[0], "px ").concat(pt[1], "px");
        }).join(", "), ")");
      }
      R.push(e.createElement("div", { key: "clipEllipse", className: vt("clip-ellipse", "snap-control"), style: {
        width: "".concat(Z * 2, "px"),
        height: "".concat(F * 2, "px"),
        clipPath: nt,
        transform: "translate(".concat(-v + at, "px, ").concat(-m + Q, "px) ").concat($a(d))
      } }));
    }
    if (i) {
      var ft = ke(et([x, y, C, w], N(j), !1)), K = ft.width, ct = ft.height, wt = ft.left, xt = ft.top;
      if (Y || z || B) {
        var st = B ? j.slice(0, 8) : j;
        R.push(e.createElement("div", { key: "clipArea", className: vt("clip-area", "snap-control"), style: {
          width: "".concat(K, "px"),
          height: "".concat(ct, "px"),
          transform: "translate(".concat(wt, "px, ").concat(xt, "px)"),
          clipPath: "polygon(".concat(st.map(function(bt) {
            return "".concat(bt[0] - wt, "px ").concat(bt[1] - xt, "px");
          }).join(", "), ")")
        } }));
      }
    }
    return M && ["vertical", "horizontal"].forEach(function(pt) {
      var bt = M[pt], St = pt === "horizontal";
      bt.isSnap && P.push.apply(P, et([], N(bt.snap.posInfos.map(function(_t, ht) {
        var kt = _t.pos, Tt = gt(Wt(d, St ? [0, kt] : [kt, 0], T), [v, m]), Yt = gt(Wt(d, St ? [c, kt] : [kt, f], T), [v, m]);
        return Dn(e, "", Tt, Yt, o, "clip".concat(pt, "snap").concat(ht), "guideline");
      })), !1)), bt.isBound && P.push.apply(P, et([], N(bt.bounds.map(function(_t, ht) {
        var kt = _t.pos, Tt = gt(Wt(d, St ? [0, kt] : [kt, 0], T), [v, m]), Yt = gt(Wt(d, St ? [c, kt] : [kt, f], T), [v, m]);
        return Dn(e, "", Tt, Yt, o, "clip".concat(pt, "bounds").concat(ht), "guideline", "bounds", "bold");
      })), !1));
    }), et(et([], N(R), !1), N(P), !1);
  },
  dragControlCondition: function(t, e) {
    return e.inputEvent && (e.inputEvent.target.getAttribute("class") || "").indexOf("clip") > -1;
  },
  dragStart: function(t, e) {
    var r = t.props, n = r.dragWithClip, a = n === void 0 ? !0 : n;
    return a ? !1 : this.dragControlStart(t, e);
  },
  drag: function(t, e) {
    return this.dragControl(t, O(O({}, e), { isDragTarget: !0 }));
  },
  dragEnd: function(t, e) {
    return this.dragControlEnd(t, e);
  },
  dragControlStart: function(t, e) {
    var r = t.state, n = t.props, a = n.defaultClipPath, i = n.customClipPath, o = r.target, s = r.width, l = r.height, u = e.inputEvent ? e.inputEvent.target : null, c = u && u.getAttribute("class") || "", f = e.datas, d = yl(o, s, l, a || "inset", i);
    if (!d)
      return !1;
    var h = d.clipText, v = d.type, m = d.poses, x = ut(t, "onClipStart", Et(t, e, {
      clipType: v,
      clipStyle: h,
      poses: m.map(function(y) {
        return y.pos;
      })
    }));
    return x === !1 ? (f.isClipStart = !1, !1) : (f.isControl = c && c.indexOf("clip-control") > -1, f.isLine = c.indexOf("clip-line") > -1, f.isArea = c.indexOf("clip-area") > -1 || c.indexOf("clip-ellipse") > -1, f.clipIndex = u ? parseInt(u.getAttribute("data-clip-index"), 10) : -1, f.clipPath = d, f.isClipStart = !0, r.clipPathState = h, Er(t, e), !0);
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, u = l.isControl, c = l.isLine, f = l.isArea, d = l.clipIndex, h = l.clipPath;
    if (!h)
      return !1;
    var v = wr(t.props, "clippable"), m = v.keepRatio, x = 0, y = 0, C = o.draggable, w = $e(e);
    s && C ? (r = N(C.prevBeforeDist, 2), x = r[0], y = r[1]) : (n = N(w, 2), x = n[0], y = n[1]);
    var D = [x, y], M = t.state, E = M.width, k = M.height, T = !f && !u && !c, g = h.type, _ = h.poses, j = h.splitter, R = _.map(function(Mt) {
      return Mt.pos;
    });
    T && (x = -x, y = -y);
    var P = !u || _[d].direction === "nesw", z = g === "inset" || g === "rect", B = _.map(function() {
      return [0, 0];
    });
    if (u && !P) {
      var Y = _[d], H = Y.horizontal, L = Y.vertical, $ = [
        x * q(H),
        y * q(L)
      ];
      B = Gv(_, d, $, z, m);
    } else P && (B = R.map(function() {
      return [x, y];
    }));
    var Z = R.map(function(Mt, Rt) {
      return Pt(Mt, B[Rt]);
    }), F = et([], N(Z), !1);
    M.snapBoundInfos = null;
    var rt = h.type === "circle", at = h.type === "ellipse";
    if (rt || at) {
      var Q = ke(Z), nt = q(Q.bottom - Q.top), J = q(at ? Q.right - Q.left : nt), st = Z[0][1] + nt, dt = Z[0][0] - J, yt = Z[0][0] + J;
      rt && (F.push([yt, Q.bottom]), B.push([1, 0])), F.push([Q.left, st]), B.push([0, 1]), F.push([dt, Q.bottom]), B.push([1, 0]);
    }
    var ft = ic((v.clipHorizontalGuidelines || []).map(function(Mt) {
      return jt("".concat(Mt), k);
    }), (v.clipVerticalGuidelines || []).map(function(Mt) {
      return jt("".concat(Mt), E);
    }), E, k), K = [], ct = [];
    if (rt || at)
      K = [F[4][0], F[2][0]], ct = [F[1][1], F[3][1]];
    else if (z) {
      var wt = [F[0], F[2], F[4], F[6]], xt = [B[0], B[2], B[4], B[6]];
      K = wt.filter(function(Mt, Rt) {
        return xt[Rt][0];
      }).map(function(Mt) {
        return Mt[0];
      }), ct = wt.filter(function(Mt, Rt) {
        return xt[Rt][1];
      }).map(function(Mt) {
        return Mt[1];
      });
    } else
      K = F.filter(function(Mt, Rt) {
        return B[Rt][0];
      }).map(function(Mt) {
        return Mt[0];
      }), ct = F.filter(function(Mt, Rt) {
        return B[Rt][1];
      }).map(function(Mt) {
        return Mt[1];
      });
    var pt = [0, 0], bt = nl(ft, v.clipTargetBounds && { left: 0, top: 0, right: E, bottom: k }, K, ct, 5, 5), St = bt.horizontal, _t = bt.vertical, ht = St.offset, kt = _t.offset;
    if (St.isBound && (pt[1] += ht), _t.isBound && (pt[0] += kt), (at || rt) && B[0][0] === 0 && B[0][1] === 0) {
      var Q = ke(Z), Tt = Q.bottom - Q.top, Yt = at ? Q.right - Q.left : Tt, Xt = _t.isBound ? q(kt) : _t.snapIndex === 0 ? -kt : kt, Bt = St.isBound ? q(ht) : St.snapIndex === 0 ? -ht : ht;
      Yt -= Xt, Tt -= Bt, rt && (Tt = Zu(_t, St) > 0 ? Tt : Yt, Yt = Tt);
      var At = F[0];
      F[1][1] = At[1] - Tt, F[2][0] = At[0] + Yt, F[3][1] = At[1] + Tt, F[4][0] = At[0] - Yt;
    } else if (z && m && u) {
      var re = N(Tc(_), 2), ue = re[0], jn = re[1], tn = ue && jn ? ue / jn : 0, Va = _[d], Ae = Va.direction || "", kr = F[1][1], st = F[5][1], dt = F[7][0], yt = F[3][0];
      q(ht) <= q(kt) ? ht = fe(ht) * q(kt) / tn : kt = fe(kt) * q(ht) * tn, Ae.indexOf("w") > -1 ? dt -= kt : Ae.indexOf("e") > -1 ? yt -= kt : (dt += kt / 2, yt -= kt / 2), Ae.indexOf("n") > -1 ? kr -= ht : Ae.indexOf("s") > -1 ? st -= ht : (kr += ht / 2, st -= ht / 2);
      var Mr = Na(kr, yt, st, dt);
      F.forEach(function(Qe, U) {
        var ot;
        ot = N(Mr[U].pos, 2), Qe[0] = ot[0], Qe[1] = ot[1];
      });
    } else
      F.forEach(function(Mt, Rt) {
        var qe = B[Rt];
        qe[0] && (Mt[0] -= kt), qe[1] && (Mt[1] -= ht);
      });
    var cr = Xo(t, h, Z), Be = "".concat(g, "(").concat(cr.join(j), ")");
    if (M.clipPathState = Be, rt || at)
      K = [F[4][0], F[2][0]], ct = [F[1][1], F[3][1]];
    else if (z) {
      var wt = [F[0], F[2], F[4], F[6]];
      K = wt.map(function(Rt) {
        return Rt[0];
      }), ct = wt.map(function(Rt) {
        return Rt[1];
      });
    } else
      K = F.map(function(Mt) {
        return Mt[0];
      }), ct = F.map(function(Mt) {
        return Mt[1];
      });
    if (M.snapBoundInfos = nl(ft, v.clipTargetBounds && { left: 0, top: 0, right: E, bottom: k }, K, ct, 1, 1), C) {
      var Ua = M.is3d, Ie = M.allMatrix, It = Ua ? 4 : 3, Ge = pt;
      s && (Ge = [
        D[0] + pt[0] - w[0],
        D[1] + pt[1] - w[1]
      ]), C.deltaOffset = zt(Ie, [Ge[0], Ge[1], 0, 0], It);
    }
    return ut(t, "onClip", Et(t, e, O({ clipEventType: "changed", clipType: g, poses: Z, clipStyle: Be, clipStyles: cr, distX: x, distY: y }, de((a = {}, a[g === "rect" ? "clip" : "clipPath"] = Be, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var r = e.isDrag, n = e.datas, a = e.isDouble, i = n.isLine, o = n.isClipStart, s = n.isControl;
    return o ? (ut(t, "onClipEnd", Se(t, e, {})), a && (s ? Lv(t, e) : i && Fv(t, e)), a || r) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, Yv = {
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
    return e.isRequest ? e.requestAble === "originDraggable" : te(e.inputEvent.target, vt("origin"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas;
    Er(t, e);
    var n = Et(t, e, {
      dragStart: ce.dragStart(t, new Xr().dragStart([0, 0], e))
    }), a = ut(t, "onDragOriginStart", n);
    return r.startOrigin = t.state.transformOrigin, r.startTargetOrigin = t.state.targetOrigin, r.prevOrigin = [0, 0], r.isDragOrigin = !0, a === !1 ? (r.isDragOrigin = !1, !1) : n;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.isRequest;
    if (!r.isDragOrigin)
      return !1;
    var i = N($e(e), 2), o = i[0], s = i[1], l = t.state, u = l.width, c = l.height, f = l.offsetMatrix, d = l.targetMatrix, h = l.is3d, v = t.props.originRelative, m = v === void 0 ? !0 : v, x = h ? 4 : 3, y = [o, s];
    if (a) {
      var C = e.distOrigin;
      (C[0] || C[1]) && (y = C);
    }
    var w = Pt(r.startOrigin, y), D = Pt(r.startTargetOrigin, y), M = gt(y, r.prevOrigin), E = On(f, d, w, x), k = t.getRect(), T = ke(Dr(E, u, c, x)), g = [
      k.left - T.left,
      k.top - T.top
    ];
    r.prevOrigin = y;
    var _ = [
      Re(D[0], u, m),
      Re(D[1], c, m)
    ].join(" "), j = ce.drag(t, Pn(e, t.state, g, !!n)), R = Et(t, e, O(O({ width: u, height: c, origin: w, dist: y, delta: M, transformOrigin: _, drag: j }, de({
      transformOrigin: _,
      transform: j.transform
    }, e)), { afterTransform: j.transform }));
    return ut(t, "onDragOrigin", R), R;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    return r.isDragOrigin ? (ut(t, "onDragOriginEnd", Se(t, e, {})), !0) : !1;
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
function Xv(t, e, r, n) {
  var a = t.filter(function(l) {
    var u = l.virtual, c = l.horizontal;
    return c && !u;
  }).length, i = t.filter(function(l) {
    var u = l.virtual, c = l.vertical;
    return c && !u;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    Hv(t, o), o < 4 ? s.pos[0] = r : s.pos[1] = n;
  }
}
function Hv(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(r) {
    r.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(r) {
    r.virtual = !1;
  }));
}
function $v(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(r) {
    r.virtual = !0;
  }) : t.slice(e).forEach(function(r) {
    r.virtual = !0;
  });
}
function bl(t, e, r, n, a) {
  n === void 0 && (n = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = or(t), _c(i, e, r, 0, 0, n, a);
}
function Sl(t, e, r, n, a) {
  var i = t.state, o = i.width, s = i.height, l = Yo(a, t.props.roundRelative, o, s), u = l.raws, c = l.styles, f = l.radiusPoses, d = zv(f, u), h = d.horizontals, v = d.verticals, m = c.join(" ");
  i.borderRadiusState = m;
  var x = Et(t, e, O({ horizontals: h, verticals: v, borderRadius: m, width: o, height: s, delta: n, dist: r }, de({
    borderRadius: m
  }, e)));
  return ut(t, "onRound", x), x;
}
function Cl(t) {
  var e, r, n = t.getState().style, a = n.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (r = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && r !== void 0 ? r : "", n.borderRadius = a) : (a = Bo(o).borderRadius, n.borderRadius = a));
  }
  return a;
}
var qv = {
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
    return e === !0 || e === "line" ? vt("round-line-clickable") : "";
  },
  requestStyle: function() {
    return ["borderRadius"];
  },
  requestChildStyle: function() {
    return ["borderRadius"];
  },
  render: function(t, e) {
    var r = t.getState(), n = r.target, a = r.width, i = r.height, o = r.allMatrix, s = r.is3d, l = r.left, u = r.top, c = r.borderRadiusState, f = t.props, d = f.minRoundControls, h = d === void 0 ? [0, 0] : d, v = f.maxRoundControls, m = v === void 0 ? [4, 4] : v, x = f.zoom, y = f.roundPadding, C = y === void 0 ? 0 : y, w = f.isDisplayShadowRoundControls, D = f.groupable;
    if (!n)
      return null;
    var M = c || Cl(t), E = s ? 4 : 3, k = bl(M, a, i, h, !0);
    if (!k)
      return null;
    var T = 0, g = 0, _ = D ? [0, 0] : [l, u];
    return k.map(function(j, R) {
      var P = j.horizontal, z = j.vertical, B = j.direction || "", Y = et([], N(j.pos), !1);
      g += Math.abs(P), T += Math.abs(z), P && B.indexOf("n") > -1 && (Y[1] -= C), z && B.indexOf("w") > -1 && (Y[0] -= C), P && B.indexOf("s") > -1 && (Y[1] += C), z && B.indexOf("e") > -1 && (Y[0] += C);
      var H = gt(Wt(o, Y, E), _), L = w && w !== "horizontal", $ = j.vertical ? T <= m[1] && (L || !j.virtual) : g <= m[0] && (w || !j.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(R), className: vt("control", "border-radius", j.vertical ? "vertical" : "", j.virtual ? "virtual" : ""), "data-radius-index": R, style: {
        display: $ ? "block" : "none",
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
    var f = Et(t, e, {}), d = ut(t, "onRoundStart", f);
    if (d === !1)
      return !1;
    n.lineIndex = u, n.controlIndex = l, n.isControl = o, n.isLine = s, Er(t, e);
    var h = t.props, v = h.roundRelative, m = h.minRoundControls, x = m === void 0 ? [0, 0] : m, y = t.state, C = y.width, w = y.height;
    n.isRound = !0, n.prevDist = [0, 0];
    var D = Cl(t), M = bl(D || "", C, w, x, !0) || [];
    return n.controlPoses = M, y.borderRadiusState = Yo(M, v, C, w).styles.join(" "), f;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = r.controlPoses;
    if (!r.isRound || !r.isControl || !n.length)
      return !1;
    var a = r.controlIndex, i = N($e(e), 2), o = i[0], s = i[1], l = [o, s], u = gt(l, r.prevDist), c = t.props.maxRoundControls, f = c === void 0 ? [4, 4] : c, d = t.state, h = d.width, v = d.height, m = n[a], x = m.vertical, y = m.horizontal, C = n.map(function(D) {
      var M = D.horizontal, E = D.vertical, k = [
        M * y * l[0],
        E * x * l[1]
      ];
      if (M) {
        if (f[0] === 1)
          return k;
        if (f[0] < 4 && M !== y)
          return k;
      } else {
        if (f[1] === 0)
          return k[1] = E * y * l[0] / h * v, k;
        if (x) {
          if (f[1] === 1)
            return k;
          if (f[1] < 4 && E !== x)
            return k;
        }
      }
      return [0, 0];
    });
    C[a] = l;
    var w = n.map(function(D, M) {
      return O(O({}, D), { pos: Pt(D.pos, C[M]) });
    });
    return a < 4 ? w.slice(0, a + 1).forEach(function(D) {
      D.virtual = !1;
    }) : w.slice(4, a + 1).forEach(function(D) {
      D.virtual = !1;
    }), r.prevDist = [o, s], Sl(t, e, l, u, w);
  },
  dragControlEnd: function(t, e) {
    var r = t.state;
    r.borderRadiusState = "";
    var n = e.datas, a = e.isDouble;
    if (!n.isRound)
      return !1;
    var i = n.isControl, o = n.controlIndex, s = n.isLine, l = n.lineIndex, u = n.controlPoses, c = u.filter(function(y) {
      var C = y.virtual;
      return C;
    }).length, f = t.props.roundClickable, d = f === void 0 ? !0 : f;
    if (a && d) {
      if (i && (d === !0 || d === "control"))
        $v(u, o);
      else if (s && (d === !0 || d === "line")) {
        var h = N(Ou(t, e), 2), v = h[0], m = h[1];
        Xv(u, l, v, m);
      }
      c !== u.filter(function(y) {
        var C = y.virtual;
        return C;
      }).length && Sl(t, e, [0, 0], [0, 0], u);
    }
    var x = Se(t, e, {});
    return ut(t, "onRoundEnd", x), r.borderRadiusState = "", x;
  },
  dragGroupControlStart: function(t, e) {
    var r = this.dragControlStart(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Ne(t, "roundable", e), o = O({ targets: t.props.targets, events: i.map(function(s, l) {
      return O(O({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] });
    }) }, r);
    return ut(t, "onRoundGroupStart", o), r;
  },
  dragGroupControl: function(t, e) {
    var r = this.dragControl(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Ne(t, "roundable", e), o = O({ targets: t.props.targets, events: i.map(function(s, l) {
      return O(O(O({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] }), de({
        borderRadius: r.borderRadius
      }, s));
    }) }, r);
    return ut(t, "onRoundGroup", o), o;
  },
  dragGroupControlEnd: function(t, e) {
    var r = t.moveables, n = t.props.targets, a = Ne(t, "roundable", e);
    qa(t, "onRound", function(s) {
      var l = O({ targets: t.props.targets, events: a.map(function(u, c) {
        return O(O(O({}, u), { target: n[c], moveable: r[c], currentTarget: r[c] }), de({
          borderRadius: s.borderRadius
        }, u));
      }) }, s);
      ut(t, "onRoundGroup", l);
    });
    var i = this.dragControlEnd(t, e);
    if (!i)
      return !1;
    var o = O({ targets: t.props.targets, events: a.map(function(s, l) {
      var u;
      return O(O({}, s), { target: n[l], moveable: r[l], currentTarget: r[l], lastEvent: (u = s.datas) === null || u === void 0 ? void 0 : u.lastEvent });
    }) }, i);
    return ut(t, "onRoundGroupEnd", o), o;
  },
  unset: function(t) {
    t.state.borderRadiusState = "";
  }
};
function Vv(t, e) {
  var r = e ? 4 : 3, n = Gt(r), a = "matrix".concat(e ? "3d" : "", "(").concat(n.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var Ic = {
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
    var r = t.state, n = r.is3d, a = r.targetMatrix, i = r.inlineTransform, o = n ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(yu(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = Vv(s, n) ? [] : or(s);
  },
  resetStyle: function(t) {
    var e = t.datas;
    e.nextStyle = {}, e.nextTransforms = t.datas.startTransforms, e.nextTransformAppendedIndexes = [];
  },
  fillDragStartParams: function(t, e) {
    return Et(t, e, {
      setTransform: function(r) {
        e.datas.startTransforms = qt(r) ? r : or(r);
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
    this.setTransform(t, e), this.resetStyle(e), ut(t, "onBeforeRenderStart", this.fillDragStartParams(t, e));
  },
  drag: function(t, e) {
    e.datas.startTransforms || this.setTransform(t, e), this.resetStyle(e), ut(t, "onBeforeRender", Et(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  dragEnd: function(t, e) {
    e.datas.startTransforms || (this.setTransform(t, e), this.resetStyle(e)), ut(t, "onBeforeRenderEnd", Et(t, e, {
      isPinch: !!e.isPinch,
      isDrag: e.isDrag
    }));
  },
  dragGroupStart: function(t, e) {
    var r = this;
    this.dragStart(t, e);
    var n = Ne(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.setTransform(l, o), r.resetStyle(o), r.fillDragStartParams(l, o);
    });
    ut(t, "onBeforeRenderGroupStart", Et(t, e, {
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
    var n = Ne(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.resetStyle(o), r.fillDragParams(l, o);
    });
    ut(t, "onBeforeRenderGroup", Et(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets,
      events: i
    }));
  },
  dragGroupEnd: function(t, e) {
    this.dragEnd(t, e), ut(t, "onBeforeRenderGroupEnd", Et(t, e, {
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
}, Rc = {
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
    ut(t, "onRenderStart", Et(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  drag: function(t, e) {
    ut(t, "onRender", this.fillDragParams(t, e));
  },
  dragAfter: function(t, e) {
    return this.drag(t, e);
  },
  dragEnd: function(t, e) {
    ut(t, "onRenderEnd", this.fillDragEndParams(t, e));
  },
  dragGroupStart: function(t, e) {
    ut(t, "onRenderGroupStart", Et(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets
    }));
  },
  dragGroup: function(t, e) {
    var r = this, n = Ne(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragParams(l, o);
    });
    ut(t, "onRenderGroup", Et(t, e, O(O({ isPinch: !!e.isPinch, targets: t.props.targets, transform: na(e), transformObject: {} }, de(aa(e))), { events: i })));
  },
  dragGroupEnd: function(t, e) {
    var r = this, n = Ne(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragEndParams(l, o);
    });
    ut(t, "onRenderGroupEnd", Et(t, e, O({ isPinch: !!e.isPinch, isDrag: e.isDrag, targets: t.props.targets, events: i, transformObject: {}, transform: na(e) }, de(aa(e)))));
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
    return Yr(Ma(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), Et(t, e, O({ isPinch: !!e.isPinch, transformObject: r, transform: na(e) }, de(aa(e))));
  },
  fillDragEndParams: function(t, e) {
    var r = {};
    return Yr(Ma(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), Et(t, e, O({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: r, transform: na(e) }, de(aa(e))));
  }
};
function yn(t, e, r, n, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", u = a === "After", c = t.state.target, f = i.isRequest, d = n.indexOf("Control") > -1;
  if (!c || s && d && !f && t.areaElement === i.inputEvent.target)
    return !1;
  var h = et([], N(e), !1);
  if (f) {
    var v = i.requestAble;
    h.some(function(R) {
      return R.name === v;
    }) || h.push.apply(h, et([], N(t.props.ables.filter(function(R) {
      return R.name === v;
    })), !1));
  }
  if (!h.length || h.every(function(R) {
    return R.dragRelation;
  }))
    return !1;
  var m = i.inputEvent, x;
  l && m && (x = document.elementFromPoint(i.clientX, i.clientY) || m.target);
  var y = !1, C = function() {
    var R;
    y = !0, (R = i.stop) === null || R === void 0 || R.call(i);
  }, w = s && (!t.targetGesto || !t.controlGesto || !t.targetGesto.isFlag() || !t.controlGesto.isFlag());
  w && t.updateRect(a, !0, !1);
  var D = i.datas, M = d ? "controlGesto" : "targetGesto", E = t[M], k = function(R, P, z) {
    if (!(P in R) || E !== t[M])
      return !1;
    var B = R.name, Y = D[B] || (D[B] = {});
    if (s && (Y.isEventStart = !z || !R[z] || R[z](t, i)), !Y.isEventStart)
      return !1;
    var H = R[P](t, O(O({}, i), { stop: C, datas: Y, originalDatas: D, inputTarget: x }));
    return t._emitter.off(), s && H === !1 && (Y.isEventStart = !1), H;
  };
  w && h.forEach(function(R) {
    R.unset && R.unset(t);
  }), k(Ic, "drag".concat(n).concat(a));
  var T = 0, g = 0;
  r.forEach(function(R) {
    if (y)
      return !1;
    var P = "".concat(R).concat(n).concat(a), z = "".concat(R).concat(n, "Condition");
    a === "" && !f && mv(t.state, i);
    var B = h.filter(function(L) {
      return L[P];
    });
    B = B.filter(function(L, $) {
      return L.name && B.indexOf(L) === $;
    });
    var Y = B.filter(function(L) {
      return k(L, P, z);
    }), H = Y.length;
    y && ++T, H && ++g, !y && s && B.length && !H && (T += B.filter(function(L) {
      var $ = L.name, Z = D[$];
      return Z.isEventStart ? L.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!u || g) && k(Rc, "drag".concat(n).concat(a));
  var _ = E !== t[M] || T === r.length;
  if ((l || y || _) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(R) {
    R.state.gestos = {};
  }), h.forEach(function(R) {
    R.unset && R.unset(t);
  })), s && !_ && !f && g && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || _)
    return !1;
  if (!s && g && !o || l) {
    var j = t.props.flushSync || lc;
    j(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !u && g && !o && yn(t, e, r, n, a + "After", i), !0;
}
function Ho(t, e) {
  return function(r, n) {
    var a;
    n === void 0 && (n = r.inputEvent.target);
    var i = n, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || te(i, "moveable-area") || te(i, "moveable-padding") || te(i, "moveable-edgeDraggable");
  };
}
function Pc(t, e, r) {
  var n = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(n), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var u = Ho(t);
  return Nc(t, a, "targetAbles", r, {
    dragStart: u,
    pinchStart: u
  });
}
function Oc(t, e) {
  var r = t.controlBox, n = [];
  n.push(r);
  var a = Ho(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === r)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return Nc(t, n, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function Nc(t, e, r, n, a) {
  a === void 0 && (a = {});
  var i = r === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, u = o.preventClickEventOnDrag, c = o.preventClickDefault, f = o.checkInput, d = o.dragFocusedInput, h = o.preventDefault, v = h === void 0 ? !0 : h, m = o.preventRightClick, x = m === void 0 ? !0 : m, y = o.preventWheelClick, C = y === void 0 ? !0 : y, w = o.dragContainer, D = He(w, !0), M = {
    preventDefault: v,
    preventRightClick: x,
    preventWheelClick: C,
    container: D || De(t.getControlBoxElement()),
    pinchThreshold: l,
    pinchOutside: s,
    preventClickEventOnDrag: i ? u : !1,
    preventClickEventOnDragStart: i ? c : !1,
    preventClickEventByCondition: i ? null : function(T) {
      return t.controlBox.contains(T.target);
    },
    checkInput: i ? f : !1,
    dragFocusedInput: d
  }, E = new Du(e, M), k = n === "Control";
  return ["drag", "pinch"].forEach(function(T) {
    ["Start", "", "End"].forEach(function(g) {
      E.on("".concat(T).concat(g), function(_) {
        var j, R = _.eventType, P = T === "drag" && _.isPinch;
        if (a[R] && !a[R](_)) {
          _.stop();
          return;
        }
        if (!P) {
          var z = T === "drag" ? [T] : ["drag", T], B = et([], N(t[r]), !1), Y = yn(t, B, z, n, g, _);
          Y ? (t.props.stopPropagation || g === "Start" && k) && ((j = _ == null ? void 0 : _.inputEvent) === null || j === void 0 || j.stopPropagation()) : _.stop();
        }
      });
    });
  }), E;
}
var Uv = /* @__PURE__ */ (function() {
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
function Kv(t, e, r, n) {
  var a;
  r === void 0 && (r = e);
  var i = Gu(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, u = i.transformOrigin, c = i.targetOrigin, f = i.offsetContainer, d = i.hasFixed, h = i.zoom, v = ch(f, r), m = v.matrixes, x = v.is3d, y = v.offsetContainer, C = v.zoom, w = n, D = 4, M = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, E = l, k = Gt(D), T = Gt(D), g = Gt(D), _ = Gt(D), j = o.length, R = m.map(function($) {
    return O(O({}, $), { matrix: $.matrix ? et([], N($.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && w && (E = ze(E, 3, 4), to(o)), !x && w && to(R), R.forEach(function($) {
    T = zt(T, $.matrix, D);
  });
  var P = r || ur(t), z = ((a = R[0]) === null || a === void 0 ? void 0 : a.target) || kn(P, P, !0).offsetParent, B = R.slice(1).reduce(function($, Z) {
    return zt($, Z.matrix, D);
  }, Gt(D));
  o.forEach(function($, Z) {
    if (j - 2 === Z && (g = k.slice()), j - 1 === Z && (_ = k.slice()), !$.matrix) {
      var F = o[Z + 1], rt = pv($, F, z, D, zt(B, k, D));
      $.matrix = Sr(rt, D);
    }
    k = zt(k, $.matrix, D);
  });
  var Y = !M && s;
  E || (E = Gt(Y ? 4 : 3));
  var H = $a(M && E.length === 16 ? ze(E, 4, 3) : E, Y), L = T;
  return T = mu(T, D, D), {
    hasZoom: h !== 1 || C !== 1,
    hasFixed: d,
    matrixes: o,
    rootMatrix: T,
    originalRootMatrix: L,
    beforeMatrix: g,
    offsetMatrix: _,
    allMatrix: k,
    targetMatrix: E,
    targetTransform: H,
    inlineTransform: t.style.transform,
    transformOrigin: u,
    targetOrigin: c,
    is3d: w,
    offsetContainer: f,
    offsetRootContainer: y
  };
}
function Zv(t, e, r, n) {
  r === void 0 && (r = e);
  var a = 0, i = 0, o = 0, s = {}, l = dc(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var u = Kv(t, e, r, n), c = Lr(u.allMatrix, u.transformOrigin, a, i);
    s = O(O({}, u), c);
    var f = Lr(u.allMatrix, [50, 50], 100, 100);
    o = pc([f.pos1, f.pos2], f.direction);
  }
  var d = 4;
  return O(O(O({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: Gt(d), rootMatrix: Gt(d), beforeMatrix: Gt(d), offsetMatrix: Gt(d), allMatrix: Gt(d), targetMatrix: Gt(d), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function ao(t, e, r, n, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = oa(), u = oa(), c = oa(), f = oa(), d = [0, 0], h = {}, v = Zv(e, r, a, !0);
  if (e) {
    var m = me(e);
    i.forEach(function(R) {
      h[R] = m(R);
    });
    var x = v.is3d ? 4 : 3, y = Lr(v.offsetMatrix, Pt(v.transformOrigin, xu(v.targetMatrix, x)), v.width, v.height);
    o = y.direction, s = Pt(y.origin, [y.left - v.left, y.top - v.top]), f = xn(v.offsetRootContainer);
    var C = kn(n, n, !0).offsetParent || v.offsetRootContainer;
    if (v.hasZoom) {
      var w = Lr(zt(v.originalRootMatrix, v.allMatrix), v.transformOrigin, v.width, v.height), D = Lr(v.originalRootMatrix, Ra(me(C)("transformOrigin")).map(function(R) {
        return parseFloat(R);
      }), C.offsetWidth, C.offsetHeight);
      if (l = bi(w, f), c = bi(D, f, C, !0), t) {
        var M = w.left, E = w.top;
        u = bi({
          left: M,
          top: E,
          bottom: E,
          right: E
        }, f);
      }
    } else {
      l = xn(e), c = uh(C), t && (u = xn(t));
      var k = c.left, T = c.top, g = c.clientLeft, _ = c.clientTop, j = [
        l.left - k,
        l.top - T
      ];
      d = gt(qr(v.rootMatrix, j, 4), [g + v.left, _ + v.top]);
    }
  }
  return O({ targetClientRect: l, containerClientRect: c, moveableClientRect: u, rootContainerClientRect: f, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: h, offsetDelta: d }, v);
}
function wl(t) {
  var e = t.pos1, r = t.pos2, n = t.pos3, a = t.pos4;
  if (!e || !r || !n || !a)
    return null;
  var i = Cr([e, r, n, a]), o = [i.minX, i.minY], s = gt(t.origin, o);
  return e = gt(e, o), r = gt(r, o), n = gt(n, o), a = gt(a, o), O(O({}, t), {
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
var Vr = /* @__PURE__ */ (function(t) {
  In(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.state = O({ container: null, gestos: {}, renderLines: [
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]]
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, ao(null)), r.renderState = {}, r.enabledAbles = [], r.targetAbles = [], r.controlAbles = [], r.rotation = 0, r.scale = [1, 1], r.isMoveableMounted = !1, r.isUnmounted = !1, r.events = {
      mouseEnter: null,
      mouseLeave: null
    }, r._emitter = new Tn(), r._prevOriginalDragTarget = null, r._originalDragTarget = null, r._prevDragTarget = null, r._dragTarget = null, r._prevPropTarget = null, r._propTarget = null, r._prevDragArea = !1, r._isPropTargetChanged = !1, r._hasFirstTarget = !1, r._reiszeObserver = null, r._observerId = 0, r._mutationObserver = null, r._rootContainer = null, r._viewContainer = null, r._viewClassNames = [], r._store = {}, r.checkUpdateRect = function() {
      if (!r.isDragging()) {
        var n = r.props.parentMoveable;
        if (n) {
          n.checkUpdateRect();
          return;
        }
        Fd(r._observerId), r._observerId = hu(function() {
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
    var v = N(a || [0, 0], 2), m = v[0], x = v[1], y = n.left, C = n.top, w = n.target, D = n.direction, M = n.hasFixed, E = n.offsetDelta, k = r.targets, T = this.isDragging(), g = {};
    this.getEnabledAbles().forEach(function(B) {
      g["data-able-".concat(B.name.toLowerCase())] = !0;
    });
    var _ = this._getAbleClassName(), j = k && k.length && (w || f) || o || !this._hasFirstTarget && this.state.isPersisted, R = this.controlBox || this.props.firstRenderState || this.props.persistData, P = [y - m, C - x];
    !f && r.useAccuratePosition && (P[0] += E[0], P[1] += E[1]);
    var z = {
      position: M ? "fixed" : "absolute",
      display: j ? "block" : "none",
      visibility: R ? "visible" : "hidden",
      transform: "translate3d(".concat(P[0], "px, ").concat(P[1], "px, ").concat(u, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return d && (z["--moveable-line-padding"] = d), h && (z["--moveable-control-padding"] = h), tt.createElement(
      c,
      O({ cspNonce: l, ref: ir(this, "controlBox"), className: "".concat(vt("control-box", D === -1 ? "reverse" : "", T ? "dragging" : ""), " ").concat(_, " ").concat(i) }, g, { onClick: this._onPreventClick, style: z }),
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
    a && this._changeAbleViewClassNames([]), Gr(this, !1), Gr(this, !0);
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
    return be(n, function(a) {
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
    return r && (((n = r.getAttribute) === null || n === void 0 ? void 0 : n.call(r, "class")) || "").indexOf(ko) > -1;
  }, e.prototype.dragStart = function(r, n) {
    n === void 0 && (n = r.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && Ho(this)({ inputEvent: r }, n) ? a.isFlag() || a.triggerDragStart(r) : i && this.isMoveableElement(n) && (i.isFlag() || i.triggerDragStart(r)), this;
  }, e.prototype.hitTest = function(r) {
    var n = this.state, a = n.target, i = n.pos1, o = n.pos2, s = n.pos3, l = n.pos4, u = n.targetClientRect;
    if (!a)
      return 0;
    var c;
    if (En(r)) {
      var f = r.getBoundingClientRect();
      c = {
        left: f.left,
        top: f.top,
        width: f.width,
        height: f.height
      };
    } else
      c = O({ width: 0, height: 0 }, r);
    var d = c.left, h = c.top, v = c.width, m = c.height, x = Fi([i, o, l, s], u), y = gp(x, [
      [d, h],
      [d + v, h],
      [d + v, h + m],
      [d, h + m]
    ]), C = hn(x);
    return !y || !C ? 0 : Math.min(100, y / C * 100);
  }, e.prototype.isInside = function(r, n) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, u = a.pos4, c = a.targetClientRect;
    return i ? Da([r, n], Fi([o, s, u, l], c)) : !1;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && Hr(!0);
    var s = i.parentMoveable, l = this.state, u = l.target || i.target, c = this.getContainer(), f = s ? s._rootContainer : this._rootContainer, d = ao(this.controlBox, u, c, c, f || c, this._getRequestStyles());
    if (!u && this._hasFirstTarget && i.persistData) {
      var h = wl(i.persistData);
      for (var v in h)
        d[v] = h[v];
    }
    o && Hr(), this.updateState(d, s ? !1 : a);
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
    var r = this.state, n = Te(this.state), a = N(n, 4), i = a[0], o = a[1], s = a[2], l = a[3], u = ke(n), c = r.width, f = r.height, d = u.width, h = u.height, v = u.left, m = u.top, x = [r.left, r.top], y = Pt(x, r.origin), C = Pt(x, r.beforeOrigin), w = r.transformOrigin;
    return {
      width: d,
      height: h,
      left: v,
      top: m,
      pos1: i,
      pos2: o,
      pos3: s,
      pos4: l,
      offsetWidth: c,
      offsetHeight: f,
      beforeOrigin: C,
      origin: y,
      transformOrigin: w,
      rotation: this.getRotation()
    };
  }, e.prototype.getManager = function() {
    return this;
  }, e.prototype.stopDrag = function(r) {
    if (!r || r === "target") {
      var n = this.targetGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && eo(this, !1), n == null || n.stop();
    }
    if (!r || r === "control") {
      var n = this.controlGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && eo(this, !0), n == null || n.stop();
    }
  }, e.prototype.getRotation = function() {
    var r = this.state, n = r.pos1, a = r.pos2, i = r.direction;
    return bv(n, a, i);
  }, e.prototype.request = function(r, n, a) {
    n === void 0 && (n = {});
    var i = this, o = i.props, s = o.parentMoveable || o.wrapperMoveable || i, l = s.props.ables, u = o.groupable, c = be(l, function(y) {
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
    var f = c.request(i), d = a || n.isInstant, h = f.isControl ? "controlAbles" : "targetAbles", v = "".concat(u ? "Group" : "").concat(f.isControl ? "Control" : ""), m = et([], N(s[h]), !1), x = {
      request: function(y) {
        return yn(i, m, ["drag"], v, "", O(O({}, f.request(y)), { requestAble: r, isRequest: !0 }), d), x;
      },
      requestEnd: function() {
        return yn(i, m, ["drag"], v, "End", O(O({}, f.requestEnd()), { requestAble: r, isRequest: !0 }), d), x;
      }
    };
    return yn(i, m, ["drag"], v, "Start", O(O({}, f.requestStart(n)), { requestAble: r, isRequest: !0 }), d), d ? x.request(n).requestEnd() : x;
  }, e.prototype.getMoveables = function() {
    return [this];
  }, e.prototype.destroy = function() {
    this.componentWillUnmount();
  }, e.prototype.updateRenderPoses = function() {
    var r = this.getState(), n = this.props, a = n.padding, i = r.originalBeforeOrigin, o = r.transformOrigin, s = r.allMatrix, l = r.is3d, u = r.pos1, c = r.pos2, f = r.pos3, d = r.pos4, h = r.left, v = r.top, m = r.isPersisted, x = n.zoom || 1;
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
    var y = wc(a || {}), C = y.left, w = y.top, D = y.bottom, M = y.right, E = l ? 4 : 3, k = [];
    m ? k = o : this.controlBox && n.groupable ? k = i : k = Pt(i, [h, v]);
    var T = Ea(E, Sr(k.map(function(z) {
      return -z;
    }), E), s, Sr(o, E)), g = Ee(T, u, [-C, -w], E), _ = Ee(T, c, [M, -w], E), j = Ee(T, f, [-C, D], E), R = Ee(T, d, [M, D], E);
    r.renderPoses = [
      g,
      _,
      j,
      R
    ], r.renderLines = [
      [g, _],
      [_, R],
      [R, j],
      [j, g]
    ];
    {
      var P = x / 2;
      r.renderLines = [
        [
          Ee(T, u, [-C - P, -w], E),
          Ee(T, c, [M + P, -w], E)
        ],
        [
          Ee(T, c, [M, -w - P], E),
          Ee(T, d, [M, D + P], E)
        ],
        [
          Ee(T, d, [M + P, D], E),
          Ee(T, f, [-C - P, D], E)
        ],
        [
          Ee(T, f, [-C, D + P], E),
          Ee(T, u, [-C, -w - P], E)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var r = this.props, n = r.target, a = r.container, i = r.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !n)) {
      this.updateAbles();
      var u = !ro(s, n), c = u || !ro(l, a);
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
    return a[i] || (a[i] = Mu(r, n)), a[i];
  }, e.prototype.getState = function() {
    var r, n = this.props;
    (n.target || !((r = n.targets) === null || r === void 0) && r.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = n.persistData, o = n.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = wl(i);
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
    var a = this.props, i = a.triggerAblesSimultaneously, o = this.getEnabledAbles(r), s = "drag".concat(n, "Start"), l = "pinch".concat(n, "Start"), u = "drag".concat(n, "ControlStart"), c = sa(o, [s, l], i), f = sa(o, [u], i);
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
      createElement: tt.createElement
    };
    return this.renderState = {}, gv(yc(sa(this.getEnabledAbles(), ["render"], a).map(function(o) {
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
      return et(et([], N(n), !1), N(s), !1);
    }, et([], N(this.props.requestStyles || []), !1));
    return r;
  }, e.prototype._updateObserver = function(r) {
    this._updateResizeObserver(r), this._updateMutationObserver(r);
  }, e.prototype._updateEvents = function() {
    var r = this.targetAbles.length, n = this.controlAbles.length, a = this._dragTarget, i = !r && this.targetGesto || this._isTargetChanged(!0);
    i && (Gr(this, !1), this.updateState({ gestos: {} })), n || Gr(this, !0), a && r && !this.targetGesto && (this.targetGesto = Pc(this, a, "")), !this.controlGesto && n && (this.controlGesto = Oc(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var r = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = r.dragArea, this._propTarget = r.target, this._originalDragTarget = r.dragTarget || r.target, this._dragTarget = He(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var r = this.props, n = r, a = n.zoom, i = n.hideDefaultLines, o = n.hideChildMoveableDefaultLines, s = n.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), u = {
      createElement: tt.createElement
    };
    return l.renderLines.map(function(c, f) {
      return Dn(u, "", c[0], c[1], a, "render-line-".concat(f));
    });
  }, e.prototype._isTargetChanged = function(r) {
    var n = this.props, a = n.dragTarget || n.target, i = this._prevOriginalDragTarget, o = this._prevDragArea, s = n.dragArea, l = !s && i !== a, u = (r || s) && o !== s;
    return l || u || this._prevPropTarget != this._propTarget;
  }, e.prototype._updateNativeEvents = function() {
    var r = this, n = this.props, a = n.dragArea ? this.areaElement : this.state.target, i = this.events, o = Kr(i);
    if (this._isTargetChanged())
      for (var s in i) {
        var l = i[s];
        l && l.destroy(), i[s] = null;
      }
    if (a) {
      var u = this.enabledAbles;
      o.forEach(function(c) {
        var f = sa(u, [c]), d = f.length > 0, h = i[c];
        if (!d) {
          h && (h.destroy(), i[c] = null);
          return;
        }
        h || (h = new Uv(a, r, c), i[c] = h), h.setAbles(f);
      });
    }
  }, e.prototype._checkUpdateRootContainer = function() {
    var r = this.props.rootContainer;
    !this._rootContainer && r && (this._rootContainer = He(r, !0));
  }, e.prototype._checkUpdateViewContainer = function() {
    var r = this.props.viewContainer;
    !this._viewContainer && r && (this._viewContainer = He(r, !0));
    var n = this._viewContainer;
    n && this._changeAbleViewClassNames(et(et([], N(this._getAbleViewClassNames()), !1), [
      this.isDragging() ? Mv : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(r) {
    var n = this._viewContainer, a = xc(r.filter(Boolean), function(u) {
      return u;
    }).map(function(u) {
      var c = N(u, 1), f = c[0];
      return f;
    }), i = this._viewClassNames, o = wo(i, a), s = o.removed, l = o.added;
    s.forEach(function(u) {
      vu(n, i[u]);
    }), l.forEach(function(u) {
      xo(n, a[u]);
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
      return (!((f = s[h]) === null || f === void 0) && f.isEventStart || !((d = l[h]) === null || d === void 0) && d.isEventStart) && (v += " ".concat(vt("".concat(h).concat(r, "-dragging")))), v.trim();
    }).filter(Boolean).join(" ");
  }, e.prototype._updateResizeObserver = function(r) {
    var n, a = this.props, i = a.target, o = De(this.getControlBoxElement());
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
    var n = this, a, i = this.props, o = i.target, s = De(this.getControlBoxElement());
    if (!s.MutationObserver || !o || !i.useMutationObserver) {
      (a = this._mutationObserver) === null || a === void 0 || a.disconnect();
      return;
    }
    if (!(r.target === o && this._mutationObserver)) {
      var l = new s.MutationObserver(function(u) {
        var c, f;
        try {
          for (var d = Rp(u), h = d.next(); !h.done; h = d.next()) {
            var v = h.value;
            v.type === "attributes" && v.attributeName === "style" && n.checkUpdateRect();
          }
        } catch (m) {
          c = { error: m };
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
    flushSync: lc,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})(tt.PureComponent), $o = {
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
    var d = Fr(t, "parentPosition", [o, s], function(v) {
      return v.join(",");
    }), h = Fr(t, "requestStyles", t.getRequestChildStyles(), function(v) {
      return v.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), et(et([], N(a.map(function(v, m) {
      return e.createElement(Vr, { key: "moveable" + m, ref: uu(t, "moveables", m), target: v, origin: !1, requestStyles: h, cssStyled: n.cssStyled, customStyledMap: n.customStyledMap, useResizeObserver: n.useResizeObserver, useMutationObserver: n.useMutationObserver, hideChildMoveableDefaultLines: n.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: f[m], zoom: u });
    })), !1), N(yc(c.map(function(v, m) {
      var x = v.pos1, y = v.pos2, C = v.pos3, w = v.pos4, D = [x, y, C, w];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(M, E) {
        var k = N(M, 2), T = k[0], g = k[1];
        return Dn(e, "", gt(D[T], d), gt(D[g], d), u, "group-rect-".concat(m, "-").concat(E));
      });
    }))), !1);
  }
}, Jv = Rn("clickable", {
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
      ut(t, "onClick", Et(t, e, {
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
      i === -1 && (i = Je(a, function(l) {
        return l.contains(n);
      }), s = i > -1), ut(t, "onClickGroup", Et(t, e, {
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
function Pr(t) {
  var e = t.originalDatas.draggable;
  return e || (t.originalDatas.draggable = {}, e = t.originalDatas.draggable), O(O({}, t), { datas: e });
}
var Qv = Rn("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var r = t.props, n = r.edgeDraggable;
    return n ? Wu(e, "edgeDraggable", n, t.getState().renderPoses, r.zoom) : [];
  },
  dragCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && te(a, vt("direction")) && te(a, vt("edge")) && te(a, vt("edgeDraggable"));
  },
  dragStart: function(t, e) {
    return ce.dragStart(t, Pr(e));
  },
  drag: function(t, e) {
    return ce.drag(t, Pr(e));
  },
  dragEnd: function(t, e) {
    return ce.dragEnd(t, Pr(e));
  },
  dragGroupCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && te(a, vt("direction")) && te(a, vt("line"));
  },
  dragGroupStart: function(t, e) {
    return ce.dragGroupStart(t, Pr(e));
  },
  dragGroup: function(t, e) {
    return ce.dragGroup(t, Pr(e));
  },
  dragGroupEnd: function(t, e) {
    return ce.dragGroupEnd(t, Pr(e));
  },
  unset: function(t) {
    return ce.unset(t);
  }
}), jc = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, tg = [
  Ic,
  kc,
  nv,
  Cv,
  ce,
  Qv,
  Zi,
  wv,
  Dv,
  Gh,
  Iv,
  Rv,
  _v,
  Yv,
  Wv,
  qv,
  $o,
  jc,
  Jv,
  Dc,
  Rc
];
function El(t, e) {
  var r = N(t, 3), n = r[0], a = r[1], i = r[2];
  return (n * e[0] + a * e[1] + i) / Math.sqrt(n * n + a * a);
}
function ca(t, e) {
  var r = N(t, 2), n = r[0], a = r[1];
  return -n * e[0] - a * e[1];
}
function Dl(t, e) {
  return Math.max.apply(Math, et([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function kl(t, e) {
  return Math.min.apply(Math, et([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function eg(t, e) {
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
  var f = Ct(e, pe);
  if (f % 90) {
    var d = f / 180 * Math.PI, h = Math.tan(d), v = -1 / h, m = [qi, Us], x = [[0, 0], [0, 0]], y = [qi, Us], C = [[0, 0], [0, 0]];
    t.forEach(function(at) {
      at.forEach(function(Q) {
        var nt = El([-h, 1, 0], Q), J = El([-v, 1, 0], Q);
        m[0] > nt && (x[0] = Q, m[0] = nt), m[1] < nt && (x[1] = Q, m[1] = nt), y[0] > J && (C[0] = Q, y[0] = J), y[1] < J && (C[1] = Q, y[1] = J);
      });
    });
    var w = N(x, 2), D = w[0], M = w[1], E = N(C, 2), k = E[0], T = E[1], g = [-h, 1, ca([-h, 1], D)], _ = [-h, 1, ca([-h, 1], M)], j = [-v, 1, ca([-v, 1], k)], R = [-v, 1, ca([-v, 1], T)];
    r = N([
      [g, j],
      [g, R],
      [_, j],
      [_, R]
    ].map(function(at) {
      var Q = N(at, 2), nt = Q[0], J = Q[1];
      return Eo(nt, J)[0];
    }), 4), i = r[0], o = r[1], s = r[2], l = r[3], u = y[1] - y[0], c = m[1] - m[0];
  } else {
    var P = kl(t, 0), z = kl(t, 1), B = Dl(t, 0), Y = Dl(t, 1);
    if (i = [P, z], o = [B, z], s = [P, Y], l = [B, Y], u = B - P, c = Y - z, f % 180) {
      var H = [s, i, l, o];
      n = N(H, 4), i = n[0], o = n[1], s = n[2], l = n[3], u = Y - z, c = B - P;
    }
  }
  if (f % 360 > 180) {
    var H = [l, s, o, i];
    a = N(H, 4), i = a[0], o = a[1], s = a[2], l = a[3];
  }
  var L = Cr([i, o, s, l]), $ = L.minX, Z = L.minY, F = L.maxX, rt = L.maxY;
  return {
    pos1: i,
    pos2: o,
    pos3: s,
    pos4: l,
    width: u,
    height: c,
    minX: $,
    minY: Z,
    maxX: F,
    maxY: rt,
    rotation: e
  };
}
function zc(t, e) {
  var r = e.map(function(n) {
    if (qt(n)) {
      var a = zc(t, n), i = a.length;
      return i > 1 ? a : i === 1 ? a[0] : null;
    } else {
      var o = be(t, function(s) {
        var l = s.manager;
        return l.props.target === n;
      });
      return o ? (o.finded = !0, o.manager) : null;
    }
  }).filter(Boolean);
  return r.length === 1 && qt(r[0]) ? r[0] : r;
}
var rg = /* @__PURE__ */ (function(t) {
  In(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.differ = new Su(), r.moveables = [], r.transformOrigin = "50% 50%", r.renderGroupRects = [], r._targetGroups = [], r._hasFirstTargets = !1, r;
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
    Hr(!0), this.moveables.forEach(function(dt) {
      dt.updateRect(r, !1, !1);
    });
    var s = this.props, l = this.moveables, u = o.target || s.target, c = l.map(function(dt) {
      return { finded: !1, manager: dt };
    }), f = this.props.targetGroups || [], d = zc(c, f), h = s.useDefaultGroupRotate;
    d.push.apply(d, et([], N(c.filter(function(dt) {
      var yt = dt.finded;
      return !yt;
    }).map(function(dt) {
      var yt = dt.manager;
      return yt;
    })), !1));
    var v = [], m = !n || r !== "" && s.updateGroup, x = s.defaultGroupRotate || 0;
    if (!this._hasFirstTargets) {
      var y = (i = s.persistData) === null || i === void 0 ? void 0 : i.rotation;
      y != null && (x = y);
    }
    function C(dt, yt, ft) {
      var K = dt.map(function(_t) {
        if (qt(_t)) {
          var ht = C(_t, yt), kt = [ht.pos1, ht.pos2, ht.pos3, ht.pos4];
          return v.push(ht), { poses: kt, rotation: ht.rotation };
        } else
          return {
            poses: Te(_t.state),
            rotation: _t.getRotation()
          };
      }), ct = K.map(function(_t) {
        var ht = _t.rotation;
        return ht;
      }), wt = 0, xt = ct[0], pt = ct.every(function(_t) {
        return Math.abs(xt - _t) < 0.1;
      });
      m ? wt = !h && pt ? xt : x : wt = !h && !ft && pt ? xt : yt;
      var bt = K.map(function(_t) {
        var ht = _t.poses;
        return ht;
      }), St = eg(bt, wt);
      return St;
    }
    var w = C(d, this.rotation, !0);
    m && (this.rotation = w.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = f, this.renderGroupRects = v;
    var D = this.transformOrigin, M = this.rotation, E = this.scale, k = w.width, T = w.height, g = w.minX, _ = w.minY, j = Sv([
      [0, 0],
      [k, 0],
      [0, T],
      [k, T]
    ], Wo(D, k, T), this.rotation / 180 * Math.PI), R = Cr(j.result), P = R.minX, z = R.minY, B = " rotate(".concat(M, "deg)") + " scale(".concat(fe(E[0]), ", ").concat(fe(E[1]), ")"), Y = "translate(".concat(-P, "px, ").concat(-z, "px)").concat(B);
    this.controlBox.style.transform = "translate3d(".concat(g, "px, ").concat(_, "px, ").concat(this.props.translateZ || 0, ")"), u.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(D, ";") + "width:".concat(k, "px;height:").concat(T, "px;") + "transform: ".concat(Y), o.width = k, o.height = T;
    var H = this.getContainer(), L = ao(this.controlBox, u, this.controlBox, this.getContainer(), this._rootContainer || H, []), $ = [L.left, L.top], Z = N(Te(L), 4), F = Z[0], rt = Z[1], at = Z[2], Q = Z[3], nt = Cr([F, rt, at, Q]), J = [nt.minX, nt.minY], st = fe(E[0] * E[1]);
    L.pos1 = gt(F, J), L.pos2 = gt(rt, J), L.pos3 = gt(at, J), L.pos4 = gt(Q, J), L.left = g - L.left + J[0], L.top = _ - L.top + J[1], L.origin = gt(Pt($, L.origin), J), L.beforeOrigin = gt(Pt($, L.beforeOrigin), J), L.originalBeforeOrigin = Pt($, L.originalBeforeOrigin), L.transformOrigin = gt(Pt($, L.transformOrigin), J), u.style.transform = "translate(".concat(-P - J[0], "px, ").concat(-z - J[1], "px)") + B, Hr(), this.updateState(O(O({}, L), { posDelta: J, direction: st, beforeDirection: st }), a);
  }, e.prototype.getRect = function() {
    return O(O({}, t.prototype.getRect.call(this)), { children: this.moveables.map(function(r) {
      return r.getRect();
    }) });
  }, e.prototype.triggerEvent = function(r, n, a) {
    if (a || r.indexOf("Group") > -1)
      return t.prototype.triggerEvent.call(this, r, n);
    this._emitter.trigger(r, n);
  }, e.prototype.getRequestChildStyles = function() {
    var r = this.getEnabledAbles().reduce(function(n, a) {
      var i, o, s = (o = (i = a.requestChildStyle) === null || i === void 0 ? void 0 : i.call(a)) !== null && o !== void 0 ? o : [];
      return et(et([], N(n), !1), N(s), !1);
    }, []);
    return r;
  }, e.prototype.getMoveables = function() {
    return et([], N(this.moveables), !1);
  }, e.prototype.updateAbles = function() {
    t.prototype.updateAbles.call(this, et(et([], N(this.props.ables), !1), [$o], !1), "Group");
  }, e.prototype._updateTargets = function() {
    t.prototype._updateTargets.call(this), this._originalDragTarget = this.props.dragTarget || this.areaElement, this._dragTarget = He(this._originalDragTarget, !0);
  }, e.prototype._updateEvents = function() {
    var r = this.state, n = this.props, a = this._prevDragTarget, i = n.dragTarget || this.areaElement, o = n.targets, s = this.differ.update(o), l = s.added, u = s.changed, c = s.removed, f = l.length || c.length;
    (f || this._prevOriginalDragTarget !== this._originalDragTarget) && (Gr(this, !1), Gr(this, !0), this.updateState({ gestos: {} })), a !== i && (r.target = null), r.target || (r.target = this.areaElement, this.controlBox.style.display = "block"), r.target && (this.targetGesto || (this.targetGesto = Pc(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = Oc(this, "GroupControl")));
    var d = !ro(r.container, n.container);
    d && (r.container = n.container), (d || f || this.transformOrigin !== (n.defaultGroupOrigin || "50% 50%") || u.length || o.length && !Cc(this._targetGroups, n.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!f;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = O(O({}, Vr.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Vr), ng = /* @__PURE__ */ (function(t) {
  In(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.moveables = [], r;
  }
  return e.prototype.render = function() {
    var r = this, n, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], u = l.length, c = this.isUnmounted || !u, f = (n = s == null ? void 0 : s.children) !== null && n !== void 0 ? n : [];
    return c && !u && f.length ? l = f.map(function() {
      return null;
    }) : c || (f = []), tt.createElement(o, { cspNonce: i, ref: ir(this, "controlBox"), className: vt("control-box") }, l.map(function(d, h) {
      var v, m, x = (m = (v = a.individualGroupableProps) === null || v === void 0 ? void 0 : v.call(a, d, h)) !== null && m !== void 0 ? m : {};
      return tt.createElement(Vr, O({ key: "moveable" + h, ref: uu(r, "moveables", h) }, a, x, { target: d, wrapperMoveable: r, isWrapperMounted: r.isMoveableMounted, persistData: f[h] }));
    }));
  }, e.prototype.componentDidMount = function() {
  }, e.prototype.componentDidUpdate = function() {
  }, e.prototype.getTargets = function() {
    return this.props.targets;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0), Hr(!0), this.moveables.forEach(function(i) {
      i.updateRect(r, n, a);
    }), Hr();
  }, e.prototype.getRect = function() {
    return O(O({}, t.prototype.getRect.call(this)), { children: this.moveables.map(function(r) {
      return r.getRect();
    }) });
  }, e.prototype.request = function(r, n, a) {
    n === void 0 && (n = {});
    var i = this.moveables.map(function(l) {
      return l.request(r, O(O({}, n), { isInstant: !1 }), !1);
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
    var a = n, i = be(this.moveables, function(o) {
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
    return et([], N(this.moveables), !1);
  }, e.prototype.updateRenderPoses = function() {
  }, e.prototype.checkUpdate = function() {
  }, e.prototype.triggerEvent = function() {
  }, e.prototype.updateAbles = function() {
  }, e.prototype._updateEvents = function() {
  }, e.prototype._updateObserver = function() {
  }, e;
})(Vr);
function Ac(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (Me(n)) {
        e[n] && r.push.apply(r, et([], N(e[n]), !1));
        return;
      }
      qt(n) ? r.push.apply(r, et([], N(Ac(n, e)), !1)) : r.push(n);
    }
  }), r;
}
function Bc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (Me(n)) {
        e[n] && r.push.apply(r, et([], N(e[n]), !1));
        return;
      }
      qt(n) ? r.push(Bc(n, e)) : r.push(n);
    }
  }), r;
}
function Gc(t, e) {
  return t.length !== e.length || t.some(function(r, n) {
    var a = e[n];
    return !r && !a ? !1 : r != a ? qt(r) && qt(a) ? Gc(r, a) : !0 : !1;
  });
}
var ag = /* @__PURE__ */ (function(t) {
  In(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.refTargets = [], r.selectorMap = {}, r._differ = new Su(), r._elementTargets = [], r._tmpRefTargets = [], r._tmpSelectorMap = {}, r._onChangeTargets = null, r;
  }
  return e.makeStyled = function() {
    var r = {}, n = this.getTotalAbles();
    n.forEach(function(i) {
      var o = i.css;
      o && o.forEach(function(s) {
        r[s] = !0;
      });
    });
    var a = Kr(r).join(`
`);
    this.defaultStyled = Mu("div", _d(ko, Wp + a));
  }, e.getTotalAbles = function() {
    return et([kc, $o, jc, Dc], N(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var r, n = this.constructor;
    n.defaultStyled || n.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = Tp(a, ["ables", "props"]), l = N(this._updateRefs(!0), 2), u = l[0], c = l[1], f = Ac(u, c), d = f.length > 1, h = n.getTotalAbles(), v = et(et([], N(h), !1), N(i || []), !1), m = O(O(O({}, s), o || {}), { ables: v, cssStyled: n.defaultStyled, customStyledMap: n.customStyledMap });
    this._elementTargets = f;
    var x = null, y = this.moveable, C = s.persistData;
    if (C != null && C.children && (d = !0), s.individualGroupable)
      return tt.createElement(ng, O({ key: "individual-group", ref: ir(this, "moveable") }, m, { target: null, targets: f }));
    if (d) {
      var w = Bc(u, c);
      if (y && !y.props.groupable && !y.props.individualGroupable) {
        var D = y.props.target;
        D && f.indexOf(D) > -1 && (x = O({}, y.state));
      }
      return tt.createElement(rg, O({ key: "group", ref: ir(this, "moveable") }, m, (r = s.groupableProps) !== null && r !== void 0 ? r : {}, { target: null, targets: f, targetGroups: w, firstRenderState: x }));
    } else {
      var M = f[0];
      if (y && (y.props.groupable || y.props.individualGroupable)) {
        var E = y.moveables || [], k = be(E, function(T) {
          return T.props.target === M;
        });
        k && (x = O({}, k.state));
      }
      return tt.createElement(Vr, O({ key: "single", ref: ir(this, "moveable") }, m, { target: M, firstRenderState: x }));
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
    var n = this.refTargets, a = Lo(this.props.target || this.props.targets), i = typeof document < "u", o = Gc(n, a), s = this.selectorMap, l = {};
    return this.refTargets.forEach(function u(c) {
      if (Me(c)) {
        var f = s[c];
        f ? l[c] = s[c] : i && (o = !0, l[c] = [].slice.call(document.querySelectorAll(c)));
      } else qt(c) && c.forEach(u);
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
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, Ip([
    cu(Hp)
  ], e.prototype, "moveable", void 0), e;
})(tt.PureComponent), ig = /* @__PURE__ */ (function(t) {
  In(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = tg, e;
})(ag), io = function(t, e) {
  return io = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, io(t, e);
};
function og(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  io(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
function sg(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var Nn = sg(function(t, e) {
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
Nn.code;
Nn.codes;
Nn.aliases;
var lg = Nn.names;
Nn.title;
var Ml = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, _l = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function Fc(t, e) {
  var r = (lg[t] || e || "").toLowerCase();
  for (var n in Ml)
    r = r.replace(n, Ml[n]);
  return r.replace(/\s/g, "");
}
function Lc(t, e) {
  e === void 0 && (e = Fc(t.keyCode, t.key));
  var r = ug(t);
  return r.indexOf(e) === -1 && r.push(e), r.filter(Boolean);
}
function ug(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function Tl(t) {
  var e = t.slice();
  return e.sort(function(r, n) {
    var a = _l[r] || 5, i = _l[n] || 5;
    return a - i;
  }), e;
}
var Il, cg = /* @__PURE__ */ (function(t) {
  og(e, t);
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
      return Il || (Il = new e());
    },
    enumerable: !1,
    configurable: !0
  }), e.setGlobal = function() {
    return this.global;
  }, r.destroy = function() {
    var n = this.container;
    this.clear(), this.off(), $t(n, "blur", this.blur), $t(n, "keydown", this.keydownEvent), $t(n, "keyup", this.keyupEvent);
  }, r.keydown = function(n, a) {
    return this.addEvent("keydown", n, a);
  }, r.offKeydown = function(n, a) {
    return this.removeEvent("keydown", n, a);
  }, r.offKeyup = function(n, a) {
    return this.removeEvent("keyup", n, a);
  }, r.keyup = function(n, a) {
    return this.addEvent("keyup", n, a);
  }, r.addEvent = function(n, a, i) {
    return qt(a) ? this.on("".concat(n, ".").concat(Tl(a).join(".")), i) : Me(a) ? this.on("".concat(n, ".").concat(a), i) : this.on(n, a), this;
  }, r.removeEvent = function(n, a, i) {
    return qt(a) ? this.off("".concat(n, ".").concat(Tl(a).join(".")), i) : Me(a) ? this.off("".concat(n, ".").concat(a), i) : this.off(n, a), this;
  }, r.triggerEvent = function(n, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = Fc(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
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
    var l = Lc(a, i);
    l.length > 1 && this.trigger("".concat(n, ".").concat(l.join(".")), s);
  }, e;
})(Tn), oo = function(t, e) {
  return oo = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, oo(t, e);
};
function Wc(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  oo(t, e);
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
function fg(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function dg(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function bn(t, e, r) {
  for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function pg(t) {
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
function hg(t) {
  if (typeof Map > "u")
    return t.filter(function(r, n) {
      return t.indexOf(r) === n;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(r) {
    return e.has(r) ? !1 : (e.set(r, !0), !0);
  });
}
function vg(t, e, r) {
  var n = Oe(t);
  return n.elementFromPoint && n.elementFromPoint(e, r) || null;
}
function Yc(t, e, r) {
  var n = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || Oe(r).createElement(n);
  for (var u in i)
    l.setAttribute(u, i[u]);
  var c = l.children;
  if (a.forEach(function(d, h) {
    Yc(d, c[h], l);
  }), o && o.split(/\s+/g).forEach(function(d) {
    d && !te(l, d) && xo(l, d);
  }), s) {
    var f = l.style;
    for (var u in s)
      f[u] = s[u];
  }
  return !e && r && r.appendChild(l), l;
}
function gg(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, u = fg(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: u,
    children: r
  };
}
function wi(t, e, r) {
  t !== e && r(t, e);
}
function Rl(t, e, r) {
  var n;
  r === void 0 && (r = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, u = l.startX, c = l.startY;
  if (e > 0) {
    var f = Math.sqrt((i * i + s * s) / (1 + e * e)), d = e * f;
    i = (i >= 0 ? 1 : -1) * d, s = (s >= 0 ? 1 : -1) * f;
  }
  var h = Math.abs(i), v = Math.abs(s), m = i < 0 ? u - r.left : r.right - u, x = s < 0 ? c - r.top : r.bottom - c;
  n = mo([h, v], [0, 0], [m, x], !!e), h = n[0], v = n[1], i = (i >= 0 ? 1 : -1) * h, s = (s >= 0 ? 1 : -1) * v;
  var y = Math.min(0, i), C = Math.min(0, s), w = u + y, D = c + C;
  return {
    left: w,
    top: D,
    right: w + h,
    bottom: D + v,
    width: h,
    height: v
  };
}
function fa(t) {
  var e = t.getBoundingClientRect(), r = e.left, n = e.top, a = e.width, i = e.height;
  return {
    pos1: [r, n],
    pos2: [r + a, n],
    pos3: [r, n + i],
    pos4: [r + a, n + i]
  };
}
function Pl(t, e, r) {
  var n = jr(t, e), a = n.list, i = n.prevList, o = n.added, s = n.removed, l = n.maintained;
  return bn(bn(bn([], o.map(function(u) {
    return a[u];
  }), !0), s.map(function(u) {
    return i[u];
  }), !0), r ? l.map(function(u) {
    var c = u[1];
    return a[c];
  }) : []);
}
function Ol(t) {
  for (var e = 0, r = t.length, n = 1; n < r; ++n)
    e = Math.max(Xe(t[n], t[n - 1]), e);
  return e;
}
var Xc = ku(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), so = "selecto-selection ".concat(Xc.className), qo = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], mg = bn([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], qo), Hc = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], xg = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], yg = /* @__PURE__ */ (function(t) {
  Wc(e, t);
  function e(n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new Cu(), a._onDragStart = function(s, l) {
      var u = s.data, c = s.clientX, f = s.clientY, d = s.inputEvent, h = a.options, v = h.selectFromInside, m = h.selectByClick, x = h.rootContainer, y = h.boundContainer, C = h.preventDragFromInside, w = C === void 0 ? !0 : C, D = h.clickBySelectEnd, M = h.dragCondition;
      if (M && !M(s)) {
        s.stop();
        return;
      }
      u.data = {};
      var E = De(a.container);
      u.innerWidth = E.innerWidth, u.innerHeight = E.innerHeight, a.findSelectableTargets(u), u.startSelectedTargets = a.selectedTargets, u.scaleMatrix = Co(), u.containerX = 0, u.containerY = 0;
      var k = a.container, T = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (x) {
        var g = a.container.getBoundingClientRect();
        u.containerX = g.left, u.containerY = g.top, u.scaleMatrix = tp(a.container, x);
      }
      if (y) {
        var _ = ye(y) && "element" in y ? Zt({
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
        }, j = _.element, R = void 0;
        if (j) {
          Me(j) ? R = Oe(k).querySelector(j) : j === !0 ? R = a.container : R = j;
          var P = R.getBoundingClientRect();
          _.left && (T.left = P.left), _.top && (T.top = P.top), _.right && (T.right = P.right), _.bottom && (T.bottom = P.bottom);
        }
      }
      u.boundArea = T;
      var z = {
        left: c,
        top: f,
        right: c,
        bottom: f,
        width: 0,
        height: 0
      }, B = [], Y = m && !D, H = !1;
      if (!v || Y) {
        var L = a._findElement(
          l || d.target,
          // elementFromPoint(clientX, clientY),
          u.selectableTargets
        );
        H = !!L, Y && (B = L ? [L] : []);
      }
      var $ = !v && H;
      if ($ && !m)
        return s.stop(), !1;
      var Z = d.type, F = Z === "mousedown" || Z === "touchstart", rt = !s.isClick && F ? a.emit("dragStart", Zt(Zt({}, s), {
        data: u.data
      })) : !0;
      if (!rt)
        return s.stop(), !1;
      if (a.continueSelect ? (B = Pl(a.selectedTargets, B, a.continueSelectWithoutDeselect), u.startPassedTargets = a.selectedTargets) : u.startPassedTargets = [], a._select(B, z, s, !0, $ && m && !D && w), u.startX = c, u.startY = f, u.selectFlag = !1, u.preventDragFromInside = !1, d.target) {
        var at = ma(u.scaleMatrix, [c - u.containerX, f - u.containerY]);
        a.target.style.cssText += "position: ".concat(x ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(at[0], "px, ").concat(at[1], "px)");
      }
      if ($ && m && !D)
        d.preventDefault(), w && (a._selectEnd(u.startSelectedTargets, u.startPassedTargets, z, s, !0), u.preventDragFromInside = !0);
      else {
        u.selectFlag = !0;
        var Q = a.options, nt = Q.scrollOptions, J = Q.innerScrollOptions, st = !1;
        if (J) {
          for (var dt = s.inputEvent, yt = dt.target, ft = null, K = yt; K && K !== Oe(k).body; ) {
            var ct = getComputedStyle(K).overflow !== "visible";
            if (ct) {
              ft = K;
              break;
            }
            K = K.parentElement;
          }
          ft && (u.innerScrollOptions = Zt({
            container: ft,
            checkScrollEvent: !0
          }, J === !0 ? {} : J), a.dragScroll.dragStart(s, u.innerScrollOptions), st = !0);
        }
        !st && nt && nt.container && a.dragScroll.dragStart(s, nt), $ && m && D && (u.selectFlag = !1, s.preventDrag());
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
      var l = s.data, u = s.inputEvent, c = Rl(s, a.options.ratio), f = l.selectFlag, d = a.container;
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
        var h = a._findElement((u == null ? void 0 : u.target) || vg(d, s.clientX, s.clientY), l.selectableTargets);
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
      var l = Oe(a.container);
      if (a.gesto.isFlag()) {
        var u = a.dragContainer;
        u === De(a.container) && (u = l.documentElement);
        var c = En(u) ? [u] : [].slice.call(u), f = s.target;
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
      getElementRect: fa,
      cspNonce: "",
      ratio: 0
    }, n);
    var o = a.options.portalContainer;
    return o && (i = o.parentElement), a.container = i || document.body, a.initElement(), a.initDragScroll(), a.setKeyController(), a;
  }
  var r = e.prototype;
  return r.setSelectedTargets = function(n) {
    var a = this.selectedTargets, i = jr(a, n), o = i.added, s = i.removed, l = i.prevList, u = i.list;
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
    this.off(), this.keycon && this.keycon.destroy(), this.gesto.unset(), this.injectResult.destroy(), this.dragScroll.dragEnd(), $t(document, "selectstart", this._onDocumentSelectStart), this.options.portalContainer || (n = this.target.parentElement) === null || n === void 0 || n.removeChild(this.target), this.keycon = null, this.gesto = null, this.injectResult = null, this.target = null, this.container = null, this.options = null;
  }, r.getElementPoints = function(n) {
    var a = this.getElementRect || fa, i = a(n), o = [i.pos1, i.pos2, i.pos4, i.pos3];
    if (a !== fa) {
      var s = n.getBoundingClientRect();
      return Fi(o, s);
    }
    return o;
  }, r.getSelectableElements = function() {
    var n = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (Ba(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (En(i))
        a.push(i);
      else if (ye(i))
        a.push(i.value || i.current);
      else {
        var s = [].slice.call(Oe(n).querySelectorAll(i));
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
    var s = this.options, l = s.checkOverflow || s.innerScrollOptions, u = Oe(this.container);
    if (l) {
      var c = /* @__PURE__ */ new Map();
      n.selectableInnerScrollParentMap = c, n.selectableInnerScrollPathsList = i.map(function(f, d) {
        for (var h = f.parentElement, v = [], m = [], x = function() {
          var y = c.get(h);
          if (!y) {
            var C = getComputedStyle(h).overflow !== "visible";
            if (C) {
              var w = fa(h);
              y = {
                parentElement: h,
                indexes: [],
                points: [w.pos1, w.pos2, w.pos4, w.pos3],
                paths: bn([], m)
              }, v.push(h), v.forEach(function(D) {
                c.set(D, y);
              }), v = [];
            }
          }
          y ? (h = y.parentElement, c.get(h).indexes.push(d), m.push(h)) : v.push(h), h = h.parentElement;
        }; h && h !== u.body; )
          x();
        return m;
      });
    }
    return s.checkOverflow || (n.selectableInners = i.map(function() {
      return !0;
    })), this._refreshGroups(n), i;
  }, r.clickTarget = function(n, a) {
    var i = pg(n), o = i.clientX, s = i.clientY, l = {
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
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new cg(a || De(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, r.setClassName = function(n) {
    this.options.className = n, this.target.setAttribute("class", "".concat(so, " ").concat(n || ""));
  }, r.setKeyEvent = function() {
    var n = this.options, a = n.toggleContinueSelect, i = n.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, r.setKeyContainer = function(n) {
    var a = this, i = this.options;
    wi(i.keyContainer, n, function() {
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
    wi(i.toggleContinueSelect, n, function() {
      i.toggleContinueSelect = n, a.setKeyEvent();
    });
  }, r.setToggleContinueSelectWithoutDeselect = function(n) {
    var a = this, i = this.options;
    wi(i.toggleContinueSelectWithoutDeselect, n, function() {
      i.toggleContinueSelectWithoutDeselect = n, a.setKeyEvent();
    });
  }, r.setPreventDefault = function(n) {
    this.gesto.options.preventDefault = n;
  }, r.setCheckInput = function(n) {
    this.gesto.options.checkInput = n;
  }, r.initElement = function() {
    var n = this.options, a = n.dragContainer, i = n.checkInput, o = n.preventDefault, s = n.preventClickEventOnDragStart, l = n.preventClickEventOnDrag, u = n.preventClickEventByCondition, c = n.preventRightClick, f = c === void 0 ? !0 : c, d = n.className, h = this.container;
    this.target = Yc(gg("div", {
      className: "".concat(so, " ").concat(d || "")
    }), this.target, h);
    var v = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(Oe(h).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new Du(this.dragContainer, {
      checkWindowBlur: !0,
      container: De(h),
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
    }), Jt(document, "selectstart", this._onDocumentSelectStart), this.injectResult = Xc.inject(v, {
      nonce: this.options.cspNonce
    });
  }, r.hitTest = function(n, a, i, o) {
    var s = this.options, l = s.hitRate, u = s.selectByClick, c = n.left, f = n.top, d = n.right, h = n.bottom, v = a.innerGroups, m = a.innerWidth, x = a.innerHeight, y = o == null ? void 0 : o.clientX, C = o == null ? void 0 : o.clientY, w = a.ignoreClick, D = [[c, f], [d, f], [d, h], [c, h]], M = function(L, $) {
      var Z = yr(typeof l == "function" ? "".concat(l($)) : "".concat(l)), F = w ? !1 : Da([y, C], L);
      if (!i && u && F)
        return !0;
      var rt = Wi(D, L);
      if (!rt.length)
        return !1;
      var at = hn(rt), Q = 0;
      if (at === 0 && hn(L) === 0 ? (Q = Ol(L), at = Ol(rt)) : Q = hn(L), Z.unit === "px")
        return at >= Z.value;
      var nt = wa(Math.round(at / Q * 100), 0, 100);
      return nt >= Math.min(100, Z.value);
    }, E = a.selectableTargets, k = a.selectablePoints, T = a.selectableInners;
    if (!v)
      return E.filter(function(L, $) {
        return T[$] ? M(k[$], E[$]) : !1;
      });
    for (var g = [], _ = Math.floor(c / m), j = Math.floor(d / m), R = Math.floor(f / x), P = Math.floor(h / x), z = _; z <= j; ++z) {
      var B = v[z];
      if (B)
        for (var Y = R; Y <= P; ++Y) {
          var H = B[Y];
          H && H.forEach(function(L) {
            var $ = k[L], Z = T[L], F = E[L];
            Z && M($, F) && g.push(F);
          });
        }
    }
    return hg(g);
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
          var v = u.selectableInnerScrollParentMap, m = v.get(d);
          m && (m.paths.forEach(function(x) {
            var y = v.get(x);
            y.points.forEach(function(C) {
              C[0] -= i, C[1] -= o;
            });
          }), m.indexes.forEach(function(x) {
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
    var l = i.inputEvent, u = i.data, c = this.setSelectedTargets(n), f = jr(u.startSelectedTargets, n), d = f.added, h = f.removed, v = f.prevList, m = f.list, x = {
      startSelected: v,
      startAdded: d.map(function(y) {
        return m[y];
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
    var l = o.inputEvent, u = o.isDouble, c = o.data, f = l && l.type, d = f === "mousedown" || f === "touchstart", h = jr(n, this.selectedTargets), v = h.added, m = h.removed, x = h.prevList, y = h.list, C = jr(a, this.selectedTargets), w = C.added, D = C.removed, M = C.prevList, E = C.list;
    this.emit("selectEnd", {
      startSelected: n,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: v.map(function(k) {
        return y[k];
      }),
      removed: m.map(function(k) {
        return x[k];
      }),
      afterAdded: w.map(function(k) {
        return E[k];
      }),
      afterRemoved: D.map(function(k) {
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
    a === void 0 && (a = Rl(n, this.options.ratio));
    var i = n.data, o = a.top, s = a.left, l = a.width, u = a.height, c = i.selectFlag, f = i.containerX, d = i.containerY, h = i.scaleMatrix, v = ma(h, [s - f, o - d]), m = ma(h, [l, u]), x = [];
    if (c) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(v[0], "px, ").concat(v[1], "px);") + "width:".concat(m[0], "px;height:").concat(m[1], "px;");
      var y = this.hitTest(a, i, !0, n);
      x = Pl(i.startPassedTargets, y, this.continueSelect && this.continueSelectWithoutDeselect);
    }
    var C = this.emit("drag", Zt(Zt({}, n), {
      data: i.data,
      isSelect: c,
      rect: a
    }));
    if (C === !1) {
      this.target.style.cssText += "display: none;", n.stop();
      return;
    }
    c && this._select(x, a, n);
  }, r._sameCombiKey = function(n, a, i) {
    if (!a)
      return !1;
    var o = Lc(n.inputEvent, n.key), s = [].concat(a), l = qt(s[0]) ? s : [s];
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
        var m = !1;
        return h.every(function(x) {
          if (m)
            return !0;
          if (x === l)
            return m = !0, !0;
          var y = u.get(x);
          if (y) {
            var C = s[v], w = y.points, D = Wi(C, w);
            if (!D.length)
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
        var m = 1 / 0, x = -1 / 0, y = 1 / 0, C = -1 / 0;
        h.forEach(function(M) {
          var E = Math.floor(M[0] / i), k = Math.floor(M[1] / o);
          m = Math.min(E, m), x = Math.max(E, x), y = Math.min(k, y), C = Math.max(k, C);
        });
        for (var w = m; w <= x; ++w)
          for (var D = y; D <= C; ++D)
            d[w] = d[w] || {}, d[w][D] = d[w][D] || [], d[w][D].push(v);
      }), n.innerGroups = d;
    }
  }, e = dg([Td(qo, function(n, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = Ni("get ".concat(a));
    n[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = Ni("set ".concat(a));
    n[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(n, a, i);
  })], e), e;
})(Tn), bg = /* @__PURE__ */ (function(t) {
  Wc(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})(yg), lo = function(t, e) {
  return lo = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, lo(t, e);
};
function Sg(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  lo(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var ja = function() {
  return ja = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, ja.apply(this, arguments);
};
function Cg(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
var Nl = Hc.map(function(t) {
  return Ni("on ".concat(t));
}), wg = /* @__PURE__ */ (function(t) {
  Sg(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var r = e.prototype;
  return r.render = function() {
    return tt.createElement("div", {
      className: so,
      ref: ir(this, "selectionElement")
    });
  }, r.componentDidMount = function() {
    var n = this, a = this.props, i = {};
    mg.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new bg(ja(ja({}, i), {
      portalContainer: this.selectionElement
    })), Hc.forEach(function(o, s) {
      n.selecto.on(o, function(l) {
        var u = n.props, c = u[Nl[s]] && u[Nl[s]](l);
        c === !1 && l.stop();
      });
    });
  }, r.componentDidUpdate = function(n) {
    var a = this.props, i = this.selecto;
    qo.forEach(function(o) {
      n[o] !== a[o] && (i[o] = a[o]);
    });
  }, r.componentWillUnmount = function() {
    this.selecto.destroy();
  }, Cg([cu(xg)], e.prototype, "selecto", void 0), e;
})(tt.PureComponent);
function da(t, e, r) {
  const n = e + r;
  if (n < 0 || n >= t.length) return t.slice();
  const a = t.slice(), [i] = a.splice(e, 1);
  return a.splice(n, 0, i), a;
}
function Eg({ recipe: t, onChange: e }) {
  const { t: r } = Ur(), n = (c) => e({ ...t, ...c }), a = (c) => {
    var f;
    return ((f = t.display.find((d) => d.slot === c)) == null ? void 0 : f.name) ?? `#${c}`;
  }, i = (c) => {
    var f;
    return ((f = t.display.find((d) => d.slot === c)) == null ? void 0 : f.colour) ?? "#888";
  }, o = (c, f) => n({ columns: t.columns.map((d, h) => h === c ? { ...d, ...f } : d) }), s = new Set(t.columns.filter((c) => c.kind === "channel").map((c) => c.slot)), l = t.columns.some((c) => c.kind === "merge"), u = t.display.filter((c) => !s.has(c.slot));
  return /* @__PURE__ */ S.jsxs("div", { className: "gl-cellpanel-editor", children: [
    /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: r("Cells from the Images tab as rows and image channels as columns; every part can be changed here. The pictures are drawn from the file's images.") }),
    /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
      r("Title"),
      /* @__PURE__ */ S.jsx("input", { value: t.title ?? "", onChange: (c) => n({ title: c.target.value }) })
    ] }),
    /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
      r("Tile size"),
      /* @__PURE__ */ S.jsx("input", { type: "number", min: 16, max: 240, value: t.tile, onChange: (c) => n({ tile: Math.max(16, Math.min(240, Math.round(Number(c.target.value) || 64))) }) })
    ] }),
    /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
      r("Exposure"),
      /* @__PURE__ */ S.jsx("input", { type: "range", min: -2, max: 2, step: 0.05, value: Math.log2(t.exposure), onChange: (c) => n({ exposure: Math.pow(2, Number(c.target.value)) }) })
    ] }),
    /* @__PURE__ */ S.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ S.jsx("input", { type: "checkbox", checked: t.transpose === !0, onChange: (c) => n({ transpose: c.target.checked }) }),
      r("Cells as columns")
    ] }),
    /* @__PURE__ */ S.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ S.jsx("input", { type: "checkbox", checked: t.showHeaders !== !1, onChange: (c) => n({ showHeaders: c.target.checked }) }),
      r("Channel names")
    ] }),
    /* @__PURE__ */ S.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ S.jsx("input", { type: "checkbox", checked: t.showLabels !== !1, onChange: (c) => n({ showLabels: c.target.checked }) }),
      r("Cell labels")
    ] }),
    /* @__PURE__ */ S.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ S.jsx("input", { type: "checkbox", checked: t.outline === !0, onChange: (c) => n({ outline: c.target.checked }) }),
      r("Mask outline")
    ] }),
    /* @__PURE__ */ S.jsx("div", { className: "gl-cellpanel-section", children: r("Channels shown") }),
    /* @__PURE__ */ S.jsx("ol", { className: "gl-cellpanel-list", "aria-label": r("Channels shown"), children: t.columns.map((c, f) => {
      var d;
      return /* @__PURE__ */ S.jsxs("li", { className: "gl-cellpanel-row" + (c.hidden ? " is-off" : ""), children: [
        /* @__PURE__ */ S.jsx(
          "input",
          {
            type: "checkbox",
            checked: !c.hidden,
            "aria-label": r("Show {column}", { column: c.header || a(c.slot ?? -1) }),
            title: r("Show this column"),
            disabled: !c.hidden && t.columns.filter((h) => !h.hidden).length <= 1,
            onChange: (h) => o(f, { hidden: !h.target.checked })
          }
        ),
        c.kind === "channel" && c.slot !== void 0 ? /* @__PURE__ */ S.jsx("span", { className: "gl-cell-chip", style: { background: c.grey ? "#bdbdbd" : i(c.slot) }, title: a(c.slot) }) : /* @__PURE__ */ S.jsx("span", { className: "gl-cellpanel-merge-mark", title: r("Merge"), children: "+" }),
        /* @__PURE__ */ S.jsx(
          "input",
          {
            className: "gl-cellpanel-text",
            value: c.header,
            "aria-label": r("Column name"),
            onChange: (h) => o(f, { header: h.target.value })
          }
        ),
        c.kind === "channel" && c.slot !== void 0 && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
          /* @__PURE__ */ S.jsxs("label", { className: "gl-check", title: r("Draw this channel in grey rather than its colour"), children: [
            /* @__PURE__ */ S.jsx("input", { type: "checkbox", checked: c.grey === !0, onChange: (h) => o(f, { grey: h.target.checked }) }),
            r("Grey")
          ] }),
          /* @__PURE__ */ S.jsx(
            "input",
            {
              type: "range",
              min: -2,
              max: 2,
              step: 0.05,
              "aria-label": r("Brightness of {channel}", { channel: a(c.slot) }),
              title: r("Brightness of {channel}", { channel: a(c.slot) }),
              value: Math.log2(((d = t.gain) == null ? void 0 : d[c.slot]) ?? 1),
              onChange: (h) => n({ gain: { ...t.gain ?? {}, [c.slot]: Math.pow(2, Number(h.target.value)) } })
            }
          )
        ] }),
        c.kind === "merge" && /* @__PURE__ */ S.jsx("span", { className: "gl-cellpanel-merge", children: t.display.map((h) => /* @__PURE__ */ S.jsxs("label", { className: "gl-check", title: h.name, children: [
          /* @__PURE__ */ S.jsx(
            "input",
            {
              type: "checkbox",
              checked: (c.slots ?? []).includes(h.slot),
              onChange: (v) => {
                const m = new Set(c.slots ?? []);
                v.target.checked ? m.add(h.slot) : m.delete(h.slot), o(f, { slots: t.display.map((x) => x.slot).filter((x) => m.has(x)) });
              }
            }
          ),
          /* @__PURE__ */ S.jsx("span", { className: "gl-cell-chip", style: { background: h.colour } })
        ] }, h.slot)) }),
        /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move up"), "aria-label": r("Move up"), disabled: f === 0, onClick: () => n({ columns: da(t.columns, f, -1) }), children: /* @__PURE__ */ S.jsx(ks, { size: 12 }) }),
        /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move down"), "aria-label": r("Move down"), disabled: f === t.columns.length - 1, onClick: () => n({ columns: da(t.columns, f, 1) }), children: /* @__PURE__ */ S.jsx(Ms, { size: 12 }) }),
        c.kind === "merge" && /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Remove"), "aria-label": r("Remove"), onClick: () => n({ columns: t.columns.filter((h, v) => v !== f) }), children: /* @__PURE__ */ S.jsx(_s, { size: 12 }) })
      ] }, `${c.kind}-${c.slot ?? "m"}-${f}`);
    }) }),
    (u.length > 0 || !l) && /* @__PURE__ */ S.jsxs(
      "select",
      {
        className: "gl-cellpanel-add",
        value: "",
        "aria-label": r("Add a column"),
        onChange: (c) => {
          const f = c.target.value;
          if (f === "merge")
            n({ columns: [...t.columns, { kind: "merge", slots: t.display.filter((d) => d.enabled).map((d) => d.slot), header: r("Merge") }] });
          else if (f) {
            const d = Number(f);
            n({ columns: [...t.columns, { kind: "channel", slot: d, header: a(d) }] });
          }
        },
        children: [
          /* @__PURE__ */ S.jsx("option", { value: "", children: r("Add a column…") }),
          u.map((c) => /* @__PURE__ */ S.jsx("option", { value: String(c.slot), children: c.name }, c.slot)),
          !l && /* @__PURE__ */ S.jsx("option", { value: "merge", children: r("Merge") })
        ]
      }
    ),
    /* @__PURE__ */ S.jsx("div", { className: "gl-cellpanel-section", children: r("Cells shown") }),
    /* @__PURE__ */ S.jsx("ol", { className: "gl-cellpanel-list", "aria-label": r("Cells shown"), children: t.cells.map((c, f) => /* @__PURE__ */ S.jsxs("li", { className: "gl-cellpanel-row", children: [
      /* @__PURE__ */ S.jsx(
        "input",
        {
          className: "gl-cellpanel-text",
          value: c.label,
          "aria-label": r("Label of event {index}", { index: c.event.toLocaleString() }),
          onChange: (d) => n({ cells: t.cells.map((h, v) => v === f ? { ...h, label: d.target.value } : h) })
        }
      ),
      /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move up"), "aria-label": r("Move up"), disabled: f === 0, onClick: () => n({ cells: da(t.cells, f, -1) }), children: /* @__PURE__ */ S.jsx(ks, { size: 12 }) }),
      /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move down"), "aria-label": r("Move down"), disabled: f === t.cells.length - 1, onClick: () => n({ cells: da(t.cells, f, 1) }), children: /* @__PURE__ */ S.jsx(Ms, { size: 12 }) }),
      /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Remove"), "aria-label": r("Remove"), disabled: t.cells.length <= 1, onClick: () => n({ cells: t.cells.filter((d, h) => h !== f) }), children: /* @__PURE__ */ S.jsx(_s, { size: 12 }) })
    ] }, `${c.event}-${f}`)) })
  ] });
}
const Pe = "http://www.w3.org/2000/svg";
function pa(t, e) {
  const r = URL.createObjectURL(t), n = document.createElement("a");
  n.href = r, n.download = e, document.body.appendChild(n), n.click(), n.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function xr(t, e, r, n = { x: 0, y: 0 }) {
  const a = t.getBoundingClientRect();
  return {
    left: (a.left - e.left) / r - n.x,
    top: (a.top - e.top) / r - n.y,
    width: a.width / r,
    height: a.height / r
  };
}
function jl(t, e, r, n, a, i) {
  e.forEach((o) => {
    if (!o.text) return;
    const s = document.createElementNS(Pe, "text");
    s.setAttribute("x", String(r + o.left)), s.setAttribute("y", String(n + o.top + a * 0.82)), s.setAttribute("font-size", String(a)), s.setAttribute("font-family", i.fontFamily || If), s.setAttribute("font-weight", i.fontWeight || "400"), s.setAttribute("fill", i.color || "#1e293b"), s.setAttribute("xml:space", "preserve"), s.textContent = o.text, t.appendChild(s);
  });
}
function Dg(t, e) {
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
function zl(t, e, r, n, a, i, o) {
  const s = xr(e, r, n, i), l = document.createElementNS(Pe, "g");
  l.setAttribute("transform", `translate(${Math.round(s.left)},${Math.round(s.top)})`);
  const u = e.querySelector("canvas");
  if (u) {
    const f = document.createElementNS(Pe, "image"), d = xr(u, r, n, i);
    f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("width", String(Math.round(d.width || s.width))), f.setAttribute("height", String(Math.round(d.height || s.height))), f.setAttribute("href", Rf(e, a, Math.round(d.width || s.width)) ?? u.toDataURL("image/png")), l.appendChild(f);
  }
  const c = e.querySelector("svg");
  if (c) {
    const f = c.cloneNode(!0), d = c.clientWidth || Number(c.getAttribute("width")) || s.width, h = d > 0 ? s.width / d : 1;
    if (Math.abs(h - 1) > 1e-3) {
      const v = document.createElementNS(Pe, "g");
      v.setAttribute("transform", `scale(${h})`), v.appendChild(f), l.appendChild(v);
    } else l.appendChild(f);
  }
  Ul(l, o), t.appendChild(l);
}
function Al(t, e, r, n) {
  return [...t.querySelectorAll(".gl-layout-item")].sort((a, i) => (Number(a.style.zIndex) || 0) - (Number(i.style.zIndex) || 0)).map((a) => ({ item: a, frame: xr(a, e, r, n) }));
}
function kg(t, e, r, n) {
  let a = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const { frame: f } of t)
    f.left >= e || f.top >= r || f.left + f.width <= 0 || f.top + f.height <= 0 || (a = Math.min(a, f.left), i = Math.min(i, f.top), o = Math.max(o, f.left + f.width), s = Math.max(s, f.top + f.height));
  if (!Number.isFinite(a)) return null;
  const l = Math.max(0, n) * Ii, u = Math.max(0, Math.floor(a - l)), c = Math.max(0, Math.floor(i - l));
  return { x: u, y: c, width: Math.min(e, Math.ceil(o + l)) - u, height: Math.min(r, Math.ceil(s + l)) - c };
}
function Mg(t, e, r) {
  var v, m;
  const n = Ti(e.page), a = ba(e.page)[r.pageIndex ?? 0] ?? { x: 0, y: 0 }, i = t.getBoundingClientRect(), o = r.crop ? kg(Al(t, i, r.zoom, a), n.width, n.height, r.crop.paddingMm) : null, s = o ? { x: a.x + o.x, y: a.y + o.y } : a, l = o ? o.width : n.width, u = o ? o.height : n.height, c = document.createElementNS(Pe, "svg");
  c.setAttribute("xmlns", Pe), c.setAttribute("width", String(l)), c.setAttribute("height", String(u)), c.setAttribute("viewBox", `0 0 ${l} ${u}`);
  const f = document.createElementNS(Pe, "rect");
  f.setAttribute("width", "100%"), f.setAttribute("height", "100%"), f.setAttribute("fill", "#ffffff"), c.appendChild(f);
  let d = 0;
  for (const { item: x, frame: y } of Al(t, i, r.zoom, s)) {
    if (y.left >= l || y.top >= u || y.left + y.width <= 0 || y.top + y.height <= 0) continue;
    d += 1;
    const C = x.dataset.title ?? ((v = x.querySelector(".gl-layout-item-head span")) == null ? void 0 : v.textContent) ?? "";
    if (x.classList.contains("has-frame")) {
      const k = document.createElementNS(Pe, "rect");
      k.setAttribute("x", String(Math.round(y.left) + 0.5)), k.setAttribute("y", String(Math.round(y.top) + 0.5)), k.setAttribute("width", String(Math.round(y.width) - 1)), k.setAttribute("height", String(Math.round(y.height) - 1)), k.setAttribute("fill", "none"), k.setAttribute("stroke", "#94a3b8"), k.setAttribute("id", sn("frame", d, C)), c.appendChild(k);
    }
    const w = x.querySelector(".gl-layout-text-surface");
    if (w) {
      const k = w instanceof HTMLTextAreaElement ? w.value : w.textContent ?? "", T = getComputedStyle(w), g = xr(w, i, r.zoom, s), _ = Number(x.dataset.zoom) || 1, j = (parseFloat(T.fontSize) || 14) * _, R = (parseFloat(T.paddingLeft) || 0) * _, P = (parseFloat(T.paddingTop) || 0) * _, z = ((m = Dg(w, k)) == null ? void 0 : m.map((Y) => ({ text: Y.text, left: Y.left * _, top: Y.top * _ }))) ?? k.split(`
`).map((Y, H) => ({ text: Y, left: 0, top: H * j * 1.3 })), B = document.createElementNS(Pe, "g");
      B.setAttribute("id", sn("text", d, k.trim().split(/\s+/).slice(0, 4).join(" "))), jl(B, z, g.left + R, g.top + P, j, T), c.appendChild(B);
      continue;
    }
    const D = x.querySelector(".gl-layout-plot-host");
    if (!D) continue;
    if (D.__miniPlotCfg) {
      zl(c, D, i, r.zoom, r.dpi, s, sn("plot", d, C));
      continue;
    }
    const M = D.querySelector(".gl-prop-chart");
    if (M) {
      const k = _f(M);
      if (k) {
        const T = xr(M, i, r.zoom, s), g = k.width > 0 ? T.width / k.width : 1, _ = document.createElementNS(Pe, "g");
        _.setAttribute("id", sn("chart", d, C)), _.setAttribute("transform", `translate(${T.left},${T.top}) scale(${g})`), _.appendChild(k.root), c.appendChild(_);
      }
      continue;
    }
    D.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((k) => {
      const T = (k.textContent ?? "").trim();
      if (!T) return;
      const g = getComputedStyle(k), _ = xr(k, i, r.zoom, s), j = k.offsetWidth > 0 ? _.width / k.offsetWidth : 1;
      jl(c, [{ text: T, left: 0, top: 0 }], _.left, _.top, (parseFloat(g.fontSize) || 12) * j, g);
    });
    const E = sn(D.querySelector(".gl-figure-grid") ? "figure" : "strategy", d, C);
    D.querySelectorAll(".mini-plot-cell").forEach((k, T) => zl(c, k, i, r.zoom, r.dpi, s, `${E}-panel-${T + 1}`)), D.querySelectorAll("svg.gl-strategy-arrows").forEach((k) => {
      const T = xr(k, i, r.zoom, s), g = Number(k.getAttribute("width")) || k.clientWidth || T.width, _ = g > 0 ? T.width / g : 1, j = document.createElementNS(Pe, "g");
      j.setAttribute("transform", `translate(${Math.round(T.left)},${Math.round(T.top)}) scale(${_})`), Array.from(k.childNodes).forEach((R) => j.appendChild(R.cloneNode(!0))), Ul(j, `${E}-arrows`), c.appendChild(j);
    });
  }
  const h = o ? { widthMm: l / Ii, heightMm: u / Ii } : Kl(e.page);
  return Tf(c, { widthPx: l, heightPx: u, ...h }), { root: c, width: l, height: u, ...h };
}
function Bl(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
function _g(t, e, r) {
  return ba(e.page).map((n, a) => Mg(t, e, { dpi: e.page.dpi, zoom: r.zoom, pageIndex: a, crop: r.crop }));
}
const Gl = 72 / 25.4;
function Fl(t, e, r, n) {
  const a = e.label ? Vl(e.label) : "";
  return `${t}-p${r + 1}${a ? `-${a}` : ""}.${n}`;
}
async function Tg(t, e, r) {
  const n = e.page.dpi, a = Vl(e.name) || "layout";
  if (!t.length) return;
  if (r === "svg") {
    if (t.length === 1) {
      pa(new Blob([Bl(t[0].root)], { type: "image/svg+xml" }), `${a}.svg`);
      return;
    }
    const u = {};
    t.forEach((c, f) => {
      u[Fl(a, c, f, "svg")] = kf(Bl(c.root));
    }), pa(new Blob([Ts(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  if (r === "png") {
    if (t.length === 1) {
      pa(await Is(await si(t[0], n), n), `${a}.png`);
      return;
    }
    const u = {};
    for (const [c, f] of t.entries()) {
      const d = await si(f, n);
      u[Fl(a, t[c], c, "png")] = new Uint8Array(await (await Is(d, n)).arrayBuffer()), await Rs();
    }
    pa(new Blob([Ts(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const i = (u) => {
    const c = u.widthMm * Gl, f = u.heightMm * Gl;
    return { width: c, height: f, orientation: c >= f ? "landscape" : "portrait" };
  }, { jsPDF: o } = await import("./jspdf.es.min-hP_fZJxl.js").then((u) => u.j), s = i(t[0]), l = new o({ orientation: s.orientation, unit: "pt", format: [s.width, s.height], compress: !0 });
  for (const [u, c] of t.entries()) {
    const { width: f, height: d, orientation: h } = i(c);
    if (u > 0 && l.addPage([f, d], h), !await Mf(l, c.root, { width: f, height: d })) {
      const v = await si(c, n);
      l.addImage(v, "PNG", 0, 0, f, d, void 0, "FAST");
    }
    await Rs();
  }
  l.save(`${a}.pdf`);
}
const Ig = "", $c = "{none}", ha = [
  { id: "auto", label: "What differs across the page", template: Ig },
  { id: "population", label: "Population", template: "{population}" },
  { id: "file", label: "File", template: "{file}" },
  { id: "sample", label: "Sample id", template: "{sample}" },
  { id: "population-file", label: "Population · file", template: "{population} · {file}" },
  { id: "population-plot", label: "Population · plot", template: "{population} · {plot}" },
  { id: "none", label: "No title", template: $c }
], Ei = "{population}, {file}, {sample}, {group}, {x}, {y}, {plot}, {count}, {n}, {N}, {meta:column}, {popmeta:field}";
function Rg(t, e) {
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
const Di = [
  { id: "dot", label: "·", value: " · " },
  { id: "space", label: "space", value: " " },
  { id: "comma", label: ",", value: ", " },
  { id: "slash", label: "/", value: " / " },
  { id: "dash", label: "–", value: " – " }
];
function Ll(t, e) {
  return t.join(e);
}
function qc(t) {
  const e = t.match(/\{[^}]+\}/g) ?? [];
  if (!e.length) return null;
  const r = t.split(/\{[^}]+\}/);
  if (r[0] !== "" || r[r.length - 1] !== "") return null;
  const n = r.slice(1, -1), a = n[0] ?? " · ";
  return n.some((i) => i !== a) ? null : { tokens: e, separator: a };
}
function Wl(t, e, r, n, a) {
  return {
    population: (r == null ? void 0 : r.name) ?? "",
    file: (e == null ? void 0 : e.fileName) ?? (e == null ? void 0 : e.name) ?? "",
    sample: (e == null ? void 0 : e.name) ?? (e == null ? void 0 : e.fileName) ?? "",
    x: t.xChannel ?? "",
    y: t.yChannel ?? "",
    ...t.label ? { plot: t.label } : {},
    ...typeof n == "number" ? { count: n } : {},
    ...e != null && e.groupName ? { group: e.groupName } : {},
    ...e != null && e.metadata ? { metadata: e.metadata } : {},
    ...r && (a != null && a[r.id]) ? { populationMetadata: a[r.id] } : {}
  };
}
function za(t, e) {
  if (t.trim() === $c) return "";
  const r = qc(t);
  return r ? r.tokens.map((a) => Yl(a, e).trim()).filter(Boolean).join(r.separator).trim() : Yl(t, e).replace(/(\s*·\s*)+/g, " · ").replace(/^\s*·\s*/, "").replace(/\s*·\s*$/, "").trim();
}
function Yl(t, e) {
  return t.replace(/\{(population|file|sample|group|x|y|plot|count|meta:[^}]+|popmeta:[^}]+)\}/g, (r, n) => {
    var a, i;
    switch (n) {
      case "population":
        return e.population;
      case "file":
        return e.file;
      case "sample":
        return e.sample;
      case "group":
        return e.group ?? "";
      case "x":
        return e.x;
      case "y":
        return e.y;
      case "plot":
        return e.plot ?? (e.y ? `${e.x} vs ${e.y}` : e.x);
      case "count":
        return typeof e.count == "number" ? e.count.toLocaleString() : "";
    }
    return n.startsWith("meta:") ? ((a = e.metadata) == null ? void 0 : a[n.slice(5).trim()]) ?? "" : n.startsWith("popmeta:") ? ((i = e.populationMetadata) == null ? void 0 : i[n.slice(8).trim()]) ?? "" : r;
  });
}
function Pg(t, e) {
  const r = new Set(t.map((o) => o.sampleId)), n = new Set(t.map((o) => o.populationId)), a = t.some((o) => o.label), i = e != null && e.metadataColumn ? n.size > 1 ? `{meta:${e.metadataColumn}} · {population}` : `{meta:${e.metadataColumn}}` : r.size <= 1 && n.size > 1 ? "{population}" : n.size <= 1 && r.size > 1 ? "{file}" : "{population} · {file}";
  return a ? `${i} · {plot}` : i;
}
const Aa = "Unassigned";
function Vc(t) {
  const e = {};
  for (const [r, n] of Object.entries(t[0] ?? {}))
    t.every((a) => (a == null ? void 0 : a[r]) === n) && (e[r] = n);
  return e;
}
function Uc(t) {
  return oe(t.recipe) && t.recipe.iterated === !0;
}
function uo(t, e, r, n) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(r) : i === "N" ? String(n) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function ki(t, e, r, n, a, i) {
  var u;
  const o = Uc(t), s = { ...t.recipe };
  let l;
  return s.kind === "text" ? s.text = uo(s.text, s.readsFrom ? null : e, r, n) : (o && e && e.populationId ? ("populationId" in s && (s.populationId = e.populationId), s.kind === "strategy" && ((u = s.populationIds) != null && u.length) && (s.populationIds = [e.populationId])) : o && e && e.sampleIds ? ((s.kind === "biplot" || s.kind === "histogram") && e.sampleIds.length > 1 ? s.pool = { sampleIds: [...e.sampleIds] } : "pool" in s && delete s.pool, "sampleId" in s && !e.sampleIds.includes(s.sampleId) && e.sampleIds.length && (l = s.sampleId, s.sampleId = e.sampleIds[0])) : o && e && "sampleId" in s && ("pool" in s && delete s.pool, s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id)), s.title && (s.title = uo(s.title, o ? e : null, r, n))), {
    ...t,
    id: i === 0 && !a.x && !a.y ? t.id : `${t.id}::${i}`,
    templateId: t.id,
    unitId: o && e ? e.id : void 0,
    ...l ? { templateSampleId: l } : {},
    x: t.x + a.x,
    y: t.y + a.y,
    offset: a,
    position: { n: r, total: n },
    recipe: s
  };
}
function Og(t, e) {
  if (e)
    for (const r of t) {
      if (r.recipe.kind !== "text" || !r.recipe.readsFrom) continue;
      const n = r.recipe.readsFrom, a = t.find((o) => o.templateId === n && o.offset.x === r.offset.x && o.offset.y === r.offset.y);
      if (!a || !oe(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId, a.unitId);
      i && (r.recipe = { ...r.recipe, text: za(r.recipe.text, i) });
    }
}
function Ng(t, e, r) {
  const n = jg(t, e);
  for (const a of n) Og(a.items, r);
  return n;
}
function jg(t, e) {
  const r = t.iteration ?? Jl;
  if (r.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((h) => ki(h, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const n = e.length;
  if (r.arrangement.kind === "page-per-unit")
    return e.map((h, v) => ({
      index: v,
      units: [h],
      items: t.items.map((m) => ki(m, h, v + 1, n, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = r.arrangement, l = Zl(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const u = a * i, c = l.width + s, f = l.height + s, d = [];
  for (let h = 0; h < n; h += u) {
    const v = e.slice(h, h + u), m = [];
    v.forEach((x, y) => {
      const C = o === "row-major" ? Math.floor(y / i) : y % a, D = { x: (o === "row-major" ? y % i : Math.floor(y / a)) * c, y: C * f };
      for (const M of t.items) m.push(ki(M, x, h + y + 1, n, D, y));
    }), d.push({ index: d.length, units: v, items: m });
  }
  return d;
}
function Kc(t, e, r, n) {
  return e.filter((a) => {
    var i;
    return t.kind === "all" ? !0 : t.kind === "checked" ? r.includes(a.id) : t.kind === "group" ? n[a.id] === t.groupId : (((i = a.metadata) == null ? void 0 : i[t.column]) ?? "") === t.value;
  });
}
function zg(t, e, r, n, a) {
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
  return Kc(t.source, e, r, a).map(i);
}
function Ag(t, e, r, n, a, i) {
  var d;
  const o = t.column ?? "";
  if (!o) return [];
  const s = /* @__PURE__ */ new Map(), l = [];
  for (const h of Kc(t.source, e, r, a)) {
    const v = ((d = h.metadata) == null ? void 0 : d[o]) ?? "";
    if (!v) {
      l.push(h);
      continue;
    }
    s.set(v, [...s.get(v) ?? [], h]);
  }
  const u = [...s.keys()], c = i ? [...i.filter((h) => s.has(h)), ...u.filter((h) => !i.includes(h)).sort(Ps)] : u.sort(Ps), f = (h, v) => {
    const m = new Set(v.map((x) => {
      var y;
      return (y = n.find((C) => C.id === a[x.id])) == null ? void 0 : y.name;
    }));
    return {
      id: `meta:${o}=${h}`,
      name: h,
      fileName: `${v.length} files`,
      ...m.size === 1 && [...m][0] ? { groupName: [...m][0] } : {},
      // What the files share, and the value itself, so {meta:column} names the page, the files
      // without a value included.
      metadata: { ...Vc(v.map((x) => x.metadata)), [o]: h },
      sampleIds: v.map((x) => x.id)
    };
  };
  return [
    ...c.map((h) => f(h, s.get(h))),
    ...l.length ? [f(Aa, l)] : []
  ];
}
function Bg(t, e, r) {
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
  return ga(e.populations, n).filter(({ popId: s }) => s !== n && i(s)).map(({ popId: s }) => {
    var l;
    return {
      id: s,
      name: ((l = e.populations[s]) == null ? void 0 : l.name) ?? s,
      fileName: r.fileName ?? r.name,
      sampleName: r.name,
      // The page is one file's, so {meta:column} and {group} read that file.
      ...r.groupName ? { groupName: r.groupName } : {},
      ...r.metadata ? { metadata: r.metadata } : {},
      populationId: s
    };
  });
}
function Xl(t, e) {
  const r = Zl(t.items);
  if (!r) return { columns: 1, rows: 1 };
  const n = Ri(t.page.marginMm), a = (i, o, s) => Math.max(1, Math.min(Gg, Math.floor((s - n - i + e) / Math.max(1, o + e))));
  return { columns: a(r.x, r.width, t.width), rows: a(r.y, r.height, t.height) };
}
const Gg = 12;
function Fg(t, e) {
  return t.filter((r) => r.x + r.width > e.width + 0.5 || r.y + r.height > e.height + 0.5 || r.x < -0.5 || r.y < -0.5).length;
}
function Lg(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const Wg = (t) => [...t].sort((e, r) => e - r);
function Mi(t, e) {
  const r = Wg(t);
  if (!r.length) return NaN;
  const n = (r.length - 1) * e, a = Math.floor(n), i = Math.ceil(n);
  return r[a] + (r[i] - r[a]) * (n - a);
}
function Yg(t, e) {
  const r = e.map((o) => o.value), n = r.length, a = n ? r.reduce((o, s) => o + s, 0) / n : NaN, i = n > 1 ? Math.sqrt(r.reduce((o, s) => o + (s - a) ** 2, 0) / (n - 1)) : 0;
  return {
    label: t,
    points: e,
    n,
    mean: a,
    sd: i,
    median: Mi(r, 0.5),
    q1: Mi(r, 0.25),
    q3: Mi(r, 0.75),
    min: n ? Math.min(...r) : NaN,
    max: n ? Math.max(...r) : NaN
  };
}
function Xg(t) {
  const e = [], r = /* @__PURE__ */ new Map();
  for (const n of t)
    r.has(n.group) || (r.set(n.group, []), e.push(n.group)), r.get(n.group).push(n);
  return e.map((n) => Yg(n, r.get(n)));
}
function Zc(t) {
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
function Hg(t) {
  const e = Math.abs(t) / Math.SQRT2, r = 1 / (1 + 0.3275911 * e), i = r * (0.254829592 + r * (-0.284496736 + r * (1.421413741 + r * (-1.453152027 + r * 1.061405429)))) * Math.exp(-e * e) / 2;
  return t >= 0 ? i : 1 - i;
}
function $g(t, e) {
  if (e <= 0) return 0;
  const r = qg(t);
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
function qg(t) {
  const e = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18];
  let r = t, n = t, a = r + 5.5;
  a -= (r + 0.5) * Math.log(a);
  let i = 1.000000000190015;
  for (const o of e) i += o / ++n;
  return -a + Math.log(2.5066282746310007 * i / r);
}
function Vg(t, e) {
  return t > 0 ? Math.max(0, Math.min(1, 1 - $g(e / 2, t / 2))) : 1;
}
function Ug(t, e) {
  if (t.length < 2 || e.length < 2) return null;
  const r = t.length, n = e.length, { rank: a, ties: i } = Zc([...t, ...e]), s = a.slice(0, r).reduce((h, v) => h + v, 0) - r * (r + 1) / 2, l = r + n, u = r * n / 2, c = Math.sqrt(r * n / 12 * (l + 1 - i / (l * (l - 1))));
  if (!(c > 0)) return { name: "Wilcoxon rank-sum", statistic: s, p: 1, label: "Wilcoxon p = 1" };
  const f = (Math.abs(s - u) - 0.5) / c, d = Math.min(1, 2 * Hg(Math.max(0, f)));
  return { name: "Wilcoxon rank-sum", statistic: s, p: d, label: `Wilcoxon ${Jc(d)}` };
}
function Kg(t) {
  const e = t.filter((c) => c.length > 0);
  if (e.length < 2 || e.some((c) => c.length < 2)) return null;
  const r = e.flat(), n = r.length, { rank: a, ties: i } = Zc(r);
  let o = 0, s = 0;
  for (const c of e) {
    const f = a.slice(o, o + c.length).reduce((d, h) => d + h, 0);
    s += f * f / c.length, o += c.length;
  }
  s = 12 / (n * (n + 1)) * s - 3 * (n + 1);
  const l = 1 - i / (n ** 3 - n);
  l > 0 && (s /= l);
  const u = Vg(s, e.length - 1);
  return { name: "Kruskal–Wallis", statistic: s, p: u, label: `Kruskal–Wallis ${Jc(u)}` };
}
function Zg(t) {
  const e = t.map((r) => r.points.map((n) => n.value));
  return e.length === 2 ? Ug(e[0], e[1]) : e.length > 2 ? Kg(e) : null;
}
function Jc(t) {
  return Number.isFinite(t) ? t < 1e-3 ? "p < 0.001" : `p = ${t < 0.01 ? t.toFixed(3) : t.toFixed(2)}` : "p = ?";
}
function Jg(t, e = 5) {
  const r = t.filter((d) => Number.isFinite(d)), n = Math.min(0, ...r), a = Math.max(...r, n + 1e-9), o = (a - n || 1) / e, s = 10 ** Math.floor(Math.log10(o)), l = [1, 2, 2.5, 5, 10].map((d) => d * s).find((d) => d >= o) ?? s * 10, u = Math.floor(n / l) * l, c = Math.ceil((a + l * 0.15) / l) * l, f = [];
  for (let d = u; d <= c + l / 2; d += l) f.push(Number(d.toFixed(10)));
  return { min: u, max: c, ticks: f };
}
const Qg = { identity: "linear", asinh: "arcsinh", logicle: "logicle" }, Qc = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function tf(t, e, r, n, a) {
  var y, C, w, D, M;
  const i = e.find((E) => E.id === t.sampleId) ?? null, o = ((y = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : y.name) ?? "the population", s = t.files === "all" ? e : e.filter((E) => n.includes(E.id)), l = [], u = [], c = [], f = /* @__PURE__ */ new Set();
  for (const E of s) {
    let k = t.populationId;
    if (i && i.tree.id !== E.tree.id) {
      const _ = un(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        E.tree,
        Nr(a)
      );
      if (!_.id) {
        u.push(E.name);
        continue;
      }
      k = _.id;
    }
    let T;
    if (t.statistic === "median") {
      const _ = t.channel ? E.sample.index(t.channel) : void 0, j = E.derived.masks[k];
      if (_ === void 0) {
        c.push(E.name);
        continue;
      }
      if (!j) {
        u.push(E.name);
        continue;
      }
      f.add(Qg[E.sample.transformKind(_)] ?? E.sample.transformKind(_));
      const R = E.sample.displayColumn(_), P = [];
      for (let z = 0; z < R.length; z++) j[z] && Number.isFinite(R[z]) && P.push(R[z]);
      T = P.length ? Pf(P) : null;
    } else if (T = E.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][k], T === void 0) {
      u.push(E.name);
      continue;
    }
    if (typeof T != "number" || !Number.isFinite(T)) continue;
    const g = t.groupBy ? ((w = (C = r[E.id]) == null ? void 0 : C[t.groupBy]) == null ? void 0 : w.trim()) || Aa : E.name;
    l.push({ sampleId: E.id, name: E.name, group: g, value: T });
  }
  const d = Xg(l), h = t.channel ? ((M = (i == null ? void 0 : i.sample) ?? ((D = s[0]) == null ? void 0 : D.sample)) == null ? void 0 : M.labelForKey(t.channel)) ?? t.channel : "", v = f.size ? ` (${[...f].join(", ")})` : "", m = t.statistic === "median" ? `Median ${h}`.trim() + v : Qc[t.statistic], x = t.groupBy ? d.filter((E) => E.label !== Aa) : [];
  return { points: l, groups: d, test: t.test && t.groupBy ? Zg(x) : null, population: o, axis: m, missing: u, noChannel: c };
}
const _i = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), tm = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function em({
  data: t,
  recipe: e,
  style: r,
  width: n,
  height: a,
  title: i
}) {
  const o = r.fontTick, s = r.fontAxis, l = r.fontTitle, u = t.groups, c = tt.useMemo(() => Jg(t.points.map((_) => _.value)), [t.points]), f = 8 + s + 6 + Math.max(...c.ticks.map((_) => _i(_).length), 1) * o * 0.6 + 8, d = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), h = Math.max(0, ...u.map((_) => _.label.length)), v = u.length > 0 && h * o * 0.6 > (n - f - 8) / u.length, m = 8 + (v ? h * o * 0.45 + 10 : o + 8), x = Math.max(20, n - f - 8), y = Math.max(20, a - d - m), C = (_) => d + y - (_ - c.min) / (c.max - c.min || 1) * y, w = u.length ? x / u.length : x, D = (_) => f + (_ + 0.5) * w, M = Math.min(48, w * 0.6), E = r.pubStyle ? "#000000" : "#334155", k = r.pubStyle ? "#d4d4d8" : "#93c5fd", T = r.pubStyle ? "#000000" : "#1d4ed8", g = C(Math.max(c.min, 0));
  return /* @__PURE__ */ S.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: n, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ S.jsxs("svg", { width: n, height: a, viewBox: `0 0 ${n} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ S.jsx("rect", { width: n, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ S.jsx("text", { x: n / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: E, children: i }),
    !t.points.length && /* @__PURE__ */ S.jsx("text", { x: n / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ S.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: E, children: [
      /* @__PURE__ */ S.jsx("line", { x1: f, x2: f, y1: d, y2: d + y, stroke: E }),
      c.ticks.map((_) => /* @__PURE__ */ S.jsxs("g", { children: [
        /* @__PURE__ */ S.jsx("line", { x1: f - 4, x2: f, y1: C(_), y2: C(_), stroke: E }),
        /* @__PURE__ */ S.jsx("text", { x: f - 6, y: C(_), textAnchor: "end", dominantBaseline: "central", children: _i(_) })
      ] }, _)),
      /* @__PURE__ */ S.jsx("text", { transform: `translate(${8 + s} ${d + y / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ S.jsx("line", { x1: f, x2: f + x, y1: g, y2: g, stroke: E })
    ] }),
    /* @__PURE__ */ S.jsx("g", { className: "gl-layout-chart-groups", children: u.map((_, j) => {
      const R = D(j), P = e.showPoints || e.chartType === "dots" ? _.points : [];
      return /* @__PURE__ */ S.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(_.mean) && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
          /* @__PURE__ */ S.jsx("rect", { x: R - M / 2, y: Math.min(C(_.mean), g), width: M, height: Math.abs(g - C(_.mean)), fill: k, stroke: E, strokeWidth: 0.8 }),
          _.n > 1 && _.sd > 0 && /* @__PURE__ */ S.jsxs("g", { stroke: E, strokeWidth: 1, children: [
            /* @__PURE__ */ S.jsx("line", { x1: R, x2: R, y1: C(_.mean - _.sd), y2: C(_.mean + _.sd) }),
            /* @__PURE__ */ S.jsx("line", { x1: R - M / 4, x2: R + M / 4, y1: C(_.mean + _.sd), y2: C(_.mean + _.sd) }),
            /* @__PURE__ */ S.jsx("line", { x1: R - M / 4, x2: R + M / 4, y1: C(_.mean - _.sd), y2: C(_.mean - _.sd) })
          ] })
        ] }),
        e.chartType === "box" && _.n > 0 && /* @__PURE__ */ S.jsxs("g", { stroke: E, strokeWidth: 1, fill: k, children: [
          /* @__PURE__ */ S.jsx("line", { x1: R, x2: R, y1: C(_.min), y2: C(_.q1) }),
          /* @__PURE__ */ S.jsx("line", { x1: R, x2: R, y1: C(_.q3), y2: C(_.max) }),
          /* @__PURE__ */ S.jsx("rect", { x: R - M / 2, y: C(_.q3), width: M, height: Math.max(0.5, C(_.q1) - C(_.q3)) }),
          /* @__PURE__ */ S.jsx("line", { x1: R - M / 2, x2: R + M / 2, y1: C(_.median), y2: C(_.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && _.n > 1 && /* @__PURE__ */ S.jsx("line", { x1: R - M / 2, x2: R + M / 2, y1: C(_.mean), y2: C(_.mean), stroke: E, strokeWidth: 2 }),
        P.map((z, B) => /* @__PURE__ */ S.jsx("circle", { cx: R + tm(B + j * 31) * M * 0.3, cy: C(z.value), r: Math.max(2, o * 0.28), fill: T, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ S.jsx("title", { children: `${z.name}: ${_i(z.value)}` }) }, z.sampleId)),
        /* @__PURE__ */ S.jsx(
          "text",
          {
            x: R,
            y: d + y + 6,
            textAnchor: v ? "end" : "middle",
            dominantBaseline: "hanging",
            fontSize: o,
            fill: E,
            transform: v ? `rotate(-45 ${R} ${d + y + 6})` : void 0,
            children: _.label
          }
        )
      ] }, _.label || String(j));
    }) }),
    t.test && u.length >= 2 && /* @__PURE__ */ S.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: E, children: [
      /* @__PURE__ */ S.jsx("line", { x1: D(0), x2: D(u.length - 1), y1: d - 4, y2: d - 4, stroke: E }),
      /* @__PURE__ */ S.jsx("text", { x: (D(0) + D(u.length - 1)) / 2, y: d - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const rm = tt.lazy(tu("LayoutImageWall", async () => ({ default: (await import("./LayoutImageWall-BwGCqVZ8.js")).LayoutImageWall }))), nm = tt.lazy(tu("LayoutCellPanel", async () => ({ default: (await import("./LayoutCellPanel-BU3nNG4y.js")).LayoutCellPanel }))), va = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), am = { x: "X (px)", y: "Y (px)", width: "Width (px)", height: "Height (px)" }, ln = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], Hl = 10, im = { index: 0, units: [], items: [] }, om = {}, $l = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, sm = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], lm = [
  { how: "horizontal", label: "Distribute ↔", title: "Equal spacing between three or more items or groups, left to right; the outer two stay where they are" },
  { how: "vertical", label: "Distribute ↕", title: "Equal spacing between three or more items or groups, top to bottom; the outer two stay where they are" }
];
function um(t) {
  var r, n, a;
  if (!t) return;
  t.stopDrag();
  const e = (r = t.getManager) == null ? void 0 : r.call(t);
  for (const i of ((n = e == null ? void 0 : e.getMoveables) == null ? void 0 : n.call(e)) ?? []) i !== e && ((a = i.stopDrag) == null || a.call(i));
}
function cm(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function fm(t, e, r) {
  return e ? r.some((n) => !!n && (t === `${e} · ${n}` || t.startsWith(`${e} · ${n} · `))) : !1;
}
function Ke(t, e, r) {
  var s, l, u;
  const n = t.recipe;
  if (n.kind === "text") return n.text.split(`
`)[0] || "Text";
  if ((s = n.title) != null && s.trim()) return n.title.trim();
  if (n.kind === "figure") return ((u = (l = n.illustration.figure) == null ? void 0 : l.name) == null ? void 0 : u.trim()) || "Figure";
  if (n.kind === "proportions") return n.settings.plotType === "box" ? "Boxplot" : "Composition";
  if (n.kind === "imagewall") return `${n.populationName || "Population"} · ${n.fileName || "images"}`;
  if (n.kind === "cellpanel") return `${n.cells.length} ${n.cells.length === 1 ? "cell" : "cells"} · ${n.fileName || "images"}`;
  const a = e.find(({ id: c }) => c === n.sampleId), i = a == null ? void 0 : a.tree.populations[n.populationId];
  if (n.kind === "chart") return `${(i == null ? void 0 : i.name) ?? "Population"} · ${Qc[n.statistic]}`;
  if (n.kind === "strategy")
    return `${(i == null ? void 0 : i.name) ?? "Population"} strategy`;
  const o = Sn(n);
  return o ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${o.length} ${Ql("files")}` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function Sn(t) {
  return (t.kind === "biplot" || t.kind === "histogram") && t.pool && t.pool.sampleIds.length > 1 ? t.pool.sampleIds : null;
}
function ya(t, e, r, n) {
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
    const d = Sa(t.populationId, f.tree, r, n ?? i.tree.id);
    if (d.missing) {
      s.push({ name: f.name, reason: "no corresponding population" });
      continue;
    }
    const h = f === i ? null : Xf(i.sample, f.sample, t.xChannel, l);
    if (h) {
      s.push({ name: f.name, reason: h });
      continue;
    }
    o.push({ id: f.id, name: f.name, sample: f.sample, tree: f.tree, gating: f.derived, populationId: d.id });
  }
  return { members: o, leftOut: s };
}
function dm({
  files: t,
  pool: e,
  checkedSampleIds: r,
  groups: n,
  fileGroups: a,
  report: i,
  onChange: o
}) {
  const { t: s } = Ur(), [l, u] = tt.useState(""), c = tt.useMemo(
    () => Object.fromEntries(t.filter((m) => m.metadata).map((m) => [m.id, m.metadata])),
    [t]
  ), f = tt.useMemo(
    () => Uf(c, [...new Set(Object.values(c).flatMap((m) => Object.keys(m)))].map((m) => ({ name: m }))),
    [c]
  ), d = tt.useMemo(() => new Set(t.filter((m) => !e.includes(m.id)).map((m) => m.id)), [t, e]), h = (m) => t.filter((x) => m instanceof Set ? m.has(x.id) : m.includes(x.id)).map((x) => x.id), v = l.trim().toLowerCase();
  return /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-pool", children: [
    /* @__PURE__ */ S.jsxs("div", { className: "gl-figure-actions gl-figure-list-actions", children: [
      /* @__PURE__ */ S.jsx("button", { type: "button", onClick: () => o(h(r)), children: s("Checked files") }),
      /* @__PURE__ */ S.jsx("button", { type: "button", onClick: () => o(t.map((m) => m.id)), children: s("All files") }),
      n.map((m) => /* @__PURE__ */ S.jsx("button", { type: "button", onClick: () => o(t.filter((x) => a[x.id] === m.id).map((x) => x.id)), children: s("Group {name}", { name: m.name }) }, m.id))
    ] }),
    /* @__PURE__ */ S.jsx(
      "input",
      {
        type: "search",
        "aria-label": s("Find files to pool"),
        placeholder: s("Find file / sample…"),
        value: l,
        onChange: (m) => u(m.target.value)
      }
    ),
    /* @__PURE__ */ S.jsx("div", { className: "gl-figure-list gl-layout-pool-list", children: t.filter((m) => !v || `${m.name} ${m.fileName ?? ""}`.toLowerCase().includes(v)).map((m) => /* @__PURE__ */ S.jsxs("label", { className: "gl-figure-row", title: m.fileName && m.fileName !== m.name ? `${m.name} · ${m.fileName}` : m.name, children: [
      /* @__PURE__ */ S.jsx(
        "input",
        {
          type: "checkbox",
          checked: e.includes(m.id),
          onChange: () => o(e.includes(m.id) ? e.filter((x) => x !== m.id) : h([...e, m.id]))
        }
      ),
      /* @__PURE__ */ S.jsx("span", { className: "gl-figure-row-name", children: m.name })
    ] }, m.id)) }),
    f.length > 0 && /* @__PURE__ */ S.jsx("div", { className: "gl-sample-facets gl-figure-facets", "aria-label": s("Select pooled files by metadata"), children: f.map((m) => /* @__PURE__ */ S.jsxs("div", { className: "gl-sample-facet-row", children: [
      /* @__PURE__ */ S.jsx("span", { className: "gl-sample-facet-lock", "aria-hidden": "true" }),
      /* @__PURE__ */ S.jsx("span", { className: "gl-sample-facet-name", title: m.name, children: m.name }),
      /* @__PURE__ */ S.jsx("div", { className: "gl-sample-facet-values", children: m.values.map((x) => {
        const y = Kf(x.sampleIds, d), C = x.sampleIds.length, w = y === C ? "all" : y === 0 ? "none" : "some", D = C > 0 ? Math.round(y / C * 100) : 0;
        return /* @__PURE__ */ S.jsxs(
          "button",
          {
            type: "button",
            className: `gl-sample-facet-chip is-${w}`,
            style: w === "some" ? { "--gl-facet-fill": `${D}%` } : void 0,
            "aria-pressed": y === C,
            title: `${x.value}: ${y} of ${C} pooled — ${y === C ? `click to drop all ${C}` : `click to pool all ${C}`}`,
            onClick: () => o(h(new Set(t.filter((M) => !Zf(x.sampleIds, d).has(M.id)).map((M) => M.id)))),
            children: [
              /* @__PURE__ */ S.jsx("span", { className: "gl-sample-facet-label", children: x.value }),
              /* @__PURE__ */ S.jsxs("span", { className: "gl-sample-facet-count", children: [
                y,
                "/",
                C
              ] })
            ]
          },
          x.value
        );
      }) })
    ] }, m.name)) }),
    i && /* @__PURE__ */ S.jsxs("p", { className: "gl-hint", children: [
      s("{n} of {m} files pooled", { n: i.pooled, m: i.total }),
      i.leftOut.length > 0 && ` · ${s("Not pooled: {files}", { files: i.leftOut.map((m) => `${m.name} (${m.reason})`).join(", ") })}`,
      i.omittedGates.length > 0 && ` · ${s("Gates not shown: {names} — they differ between the pooled files", { names: i.omittedGates.join(", ") })}`
    ] })
  ] });
}
function pm({
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
  var j;
  const c = tt.useRef(null), f = t.recipe, d = JSON.stringify(o), h = tt.useMemo(() => Nr(r), [r]), v = f.kind === "text" ? null : e.find(({ id: R }) => R === f.sampleId) ?? null, m = Sn(f), x = (m == null ? void 0 : m.join("|")) ?? "", y = tt.useMemo(
    () => x ? x.split("|").map((R) => e.find((P) => P.id === R) ?? null) : null,
    [e, x]
  ), C = v ? { ...r, ...v.tree } : r, w = f.kind !== "text" && t.templateSampleId && t.templateSampleId !== f.sampleId ? e.find(({ id: R }) => R === t.templateSampleId) ?? null : null, D = f.kind === "text" || !v ? { id: f.kind === "text" ? "" : f.populationId, missing: !1 } : Sa(f.populationId, v.tree, h, w == null ? void 0 : w.tree.id), M = D.id, E = D.missing ? ((j = w == null ? void 0 : w.tree.populations[f.kind === "text" ? "" : f.populationId]) == null ? void 0 : j.name) ?? "the population" : null, k = f.kind === "text" ? null : u({ ...f, populationId: M }, void 0, t.unitId), g = ((R) => k ? za(R, k) : R)(l), _ = JSON.stringify(f);
  return tt.useEffect(() => {
    const R = c.current;
    if (!R || f.kind === "text") return;
    R.dataset.layoutPending = "1";
    const P = () => {
      var J, st, dt, yt;
      if (R.innerHTML = "", !v) {
        R.textContent = Ql("The referenced file is unavailable or still loading."), R.className = "gl-layout-plot-host is-missing";
        return;
      }
      const B = C.populations[M];
      if (!(f.kind === "strategy" && !!((J = f.populationIds) != null && J.length)) && (E || !B)) {
        R.textContent = E ? `${v.name} has no population corresponding to ${E}.` : "The referenced population is unavailable.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      R.className = "gl-layout-plot-host";
      const H = Math.max(120, t.width - 8), L = Math.max(120, t.height - 8);
      if (f.kind === "strategy" && ((st = f.populationIds) != null && st.length)) {
        const ft = v.tree, K = ft.root_population_id ?? "", ct = f.populationIds.map((re) => Sa(re, ft, h, w == null ? void 0 : w.tree.id)).filter((re) => !re.missing).map((re) => re.id), wt = ad(v.sample, ft.gates, ft.populations, K, v.derived.masks, ct, { maxEvents: o.maxEvents, globalScales: n }), xt = Math.max(1, f.columns ?? 4), pt = f.layout === "flow" ? id(wt, xt, ft.populations) : od(wt, ft.populations);
        if (!pt.length) {
          R.textContent = `${v.name} has none of the strategy's populations.`, R.className = "gl-layout-plot-host is-missing";
          return;
        }
        const bt = f.showArrows !== !1, St = bt ? sd(pt, ft.populations) : [], _t = bt ? ld(St) : 8, ht = bt ? ud(St) : 8, kt = Math.max(120, Math.min(800, f.plotSize ?? 200));
        R.removeAttribute("id");
        const Tt = document.createElement("div");
        Tt.id = `layout-strategy-${t.id}`, Tt.style.width = "max-content", R.appendChild(Tt);
        const Yt = (re) => {
          const ue = gd(pt, {
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
            gridGap: _t,
            gridRowGap: ht,
            canvasScale: s * re,
            fontSizes: va(o),
            contextTitle: g
          });
          ui().renderMultiStrategyGrid(Tt.id, ue);
        };
        Yt(1), bt && cd(Tt);
        const Xt = Tt.scrollWidth, Bt = Tt.scrollHeight, At = Xt > 0 && Bt > 0 ? Math.max(0.1, Math.min(4, H / Xt, L / Bt)) : 1;
        Math.abs(At - 1) > 0.01 && (Tt.style.zoom = String(At), Yt(At)), fd(Tt, St, { color: f.arrowColor ?? (o.pubStyle ? "#444444" : null), width: f.arrowWidth ?? 1.5, anchor: f.arrowAnchor ?? "label" });
        return;
      }
      if (f.kind === "strategy") {
        const ft = dd(
          v.sample,
          C.gates,
          C.populations,
          C.root_population_id ?? "",
          M,
          { fullPath: f.fullPath, maxEvents: o.maxEvents }
        ), K = 8, ct = 26, wt = Math.max(1, ft.length);
        let xt = 1, pt = 0;
        for (let St = 1; St <= wt; St++) {
          const _t = Math.ceil(wt / St), ht = Math.floor((H - K * (St - 1)) / St), kt = Math.floor((L - ct - K * (_t - 1)) / _t), Tt = Math.min(ht, kt);
          Tt > pt && (pt = Tt, xt = St);
        }
        pt = Math.max(100, Math.min(800, pt));
        const bt = pd(
          v.sample,
          ft,
          null,
          n,
          {
            gateView: ["forward"],
            displayMode: f.displayMode,
            maxEvents: o.maxEvents,
            nColumns: xt,
            plotSize: pt,
            fitToColumns: !1,
            contourThreshold: o.contourThreshold,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateLabelFormat: o.gateLabels,
            fontSizes: va(o),
            contextTitle: g
          }
        );
        R.id = `layout-strategy-${t.id}`;
        for (const St of Object.values(bt.plots ?? {})) St.canvas_scale = s;
        ui().renderStrategyGrid(R.id, bt);
        return;
      }
      const $ = Math.max(120, Math.min(H, L)), Z = f.kind === "histogram" ? null : f.yChannel, F = {
        displayMode: f.displayMode,
        maxEvents: o.maxEvents,
        nColumns: 1,
        plotSize: $,
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
        fontSizes: va(o),
        scaleFontsWithPlot: !0
      }, rt = (ft, K) => ui().renderMiniPlot(R, {
        ...ft,
        display_mode: f.displayMode,
        plot_size: $,
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
        title: g,
        contour_levels: o.contourLevels,
        font_sizes: va(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: "#334155",
        gates: K
      });
      if (y) {
        const { members: ft } = ya(f, e, h, w == null ? void 0 : w.tree.id), K = ft.length ? hd(ft, f.xChannel, Z, n, F, h) : null;
        if (!K) {
          R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
          return;
        }
        rt(K.config, K.gates);
        return;
      }
      const at = vd(
        v.sample,
        C.gates,
        C.gate_order,
        C.populations,
        v.derived.masks,
        v.derived.stats.event_count,
        [M],
        [f.xChannel],
        Z,
        n,
        F,
        v.derived.gateMasks
      ), Q = `${M}|${f.xChannel}`, nt = (dt = at.plots) == null ? void 0 : dt[Q];
      if (!nt) {
        R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      rt(nt, ((yt = at.gate_overlays) == null ? void 0 : yt[Q]) ?? []);
    }, z = window.setTimeout(() => {
      try {
        P();
      } finally {
        delete R.dataset.layoutPending;
      }
    }, 80);
    return () => window.clearTimeout(z);
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
    C.gate_order,
    C.gate_version,
    C.gates,
    C.stored_hierarchies,
    C.populations,
    C.root_population_id,
    M,
    E,
    s,
    g,
    y,
    h
  ]), f.kind === "text" ? /* @__PURE__ */ S.jsx(
    "div",
    {
      className: "gl-layout-text-surface",
      style: { fontSize: f.fontSize, fontWeight: f.bold ? 700 : 400 },
      children: f.text
    }
  ) : /* @__PURE__ */ S.jsx("div", { ref: c, className: "gl-layout-plot-host" });
}
function hm({
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
  divisionProfiles: m,
  imageService: x,
  canvasScale: y,
  onTextChange: C,
  onTextFocus: w,
  textEditing: D,
  onTextEditStart: M,
  onTextEditEnd: E,
  onIsolate: k
}) {
  var j;
  const { t: T } = Ur(), g = ed(t), _ = g === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / g)), height: Math.max(1, Math.round(t.height / g)) };
  return /* @__PURE__ */ S.jsx(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": g === 1 ? void 0 : g,
      title: `${t.locked ? `${T("Locked")} · ` : ""}${Ke(t, n)}`,
      "data-title": Ke(t, n),
      onDoubleClick: k ? (R) => {
        R.stopPropagation(), k();
      } : void 0,
      className: `gl-layout-item${r ? " is-selected" : ""}${t.showFrame ? " has-frame" : ""}${t.recipe.kind === "text" ? " is-text" : ""}${t.locked ? " is-locked" : ""}`,
      style: {
        left: t.x,
        top: t.y,
        width: t.width,
        height: t.height,
        zIndex: t.z
      },
      children: /* @__PURE__ */ S.jsx("div", { className: "gl-layout-item-body", style: g === 1 ? void 0 : { zoom: g, width: _.width, height: _.height }, children: t.recipe.kind === "text" ? /* @__PURE__ */ S.jsx(
        gm,
        {
          text: t.recipe.text,
          templateText: e ?? t.recipe.text,
          fontSize: t.recipe.fontSize,
          bold: t.recipe.bold,
          editing: D,
          onEditStart: M,
          onEditEnd: E,
          onCommit: C,
          onFocus: w
        }
      ) : t.recipe.kind === "figure" ? /* @__PURE__ */ S.jsx(
        rd,
        {
          recipe: t.recipe,
          files: h,
          sources: v,
          state: a,
          globalScales: i,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8)
        }
      ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ S.jsx(
        nd,
        {
          recipe: t.recipe,
          samples: h,
          state: a,
          metadataById: d,
          divisionProfiles: m,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8),
          containerId: `layout-proportions-${t.id}`
        }
      ) : t.recipe.kind === "cellpanel" ? /* @__PURE__ */ S.jsx(tt.Suspense, { fallback: /* @__PURE__ */ S.jsx("div", { className: "gl-layout-plot-host" }), children: /* @__PURE__ */ S.jsx(
        nm,
        {
          recipe: t.recipe,
          service: x ?? null,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8)
        }
      ) }) : t.recipe.kind === "imagewall" ? /* @__PURE__ */ S.jsx(tt.Suspense, { fallback: /* @__PURE__ */ S.jsx("div", { className: "gl-layout-plot-host" }), children: /* @__PURE__ */ S.jsx(
        rm,
        {
          recipe: t.recipe,
          service: x ?? null,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8)
        }
      ) }) : t.recipe.kind === "chart" ? /* @__PURE__ */ S.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ S.jsx(
        em,
        {
          data: tf(t.recipe, n, d, f, a),
          recipe: t.recipe,
          style: l,
          width: Math.max(120, _.width - 8),
          height: Math.max(80, _.height - 8),
          title: ((j = t.recipe.title) == null ? void 0 : j.trim()) || Ke(t, n)
        }
      ) }) : /* @__PURE__ */ S.jsx(
        pm,
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
const vm = [
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
function ql({
  effective: t,
  own: e,
  onChange: r
}) {
  const { t: n } = Ur();
  return /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-style-fields", children: [
    vm.map(({ key: a, label: i, step: o, integer: s }) => /* @__PURE__ */ S.jsxs(tt.Fragment, { children: [
      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline" + (a in e ? " is-own" : ""), children: [
        n(i),
        /* @__PURE__ */ S.jsx(
          ve,
          {
            "aria-label": n(i),
            value: a === "maxEvents" && t.maxEvents === 0 ? Gs.maxEvents : t[a],
            min: Bs[a][0],
            max: Bs[a][1],
            step: o,
            integer: s,
            disabled: a === "maxEvents" && t.maxEvents === 0,
            onCommit: (l) => r({ [a]: l })
          }
        )
      ] }),
      a === "maxEvents" && // An event cap of 0 is every event, as on the Gating tab: a pooled plot of a whole SCE
      // can then be drawn as the Gating tab's pooled view draws it.
      /* @__PURE__ */ S.jsxs("label", { className: "gl-check" + ("maxEvents" in e ? " is-own" : ""), title: n("Draw every event of the plot's files rather than a sample of them; a plot of a million points repaints slowly. Counts and percentages always use every event."), children: [
        /* @__PURE__ */ S.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.maxEvents === 0,
            onChange: (l) => r({ maxEvents: l.target.checked ? 0 : Gs.maxEvents })
          }
        ),
        n("All events")
      ] })
    ] }, a)),
    /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline" + ("gateLabels" in e ? " is-own" : ""), children: [
      n("Gate labels"),
      /* @__PURE__ */ S.jsxs(
        "select",
        {
          "aria-label": n("Gate labels"),
          value: t.gateLabels,
          onChange: (a) => r({ gateLabels: a.target.value }),
          children: [
            /* @__PURE__ */ S.jsx("option", { value: "name-percent", children: n("Name and percentage") }),
            /* @__PURE__ */ S.jsx("option", { value: "percent", children: n("Percentage") }),
            /* @__PURE__ */ S.jsx("option", { value: "number", children: n("Number only") }),
            /* @__PURE__ */ S.jsx("option", { value: "name", children: n("Name only") }),
            /* @__PURE__ */ S.jsx("option", { value: "none", children: n("None") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ S.jsxs("label", { className: "gl-check" + ("pubStyle" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ S.jsx(
        "input",
        {
          type: "checkbox",
          checked: t.pubStyle,
          onChange: (a) => r({ pubStyle: a.target.checked })
        }
      ),
      n("Publication style (black gates and labels)")
    ] }),
    /* @__PURE__ */ S.jsxs("label", { className: "gl-check" + ("histFill" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ S.jsx(
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
function gm({
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
  const { t: u } = Ur(), [c, f] = tt.useState(e), d = tt.useRef(null);
  tt.useEffect(() => {
    if (!a) return;
    f(e);
    const v = d.current;
    v && (v.focus({ preventScroll: !0 }), v.setSelectionRange(v.value.length, v.value.length));
  }, [a]);
  const h = { fontSize: r, fontWeight: n ? 700 : 400 };
  return a ? /* @__PURE__ */ S.jsx(
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
  ) : /* @__PURE__ */ S.jsx(
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
function xm({
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
  illustrationConfig: m,
  onOpenInIllustration: x,
  plottingSettings: y,
  divisionProfiles: C = om,
  imageService: w = null,
  onOpenInPlotting: D,
  dataRevision: M,
  densityColorPower: E,
  onOpenInGating: k,
  onExported: T
}) {
  var ys, bs, Ss, Cs, ws, Es;
  const { t: g } = Ur(), _ = Of("layout"), [j, R] = tt.useState([]), [P, z] = tt.useState(null), [B, Y] = tt.useState(!0), [H, L] = tt.useState(null), [$, Z] = tt.useState(null), [F, rt] = tt.useState([]), [at, Q] = tt.useState([]), nt = tt.useRef(null), J = tt.useRef(null), [st, dt] = tt.useState(null), [yt, ft] = tt.useState(null), [K, ct] = tt.useState(
    u ?? ((ys = r[0]) == null ? void 0 : ys.id) ?? ""
  ), [wt, xt] = tt.useState("item"), [pt, bt] = tt.useState(!1), [St, _t] = tt.useState({ shift: !1, meta: !1 });
  tt.useEffect(() => {
    const p = (I) => _t((A) => {
      const G = { shift: I.shiftKey, meta: I.metaKey || I.ctrlKey };
      return G.shift === A.shift && G.meta === A.meta ? A : G;
    }), b = () => _t((I) => I.shift || I.meta ? { shift: !1, meta: !1 } : I);
    return window.addEventListener("keydown", p), window.addEventListener("keyup", p), window.addEventListener("blur", b), () => {
      window.removeEventListener("keydown", p), window.removeEventListener("keyup", p), window.removeEventListener("blur", b);
    };
  }, []);
  const [ht, kt] = tt.useState(1), Tt = tt.useRef(ht);
  Tt.current = ht;
  const [Yt, Xt] = tt.useState(ht);
  tt.useEffect(() => {
    const p = window.setTimeout(() => Xt(ht), 250);
    return () => window.clearTimeout(p);
  }, [ht]);
  const Bt = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * Yt)), [At, re] = tt.useState("pdf"), [ue, jn] = tt.useState(!1), [tn, Va] = tt.useState(3), [Ae, kr] = tt.useState(!1), Mr = tt.useRef(null), cr = tt.useRef(null), Be = (p) => {
    var b;
    R(p), (b = Mr.current) == null || b.focus({ preventScroll: !0 });
  }, Ua = (p) => Be(p ? [p] : []), Ie = Nf(
    r,
    r.map((p) => p.id),
    f,
    M
  ), It = tt.useMemo(
    () => Ie.current ? Ie.sources.map((p) => ({ ...p, derived: p.gating })) : [],
    [Ie.current, Ie.sources]
  ), Ge = tt.useMemo(
    () => Object.fromEntries(r.map((p) => [p.id, p.metadata])),
    [r]
  ), Mt = tt.useMemo(() => Nr(f), [f]), Rt = r.length === 0 || Ie.current && Ie.pending === 0, qe = tt.useRef([]), Qe = tt.useRef([]), U = t.sheets.find(({ id: p }) => p === t.activeSheetId) ?? t.sheets[0], ot = (U == null ? void 0 : U.iteration) ?? Jl, ne = tt.useMemo(() => {
    const p = U == null ? void 0 : U.items.find((I) => oe(I.recipe) && I.recipe.iterated === !0), b = p && "sampleId" in p.recipe ? p.recipe.sampleId : u;
    return It.find(({ id: I }) => I === b) ?? It[0] ?? null;
  }, [U, It, u]), Ce = tt.useMemo(
    () => {
      var p;
      return ot.mode === "populations" ? ne ? Bg(ot, ne.tree, {
        ...r.find(({ id: b }) => b === ne.id) ?? ne,
        groupName: (p = a.find((b) => b.id === i[ne.id])) == null ? void 0 : p.name
      }) : [] : ot.mode === "metadata" ? Ag(ot, r, n, a, i, s == null ? void 0 : s[ot.column ?? ""]) : zg(ot, r, n, a, i);
    },
    [ot, r, n, a, i, ne, s]
  ), _r = tt.useCallback((p, b, I) => {
    var Nt, xe, We;
    const A = r.find(({ id: Lt }) => Lt === p.sampleId) ?? null, G = It.find(({ id: Lt }) => Lt === p.sampleId) ?? null;
    let X = p.populationId;
    if (G) {
      const Lt = b && b !== p.sampleId ? (Nt = It.find(({ id: Ye }) => Ye === b)) == null ? void 0 : Nt.tree.id : void 0, Un = Sa(p.populationId, G.tree, Mt, Lt);
      Un.missing || (X = Un.id);
    }
    const W = G == null ? void 0 : G.tree.populations[X], it = Sn(p);
    if (it && p.kind !== "strategy") {
      const { members: Lt } = ya(p, It, Mt, b ? (xe = It.find(({ id: dr }) => dr === b)) == null ? void 0 : xe.tree.id : void 0), Un = Lt.reduce((dr, Ds) => dr + (Ds.gating.stats.event_count[Ds.populationId] ?? 0), 0), Ye = I ? Ce.find((dr) => dr.id === I) : void 0;
      return Wl(
        p,
        { name: Ye != null && Ye.sampleIds ? Ye.name : `${it.length} files`, fileName: `${it.length} files`, metadata: Ye != null && Ye.sampleIds ? Ye.metadata : Vc(it.map((dr) => Ge[dr])) },
        W ? { id: X, name: W.name } : null,
        Lt.length ? Un : void 0,
        l
      );
    }
    const mt = G == null ? void 0 : G.derived.stats.event_count[X], lt = A ? (We = a.find((Lt) => Lt.id === i[A.id])) == null ? void 0 : We.name : void 0;
    return Wl(
      p.kind === "strategy" ? {} : p,
      A ? { name: A.name, fileName: A.fileName ?? A.name, groupName: lt, metadata: A.metadata } : null,
      W ? { id: X, name: W.name } : null,
      typeof mt == "number" ? mt : void 0,
      l
    );
  }, [r, It, f, l, Mt, Ge, Ce, a, i]), se = tt.useMemo(
    () => U ? Ng(U, Ce, _r) : [],
    [U, Ce, _r]
  ), [Ka, Tr] = tt.useState(0), [Vo, ef] = tt.useState(!1), [rf, nf] = tt.useState(" · "), Uo = tt.useMemo(
    () => [...new Set(Object.values(l ?? {}).flatMap((p) => Object.keys(p)))].sort(),
    [l]
  ), Ko = tt.useMemo(() => Rg(o, Uo), [o, Uo]), Fe = Math.min(Ka, Math.max(0, se.length - 1)), Ht = se[Fe] ?? im, Zo = ((bs = U == null ? void 0 : U.titleTemplate) == null ? void 0 : bs.trim()) || Pg(
    se.flatMap((p) => p.items).flatMap((p) => {
      var b;
      return oe(p.recipe) ? [{ sampleId: ((b = Sn(p.recipe)) == null ? void 0 : b.join(",")) ?? p.recipe.sampleId, populationId: p.recipe.populationId, label: p.recipe.kind === "strategy" ? void 0 : p.recipe.label }] : [];
    }),
    ot.mode === "metadata" ? { metadataColumn: ot.column } : void 0
  );
  tt.useEffect(() => {
    Ka !== Fe && Tr(Fe);
  }, [Ka, Fe]);
  const en = (p) => p.split("::")[0], ie = [...new Set(j.map(en))], he = (U == null ? void 0 : U.items.filter(({ id: p }) => ie.includes(p))) ?? [], V = he.length === 1 ? he[0] : null, Ut = V ? Ht.items.find((p) => p.templateId === V.id) ?? null : null, zn = (V == null ? void 0 : V.recipe.kind) === "chart" ? V.recipe : null, we = tt.useMemo(() => {
    if (!zn) return null;
    const { missing: p, noChannel: b, groups: I } = tf(zn, It, Ge, n, f), A = !!zn.groupBy && I.some((G) => G.label === Aa);
    return p.length || b.length || A ? { missing: p, noChannel: b, unassigned: A } : null;
  }, [zn, It, Ge, n, f]), Jo = (p) => p.split("::")[1] ?? "", An = (p) => {
    var b;
    return (b = Ht.items.find((I) => I.id === p)) == null ? void 0 : b.group;
  }, Qo = (p) => {
    const b = new Set(p.map(An).filter((G) => !!G));
    if (!b.size) return [...p];
    const I = new Set(p.map(Jo)), A = new Set(p);
    for (const G of Ht.items) G.group && b.has(G.group) && I.has(Jo(G.id)) && A.add(G.id);
    return [...A];
  }, rn = jf(he).length, af = he.length > 1 && he.every((p) => p.group && p.group === he[0].group), ts = (p, b) => {
    var G;
    if (!oe(p.recipe)) return "";
    const I = ((G = p.recipe.title) == null ? void 0 : G.trim()) ?? "";
    if (!I) return "";
    const A = _r(p.recipe, b);
    return A && fm(I, A.population, [A.file, A.sample]) ? "" : I;
  }, of = Ut && oe(Ut.recipe) ? za(Zo, _r(Ut.recipe, Ut.templateSampleId, Ut.unitId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", Za = he.some((p) => p.locked), Bn = new Set(((U == null ? void 0 : U.items) ?? []).filter((p) => p.locked).map((p) => p.id)), Ve = F.filter((p) => !Bn.has(en(p.dataset.itemId ?? "")) && p.dataset.itemId !== P), nn = Ve.length > 1 && Ve.every((p) => !An(p.dataset.itemId ?? "")), es = tt.useRef(Ve);
  es.current = Ve;
  const Gn = tt.useRef(!1);
  tt.useEffect(() => {
    j.length && j.some((p) => !Ht.items.some((b) => b.id === p)) && R((p) => p.filter((b) => Ht.items.some((I) => I.id === b)));
  }, [Ht, j]), tt.useLayoutEffect(() => {
    var p;
    (p = nt.current) == null || p.updateRect();
  }, [Ht, ht, Yt]), tt.useLayoutEffect(() => {
    var G;
    if (!H) return;
    const p = [...H.querySelectorAll("[data-item-id]")], b = (X, W) => X.length === W.length && X.every((it, mt) => it === W[mt]), I = p.filter((X) => j.includes(X.dataset.itemId ?? "")), A = p.filter((X) => !j.includes(X.dataset.itemId ?? ""));
    rt((X) => b(X, I) ? X : I), Q((X) => b(X, A) ? X : A), (G = J.current) == null || G.setSelectedTargets(I);
  }, [H, j, Ht, U == null ? void 0 : U.id]), tt.useEffect(() => {
    hs();
  }, [U == null ? void 0 : U.id]);
  const Ja = (p, b = !0) => {
    b && (qe.current = [
      Kn(t),
      ...qe.current
    ].slice(0, 30), Qe.current = []), e(p);
  }, Ir = (p) => {
    const b = Kn(t);
    p(b), Ja(b);
  }, Ot = (p) => {
    Ir((b) => {
      const I = b.sheets.find(({ id: A }) => A === b.activeSheetId);
      I && p(I);
    });
  }, Qa = tt.useRef(null), [sf, ti] = tt.useState(null), Rr = (p, b) => {
    let I = "";
    const A = Qa.current;
    Qa.current = null, Ot((G) => {
      I = crypto.randomUUID();
      const X = Ls(G, b == null ? void 0 : b.width, b == null ? void 0 : b.height);
      A && (X.x = Math.max(0, Math.round(A.x)), X.y = Math.max(0, Math.round(A.y))), G.items.push({
        id: I,
        ...X,
        recipe: p
      });
    }), Ua(I), xf(I);
  }, ae = It.find(({ id: p }) => p === K) ?? It[0] ?? null, ei = ae && c ? un(
    {
      hierarchyId: f.active_hierarchy_id,
      populationId: c
    },
    ae.tree,
    Nr(f)
  ) : null, tr = (ei == null ? void 0 : ei.id) ?? (ae == null ? void 0 : ae.tree.root_population_id) ?? "", Fn = (p) => {
    var b, I, A;
    if (!ae || !tr) {
      ft(g("Check an FCS file and select a population first."));
      return;
    }
    Rr({
      kind: p,
      sampleId: ae.id,
      populationId: tr,
      ...ot.mode !== "off" ? { iterated: !0 } : {},
      xChannel: ae.sample.index(h) !== void 0 ? h : ((b = ae.sample.channels[0]) == null ? void 0 : b.key) ?? "",
      yChannel: p === "histogram" ? null : ae.sample.index(v) !== void 0 ? v : ((I = ae.sample.channels[1]) == null ? void 0 : I.key) ?? ((A = ae.sample.channels[0]) == null ? void 0 : A.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, rs = () => {
    if (!ae || !tr) {
      ft(g("Check an FCS file and select a population first."));
      return;
    }
    Rr(
      {
        kind: "chart",
        sampleId: ae.id,
        populationId: tr,
        statistic: "percent_of_parent",
        files: "checked",
        groupBy: o[0] ?? "",
        chartType: "bars",
        showPoints: !0,
        test: !0
      },
      { width: 320, height: 240 }
    );
  }, ns = () => Rr({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), lf = (p, b) => {
    Ot((I) => {
      const A = I.items.find((G) => G.id === p);
      A && (A.recipe = b(A.recipe));
    });
  }, uf = (p) => {
    p.preventDefault();
    const b = p.target.closest("[data-item-id]");
    if (b != null && b.dataset.itemId) {
      const X = b.dataset.itemId, W = U == null ? void 0 : U.items.find(({ id: Lt }) => Lt === en(X));
      if (!W) return;
      const it = j.includes(X);
      it || Be(Qo([X]));
      const mt = W.group ? ((U == null ? void 0 : U.items) ?? []).filter((Lt) => Lt.group === W.group).map(({ id: Lt }) => Lt) : [W.id], lt = it && ie.length > 1 ? ie : mt, Nt = lt.length > 1, xe = oe(W.recipe), We = [
        { label: Nt ? g("Duplicate {n} items", { n: lt.length }) : g("Duplicate"), onClick: () => on(lt) },
        { label: g("Bring to front"), onClick: () => Ue(lt, "front") },
        { label: g("Bring forward"), onClick: () => Ue(lt, "forward") },
        { label: g("Send backward"), onClick: () => Ue(lt, "backward") },
        { label: g("Send to back"), onClick: () => Ue(lt, "back") },
        { label: W.locked ? g("Unlock") : g("Lock"), onClick: () => Wn(lt, !W.locked) },
        ...it && rn > 1 ? [{ label: g("Group"), onClick: Ln }] : [],
        ...W.group ? [{ label: g("Ungroup"), onClick: () => Ot((Lt) => Fs(Lt, lt)) }] : [],
        "separator",
        ...ot.mode !== "off" && xe ? [
          {
            label: "iterated" in W.recipe && W.recipe.iterated ? g("Stop following the iteration") : g("Follow the iteration"),
            onClick: () => lf(W.id, (Lt) => oe(Lt) ? { ...Lt, iterated: !Lt.iterated } : Lt)
          },
          "separator"
        ] : [],
        ...xe ? [{ label: g("Open in Gating"), onClick: () => k(W.recipe) }] : [],
        ...W.recipe.kind === "figure" && x ? [{ label: g("Edit in Illustration"), onClick: () => x(structuredClone(W.recipe.illustration)) }] : [],
        ...W.recipe.kind === "proportions" && D ? [{ label: g("Edit in Plotting"), onClick: () => D(structuredClone(W.recipe.settings)) }] : [],
        { label: Nt ? g("Remove {n} items", { n: lt.length }) : g("Remove"), onClick: () => an(lt) }
      ];
      ti({ x: p.clientX, y: p.clientY, items: We, label: Ke(W, It) });
      return;
    }
    const I = p.currentTarget.getBoundingClientRect(), A = { x: (p.clientX - I.left) / ht, y: (p.clientY - I.top) / ht }, G = (X) => () => {
      Qa.current = A, X();
    };
    ti({
      x: p.clientX,
      y: p.clientY,
      label: g("Page"),
      items: [
        { label: g("+ Biplot"), disabled: !Rt, onClick: G(() => Fn("biplot")) },
        { label: g("+ Histogram"), disabled: !Rt, onClick: G(() => Fn("histogram")) },
        { label: g("+ Gating strategy"), disabled: !Rt, onClick: G(os) },
        { label: g("+ Chart"), disabled: !Rt, onClick: G(rs) },
        { label: g("+ Text"), onClick: G(ns) },
        { label: g("+ Illustration figure"), disabled: !Rt || !(m != null && m.figure), onClick: G(as) },
        { label: g("+ Plotting chart"), disabled: !Rt || !y, onClick: G(is) },
        "separator",
        // With a selection on the page, the menu on blank paper offers what the selection's own menu does for grouping, as Illustrator's does.
        ...rn > 1 ? [{ label: g("Group"), onClick: Ln }] : [],
        ...he.some((X) => X.group) ? [{ label: g("Ungroup"), onClick: ni }] : [],
        { label: g("Select all"), disabled: !Ht.items.length, onClick: () => Be(Ht.items.filter((X) => !Bn.has(X.templateId)).map(({ id: X }) => X)) }
      ]
    });
  }, as = () => {
    if (!(m != null && m.figure)) {
      ft(g("Make a figure on the Illustration tab first."));
      return;
    }
    U && Rr({ kind: "figure", illustration: structuredClone(m), page: 0 }, Hf(m, r, f, U));
  }, is = () => {
    if (!y || !U) return;
    const p = y(), b = $f(p, qf(r), f, Ge, C);
    if (!b.catLevels.length || !b.perSample.length) {
      ft(g("Choose files and populations on the Plotting tab first."));
      return;
    }
    Rr({ kind: "proportions", settings: p }, Vf(p, b, U));
  }, os = () => {
    var I;
    if (!ae || !tr) {
      ft(g("Check an FCS file and select a population first."));
      return;
    }
    const p = ae.tree.root_population_id ?? "", b = tr !== p ? tr : ((I = ga(ae.tree.populations, p).filter(({ popId: A }) => A !== p).at(-1)) == null ? void 0 : I.popId) ?? tr;
    Rr(
      {
        kind: "strategy",
        sampleId: ae.id,
        populationId: b,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...ot.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, cf = () => {
    var G, X;
    if (!m) {
      ft(g("Render or configure an Illustration selection first."));
      return;
    }
    if (!m.figure && m.plotType === "heatmap") {
      ft(
        g("Heatmap layout blocks are planned for the next Layout phase.")
      );
      return;
    }
    const p = new Map(It.map((W) => [W.id, W])), b = [], I = m.figure;
    for (const W of It) {
      if (I) {
        if (!I.sampleIds.includes(W.id)) continue;
        for (const mt of I.plots)
          if (mt.type !== "heatmap")
            for (const lt of mt.population ? [mt.population] : ((G = I.samplePopulations) == null ? void 0 : G[W.id]) ?? I.populations) {
              const Nt = un(
                lt,
                W.tree,
                Nr(f)
              );
              Nt.id && Nt.status !== "changed" && b.push({
                sampleId: W.id,
                populationId: Nt.id,
                xChannel: mt.x,
                yChannel: mt.y,
                type: mt.type
              });
            }
        continue;
      }
      const it = m.selectionMode === "matrix" ? ((X = m.selectedPopulationsBySample) == null ? void 0 : X[W.id]) ?? [] : m.popIds;
      for (const mt of it)
        for (const lt of m.xChannels)
          b.push({ sampleId: W.id, populationId: mt, xChannel: lt });
    }
    const A = b.slice(0, 60);
    if (A.length === 0) {
      ft(
        g("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    Ot((W) => {
      const it = [];
      for (const mt of A) {
        if (!p.get(mt.sampleId)) continue;
        const Nt = mt.type ?? (m.plotType === "histogram" ? "histogram" : "biplot");
        it.push({
          kind: Nt,
          sampleId: mt.sampleId,
          populationId: mt.populationId,
          xChannel: mt.xChannel,
          yChannel: Nt === "histogram" ? null : mt.yChannel ?? m.yChannel,
          displayMode: m.displayMode === "dots" ? "scatter" : m.displayMode
        });
      }
      for (const mt of md(W, it))
        W.items.push({
          id: crypto.randomUUID(),
          ...Ls(W),
          recipe: mt
        });
    }), ft(
      b.length > A.length ? g(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: A.length
        }
      ) : g("Added {count} Illustration plots.", { count: A.length })
    );
  }, Dt = (p) => {
    V && Ot((b) => {
      const I = b.items.find(({ id: G }) => G === V.id);
      if (!I) return;
      const A = I.recipe;
      if (I.recipe = p(I.recipe), A.kind === "cellpanel" && I.recipe.kind === "cellpanel") {
        const G = As(A), X = As(I.recipe), W = Math.max(0.1, Math.min(I.width / Math.max(1, G.width), I.height / Math.max(1, G.height)));
        I.width = Math.max(40, Math.round(X.width * W)), I.height = Math.max(30, Math.round(X.height * W));
      }
    });
  }, ri = (p) => Dt((b) => {
    if (b.kind !== "biplot" && b.kind !== "histogram") return b;
    const I = p ? r.filter((X) => p.includes(X.id)).map((X) => X.id) : [];
    if (!I.length) {
      const { pool: X, ...W } = b;
      return W;
    }
    const A = I.includes(b.sampleId) ? b.sampleId : I[0];
    let G = b.populationId;
    if (A !== b.sampleId) {
      const X = It.find(({ id: it }) => it === b.sampleId), W = It.find(({ id: it }) => it === A);
      X && W && (G = un({ hierarchyId: X.tree.id, populationId: G }, W.tree, Mt).id ?? W.tree.root_population_id ?? G);
    }
    return { ...b, sampleId: A, populationId: G, pool: { sampleIds: I } };
  }), ff = tt.useMemo(() => {
    var X;
    const p = V == null ? void 0 : V.recipe;
    if (!p || !oe(p) || p.kind === "strategy" || !p.pool) return null;
    const b = Ut != null && Ut.templateSampleId ? (X = It.find(({ id: W }) => W === Ut.templateSampleId)) == null ? void 0 : X.tree.id : void 0, { members: I, leftOut: A } = ya(p, It, Mt, b), G = p.kind === "biplot" && p.yChannel && I.length > 1 ? zf(Mt, I.map((W) => W.tree.id), p.xChannel, p.yChannel).omitted.map((W) => W.name) : [];
    return { pooled: I.length, total: p.pool.sampleIds.length, leftOut: A, omittedGates: G };
  }, [V, Ut, It, Mt]), ss = tt.useMemo(() => {
    var W;
    const p = Ut == null ? void 0 : Ut.recipe;
    if (!p || !oe(p) || !(Ut != null && Ut.unitId)) return null;
    const b = Ce.find((it) => it.id === Ut.unitId);
    if (!b) return null;
    if (b.populationId) return g("This page draws {name}; the population chosen here is the template's.", { name: b.name });
    if (!b.sampleIds) return g("This page draws {name}; the file chosen here is the template's.", { name: b.name });
    const I = (it) => {
      var mt;
      return ((mt = r.find((lt) => lt.id === it)) == null ? void 0 : mt.name) ?? it;
    };
    if (p.kind === "strategy") return g("This page is {value}: a strategy is drawn for one file, {file}, not pooled.", { value: b.name, file: I(p.sampleId) });
    if (!p.pool) return g("This page is {value}: {file} alone.", { value: b.name, file: I(p.sampleId) });
    const A = Ut.templateSampleId ? (W = It.find(({ id: it }) => it === Ut.templateSampleId)) == null ? void 0 : W.tree.id : void 0, { members: G, leftOut: X } = ya(p, It, Mt, A);
    return g("This page is {value}: {n} of {m} files pooled", { value: b.name, n: G.length, m: p.pool.sampleIds.length }) + (X.length ? ` · ${g("Not pooled: {files}", { files: X.map((it) => `${it.name} (${it.reason})`).join(", ") })}` : "");
  }, [Ut, Ce, r, It, Mt, g]), an = (p) => {
    Ot((b) => {
      b.items = b.items.filter((I) => !p.includes(I.id)), xd(b);
    }), R((b) => b.filter((I) => !p.includes(I)));
  }, on = (p, b) => {
    const I = [];
    return Ot((A) => {
      let G = Math.max(0, ...A.items.map((it) => it.z));
      const X = p.flatMap((it) => A.items.filter((mt) => mt.id === it)), { copies: W } = Os(X);
      W.forEach((it, mt) => {
        const lt = X[mt];
        I.push(it.id);
        const Nt = (b == null ? void 0 : b[lt.id]) ?? { x: lt.x + 20, y: lt.y + 20, width: lt.width, height: lt.height };
        A.items.push({ ...it, ...Nt, locked: !1, z: ++G });
      });
    }), I.length && Be(I), I;
  }, df = (p, b, I) => {
    Ot((A) => {
      for (const G of A.items)
        !p.includes(G.id) || G.locked || (G.x += b, G.y += I);
    });
  }, Ue = (p, b) => {
    Ot((I) => {
      const A = [...I.items].sort((it, mt) => it.z - mt.z), G = A.filter((it) => p.includes(it.id)), X = A.filter((it) => !p.includes(it.id));
      let W;
      if (b === "front") W = [...X, ...G];
      else if (b === "back") W = [...G, ...X];
      else {
        W = A;
        const it = W.map((mt, lt) => lt);
        b === "forward" && it.reverse();
        for (const mt of it) {
          const lt = b === "forward" ? mt + 1 : mt - 1;
          !p.includes(W[mt].id) || lt < 0 || lt >= W.length || p.includes(W[lt].id) || ([W[mt], W[lt]] = [W[lt], W[mt]]);
        }
      }
      W.forEach((it, mt) => {
        it.z = mt;
      });
    });
  }, Ln = () => {
    rn < 2 || Ot((p) => {
      yd(p, ie);
    });
  }, ni = () => {
    he.some((p) => p.group) && Ot((p) => Fs(p, ie));
  }, Wn = (p, b) => {
    Ot((I) => {
      for (const A of I.items) p.includes(A.id) && (A.locked = b);
    });
  }, pf = (p) => {
    Ot((b) => bd(b, ie.filter((I) => {
      var A;
      return !((A = b.items.find((G) => G.id === I)) != null && A.locked);
    }), p));
  }, hf = (p) => {
    Ot((b) => Sd(b, ie.filter((I) => {
      var A;
      return !((A = b.items.find((G) => G.id === I)) != null && A.locked);
    }), p));
  }, Yn = (p, b) => {
    const I = {};
    for (const G of p) {
      const X = G.dataset.itemId, W = Ht.items.find((lt) => lt.id === X);
      if (!W) continue;
      const { id: it, ...mt } = Lg(W, cm(G));
      I[it] = mt;
    }
    const A = Object.keys(I);
    if (A.length) {
      if (b) {
        for (const G of p) {
          const X = Ht.items.find((W) => W.id === G.dataset.itemId);
          X && Object.assign(G.style, { left: `${X.x}px`, top: `${X.y}px`, width: `${X.width}px`, height: `${X.height}px` });
        }
        on(A, I);
        return;
      }
      Ot((G) => {
        for (const X of G.items) I[X.id] && Object.assign(X, I[X.id]);
      });
    }
  }, ls = (p) => p.flatMap((b) => {
    if (!(b instanceof HTMLElement) || !b.parentElement) return [];
    const I = b.cloneNode(!0);
    I.classList.add("gl-layout-ghost"), I.classList.remove("is-selected"), I.removeAttribute("data-item-id"), I.setAttribute("aria-hidden", "true");
    const A = b.querySelectorAll("canvas");
    return I.querySelectorAll("canvas").forEach((G, X) => {
      var it;
      const W = A[X];
      W && (G.width = W.width, G.height = W.height, (it = G.getContext("2d")) == null || it.drawImage(W, 0, 0));
    }), b.parentElement.insertBefore(I, b), [I];
  }), Xn = (p) => {
    if (Array.isArray(p)) for (const b of p) b.remove();
  }, ai = (p) => {
    for (const b of p) {
      const I = Ht.items.find((A) => A.id === b.dataset.itemId);
      I && Object.assign(b.style, { left: `${I.x}px`, top: `${I.y}px`, width: `${I.width}px`, height: `${I.height}px` });
    }
  }, us = tt.useRef(ai);
  us.current = ai;
  const er = tt.useRef(null), Hn = (p, b) => {
    const I = { targets: p, ghosts: b, cancelled: !1 };
    er.current = I;
    const A = () => {
      window.removeEventListener("mouseup", A, !0), window.removeEventListener("touchend", A, !0), window.setTimeout(() => {
        er.current === I && (er.current = null, Xn(I.ghosts));
      }, 0);
    };
    window.addEventListener("mouseup", A, !0), window.addEventListener("touchend", A, !0);
  }, $n = (p, b, I, A) => {
    const G = er.current;
    er.current = null, Xn(G == null ? void 0 : G.ghosts);
    const X = b == null ? void 0 : b.dist, W = !X || Math.hypot(X[0] ?? 0, X[1] ?? 0) >= 3;
    G != null && G.cancelled || !I || !W ? ai(p) : A();
  }, cs = (p) => {
    var G;
    p.target.style.left = `${p.left}px`, p.target.style.top = `${p.top}px`;
    const b = (G = p.datas) == null ? void 0 : G.companions;
    if (!(b != null && b.length)) return;
    const I = p.left - p.datas.startLeft, A = p.top - p.datas.startTop;
    for (const { el: X, left: W, top: it } of b)
      X.style.left = `${W + I}px`, X.style.top = `${it + A}px`;
  }, fs = (p) => {
    var I;
    const b = (I = p.datas) == null ? void 0 : I.companions;
    return [p.target, ...(b ?? []).map(({ el: A }) => A)];
  }, vf = (p) => {
    var G;
    p.datas.alt = !!((G = p.inputEvent) != null && G.altKey);
    const b = p.target, I = nn ? es.current.filter((X) => X !== b) : [];
    p.datas.startLeft = parseFloat(b.style.left) || 0, p.datas.startTop = parseFloat(b.style.top) || 0, p.datas.companions = I.map((X) => ({ el: X, left: parseFloat(X.style.left) || 0, top: parseFloat(X.style.top) || 0 }));
    const A = fs(p);
    Hn(A, p.datas.alt ? ls(A) : void 0);
  }, ds = (p) => {
    p.target.style.width = `${p.width}px`, p.target.style.height = `${p.height}px`, p.target.style.left = `${p.drag.left}px`, p.target.style.top = `${p.drag.top}px`;
  }, gf = (p) => {
    var A;
    const b = (A = p.inputEvent) == null ? void 0 : A.target;
    if (!b) return;
    const I = nt.current;
    if (I != null && I.isMoveableElement(b)) {
      p.stop();
      return;
    }
    if (Ve.some((G) => G === b || G.contains(b)) && (p.stop(), Ve.length > 1 && !nn)) {
      I == null || I.dragStart(p.inputEvent);
      const G = p.inputEvent, X = (W) => {
        var it;
        window.removeEventListener("mouseup", X), Math.hypot(W.clientX - G.clientX, W.clientY - G.clientY) < 4 && ((it = J.current) == null || it.clickTarget(G, b));
      };
      window.addEventListener("mouseup", X);
    }
  }, mf = (p) => {
    var G, X, W;
    const b = p.isClick || p.isDragStart, I = new Set((p.removed ?? []).map((it) => An(it.dataset.itemId ?? "")).filter(Boolean)), A = Qo(
      p.selected.map((it) => it.dataset.itemId ?? "").filter((it) => it && (b || !Bn.has(en(it))))
    ).filter((it) => !I.has(An(it)));
    if (Be(A), p.isDragStart && !p.isClick) {
      if (!A.filter((lt) => !Bn.has(en(lt)) && lt !== P).length) return;
      (X = (G = p.inputEvent) == null ? void 0 : G.preventDefault) == null || X.call(G), Gn.current = !0;
      const mt = () => {
        Gn.current = !1;
      };
      window.setTimeout(() => window.addEventListener("mousedown", mt, { capture: !0, once: !0 }), 0), (W = nt.current) == null || W.waitToChangeTarget().then(() => {
        var lt;
        return (lt = nt.current) == null ? void 0 : lt.dragStart(p.inputEvent);
      });
    }
  }, xf = (p) => {
    window.requestAnimationFrame(() => {
      var b, I, A;
      (A = (I = (b = cr.current) == null ? void 0 : b.querySelector(`[data-item-id="${p}"]`)) == null ? void 0 : I.scrollIntoView) == null || A.call(I, { block: "nearest", inline: "nearest" });
    });
  }, fr = (p) => {
    Ot((b) => Jf(b, p));
  }, yf = () => Ot((p) => Qf(p)), bf = () => Ot((p) => td(p)), ps = (() => {
    const p = [], b = [];
    if (!U) return { vertical: p, horizontal: b };
    const I = Ti(U.page), A = Ri(U.page.marginMm);
    for (const G of ba(U.page))
      p.push(G.x, G.x + A, G.x + I.width / 2, G.x + I.width - A, G.x + I.width), b.push(G.y, G.y + A, G.y + I.height / 2, G.y + I.height - A, G.y + I.height);
    return { vertical: [...new Set(p)], horizontal: [...new Set(b)] };
  })(), hs = () => {
    const p = Mr.current;
    if (!p || !U) return;
    const b = { width: p.clientWidth - 36, height: p.clientHeight - 36 };
    if (b.width <= 0 || b.height <= 0) return;
    const I = Math.min(b.width / U.width, b.height / U.height);
    kt(Math.max(0.1, Math.min(4, Math.floor(I * 100) / 100)));
  };
  tt.useEffect(() => {
    const p = $;
    if (!p) return;
    const b = (I) => {
      if (!(I.altKey || I.shiftKey || I.ctrlKey)) return;
      const A = I.deltaY || I.deltaX;
      if (!A) return;
      I.preventDefault();
      const G = Tt.current, X = Math.max(0.1, Math.min(4, Math.round(G * Math.exp(-A * 25e-4) * 100) / 100));
      if (X === G) return;
      Tt.current = X, kt(X);
      const W = p.getBoundingClientRect(), it = I.clientX - W.left, mt = I.clientY - W.top, lt = X / G, Nt = (p.scrollLeft + it) * lt - it, xe = (p.scrollTop + mt) * lt - mt;
      requestAnimationFrame(() => {
        p.scrollLeft = Nt, p.scrollTop = xe;
      });
    };
    return p.addEventListener("wheel", b, { passive: !1 }), () => p.removeEventListener("wheel", b);
  }, [$]);
  const vs = (p) => {
    const b = p > 0 ? ln.find((I) => I > ht + 1e-3) : [...ln].reverse().find((I) => I < ht - 1e-3);
    b && kt(b);
  }, Sf = async () => {
    var I;
    const p = () => new Promise((A) => window.requestAnimationFrame(() => A()));
    await new Promise((A) => window.setTimeout(A, 150));
    const b = Date.now();
    for (; (I = cr.current) != null && I.querySelector("[data-layout-pending]") && Date.now() - b < 2e4; )
      await new Promise((A) => window.setTimeout(A, 50));
    await p(), await p();
  }, gs = async () => {
    var I;
    const p = cr.current;
    if (!p || !U || Ae) return;
    kr(!0);
    const b = Fe;
    try {
      const A = [];
      for (let G = 0; G < se.length; G++) {
        se.length > 1 && (Tr(G), await Sf());
        const X = ((I = se[G]) == null ? void 0 : I.units.length) === 1 ? se[G].units[0].name : void 0;
        A.push(..._g(p, U, { zoom: ht, crop: ue ? { paddingMm: tn } : void 0 }).map((W) => X ? { ...W, label: X } : W));
      }
      await Tg(A, U, At), T == null || T();
    } catch (A) {
      ft(A instanceof Error ? A.message : String(A));
    } finally {
      se.length > 1 && Tr(b), kr(!1);
    }
  }, Le = (p) => {
    Ot((b) => {
      var I;
      if (p.mode === "off") {
        delete b.iteration;
        return;
      }
      if ((((I = b.iteration) == null ? void 0 : I.mode) ?? "off") === "off" && !b.items.some(Uc))
        for (const A of b.items) oe(A.recipe) && (A.recipe.iterated = !0);
      b.iteration = p;
    }), Tr(0);
  }, Cf = (p) => [...new Set(r.map((b) => {
    var I;
    return ((I = b.metadata) == null ? void 0 : I[p]) ?? "";
  }).filter(Boolean))], wf = ot.source.kind === "group" ? `group:${ot.source.groupId}` : ot.source.kind === "metadata" ? `meta:${ot.source.column}=${ot.source.value}` : ot.source.kind, Ef = (p) => {
    if (p === "all") return { kind: "all" };
    if (p.startsWith("group:")) return { kind: "group", groupId: p.slice(6) };
    if (p.startsWith("meta:")) {
      const [b, ...I] = p.slice(5).split("=");
      return { kind: "metadata", column: b, value: I.join("=") };
    }
    return { kind: "checked" };
  }, Df = (p) => {
    const b = zs(p.nativeEvent);
    if (b) {
      p.preventDefault(), b === "undo" ? qn() : Vn();
      return;
    }
    if (p.target.closest("input, textarea, select")) return;
    const I = p.metaKey || p.ctrlKey;
    if (p.key === "Escape") {
      R([]);
      return;
    }
    if (I && p.key.toLowerCase() === "a") {
      p.preventDefault(), Be(((U == null ? void 0 : U.items) ?? []).filter((W) => !W.locked).map((W) => W.id));
      return;
    }
    if (!j.length) return;
    if (p.key === "Enter" && j.length === 1) {
      const W = Ht.items.find((it) => it.id === j[0]);
      if ((W == null ? void 0 : W.recipe.kind) === "text") {
        p.preventDefault(), z(W.id);
        return;
      }
    }
    if (p.key === "Delete" || p.key === "Backspace") {
      p.preventDefault(), an(ie);
      return;
    }
    if (I && p.key.toLowerCase() === "d") {
      p.preventDefault(), on(ie);
      return;
    }
    if (I && (p.key === "]" || p.key === "[")) {
      p.preventDefault(), Ue(ie, p.key === "]" ? p.shiftKey ? "front" : "forward" : p.shiftKey ? "back" : "backward");
      return;
    }
    if (I && p.key.toLowerCase() === "g") {
      p.preventDefault(), p.shiftKey ? ni() : Ln();
      return;
    }
    if (I && p.shiftKey && p.key.toLowerCase() === "l") {
      p.preventDefault(), Wn(ie, !Za);
      return;
    }
    const A = p.shiftKey ? 10 : 1, X = {
      ArrowLeft: [-A, 0],
      ArrowRight: [A, 0],
      ArrowUp: [0, -A],
      ArrowDown: [0, A]
    }[p.key];
    X && (p.preventDefault(), df(ie, X[0], X[1]));
  }, ii = V == null ? void 0 : V.recipe, Ft = ii && "sampleId" in ii ? It.find(({ id: p }) => p === ii.sampleId) ?? null : null, ms = Ft ? Ft.sample.channels.map((p) => ({
    value: p.key,
    label: Ft.sample.channelLabel(Ft.sample.index(p.key) ?? 0)
  })) : [], xs = Ft ? ga(
    Ft.tree.populations,
    Ft.tree.root_population_id ?? ""
  ) : [], qn = () => {
    const p = qe.current.shift();
    p && (Qe.current = [
      Kn(t),
      ...Qe.current
    ].slice(0, 30), Ja(p, !1));
  }, Vn = () => {
    const p = Qe.current.shift();
    p && (qe.current = [
      Kn(t),
      ...qe.current
    ].slice(0, 30), Ja(p, !1));
  }, oi = tt.useRef({ undo: qn, redo: Vn });
  return oi.current = { undo: qn, redo: Vn }, tt.useEffect(() => {
    const p = (I) => {
      var G, X;
      if (I.key === "Escape" && er.current) {
        const W = er.current;
        W.cancelled = !0, I.preventDefault(), I.stopPropagation(), us.current(W.targets), Xn(W.ghosts), W.ghosts = void 0, um(nt.current);
        return;
      }
      const A = zs(I);
      A && ((X = (G = I.target) == null ? void 0 : G.closest) != null && X.call(G, "input, textarea, select, [contenteditable='true']") || (I.preventDefault(), I.stopPropagation(), A === "undo" ? oi.current.undo() : oi.current.redo()));
    }, b = () => {
      const I = er.current;
      I && (Xn(I.ghosts), I.ghosts = void 0);
    };
    return window.addEventListener("keydown", p, !0), window.addEventListener("blur", b), () => {
      window.removeEventListener("keydown", p, !0), window.removeEventListener("blur", b);
    };
  }, []), U ? /* @__PURE__ */ S.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${pt ? " is-preview" : ""}`,
      children: [
        /* @__PURE__ */ S.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": g("Layout sheets"),
            children: [
              t.sheets.map((p) => /* @__PURE__ */ S.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: st === p.id ? /* @__PURE__ */ S.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: p.name,
                  autoFocus: !0,
                  onFocus: (b) => b.currentTarget.select(),
                  onBlur: (b) => {
                    const I = b.currentTarget.value.trim();
                    I && Ir((A) => {
                      const G = A.sheets.find(
                        ({ id: X }) => X === p.id
                      );
                      G && (G.name = I);
                    }), dt(null);
                  },
                  onKeyDown: (b) => {
                    b.key === "Enter" && b.currentTarget.blur(), b.key === "Escape" && dt(null);
                  }
                }
              ) : /* @__PURE__ */ S.jsx(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": t.activeSheetId === p.id,
                  className: `gl-layout-sheet-tab${t.activeSheetId === p.id ? " active" : ""}`,
                  title: g("Double-click to rename"),
                  onClick: () => Ir((b) => {
                    b.activeSheetId = p.id;
                  }),
                  onDoubleClick: () => dt(p.id),
                  children: p.name
                }
              ) }, p.id)),
              /* @__PURE__ */ S.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-layout-sheet-add",
                  title: g("New blank layout"),
                  onClick: () => {
                    const p = Af(
                      `Layout ${t.sheets.length + 1}`,
                      { ...U.page }
                    );
                    Ir((b) => {
                      b.sheets.push(p), b.activeSheetId = p.id;
                    }), R([]);
                  },
                  children: "+"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ S.jsxs(
          "div",
          {
            className: "gl-layout-toolbar",
            onMouseDown: (p) => {
              p.target.closest("button") && p.preventDefault();
            },
            children: [
              /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Fn("biplot"), disabled: !Rt, title: g(Rt ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: g("+ Biplot") }),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Fn("histogram"), disabled: !Rt, title: g(Rt ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: g("+ Histogram") }),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: os, disabled: !Rt, title: g(Rt ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: g("+ Gating strategy") }),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: rs, disabled: !Rt, title: g(Rt ? "Add a summary chart: one statistic of a population per file, grouped by a metadata column, with a test between the groups" : "Preparing the files…"), children: g("+ Chart") }),
                /* @__PURE__ */ S.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: g("Add a text block; edit it on the page"),
                    onClick: ns,
                    children: g("+ Text")
                  }
                ),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: cf, disabled: !Rt, title: g("Add one plot per file and plot of the Illustration tab's current selection"), children: g("Add Illustration selection") }),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: as, disabled: !Rt, title: g("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: g("+ Illustration figure") }),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: is, disabled: !Rt || !y, title: g("Add the Plotting tab's current chart as one block, drawn here as it is there"), children: g("+ Plotting chart") })
              ] }),
              /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": g("Arrange"), children: [
                sm.map(({ how: p, label: b, title: I }) => /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => pf(p), disabled: !j.length || pt, title: g(I), children: g(b) }, p)),
                lm.map(({ how: p, label: b, title: I }) => /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => hf(p), disabled: rn < 3 || pt, title: g(I), children: g(b) }, p)),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": B, onClick: () => Y((p) => !p), title: g("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: g("Snap grid") })
              ] }),
              /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": pt, onClick: () => bt(!pt), title: g("Show the page as it exports, without grid, margins or handles"), children: g(pt ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !qe.current.length, onClick: qn, title: g("Undo the last layout edit (Cmd-Z)"), children: g("Undo") }),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Qe.current.length, onClick: Vn, title: g("Redo the undone edit (Shift-Cmd-Z)"), children: g("Redo") }),
                /* @__PURE__ */ S.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: g("Copy this sheet, with its page and items, as a new sheet"),
                    onClick: () => {
                      const p = {
                        ...U,
                        id: crypto.randomUUID(),
                        page: { ...U.page },
                        ...U.iteration ? { iteration: structuredClone(U.iteration) } : {},
                        name: `${U.name} copy`,
                        // Headings that read from a plot read the copy's plot, not the original sheet's.
                        items: Os(U.items).copies
                      };
                      Ir((b) => {
                        b.sheets.push(p), b.activeSheetId = p.id;
                      }), R([]);
                    },
                    children: g("Duplicate sheet")
                  }
                ),
                /* @__PURE__ */ S.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    disabled: t.sheets.length <= 1,
                    title: g("Remove this sheet; the layout keeps at least one"),
                    onClick: () => {
                      Ir((p) => {
                        const b = p.sheets.findIndex(
                          ({ id: I }) => I === p.activeSheetId
                        );
                        p.sheets.splice(b, 1), p.activeSheetId = p.sheets[Math.max(0, b - 1)].id;
                      }), R([]);
                    },
                    children: g("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": g("Zoom"), children: [
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: hs, title: g("Fit the page to the window"), children: g("Fit") }),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => vs(-1), "aria-label": g("Zoom out"), title: g("Zoom out"), disabled: ht <= ln[0], children: "−" }),
                /* @__PURE__ */ S.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(ht * 100),
                  "%"
                ] }),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => vs(1), "aria-label": g("Zoom in"), title: g("Zoom in"), disabled: ht >= ln[ln.length - 1], children: "+" })
              ] }),
              (se.length > 1 || ot.mode !== "off") && /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": g("Pages of the iteration"), children: [
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Tr(Math.max(0, Fe - 1)), disabled: Fe === 0, "aria-label": g("Previous page"), title: g("Previous page"), children: "◀" }),
                /* @__PURE__ */ S.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  g("Page {n} of {count}", { n: Fe + 1, count: Math.max(1, se.length) }),
                  Ht.units.length > 0 && ` · ${Ht.units.map((p) => p.name).join(", ")}`
                ] }),
                /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Tr(Math.min(se.length - 1, Fe + 1)), disabled: Fe >= se.length - 1, "aria-label": g("Next page"), title: g("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ S.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void gs(), disabled: Ae || !U.items.length, title: se.length > 1 ? g("Write every page of the iteration; the format is chosen under Page") : g("Write this sheet at its page size; the format is chosen under Page"), children: Ae ? g("Exporting…") : g("Export {format}", { format: At.toUpperCase() }) }) }),
              /* @__PURE__ */ S.jsx("span", { className: "gl-layout-performance-note", children: g("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        yt && /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ S.jsx("span", { children: yt }),
          /* @__PURE__ */ S.jsx("button", { type: "button", title: g("Dismiss"), "aria-label": g("Dismiss"), onClick: () => ft(null), children: "×" })
        ] }),
        /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ S.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ S.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style"].map((p) => /* @__PURE__ */ S.jsx(
              "button",
              {
                "aria-pressed": wt === p,
                title: g(p === "item" ? "The selected item, or the file new plots take" : p === "page" ? "Page size, margins, pages and export" : p === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => xt(p),
                children: g(p === "item" ? "Items" : p === "page" ? "Page" : p === "iterate" ? "Iterate" : "Style")
              },
              p
            )) }),
            wt === "item" && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
              /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                g("File for new plots"),
                /* @__PURE__ */ S.jsx(
                  "select",
                  {
                    value: K,
                    onChange: (p) => ct(p.target.value),
                    children: r.map((p) => /* @__PURE__ */ S.jsx("option", { value: p.id, children: p.name }, p.id))
                  }
                )
              ] }),
              /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g("Placed plots keep their own file and hierarchy, independently of the Gating selection.") }),
              Ie.error && /* @__PURE__ */ S.jsx("p", { role: "alert", children: Ie.error }),
              he.length > 1 && /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-inspector", "aria-label": g("Selected layout items"), children: [
                /* @__PURE__ */ S.jsx("strong", { children: af ? g("{count} items selected, one group", { count: he.length }) : g("{count} items selected", { count: he.length }) }),
                /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-item-actions", children: [
                  rn > 1 && /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Ln, title: g("One group: selected, moved, aligned and distributed together (Cmd-G)"), children: g("Group") }),
                  he.some((p) => p.group) && /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: ni, title: g("Dissolve the group; the items stay where they are (Shift-Cmd-G)"), children: g("Ungroup") }),
                  /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => on(ie), title: g("Copies of every selected item, 20 px down and right (Cmd-D)"), children: g("Duplicate") }),
                  /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ue(ie, "front"), title: g("Draw the selected items over every other"), children: g("Bring to front") }),
                  /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ue(ie, "back"), title: g("Draw the selected items under every other"), children: g("Send to back") }),
                  /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Wn(ie, !Za), title: g("Lock or unlock the selected items"), children: g(Za ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => an(ie), title: g("Remove the selected items (Delete)"), children: g("Remove") })
                ] }),
                /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g("Align and distribute them with the toolbar; drag any of them to move them together; Cmd-G makes them one group.") })
              ] }),
              !he.length && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                /* @__PURE__ */ S.jsx(Bf, { intro: _, className: "gl-hint", children: g("Click an item to select it, drag empty page to select several, Shift-click to add or remove. Drag to move, Shift holds the direction; drag a corner handle or an edge to resize, Shift keeps the proportions, Option resizes from the centre; Cmd turns snapping off; Option-drag copies. Delete removes, arrows nudge (Shift: 10 px), Cmd-D duplicates, Cmd-A selects all, Cmd-] and Cmd-[ bring forward and send backward (Shift: to the front or back), Cmd-G groups and Shift-Cmd-G ungroups, Shift-Cmd-L locks, Cmd-Z undoes.") }),
                /* @__PURE__ */ S.jsx(Gf, { intro: _ })
              ] }),
              V && /* @__PURE__ */ S.jsxs(
                "div",
                {
                  className: "gl-layout-inspector",
                  "aria-label": g("Selected layout item"),
                  children: [
                    /* @__PURE__ */ S.jsx("strong", { children: g("Selected") }),
                    /* @__PURE__ */ S.jsxs("label", { className: "gl-check", children: [
                      /* @__PURE__ */ S.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: V.showFrame === !0,
                          onChange: (p) => Ot((b) => {
                            const I = b.items.find(
                              (A) => A.id === V.id
                            );
                            I && (I.showFrame = p.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => on([V.id]), title: g("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: g("Duplicate") }),
                      /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ue([V.id], "front"), title: g("Draw this item over every other"), children: g("Bring to front") }),
                      /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ue([V.id], "back"), title: g("Draw this item under every other"), children: g("Send to back") }),
                      /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => an([V.id]), title: g("Remove this item from the page (Delete)"), children: g("Remove") })
                    ] }),
                    /* @__PURE__ */ S.jsxs("label", { className: "gl-check", title: g("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ S.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: V.locked === !0,
                          onChange: (p) => Wn([V.id], p.target.checked)
                        }
                      ),
                      g("Locked")
                    ] }),
                    /* @__PURE__ */ S.jsx("div", { className: "gl-layout-dimensions", children: ["x", "y", "width", "height"].map((p) => /* @__PURE__ */ S.jsxs("label", { children: [
                      am[p],
                      /* @__PURE__ */ S.jsx(
                        ve,
                        {
                          "aria-label": `Item ${p}`,
                          min: p === "width" || p === "height" ? Ff(V.recipe.kind)[p] : 0,
                          integer: !0,
                          value: V[p],
                          onCommit: (b) => Ot((I) => {
                            const A = I.items.find(
                              (G) => G.id === V.id
                            );
                            A && (A[p] = b);
                          })
                        }
                      )
                    ] }, p)) }),
                    V.recipe.kind === "text" ? /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Text"),
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            value: V.recipe.text,
                            onChange: (p) => Dt(
                              (b) => b.kind === "text" ? { ...b, text: p.target.value } : b
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Reads from"),
                        /* @__PURE__ */ S.jsxs(
                          "select",
                          {
                            "aria-label": g("Reads from"),
                            value: V.recipe.readsFrom ?? "",
                            onChange: (p) => Dt((b) => {
                              if (b.kind !== "text") return b;
                              const I = { ...b };
                              return p.target.value ? I.readsFrom = p.target.value : delete I.readsFrom, I;
                            }),
                            children: [
                              /* @__PURE__ */ S.jsx("option", { value: "", children: g("Nothing: plain text") }),
                              U.items.filter((p) => oe(p.recipe)).map((p) => /* @__PURE__ */ S.jsx("option", { value: p.id, children: Ke(p, It) }, p.id))
                            ]
                          }
                        )
                      ] }),
                      V.recipe.readsFrom && /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: Ei }) }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Font"),
                        /* @__PURE__ */ S.jsx(
                          ve,
                          {
                            min: 8,
                            max: 72,
                            integer: !0,
                            value: V.recipe.fontSize,
                            onCommit: (p) => Dt(
                              (b) => b.kind === "text" ? { ...b, fontSize: p } : b
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: V.recipe.bold === !0,
                            onChange: (p) => Dt((b) => {
                              if (b.kind !== "text") return b;
                              const I = { ...b };
                              return p.target.checked ? I.bold = !0 : delete I.bold, I;
                            })
                          }
                        ),
                        g("Bold")
                      ] })
                    ] }) : V.recipe.kind === "figure" ? /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                      /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Figure page"),
                        /* @__PURE__ */ S.jsx(
                          ve,
                          {
                            "aria-label": g("Figure page"),
                            value: V.recipe.page + 1,
                            min: 1,
                            integer: !0,
                            onCommit: (p) => Dt((b) => b.kind === "figure" ? { ...b, page: Math.max(0, p - 1) } : b)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        g("Title"),
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            placeholder: Ke(V, It),
                            value: V.recipe.title ?? "",
                            onChange: (p) => Dt((b) => b.kind === "figure" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      x && /* @__PURE__ */ S.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: g("Load this figure into the Illustration tab"),
                          onClick: () => x(structuredClone(V.recipe.illustration)),
                          children: g("Edit in Illustration")
                        }
                      ),
                      /* @__PURE__ */ S.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !(m != null && m.figure),
                          title: g("Take the Illustration tab's current figure in place of this one"),
                          onClick: () => Dt(
                            (p) => p.kind === "figure" && m ? { ...p, illustration: structuredClone(m) } : p
                          ),
                          children: g("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : V.recipe.kind === "cellpanel" ? /* @__PURE__ */ S.jsx(
                      Eg,
                      {
                        recipe: V.recipe,
                        onChange: (p) => Dt((b) => b.kind === "cellpanel" ? p : b)
                      }
                    ) : V.recipe.kind === "imagewall" ? /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                      /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g("The cells as the Images tab showed them when the wall was added; their images are drawn from the file's waveform file.") }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        g("Title"),
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            placeholder: V.recipe.populationName,
                            value: V.recipe.title ?? "",
                            onChange: (p) => Dt((b) => b.kind === "imagewall" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Tile size"),
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            type: "number",
                            min: 16,
                            max: 200,
                            value: V.recipe.tile,
                            onChange: (p) => Dt((b) => b.kind === "imagewall" ? { ...b, tile: Math.max(16, Math.min(200, Math.round(Number(p.target.value) || 56))) } : b)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Columns"),
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            type: "number",
                            min: 1,
                            max: 24,
                            value: V.recipe.columns,
                            onChange: (p) => Dt((b) => b.kind === "imagewall" ? { ...b, columns: Math.max(1, Math.min(24, Math.round(Number(p.target.value) || 8))) } : b)
                          }
                        )
                      ] })
                    ] }) : V.recipe.kind === "proportions" ? /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                      /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        g("Title"),
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            placeholder: Ke(V, It),
                            value: V.recipe.title ?? "",
                            onChange: (p) => Dt((b) => b.kind === "proportions" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] }),
                      D && /* @__PURE__ */ S.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: g("Load this chart's settings into the Plotting tab"),
                          onClick: () => D(structuredClone(V.recipe.settings)),
                          children: g("Edit in Plotting")
                        }
                      ),
                      /* @__PURE__ */ S.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !y,
                          title: g("Take the Plotting tab's current chart in place of this one"),
                          onClick: () => {
                            const p = y == null ? void 0 : y();
                            p && Dt((b) => b.kind === "proportions" ? { ...b, settings: p } : b);
                          },
                          children: g("Replace with the current Plotting chart")
                        }
                      )
                    ] }) : V.recipe.kind === "chart" ? /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Population"),
                        /* @__PURE__ */ S.jsx(
                          "select",
                          {
                            value: V.recipe.populationId,
                            onChange: (p) => Dt((b) => b.kind === "chart" ? { ...b, populationId: p.target.value } : b),
                            children: xs.map(({ popId: p, depth: b }) => {
                              var I;
                              return /* @__PURE__ */ S.jsxs("option", { value: p, children: [
                                " ".repeat(b * 2),
                                ((I = Ft == null ? void 0 : Ft.tree.populations[p]) == null ? void 0 : I.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Statistic"),
                        /* @__PURE__ */ S.jsxs(
                          "select",
                          {
                            value: V.recipe.statistic,
                            onChange: (p) => Dt((b) => {
                              var G;
                              if (b.kind !== "chart") return b;
                              const I = p.target.value, A = I === "median" && !b.channel ? (G = Ft == null ? void 0 : Ft.sample.channels[0]) == null ? void 0 : G.key : b.channel;
                              return { ...b, statistic: I, ...A ? { channel: A } : {} };
                            }),
                            children: [
                              /* @__PURE__ */ S.jsx("option", { value: "percent_of_parent", children: g("% of parent") }),
                              /* @__PURE__ */ S.jsx("option", { value: "percent_of_total", children: g("% of total") }),
                              /* @__PURE__ */ S.jsx("option", { value: "count", children: g("Events") }),
                              /* @__PURE__ */ S.jsx("option", { value: "median", children: g("Median of a channel") })
                            ]
                          }
                        )
                      ] }),
                      V.recipe.statistic === "median" && /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Channel"),
                        /* @__PURE__ */ S.jsx(
                          "select",
                          {
                            value: V.recipe.channel ?? "",
                            onChange: (p) => Dt((b) => b.kind === "chart" ? { ...b, channel: p.target.value } : b),
                            children: ((Ft == null ? void 0 : Ft.sample.channels) ?? []).map((p) => /* @__PURE__ */ S.jsx("option", { value: p.key, children: (Ft == null ? void 0 : Ft.sample.labelForKey(p.key)) ?? p.key }, p.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Files"),
                        /* @__PURE__ */ S.jsxs(
                          "select",
                          {
                            value: V.recipe.files,
                            onChange: (p) => Dt((b) => b.kind === "chart" ? { ...b, files: p.target.value === "all" ? "all" : "checked" } : b),
                            children: [
                              /* @__PURE__ */ S.jsx("option", { value: "checked", children: g("Checked files") }),
                              /* @__PURE__ */ S.jsx("option", { value: "all", children: g("All files") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Group by"),
                        /* @__PURE__ */ S.jsxs(
                          "select",
                          {
                            value: V.recipe.groupBy,
                            onChange: (p) => Dt((b) => b.kind === "chart" ? { ...b, groupBy: p.target.value } : b),
                            children: [
                              /* @__PURE__ */ S.jsx("option", { value: "", children: g("Each file") }),
                              o.map((p) => /* @__PURE__ */ S.jsx("option", { value: p, children: p }, p))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Chart"),
                        /* @__PURE__ */ S.jsxs(
                          "select",
                          {
                            value: V.recipe.chartType,
                            onChange: (p) => Dt((b) => b.kind === "chart" ? { ...b, chartType: p.target.value } : b),
                            children: [
                              /* @__PURE__ */ S.jsx("option", { value: "bars", children: g("Bars (mean ± SD)") }),
                              /* @__PURE__ */ S.jsx("option", { value: "dots", children: g("Points with the mean") }),
                              /* @__PURE__ */ S.jsx("option", { value: "box", children: g("Boxes (median, quartiles)") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: V.recipe.showPoints,
                            onChange: (p) => Dt((b) => b.kind === "chart" ? { ...b, showPoints: p.target.checked } : b)
                          }
                        ),
                        g("Show each file as a point")
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-check", title: g("Wilcoxon rank-sum between two groups, Kruskal–Wallis among more; every group needs two files"), children: [
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: V.recipe.test,
                            onChange: (p) => Dt((b) => b.kind === "chart" ? { ...b, test: p.target.checked } : b)
                          }
                        ),
                        g("Test between groups")
                      ] }),
                      we && (we.missing.length > 0 || we.noChannel.length > 0) && /* @__PURE__ */ S.jsxs("p", { className: "gl-hint gl-layout-warning", children: [
                        we.missing.length > 0 && g("No point for {files}: the population is not on these files.", { files: we.missing.join(", ") }),
                        we.missing.length > 0 && we.noChannel.length > 0 && " ",
                        we.noChannel.length > 0 && g("No point for {files}: the channel is not on these files.", { files: we.noChannel.join(", ") })
                      ] }),
                      (we == null ? void 0 : we.unassigned) && /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g(V.recipe.test ? "Files without a value in the column are drawn as Unassigned and left out of the test." : "Files without a value in the column are drawn as Unassigned.") }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        g("Title"),
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            placeholder: Ke(V, It),
                            value: V.recipe.title ?? "",
                            onChange: (p) => Dt((b) => b.kind === "chart" ? { ...b, title: p.target.value } : b)
                          }
                        )
                      ] })
                    ] }) : /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                      !Sn(V.recipe) && /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("FCS"),
                        /* @__PURE__ */ S.jsx(
                          "select",
                          {
                            value: V.recipe.sampleId,
                            onChange: (p) => Dt((b) => {
                              if (b.kind === "text" || b.kind === "figure" || b.kind === "proportions" || b.kind === "imagewall" || b.kind === "cellpanel") return b;
                              const I = It.find(
                                (G) => G.id === p.target.value
                              );
                              if (!I) return b;
                              const A = Ft && un(
                                {
                                  hierarchyId: Ft.tree.id,
                                  populationId: b.populationId
                                },
                                I.tree,
                                Nr(f)
                              );
                              return {
                                ...b,
                                sampleId: I.id,
                                populationId: (A == null ? void 0 : A.id) ?? I.tree.root_population_id ?? ""
                              };
                            }),
                            children: It.map((p) => /* @__PURE__ */ S.jsx("option", { value: p.id, children: p.name }, p.id))
                          }
                        )
                      ] }),
                      (V.recipe.kind === "biplot" || V.recipe.kind === "histogram") && /* @__PURE__ */ S.jsxs("label", { className: "gl-check", title: g("Draw the events of several files on this plot, as the Gating tab pools the checked files; a gate is drawn where every pooled file has it alike, with the pooled percentage"), children: [
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: !!V.recipe.pool,
                            onChange: (p) => {
                              if (!p.target.checked) {
                                ri(null);
                                return;
                              }
                              const b = V.recipe.kind === "biplot" || V.recipe.kind === "histogram" ? V.recipe.sampleId : "";
                              ri(n.includes(b) ? n : [b]);
                            }
                          }
                        ),
                        g("Pool files")
                      ] }),
                      (V.recipe.kind === "biplot" || V.recipe.kind === "histogram") && V.recipe.pool && /* @__PURE__ */ S.jsx(
                        dm,
                        {
                          files: r,
                          pool: V.recipe.pool.sampleIds,
                          checkedSampleIds: n,
                          groups: a,
                          fileGroups: i,
                          report: ff,
                          onChange: ri
                        }
                      ),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Population"),
                        /* @__PURE__ */ S.jsx(
                          "select",
                          {
                            value: V.recipe.populationId,
                            onChange: (p) => Dt(
                              (b) => b.kind === "text" ? b : {
                                ...b,
                                populationId: p.target.value
                              }
                            ),
                            children: xs.map(({ popId: p, depth: b }) => {
                              var I;
                              return /* @__PURE__ */ S.jsxs("option", { value: p, children: [
                                " ".repeat(b * 2),
                                ((I = Ft == null ? void 0 : Ft.tree.populations[p]) == null ? void 0 : I.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      V.recipe.kind !== "strategy" && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                        /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ S.jsx(
                            Ns,
                            {
                              label: g("X channel"),
                              value: V.recipe.xChannel,
                              options: ms,
                              onChange: (p) => Dt(
                                (b) => b.kind === "biplot" || b.kind === "histogram" ? { ...b, xChannel: p } : b
                              )
                            }
                          )
                        ] }),
                        V.recipe.kind === "biplot" && /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ S.jsx(
                            Ns,
                            {
                              label: g("Y channel"),
                              value: V.recipe.yChannel ?? "",
                              options: ms,
                              onChange: (p) => Dt(
                                (b) => b.kind === "biplot" ? { ...b, yChannel: p } : b
                              )
                            }
                          )
                        ] })
                      ] }),
                      V.recipe.kind === "strategy" && ((Ss = V.recipe.populationIds) == null ? void 0 : Ss.length) && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                        /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g("{count} populations; the grid follows the live gates", { count: V.recipe.populationIds.length }) }),
                        /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", title: g("Tree: a column per depth and a row per leaf. Wrapped: the tree walked depth first and wrapped into rows of the columns beside."), children: [
                          g("Layout"),
                          /* @__PURE__ */ S.jsxs(
                            "select",
                            {
                              value: V.recipe.layout ?? "tree",
                              onChange: (p) => Dt((b) => b.kind === "strategy" ? { ...b, layout: p.target.value === "flow" ? "flow" : "tree" } : b),
                              children: [
                                /* @__PURE__ */ S.jsx("option", { value: "tree", children: g("Tree") }),
                                /* @__PURE__ */ S.jsx("option", { value: "flow", children: g("Wrapped") })
                              ]
                            }
                          )
                        ] }),
                        (V.recipe.layout ?? "tree") === "flow" && /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                          g("Columns"),
                          /* @__PURE__ */ S.jsx(ve, { min: 1, max: 24, integer: !0, value: V.recipe.columns ?? 4, onCommit: (p) => Dt((b) => b.kind === "strategy" ? { ...b, columns: p } : b) })
                        ] }),
                        /* @__PURE__ */ S.jsxs("label", { className: "gl-check", title: g("An arrow from each gate to the panel of the population it makes, through the gutters"), children: [
                          /* @__PURE__ */ S.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: V.recipe.showArrows !== !1,
                              onChange: (p) => Dt((b) => b.kind === "strategy" ? { ...b, showArrows: p.target.checked } : b)
                            }
                          ),
                          g("Arrows")
                        ] }),
                        V.recipe.showArrows !== !1 && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                          /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", title: g("The arrows' colour; unticked, each takes its gate's"), children: [
                            /* @__PURE__ */ S.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: !!V.recipe.arrowColor,
                                onChange: (p) => Dt((b) => b.kind === "strategy" ? { ...b, arrowColor: p.target.checked ? "#444444" : void 0 } : b)
                              }
                            ),
                            g("One colour"),
                            V.recipe.arrowColor && /* @__PURE__ */ S.jsx(
                              "input",
                              {
                                type: "color",
                                value: V.recipe.arrowColor,
                                onChange: (p) => Dt((b) => b.kind === "strategy" ? { ...b, arrowColor: p.target.value } : b)
                              }
                            )
                          ] }),
                          /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", title: g("Where an arrow leaves its panel: level with the gate's label, or with the centre of the gate itself"), children: [
                            g("Arrows from"),
                            /* @__PURE__ */ S.jsxs(
                              "select",
                              {
                                value: V.recipe.arrowAnchor ?? "label",
                                onChange: (p) => Dt((b) => b.kind === "strategy" ? { ...b, arrowAnchor: p.target.value === "gate" ? "gate" : void 0 } : b),
                                children: [
                                  /* @__PURE__ */ S.jsx("option", { value: "label", children: g("Gate label") }),
                                  /* @__PURE__ */ S.jsx("option", { value: "gate", children: g("Gate centre") })
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                            g("Arrow width"),
                            /* @__PURE__ */ S.jsx(ve, { min: 0.5, max: 6, step: 0.25, value: V.recipe.arrowWidth ?? 1.5, onCommit: (p) => Dt((b) => b.kind === "strategy" ? { ...b, arrowWidth: p } : b) })
                          ] })
                        ] })
                      ] }),
                      V.recipe.kind === "strategy" && !((Cs = V.recipe.populationIds) != null && Cs.length) && /* @__PURE__ */ S.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: V.recipe.fullPath,
                            onChange: (p) => Dt(
                              (b) => b.kind === "strategy" ? {
                                ...b,
                                fullPath: p.target.checked
                              } : b
                            )
                          }
                        ),
                        g("Full path from root")
                      ] }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                        g("Display"),
                        /* @__PURE__ */ S.jsxs(
                          "select",
                          {
                            value: V.recipe.displayMode,
                            onChange: (p) => Dt(
                              (b) => b.kind === "text" ? b : {
                                ...b,
                                displayMode: p.target.value
                              }
                            ),
                            children: [
                              /* @__PURE__ */ S.jsx("option", { value: "pseudocolor", children: g("Pseudocolor") }),
                              /* @__PURE__ */ S.jsx("option", { value: "scatter", children: g("Scatter") }),
                              /* @__PURE__ */ S.jsx("option", { value: "contour", children: g("Contour") })
                            ]
                          }
                        )
                      ] }),
                      ot.mode !== "off" && /* @__PURE__ */ S.jsxs("label", { className: "gl-check", title: ot.mode === "populations" ? g("Drawn once per population of the iteration, for that population; unticked, it shows its own population on every page") : ot.mode === "metadata" ? g("Drawn once per value of {column}, pooling that value's files; unticked, it shows its own files on every page", { column: ot.column ?? "" }) : g("Drawn once per file of the iteration, for that file; unticked, it shows this file on every page"), children: [
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: V.recipe.iterated === !0,
                            onChange: (p) => Dt(
                              (b) => b.kind === "text" ? b : { ...b, iterated: p.target.checked }
                            )
                          }
                        ),
                        g("Follows the iteration")
                      ] }),
                      ss && /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: ss }),
                      /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: g("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: Ei }), children: [
                        g("Title"),
                        /* @__PURE__ */ S.jsx(
                          "input",
                          {
                            placeholder: of || Ke(V, It),
                            value: V.recipe.title ?? "",
                            onChange: (p) => Dt(
                              (b) => b.kind === "text" ? b : { ...b, title: p.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ S.jsxs("summary", { children: [
                          g("Style"),
                          Object.keys(V.recipe.style ?? {}).length > 0 ? ` · ${g("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ S.jsx(
                          ql,
                          {
                            effective: li(U, V.recipe),
                            own: V.recipe.style ?? {},
                            onChange: (p) => Dt(
                              (b) => oe(b) ? { ...b, style: Ws({ ...b.style, ...p }) } : b
                            )
                          }
                        ),
                        Object.keys(V.recipe.style ?? {}).length > 0 && /* @__PURE__ */ S.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: g("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => Dt((p) => {
                              if (!oe(p)) return p;
                              const { style: b, ...I } = p;
                              return I;
                            }),
                            children: g("Follow the sheet")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ S.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => k(
                            V.recipe
                          ),
                          children: g("Open in Gating")
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            wt === "page" && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
              /* @__PURE__ */ S.jsx("h3", { children: g("Page") }),
              /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                g("Size"),
                /* @__PURE__ */ S.jsxs(
                  "select",
                  {
                    value: U.page.preset,
                    onChange: (p) => fr(Wf(p.target.value, U.page.orientation, U.page)),
                    children: [
                      Object.entries(Lf).map(([p, b]) => /* @__PURE__ */ S.jsx("option", { value: p, children: b.label }, p)),
                      /* @__PURE__ */ S.jsx("option", { value: "custom", children: g("Custom") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                g("Orientation"),
                /* @__PURE__ */ S.jsxs(
                  "select",
                  {
                    value: U.page.orientation,
                    onChange: (p) => fr({ ...U.page, orientation: p.target.value }),
                    children: [
                      /* @__PURE__ */ S.jsx("option", { value: "portrait", children: g("Portrait") }),
                      /* @__PURE__ */ S.jsx("option", { value: "landscape", children: g("Landscape") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ S.jsx("div", { className: "gl-layout-dimensions", children: ["width", "height"].map((p) => /* @__PURE__ */ S.jsxs("label", { children: [
                g(p === "width" ? "Width (mm)" : "Height (mm)"),
                /* @__PURE__ */ S.jsx(
                  ve,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": g(p === "width" ? "Width (mm)" : "Height (mm)"),
                    value: Kl(U.page)[p === "width" ? "widthMm" : "heightMm"],
                    onCommit: (b) => {
                      const I = U.page.orientation === "landscape", A = p === "width" == !I ? "widthMm" : "heightMm";
                      fr({ ...U.page, preset: "custom", [A]: b });
                    }
                  }
                )
              ] }, p)) }),
              /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                g("Margin (mm)"),
                /* @__PURE__ */ S.jsx(
                  ve,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: U.page.marginMm,
                    onCommit: (p) => fr({ ...U.page, marginMm: p })
                  }
                )
              ] }),
              /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ S.jsxs("label", { children: [
                  g("Pages across"),
                  /* @__PURE__ */ S.jsx(ve, { min: 1, max: js, step: 1, integer: !0, "aria-label": g("Pages across"), value: U.page.columns, onCommit: (p) => fr({ ...U.page, columns: p }) })
                ] }),
                /* @__PURE__ */ S.jsxs("label", { children: [
                  g("Pages down"),
                  /* @__PURE__ */ S.jsx(ve, { min: 1, max: js, step: 1, integer: !0, "aria-label": g("Pages down"), value: U.page.rows, onCommit: (p) => fr({ ...U.page, rows: p }) })
                ] })
              ] }),
              /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: yf, disabled: !U.items.length, title: g("Make the page a custom size that holds every item inside the margin, as one page"), children: g("Fit page to content") }),
                /* @__PURE__ */ S.jsx("button", { type: "button", className: "gl-mini-btn", onClick: bf, disabled: !U.items.length, title: g("Scale and centre every item, as one group, to fill the first page inside its margin"), children: g("Fit content to page") })
              ] }),
              /* @__PURE__ */ S.jsx("h3", { children: g("Export") }),
              /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                g("Format"),
                /* @__PURE__ */ S.jsxs("select", { value: At, onChange: (p) => re(p.target.value), children: [
                  /* @__PURE__ */ S.jsx("option", { value: "pdf", children: g("PDF · the page at its size") }),
                  /* @__PURE__ */ S.jsx("option", { value: "svg", children: g("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ S.jsx("option", { value: "png", children: g("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                g("Resolution (dpi)"),
                /* @__PURE__ */ S.jsx(
                  ve,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: U.page.dpi,
                    onCommit: (p) => fr({ ...U.page, dpi: p })
                  }
                )
              ] }),
              /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                /* @__PURE__ */ S.jsx("input", { type: "checkbox", checked: ue, onChange: (p) => jn(p.target.checked) }),
                g("Crop to content")
              ] }),
              ue && /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                g("Padding (mm)"),
                /* @__PURE__ */ S.jsx(ve, { min: 0, max: 50, step: 0.5, "aria-label": g("Padding (mm)"), value: tn, onCommit: Va })
              ] }),
              /* @__PURE__ */ S.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void gs(), disabled: Ae || !U.items.length, children: g(Ae ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g(ue ? "The export is cut down to the items on each page plus the padding, so a figure comes out without the paper around it; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above." : "The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            wt === "iterate" && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
              /* @__PURE__ */ S.jsx("h3", { children: g("Iterate") }),
              /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                g("Draw the sheet"),
                /* @__PURE__ */ S.jsxs(
                  "select",
                  {
                    value: ot.mode,
                    onChange: (p) => {
                      const b = p.target.value;
                      if (b === "metadata") {
                        const I = ot.column && o.includes(ot.column) ? ot.column : o[0] ?? "";
                        Le({ ...ot, mode: "metadata", column: I, source: ot.source.kind === "metadata" ? { kind: "checked" } : ot.source });
                        return;
                      }
                      Le({ ...ot, mode: b === "files" ? "files" : b === "populations" ? "populations" : "off" });
                    },
                    children: [
                      /* @__PURE__ */ S.jsx("option", { value: "off", children: g("Once") }),
                      /* @__PURE__ */ S.jsx("option", { value: "files", children: g("Once per file") }),
                      /* @__PURE__ */ S.jsx("option", { value: "populations", children: g("Once per population") }),
                      /* @__PURE__ */ S.jsx("option", { value: "metadata", disabled: !o.length, children: g("Once per value of a metadata column") })
                    ]
                  }
                )
              ] }),
              ot.mode === "metadata" && /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                g("Column"),
                /* @__PURE__ */ S.jsx("select", { value: ot.column ?? "", onChange: (p) => Le({ ...ot, column: p.target.value }), children: o.map((p) => /* @__PURE__ */ S.jsx("option", { value: p, children: p }, p)) })
              ] }),
              ot.mode !== "off" && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                ot.mode === "populations" && /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                  g("Populations"),
                  /* @__PURE__ */ S.jsxs(
                    "select",
                    {
                      value: ((ws = ot.populations) == null ? void 0 : ws.kind) === "branch" ? ot.populations.populationId : "all",
                      onChange: (p) => Le({
                        ...ot,
                        populations: p.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: p.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ S.jsx("option", { value: "all", children: g("All in the tree") }),
                        (ne ? ga(ne.tree.populations, ne.tree.root_population_id ?? "") : []).filter(({ popId: p }) => p !== (ne == null ? void 0 : ne.tree.root_population_id)).map(({ popId: p, depth: b }) => {
                          var I;
                          return /* @__PURE__ */ S.jsxs("option", { value: p, children: [
                            " ".repeat(b * 2),
                            g("Under {name}", { name: ((I = ne == null ? void 0 : ne.tree.populations[p]) == null ? void 0 : I.name) ?? p })
                          ] }, p);
                        })
                      ]
                    }
                  )
                ] }),
                (ot.mode === "files" || ot.mode === "metadata") && /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                  g("Files"),
                  /* @__PURE__ */ S.jsxs("select", { value: wf, onChange: (p) => Le({ ...ot, source: Ef(p.target.value) }), children: [
                    /* @__PURE__ */ S.jsx("option", { value: "checked", children: g("Checked files") }),
                    /* @__PURE__ */ S.jsx("option", { value: "all", children: g("All files") }),
                    a.map((p) => /* @__PURE__ */ S.jsx("option", { value: `group:${p.id}`, children: g("Group {name}", { name: p.name }) }, p.id)),
                    ot.mode === "files" && o.flatMap(
                      (p) => Cf(p).map((b) => /* @__PURE__ */ S.jsxs("option", { value: `meta:${p}=${b}`, children: [
                        p,
                        " = ",
                        b
                      ] }, `${p}=${b}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                  g("Arrangement"),
                  /* @__PURE__ */ S.jsxs(
                    "select",
                    {
                      value: ot.arrangement.kind,
                      onChange: (p) => Le({
                        ...ot,
                        // Tiles start at as many as fit the paper, so none is cut off by default.
                        arrangement: p.target.value === "tiles" ? { kind: "tiles", ...Xl(U, 24), order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ S.jsx("option", { value: "page-per-unit", children: ot.mode === "populations" ? g("One page per population") : ot.mode === "metadata" ? g("One page per value") : g("One page per file") }),
                        /* @__PURE__ */ S.jsx("option", { value: "tiles", children: g("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                ot.arrangement.kind === "tiles" && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
                  /* @__PURE__ */ S.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((p) => /* @__PURE__ */ S.jsxs("label", { children: [
                    g(p === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ S.jsx(
                      ve,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": g(p === "columns" ? "Tiles across" : "Tiles down"),
                        value: ot.arrangement.kind === "tiles" ? ot.arrangement[p] : 1,
                        onCommit: (b) => {
                          ot.arrangement.kind === "tiles" && Le({ ...ot, arrangement: { ...ot.arrangement, [p]: b } });
                        }
                      }
                    )
                  ] }, p)) }),
                  /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                    g("Order"),
                    /* @__PURE__ */ S.jsxs(
                      "select",
                      {
                        value: ot.arrangement.order,
                        onChange: (p) => ot.arrangement.kind === "tiles" && Le({ ...ot, arrangement: { ...ot.arrangement, order: p.target.value === "column-major" ? "column-major" : "row-major" } }),
                        children: [
                          /* @__PURE__ */ S.jsx("option", { value: "row-major", children: g("Across, then down") }),
                          /* @__PURE__ */ S.jsx("option", { value: "column-major", children: g("Down, then across") })
                        ]
                      }
                    )
                  ] }),
                  (() => {
                    const p = Fg(Ht.items, U);
                    if (!p || ot.arrangement.kind !== "tiles") return null;
                    const b = Xl(U, ot.arrangement.gap);
                    return /* @__PURE__ */ S.jsxs("p", { className: "gl-hint gl-layout-warning", role: "status", children: [
                      g("{n} of {m} items on this page reach beyond the paper; the export cuts them off. {across} across × {down} down fit.", { n: p, m: Ht.items.length, across: b.columns, down: b.rows }),
                      " ",
                      /* @__PURE__ */ S.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => ot.arrangement.kind === "tiles" && Le({ ...ot, arrangement: { ...ot.arrangement, ...b } }),
                          children: g("Fit the tiles to the page")
                        }
                      )
                    ] });
                  })(),
                  /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                    g("Gap between tiles (px)"),
                    /* @__PURE__ */ S.jsx(
                      ve,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: ot.arrangement.gap,
                        onCommit: (p) => {
                          ot.arrangement.kind === "tiles" && Le({ ...ot, arrangement: { ...ot.arrangement, gap: p } });
                        }
                      }
                    )
                  ] })
                ] }),
                Ce.length === 0 && /* @__PURE__ */ S.jsx("p", { className: "gl-hint gl-layout-warning", role: "status", children: ot.mode === "populations" ? g("No populations to draw: the file has none under this choice. The sheet is shown once, with its placeholders unfilled.") : g("No files to draw: the source names none (are any files checked in the Samples pane?). The sheet is shown once, with its placeholders unfilled.") }),
                /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: ot.mode === "populations" ? g("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: Ce.length, of: (ne == null ? void 0 : ne.name) ?? "the file", pages: Math.max(1, se.length) }) : ot.mode === "metadata" ? g("{values} values of {column} over {files} files → {pages} pages. Items marked “Follows the iteration” pool the files of each value; the others repeat. Text and titles may use {sample} (the value), {meta:column}, {file} (how many files), {n} and {N}; a plot title may also use {population} and {count}.", { values: Ce.length, column: ot.column ?? "", files: Ce.reduce((p, b) => {
                  var I;
                  return p + (((I = b.sampleIds) == null ? void 0 : I.length) ?? 0);
                }, 0), pages: Math.max(1, se.length) }) : g("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: Ce.length, pages: Math.max(1, se.length) }) })
              ] })
            ] }),
            wt === "style" && U && /* @__PURE__ */ S.jsxs(S.Fragment, { children: [
              /* @__PURE__ */ S.jsx("h3", { children: g("Style") }),
              /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                g("Plot titles"),
                /* @__PURE__ */ S.jsxs(
                  "select",
                  {
                    "aria-label": g("Plot titles"),
                    value: Vo ? "custom" : ((Es = ha.find((p) => p.template === (U.titleTemplate ?? ""))) == null ? void 0 : Es.id) ?? "custom",
                    onChange: (p) => {
                      const b = ha.find((I) => I.id === p.target.value);
                      ef(!b), Ot((I) => {
                        var A;
                        b ? b.template ? I.titleTemplate = b.template : delete I.titleTemplate : I.titleTemplate = ((A = I.titleTemplate) == null ? void 0 : A.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      ha.map((p) => /* @__PURE__ */ S.jsx("option", { value: p.id, children: g(p.label) }, p.id)),
                      /* @__PURE__ */ S.jsx("option", { value: "custom", children: g("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const p = U.items.filter((b) => ts(b));
                return p.length ? /* @__PURE__ */ S.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  g("{count} plots keep a title of their own, so the template does not reach them.", { count: p.length }),
                  " ",
                  /* @__PURE__ */ S.jsx(
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
              (Vo || !ha.some((p) => p.template === (U.titleTemplate ?? ""))) && (() => {
                var mt;
                const p = U.titleTemplate ?? "", b = qc(p), I = (b == null ? void 0 : b.tokens) ?? [], A = (b == null ? void 0 : b.separator) ?? rf, G = (lt) => {
                  var Nt;
                  return ((Nt = Ko.find((xe) => xe.token === lt)) == null ? void 0 : Nt.label) ?? lt;
                }, X = (lt) => Ot((Nt) => {
                  Nt.titleTemplate = Ll(lt, A);
                }), W = Ht.items.find((lt) => oe(lt.recipe)), it = W && oe(W.recipe) ? za(p, _r(W.recipe, W.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ S.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": g("Title builder"), children: [
                  /* @__PURE__ */ S.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": g("Fields in the title"), children: [
                    I.length === 0 && /* @__PURE__ */ S.jsx("span", { className: "gl-hint", children: g(b === null && p ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    I.map((lt, Nt) => /* @__PURE__ */ S.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": g("Remove {field}", { field: G(lt) }),
                        title: g("Remove {field} from the title", { field: G(lt) }),
                        onClick: () => X(I.filter((xe, We) => We !== Nt)),
                        children: [
                          G(lt),
                          " ×"
                        ]
                      },
                      `${lt}-${Nt}`
                    ))
                  ] }),
                  /* @__PURE__ */ S.jsx("div", { className: "gl-title-builder-fields", "aria-label": g("Fields to add"), children: Ko.map((lt) => /* @__PURE__ */ S.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-chip",
                      "aria-label": g("Add {field}", { field: lt.label }),
                      title: lt.token,
                      onClick: () => X([...I, lt.token]),
                      children: lt.label
                    },
                    lt.token
                  )) }),
                  /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline", children: [
                    g("Between fields"),
                    /* @__PURE__ */ S.jsx(
                      "select",
                      {
                        "aria-label": g("Separator"),
                        value: ((mt = Di.find((lt) => lt.value === A)) == null ? void 0 : mt.id) ?? "dot",
                        onChange: (lt) => {
                          var xe;
                          const Nt = ((xe = Di.find((We) => We.id === lt.target.value)) == null ? void 0 : xe.value) ?? " · ";
                          nf(Nt), I.length && Ot((We) => {
                            We.titleTemplate = Ll(I, Nt);
                          });
                        },
                        children: Di.map((lt) => /* @__PURE__ */ S.jsx("option", { value: lt.id, children: g(lt.label) }, lt.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ S.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                    g("Template"),
                    /* @__PURE__ */ S.jsx(
                      "input",
                      {
                        "aria-label": g("Title template"),
                        value: p,
                        onChange: (lt) => Ot((Nt) => {
                          Nt.titleTemplate = lt.target.value;
                        })
                      }
                    )
                  ] }),
                  it && /* @__PURE__ */ S.jsx("div", { className: "gl-hint gl-title-builder-preview", children: g("First plot reads: {title}", { title: it }) })
                ] });
              })(),
              /* @__PURE__ */ S.jsx("p", { className: "gl-hint", children: g(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise; on an iterated sheet it looks across every page, so each page is titled alike and names what it is drawn for.`, { list: Ei }) }),
              /* @__PURE__ */ S.jsx(
                ql,
                {
                  effective: li(U),
                  own: U.style ?? {},
                  onChange: (p) => Ot((b) => {
                    b.style = Ws({ ...b.style, ...p });
                  })
                }
              ),
              Object.keys(U.style ?? {}).length > 0 && /* @__PURE__ */ S.jsx(
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
          /* @__PURE__ */ S.jsx(Yf, { menu: sf, onClose: () => ti(null) }),
          /* @__PURE__ */ S.jsxs(
            "div",
            {
              ref: (p) => {
                Mr.current = p, Z(p);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": g("Layout page"),
              onKeyDown: Df,
              children: [
                !pt && $ && /* @__PURE__ */ S.jsx(
                  wg,
                  {
                    ref: J,
                    container: $,
                    dragContainer: $,
                    selectableTargets: [".gl-layout-item"],
                    selectByClick: !0,
                    selectFromInside: !1,
                    continueSelect: !1,
                    toggleContinueSelect: ["shift"],
                    hitRate: 0,
                    ratio: 0,
                    dragCondition: (p) => {
                      var b, I, A;
                      return !((A = (I = (b = p.inputEvent) == null ? void 0 : b.target) == null ? void 0 : I.closest) != null && A.call(I, "textarea, input, select, button"));
                    },
                    onDragStart: gf,
                    onSelectEnd: mf
                  }
                ),
                /* @__PURE__ */ S.jsx(
                  "div",
                  {
                    className: "gl-layout-zoom",
                    style: { width: U.width * ht, height: U.height * ht },
                    children: /* @__PURE__ */ S.jsxs(
                      "section",
                      {
                        ref: (p) => {
                          cr.current = p, L(p);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": U.name,
                        onContextMenu: uf,
                        style: { width: U.width, height: U.height, transform: `scale(${ht})` },
                        children: [
                          ba(U.page).map((p) => {
                            const b = Ti(U.page), I = Ri(U.page.marginMm);
                            return /* @__PURE__ */ S.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: p.x, top: p.y, width: b.width, height: b.height }, children: I > 0 && /* @__PURE__ */ S.jsx("div", { className: "gl-layout-page-margin", style: { inset: I } }) }, `${p.row}-${p.column}`);
                          }),
                          Ht.items.length === 0 && /* @__PURE__ */ S.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ S.jsx("strong", { children: g("Blank layout") }),
                            /* @__PURE__ */ S.jsx("span", { children: g(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          Ht.items.map((p) => /* @__PURE__ */ S.jsx(
                            hm,
                            {
                              item: p,
                              templateText: (() => {
                                const b = U.items.find((I) => I.id === p.templateId);
                                return (b == null ? void 0 : b.recipe.kind) === "text" ? b.recipe.text : void 0;
                              })(),
                              selected: j.includes(p.id),
                              samples: It,
                              state: f,
                              globalScales: d,
                              dataRevision: M,
                              densityColorPower: E,
                              style: li(U, p.recipe),
                              titleTemplate: uo(ts(p, p.templateSampleId) || Zo, p.unitId && Ce.find((b) => b.id === p.unitId) || null, p.position.n, p.position.total),
                              describe: _r,
                              checkedSampleIds: n,
                              metadataById: Ge,
                              files: r,
                              sources: Ie.sources,
                              divisionProfiles: C,
                              imageService: w,
                              canvasScale: Bt,
                              onTextChange: (b, I) => {
                                if (!b.trim()) {
                                  an([p.templateId]);
                                  return;
                                }
                                Ot((A) => {
                                  const G = A.items.find(
                                    (X) => X.id === p.templateId
                                  );
                                  (G == null ? void 0 : G.recipe.kind) === "text" && (G.recipe.text = b, I > 0 && (G.height = Math.max(G.height, Math.ceil(I) + 4)));
                                });
                              },
                              onTextFocus: () => {
                                (!j.includes(p.id) || j.length > 1) && R([p.id]);
                              },
                              textEditing: P === p.id,
                              onTextEditStart: () => {
                                R([p.id]), z(p.id);
                              },
                              onIsolate: p.group && j.includes(p.id) && j.length > 1 ? () => R([p.id]) : void 0,
                              onTextEditEnd: () => {
                                var b;
                                z((I) => I === p.id ? null : I), (b = Mr.current) == null || b.focus({ preventScroll: !0 });
                              }
                            },
                            p.id
                          )),
                          !pt && /* @__PURE__ */ S.jsx(
                            ig,
                            {
                              ref: nt,
                              target: Ve.length === 1 ? Ve[0] : Ve,
                              zoom: 1 / ht,
                              origin: !1,
                              checkInput: !0,
                              passDragArea: !0,
                              draggable: !0,
                              resizable: !0,
                              useMutationObserver: !0,
                              useResizeObserver: !0,
                              keepRatio: St.shift,
                              throttleDragRotate: St.shift ? 45 : 0,
                              snappable: !St.meta,
                              snapThreshold: 6,
                              isDisplaySnapDigit: !1,
                              isDisplayInnerSnapDigit: !1,
                              snapDirections: $l,
                              elementSnapDirections: $l,
                              elementGuidelines: at,
                              verticalGuidelines: ps.vertical,
                              horizontalGuidelines: ps.horizontal,
                              snapGridWidth: B ? Hl : 0,
                              snapGridHeight: B ? Hl : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              individualGroupable: nn,
                              container: nn ? H : void 0,
                              onDragStart: vf,
                              onDrag: cs,
                              onDragEnd: (p) => {
                                const b = fs(p);
                                $n(b, p.lastEvent, p.isDrag, () => Yn(b, !!p.datas.alt));
                              },
                              onDragGroupStart: (p) => {
                                var b;
                                p.datas.alt = !!((b = p.inputEvent) != null && b.altKey), Hn([...p.targets ?? []], p.datas.alt ? ls(p.targets ?? []) : void 0);
                              },
                              onDragGroup: (p) => p.events.forEach(cs),
                              onDragGroupEnd: (p) => $n(p.targets, p.lastEvent, p.isDrag, () => Yn(p.targets, !!p.datas.alt)),
                              onResizeStart: (p) => {
                                var b;
                                Hn([p.target]), (b = p.inputEvent) != null && b.altKey && p.setFixedDirection([0, 0]);
                              },
                              onResize: ds,
                              onResizeEnd: (p) => $n([p.target], p.lastEvent, p.isDrag, () => Yn([p.target], !1)),
                              onResizeGroupStart: (p) => {
                                var b;
                                Hn([...p.targets ?? []]), (b = p.inputEvent) != null && b.altKey && p.events.forEach((I) => I.setFixedDirection([0, 0]));
                              },
                              onResizeGroup: (p) => p.events.forEach(ds),
                              onResizeGroupEnd: (p) => $n(p.targets, p.lastEvent, p.isDrag, () => Yn(p.targets, !1)),
                              onClick: (p) => {
                                var b, I;
                                if (Gn.current) {
                                  Gn.current = !1;
                                  return;
                                }
                                ((b = p.inputEvent) != null && b.shiftKey || nn) && ((I = J.current) == null || I.clickTarget(p.inputEvent, p.inputTarget));
                              },
                              onClickGroup: (p) => {
                                var b;
                                (b = J.current) == null || b.clickTarget(p.inputEvent, p.inputTarget);
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
  xm as LayoutTab,
  fm as isBakedTitle
};
