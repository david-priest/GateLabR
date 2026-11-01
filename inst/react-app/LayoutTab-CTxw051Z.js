import { a as Q, u as _r, j as b, I as Fs, J as Gs, K as Ls, L as ka, N as iu, s as Bf, z as Ws, O as Ys, P as gi, Q as Xs, R as Ff, U as Gi, V as cn, W as Gf, X as ou, Y as su, f as Lf, Z as Wf, _ as Yf, $ as Li, a0 as Sa, a1 as Hs, a2 as lu, a3 as Wi, a4 as uu, a5 as Lt, a6 as Ma, a7 as dn, a8 as Br, a9 as Xf, k as Hf, aa as $f, ab as _a, ac as $s, ad as qf, ae as Vf, af as Kf, ag as Uf, ah as Zf, ai as qs, aj as ar, o as Jf, T as Qf, ak as fe, al as td, am as mi, S as Vs, an as ed, ao as rd, ap as Ks, aq as ea, ar as nd, as as xi, at as ad, au as id, av as ra, aw as Us, ax as od, ay as sd, az as ld, aA as ud, aB as Ta, aC as cu, aD as Zs, aE as Js, aF as fu, aG as cd, aH as fd, aI as dd, aJ as pd, aK as hd, aL as vd, aM as Qs, aN as yi, aO as tl, aP as du, aQ as gd, aR as md, aS as el, aT as pu, aU as rl, aV as xd, aW as yd, aX as bd, aY as Sd, aZ as Cd, a_ as wd, a$ as Ed, b0 as Dd, b1 as kd, b2 as Md, l as bi, b3 as _d, b4 as Td, b5 as Id, b6 as Rd, b7 as Pd, b8 as Od, b9 as jd, ba as Nd, bb as zd } from "./embed-Ad5xBSHI.js";
function Co(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return !0;
  return !1;
}
function hu(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return t[n];
  return null;
}
function vu(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function wo(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function Ad() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function Bd(t, e) {
  var r = wo("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return r ? r[3] : "";
}
function Yi(t) {
  return t.replace(/_/g, ".");
}
function pn(t, e) {
  var r = null, n = "-1";
  return Co(t, function(a) {
    var i = wo("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (r = a, n = i[3] || "-1", a.versionAlias ? n = a.versionAlias : a.versionTest && (n = Bd(a.versionTest.toLowerCase(), e) || n), n = Yi(n), !0);
  }), {
    preset: r,
    version: n
  };
}
function na(t, e) {
  var r = {
    brand: "",
    version: "-1"
  };
  return Co(t, function(n) {
    var a = gu(e, n);
    return a ? (r.brand = n.id, r.version = n.versionAlias || a.version, r.version !== "-1") : !1;
  }), r;
}
function gu(t, e) {
  return hu(t, function(r) {
    var n = r.brand;
    return wo("" + e.test, n.toLowerCase());
  });
}
var mu = [{
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
}], xu = [{
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
}], Xi = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], yu = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], bu = [{
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
function Su(t) {
  return !!pn(yu, t).preset;
}
function Fd(t) {
  var e = vu(t), r = !!/mobi/g.exec(e), n = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: Su(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = pn(mu, e), o = i.preset, s = i.version, l = pn(bu, e), u = l.preset, c = l.version, f = pn(xu, e);
  if (n.chromium = !!f.preset, n.chromiumVersion = f.version, !n.chromium) {
    var d = pn(Xi, e);
    n.webkit = !!d.preset, n.webkitVersion = d.version;
  }
  return u && (a.name = u.id, a.version = c, a.majorVersion = parseInt(c, 10)), o && (n.name = o.id, n.version = s, n.webview && a.name === "ios" && n.name !== "safari" && (n.webview = !1)), n.majorVersion = parseInt(n.version, 10), {
    browser: n,
    os: a,
    isMobile: r,
    isHints: !1
  };
}
function Gd(t) {
  var e = navigator.userAgentData, r = (e.uaList || e.brands).slice(), n = e.mobile || !1, a = r[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!na(yu, r).brand || Su(vu())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && Co(Xi, function(d) {
    return gu(r, d);
  });
  var l = na(xu, r);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var u = na(Xi, r);
    o.webkit = !!u.brand, o.webkitVersion = u.version || "-1";
  }
  var c = hu(bu, function(d) {
    return new RegExp("" + d.test, "g").exec(i);
  });
  s.name = c ? c.id : "";
  {
    var f = na(mu, r);
    o.name = f.brand || o.name, o.version = f.brand && t ? t.uaFullVersion : f.version;
  }
  return o.webkit && (s.name = n ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = Yi(s.version), o.version = Yi(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: n,
    isHints: !0
  };
}
function Ld(t) {
  return Ad() ? Gd() : Fd(t);
}
function Wd(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  return e.map(function(n) {
    return n.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function Yd(t, e) {
  return e.replace(/([^}{]*){/gm, function(r, n) {
    return n.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function lr(t, e) {
  return function(r) {
    r && (t[e] = r);
  };
}
function Cu(t, e, r) {
  return function(n) {
    n && (t[e][r] = n);
  };
}
function Xd(t, e) {
  return function(r) {
    var n = r.prototype;
    t.forEach(function(a) {
      e(n, a);
    });
  };
}
function wu(t, e) {
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
var Hd = "function", $d = "object", qd = "string", Vd = "number", Eo = "undefined", Eu = typeof window !== Eo, Kd = typeof document !== Eo && document, Ud = [{
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
}], ne = 1e-7, aa = {
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
function Zd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function Ia(t, e, r, n) {
  return (t * n + e * r) / (r + n);
}
function Do(t) {
  return typeof t === Eo;
}
function ye(t) {
  return t && typeof t === $d;
}
function Vt(t) {
  return Array.isArray(t);
}
function _e(t) {
  return typeof t === qd;
}
function Dn(t) {
  return typeof t === Vd;
}
function Ha(t) {
  return typeof t === Hd;
}
function Jd(t, e) {
  var r = t === "" || t == " ", n = e === "" || e == " ";
  return n && r || t === e;
}
function Du(t, e, r, n, a) {
  var i = ko(t, e, r);
  return i ? r : Qd(t, e, r + 1, n, a);
}
function ko(t, e, r) {
  if (!t.ignore)
    return null;
  var n = e.slice(Math.max(r - 3, 0), r + 3).join("");
  return new RegExp(t.ignore).exec(n);
}
function Qd(t, e, r, n, a) {
  for (var i = function(u) {
    var c = e[u].trim();
    if (c === t.close && !ko(t, e, u))
      return {
        value: u
      };
    var f = u, d = be(a, function(h) {
      var g = h.open;
      return g === c;
    });
    if (d && (f = Du(d, e, u, n, a)), f === -1)
      return o = u, "break";
    u = f, o = u;
  }, o, s = r; s < n; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function Mo(t, e) {
  var r = _e(e) ? {
    separator: e
  } : e, n = r.separator, a = n === void 0 ? "," : n, i = r.isSeparateFirst, o = r.isSeparateOnlyOpenClose, s = r.isSeparateOpenClose, l = s === void 0 ? o : s, u = r.openCloseCharacters, c = u === void 0 ? Ud : u, f = c.map(function(M) {
    var _ = M.open, I = M.close;
    return _ === I ? _ : _ + "|" + I;
  }).join("|"), d = "(\\s*" + a + "\\s*|" + f + "|\\s+)", h = new RegExp(d, "g"), g = t.split(h).filter(function(M) {
    return M && M !== "undefined";
  }), m = g.length, x = [], S = [];
  function C() {
    return S.length ? (x.push(S.join("")), S = [], !0) : !1;
  }
  for (var w = function(M) {
    var _ = g[M].trim(), I = M, v = be(c, function(P) {
      var A = P.open;
      return A === _;
    }), N = be(c, function(P) {
      var A = P.close;
      return A === _;
    });
    if (v) {
      if (I = Du(v, g, M, m, c), I !== -1 && l)
        return C() && i || (x.push(g.slice(M, I + 1).join("")), M = I, i) ? (D = M, "break") : (D = M, "continue");
    } else if (N && !ko(N, g, M)) {
      var R = Zd(c);
      return R.splice(c.indexOf(N), 1), {
        value: Mo(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: R
        })
      };
    } else if (Jd(_, a) && !o)
      return C(), i ? (D = M, "break") : (D = M, "continue");
    I === -1 && (I = m - 1), S.push(g.slice(M, I + 1).join("")), M = I, D = M;
  }, D, k = 0; k < m; ++k) {
    var E = w(k);
    if (k = D, typeof E == "object") return E.value;
    if (E === "break") break;
  }
  return S.length && x.push(S.join("")), x;
}
function ur(t) {
  return Mo(t, "");
}
function Sr(t) {
  return Mo(t, ",");
}
function ku(t) {
  var e = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(t);
  return !e || e.length < 4 ? {} : {
    prefix: e[1],
    value: e[2],
    suffix: e[3]
  };
}
function wr(t) {
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
function Hi(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, r) {
    return r.toUpperCase();
  });
}
function tp(t, e) {
  return t.replace(/([a-z])([A-Z])/g, function(r, n, a) {
    return "" + n + e + a.toLowerCase();
  });
}
function kn() {
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
var Mu = /* @__PURE__ */ (function() {
  var t = kn(), e = Eu && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(r) {
    var n = kn(), a = setTimeout(function() {
      r(n - t);
    }, 1e3 / 60);
    return a;
  };
})(), ep = /* @__PURE__ */ (function() {
  var t = Eu && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function Qr(t) {
  return Object.keys(t);
}
function jt(t, e) {
  var r = wr(t), n = r.value, a = r.unit;
  if (ye(e)) {
    var i = e[a];
    if (i) {
      if (Ha(i))
        return i(n);
      if (aa[a])
        return aa[a](n, i);
    }
  } else if (a === "%")
    return n * e / 100;
  return aa[a] ? aa[a](n) : n;
}
function Ra(t, e, r) {
  return Math.max(e, Math.min(t, r));
}
function nl(t, e, r, n) {
  return n === void 0 && (n = t[0] / t[1]), [[Ct(e[0], ne), Ct(e[0] / n, ne)], [Ct(e[1] * n, ne), Ct(e[1], ne)]].filter(function(a) {
    return a.every(function(i, o) {
      var s = e[o], l = Ct(s, ne);
      return r ? i <= s || i <= l : i >= s || i >= l;
    });
  })[0] || t;
}
function _o(t, e, r, n) {
  if (!n)
    return t.map(function(h, g) {
      return Ra(h, e[g], r[g]);
    });
  var a = t[0], i = t[1], o = n === !0 ? a / i : n, s = nl(t, e, !1, o), l = s[0], u = s[1], c = nl(t, r, !0, o), f = c[0], d = c[1];
  return a < l || i < u ? (a = l, i = u) : (a > f || i > d) && (a = f, i = d), [a, i];
}
function rp(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return r;
}
function $i(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return e ? r / e : 0;
}
function Kt(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function np(t) {
  return [0, 1].map(function(e) {
    return $i(t.map(function(r) {
      return r[e];
    }));
  });
}
function al(t) {
  var e = np(t), r = Kt(e, t[0]), n = Kt(e, t[1]);
  return r < n && n - r < Math.PI || r > n && n - r < -Math.PI ? 1 : -1;
}
function Ye(t, e) {
  return Math.sqrt(Math.pow((e ? e[0] : 0) - t[0], 2) + Math.pow((e ? e[1] : 0) - t[1], 2));
}
function Ct(t, e) {
  if (!e)
    return t;
  var r = 1 / e;
  return Math.round(t / e) / r;
}
function il(t, e) {
  return t.forEach(function(r, n) {
    t[n] = Ct(t[n], e);
  }), t;
}
function ap(t) {
  for (var e = [], r = 0; r < t; ++r)
    e.push(r);
  return e;
}
function ip(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function ae(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function To(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function _u(t, e) {
  if (t.classList)
    t.classList.remove(e);
  else {
    var r = new RegExp("(\\s|^)" + e + "(\\s|$)");
    t.className = t.className.replace(r, " ");
  }
}
function re(t, e, r, n) {
  t.addEventListener(e, r, n);
}
function qt(t, e, r, n) {
  t.removeEventListener(e, r, n);
}
function Ne(t) {
  return (t == null ? void 0 : t.ownerDocument) || Kd;
}
function Io(t) {
  return Ne(t).documentElement;
}
function dr(t) {
  return Ne(t).body;
}
function ke(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function Tu(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function Mn(t) {
  return ye(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function op(t, e, r, n, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = r + o * a, l = n + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function sp(t, e, r, n, a) {
  for (var i = 0; i < a; ++i) {
    var o = r + i * a, s = n + i * a, l = t[o], u = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = u;
  }
}
function lp(t, e, r, n, a) {
  for (var i = 0; i < n; ++i) {
    var o = r + i * n;
    t[o] /= a, e[o] /= a;
  }
}
function Iu(t, e, r) {
  for (var n = t.slice(), a = 0; a < r; ++a)
    n[a * r + e - 1] = 0, n[(e - 1) * r + a] = 0;
  return n[(e - 1) * (r + 1)] = 1, n;
}
function Ae(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = t.slice(), n = Ft(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!Ct(r[i], ne)) {
      for (var o = a + 1; o < e; ++o)
        if (r[e * a + o]) {
          sp(r, n, a, o, e);
          break;
        }
    }
    if (!Ct(r[i], ne))
      return [];
    lp(r, n, a, e, r[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, u = r[l];
      !Ct(u, ne) || a === o || op(r, n, s, a, e, -u);
    }
  }
  return n;
}
function up(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = 0; n < e; ++n)
    for (var a = 0; a < e; ++a)
      r[a * e + n] = t[e * n + a];
  return r;
}
function Ru(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = t[e * e - 1], a = 0; a < e - 1; ++a)
    r[a] = t[e * (e - 1) + a] / n;
  return r[e - 1] = 0, r;
}
function cp(t, e) {
  for (var r = Ft(e), n = 0; n < e - 1; ++n)
    r[e * (e - 1) + n] = t[n] || 0;
  return r;
}
function Er(t, e) {
  for (var r = t.slice(), n = t.length; n < e - 1; ++n)
    r[n] = 0;
  return r[e - 1] = 1, r;
}
function Be(t, e, r) {
  if (e === void 0 && (e = Math.sqrt(t.length)), e === r)
    return t;
  for (var n = Ft(r), a = Math.min(e, r), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      n[i * r + o] = t[i * e + o];
    n[(i + 1) * r - 1] = t[(i + 1) * e - 1], n[(r - 1) * r + i] = t[(e - 1) * e + i];
  }
  return n[r * r - 1] = t[e * e - 1], n;
}
function Pa(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  var n = Ft(t);
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
function Rt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] + e[a];
  return n;
}
function xt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] - e[a];
  return n;
}
function fp(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function Pu(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function ce(t, e, r) {
  r === void 0 && (r = e.length);
  var n = Nt(t, e, r), a = n[r - 1];
  return n.map(function(i) {
    return i / a;
  });
}
function dp(t, e) {
  return Nt(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function pp(t, e) {
  return Nt(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function hp(t, e) {
  return Nt(t, Rn(e, 4));
}
function ia(t, e) {
  var r = e[0], n = r === void 0 ? 1 : r, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return Nt(t, [n, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function In(t, e) {
  return ce(Rn(e, 3), Er(t, 3));
}
function Si(t, e) {
  var r = e[0], n = r === void 0 ? 0 : r, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return Nt(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, n, i, s, 1], 4);
}
function qi(t, e) {
  return Nt(t, e, 4);
}
function Rn(t, e) {
  var r = Math.cos(t), n = Math.sin(t), a = Ft(e);
  return a[0] = r, a[1] = n, a[e] = -n, a[e + 1] = r, a;
}
function Ft(t) {
  for (var e = t * t, r = [], n = 0; n < e; ++n)
    r[n] = n % (t + 1) ? 0 : 1;
  return r;
}
function Ro(t, e) {
  for (var r = Ft(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[(e + 1) * a] = t[a];
  return r;
}
function Dr(t, e) {
  for (var r = Ft(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[e * (e - 1) + a] = t[a];
  return r;
}
function Po(t, e, r, n, a, i, o, s) {
  var l = t[0], u = t[1], c = e[0], f = e[1], d = r[0], h = r[1], g = n[0], m = n[1], x = a[0], S = a[1], C = i[0], w = i[1], D = o[0], k = o[1], E = s[0], M = s[1], _ = [l, 0, c, 0, d, 0, g, 0, u, 0, f, 0, h, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, c, 0, d, 0, g, 0, u, 0, f, 0, h, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, -x * l, -S * l, -C * c, -w * c, -D * d, -k * d, -E * g, -M * g, -x * u, -S * u, -C * f, -w * f, -D * h, -k * h, -E * m, -M * m], I = Ae(_, 8);
  if (!I.length)
    return [];
  var v = Nt(I, [x, S, C, w, D, k, E, M], 8);
  return v[8] = 1, Be(up(v), 3, 4);
}
var gn = function() {
  return gn = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, gn.apply(this, arguments);
};
function Oo() {
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
function $r(t, e) {
  return e === void 0 && (e = 0), Ar(qr(t, e));
}
function Ca(t, e) {
  var r = ce(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), n = r[3] || 1;
  return [
    r[0] / n,
    r[1] / n,
    r[2] / n
  ];
}
function vp(t, e) {
  e === void 0 && (e = document.body);
  for (var r = t, n = Oo(); r; ) {
    var a = getComputedStyle(r).transform;
    if (n = qi($r(a), n), r === e)
      break;
    r = r.parentElement;
  }
  return n = Ae(n, 4), n[12] = 0, n[13] = 0, n[14] = 0, n;
}
function Ar(t) {
  var e = Oo();
  return t.forEach(function(r) {
    var n = r.matrixFunction, a = r.functionValue;
    n && (e = n(e, a));
  }), e;
}
function qr(t, e) {
  e === void 0 && (e = 0);
  var r = Vt(t) ? t : ur(t);
  return r.map(function(n) {
    var a = ku(n), i = a.prefix, o = a.value, s = null, l = i, u = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var c = ye(e) ? gn(gn({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, f = Sr(o).map(function(P, A) {
        return A === 0 && "x%" in c ? c["%"] = e["x%"] : A === 1 && "y%" in c ? c["%"] = e["y%"] : c["%"] = e["o%"], jt(P, c);
      }), d = f[0], h = f[1], g = h === void 0 ? 0 : h, m = f[2], x = m === void 0 ? 0 : m;
      s = Si, u = [d, g, x];
    } else if (i === "translateY") {
      var S = ye(e) ? gn({ "%": e["y%"] }, e) : {
        "%": e
      }, g = jt(o, S);
      s = Si, u = [0, g, 0];
    } else if (i === "translateZ") {
      var x = parseFloat(o);
      s = Si, u = [0, 0, x];
    } else if (i === "scale" || i === "scale3d") {
      var C = Sr(o).map(function(P) {
        return parseFloat(P);
      }), w = C[0], D = C[1], k = D === void 0 ? w : D, E = C[2], M = E === void 0 ? 1 : E;
      s = ia, u = [w, k, M];
    } else if (i === "scaleX") {
      var w = parseFloat(o);
      s = ia, u = [w, 1, 1];
    } else if (i === "scaleY") {
      var k = parseFloat(o);
      s = ia, u = [1, k, 1];
    } else if (i === "scaleZ") {
      var M = parseFloat(o);
      s = ia, u = [1, 1, M];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var _ = wr(o), I = _.unit, v = _.value, N = I === "rad" ? v : v * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = hp) : i === "rotateX" ? s = dp : i === "rotateY" && (s = pp), u = N;
    } else if (i === "matrix3d")
      s = qi, u = Sr(o).map(function(P) {
        return parseFloat(P);
      });
    else if (i === "matrix") {
      var R = Sr(o).map(function(P) {
        return parseFloat(P);
      });
      s = qi, u = [
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
var gp = /* @__PURE__ */ (function() {
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
})(), mp = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(r) {
    return this.object[r];
  }, e.set = function(r, n) {
    this.object[r] = n;
  }, t;
})(), xp = typeof Map == "function", yp = /* @__PURE__ */ (function() {
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
function bp(t, e) {
  var r = [], n = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new yp();
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
var Sp = /* @__PURE__ */ (function() {
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
    var r = bp(this.changedBeforeAdded, this.fixed), n = this.changed, a = [];
    this.cacheOrdered = r.filter(function(i, o) {
      var s = i[0], l = i[1], u = n[o], c = u[0], f = u[1];
      if (s !== l)
        return a.push([c, f]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function jo(t, e, r) {
  var n = xp ? Map : r ? mp : gp, a = r || function(C) {
    return C;
  }, i = [], o = [], s = [], l = t.map(a), u = e.map(a), c = new n(), f = new n(), d = [], h = [], g = {}, m = [], x = 0, S = 0;
  return l.forEach(function(C, w) {
    c.set(C, w);
  }), u.forEach(function(C, w) {
    f.set(C, w);
  }), l.forEach(function(C, w) {
    var D = f.get(C);
    typeof D > "u" ? (++S, o.push(w)) : g[D] = S;
  }), u.forEach(function(C, w) {
    var D = c.get(C);
    typeof D > "u" ? (i.push(w), ++x) : (s.push([D, w]), S = g[w] || 0, d.push([D - S, w - x]), h.push(w === D), D !== w && m.push([D, w]));
  }), o.reverse(), new Sp(t, e, i, o, m, s, d, h);
}
var Cp = /* @__PURE__ */ (function() {
  function t(r, n) {
    r === void 0 && (r = []), this.findKeyCallback = n, this.list = [].slice.call(r);
  }
  var e = t.prototype;
  return e.update = function(r) {
    var n = [].slice.call(r), a = jo(this.list, n, this.findKeyCallback);
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
var Vi = function(t, e) {
  return Vi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Vi(t, e);
};
function wp(t, e) {
  Vi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Ou = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), ju = /* @__PURE__ */ (function(t) {
  wp(e, t);
  function e(r) {
    return r === void 0 && (r = []), t.call(this, r, Ou) || this;
  }
  return e;
})(Cp);
function Fr(t, e) {
  return jo(t, e, Ou);
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
var Ki = function() {
  return Ki = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ki.apply(this, arguments);
};
function Ep() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
var Pn = /* @__PURE__ */ (function() {
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
    }, n.currentTarget = this, Ep(i).forEach(function(s) {
      s.listener(n), s.once && a.off(r, s.listener);
    }), !o;
  }, e.trigger = function(r, n) {
    return n === void 0 && (n = {}), this.emit(r, n);
  }, e._addEvent = function(r, n, a) {
    var i = this._events;
    i[r] = i[r] || [];
    var o = i[r];
    o.push(Ki({
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
var Ui = function(t, e) {
  return Ui = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Ui(t, e);
};
function Dp(t, e) {
  Ui(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Gr = function() {
  return Gr = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Gr.apply(this, arguments);
};
function kp(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function ol(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function oa(t) {
  if (t) {
    if (_e(t))
      return document.querySelector(t);
  } else return null;
  if (Ha(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var Nu = /* @__PURE__ */ (function(t) {
  Dp(e, t);
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
    var i = oa(a.container);
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
      return c.top > o - l ? (f[1] > c.top || o < f[1]) && (d[1] = -1) : c.top + c.height < o + l && (f[1] < c.top + c.height || o > f[1]) && (d[1] = 1), c.left > i - l ? (f[0] > c.left || i < f[0]) && (d[0] = -1) : c.left + c.width < i + l && (f[0] < c.left + c.width || i > f[0]) && (d[0] = 1), !d[0] && !d[1] ? !1 : this._continueDrag(Gr(Gr({}, a), {
        direction: d,
        inputEvent: n,
        isDrag: !0
      }));
    }
  }, r.checkScroll = function(n) {
    var a = this;
    if (this._isWait)
      return !1;
    var i = n.prevScrollPos, o = i === void 0 ? this._prevScrollPos : i, s = n.direction, l = n.throttleTime, u = l === void 0 ? 0 : l, c = n.inputEvent, f = n.isDrag, d = this._getScrollPosition(s || [0, 0], n), h = d[0] - o[0], g = d[1] - o[1], m = s || [h ? Math.abs(h) / h : 0, g ? Math.abs(g) / g : 0];
    return this._prevScrollPos = d, this._lock = !1, !h && !g ? !1 : (this.emit("move", {
      offsetX: m[0] ? h : 0,
      offsetY: m[1] ? g : 0,
      inputEvent: c
    }), u && f && (clearTimeout(this._timer), this._timer = window.setTimeout(function() {
      a._continueDrag(n);
    }, u)), !0);
  }, r.dragEnd = function() {
    this._flag = !1, this._lock = !1, clearTimeout(this._timer), this._unregisterScrollEvent();
  }, r._getScrollPosition = function(n, a) {
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? kp : o;
    return s({
      container: oa(i),
      direction: n
    });
  }, r._continueDrag = function(n) {
    var a = this, i, o = n.container, s = n.direction, l = n.throttleTime, u = n.useScroll, c = n.isDrag, f = n.inputEvent;
    if (!(!this._flag || c && this._isWait)) {
      var d = kn(), h = Math.max(l + this._prevTime - d, 0);
      if (h > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(n);
        }, h), !1;
      this._prevTime = d;
      var g = this._getScrollPosition(s, n);
      this._prevScrollPos = g, c && (this._isWait = !0), u || (this._lock = !0);
      var m = {
        container: oa(o),
        direction: s,
        inputEvent: f
      };
      return (i = n.requestScroll) === null || i === void 0 || i.call(n, m), this.emit("scroll", m), this._isWait = !1, u || this.checkScroll(Gr(Gr({}, n), {
        prevScrollPos: g,
        direction: s,
        inputEvent: f
      }));
    }
  }, r._registerScrollEvent = function(n) {
    this._unregisterScrollEvent();
    var a = n.checkScrollEvent;
    if (a) {
      var i = a === !0 ? ol : a, o = oa(n.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = ol(window, this._onScroll) : this._unregister = i(o, this._onScroll);
    }
  }, r._unregisterScrollEvent = function() {
    var n;
    (n = this._unregister) === null || n === void 0 || n.call(this), this._unregister = null;
  }, e;
})(Pn);
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
function Mp() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function ge(t) {
  return Ct(t, ne);
}
function _p(t, e) {
  return t.every(function(r, n) {
    return ge(r - e[n]) === 0;
  });
}
function Tp(t, e) {
  return !ge(t[0] - e[0]) && !ge(t[1] - e[1]);
}
function mn(t) {
  return t.length < 3 ? 0 : Math.abs(rp(t.map(function(e, r) {
    var n = t[r + 1] || t[0];
    return e[0] * n[1] - n[0] * e[1];
  }))) / 2;
}
function Zi(t, e) {
  var r = e.width, n = e.height, a = e.left, i = e.top, o = kr(t), s = o.minX, l = o.minY, u = o.maxX, c = o.maxY, f = r / (u - s), d = n / (c - l);
  return t.map(function(h) {
    return [a + (h[0] - s) * f, i + (h[1] - l) * d];
  });
}
function kr(t) {
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
function Oa(t, e, r) {
  var n = t[0], a = t[1], i = kr(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], u = ja(l[0], l[1]), c = Ji(e), f = [];
  if (c.forEach(function(g) {
    var m = ja(g[0], g[1]), x = g[0];
    if (_p(u, m))
      f.push({
        pos: t,
        line: g,
        type: "line"
      });
    else {
      var S = zu(No(u, m), [l, g]);
      S.forEach(function(C) {
        g.some(function(w) {
          return Tp(w, C);
        }) ? f.push({
          pos: C,
          line: g,
          type: "point"
        }) : ge(x[1] - a) !== 0 && f.push({
          pos: C,
          line: g,
          type: "intersection"
        });
      });
    }
  }), be(f, function(g) {
    return g[0] === n;
  }))
    return !0;
  var d = 0, h = {};
  return f.forEach(function(g) {
    var m = g.pos, x = g.type, S = g.line;
    if (!(m[0] > n))
      if (x === "intersection")
        ++d;
      else {
        if (x === "line")
          return;
        if (x === "point") {
          var C = be(S, function(k) {
            return k[1] !== a;
          }), w = h[m[0]], D = C[1] > a ? 1 : -1;
          w ? w !== D && ++d : h[m[0]] = D;
        }
      }
  }), d % 2 === 1;
}
function ja(t, e) {
  var r = t[0], n = t[1], a = e[0], i = e[1], o = a - r, s = i - n;
  Math.abs(o) < ne && (o = 0), Math.abs(s) < ne && (s = 0);
  var l = 0, u = 0, c = 0;
  return o ? s ? (l = -s / o, u = 1, c = -l * r - n) : (u = 1, c = -n) : s && (l = -1, c = r), [l, u, c];
}
function No(t, e) {
  var r = t[0], n = t[1], a = t[2], i = e[0], o = e[1], s = e[2], l = r === 0 && i === 0, u = n === 0 && o === 0, c = [];
  if (l && u)
    return [];
  if (l) {
    var f = -a / n, d = -s / o;
    return f !== d ? [] : [[-1 / 0, f], [1 / 0, f]];
  } else if (u) {
    var h = -a / r, g = -s / i;
    return h !== g ? [] : [[h, -1 / 0], [h, 1 / 0]];
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
  return c.map(function(S) {
    return [S[0], S[1]];
  });
}
function zu(t, e) {
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
    return r.every(function(g) {
      return 0 <= ge(d - g[0][0]) && 0 <= ge(g[0][1] - d) && 0 <= ge(h - g[1][0]) && 0 <= ge(g[1][1] - h);
    });
  })), n.map(function(f) {
    return [ge(f[0]), ge(f[1])];
  });
}
function Ji(t) {
  return Mp(t.slice(1), [t[0]]).map(function(e, r) {
    return [t[r], e];
  });
}
function Ip(t, e) {
  var r = t.slice(), n = e.slice();
  al(r) === -1 && r.reverse(), al(n) === -1 && n.reverse();
  var a = Ji(r), i = Ji(n), o = a.map(function(c) {
    return ja(c[0], c[1]);
  }), s = i.map(function(c) {
    return ja(c[0], c[1]);
  }), l = [];
  o.forEach(function(c, f) {
    var d = a[f], h = [];
    s.forEach(function(g, m) {
      var x = No(c, g), S = zu(x, [d, i[m]]);
      h.push.apply(h, S.map(function(C) {
        return {
          index1: f,
          index2: m,
          pos: C,
          type: "intersection"
        };
      }));
    }), h.sort(function(g, m) {
      return Ye(d[0], g.pos) - Ye(d[0], m.pos);
    }), l.push.apply(l, h), Oa(d[1], n) && l.push({
      index1: f,
      index2: -1,
      pos: d[1],
      type: "inside"
    });
  }), i.forEach(function(c, f) {
    if (Oa(c[1], r)) {
      var d = !1, h = Je(l, function(g) {
        var m = g.index2;
        return m === f ? (d = !0, !1) : !!d;
      });
      h === -1 && (d = !1, h = Je(l, function(g) {
        var m = g.index1, x = g.index2;
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
function Qi(t, e) {
  var r = Ip(t, e);
  return r.map(function(n) {
    var a = n.pos;
    return a;
  });
}
function Rp(t, e) {
  var r = Qi(t, e);
  return mn(r);
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
var to = function(t, e) {
  return to = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, to(t, e);
};
function Pp(t, e) {
  to(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var te = function() {
  return te = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, te.apply(this, arguments);
};
function Op(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function Ci(t) {
  return Op([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function jp(t) {
  return t.touches && t.touches.length >= 2;
}
function sa(t) {
  return t ? t.touches ? zp(t.touches) : [Au(t)] : [];
}
function Np(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function sl(t, e, r) {
  var n = r.length, a = xn(t, n), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, u = xn(e, n), c = u.clientX, f = u.clientY, d = xn(r, n), h = d.clientX, g = d.clientY, m = i - c, x = o - f, S = i - h, C = o - g;
  return {
    clientX: s,
    clientY: l,
    deltaX: m,
    deltaY: x,
    distX: S,
    distY: C
  };
}
function wi(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function zp(t) {
  for (var e = Math.min(t.length, 2), r = [], n = 0; n < e; ++n)
    r.push(Au(t[n]));
  return r;
}
function Au(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY
  };
}
function xn(t, e) {
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
var Ei = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), Ci(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), Ci(e) - Ci(this.startClients);
  }, t.prototype.getPosition = function(e, r) {
    e === void 0 && (e = this.prevClients);
    var n = sl(e || this.prevClients, this.prevClients, this.startClients), a = n.deltaX, i = n.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, n;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var r = this.prevClients, n = this.startClients, a = Math.min(this.length, r.length), i = [], o = 0; o < a; ++o)
      i[o] = sl([e[o]], [r[o]], [n[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var r = this.movement;
    if (!e)
      return r;
    var n = xn(e, this.length), a = xn(this.prevClients, this.length), i = n.clientX - a.clientX, o = n.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + r;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), wi(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), wi(e) / wi(this.startClients);
  }, t.prototype.move = function(e, r) {
    this.startClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    }), this.prevClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    });
  }, t;
})(), ll = ["textarea", "input"], Bu = /* @__PURE__ */ (function(t) {
  Pp(e, t);
  function e(r, n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(d, h) {
      if (h === void 0 && (h = !0), !(!a.flag && d.cancelable === !1)) {
        var g = d.type.indexOf("drag") >= -1;
        if (!(a.flag && g)) {
          a._isDragAPI = !0;
          var m = a.options, x = m.container, S = m.pinchOutside, C = m.preventWheelClick, w = m.preventRightClick, D = m.preventDefault, k = m.checkInput, E = m.dragFocusedInput, M = m.preventClickEventOnDragStart, _ = m.preventClickEventOnDrag, I = m.preventClickEventByCondition, v = a._useTouch, N = !a.flag;
          if (a._isSecondaryButton = d.which === 3 || d.button === 2, C && (d.which === 2 || d.button === 1) || w && (d.which === 3 || d.button === 2))
            return a.stop(), !1;
          if (N) {
            var R = a._window.document.activeElement, P = d.target;
            if (P) {
              var A = P.tagName.toLowerCase(), B = ll.indexOf(A) > -1, X = P.isContentEditable;
              if (B || X) {
                if (k || !E && R === P)
                  return !1;
                if (R && (R === P || X && R.isContentEditable && R.contains(P)))
                  if (E)
                    P.blur();
                  else
                    return !1;
              } else if ((D || d.type === "touchstart") && R) {
                var V = R.tagName.toLowerCase();
                (R.isContentEditable || ll.indexOf(V) > -1) && R.blur();
              }
              (M || _ || I) && re(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new Ei(sa(d))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = h, a._dragFlag = !0, a._prevInputEvent = d, a.data = {}, a.doubleFlag = kn() - a.prevTime < 200, a._isMouseEvent = Np(d), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var G = a._preventMouseEvent || a.emit("dragStart", te(te({ data: a.data, datas: a.data, inputEvent: d, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: h, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
              d.preventDefault();
            }, preventDrag: function() {
              a._dragFlag = !1;
            } }));
            G === !1 && a.stop(), a._isMouseEvent && a.flag && D && d.preventDefault();
          }
          if (!a.flag)
            return !1;
          var K = 0;
          if (N ? (a._attchDragEvent(), v && S && (K = setTimeout(function() {
            re(x, "touchstart", a.onDragStart, {
              passive: !1
            });
          }))) : v && S && qt(x, "touchstart", a.onDragStart), a.flag && jp(d)) {
            if (clearTimeout(K), N && d.touches.length !== d.changedTouches.length)
              return;
            a.pinchFlag || a.onPinchStart(d);
          }
        }
      }
    }, a.onDrag = function(d, h) {
      if (a.flag) {
        var g = a.options.preventDefault;
        !a._isMouseEvent && g && d.preventDefault(), a._prevInputEvent = d;
        var m = sa(d), x = a.moveClients(m, d, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || x.deltaX || x.deltaY) {
            var S = a._preventMouseEvent || a.emit("drag", te(te({}, x), { isScroll: !!h, inputEvent: d }));
            if (S === !1) {
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
        var h = a.options, g = h.pinchOutside, m = h.container, x = h.preventClickEventOnDrag, S = h.preventClickEventOnDragStart, C = h.preventClickEventByCondition, w = a.isDrag;
        (x || S || C) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !C && !S && x && !w && a._allowClickEvent(), a._useTouch && g && qt(m, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(d);
        var D = d != null && d.touches ? sa(d) : [], k = D.length;
        k === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new Ei(D));
        var E = a._getPosition(), M = kn(), _ = !w && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = w || _ ? 0 : M, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", te({ data: a.data, datas: a.data, isDouble: _, isDrag: w, isClick: !w, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: d, isTrusted: a._isTrusted }, E)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
          a._preventMouseEvent = !1;
        }, 200)), a._isIdle = !0);
      }
    }, a.onBlur = function() {
      a.onDragEnd();
    }, a._allowClickEvent = function() {
      qt(a._window, "click", a._onClick, !0);
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
    a._window = Tu(o) ? o : ke(o), a.options = te({ checkInput: !1, container: o && !("document" in o) ? ke(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, n);
    var s = a.options, l = s.container, u = s.events, c = s.checkWindowBlur;
    if (a._useDrag = u.indexOf("drag") > -1, a._useTouch = u.indexOf("touch") > -1, a._useMouse = u.indexOf("mouse") > -1, a.targets = i, a._useDrag && i.forEach(function(d) {
      re(d, "dragstart", a.onDragStart);
    }), a._useMouse && (i.forEach(function(d) {
      re(d, "mousedown", a.onDragStart), re(d, "mousemove", a._passCallback);
    }), re(l, "contextmenu", a._onContextMenu)), c && re(ke(), "blur", a.onBlur), a._useTouch) {
      var f = {
        passive: !1
      };
      i.forEach(function(d) {
        re(d, "touchstart", a.onDragStart, f), re(d, "touchmove", a._passCallback, f);
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
    return r === void 0 && (r = this._prevInputEvent), te(te({ data: this.data, datas: this.data }, this._getPosition()), { movement: this.getMovement(), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, inputEvent: r });
  }, e.prototype.getEventData = function() {
    return this.data;
  }, e.prototype.getEventDatas = function() {
    return this.data;
  }, e.prototype.unset = function() {
    var r = this, n = this.targets, a = this.options.container;
    this.off(), qt(this._window, "blur", this.onBlur), this._useDrag && n.forEach(function(i) {
      qt(i, "dragstart", r.onDragStart);
    }), this._useMouse && (n.forEach(function(i) {
      qt(i, "mousedown", r.onDragStart);
    }), qt(a, "contextmenu", this._onContextMenu)), this._useTouch && (n.forEach(function(i) {
      qt(i, "touchstart", r.onDragStart);
    }), qt(a, "touchstart", this.onDragStart)), this._prevInputEvent = null, this._allowClickEvent(), this._dettachDragEvent();
  }, e.prototype.onPinchStart = function(r) {
    var n = this, a = this.options.pinchThreshold;
    if (!(this.isDrag && this.getMovement() > a)) {
      var i = new Ei(sa(r));
      this.pinchFlag = !0, this._addStore(i);
      var o = this.emit("pinchStart", te(te({ data: this.data, datas: this.data, angle: i.getAngle(), touches: this.getCurrentStore().getPositions() }, i.getPosition()), { inputEvent: r, isTrusted: this._isTrusted, preventDefault: function() {
        r.preventDefault();
      }, preventDrag: function() {
        n._dragFlag = !1;
      } }));
      o === !1 && (this.pinchFlag = !1);
    }
  }, e.prototype.onPinch = function(r, n) {
    if (!(!this.flag || !this.pinchFlag || n.length < 2)) {
      var a = this.getCurrentStore();
      this.isPinch = !0, this.emit("pinch", te(te({ data: this.data, datas: this.data, movement: this.getMovement(n), angle: a.getAngle(n), rotation: a.getRotation(n), touches: a.getPositions(n), scale: a.getScale(n), distance: a.getDistance(n) }, a.getPosition(n)), { inputEvent: r, isTrusted: this._isTrusted }));
    }
  }, e.prototype.onPinchEnd = function(r) {
    if (this.pinchFlag) {
      var n = this.isPinch;
      this.isPinch = !1, this.pinchFlag = !1;
      var a = this.getCurrentStore();
      this.emit("pinchEnd", te(te({ data: this.data, datas: this.data, isPinch: n, touches: a.getPositions() }, a.getPosition()), { inputEvent: r }));
    }
  }, e.prototype.getCurrentStore = function() {
    return this.clientStores[0];
  }, e.prototype.moveClients = function(r, n, a) {
    var i = this._getPosition(r, a), o = this.isDrag;
    (i.deltaX || i.deltaY) && (this.isDrag = !0);
    var s = !1;
    return !o && this.isDrag && (s = !0), te(te({ data: this.data, datas: this.data }, i), { movement: this.getMovement(r), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, isMouseEvent: this._isMouseEvent, isSecondaryButton: this._isSecondaryButton, inputEvent: n, isTrusted: this._isTrusted, isFirstDrag: s });
  }, e.prototype._addStore = function(r) {
    this.clientStores.splice(0, 0, r);
  }, e.prototype._getPosition = function(r, n) {
    var a = this.getCurrentStore(), i = a.getPosition(r, n), o = this.clientStores.slice(1).reduce(function(u, c) {
      var f = c.getPosition();
      return u.distX += f.distX, u.distY += f.distY, u;
    }, i), s = o.distX, l = o.distY;
    return te(te({}, i), { distX: s, distY: l });
  }, e.prototype._attchDragEvent = function() {
    var r = this._window, n = this.options.container, a = {
      passive: !1
    };
    this._isDragAPI && (re(n, "dragover", this.onDrag, a), re(r, "dragend", this.onDragEnd)), this._useMouse && (re(n, "mousemove", this.onDrag), re(r, "mouseup", this.onDragEnd)), this._useTouch && (re(n, "touchmove", this.onDrag, a), re(r, "touchend", this.onDragEnd, a), re(r, "touchcancel", this.onDragEnd, a));
  }, e.prototype._dettachDragEvent = function() {
    var r = this._window, n = this.options.container;
    this._isDragAPI && (qt(n, "dragover", this.onDrag), qt(r, "dragend", this.onDragEnd)), this._useMouse && (qt(n, "mousemove", this.onDrag), qt(r, "mouseup", this.onDragEnd)), this._useTouch && (qt(n, "touchstart", this.onDragStart), qt(n, "touchmove", this.onDrag), qt(r, "touchend", this.onDragEnd), qt(r, "touchcancel", this.onDragEnd));
  }, e.prototype._allowMouseEvent = function() {
    this._preventMouseEvent = !1, clearTimeout(this._preventMouseEventId);
  }, e;
})(Pn);
function Ap(t) {
  for (var e = 5381, r = t.length; r; )
    e = e * 33 ^ t.charCodeAt(--r);
  return e >>> 0;
}
var Bp = Ap;
function Fp(t) {
  return Bp(t).toString(36);
}
function Gp(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function Lp(t, e, r) {
  return r.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(n, a) {
    var i = a.trim();
    return (i ? Sr(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function Wp(t, e, r, n, a) {
  var i = Ne(n), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), r.nonce && o.setAttribute("nonce", r.nonce), o.innerHTML = Lp(t, e, r), (a || i.head || i.body).appendChild(o), o;
}
function Fu(t) {
  var e = "rCS" + Fp(t);
  return {
    className: e,
    inject: function(r, n) {
      n === void 0 && (n = {});
      var a = Gp(r), i = (a || r.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = Wp(e, t, n, r, a);
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
var eo = function() {
  return eo = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, eo.apply(this, arguments);
};
function Yp(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Gu(t, e) {
  var r = Fu(e), n = r.className;
  return Q.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = Yp(a, ["className", "cspNonce"]), u = Q.useRef();
    return Q.useImperativeHandle(i, function() {
      return u.current;
    }, []), Q.useEffect(function() {
      var c = r.inject(u.current, {
        nonce: a.cspNonce
      });
      return function() {
        c.destroy();
      };
    }, []), Q.createElement(t, eo({
      ref: u,
      "data-styled-id": n,
      className: "".concat(s, " ").concat(n)
    }, l));
  });
}
var ro = function(t, e) {
  return ro = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, ro(t, e);
};
function On(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  ro(t, e);
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
function Xp(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
      e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Hp(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function $p(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, r = e && t[e], n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number") return {
    next: function() {
      return t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function j(t, e) {
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
function jn(t, e) {
  return O({ events: [], props: [], name: t }, e);
}
var qp = ["n", "w", "s", "e"], zo = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function Vp(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function Kp(t) {
  var e = Vp(1, t), r = Math.round(t / 45) * 45 % 180, n = "ns-resize";
  return r === 135 ? n = "nwse-resize" : r === 45 ? n = "nesw-resize" : r === 90 && (n = "ew-resize"), "cursor:".concat(n, ";cursor: url('").concat(e, "') 16 16, ").concat(n, ";");
}
var tn = Ld(), Lu = tn.browser.webkit, Wu = Lu && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), Yu = tn.browser.name, Xu = parseInt(tn.browser.version, 10), Up = Yu === "chrome", Zp = tn.browser.chromium, Jp = parseInt(tn.browser.chromiumVersion, 10) || 0, Qp = Up && Xu >= 109 || Zp && Jp >= 109, th = Yu === "firefox", eh = parseInt(tn.browser.webkitVersion, 10) >= 612 || Xu >= 15, Ao = "moveable-", rh = zo.map(function(t) {
  var e = "", r = "", n = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (r = "left: ".concat(i, ";"), n = "right"), t.indexOf("e") > -1 && (r = "left: 0px;", n = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(r).concat(e, `
        transform-origin: `).concat(n, " ").concat(a, `;
    }`);
}).join(`
`), nh = `
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
`.concat(rh, `
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
`).concat(Kp(t), `
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

`).concat(Wu ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), ah = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], no = 1e-4, ve = 1e-7, la = 1e-9, ao = Math.pow(10, 10), ul = -ao, ih = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, Bo = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, Hu = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, oh = [
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
function Nn(t, e, r, n, a, i) {
  var o, s;
  i === void 0 && (i = "draggable");
  var l = (s = (o = e.gestos[i]) === null || o === void 0 ? void 0 : o.move(r, t.inputEvent)) !== null && s !== void 0 ? s : {}, u = l.originalDatas || l.datas, c = u[i] || (u[i] = {});
  return O(O({}, l), { isPinch: !!n, parentEvent: !0, datas: c, originalDatas: t.originalDatas });
}
var Vr = /* @__PURE__ */ (function() {
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
function Hr(t, e, r, n) {
  var a = t.length === 16, i = a ? 4 : 3, o = Ir(t, r, n, i), s = j(o, 4), l = j(s[0], 2), u = l[0], c = l[1], f = j(s[1], 2), d = f[0], h = f[1], g = j(s[2], 2), m = g[0], x = g[1], S = j(s[3], 2), C = S[0], w = S[1], D = j(Yt(t, e, i), 2), k = D[0], E = D[1], M = Math.min(u, d, m, C), _ = Math.min(c, h, x, w), I = Math.max(u, d, m, C), v = Math.max(c, h, x, w);
  u = u - M || 0, d = d - M || 0, m = m - M || 0, C = C - M || 0, c = c - _ || 0, h = h - _ || 0, x = x - _ || 0, w = w - _ || 0, k = k - M || 0, E = E - _ || 0;
  var N = t[0], R = t[i + 1], P = pe(N * R);
  return {
    left: M,
    top: _,
    right: I,
    bottom: v,
    origin: [k, E],
    pos1: [u, c],
    pos2: [d, h],
    pos3: [m, x],
    pos4: [C, w],
    direction: P
  };
}
function $u(t, e) {
  var r = e.clientX, n = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, u = i.pos1, c = o.left, f = o.top, d = l ? 4 : 3, h = j(xt(Zr(s, [r - c, n - f], d), u), 2), g = h[0], m = h[1], x = j(He({ datas: a, distX: g, distY: m }), 2), S = x[0], C = x[1];
  return [S, C];
}
function Tr(t, e) {
  var r = e.datas, n = t.state, a = n.allMatrix, i = n.beforeMatrix, o = n.is3d, s = n.left, l = n.top, u = n.origin, c = n.offsetMatrix, f = n.targetMatrix, d = n.transformOrigin, h = o ? 4 : 3;
  r.is3d = o, r.matrix = a, r.targetMatrix = f, r.beforeMatrix = i, r.offsetMatrix = c, r.transformOrigin = d, r.inverseMatrix = Ae(a, h), r.inverseBeforeMatrix = Ae(i, h), r.absoluteOrigin = Er(Rt([s, l], u), h), r.startDragBeforeDist = ce(r.inverseBeforeMatrix, r.absoluteOrigin, h), r.startDragDist = ce(r.inverseMatrix, r.absoluteOrigin, h);
}
function sh(t) {
  return Hr(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function $a(t, e, r) {
  var n = e.datas, a = e.originalDatas.beforeRenderable, i = n.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, u = -1;
  i === -1 ? (r === "translate" ? u = 0 : r === "rotate" && (u = Je(o, function(h) {
    return h.match(/scale\(/g);
  })), u === -1 && (u = o.length), n.transformIndex = u) : be(l, function(h) {
    return h.index === i && h.functionName === r;
  }) ? u = i : u = i + l.filter(function(h) {
    return h.index < i;
  }).length;
  var c = Ov(o, t.state, u), f = c.targetFunction, d = r === "rotate" ? "rotateZ" : r;
  n.beforeFunctionTexts = c.beforeFunctionTexts, n.afterFunctionTexts = c.afterFunctionTexts, n.beforeTransform = c.beforeFunctionMatrix, n.beforeTransform2 = c.beforeFunctionMatrix2, n.targetTansform = c.targetFunctionMatrix, n.afterTransform = c.afterFunctionMatrix, n.afterTransform2 = c.afterFunctionMatrix2, n.targetAllTransform = c.allFunctionMatrix, f.functionName === d ? (n.afterFunctionTexts.splice(0, 1), n.isAppendTransform = !1) : s > u && (n.isAppendTransform = !0, a.nextTransformAppendedIndexes = et(et([], j(l), !1), [{
    functionName: r,
    index: u,
    isAppend: !0
  }], !1));
}
function qa(t, e, r) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? r : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function lh(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = j(Vu({ datas: e, distX: r, distY: n }), 2), i = a[0], o = a[1], s = qu(e, cp([i, o], 4));
  return ce(s, Er([0, 0, 0], 4), 4);
}
function qu(t, e, r) {
  var n = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = r ? Nt(s, e, 4) : Nt(e, s, 4), u = Nt(Ae(r ? i : n, 4), l, 4), c = Nt(u, Ae(r ? o : a, 4), 4);
  return c;
}
function Vu(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return xt(ce(a, Rt(s, [r, n]), l), o);
}
function He(t, e) {
  var r = t.datas, n = t.distX, a = t.distY, i = r.inverseBeforeMatrix, o = r.inverseMatrix, s = r.is3d, l = r.startDragBeforeDist, u = r.startDragDist, c = r.absoluteOrigin, f = s ? 4 : 3;
  return xt(ce(e ? i : o, Rt(c, [n, a]), f), e ? l : u);
}
function uh(t, e) {
  var r = t.datas, n = t.distX, a = t.distY;
  r.beforeMatrix;
  var i = r.matrix, o = r.is3d;
  r.startDragBeforeDist;
  var s = r.startDragDist, l = r.absoluteOrigin, u = o ? 4 : 3;
  return xt(ce(i, Rt(s, [n, a]), u), l);
}
function ch(t, e, r, n, a, i) {
  return n === void 0 && (n = e), a === void 0 && (a = r), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = wr(o), u = l.value, c = l.unit, f = s ? a : n, d = s ? r : e;
    if (o === "%" || isNaN(u)) {
      var h = f ? i[s] / f : 0;
      return d * h;
    } else if (c !== "%")
      return u;
    return d * u / 100;
  }) : i;
}
function Ku(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function fh(t, e) {
  return Ku(e).map(function(r) {
    return t[r];
  });
}
function Di(t, e) {
  var r = (e + 1) / 2;
  return [
    Ia(t[0][0], t[1][0], r, 1 - r),
    Ia(t[0][1], t[1][1], r, 1 - r)
  ];
}
function ie(t, e) {
  var r = Di([t[0], t[1]], e[0]), n = Di([t[2], t[3]], e[0]);
  return Di([r, n], e[1]);
}
function dh(t, e, r, n, a, i) {
  var o = Ir(e, r, n, a), s = ie(o, i), l = t[0] - s[0], u = t[1] - s[1];
  return [l, u];
}
function zn(t, e, r, n) {
  return Nt(t, bn(e, n, r), n);
}
function ph(t, e, r, n) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (_e(r)) {
    var u = e.beforeTransform, c = e.afterTransform;
    n ? l = Be($r(r), 4, s) : l = Be(Nt(Nt(u, $r([r]), 4), c, 4), 4, s);
  } else
    l = r;
  return zn(i, l, a, s);
}
function hh(t, e) {
  var r = t.transformOrigin, n = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return zn(n, Nt(o || i, Ro(e, s), s), r, s);
}
function Va(t, e) {
  var r = en(e);
  return {
    setTransform: function(n, a) {
      a === void 0 && (a = -1), r.startTransforms = Vt(n) ? n : ur(n), io(t, e, a);
    },
    setTransformIndex: function(n) {
      io(t, e, n);
    }
  };
}
function Ka(t, e, r) {
  var n = en(e), a = n.startTransforms;
  io(t, e, Je(a, function(i) {
    return i.indexOf("".concat(r, "(")) === 0;
  }));
}
function io(t, e, r) {
  var n = en(e), a = e.datas;
  if (a.transformIndex = r, r !== -1) {
    var i = n.startTransforms[r];
    if (i) {
      var o = t.state, s = qr([i], {
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
function Fo(t, e) {
  var r = en(t);
  r.nextTransforms = ur(e);
}
function en(t) {
  return t.originalDatas.beforeRenderable;
}
function Na(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function ua(t) {
  return (Na(t) || []).join(" ");
}
function ca(t) {
  return en(t).nextStyle;
}
function Uu(t, e, r, n, a) {
  Fo(a, e);
  var i = de.drag(t, Nn(a, t.state, r, n)), o = i ? i.transform : e;
  return O(O({ transform: e, drag: i }, he({
    transform: o
  }, a)), { afterTransform: o });
}
function Go(t, e, r, n, a, i) {
  var o = ph(t.state, a, e, i), s = mh(t, r, n, o);
  return s;
}
function Zu(t, e, r, n, a, i, o) {
  var s = Go(t, e, r, a, i, o), l = t.state, u = l.left, c = l.top, f = t.props.groupable, d = f ? u : 0, h = f ? c : 0, g = xt(n, s);
  return xt(g, [d, h]);
}
function vh(t, e, r, n, a, i, o) {
  var s = Zu(t, e, r, n, a, i, o);
  return s;
}
function gh(t, e, r) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    r ? -1 + t[1] / (r / 2) : 0
  ];
}
function mh(t, e, r, n) {
  n === void 0 && (n = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, u = [
    i / 2 * (1 + e[0]) + r[0],
    o / 2 * (1 + e[1]) + r[1]
  ];
  return Yt(n, u, l);
}
function xh(t, e, r) {
  var n = r.fixedDirection, a = r.fixedPosition, i = r.fixedOffset;
  return Zu(t, "rotate(".concat(e, "deg)"), n, a, i, r);
}
function yh(t, e, r, n, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, u = s.offsetMatrix, c = s.is3d, f = s.width, d = s.height, h = s.left, g = s.top, m = i.fixedDirection, x = i.nextTargetMatrix || s.targetMatrix, S = c ? 4 : 3, C = ch(a, e, r, f, d, l), w = o ? h : 0, D = o ? g : 0, k = zn(u, x, C, S), E = dh(n, k, e, r, S, m);
  return xt(E, [w, D]);
}
function bh(t, e) {
  return ie(Ie(t.state), e);
}
function Sh(t, e) {
  var r = t.targetGesto, n = t.controlGesto, a;
  return r != null && r.isFlag() && (a = r.getEventData()[e]), !a && (n != null && n.isFlag()) && (a = n.getEventData()[e]), a || {};
}
function Ch(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function wh(t) {
  var e = t("scale"), r = t("rotate"), n = t("translate"), a = [];
  return n && n !== "0px" && n !== "none" && a.push("translate(".concat(n.split(/\s+/).join(","), ")")), r && r !== "1" && r !== "none" && a.push("rotate(".concat(r, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function Ju(t, e, r) {
  for (var n = t, a = [], i = Io(t) || dr(t), o = !r && t === e || t === i, s = o, l = !1, u = 3, c, f, d, h = !1, g = Tn(e, e, !0).offsetParent, m = 1; n && !s; ) {
    s = o;
    var x = me(n), S = x("position"), C = Cc(n), w = S === "fixed", D = wh(x), k = fp(bv(C)), E = void 0, M = !1, _ = !1, I = 0, v = 0, N = 0, R = 0, P = {
      hasTransform: !1,
      fixedContainer: null
    };
    w && (h = !0, P = Dv(n), g = P.fixedContainer);
    var A = k.length;
    !l && (A === 16 || D.length) && (l = !0, u = 4, fo(a), d && (d = Be(d, 3, 4))), l && A === 9 && (k = Be(k, 3, 4));
    var B = Ev(n, t), X = B.tagName, V = B.hasOffset, G = B.isSVG, K = B.origin, U = B.targetOrigin, L = B.offset, rt = j(L, 2), nt = rt[0], tt = rt[1];
    X === "svg" && !n.ownerSVGElement && d && (a.push({
      type: "target",
      target: n,
      matrix: kv(n, u)
    }), a.push({
      type: "offset",
      target: n,
      matrix: Ft(u)
    }));
    var at = parseFloat(x("zoom")) || 1;
    if (w)
      E = P.fixedContainer, M = !0;
    else {
      var J = Tn(n, e, !1, !0, x), ot = J.offsetZoom;
      if (E = J.offsetParent, M = J.isEnd, _ = J.isStatic, m *= ot, (J.isCustomElement || ot !== 1) && _)
        nt -= E.offsetLeft, tt -= E.offsetTop;
      else if (th || Qp) {
        var ft = J.parentSlotElement;
        if (ft) {
          for (var bt = E, pt = 0, H = 0; bt && Ch(bt); )
            pt += bt.offsetLeft, H += bt.offsetTop, bt = bt.offsetParent;
          nt -= pt, tt -= H;
        }
      }
    }
    if (Lu && !eh && V && !G && _ && (S === "relative" || S === "static") && (nt -= E.offsetLeft, tt -= E.offsetTop, o = o || M), w)
      V && P.hasTransform && (N = E.clientLeft, R = E.clientTop);
    else if (V && g !== E && (I = E.clientLeft, v = E.clientTop), V && E === i) {
      var ut = wc(n, !1);
      nt += ut[0], tt += ut[1];
    }
    if (a.push({
      type: "target",
      target: n,
      matrix: bn(k, u, K)
    }), D.length && (a.push({
      type: "offset",
      target: n,
      matrix: Ft(u)
    }), a.push({
      type: "target",
      target: n,
      matrix: bn($r(D), u, K)
    })), V) {
      var Dt = n === t, vt = Dt ? 0 : n.scrollLeft, gt = Dt ? 0 : n.scrollTop;
      a.push({
        type: "offset",
        target: n,
        matrix: Dr([
          nt - vt + I - N,
          tt - gt + v - R
        ], u)
      });
    } else
      a.push({
        type: "offset",
        target: n,
        origin: K
      });
    if (at !== 1 && a.push({
      type: "zoom",
      target: n,
      matrix: bn(Ro([at, at], u), u, [0, 0])
    }), d || (d = k), c || (c = K), f || (f = U), s || w)
      break;
    n = E, o = M, (!r || n === i) && (s = o);
  }
  return d || (d = Ft(u)), c || (c = [0, 0]), f || (f = [0, 0]), {
    zoom: m,
    offsetContainer: g,
    matrixes: a,
    targetMatrix: d,
    transformOrigin: c,
    targetOrigin: f,
    is3d: l,
    hasFixed: h
  };
}
var mr = null, xr = null, Lr = null;
function Kr(t) {
  t ? (window.Map && (mr = /* @__PURE__ */ new Map(), xr = /* @__PURE__ */ new Map()), Lr = []) : (mr = null, Lr = null, xr = null);
}
function Eh(t) {
  var e = xr == null ? void 0 : xr.get(t);
  if (e)
    return e;
  var r = Sn(t, !0);
  return xr && xr.set(t, r), r;
}
function Dh(t, e) {
  if (Lr) {
    var r = be(Lr, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (r)
      return r[1];
  }
  var n = Ju(t, e, !0);
  return Lr && Lr.push([[t, e], n]), n;
}
function me(t) {
  var e = mr == null ? void 0 : mr.get(t);
  if (!e) {
    var r = ke(t).getComputedStyle(t);
    if (!mr)
      return function(i) {
        return r[i];
      };
    e = {
      style: r,
      cached: {}
    }, mr.set(t, e);
  }
  var n = e.cached, a = e.style;
  return function(i) {
    return i in n || (n[i] = a[i]), n[i];
  };
}
function ze(t, e, r) {
  var n = r.originalDatas;
  n.groupable = n.groupable || {};
  var a = n.groupable;
  a.childDatas = a.childDatas || [];
  var i = a.childDatas;
  return t.moveables.map(function(o, s) {
    return i[s] = i[s] || {}, i[s][e] = i[s][e] || {}, O(O({}, r), { isRequestChild: !0, datas: i[s][e], originalDatas: i[s] });
  });
}
function ki(t, e, r, n, a, i, o) {
  var s = !!r.match(/Start$/g), l = !!r.match(/End$/g), u = a.isPinch, c = a.datas, f = ze(t, e.name, a), d = t.moveables, h = [], g = f.map(function(m, x) {
    var S = d[x], C = S.state, w = C.gestos, D = m;
    if (s)
      D = new Vr(o).dragStart(n, m), h.push(D);
    else {
      if (w[o] || (w[o] = c.childGestos[x]), !w[o])
        return;
      D = Nn(m, C, n, u, i, o), h.push(D);
    }
    var k = e[r](S, O(O({}, D), { parentFlag: !0 }));
    return l && (w[o] = null), k;
  });
  return s && (c.childGestos = d.map(function(m) {
    return m.state.gestos[o];
  })), {
    eventParams: g,
    childEvents: h
  };
}
function Ze(t, e, r, n, a, i) {
  a === void 0 && (a = function(c, f) {
    return f;
  });
  var o = !!r.match(/End$/g), s = ze(t, e.name, n), l = t.moveables, u = s.map(function(c, f) {
    var d = l[f], h = c;
    h = a(d, c);
    var g = e[r](d, O(O({}, h), { parentFlag: !0 }));
    return o && (d.state.gestos = {}), g;
  });
  return u;
}
function za(t, e, r, n) {
  var a = r.fixedDirection, i = r.fixedPosition, o = n.datas.startPositions || Ie(e.state), s = ie(o, a), l = j(ce(Rn(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), u = l[0], c = l[1];
  return n.datas.originalX = u, n.datas.originalY = c, n;
}
function Qu(t, e, r, n) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = Mr(t.props, e).zoom, u = yn(o / Math.PI * 180), c = {}, f = t.renderState;
  f.renderDirectionMap || (f.renderDirectionMap = {});
  var d = f.renderDirectionMap;
  r.forEach(function(g) {
    var m = g.dir;
    c[m] = !0;
  });
  var h = pe(s);
  return r.map(function(g) {
    var m = g.data, x = g.classNames, S = g.dir, C = Bo[S];
    if (!C || !c[S])
      return null;
    d[S] = !0;
    var w = (Ct(u, 15) + h * Hu[S] + 720) % 180, D = {};
    return Qr(m).forEach(function(k) {
      D["data-".concat(k)] = m[k];
    }), n.createElement("div", O({ className: ht.apply(void 0, et(["control", "direction", S, e], j(x), !1)), "data-rotation": w, "data-direction": S }, D, { key: "direction-".concat(S), style: Ga.apply(void 0, et([o, l], j(C.map(function(k) {
      return i[k];
    })), !1)) }));
  });
}
function tc(t, e, r, n) {
  var a = Mr(t.props, r), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? zo : o;
  return et(et([], j(s ? ac(t, n, r, l) : []), !1), j(Qu(t, r, l.map(function(u) {
    return {
      data: {},
      classNames: [],
      dir: u
    };
  }), n)), !1);
}
function _n(t, e, r, n, a, i) {
  for (var o = [], s = 6; s < arguments.length; s++)
    o[s - 6] = arguments[s];
  var l = Kt(r, n), u = e ? Ct(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: ht.apply(void 0, et(["line", "direction", e ? "edge" : "", e], j(o), !1)), "data-rotation": u, "data-line-key": i, "data-direction": e, style: vn(r, n, a, l) });
}
function ec(t, e, r, n, a) {
  var i = r === !0 ? qp : r;
  return i.map(function(o, s) {
    var l = j(Bo[o], 2), u = l[0], c = l[1];
    if (c != null)
      return _n(t, o, n[u], n[c], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function rc(t) {
  return function(e, r) {
    var n = Mr(e.props, t).edge;
    return n && (n === !0 || n.length) ? et(et([], j(ec(r, t, n, e.getState().renderPoses, e.props.zoom)), !1), j(kh(e, t, r)), !1) : nc(e, t, r);
  };
}
function nc(t, e, r) {
  return tc(t, zo, e, r);
}
function kh(t, e, r) {
  return tc(t, ["nw", "ne", "sw", "se"], e, r);
}
function ac(t, e, r, n) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, u = a.renderDirectionMap, c = t.props.zoom, f = pe(l), d = s / Math.PI * 180;
  return (n || Qr(u)).map(function(h) {
    var g = Bo[h];
    if (!g)
      return null;
    var m = (Ct(d, 15) + f * Hu[h] + 720) % 180, x = ["around-control"];
    return r && x.push("direction", r), e.createElement("div", { className: ht.apply(void 0, et([], j(x), !1)), "data-rotation": m, "data-direction": h, key: "direction-around-".concat(h), style: Ga.apply(void 0, et([s, c], j(g.map(function(S) {
      return o[S];
    })), !1)) });
  });
}
function Lo(t, e, r) {
  var n = t || {}, a = n.position, i = a === void 0 ? "client" : a, o = n.left, s = o === void 0 ? -1 / 0 : o, l = n.top, u = l === void 0 ? -1 / 0 : l, c = n.right, f = c === void 0 ? 1 / 0 : c, d = n.bottom, h = d === void 0 ? 1 / 0 : d, g = {
    position: i,
    left: s,
    top: u,
    right: f,
    bottom: h
  };
  return {
    vertical: cl(g, e, !0),
    horizontal: cl(g, r, !1)
  };
}
function Ua(t, e) {
  var r = t.state, n = r.containerClientRect, a = n.clientHeight, i = n.clientWidth, o = n.clientLeft, s = n.clientTop, l = r.snapOffset, u = l.left, c = l.top, f = l.right, d = l.bottom, h = e || t.props.bounds || {}, g = h.position || "client", m = g === "css", x = h.left, S = x === void 0 ? -1 / 0 : x, C = h.top, w = C === void 0 ? -1 / 0 : C, D = h.right, k = D === void 0 ? m ? -1 / 0 : 1 / 0 : D, E = h.bottom, M = E === void 0 ? m ? -1 / 0 : 1 / 0 : E;
  return m && (k = i + f - u - k, M = a + d - c - M), {
    left: S + u - o,
    right: k + u - o,
    top: w + c - s,
    bottom: M + c - s
  };
}
function Mh(t, e, r) {
  var n = Ua(t), a = n.left, i = n.top, o = n.right, s = n.bottom, l = j(r, 2), u = l[0], c = l[1], f = j(xt(r, e), 2), d = f[0], h = f[1];
  q(d) < ve && (d = 0), q(h) < ve && (h = 0);
  var g = h > 0, m = d > 0, x = {
    isBound: !1,
    offset: 0,
    pos: 0
  }, S = {
    isBound: !1,
    offset: 0,
    pos: 0
  };
  if (d === 0 && h === 0)
    return {
      vertical: x,
      horizontal: S
    };
  if (d === 0)
    g ? s < c && (S.pos = s, S.offset = c - s) : i > c && (S.pos = i, S.offset = c - i);
  else if (h === 0)
    m ? o < u && (x.pos = o, x.offset = u - o) : a > u && (x.pos = a, x.offset = u - a);
  else {
    var C = h / d, w = r[1] - C * u, D = 0, k = 0, E = !1;
    m && o <= u ? (D = C * o + w, k = o, E = !0) : !m && u <= a && (D = C * a + w, k = a, E = !0), E && (D < i || D > s) && (E = !1), E || (g && s <= c ? (D = s, k = (D - w) / C, E = !0) : !g && c <= i && (D = i, k = (D - w) / C, E = !0)), E && (x.isBound = !0, x.pos = k, x.offset = u - k, S.isBound = !0, S.pos = D, S.offset = c - D);
  }
  return {
    vertical: x,
    horizontal: S
  };
}
function cl(t, e, r) {
  var n = t[r ? "left" : "top"], a = t[r ? "right" : "bottom"], i = Math.min.apply(Math, et([], j(e), !1)), o = Math.max.apply(Math, et([], j(e), !1)), s = [];
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
function fl(t, e, r) {
  var n = r ? t.map(function(a) {
    return In(a, r);
  }) : t;
  return n.some(function(a) {
    return a[0] < e.left && q(a[0] - e.left) > 0.1 || a[0] > e.right && q(a[0] - e.right) > 0.1 || a[1] < e.top && q(a[1] - e.top) > 0.1 || a[1] > e.bottom && q(a[1] - e.bottom) > 0.1;
  });
}
function _h(t, e, r) {
  var n = Te(t), a = Math.sqrt(n * n - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return q(i - t[r ? 0 : 1]) - q(o - t[r ? 0 : 1]);
  }).map(function(i) {
    return Kt([0, 0], r ? [i, e] : [e, i]);
  });
}
function Th(t, e, r, n, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = Ua(t), s = o.left, l = o.top, u = o.right, c = o.bottom, f = s - n[0], d = u - n[0], h = l - n[1], g = c - n[1], m = {
    left: f,
    top: h,
    right: d,
    bottom: g
  };
  if (!fl(r, m, 0))
    return [];
  var x = [];
  return [
    [f, 0],
    [d, 0],
    [h, 1],
    [g, 1]
  ].forEach(function(S) {
    var C = j(S, 2), w = C[0], D = C[1];
    r.forEach(function(k) {
      var E = Kt([0, 0], k);
      x.push.apply(x, et([], j(_h(k, w, D).map(function(M) {
        return i + M - E;
      }).filter(function(M) {
        return !fl(e, m, M);
      }).map(function(M) {
        return Ct(M * 180 / Math.PI, ve);
      })), !1));
    });
  }), x;
}
var Ih = ["left", "right", "center"], Rh = ["top", "bottom", "middle"], dl = {
  left: "start",
  right: "end",
  center: "center",
  top: "start",
  bottom: "end",
  middle: "center"
}, cr = {
  start: "left",
  end: "right",
  center: "center"
}, fr = {
  start: "top",
  end: "bottom",
  center: "middle"
};
function Wr() {
  return {
    left: !1,
    top: !1,
    right: !1,
    bottom: !1
  };
}
function rn(t, e) {
  var r = t.props, n = r.snappable, a = r.bounds, i = r.innerBounds, o = r.verticalGuidelines, s = r.horizontalGuidelines, l = r.snapGridWidth, u = r.snapGridHeight, c = t.state, f = c.guidelines, d = c.enableSnap;
  return !n || !d || e && n !== !0 && n.indexOf(e) < 0 ? !1 : !!(l || u || a || i || f && f.length || o && o.length || s && s.length);
}
function Wo(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function Ph(t, e) {
  var r = Wo(t), n = {};
  for (var a in r)
    a in e && r[a] && (n[a] = e[a]);
  return n;
}
function Yo(t, e) {
  var r = Ph(t, e), n = Rh.filter(function(i) {
    return i in r;
  }), a = Ih.filter(function(i) {
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
function Oh(t, e, r) {
  var n = Yt(t, [e.clientLeft, e.clientTop], r);
  return [
    e.left + n[0],
    e.top + n[1]
  ];
}
function jh(t) {
  var e = j(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  Math.abs(a) < ne && (a = 0), Math.abs(i) < ne && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * r[0] - r[1]) : (s = 1, l = -r[1]) : (o = -1, l = r[0]), [o, s, l].map(function(u) {
    return Ct(u, ne);
  });
}
var ic = "snapRotationThreshold", oc = "snapRotationDegrees", sc = "snapHorizontalThreshold", lc = "snapVerticalThreshold";
function Za(t, e, r, n, a, i, o) {
  var s;
  n === void 0 && (n = []), a === void 0 && (a = []);
  var l = t.props, u = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], c = Ml(o, l[sc], 5), f = Ml(i, l[lc], 5);
  return uc(t.state.guidelines, e, r, n, a, c, f, u);
}
function uc(t, e, r, n, a, i, o, s) {
  return {
    vertical: hl(t, "vertical", e, o * s[0], n),
    horizontal: hl(t, "horizontal", r, i * s[1], a)
  };
}
function Nh(t, e, r) {
  var n = j(r, 2), a = n[0], i = n[1], o = j(e, 2), s = o[0], l = o[1], u = j(xt(r, e), 2), c = u[0], f = u[1], d = f > 0, h = c > 0;
  c = La(c), f = La(f);
  var g = {
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
      vertical: g,
      horizontal: m
    };
  var x = Za(t, c ? [a] : [], f ? [i] : [], [], [], void 0, void 0), S = x.vertical, C = x.horizontal;
  S.posInfos.filter(function(X) {
    var V = X.pos;
    return h ? V >= s : V <= s;
  }), C.posInfos.filter(function(X) {
    var V = X.pos;
    return d ? V >= l : V <= l;
  }), S.isSnap = S.posInfos.length > 0, C.isSnap = C.posInfos.length > 0;
  var w = oo(S), D = w.isSnap, k = w.guideline, E = oo(C), M = E.isSnap, _ = E.guideline, I = M ? _.pos[1] : 0, v = D ? k.pos[0] : 0;
  if (c === 0)
    M && (m.isSnap = !0, m.pos = _.pos[1], m.offset = i - m.pos);
  else if (f === 0)
    D && (g.isSnap = !0, g.pos = v, g.offset = a - v);
  else {
    var N = f / c, R = r[1] - N * a, P = 0, A = 0, B = !1;
    D ? (A = v, P = N * A + R, B = !0) : M && (P = I, A = (P - R) / N, B = !0), B && (g.isSnap = !0, g.pos = A, g.offset = a - A, m.isSnap = !0, m.pos = P, m.offset = i - P);
  }
  return {
    vertical: g,
    horizontal: m
  };
}
function or(t) {
  var e = "";
  return t === -1 || t === "top" || t === "left" ? e = "start" : t === 0 || t === "center" || t === "middle" ? e = "center" : (t === 1 || t === "right" || t === "bottom") && (e = "end"), e;
}
function pl(t, e, r, n) {
  var a = Yo(t.props.snapDirections, e), i = Za(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return or(l);
  }), a.horizontalNames.map(function(l) {
    return or(l);
  }), r, n), o = or(a.horizontalNames[i.horizontal.index]), s = or(a.verticalNames[i.vertical.index]);
  return {
    vertical: O(O({}, i.vertical), { direction: s }),
    horizontal: O(O({}, i.horizontal), { direction: o })
  };
}
function oo(t) {
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
function hl(t, e, r, n, a) {
  var i, o;
  if (a === void 0 && (a = []), !t || !t.length)
    return {
      isSnap: !1,
      index: -1,
      direction: "",
      posInfos: []
    };
  var s = e === "vertical", l = s ? 0 : 1, u = r.map(function(f, d) {
    var h = a[d] || "", g = t.map(function(m) {
      var x = m.pos, S = f - x[l];
      return {
        offset: S,
        dist: q(S),
        guideline: m,
        direction: h
      };
    }).filter(function(m) {
      var x = m.guideline, S = m.dist, C = x.type;
      return !(C !== e || S > n);
    }).sort(function(m, x) {
      return m.dist - x.dist;
    });
    return {
      pos: f,
      index: d,
      guidelineInfos: g,
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
function zh(t, e, r, n, a) {
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
  ].forEach(function(d, h, g) {
    var m = g[h + 1] || g[0];
    i.push(d), i.push([
      (d[0] + m[0]) / 2,
      (d[1] + m[1]) / 2
    ]);
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], r) : (i.push.apply(i, et([], j(fh([
    [-1, -1],
    [1, -1],
    [-1, -1],
    [1, 1]
  ], r)), !1)), i.length > 1 && i.push([
    (i[0][0] + i[1][0]) / 2,
    (i[0][1] + i[1][1]) / 2
  ]));
  var o = i.map(function(d) {
    return ie(e, d);
  }), s = o.map(function(d) {
    return d[0];
  }), l = o.map(function(d) {
    return d[1];
  }), u = Za(t, s, l, i.map(function(d) {
    return or(d[0]);
  }), i.map(function(d) {
    return or(d[1]);
  }), n, a), c = or(i.map(function(d) {
    return d[0];
  })[u.vertical.index]), f = or(i.map(function(d) {
    return d[1];
  })[u.horizontal.index]);
  return {
    vertical: O(O({}, u.vertical), { direction: c }),
    horizontal: O(O({}, u.horizontal), { direction: f })
  };
}
function cc(t, e) {
  var r = q(t.offset), n = q(e.offset);
  return t.isBound && e.isBound ? n - r : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? n - r : t.isSnap ? -1 : e.isSnap || r < ve ? 1 : n < ve ? -1 : r - n;
}
function Aa(t, e) {
  return t.slice().sort(function(r, n) {
    var a = r.sign[e], i = n.sign[e], o = r.offset[e], s = n.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return cc({ isBound: r.isBound, isSnap: r.isSnap, offset: o }, { isBound: n.isBound, isSnap: n.isSnap, offset: s });
  })[0];
}
function Ah(t, e, r) {
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
function fc(t, e) {
  var r = $i([e[0][0], e[1][0]]), n = $i([e[0][1], e[1][1]]);
  return {
    vertical: r <= t[0],
    horizontal: n <= t[1]
  };
}
function Xo(t, e) {
  var r = j(e, 2), n = r[0], a = r[1], i = a[0] - n[0], o = a[1] - n[1];
  q(i) < ve && (i = 0), q(o) < ve && (o = 0);
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
function dc(t, e, r, n) {
  return n === void 0 && (n = ve), t.every(function(a) {
    var i = Xo(a, e), o = i <= 0;
    return o === r || q(i) <= n;
  });
}
function vl(t, e, r, n, a) {
  return a === void 0 && (a = 0), n && e - a <= t || !n && t <= r + a ? {
    isBound: !0,
    offset: n ? e - t : r - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function Bh(t, e) {
  var r = e.line, n = e.centerSign, a = e.verticalSign, i = e.horizontalSign, o = e.lineConstants, s = t.props.innerBounds;
  if (!s)
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var l = s.left, u = s.top, c = s.width, f = s.height, d = [[l, u], [l, u + f]], h = [[l, u], [l + c, u]], g = [[l + c, u], [l + c, u + f]], m = [[l, u + f], [l + c, u + f]];
  if (dc([
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
  var x = sr(r, o, h, a), S = sr(r, o, m, a), C = sr(r, o, d, i), w = sr(r, o, g, i), D = x.isBound && S.isBound, k = x.isBound || S.isBound, E = C.isBound && w.isBound, M = C.isBound || w.isBound, _ = Ur(x.offset, S.offset), I = Ur(C.offset, w.offset), v = [0, 0], N = !1, R = !1;
  return q(I) < q(_) ? (v = [_, 0], N = k, R = D) : (v = [0, I], N = M, R = E), {
    isAllBound: R,
    isVerticalBound: k,
    isHorizontalBound: M,
    isBound: N,
    offset: v
  };
}
function sr(t, e, r, n, a, i) {
  var o = j(e, 2), s = o[0], l = o[1], u = t[0], c = r[0], f = r[1], d = La(f[1] - c[1]), h = La(f[0] - c[0]), g = l, m = s, x = -s / l;
  if (h) {
    if (!d) {
      if (i && !g)
        return {
          isBound: !1,
          offset: 0
        };
      if (m) {
        var D = (c[1] - u[1]) / x + u[0];
        return vl(D, c[0], f[0], n, a);
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
    if (g) {
      var S = x * (c[0] - u[0]) + u[1];
      return vl(S, c[1], f[1], n, a);
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
function pc(t, e, r) {
  return e.map(function(n) {
    var a = Bh(t, n), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, u = n.multiple, c = He({
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
function Fh(t, e, r) {
  var n, a = Ho(t, e, [0, 0], !1).map(function(d) {
    return O(O({}, d), { multiple: d.multiple.map(function(h) {
      return q(h) * 2;
    }) });
  }), i = pc(t, a, r), o = Aa(i, 0), s = Aa(i, 1), l = 0, u = 0, c = o.isVerticalBound || s.isVerticalBound, f = o.isHorizontalBound || s.isHorizontalBound;
  return (c || f) && (n = j(uh({
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
function Gh(t, e) {
  var r = [], n = t[0], a = t[1];
  return n && a ? r.push([[0, a * 2], t, [-n, a]], [[n * 2, 0], t, [n, -a]]) : n ? (r.push([[n * 2, 0], [n, 1], [n, -1]]), e && r.push([[0, -1], [n, -1], [-n, -1]], [[0, 1], [n, 1], [-n, 1]])) : a ? (r.push([[0, a * 2], [1, a], [-1, a]]), e && r.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : r.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), r;
}
function Ho(t, e, r, n) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = Ir(i, 100, 100, o ? 4 : 3), l = ie(s, [0, 0]);
  return Gh(r, n).map(function(u) {
    var c = j(u, 3), f = c[0], d = c[1], h = c[2], g = [
      ie(s, d),
      ie(s, h)
    ], m = jh(g), x = fc(l, g), S = x.vertical, C = x.horizontal, w = Xo(l, g) <= 0;
    return {
      multiple: f,
      centerSign: w,
      verticalSign: S,
      horizontalSign: C,
      lineConstants: m,
      line: [
        ie(e, d),
        ie(e, h)
      ]
    };
  });
}
function gl(t, e, r, n) {
  var a = n ? t.map(function(i) {
    return In(i, n);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = Xo(r, i) <= 0;
    return !dc(e, i, o);
  });
}
function Lh(t) {
  var e = j(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  if (!a)
    return q(r[0]);
  if (!i)
    return q(r[1]);
  var o = i / a;
  return q((-o * r[0] + r[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function Wh(t) {
  var e = j(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
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
function Yh(t, e, r, n, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, u = i.width, c = i.height, f = s - n[0], d = s + u - n[0], h = l - n[1], g = l + c - n[1], m = [
    [f, h],
    [d, h],
    [f, g],
    [d, g]
  ], x = ie(r, [0, 0]);
  if (!gl(r, m, x, 0))
    return [];
  var S = [], C = m.map(function(w) {
    return [
      Te(w),
      Kt([0, 0], w)
    ];
  });
  return [
    [r[0], r[1]],
    [r[1], r[3]],
    [r[3], r[2]],
    [r[2], r[0]]
  ].forEach(function(w) {
    var D = Kt([0, 0], Wh(w)), k = Lh(w);
    S.push.apply(S, et([], j(C.filter(function(E) {
      var M = j(E, 1), _ = M[0];
      return _ && k <= _;
    }).map(function(E) {
      var M = j(E, 2), _ = M[0], I = M[1], v = Math.acos(_ ? k / _ : 0), N = I + v, R = I - v;
      return [
        o + N - D,
        o + R - D
      ];
    }).reduce(function(E, M) {
      return E.push.apply(E, et([], j(M), !1)), E;
    }, []).filter(function(E) {
      return !gl(e, m, x, E);
    }).map(function(E) {
      return Ct(E * 180 / Math.PI, ve);
    })), !1));
  }), S;
}
function Xh(t) {
  var e = t.props.innerBounds, r = Wr();
  if (!e)
    return {
      boundMap: r,
      vertical: [],
      horizontal: []
    };
  var n = t.getRect(), a = n.pos1, i = n.pos2, o = n.pos3, s = n.pos4, l = [a, i, o, s], u = ie(l, [0, 0]), c = e.left, f = e.top, d = e.width, h = e.height, g = [[c, f], [c, f + h]], m = [[c, f], [c + d, f]], x = [[c + d, f], [c + d, f + h]], S = [[c, f + h], [c + d, f + h]], C = Ho(t, l, [0, 0], !1), w = [], D = [];
  return C.forEach(function(k) {
    var E = k.line, M = k.lineConstants, _ = fc(u, E), I = _.horizontal, v = _.vertical, N = sr(E, M, m, v, 1, !0), R = sr(E, M, S, v, 1, !0), P = sr(E, M, g, I, 1, !0), A = sr(E, M, x, I, 1, !0);
    N.isBound && !r.top && (w.push(f), r.top = !0), R.isBound && !r.bottom && (w.push(f + h), r.bottom = !0), P.isBound && !r.left && (D.push(c), r.left = !0), A.isBound && !r.right && (D.push(c + d), r.right = !0);
  }), {
    boundMap: r,
    horizontal: w,
    vertical: D
  };
}
function Hh(t, e, r, n) {
  var a = e[0] - t[0], i = e[1] - t[1];
  if (q(a) < ne && (a = 0), q(i) < ne && (i = 0), !a)
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
function so(t, e, r, n, a) {
  var i = Hh(t, e, r, n);
  if (!i)
    return {
      isOutside: !1,
      offset: [0, 0]
    };
  var o = Ye(t, e), s = Ye(i, t), l = Ye(i, e), u = s > o || l > o, c = j(He({
    datas: a,
    distX: i[0],
    distY: i[1]
  }), 2), f = c[0], d = c[1];
  return {
    offset: [f, d],
    isOutside: u
  };
}
function Ba(t, e) {
  return t.isBound ? t.offset : e.isSnap ? oo(e).offset : 0;
}
function $h(t, e, r, n, a) {
  var i = j(e, 2), o = i[0], s = i[1], l = j(r, 2), u = l[0], c = l[1], f = j(n, 2), d = f[0], h = f[1], g = j(a, 2), m = g[0], x = g[1], S = -m, C = -x;
  if (t && o && s) {
    S = 0, C = 0;
    var w = [];
    if (u && c ? w.push([0, x], [m, 0]) : u ? w.push([m, 0]) : c ? w.push([0, x]) : d && h ? w.push([0, x], [m, 0]) : d ? w.push([m, 0]) : h && w.push([0, x]), w.length) {
      w.sort(function(M, _) {
        return Te(xt([o, s], M)) - Te(xt([o, s], _));
      });
      var D = w[0];
      if (D[0] && q(o) > ne)
        S = -D[0], C = s * q(o + S) / q(o) - s;
      else if (D[1] && q(s) > ne) {
        var k = s;
        C = -D[1], S = o * q(s + C) / q(k) - o;
      }
      if (t && c && u)
        if (q(S) > ne && q(S) < q(m)) {
          var E = q(m) / q(S);
          S *= E, C *= E;
        } else if (q(C) > ne && q(C) < q(x)) {
          var E = q(x) / q(C);
          S *= E, C *= E;
        } else
          S = Ur(-m, S), C = Ur(-x, C);
    }
  } else
    S = o || u ? -m : 0, C = s || c ? -x : 0;
  return [S, C];
}
function qh(t, e, r, n, a, i) {
  if (!rn(t, "draggable"))
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
  var o = Vo(i.absolutePoses, [e, r]), s = Me(o), l = s.left, u = s.right, c = s.top, f = s.bottom, d = {
    horizontal: o.map(function(A) {
      return A[1];
    }),
    vertical: o.map(function(A) {
      return A[0];
    })
  }, h = Wo(t.props.snapDirections), g = Yo(h, {
    left: l,
    right: u,
    top: c,
    bottom: f,
    center: (l + u) / 2,
    middle: (c + f) / 2
  }), m = Ja(t, a, g, d), x = m.vertical, S = m.horizontal, C = Fh(t, o, i), w = C.vertical, D = C.horizontal, k = x.isSnap, E = S.isSnap, M = x.isBound || w.isBound, _ = S.isBound || D.isBound, I = Ur(x.offset, w.offset), v = Ur(S.offset, D.offset), N = j($h(n, [e, r], [M, _], [k, E], [I, v]), 2), R = N[0], P = N[1];
  return [
    {
      isBound: M,
      isSnap: k,
      offset: R
    },
    {
      isBound: _,
      isSnap: E,
      offset: P
    }
  ];
}
function Ja(t, e, r, n) {
  n === void 0 && (n = r);
  var a = Lo(Ua(t), n.vertical, n.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : Za(t, r.vertical, r.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, u = s.vertical, c = Ba(i[0], l), f = Ba(o[0], u), d = q(c), h = q(f);
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
function ml(t, e, r, n, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = Lo(e, r, n), l = s.horizontal, u = s.vertical, c = uc(t, r, n, [], [], a, i, o), f = c.horizontal, d = c.vertical, h = Ba(l[0], f), g = Ba(u[0], d), m = q(h), x = q(g);
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
      offset: g,
      dist: x,
      bounds: u,
      snap: d
    }
  };
}
function Vh(t, e, r, n) {
  var a = Kt(t, e) / Math.PI * 180, i = r.vertical, o = i.isBound, s = i.isSnap, l = i.dist, u = r.horizontal, c = u.isBound, f = u.isSnap, d = u.dist, h = a % 180, g = h < 3 || h > 177, m = h > 87 && h < 93;
  return d < l && (o || s && !m && (!n || !g)) ? "vertical" : c || f && !g && (!n || !m) ? "horizontal" : "";
}
function Kh(t, e, r, n, a, i) {
  return r.map(function(o) {
    var s = j(o, 2), l = s[0], u = s[1], c = ie(e, l), f = ie(e, u), d = n ? Uh(t, c, f, a) : Ja(t, a, {
      vertical: [f[0]],
      horizontal: [f[1]]
    }), h = d.horizontal, g = h.offset, m = h.isBound, x = h.isSnap, S = d.vertical, C = S.offset, w = S.isBound, D = S.isSnap, k = xt(u, l);
    if (!C && !g)
      return {
        isBound: w || m,
        isSnap: D || x,
        sign: k,
        offset: [0, 0]
      };
    var E = Vh(c, f, d, n);
    if (!E)
      return {
        sign: k,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var M = E === "vertical", _ = [0, 0];
    return !n && q(u[0]) === 1 && q(u[1]) === 1 && l[0] !== u[0] && l[1] !== u[1] ? _ = He({
      datas: i,
      distX: -C,
      distY: -g
    }) : _ = so(c, f, -(M ? C : g), M, i).offset, _ = _.map(function(I, v) {
      return I * (k[v] ? 2 / k[v] : 0);
    }), {
      sign: k,
      isBound: M ? w : m,
      isSnap: M ? D : x,
      offset: _
    };
  });
}
function xl(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function Uh(t, e, r, n) {
  var a = Mh(t, e, r), i = a.horizontal, o = a.vertical, s = n ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : Nh(t, e, r), l = s.horizontal, u = s.vertical, c = xl(i, l), f = xl(o, u), d = q(c), h = q(f);
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
function Zh(t, e, r, n, a) {
  var i = [-r[0], -r[1]], o = t.state, s = o.width, l = o.height, u = t.props.bounds, c = 1 / 0, f = 1 / 0;
  if (u) {
    var d = [
      [r[0], -r[1]],
      [-r[0], r[1]]
    ], h = u.left, g = h === void 0 ? -1 / 0 : h, m = u.top, x = m === void 0 ? -1 / 0 : m, S = u.right, C = S === void 0 ? 1 / 0 : S, w = u.bottom, D = w === void 0 ? 1 / 0 : w;
    d.forEach(function(k) {
      var E = k[0] !== i[0], M = k[1] !== i[1], _ = ie(e, k), I = Kt(n, _) * 360 / Math.PI;
      if (M) {
        var v = _.slice();
        (q(I - 360) < 2 || q(I - 180) < 2) && (v[1] = n[1]);
        var N = so(n, v, (n[1] < _[1] ? D : x) - _[1], !1, a), R = j(N.offset, 2), P = R[1], A = N.isOutside;
        isNaN(P) || (f = l + (A ? 1 : -1) * q(P));
      }
      if (E) {
        var v = _.slice();
        (q(I - 90) < 2 || q(I - 270) < 2) && (v[0] = n[0]);
        var B = so(n, v, (n[0] < _[0] ? C : g) - _[0], !0, a), X = j(B.offset, 1), V = X[0], G = B.isOutside;
        isNaN(V) || (c = s + (G ? 1 : -1) * q(V));
      }
    });
  }
  return {
    maxWidth: c,
    maxHeight: f
  };
}
var de = {
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
    var c = Te(u), f = Kt(u, [0, 0]);
    return [e.createElement("div", { className: ht("line", "horizontal", "dragline", "dashed"), key: "dragRotateGuideline", style: {
      width: "".concat(c, "px"),
      transform: "translate(".concat(l[0], "px, ").concat(l[1], "px) rotate(").concat(f, "rad) scaleY(").concat(i, ")")
    } })];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.parentEvent, a = e.parentGesto, i = t.state, o = i.gestos, s = i.style;
    if (o.draggable)
      return !1;
    o.draggable = a || t.targetGesto, r.datas = {}, r.left = parseFloat(s.left || "") || 0, r.top = parseFloat(s.top || "") || 0, r.bottom = parseFloat(s.bottom || "") || 0, r.right = parseFloat(s.right || "") || 0, r.startValue = [0, 0], Tr(t, e), Ka(t, e, "translate"), gv(t, r), r.prevDist = [0, 0], r.prevBeforeDist = [0, 0], r.isDrag = !1, r.deltaOffset = [0, 0];
    var l = Et(t, e, O({ set: function(c) {
      r.startValue = c;
    } }, Va(t, e))), u = n || ct(t, "onDragStart", l);
    return u !== !1 ? (r.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, r.isPinch = !1), r.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      $a(t, e, "translate");
      var r = e.datas, n = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, u = e.isGroup, c = e.parentThrottleDrag, f = e.distX, d = e.distY, h = r.isDrag, g = r.prevDist, m = r.prevBeforeDist, x = r.startValue;
      if (h) {
        o && (f += o[0], d += o[1]);
        var S = t.props, C = S.parentMoveable, w = u ? 0 : S.throttleDrag || c || 0, D = n ? 0 : S.throttleDragRotate || 0, k = 0, E = !1, M = !1, _ = !1, I = !1;
        if (!n && D > 0 && (f || d)) {
          var v = S.startDragRotate || 0, N = Ct(v + Kt([0, 0], [f, d]) * 180 / Math.PI, D) - v, R = d * Math.abs(Math.cos((N - 90) / 180 * Math.PI)), P = f * Math.abs(Math.cos(N / 180 * Math.PI)), A = Te([P, R]);
          k = N * Math.PI / 180, f = A * Math.cos(k), d = A * Math.sin(k);
        }
        if (!i && !n && !a) {
          var B = j(qh(t, f, d, D, !s && l || o, r), 2), X = B[0], V = B[1];
          E = X.isSnap, M = X.isBound, _ = V.isSnap, I = V.isBound;
          var G = X.offset, K = V.offset;
          f += G, d += K;
        }
        var U = Rt(Vu({ datas: r, distX: f, distY: d }), x), L = Rt(lh({ datas: r, distX: f, distY: d }), x);
        il(L, ve), il(U, ve), D || (!E && !M && (L[0] = Ct(L[0], w), U[0] = Ct(U[0], w)), !_ && !I && (L[1] = Ct(L[1], w), U[1] = Ct(U[1], w)));
        var rt = xt(U, x), nt = xt(L, x), tt = xt(nt, g), at = xt(rt, m);
        r.prevDist = nt, r.prevBeforeDist = rt, r.passDelta = tt, r.passDist = nt;
        var J = r.left + rt[0], ot = r.top + rt[1], ft = r.right - rt[0], bt = r.bottom - rt[1], pt = qa(r, "translate(".concat(L[0], "px, ").concat(L[1], "px)"), "translate(".concat(nt[0], "px, ").concat(nt[1], "px)"));
        if (Fo(e, pt), t.state.dragInfo.dist = n ? [0, 0] : nt, !(!n && !C && tt.every(function(gt) {
          return !gt;
        }) && at.some(function(gt) {
          return !gt;
        }))) {
          var H = t.state, ut = H.width, Dt = H.height, vt = Et(t, e, O({ transform: pt, dist: nt, delta: tt, translate: L, beforeDist: rt, beforeDelta: at, beforeTranslate: U, left: J, top: ot, right: ft, bottom: bt, width: ut, height: Dt, isPinch: i }, he({
            transform: pt
          }, e)));
          return !n && ct(t, "onDrag", vt), vt;
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
      return !r && ct(t, "onDragEnd", a), a;
    }
  },
  dragGroupStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = this.dragStart(t, e);
    if (!s)
      return !1;
    var l = ki(t, this, "dragStart", [
      i || 0,
      o || 0
    ], e, !1, "draggable"), u = l.childEvents, c = l.eventParams, f = O(O({}, s), { targets: t.props.targets, events: c }), d = ct(t, "onDragGroupStart", f);
    a.isDrag = d !== !1;
    var h = (n = (r = u[0]) === null || r === void 0 ? void 0 : r.datas.startValue) !== null && n !== void 0 ? n : [0, 0];
    return a.throttleOffset = [h[0] % 1, h[1] % 1], a.isDrag ? s : !1;
  },
  dragGroup: function(t, e) {
    var r = e.datas;
    if (r.isDrag) {
      var n = this.drag(t, O(O({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = ki(t, this, "drag", a, e, !1, "draggable").eventParams;
      if (n) {
        var o = O({ targets: t.props.targets, events: i }, n);
        return ct(t, "onDragGroup", o), o;
      }
    }
  },
  dragGroupEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isDrag) {
      this.dragEnd(t, e);
      var a = ki(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
      return ct(t, "onDragGroupEnd", Se(t, e, {
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
function hc(t, e) {
  var r = ie(t, e), n = [0, 0];
  return {
    fixedPosition: r,
    fixedDirection: e,
    fixedOffset: n
  };
}
function Jh(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = [
    a / 2 * (1 + e[0]),
    i / 2 * (1 + e[1])
  ], l = Yt(r, s, o), u = [0, 0];
  return {
    fixedPosition: l,
    fixedDirection: e,
    fixedOffset: u
  };
}
function vc(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = gh(e, a, i), l = Yt(r, e, o), u = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: u
  };
}
var yl = Zo("resizable"), lo = {
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
  render: rc("resizable"),
  dragControlCondition: yl,
  viewClassName: Uo("resizable"),
  dragControlStart: function(t, e) {
    var r, n = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, u = e.parentFixedDirection, c = e.parentEvent, f = _c(o, a, n, l), d = t.state, h = d.target, g = d.width, m = d.height, x = d.gestos;
    if (!f || !h || x.resizable)
      return !1;
    x.resizable = s || t.controlGesto, !a && Tr(t, e), l.datas = {}, l.direction = f, l.startOffsetWidth = g, l.startOffsetHeight = m, l.prevWidth = 0, l.prevHeight = 0, l.minSize = [0, 0], l.startWidth = d.inlineCSSWidth || d.cssWidth, l.startHeight = d.inlineCSSHeight || d.cssHeight, l.maxSize = [1 / 0, 1 / 0], i || (l.minSize = [
      d.minOffsetWidth,
      d.minOffsetHeight
    ], l.maxSize = [
      d.maxOffsetWidth,
      d.maxOffsetHeight
    ]);
    var S = t.props.transformOrigin || "% %";
    l.transformOrigin = _e(S) ? S.split(" ") : S, l.startOffsetMatrix = d.offsetMatrix, l.startTransformOrigin = d.transformOrigin, l.isWidth = (r = e == null ? void 0 : e.parentIsWidth) !== null && r !== void 0 ? r : !f[0] && !f[1] || f[0] || !f[1];
    function C(I) {
      l.ratio = I && isFinite(I) ? I : 0;
    }
    l.startPositions = Ie(t.state);
    function w(I) {
      var v = hc(l.startPositions, I);
      l.fixedDirection = v.fixedDirection, l.fixedPosition = v.fixedPosition, l.fixedOffset = v.fixedOffset;
    }
    function D(I) {
      var v = vc(t.state, I);
      l.fixedDirection = v.fixedDirection, l.fixedPosition = v.fixedPosition, l.fixedOffset = v.fixedOffset;
    }
    function k(I) {
      l.minSize = [
        jt("".concat(I[0]), 0) || 0,
        jt("".concat(I[1]), 0) || 0
      ];
    }
    function E(I) {
      var v = [
        I[0] || 1 / 0,
        I[1] || 1 / 0
      ];
      (!Dn(v[0]) || isFinite(v[0])) && (v[0] = jt("".concat(v[0]), 0) || 1 / 0), (!Dn(v[1]) || isFinite(v[1])) && (v[1] = jt("".concat(v[1]), 0) || 1 / 0), l.maxSize = v;
    }
    C(g / m), w(u || [-f[0], -f[1]]), l.setFixedDirection = w, l.setFixedPosition = D, l.setMin = k, l.setMax = E;
    var M = Et(t, e, {
      direction: f,
      startRatio: l.ratio,
      set: function(I) {
        var v = j(I, 2), N = v[0], R = v[1];
        l.startWidth = N, l.startHeight = R;
      },
      setMin: k,
      setMax: E,
      setRatio: C,
      setFixedDirection: w,
      setFixedPosition: D,
      setOrigin: function(I) {
        l.transformOrigin = I;
      },
      dragStart: de.dragStart(t, new Vr().dragStart([0, 0], e))
    }), _ = c || ct(t, "onResizeStart", M);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, _ !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: f
    }), l.isResize ? M : !1;
  },
  dragControl: function(t, e) {
    var r, n = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, u = e.useSnap, c = e.isRequest, f = e.isGroup, d = e.parentEvent, h = e.resolveMatrix, g = n.isResize, m = n.transformOrigin, x = n.startWidth, S = n.startHeight, C = n.prevWidth, w = n.prevHeight, D = n.minSize, k = n.maxSize, E = n.ratio, M = n.startOffsetWidth, _ = n.startOffsetHeight, I = n.isWidth;
    if (!g)
      return;
    if (h) {
      var v = t.state.is3d, N = n.startOffsetMatrix, R = n.startTransformOrigin, P = v ? 4 : 3, A = $r(Na(e)), B = Math.sqrt(A.length);
      P !== B && (A = Be(A, B, P));
      var X = zn(N, A, R, P), V = Ir(X, M, _, P);
      n.startPositions = V, n.nextTargetMatrix = A, n.nextAllMatrix = X;
    }
    var G = Mr(t.props, "resizable"), K = G.resizeFormat, U = G.throttleResize, L = U === void 0 ? a ? 0 : 1 : U, rt = G.parentMoveable, nt = G.keepRatioFinally, tt = n.direction, at = tt, J = 0, ot = 0;
    !tt[0] && !tt[1] && (at = [1, 1]);
    var ft = E && (o ?? G.keepRatio) || !1;
    function bt() {
      var zt = n.fixedDirection, At = jc(at, ft, n, e);
      J = At.distWidth, ot = At.distHeight;
      var Ut = at[0] - zt[0] || ft ? Math.max(M + J, ve) : M, Ce = at[1] - zt[1] || ft ? Math.max(_ + ot, ve) : _;
      return ft && M && _ && (I ? Ce = Ut / E : Ut = Ce * E), [Ut, Ce];
    }
    var pt = j(bt(), 2), H = pt[0], ut = pt[1];
    d || (n.setFixedDirection(n.fixedDirection), ct(t, "onBeforeResize", Et(t, e, {
      startFixedDirection: n.startFixedDirection,
      startFixedPosition: n.startFixedPosition,
      setFixedDirection: function(zt) {
        var At;
        return n.setFixedDirection(zt), At = j(bt(), 2), H = At[0], ut = At[1], [H, ut];
      },
      setFixedPosition: function(zt) {
        var At;
        return n.setFixedPosition(zt), At = j(bt(), 2), H = At[0], ut = At[1], [H, ut];
      },
      boundingWidth: H,
      boundingHeight: ut,
      setSize: function(zt) {
        var At;
        At = j(zt, 2), H = At[0], ut = At[1];
      }
    }, !0)));
    var Dt = s;
    s || (!a && i ? Dt = bh(t, [0, 0]) : Dt = n.fixedPosition);
    var vt = [0, 0];
    i || (vt = hv(t, H, ut, tt, Dt, !u && c, n)), l && (!l[0] && (vt[0] = 0), !l[1] && (vt[1] = 0));
    function gt() {
      var zt;
      K && (zt = j(K([H, ut]), 2), H = zt[0], ut = zt[1]), H = Ct(H, L), ut = Ct(ut, L);
    }
    if (ft) {
      at[0] && at[1] && vt[0] && vt[1] && (q(vt[0]) > q(vt[1]) ? vt[1] = 0 : vt[0] = 0);
      var mt = !vt[0] && !vt[1];
      mt && gt(), at[0] && !at[1] || vt[0] && !vt[1] || mt && I ? (H += vt[0], ut = H / E) : (!at[0] && at[1] || !vt[0] && vt[1] || mt && !I) && (ut += vt[1], H = ut * E);
    } else
      H += vt[0], ut += vt[1], H = Math.max(0, H), ut = Math.max(0, ut);
    r = j(_o([H, ut], D, k, ft ? E : !1), 2), H = r[0], ut = r[1], gt(), ft && (f || nt) && (I ? ut = H / E : H = ut * E), J = H - M, ot = ut - _;
    var wt = [J - C, ot - w];
    n.prevWidth = J, n.prevHeight = ot;
    var Mt = yh(t, H, ut, Dt, m, n);
    if (!(!rt && wt.every(function(zt) {
      return !zt;
    }) && Mt.every(function(zt) {
      return !zt;
    }))) {
      var St = de.drag(t, Nn(e, t.state, Mt, !!i, !1, "draggable")), dt = St.transform, Tt = x + J, Xt = S + ot, Ht = Et(t, e, O({ width: Tt, height: Xt, offsetWidth: Math.round(H), offsetHeight: Math.round(ut), startRatio: E, boundingWidth: H, boundingHeight: ut, direction: tt, dist: [J, ot], delta: wt, isPinch: !!i, drag: St }, Ic({
        style: {
          width: "".concat(Tt, "px"),
          height: "".concat(Xt, "px")
        },
        transform: dt
      }, St, e)));
      return !d && ct(t, "onResize", Ht), Ht;
    }
  },
  dragControlAfter: function(t, e) {
    var r = e.datas, n = r.isResize, a = r.startOffsetWidth, i = r.startOffsetHeight, o = r.prevWidth, s = r.prevHeight;
    if (!(!n || t.props.checkResizableError === !1)) {
      var l = t.state, u = l.width, c = l.height, f = u - (a + o), d = c - (i + s), h = q(f) > 3, g = q(d) > 3;
      if (h && (r.startWidth += f, r.startOffsetWidth += f, r.prevWidth += f), g && (r.startHeight += d, r.startOffsetHeight += d, r.prevHeight += d), h || g)
        return this.dragControl(t, e);
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.parentEvent;
    if (r.isResize) {
      r.isResize = !1;
      var a = Se(t, e, {});
      return !n && ct(t, "onResizeEnd", a), a;
    }
  },
  dragGroupControlCondition: yl,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, O(O({}, e), { isGroup: !0 }));
    if (!n)
      return !1;
    var a = ze(t, "resizable", e), i = r.startOffsetWidth, o = r.startOffsetHeight;
    function s() {
      var h = r.minSize;
      a.forEach(function(g) {
        var m = g.datas, x = m.minSize, S = m.startOffsetWidth, C = m.startOffsetHeight, w = i * (S ? x[0] / S : 0), D = o * (C ? x[1] / C : 0);
        h[0] = Math.max(h[0], w), h[1] = Math.max(h[1], D);
      });
    }
    function l() {
      var h = r.maxSize;
      a.forEach(function(g) {
        var m = g.datas, x = m.maxSize, S = m.startOffsetWidth, C = m.startOffsetHeight, w = i * (S ? x[0] / S : 0), D = o * (C ? x[1] / C : 0);
        h[0] = Math.min(h[0], w), h[1] = Math.min(h[1], D);
      });
    }
    var u = Ze(t, this, "dragControlStart", e, function(h, g) {
      return za(t, h, r, g);
    });
    s(), l();
    var c = function(h) {
      n.setFixedDirection(h), u.forEach(function(g, m) {
        g.setFixedDirection(h), za(t, g.moveable, r, a[m]);
      });
    };
    r.setFixedDirection = c;
    var f = O(O({}, n), { targets: t.props.targets, events: u.map(function(h) {
      return O(O({}, h), { setMin: function(g) {
        h.setMin(g), s();
      }, setMax: function(g) {
        h.setMax(g), l();
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
      var n = Mr(t.props, "resizable");
      ti(t, "onBeforeResize", function(h) {
        ct(t, "onBeforeResizeGroup", Et(t, e, O(O({}, h), { targets: n.targets }), !0));
      });
      var a = this.dragControl(t, O(O({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = n.keepRatio, u = [
          i / (i - s[0]),
          o / (o - s[1])
        ], c = r.fixedPosition, f = Ze(t, this, "dragControl", e, function(h, g) {
          var m = j(ce(Rn(t.rotation / 180 * Math.PI, 3), [
            g.datas.originalX * u[0],
            g.datas.originalY * u[1],
            1
          ], 3), 2), x = m[0], S = m[1];
          return O(O({}, g), { parentDist: null, parentScale: u, dragClient: Rt(c, [x, S]), parentKeepRatio: l });
        }), d = O({ targets: n.targets, events: f }, a);
        return ct(t, "onResizeGroup", d), d;
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
function Mi(t, e, r, n, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, u = Yt(
    t.state.rootMatrix,
    // TO-DO #710
    xt([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), c = Rt([a.left, a.top], u);
  e.startAbsoluteOrigin = c, e.prevDeg = Kt(c, [r, n]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = Ye(c, [r, n]);
}
function wa(t, e, r) {
  var n = r.defaultDeg, a = r.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - n);
  return r.prevDeg = n + s, s;
}
function _i(t, e, r, n) {
  return wa(Kt(n.startAbsoluteOrigin, [t, e]) / Math.PI * 180, r, n);
}
function Ti(t, e, r, n, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = r.prevSnapDeg, u = 0, c = !1;
  if (i) {
    var f = pv(t, e, n, a + n);
    c = f.isSnap, u = a + f.dist;
  }
  c || (u = Ct(a + n, s));
  var d = u - a;
  return r.prevSnapDeg = d, [d - l, d, u];
}
function gc(t, e, r) {
  var n = j(e, 4), a = n[0], i = n[1], o = n[2], s = n[3];
  if (t === "none")
    return [];
  if (Vt(t))
    return t.map(function(x) {
      return gc(x, [a, i, o, s], r)[0];
    });
  var l = j((t || "top").split("-"), 2), u = l[0], c = l[1], f = [a, i];
  u === "left" ? f = [o, a] : u === "right" ? f = [i, s] : u === "bottom" && (f = [s, o]);
  var d = [
    (f[0][0] + f[1][0]) / 2,
    (f[0][1] + f[1][1]) / 2
  ], h = kc(f, r);
  if (c) {
    var g = c === "top" || c === "left", m = u === "bottom" || u === "left";
    d = f[g && !m || !g && m ? 0 : 1];
  }
  return [[d, h]];
}
function uo(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var r = e.inputEvent.target;
  if (ae(r, ht("rotation-control")) || t.props.rotateAroundControls && ae(r, ht("around-control")) || ae(r, ht("control")) && ae(r, ht("rotatable")))
    return !0;
  var n = t.props.rotationTarget;
  return n ? Jo(n, !0).some(function(a) {
    return a ? r === a || r.contains(a) : !1;
  }) : !1;
}
var Qh = `.rotation {
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
`, tv = {
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
  css: [Qh],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? ht("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var r = Mr(t.props, "rotatable"), n = r.rotatable, a = r.rotationPosition, i = r.zoom, o = r.renderDirections, s = r.rotateAroundControls, l = r.resolveAblesWithRotatable, u = t.getState(), c = u.renderPoses, f = u.direction;
    if (!n)
      return null;
    var d = gc(a, c, f), h = [];
    if (d.forEach(function(S, C) {
      var w = j(S, 2), D = w[0], k = w[1];
      h.push(e.createElement(
        "div",
        { key: "rotation".concat(C), className: ht("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(D[0], "px, ").concat(D[1], "px) rotate(").concat(k, "rad)")
        } },
        e.createElement("div", { className: ht("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: ht("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var g = Qr(l || {}), m = {};
      g.forEach(function(S) {
        l[S].forEach(function(C) {
          m[C] = S;
        });
      });
      var x = [];
      Vt(o) && (x = o.map(function(S) {
        var C = m[S];
        return {
          data: C ? { resolve: C } : {},
          classNames: C ? ["move"] : [],
          dir: S
        };
      })), h.push.apply(h, et([], j(Qu(t, "rotatable", x, e)), !1));
    }
    return s && h.push.apply(h, et([], j(ac(t, e)), !1)), h;
  },
  dragControlCondition: uo,
  dragControlStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, u = e.isPinch, c = e.isRequest, f = t.state, d = f.target, h = f.left, g = f.top, m = f.direction, x = f.beforeDirection, S = f.targetTransform, C = f.moveableClientRect, w = f.offsetMatrix, D = f.targetMatrix, k = f.allMatrix, E = f.width, M = f.height;
    if (!c && !d)
      return !1;
    var _ = t.getRect();
    a.rect = _, a.transform = S, a.left = h, a.top = g;
    var I = function(at) {
      var J = vc(t.state, at);
      a.fixedDirection = J.fixedDirection, a.fixedOffset = J.fixedOffset, a.fixedPosition = J.fixedPosition, L && L.setFixedPosition(at);
    }, v = function(at) {
      var J = Jh(t.state, at);
      a.fixedDirection = J.fixedDirection, a.fixedOffset = J.fixedOffset, a.fixedPosition = J.fixedPosition, L && L.setFixedDirection(at);
    }, N = i, R = o;
    if (c || u || l) {
      var P = s || 0;
      a.beforeInfo = {
        origin: _.beforeOrigin,
        prevDeg: P,
        defaultDeg: P,
        prevSnapDeg: 0,
        startDist: 0
      }, a.afterInfo = O(O({}, a.beforeInfo), { origin: _.origin }), a.absoluteInfo = O(O({}, a.beforeInfo), { origin: _.origin, startValue: P });
    } else {
      var A = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
      if (A) {
        var B = A.getAttribute("data-direction") || "", X = ih[B];
        if (X) {
          a.isControl = !0, a.isAroundControl = ae(A, ht("around-control")), a.controlDirection = X;
          var V = A.getAttribute("data-resolve");
          V && (a.resolveAble = V);
          var G = Tv(f.rootMatrix, f.renderPoses, C);
          r = j(ie(G, X), 2), N = r[0], R = r[1];
        }
      }
      a.beforeInfo = { origin: _.beforeOrigin }, a.afterInfo = { origin: _.origin }, a.absoluteInfo = {
        origin: _.origin,
        startValue: _.rotation
      };
      var K = I;
      I = function(at) {
        var J = f.is3d ? 4 : 3, ot = j(Rt(Ru(D, J), at), 2), ft = ot[0], bt = ot[1], pt = ce(w, Er([ft, bt], J)), H = ce(k, Er([at[0], at[1]], J));
        K(at);
        var ut = f.posDelta;
        a.beforeInfo.origin = xt(pt, ut), a.afterInfo.origin = xt(H, ut), a.absoluteInfo.origin = xt(H, ut), Mi(t, a.beforeInfo, N, R, C), Mi(t, a.afterInfo, N, R, C), Mi(t, a.absoluteInfo, N, R, C);
      }, v = function(at) {
        var J = ie([
          [0, 0],
          [E, 0],
          [0, M],
          [E, M]
        ], at);
        I(J);
      };
    }
    a.startClientX = N, a.startClientY = R, a.direction = m, a.beforeDirection = x, a.startValue = 0, a.datas = {}, Ka(t, e, "rotate");
    var U = !1, L = !1;
    if (a.isControl && a.resolveAble) {
      var rt = a.resolveAble;
      rt === "resizable" && (L = lo.dragControlStart(t, O(O({}, new Vr("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    L || (U = de.dragStart(t, new Vr().dragStart([0, 0], e))), I(Iv(t));
    var nt = Et(t, e, O(O({ set: function(at) {
      a.startValue = at * Math.PI / 180;
    }, setFixedDirection: v, setFixedPosition: I }, Va(t, e)), { dragStart: U, resizeStart: L })), tt = ct(t, "onRotateStart", nt);
    return a.isRotate = tt !== !1, f.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? nt : !1;
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, u = e.parentFlag, c = e.isPinch, f = e.groupDelta, d = e.resolveMatrix, h = i.beforeDirection, g = i.beforeInfo, m = i.afterInfo, x = i.absoluteInfo, S = i.isRotate, C = i.startValue, w = i.rect, D = i.startClientX, k = i.startClientY;
    if (S) {
      $a(t, e, "rotate");
      var E = sh(e), M = h * E, _ = t.props.parentMoveable, I = 0, v, N, R = 0, P, A, B = 0, X, V, G = 180 / Math.PI * C, K = x.startValue, U = !1, L = D + o, rt = k + s;
      if (!u && "parentDist" in e) {
        var nt = e.parentDist;
        v = nt, P = nt, X = nt;
      } else c || u ? (v = wa(l, h, g), P = wa(l, M, m), X = wa(l, M, x)) : (v = _i(L, rt, h, g), P = _i(L, rt, M, m), X = _i(L, rt, M, x), U = !0);
      if (N = G + v, A = G + P, V = K + X, ct(t, "onBeforeRotate", Et(t, e, {
        beforeRotation: N,
        rotation: A,
        absoluteRotation: V,
        setRotation: function(Dt) {
          P = Dt - G, v = P, X = P;
        }
      }, !0)), r = j(Ti(t, w, g, v, G, U), 3), I = r[0], v = r[1], N = r[2], n = j(Ti(t, w, m, P, G, U), 3), R = n[0], P = n[1], A = n[2], a = j(Ti(t, w, x, X, K, U), 3), B = a[0], X = a[1], V = a[2], !(!B && !R && !I && !_ && !d)) {
        var tt = qa(i, "rotate(".concat(A, "deg)"), "rotate(".concat(P, "deg)"));
        d && (i.fixedPosition = Go(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var at = xh(t, P, i), J = xt(Rt(f || [0, 0], at), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = at, i.requestValue = null;
        var ot = Uu(t, tt, J, c, e), ft = ot, bt = Ye([L, rt], x.startAbsoluteOrigin) - x.startDist, pt = void 0;
        if (i.resolveAble === "resizable") {
          var H = lo.dragControl(t, O(O({}, Nn(e, t.state, [e.deltaX, e.deltaY], !!c, !1, "resizable")), { resolveMatrix: !0, parentDistance: bt }));
          H && (pt = H, ft = Ic(ft, H, e));
        }
        var ut = Et(t, e, O(O({ delta: R, dist: P, rotate: A, rotation: A, beforeDist: v, beforeDelta: I, beforeRotate: N, beforeRotation: N, absoluteDist: X, absoluteDelta: B, absoluteRotate: V, absoluteRotation: V, isPinch: !!c, resize: pt }, ot), ft));
        return ct(t, "onRotate", ut), ut;
      }
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      r.isRotate = !1;
      var n = Se(t, e, {});
      return ct(t, "onRotateEnd", n), n;
    }
  },
  dragGroupControlCondition: uo,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = t.state, a = n.left, i = n.top, o = n.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(r.beforeDirection * t.rotation);
    var l = Ze(t, this, "dragControlStart", e, function(f, d) {
      var h = f.state, g = h.left, m = h.top, x = h.beforeOrigin, S = Rt(xt([g, m], [a, i]), xt(x, o));
      return d.datas.startGroupClient = S, d.datas.groupClient = S, O(O({}, d), { parentRotate: 0 });
    }), u = O(O({}, s), { targets: t.props.targets, events: l }), c = ct(t, "onRotateGroupStart", u);
    return r.isRotate = c !== !1, r.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      ti(t, "onBeforeRotate", function(u) {
        ct(t, "onBeforeRotateGroup", Et(t, e, O(O({}, u), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = r.beforeDirection, i = n.beforeDist, o = i / 180 * Math.PI, s = Ze(t, this, "dragControl", e, function(u, c) {
          var f = c.datas.startGroupClient, d = j(c.datas.groupClient, 2), h = d[0], g = d[1], m = j(In(f, o * a), 2), x = m[0], S = m[1], C = [x - h, S - g];
          return c.datas.groupClient = [x, S], O(O({}, c), { parentRotate: i, groupDelta: C });
        });
        t.rotation = a * n.beforeRotation;
        var l = O({ targets: t.props.targets, events: s, set: function(u) {
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
      var a = Ze(t, this, "dragControlEnd", e), i = Se(t, e, {
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
function ev(t, e) {
  var r, n = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, u = n === "horizontal", c = u ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (r = {}, r[u ? "width" : "height"] = "".concat(i), r.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(c, "(-50%) scale").concat(c, "(").concat(s, ")"), r)
  });
}
function $o(t, e) {
  return ev(O(O({}, t), { classNames: et([
    ht("line", "guideline", t.direction)
  ], j(t.classNames), !1).filter(function(r) {
    return r;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(r) {
    return "".concat(Ct(r, 0.1), "px");
  }) }), e);
}
function bl(t, e, r, n, a, i, o, s) {
  var l = t.props.zoom;
  return r.map(function(u, c) {
    var f = u.type, d = u.pos, h = [0, 0];
    return h[o] = n, h[o ? 0 : 1] = -a + d, $o({
      key: "".concat(e, "TargetGuideline").concat(c),
      classNames: [ht("target", "bold", f)],
      posValue: h,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function Sl(t, e, r, n, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, u = e === "horizontal" ? cr : fr, c = a[u.start], f = a[u.end];
  return r.filter(function(d) {
    var h = d.hide, g = d.elementRect;
    if (h)
      return !1;
    if (l && g) {
      var m = g.rect;
      if (m[u.start] <= c && f <= m[u.end])
        return !1;
    }
    return !0;
  }).map(function(d, h) {
    var g = d.pos, m = d.size, x = d.element, S = d.className, C = [
      -n[0] + g[0],
      -n[1] + g[1]
    ];
    return $o({
      key: "".concat(e, "-default-guideline-").concat(h),
      classNames: x ? [ht("bold"), S] : [ht("normal"), S],
      direction: e,
      posValue: C,
      sizeValue: m,
      zoom: s
    }, i);
  });
}
function hn(t, e, r, n, a, i, o, s) {
  var l, u = t.props, c = u.snapDigit, f = c === void 0 ? 0 : c, d = u.isDisplaySnapDigit, h = d === void 0 ? !0 : d, g = u.snapDistFormat, m = g === void 0 ? function(k, E) {
    return k;
  } : g, x = u.zoom, S = e === "horizontal" ? "X" : "Y", C = e === "vertical" ? "height" : "width", w = Math.abs(a), D = h ? parseFloat(w.toFixed(f)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(r, "-guideline-").concat(n), className: ht("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[C] = "".concat(w, "px"), l) },
    $o({
      direction: e,
      classNames: [ht(r), o],
      size: "100%",
      posValue: [0, 0],
      sizeValue: w,
      zoom: x
    }, s),
    s.createElement("div", { className: ht("size-value", "gap"), style: {
      transform: "translate".concat(S, "(-50%) scale(").concat(x, ")")
    } }, D > 0 ? m(D, e) : "")
  );
}
function rv(t, e, r, n) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? cr : fr, s = r[o.start], l = r[o.end];
  return Rc(e, function(u) {
    return u.pos[a];
  }).map(function(u) {
    var c = [], f = [], d = [];
    return u.forEach(function(h) {
      var g, m, x = h.element, S = h.elementRect.rect;
      if (S[o.end] < s)
        c.push(h);
      else if (l < S[o.start])
        f.push(h);
      else if (S[o.start] <= s && l <= S[o.end] && n) {
        var C = h.pos, w = { element: x, rect: O(O({}, S), (g = {}, g[o.end] = S[o.start], g)) }, D = { element: x, rect: O(O({}, S), (m = {}, m[o.start] = S[o.end], m)) }, k = [0, 0], E = [0, 0];
        k[a] = C[a], k[i] = C[i], E[a] = C[a], E[i] = C[i] + h.size, c.push({
          type: t,
          pos: k,
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
    }), c.sort(function(h, g) {
      return g.pos[i] - h.pos[i];
    }), f.sort(function(h, g) {
      return h.pos[i] - g.pos[i];
    }), {
      total: u,
      start: c,
      end: f,
      inner: d
    };
  });
}
function nv(t, e, r, n, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(x) {
      return x.type === s;
    }), u = s === "vertical" ? 1 : 0, c = u ? 0 : 1, f = rv(s, l, n, i), d = u ? fr : cr, h = u ? cr : fr, g = n[d.start], m = n[d.end];
    f.forEach(function(x) {
      var S = x.total, C = x.start, w = x.end, D = x.inner, k = r[c] + S[0].pos[c] - n[h.start], E = n;
      C.forEach(function(M) {
        var _ = M.elementRect.rect, I = E[d.start] - _[d.end];
        if (I > 0) {
          var v = [0, 0];
          v[u] = r[u] + E[d.start] - g - I, v[c] = k, o.push(hn(t, s, "dashed", o.length, I, v, M.className, a));
        }
        E = _;
      }), E = n, w.forEach(function(M) {
        var _ = M.elementRect.rect, I = _[d.start] - E[d.end];
        if (I > 0) {
          var v = [0, 0];
          v[u] = r[u] + E[d.end] - g, v[c] = k, o.push(hn(t, s, "dashed", o.length, I, v, M.className, a));
        }
        E = _;
      }), D.forEach(function(M) {
        var _ = M.elementRect.rect, I = g - _[d.start], v = _[d.end] - m, N = [0, 0], R = [0, 0];
        N[u] = r[u] - I, N[c] = k, R[u] = r[u] + m - g, R[c] = k, o.push(hn(t, s, "dashed", o.length, I, N, M.className, a)), o.push(hn(t, s, "dashed", o.length, v, R, M.className, a));
      });
    });
  }), o;
}
function av(t, e, r, n, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(x) {
      return x.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, u = l ? 0 : 1, c = l ? fr : cr, f = l ? cr : fr, d = n[c.start], h = n[c.end], g = n[f.start], m = n[f.end];
    s.forEach(function(x) {
      var S = x.gap, C = x.gapRects, w = Math.max.apply(Math, et([g], j(C.map(function(E) {
        var M = E.rect;
        return M[f.start];
      })), !1)), D = Math.min.apply(Math, et([m], j(C.map(function(E) {
        var M = E.rect;
        return M[f.end];
      })), !1)), k = (w + D) / 2;
      w === D || k === (g + m) / 2 || C.forEach(function(E) {
        var M = E.rect, _ = E.className, I = [r[0], r[1]];
        if (M[c.end] < d)
          I[l] += M[c.end] - d;
        else if (h < M[c.start])
          I[l] += M[c.start] - d - S;
        else
          return;
        I[u] += k - g, i.push(hn(t, l ? "vertical" : "horizontal", "gap", i.length, S, I, _, a));
      });
    });
  }), i;
}
function co(t) {
  var e, r, n = t.state, a = n.containerClientRect, i = n.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, u = a.clientHeight, c = a.clientWidth, f = a.clientLeft, d = a.clientTop, h = t.props, g = h.snapGap, m = g === void 0 ? !0 : g, x = h.verticalGuidelines, S = h.horizontalGuidelines, C = h.snapThreshold, w = C === void 0 ? 5 : C, D = h.maxSnapElementGuidelineDistance, k = D === void 0 ? 1 / 0 : D, E = h.isDisplayGridGuidelines, M = Me(Ie(t.state)), _ = M.top, I = M.left, v = M.bottom, N = M.right, R = { top: _, left: I, bottom: v, right: N, center: (I + N) / 2, middle: (_ + v) / 2 }, P = lv(t), A = et([], j(P), !1), B = ((r = (e = n.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && r !== void 0 ? r : [1, 1]).map(function(K) {
    return K * w;
  });
  m && A.push.apply(A, et([], j(iv(t, R, B)), !1));
  var X = O({}, n.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (A.push.apply(A, et([], j(sv(t, o ? l : c, o ? s : u, f, d, X, E)), !1)), i) {
    var V = a.left, G = a.top;
    X.left += V, X.top += G, X.right += V, X.bottom += G;
  }
  return A.push.apply(A, et([], j(xc(S || !1, x || !1, o ? l : c, o ? s : u, f, d, X)), !1)), A = A.filter(function(K) {
    var U = K.element, L = K.elementRect, rt = K.type;
    if (!U || !L)
      return !0;
    var nt = L.rect;
    return mc(R, nt, rt, k);
  }), A;
}
function iv(t, e, r) {
  var n = t.props, a = n.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = n.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, u = [];
  return [
    ["vertical", cr, fr],
    ["horizontal", fr, cr]
  ].forEach(function(c) {
    var f = j(c, 3), d = f[0], h = f[1], g = f[2], m = e[h.start], x = e[h.end], S = e[h.center], C = e[g.start], w = e[g.end], D = {
      left: r[0],
      top: r[1]
    };
    function k(_) {
      var I = _.rect, v = D[h.start];
      return I[h.end] < m + v ? m - I[h.end] : x - v < I[h.start] ? I[h.start] - x : -1;
    }
    var E = l.filter(function(_) {
      var I = _.rect;
      return I[g.start] > w || I[g.end] < C ? !1 : k(_) > 0;
    }).sort(function(_, I) {
      return k(_) - k(I);
    }), M = [];
    E.forEach(function(_) {
      E.forEach(function(I) {
        if (_ !== I) {
          var v = _.rect, N = I.rect, R = v[g.start], P = v[g.end], A = N[g.start], B = N[g.end];
          R > B || A > P || M.push([_, I]);
        }
      });
    }), M.forEach(function(_) {
      var I = j(_, 2), v = I[0], N = I[1], R = v.rect, P = N.rect, A = R[h.start], B = R[h.end], X = P[h.start], V = P[h.end], G = D[h.start], K = 0, U = 0, L = !1, rt = !1, nt = !1;
      if (B <= m && x <= X) {
        if (rt = !0, K = (X - B - (x - m)) / 2, U = B + K + (x - m) / 2, q(U - S) > G)
          return;
      } else if (B < X && V < m + G) {
        if (L = !0, K = X - B, U = V + K, q(U - m) > G)
          return;
      } else if (B < X && x - G < A) {
        if (nt = !0, K = X - B, U = A - K, q(U - x) > G)
          return;
      } else
        return;
      K && mc(e, P, d, i) && (K > s || u.push({
        type: d,
        pos: d === "vertical" ? [U, 0] : [0, U],
        element: N.element,
        size: 0,
        className: N.className,
        isStart: L,
        isCenter: rt,
        isEnd: nt,
        gap: K,
        hide: !0,
        gapRects: [v, N],
        direction: "",
        elementDirection: ""
      }));
    });
  }), u;
}
function ov(t, e, r, n) {
  var a, i, o = t.props, s = t.state, l = o.snapGridAll, u = o.snapGridWidth, c = u === void 0 ? 0 : u, f = o.snapGridHeight, d = f === void 0 ? 0 : f, h = s.snapRenderInfo, g = h && (((a = h.direction) === null || a === void 0 ? void 0 : a[0]) || ((i = h.direction) === null || i === void 0 ? void 0 : i[1])), m = t.moveables;
  if (l && m && g && (c || d)) {
    if (s.snapThresholdInfo)
      return;
    s.snapThresholdInfo = {
      multiples: [1, 1],
      offset: [0, 0]
    };
    var x = t.getRect(), S = x.children, C = h.direction;
    if (S) {
      var w = C.map(function(k, E) {
        var M = E === 0 ? {
          snapSize: c,
          posName: "left",
          sizeName: "width",
          clientOffset: n.left - e
        } : {
          snapSize: d,
          posName: "top",
          sizeName: "height",
          clientOffset: n.top - r
        }, _ = M.snapSize, I = M.posName, v = M.sizeName, N = M.clientOffset;
        if (!_)
          return {
            dir: k,
            multiple: 1,
            snapSize: _,
            snapOffset: 0
          };
        var R = x[v], P = x[I], A = ip(S.map(function(L) {
          return [
            L[I] - P,
            L[v],
            R - L[v] - L[I] + P
          ];
        })).filter(function(L) {
          return L;
        }).sort(function(L, rt) {
          return L - rt;
        }), B = A[0], X = A.map(function(L) {
          return Ct(L / B, 0.1) * _;
        }), V = 1, G = Ct(R / B, 0.1);
        for (V = 1; V <= 10 && !X.every(function(L) {
          return L * V % 1 === 0;
        }); ++V)
          ;
        var K = (-k + 1) / 2, U = Ia(P - N, P - N + R, K, 1 - K);
        return {
          multiple: G * V,
          dir: k,
          snapSize: _,
          snapOffset: Math.round(U / _)
        };
      }), D = w.map(function(k) {
        return k.multiple || 1;
      });
      s.snapThresholdInfo.multiples = D, s.snapThresholdInfo.offset = w.map(function(k) {
        return k.snapOffset;
      }), w.forEach(function(k, E) {
        k.snapSize;
      });
    }
  } else
    s.snapThresholdInfo = null;
}
function sv(t, e, r, n, a, i, o) {
  n === void 0 && (n = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, u = s.snapGridWidth, c = u === void 0 ? 0 : u, f = s.snapGridHeight, d = f === void 0 ? 0 : f, h = [], g = i.left, m = i.top, x = [0, 0];
  ov(t, n, a, i);
  var S = l.snapThresholdInfo, C = c, w = d;
  if (S && (c *= S.multiples[0] || 1, d *= S.multiples[1] || 1, x = S.offset), d) {
    for (var D = function(E) {
      h.push({
        type: "horizontal",
        pos: [
          g,
          Ct(x[1] * w + E - a + m, 0.1)
        ],
        className: ht("grid-guideline"),
        size: e,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, k = 0; k <= r * 2; k += d)
      D(k);
    for (var k = -d; k >= -r; k -= d)
      D(k);
  }
  if (c) {
    for (var D = function(M) {
      h.push({
        type: "vertical",
        pos: [
          Ct(x[0] * C + M - n + g, 0.1),
          m
        ],
        className: ht("grid-guideline"),
        size: r,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, k = 0; k <= e * 2; k += c)
      D(k);
    for (var k = -c; k >= -e; k -= c)
      D(k);
  }
  return h;
}
function mc(t, e, r, n) {
  return r === "horizontal" ? q(t.right - e.left) <= n || q(t.left - e.right) <= n || t.left <= e.right && e.left <= t.right : r === "vertical" ? q(t.bottom - e.top) <= n || q(t.top - e.bottom) <= n || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function lv(t) {
  var e = t.state, r = t.props.elementGuidelines, n = r === void 0 ? [] : r;
  if (!n.length)
    return e.elementRects = [], [];
  var a = (e.elementRects || []).filter(function(d) {
    return !d.refresh;
  }), i = n.map(function(d) {
    return ye(d) && "element" in d ? O(O({}, d), { element: Xe(d.element, !0) }) : {
      element: Xe(d, !0)
    };
  }).filter(function(d) {
    return d.element;
  }), o = Fr(a.map(function(d) {
    return d.element;
  }), i.map(function(d) {
    return d.element;
  })), s = o.maintained, l = o.added, u = [];
  s.forEach(function(d) {
    var h = j(d, 2), g = h[0], m = h[1];
    u[m] = a[g];
  }), uv(t, l.map(function(d) {
    return i[d];
  })).map(function(d, h) {
    u[l[h]] = d;
  }), e.elementRects = u;
  var c = Wo(t.props.elementSnapDirections), f = [];
  return u.forEach(function(d) {
    var h = d.element, g = d.top, m = g === void 0 ? c.top : g, x = d.left, S = x === void 0 ? c.left : x, C = d.right, w = C === void 0 ? c.right : C, D = d.bottom, k = D === void 0 ? c.bottom : D, E = d.center, M = E === void 0 ? c.center : E, _ = d.middle, I = _ === void 0 ? c.middle : _, v = d.className, N = d.rect, R = Yo({
      top: m,
      right: w,
      left: S,
      bottom: k,
      center: M,
      middle: I
    }, N), P = R.horizontal, A = R.vertical, B = R.horizontalNames, X = R.verticalNames, V = N.top, G = N.left, K = N.right - G, U = N.bottom - V, L = [K, U];
    A.forEach(function(rt, nt) {
      f.push({
        type: "vertical",
        element: h,
        pos: [
          Ct(rt, 0.1),
          V
        ],
        size: U,
        sizes: L,
        className: v,
        elementRect: d,
        elementDirection: dl[X[nt]] || X[nt],
        direction: ""
      });
    }), P.forEach(function(rt, nt) {
      f.push({
        type: "horizontal",
        element: h,
        pos: [
          G,
          Ct(rt, 0.1)
        ],
        size: K,
        sizes: L,
        className: v,
        elementRect: d,
        elementDirection: dl[B[nt]] || B[nt],
        direction: ""
      });
    });
  }), f;
}
function Cl(t, e) {
  return t ? t.map(function(r) {
    var n = ye(r) ? r : { pos: r }, a = n.pos;
    return Dn(a) ? n : O(O({}, n), { pos: jt(a, e) });
  }) : [];
}
function xc(t, e, r, n, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, u = o.top, c = o.bottom, f = o.right, d = r + f - l, h = n + c - u;
  return Cl(t, h).forEach(function(g) {
    s.push({
      type: "horizontal",
      pos: [
        l,
        Ct(g.pos - i + u, 0.1)
      ],
      size: d,
      className: g.className,
      direction: ""
    });
  }), Cl(e, d).forEach(function(g) {
    s.push({
      type: "vertical",
      pos: [
        Ct(g.pos - a + l, 0.1),
        u
      ],
      size: h,
      className: g.className,
      direction: ""
    });
  }), s;
}
function uv(t, e) {
  if (!e.length)
    return [];
  var r = t.props.groupable, n = t.state, a = n.containerClientRect, i = n.rootMatrix, o = n.is3d, s = n.offsetDelta, l = o ? 4 : 3, u = j(Oh(i, a, l), 2), c = u[0], f = u[1], d = r ? 0 : s[0], h = r ? 0 : s[1];
  return e.map(function(g) {
    var m = g.element.getBoundingClientRect(), x = m.left - c - d, S = m.top - f - h, C = S + m.height, w = x + m.width, D = j(Zr(i, [x, S], l), 2), k = D[0], E = D[1], M = j(Zr(i, [w, C], l), 2), _ = M[0], I = M[1];
    return O(O({}, g), { rect: {
      left: k,
      right: _,
      top: E,
      bottom: I,
      center: (k + _) / 2,
      middle: (E + I) / 2
    } });
  });
}
function fa(t) {
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
    var o = Xe(n, !0);
    if (o) {
      var s = Sn(o), l = _l(e, [
        s.left - a.left,
        s.top - a.top
      ]), u = _l(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = Ct(l[0], 1e-5), i.top = Ct(l[1], 1e-5), i.right = Ct(u[0], 1e-5), i.bottom = Ct(u[1], 1e-5);
    }
  }
  return e.snapContainer = n, e.snapOffset = i, e.guidelines = co(t), e.enableSnap = !0, !0;
}
function yc(t, e, r, n, a, i) {
  var o = Ir(t, e, r, i ? 4 : 3), s = ie(o, n);
  return Vo(o, xt(a, s));
}
function wl(t) {
  return t ? t / q(t) : 0;
}
function cv(t, e, r, n, a, i) {
  var o = i.fixedDirection, s = Ah(r, o, n), l = Ho(t, e, r, n), u = et(et([], j(Kh(t, e, s, n, a, i)), !1), j(pc(t, l, i)), !1), c = Aa(u, 0), f = Aa(u, 1);
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
function fv(t, e, r, n, a, i, o, s, l) {
  var u = ie(e, o), c = Ja(t, s, {
    vertical: [u[0]],
    horizontal: [u[1]]
  }), f = c.horizontal.offset, d = c.vertical.offset;
  if (Ct(d, no) || Ct(f, no)) {
    var h = j(He({
      datas: l,
      distX: -d,
      distY: -f
    }), 2), g = h[0], m = h[1], x = Math.min(a || 1 / 0, r + o[0] * g), S = Math.min(i || 1 / 0, n + o[1] * m);
    return [x - r, S - n];
  }
  return [0, 0];
}
function bc(t, e, r, n, a, i, o, s) {
  for (var l = Ie(t.state), u = t.props.keepRatio, c = 0, f = 0, d = 0; d < 2; ++d) {
    var h = e(c, f), g = cv(t, h, a, u, o, s), m = g.width, x = g.height, S = m.isBound, C = x.isBound, w = m.offset, D = x.offset;
    if (d === 1 && (S || (w = 0), C || (D = 0)), d === 0 && o && !S && !C)
      return [0, 0];
    if (u) {
      var k = q(w) * (r ? 1 / r : 1), E = q(D) * (n ? 1 / n : 1), M = S && C ? k < E : C || !S && k < E;
      M ? w = r * D / n : D = n * w / r;
    }
    c += w, f += D;
  }
  if (!u && a[0] && a[1]) {
    var _ = Zh(t, l, a, i, s), I = _.maxWidth, v = _.maxHeight, N = j(fv(t, e(c, f).map(function(A) {
      return A.map(function(B) {
        return Ct(B, no);
      });
    }), r + c, n + f, I, v, a, o, s), 2), w = N[0], D = N[1];
    c += w, f += D;
  }
  return [c, f];
}
function yn(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function dv(t, e) {
  e = yn(e);
  var r = Math.floor(t / 360), n = r * 360 + 360 - e, a = r * 360 + e;
  return q(t - n) < q(t - a) ? n : a;
}
function Ii(t, e) {
  t = yn(t), e = yn(e);
  var r = yn(t - e);
  return Math.min(r, 360 - r);
}
function pv(t, e, r, n) {
  var a, i = t.props, o = (a = i[ic]) !== null && a !== void 0 ? a : 5, s = i[oc];
  if (rn(t, "rotatable")) {
    var l = e.pos1, u = e.pos2, c = e.pos3, f = e.pos4, d = e.origin, h = r * Math.PI / 180, g = [l, u, c, f].map(function(D) {
      return xt(D, d);
    }), m = g.map(function(D) {
      return In(D, h);
    }), x = et(et([], j(Th(t, g, m, d, r)), !1), j(Yh(t, g, m, d, r)), !1);
    x.sort(function(D, k) {
      return q(D - r) - q(k - r);
    });
    var S = x.length > 0;
    if (S)
      return {
        isSnap: S,
        dist: S ? x[0] : r
      };
  }
  if (s != null && s.length && o) {
    var C = s.slice().sort(function(D, k) {
      return Ii(D, n) - Ii(k, n);
    }), w = C[0];
    if (Ii(w, n) <= o)
      return {
        isSnap: !0,
        dist: r + dv(n, w) - n
      };
  }
  return {
    isSnap: !1,
    dist: r
  };
}
function hv(t, e, r, n, a, i, o) {
  if (!rn(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, u = t.state, c = u.allMatrix, f = u.is3d;
  return bc(t, function(d, h) {
    return yc(l || c, e + d, r + h, s, a, f);
  }, e, r, n, a, i, o);
}
function vv(t, e, r, n, a) {
  if (!rn(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, u = a.is3d, c = bc(t, function(f, d) {
    return yc(hh(a, Rt(e, [f / i, d / o])), i, o, l, s, u);
  }, i, o, r, s, n, a);
  return [c[0] / i, c[1] / o];
}
function gv(t, e) {
  e.absolutePoses = Ie(t.state);
}
function El(t) {
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
function Dl(t, e, r, n, a, i) {
  var o = Lo(Ua(t, i), e, r), s = o.vertical, l = o.horizontal, u = Wr();
  s.forEach(function(g) {
    g.isBound && (g.direction === "start" && (u.left = !0), g.direction === "end" && (u.right = !0), n.push({
      type: "bounds",
      pos: g.pos
    }));
  }), l.forEach(function(g) {
    g.isBound && (g.direction === "start" && (u.top = !0), g.direction === "end" && (u.bottom = !0), a.push({
      type: "bounds",
      pos: g.pos
    }));
  });
  var c = Xh(t), f = c.boundMap, d = c.vertical, h = c.horizontal;
  return d.forEach(function(g) {
    Je(n, function(m) {
      var x = m.type, S = m.pos;
      return x === "bounds" && S === g;
    }) >= 0 || n.push({
      type: "bounds",
      pos: g
    });
  }), h.forEach(function(g) {
    Je(a, function(m) {
      var x = m.type, S = m.pos;
      return x === "bounds" && S === g;
    }) >= 0 || a.push({
      type: "bounds",
      pos: g
    });
  }), {
    boundMap: u,
    innerBoundMap: f
  };
}
var mv = Zo("", ["resizable", "scalable"]), xv = {
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
    ic,
    oc,
    sc,
    lc,
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
    if (!u || !u.render || !rn(t, ""))
      return Xr(t, "boundMap", Wr(), function(tt) {
        return JSON.stringify(tt);
      }), Xr(t, "innerBoundMap", Wr(), function(tt) {
        return JSON.stringify(tt);
      }), [];
    r.guidelines = co(t);
    var d = Math.min(i[0], o[0], s[0], l[0]), h = Math.min(i[1], o[1], s[1], l[1]), g = u.externalPoses || [], m = Ie(t.state), x = [], S = [], C = [], w = [], D = [], k = Me(m), E = k.width, M = k.height, _ = k.top, I = k.left, v = k.bottom, N = k.right, R = { left: I, right: N, top: _, bottom: v, center: (I + N) / 2, middle: (_ + v) / 2 }, P = g.length > 0, A = P ? Me(g) : {};
    if (!u.request) {
      if (u.direction && D.push(zh(t, m, u.direction, f, f)), u.snap) {
        var B = Me(m);
        u.center && (B.middle = (B.top + B.bottom) / 2, B.center = (B.left + B.right) / 2), D.push(pl(t, B, f, f));
      }
      P && (u.center && (A.middle = (A.top + A.bottom) / 2, A.center = (A.left + A.right) / 2), D.push(pl(t, A, f, f))), D.forEach(function(tt) {
        var at = tt.vertical.posInfos, J = tt.horizontal.posInfos;
        x.push.apply(x, et([], j(at.filter(function(ot) {
          var ft = ot.guidelineInfos;
          return ft.some(function(bt) {
            var pt = bt.guideline;
            return !pt.hide;
          });
        }).map(function(ot) {
          return {
            type: "snap",
            pos: ot.pos
          };
        })), !1)), S.push.apply(S, et([], j(J.filter(function(ot) {
          var ft = ot.guidelineInfos;
          return ft.some(function(bt) {
            var pt = bt.guideline;
            return !pt.hide;
          });
        }).map(function(ot) {
          return {
            type: "snap",
            pos: ot.pos
          };
        })), !1)), C.push.apply(C, et([], j(El(at)), !1)), w.push.apply(w, et([], j(El(J)), !1));
      });
    }
    var X = Dl(t, [I, N], [_, v], x, S), V = X.boundMap, G = X.innerBoundMap;
    P && Dl(t, [A.left, A.right], [A.top, A.bottom], x, S, u.externalBounds);
    var K = et(et([], j(C), !1), j(w), !1), U = K.filter(function(tt) {
      return tt.element && !tt.gapRects;
    }), L = K.filter(function(tt) {
      return tt.gapRects;
    }).sort(function(tt, at) {
      return tt.gap - at.gap;
    });
    ct(t, "onSnap", {
      guidelines: K.filter(function(tt) {
        var at = tt.element;
        return !at;
      }),
      elements: U,
      gaps: L
    }, !0);
    var rt = Xr(t, "boundMap", V, function(tt) {
      return JSON.stringify(tt);
    }, Wr()), nt = Xr(t, "innerBoundMap", G, function(tt) {
      return JSON.stringify(tt);
    }, Wr());
    return (V === rt || G === nt) && ct(t, "onBound", {
      bounds: V,
      innerBounds: G
    }, !0), et(et(et(et(et(et([], j(nv(t, U, [d, h], R, e)), !1), j(av(t, L, [d, h], R, e)), !1), j(Sl(t, "horizontal", w, [a, n], R, e)), !1), j(Sl(t, "vertical", C, [a, n], R, e)), !1), j(bl(t, "horizontal", S, d, n, E, 0, e)), !1), j(bl(t, "vertical", x, h, a, M, 1, e)), !1);
  },
  dragStart: function(t, e) {
    t.state.snapRenderInfo = {
      request: e.isRequest,
      snap: !0,
      center: !0
    }, fa(t);
  },
  drag: function(t) {
    var e = t.state;
    fa(t) || (e.guidelines = co(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (mv(t, e) || uo(t, e))
      return !0;
    if (!e.isRequest && e.inputEvent)
      return ae(e.inputEvent.target, ht("snap-control"));
  },
  dragControlStart: function(t) {
    t.state.snapRenderInfo = null, fa(t);
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
    t.state.snapRenderInfo = null, fa(t);
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
function yv(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function ht() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return Wd.apply(void 0, et([Ao], j(t), !1));
}
function Sc(t) {
  t();
}
function bv(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : ye(t) ? t : $r(t);
}
function bn(t, e, r) {
  return Pa(e, Dr(r, e), t, Dr(r.map(function(n) {
    return -n;
  }), e));
}
function Sv(t, e, r) {
  if (e === "%") {
    var n = qo(t.ownerSVGElement);
    return n[r ? "width" : "height"] / 100;
  }
  return 1;
}
function Cv(t) {
  var e = wv(Ko(t, ":before"));
  return e.map(function(r, n) {
    var a = wr(r), i = a.value, o = a.unit;
    return i * Sv(t, o, n === 0);
  });
}
function Fa(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function wv(t) {
  return Fa(t.transformOrigin);
}
function Cc(t) {
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
function Tn(t, e, r, n, a) {
  var i, o, s = Io(t) || dr(t), l = !1, u, c;
  if (!t || r)
    u = t;
  else {
    var f = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, d = t.parentElement;
    f ? (l = !0, c = d, u = f) : u = d;
  }
  for (var h = !1, g = t === e || u === e, m = "relative", x = 1, S = parseFloat(a == null ? void 0 : a("zoom")) || 1, C = a == null ? void 0 : a("position"); u && u !== s; ) {
    e === u && (g = !0);
    var w = me(u), D = u.tagName.toLowerCase(), k = Cc(u), E = w("willChange"), M = parseFloat(w("zoom")) || 1;
    if (m = w("position"), n && M !== 1) {
      x = M;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !r && n && S !== 1 && C && C !== "absolute" || D === "svg" || D === "foreignobject" || m !== "static" || k && k !== "none" || E === "transform"
    )
      break;
    var _ = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, I = u.parentNode;
    _ && (l = !0, c = I);
    var v = I;
    if (v && v.nodeType === 11) {
      u = v.host, h = !0, m = me(u)("position");
      break;
    }
    u = v, m = "relative";
  }
  return {
    offsetZoom: x,
    hasSlot: l,
    parentSlotElement: c,
    isCustomElement: h,
    isStatic: m === "static",
    isEnd: g || !u || u === s,
    offsetParent: u || s
  };
}
function Ev(t, e) {
  var r, n = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = me(t), s = Do(a), l = !s, u, c;
  return !l && (n !== "svg" || t.ownerSVGElement) ? (u = Wu ? Cv(t) : Fa(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), c = u.slice(), l = !0, n === "svg" ? (a = 0, i = 0) : (r = j(Mv(t, u, t === e && e.tagName.toLowerCase() === "g"), 4), a = r[0], i = r[1], u[0] = r[2], u[1] = r[3])) : (u = Fa(o("transformOrigin")).map(function(f) {
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
function wc(t, e) {
  var r = me(t), n = me(dr(t)), a = n("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(n("marginLeft"), 10), o = parseInt(n("marginTop"), 10);
  return r("position") === "absolute" && ((r("top") !== "auto" || r("bottom") !== "auto") && (o = 0), (r("left") !== "auto" || r("right") !== "auto") && (i = 0)), [i, o];
}
function fo(t) {
  t.forEach(function(e) {
    var r = e.matrix;
    r && (e.matrix = Be(r, 3, 4));
  });
}
function Dv(t) {
  for (var e = t.parentElement, r = !1, n = dr(t); e; ) {
    var a = Ko(e).transform;
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
function Qa(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(Pu(t, !e).join(","), ")");
}
function qo(t) {
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
function kv(t, e) {
  var r, n = qo(t), a = n.width, i = n.height, o = n.clientWidth, s = n.clientHeight, l = o / a, u = s / i, c = t.preserveAspectRatio.baseVal, f = c.align, d = c.meetOrSlice, h = [0, 0], g = [l, u], m = [0, 0];
  if (f !== 1) {
    var x = (f - 2) % 3, S = Math.floor((f - 2) / 3);
    h[0] = a * x / 2, h[1] = i * S / 2;
    var C = d === 2 ? Math.max(u, l) : Math.min(l, u);
    g[0] = C, g[1] = C, m[0] = (o - a) / 2 * x, m[1] = (s - i) / 2 * S;
  }
  var w = Ro(g, e);
  return r = j(m, 2), w[e * (e - 1)] = r[0], w[e * (e - 1) + 1] = r[1], bn(w, e, h);
}
function Mv(t, e, r) {
  var n = t.tagName.toLowerCase();
  if (!t.getBBox || !r && n === "g")
    return [0, 0, 0, 0];
  var a = me(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = qo(t.ownerSVGElement), l = o.x, u = o.y;
  n === "foreignobject" && !l && !u && (l = parseFloat(t.getAttribute("x")) || 0, u = parseFloat(t.getAttribute("y")) || 0);
  var c = l - s.x, f = u - s.y, d = i ? e[0] : e[0] - c, h = i ? e[1] : e[1] - f;
  return [c, f, d, h];
}
function Yt(t, e, r) {
  return ce(t, Er(e, r), r);
}
function Ir(t, e, r, n) {
  return [[0, 0], [e, 0], [0, r], [e, r]].map(function(a) {
    return Yt(t, a, n);
  });
}
function Me(t) {
  var e = t.map(function(u) {
    return u[0];
  }), r = t.map(function(u) {
    return u[1];
  }), n = Math.min.apply(Math, et([], j(e), !1)), a = Math.min.apply(Math, et([], j(r), !1)), i = Math.max.apply(Math, et([], j(e), !1)), o = Math.max.apply(Math, et([], j(r), !1)), s = i - n, l = o - a;
  return {
    left: n,
    top: a,
    right: i,
    bottom: o,
    width: s,
    height: l
  };
}
function kl(t, e, r, n) {
  var a = Ir(t, e, r, n);
  return Me(a);
}
function _v(t, e, r, n, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, u = Dc(o), c = u.offsetWidth, f = u.offsetHeight, d = r.getBoundingClientRect(), h = [0, 0];
  r === dr(r) && (h = wc(o, !0));
  for (var g = o.getBoundingClientRect(), m = g.left - d.left + r.scrollLeft - (r.clientLeft || 0) + h[0], x = g.top - d.top + r.scrollTop - (r.clientTop || 0) + h[1], S = g.width, C = g.height, w = Pa(n, a, l), D = kl(w, c, f, n), k = D.left, E = D.top, M = D.width, _ = D.height, I = Yt(w, s, n), v = xt(I, [k, E]), N = [
    m + v[0] * S / M,
    x + v[1] * C / _
  ], R = [0, 0], P = 0; ++P < 10; ) {
    var A = Ae(a, n);
    i = j(xt(Yt(A, N, n), Yt(A, I, n)), 2), R[0] = i[0], R[1] = i[1];
    var B = Pa(n, a, Dr(R, n), l), X = kl(B, c, f, n), V = X.left, G = X.top, K = V - m, U = G - x;
    if (q(K) < 2 && q(U) < 2)
      break;
    N[0] -= K, N[1] -= U;
  }
  return R.map(function(L) {
    return Math.round(L);
  });
}
function Tv(t, e, r) {
  var n = t.length === 16, a = n ? 4 : 3, i = e.map(function(l) {
    return Yt(t, l, a);
  }), o = r.left, s = r.top;
  return i.map(function(l) {
    return [l[0] + o, l[1] + s];
  });
}
function Te(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
}
function Ec(t, e) {
  return Te([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function vn(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = Kt(t, e));
  var a = Ec(t, e);
  return {
    transform: "translateY(-50%) translate(".concat(t[0], "px, ").concat(t[1], "px) rotate(").concat(n, "rad) scaleY(").concat(r, ")"),
    width: "".concat(a, "px")
  };
}
function Ga(t, e) {
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
function Mr(t, e) {
  var r = t[e];
  return ye(r) ? O(O({}, t), r) : t;
}
function Dc(t) {
  var e = t && !Do(t.offsetWidth), r = 0, n = 0, a = 0, i = 0, o = 0, s = 0, l = 0, u = 0, c = 0, f = 0, d = 0, h = 0, g = 1 / 0, m = 1 / 0, x = 1 / 0, S = 1 / 0, C = 0, w = 0, D = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var k = t.getBBox();
      D = !0, r = k.width, n = k.height, o = r, s = n, l = r, u = n, a = r, i = n;
    } else {
      var E = me(t), M = t.style, _ = E("boxSizing") === "border-box", I = parseFloat(E("borderLeftWidth")) || 0, v = parseFloat(E("borderRightWidth")) || 0, N = parseFloat(E("borderTopWidth")) || 0, R = parseFloat(E("borderBottomWidth")) || 0, P = parseFloat(E("paddingLeft")) || 0, A = parseFloat(E("paddingRight")) || 0, B = parseFloat(E("paddingTop")) || 0, X = parseFloat(E("paddingBottom")) || 0, V = P + A, G = B + X, K = I + v, U = N + R, L = V + K, rt = G + U, nt = E("position"), tt = 0, at = 0;
      if ("clientLeft" in t) {
        var J = null;
        if (nt === "absolute") {
          var ot = Tn(t, dr(t));
          J = ot.offsetParent;
        } else
          J = t.parentElement;
        if (J) {
          var ft = me(J);
          tt = parseFloat(ft("width")), at = parseFloat(ft("height"));
        }
      }
      c = Math.max(V, jt(E("minWidth"), tt) || 0), f = Math.max(G, jt(E("minHeight"), at) || 0), g = jt(E("maxWidth"), tt), m = jt(E("maxHeight"), at), isNaN(g) && (g = 1 / 0), isNaN(m) && (m = 1 / 0), C = jt(M.width, 0) || 0, w = jt(M.height, 0) || 0, o = parseFloat(E("width")) || 0, s = parseFloat(E("height")) || 0, l = q(o - C) < 1 ? Ra(c, C || o, g) : o, u = q(s - w) < 1 ? Ra(f, w || s, m) : s, r = l, n = u, a = l, i = u, _ ? (x = g, S = m, d = c, h = f, l = r - L, u = n - rt) : (x = g + L, S = m + rt, d = c + L, h = f + rt, r = l + L, n = u + rt), a = l + V, i = u + G;
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
    maxWidth: g,
    maxHeight: m,
    minOffsetWidth: d,
    minOffsetHeight: h,
    maxOffsetWidth: x,
    maxOffsetHeight: S
  };
}
function kc(t, e) {
  return Kt(e > 0 ? t[0] : t[1], e > 0 ? t[1] : t[0]);
}
function da() {
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
function Mc(t, e) {
  var r = t === dr(t) || t === Io(t), n = {
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
function Ri(t, e, r, n) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, u = e.left, c = {
    left: u + a,
    top: l + o,
    right: u + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return r && n ? Mc(r, c) : c;
}
function Sn(t, e) {
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
  return t && e ? Mc(t, s) : s;
}
function Iv(t) {
  var e = t.props, r = e.groupable, n = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !r && s && n ? Qo(n, i, o) : l;
}
function _c(t, e, r, n) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = r.target;
    a = Tc(i, n);
  }
  return a;
}
function Tc(t, e) {
  if (t) {
    var r = t.getAttribute("data-rotation") || "", n = t.getAttribute("data-direction");
    if (e.deg = r, !!n) {
      var a = [0, 0];
      return n.indexOf("w") > -1 && (a[0] = -1), n.indexOf("e") > -1 && (a[0] = 1), n.indexOf("n") > -1 && (a[1] = -1), n.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function Vo(t, e) {
  return [
    Rt(e, t[0]),
    Rt(e, t[1]),
    Rt(e, t[2]),
    Rt(e, t[3])
  ];
}
function Ie(t) {
  var e = t.left, r = t.top, n = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return Vo([n, a, i, o], [e, r]);
}
function po(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(r) {
    r.unset && r.unset(t);
  });
}
function Yr(t, e) {
  var r = e ? "controlGesto" : "targetGesto", n = t[r];
  (n == null ? void 0 : n.isIdle()) === !1 && po(t, e), n == null || n.unset(), t[r] = null;
}
function he(t, e) {
  if (e) {
    var r = en(e);
    r.nextStyle = O(O({}, r.nextStyle), t);
  }
  return {
    style: t,
    cssText: Qr(t).map(function(n) {
      return "".concat(tp(n, "-"), ": ").concat(t[n], ";");
    }).join("")
  };
}
function Ic(t, e, r) {
  var n = e.afterTransform || e.transform;
  return O(O({}, he(O(O(O({}, t.style), e.style), { transform: n }), r)), { afterTransform: n, transform: t.transform });
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
function ti(t, e, r) {
  t._emitter.on(e, r);
}
function ct(t, e, r, n, a) {
  return t.triggerEvent(e, r, n, a);
}
function Ko(t, e) {
  return ke(t).getComputedStyle(t, e);
}
function pa(t, e, r) {
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
function ho(t, e) {
  return t === e || t == null && e == null;
}
function Ml() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var r = t.length - 1, n = 0; n < r; ++n) {
    var a = t[n];
    if (!Do(a))
      return a;
  }
  return t[r];
}
function Rc(t, e) {
  var r = [], n = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n.indexOf(o), l = r[s] || [];
    s === -1 && (n.push(o), r.push(l)), l.push(a);
  }), r;
}
function Rv(t, e) {
  var r = [], n = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n[o];
    s || (s = [], n[o] = s, r.push(s)), s.push(a);
  }), r;
}
function Pc(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function Ur() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return t.sort(function(r, n) {
    return q(n) - q(r);
  }), t[0];
}
function Zr(t, e, r) {
  return ce(Ae(t, r), Er(e, r), r);
}
function Pv(t, e) {
  var r, n = t.is3d, a = t.rootMatrix, i = n ? 4 : 3;
  return r = j(Zr(a, [e.distX, e.distY], i), 2), e.distX = r[0], e.distY = r[1], e;
}
function De(t, e, r, n) {
  if (!r[0] && !r[1])
    return e;
  var a = Yt(t, [wl(r[0] || 1), 0], n), i = Yt(t, [0, wl(r[1] || 1)], n), o = Yt(t, [
    r[0] / Te(a),
    r[1] / Te(i)
  ], n);
  return Rt(e, o);
}
function Oe(t, e, r) {
  return r ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function La(t) {
  return q(t) <= ve ? 0 : t;
}
function Uo(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var r = Sh(e, t), n = r.deg;
    return n ? ht("view-control-rotation".concat(n)) : "";
  };
}
function Zo(t, e) {
  return e === void 0 && (e = [t]), function(r, n) {
    if (n.isRequest)
      return e.some(function(i) {
        return n.requestAble === i;
      }) ? n.parentDirection : !1;
    var a = n.inputEvent.target;
    return ae(a, ht("direction")) && (!t || ae(a, ht(t)));
  };
}
function Ov(t, e, r) {
  var n, a = qr(t, {
    "x%": function(k) {
      return k / 100 * e.offsetWidth;
    },
    "y%": function(k) {
      return k / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, r < 0 ? void 0 : r), o = t.slice(0, r < 0 ? void 0 : r + 1), s = t[r] || "", l = r < 0 ? [] : t.slice(r), u = r < 0 ? [] : t.slice(r + 1), c = a.slice(0, r < 0 ? void 0 : r), f = a.slice(0, r < 0 ? void 0 : r + 1), d = (n = a[r]) !== null && n !== void 0 ? n : qr([""])[0], h = r < 0 ? [] : a.slice(r), g = r < 0 ? [] : a.slice(r + 1), m = d ? [d] : [], x = Ar(c), S = Ar(f), C = Ar(h), w = Ar(g), D = Nt(x, C, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: x,
    beforeFunctionMatrix2: S,
    targetFunctionMatrix: Ar(m),
    afterFunctionMatrix: C,
    afterFunctionMatrix2: w,
    allFunctionMatrix: D,
    beforeFunctions: c,
    beforeFunctions2: f,
    targetFunction: m[0],
    afterFunctions: h,
    afterFunctions2: g,
    beforeFunctionTexts: i,
    beforeFunctionTexts2: o,
    targetFunctionText: s,
    afterFunctionTexts: l,
    afterFunctionTexts2: u
  };
}
function jv(t) {
  return !t || !ye(t) || Mn(t) ? !1 : Vt(t) || "length" in t;
}
function Xe(t, e) {
  return t ? Mn(t) ? t : _e(t) ? e ? document.querySelector(t) : t : Ha(t) ? t() : Tu(t) ? t : "current" in t ? t.current : t : null;
}
function Jo(t, e) {
  if (!t)
    return [];
  var r = jv(t) ? [].slice.call(t) : [t];
  return r.reduce(function(n, a) {
    return _e(a) && e ? et(et([], j(n), !1), j([].slice.call(document.querySelectorAll(a))), !1) : (Vt(a) ? n.push(Jo(a, e)) : n.push(Xe(a, e)), n);
  }, []);
}
function Nv(t, e, r) {
  var n = Kt(t, e) / Math.PI * 180;
  return n = r >= 0 ? n : 180 - n, n = n >= 0 ? n : 360 + n, n;
}
function _l(t, e) {
  var r = t.rootMatrix, n = t.is3d, a = n ? 4 : 3, i = Ae(r, a);
  return n || (i = Be(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, Ca(i, e);
}
function Oc(t, e, r, n, a) {
  var i = j(t, 2), o = i[0], s = i[1], l = 0, u = 0;
  if (a && o && s) {
    var c = Kt([0, 0], e), f = Kt([0, 0], n), d = Te(e), h = Math.cos(c - f) * d;
    if (!n[0])
      u = h, l = u * r;
    else if (!n[1])
      l = h, u = l / r;
    else {
      var g = n[0] * o, m = n[1] * s, x = Math.atan2(g + e[0], m + e[1]), S = Math.atan2(g, m);
      x < 0 && (x += Math.PI * 2), S < 0 && (S += Math.PI * 2);
      var C = 0;
      q(x - S) < Math.PI / 2 || q(x - S) > Math.PI / 2 * 3 || (S += Math.PI), C = x - S, C > Math.PI * 2 ? C -= Math.PI * 2 : C > Math.PI ? C = 2 * Math.PI - C : C < -Math.PI && (C = -2 * Math.PI - C);
      var w = Te([g + e[0], m + e[1]]) * Math.cos(C);
      l = w * Math.sin(S) - g, u = w * Math.cos(S) - m, n[0] < 0 && (l *= -1), n[1] < 0 && (u *= -1);
    }
  } else
    l = n[0] * e[0], u = n[1] * e[1];
  return [l, u];
}
function jc(t, e, r, n) {
  var a, i = r.ratio, o = r.startOffsetWidth, s = r.startOffsetHeight, l = 0, u = 0, c = n.distX, f = n.distY, d = n.pinchScale, h = n.parentDistance, g = n.parentDist, m = n.parentScale, x = r.fixedDirection, S = [0, 1].map(function(M) {
    return q(t[M] - x[M]);
  }), C = [0, 1].map(function(M) {
    var _ = S[M];
    return _ !== 0 && (_ = 2 / _), _;
  });
  if (g)
    l = g[0], u = g[1], e && (l ? u || (u = l / i) : l = u * i);
  else if (Dn(d))
    l = (d - 1) * o, u = (d - 1) * s;
  else if (m)
    l = (m[0] - 1) * o, u = (m[1] - 1) * s;
  else if (h) {
    var w = o * S[0], D = s * S[1], k = Te([w, D]);
    l = h / k * w * C[0], u = h / k * D * C[1];
  } else {
    var E = He({ datas: r, distX: c, distY: f });
    E = C.map(function(M, _) {
      return E[_] * M;
    }), a = j(Oc([o, s], E, i, t, e), 2), l = a[0], u = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: u
  };
}
function vo(t, e) {
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
    var r = j(t.split(" "), 2), n = r[0], a = r[1], i = vo(n || ""), o = vo(a || ""), s = O(O({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function Qo(t, e, r) {
  var n = vo(t, !0), a = n.x, i = n.y;
  return [
    jt(a, e) || 0,
    jt(i, r) || 0
  ];
}
function zv(t, e, r) {
  var n = t.map(function(i) {
    return xt(i, e);
  }), a = n.map(function(i) {
    return In(i, r);
  });
  return {
    prev: n,
    next: a,
    result: a.map(function(i) {
      return Rt(i, e);
    })
  };
}
function Nc(t, e) {
  return t.length === e.length && t.every(function(r, n) {
    var a = e[n], i = Vt(r), o = Vt(a);
    return i && o ? Nc(r, a) : !i && !o ? r === a : !1;
  });
}
function Xr(t, e, r, n, a) {
  var i = t._store, o = i[e];
  if (!(e in i))
    if (a != null)
      i[e] = a, o = a;
    else
      return i[e] = r, r;
  return o === r || n(o) === n(r) ? o : (i[e] = r, r);
}
function pe(t) {
  return t >= 0 ? 1 : -1;
}
function q(t) {
  return Math.abs(t);
}
function Pi(t, e) {
  return ap(t).map(function(r) {
    return e(r);
  });
}
function zc(t) {
  return Dn(t) ? {
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
var Av = jn("pinchable", {
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
    var h = ct(t, u, d);
    r.isPinch = h !== !1, r.ables = f;
    var g = r.isPinch;
    return g ? (f.forEach(function(m) {
      if (i[m.name] = i[m.name] || {}, !!m[c]) {
        var x = O(O({}, e), { datas: i[m.name], parentRotate: a, isPinch: !0 });
        m[c](t, x);
      }
    }), t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: [0, 0]
    }, g) : !1;
  },
  pinch: function(t, e) {
    var r = e.datas, n = e.scale, a = e.distance, i = e.originalDatas, o = e.inputEvent, s = e.targets, l = e.angle;
    if (r.isPinch) {
      var u = a * (1 - 1 / n), c = Et(t, e, {});
      s && (c.targets = s);
      var f = "onPinch".concat(s ? "Group" : "");
      ct(t, f, c);
      var d = r.ables, h = "drag".concat(s ? "Group" : "", "Control");
      return d.forEach(function(g) {
        g[h] && g[h](t, O(O({}, e), { datas: i[g.name], inputEvent: o, resolveMatrix: !0, pinchScale: n, parentDistance: u, parentRotate: l, isPinch: !0 }));
      }), c;
    }
  },
  pinchEnd: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.targets, o = e.originalDatas;
    if (r.isPinch) {
      var s = "onPinch".concat(i ? "Group" : "", "End"), l = Se(t, e, { isDrag: n });
      i && (l.targets = i), ct(t, s, l);
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
}), Tl = Zo("scalable"), Bv = {
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
  render: rc("scalable"),
  dragControlCondition: Tl,
  viewClassName: Uo("scalable"),
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = _c(i, n, a, r), s = t.state, l = s.width, u = s.height, c = s.targetTransform, f = s.target, d = s.pos1, h = s.pos2, g = s.pos4;
    if (!o || !f)
      return !1;
    n || Tr(t, e), r.datas = {}, r.transform = c, r.prevDist = [1, 1], r.direction = o, r.startOffsetWidth = l, r.startOffsetHeight = u, r.startValue = [1, 1];
    var m = !o[0] && !o[1] || o[0] || !o[1];
    Ka(t, e, "scale"), r.isWidth = m;
    function x(E) {
      r.ratio = E && isFinite(E) ? E : 0;
    }
    r.startPositions = Ie(t.state);
    function S(E) {
      var M = hc(r.startPositions, E);
      r.fixedDirection = M.fixedDirection, r.fixedPosition = M.fixedPosition, r.fixedOffset = M.fixedOffset;
    }
    r.setFixedDirection = S, x(Ye(d, h) / Ye(h, g)), S([-o[0], -o[1]]);
    var C = function(E) {
      r.minScaleSize = E;
    }, w = function(E) {
      r.maxScaleSize = E;
    };
    C([-1 / 0, -1 / 0]), w([1 / 0, 1 / 0]);
    var D = Et(t, e, O(O({ direction: o, set: function(E) {
      r.startValue = E;
    }, setRatio: x, setFixedDirection: S, setMinScaleSize: C, setMaxScaleSize: w }, Va(t, e)), { dragStart: de.dragStart(t, new Vr().dragStart([0, 0], e)) })), k = ct(t, "onScaleStart", D);
    return r.startFixedDirection = r.fixedDirection, k !== !1 && (r.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), r.isScale ? D : !1;
  },
  dragControl: function(t, e) {
    $a(t, e, "scale");
    var r = e.datas, n = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, u = e.resolveMatrix, c = r.prevDist, f = r.direction, d = r.startOffsetWidth, h = r.startOffsetHeight, g = r.isScale, m = r.startValue, x = r.isWidth, S = r.ratio;
    if (!g)
      return !1;
    var C = t.props, w = C.throttleScale, D = C.parentMoveable, k = f;
    !f[0] && !f[1] && (k = [1, 1]);
    var E = S && (n ?? C.keepRatio) || !1, M = t.state, _ = [
      m[0],
      m[1]
    ];
    function I() {
      var H = jc(k, E, r, e), ut = H.distWidth, Dt = H.distHeight, vt = d ? (d + ut) / d : 1, gt = h ? (h + Dt) / h : 1;
      m[0] || (_[0] = ut / d), m[1] || (_[1] = Dt / h);
      var mt = (k[0] || E ? vt : 1) * _[0], wt = (k[1] || E ? gt : 1) * _[1];
      return mt === 0 && (mt = pe(c[0]) * la), wt === 0 && (wt = pe(c[1]) * la), [mt, wt];
    }
    var v = I();
    if (!i && t.props.groupable) {
      var N = M.snapRenderInfo || {}, R = N.direction;
      Vt(R) && (R[0] || R[1]) && (M.snapRenderInfo = { direction: f, request: e.isRequest });
    }
    ct(t, "onBeforeScale", Et(t, e, {
      scale: v,
      setFixedDirection: function(H) {
        return r.setFixedDirection(H), v = I(), v;
      },
      startFixedDirection: r.startFixedDirection,
      setScale: function(H) {
        v = H;
      }
    }, !0));
    var P = [
      v[0] / _[0],
      v[1] / _[1]
    ], A = o, B = [0, 0], X = pe(P[0] * P[1]), V = !o && !a && i;
    if (V || u ? A = Go(t, r.targetAllTransform, [0, 0], [0, 0], r) : o || (A = r.fixedPosition), i || (B = vv(t, P, f, !l && s, r)), E) {
      k[0] && k[1] && B[0] && B[1] && (Math.abs(B[0] * d) > Math.abs(B[1] * h) ? B[1] = 0 : B[0] = 0);
      var G = !B[0] && !B[1];
      if (G && (x ? P[0] = Ct(P[0] * _[0], w) / _[0] : P[1] = Ct(P[1] * _[1], w) / _[1]), k[0] && !k[1] || B[0] && !B[1] || G && x) {
        P[0] += B[0];
        var K = d * P[0] * _[0] / S;
        P[1] = pe(X * P[0]) * q(K / h / _[1]);
      } else if (!k[0] && k[1] || !B[0] && B[1] || G && !x) {
        P[1] += B[1];
        var U = h * P[1] * _[1] * S;
        P[0] = pe(X * P[1]) * q(U / d / _[0]);
      }
    } else
      P[0] += B[0], P[1] += B[1], B[0] || (P[0] = Ct(P[0] * _[0], w) / _[0]), B[1] || (P[1] = Ct(P[1] * _[1], w) / _[1]);
    P[0] === 0 && (P[0] = pe(c[0]) * la), P[1] === 0 && (P[1] = pe(c[1]) * la), v = yv(P, [_[0], _[1]]);
    var L = [
      d,
      h
    ], rt = [
      d * v[0],
      h * v[1]
    ];
    rt = _o(rt, r.minScaleSize, r.maxScaleSize, E ? S : !1), v = Pi(2, function(H) {
      return L[H] ? rt[H] / L[H] : rt[H];
    }), P = Pi(2, function(H) {
      return v[H] / _[H];
    });
    var nt = Pi(2, function(H) {
      return c[H] ? P[H] / c[H] : P[H];
    }), tt = "scale(".concat(P.join(", "), ")"), at = "scale(".concat(v.join(", "), ")"), J = qa(r, at, tt), ot = !m[0] || !m[1], ft = vh(t, ot ? at : tt, r.fixedDirection, A, r.fixedOffset, r, ot), bt = V ? ft : xt(ft, r.prevInverseDist || [0, 0]);
    if (r.prevDist = P, r.prevInverseDist = ft, v[0] === c[0] && v[1] === c[1] && bt.every(function(H) {
      return !H;
    }) && !D && !V)
      return !1;
    var pt = Et(t, e, O({ offsetWidth: d, offsetHeight: h, direction: f, scale: v, dist: P, delta: nt, isPinch: !!i }, Uu(t, J, bt, i, e)));
    return ct(t, "onScale", pt), pt;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (!r.isScale)
      return !1;
    r.isScale = !1;
    var n = Se(t, e, {});
    return ct(t, "onScaleEnd", n), n;
  },
  dragGroupControlCondition: Tl,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var a = ze(t, "resizable", e);
    r.moveableScale = t.scale;
    var i = Ze(t, this, "dragControlStart", e, function(u, c) {
      return za(t, u, r, c);
    }), o = function(u) {
      n.setFixedDirection(u), i.forEach(function(c, f) {
        c.setFixedDirection(u), za(t, c.moveable, r, a[f]);
      });
    };
    r.setFixedDirection = o;
    var s = O(O({}, n), { targets: t.props.targets, events: i, setFixedDirection: o }), l = ct(t, "onScaleGroupStart", s);
    return r.isScale = l !== !1, r.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isScale) {
      ti(t, "onBeforeScale", function(c) {
        ct(t, "onBeforeScaleGroup", Et(t, e, O(O({}, c), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = n.dist, i = r.moveableScale;
        t.scale = [
          a[0] * i[0],
          a[1] * i[1]
        ];
        var o = t.props.keepRatio, s = r.fixedPosition, l = Ze(t, this, "dragControl", e, function(c, f) {
          var d = j(ce(Rn(t.rotation / 180 * Math.PI, 3), [
            f.datas.originalX * a[0],
            f.datas.originalY * a[1],
            1
          ], 3), 2), h = d[0], g = d[1];
          return O(O({}, f), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: Rt(s, [h, g])
          });
        }), u = O({ targets: t.props.targets, events: l }, n);
        return ct(t, "onScaleGroup", u), u;
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
function ir(t, e) {
  return t.map(function(r, n) {
    return Ia(r, e[n], 1, 2);
  });
}
function Il(t, e, r) {
  var n = Kt(t, e), a = Kt(t, r), i = a - n;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function Fv(t, e) {
  var r = Il(t[0], t[1], t[2]), n = Il(e[0], e[1], e[2]), a = Math.PI;
  return !(r >= a && n <= a || r <= a && n >= a);
}
var Gv = {
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
  viewClassName: Uo("warpable"),
  render: function(t, e) {
    var r = t.props, n = r.resizable, a = r.scalable, i = r.warpable, o = r.zoom;
    if (n || a || !i)
      return [];
    var s = t.state, l = s.pos1, u = s.pos2, c = s.pos3, f = s.pos4, d = ir(l, u), h = ir(u, l), g = ir(l, c), m = ir(c, l), x = ir(c, f), S = ir(f, c), C = ir(u, f), w = ir(f, u);
    return et([
      e.createElement("div", { className: ht("line"), key: "middeLine1", style: vn(d, x, o) }),
      e.createElement("div", { className: ht("line"), key: "middeLine2", style: vn(h, S, o) }),
      e.createElement("div", { className: ht("line"), key: "middeLine3", style: vn(g, C, o) }),
      e.createElement("div", { className: ht("line"), key: "middeLine4", style: vn(m, w, o) })
    ], j(nc(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var r = e.inputEvent.target;
    return ae(r, ht("direction")) && ae(r, ht("warpable"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.inputEvent, a = t.props.target, i = n.target, o = Tc(i, r);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, u = s.is3d, c = s.targetTransform, f = s.targetMatrix, d = s.width, h = s.height, g = s.left, m = s.top;
    r.datas = {}, r.targetTransform = c, r.warpTargetMatrix = u ? f : Be(f, 3, 4), r.targetInverseMatrix = Iu(Ae(r.warpTargetMatrix, 4), 3, 4), r.direction = o, r.left = g, r.top = m, r.poses = [
      [0, 0],
      [d, 0],
      [0, h],
      [d, h]
    ].map(function(C) {
      return xt(C, l);
    }), r.nextPoses = r.poses.map(function(C) {
      var w = j(C, 2), D = w[0], k = w[1];
      return ce(r.warpTargetMatrix, [D, k, 0, 1], 4);
    }), r.startValue = Ft(4), r.prevMatrix = Ft(4), r.absolutePoses = Ie(s), r.posIndexes = Ku(o), Tr(t, e), Ka(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var x = Et(t, e, O({ set: function(C) {
      r.startValue = C;
    } }, Va(t, e))), S = ct(t, "onWarpStart", x);
    return S !== !1 && (r.isWarp = !0), r.isWarp;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isRequest, a = e.distX, i = e.distY, o = r.targetInverseMatrix, s = r.prevMatrix, l = r.isWarp, u = r.startValue, c = r.poses, f = r.posIndexes, d = r.absolutePoses;
    if (!l)
      return !1;
    if ($a(t, e, "matrix3d"), rn(t, "warpable")) {
      var h = f.map(function(I) {
        return d[I];
      });
      h.length > 1 && h.push([
        (h[0][0] + h[1][0]) / 2,
        (h[0][1] + h[1][1]) / 2
      ]);
      var g = Ja(t, n, {
        horizontal: h.map(function(I) {
          return I[1] + i;
        }),
        vertical: h.map(function(I) {
          return I[0] + a;
        })
      }), m = g.horizontal, x = g.vertical;
      i -= m.offset, a -= x.offset;
    }
    var S = He({ datas: r, distX: a, distY: i }, !0), C = r.nextPoses.slice();
    if (f.forEach(function(I) {
      C[I] = Rt(C[I], S);
    }), !ah.every(function(I) {
      return Fv(I.map(function(v) {
        return c[v];
      }), I.map(function(v) {
        return C[v];
      }));
    }))
      return !1;
    var w = Po(c[0], c[2], c[1], c[3], C[0], C[2], C[1], C[3]);
    if (!w.length)
      return !1;
    var D = Nt(o, w, 4), k = qu(r, D, !0), E = Nt(Ae(s, 4), k, 4);
    r.prevMatrix = k;
    var M = Nt(u, k, 4), _ = qa(r, "matrix3d(".concat(M.join(", "), ")"), "matrix3d(".concat(k.join(", "), ")"));
    return Fo(e, _), ct(t, "onWarp", Et(t, e, O({ delta: E, matrix: M, dist: k, multiply: Nt, transform: _ }, he({
      transform: _
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.isDrag;
    return r.isWarp ? (r.isWarp = !1, ct(t, "onWarpEnd", Se(t, e, {})), n) : !1;
  }
}, Lv = /* @__PURE__ */ ht("area-pieces"), ha = /* @__PURE__ */ ht("area-piece"), Ac = /* @__PURE__ */ ht("avoid"), Wv = ht("view-dragging");
function Oi(t) {
  var e = t.areaElement;
  if (e) {
    var r = t.state, n = r.width, a = r.height;
    _u(e, Ac), e.style.cssText += "left: 0px; top: 0px; width: ".concat(n, "px; height: ").concat(a, "px");
  }
}
function Rl(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: Lv },
    t.createElement("div", { className: ha }),
    t.createElement("div", { className: ha }),
    t.createElement("div", { className: ha }),
    t.createElement("div", { className: ha })
  );
}
var Bc = {
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
        e.createElement("div", { key: "area", ref: lr(t, "areaElement"), className: f }),
        Rl(e)
      ];
    if (!n || !a)
      return [];
    var d = Po([0, 0], [l, 0], [0, u], [l, u], c[0], c[1], c[2], c[3]), h = d.length ? Qa(d, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: lr(t, "areaElement"), className: f, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(u, "px"),
        transformOrigin: "0 0",
        transform: h
      } }),
      Rl(e)
    ];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    r.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, u = s.renderPoses, c = s.rootMatrix, f = s.is3d, d = l.left, h = l.top, g = Me(u), m = g.left, x = g.top, S = g.width, C = g.height, w = f ? 4 : 3, D = j(Zr(c, [n - d, a - h], w), 2), k = D[0], E = D[1];
    k -= m, E -= x;
    var M = [
      { left: m, top: x, width: S, height: E - 10 },
      { left: m, top: x, width: k - 10, height: C },
      { left: m, top: x + E + 10, width: S, height: C - E - 10 },
      { left: m + k + 10, top: x, width: S - k - 10, height: C }
    ], _ = [].slice.call(o.nextElementSibling.children);
    M.forEach(function(I, v) {
      _[v].style.cssText = "left: ".concat(I.left, "px;top: ").concat(I.top, "px; width: ").concat(I.width, "px; height: ").concat(I.height, "px;");
    }), To(o, Ac), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var r = e.datas, n = e.inputEvent;
    if (this.enableNativeEvent(t), !n)
      return !1;
    r.isDragArea || (r.isDragArea = !0, Oi(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var r = e.inputEvent, n = e.datas;
    if (!r)
      return !1;
    n.isDragArea || Oi(t);
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
    Oi(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && Mu(function() {
      e.disableNativeEvent = !1;
    });
  }
}, Yv = jn("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var r = t.props, n = r.zoom, a = r.svgOrigin, i = r.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, u = o.svg, c = o.allMatrix, f = o.is3d, d = o.left, h = o.top, g = o.offsetWidth, m = o.offsetHeight, x;
    if (!i && u && a) {
      var S = j(Qo(a, g, m), 2), C = S[0], w = S[1], D = f ? 4 : 3, k = Yt(c, [C, w], D);
      x = Ga(l, n, xt(k, [d, h]));
    } else
      x = Ga(l, n, s);
    return [
      e.createElement("div", { className: ht("control", "origin"), style: x, key: "beforeOrigin" })
    ];
  }
});
function Xv(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var Hv = {
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
    var r = t.props, n = r.scrollContainer, a = n === void 0 ? t.getContainer() : n, i = r.scrollOptions, o = new Nu(), s = Xe(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", u = e.targets;
    o.on("scroll", function(c) {
      var f = c.container, d = c.direction, h = Et(t, e, {
        scrollContainer: f,
        direction: d
      }), g = u ? "onScrollGroup" : "onScroll";
      u && (h.targets = u), ct(t, g, h);
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
      var n = t.props, a = n.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = n.scrollThreshold, s = o === void 0 ? 0 : o, l = n.scrollThrottleTime, u = l === void 0 ? 0 : l, c = n.getScrollPosition, f = c === void 0 ? Xv : c, d = n.scrollOptions;
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
}, Fc = {
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
}, $v = jn("padding", {
  props: ["padding"],
  render: function(t, e) {
    var r = t.props;
    if (r.dragArea)
      return [];
    var n = zc(r.padding || {}), a = n.left, i = n.top, o = n.right, s = n.bottom, l = t.getState(), u = l.renderPoses, c = l.pos1, f = l.pos2, d = l.pos3, h = l.pos4, g = [c, f, d, h], m = [];
    return a > 0 && m.push([0, 2]), i > 0 && m.push([0, 1]), o > 0 && m.push([1, 3]), s > 0 && m.push([2, 3]), m.map(function(x, S) {
      var C = j(x, 2), w = C[0], D = C[1], k = g[w], E = g[D], M = u[w], _ = u[D], I = Po([0, 0], [100, 0], [0, 100], [100, 100], k, E, M, _);
      if (I.length)
        return e.createElement("div", { key: "padding".concat(S), className: ht("padding"), style: {
          transform: Qa(I, !0)
        } });
    });
  }
}), Pl = ["nw", "ne", "se", "sw"];
function va(t, e) {
  var r = t[0] + t[1], n = r > e ? e / r : 1;
  return t[0] *= n, t[1] = e - t[1] * n, t;
}
var qv = [1, 2, 5, 6], Vv = [0, 3, 4, 7], yr = [1, -1, -1, 1], br = [1, 1, -1, -1];
function ts(t, e, r, n, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = r), s === void 0 && (s = n);
  var l = [], u = !1, c = t.filter(function(d) {
    return !d.virtual;
  }), f = c.map(function(d) {
    var h = d.horizontal, g = d.vertical, m = d.pos;
    if (g && !u && (u = !0, l.push("/")), u) {
      var x = Math.max(0, g === 1 ? m[1] - i : s - m[1]);
      return l.push(Oe(x, n, e)), x;
    } else {
      var x = Math.max(0, h === 1 ? m[0] - a : o - m[0]);
      return l.push(Oe(x, r, e)), x;
    }
  });
  return {
    radiusPoses: c,
    styles: l,
    raws: f
  };
}
function Gc(t) {
  for (var e = [0, 0], r = [0, 0], n = t.length, a = 0; a < n; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, r[0] = a + 1), i.vertical && (r[1] === 0 && (r[0] = a), r[1] = a - r[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: r
  };
}
function Lc(t, e, r, n, a, i, o) {
  var s, l, u, c;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var f = t.indexOf("/"), d = (f > -1 ? t.slice(0, f) : t).length, h = t.slice(0, d), g = t.slice(d + 1), m = h.length, x = g.length, S = x > 0, C = j(h, 4), w = C[0], D = w === void 0 ? "0px" : w, k = C[1], E = k === void 0 ? D : k, M = C[2], _ = M === void 0 ? D : M, I = C[3], v = I === void 0 ? E : I, N = j(g, 4), R = N[0], P = R === void 0 ? D : R, A = N[1], B = A === void 0 ? S ? P : E : A, X = N[2], V = X === void 0 ? S ? P : _ : X, G = N[3], K = G === void 0 ? S ? B : v : G, U = [D, E, _, v].map(function(J) {
    return jt(J, e);
  }), L = [P, B, V, K].map(function(J) {
    return jt(J, r);
  }), rt = U.slice(), nt = L.slice();
  s = j(va([rt[0], rt[1]], e), 2), rt[0] = s[0], rt[1] = s[1], l = j(va([rt[3], rt[2]], e), 2), rt[3] = l[0], rt[2] = l[1], u = j(va([nt[0], nt[3]], r), 2), nt[0] = u[0], nt[3] = u[1], c = j(va([nt[1], nt[2]], r), 2), nt[1] = c[0], nt[2] = c[1];
  var tt = o ? rt : rt.slice(0, Math.max(i[0], m)), at = o ? nt : nt.slice(0, Math.max(i[1], x));
  return et(et([], j(tt.map(function(J, ot) {
    var ft = Pl[ot];
    return {
      virtual: ot >= m,
      horizontal: yr[ot],
      vertical: 0,
      pos: [n + J, a + (br[ot] === -1 ? r : 0)],
      sub: !0,
      raw: U[ot],
      direction: ft
    };
  })), !1), j(at.map(function(J, ot) {
    var ft = Pl[ot];
    return {
      virtual: ot >= x,
      horizontal: 0,
      vertical: br[ot],
      pos: [n + (yr[ot] === -1 ? e : 0), a + J],
      sub: !0,
      raw: L[ot],
      direction: ft
    };
  })), !1);
}
function Kv(t, e, r, n, a) {
  a === void 0 && (a = e.length);
  var i = Gc(t.slice(n)), o = i.horizontalRange, s = i.verticalRange, l = r - n, u = 0;
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
function Uv(t, e, r, n, a, i, o, s, l, u, c) {
  u === void 0 && (u = 0), c === void 0 && (c = 0);
  var f = Gc(t.slice(r)), d = f.horizontalRange, h = f.verticalRange;
  if (n > -1)
    for (var g = yr[n] === 1 ? i - u : s - i, m = d[1]; m <= n; ++m) {
      var x = br[m] === 1 ? c : l, S = 0;
      if (n === m ? S = i : m === 0 ? S = u + g : yr[m] === -1 && (S = s - (e[r][0] - u)), t.splice(r + m, 0, {
        horizontal: yr[m],
        vertical: 0,
        pos: [S, x]
      }), e.splice(r + m, 0, [S, x]), m === 0)
        break;
    }
  else if (a > -1) {
    var C = br[a] === 1 ? o - c : l - o;
    if (d[1] === 0 && h[1] === 0) {
      var w = [
        u + C,
        c
      ];
      t.push({
        horizontal: yr[0],
        vertical: 0,
        pos: w
      }), e.push(w);
    }
    for (var D = h[0], m = h[1]; m <= a; ++m) {
      var S = yr[m] === 1 ? u : s, x = 0;
      if (a === m ? x = o : m === 0 ? x = c + C : br[m] === 1 ? x = e[r + D][1] : br[m] === -1 && (x = l - (e[r + D][1] - c)), t.push({
        horizontal: 0,
        vertical: br[m],
        pos: [S, x]
      }), e.push([S, x]), m === 0)
        break;
    }
  }
}
function Zv(t, e) {
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
var Jv = [
  [0, -1, "n"],
  [1, 0, "e"]
], Qv = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function es(t, e, r) {
  var n = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, u = s.poses, c = l === "rect", f = l === "circle";
  if (l === "polygon")
    return r.map(function(E) {
      return "".concat(Oe(E[0], i, n), " ").concat(Oe(E[1], o, n));
    });
  if (c || l === "inset") {
    var d = r[1][1], h = r[3][0], g = r[7][0], m = r[5][1];
    if (c)
      return [
        d,
        h,
        m,
        g
      ].map(function(E) {
        return "".concat(E, "px");
      });
    var x = [d, i - h, o - m, g].map(function(E, M) {
      return Oe(E, M % 2 ? i : o, n);
    });
    if (r.length > 8) {
      var S = j(xt(r[4], r[0]), 2), C = S[0], w = S[1];
      x.push.apply(x, et(["round"], j(ts(u.slice(8).map(function(E, M) {
        return O(O({}, E), { pos: r[M] });
      }), n, C, w, g, d, h, m).styles), !1));
    }
    return x;
  } else if (f || l === "ellipse") {
    var D = r[0], k = Oe(q(r[1][1] - D[1]), f ? Math.sqrt((i * i + o * o) / 2) : o, n), x = f ? [k] : [Oe(q(r[2][0] - D[0]), i, n), k];
    return x.push("at", Oe(D[0], i, n), Oe(D[1], o, n)), x;
  }
}
function Wa(t, e, r, n) {
  var a = [n, (n + e) / 2, e], i = [t, (t + r) / 2, r];
  return Qv.map(function(o) {
    var s = j(o, 3), l = s[0], u = s[1], c = s[2], f = a[l + 1], d = i[u + 1];
    return {
      vertical: q(u),
      horizontal: q(l),
      direction: c,
      pos: [f, d]
    };
  });
}
function Wc(t) {
  var e = [1 / 0, -1 / 0], r = [1 / 0, -1 / 0];
  return t.forEach(function(n) {
    var a = n.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), r[0] = Math.min(r[0], a[1]), r[1] = Math.max(r[1], a[1]);
  }), [
    q(e[1] - e[0]),
    q(r[1] - r[0])
  ];
}
function Ol(t, e, r, n, a) {
  var i, o, s, l, u, c, f, d, h;
  if (t) {
    var g = a;
    if (!g) {
      var m = me(t), x = m("clipPath");
      g = x !== "none" ? x : m("clip");
    }
    if (!((!g || g === "none" || g === "auto") && (g = n, !g))) {
      var S = ku(g), C = S.prefix, w = C === void 0 ? g : C, D = S.value, k = D === void 0 ? "" : D, E = w === "circle", M = " ";
      if (w === "polygon") {
        var _ = Sr(k || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        M = ",";
        var I = _.map(function(Tt) {
          var Xt = j(Tt.split(" "), 2), Ht = Xt[0], zt = Xt[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              jt(Ht, e),
              jt(zt, r)
            ]
          };
        }), v = kr(I.map(function(Tt) {
          return Tt.pos;
        }));
        return {
          type: w,
          clipText: g,
          poses: I,
          splitter: M,
          left: v.minX,
          right: v.maxX,
          top: v.minY,
          bottom: v.maxY
        };
      } else if (E || w === "ellipse") {
        var N = "", R = "", P = 0, A = 0, _ = ur(k);
        if (E) {
          var B = "";
          i = j(_, 4), o = i[0], B = o === void 0 ? "50%" : o, s = i[2], N = s === void 0 ? "50%" : s, l = i[3], R = l === void 0 ? "50%" : l, P = jt(B, Math.sqrt((e * e + r * r) / 2)), A = P;
        } else {
          var X = "", V = "";
          u = j(_, 5), c = u[0], X = c === void 0 ? "50%" : c, f = u[1], V = f === void 0 ? "50%" : f, d = u[3], N = d === void 0 ? "50%" : d, h = u[4], R = h === void 0 ? "50%" : h, P = jt(X, e), A = jt(V, r);
        }
        var G = [
          jt(N, e),
          jt(R, r)
        ], I = et([
          {
            vertical: 1,
            horizontal: 1,
            pos: G,
            direction: "nesw"
          }
        ], j(Jv.slice(0, E ? 1 : 2).map(function(Ht) {
          return {
            vertical: q(Ht[1]),
            horizontal: Ht[0],
            direction: Ht[2],
            sub: !0,
            pos: [
              G[0] + Ht[0] * P,
              G[1] + Ht[1] * A
            ]
          };
        })), !1);
        return {
          type: w,
          clipText: g,
          radiusX: P,
          radiusY: A,
          left: G[0] - P,
          top: G[1] - A,
          right: G[0] + P,
          bottom: G[1] + A,
          poses: I,
          splitter: M
        };
      } else if (w === "inset") {
        var _ = ur(k || "0 0 0 0"), K = _.indexOf("round"), U = (K > -1 ? _.slice(0, K) : _).length, L = _.slice(U + 1), rt = j(_.slice(0, U), 4), nt = rt[0], tt = rt[1], at = tt === void 0 ? nt : tt, J = rt[2], ot = J === void 0 ? nt : J, ft = rt[3], bt = ft === void 0 ? at : ft, pt = j([nt, ot].map(function(Ht) {
          return jt(Ht, r);
        }), 2), H = pt[0], ut = pt[1], Dt = j([bt, at].map(function(Ht) {
          return jt(Ht, e);
        }), 2), vt = Dt[0], gt = Dt[1], mt = e - gt, wt = r - ut, Mt = Lc(L, mt - vt, wt - H, vt, H), I = et(et([], j(Wa(H, mt, wt, vt)), !1), j(Mt), !1);
        return {
          type: "inset",
          clipText: g,
          poses: I,
          top: H,
          left: vt,
          right: mt,
          bottom: wt,
          radius: L,
          splitter: M
        };
      } else if (w === "rect") {
        var _ = Sr(k || "0px, ".concat(e, "px, ").concat(r, "px, 0px"));
        M = ",";
        var St = j(_.map(function(Ut) {
          var Ce = wr(Ut).value;
          return Ce;
        }), 4), dt = St[0], gt = St[1], ut = St[2], vt = St[3], I = Wa(dt, gt, ut, vt);
        return {
          type: "rect",
          clipText: g,
          poses: I,
          top: dt,
          right: gt,
          bottom: ut,
          left: vt,
          values: _,
          splitter: M
        };
      }
    }
  }
}
function tg(t, e, r, n, a) {
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
    var g = j(Wc(t), 2), m = g[0], x = g[1], S = m && x ? m / x : 0;
    if (S && a) {
      var C = (e + 4) % 8, w = t[C].pos, D = [0, 0];
      o.indexOf("w") > -1 ? D[0] = -1 : o.indexOf("e") > -1 && (D[0] = 1), o.indexOf("n") > -1 ? D[1] = -1 : o.indexOf("s") > -1 && (D[1] = 1);
      var k = Oc([m, x], r, S, D, !0), E = m + k[0], M = x + k[1], _ = w[1], I = w[1], v = w[0], N = w[0];
      D[0] === -1 ? v = N - E : D[0] === 1 ? N = v + E : (v = v - E / 2, N = N + E / 2), D[1] === -1 ? _ = I - M : (D[1] === 1 || (_ = I - M / 2), I = _ + M);
      var R = Wa(_, N, I, v);
      t.forEach(function(P, A) {
        l[A][0] = R[A].pos[0] - P.pos[0], l[A][1] = R[A].pos[1] - P.pos[1];
      });
    } else
      t.forEach(function(P, A) {
        var B = P.direction;
        B && (B.indexOf(d) > -1 && (l[A][0] = r[0]), B.indexOf(h) > -1 && (l[A][1] = r[1]));
      }), d && (l[1][0] = r[0] / 2, l[5][0] = r[0] / 2), h && (l[3][1] = r[1] / 2, l[7][1] = r[1] / 2);
  } else o && !s ? u.forEach(function(P) {
    var A = P === "n" || P === "s";
    t.forEach(function(B, X) {
      var V = B.direction, G = B.horizontal, K = B.vertical;
      !V || V.indexOf(P) === -1 || (l[X] = [
        A || !G ? 0 : r[0],
        !A || !K ? 0 : r[1]
      ]);
    });
  }) : l[e] = r;
  return l;
}
function eg(t, e) {
  var r = j($u(t, e), 2), n = r[0], a = r[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, u = l.type, c = l.poses, f = l.splitter, d = c.map(function(C) {
    return C.pos;
  });
  if (u === "polygon")
    d.splice(s, 0, [n, a]);
  else if (u === "inset") {
    var h = qv.indexOf(s), g = Vv.indexOf(s), m = c.length;
    if (Uv(c, d, 8, h, g, n, a, d[4][0], d[4][1], d[0][0], d[0][1]), m === c.length)
      return;
  } else
    return;
  var x = es(t, o, d), S = "".concat(u, "(").concat(x.join(f), ")");
  ct(t, "onClip", Et(t, e, O({ clipEventType: "added", clipType: u, poses: d, clipStyles: x, clipStyle: S, distX: 0, distY: 0 }, he({
    clipPath: S
  }, e))));
}
function rg(t, e) {
  var r = e.datas, n = r.clipPath, a = r.clipIndex, i = n, o = i.type, s = i.poses, l = i.splitter, u = s.map(function(h) {
    return h.pos;
  }), c = u.length;
  if (o === "polygon")
    s.splice(a, 1), u.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (Kv(s, u, a, 8, c), c === s.length))
      return;
  } else
    return;
  var f = es(t, n, u), d = "".concat(o, "(").concat(f.join(l), ")");
  ct(t, "onClip", Et(t, e, O({ clipEventType: "removed", clipType: o, poses: u, clipStyles: f, clipStyle: d, distX: 0, distY: 0 }, he({
    clipPath: d
  }, e))));
}
var ng = {
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
    var r = t.props, n = r.customClipPath, a = r.defaultClipPath, i = r.clipArea, o = r.zoom, s = r.groupable, l = t.getState(), u = l.target, c = l.width, f = l.height, d = l.allMatrix, h = l.is3d, g = l.left, m = l.top, x = l.pos1, S = l.pos2, C = l.pos3, w = l.pos4, D = l.clipPathState, k = l.snapBoundInfos, E = l.rotation;
    if (!u || s)
      return [];
    var M = Ol(u, c, f, a || "inset", D || n);
    if (!M)
      return [];
    var _ = h ? 4 : 3, I = M.type, v = M.poses, N = v.map(function(gt) {
      var mt = Yt(d, gt.pos, _);
      return [
        mt[0] - g,
        mt[1] - m
      ];
    }), R = [], P = [], A = I === "rect", B = I === "inset", X = I === "polygon";
    if (A || B || X) {
      var V = B ? N.slice(0, 8) : N;
      P = V.map(function(gt, mt) {
        var wt = mt === 0 ? V[V.length - 1] : V[mt - 1], Mt = Kt(wt, gt), St = Ec(wt, gt);
        return e.createElement("div", { key: "clipLine".concat(mt), className: ht("line", "clip-line", "snap-control"), "data-clip-index": mt, style: {
          width: "".concat(St, "px"),
          transform: "translate(".concat(wt[0], "px, ").concat(wt[1], "px) rotate(").concat(Mt, "rad) scaleY(").concat(o, ")")
        } });
      });
    }
    if (R = N.map(function(gt, mt) {
      return e.createElement("div", { key: "clipControl".concat(mt), className: ht("control", "clip-control", "snap-control"), "data-clip-index": mt, style: {
        transform: "translate(".concat(gt[0], "px, ").concat(gt[1], "px) rotate(").concat(E, "rad) scale(").concat(o, ")")
      } });
    }), B && R.push.apply(R, et([], j(N.slice(8).map(function(gt, mt) {
      return e.createElement("div", { key: "clipRadiusControl".concat(mt), className: ht("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + mt, style: {
        transform: "translate(".concat(gt[0], "px, ").concat(gt[1], "px) rotate(").concat(E, "rad) scale(").concat(o, ")")
      } });
    })), !1)), I === "circle" || I === "ellipse") {
      var G = M.left, K = M.top, U = M.radiusX, L = M.radiusY, rt = j(xt(Yt(d, [G, K], _), Yt(d, [0, 0], _)), 2), nt = rt[0], tt = rt[1], at = "none";
      if (!i) {
        for (var J = Math.max(10, U / 5, L / 5), ot = [], ft = 0; ft <= J; ++ft) {
          var bt = Math.PI * 2 / J * ft;
          ot.push([
            U + (U - o) * Math.cos(bt),
            L + (L - o) * Math.sin(bt)
          ]);
        }
        ot.push([U, -2]), ot.push([-2, -2]), ot.push([-2, L * 2 + 2]), ot.push([U * 2 + 2, L * 2 + 2]), ot.push([U * 2 + 2, -2]), ot.push([U, -2]), at = "polygon(".concat(ot.map(function(gt) {
          return "".concat(gt[0], "px ").concat(gt[1], "px");
        }).join(", "), ")");
      }
      R.push(e.createElement("div", { key: "clipEllipse", className: ht("clip-ellipse", "snap-control"), style: {
        width: "".concat(U * 2, "px"),
        height: "".concat(L * 2, "px"),
        clipPath: at,
        transform: "translate(".concat(-g + nt, "px, ").concat(-m + tt, "px) ").concat(Qa(d))
      } }));
    }
    if (i) {
      var pt = Me(et([x, S, C, w], j(N), !1)), H = pt.width, ut = pt.height, Dt = pt.left, vt = pt.top;
      if (X || A || B) {
        var ot = B ? N.slice(0, 8) : N;
        R.push(e.createElement("div", { key: "clipArea", className: ht("clip-area", "snap-control"), style: {
          width: "".concat(H, "px"),
          height: "".concat(ut, "px"),
          transform: "translate(".concat(Dt, "px, ").concat(vt, "px)"),
          clipPath: "polygon(".concat(ot.map(function(mt) {
            return "".concat(mt[0] - Dt, "px ").concat(mt[1] - vt, "px");
          }).join(", "), ")")
        } }));
      }
    }
    return k && ["vertical", "horizontal"].forEach(function(gt) {
      var mt = k[gt], wt = gt === "horizontal";
      mt.isSnap && P.push.apply(P, et([], j(mt.snap.posInfos.map(function(Mt, St) {
        var dt = Mt.pos, Tt = xt(Yt(d, wt ? [0, dt] : [dt, 0], _), [g, m]), Xt = xt(Yt(d, wt ? [c, dt] : [dt, f], _), [g, m]);
        return _n(e, "", Tt, Xt, o, "clip".concat(gt, "snap").concat(St), "guideline");
      })), !1)), mt.isBound && P.push.apply(P, et([], j(mt.bounds.map(function(Mt, St) {
        var dt = Mt.pos, Tt = xt(Yt(d, wt ? [0, dt] : [dt, 0], _), [g, m]), Xt = xt(Yt(d, wt ? [c, dt] : [dt, f], _), [g, m]);
        return _n(e, "", Tt, Xt, o, "clip".concat(gt, "bounds").concat(St), "guideline", "bounds", "bold");
      })), !1));
    }), et(et([], j(R), !1), j(P), !1);
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
    var r = t.state, n = t.props, a = n.defaultClipPath, i = n.customClipPath, o = r.target, s = r.width, l = r.height, u = e.inputEvent ? e.inputEvent.target : null, c = u && u.getAttribute("class") || "", f = e.datas, d = Ol(o, s, l, a || "inset", i);
    if (!d)
      return !1;
    var h = d.clipText, g = d.type, m = d.poses, x = ct(t, "onClipStart", Et(t, e, {
      clipType: g,
      clipStyle: h,
      poses: m.map(function(S) {
        return S.pos;
      })
    }));
    return x === !1 ? (f.isClipStart = !1, !1) : (f.isControl = c && c.indexOf("clip-control") > -1, f.isLine = c.indexOf("clip-line") > -1, f.isArea = c.indexOf("clip-area") > -1 || c.indexOf("clip-ellipse") > -1, f.clipIndex = u ? parseInt(u.getAttribute("data-clip-index"), 10) : -1, f.clipPath = d, f.isClipStart = !0, r.clipPathState = h, Tr(t, e), !0);
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, u = l.isControl, c = l.isLine, f = l.isArea, d = l.clipIndex, h = l.clipPath;
    if (!h)
      return !1;
    var g = Mr(t.props, "clippable"), m = g.keepRatio, x = 0, S = 0, C = o.draggable, w = He(e);
    s && C ? (r = j(C.prevBeforeDist, 2), x = r[0], S = r[1]) : (n = j(w, 2), x = n[0], S = n[1]);
    var D = [x, S], k = t.state, E = k.width, M = k.height, _ = !f && !u && !c, I = h.type, v = h.poses, N = h.splitter, R = v.map(function(It) {
      return It.pos;
    });
    _ && (x = -x, S = -S);
    var P = !u || v[d].direction === "nesw", A = I === "inset" || I === "rect", B = v.map(function() {
      return [0, 0];
    });
    if (u && !P) {
      var X = v[d], V = X.horizontal, G = X.vertical, K = [
        x * q(V),
        S * q(G)
      ];
      B = tg(v, d, K, A, m);
    } else P && (B = R.map(function() {
      return [x, S];
    }));
    var U = R.map(function(It, Bt) {
      return Rt(It, B[Bt]);
    }), L = et([], j(U), !1);
    k.snapBoundInfos = null;
    var rt = h.type === "circle", nt = h.type === "ellipse";
    if (rt || nt) {
      var tt = Me(U), at = q(tt.bottom - tt.top), J = q(nt ? tt.right - tt.left : at), ot = U[0][1] + at, ft = U[0][0] - J, bt = U[0][0] + J;
      rt && (L.push([bt, tt.bottom]), B.push([1, 0])), L.push([tt.left, ot]), B.push([0, 1]), L.push([ft, tt.bottom]), B.push([1, 0]);
    }
    var pt = xc((g.clipHorizontalGuidelines || []).map(function(It) {
      return jt("".concat(It), M);
    }), (g.clipVerticalGuidelines || []).map(function(It) {
      return jt("".concat(It), E);
    }), E, M), H = [], ut = [];
    if (rt || nt)
      H = [L[4][0], L[2][0]], ut = [L[1][1], L[3][1]];
    else if (A) {
      var Dt = [L[0], L[2], L[4], L[6]], vt = [B[0], B[2], B[4], B[6]];
      H = Dt.filter(function(It, Bt) {
        return vt[Bt][0];
      }).map(function(It) {
        return It[0];
      }), ut = Dt.filter(function(It, Bt) {
        return vt[Bt][1];
      }).map(function(It) {
        return It[1];
      });
    } else
      H = L.filter(function(It, Bt) {
        return B[Bt][0];
      }).map(function(It) {
        return It[0];
      }), ut = L.filter(function(It, Bt) {
        return B[Bt][1];
      }).map(function(It) {
        return It[1];
      });
    var gt = [0, 0], mt = ml(pt, g.clipTargetBounds && { left: 0, top: 0, right: E, bottom: M }, H, ut, 5, 5), wt = mt.horizontal, Mt = mt.vertical, St = wt.offset, dt = Mt.offset;
    if (wt.isBound && (gt[1] += St), Mt.isBound && (gt[0] += dt), (nt || rt) && B[0][0] === 0 && B[0][1] === 0) {
      var tt = Me(U), Tt = tt.bottom - tt.top, Xt = nt ? tt.right - tt.left : Tt, Ht = Mt.isBound ? q(dt) : Mt.snapIndex === 0 ? -dt : dt, zt = wt.isBound ? q(St) : wt.snapIndex === 0 ? -St : St;
      Xt -= Ht, Tt -= zt, rt && (Tt = cc(Mt, wt) > 0 ? Tt : Xt, Xt = Tt);
      var At = L[0];
      L[1][1] = At[1] - Tt, L[2][0] = At[0] + Xt, L[3][1] = At[1] + Tt, L[4][0] = At[0] - Xt;
    } else if (A && m && u) {
      var Ut = j(Wc(v), 2), Ce = Ut[0], pr = Ut[1], Bn = Ce && pr ? Ce / pr : 0, Fn = v[d], Rr = Fn.direction || "", $e = L[1][1], ot = L[5][1], ft = L[7][0], bt = L[3][0];
      q(St) <= q(dt) ? St = pe(St) * q(dt) / Bn : dt = pe(dt) * q(St) * Bn, Rr.indexOf("w") > -1 ? ft -= dt : Rr.indexOf("e") > -1 ? bt -= dt : (ft += dt / 2, bt -= dt / 2), Rr.indexOf("n") > -1 ? $e -= St : Rr.indexOf("s") > -1 ? ot -= St : ($e += St / 2, ot -= St / 2);
      var Gn = Wa($e, bt, ot, ft);
      L.forEach(function(Pe, er) {
        var nn;
        nn = j(Gn[er].pos, 2), Pe[0] = nn[0], Pe[1] = nn[1];
      });
    } else
      L.forEach(function(It, Bt) {
        var Zt = B[Bt];
        Zt[0] && (It[0] -= dt), Zt[1] && (It[1] -= St);
      });
    var hr = es(t, h, U), Qe = "".concat(I, "(").concat(hr.join(N), ")");
    if (k.clipPathState = Qe, rt || nt)
      H = [L[4][0], L[2][0]], ut = [L[1][1], L[3][1]];
    else if (A) {
      var Dt = [L[0], L[2], L[4], L[6]];
      H = Dt.map(function(Bt) {
        return Bt[0];
      }), ut = Dt.map(function(Bt) {
        return Bt[1];
      });
    } else
      H = L.map(function(It) {
        return It[0];
      }), ut = L.map(function(It) {
        return It[1];
      });
    if (k.snapBoundInfos = ml(pt, g.clipTargetBounds && { left: 0, top: 0, right: E, bottom: M }, H, ut, 1, 1), C) {
      var tr = k.is3d, ei = k.allMatrix, Re = tr ? 4 : 3, _t = gt;
      s && (_t = [
        D[0] + gt[0] - w[0],
        D[1] + gt[1] - w[1]
      ]), C.deltaOffset = Nt(ei, [_t[0], _t[1], 0, 0], Re);
    }
    return ct(t, "onClip", Et(t, e, O({ clipEventType: "changed", clipType: I, poses: U, clipStyle: Qe, clipStyles: hr, distX: x, distY: S }, he((a = {}, a[I === "rect" ? "clip" : "clipPath"] = Qe, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var r = e.isDrag, n = e.datas, a = e.isDouble, i = n.isLine, o = n.isClipStart, s = n.isControl;
    return o ? (ct(t, "onClipEnd", Se(t, e, {})), a && (s ? rg(t, e) : i && eg(t, e)), a || r) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, ag = {
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
    return e.isRequest ? e.requestAble === "originDraggable" : ae(e.inputEvent.target, ht("origin"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas;
    Tr(t, e);
    var n = Et(t, e, {
      dragStart: de.dragStart(t, new Vr().dragStart([0, 0], e))
    }), a = ct(t, "onDragOriginStart", n);
    return r.startOrigin = t.state.transformOrigin, r.startTargetOrigin = t.state.targetOrigin, r.prevOrigin = [0, 0], r.isDragOrigin = !0, a === !1 ? (r.isDragOrigin = !1, !1) : n;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.isRequest;
    if (!r.isDragOrigin)
      return !1;
    var i = j(He(e), 2), o = i[0], s = i[1], l = t.state, u = l.width, c = l.height, f = l.offsetMatrix, d = l.targetMatrix, h = l.is3d, g = t.props.originRelative, m = g === void 0 ? !0 : g, x = h ? 4 : 3, S = [o, s];
    if (a) {
      var C = e.distOrigin;
      (C[0] || C[1]) && (S = C);
    }
    var w = Rt(r.startOrigin, S), D = Rt(r.startTargetOrigin, S), k = xt(S, r.prevOrigin), E = zn(f, d, w, x), M = t.getRect(), _ = Me(Ir(E, u, c, x)), I = [
      M.left - _.left,
      M.top - _.top
    ];
    r.prevOrigin = S;
    var v = [
      Oe(D[0], u, m),
      Oe(D[1], c, m)
    ].join(" "), N = de.drag(t, Nn(e, t.state, I, !!n)), R = Et(t, e, O(O({ width: u, height: c, origin: w, dist: S, delta: k, transformOrigin: v, drag: N }, he({
      transformOrigin: v,
      transform: N.transform
    }, e)), { afterTransform: N.transform }));
    return ct(t, "onDragOrigin", R), R;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    return r.isDragOrigin ? (ct(t, "onDragOriginEnd", Se(t, e, {})), !0) : !1;
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
function ig(t, e, r, n) {
  var a = t.filter(function(l) {
    var u = l.virtual, c = l.horizontal;
    return c && !u;
  }).length, i = t.filter(function(l) {
    var u = l.virtual, c = l.vertical;
    return c && !u;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    og(t, o), o < 4 ? s.pos[0] = r : s.pos[1] = n;
  }
}
function og(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(r) {
    r.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(r) {
    r.virtual = !1;
  }));
}
function sg(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(r) {
    r.virtual = !0;
  }) : t.slice(e).forEach(function(r) {
    r.virtual = !0;
  });
}
function jl(t, e, r, n, a) {
  n === void 0 && (n = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = ur(t), Lc(i, e, r, 0, 0, n, a);
}
function Nl(t, e, r, n, a) {
  var i = t.state, o = i.width, s = i.height, l = ts(a, t.props.roundRelative, o, s), u = l.raws, c = l.styles, f = l.radiusPoses, d = Zv(f, u), h = d.horizontals, g = d.verticals, m = c.join(" ");
  i.borderRadiusState = m;
  var x = Et(t, e, O({ horizontals: h, verticals: g, borderRadius: m, width: o, height: s, delta: n, dist: r }, he({
    borderRadius: m
  }, e)));
  return ct(t, "onRound", x), x;
}
function zl(t) {
  var e, r, n = t.getState().style, a = n.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (r = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && r !== void 0 ? r : "", n.borderRadius = a) : (a = Ko(o).borderRadius, n.borderRadius = a));
  }
  return a;
}
var lg = {
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
    var r = t.getState(), n = r.target, a = r.width, i = r.height, o = r.allMatrix, s = r.is3d, l = r.left, u = r.top, c = r.borderRadiusState, f = t.props, d = f.minRoundControls, h = d === void 0 ? [0, 0] : d, g = f.maxRoundControls, m = g === void 0 ? [4, 4] : g, x = f.zoom, S = f.roundPadding, C = S === void 0 ? 0 : S, w = f.isDisplayShadowRoundControls, D = f.groupable;
    if (!n)
      return null;
    var k = c || zl(t), E = s ? 4 : 3, M = jl(k, a, i, h, !0);
    if (!M)
      return null;
    var _ = 0, I = 0, v = D ? [0, 0] : [l, u];
    return M.map(function(N, R) {
      var P = N.horizontal, A = N.vertical, B = N.direction || "", X = et([], j(N.pos), !1);
      I += Math.abs(P), _ += Math.abs(A), P && B.indexOf("n") > -1 && (X[1] -= C), A && B.indexOf("w") > -1 && (X[0] -= C), P && B.indexOf("s") > -1 && (X[1] += C), A && B.indexOf("e") > -1 && (X[0] += C);
      var V = xt(Yt(o, X, E), v), G = w && w !== "horizontal", K = N.vertical ? _ <= m[1] && (G || !N.virtual) : I <= m[0] && (w || !N.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(R), className: ht("control", "border-radius", N.vertical ? "vertical" : "", N.virtual ? "virtual" : ""), "data-radius-index": R, style: {
        display: K ? "block" : "none",
        transform: "translate(".concat(V[0], "px, ").concat(V[1], "px) scale(").concat(x, ")")
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
    n.lineIndex = u, n.controlIndex = l, n.isControl = o, n.isLine = s, Tr(t, e);
    var h = t.props, g = h.roundRelative, m = h.minRoundControls, x = m === void 0 ? [0, 0] : m, S = t.state, C = S.width, w = S.height;
    n.isRound = !0, n.prevDist = [0, 0];
    var D = zl(t), k = jl(D || "", C, w, x, !0) || [];
    return n.controlPoses = k, S.borderRadiusState = ts(k, g, C, w).styles.join(" "), f;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = r.controlPoses;
    if (!r.isRound || !r.isControl || !n.length)
      return !1;
    var a = r.controlIndex, i = j(He(e), 2), o = i[0], s = i[1], l = [o, s], u = xt(l, r.prevDist), c = t.props.maxRoundControls, f = c === void 0 ? [4, 4] : c, d = t.state, h = d.width, g = d.height, m = n[a], x = m.vertical, S = m.horizontal, C = n.map(function(D) {
      var k = D.horizontal, E = D.vertical, M = [
        k * S * l[0],
        E * x * l[1]
      ];
      if (k) {
        if (f[0] === 1)
          return M;
        if (f[0] < 4 && k !== S)
          return M;
      } else {
        if (f[1] === 0)
          return M[1] = E * S * l[0] / h * g, M;
        if (x) {
          if (f[1] === 1)
            return M;
          if (f[1] < 4 && E !== x)
            return M;
        }
      }
      return [0, 0];
    });
    C[a] = l;
    var w = n.map(function(D, k) {
      return O(O({}, D), { pos: Rt(D.pos, C[k]) });
    });
    return a < 4 ? w.slice(0, a + 1).forEach(function(D) {
      D.virtual = !1;
    }) : w.slice(4, a + 1).forEach(function(D) {
      D.virtual = !1;
    }), r.prevDist = [o, s], Nl(t, e, l, u, w);
  },
  dragControlEnd: function(t, e) {
    var r = t.state;
    r.borderRadiusState = "";
    var n = e.datas, a = e.isDouble;
    if (!n.isRound)
      return !1;
    var i = n.isControl, o = n.controlIndex, s = n.isLine, l = n.lineIndex, u = n.controlPoses, c = u.filter(function(S) {
      var C = S.virtual;
      return C;
    }).length, f = t.props.roundClickable, d = f === void 0 ? !0 : f;
    if (a && d) {
      if (i && (d === !0 || d === "control"))
        sg(u, o);
      else if (s && (d === !0 || d === "line")) {
        var h = j($u(t, e), 2), g = h[0], m = h[1];
        ig(u, l, g, m);
      }
      c !== u.filter(function(S) {
        var C = S.virtual;
        return C;
      }).length && Nl(t, e, [0, 0], [0, 0], u);
    }
    var x = Se(t, e, {});
    return ct(t, "onRoundEnd", x), r.borderRadiusState = "", x;
  },
  dragGroupControlStart: function(t, e) {
    var r = this.dragControlStart(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = ze(t, "roundable", e), o = O({ targets: t.props.targets, events: i.map(function(s, l) {
      return O(O({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] });
    }) }, r);
    return ct(t, "onRoundGroupStart", o), r;
  },
  dragGroupControl: function(t, e) {
    var r = this.dragControl(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = ze(t, "roundable", e), o = O({ targets: t.props.targets, events: i.map(function(s, l) {
      return O(O(O({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] }), he({
        borderRadius: r.borderRadius
      }, s));
    }) }, r);
    return ct(t, "onRoundGroup", o), o;
  },
  dragGroupControlEnd: function(t, e) {
    var r = t.moveables, n = t.props.targets, a = ze(t, "roundable", e);
    ti(t, "onRound", function(s) {
      var l = O({ targets: t.props.targets, events: a.map(function(u, c) {
        return O(O(O({}, u), { target: n[c], moveable: r[c], currentTarget: r[c] }), he({
          borderRadius: s.borderRadius
        }, u));
      }) }, s);
      ct(t, "onRoundGroup", l);
    });
    var i = this.dragControlEnd(t, e);
    if (!i)
      return !1;
    var o = O({ targets: t.props.targets, events: a.map(function(s, l) {
      var u;
      return O(O({}, s), { target: n[l], moveable: r[l], currentTarget: r[l], lastEvent: (u = s.datas) === null || u === void 0 ? void 0 : u.lastEvent });
    }) }, i);
    return ct(t, "onRoundGroupEnd", o), o;
  },
  unset: function(t) {
    t.state.borderRadiusState = "";
  }
};
function ug(t, e) {
  var r = e ? 4 : 3, n = Ft(r), a = "matrix".concat(e ? "3d" : "", "(").concat(n.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var Yc = {
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
    var r = t.state, n = r.is3d, a = r.targetMatrix, i = r.inlineTransform, o = n ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(Pu(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = ug(s, n) ? [] : ur(s);
  },
  resetStyle: function(t) {
    var e = t.datas;
    e.nextStyle = {}, e.nextTransforms = t.datas.startTransforms, e.nextTransformAppendedIndexes = [];
  },
  fillDragStartParams: function(t, e) {
    return Et(t, e, {
      setTransform: function(r) {
        e.datas.startTransforms = Vt(r) ? r : ur(r);
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
    var n = ze(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
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
    var n = ze(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
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
}, Xc = {
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
    var r = this, n = ze(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragParams(l, o);
    });
    ct(t, "onRenderGroup", Et(t, e, O(O({ isPinch: !!e.isPinch, targets: t.props.targets, transform: ua(e), transformObject: {} }, he(ca(e))), { events: i })));
  },
  dragGroupEnd: function(t, e) {
    var r = this, n = ze(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragEndParams(l, o);
    });
    ct(t, "onRenderGroupEnd", Et(t, e, O({ isPinch: !!e.isPinch, isDrag: e.isDrag, targets: t.props.targets, events: i, transformObject: {}, transform: ua(e) }, he(ca(e)))));
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
    return qr(Na(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), Et(t, e, O({ isPinch: !!e.isPinch, transformObject: r, transform: ua(e) }, he(ca(e))));
  },
  fillDragEndParams: function(t, e) {
    var r = {};
    return qr(Na(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), Et(t, e, O({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: r, transform: ua(e) }, he(ca(e))));
  }
};
function Cn(t, e, r, n, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", u = a === "After", c = t.state.target, f = i.isRequest, d = n.indexOf("Control") > -1;
  if (!c || s && d && !f && t.areaElement === i.inputEvent.target)
    return !1;
  var h = et([], j(e), !1);
  if (f) {
    var g = i.requestAble;
    h.some(function(R) {
      return R.name === g;
    }) || h.push.apply(h, et([], j(t.props.ables.filter(function(R) {
      return R.name === g;
    })), !1));
  }
  if (!h.length || h.every(function(R) {
    return R.dragRelation;
  }))
    return !1;
  var m = i.inputEvent, x;
  l && m && (x = document.elementFromPoint(i.clientX, i.clientY) || m.target);
  var S = !1, C = function() {
    var R;
    S = !0, (R = i.stop) === null || R === void 0 || R.call(i);
  }, w = s && (!t.targetGesto || !t.controlGesto || !t.targetGesto.isFlag() || !t.controlGesto.isFlag());
  w && t.updateRect(a, !0, !1);
  var D = i.datas, k = d ? "controlGesto" : "targetGesto", E = t[k], M = function(R, P, A) {
    if (!(P in R) || E !== t[k])
      return !1;
    var B = R.name, X = D[B] || (D[B] = {});
    if (s && (X.isEventStart = !A || !R[A] || R[A](t, i)), !X.isEventStart)
      return !1;
    var V = R[P](t, O(O({}, i), { stop: C, datas: X, originalDatas: D, inputTarget: x }));
    return t._emitter.off(), s && V === !1 && (X.isEventStart = !1), V;
  };
  w && h.forEach(function(R) {
    R.unset && R.unset(t);
  }), M(Yc, "drag".concat(n).concat(a));
  var _ = 0, I = 0;
  r.forEach(function(R) {
    if (S)
      return !1;
    var P = "".concat(R).concat(n).concat(a), A = "".concat(R).concat(n, "Condition");
    a === "" && !f && Pv(t.state, i);
    var B = h.filter(function(G) {
      return G[P];
    });
    B = B.filter(function(G, K) {
      return G.name && B.indexOf(G) === K;
    });
    var X = B.filter(function(G) {
      return M(G, P, A);
    }), V = X.length;
    S && ++_, V && ++I, !S && s && B.length && !V && (_ += B.filter(function(G) {
      var K = G.name, U = D[K];
      return U.isEventStart ? G.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!u || I) && M(Xc, "drag".concat(n).concat(a));
  var v = E !== t[k] || _ === r.length;
  if ((l || S || v) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(R) {
    R.state.gestos = {};
  }), h.forEach(function(R) {
    R.unset && R.unset(t);
  })), s && !v && !f && I && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || v)
    return !1;
  if (!s && I && !o || l) {
    var N = t.props.flushSync || Sc;
    N(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !u && I && !o && Cn(t, e, r, n, a + "After", i), !0;
}
function rs(t, e) {
  return function(r, n) {
    var a;
    n === void 0 && (n = r.inputEvent.target);
    var i = n, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || ae(i, "moveable-area") || ae(i, "moveable-padding") || ae(i, "moveable-edgeDraggable");
  };
}
function Hc(t, e, r) {
  var n = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(n), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var u = rs(t);
  return qc(t, a, "targetAbles", r, {
    dragStart: u,
    pinchStart: u
  });
}
function $c(t, e) {
  var r = t.controlBox, n = [];
  n.push(r);
  var a = rs(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === r)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return qc(t, n, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function qc(t, e, r, n, a) {
  a === void 0 && (a = {});
  var i = r === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, u = o.preventClickEventOnDrag, c = o.preventClickDefault, f = o.checkInput, d = o.dragFocusedInput, h = o.preventDefault, g = h === void 0 ? !0 : h, m = o.preventRightClick, x = m === void 0 ? !0 : m, S = o.preventWheelClick, C = S === void 0 ? !0 : S, w = o.dragContainer, D = Xe(w, !0), k = {
    preventDefault: g,
    preventRightClick: x,
    preventWheelClick: C,
    container: D || ke(t.getControlBoxElement()),
    pinchThreshold: l,
    pinchOutside: s,
    preventClickEventOnDrag: i ? u : !1,
    preventClickEventOnDragStart: i ? c : !1,
    preventClickEventByCondition: i ? null : function(_) {
      return t.controlBox.contains(_.target);
    },
    checkInput: i ? f : !1,
    dragFocusedInput: d
  }, E = new Bu(e, k), M = n === "Control";
  return ["drag", "pinch"].forEach(function(_) {
    ["Start", "", "End"].forEach(function(I) {
      E.on("".concat(_).concat(I), function(v) {
        var N, R = v.eventType, P = _ === "drag" && v.isPinch;
        if (a[R] && !a[R](v)) {
          v.stop();
          return;
        }
        if (!P) {
          var A = _ === "drag" ? [_] : ["drag", _], B = et([], j(t[r]), !1), X = Cn(t, B, A, n, I, v);
          X ? (t.props.stopPropagation || I === "Start" && M) && ((N = v == null ? void 0 : v.inputEvent) === null || N === void 0 || N.stopPropagation()) : v.stop();
        }
      });
    });
  }), E;
}
var cg = /* @__PURE__ */ (function() {
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
function fg(t, e, r, n) {
  var a;
  r === void 0 && (r = e);
  var i = Ju(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, u = i.transformOrigin, c = i.targetOrigin, f = i.offsetContainer, d = i.hasFixed, h = i.zoom, g = Dh(f, r), m = g.matrixes, x = g.is3d, S = g.offsetContainer, C = g.zoom, w = n, D = 4, k = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, E = l, M = Ft(D), _ = Ft(D), I = Ft(D), v = Ft(D), N = o.length, R = m.map(function(K) {
    return O(O({}, K), { matrix: K.matrix ? et([], j(K.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && w && (E = Be(E, 3, 4), fo(o)), !x && w && fo(R), R.forEach(function(K) {
    _ = Nt(_, K.matrix, D);
  });
  var P = r || dr(t), A = ((a = R[0]) === null || a === void 0 ? void 0 : a.target) || Tn(P, P, !0).offsetParent, B = R.slice(1).reduce(function(K, U) {
    return Nt(K, U.matrix, D);
  }, Ft(D));
  o.forEach(function(K, U) {
    if (N - 2 === U && (I = M.slice()), N - 1 === U && (v = M.slice()), !K.matrix) {
      var L = o[U + 1], rt = _v(K, L, A, D, Nt(B, M, D));
      K.matrix = Dr(rt, D);
    }
    M = Nt(M, K.matrix, D);
  });
  var X = !k && s;
  E || (E = Ft(X ? 4 : 3));
  var V = Qa(k && E.length === 16 ? Be(E, 4, 3) : E, X), G = _;
  return _ = Iu(_, D, D), {
    hasZoom: h !== 1 || C !== 1,
    hasFixed: d,
    matrixes: o,
    rootMatrix: _,
    originalRootMatrix: G,
    beforeMatrix: I,
    offsetMatrix: v,
    allMatrix: M,
    targetMatrix: E,
    targetTransform: V,
    inlineTransform: t.style.transform,
    transformOrigin: u,
    targetOrigin: c,
    is3d: w,
    offsetContainer: f,
    offsetRootContainer: S
  };
}
function dg(t, e, r, n) {
  r === void 0 && (r = e);
  var a = 0, i = 0, o = 0, s = {}, l = Dc(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var u = fg(t, e, r, n), c = Hr(u.allMatrix, u.transformOrigin, a, i);
    s = O(O({}, u), c);
    var f = Hr(u.allMatrix, [50, 50], 100, 100);
    o = kc([f.pos1, f.pos2], f.direction);
  }
  var d = 4;
  return O(O(O({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: Ft(d), rootMatrix: Ft(d), beforeMatrix: Ft(d), offsetMatrix: Ft(d), allMatrix: Ft(d), targetMatrix: Ft(d), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function go(t, e, r, n, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = da(), u = da(), c = da(), f = da(), d = [0, 0], h = {}, g = dg(e, r, a, !0);
  if (e) {
    var m = me(e);
    i.forEach(function(R) {
      h[R] = m(R);
    });
    var x = g.is3d ? 4 : 3, S = Hr(g.offsetMatrix, Rt(g.transformOrigin, Ru(g.targetMatrix, x)), g.width, g.height);
    o = S.direction, s = Rt(S.origin, [S.left - g.left, S.top - g.top]), f = Sn(g.offsetRootContainer);
    var C = Tn(n, n, !0).offsetParent || g.offsetRootContainer;
    if (g.hasZoom) {
      var w = Hr(Nt(g.originalRootMatrix, g.allMatrix), g.transformOrigin, g.width, g.height), D = Hr(g.originalRootMatrix, Fa(me(C)("transformOrigin")).map(function(R) {
        return parseFloat(R);
      }), C.offsetWidth, C.offsetHeight);
      if (l = Ri(w, f), c = Ri(D, f, C, !0), t) {
        var k = w.left, E = w.top;
        u = Ri({
          left: k,
          top: E,
          bottom: E,
          right: E
        }, f);
      }
    } else {
      l = Sn(e), c = Eh(C), t && (u = Sn(t));
      var M = c.left, _ = c.top, I = c.clientLeft, v = c.clientTop, N = [
        l.left - M,
        l.top - _
      ];
      d = xt(Zr(g.rootMatrix, N, 4), [I + g.left, v + g.top]);
    }
  }
  return O({ targetClientRect: l, containerClientRect: c, moveableClientRect: u, rootContainerClientRect: f, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: h, offsetDelta: d }, g);
}
function Al(t) {
  var e = t.pos1, r = t.pos2, n = t.pos3, a = t.pos4;
  if (!e || !r || !n || !a)
    return null;
  var i = kr([e, r, n, a]), o = [i.minX, i.minY], s = xt(t.origin, o);
  return e = xt(e, o), r = xt(r, o), n = xt(n, o), a = xt(a, o), O(O({}, t), {
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
var Jr = /* @__PURE__ */ (function(t) {
  On(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.state = O({ container: null, gestos: {}, renderLines: [
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]]
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, go(null)), r.renderState = {}, r.enabledAbles = [], r.targetAbles = [], r.controlAbles = [], r.rotation = 0, r.scale = [1, 1], r.isMoveableMounted = !1, r.isUnmounted = !1, r.events = {
      mouseEnter: null,
      mouseLeave: null
    }, r._emitter = new Pn(), r._prevOriginalDragTarget = null, r._originalDragTarget = null, r._prevDragTarget = null, r._dragTarget = null, r._prevPropTarget = null, r._propTarget = null, r._prevDragArea = !1, r._isPropTargetChanged = !1, r._hasFirstTarget = !1, r._reiszeObserver = null, r._observerId = 0, r._mutationObserver = null, r._rootContainer = null, r._viewContainer = null, r._viewClassNames = [], r._store = {}, r.checkUpdateRect = function() {
      if (!r.isDragging()) {
        var n = r.props.parentMoveable;
        if (n) {
          n.checkUpdateRect();
          return;
        }
        ep(r._observerId), r._observerId = Mu(function() {
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
    var g = j(a || [0, 0], 2), m = g[0], x = g[1], S = n.left, C = n.top, w = n.target, D = n.direction, k = n.hasFixed, E = n.offsetDelta, M = r.targets, _ = this.isDragging(), I = {};
    this.getEnabledAbles().forEach(function(B) {
      I["data-able-".concat(B.name.toLowerCase())] = !0;
    });
    var v = this._getAbleClassName(), N = M && M.length && (w || f) || o || !this._hasFirstTarget && this.state.isPersisted, R = this.controlBox || this.props.firstRenderState || this.props.persistData, P = [S - m, C - x];
    !f && r.useAccuratePosition && (P[0] += E[0], P[1] += E[1]);
    var A = {
      position: k ? "fixed" : "absolute",
      display: N ? "block" : "none",
      visibility: R ? "visible" : "hidden",
      transform: "translate3d(".concat(P[0], "px, ").concat(P[1], "px, ").concat(u, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return d && (A["--moveable-line-padding"] = d), h && (A["--moveable-control-padding"] = h), Q.createElement(
      c,
      O({ cspNonce: l, ref: lr(this, "controlBox"), className: "".concat(ht("control-box", D === -1 ? "reverse" : "", _ ? "dragging" : ""), " ").concat(v, " ").concat(i) }, I, { onClick: this._onPreventClick, style: A }),
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
    a && this._changeAbleViewClassNames([]), Yr(this, !1), Yr(this, !0);
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
    return r && (((n = r.getAttribute) === null || n === void 0 ? void 0 : n.call(r, "class")) || "").indexOf(Ao) > -1;
  }, e.prototype.dragStart = function(r, n) {
    n === void 0 && (n = r.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && rs(this)({ inputEvent: r }, n) ? a.isFlag() || a.triggerDragStart(r) : i && this.isMoveableElement(n) && (i.isFlag() || i.triggerDragStart(r)), this;
  }, e.prototype.hitTest = function(r) {
    var n = this.state, a = n.target, i = n.pos1, o = n.pos2, s = n.pos3, l = n.pos4, u = n.targetClientRect;
    if (!a)
      return 0;
    var c;
    if (Mn(r)) {
      var f = r.getBoundingClientRect();
      c = {
        left: f.left,
        top: f.top,
        width: f.width,
        height: f.height
      };
    } else
      c = O({ width: 0, height: 0 }, r);
    var d = c.left, h = c.top, g = c.width, m = c.height, x = Zi([i, o, l, s], u), S = Rp(x, [
      [d, h],
      [d + g, h],
      [d + g, h + m],
      [d, h + m]
    ]), C = mn(x);
    return !S || !C ? 0 : Math.min(100, S / C * 100);
  }, e.prototype.isInside = function(r, n) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, u = a.pos4, c = a.targetClientRect;
    return i ? Oa([r, n], Zi([o, s, u, l], c)) : !1;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && Kr(!0);
    var s = i.parentMoveable, l = this.state, u = l.target || i.target, c = this.getContainer(), f = s ? s._rootContainer : this._rootContainer, d = go(this.controlBox, u, c, c, f || c, this._getRequestStyles());
    if (!u && this._hasFirstTarget && i.persistData) {
      var h = Al(i.persistData);
      for (var g in h)
        d[g] = h[g];
    }
    o && Kr(), this.updateState(d, s ? !1 : a);
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
    var r = this.state, n = Ie(this.state), a = j(n, 4), i = a[0], o = a[1], s = a[2], l = a[3], u = Me(n), c = r.width, f = r.height, d = u.width, h = u.height, g = u.left, m = u.top, x = [r.left, r.top], S = Rt(x, r.origin), C = Rt(x, r.beforeOrigin), w = r.transformOrigin;
    return {
      width: d,
      height: h,
      left: g,
      top: m,
      pos1: i,
      pos2: o,
      pos3: s,
      pos4: l,
      offsetWidth: c,
      offsetHeight: f,
      beforeOrigin: C,
      origin: S,
      transformOrigin: w,
      rotation: this.getRotation()
    };
  }, e.prototype.getManager = function() {
    return this;
  }, e.prototype.stopDrag = function(r) {
    if (!r || r === "target") {
      var n = this.targetGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && po(this, !1), n == null || n.stop();
    }
    if (!r || r === "control") {
      var n = this.controlGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && po(this, !0), n == null || n.stop();
    }
  }, e.prototype.getRotation = function() {
    var r = this.state, n = r.pos1, a = r.pos2, i = r.direction;
    return Nv(n, a, i);
  }, e.prototype.request = function(r, n, a) {
    n === void 0 && (n = {});
    var i = this, o = i.props, s = o.parentMoveable || o.wrapperMoveable || i, l = s.props.ables, u = o.groupable, c = be(l, function(S) {
      return S.name === r;
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
    var f = c.request(i), d = a || n.isInstant, h = f.isControl ? "controlAbles" : "targetAbles", g = "".concat(u ? "Group" : "").concat(f.isControl ? "Control" : ""), m = et([], j(s[h]), !1), x = {
      request: function(S) {
        return Cn(i, m, ["drag"], g, "", O(O({}, f.request(S)), { requestAble: r, isRequest: !0 }), d), x;
      },
      requestEnd: function() {
        return Cn(i, m, ["drag"], g, "End", O(O({}, f.requestEnd()), { requestAble: r, isRequest: !0 }), d), x;
      }
    };
    return Cn(i, m, ["drag"], g, "Start", O(O({}, f.requestStart(n)), { requestAble: r, isRequest: !0 }), d), d ? x.request(n).requestEnd() : x;
  }, e.prototype.getMoveables = function() {
    return [this];
  }, e.prototype.destroy = function() {
    this.componentWillUnmount();
  }, e.prototype.updateRenderPoses = function() {
    var r = this.getState(), n = this.props, a = n.padding, i = r.originalBeforeOrigin, o = r.transformOrigin, s = r.allMatrix, l = r.is3d, u = r.pos1, c = r.pos2, f = r.pos3, d = r.pos4, h = r.left, g = r.top, m = r.isPersisted, x = n.zoom || 1;
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
    var S = zc(a || {}), C = S.left, w = S.top, D = S.bottom, k = S.right, E = l ? 4 : 3, M = [];
    m ? M = o : this.controlBox && n.groupable ? M = i : M = Rt(i, [h, g]);
    var _ = Pa(E, Dr(M.map(function(A) {
      return -A;
    }), E), s, Dr(o, E)), I = De(_, u, [-C, -w], E), v = De(_, c, [k, -w], E), N = De(_, f, [-C, D], E), R = De(_, d, [k, D], E);
    r.renderPoses = [
      I,
      v,
      N,
      R
    ], r.renderLines = [
      [I, v],
      [v, R],
      [R, N],
      [N, I]
    ];
    {
      var P = x / 2;
      r.renderLines = [
        [
          De(_, u, [-C - P, -w], E),
          De(_, c, [k + P, -w], E)
        ],
        [
          De(_, c, [k, -w - P], E),
          De(_, d, [k, D + P], E)
        ],
        [
          De(_, d, [k + P, D], E),
          De(_, f, [-C - P, D], E)
        ],
        [
          De(_, f, [-C, D + P], E),
          De(_, u, [-C, -w - P], E)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var r = this.props, n = r.target, a = r.container, i = r.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !n)) {
      this.updateAbles();
      var u = !ho(s, n), c = u || !ho(l, a);
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
    return a[i] || (a[i] = Gu(r, n)), a[i];
  }, e.prototype.getState = function() {
    var r, n = this.props;
    (n.target || !((r = n.targets) === null || r === void 0) && r.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = n.persistData, o = n.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = Al(i);
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
    var a = this.props, i = a.triggerAblesSimultaneously, o = this.getEnabledAbles(r), s = "drag".concat(n, "Start"), l = "pinch".concat(n, "Start"), u = "drag".concat(n, "ControlStart"), c = pa(o, [s, l], i), f = pa(o, [u], i);
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
      createElement: Q.createElement
    };
    return this.renderState = {}, Rv(Pc(pa(this.getEnabledAbles(), ["render"], a).map(function(o) {
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
      return et(et([], j(n), !1), j(s), !1);
    }, et([], j(this.props.requestStyles || []), !1));
    return r;
  }, e.prototype._updateObserver = function(r) {
    this._updateResizeObserver(r), this._updateMutationObserver(r);
  }, e.prototype._updateEvents = function() {
    var r = this.targetAbles.length, n = this.controlAbles.length, a = this._dragTarget, i = !r && this.targetGesto || this._isTargetChanged(!0);
    i && (Yr(this, !1), this.updateState({ gestos: {} })), n || Yr(this, !0), a && r && !this.targetGesto && (this.targetGesto = Hc(this, a, "")), !this.controlGesto && n && (this.controlGesto = $c(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var r = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = r.dragArea, this._propTarget = r.target, this._originalDragTarget = r.dragTarget || r.target, this._dragTarget = Xe(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var r = this.props, n = r, a = n.zoom, i = n.hideDefaultLines, o = n.hideChildMoveableDefaultLines, s = n.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), u = {
      createElement: Q.createElement
    };
    return l.renderLines.map(function(c, f) {
      return _n(u, "", c[0], c[1], a, "render-line-".concat(f));
    });
  }, e.prototype._isTargetChanged = function(r) {
    var n = this.props, a = n.dragTarget || n.target, i = this._prevOriginalDragTarget, o = this._prevDragArea, s = n.dragArea, l = !s && i !== a, u = (r || s) && o !== s;
    return l || u || this._prevPropTarget != this._propTarget;
  }, e.prototype._updateNativeEvents = function() {
    var r = this, n = this.props, a = n.dragArea ? this.areaElement : this.state.target, i = this.events, o = Qr(i);
    if (this._isTargetChanged())
      for (var s in i) {
        var l = i[s];
        l && l.destroy(), i[s] = null;
      }
    if (a) {
      var u = this.enabledAbles;
      o.forEach(function(c) {
        var f = pa(u, [c]), d = f.length > 0, h = i[c];
        if (!d) {
          h && (h.destroy(), i[c] = null);
          return;
        }
        h || (h = new cg(a, r, c), i[c] = h), h.setAbles(f);
      });
    }
  }, e.prototype._checkUpdateRootContainer = function() {
    var r = this.props.rootContainer;
    !this._rootContainer && r && (this._rootContainer = Xe(r, !0));
  }, e.prototype._checkUpdateViewContainer = function() {
    var r = this.props.viewContainer;
    !this._viewContainer && r && (this._viewContainer = Xe(r, !0));
    var n = this._viewContainer;
    n && this._changeAbleViewClassNames(et(et([], j(this._getAbleViewClassNames()), !1), [
      this.isDragging() ? Wv : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(r) {
    var n = this._viewContainer, a = Rc(r.filter(Boolean), function(u) {
      return u;
    }).map(function(u) {
      var c = j(u, 1), f = c[0];
      return f;
    }), i = this._viewClassNames, o = jo(i, a), s = o.removed, l = o.added;
    s.forEach(function(u) {
      _u(n, i[u]);
    }), l.forEach(function(u) {
      To(n, a[u]);
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
      var c, f, d, h = u.name, g = ((c = u.className) === null || c === void 0 ? void 0 : c.call(u, n)) || "";
      return (!((f = s[h]) === null || f === void 0) && f.isEventStart || !((d = l[h]) === null || d === void 0) && d.isEventStart) && (g += " ".concat(ht("".concat(h).concat(r, "-dragging")))), g.trim();
    }).filter(Boolean).join(" ");
  }, e.prototype._updateResizeObserver = function(r) {
    var n, a = this.props, i = a.target, o = ke(this.getControlBoxElement());
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
    var n = this, a, i = this.props, o = i.target, s = ke(this.getControlBoxElement());
    if (!s.MutationObserver || !o || !i.useMutationObserver) {
      (a = this._mutationObserver) === null || a === void 0 || a.disconnect();
      return;
    }
    if (!(r.target === o && this._mutationObserver)) {
      var l = new s.MutationObserver(function(u) {
        var c, f;
        try {
          for (var d = $p(u), h = d.next(); !h.done; h = d.next()) {
            var g = h.value;
            g.type === "attributes" && g.attributeName === "style" && n.checkUpdateRect();
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
    flushSync: Sc,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})(Q.PureComponent), ns = {
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
    var d = Xr(t, "parentPosition", [o, s], function(g) {
      return g.join(",");
    }), h = Xr(t, "requestStyles", t.getRequestChildStyles(), function(g) {
      return g.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), et(et([], j(a.map(function(g, m) {
      return e.createElement(Jr, { key: "moveable" + m, ref: Cu(t, "moveables", m), target: g, origin: !1, requestStyles: h, cssStyled: n.cssStyled, customStyledMap: n.customStyledMap, useResizeObserver: n.useResizeObserver, useMutationObserver: n.useMutationObserver, hideChildMoveableDefaultLines: n.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: f[m], zoom: u });
    })), !1), j(Pc(c.map(function(g, m) {
      var x = g.pos1, S = g.pos2, C = g.pos3, w = g.pos4, D = [x, S, C, w];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(k, E) {
        var M = j(k, 2), _ = M[0], I = M[1];
        return _n(e, "", xt(D[_], d), xt(D[I], d), u, "group-rect-".concat(m, "-").concat(E));
      });
    }))), !1);
  }
}, pg = jn("clickable", {
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
      i === -1 && (i = Je(a, function(l) {
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
function zr(t) {
  var e = t.originalDatas.draggable;
  return e || (t.originalDatas.draggable = {}, e = t.originalDatas.draggable), O(O({}, t), { datas: e });
}
var hg = jn("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var r = t.props, n = r.edgeDraggable;
    return n ? ec(e, "edgeDraggable", n, t.getState().renderPoses, r.zoom) : [];
  },
  dragCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && ae(a, ht("direction")) && ae(a, ht("edge")) && ae(a, ht("edgeDraggable"));
  },
  dragStart: function(t, e) {
    return de.dragStart(t, zr(e));
  },
  drag: function(t, e) {
    return de.drag(t, zr(e));
  },
  dragEnd: function(t, e) {
    return de.dragEnd(t, zr(e));
  },
  dragGroupCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && ae(a, ht("direction")) && ae(a, ht("line"));
  },
  dragGroupStart: function(t, e) {
    return de.dragGroupStart(t, zr(e));
  },
  dragGroup: function(t, e) {
    return de.dragGroup(t, zr(e));
  },
  dragGroupEnd: function(t, e) {
    return de.dragGroupEnd(t, zr(e));
  },
  unset: function(t) {
    return de.unset(t);
  }
}), Vc = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, vg = [
  Yc,
  Fc,
  xv,
  Av,
  de,
  hg,
  lo,
  Bv,
  Gv,
  tv,
  Hv,
  $v,
  Yv,
  ag,
  ng,
  lg,
  ns,
  Vc,
  pg,
  Bc,
  Xc
];
function Bl(t, e) {
  var r = j(t, 3), n = r[0], a = r[1], i = r[2];
  return (n * e[0] + a * e[1] + i) / Math.sqrt(n * n + a * a);
}
function ga(t, e) {
  var r = j(t, 2), n = r[0], a = r[1];
  return -n * e[0] - a * e[1];
}
function Fl(t, e) {
  return Math.max.apply(Math, et([], j(t.map(function(r) {
    var n = j(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function Gl(t, e) {
  return Math.min.apply(Math, et([], j(t.map(function(r) {
    var n = j(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function gg(t, e) {
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
  var f = Ct(e, ve);
  if (f % 90) {
    var d = f / 180 * Math.PI, h = Math.tan(d), g = -1 / h, m = [ao, ul], x = [[0, 0], [0, 0]], S = [ao, ul], C = [[0, 0], [0, 0]];
    t.forEach(function(nt) {
      nt.forEach(function(tt) {
        var at = Bl([-h, 1, 0], tt), J = Bl([-g, 1, 0], tt);
        m[0] > at && (x[0] = tt, m[0] = at), m[1] < at && (x[1] = tt, m[1] = at), S[0] > J && (C[0] = tt, S[0] = J), S[1] < J && (C[1] = tt, S[1] = J);
      });
    });
    var w = j(x, 2), D = w[0], k = w[1], E = j(C, 2), M = E[0], _ = E[1], I = [-h, 1, ga([-h, 1], D)], v = [-h, 1, ga([-h, 1], k)], N = [-g, 1, ga([-g, 1], M)], R = [-g, 1, ga([-g, 1], _)];
    r = j([
      [I, N],
      [I, R],
      [v, N],
      [v, R]
    ].map(function(nt) {
      var tt = j(nt, 2), at = tt[0], J = tt[1];
      return No(at, J)[0];
    }), 4), i = r[0], o = r[1], s = r[2], l = r[3], u = S[1] - S[0], c = m[1] - m[0];
  } else {
    var P = Gl(t, 0), A = Gl(t, 1), B = Fl(t, 0), X = Fl(t, 1);
    if (i = [P, A], o = [B, A], s = [P, X], l = [B, X], u = B - P, c = X - A, f % 180) {
      var V = [s, i, l, o];
      n = j(V, 4), i = n[0], o = n[1], s = n[2], l = n[3], u = X - A, c = B - P;
    }
  }
  if (f % 360 > 180) {
    var V = [l, s, o, i];
    a = j(V, 4), i = a[0], o = a[1], s = a[2], l = a[3];
  }
  var G = kr([i, o, s, l]), K = G.minX, U = G.minY, L = G.maxX, rt = G.maxY;
  return {
    pos1: i,
    pos2: o,
    pos3: s,
    pos4: l,
    width: u,
    height: c,
    minX: K,
    minY: U,
    maxX: L,
    maxY: rt,
    rotation: e
  };
}
function Kc(t, e) {
  var r = e.map(function(n) {
    if (Vt(n)) {
      var a = Kc(t, n), i = a.length;
      return i > 1 ? a : i === 1 ? a[0] : null;
    } else {
      var o = be(t, function(s) {
        var l = s.manager;
        return l.props.target === n;
      });
      return o ? (o.finded = !0, o.manager) : null;
    }
  }).filter(Boolean);
  return r.length === 1 && Vt(r[0]) ? r[0] : r;
}
var mg = /* @__PURE__ */ (function(t) {
  On(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.differ = new ju(), r.moveables = [], r.transformOrigin = "50% 50%", r.renderGroupRects = [], r._targetGroups = [], r._hasFirstTargets = !1, r;
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
    Kr(!0), this.moveables.forEach(function(ft) {
      ft.updateRect(r, !1, !1);
    });
    var s = this.props, l = this.moveables, u = o.target || s.target, c = l.map(function(ft) {
      return { finded: !1, manager: ft };
    }), f = this.props.targetGroups || [], d = Kc(c, f), h = s.useDefaultGroupRotate;
    d.push.apply(d, et([], j(c.filter(function(ft) {
      var bt = ft.finded;
      return !bt;
    }).map(function(ft) {
      var bt = ft.manager;
      return bt;
    })), !1));
    var g = [], m = !n || r !== "" && s.updateGroup, x = s.defaultGroupRotate || 0;
    if (!this._hasFirstTargets) {
      var S = (i = s.persistData) === null || i === void 0 ? void 0 : i.rotation;
      S != null && (x = S);
    }
    function C(ft, bt, pt) {
      var H = ft.map(function(Mt) {
        if (Vt(Mt)) {
          var St = C(Mt, bt), dt = [St.pos1, St.pos2, St.pos3, St.pos4];
          return g.push(St), { poses: dt, rotation: St.rotation };
        } else
          return {
            poses: Ie(Mt.state),
            rotation: Mt.getRotation()
          };
      }), ut = H.map(function(Mt) {
        var St = Mt.rotation;
        return St;
      }), Dt = 0, vt = ut[0], gt = ut.every(function(Mt) {
        return Math.abs(vt - Mt) < 0.1;
      });
      m ? Dt = !h && gt ? vt : x : Dt = !h && !pt && gt ? vt : bt;
      var mt = H.map(function(Mt) {
        var St = Mt.poses;
        return St;
      }), wt = gg(mt, Dt);
      return wt;
    }
    var w = C(d, this.rotation, !0);
    m && (this.rotation = w.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = f, this.renderGroupRects = g;
    var D = this.transformOrigin, k = this.rotation, E = this.scale, M = w.width, _ = w.height, I = w.minX, v = w.minY, N = zv([
      [0, 0],
      [M, 0],
      [0, _],
      [M, _]
    ], Qo(D, M, _), this.rotation / 180 * Math.PI), R = kr(N.result), P = R.minX, A = R.minY, B = " rotate(".concat(k, "deg)") + " scale(".concat(pe(E[0]), ", ").concat(pe(E[1]), ")"), X = "translate(".concat(-P, "px, ").concat(-A, "px)").concat(B);
    this.controlBox.style.transform = "translate3d(".concat(I, "px, ").concat(v, "px, ").concat(this.props.translateZ || 0, ")"), u.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(D, ";") + "width:".concat(M, "px;height:").concat(_, "px;") + "transform: ".concat(X), o.width = M, o.height = _;
    var V = this.getContainer(), G = go(this.controlBox, u, this.controlBox, this.getContainer(), this._rootContainer || V, []), K = [G.left, G.top], U = j(Ie(G), 4), L = U[0], rt = U[1], nt = U[2], tt = U[3], at = kr([L, rt, nt, tt]), J = [at.minX, at.minY], ot = pe(E[0] * E[1]);
    G.pos1 = xt(L, J), G.pos2 = xt(rt, J), G.pos3 = xt(nt, J), G.pos4 = xt(tt, J), G.left = I - G.left + J[0], G.top = v - G.top + J[1], G.origin = xt(Rt(K, G.origin), J), G.beforeOrigin = xt(Rt(K, G.beforeOrigin), J), G.originalBeforeOrigin = Rt(K, G.originalBeforeOrigin), G.transformOrigin = xt(Rt(K, G.transformOrigin), J), u.style.transform = "translate(".concat(-P - J[0], "px, ").concat(-A - J[1], "px)") + B, Kr(), this.updateState(O(O({}, G), { posDelta: J, direction: ot, beforeDirection: ot }), a);
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
      return et(et([], j(n), !1), j(s), !1);
    }, []);
    return r;
  }, e.prototype.getMoveables = function() {
    return et([], j(this.moveables), !1);
  }, e.prototype.updateAbles = function() {
    t.prototype.updateAbles.call(this, et(et([], j(this.props.ables), !1), [ns], !1), "Group");
  }, e.prototype._updateTargets = function() {
    t.prototype._updateTargets.call(this), this._originalDragTarget = this.props.dragTarget || this.areaElement, this._dragTarget = Xe(this._originalDragTarget, !0);
  }, e.prototype._updateEvents = function() {
    var r = this.state, n = this.props, a = this._prevDragTarget, i = n.dragTarget || this.areaElement, o = n.targets, s = this.differ.update(o), l = s.added, u = s.changed, c = s.removed, f = l.length || c.length;
    (f || this._prevOriginalDragTarget !== this._originalDragTarget) && (Yr(this, !1), Yr(this, !0), this.updateState({ gestos: {} })), a !== i && (r.target = null), r.target || (r.target = this.areaElement, this.controlBox.style.display = "block"), r.target && (this.targetGesto || (this.targetGesto = Hc(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = $c(this, "GroupControl")));
    var d = !ho(r.container, n.container);
    d && (r.container = n.container), (d || f || this.transformOrigin !== (n.defaultGroupOrigin || "50% 50%") || u.length || o.length && !Nc(this._targetGroups, n.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!f;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = O(O({}, Jr.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Jr), xg = /* @__PURE__ */ (function(t) {
  On(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.moveables = [], r;
  }
  return e.prototype.render = function() {
    var r = this, n, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], u = l.length, c = this.isUnmounted || !u, f = (n = s == null ? void 0 : s.children) !== null && n !== void 0 ? n : [];
    return c && !u && f.length ? l = f.map(function() {
      return null;
    }) : c || (f = []), Q.createElement(o, { cspNonce: i, ref: lr(this, "controlBox"), className: ht("control-box") }, l.map(function(d, h) {
      var g, m, x = (m = (g = a.individualGroupableProps) === null || g === void 0 ? void 0 : g.call(a, d, h)) !== null && m !== void 0 ? m : {};
      return Q.createElement(Jr, O({ key: "moveable" + h, ref: Cu(r, "moveables", h) }, a, x, { target: d, wrapperMoveable: r, isWrapperMounted: r.isMoveableMounted, persistData: f[h] }));
    }));
  }, e.prototype.componentDidMount = function() {
  }, e.prototype.componentDidUpdate = function() {
  }, e.prototype.getTargets = function() {
    return this.props.targets;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0), Kr(!0), this.moveables.forEach(function(i) {
      i.updateRect(r, n, a);
    }), Kr();
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
    return et([], j(this.moveables), !1);
  }, e.prototype.updateRenderPoses = function() {
  }, e.prototype.checkUpdate = function() {
  }, e.prototype.triggerEvent = function() {
  }, e.prototype.updateAbles = function() {
  }, e.prototype._updateEvents = function() {
  }, e.prototype._updateObserver = function() {
  }, e;
})(Jr);
function Uc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (_e(n)) {
        e[n] && r.push.apply(r, et([], j(e[n]), !1));
        return;
      }
      Vt(n) ? r.push.apply(r, et([], j(Uc(n, e)), !1)) : r.push(n);
    }
  }), r;
}
function Zc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (_e(n)) {
        e[n] && r.push.apply(r, et([], j(e[n]), !1));
        return;
      }
      Vt(n) ? r.push(Zc(n, e)) : r.push(n);
    }
  }), r;
}
function Jc(t, e) {
  return t.length !== e.length || t.some(function(r, n) {
    var a = e[n];
    return !r && !a ? !1 : r != a ? Vt(r) && Vt(a) ? Jc(r, a) : !0 : !1;
  });
}
var yg = /* @__PURE__ */ (function(t) {
  On(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.refTargets = [], r.selectorMap = {}, r._differ = new ju(), r._elementTargets = [], r._tmpRefTargets = [], r._tmpSelectorMap = {}, r._onChangeTargets = null, r;
  }
  return e.makeStyled = function() {
    var r = {}, n = this.getTotalAbles();
    n.forEach(function(i) {
      var o = i.css;
      o && o.forEach(function(s) {
        r[s] = !0;
      });
    });
    var a = Qr(r).join(`
`);
    this.defaultStyled = Gu("div", Yd(Ao, nh + a));
  }, e.getTotalAbles = function() {
    return et([Fc, ns, Vc, Bc], j(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var r, n = this.constructor;
    n.defaultStyled || n.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = Xp(a, ["ables", "props"]), l = j(this._updateRefs(!0), 2), u = l[0], c = l[1], f = Uc(u, c), d = f.length > 1, h = n.getTotalAbles(), g = et(et([], j(h), !1), j(i || []), !1), m = O(O(O({}, s), o || {}), { ables: g, cssStyled: n.defaultStyled, customStyledMap: n.customStyledMap });
    this._elementTargets = f;
    var x = null, S = this.moveable, C = s.persistData;
    if (C != null && C.children && (d = !0), s.individualGroupable)
      return Q.createElement(xg, O({ key: "individual-group", ref: lr(this, "moveable") }, m, { target: null, targets: f }));
    if (d) {
      var w = Zc(u, c);
      if (S && !S.props.groupable && !S.props.individualGroupable) {
        var D = S.props.target;
        D && f.indexOf(D) > -1 && (x = O({}, S.state));
      }
      return Q.createElement(mg, O({ key: "group", ref: lr(this, "moveable") }, m, (r = s.groupableProps) !== null && r !== void 0 ? r : {}, { target: null, targets: f, targetGroups: w, firstRenderState: x }));
    } else {
      var k = f[0];
      if (S && (S.props.groupable || S.props.individualGroupable)) {
        var E = S.moveables || [], M = be(E, function(_) {
          return _.props.target === k;
        });
        M && (x = O({}, M.state));
      }
      return Q.createElement(Jr, O({ key: "single", ref: lr(this, "moveable") }, m, { target: k, firstRenderState: x }));
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
    var n = this.refTargets, a = Jo(this.props.target || this.props.targets), i = typeof document < "u", o = Jc(n, a), s = this.selectorMap, l = {};
    return this.refTargets.forEach(function u(c) {
      if (_e(c)) {
        var f = s[c];
        f ? l[c] = s[c] : i && (o = !0, l[c] = [].slice.call(document.querySelectorAll(c)));
      } else Vt(c) && c.forEach(u);
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
    var u = j(this._updateRefs(), 3), c = u[0], f = u[1], d = u[2];
    this.refTargets = c, this.selectorMap = f, d && this.forceUpdate();
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, Hp([
    wu(oh)
  ], e.prototype, "moveable", void 0), e;
})(Q.PureComponent), bg = /* @__PURE__ */ (function(t) {
  On(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = vg, e;
})(yg), mo = function(t, e) {
  return mo = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, mo(t, e);
};
function Sg(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  mo(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
function Cg(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var An = Cg(function(t, e) {
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
An.code;
An.codes;
An.aliases;
var wg = An.names;
An.title;
var Ll = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, Wl = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function Qc(t, e) {
  var r = (wg[t] || e || "").toLowerCase();
  for (var n in Ll)
    r = r.replace(n, Ll[n]);
  return r.replace(/\s/g, "");
}
function tf(t, e) {
  e === void 0 && (e = Qc(t.keyCode, t.key));
  var r = Eg(t);
  return r.indexOf(e) === -1 && r.push(e), r.filter(Boolean);
}
function Eg(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function Yl(t) {
  var e = t.slice();
  return e.sort(function(r, n) {
    var a = Wl[r] || 5, i = Wl[n] || 5;
    return a - i;
  }), e;
}
var Xl, Dg = /* @__PURE__ */ (function(t) {
  Sg(e, t);
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
    }, re(n, "blur", a.blur), re(n, "keydown", a.keydownEvent), re(n, "keyup", a.keyupEvent), a;
  }
  var r = e.prototype;
  return Object.defineProperty(e, "global", {
    /**
     */
    get: function() {
      return Xl || (Xl = new e());
    },
    enumerable: !1,
    configurable: !0
  }), e.setGlobal = function() {
    return this.global;
  }, r.destroy = function() {
    var n = this.container;
    this.clear(), this.off(), qt(n, "blur", this.blur), qt(n, "keydown", this.keydownEvent), qt(n, "keyup", this.keyupEvent);
  }, r.keydown = function(n, a) {
    return this.addEvent("keydown", n, a);
  }, r.offKeydown = function(n, a) {
    return this.removeEvent("keydown", n, a);
  }, r.offKeyup = function(n, a) {
    return this.removeEvent("keyup", n, a);
  }, r.keyup = function(n, a) {
    return this.addEvent("keyup", n, a);
  }, r.addEvent = function(n, a, i) {
    return Vt(a) ? this.on("".concat(n, ".").concat(Yl(a).join(".")), i) : _e(a) ? this.on("".concat(n, ".").concat(a), i) : this.on(n, a), this;
  }, r.removeEvent = function(n, a, i) {
    return Vt(a) ? this.off("".concat(n, ".").concat(Yl(a).join(".")), i) : _e(a) ? this.off("".concat(n, ".").concat(a), i) : this.off(n, a), this;
  }, r.triggerEvent = function(n, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = Qc(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
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
    var l = tf(a, i);
    l.length > 1 && this.trigger("".concat(n, ".").concat(l.join(".")), s);
  }, e;
})(Pn), xo = function(t, e) {
  return xo = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, xo(t, e);
};
function ef(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  xo(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var ee = function() {
  return ee = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, ee.apply(this, arguments);
};
function kg(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Mg(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function wn(t, e, r) {
  for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function _g(t) {
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
function Tg(t) {
  if (typeof Map > "u")
    return t.filter(function(r, n) {
      return t.indexOf(r) === n;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(r) {
    return e.has(r) ? !1 : (e.set(r, !0), !0);
  });
}
function Ig(t, e, r) {
  var n = Ne(t);
  return n.elementFromPoint && n.elementFromPoint(e, r) || null;
}
function rf(t, e, r) {
  var n = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || Ne(r).createElement(n);
  for (var u in i)
    l.setAttribute(u, i[u]);
  var c = l.children;
  if (a.forEach(function(d, h) {
    rf(d, c[h], l);
  }), o && o.split(/\s+/g).forEach(function(d) {
    d && !ae(l, d) && To(l, d);
  }), s) {
    var f = l.style;
    for (var u in s)
      f[u] = s[u];
  }
  return !e && r && r.appendChild(l), l;
}
function Rg(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, u = kg(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: u,
    children: r
  };
}
function ji(t, e, r) {
  t !== e && r(t, e);
}
function Hl(t, e, r) {
  var n;
  r === void 0 && (r = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, u = l.startX, c = l.startY;
  if (e > 0) {
    var f = Math.sqrt((i * i + s * s) / (1 + e * e)), d = e * f;
    i = (i >= 0 ? 1 : -1) * d, s = (s >= 0 ? 1 : -1) * f;
  }
  var h = Math.abs(i), g = Math.abs(s), m = i < 0 ? u - r.left : r.right - u, x = s < 0 ? c - r.top : r.bottom - c;
  n = _o([h, g], [0, 0], [m, x], !!e), h = n[0], g = n[1], i = (i >= 0 ? 1 : -1) * h, s = (s >= 0 ? 1 : -1) * g;
  var S = Math.min(0, i), C = Math.min(0, s), w = u + S, D = c + C;
  return {
    left: w,
    top: D,
    right: w + h,
    bottom: D + g,
    width: h,
    height: g
  };
}
function ma(t) {
  var e = t.getBoundingClientRect(), r = e.left, n = e.top, a = e.width, i = e.height;
  return {
    pos1: [r, n],
    pos2: [r + a, n],
    pos3: [r, n + i],
    pos4: [r + a, n + i]
  };
}
function $l(t, e, r) {
  var n = Fr(t, e), a = n.list, i = n.prevList, o = n.added, s = n.removed, l = n.maintained;
  return wn(wn(wn([], o.map(function(u) {
    return a[u];
  }), !0), s.map(function(u) {
    return i[u];
  }), !0), r ? l.map(function(u) {
    var c = u[1];
    return a[c];
  }) : []);
}
function ql(t) {
  for (var e = 0, r = t.length, n = 1; n < r; ++n)
    e = Math.max(Ye(t[n], t[n - 1]), e);
  return e;
}
var nf = Fu(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), yo = "selecto-selection ".concat(nf.className), as = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], Pg = wn([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], as), af = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], Og = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], jg = /* @__PURE__ */ (function(t) {
  ef(e, t);
  function e(n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new Nu(), a._onDragStart = function(s, l) {
      var u = s.data, c = s.clientX, f = s.clientY, d = s.inputEvent, h = a.options, g = h.selectFromInside, m = h.selectByClick, x = h.rootContainer, S = h.boundContainer, C = h.preventDragFromInside, w = C === void 0 ? !0 : C, D = h.clickBySelectEnd, k = h.dragCondition;
      if (k && !k(s)) {
        s.stop();
        return;
      }
      u.data = {};
      var E = ke(a.container);
      u.innerWidth = E.innerWidth, u.innerHeight = E.innerHeight, a.findSelectableTargets(u), u.startSelectedTargets = a.selectedTargets, u.scaleMatrix = Oo(), u.containerX = 0, u.containerY = 0;
      var M = a.container, _ = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (x) {
        var I = a.container.getBoundingClientRect();
        u.containerX = I.left, u.containerY = I.top, u.scaleMatrix = vp(a.container, x);
      }
      if (S) {
        var v = ye(S) && "element" in S ? ee({
          left: !0,
          top: !0,
          bottom: !0,
          right: !0
        }, S) : {
          element: S,
          left: !0,
          top: !0,
          bottom: !0,
          right: !0
        }, N = v.element, R = void 0;
        if (N) {
          _e(N) ? R = Ne(M).querySelector(N) : N === !0 ? R = a.container : R = N;
          var P = R.getBoundingClientRect();
          v.left && (_.left = P.left), v.top && (_.top = P.top), v.right && (_.right = P.right), v.bottom && (_.bottom = P.bottom);
        }
      }
      u.boundArea = _;
      var A = {
        left: c,
        top: f,
        right: c,
        bottom: f,
        width: 0,
        height: 0
      }, B = [], X = m && !D, V = !1;
      if (!g || X) {
        var G = a._findElement(
          l || d.target,
          // elementFromPoint(clientX, clientY),
          u.selectableTargets
        );
        V = !!G, X && (B = G ? [G] : []);
      }
      var K = !g && V;
      if (K && !m)
        return s.stop(), !1;
      var U = d.type, L = U === "mousedown" || U === "touchstart", rt = !s.isClick && L ? a.emit("dragStart", ee(ee({}, s), {
        data: u.data
      })) : !0;
      if (!rt)
        return s.stop(), !1;
      if (a.continueSelect ? (B = $l(a.selectedTargets, B, a.continueSelectWithoutDeselect), u.startPassedTargets = a.selectedTargets) : u.startPassedTargets = [], a._select(B, A, s, !0, K && m && !D && w), u.startX = c, u.startY = f, u.selectFlag = !1, u.preventDragFromInside = !1, d.target) {
        var nt = Ca(u.scaleMatrix, [c - u.containerX, f - u.containerY]);
        a.target.style.cssText += "position: ".concat(x ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(nt[0], "px, ").concat(nt[1], "px)");
      }
      if (K && m && !D)
        d.preventDefault(), w && (a._selectEnd(u.startSelectedTargets, u.startPassedTargets, A, s, !0), u.preventDragFromInside = !0);
      else {
        u.selectFlag = !0;
        var tt = a.options, at = tt.scrollOptions, J = tt.innerScrollOptions, ot = !1;
        if (J) {
          for (var ft = s.inputEvent, bt = ft.target, pt = null, H = bt; H && H !== Ne(M).body; ) {
            var ut = getComputedStyle(H).overflow !== "visible";
            if (ut) {
              pt = H;
              break;
            }
            H = H.parentElement;
          }
          pt && (u.innerScrollOptions = ee({
            container: pt,
            checkScrollEvent: !0
          }, J === !0 ? {} : J), a.dragScroll.dragStart(s, u.innerScrollOptions), ot = !0);
        }
        !ot && at && at.container && a.dragScroll.dragStart(s, at), K && m && D && (u.selectFlag = !1, s.preventDrag());
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
      var l = s.data, u = s.inputEvent, c = Hl(s, a.options.ratio), f = l.selectFlag, d = a.container;
      if (u && a.emit("dragEnd", ee(ee({
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
        var h = a._findElement((u == null ? void 0 : u.target) || Ig(d, s.clientX, s.clientY), l.selectableTargets);
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
      var l = Ne(a.container);
      if (a.gesto.isFlag()) {
        var u = a.dragContainer;
        u === ke(a.container) && (u = l.documentElement);
        var c = Mn(u) ? [u] : [].slice.call(u), f = s.target;
        c.some(function(d) {
          if (d === f || d.contains(f))
            return s.preventDefault(), !0;
        });
      }
    }, a.target = n.portalContainer;
    var i = n.container;
    a.options = ee({
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
      getElementRect: ma,
      cspNonce: "",
      ratio: 0
    }, n);
    var o = a.options.portalContainer;
    return o && (i = o.parentElement), a.container = i || document.body, a.initElement(), a.initDragScroll(), a.setKeyController(), a;
  }
  var r = e.prototype;
  return r.setSelectedTargets = function(n) {
    var a = this.selectedTargets, i = Fr(a, n), o = i.added, s = i.removed, l = i.prevList, u = i.list;
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
    return ee(ee({}, d), {
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
    this.off(), this.keycon && this.keycon.destroy(), this.gesto.unset(), this.injectResult.destroy(), this.dragScroll.dragEnd(), qt(document, "selectstart", this._onDocumentSelectStart), this.options.portalContainer || (n = this.target.parentElement) === null || n === void 0 || n.removeChild(this.target), this.keycon = null, this.gesto = null, this.injectResult = null, this.target = null, this.container = null, this.options = null;
  }, r.getElementPoints = function(n) {
    var a = this.getElementRect || ma, i = a(n), o = [i.pos1, i.pos2, i.pos4, i.pos3];
    if (a !== ma) {
      var s = n.getBoundingClientRect();
      return Zi(o, s);
    }
    return o;
  }, r.getSelectableElements = function() {
    var n = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (Ha(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (Mn(i))
        a.push(i);
      else if (ye(i))
        a.push(i.value || i.current);
      else {
        var s = [].slice.call(Ne(n).querySelectorAll(i));
        a.push.apply(a, s);
      }
    }), a;
  }, r.checkScroll = function() {
    if (this.gesto.isFlag()) {
      var n = this.scrollOptions, a = this.gesto.getEventData().innerScrollOptions, i = a || (n == null ? void 0 : n.container);
      i && this.dragScroll.checkScroll(ee({
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
    var s = this.options, l = s.checkOverflow || s.innerScrollOptions, u = Ne(this.container);
    if (l) {
      var c = /* @__PURE__ */ new Map();
      n.selectableInnerScrollParentMap = c, n.selectableInnerScrollPathsList = i.map(function(f, d) {
        for (var h = f.parentElement, g = [], m = [], x = function() {
          var S = c.get(h);
          if (!S) {
            var C = getComputedStyle(h).overflow !== "visible";
            if (C) {
              var w = ma(h);
              S = {
                parentElement: h,
                indexes: [],
                points: [w.pos1, w.pos2, w.pos4, w.pos3],
                paths: wn([], m)
              }, g.push(h), g.forEach(function(D) {
                c.set(D, S);
              }), g = [];
            }
          }
          S ? (h = S.parentElement, c.get(h).indexes.push(d), m.push(h)) : g.push(h), h = h.parentElement;
        }; h && h !== u.body; )
          x();
        return m;
      });
    }
    return s.checkOverflow || (n.selectableInners = i.map(function() {
      return !0;
    })), this._refreshGroups(n), i;
  }, r.clickTarget = function(n, a) {
    var i = _g(n), o = i.clientX, s = i.clientY, l = {
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
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new Dg(a || ke(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, r.setClassName = function(n) {
    this.options.className = n, this.target.setAttribute("class", "".concat(yo, " ").concat(n || ""));
  }, r.setKeyEvent = function() {
    var n = this.options, a = n.toggleContinueSelect, i = n.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, r.setKeyContainer = function(n) {
    var a = this, i = this.options;
    ji(i.keyContainer, n, function() {
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
    ji(i.toggleContinueSelect, n, function() {
      i.toggleContinueSelect = n, a.setKeyEvent();
    });
  }, r.setToggleContinueSelectWithoutDeselect = function(n) {
    var a = this, i = this.options;
    ji(i.toggleContinueSelectWithoutDeselect, n, function() {
      i.toggleContinueSelectWithoutDeselect = n, a.setKeyEvent();
    });
  }, r.setPreventDefault = function(n) {
    this.gesto.options.preventDefault = n;
  }, r.setCheckInput = function(n) {
    this.gesto.options.checkInput = n;
  }, r.initElement = function() {
    var n = this.options, a = n.dragContainer, i = n.checkInput, o = n.preventDefault, s = n.preventClickEventOnDragStart, l = n.preventClickEventOnDrag, u = n.preventClickEventByCondition, c = n.preventRightClick, f = c === void 0 ? !0 : c, d = n.className, h = this.container;
    this.target = rf(Rg("div", {
      className: "".concat(yo, " ").concat(d || "")
    }), this.target, h);
    var g = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(Ne(h).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new Bu(this.dragContainer, {
      checkWindowBlur: !0,
      container: ke(h),
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
    }), re(document, "selectstart", this._onDocumentSelectStart), this.injectResult = nf.inject(g, {
      nonce: this.options.cspNonce
    });
  }, r.hitTest = function(n, a, i, o) {
    var s = this.options, l = s.hitRate, u = s.selectByClick, c = n.left, f = n.top, d = n.right, h = n.bottom, g = a.innerGroups, m = a.innerWidth, x = a.innerHeight, S = o == null ? void 0 : o.clientX, C = o == null ? void 0 : o.clientY, w = a.ignoreClick, D = [[c, f], [d, f], [d, h], [c, h]], k = function(G, K) {
      var U = wr(typeof l == "function" ? "".concat(l(K)) : "".concat(l)), L = w ? !1 : Oa([S, C], G);
      if (!i && u && L)
        return !0;
      var rt = Qi(D, G);
      if (!rt.length)
        return !1;
      var nt = mn(rt), tt = 0;
      if (nt === 0 && mn(G) === 0 ? (tt = ql(G), nt = ql(rt)) : tt = mn(G), U.unit === "px")
        return nt >= U.value;
      var at = Ra(Math.round(nt / tt * 100), 0, 100);
      return at >= Math.min(100, U.value);
    }, E = a.selectableTargets, M = a.selectablePoints, _ = a.selectableInners;
    if (!g)
      return E.filter(function(G, K) {
        return _[K] ? k(M[K], E[K]) : !1;
      });
    for (var I = [], v = Math.floor(c / m), N = Math.floor(d / m), R = Math.floor(f / x), P = Math.floor(h / x), A = v; A <= N; ++A) {
      var B = g[A];
      if (B)
        for (var X = R; X <= P; ++X) {
          var V = B[X];
          V && V.forEach(function(G) {
            var K = M[G], U = _[G], L = E[G];
            U && k(K, L) && I.push(L);
          });
        }
    }
    return Tg(I);
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
          var g = u.selectableInnerScrollParentMap, m = g.get(d);
          m && (m.paths.forEach(function(x) {
            var S = g.get(x);
            S.points.forEach(function(C) {
              C[0] -= i, C[1] -= o;
            });
          }), m.indexes.forEach(function(x) {
            u.selectablePoints[x].forEach(function(S) {
              S[0] -= i, S[1] -= o;
            });
          }), h = !0);
        }
        h || u.selectablePoints.forEach(function(x) {
          x.forEach(function(S) {
            S[0] -= i, S[1] -= o;
          });
        }), n._refreshGroups(u), c.left -= i, c.right -= i, c.top -= o, c.bottom -= o, n.gesto.scrollBy(i, o, s.inputEvent), n._checkSelected(n.gesto.getCurrentEvent());
      }
    });
  }, r._select = function(n, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = i.inputEvent, u = i.data, c = this.setSelectedTargets(n), f = Fr(u.startSelectedTargets, n), d = f.added, h = f.removed, g = f.prevList, m = f.list, x = {
      startSelected: g,
      startAdded: d.map(function(S) {
        return m[S];
      }),
      startRemoved: h.map(function(S) {
        return g[S];
      })
    };
    o && this.emit("selectStart", ee(ee(ee({}, c), x), {
      rect: a,
      inputEvent: l,
      data: u.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    })), (c.added.length || c.removed.length) && this.emit("select", ee(ee(ee({}, c), x), {
      rect: a,
      inputEvent: l,
      data: u.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    }));
  }, r._selectEnd = function(n, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = o.inputEvent, u = o.isDouble, c = o.data, f = l && l.type, d = f === "mousedown" || f === "touchstart", h = Fr(n, this.selectedTargets), g = h.added, m = h.removed, x = h.prevList, S = h.list, C = Fr(a, this.selectedTargets), w = C.added, D = C.removed, k = C.prevList, E = C.list;
    this.emit("selectEnd", {
      startSelected: n,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: g.map(function(M) {
        return S[M];
      }),
      removed: m.map(function(M) {
        return x[M];
      }),
      afterAdded: w.map(function(M) {
        return E[M];
      }),
      afterRemoved: D.map(function(M) {
        return k[M];
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
    a === void 0 && (a = Hl(n, this.options.ratio));
    var i = n.data, o = a.top, s = a.left, l = a.width, u = a.height, c = i.selectFlag, f = i.containerX, d = i.containerY, h = i.scaleMatrix, g = Ca(h, [s - f, o - d]), m = Ca(h, [l, u]), x = [];
    if (c) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(g[0], "px, ").concat(g[1], "px);") + "width:".concat(m[0], "px;height:").concat(m[1], "px;");
      var S = this.hitTest(a, i, !0, n);
      x = $l(i.startPassedTargets, S, this.continueSelect && this.continueSelectWithoutDeselect);
    }
    var C = this.emit("drag", ee(ee({}, n), {
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
    var o = tf(n.inputEvent, n.key), s = [].concat(a), l = Vt(s[0]) ? s : [s];
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
      n.selectableInners = c.map(function(h, g) {
        var m = !1;
        return h.every(function(x) {
          if (m)
            return !0;
          if (x === l)
            return m = !0, !0;
          var S = u.get(x);
          if (S) {
            var C = s[g], w = S.points, D = Qi(C, w);
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
      f.forEach(function(h, g) {
        var m = 1 / 0, x = -1 / 0, S = 1 / 0, C = -1 / 0;
        h.forEach(function(k) {
          var E = Math.floor(k[0] / i), M = Math.floor(k[1] / o);
          m = Math.min(E, m), x = Math.max(E, x), S = Math.min(M, S), C = Math.max(M, C);
        });
        for (var w = m; w <= x; ++w)
          for (var D = S; D <= C; ++D)
            d[w] = d[w] || {}, d[w][D] = d[w][D] || [], d[w][D].push(g);
      }), n.innerGroups = d;
    }
  }, e = Mg([Xd(as, function(n, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = Hi("get ".concat(a));
    n[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = Hi("set ".concat(a));
    n[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(n, a, i);
  })], e), e;
})(Pn), Ng = /* @__PURE__ */ (function(t) {
  ef(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})(jg), bo = function(t, e) {
  return bo = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, bo(t, e);
};
function zg(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  bo(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Ya = function() {
  return Ya = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ya.apply(this, arguments);
};
function Ag(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
var Vl = af.map(function(t) {
  return Hi("on ".concat(t));
}), Bg = /* @__PURE__ */ (function(t) {
  zg(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var r = e.prototype;
  return r.render = function() {
    return Q.createElement("div", {
      className: yo,
      ref: lr(this, "selectionElement")
    });
  }, r.componentDidMount = function() {
    var n = this, a = this.props, i = {};
    Pg.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new Ng(Ya(Ya({}, i), {
      portalContainer: this.selectionElement
    })), af.forEach(function(o, s) {
      n.selecto.on(o, function(l) {
        var u = n.props, c = u[Vl[s]] && u[Vl[s]](l);
        c === !1 && l.stop();
      });
    });
  }, r.componentDidUpdate = function(n) {
    var a = this.props, i = this.selecto;
    as.forEach(function(o) {
      n[o] !== a[o] && (i[o] = a[o]);
    });
  }, r.componentWillUnmount = function() {
    this.selecto.destroy();
  }, Ag([wu(Og)], e.prototype, "selecto", void 0), e;
})(Q.PureComponent);
function xa(t, e, r) {
  const n = e + r;
  if (n < 0 || n >= t.length) return t.slice();
  const a = t.slice(), [i] = a.splice(e, 1);
  return a.splice(n, 0, i), a;
}
function Fg({ recipe: t, onChange: e }) {
  const { t: r } = _r(), n = (c) => e({ ...t, ...c }), a = (c) => {
    var f;
    return ((f = t.display.find((d) => d.slot === c)) == null ? void 0 : f.name) ?? `#${c}`;
  }, i = (c) => {
    var f;
    return ((f = t.display.find((d) => d.slot === c)) == null ? void 0 : f.colour) ?? "#888";
  }, o = (c, f) => n({ columns: t.columns.map((d, h) => h === c ? { ...d, ...f } : d) }), s = new Set(t.columns.filter((c) => c.kind === "channel").map((c) => c.slot)), l = t.columns.some((c) => c.kind === "merge"), u = t.display.filter((c) => !s.has(c.slot));
  return /* @__PURE__ */ b.jsxs("div", { className: "gl-cellpanel-editor", children: [
    /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: r("Cells from the Images tab as rows and image channels as columns; every part can be changed here. The pictures are drawn from the file's images.") }),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
      r("Title"),
      /* @__PURE__ */ b.jsx("input", { value: t.title ?? "", onChange: (c) => n({ title: c.target.value }) })
    ] }),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
      r("Tile size"),
      /* @__PURE__ */ b.jsx("input", { type: "number", min: 16, max: 240, value: t.tile, onChange: (c) => n({ tile: Math.max(16, Math.min(240, Math.round(Number(c.target.value) || 64))) }) })
    ] }),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
      r("Exposure"),
      /* @__PURE__ */ b.jsx("input", { type: "range", min: -2, max: 2, step: 0.05, value: Math.log2(t.exposure), onChange: (c) => n({ exposure: Math.pow(2, Number(c.target.value)) }) })
    ] }),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ b.jsx("input", { type: "checkbox", checked: t.transpose === !0, onChange: (c) => n({ transpose: c.target.checked }) }),
      r("Cells as columns")
    ] }),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ b.jsx("input", { type: "checkbox", checked: t.showHeaders !== !1, onChange: (c) => n({ showHeaders: c.target.checked }) }),
      r("Channel names")
    ] }),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ b.jsx("input", { type: "checkbox", checked: t.showLabels !== !1, onChange: (c) => n({ showLabels: c.target.checked }) }),
      r("Cell labels")
    ] }),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
      /* @__PURE__ */ b.jsx("input", { type: "checkbox", checked: t.outline === !0, onChange: (c) => n({ outline: c.target.checked }) }),
      r("Mask outline")
    ] }),
    /* @__PURE__ */ b.jsx("div", { className: "gl-cellpanel-section", children: r("Channels shown") }),
    /* @__PURE__ */ b.jsx("ol", { className: "gl-cellpanel-list", "aria-label": r("Channels shown"), children: t.columns.map((c, f) => {
      var d;
      return /* @__PURE__ */ b.jsxs("li", { className: "gl-cellpanel-row" + (c.hidden ? " is-off" : ""), children: [
        /* @__PURE__ */ b.jsx(
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
        c.kind === "channel" && c.slot !== void 0 ? /* @__PURE__ */ b.jsx("span", { className: "gl-cell-chip", style: { background: c.grey ? "#bdbdbd" : i(c.slot) }, title: a(c.slot) }) : /* @__PURE__ */ b.jsx("span", { className: "gl-cellpanel-merge-mark", title: r("Merge"), children: "+" }),
        /* @__PURE__ */ b.jsx(
          "input",
          {
            className: "gl-cellpanel-text",
            value: c.header,
            "aria-label": r("Column name"),
            onChange: (h) => o(f, { header: h.target.value })
          }
        ),
        c.kind === "channel" && c.slot !== void 0 && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
          /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: r("Draw this channel in grey rather than its colour"), children: [
            /* @__PURE__ */ b.jsx("input", { type: "checkbox", checked: c.grey === !0, onChange: (h) => o(f, { grey: h.target.checked }) }),
            r("Grey")
          ] }),
          /* @__PURE__ */ b.jsx(
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
        c.kind === "merge" && /* @__PURE__ */ b.jsx("span", { className: "gl-cellpanel-merge", children: t.display.map((h) => /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: h.name, children: [
          /* @__PURE__ */ b.jsx(
            "input",
            {
              type: "checkbox",
              checked: (c.slots ?? []).includes(h.slot),
              onChange: (g) => {
                const m = new Set(c.slots ?? []);
                g.target.checked ? m.add(h.slot) : m.delete(h.slot), o(f, { slots: t.display.map((x) => x.slot).filter((x) => m.has(x)) });
              }
            }
          ),
          /* @__PURE__ */ b.jsx("span", { className: "gl-cell-chip", style: { background: h.colour } })
        ] }, h.slot)) }),
        /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move up"), "aria-label": r("Move up"), disabled: f === 0, onClick: () => n({ columns: xa(t.columns, f, -1) }), children: /* @__PURE__ */ b.jsx(Fs, { size: 12 }) }),
        /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move down"), "aria-label": r("Move down"), disabled: f === t.columns.length - 1, onClick: () => n({ columns: xa(t.columns, f, 1) }), children: /* @__PURE__ */ b.jsx(Gs, { size: 12 }) }),
        c.kind === "merge" && /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Remove"), "aria-label": r("Remove"), onClick: () => n({ columns: t.columns.filter((h, g) => g !== f) }), children: /* @__PURE__ */ b.jsx(Ls, { size: 12 }) })
      ] }, `${c.kind}-${c.slot ?? "m"}-${f}`);
    }) }),
    (u.length > 0 || !l) && /* @__PURE__ */ b.jsxs(
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
          /* @__PURE__ */ b.jsx("option", { value: "", children: r("Add a column…") }),
          u.map((c) => /* @__PURE__ */ b.jsx("option", { value: String(c.slot), children: c.name }, c.slot)),
          !l && /* @__PURE__ */ b.jsx("option", { value: "merge", children: r("Merge") })
        ]
      }
    ),
    /* @__PURE__ */ b.jsx("div", { className: "gl-cellpanel-section", children: r("Cells shown") }),
    /* @__PURE__ */ b.jsx("ol", { className: "gl-cellpanel-list", "aria-label": r("Cells shown"), children: t.cells.map((c, f) => /* @__PURE__ */ b.jsxs("li", { className: "gl-cellpanel-row", children: [
      /* @__PURE__ */ b.jsx(
        "input",
        {
          className: "gl-cellpanel-text",
          value: c.label,
          "aria-label": r("Label of event {index}", { index: c.event.toLocaleString() }),
          onChange: (d) => n({ cells: t.cells.map((h, g) => g === f ? { ...h, label: d.target.value } : h) })
        }
      ),
      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move up"), "aria-label": r("Move up"), disabled: f === 0, onClick: () => n({ cells: xa(t.cells, f, -1) }), children: /* @__PURE__ */ b.jsx(Fs, { size: 12 }) }),
      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Move down"), "aria-label": r("Move down"), disabled: f === t.cells.length - 1, onClick: () => n({ cells: xa(t.cells, f, 1) }), children: /* @__PURE__ */ b.jsx(Gs, { size: 12 }) }),
      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", title: r("Remove"), "aria-label": r("Remove"), disabled: t.cells.length <= 1, onClick: () => n({ cells: t.cells.filter((d, h) => h !== f) }), children: /* @__PURE__ */ b.jsx(Ls, { size: 12 }) })
    ] }, `${c.event}-${f}`)) })
  ] });
}
const je = "http://www.w3.org/2000/svg";
function ya(t, e) {
  const r = URL.createObjectURL(t), n = document.createElement("a");
  n.href = r, n.download = e, document.body.appendChild(n), n.click(), n.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function Cr(t, e, r, n = { x: 0, y: 0 }) {
  const a = t.getBoundingClientRect();
  return {
    left: (a.left - e.left) / r - n.x,
    top: (a.top - e.top) / r - n.y,
    width: a.width / r,
    height: a.height / r
  };
}
function Kl(t, e, r, n, a, i) {
  e.forEach((o) => {
    if (!o.text) return;
    const s = document.createElementNS(je, "text");
    s.setAttribute("x", String(r + o.left)), s.setAttribute("y", String(n + o.top + a * 0.82)), s.setAttribute("font-size", String(a)), s.setAttribute("font-family", i.fontFamily || Wf), s.setAttribute("font-weight", i.fontWeight || "400"), s.setAttribute("fill", i.color || "#1e293b"), s.setAttribute("xml:space", "preserve"), s.textContent = o.text, t.appendChild(s);
  });
}
function Gg(t, e) {
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
function Ul(t, e, r, n, a, i, o) {
  const s = Cr(e, r, n, i), l = document.createElementNS(je, "g");
  l.setAttribute("transform", `translate(${Math.round(s.left)},${Math.round(s.top)})`);
  const u = e.querySelector("canvas");
  if (u) {
    const f = document.createElementNS(je, "image"), d = Cr(u, r, n, i);
    f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("width", String(Math.round(d.width || s.width))), f.setAttribute("height", String(Math.round(d.height || s.height))), f.setAttribute("href", Yf(e, a, Math.round(d.width || s.width)) ?? u.toDataURL("image/png")), l.appendChild(f);
  }
  const c = e.querySelector("svg");
  if (c) {
    const f = c.cloneNode(!0), d = c.clientWidth || Number(c.getAttribute("width")) || s.width, h = d > 0 ? s.width / d : 1;
    if (Math.abs(h - 1) > 1e-3) {
      const g = document.createElementNS(je, "g");
      g.setAttribute("transform", `scale(${h})`), g.appendChild(f), l.appendChild(g);
    } else l.appendChild(f);
  }
  ou(l, o), t.appendChild(l);
}
function Zl(t, e, r, n) {
  return [...t.querySelectorAll(".gl-layout-item")].sort((a, i) => (Number(a.style.zIndex) || 0) - (Number(i.style.zIndex) || 0)).map((a) => ({ item: a, frame: Cr(a, e, r, n) }));
}
function Lg(t, e, r, n) {
  let a = 1 / 0, i = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const { frame: f } of t)
    f.left >= e || f.top >= r || f.left + f.width <= 0 || f.top + f.height <= 0 || (a = Math.min(a, f.left), i = Math.min(i, f.top), o = Math.max(o, f.left + f.width), s = Math.max(s, f.top + f.height));
  if (!Number.isFinite(a)) return null;
  const l = Math.max(0, n) * Li, u = Math.max(0, Math.floor(a - l)), c = Math.max(0, Math.floor(i - l));
  return { x: u, y: c, width: Math.min(e, Math.ceil(o + l)) - u, height: Math.min(r, Math.ceil(s + l)) - c };
}
function Wg(t, e, r) {
  var g, m;
  const n = Gi(e.page), a = ka(e.page)[r.pageIndex ?? 0] ?? { x: 0, y: 0 }, i = t.getBoundingClientRect(), o = r.crop ? Lg(Zl(t, i, r.zoom, a), n.width, n.height, r.crop.paddingMm) : null, s = o ? { x: a.x + o.x, y: a.y + o.y } : a, l = o ? o.width : n.width, u = o ? o.height : n.height, c = document.createElementNS(je, "svg");
  c.setAttribute("xmlns", je), c.setAttribute("width", String(l)), c.setAttribute("height", String(u)), c.setAttribute("viewBox", `0 0 ${l} ${u}`);
  const f = document.createElementNS(je, "rect");
  f.setAttribute("width", "100%"), f.setAttribute("height", "100%"), f.setAttribute("fill", "#ffffff"), c.appendChild(f);
  let d = 0;
  for (const { item: x, frame: S } of Zl(t, i, r.zoom, s)) {
    if (S.left >= l || S.top >= u || S.left + S.width <= 0 || S.top + S.height <= 0) continue;
    d += 1;
    const C = x.dataset.title ?? ((g = x.querySelector(".gl-layout-item-head span")) == null ? void 0 : g.textContent) ?? "";
    if (x.classList.contains("has-frame")) {
      const M = document.createElementNS(je, "rect");
      M.setAttribute("x", String(Math.round(S.left) + 0.5)), M.setAttribute("y", String(Math.round(S.top) + 0.5)), M.setAttribute("width", String(Math.round(S.width) - 1)), M.setAttribute("height", String(Math.round(S.height) - 1)), M.setAttribute("fill", "none"), M.setAttribute("stroke", "#94a3b8"), M.setAttribute("id", cn("frame", d, C)), c.appendChild(M);
    }
    const w = x.querySelector(".gl-layout-text-surface");
    if (w) {
      const M = w instanceof HTMLTextAreaElement ? w.value : w.textContent ?? "", _ = getComputedStyle(w), I = Cr(w, i, r.zoom, s), v = Number(x.dataset.zoom) || 1, N = (parseFloat(_.fontSize) || 14) * v, R = (parseFloat(_.paddingLeft) || 0) * v, P = (parseFloat(_.paddingTop) || 0) * v, A = ((m = Gg(w, M)) == null ? void 0 : m.map((X) => ({ text: X.text, left: X.left * v, top: X.top * v }))) ?? M.split(`
`).map((X, V) => ({ text: X, left: 0, top: V * N * 1.3 })), B = document.createElementNS(je, "g");
      B.setAttribute("id", cn("text", d, M.trim().split(/\s+/).slice(0, 4).join(" "))), Kl(B, A, I.left + R, I.top + P, N, _), c.appendChild(B);
      continue;
    }
    const D = x.querySelector(".gl-layout-plot-host");
    if (!D) continue;
    if (D.__miniPlotCfg) {
      Ul(c, D, i, r.zoom, r.dpi, s, cn("plot", d, C));
      continue;
    }
    const k = D.querySelector(".gl-prop-chart");
    if (k) {
      const M = Gf(k);
      if (M) {
        const _ = Cr(k, i, r.zoom, s), I = M.width > 0 ? _.width / M.width : 1, v = document.createElementNS(je, "g");
        v.setAttribute("id", cn("chart", d, C)), v.setAttribute("transform", `translate(${_.left},${_.top}) scale(${I})`), v.appendChild(M.root), c.appendChild(v);
      }
      continue;
    }
    D.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((M) => {
      const _ = (M.textContent ?? "").trim();
      if (!_) return;
      const I = getComputedStyle(M), v = Cr(M, i, r.zoom, s), N = M.offsetWidth > 0 ? v.width / M.offsetWidth : 1;
      Kl(c, [{ text: _, left: 0, top: 0 }], v.left, v.top, (parseFloat(I.fontSize) || 12) * N, I);
    });
    const E = cn(D.querySelector(".gl-figure-grid") ? "figure" : "strategy", d, C);
    D.querySelectorAll(".mini-plot-cell").forEach((M, _) => Ul(c, M, i, r.zoom, r.dpi, s, `${E}-panel-${_ + 1}`)), D.querySelectorAll("svg.gl-strategy-arrows").forEach((M) => {
      const _ = Cr(M, i, r.zoom, s), I = Number(M.getAttribute("width")) || M.clientWidth || _.width, v = I > 0 ? _.width / I : 1, N = document.createElementNS(je, "g");
      N.setAttribute("transform", `translate(${Math.round(_.left)},${Math.round(_.top)}) scale(${v})`), Array.from(M.childNodes).forEach((R) => N.appendChild(R.cloneNode(!0))), ou(N, `${E}-arrows`), c.appendChild(N);
    });
  }
  const h = o ? { widthMm: l / Li, heightMm: u / Li } : su(e.page);
  return Lf(c, { widthPx: l, heightPx: u, ...h }), { root: c, width: l, height: u, ...h };
}
function Jl(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
function Yg(t, e, r) {
  return ka(e.page).map((n, a) => Wg(t, e, { dpi: e.page.dpi, zoom: r.zoom, pageIndex: a, crop: r.crop }));
}
const Ql = 72 / 25.4;
function tu(t, e, r, n) {
  const a = e.label ? iu(e.label) : "";
  return `${t}-p${r + 1}${a ? `-${a}` : ""}.${n}`;
}
async function Xg(t, e, r) {
  const n = e.page.dpi, a = iu(e.name) || "layout";
  if (!t.length) return;
  if (r === "svg") {
    if (t.length === 1) {
      ya(new Blob([Jl(t[0].root)], { type: "image/svg+xml" }), `${a}.svg`);
      return;
    }
    const u = {};
    t.forEach((c, f) => {
      u[tu(a, c, f, "svg")] = Bf(Jl(c.root));
    }), ya(new Blob([Ws(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  if (r === "png") {
    if (t.length === 1) {
      ya(await Ys(await gi(t[0], n), n), `${a}.png`);
      return;
    }
    const u = {};
    for (const [c, f] of t.entries()) {
      const d = await gi(f, n);
      u[tu(a, t[c], c, "png")] = new Uint8Array(await (await Ys(d, n)).arrayBuffer()), await Xs();
    }
    ya(new Blob([Ws(u)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const i = (u) => {
    const c = u.widthMm * Ql, f = u.heightMm * Ql;
    return { width: c, height: f, orientation: c >= f ? "landscape" : "portrait" };
  }, { jsPDF: o } = await import("./jspdf.es.min-BjxRJ2Uq.js").then((u) => u.j), s = i(t[0]), l = new o({ orientation: s.orientation, unit: "pt", format: [s.width, s.height], compress: !0 });
  for (const [u, c] of t.entries()) {
    const { width: f, height: d, orientation: h } = i(c);
    if (u > 0 && l.addPage([f, d], h), !await Ff(l, c.root, { width: f, height: d })) {
      const g = await gi(c, n);
      l.addImage(g, "PNG", 0, 0, f, d, void 0, "FAST");
    }
    await Xs();
  }
  l.save(`${a}.pdf`);
}
const Xa = "Unassigned";
function of(t) {
  const e = {};
  for (const [r, n] of Object.entries(t[0] ?? {}))
    t.every((a) => (a == null ? void 0 : a[r]) === n) && (e[r] = n);
  return e;
}
function sf(t) {
  return Lt(t.recipe) && t.recipe.iterated === !0;
}
function So(t, e, r, n) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(r) : i === "N" ? String(n) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function Ni(t, e, r, n, a, i) {
  var u;
  const o = sf(t), s = { ...t.recipe };
  let l;
  return s.kind === "text" ? s.text = So(s.text, s.readsFrom ? null : e, r, n) : (o && e && e.populationId ? ("populationId" in s && (s.populationId = e.populationId), s.kind === "strategy" && ((u = s.populationIds) != null && u.length) && (s.populationIds = [e.populationId])) : o && e && e.sampleIds ? ((s.kind === "biplot" || s.kind === "histogram") && e.sampleIds.length > 1 ? s.pool = { sampleIds: [...e.sampleIds] } : "pool" in s && delete s.pool, "sampleId" in s && !e.sampleIds.includes(s.sampleId) && e.sampleIds.length && (l = s.sampleId, s.sampleId = e.sampleIds[0])) : o && e && "sampleId" in s && ("pool" in s && delete s.pool, s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id)), s.title && (s.title = So(s.title, o ? e : null, r, n))), {
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
function Hg(t, e) {
  if (e)
    for (const r of t) {
      if (r.recipe.kind !== "text" || !r.recipe.readsFrom) continue;
      const n = r.recipe.readsFrom, a = t.find((o) => o.templateId === n && o.offset.x === r.offset.x && o.offset.y === r.offset.y);
      if (!a || !Lt(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId, a.unitId);
      i && (r.recipe = { ...r.recipe, text: Ma(r.recipe.text, i) });
    }
}
function $g(t, e, r) {
  const n = qg(t, e);
  for (const a of n) Hg(a.items, r);
  return n;
}
function qg(t, e) {
  const r = t.iteration ?? uu;
  if (r.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((h) => Ni(h, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const n = e.length;
  if (r.arrangement.kind === "page-per-unit")
    return e.map((h, g) => ({
      index: g,
      units: [h],
      items: t.items.map((m) => Ni(m, h, g + 1, n, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = r.arrangement, l = lu(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const u = a * i, c = l.width + s, f = l.height + s, d = [];
  for (let h = 0; h < n; h += u) {
    const g = e.slice(h, h + u), m = [];
    g.forEach((x, S) => {
      const C = o === "row-major" ? Math.floor(S / i) : S % a, D = { x: (o === "row-major" ? S % i : Math.floor(S / a)) * c, y: C * f };
      for (const k of t.items) m.push(Ni(k, x, h + S + 1, n, D, S));
    }), d.push({ index: d.length, units: g, items: m });
  }
  return d;
}
function lf(t, e, r, n) {
  return e.filter((a) => {
    var i;
    return t.kind === "all" ? !0 : t.kind === "checked" ? r.includes(a.id) : t.kind === "group" ? n[a.id] === t.groupId : (((i = a.metadata) == null ? void 0 : i[t.column]) ?? "") === t.value;
  });
}
function Vg(t, e, r, n, a) {
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
  return lf(t.source, e, r, a).map(i);
}
function Kg(t, e, r, n, a, i) {
  var d;
  const o = t.column ?? "";
  if (!o) return [];
  const s = /* @__PURE__ */ new Map(), l = [];
  for (const h of lf(t.source, e, r, a)) {
    const g = ((d = h.metadata) == null ? void 0 : d[o]) ?? "";
    if (!g) {
      l.push(h);
      continue;
    }
    s.set(g, [...s.get(g) ?? [], h]);
  }
  const u = [...s.keys()], c = i ? [...i.filter((h) => s.has(h)), ...u.filter((h) => !i.includes(h)).sort(Hs)] : u.sort(Hs), f = (h, g) => {
    const m = new Set(g.map((x) => {
      var S;
      return (S = n.find((C) => C.id === a[x.id])) == null ? void 0 : S.name;
    }));
    return {
      id: `meta:${o}=${h}`,
      name: h,
      fileName: `${g.length} files`,
      ...m.size === 1 && [...m][0] ? { groupName: [...m][0] } : {},
      // What the files share, and the value itself, so {meta:column} names the page, the files
      // without a value included.
      metadata: { ...of(g.map((x) => x.metadata)), [o]: h },
      sampleIds: g.map((x) => x.id)
    };
  };
  return [
    ...c.map((h) => f(h, s.get(h))),
    ...l.length ? [f(Xa, l)] : []
  ];
}
function Ug(t, e, r) {
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
  return Sa(e.populations, n).filter(({ popId: s }) => s !== n && i(s)).map(({ popId: s }) => {
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
function eu(t, e) {
  const r = lu(t.items);
  if (!r) return { columns: 1, rows: 1 };
  const n = Wi(t.page.marginMm), a = (i, o, s) => Math.max(1, Math.min(Zg, Math.floor((s - n - i + e) / Math.max(1, o + e))));
  return { columns: a(r.x, r.width, t.width), rows: a(r.y, r.height, t.height) };
}
const Zg = 12;
function Jg(t, e) {
  return t.filter((r) => r.x + r.width > e.width + 0.5 || r.y + r.height > e.height + 0.5 || r.x < -0.5 || r.y < -0.5).length;
}
function Qg(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const tm = (t) => [...t].sort((e, r) => e - r);
function zi(t, e) {
  const r = tm(t);
  if (!r.length) return NaN;
  const n = (r.length - 1) * e, a = Math.floor(n), i = Math.ceil(n);
  return r[a] + (r[i] - r[a]) * (n - a);
}
function em(t, e) {
  const r = e.map((o) => o.value), n = r.length, a = n ? r.reduce((o, s) => o + s, 0) / n : NaN, i = n > 1 ? Math.sqrt(r.reduce((o, s) => o + (s - a) ** 2, 0) / (n - 1)) : 0;
  return {
    label: t,
    points: e,
    n,
    mean: a,
    sd: i,
    median: zi(r, 0.5),
    q1: zi(r, 0.25),
    q3: zi(r, 0.75),
    min: n ? Math.min(...r) : NaN,
    max: n ? Math.max(...r) : NaN
  };
}
function rm(t) {
  const e = [], r = /* @__PURE__ */ new Map();
  for (const n of t)
    r.has(n.group) || (r.set(n.group, []), e.push(n.group)), r.get(n.group).push(n);
  return e.map((n) => em(n, r.get(n)));
}
function uf(t) {
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
function nm(t) {
  const e = Math.abs(t) / Math.SQRT2, r = 1 / (1 + 0.3275911 * e), i = r * (0.254829592 + r * (-0.284496736 + r * (1.421413741 + r * (-1.453152027 + r * 1.061405429)))) * Math.exp(-e * e) / 2;
  return t >= 0 ? i : 1 - i;
}
function am(t, e) {
  if (e <= 0) return 0;
  const r = im(t);
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
function im(t) {
  const e = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18];
  let r = t, n = t, a = r + 5.5;
  a -= (r + 0.5) * Math.log(a);
  let i = 1.000000000190015;
  for (const o of e) i += o / ++n;
  return -a + Math.log(2.5066282746310007 * i / r);
}
function om(t, e) {
  return t > 0 ? Math.max(0, Math.min(1, 1 - am(e / 2, t / 2))) : 1;
}
function sm(t, e) {
  if (t.length < 2 || e.length < 2) return null;
  const r = t.length, n = e.length, { rank: a, ties: i } = uf([...t, ...e]), s = a.slice(0, r).reduce((h, g) => h + g, 0) - r * (r + 1) / 2, l = r + n, u = r * n / 2, c = Math.sqrt(r * n / 12 * (l + 1 - i / (l * (l - 1))));
  if (!(c > 0)) return { name: "Wilcoxon rank-sum", statistic: s, p: 1, label: "Wilcoxon p = 1" };
  const f = (Math.abs(s - u) - 0.5) / c, d = Math.min(1, 2 * nm(Math.max(0, f)));
  return { name: "Wilcoxon rank-sum", statistic: s, p: d, label: `Wilcoxon ${cf(d)}` };
}
function lm(t) {
  const e = t.filter((c) => c.length > 0);
  if (e.length < 2 || e.some((c) => c.length < 2)) return null;
  const r = e.flat(), n = r.length, { rank: a, ties: i } = uf(r);
  let o = 0, s = 0;
  for (const c of e) {
    const f = a.slice(o, o + c.length).reduce((d, h) => d + h, 0);
    s += f * f / c.length, o += c.length;
  }
  s = 12 / (n * (n + 1)) * s - 3 * (n + 1);
  const l = 1 - i / (n ** 3 - n);
  l > 0 && (s /= l);
  const u = om(s, e.length - 1);
  return { name: "Kruskal–Wallis", statistic: s, p: u, label: `Kruskal–Wallis ${cf(u)}` };
}
function um(t) {
  const e = t.map((r) => r.points.map((n) => n.value));
  return e.length === 2 ? sm(e[0], e[1]) : e.length > 2 ? lm(e) : null;
}
function cf(t) {
  return Number.isFinite(t) ? t < 1e-3 ? "p < 0.001" : `p = ${t < 0.01 ? t.toFixed(3) : t.toFixed(2)}` : "p = ?";
}
function cm(t, e = 5) {
  const r = t.filter((d) => Number.isFinite(d)), n = Math.min(0, ...r), a = Math.max(...r, n + 1e-9), o = (a - n || 1) / e, s = 10 ** Math.floor(Math.log10(o)), l = [1, 2, 2.5, 5, 10].map((d) => d * s).find((d) => d >= o) ?? s * 10, u = Math.floor(n / l) * l, c = Math.ceil((a + l * 0.15) / l) * l, f = [];
  for (let d = u; d <= c + l / 2; d += l) f.push(Number(d.toFixed(10)));
  return { min: u, max: c, ticks: f };
}
const fm = { identity: "linear", asinh: "arcsinh", logicle: "logicle" }, ff = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function df(t, e, r, n, a) {
  var S, C, w, D, k;
  const i = e.find((E) => E.id === t.sampleId) ?? null, o = ((S = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : S.name) ?? "the population", s = t.files === "all" ? e : e.filter((E) => n.includes(E.id)), l = [], u = [], c = [], f = /* @__PURE__ */ new Set();
  for (const E of s) {
    let M = t.populationId;
    if (i && i.tree.id !== E.tree.id) {
      const v = dn(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        E.tree,
        Br(a)
      );
      if (!v.id) {
        u.push(E.name);
        continue;
      }
      M = v.id;
    }
    let _;
    if (t.statistic === "median") {
      const v = t.channel ? E.sample.index(t.channel) : void 0, N = E.derived.masks[M];
      if (v === void 0) {
        c.push(E.name);
        continue;
      }
      if (!N) {
        u.push(E.name);
        continue;
      }
      f.add(fm[E.sample.transformKind(v)] ?? E.sample.transformKind(v));
      const R = E.sample.displayColumn(v), P = [];
      for (let A = 0; A < R.length; A++) N[A] && Number.isFinite(R[A]) && P.push(R[A]);
      _ = P.length ? Xf(P) : null;
    } else if (_ = E.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][M], _ === void 0) {
      u.push(E.name);
      continue;
    }
    if (typeof _ != "number" || !Number.isFinite(_)) continue;
    const I = t.groupBy ? ((w = (C = r[E.id]) == null ? void 0 : C[t.groupBy]) == null ? void 0 : w.trim()) || Xa : E.name;
    l.push({ sampleId: E.id, name: E.name, group: I, value: _ });
  }
  const d = rm(l), h = t.channel ? ((k = (i == null ? void 0 : i.sample) ?? ((D = s[0]) == null ? void 0 : D.sample)) == null ? void 0 : k.labelForKey(t.channel)) ?? t.channel : "", g = f.size ? ` (${[...f].join(", ")})` : "", m = t.statistic === "median" ? `Median ${h}`.trim() + g : ff[t.statistic], x = t.groupBy ? d.filter((E) => E.label !== Xa) : [];
  return { points: l, groups: d, test: t.test && t.groupBy ? um(x) : null, population: o, axis: m, missing: u, noChannel: c };
}
const Ai = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), dm = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function pm({
  data: t,
  recipe: e,
  style: r,
  width: n,
  height: a,
  title: i
}) {
  const o = r.fontTick, s = r.fontAxis, l = r.fontTitle, u = t.groups, c = Q.useMemo(() => cm(t.points.map((v) => v.value)), [t.points]), f = 8 + s + 6 + Math.max(...c.ticks.map((v) => Ai(v).length), 1) * o * 0.6 + 8, d = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), h = Math.max(0, ...u.map((v) => v.label.length)), g = u.length > 0 && h * o * 0.6 > (n - f - 8) / u.length, m = 8 + (g ? h * o * 0.45 + 10 : o + 8), x = Math.max(20, n - f - 8), S = Math.max(20, a - d - m), C = (v) => d + S - (v - c.min) / (c.max - c.min || 1) * S, w = u.length ? x / u.length : x, D = (v) => f + (v + 0.5) * w, k = Math.min(48, w * 0.6), E = r.pubStyle ? "#000000" : "#334155", M = r.pubStyle ? "#d4d4d8" : "#93c5fd", _ = r.pubStyle ? "#000000" : "#1d4ed8", I = C(Math.max(c.min, 0));
  return /* @__PURE__ */ b.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: n, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ b.jsxs("svg", { width: n, height: a, viewBox: `0 0 ${n} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ b.jsx("rect", { width: n, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ b.jsx("text", { x: n / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: E, children: i }),
    !t.points.length && /* @__PURE__ */ b.jsx("text", { x: n / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ b.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: E, children: [
      /* @__PURE__ */ b.jsx("line", { x1: f, x2: f, y1: d, y2: d + S, stroke: E }),
      c.ticks.map((v) => /* @__PURE__ */ b.jsxs("g", { children: [
        /* @__PURE__ */ b.jsx("line", { x1: f - 4, x2: f, y1: C(v), y2: C(v), stroke: E }),
        /* @__PURE__ */ b.jsx("text", { x: f - 6, y: C(v), textAnchor: "end", dominantBaseline: "central", children: Ai(v) })
      ] }, v)),
      /* @__PURE__ */ b.jsx("text", { transform: `translate(${8 + s} ${d + S / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ b.jsx("line", { x1: f, x2: f + x, y1: I, y2: I, stroke: E })
    ] }),
    /* @__PURE__ */ b.jsx("g", { className: "gl-layout-chart-groups", children: u.map((v, N) => {
      const R = D(N), P = e.showPoints || e.chartType === "dots" ? v.points : [];
      return /* @__PURE__ */ b.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(v.mean) && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
          /* @__PURE__ */ b.jsx("rect", { x: R - k / 2, y: Math.min(C(v.mean), I), width: k, height: Math.abs(I - C(v.mean)), fill: M, stroke: E, strokeWidth: 0.8 }),
          v.n > 1 && v.sd > 0 && /* @__PURE__ */ b.jsxs("g", { stroke: E, strokeWidth: 1, children: [
            /* @__PURE__ */ b.jsx("line", { x1: R, x2: R, y1: C(v.mean - v.sd), y2: C(v.mean + v.sd) }),
            /* @__PURE__ */ b.jsx("line", { x1: R - k / 4, x2: R + k / 4, y1: C(v.mean + v.sd), y2: C(v.mean + v.sd) }),
            /* @__PURE__ */ b.jsx("line", { x1: R - k / 4, x2: R + k / 4, y1: C(v.mean - v.sd), y2: C(v.mean - v.sd) })
          ] })
        ] }),
        e.chartType === "box" && v.n > 0 && /* @__PURE__ */ b.jsxs("g", { stroke: E, strokeWidth: 1, fill: M, children: [
          /* @__PURE__ */ b.jsx("line", { x1: R, x2: R, y1: C(v.min), y2: C(v.q1) }),
          /* @__PURE__ */ b.jsx("line", { x1: R, x2: R, y1: C(v.q3), y2: C(v.max) }),
          /* @__PURE__ */ b.jsx("rect", { x: R - k / 2, y: C(v.q3), width: k, height: Math.max(0.5, C(v.q1) - C(v.q3)) }),
          /* @__PURE__ */ b.jsx("line", { x1: R - k / 2, x2: R + k / 2, y1: C(v.median), y2: C(v.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && v.n > 1 && /* @__PURE__ */ b.jsx("line", { x1: R - k / 2, x2: R + k / 2, y1: C(v.mean), y2: C(v.mean), stroke: E, strokeWidth: 2 }),
        P.map((A, B) => /* @__PURE__ */ b.jsx("circle", { cx: R + dm(B + N * 31) * k * 0.3, cy: C(A.value), r: Math.max(2, o * 0.28), fill: _, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ b.jsx("title", { children: `${A.name}: ${Ai(A.value)}` }) }, A.sampleId)),
        /* @__PURE__ */ b.jsx(
          "text",
          {
            x: R,
            y: d + S + 6,
            textAnchor: g ? "end" : "middle",
            dominantBaseline: "hanging",
            fontSize: o,
            fill: E,
            transform: g ? `rotate(-45 ${R} ${d + S + 6})` : void 0,
            children: v.label
          }
        )
      ] }, v.label || String(N));
    }) }),
    t.test && u.length >= 2 && /* @__PURE__ */ b.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: E, children: [
      /* @__PURE__ */ b.jsx("line", { x1: D(0), x2: D(u.length - 1), y1: d - 4, y2: d - 4, stroke: E }),
      /* @__PURE__ */ b.jsx("text", { x: (D(0) + D(u.length - 1)) / 2, y: d - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const hm = Q.lazy(pu("LayoutImageWall", async () => ({ default: (await import("./LayoutImageWall-DcKEhEHB.js")).LayoutImageWall }))), vm = Q.lazy(pu("LayoutCellPanel", async () => ({ default: (await import("./LayoutCellPanel-EC48P37B.js")).LayoutCellPanel }))), ba = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), gm = { x: "X (px)", y: "Y (px)", width: "Width (px)", height: "Height (px)" }, fn = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], ru = 10, mm = { index: 0, units: [], items: [] }, xm = {}, nu = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, ym = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], bm = [
  { how: "horizontal", label: "Distribute ↔", title: "Equal spacing between three or more items or groups, left to right; the outer two stay where they are" },
  { how: "vertical", label: "Distribute ↕", title: "Equal spacing between three or more items or groups, top to bottom; the outer two stay where they are" }
];
function Sm(t) {
  var r, n, a;
  if (!t) return;
  t.stopDrag();
  const e = (r = t.getManager) == null ? void 0 : r.call(t);
  for (const i of ((n = e == null ? void 0 : e.getMoveables) == null ? void 0 : n.call(e)) ?? []) i !== e && ((a = i.stopDrag) == null || a.call(i));
}
function Cm(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function wm(t, e, r) {
  return e ? r.some((n) => !!n && (t === `${e} · ${n}` || t.startsWith(`${e} · ${n} · `))) : !1;
}
const Em = 128;
function au(t, e, r) {
  const n = du(t);
  return t.recipe.kind !== "biplot" && t.recipe.kind !== "histogram" ? rl(n) : rl(Math.min(n, Math.min(e, r) / Em));
}
function Ue(t, e, r) {
  var s, l, u;
  const n = t.recipe;
  if (n.kind === "text") return n.text.split(`
`)[0] || "Text";
  if ((s = n.title) != null && s.trim() && n.title.trim() !== cu) return n.title.trim();
  if (n.kind === "figure") return ((u = (l = n.illustration.figure) == null ? void 0 : l.name) == null ? void 0 : u.trim()) || "Figure";
  if (n.kind === "proportions") return n.settings.plotType === "box" ? "Boxplot" : "Composition";
  if (n.kind === "imagewall") return `${n.populationName || "Population"} · ${n.fileName || "images"}`;
  if (n.kind === "cellpanel") return `${n.cells.length} ${n.cells.length === 1 ? "cell" : "cells"} · ${n.fileName || "images"}`;
  const a = e.find(({ id: c }) => c === n.sampleId), i = a == null ? void 0 : a.tree.populations[n.populationId];
  if (n.kind === "chart") return `${(i == null ? void 0 : i.name) ?? "Population"} · ${ff[n.statistic]}`;
  if (n.kind === "strategy")
    return `${(i == null ? void 0 : i.name) ?? "Population"} strategy`;
  const o = En(n);
  return o ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${o.length} ${fu("files")}` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function En(t) {
  return (t.kind === "biplot" || t.kind === "histogram") && t.pool && t.pool.sampleIds.length > 1 ? t.pool.sampleIds : null;
}
function Ea(t, e, r, n) {
  var u;
  const a = ((u = t.pool) == null ? void 0 : u.sampleIds) ?? [t.sampleId], i = e.find(({ id: c }) => c === t.sampleId) ?? e.find(({ id: c }) => a.includes(c)) ?? null, o = [], s = [];
  if (!i) return { members: o, leftOut: s };
  const l = t.kind === "histogram" ? null : t.yChannel;
  for (const c of [i.id, ...a.filter((f) => f !== i.id)]) {
    const f = e.find((g) => g.id === c);
    if (!f) {
      s.push({ name: c, reason: "not loaded" });
      continue;
    }
    const d = _a(t.populationId, f.tree, r, n ?? i.tree.id);
    if (d.missing) {
      s.push({ name: f.name, reason: "no corresponding population" });
      continue;
    }
    const h = f === i ? null : id(i.sample, f.sample, t.xChannel, l);
    if (h) {
      s.push({ name: f.name, reason: h });
      continue;
    }
    o.push({ id: f.id, name: f.name, sample: f.sample, tree: f.tree, gating: f.derived, populationId: d.id });
  }
  return { members: o, leftOut: s };
}
function Dm({
  files: t,
  pool: e,
  checkedSampleIds: r,
  groups: n,
  fileGroups: a,
  report: i,
  onChange: o
}) {
  const { t: s } = _r(), [l, u] = Q.useState(""), c = Q.useMemo(
    () => Object.fromEntries(t.filter((m) => m.metadata).map((m) => [m.id, m.metadata])),
    [t]
  ), f = Q.useMemo(
    () => cd(c, [...new Set(Object.values(c).flatMap((m) => Object.keys(m)))].map((m) => ({ name: m }))),
    [c]
  ), d = Q.useMemo(() => new Set(t.filter((m) => !e.includes(m.id)).map((m) => m.id)), [t, e]), h = (m) => t.filter((x) => m instanceof Set ? m.has(x.id) : m.includes(x.id)).map((x) => x.id), g = l.trim().toLowerCase();
  return /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-pool", children: [
    /* @__PURE__ */ b.jsxs("div", { className: "gl-figure-actions gl-figure-list-actions", children: [
      /* @__PURE__ */ b.jsx("button", { type: "button", onClick: () => o(h(r)), children: s("Checked files") }),
      /* @__PURE__ */ b.jsx("button", { type: "button", onClick: () => o(t.map((m) => m.id)), children: s("All files") }),
      n.map((m) => /* @__PURE__ */ b.jsx("button", { type: "button", onClick: () => o(t.filter((x) => a[x.id] === m.id).map((x) => x.id)), children: s("Group {name}", { name: m.name }) }, m.id))
    ] }),
    /* @__PURE__ */ b.jsx(
      "input",
      {
        type: "search",
        "aria-label": s("Find files to pool"),
        placeholder: s("Find file / sample…"),
        value: l,
        onChange: (m) => u(m.target.value)
      }
    ),
    /* @__PURE__ */ b.jsx("div", { className: "gl-figure-list gl-layout-pool-list", children: t.filter((m) => !g || `${m.name} ${m.fileName ?? ""}`.toLowerCase().includes(g)).map((m) => /* @__PURE__ */ b.jsxs("label", { className: "gl-figure-row", title: m.fileName && m.fileName !== m.name ? `${m.name} · ${m.fileName}` : m.name, children: [
      /* @__PURE__ */ b.jsx(
        "input",
        {
          type: "checkbox",
          checked: e.includes(m.id),
          onChange: () => o(e.includes(m.id) ? e.filter((x) => x !== m.id) : h([...e, m.id]))
        }
      ),
      /* @__PURE__ */ b.jsx("span", { className: "gl-figure-row-name", children: m.name })
    ] }, m.id)) }),
    f.length > 0 && /* @__PURE__ */ b.jsx("div", { className: "gl-sample-facets gl-figure-facets", "aria-label": s("Select pooled files by metadata"), children: f.map((m) => /* @__PURE__ */ b.jsxs("div", { className: "gl-sample-facet-row", children: [
      /* @__PURE__ */ b.jsx("span", { className: "gl-sample-facet-lock", "aria-hidden": "true" }),
      /* @__PURE__ */ b.jsx("span", { className: "gl-sample-facet-name", title: m.name, children: m.name }),
      /* @__PURE__ */ b.jsx("div", { className: "gl-sample-facet-values", children: m.values.map((x) => {
        const S = fd(x.sampleIds, d), C = x.sampleIds.length, w = S === C ? "all" : S === 0 ? "none" : "some", D = C > 0 ? Math.round(S / C * 100) : 0;
        return /* @__PURE__ */ b.jsxs(
          "button",
          {
            type: "button",
            className: `gl-sample-facet-chip is-${w}`,
            style: w === "some" ? { "--gl-facet-fill": `${D}%` } : void 0,
            "aria-pressed": S === C,
            title: `${x.value}: ${S} of ${C} pooled — ${S === C ? `click to drop all ${C}` : `click to pool all ${C}`}`,
            onClick: () => o(h(new Set(t.filter((k) => !dd(x.sampleIds, d).has(k.id)).map((k) => k.id)))),
            children: [
              /* @__PURE__ */ b.jsx("span", { className: "gl-sample-facet-label", children: x.value }),
              /* @__PURE__ */ b.jsxs("span", { className: "gl-sample-facet-count", children: [
                S,
                "/",
                C
              ] })
            ]
          },
          x.value
        );
      }) })
    ] }, m.name)) }),
    i && /* @__PURE__ */ b.jsxs("p", { className: "gl-hint", children: [
      s("{n} of {m} files pooled", { n: i.pooled, m: i.total }),
      i.leftOut.length > 0 && ` · ${s("Not pooled: {files}", { files: i.leftOut.map((m) => `${m.name} (${m.reason})`).join(", ") })}`,
      i.omittedGates.length > 0 && ` · ${s("Gates not shown: {names} — they differ between the pooled files", { names: i.omittedGates.join(", ") })}`
    ] })
  ] });
}
function km({
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
  var N;
  const c = Q.useRef(null), f = t.recipe, d = JSON.stringify(o), h = Q.useMemo(() => Br(r), [r]), g = f.kind === "text" ? null : e.find(({ id: R }) => R === f.sampleId) ?? null, m = En(f), x = (m == null ? void 0 : m.join("|")) ?? "", S = Q.useMemo(
    () => x ? x.split("|").map((R) => e.find((P) => P.id === R) ?? null) : null,
    [e, x]
  ), C = g ? { ...r, ...g.tree } : r, w = f.kind !== "text" && t.templateSampleId && t.templateSampleId !== f.sampleId ? e.find(({ id: R }) => R === t.templateSampleId) ?? null : null, D = f.kind === "text" || !g ? { id: f.kind === "text" ? "" : f.populationId, missing: !1 } : _a(f.populationId, g.tree, h, w == null ? void 0 : w.tree.id), k = D.id, E = D.missing ? ((N = w == null ? void 0 : w.tree.populations[f.kind === "text" ? "" : f.populationId]) == null ? void 0 : N.name) ?? "the population" : null, M = f.kind === "text" ? null : u({ ...f, populationId: k }, void 0, t.unitId), I = ((R) => M ? Ma(R, M) : R)(l), v = JSON.stringify(f);
  return Q.useEffect(() => {
    const R = c.current;
    if (!R || f.kind === "text") return;
    R.dataset.layoutPending = "1";
    const P = () => {
      var J, ot, ft, bt;
      if (R.innerHTML = "", !g) {
        R.textContent = fu("The referenced file is unavailable or still loading."), R.className = "gl-layout-plot-host is-missing";
        return;
      }
      const B = C.populations[k];
      if (!(f.kind === "strategy" && !!((J = f.populationIds) != null && J.length)) && (E || !B)) {
        R.textContent = E ? `${g.name} has no population corresponding to ${E}.` : "The referenced population is unavailable.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      R.className = "gl-layout-plot-host";
      const V = Math.max(120, t.width - 8), G = Math.max(120, t.height - 8);
      if (f.kind === "strategy" && ((ot = f.populationIds) != null && ot.length)) {
        const pt = g.tree, H = pt.root_population_id ?? "", ut = f.populationIds.map((Ut) => _a(Ut, pt, h, w == null ? void 0 : w.tree.id)).filter((Ut) => !Ut.missing).map((Ut) => Ut.id), Dt = xd(g.sample, pt.gates, pt.populations, H, g.derived.masks, ut, { maxEvents: o.maxEvents, globalScales: n }), vt = Math.max(1, f.columns ?? 4), gt = f.layout === "flow" ? yd(Dt, vt, pt.populations) : bd(Dt, pt.populations);
        if (!gt.length) {
          R.textContent = `${g.name} has none of the strategy's populations.`, R.className = "gl-layout-plot-host is-missing";
          return;
        }
        const mt = f.showArrows !== !1, wt = mt ? Sd(gt, pt.populations) : [], Mt = mt ? Cd(wt) : 8, St = mt ? wd(wt) : 8, dt = Math.max(120, Math.min(800, f.plotSize ?? 200));
        R.removeAttribute("id");
        const Tt = document.createElement("div");
        Tt.id = `layout-strategy-${t.id}`, Tt.style.width = "max-content", R.appendChild(Tt);
        const Xt = (Ut) => {
          const Ce = Rd(gt, {
            displayMode: f.displayMode,
            plotSize: dt,
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
            gridGap: Mt,
            gridRowGap: St,
            canvasScale: s * Ut,
            fontSizes: ba(o),
            contextTitle: I
          });
          bi().renderMultiStrategyGrid(Tt.id, Ce);
        };
        Xt(1), mt && Ed(Tt);
        const Ht = Tt.scrollWidth, zt = Tt.scrollHeight, At = Ht > 0 && zt > 0 ? Math.max(0.1, Math.min(4, V / Ht, G / zt)) : 1;
        Math.abs(At - 1) > 0.01 && (Tt.style.zoom = String(At), Xt(At)), Dd(Tt, wt, { color: f.arrowColor ?? (o.pubStyle ? "#444444" : null), width: f.arrowWidth ?? 1.5, anchor: f.arrowAnchor ?? "label" });
        return;
      }
      if (f.kind === "strategy") {
        const pt = kd(
          g.sample,
          C.gates,
          C.populations,
          C.root_population_id ?? "",
          k,
          { fullPath: f.fullPath, maxEvents: o.maxEvents }
        ), H = 8, ut = 26, Dt = Math.max(1, pt.length);
        let vt = 1, gt = 0;
        for (let wt = 1; wt <= Dt; wt++) {
          const Mt = Math.ceil(Dt / wt), St = Math.floor((V - H * (wt - 1)) / wt), dt = Math.floor((G - ut - H * (Mt - 1)) / Mt), Tt = Math.min(St, dt);
          Tt > gt && (gt = Tt, vt = wt);
        }
        gt = Math.max(100, Math.min(800, gt));
        const mt = Md(
          g.sample,
          pt,
          null,
          n,
          {
            gateView: ["forward"],
            displayMode: f.displayMode,
            maxEvents: o.maxEvents,
            nColumns: vt,
            plotSize: gt,
            fitToColumns: !1,
            contourThreshold: o.contourThreshold,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateLabelFormat: o.gateLabels,
            fontSizes: ba(o),
            contextTitle: I
          }
        );
        R.id = `layout-strategy-${t.id}`;
        for (const wt of Object.values(mt.plots ?? {})) wt.canvas_scale = s;
        bi().renderStrategyGrid(R.id, mt);
        return;
      }
      const K = Math.max(120, Math.min(V, G)), U = f.kind === "histogram" ? null : f.yChannel, L = {
        displayMode: f.displayMode,
        maxEvents: o.maxEvents,
        nColumns: 1,
        plotSize: K,
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
        fontSizes: ba(o),
        scaleFontsWithPlot: !0,
        // A population with no events is drawn as its axes and gates, as the Illustration tab
        // draws it, rather than replaced by a message.
        includeEmpty: !0
      }, rt = (pt, H) => bi().renderMiniPlot(R, {
        ...pt,
        display_mode: f.displayMode,
        plot_size: K,
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
        title: I,
        contour_levels: o.contourLevels,
        font_sizes: ba(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: "#334155",
        gates: H
      });
      if (S) {
        const { members: pt } = Ea(f, e, h, w == null ? void 0 : w.tree.id), H = pt.length ? _d(pt, f.xChannel, U, n, L, h) : null;
        if (!H) {
          R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
          return;
        }
        rt(H.config, H.gates);
        return;
      }
      const nt = Td(
        g.sample,
        C.gates,
        // Only the plot's branch, as the Illustration and Gating tabs draw it: the gates drawn on
        // this population and its descendants, not every gate sharing these channels.
        Id(C.populations, C.gates, C.gate_order, k),
        C.populations,
        g.derived.masks,
        g.derived.stats.event_count,
        [k],
        [f.xChannel],
        U,
        n,
        L,
        g.derived.gateMasks
      ), tt = `${k}|${f.xChannel}`, at = (ft = nt.plots) == null ? void 0 : ft[tt];
      if (!at) {
        R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      rt(at, ((bt = nt.gate_overlays) == null ? void 0 : bt[tt]) ?? []);
    }, A = window.setTimeout(() => {
      try {
        P();
      } finally {
        delete R.dataset.layoutPending;
      }
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
    v,
    g,
    C.gate_order,
    C.gate_version,
    C.gates,
    C.stored_hierarchies,
    C.populations,
    C.root_population_id,
    k,
    E,
    s,
    I,
    S,
    h
  ]), f.kind === "text" ? /* @__PURE__ */ b.jsx(
    "div",
    {
      className: "gl-layout-text-surface",
      style: { fontSize: f.fontSize, fontWeight: f.bold ? 700 : 400 },
      children: f.text
    }
  ) : /* @__PURE__ */ b.jsx("div", { ref: c, className: "gl-layout-plot-host" });
}
function Mm({
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
  sources: g,
  divisionProfiles: m,
  imageService: x,
  canvasScale: S,
  onTextChange: C,
  onTextFocus: w,
  textEditing: D,
  onTextEditStart: k,
  onTextEditEnd: E,
  onIsolate: M
}) {
  var N;
  const { t: _ } = _r(), I = du(t), v = I === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / I)), height: Math.max(1, Math.round(t.height / I)) };
  return /* @__PURE__ */ b.jsx(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": I === 1 ? void 0 : I,
      title: `${t.locked ? `${_("Locked")} · ` : ""}${Ue(t, n)}`,
      "data-title": Ue(t, n),
      onDoubleClick: M ? (R) => {
        R.stopPropagation(), M();
      } : void 0,
      className: `gl-layout-item${r ? " is-selected" : ""}${t.showFrame ? " has-frame" : ""}${t.recipe.kind === "text" ? " is-text" : ""}${t.locked ? " is-locked" : ""}`,
      style: {
        left: t.x,
        top: t.y,
        width: t.width,
        height: t.height,
        zIndex: t.z
      },
      children: /* @__PURE__ */ b.jsx("div", { className: "gl-layout-item-body", style: I === 1 ? void 0 : { zoom: I, width: v.width, height: v.height }, children: t.recipe.kind === "text" ? /* @__PURE__ */ b.jsx(
        Tm,
        {
          text: t.recipe.text,
          templateText: e ?? t.recipe.text,
          fontSize: t.recipe.fontSize,
          bold: t.recipe.bold,
          editing: D,
          onEditStart: k,
          onEditEnd: E,
          onCommit: C,
          onFocus: w
        }
      ) : t.recipe.kind === "figure" ? /* @__PURE__ */ b.jsx(
        gd,
        {
          recipe: t.recipe,
          files: h,
          sources: g,
          state: a,
          globalScales: i,
          width: Math.max(120, v.width - 8),
          height: Math.max(80, v.height - 8)
        }
      ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ b.jsx(
        md,
        {
          recipe: t.recipe,
          samples: h,
          state: a,
          metadataById: d,
          divisionProfiles: m,
          width: Math.max(120, v.width - 8),
          height: Math.max(80, v.height - 8),
          containerId: `layout-proportions-${t.id}`
        }
      ) : t.recipe.kind === "cellpanel" ? /* @__PURE__ */ b.jsx(Q.Suspense, { fallback: /* @__PURE__ */ b.jsx("div", { className: "gl-layout-plot-host" }), children: /* @__PURE__ */ b.jsx(
        vm,
        {
          recipe: t.recipe,
          service: x ?? null,
          width: Math.max(120, v.width - 8),
          height: Math.max(80, v.height - 8)
        }
      ) }) : t.recipe.kind === "imagewall" ? /* @__PURE__ */ b.jsx(Q.Suspense, { fallback: /* @__PURE__ */ b.jsx("div", { className: "gl-layout-plot-host" }), children: /* @__PURE__ */ b.jsx(
        hm,
        {
          recipe: t.recipe,
          service: x ?? null,
          width: Math.max(120, v.width - 8),
          height: Math.max(80, v.height - 8)
        }
      ) }) : t.recipe.kind === "chart" ? /* @__PURE__ */ b.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ b.jsx(
        pm,
        {
          data: df(t.recipe, n, d, f, a),
          recipe: t.recipe,
          style: l,
          width: Math.max(120, v.width - 8),
          height: Math.max(80, v.height - 8),
          title: ((N = t.recipe.title) == null ? void 0 : N.trim()) || Ue(t, n)
        }
      ) }) : /* @__PURE__ */ b.jsx(
        km,
        {
          item: v,
          samples: n,
          state: a,
          globalScales: i,
          dataRevision: o,
          densityColorPower: s,
          style: l,
          canvasScale: S,
          titleTemplate: u,
          describe: c
        }
      ) })
    }
  );
}
const pf = [
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
], Da = ["fontTick", "fontAxis", "fontTitle", "fontGate"], _m = { fontTick: "Tick", fontAxis: "Axis", fontTitle: "Plot title", fontGate: "Gate label" };
function Bi({
  styles: t,
  showTitle: e = !0,
  texts: r = [],
  onChange: n,
  onTextChange: a
}) {
  const { t: i } = _r();
  if (!t.length && !r.length) return null;
  const o = (l) => l > 1 ? ` (${i("mixed")})` : "", s = [...new Set(r.map((l) => l.fontSize))];
  return /* @__PURE__ */ b.jsxs("fieldset", { className: "gl-layout-font-fields", children: [
    /* @__PURE__ */ b.jsx("legend", { children: i("Fonts (px)") }),
    t.length > 0 && pf.filter(({ key: l }) => Da.includes(l) && (e || l !== "fontTitle")).map(({ key: l, label: u, step: c }) => {
      const f = [...new Set(t.map((d) => d[l]))];
      return /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", title: f.length > 1 ? i("The selected plots differ: {values}", { values: f.join(", ") }) : void 0, children: [
        i(_m[l]),
        o(f.length),
        /* @__PURE__ */ b.jsx(
          fe,
          {
            "aria-label": i(u),
            value: f[0],
            min: Ta[l][0],
            max: Ta[l][1],
            step: c,
            onCommit: (d) => n({ [l]: d })
          }
        )
      ] }, l);
    }),
    r.length > 0 && a && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", title: s.length > 1 ? i("The selected text blocks differ: {values}", { values: s.join(", ") }) : void 0, children: [
        i("Text box"),
        o(s.length),
        /* @__PURE__ */ b.jsx(fe, { "aria-label": i("Text font"), min: 8, max: 72, integer: !0, value: s[0], onCommit: (l) => a({ fontSize: l }) })
      ] }),
      /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
        /* @__PURE__ */ b.jsx("input", { type: "checkbox", checked: r.every((l) => l.bold), onChange: (l) => a({ bold: l.target.checked }) }),
        i("Bold")
      ] })
    ] })
  ] });
}
function Fi({
  effective: t,
  own: e,
  onChange: r,
  omit: n = []
}) {
  const { t: a } = _r();
  return /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-style-fields", children: [
    pf.filter(({ key: i }) => !n.includes(i)).map(({ key: i, label: o, step: s, integer: l }) => /* @__PURE__ */ b.jsxs(Q.Fragment, { children: [
      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline" + (i in e ? " is-own" : ""), children: [
        a(o),
        /* @__PURE__ */ b.jsx(
          fe,
          {
            "aria-label": a(o),
            value: i === "maxEvents" && t.maxEvents === 0 ? Zs.maxEvents : t[i],
            min: Ta[i][0],
            max: Ta[i][1],
            step: s,
            integer: l,
            disabled: i === "maxEvents" && t.maxEvents === 0,
            onCommit: (u) => r({ [i]: u })
          }
        )
      ] }),
      i === "maxEvents" && // An event cap of 0 is every event, as on the Gating tab: a pooled plot of a whole SCE
      // can then be drawn as the Gating tab's pooled view draws it.
      /* @__PURE__ */ b.jsxs("label", { className: "gl-check" + ("maxEvents" in e ? " is-own" : ""), title: a("Draw every event of the plot's files rather than a sample of them; a plot of a million points repaints slowly. Counts and percentages always use every event."), children: [
        /* @__PURE__ */ b.jsx(
          "input",
          {
            type: "checkbox",
            checked: t.maxEvents === 0,
            onChange: (u) => r({ maxEvents: u.target.checked ? 0 : Zs.maxEvents })
          }
        ),
        a("All events")
      ] })
    ] }, i)),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline" + ("gateLabels" in e ? " is-own" : ""), children: [
      a("Gate labels"),
      /* @__PURE__ */ b.jsxs(
        "select",
        {
          "aria-label": a("Gate labels"),
          value: t.gateLabels,
          onChange: (i) => r({ gateLabels: i.target.value }),
          children: [
            /* @__PURE__ */ b.jsx("option", { value: "name-percent", children: a("Name and percentage") }),
            /* @__PURE__ */ b.jsx("option", { value: "percent", children: a("Percentage") }),
            /* @__PURE__ */ b.jsx("option", { value: "number", children: a("Number only") }),
            /* @__PURE__ */ b.jsx("option", { value: "name", children: a("Name only") }),
            /* @__PURE__ */ b.jsx("option", { value: "none", children: a("None") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-check" + ("pubStyle" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ b.jsx(
        "input",
        {
          type: "checkbox",
          checked: t.pubStyle,
          onChange: (i) => r({ pubStyle: i.target.checked })
        }
      ),
      a("Publication style (black gates and labels)")
    ] }),
    /* @__PURE__ */ b.jsxs("label", { className: "gl-check" + ("histFill" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ b.jsx(
        "input",
        {
          type: "checkbox",
          checked: t.histFill,
          onChange: (i) => r({ histFill: i.target.checked })
        }
      ),
      a("Fill histograms")
    ] })
  ] });
}
function Tm({
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
  const { t: u } = _r(), [c, f] = Q.useState(e), d = Q.useRef(null);
  Q.useEffect(() => {
    if (!a) return;
    f(e);
    const g = d.current;
    g && (g.focus({ preventScroll: !0 }), g.setSelectionRange(g.value.length, g.value.length));
  }, [a]);
  const h = { fontSize: r, fontWeight: n ? 700 : 400 };
  return a ? /* @__PURE__ */ b.jsx(
    "textarea",
    {
      ref: d,
      className: "gl-layout-text-surface",
      "aria-label": "Layout text",
      value: c,
      style: h,
      onChange: (g) => f(g.target.value),
      onFocus: l,
      onBlur: (g) => {
        c !== e && s(c, g.currentTarget.scrollHeight), o();
      },
      onKeyDown: (g) => {
        g.stopPropagation(), g.key === "Escape" && g.currentTarget.blur();
      }
    }
  ) : /* @__PURE__ */ b.jsx(
    "div",
    {
      className: "gl-layout-text-surface is-static",
      style: h,
      title: u("Double-click to edit"),
      onDoubleClick: (g) => {
        g.stopPropagation(), i();
      },
      children: t
    }
  );
}
function Rm({
  workspace: t,
  onChange: e,
  takeUndoSeed: r,
  samples: n,
  checkedSampleIds: a = [],
  groups: i = [],
  fileGroups: o = {},
  metadataColumns: s = [],
  metadataLevels: l,
  populationMetadata: u,
  activeSampleId: c,
  activePopulationId: f,
  state: d,
  globalScales: h,
  defaultX: g,
  defaultY: m,
  illustrationConfig: x,
  onOpenInIllustration: S,
  plottingSettings: C,
  divisionProfiles: w = xm,
  imageService: D = null,
  onOpenInPlotting: k,
  dataRevision: E,
  densityColorPower: M,
  onOpenInGating: _,
  onExported: I
}) {
  var Ps, Os, js, Ns, zs, As;
  const { t: v } = _r(), N = Hf("layout"), [R, P] = Q.useState([]), [A, B] = Q.useState(null), [X, V] = Q.useState(!0), [G, K] = Q.useState(null), [U, L] = Q.useState(null), [rt, nt] = Q.useState([]), [tt, at] = Q.useState([]), J = Q.useRef(null), ot = Q.useRef(null), [ft, bt] = Q.useState(null), [pt, H] = Q.useState(null), [ut, Dt] = Q.useState(
    c ?? ((Ps = n[0]) == null ? void 0 : Ps.id) ?? ""
  ), [vt, gt] = Q.useState("item"), [mt, wt] = Q.useState(!1), [Mt, St] = Q.useState({ shift: !1, meta: !1 });
  Q.useEffect(() => {
    const p = (T) => St((z) => {
      const F = { shift: T.shiftKey, meta: T.metaKey || T.ctrlKey };
      return F.shift === z.shift && F.meta === z.meta ? z : F;
    }), y = () => St((T) => T.shift || T.meta ? { shift: !1, meta: !1 } : T);
    return window.addEventListener("keydown", p), window.addEventListener("keyup", p), window.addEventListener("blur", y), () => {
      window.removeEventListener("keydown", p), window.removeEventListener("keyup", p), window.removeEventListener("blur", y);
    };
  }, []);
  const [dt, Tt] = Q.useState(1), Xt = Q.useRef(dt);
  Xt.current = dt;
  const [Ht, zt] = Q.useState(dt);
  Q.useEffect(() => {
    const p = window.setTimeout(() => zt(dt), 250);
    return () => window.clearTimeout(p);
  }, [dt]);
  const At = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * Ht)), [Ut, Ce] = Q.useState("pdf"), [pr, Bn] = Q.useState(!1), [Fn, Rr] = Q.useState(3), [$e, Gn] = Q.useState(!1), hr = Q.useRef(null), Qe = Q.useRef(null), tr = (p) => {
    var y;
    P(p), (y = hr.current) == null || y.focus({ preventScroll: !0 });
  }, ei = (p) => tr(p ? [p] : []), Re = $f(
    n,
    n.map((p) => p.id),
    d,
    E
  ), _t = Q.useMemo(
    () => Re.current ? Re.sources.map((p) => ({ ...p, derived: p.gating })) : [],
    [Re.current, Re.sources]
  ), It = Q.useMemo(
    () => Object.fromEntries(n.map((p) => [p.id, p.metadata])),
    [n]
  ), Bt = Q.useMemo(() => Br(d), [d]), Zt = n.length === 0 || Re.current && Re.pending === 0, Pe = Q.useRef([]), er = Q.useRef([]), [, nn] = Q.useState(0);
  Q.useEffect(() => {
    const p = r == null ? void 0 : r();
    p && (Pe.current = [p, ...Pe.current].slice(0, 30), er.current = [], nn((y) => y + 1));
  }, [t, r]);
  const $ = t.sheets.find(({ id: p }) => p === t.activeSheetId) ?? t.sheets[0], lt = ($ == null ? void 0 : $.iteration) ?? uu, oe = Q.useMemo(() => {
    const p = $ == null ? void 0 : $.items.find((T) => Lt(T.recipe) && T.recipe.iterated === !0), y = p && "sampleId" in p.recipe ? p.recipe.sampleId : c;
    return _t.find(({ id: T }) => T === y) ?? _t[0] ?? null;
  }, [$, _t, c]), we = Q.useMemo(
    () => {
      var p;
      return lt.mode === "populations" ? oe ? Ug(lt, oe.tree, {
        ...n.find(({ id: y }) => y === oe.id) ?? oe,
        groupName: (p = i.find((y) => y.id === o[oe.id])) == null ? void 0 : p.name
      }) : [] : lt.mode === "metadata" ? Kg(lt, n, a, i, o, l == null ? void 0 : l[lt.column ?? ""]) : Vg(lt, n, a, i, o);
    },
    [lt, n, a, i, o, oe, l]
  ), Pr = Q.useCallback((p, y, T) => {
    var Ot, xe, Le;
    const z = n.find(({ id: Wt }) => Wt === p.sampleId) ?? null, F = _t.find(({ id: Wt }) => Wt === p.sampleId) ?? null;
    let Y = p.populationId;
    if (F) {
      const Wt = y && y !== p.sampleId ? (Ot = _t.find(({ id: We }) => We === y)) == null ? void 0 : Ot.tree.id : void 0, ta = _a(p.populationId, F.tree, Bt, Wt);
      ta.missing || (Y = ta.id);
    }
    const W = F == null ? void 0 : F.tree.populations[Y], it = En(p);
    if (it && p.kind !== "strategy") {
      const { members: Wt } = Ea(p, _t, Bt, y ? (xe = _t.find(({ id: gr }) => gr === y)) == null ? void 0 : xe.tree.id : void 0), ta = Wt.reduce((gr, Bs) => gr + (Bs.gating.stats.event_count[Bs.populationId] ?? 0), 0), We = T ? we.find((gr) => gr.id === T) : void 0;
      return $s(
        p,
        { name: We != null && We.sampleIds ? We.name : `${it.length} files`, fileName: `${it.length} files`, metadata: We != null && We.sampleIds ? We.metadata : of(it.map((gr) => It[gr])) },
        W ? { id: Y, name: W.name } : null,
        Wt.length ? ta : void 0,
        u
      );
    }
    const yt = F == null ? void 0 : F.derived.stats.event_count[Y], st = z ? (Le = i.find((Wt) => Wt.id === o[z.id])) == null ? void 0 : Le.name : void 0;
    return $s(
      p.kind === "strategy" ? {} : p,
      z ? { name: z.name, fileName: z.fileName ?? z.name, groupName: st, metadata: z.metadata } : null,
      W ? { id: Y, name: W.name } : null,
      typeof yt == "number" ? yt : void 0,
      u
    );
  }, [n, _t, d, u, Bt, It, we, i, o]), le = Q.useMemo(
    () => $ ? $g($, we, Pr) : [],
    [$, we, Pr]
  ), [ri, Or] = Q.useState(0), [is, hf] = Q.useState(!1), [vf, gf] = Q.useState(" · "), os = Q.useMemo(
    () => [...new Set(Object.values(u ?? {}).flatMap((p) => Object.keys(p)))].sort(),
    [u]
  ), ss = Q.useMemo(() => qf(s, os), [s, os]), Fe = Math.min(ri, Math.max(0, le.length - 1)), $t = le[Fe] ?? mm, ni = ((Os = $ == null ? void 0 : $.titleTemplate) == null ? void 0 : Os.trim()) || Vf(
    le.flatMap((p) => p.items).flatMap((p) => {
      var y;
      return Lt(p.recipe) ? [{ sampleId: ((y = En(p.recipe)) == null ? void 0 : y.join(",")) ?? p.recipe.sampleId, populationId: p.recipe.populationId, label: p.recipe.kind === "strategy" ? void 0 : p.recipe.label }] : [];
    }),
    lt.mode === "metadata" ? { metadataColumn: lt.column } : void 0
  ), ai = (p) => {
    var y;
    return Lt(p.recipe) && (((y = p.recipe.title) == null ? void 0 : y.trim()) || ni).trim() !== cu;
  };
  Q.useEffect(() => {
    ri !== Fe && Or(Fe);
  }, [ri, Fe]);
  const an = (p) => p.split("::")[0], Jt = [...new Set(R.map(an))], ue = ($ == null ? void 0 : $.items.filter(({ id: p }) => Jt.includes(p))) ?? [], Z = ue.length === 1 ? ue[0] : null, qe = ue.filter((p) => Lt(p.recipe)), ls = (p) => Pt((y) => {
    y.style = yi({ ...y.style, ...p });
    for (const T of y.items) {
      if (!Lt(T.recipe) || !T.recipe.style) continue;
      const z = { ...T.recipe.style };
      for (const W of Object.keys(p)) delete z[W];
      const { style: F, ...Y } = T.recipe;
      T.recipe = Object.keys(z).length ? { ...Y, style: z } : Y;
    }
  }), us = ue.flatMap((p) => p.recipe.kind === "text" ? [{ fontSize: p.recipe.fontSize, bold: p.recipe.bold === !0 }] : []), cs = (p) => Pt((y) => {
    for (const T of y.items) {
      if (!Jt.includes(T.id) || T.recipe.kind !== "text") continue;
      const z = { ...T.recipe, ...p.fontSize !== void 0 ? { fontSize: p.fontSize } : {} };
      p.bold === !0 ? z.bold = !0 : p.bold === !1 && delete z.bold, T.recipe = z;
    }
  }), ii = (p) => Pt((y) => {
    for (const T of y.items)
      !Jt.includes(T.id) || !Lt(T.recipe) || (T.recipe = { ...T.recipe, style: yi({ ...T.recipe.style, ...p }) });
  }), Qt = Z ? $t.items.find((p) => p.templateId === Z.id) ?? null : null, Ln = (Z == null ? void 0 : Z.recipe.kind) === "chart" ? Z.recipe : null, Ee = Q.useMemo(() => {
    if (!Ln) return null;
    const { missing: p, noChannel: y, groups: T } = df(Ln, _t, It, a, d), z = !!Ln.groupBy && T.some((F) => F.label === Xa);
    return p.length || y.length || z ? { missing: p, noChannel: y, unassigned: z } : null;
  }, [Ln, _t, It, a, d]), fs = (p) => p.split("::")[1] ?? "", Wn = (p) => {
    var y;
    return (y = $t.items.find((T) => T.id === p)) == null ? void 0 : y.group;
  }, ds = (p) => {
    const y = new Set(p.map(Wn).filter((F) => !!F));
    if (!y.size) return [...p];
    const T = new Set(p.map(fs)), z = new Set(p);
    for (const F of $t.items) F.group && y.has(F.group) && T.has(fs(F.id)) && z.add(F.id);
    return [...z];
  }, on = Kf(ue).length, mf = ue.length > 1 && ue.every((p) => p.group && p.group === ue[0].group), ps = (p, y) => {
    var F;
    if (!Lt(p.recipe)) return "";
    const T = ((F = p.recipe.title) == null ? void 0 : F.trim()) ?? "";
    if (!T) return "";
    const z = Pr(p.recipe, y);
    return z && wm(T, z.population, [z.file, z.sample]) ? "" : T;
  }, xf = Qt && Lt(Qt.recipe) ? Ma(ni, Pr(Qt.recipe, Qt.templateSampleId, Qt.unitId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", oi = ue.some((p) => p.locked), Yn = new Set((($ == null ? void 0 : $.items) ?? []).filter((p) => p.locked).map((p) => p.id)), Ve = rt.filter((p) => !Yn.has(an(p.dataset.itemId ?? "")) && p.dataset.itemId !== A), sn = Ve.length > 1 && Ve.every((p) => !Wn(p.dataset.itemId ?? "")), hs = Q.useRef(Ve);
  hs.current = Ve;
  const Xn = Q.useRef(!1);
  Q.useEffect(() => {
    R.length && R.some((p) => !$t.items.some((y) => y.id === p)) && P((p) => p.filter((y) => $t.items.some((T) => T.id === y)));
  }, [$t, R]), Q.useLayoutEffect(() => {
    var p;
    (p = J.current) == null || p.updateRect();
  }, [$t, dt, Ht]), Q.useLayoutEffect(() => {
    var F;
    if (!G) return;
    const p = [...G.querySelectorAll("[data-item-id]")], y = (Y, W) => Y.length === W.length && Y.every((it, yt) => it === W[yt]), T = p.filter((Y) => R.includes(Y.dataset.itemId ?? "")), z = p.filter((Y) => !R.includes(Y.dataset.itemId ?? ""));
    nt((Y) => y(Y, T) ? Y : T), at((Y) => y(Y, z) ? Y : z), (F = ot.current) == null || F.setSelectedTargets(T);
  }, [G, R, $t, $ == null ? void 0 : $.id]), Q.useEffect(() => {
    Ms();
  }, [$ == null ? void 0 : $.id]);
  const si = (p, y = !0) => {
    y && (Pe.current = [
      ra(t),
      ...Pe.current
    ].slice(0, 30), er.current = []), e(p);
  }, jr = (p) => {
    const y = ra(t);
    p(y), si(y);
  }, Pt = (p) => {
    jr((y) => {
      const T = y.sheets.find(({ id: z }) => z === y.activeSheetId);
      T && p(T);
    });
  }, li = Q.useRef(null), [yf, ui] = Q.useState(null), Nr = (p, y) => {
    let T = "";
    const z = li.current;
    li.current = null, Pt((F) => {
      T = crypto.randomUUID();
      const Y = el(F, y == null ? void 0 : y.width, y == null ? void 0 : y.height);
      z && (Y.x = Math.max(0, Math.round(z.x)), Y.y = Math.max(0, Math.round(z.y))), F.items.push({
        id: T,
        ...Y,
        recipe: p
      });
    }), ei(T), If(T);
  }, se = _t.find(({ id: p }) => p === ut) ?? _t[0] ?? null, ci = se && f ? dn(
    {
      hierarchyId: d.active_hierarchy_id,
      populationId: f
    },
    se.tree,
    Br(d)
  ) : null, rr = (ci == null ? void 0 : ci.id) ?? (se == null ? void 0 : se.tree.root_population_id) ?? "", Hn = (p) => {
    var y, T, z;
    if (!se || !rr) {
      H(v("Check an FCS file and select a population first."));
      return;
    }
    Nr({
      kind: p,
      sampleId: se.id,
      populationId: rr,
      ...lt.mode !== "off" ? { iterated: !0 } : {},
      xChannel: se.sample.index(g) !== void 0 ? g : ((y = se.sample.channels[0]) == null ? void 0 : y.key) ?? "",
      yChannel: p === "histogram" ? null : se.sample.index(m) !== void 0 ? m : ((T = se.sample.channels[1]) == null ? void 0 : T.key) ?? ((z = se.sample.channels[0]) == null ? void 0 : z.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, vs = () => {
    if (!se || !rr) {
      H(v("Check an FCS file and select a population first."));
      return;
    }
    Nr(
      {
        kind: "chart",
        sampleId: se.id,
        populationId: rr,
        statistic: "percent_of_parent",
        files: "checked",
        groupBy: s[0] ?? "",
        chartType: "bars",
        showPoints: !0,
        test: !0
      },
      { width: 320, height: 240 }
    );
  }, gs = () => Nr({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), bf = (p, y) => {
    Pt((T) => {
      const z = T.items.find((F) => F.id === p);
      z && (z.recipe = y(z.recipe));
    });
  }, Sf = (p) => {
    p.preventDefault();
    const y = p.target.closest("[data-item-id]");
    if (y != null && y.dataset.itemId) {
      const Y = y.dataset.itemId, W = $ == null ? void 0 : $.items.find(({ id: Wt }) => Wt === an(Y));
      if (!W) return;
      const it = R.includes(Y);
      it || tr(ds([Y]));
      const yt = W.group ? (($ == null ? void 0 : $.items) ?? []).filter((Wt) => Wt.group === W.group).map(({ id: Wt }) => Wt) : [W.id], st = it && Jt.length > 1 ? Jt : yt, Ot = st.length > 1, xe = Lt(W.recipe), Le = [
        { label: Ot ? v("Duplicate {n} items", { n: st.length }) : v("Duplicate"), onClick: () => un(st) },
        { label: v("Bring to front"), onClick: () => Ke(st, "front") },
        { label: v("Bring forward"), onClick: () => Ke(st, "forward") },
        { label: v("Send backward"), onClick: () => Ke(st, "backward") },
        { label: v("Send to back"), onClick: () => Ke(st, "back") },
        { label: W.locked ? v("Unlock") : v("Lock"), onClick: () => qn(st, !W.locked) },
        ...it && on > 1 ? [{ label: v("Group"), onClick: $n }] : [],
        ...W.group ? [{ label: v("Ungroup"), onClick: () => Pt((Wt) => tl(Wt, st)) }] : [],
        "separator",
        ...lt.mode !== "off" && xe ? [
          {
            label: "iterated" in W.recipe && W.recipe.iterated ? v("Stop following the iteration") : v("Follow the iteration"),
            onClick: () => bf(W.id, (Wt) => Lt(Wt) ? { ...Wt, iterated: !Wt.iterated } : Wt)
          },
          "separator"
        ] : [],
        ...xe ? [{ label: v("Open in Gating"), onClick: () => _(W.recipe) }] : [],
        ...W.recipe.kind === "figure" && S ? [{ label: v("Edit in Illustration"), onClick: () => S(structuredClone(W.recipe.illustration)) }] : [],
        ...W.recipe.kind === "proportions" && k ? [{ label: v("Edit in Plotting"), onClick: () => k(structuredClone(W.recipe.settings)) }] : [],
        { label: Ot ? v("Remove {n} items", { n: st.length }) : v("Remove"), onClick: () => ln(st) }
      ];
      ui({ x: p.clientX, y: p.clientY, items: Le, label: Ue(W, _t) });
      return;
    }
    const T = p.currentTarget.getBoundingClientRect(), z = { x: (p.clientX - T.left) / dt, y: (p.clientY - T.top) / dt }, F = (Y) => () => {
      li.current = z, Y();
    };
    ui({
      x: p.clientX,
      y: p.clientY,
      label: v("Page"),
      items: [
        { label: v("+ Biplot"), disabled: !Zt, onClick: F(() => Hn("biplot")) },
        { label: v("+ Histogram"), disabled: !Zt, onClick: F(() => Hn("histogram")) },
        { label: v("+ Gating strategy"), disabled: !Zt, onClick: F(ys) },
        { label: v("+ Chart"), disabled: !Zt, onClick: F(vs) },
        { label: v("+ Text"), onClick: F(gs) },
        { label: v("+ Illustration figure"), disabled: !Zt || !(x != null && x.figure), onClick: F(ms) },
        { label: v("+ Plotting chart"), disabled: !Zt || !C, onClick: F(xs) },
        "separator",
        // With a selection on the page, the menu on blank paper offers what the selection's own menu does for grouping, as Illustrator's does.
        ...on > 1 ? [{ label: v("Group"), onClick: $n }] : [],
        ...ue.some((Y) => Y.group) ? [{ label: v("Ungroup"), onClick: di }] : [],
        { label: v("Select all"), disabled: !$t.items.length, onClick: () => tr($t.items.filter((Y) => !Yn.has(Y.templateId)).map(({ id: Y }) => Y)) }
      ]
    });
  }, ms = () => {
    if (!(x != null && x.figure)) {
      H(v("Make a figure on the Illustration tab first."));
      return;
    }
    $ && Nr({ kind: "figure", illustration: structuredClone(x), page: 0 }, od(x, n, d, $));
  }, xs = () => {
    if (!C || !$) return;
    const p = C(), y = sd(p, ld(n), d, It, w);
    if (!y.catLevels.length || !y.perSample.length) {
      H(v("Choose files and populations on the Plotting tab first."));
      return;
    }
    Nr({ kind: "proportions", settings: p }, ud(p, y, $));
  }, ys = () => {
    var T;
    if (!se || !rr) {
      H(v("Check an FCS file and select a population first."));
      return;
    }
    const p = se.tree.root_population_id ?? "", y = rr !== p ? rr : ((T = Sa(se.tree.populations, p).filter(({ popId: z }) => z !== p).at(-1)) == null ? void 0 : T.popId) ?? rr;
    Nr(
      {
        kind: "strategy",
        sampleId: se.id,
        populationId: y,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...lt.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, Cf = () => {
    var F, Y;
    if (!x) {
      H(v("Render or configure an Illustration selection first."));
      return;
    }
    if (!x.figure && x.plotType === "heatmap") {
      H(
        v("Heatmap layout blocks are planned for the next Layout phase.")
      );
      return;
    }
    const p = new Map(_t.map((W) => [W.id, W])), y = [], T = x.figure;
    for (const W of _t) {
      if (T) {
        if (!T.sampleIds.includes(W.id)) continue;
        for (const yt of T.plots)
          if (yt.type !== "heatmap")
            for (const st of yt.population ? [yt.population] : ((F = T.samplePopulations) == null ? void 0 : F[W.id]) ?? T.populations) {
              const Ot = dn(
                st,
                W.tree,
                Br(d)
              );
              Ot.id && Ot.status !== "changed" && y.push({
                sampleId: W.id,
                populationId: Ot.id,
                xChannel: yt.x,
                yChannel: yt.y,
                type: yt.type
              });
            }
        continue;
      }
      const it = x.selectionMode === "matrix" ? ((Y = x.selectedPopulationsBySample) == null ? void 0 : Y[W.id]) ?? [] : x.popIds;
      for (const yt of it)
        for (const st of x.xChannels)
          y.push({ sampleId: W.id, populationId: yt, xChannel: st });
    }
    const z = y.slice(0, 60);
    if (z.length === 0) {
      H(
        v("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    Pt((W) => {
      const it = [];
      for (const yt of z) {
        if (!p.get(yt.sampleId)) continue;
        const Ot = yt.type ?? (x.plotType === "histogram" ? "histogram" : "biplot");
        it.push({
          kind: Ot,
          sampleId: yt.sampleId,
          populationId: yt.populationId,
          xChannel: yt.xChannel,
          yChannel: Ot === "histogram" ? null : yt.yChannel ?? x.yChannel,
          displayMode: x.displayMode === "dots" ? "scatter" : x.displayMode
        });
      }
      for (const yt of Pd(W, it))
        W.items.push({
          id: crypto.randomUUID(),
          ...el(W),
          recipe: yt
        });
    }), H(
      y.length > z.length ? v(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: z.length
        }
      ) : v("Added {count} Illustration plots.", { count: z.length })
    );
  }, kt = (p) => {
    Z && Pt((y) => {
      const T = y.items.find(({ id: F }) => F === Z.id);
      if (!T) return;
      const z = T.recipe;
      if (T.recipe = p(T.recipe), z.kind === "cellpanel" && T.recipe.kind === "cellpanel") {
        const F = Js(z), Y = Js(T.recipe), W = Math.max(0.1, Math.min(T.width / Math.max(1, F.width), T.height / Math.max(1, F.height)));
        T.width = Math.max(40, Math.round(Y.width * W)), T.height = Math.max(30, Math.round(Y.height * W));
      }
    });
  }, fi = (p) => kt((y) => {
    if (y.kind !== "biplot" && y.kind !== "histogram") return y;
    const T = p ? n.filter((Y) => p.includes(Y.id)).map((Y) => Y.id) : [];
    if (!T.length) {
      const { pool: Y, ...W } = y;
      return W;
    }
    const z = T.includes(y.sampleId) ? y.sampleId : T[0];
    let F = y.populationId;
    if (z !== y.sampleId) {
      const Y = _t.find(({ id: it }) => it === y.sampleId), W = _t.find(({ id: it }) => it === z);
      Y && W && (F = dn({ hierarchyId: Y.tree.id, populationId: F }, W.tree, Bt).id ?? W.tree.root_population_id ?? F);
    }
    return { ...y, sampleId: z, populationId: F, pool: { sampleIds: T } };
  }), wf = Q.useMemo(() => {
    var Y;
    const p = Z == null ? void 0 : Z.recipe;
    if (!p || !Lt(p) || p.kind === "strategy" || !p.pool) return null;
    const y = Qt != null && Qt.templateSampleId ? (Y = _t.find(({ id: W }) => W === Qt.templateSampleId)) == null ? void 0 : Y.tree.id : void 0, { members: T, leftOut: z } = Ea(p, _t, Bt, y), F = p.kind === "biplot" && p.yChannel && T.length > 1 ? Uf(Bt, T.map((W) => W.tree.id), p.xChannel, p.yChannel).omitted.map((W) => W.name) : [];
    return { pooled: T.length, total: p.pool.sampleIds.length, leftOut: z, omittedGates: F };
  }, [Z, Qt, _t, Bt]), bs = Q.useMemo(() => {
    var W;
    const p = Qt == null ? void 0 : Qt.recipe;
    if (!p || !Lt(p) || !(Qt != null && Qt.unitId)) return null;
    const y = we.find((it) => it.id === Qt.unitId);
    if (!y) return null;
    if (y.populationId) return v("This page draws {name}; the population chosen here is the template's.", { name: y.name });
    if (!y.sampleIds) return v("This page draws {name}; the file chosen here is the template's.", { name: y.name });
    const T = (it) => {
      var yt;
      return ((yt = n.find((st) => st.id === it)) == null ? void 0 : yt.name) ?? it;
    };
    if (p.kind === "strategy") return v("This page is {value}: a strategy is drawn for one file, {file}, not pooled.", { value: y.name, file: T(p.sampleId) });
    if (!p.pool) return v("This page is {value}: {file} alone.", { value: y.name, file: T(p.sampleId) });
    const z = Qt.templateSampleId ? (W = _t.find(({ id: it }) => it === Qt.templateSampleId)) == null ? void 0 : W.tree.id : void 0, { members: F, leftOut: Y } = Ea(p, _t, Bt, z);
    return v("This page is {value}: {n} of {m} files pooled", { value: y.name, n: F.length, m: p.pool.sampleIds.length }) + (Y.length ? ` · ${v("Not pooled: {files}", { files: Y.map((it) => `${it.name} (${it.reason})`).join(", ") })}` : "");
  }, [Qt, we, n, _t, Bt, v]), ln = (p) => {
    Pt((y) => {
      y.items = y.items.filter((T) => !p.includes(T.id)), Od(y);
    }), P((y) => y.filter((T) => !p.includes(T)));
  }, un = (p, y) => {
    const T = [];
    return Pt((z) => {
      let F = Math.max(0, ...z.items.map((it) => it.z));
      const Y = p.flatMap((it) => z.items.filter((yt) => yt.id === it)), { copies: W } = qs(Y);
      W.forEach((it, yt) => {
        const st = Y[yt];
        T.push(it.id);
        const Ot = (y == null ? void 0 : y[st.id]) ?? { x: st.x + 20, y: st.y + 20, width: st.width, height: st.height };
        z.items.push({ ...it, ...Ot, locked: !1, z: ++F });
      });
    }), T.length && tr(T), T;
  }, Ef = (p, y, T) => {
    Pt((z) => {
      for (const F of z.items)
        !p.includes(F.id) || F.locked || (F.x += y, F.y += T);
    });
  }, Ke = (p, y) => {
    Pt((T) => {
      const z = [...T.items].sort((it, yt) => it.z - yt.z), F = z.filter((it) => p.includes(it.id)), Y = z.filter((it) => !p.includes(it.id));
      let W;
      if (y === "front") W = [...Y, ...F];
      else if (y === "back") W = [...F, ...Y];
      else {
        W = z;
        const it = W.map((yt, st) => st);
        y === "forward" && it.reverse();
        for (const yt of it) {
          const st = y === "forward" ? yt + 1 : yt - 1;
          !p.includes(W[yt].id) || st < 0 || st >= W.length || p.includes(W[st].id) || ([W[yt], W[st]] = [W[st], W[yt]]);
        }
      }
      W.forEach((it, yt) => {
        it.z = yt;
      });
    });
  }, $n = () => {
    on < 2 || Pt((p) => {
      jd(p, Jt);
    });
  }, di = () => {
    ue.some((p) => p.group) && Pt((p) => tl(p, Jt));
  }, qn = (p, y) => {
    Pt((T) => {
      for (const z of T.items) p.includes(z.id) && (z.locked = y);
    });
  }, Df = (p) => {
    Pt((y) => Nd(y, Jt.filter((T) => {
      var z;
      return !((z = y.items.find((F) => F.id === T)) != null && z.locked);
    }), p));
  }, kf = (p) => {
    Pt((y) => zd(y, Jt.filter((T) => {
      var z;
      return !((z = y.items.find((F) => F.id === T)) != null && z.locked);
    }), p));
  }, Vn = (p, y) => {
    const T = {};
    for (const F of p) {
      const Y = F.dataset.itemId, W = $t.items.find((st) => st.id === Y);
      if (!W) continue;
      const { id: it, ...yt } = Qg(W, Cm(F));
      T[it] = yt;
    }
    const z = Object.keys(T);
    if (z.length) {
      if (y) {
        for (const F of p) {
          const Y = $t.items.find((W) => W.id === F.dataset.itemId);
          Y && Object.assign(F.style, { left: `${Y.x}px`, top: `${Y.y}px`, width: `${Y.width}px`, height: `${Y.height}px` });
        }
        un(z, T);
        return;
      }
      Pt((F) => {
        for (const Y of F.items) {
          const W = T[Y.id];
          if (!W) continue;
          Object.assign(Y, W);
          const { zoom: it } = au(Y, W.width, W.height);
          it === void 0 ? delete Y.zoom : Y.zoom = it;
        }
      });
    }
  }, Ss = (p) => p.flatMap((y) => {
    if (!(y instanceof HTMLElement) || !y.parentElement) return [];
    const T = y.cloneNode(!0);
    T.classList.add("gl-layout-ghost"), T.classList.remove("is-selected"), T.removeAttribute("data-item-id"), T.setAttribute("aria-hidden", "true");
    const z = y.querySelectorAll("canvas");
    return T.querySelectorAll("canvas").forEach((F, Y) => {
      var it;
      const W = z[Y];
      W && (F.width = W.width, F.height = W.height, (it = F.getContext("2d")) == null || it.drawImage(W, 0, 0));
    }), y.parentElement.insertBefore(T, y), [T];
  }), Kn = (p) => {
    if (Array.isArray(p)) for (const y of p) y.remove();
  }, pi = (p) => {
    for (const y of p) {
      const T = $t.items.find((z) => z.id === y.dataset.itemId);
      T && Object.assign(y.style, { left: `${T.x}px`, top: `${T.y}px`, width: `${T.width}px`, height: `${T.height}px` });
    }
  }, Cs = Q.useRef(pi);
  Cs.current = pi;
  const nr = Q.useRef(null), Un = (p, y) => {
    const T = { targets: p, ghosts: y, cancelled: !1 };
    nr.current = T;
    const z = () => {
      window.removeEventListener("mouseup", z, !0), window.removeEventListener("touchend", z, !0), window.setTimeout(() => {
        nr.current === T && (nr.current = null, Kn(T.ghosts));
      }, 0);
    };
    window.addEventListener("mouseup", z, !0), window.addEventListener("touchend", z, !0);
  }, Zn = (p, y, T, z) => {
    const F = nr.current;
    nr.current = null, Kn(F == null ? void 0 : F.ghosts);
    const Y = y == null ? void 0 : y.dist, W = !Y || Math.hypot(Y[0] ?? 0, Y[1] ?? 0) >= 3;
    F != null && F.cancelled || !T || !W ? pi(p) : z();
  }, ws = (p) => {
    var F;
    p.target.style.left = `${p.left}px`, p.target.style.top = `${p.top}px`;
    const y = (F = p.datas) == null ? void 0 : F.companions;
    if (!(y != null && y.length)) return;
    const T = p.left - p.datas.startLeft, z = p.top - p.datas.startTop;
    for (const { el: Y, left: W, top: it } of y)
      Y.style.left = `${W + T}px`, Y.style.top = `${it + z}px`;
  }, Es = (p) => {
    var T;
    const y = (T = p.datas) == null ? void 0 : T.companions;
    return [p.target, ...(y ?? []).map(({ el: z }) => z)];
  }, Mf = (p) => {
    var F;
    p.datas.alt = !!((F = p.inputEvent) != null && F.altKey);
    const y = p.target, T = sn ? hs.current.filter((Y) => Y !== y) : [];
    p.datas.startLeft = parseFloat(y.style.left) || 0, p.datas.startTop = parseFloat(y.style.top) || 0, p.datas.companions = T.map((Y) => ({ el: Y, left: parseFloat(Y.style.left) || 0, top: parseFloat(Y.style.top) || 0 }));
    const z = Es(p);
    Un(z, p.datas.alt ? Ss(z) : void 0);
  }, Ds = (p) => {
    p.target.style.width = `${p.width}px`, p.target.style.height = `${p.height}px`, p.target.style.left = `${p.drag.left}px`, p.target.style.top = `${p.drag.top}px`;
    const y = p.target, T = $t.items.find((Y) => Y.id === y.dataset.itemId), z = y.querySelector(":scope > .gl-layout-item-body");
    if (!T || !z) return;
    const F = au(T, p.width, p.height).zoom ?? 1;
    Object.assign(z.style, F === 1 && !y.dataset.zoom ? { zoom: "", width: "", height: "" } : { zoom: String(F), width: `${Math.round(p.width / F)}px`, height: `${Math.round(p.height / F)}px` });
  }, _f = (p) => {
    var z;
    const y = (z = p.inputEvent) == null ? void 0 : z.target;
    if (!y) return;
    const T = J.current;
    if (T != null && T.isMoveableElement(y)) {
      p.stop();
      return;
    }
    if (Ve.some((F) => F === y || F.contains(y)) && (p.stop(), Ve.length > 1 && !sn)) {
      T == null || T.dragStart(p.inputEvent);
      const F = p.inputEvent, Y = (W) => {
        var it;
        window.removeEventListener("mouseup", Y), Math.hypot(W.clientX - F.clientX, W.clientY - F.clientY) < 4 && ((it = ot.current) == null || it.clickTarget(F, y));
      };
      window.addEventListener("mouseup", Y);
    }
  }, Tf = (p) => {
    var F, Y, W;
    const y = p.isClick || p.isDragStart, T = new Set((p.removed ?? []).map((it) => Wn(it.dataset.itemId ?? "")).filter(Boolean)), z = ds(
      p.selected.map((it) => it.dataset.itemId ?? "").filter((it) => it && (y || !Yn.has(an(it))))
    ).filter((it) => !T.has(Wn(it)));
    if (tr(z), p.isDragStart && !p.isClick) {
      if (!z.filter((st) => !Yn.has(an(st)) && st !== A).length) return;
      (Y = (F = p.inputEvent) == null ? void 0 : F.preventDefault) == null || Y.call(F), Xn.current = !0;
      const yt = () => {
        Xn.current = !1;
      };
      window.setTimeout(() => window.addEventListener("mousedown", yt, { capture: !0, once: !0 }), 0), (W = J.current) == null || W.waitToChangeTarget().then(() => {
        var st;
        return (st = J.current) == null ? void 0 : st.dragStart(p.inputEvent);
      });
    }
  }, If = (p) => {
    window.requestAnimationFrame(() => {
      var y, T, z;
      (z = (T = (y = Qe.current) == null ? void 0 : y.querySelector(`[data-item-id="${p}"]`)) == null ? void 0 : T.scrollIntoView) == null || z.call(T, { block: "nearest", inline: "nearest" });
    });
  }, vr = (p) => {
    Pt((y) => pd(y, p));
  }, Rf = () => Pt((p) => hd(p)), Pf = () => Pt((p) => vd(p)), ks = (() => {
    const p = [], y = [];
    if (!$) return { vertical: p, horizontal: y };
    const T = Gi($.page), z = Wi($.page.marginMm);
    for (const F of ka($.page))
      p.push(F.x, F.x + z, F.x + T.width / 2, F.x + T.width - z, F.x + T.width), y.push(F.y, F.y + z, F.y + T.height / 2, F.y + T.height - z, F.y + T.height);
    return { vertical: [...new Set(p)], horizontal: [...new Set(y)] };
  })(), Ms = () => {
    const p = hr.current;
    if (!p || !$) return;
    const y = { width: p.clientWidth - 36, height: p.clientHeight - 36 };
    if (y.width <= 0 || y.height <= 0) return;
    const T = Math.min(y.width / $.width, y.height / $.height);
    Tt(Math.max(0.1, Math.min(4, Math.floor(T * 100) / 100)));
  };
  Q.useEffect(() => {
    const p = U;
    if (!p) return;
    const y = (T) => {
      if (!(T.altKey || T.shiftKey || T.ctrlKey)) return;
      const z = T.deltaY || T.deltaX;
      if (!z) return;
      T.preventDefault();
      const F = Xt.current, Y = Math.max(0.1, Math.min(4, Math.round(F * Math.exp(-z * 25e-4) * 100) / 100));
      if (Y === F) return;
      Xt.current = Y, Tt(Y);
      const W = p.getBoundingClientRect(), it = T.clientX - W.left, yt = T.clientY - W.top, st = Y / F, Ot = (p.scrollLeft + it) * st - it, xe = (p.scrollTop + yt) * st - yt;
      requestAnimationFrame(() => {
        p.scrollLeft = Ot, p.scrollTop = xe;
      });
    };
    return p.addEventListener("wheel", y, { passive: !1 }), () => p.removeEventListener("wheel", y);
  }, [U]);
  const _s = (p) => {
    const y = p > 0 ? fn.find((T) => T > dt + 1e-3) : [...fn].reverse().find((T) => T < dt - 1e-3);
    y && Tt(y);
  }, Of = async () => {
    var T;
    const p = () => new Promise((z) => window.requestAnimationFrame(() => z()));
    await new Promise((z) => window.setTimeout(z, 150));
    const y = Date.now();
    for (; (T = Qe.current) != null && T.querySelector("[data-layout-pending]") && Date.now() - y < 2e4; )
      await new Promise((z) => window.setTimeout(z, 50));
    await p(), await p();
  }, Ts = async () => {
    var T;
    const p = Qe.current;
    if (!p || !$ || $e) return;
    Gn(!0);
    const y = Fe;
    try {
      const z = [];
      for (let F = 0; F < le.length; F++) {
        le.length > 1 && (Or(F), await Of());
        const Y = ((T = le[F]) == null ? void 0 : T.units.length) === 1 ? le[F].units[0].name : void 0;
        z.push(...Yg(p, $, { zoom: dt, crop: pr ? { paddingMm: Fn } : void 0 }).map((W) => Y ? { ...W, label: Y } : W));
      }
      await Xg(z, $, Ut), I == null || I();
    } catch (z) {
      H(z instanceof Error ? z.message : String(z));
    } finally {
      le.length > 1 && Or(y), Gn(!1);
    }
  }, Ge = (p) => {
    Pt((y) => {
      var T;
      if (p.mode === "off") {
        delete y.iteration;
        return;
      }
      if ((((T = y.iteration) == null ? void 0 : T.mode) ?? "off") === "off" && !y.items.some(sf))
        for (const z of y.items) Lt(z.recipe) && (z.recipe.iterated = !0);
      y.iteration = p;
    }), Or(0);
  }, jf = (p) => [...new Set(n.map((y) => {
    var T;
    return ((T = y.metadata) == null ? void 0 : T[p]) ?? "";
  }).filter(Boolean))], Nf = lt.source.kind === "group" ? `group:${lt.source.groupId}` : lt.source.kind === "metadata" ? `meta:${lt.source.column}=${lt.source.value}` : lt.source.kind, zf = (p) => {
    if (p === "all") return { kind: "all" };
    if (p.startsWith("group:")) return { kind: "group", groupId: p.slice(6) };
    if (p.startsWith("meta:")) {
      const [y, ...T] = p.slice(5).split("=");
      return { kind: "metadata", column: y, value: T.join("=") };
    }
    return { kind: "checked" };
  }, Af = (p) => {
    const y = Us(p.nativeEvent);
    if (y) {
      p.preventDefault(), y === "undo" ? Jn() : Qn();
      return;
    }
    if (p.target.closest("input, textarea, select")) return;
    const T = p.metaKey || p.ctrlKey;
    if (p.key === "Escape") {
      P([]);
      return;
    }
    if (T && p.key.toLowerCase() === "a") {
      p.preventDefault(), tr((($ == null ? void 0 : $.items) ?? []).filter((W) => !W.locked).map((W) => W.id));
      return;
    }
    if (!R.length) return;
    if (p.key === "Enter" && R.length === 1) {
      const W = $t.items.find((it) => it.id === R[0]);
      if ((W == null ? void 0 : W.recipe.kind) === "text") {
        p.preventDefault(), B(W.id);
        return;
      }
    }
    if (p.key === "Delete" || p.key === "Backspace") {
      p.preventDefault(), ln(Jt);
      return;
    }
    if (T && p.key.toLowerCase() === "d") {
      p.preventDefault(), un(Jt);
      return;
    }
    if (T && (p.key === "]" || p.key === "[")) {
      p.preventDefault(), Ke(Jt, p.key === "]" ? p.shiftKey ? "front" : "forward" : p.shiftKey ? "back" : "backward");
      return;
    }
    if (T && p.key.toLowerCase() === "g") {
      p.preventDefault(), p.shiftKey ? di() : $n();
      return;
    }
    if (T && p.shiftKey && p.key.toLowerCase() === "l") {
      p.preventDefault(), qn(Jt, !oi);
      return;
    }
    const z = p.shiftKey ? 10 : 1, Y = {
      ArrowLeft: [-z, 0],
      ArrowRight: [z, 0],
      ArrowUp: [0, -z],
      ArrowDown: [0, z]
    }[p.key];
    Y && (p.preventDefault(), Ef(Jt, Y[0], Y[1]));
  }, hi = Z == null ? void 0 : Z.recipe, Gt = hi && "sampleId" in hi ? _t.find(({ id: p }) => p === hi.sampleId) ?? null : null, Is = Gt ? Gt.sample.channels.map((p) => ({
    value: p.key,
    label: Gt.sample.channelLabel(Gt.sample.index(p.key) ?? 0)
  })) : [], Rs = Gt ? Sa(
    Gt.tree.populations,
    Gt.tree.root_population_id ?? ""
  ) : [], Jn = () => {
    const p = Pe.current.shift();
    p && (er.current = [
      ra(t),
      ...er.current
    ].slice(0, 30), si(p, !1));
  }, Qn = () => {
    const p = er.current.shift();
    p && (Pe.current = [
      ra(t),
      ...Pe.current
    ].slice(0, 30), si(p, !1));
  }, vi = Q.useRef({ undo: Jn, redo: Qn });
  return vi.current = { undo: Jn, redo: Qn }, Q.useEffect(() => {
    const p = (T) => {
      var F, Y;
      if (T.key === "Escape" && nr.current) {
        const W = nr.current;
        W.cancelled = !0, T.preventDefault(), T.stopPropagation(), Cs.current(W.targets), Kn(W.ghosts), W.ghosts = void 0, Sm(J.current);
        return;
      }
      const z = Us(T);
      z && ((Y = (F = T.target) == null ? void 0 : F.closest) != null && Y.call(F, "input, textarea, select, [contenteditable='true']") || (T.preventDefault(), T.stopPropagation(), z === "undo" ? vi.current.undo() : vi.current.redo()));
    }, y = () => {
      const T = nr.current;
      T && (Kn(T.ghosts), T.ghosts = void 0);
    };
    return window.addEventListener("keydown", p, !0), window.addEventListener("blur", y), () => {
      window.removeEventListener("keydown", p, !0), window.removeEventListener("blur", y);
    };
  }, []), $ ? /* @__PURE__ */ b.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${mt ? " is-preview" : ""}`,
      children: [
        /* @__PURE__ */ b.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": v("Layout sheets"),
            children: [
              t.sheets.map((p) => /* @__PURE__ */ b.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: ft === p.id ? /* @__PURE__ */ b.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: p.name,
                  autoFocus: !0,
                  onFocus: (y) => y.currentTarget.select(),
                  onBlur: (y) => {
                    const T = y.currentTarget.value.trim();
                    T && jr((z) => {
                      const F = z.sheets.find(
                        ({ id: Y }) => Y === p.id
                      );
                      F && (F.name = T);
                    }), bt(null);
                  },
                  onKeyDown: (y) => {
                    y.key === "Enter" && y.currentTarget.blur(), y.key === "Escape" && bt(null);
                  }
                }
              ) : /* @__PURE__ */ b.jsx(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": t.activeSheetId === p.id,
                  className: `gl-layout-sheet-tab${t.activeSheetId === p.id ? " active" : ""}`,
                  title: v("Double-click to rename"),
                  onClick: () => jr((y) => {
                    y.activeSheetId = p.id;
                  }),
                  onDoubleClick: () => bt(p.id),
                  children: p.name
                }
              ) }, p.id)),
              /* @__PURE__ */ b.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-layout-sheet-add",
                  title: v("New blank layout"),
                  onClick: () => {
                    const p = Zf(
                      `Layout ${t.sheets.length + 1}`,
                      { ...$.page }
                    );
                    jr((y) => {
                      y.sheets.push(p), y.activeSheetId = p.id;
                    }), P([]);
                  },
                  children: "+"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ b.jsxs(
          "div",
          {
            className: "gl-layout-toolbar",
            onMouseDown: (p) => {
              p.target.closest("button") && p.preventDefault();
            },
            children: [
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Hn("biplot"), disabled: !Zt, title: v(Zt ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: v("+ Biplot") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Hn("histogram"), disabled: !Zt, title: v(Zt ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: v("+ Histogram") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: ys, disabled: !Zt, title: v(Zt ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: v("+ Gating strategy") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: vs, disabled: !Zt, title: v(Zt ? "Add a summary chart: one statistic of a population per file, grouped by a metadata column, with a test between the groups" : "Preparing the files…"), children: v("+ Chart") }),
                /* @__PURE__ */ b.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: v("Add a text block; edit it on the page"),
                    onClick: gs,
                    children: v("+ Text")
                  }
                ),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Cf, disabled: !Zt, title: v("Add one plot per file and plot of the Illustration tab's current selection"), children: v("Add Illustration selection") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: ms, disabled: !Zt, title: v("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: v("+ Illustration figure") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: xs, disabled: !Zt || !C, title: v("Add the Plotting tab's current chart as one block, drawn here as it is there"), children: v("+ Plotting chart") })
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": v("Arrange"), children: [
                ym.map(({ how: p, label: y, title: T }) => /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Df(p), disabled: !R.length || mt, title: v(T), children: v(y) }, p)),
                bm.map(({ how: p, label: y, title: T }) => /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => kf(p), disabled: on < 3 || mt, title: v(T), children: v(y) }, p)),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": X, onClick: () => V((p) => !p), title: v("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: v("Snap grid") })
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": mt, onClick: () => wt(!mt), title: v("Show the page as it exports, without grid, margins or handles"), children: v(mt ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Pe.current.length, onClick: Jn, title: v("Undo the last layout edit (Cmd-Z)"), children: v("Undo") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !er.current.length, onClick: Qn, title: v("Redo the undone edit (Shift-Cmd-Z)"), children: v("Redo") }),
                /* @__PURE__ */ b.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: v("Copy this sheet, with its page and items, as a new sheet"),
                    onClick: () => {
                      const p = {
                        ...$,
                        id: crypto.randomUUID(),
                        page: { ...$.page },
                        ...$.iteration ? { iteration: structuredClone($.iteration) } : {},
                        name: `${$.name} copy`,
                        // Headings that read from a plot read the copy's plot, not the original sheet's.
                        items: qs($.items).copies
                      };
                      jr((y) => {
                        y.sheets.push(p), y.activeSheetId = p.id;
                      }), P([]);
                    },
                    children: v("Duplicate sheet")
                  }
                ),
                /* @__PURE__ */ b.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    disabled: t.sheets.length <= 1,
                    title: v("Remove this sheet; the layout keeps at least one"),
                    onClick: () => {
                      jr((p) => {
                        const y = p.sheets.findIndex(
                          ({ id: T }) => T === p.activeSheetId
                        );
                        p.sheets.splice(y, 1), p.activeSheetId = p.sheets[Math.max(0, y - 1)].id;
                      }), P([]);
                    },
                    children: v("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": v("Zoom"), children: [
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Ms, title: v("Fit the page to the window"), children: v("Fit") }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => _s(-1), "aria-label": v("Zoom out"), title: v("Zoom out"), disabled: dt <= fn[0], children: "−" }),
                /* @__PURE__ */ b.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(dt * 100),
                  "%"
                ] }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => _s(1), "aria-label": v("Zoom in"), title: v("Zoom in"), disabled: dt >= fn[fn.length - 1], children: "+" })
              ] }),
              (le.length > 1 || lt.mode !== "off") && /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": v("Pages of the iteration"), children: [
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Or(Math.max(0, Fe - 1)), disabled: Fe === 0, "aria-label": v("Previous page"), title: v("Previous page"), children: "◀" }),
                /* @__PURE__ */ b.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  v("Page {n} of {count}", { n: Fe + 1, count: Math.max(1, le.length) }),
                  $t.units.length > 0 && ` · ${$t.units.map((p) => p.name).join(", ")}`
                ] }),
                /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Or(Math.min(le.length - 1, Fe + 1)), disabled: Fe >= le.length - 1, "aria-label": v("Next page"), title: v("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ b.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void Ts(), disabled: $e || !$.items.length, title: le.length > 1 ? v("Write every page of the iteration; the format is chosen under Page") : v("Write this sheet at its page size; the format is chosen under Page"), children: $e ? v("Exporting…") : v("Export {format}", { format: Ut.toUpperCase() }) }) }),
              /* @__PURE__ */ b.jsx("span", { className: "gl-layout-performance-note", children: v("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        pt && /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ b.jsx("span", { children: pt }),
          /* @__PURE__ */ b.jsx("button", { type: "button", title: v("Dismiss"), "aria-label": v("Dismiss"), onClick: () => H(null), children: "×" })
        ] }),
        /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ b.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ b.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style"].map((p) => /* @__PURE__ */ b.jsx(
              "button",
              {
                "aria-pressed": vt === p,
                title: v(p === "item" ? "The selected item, or the file new plots take" : p === "page" ? "Page size, margins, pages and export" : p === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => gt(p),
                children: v(p === "item" ? "Items" : p === "page" ? "Page" : p === "iterate" ? "Iterate" : "Style")
              },
              p
            )) }),
            vt === "item" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                v("File for new plots"),
                /* @__PURE__ */ b.jsx(
                  "select",
                  {
                    value: ut,
                    onChange: (p) => Dt(p.target.value),
                    children: n.map((p) => /* @__PURE__ */ b.jsx("option", { value: p.id, children: p.name }, p.id))
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v("Placed plots keep their own file and hierarchy, independently of the Gating selection.") }),
              Re.error && /* @__PURE__ */ b.jsx("p", { role: "alert", children: Re.error }),
              ue.length > 1 && /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-inspector", "aria-label": v("Selected layout items"), children: [
                /* @__PURE__ */ b.jsx("strong", { children: mf ? v("{count} items selected, one group", { count: ue.length }) : v("{count} items selected", { count: ue.length }) }),
                /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-item-actions", children: [
                  on > 1 && /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: $n, title: v("One group: selected, moved, aligned and distributed together (Cmd-G)"), children: v("Group") }),
                  ue.some((p) => p.group) && /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: di, title: v("Dissolve the group; the items stay where they are (Shift-Cmd-G)"), children: v("Ungroup") }),
                  /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => un(Jt), title: v("Copies of every selected item, 20 px down and right (Cmd-D)"), children: v("Duplicate") }),
                  /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ke(Jt, "front"), title: v("Draw the selected items over every other"), children: v("Bring to front") }),
                  /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ke(Jt, "back"), title: v("Draw the selected items under every other"), children: v("Send to back") }),
                  /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => qn(Jt, !oi), title: v("Lock or unlock the selected items"), children: v(oi ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => ln(Jt), title: v("Remove the selected items (Delete)"), children: v("Remove") })
                ] }),
                /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v("Align and distribute them with the toolbar; drag any of them to move them together; Cmd-G makes them one group.") }),
                /* @__PURE__ */ b.jsx(
                  Bi,
                  {
                    styles: qe.map((p) => ar($, p.recipe)),
                    showTitle: qe.some(ai),
                    texts: us,
                    onChange: ii,
                    onTextChange: cs
                  }
                ),
                qe.length > 0 && // A field set here is set on every selected plot, so a grid sent from the
                // Illustration tab is tuned together, not one plot at a time.
                /* @__PURE__ */ b.jsxs("details", { className: "gl-layout-item-style", children: [
                  /* @__PURE__ */ b.jsx("summary", { children: v("Style of the {count} selected plots", { count: qe.length }) }),
                  /* @__PURE__ */ b.jsx(
                    Fi,
                    {
                      effective: ar($, qe[0].recipe),
                      own: qe[0].recipe.style ?? {},
                      omit: Da,
                      onChange: ii
                    }
                  ),
                  qe.some((p) => Object.keys(p.recipe.style ?? {}).length > 0) && /* @__PURE__ */ b.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: v("Drop the selected plots' own values; they then follow the sheet's style"),
                      onClick: () => Pt((p) => {
                        for (const y of p.items) {
                          if (!Jt.includes(y.id) || !Lt(y.recipe)) continue;
                          const { style: T, ...z } = y.recipe;
                          y.recipe = z;
                        }
                      }),
                      children: v("Follow the sheet")
                    }
                  )
                ] })
              ] }),
              !ue.length && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                /* @__PURE__ */ b.jsx(Jf, { intro: N, className: "gl-hint", children: v("Click an item to select it, drag empty page to select several, Shift-click to add or remove. Drag to move, Shift holds the direction; drag a corner handle or an edge to resize, Shift keeps the proportions, Option resizes from the centre; Cmd turns snapping off; Option-drag copies. Delete removes, arrows nudge (Shift: 10 px), Cmd-D duplicates, Cmd-A selects all, Cmd-] and Cmd-[ bring forward and send backward (Shift: to the front or back), Cmd-G groups and Shift-Cmd-G ungroups, Shift-Cmd-L locks, Cmd-Z undoes.") }),
                /* @__PURE__ */ b.jsx(Qf, { intro: N })
              ] }),
              Z && /* @__PURE__ */ b.jsxs(
                "div",
                {
                  className: "gl-layout-inspector",
                  "aria-label": v("Selected layout item"),
                  children: [
                    /* @__PURE__ */ b.jsx("strong", { children: v("Selected") }),
                    /* @__PURE__ */ b.jsx(
                      Bi,
                      {
                        styles: qe.map((p) => ar($, p.recipe)),
                        showTitle: qe.some(ai),
                        texts: us,
                        onChange: ii,
                        onTextChange: cs
                      }
                    ),
                    /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
                      /* @__PURE__ */ b.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: Z.showFrame === !0,
                          onChange: (p) => Pt((y) => {
                            const T = y.items.find(
                              (z) => z.id === Z.id
                            );
                            T && (T.showFrame = p.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => un([Z.id]), title: v("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: v("Duplicate") }),
                      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ke([Z.id], "front"), title: v("Draw this item over every other"), children: v("Bring to front") }),
                      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ke([Z.id], "back"), title: v("Draw this item under every other"), children: v("Send to back") }),
                      /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => ln([Z.id]), title: v("Remove this item from the page (Delete)"), children: v("Remove") })
                    ] }),
                    /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: v("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ b.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: Z.locked === !0,
                          onChange: (p) => qn([Z.id], p.target.checked)
                        }
                      ),
                      v("Locked")
                    ] }),
                    /* @__PURE__ */ b.jsx("div", { className: "gl-layout-dimensions", children: ["x", "y", "width", "height"].map((p) => /* @__PURE__ */ b.jsxs("label", { children: [
                      gm[p],
                      /* @__PURE__ */ b.jsx(
                        fe,
                        {
                          "aria-label": `Item ${p}`,
                          min: p === "width" || p === "height" ? td(Z.recipe.kind)[p] : 0,
                          integer: !0,
                          value: Z[p],
                          onCommit: (y) => Pt((T) => {
                            const z = T.items.find(
                              (F) => F.id === Z.id
                            );
                            z && (z[p] = y);
                          })
                        }
                      )
                    ] }, p)) }),
                    Z.recipe.kind === "text" ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Text"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            value: Z.recipe.text,
                            onChange: (p) => kt(
                              (y) => y.kind === "text" ? { ...y, text: p.target.value } : y
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Reads from"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            "aria-label": v("Reads from"),
                            value: Z.recipe.readsFrom ?? "",
                            onChange: (p) => kt((y) => {
                              if (y.kind !== "text") return y;
                              const T = { ...y };
                              return p.target.value ? T.readsFrom = p.target.value : delete T.readsFrom, T;
                            }),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "", children: v("Nothing: plain text") }),
                              $.items.filter((p) => Lt(p.recipe)).map((p) => /* @__PURE__ */ b.jsx("option", { value: p.id, children: Ue(p, _t) }, p.id))
                            ]
                          }
                        )
                      ] }),
                      Z.recipe.readsFrom && /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: mi }) })
                    ] }) : Z.recipe.kind === "figure" ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Figure page"),
                        /* @__PURE__ */ b.jsx(
                          fe,
                          {
                            "aria-label": v("Figure page"),
                            value: Z.recipe.page + 1,
                            min: 1,
                            integer: !0,
                            onCommit: (p) => kt((y) => y.kind === "figure" ? { ...y, page: Math.max(0, p - 1) } : y)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        v("Title"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            placeholder: Ue(Z, _t),
                            value: Z.recipe.title ?? "",
                            onChange: (p) => kt((y) => y.kind === "figure" ? { ...y, title: p.target.value } : y)
                          }
                        )
                      ] }),
                      S && /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: v("Load this figure into the Illustration tab"),
                          onClick: () => S(structuredClone(Z.recipe.illustration)),
                          children: v("Edit in Illustration")
                        }
                      ),
                      /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !(x != null && x.figure),
                          title: v("Take the Illustration tab's current figure in place of this one"),
                          onClick: () => kt(
                            (p) => p.kind === "figure" && x ? { ...p, illustration: structuredClone(x) } : p
                          ),
                          children: v("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : Z.recipe.kind === "cellpanel" ? /* @__PURE__ */ b.jsx(
                      Fg,
                      {
                        recipe: Z.recipe,
                        onChange: (p) => kt((y) => y.kind === "cellpanel" ? p : y)
                      }
                    ) : Z.recipe.kind === "imagewall" ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v("The cells as the Images tab showed them when the wall was added; their images are drawn from the file's waveform file.") }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        v("Title"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            placeholder: Z.recipe.populationName,
                            value: Z.recipe.title ?? "",
                            onChange: (p) => kt((y) => y.kind === "imagewall" ? { ...y, title: p.target.value } : y)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Tile size"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "number",
                            min: 16,
                            max: 200,
                            value: Z.recipe.tile,
                            onChange: (p) => kt((y) => y.kind === "imagewall" ? { ...y, tile: Math.max(16, Math.min(200, Math.round(Number(p.target.value) || 56))) } : y)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Columns"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "number",
                            min: 1,
                            max: 24,
                            value: Z.recipe.columns,
                            onChange: (p) => kt((y) => y.kind === "imagewall" ? { ...y, columns: Math.max(1, Math.min(24, Math.round(Number(p.target.value) || 8))) } : y)
                          }
                        )
                      ] })
                    ] }) : Z.recipe.kind === "proportions" ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        v("Title"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            placeholder: Ue(Z, _t),
                            value: Z.recipe.title ?? "",
                            onChange: (p) => kt((y) => y.kind === "proportions" ? { ...y, title: p.target.value } : y)
                          }
                        )
                      ] }),
                      k && /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: v("Load this chart's settings into the Plotting tab"),
                          onClick: () => k(structuredClone(Z.recipe.settings)),
                          children: v("Edit in Plotting")
                        }
                      ),
                      /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !C,
                          title: v("Take the Plotting tab's current chart in place of this one"),
                          onClick: () => {
                            const p = C == null ? void 0 : C();
                            p && kt((y) => y.kind === "proportions" ? { ...y, settings: p } : y);
                          },
                          children: v("Replace with the current Plotting chart")
                        }
                      )
                    ] }) : Z.recipe.kind === "chart" ? /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Population"),
                        /* @__PURE__ */ b.jsx(
                          "select",
                          {
                            value: Z.recipe.populationId,
                            onChange: (p) => kt((y) => y.kind === "chart" ? { ...y, populationId: p.target.value } : y),
                            children: Rs.map(({ popId: p, depth: y }) => {
                              var T;
                              return /* @__PURE__ */ b.jsxs("option", { value: p, children: [
                                " ".repeat(y * 2),
                                ((T = Gt == null ? void 0 : Gt.tree.populations[p]) == null ? void 0 : T.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Statistic"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            value: Z.recipe.statistic,
                            onChange: (p) => kt((y) => {
                              var F;
                              if (y.kind !== "chart") return y;
                              const T = p.target.value, z = T === "median" && !y.channel ? (F = Gt == null ? void 0 : Gt.sample.channels[0]) == null ? void 0 : F.key : y.channel;
                              return { ...y, statistic: T, ...z ? { channel: z } : {} };
                            }),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "percent_of_parent", children: v("% of parent") }),
                              /* @__PURE__ */ b.jsx("option", { value: "percent_of_total", children: v("% of total") }),
                              /* @__PURE__ */ b.jsx("option", { value: "count", children: v("Events") }),
                              /* @__PURE__ */ b.jsx("option", { value: "median", children: v("Median of a channel") })
                            ]
                          }
                        )
                      ] }),
                      Z.recipe.statistic === "median" && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Channel"),
                        /* @__PURE__ */ b.jsx(
                          "select",
                          {
                            value: Z.recipe.channel ?? "",
                            onChange: (p) => kt((y) => y.kind === "chart" ? { ...y, channel: p.target.value } : y),
                            children: ((Gt == null ? void 0 : Gt.sample.channels) ?? []).map((p) => /* @__PURE__ */ b.jsx("option", { value: p.key, children: (Gt == null ? void 0 : Gt.sample.labelForKey(p.key)) ?? p.key }, p.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Files"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            value: Z.recipe.files,
                            onChange: (p) => kt((y) => y.kind === "chart" ? { ...y, files: p.target.value === "all" ? "all" : "checked" } : y),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "checked", children: v("Checked files") }),
                              /* @__PURE__ */ b.jsx("option", { value: "all", children: v("All files") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Group by"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            value: Z.recipe.groupBy,
                            onChange: (p) => kt((y) => y.kind === "chart" ? { ...y, groupBy: p.target.value } : y),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "", children: v("Each file") }),
                              s.map((p) => /* @__PURE__ */ b.jsx("option", { value: p, children: p }, p))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Chart"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            value: Z.recipe.chartType,
                            onChange: (p) => kt((y) => y.kind === "chart" ? { ...y, chartType: p.target.value } : y),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "bars", children: v("Bars (mean ± SD)") }),
                              /* @__PURE__ */ b.jsx("option", { value: "dots", children: v("Points with the mean") }),
                              /* @__PURE__ */ b.jsx("option", { value: "box", children: v("Boxes (median, quartiles)") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: Z.recipe.showPoints,
                            onChange: (p) => kt((y) => y.kind === "chart" ? { ...y, showPoints: p.target.checked } : y)
                          }
                        ),
                        v("Show each file as a point")
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: v("Wilcoxon rank-sum between two groups, Kruskal–Wallis among more; every group needs two files"), children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: Z.recipe.test,
                            onChange: (p) => kt((y) => y.kind === "chart" ? { ...y, test: p.target.checked } : y)
                          }
                        ),
                        v("Test between groups")
                      ] }),
                      Ee && (Ee.missing.length > 0 || Ee.noChannel.length > 0) && /* @__PURE__ */ b.jsxs("p", { className: "gl-hint gl-layout-warning", children: [
                        Ee.missing.length > 0 && v("No point for {files}: the population is not on these files.", { files: Ee.missing.join(", ") }),
                        Ee.missing.length > 0 && Ee.noChannel.length > 0 && " ",
                        Ee.noChannel.length > 0 && v("No point for {files}: the channel is not on these files.", { files: Ee.noChannel.join(", ") })
                      ] }),
                      (Ee == null ? void 0 : Ee.unassigned) && /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v(Z.recipe.test ? "Files without a value in the column are drawn as Unassigned and left out of the test." : "Files without a value in the column are drawn as Unassigned.") }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        v("Title"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            placeholder: Ue(Z, _t),
                            value: Z.recipe.title ?? "",
                            onChange: (p) => kt((y) => y.kind === "chart" ? { ...y, title: p.target.value } : y)
                          }
                        )
                      ] })
                    ] }) : /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                      !En(Z.recipe) && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("FCS"),
                        /* @__PURE__ */ b.jsx(
                          "select",
                          {
                            value: Z.recipe.sampleId,
                            onChange: (p) => kt((y) => {
                              if (y.kind === "text" || y.kind === "figure" || y.kind === "proportions" || y.kind === "imagewall" || y.kind === "cellpanel") return y;
                              const T = _t.find(
                                (F) => F.id === p.target.value
                              );
                              if (!T) return y;
                              const z = Gt && dn(
                                {
                                  hierarchyId: Gt.tree.id,
                                  populationId: y.populationId
                                },
                                T.tree,
                                Br(d)
                              );
                              return {
                                ...y,
                                sampleId: T.id,
                                populationId: (z == null ? void 0 : z.id) ?? T.tree.root_population_id ?? ""
                              };
                            }),
                            children: _t.map((p) => /* @__PURE__ */ b.jsx("option", { value: p.id, children: p.name }, p.id))
                          }
                        )
                      ] }),
                      (Z.recipe.kind === "biplot" || Z.recipe.kind === "histogram") && /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: v("Draw the events of several files on this plot, as the Gating tab pools the checked files; a gate is drawn where every pooled file has it alike, with the pooled percentage"), children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: !!Z.recipe.pool,
                            onChange: (p) => {
                              if (!p.target.checked) {
                                fi(null);
                                return;
                              }
                              const y = Z.recipe.kind === "biplot" || Z.recipe.kind === "histogram" ? Z.recipe.sampleId : "";
                              fi(a.includes(y) ? a : [y]);
                            }
                          }
                        ),
                        v("Pool files")
                      ] }),
                      (Z.recipe.kind === "biplot" || Z.recipe.kind === "histogram") && Z.recipe.pool && /* @__PURE__ */ b.jsx(
                        Dm,
                        {
                          files: n,
                          pool: Z.recipe.pool.sampleIds,
                          checkedSampleIds: a,
                          groups: i,
                          fileGroups: o,
                          report: wf,
                          onChange: fi
                        }
                      ),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Population"),
                        /* @__PURE__ */ b.jsx(
                          "select",
                          {
                            value: Z.recipe.populationId,
                            onChange: (p) => kt(
                              (y) => y.kind === "text" ? y : {
                                ...y,
                                populationId: p.target.value
                              }
                            ),
                            children: Rs.map(({ popId: p, depth: y }) => {
                              var T;
                              return /* @__PURE__ */ b.jsxs("option", { value: p, children: [
                                " ".repeat(y * 2),
                                ((T = Gt == null ? void 0 : Gt.tree.populations[p]) == null ? void 0 : T.name) ?? p
                              ] }, p);
                            })
                          }
                        )
                      ] }),
                      Z.recipe.kind !== "strategy" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                        /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ b.jsx(
                            Vs,
                            {
                              label: v("X channel"),
                              value: Z.recipe.xChannel,
                              options: Is,
                              onChange: (p) => kt(
                                (y) => y.kind === "biplot" || y.kind === "histogram" ? { ...y, xChannel: p } : y
                              )
                            }
                          )
                        ] }),
                        Z.recipe.kind === "biplot" && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ b.jsx(
                            Vs,
                            {
                              label: v("Y channel"),
                              value: Z.recipe.yChannel ?? "",
                              options: Is,
                              onChange: (p) => kt(
                                (y) => y.kind === "biplot" ? { ...y, yChannel: p } : y
                              )
                            }
                          )
                        ] })
                      ] }),
                      Z.recipe.kind === "strategy" && ((js = Z.recipe.populationIds) == null ? void 0 : js.length) && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                        /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v("{count} populations; the grid follows the live gates", { count: Z.recipe.populationIds.length }) }),
                        /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", title: v("Tree: a column per depth and a row per leaf. Wrapped: the tree walked depth first and wrapped into rows of the columns beside."), children: [
                          v("Layout"),
                          /* @__PURE__ */ b.jsxs(
                            "select",
                            {
                              value: Z.recipe.layout ?? "tree",
                              onChange: (p) => kt((y) => y.kind === "strategy" ? { ...y, layout: p.target.value === "flow" ? "flow" : "tree" } : y),
                              children: [
                                /* @__PURE__ */ b.jsx("option", { value: "tree", children: v("Tree") }),
                                /* @__PURE__ */ b.jsx("option", { value: "flow", children: v("Wrapped") })
                              ]
                            }
                          )
                        ] }),
                        (Z.recipe.layout ?? "tree") === "flow" && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                          v("Columns"),
                          /* @__PURE__ */ b.jsx(fe, { min: 1, max: 24, integer: !0, value: Z.recipe.columns ?? 4, onCommit: (p) => kt((y) => y.kind === "strategy" ? { ...y, columns: p } : y) })
                        ] }),
                        /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: v("An arrow from each gate to the panel of the population it makes, through the gutters"), children: [
                          /* @__PURE__ */ b.jsx(
                            "input",
                            {
                              type: "checkbox",
                              checked: Z.recipe.showArrows !== !1,
                              onChange: (p) => kt((y) => y.kind === "strategy" ? { ...y, showArrows: p.target.checked } : y)
                            }
                          ),
                          v("Arrows")
                        ] }),
                        Z.recipe.showArrows !== !1 && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                          /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", title: v("The arrows' colour; unticked, each takes its gate's"), children: [
                            /* @__PURE__ */ b.jsx(
                              "input",
                              {
                                type: "checkbox",
                                checked: !!Z.recipe.arrowColor,
                                onChange: (p) => kt((y) => y.kind === "strategy" ? { ...y, arrowColor: p.target.checked ? "#444444" : void 0 } : y)
                              }
                            ),
                            v("One colour"),
                            Z.recipe.arrowColor && /* @__PURE__ */ b.jsx(
                              "input",
                              {
                                type: "color",
                                value: Z.recipe.arrowColor,
                                onChange: (p) => kt((y) => y.kind === "strategy" ? { ...y, arrowColor: p.target.value } : y)
                              }
                            )
                          ] }),
                          /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", title: v("Where an arrow leaves its panel: level with the gate's label, or with the centre of the gate itself"), children: [
                            v("Arrows from"),
                            /* @__PURE__ */ b.jsxs(
                              "select",
                              {
                                value: Z.recipe.arrowAnchor ?? "label",
                                onChange: (p) => kt((y) => y.kind === "strategy" ? { ...y, arrowAnchor: p.target.value === "gate" ? "gate" : void 0 } : y),
                                children: [
                                  /* @__PURE__ */ b.jsx("option", { value: "label", children: v("Gate label") }),
                                  /* @__PURE__ */ b.jsx("option", { value: "gate", children: v("Gate centre") })
                                ]
                              }
                            )
                          ] }),
                          /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                            v("Arrow width"),
                            /* @__PURE__ */ b.jsx(fe, { min: 0.5, max: 6, step: 0.25, value: Z.recipe.arrowWidth ?? 1.5, onCommit: (p) => kt((y) => y.kind === "strategy" ? { ...y, arrowWidth: p } : y) })
                          ] })
                        ] })
                      ] }),
                      Z.recipe.kind === "strategy" && !((Ns = Z.recipe.populationIds) != null && Ns.length) && /* @__PURE__ */ b.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: Z.recipe.fullPath,
                            onChange: (p) => kt(
                              (y) => y.kind === "strategy" ? {
                                ...y,
                                fullPath: p.target.checked
                              } : y
                            )
                          }
                        ),
                        v("Full path from root")
                      ] }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                        v("Display"),
                        /* @__PURE__ */ b.jsxs(
                          "select",
                          {
                            value: Z.recipe.displayMode,
                            onChange: (p) => kt(
                              (y) => y.kind === "text" ? y : {
                                ...y,
                                displayMode: p.target.value
                              }
                            ),
                            children: [
                              /* @__PURE__ */ b.jsx("option", { value: "pseudocolor", children: v("Pseudocolor") }),
                              /* @__PURE__ */ b.jsx("option", { value: "scatter", children: v("Scatter") }),
                              /* @__PURE__ */ b.jsx("option", { value: "contour", children: v("Contour") })
                            ]
                          }
                        )
                      ] }),
                      lt.mode !== "off" && /* @__PURE__ */ b.jsxs("label", { className: "gl-check", title: lt.mode === "populations" ? v("Drawn once per population of the iteration, for that population; unticked, it shows its own population on every page") : lt.mode === "metadata" ? v("Drawn once per value of {column}, pooling that value's files; unticked, it shows its own files on every page", { column: lt.column ?? "" }) : v("Drawn once per file of the iteration, for that file; unticked, it shows this file on every page"), children: [
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: Z.recipe.iterated === !0,
                            onChange: (p) => kt(
                              (y) => y.kind === "text" ? y : { ...y, iterated: p.target.checked }
                            )
                          }
                        ),
                        v("Follows the iteration")
                      ] }),
                      bs && /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: bs }),
                      /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: v("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: mi }), children: [
                        v("Title"),
                        /* @__PURE__ */ b.jsx(
                          "input",
                          {
                            placeholder: xf || Ue(Z, _t),
                            value: Z.recipe.title ?? "",
                            onChange: (p) => kt(
                              (y) => y.kind === "text" ? y : { ...y, title: p.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ b.jsxs("summary", { children: [
                          v("Style"),
                          Object.keys(Z.recipe.style ?? {}).length > 0 ? ` · ${v("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ b.jsx(
                          Fi,
                          {
                            effective: ar($, Z.recipe),
                            own: Z.recipe.style ?? {},
                            omit: Da,
                            onChange: (p) => kt(
                              (y) => Lt(y) ? { ...y, style: yi({ ...y.style, ...p }) } : y
                            )
                          }
                        ),
                        Object.keys(Z.recipe.style ?? {}).length > 0 && /* @__PURE__ */ b.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: v("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => kt((p) => {
                              if (!Lt(p)) return p;
                              const { style: y, ...T } = p;
                              return T;
                            }),
                            children: v("Follow the sheet")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => _(
                            Z.recipe
                          ),
                          children: v("Open in Gating")
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            vt === "page" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
              /* @__PURE__ */ b.jsx("h3", { children: v("Page") }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                v("Size"),
                /* @__PURE__ */ b.jsxs(
                  "select",
                  {
                    value: $.page.preset,
                    onChange: (p) => vr(rd(p.target.value, $.page.orientation, $.page)),
                    children: [
                      Object.entries(ed).map(([p, y]) => /* @__PURE__ */ b.jsx("option", { value: p, children: y.label }, p)),
                      /* @__PURE__ */ b.jsx("option", { value: "custom", children: v("Custom") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                v("Orientation"),
                /* @__PURE__ */ b.jsxs(
                  "select",
                  {
                    value: $.page.orientation,
                    onChange: (p) => vr({ ...$.page, orientation: p.target.value }),
                    children: [
                      /* @__PURE__ */ b.jsx("option", { value: "portrait", children: v("Portrait") }),
                      /* @__PURE__ */ b.jsx("option", { value: "landscape", children: v("Landscape") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsx("div", { className: "gl-layout-dimensions", children: ["width", "height"].map((p) => /* @__PURE__ */ b.jsxs("label", { children: [
                v(p === "width" ? "Width (mm)" : "Height (mm)"),
                /* @__PURE__ */ b.jsx(
                  fe,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": v(p === "width" ? "Width (mm)" : "Height (mm)"),
                    value: su($.page)[p === "width" ? "widthMm" : "heightMm"],
                    onCommit: (y) => {
                      const T = $.page.orientation === "landscape", z = p === "width" == !T ? "widthMm" : "heightMm";
                      vr({ ...$.page, preset: "custom", [z]: y });
                    }
                  }
                )
              ] }, p)) }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                v("Margin (mm)"),
                /* @__PURE__ */ b.jsx(
                  fe,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: $.page.marginMm,
                    onCommit: (p) => vr({ ...$.page, marginMm: p })
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ b.jsxs("label", { children: [
                  v("Pages across"),
                  /* @__PURE__ */ b.jsx(fe, { min: 1, max: Ks, step: 1, integer: !0, "aria-label": v("Pages across"), value: $.page.columns, onCommit: (p) => vr({ ...$.page, columns: p }) })
                ] }),
                /* @__PURE__ */ b.jsxs("label", { children: [
                  v("Pages down"),
                  /* @__PURE__ */ b.jsx(fe, { min: 1, max: Ks, step: 1, integer: !0, "aria-label": v("Pages down"), value: $.page.rows, onCommit: (p) => vr({ ...$.page, rows: p }) })
                ] })
              ] }),
              /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Rf, disabled: !$.items.length, title: v("Make the page a custom size that holds every item inside the margin, as one page"), children: v("Fit page to content") }),
                /* @__PURE__ */ b.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Pf, disabled: !$.items.length, title: v("Scale and centre every item, as one group, to fill the first page inside its margin"), children: v("Fit content to page") })
              ] }),
              /* @__PURE__ */ b.jsx("h3", { children: v("Export") }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                v("Format"),
                /* @__PURE__ */ b.jsxs("select", { value: Ut, onChange: (p) => Ce(p.target.value), children: [
                  /* @__PURE__ */ b.jsx("option", { value: "pdf", children: v("PDF · the page at its size") }),
                  /* @__PURE__ */ b.jsx("option", { value: "svg", children: v("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ b.jsx("option", { value: "png", children: v("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                v("Resolution (dpi)"),
                /* @__PURE__ */ b.jsx(
                  fe,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: $.page.dpi,
                    onCommit: (p) => vr({ ...$.page, dpi: p })
                  }
                )
              ] }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                /* @__PURE__ */ b.jsx("input", { type: "checkbox", checked: pr, onChange: (p) => Bn(p.target.checked) }),
                v("Crop to content")
              ] }),
              pr && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                v("Padding (mm)"),
                /* @__PURE__ */ b.jsx(fe, { min: 0, max: 50, step: 0.5, "aria-label": v("Padding (mm)"), value: Fn, onCommit: Rr })
              ] }),
              /* @__PURE__ */ b.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void Ts(), disabled: $e || !$.items.length, children: v($e ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v(pr ? "The export is cut down to the items on each page plus the padding, so a figure comes out without the paper around it; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above." : "The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            vt === "iterate" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
              /* @__PURE__ */ b.jsx("h3", { children: v("Iterate") }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                v("Draw the sheet"),
                /* @__PURE__ */ b.jsxs(
                  "select",
                  {
                    value: lt.mode,
                    onChange: (p) => {
                      const y = p.target.value;
                      if (y === "metadata") {
                        const T = lt.column && s.includes(lt.column) ? lt.column : s[0] ?? "";
                        Ge({ ...lt, mode: "metadata", column: T, source: lt.source.kind === "metadata" ? { kind: "checked" } : lt.source });
                        return;
                      }
                      Ge({ ...lt, mode: y === "files" ? "files" : y === "populations" ? "populations" : "off" });
                    },
                    children: [
                      /* @__PURE__ */ b.jsx("option", { value: "off", children: v("Once") }),
                      /* @__PURE__ */ b.jsx("option", { value: "files", children: v("Once per file") }),
                      /* @__PURE__ */ b.jsx("option", { value: "populations", children: v("Once per population") }),
                      /* @__PURE__ */ b.jsx("option", { value: "metadata", disabled: !s.length, children: v("Once per value of a metadata column") })
                    ]
                  }
                )
              ] }),
              lt.mode === "metadata" && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                v("Column"),
                /* @__PURE__ */ b.jsx("select", { value: lt.column ?? "", onChange: (p) => Ge({ ...lt, column: p.target.value }), children: s.map((p) => /* @__PURE__ */ b.jsx("option", { value: p, children: p }, p)) })
              ] }),
              lt.mode !== "off" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                lt.mode === "populations" && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                  v("Populations"),
                  /* @__PURE__ */ b.jsxs(
                    "select",
                    {
                      value: ((zs = lt.populations) == null ? void 0 : zs.kind) === "branch" ? lt.populations.populationId : "all",
                      onChange: (p) => Ge({
                        ...lt,
                        populations: p.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: p.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ b.jsx("option", { value: "all", children: v("All in the tree") }),
                        (oe ? Sa(oe.tree.populations, oe.tree.root_population_id ?? "") : []).filter(({ popId: p }) => p !== (oe == null ? void 0 : oe.tree.root_population_id)).map(({ popId: p, depth: y }) => {
                          var T;
                          return /* @__PURE__ */ b.jsxs("option", { value: p, children: [
                            " ".repeat(y * 2),
                            v("Under {name}", { name: ((T = oe == null ? void 0 : oe.tree.populations[p]) == null ? void 0 : T.name) ?? p })
                          ] }, p);
                        })
                      ]
                    }
                  )
                ] }),
                (lt.mode === "files" || lt.mode === "metadata") && /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                  v("Files"),
                  /* @__PURE__ */ b.jsxs("select", { value: Nf, onChange: (p) => Ge({ ...lt, source: zf(p.target.value) }), children: [
                    /* @__PURE__ */ b.jsx("option", { value: "checked", children: v("Checked files") }),
                    /* @__PURE__ */ b.jsx("option", { value: "all", children: v("All files") }),
                    i.map((p) => /* @__PURE__ */ b.jsx("option", { value: `group:${p.id}`, children: v("Group {name}", { name: p.name }) }, p.id)),
                    lt.mode === "files" && s.flatMap(
                      (p) => jf(p).map((y) => /* @__PURE__ */ b.jsxs("option", { value: `meta:${p}=${y}`, children: [
                        p,
                        " = ",
                        y
                      ] }, `${p}=${y}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                  v("Arrangement"),
                  /* @__PURE__ */ b.jsxs(
                    "select",
                    {
                      value: lt.arrangement.kind,
                      onChange: (p) => Ge({
                        ...lt,
                        // Tiles start at as many as fit the paper, so none is cut off by default.
                        arrangement: p.target.value === "tiles" ? { kind: "tiles", ...eu($, 24), order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ b.jsx("option", { value: "page-per-unit", children: lt.mode === "populations" ? v("One page per population") : lt.mode === "metadata" ? v("One page per value") : v("One page per file") }),
                        /* @__PURE__ */ b.jsx("option", { value: "tiles", children: v("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                lt.arrangement.kind === "tiles" && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
                  /* @__PURE__ */ b.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((p) => /* @__PURE__ */ b.jsxs("label", { children: [
                    v(p === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ b.jsx(
                      fe,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": v(p === "columns" ? "Tiles across" : "Tiles down"),
                        value: lt.arrangement.kind === "tiles" ? lt.arrangement[p] : 1,
                        onCommit: (y) => {
                          lt.arrangement.kind === "tiles" && Ge({ ...lt, arrangement: { ...lt.arrangement, [p]: y } });
                        }
                      }
                    )
                  ] }, p)) }),
                  /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                    v("Order"),
                    /* @__PURE__ */ b.jsxs(
                      "select",
                      {
                        value: lt.arrangement.order,
                        onChange: (p) => lt.arrangement.kind === "tiles" && Ge({ ...lt, arrangement: { ...lt.arrangement, order: p.target.value === "column-major" ? "column-major" : "row-major" } }),
                        children: [
                          /* @__PURE__ */ b.jsx("option", { value: "row-major", children: v("Across, then down") }),
                          /* @__PURE__ */ b.jsx("option", { value: "column-major", children: v("Down, then across") })
                        ]
                      }
                    )
                  ] }),
                  (() => {
                    const p = Jg($t.items, $);
                    if (!p || lt.arrangement.kind !== "tiles") return null;
                    const y = eu($, lt.arrangement.gap);
                    return /* @__PURE__ */ b.jsxs("p", { className: "gl-hint gl-layout-warning", role: "status", children: [
                      v("{n} of {m} items on this page reach beyond the paper; the export cuts them off. {across} across × {down} down fit.", { n: p, m: $t.items.length, across: y.columns, down: y.rows }),
                      " ",
                      /* @__PURE__ */ b.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => lt.arrangement.kind === "tiles" && Ge({ ...lt, arrangement: { ...lt.arrangement, ...y } }),
                          children: v("Fit the tiles to the page")
                        }
                      )
                    ] });
                  })(),
                  /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                    v("Gap between tiles (px)"),
                    /* @__PURE__ */ b.jsx(
                      fe,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: lt.arrangement.gap,
                        onCommit: (p) => {
                          lt.arrangement.kind === "tiles" && Ge({ ...lt, arrangement: { ...lt.arrangement, gap: p } });
                        }
                      }
                    )
                  ] })
                ] }),
                we.length === 0 && /* @__PURE__ */ b.jsx("p", { className: "gl-hint gl-layout-warning", role: "status", children: lt.mode === "populations" ? v("No populations to draw: the file has none under this choice. The sheet is shown once, with its placeholders unfilled.") : v("No files to draw: the source names none (are any files checked in the Samples pane?). The sheet is shown once, with its placeholders unfilled.") }),
                /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: lt.mode === "populations" ? v("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: we.length, of: (oe == null ? void 0 : oe.name) ?? "the file", pages: Math.max(1, le.length) }) : lt.mode === "metadata" ? v("{values} values of {column} over {files} files → {pages} pages. Items marked “Follows the iteration” pool the files of each value; the others repeat. Text and titles may use {sample} (the value), {meta:column}, {file} (how many files), {n} and {N}; a plot title may also use {population} and {count}.", { values: we.length, column: lt.column ?? "", files: we.reduce((p, y) => {
                  var T;
                  return p + (((T = y.sampleIds) == null ? void 0 : T.length) ?? 0);
                }, 0), pages: Math.max(1, le.length) }) : v("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: we.length, pages: Math.max(1, le.length) }) })
              ] })
            ] }),
            vt === "style" && $ && /* @__PURE__ */ b.jsxs(b.Fragment, { children: [
              /* @__PURE__ */ b.jsx("h3", { children: v("Style") }),
              /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                v("Plot titles"),
                /* @__PURE__ */ b.jsxs(
                  "select",
                  {
                    "aria-label": v("Plot titles"),
                    value: is ? "custom" : ((As = ea.find((p) => p.template === ($.titleTemplate ?? ""))) == null ? void 0 : As.id) ?? "custom",
                    onChange: (p) => {
                      const y = ea.find((T) => T.id === p.target.value);
                      hf(!y), Pt((T) => {
                        var z;
                        y ? y.template ? T.titleTemplate = y.template : delete T.titleTemplate : T.titleTemplate = ((z = T.titleTemplate) == null ? void 0 : z.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      ea.map((p) => /* @__PURE__ */ b.jsx("option", { value: p.id, children: v(p.label) }, p.id)),
                      /* @__PURE__ */ b.jsx("option", { value: "custom", children: v("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const p = $.items.filter((y) => ps(y));
                return p.length ? /* @__PURE__ */ b.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  v("{count} plots keep a title of their own, so the template does not reach them.", { count: p.length }),
                  " ",
                  /* @__PURE__ */ b.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: v("Drop those plots' own titles so every plot on the sheet follows the template"),
                      onClick: () => Pt((y) => {
                        for (const T of y.items) Lt(T.recipe) && delete T.recipe.title;
                      }),
                      children: v("Use the template for all")
                    }
                  )
                ] }) : null;
              })(),
              (is || !ea.some((p) => p.template === ($.titleTemplate ?? ""))) && (() => {
                var yt;
                const p = $.titleTemplate ?? "", y = nd(p), T = (y == null ? void 0 : y.tokens) ?? [], z = (y == null ? void 0 : y.separator) ?? vf, F = (st) => {
                  var Ot;
                  return ((Ot = ss.find((xe) => xe.token === st)) == null ? void 0 : Ot.label) ?? st;
                }, Y = (st) => Pt((Ot) => {
                  Ot.titleTemplate = Qs(st, z);
                }), W = $t.items.find((st) => Lt(st.recipe)), it = W && Lt(W.recipe) ? Ma(p, Pr(W.recipe, W.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ b.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": v("Title builder"), children: [
                  /* @__PURE__ */ b.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": v("Fields in the title"), children: [
                    T.length === 0 && /* @__PURE__ */ b.jsx("span", { className: "gl-hint", children: v(y === null && p ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    T.map((st, Ot) => /* @__PURE__ */ b.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": v("Remove {field}", { field: F(st) }),
                        title: v("Remove {field} from the title", { field: F(st) }),
                        onClick: () => Y(T.filter((xe, Le) => Le !== Ot)),
                        children: [
                          F(st),
                          " ×"
                        ]
                      },
                      `${st}-${Ot}`
                    ))
                  ] }),
                  /* @__PURE__ */ b.jsx("div", { className: "gl-title-builder-fields", "aria-label": v("Fields to add"), children: ss.map((st) => /* @__PURE__ */ b.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-chip",
                      "aria-label": v("Add {field}", { field: st.label }),
                      title: st.token,
                      onClick: () => Y([...T, st.token]),
                      children: st.label
                    },
                    st.token
                  )) }),
                  /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline", children: [
                    v("Between fields"),
                    /* @__PURE__ */ b.jsx(
                      "select",
                      {
                        "aria-label": v("Separator"),
                        value: ((yt = xi.find((st) => st.value === z)) == null ? void 0 : yt.id) ?? "dot",
                        onChange: (st) => {
                          var xe;
                          const Ot = ((xe = xi.find((Le) => Le.id === st.target.value)) == null ? void 0 : xe.value) ?? " · ";
                          gf(Ot), T.length && Pt((Le) => {
                            Le.titleTemplate = Qs(T, Ot);
                          });
                        },
                        children: xi.map((st) => /* @__PURE__ */ b.jsx("option", { value: st.id, children: v(st.label) }, st.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ b.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                    v("Template"),
                    /* @__PURE__ */ b.jsx(
                      "input",
                      {
                        "aria-label": v("Title template"),
                        value: p,
                        onChange: (st) => Pt((Ot) => {
                          Ot.titleTemplate = st.target.value;
                        })
                      }
                    )
                  ] }),
                  it && /* @__PURE__ */ b.jsx("div", { className: "gl-hint gl-title-builder-preview", children: v("First plot reads: {title}", { title: it }) })
                ] });
              })(),
              /* @__PURE__ */ b.jsx("p", { className: "gl-hint", children: v(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise; on an iterated sheet it looks across every page, so each page is titled alike and names what it is drawn for.`, { list: mi }) }),
              /* @__PURE__ */ b.jsx(
                Bi,
                {
                  styles: (() => {
                    const p = $.items.filter((y) => Lt(y.recipe));
                    return p.length ? p.map((y) => ar($, y.recipe)) : [ar($)];
                  })(),
                  showTitle: !$.items.some((p) => Lt(p.recipe)) || $.items.some(ai),
                  onChange: ls
                }
              ),
              /* @__PURE__ */ b.jsx(
                Fi,
                {
                  effective: ar($),
                  own: $.style ?? {},
                  omit: Da,
                  onChange: ls
                }
              ),
              Object.keys($.style ?? {}).length > 0 && /* @__PURE__ */ b.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  onClick: () => Pt((p) => {
                    delete p.style;
                  }),
                  children: v("Reset to defaults")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ b.jsx(ad, { menu: yf, onClose: () => ui(null) }),
          /* @__PURE__ */ b.jsxs(
            "div",
            {
              ref: (p) => {
                hr.current = p, L(p);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": v("Layout page"),
              onKeyDown: Af,
              children: [
                !mt && U && /* @__PURE__ */ b.jsx(
                  Bg,
                  {
                    ref: ot,
                    container: U,
                    dragContainer: U,
                    selectableTargets: [".gl-layout-item"],
                    selectByClick: !0,
                    selectFromInside: !1,
                    continueSelect: !1,
                    toggleContinueSelect: ["shift"],
                    hitRate: 0,
                    ratio: 0,
                    dragCondition: (p) => {
                      var y, T, z;
                      return !((z = (T = (y = p.inputEvent) == null ? void 0 : y.target) == null ? void 0 : T.closest) != null && z.call(T, "textarea, input, select, button"));
                    },
                    onDragStart: _f,
                    onSelectEnd: Tf
                  }
                ),
                /* @__PURE__ */ b.jsx(
                  "div",
                  {
                    className: "gl-layout-zoom",
                    style: { width: $.width * dt, height: $.height * dt },
                    children: /* @__PURE__ */ b.jsxs(
                      "section",
                      {
                        ref: (p) => {
                          Qe.current = p, K(p);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": $.name,
                        onContextMenu: Sf,
                        style: {
                          width: $.width,
                          height: $.height,
                          transform: `scale(${dt})`,
                          "--gl-hair": `${1 / dt}px`,
                          backgroundImage: `linear-gradient(#eef2f7 ${1 / dt}px, transparent ${1 / dt}px), linear-gradient(90deg, #eef2f7 ${1 / dt}px, transparent ${1 / dt}px)`
                        },
                        children: [
                          ka($.page).map((p) => {
                            const y = Gi($.page), T = Wi($.page.marginMm);
                            return /* @__PURE__ */ b.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: p.x, top: p.y, width: y.width, height: y.height }, children: T > 0 && /* @__PURE__ */ b.jsx("div", { className: "gl-layout-page-margin", style: { inset: T } }) }, `${p.row}-${p.column}`);
                          }),
                          $t.items.length === 0 && /* @__PURE__ */ b.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ b.jsx("strong", { children: v("Blank layout") }),
                            /* @__PURE__ */ b.jsx("span", { children: v(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          $t.items.map((p) => /* @__PURE__ */ b.jsx(
                            Mm,
                            {
                              item: p,
                              templateText: (() => {
                                const y = $.items.find((T) => T.id === p.templateId);
                                return (y == null ? void 0 : y.recipe.kind) === "text" ? y.recipe.text : void 0;
                              })(),
                              selected: R.includes(p.id),
                              samples: _t,
                              state: d,
                              globalScales: h,
                              dataRevision: E,
                              densityColorPower: M,
                              style: ar($, p.recipe),
                              titleTemplate: So(ps(p, p.templateSampleId) || ni, p.unitId && we.find((y) => y.id === p.unitId) || null, p.position.n, p.position.total),
                              describe: Pr,
                              checkedSampleIds: a,
                              metadataById: It,
                              files: n,
                              sources: Re.sources,
                              divisionProfiles: w,
                              imageService: D,
                              canvasScale: At,
                              onTextChange: (y, T) => {
                                if (!y.trim()) {
                                  ln([p.templateId]);
                                  return;
                                }
                                Pt((z) => {
                                  const F = z.items.find(
                                    (Y) => Y.id === p.templateId
                                  );
                                  (F == null ? void 0 : F.recipe.kind) === "text" && (F.recipe.text = y, T > 0 && (F.height = Math.max(F.height, Math.ceil(T) + 4)));
                                });
                              },
                              onTextFocus: () => {
                                (!R.includes(p.id) || R.length > 1) && P([p.id]);
                              },
                              textEditing: A === p.id,
                              onTextEditStart: () => {
                                P([p.id]), B(p.id);
                              },
                              onIsolate: p.group && R.includes(p.id) && R.length > 1 ? () => P([p.id]) : void 0,
                              onTextEditEnd: () => {
                                var y;
                                B((T) => T === p.id ? null : T), (y = hr.current) == null || y.focus({ preventScroll: !0 });
                              }
                            },
                            p.id
                          )),
                          !mt && /* @__PURE__ */ b.jsx(
                            bg,
                            {
                              ref: J,
                              target: Ve.length === 1 ? Ve[0] : Ve,
                              zoom: 1 / dt,
                              origin: !1,
                              checkInput: !0,
                              passDragArea: !0,
                              draggable: !0,
                              resizable: !0,
                              useMutationObserver: !0,
                              useResizeObserver: !0,
                              keepRatio: Mt.shift,
                              throttleDragRotate: Mt.shift ? 45 : 0,
                              snappable: !Mt.meta,
                              snapThreshold: 6,
                              isDisplaySnapDigit: !1,
                              isDisplayInnerSnapDigit: !1,
                              snapDirections: nu,
                              elementSnapDirections: nu,
                              elementGuidelines: tt,
                              verticalGuidelines: ks.vertical,
                              horizontalGuidelines: ks.horizontal,
                              snapGridWidth: X ? ru : 0,
                              snapGridHeight: X ? ru : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              individualGroupable: sn,
                              container: sn ? G : void 0,
                              onDragStart: Mf,
                              onDrag: ws,
                              onDragEnd: (p) => {
                                const y = Es(p);
                                Zn(y, p.lastEvent, p.isDrag, () => Vn(y, !!p.datas.alt));
                              },
                              onDragGroupStart: (p) => {
                                var y;
                                p.datas.alt = !!((y = p.inputEvent) != null && y.altKey), Un([...p.targets ?? []], p.datas.alt ? Ss(p.targets ?? []) : void 0);
                              },
                              onDragGroup: (p) => p.events.forEach(ws),
                              onDragGroupEnd: (p) => Zn(p.targets, p.lastEvent, p.isDrag, () => Vn(p.targets, !!p.datas.alt)),
                              onResizeStart: (p) => {
                                var y;
                                Un([p.target]), (y = p.inputEvent) != null && y.altKey && p.setFixedDirection([0, 0]);
                              },
                              onResize: Ds,
                              onResizeEnd: (p) => Zn([p.target], p.lastEvent, p.isDrag, () => Vn([p.target], !1)),
                              onResizeGroupStart: (p) => {
                                var y;
                                Un([...p.targets ?? []]), (y = p.inputEvent) != null && y.altKey && p.events.forEach((T) => T.setFixedDirection([0, 0]));
                              },
                              onResizeGroup: (p) => p.events.forEach(Ds),
                              onResizeGroupEnd: (p) => Zn(p.targets, p.lastEvent, p.isDrag, () => Vn(p.targets, !1)),
                              onClick: (p) => {
                                var y, T;
                                if (Xn.current) {
                                  Xn.current = !1;
                                  return;
                                }
                                ((y = p.inputEvent) != null && y.shiftKey || sn) && ((T = ot.current) == null || T.clickTarget(p.inputEvent, p.inputTarget));
                              },
                              onClickGroup: (p) => {
                                var y;
                                (y = ot.current) == null || y.clickTarget(p.inputEvent, p.inputTarget);
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
  Rm as LayoutTab,
  wm as isBakedTitle
};
