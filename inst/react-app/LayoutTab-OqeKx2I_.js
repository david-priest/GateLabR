import { a as at, t as oa, w as Ic, s as Pc, z as es, x as rs, y as Ya, A as ns, B as Yi, E as Oc, G as fi, H as Zr, I as zc, f as Ac, J as Nc, K as Bc, L as jc, M as na, N as pl, O as Gc, P as oe, j as w, Q as Qr, R as wr, T as Fc, u as Ca, U as Lc, V as Wc, W as as, X as Yc, Y as Me, Z as Xc, S as is, _ as Xa, $ as Hc, a0 as qc, a1 as os, a2 as Vc, a3 as Gn, a4 as ss, a5 as $c, a6 as Uc, a7 as Kc, a8 as Zc, a9 as ls, aa as Jc, ab as Qc, ac as tf, ad as us, ae as ef, af as rf, ag as nf, ah as cs, ai as af, aj as of, ak as sf, l as fs, al as lf, am as uf, an as cf, ao as ff, ap as ds } from "./embed-B89EMwZT.js";
function Xi(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return !0;
  return !1;
}
function vl(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return t[n];
  return null;
}
function hl(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function Hi(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function df() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function pf(t, e) {
  var r = Hi("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return r ? r[3] : "";
}
function di(t) {
  return t.replace(/_/g, ".");
}
function tn(t, e) {
  var r = null, n = "-1";
  return Xi(t, function(a) {
    var i = Hi("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (r = a, n = i[3] || "-1", a.versionAlias ? n = a.versionAlias : a.versionTest && (n = pf(a.versionTest.toLowerCase(), e) || n), n = di(n), !0);
  }), {
    preset: r,
    version: n
  };
}
function Fn(t, e) {
  var r = {
    brand: "",
    version: "-1"
  };
  return Xi(t, function(n) {
    var a = gl(e, n);
    return a ? (r.brand = n.id, r.version = n.versionAlias || a.version, r.version !== "-1") : !1;
  }), r;
}
function gl(t, e) {
  return vl(t, function(r) {
    var n = r.brand;
    return Hi("" + e.test, n.toLowerCase());
  });
}
var ml = [{
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
}], xl = [{
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
}], pi = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], yl = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], bl = [{
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
function Sl(t) {
  return !!tn(yl, t).preset;
}
function vf(t) {
  var e = hl(t), r = !!/mobi/g.exec(e), n = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: Sl(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = tn(ml, e), o = i.preset, s = i.version, l = tn(bl, e), u = l.preset, c = l.version, f = tn(xl, e);
  if (n.chromium = !!f.preset, n.chromiumVersion = f.version, !n.chromium) {
    var d = tn(pi, e);
    n.webkit = !!d.preset, n.webkitVersion = d.version;
  }
  return u && (a.name = u.id, a.version = c, a.majorVersion = parseInt(c, 10)), o && (n.name = o.id, n.version = s, n.webview && a.name === "ios" && n.name !== "safari" && (n.webview = !1)), n.majorVersion = parseInt(n.version, 10), {
    browser: n,
    os: a,
    isMobile: r,
    isHints: !1
  };
}
function hf(t) {
  var e = navigator.userAgentData, r = (e.uaList || e.brands).slice(), n = e.mobile || !1, a = r[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!Fn(yl, r).brand || Sl(hl())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && Xi(pi, function(d) {
    return gl(r, d);
  });
  var l = Fn(xl, r);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var u = Fn(pi, r);
    o.webkit = !!u.brand, o.webkitVersion = u.version || "-1";
  }
  var c = vl(bl, function(d) {
    return new RegExp("" + d.test, "g").exec(i);
  });
  s.name = c ? c.id : "";
  {
    var f = Fn(ml, r);
    o.name = f.brand || o.name, o.version = f.brand && t ? t.uaFullVersion : f.version;
  }
  return o.webkit && (s.name = n ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = di(s.version), o.version = di(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: n,
    isHints: !0
  };
}
function gf(t) {
  return df() ? hf() : vf(t);
}
function mf(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  return e.map(function(n) {
    return n.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function xf(t, e) {
  return e.replace(/([^}{]*){/gm, function(r, n) {
    return n.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function Je(t, e) {
  return function(r) {
    r && (t[e] = r);
  };
}
function Cl(t, e, r) {
  return function(n) {
    n && (t[e][r] = n);
  };
}
function yf(t, e) {
  return function(r) {
    var n = r.prototype;
    t.forEach(function(a) {
      e(n, a);
    });
  };
}
function El(t, e) {
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
var bf = "function", Sf = "object", Cf = "string", Ef = "number", qi = "undefined", wl = typeof window !== qi, wf = typeof document !== qi && document, Df = [{
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
}], Kt = 1e-7, Ln = {
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
function _f() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function sa(t, e, r, n) {
  return (t * n + e * r) / (r + n);
}
function Vi(t) {
  return typeof t === qi;
}
function ve(t) {
  return t && typeof t === Sf;
}
function Xt(t) {
  return Array.isArray(t);
}
function we(t) {
  return typeof t === Cf;
}
function dn(t) {
  return typeof t === Ef;
}
function Ea(t) {
  return typeof t === bf;
}
function Mf(t, e) {
  var r = t === "" || t == " ", n = e === "" || e == " ";
  return n && r || t === e;
}
function Dl(t, e, r, n, a) {
  var i = $i(t, e, r);
  return i ? r : kf(t, e, r + 1, n, a);
}
function $i(t, e, r) {
  if (!t.ignore)
    return null;
  var n = e.slice(Math.max(r - 3, 0), r + 3).join("");
  return new RegExp(t.ignore).exec(n);
}
function kf(t, e, r, n, a) {
  for (var i = function(u) {
    var c = e[u].trim();
    if (c === t.close && !$i(t, e, u))
      return {
        value: u
      };
    var f = u, d = he(a, function(p) {
      var v = p.open;
      return v === c;
    });
    if (d && (f = Dl(d, e, u, n, a)), f === -1)
      return o = u, "break";
    u = f, o = u;
  }, o, s = r; s < n; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function Ui(t, e) {
  var r = we(e) ? {
    separator: e
  } : e, n = r.separator, a = n === void 0 ? "," : n, i = r.isSeparateFirst, o = r.isSeparateOnlyOpenClose, s = r.isSeparateOpenClose, l = s === void 0 ? o : s, u = r.openCloseCharacters, c = u === void 0 ? Df : u, f = c.map(function(_) {
    var M = _.open, T = _.close;
    return M === T ? M : M + "|" + T;
  }).join("|"), d = "(\\s*" + a + "\\s*|" + f + "|\\s+)", p = new RegExp(d, "g"), v = t.split(p).filter(function(_) {
    return _ && _ !== "undefined";
  }), m = v.length, x = [], y = [];
  function b() {
    return y.length ? (x.push(y.join("")), y = [], !0) : !1;
  }
  for (var E = function(_) {
    var M = v[_].trim(), T = _, k = he(c, function(I) {
      var N = I.open;
      return N === M;
    }), A = he(c, function(I) {
      var N = I.close;
      return N === M;
    });
    if (k) {
      if (T = Dl(k, v, _, m, c), T !== -1 && l)
        return b() && i || (x.push(v.slice(_, T + 1).join("")), _ = T, i) ? (C = _, "break") : (C = _, "continue");
    } else if (A && !$i(A, v, _)) {
      var O = _f(c);
      return O.splice(c.indexOf(A), 1), {
        value: Ui(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: O
        })
      };
    } else if (Mf(M, a) && !o)
      return b(), i ? (C = _, "break") : (C = _, "continue");
    T === -1 && (T = m - 1), y.push(v.slice(_, T + 1).join("")), _ = T, C = _;
  }, C, D = 0; D < m; ++D) {
    var h = E(D);
    if (D = C, typeof h == "object") return h.value;
    if (h === "break") break;
  }
  return y.length && x.push(y.join("")), x;
}
function Qe(t) {
  return Ui(t, "");
}
function fr(t) {
  return Ui(t, ",");
}
function _l(t) {
  var e = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(t);
  return !e || e.length < 4 ? {} : {
    prefix: e[1],
    value: e[2],
    suffix: e[3]
  };
}
function dr(t) {
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
function vi(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, r) {
    return r.toUpperCase();
  });
}
function Tf(t, e) {
  return t.replace(/([a-z])([A-Z])/g, function(r, n, a) {
    return "" + n + e + a.toLowerCase();
  });
}
function pn() {
  return Date.now ? Date.now() : (/* @__PURE__ */ new Date()).getTime();
}
function Xe(t, e, r) {
  r === void 0 && (r = -1);
  for (var n = t.length, a = 0; a < n; ++a)
    if (e(t[a], a, t))
      return a;
  return r;
}
function he(t, e, r) {
  var n = Xe(t, e);
  return n > -1 ? t[n] : r;
}
var Ml = /* @__PURE__ */ (function() {
  var t = pn(), e = wl && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(r) {
    var n = pn(), a = setTimeout(function() {
      r(n - t);
    }, 1e3 / 60);
    return a;
  };
})(), Rf = /* @__PURE__ */ (function() {
  var t = wl && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function Fr(t) {
  return Object.keys(t);
}
function It(t, e) {
  var r = dr(t), n = r.value, a = r.unit;
  if (ve(e)) {
    var i = e[a];
    if (i) {
      if (Ea(i))
        return i(n);
      if (Ln[a])
        return Ln[a](n, i);
    }
  } else if (a === "%")
    return n * e / 100;
  return Ln[a] ? Ln[a](n) : n;
}
function la(t, e, r) {
  return Math.max(e, Math.min(t, r));
}
function ps(t, e, r, n) {
  return n === void 0 && (n = t[0] / t[1]), [[mt(e[0], Kt), mt(e[0] / n, Kt)], [mt(e[1] * n, Kt), mt(e[1], Kt)]].filter(function(a) {
    return a.every(function(i, o) {
      var s = e[o], l = mt(s, Kt);
      return r ? i <= s || i <= l : i >= s || i >= l;
    });
  })[0] || t;
}
function Ki(t, e, r, n) {
  if (!n)
    return t.map(function(p, v) {
      return la(p, e[v], r[v]);
    });
  var a = t[0], i = t[1], o = n === !0 ? a / i : n, s = ps(t, e, !1, o), l = s[0], u = s[1], c = ps(t, r, !0, o), f = c[0], d = c[1];
  return a < l || i < u ? (a = l, i = u) : (a > f || i > d) && (a = f, i = d), [a, i];
}
function If(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return r;
}
function hi(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return e ? r / e : 0;
}
function Ht(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function Pf(t) {
  return [0, 1].map(function(e) {
    return hi(t.map(function(r) {
      return r[e];
    }));
  });
}
function vs(t) {
  var e = Pf(t), r = Ht(e, t[0]), n = Ht(e, t[1]);
  return r < n && n - r < Math.PI || r > n && n - r < -Math.PI ? 1 : -1;
}
function Ne(t, e) {
  return Math.sqrt(Math.pow((e ? e[0] : 0) - t[0], 2) + Math.pow((e ? e[1] : 0) - t[1], 2));
}
function mt(t, e) {
  if (!e)
    return t;
  var r = 1 / e;
  return Math.round(t / e) / r;
}
function hs(t, e) {
  return t.forEach(function(r, n) {
    t[n] = mt(t[n], e);
  }), t;
}
function Of(t) {
  for (var e = [], r = 0; r < t; ++r)
    e.push(r);
  return e;
}
function zf(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function Zt(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function Zi(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function kl(t, e) {
  if (t.classList)
    t.classList.remove(e);
  else {
    var r = new RegExp("(\\s|^)" + e + "(\\s|$)");
    t.className = t.className.replace(r, " ");
  }
}
function Ut(t, e, r, n) {
  t.addEventListener(e, r, n);
}
function Yt(t, e, r, n) {
  t.removeEventListener(e, r, n);
}
function Te(t) {
  return (t == null ? void 0 : t.ownerDocument) || wf;
}
function Ji(t) {
  return Te(t).documentElement;
}
function rr(t) {
  return Te(t).body;
}
function Ce(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function Tl(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function vn(t) {
  return ve(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function Af(t, e, r, n, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = r + o * a, l = n + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function Nf(t, e, r, n, a) {
  for (var i = 0; i < a; ++i) {
    var o = r + i * a, s = n + i * a, l = t[o], u = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = u;
  }
}
function Bf(t, e, r, n, a) {
  for (var i = 0; i < n; ++i) {
    var o = r + i * n;
    t[o] /= a, e[o] /= a;
  }
}
function Rl(t, e, r) {
  for (var n = t.slice(), a = 0; a < r; ++a)
    n[a * r + e - 1] = 0, n[(e - 1) * r + a] = 0;
  return n[(e - 1) * (r + 1)] = 1, n;
}
function Ie(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = t.slice(), n = zt(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!mt(r[i], Kt)) {
      for (var o = a + 1; o < e; ++o)
        if (r[e * a + o]) {
          Nf(r, n, a, o, e);
          break;
        }
    }
    if (!mt(r[i], Kt))
      return [];
    Bf(r, n, a, e, r[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, u = r[l];
      !mt(u, Kt) || a === o || Af(r, n, s, a, e, -u);
    }
  }
  return n;
}
function jf(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = 0; n < e; ++n)
    for (var a = 0; a < e; ++a)
      r[a * e + n] = t[e * n + a];
  return r;
}
function Il(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = t[e * e - 1], a = 0; a < e - 1; ++a)
    r[a] = t[e * (e - 1) + a] / n;
  return r[e - 1] = 0, r;
}
function Gf(t, e) {
  for (var r = zt(e), n = 0; n < e - 1; ++n)
    r[e * (e - 1) + n] = t[n] || 0;
  return r;
}
function pr(t, e) {
  for (var r = t.slice(), n = t.length; n < e - 1; ++n)
    r[n] = 0;
  return r[e - 1] = 1, r;
}
function Pe(t, e, r) {
  if (e === void 0 && (e = Math.sqrt(t.length)), e === r)
    return t;
  for (var n = zt(r), a = Math.min(e, r), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      n[i * r + o] = t[i * e + o];
    n[(i + 1) * r - 1] = t[(i + 1) * e - 1], n[(r - 1) * r + i] = t[(e - 1) * e + i];
  }
  return n[r * r - 1] = t[e * e - 1], n;
}
function ua(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  var n = zt(t);
  return e.forEach(function(a) {
    n = Pt(n, a, t);
  }), n;
}
function Pt(t, e, r) {
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
function Dt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] + e[a];
  return n;
}
function pt(t, e) {
  for (var r = Math.min(t.length, e.length), n = t.slice(), a = 0; a < r; ++a)
    n[a] = n[a] - e[a];
  return n;
}
function Ff(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function Pl(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function ae(t, e, r) {
  r === void 0 && (r = e.length);
  var n = Pt(t, e, r), a = n[r - 1];
  return n.map(function(i) {
    return i / a;
  });
}
function Lf(t, e) {
  return Pt(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function Wf(t, e) {
  return Pt(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function Yf(t, e) {
  return Pt(t, xn(e, 4));
}
function Wn(t, e) {
  var r = e[0], n = r === void 0 ? 1 : r, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return Pt(t, [n, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function mn(t, e) {
  return ae(xn(e, 3), pr(t, 3));
}
function Ha(t, e) {
  var r = e[0], n = r === void 0 ? 0 : r, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return Pt(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, n, i, s, 1], 4);
}
function gi(t, e) {
  return Pt(t, e, 4);
}
function xn(t, e) {
  var r = Math.cos(t), n = Math.sin(t), a = zt(e);
  return a[0] = r, a[1] = n, a[e] = -n, a[e + 1] = r, a;
}
function zt(t) {
  for (var e = t * t, r = [], n = 0; n < e; ++n)
    r[n] = n % (t + 1) ? 0 : 1;
  return r;
}
function Qi(t, e) {
  for (var r = zt(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[(e + 1) * a] = t[a];
  return r;
}
function vr(t, e) {
  for (var r = zt(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[e * (e - 1) + a] = t[a];
  return r;
}
function to(t, e, r, n, a, i, o, s) {
  var l = t[0], u = t[1], c = e[0], f = e[1], d = r[0], p = r[1], v = n[0], m = n[1], x = a[0], y = a[1], b = i[0], E = i[1], C = o[0], D = o[1], h = s[0], _ = s[1], M = [l, 0, c, 0, d, 0, v, 0, u, 0, f, 0, p, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, c, 0, d, 0, v, 0, u, 0, f, 0, p, 0, m, 0, 1, 0, 1, 0, 1, 0, 1, -x * l, -y * l, -b * c, -E * c, -C * d, -D * d, -h * v, -_ * v, -x * u, -y * u, -b * f, -E * f, -C * p, -D * p, -h * m, -_ * m], T = Ie(M, 8);
  if (!T.length)
    return [];
  var k = Pt(T, [x, y, b, E, C, D, h, _], 8);
  return k[8] = 1, Pe(jf(k), 3, 4);
}
var nn = function() {
  return nn = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, nn.apply(this, arguments);
};
function eo() {
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
function Or(t, e) {
  return e === void 0 && (e = 0), Er(zr(t, e));
}
function aa(t, e) {
  var r = ae(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), n = r[3] || 1;
  return [
    r[0] / n,
    r[1] / n,
    r[2] / n
  ];
}
function Xf(t, e) {
  e === void 0 && (e = document.body);
  for (var r = t, n = eo(); r; ) {
    var a = getComputedStyle(r).transform;
    if (n = gi(Or(a), n), r === e)
      break;
    r = r.parentElement;
  }
  return n = Ie(n, 4), n[12] = 0, n[13] = 0, n[14] = 0, n;
}
function Er(t) {
  var e = eo();
  return t.forEach(function(r) {
    var n = r.matrixFunction, a = r.functionValue;
    n && (e = n(e, a));
  }), e;
}
function zr(t, e) {
  e === void 0 && (e = 0);
  var r = Xt(t) ? t : Qe(t);
  return r.map(function(n) {
    var a = _l(n), i = a.prefix, o = a.value, s = null, l = i, u = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var c = ve(e) ? nn(nn({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, f = fr(o).map(function(I, N) {
        return N === 0 && "x%" in c ? c["%"] = e["x%"] : N === 1 && "y%" in c ? c["%"] = e["y%"] : c["%"] = e["o%"], It(I, c);
      }), d = f[0], p = f[1], v = p === void 0 ? 0 : p, m = f[2], x = m === void 0 ? 0 : m;
      s = Ha, u = [d, v, x];
    } else if (i === "translateY") {
      var y = ve(e) ? nn({ "%": e["y%"] }, e) : {
        "%": e
      }, v = It(o, y);
      s = Ha, u = [0, v, 0];
    } else if (i === "translateZ") {
      var x = parseFloat(o);
      s = Ha, u = [0, 0, x];
    } else if (i === "scale" || i === "scale3d") {
      var b = fr(o).map(function(I) {
        return parseFloat(I);
      }), E = b[0], C = b[1], D = C === void 0 ? E : C, h = b[2], _ = h === void 0 ? 1 : h;
      s = Wn, u = [E, D, _];
    } else if (i === "scaleX") {
      var E = parseFloat(o);
      s = Wn, u = [E, 1, 1];
    } else if (i === "scaleY") {
      var D = parseFloat(o);
      s = Wn, u = [1, D, 1];
    } else if (i === "scaleZ") {
      var _ = parseFloat(o);
      s = Wn, u = [1, 1, _];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var M = dr(o), T = M.unit, k = M.value, A = T === "rad" ? k : k * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = Yf) : i === "rotateX" ? s = Lf : i === "rotateY" && (s = Wf), u = A;
    } else if (i === "matrix3d")
      s = gi, u = fr(o).map(function(I) {
        return parseFloat(I);
      });
    else if (i === "matrix") {
      var O = fr(o).map(function(I) {
        return parseFloat(I);
      });
      s = gi, u = [
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
var Hf = /* @__PURE__ */ (function() {
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
})(), qf = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(r) {
    return this.object[r];
  }, e.set = function(r, n) {
    this.object[r] = n;
  }, t;
})(), Vf = typeof Map == "function", $f = /* @__PURE__ */ (function() {
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
function Uf(t, e) {
  var r = [], n = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new $f();
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
var Kf = /* @__PURE__ */ (function() {
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
    var r = Uf(this.changedBeforeAdded, this.fixed), n = this.changed, a = [];
    this.cacheOrdered = r.filter(function(i, o) {
      var s = i[0], l = i[1], u = n[o], c = u[0], f = u[1];
      if (s !== l)
        return a.push([c, f]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function ro(t, e, r) {
  var n = Vf ? Map : r ? qf : Hf, a = r || function(b) {
    return b;
  }, i = [], o = [], s = [], l = t.map(a), u = e.map(a), c = new n(), f = new n(), d = [], p = [], v = {}, m = [], x = 0, y = 0;
  return l.forEach(function(b, E) {
    c.set(b, E);
  }), u.forEach(function(b, E) {
    f.set(b, E);
  }), l.forEach(function(b, E) {
    var C = f.get(b);
    typeof C > "u" ? (++y, o.push(E)) : v[C] = y;
  }), u.forEach(function(b, E) {
    var C = c.get(b);
    typeof C > "u" ? (i.push(E), ++x) : (s.push([C, E]), y = v[E] || 0, d.push([C - y, E - x]), p.push(E === C), C !== E && m.push([C, E]));
  }), o.reverse(), new Kf(t, e, i, o, m, s, d, p);
}
var Zf = /* @__PURE__ */ (function() {
  function t(r, n) {
    r === void 0 && (r = []), this.findKeyCallback = n, this.list = [].slice.call(r);
  }
  var e = t.prototype;
  return e.update = function(r) {
    var n = [].slice.call(r), a = ro(this.list, n, this.findKeyCallback);
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
var mi = function(t, e) {
  return mi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, mi(t, e);
};
function Jf(t, e) {
  mi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Ol = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), zl = /* @__PURE__ */ (function(t) {
  Jf(e, t);
  function e(r) {
    return r === void 0 && (r = []), t.call(this, r, Ol) || this;
  }
  return e;
})(Zf);
function Dr(t, e) {
  return ro(t, e, Ol);
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
var xi = function() {
  return xi = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, xi.apply(this, arguments);
};
function Qf() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
var yn = /* @__PURE__ */ (function() {
  function t() {
    this._events = {};
  }
  var e = t.prototype;
  return e.on = function(r, n) {
    if (ve(r))
      for (var a in r)
        this.on(a, r[a]);
    else
      this._addEvent(r, n, {});
    return this;
  }, e.off = function(r, n) {
    if (!r)
      this._events = {};
    else if (ve(r))
      for (var a in r)
        this.off(a);
    else if (!n)
      this._events[r] = [];
    else {
      var i = this._events[r];
      if (i) {
        var o = Xe(i, function(s) {
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
    }, n.currentTarget = this, Qf(i).forEach(function(s) {
      s.listener(n), s.once && a.off(r, s.listener);
    }), !o;
  }, e.trigger = function(r, n) {
    return n === void 0 && (n = {}), this.emit(r, n);
  }, e._addEvent = function(r, n, a) {
    var i = this._events;
    i[r] = i[r] || [];
    var o = i[r];
    o.push(xi({
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
var yi = function(t, e) {
  return yi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, yi(t, e);
};
function td(t, e) {
  yi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var _r = function() {
  return _r = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, _r.apply(this, arguments);
};
function ed(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function gs(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function Yn(t) {
  if (t) {
    if (we(t))
      return document.querySelector(t);
  } else return null;
  if (Ea(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var Al = /* @__PURE__ */ (function(t) {
  td(e, t);
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
    var i = Yn(a.container);
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
      return c.top > o - l ? (f[1] > c.top || o < f[1]) && (d[1] = -1) : c.top + c.height < o + l && (f[1] < c.top + c.height || o > f[1]) && (d[1] = 1), c.left > i - l ? (f[0] > c.left || i < f[0]) && (d[0] = -1) : c.left + c.width < i + l && (f[0] < c.left + c.width || i > f[0]) && (d[0] = 1), !d[0] && !d[1] ? !1 : this._continueDrag(_r(_r({}, a), {
        direction: d,
        inputEvent: n,
        isDrag: !0
      }));
    }
  }, r.checkScroll = function(n) {
    var a = this;
    if (this._isWait)
      return !1;
    var i = n.prevScrollPos, o = i === void 0 ? this._prevScrollPos : i, s = n.direction, l = n.throttleTime, u = l === void 0 ? 0 : l, c = n.inputEvent, f = n.isDrag, d = this._getScrollPosition(s || [0, 0], n), p = d[0] - o[0], v = d[1] - o[1], m = s || [p ? Math.abs(p) / p : 0, v ? Math.abs(v) / v : 0];
    return this._prevScrollPos = d, this._lock = !1, !p && !v ? !1 : (this.emit("move", {
      offsetX: m[0] ? p : 0,
      offsetY: m[1] ? v : 0,
      inputEvent: c
    }), u && f && (clearTimeout(this._timer), this._timer = window.setTimeout(function() {
      a._continueDrag(n);
    }, u)), !0);
  }, r.dragEnd = function() {
    this._flag = !1, this._lock = !1, clearTimeout(this._timer), this._unregisterScrollEvent();
  }, r._getScrollPosition = function(n, a) {
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? ed : o;
    return s({
      container: Yn(i),
      direction: n
    });
  }, r._continueDrag = function(n) {
    var a = this, i, o = n.container, s = n.direction, l = n.throttleTime, u = n.useScroll, c = n.isDrag, f = n.inputEvent;
    if (!(!this._flag || c && this._isWait)) {
      var d = pn(), p = Math.max(l + this._prevTime - d, 0);
      if (p > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(n);
        }, p), !1;
      this._prevTime = d;
      var v = this._getScrollPosition(s, n);
      this._prevScrollPos = v, c && (this._isWait = !0), u || (this._lock = !0);
      var m = {
        container: Yn(o),
        direction: s,
        inputEvent: f
      };
      return (i = n.requestScroll) === null || i === void 0 || i.call(n, m), this.emit("scroll", m), this._isWait = !1, u || this.checkScroll(_r(_r({}, n), {
        prevScrollPos: v,
        direction: s,
        inputEvent: f
      }));
    }
  }, r._registerScrollEvent = function(n) {
    this._unregisterScrollEvent();
    var a = n.checkScrollEvent;
    if (a) {
      var i = a === !0 ? gs : a, o = Yn(n.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = gs(window, this._onScroll) : this._unregister = i(o, this._onScroll);
    }
  }, r._unregisterScrollEvent = function() {
    var n;
    (n = this._unregister) === null || n === void 0 || n.call(this), this._unregister = null;
  }, e;
})(yn);
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
function rd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function de(t) {
  return mt(t, Kt);
}
function nd(t, e) {
  return t.every(function(r, n) {
    return de(r - e[n]) === 0;
  });
}
function ad(t, e) {
  return !de(t[0] - e[0]) && !de(t[1] - e[1]);
}
function an(t) {
  return t.length < 3 ? 0 : Math.abs(If(t.map(function(e, r) {
    var n = t[r + 1] || t[0];
    return e[0] * n[1] - n[0] * e[1];
  }))) / 2;
}
function bi(t, e) {
  var r = e.width, n = e.height, a = e.left, i = e.top, o = hr(t), s = o.minX, l = o.minY, u = o.maxX, c = o.maxY, f = r / (u - s), d = n / (c - l);
  return t.map(function(p) {
    return [a + (p[0] - s) * f, i + (p[1] - l) * d];
  });
}
function hr(t) {
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
function ca(t, e, r) {
  var n = t[0], a = t[1], i = hr(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], u = fa(l[0], l[1]), c = Si(e), f = [];
  if (c.forEach(function(v) {
    var m = fa(v[0], v[1]), x = v[0];
    if (nd(u, m))
      f.push({
        pos: t,
        line: v,
        type: "line"
      });
    else {
      var y = Nl(no(u, m), [l, v]);
      y.forEach(function(b) {
        v.some(function(E) {
          return ad(E, b);
        }) ? f.push({
          pos: b,
          line: v,
          type: "point"
        }) : de(x[1] - a) !== 0 && f.push({
          pos: b,
          line: v,
          type: "intersection"
        });
      });
    }
  }), he(f, function(v) {
    return v[0] === n;
  }))
    return !0;
  var d = 0, p = {};
  return f.forEach(function(v) {
    var m = v.pos, x = v.type, y = v.line;
    if (!(m[0] > n))
      if (x === "intersection")
        ++d;
      else {
        if (x === "line")
          return;
        if (x === "point") {
          var b = he(y, function(D) {
            return D[1] !== a;
          }), E = p[m[0]], C = b[1] > a ? 1 : -1;
          E ? E !== C && ++d : p[m[0]] = C;
        }
      }
  }), d % 2 === 1;
}
function fa(t, e) {
  var r = t[0], n = t[1], a = e[0], i = e[1], o = a - r, s = i - n;
  Math.abs(o) < Kt && (o = 0), Math.abs(s) < Kt && (s = 0);
  var l = 0, u = 0, c = 0;
  return o ? s ? (l = -s / o, u = 1, c = -l * r - n) : (u = 1, c = -n) : s && (l = -1, c = r), [l, u, c];
}
function no(t, e) {
  var r = t[0], n = t[1], a = t[2], i = e[0], o = e[1], s = e[2], l = r === 0 && i === 0, u = n === 0 && o === 0, c = [];
  if (l && u)
    return [];
  if (l) {
    var f = -a / n, d = -s / o;
    return f !== d ? [] : [[-1 / 0, f], [1 / 0, f]];
  } else if (u) {
    var p = -a / r, v = -s / i;
    return p !== v ? [] : [[p, -1 / 0], [p, 1 / 0]];
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
function Nl(t, e) {
  var r = e.map(function(f) {
    return [0, 1].map(function(d) {
      return [Math.min(f[0][d], f[1][d]), Math.max(f[0][d], f[1][d])];
    });
  }), n = [];
  if (t.length === 2) {
    var a = t[0], i = a[0], o = a[1];
    if (de(i - t[1][0])) {
      if (!de(o - t[1][1])) {
        var u = Math.max.apply(Math, r.map(function(f) {
          return f[0][0];
        })), c = Math.min.apply(Math, r.map(function(f) {
          return f[0][1];
        }));
        if (de(u - c) > 0)
          return [];
        n = [[u, o], [c, o]];
      }
    } else {
      var s = Math.max.apply(Math, r.map(function(f) {
        return f[1][0];
      })), l = Math.min.apply(Math, r.map(function(f) {
        return f[1][1];
      }));
      if (de(s - l) > 0)
        return [];
      n = [[i, s], [i, l]];
    }
  }
  return n.length || (n = t.filter(function(f) {
    var d = f[0], p = f[1];
    return r.every(function(v) {
      return 0 <= de(d - v[0][0]) && 0 <= de(v[0][1] - d) && 0 <= de(p - v[1][0]) && 0 <= de(v[1][1] - p);
    });
  })), n.map(function(f) {
    return [de(f[0]), de(f[1])];
  });
}
function Si(t) {
  return rd(t.slice(1), [t[0]]).map(function(e, r) {
    return [t[r], e];
  });
}
function id(t, e) {
  var r = t.slice(), n = e.slice();
  vs(r) === -1 && r.reverse(), vs(n) === -1 && n.reverse();
  var a = Si(r), i = Si(n), o = a.map(function(c) {
    return fa(c[0], c[1]);
  }), s = i.map(function(c) {
    return fa(c[0], c[1]);
  }), l = [];
  o.forEach(function(c, f) {
    var d = a[f], p = [];
    s.forEach(function(v, m) {
      var x = no(c, v), y = Nl(x, [d, i[m]]);
      p.push.apply(p, y.map(function(b) {
        return {
          index1: f,
          index2: m,
          pos: b,
          type: "intersection"
        };
      }));
    }), p.sort(function(v, m) {
      return Ne(d[0], v.pos) - Ne(d[0], m.pos);
    }), l.push.apply(l, p), ca(d[1], n) && l.push({
      index1: f,
      index2: -1,
      pos: d[1],
      type: "inside"
    });
  }), i.forEach(function(c, f) {
    if (ca(c[1], r)) {
      var d = !1, p = Xe(l, function(v) {
        var m = v.index2;
        return m === f ? (d = !0, !1) : !!d;
      });
      p === -1 && (d = !1, p = Xe(l, function(v) {
        var m = v.index1, x = v.index2;
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
function Ci(t, e) {
  var r = id(t, e);
  return r.map(function(n) {
    var a = n.pos;
    return a;
  });
}
function od(t, e) {
  var r = Ci(t, e);
  return an(r);
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
var Ei = function(t, e) {
  return Ei = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Ei(t, e);
};
function sd(t, e) {
  Ei(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Vt = function() {
  return Vt = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Vt.apply(this, arguments);
};
function ld(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function qa(t) {
  return ld([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function ud(t) {
  return t.touches && t.touches.length >= 2;
}
function Xn(t) {
  return t ? t.touches ? fd(t.touches) : [Bl(t)] : [];
}
function cd(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function ms(t, e, r) {
  var n = r.length, a = on(t, n), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, u = on(e, n), c = u.clientX, f = u.clientY, d = on(r, n), p = d.clientX, v = d.clientY, m = i - c, x = o - f, y = i - p, b = o - v;
  return {
    clientX: s,
    clientY: l,
    deltaX: m,
    deltaY: x,
    distX: y,
    distY: b
  };
}
function Va(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function fd(t) {
  for (var e = Math.min(t.length, 2), r = [], n = 0; n < e; ++n)
    r.push(Bl(t[n]));
  return r;
}
function Bl(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY
  };
}
function on(t, e) {
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
var $a = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), qa(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), qa(e) - qa(this.startClients);
  }, t.prototype.getPosition = function(e, r) {
    e === void 0 && (e = this.prevClients);
    var n = ms(e || this.prevClients, this.prevClients, this.startClients), a = n.deltaX, i = n.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, n;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var r = this.prevClients, n = this.startClients, a = Math.min(this.length, r.length), i = [], o = 0; o < a; ++o)
      i[o] = ms([e[o]], [r[o]], [n[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var r = this.movement;
    if (!e)
      return r;
    var n = on(e, this.length), a = on(this.prevClients, this.length), i = n.clientX - a.clientX, o = n.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + r;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), Va(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), Va(e) / Va(this.startClients);
  }, t.prototype.move = function(e, r) {
    this.startClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    }), this.prevClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    });
  }, t;
})(), xs = ["textarea", "input"], jl = /* @__PURE__ */ (function(t) {
  sd(e, t);
  function e(r, n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(d, p) {
      if (p === void 0 && (p = !0), !(!a.flag && d.cancelable === !1)) {
        var v = d.type.indexOf("drag") >= -1;
        if (!(a.flag && v)) {
          a._isDragAPI = !0;
          var m = a.options, x = m.container, y = m.pinchOutside, b = m.preventWheelClick, E = m.preventRightClick, C = m.preventDefault, D = m.checkInput, h = m.dragFocusedInput, _ = m.preventClickEventOnDragStart, M = m.preventClickEventOnDrag, T = m.preventClickEventByCondition, k = a._useTouch, A = !a.flag;
          if (a._isSecondaryButton = d.which === 3 || d.button === 2, b && (d.which === 2 || d.button === 1) || E && (d.which === 3 || d.button === 2))
            return a.stop(), !1;
          if (A) {
            var O = a._window.document.activeElement, I = d.target;
            if (I) {
              var N = I.tagName.toLowerCase(), B = xs.indexOf(N) > -1, W = I.isContentEditable;
              if (B || W) {
                if (D || !h && O === I)
                  return !1;
                if (O && (O === I || W && O.isContentEditable && O.contains(I)))
                  if (h)
                    I.blur();
                  else
                    return !1;
              } else if ((C || d.type === "touchstart") && O) {
                var H = O.tagName.toLowerCase();
                (O.isContentEditable || xs.indexOf(H) > -1) && O.blur();
              }
              (_ || M || T) && Ut(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new $a(Xn(d))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = p, a._dragFlag = !0, a._prevInputEvent = d, a.data = {}, a.doubleFlag = pn() - a.prevTime < 200, a._isMouseEvent = cd(d), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var L = a._preventMouseEvent || a.emit("dragStart", Vt(Vt({ data: a.data, datas: a.data, inputEvent: d, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: p, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
              d.preventDefault();
            }, preventDrag: function() {
              a._dragFlag = !1;
            } }));
            L === !1 && a.stop(), a._isMouseEvent && a.flag && C && d.preventDefault();
          }
          if (!a.flag)
            return !1;
          var X = 0;
          if (A ? (a._attchDragEvent(), k && y && (X = setTimeout(function() {
            Ut(x, "touchstart", a.onDragStart, {
              passive: !1
            });
          }))) : k && y && Yt(x, "touchstart", a.onDragStart), a.flag && ud(d)) {
            if (clearTimeout(X), A && d.touches.length !== d.changedTouches.length)
              return;
            a.pinchFlag || a.onPinchStart(d);
          }
        }
      }
    }, a.onDrag = function(d, p) {
      if (a.flag) {
        var v = a.options.preventDefault;
        !a._isMouseEvent && v && d.preventDefault(), a._prevInputEvent = d;
        var m = Xn(d), x = a.moveClients(m, d, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || x.deltaX || x.deltaY) {
            var y = a._preventMouseEvent || a.emit("drag", Vt(Vt({}, x), { isScroll: !!p, inputEvent: d }));
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
        var p = a.options, v = p.pinchOutside, m = p.container, x = p.preventClickEventOnDrag, y = p.preventClickEventOnDragStart, b = p.preventClickEventByCondition, E = a.isDrag;
        (x || y || b) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !b && !y && x && !E && a._allowClickEvent(), a._useTouch && v && Yt(m, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(d);
        var C = d != null && d.touches ? Xn(d) : [], D = C.length;
        D === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new $a(C));
        var h = a._getPosition(), _ = pn(), M = !E && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = E || M ? 0 : _, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", Vt({ data: a.data, datas: a.data, isDouble: M, isDrag: E, isClick: !E, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: d, isTrusted: a._isTrusted }, h)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
          a._preventMouseEvent = !1;
        }, 200)), a._isIdle = !0);
      }
    }, a.onBlur = function() {
      a.onDragEnd();
    }, a._allowClickEvent = function() {
      Yt(a._window, "click", a._onClick, !0);
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
    a._window = Tl(o) ? o : Ce(o), a.options = Vt({ checkInput: !1, container: o && !("document" in o) ? Ce(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, n);
    var s = a.options, l = s.container, u = s.events, c = s.checkWindowBlur;
    if (a._useDrag = u.indexOf("drag") > -1, a._useTouch = u.indexOf("touch") > -1, a._useMouse = u.indexOf("mouse") > -1, a.targets = i, a._useDrag && i.forEach(function(d) {
      Ut(d, "dragstart", a.onDragStart);
    }), a._useMouse && (i.forEach(function(d) {
      Ut(d, "mousedown", a.onDragStart), Ut(d, "mousemove", a._passCallback);
    }), Ut(l, "contextmenu", a._onContextMenu)), c && Ut(Ce(), "blur", a.onBlur), a._useTouch) {
      var f = {
        passive: !1
      };
      i.forEach(function(d) {
        Ut(d, "touchstart", a.onDragStart, f), Ut(d, "touchmove", a._passCallback, f);
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
    return r === void 0 && (r = this._prevInputEvent), Vt(Vt({ data: this.data, datas: this.data }, this._getPosition()), { movement: this.getMovement(), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, inputEvent: r });
  }, e.prototype.getEventData = function() {
    return this.data;
  }, e.prototype.getEventDatas = function() {
    return this.data;
  }, e.prototype.unset = function() {
    var r = this, n = this.targets, a = this.options.container;
    this.off(), Yt(this._window, "blur", this.onBlur), this._useDrag && n.forEach(function(i) {
      Yt(i, "dragstart", r.onDragStart);
    }), this._useMouse && (n.forEach(function(i) {
      Yt(i, "mousedown", r.onDragStart);
    }), Yt(a, "contextmenu", this._onContextMenu)), this._useTouch && (n.forEach(function(i) {
      Yt(i, "touchstart", r.onDragStart);
    }), Yt(a, "touchstart", this.onDragStart)), this._prevInputEvent = null, this._allowClickEvent(), this._dettachDragEvent();
  }, e.prototype.onPinchStart = function(r) {
    var n = this, a = this.options.pinchThreshold;
    if (!(this.isDrag && this.getMovement() > a)) {
      var i = new $a(Xn(r));
      this.pinchFlag = !0, this._addStore(i);
      var o = this.emit("pinchStart", Vt(Vt({ data: this.data, datas: this.data, angle: i.getAngle(), touches: this.getCurrentStore().getPositions() }, i.getPosition()), { inputEvent: r, isTrusted: this._isTrusted, preventDefault: function() {
        r.preventDefault();
      }, preventDrag: function() {
        n._dragFlag = !1;
      } }));
      o === !1 && (this.pinchFlag = !1);
    }
  }, e.prototype.onPinch = function(r, n) {
    if (!(!this.flag || !this.pinchFlag || n.length < 2)) {
      var a = this.getCurrentStore();
      this.isPinch = !0, this.emit("pinch", Vt(Vt({ data: this.data, datas: this.data, movement: this.getMovement(n), angle: a.getAngle(n), rotation: a.getRotation(n), touches: a.getPositions(n), scale: a.getScale(n), distance: a.getDistance(n) }, a.getPosition(n)), { inputEvent: r, isTrusted: this._isTrusted }));
    }
  }, e.prototype.onPinchEnd = function(r) {
    if (this.pinchFlag) {
      var n = this.isPinch;
      this.isPinch = !1, this.pinchFlag = !1;
      var a = this.getCurrentStore();
      this.emit("pinchEnd", Vt(Vt({ data: this.data, datas: this.data, isPinch: n, touches: a.getPositions() }, a.getPosition()), { inputEvent: r }));
    }
  }, e.prototype.getCurrentStore = function() {
    return this.clientStores[0];
  }, e.prototype.moveClients = function(r, n, a) {
    var i = this._getPosition(r, a), o = this.isDrag;
    (i.deltaX || i.deltaY) && (this.isDrag = !0);
    var s = !1;
    return !o && this.isDrag && (s = !0), Vt(Vt({ data: this.data, datas: this.data }, i), { movement: this.getMovement(r), isDrag: this.isDrag, isPinch: this.isPinch, isScroll: !1, isMouseEvent: this._isMouseEvent, isSecondaryButton: this._isSecondaryButton, inputEvent: n, isTrusted: this._isTrusted, isFirstDrag: s });
  }, e.prototype._addStore = function(r) {
    this.clientStores.splice(0, 0, r);
  }, e.prototype._getPosition = function(r, n) {
    var a = this.getCurrentStore(), i = a.getPosition(r, n), o = this.clientStores.slice(1).reduce(function(u, c) {
      var f = c.getPosition();
      return u.distX += f.distX, u.distY += f.distY, u;
    }, i), s = o.distX, l = o.distY;
    return Vt(Vt({}, i), { distX: s, distY: l });
  }, e.prototype._attchDragEvent = function() {
    var r = this._window, n = this.options.container, a = {
      passive: !1
    };
    this._isDragAPI && (Ut(n, "dragover", this.onDrag, a), Ut(r, "dragend", this.onDragEnd)), this._useMouse && (Ut(n, "mousemove", this.onDrag), Ut(r, "mouseup", this.onDragEnd)), this._useTouch && (Ut(n, "touchmove", this.onDrag, a), Ut(r, "touchend", this.onDragEnd, a), Ut(r, "touchcancel", this.onDragEnd, a));
  }, e.prototype._dettachDragEvent = function() {
    var r = this._window, n = this.options.container;
    this._isDragAPI && (Yt(n, "dragover", this.onDrag), Yt(r, "dragend", this.onDragEnd)), this._useMouse && (Yt(n, "mousemove", this.onDrag), Yt(r, "mouseup", this.onDragEnd)), this._useTouch && (Yt(n, "touchstart", this.onDragStart), Yt(n, "touchmove", this.onDrag), Yt(r, "touchend", this.onDragEnd), Yt(r, "touchcancel", this.onDragEnd));
  }, e.prototype._allowMouseEvent = function() {
    this._preventMouseEvent = !1, clearTimeout(this._preventMouseEventId);
  }, e;
})(yn);
function dd(t) {
  for (var e = 5381, r = t.length; r; )
    e = e * 33 ^ t.charCodeAt(--r);
  return e >>> 0;
}
var pd = dd;
function vd(t) {
  return pd(t).toString(36);
}
function hd(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function gd(t, e, r) {
  return r.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(n, a) {
    var i = a.trim();
    return (i ? fr(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function md(t, e, r, n, a) {
  var i = Te(n), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), r.nonce && o.setAttribute("nonce", r.nonce), o.innerHTML = gd(t, e, r), (a || i.head || i.body).appendChild(o), o;
}
function Gl(t) {
  var e = "rCS" + vd(t);
  return {
    className: e,
    inject: function(r, n) {
      n === void 0 && (n = {});
      var a = hd(r), i = (a || r.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = md(e, t, n, r, a);
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
var wi = function() {
  return wi = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, wi.apply(this, arguments);
};
function xd(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Fl(t, e) {
  var r = Gl(e), n = r.className;
  return at.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = xd(a, ["className", "cspNonce"]), u = at.useRef();
    return at.useImperativeHandle(i, function() {
      return u.current;
    }, []), at.useEffect(function() {
      var c = r.inject(u.current, {
        nonce: a.cspNonce
      });
      return function() {
        c.destroy();
      };
    }, []), at.createElement(t, wi({
      ref: u,
      "data-styled-id": n,
      className: "".concat(s, " ").concat(n)
    }, l));
  });
}
var Di = function(t, e) {
  return Di = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Di(t, e);
};
function bn(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Di(t, e);
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
function yd(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
      e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function bd(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function Sd(t) {
  var e = typeof Symbol == "function" && Symbol.iterator, r = e && t[e], n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == "number") return {
    next: function() {
      return t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t };
    }
  };
  throw new TypeError(e ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function z(t, e) {
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
function Sn(t, e) {
  return P({ events: [], props: [], name: t }, e);
}
var Cd = ["n", "w", "s", "e"], ao = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function Ed(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function wd(t) {
  var e = Ed(1, t), r = Math.round(t / 45) * 45 % 180, n = "ns-resize";
  return r === 135 ? n = "nwse-resize" : r === 45 ? n = "nesw-resize" : r === 90 && (n = "ew-resize"), "cursor:".concat(n, ";cursor: url('").concat(e, "') 16 16, ").concat(n, ";");
}
var Lr = gf(), Ll = Lr.browser.webkit, Wl = Ll && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), Yl = Lr.browser.name, Xl = parseInt(Lr.browser.version, 10), Dd = Yl === "chrome", _d = Lr.browser.chromium, Md = parseInt(Lr.browser.chromiumVersion, 10) || 0, kd = Dd && Xl >= 109 || _d && Md >= 109, Td = Yl === "firefox", Rd = parseInt(Lr.browser.webkitVersion, 10) >= 612 || Xl >= 15, io = "moveable-", Id = ao.map(function(t) {
  var e = "", r = "", n = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (r = "left: ".concat(i, ";"), n = "right"), t.indexOf("e") > -1 && (r = "left: 0px;", n = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(r).concat(e, `
        transform-origin: `).concat(n, " ").concat(a, `;
    }`);
}).join(`
`), Pd = `
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
`.concat(Id, `
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
`).concat(wd(t), `
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

`).concat(Wl ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), Od = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], _i = 1e-4, ce = 1e-7, Hn = 1e-9, Mi = Math.pow(10, 10), ys = -Mi, zd = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, oo = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, Hl = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, Ad = [
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
function Cn(t, e, r, n, a, i) {
  var o, s;
  i === void 0 && (i = "draggable");
  var l = (s = (o = e.gestos[i]) === null || o === void 0 ? void 0 : o.move(r, t.inputEvent)) !== null && s !== void 0 ? s : {}, u = l.originalDatas || l.datas, c = u[i] || (u[i] = {});
  return P(P({}, l), { isPinch: !!n, parentEvent: !0, datas: c, originalDatas: t.originalDatas });
}
var Ar = /* @__PURE__ */ (function() {
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
function Pr(t, e, r, n) {
  var a = t.length === 16, i = a ? 4 : 3, o = xr(t, r, n, i), s = z(o, 4), l = z(s[0], 2), u = l[0], c = l[1], f = z(s[1], 2), d = f[0], p = f[1], v = z(s[2], 2), m = v[0], x = v[1], y = z(s[3], 2), b = y[0], E = y[1], C = z(jt(t, e, i), 2), D = C[0], h = C[1], _ = Math.min(u, d, m, b), M = Math.min(c, p, x, E), T = Math.max(u, d, m, b), k = Math.max(c, p, x, E);
  u = u - _ || 0, d = d - _ || 0, m = m - _ || 0, b = b - _ || 0, c = c - M || 0, p = p - M || 0, x = x - M || 0, E = E - M || 0, D = D - _ || 0, h = h - M || 0;
  var A = t[0], O = t[i + 1], I = le(A * O);
  return {
    left: _,
    top: M,
    right: T,
    bottom: k,
    origin: [D, h],
    pos1: [u, c],
    pos2: [d, p],
    pos3: [m, x],
    pos4: [b, E],
    direction: I
  };
}
function ql(t, e) {
  var r = e.clientX, n = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, u = i.pos1, c = o.left, f = o.top, d = l ? 4 : 3, p = z(pt(jr(s, [r - c, n - f], d), u), 2), v = p[0], m = p[1], x = z(je({ datas: a, distX: v, distY: m }), 2), y = x[0], b = x[1];
  return [y, b];
}
function mr(t, e) {
  var r = e.datas, n = t.state, a = n.allMatrix, i = n.beforeMatrix, o = n.is3d, s = n.left, l = n.top, u = n.origin, c = n.offsetMatrix, f = n.targetMatrix, d = n.transformOrigin, p = o ? 4 : 3;
  r.is3d = o, r.matrix = a, r.targetMatrix = f, r.beforeMatrix = i, r.offsetMatrix = c, r.transformOrigin = d, r.inverseMatrix = Ie(a, p), r.inverseBeforeMatrix = Ie(i, p), r.absoluteOrigin = pr(Dt([s, l], u), p), r.startDragBeforeDist = ae(r.inverseBeforeMatrix, r.absoluteOrigin, p), r.startDragDist = ae(r.inverseMatrix, r.absoluteOrigin, p);
}
function Nd(t) {
  return Pr(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function wa(t, e, r) {
  var n = e.datas, a = e.originalDatas.beforeRenderable, i = n.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, u = -1;
  i === -1 ? (r === "translate" ? u = 0 : r === "rotate" && (u = Xe(o, function(p) {
    return p.match(/scale\(/g);
  })), u === -1 && (u = o.length), n.transformIndex = u) : he(l, function(p) {
    return p.index === i && p.functionName === r;
  }) ? u = i : u = i + l.filter(function(p) {
    return p.index < i;
  }).length;
  var c = lv(o, t.state, u), f = c.targetFunction, d = r === "rotate" ? "rotateZ" : r;
  n.beforeFunctionTexts = c.beforeFunctionTexts, n.afterFunctionTexts = c.afterFunctionTexts, n.beforeTransform = c.beforeFunctionMatrix, n.beforeTransform2 = c.beforeFunctionMatrix2, n.targetTansform = c.targetFunctionMatrix, n.afterTransform = c.afterFunctionMatrix, n.afterTransform2 = c.afterFunctionMatrix2, n.targetAllTransform = c.allFunctionMatrix, f.functionName === d ? (n.afterFunctionTexts.splice(0, 1), n.isAppendTransform = !1) : s > u && (n.isAppendTransform = !0, a.nextTransformAppendedIndexes = Q(Q([], z(l), !1), [{
    functionName: r,
    index: u,
    isAppend: !0
  }], !1));
}
function Da(t, e, r) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? r : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function Bd(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = z($l({ datas: e, distX: r, distY: n }), 2), i = a[0], o = a[1], s = Vl(e, Gf([i, o], 4));
  return ae(s, pr([0, 0, 0], 4), 4);
}
function Vl(t, e, r) {
  var n = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = r ? Pt(s, e, 4) : Pt(e, s, 4), u = Pt(Ie(r ? i : n, 4), l, 4), c = Pt(u, Ie(r ? o : a, 4), 4);
  return c;
}
function $l(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return pt(ae(a, Dt(s, [r, n]), l), o);
}
function je(t, e) {
  var r = t.datas, n = t.distX, a = t.distY, i = r.inverseBeforeMatrix, o = r.inverseMatrix, s = r.is3d, l = r.startDragBeforeDist, u = r.startDragDist, c = r.absoluteOrigin, f = s ? 4 : 3;
  return pt(ae(e ? i : o, Dt(c, [n, a]), f), e ? l : u);
}
function jd(t, e) {
  var r = t.datas, n = t.distX, a = t.distY;
  r.beforeMatrix;
  var i = r.matrix, o = r.is3d;
  r.startDragBeforeDist;
  var s = r.startDragDist, l = r.absoluteOrigin, u = o ? 4 : 3;
  return pt(ae(i, Dt(s, [n, a]), u), l);
}
function Gd(t, e, r, n, a, i) {
  return n === void 0 && (n = e), a === void 0 && (a = r), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = dr(o), u = l.value, c = l.unit, f = s ? a : n, d = s ? r : e;
    if (o === "%" || isNaN(u)) {
      var p = f ? i[s] / f : 0;
      return d * p;
    } else if (c !== "%")
      return u;
    return d * u / 100;
  }) : i;
}
function Ul(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function Fd(t, e) {
  return Ul(e).map(function(r) {
    return t[r];
  });
}
function Ua(t, e) {
  var r = (e + 1) / 2;
  return [
    sa(t[0][0], t[1][0], r, 1 - r),
    sa(t[0][1], t[1][1], r, 1 - r)
  ];
}
function te(t, e) {
  var r = Ua([t[0], t[1]], e[0]), n = Ua([t[2], t[3]], e[0]);
  return Ua([r, n], e[1]);
}
function Ld(t, e, r, n, a, i) {
  var o = xr(e, r, n, a), s = te(o, i), l = t[0] - s[0], u = t[1] - s[1];
  return [l, u];
}
function En(t, e, r, n) {
  return Pt(t, ln(e, n, r), n);
}
function Wd(t, e, r, n) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (we(r)) {
    var u = e.beforeTransform, c = e.afterTransform;
    n ? l = Pe(Or(r), 4, s) : l = Pe(Pt(Pt(u, Or([r]), 4), c, 4), 4, s);
  } else
    l = r;
  return En(i, l, a, s);
}
function Yd(t, e) {
  var r = t.transformOrigin, n = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return En(n, Pt(o || i, Qi(e, s), s), r, s);
}
function _a(t, e) {
  var r = Wr(e);
  return {
    setTransform: function(n, a) {
      a === void 0 && (a = -1), r.startTransforms = Xt(n) ? n : Qe(n), ki(t, e, a);
    },
    setTransformIndex: function(n) {
      ki(t, e, n);
    }
  };
}
function Ma(t, e, r) {
  var n = Wr(e), a = n.startTransforms;
  ki(t, e, Xe(a, function(i) {
    return i.indexOf("".concat(r, "(")) === 0;
  }));
}
function ki(t, e, r) {
  var n = Wr(e), a = e.datas;
  if (a.transformIndex = r, r !== -1) {
    var i = n.startTransforms[r];
    if (i) {
      var o = t.state, s = zr([i], {
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
function so(t, e) {
  var r = Wr(t);
  r.nextTransforms = Qe(e);
}
function Wr(t) {
  return t.originalDatas.beforeRenderable;
}
function da(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function qn(t) {
  return (da(t) || []).join(" ");
}
function Vn(t) {
  return Wr(t).nextStyle;
}
function Kl(t, e, r, n, a) {
  so(a, e);
  var i = se.drag(t, Cn(a, t.state, r, n)), o = i ? i.transform : e;
  return P(P({ transform: e, drag: i }, ue({
    transform: o
  }, a)), { afterTransform: o });
}
function lo(t, e, r, n, a, i) {
  var o = Wd(t.state, a, e, i), s = qd(t, r, n, o);
  return s;
}
function Zl(t, e, r, n, a, i, o) {
  var s = lo(t, e, r, a, i, o), l = t.state, u = l.left, c = l.top, f = t.props.groupable, d = f ? u : 0, p = f ? c : 0, v = pt(n, s);
  return pt(v, [d, p]);
}
function Xd(t, e, r, n, a, i, o) {
  var s = Zl(t, e, r, n, a, i, o);
  return s;
}
function Hd(t, e, r) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    r ? -1 + t[1] / (r / 2) : 0
  ];
}
function qd(t, e, r, n) {
  n === void 0 && (n = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, u = [
    i / 2 * (1 + e[0]) + r[0],
    o / 2 * (1 + e[1]) + r[1]
  ];
  return jt(n, u, l);
}
function Vd(t, e, r) {
  var n = r.fixedDirection, a = r.fixedPosition, i = r.fixedOffset;
  return Zl(t, "rotate(".concat(e, "deg)"), n, a, i, r);
}
function $d(t, e, r, n, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, u = s.offsetMatrix, c = s.is3d, f = s.width, d = s.height, p = s.left, v = s.top, m = i.fixedDirection, x = i.nextTargetMatrix || s.targetMatrix, y = c ? 4 : 3, b = Gd(a, e, r, f, d, l), E = o ? p : 0, C = o ? v : 0, D = En(u, x, b, y), h = Ld(n, D, e, r, y, m);
  return pt(h, [E, C]);
}
function Ud(t, e) {
  return te(_e(t.state), e);
}
function Kd(t, e) {
  var r = t.targetGesto, n = t.controlGesto, a;
  return r != null && r.isFlag() && (a = r.getEventData()[e]), !a && (n != null && n.isFlag()) && (a = n.getEventData()[e]), a || {};
}
function Zd(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function Jd(t) {
  var e = t("scale"), r = t("rotate"), n = t("translate"), a = [];
  return n && n !== "0px" && n !== "none" && a.push("translate(".concat(n.split(/\s+/).join(","), ")")), r && r !== "1" && r !== "none" && a.push("rotate(".concat(r, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function Jl(t, e, r) {
  for (var n = t, a = [], i = Ji(t) || rr(t), o = !r && t === e || t === i, s = o, l = !1, u = 3, c, f, d, p = !1, v = gn(e, e, !0).offsetParent, m = 1; n && !s; ) {
    s = o;
    var x = pe(n), y = x("position"), b = Cu(n), E = y === "fixed", C = Jd(x), D = Ff(Up(b)), h = void 0, _ = !1, M = !1, T = 0, k = 0, A = 0, O = 0, I = {
      hasTransform: !1,
      fixedContainer: null
    };
    E && (p = !0, I = tv(n), v = I.fixedContainer);
    var N = D.length;
    !l && (N === 16 || C.length) && (l = !0, u = 4, zi(a), d && (d = Pe(d, 3, 4))), l && N === 9 && (D = Pe(D, 3, 4));
    var B = Qp(n, t), W = B.tagName, H = B.hasOffset, L = B.isSVG, X = B.origin, V = B.targetOrigin, G = B.offset, tt = z(G, 2), et = tt[0], Z = tt[1];
    W === "svg" && !n.ownerSVGElement && d && (a.push({
      type: "target",
      target: n,
      matrix: ev(n, u)
    }), a.push({
      type: "offset",
      target: n,
      matrix: zt(u)
    }));
    var rt = parseFloat(x("zoom")) || 1;
    if (E)
      h = I.fixedContainer, _ = !0;
    else {
      var q = gn(n, e, !1, !0, x), nt = q.offsetZoom;
      if (h = q.offsetParent, _ = q.isEnd, M = q.isStatic, m *= nt, (q.isCustomElement || nt !== 1) && M)
        et -= h.offsetLeft, Z -= h.offsetTop;
      else if (Td || kd) {
        var ot = q.parentSlotElement;
        if (ot) {
          for (var vt = h, xt = 0, U = 0; vt && Zd(vt); )
            xt += vt.offsetLeft, U += vt.offsetTop, vt = vt.offsetParent;
          et -= xt, Z -= U;
        }
      }
    }
    if (Ll && !Rd && H && !L && M && (y === "relative" || y === "static") && (et -= h.offsetLeft, Z -= h.offsetTop, o = o || _), E)
      H && I.hasTransform && (A = h.clientLeft, O = h.clientTop);
    else if (H && v !== h && (T = h.clientLeft, k = h.clientTop), H && h === i) {
      var ut = Eu(n, !1);
      et += ut[0], Z += ut[1];
    }
    if (a.push({
      type: "target",
      target: n,
      matrix: ln(D, u, X)
    }), C.length && (a.push({
      type: "offset",
      target: n,
      matrix: zt(u)
    }), a.push({
      type: "target",
      target: n,
      matrix: ln(Or(C), u, X)
    })), H) {
      var wt = n === t, ht = wt ? 0 : n.scrollLeft, ft = wt ? 0 : n.scrollTop;
      a.push({
        type: "offset",
        target: n,
        matrix: vr([
          et - ht + T - A,
          Z - ft + k - O
        ], u)
      });
    } else
      a.push({
        type: "offset",
        target: n,
        origin: X
      });
    if (rt !== 1 && a.push({
      type: "zoom",
      target: n,
      matrix: ln(Qi([rt, rt], u), u, [0, 0])
    }), d || (d = D), c || (c = X), f || (f = V), s || E)
      break;
    n = h, o = _, (!r || n === i) && (s = o);
  }
  return d || (d = zt(u)), c || (c = [0, 0]), f || (f = [0, 0]), {
    zoom: m,
    offsetContainer: v,
    matrixes: a,
    targetMatrix: d,
    transformOrigin: c,
    targetOrigin: f,
    is3d: l,
    hasFixed: p
  };
}
var sr = null, lr = null, Mr = null;
function Nr(t) {
  t ? (window.Map && (sr = /* @__PURE__ */ new Map(), lr = /* @__PURE__ */ new Map()), Mr = []) : (sr = null, Mr = null, lr = null);
}
function Qd(t) {
  var e = lr == null ? void 0 : lr.get(t);
  if (e)
    return e;
  var r = un(t, !0);
  return lr && lr.set(t, r), r;
}
function tp(t, e) {
  if (Mr) {
    var r = he(Mr, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (r)
      return r[1];
  }
  var n = Jl(t, e, !0);
  return Mr && Mr.push([[t, e], n]), n;
}
function pe(t) {
  var e = sr == null ? void 0 : sr.get(t);
  if (!e) {
    var r = Ce(t).getComputedStyle(t);
    if (!sr)
      return function(i) {
        return r[i];
      };
    e = {
      style: r,
      cached: {}
    }, sr.set(t, e);
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
function Ka(t, e, r, n, a, i, o) {
  var s = !!r.match(/Start$/g), l = !!r.match(/End$/g), u = a.isPinch, c = a.datas, f = Re(t, e.name, a), d = t.moveables, p = [], v = f.map(function(m, x) {
    var y = d[x], b = y.state, E = b.gestos, C = m;
    if (s)
      C = new Ar(o).dragStart(n, m), p.push(C);
    else {
      if (E[o] || (E[o] = c.childGestos[x]), !E[o])
        return;
      C = Cn(m, b, n, u, i, o), p.push(C);
    }
    var D = e[r](y, P(P({}, C), { parentFlag: !0 }));
    return l && (E[o] = null), D;
  });
  return s && (c.childGestos = d.map(function(m) {
    return m.state.gestos[o];
  })), {
    eventParams: v,
    childEvents: p
  };
}
function Ye(t, e, r, n, a, i) {
  a === void 0 && (a = function(c, f) {
    return f;
  });
  var o = !!r.match(/End$/g), s = Re(t, e.name, n), l = t.moveables, u = s.map(function(c, f) {
    var d = l[f], p = c;
    p = a(d, c);
    var v = e[r](d, P(P({}, p), { parentFlag: !0 }));
    return o && (d.state.gestos = {}), v;
  });
  return u;
}
function pa(t, e, r, n) {
  var a = r.fixedDirection, i = r.fixedPosition, o = n.datas.startPositions || _e(e.state), s = te(o, a), l = z(ae(xn(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), u = l[0], c = l[1];
  return n.datas.originalX = u, n.datas.originalY = c, n;
}
function Ql(t, e, r, n) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = gr(t.props, e).zoom, u = sn(o / Math.PI * 180), c = {}, f = t.renderState;
  f.renderDirectionMap || (f.renderDirectionMap = {});
  var d = f.renderDirectionMap;
  r.forEach(function(v) {
    var m = v.dir;
    c[m] = !0;
  });
  var p = le(s);
  return r.map(function(v) {
    var m = v.data, x = v.classNames, y = v.dir, b = oo[y];
    if (!b || !c[y])
      return null;
    d[y] = !0;
    var E = (mt(u, 15) + p * Hl[y] + 720) % 180, C = {};
    return Fr(m).forEach(function(D) {
      C["data-".concat(D)] = m[D];
    }), n.createElement("div", P({ className: dt.apply(void 0, Q(["control", "direction", y, e], z(x), !1)), "data-rotation": E, "data-direction": y }, C, { key: "direction-".concat(y), style: ma.apply(void 0, Q([o, l], z(b.map(function(D) {
      return i[D];
    })), !1)) }));
  });
}
function tu(t, e, r, n) {
  var a = gr(t.props, r), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? ao : o;
  return Q(Q([], z(s ? au(t, n, r, l) : []), !1), z(Ql(t, r, l.map(function(u) {
    return {
      data: {},
      classNames: [],
      dir: u
    };
  }), n)), !1);
}
function hn(t, e, r, n, a, i) {
  for (var o = [], s = 6; s < arguments.length; s++)
    o[s - 6] = arguments[s];
  var l = Ht(r, n), u = e ? mt(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: dt.apply(void 0, Q(["line", "direction", e ? "edge" : "", e], z(o), !1)), "data-rotation": u, "data-line-key": i, "data-direction": e, style: rn(r, n, a, l) });
}
function eu(t, e, r, n, a) {
  var i = r === !0 ? Cd : r;
  return i.map(function(o, s) {
    var l = z(oo[o], 2), u = l[0], c = l[1];
    if (c != null)
      return hn(t, o, n[u], n[c], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function ru(t) {
  return function(e, r) {
    var n = gr(e.props, t).edge;
    return n && (n === !0 || n.length) ? Q(Q([], z(eu(r, t, n, e.getState().renderPoses, e.props.zoom)), !1), z(ep(e, t, r)), !1) : nu(e, t, r);
  };
}
function nu(t, e, r) {
  return tu(t, ao, e, r);
}
function ep(t, e, r) {
  return tu(t, ["nw", "ne", "sw", "se"], e, r);
}
function au(t, e, r, n) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, u = a.renderDirectionMap, c = t.props.zoom, f = le(l), d = s / Math.PI * 180;
  return (n || Fr(u)).map(function(p) {
    var v = oo[p];
    if (!v)
      return null;
    var m = (mt(d, 15) + f * Hl[p] + 720) % 180, x = ["around-control"];
    return r && x.push("direction", r), e.createElement("div", { className: dt.apply(void 0, Q([], z(x), !1)), "data-rotation": m, "data-direction": p, key: "direction-around-".concat(p), style: ma.apply(void 0, Q([s, c], z(v.map(function(y) {
      return o[y];
    })), !1)) });
  });
}
function uo(t, e, r) {
  var n = t || {}, a = n.position, i = a === void 0 ? "client" : a, o = n.left, s = o === void 0 ? -1 / 0 : o, l = n.top, u = l === void 0 ? -1 / 0 : l, c = n.right, f = c === void 0 ? 1 / 0 : c, d = n.bottom, p = d === void 0 ? 1 / 0 : d, v = {
    position: i,
    left: s,
    top: u,
    right: f,
    bottom: p
  };
  return {
    vertical: bs(v, e, !0),
    horizontal: bs(v, r, !1)
  };
}
function ka(t, e) {
  var r = t.state, n = r.containerClientRect, a = n.clientHeight, i = n.clientWidth, o = n.clientLeft, s = n.clientTop, l = r.snapOffset, u = l.left, c = l.top, f = l.right, d = l.bottom, p = e || t.props.bounds || {}, v = p.position || "client", m = v === "css", x = p.left, y = x === void 0 ? -1 / 0 : x, b = p.top, E = b === void 0 ? -1 / 0 : b, C = p.right, D = C === void 0 ? m ? -1 / 0 : 1 / 0 : C, h = p.bottom, _ = h === void 0 ? m ? -1 / 0 : 1 / 0 : h;
  return m && (D = i + f - u - D, _ = a + d - c - _), {
    left: y + u - o,
    right: D + u - o,
    top: E + c - s,
    bottom: _ + c - s
  };
}
function rp(t, e, r) {
  var n = ka(t), a = n.left, i = n.top, o = n.right, s = n.bottom, l = z(r, 2), u = l[0], c = l[1], f = z(pt(r, e), 2), d = f[0], p = f[1];
  Y(d) < ce && (d = 0), Y(p) < ce && (p = 0);
  var v = p > 0, m = d > 0, x = {
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
    v ? s < c && (y.pos = s, y.offset = c - s) : i > c && (y.pos = i, y.offset = c - i);
  else if (p === 0)
    m ? o < u && (x.pos = o, x.offset = u - o) : a > u && (x.pos = a, x.offset = u - a);
  else {
    var b = p / d, E = r[1] - b * u, C = 0, D = 0, h = !1;
    m && o <= u ? (C = b * o + E, D = o, h = !0) : !m && u <= a && (C = b * a + E, D = a, h = !0), h && (C < i || C > s) && (h = !1), h || (v && s <= c ? (C = s, D = (C - E) / b, h = !0) : !v && c <= i && (C = i, D = (C - E) / b, h = !0)), h && (x.isBound = !0, x.pos = D, x.offset = u - D, y.isBound = !0, y.pos = C, y.offset = c - C);
  }
  return {
    vertical: x,
    horizontal: y
  };
}
function bs(t, e, r) {
  var n = t[r ? "left" : "top"], a = t[r ? "right" : "bottom"], i = Math.min.apply(Math, Q([], z(e), !1)), o = Math.max.apply(Math, Q([], z(e), !1)), s = [];
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
    return Y(u.offset) - Y(l.offset);
  });
}
function Ss(t, e, r) {
  var n = r ? t.map(function(a) {
    return mn(a, r);
  }) : t;
  return n.some(function(a) {
    return a[0] < e.left && Y(a[0] - e.left) > 0.1 || a[0] > e.right && Y(a[0] - e.right) > 0.1 || a[1] < e.top && Y(a[1] - e.top) > 0.1 || a[1] > e.bottom && Y(a[1] - e.bottom) > 0.1;
  });
}
function np(t, e, r) {
  var n = De(t), a = Math.sqrt(n * n - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return Y(i - t[r ? 0 : 1]) - Y(o - t[r ? 0 : 1]);
  }).map(function(i) {
    return Ht([0, 0], r ? [i, e] : [e, i]);
  });
}
function ap(t, e, r, n, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = ka(t), s = o.left, l = o.top, u = o.right, c = o.bottom, f = s - n[0], d = u - n[0], p = l - n[1], v = c - n[1], m = {
    left: f,
    top: p,
    right: d,
    bottom: v
  };
  if (!Ss(r, m, 0))
    return [];
  var x = [];
  return [
    [f, 0],
    [d, 0],
    [p, 1],
    [v, 1]
  ].forEach(function(y) {
    var b = z(y, 2), E = b[0], C = b[1];
    r.forEach(function(D) {
      var h = Ht([0, 0], D);
      x.push.apply(x, Q([], z(np(D, E, C).map(function(_) {
        return i + _ - h;
      }).filter(function(_) {
        return !Ss(e, m, _);
      }).map(function(_) {
        return mt(_ * 180 / Math.PI, ce);
      })), !1));
    });
  }), x;
}
var ip = ["left", "right", "center"], op = ["top", "bottom", "middle"], Cs = {
  left: "start",
  right: "end",
  center: "center",
  top: "start",
  bottom: "end",
  middle: "center"
}, tr = {
  start: "left",
  end: "right",
  center: "center"
}, er = {
  start: "top",
  end: "bottom",
  center: "middle"
};
function kr() {
  return {
    left: !1,
    top: !1,
    right: !1,
    bottom: !1
  };
}
function Yr(t, e) {
  var r = t.props, n = r.snappable, a = r.bounds, i = r.innerBounds, o = r.verticalGuidelines, s = r.horizontalGuidelines, l = r.snapGridWidth, u = r.snapGridHeight, c = t.state, f = c.guidelines, d = c.enableSnap;
  return !n || !d || e && n !== !0 && n.indexOf(e) < 0 ? !1 : !!(l || u || a || i || f && f.length || o && o.length || s && s.length);
}
function co(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function sp(t, e) {
  var r = co(t), n = {};
  for (var a in r)
    a in e && r[a] && (n[a] = e[a]);
  return n;
}
function fo(t, e) {
  var r = sp(t, e), n = op.filter(function(i) {
    return i in r;
  }), a = ip.filter(function(i) {
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
function lp(t, e, r) {
  var n = jt(t, [e.clientLeft, e.clientTop], r);
  return [
    e.left + n[0],
    e.top + n[1]
  ];
}
function up(t) {
  var e = z(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  Math.abs(a) < Kt && (a = 0), Math.abs(i) < Kt && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * r[0] - r[1]) : (s = 1, l = -r[1]) : (o = -1, l = r[0]), [o, s, l].map(function(u) {
    return mt(u, Kt);
  });
}
var iu = "snapRotationThreshold", ou = "snapRotationDegrees", su = "snapHorizontalThreshold", lu = "snapVerticalThreshold";
function Ta(t, e, r, n, a, i, o) {
  var s;
  n === void 0 && (n = []), a === void 0 && (a = []);
  var l = t.props, u = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], c = Bs(o, l[su], 5), f = Bs(i, l[lu], 5);
  return uu(t.state.guidelines, e, r, n, a, c, f, u);
}
function uu(t, e, r, n, a, i, o, s) {
  return {
    vertical: ws(t, "vertical", e, o * s[0], n),
    horizontal: ws(t, "horizontal", r, i * s[1], a)
  };
}
function cp(t, e, r) {
  var n = z(r, 2), a = n[0], i = n[1], o = z(e, 2), s = o[0], l = o[1], u = z(pt(r, e), 2), c = u[0], f = u[1], d = f > 0, p = c > 0;
  c = xa(c), f = xa(f);
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
  var x = Ta(t, c ? [a] : [], f ? [i] : [], [], [], void 0, void 0), y = x.vertical, b = x.horizontal;
  y.posInfos.filter(function(W) {
    var H = W.pos;
    return p ? H >= s : H <= s;
  }), b.posInfos.filter(function(W) {
    var H = W.pos;
    return d ? H >= l : H <= l;
  }), y.isSnap = y.posInfos.length > 0, b.isSnap = b.posInfos.length > 0;
  var E = Ti(y), C = E.isSnap, D = E.guideline, h = Ti(b), _ = h.isSnap, M = h.guideline, T = _ ? M.pos[1] : 0, k = C ? D.pos[0] : 0;
  if (c === 0)
    _ && (m.isSnap = !0, m.pos = M.pos[1], m.offset = i - m.pos);
  else if (f === 0)
    C && (v.isSnap = !0, v.pos = k, v.offset = a - k);
  else {
    var A = f / c, O = r[1] - A * a, I = 0, N = 0, B = !1;
    C ? (N = k, I = A * N + O, B = !0) : _ && (I = T, N = (I - O) / A, B = !0), B && (v.isSnap = !0, v.pos = N, v.offset = a - N, m.isSnap = !0, m.pos = I, m.offset = i - I);
  }
  return {
    vertical: v,
    horizontal: m
  };
}
function Ke(t) {
  var e = "";
  return t === -1 || t === "top" || t === "left" ? e = "start" : t === 0 || t === "center" || t === "middle" ? e = "center" : (t === 1 || t === "right" || t === "bottom") && (e = "end"), e;
}
function Es(t, e, r, n) {
  var a = fo(t.props.snapDirections, e), i = Ta(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return Ke(l);
  }), a.horizontalNames.map(function(l) {
    return Ke(l);
  }), r, n), o = Ke(a.horizontalNames[i.horizontal.index]), s = Ke(a.verticalNames[i.vertical.index]);
  return {
    vertical: P(P({}, i.vertical), { direction: s }),
    horizontal: P(P({}, i.horizontal), { direction: o })
  };
}
function Ti(t) {
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
function ws(t, e, r, n, a) {
  var i, o;
  if (a === void 0 && (a = []), !t || !t.length)
    return {
      isSnap: !1,
      index: -1,
      direction: "",
      posInfos: []
    };
  var s = e === "vertical", l = s ? 0 : 1, u = r.map(function(f, d) {
    var p = a[d] || "", v = t.map(function(m) {
      var x = m.pos, y = f - x[l];
      return {
        offset: y,
        dist: Y(y),
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
      guidelineInfos: v,
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
function fp(t, e, r, n, a) {
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
  ].forEach(function(d, p, v) {
    var m = v[p + 1] || v[0];
    i.push(d), i.push([
      (d[0] + m[0]) / 2,
      (d[1] + m[1]) / 2
    ]);
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], r) : (i.push.apply(i, Q([], z(Fd([
    [-1, -1],
    [1, -1],
    [-1, -1],
    [1, 1]
  ], r)), !1)), i.length > 1 && i.push([
    (i[0][0] + i[1][0]) / 2,
    (i[0][1] + i[1][1]) / 2
  ]));
  var o = i.map(function(d) {
    return te(e, d);
  }), s = o.map(function(d) {
    return d[0];
  }), l = o.map(function(d) {
    return d[1];
  }), u = Ta(t, s, l, i.map(function(d) {
    return Ke(d[0]);
  }), i.map(function(d) {
    return Ke(d[1]);
  }), n, a), c = Ke(i.map(function(d) {
    return d[0];
  })[u.vertical.index]), f = Ke(i.map(function(d) {
    return d[1];
  })[u.horizontal.index]);
  return {
    vertical: P(P({}, u.vertical), { direction: c }),
    horizontal: P(P({}, u.horizontal), { direction: f })
  };
}
function cu(t, e) {
  var r = Y(t.offset), n = Y(e.offset);
  return t.isBound && e.isBound ? n - r : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? n - r : t.isSnap ? -1 : e.isSnap || r < ce ? 1 : n < ce ? -1 : r - n;
}
function va(t, e) {
  return t.slice().sort(function(r, n) {
    var a = r.sign[e], i = n.sign[e], o = r.offset[e], s = n.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return cu({ isBound: r.isBound, isSnap: r.isSnap, offset: o }, { isBound: n.isBound, isSnap: n.isSnap, offset: s });
  })[0];
}
function dp(t, e, r) {
  var n = [];
  if (r)
    Y(e[0]) !== 1 || Y(e[1]) !== 1 ? n.push([e, [-1, -1]], [e, [-1, 1]], [e, [1, -1]], [e, [1, 1]]) : n.push([e, [t[0], -t[1]]], [e, [-t[0], t[1]]]), n.push([e, t]);
  else if (t[0] && t[1] || !t[0] && !t[1]) {
    var a = t[0] ? t : [1, 1];
    [1, -1].forEach(function(o) {
      [1, -1].forEach(function(s) {
        var l = [o * a[0], s * a[1]];
        e[0] === l[0] && e[1] === l[1] || n.push([e, l]);
      });
    });
  } else if (t[0]) {
    var i = Y(e[0]) === 1 ? [1] : [1, -1];
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
    var i = Y(e[1]) === 1 ? [1] : [1, -1];
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
function fu(t, e) {
  var r = hi([e[0][0], e[1][0]]), n = hi([e[0][1], e[1][1]]);
  return {
    vertical: r <= t[0],
    horizontal: n <= t[1]
  };
}
function po(t, e) {
  var r = z(e, 2), n = r[0], a = r[1], i = a[0] - n[0], o = a[1] - n[1];
  Y(i) < ce && (i = 0), Y(o) < ce && (o = 0);
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
function du(t, e, r, n) {
  return n === void 0 && (n = ce), t.every(function(a) {
    var i = po(a, e), o = i <= 0;
    return o === r || Y(i) <= n;
  });
}
function Ds(t, e, r, n, a) {
  return a === void 0 && (a = 0), n && e - a <= t || !n && t <= r + a ? {
    isBound: !0,
    offset: n ? e - t : r - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function pp(t, e) {
  var r = e.line, n = e.centerSign, a = e.verticalSign, i = e.horizontalSign, o = e.lineConstants, s = t.props.innerBounds;
  if (!s)
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var l = s.left, u = s.top, c = s.width, f = s.height, d = [[l, u], [l, u + f]], p = [[l, u], [l + c, u]], v = [[l + c, u], [l + c, u + f]], m = [[l, u + f], [l + c, u + f]];
  if (du([
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
  var x = Ze(r, o, p, a), y = Ze(r, o, m, a), b = Ze(r, o, d, i), E = Ze(r, o, v, i), C = x.isBound && y.isBound, D = x.isBound || y.isBound, h = b.isBound && E.isBound, _ = b.isBound || E.isBound, M = Br(x.offset, y.offset), T = Br(b.offset, E.offset), k = [0, 0], A = !1, O = !1;
  return Y(T) < Y(M) ? (k = [M, 0], A = D, O = C) : (k = [0, T], A = _, O = h), {
    isAllBound: O,
    isVerticalBound: D,
    isHorizontalBound: _,
    isBound: A,
    offset: k
  };
}
function Ze(t, e, r, n, a, i) {
  var o = z(e, 2), s = o[0], l = o[1], u = t[0], c = r[0], f = r[1], d = xa(f[1] - c[1]), p = xa(f[0] - c[0]), v = l, m = s, x = -s / l;
  if (p) {
    if (!d) {
      if (i && !v)
        return {
          isBound: !1,
          offset: 0
        };
      if (m) {
        var C = (c[1] - u[1]) / x + u[0];
        return Ds(C, c[0], f[0], n, a);
      } else {
        var b = c[1] - u[1], E = Y(b) <= (a || 0);
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
    if (v) {
      var y = x * (c[0] - u[0]) + u[1];
      return Ds(y, c[1], f[1], n, a);
    } else {
      var b = c[0] - u[0], E = Y(b) <= (a || 0);
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
function pu(t, e, r) {
  return e.map(function(n) {
    var a = pp(t, n), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, u = n.multiple, c = je({
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
function vp(t, e, r) {
  var n, a = vo(t, e, [0, 0], !1).map(function(d) {
    return P(P({}, d), { multiple: d.multiple.map(function(p) {
      return Y(p) * 2;
    }) });
  }), i = pu(t, a, r), o = va(i, 0), s = va(i, 1), l = 0, u = 0, c = o.isVerticalBound || s.isVerticalBound, f = o.isHorizontalBound || s.isHorizontalBound;
  return (c || f) && (n = z(jd({
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
function hp(t, e) {
  var r = [], n = t[0], a = t[1];
  return n && a ? r.push([[0, a * 2], t, [-n, a]], [[n * 2, 0], t, [n, -a]]) : n ? (r.push([[n * 2, 0], [n, 1], [n, -1]]), e && r.push([[0, -1], [n, -1], [-n, -1]], [[0, 1], [n, 1], [-n, 1]])) : a ? (r.push([[0, a * 2], [1, a], [-1, a]]), e && r.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : r.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), r;
}
function vo(t, e, r, n) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = xr(i, 100, 100, o ? 4 : 3), l = te(s, [0, 0]);
  return hp(r, n).map(function(u) {
    var c = z(u, 3), f = c[0], d = c[1], p = c[2], v = [
      te(s, d),
      te(s, p)
    ], m = up(v), x = fu(l, v), y = x.vertical, b = x.horizontal, E = po(l, v) <= 0;
    return {
      multiple: f,
      centerSign: E,
      verticalSign: y,
      horizontalSign: b,
      lineConstants: m,
      line: [
        te(e, d),
        te(e, p)
      ]
    };
  });
}
function _s(t, e, r, n) {
  var a = n ? t.map(function(i) {
    return mn(i, n);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = po(r, i) <= 0;
    return !du(e, i, o);
  });
}
function gp(t) {
  var e = z(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  if (!a)
    return Y(r[0]);
  if (!i)
    return Y(r[1]);
  var o = i / a;
  return Y((-o * r[0] + r[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function mp(t) {
  var e = z(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
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
function xp(t, e, r, n, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, u = i.width, c = i.height, f = s - n[0], d = s + u - n[0], p = l - n[1], v = l + c - n[1], m = [
    [f, p],
    [d, p],
    [f, v],
    [d, v]
  ], x = te(r, [0, 0]);
  if (!_s(r, m, x, 0))
    return [];
  var y = [], b = m.map(function(E) {
    return [
      De(E),
      Ht([0, 0], E)
    ];
  });
  return [
    [r[0], r[1]],
    [r[1], r[3]],
    [r[3], r[2]],
    [r[2], r[0]]
  ].forEach(function(E) {
    var C = Ht([0, 0], mp(E)), D = gp(E);
    y.push.apply(y, Q([], z(b.filter(function(h) {
      var _ = z(h, 1), M = _[0];
      return M && D <= M;
    }).map(function(h) {
      var _ = z(h, 2), M = _[0], T = _[1], k = Math.acos(M ? D / M : 0), A = T + k, O = T - k;
      return [
        o + A - C,
        o + O - C
      ];
    }).reduce(function(h, _) {
      return h.push.apply(h, Q([], z(_), !1)), h;
    }, []).filter(function(h) {
      return !_s(e, m, x, h);
    }).map(function(h) {
      return mt(h * 180 / Math.PI, ce);
    })), !1));
  }), y;
}
function yp(t) {
  var e = t.props.innerBounds, r = kr();
  if (!e)
    return {
      boundMap: r,
      vertical: [],
      horizontal: []
    };
  var n = t.getRect(), a = n.pos1, i = n.pos2, o = n.pos3, s = n.pos4, l = [a, i, o, s], u = te(l, [0, 0]), c = e.left, f = e.top, d = e.width, p = e.height, v = [[c, f], [c, f + p]], m = [[c, f], [c + d, f]], x = [[c + d, f], [c + d, f + p]], y = [[c, f + p], [c + d, f + p]], b = vo(t, l, [0, 0], !1), E = [], C = [];
  return b.forEach(function(D) {
    var h = D.line, _ = D.lineConstants, M = fu(u, h), T = M.horizontal, k = M.vertical, A = Ze(h, _, m, k, 1, !0), O = Ze(h, _, y, k, 1, !0), I = Ze(h, _, v, T, 1, !0), N = Ze(h, _, x, T, 1, !0);
    A.isBound && !r.top && (E.push(f), r.top = !0), O.isBound && !r.bottom && (E.push(f + p), r.bottom = !0), I.isBound && !r.left && (C.push(c), r.left = !0), N.isBound && !r.right && (C.push(c + d), r.right = !0);
  }), {
    boundMap: r,
    horizontal: E,
    vertical: C
  };
}
function bp(t, e, r, n) {
  var a = e[0] - t[0], i = e[1] - t[1];
  if (Y(a) < Kt && (a = 0), Y(i) < Kt && (i = 0), !a)
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
function Ri(t, e, r, n, a) {
  var i = bp(t, e, r, n);
  if (!i)
    return {
      isOutside: !1,
      offset: [0, 0]
    };
  var o = Ne(t, e), s = Ne(i, t), l = Ne(i, e), u = s > o || l > o, c = z(je({
    datas: a,
    distX: i[0],
    distY: i[1]
  }), 2), f = c[0], d = c[1];
  return {
    offset: [f, d],
    isOutside: u
  };
}
function ha(t, e) {
  return t.isBound ? t.offset : e.isSnap ? Ti(e).offset : 0;
}
function Sp(t, e, r, n, a) {
  var i = z(e, 2), o = i[0], s = i[1], l = z(r, 2), u = l[0], c = l[1], f = z(n, 2), d = f[0], p = f[1], v = z(a, 2), m = v[0], x = v[1], y = -m, b = -x;
  if (t && o && s) {
    y = 0, b = 0;
    var E = [];
    if (u && c ? E.push([0, x], [m, 0]) : u ? E.push([m, 0]) : c ? E.push([0, x]) : d && p ? E.push([0, x], [m, 0]) : d ? E.push([m, 0]) : p && E.push([0, x]), E.length) {
      E.sort(function(_, M) {
        return De(pt([o, s], _)) - De(pt([o, s], M));
      });
      var C = E[0];
      if (C[0] && Y(o) > Kt)
        y = -C[0], b = s * Y(o + y) / Y(o) - s;
      else if (C[1] && Y(s) > Kt) {
        var D = s;
        b = -C[1], y = o * Y(s + b) / Y(D) - o;
      }
      if (t && c && u)
        if (Y(y) > Kt && Y(y) < Y(m)) {
          var h = Y(m) / Y(y);
          y *= h, b *= h;
        } else if (Y(b) > Kt && Y(b) < Y(x)) {
          var h = Y(x) / Y(b);
          y *= h, b *= h;
        } else
          y = Br(-m, y), b = Br(-x, b);
    }
  } else
    y = o || u ? -m : 0, b = s || c ? -x : 0;
  return [y, b];
}
function Cp(t, e, r, n, a, i) {
  if (!Yr(t, "draggable"))
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
  var o = mo(i.absolutePoses, [e, r]), s = Ee(o), l = s.left, u = s.right, c = s.top, f = s.bottom, d = {
    horizontal: o.map(function(N) {
      return N[1];
    }),
    vertical: o.map(function(N) {
      return N[0];
    })
  }, p = co(t.props.snapDirections), v = fo(p, {
    left: l,
    right: u,
    top: c,
    bottom: f,
    center: (l + u) / 2,
    middle: (c + f) / 2
  }), m = Ra(t, a, v, d), x = m.vertical, y = m.horizontal, b = vp(t, o, i), E = b.vertical, C = b.horizontal, D = x.isSnap, h = y.isSnap, _ = x.isBound || E.isBound, M = y.isBound || C.isBound, T = Br(x.offset, E.offset), k = Br(y.offset, C.offset), A = z(Sp(n, [e, r], [_, M], [D, h], [T, k]), 2), O = A[0], I = A[1];
  return [
    {
      isBound: _,
      isSnap: D,
      offset: O
    },
    {
      isBound: M,
      isSnap: h,
      offset: I
    }
  ];
}
function Ra(t, e, r, n) {
  n === void 0 && (n = r);
  var a = uo(ka(t), n.vertical, n.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : Ta(t, r.vertical, r.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, u = s.vertical, c = ha(i[0], l), f = ha(o[0], u), d = Y(c), p = Y(f);
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
function Ms(t, e, r, n, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = uo(e, r, n), l = s.horizontal, u = s.vertical, c = uu(t, r, n, [], [], a, i, o), f = c.horizontal, d = c.vertical, p = ha(l[0], f), v = ha(u[0], d), m = Y(p), x = Y(v);
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
      offset: v,
      dist: x,
      bounds: u,
      snap: d
    }
  };
}
function Ep(t, e, r, n) {
  var a = Ht(t, e) / Math.PI * 180, i = r.vertical, o = i.isBound, s = i.isSnap, l = i.dist, u = r.horizontal, c = u.isBound, f = u.isSnap, d = u.dist, p = a % 180, v = p < 3 || p > 177, m = p > 87 && p < 93;
  return d < l && (o || s && !m && (!n || !v)) ? "vertical" : c || f && !v && (!n || !m) ? "horizontal" : "";
}
function wp(t, e, r, n, a, i) {
  return r.map(function(o) {
    var s = z(o, 2), l = s[0], u = s[1], c = te(e, l), f = te(e, u), d = n ? Dp(t, c, f, a) : Ra(t, a, {
      vertical: [f[0]],
      horizontal: [f[1]]
    }), p = d.horizontal, v = p.offset, m = p.isBound, x = p.isSnap, y = d.vertical, b = y.offset, E = y.isBound, C = y.isSnap, D = pt(u, l);
    if (!b && !v)
      return {
        isBound: E || m,
        isSnap: C || x,
        sign: D,
        offset: [0, 0]
      };
    var h = Ep(c, f, d, n);
    if (!h)
      return {
        sign: D,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var _ = h === "vertical", M = [0, 0];
    return !n && Y(u[0]) === 1 && Y(u[1]) === 1 && l[0] !== u[0] && l[1] !== u[1] ? M = je({
      datas: i,
      distX: -b,
      distY: -v
    }) : M = Ri(c, f, -(_ ? b : v), _, i).offset, M = M.map(function(T, k) {
      return T * (D[k] ? 2 / D[k] : 0);
    }), {
      sign: D,
      isBound: _ ? E : m,
      isSnap: _ ? C : x,
      offset: M
    };
  });
}
function ks(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function Dp(t, e, r, n) {
  var a = rp(t, e, r), i = a.horizontal, o = a.vertical, s = n ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : cp(t, e, r), l = s.horizontal, u = s.vertical, c = ks(i, l), f = ks(o, u), d = Y(c), p = Y(f);
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
function _p(t, e, r, n, a) {
  var i = [-r[0], -r[1]], o = t.state, s = o.width, l = o.height, u = t.props.bounds, c = 1 / 0, f = 1 / 0;
  if (u) {
    var d = [
      [r[0], -r[1]],
      [-r[0], r[1]]
    ], p = u.left, v = p === void 0 ? -1 / 0 : p, m = u.top, x = m === void 0 ? -1 / 0 : m, y = u.right, b = y === void 0 ? 1 / 0 : y, E = u.bottom, C = E === void 0 ? 1 / 0 : E;
    d.forEach(function(D) {
      var h = D[0] !== i[0], _ = D[1] !== i[1], M = te(e, D), T = Ht(n, M) * 360 / Math.PI;
      if (_) {
        var k = M.slice();
        (Y(T - 360) < 2 || Y(T - 180) < 2) && (k[1] = n[1]);
        var A = Ri(n, k, (n[1] < M[1] ? C : x) - M[1], !1, a), O = z(A.offset, 2), I = O[1], N = A.isOutside;
        isNaN(I) || (f = l + (N ? 1 : -1) * Y(I));
      }
      if (h) {
        var k = M.slice();
        (Y(T - 90) < 2 || Y(T - 270) < 2) && (k[0] = n[0]);
        var B = Ri(n, k, (n[0] < M[0] ? b : v) - M[0], !0, a), W = z(B.offset, 1), H = W[0], L = B.isOutside;
        isNaN(H) || (c = s + (L ? 1 : -1) * Y(H));
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
    var c = De(u), f = Ht(u, [0, 0]);
    return [e.createElement("div", { className: dt("line", "horizontal", "dragline", "dashed"), key: "dragRotateGuideline", style: {
      width: "".concat(c, "px"),
      transform: "translate(".concat(l[0], "px, ").concat(l[1], "px) rotate(").concat(f, "rad) scaleY(").concat(i, ")")
    } })];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.parentEvent, a = e.parentGesto, i = t.state, o = i.gestos, s = i.style;
    if (o.draggable)
      return !1;
    o.draggable = a || t.targetGesto, r.datas = {}, r.left = parseFloat(s.left || "") || 0, r.top = parseFloat(s.top || "") || 0, r.bottom = parseFloat(s.bottom || "") || 0, r.right = parseFloat(s.right || "") || 0, r.startValue = [0, 0], mr(t, e), Ma(t, e, "translate"), Hp(t, r), r.prevDist = [0, 0], r.prevBeforeDist = [0, 0], r.isDrag = !1, r.deltaOffset = [0, 0];
    var l = St(t, e, P({ set: function(c) {
      r.startValue = c;
    } }, _a(t, e))), u = n || st(t, "onDragStart", l);
    return u !== !1 ? (r.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, r.isPinch = !1), r.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      wa(t, e, "translate");
      var r = e.datas, n = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, u = e.isGroup, c = e.parentThrottleDrag, f = e.distX, d = e.distY, p = r.isDrag, v = r.prevDist, m = r.prevBeforeDist, x = r.startValue;
      if (p) {
        o && (f += o[0], d += o[1]);
        var y = t.props, b = y.parentMoveable, E = u ? 0 : y.throttleDrag || c || 0, C = n ? 0 : y.throttleDragRotate || 0, D = 0, h = !1, _ = !1, M = !1, T = !1;
        if (!n && C > 0 && (f || d)) {
          var k = y.startDragRotate || 0, A = mt(k + Ht([0, 0], [f, d]) * 180 / Math.PI, C) - k, O = d * Math.abs(Math.cos((A - 90) / 180 * Math.PI)), I = f * Math.abs(Math.cos(A / 180 * Math.PI)), N = De([I, O]);
          D = A * Math.PI / 180, f = N * Math.cos(D), d = N * Math.sin(D);
        }
        if (!i && !n && !a) {
          var B = z(Cp(t, f, d, C, !s && l || o, r), 2), W = B[0], H = B[1];
          h = W.isSnap, _ = W.isBound, M = H.isSnap, T = H.isBound;
          var L = W.offset, X = H.offset;
          f += L, d += X;
        }
        var V = Dt($l({ datas: r, distX: f, distY: d }), x), G = Dt(Bd({ datas: r, distX: f, distY: d }), x);
        hs(G, ce), hs(V, ce), C || (!h && !_ && (G[0] = mt(G[0], E), V[0] = mt(V[0], E)), !M && !T && (G[1] = mt(G[1], E), V[1] = mt(V[1], E)));
        var tt = pt(V, x), et = pt(G, x), Z = pt(et, v), rt = pt(tt, m);
        r.prevDist = et, r.prevBeforeDist = tt, r.passDelta = Z, r.passDist = et;
        var q = r.left + tt[0], nt = r.top + tt[1], ot = r.right - tt[0], vt = r.bottom - tt[1], xt = Da(r, "translate(".concat(G[0], "px, ").concat(G[1], "px)"), "translate(".concat(et[0], "px, ").concat(et[1], "px)"));
        if (so(e, xt), t.state.dragInfo.dist = n ? [0, 0] : et, !(!n && !b && Z.every(function(ft) {
          return !ft;
        }) && rt.some(function(ft) {
          return !ft;
        }))) {
          var U = t.state, ut = U.width, wt = U.height, ht = St(t, e, P({ transform: xt, dist: et, delta: Z, translate: G, beforeDist: tt, beforeDelta: rt, beforeTranslate: V, left: q, top: nt, right: ot, bottom: vt, width: ut, height: wt, isPinch: i }, ue({
            transform: xt
          }, e)));
          return !n && st(t, "onDrag", ht), ht;
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
      var a = ge(t, e, {});
      return !r && st(t, "onDragEnd", a), a;
    }
  },
  dragGroupStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = this.dragStart(t, e);
    if (!s)
      return !1;
    var l = Ka(t, this, "dragStart", [
      i || 0,
      o || 0
    ], e, !1, "draggable"), u = l.childEvents, c = l.eventParams, f = P(P({}, s), { targets: t.props.targets, events: c }), d = st(t, "onDragGroupStart", f);
    a.isDrag = d !== !1;
    var p = (n = (r = u[0]) === null || r === void 0 ? void 0 : r.datas.startValue) !== null && n !== void 0 ? n : [0, 0];
    return a.throttleOffset = [p[0] % 1, p[1] % 1], a.isDrag ? s : !1;
  },
  dragGroup: function(t, e) {
    var r = e.datas;
    if (r.isDrag) {
      var n = this.drag(t, P(P({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = Ka(t, this, "drag", a, e, !1, "draggable").eventParams;
      if (n) {
        var o = P({ targets: t.props.targets, events: i }, n);
        return st(t, "onDragGroup", o), o;
      }
    }
  },
  dragGroupEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isDrag) {
      this.dragEnd(t, e);
      var a = Ka(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
      return st(t, "onDragGroupEnd", ge(t, e, {
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
function vu(t, e) {
  var r = te(t, e), n = [0, 0];
  return {
    fixedPosition: r,
    fixedDirection: e,
    fixedOffset: n
  };
}
function Mp(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = [
    a / 2 * (1 + e[0]),
    i / 2 * (1 + e[1])
  ], l = jt(r, s, o), u = [0, 0];
  return {
    fixedPosition: l,
    fixedDirection: e,
    fixedOffset: u
  };
}
function hu(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = Hd(e, a, i), l = jt(r, e, o), u = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: u
  };
}
var Ts = bo("resizable"), Ii = {
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
  render: ru("resizable"),
  dragControlCondition: Ts,
  viewClassName: yo("resizable"),
  dragControlStart: function(t, e) {
    var r, n = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, u = e.parentFixedDirection, c = e.parentEvent, f = ku(o, a, n, l), d = t.state, p = d.target, v = d.width, m = d.height, x = d.gestos;
    if (!f || !p || x.resizable)
      return !1;
    x.resizable = s || t.controlGesto, !a && mr(t, e), l.datas = {}, l.direction = f, l.startOffsetWidth = v, l.startOffsetHeight = m, l.prevWidth = 0, l.prevHeight = 0, l.minSize = [0, 0], l.startWidth = d.inlineCSSWidth || d.cssWidth, l.startHeight = d.inlineCSSHeight || d.cssHeight, l.maxSize = [1 / 0, 1 / 0], i || (l.minSize = [
      d.minOffsetWidth,
      d.minOffsetHeight
    ], l.maxSize = [
      d.maxOffsetWidth,
      d.maxOffsetHeight
    ]);
    var y = t.props.transformOrigin || "% %";
    l.transformOrigin = we(y) ? y.split(" ") : y, l.startOffsetMatrix = d.offsetMatrix, l.startTransformOrigin = d.transformOrigin, l.isWidth = (r = e == null ? void 0 : e.parentIsWidth) !== null && r !== void 0 ? r : !f[0] && !f[1] || f[0] || !f[1];
    function b(T) {
      l.ratio = T && isFinite(T) ? T : 0;
    }
    l.startPositions = _e(t.state);
    function E(T) {
      var k = vu(l.startPositions, T);
      l.fixedDirection = k.fixedDirection, l.fixedPosition = k.fixedPosition, l.fixedOffset = k.fixedOffset;
    }
    function C(T) {
      var k = hu(t.state, T);
      l.fixedDirection = k.fixedDirection, l.fixedPosition = k.fixedPosition, l.fixedOffset = k.fixedOffset;
    }
    function D(T) {
      l.minSize = [
        It("".concat(T[0]), 0) || 0,
        It("".concat(T[1]), 0) || 0
      ];
    }
    function h(T) {
      var k = [
        T[0] || 1 / 0,
        T[1] || 1 / 0
      ];
      (!dn(k[0]) || isFinite(k[0])) && (k[0] = It("".concat(k[0]), 0) || 1 / 0), (!dn(k[1]) || isFinite(k[1])) && (k[1] = It("".concat(k[1]), 0) || 1 / 0), l.maxSize = k;
    }
    b(v / m), E(u || [-f[0], -f[1]]), l.setFixedDirection = E, l.setFixedPosition = C, l.setMin = D, l.setMax = h;
    var _ = St(t, e, {
      direction: f,
      startRatio: l.ratio,
      set: function(T) {
        var k = z(T, 2), A = k[0], O = k[1];
        l.startWidth = A, l.startHeight = O;
      },
      setMin: D,
      setMax: h,
      setRatio: b,
      setFixedDirection: E,
      setFixedPosition: C,
      setOrigin: function(T) {
        l.transformOrigin = T;
      },
      dragStart: se.dragStart(t, new Ar().dragStart([0, 0], e))
    }), M = c || st(t, "onResizeStart", _);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, M !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: f
    }), l.isResize ? _ : !1;
  },
  dragControl: function(t, e) {
    var r, n = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, u = e.useSnap, c = e.isRequest, f = e.isGroup, d = e.parentEvent, p = e.resolveMatrix, v = n.isResize, m = n.transformOrigin, x = n.startWidth, y = n.startHeight, b = n.prevWidth, E = n.prevHeight, C = n.minSize, D = n.maxSize, h = n.ratio, _ = n.startOffsetWidth, M = n.startOffsetHeight, T = n.isWidth;
    if (!v)
      return;
    if (p) {
      var k = t.state.is3d, A = n.startOffsetMatrix, O = n.startTransformOrigin, I = k ? 4 : 3, N = Or(da(e)), B = Math.sqrt(N.length);
      I !== B && (N = Pe(N, B, I));
      var W = En(A, N, O, I), H = xr(W, _, M, I);
      n.startPositions = H, n.nextTargetMatrix = N, n.nextAllMatrix = W;
    }
    var L = gr(t.props, "resizable"), X = L.resizeFormat, V = L.throttleResize, G = V === void 0 ? a ? 0 : 1 : V, tt = L.parentMoveable, et = L.keepRatioFinally, Z = n.direction, rt = Z, q = 0, nt = 0;
    !Z[0] && !Z[1] && (rt = [1, 1]);
    var ot = h && (o ?? L.keepRatio) || !1;
    function vt() {
      var Bt = n.fixedDirection, At = zu(rt, ot, n, e);
      q = At.distWidth, nt = At.distHeight;
      var me = rt[0] - Bt[0] || ot ? Math.max(_ + q, ce) : _, ie = rt[1] - Bt[1] || ot ? Math.max(M + nt, ce) : M;
      return ot && _ && M && (T ? ie = me / h : me = ie * h), [me, ie];
    }
    var xt = z(vt(), 2), U = xt[0], ut = xt[1];
    d || (n.setFixedDirection(n.fixedDirection), st(t, "onBeforeResize", St(t, e, {
      startFixedDirection: n.startFixedDirection,
      startFixedPosition: n.startFixedPosition,
      setFixedDirection: function(Bt) {
        var At;
        return n.setFixedDirection(Bt), At = z(vt(), 2), U = At[0], ut = At[1], [U, ut];
      },
      setFixedPosition: function(Bt) {
        var At;
        return n.setFixedPosition(Bt), At = z(vt(), 2), U = At[0], ut = At[1], [U, ut];
      },
      boundingWidth: U,
      boundingHeight: ut,
      setSize: function(Bt) {
        var At;
        At = z(Bt, 2), U = At[0], ut = At[1];
      }
    }, !0)));
    var wt = s;
    s || (!a && i ? wt = Ud(t, [0, 0]) : wt = n.fixedPosition);
    var ht = [0, 0];
    i || (ht = Yp(t, U, ut, Z, wt, !u && c, n)), l && (!l[0] && (ht[0] = 0), !l[1] && (ht[1] = 0));
    function ft() {
      var Bt;
      X && (Bt = z(X([U, ut]), 2), U = Bt[0], ut = Bt[1]), U = mt(U, G), ut = mt(ut, G);
    }
    if (ot) {
      rt[0] && rt[1] && ht[0] && ht[1] && (Y(ht[0]) > Y(ht[1]) ? ht[1] = 0 : ht[0] = 0);
      var yt = !ht[0] && !ht[1];
      yt && ft(), rt[0] && !rt[1] || ht[0] && !ht[1] || yt && T ? (U += ht[0], ut = U / h) : (!rt[0] && rt[1] || !ht[0] && ht[1] || yt && !T) && (ut += ht[1], U = ut * h);
    } else
      U += ht[0], ut += ht[1], U = Math.max(0, U), ut = Math.max(0, ut);
    r = z(Ki([U, ut], C, D, ot ? h : !1), 2), U = r[0], ut = r[1], ft(), ot && (f || et) && (T ? ut = U / h : U = ut * h), q = U - _, nt = ut - M;
    var _t = [q - b, nt - E];
    n.prevWidth = q, n.prevHeight = nt;
    var kt = $d(t, U, ut, wt, m, n);
    if (!(!tt && _t.every(function(Bt) {
      return !Bt;
    }) && kt.every(function(Bt) {
      return !Bt;
    }))) {
      var Ct = se.drag(t, Cn(e, t.state, kt, !!i, !1, "draggable")), Mt = Ct.transform, Gt = x + q, re = y + nt, Ft = St(t, e, P({ width: Gt, height: re, offsetWidth: Math.round(U), offsetHeight: Math.round(ut), startRatio: h, boundingWidth: U, boundingHeight: ut, direction: Z, dist: [q, nt], delta: _t, isPinch: !!i, drag: Ct }, Ru({
        style: {
          width: "".concat(Gt, "px"),
          height: "".concat(re, "px")
        },
        transform: Mt
      }, Ct, e)));
      return !d && st(t, "onResize", Ft), Ft;
    }
  },
  dragControlAfter: function(t, e) {
    var r = e.datas, n = r.isResize, a = r.startOffsetWidth, i = r.startOffsetHeight, o = r.prevWidth, s = r.prevHeight;
    if (!(!n || t.props.checkResizableError === !1)) {
      var l = t.state, u = l.width, c = l.height, f = u - (a + o), d = c - (i + s), p = Y(f) > 3, v = Y(d) > 3;
      if (p && (r.startWidth += f, r.startOffsetWidth += f, r.prevWidth += f), v && (r.startHeight += d, r.startOffsetHeight += d, r.prevHeight += d), p || v)
        return this.dragControl(t, e);
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.parentEvent;
    if (r.isResize) {
      r.isResize = !1;
      var a = ge(t, e, {});
      return !n && st(t, "onResizeEnd", a), a;
    }
  },
  dragGroupControlCondition: Ts,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, P(P({}, e), { isGroup: !0 }));
    if (!n)
      return !1;
    var a = Re(t, "resizable", e), i = r.startOffsetWidth, o = r.startOffsetHeight;
    function s() {
      var p = r.minSize;
      a.forEach(function(v) {
        var m = v.datas, x = m.minSize, y = m.startOffsetWidth, b = m.startOffsetHeight, E = i * (y ? x[0] / y : 0), C = o * (b ? x[1] / b : 0);
        p[0] = Math.max(p[0], E), p[1] = Math.max(p[1], C);
      });
    }
    function l() {
      var p = r.maxSize;
      a.forEach(function(v) {
        var m = v.datas, x = m.maxSize, y = m.startOffsetWidth, b = m.startOffsetHeight, E = i * (y ? x[0] / y : 0), C = o * (b ? x[1] / b : 0);
        p[0] = Math.min(p[0], E), p[1] = Math.min(p[1], C);
      });
    }
    var u = Ye(t, this, "dragControlStart", e, function(p, v) {
      return pa(t, p, r, v);
    });
    s(), l();
    var c = function(p) {
      n.setFixedDirection(p), u.forEach(function(v, m) {
        v.setFixedDirection(p), pa(t, v.moveable, r, a[m]);
      });
    };
    r.setFixedDirection = c;
    var f = P(P({}, n), { targets: t.props.targets, events: u.map(function(p) {
      return P(P({}, p), { setMin: function(v) {
        p.setMin(v), s();
      }, setMax: function(v) {
        p.setMax(v), l();
      } });
    }), setFixedDirection: c, setMin: function(p) {
      n.setMin(p), s();
    }, setMax: function(p) {
      n.setMax(p), l();
    } }), d = st(t, "onResizeGroupStart", f);
    return r.isResize = d !== !1, r.isResize ? n : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isResize) {
      var n = gr(t.props, "resizable");
      Pa(t, "onBeforeResize", function(p) {
        st(t, "onBeforeResizeGroup", St(t, e, P(P({}, p), { targets: n.targets }), !0));
      });
      var a = this.dragControl(t, P(P({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = n.keepRatio, u = [
          i / (i - s[0]),
          o / (o - s[1])
        ], c = r.fixedPosition, f = Ye(t, this, "dragControl", e, function(p, v) {
          var m = z(ae(xn(t.rotation / 180 * Math.PI, 3), [
            v.datas.originalX * u[0],
            v.datas.originalY * u[1],
            1
          ], 3), 2), x = m[0], y = m[1];
          return P(P({}, v), { parentDist: null, parentScale: u, dragClient: Dt(c, [x, y]), parentKeepRatio: l });
        }), d = P({ targets: n.targets, events: f }, a);
        return st(t, "onResizeGroup", d), d;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isResize) {
      this.dragControlEnd(t, e);
      var a = Ye(t, this, "dragControlEnd", e), i = ge(t, e, {
        targets: t.props.targets,
        events: a
      });
      return st(t, "onResizeGroupEnd", i), r;
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
function Za(t, e, r, n, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, u = jt(
    t.state.rootMatrix,
    // TO-DO #710
    pt([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), c = Dt([a.left, a.top], u);
  e.startAbsoluteOrigin = c, e.prevDeg = Ht(c, [r, n]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = Ne(c, [r, n]);
}
function ia(t, e, r) {
  var n = r.defaultDeg, a = r.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - n);
  return r.prevDeg = n + s, s;
}
function Ja(t, e, r, n) {
  return ia(Ht(n.startAbsoluteOrigin, [t, e]) / Math.PI * 180, r, n);
}
function Qa(t, e, r, n, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = r.prevSnapDeg, u = 0, c = !1;
  if (i) {
    var f = Wp(t, e, n, a + n);
    c = f.isSnap, u = a + f.dist;
  }
  c || (u = mt(a + n, s));
  var d = u - a;
  return r.prevSnapDeg = d, [d - l, d, u];
}
function gu(t, e, r) {
  var n = z(e, 4), a = n[0], i = n[1], o = n[2], s = n[3];
  if (t === "none")
    return [];
  if (Xt(t))
    return t.map(function(x) {
      return gu(x, [a, i, o, s], r)[0];
    });
  var l = z((t || "top").split("-"), 2), u = l[0], c = l[1], f = [a, i];
  u === "left" ? f = [o, a] : u === "right" ? f = [i, s] : u === "bottom" && (f = [s, o]);
  var d = [
    (f[0][0] + f[1][0]) / 2,
    (f[0][1] + f[1][1]) / 2
  ], p = _u(f, r);
  if (c) {
    var v = c === "top" || c === "left", m = u === "bottom" || u === "left";
    d = f[v && !m || !v && m ? 0 : 1];
  }
  return [[d, p]];
}
function Pi(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var r = e.inputEvent.target;
  if (Zt(r, dt("rotation-control")) || t.props.rotateAroundControls && Zt(r, dt("around-control")) || Zt(r, dt("control")) && Zt(r, dt("rotatable")))
    return !0;
  var n = t.props.rotationTarget;
  return n ? So(n, !0).some(function(a) {
    return a ? r === a || r.contains(a) : !1;
  }) : !1;
}
var kp = `.rotation {
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
`, Tp = {
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
  css: [kp],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? dt("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var r = gr(t.props, "rotatable"), n = r.rotatable, a = r.rotationPosition, i = r.zoom, o = r.renderDirections, s = r.rotateAroundControls, l = r.resolveAblesWithRotatable, u = t.getState(), c = u.renderPoses, f = u.direction;
    if (!n)
      return null;
    var d = gu(a, c, f), p = [];
    if (d.forEach(function(y, b) {
      var E = z(y, 2), C = E[0], D = E[1];
      p.push(e.createElement(
        "div",
        { key: "rotation".concat(b), className: dt("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(C[0], "px, ").concat(C[1], "px) rotate(").concat(D, "rad)")
        } },
        e.createElement("div", { className: dt("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: dt("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var v = Fr(l || {}), m = {};
      v.forEach(function(y) {
        l[y].forEach(function(b) {
          m[b] = y;
        });
      });
      var x = [];
      Xt(o) && (x = o.map(function(y) {
        var b = m[y];
        return {
          data: b ? { resolve: b } : {},
          classNames: b ? ["move"] : [],
          dir: y
        };
      })), p.push.apply(p, Q([], z(Ql(t, "rotatable", x, e)), !1));
    }
    return s && p.push.apply(p, Q([], z(au(t, e)), !1)), p;
  },
  dragControlCondition: Pi,
  dragControlStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, u = e.isPinch, c = e.isRequest, f = t.state, d = f.target, p = f.left, v = f.top, m = f.direction, x = f.beforeDirection, y = f.targetTransform, b = f.moveableClientRect, E = f.offsetMatrix, C = f.targetMatrix, D = f.allMatrix, h = f.width, _ = f.height;
    if (!c && !d)
      return !1;
    var M = t.getRect();
    a.rect = M, a.transform = y, a.left = p, a.top = v;
    var T = function(rt) {
      var q = hu(t.state, rt);
      a.fixedDirection = q.fixedDirection, a.fixedOffset = q.fixedOffset, a.fixedPosition = q.fixedPosition, G && G.setFixedPosition(rt);
    }, k = function(rt) {
      var q = Mp(t.state, rt);
      a.fixedDirection = q.fixedDirection, a.fixedOffset = q.fixedOffset, a.fixedPosition = q.fixedPosition, G && G.setFixedDirection(rt);
    }, A = i, O = o;
    if (c || u || l) {
      var I = s || 0;
      a.beforeInfo = {
        origin: M.beforeOrigin,
        prevDeg: I,
        defaultDeg: I,
        prevSnapDeg: 0,
        startDist: 0
      }, a.afterInfo = P(P({}, a.beforeInfo), { origin: M.origin }), a.absoluteInfo = P(P({}, a.beforeInfo), { origin: M.origin, startValue: I });
    } else {
      var N = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
      if (N) {
        var B = N.getAttribute("data-direction") || "", W = zd[B];
        if (W) {
          a.isControl = !0, a.isAroundControl = Zt(N, dt("around-control")), a.controlDirection = W;
          var H = N.getAttribute("data-resolve");
          H && (a.resolveAble = H);
          var L = av(f.rootMatrix, f.renderPoses, b);
          r = z(te(L, W), 2), A = r[0], O = r[1];
        }
      }
      a.beforeInfo = { origin: M.beforeOrigin }, a.afterInfo = { origin: M.origin }, a.absoluteInfo = {
        origin: M.origin,
        startValue: M.rotation
      };
      var X = T;
      T = function(rt) {
        var q = f.is3d ? 4 : 3, nt = z(Dt(Il(C, q), rt), 2), ot = nt[0], vt = nt[1], xt = ae(E, pr([ot, vt], q)), U = ae(D, pr([rt[0], rt[1]], q));
        X(rt);
        var ut = f.posDelta;
        a.beforeInfo.origin = pt(xt, ut), a.afterInfo.origin = pt(U, ut), a.absoluteInfo.origin = pt(U, ut), Za(t, a.beforeInfo, A, O, b), Za(t, a.afterInfo, A, O, b), Za(t, a.absoluteInfo, A, O, b);
      }, k = function(rt) {
        var q = te([
          [0, 0],
          [h, 0],
          [0, _],
          [h, _]
        ], rt);
        T(q);
      };
    }
    a.startClientX = A, a.startClientY = O, a.direction = m, a.beforeDirection = x, a.startValue = 0, a.datas = {}, Ma(t, e, "rotate");
    var V = !1, G = !1;
    if (a.isControl && a.resolveAble) {
      var tt = a.resolveAble;
      tt === "resizable" && (G = Ii.dragControlStart(t, P(P({}, new Ar("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    G || (V = se.dragStart(t, new Ar().dragStart([0, 0], e))), T(iv(t));
    var et = St(t, e, P(P({ set: function(rt) {
      a.startValue = rt * Math.PI / 180;
    }, setFixedDirection: k, setFixedPosition: T }, _a(t, e)), { dragStart: V, resizeStart: G })), Z = st(t, "onRotateStart", et);
    return a.isRotate = Z !== !1, f.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? et : !1;
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, u = e.parentFlag, c = e.isPinch, f = e.groupDelta, d = e.resolveMatrix, p = i.beforeDirection, v = i.beforeInfo, m = i.afterInfo, x = i.absoluteInfo, y = i.isRotate, b = i.startValue, E = i.rect, C = i.startClientX, D = i.startClientY;
    if (y) {
      wa(t, e, "rotate");
      var h = Nd(e), _ = p * h, M = t.props.parentMoveable, T = 0, k, A, O = 0, I, N, B = 0, W, H, L = 180 / Math.PI * b, X = x.startValue, V = !1, G = C + o, tt = D + s;
      if (!u && "parentDist" in e) {
        var et = e.parentDist;
        k = et, I = et, W = et;
      } else c || u ? (k = ia(l, p, v), I = ia(l, _, m), W = ia(l, _, x)) : (k = Ja(G, tt, p, v), I = Ja(G, tt, _, m), W = Ja(G, tt, _, x), V = !0);
      if (A = L + k, N = L + I, H = X + W, st(t, "onBeforeRotate", St(t, e, {
        beforeRotation: A,
        rotation: N,
        absoluteRotation: H,
        setRotation: function(wt) {
          I = wt - L, k = I, W = I;
        }
      }, !0)), r = z(Qa(t, E, v, k, L, V), 3), T = r[0], k = r[1], A = r[2], n = z(Qa(t, E, m, I, L, V), 3), O = n[0], I = n[1], N = n[2], a = z(Qa(t, E, x, W, X, V), 3), B = a[0], W = a[1], H = a[2], !(!B && !O && !T && !M && !d)) {
        var Z = Da(i, "rotate(".concat(N, "deg)"), "rotate(".concat(I, "deg)"));
        d && (i.fixedPosition = lo(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var rt = Vd(t, I, i), q = pt(Dt(f || [0, 0], rt), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = rt, i.requestValue = null;
        var nt = Kl(t, Z, q, c, e), ot = nt, vt = Ne([G, tt], x.startAbsoluteOrigin) - x.startDist, xt = void 0;
        if (i.resolveAble === "resizable") {
          var U = Ii.dragControl(t, P(P({}, Cn(e, t.state, [e.deltaX, e.deltaY], !!c, !1, "resizable")), { resolveMatrix: !0, parentDistance: vt }));
          U && (xt = U, ot = Ru(ot, U, e));
        }
        var ut = St(t, e, P(P({ delta: O, dist: I, rotate: N, rotation: N, beforeDist: k, beforeDelta: T, beforeRotate: A, beforeRotation: A, absoluteDist: W, absoluteDelta: B, absoluteRotate: H, absoluteRotation: H, isPinch: !!c, resize: xt }, nt), ot));
        return st(t, "onRotate", ut), ut;
      }
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      r.isRotate = !1;
      var n = ge(t, e, {});
      return st(t, "onRotateEnd", n), n;
    }
  },
  dragGroupControlCondition: Pi,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = t.state, a = n.left, i = n.top, o = n.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(r.beforeDirection * t.rotation);
    var l = Ye(t, this, "dragControlStart", e, function(f, d) {
      var p = f.state, v = p.left, m = p.top, x = p.beforeOrigin, y = Dt(pt([v, m], [a, i]), pt(x, o));
      return d.datas.startGroupClient = y, d.datas.groupClient = y, P(P({}, d), { parentRotate: 0 });
    }), u = P(P({}, s), { targets: t.props.targets, events: l }), c = st(t, "onRotateGroupStart", u);
    return r.isRotate = c !== !1, r.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      Pa(t, "onBeforeRotate", function(u) {
        st(t, "onBeforeRotateGroup", St(t, e, P(P({}, u), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = r.beforeDirection, i = n.beforeDist, o = i / 180 * Math.PI, s = Ye(t, this, "dragControl", e, function(u, c) {
          var f = c.datas.startGroupClient, d = z(c.datas.groupClient, 2), p = d[0], v = d[1], m = z(mn(f, o * a), 2), x = m[0], y = m[1], b = [x - p, y - v];
          return c.datas.groupClient = [x, y], P(P({}, c), { parentRotate: i, groupDelta: b });
        });
        t.rotation = a * n.beforeRotation;
        var l = P({ targets: t.props.targets, events: s, set: function(u) {
          t.rotation = u;
        }, setGroupRotation: function(u) {
          t.rotation = u;
        } }, n);
        return st(t, "onRotateGroup", l), l;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isRotate) {
      this.dragControlEnd(t, e);
      var a = Ye(t, this, "dragControlEnd", e), i = ge(t, e, {
        targets: t.props.targets,
        events: a
      });
      return st(t, "onRotateGroupEnd", i), r;
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
function Rp(t, e) {
  var r, n = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, u = n === "horizontal", c = u ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (r = {}, r[u ? "width" : "height"] = "".concat(i), r.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(c, "(-50%) scale").concat(c, "(").concat(s, ")"), r)
  });
}
function ho(t, e) {
  return Rp(P(P({}, t), { classNames: Q([
    dt("line", "guideline", t.direction)
  ], z(t.classNames), !1).filter(function(r) {
    return r;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(r) {
    return "".concat(mt(r, 0.1), "px");
  }) }), e);
}
function Rs(t, e, r, n, a, i, o, s) {
  var l = t.props.zoom;
  return r.map(function(u, c) {
    var f = u.type, d = u.pos, p = [0, 0];
    return p[o] = n, p[o ? 0 : 1] = -a + d, ho({
      key: "".concat(e, "TargetGuideline").concat(c),
      classNames: [dt("target", "bold", f)],
      posValue: p,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function Is(t, e, r, n, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, u = e === "horizontal" ? tr : er, c = a[u.start], f = a[u.end];
  return r.filter(function(d) {
    var p = d.hide, v = d.elementRect;
    if (p)
      return !1;
    if (l && v) {
      var m = v.rect;
      if (m[u.start] <= c && f <= m[u.end])
        return !1;
    }
    return !0;
  }).map(function(d, p) {
    var v = d.pos, m = d.size, x = d.element, y = d.className, b = [
      -n[0] + v[0],
      -n[1] + v[1]
    ];
    return ho({
      key: "".concat(e, "-default-guideline-").concat(p),
      classNames: x ? [dt("bold"), y] : [dt("normal"), y],
      direction: e,
      posValue: b,
      sizeValue: m,
      zoom: s
    }, i);
  });
}
function en(t, e, r, n, a, i, o, s) {
  var l, u = t.props, c = u.snapDigit, f = c === void 0 ? 0 : c, d = u.isDisplaySnapDigit, p = d === void 0 ? !0 : d, v = u.snapDistFormat, m = v === void 0 ? function(D, h) {
    return D;
  } : v, x = u.zoom, y = e === "horizontal" ? "X" : "Y", b = e === "vertical" ? "height" : "width", E = Math.abs(a), C = p ? parseFloat(E.toFixed(f)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(r, "-guideline-").concat(n), className: dt("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[b] = "".concat(E, "px"), l) },
    ho({
      direction: e,
      classNames: [dt(r), o],
      size: "100%",
      posValue: [0, 0],
      sizeValue: E,
      zoom: x
    }, s),
    s.createElement("div", { className: dt("size-value", "gap"), style: {
      transform: "translate".concat(y, "(-50%) scale(").concat(x, ")")
    } }, C > 0 ? m(C, e) : "")
  );
}
function Ip(t, e, r, n) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? tr : er, s = r[o.start], l = r[o.end];
  return Iu(e, function(u) {
    return u.pos[a];
  }).map(function(u) {
    var c = [], f = [], d = [];
    return u.forEach(function(p) {
      var v, m, x = p.element, y = p.elementRect.rect;
      if (y[o.end] < s)
        c.push(p);
      else if (l < y[o.start])
        f.push(p);
      else if (y[o.start] <= s && l <= y[o.end] && n) {
        var b = p.pos, E = { element: x, rect: P(P({}, y), (v = {}, v[o.end] = y[o.start], v)) }, C = { element: x, rect: P(P({}, y), (m = {}, m[o.start] = y[o.end], m)) }, D = [0, 0], h = [0, 0];
        D[a] = b[a], D[i] = b[i], h[a] = b[a], h[i] = b[i] + p.size, c.push({
          type: t,
          pos: D,
          size: 0,
          elementRect: E,
          direction: "",
          elementDirection: "end"
        }), f.push({
          type: t,
          pos: h,
          size: 0,
          elementRect: C,
          direction: "",
          elementDirection: "start"
        });
      }
    }), c.sort(function(p, v) {
      return v.pos[i] - p.pos[i];
    }), f.sort(function(p, v) {
      return p.pos[i] - v.pos[i];
    }), {
      total: u,
      start: c,
      end: f,
      inner: d
    };
  });
}
function Pp(t, e, r, n, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(x) {
      return x.type === s;
    }), u = s === "vertical" ? 1 : 0, c = u ? 0 : 1, f = Ip(s, l, n, i), d = u ? er : tr, p = u ? tr : er, v = n[d.start], m = n[d.end];
    f.forEach(function(x) {
      var y = x.total, b = x.start, E = x.end, C = x.inner, D = r[c] + y[0].pos[c] - n[p.start], h = n;
      b.forEach(function(_) {
        var M = _.elementRect.rect, T = h[d.start] - M[d.end];
        if (T > 0) {
          var k = [0, 0];
          k[u] = r[u] + h[d.start] - v - T, k[c] = D, o.push(en(t, s, "dashed", o.length, T, k, _.className, a));
        }
        h = M;
      }), h = n, E.forEach(function(_) {
        var M = _.elementRect.rect, T = M[d.start] - h[d.end];
        if (T > 0) {
          var k = [0, 0];
          k[u] = r[u] + h[d.end] - v, k[c] = D, o.push(en(t, s, "dashed", o.length, T, k, _.className, a));
        }
        h = M;
      }), C.forEach(function(_) {
        var M = _.elementRect.rect, T = v - M[d.start], k = M[d.end] - m, A = [0, 0], O = [0, 0];
        A[u] = r[u] - T, A[c] = D, O[u] = r[u] + m - v, O[c] = D, o.push(en(t, s, "dashed", o.length, T, A, _.className, a)), o.push(en(t, s, "dashed", o.length, k, O, _.className, a));
      });
    });
  }), o;
}
function Op(t, e, r, n, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(x) {
      return x.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, u = l ? 0 : 1, c = l ? er : tr, f = l ? tr : er, d = n[c.start], p = n[c.end], v = n[f.start], m = n[f.end];
    s.forEach(function(x) {
      var y = x.gap, b = x.gapRects, E = Math.max.apply(Math, Q([v], z(b.map(function(h) {
        var _ = h.rect;
        return _[f.start];
      })), !1)), C = Math.min.apply(Math, Q([m], z(b.map(function(h) {
        var _ = h.rect;
        return _[f.end];
      })), !1)), D = (E + C) / 2;
      E === C || D === (v + m) / 2 || b.forEach(function(h) {
        var _ = h.rect, M = h.className, T = [r[0], r[1]];
        if (_[c.end] < d)
          T[l] += _[c.end] - d;
        else if (p < _[c.start])
          T[l] += _[c.start] - d - y;
        else
          return;
        T[u] += D - v, i.push(en(t, l ? "vertical" : "horizontal", "gap", i.length, y, T, M, a));
      });
    });
  }), i;
}
function Oi(t) {
  var e, r, n = t.state, a = n.containerClientRect, i = n.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, u = a.clientHeight, c = a.clientWidth, f = a.clientLeft, d = a.clientTop, p = t.props, v = p.snapGap, m = v === void 0 ? !0 : v, x = p.verticalGuidelines, y = p.horizontalGuidelines, b = p.snapThreshold, E = b === void 0 ? 5 : b, C = p.maxSnapElementGuidelineDistance, D = C === void 0 ? 1 / 0 : C, h = p.isDisplayGridGuidelines, _ = Ee(_e(t.state)), M = _.top, T = _.left, k = _.bottom, A = _.right, O = { top: M, left: T, bottom: k, right: A, center: (T + A) / 2, middle: (M + k) / 2 }, I = Bp(t), N = Q([], z(I), !1), B = ((r = (e = n.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && r !== void 0 ? r : [1, 1]).map(function(X) {
    return X * E;
  });
  m && N.push.apply(N, Q([], z(zp(t, O, B)), !1));
  var W = P({}, n.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (N.push.apply(N, Q([], z(Np(t, o ? l : c, o ? s : u, f, d, W, h)), !1)), i) {
    var H = a.left, L = a.top;
    W.left += H, W.top += L, W.right += H, W.bottom += L;
  }
  return N.push.apply(N, Q([], z(xu(y || !1, x || !1, o ? l : c, o ? s : u, f, d, W)), !1)), N = N.filter(function(X) {
    var V = X.element, G = X.elementRect, tt = X.type;
    if (!V || !G)
      return !0;
    var et = G.rect;
    return mu(O, et, tt, D);
  }), N;
}
function zp(t, e, r) {
  var n = t.props, a = n.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = n.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, u = [];
  return [
    ["vertical", tr, er],
    ["horizontal", er, tr]
  ].forEach(function(c) {
    var f = z(c, 3), d = f[0], p = f[1], v = f[2], m = e[p.start], x = e[p.end], y = e[p.center], b = e[v.start], E = e[v.end], C = {
      left: r[0],
      top: r[1]
    };
    function D(M) {
      var T = M.rect, k = C[p.start];
      return T[p.end] < m + k ? m - T[p.end] : x - k < T[p.start] ? T[p.start] - x : -1;
    }
    var h = l.filter(function(M) {
      var T = M.rect;
      return T[v.start] > E || T[v.end] < b ? !1 : D(M) > 0;
    }).sort(function(M, T) {
      return D(M) - D(T);
    }), _ = [];
    h.forEach(function(M) {
      h.forEach(function(T) {
        if (M !== T) {
          var k = M.rect, A = T.rect, O = k[v.start], I = k[v.end], N = A[v.start], B = A[v.end];
          O > B || N > I || _.push([M, T]);
        }
      });
    }), _.forEach(function(M) {
      var T = z(M, 2), k = T[0], A = T[1], O = k.rect, I = A.rect, N = O[p.start], B = O[p.end], W = I[p.start], H = I[p.end], L = C[p.start], X = 0, V = 0, G = !1, tt = !1, et = !1;
      if (B <= m && x <= W) {
        if (tt = !0, X = (W - B - (x - m)) / 2, V = B + X + (x - m) / 2, Y(V - y) > L)
          return;
      } else if (B < W && H < m + L) {
        if (G = !0, X = W - B, V = H + X, Y(V - m) > L)
          return;
      } else if (B < W && x - L < N) {
        if (et = !0, X = W - B, V = N - X, Y(V - x) > L)
          return;
      } else
        return;
      X && mu(e, I, d, i) && (X > s || u.push({
        type: d,
        pos: d === "vertical" ? [V, 0] : [0, V],
        element: A.element,
        size: 0,
        className: A.className,
        isStart: G,
        isCenter: tt,
        isEnd: et,
        gap: X,
        hide: !0,
        gapRects: [k, A],
        direction: "",
        elementDirection: ""
      }));
    });
  }), u;
}
function Ap(t, e, r, n) {
  var a, i, o = t.props, s = t.state, l = o.snapGridAll, u = o.snapGridWidth, c = u === void 0 ? 0 : u, f = o.snapGridHeight, d = f === void 0 ? 0 : f, p = s.snapRenderInfo, v = p && (((a = p.direction) === null || a === void 0 ? void 0 : a[0]) || ((i = p.direction) === null || i === void 0 ? void 0 : i[1])), m = t.moveables;
  if (l && m && v && (c || d)) {
    if (s.snapThresholdInfo)
      return;
    s.snapThresholdInfo = {
      multiples: [1, 1],
      offset: [0, 0]
    };
    var x = t.getRect(), y = x.children, b = p.direction;
    if (y) {
      var E = b.map(function(D, h) {
        var _ = h === 0 ? {
          snapSize: c,
          posName: "left",
          sizeName: "width",
          clientOffset: n.left - e
        } : {
          snapSize: d,
          posName: "top",
          sizeName: "height",
          clientOffset: n.top - r
        }, M = _.snapSize, T = _.posName, k = _.sizeName, A = _.clientOffset;
        if (!M)
          return {
            dir: D,
            multiple: 1,
            snapSize: M,
            snapOffset: 0
          };
        var O = x[k], I = x[T], N = zf(y.map(function(G) {
          return [
            G[T] - I,
            G[k],
            O - G[k] - G[T] + I
          ];
        })).filter(function(G) {
          return G;
        }).sort(function(G, tt) {
          return G - tt;
        }), B = N[0], W = N.map(function(G) {
          return mt(G / B, 0.1) * M;
        }), H = 1, L = mt(O / B, 0.1);
        for (H = 1; H <= 10 && !W.every(function(G) {
          return G * H % 1 === 0;
        }); ++H)
          ;
        var X = (-D + 1) / 2, V = sa(I - A, I - A + O, X, 1 - X);
        return {
          multiple: L * H,
          dir: D,
          snapSize: M,
          snapOffset: Math.round(V / M)
        };
      }), C = E.map(function(D) {
        return D.multiple || 1;
      });
      s.snapThresholdInfo.multiples = C, s.snapThresholdInfo.offset = E.map(function(D) {
        return D.snapOffset;
      }), E.forEach(function(D, h) {
        D.snapSize;
      });
    }
  } else
    s.snapThresholdInfo = null;
}
function Np(t, e, r, n, a, i, o) {
  n === void 0 && (n = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, u = s.snapGridWidth, c = u === void 0 ? 0 : u, f = s.snapGridHeight, d = f === void 0 ? 0 : f, p = [], v = i.left, m = i.top, x = [0, 0];
  Ap(t, n, a, i);
  var y = l.snapThresholdInfo, b = c, E = d;
  if (y && (c *= y.multiples[0] || 1, d *= y.multiples[1] || 1, x = y.offset), d) {
    for (var C = function(h) {
      p.push({
        type: "horizontal",
        pos: [
          v,
          mt(x[1] * E + h - a + m, 0.1)
        ],
        className: dt("grid-guideline"),
        size: e,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, D = 0; D <= r * 2; D += d)
      C(D);
    for (var D = -d; D >= -r; D -= d)
      C(D);
  }
  if (c) {
    for (var C = function(_) {
      p.push({
        type: "vertical",
        pos: [
          mt(x[0] * b + _ - n + v, 0.1),
          m
        ],
        className: dt("grid-guideline"),
        size: r,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, D = 0; D <= e * 2; D += c)
      C(D);
    for (var D = -c; D >= -e; D -= c)
      C(D);
  }
  return p;
}
function mu(t, e, r, n) {
  return r === "horizontal" ? Y(t.right - e.left) <= n || Y(t.left - e.right) <= n || t.left <= e.right && e.left <= t.right : r === "vertical" ? Y(t.bottom - e.top) <= n || Y(t.top - e.bottom) <= n || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function Bp(t) {
  var e = t.state, r = t.props.elementGuidelines, n = r === void 0 ? [] : r;
  if (!n.length)
    return e.elementRects = [], [];
  var a = (e.elementRects || []).filter(function(d) {
    return !d.refresh;
  }), i = n.map(function(d) {
    return ve(d) && "element" in d ? P(P({}, d), { element: Be(d.element, !0) }) : {
      element: Be(d, !0)
    };
  }).filter(function(d) {
    return d.element;
  }), o = Dr(a.map(function(d) {
    return d.element;
  }), i.map(function(d) {
    return d.element;
  })), s = o.maintained, l = o.added, u = [];
  s.forEach(function(d) {
    var p = z(d, 2), v = p[0], m = p[1];
    u[m] = a[v];
  }), jp(t, l.map(function(d) {
    return i[d];
  })).map(function(d, p) {
    u[l[p]] = d;
  }), e.elementRects = u;
  var c = co(t.props.elementSnapDirections), f = [];
  return u.forEach(function(d) {
    var p = d.element, v = d.top, m = v === void 0 ? c.top : v, x = d.left, y = x === void 0 ? c.left : x, b = d.right, E = b === void 0 ? c.right : b, C = d.bottom, D = C === void 0 ? c.bottom : C, h = d.center, _ = h === void 0 ? c.center : h, M = d.middle, T = M === void 0 ? c.middle : M, k = d.className, A = d.rect, O = fo({
      top: m,
      right: E,
      left: y,
      bottom: D,
      center: _,
      middle: T
    }, A), I = O.horizontal, N = O.vertical, B = O.horizontalNames, W = O.verticalNames, H = A.top, L = A.left, X = A.right - L, V = A.bottom - H, G = [X, V];
    N.forEach(function(tt, et) {
      f.push({
        type: "vertical",
        element: p,
        pos: [
          mt(tt, 0.1),
          H
        ],
        size: V,
        sizes: G,
        className: k,
        elementRect: d,
        elementDirection: Cs[W[et]] || W[et],
        direction: ""
      });
    }), I.forEach(function(tt, et) {
      f.push({
        type: "horizontal",
        element: p,
        pos: [
          L,
          mt(tt, 0.1)
        ],
        size: X,
        sizes: G,
        className: k,
        elementRect: d,
        elementDirection: Cs[B[et]] || B[et],
        direction: ""
      });
    });
  }), f;
}
function Ps(t, e) {
  return t ? t.map(function(r) {
    var n = ve(r) ? r : { pos: r }, a = n.pos;
    return dn(a) ? n : P(P({}, n), { pos: It(a, e) });
  }) : [];
}
function xu(t, e, r, n, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, u = o.top, c = o.bottom, f = o.right, d = r + f - l, p = n + c - u;
  return Ps(t, p).forEach(function(v) {
    s.push({
      type: "horizontal",
      pos: [
        l,
        mt(v.pos - i + u, 0.1)
      ],
      size: d,
      className: v.className,
      direction: ""
    });
  }), Ps(e, d).forEach(function(v) {
    s.push({
      type: "vertical",
      pos: [
        mt(v.pos - a + l, 0.1),
        u
      ],
      size: p,
      className: v.className,
      direction: ""
    });
  }), s;
}
function jp(t, e) {
  if (!e.length)
    return [];
  var r = t.props.groupable, n = t.state, a = n.containerClientRect, i = n.rootMatrix, o = n.is3d, s = n.offsetDelta, l = o ? 4 : 3, u = z(lp(i, a, l), 2), c = u[0], f = u[1], d = r ? 0 : s[0], p = r ? 0 : s[1];
  return e.map(function(v) {
    var m = v.element.getBoundingClientRect(), x = m.left - c - d, y = m.top - f - p, b = y + m.height, E = x + m.width, C = z(jr(i, [x, y], l), 2), D = C[0], h = C[1], _ = z(jr(i, [E, b], l), 2), M = _[0], T = _[1];
    return P(P({}, v), { rect: {
      left: D,
      right: M,
      top: h,
      bottom: T,
      center: (D + M) / 2,
      middle: (h + T) / 2
    } });
  });
}
function $n(t) {
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
    var o = Be(n, !0);
    if (o) {
      var s = un(o), l = js(e, [
        s.left - a.left,
        s.top - a.top
      ]), u = js(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = mt(l[0], 1e-5), i.top = mt(l[1], 1e-5), i.right = mt(u[0], 1e-5), i.bottom = mt(u[1], 1e-5);
    }
  }
  return e.snapContainer = n, e.snapOffset = i, e.guidelines = Oi(t), e.enableSnap = !0, !0;
}
function yu(t, e, r, n, a, i) {
  var o = xr(t, e, r, i ? 4 : 3), s = te(o, n);
  return mo(o, pt(a, s));
}
function Os(t) {
  return t ? t / Y(t) : 0;
}
function Gp(t, e, r, n, a, i) {
  var o = i.fixedDirection, s = dp(r, o, n), l = vo(t, e, r, n), u = Q(Q([], z(wp(t, e, s, n, a, i)), !1), z(pu(t, l, i)), !1), c = va(u, 0), f = va(u, 1);
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
function Fp(t, e, r, n, a, i, o, s, l) {
  var u = te(e, o), c = Ra(t, s, {
    vertical: [u[0]],
    horizontal: [u[1]]
  }), f = c.horizontal.offset, d = c.vertical.offset;
  if (mt(d, _i) || mt(f, _i)) {
    var p = z(je({
      datas: l,
      distX: -d,
      distY: -f
    }), 2), v = p[0], m = p[1], x = Math.min(a || 1 / 0, r + o[0] * v), y = Math.min(i || 1 / 0, n + o[1] * m);
    return [x - r, y - n];
  }
  return [0, 0];
}
function bu(t, e, r, n, a, i, o, s) {
  for (var l = _e(t.state), u = t.props.keepRatio, c = 0, f = 0, d = 0; d < 2; ++d) {
    var p = e(c, f), v = Gp(t, p, a, u, o, s), m = v.width, x = v.height, y = m.isBound, b = x.isBound, E = m.offset, C = x.offset;
    if (d === 1 && (y || (E = 0), b || (C = 0)), d === 0 && o && !y && !b)
      return [0, 0];
    if (u) {
      var D = Y(E) * (r ? 1 / r : 1), h = Y(C) * (n ? 1 / n : 1), _ = y && b ? D < h : b || !y && D < h;
      _ ? E = r * C / n : C = n * E / r;
    }
    c += E, f += C;
  }
  if (!u && a[0] && a[1]) {
    var M = _p(t, l, a, i, s), T = M.maxWidth, k = M.maxHeight, A = z(Fp(t, e(c, f).map(function(N) {
      return N.map(function(B) {
        return mt(B, _i);
      });
    }), r + c, n + f, T, k, a, o, s), 2), E = A[0], C = A[1];
    c += E, f += C;
  }
  return [c, f];
}
function sn(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function Lp(t, e) {
  e = sn(e);
  var r = Math.floor(t / 360), n = r * 360 + 360 - e, a = r * 360 + e;
  return Y(t - n) < Y(t - a) ? n : a;
}
function ti(t, e) {
  t = sn(t), e = sn(e);
  var r = sn(t - e);
  return Math.min(r, 360 - r);
}
function Wp(t, e, r, n) {
  var a, i = t.props, o = (a = i[iu]) !== null && a !== void 0 ? a : 5, s = i[ou];
  if (Yr(t, "rotatable")) {
    var l = e.pos1, u = e.pos2, c = e.pos3, f = e.pos4, d = e.origin, p = r * Math.PI / 180, v = [l, u, c, f].map(function(C) {
      return pt(C, d);
    }), m = v.map(function(C) {
      return mn(C, p);
    }), x = Q(Q([], z(ap(t, v, m, d, r)), !1), z(xp(t, v, m, d, r)), !1);
    x.sort(function(C, D) {
      return Y(C - r) - Y(D - r);
    });
    var y = x.length > 0;
    if (y)
      return {
        isSnap: y,
        dist: y ? x[0] : r
      };
  }
  if (s != null && s.length && o) {
    var b = s.slice().sort(function(C, D) {
      return ti(C, n) - ti(D, n);
    }), E = b[0];
    if (ti(E, n) <= o)
      return {
        isSnap: !0,
        dist: r + Lp(n, E) - n
      };
  }
  return {
    isSnap: !1,
    dist: r
  };
}
function Yp(t, e, r, n, a, i, o) {
  if (!Yr(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, u = t.state, c = u.allMatrix, f = u.is3d;
  return bu(t, function(d, p) {
    return yu(l || c, e + d, r + p, s, a, f);
  }, e, r, n, a, i, o);
}
function Xp(t, e, r, n, a) {
  if (!Yr(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, u = a.is3d, c = bu(t, function(f, d) {
    return yu(Yd(a, Dt(e, [f / i, d / o])), i, o, l, s, u);
  }, i, o, r, s, n, a);
  return [c[0] / i, c[1] / o];
}
function Hp(t, e) {
  e.absolutePoses = _e(t.state);
}
function zs(t) {
  var e = [];
  return t.forEach(function(r) {
    r.guidelineInfos.forEach(function(n) {
      var a = n.guideline;
      he(e, function(i) {
        return i.guideline === a;
      }) || (a.direction = "", e.push({ guideline: a, posInfo: r }));
    });
  }), e.map(function(r) {
    var n = r.guideline, a = r.posInfo;
    return P(P({}, n), { direction: a.direction });
  });
}
function As(t, e, r, n, a, i) {
  var o = uo(ka(t, i), e, r), s = o.vertical, l = o.horizontal, u = kr();
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
  var c = yp(t), f = c.boundMap, d = c.vertical, p = c.horizontal;
  return d.forEach(function(v) {
    Xe(n, function(m) {
      var x = m.type, y = m.pos;
      return x === "bounds" && y === v;
    }) >= 0 || n.push({
      type: "bounds",
      pos: v
    });
  }), p.forEach(function(v) {
    Xe(a, function(m) {
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
var qp = bo("", ["resizable", "scalable"]), Vp = {
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
    iu,
    ou,
    su,
    lu,
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
    if (!u || !u.render || !Yr(t, ""))
      return Rr(t, "boundMap", kr(), function(Z) {
        return JSON.stringify(Z);
      }), Rr(t, "innerBoundMap", kr(), function(Z) {
        return JSON.stringify(Z);
      }), [];
    r.guidelines = Oi(t);
    var d = Math.min(i[0], o[0], s[0], l[0]), p = Math.min(i[1], o[1], s[1], l[1]), v = u.externalPoses || [], m = _e(t.state), x = [], y = [], b = [], E = [], C = [], D = Ee(m), h = D.width, _ = D.height, M = D.top, T = D.left, k = D.bottom, A = D.right, O = { left: T, right: A, top: M, bottom: k, center: (T + A) / 2, middle: (M + k) / 2 }, I = v.length > 0, N = I ? Ee(v) : {};
    if (!u.request) {
      if (u.direction && C.push(fp(t, m, u.direction, f, f)), u.snap) {
        var B = Ee(m);
        u.center && (B.middle = (B.top + B.bottom) / 2, B.center = (B.left + B.right) / 2), C.push(Es(t, B, f, f));
      }
      I && (u.center && (N.middle = (N.top + N.bottom) / 2, N.center = (N.left + N.right) / 2), C.push(Es(t, N, f, f))), C.forEach(function(Z) {
        var rt = Z.vertical.posInfos, q = Z.horizontal.posInfos;
        x.push.apply(x, Q([], z(rt.filter(function(nt) {
          var ot = nt.guidelineInfos;
          return ot.some(function(vt) {
            var xt = vt.guideline;
            return !xt.hide;
          });
        }).map(function(nt) {
          return {
            type: "snap",
            pos: nt.pos
          };
        })), !1)), y.push.apply(y, Q([], z(q.filter(function(nt) {
          var ot = nt.guidelineInfos;
          return ot.some(function(vt) {
            var xt = vt.guideline;
            return !xt.hide;
          });
        }).map(function(nt) {
          return {
            type: "snap",
            pos: nt.pos
          };
        })), !1)), b.push.apply(b, Q([], z(zs(rt)), !1)), E.push.apply(E, Q([], z(zs(q)), !1));
      });
    }
    var W = As(t, [T, A], [M, k], x, y), H = W.boundMap, L = W.innerBoundMap;
    I && As(t, [N.left, N.right], [N.top, N.bottom], x, y, u.externalBounds);
    var X = Q(Q([], z(b), !1), z(E), !1), V = X.filter(function(Z) {
      return Z.element && !Z.gapRects;
    }), G = X.filter(function(Z) {
      return Z.gapRects;
    }).sort(function(Z, rt) {
      return Z.gap - rt.gap;
    });
    st(t, "onSnap", {
      guidelines: X.filter(function(Z) {
        var rt = Z.element;
        return !rt;
      }),
      elements: V,
      gaps: G
    }, !0);
    var tt = Rr(t, "boundMap", H, function(Z) {
      return JSON.stringify(Z);
    }, kr()), et = Rr(t, "innerBoundMap", L, function(Z) {
      return JSON.stringify(Z);
    }, kr());
    return (H === tt || L === et) && st(t, "onBound", {
      bounds: H,
      innerBounds: L
    }, !0), Q(Q(Q(Q(Q(Q([], z(Pp(t, V, [d, p], O, e)), !1), z(Op(t, G, [d, p], O, e)), !1), z(Is(t, "horizontal", E, [a, n], O, e)), !1), z(Is(t, "vertical", b, [a, n], O, e)), !1), z(Rs(t, "horizontal", y, d, n, h, 0, e)), !1), z(Rs(t, "vertical", x, p, a, _, 1, e)), !1);
  },
  dragStart: function(t, e) {
    t.state.snapRenderInfo = {
      request: e.isRequest,
      snap: !0,
      center: !0
    }, $n(t);
  },
  drag: function(t) {
    var e = t.state;
    $n(t) || (e.guidelines = Oi(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (qp(t, e) || Pi(t, e))
      return !0;
    if (!e.isRequest && e.inputEvent)
      return Zt(e.inputEvent.target, dt("snap-control"));
  },
  dragControlStart: function(t) {
    t.state.snapRenderInfo = null, $n(t);
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
    t.state.snapRenderInfo = null, $n(t);
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
function $p(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function dt() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return mf.apply(void 0, Q([io], z(t), !1));
}
function Su(t) {
  t();
}
function Up(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : ve(t) ? t : Or(t);
}
function ln(t, e, r) {
  return ua(e, vr(r, e), t, vr(r.map(function(n) {
    return -n;
  }), e));
}
function Kp(t, e, r) {
  if (e === "%") {
    var n = go(t.ownerSVGElement);
    return n[r ? "width" : "height"] / 100;
  }
  return 1;
}
function Zp(t) {
  var e = Jp(xo(t, ":before"));
  return e.map(function(r, n) {
    var a = dr(r), i = a.value, o = a.unit;
    return i * Kp(t, o, n === 0);
  });
}
function ga(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function Jp(t) {
  return ga(t.transformOrigin);
}
function Cu(t) {
  var e = pe(t), r = e("transform");
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
function gn(t, e, r, n, a) {
  var i, o, s = Ji(t) || rr(t), l = !1, u, c;
  if (!t || r)
    u = t;
  else {
    var f = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, d = t.parentElement;
    f ? (l = !0, c = d, u = f) : u = d;
  }
  for (var p = !1, v = t === e || u === e, m = "relative", x = 1, y = parseFloat(a == null ? void 0 : a("zoom")) || 1, b = a == null ? void 0 : a("position"); u && u !== s; ) {
    e === u && (v = !0);
    var E = pe(u), C = u.tagName.toLowerCase(), D = Cu(u), h = E("willChange"), _ = parseFloat(E("zoom")) || 1;
    if (m = E("position"), n && _ !== 1) {
      x = _;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !r && n && y !== 1 && b && b !== "absolute" || C === "svg" || C === "foreignobject" || m !== "static" || D && D !== "none" || h === "transform"
    )
      break;
    var M = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, T = u.parentNode;
    M && (l = !0, c = T);
    var k = T;
    if (k && k.nodeType === 11) {
      u = k.host, p = !0, m = pe(u)("position");
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
    isEnd: v || !u || u === s,
    offsetParent: u || s
  };
}
function Qp(t, e) {
  var r, n = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = pe(t), s = Vi(a), l = !s, u, c;
  return !l && (n !== "svg" || t.ownerSVGElement) ? (u = Wl ? Zp(t) : ga(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), c = u.slice(), l = !0, n === "svg" ? (a = 0, i = 0) : (r = z(rv(t, u, t === e && e.tagName.toLowerCase() === "g"), 4), a = r[0], i = r[1], u[0] = r[2], u[1] = r[3])) : (u = ga(o("transformOrigin")).map(function(f) {
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
function Eu(t, e) {
  var r = pe(t), n = pe(rr(t)), a = n("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(n("marginLeft"), 10), o = parseInt(n("marginTop"), 10);
  return r("position") === "absolute" && ((r("top") !== "auto" || r("bottom") !== "auto") && (o = 0), (r("left") !== "auto" || r("right") !== "auto") && (i = 0)), [i, o];
}
function zi(t) {
  t.forEach(function(e) {
    var r = e.matrix;
    r && (e.matrix = Pe(r, 3, 4));
  });
}
function tv(t) {
  for (var e = t.parentElement, r = !1, n = rr(t); e; ) {
    var a = xo(e).transform;
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
function Ia(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(Pl(t, !e).join(","), ")");
}
function go(t) {
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
function ev(t, e) {
  var r, n = go(t), a = n.width, i = n.height, o = n.clientWidth, s = n.clientHeight, l = o / a, u = s / i, c = t.preserveAspectRatio.baseVal, f = c.align, d = c.meetOrSlice, p = [0, 0], v = [l, u], m = [0, 0];
  if (f !== 1) {
    var x = (f - 2) % 3, y = Math.floor((f - 2) / 3);
    p[0] = a * x / 2, p[1] = i * y / 2;
    var b = d === 2 ? Math.max(u, l) : Math.min(l, u);
    v[0] = b, v[1] = b, m[0] = (o - a) / 2 * x, m[1] = (s - i) / 2 * y;
  }
  var E = Qi(v, e);
  return r = z(m, 2), E[e * (e - 1)] = r[0], E[e * (e - 1) + 1] = r[1], ln(E, e, p);
}
function rv(t, e, r) {
  var n = t.tagName.toLowerCase();
  if (!t.getBBox || !r && n === "g")
    return [0, 0, 0, 0];
  var a = pe(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = go(t.ownerSVGElement), l = o.x, u = o.y;
  n === "foreignobject" && !l && !u && (l = parseFloat(t.getAttribute("x")) || 0, u = parseFloat(t.getAttribute("y")) || 0);
  var c = l - s.x, f = u - s.y, d = i ? e[0] : e[0] - c, p = i ? e[1] : e[1] - f;
  return [c, f, d, p];
}
function jt(t, e, r) {
  return ae(t, pr(e, r), r);
}
function xr(t, e, r, n) {
  return [[0, 0], [e, 0], [0, r], [e, r]].map(function(a) {
    return jt(t, a, n);
  });
}
function Ee(t) {
  var e = t.map(function(u) {
    return u[0];
  }), r = t.map(function(u) {
    return u[1];
  }), n = Math.min.apply(Math, Q([], z(e), !1)), a = Math.min.apply(Math, Q([], z(r), !1)), i = Math.max.apply(Math, Q([], z(e), !1)), o = Math.max.apply(Math, Q([], z(r), !1)), s = i - n, l = o - a;
  return {
    left: n,
    top: a,
    right: i,
    bottom: o,
    width: s,
    height: l
  };
}
function Ns(t, e, r, n) {
  var a = xr(t, e, r, n);
  return Ee(a);
}
function nv(t, e, r, n, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, u = Du(o), c = u.offsetWidth, f = u.offsetHeight, d = r.getBoundingClientRect(), p = [0, 0];
  r === rr(r) && (p = Eu(o, !0));
  for (var v = o.getBoundingClientRect(), m = v.left - d.left + r.scrollLeft - (r.clientLeft || 0) + p[0], x = v.top - d.top + r.scrollTop - (r.clientTop || 0) + p[1], y = v.width, b = v.height, E = ua(n, a, l), C = Ns(E, c, f, n), D = C.left, h = C.top, _ = C.width, M = C.height, T = jt(E, s, n), k = pt(T, [D, h]), A = [
    m + k[0] * y / _,
    x + k[1] * b / M
  ], O = [0, 0], I = 0; ++I < 10; ) {
    var N = Ie(a, n);
    i = z(pt(jt(N, A, n), jt(N, T, n)), 2), O[0] = i[0], O[1] = i[1];
    var B = ua(n, a, vr(O, n), l), W = Ns(B, c, f, n), H = W.left, L = W.top, X = H - m, V = L - x;
    if (Y(X) < 2 && Y(V) < 2)
      break;
    A[0] -= X, A[1] -= V;
  }
  return O.map(function(G) {
    return Math.round(G);
  });
}
function av(t, e, r) {
  var n = t.length === 16, a = n ? 4 : 3, i = e.map(function(l) {
    return jt(t, l, a);
  }), o = r.left, s = r.top;
  return i.map(function(l) {
    return [l[0] + o, l[1] + s];
  });
}
function De(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
}
function wu(t, e) {
  return De([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function rn(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = Ht(t, e));
  var a = wu(t, e);
  return {
    transform: "translateY(-50%) translate(".concat(t[0], "px, ").concat(t[1], "px) rotate(").concat(n, "rad) scaleY(").concat(r, ")"),
    width: "".concat(a, "px")
  };
}
function ma(t, e) {
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
function gr(t, e) {
  var r = t[e];
  return ve(r) ? P(P({}, t), r) : t;
}
function Du(t) {
  var e = t && !Vi(t.offsetWidth), r = 0, n = 0, a = 0, i = 0, o = 0, s = 0, l = 0, u = 0, c = 0, f = 0, d = 0, p = 0, v = 1 / 0, m = 1 / 0, x = 1 / 0, y = 1 / 0, b = 0, E = 0, C = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var D = t.getBBox();
      C = !0, r = D.width, n = D.height, o = r, s = n, l = r, u = n, a = r, i = n;
    } else {
      var h = pe(t), _ = t.style, M = h("boxSizing") === "border-box", T = parseFloat(h("borderLeftWidth")) || 0, k = parseFloat(h("borderRightWidth")) || 0, A = parseFloat(h("borderTopWidth")) || 0, O = parseFloat(h("borderBottomWidth")) || 0, I = parseFloat(h("paddingLeft")) || 0, N = parseFloat(h("paddingRight")) || 0, B = parseFloat(h("paddingTop")) || 0, W = parseFloat(h("paddingBottom")) || 0, H = I + N, L = B + W, X = T + k, V = A + O, G = H + X, tt = L + V, et = h("position"), Z = 0, rt = 0;
      if ("clientLeft" in t) {
        var q = null;
        if (et === "absolute") {
          var nt = gn(t, rr(t));
          q = nt.offsetParent;
        } else
          q = t.parentElement;
        if (q) {
          var ot = pe(q);
          Z = parseFloat(ot("width")), rt = parseFloat(ot("height"));
        }
      }
      c = Math.max(H, It(h("minWidth"), Z) || 0), f = Math.max(L, It(h("minHeight"), rt) || 0), v = It(h("maxWidth"), Z), m = It(h("maxHeight"), rt), isNaN(v) && (v = 1 / 0), isNaN(m) && (m = 1 / 0), b = It(_.width, 0) || 0, E = It(_.height, 0) || 0, o = parseFloat(h("width")) || 0, s = parseFloat(h("height")) || 0, l = Y(o - b) < 1 ? la(c, b || o, v) : o, u = Y(s - E) < 1 ? la(f, E || s, m) : s, r = l, n = u, a = l, i = u, M ? (x = v, y = m, d = c, p = f, l = r - G, u = n - tt) : (x = v + G, y = m + tt, d = c + G, p = f + tt, r = l + G, n = u + tt), a = l + H, i = u + L;
    }
  return {
    svg: C,
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
    maxWidth: v,
    maxHeight: m,
    minOffsetWidth: d,
    minOffsetHeight: p,
    maxOffsetWidth: x,
    maxOffsetHeight: y
  };
}
function _u(t, e) {
  return Ht(e > 0 ? t[0] : t[1], e > 0 ? t[1] : t[0]);
}
function Un() {
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
function Mu(t, e) {
  var r = t === rr(t) || t === Ji(t), n = {
    clientLeft: t.clientLeft,
    clientTop: t.clientTop,
    clientWidth: t.clientWidth,
    clientHeight: t.clientHeight,
    scrollWidth: t.scrollWidth,
    scrollHeight: t.scrollHeight,
    overflow: !1
  };
  return r && (n.clientHeight = Math.max(e.height, n.clientHeight), n.scrollHeight = Math.max(e.height, n.scrollHeight)), n.overflow = pe(t)("overflow") !== "visible", P(P({}, e), n);
}
function ei(t, e, r, n) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, u = e.left, c = {
    left: u + a,
    top: l + o,
    right: u + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return r && n ? Mu(r, c) : c;
}
function un(t, e) {
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
  return t && e ? Mu(t, s) : s;
}
function iv(t) {
  var e = t.props, r = e.groupable, n = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !r && s && n ? Co(n, i, o) : l;
}
function ku(t, e, r, n) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = r.target;
    a = Tu(i, n);
  }
  return a;
}
function Tu(t, e) {
  if (t) {
    var r = t.getAttribute("data-rotation") || "", n = t.getAttribute("data-direction");
    if (e.deg = r, !!n) {
      var a = [0, 0];
      return n.indexOf("w") > -1 && (a[0] = -1), n.indexOf("e") > -1 && (a[0] = 1), n.indexOf("n") > -1 && (a[1] = -1), n.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function mo(t, e) {
  return [
    Dt(e, t[0]),
    Dt(e, t[1]),
    Dt(e, t[2]),
    Dt(e, t[3])
  ];
}
function _e(t) {
  var e = t.left, r = t.top, n = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return mo([n, a, i, o], [e, r]);
}
function Ai(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(r) {
    r.unset && r.unset(t);
  });
}
function Tr(t, e) {
  var r = e ? "controlGesto" : "targetGesto", n = t[r];
  (n == null ? void 0 : n.isIdle()) === !1 && Ai(t, e), n == null || n.unset(), t[r] = null;
}
function ue(t, e) {
  if (e) {
    var r = Wr(e);
    r.nextStyle = P(P({}, r.nextStyle), t);
  }
  return {
    style: t,
    cssText: Fr(t).map(function(n) {
      return "".concat(Tf(n, "-"), ": ").concat(t[n], ";");
    }).join("")
  };
}
function Ru(t, e, r) {
  var n = e.afterTransform || e.transform;
  return P(P({}, ue(P(P(P({}, t.style), e.style), { transform: n }), r)), { afterTransform: n, transform: t.transform });
}
function St(t, e, r, n) {
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
function ge(t, e, r) {
  var n = e.datas, a = "isDrag" in r ? r.isDrag : e.isDrag;
  return n.datas || (n.datas = {}), P(P({ isDrag: a }, r), { moveable: t, target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, lastEvent: n.lastEvent, isDouble: e.isDouble, datas: n.datas, isFirstDrag: !!e.isFirstDrag });
}
function Pa(t, e, r) {
  t._emitter.on(e, r);
}
function st(t, e, r, n, a) {
  return t.triggerEvent(e, r, n, a);
}
function xo(t, e) {
  return Ce(t).getComputedStyle(t, e);
}
function Kn(t, e, r) {
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
function Ni(t, e) {
  return t === e || t == null && e == null;
}
function Bs() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var r = t.length - 1, n = 0; n < r; ++n) {
    var a = t[n];
    if (!Vi(a))
      return a;
  }
  return t[r];
}
function Iu(t, e) {
  var r = [], n = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n.indexOf(o), l = r[s] || [];
    s === -1 && (n.push(o), r.push(l)), l.push(a);
  }), r;
}
function ov(t, e) {
  var r = [], n = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n[o];
    s || (s = [], n[o] = s, r.push(s)), s.push(a);
  }), r;
}
function Pu(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function Br() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return t.sort(function(r, n) {
    return Y(n) - Y(r);
  }), t[0];
}
function jr(t, e, r) {
  return ae(Ie(t, r), pr(e, r), r);
}
function sv(t, e) {
  var r, n = t.is3d, a = t.rootMatrix, i = n ? 4 : 3;
  return r = z(jr(a, [e.distX, e.distY], i), 2), e.distX = r[0], e.distY = r[1], e;
}
function Se(t, e, r, n) {
  if (!r[0] && !r[1])
    return e;
  var a = jt(t, [Os(r[0] || 1), 0], n), i = jt(t, [0, Os(r[1] || 1)], n), o = jt(t, [
    r[0] / De(a),
    r[1] / De(i)
  ], n);
  return Dt(e, o);
}
function ke(t, e, r) {
  return r ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function xa(t) {
  return Y(t) <= ce ? 0 : t;
}
function yo(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var r = Kd(e, t), n = r.deg;
    return n ? dt("view-control-rotation".concat(n)) : "";
  };
}
function bo(t, e) {
  return e === void 0 && (e = [t]), function(r, n) {
    if (n.isRequest)
      return e.some(function(i) {
        return n.requestAble === i;
      }) ? n.parentDirection : !1;
    var a = n.inputEvent.target;
    return Zt(a, dt("direction")) && (!t || Zt(a, dt(t)));
  };
}
function lv(t, e, r) {
  var n, a = zr(t, {
    "x%": function(D) {
      return D / 100 * e.offsetWidth;
    },
    "y%": function(D) {
      return D / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, r < 0 ? void 0 : r), o = t.slice(0, r < 0 ? void 0 : r + 1), s = t[r] || "", l = r < 0 ? [] : t.slice(r), u = r < 0 ? [] : t.slice(r + 1), c = a.slice(0, r < 0 ? void 0 : r), f = a.slice(0, r < 0 ? void 0 : r + 1), d = (n = a[r]) !== null && n !== void 0 ? n : zr([""])[0], p = r < 0 ? [] : a.slice(r), v = r < 0 ? [] : a.slice(r + 1), m = d ? [d] : [], x = Er(c), y = Er(f), b = Er(p), E = Er(v), C = Pt(x, b, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: x,
    beforeFunctionMatrix2: y,
    targetFunctionMatrix: Er(m),
    afterFunctionMatrix: b,
    afterFunctionMatrix2: E,
    allFunctionMatrix: C,
    beforeFunctions: c,
    beforeFunctions2: f,
    targetFunction: m[0],
    afterFunctions: p,
    afterFunctions2: v,
    beforeFunctionTexts: i,
    beforeFunctionTexts2: o,
    targetFunctionText: s,
    afterFunctionTexts: l,
    afterFunctionTexts2: u
  };
}
function uv(t) {
  return !t || !ve(t) || vn(t) ? !1 : Xt(t) || "length" in t;
}
function Be(t, e) {
  return t ? vn(t) ? t : we(t) ? e ? document.querySelector(t) : t : Ea(t) ? t() : Tl(t) ? t : "current" in t ? t.current : t : null;
}
function So(t, e) {
  if (!t)
    return [];
  var r = uv(t) ? [].slice.call(t) : [t];
  return r.reduce(function(n, a) {
    return we(a) && e ? Q(Q([], z(n), !1), z([].slice.call(document.querySelectorAll(a))), !1) : (Xt(a) ? n.push(So(a, e)) : n.push(Be(a, e)), n);
  }, []);
}
function cv(t, e, r) {
  var n = Ht(t, e) / Math.PI * 180;
  return n = r >= 0 ? n : 180 - n, n = n >= 0 ? n : 360 + n, n;
}
function js(t, e) {
  var r = t.rootMatrix, n = t.is3d, a = n ? 4 : 3, i = Ie(r, a);
  return n || (i = Pe(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, aa(i, e);
}
function Ou(t, e, r, n, a) {
  var i = z(t, 2), o = i[0], s = i[1], l = 0, u = 0;
  if (a && o && s) {
    var c = Ht([0, 0], e), f = Ht([0, 0], n), d = De(e), p = Math.cos(c - f) * d;
    if (!n[0])
      u = p, l = u * r;
    else if (!n[1])
      l = p, u = l / r;
    else {
      var v = n[0] * o, m = n[1] * s, x = Math.atan2(v + e[0], m + e[1]), y = Math.atan2(v, m);
      x < 0 && (x += Math.PI * 2), y < 0 && (y += Math.PI * 2);
      var b = 0;
      Y(x - y) < Math.PI / 2 || Y(x - y) > Math.PI / 2 * 3 || (y += Math.PI), b = x - y, b > Math.PI * 2 ? b -= Math.PI * 2 : b > Math.PI ? b = 2 * Math.PI - b : b < -Math.PI && (b = -2 * Math.PI - b);
      var E = De([v + e[0], m + e[1]]) * Math.cos(b);
      l = E * Math.sin(y) - v, u = E * Math.cos(y) - m, n[0] < 0 && (l *= -1), n[1] < 0 && (u *= -1);
    }
  } else
    l = n[0] * e[0], u = n[1] * e[1];
  return [l, u];
}
function zu(t, e, r, n) {
  var a, i = r.ratio, o = r.startOffsetWidth, s = r.startOffsetHeight, l = 0, u = 0, c = n.distX, f = n.distY, d = n.pinchScale, p = n.parentDistance, v = n.parentDist, m = n.parentScale, x = r.fixedDirection, y = [0, 1].map(function(_) {
    return Y(t[_] - x[_]);
  }), b = [0, 1].map(function(_) {
    var M = y[_];
    return M !== 0 && (M = 2 / M), M;
  });
  if (v)
    l = v[0], u = v[1], e && (l ? u || (u = l / i) : l = u * i);
  else if (dn(d))
    l = (d - 1) * o, u = (d - 1) * s;
  else if (m)
    l = (m[0] - 1) * o, u = (m[1] - 1) * s;
  else if (p) {
    var E = o * y[0], C = s * y[1], D = De([E, C]);
    l = p / D * E * b[0], u = p / D * C * b[1];
  } else {
    var h = je({ datas: r, distX: c, distY: f });
    h = b.map(function(_, M) {
      return h[M] * _;
    }), a = z(Ou([o, s], h, i, t, e), 2), l = a[0], u = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: u
  };
}
function Bi(t, e) {
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
    var r = z(t.split(" "), 2), n = r[0], a = r[1], i = Bi(n || ""), o = Bi(a || ""), s = P(P({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function Co(t, e, r) {
  var n = Bi(t, !0), a = n.x, i = n.y;
  return [
    It(a, e) || 0,
    It(i, r) || 0
  ];
}
function fv(t, e, r) {
  var n = t.map(function(i) {
    return pt(i, e);
  }), a = n.map(function(i) {
    return mn(i, r);
  });
  return {
    prev: n,
    next: a,
    result: a.map(function(i) {
      return Dt(i, e);
    })
  };
}
function Au(t, e) {
  return t.length === e.length && t.every(function(r, n) {
    var a = e[n], i = Xt(r), o = Xt(a);
    return i && o ? Au(r, a) : !i && !o ? r === a : !1;
  });
}
function Rr(t, e, r, n, a) {
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
function Y(t) {
  return Math.abs(t);
}
function ri(t, e) {
  return Of(t).map(function(r) {
    return e(r);
  });
}
function Nu(t) {
  return dn(t) ? {
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
var dv = Sn("pinchable", {
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
    }), d = St(t, e, {});
    n && (d.targets = n);
    var p = st(t, u, d);
    r.isPinch = p !== !1, r.ables = f;
    var v = r.isPinch;
    return v ? (f.forEach(function(m) {
      if (i[m.name] = i[m.name] || {}, !!m[c]) {
        var x = P(P({}, e), { datas: i[m.name], parentRotate: a, isPinch: !0 });
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
      var u = a * (1 - 1 / n), c = St(t, e, {});
      s && (c.targets = s);
      var f = "onPinch".concat(s ? "Group" : "");
      st(t, f, c);
      var d = r.ables, p = "drag".concat(s ? "Group" : "", "Control");
      return d.forEach(function(v) {
        v[p] && v[p](t, P(P({}, e), { datas: i[v.name], inputEvent: o, resolveMatrix: !0, pinchScale: n, parentDistance: u, parentRotate: l, isPinch: !0 }));
      }), c;
    }
  },
  pinchEnd: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.targets, o = e.originalDatas;
    if (r.isPinch) {
      var s = "onPinch".concat(i ? "Group" : "", "End"), l = ge(t, e, { isDrag: n });
      i && (l.targets = i), st(t, s, l);
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
}), Gs = bo("scalable"), pv = {
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
  render: ru("scalable"),
  dragControlCondition: Gs,
  viewClassName: yo("scalable"),
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = ku(i, n, a, r), s = t.state, l = s.width, u = s.height, c = s.targetTransform, f = s.target, d = s.pos1, p = s.pos2, v = s.pos4;
    if (!o || !f)
      return !1;
    n || mr(t, e), r.datas = {}, r.transform = c, r.prevDist = [1, 1], r.direction = o, r.startOffsetWidth = l, r.startOffsetHeight = u, r.startValue = [1, 1];
    var m = !o[0] && !o[1] || o[0] || !o[1];
    Ma(t, e, "scale"), r.isWidth = m;
    function x(h) {
      r.ratio = h && isFinite(h) ? h : 0;
    }
    r.startPositions = _e(t.state);
    function y(h) {
      var _ = vu(r.startPositions, h);
      r.fixedDirection = _.fixedDirection, r.fixedPosition = _.fixedPosition, r.fixedOffset = _.fixedOffset;
    }
    r.setFixedDirection = y, x(Ne(d, p) / Ne(p, v)), y([-o[0], -o[1]]);
    var b = function(h) {
      r.minScaleSize = h;
    }, E = function(h) {
      r.maxScaleSize = h;
    };
    b([-1 / 0, -1 / 0]), E([1 / 0, 1 / 0]);
    var C = St(t, e, P(P({ direction: o, set: function(h) {
      r.startValue = h;
    }, setRatio: x, setFixedDirection: y, setMinScaleSize: b, setMaxScaleSize: E }, _a(t, e)), { dragStart: se.dragStart(t, new Ar().dragStart([0, 0], e)) })), D = st(t, "onScaleStart", C);
    return r.startFixedDirection = r.fixedDirection, D !== !1 && (r.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), r.isScale ? C : !1;
  },
  dragControl: function(t, e) {
    wa(t, e, "scale");
    var r = e.datas, n = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, u = e.resolveMatrix, c = r.prevDist, f = r.direction, d = r.startOffsetWidth, p = r.startOffsetHeight, v = r.isScale, m = r.startValue, x = r.isWidth, y = r.ratio;
    if (!v)
      return !1;
    var b = t.props, E = b.throttleScale, C = b.parentMoveable, D = f;
    !f[0] && !f[1] && (D = [1, 1]);
    var h = y && (n ?? b.keepRatio) || !1, _ = t.state, M = [
      m[0],
      m[1]
    ];
    function T() {
      var U = zu(D, h, r, e), ut = U.distWidth, wt = U.distHeight, ht = d ? (d + ut) / d : 1, ft = p ? (p + wt) / p : 1;
      m[0] || (M[0] = ut / d), m[1] || (M[1] = wt / p);
      var yt = (D[0] || h ? ht : 1) * M[0], _t = (D[1] || h ? ft : 1) * M[1];
      return yt === 0 && (yt = le(c[0]) * Hn), _t === 0 && (_t = le(c[1]) * Hn), [yt, _t];
    }
    var k = T();
    if (!i && t.props.groupable) {
      var A = _.snapRenderInfo || {}, O = A.direction;
      Xt(O) && (O[0] || O[1]) && (_.snapRenderInfo = { direction: f, request: e.isRequest });
    }
    st(t, "onBeforeScale", St(t, e, {
      scale: k,
      setFixedDirection: function(U) {
        return r.setFixedDirection(U), k = T(), k;
      },
      startFixedDirection: r.startFixedDirection,
      setScale: function(U) {
        k = U;
      }
    }, !0));
    var I = [
      k[0] / M[0],
      k[1] / M[1]
    ], N = o, B = [0, 0], W = le(I[0] * I[1]), H = !o && !a && i;
    if (H || u ? N = lo(t, r.targetAllTransform, [0, 0], [0, 0], r) : o || (N = r.fixedPosition), i || (B = Xp(t, I, f, !l && s, r)), h) {
      D[0] && D[1] && B[0] && B[1] && (Math.abs(B[0] * d) > Math.abs(B[1] * p) ? B[1] = 0 : B[0] = 0);
      var L = !B[0] && !B[1];
      if (L && (x ? I[0] = mt(I[0] * M[0], E) / M[0] : I[1] = mt(I[1] * M[1], E) / M[1]), D[0] && !D[1] || B[0] && !B[1] || L && x) {
        I[0] += B[0];
        var X = d * I[0] * M[0] / y;
        I[1] = le(W * I[0]) * Y(X / p / M[1]);
      } else if (!D[0] && D[1] || !B[0] && B[1] || L && !x) {
        I[1] += B[1];
        var V = p * I[1] * M[1] * y;
        I[0] = le(W * I[1]) * Y(V / d / M[0]);
      }
    } else
      I[0] += B[0], I[1] += B[1], B[0] || (I[0] = mt(I[0] * M[0], E) / M[0]), B[1] || (I[1] = mt(I[1] * M[1], E) / M[1]);
    I[0] === 0 && (I[0] = le(c[0]) * Hn), I[1] === 0 && (I[1] = le(c[1]) * Hn), k = $p(I, [M[0], M[1]]);
    var G = [
      d,
      p
    ], tt = [
      d * k[0],
      p * k[1]
    ];
    tt = Ki(tt, r.minScaleSize, r.maxScaleSize, h ? y : !1), k = ri(2, function(U) {
      return G[U] ? tt[U] / G[U] : tt[U];
    }), I = ri(2, function(U) {
      return k[U] / M[U];
    });
    var et = ri(2, function(U) {
      return c[U] ? I[U] / c[U] : I[U];
    }), Z = "scale(".concat(I.join(", "), ")"), rt = "scale(".concat(k.join(", "), ")"), q = Da(r, rt, Z), nt = !m[0] || !m[1], ot = Xd(t, nt ? rt : Z, r.fixedDirection, N, r.fixedOffset, r, nt), vt = H ? ot : pt(ot, r.prevInverseDist || [0, 0]);
    if (r.prevDist = I, r.prevInverseDist = ot, k[0] === c[0] && k[1] === c[1] && vt.every(function(U) {
      return !U;
    }) && !C && !H)
      return !1;
    var xt = St(t, e, P({ offsetWidth: d, offsetHeight: p, direction: f, scale: k, dist: I, delta: et, isPinch: !!i }, Kl(t, q, vt, i, e)));
    return st(t, "onScale", xt), xt;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (!r.isScale)
      return !1;
    r.isScale = !1;
    var n = ge(t, e, {});
    return st(t, "onScaleEnd", n), n;
  },
  dragGroupControlCondition: Gs,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var a = Re(t, "resizable", e);
    r.moveableScale = t.scale;
    var i = Ye(t, this, "dragControlStart", e, function(u, c) {
      return pa(t, u, r, c);
    }), o = function(u) {
      n.setFixedDirection(u), i.forEach(function(c, f) {
        c.setFixedDirection(u), pa(t, c.moveable, r, a[f]);
      });
    };
    r.setFixedDirection = o;
    var s = P(P({}, n), { targets: t.props.targets, events: i, setFixedDirection: o }), l = st(t, "onScaleGroupStart", s);
    return r.isScale = l !== !1, r.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isScale) {
      Pa(t, "onBeforeScale", function(c) {
        st(t, "onBeforeScaleGroup", St(t, e, P(P({}, c), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = n.dist, i = r.moveableScale;
        t.scale = [
          a[0] * i[0],
          a[1] * i[1]
        ];
        var o = t.props.keepRatio, s = r.fixedPosition, l = Ye(t, this, "dragControl", e, function(c, f) {
          var d = z(ae(xn(t.rotation / 180 * Math.PI, 3), [
            f.datas.originalX * a[0],
            f.datas.originalY * a[1],
            1
          ], 3), 2), p = d[0], v = d[1];
          return P(P({}, f), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: Dt(s, [p, v])
          });
        }), u = P({ targets: t.props.targets, events: l }, n);
        return st(t, "onScaleGroup", u), u;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isScale) {
      this.dragControlEnd(t, e);
      var a = Ye(t, this, "dragControlEnd", e), i = ge(t, e, {
        targets: t.props.targets,
        events: a
      });
      return st(t, "onScaleGroupEnd", i), r;
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
function Ue(t, e) {
  return t.map(function(r, n) {
    return sa(r, e[n], 1, 2);
  });
}
function Fs(t, e, r) {
  var n = Ht(t, e), a = Ht(t, r), i = a - n;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function vv(t, e) {
  var r = Fs(t[0], t[1], t[2]), n = Fs(e[0], e[1], e[2]), a = Math.PI;
  return !(r >= a && n <= a || r <= a && n >= a);
}
var hv = {
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
  viewClassName: yo("warpable"),
  render: function(t, e) {
    var r = t.props, n = r.resizable, a = r.scalable, i = r.warpable, o = r.zoom;
    if (n || a || !i)
      return [];
    var s = t.state, l = s.pos1, u = s.pos2, c = s.pos3, f = s.pos4, d = Ue(l, u), p = Ue(u, l), v = Ue(l, c), m = Ue(c, l), x = Ue(c, f), y = Ue(f, c), b = Ue(u, f), E = Ue(f, u);
    return Q([
      e.createElement("div", { className: dt("line"), key: "middeLine1", style: rn(d, x, o) }),
      e.createElement("div", { className: dt("line"), key: "middeLine2", style: rn(p, y, o) }),
      e.createElement("div", { className: dt("line"), key: "middeLine3", style: rn(v, b, o) }),
      e.createElement("div", { className: dt("line"), key: "middeLine4", style: rn(m, E, o) })
    ], z(nu(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var r = e.inputEvent.target;
    return Zt(r, dt("direction")) && Zt(r, dt("warpable"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.inputEvent, a = t.props.target, i = n.target, o = Tu(i, r);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, u = s.is3d, c = s.targetTransform, f = s.targetMatrix, d = s.width, p = s.height, v = s.left, m = s.top;
    r.datas = {}, r.targetTransform = c, r.warpTargetMatrix = u ? f : Pe(f, 3, 4), r.targetInverseMatrix = Rl(Ie(r.warpTargetMatrix, 4), 3, 4), r.direction = o, r.left = v, r.top = m, r.poses = [
      [0, 0],
      [d, 0],
      [0, p],
      [d, p]
    ].map(function(b) {
      return pt(b, l);
    }), r.nextPoses = r.poses.map(function(b) {
      var E = z(b, 2), C = E[0], D = E[1];
      return ae(r.warpTargetMatrix, [C, D, 0, 1], 4);
    }), r.startValue = zt(4), r.prevMatrix = zt(4), r.absolutePoses = _e(s), r.posIndexes = Ul(o), mr(t, e), Ma(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var x = St(t, e, P({ set: function(b) {
      r.startValue = b;
    } }, _a(t, e))), y = st(t, "onWarpStart", x);
    return y !== !1 && (r.isWarp = !0), r.isWarp;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isRequest, a = e.distX, i = e.distY, o = r.targetInverseMatrix, s = r.prevMatrix, l = r.isWarp, u = r.startValue, c = r.poses, f = r.posIndexes, d = r.absolutePoses;
    if (!l)
      return !1;
    if (wa(t, e, "matrix3d"), Yr(t, "warpable")) {
      var p = f.map(function(T) {
        return d[T];
      });
      p.length > 1 && p.push([
        (p[0][0] + p[1][0]) / 2,
        (p[0][1] + p[1][1]) / 2
      ]);
      var v = Ra(t, n, {
        horizontal: p.map(function(T) {
          return T[1] + i;
        }),
        vertical: p.map(function(T) {
          return T[0] + a;
        })
      }), m = v.horizontal, x = v.vertical;
      i -= m.offset, a -= x.offset;
    }
    var y = je({ datas: r, distX: a, distY: i }, !0), b = r.nextPoses.slice();
    if (f.forEach(function(T) {
      b[T] = Dt(b[T], y);
    }), !Od.every(function(T) {
      return vv(T.map(function(k) {
        return c[k];
      }), T.map(function(k) {
        return b[k];
      }));
    }))
      return !1;
    var E = to(c[0], c[2], c[1], c[3], b[0], b[2], b[1], b[3]);
    if (!E.length)
      return !1;
    var C = Pt(o, E, 4), D = Vl(r, C, !0), h = Pt(Ie(s, 4), D, 4);
    r.prevMatrix = D;
    var _ = Pt(u, D, 4), M = Da(r, "matrix3d(".concat(_.join(", "), ")"), "matrix3d(".concat(D.join(", "), ")"));
    return so(e, M), st(t, "onWarp", St(t, e, P({ delta: h, matrix: _, dist: D, multiply: Pt, transform: M }, ue({
      transform: M
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.isDrag;
    return r.isWarp ? (r.isWarp = !1, st(t, "onWarpEnd", ge(t, e, {})), n) : !1;
  }
}, gv = /* @__PURE__ */ dt("area-pieces"), Zn = /* @__PURE__ */ dt("area-piece"), Bu = /* @__PURE__ */ dt("avoid"), mv = dt("view-dragging");
function ni(t) {
  var e = t.areaElement;
  if (e) {
    var r = t.state, n = r.width, a = r.height;
    kl(e, Bu), e.style.cssText += "left: 0px; top: 0px; width: ".concat(n, "px; height: ").concat(a, "px");
  }
}
function Ls(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: gv },
    t.createElement("div", { className: Zn }),
    t.createElement("div", { className: Zn }),
    t.createElement("div", { className: Zn }),
    t.createElement("div", { className: Zn })
  );
}
var ju = {
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
        e.createElement("div", { key: "area", ref: Je(t, "areaElement"), className: f }),
        Ls(e)
      ];
    if (!n || !a)
      return [];
    var d = to([0, 0], [l, 0], [0, u], [l, u], c[0], c[1], c[2], c[3]), p = d.length ? Ia(d, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: Je(t, "areaElement"), className: f, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(u, "px"),
        transformOrigin: "0 0",
        transform: p
      } }),
      Ls(e)
    ];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    r.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, u = s.renderPoses, c = s.rootMatrix, f = s.is3d, d = l.left, p = l.top, v = Ee(u), m = v.left, x = v.top, y = v.width, b = v.height, E = f ? 4 : 3, C = z(jr(c, [n - d, a - p], E), 2), D = C[0], h = C[1];
    D -= m, h -= x;
    var _ = [
      { left: m, top: x, width: y, height: h - 10 },
      { left: m, top: x, width: D - 10, height: b },
      { left: m, top: x + h + 10, width: y, height: b - h - 10 },
      { left: m + D + 10, top: x, width: y - D - 10, height: b }
    ], M = [].slice.call(o.nextElementSibling.children);
    _.forEach(function(T, k) {
      M[k].style.cssText = "left: ".concat(T.left, "px;top: ").concat(T.top, "px; width: ").concat(T.width, "px; height: ").concat(T.height, "px;");
    }), Zi(o, Bu), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var r = e.datas, n = e.inputEvent;
    if (this.enableNativeEvent(t), !n)
      return !1;
    r.isDragArea || (r.isDragArea = !0, ni(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var r = e.inputEvent, n = e.datas;
    if (!r)
      return !1;
    n.isDragArea || ni(t);
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
    ni(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && Ml(function() {
      e.disableNativeEvent = !1;
    });
  }
}, xv = Sn("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var r = t.props, n = r.zoom, a = r.svgOrigin, i = r.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, u = o.svg, c = o.allMatrix, f = o.is3d, d = o.left, p = o.top, v = o.offsetWidth, m = o.offsetHeight, x;
    if (!i && u && a) {
      var y = z(Co(a, v, m), 2), b = y[0], E = y[1], C = f ? 4 : 3, D = jt(c, [b, E], C);
      x = ma(l, n, pt(D, [d, p]));
    } else
      x = ma(l, n, s);
    return [
      e.createElement("div", { className: dt("control", "origin"), style: x, key: "beforeOrigin" })
    ];
  }
});
function yv(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var bv = {
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
    var r = t.props, n = r.scrollContainer, a = n === void 0 ? t.getContainer() : n, i = r.scrollOptions, o = new Al(), s = Be(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", u = e.targets;
    o.on("scroll", function(c) {
      var f = c.container, d = c.direction, p = St(t, e, {
        scrollContainer: f,
        direction: d
      }), v = u ? "onScrollGroup" : "onScroll";
      u && (p.targets = u), st(t, v, p);
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
      var n = t.props, a = n.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = n.scrollThreshold, s = o === void 0 ? 0 : o, l = n.scrollThrottleTime, u = l === void 0 ? 0 : l, c = n.getScrollPosition, f = c === void 0 ? yv : c, d = n.scrollOptions;
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
}, Gu = {
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
}, Sv = Sn("padding", {
  props: ["padding"],
  render: function(t, e) {
    var r = t.props;
    if (r.dragArea)
      return [];
    var n = Nu(r.padding || {}), a = n.left, i = n.top, o = n.right, s = n.bottom, l = t.getState(), u = l.renderPoses, c = l.pos1, f = l.pos2, d = l.pos3, p = l.pos4, v = [c, f, d, p], m = [];
    return a > 0 && m.push([0, 2]), i > 0 && m.push([0, 1]), o > 0 && m.push([1, 3]), s > 0 && m.push([2, 3]), m.map(function(x, y) {
      var b = z(x, 2), E = b[0], C = b[1], D = v[E], h = v[C], _ = u[E], M = u[C], T = to([0, 0], [100, 0], [0, 100], [100, 100], D, h, _, M);
      if (T.length)
        return e.createElement("div", { key: "padding".concat(y), className: dt("padding"), style: {
          transform: Ia(T, !0)
        } });
    });
  }
}), Ws = ["nw", "ne", "se", "sw"];
function Jn(t, e) {
  var r = t[0] + t[1], n = r > e ? e / r : 1;
  return t[0] *= n, t[1] = e - t[1] * n, t;
}
var Cv = [1, 2, 5, 6], Ev = [0, 3, 4, 7], ur = [1, -1, -1, 1], cr = [1, 1, -1, -1];
function Eo(t, e, r, n, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = r), s === void 0 && (s = n);
  var l = [], u = !1, c = t.filter(function(d) {
    return !d.virtual;
  }), f = c.map(function(d) {
    var p = d.horizontal, v = d.vertical, m = d.pos;
    if (v && !u && (u = !0, l.push("/")), u) {
      var x = Math.max(0, v === 1 ? m[1] - i : s - m[1]);
      return l.push(ke(x, n, e)), x;
    } else {
      var x = Math.max(0, p === 1 ? m[0] - a : o - m[0]);
      return l.push(ke(x, r, e)), x;
    }
  });
  return {
    radiusPoses: c,
    styles: l,
    raws: f
  };
}
function Fu(t) {
  for (var e = [0, 0], r = [0, 0], n = t.length, a = 0; a < n; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, r[0] = a + 1), i.vertical && (r[1] === 0 && (r[0] = a), r[1] = a - r[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: r
  };
}
function Lu(t, e, r, n, a, i, o) {
  var s, l, u, c;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var f = t.indexOf("/"), d = (f > -1 ? t.slice(0, f) : t).length, p = t.slice(0, d), v = t.slice(d + 1), m = p.length, x = v.length, y = x > 0, b = z(p, 4), E = b[0], C = E === void 0 ? "0px" : E, D = b[1], h = D === void 0 ? C : D, _ = b[2], M = _ === void 0 ? C : _, T = b[3], k = T === void 0 ? h : T, A = z(v, 4), O = A[0], I = O === void 0 ? C : O, N = A[1], B = N === void 0 ? y ? I : h : N, W = A[2], H = W === void 0 ? y ? I : M : W, L = A[3], X = L === void 0 ? y ? B : k : L, V = [C, h, M, k].map(function(q) {
    return It(q, e);
  }), G = [I, B, H, X].map(function(q) {
    return It(q, r);
  }), tt = V.slice(), et = G.slice();
  s = z(Jn([tt[0], tt[1]], e), 2), tt[0] = s[0], tt[1] = s[1], l = z(Jn([tt[3], tt[2]], e), 2), tt[3] = l[0], tt[2] = l[1], u = z(Jn([et[0], et[3]], r), 2), et[0] = u[0], et[3] = u[1], c = z(Jn([et[1], et[2]], r), 2), et[1] = c[0], et[2] = c[1];
  var Z = o ? tt : tt.slice(0, Math.max(i[0], m)), rt = o ? et : et.slice(0, Math.max(i[1], x));
  return Q(Q([], z(Z.map(function(q, nt) {
    var ot = Ws[nt];
    return {
      virtual: nt >= m,
      horizontal: ur[nt],
      vertical: 0,
      pos: [n + q, a + (cr[nt] === -1 ? r : 0)],
      sub: !0,
      raw: V[nt],
      direction: ot
    };
  })), !1), z(rt.map(function(q, nt) {
    var ot = Ws[nt];
    return {
      virtual: nt >= x,
      horizontal: 0,
      vertical: cr[nt],
      pos: [n + (ur[nt] === -1 ? e : 0), a + q],
      sub: !0,
      raw: G[nt],
      direction: ot
    };
  })), !1);
}
function wv(t, e, r, n, a) {
  a === void 0 && (a = e.length);
  var i = Fu(t.slice(n)), o = i.horizontalRange, s = i.verticalRange, l = r - n, u = 0;
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
function Dv(t, e, r, n, a, i, o, s, l, u, c) {
  u === void 0 && (u = 0), c === void 0 && (c = 0);
  var f = Fu(t.slice(r)), d = f.horizontalRange, p = f.verticalRange;
  if (n > -1)
    for (var v = ur[n] === 1 ? i - u : s - i, m = d[1]; m <= n; ++m) {
      var x = cr[m] === 1 ? c : l, y = 0;
      if (n === m ? y = i : m === 0 ? y = u + v : ur[m] === -1 && (y = s - (e[r][0] - u)), t.splice(r + m, 0, {
        horizontal: ur[m],
        vertical: 0,
        pos: [y, x]
      }), e.splice(r + m, 0, [y, x]), m === 0)
        break;
    }
  else if (a > -1) {
    var b = cr[a] === 1 ? o - c : l - o;
    if (d[1] === 0 && p[1] === 0) {
      var E = [
        u + b,
        c
      ];
      t.push({
        horizontal: ur[0],
        vertical: 0,
        pos: E
      }), e.push(E);
    }
    for (var C = p[0], m = p[1]; m <= a; ++m) {
      var y = ur[m] === 1 ? u : s, x = 0;
      if (a === m ? x = o : m === 0 ? x = c + b : cr[m] === 1 ? x = e[r + C][1] : cr[m] === -1 && (x = l - (e[r + C][1] - c)), t.push({
        horizontal: 0,
        vertical: cr[m],
        pos: [y, x]
      }), e.push([y, x]), m === 0)
        break;
    }
  }
}
function _v(t, e) {
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
var Mv = [
  [0, -1, "n"],
  [1, 0, "e"]
], kv = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function wo(t, e, r) {
  var n = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, u = s.poses, c = l === "rect", f = l === "circle";
  if (l === "polygon")
    return r.map(function(h) {
      return "".concat(ke(h[0], i, n), " ").concat(ke(h[1], o, n));
    });
  if (c || l === "inset") {
    var d = r[1][1], p = r[3][0], v = r[7][0], m = r[5][1];
    if (c)
      return [
        d,
        p,
        m,
        v
      ].map(function(h) {
        return "".concat(h, "px");
      });
    var x = [d, i - p, o - m, v].map(function(h, _) {
      return ke(h, _ % 2 ? i : o, n);
    });
    if (r.length > 8) {
      var y = z(pt(r[4], r[0]), 2), b = y[0], E = y[1];
      x.push.apply(x, Q(["round"], z(Eo(u.slice(8).map(function(h, _) {
        return P(P({}, h), { pos: r[_] });
      }), n, b, E, v, d, p, m).styles), !1));
    }
    return x;
  } else if (f || l === "ellipse") {
    var C = r[0], D = ke(Y(r[1][1] - C[1]), f ? Math.sqrt((i * i + o * o) / 2) : o, n), x = f ? [D] : [ke(Y(r[2][0] - C[0]), i, n), D];
    return x.push("at", ke(C[0], i, n), ke(C[1], o, n)), x;
  }
}
function ya(t, e, r, n) {
  var a = [n, (n + e) / 2, e], i = [t, (t + r) / 2, r];
  return kv.map(function(o) {
    var s = z(o, 3), l = s[0], u = s[1], c = s[2], f = a[l + 1], d = i[u + 1];
    return {
      vertical: Y(u),
      horizontal: Y(l),
      direction: c,
      pos: [f, d]
    };
  });
}
function Wu(t) {
  var e = [1 / 0, -1 / 0], r = [1 / 0, -1 / 0];
  return t.forEach(function(n) {
    var a = n.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), r[0] = Math.min(r[0], a[1]), r[1] = Math.max(r[1], a[1]);
  }), [
    Y(e[1] - e[0]),
    Y(r[1] - r[0])
  ];
}
function Ys(t, e, r, n, a) {
  var i, o, s, l, u, c, f, d, p;
  if (t) {
    var v = a;
    if (!v) {
      var m = pe(t), x = m("clipPath");
      v = x !== "none" ? x : m("clip");
    }
    if (!((!v || v === "none" || v === "auto") && (v = n, !v))) {
      var y = _l(v), b = y.prefix, E = b === void 0 ? v : b, C = y.value, D = C === void 0 ? "" : C, h = E === "circle", _ = " ";
      if (E === "polygon") {
        var M = fr(D || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        _ = ",";
        var T = M.map(function(Gt) {
          var re = z(Gt.split(" "), 2), Ft = re[0], Bt = re[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              It(Ft, e),
              It(Bt, r)
            ]
          };
        }), k = hr(T.map(function(Gt) {
          return Gt.pos;
        }));
        return {
          type: E,
          clipText: v,
          poses: T,
          splitter: _,
          left: k.minX,
          right: k.maxX,
          top: k.minY,
          bottom: k.maxY
        };
      } else if (h || E === "ellipse") {
        var A = "", O = "", I = 0, N = 0, M = Qe(D);
        if (h) {
          var B = "";
          i = z(M, 4), o = i[0], B = o === void 0 ? "50%" : o, s = i[2], A = s === void 0 ? "50%" : s, l = i[3], O = l === void 0 ? "50%" : l, I = It(B, Math.sqrt((e * e + r * r) / 2)), N = I;
        } else {
          var W = "", H = "";
          u = z(M, 5), c = u[0], W = c === void 0 ? "50%" : c, f = u[1], H = f === void 0 ? "50%" : f, d = u[3], A = d === void 0 ? "50%" : d, p = u[4], O = p === void 0 ? "50%" : p, I = It(W, e), N = It(H, r);
        }
        var L = [
          It(A, e),
          It(O, r)
        ], T = Q([
          {
            vertical: 1,
            horizontal: 1,
            pos: L,
            direction: "nesw"
          }
        ], z(Mv.slice(0, h ? 1 : 2).map(function(Ft) {
          return {
            vertical: Y(Ft[1]),
            horizontal: Ft[0],
            direction: Ft[2],
            sub: !0,
            pos: [
              L[0] + Ft[0] * I,
              L[1] + Ft[1] * N
            ]
          };
        })), !1);
        return {
          type: E,
          clipText: v,
          radiusX: I,
          radiusY: N,
          left: L[0] - I,
          top: L[1] - N,
          right: L[0] + I,
          bottom: L[1] + N,
          poses: T,
          splitter: _
        };
      } else if (E === "inset") {
        var M = Qe(D || "0 0 0 0"), X = M.indexOf("round"), V = (X > -1 ? M.slice(0, X) : M).length, G = M.slice(V + 1), tt = z(M.slice(0, V), 4), et = tt[0], Z = tt[1], rt = Z === void 0 ? et : Z, q = tt[2], nt = q === void 0 ? et : q, ot = tt[3], vt = ot === void 0 ? rt : ot, xt = z([et, nt].map(function(Ft) {
          return It(Ft, r);
        }), 2), U = xt[0], ut = xt[1], wt = z([vt, rt].map(function(Ft) {
          return It(Ft, e);
        }), 2), ht = wt[0], ft = wt[1], yt = e - ft, _t = r - ut, kt = Lu(G, yt - ht, _t - U, ht, U), T = Q(Q([], z(ya(U, yt, _t, ht)), !1), z(kt), !1);
        return {
          type: "inset",
          clipText: v,
          poses: T,
          top: U,
          left: ht,
          right: yt,
          bottom: _t,
          radius: G,
          splitter: _
        };
      } else if (E === "rect") {
        var M = fr(D || "0px, ".concat(e, "px, ").concat(r, "px, 0px"));
        _ = ",";
        var Ct = z(M.map(function(me) {
          var ie = dr(me).value;
          return ie;
        }), 4), Mt = Ct[0], ft = Ct[1], ut = Ct[2], ht = Ct[3], T = ya(Mt, ft, ut, ht);
        return {
          type: "rect",
          clipText: v,
          poses: T,
          top: Mt,
          right: ft,
          bottom: ut,
          left: ht,
          values: M,
          splitter: _
        };
      }
    }
  }
}
function Tv(t, e, r, n, a) {
  var i = t[e], o = i.direction, s = i.sub, l = t.map(function() {
    return [0, 0];
  }), u = o ? o.split("") : [];
  if (n && e < 8) {
    var c = u.filter(function(I) {
      return I === "w" || I === "e";
    }), f = u.filter(function(I) {
      return I === "n" || I === "s";
    }), d = c[0], p = f[0];
    l[e] = r;
    var v = z(Wu(t), 2), m = v[0], x = v[1], y = m && x ? m / x : 0;
    if (y && a) {
      var b = (e + 4) % 8, E = t[b].pos, C = [0, 0];
      o.indexOf("w") > -1 ? C[0] = -1 : o.indexOf("e") > -1 && (C[0] = 1), o.indexOf("n") > -1 ? C[1] = -1 : o.indexOf("s") > -1 && (C[1] = 1);
      var D = Ou([m, x], r, y, C, !0), h = m + D[0], _ = x + D[1], M = E[1], T = E[1], k = E[0], A = E[0];
      C[0] === -1 ? k = A - h : C[0] === 1 ? A = k + h : (k = k - h / 2, A = A + h / 2), C[1] === -1 ? M = T - _ : (C[1] === 1 || (M = T - _ / 2), T = M + _);
      var O = ya(M, A, T, k);
      t.forEach(function(I, N) {
        l[N][0] = O[N].pos[0] - I.pos[0], l[N][1] = O[N].pos[1] - I.pos[1];
      });
    } else
      t.forEach(function(I, N) {
        var B = I.direction;
        B && (B.indexOf(d) > -1 && (l[N][0] = r[0]), B.indexOf(p) > -1 && (l[N][1] = r[1]));
      }), d && (l[1][0] = r[0] / 2, l[5][0] = r[0] / 2), p && (l[3][1] = r[1] / 2, l[7][1] = r[1] / 2);
  } else o && !s ? u.forEach(function(I) {
    var N = I === "n" || I === "s";
    t.forEach(function(B, W) {
      var H = B.direction, L = B.horizontal, X = B.vertical;
      !H || H.indexOf(I) === -1 || (l[W] = [
        N || !L ? 0 : r[0],
        !N || !X ? 0 : r[1]
      ]);
    });
  }) : l[e] = r;
  return l;
}
function Rv(t, e) {
  var r = z(ql(t, e), 2), n = r[0], a = r[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, u = l.type, c = l.poses, f = l.splitter, d = c.map(function(b) {
    return b.pos;
  });
  if (u === "polygon")
    d.splice(s, 0, [n, a]);
  else if (u === "inset") {
    var p = Cv.indexOf(s), v = Ev.indexOf(s), m = c.length;
    if (Dv(c, d, 8, p, v, n, a, d[4][0], d[4][1], d[0][0], d[0][1]), m === c.length)
      return;
  } else
    return;
  var x = wo(t, o, d), y = "".concat(u, "(").concat(x.join(f), ")");
  st(t, "onClip", St(t, e, P({ clipEventType: "added", clipType: u, poses: d, clipStyles: x, clipStyle: y, distX: 0, distY: 0 }, ue({
    clipPath: y
  }, e))));
}
function Iv(t, e) {
  var r = e.datas, n = r.clipPath, a = r.clipIndex, i = n, o = i.type, s = i.poses, l = i.splitter, u = s.map(function(p) {
    return p.pos;
  }), c = u.length;
  if (o === "polygon")
    s.splice(a, 1), u.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (wv(s, u, a, 8, c), c === s.length))
      return;
  } else
    return;
  var f = wo(t, n, u), d = "".concat(o, "(").concat(f.join(l), ")");
  st(t, "onClip", St(t, e, P({ clipEventType: "removed", clipType: o, poses: u, clipStyles: f, clipStyle: d, distX: 0, distY: 0 }, ue({
    clipPath: d
  }, e))));
}
var Pv = {
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
    var r = t.props, n = r.customClipPath, a = r.defaultClipPath, i = r.clipArea, o = r.zoom, s = r.groupable, l = t.getState(), u = l.target, c = l.width, f = l.height, d = l.allMatrix, p = l.is3d, v = l.left, m = l.top, x = l.pos1, y = l.pos2, b = l.pos3, E = l.pos4, C = l.clipPathState, D = l.snapBoundInfos, h = l.rotation;
    if (!u || s)
      return [];
    var _ = Ys(u, c, f, a || "inset", C || n);
    if (!_)
      return [];
    var M = p ? 4 : 3, T = _.type, k = _.poses, A = k.map(function(ft) {
      var yt = jt(d, ft.pos, M);
      return [
        yt[0] - v,
        yt[1] - m
      ];
    }), O = [], I = [], N = T === "rect", B = T === "inset", W = T === "polygon";
    if (N || B || W) {
      var H = B ? A.slice(0, 8) : A;
      I = H.map(function(ft, yt) {
        var _t = yt === 0 ? H[H.length - 1] : H[yt - 1], kt = Ht(_t, ft), Ct = wu(_t, ft);
        return e.createElement("div", { key: "clipLine".concat(yt), className: dt("line", "clip-line", "snap-control"), "data-clip-index": yt, style: {
          width: "".concat(Ct, "px"),
          transform: "translate(".concat(_t[0], "px, ").concat(_t[1], "px) rotate(").concat(kt, "rad) scaleY(").concat(o, ")")
        } });
      });
    }
    if (O = A.map(function(ft, yt) {
      return e.createElement("div", { key: "clipControl".concat(yt), className: dt("control", "clip-control", "snap-control"), "data-clip-index": yt, style: {
        transform: "translate(".concat(ft[0], "px, ").concat(ft[1], "px) rotate(").concat(h, "rad) scale(").concat(o, ")")
      } });
    }), B && O.push.apply(O, Q([], z(A.slice(8).map(function(ft, yt) {
      return e.createElement("div", { key: "clipRadiusControl".concat(yt), className: dt("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + yt, style: {
        transform: "translate(".concat(ft[0], "px, ").concat(ft[1], "px) rotate(").concat(h, "rad) scale(").concat(o, ")")
      } });
    })), !1)), T === "circle" || T === "ellipse") {
      var L = _.left, X = _.top, V = _.radiusX, G = _.radiusY, tt = z(pt(jt(d, [L, X], M), jt(d, [0, 0], M)), 2), et = tt[0], Z = tt[1], rt = "none";
      if (!i) {
        for (var q = Math.max(10, V / 5, G / 5), nt = [], ot = 0; ot <= q; ++ot) {
          var vt = Math.PI * 2 / q * ot;
          nt.push([
            V + (V - o) * Math.cos(vt),
            G + (G - o) * Math.sin(vt)
          ]);
        }
        nt.push([V, -2]), nt.push([-2, -2]), nt.push([-2, G * 2 + 2]), nt.push([V * 2 + 2, G * 2 + 2]), nt.push([V * 2 + 2, -2]), nt.push([V, -2]), rt = "polygon(".concat(nt.map(function(ft) {
          return "".concat(ft[0], "px ").concat(ft[1], "px");
        }).join(", "), ")");
      }
      O.push(e.createElement("div", { key: "clipEllipse", className: dt("clip-ellipse", "snap-control"), style: {
        width: "".concat(V * 2, "px"),
        height: "".concat(G * 2, "px"),
        clipPath: rt,
        transform: "translate(".concat(-v + et, "px, ").concat(-m + Z, "px) ").concat(Ia(d))
      } }));
    }
    if (i) {
      var xt = Ee(Q([x, y, b, E], z(A), !1)), U = xt.width, ut = xt.height, wt = xt.left, ht = xt.top;
      if (W || N || B) {
        var nt = B ? A.slice(0, 8) : A;
        O.push(e.createElement("div", { key: "clipArea", className: dt("clip-area", "snap-control"), style: {
          width: "".concat(U, "px"),
          height: "".concat(ut, "px"),
          transform: "translate(".concat(wt, "px, ").concat(ht, "px)"),
          clipPath: "polygon(".concat(nt.map(function(yt) {
            return "".concat(yt[0] - wt, "px ").concat(yt[1] - ht, "px");
          }).join(", "), ")")
        } }));
      }
    }
    return D && ["vertical", "horizontal"].forEach(function(ft) {
      var yt = D[ft], _t = ft === "horizontal";
      yt.isSnap && I.push.apply(I, Q([], z(yt.snap.posInfos.map(function(kt, Ct) {
        var Mt = kt.pos, Gt = pt(jt(d, _t ? [0, Mt] : [Mt, 0], M), [v, m]), re = pt(jt(d, _t ? [c, Mt] : [Mt, f], M), [v, m]);
        return hn(e, "", Gt, re, o, "clip".concat(ft, "snap").concat(Ct), "guideline");
      })), !1)), yt.isBound && I.push.apply(I, Q([], z(yt.bounds.map(function(kt, Ct) {
        var Mt = kt.pos, Gt = pt(jt(d, _t ? [0, Mt] : [Mt, 0], M), [v, m]), re = pt(jt(d, _t ? [c, Mt] : [Mt, f], M), [v, m]);
        return hn(e, "", Gt, re, o, "clip".concat(ft, "bounds").concat(Ct), "guideline", "bounds", "bold");
      })), !1));
    }), Q(Q([], z(O), !1), z(I), !1);
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
    var r = t.state, n = t.props, a = n.defaultClipPath, i = n.customClipPath, o = r.target, s = r.width, l = r.height, u = e.inputEvent ? e.inputEvent.target : null, c = u && u.getAttribute("class") || "", f = e.datas, d = Ys(o, s, l, a || "inset", i);
    if (!d)
      return !1;
    var p = d.clipText, v = d.type, m = d.poses, x = st(t, "onClipStart", St(t, e, {
      clipType: v,
      clipStyle: p,
      poses: m.map(function(y) {
        return y.pos;
      })
    }));
    return x === !1 ? (f.isClipStart = !1, !1) : (f.isControl = c && c.indexOf("clip-control") > -1, f.isLine = c.indexOf("clip-line") > -1, f.isArea = c.indexOf("clip-area") > -1 || c.indexOf("clip-ellipse") > -1, f.clipIndex = u ? parseInt(u.getAttribute("data-clip-index"), 10) : -1, f.clipPath = d, f.isClipStart = !0, r.clipPathState = p, mr(t, e), !0);
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, u = l.isControl, c = l.isLine, f = l.isArea, d = l.clipIndex, p = l.clipPath;
    if (!p)
      return !1;
    var v = gr(t.props, "clippable"), m = v.keepRatio, x = 0, y = 0, b = o.draggable, E = je(e);
    s && b ? (r = z(b.prevBeforeDist, 2), x = r[0], y = r[1]) : (n = z(E, 2), x = n[0], y = n[1]);
    var C = [x, y], D = t.state, h = D.width, _ = D.height, M = !f && !u && !c, T = p.type, k = p.poses, A = p.splitter, O = k.map(function(Et) {
      return Et.pos;
    });
    M && (x = -x, y = -y);
    var I = !u || k[d].direction === "nesw", N = T === "inset" || T === "rect", B = k.map(function() {
      return [0, 0];
    });
    if (u && !I) {
      var W = k[d], H = W.horizontal, L = W.vertical, X = [
        x * Y(H),
        y * Y(L)
      ];
      B = Tv(k, d, X, N, m);
    } else I && (B = O.map(function() {
      return [x, y];
    }));
    var V = O.map(function(Et, Qt) {
      return Dt(Et, B[Qt]);
    }), G = Q([], z(V), !1);
    D.snapBoundInfos = null;
    var tt = p.type === "circle", et = p.type === "ellipse";
    if (tt || et) {
      var Z = Ee(V), rt = Y(Z.bottom - Z.top), q = Y(et ? Z.right - Z.left : rt), nt = V[0][1] + rt, ot = V[0][0] - q, vt = V[0][0] + q;
      tt && (G.push([vt, Z.bottom]), B.push([1, 0])), G.push([Z.left, nt]), B.push([0, 1]), G.push([ot, Z.bottom]), B.push([1, 0]);
    }
    var xt = xu((v.clipHorizontalGuidelines || []).map(function(Et) {
      return It("".concat(Et), _);
    }), (v.clipVerticalGuidelines || []).map(function(Et) {
      return It("".concat(Et), h);
    }), h, _), U = [], ut = [];
    if (tt || et)
      U = [G[4][0], G[2][0]], ut = [G[1][1], G[3][1]];
    else if (N) {
      var wt = [G[0], G[2], G[4], G[6]], ht = [B[0], B[2], B[4], B[6]];
      U = wt.filter(function(Et, Qt) {
        return ht[Qt][0];
      }).map(function(Et) {
        return Et[0];
      }), ut = wt.filter(function(Et, Qt) {
        return ht[Qt][1];
      }).map(function(Et) {
        return Et[1];
      });
    } else
      U = G.filter(function(Et, Qt) {
        return B[Qt][0];
      }).map(function(Et) {
        return Et[0];
      }), ut = G.filter(function(Et, Qt) {
        return B[Qt][1];
      }).map(function(Et) {
        return Et[1];
      });
    var ft = [0, 0], yt = Ms(xt, v.clipTargetBounds && { left: 0, top: 0, right: h, bottom: _ }, U, ut, 5, 5), _t = yt.horizontal, kt = yt.vertical, Ct = _t.offset, Mt = kt.offset;
    if (_t.isBound && (ft[1] += Ct), kt.isBound && (ft[0] += Mt), (et || tt) && B[0][0] === 0 && B[0][1] === 0) {
      var Z = Ee(V), Gt = Z.bottom - Z.top, re = et ? Z.right - Z.left : Gt, Ft = kt.isBound ? Y(Mt) : kt.snapIndex === 0 ? -Mt : Mt, Bt = _t.isBound ? Y(Ct) : _t.snapIndex === 0 ? -Ct : Ct;
      re -= Ft, Gt -= Bt, tt && (Gt = cu(kt, _t) > 0 ? Gt : re, re = Gt);
      var At = G[0];
      G[1][1] = At[1] - Gt, G[2][0] = At[0] + re, G[3][1] = At[1] + Gt, G[4][0] = At[0] - re;
    } else if (N && m && u) {
      var me = z(Wu(k), 2), ie = me[0], Dn = me[1], xe = ie && Dn ? ie / Dn : 0, Lt = k[d], nr = Lt.direction || "", Wt = G[1][1], nt = G[5][1], ot = G[7][0], vt = G[3][0];
      Y(Ct) <= Y(Mt) ? Ct = le(Ct) * Y(Mt) / xe : Mt = le(Mt) * Y(Ct) * xe, nr.indexOf("w") > -1 ? ot -= Mt : nr.indexOf("e") > -1 ? vt -= Mt : (ot += Mt / 2, vt -= Mt / 2), nr.indexOf("n") > -1 ? Wt -= Ct : nr.indexOf("s") > -1 ? nt -= Ct : (Wt += Ct / 2, nt -= Ct / 2);
      var He = ya(Wt, vt, nt, ot);
      G.forEach(function(Xr, Oa) {
        var Hr;
        Hr = z(He[Oa].pos, 2), Xr[0] = Hr[0], Xr[1] = Hr[1];
      });
    } else
      G.forEach(function(Et, Qt) {
        var Ge = B[Qt];
        Ge[0] && (Et[0] -= Mt), Ge[1] && (Et[1] -= Ct);
      });
    var qe = wo(t, p, V), $ = "".concat(T, "(").concat(qe.join(A), ")");
    if (D.clipPathState = $, tt || et)
      U = [G[4][0], G[2][0]], ut = [G[1][1], G[3][1]];
    else if (N) {
      var wt = [G[0], G[2], G[4], G[6]];
      U = wt.map(function(Qt) {
        return Qt[0];
      }), ut = wt.map(function(Qt) {
        return Qt[1];
      });
    } else
      U = G.map(function(Et) {
        return Et[0];
      }), ut = G.map(function(Et) {
        return Et[1];
      });
    if (D.snapBoundInfos = Ms(xt, v.clipTargetBounds && { left: 0, top: 0, right: h, bottom: _ }, U, ut, 1, 1), b) {
      var gt = D.is3d, Jt = D.allMatrix, yr = gt ? 4 : 3, Oe = ft;
      s && (Oe = [
        C[0] + ft[0] - E[0],
        C[1] + ft[1] - E[1]
      ]), b.deltaOffset = Pt(Jt, [Oe[0], Oe[1], 0, 0], yr);
    }
    return st(t, "onClip", St(t, e, P({ clipEventType: "changed", clipType: T, poses: V, clipStyle: $, clipStyles: qe, distX: x, distY: y }, ue((a = {}, a[T === "rect" ? "clip" : "clipPath"] = $, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var r = e.isDrag, n = e.datas, a = e.isDouble, i = n.isLine, o = n.isClipStart, s = n.isControl;
    return o ? (st(t, "onClipEnd", ge(t, e, {})), a && (s ? Iv(t, e) : i && Rv(t, e)), a || r) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, Ov = {
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
    return e.isRequest ? e.requestAble === "originDraggable" : Zt(e.inputEvent.target, dt("origin"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas;
    mr(t, e);
    var n = St(t, e, {
      dragStart: se.dragStart(t, new Ar().dragStart([0, 0], e))
    }), a = st(t, "onDragOriginStart", n);
    return r.startOrigin = t.state.transformOrigin, r.startTargetOrigin = t.state.targetOrigin, r.prevOrigin = [0, 0], r.isDragOrigin = !0, a === !1 ? (r.isDragOrigin = !1, !1) : n;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.isRequest;
    if (!r.isDragOrigin)
      return !1;
    var i = z(je(e), 2), o = i[0], s = i[1], l = t.state, u = l.width, c = l.height, f = l.offsetMatrix, d = l.targetMatrix, p = l.is3d, v = t.props.originRelative, m = v === void 0 ? !0 : v, x = p ? 4 : 3, y = [o, s];
    if (a) {
      var b = e.distOrigin;
      (b[0] || b[1]) && (y = b);
    }
    var E = Dt(r.startOrigin, y), C = Dt(r.startTargetOrigin, y), D = pt(y, r.prevOrigin), h = En(f, d, E, x), _ = t.getRect(), M = Ee(xr(h, u, c, x)), T = [
      _.left - M.left,
      _.top - M.top
    ];
    r.prevOrigin = y;
    var k = [
      ke(C[0], u, m),
      ke(C[1], c, m)
    ].join(" "), A = se.drag(t, Cn(e, t.state, T, !!n)), O = St(t, e, P(P({ width: u, height: c, origin: E, dist: y, delta: D, transformOrigin: k, drag: A }, ue({
      transformOrigin: k,
      transform: A.transform
    }, e)), { afterTransform: A.transform }));
    return st(t, "onDragOrigin", O), O;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    return r.isDragOrigin ? (st(t, "onDragOriginEnd", ge(t, e, {})), !0) : !1;
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
function zv(t, e, r, n) {
  var a = t.filter(function(l) {
    var u = l.virtual, c = l.horizontal;
    return c && !u;
  }).length, i = t.filter(function(l) {
    var u = l.virtual, c = l.vertical;
    return c && !u;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    Av(t, o), o < 4 ? s.pos[0] = r : s.pos[1] = n;
  }
}
function Av(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(r) {
    r.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(r) {
    r.virtual = !1;
  }));
}
function Nv(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(r) {
    r.virtual = !0;
  }) : t.slice(e).forEach(function(r) {
    r.virtual = !0;
  });
}
function Xs(t, e, r, n, a) {
  n === void 0 && (n = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = Qe(t), Lu(i, e, r, 0, 0, n, a);
}
function Hs(t, e, r, n, a) {
  var i = t.state, o = i.width, s = i.height, l = Eo(a, t.props.roundRelative, o, s), u = l.raws, c = l.styles, f = l.radiusPoses, d = _v(f, u), p = d.horizontals, v = d.verticals, m = c.join(" ");
  i.borderRadiusState = m;
  var x = St(t, e, P({ horizontals: p, verticals: v, borderRadius: m, width: o, height: s, delta: n, dist: r }, ue({
    borderRadius: m
  }, e)));
  return st(t, "onRound", x), x;
}
function qs(t) {
  var e, r, n = t.getState().style, a = n.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (r = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && r !== void 0 ? r : "", n.borderRadius = a) : (a = xo(o).borderRadius, n.borderRadius = a));
  }
  return a;
}
var Bv = {
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
    var r = t.getState(), n = r.target, a = r.width, i = r.height, o = r.allMatrix, s = r.is3d, l = r.left, u = r.top, c = r.borderRadiusState, f = t.props, d = f.minRoundControls, p = d === void 0 ? [0, 0] : d, v = f.maxRoundControls, m = v === void 0 ? [4, 4] : v, x = f.zoom, y = f.roundPadding, b = y === void 0 ? 0 : y, E = f.isDisplayShadowRoundControls, C = f.groupable;
    if (!n)
      return null;
    var D = c || qs(t), h = s ? 4 : 3, _ = Xs(D, a, i, p, !0);
    if (!_)
      return null;
    var M = 0, T = 0, k = C ? [0, 0] : [l, u];
    return _.map(function(A, O) {
      var I = A.horizontal, N = A.vertical, B = A.direction || "", W = Q([], z(A.pos), !1);
      T += Math.abs(I), M += Math.abs(N), I && B.indexOf("n") > -1 && (W[1] -= b), N && B.indexOf("w") > -1 && (W[0] -= b), I && B.indexOf("s") > -1 && (W[1] += b), N && B.indexOf("e") > -1 && (W[0] += b);
      var H = pt(jt(o, W, h), k), L = E && E !== "horizontal", X = A.vertical ? M <= m[1] && (L || !A.virtual) : T <= m[0] && (E || !A.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(O), className: dt("control", "border-radius", A.vertical ? "vertical" : "", A.virtual ? "virtual" : ""), "data-radius-index": O, style: {
        display: X ? "block" : "none",
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
    var f = St(t, e, {}), d = st(t, "onRoundStart", f);
    if (d === !1)
      return !1;
    n.lineIndex = u, n.controlIndex = l, n.isControl = o, n.isLine = s, mr(t, e);
    var p = t.props, v = p.roundRelative, m = p.minRoundControls, x = m === void 0 ? [0, 0] : m, y = t.state, b = y.width, E = y.height;
    n.isRound = !0, n.prevDist = [0, 0];
    var C = qs(t), D = Xs(C || "", b, E, x, !0) || [];
    return n.controlPoses = D, y.borderRadiusState = Eo(D, v, b, E).styles.join(" "), f;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = r.controlPoses;
    if (!r.isRound || !r.isControl || !n.length)
      return !1;
    var a = r.controlIndex, i = z(je(e), 2), o = i[0], s = i[1], l = [o, s], u = pt(l, r.prevDist), c = t.props.maxRoundControls, f = c === void 0 ? [4, 4] : c, d = t.state, p = d.width, v = d.height, m = n[a], x = m.vertical, y = m.horizontal, b = n.map(function(C) {
      var D = C.horizontal, h = C.vertical, _ = [
        D * y * l[0],
        h * x * l[1]
      ];
      if (D) {
        if (f[0] === 1)
          return _;
        if (f[0] < 4 && D !== y)
          return _;
      } else {
        if (f[1] === 0)
          return _[1] = h * y * l[0] / p * v, _;
        if (x) {
          if (f[1] === 1)
            return _;
          if (f[1] < 4 && h !== x)
            return _;
        }
      }
      return [0, 0];
    });
    b[a] = l;
    var E = n.map(function(C, D) {
      return P(P({}, C), { pos: Dt(C.pos, b[D]) });
    });
    return a < 4 ? E.slice(0, a + 1).forEach(function(C) {
      C.virtual = !1;
    }) : E.slice(4, a + 1).forEach(function(C) {
      C.virtual = !1;
    }), r.prevDist = [o, s], Hs(t, e, l, u, E);
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
        Nv(u, o);
      else if (s && (d === !0 || d === "line")) {
        var p = z(ql(t, e), 2), v = p[0], m = p[1];
        zv(u, l, v, m);
      }
      c !== u.filter(function(y) {
        var b = y.virtual;
        return b;
      }).length && Hs(t, e, [0, 0], [0, 0], u);
    }
    var x = ge(t, e, {});
    return st(t, "onRoundEnd", x), r.borderRadiusState = "", x;
  },
  dragGroupControlStart: function(t, e) {
    var r = this.dragControlStart(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Re(t, "roundable", e), o = P({ targets: t.props.targets, events: i.map(function(s, l) {
      return P(P({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] });
    }) }, r);
    return st(t, "onRoundGroupStart", o), r;
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
    return st(t, "onRoundGroup", o), o;
  },
  dragGroupControlEnd: function(t, e) {
    var r = t.moveables, n = t.props.targets, a = Re(t, "roundable", e);
    Pa(t, "onRound", function(s) {
      var l = P({ targets: t.props.targets, events: a.map(function(u, c) {
        return P(P(P({}, u), { target: n[c], moveable: r[c], currentTarget: r[c] }), ue({
          borderRadius: s.borderRadius
        }, u));
      }) }, s);
      st(t, "onRoundGroup", l);
    });
    var i = this.dragControlEnd(t, e);
    if (!i)
      return !1;
    var o = P({ targets: t.props.targets, events: a.map(function(s, l) {
      var u;
      return P(P({}, s), { target: n[l], moveable: r[l], currentTarget: r[l], lastEvent: (u = s.datas) === null || u === void 0 ? void 0 : u.lastEvent });
    }) }, i);
    return st(t, "onRoundGroupEnd", o), o;
  },
  unset: function(t) {
    t.state.borderRadiusState = "";
  }
};
function jv(t, e) {
  var r = e ? 4 : 3, n = zt(r), a = "matrix".concat(e ? "3d" : "", "(").concat(n.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var Yu = {
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
    var r = t.state, n = r.is3d, a = r.targetMatrix, i = r.inlineTransform, o = n ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(Pl(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = jv(s, n) ? [] : Qe(s);
  },
  resetStyle: function(t) {
    var e = t.datas;
    e.nextStyle = {}, e.nextTransforms = t.datas.startTransforms, e.nextTransformAppendedIndexes = [];
  },
  fillDragStartParams: function(t, e) {
    return St(t, e, {
      setTransform: function(r) {
        e.datas.startTransforms = Xt(r) ? r : Qe(r);
      },
      isPinch: !!e.isPinch
    });
  },
  fillDragParams: function(t, e) {
    return St(t, e, {
      isPinch: !!e.isPinch
    });
  },
  dragStart: function(t, e) {
    this.setTransform(t, e), this.resetStyle(e), st(t, "onBeforeRenderStart", this.fillDragStartParams(t, e));
  },
  drag: function(t, e) {
    e.datas.startTransforms || this.setTransform(t, e), this.resetStyle(e), st(t, "onBeforeRender", St(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  dragEnd: function(t, e) {
    e.datas.startTransforms || (this.setTransform(t, e), this.resetStyle(e)), st(t, "onBeforeRenderEnd", St(t, e, {
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
    st(t, "onBeforeRenderGroupStart", St(t, e, {
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
    st(t, "onBeforeRenderGroup", St(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets,
      events: i
    }));
  },
  dragGroupEnd: function(t, e) {
    this.dragEnd(t, e), st(t, "onBeforeRenderGroupEnd", St(t, e, {
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
}, Xu = {
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
    st(t, "onRenderStart", St(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  drag: function(t, e) {
    st(t, "onRender", this.fillDragParams(t, e));
  },
  dragAfter: function(t, e) {
    return this.drag(t, e);
  },
  dragEnd: function(t, e) {
    st(t, "onRenderEnd", this.fillDragEndParams(t, e));
  },
  dragGroupStart: function(t, e) {
    st(t, "onRenderGroupStart", St(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets
    }));
  },
  dragGroup: function(t, e) {
    var r = this, n = Re(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragParams(l, o);
    });
    st(t, "onRenderGroup", St(t, e, P(P({ isPinch: !!e.isPinch, targets: t.props.targets, transform: qn(e), transformObject: {} }, ue(Vn(e))), { events: i })));
  },
  dragGroupEnd: function(t, e) {
    var r = this, n = Re(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragEndParams(l, o);
    });
    st(t, "onRenderGroupEnd", St(t, e, P({ isPinch: !!e.isPinch, isDrag: e.isDrag, targets: t.props.targets, events: i, transformObject: {}, transform: qn(e) }, ue(Vn(e)))));
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
    return zr(da(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), St(t, e, P({ isPinch: !!e.isPinch, transformObject: r, transform: qn(e) }, ue(Vn(e))));
  },
  fillDragEndParams: function(t, e) {
    var r = {};
    return zr(da(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), St(t, e, P({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: r, transform: qn(e) }, ue(Vn(e))));
  }
};
function cn(t, e, r, n, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", u = a === "After", c = t.state.target, f = i.isRequest, d = n.indexOf("Control") > -1;
  if (!c || s && d && !f && t.areaElement === i.inputEvent.target)
    return !1;
  var p = Q([], z(e), !1);
  if (f) {
    var v = i.requestAble;
    p.some(function(O) {
      return O.name === v;
    }) || p.push.apply(p, Q([], z(t.props.ables.filter(function(O) {
      return O.name === v;
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
  var C = i.datas, D = d ? "controlGesto" : "targetGesto", h = t[D], _ = function(O, I, N) {
    if (!(I in O) || h !== t[D])
      return !1;
    var B = O.name, W = C[B] || (C[B] = {});
    if (s && (W.isEventStart = !N || !O[N] || O[N](t, i)), !W.isEventStart)
      return !1;
    var H = O[I](t, P(P({}, i), { stop: b, datas: W, originalDatas: C, inputTarget: x }));
    return t._emitter.off(), s && H === !1 && (W.isEventStart = !1), H;
  };
  E && p.forEach(function(O) {
    O.unset && O.unset(t);
  }), _(Yu, "drag".concat(n).concat(a));
  var M = 0, T = 0;
  r.forEach(function(O) {
    if (y)
      return !1;
    var I = "".concat(O).concat(n).concat(a), N = "".concat(O).concat(n, "Condition");
    a === "" && !f && sv(t.state, i);
    var B = p.filter(function(L) {
      return L[I];
    });
    B = B.filter(function(L, X) {
      return L.name && B.indexOf(L) === X;
    });
    var W = B.filter(function(L) {
      return _(L, I, N);
    }), H = W.length;
    y && ++M, H && ++T, !y && s && B.length && !H && (M += B.filter(function(L) {
      var X = L.name, V = C[X];
      return V.isEventStart ? L.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!u || T) && _(Xu, "drag".concat(n).concat(a));
  var k = h !== t[D] || M === r.length;
  if ((l || y || k) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(O) {
    O.state.gestos = {};
  }), p.forEach(function(O) {
    O.unset && O.unset(t);
  })), s && !k && !f && T && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || k)
    return !1;
  if (!s && T && !o || l) {
    var A = t.props.flushSync || Su;
    A(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !u && T && !o && cn(t, e, r, n, a + "After", i), !0;
}
function Do(t, e) {
  return function(r, n) {
    var a;
    n === void 0 && (n = r.inputEvent.target);
    var i = n, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || Zt(i, "moveable-area") || Zt(i, "moveable-padding") || Zt(i, "moveable-edgeDraggable");
  };
}
function Hu(t, e, r) {
  var n = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(n), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var u = Do(t);
  return Vu(t, a, "targetAbles", r, {
    dragStart: u,
    pinchStart: u
  });
}
function qu(t, e) {
  var r = t.controlBox, n = [];
  n.push(r);
  var a = Do(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === r)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return Vu(t, n, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function Vu(t, e, r, n, a) {
  a === void 0 && (a = {});
  var i = r === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, u = o.preventClickEventOnDrag, c = o.preventClickDefault, f = o.checkInput, d = o.dragFocusedInput, p = o.preventDefault, v = p === void 0 ? !0 : p, m = o.preventRightClick, x = m === void 0 ? !0 : m, y = o.preventWheelClick, b = y === void 0 ? !0 : y, E = o.dragContainer, C = Be(E, !0), D = {
    preventDefault: v,
    preventRightClick: x,
    preventWheelClick: b,
    container: C || Ce(t.getControlBoxElement()),
    pinchThreshold: l,
    pinchOutside: s,
    preventClickEventOnDrag: i ? u : !1,
    preventClickEventOnDragStart: i ? c : !1,
    preventClickEventByCondition: i ? null : function(M) {
      return t.controlBox.contains(M.target);
    },
    checkInput: i ? f : !1,
    dragFocusedInput: d
  }, h = new jl(e, D), _ = n === "Control";
  return ["drag", "pinch"].forEach(function(M) {
    ["Start", "", "End"].forEach(function(T) {
      h.on("".concat(M).concat(T), function(k) {
        var A, O = k.eventType, I = M === "drag" && k.isPinch;
        if (a[O] && !a[O](k)) {
          k.stop();
          return;
        }
        if (!I) {
          var N = M === "drag" ? [M] : ["drag", M], B = Q([], z(t[r]), !1), W = cn(t, B, N, n, T, k);
          W ? (t.props.stopPropagation || T === "Start" && _) && ((A = k == null ? void 0 : k.inputEvent) === null || A === void 0 || A.stopPropagation()) : k.stop();
        }
      });
    });
  }), h;
}
var Gv = /* @__PURE__ */ (function() {
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
function Fv(t, e, r, n) {
  var a;
  r === void 0 && (r = e);
  var i = Jl(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, u = i.transformOrigin, c = i.targetOrigin, f = i.offsetContainer, d = i.hasFixed, p = i.zoom, v = tp(f, r), m = v.matrixes, x = v.is3d, y = v.offsetContainer, b = v.zoom, E = n, C = 4, D = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, h = l, _ = zt(C), M = zt(C), T = zt(C), k = zt(C), A = o.length, O = m.map(function(X) {
    return P(P({}, X), { matrix: X.matrix ? Q([], z(X.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && E && (h = Pe(h, 3, 4), zi(o)), !x && E && zi(O), O.forEach(function(X) {
    M = Pt(M, X.matrix, C);
  });
  var I = r || rr(t), N = ((a = O[0]) === null || a === void 0 ? void 0 : a.target) || gn(I, I, !0).offsetParent, B = O.slice(1).reduce(function(X, V) {
    return Pt(X, V.matrix, C);
  }, zt(C));
  o.forEach(function(X, V) {
    if (A - 2 === V && (T = _.slice()), A - 1 === V && (k = _.slice()), !X.matrix) {
      var G = o[V + 1], tt = nv(X, G, N, C, Pt(B, _, C));
      X.matrix = vr(tt, C);
    }
    _ = Pt(_, X.matrix, C);
  });
  var W = !D && s;
  h || (h = zt(W ? 4 : 3));
  var H = Ia(D && h.length === 16 ? Pe(h, 4, 3) : h, W), L = M;
  return M = Rl(M, C, C), {
    hasZoom: p !== 1 || b !== 1,
    hasFixed: d,
    matrixes: o,
    rootMatrix: M,
    originalRootMatrix: L,
    beforeMatrix: T,
    offsetMatrix: k,
    allMatrix: _,
    targetMatrix: h,
    targetTransform: H,
    inlineTransform: t.style.transform,
    transformOrigin: u,
    targetOrigin: c,
    is3d: E,
    offsetContainer: f,
    offsetRootContainer: y
  };
}
function Lv(t, e, r, n) {
  r === void 0 && (r = e);
  var a = 0, i = 0, o = 0, s = {}, l = Du(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var u = Fv(t, e, r, n), c = Pr(u.allMatrix, u.transformOrigin, a, i);
    s = P(P({}, u), c);
    var f = Pr(u.allMatrix, [50, 50], 100, 100);
    o = _u([f.pos1, f.pos2], f.direction);
  }
  var d = 4;
  return P(P(P({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: zt(d), rootMatrix: zt(d), beforeMatrix: zt(d), offsetMatrix: zt(d), allMatrix: zt(d), targetMatrix: zt(d), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function ji(t, e, r, n, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = Un(), u = Un(), c = Un(), f = Un(), d = [0, 0], p = {}, v = Lv(e, r, a, !0);
  if (e) {
    var m = pe(e);
    i.forEach(function(O) {
      p[O] = m(O);
    });
    var x = v.is3d ? 4 : 3, y = Pr(v.offsetMatrix, Dt(v.transformOrigin, Il(v.targetMatrix, x)), v.width, v.height);
    o = y.direction, s = Dt(y.origin, [y.left - v.left, y.top - v.top]), f = un(v.offsetRootContainer);
    var b = gn(n, n, !0).offsetParent || v.offsetRootContainer;
    if (v.hasZoom) {
      var E = Pr(Pt(v.originalRootMatrix, v.allMatrix), v.transformOrigin, v.width, v.height), C = Pr(v.originalRootMatrix, ga(pe(b)("transformOrigin")).map(function(O) {
        return parseFloat(O);
      }), b.offsetWidth, b.offsetHeight);
      if (l = ei(E, f), c = ei(C, f, b, !0), t) {
        var D = E.left, h = E.top;
        u = ei({
          left: D,
          top: h,
          bottom: h,
          right: h
        }, f);
      }
    } else {
      l = un(e), c = Qd(b), t && (u = un(t));
      var _ = c.left, M = c.top, T = c.clientLeft, k = c.clientTop, A = [
        l.left - _,
        l.top - M
      ];
      d = pt(jr(v.rootMatrix, A, 4), [T + v.left, k + v.top]);
    }
  }
  return P({ targetClientRect: l, containerClientRect: c, moveableClientRect: u, rootContainerClientRect: f, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: p, offsetDelta: d }, v);
}
function Vs(t) {
  var e = t.pos1, r = t.pos2, n = t.pos3, a = t.pos4;
  if (!e || !r || !n || !a)
    return null;
  var i = hr([e, r, n, a]), o = [i.minX, i.minY], s = pt(t.origin, o);
  return e = pt(e, o), r = pt(r, o), n = pt(n, o), a = pt(a, o), P(P({}, t), {
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
var Gr = /* @__PURE__ */ (function(t) {
  bn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.state = P({ container: null, gestos: {}, renderLines: [
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]]
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, ji(null)), r.renderState = {}, r.enabledAbles = [], r.targetAbles = [], r.controlAbles = [], r.rotation = 0, r.scale = [1, 1], r.isMoveableMounted = !1, r.isUnmounted = !1, r.events = {
      mouseEnter: null,
      mouseLeave: null
    }, r._emitter = new yn(), r._prevOriginalDragTarget = null, r._originalDragTarget = null, r._prevDragTarget = null, r._dragTarget = null, r._prevPropTarget = null, r._propTarget = null, r._prevDragArea = !1, r._isPropTargetChanged = !1, r._hasFirstTarget = !1, r._reiszeObserver = null, r._observerId = 0, r._mutationObserver = null, r._rootContainer = null, r._viewContainer = null, r._viewClassNames = [], r._store = {}, r.checkUpdateRect = function() {
      if (!r.isDragging()) {
        var n = r.props.parentMoveable;
        if (n) {
          n.checkUpdateRect();
          return;
        }
        Rf(r._observerId), r._observerId = Ml(function() {
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
    var v = z(a || [0, 0], 2), m = v[0], x = v[1], y = n.left, b = n.top, E = n.target, C = n.direction, D = n.hasFixed, h = n.offsetDelta, _ = r.targets, M = this.isDragging(), T = {};
    this.getEnabledAbles().forEach(function(B) {
      T["data-able-".concat(B.name.toLowerCase())] = !0;
    });
    var k = this._getAbleClassName(), A = _ && _.length && (E || f) || o || !this._hasFirstTarget && this.state.isPersisted, O = this.controlBox || this.props.firstRenderState || this.props.persistData, I = [y - m, b - x];
    !f && r.useAccuratePosition && (I[0] += h[0], I[1] += h[1]);
    var N = {
      position: D ? "fixed" : "absolute",
      display: A ? "block" : "none",
      visibility: O ? "visible" : "hidden",
      transform: "translate3d(".concat(I[0], "px, ").concat(I[1], "px, ").concat(u, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return d && (N["--moveable-line-padding"] = d), p && (N["--moveable-control-padding"] = p), at.createElement(
      c,
      P({ cspNonce: l, ref: Je(this, "controlBox"), className: "".concat(dt("control-box", C === -1 ? "reverse" : "", M ? "dragging" : ""), " ").concat(k, " ").concat(i) }, T, { onClick: this._onPreventClick, style: N }),
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
    a && this._changeAbleViewClassNames([]), Tr(this, !1), Tr(this, !0);
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
    return he(n, function(a) {
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
    return r && (((n = r.getAttribute) === null || n === void 0 ? void 0 : n.call(r, "class")) || "").indexOf(io) > -1;
  }, e.prototype.dragStart = function(r, n) {
    n === void 0 && (n = r.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && Do(this)({ inputEvent: r }, n) ? a.isFlag() || a.triggerDragStart(r) : i && this.isMoveableElement(n) && (i.isFlag() || i.triggerDragStart(r)), this;
  }, e.prototype.hitTest = function(r) {
    var n = this.state, a = n.target, i = n.pos1, o = n.pos2, s = n.pos3, l = n.pos4, u = n.targetClientRect;
    if (!a)
      return 0;
    var c;
    if (vn(r)) {
      var f = r.getBoundingClientRect();
      c = {
        left: f.left,
        top: f.top,
        width: f.width,
        height: f.height
      };
    } else
      c = P({ width: 0, height: 0 }, r);
    var d = c.left, p = c.top, v = c.width, m = c.height, x = bi([i, o, l, s], u), y = od(x, [
      [d, p],
      [d + v, p],
      [d + v, p + m],
      [d, p + m]
    ]), b = an(x);
    return !y || !b ? 0 : Math.min(100, y / b * 100);
  }, e.prototype.isInside = function(r, n) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, u = a.pos4, c = a.targetClientRect;
    return i ? ca([r, n], bi([o, s, u, l], c)) : !1;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && Nr(!0);
    var s = i.parentMoveable, l = this.state, u = l.target || i.target, c = this.getContainer(), f = s ? s._rootContainer : this._rootContainer, d = ji(this.controlBox, u, c, c, f || c, this._getRequestStyles());
    if (!u && this._hasFirstTarget && i.persistData) {
      var p = Vs(i.persistData);
      for (var v in p)
        d[v] = p[v];
    }
    o && Nr(), this.updateState(d, s ? !1 : a);
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
    var r = this.state, n = _e(this.state), a = z(n, 4), i = a[0], o = a[1], s = a[2], l = a[3], u = Ee(n), c = r.width, f = r.height, d = u.width, p = u.height, v = u.left, m = u.top, x = [r.left, r.top], y = Dt(x, r.origin), b = Dt(x, r.beforeOrigin), E = r.transformOrigin;
    return {
      width: d,
      height: p,
      left: v,
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
      (n == null ? void 0 : n.isIdle()) === !1 && Ai(this, !1), n == null || n.stop();
    }
    if (!r || r === "control") {
      var n = this.controlGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && Ai(this, !0), n == null || n.stop();
    }
  }, e.prototype.getRotation = function() {
    var r = this.state, n = r.pos1, a = r.pos2, i = r.direction;
    return cv(n, a, i);
  }, e.prototype.request = function(r, n, a) {
    n === void 0 && (n = {});
    var i = this, o = i.props, s = o.parentMoveable || o.wrapperMoveable || i, l = s.props.ables, u = o.groupable, c = he(l, function(y) {
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
    var f = c.request(i), d = a || n.isInstant, p = f.isControl ? "controlAbles" : "targetAbles", v = "".concat(u ? "Group" : "").concat(f.isControl ? "Control" : ""), m = Q([], z(s[p]), !1), x = {
      request: function(y) {
        return cn(i, m, ["drag"], v, "", P(P({}, f.request(y)), { requestAble: r, isRequest: !0 }), d), x;
      },
      requestEnd: function() {
        return cn(i, m, ["drag"], v, "End", P(P({}, f.requestEnd()), { requestAble: r, isRequest: !0 }), d), x;
      }
    };
    return cn(i, m, ["drag"], v, "Start", P(P({}, f.requestStart(n)), { requestAble: r, isRequest: !0 }), d), d ? x.request(n).requestEnd() : x;
  }, e.prototype.getMoveables = function() {
    return [this];
  }, e.prototype.destroy = function() {
    this.componentWillUnmount();
  }, e.prototype.updateRenderPoses = function() {
    var r = this.getState(), n = this.props, a = n.padding, i = r.originalBeforeOrigin, o = r.transformOrigin, s = r.allMatrix, l = r.is3d, u = r.pos1, c = r.pos2, f = r.pos3, d = r.pos4, p = r.left, v = r.top, m = r.isPersisted, x = n.zoom || 1;
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
    var y = Nu(a || {}), b = y.left, E = y.top, C = y.bottom, D = y.right, h = l ? 4 : 3, _ = [];
    m ? _ = o : this.controlBox && n.groupable ? _ = i : _ = Dt(i, [p, v]);
    var M = ua(h, vr(_.map(function(N) {
      return -N;
    }), h), s, vr(o, h)), T = Se(M, u, [-b, -E], h), k = Se(M, c, [D, -E], h), A = Se(M, f, [-b, C], h), O = Se(M, d, [D, C], h);
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
      var I = x / 2;
      r.renderLines = [
        [
          Se(M, u, [-b - I, -E], h),
          Se(M, c, [D + I, -E], h)
        ],
        [
          Se(M, c, [D, -E - I], h),
          Se(M, d, [D, C + I], h)
        ],
        [
          Se(M, d, [D + I, C], h),
          Se(M, f, [-b - I, C], h)
        ],
        [
          Se(M, f, [-b, C + I], h),
          Se(M, u, [-b, -E - I], h)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var r = this.props, n = r.target, a = r.container, i = r.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !n)) {
      this.updateAbles();
      var u = !Ni(s, n), c = u || !Ni(l, a);
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
    return a[i] || (a[i] = Fl(r, n)), a[i];
  }, e.prototype.getState = function() {
    var r, n = this.props;
    (n.target || !((r = n.targets) === null || r === void 0) && r.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = n.persistData, o = n.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = Vs(i);
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
    var a = this.props, i = a.triggerAblesSimultaneously, o = this.getEnabledAbles(r), s = "drag".concat(n, "Start"), l = "pinch".concat(n, "Start"), u = "drag".concat(n, "ControlStart"), c = Kn(o, [s, l], i), f = Kn(o, [u], i);
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
    return this.renderState = {}, ov(Pu(Kn(this.getEnabledAbles(), ["render"], a).map(function(o) {
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
      return Q(Q([], z(n), !1), z(s), !1);
    }, Q([], z(this.props.requestStyles || []), !1));
    return r;
  }, e.prototype._updateObserver = function(r) {
    this._updateResizeObserver(r), this._updateMutationObserver(r);
  }, e.prototype._updateEvents = function() {
    var r = this.targetAbles.length, n = this.controlAbles.length, a = this._dragTarget, i = !r && this.targetGesto || this._isTargetChanged(!0);
    i && (Tr(this, !1), this.updateState({ gestos: {} })), n || Tr(this, !0), a && r && !this.targetGesto && (this.targetGesto = Hu(this, a, "")), !this.controlGesto && n && (this.controlGesto = qu(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var r = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = r.dragArea, this._propTarget = r.target, this._originalDragTarget = r.dragTarget || r.target, this._dragTarget = Be(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var r = this.props, n = r, a = n.zoom, i = n.hideDefaultLines, o = n.hideChildMoveableDefaultLines, s = n.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), u = {
      createElement: at.createElement
    };
    return l.renderLines.map(function(c, f) {
      return hn(u, "", c[0], c[1], a, "render-line-".concat(f));
    });
  }, e.prototype._isTargetChanged = function(r) {
    var n = this.props, a = n.dragTarget || n.target, i = this._prevOriginalDragTarget, o = this._prevDragArea, s = n.dragArea, l = !s && i !== a, u = (r || s) && o !== s;
    return l || u || this._prevPropTarget != this._propTarget;
  }, e.prototype._updateNativeEvents = function() {
    var r = this, n = this.props, a = n.dragArea ? this.areaElement : this.state.target, i = this.events, o = Fr(i);
    if (this._isTargetChanged())
      for (var s in i) {
        var l = i[s];
        l && l.destroy(), i[s] = null;
      }
    if (a) {
      var u = this.enabledAbles;
      o.forEach(function(c) {
        var f = Kn(u, [c]), d = f.length > 0, p = i[c];
        if (!d) {
          p && (p.destroy(), i[c] = null);
          return;
        }
        p || (p = new Gv(a, r, c), i[c] = p), p.setAbles(f);
      });
    }
  }, e.prototype._checkUpdateRootContainer = function() {
    var r = this.props.rootContainer;
    !this._rootContainer && r && (this._rootContainer = Be(r, !0));
  }, e.prototype._checkUpdateViewContainer = function() {
    var r = this.props.viewContainer;
    !this._viewContainer && r && (this._viewContainer = Be(r, !0));
    var n = this._viewContainer;
    n && this._changeAbleViewClassNames(Q(Q([], z(this._getAbleViewClassNames()), !1), [
      this.isDragging() ? mv : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(r) {
    var n = this._viewContainer, a = Iu(r.filter(Boolean), function(u) {
      return u;
    }).map(function(u) {
      var c = z(u, 1), f = c[0];
      return f;
    }), i = this._viewClassNames, o = ro(i, a), s = o.removed, l = o.added;
    s.forEach(function(u) {
      kl(n, i[u]);
    }), l.forEach(function(u) {
      Zi(n, a[u]);
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
      var c, f, d, p = u.name, v = ((c = u.className) === null || c === void 0 ? void 0 : c.call(u, n)) || "";
      return (!((f = s[p]) === null || f === void 0) && f.isEventStart || !((d = l[p]) === null || d === void 0) && d.isEventStart) && (v += " ".concat(dt("".concat(p).concat(r, "-dragging")))), v.trim();
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
          for (var d = Sd(u), p = d.next(); !p.done; p = d.next()) {
            var v = p.value;
            v.type === "attributes" && v.attributeName === "style" && n.checkUpdateRect();
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
    flushSync: Su,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})(at.PureComponent), _o = {
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
    var d = Rr(t, "parentPosition", [o, s], function(v) {
      return v.join(",");
    }), p = Rr(t, "requestStyles", t.getRequestChildStyles(), function(v) {
      return v.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), Q(Q([], z(a.map(function(v, m) {
      return e.createElement(Gr, { key: "moveable" + m, ref: Cl(t, "moveables", m), target: v, origin: !1, requestStyles: p, cssStyled: n.cssStyled, customStyledMap: n.customStyledMap, useResizeObserver: n.useResizeObserver, useMutationObserver: n.useMutationObserver, hideChildMoveableDefaultLines: n.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: f[m], zoom: u });
    })), !1), z(Pu(c.map(function(v, m) {
      var x = v.pos1, y = v.pos2, b = v.pos3, E = v.pos4, C = [x, y, b, E];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(D, h) {
        var _ = z(D, 2), M = _[0], T = _[1];
        return hn(e, "", pt(C[M], d), pt(C[T], d), u, "group-rect-".concat(m, "-").concat(h));
      });
    }))), !1);
  }
}, Wv = Sn("clickable", {
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
      st(t, "onClick", St(t, e, {
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
      i === -1 && (i = Xe(a, function(l) {
        return l.contains(n);
      }), s = i > -1), st(t, "onClickGroup", St(t, e, {
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
function Cr(t) {
  var e = t.originalDatas.draggable;
  return e || (t.originalDatas.draggable = {}, e = t.originalDatas.draggable), P(P({}, t), { datas: e });
}
var Yv = Sn("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var r = t.props, n = r.edgeDraggable;
    return n ? eu(e, "edgeDraggable", n, t.getState().renderPoses, r.zoom) : [];
  },
  dragCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && Zt(a, dt("direction")) && Zt(a, dt("edge")) && Zt(a, dt("edgeDraggable"));
  },
  dragStart: function(t, e) {
    return se.dragStart(t, Cr(e));
  },
  drag: function(t, e) {
    return se.drag(t, Cr(e));
  },
  dragEnd: function(t, e) {
    return se.dragEnd(t, Cr(e));
  },
  dragGroupCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && Zt(a, dt("direction")) && Zt(a, dt("line"));
  },
  dragGroupStart: function(t, e) {
    return se.dragGroupStart(t, Cr(e));
  },
  dragGroup: function(t, e) {
    return se.dragGroup(t, Cr(e));
  },
  dragGroupEnd: function(t, e) {
    return se.dragGroupEnd(t, Cr(e));
  },
  unset: function(t) {
    return se.unset(t);
  }
}), $u = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, Xv = [
  Yu,
  Gu,
  Vp,
  dv,
  se,
  Yv,
  Ii,
  pv,
  hv,
  Tp,
  bv,
  Sv,
  xv,
  Ov,
  Pv,
  Bv,
  _o,
  $u,
  Wv,
  ju,
  Xu
];
function $s(t, e) {
  var r = z(t, 3), n = r[0], a = r[1], i = r[2];
  return (n * e[0] + a * e[1] + i) / Math.sqrt(n * n + a * a);
}
function Qn(t, e) {
  var r = z(t, 2), n = r[0], a = r[1];
  return -n * e[0] - a * e[1];
}
function Us(t, e) {
  return Math.max.apply(Math, Q([], z(t.map(function(r) {
    var n = z(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function Ks(t, e) {
  return Math.min.apply(Math, Q([], z(t.map(function(r) {
    var n = z(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function Hv(t, e) {
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
  var f = mt(e, ce);
  if (f % 90) {
    var d = f / 180 * Math.PI, p = Math.tan(d), v = -1 / p, m = [Mi, ys], x = [[0, 0], [0, 0]], y = [Mi, ys], b = [[0, 0], [0, 0]];
    t.forEach(function(et) {
      et.forEach(function(Z) {
        var rt = $s([-p, 1, 0], Z), q = $s([-v, 1, 0], Z);
        m[0] > rt && (x[0] = Z, m[0] = rt), m[1] < rt && (x[1] = Z, m[1] = rt), y[0] > q && (b[0] = Z, y[0] = q), y[1] < q && (b[1] = Z, y[1] = q);
      });
    });
    var E = z(x, 2), C = E[0], D = E[1], h = z(b, 2), _ = h[0], M = h[1], T = [-p, 1, Qn([-p, 1], C)], k = [-p, 1, Qn([-p, 1], D)], A = [-v, 1, Qn([-v, 1], _)], O = [-v, 1, Qn([-v, 1], M)];
    r = z([
      [T, A],
      [T, O],
      [k, A],
      [k, O]
    ].map(function(et) {
      var Z = z(et, 2), rt = Z[0], q = Z[1];
      return no(rt, q)[0];
    }), 4), i = r[0], o = r[1], s = r[2], l = r[3], u = y[1] - y[0], c = m[1] - m[0];
  } else {
    var I = Ks(t, 0), N = Ks(t, 1), B = Us(t, 0), W = Us(t, 1);
    if (i = [I, N], o = [B, N], s = [I, W], l = [B, W], u = B - I, c = W - N, f % 180) {
      var H = [s, i, l, o];
      n = z(H, 4), i = n[0], o = n[1], s = n[2], l = n[3], u = W - N, c = B - I;
    }
  }
  if (f % 360 > 180) {
    var H = [l, s, o, i];
    a = z(H, 4), i = a[0], o = a[1], s = a[2], l = a[3];
  }
  var L = hr([i, o, s, l]), X = L.minX, V = L.minY, G = L.maxX, tt = L.maxY;
  return {
    pos1: i,
    pos2: o,
    pos3: s,
    pos4: l,
    width: u,
    height: c,
    minX: X,
    minY: V,
    maxX: G,
    maxY: tt,
    rotation: e
  };
}
function Uu(t, e) {
  var r = e.map(function(n) {
    if (Xt(n)) {
      var a = Uu(t, n), i = a.length;
      return i > 1 ? a : i === 1 ? a[0] : null;
    } else {
      var o = he(t, function(s) {
        var l = s.manager;
        return l.props.target === n;
      });
      return o ? (o.finded = !0, o.manager) : null;
    }
  }).filter(Boolean);
  return r.length === 1 && Xt(r[0]) ? r[0] : r;
}
var qv = /* @__PURE__ */ (function(t) {
  bn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.differ = new zl(), r.moveables = [], r.transformOrigin = "50% 50%", r.renderGroupRects = [], r._targetGroups = [], r._hasFirstTargets = !1, r;
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
    Nr(!0), this.moveables.forEach(function(ot) {
      ot.updateRect(r, !1, !1);
    });
    var s = this.props, l = this.moveables, u = o.target || s.target, c = l.map(function(ot) {
      return { finded: !1, manager: ot };
    }), f = this.props.targetGroups || [], d = Uu(c, f), p = s.useDefaultGroupRotate;
    d.push.apply(d, Q([], z(c.filter(function(ot) {
      var vt = ot.finded;
      return !vt;
    }).map(function(ot) {
      var vt = ot.manager;
      return vt;
    })), !1));
    var v = [], m = !n || r !== "" && s.updateGroup, x = s.defaultGroupRotate || 0;
    if (!this._hasFirstTargets) {
      var y = (i = s.persistData) === null || i === void 0 ? void 0 : i.rotation;
      y != null && (x = y);
    }
    function b(ot, vt, xt) {
      var U = ot.map(function(kt) {
        if (Xt(kt)) {
          var Ct = b(kt, vt), Mt = [Ct.pos1, Ct.pos2, Ct.pos3, Ct.pos4];
          return v.push(Ct), { poses: Mt, rotation: Ct.rotation };
        } else
          return {
            poses: _e(kt.state),
            rotation: kt.getRotation()
          };
      }), ut = U.map(function(kt) {
        var Ct = kt.rotation;
        return Ct;
      }), wt = 0, ht = ut[0], ft = ut.every(function(kt) {
        return Math.abs(ht - kt) < 0.1;
      });
      m ? wt = !p && ft ? ht : x : wt = !p && !xt && ft ? ht : vt;
      var yt = U.map(function(kt) {
        var Ct = kt.poses;
        return Ct;
      }), _t = Hv(yt, wt);
      return _t;
    }
    var E = b(d, this.rotation, !0);
    m && (this.rotation = E.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = f, this.renderGroupRects = v;
    var C = this.transformOrigin, D = this.rotation, h = this.scale, _ = E.width, M = E.height, T = E.minX, k = E.minY, A = fv([
      [0, 0],
      [_, 0],
      [0, M],
      [_, M]
    ], Co(C, _, M), this.rotation / 180 * Math.PI), O = hr(A.result), I = O.minX, N = O.minY, B = " rotate(".concat(D, "deg)") + " scale(".concat(le(h[0]), ", ").concat(le(h[1]), ")"), W = "translate(".concat(-I, "px, ").concat(-N, "px)").concat(B);
    this.controlBox.style.transform = "translate3d(".concat(T, "px, ").concat(k, "px, ").concat(this.props.translateZ || 0, ")"), u.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(C, ";") + "width:".concat(_, "px;height:").concat(M, "px;") + "transform: ".concat(W), o.width = _, o.height = M;
    var H = this.getContainer(), L = ji(this.controlBox, u, this.controlBox, this.getContainer(), this._rootContainer || H, []), X = [L.left, L.top], V = z(_e(L), 4), G = V[0], tt = V[1], et = V[2], Z = V[3], rt = hr([G, tt, et, Z]), q = [rt.minX, rt.minY], nt = le(h[0] * h[1]);
    L.pos1 = pt(G, q), L.pos2 = pt(tt, q), L.pos3 = pt(et, q), L.pos4 = pt(Z, q), L.left = T - L.left + q[0], L.top = k - L.top + q[1], L.origin = pt(Dt(X, L.origin), q), L.beforeOrigin = pt(Dt(X, L.beforeOrigin), q), L.originalBeforeOrigin = Dt(X, L.originalBeforeOrigin), L.transformOrigin = pt(Dt(X, L.transformOrigin), q), u.style.transform = "translate(".concat(-I - q[0], "px, ").concat(-N - q[1], "px)") + B, Nr(), this.updateState(P(P({}, L), { posDelta: q, direction: nt, beforeDirection: nt }), a);
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
      return Q(Q([], z(n), !1), z(s), !1);
    }, []);
    return r;
  }, e.prototype.getMoveables = function() {
    return Q([], z(this.moveables), !1);
  }, e.prototype.updateAbles = function() {
    t.prototype.updateAbles.call(this, Q(Q([], z(this.props.ables), !1), [_o], !1), "Group");
  }, e.prototype._updateTargets = function() {
    t.prototype._updateTargets.call(this), this._originalDragTarget = this.props.dragTarget || this.areaElement, this._dragTarget = Be(this._originalDragTarget, !0);
  }, e.prototype._updateEvents = function() {
    var r = this.state, n = this.props, a = this._prevDragTarget, i = n.dragTarget || this.areaElement, o = n.targets, s = this.differ.update(o), l = s.added, u = s.changed, c = s.removed, f = l.length || c.length;
    (f || this._prevOriginalDragTarget !== this._originalDragTarget) && (Tr(this, !1), Tr(this, !0), this.updateState({ gestos: {} })), a !== i && (r.target = null), r.target || (r.target = this.areaElement, this.controlBox.style.display = "block"), r.target && (this.targetGesto || (this.targetGesto = Hu(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = qu(this, "GroupControl")));
    var d = !Ni(r.container, n.container);
    d && (r.container = n.container), (d || f || this.transformOrigin !== (n.defaultGroupOrigin || "50% 50%") || u.length || o.length && !Au(this._targetGroups, n.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!f;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = P(P({}, Gr.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Gr), Vv = /* @__PURE__ */ (function(t) {
  bn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.moveables = [], r;
  }
  return e.prototype.render = function() {
    var r = this, n, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], u = l.length, c = this.isUnmounted || !u, f = (n = s == null ? void 0 : s.children) !== null && n !== void 0 ? n : [];
    return c && !u && f.length ? l = f.map(function() {
      return null;
    }) : c || (f = []), at.createElement(o, { cspNonce: i, ref: Je(this, "controlBox"), className: dt("control-box") }, l.map(function(d, p) {
      var v, m, x = (m = (v = a.individualGroupableProps) === null || v === void 0 ? void 0 : v.call(a, d, p)) !== null && m !== void 0 ? m : {};
      return at.createElement(Gr, P({ key: "moveable" + p, ref: Cl(r, "moveables", p) }, a, x, { target: d, wrapperMoveable: r, isWrapperMounted: r.isMoveableMounted, persistData: f[p] }));
    }));
  }, e.prototype.componentDidMount = function() {
  }, e.prototype.componentDidUpdate = function() {
  }, e.prototype.getTargets = function() {
    return this.props.targets;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0), Nr(!0), this.moveables.forEach(function(i) {
      i.updateRect(r, n, a);
    }), Nr();
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
    var a = n, i = he(this.moveables, function(o) {
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
    return Q([], z(this.moveables), !1);
  }, e.prototype.updateRenderPoses = function() {
  }, e.prototype.checkUpdate = function() {
  }, e.prototype.triggerEvent = function() {
  }, e.prototype.updateAbles = function() {
  }, e.prototype._updateEvents = function() {
  }, e.prototype._updateObserver = function() {
  }, e;
})(Gr);
function Ku(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (we(n)) {
        e[n] && r.push.apply(r, Q([], z(e[n]), !1));
        return;
      }
      Xt(n) ? r.push.apply(r, Q([], z(Ku(n, e)), !1)) : r.push(n);
    }
  }), r;
}
function Zu(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (we(n)) {
        e[n] && r.push.apply(r, Q([], z(e[n]), !1));
        return;
      }
      Xt(n) ? r.push(Zu(n, e)) : r.push(n);
    }
  }), r;
}
function Ju(t, e) {
  return t.length !== e.length || t.some(function(r, n) {
    var a = e[n];
    return !r && !a ? !1 : r != a ? Xt(r) && Xt(a) ? Ju(r, a) : !0 : !1;
  });
}
var $v = /* @__PURE__ */ (function(t) {
  bn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.refTargets = [], r.selectorMap = {}, r._differ = new zl(), r._elementTargets = [], r._tmpRefTargets = [], r._tmpSelectorMap = {}, r._onChangeTargets = null, r;
  }
  return e.makeStyled = function() {
    var r = {}, n = this.getTotalAbles();
    n.forEach(function(i) {
      var o = i.css;
      o && o.forEach(function(s) {
        r[s] = !0;
      });
    });
    var a = Fr(r).join(`
`);
    this.defaultStyled = Fl("div", xf(io, Pd + a));
  }, e.getTotalAbles = function() {
    return Q([Gu, _o, $u, ju], z(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var r, n = this.constructor;
    n.defaultStyled || n.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = yd(a, ["ables", "props"]), l = z(this._updateRefs(!0), 2), u = l[0], c = l[1], f = Ku(u, c), d = f.length > 1, p = n.getTotalAbles(), v = Q(Q([], z(p), !1), z(i || []), !1), m = P(P(P({}, s), o || {}), { ables: v, cssStyled: n.defaultStyled, customStyledMap: n.customStyledMap });
    this._elementTargets = f;
    var x = null, y = this.moveable, b = s.persistData;
    if (b != null && b.children && (d = !0), s.individualGroupable)
      return at.createElement(Vv, P({ key: "individual-group", ref: Je(this, "moveable") }, m, { target: null, targets: f }));
    if (d) {
      var E = Zu(u, c);
      if (y && !y.props.groupable && !y.props.individualGroupable) {
        var C = y.props.target;
        C && f.indexOf(C) > -1 && (x = P({}, y.state));
      }
      return at.createElement(qv, P({ key: "group", ref: Je(this, "moveable") }, m, (r = s.groupableProps) !== null && r !== void 0 ? r : {}, { target: null, targets: f, targetGroups: E, firstRenderState: x }));
    } else {
      var D = f[0];
      if (y && (y.props.groupable || y.props.individualGroupable)) {
        var h = y.moveables || [], _ = he(h, function(M) {
          return M.props.target === D;
        });
        _ && (x = P({}, _.state));
      }
      return at.createElement(Gr, P({ key: "single", ref: Je(this, "moveable") }, m, { target: D, firstRenderState: x }));
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
    var n = this.refTargets, a = So(this.props.target || this.props.targets), i = typeof document < "u", o = Ju(n, a), s = this.selectorMap, l = {};
    return this.refTargets.forEach(function u(c) {
      if (we(c)) {
        var f = s[c];
        f ? l[c] = s[c] : i && (o = !0, l[c] = [].slice.call(document.querySelectorAll(c)));
      } else Xt(c) && c.forEach(u);
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
    var u = z(this._updateRefs(), 3), c = u[0], f = u[1], d = u[2];
    this.refTargets = c, this.selectorMap = f, d && this.forceUpdate();
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, bd([
    El(Ad)
  ], e.prototype, "moveable", void 0), e;
})(at.PureComponent), Uv = /* @__PURE__ */ (function(t) {
  bn(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = Xv, e;
})($v), Gi = function(t, e) {
  return Gi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Gi(t, e);
};
function Kv(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Gi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
function Zv(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var wn = Zv(function(t, e) {
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
wn.code;
wn.codes;
wn.aliases;
var Jv = wn.names;
wn.title;
var Zs = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, Js = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function Qu(t, e) {
  var r = (Jv[t] || e || "").toLowerCase();
  for (var n in Zs)
    r = r.replace(n, Zs[n]);
  return r.replace(/\s/g, "");
}
function tc(t, e) {
  e === void 0 && (e = Qu(t.keyCode, t.key));
  var r = Qv(t);
  return r.indexOf(e) === -1 && r.push(e), r.filter(Boolean);
}
function Qv(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function Qs(t) {
  var e = t.slice();
  return e.sort(function(r, n) {
    var a = Js[r] || 5, i = Js[n] || 5;
    return a - i;
  }), e;
}
var tl, th = /* @__PURE__ */ (function(t) {
  Kv(e, t);
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
    }, Ut(n, "blur", a.blur), Ut(n, "keydown", a.keydownEvent), Ut(n, "keyup", a.keyupEvent), a;
  }
  var r = e.prototype;
  return Object.defineProperty(e, "global", {
    /**
     */
    get: function() {
      return tl || (tl = new e());
    },
    enumerable: !1,
    configurable: !0
  }), e.setGlobal = function() {
    return this.global;
  }, r.destroy = function() {
    var n = this.container;
    this.clear(), this.off(), Yt(n, "blur", this.blur), Yt(n, "keydown", this.keydownEvent), Yt(n, "keyup", this.keyupEvent);
  }, r.keydown = function(n, a) {
    return this.addEvent("keydown", n, a);
  }, r.offKeydown = function(n, a) {
    return this.removeEvent("keydown", n, a);
  }, r.offKeyup = function(n, a) {
    return this.removeEvent("keyup", n, a);
  }, r.keyup = function(n, a) {
    return this.addEvent("keyup", n, a);
  }, r.addEvent = function(n, a, i) {
    return Xt(a) ? this.on("".concat(n, ".").concat(Qs(a).join(".")), i) : we(a) ? this.on("".concat(n, ".").concat(a), i) : this.on(n, a), this;
  }, r.removeEvent = function(n, a, i) {
    return Xt(a) ? this.off("".concat(n, ".").concat(Qs(a).join(".")), i) : we(a) ? this.off("".concat(n, ".").concat(a), i) : this.off(n, a), this;
  }, r.triggerEvent = function(n, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = Qu(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
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
    var l = tc(a, i);
    l.length > 1 && this.trigger("".concat(n, ".").concat(l.join(".")), s);
  }, e;
})(yn), Fi = function(t, e) {
  return Fi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Fi(t, e);
};
function ec(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Fi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var $t = function() {
  return $t = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, $t.apply(this, arguments);
};
function eh(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function rh(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function fn(t, e, r) {
  for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function nh(t) {
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
function ah(t) {
  if (typeof Map > "u")
    return t.filter(function(r, n) {
      return t.indexOf(r) === n;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(r) {
    return e.has(r) ? !1 : (e.set(r, !0), !0);
  });
}
function ih(t, e, r) {
  var n = Te(t);
  return n.elementFromPoint && n.elementFromPoint(e, r) || null;
}
function rc(t, e, r) {
  var n = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || Te(r).createElement(n);
  for (var u in i)
    l.setAttribute(u, i[u]);
  var c = l.children;
  if (a.forEach(function(d, p) {
    rc(d, c[p], l);
  }), o && o.split(/\s+/g).forEach(function(d) {
    d && !Zt(l, d) && Zi(l, d);
  }), s) {
    var f = l.style;
    for (var u in s)
      f[u] = s[u];
  }
  return !e && r && r.appendChild(l), l;
}
function oh(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, u = eh(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: u,
    children: r
  };
}
function ai(t, e, r) {
  t !== e && r(t, e);
}
function el(t, e, r) {
  var n;
  r === void 0 && (r = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, u = l.startX, c = l.startY;
  if (e > 0) {
    var f = Math.sqrt((i * i + s * s) / (1 + e * e)), d = e * f;
    i = (i >= 0 ? 1 : -1) * d, s = (s >= 0 ? 1 : -1) * f;
  }
  var p = Math.abs(i), v = Math.abs(s), m = i < 0 ? u - r.left : r.right - u, x = s < 0 ? c - r.top : r.bottom - c;
  n = Ki([p, v], [0, 0], [m, x], !!e), p = n[0], v = n[1], i = (i >= 0 ? 1 : -1) * p, s = (s >= 0 ? 1 : -1) * v;
  var y = Math.min(0, i), b = Math.min(0, s), E = u + y, C = c + b;
  return {
    left: E,
    top: C,
    right: E + p,
    bottom: C + v,
    width: p,
    height: v
  };
}
function ta(t) {
  var e = t.getBoundingClientRect(), r = e.left, n = e.top, a = e.width, i = e.height;
  return {
    pos1: [r, n],
    pos2: [r + a, n],
    pos3: [r, n + i],
    pos4: [r + a, n + i]
  };
}
function rl(t, e, r) {
  var n = Dr(t, e), a = n.list, i = n.prevList, o = n.added, s = n.removed, l = n.maintained;
  return fn(fn(fn([], o.map(function(u) {
    return a[u];
  }), !0), s.map(function(u) {
    return i[u];
  }), !0), r ? l.map(function(u) {
    var c = u[1];
    return a[c];
  }) : []);
}
function nl(t) {
  for (var e = 0, r = t.length, n = 1; n < r; ++n)
    e = Math.max(Ne(t[n], t[n - 1]), e);
  return e;
}
var nc = Gl(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), Li = "selecto-selection ".concat(nc.className), Mo = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], sh = fn([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], Mo), ac = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], lh = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], uh = /* @__PURE__ */ (function(t) {
  ec(e, t);
  function e(n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new Al(), a._onDragStart = function(s, l) {
      var u = s.data, c = s.clientX, f = s.clientY, d = s.inputEvent, p = a.options, v = p.selectFromInside, m = p.selectByClick, x = p.rootContainer, y = p.boundContainer, b = p.preventDragFromInside, E = b === void 0 ? !0 : b, C = p.clickBySelectEnd, D = p.dragCondition;
      if (D && !D(s)) {
        s.stop();
        return;
      }
      u.data = {};
      var h = Ce(a.container);
      u.innerWidth = h.innerWidth, u.innerHeight = h.innerHeight, a.findSelectableTargets(u), u.startSelectedTargets = a.selectedTargets, u.scaleMatrix = eo(), u.containerX = 0, u.containerY = 0;
      var _ = a.container, M = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (x) {
        var T = a.container.getBoundingClientRect();
        u.containerX = T.left, u.containerY = T.top, u.scaleMatrix = Xf(a.container, x);
      }
      if (y) {
        var k = ve(y) && "element" in y ? $t({
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
          we(A) ? O = Te(_).querySelector(A) : A === !0 ? O = a.container : O = A;
          var I = O.getBoundingClientRect();
          k.left && (M.left = I.left), k.top && (M.top = I.top), k.right && (M.right = I.right), k.bottom && (M.bottom = I.bottom);
        }
      }
      u.boundArea = M;
      var N = {
        left: c,
        top: f,
        right: c,
        bottom: f,
        width: 0,
        height: 0
      }, B = [], W = m && !C, H = !1;
      if (!v || W) {
        var L = a._findElement(
          l || d.target,
          // elementFromPoint(clientX, clientY),
          u.selectableTargets
        );
        H = !!L, W && (B = L ? [L] : []);
      }
      var X = !v && H;
      if (X && !m)
        return s.stop(), !1;
      var V = d.type, G = V === "mousedown" || V === "touchstart", tt = !s.isClick && G ? a.emit("dragStart", $t($t({}, s), {
        data: u.data
      })) : !0;
      if (!tt)
        return s.stop(), !1;
      if (a.continueSelect ? (B = rl(a.selectedTargets, B, a.continueSelectWithoutDeselect), u.startPassedTargets = a.selectedTargets) : u.startPassedTargets = [], a._select(B, N, s, !0, X && m && !C && E), u.startX = c, u.startY = f, u.selectFlag = !1, u.preventDragFromInside = !1, d.target) {
        var et = aa(u.scaleMatrix, [c - u.containerX, f - u.containerY]);
        a.target.style.cssText += "position: ".concat(x ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(et[0], "px, ").concat(et[1], "px)");
      }
      if (X && m && !C)
        d.preventDefault(), E && (a._selectEnd(u.startSelectedTargets, u.startPassedTargets, N, s, !0), u.preventDragFromInside = !0);
      else {
        u.selectFlag = !0;
        var Z = a.options, rt = Z.scrollOptions, q = Z.innerScrollOptions, nt = !1;
        if (q) {
          for (var ot = s.inputEvent, vt = ot.target, xt = null, U = vt; U && U !== Te(_).body; ) {
            var ut = getComputedStyle(U).overflow !== "visible";
            if (ut) {
              xt = U;
              break;
            }
            U = U.parentElement;
          }
          xt && (u.innerScrollOptions = $t({
            container: xt,
            checkScrollEvent: !0
          }, q === !0 ? {} : q), a.dragScroll.dragStart(s, u.innerScrollOptions), nt = !0);
        }
        !nt && rt && rt.container && a.dragScroll.dragStart(s, rt), X && m && C && (u.selectFlag = !1, s.preventDrag());
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
      var l = s.data, u = s.inputEvent, c = el(s, a.options.ratio), f = l.selectFlag, d = a.container;
      if (u && a.emit("dragEnd", $t($t({
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
        var p = a._findElement((u == null ? void 0 : u.target) || ih(d, s.clientX, s.clientY), l.selectableTargets);
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
      var l = Te(a.container);
      if (a.gesto.isFlag()) {
        var u = a.dragContainer;
        u === Ce(a.container) && (u = l.documentElement);
        var c = vn(u) ? [u] : [].slice.call(u), f = s.target;
        c.some(function(d) {
          if (d === f || d.contains(f))
            return s.preventDefault(), !0;
        });
      }
    }, a.target = n.portalContainer;
    var i = n.container;
    a.options = $t({
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
      getElementRect: ta,
      cspNonce: "",
      ratio: 0
    }, n);
    var o = a.options.portalContainer;
    return o && (i = o.parentElement), a.container = i || document.body, a.initElement(), a.initDragScroll(), a.setKeyController(), a;
  }
  var r = e.prototype;
  return r.setSelectedTargets = function(n) {
    var a = this.selectedTargets, i = Dr(a, n), o = i.added, s = i.removed, l = i.prevList, u = i.list;
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
    return $t($t({}, d), {
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
    this.off(), this.keycon && this.keycon.destroy(), this.gesto.unset(), this.injectResult.destroy(), this.dragScroll.dragEnd(), Yt(document, "selectstart", this._onDocumentSelectStart), this.options.portalContainer || (n = this.target.parentElement) === null || n === void 0 || n.removeChild(this.target), this.keycon = null, this.gesto = null, this.injectResult = null, this.target = null, this.container = null, this.options = null;
  }, r.getElementPoints = function(n) {
    var a = this.getElementRect || ta, i = a(n), o = [i.pos1, i.pos2, i.pos4, i.pos3];
    if (a !== ta) {
      var s = n.getBoundingClientRect();
      return bi(o, s);
    }
    return o;
  }, r.getSelectableElements = function() {
    var n = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (Ea(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (vn(i))
        a.push(i);
      else if (ve(i))
        a.push(i.value || i.current);
      else {
        var s = [].slice.call(Te(n).querySelectorAll(i));
        a.push.apply(a, s);
      }
    }), a;
  }, r.checkScroll = function() {
    if (this.gesto.isFlag()) {
      var n = this.scrollOptions, a = this.gesto.getEventData().innerScrollOptions, i = a || (n == null ? void 0 : n.container);
      i && this.dragScroll.checkScroll($t({
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
    var s = this.options, l = s.checkOverflow || s.innerScrollOptions, u = Te(this.container);
    if (l) {
      var c = /* @__PURE__ */ new Map();
      n.selectableInnerScrollParentMap = c, n.selectableInnerScrollPathsList = i.map(function(f, d) {
        for (var p = f.parentElement, v = [], m = [], x = function() {
          var y = c.get(p);
          if (!y) {
            var b = getComputedStyle(p).overflow !== "visible";
            if (b) {
              var E = ta(p);
              y = {
                parentElement: p,
                indexes: [],
                points: [E.pos1, E.pos2, E.pos4, E.pos3],
                paths: fn([], m)
              }, v.push(p), v.forEach(function(C) {
                c.set(C, y);
              }), v = [];
            }
          }
          y ? (p = y.parentElement, c.get(p).indexes.push(d), m.push(p)) : v.push(p), p = p.parentElement;
        }; p && p !== u.body; )
          x();
        return m;
      });
    }
    return s.checkOverflow || (n.selectableInners = i.map(function() {
      return !0;
    })), this._refreshGroups(n), i;
  }, r.clickTarget = function(n, a) {
    var i = nh(n), o = i.clientX, s = i.clientY, l = {
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
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new th(a || Ce(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, r.setClassName = function(n) {
    this.options.className = n, this.target.setAttribute("class", "".concat(Li, " ").concat(n || ""));
  }, r.setKeyEvent = function() {
    var n = this.options, a = n.toggleContinueSelect, i = n.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, r.setKeyContainer = function(n) {
    var a = this, i = this.options;
    ai(i.keyContainer, n, function() {
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
    ai(i.toggleContinueSelect, n, function() {
      i.toggleContinueSelect = n, a.setKeyEvent();
    });
  }, r.setToggleContinueSelectWithoutDeselect = function(n) {
    var a = this, i = this.options;
    ai(i.toggleContinueSelectWithoutDeselect, n, function() {
      i.toggleContinueSelectWithoutDeselect = n, a.setKeyEvent();
    });
  }, r.setPreventDefault = function(n) {
    this.gesto.options.preventDefault = n;
  }, r.setCheckInput = function(n) {
    this.gesto.options.checkInput = n;
  }, r.initElement = function() {
    var n = this.options, a = n.dragContainer, i = n.checkInput, o = n.preventDefault, s = n.preventClickEventOnDragStart, l = n.preventClickEventOnDrag, u = n.preventClickEventByCondition, c = n.preventRightClick, f = c === void 0 ? !0 : c, d = n.className, p = this.container;
    this.target = rc(oh("div", {
      className: "".concat(Li, " ").concat(d || "")
    }), this.target, p);
    var v = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(Te(p).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new jl(this.dragContainer, {
      checkWindowBlur: !0,
      container: Ce(p),
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
    }), Ut(document, "selectstart", this._onDocumentSelectStart), this.injectResult = nc.inject(v, {
      nonce: this.options.cspNonce
    });
  }, r.hitTest = function(n, a, i, o) {
    var s = this.options, l = s.hitRate, u = s.selectByClick, c = n.left, f = n.top, d = n.right, p = n.bottom, v = a.innerGroups, m = a.innerWidth, x = a.innerHeight, y = o == null ? void 0 : o.clientX, b = o == null ? void 0 : o.clientY, E = a.ignoreClick, C = [[c, f], [d, f], [d, p], [c, p]], D = function(L, X) {
      var V = dr(typeof l == "function" ? "".concat(l(X)) : "".concat(l)), G = E ? !1 : ca([y, b], L);
      if (!i && u && G)
        return !0;
      var tt = Ci(C, L);
      if (!tt.length)
        return !1;
      var et = an(tt), Z = 0;
      if (et === 0 && an(L) === 0 ? (Z = nl(L), et = nl(tt)) : Z = an(L), V.unit === "px")
        return et >= V.value;
      var rt = la(Math.round(et / Z * 100), 0, 100);
      return rt >= Math.min(100, V.value);
    }, h = a.selectableTargets, _ = a.selectablePoints, M = a.selectableInners;
    if (!v)
      return h.filter(function(L, X) {
        return M[X] ? D(_[X], h[X]) : !1;
      });
    for (var T = [], k = Math.floor(c / m), A = Math.floor(d / m), O = Math.floor(f / x), I = Math.floor(p / x), N = k; N <= A; ++N) {
      var B = v[N];
      if (B)
        for (var W = O; W <= I; ++W) {
          var H = B[W];
          H && H.forEach(function(L) {
            var X = _[L], V = M[L], G = h[L];
            V && D(X, G) && T.push(G);
          });
        }
    }
    return ah(T);
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
          var v = u.selectableInnerScrollParentMap, m = v.get(d);
          m && (m.paths.forEach(function(x) {
            var y = v.get(x);
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
    var l = i.inputEvent, u = i.data, c = this.setSelectedTargets(n), f = Dr(u.startSelectedTargets, n), d = f.added, p = f.removed, v = f.prevList, m = f.list, x = {
      startSelected: v,
      startAdded: d.map(function(y) {
        return m[y];
      }),
      startRemoved: p.map(function(y) {
        return v[y];
      })
    };
    o && this.emit("selectStart", $t($t($t({}, c), x), {
      rect: a,
      inputEvent: l,
      data: u.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    })), (c.added.length || c.removed.length) && this.emit("select", $t($t($t({}, c), x), {
      rect: a,
      inputEvent: l,
      data: u.data,
      isTrusted: i.isTrusted,
      isDragStartEnd: s
    }));
  }, r._selectEnd = function(n, a, i, o, s) {
    s === void 0 && (s = !1);
    var l = o.inputEvent, u = o.isDouble, c = o.data, f = l && l.type, d = f === "mousedown" || f === "touchstart", p = Dr(n, this.selectedTargets), v = p.added, m = p.removed, x = p.prevList, y = p.list, b = Dr(a, this.selectedTargets), E = b.added, C = b.removed, D = b.prevList, h = b.list;
    this.emit("selectEnd", {
      startSelected: n,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: v.map(function(_) {
        return y[_];
      }),
      removed: m.map(function(_) {
        return x[_];
      }),
      afterAdded: E.map(function(_) {
        return h[_];
      }),
      afterRemoved: C.map(function(_) {
        return D[_];
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
    a === void 0 && (a = el(n, this.options.ratio));
    var i = n.data, o = a.top, s = a.left, l = a.width, u = a.height, c = i.selectFlag, f = i.containerX, d = i.containerY, p = i.scaleMatrix, v = aa(p, [s - f, o - d]), m = aa(p, [l, u]), x = [];
    if (c) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(v[0], "px, ").concat(v[1], "px);") + "width:".concat(m[0], "px;height:").concat(m[1], "px;");
      var y = this.hitTest(a, i, !0, n);
      x = rl(i.startPassedTargets, y, this.continueSelect && this.continueSelectWithoutDeselect);
    }
    var b = this.emit("drag", $t($t({}, n), {
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
    var o = tc(n.inputEvent, n.key), s = [].concat(a), l = Xt(s[0]) ? s : [s];
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
      n.selectableInners = c.map(function(p, v) {
        var m = !1;
        return p.every(function(x) {
          if (m)
            return !0;
          if (x === l)
            return m = !0, !0;
          var y = u.get(x);
          if (y) {
            var b = s[v], E = y.points, C = Ci(b, E);
            if (!C.length)
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
      f.forEach(function(p, v) {
        var m = 1 / 0, x = -1 / 0, y = 1 / 0, b = -1 / 0;
        p.forEach(function(D) {
          var h = Math.floor(D[0] / i), _ = Math.floor(D[1] / o);
          m = Math.min(h, m), x = Math.max(h, x), y = Math.min(_, y), b = Math.max(_, b);
        });
        for (var E = m; E <= x; ++E)
          for (var C = y; C <= b; ++C)
            d[E] = d[E] || {}, d[E][C] = d[E][C] || [], d[E][C].push(v);
      }), n.innerGroups = d;
    }
  }, e = rh([yf(Mo, function(n, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = vi("get ".concat(a));
    n[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = vi("set ".concat(a));
    n[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(n, a, i);
  })], e), e;
})(yn), ch = /* @__PURE__ */ (function(t) {
  ec(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})(uh), Wi = function(t, e) {
  return Wi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Wi(t, e);
};
function fh(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Wi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var ba = function() {
  return ba = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, ba.apply(this, arguments);
};
function dh(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
var al = ac.map(function(t) {
  return vi("on ".concat(t));
}), ph = /* @__PURE__ */ (function(t) {
  fh(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var r = e.prototype;
  return r.render = function() {
    return at.createElement("div", {
      className: Li,
      ref: Je(this, "selectionElement")
    });
  }, r.componentDidMount = function() {
    var n = this, a = this.props, i = {};
    sh.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new ch(ba(ba({}, i), {
      portalContainer: this.selectionElement
    })), ac.forEach(function(o, s) {
      n.selecto.on(o, function(l) {
        var u = n.props, c = u[al[s]] && u[al[s]](l);
        c === !1 && l.stop();
      });
    });
  }, r.componentDidUpdate = function(n) {
    var a = this.props, i = this.selecto;
    Mo.forEach(function(o) {
      n[o] !== a[o] && (i[o] = a[o]);
    });
  }, r.componentWillUnmount = function() {
    this.selecto.destroy();
  }, dh([El(lh)], e.prototype, "selecto", void 0), e;
})(at.PureComponent);
const Ae = "http://www.w3.org/2000/svg";
function ea(t, e) {
  const r = URL.createObjectURL(t), n = document.createElement("a");
  n.href = r, n.download = e, document.body.appendChild(n), n.click(), n.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function Ir(t, e, r, n = { x: 0, y: 0 }) {
  const a = t.getBoundingClientRect();
  return {
    left: (a.left - e.left) / r - n.x,
    top: (a.top - e.top) / r - n.y,
    width: a.width / r,
    height: a.height / r
  };
}
function il(t, e, r, n, a, i) {
  e.forEach((o) => {
    if (!o.text) return;
    const s = document.createElementNS(Ae, "text");
    s.setAttribute("x", String(r + o.left)), s.setAttribute("y", String(n + o.top + a * 0.82)), s.setAttribute("font-size", String(a)), s.setAttribute("font-family", i.fontFamily || Nc), s.setAttribute("font-weight", i.fontWeight || "400"), s.setAttribute("fill", i.color || "#1e293b"), s.setAttribute("xml:space", "preserve"), s.textContent = o.text, t.appendChild(s);
  });
}
function vh(t, e) {
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
function ol(t, e, r, n, a, i, o) {
  const s = Ir(e, r, n, i), l = document.createElementNS(Ae, "g");
  l.setAttribute("transform", `translate(${Math.round(s.left)},${Math.round(s.top)})`);
  const u = e.querySelector("canvas");
  if (u) {
    const f = document.createElementNS(Ae, "image"), d = Ir(u, r, n, i);
    f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("width", String(Math.round(d.width || s.width))), f.setAttribute("height", String(Math.round(d.height || s.height))), f.setAttribute("href", Bc(e, a, Math.round(d.width || s.width)) ?? u.toDataURL("image/png")), l.appendChild(f);
  }
  const c = e.querySelector("svg");
  if (c) {
    const f = c.cloneNode(!0), d = c.clientWidth || Number(c.getAttribute("width")) || s.width, p = d > 0 ? s.width / d : 1;
    if (Math.abs(p - 1) > 1e-3) {
      const v = document.createElementNS(Ae, "g");
      v.setAttribute("transform", `scale(${p})`), v.appendChild(f), l.appendChild(v);
    } else l.appendChild(f);
  }
  jc(l, o), t.appendChild(l);
}
function hh(t, e, r) {
  var f, d;
  const { width: n, height: a } = fi(e.page), i = oa(e.page)[r.pageIndex ?? 0] ?? { x: 0, y: 0 }, o = document.createElementNS(Ae, "svg");
  o.setAttribute("xmlns", Ae), o.setAttribute("width", String(n)), o.setAttribute("height", String(a)), o.setAttribute("viewBox", `0 0 ${n} ${a}`);
  const s = document.createElementNS(Ae, "rect");
  s.setAttribute("width", "100%"), s.setAttribute("height", "100%"), s.setAttribute("fill", "#ffffff"), o.appendChild(s);
  const l = t.getBoundingClientRect(), u = [...t.querySelectorAll(".gl-layout-item")].sort((p, v) => (Number(p.style.zIndex) || 0) - (Number(v.style.zIndex) || 0));
  let c = 0;
  for (const p of u) {
    const v = Ir(p, l, r.zoom, i);
    if (v.left >= n || v.top >= a || v.left + v.width <= 0 || v.top + v.height <= 0) continue;
    c += 1;
    const m = p.dataset.title ?? ((f = p.querySelector(".gl-layout-item-head span")) == null ? void 0 : f.textContent) ?? "";
    if (p.classList.contains("has-frame")) {
      const C = document.createElementNS(Ae, "rect");
      C.setAttribute("x", String(Math.round(v.left) + 0.5)), C.setAttribute("y", String(Math.round(v.top) + 0.5)), C.setAttribute("width", String(Math.round(v.width) - 1)), C.setAttribute("height", String(Math.round(v.height) - 1)), C.setAttribute("fill", "none"), C.setAttribute("stroke", "#94a3b8"), C.setAttribute("id", Zr("frame", c, m)), o.appendChild(C);
    }
    const x = p.querySelector(".gl-layout-text-surface");
    if (x) {
      const C = x instanceof HTMLTextAreaElement ? x.value : x.textContent ?? "", D = getComputedStyle(x), h = Ir(x, l, r.zoom, i), _ = Number(p.dataset.zoom) || 1, M = (parseFloat(D.fontSize) || 14) * _, T = (parseFloat(D.paddingLeft) || 0) * _, k = (parseFloat(D.paddingTop) || 0) * _, A = ((d = vh(x, C)) == null ? void 0 : d.map((I) => ({ text: I.text, left: I.left * _, top: I.top * _ }))) ?? C.split(`
`).map((I, N) => ({ text: I, left: 0, top: N * M * 1.3 })), O = document.createElementNS(Ae, "g");
      O.setAttribute("id", Zr("text", c, C.trim().split(/\s+/).slice(0, 4).join(" "))), il(O, A, h.left + T, h.top + k, M, D), o.appendChild(O);
      continue;
    }
    const y = p.querySelector(".gl-layout-plot-host");
    if (!y) continue;
    if (y.__miniPlotCfg) {
      ol(o, y, l, r.zoom, r.dpi, i, Zr("plot", c, m));
      continue;
    }
    const b = y.querySelector(".gl-prop-chart");
    if (b) {
      const C = zc(b);
      if (C) {
        const D = Ir(b, l, r.zoom, i), h = C.width > 0 ? D.width / C.width : 1, _ = document.createElementNS(Ae, "g");
        _.setAttribute("id", Zr("chart", c, m)), _.setAttribute("transform", `translate(${D.left},${D.top}) scale(${h})`), _.appendChild(C.root), o.appendChild(_);
      }
      continue;
    }
    y.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((C) => {
      const D = (C.textContent ?? "").trim();
      if (!D) return;
      const h = getComputedStyle(C), _ = Ir(C, l, r.zoom, i), M = C.offsetWidth > 0 ? _.width / C.offsetWidth : 1;
      il(o, [{ text: D, left: 0, top: 0 }], _.left, _.top, (parseFloat(h.fontSize) || 12) * M, h);
    });
    const E = Zr(y.querySelector(".gl-figure-grid") ? "figure" : "strategy", c, m);
    y.querySelectorAll(".mini-plot-cell").forEach((C, D) => ol(o, C, l, r.zoom, r.dpi, i, `${E}-panel-${D + 1}`));
  }
  return Ac(o, { widthPx: n, heightPx: a, ...Yi(e.page) }), { root: o, width: n, height: a };
}
function sl(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
function gh(t, e, r) {
  return oa(e.page).map((n, a) => hh(t, e, { dpi: e.page.dpi, zoom: r.zoom, pageIndex: a }));
}
async function mh(t, e, r) {
  const n = e.page.dpi, a = Ic(e.name) || "layout";
  if (!t.length) return;
  if (r === "svg") {
    if (t.length === 1) {
      ea(new Blob([sl(t[0].root)], { type: "image/svg+xml" }), `${a}.svg`);
      return;
    }
    const c = {};
    t.forEach((f, d) => {
      c[`${a}-p${d + 1}.svg`] = Pc(sl(f.root));
    }), ea(new Blob([es(c)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  if (r === "png") {
    if (t.length === 1) {
      ea(await rs(await Ya(t[0], n), n), `${a}.png`);
      return;
    }
    const c = {};
    for (const [f, d] of t.entries()) {
      const p = await Ya(d, n);
      c[`${a}-p${f + 1}.png`] = new Uint8Array(await (await rs(p, n)).arrayBuffer()), await ns();
    }
    ea(new Blob([es(c)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const { widthMm: i, heightMm: o } = Yi(e.page), s = i >= o ? "landscape" : "portrait", { jsPDF: l } = await import("./jspdf.es.min-BCVXgNHT.js").then((c) => c.j), u = new l({ orientation: s, unit: "mm", format: [i, o], compress: !0 });
  for (const [c, f] of t.entries()) {
    if (c > 0 && u.addPage([i, o], s), !await Oc(u, f.root, { width: i, height: o })) {
      const d = await Ya(f, n);
      u.addImage(d, "PNG", 0, 0, i, o, void 0, "FAST");
    }
    await ns();
  }
  u.save(`${a}.pdf`);
}
const xh = "", ic = "{none}", ra = [
  { id: "auto", label: "What differs across the page", template: xh },
  { id: "population", label: "Population", template: "{population}" },
  { id: "file", label: "File", template: "{file}" },
  { id: "sample", label: "Sample id", template: "{sample}" },
  { id: "population-file", label: "Population · file", template: "{population} · {file}" },
  { id: "population-plot", label: "Population · plot", template: "{population} · {plot}" },
  { id: "none", label: "No title", template: ic }
], ii = "{population}, {file}, {sample}, {x}, {y}, {plot}, {count}, {meta:column}, {popmeta:field}";
function yh(t, e) {
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
const oi = [
  { id: "dot", label: "·", value: " · " },
  { id: "space", label: "space", value: " " },
  { id: "comma", label: ",", value: ", " },
  { id: "slash", label: "/", value: " / " },
  { id: "dash", label: "–", value: " – " }
];
function ll(t, e) {
  return t.join(e);
}
function bh(t) {
  const e = t.match(/\{[^}]+\}/g) ?? [];
  if (!e.length) return null;
  const r = t.split(/\{[^}]+\}/);
  if (r[0] !== "" || r[r.length - 1] !== "") return null;
  const n = r.slice(1, -1), a = n[0] ?? " · ";
  return n.some((i) => i !== a) ? null : { tokens: e, separator: a };
}
function Sh(t, e, r, n, a) {
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
function Sa(t, e) {
  return t.trim() === ic ? "" : t.replace(/\{(population|file|sample|x|y|plot|count|meta:[^}]+|popmeta:[^}]+)\}/g, (n, a) => {
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
function Ch(t) {
  const e = new Set(t.map((i) => i.sampleId)), r = new Set(t.map((i) => i.populationId)), n = t.some((i) => i.label), a = e.size <= 1 && r.size > 1 ? "{population}" : r.size <= 1 && e.size > 1 ? "{file}" : "{population} · {file}";
  return n ? `${a} · {plot}` : a;
}
function oc(t) {
  return oe(t.recipe) && t.recipe.iterated === !0;
}
function ul(t, e, r, n) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(r) : i === "N" ? String(n) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function si(t, e, r, n, a, i) {
  const o = oc(t), s = { ...t.recipe };
  let l;
  return s.kind === "text" ? s.text = ul(s.text, s.readsFrom ? null : e, r, n) : (o && e && e.populationId ? "populationId" in s && (s.populationId = e.populationId) : o && e && "sampleId" in s && s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id), s.title && (s.title = ul(s.title, e, r, n))), {
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
function Eh(t, e) {
  if (e)
    for (const r of t) {
      if (r.recipe.kind !== "text" || !r.recipe.readsFrom) continue;
      const n = r.recipe.readsFrom, a = t.find((o) => o.templateId === n && o.offset.x === r.offset.x && o.offset.y === r.offset.y);
      if (!a || !oe(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId);
      i && (r.recipe = { ...r.recipe, text: Sa(r.recipe.text, i) });
    }
}
function wh(t, e, r) {
  const n = Dh(t, e);
  for (const a of n) Eh(a.items, r);
  return n;
}
function Dh(t, e) {
  const r = t.iteration ?? pl;
  if (r.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((p) => si(p, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const n = e.length;
  if (r.arrangement.kind === "page-per-unit")
    return e.map((p, v) => ({
      index: v,
      units: [p],
      items: t.items.map((m) => si(m, p, v + 1, n, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = r.arrangement, l = Gc(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const u = a * i, c = l.width + s, f = l.height + s, d = [];
  for (let p = 0; p < n; p += u) {
    const v = e.slice(p, p + u), m = [];
    v.forEach((x, y) => {
      const b = o === "row-major" ? Math.floor(y / i) : y % a, C = { x: (o === "row-major" ? y % i : Math.floor(y / a)) * c, y: b * f };
      for (const D of t.items) m.push(si(D, x, p + y + 1, n, C, y));
    }), d.push({ index: d.length, units: v, items: m });
  }
  return d;
}
function _h(t, e, r, n, a) {
  const i = (s) => {
    var l;
    return {
      id: s.id,
      name: s.name,
      fileName: s.fileName ?? s.name,
      groupName: (l = n.find((u) => u.id === a[s.id])) == null ? void 0 : l.name,
      metadata: s.metadata
    };
  }, o = t.source;
  return e.filter((s) => {
    var l;
    return o.kind === "all" ? !0 : o.kind === "checked" ? r.includes(s.id) : o.kind === "group" ? a[s.id] === o.groupId : (((l = s.metadata) == null ? void 0 : l[o.column]) ?? "") === o.value;
  }).map(i);
}
function Mh(t, e, r) {
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
  return na(e.populations, n).filter(({ popId: s }) => s !== n && i(s)).map(({ popId: s }) => {
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
function kh(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const Th = (t) => [...t].sort((e, r) => e - r);
function li(t, e) {
  const r = Th(t);
  if (!r.length) return NaN;
  const n = (r.length - 1) * e, a = Math.floor(n), i = Math.ceil(n);
  return r[a] + (r[i] - r[a]) * (n - a);
}
function Rh(t, e) {
  const r = e.map((o) => o.value), n = r.length, a = n ? r.reduce((o, s) => o + s, 0) / n : NaN, i = n > 1 ? Math.sqrt(r.reduce((o, s) => o + (s - a) ** 2, 0) / (n - 1)) : 0;
  return {
    label: t,
    points: e,
    n,
    mean: a,
    sd: i,
    median: li(r, 0.5),
    q1: li(r, 0.25),
    q3: li(r, 0.75),
    min: n ? Math.min(...r) : NaN,
    max: n ? Math.max(...r) : NaN
  };
}
function Ih(t) {
  const e = [], r = /* @__PURE__ */ new Map();
  for (const n of t)
    r.has(n.group) || (r.set(n.group, []), e.push(n.group)), r.get(n.group).push(n);
  return e.map((n) => Rh(n, r.get(n)));
}
function sc(t) {
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
function Ph(t) {
  const e = Math.abs(t) / Math.SQRT2, r = 1 / (1 + 0.3275911 * e), i = r * (0.254829592 + r * (-0.284496736 + r * (1.421413741 + r * (-1.453152027 + r * 1.061405429)))) * Math.exp(-e * e) / 2;
  return t >= 0 ? i : 1 - i;
}
function Oh(t, e) {
  if (e <= 0) return 0;
  const r = zh(t);
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
function zh(t) {
  const e = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18];
  let r = t, n = t, a = r + 5.5;
  a -= (r + 0.5) * Math.log(a);
  let i = 1.000000000190015;
  for (const o of e) i += o / ++n;
  return -a + Math.log(2.5066282746310007 * i / r);
}
function Ah(t, e) {
  return t > 0 ? Math.max(0, Math.min(1, 1 - Oh(e / 2, t / 2))) : 1;
}
function Nh(t, e) {
  if (t.length < 2 || e.length < 2) return null;
  const r = t.length, n = e.length, { rank: a, ties: i } = sc([...t, ...e]), s = a.slice(0, r).reduce((p, v) => p + v, 0) - r * (r + 1) / 2, l = r + n, u = r * n / 2, c = Math.sqrt(r * n / 12 * (l + 1 - i / (l * (l - 1))));
  if (!(c > 0)) return { name: "Wilcoxon rank-sum", statistic: s, p: 1, label: "Wilcoxon p = 1" };
  const f = (Math.abs(s - u) - 0.5) / c, d = Math.min(1, 2 * Ph(Math.max(0, f)));
  return { name: "Wilcoxon rank-sum", statistic: s, p: d, label: `Wilcoxon ${lc(d)}` };
}
function Bh(t) {
  const e = t.filter((c) => c.length > 0);
  if (e.length < 2 || e.some((c) => c.length < 2)) return null;
  const r = e.flat(), n = r.length, { rank: a, ties: i } = sc(r);
  let o = 0, s = 0;
  for (const c of e) {
    const f = a.slice(o, o + c.length).reduce((d, p) => d + p, 0);
    s += f * f / c.length, o += c.length;
  }
  s = 12 / (n * (n + 1)) * s - 3 * (n + 1);
  const l = 1 - i / (n ** 3 - n);
  l > 0 && (s /= l);
  const u = Ah(s, e.length - 1);
  return { name: "Kruskal–Wallis", statistic: s, p: u, label: `Kruskal–Wallis ${lc(u)}` };
}
function jh(t) {
  const e = t.map((r) => r.points.map((n) => n.value));
  return e.length === 2 ? Nh(e[0], e[1]) : e.length > 2 ? Bh(e) : null;
}
function lc(t) {
  return Number.isFinite(t) ? t < 1e-3 ? "p < 0.001" : `p = ${t < 0.01 ? t.toFixed(3) : t.toFixed(2)}` : "p = ?";
}
function Gh(t, e = 5) {
  const r = t.filter((d) => Number.isFinite(d)), n = Math.min(0, ...r), a = Math.max(...r, n + 1e-9), o = (a - n || 1) / e, s = 10 ** Math.floor(Math.log10(o)), l = [1, 2, 2.5, 5, 10].map((d) => d * s).find((d) => d >= o) ?? s * 10, u = Math.floor(n / l) * l, c = Math.ceil((a + l * 0.15) / l) * l, f = [];
  for (let d = u; d <= c + l / 2; d += l) f.push(Number(d.toFixed(10)));
  return { min: u, max: c, ticks: f };
}
const uc = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function Fh(t, e, r, n, a) {
  var d, p;
  const i = e.find((v) => v.id === t.sampleId) ?? null, o = ((d = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : d.name) ?? "the population", s = t.files === "all" ? e : e.filter((v) => n.includes(v.id)), l = [], u = [];
  for (const v of s) {
    let m = t.populationId;
    if (i && i.tree.id !== v.tree.id) {
      const b = Qr(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        v.tree,
        wr(a)
      );
      if (!b.id) {
        u.push(v.name);
        continue;
      }
      m = b.id;
    }
    let x;
    if (t.statistic === "median") {
      const b = t.channel ? v.sample.index(t.channel) : void 0, E = v.derived.masks[m];
      if (b === void 0 || !E) x = null;
      else {
        const C = v.sample.displayColumn(b), D = [];
        for (let h = 0; h < C.length; h++) E[h] && Number.isFinite(C[h]) && D.push(C[h]);
        x = D.length ? Fc(D) : null;
      }
    } else
      x = v.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][m];
    if (typeof x != "number" || !Number.isFinite(x)) continue;
    const y = t.groupBy ? ((p = r[v.id]) == null ? void 0 : p[t.groupBy]) ?? "" : v.name;
    l.push({ sampleId: v.id, name: v.name, group: y, value: x });
  }
  const c = Ih(l), f = t.statistic === "median" ? `Median ${t.channel ?? ""}`.trim() : uc[t.statistic];
  return { points: l, groups: c, test: t.test && t.groupBy ? jh(c) : null, population: o, axis: f, missing: u };
}
const ui = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), Lh = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function Wh({
  data: t,
  recipe: e,
  style: r,
  width: n,
  height: a,
  title: i
}) {
  const o = r.fontTick, s = r.fontAxis, l = r.fontTitle, u = t.groups, c = at.useMemo(() => Gh(t.points.map((k) => k.value)), [t.points]), f = 8 + s + 6 + Math.max(...c.ticks.map((k) => ui(k).length), 1) * o * 0.6 + 8, d = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), p = Math.max(0, ...u.map((k) => k.label.length)), v = u.length > 0 && p * o * 0.6 > (n - f - 8) / u.length, m = 8 + (v ? p * o * 0.45 + 10 : o + 8), x = Math.max(20, n - f - 8), y = Math.max(20, a - d - m), b = (k) => d + y - (k - c.min) / (c.max - c.min || 1) * y, E = u.length ? x / u.length : x, C = (k) => f + (k + 0.5) * E, D = Math.min(48, E * 0.6), h = r.pubStyle ? "#000000" : "#334155", _ = r.pubStyle ? "#d4d4d8" : "#93c5fd", M = r.pubStyle ? "#000000" : "#1d4ed8", T = b(Math.max(c.min, 0));
  return /* @__PURE__ */ w.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: n, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ w.jsxs("svg", { width: n, height: a, viewBox: `0 0 ${n} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ w.jsx("rect", { width: n, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ w.jsx("text", { x: n / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: h, children: i }),
    !t.points.length && /* @__PURE__ */ w.jsx("text", { x: n / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ w.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: h, children: [
      /* @__PURE__ */ w.jsx("line", { x1: f, x2: f, y1: d, y2: d + y, stroke: h }),
      c.ticks.map((k) => /* @__PURE__ */ w.jsxs("g", { children: [
        /* @__PURE__ */ w.jsx("line", { x1: f - 4, x2: f, y1: b(k), y2: b(k), stroke: h }),
        /* @__PURE__ */ w.jsx("text", { x: f - 6, y: b(k), textAnchor: "end", dominantBaseline: "central", children: ui(k) })
      ] }, k)),
      /* @__PURE__ */ w.jsx("text", { transform: `translate(${8 + s} ${d + y / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ w.jsx("line", { x1: f, x2: f + x, y1: T, y2: T, stroke: h })
    ] }),
    /* @__PURE__ */ w.jsx("g", { className: "gl-layout-chart-groups", children: u.map((k, A) => {
      const O = C(A), I = e.showPoints || e.chartType === "dots" ? k.points : [];
      return /* @__PURE__ */ w.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(k.mean) && /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
          /* @__PURE__ */ w.jsx("rect", { x: O - D / 2, y: Math.min(b(k.mean), T), width: D, height: Math.abs(T - b(k.mean)), fill: _, stroke: h, strokeWidth: 0.8 }),
          k.n > 1 && k.sd > 0 && /* @__PURE__ */ w.jsxs("g", { stroke: h, strokeWidth: 1, children: [
            /* @__PURE__ */ w.jsx("line", { x1: O, x2: O, y1: b(k.mean - k.sd), y2: b(k.mean + k.sd) }),
            /* @__PURE__ */ w.jsx("line", { x1: O - D / 4, x2: O + D / 4, y1: b(k.mean + k.sd), y2: b(k.mean + k.sd) }),
            /* @__PURE__ */ w.jsx("line", { x1: O - D / 4, x2: O + D / 4, y1: b(k.mean - k.sd), y2: b(k.mean - k.sd) })
          ] })
        ] }),
        e.chartType === "box" && k.n > 0 && /* @__PURE__ */ w.jsxs("g", { stroke: h, strokeWidth: 1, fill: _, children: [
          /* @__PURE__ */ w.jsx("line", { x1: O, x2: O, y1: b(k.min), y2: b(k.q1) }),
          /* @__PURE__ */ w.jsx("line", { x1: O, x2: O, y1: b(k.q3), y2: b(k.max) }),
          /* @__PURE__ */ w.jsx("rect", { x: O - D / 2, y: b(k.q3), width: D, height: Math.max(0.5, b(k.q1) - b(k.q3)) }),
          /* @__PURE__ */ w.jsx("line", { x1: O - D / 2, x2: O + D / 2, y1: b(k.median), y2: b(k.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && k.n > 1 && /* @__PURE__ */ w.jsx("line", { x1: O - D / 2, x2: O + D / 2, y1: b(k.mean), y2: b(k.mean), stroke: h, strokeWidth: 2 }),
        I.map((N, B) => /* @__PURE__ */ w.jsx("circle", { cx: O + Lh(B + A * 31) * D * 0.3, cy: b(N.value), r: Math.max(2, o * 0.28), fill: M, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ w.jsx("title", { children: `${N.name}: ${ui(N.value)}` }) }, N.sampleId)),
        /* @__PURE__ */ w.jsx(
          "text",
          {
            x: O,
            y: d + y + 6,
            textAnchor: v ? "end" : "middle",
            dominantBaseline: "hanging",
            fontSize: o,
            fill: h,
            transform: v ? `rotate(-45 ${O} ${d + y + 6})` : void 0,
            children: k.label
          }
        )
      ] }, k.label || String(A));
    }) }),
    t.test && u.length >= 2 && /* @__PURE__ */ w.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: h, children: [
      /* @__PURE__ */ w.jsx("line", { x1: C(0), x2: C(u.length - 1), y1: d - 4, y2: d - 4, stroke: h }),
      /* @__PURE__ */ w.jsx("text", { x: (C(0) + C(u.length - 1)) / 2, y: d - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const ci = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), Yh = { x: "X (px)", y: "Y (px)", width: "Width (px)", height: "Height (px)" }, Jr = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], cl = 10, Xh = { index: 0, units: [], items: [] }, Hh = {}, fl = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, qh = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], Vh = [
  { how: "horizontal", label: "Distribute ↔", title: "Equal spacing between three or more items or groups, left to right; the outer two stay where they are" },
  { how: "vertical", label: "Distribute ↕", title: "Equal spacing between three or more items or groups, top to bottom; the outer two stay where they are" }
];
function $h(t) {
  var r, n, a;
  if (!t) return;
  t.stopDrag();
  const e = (r = t.getManager) == null ? void 0 : r.call(t);
  for (const i of ((n = e == null ? void 0 : e.getMoveables) == null ? void 0 : n.call(e)) ?? []) i !== e && ((a = i.stopDrag) == null || a.call(i));
}
function Uh(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function Kh(t, e, r) {
  return e ? r.some((n) => !!n && (t === `${e} · ${n}` || t.startsWith(`${e} · ${n} · `))) : !1;
}
function We(t, e, r) {
  var o, s, l;
  const n = t.recipe;
  if (n.kind === "text") return n.text.split(`
`)[0] || "Text";
  if ((o = n.title) != null && o.trim()) return n.title.trim();
  if (n.kind === "figure") return ((l = (s = n.illustration.figure) == null ? void 0 : s.name) == null ? void 0 : l.trim()) || "Figure";
  if (n.kind === "proportions") return n.settings.plotType === "box" ? "Boxplot" : "Composition";
  const a = e.find(({ id: u }) => u === n.sampleId), i = a == null ? void 0 : a.tree.populations[n.populationId];
  return n.kind === "chart" ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${uc[n.statistic]}` : n.kind === "strategy" ? `${(i == null ? void 0 : i.name) ?? "Population"} strategy` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function Zh({
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
  var _, M;
  const c = at.useRef(null), f = t.recipe, d = JSON.stringify(o), p = f.kind === "text" ? null : e.find(({ id: T }) => T === f.sampleId) ?? null, v = p ? { ...r, ...p.tree } : r, m = f.kind !== "text" && t.templateSampleId && t.templateSampleId !== f.sampleId ? e.find(({ id: T }) => T === t.templateSampleId) ?? null : null, x = f.kind === "text" || !p ? { id: f.kind === "text" ? "" : f.populationId, missing: !1 } : af(f.populationId, p.tree, wr(r), m == null ? void 0 : m.tree.id), y = x.id, b = x.missing ? ((_ = m == null ? void 0 : m.tree.populations[f.kind === "text" ? "" : f.populationId]) == null ? void 0 : _.name) ?? "the population" : null, E = f.kind === "text" ? null : u({ ...f, populationId: y }), C = (T) => E ? Sa(T, E) : T, D = f.kind === "strategy" ? C(((M = f.title) == null ? void 0 : M.trim()) || "{population}") : C(l), h = JSON.stringify(f);
  return at.useEffect(() => {
    const T = c.current;
    if (!T || f.kind === "text") return;
    const k = window.setTimeout(() => {
      var X, V;
      if (T.innerHTML = "", !p) {
        T.textContent = "The referenced file is unavailable or still loading.", T.className = "gl-layout-plot-host is-missing";
        return;
      }
      const A = v.populations[y];
      if (b || !A) {
        T.textContent = b ? `${p.name} has no population corresponding to ${b}.` : "The referenced population is unavailable.", T.className = "gl-layout-plot-host is-missing";
        return;
      }
      T.className = "gl-layout-plot-host";
      const O = Math.max(120, t.width - 8), I = Math.max(120, t.height - 8);
      if (f.kind === "strategy") {
        const G = of(
          p.sample,
          v.gates,
          v.populations,
          v.root_population_id ?? "",
          y,
          { fullPath: f.fullPath, maxEvents: o.maxEvents }
        ), tt = 8, et = 26, Z = Math.max(1, G.length);
        let rt = 1, q = 0;
        for (let ot = 1; ot <= Z; ot++) {
          const vt = Math.ceil(Z / ot), xt = Math.floor((O - tt * (ot - 1)) / ot), U = Math.floor((I - et - tt * (vt - 1)) / vt), ut = Math.min(xt, U);
          ut > q && (q = ut, rt = ot);
        }
        q = Math.max(100, Math.min(800, q));
        const nt = sf(
          p.sample,
          G,
          null,
          n,
          {
            gateView: ["forward"],
            displayMode: f.displayMode,
            maxEvents: o.maxEvents,
            nColumns: rt,
            plotSize: q,
            fitToColumns: !1,
            contourThreshold: o.contourThreshold,
            pointAlpha: o.pointAlpha,
            densityColorPower: i,
            pointSize: o.pointSize,
            kdeBandwidth: o.kdeBandwidth,
            pubStyle: o.pubStyle,
            gateLineWidth: o.gateLineWidth,
            gateLabelFormat: o.gateLabels,
            fontSizes: ci(o),
            contextTitle: D
          }
        );
        T.id = `layout-strategy-${t.id}`;
        for (const ot of Object.values(nt.plots ?? {})) ot.canvas_scale = s;
        fs().renderStrategyGrid(T.id, nt);
        return;
      }
      const N = Math.max(120, Math.min(O, I)), B = f.kind === "histogram" ? null : f.yChannel, W = lf(
        p.sample,
        v.gates,
        v.gate_order,
        v.populations,
        p.derived.masks,
        p.derived.stats.event_count,
        [y],
        [f.xChannel],
        B,
        n,
        {
          displayMode: f.displayMode,
          maxEvents: o.maxEvents,
          nColumns: 1,
          plotSize: N,
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
          fontSizes: ci(o),
          scaleFontsWithPlot: !0
        },
        p.derived.gateMasks
      ), H = `${y}|${f.xChannel}`, L = (X = W.plots) == null ? void 0 : X[H];
      if (!L) {
        T.textContent = "No events are available for this FCS/population combination.", T.className = "gl-layout-plot-host is-missing";
        return;
      }
      fs().renderMiniPlot(T, {
        ...L,
        display_mode: f.displayMode,
        plot_size: N,
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
        title: D,
        contour_levels: o.contourLevels,
        font_sizes: ci(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: "#334155",
        gates: ((V = W.gate_overlays) == null ? void 0 : V[H]) ?? []
      });
    }, 80);
    return () => window.clearTimeout(k);
  }, [
    a,
    i,
    d,
    n,
    t.height,
    t.id,
    t.width,
    h,
    p,
    v.gate_order,
    v.gate_version,
    v.gates,
    v.stored_hierarchies,
    v.populations,
    v.root_population_id,
    y,
    b,
    s,
    D
  ]), f.kind === "text" ? /* @__PURE__ */ w.jsx(
    "div",
    {
      className: "gl-layout-text-surface",
      style: { fontSize: f.fontSize, fontWeight: f.bold ? 700 : 400 },
      children: f.text
    }
  ) : /* @__PURE__ */ w.jsx("div", { ref: c, className: "gl-layout-plot-host" });
}
function Jh({
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
  sources: v,
  divisionProfiles: m,
  canvasScale: x,
  onTextChange: y,
  onTextFocus: b,
  textEditing: E,
  onTextEditStart: C,
  onTextEditEnd: D,
  onIsolate: h
}) {
  var k;
  const { t: _ } = Ca(), M = ef(t), T = M === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / M)), height: Math.max(1, Math.round(t.height / M)) };
  return /* @__PURE__ */ w.jsx(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": M === 1 ? void 0 : M,
      title: `${t.locked ? `${_("Locked")} · ` : ""}${We(t, n)}`,
      "data-title": We(t, n),
      onDoubleClick: h ? (A) => {
        A.stopPropagation(), h();
      } : void 0,
      className: `gl-layout-item${r ? " is-selected" : ""}${t.showFrame ? " has-frame" : ""}${t.recipe.kind === "text" ? " is-text" : ""}${t.locked ? " is-locked" : ""}`,
      style: {
        left: t.x,
        top: t.y,
        width: t.width,
        height: t.height,
        zIndex: t.z
      },
      children: /* @__PURE__ */ w.jsx("div", { className: "gl-layout-item-body", style: M === 1 ? void 0 : { zoom: M, width: T.width, height: T.height }, children: t.recipe.kind === "text" ? /* @__PURE__ */ w.jsx(
        tg,
        {
          text: t.recipe.text,
          templateText: e ?? t.recipe.text,
          fontSize: t.recipe.fontSize,
          bold: t.recipe.bold,
          editing: E,
          onEditStart: C,
          onEditEnd: D,
          onCommit: y,
          onFocus: b
        }
      ) : t.recipe.kind === "figure" ? /* @__PURE__ */ w.jsx(
        rf,
        {
          recipe: t.recipe,
          files: p,
          sources: v,
          state: a,
          globalScales: i,
          width: Math.max(120, T.width - 8),
          height: Math.max(80, T.height - 8)
        }
      ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ w.jsx(
        nf,
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
      ) : t.recipe.kind === "chart" ? /* @__PURE__ */ w.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ w.jsx(
        Wh,
        {
          data: Fh(t.recipe, n, d, f, a),
          recipe: t.recipe,
          style: l,
          width: Math.max(120, T.width - 8),
          height: Math.max(80, T.height - 8),
          title: ((k = t.recipe.title) == null ? void 0 : k.trim()) || We(t, n)
        }
      ) }) : /* @__PURE__ */ w.jsx(
        Zh,
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
const Qh = [
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
function dl({
  effective: t,
  own: e,
  onChange: r
}) {
  const { t: n } = Ca();
  return /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-style-fields", children: [
    Qh.map(({ key: a, label: i, step: o, integer: s }) => /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline" + (a in e ? " is-own" : ""), children: [
      n(i),
      /* @__PURE__ */ w.jsx(
        Me,
        {
          "aria-label": n(i),
          value: t[a],
          min: ls[a][0],
          max: ls[a][1],
          step: o,
          integer: s,
          onCommit: (l) => r({ [a]: l })
        }
      )
    ] }, a)),
    /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline" + ("gateLabels" in e ? " is-own" : ""), children: [
      n("Gate labels"),
      /* @__PURE__ */ w.jsxs(
        "select",
        {
          "aria-label": n("Gate labels"),
          value: t.gateLabels,
          onChange: (a) => r({ gateLabels: a.target.value }),
          children: [
            /* @__PURE__ */ w.jsx("option", { value: "name-percent", children: n("Name and percentage") }),
            /* @__PURE__ */ w.jsx("option", { value: "percent", children: n("Percentage") }),
            /* @__PURE__ */ w.jsx("option", { value: "number", children: n("Number only") }),
            /* @__PURE__ */ w.jsx("option", { value: "name", children: n("Name only") }),
            /* @__PURE__ */ w.jsx("option", { value: "none", children: n("None") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ w.jsxs("label", { className: "gl-check" + ("pubStyle" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ w.jsx(
        "input",
        {
          type: "checkbox",
          checked: t.pubStyle,
          onChange: (a) => r({ pubStyle: a.target.checked })
        }
      ),
      n("Publication style (black gates and labels)")
    ] }),
    /* @__PURE__ */ w.jsxs("label", { className: "gl-check" + ("histFill" in e ? " is-own" : ""), children: [
      /* @__PURE__ */ w.jsx(
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
function tg({
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
  const { t: u } = Ca(), [c, f] = at.useState(e), d = at.useRef(null);
  at.useEffect(() => {
    if (!a) return;
    f(e);
    const v = d.current;
    v && (v.focus({ preventScroll: !0 }), v.setSelectionRange(v.value.length, v.value.length));
  }, [a]);
  const p = { fontSize: r, fontWeight: n ? 700 : 400 };
  return a ? /* @__PURE__ */ w.jsx(
    "textarea",
    {
      ref: d,
      className: "gl-layout-text-surface",
      "aria-label": "Layout text",
      value: c,
      style: p,
      onChange: (v) => f(v.target.value),
      onFocus: l,
      onBlur: (v) => {
        c !== e && s(c, v.currentTarget.scrollHeight), o();
      },
      onKeyDown: (v) => {
        v.stopPropagation(), v.key === "Escape" && v.currentTarget.blur();
      }
    }
  ) : /* @__PURE__ */ w.jsx(
    "div",
    {
      className: "gl-layout-text-surface is-static",
      style: p,
      title: u("Double-click to edit"),
      onDoubleClick: (v) => {
        v.stopPropagation(), i();
      },
      children: t
    }
  );
}
function rg({
  workspace: t,
  onChange: e,
  samples: r,
  checkedSampleIds: n = [],
  groups: a = [],
  fileGroups: i = {},
  metadataColumns: o = [],
  populationMetadata: s,
  activeSampleId: l,
  activePopulationId: u,
  state: c,
  globalScales: f,
  defaultX: d,
  defaultY: p,
  illustrationConfig: v,
  onOpenInIllustration: m,
  plottingSettings: x,
  divisionProfiles: y = Hh,
  onOpenInPlotting: b,
  dataRevision: E,
  densityColorPower: C,
  onOpenInGating: D
}) {
  var Zo, Jo, Qo, ts;
  const { t: h } = Ca(), [_, M] = at.useState([]), [T, k] = at.useState(null), [A, O] = at.useState(!0), [I, N] = at.useState(null), [B, W] = at.useState(null), [H, L] = at.useState([]), [X, V] = at.useState([]), G = at.useRef(null), tt = at.useRef(null), [et, Z] = at.useState(null), [rt, q] = at.useState(null), [nt, ot] = at.useState(
    l ?? ((Zo = r[0]) == null ? void 0 : Zo.id) ?? ""
  ), [vt, xt] = at.useState("item"), [U, ut] = at.useState(!1), [wt, ht] = at.useState({ shift: !1, meta: !1 });
  at.useEffect(() => {
    const g = (R) => ht((j) => {
      const F = { shift: R.shiftKey, meta: R.metaKey || R.ctrlKey };
      return F.shift === j.shift && F.meta === j.meta ? j : F;
    }), S = () => ht((R) => R.shift || R.meta ? { shift: !1, meta: !1 } : R);
    return window.addEventListener("keydown", g), window.addEventListener("keyup", g), window.addEventListener("blur", S), () => {
      window.removeEventListener("keydown", g), window.removeEventListener("keyup", g), window.removeEventListener("blur", S);
    };
  }, []);
  const [ft, yt] = at.useState(1), _t = at.useRef(ft);
  _t.current = ft;
  const [kt, Ct] = at.useState(ft);
  at.useEffect(() => {
    const g = window.setTimeout(() => Ct(ft), 250);
    return () => window.clearTimeout(g);
  }, [ft]);
  const Mt = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * kt)), [Gt, re] = at.useState("pdf"), [Ft, Bt] = at.useState(!1), At = at.useRef(null), me = at.useRef(null), ie = (g) => {
    var S;
    M(g), (S = At.current) == null || S.focus({ preventScroll: !0 });
  }, Dn = (g) => ie(g ? [g] : []), xe = Lc(
    r,
    r.map((g) => g.id),
    c,
    E
  ), Lt = at.useMemo(
    () => xe.current ? xe.sources.map((g) => ({ ...g, derived: g.gating })) : [],
    [xe.current, xe.sources]
  ), nr = at.useMemo(
    () => Object.fromEntries(r.map((g) => [g.id, g.metadata])),
    [r]
  ), Wt = r.length === 0 || xe.current && xe.pending === 0, He = at.useRef([]), qe = at.useRef([]), $ = t.sheets.find(({ id: g }) => g === t.activeSheetId) ?? t.sheets[0], gt = ($ == null ? void 0 : $.iteration) ?? pl, Jt = at.useMemo(() => {
    const g = $ == null ? void 0 : $.items.find((R) => oe(R.recipe) && R.recipe.iterated === !0), S = g && "sampleId" in g.recipe ? g.recipe.sampleId : l;
    return Lt.find(({ id: R }) => R === S) ?? Lt[0] ?? null;
  }, [$, Lt, l]), yr = at.useMemo(
    () => gt.mode === "populations" ? Jt ? Mh(gt, Jt.tree, r.find(({ id: g }) => g === Jt.id) ?? Jt) : [] : _h(gt, r, n, a, i),
    [gt, r, n, a, i, Jt]
  ), Oe = at.useCallback((g, S) => {
    const R = r.find(({ id: it }) => it === g.sampleId) ?? null, j = Lt.find(({ id: it }) => it === g.sampleId) ?? null;
    let F = g.populationId;
    if (j && S && S !== g.sampleId) {
      const it = Lt.find(({ id: bt }) => bt === S);
      if (it && it.tree.id !== j.tree.id) {
        const bt = Qr({ hierarchyId: it.tree.id, populationId: g.populationId }, j.tree, wr(c));
        bt.id && (F = bt.id);
      }
    }
    const J = j == null ? void 0 : j.tree.populations[F], K = j == null ? void 0 : j.derived.stats.event_count[F];
    return Sh(
      g.kind === "strategy" ? {} : g,
      R ? { name: R.name, fileName: R.fileName ?? R.name, metadata: R.metadata } : null,
      J ? { id: F, name: J.name } : null,
      typeof K == "number" ? K : void 0,
      s
    );
  }, [r, Lt, c, s]), Et = at.useMemo(
    () => $ ? wh($, yr, Oe) : [],
    [$, yr, Oe]
  ), [Qt, Ge] = at.useState(0), [Xr, Oa] = at.useState(!1), [Hr, cc] = at.useState(" · "), ko = at.useMemo(
    () => [...new Set(Object.values(s ?? {}).flatMap((g) => Object.keys(g)))].sort(),
    [s]
  ), To = at.useMemo(() => yh(o, ko), [o, ko]), ze = Math.min(Qt, Math.max(0, Et.length - 1)), qt = Et[ze] ?? Xh, Ro = ((Jo = $ == null ? void 0 : $.titleTemplate) == null ? void 0 : Jo.trim()) || Ch(
    qt.items.flatMap((g) => oe(g.recipe) ? [{ sampleId: g.recipe.sampleId, populationId: g.recipe.populationId, label: g.recipe.kind === "strategy" ? void 0 : g.recipe.label }] : [])
  );
  at.useEffect(() => {
    Qt !== ze && Ge(ze);
  }, [Qt, ze]);
  const qr = (g) => g.split("::")[0], ne = [...new Set(_.map(qr))], fe = ($ == null ? void 0 : $.items.filter(({ id: g }) => ne.includes(g))) ?? [], ct = fe.length === 1 ? fe[0] : null, _n = ct ? qt.items.find((g) => g.templateId === ct.id) ?? null : null, Io = (g) => g.split("::")[1] ?? "", Mn = (g) => {
    var S;
    return (S = qt.items.find((R) => R.id === g)) == null ? void 0 : S.group;
  }, Po = (g) => {
    const S = new Set(g.map(Mn).filter((F) => !!F));
    if (!S.size) return [...g];
    const R = new Set(g.map(Io)), j = new Set(g);
    for (const F of qt.items) F.group && S.has(F.group) && R.has(Io(F.id)) && j.add(F.id);
    return [...j];
  }, Vr = Wc(fe).length, fc = fe.length > 1 && fe.every((g) => g.group && g.group === fe[0].group), Oo = (g, S) => {
    var F;
    if (!oe(g.recipe)) return "";
    const R = ((F = g.recipe.title) == null ? void 0 : F.trim()) ?? "";
    if (!R) return "";
    const j = Oe(g.recipe, S);
    return j && Kh(R, j.population, [j.file, j.sample]) ? "" : R;
  }, dc = _n && oe(_n.recipe) ? Sa(Ro, Oe(_n.recipe, _n.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", za = fe.some((g) => g.locked), kn = new Set((($ == null ? void 0 : $.items) ?? []).filter((g) => g.locked).map((g) => g.id)), Fe = H.filter((g) => !kn.has(qr(g.dataset.itemId ?? "")) && g.dataset.itemId !== T), $r = Fe.length > 1 && Fe.every((g) => !Mn(g.dataset.itemId ?? "")), zo = at.useRef(Fe);
  zo.current = Fe;
  const Tn = at.useRef(!1);
  at.useEffect(() => {
    _.length && _.some((g) => !qt.items.some((S) => S.id === g)) && M((g) => g.filter((S) => qt.items.some((R) => R.id === S)));
  }, [qt, _]), at.useLayoutEffect(() => {
    var g;
    (g = G.current) == null || g.updateRect();
  }, [qt, ft, kt]), at.useLayoutEffect(() => {
    var F;
    if (!I) return;
    const g = [...I.querySelectorAll("[data-item-id]")], S = (J, K) => J.length === K.length && J.every((it, bt) => it === K[bt]), R = g.filter((J) => _.includes(J.dataset.itemId ?? "")), j = g.filter((J) => !_.includes(J.dataset.itemId ?? ""));
    L((J) => S(J, R) ? J : R), V((J) => S(J, j) ? J : j), (F = tt.current) == null || F.setSelectedTargets(R);
  }, [I, _, qt, $ == null ? void 0 : $.id]), at.useEffect(() => {
    qo();
  }, [$ == null ? void 0 : $.id]);
  const Aa = (g, S = !0) => {
    S && (He.current = [
      Gn(t),
      ...He.current
    ].slice(0, 30), qe.current = []), e(g);
  }, br = (g) => {
    const S = Gn(t);
    g(S), Aa(S);
  }, Tt = (g) => {
    br((S) => {
      const R = S.sheets.find(({ id: j }) => j === S.activeSheetId);
      R && g(R);
    });
  }, Na = at.useRef(null), [pc, Ba] = at.useState(null), Sr = (g, S) => {
    let R = "";
    const j = Na.current;
    Na.current = null, Tt((F) => {
      R = crypto.randomUUID();
      const J = cs(F, S == null ? void 0 : S.width, S == null ? void 0 : S.height);
      j && (J.x = Math.max(0, Math.round(j.x)), J.y = Math.max(0, Math.round(j.y))), F.items.push({
        id: R,
        ...J,
        recipe: g
      });
    }), Dn(R), Ec(R);
  }, ee = Lt.find(({ id: g }) => g === nt) ?? Lt[0] ?? null, ja = ee && u ? Qr(
    {
      hierarchyId: c.active_hierarchy_id,
      populationId: u
    },
    ee.tree,
    wr(c)
  ) : null, Ve = (ja == null ? void 0 : ja.id) ?? (ee == null ? void 0 : ee.tree.root_population_id) ?? "", Rn = (g) => {
    var S, R, j;
    if (!ee || !Ve) {
      q(h("Check an FCS file and select a population first."));
      return;
    }
    Sr({
      kind: g,
      sampleId: ee.id,
      populationId: Ve,
      ...gt.mode !== "off" ? { iterated: !0 } : {},
      xChannel: ee.sample.index(d) !== void 0 ? d : ((S = ee.sample.channels[0]) == null ? void 0 : S.key) ?? "",
      yChannel: g === "histogram" ? null : ee.sample.index(p) !== void 0 ? p : ((R = ee.sample.channels[1]) == null ? void 0 : R.key) ?? ((j = ee.sample.channels[0]) == null ? void 0 : j.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, Ao = () => {
    if (!ee || !Ve) {
      q(h("Check an FCS file and select a population first."));
      return;
    }
    Sr(
      {
        kind: "chart",
        sampleId: ee.id,
        populationId: Ve,
        statistic: "percent_of_parent",
        files: "checked",
        groupBy: o[0] ?? "",
        chartType: "bars",
        showPoints: !0,
        test: !0
      },
      { width: 320, height: 240 }
    );
  }, No = () => Sr({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), vc = (g, S) => {
    Tt((R) => {
      const j = R.items.find((F) => F.id === g);
      j && (j.recipe = S(j.recipe));
    });
  }, hc = (g) => {
    g.preventDefault();
    const S = g.target.closest("[data-item-id]");
    if (S != null && S.dataset.itemId) {
      const J = S.dataset.itemId, K = $ == null ? void 0 : $.items.find(({ id: be }) => be === qr(J));
      if (!K) return;
      const it = _.includes(J);
      it || ie(Po([J]));
      const bt = K.group ? (($ == null ? void 0 : $.items) ?? []).filter((be) => be.group === K.group).map(({ id: be }) => be) : [K.id], lt = it && ne.length > 1 ? ne : bt, Ot = lt.length > 1, ye = oe(K.recipe), or = [
        { label: Ot ? h("Duplicate {n} items", { n: lt.length }) : h("Duplicate"), onClick: () => Kr(lt) },
        { label: h("Bring to front"), onClick: () => Le(lt, "front") },
        { label: h("Bring forward"), onClick: () => Le(lt, "forward") },
        { label: h("Send backward"), onClick: () => Le(lt, "backward") },
        { label: h("Send to back"), onClick: () => Le(lt, "back") },
        { label: K.locked ? h("Unlock") : h("Lock"), onClick: () => Pn(lt, !K.locked) },
        ...it && Vr > 1 ? [{ label: h("Group"), onClick: In }] : [],
        ...K.group ? [{ label: h("Ungroup"), onClick: () => Tt((be) => us(be, lt)) }] : [],
        "separator",
        ...gt.mode !== "off" && ye ? [
          {
            label: "iterated" in K.recipe && K.recipe.iterated ? h("Stop following the iteration") : h("Follow the iteration"),
            onClick: () => vc(K.id, (be) => oe(be) ? { ...be, iterated: !be.iterated } : be)
          },
          "separator"
        ] : [],
        ...ye ? [{ label: h("Open in Gating"), onClick: () => D(K.recipe) }] : [],
        ...K.recipe.kind === "figure" && m ? [{ label: h("Edit in Illustration"), onClick: () => m(structuredClone(K.recipe.illustration)) }] : [],
        ...K.recipe.kind === "proportions" && b ? [{ label: h("Edit in Plotting"), onClick: () => b(structuredClone(K.recipe.settings)) }] : [],
        { label: Ot ? h("Remove {n} items", { n: lt.length }) : h("Remove"), onClick: () => Ur(lt) }
      ];
      Ba({ x: g.clientX, y: g.clientY, items: or, label: We(K, Lt) });
      return;
    }
    const R = g.currentTarget.getBoundingClientRect(), j = { x: (g.clientX - R.left) / ft, y: (g.clientY - R.top) / ft }, F = (J) => () => {
      Na.current = j, J();
    };
    Ba({
      x: g.clientX,
      y: g.clientY,
      label: h("Page"),
      items: [
        { label: h("+ Biplot"), disabled: !Wt, onClick: F(() => Rn("biplot")) },
        { label: h("+ Histogram"), disabled: !Wt, onClick: F(() => Rn("histogram")) },
        { label: h("+ Gating strategy"), disabled: !Wt, onClick: F(Go) },
        { label: h("+ Chart"), disabled: !Wt, onClick: F(Ao) },
        { label: h("+ Text"), onClick: F(No) },
        { label: h("+ Illustration figure"), disabled: !Wt || !(v != null && v.figure), onClick: F(Bo) },
        { label: h("+ Plotting chart"), disabled: !Wt || !x, onClick: F(jo) },
        "separator",
        // With a selection on the page, the menu on blank paper offers what the selection's own menu does for grouping, as Illustrator's does.
        ...Vr > 1 ? [{ label: h("Group"), onClick: In }] : [],
        ...fe.some((J) => J.group) ? [{ label: h("Ungroup"), onClick: Ga }] : [],
        { label: h("Select all"), disabled: !qt.items.length, onClick: () => ie(qt.items.filter((J) => !kn.has(J.templateId)).map(({ id: J }) => J)) }
      ]
    });
  }, Bo = () => {
    if (!(v != null && v.figure)) {
      q(h("Make a figure on the Illustration tab first."));
      return;
    }
    $ && Sr({ kind: "figure", illustration: structuredClone(v), page: 0 }, $c(v, r, c, $));
  }, jo = () => {
    if (!x || !$) return;
    const g = x(), S = Uc(g, Kc(r), c, nr, y);
    if (!S.catLevels.length || !S.perSample.length) {
      q(h("Choose files and populations on the Plotting tab first."));
      return;
    }
    Sr({ kind: "proportions", settings: g }, Zc(g, S, $));
  }, Go = () => {
    var R;
    if (!ee || !Ve) {
      q(h("Check an FCS file and select a population first."));
      return;
    }
    const g = ee.tree.root_population_id ?? "", S = Ve !== g ? Ve : ((R = na(ee.tree.populations, g).filter(({ popId: j }) => j !== g).at(-1)) == null ? void 0 : R.popId) ?? Ve;
    Sr(
      {
        kind: "strategy",
        sampleId: ee.id,
        populationId: S,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...gt.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, gc = () => {
    var F, J;
    if (!v) {
      q(h("Render or configure an Illustration selection first."));
      return;
    }
    if (!v.figure && v.plotType === "heatmap") {
      q(
        h("Heatmap layout blocks are planned for the next Layout phase.")
      );
      return;
    }
    const g = new Map(Lt.map((K) => [K.id, K])), S = [], R = v.figure;
    for (const K of Lt) {
      if (R) {
        if (!R.sampleIds.includes(K.id)) continue;
        for (const bt of R.plots)
          if (bt.type !== "heatmap")
            for (const lt of bt.population ? [bt.population] : ((F = R.samplePopulations) == null ? void 0 : F[K.id]) ?? R.populations) {
              const Ot = Qr(
                lt,
                K.tree,
                wr(c)
              );
              Ot.id && Ot.status !== "changed" && S.push({
                sampleId: K.id,
                populationId: Ot.id,
                xChannel: bt.x,
                yChannel: bt.y,
                type: bt.type
              });
            }
        continue;
      }
      const it = v.selectionMode === "matrix" ? ((J = v.selectedPopulationsBySample) == null ? void 0 : J[K.id]) ?? [] : v.popIds;
      for (const bt of it)
        for (const lt of v.xChannels)
          S.push({ sampleId: K.id, populationId: bt, xChannel: lt });
    }
    const j = S.slice(0, 60);
    if (j.length === 0) {
      q(
        h("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    Tt((K) => {
      for (const it of j) {
        if (!g.get(it.sampleId)) continue;
        const lt = it.type ?? (v.plotType === "histogram" ? "histogram" : "biplot");
        K.items.push({
          id: crypto.randomUUID(),
          ...cs(K),
          recipe: {
            kind: lt,
            sampleId: it.sampleId,
            populationId: it.populationId,
            xChannel: it.xChannel,
            yChannel: lt === "histogram" ? null : it.yChannel ?? v.yChannel,
            displayMode: v.displayMode === "dots" ? "scatter" : v.displayMode
          }
        });
      }
    }), q(
      S.length > j.length ? h(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: j.length
        }
      ) : h("Added {count} Illustration plots.", { count: j.length })
    );
  }, Rt = (g) => {
    ct && Tt((S) => {
      const R = S.items.find(({ id: j }) => j === ct.id);
      R && (R.recipe = g(R.recipe));
    });
  }, Ur = (g) => {
    Tt((S) => {
      S.items = S.items.filter((R) => !g.includes(R.id));
    }), M((S) => S.filter((R) => !g.includes(R)));
  }, Kr = (g, S) => {
    const R = [];
    return Tt((j) => {
      let F = Math.max(0, ...j.items.map((K) => K.z));
      const J = /* @__PURE__ */ new Map();
      for (const K of g) {
        const it = j.items.find((ye) => ye.id === K);
        if (!it) continue;
        const bt = crypto.randomUUID();
        R.push(bt);
        const lt = (S == null ? void 0 : S[K]) ?? { x: it.x + 20, y: it.y + 20, width: it.width, height: it.height }, Ot = it.group ? J.get(it.group) ?? crypto.randomUUID() : void 0;
        it.group && Ot && J.set(it.group, Ot), j.items.push({ ...it, ...lt, id: bt, locked: !1, z: ++F, recipe: { ...it.recipe }, ...Ot ? { group: Ot } : {} });
      }
    }), R.length && ie(R), R;
  }, mc = (g, S, R) => {
    Tt((j) => {
      for (const F of j.items)
        !g.includes(F.id) || F.locked || (F.x += S, F.y += R);
    });
  }, Le = (g, S) => {
    Tt((R) => {
      const j = [...R.items].sort((it, bt) => it.z - bt.z), F = j.filter((it) => g.includes(it.id)), J = j.filter((it) => !g.includes(it.id));
      let K;
      if (S === "front") K = [...J, ...F];
      else if (S === "back") K = [...F, ...J];
      else {
        K = j;
        const it = K.map((bt, lt) => lt);
        S === "forward" && it.reverse();
        for (const bt of it) {
          const lt = S === "forward" ? bt + 1 : bt - 1;
          !g.includes(K[bt].id) || lt < 0 || lt >= K.length || g.includes(K[lt].id) || ([K[bt], K[lt]] = [K[lt], K[bt]]);
        }
      }
      K.forEach((it, bt) => {
        it.z = bt;
      });
    });
  }, In = () => {
    Vr < 2 || Tt((g) => {
      uf(g, ne);
    });
  }, Ga = () => {
    fe.some((g) => g.group) && Tt((g) => us(g, ne));
  }, Pn = (g, S) => {
    Tt((R) => {
      for (const j of R.items) g.includes(j.id) && (j.locked = S);
    });
  }, xc = (g) => {
    Tt((S) => cf(S, ne.filter((R) => {
      var j;
      return !((j = S.items.find((F) => F.id === R)) != null && j.locked);
    }), g));
  }, yc = (g) => {
    Tt((S) => ff(S, ne.filter((R) => {
      var j;
      return !((j = S.items.find((F) => F.id === R)) != null && j.locked);
    }), g));
  }, On = (g, S) => {
    const R = {};
    for (const F of g) {
      const J = F.dataset.itemId, K = qt.items.find((lt) => lt.id === J);
      if (!K) continue;
      const { id: it, ...bt } = kh(K, Uh(F));
      R[it] = bt;
    }
    const j = Object.keys(R);
    if (j.length) {
      if (S) {
        for (const F of g) {
          const J = qt.items.find((K) => K.id === F.dataset.itemId);
          J && Object.assign(F.style, { left: `${J.x}px`, top: `${J.y}px`, width: `${J.width}px`, height: `${J.height}px` });
        }
        Kr(j, R);
        return;
      }
      Tt((F) => {
        for (const J of F.items) R[J.id] && Object.assign(J, R[J.id]);
      });
    }
  }, Fo = (g) => g.flatMap((S) => {
    if (!(S instanceof HTMLElement) || !S.parentElement) return [];
    const R = S.cloneNode(!0);
    R.classList.add("gl-layout-ghost"), R.classList.remove("is-selected"), R.removeAttribute("data-item-id"), R.setAttribute("aria-hidden", "true");
    const j = S.querySelectorAll("canvas");
    return R.querySelectorAll("canvas").forEach((F, J) => {
      var it;
      const K = j[J];
      K && (F.width = K.width, F.height = K.height, (it = F.getContext("2d")) == null || it.drawImage(K, 0, 0));
    }), S.parentElement.insertBefore(R, S), [R];
  }), zn = (g) => {
    if (Array.isArray(g)) for (const S of g) S.remove();
  }, Fa = (g) => {
    for (const S of g) {
      const R = qt.items.find((j) => j.id === S.dataset.itemId);
      R && Object.assign(S.style, { left: `${R.x}px`, top: `${R.y}px`, width: `${R.width}px`, height: `${R.height}px` });
    }
  }, Lo = at.useRef(Fa);
  Lo.current = Fa;
  const $e = at.useRef(null), An = (g, S) => {
    const R = { targets: g, ghosts: S, cancelled: !1 };
    $e.current = R;
    const j = () => {
      window.removeEventListener("mouseup", j, !0), window.removeEventListener("touchend", j, !0), window.setTimeout(() => {
        $e.current === R && ($e.current = null, zn(R.ghosts));
      }, 0);
    };
    window.addEventListener("mouseup", j, !0), window.addEventListener("touchend", j, !0);
  }, Nn = (g, S, R, j) => {
    const F = $e.current;
    $e.current = null, zn(F == null ? void 0 : F.ghosts);
    const J = S == null ? void 0 : S.dist, K = !J || Math.hypot(J[0] ?? 0, J[1] ?? 0) >= 3;
    F != null && F.cancelled || !R || !K ? Fa(g) : j();
  }, Wo = (g) => {
    var F;
    g.target.style.left = `${g.left}px`, g.target.style.top = `${g.top}px`;
    const S = (F = g.datas) == null ? void 0 : F.companions;
    if (!(S != null && S.length)) return;
    const R = g.left - g.datas.startLeft, j = g.top - g.datas.startTop;
    for (const { el: J, left: K, top: it } of S)
      J.style.left = `${K + R}px`, J.style.top = `${it + j}px`;
  }, Yo = (g) => {
    var R;
    const S = (R = g.datas) == null ? void 0 : R.companions;
    return [g.target, ...(S ?? []).map(({ el: j }) => j)];
  }, bc = (g) => {
    var F;
    g.datas.alt = !!((F = g.inputEvent) != null && F.altKey);
    const S = g.target, R = $r ? zo.current.filter((J) => J !== S) : [];
    g.datas.startLeft = parseFloat(S.style.left) || 0, g.datas.startTop = parseFloat(S.style.top) || 0, g.datas.companions = R.map((J) => ({ el: J, left: parseFloat(J.style.left) || 0, top: parseFloat(J.style.top) || 0 }));
    const j = Yo(g);
    An(j, g.datas.alt ? Fo(j) : void 0);
  }, Xo = (g) => {
    g.target.style.width = `${g.width}px`, g.target.style.height = `${g.height}px`, g.target.style.left = `${g.drag.left}px`, g.target.style.top = `${g.drag.top}px`;
  }, Sc = (g) => {
    var j;
    const S = (j = g.inputEvent) == null ? void 0 : j.target;
    if (!S) return;
    const R = G.current;
    if (R != null && R.isMoveableElement(S)) {
      g.stop();
      return;
    }
    if (Fe.some((F) => F === S || F.contains(S)) && (g.stop(), Fe.length > 1 && !$r)) {
      R == null || R.dragStart(g.inputEvent);
      const F = g.inputEvent, J = (K) => {
        var it;
        window.removeEventListener("mouseup", J), Math.hypot(K.clientX - F.clientX, K.clientY - F.clientY) < 4 && ((it = tt.current) == null || it.clickTarget(F, S));
      };
      window.addEventListener("mouseup", J);
    }
  }, Cc = (g) => {
    var F, J, K;
    const S = g.isClick || g.isDragStart, R = new Set((g.removed ?? []).map((it) => Mn(it.dataset.itemId ?? "")).filter(Boolean)), j = Po(
      g.selected.map((it) => it.dataset.itemId ?? "").filter((it) => it && (S || !kn.has(qr(it))))
    ).filter((it) => !R.has(Mn(it)));
    if (ie(j), g.isDragStart && !g.isClick) {
      if (!j.filter((lt) => !kn.has(qr(lt)) && lt !== T).length) return;
      (J = (F = g.inputEvent) == null ? void 0 : F.preventDefault) == null || J.call(F), Tn.current = !0;
      const bt = () => {
        Tn.current = !1;
      };
      window.setTimeout(() => window.addEventListener("mousedown", bt, { capture: !0, once: !0 }), 0), (K = G.current) == null || K.waitToChangeTarget().then(() => {
        var lt;
        return (lt = G.current) == null ? void 0 : lt.dragStart(g.inputEvent);
      });
    }
  }, Ec = (g) => {
    window.requestAnimationFrame(() => {
      var S, R, j;
      (j = (R = (S = me.current) == null ? void 0 : S.querySelector(`[data-item-id="${g}"]`)) == null ? void 0 : R.scrollIntoView) == null || j.call(R, { block: "nearest", inline: "nearest" });
    });
  }, ar = (g) => {
    Tt((S) => Jc(S, g));
  }, wc = () => Tt((g) => Qc(g)), Dc = () => Tt((g) => tf(g)), Ho = (() => {
    const g = [], S = [];
    if (!$) return { vertical: g, horizontal: S };
    const R = fi($.page), j = as($.page.marginMm);
    for (const F of oa($.page))
      g.push(F.x, F.x + j, F.x + R.width / 2, F.x + R.width - j, F.x + R.width), S.push(F.y, F.y + j, F.y + R.height / 2, F.y + R.height - j, F.y + R.height);
    return { vertical: [...new Set(g)], horizontal: [...new Set(S)] };
  })(), qo = () => {
    const g = At.current;
    if (!g || !$) return;
    const S = { width: g.clientWidth - 36, height: g.clientHeight - 36 };
    if (S.width <= 0 || S.height <= 0) return;
    const R = Math.min(S.width / $.width, S.height / $.height);
    yt(Math.max(0.1, Math.min(4, Math.floor(R * 100) / 100)));
  };
  at.useEffect(() => {
    const g = B;
    if (!g) return;
    const S = (R) => {
      if (!(R.altKey || R.shiftKey || R.ctrlKey)) return;
      const j = R.deltaY || R.deltaX;
      if (!j) return;
      R.preventDefault();
      const F = _t.current, J = Math.max(0.1, Math.min(4, Math.round(F * Math.exp(-j * 25e-4) * 100) / 100));
      if (J === F) return;
      _t.current = J, yt(J);
      const K = g.getBoundingClientRect(), it = R.clientX - K.left, bt = R.clientY - K.top, lt = J / F, Ot = (g.scrollLeft + it) * lt - it, ye = (g.scrollTop + bt) * lt - bt;
      requestAnimationFrame(() => {
        g.scrollLeft = Ot, g.scrollTop = ye;
      });
    };
    return g.addEventListener("wheel", S, { passive: !1 }), () => g.removeEventListener("wheel", S);
  }, [B]);
  const Vo = (g) => {
    const S = g > 0 ? Jr.find((R) => R > ft + 1e-3) : [...Jr].reverse().find((R) => R < ft - 1e-3);
    S && yt(S);
  }, _c = () => new Promise((g) => {
    window.setTimeout(() => window.requestAnimationFrame(() => window.requestAnimationFrame(() => g())), 450);
  }), $o = async () => {
    const g = me.current;
    if (!g || !$ || Ft) return;
    Bt(!0);
    const S = ze;
    try {
      const R = [];
      for (let j = 0; j < Et.length; j++)
        Et.length > 1 && (Ge(j), await _c()), R.push(...gh(g, $, { zoom: ft }));
      await mh(R, $, Gt);
    } catch (R) {
      q(R instanceof Error ? R.message : String(R));
    } finally {
      Et.length > 1 && Ge(S), Bt(!1);
    }
  }, ir = (g) => {
    Tt((S) => {
      var R;
      if (g.mode === "off") {
        delete S.iteration;
        return;
      }
      if ((((R = S.iteration) == null ? void 0 : R.mode) ?? "off") === "off" && !S.items.some(oc))
        for (const j of S.items) oe(j.recipe) && (j.recipe.iterated = !0);
      S.iteration = g;
    }), Ge(0);
  }, Mc = (g) => [...new Set(r.map((S) => {
    var R;
    return ((R = S.metadata) == null ? void 0 : R[g]) ?? "";
  }).filter(Boolean))], kc = gt.source.kind === "group" ? `group:${gt.source.groupId}` : gt.source.kind === "metadata" ? `meta:${gt.source.column}=${gt.source.value}` : gt.source.kind, Tc = (g) => {
    if (g === "all") return { kind: "all" };
    if (g.startsWith("group:")) return { kind: "group", groupId: g.slice(6) };
    if (g.startsWith("meta:")) {
      const [S, ...R] = g.slice(5).split("=");
      return { kind: "metadata", column: S, value: R.join("=") };
    }
    return { kind: "checked" };
  }, Rc = (g) => {
    const S = ss(g.nativeEvent);
    if (S) {
      g.preventDefault(), S === "undo" ? Bn() : jn();
      return;
    }
    if (g.target.closest("input, textarea, select")) return;
    const R = g.metaKey || g.ctrlKey;
    if (g.key === "Escape") {
      M([]);
      return;
    }
    if (R && g.key.toLowerCase() === "a") {
      g.preventDefault(), ie((($ == null ? void 0 : $.items) ?? []).filter((K) => !K.locked).map((K) => K.id));
      return;
    }
    if (!_.length) return;
    if (g.key === "Enter" && _.length === 1) {
      const K = qt.items.find((it) => it.id === _[0]);
      if ((K == null ? void 0 : K.recipe.kind) === "text") {
        g.preventDefault(), k(K.id);
        return;
      }
    }
    if (g.key === "Delete" || g.key === "Backspace") {
      g.preventDefault(), Ur(ne);
      return;
    }
    if (R && g.key.toLowerCase() === "d") {
      g.preventDefault(), Kr(ne);
      return;
    }
    if (R && (g.key === "]" || g.key === "[")) {
      g.preventDefault(), Le(ne, g.key === "]" ? g.shiftKey ? "front" : "forward" : g.shiftKey ? "back" : "backward");
      return;
    }
    if (R && g.key.toLowerCase() === "g") {
      g.preventDefault(), g.shiftKey ? Ga() : In();
      return;
    }
    if (R && g.shiftKey && g.key.toLowerCase() === "l") {
      g.preventDefault(), Pn(ne, !za);
      return;
    }
    const j = g.shiftKey ? 10 : 1, J = {
      ArrowLeft: [-j, 0],
      ArrowRight: [j, 0],
      ArrowUp: [0, -j],
      ArrowDown: [0, j]
    }[g.key];
    J && (g.preventDefault(), mc(ne, J[0], J[1]));
  }, La = ct == null ? void 0 : ct.recipe, Nt = La && "sampleId" in La ? Lt.find(({ id: g }) => g === La.sampleId) ?? null : null, Uo = Nt ? Nt.sample.channels.map((g) => ({
    value: g.key,
    label: Nt.sample.channelLabel(Nt.sample.index(g.key) ?? 0)
  })) : [], Ko = Nt ? na(
    Nt.tree.populations,
    Nt.tree.root_population_id ?? ""
  ) : [], Bn = () => {
    const g = He.current.shift();
    g && (qe.current = [
      Gn(t),
      ...qe.current
    ].slice(0, 30), Aa(g, !1));
  }, jn = () => {
    const g = qe.current.shift();
    g && (He.current = [
      Gn(t),
      ...He.current
    ].slice(0, 30), Aa(g, !1));
  }, Wa = at.useRef({ undo: Bn, redo: jn });
  return Wa.current = { undo: Bn, redo: jn }, at.useEffect(() => {
    const g = (R) => {
      var F, J;
      if (R.key === "Escape" && $e.current) {
        const K = $e.current;
        K.cancelled = !0, R.preventDefault(), R.stopPropagation(), Lo.current(K.targets), zn(K.ghosts), K.ghosts = void 0, $h(G.current);
        return;
      }
      const j = ss(R);
      j && ((J = (F = R.target) == null ? void 0 : F.closest) != null && J.call(F, "input, textarea, select, [contenteditable='true']") || (R.preventDefault(), R.stopPropagation(), j === "undo" ? Wa.current.undo() : Wa.current.redo()));
    }, S = () => {
      const R = $e.current;
      R && (zn(R.ghosts), R.ghosts = void 0);
    };
    return window.addEventListener("keydown", g, !0), window.addEventListener("blur", S), () => {
      window.removeEventListener("keydown", g, !0), window.removeEventListener("blur", S);
    };
  }, []), $ ? /* @__PURE__ */ w.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${U ? " is-preview" : ""}`,
      children: [
        /* @__PURE__ */ w.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": h("Layout sheets"),
            children: [
              t.sheets.map((g) => /* @__PURE__ */ w.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: et === g.id ? /* @__PURE__ */ w.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: g.name,
                  autoFocus: !0,
                  onFocus: (S) => S.currentTarget.select(),
                  onBlur: (S) => {
                    const R = S.currentTarget.value.trim();
                    R && br((j) => {
                      const F = j.sheets.find(
                        ({ id: J }) => J === g.id
                      );
                      F && (F.name = R);
                    }), Z(null);
                  },
                  onKeyDown: (S) => {
                    S.key === "Enter" && S.currentTarget.blur(), S.key === "Escape" && Z(null);
                  }
                }
              ) : /* @__PURE__ */ w.jsx(
                "button",
                {
                  type: "button",
                  role: "tab",
                  "aria-selected": t.activeSheetId === g.id,
                  className: `gl-layout-sheet-tab${t.activeSheetId === g.id ? " active" : ""}`,
                  title: h("Double-click to rename"),
                  onClick: () => br((S) => {
                    S.activeSheetId = g.id;
                  }),
                  onDoubleClick: () => Z(g.id),
                  children: g.name
                }
              ) }, g.id)),
              /* @__PURE__ */ w.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-layout-sheet-add",
                  title: h("New blank layout"),
                  onClick: () => {
                    const g = Yc(
                      `Layout ${t.sheets.length + 1}`,
                      { ...$.page }
                    );
                    br((S) => {
                      S.sheets.push(g), S.activeSheetId = g.id;
                    }), M([]);
                  },
                  children: "+"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ w.jsxs(
          "div",
          {
            className: "gl-layout-toolbar",
            onMouseDown: (g) => {
              g.target.closest("button") && g.preventDefault();
            },
            children: [
              /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Rn("biplot"), disabled: !Wt, title: h(Wt ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: h("+ Biplot") }),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Rn("histogram"), disabled: !Wt, title: h(Wt ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: h("+ Histogram") }),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Go, disabled: !Wt, title: h(Wt ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: h("+ Gating strategy") }),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Ao, disabled: !Wt, title: h(Wt ? "Add a summary chart: one statistic of a population per file, grouped by a metadata column, with a test between the groups" : "Preparing the files…"), children: h("+ Chart") }),
                /* @__PURE__ */ w.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: h("Add a text block; edit it on the page"),
                    onClick: No,
                    children: h("+ Text")
                  }
                ),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: gc, disabled: !Wt, title: h("Add one plot per file and plot of the Illustration tab's current selection"), children: h("Add Illustration selection") }),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Bo, disabled: !Wt, title: h("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: h("+ Illustration figure") }),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: jo, disabled: !Wt || !x, title: h("Add the Plotting tab's current chart as one block, drawn here as it is there"), children: h("+ Plotting chart") })
              ] }),
              /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": h("Arrange"), children: [
                qh.map(({ how: g, label: S, title: R }) => /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => xc(g), disabled: !_.length || U, title: h(R), children: h(S) }, g)),
                Vh.map(({ how: g, label: S, title: R }) => /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => yc(g), disabled: Vr < 3 || U, title: h(R), children: h(S) }, g)),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": A, onClick: () => O((g) => !g), title: h("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: h("Snap grid") })
              ] }),
              /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": U, onClick: () => ut(!U), title: h("Show the page as it exports, without grid, margins or handles"), children: h(U ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !He.current.length, onClick: Bn, title: h("Undo the last layout edit (Cmd-Z)"), children: h("Undo") }),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !qe.current.length, onClick: jn, title: h("Redo the undone edit (Shift-Cmd-Z)"), children: h("Redo") }),
                /* @__PURE__ */ w.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: h("Copy this sheet, with its page and items, as a new sheet"),
                    onClick: () => {
                      const g = {
                        ...$,
                        id: crypto.randomUUID(),
                        page: { ...$.page },
                        name: `${$.name} copy`,
                        items: $.items.map((S) => ({
                          ...S,
                          id: crypto.randomUUID(),
                          recipe: { ...S.recipe }
                        }))
                      };
                      br((S) => {
                        S.sheets.push(g), S.activeSheetId = g.id;
                      }), M([]);
                    },
                    children: h("Duplicate sheet")
                  }
                ),
                /* @__PURE__ */ w.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    disabled: t.sheets.length <= 1,
                    title: h("Remove this sheet; the layout keeps at least one"),
                    onClick: () => {
                      br((g) => {
                        const S = g.sheets.findIndex(
                          ({ id: R }) => R === g.activeSheetId
                        );
                        g.sheets.splice(S, 1), g.activeSheetId = g.sheets[Math.max(0, S - 1)].id;
                      }), M([]);
                    },
                    children: h("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": h("Zoom"), children: [
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: qo, title: h("Fit the page to the window"), children: h("Fit") }),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Vo(-1), "aria-label": h("Zoom out"), title: h("Zoom out"), disabled: ft <= Jr[0], children: "−" }),
                /* @__PURE__ */ w.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(ft * 100),
                  "%"
                ] }),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Vo(1), "aria-label": h("Zoom in"), title: h("Zoom in"), disabled: ft >= Jr[Jr.length - 1], children: "+" })
              ] }),
              (Et.length > 1 || gt.mode !== "off") && /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": h("Pages of the iteration"), children: [
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Ge(Math.max(0, ze - 1)), disabled: ze === 0, "aria-label": h("Previous page"), title: h("Previous page"), children: "◀" }),
                /* @__PURE__ */ w.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  h("Page {n} of {count}", { n: ze + 1, count: Math.max(1, Et.length) }),
                  qt.units.length > 0 && ` · ${qt.units.map((g) => g.name).join(", ")}`
                ] }),
                /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Ge(Math.min(Et.length - 1, ze + 1)), disabled: ze >= Et.length - 1, "aria-label": h("Next page"), title: h("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ w.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void $o(), disabled: Ft || !$.items.length, title: Et.length > 1 ? h("Write every page of the iteration; the format is chosen under Page") : h("Write this sheet at its page size; the format is chosen under Page"), children: Ft ? h("Exporting…") : h("Export {format}", { format: Gt.toUpperCase() }) }) }),
              /* @__PURE__ */ w.jsx("span", { className: "gl-layout-performance-note", children: h("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        rt && /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ w.jsx("span", { children: rt }),
          /* @__PURE__ */ w.jsx("button", { type: "button", title: h("Dismiss"), "aria-label": h("Dismiss"), onClick: () => q(null), children: "×" })
        ] }),
        /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ w.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ w.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style"].map((g) => /* @__PURE__ */ w.jsx(
              "button",
              {
                "aria-pressed": vt === g,
                title: h(g === "item" ? "The selected item, or the file new plots take" : g === "page" ? "Page size, margins, pages and export" : g === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => xt(g),
                children: h(g === "item" ? "Items" : g === "page" ? "Page" : g === "iterate" ? "Iterate" : "Style")
              },
              g
            )) }),
            vt === "item" && /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
              /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                "File for new plots",
                /* @__PURE__ */ w.jsx(
                  "select",
                  {
                    value: nt,
                    onChange: (g) => ot(g.target.value),
                    children: r.map((g) => /* @__PURE__ */ w.jsx("option", { value: g.id, children: g.name }, g.id))
                  }
                )
              ] }),
              /* @__PURE__ */ w.jsx("p", { className: "gl-hint", children: "Placed plots keep their own file and hierarchy, independently of the Gating selection." }),
              xe.error && /* @__PURE__ */ w.jsx("p", { role: "alert", children: xe.error }),
              fe.length > 1 && /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-inspector", "aria-label": h("Selected layout items"), children: [
                /* @__PURE__ */ w.jsx("strong", { children: fc ? h("{count} items selected, one group", { count: fe.length }) : h("{count} items selected", { count: fe.length }) }),
                /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-item-actions", children: [
                  Vr > 1 && /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: In, title: h("One group: selected, moved, aligned and distributed together (Cmd-G)"), children: h("Group") }),
                  fe.some((g) => g.group) && /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Ga, title: h("Dissolve the group; the items stay where they are (Shift-Cmd-G)"), children: h("Ungroup") }),
                  /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Kr(ne), title: h("Copies of every selected item, 20 px down and right (Cmd-D)"), children: h("Duplicate") }),
                  /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Le(ne, "front"), title: h("Draw the selected items over every other"), children: h("Bring to front") }),
                  /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Le(ne, "back"), title: h("Draw the selected items under every other"), children: h("Send to back") }),
                  /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Pn(ne, !za), title: h("Lock or unlock the selected items"), children: h(za ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ur(ne), title: h("Remove the selected items (Delete)"), children: h("Remove") })
                ] }),
                /* @__PURE__ */ w.jsx("p", { className: "gl-hint", children: h("Align and distribute them with the toolbar; drag any of them to move them together; Cmd-G makes them one group.") })
              ] }),
              !fe.length && /* @__PURE__ */ w.jsx("p", { className: "gl-hint", children: h("Click an item to select it, drag empty page to select several, Shift-click to add or remove. Drag to move, Shift holds the direction; drag a corner handle or an edge to resize, Shift keeps the proportions, Option resizes from the centre; Cmd turns snapping off; Option-drag copies. Delete removes, arrows nudge (Shift: 10 px), Cmd-D duplicates, Cmd-A selects all, Cmd-] and Cmd-[ bring forward and send backward (Shift: to the front or back), Cmd-G groups and Shift-Cmd-G ungroups, Shift-Cmd-L locks, Cmd-Z undoes.") }),
              ct && /* @__PURE__ */ w.jsxs(
                "div",
                {
                  className: "gl-layout-inspector",
                  "aria-label": h("Selected layout item"),
                  children: [
                    /* @__PURE__ */ w.jsx("strong", { children: h("Selected") }),
                    /* @__PURE__ */ w.jsxs("label", { className: "gl-check", children: [
                      /* @__PURE__ */ w.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: ct.showFrame === !0,
                          onChange: (g) => Tt((S) => {
                            const R = S.items.find(
                              (j) => j.id === ct.id
                            );
                            R && (R.showFrame = g.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Kr([ct.id]), title: h("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: h("Duplicate") }),
                      /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Le([ct.id], "front"), title: h("Draw this item over every other"), children: h("Bring to front") }),
                      /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Le([ct.id], "back"), title: h("Draw this item under every other"), children: h("Send to back") }),
                      /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Ur([ct.id]), title: h("Remove this item from the page (Delete)"), children: h("Remove") })
                    ] }),
                    /* @__PURE__ */ w.jsxs("label", { className: "gl-check", title: h("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ w.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: ct.locked === !0,
                          onChange: (g) => Pn([ct.id], g.target.checked)
                        }
                      ),
                      h("Locked")
                    ] }),
                    /* @__PURE__ */ w.jsx("div", { className: "gl-layout-dimensions", children: ["x", "y", "width", "height"].map((g) => /* @__PURE__ */ w.jsxs("label", { children: [
                      Yh[g],
                      /* @__PURE__ */ w.jsx(
                        Me,
                        {
                          "aria-label": `Item ${g}`,
                          min: g === "width" || g === "height" ? Xc(ct.recipe.kind)[g] : 0,
                          integer: !0,
                          value: ct[g],
                          onCommit: (S) => Tt((R) => {
                            const j = R.items.find(
                              (F) => F.id === ct.id
                            );
                            j && (j[g] = S);
                          })
                        }
                      )
                    ] }, g)) }),
                    ct.recipe.kind === "text" ? /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Text"),
                        /* @__PURE__ */ w.jsx(
                          "input",
                          {
                            value: ct.recipe.text,
                            onChange: (g) => Rt(
                              (S) => S.kind === "text" ? { ...S, text: g.target.value } : S
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Reads from"),
                        /* @__PURE__ */ w.jsxs(
                          "select",
                          {
                            "aria-label": h("Reads from"),
                            value: ct.recipe.readsFrom ?? "",
                            onChange: (g) => Rt((S) => {
                              if (S.kind !== "text") return S;
                              const R = { ...S };
                              return g.target.value ? R.readsFrom = g.target.value : delete R.readsFrom, R;
                            }),
                            children: [
                              /* @__PURE__ */ w.jsx("option", { value: "", children: h("Nothing: plain text") }),
                              $.items.filter((g) => oe(g.recipe)).map((g) => /* @__PURE__ */ w.jsx("option", { value: g.id, children: We(g, Lt) }, g.id))
                            ]
                          }
                        )
                      ] }),
                      ct.recipe.readsFrom && /* @__PURE__ */ w.jsx("p", { className: "gl-hint", children: h("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: ii }) }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Font"),
                        /* @__PURE__ */ w.jsx(
                          Me,
                          {
                            min: 8,
                            max: 72,
                            integer: !0,
                            value: ct.recipe.fontSize,
                            onCommit: (g) => Rt(
                              (S) => S.kind === "text" ? { ...S, fontSize: g } : S
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ w.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ct.recipe.bold === !0,
                            onChange: (g) => Rt((S) => {
                              if (S.kind !== "text") return S;
                              const R = { ...S };
                              return g.target.checked ? R.bold = !0 : delete R.bold, R;
                            })
                          }
                        ),
                        h("Bold")
                      ] })
                    ] }) : ct.recipe.kind === "figure" ? /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
                      /* @__PURE__ */ w.jsx("p", { className: "gl-hint", children: h("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Figure page"),
                        /* @__PURE__ */ w.jsx(
                          Me,
                          {
                            "aria-label": h("Figure page"),
                            value: ct.recipe.page + 1,
                            min: 1,
                            integer: !0,
                            onCommit: (g) => Rt((S) => S.kind === "figure" ? { ...S, page: Math.max(0, g - 1) } : S)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        h("Title"),
                        /* @__PURE__ */ w.jsx(
                          "input",
                          {
                            placeholder: We(ct, Lt),
                            value: ct.recipe.title ?? "",
                            onChange: (g) => Rt((S) => S.kind === "figure" ? { ...S, title: g.target.value } : S)
                          }
                        )
                      ] }),
                      m && /* @__PURE__ */ w.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: h("Load this figure into the Illustration tab"),
                          onClick: () => m(structuredClone(ct.recipe.illustration)),
                          children: h("Edit in Illustration")
                        }
                      ),
                      /* @__PURE__ */ w.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !(v != null && v.figure),
                          title: h("Take the Illustration tab's current figure in place of this one"),
                          onClick: () => Rt(
                            (g) => g.kind === "figure" && v ? { ...g, illustration: structuredClone(v) } : g
                          ),
                          children: h("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : ct.recipe.kind === "proportions" ? /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
                      /* @__PURE__ */ w.jsx("p", { className: "gl-hint", children: h("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        h("Title"),
                        /* @__PURE__ */ w.jsx(
                          "input",
                          {
                            placeholder: We(ct, Lt),
                            value: ct.recipe.title ?? "",
                            onChange: (g) => Rt((S) => S.kind === "proportions" ? { ...S, title: g.target.value } : S)
                          }
                        )
                      ] }),
                      b && /* @__PURE__ */ w.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: h("Load this chart's settings into the Plotting tab"),
                          onClick: () => b(structuredClone(ct.recipe.settings)),
                          children: h("Edit in Plotting")
                        }
                      ),
                      /* @__PURE__ */ w.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          disabled: !x,
                          title: h("Take the Plotting tab's current chart in place of this one"),
                          onClick: () => {
                            const g = x == null ? void 0 : x();
                            g && Rt((S) => S.kind === "proportions" ? { ...S, settings: g } : S);
                          },
                          children: h("Replace with the current Plotting chart")
                        }
                      )
                    ] }) : ct.recipe.kind === "chart" ? /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Population"),
                        /* @__PURE__ */ w.jsx(
                          "select",
                          {
                            value: ct.recipe.populationId,
                            onChange: (g) => Rt((S) => S.kind === "chart" ? { ...S, populationId: g.target.value } : S),
                            children: Ko.map(({ popId: g, depth: S }) => {
                              var R;
                              return /* @__PURE__ */ w.jsxs("option", { value: g, children: [
                                " ".repeat(S * 2),
                                ((R = Nt == null ? void 0 : Nt.tree.populations[g]) == null ? void 0 : R.name) ?? g
                              ] }, g);
                            })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Statistic"),
                        /* @__PURE__ */ w.jsxs(
                          "select",
                          {
                            value: ct.recipe.statistic,
                            onChange: (g) => Rt((S) => {
                              var F;
                              if (S.kind !== "chart") return S;
                              const R = g.target.value, j = R === "median" && !S.channel ? (F = Nt == null ? void 0 : Nt.sample.channels[0]) == null ? void 0 : F.key : S.channel;
                              return { ...S, statistic: R, ...j ? { channel: j } : {} };
                            }),
                            children: [
                              /* @__PURE__ */ w.jsx("option", { value: "percent_of_parent", children: h("% of parent") }),
                              /* @__PURE__ */ w.jsx("option", { value: "percent_of_total", children: h("% of total") }),
                              /* @__PURE__ */ w.jsx("option", { value: "count", children: h("Events") }),
                              /* @__PURE__ */ w.jsx("option", { value: "median", children: h("Median of a channel") })
                            ]
                          }
                        )
                      ] }),
                      ct.recipe.statistic === "median" && /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Channel"),
                        /* @__PURE__ */ w.jsx(
                          "select",
                          {
                            value: ct.recipe.channel ?? "",
                            onChange: (g) => Rt((S) => S.kind === "chart" ? { ...S, channel: g.target.value } : S),
                            children: ((Nt == null ? void 0 : Nt.sample.channels) ?? []).map((g) => /* @__PURE__ */ w.jsx("option", { value: g.key, children: (Nt == null ? void 0 : Nt.sample.labelForKey(g.key)) ?? g.key }, g.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Files"),
                        /* @__PURE__ */ w.jsxs(
                          "select",
                          {
                            value: ct.recipe.files,
                            onChange: (g) => Rt((S) => S.kind === "chart" ? { ...S, files: g.target.value === "all" ? "all" : "checked" } : S),
                            children: [
                              /* @__PURE__ */ w.jsx("option", { value: "checked", children: h("Checked files") }),
                              /* @__PURE__ */ w.jsx("option", { value: "all", children: h("All files") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Group by"),
                        /* @__PURE__ */ w.jsxs(
                          "select",
                          {
                            value: ct.recipe.groupBy,
                            onChange: (g) => Rt((S) => S.kind === "chart" ? { ...S, groupBy: g.target.value } : S),
                            children: [
                              /* @__PURE__ */ w.jsx("option", { value: "", children: h("Each file") }),
                              o.map((g) => /* @__PURE__ */ w.jsx("option", { value: g, children: g }, g))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Chart"),
                        /* @__PURE__ */ w.jsxs(
                          "select",
                          {
                            value: ct.recipe.chartType,
                            onChange: (g) => Rt((S) => S.kind === "chart" ? { ...S, chartType: g.target.value } : S),
                            children: [
                              /* @__PURE__ */ w.jsx("option", { value: "bars", children: h("Bars (mean ± SD)") }),
                              /* @__PURE__ */ w.jsx("option", { value: "dots", children: h("Points with the mean") }),
                              /* @__PURE__ */ w.jsx("option", { value: "box", children: h("Boxes (median, quartiles)") })
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ w.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ct.recipe.showPoints,
                            onChange: (g) => Rt((S) => S.kind === "chart" ? { ...S, showPoints: g.target.checked } : S)
                          }
                        ),
                        h("Show each file as a point")
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-check", title: h("Wilcoxon rank-sum between two groups, Kruskal–Wallis among more; every group needs two files"), children: [
                        /* @__PURE__ */ w.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ct.recipe.test,
                            onChange: (g) => Rt((S) => S.kind === "chart" ? { ...S, test: g.target.checked } : S)
                          }
                        ),
                        h("Test between groups")
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        h("Title"),
                        /* @__PURE__ */ w.jsx(
                          "input",
                          {
                            placeholder: We(ct, Lt),
                            value: ct.recipe.title ?? "",
                            onChange: (g) => Rt((S) => S.kind === "chart" ? { ...S, title: g.target.value } : S)
                          }
                        )
                      ] })
                    ] }) : /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("FCS"),
                        /* @__PURE__ */ w.jsx(
                          "select",
                          {
                            value: ct.recipe.sampleId,
                            onChange: (g) => Rt((S) => {
                              if (S.kind === "text" || S.kind === "figure" || S.kind === "proportions") return S;
                              const R = Lt.find(
                                (F) => F.id === g.target.value
                              );
                              if (!R) return S;
                              const j = Nt && Qr(
                                {
                                  hierarchyId: Nt.tree.id,
                                  populationId: S.populationId
                                },
                                R.tree,
                                wr(c)
                              );
                              return {
                                ...S,
                                sampleId: R.id,
                                populationId: (j == null ? void 0 : j.id) ?? R.tree.root_population_id ?? ""
                              };
                            }),
                            children: Lt.map((g) => /* @__PURE__ */ w.jsx("option", { value: g.id, children: g.name }, g.id))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Population"),
                        /* @__PURE__ */ w.jsx(
                          "select",
                          {
                            value: ct.recipe.populationId,
                            onChange: (g) => Rt(
                              (S) => S.kind === "text" ? S : {
                                ...S,
                                populationId: g.target.value
                              }
                            ),
                            children: Ko.map(({ popId: g, depth: S }) => {
                              var R;
                              return /* @__PURE__ */ w.jsxs("option", { value: g, children: [
                                " ".repeat(S * 2),
                                ((R = Nt == null ? void 0 : Nt.tree.populations[g]) == null ? void 0 : R.name) ?? g
                              ] }, g);
                            })
                          }
                        )
                      ] }),
                      ct.recipe.kind !== "strategy" && /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
                        /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ w.jsx(
                            is,
                            {
                              label: h("X channel"),
                              value: ct.recipe.xChannel,
                              options: Uo,
                              onChange: (g) => Rt(
                                (S) => S.kind === "biplot" || S.kind === "histogram" ? { ...S, xChannel: g } : S
                              )
                            }
                          )
                        ] }),
                        ct.recipe.kind === "biplot" && /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ w.jsx(
                            is,
                            {
                              label: h("Y channel"),
                              value: ct.recipe.yChannel ?? "",
                              options: Uo,
                              onChange: (g) => Rt(
                                (S) => S.kind === "biplot" ? { ...S, yChannel: g } : S
                              )
                            }
                          )
                        ] })
                      ] }),
                      ct.recipe.kind === "strategy" && /* @__PURE__ */ w.jsxs("label", { className: "gl-check", children: [
                        /* @__PURE__ */ w.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ct.recipe.fullPath,
                            onChange: (g) => Rt(
                              (S) => S.kind === "strategy" ? {
                                ...S,
                                fullPath: g.target.checked
                              } : S
                            )
                          }
                        ),
                        h("Full path from root")
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                        h("Display"),
                        /* @__PURE__ */ w.jsxs(
                          "select",
                          {
                            value: ct.recipe.displayMode,
                            onChange: (g) => Rt(
                              (S) => S.kind === "text" ? S : {
                                ...S,
                                displayMode: g.target.value
                              }
                            ),
                            children: [
                              /* @__PURE__ */ w.jsx("option", { value: "pseudocolor", children: h("Pseudocolor") }),
                              /* @__PURE__ */ w.jsx("option", { value: "scatter", children: h("Scatter") }),
                              /* @__PURE__ */ w.jsx("option", { value: "contour", children: h("Contour") })
                            ]
                          }
                        )
                      ] }),
                      gt.mode !== "off" && /* @__PURE__ */ w.jsxs("label", { className: "gl-check", title: gt.mode === "populations" ? h("Drawn once per population of the iteration, for that population; unticked, it shows its own population on every page") : h("Drawn once per file of the iteration, for that file; unticked, it shows this file on every page"), children: [
                        /* @__PURE__ */ w.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ct.recipe.iterated === !0,
                            onChange: (g) => Rt(
                              (S) => S.kind === "text" ? S : { ...S, iterated: g.target.checked }
                            )
                          }
                        ),
                        h("Follows the iteration")
                      ] }),
                      /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: h("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: ii }), children: [
                        h("Title"),
                        /* @__PURE__ */ w.jsx(
                          "input",
                          {
                            placeholder: dc || We(ct, Lt),
                            value: ct.recipe.title ?? "",
                            onChange: (g) => Rt(
                              (S) => S.kind === "text" ? S : { ...S, title: g.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ w.jsxs("summary", { children: [
                          h("Style"),
                          Object.keys(ct.recipe.style ?? {}).length > 0 ? ` · ${h("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ w.jsx(
                          dl,
                          {
                            effective: Xa($, ct.recipe),
                            own: ct.recipe.style ?? {},
                            onChange: (g) => Rt(
                              (S) => oe(S) ? { ...S, style: ds({ ...S.style, ...g }) } : S
                            )
                          }
                        ),
                        Object.keys(ct.recipe.style ?? {}).length > 0 && /* @__PURE__ */ w.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: h("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => Rt((g) => {
                              if (!oe(g)) return g;
                              const { style: S, ...R } = g;
                              return R;
                            }),
                            children: h("Follow the sheet")
                          }
                        )
                      ] }),
                      /* @__PURE__ */ w.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          onClick: () => D(
                            ct.recipe
                          ),
                          children: h("Open in Gating")
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            vt === "page" && /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
              /* @__PURE__ */ w.jsx("h3", { children: h("Page") }),
              /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                h("Size"),
                /* @__PURE__ */ w.jsxs(
                  "select",
                  {
                    value: $.page.preset,
                    onChange: (g) => ar(qc(g.target.value, $.page.orientation, $.page)),
                    children: [
                      Object.entries(Hc).map(([g, S]) => /* @__PURE__ */ w.jsx("option", { value: g, children: S.label }, g)),
                      /* @__PURE__ */ w.jsx("option", { value: "custom", children: h("Custom") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                h("Orientation"),
                /* @__PURE__ */ w.jsxs(
                  "select",
                  {
                    value: $.page.orientation,
                    onChange: (g) => ar({ ...$.page, orientation: g.target.value }),
                    children: [
                      /* @__PURE__ */ w.jsx("option", { value: "portrait", children: h("Portrait") }),
                      /* @__PURE__ */ w.jsx("option", { value: "landscape", children: h("Landscape") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ w.jsx("div", { className: "gl-layout-dimensions", children: ["width", "height"].map((g) => /* @__PURE__ */ w.jsxs("label", { children: [
                h(g === "width" ? "Width (mm)" : "Height (mm)"),
                /* @__PURE__ */ w.jsx(
                  Me,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": h(g === "width" ? "Width (mm)" : "Height (mm)"),
                    value: Yi($.page)[g === "width" ? "widthMm" : "heightMm"],
                    onCommit: (S) => {
                      const R = $.page.orientation === "landscape", j = g === "width" == !R ? "widthMm" : "heightMm";
                      ar({ ...$.page, preset: "custom", [j]: S });
                    }
                  }
                )
              ] }, g)) }),
              /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                h("Margin (mm)"),
                /* @__PURE__ */ w.jsx(
                  Me,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: $.page.marginMm,
                    onCommit: (g) => ar({ ...$.page, marginMm: g })
                  }
                )
              ] }),
              /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ w.jsxs("label", { children: [
                  h("Pages across"),
                  /* @__PURE__ */ w.jsx(Me, { min: 1, max: os, step: 1, integer: !0, "aria-label": h("Pages across"), value: $.page.columns, onCommit: (g) => ar({ ...$.page, columns: g }) })
                ] }),
                /* @__PURE__ */ w.jsxs("label", { children: [
                  h("Pages down"),
                  /* @__PURE__ */ w.jsx(Me, { min: 1, max: os, step: 1, integer: !0, "aria-label": h("Pages down"), value: $.page.rows, onCommit: (g) => ar({ ...$.page, rows: g }) })
                ] })
              ] }),
              /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: wc, disabled: !$.items.length, title: h("Make the page a custom size that holds every item inside the margin, as one page"), children: h("Fit page to content") }),
                /* @__PURE__ */ w.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Dc, disabled: !$.items.length, title: h("Scale and centre every item, as one group, to fill the first page inside its margin"), children: h("Fit content to page") })
              ] }),
              /* @__PURE__ */ w.jsx("h3", { children: h("Export") }),
              /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                h("Format"),
                /* @__PURE__ */ w.jsxs("select", { value: Gt, onChange: (g) => re(g.target.value), children: [
                  /* @__PURE__ */ w.jsx("option", { value: "pdf", children: h("PDF · the page at its size") }),
                  /* @__PURE__ */ w.jsx("option", { value: "svg", children: h("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ w.jsx("option", { value: "png", children: h("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                h("Resolution (dpi)"),
                /* @__PURE__ */ w.jsx(
                  Me,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: $.page.dpi,
                    onCommit: (g) => ar({ ...$.page, dpi: g })
                  }
                )
              ] }),
              /* @__PURE__ */ w.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void $o(), disabled: Ft || !$.items.length, children: h(Ft ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ w.jsx("p", { className: "gl-hint", children: h("The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            vt === "iterate" && /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
              /* @__PURE__ */ w.jsx("h3", { children: h("Iterate") }),
              /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                h("Draw the sheet"),
                /* @__PURE__ */ w.jsxs(
                  "select",
                  {
                    value: gt.mode,
                    onChange: (g) => ir({ ...gt, mode: g.target.value === "files" ? "files" : g.target.value === "populations" ? "populations" : "off" }),
                    children: [
                      /* @__PURE__ */ w.jsx("option", { value: "off", children: h("Once") }),
                      /* @__PURE__ */ w.jsx("option", { value: "files", children: h("Once per file") }),
                      /* @__PURE__ */ w.jsx("option", { value: "populations", children: h("Once per population") })
                    ]
                  }
                )
              ] }),
              gt.mode !== "off" && /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
                gt.mode === "populations" && /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                  h("Populations"),
                  /* @__PURE__ */ w.jsxs(
                    "select",
                    {
                      value: ((Qo = gt.populations) == null ? void 0 : Qo.kind) === "branch" ? gt.populations.populationId : "all",
                      onChange: (g) => ir({
                        ...gt,
                        populations: g.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: g.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ w.jsx("option", { value: "all", children: h("All in the tree") }),
                        (Jt ? na(Jt.tree.populations, Jt.tree.root_population_id ?? "") : []).filter(({ popId: g }) => g !== (Jt == null ? void 0 : Jt.tree.root_population_id)).map(({ popId: g, depth: S }) => {
                          var R;
                          return /* @__PURE__ */ w.jsxs("option", { value: g, children: [
                            " ".repeat(S * 2),
                            h("Under {name}", { name: ((R = Jt == null ? void 0 : Jt.tree.populations[g]) == null ? void 0 : R.name) ?? g })
                          ] }, g);
                        })
                      ]
                    }
                  )
                ] }),
                gt.mode === "files" && /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                  h("Files"),
                  /* @__PURE__ */ w.jsxs("select", { value: kc, onChange: (g) => ir({ ...gt, source: Tc(g.target.value) }), children: [
                    /* @__PURE__ */ w.jsx("option", { value: "checked", children: h("Checked files") }),
                    /* @__PURE__ */ w.jsx("option", { value: "all", children: h("All files") }),
                    a.map((g) => /* @__PURE__ */ w.jsx("option", { value: `group:${g.id}`, children: h("Group {name}", { name: g.name }) }, g.id)),
                    o.flatMap(
                      (g) => Mc(g).map((S) => /* @__PURE__ */ w.jsxs("option", { value: `meta:${g}=${S}`, children: [
                        g,
                        " = ",
                        S
                      ] }, `${g}=${S}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                  h("Arrangement"),
                  /* @__PURE__ */ w.jsxs(
                    "select",
                    {
                      value: gt.arrangement.kind,
                      onChange: (g) => ir({
                        ...gt,
                        arrangement: g.target.value === "tiles" ? { kind: "tiles", rows: 2, columns: 2, order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ w.jsx("option", { value: "page-per-unit", children: gt.mode === "populations" ? h("One page per population") : h("One page per file") }),
                        /* @__PURE__ */ w.jsx("option", { value: "tiles", children: h("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                gt.arrangement.kind === "tiles" && /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
                  /* @__PURE__ */ w.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((g) => /* @__PURE__ */ w.jsxs("label", { children: [
                    h(g === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ w.jsx(
                      Me,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": h(g === "columns" ? "Tiles across" : "Tiles down"),
                        value: gt.arrangement.kind === "tiles" ? gt.arrangement[g] : 1,
                        onCommit: (S) => {
                          gt.arrangement.kind === "tiles" && ir({ ...gt, arrangement: { ...gt.arrangement, [g]: S } });
                        }
                      }
                    )
                  ] }, g)) }),
                  /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                    h("Order"),
                    /* @__PURE__ */ w.jsxs(
                      "select",
                      {
                        value: gt.arrangement.order,
                        onChange: (g) => gt.arrangement.kind === "tiles" && ir({ ...gt, arrangement: { ...gt.arrangement, order: g.target.value === "column-major" ? "column-major" : "row-major" } }),
                        children: [
                          /* @__PURE__ */ w.jsx("option", { value: "row-major", children: h("Across, then down") }),
                          /* @__PURE__ */ w.jsx("option", { value: "column-major", children: h("Down, then across") })
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                    h("Gap between tiles (px)"),
                    /* @__PURE__ */ w.jsx(
                      Me,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: gt.arrangement.gap,
                        onCommit: (g) => {
                          gt.arrangement.kind === "tiles" && ir({ ...gt, arrangement: { ...gt.arrangement, gap: g } });
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ w.jsx("p", { className: "gl-hint", children: gt.mode === "populations" ? h("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: yr.length, of: (Jt == null ? void 0 : Jt.name) ?? "the file", pages: Math.max(1, Et.length) }) : h("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: yr.length, pages: Math.max(1, Et.length) }) })
              ] })
            ] }),
            vt === "style" && $ && /* @__PURE__ */ w.jsxs(w.Fragment, { children: [
              /* @__PURE__ */ w.jsx("h3", { children: h("Style") }),
              /* @__PURE__ */ w.jsx("p", { className: "gl-hint", children: h("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                h("Plot titles"),
                /* @__PURE__ */ w.jsxs(
                  "select",
                  {
                    "aria-label": h("Plot titles"),
                    value: Xr ? "custom" : ((ts = ra.find((g) => g.template === ($.titleTemplate ?? ""))) == null ? void 0 : ts.id) ?? "custom",
                    onChange: (g) => {
                      const S = ra.find((R) => R.id === g.target.value);
                      Oa(!S), Tt((R) => {
                        var j;
                        S ? S.template ? R.titleTemplate = S.template : delete R.titleTemplate : R.titleTemplate = ((j = R.titleTemplate) == null ? void 0 : j.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      ra.map((g) => /* @__PURE__ */ w.jsx("option", { value: g.id, children: h(g.label) }, g.id)),
                      /* @__PURE__ */ w.jsx("option", { value: "custom", children: h("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const g = $.items.filter((S) => Oo(S));
                return g.length ? /* @__PURE__ */ w.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  h("{count} plots keep a title of their own, so the template does not reach them.", { count: g.length }),
                  " ",
                  /* @__PURE__ */ w.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: h("Drop those plots' own titles so every plot on the sheet follows the template"),
                      onClick: () => Tt((S) => {
                        for (const R of S.items) oe(R.recipe) && delete R.recipe.title;
                      }),
                      children: h("Use the template for all")
                    }
                  )
                ] }) : null;
              })(),
              (Xr || !ra.some((g) => g.template === ($.titleTemplate ?? ""))) && (() => {
                var bt;
                const g = $.titleTemplate ?? "", S = bh(g), R = (S == null ? void 0 : S.tokens) ?? [], j = (S == null ? void 0 : S.separator) ?? Hr, F = (lt) => {
                  var Ot;
                  return ((Ot = To.find((ye) => ye.token === lt)) == null ? void 0 : Ot.label) ?? lt;
                }, J = (lt) => Tt((Ot) => {
                  Ot.titleTemplate = ll(lt, j);
                }), K = qt.items.find((lt) => oe(lt.recipe)), it = K && oe(K.recipe) ? Sa(g, Oe(K.recipe, K.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ w.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": h("Title builder"), children: [
                  /* @__PURE__ */ w.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": h("Fields in the title"), children: [
                    R.length === 0 && /* @__PURE__ */ w.jsx("span", { className: "gl-hint", children: h(S === null && g ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    R.map((lt, Ot) => /* @__PURE__ */ w.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": h("Remove {field}", { field: F(lt) }),
                        title: h("Remove {field} from the title", { field: F(lt) }),
                        onClick: () => J(R.filter((ye, or) => or !== Ot)),
                        children: [
                          F(lt),
                          " ×"
                        ]
                      },
                      `${lt}-${Ot}`
                    ))
                  ] }),
                  /* @__PURE__ */ w.jsx("div", { className: "gl-title-builder-fields", "aria-label": h("Fields to add"), children: To.map((lt) => /* @__PURE__ */ w.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-chip",
                      "aria-label": h("Add {field}", { field: lt.label }),
                      title: lt.token,
                      onClick: () => J([...R, lt.token]),
                      children: lt.label
                    },
                    lt.token
                  )) }),
                  /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline", children: [
                    h("Between fields"),
                    /* @__PURE__ */ w.jsx(
                      "select",
                      {
                        "aria-label": h("Separator"),
                        value: ((bt = oi.find((lt) => lt.value === j)) == null ? void 0 : bt.id) ?? "dot",
                        onChange: (lt) => {
                          var ye;
                          const Ot = ((ye = oi.find((or) => or.id === lt.target.value)) == null ? void 0 : ye.value) ?? " · ";
                          cc(Ot), R.length && Tt((or) => {
                            or.titleTemplate = ll(R, Ot);
                          });
                        },
                        children: oi.map((lt) => /* @__PURE__ */ w.jsx("option", { value: lt.id, children: h(lt.label) }, lt.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ w.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                    h("Template"),
                    /* @__PURE__ */ w.jsx(
                      "input",
                      {
                        "aria-label": h("Title template"),
                        value: g,
                        onChange: (lt) => Tt((Ot) => {
                          Ot.titleTemplate = lt.target.value;
                        })
                      }
                    )
                  ] }),
                  it && /* @__PURE__ */ w.jsx("div", { className: "gl-hint gl-title-builder-preview", children: h("First plot reads: {title}", { title: it }) })
                ] });
              })(),
              /* @__PURE__ */ w.jsx("p", { className: "gl-hint", children: h(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise.`, { list: ii }) }),
              /* @__PURE__ */ w.jsx(
                dl,
                {
                  effective: Xa($),
                  own: $.style ?? {},
                  onChange: (g) => Tt((S) => {
                    S.style = ds({ ...S.style, ...g });
                  })
                }
              ),
              Object.keys($.style ?? {}).length > 0 && /* @__PURE__ */ w.jsx(
                "button",
                {
                  type: "button",
                  className: "gl-mini-btn",
                  onClick: () => Tt((g) => {
                    delete g.style;
                  }),
                  children: h("Reset to defaults")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ w.jsx(Vc, { menu: pc, onClose: () => Ba(null) }),
          /* @__PURE__ */ w.jsxs(
            "div",
            {
              ref: (g) => {
                At.current = g, W(g);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": h("Layout page"),
              onKeyDown: Rc,
              children: [
                !U && B && /* @__PURE__ */ w.jsx(
                  ph,
                  {
                    ref: tt,
                    container: B,
                    dragContainer: B,
                    selectableTargets: [".gl-layout-item"],
                    selectByClick: !0,
                    selectFromInside: !1,
                    continueSelect: !1,
                    toggleContinueSelect: ["shift"],
                    hitRate: 0,
                    ratio: 0,
                    dragCondition: (g) => {
                      var S, R, j;
                      return !((j = (R = (S = g.inputEvent) == null ? void 0 : S.target) == null ? void 0 : R.closest) != null && j.call(R, "textarea, input, select, button"));
                    },
                    onDragStart: Sc,
                    onSelectEnd: Cc
                  }
                ),
                /* @__PURE__ */ w.jsx(
                  "div",
                  {
                    className: "gl-layout-zoom",
                    style: { width: $.width * ft, height: $.height * ft },
                    children: /* @__PURE__ */ w.jsxs(
                      "section",
                      {
                        ref: (g) => {
                          me.current = g, N(g);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": $.name,
                        onContextMenu: hc,
                        style: { width: $.width, height: $.height, transform: `scale(${ft})` },
                        children: [
                          oa($.page).map((g) => {
                            const S = fi($.page), R = as($.page.marginMm);
                            return /* @__PURE__ */ w.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: g.x, top: g.y, width: S.width, height: S.height }, children: R > 0 && /* @__PURE__ */ w.jsx("div", { className: "gl-layout-page-margin", style: { inset: R } }) }, `${g.row}-${g.column}`);
                          }),
                          qt.items.length === 0 && /* @__PURE__ */ w.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ w.jsx("strong", { children: h("Blank layout") }),
                            /* @__PURE__ */ w.jsx("span", { children: h(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          qt.items.map((g) => /* @__PURE__ */ w.jsx(
                            Jh,
                            {
                              item: g,
                              templateText: (() => {
                                const S = $.items.find((R) => R.id === g.templateId);
                                return (S == null ? void 0 : S.recipe.kind) === "text" ? S.recipe.text : void 0;
                              })(),
                              selected: _.includes(g.id),
                              samples: Lt,
                              state: c,
                              globalScales: f,
                              dataRevision: E,
                              densityColorPower: C,
                              style: Xa($, g.recipe),
                              titleTemplate: Oo(g, g.templateSampleId) || Ro,
                              describe: Oe,
                              checkedSampleIds: n,
                              metadataById: nr,
                              files: r,
                              sources: xe.sources,
                              divisionProfiles: y,
                              canvasScale: Mt,
                              onTextChange: (S, R) => {
                                if (!S.trim()) {
                                  Ur([g.templateId]);
                                  return;
                                }
                                Tt((j) => {
                                  const F = j.items.find(
                                    (J) => J.id === g.templateId
                                  );
                                  (F == null ? void 0 : F.recipe.kind) === "text" && (F.recipe.text = S, R > 0 && (F.height = Math.max(F.height, Math.ceil(R) + 4)));
                                });
                              },
                              onTextFocus: () => {
                                (!_.includes(g.id) || _.length > 1) && M([g.id]);
                              },
                              textEditing: T === g.id,
                              onTextEditStart: () => {
                                M([g.id]), k(g.id);
                              },
                              onIsolate: g.group && _.includes(g.id) && _.length > 1 ? () => M([g.id]) : void 0,
                              onTextEditEnd: () => {
                                var S;
                                k((R) => R === g.id ? null : R), (S = At.current) == null || S.focus({ preventScroll: !0 });
                              }
                            },
                            g.id
                          )),
                          !U && /* @__PURE__ */ w.jsx(
                            Uv,
                            {
                              ref: G,
                              target: Fe.length === 1 ? Fe[0] : Fe,
                              zoom: 1 / ft,
                              origin: !1,
                              checkInput: !0,
                              passDragArea: !0,
                              draggable: !0,
                              resizable: !0,
                              useMutationObserver: !0,
                              useResizeObserver: !0,
                              keepRatio: wt.shift,
                              throttleDragRotate: wt.shift ? 45 : 0,
                              snappable: !wt.meta,
                              snapThreshold: 6,
                              isDisplaySnapDigit: !1,
                              isDisplayInnerSnapDigit: !1,
                              snapDirections: fl,
                              elementSnapDirections: fl,
                              elementGuidelines: X,
                              verticalGuidelines: Ho.vertical,
                              horizontalGuidelines: Ho.horizontal,
                              snapGridWidth: A ? cl : 0,
                              snapGridHeight: A ? cl : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              individualGroupable: $r,
                              container: $r ? I : void 0,
                              onDragStart: bc,
                              onDrag: Wo,
                              onDragEnd: (g) => {
                                const S = Yo(g);
                                Nn(S, g.lastEvent, g.isDrag, () => On(S, !!g.datas.alt));
                              },
                              onDragGroupStart: (g) => {
                                var S;
                                g.datas.alt = !!((S = g.inputEvent) != null && S.altKey), An([...g.targets ?? []], g.datas.alt ? Fo(g.targets ?? []) : void 0);
                              },
                              onDragGroup: (g) => g.events.forEach(Wo),
                              onDragGroupEnd: (g) => Nn(g.targets, g.lastEvent, g.isDrag, () => On(g.targets, !!g.datas.alt)),
                              onResizeStart: (g) => {
                                var S;
                                An([g.target]), (S = g.inputEvent) != null && S.altKey && g.setFixedDirection([0, 0]);
                              },
                              onResize: Xo,
                              onResizeEnd: (g) => Nn([g.target], g.lastEvent, g.isDrag, () => On([g.target], !1)),
                              onResizeGroupStart: (g) => {
                                var S;
                                An([...g.targets ?? []]), (S = g.inputEvent) != null && S.altKey && g.events.forEach((R) => R.setFixedDirection([0, 0]));
                              },
                              onResizeGroup: (g) => g.events.forEach(Xo),
                              onResizeGroupEnd: (g) => Nn(g.targets, g.lastEvent, g.isDrag, () => On(g.targets, !1)),
                              onClick: (g) => {
                                var S, R;
                                if (Tn.current) {
                                  Tn.current = !1;
                                  return;
                                }
                                ((S = g.inputEvent) != null && S.shiftKey || $r) && ((R = tt.current) == null || R.clickTarget(g.inputEvent, g.inputTarget));
                              },
                              onClickGroup: (g) => {
                                var S;
                                (S = tt.current) == null || S.clickTarget(g.inputEvent, g.inputTarget);
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
  rg as LayoutTab,
  Kh as isBakedTitle
};
