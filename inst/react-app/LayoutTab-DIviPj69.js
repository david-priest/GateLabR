import { a as rt, t as la, w as Hc, s as $c, z as os, x as ss, y as Ha, A as ls, B as $i, E as qc, G as pi, H as tn, I as Vc, f as Uc, J as Kc, K as Zc, L as Jc, M as ia, N as us, O as Sl, P as Qc, Q as oe, j as C, R as Mr, T as ur, U as tf, u as bn, V as ef, W as rf, X as nf, Y as cs, Z as af, _ as ke, $ as of, S as fs, a0 as $a, a1 as sf, a2 as lf, a3 as ds, a4 as uf, a5 as Cl, a6 as cf, a7 as Ln, a8 as ps, a9 as ff, aa as df, ab as pf, ac as vf, ad as hf, ae as gf, af as mf, ag as vs, ah as hs, ai as xf, aj as yf, ak as bf, al as gs, am as Sf, an as Cf, ao as Ef, ap as ms, aq as wf, ar as Df, l as xs, as as _f, at as Mf, au as kf, av as Tf, aw as If, ax as ys } from "./embed-DA6AQhjz.js";
function qi(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return !0;
  return !1;
}
function El(t, e) {
  for (var r = t.length, n = 0; n < r; ++n)
    if (e(t[n], n))
      return t[n];
  return null;
}
function wl(t) {
  var e = t;
  if (typeof e > "u") {
    if (typeof navigator > "u" || !navigator)
      return "";
    e = navigator.userAgent || "";
  }
  return e.toLowerCase();
}
function Vi(t, e) {
  try {
    return new RegExp(t, "g").exec(e);
  } catch {
    return null;
  }
}
function Rf() {
  if (typeof navigator > "u" || !navigator || !navigator.userAgentData)
    return !1;
  var t = navigator.userAgentData, e = t.brands || t.uaList;
  return !!(e && e.length);
}
function Of(t, e) {
  var r = Vi("(" + t + ")((?:\\/|\\s|:)([0-9|\\.|_]+))", e);
  return r ? r[3] : "";
}
function vi(t) {
  return t.replace(/_/g, ".");
}
function rn(t, e) {
  var r = null, n = "-1";
  return qi(t, function(a) {
    var i = Vi("(" + a.test + ")((?:\\/|\\s|:)([0-9|\\.|_]+))?", e);
    return !i || a.brand ? !1 : (r = a, n = i[3] || "-1", a.versionAlias ? n = a.versionAlias : a.versionTest && (n = Of(a.versionTest.toLowerCase(), e) || n), n = vi(n), !0);
  }), {
    preset: r,
    version: n
  };
}
function Wn(t, e) {
  var r = {
    brand: "",
    version: "-1"
  };
  return qi(t, function(n) {
    var a = Dl(e, n);
    return a ? (r.brand = n.id, r.version = n.versionAlias || a.version, r.version !== "-1") : !1;
  }), r;
}
function Dl(t, e) {
  return El(t, function(r) {
    var n = r.brand;
    return Vi("" + e.test, n.toLowerCase());
  });
}
var _l = [{
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
}], Ml = [{
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
}], hi = [{
  test: "applewebkit",
  id: "webkit",
  versionTest: "applewebkit|safari"
}], kl = [{
  test: "(?=(iphone|ipad))(?!(.*version))",
  id: "webview"
}, {
  test: "(?=(android|iphone|ipad))(?=.*(naver|daum|; wv))",
  id: "webview"
}, {
  // test webview
  test: "webview",
  id: "webview"
}], Tl = [{
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
function Il(t) {
  return !!rn(kl, t).preset;
}
function Pf(t) {
  var e = wl(t), r = !!/mobi/g.exec(e), n = {
    name: "unknown",
    version: "-1",
    majorVersion: -1,
    webview: Il(e),
    chromium: !1,
    chromiumVersion: "-1",
    webkit: !1,
    webkitVersion: "-1"
  }, a = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  }, i = rn(_l, e), o = i.preset, s = i.version, l = rn(Tl, e), u = l.preset, c = l.version, f = rn(Ml, e);
  if (n.chromium = !!f.preset, n.chromiumVersion = f.version, !n.chromium) {
    var d = rn(hi, e);
    n.webkit = !!d.preset, n.webkitVersion = d.version;
  }
  return u && (a.name = u.id, a.version = c, a.majorVersion = parseInt(c, 10)), o && (n.name = o.id, n.version = s, n.webview && a.name === "ios" && n.name !== "safari" && (n.webview = !1)), n.majorVersion = parseInt(n.version, 10), {
    browser: n,
    os: a,
    isMobile: r,
    isHints: !1
  };
}
function Nf(t) {
  var e = navigator.userAgentData, r = (e.uaList || e.brands).slice(), n = e.mobile || !1, a = r[0], i = (e.platform || navigator.platform).toLowerCase(), o = {
    name: a.brand,
    version: a.version,
    majorVersion: -1,
    webkit: !1,
    webkitVersion: "-1",
    chromium: !1,
    chromiumVersion: "-1",
    webview: !!Wn(kl, r).brand || Il(wl())
  }, s = {
    name: "unknown",
    version: "-1",
    majorVersion: -1
  };
  o.webkit = !o.chromium && qi(hi, function(d) {
    return Dl(r, d);
  });
  var l = Wn(Ml, r);
  if (o.chromium = !!l.brand, o.chromiumVersion = l.version || "-1", !o.chromium) {
    var u = Wn(hi, r);
    o.webkit = !!u.brand, o.webkitVersion = u.version || "-1";
  }
  var c = El(Tl, function(d) {
    return new RegExp("" + d.test, "g").exec(i);
  });
  s.name = c ? c.id : "";
  {
    var f = Wn(_l, r);
    o.name = f.brand || o.name, o.version = f.brand && t ? t.uaFullVersion : f.version;
  }
  return o.webkit && (s.name = n ? "ios" : "mac"), s.name === "ios" && o.webview && (o.version = "-1"), s.version = vi(s.version), o.version = vi(o.version), s.majorVersion = parseInt(s.version, 10), o.majorVersion = parseInt(o.version, 10), {
    browser: o,
    os: s,
    isMobile: n,
    isHints: !0
  };
}
function zf(t) {
  return Rf() ? Nf() : Pf(t);
}
function Af(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  return e.map(function(n) {
    return n.split(" ").map(function(a) {
      return a ? "" + t + a : "";
    }).join(" ");
  }).join(" ");
}
function jf(t, e) {
  return e.replace(/([^}{]*){/gm, function(r, n) {
    return n.replace(/\.([^{,\s\d.]+)/g, "." + t + "$1") + "{";
  });
}
function rr(t, e) {
  return function(r) {
    r && (t[e] = r);
  };
}
function Rl(t, e, r) {
  return function(n) {
    n && (t[e][r] = n);
  };
}
function Bf(t, e) {
  return function(r) {
    var n = r.prototype;
    t.forEach(function(a) {
      e(n, a);
    });
  };
}
function Ol(t, e) {
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
var Gf = "function", Ff = "object", Lf = "string", Wf = "number", Ui = "undefined", Pl = typeof window !== Ui, Yf = typeof document !== Ui && document, Xf = [{
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
}], Jt = 1e-7, Yn = {
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
function Hf() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function ua(t, e, r, n) {
  return (t * n + e * r) / (r + n);
}
function Ki(t) {
  return typeof t === Ui;
}
function me(t) {
  return t && typeof t === Ff;
}
function Yt(t) {
  return Array.isArray(t);
}
function we(t) {
  return typeof t === Lf;
}
function hn(t) {
  return typeof t === Wf;
}
function wa(t) {
  return typeof t === Gf;
}
function $f(t, e) {
  var r = t === "" || t == " ", n = e === "" || e == " ";
  return n && r || t === e;
}
function Nl(t, e, r, n, a) {
  var i = Zi(t, e, r);
  return i ? r : qf(t, e, r + 1, n, a);
}
function Zi(t, e, r) {
  if (!t.ignore)
    return null;
  var n = e.slice(Math.max(r - 3, 0), r + 3).join("");
  return new RegExp(t.ignore).exec(n);
}
function qf(t, e, r, n, a) {
  for (var i = function(u) {
    var c = e[u].trim();
    if (c === t.close && !Zi(t, e, u))
      return {
        value: u
      };
    var f = u, d = xe(a, function(p) {
      var h = p.open;
      return h === c;
    });
    if (d && (f = Nl(d, e, u, n, a)), f === -1)
      return o = u, "break";
    u = f, o = u;
  }, o, s = r; s < n; ++s) {
    var l = i(s);
    if (s = o, typeof l == "object") return l.value;
    if (l === "break") break;
  }
  return -1;
}
function Ji(t, e) {
  var r = we(e) ? {
    separator: e
  } : e, n = r.separator, a = n === void 0 ? "," : n, i = r.isSeparateFirst, o = r.isSeparateOnlyOpenClose, s = r.isSeparateOpenClose, l = s === void 0 ? o : s, u = r.openCloseCharacters, c = u === void 0 ? Xf : u, f = c.map(function(M) {
    var m = M.open, I = M.close;
    return m === I ? m : m + "|" + I;
  }).join("|"), d = "(\\s*" + a + "\\s*|" + f + "|\\s+)", p = new RegExp(d, "g"), h = t.split(p).filter(function(M) {
    return M && M !== "undefined";
  }), g = h.length, x = [], y = [];
  function b() {
    return y.length ? (x.push(y.join("")), y = [], !0) : !1;
  }
  for (var w = function(M) {
    var m = h[M].trim(), I = M, k = xe(c, function(R) {
      var A = R.open;
      return A === m;
    }), z = xe(c, function(R) {
      var A = R.close;
      return A === m;
    });
    if (k) {
      if (I = Nl(k, h, M, g, c), I !== -1 && l)
        return b() && i || (x.push(h.slice(M, I + 1).join("")), M = I, i) ? (E = M, "break") : (E = M, "continue");
    } else if (z && !Zi(z, h, M)) {
      var P = Hf(c);
      return P.splice(c.indexOf(z), 1), {
        value: Ji(t, {
          separator: a,
          isSeparateFirst: i,
          isSeparateOnlyOpenClose: o,
          isSeparateOpenClose: l,
          openCloseCharacters: P
        })
      };
    } else if ($f(m, a) && !o)
      return b(), i ? (E = M, "break") : (E = M, "continue");
    I === -1 && (I = g - 1), y.push(h.slice(M, I + 1).join("")), M = I, E = M;
  }, E, _ = 0; _ < g; ++_) {
    var D = w(_);
    if (_ = E, typeof D == "object") return D.value;
    if (D === "break") break;
  }
  return y.length && x.push(y.join("")), x;
}
function nr(t) {
  return Ji(t, "");
}
function vr(t) {
  return Ji(t, ",");
}
function zl(t) {
  var e = /([^(]*)\(([\s\S]*)\)([\s\S]*)/g.exec(t);
  return !e || e.length < 4 ? {} : {
    prefix: e[1],
    value: e[2],
    suffix: e[3]
  };
}
function hr(t) {
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
function gi(t) {
  return t.replace(/[\s-_]+([^\s-_])/g, function(e, r) {
    return r.toUpperCase();
  });
}
function Vf(t, e) {
  return t.replace(/([a-z])([A-Z])/g, function(r, n, a) {
    return "" + n + e + a.toLowerCase();
  });
}
function gn() {
  return Date.now ? Date.now() : (/* @__PURE__ */ new Date()).getTime();
}
function Ue(t, e, r) {
  r === void 0 && (r = -1);
  for (var n = t.length, a = 0; a < n; ++a)
    if (e(t[a], a, t))
      return a;
  return r;
}
function xe(t, e, r) {
  var n = Ue(t, e);
  return n > -1 ? t[n] : r;
}
var Al = /* @__PURE__ */ (function() {
  var t = gn(), e = Pl && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame);
  return e ? e.bind(window) : function(r) {
    var n = gn(), a = setTimeout(function() {
      r(n - t);
    }, 1e3 / 60);
    return a;
  };
})(), Uf = /* @__PURE__ */ (function() {
  var t = Pl && (window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.mozCancelAnimationFrame || window.msCancelAnimationFrame);
  return t ? t.bind(window) : function(e) {
    clearTimeout(e);
  };
})();
function Xr(t) {
  return Object.keys(t);
}
function Pt(t, e) {
  var r = hr(t), n = r.value, a = r.unit;
  if (me(e)) {
    var i = e[a];
    if (i) {
      if (wa(i))
        return i(n);
      if (Yn[a])
        return Yn[a](n, i);
    }
  } else if (a === "%")
    return n * e / 100;
  return Yn[a] ? Yn[a](n) : n;
}
function ca(t, e, r) {
  return Math.max(e, Math.min(t, r));
}
function bs(t, e, r, n) {
  return n === void 0 && (n = t[0] / t[1]), [[xt(e[0], Jt), xt(e[0] / n, Jt)], [xt(e[1] * n, Jt), xt(e[1], Jt)]].filter(function(a) {
    return a.every(function(i, o) {
      var s = e[o], l = xt(s, Jt);
      return r ? i <= s || i <= l : i >= s || i >= l;
    });
  })[0] || t;
}
function Qi(t, e, r, n) {
  if (!n)
    return t.map(function(p, h) {
      return ca(p, e[h], r[h]);
    });
  var a = t[0], i = t[1], o = n === !0 ? a / i : n, s = bs(t, e, !1, o), l = s[0], u = s[1], c = bs(t, r, !0, o), f = c[0], d = c[1];
  return a < l || i < u ? (a = l, i = u) : (a > f || i > d) && (a = f, i = d), [a, i];
}
function Kf(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return r;
}
function mi(t) {
  for (var e = t.length, r = 0, n = e - 1; n >= 0; --n)
    r += t[n];
  return e ? r / e : 0;
}
function Xt(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function Zf(t) {
  return [0, 1].map(function(e) {
    return mi(t.map(function(r) {
      return r[e];
    }));
  });
}
function Ss(t) {
  var e = Zf(t), r = Xt(e, t[0]), n = Xt(e, t[1]);
  return r < n && n - r < Math.PI || r > n && n - r < -Math.PI ? 1 : -1;
}
function Be(t, e) {
  return Math.sqrt(Math.pow((e ? e[0] : 0) - t[0], 2) + Math.pow((e ? e[1] : 0) - t[1], 2));
}
function xt(t, e) {
  if (!e)
    return t;
  var r = 1 / e;
  return Math.round(t / e) / r;
}
function Cs(t, e) {
  return t.forEach(function(r, n) {
    t[n] = xt(t[n], e);
  }), t;
}
function Jf(t) {
  for (var e = [], r = 0; r < t; ++r)
    e.push(r);
  return e;
}
function Qf(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function Qt(t, e) {
  return t.classList ? t.classList.contains(e) : !!t.className.match(new RegExp("(\\s|^)" + e + "(\\s|$)"));
}
function to(t, e) {
  t.classList ? t.classList.add(e) : t.className += " " + e;
}
function jl(t, e) {
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
function Ie(t) {
  return (t == null ? void 0 : t.ownerDocument) || Yf;
}
function eo(t) {
  return Ie(t).documentElement;
}
function or(t) {
  return Ie(t).body;
}
function Ce(t) {
  var e;
  return ((e = t == null ? void 0 : t.ownerDocument) === null || e === void 0 ? void 0 : e.defaultView) || window;
}
function Bl(t) {
  return t && "postMessage" in t && "blur" in t && "self" in t;
}
function mn(t) {
  return me(t) && t.nodeName && t.nodeType && "ownerDocument" in t;
}
function td(t, e, r, n, a, i) {
  for (var o = 0; o < a; ++o) {
    var s = r + o * a, l = n + o * a;
    t[s] += t[l] * i, e[s] += e[l] * i;
  }
}
function ed(t, e, r, n, a) {
  for (var i = 0; i < a; ++i) {
    var o = r + i * a, s = n + i * a, l = t[o], u = e[o];
    t[o] = t[s], t[s] = l, e[o] = e[s], e[s] = u;
  }
}
function rd(t, e, r, n, a) {
  for (var i = 0; i < n; ++i) {
    var o = r + i * n;
    t[o] /= a, e[o] /= a;
  }
}
function Gl(t, e, r) {
  for (var n = t.slice(), a = 0; a < r; ++a)
    n[a * r + e - 1] = 0, n[(e - 1) * r + a] = 0;
  return n[(e - 1) * (r + 1)] = 1, n;
}
function Oe(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = t.slice(), n = At(e), a = 0; a < e; ++a) {
    var i = e * a + a;
    if (!xt(r[i], Jt)) {
      for (var o = a + 1; o < e; ++o)
        if (r[e * a + o]) {
          ed(r, n, a, o, e);
          break;
        }
    }
    if (!xt(r[i], Jt))
      return [];
    rd(r, n, a, e, r[i]);
    for (var o = 0; o < e; ++o) {
      var s = o, l = o + a * e, u = r[l];
      !xt(u, Jt) || a === o || td(r, n, s, a, e, -u);
    }
  }
  return n;
}
function nd(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = 0; n < e; ++n)
    for (var a = 0; a < e; ++a)
      r[a * e + n] = t[e * n + a];
  return r;
}
function Fl(t, e) {
  e === void 0 && (e = Math.sqrt(t.length));
  for (var r = [], n = t[e * e - 1], a = 0; a < e - 1; ++a)
    r[a] = t[e * (e - 1) + a] / n;
  return r[e - 1] = 0, r;
}
function ad(t, e) {
  for (var r = At(e), n = 0; n < e - 1; ++n)
    r[e * (e - 1) + n] = t[n] || 0;
  return r;
}
function gr(t, e) {
  for (var r = t.slice(), n = t.length; n < e - 1; ++n)
    r[n] = 0;
  return r[e - 1] = 1, r;
}
function Pe(t, e, r) {
  if (e === void 0 && (e = Math.sqrt(t.length)), e === r)
    return t;
  for (var n = At(r), a = Math.min(e, r), i = 0; i < a - 1; ++i) {
    for (var o = 0; o < a - 1; ++o)
      n[i * r + o] = t[i * e + o];
    n[(i + 1) * r - 1] = t[(i + 1) * e - 1], n[(r - 1) * r + i] = t[(e - 1) * e + i];
  }
  return n[r * r - 1] = t[e * e - 1], n;
}
function fa(t) {
  for (var e = [], r = 1; r < arguments.length; r++)
    e[r - 1] = arguments[r];
  var n = At(t);
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
function id(t, e) {
  return e === void 0 && (e = t.length === 6), e ? [t[0], t[1], 0, t[2], t[3], 0, t[4], t[5], 1] : t;
}
function Ll(t, e) {
  return e === void 0 && (e = t.length === 9), e ? [t[0], t[1], t[3], t[4], t[6], t[7]] : t;
}
function se(t, e, r) {
  r === void 0 && (r = e.length);
  var n = Nt(t, e, r), a = n[r - 1];
  return n.map(function(i) {
    return i / a;
  });
}
function od(t, e) {
  return Nt(t, [1, 0, 0, 0, 0, Math.cos(e), Math.sin(e), 0, 0, -Math.sin(e), Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function sd(t, e) {
  return Nt(t, [Math.cos(e), 0, -Math.sin(e), 0, 0, 1, 0, 0, Math.sin(e), 0, Math.cos(e), 0, 0, 0, 0, 1], 4);
}
function ld(t, e) {
  return Nt(t, Cn(e, 4));
}
function Xn(t, e) {
  var r = e[0], n = r === void 0 ? 1 : r, a = e[1], i = a === void 0 ? 1 : a, o = e[2], s = o === void 0 ? 1 : o;
  return Nt(t, [n, 0, 0, 0, 0, i, 0, 0, 0, 0, s, 0, 0, 0, 0, 1], 4);
}
function Sn(t, e) {
  return se(Cn(e, 3), gr(t, 3));
}
function qa(t, e) {
  var r = e[0], n = r === void 0 ? 0 : r, a = e[1], i = a === void 0 ? 0 : a, o = e[2], s = o === void 0 ? 0 : o;
  return Nt(t, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, n, i, s, 1], 4);
}
function xi(t, e) {
  return Nt(t, e, 4);
}
function Cn(t, e) {
  var r = Math.cos(t), n = Math.sin(t), a = At(e);
  return a[0] = r, a[1] = n, a[e] = -n, a[e + 1] = r, a;
}
function At(t) {
  for (var e = t * t, r = [], n = 0; n < e; ++n)
    r[n] = n % (t + 1) ? 0 : 1;
  return r;
}
function ro(t, e) {
  for (var r = At(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[(e + 1) * a] = t[a];
  return r;
}
function mr(t, e) {
  for (var r = At(e), n = Math.min(t.length, e - 1), a = 0; a < n; ++a)
    r[e * (e - 1) + a] = t[a];
  return r;
}
function no(t, e, r, n, a, i, o, s) {
  var l = t[0], u = t[1], c = e[0], f = e[1], d = r[0], p = r[1], h = n[0], g = n[1], x = a[0], y = a[1], b = i[0], w = i[1], E = o[0], _ = o[1], D = s[0], M = s[1], m = [l, 0, c, 0, d, 0, h, 0, u, 0, f, 0, p, 0, g, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, l, 0, c, 0, d, 0, h, 0, u, 0, f, 0, p, 0, g, 0, 1, 0, 1, 0, 1, 0, 1, -x * l, -y * l, -b * c, -w * c, -E * d, -_ * d, -D * h, -M * h, -x * u, -y * u, -b * f, -w * f, -E * p, -_ * p, -D * g, -M * g], I = Oe(m, 8);
  if (!I.length)
    return [];
  var k = Nt(I, [x, y, b, w, E, _, D, M], 8);
  return k[8] = 1, Pe(nd(k), 3, 4);
}
var on = function() {
  return on = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, on.apply(this, arguments);
};
function ao() {
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
  return e === void 0 && (e = 0), kr(Br(t, e));
}
function oa(t, e) {
  var r = se(t, [e[0], e[1] || 0, e[2] || 0, 1], 4), n = r[3] || 1;
  return [
    r[0] / n,
    r[1] / n,
    r[2] / n
  ];
}
function ud(t, e) {
  e === void 0 && (e = document.body);
  for (var r = t, n = ao(); r; ) {
    var a = getComputedStyle(r).transform;
    if (n = xi(jr(a), n), r === e)
      break;
    r = r.parentElement;
  }
  return n = Oe(n, 4), n[12] = 0, n[13] = 0, n[14] = 0, n;
}
function kr(t) {
  var e = ao();
  return t.forEach(function(r) {
    var n = r.matrixFunction, a = r.functionValue;
    n && (e = n(e, a));
  }), e;
}
function Br(t, e) {
  e === void 0 && (e = 0);
  var r = Yt(t) ? t : nr(t);
  return r.map(function(n) {
    var a = zl(n), i = a.prefix, o = a.value, s = null, l = i, u = "";
    if (i === "translate" || i === "translateX" || i === "translate3d") {
      var c = me(e) ? on(on({}, e), { "o%": e["%"] }) : {
        "%": e,
        "o%": e
      }, f = vr(o).map(function(R, A) {
        return A === 0 && "x%" in c ? c["%"] = e["x%"] : A === 1 && "y%" in c ? c["%"] = e["y%"] : c["%"] = e["o%"], Pt(R, c);
      }), d = f[0], p = f[1], h = p === void 0 ? 0 : p, g = f[2], x = g === void 0 ? 0 : g;
      s = qa, u = [d, h, x];
    } else if (i === "translateY") {
      var y = me(e) ? on({ "%": e["y%"] }, e) : {
        "%": e
      }, h = Pt(o, y);
      s = qa, u = [0, h, 0];
    } else if (i === "translateZ") {
      var x = parseFloat(o);
      s = qa, u = [0, 0, x];
    } else if (i === "scale" || i === "scale3d") {
      var b = vr(o).map(function(R) {
        return parseFloat(R);
      }), w = b[0], E = b[1], _ = E === void 0 ? w : E, D = b[2], M = D === void 0 ? 1 : D;
      s = Xn, u = [w, _, M];
    } else if (i === "scaleX") {
      var w = parseFloat(o);
      s = Xn, u = [w, 1, 1];
    } else if (i === "scaleY") {
      var _ = parseFloat(o);
      s = Xn, u = [1, _, 1];
    } else if (i === "scaleZ") {
      var M = parseFloat(o);
      s = Xn, u = [1, 1, M];
    } else if (i === "rotate" || i === "rotateZ" || i === "rotateX" || i === "rotateY") {
      var m = hr(o), I = m.unit, k = m.value, z = I === "rad" ? k : k * Math.PI / 180;
      i === "rotate" || i === "rotateZ" ? (l = "rotateZ", s = ld) : i === "rotateX" ? s = od : i === "rotateY" && (s = sd), u = z;
    } else if (i === "matrix3d")
      s = xi, u = vr(o).map(function(R) {
        return parseFloat(R);
      });
    else if (i === "matrix") {
      var P = vr(o).map(function(R) {
        return parseFloat(R);
      });
      s = xi, u = [
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
      functionValue: u
    };
  });
}
var cd = /* @__PURE__ */ (function() {
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
})(), fd = /* @__PURE__ */ (function() {
  function t() {
    this.object = {};
  }
  var e = t.prototype;
  return e.get = function(r) {
    return this.object[r];
  }, e.set = function(r, n) {
    this.object[r] = n;
  }, t;
})(), dd = typeof Map == "function", pd = /* @__PURE__ */ (function() {
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
function vd(t, e) {
  var r = [], n = [];
  return t.forEach(function(a) {
    var i = a[0], o = a[1], s = new pd();
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
var hd = /* @__PURE__ */ (function() {
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
    var r = vd(this.changedBeforeAdded, this.fixed), n = this.changed, a = [];
    this.cacheOrdered = r.filter(function(i, o) {
      var s = i[0], l = i[1], u = n[o], c = u[0], f = u[1];
      if (s !== l)
        return a.push([c, f]), !0;
    }), this.cachePureChanged = a;
  }, t;
})();
function io(t, e, r) {
  var n = dd ? Map : r ? fd : cd, a = r || function(b) {
    return b;
  }, i = [], o = [], s = [], l = t.map(a), u = e.map(a), c = new n(), f = new n(), d = [], p = [], h = {}, g = [], x = 0, y = 0;
  return l.forEach(function(b, w) {
    c.set(b, w);
  }), u.forEach(function(b, w) {
    f.set(b, w);
  }), l.forEach(function(b, w) {
    var E = f.get(b);
    typeof E > "u" ? (++y, o.push(w)) : h[E] = y;
  }), u.forEach(function(b, w) {
    var E = c.get(b);
    typeof E > "u" ? (i.push(w), ++x) : (s.push([E, w]), y = h[w] || 0, d.push([E - y, w - x]), p.push(w === E), E !== w && g.push([E, w]));
  }), o.reverse(), new hd(t, e, i, o, g, s, d, p);
}
var gd = /* @__PURE__ */ (function() {
  function t(r, n) {
    r === void 0 && (r = []), this.findKeyCallback = n, this.list = [].slice.call(r);
  }
  var e = t.prototype;
  return e.update = function(r) {
    var n = [].slice.call(r), a = io(this.list, n, this.findKeyCallback);
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
var yi = function(t, e) {
  return yi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, yi(t, e);
};
function md(t, e) {
  yi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Wl = typeof Map == "function" ? void 0 : /* @__PURE__ */ (function() {
  var t = 0;
  return function(e) {
    return e.__DIFF_KEY__ || (e.__DIFF_KEY__ = ++t);
  };
})(), Yl = /* @__PURE__ */ (function(t) {
  md(e, t);
  function e(r) {
    return r === void 0 && (r = []), t.call(this, r, Wl) || this;
  }
  return e;
})(gd);
function Tr(t, e) {
  return io(t, e, Wl);
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
var bi = function() {
  return bi = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, bi.apply(this, arguments);
};
function xd() {
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
        var o = Ue(i, function(s) {
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
    }, n.currentTarget = this, xd(i).forEach(function(s) {
      s.listener(n), s.once && a.off(r, s.listener);
    }), !o;
  }, e.trigger = function(r, n) {
    return n === void 0 && (n = {}), this.emit(r, n);
  }, e._addEvent = function(r, n, a) {
    var i = this._events;
    i[r] = i[r] || [];
    var o = i[r];
    o.push(bi({
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
var Si = function(t, e) {
  return Si = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Si(t, e);
};
function yd(t, e) {
  Si(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Ir = function() {
  return Ir = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ir.apply(this, arguments);
};
function bd(t) {
  var e = t.container;
  return e === document.body ? [e.scrollLeft || document.documentElement.scrollLeft, e.scrollTop || document.documentElement.scrollTop] : [e.scrollLeft, e.scrollTop];
}
function Es(t, e) {
  return t.addEventListener("scroll", e), function() {
    t.removeEventListener("scroll", e);
  };
}
function Hn(t) {
  if (t) {
    if (we(t))
      return document.querySelector(t);
  } else return null;
  if (wa(t))
    return t();
  if (t instanceof Element)
    return t;
  if ("current" in t)
    return t.current;
  if ("value" in t)
    return t.value;
}
var Xl = /* @__PURE__ */ (function(t) {
  yd(e, t);
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
    var i = Hn(a.container);
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
      return c.top > o - l ? (f[1] > c.top || o < f[1]) && (d[1] = -1) : c.top + c.height < o + l && (f[1] < c.top + c.height || o > f[1]) && (d[1] = 1), c.left > i - l ? (f[0] > c.left || i < f[0]) && (d[0] = -1) : c.left + c.width < i + l && (f[0] < c.left + c.width || i > f[0]) && (d[0] = 1), !d[0] && !d[1] ? !1 : this._continueDrag(Ir(Ir({}, a), {
        direction: d,
        inputEvent: n,
        isDrag: !0
      }));
    }
  }, r.checkScroll = function(n) {
    var a = this;
    if (this._isWait)
      return !1;
    var i = n.prevScrollPos, o = i === void 0 ? this._prevScrollPos : i, s = n.direction, l = n.throttleTime, u = l === void 0 ? 0 : l, c = n.inputEvent, f = n.isDrag, d = this._getScrollPosition(s || [0, 0], n), p = d[0] - o[0], h = d[1] - o[1], g = s || [p ? Math.abs(p) / p : 0, h ? Math.abs(h) / h : 0];
    return this._prevScrollPos = d, this._lock = !1, !p && !h ? !1 : (this.emit("move", {
      offsetX: g[0] ? p : 0,
      offsetY: g[1] ? h : 0,
      inputEvent: c
    }), u && f && (clearTimeout(this._timer), this._timer = window.setTimeout(function() {
      a._continueDrag(n);
    }, u)), !0);
  }, r.dragEnd = function() {
    this._flag = !1, this._lock = !1, clearTimeout(this._timer), this._unregisterScrollEvent();
  }, r._getScrollPosition = function(n, a) {
    var i = a.container, o = a.getScrollPosition, s = o === void 0 ? bd : o;
    return s({
      container: Hn(i),
      direction: n
    });
  }, r._continueDrag = function(n) {
    var a = this, i, o = n.container, s = n.direction, l = n.throttleTime, u = n.useScroll, c = n.isDrag, f = n.inputEvent;
    if (!(!this._flag || c && this._isWait)) {
      var d = gn(), p = Math.max(l + this._prevTime - d, 0);
      if (p > 0)
        return clearTimeout(this._timer), this._timer = window.setTimeout(function() {
          a._continueDrag(n);
        }, p), !1;
      this._prevTime = d;
      var h = this._getScrollPosition(s, n);
      this._prevScrollPos = h, c && (this._isWait = !0), u || (this._lock = !0);
      var g = {
        container: Hn(o),
        direction: s,
        inputEvent: f
      };
      return (i = n.requestScroll) === null || i === void 0 || i.call(n, g), this.emit("scroll", g), this._isWait = !1, u || this.checkScroll(Ir(Ir({}, n), {
        prevScrollPos: h,
        direction: s,
        inputEvent: f
      }));
    }
  }, r._registerScrollEvent = function(n) {
    this._unregisterScrollEvent();
    var a = n.checkScrollEvent;
    if (a) {
      var i = a === !0 ? Es : a, o = Hn(n.container);
      a === !0 && (o === document.body || o === document.documentElement) ? this._unregister = Es(window, this._onScroll) : this._unregister = i(o, this._onScroll);
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
function Sd() {
  for (var t = 0, e = 0, r = arguments.length; e < r; e++) t += arguments[e].length;
  for (var n = Array(t), a = 0, e = 0; e < r; e++) for (var i = arguments[e], o = 0, s = i.length; o < s; o++, a++) n[a] = i[o];
  return n;
}
function ve(t) {
  return xt(t, Jt);
}
function Cd(t, e) {
  return t.every(function(r, n) {
    return ve(r - e[n]) === 0;
  });
}
function Ed(t, e) {
  return !ve(t[0] - e[0]) && !ve(t[1] - e[1]);
}
function sn(t) {
  return t.length < 3 ? 0 : Math.abs(Kf(t.map(function(e, r) {
    var n = t[r + 1] || t[0];
    return e[0] * n[1] - n[0] * e[1];
  }))) / 2;
}
function Ci(t, e) {
  var r = e.width, n = e.height, a = e.left, i = e.top, o = xr(t), s = o.minX, l = o.minY, u = o.maxX, c = o.maxY, f = r / (u - s), d = n / (c - l);
  return t.map(function(p) {
    return [a + (p[0] - s) * f, i + (p[1] - l) * d];
  });
}
function xr(t) {
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
function da(t, e, r) {
  var n = t[0], a = t[1], i = xr(e), o = i.minX, s = i.maxX, l = [[o, a], [s, a]], u = pa(l[0], l[1]), c = Ei(e), f = [];
  if (c.forEach(function(h) {
    var g = pa(h[0], h[1]), x = h[0];
    if (Cd(u, g))
      f.push({
        pos: t,
        line: h,
        type: "line"
      });
    else {
      var y = Hl(oo(u, g), [l, h]);
      y.forEach(function(b) {
        h.some(function(w) {
          return Ed(w, b);
        }) ? f.push({
          pos: b,
          line: h,
          type: "point"
        }) : ve(x[1] - a) !== 0 && f.push({
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
    var g = h.pos, x = h.type, y = h.line;
    if (!(g[0] > n))
      if (x === "intersection")
        ++d;
      else {
        if (x === "line")
          return;
        if (x === "point") {
          var b = xe(y, function(_) {
            return _[1] !== a;
          }), w = p[g[0]], E = b[1] > a ? 1 : -1;
          w ? w !== E && ++d : p[g[0]] = E;
        }
      }
  }), d % 2 === 1;
}
function pa(t, e) {
  var r = t[0], n = t[1], a = e[0], i = e[1], o = a - r, s = i - n;
  Math.abs(o) < Jt && (o = 0), Math.abs(s) < Jt && (s = 0);
  var l = 0, u = 0, c = 0;
  return o ? s ? (l = -s / o, u = 1, c = -l * r - n) : (u = 1, c = -n) : s && (l = -1, c = r), [l, u, c];
}
function oo(t, e) {
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
function Hl(t, e) {
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
    var d = f[0], p = f[1];
    return r.every(function(h) {
      return 0 <= ve(d - h[0][0]) && 0 <= ve(h[0][1] - d) && 0 <= ve(p - h[1][0]) && 0 <= ve(h[1][1] - p);
    });
  })), n.map(function(f) {
    return [ve(f[0]), ve(f[1])];
  });
}
function Ei(t) {
  return Sd(t.slice(1), [t[0]]).map(function(e, r) {
    return [t[r], e];
  });
}
function wd(t, e) {
  var r = t.slice(), n = e.slice();
  Ss(r) === -1 && r.reverse(), Ss(n) === -1 && n.reverse();
  var a = Ei(r), i = Ei(n), o = a.map(function(c) {
    return pa(c[0], c[1]);
  }), s = i.map(function(c) {
    return pa(c[0], c[1]);
  }), l = [];
  o.forEach(function(c, f) {
    var d = a[f], p = [];
    s.forEach(function(h, g) {
      var x = oo(c, h), y = Hl(x, [d, i[g]]);
      p.push.apply(p, y.map(function(b) {
        return {
          index1: f,
          index2: g,
          pos: b,
          type: "intersection"
        };
      }));
    }), p.sort(function(h, g) {
      return Be(d[0], h.pos) - Be(d[0], g.pos);
    }), l.push.apply(l, p), da(d[1], n) && l.push({
      index1: f,
      index2: -1,
      pos: d[1],
      type: "inside"
    });
  }), i.forEach(function(c, f) {
    if (da(c[1], r)) {
      var d = !1, p = Ue(l, function(h) {
        var g = h.index2;
        return g === f ? (d = !0, !1) : !!d;
      });
      p === -1 && (d = !1, p = Ue(l, function(h) {
        var g = h.index1, x = h.index2;
        return g === -1 && x + 1 === f ? (d = !0, !1) : !!d;
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
function wi(t, e) {
  var r = wd(t, e);
  return r.map(function(n) {
    var a = n.pos;
    return a;
  });
}
function Dd(t, e) {
  var r = wi(t, e);
  return sn(r);
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
var Di = function(t, e) {
  return Di = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) n.hasOwnProperty(a) && (r[a] = n[a]);
  }, Di(t, e);
};
function _d(t, e) {
  Di(t, e);
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
function Md(t, e) {
  var r = e[0] - t[0], n = e[1] - t[1], a = Math.atan2(n, r);
  return a >= 0 ? a : a + Math.PI * 2;
}
function Va(t) {
  return Md([
    t[0].clientX,
    t[0].clientY
  ], [
    t[1].clientX,
    t[1].clientY
  ]) / Math.PI * 180;
}
function kd(t) {
  return t.touches && t.touches.length >= 2;
}
function $n(t) {
  return t ? t.touches ? Id(t.touches) : [$l(t)] : [];
}
function Td(t) {
  return t && (t.type.indexOf("mouse") > -1 || "button" in t);
}
function ws(t, e, r) {
  var n = r.length, a = ln(t, n), i = a.clientX, o = a.clientY, s = a.originalClientX, l = a.originalClientY, u = ln(e, n), c = u.clientX, f = u.clientY, d = ln(r, n), p = d.clientX, h = d.clientY, g = i - c, x = o - f, y = i - p, b = o - h;
  return {
    clientX: s,
    clientY: l,
    deltaX: g,
    deltaY: x,
    distX: y,
    distY: b
  };
}
function Ua(t) {
  return Math.sqrt(Math.pow(t[0].clientX - t[1].clientX, 2) + Math.pow(t[0].clientY - t[1].clientY, 2));
}
function Id(t) {
  for (var e = Math.min(t.length, 2), r = [], n = 0; n < e; ++n)
    r.push($l(t[n]));
  return r;
}
function $l(t) {
  return {
    clientX: t.clientX,
    clientY: t.clientY
  };
}
function ln(t, e) {
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
var Ka = /* @__PURE__ */ (function() {
  function t(e) {
    this.prevClients = [], this.startClients = [], this.movement = 0, this.length = 0, this.startClients = e, this.prevClients = e, this.length = e.length;
  }
  return t.prototype.getAngle = function(e) {
    return e === void 0 && (e = this.prevClients), Va(e);
  }, t.prototype.getRotation = function(e) {
    return e === void 0 && (e = this.prevClients), Va(e) - Va(this.startClients);
  }, t.prototype.getPosition = function(e, r) {
    e === void 0 && (e = this.prevClients);
    var n = ws(e || this.prevClients, this.prevClients, this.startClients), a = n.deltaX, i = n.deltaY;
    return this.movement += Math.sqrt(a * a + i * i), this.prevClients = e, n;
  }, t.prototype.getPositions = function(e) {
    e === void 0 && (e = this.prevClients);
    for (var r = this.prevClients, n = this.startClients, a = Math.min(this.length, r.length), i = [], o = 0; o < a; ++o)
      i[o] = ws([e[o]], [r[o]], [n[o]]);
    return i;
  }, t.prototype.getMovement = function(e) {
    var r = this.movement;
    if (!e)
      return r;
    var n = ln(e, this.length), a = ln(this.prevClients, this.length), i = n.clientX - a.clientX, o = n.clientY - a.clientY;
    return Math.sqrt(i * i + o * o) + r;
  }, t.prototype.getDistance = function(e) {
    return e === void 0 && (e = this.prevClients), Ua(e);
  }, t.prototype.getScale = function(e) {
    return e === void 0 && (e = this.prevClients), Ua(e) / Ua(this.startClients);
  }, t.prototype.move = function(e, r) {
    this.startClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    }), this.prevClients.forEach(function(n) {
      n.clientX -= e, n.clientY -= r;
    });
  }, t;
})(), Ds = ["textarea", "input"], ql = /* @__PURE__ */ (function(t) {
  _d(e, t);
  function e(r, n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.options = {}, a.flag = !1, a.pinchFlag = !1, a.data = {}, a.isDrag = !1, a.isPinch = !1, a.clientStores = [], a.targets = [], a.prevTime = 0, a.doubleFlag = !1, a._useMouse = !1, a._useTouch = !1, a._useDrag = !1, a._dragFlag = !1, a._isTrusted = !1, a._isMouseEvent = !1, a._isSecondaryButton = !1, a._preventMouseEvent = !1, a._prevInputEvent = null, a._isDragAPI = !1, a._isIdle = !0, a._preventMouseEventId = 0, a._window = window, a.onDragStart = function(d, p) {
      if (p === void 0 && (p = !0), !(!a.flag && d.cancelable === !1)) {
        var h = d.type.indexOf("drag") >= -1;
        if (!(a.flag && h)) {
          a._isDragAPI = !0;
          var g = a.options, x = g.container, y = g.pinchOutside, b = g.preventWheelClick, w = g.preventRightClick, E = g.preventDefault, _ = g.checkInput, D = g.dragFocusedInput, M = g.preventClickEventOnDragStart, m = g.preventClickEventOnDrag, I = g.preventClickEventByCondition, k = a._useTouch, z = !a.flag;
          if (a._isSecondaryButton = d.which === 3 || d.button === 2, b && (d.which === 2 || d.button === 1) || w && (d.which === 3 || d.button === 2))
            return a.stop(), !1;
          if (z) {
            var P = a._window.document.activeElement, R = d.target;
            if (R) {
              var A = R.tagName.toLowerCase(), j = Ds.indexOf(A) > -1, W = R.isContentEditable;
              if (j || W) {
                if (_ || !D && P === R)
                  return !1;
                if (P && (P === R || W && P.isContentEditable && P.contains(R)))
                  if (D)
                    R.blur();
                  else
                    return !1;
              } else if ((E || d.type === "touchstart") && P) {
                var X = P.tagName.toLowerCase();
                (P.isContentEditable || Ds.indexOf(X) > -1) && P.blur();
              }
              (M || m || I) && Zt(a._window, "click", a._onClick, !0);
            }
            a.clientStores = [new Ka($n(d))], a._isIdle = !1, a.flag = !0, a.isDrag = !1, a._isTrusted = p, a._dragFlag = !0, a._prevInputEvent = d, a.data = {}, a.doubleFlag = gn() - a.prevTime < 200, a._isMouseEvent = Td(d), !a._isMouseEvent && a._preventMouseEvent && a._allowMouseEvent();
            var L = a._preventMouseEvent || a.emit("dragStart", Ut(Ut({ data: a.data, datas: a.data, inputEvent: d, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, isTrusted: p, isDouble: a.doubleFlag }, a.getCurrentStore().getPosition()), { preventDefault: function() {
              d.preventDefault();
            }, preventDrag: function() {
              a._dragFlag = !1;
            } }));
            L === !1 && a.stop(), a._isMouseEvent && a.flag && E && d.preventDefault();
          }
          if (!a.flag)
            return !1;
          var q = 0;
          if (z ? (a._attchDragEvent(), k && y && (q = setTimeout(function() {
            Zt(x, "touchstart", a.onDragStart, {
              passive: !1
            });
          }))) : k && y && Wt(x, "touchstart", a.onDragStart), a.flag && kd(d)) {
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
        var g = $n(d), x = a.moveClients(g, d, !1);
        if (a._dragFlag) {
          if (a.pinchFlag || x.deltaX || x.deltaY) {
            var y = a._preventMouseEvent || a.emit("drag", Ut(Ut({}, x), { isScroll: !!p, inputEvent: d }));
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
        var p = a.options, h = p.pinchOutside, g = p.container, x = p.preventClickEventOnDrag, y = p.preventClickEventOnDragStart, b = p.preventClickEventByCondition, w = a.isDrag;
        (x || y || b) && requestAnimationFrame(function() {
          a._allowClickEvent();
        }), !b && !y && x && !w && a._allowClickEvent(), a._useTouch && h && Wt(g, "touchstart", a.onDragStart), a.pinchFlag && a.onPinchEnd(d);
        var E = d != null && d.touches ? $n(d) : [], _ = E.length;
        _ === 0 || !a.options.keepDragging ? a.flag = !1 : a._addStore(new Ka(E));
        var D = a._getPosition(), M = gn(), m = !w && a.doubleFlag;
        a._prevInputEvent = null, a.prevTime = w || m ? 0 : M, a.flag || (a._dettachDragEvent(), a._preventMouseEvent || a.emit("dragEnd", Ut({ data: a.data, datas: a.data, isDouble: m, isDrag: w, isClick: !w, isMouseEvent: a._isMouseEvent, isSecondaryButton: a._isSecondaryButton, inputEvent: d, isTrusted: a._isTrusted }, D)), a.clientStores = [], a._isMouseEvent || (a._preventMouseEvent = !0, clearTimeout(a._preventMouseEventId), a._preventMouseEventId = setTimeout(function() {
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
    a._window = Bl(o) ? o : Ce(o), a.options = Ut({ checkInput: !1, container: o && !("document" in o) ? Ce(o) : o, preventRightClick: !0, preventWheelClick: !0, preventClickEventOnDragStart: !1, preventClickEventOnDrag: !1, preventClickEventByCondition: null, preventDefault: !0, checkWindowBlur: !1, keepDragging: !1, pinchThreshold: 0, events: ["touch", "mouse"] }, n);
    var s = a.options, l = s.container, u = s.events, c = s.checkWindowBlur;
    if (a._useDrag = u.indexOf("drag") > -1, a._useTouch = u.indexOf("touch") > -1, a._useMouse = u.indexOf("mouse") > -1, a.targets = i, a._useDrag && i.forEach(function(d) {
      Zt(d, "dragstart", a.onDragStart);
    }), a._useMouse && (i.forEach(function(d) {
      Zt(d, "mousedown", a.onDragStart), Zt(d, "mousemove", a._passCallback);
    }), Zt(l, "contextmenu", a._onContextMenu)), c && Zt(Ce(), "blur", a.onBlur), a._useTouch) {
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
      var i = new Ka($n(r));
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
})(En);
function Rd(t) {
  for (var e = 5381, r = t.length; r; )
    e = e * 33 ^ t.charCodeAt(--r);
  return e >>> 0;
}
var Od = Rd;
function Pd(t) {
  return Od(t).toString(36);
}
function Nd(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function zd(t, e, r) {
  return r.original ? e : e.replace(/([^};{\s}][^};{]*|^\s*){/mg, function(n, a) {
    var i = a.trim();
    return (i ? vr(i) : [""]).map(function(o) {
      var s = o.trim();
      return s.indexOf("@") === 0 ? s : s.indexOf(":global") > -1 ? s.replace(/\:global/g, "") : s.indexOf(":host") > -1 ? "".concat(s.replace(/\:host/g, ".".concat(t))) : s ? ".".concat(t, " ").concat(s) : ".".concat(t);
    }).join(", ") + " {";
  });
}
function Ad(t, e, r, n, a) {
  var i = Ie(n), o = i.createElement("style");
  return o.setAttribute("type", "text/css"), o.setAttribute("data-styled-id", t), o.setAttribute("data-styled-count", "1"), r.nonce && o.setAttribute("nonce", r.nonce), o.innerHTML = zd(t, e, r), (a || i.head || i.body).appendChild(o), o;
}
function Vl(t) {
  var e = "rCS" + Pd(t);
  return {
    className: e,
    inject: function(r, n) {
      n === void 0 && (n = {});
      var a = Nd(r), i = (a || r.ownerDocument || document).querySelector('style[data-styled-id="'.concat(e, '"]'));
      if (!i)
        i = Ad(e, t, n, r, a);
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
var _i = function() {
  return _i = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, _i.apply(this, arguments);
};
function jd(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Ul(t, e) {
  var r = Vl(e), n = r.className;
  return rt.forwardRef(function(a, i) {
    var o = a.className, s = o === void 0 ? "" : o;
    a.cspNonce;
    var l = jd(a, ["className", "cspNonce"]), u = rt.useRef();
    return rt.useImperativeHandle(i, function() {
      return u.current;
    }, []), rt.useEffect(function() {
      var c = r.inject(u.current, {
        nonce: a.cspNonce
      });
      return function() {
        c.destroy();
      };
    }, []), rt.createElement(t, _i({
      ref: u,
      "data-styled-id": n,
      className: "".concat(s, " ").concat(n)
    }, l));
  });
}
var Mi = function(t, e) {
  return Mi = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Mi(t, e);
};
function wn(t, e) {
  if (typeof e != "function" && e !== null)
    throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Mi(t, e);
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
function Bd(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function")
    for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
      e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Gd(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function Fd(t) {
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
function Dn(t, e) {
  return O({ events: [], props: [], name: t }, e);
}
var Ld = ["n", "w", "s", "e"], so = ["n", "w", "s", "e", "nw", "ne", "sw", "se"];
function Wd(t, e) {
  return 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="'.concat(32 * t, 'px" height="').concat(32 * t, 'px" viewBox="0 0 32 32" ><path d="M 16,5 L 12,10 L 14.5,10 L 14.5,22 L 12,22 L 16,27 L 20,22 L 17.5,22 L 17.5,10 L 20, 10 L 16,5 Z" stroke-linejoin="round" stroke-width="1.2" fill="black" stroke="white" style="transform:rotate(').concat(e, 'deg);transform-origin: 16px 16px"></path></svg>');
}
function Yd(t) {
  var e = Wd(1, t), r = Math.round(t / 45) * 45 % 180, n = "ns-resize";
  return r === 135 ? n = "nwse-resize" : r === 45 ? n = "nesw-resize" : r === 90 && (n = "ew-resize"), "cursor:".concat(n, ";cursor: url('").concat(e, "') 16 16, ").concat(n, ";");
}
var Hr = zf(), Kl = Hr.browser.webkit, Zl = Kl && (function() {
  var t = typeof window > "u" ? { userAgent: "" } : window.navigator, e = /applewebkit\/([^\s]+)/g.exec(t.userAgent.toLowerCase());
  return e ? parseFloat(e[1]) < 605 : !1;
})(), Jl = Hr.browser.name, Ql = parseInt(Hr.browser.version, 10), Xd = Jl === "chrome", Hd = Hr.browser.chromium, $d = parseInt(Hr.browser.chromiumVersion, 10) || 0, qd = Xd && Ql >= 109 || Hd && $d >= 109, Vd = Jl === "firefox", Ud = parseInt(Hr.browser.webkitVersion, 10) >= 612 || Ql >= 15, lo = "moveable-", Kd = so.map(function(t) {
  var e = "", r = "", n = "center", a = "center", i = "calc(var(--moveable-control-padding, 20) * -1px)";
  return t.indexOf("n") > -1 && (e = "top: ".concat(i, ";"), a = "bottom"), t.indexOf("s") > -1 && (e = "top: 0px;", a = "top"), t.indexOf("w") > -1 && (r = "left: ".concat(i, ";"), n = "right"), t.indexOf("e") > -1 && (r = "left: 0px;", n = "left"), '.around-control[data-direction*="'.concat(t, `"] {
        `).concat(r).concat(e, `
        transform-origin: `).concat(n, " ").concat(a, `;
    }`);
}).join(`
`), Zd = `
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
`.concat(Kd, `
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
`).concat(Yd(t), `
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

`).concat(Zl ? `:global svg *:before {
content:"";
transform-origin: inherit;
}` : "", `
`), Jd = [
  [0, 1, 2],
  [1, 0, 3],
  [2, 0, 3],
  [3, 1, 2]
], ki = 1e-4, fe = 1e-7, qn = 1e-9, Ti = Math.pow(10, 10), _s = -Ti, Qd = {
  n: [0, -1],
  e: [1, 0],
  s: [0, 1],
  w: [-1, 0],
  nw: [-1, -1],
  ne: [1, -1],
  sw: [-1, 1],
  se: [1, 1]
}, uo = {
  n: [0, 1],
  e: [1, 3],
  s: [3, 2],
  w: [2, 0],
  nw: [0],
  ne: [1],
  sw: [2],
  se: [3]
}, tu = {
  n: 0,
  s: 180,
  w: 270,
  e: 90,
  nw: 315,
  ne: 45,
  sw: 225,
  se: 135
}, tp = [
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
  return O(O({}, l), { isPinch: !!n, parentEvent: !0, datas: c, originalDatas: t.originalDatas });
}
var Gr = /* @__PURE__ */ (function() {
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
function Ar(t, e, r, n) {
  var a = t.length === 16, i = a ? 4 : 3, o = Sr(t, r, n, i), s = N(o, 4), l = N(s[0], 2), u = l[0], c = l[1], f = N(s[1], 2), d = f[0], p = f[1], h = N(s[2], 2), g = h[0], x = h[1], y = N(s[3], 2), b = y[0], w = y[1], E = N(Gt(t, e, i), 2), _ = E[0], D = E[1], M = Math.min(u, d, g, b), m = Math.min(c, p, x, w), I = Math.max(u, d, g, b), k = Math.max(c, p, x, w);
  u = u - M || 0, d = d - M || 0, g = g - M || 0, b = b - M || 0, c = c - m || 0, p = p - m || 0, x = x - m || 0, w = w - m || 0, _ = _ - M || 0, D = D - m || 0;
  var z = t[0], P = t[i + 1], R = ue(z * P);
  return {
    left: M,
    top: m,
    right: I,
    bottom: k,
    origin: [_, D],
    pos1: [u, c],
    pos2: [d, p],
    pos3: [g, x],
    pos4: [b, w],
    direction: R
  };
}
function eu(t, e) {
  var r = e.clientX, n = e.clientY, a = e.datas, i = t.state, o = i.moveableClientRect, s = i.rootMatrix, l = i.is3d, u = i.pos1, c = o.left, f = o.top, d = l ? 4 : 3, p = N(vt(Wr(s, [r - c, n - f], d), u), 2), h = p[0], g = p[1], x = N(Fe({ datas: a, distX: h, distY: g }), 2), y = x[0], b = x[1];
  return [y, b];
}
function br(t, e) {
  var r = e.datas, n = t.state, a = n.allMatrix, i = n.beforeMatrix, o = n.is3d, s = n.left, l = n.top, u = n.origin, c = n.offsetMatrix, f = n.targetMatrix, d = n.transformOrigin, p = o ? 4 : 3;
  r.is3d = o, r.matrix = a, r.targetMatrix = f, r.beforeMatrix = i, r.offsetMatrix = c, r.transformOrigin = d, r.inverseMatrix = Oe(a, p), r.inverseBeforeMatrix = Oe(i, p), r.absoluteOrigin = gr(Tt([s, l], u), p), r.startDragBeforeDist = se(r.inverseBeforeMatrix, r.absoluteOrigin, p), r.startDragDist = se(r.inverseMatrix, r.absoluteOrigin, p);
}
function ep(t) {
  return Ar(t.datas.beforeTransform, [50, 50], 100, 100).direction;
}
function Da(t, e, r) {
  var n = e.datas, a = e.originalDatas.beforeRenderable, i = n.transformIndex, o = a.nextTransforms, s = o.length, l = a.nextTransformAppendedIndexes, u = -1;
  i === -1 ? (r === "translate" ? u = 0 : r === "rotate" && (u = Ue(o, function(p) {
    return p.match(/scale\(/g);
  })), u === -1 && (u = o.length), n.transformIndex = u) : xe(l, function(p) {
    return p.index === i && p.functionName === r;
  }) ? u = i : u = i + l.filter(function(p) {
    return p.index < i;
  }).length;
  var c = Mv(o, t.state, u), f = c.targetFunction, d = r === "rotate" ? "rotateZ" : r;
  n.beforeFunctionTexts = c.beforeFunctionTexts, n.afterFunctionTexts = c.afterFunctionTexts, n.beforeTransform = c.beforeFunctionMatrix, n.beforeTransform2 = c.beforeFunctionMatrix2, n.targetTansform = c.targetFunctionMatrix, n.afterTransform = c.afterFunctionMatrix, n.afterTransform2 = c.afterFunctionMatrix2, n.targetAllTransform = c.allFunctionMatrix, f.functionName === d ? (n.afterFunctionTexts.splice(0, 1), n.isAppendTransform = !1) : s > u && (n.isAppendTransform = !0, a.nextTransformAppendedIndexes = J(J([], N(l), !1), [{
    functionName: r,
    index: u,
    isAppend: !0
  }], !1));
}
function _a(t, e, r) {
  return "".concat(t.beforeFunctionTexts.join(" "), " ").concat(t.isAppendTransform ? r : e, " ").concat(t.afterFunctionTexts.join(" "));
}
function rp(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = N(nu({ datas: e, distX: r, distY: n }), 2), i = a[0], o = a[1], s = ru(e, ad([i, o], 4));
  return se(s, gr([0, 0, 0], 4), 4);
}
function ru(t, e, r) {
  var n = t.beforeTransform, a = t.afterTransform, i = t.beforeTransform2, o = t.afterTransform2, s = t.targetAllTransform, l = r ? Nt(s, e, 4) : Nt(e, s, 4), u = Nt(Oe(r ? i : n, 4), l, 4), c = Nt(u, Oe(r ? o : a, 4), 4);
  return c;
}
function nu(t) {
  var e = t.datas, r = t.distX, n = t.distY, a = e.inverseBeforeMatrix, i = e.is3d, o = e.startDragBeforeDist, s = e.absoluteOrigin, l = i ? 4 : 3;
  return vt(se(a, Tt(s, [r, n]), l), o);
}
function Fe(t, e) {
  var r = t.datas, n = t.distX, a = t.distY, i = r.inverseBeforeMatrix, o = r.inverseMatrix, s = r.is3d, l = r.startDragBeforeDist, u = r.startDragDist, c = r.absoluteOrigin, f = s ? 4 : 3;
  return vt(se(e ? i : o, Tt(c, [n, a]), f), e ? l : u);
}
function np(t, e) {
  var r = t.datas, n = t.distX, a = t.distY;
  r.beforeMatrix;
  var i = r.matrix, o = r.is3d;
  r.startDragBeforeDist;
  var s = r.startDragDist, l = r.absoluteOrigin, u = o ? 4 : 3;
  return vt(se(i, Tt(s, [n, a]), u), l);
}
function ap(t, e, r, n, a, i) {
  return n === void 0 && (n = e), a === void 0 && (a = r), i === void 0 && (i = [0, 0]), t ? t.map(function(o, s) {
    var l = hr(o), u = l.value, c = l.unit, f = s ? a : n, d = s ? r : e;
    if (o === "%" || isNaN(u)) {
      var p = f ? i[s] / f : 0;
      return d * p;
    } else if (c !== "%")
      return u;
    return d * u / 100;
  }) : i;
}
function au(t) {
  var e = [];
  return t[1] >= 0 && (t[0] >= 0 && e.push(3), t[0] <= 0 && e.push(2)), t[1] <= 0 && (t[0] >= 0 && e.push(1), t[0] <= 0 && e.push(0)), e;
}
function ip(t, e) {
  return au(e).map(function(r) {
    return t[r];
  });
}
function Za(t, e) {
  var r = (e + 1) / 2;
  return [
    ua(t[0][0], t[1][0], r, 1 - r),
    ua(t[0][1], t[1][1], r, 1 - r)
  ];
}
function ee(t, e) {
  var r = Za([t[0], t[1]], e[0]), n = Za([t[2], t[3]], e[0]);
  return Za([r, n], e[1]);
}
function op(t, e, r, n, a, i) {
  var o = Sr(e, r, n, a), s = ee(o, i), l = t[0] - s[0], u = t[1] - s[1];
  return [l, u];
}
function Mn(t, e, r, n) {
  return Nt(t, cn(e, n, r), n);
}
function sp(t, e, r, n) {
  var a = t.transformOrigin, i = t.offsetMatrix, o = t.is3d, s = o ? 4 : 3, l;
  if (we(r)) {
    var u = e.beforeTransform, c = e.afterTransform;
    n ? l = Pe(jr(r), 4, s) : l = Pe(Nt(Nt(u, jr([r]), 4), c, 4), 4, s);
  } else
    l = r;
  return Mn(i, l, a, s);
}
function lp(t, e) {
  var r = t.transformOrigin, n = t.offsetMatrix, a = t.is3d, i = t.targetMatrix, o = t.targetAllTransform, s = a ? 4 : 3;
  return Mn(n, Nt(o || i, ro(e, s), s), r, s);
}
function Ma(t, e) {
  var r = $r(e);
  return {
    setTransform: function(n, a) {
      a === void 0 && (a = -1), r.startTransforms = Yt(n) ? n : nr(n), Ii(t, e, a);
    },
    setTransformIndex: function(n) {
      Ii(t, e, n);
    }
  };
}
function ka(t, e, r) {
  var n = $r(e), a = n.startTransforms;
  Ii(t, e, Ue(a, function(i) {
    return i.indexOf("".concat(r, "(")) === 0;
  }));
}
function Ii(t, e, r) {
  var n = $r(e), a = e.datas;
  if (a.transformIndex = r, r !== -1) {
    var i = n.startTransforms[r];
    if (i) {
      var o = t.state, s = Br([i], {
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
function co(t, e) {
  var r = $r(t);
  r.nextTransforms = nr(e);
}
function $r(t) {
  return t.originalDatas.beforeRenderable;
}
function va(t) {
  var e = t.originalDatas.beforeRenderable;
  return e.nextTransforms;
}
function Vn(t) {
  return (va(t) || []).join(" ");
}
function Un(t) {
  return $r(t).nextStyle;
}
function iu(t, e, r, n, a) {
  co(a, e);
  var i = le.drag(t, _n(a, t.state, r, n)), o = i ? i.transform : e;
  return O(O({ transform: e, drag: i }, ce({
    transform: o
  }, a)), { afterTransform: o });
}
function fo(t, e, r, n, a, i) {
  var o = sp(t.state, a, e, i), s = fp(t, r, n, o);
  return s;
}
function ou(t, e, r, n, a, i, o) {
  var s = fo(t, e, r, a, i, o), l = t.state, u = l.left, c = l.top, f = t.props.groupable, d = f ? u : 0, p = f ? c : 0, h = vt(n, s);
  return vt(h, [d, p]);
}
function up(t, e, r, n, a, i, o) {
  var s = ou(t, e, r, n, a, i, o);
  return s;
}
function cp(t, e, r) {
  return [
    e ? -1 + t[0] / (e / 2) : 0,
    r ? -1 + t[1] / (r / 2) : 0
  ];
}
function fp(t, e, r, n) {
  n === void 0 && (n = t.state.allMatrix);
  var a = t.state, i = a.width, o = a.height, s = a.is3d, l = s ? 4 : 3, u = [
    i / 2 * (1 + e[0]) + r[0],
    o / 2 * (1 + e[1]) + r[1]
  ];
  return Gt(n, u, l);
}
function dp(t, e, r) {
  var n = r.fixedDirection, a = r.fixedPosition, i = r.fixedOffset;
  return ou(t, "rotate(".concat(e, "deg)"), n, a, i, r);
}
function pp(t, e, r, n, a, i) {
  var o = t.props.groupable, s = t.state, l = s.transformOrigin, u = s.offsetMatrix, c = s.is3d, f = s.width, d = s.height, p = s.left, h = s.top, g = i.fixedDirection, x = i.nextTargetMatrix || s.targetMatrix, y = c ? 4 : 3, b = ap(a, e, r, f, d, l), w = o ? p : 0, E = o ? h : 0, _ = Mn(u, x, b, y), D = op(n, _, e, r, y, g);
  return vt(D, [w, E]);
}
function vp(t, e) {
  return ee(_e(t.state), e);
}
function hp(t, e) {
  var r = t.targetGesto, n = t.controlGesto, a;
  return r != null && r.isFlag() && (a = r.getEventData()[e]), !a && (n != null && n.isFlag()) && (a = n.getEventData()[e]), a || {};
}
function gp(t) {
  if (t && t.getRootNode) {
    var e = t.getRootNode();
    if (e.nodeType === 11)
      return e;
  }
}
function mp(t) {
  var e = t("scale"), r = t("rotate"), n = t("translate"), a = [];
  return n && n !== "0px" && n !== "none" && a.push("translate(".concat(n.split(/\s+/).join(","), ")")), r && r !== "1" && r !== "none" && a.push("rotate(".concat(r, ")")), e && e !== "1" && e !== "none" && a.push("scale(".concat(e.split(/\s+/).join(","), ")")), a;
}
function su(t, e, r) {
  for (var n = t, a = [], i = eo(t) || or(t), o = !r && t === e || t === i, s = o, l = !1, u = 3, c, f, d, p = !1, h = yn(e, e, !0).offsetParent, g = 1; n && !s; ) {
    s = o;
    var x = he(n), y = x("position"), b = Ru(n), w = y === "fixed", E = mp(x), _ = id(vv(b)), D = void 0, M = !1, m = !1, I = 0, k = 0, z = 0, P = 0, R = {
      hasTransform: !1,
      fixedContainer: null
    };
    w && (p = !0, R = yv(n), h = R.fixedContainer);
    var A = _.length;
    !l && (A === 16 || E.length) && (l = !0, u = 4, Ai(a), d && (d = Pe(d, 3, 4))), l && A === 9 && (_ = Pe(_, 3, 4));
    var j = xv(n, t), W = j.tagName, X = j.hasOffset, L = j.isSVG, q = j.origin, V = j.targetOrigin, F = j.offset, et = N(F, 2), tt = et[0], K = et[1];
    W === "svg" && !n.ownerSVGElement && d && (a.push({
      type: "target",
      target: n,
      matrix: bv(n, u)
    }), a.push({
      type: "offset",
      target: n,
      matrix: At(u)
    }));
    var nt = parseFloat(x("zoom")) || 1;
    if (w)
      D = R.fixedContainer, M = !0;
    else {
      var Q = yn(n, e, !1, !0, x), at = Q.offsetZoom;
      if (D = Q.offsetParent, M = Q.isEnd, m = Q.isStatic, g *= at, (Q.isCustomElement || at !== 1) && m)
        tt -= D.offsetLeft, K -= D.offsetTop;
      else if (Vd || qd) {
        var it = Q.parentSlotElement;
        if (it) {
          for (var mt = D, bt = 0, Z = 0; mt && gp(mt); )
            bt += mt.offsetLeft, Z += mt.offsetTop, mt = mt.offsetParent;
          tt -= bt, K -= Z;
        }
      }
    }
    if (Kl && !Ud && X && !L && m && (y === "relative" || y === "static") && (tt -= D.offsetLeft, K -= D.offsetTop, o = o || M), w)
      X && R.hasTransform && (z = D.clientLeft, P = D.clientTop);
    else if (X && h !== D && (I = D.clientLeft, k = D.clientTop), X && D === i) {
      var ut = Ou(n, !1);
      tt += ut[0], K += ut[1];
    }
    if (a.push({
      type: "target",
      target: n,
      matrix: cn(_, u, q)
    }), E.length && (a.push({
      type: "offset",
      target: n,
      matrix: At(u)
    }), a.push({
      type: "target",
      target: n,
      matrix: cn(jr(E), u, q)
    })), X) {
      var Et = n === t, pt = Et ? 0 : n.scrollLeft, ht = Et ? 0 : n.scrollTop;
      a.push({
        type: "offset",
        target: n,
        matrix: mr([
          tt - pt + I - z,
          K - ht + k - P
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
      matrix: cn(ro([nt, nt], u), u, [0, 0])
    }), d || (d = _), c || (c = q), f || (f = V), s || w)
      break;
    n = D, o = M, (!r || n === i) && (s = o);
  }
  return d || (d = At(u)), c || (c = [0, 0]), f || (f = [0, 0]), {
    zoom: g,
    offsetContainer: h,
    matrixes: a,
    targetMatrix: d,
    transformOrigin: c,
    targetOrigin: f,
    is3d: l,
    hasFixed: p
  };
}
var cr = null, fr = null, Rr = null;
function Fr(t) {
  t ? (window.Map && (cr = /* @__PURE__ */ new Map(), fr = /* @__PURE__ */ new Map()), Rr = []) : (cr = null, Rr = null, fr = null);
}
function xp(t) {
  var e = fr == null ? void 0 : fr.get(t);
  if (e)
    return e;
  var r = fn(t, !0);
  return fr && fr.set(t, r), r;
}
function yp(t, e) {
  if (Rr) {
    var r = xe(Rr, function(a) {
      return a[0][0] == t && a[0][1] == e;
    });
    if (r)
      return r[1];
  }
  var n = su(t, e, !0);
  return Rr && Rr.push([[t, e], n]), n;
}
function he(t) {
  var e = cr == null ? void 0 : cr.get(t);
  if (!e) {
    var r = Ce(t).getComputedStyle(t);
    if (!cr)
      return function(i) {
        return r[i];
      };
    e = {
      style: r,
      cached: {}
    }, cr.set(t, e);
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
    return i[s] = i[s] || {}, i[s][e] = i[s][e] || {}, O(O({}, r), { isRequestChild: !0, datas: i[s][e], originalDatas: i[s] });
  });
}
function Ja(t, e, r, n, a, i, o) {
  var s = !!r.match(/Start$/g), l = !!r.match(/End$/g), u = a.isPinch, c = a.datas, f = Re(t, e.name, a), d = t.moveables, p = [], h = f.map(function(g, x) {
    var y = d[x], b = y.state, w = b.gestos, E = g;
    if (s)
      E = new Gr(o).dragStart(n, g), p.push(E);
    else {
      if (w[o] || (w[o] = c.childGestos[x]), !w[o])
        return;
      E = _n(g, b, n, u, i, o), p.push(E);
    }
    var _ = e[r](y, O(O({}, E), { parentFlag: !0 }));
    return l && (w[o] = null), _;
  });
  return s && (c.childGestos = d.map(function(g) {
    return g.state.gestos[o];
  })), {
    eventParams: h,
    childEvents: p
  };
}
function Ve(t, e, r, n, a, i) {
  a === void 0 && (a = function(c, f) {
    return f;
  });
  var o = !!r.match(/End$/g), s = Re(t, e.name, n), l = t.moveables, u = s.map(function(c, f) {
    var d = l[f], p = c;
    p = a(d, c);
    var h = e[r](d, O(O({}, p), { parentFlag: !0 }));
    return o && (d.state.gestos = {}), h;
  });
  return u;
}
function ha(t, e, r, n) {
  var a = r.fixedDirection, i = r.fixedPosition, o = n.datas.startPositions || _e(e.state), s = ee(o, a), l = N(se(Cn(-t.rotation / 180 * Math.PI, 3), [s[0] - i[0], s[1] - i[1], 1], 3), 2), u = l[0], c = l[1];
  return n.datas.originalX = u, n.datas.originalY = c, n;
}
function lu(t, e, r, n) {
  var a = t.getState(), i = a.renderPoses, o = a.rotation, s = a.direction, l = yr(t.props, e).zoom, u = un(o / Math.PI * 180), c = {}, f = t.renderState;
  f.renderDirectionMap || (f.renderDirectionMap = {});
  var d = f.renderDirectionMap;
  r.forEach(function(h) {
    var g = h.dir;
    c[g] = !0;
  });
  var p = ue(s);
  return r.map(function(h) {
    var g = h.data, x = h.classNames, y = h.dir, b = uo[y];
    if (!b || !c[y])
      return null;
    d[y] = !0;
    var w = (xt(u, 15) + p * tu[y] + 720) % 180, E = {};
    return Xr(g).forEach(function(_) {
      E["data-".concat(_)] = g[_];
    }), n.createElement("div", O({ className: dt.apply(void 0, J(["control", "direction", y, e], N(x), !1)), "data-rotation": w, "data-direction": y }, E, { key: "direction-".concat(y), style: ya.apply(void 0, J([o, l], N(b.map(function(_) {
      return i[_];
    })), !1)) }));
  });
}
function uu(t, e, r, n) {
  var a = yr(t.props, r), i = a.renderDirections, o = i === void 0 ? e : i, s = a.displayAroundControls;
  if (!o)
    return [];
  var l = o === !0 ? so : o;
  return J(J([], N(s ? pu(t, n, r, l) : []), !1), N(lu(t, r, l.map(function(u) {
    return {
      data: {},
      classNames: [],
      dir: u
    };
  }), n)), !1);
}
function xn(t, e, r, n, a, i) {
  for (var o = [], s = 6; s < arguments.length; s++)
    o[s - 6] = arguments[s];
  var l = Xt(r, n), u = e ? xt(l / Math.PI * 180, 15) % 180 : -1;
  return t.createElement("div", { key: "line-".concat(i), className: dt.apply(void 0, J(["line", "direction", e ? "edge" : "", e], N(o), !1)), "data-rotation": u, "data-line-key": i, "data-direction": e, style: an(r, n, a, l) });
}
function cu(t, e, r, n, a) {
  var i = r === !0 ? Ld : r;
  return i.map(function(o, s) {
    var l = N(uo[o], 2), u = l[0], c = l[1];
    if (c != null)
      return xn(t, o, n[u], n[c], a, "".concat(e, "Edge").concat(s), e);
  }).filter(Boolean);
}
function fu(t) {
  return function(e, r) {
    var n = yr(e.props, t).edge;
    return n && (n === !0 || n.length) ? J(J([], N(cu(r, t, n, e.getState().renderPoses, e.props.zoom)), !1), N(bp(e, t, r)), !1) : du(e, t, r);
  };
}
function du(t, e, r) {
  return uu(t, so, e, r);
}
function bp(t, e, r) {
  return uu(t, ["nw", "ne", "sw", "se"], e, r);
}
function pu(t, e, r, n) {
  var a = t.renderState;
  a.renderDirectionMap || (a.renderDirectionMap = {});
  var i = t.getState(), o = i.renderPoses, s = i.rotation, l = i.direction, u = a.renderDirectionMap, c = t.props.zoom, f = ue(l), d = s / Math.PI * 180;
  return (n || Xr(u)).map(function(p) {
    var h = uo[p];
    if (!h)
      return null;
    var g = (xt(d, 15) + f * tu[p] + 720) % 180, x = ["around-control"];
    return r && x.push("direction", r), e.createElement("div", { className: dt.apply(void 0, J([], N(x), !1)), "data-rotation": g, "data-direction": p, key: "direction-around-".concat(p), style: ya.apply(void 0, J([s, c], N(h.map(function(y) {
      return o[y];
    })), !1)) });
  });
}
function po(t, e, r) {
  var n = t || {}, a = n.position, i = a === void 0 ? "client" : a, o = n.left, s = o === void 0 ? -1 / 0 : o, l = n.top, u = l === void 0 ? -1 / 0 : l, c = n.right, f = c === void 0 ? 1 / 0 : c, d = n.bottom, p = d === void 0 ? 1 / 0 : d, h = {
    position: i,
    left: s,
    top: u,
    right: f,
    bottom: p
  };
  return {
    vertical: Ms(h, e, !0),
    horizontal: Ms(h, r, !1)
  };
}
function Ta(t, e) {
  var r = t.state, n = r.containerClientRect, a = n.clientHeight, i = n.clientWidth, o = n.clientLeft, s = n.clientTop, l = r.snapOffset, u = l.left, c = l.top, f = l.right, d = l.bottom, p = e || t.props.bounds || {}, h = p.position || "client", g = h === "css", x = p.left, y = x === void 0 ? -1 / 0 : x, b = p.top, w = b === void 0 ? -1 / 0 : b, E = p.right, _ = E === void 0 ? g ? -1 / 0 : 1 / 0 : E, D = p.bottom, M = D === void 0 ? g ? -1 / 0 : 1 / 0 : D;
  return g && (_ = i + f - u - _, M = a + d - c - M), {
    left: y + u - o,
    right: _ + u - o,
    top: w + c - s,
    bottom: M + c - s
  };
}
function Sp(t, e, r) {
  var n = Ta(t), a = n.left, i = n.top, o = n.right, s = n.bottom, l = N(r, 2), u = l[0], c = l[1], f = N(vt(r, e), 2), d = f[0], p = f[1];
  H(d) < fe && (d = 0), H(p) < fe && (p = 0);
  var h = p > 0, g = d > 0, x = {
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
    g ? o < u && (x.pos = o, x.offset = u - o) : a > u && (x.pos = a, x.offset = u - a);
  else {
    var b = p / d, w = r[1] - b * u, E = 0, _ = 0, D = !1;
    g && o <= u ? (E = b * o + w, _ = o, D = !0) : !g && u <= a && (E = b * a + w, _ = a, D = !0), D && (E < i || E > s) && (D = !1), D || (h && s <= c ? (E = s, _ = (E - w) / b, D = !0) : !h && c <= i && (E = i, _ = (E - w) / b, D = !0)), D && (x.isBound = !0, x.pos = _, x.offset = u - _, y.isBound = !0, y.pos = E, y.offset = c - E);
  }
  return {
    vertical: x,
    horizontal: y
  };
}
function Ms(t, e, r) {
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
function ks(t, e, r) {
  var n = r ? t.map(function(a) {
    return Sn(a, r);
  }) : t;
  return n.some(function(a) {
    return a[0] < e.left && H(a[0] - e.left) > 0.1 || a[0] > e.right && H(a[0] - e.right) > 0.1 || a[1] < e.top && H(a[1] - e.top) > 0.1 || a[1] > e.bottom && H(a[1] - e.bottom) > 0.1;
  });
}
function Cp(t, e, r) {
  var n = De(t), a = Math.sqrt(n * n - e * e) || 0;
  return [a, -a].sort(function(i, o) {
    return H(i - t[r ? 0 : 1]) - H(o - t[r ? 0 : 1]);
  }).map(function(i) {
    return Xt([0, 0], r ? [i, e] : [e, i]);
  });
}
function Ep(t, e, r, n, a) {
  if (!t.props.bounds)
    return [];
  var i = a * Math.PI / 180, o = Ta(t), s = o.left, l = o.top, u = o.right, c = o.bottom, f = s - n[0], d = u - n[0], p = l - n[1], h = c - n[1], g = {
    left: f,
    top: p,
    right: d,
    bottom: h
  };
  if (!ks(r, g, 0))
    return [];
  var x = [];
  return [
    [f, 0],
    [d, 0],
    [p, 1],
    [h, 1]
  ].forEach(function(y) {
    var b = N(y, 2), w = b[0], E = b[1];
    r.forEach(function(_) {
      var D = Xt([0, 0], _);
      x.push.apply(x, J([], N(Cp(_, w, E).map(function(M) {
        return i + M - D;
      }).filter(function(M) {
        return !ks(e, g, M);
      }).map(function(M) {
        return xt(M * 180 / Math.PI, fe);
      })), !1));
    });
  }), x;
}
var wp = ["left", "right", "center"], Dp = ["top", "bottom", "middle"], Ts = {
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
function Or() {
  return {
    left: !1,
    top: !1,
    right: !1,
    bottom: !1
  };
}
function qr(t, e) {
  var r = t.props, n = r.snappable, a = r.bounds, i = r.innerBounds, o = r.verticalGuidelines, s = r.horizontalGuidelines, l = r.snapGridWidth, u = r.snapGridHeight, c = t.state, f = c.guidelines, d = c.enableSnap;
  return !n || !d || e && n !== !0 && n.indexOf(e) < 0 ? !1 : !!(l || u || a || i || f && f.length || o && o.length || s && s.length);
}
function vo(t) {
  return t === !1 ? {} : t === !0 || !t ? { left: !0, right: !0, top: !0, bottom: !0 } : t;
}
function _p(t, e) {
  var r = vo(t), n = {};
  for (var a in r)
    a in e && r[a] && (n[a] = e[a]);
  return n;
}
function ho(t, e) {
  var r = _p(t, e), n = Dp.filter(function(i) {
    return i in r;
  }), a = wp.filter(function(i) {
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
function Mp(t, e, r) {
  var n = Gt(t, [e.clientLeft, e.clientTop], r);
  return [
    e.left + n[0],
    e.top + n[1]
  ];
}
function kp(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  Math.abs(a) < Jt && (a = 0), Math.abs(i) < Jt && (i = 0);
  var o = 0, s = 0, l = 0;
  return a ? i ? (o = -i / a, s = 1, l = o * r[0] - r[1]) : (s = 1, l = -r[1]) : (o = -1, l = r[0]), [o, s, l].map(function(u) {
    return xt(u, Jt);
  });
}
var vu = "snapRotationThreshold", hu = "snapRotationDegrees", gu = "snapHorizontalThreshold", mu = "snapVerticalThreshold";
function Ia(t, e, r, n, a, i, o) {
  var s;
  n === void 0 && (n = []), a === void 0 && (a = []);
  var l = t.props, u = ((s = t.state.snapThresholdInfo) === null || s === void 0 ? void 0 : s.multiples) || [1, 1], c = Xs(o, l[gu], 5), f = Xs(i, l[mu], 5);
  return xu(t.state.guidelines, e, r, n, a, c, f, u);
}
function xu(t, e, r, n, a, i, o, s) {
  return {
    vertical: Rs(t, "vertical", e, o * s[0], n),
    horizontal: Rs(t, "horizontal", r, i * s[1], a)
  };
}
function Tp(t, e, r) {
  var n = N(r, 2), a = n[0], i = n[1], o = N(e, 2), s = o[0], l = o[1], u = N(vt(r, e), 2), c = u[0], f = u[1], d = f > 0, p = c > 0;
  c = ba(c), f = ba(f);
  var h = {
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
      vertical: h,
      horizontal: g
    };
  var x = Ia(t, c ? [a] : [], f ? [i] : [], [], [], void 0, void 0), y = x.vertical, b = x.horizontal;
  y.posInfos.filter(function(W) {
    var X = W.pos;
    return p ? X >= s : X <= s;
  }), b.posInfos.filter(function(W) {
    var X = W.pos;
    return d ? X >= l : X <= l;
  }), y.isSnap = y.posInfos.length > 0, b.isSnap = b.posInfos.length > 0;
  var w = Ri(y), E = w.isSnap, _ = w.guideline, D = Ri(b), M = D.isSnap, m = D.guideline, I = M ? m.pos[1] : 0, k = E ? _.pos[0] : 0;
  if (c === 0)
    M && (g.isSnap = !0, g.pos = m.pos[1], g.offset = i - g.pos);
  else if (f === 0)
    E && (h.isSnap = !0, h.pos = k, h.offset = a - k);
  else {
    var z = f / c, P = r[1] - z * a, R = 0, A = 0, j = !1;
    E ? (A = k, R = z * A + P, j = !0) : M && (R = I, A = (R - P) / z, j = !0), j && (h.isSnap = !0, h.pos = A, h.offset = a - A, g.isSnap = !0, g.pos = R, g.offset = i - R);
  }
  return {
    vertical: h,
    horizontal: g
  };
}
function tr(t) {
  var e = "";
  return t === -1 || t === "top" || t === "left" ? e = "start" : t === 0 || t === "center" || t === "middle" ? e = "center" : (t === 1 || t === "right" || t === "bottom") && (e = "end"), e;
}
function Is(t, e, r, n) {
  var a = ho(t.props.snapDirections, e), i = Ia(t, a.vertical, a.horizontal, a.verticalNames.map(function(l) {
    return tr(l);
  }), a.horizontalNames.map(function(l) {
    return tr(l);
  }), r, n), o = tr(a.horizontalNames[i.horizontal.index]), s = tr(a.verticalNames[i.vertical.index]);
  return {
    vertical: O(O({}, i.vertical), { direction: s }),
    horizontal: O(O({}, i.horizontal), { direction: o })
  };
}
function Ri(t) {
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
function Rs(t, e, r, n, a) {
  var i, o;
  if (a === void 0 && (a = []), !t || !t.length)
    return {
      isSnap: !1,
      index: -1,
      direction: "",
      posInfos: []
    };
  var s = e === "vertical", l = s ? 0 : 1, u = r.map(function(f, d) {
    var p = a[d] || "", h = t.map(function(g) {
      var x = g.pos, y = f - x[l];
      return {
        offset: y,
        dist: H(y),
        guideline: g,
        direction: p
      };
    }).filter(function(g) {
      var x = g.guideline, y = g.dist, b = x.type;
      return !(b !== e || y > n);
    }).sort(function(g, x) {
      return g.dist - x.dist;
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
function Ip(t, e, r, n, a) {
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
    var g = h[p + 1] || h[0];
    i.push(d), i.push([
      (d[0] + g[0]) / 2,
      (d[1] + g[1]) / 2
    ]);
  }) : t.props.keepRatio ? i.push([-1, -1], [-1, 1], [1, -1], [1, 1], r) : (i.push.apply(i, J([], N(ip([
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
  }), u = Ia(t, s, l, i.map(function(d) {
    return tr(d[0]);
  }), i.map(function(d) {
    return tr(d[1]);
  }), n, a), c = tr(i.map(function(d) {
    return d[0];
  })[u.vertical.index]), f = tr(i.map(function(d) {
    return d[1];
  })[u.horizontal.index]);
  return {
    vertical: O(O({}, u.vertical), { direction: c }),
    horizontal: O(O({}, u.horizontal), { direction: f })
  };
}
function yu(t, e) {
  var r = H(t.offset), n = H(e.offset);
  return t.isBound && e.isBound ? n - r : t.isBound ? -1 : e.isBound ? 1 : t.isSnap && e.isSnap ? n - r : t.isSnap ? -1 : e.isSnap || r < fe ? 1 : n < fe ? -1 : r - n;
}
function ga(t, e) {
  return t.slice().sort(function(r, n) {
    var a = r.sign[e], i = n.sign[e], o = r.offset[e], s = n.offset[e];
    if (a) {
      if (!i)
        return -1;
    } else return 1;
    return yu({ isBound: r.isBound, isSnap: r.isSnap, offset: o }, { isBound: n.isBound, isSnap: n.isSnap, offset: s });
  })[0];
}
function Rp(t, e, r) {
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
function bu(t, e) {
  var r = mi([e[0][0], e[1][0]]), n = mi([e[0][1], e[1][1]]);
  return {
    vertical: r <= t[0],
    horizontal: n <= t[1]
  };
}
function go(t, e) {
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
function Su(t, e, r, n) {
  return n === void 0 && (n = fe), t.every(function(a) {
    var i = go(a, e), o = i <= 0;
    return o === r || H(i) <= n;
  });
}
function Os(t, e, r, n, a) {
  return a === void 0 && (a = 0), n && e - a <= t || !n && t <= r + a ? {
    isBound: !0,
    offset: n ? e - t : r - t
  } : {
    isBound: !1,
    offset: 0
  };
}
function Op(t, e) {
  var r = e.line, n = e.centerSign, a = e.verticalSign, i = e.horizontalSign, o = e.lineConstants, s = t.props.innerBounds;
  if (!s)
    return {
      isAllBound: !1,
      isBound: !1,
      isVerticalBound: !1,
      isHorizontalBound: !1,
      offset: [0, 0]
    };
  var l = s.left, u = s.top, c = s.width, f = s.height, d = [[l, u], [l, u + f]], p = [[l, u], [l + c, u]], h = [[l + c, u], [l + c, u + f]], g = [[l, u + f], [l + c, u + f]];
  if (Su([
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
  var x = er(r, o, p, a), y = er(r, o, g, a), b = er(r, o, d, i), w = er(r, o, h, i), E = x.isBound && y.isBound, _ = x.isBound || y.isBound, D = b.isBound && w.isBound, M = b.isBound || w.isBound, m = Lr(x.offset, y.offset), I = Lr(b.offset, w.offset), k = [0, 0], z = !1, P = !1;
  return H(I) < H(m) ? (k = [m, 0], z = _, P = E) : (k = [0, I], z = M, P = D), {
    isAllBound: P,
    isVerticalBound: _,
    isHorizontalBound: M,
    isBound: z,
    offset: k
  };
}
function er(t, e, r, n, a, i) {
  var o = N(e, 2), s = o[0], l = o[1], u = t[0], c = r[0], f = r[1], d = ba(f[1] - c[1]), p = ba(f[0] - c[0]), h = l, g = s, x = -s / l;
  if (p) {
    if (!d) {
      if (i && !h)
        return {
          isBound: !1,
          offset: 0
        };
      if (g) {
        var E = (c[1] - u[1]) / x + u[0];
        return Os(E, c[0], f[0], n, a);
      } else {
        var b = c[1] - u[1], w = H(b) <= (a || 0);
        return {
          isBound: w,
          offset: w ? b : 0
        };
      }
    }
  } else {
    if (i && !g)
      return {
        isBound: !1,
        offset: 0
      };
    if (h) {
      var y = x * (c[0] - u[0]) + u[1];
      return Os(y, c[1], f[1], n, a);
    } else {
      var b = c[0] - u[0], w = H(b) <= (a || 0);
      return {
        isBound: w,
        offset: w ? b : 0
      };
    }
  }
  return {
    isBound: !1,
    offset: 0
  };
}
function Cu(t, e, r) {
  return e.map(function(n) {
    var a = Op(t, n), i = a.isBound, o = a.offset, s = a.isVerticalBound, l = a.isHorizontalBound, u = n.multiple, c = Fe({
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
function Pp(t, e, r) {
  var n, a = mo(t, e, [0, 0], !1).map(function(d) {
    return O(O({}, d), { multiple: d.multiple.map(function(p) {
      return H(p) * 2;
    }) });
  }), i = Cu(t, a, r), o = ga(i, 0), s = ga(i, 1), l = 0, u = 0, c = o.isVerticalBound || s.isVerticalBound, f = o.isHorizontalBound || s.isHorizontalBound;
  return (c || f) && (n = N(np({
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
function Np(t, e) {
  var r = [], n = t[0], a = t[1];
  return n && a ? r.push([[0, a * 2], t, [-n, a]], [[n * 2, 0], t, [n, -a]]) : n ? (r.push([[n * 2, 0], [n, 1], [n, -1]]), e && r.push([[0, -1], [n, -1], [-n, -1]], [[0, 1], [n, 1], [-n, 1]])) : a ? (r.push([[0, a * 2], [1, a], [-1, a]]), e && r.push([[-1, 0], [-1, a], [-1, -a]], [[1, 0], [1, a], [1, -a]])) : r.push([[-1, 0], [-1, -1], [-1, 1]], [[1, 0], [1, -1], [1, 1]], [[0, -1], [-1, -1], [1, -1]], [[0, 1], [-1, 1], [1, 1]]), r;
}
function mo(t, e, r, n) {
  var a = t.state, i = a.allMatrix, o = a.is3d, s = Sr(i, 100, 100, o ? 4 : 3), l = ee(s, [0, 0]);
  return Np(r, n).map(function(u) {
    var c = N(u, 3), f = c[0], d = c[1], p = c[2], h = [
      ee(s, d),
      ee(s, p)
    ], g = kp(h), x = bu(l, h), y = x.vertical, b = x.horizontal, w = go(l, h) <= 0;
    return {
      multiple: f,
      centerSign: w,
      verticalSign: y,
      horizontalSign: b,
      lineConstants: g,
      line: [
        ee(e, d),
        ee(e, p)
      ]
    };
  });
}
function Ps(t, e, r, n) {
  var a = n ? t.map(function(i) {
    return Sn(i, n);
  }) : t;
  return [
    [a[0], a[1]],
    [a[1], a[3]],
    [a[3], a[2]],
    [a[2], a[0]]
  ].some(function(i) {
    var o = go(r, i) <= 0;
    return !Su(e, i, o);
  });
}
function zp(t) {
  var e = N(t, 2), r = e[0], n = e[1], a = n[0] - r[0], i = n[1] - r[1];
  if (!a)
    return H(r[0]);
  if (!i)
    return H(r[1]);
  var o = i / a;
  return H((-o * r[0] + r[1]) / Math.sqrt(Math.pow(o, 2) + 1));
}
function Ap(t) {
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
function jp(t, e, r, n, a) {
  var i = t.props.innerBounds, o = a * Math.PI / 180;
  if (!i)
    return [];
  var s = i.left, l = i.top, u = i.width, c = i.height, f = s - n[0], d = s + u - n[0], p = l - n[1], h = l + c - n[1], g = [
    [f, p],
    [d, p],
    [f, h],
    [d, h]
  ], x = ee(r, [0, 0]);
  if (!Ps(r, g, x, 0))
    return [];
  var y = [], b = g.map(function(w) {
    return [
      De(w),
      Xt([0, 0], w)
    ];
  });
  return [
    [r[0], r[1]],
    [r[1], r[3]],
    [r[3], r[2]],
    [r[2], r[0]]
  ].forEach(function(w) {
    var E = Xt([0, 0], Ap(w)), _ = zp(w);
    y.push.apply(y, J([], N(b.filter(function(D) {
      var M = N(D, 1), m = M[0];
      return m && _ <= m;
    }).map(function(D) {
      var M = N(D, 2), m = M[0], I = M[1], k = Math.acos(m ? _ / m : 0), z = I + k, P = I - k;
      return [
        o + z - E,
        o + P - E
      ];
    }).reduce(function(D, M) {
      return D.push.apply(D, J([], N(M), !1)), D;
    }, []).filter(function(D) {
      return !Ps(e, g, x, D);
    }).map(function(D) {
      return xt(D * 180 / Math.PI, fe);
    })), !1));
  }), y;
}
function Bp(t) {
  var e = t.props.innerBounds, r = Or();
  if (!e)
    return {
      boundMap: r,
      vertical: [],
      horizontal: []
    };
  var n = t.getRect(), a = n.pos1, i = n.pos2, o = n.pos3, s = n.pos4, l = [a, i, o, s], u = ee(l, [0, 0]), c = e.left, f = e.top, d = e.width, p = e.height, h = [[c, f], [c, f + p]], g = [[c, f], [c + d, f]], x = [[c + d, f], [c + d, f + p]], y = [[c, f + p], [c + d, f + p]], b = mo(t, l, [0, 0], !1), w = [], E = [];
  return b.forEach(function(_) {
    var D = _.line, M = _.lineConstants, m = bu(u, D), I = m.horizontal, k = m.vertical, z = er(D, M, g, k, 1, !0), P = er(D, M, y, k, 1, !0), R = er(D, M, h, I, 1, !0), A = er(D, M, x, I, 1, !0);
    z.isBound && !r.top && (w.push(f), r.top = !0), P.isBound && !r.bottom && (w.push(f + p), r.bottom = !0), R.isBound && !r.left && (E.push(c), r.left = !0), A.isBound && !r.right && (E.push(c + d), r.right = !0);
  }), {
    boundMap: r,
    horizontal: w,
    vertical: E
  };
}
function Gp(t, e, r, n) {
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
function Oi(t, e, r, n, a) {
  var i = Gp(t, e, r, n);
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
function ma(t, e) {
  return t.isBound ? t.offset : e.isSnap ? Ri(e).offset : 0;
}
function Fp(t, e, r, n, a) {
  var i = N(e, 2), o = i[0], s = i[1], l = N(r, 2), u = l[0], c = l[1], f = N(n, 2), d = f[0], p = f[1], h = N(a, 2), g = h[0], x = h[1], y = -g, b = -x;
  if (t && o && s) {
    y = 0, b = 0;
    var w = [];
    if (u && c ? w.push([0, x], [g, 0]) : u ? w.push([g, 0]) : c ? w.push([0, x]) : d && p ? w.push([0, x], [g, 0]) : d ? w.push([g, 0]) : p && w.push([0, x]), w.length) {
      w.sort(function(M, m) {
        return De(vt([o, s], M)) - De(vt([o, s], m));
      });
      var E = w[0];
      if (E[0] && H(o) > Jt)
        y = -E[0], b = s * H(o + y) / H(o) - s;
      else if (E[1] && H(s) > Jt) {
        var _ = s;
        b = -E[1], y = o * H(s + b) / H(_) - o;
      }
      if (t && c && u)
        if (H(y) > Jt && H(y) < H(g)) {
          var D = H(g) / H(y);
          y *= D, b *= D;
        } else if (H(b) > Jt && H(b) < H(x)) {
          var D = H(x) / H(b);
          y *= D, b *= D;
        } else
          y = Lr(-g, y), b = Lr(-x, b);
    }
  } else
    y = o || u ? -g : 0, b = s || c ? -x : 0;
  return [y, b];
}
function Lp(t, e, r, n, a, i) {
  if (!qr(t, "draggable"))
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
  var o = bo(i.absolutePoses, [e, r]), s = Ee(o), l = s.left, u = s.right, c = s.top, f = s.bottom, d = {
    horizontal: o.map(function(A) {
      return A[1];
    }),
    vertical: o.map(function(A) {
      return A[0];
    })
  }, p = vo(t.props.snapDirections), h = ho(p, {
    left: l,
    right: u,
    top: c,
    bottom: f,
    center: (l + u) / 2,
    middle: (c + f) / 2
  }), g = Ra(t, a, h, d), x = g.vertical, y = g.horizontal, b = Pp(t, o, i), w = b.vertical, E = b.horizontal, _ = x.isSnap, D = y.isSnap, M = x.isBound || w.isBound, m = y.isBound || E.isBound, I = Lr(x.offset, w.offset), k = Lr(y.offset, E.offset), z = N(Fp(n, [e, r], [M, m], [_, D], [I, k]), 2), P = z[0], R = z[1];
  return [
    {
      isBound: M,
      isSnap: _,
      offset: P
    },
    {
      isBound: m,
      isSnap: D,
      offset: R
    }
  ];
}
function Ra(t, e, r, n) {
  n === void 0 && (n = r);
  var a = po(Ta(t), n.vertical, n.horizontal), i = a.horizontal, o = a.vertical, s = e ? {
    horizontal: { isSnap: !1, index: -1 },
    vertical: { isSnap: !1, index: -1 }
  } : Ia(t, r.vertical, r.horizontal, void 0, void 0, void 0, void 0), l = s.horizontal, u = s.vertical, c = ma(i[0], l), f = ma(o[0], u), d = H(c), p = H(f);
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
function Ns(t, e, r, n, a, i, o) {
  o === void 0 && (o = [1, 1]);
  var s = po(e, r, n), l = s.horizontal, u = s.vertical, c = xu(t, r, n, [], [], a, i, o), f = c.horizontal, d = c.vertical, p = ma(l[0], f), h = ma(u[0], d), g = H(p), x = H(h);
  return {
    horizontal: {
      isBound: l[0].isBound,
      isSnap: f.isSnap,
      snapIndex: f.index,
      offset: p,
      dist: g,
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
function Wp(t, e, r, n) {
  var a = Xt(t, e) / Math.PI * 180, i = r.vertical, o = i.isBound, s = i.isSnap, l = i.dist, u = r.horizontal, c = u.isBound, f = u.isSnap, d = u.dist, p = a % 180, h = p < 3 || p > 177, g = p > 87 && p < 93;
  return d < l && (o || s && !g && (!n || !h)) ? "vertical" : c || f && !h && (!n || !g) ? "horizontal" : "";
}
function Yp(t, e, r, n, a, i) {
  return r.map(function(o) {
    var s = N(o, 2), l = s[0], u = s[1], c = ee(e, l), f = ee(e, u), d = n ? Xp(t, c, f, a) : Ra(t, a, {
      vertical: [f[0]],
      horizontal: [f[1]]
    }), p = d.horizontal, h = p.offset, g = p.isBound, x = p.isSnap, y = d.vertical, b = y.offset, w = y.isBound, E = y.isSnap, _ = vt(u, l);
    if (!b && !h)
      return {
        isBound: w || g,
        isSnap: E || x,
        sign: _,
        offset: [0, 0]
      };
    var D = Wp(c, f, d, n);
    if (!D)
      return {
        sign: _,
        isBound: !1,
        isSnap: !1,
        offset: [0, 0]
      };
    var M = D === "vertical", m = [0, 0];
    return !n && H(u[0]) === 1 && H(u[1]) === 1 && l[0] !== u[0] && l[1] !== u[1] ? m = Fe({
      datas: i,
      distX: -b,
      distY: -h
    }) : m = Oi(c, f, -(M ? b : h), M, i).offset, m = m.map(function(I, k) {
      return I * (_[k] ? 2 / _[k] : 0);
    }), {
      sign: _,
      isBound: M ? w : g,
      isSnap: M ? E : x,
      offset: m
    };
  });
}
function zs(t, e) {
  return t.isBound ? t.offset : e.isSnap ? e.offset : 0;
}
function Xp(t, e, r, n) {
  var a = Sp(t, e, r), i = a.horizontal, o = a.vertical, s = n ? {
    horizontal: { isSnap: !1 },
    vertical: { isSnap: !1 }
  } : Tp(t, e, r), l = s.horizontal, u = s.vertical, c = zs(i, l), f = zs(o, u), d = H(c), p = H(f);
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
function Hp(t, e, r, n, a) {
  var i = [-r[0], -r[1]], o = t.state, s = o.width, l = o.height, u = t.props.bounds, c = 1 / 0, f = 1 / 0;
  if (u) {
    var d = [
      [r[0], -r[1]],
      [-r[0], r[1]]
    ], p = u.left, h = p === void 0 ? -1 / 0 : p, g = u.top, x = g === void 0 ? -1 / 0 : g, y = u.right, b = y === void 0 ? 1 / 0 : y, w = u.bottom, E = w === void 0 ? 1 / 0 : w;
    d.forEach(function(_) {
      var D = _[0] !== i[0], M = _[1] !== i[1], m = ee(e, _), I = Xt(n, m) * 360 / Math.PI;
      if (M) {
        var k = m.slice();
        (H(I - 360) < 2 || H(I - 180) < 2) && (k[1] = n[1]);
        var z = Oi(n, k, (n[1] < m[1] ? E : x) - m[1], !1, a), P = N(z.offset, 2), R = P[1], A = z.isOutside;
        isNaN(R) || (f = l + (A ? 1 : -1) * H(R));
      }
      if (D) {
        var k = m.slice();
        (H(I - 90) < 2 || H(I - 270) < 2) && (k[0] = n[0]);
        var j = Oi(n, k, (n[0] < m[0] ? b : h) - m[0], !0, a), W = N(j.offset, 1), X = W[0], L = j.isOutside;
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
    var c = De(u), f = Xt(u, [0, 0]);
    return [e.createElement("div", { className: dt("line", "horizontal", "dragline", "dashed"), key: "dragRotateGuideline", style: {
      width: "".concat(c, "px"),
      transform: "translate(".concat(l[0], "px, ").concat(l[1], "px) rotate(").concat(f, "rad) scaleY(").concat(i, ")")
    } })];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.parentEvent, a = e.parentGesto, i = t.state, o = i.gestos, s = i.style;
    if (o.draggable)
      return !1;
    o.draggable = a || t.targetGesto, r.datas = {}, r.left = parseFloat(s.left || "") || 0, r.top = parseFloat(s.top || "") || 0, r.bottom = parseFloat(s.bottom || "") || 0, r.right = parseFloat(s.right || "") || 0, r.startValue = [0, 0], br(t, e), ka(t, e, "translate"), cv(t, r), r.prevDist = [0, 0], r.prevBeforeDist = [0, 0], r.isDrag = !1, r.deltaOffset = [0, 0];
    var l = wt(t, e, O({ set: function(c) {
      r.startValue = c;
    } }, Ma(t, e))), u = n || ft(t, "onDragStart", l);
    return u !== !1 ? (r.isDrag = !0, t.state.dragInfo = {
      startRect: t.getRect(),
      dist: [0, 0]
    }) : (o.draggable = null, r.isPinch = !1), r.isDrag ? l : !1;
  },
  drag: function(t, e) {
    if (e) {
      Da(t, e, "translate");
      var r = e.datas, n = e.parentEvent, a = e.parentFlag, i = e.isPinch, o = e.deltaOffset, s = e.useSnap, l = e.isRequest, u = e.isGroup, c = e.parentThrottleDrag, f = e.distX, d = e.distY, p = r.isDrag, h = r.prevDist, g = r.prevBeforeDist, x = r.startValue;
      if (p) {
        o && (f += o[0], d += o[1]);
        var y = t.props, b = y.parentMoveable, w = u ? 0 : y.throttleDrag || c || 0, E = n ? 0 : y.throttleDragRotate || 0, _ = 0, D = !1, M = !1, m = !1, I = !1;
        if (!n && E > 0 && (f || d)) {
          var k = y.startDragRotate || 0, z = xt(k + Xt([0, 0], [f, d]) * 180 / Math.PI, E) - k, P = d * Math.abs(Math.cos((z - 90) / 180 * Math.PI)), R = f * Math.abs(Math.cos(z / 180 * Math.PI)), A = De([R, P]);
          _ = z * Math.PI / 180, f = A * Math.cos(_), d = A * Math.sin(_);
        }
        if (!i && !n && !a) {
          var j = N(Lp(t, f, d, E, !s && l || o, r), 2), W = j[0], X = j[1];
          D = W.isSnap, M = W.isBound, m = X.isSnap, I = X.isBound;
          var L = W.offset, q = X.offset;
          f += L, d += q;
        }
        var V = Tt(nu({ datas: r, distX: f, distY: d }), x), F = Tt(rp({ datas: r, distX: f, distY: d }), x);
        Cs(F, fe), Cs(V, fe), E || (!D && !M && (F[0] = xt(F[0], w), V[0] = xt(V[0], w)), !m && !I && (F[1] = xt(F[1], w), V[1] = xt(V[1], w)));
        var et = vt(V, x), tt = vt(F, x), K = vt(tt, h), nt = vt(et, g);
        r.prevDist = tt, r.prevBeforeDist = et, r.passDelta = K, r.passDist = tt;
        var Q = r.left + et[0], at = r.top + et[1], it = r.right - et[0], mt = r.bottom - et[1], bt = _a(r, "translate(".concat(F[0], "px, ").concat(F[1], "px)"), "translate(".concat(tt[0], "px, ").concat(tt[1], "px)"));
        if (co(e, bt), t.state.dragInfo.dist = n ? [0, 0] : tt, !(!n && !b && K.every(function(ht) {
          return !ht;
        }) && nt.some(function(ht) {
          return !ht;
        }))) {
          var Z = t.state, ut = Z.width, Et = Z.height, pt = wt(t, e, O({ transform: bt, dist: tt, delta: K, translate: F, beforeDist: et, beforeDelta: nt, beforeTranslate: V, left: Q, top: at, right: it, bottom: mt, width: ut, height: Et, isPinch: i }, ce({
            transform: bt
          }, e)));
          return !n && ft(t, "onDrag", pt), pt;
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
      var a = ye(t, e, {});
      return !r && ft(t, "onDragEnd", a), a;
    }
  },
  dragGroupStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = this.dragStart(t, e);
    if (!s)
      return !1;
    var l = Ja(t, this, "dragStart", [
      i || 0,
      o || 0
    ], e, !1, "draggable"), u = l.childEvents, c = l.eventParams, f = O(O({}, s), { targets: t.props.targets, events: c }), d = ft(t, "onDragGroupStart", f);
    a.isDrag = d !== !1;
    var p = (n = (r = u[0]) === null || r === void 0 ? void 0 : r.datas.startValue) !== null && n !== void 0 ? n : [0, 0];
    return a.throttleOffset = [p[0] % 1, p[1] % 1], a.isDrag ? s : !1;
  },
  dragGroup: function(t, e) {
    var r = e.datas;
    if (r.isDrag) {
      var n = this.drag(t, O(O({}, e), { parentThrottleDrag: t.props.throttleDrag })), a = e.datas.passDelta, i = Ja(t, this, "drag", a, e, !1, "draggable").eventParams;
      if (n) {
        var o = O({ targets: t.props.targets, events: i }, n);
        return ft(t, "onDragGroup", o), o;
      }
    }
  },
  dragGroupEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isDrag) {
      this.dragEnd(t, e);
      var a = Ja(t, this, "dragEnd", [0, 0], e, !1, "draggable").eventParams;
      return ft(t, "onDragGroupEnd", ye(t, e, {
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
function Eu(t, e) {
  var r = ee(t, e), n = [0, 0];
  return {
    fixedPosition: r,
    fixedDirection: e,
    fixedOffset: n
  };
}
function $p(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = [
    a / 2 * (1 + e[0]),
    i / 2 * (1 + e[1])
  ], l = Gt(r, s, o), u = [0, 0];
  return {
    fixedPosition: l,
    fixedDirection: e,
    fixedOffset: u
  };
}
function wu(t, e) {
  var r = t.allMatrix, n = t.is3d, a = t.width, i = t.height, o = n ? 4 : 3, s = cp(e, a, i), l = Gt(r, e, o), u = [
    a ? 0 : e[0],
    i ? 0 : e[1]
  ];
  return {
    fixedPosition: l,
    fixedDirection: s,
    fixedOffset: u
  };
}
var As = Eo("resizable"), Pi = {
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
  render: fu("resizable"),
  dragControlCondition: As,
  viewClassName: Co("resizable"),
  dragControlStart: function(t, e) {
    var r, n = e.inputEvent, a = e.isPinch, i = e.isGroup, o = e.parentDirection, s = e.parentGesto, l = e.datas, u = e.parentFixedDirection, c = e.parentEvent, f = ju(o, a, n, l), d = t.state, p = d.target, h = d.width, g = d.height, x = d.gestos;
    if (!f || !p || x.resizable)
      return !1;
    x.resizable = s || t.controlGesto, !a && br(t, e), l.datas = {}, l.direction = f, l.startOffsetWidth = h, l.startOffsetHeight = g, l.prevWidth = 0, l.prevHeight = 0, l.minSize = [0, 0], l.startWidth = d.inlineCSSWidth || d.cssWidth, l.startHeight = d.inlineCSSHeight || d.cssHeight, l.maxSize = [1 / 0, 1 / 0], i || (l.minSize = [
      d.minOffsetWidth,
      d.minOffsetHeight
    ], l.maxSize = [
      d.maxOffsetWidth,
      d.maxOffsetHeight
    ]);
    var y = t.props.transformOrigin || "% %";
    l.transformOrigin = we(y) ? y.split(" ") : y, l.startOffsetMatrix = d.offsetMatrix, l.startTransformOrigin = d.transformOrigin, l.isWidth = (r = e == null ? void 0 : e.parentIsWidth) !== null && r !== void 0 ? r : !f[0] && !f[1] || f[0] || !f[1];
    function b(I) {
      l.ratio = I && isFinite(I) ? I : 0;
    }
    l.startPositions = _e(t.state);
    function w(I) {
      var k = Eu(l.startPositions, I);
      l.fixedDirection = k.fixedDirection, l.fixedPosition = k.fixedPosition, l.fixedOffset = k.fixedOffset;
    }
    function E(I) {
      var k = wu(t.state, I);
      l.fixedDirection = k.fixedDirection, l.fixedPosition = k.fixedPosition, l.fixedOffset = k.fixedOffset;
    }
    function _(I) {
      l.minSize = [
        Pt("".concat(I[0]), 0) || 0,
        Pt("".concat(I[1]), 0) || 0
      ];
    }
    function D(I) {
      var k = [
        I[0] || 1 / 0,
        I[1] || 1 / 0
      ];
      (!hn(k[0]) || isFinite(k[0])) && (k[0] = Pt("".concat(k[0]), 0) || 1 / 0), (!hn(k[1]) || isFinite(k[1])) && (k[1] = Pt("".concat(k[1]), 0) || 1 / 0), l.maxSize = k;
    }
    b(h / g), w(u || [-f[0], -f[1]]), l.setFixedDirection = w, l.setFixedPosition = E, l.setMin = _, l.setMax = D;
    var M = wt(t, e, {
      direction: f,
      startRatio: l.ratio,
      set: function(I) {
        var k = N(I, 2), z = k[0], P = k[1];
        l.startWidth = z, l.startHeight = P;
      },
      setMin: _,
      setMax: D,
      setRatio: b,
      setFixedDirection: w,
      setFixedPosition: E,
      setOrigin: function(I) {
        l.transformOrigin = I;
      },
      dragStart: le.dragStart(t, new Gr().dragStart([0, 0], e))
    }), m = c || ft(t, "onResizeStart", M);
    return l.startFixedDirection = l.fixedDirection, l.startFixedPosition = l.fixedPosition, m !== !1 && (l.isResize = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: f
    }), l.isResize ? M : !1;
  },
  dragControl: function(t, e) {
    var r, n = e.datas, a = e.parentFlag, i = e.isPinch, o = e.parentKeepRatio, s = e.dragClient, l = e.parentDist, u = e.useSnap, c = e.isRequest, f = e.isGroup, d = e.parentEvent, p = e.resolveMatrix, h = n.isResize, g = n.transformOrigin, x = n.startWidth, y = n.startHeight, b = n.prevWidth, w = n.prevHeight, E = n.minSize, _ = n.maxSize, D = n.ratio, M = n.startOffsetWidth, m = n.startOffsetHeight, I = n.isWidth;
    if (!h)
      return;
    if (p) {
      var k = t.state.is3d, z = n.startOffsetMatrix, P = n.startTransformOrigin, R = k ? 4 : 3, A = jr(va(e)), j = Math.sqrt(A.length);
      R !== j && (A = Pe(A, j, R));
      var W = Mn(z, A, P, R), X = Sr(W, M, m, R);
      n.startPositions = X, n.nextTargetMatrix = A, n.nextAllMatrix = W;
    }
    var L = yr(t.props, "resizable"), q = L.resizeFormat, V = L.throttleResize, F = V === void 0 ? a ? 0 : 1 : V, et = L.parentMoveable, tt = L.keepRatioFinally, K = n.direction, nt = K, Q = 0, at = 0;
    !K[0] && !K[1] && (nt = [1, 1]);
    var it = D && (o ?? L.keepRatio) || !1;
    function mt() {
      var Ft = n.fixedDirection, zt = Yu(nt, it, n, e);
      Q = zt.distWidth, at = zt.distHeight;
      var Me = nt[0] - Ft[0] || it ? Math.max(M + Q, fe) : M, ge = nt[1] - Ft[1] || it ? Math.max(m + at, fe) : m;
      return it && M && m && (I ? ge = Me / D : Me = ge * D), [Me, ge];
    }
    var bt = N(mt(), 2), Z = bt[0], ut = bt[1];
    d || (n.setFixedDirection(n.fixedDirection), ft(t, "onBeforeResize", wt(t, e, {
      startFixedDirection: n.startFixedDirection,
      startFixedPosition: n.startFixedPosition,
      setFixedDirection: function(Ft) {
        var zt;
        return n.setFixedDirection(Ft), zt = N(mt(), 2), Z = zt[0], ut = zt[1], [Z, ut];
      },
      setFixedPosition: function(Ft) {
        var zt;
        return n.setFixedPosition(Ft), zt = N(mt(), 2), Z = zt[0], ut = zt[1], [Z, ut];
      },
      boundingWidth: Z,
      boundingHeight: ut,
      setSize: function(Ft) {
        var zt;
        zt = N(Ft, 2), Z = zt[0], ut = zt[1];
      }
    }, !0)));
    var Et = s;
    s || (!a && i ? Et = vp(t, [0, 0]) : Et = n.fixedPosition);
    var pt = [0, 0];
    i || (pt = lv(t, Z, ut, K, Et, !u && c, n)), l && (!l[0] && (pt[0] = 0), !l[1] && (pt[1] = 0));
    function ht() {
      var Ft;
      q && (Ft = N(q([Z, ut]), 2), Z = Ft[0], ut = Ft[1]), Z = xt(Z, F), ut = xt(ut, F);
    }
    if (it) {
      nt[0] && nt[1] && pt[0] && pt[1] && (H(pt[0]) > H(pt[1]) ? pt[1] = 0 : pt[0] = 0);
      var St = !pt[0] && !pt[1];
      St && ht(), nt[0] && !nt[1] || pt[0] && !pt[1] || St && I ? (Z += pt[0], ut = Z / D) : (!nt[0] && nt[1] || !pt[0] && pt[1] || St && !I) && (ut += pt[1], Z = ut * D);
    } else
      Z += pt[0], ut += pt[1], Z = Math.max(0, Z), ut = Math.max(0, ut);
    r = N(Qi([Z, ut], E, _, it ? D : !1), 2), Z = r[0], ut = r[1], ht(), it && (f || tt) && (I ? ut = Z / D : Z = ut * D), Q = Z - M, at = ut - m;
    var gt = [Q - b, at - w];
    n.prevWidth = Q, n.prevHeight = at;
    var Mt = pp(t, Z, ut, Et, g, n);
    if (!(!et && gt.every(function(Ft) {
      return !Ft;
    }) && Mt.every(function(Ft) {
      return !Ft;
    }))) {
      var Ct = le.drag(t, _n(e, t.state, Mt, !!i, !1, "draggable")), kt = Ct.transform, Ht = x + Q, ne = y + at, $t = wt(t, e, O({ width: Ht, height: ne, offsetWidth: Math.round(Z), offsetHeight: Math.round(ut), startRatio: D, boundingWidth: Z, boundingHeight: ut, direction: K, dist: [Q, at], delta: gt, isPinch: !!i, drag: Ct }, Gu({
        style: {
          width: "".concat(Ht, "px"),
          height: "".concat(ne, "px")
        },
        transform: kt
      }, Ct, e)));
      return !d && ft(t, "onResize", $t), $t;
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
      return !n && ft(t, "onResizeEnd", a), a;
    }
  },
  dragGroupControlCondition: As,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, O(O({}, e), { isGroup: !0 }));
    if (!n)
      return !1;
    var a = Re(t, "resizable", e), i = r.startOffsetWidth, o = r.startOffsetHeight;
    function s() {
      var p = r.minSize;
      a.forEach(function(h) {
        var g = h.datas, x = g.minSize, y = g.startOffsetWidth, b = g.startOffsetHeight, w = i * (y ? x[0] / y : 0), E = o * (b ? x[1] / b : 0);
        p[0] = Math.max(p[0], w), p[1] = Math.max(p[1], E);
      });
    }
    function l() {
      var p = r.maxSize;
      a.forEach(function(h) {
        var g = h.datas, x = g.maxSize, y = g.startOffsetWidth, b = g.startOffsetHeight, w = i * (y ? x[0] / y : 0), E = o * (b ? x[1] / b : 0);
        p[0] = Math.min(p[0], w), p[1] = Math.min(p[1], E);
      });
    }
    var u = Ve(t, this, "dragControlStart", e, function(p, h) {
      return ha(t, p, r, h);
    });
    s(), l();
    var c = function(p) {
      n.setFixedDirection(p), u.forEach(function(h, g) {
        h.setFixedDirection(p), ha(t, h.moveable, r, a[g]);
      });
    };
    r.setFixedDirection = c;
    var f = O(O({}, n), { targets: t.props.targets, events: u.map(function(p) {
      return O(O({}, p), { setMin: function(h) {
        p.setMin(h), s();
      }, setMax: function(h) {
        p.setMax(h), l();
      } });
    }), setFixedDirection: c, setMin: function(p) {
      n.setMin(p), s();
    }, setMax: function(p) {
      n.setMax(p), l();
    } }), d = ft(t, "onResizeGroupStart", f);
    return r.isResize = d !== !1, r.isResize ? n : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isResize) {
      var n = yr(t.props, "resizable");
      Pa(t, "onBeforeResize", function(p) {
        ft(t, "onBeforeResizeGroup", wt(t, e, O(O({}, p), { targets: n.targets }), !0));
      });
      var a = this.dragControl(t, O(O({}, e), { isGroup: !0 }));
      if (a) {
        var i = a.boundingWidth, o = a.boundingHeight, s = a.dist, l = n.keepRatio, u = [
          i / (i - s[0]),
          o / (o - s[1])
        ], c = r.fixedPosition, f = Ve(t, this, "dragControl", e, function(p, h) {
          var g = N(se(Cn(t.rotation / 180 * Math.PI, 3), [
            h.datas.originalX * u[0],
            h.datas.originalY * u[1],
            1
          ], 3), 2), x = g[0], y = g[1];
          return O(O({}, h), { parentDist: null, parentScale: u, dragClient: Tt(c, [x, y]), parentKeepRatio: l });
        }), d = O({ targets: n.targets, events: f }, a);
        return ft(t, "onResizeGroup", d), d;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isResize) {
      this.dragControlEnd(t, e);
      var a = Ve(t, this, "dragControlEnd", e), i = ye(t, e, {
        targets: t.props.targets,
        events: a
      });
      return ft(t, "onResizeGroupEnd", i), r;
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
function Qa(t, e, r, n, a) {
  var i = t.props.groupable, o = t.state, s = o.is3d ? 4 : 3, l = e.origin, u = Gt(
    t.state.rootMatrix,
    // TO-DO #710
    vt([l[0], l[1]], i ? [0, 0] : [o.left, o.top]),
    s
  ), c = Tt([a.left, a.top], u);
  e.startAbsoluteOrigin = c, e.prevDeg = Xt(c, [r, n]) / Math.PI * 180, e.defaultDeg = e.prevDeg, e.prevSnapDeg = 0, e.loop = 0, e.startDist = Be(c, [r, n]);
}
function sa(t, e, r) {
  var n = r.defaultDeg, a = r.prevDeg, i = a % 360, o = Math.floor(a / 360);
  i < 0 && (i += 360), i > t && i > 270 && t < 90 ? ++o : i < t && i < 90 && t > 270 && --o;
  var s = e * (o * 360 + t - n);
  return r.prevDeg = n + s, s;
}
function ti(t, e, r, n) {
  return sa(Xt(n.startAbsoluteOrigin, [t, e]) / Math.PI * 180, r, n);
}
function ei(t, e, r, n, a, i) {
  var o = t.props.throttleRotate, s = o === void 0 ? 0 : o, l = r.prevSnapDeg, u = 0, c = !1;
  if (i) {
    var f = sv(t, e, n, a + n);
    c = f.isSnap, u = a + f.dist;
  }
  c || (u = xt(a + n, s));
  var d = u - a;
  return r.prevSnapDeg = d, [d - l, d, u];
}
function Du(t, e, r) {
  var n = N(e, 4), a = n[0], i = n[1], o = n[2], s = n[3];
  if (t === "none")
    return [];
  if (Yt(t))
    return t.map(function(x) {
      return Du(x, [a, i, o, s], r)[0];
    });
  var l = N((t || "top").split("-"), 2), u = l[0], c = l[1], f = [a, i];
  u === "left" ? f = [o, a] : u === "right" ? f = [i, s] : u === "bottom" && (f = [s, o]);
  var d = [
    (f[0][0] + f[1][0]) / 2,
    (f[0][1] + f[1][1]) / 2
  ], p = zu(f, r);
  if (c) {
    var h = c === "top" || c === "left", g = u === "bottom" || u === "left";
    d = f[h && !g || !h && g ? 0 : 1];
  }
  return [[d, p]];
}
function Ni(t, e) {
  if (e.isRequest)
    return e.requestAble === "rotatable";
  var r = e.inputEvent.target;
  if (Qt(r, dt("rotation-control")) || t.props.rotateAroundControls && Qt(r, dt("around-control")) || Qt(r, dt("control")) && Qt(r, dt("rotatable")))
    return !0;
  var n = t.props.rotationTarget;
  return n ? wo(n, !0).some(function(a) {
    return a ? r === a || r.contains(a) : !1;
  }) : !1;
}
var qp = `.rotation {
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
`, Vp = {
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
  css: [qp],
  viewClassName: function(t) {
    return t.isDragging("rotatable") ? dt("view-rotation-dragging") : "";
  },
  render: function(t, e) {
    var r = yr(t.props, "rotatable"), n = r.rotatable, a = r.rotationPosition, i = r.zoom, o = r.renderDirections, s = r.rotateAroundControls, l = r.resolveAblesWithRotatable, u = t.getState(), c = u.renderPoses, f = u.direction;
    if (!n)
      return null;
    var d = Du(a, c, f), p = [];
    if (d.forEach(function(y, b) {
      var w = N(y, 2), E = w[0], _ = w[1];
      p.push(e.createElement(
        "div",
        { key: "rotation".concat(b), className: dt("rotation"), style: {
          // tslint:disable-next-line: max-line-length
          transform: "translate(-50%) translate(".concat(E[0], "px, ").concat(E[1], "px) rotate(").concat(_, "rad)")
        } },
        e.createElement("div", { className: dt("line rotation-line"), style: {
          transform: "scaleX(".concat(i, ")")
        } }),
        e.createElement("div", { className: dt("control rotation-control"), style: {
          transform: "translate(0.5px) scale(".concat(i, ")")
        } })
      ));
    }), o) {
      var h = Xr(l || {}), g = {};
      h.forEach(function(y) {
        l[y].forEach(function(b) {
          g[b] = y;
        });
      });
      var x = [];
      Yt(o) && (x = o.map(function(y) {
        var b = g[y];
        return {
          data: b ? { resolve: b } : {},
          classNames: b ? ["move"] : [],
          dir: y
        };
      })), p.push.apply(p, J([], N(lu(t, "rotatable", x, e)), !1));
    }
    return s && p.push.apply(p, J([], N(pu(t, e)), !1)), p;
  },
  dragControlCondition: Ni,
  dragControlStart: function(t, e) {
    var r, n, a = e.datas, i = e.clientX, o = e.clientY, s = e.parentRotate, l = e.parentFlag, u = e.isPinch, c = e.isRequest, f = t.state, d = f.target, p = f.left, h = f.top, g = f.direction, x = f.beforeDirection, y = f.targetTransform, b = f.moveableClientRect, w = f.offsetMatrix, E = f.targetMatrix, _ = f.allMatrix, D = f.width, M = f.height;
    if (!c && !d)
      return !1;
    var m = t.getRect();
    a.rect = m, a.transform = y, a.left = p, a.top = h;
    var I = function(nt) {
      var Q = wu(t.state, nt);
      a.fixedDirection = Q.fixedDirection, a.fixedOffset = Q.fixedOffset, a.fixedPosition = Q.fixedPosition, F && F.setFixedPosition(nt);
    }, k = function(nt) {
      var Q = $p(t.state, nt);
      a.fixedDirection = Q.fixedDirection, a.fixedOffset = Q.fixedOffset, a.fixedPosition = Q.fixedPosition, F && F.setFixedDirection(nt);
    }, z = i, P = o;
    if (c || u || l) {
      var R = s || 0;
      a.beforeInfo = {
        origin: m.beforeOrigin,
        prevDeg: R,
        defaultDeg: R,
        prevSnapDeg: 0,
        startDist: 0
      }, a.afterInfo = O(O({}, a.beforeInfo), { origin: m.origin }), a.absoluteInfo = O(O({}, a.beforeInfo), { origin: m.origin, startValue: R });
    } else {
      var A = (n = e.inputEvent) === null || n === void 0 ? void 0 : n.target;
      if (A) {
        var j = A.getAttribute("data-direction") || "", W = Qd[j];
        if (W) {
          a.isControl = !0, a.isAroundControl = Qt(A, dt("around-control")), a.controlDirection = W;
          var X = A.getAttribute("data-resolve");
          X && (a.resolveAble = X);
          var L = Ev(f.rootMatrix, f.renderPoses, b);
          r = N(ee(L, W), 2), z = r[0], P = r[1];
        }
      }
      a.beforeInfo = { origin: m.beforeOrigin }, a.afterInfo = { origin: m.origin }, a.absoluteInfo = {
        origin: m.origin,
        startValue: m.rotation
      };
      var q = I;
      I = function(nt) {
        var Q = f.is3d ? 4 : 3, at = N(Tt(Fl(E, Q), nt), 2), it = at[0], mt = at[1], bt = se(w, gr([it, mt], Q)), Z = se(_, gr([nt[0], nt[1]], Q));
        q(nt);
        var ut = f.posDelta;
        a.beforeInfo.origin = vt(bt, ut), a.afterInfo.origin = vt(Z, ut), a.absoluteInfo.origin = vt(Z, ut), Qa(t, a.beforeInfo, z, P, b), Qa(t, a.afterInfo, z, P, b), Qa(t, a.absoluteInfo, z, P, b);
      }, k = function(nt) {
        var Q = ee([
          [0, 0],
          [D, 0],
          [0, M],
          [D, M]
        ], nt);
        I(Q);
      };
    }
    a.startClientX = z, a.startClientY = P, a.direction = g, a.beforeDirection = x, a.startValue = 0, a.datas = {}, ka(t, e, "rotate");
    var V = !1, F = !1;
    if (a.isControl && a.resolveAble) {
      var et = a.resolveAble;
      et === "resizable" && (F = Pi.dragControlStart(t, O(O({}, new Gr("resizable").dragStart([0, 0], e)), { parentPosition: a.controlPosition, parentFixedPosition: a.fixedPosition })));
    }
    F || (V = le.dragStart(t, new Gr().dragStart([0, 0], e))), I(wv(t));
    var tt = wt(t, e, O(O({ set: function(nt) {
      a.startValue = nt * Math.PI / 180;
    }, setFixedDirection: k, setFixedPosition: I }, Ma(t, e)), { dragStart: V, resizeStart: F })), K = ft(t, "onRotateStart", tt);
    return a.isRotate = K !== !1, f.snapRenderInfo = {
      request: e.isRequest
    }, a.isRotate ? tt : !1;
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.clientDistX, s = e.clientDistY, l = e.parentRotate, u = e.parentFlag, c = e.isPinch, f = e.groupDelta, d = e.resolveMatrix, p = i.beforeDirection, h = i.beforeInfo, g = i.afterInfo, x = i.absoluteInfo, y = i.isRotate, b = i.startValue, w = i.rect, E = i.startClientX, _ = i.startClientY;
    if (y) {
      Da(t, e, "rotate");
      var D = ep(e), M = p * D, m = t.props.parentMoveable, I = 0, k, z, P = 0, R, A, j = 0, W, X, L = 180 / Math.PI * b, q = x.startValue, V = !1, F = E + o, et = _ + s;
      if (!u && "parentDist" in e) {
        var tt = e.parentDist;
        k = tt, R = tt, W = tt;
      } else c || u ? (k = sa(l, p, h), R = sa(l, M, g), W = sa(l, M, x)) : (k = ti(F, et, p, h), R = ti(F, et, M, g), W = ti(F, et, M, x), V = !0);
      if (z = L + k, A = L + R, X = q + W, ft(t, "onBeforeRotate", wt(t, e, {
        beforeRotation: z,
        rotation: A,
        absoluteRotation: X,
        setRotation: function(Et) {
          R = Et - L, k = R, W = R;
        }
      }, !0)), r = N(ei(t, w, h, k, L, V), 3), I = r[0], k = r[1], z = r[2], n = N(ei(t, w, g, R, L, V), 3), P = n[0], R = n[1], A = n[2], a = N(ei(t, w, x, W, q, V), 3), j = a[0], W = a[1], X = a[2], !(!j && !P && !I && !m && !d)) {
        var K = _a(i, "rotate(".concat(A, "deg)"), "rotate(".concat(R, "deg)"));
        d && (i.fixedPosition = fo(t, i.targetAllTransform, i.fixedDirection, i.fixedOffset, i));
        var nt = dp(t, R, i), Q = vt(Tt(f || [0, 0], nt), i.prevInverseDist || [0, 0]);
        i.prevInverseDist = nt, i.requestValue = null;
        var at = iu(t, K, Q, c, e), it = at, mt = Be([F, et], x.startAbsoluteOrigin) - x.startDist, bt = void 0;
        if (i.resolveAble === "resizable") {
          var Z = Pi.dragControl(t, O(O({}, _n(e, t.state, [e.deltaX, e.deltaY], !!c, !1, "resizable")), { resolveMatrix: !0, parentDistance: mt }));
          Z && (bt = Z, it = Gu(it, Z, e));
        }
        var ut = wt(t, e, O(O({ delta: P, dist: R, rotate: A, rotation: A, beforeDist: k, beforeDelta: I, beforeRotate: z, beforeRotation: z, absoluteDist: W, absoluteDelta: j, absoluteRotate: X, absoluteRotation: X, isPinch: !!c, resize: bt }, at), it));
        return ft(t, "onRotate", ut), ut;
      }
    }
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      r.isRotate = !1;
      var n = ye(t, e, {});
      return ft(t, "onRotateEnd", n), n;
    }
  },
  dragGroupControlCondition: Ni,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = t.state, a = n.left, i = n.top, o = n.beforeOrigin, s = this.dragControlStart(t, e);
    if (!s)
      return !1;
    s.set(r.beforeDirection * t.rotation);
    var l = Ve(t, this, "dragControlStart", e, function(f, d) {
      var p = f.state, h = p.left, g = p.top, x = p.beforeOrigin, y = Tt(vt([h, g], [a, i]), vt(x, o));
      return d.datas.startGroupClient = y, d.datas.groupClient = y, O(O({}, d), { parentRotate: 0 });
    }), u = O(O({}, s), { targets: t.props.targets, events: l }), c = ft(t, "onRotateGroupStart", u);
    return r.isRotate = c !== !1, r.isRotate ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isRotate) {
      Pa(t, "onBeforeRotate", function(u) {
        ft(t, "onBeforeRotateGroup", wt(t, e, O(O({}, u), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = r.beforeDirection, i = n.beforeDist, o = i / 180 * Math.PI, s = Ve(t, this, "dragControl", e, function(u, c) {
          var f = c.datas.startGroupClient, d = N(c.datas.groupClient, 2), p = d[0], h = d[1], g = N(Sn(f, o * a), 2), x = g[0], y = g[1], b = [x - p, y - h];
          return c.datas.groupClient = [x, y], O(O({}, c), { parentRotate: i, groupDelta: b });
        });
        t.rotation = a * n.beforeRotation;
        var l = O({ targets: t.props.targets, events: s, set: function(u) {
          t.rotation = u;
        }, setGroupRotation: function(u) {
          t.rotation = u;
        } }, n);
        return ft(t, "onRotateGroup", l), l;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isRotate) {
      this.dragControlEnd(t, e);
      var a = Ve(t, this, "dragControlEnd", e), i = ye(t, e, {
        targets: t.props.targets,
        events: a
      });
      return ft(t, "onRotateGroupEnd", i), r;
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
function Up(t, e) {
  var r, n = t.direction, a = t.classNames, i = t.size, o = t.pos, s = t.zoom, l = t.key, u = n === "horizontal", c = u ? "Y" : "X";
  return e.createElement("div", {
    key: l,
    className: a.join(" "),
    style: (r = {}, r[u ? "width" : "height"] = "".concat(i), r.transform = "translate(".concat(o[0], ", ").concat(o[1], ") translate").concat(c, "(-50%) scale").concat(c, "(").concat(s, ")"), r)
  });
}
function xo(t, e) {
  return Up(O(O({}, t), { classNames: J([
    dt("line", "guideline", t.direction)
  ], N(t.classNames), !1).filter(function(r) {
    return r;
  }), size: t.size || "".concat(t.sizeValue, "px"), pos: t.pos || t.posValue.map(function(r) {
    return "".concat(xt(r, 0.1), "px");
  }) }), e);
}
function js(t, e, r, n, a, i, o, s) {
  var l = t.props.zoom;
  return r.map(function(u, c) {
    var f = u.type, d = u.pos, p = [0, 0];
    return p[o] = n, p[o ? 0 : 1] = -a + d, xo({
      key: "".concat(e, "TargetGuideline").concat(c),
      classNames: [dt("target", "bold", f)],
      posValue: p,
      sizeValue: i,
      zoom: l,
      direction: e
    }, s);
  });
}
function Bs(t, e, r, n, a, i) {
  var o = t.props, s = o.zoom, l = o.isDisplayInnerSnapDigit, u = e === "horizontal" ? ar : ir, c = a[u.start], f = a[u.end];
  return r.filter(function(d) {
    var p = d.hide, h = d.elementRect;
    if (p)
      return !1;
    if (l && h) {
      var g = h.rect;
      if (g[u.start] <= c && f <= g[u.end])
        return !1;
    }
    return !0;
  }).map(function(d, p) {
    var h = d.pos, g = d.size, x = d.element, y = d.className, b = [
      -n[0] + h[0],
      -n[1] + h[1]
    ];
    return xo({
      key: "".concat(e, "-default-guideline-").concat(p),
      classNames: x ? [dt("bold"), y] : [dt("normal"), y],
      direction: e,
      posValue: b,
      sizeValue: g,
      zoom: s
    }, i);
  });
}
function nn(t, e, r, n, a, i, o, s) {
  var l, u = t.props, c = u.snapDigit, f = c === void 0 ? 0 : c, d = u.isDisplaySnapDigit, p = d === void 0 ? !0 : d, h = u.snapDistFormat, g = h === void 0 ? function(_, D) {
    return _;
  } : h, x = u.zoom, y = e === "horizontal" ? "X" : "Y", b = e === "vertical" ? "height" : "width", w = Math.abs(a), E = p ? parseFloat(w.toFixed(f)) : 0;
  return s.createElement(
    "div",
    { key: "".concat(e, "-").concat(r, "-guideline-").concat(n), className: dt("guideline-group", e), style: (l = {
      left: "".concat(i[0], "px"),
      top: "".concat(i[1], "px")
    }, l[b] = "".concat(w, "px"), l) },
    xo({
      direction: e,
      classNames: [dt(r), o],
      size: "100%",
      posValue: [0, 0],
      sizeValue: w,
      zoom: x
    }, s),
    s.createElement("div", { className: dt("size-value", "gap"), style: {
      transform: "translate".concat(y, "(-50%) scale(").concat(x, ")")
    } }, E > 0 ? g(E, e) : "")
  );
}
function Kp(t, e, r, n) {
  var a = t === "vertical" ? 0 : 1, i = t === "vertical" ? 1 : 0, o = a ? ar : ir, s = r[o.start], l = r[o.end];
  return Fu(e, function(u) {
    return u.pos[a];
  }).map(function(u) {
    var c = [], f = [], d = [];
    return u.forEach(function(p) {
      var h, g, x = p.element, y = p.elementRect.rect;
      if (y[o.end] < s)
        c.push(p);
      else if (l < y[o.start])
        f.push(p);
      else if (y[o.start] <= s && l <= y[o.end] && n) {
        var b = p.pos, w = { element: x, rect: O(O({}, y), (h = {}, h[o.end] = y[o.start], h)) }, E = { element: x, rect: O(O({}, y), (g = {}, g[o.start] = y[o.end], g)) }, _ = [0, 0], D = [0, 0];
        _[a] = b[a], _[i] = b[i], D[a] = b[a], D[i] = b[i] + p.size, c.push({
          type: t,
          pos: _,
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
function Zp(t, e, r, n, a) {
  var i = t.props.isDisplayInnerSnapDigit, o = [];
  return ["vertical", "horizontal"].forEach(function(s) {
    var l = e.filter(function(x) {
      return x.type === s;
    }), u = s === "vertical" ? 1 : 0, c = u ? 0 : 1, f = Kp(s, l, n, i), d = u ? ir : ar, p = u ? ar : ir, h = n[d.start], g = n[d.end];
    f.forEach(function(x) {
      var y = x.total, b = x.start, w = x.end, E = x.inner, _ = r[c] + y[0].pos[c] - n[p.start], D = n;
      b.forEach(function(M) {
        var m = M.elementRect.rect, I = D[d.start] - m[d.end];
        if (I > 0) {
          var k = [0, 0];
          k[u] = r[u] + D[d.start] - h - I, k[c] = _, o.push(nn(t, s, "dashed", o.length, I, k, M.className, a));
        }
        D = m;
      }), D = n, w.forEach(function(M) {
        var m = M.elementRect.rect, I = m[d.start] - D[d.end];
        if (I > 0) {
          var k = [0, 0];
          k[u] = r[u] + D[d.end] - h, k[c] = _, o.push(nn(t, s, "dashed", o.length, I, k, M.className, a));
        }
        D = m;
      }), E.forEach(function(M) {
        var m = M.elementRect.rect, I = h - m[d.start], k = m[d.end] - g, z = [0, 0], P = [0, 0];
        z[u] = r[u] - I, z[c] = _, P[u] = r[u] + g - h, P[c] = _, o.push(nn(t, s, "dashed", o.length, I, z, M.className, a)), o.push(nn(t, s, "dashed", o.length, k, P, M.className, a));
      });
    });
  }), o;
}
function Jp(t, e, r, n, a) {
  var i = [];
  return ["horizontal", "vertical"].forEach(function(o) {
    var s = e.filter(function(x) {
      return x.type === o;
    }).slice(0, 1), l = o === "vertical" ? 0 : 1, u = l ? 0 : 1, c = l ? ir : ar, f = l ? ar : ir, d = n[c.start], p = n[c.end], h = n[f.start], g = n[f.end];
    s.forEach(function(x) {
      var y = x.gap, b = x.gapRects, w = Math.max.apply(Math, J([h], N(b.map(function(D) {
        var M = D.rect;
        return M[f.start];
      })), !1)), E = Math.min.apply(Math, J([g], N(b.map(function(D) {
        var M = D.rect;
        return M[f.end];
      })), !1)), _ = (w + E) / 2;
      w === E || _ === (h + g) / 2 || b.forEach(function(D) {
        var M = D.rect, m = D.className, I = [r[0], r[1]];
        if (M[c.end] < d)
          I[l] += M[c.end] - d;
        else if (p < M[c.start])
          I[l] += M[c.start] - d - y;
        else
          return;
        I[u] += _ - h, i.push(nn(t, l ? "vertical" : "horizontal", "gap", i.length, y, I, m, a));
      });
    });
  }), i;
}
function zi(t) {
  var e, r, n = t.state, a = n.containerClientRect, i = n.hasFixed, o = a.overflow, s = a.scrollHeight, l = a.scrollWidth, u = a.clientHeight, c = a.clientWidth, f = a.clientLeft, d = a.clientTop, p = t.props, h = p.snapGap, g = h === void 0 ? !0 : h, x = p.verticalGuidelines, y = p.horizontalGuidelines, b = p.snapThreshold, w = b === void 0 ? 5 : b, E = p.maxSnapElementGuidelineDistance, _ = E === void 0 ? 1 / 0 : E, D = p.isDisplayGridGuidelines, M = Ee(_e(t.state)), m = M.top, I = M.left, k = M.bottom, z = M.right, P = { top: m, left: I, bottom: k, right: z, center: (I + z) / 2, middle: (m + k) / 2 }, R = rv(t), A = J([], N(R), !1), j = ((r = (e = n.snapThresholdInfo) === null || e === void 0 ? void 0 : e.multiples) !== null && r !== void 0 ? r : [1, 1]).map(function(q) {
    return q * w;
  });
  g && A.push.apply(A, J([], N(Qp(t, P, j)), !1));
  var W = O({}, n.snapOffset || {
    left: 0,
    top: 0,
    bottom: 0,
    right: 0
  });
  if (A.push.apply(A, J([], N(ev(t, o ? l : c, o ? s : u, f, d, W, D)), !1)), i) {
    var X = a.left, L = a.top;
    W.left += X, W.top += L, W.right += X, W.bottom += L;
  }
  return A.push.apply(A, J([], N(Mu(y || !1, x || !1, o ? l : c, o ? s : u, f, d, W)), !1)), A = A.filter(function(q) {
    var V = q.element, F = q.elementRect, et = q.type;
    if (!V || !F)
      return !0;
    var tt = F.rect;
    return _u(P, tt, et, _);
  }), A;
}
function Qp(t, e, r) {
  var n = t.props, a = n.maxSnapElementGuidelineDistance, i = a === void 0 ? 1 / 0 : a, o = n.maxSnapElementGapDistance, s = o === void 0 ? 1 / 0 : o, l = t.state.elementRects, u = [];
  return [
    ["vertical", ar, ir],
    ["horizontal", ir, ar]
  ].forEach(function(c) {
    var f = N(c, 3), d = f[0], p = f[1], h = f[2], g = e[p.start], x = e[p.end], y = e[p.center], b = e[h.start], w = e[h.end], E = {
      left: r[0],
      top: r[1]
    };
    function _(m) {
      var I = m.rect, k = E[p.start];
      return I[p.end] < g + k ? g - I[p.end] : x - k < I[p.start] ? I[p.start] - x : -1;
    }
    var D = l.filter(function(m) {
      var I = m.rect;
      return I[h.start] > w || I[h.end] < b ? !1 : _(m) > 0;
    }).sort(function(m, I) {
      return _(m) - _(I);
    }), M = [];
    D.forEach(function(m) {
      D.forEach(function(I) {
        if (m !== I) {
          var k = m.rect, z = I.rect, P = k[h.start], R = k[h.end], A = z[h.start], j = z[h.end];
          P > j || A > R || M.push([m, I]);
        }
      });
    }), M.forEach(function(m) {
      var I = N(m, 2), k = I[0], z = I[1], P = k.rect, R = z.rect, A = P[p.start], j = P[p.end], W = R[p.start], X = R[p.end], L = E[p.start], q = 0, V = 0, F = !1, et = !1, tt = !1;
      if (j <= g && x <= W) {
        if (et = !0, q = (W - j - (x - g)) / 2, V = j + q + (x - g) / 2, H(V - y) > L)
          return;
      } else if (j < W && X < g + L) {
        if (F = !0, q = W - j, V = X + q, H(V - g) > L)
          return;
      } else if (j < W && x - L < A) {
        if (tt = !0, q = W - j, V = A - q, H(V - x) > L)
          return;
      } else
        return;
      q && _u(e, R, d, i) && (q > s || u.push({
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
function tv(t, e, r, n) {
  var a, i, o = t.props, s = t.state, l = o.snapGridAll, u = o.snapGridWidth, c = u === void 0 ? 0 : u, f = o.snapGridHeight, d = f === void 0 ? 0 : f, p = s.snapRenderInfo, h = p && (((a = p.direction) === null || a === void 0 ? void 0 : a[0]) || ((i = p.direction) === null || i === void 0 ? void 0 : i[1])), g = t.moveables;
  if (l && g && h && (c || d)) {
    if (s.snapThresholdInfo)
      return;
    s.snapThresholdInfo = {
      multiples: [1, 1],
      offset: [0, 0]
    };
    var x = t.getRect(), y = x.children, b = p.direction;
    if (y) {
      var w = b.map(function(_, D) {
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
        }, m = M.snapSize, I = M.posName, k = M.sizeName, z = M.clientOffset;
        if (!m)
          return {
            dir: _,
            multiple: 1,
            snapSize: m,
            snapOffset: 0
          };
        var P = x[k], R = x[I], A = Qf(y.map(function(F) {
          return [
            F[I] - R,
            F[k],
            P - F[k] - F[I] + R
          ];
        })).filter(function(F) {
          return F;
        }).sort(function(F, et) {
          return F - et;
        }), j = A[0], W = A.map(function(F) {
          return xt(F / j, 0.1) * m;
        }), X = 1, L = xt(P / j, 0.1);
        for (X = 1; X <= 10 && !W.every(function(F) {
          return F * X % 1 === 0;
        }); ++X)
          ;
        var q = (-_ + 1) / 2, V = ua(R - z, R - z + P, q, 1 - q);
        return {
          multiple: L * X,
          dir: _,
          snapSize: m,
          snapOffset: Math.round(V / m)
        };
      }), E = w.map(function(_) {
        return _.multiple || 1;
      });
      s.snapThresholdInfo.multiples = E, s.snapThresholdInfo.offset = w.map(function(_) {
        return _.snapOffset;
      }), w.forEach(function(_, D) {
        _.snapSize;
      });
    }
  } else
    s.snapThresholdInfo = null;
}
function ev(t, e, r, n, a, i, o) {
  n === void 0 && (n = 0), a === void 0 && (a = 0);
  var s = t.props, l = t.state, u = s.snapGridWidth, c = u === void 0 ? 0 : u, f = s.snapGridHeight, d = f === void 0 ? 0 : f, p = [], h = i.left, g = i.top, x = [0, 0];
  tv(t, n, a, i);
  var y = l.snapThresholdInfo, b = c, w = d;
  if (y && (c *= y.multiples[0] || 1, d *= y.multiples[1] || 1, x = y.offset), d) {
    for (var E = function(D) {
      p.push({
        type: "horizontal",
        pos: [
          h,
          xt(x[1] * w + D - a + g, 0.1)
        ],
        className: dt("grid-guideline"),
        size: e,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, _ = 0; _ <= r * 2; _ += d)
      E(_);
    for (var _ = -d; _ >= -r; _ -= d)
      E(_);
  }
  if (c) {
    for (var E = function(M) {
      p.push({
        type: "vertical",
        pos: [
          xt(x[0] * b + M - n + h, 0.1),
          g
        ],
        className: dt("grid-guideline"),
        size: r,
        hide: !o,
        direction: "",
        grid: !0
      });
    }, _ = 0; _ <= e * 2; _ += c)
      E(_);
    for (var _ = -c; _ >= -e; _ -= c)
      E(_);
  }
  return p;
}
function _u(t, e, r, n) {
  return r === "horizontal" ? H(t.right - e.left) <= n || H(t.left - e.right) <= n || t.left <= e.right && e.left <= t.right : r === "vertical" ? H(t.bottom - e.top) <= n || H(t.top - e.bottom) <= n || t.top <= e.bottom && e.top <= t.bottom : !0;
}
function rv(t) {
  var e = t.state, r = t.props.elementGuidelines, n = r === void 0 ? [] : r;
  if (!n.length)
    return e.elementRects = [], [];
  var a = (e.elementRects || []).filter(function(d) {
    return !d.refresh;
  }), i = n.map(function(d) {
    return me(d) && "element" in d ? O(O({}, d), { element: Ge(d.element, !0) }) : {
      element: Ge(d, !0)
    };
  }).filter(function(d) {
    return d.element;
  }), o = Tr(a.map(function(d) {
    return d.element;
  }), i.map(function(d) {
    return d.element;
  })), s = o.maintained, l = o.added, u = [];
  s.forEach(function(d) {
    var p = N(d, 2), h = p[0], g = p[1];
    u[g] = a[h];
  }), nv(t, l.map(function(d) {
    return i[d];
  })).map(function(d, p) {
    u[l[p]] = d;
  }), e.elementRects = u;
  var c = vo(t.props.elementSnapDirections), f = [];
  return u.forEach(function(d) {
    var p = d.element, h = d.top, g = h === void 0 ? c.top : h, x = d.left, y = x === void 0 ? c.left : x, b = d.right, w = b === void 0 ? c.right : b, E = d.bottom, _ = E === void 0 ? c.bottom : E, D = d.center, M = D === void 0 ? c.center : D, m = d.middle, I = m === void 0 ? c.middle : m, k = d.className, z = d.rect, P = ho({
      top: g,
      right: w,
      left: y,
      bottom: _,
      center: M,
      middle: I
    }, z), R = P.horizontal, A = P.vertical, j = P.horizontalNames, W = P.verticalNames, X = z.top, L = z.left, q = z.right - L, V = z.bottom - X, F = [q, V];
    A.forEach(function(et, tt) {
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
        elementDirection: Ts[W[tt]] || W[tt],
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
        elementDirection: Ts[j[tt]] || j[tt],
        direction: ""
      });
    });
  }), f;
}
function Gs(t, e) {
  return t ? t.map(function(r) {
    var n = me(r) ? r : { pos: r }, a = n.pos;
    return hn(a) ? n : O(O({}, n), { pos: Pt(a, e) });
  }) : [];
}
function Mu(t, e, r, n, a, i, o) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = { left: 0, top: 0, right: 0, bottom: 0 });
  var s = [], l = o.left, u = o.top, c = o.bottom, f = o.right, d = r + f - l, p = n + c - u;
  return Gs(t, p).forEach(function(h) {
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
  }), Gs(e, d).forEach(function(h) {
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
function nv(t, e) {
  if (!e.length)
    return [];
  var r = t.props.groupable, n = t.state, a = n.containerClientRect, i = n.rootMatrix, o = n.is3d, s = n.offsetDelta, l = o ? 4 : 3, u = N(Mp(i, a, l), 2), c = u[0], f = u[1], d = r ? 0 : s[0], p = r ? 0 : s[1];
  return e.map(function(h) {
    var g = h.element.getBoundingClientRect(), x = g.left - c - d, y = g.top - f - p, b = y + g.height, w = x + g.width, E = N(Wr(i, [x, y], l), 2), _ = E[0], D = E[1], M = N(Wr(i, [w, b], l), 2), m = M[0], I = M[1];
    return O(O({}, h), { rect: {
      left: _,
      right: m,
      top: D,
      bottom: I,
      center: (_ + m) / 2,
      middle: (D + I) / 2
    } });
  });
}
function Kn(t) {
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
      var s = fn(o), l = Hs(e, [
        s.left - a.left,
        s.top - a.top
      ]), u = Hs(e, [
        s.right - a.right,
        s.bottom - a.bottom
      ]);
      i.left = xt(l[0], 1e-5), i.top = xt(l[1], 1e-5), i.right = xt(u[0], 1e-5), i.bottom = xt(u[1], 1e-5);
    }
  }
  return e.snapContainer = n, e.snapOffset = i, e.guidelines = zi(t), e.enableSnap = !0, !0;
}
function ku(t, e, r, n, a, i) {
  var o = Sr(t, e, r, i ? 4 : 3), s = ee(o, n);
  return bo(o, vt(a, s));
}
function Fs(t) {
  return t ? t / H(t) : 0;
}
function av(t, e, r, n, a, i) {
  var o = i.fixedDirection, s = Rp(r, o, n), l = mo(t, e, r, n), u = J(J([], N(Yp(t, e, s, n, a, i)), !1), N(Cu(t, l, i)), !1), c = ga(u, 0), f = ga(u, 1);
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
function iv(t, e, r, n, a, i, o, s, l) {
  var u = ee(e, o), c = Ra(t, s, {
    vertical: [u[0]],
    horizontal: [u[1]]
  }), f = c.horizontal.offset, d = c.vertical.offset;
  if (xt(d, ki) || xt(f, ki)) {
    var p = N(Fe({
      datas: l,
      distX: -d,
      distY: -f
    }), 2), h = p[0], g = p[1], x = Math.min(a || 1 / 0, r + o[0] * h), y = Math.min(i || 1 / 0, n + o[1] * g);
    return [x - r, y - n];
  }
  return [0, 0];
}
function Tu(t, e, r, n, a, i, o, s) {
  for (var l = _e(t.state), u = t.props.keepRatio, c = 0, f = 0, d = 0; d < 2; ++d) {
    var p = e(c, f), h = av(t, p, a, u, o, s), g = h.width, x = h.height, y = g.isBound, b = x.isBound, w = g.offset, E = x.offset;
    if (d === 1 && (y || (w = 0), b || (E = 0)), d === 0 && o && !y && !b)
      return [0, 0];
    if (u) {
      var _ = H(w) * (r ? 1 / r : 1), D = H(E) * (n ? 1 / n : 1), M = y && b ? _ < D : b || !y && _ < D;
      M ? w = r * E / n : E = n * w / r;
    }
    c += w, f += E;
  }
  if (!u && a[0] && a[1]) {
    var m = Hp(t, l, a, i, s), I = m.maxWidth, k = m.maxHeight, z = N(iv(t, e(c, f).map(function(A) {
      return A.map(function(j) {
        return xt(j, ki);
      });
    }), r + c, n + f, I, k, a, o, s), 2), w = z[0], E = z[1];
    c += w, f += E;
  }
  return [c, f];
}
function un(t) {
  return t < 0 && (t = t % 360 + 360), t %= 360, t;
}
function ov(t, e) {
  e = un(e);
  var r = Math.floor(t / 360), n = r * 360 + 360 - e, a = r * 360 + e;
  return H(t - n) < H(t - a) ? n : a;
}
function ri(t, e) {
  t = un(t), e = un(e);
  var r = un(t - e);
  return Math.min(r, 360 - r);
}
function sv(t, e, r, n) {
  var a, i = t.props, o = (a = i[vu]) !== null && a !== void 0 ? a : 5, s = i[hu];
  if (qr(t, "rotatable")) {
    var l = e.pos1, u = e.pos2, c = e.pos3, f = e.pos4, d = e.origin, p = r * Math.PI / 180, h = [l, u, c, f].map(function(E) {
      return vt(E, d);
    }), g = h.map(function(E) {
      return Sn(E, p);
    }), x = J(J([], N(Ep(t, h, g, d, r)), !1), N(jp(t, h, g, d, r)), !1);
    x.sort(function(E, _) {
      return H(E - r) - H(_ - r);
    });
    var y = x.length > 0;
    if (y)
      return {
        isSnap: y,
        dist: y ? x[0] : r
      };
  }
  if (s != null && s.length && o) {
    var b = s.slice().sort(function(E, _) {
      return ri(E, n) - ri(_, n);
    }), w = b[0];
    if (ri(w, n) <= o)
      return {
        isSnap: !0,
        dist: r + ov(n, w) - n
      };
  }
  return {
    isSnap: !1,
    dist: r
  };
}
function lv(t, e, r, n, a, i, o) {
  if (!qr(t, "resizable"))
    return [0, 0];
  var s = o.fixedDirection, l = o.nextAllMatrix, u = t.state, c = u.allMatrix, f = u.is3d;
  return Tu(t, function(d, p) {
    return ku(l || c, e + d, r + p, s, a, f);
  }, e, r, n, a, i, o);
}
function uv(t, e, r, n, a) {
  if (!qr(t, "scalable"))
    return [0, 0];
  var i = a.startOffsetWidth, o = a.startOffsetHeight, s = a.fixedPosition, l = a.fixedDirection, u = a.is3d, c = Tu(t, function(f, d) {
    return ku(lp(a, Tt(e, [f / i, d / o])), i, o, l, s, u);
  }, i, o, r, s, n, a);
  return [c[0] / i, c[1] / o];
}
function cv(t, e) {
  e.absolutePoses = _e(t.state);
}
function Ls(t) {
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
    return O(O({}, n), { direction: a.direction });
  });
}
function Ws(t, e, r, n, a, i) {
  var o = po(Ta(t, i), e, r), s = o.vertical, l = o.horizontal, u = Or();
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
  var c = Bp(t), f = c.boundMap, d = c.vertical, p = c.horizontal;
  return d.forEach(function(h) {
    Ue(n, function(g) {
      var x = g.type, y = g.pos;
      return x === "bounds" && y === h;
    }) >= 0 || n.push({
      type: "bounds",
      pos: h
    });
  }), p.forEach(function(h) {
    Ue(a, function(g) {
      var x = g.type, y = g.pos;
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
var fv = Eo("", ["resizable", "scalable"]), dv = {
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
    vu,
    hu,
    gu,
    mu,
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
    if (!u || !u.render || !qr(t, ""))
      return Nr(t, "boundMap", Or(), function(K) {
        return JSON.stringify(K);
      }), Nr(t, "innerBoundMap", Or(), function(K) {
        return JSON.stringify(K);
      }), [];
    r.guidelines = zi(t);
    var d = Math.min(i[0], o[0], s[0], l[0]), p = Math.min(i[1], o[1], s[1], l[1]), h = u.externalPoses || [], g = _e(t.state), x = [], y = [], b = [], w = [], E = [], _ = Ee(g), D = _.width, M = _.height, m = _.top, I = _.left, k = _.bottom, z = _.right, P = { left: I, right: z, top: m, bottom: k, center: (I + z) / 2, middle: (m + k) / 2 }, R = h.length > 0, A = R ? Ee(h) : {};
    if (!u.request) {
      if (u.direction && E.push(Ip(t, g, u.direction, f, f)), u.snap) {
        var j = Ee(g);
        u.center && (j.middle = (j.top + j.bottom) / 2, j.center = (j.left + j.right) / 2), E.push(Is(t, j, f, f));
      }
      R && (u.center && (A.middle = (A.top + A.bottom) / 2, A.center = (A.left + A.right) / 2), E.push(Is(t, A, f, f))), E.forEach(function(K) {
        var nt = K.vertical.posInfos, Q = K.horizontal.posInfos;
        x.push.apply(x, J([], N(nt.filter(function(at) {
          var it = at.guidelineInfos;
          return it.some(function(mt) {
            var bt = mt.guideline;
            return !bt.hide;
          });
        }).map(function(at) {
          return {
            type: "snap",
            pos: at.pos
          };
        })), !1)), y.push.apply(y, J([], N(Q.filter(function(at) {
          var it = at.guidelineInfos;
          return it.some(function(mt) {
            var bt = mt.guideline;
            return !bt.hide;
          });
        }).map(function(at) {
          return {
            type: "snap",
            pos: at.pos
          };
        })), !1)), b.push.apply(b, J([], N(Ls(nt)), !1)), w.push.apply(w, J([], N(Ls(Q)), !1));
      });
    }
    var W = Ws(t, [I, z], [m, k], x, y), X = W.boundMap, L = W.innerBoundMap;
    R && Ws(t, [A.left, A.right], [A.top, A.bottom], x, y, u.externalBounds);
    var q = J(J([], N(b), !1), N(w), !1), V = q.filter(function(K) {
      return K.element && !K.gapRects;
    }), F = q.filter(function(K) {
      return K.gapRects;
    }).sort(function(K, nt) {
      return K.gap - nt.gap;
    });
    ft(t, "onSnap", {
      guidelines: q.filter(function(K) {
        var nt = K.element;
        return !nt;
      }),
      elements: V,
      gaps: F
    }, !0);
    var et = Nr(t, "boundMap", X, function(K) {
      return JSON.stringify(K);
    }, Or()), tt = Nr(t, "innerBoundMap", L, function(K) {
      return JSON.stringify(K);
    }, Or());
    return (X === et || L === tt) && ft(t, "onBound", {
      bounds: X,
      innerBounds: L
    }, !0), J(J(J(J(J(J([], N(Zp(t, V, [d, p], P, e)), !1), N(Jp(t, F, [d, p], P, e)), !1), N(Bs(t, "horizontal", w, [a, n], P, e)), !1), N(Bs(t, "vertical", b, [a, n], P, e)), !1), N(js(t, "horizontal", y, d, n, D, 0, e)), !1), N(js(t, "vertical", x, p, a, M, 1, e)), !1);
  },
  dragStart: function(t, e) {
    t.state.snapRenderInfo = {
      request: e.isRequest,
      snap: !0,
      center: !0
    }, Kn(t);
  },
  drag: function(t) {
    var e = t.state;
    Kn(t) || (e.guidelines = zi(t)), e.snapRenderInfo && (e.snapRenderInfo.render = !0);
  },
  pinchStart: function(t) {
    this.unset(t);
  },
  dragEnd: function(t) {
    this.unset(t);
  },
  dragControlCondition: function(t, e) {
    if (fv(t, e) || Ni(t, e))
      return !0;
    if (!e.isRequest && e.inputEvent)
      return Qt(e.inputEvent.target, dt("snap-control"));
  },
  dragControlStart: function(t) {
    t.state.snapRenderInfo = null, Kn(t);
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
    t.state.snapRenderInfo = null, Kn(t);
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
function pv(t, e) {
  return [
    t[0] * e[0],
    t[1] * e[1]
  ];
}
function dt() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return Af.apply(void 0, J([lo], N(t), !1));
}
function Iu(t) {
  t();
}
function vv(t) {
  return !t || t === "none" ? [1, 0, 0, 1, 0, 0] : me(t) ? t : jr(t);
}
function cn(t, e, r) {
  return fa(e, mr(r, e), t, mr(r.map(function(n) {
    return -n;
  }), e));
}
function hv(t, e, r) {
  if (e === "%") {
    var n = yo(t.ownerSVGElement);
    return n[r ? "width" : "height"] / 100;
  }
  return 1;
}
function gv(t) {
  var e = mv(So(t, ":before"));
  return e.map(function(r, n) {
    var a = hr(r), i = a.value, o = a.unit;
    return i * hv(t, o, n === 0);
  });
}
function xa(t) {
  return t ? t.split(" ") : ["0", "0"];
}
function mv(t) {
  return xa(t.transformOrigin);
}
function Ru(t) {
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
function yn(t, e, r, n, a) {
  var i, o, s = eo(t) || or(t), l = !1, u, c;
  if (!t || r)
    u = t;
  else {
    var f = (i = t == null ? void 0 : t.assignedSlot) === null || i === void 0 ? void 0 : i.parentElement, d = t.parentElement;
    f ? (l = !0, c = d, u = f) : u = d;
  }
  for (var p = !1, h = t === e || u === e, g = "relative", x = 1, y = parseFloat(a == null ? void 0 : a("zoom")) || 1, b = a == null ? void 0 : a("position"); u && u !== s; ) {
    e === u && (h = !0);
    var w = he(u), E = u.tagName.toLowerCase(), _ = Ru(u), D = w("willChange"), M = parseFloat(w("zoom")) || 1;
    if (g = w("position"), n && M !== 1) {
      x = M;
      break;
    }
    if (
      // offsetParent is the parentElement if the target's zoom is not 1 and not absolute.
      !r && n && y !== 1 && b && b !== "absolute" || E === "svg" || E === "foreignobject" || g !== "static" || _ && _ !== "none" || D === "transform"
    )
      break;
    var m = (o = t == null ? void 0 : t.assignedSlot) === null || o === void 0 ? void 0 : o.parentNode, I = u.parentNode;
    m && (l = !0, c = I);
    var k = I;
    if (k && k.nodeType === 11) {
      u = k.host, p = !0, g = he(u)("position");
      break;
    }
    u = k, g = "relative";
  }
  return {
    offsetZoom: x,
    hasSlot: l,
    parentSlotElement: c,
    isCustomElement: p,
    isStatic: g === "static",
    isEnd: h || !u || u === s,
    offsetParent: u || s
  };
}
function xv(t, e) {
  var r, n = t.tagName.toLowerCase(), a = t.offsetLeft, i = t.offsetTop, o = he(t), s = Ki(a), l = !s, u, c;
  return !l && (n !== "svg" || t.ownerSVGElement) ? (u = Zl ? gv(t) : xa(o("transformOrigin")).map(function(f) {
    return parseFloat(f);
  }), c = u.slice(), l = !0, n === "svg" ? (a = 0, i = 0) : (r = N(Sv(t, u, t === e && e.tagName.toLowerCase() === "g"), 4), a = r[0], i = r[1], u[0] = r[2], u[1] = r[3])) : (u = xa(o("transformOrigin")).map(function(f) {
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
function Ou(t, e) {
  var r = he(t), n = he(or(t)), a = n("position");
  if (!e && (!a || a === "static"))
    return [0, 0];
  var i = parseInt(n("marginLeft"), 10), o = parseInt(n("marginTop"), 10);
  return r("position") === "absolute" && ((r("top") !== "auto" || r("bottom") !== "auto") && (o = 0), (r("left") !== "auto" || r("right") !== "auto") && (i = 0)), [i, o];
}
function Ai(t) {
  t.forEach(function(e) {
    var r = e.matrix;
    r && (e.matrix = Pe(r, 3, 4));
  });
}
function yv(t) {
  for (var e = t.parentElement, r = !1, n = or(t); e; ) {
    var a = So(e).transform;
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
function Oa(t, e) {
  return e === void 0 && (e = t.length > 9), "".concat(e ? "matrix3d" : "matrix", "(").concat(Ll(t, !e).join(","), ")");
}
function yo(t) {
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
function bv(t, e) {
  var r, n = yo(t), a = n.width, i = n.height, o = n.clientWidth, s = n.clientHeight, l = o / a, u = s / i, c = t.preserveAspectRatio.baseVal, f = c.align, d = c.meetOrSlice, p = [0, 0], h = [l, u], g = [0, 0];
  if (f !== 1) {
    var x = (f - 2) % 3, y = Math.floor((f - 2) / 3);
    p[0] = a * x / 2, p[1] = i * y / 2;
    var b = d === 2 ? Math.max(u, l) : Math.min(l, u);
    h[0] = b, h[1] = b, g[0] = (o - a) / 2 * x, g[1] = (s - i) / 2 * y;
  }
  var w = ro(h, e);
  return r = N(g, 2), w[e * (e - 1)] = r[0], w[e * (e - 1) + 1] = r[1], cn(w, e, p);
}
function Sv(t, e, r) {
  var n = t.tagName.toLowerCase();
  if (!t.getBBox || !r && n === "g")
    return [0, 0, 0, 0];
  var a = he(t), i = a("transform-box") === "fill-box", o = t.getBBox(), s = yo(t.ownerSVGElement), l = o.x, u = o.y;
  n === "foreignobject" && !l && !u && (l = parseFloat(t.getAttribute("x")) || 0, u = parseFloat(t.getAttribute("y")) || 0);
  var c = l - s.x, f = u - s.y, d = i ? e[0] : e[0] - c, p = i ? e[1] : e[1] - f;
  return [c, f, d, p];
}
function Gt(t, e, r) {
  return se(t, gr(e, r), r);
}
function Sr(t, e, r, n) {
  return [[0, 0], [e, 0], [0, r], [e, r]].map(function(a) {
    return Gt(t, a, n);
  });
}
function Ee(t) {
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
function Ys(t, e, r, n) {
  var a = Sr(t, e, r, n);
  return Ee(a);
}
function Cv(t, e, r, n, a) {
  var i, o = t.target, s = t.origin, l = e.matrix, u = Nu(o), c = u.offsetWidth, f = u.offsetHeight, d = r.getBoundingClientRect(), p = [0, 0];
  r === or(r) && (p = Ou(o, !0));
  for (var h = o.getBoundingClientRect(), g = h.left - d.left + r.scrollLeft - (r.clientLeft || 0) + p[0], x = h.top - d.top + r.scrollTop - (r.clientTop || 0) + p[1], y = h.width, b = h.height, w = fa(n, a, l), E = Ys(w, c, f, n), _ = E.left, D = E.top, M = E.width, m = E.height, I = Gt(w, s, n), k = vt(I, [_, D]), z = [
    g + k[0] * y / M,
    x + k[1] * b / m
  ], P = [0, 0], R = 0; ++R < 10; ) {
    var A = Oe(a, n);
    i = N(vt(Gt(A, z, n), Gt(A, I, n)), 2), P[0] = i[0], P[1] = i[1];
    var j = fa(n, a, mr(P, n), l), W = Ys(j, c, f, n), X = W.left, L = W.top, q = X - g, V = L - x;
    if (H(q) < 2 && H(V) < 2)
      break;
    z[0] -= q, z[1] -= V;
  }
  return P.map(function(F) {
    return Math.round(F);
  });
}
function Ev(t, e, r) {
  var n = t.length === 16, a = n ? 4 : 3, i = e.map(function(l) {
    return Gt(t, l, a);
  }), o = r.left, s = r.top;
  return i.map(function(l) {
    return [l[0] + o, l[1] + s];
  });
}
function De(t) {
  return Math.sqrt(t[0] * t[0] + t[1] * t[1]);
}
function Pu(t, e) {
  return De([
    e[0] - t[0],
    e[1] - t[1]
  ]);
}
function an(t, e, r, n) {
  r === void 0 && (r = 1), n === void 0 && (n = Xt(t, e));
  var a = Pu(t, e);
  return {
    transform: "translateY(-50%) translate(".concat(t[0], "px, ").concat(t[1], "px) rotate(").concat(n, "rad) scaleY(").concat(r, ")"),
    width: "".concat(a, "px")
  };
}
function ya(t, e) {
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
function yr(t, e) {
  var r = t[e];
  return me(r) ? O(O({}, t), r) : t;
}
function Nu(t) {
  var e = t && !Ki(t.offsetWidth), r = 0, n = 0, a = 0, i = 0, o = 0, s = 0, l = 0, u = 0, c = 0, f = 0, d = 0, p = 0, h = 1 / 0, g = 1 / 0, x = 1 / 0, y = 1 / 0, b = 0, w = 0, E = !1;
  if (t)
    if (!e && t.ownerSVGElement) {
      var _ = t.getBBox();
      E = !0, r = _.width, n = _.height, o = r, s = n, l = r, u = n, a = r, i = n;
    } else {
      var D = he(t), M = t.style, m = D("boxSizing") === "border-box", I = parseFloat(D("borderLeftWidth")) || 0, k = parseFloat(D("borderRightWidth")) || 0, z = parseFloat(D("borderTopWidth")) || 0, P = parseFloat(D("borderBottomWidth")) || 0, R = parseFloat(D("paddingLeft")) || 0, A = parseFloat(D("paddingRight")) || 0, j = parseFloat(D("paddingTop")) || 0, W = parseFloat(D("paddingBottom")) || 0, X = R + A, L = j + W, q = I + k, V = z + P, F = X + q, et = L + V, tt = D("position"), K = 0, nt = 0;
      if ("clientLeft" in t) {
        var Q = null;
        if (tt === "absolute") {
          var at = yn(t, or(t));
          Q = at.offsetParent;
        } else
          Q = t.parentElement;
        if (Q) {
          var it = he(Q);
          K = parseFloat(it("width")), nt = parseFloat(it("height"));
        }
      }
      c = Math.max(X, Pt(D("minWidth"), K) || 0), f = Math.max(L, Pt(D("minHeight"), nt) || 0), h = Pt(D("maxWidth"), K), g = Pt(D("maxHeight"), nt), isNaN(h) && (h = 1 / 0), isNaN(g) && (g = 1 / 0), b = Pt(M.width, 0) || 0, w = Pt(M.height, 0) || 0, o = parseFloat(D("width")) || 0, s = parseFloat(D("height")) || 0, l = H(o - b) < 1 ? ca(c, b || o, h) : o, u = H(s - w) < 1 ? ca(f, w || s, g) : s, r = l, n = u, a = l, i = u, m ? (x = h, y = g, d = c, p = f, l = r - F, u = n - et) : (x = h + F, y = g + et, d = c + F, p = f + et, r = l + F, n = u + et), a = l + X, i = u + L;
    }
  return {
    svg: E,
    offsetWidth: r,
    offsetHeight: n,
    clientWidth: a,
    clientHeight: i,
    contentWidth: l,
    contentHeight: u,
    inlineCSSWidth: b,
    inlineCSSHeight: w,
    cssWidth: o,
    cssHeight: s,
    minWidth: c,
    minHeight: f,
    maxWidth: h,
    maxHeight: g,
    minOffsetWidth: d,
    minOffsetHeight: p,
    maxOffsetWidth: x,
    maxOffsetHeight: y
  };
}
function zu(t, e) {
  return Xt(e > 0 ? t[0] : t[1], e > 0 ? t[1] : t[0]);
}
function Zn() {
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
function Au(t, e) {
  var r = t === or(t) || t === eo(t), n = {
    clientLeft: t.clientLeft,
    clientTop: t.clientTop,
    clientWidth: t.clientWidth,
    clientHeight: t.clientHeight,
    scrollWidth: t.scrollWidth,
    scrollHeight: t.scrollHeight,
    overflow: !1
  };
  return r && (n.clientHeight = Math.max(e.height, n.clientHeight), n.scrollHeight = Math.max(e.height, n.scrollHeight)), n.overflow = he(t)("overflow") !== "visible", O(O({}, e), n);
}
function ni(t, e, r, n) {
  var a = t.left, i = t.right, o = t.top, s = t.bottom, l = e.top, u = e.left, c = {
    left: u + a,
    top: l + o,
    right: u + i,
    bottom: l + s,
    width: i - a,
    height: s - o
  };
  return r && n ? Au(r, c) : c;
}
function fn(t, e) {
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
  return t && e ? Au(t, s) : s;
}
function wv(t) {
  var e = t.props, r = e.groupable, n = e.svgOrigin, a = t.getState(), i = a.offsetWidth, o = a.offsetHeight, s = a.svg, l = a.transformOrigin;
  return !r && s && n ? Do(n, i, o) : l;
}
function ju(t, e, r, n) {
  var a;
  if (t)
    a = t;
  else if (e)
    a = [0, 0];
  else {
    var i = r.target;
    a = Bu(i, n);
  }
  return a;
}
function Bu(t, e) {
  if (t) {
    var r = t.getAttribute("data-rotation") || "", n = t.getAttribute("data-direction");
    if (e.deg = r, !!n) {
      var a = [0, 0];
      return n.indexOf("w") > -1 && (a[0] = -1), n.indexOf("e") > -1 && (a[0] = 1), n.indexOf("n") > -1 && (a[1] = -1), n.indexOf("s") > -1 && (a[1] = 1), a;
    }
  }
}
function bo(t, e) {
  return [
    Tt(e, t[0]),
    Tt(e, t[1]),
    Tt(e, t[2]),
    Tt(e, t[3])
  ];
}
function _e(t) {
  var e = t.left, r = t.top, n = t.pos1, a = t.pos2, i = t.pos3, o = t.pos4;
  return bo([n, a, i, o], [e, r]);
}
function ji(t, e) {
  t[e ? "controlAbles" : "targetAbles"].forEach(function(r) {
    r.unset && r.unset(t);
  });
}
function Pr(t, e) {
  var r = e ? "controlGesto" : "targetGesto", n = t[r];
  (n == null ? void 0 : n.isIdle()) === !1 && ji(t, e), n == null || n.unset(), t[r] = null;
}
function ce(t, e) {
  if (e) {
    var r = $r(e);
    r.nextStyle = O(O({}, r.nextStyle), t);
  }
  return {
    style: t,
    cssText: Xr(t).map(function(n) {
      return "".concat(Vf(n, "-"), ": ").concat(t[n], ";");
    }).join("")
  };
}
function Gu(t, e, r) {
  var n = e.afterTransform || e.transform;
  return O(O({}, ce(O(O(O({}, t.style), e.style), { transform: n }), r)), { afterTransform: n, transform: t.transform });
}
function wt(t, e, r, n) {
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
function ye(t, e, r) {
  var n = e.datas, a = "isDrag" in r ? r.isDrag : e.isDrag;
  return n.datas || (n.datas = {}), O(O({ isDrag: a }, r), { moveable: t, target: t.state.target, clientX: e.clientX, clientY: e.clientY, inputEvent: e.inputEvent, currentTarget: t, lastEvent: n.lastEvent, isDouble: e.isDouble, datas: n.datas, isFirstDrag: !!e.isFirstDrag });
}
function Pa(t, e, r) {
  t._emitter.on(e, r);
}
function ft(t, e, r, n, a) {
  return t.triggerEvent(e, r, n, a);
}
function So(t, e) {
  return Ce(t).getComputedStyle(t, e);
}
function Jn(t, e, r) {
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
function Bi(t, e) {
  return t === e || t == null && e == null;
}
function Xs() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  for (var r = t.length - 1, n = 0; n < r; ++n) {
    var a = t[n];
    if (!Ki(a))
      return a;
  }
  return t[r];
}
function Fu(t, e) {
  var r = [], n = [];
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n.indexOf(o), l = r[s] || [];
    s === -1 && (n.push(o), r.push(l)), l.push(a);
  }), r;
}
function Dv(t, e) {
  var r = [], n = {};
  return t.forEach(function(a, i) {
    var o = e(a, i, t), s = n[o];
    s || (s = [], n[o] = s, r.push(s)), s.push(a);
  }), r;
}
function Lu(t) {
  return t.reduce(function(e, r) {
    return e.concat(r);
  }, []);
}
function Lr() {
  for (var t = [], e = 0; e < arguments.length; e++)
    t[e] = arguments[e];
  return t.sort(function(r, n) {
    return H(n) - H(r);
  }), t[0];
}
function Wr(t, e, r) {
  return se(Oe(t, r), gr(e, r), r);
}
function _v(t, e) {
  var r, n = t.is3d, a = t.rootMatrix, i = n ? 4 : 3;
  return r = N(Wr(a, [e.distX, e.distY], i), 2), e.distX = r[0], e.distY = r[1], e;
}
function Se(t, e, r, n) {
  if (!r[0] && !r[1])
    return e;
  var a = Gt(t, [Fs(r[0] || 1), 0], n), i = Gt(t, [0, Fs(r[1] || 1)], n), o = Gt(t, [
    r[0] / De(a),
    r[1] / De(i)
  ], n);
  return Tt(e, o);
}
function Te(t, e, r) {
  return r ? "".concat(t / e * 100, "%") : "".concat(t, "px");
}
function ba(t) {
  return H(t) <= fe ? 0 : t;
}
function Co(t) {
  return function(e) {
    if (!e.isDragging(t))
      return "";
    var r = hp(e, t), n = r.deg;
    return n ? dt("view-control-rotation".concat(n)) : "";
  };
}
function Eo(t, e) {
  return e === void 0 && (e = [t]), function(r, n) {
    if (n.isRequest)
      return e.some(function(i) {
        return n.requestAble === i;
      }) ? n.parentDirection : !1;
    var a = n.inputEvent.target;
    return Qt(a, dt("direction")) && (!t || Qt(a, dt(t)));
  };
}
function Mv(t, e, r) {
  var n, a = Br(t, {
    "x%": function(_) {
      return _ / 100 * e.offsetWidth;
    },
    "y%": function(_) {
      return _ / 100 * e.offsetHeight;
    }
  }), i = t.slice(0, r < 0 ? void 0 : r), o = t.slice(0, r < 0 ? void 0 : r + 1), s = t[r] || "", l = r < 0 ? [] : t.slice(r), u = r < 0 ? [] : t.slice(r + 1), c = a.slice(0, r < 0 ? void 0 : r), f = a.slice(0, r < 0 ? void 0 : r + 1), d = (n = a[r]) !== null && n !== void 0 ? n : Br([""])[0], p = r < 0 ? [] : a.slice(r), h = r < 0 ? [] : a.slice(r + 1), g = d ? [d] : [], x = kr(c), y = kr(f), b = kr(p), w = kr(h), E = Nt(x, b, 4);
  return {
    transforms: t,
    beforeFunctionMatrix: x,
    beforeFunctionMatrix2: y,
    targetFunctionMatrix: kr(g),
    afterFunctionMatrix: b,
    afterFunctionMatrix2: w,
    allFunctionMatrix: E,
    beforeFunctions: c,
    beforeFunctions2: f,
    targetFunction: g[0],
    afterFunctions: p,
    afterFunctions2: h,
    beforeFunctionTexts: i,
    beforeFunctionTexts2: o,
    targetFunctionText: s,
    afterFunctionTexts: l,
    afterFunctionTexts2: u
  };
}
function kv(t) {
  return !t || !me(t) || mn(t) ? !1 : Yt(t) || "length" in t;
}
function Ge(t, e) {
  return t ? mn(t) ? t : we(t) ? e ? document.querySelector(t) : t : wa(t) ? t() : Bl(t) ? t : "current" in t ? t.current : t : null;
}
function wo(t, e) {
  if (!t)
    return [];
  var r = kv(t) ? [].slice.call(t) : [t];
  return r.reduce(function(n, a) {
    return we(a) && e ? J(J([], N(n), !1), N([].slice.call(document.querySelectorAll(a))), !1) : (Yt(a) ? n.push(wo(a, e)) : n.push(Ge(a, e)), n);
  }, []);
}
function Tv(t, e, r) {
  var n = Xt(t, e) / Math.PI * 180;
  return n = r >= 0 ? n : 180 - n, n = n >= 0 ? n : 360 + n, n;
}
function Hs(t, e) {
  var r = t.rootMatrix, n = t.is3d, a = n ? 4 : 3, i = Oe(r, a);
  return n || (i = Pe(i, 3, 4)), i[12] = 0, i[13] = 0, i[14] = 0, oa(i, e);
}
function Wu(t, e, r, n, a) {
  var i = N(t, 2), o = i[0], s = i[1], l = 0, u = 0;
  if (a && o && s) {
    var c = Xt([0, 0], e), f = Xt([0, 0], n), d = De(e), p = Math.cos(c - f) * d;
    if (!n[0])
      u = p, l = u * r;
    else if (!n[1])
      l = p, u = l / r;
    else {
      var h = n[0] * o, g = n[1] * s, x = Math.atan2(h + e[0], g + e[1]), y = Math.atan2(h, g);
      x < 0 && (x += Math.PI * 2), y < 0 && (y += Math.PI * 2);
      var b = 0;
      H(x - y) < Math.PI / 2 || H(x - y) > Math.PI / 2 * 3 || (y += Math.PI), b = x - y, b > Math.PI * 2 ? b -= Math.PI * 2 : b > Math.PI ? b = 2 * Math.PI - b : b < -Math.PI && (b = -2 * Math.PI - b);
      var w = De([h + e[0], g + e[1]]) * Math.cos(b);
      l = w * Math.sin(y) - h, u = w * Math.cos(y) - g, n[0] < 0 && (l *= -1), n[1] < 0 && (u *= -1);
    }
  } else
    l = n[0] * e[0], u = n[1] * e[1];
  return [l, u];
}
function Yu(t, e, r, n) {
  var a, i = r.ratio, o = r.startOffsetWidth, s = r.startOffsetHeight, l = 0, u = 0, c = n.distX, f = n.distY, d = n.pinchScale, p = n.parentDistance, h = n.parentDist, g = n.parentScale, x = r.fixedDirection, y = [0, 1].map(function(M) {
    return H(t[M] - x[M]);
  }), b = [0, 1].map(function(M) {
    var m = y[M];
    return m !== 0 && (m = 2 / m), m;
  });
  if (h)
    l = h[0], u = h[1], e && (l ? u || (u = l / i) : l = u * i);
  else if (hn(d))
    l = (d - 1) * o, u = (d - 1) * s;
  else if (g)
    l = (g[0] - 1) * o, u = (g[1] - 1) * s;
  else if (p) {
    var w = o * y[0], E = s * y[1], _ = De([w, E]);
    l = p / _ * w * b[0], u = p / _ * E * b[1];
  } else {
    var D = Fe({ datas: r, distX: c, distY: f });
    D = b.map(function(M, m) {
      return D[m] * M;
    }), a = N(Wu([o, s], D, i, t, e), 2), l = a[0], u = a[1];
  }
  return {
    // direction,
    // sizeDirection,
    distWidth: l,
    distHeight: u
  };
}
function Gi(t, e) {
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
    var r = N(t.split(" "), 2), n = r[0], a = r[1], i = Gi(n || ""), o = Gi(a || ""), s = O(O({}, i), o), l = {
      x: "50%",
      y: "50%"
    };
    return s.x && (l.x = s.x), s.y && (l.y = s.y), s.value && (s.x && !s.y && (l.y = s.value), !s.x && s.y && (l.x = s.value)), l;
  }
  return t === "left" ? { x: "0%" } : t === "right" ? { x: "100%" } : t === "top" ? { y: "0%" } : t === "bottom" ? { y: "100%" } : t ? t === "center" ? { value: "50%" } : { value: t } : {};
}
function Do(t, e, r) {
  var n = Gi(t, !0), a = n.x, i = n.y;
  return [
    Pt(a, e) || 0,
    Pt(i, r) || 0
  ];
}
function Iv(t, e, r) {
  var n = t.map(function(i) {
    return vt(i, e);
  }), a = n.map(function(i) {
    return Sn(i, r);
  });
  return {
    prev: n,
    next: a,
    result: a.map(function(i) {
      return Tt(i, e);
    })
  };
}
function Xu(t, e) {
  return t.length === e.length && t.every(function(r, n) {
    var a = e[n], i = Yt(r), o = Yt(a);
    return i && o ? Xu(r, a) : !i && !o ? r === a : !1;
  });
}
function Nr(t, e, r, n, a) {
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
function ai(t, e) {
  return Jf(t).map(function(r) {
    return e(r);
  });
}
function Hu(t) {
  return hn(t) ? {
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
var Rv = Dn("pinchable", {
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
    }), d = wt(t, e, {});
    n && (d.targets = n);
    var p = ft(t, u, d);
    r.isPinch = p !== !1, r.ables = f;
    var h = r.isPinch;
    return h ? (f.forEach(function(g) {
      if (i[g.name] = i[g.name] || {}, !!g[c]) {
        var x = O(O({}, e), { datas: i[g.name], parentRotate: a, isPinch: !0 });
        g[c](t, x);
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
      ft(t, f, c);
      var d = r.ables, p = "drag".concat(s ? "Group" : "", "Control");
      return d.forEach(function(h) {
        h[p] && h[p](t, O(O({}, e), { datas: i[h.name], inputEvent: o, resolveMatrix: !0, pinchScale: n, parentDistance: u, parentRotate: l, isPinch: !0 }));
      }), c;
    }
  },
  pinchEnd: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.targets, o = e.originalDatas;
    if (r.isPinch) {
      var s = "onPinch".concat(i ? "Group" : "", "End"), l = ye(t, e, { isDrag: n });
      i && (l.targets = i), ft(t, s, l);
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
}), $s = Eo("scalable"), Ov = {
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
  render: fu("scalable"),
  dragControlCondition: $s,
  viewClassName: Co("scalable"),
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.inputEvent, i = e.parentDirection, o = ju(i, n, a, r), s = t.state, l = s.width, u = s.height, c = s.targetTransform, f = s.target, d = s.pos1, p = s.pos2, h = s.pos4;
    if (!o || !f)
      return !1;
    n || br(t, e), r.datas = {}, r.transform = c, r.prevDist = [1, 1], r.direction = o, r.startOffsetWidth = l, r.startOffsetHeight = u, r.startValue = [1, 1];
    var g = !o[0] && !o[1] || o[0] || !o[1];
    ka(t, e, "scale"), r.isWidth = g;
    function x(D) {
      r.ratio = D && isFinite(D) ? D : 0;
    }
    r.startPositions = _e(t.state);
    function y(D) {
      var M = Eu(r.startPositions, D);
      r.fixedDirection = M.fixedDirection, r.fixedPosition = M.fixedPosition, r.fixedOffset = M.fixedOffset;
    }
    r.setFixedDirection = y, x(Be(d, p) / Be(p, h)), y([-o[0], -o[1]]);
    var b = function(D) {
      r.minScaleSize = D;
    }, w = function(D) {
      r.maxScaleSize = D;
    };
    b([-1 / 0, -1 / 0]), w([1 / 0, 1 / 0]);
    var E = wt(t, e, O(O({ direction: o, set: function(D) {
      r.startValue = D;
    }, setRatio: x, setFixedDirection: y, setMinScaleSize: b, setMaxScaleSize: w }, Ma(t, e)), { dragStart: le.dragStart(t, new Gr().dragStart([0, 0], e)) })), _ = ft(t, "onScaleStart", E);
    return r.startFixedDirection = r.fixedDirection, _ !== !1 && (r.isScale = !0, t.state.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    }), r.isScale ? E : !1;
  },
  dragControl: function(t, e) {
    Da(t, e, "scale");
    var r = e.datas, n = e.parentKeepRatio, a = e.parentFlag, i = e.isPinch, o = e.dragClient, s = e.isRequest, l = e.useSnap, u = e.resolveMatrix, c = r.prevDist, f = r.direction, d = r.startOffsetWidth, p = r.startOffsetHeight, h = r.isScale, g = r.startValue, x = r.isWidth, y = r.ratio;
    if (!h)
      return !1;
    var b = t.props, w = b.throttleScale, E = b.parentMoveable, _ = f;
    !f[0] && !f[1] && (_ = [1, 1]);
    var D = y && (n ?? b.keepRatio) || !1, M = t.state, m = [
      g[0],
      g[1]
    ];
    function I() {
      var Z = Yu(_, D, r, e), ut = Z.distWidth, Et = Z.distHeight, pt = d ? (d + ut) / d : 1, ht = p ? (p + Et) / p : 1;
      g[0] || (m[0] = ut / d), g[1] || (m[1] = Et / p);
      var St = (_[0] || D ? pt : 1) * m[0], gt = (_[1] || D ? ht : 1) * m[1];
      return St === 0 && (St = ue(c[0]) * qn), gt === 0 && (gt = ue(c[1]) * qn), [St, gt];
    }
    var k = I();
    if (!i && t.props.groupable) {
      var z = M.snapRenderInfo || {}, P = z.direction;
      Yt(P) && (P[0] || P[1]) && (M.snapRenderInfo = { direction: f, request: e.isRequest });
    }
    ft(t, "onBeforeScale", wt(t, e, {
      scale: k,
      setFixedDirection: function(Z) {
        return r.setFixedDirection(Z), k = I(), k;
      },
      startFixedDirection: r.startFixedDirection,
      setScale: function(Z) {
        k = Z;
      }
    }, !0));
    var R = [
      k[0] / m[0],
      k[1] / m[1]
    ], A = o, j = [0, 0], W = ue(R[0] * R[1]), X = !o && !a && i;
    if (X || u ? A = fo(t, r.targetAllTransform, [0, 0], [0, 0], r) : o || (A = r.fixedPosition), i || (j = uv(t, R, f, !l && s, r)), D) {
      _[0] && _[1] && j[0] && j[1] && (Math.abs(j[0] * d) > Math.abs(j[1] * p) ? j[1] = 0 : j[0] = 0);
      var L = !j[0] && !j[1];
      if (L && (x ? R[0] = xt(R[0] * m[0], w) / m[0] : R[1] = xt(R[1] * m[1], w) / m[1]), _[0] && !_[1] || j[0] && !j[1] || L && x) {
        R[0] += j[0];
        var q = d * R[0] * m[0] / y;
        R[1] = ue(W * R[0]) * H(q / p / m[1]);
      } else if (!_[0] && _[1] || !j[0] && j[1] || L && !x) {
        R[1] += j[1];
        var V = p * R[1] * m[1] * y;
        R[0] = ue(W * R[1]) * H(V / d / m[0]);
      }
    } else
      R[0] += j[0], R[1] += j[1], j[0] || (R[0] = xt(R[0] * m[0], w) / m[0]), j[1] || (R[1] = xt(R[1] * m[1], w) / m[1]);
    R[0] === 0 && (R[0] = ue(c[0]) * qn), R[1] === 0 && (R[1] = ue(c[1]) * qn), k = pv(R, [m[0], m[1]]);
    var F = [
      d,
      p
    ], et = [
      d * k[0],
      p * k[1]
    ];
    et = Qi(et, r.minScaleSize, r.maxScaleSize, D ? y : !1), k = ai(2, function(Z) {
      return F[Z] ? et[Z] / F[Z] : et[Z];
    }), R = ai(2, function(Z) {
      return k[Z] / m[Z];
    });
    var tt = ai(2, function(Z) {
      return c[Z] ? R[Z] / c[Z] : R[Z];
    }), K = "scale(".concat(R.join(", "), ")"), nt = "scale(".concat(k.join(", "), ")"), Q = _a(r, nt, K), at = !g[0] || !g[1], it = up(t, at ? nt : K, r.fixedDirection, A, r.fixedOffset, r, at), mt = X ? it : vt(it, r.prevInverseDist || [0, 0]);
    if (r.prevDist = R, r.prevInverseDist = it, k[0] === c[0] && k[1] === c[1] && mt.every(function(Z) {
      return !Z;
    }) && !E && !X)
      return !1;
    var bt = wt(t, e, O({ offsetWidth: d, offsetHeight: p, direction: f, scale: k, dist: R, delta: tt, isPinch: !!i }, iu(t, Q, mt, i, e)));
    return ft(t, "onScale", bt), bt;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    if (!r.isScale)
      return !1;
    r.isScale = !1;
    var n = ye(t, e, {});
    return ft(t, "onScaleEnd", n), n;
  },
  dragGroupControlCondition: $s,
  dragGroupControlStart: function(t, e) {
    var r = e.datas, n = this.dragControlStart(t, e);
    if (!n)
      return !1;
    var a = Re(t, "resizable", e);
    r.moveableScale = t.scale;
    var i = Ve(t, this, "dragControlStart", e, function(u, c) {
      return ha(t, u, r, c);
    }), o = function(u) {
      n.setFixedDirection(u), i.forEach(function(c, f) {
        c.setFixedDirection(u), ha(t, c.moveable, r, a[f]);
      });
    };
    r.setFixedDirection = o;
    var s = O(O({}, n), { targets: t.props.targets, events: i, setFixedDirection: o }), l = ft(t, "onScaleGroupStart", s);
    return r.isScale = l !== !1, r.isScale ? s : !1;
  },
  dragGroupControl: function(t, e) {
    var r = e.datas;
    if (r.isScale) {
      Pa(t, "onBeforeScale", function(c) {
        ft(t, "onBeforeScaleGroup", wt(t, e, O(O({}, c), { targets: t.props.targets }), !0));
      });
      var n = this.dragControl(t, e);
      if (n) {
        var a = n.dist, i = r.moveableScale;
        t.scale = [
          a[0] * i[0],
          a[1] * i[1]
        ];
        var o = t.props.keepRatio, s = r.fixedPosition, l = Ve(t, this, "dragControl", e, function(c, f) {
          var d = N(se(Cn(t.rotation / 180 * Math.PI, 3), [
            f.datas.originalX * a[0],
            f.datas.originalY * a[1],
            1
          ], 3), 2), p = d[0], h = d[1];
          return O(O({}, f), {
            parentDist: null,
            parentScale: a,
            parentKeepRatio: o,
            // recalculate child fixed position for parent group's dragging.
            dragClient: Tt(s, [p, h])
          });
        }), u = O({ targets: t.props.targets, events: l }, n);
        return ft(t, "onScaleGroup", u), u;
      }
    }
  },
  dragGroupControlEnd: function(t, e) {
    var r = e.isDrag, n = e.datas;
    if (n.isScale) {
      this.dragControlEnd(t, e);
      var a = Ve(t, this, "dragControlEnd", e), i = ye(t, e, {
        targets: t.props.targets,
        events: a
      });
      return ft(t, "onScaleGroupEnd", i), r;
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
    return ua(r, e[n], 1, 2);
  });
}
function qs(t, e, r) {
  var n = Xt(t, e), a = Xt(t, r), i = a - n;
  return i >= 0 ? i : i + 2 * Math.PI;
}
function Pv(t, e) {
  var r = qs(t[0], t[1], t[2]), n = qs(e[0], e[1], e[2]), a = Math.PI;
  return !(r >= a && n <= a || r <= a && n >= a);
}
var Nv = {
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
  viewClassName: Co("warpable"),
  render: function(t, e) {
    var r = t.props, n = r.resizable, a = r.scalable, i = r.warpable, o = r.zoom;
    if (n || a || !i)
      return [];
    var s = t.state, l = s.pos1, u = s.pos2, c = s.pos3, f = s.pos4, d = Qe(l, u), p = Qe(u, l), h = Qe(l, c), g = Qe(c, l), x = Qe(c, f), y = Qe(f, c), b = Qe(u, f), w = Qe(f, u);
    return J([
      e.createElement("div", { className: dt("line"), key: "middeLine1", style: an(d, x, o) }),
      e.createElement("div", { className: dt("line"), key: "middeLine2", style: an(p, y, o) }),
      e.createElement("div", { className: dt("line"), key: "middeLine3", style: an(h, b, o) }),
      e.createElement("div", { className: dt("line"), key: "middeLine4", style: an(g, w, o) })
    ], N(du(t, "warpable", e)), !1);
  },
  dragControlCondition: function(t, e) {
    if (e.isRequest)
      return !1;
    var r = e.inputEvent.target;
    return Qt(r, dt("direction")) && Qt(r, dt("warpable"));
  },
  dragControlStart: function(t, e) {
    var r = e.datas, n = e.inputEvent, a = t.props.target, i = n.target, o = Bu(i, r);
    if (!o || !a)
      return !1;
    var s = t.state, l = s.transformOrigin, u = s.is3d, c = s.targetTransform, f = s.targetMatrix, d = s.width, p = s.height, h = s.left, g = s.top;
    r.datas = {}, r.targetTransform = c, r.warpTargetMatrix = u ? f : Pe(f, 3, 4), r.targetInverseMatrix = Gl(Oe(r.warpTargetMatrix, 4), 3, 4), r.direction = o, r.left = h, r.top = g, r.poses = [
      [0, 0],
      [d, 0],
      [0, p],
      [d, p]
    ].map(function(b) {
      return vt(b, l);
    }), r.nextPoses = r.poses.map(function(b) {
      var w = N(b, 2), E = w[0], _ = w[1];
      return se(r.warpTargetMatrix, [E, _, 0, 1], 4);
    }), r.startValue = At(4), r.prevMatrix = At(4), r.absolutePoses = _e(s), r.posIndexes = au(o), br(t, e), ka(t, e, "matrix3d"), s.snapRenderInfo = {
      request: e.isRequest,
      direction: o
    };
    var x = wt(t, e, O({ set: function(b) {
      r.startValue = b;
    } }, Ma(t, e))), y = ft(t, "onWarpStart", x);
    return y !== !1 && (r.isWarp = !0), r.isWarp;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isRequest, a = e.distX, i = e.distY, o = r.targetInverseMatrix, s = r.prevMatrix, l = r.isWarp, u = r.startValue, c = r.poses, f = r.posIndexes, d = r.absolutePoses;
    if (!l)
      return !1;
    if (Da(t, e, "matrix3d"), qr(t, "warpable")) {
      var p = f.map(function(I) {
        return d[I];
      });
      p.length > 1 && p.push([
        (p[0][0] + p[1][0]) / 2,
        (p[0][1] + p[1][1]) / 2
      ]);
      var h = Ra(t, n, {
        horizontal: p.map(function(I) {
          return I[1] + i;
        }),
        vertical: p.map(function(I) {
          return I[0] + a;
        })
      }), g = h.horizontal, x = h.vertical;
      i -= g.offset, a -= x.offset;
    }
    var y = Fe({ datas: r, distX: a, distY: i }, !0), b = r.nextPoses.slice();
    if (f.forEach(function(I) {
      b[I] = Tt(b[I], y);
    }), !Jd.every(function(I) {
      return Pv(I.map(function(k) {
        return c[k];
      }), I.map(function(k) {
        return b[k];
      }));
    }))
      return !1;
    var w = no(c[0], c[2], c[1], c[3], b[0], b[2], b[1], b[3]);
    if (!w.length)
      return !1;
    var E = Nt(o, w, 4), _ = ru(r, E, !0), D = Nt(Oe(s, 4), _, 4);
    r.prevMatrix = _;
    var M = Nt(u, _, 4), m = _a(r, "matrix3d(".concat(M.join(", "), ")"), "matrix3d(".concat(_.join(", "), ")"));
    return co(e, m), ft(t, "onWarp", wt(t, e, O({ delta: D, matrix: M, dist: _, multiply: Nt, transform: m }, ce({
      transform: m
    }, e)))), !0;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas, n = e.isDrag;
    return r.isWarp ? (r.isWarp = !1, ft(t, "onWarpEnd", ye(t, e, {})), n) : !1;
  }
}, zv = /* @__PURE__ */ dt("area-pieces"), Qn = /* @__PURE__ */ dt("area-piece"), $u = /* @__PURE__ */ dt("avoid"), Av = dt("view-dragging");
function ii(t) {
  var e = t.areaElement;
  if (e) {
    var r = t.state, n = r.width, a = r.height;
    jl(e, $u), e.style.cssText += "left: 0px; top: 0px; width: ".concat(n, "px; height: ").concat(a, "px");
  }
}
function Vs(t) {
  return t.createElement(
    "div",
    { key: "area_pieces", className: zv },
    t.createElement("div", { className: Qn }),
    t.createElement("div", { className: Qn }),
    t.createElement("div", { className: Qn }),
    t.createElement("div", { className: Qn })
  );
}
var qu = {
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
        e.createElement("div", { key: "area", ref: rr(t, "areaElement"), className: f }),
        Vs(e)
      ];
    if (!n || !a)
      return [];
    var d = no([0, 0], [l, 0], [0, u], [l, u], c[0], c[1], c[2], c[3]), p = d.length ? Oa(d, !0) : "none";
    return [
      e.createElement("div", { key: "area", ref: rr(t, "areaElement"), className: f, style: {
        top: "0px",
        left: "0px",
        width: "".concat(l, "px"),
        height: "".concat(u, "px"),
        transformOrigin: "0 0",
        transform: p
      } }),
      Vs(e)
    ];
  },
  dragStart: function(t, e) {
    var r = e.datas, n = e.clientX, a = e.clientY, i = e.inputEvent;
    if (!i)
      return !1;
    r.isDragArea = !1;
    var o = t.areaElement, s = t.state, l = s.moveableClientRect, u = s.renderPoses, c = s.rootMatrix, f = s.is3d, d = l.left, p = l.top, h = Ee(u), g = h.left, x = h.top, y = h.width, b = h.height, w = f ? 4 : 3, E = N(Wr(c, [n - d, a - p], w), 2), _ = E[0], D = E[1];
    _ -= g, D -= x;
    var M = [
      { left: g, top: x, width: y, height: D - 10 },
      { left: g, top: x, width: _ - 10, height: b },
      { left: g, top: x + D + 10, width: y, height: b - D - 10 },
      { left: g + _ + 10, top: x, width: y - _ - 10, height: b }
    ], m = [].slice.call(o.nextElementSibling.children);
    M.forEach(function(I, k) {
      m[k].style.cssText = "left: ".concat(I.left, "px;top: ").concat(I.top, "px; width: ").concat(I.width, "px; height: ").concat(I.height, "px;");
    }), to(o, $u), s.disableNativeEvent = !0;
  },
  drag: function(t, e) {
    var r = e.datas, n = e.inputEvent;
    if (this.enableNativeEvent(t), !n)
      return !1;
    r.isDragArea || (r.isDragArea = !0, ii(t));
  },
  dragEnd: function(t, e) {
    this.enableNativeEvent(t);
    var r = e.inputEvent, n = e.datas;
    if (!r)
      return !1;
    n.isDragArea || ii(t);
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
    ii(t), t.state.disableNativeEvent = !1;
  },
  enableNativeEvent: function(t) {
    var e = t.state;
    e.disableNativeEvent && Al(function() {
      e.disableNativeEvent = !1;
    });
  }
}, jv = Dn("origin", {
  props: ["origin", "svgOrigin"],
  render: function(t, e) {
    var r = t.props, n = r.zoom, a = r.svgOrigin, i = r.groupable, o = t.getState(), s = o.beforeOrigin, l = o.rotation, u = o.svg, c = o.allMatrix, f = o.is3d, d = o.left, p = o.top, h = o.offsetWidth, g = o.offsetHeight, x;
    if (!i && u && a) {
      var y = N(Do(a, h, g), 2), b = y[0], w = y[1], E = f ? 4 : 3, _ = Gt(c, [b, w], E);
      x = ya(l, n, vt(_, [d, p]));
    } else
      x = ya(l, n, s);
    return [
      e.createElement("div", { className: dt("control", "origin"), style: x, key: "beforeOrigin" })
    ];
  }
});
function Bv(t) {
  var e = t.scrollContainer;
  return [
    e.scrollLeft,
    e.scrollTop
  ];
}
var Gv = {
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
    var r = t.props, n = r.scrollContainer, a = n === void 0 ? t.getContainer() : n, i = r.scrollOptions, o = new Xl(), s = Ge(a, !0);
    e.datas.dragScroll = o, t.state.dragScroll = o;
    var l = e.isControl ? "controlGesto" : "targetGesto", u = e.targets;
    o.on("scroll", function(c) {
      var f = c.container, d = c.direction, p = wt(t, e, {
        scrollContainer: f,
        direction: d
      }), h = u ? "onScrollGroup" : "onScroll";
      u && (p.targets = u), ft(t, h, p);
    }).on("move", function(c) {
      var f = c.offsetX, d = c.offsetY, p = c.inputEvent;
      t[l].scrollBy(f, d, p.inputEvent, !1);
    }).on("scrollDrag", function(c) {
      var f = c.next;
      f(t[l].getCurrentEvent());
    }), o.dragStart(e, O({ container: s }, i));
  },
  checkScroll: function(t, e) {
    var r = e.datas.dragScroll;
    if (r) {
      var n = t.props, a = n.scrollContainer, i = a === void 0 ? t.getContainer() : a, o = n.scrollThreshold, s = o === void 0 ? 0 : o, l = n.scrollThrottleTime, u = l === void 0 ? 0 : l, c = n.getScrollPosition, f = c === void 0 ? Bv : c, d = n.scrollOptions;
      return r.drag(e, O({ container: i, threshold: s, throttleTime: u, getScrollPosition: function(p) {
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
}, Vu = {
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
}, Fv = Dn("padding", {
  props: ["padding"],
  render: function(t, e) {
    var r = t.props;
    if (r.dragArea)
      return [];
    var n = Hu(r.padding || {}), a = n.left, i = n.top, o = n.right, s = n.bottom, l = t.getState(), u = l.renderPoses, c = l.pos1, f = l.pos2, d = l.pos3, p = l.pos4, h = [c, f, d, p], g = [];
    return a > 0 && g.push([0, 2]), i > 0 && g.push([0, 1]), o > 0 && g.push([1, 3]), s > 0 && g.push([2, 3]), g.map(function(x, y) {
      var b = N(x, 2), w = b[0], E = b[1], _ = h[w], D = h[E], M = u[w], m = u[E], I = no([0, 0], [100, 0], [0, 100], [100, 100], _, D, M, m);
      if (I.length)
        return e.createElement("div", { key: "padding".concat(y), className: dt("padding"), style: {
          transform: Oa(I, !0)
        } });
    });
  }
}), Us = ["nw", "ne", "se", "sw"];
function ta(t, e) {
  var r = t[0] + t[1], n = r > e ? e / r : 1;
  return t[0] *= n, t[1] = e - t[1] * n, t;
}
var Lv = [1, 2, 5, 6], Wv = [0, 3, 4, 7], dr = [1, -1, -1, 1], pr = [1, 1, -1, -1];
function _o(t, e, r, n, a, i, o, s) {
  a === void 0 && (a = 0), i === void 0 && (i = 0), o === void 0 && (o = r), s === void 0 && (s = n);
  var l = [], u = !1, c = t.filter(function(d) {
    return !d.virtual;
  }), f = c.map(function(d) {
    var p = d.horizontal, h = d.vertical, g = d.pos;
    if (h && !u && (u = !0, l.push("/")), u) {
      var x = Math.max(0, h === 1 ? g[1] - i : s - g[1]);
      return l.push(Te(x, n, e)), x;
    } else {
      var x = Math.max(0, p === 1 ? g[0] - a : o - g[0]);
      return l.push(Te(x, r, e)), x;
    }
  });
  return {
    radiusPoses: c,
    styles: l,
    raws: f
  };
}
function Uu(t) {
  for (var e = [0, 0], r = [0, 0], n = t.length, a = 0; a < n; ++a) {
    var i = t[a];
    i.sub && (i.horizontal && (e[1] === 0 && (e[0] = a), e[1] = a - e[0] + 1, r[0] = a + 1), i.vertical && (r[1] === 0 && (r[0] = a), r[1] = a - r[0] + 1));
  }
  return {
    horizontalRange: e,
    verticalRange: r
  };
}
function Ku(t, e, r, n, a, i, o) {
  var s, l, u, c;
  i === void 0 && (i = [0, 0]), o === void 0 && (o = !1);
  var f = t.indexOf("/"), d = (f > -1 ? t.slice(0, f) : t).length, p = t.slice(0, d), h = t.slice(d + 1), g = p.length, x = h.length, y = x > 0, b = N(p, 4), w = b[0], E = w === void 0 ? "0px" : w, _ = b[1], D = _ === void 0 ? E : _, M = b[2], m = M === void 0 ? E : M, I = b[3], k = I === void 0 ? D : I, z = N(h, 4), P = z[0], R = P === void 0 ? E : P, A = z[1], j = A === void 0 ? y ? R : D : A, W = z[2], X = W === void 0 ? y ? R : m : W, L = z[3], q = L === void 0 ? y ? j : k : L, V = [E, D, m, k].map(function(Q) {
    return Pt(Q, e);
  }), F = [R, j, X, q].map(function(Q) {
    return Pt(Q, r);
  }), et = V.slice(), tt = F.slice();
  s = N(ta([et[0], et[1]], e), 2), et[0] = s[0], et[1] = s[1], l = N(ta([et[3], et[2]], e), 2), et[3] = l[0], et[2] = l[1], u = N(ta([tt[0], tt[3]], r), 2), tt[0] = u[0], tt[3] = u[1], c = N(ta([tt[1], tt[2]], r), 2), tt[1] = c[0], tt[2] = c[1];
  var K = o ? et : et.slice(0, Math.max(i[0], g)), nt = o ? tt : tt.slice(0, Math.max(i[1], x));
  return J(J([], N(K.map(function(Q, at) {
    var it = Us[at];
    return {
      virtual: at >= g,
      horizontal: dr[at],
      vertical: 0,
      pos: [n + Q, a + (pr[at] === -1 ? r : 0)],
      sub: !0,
      raw: V[at],
      direction: it
    };
  })), !1), N(nt.map(function(Q, at) {
    var it = Us[at];
    return {
      virtual: at >= x,
      horizontal: 0,
      vertical: pr[at],
      pos: [n + (dr[at] === -1 ? e : 0), a + Q],
      sub: !0,
      raw: F[at],
      direction: it
    };
  })), !1);
}
function Yv(t, e, r, n, a) {
  a === void 0 && (a = e.length);
  var i = Uu(t.slice(n)), o = i.horizontalRange, s = i.verticalRange, l = r - n, u = 0;
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
function Xv(t, e, r, n, a, i, o, s, l, u, c) {
  u === void 0 && (u = 0), c === void 0 && (c = 0);
  var f = Uu(t.slice(r)), d = f.horizontalRange, p = f.verticalRange;
  if (n > -1)
    for (var h = dr[n] === 1 ? i - u : s - i, g = d[1]; g <= n; ++g) {
      var x = pr[g] === 1 ? c : l, y = 0;
      if (n === g ? y = i : g === 0 ? y = u + h : dr[g] === -1 && (y = s - (e[r][0] - u)), t.splice(r + g, 0, {
        horizontal: dr[g],
        vertical: 0,
        pos: [y, x]
      }), e.splice(r + g, 0, [y, x]), g === 0)
        break;
    }
  else if (a > -1) {
    var b = pr[a] === 1 ? o - c : l - o;
    if (d[1] === 0 && p[1] === 0) {
      var w = [
        u + b,
        c
      ];
      t.push({
        horizontal: dr[0],
        vertical: 0,
        pos: w
      }), e.push(w);
    }
    for (var E = p[0], g = p[1]; g <= a; ++g) {
      var y = dr[g] === 1 ? u : s, x = 0;
      if (a === g ? x = o : g === 0 ? x = c + b : pr[g] === 1 ? x = e[r + E][1] : pr[g] === -1 && (x = l - (e[r + E][1] - c)), t.push({
        horizontal: 0,
        vertical: pr[g],
        pos: [y, x]
      }), e.push([y, x]), g === 0)
        break;
    }
  }
}
function Hv(t, e) {
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
var $v = [
  [0, -1, "n"],
  [1, 0, "e"]
], qv = [
  [-1, -1, "nw"],
  [0, -1, "n"],
  [1, -1, "ne"],
  [1, 0, "e"],
  [1, 1, "se"],
  [0, 1, "s"],
  [-1, 1, "sw"],
  [-1, 0, "w"]
];
function Mo(t, e, r) {
  var n = t.props.clipRelative, a = t.state, i = a.width, o = a.height, s = e, l = s.type, u = s.poses, c = l === "rect", f = l === "circle";
  if (l === "polygon")
    return r.map(function(D) {
      return "".concat(Te(D[0], i, n), " ").concat(Te(D[1], o, n));
    });
  if (c || l === "inset") {
    var d = r[1][1], p = r[3][0], h = r[7][0], g = r[5][1];
    if (c)
      return [
        d,
        p,
        g,
        h
      ].map(function(D) {
        return "".concat(D, "px");
      });
    var x = [d, i - p, o - g, h].map(function(D, M) {
      return Te(D, M % 2 ? i : o, n);
    });
    if (r.length > 8) {
      var y = N(vt(r[4], r[0]), 2), b = y[0], w = y[1];
      x.push.apply(x, J(["round"], N(_o(u.slice(8).map(function(D, M) {
        return O(O({}, D), { pos: r[M] });
      }), n, b, w, h, d, p, g).styles), !1));
    }
    return x;
  } else if (f || l === "ellipse") {
    var E = r[0], _ = Te(H(r[1][1] - E[1]), f ? Math.sqrt((i * i + o * o) / 2) : o, n), x = f ? [_] : [Te(H(r[2][0] - E[0]), i, n), _];
    return x.push("at", Te(E[0], i, n), Te(E[1], o, n)), x;
  }
}
function Sa(t, e, r, n) {
  var a = [n, (n + e) / 2, e], i = [t, (t + r) / 2, r];
  return qv.map(function(o) {
    var s = N(o, 3), l = s[0], u = s[1], c = s[2], f = a[l + 1], d = i[u + 1];
    return {
      vertical: H(u),
      horizontal: H(l),
      direction: c,
      pos: [f, d]
    };
  });
}
function Zu(t) {
  var e = [1 / 0, -1 / 0], r = [1 / 0, -1 / 0];
  return t.forEach(function(n) {
    var a = n.pos;
    e[0] = Math.min(e[0], a[0]), e[1] = Math.max(e[1], a[0]), r[0] = Math.min(r[0], a[1]), r[1] = Math.max(r[1], a[1]);
  }), [
    H(e[1] - e[0]),
    H(r[1] - r[0])
  ];
}
function Ks(t, e, r, n, a) {
  var i, o, s, l, u, c, f, d, p;
  if (t) {
    var h = a;
    if (!h) {
      var g = he(t), x = g("clipPath");
      h = x !== "none" ? x : g("clip");
    }
    if (!((!h || h === "none" || h === "auto") && (h = n, !h))) {
      var y = zl(h), b = y.prefix, w = b === void 0 ? h : b, E = y.value, _ = E === void 0 ? "" : E, D = w === "circle", M = " ";
      if (w === "polygon") {
        var m = vr(_ || "0% 0%, 100% 0%, 100% 100%, 0% 100%");
        M = ",";
        var I = m.map(function(Ht) {
          var ne = N(Ht.split(" "), 2), $t = ne[0], Ft = ne[1];
          return {
            vertical: 1,
            horizontal: 1,
            pos: [
              Pt($t, e),
              Pt(Ft, r)
            ]
          };
        }), k = xr(I.map(function(Ht) {
          return Ht.pos;
        }));
        return {
          type: w,
          clipText: h,
          poses: I,
          splitter: M,
          left: k.minX,
          right: k.maxX,
          top: k.minY,
          bottom: k.maxY
        };
      } else if (D || w === "ellipse") {
        var z = "", P = "", R = 0, A = 0, m = nr(_);
        if (D) {
          var j = "";
          i = N(m, 4), o = i[0], j = o === void 0 ? "50%" : o, s = i[2], z = s === void 0 ? "50%" : s, l = i[3], P = l === void 0 ? "50%" : l, R = Pt(j, Math.sqrt((e * e + r * r) / 2)), A = R;
        } else {
          var W = "", X = "";
          u = N(m, 5), c = u[0], W = c === void 0 ? "50%" : c, f = u[1], X = f === void 0 ? "50%" : f, d = u[3], z = d === void 0 ? "50%" : d, p = u[4], P = p === void 0 ? "50%" : p, R = Pt(W, e), A = Pt(X, r);
        }
        var L = [
          Pt(z, e),
          Pt(P, r)
        ], I = J([
          {
            vertical: 1,
            horizontal: 1,
            pos: L,
            direction: "nesw"
          }
        ], N($v.slice(0, D ? 1 : 2).map(function($t) {
          return {
            vertical: H($t[1]),
            horizontal: $t[0],
            direction: $t[2],
            sub: !0,
            pos: [
              L[0] + $t[0] * R,
              L[1] + $t[1] * A
            ]
          };
        })), !1);
        return {
          type: w,
          clipText: h,
          radiusX: R,
          radiusY: A,
          left: L[0] - R,
          top: L[1] - A,
          right: L[0] + R,
          bottom: L[1] + A,
          poses: I,
          splitter: M
        };
      } else if (w === "inset") {
        var m = nr(_ || "0 0 0 0"), q = m.indexOf("round"), V = (q > -1 ? m.slice(0, q) : m).length, F = m.slice(V + 1), et = N(m.slice(0, V), 4), tt = et[0], K = et[1], nt = K === void 0 ? tt : K, Q = et[2], at = Q === void 0 ? tt : Q, it = et[3], mt = it === void 0 ? nt : it, bt = N([tt, at].map(function($t) {
          return Pt($t, r);
        }), 2), Z = bt[0], ut = bt[1], Et = N([mt, nt].map(function($t) {
          return Pt($t, e);
        }), 2), pt = Et[0], ht = Et[1], St = e - ht, gt = r - ut, Mt = Ku(F, St - pt, gt - Z, pt, Z), I = J(J([], N(Sa(Z, St, gt, pt)), !1), N(Mt), !1);
        return {
          type: "inset",
          clipText: h,
          poses: I,
          top: Z,
          left: pt,
          right: St,
          bottom: gt,
          radius: F,
          splitter: M
        };
      } else if (w === "rect") {
        var m = vr(_ || "0px, ".concat(e, "px, ").concat(r, "px, 0px"));
        M = ",";
        var Ct = N(m.map(function(Me) {
          var ge = hr(Me).value;
          return ge;
        }), 4), kt = Ct[0], ht = Ct[1], ut = Ct[2], pt = Ct[3], I = Sa(kt, ht, ut, pt);
        return {
          type: "rect",
          clipText: h,
          poses: I,
          top: kt,
          right: ht,
          bottom: ut,
          left: pt,
          values: m,
          splitter: M
        };
      }
    }
  }
}
function Vv(t, e, r, n, a) {
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
    var h = N(Zu(t), 2), g = h[0], x = h[1], y = g && x ? g / x : 0;
    if (y && a) {
      var b = (e + 4) % 8, w = t[b].pos, E = [0, 0];
      o.indexOf("w") > -1 ? E[0] = -1 : o.indexOf("e") > -1 && (E[0] = 1), o.indexOf("n") > -1 ? E[1] = -1 : o.indexOf("s") > -1 && (E[1] = 1);
      var _ = Wu([g, x], r, y, E, !0), D = g + _[0], M = x + _[1], m = w[1], I = w[1], k = w[0], z = w[0];
      E[0] === -1 ? k = z - D : E[0] === 1 ? z = k + D : (k = k - D / 2, z = z + D / 2), E[1] === -1 ? m = I - M : (E[1] === 1 || (m = I - M / 2), I = m + M);
      var P = Sa(m, z, I, k);
      t.forEach(function(R, A) {
        l[A][0] = P[A].pos[0] - R.pos[0], l[A][1] = P[A].pos[1] - R.pos[1];
      });
    } else
      t.forEach(function(R, A) {
        var j = R.direction;
        j && (j.indexOf(d) > -1 && (l[A][0] = r[0]), j.indexOf(p) > -1 && (l[A][1] = r[1]));
      }), d && (l[1][0] = r[0] / 2, l[5][0] = r[0] / 2), p && (l[3][1] = r[1] / 2, l[7][1] = r[1] / 2);
  } else o && !s ? u.forEach(function(R) {
    var A = R === "n" || R === "s";
    t.forEach(function(j, W) {
      var X = j.direction, L = j.horizontal, q = j.vertical;
      !X || X.indexOf(R) === -1 || (l[W] = [
        A || !L ? 0 : r[0],
        !A || !q ? 0 : r[1]
      ]);
    });
  }) : l[e] = r;
  return l;
}
function Uv(t, e) {
  var r = N(eu(t, e), 2), n = r[0], a = r[1], i = e.datas, o = i.clipPath, s = i.clipIndex, l = o, u = l.type, c = l.poses, f = l.splitter, d = c.map(function(b) {
    return b.pos;
  });
  if (u === "polygon")
    d.splice(s, 0, [n, a]);
  else if (u === "inset") {
    var p = Lv.indexOf(s), h = Wv.indexOf(s), g = c.length;
    if (Xv(c, d, 8, p, h, n, a, d[4][0], d[4][1], d[0][0], d[0][1]), g === c.length)
      return;
  } else
    return;
  var x = Mo(t, o, d), y = "".concat(u, "(").concat(x.join(f), ")");
  ft(t, "onClip", wt(t, e, O({ clipEventType: "added", clipType: u, poses: d, clipStyles: x, clipStyle: y, distX: 0, distY: 0 }, ce({
    clipPath: y
  }, e))));
}
function Kv(t, e) {
  var r = e.datas, n = r.clipPath, a = r.clipIndex, i = n, o = i.type, s = i.poses, l = i.splitter, u = s.map(function(p) {
    return p.pos;
  }), c = u.length;
  if (o === "polygon")
    s.splice(a, 1), u.splice(a, 1);
  else if (o === "inset") {
    if (a < 8 || (Yv(s, u, a, 8, c), c === s.length))
      return;
  } else
    return;
  var f = Mo(t, n, u), d = "".concat(o, "(").concat(f.join(l), ")");
  ft(t, "onClip", wt(t, e, O({ clipEventType: "removed", clipType: o, poses: u, clipStyles: f, clipStyle: d, distX: 0, distY: 0 }, ce({
    clipPath: d
  }, e))));
}
var Zv = {
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
    var r = t.props, n = r.customClipPath, a = r.defaultClipPath, i = r.clipArea, o = r.zoom, s = r.groupable, l = t.getState(), u = l.target, c = l.width, f = l.height, d = l.allMatrix, p = l.is3d, h = l.left, g = l.top, x = l.pos1, y = l.pos2, b = l.pos3, w = l.pos4, E = l.clipPathState, _ = l.snapBoundInfos, D = l.rotation;
    if (!u || s)
      return [];
    var M = Ks(u, c, f, a || "inset", E || n);
    if (!M)
      return [];
    var m = p ? 4 : 3, I = M.type, k = M.poses, z = k.map(function(ht) {
      var St = Gt(d, ht.pos, m);
      return [
        St[0] - h,
        St[1] - g
      ];
    }), P = [], R = [], A = I === "rect", j = I === "inset", W = I === "polygon";
    if (A || j || W) {
      var X = j ? z.slice(0, 8) : z;
      R = X.map(function(ht, St) {
        var gt = St === 0 ? X[X.length - 1] : X[St - 1], Mt = Xt(gt, ht), Ct = Pu(gt, ht);
        return e.createElement("div", { key: "clipLine".concat(St), className: dt("line", "clip-line", "snap-control"), "data-clip-index": St, style: {
          width: "".concat(Ct, "px"),
          transform: "translate(".concat(gt[0], "px, ").concat(gt[1], "px) rotate(").concat(Mt, "rad) scaleY(").concat(o, ")")
        } });
      });
    }
    if (P = z.map(function(ht, St) {
      return e.createElement("div", { key: "clipControl".concat(St), className: dt("control", "clip-control", "snap-control"), "data-clip-index": St, style: {
        transform: "translate(".concat(ht[0], "px, ").concat(ht[1], "px) rotate(").concat(D, "rad) scale(").concat(o, ")")
      } });
    }), j && P.push.apply(P, J([], N(z.slice(8).map(function(ht, St) {
      return e.createElement("div", { key: "clipRadiusControl".concat(St), className: dt("control", "clip-control", "clip-radius", "snap-control"), "data-clip-index": 8 + St, style: {
        transform: "translate(".concat(ht[0], "px, ").concat(ht[1], "px) rotate(").concat(D, "rad) scale(").concat(o, ")")
      } });
    })), !1)), I === "circle" || I === "ellipse") {
      var L = M.left, q = M.top, V = M.radiusX, F = M.radiusY, et = N(vt(Gt(d, [L, q], m), Gt(d, [0, 0], m)), 2), tt = et[0], K = et[1], nt = "none";
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
      P.push(e.createElement("div", { key: "clipEllipse", className: dt("clip-ellipse", "snap-control"), style: {
        width: "".concat(V * 2, "px"),
        height: "".concat(F * 2, "px"),
        clipPath: nt,
        transform: "translate(".concat(-h + tt, "px, ").concat(-g + K, "px) ").concat(Oa(d))
      } }));
    }
    if (i) {
      var bt = Ee(J([x, y, b, w], N(z), !1)), Z = bt.width, ut = bt.height, Et = bt.left, pt = bt.top;
      if (W || A || j) {
        var at = j ? z.slice(0, 8) : z;
        P.push(e.createElement("div", { key: "clipArea", className: dt("clip-area", "snap-control"), style: {
          width: "".concat(Z, "px"),
          height: "".concat(ut, "px"),
          transform: "translate(".concat(Et, "px, ").concat(pt, "px)"),
          clipPath: "polygon(".concat(at.map(function(St) {
            return "".concat(St[0] - Et, "px ").concat(St[1] - pt, "px");
          }).join(", "), ")")
        } }));
      }
    }
    return _ && ["vertical", "horizontal"].forEach(function(ht) {
      var St = _[ht], gt = ht === "horizontal";
      St.isSnap && R.push.apply(R, J([], N(St.snap.posInfos.map(function(Mt, Ct) {
        var kt = Mt.pos, Ht = vt(Gt(d, gt ? [0, kt] : [kt, 0], m), [h, g]), ne = vt(Gt(d, gt ? [c, kt] : [kt, f], m), [h, g]);
        return xn(e, "", Ht, ne, o, "clip".concat(ht, "snap").concat(Ct), "guideline");
      })), !1)), St.isBound && R.push.apply(R, J([], N(St.bounds.map(function(Mt, Ct) {
        var kt = Mt.pos, Ht = vt(Gt(d, gt ? [0, kt] : [kt, 0], m), [h, g]), ne = vt(Gt(d, gt ? [c, kt] : [kt, f], m), [h, g]);
        return xn(e, "", Ht, ne, o, "clip".concat(ht, "bounds").concat(Ct), "guideline", "bounds", "bold");
      })), !1));
    }), J(J([], N(P), !1), N(R), !1);
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
    var r = t.state, n = t.props, a = n.defaultClipPath, i = n.customClipPath, o = r.target, s = r.width, l = r.height, u = e.inputEvent ? e.inputEvent.target : null, c = u && u.getAttribute("class") || "", f = e.datas, d = Ks(o, s, l, a || "inset", i);
    if (!d)
      return !1;
    var p = d.clipText, h = d.type, g = d.poses, x = ft(t, "onClipStart", wt(t, e, {
      clipType: h,
      clipStyle: p,
      poses: g.map(function(y) {
        return y.pos;
      })
    }));
    return x === !1 ? (f.isClipStart = !1, !1) : (f.isControl = c && c.indexOf("clip-control") > -1, f.isLine = c.indexOf("clip-line") > -1, f.isArea = c.indexOf("clip-area") > -1 || c.indexOf("clip-ellipse") > -1, f.clipIndex = u ? parseInt(u.getAttribute("data-clip-index"), 10) : -1, f.clipPath = d, f.isClipStart = !0, r.clipPathState = p, br(t, e), !0);
  },
  dragControl: function(t, e) {
    var r, n, a, i = e.datas, o = e.originalDatas, s = e.isDragTarget;
    if (!i.isClipStart)
      return !1;
    var l = i, u = l.isControl, c = l.isLine, f = l.isArea, d = l.clipIndex, p = l.clipPath;
    if (!p)
      return !1;
    var h = yr(t.props, "clippable"), g = h.keepRatio, x = 0, y = 0, b = o.draggable, w = Fe(e);
    s && b ? (r = N(b.prevBeforeDist, 2), x = r[0], y = r[1]) : (n = N(w, 2), x = n[0], y = n[1]);
    var E = [x, y], _ = t.state, D = _.width, M = _.height, m = !f && !u && !c, I = p.type, k = p.poses, z = p.splitter, P = k.map(function(yt) {
      return yt.pos;
    });
    m && (x = -x, y = -y);
    var R = !u || k[d].direction === "nesw", A = I === "inset" || I === "rect", j = k.map(function() {
      return [0, 0];
    });
    if (u && !R) {
      var W = k[d], X = W.horizontal, L = W.vertical, q = [
        x * H(X),
        y * H(L)
      ];
      j = Vv(k, d, q, A, g);
    } else R && (j = P.map(function() {
      return [x, y];
    }));
    var V = P.map(function(yt, jt) {
      return Tt(yt, j[jt]);
    }), F = J([], N(V), !1);
    _.snapBoundInfos = null;
    var et = p.type === "circle", tt = p.type === "ellipse";
    if (et || tt) {
      var K = Ee(V), nt = H(K.bottom - K.top), Q = H(tt ? K.right - K.left : nt), at = V[0][1] + nt, it = V[0][0] - Q, mt = V[0][0] + Q;
      et && (F.push([mt, K.bottom]), j.push([1, 0])), F.push([K.left, at]), j.push([0, 1]), F.push([it, K.bottom]), j.push([1, 0]);
    }
    var bt = Mu((h.clipHorizontalGuidelines || []).map(function(yt) {
      return Pt("".concat(yt), M);
    }), (h.clipVerticalGuidelines || []).map(function(yt) {
      return Pt("".concat(yt), D);
    }), D, M), Z = [], ut = [];
    if (et || tt)
      Z = [F[4][0], F[2][0]], ut = [F[1][1], F[3][1]];
    else if (A) {
      var Et = [F[0], F[2], F[4], F[6]], pt = [j[0], j[2], j[4], j[6]];
      Z = Et.filter(function(yt, jt) {
        return pt[jt][0];
      }).map(function(yt) {
        return yt[0];
      }), ut = Et.filter(function(yt, jt) {
        return pt[jt][1];
      }).map(function(yt) {
        return yt[1];
      });
    } else
      Z = F.filter(function(yt, jt) {
        return j[jt][0];
      }).map(function(yt) {
        return yt[0];
      }), ut = F.filter(function(yt, jt) {
        return j[jt][1];
      }).map(function(yt) {
        return yt[1];
      });
    var ht = [0, 0], St = Ns(bt, h.clipTargetBounds && { left: 0, top: 0, right: D, bottom: M }, Z, ut, 5, 5), gt = St.horizontal, Mt = St.vertical, Ct = gt.offset, kt = Mt.offset;
    if (gt.isBound && (ht[1] += Ct), Mt.isBound && (ht[0] += kt), (tt || et) && j[0][0] === 0 && j[0][1] === 0) {
      var K = Ee(V), Ht = K.bottom - K.top, ne = tt ? K.right - K.left : Ht, $t = Mt.isBound ? H(kt) : Mt.snapIndex === 0 ? -kt : kt, Ft = gt.isBound ? H(Ct) : gt.snapIndex === 0 ? -Ct : Ct;
      ne -= $t, Ht -= Ft, et && (Ht = yu(Mt, gt) > 0 ? Ht : ne, ne = Ht);
      var zt = F[0];
      F[1][1] = zt[1] - Ht, F[2][0] = zt[0] + ne, F[3][1] = zt[1] + Ht, F[4][0] = zt[0] - ne;
    } else if (A && g && u) {
      var Me = N(Zu(k), 2), ge = Me[0], Cr = Me[1], Le = ge && Cr ? ge / Cr : 0, Na = k[d], de = Na.direction || "", It = F[1][1], at = F[5][1], it = F[7][0], mt = F[3][0];
      H(Ct) <= H(kt) ? Ct = ue(Ct) * H(kt) / Le : kt = ue(kt) * H(Ct) * Le, de.indexOf("w") > -1 ? it -= kt : de.indexOf("e") > -1 ? mt -= kt : (it += kt / 2, mt -= kt / 2), de.indexOf("n") > -1 ? It -= Ct : de.indexOf("s") > -1 ? at -= Ct : (It += Ct / 2, at -= Ct / 2);
      var Er = Sa(It, mt, at, it);
      F.forEach(function(ie, Vr) {
        var Ne;
        Ne = N(Er[Vr].pos, 2), ie[0] = Ne[0], ie[1] = Ne[1];
      });
    } else
      F.forEach(function(yt, jt) {
        var Ye = j[jt];
        Ye[0] && (yt[0] -= kt), Ye[1] && (yt[1] -= Ct);
      });
    var We = Mo(t, p, V), Lt = "".concat(I, "(").concat(We.join(z), ")");
    if (_.clipPathState = Lt, et || tt)
      Z = [F[4][0], F[2][0]], ut = [F[1][1], F[3][1]];
    else if (A) {
      var Et = [F[0], F[2], F[4], F[6]];
      Z = Et.map(function(jt) {
        return jt[0];
      }), ut = Et.map(function(jt) {
        return jt[1];
      });
    } else
      Z = F.map(function(yt) {
        return yt[0];
      }), ut = F.map(function(yt) {
        return yt[1];
      });
    if (_.snapBoundInfos = Ns(bt, h.clipTargetBounds && { left: 0, top: 0, right: D, bottom: M }, Z, ut, 1, 1), b) {
      var Ke = _.is3d, sr = _.allMatrix, U = Ke ? 4 : 3, ct = ht;
      s && (ct = [
        E[0] + ht[0] - w[0],
        E[1] + ht[1] - w[1]
      ]), b.deltaOffset = Nt(sr, [ct[0], ct[1], 0, 0], U);
    }
    return ft(t, "onClip", wt(t, e, O({ clipEventType: "changed", clipType: I, poses: V, clipStyle: Lt, clipStyles: We, distX: x, distY: y }, ce((a = {}, a[I === "rect" ? "clip" : "clipPath"] = Lt, a), e)))), !0;
  },
  dragControlEnd: function(t, e) {
    this.unset(t);
    var r = e.isDrag, n = e.datas, a = e.isDouble, i = n.isLine, o = n.isClipStart, s = n.isControl;
    return o ? (ft(t, "onClipEnd", ye(t, e, {})), a && (s ? Kv(t, e) : i && Uv(t, e)), a || r) : !1;
  },
  unset: function(t) {
    t.state.clipPathState = "", t.state.snapBoundInfos = null;
  }
}, Jv = {
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
    br(t, e);
    var n = wt(t, e, {
      dragStart: le.dragStart(t, new Gr().dragStart([0, 0], e))
    }), a = ft(t, "onDragOriginStart", n);
    return r.startOrigin = t.state.transformOrigin, r.startTargetOrigin = t.state.targetOrigin, r.prevOrigin = [0, 0], r.isDragOrigin = !0, a === !1 ? (r.isDragOrigin = !1, !1) : n;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = e.isPinch, a = e.isRequest;
    if (!r.isDragOrigin)
      return !1;
    var i = N(Fe(e), 2), o = i[0], s = i[1], l = t.state, u = l.width, c = l.height, f = l.offsetMatrix, d = l.targetMatrix, p = l.is3d, h = t.props.originRelative, g = h === void 0 ? !0 : h, x = p ? 4 : 3, y = [o, s];
    if (a) {
      var b = e.distOrigin;
      (b[0] || b[1]) && (y = b);
    }
    var w = Tt(r.startOrigin, y), E = Tt(r.startTargetOrigin, y), _ = vt(y, r.prevOrigin), D = Mn(f, d, w, x), M = t.getRect(), m = Ee(Sr(D, u, c, x)), I = [
      M.left - m.left,
      M.top - m.top
    ];
    r.prevOrigin = y;
    var k = [
      Te(E[0], u, g),
      Te(E[1], c, g)
    ].join(" "), z = le.drag(t, _n(e, t.state, I, !!n)), P = wt(t, e, O(O({ width: u, height: c, origin: w, dist: y, delta: _, transformOrigin: k, drag: z }, ce({
      transformOrigin: k,
      transform: z.transform
    }, e)), { afterTransform: z.transform }));
    return ft(t, "onDragOrigin", P), P;
  },
  dragControlEnd: function(t, e) {
    var r = e.datas;
    return r.isDragOrigin ? (ft(t, "onDragOriginEnd", ye(t, e, {})), !0) : !1;
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
function Qv(t, e, r, n) {
  var a = t.filter(function(l) {
    var u = l.virtual, c = l.horizontal;
    return c && !u;
  }).length, i = t.filter(function(l) {
    var u = l.virtual, c = l.vertical;
    return c && !u;
  }).length, o = -1;
  if (e === 0 && (a === 0 ? o = 0 : a === 1 && (o = 1)), e === 2 && (a <= 2 ? o = 2 : a <= 3 && (o = 3)), e === 3 && (i === 0 ? o = 4 : i < 4 && (o = 7)), e === 1 && (i <= 1 ? o = 5 : i <= 2 && (o = 6)), !(o === -1 || !t[o].virtual)) {
    var s = t[o];
    th(t, o), o < 4 ? s.pos[0] = r : s.pos[1] = n;
  }
}
function th(t, e) {
  e < 4 ? t.slice(0, e + 1).forEach(function(r) {
    r.virtual = !1;
  }) : (t[0].virtual && (t[0].virtual = !1), t.slice(4, e + 1).forEach(function(r) {
    r.virtual = !1;
  }));
}
function eh(t, e) {
  e < 4 ? t.slice(e, 4).forEach(function(r) {
    r.virtual = !0;
  }) : t.slice(e).forEach(function(r) {
    r.virtual = !0;
  });
}
function Zs(t, e, r, n, a) {
  n === void 0 && (n = [0, 0]);
  var i = [];
  return !t || t === "0px" ? i = [] : i = nr(t), Ku(i, e, r, 0, 0, n, a);
}
function Js(t, e, r, n, a) {
  var i = t.state, o = i.width, s = i.height, l = _o(a, t.props.roundRelative, o, s), u = l.raws, c = l.styles, f = l.radiusPoses, d = Hv(f, u), p = d.horizontals, h = d.verticals, g = c.join(" ");
  i.borderRadiusState = g;
  var x = wt(t, e, O({ horizontals: p, verticals: h, borderRadius: g, width: o, height: s, delta: n, dist: r }, ce({
    borderRadius: g
  }, e)));
  return ft(t, "onRound", x), x;
}
function Qs(t) {
  var e, r, n = t.getState().style, a = n.borderRadius || "";
  if (!a && t.props.groupable) {
    var i = t.moveables[0], o = t.getTargets()[0];
    o && ((i == null ? void 0 : i.props.target) === o ? (a = (r = (e = t.moveables[0]) === null || e === void 0 ? void 0 : e.state.style.borderRadius) !== null && r !== void 0 ? r : "", n.borderRadius = a) : (a = So(o).borderRadius, n.borderRadius = a));
  }
  return a;
}
var rh = {
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
    var r = t.getState(), n = r.target, a = r.width, i = r.height, o = r.allMatrix, s = r.is3d, l = r.left, u = r.top, c = r.borderRadiusState, f = t.props, d = f.minRoundControls, p = d === void 0 ? [0, 0] : d, h = f.maxRoundControls, g = h === void 0 ? [4, 4] : h, x = f.zoom, y = f.roundPadding, b = y === void 0 ? 0 : y, w = f.isDisplayShadowRoundControls, E = f.groupable;
    if (!n)
      return null;
    var _ = c || Qs(t), D = s ? 4 : 3, M = Zs(_, a, i, p, !0);
    if (!M)
      return null;
    var m = 0, I = 0, k = E ? [0, 0] : [l, u];
    return M.map(function(z, P) {
      var R = z.horizontal, A = z.vertical, j = z.direction || "", W = J([], N(z.pos), !1);
      I += Math.abs(R), m += Math.abs(A), R && j.indexOf("n") > -1 && (W[1] -= b), A && j.indexOf("w") > -1 && (W[0] -= b), R && j.indexOf("s") > -1 && (W[1] += b), A && j.indexOf("e") > -1 && (W[0] += b);
      var X = vt(Gt(o, W, D), k), L = w && w !== "horizontal", q = z.vertical ? m <= g[1] && (L || !z.virtual) : I <= g[0] && (w || !z.virtual);
      return e.createElement("div", { key: "borderRadiusControl".concat(P), className: dt("control", "border-radius", z.vertical ? "vertical" : "", z.virtual ? "virtual" : ""), "data-radius-index": P, style: {
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
    var f = wt(t, e, {}), d = ft(t, "onRoundStart", f);
    if (d === !1)
      return !1;
    n.lineIndex = u, n.controlIndex = l, n.isControl = o, n.isLine = s, br(t, e);
    var p = t.props, h = p.roundRelative, g = p.minRoundControls, x = g === void 0 ? [0, 0] : g, y = t.state, b = y.width, w = y.height;
    n.isRound = !0, n.prevDist = [0, 0];
    var E = Qs(t), _ = Zs(E || "", b, w, x, !0) || [];
    return n.controlPoses = _, y.borderRadiusState = _o(_, h, b, w).styles.join(" "), f;
  },
  dragControl: function(t, e) {
    var r = e.datas, n = r.controlPoses;
    if (!r.isRound || !r.isControl || !n.length)
      return !1;
    var a = r.controlIndex, i = N(Fe(e), 2), o = i[0], s = i[1], l = [o, s], u = vt(l, r.prevDist), c = t.props.maxRoundControls, f = c === void 0 ? [4, 4] : c, d = t.state, p = d.width, h = d.height, g = n[a], x = g.vertical, y = g.horizontal, b = n.map(function(E) {
      var _ = E.horizontal, D = E.vertical, M = [
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
    var w = n.map(function(E, _) {
      return O(O({}, E), { pos: Tt(E.pos, b[_]) });
    });
    return a < 4 ? w.slice(0, a + 1).forEach(function(E) {
      E.virtual = !1;
    }) : w.slice(4, a + 1).forEach(function(E) {
      E.virtual = !1;
    }), r.prevDist = [o, s], Js(t, e, l, u, w);
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
        eh(u, o);
      else if (s && (d === !0 || d === "line")) {
        var p = N(eu(t, e), 2), h = p[0], g = p[1];
        Qv(u, l, h, g);
      }
      c !== u.filter(function(y) {
        var b = y.virtual;
        return b;
      }).length && Js(t, e, [0, 0], [0, 0], u);
    }
    var x = ye(t, e, {});
    return ft(t, "onRoundEnd", x), r.borderRadiusState = "", x;
  },
  dragGroupControlStart: function(t, e) {
    var r = this.dragControlStart(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Re(t, "roundable", e), o = O({ targets: t.props.targets, events: i.map(function(s, l) {
      return O(O({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] });
    }) }, r);
    return ft(t, "onRoundGroupStart", o), r;
  },
  dragGroupControl: function(t, e) {
    var r = this.dragControl(t, e);
    if (!r)
      return !1;
    var n = t.moveables, a = t.props.targets, i = Re(t, "roundable", e), o = O({ targets: t.props.targets, events: i.map(function(s, l) {
      return O(O(O({}, s), { target: a[l], moveable: n[l], currentTarget: n[l] }), ce({
        borderRadius: r.borderRadius
      }, s));
    }) }, r);
    return ft(t, "onRoundGroup", o), o;
  },
  dragGroupControlEnd: function(t, e) {
    var r = t.moveables, n = t.props.targets, a = Re(t, "roundable", e);
    Pa(t, "onRound", function(s) {
      var l = O({ targets: t.props.targets, events: a.map(function(u, c) {
        return O(O(O({}, u), { target: n[c], moveable: r[c], currentTarget: r[c] }), ce({
          borderRadius: s.borderRadius
        }, u));
      }) }, s);
      ft(t, "onRoundGroup", l);
    });
    var i = this.dragControlEnd(t, e);
    if (!i)
      return !1;
    var o = O({ targets: t.props.targets, events: a.map(function(s, l) {
      var u;
      return O(O({}, s), { target: n[l], moveable: r[l], currentTarget: r[l], lastEvent: (u = s.datas) === null || u === void 0 ? void 0 : u.lastEvent });
    }) }, i);
    return ft(t, "onRoundGroupEnd", o), o;
  },
  unset: function(t) {
    t.state.borderRadiusState = "";
  }
};
function nh(t, e) {
  var r = e ? 4 : 3, n = At(r), a = "matrix".concat(e ? "3d" : "", "(").concat(n.join(","), ")");
  return t === a || t === "matrix(1,0,0,1,0,0)";
}
var Ju = {
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
    var r = t.state, n = r.is3d, a = r.targetMatrix, i = r.inlineTransform, o = n ? "matrix3d(".concat(a.join(","), ")") : "matrix(".concat(Ll(a, !0), ")"), s = !i || i === "none" ? o : i;
    e.datas.startTransforms = nh(s, n) ? [] : nr(s);
  },
  resetStyle: function(t) {
    var e = t.datas;
    e.nextStyle = {}, e.nextTransforms = t.datas.startTransforms, e.nextTransformAppendedIndexes = [];
  },
  fillDragStartParams: function(t, e) {
    return wt(t, e, {
      setTransform: function(r) {
        e.datas.startTransforms = Yt(r) ? r : nr(r);
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
    this.setTransform(t, e), this.resetStyle(e), ft(t, "onBeforeRenderStart", this.fillDragStartParams(t, e));
  },
  drag: function(t, e) {
    e.datas.startTransforms || this.setTransform(t, e), this.resetStyle(e), ft(t, "onBeforeRender", wt(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  dragEnd: function(t, e) {
    e.datas.startTransforms || (this.setTransform(t, e), this.resetStyle(e)), ft(t, "onBeforeRenderEnd", wt(t, e, {
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
    ft(t, "onBeforeRenderGroupStart", wt(t, e, {
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
    ft(t, "onBeforeRenderGroup", wt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets,
      events: i
    }));
  },
  dragGroupEnd: function(t, e) {
    this.dragEnd(t, e), ft(t, "onBeforeRenderGroupEnd", wt(t, e, {
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
}, Qu = {
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
    ft(t, "onRenderStart", wt(t, e, {
      isPinch: !!e.isPinch
    }));
  },
  drag: function(t, e) {
    ft(t, "onRender", this.fillDragParams(t, e));
  },
  dragAfter: function(t, e) {
    return this.drag(t, e);
  },
  dragEnd: function(t, e) {
    ft(t, "onRenderEnd", this.fillDragEndParams(t, e));
  },
  dragGroupStart: function(t, e) {
    ft(t, "onRenderGroupStart", wt(t, e, {
      isPinch: !!e.isPinch,
      targets: t.props.targets
    }));
  },
  dragGroup: function(t, e) {
    var r = this, n = Re(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragParams(l, o);
    });
    ft(t, "onRenderGroup", wt(t, e, O(O({ isPinch: !!e.isPinch, targets: t.props.targets, transform: Vn(e), transformObject: {} }, ce(Un(e))), { events: i })));
  },
  dragGroupEnd: function(t, e) {
    var r = this, n = Re(t, "beforeRenderable", e), a = t.moveables, i = n.map(function(o, s) {
      var l = a[s];
      return r.fillDragEndParams(l, o);
    });
    ft(t, "onRenderGroupEnd", wt(t, e, O({ isPinch: !!e.isPinch, isDrag: e.isDrag, targets: t.props.targets, events: i, transformObject: {}, transform: Vn(e) }, ce(Un(e)))));
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
    return Br(va(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), wt(t, e, O({ isPinch: !!e.isPinch, transformObject: r, transform: Vn(e) }, ce(Un(e))));
  },
  fillDragEndParams: function(t, e) {
    var r = {};
    return Br(va(e) || []).forEach(function(n) {
      r[n.name] = n.functionValue;
    }), wt(t, e, O({ isPinch: !!e.isPinch, isDrag: e.isDrag, transformObject: r, transform: Vn(e) }, ce(Un(e))));
  }
};
function dn(t, e, r, n, a, i, o) {
  i.clientDistX = i.distX, i.clientDistY = i.distY;
  var s = a === "Start", l = a === "End", u = a === "After", c = t.state.target, f = i.isRequest, d = n.indexOf("Control") > -1;
  if (!c || s && d && !f && t.areaElement === i.inputEvent.target)
    return !1;
  var p = J([], N(e), !1);
  if (f) {
    var h = i.requestAble;
    p.some(function(P) {
      return P.name === h;
    }) || p.push.apply(p, J([], N(t.props.ables.filter(function(P) {
      return P.name === h;
    })), !1));
  }
  if (!p.length || p.every(function(P) {
    return P.dragRelation;
  }))
    return !1;
  var g = i.inputEvent, x;
  l && g && (x = document.elementFromPoint(i.clientX, i.clientY) || g.target);
  var y = !1, b = function() {
    var P;
    y = !0, (P = i.stop) === null || P === void 0 || P.call(i);
  }, w = s && (!t.targetGesto || !t.controlGesto || !t.targetGesto.isFlag() || !t.controlGesto.isFlag());
  w && t.updateRect(a, !0, !1);
  var E = i.datas, _ = d ? "controlGesto" : "targetGesto", D = t[_], M = function(P, R, A) {
    if (!(R in P) || D !== t[_])
      return !1;
    var j = P.name, W = E[j] || (E[j] = {});
    if (s && (W.isEventStart = !A || !P[A] || P[A](t, i)), !W.isEventStart)
      return !1;
    var X = P[R](t, O(O({}, i), { stop: b, datas: W, originalDatas: E, inputTarget: x }));
    return t._emitter.off(), s && X === !1 && (W.isEventStart = !1), X;
  };
  w && p.forEach(function(P) {
    P.unset && P.unset(t);
  }), M(Ju, "drag".concat(n).concat(a));
  var m = 0, I = 0;
  r.forEach(function(P) {
    if (y)
      return !1;
    var R = "".concat(P).concat(n).concat(a), A = "".concat(P).concat(n, "Condition");
    a === "" && !f && _v(t.state, i);
    var j = p.filter(function(L) {
      return L[R];
    });
    j = j.filter(function(L, q) {
      return L.name && j.indexOf(L) === q;
    });
    var W = j.filter(function(L) {
      return M(L, R, A);
    }), X = W.length;
    y && ++m, X && ++I, !y && s && j.length && !X && (m += j.filter(function(L) {
      var q = L.name, V = E[q];
      return V.isEventStart ? L.dragRelation !== "strong" : !1;
    }).length ? 1 : 0);
  }), (!u || I) && M(Qu, "drag".concat(n).concat(a));
  var k = D !== t[_] || m === r.length;
  if ((l || y || k) && (t.state.gestos = {}, t.moveables && t.moveables.forEach(function(P) {
    P.state.gestos = {};
  }), p.forEach(function(P) {
    P.unset && P.unset(t);
  })), s && !k && !f && I && t.props.preventDefault && (i == null || i.preventDefault()), t.isUnmounted || k)
    return !1;
  if (!s && I && !o || l) {
    var z = t.props.flushSync || Iu;
    z(function() {
      t.updateRect(l ? a : "", !0, !1), t.forceUpdate();
    });
  }
  return !s && !l && !u && I && !o && dn(t, e, r, n, a + "After", i), !0;
}
function ko(t, e) {
  return function(r, n) {
    var a;
    n === void 0 && (n = r.inputEvent.target);
    var i = n, o = t.areaElement, s = t._dragTarget;
    return !s || !e && (!((a = t.controlGesto) === null || a === void 0) && a.isFlag()) ? !1 : i === s || s.contains(i) || i === o || !t.isMoveableElement(i) && !t.controlBox.contains(i) || Qt(i, "moveable-area") || Qt(i, "moveable-padding") || Qt(i, "moveable-edgeDraggable");
  };
}
function tc(t, e, r) {
  var n = t.controlBox, a = [], i = t.props, o = i.dragArea, s = t.state.target, l = i.dragTarget;
  a.push(n), (!o || l) && a.push(e), !o && l && s && e !== s && i.dragTargetSelf && a.push(s);
  var u = ko(t);
  return rc(t, a, "targetAbles", r, {
    dragStart: u,
    pinchStart: u
  });
}
function ec(t, e) {
  var r = t.controlBox, n = [];
  n.push(r);
  var a = ko(t, !0), i = function(o, s) {
    if (s === void 0 && (s = o.inputEvent.target), s === r)
      return !0;
    var l = a(o, s);
    return !l;
  };
  return rc(t, n, "controlAbles", e, {
    dragStart: i,
    pinchStart: i
  });
}
function rc(t, e, r, n, a) {
  a === void 0 && (a = {});
  var i = r === "targetAbles", o = t.props, s = o.pinchOutside, l = o.pinchThreshold, u = o.preventClickEventOnDrag, c = o.preventClickDefault, f = o.checkInput, d = o.dragFocusedInput, p = o.preventDefault, h = p === void 0 ? !0 : p, g = o.preventRightClick, x = g === void 0 ? !0 : g, y = o.preventWheelClick, b = y === void 0 ? !0 : y, w = o.dragContainer, E = Ge(w, !0), _ = {
    preventDefault: h,
    preventRightClick: x,
    preventWheelClick: b,
    container: E || Ce(t.getControlBoxElement()),
    pinchThreshold: l,
    pinchOutside: s,
    preventClickEventOnDrag: i ? u : !1,
    preventClickEventOnDragStart: i ? c : !1,
    preventClickEventByCondition: i ? null : function(m) {
      return t.controlBox.contains(m.target);
    },
    checkInput: i ? f : !1,
    dragFocusedInput: d
  }, D = new ql(e, _), M = n === "Control";
  return ["drag", "pinch"].forEach(function(m) {
    ["Start", "", "End"].forEach(function(I) {
      D.on("".concat(m).concat(I), function(k) {
        var z, P = k.eventType, R = m === "drag" && k.isPinch;
        if (a[P] && !a[P](k)) {
          k.stop();
          return;
        }
        if (!R) {
          var A = m === "drag" ? [m] : ["drag", m], j = J([], N(t[r]), !1), W = dn(t, j, A, n, I, k);
          W ? (t.props.stopPropagation || I === "Start" && M) && ((z = k == null ? void 0 : k.inputEvent) === null || z === void 0 || z.stopPropagation()) : k.stop();
        }
      });
    });
  }), D;
}
var ah = /* @__PURE__ */ (function() {
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
function ih(t, e, r, n) {
  var a;
  r === void 0 && (r = e);
  var i = su(t, e), o = i.matrixes, s = i.is3d, l = i.targetMatrix, u = i.transformOrigin, c = i.targetOrigin, f = i.offsetContainer, d = i.hasFixed, p = i.zoom, h = yp(f, r), g = h.matrixes, x = h.is3d, y = h.offsetContainer, b = h.zoom, w = n, E = 4, _ = t.tagName.toLowerCase() !== "svg" && "ownerSVGElement" in t, D = l, M = At(E), m = At(E), I = At(E), k = At(E), z = o.length, P = g.map(function(q) {
    return O(O({}, q), { matrix: q.matrix ? J([], N(q.matrix), !1) : void 0 });
  }).reverse();
  o.reverse(), !s && w && (D = Pe(D, 3, 4), Ai(o)), !x && w && Ai(P), P.forEach(function(q) {
    m = Nt(m, q.matrix, E);
  });
  var R = r || or(t), A = ((a = P[0]) === null || a === void 0 ? void 0 : a.target) || yn(R, R, !0).offsetParent, j = P.slice(1).reduce(function(q, V) {
    return Nt(q, V.matrix, E);
  }, At(E));
  o.forEach(function(q, V) {
    if (z - 2 === V && (I = M.slice()), z - 1 === V && (k = M.slice()), !q.matrix) {
      var F = o[V + 1], et = Cv(q, F, A, E, Nt(j, M, E));
      q.matrix = mr(et, E);
    }
    M = Nt(M, q.matrix, E);
  });
  var W = !_ && s;
  D || (D = At(W ? 4 : 3));
  var X = Oa(_ && D.length === 16 ? Pe(D, 4, 3) : D, W), L = m;
  return m = Gl(m, E, E), {
    hasZoom: p !== 1 || b !== 1,
    hasFixed: d,
    matrixes: o,
    rootMatrix: m,
    originalRootMatrix: L,
    beforeMatrix: I,
    offsetMatrix: k,
    allMatrix: M,
    targetMatrix: D,
    targetTransform: X,
    inlineTransform: t.style.transform,
    transformOrigin: u,
    targetOrigin: c,
    is3d: w,
    offsetContainer: f,
    offsetRootContainer: y
  };
}
function oh(t, e, r, n) {
  r === void 0 && (r = e);
  var a = 0, i = 0, o = 0, s = {}, l = Nu(t);
  if (t && (a = l.offsetWidth, i = l.offsetHeight), t) {
    var u = ih(t, e, r, n), c = Ar(u.allMatrix, u.transformOrigin, a, i);
    s = O(O({}, u), c);
    var f = Ar(u.allMatrix, [50, 50], 100, 100);
    o = zu([f.pos1, f.pos2], f.direction);
  }
  var d = 4;
  return O(O(O({ hasZoom: !1, width: a, height: i, rotation: o }, l), { originalRootMatrix: At(d), rootMatrix: At(d), beforeMatrix: At(d), offsetMatrix: At(d), allMatrix: At(d), targetMatrix: At(d), targetTransform: "", inlineTransform: "", transformOrigin: [0, 0], targetOrigin: [0, 0], is3d: !0, left: 0, top: 0, right: 0, bottom: 0, origin: [0, 0], pos1: [0, 0], pos2: [0, 0], pos3: [0, 0], pos4: [0, 0], direction: 1, hasFixed: !1, offsetContainer: null, offsetRootContainer: null, matrixes: [] }), s);
}
function Fi(t, e, r, n, a, i) {
  i === void 0 && (i = []);
  var o = 1, s = [0, 0], l = Zn(), u = Zn(), c = Zn(), f = Zn(), d = [0, 0], p = {}, h = oh(e, r, a, !0);
  if (e) {
    var g = he(e);
    i.forEach(function(P) {
      p[P] = g(P);
    });
    var x = h.is3d ? 4 : 3, y = Ar(h.offsetMatrix, Tt(h.transformOrigin, Fl(h.targetMatrix, x)), h.width, h.height);
    o = y.direction, s = Tt(y.origin, [y.left - h.left, y.top - h.top]), f = fn(h.offsetRootContainer);
    var b = yn(n, n, !0).offsetParent || h.offsetRootContainer;
    if (h.hasZoom) {
      var w = Ar(Nt(h.originalRootMatrix, h.allMatrix), h.transformOrigin, h.width, h.height), E = Ar(h.originalRootMatrix, xa(he(b)("transformOrigin")).map(function(P) {
        return parseFloat(P);
      }), b.offsetWidth, b.offsetHeight);
      if (l = ni(w, f), c = ni(E, f, b, !0), t) {
        var _ = w.left, D = w.top;
        u = ni({
          left: _,
          top: D,
          bottom: D,
          right: D
        }, f);
      }
    } else {
      l = fn(e), c = xp(b), t && (u = fn(t));
      var M = c.left, m = c.top, I = c.clientLeft, k = c.clientTop, z = [
        l.left - M,
        l.top - m
      ];
      d = vt(Wr(h.rootMatrix, z, 4), [I + h.left, k + h.top]);
    }
  }
  return O({ targetClientRect: l, containerClientRect: c, moveableClientRect: u, rootContainerClientRect: f, beforeDirection: o, beforeOrigin: s, originalBeforeOrigin: s, target: e, style: p, offsetDelta: d }, h);
}
function tl(t) {
  var e = t.pos1, r = t.pos2, n = t.pos3, a = t.pos4;
  if (!e || !r || !n || !a)
    return null;
  var i = xr([e, r, n, a]), o = [i.minX, i.minY], s = vt(t.origin, o);
  return e = vt(e, o), r = vt(r, o), n = vt(n, o), a = vt(a, o), O(O({}, t), {
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
var Yr = /* @__PURE__ */ (function(t) {
  wn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.state = O({ container: null, gestos: {}, renderLines: [
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]],
      [[0, 0], [0, 0]]
    ], renderPoses: [[0, 0], [0, 0], [0, 0], [0, 0]], disableNativeEvent: !1, posDelta: [0, 0] }, Fi(null)), r.renderState = {}, r.enabledAbles = [], r.targetAbles = [], r.controlAbles = [], r.rotation = 0, r.scale = [1, 1], r.isMoveableMounted = !1, r.isUnmounted = !1, r.events = {
      mouseEnter: null,
      mouseLeave: null
    }, r._emitter = new En(), r._prevOriginalDragTarget = null, r._originalDragTarget = null, r._prevDragTarget = null, r._dragTarget = null, r._prevPropTarget = null, r._propTarget = null, r._prevDragArea = !1, r._isPropTargetChanged = !1, r._hasFirstTarget = !1, r._reiszeObserver = null, r._observerId = 0, r._mutationObserver = null, r._rootContainer = null, r._viewContainer = null, r._viewClassNames = [], r._store = {}, r.checkUpdateRect = function() {
      if (!r.isDragging()) {
        var n = r.props.parentMoveable;
        if (n) {
          n.checkUpdateRect();
          return;
        }
        Uf(r._observerId), r._observerId = Al(function() {
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
    var h = N(a || [0, 0], 2), g = h[0], x = h[1], y = n.left, b = n.top, w = n.target, E = n.direction, _ = n.hasFixed, D = n.offsetDelta, M = r.targets, m = this.isDragging(), I = {};
    this.getEnabledAbles().forEach(function(j) {
      I["data-able-".concat(j.name.toLowerCase())] = !0;
    });
    var k = this._getAbleClassName(), z = M && M.length && (w || f) || o || !this._hasFirstTarget && this.state.isPersisted, P = this.controlBox || this.props.firstRenderState || this.props.persistData, R = [y - g, b - x];
    !f && r.useAccuratePosition && (R[0] += D[0], R[1] += D[1]);
    var A = {
      position: _ ? "fixed" : "absolute",
      display: z ? "block" : "none",
      visibility: P ? "visible" : "hidden",
      transform: "translate3d(".concat(R[0], "px, ").concat(R[1], "px, ").concat(u, ")"),
      "--zoom": s,
      "--zoompx": "".concat(s, "px")
    };
    return d && (A["--moveable-line-padding"] = d), p && (A["--moveable-control-padding"] = p), rt.createElement(
      c,
      O({ cspNonce: l, ref: rr(this, "controlBox"), className: "".concat(dt("control-box", E === -1 ? "reverse" : "", m ? "dragging" : ""), " ").concat(k, " ").concat(i) }, I, { onClick: this._onPreventClick, style: A }),
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
    a && this._changeAbleViewClassNames([]), Pr(this, !1), Pr(this, !0);
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
    return r && (((n = r.getAttribute) === null || n === void 0 ? void 0 : n.call(r, "class")) || "").indexOf(lo) > -1;
  }, e.prototype.dragStart = function(r, n) {
    n === void 0 && (n = r.target);
    var a = this.targetGesto, i = this.controlGesto;
    return a && ko(this)({ inputEvent: r }, n) ? a.isFlag() || a.triggerDragStart(r) : i && this.isMoveableElement(n) && (i.isFlag() || i.triggerDragStart(r)), this;
  }, e.prototype.hitTest = function(r) {
    var n = this.state, a = n.target, i = n.pos1, o = n.pos2, s = n.pos3, l = n.pos4, u = n.targetClientRect;
    if (!a)
      return 0;
    var c;
    if (mn(r)) {
      var f = r.getBoundingClientRect();
      c = {
        left: f.left,
        top: f.top,
        width: f.width,
        height: f.height
      };
    } else
      c = O({ width: 0, height: 0 }, r);
    var d = c.left, p = c.top, h = c.width, g = c.height, x = Ci([i, o, l, s], u), y = Dd(x, [
      [d, p],
      [d + h, p],
      [d + h, p + g],
      [d, p + g]
    ]), b = sn(x);
    return !y || !b ? 0 : Math.min(100, y / b * 100);
  }, e.prototype.isInside = function(r, n) {
    var a = this.state, i = a.target, o = a.pos1, s = a.pos2, l = a.pos3, u = a.pos4, c = a.targetClientRect;
    return i ? da([r, n], Ci([o, s, u, l], c)) : !1;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0);
    var i = this.props, o = !i.parentPosition && !i.wrapperMoveable;
    o && Fr(!0);
    var s = i.parentMoveable, l = this.state, u = l.target || i.target, c = this.getContainer(), f = s ? s._rootContainer : this._rootContainer, d = Fi(this.controlBox, u, c, c, f || c, this._getRequestStyles());
    if (!u && this._hasFirstTarget && i.persistData) {
      var p = tl(i.persistData);
      for (var h in p)
        d[h] = p[h];
    }
    o && Fr(), this.updateState(d, s ? !1 : a);
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
    var r = this.state, n = _e(this.state), a = N(n, 4), i = a[0], o = a[1], s = a[2], l = a[3], u = Ee(n), c = r.width, f = r.height, d = u.width, p = u.height, h = u.left, g = u.top, x = [r.left, r.top], y = Tt(x, r.origin), b = Tt(x, r.beforeOrigin), w = r.transformOrigin;
    return {
      width: d,
      height: p,
      left: h,
      top: g,
      pos1: i,
      pos2: o,
      pos3: s,
      pos4: l,
      offsetWidth: c,
      offsetHeight: f,
      beforeOrigin: b,
      origin: y,
      transformOrigin: w,
      rotation: this.getRotation()
    };
  }, e.prototype.getManager = function() {
    return this;
  }, e.prototype.stopDrag = function(r) {
    if (!r || r === "target") {
      var n = this.targetGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && ji(this, !1), n == null || n.stop();
    }
    if (!r || r === "control") {
      var n = this.controlGesto;
      (n == null ? void 0 : n.isIdle()) === !1 && ji(this, !0), n == null || n.stop();
    }
  }, e.prototype.getRotation = function() {
    var r = this.state, n = r.pos1, a = r.pos2, i = r.direction;
    return Tv(n, a, i);
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
    var f = c.request(i), d = a || n.isInstant, p = f.isControl ? "controlAbles" : "targetAbles", h = "".concat(u ? "Group" : "").concat(f.isControl ? "Control" : ""), g = J([], N(s[p]), !1), x = {
      request: function(y) {
        return dn(i, g, ["drag"], h, "", O(O({}, f.request(y)), { requestAble: r, isRequest: !0 }), d), x;
      },
      requestEnd: function() {
        return dn(i, g, ["drag"], h, "End", O(O({}, f.requestEnd()), { requestAble: r, isRequest: !0 }), d), x;
      }
    };
    return dn(i, g, ["drag"], h, "Start", O(O({}, f.requestStart(n)), { requestAble: r, isRequest: !0 }), d), d ? x.request(n).requestEnd() : x;
  }, e.prototype.getMoveables = function() {
    return [this];
  }, e.prototype.destroy = function() {
    this.componentWillUnmount();
  }, e.prototype.updateRenderPoses = function() {
    var r = this.getState(), n = this.props, a = n.padding, i = r.originalBeforeOrigin, o = r.transformOrigin, s = r.allMatrix, l = r.is3d, u = r.pos1, c = r.pos2, f = r.pos3, d = r.pos4, p = r.left, h = r.top, g = r.isPersisted, x = n.zoom || 1;
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
    var y = Hu(a || {}), b = y.left, w = y.top, E = y.bottom, _ = y.right, D = l ? 4 : 3, M = [];
    g ? M = o : this.controlBox && n.groupable ? M = i : M = Tt(i, [p, h]);
    var m = fa(D, mr(M.map(function(A) {
      return -A;
    }), D), s, mr(o, D)), I = Se(m, u, [-b, -w], D), k = Se(m, c, [_, -w], D), z = Se(m, f, [-b, E], D), P = Se(m, d, [_, E], D);
    r.renderPoses = [
      I,
      k,
      z,
      P
    ], r.renderLines = [
      [I, k],
      [k, P],
      [P, z],
      [z, I]
    ];
    {
      var R = x / 2;
      r.renderLines = [
        [
          Se(m, u, [-b - R, -w], D),
          Se(m, c, [_ + R, -w], D)
        ],
        [
          Se(m, c, [_, -w - R], D),
          Se(m, d, [_, E + R], D)
        ],
        [
          Se(m, d, [_ + R, E], D),
          Se(m, f, [-b - R, E], D)
        ],
        [
          Se(m, f, [-b, E + R], D),
          Se(m, u, [-b, -w - R], D)
        ]
      ];
    }
  }, e.prototype.checkUpdate = function() {
    this._isPropTargetChanged = !1;
    var r = this.props, n = r.target, a = r.container, i = r.parentMoveable, o = this.state, s = o.target, l = o.container;
    if (!(!s && !n)) {
      this.updateAbles();
      var u = !Bi(s, n), c = u || !Bi(l, a);
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
    return a[i] || (a[i] = Ul(r, n)), a[i];
  }, e.prototype.getState = function() {
    var r, n = this.props;
    (n.target || !((r = n.targets) === null || r === void 0) && r.length) && (this._hasFirstTarget = !0);
    var a = this.controlBox, i = n.persistData, o = n.firstRenderState;
    if (o && !a)
      return o;
    if (!this._hasFirstTarget && i) {
      var s = tl(i);
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
    var a = this.props, i = a.triggerAblesSimultaneously, o = this.getEnabledAbles(r), s = "drag".concat(n, "Start"), l = "pinch".concat(n, "Start"), u = "drag".concat(n, "ControlStart"), c = Jn(o, [s, l], i), f = Jn(o, [u], i);
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
    return this.renderState = {}, Dv(Lu(Jn(this.getEnabledAbles(), ["render"], a).map(function(o) {
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
    i && (Pr(this, !1), this.updateState({ gestos: {} })), n || Pr(this, !0), a && r && !this.targetGesto && (this.targetGesto = tc(this, a, "")), !this.controlGesto && n && (this.controlGesto = ec(this, "Control"));
  }, e.prototype._updateTargets = function() {
    var r = this.props;
    this._prevPropTarget = this._propTarget, this._prevDragTarget = this._dragTarget, this._prevOriginalDragTarget = this._originalDragTarget, this._prevDragArea = r.dragArea, this._propTarget = r.target, this._originalDragTarget = r.dragTarget || r.target, this._dragTarget = Ge(this._originalDragTarget, !0);
  }, e.prototype._renderLines = function() {
    var r = this.props, n = r, a = n.zoom, i = n.hideDefaultLines, o = n.hideChildMoveableDefaultLines, s = n.parentMoveable;
    if (i || s && o)
      return [];
    var l = this.getState(), u = {
      createElement: rt.createElement
    };
    return l.renderLines.map(function(c, f) {
      return xn(u, "", c[0], c[1], a, "render-line-".concat(f));
    });
  }, e.prototype._isTargetChanged = function(r) {
    var n = this.props, a = n.dragTarget || n.target, i = this._prevOriginalDragTarget, o = this._prevDragArea, s = n.dragArea, l = !s && i !== a, u = (r || s) && o !== s;
    return l || u || this._prevPropTarget != this._propTarget;
  }, e.prototype._updateNativeEvents = function() {
    var r = this, n = this.props, a = n.dragArea ? this.areaElement : this.state.target, i = this.events, o = Xr(i);
    if (this._isTargetChanged())
      for (var s in i) {
        var l = i[s];
        l && l.destroy(), i[s] = null;
      }
    if (a) {
      var u = this.enabledAbles;
      o.forEach(function(c) {
        var f = Jn(u, [c]), d = f.length > 0, p = i[c];
        if (!d) {
          p && (p.destroy(), i[c] = null);
          return;
        }
        p || (p = new ah(a, r, c), i[c] = p), p.setAbles(f);
      });
    }
  }, e.prototype._checkUpdateRootContainer = function() {
    var r = this.props.rootContainer;
    !this._rootContainer && r && (this._rootContainer = Ge(r, !0));
  }, e.prototype._checkUpdateViewContainer = function() {
    var r = this.props.viewContainer;
    !this._viewContainer && r && (this._viewContainer = Ge(r, !0));
    var n = this._viewContainer;
    n && this._changeAbleViewClassNames(J(J([], N(this._getAbleViewClassNames()), !1), [
      this.isDragging() ? Av : ""
    ], !1));
  }, e.prototype._changeAbleViewClassNames = function(r) {
    var n = this._viewContainer, a = Fu(r.filter(Boolean), function(u) {
      return u;
    }).map(function(u) {
      var c = N(u, 1), f = c[0];
      return f;
    }), i = this._viewClassNames, o = io(i, a), s = o.removed, l = o.added;
    s.forEach(function(u) {
      jl(n, i[u]);
    }), l.forEach(function(u) {
      to(n, a[u]);
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
          for (var d = Fd(u), p = d.next(); !p.done; p = d.next()) {
            var h = p.value;
            h.type === "attributes" && h.attributeName === "style" && n.checkUpdateRect();
          }
        } catch (g) {
          c = { error: g };
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
    flushSync: Iu,
    firstRenderState: null,
    persistData: null,
    viewContainer: null,
    requestStyles: [],
    useAccuratePosition: !1
  }, e;
})(rt.PureComponent), To = {
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
    var d = Nr(t, "parentPosition", [o, s], function(h) {
      return h.join(",");
    }), p = Nr(t, "requestStyles", t.getRequestChildStyles(), function(h) {
      return h.join(",");
    });
    return t.moveables = t.moveables.slice(0, a.length), J(J([], N(a.map(function(h, g) {
      return e.createElement(Yr, { key: "moveable" + g, ref: Rl(t, "moveables", g), target: h, origin: !1, requestStyles: p, cssStyled: n.cssStyled, customStyledMap: n.customStyledMap, useResizeObserver: n.useResizeObserver, useMutationObserver: n.useMutationObserver, hideChildMoveableDefaultLines: n.hideChildMoveableDefaultLines, parentMoveable: t, parentPosition: [o, s], persistData: f[g], zoom: u });
    })), !1), N(Lu(c.map(function(h, g) {
      var x = h.pos1, y = h.pos2, b = h.pos3, w = h.pos4, E = [x, y, b, w];
      return [
        [0, 1],
        [1, 3],
        [3, 2],
        [2, 0]
      ].map(function(_, D) {
        var M = N(_, 2), m = M[0], I = M[1];
        return xn(e, "", vt(E[m], d), vt(E[I], d), u, "group-rect-".concat(g, "-").concat(D));
      });
    }))), !1);
  }
}, sh = Dn("clickable", {
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
      ft(t, "onClick", wt(t, e, {
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
      i === -1 && (i = Ue(a, function(l) {
        return l.contains(n);
      }), s = i > -1), ft(t, "onClickGroup", wt(t, e, {
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
function _r(t) {
  var e = t.originalDatas.draggable;
  return e || (t.originalDatas.draggable = {}, e = t.originalDatas.draggable), O(O({}, t), { datas: e });
}
var lh = Dn("edgeDraggable", {
  css: [
    `.edge.edgeDraggable.line {
cursor: move;
}`
  ],
  render: function(t, e) {
    var r = t.props, n = r.edgeDraggable;
    return n ? cu(e, "edgeDraggable", n, t.getState().renderPoses, r.zoom) : [];
  },
  dragCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && Qt(a, dt("direction")) && Qt(a, dt("edge")) && Qt(a, dt("edgeDraggable"));
  },
  dragStart: function(t, e) {
    return le.dragStart(t, _r(e));
  },
  drag: function(t, e) {
    return le.drag(t, _r(e));
  },
  dragEnd: function(t, e) {
    return le.dragEnd(t, _r(e));
  },
  dragGroupCondition: function(t, e) {
    var r, n = t.props, a = (r = e.inputEvent) === null || r === void 0 ? void 0 : r.target;
    return !n.edgeDraggable || !a ? !1 : !n.draggable && Qt(a, dt("direction")) && Qt(a, dt("line"));
  },
  dragGroupStart: function(t, e) {
    return le.dragGroupStart(t, _r(e));
  },
  dragGroup: function(t, e) {
    return le.dragGroup(t, _r(e));
  },
  dragGroupEnd: function(t, e) {
    return le.dragGroupEnd(t, _r(e));
  },
  unset: function(t) {
    return le.unset(t);
  }
}), nc = {
  name: "individualGroupable",
  props: [
    "individualGroupable",
    "individualGroupableProps"
  ],
  events: []
}, uh = [
  Ju,
  Vu,
  dv,
  Rv,
  le,
  lh,
  Pi,
  Ov,
  Nv,
  Vp,
  Gv,
  Fv,
  jv,
  Jv,
  Zv,
  rh,
  To,
  nc,
  sh,
  qu,
  Qu
];
function el(t, e) {
  var r = N(t, 3), n = r[0], a = r[1], i = r[2];
  return (n * e[0] + a * e[1] + i) / Math.sqrt(n * n + a * a);
}
function ea(t, e) {
  var r = N(t, 2), n = r[0], a = r[1];
  return -n * e[0] - a * e[1];
}
function rl(t, e) {
  return Math.max.apply(Math, J([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.max(a[e], i[e], o[e], s[e]);
  })), !1));
}
function nl(t, e) {
  return Math.min.apply(Math, J([], N(t.map(function(r) {
    var n = N(r, 4), a = n[0], i = n[1], o = n[2], s = n[3];
    return Math.min(a[e], i[e], o[e], s[e]);
  })), !1));
}
function ch(t, e) {
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
    var d = f / 180 * Math.PI, p = Math.tan(d), h = -1 / p, g = [Ti, _s], x = [[0, 0], [0, 0]], y = [Ti, _s], b = [[0, 0], [0, 0]];
    t.forEach(function(tt) {
      tt.forEach(function(K) {
        var nt = el([-p, 1, 0], K), Q = el([-h, 1, 0], K);
        g[0] > nt && (x[0] = K, g[0] = nt), g[1] < nt && (x[1] = K, g[1] = nt), y[0] > Q && (b[0] = K, y[0] = Q), y[1] < Q && (b[1] = K, y[1] = Q);
      });
    });
    var w = N(x, 2), E = w[0], _ = w[1], D = N(b, 2), M = D[0], m = D[1], I = [-p, 1, ea([-p, 1], E)], k = [-p, 1, ea([-p, 1], _)], z = [-h, 1, ea([-h, 1], M)], P = [-h, 1, ea([-h, 1], m)];
    r = N([
      [I, z],
      [I, P],
      [k, z],
      [k, P]
    ].map(function(tt) {
      var K = N(tt, 2), nt = K[0], Q = K[1];
      return oo(nt, Q)[0];
    }), 4), i = r[0], o = r[1], s = r[2], l = r[3], u = y[1] - y[0], c = g[1] - g[0];
  } else {
    var R = nl(t, 0), A = nl(t, 1), j = rl(t, 0), W = rl(t, 1);
    if (i = [R, A], o = [j, A], s = [R, W], l = [j, W], u = j - R, c = W - A, f % 180) {
      var X = [s, i, l, o];
      n = N(X, 4), i = n[0], o = n[1], s = n[2], l = n[3], u = W - A, c = j - R;
    }
  }
  if (f % 360 > 180) {
    var X = [l, s, o, i];
    a = N(X, 4), i = a[0], o = a[1], s = a[2], l = a[3];
  }
  var L = xr([i, o, s, l]), q = L.minX, V = L.minY, F = L.maxX, et = L.maxY;
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
function ac(t, e) {
  var r = e.map(function(n) {
    if (Yt(n)) {
      var a = ac(t, n), i = a.length;
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
var fh = /* @__PURE__ */ (function(t) {
  wn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.differ = new Yl(), r.moveables = [], r.transformOrigin = "50% 50%", r.renderGroupRects = [], r._targetGroups = [], r._hasFirstTargets = !1, r;
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
    Fr(!0), this.moveables.forEach(function(it) {
      it.updateRect(r, !1, !1);
    });
    var s = this.props, l = this.moveables, u = o.target || s.target, c = l.map(function(it) {
      return { finded: !1, manager: it };
    }), f = this.props.targetGroups || [], d = ac(c, f), p = s.useDefaultGroupRotate;
    d.push.apply(d, J([], N(c.filter(function(it) {
      var mt = it.finded;
      return !mt;
    }).map(function(it) {
      var mt = it.manager;
      return mt;
    })), !1));
    var h = [], g = !n || r !== "" && s.updateGroup, x = s.defaultGroupRotate || 0;
    if (!this._hasFirstTargets) {
      var y = (i = s.persistData) === null || i === void 0 ? void 0 : i.rotation;
      y != null && (x = y);
    }
    function b(it, mt, bt) {
      var Z = it.map(function(Mt) {
        if (Yt(Mt)) {
          var Ct = b(Mt, mt), kt = [Ct.pos1, Ct.pos2, Ct.pos3, Ct.pos4];
          return h.push(Ct), { poses: kt, rotation: Ct.rotation };
        } else
          return {
            poses: _e(Mt.state),
            rotation: Mt.getRotation()
          };
      }), ut = Z.map(function(Mt) {
        var Ct = Mt.rotation;
        return Ct;
      }), Et = 0, pt = ut[0], ht = ut.every(function(Mt) {
        return Math.abs(pt - Mt) < 0.1;
      });
      g ? Et = !p && ht ? pt : x : Et = !p && !bt && ht ? pt : mt;
      var St = Z.map(function(Mt) {
        var Ct = Mt.poses;
        return Ct;
      }), gt = ch(St, Et);
      return gt;
    }
    var w = b(d, this.rotation, !0);
    g && (this.rotation = w.rotation, this.transformOrigin = s.defaultGroupOrigin || "50% 50%", this.scale = [1, 1]), this._targetGroups = f, this.renderGroupRects = h;
    var E = this.transformOrigin, _ = this.rotation, D = this.scale, M = w.width, m = w.height, I = w.minX, k = w.minY, z = Iv([
      [0, 0],
      [M, 0],
      [0, m],
      [M, m]
    ], Do(E, M, m), this.rotation / 180 * Math.PI), P = xr(z.result), R = P.minX, A = P.minY, j = " rotate(".concat(_, "deg)") + " scale(".concat(ue(D[0]), ", ").concat(ue(D[1]), ")"), W = "translate(".concat(-R, "px, ").concat(-A, "px)").concat(j);
    this.controlBox.style.transform = "translate3d(".concat(I, "px, ").concat(k, "px, ").concat(this.props.translateZ || 0, ")"), u.style.cssText += "left:0px;top:0px;" + "transform-origin:".concat(E, ";") + "width:".concat(M, "px;height:").concat(m, "px;") + "transform: ".concat(W), o.width = M, o.height = m;
    var X = this.getContainer(), L = Fi(this.controlBox, u, this.controlBox, this.getContainer(), this._rootContainer || X, []), q = [L.left, L.top], V = N(_e(L), 4), F = V[0], et = V[1], tt = V[2], K = V[3], nt = xr([F, et, tt, K]), Q = [nt.minX, nt.minY], at = ue(D[0] * D[1]);
    L.pos1 = vt(F, Q), L.pos2 = vt(et, Q), L.pos3 = vt(tt, Q), L.pos4 = vt(K, Q), L.left = I - L.left + Q[0], L.top = k - L.top + Q[1], L.origin = vt(Tt(q, L.origin), Q), L.beforeOrigin = vt(Tt(q, L.beforeOrigin), Q), L.originalBeforeOrigin = Tt(q, L.originalBeforeOrigin), L.transformOrigin = vt(Tt(q, L.transformOrigin), Q), u.style.transform = "translate(".concat(-R - Q[0], "px, ").concat(-A - Q[1], "px)") + j, Fr(), this.updateState(O(O({}, L), { posDelta: Q, direction: at, beforeDirection: at }), a);
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
      return J(J([], N(n), !1), N(s), !1);
    }, []);
    return r;
  }, e.prototype.getMoveables = function() {
    return J([], N(this.moveables), !1);
  }, e.prototype.updateAbles = function() {
    t.prototype.updateAbles.call(this, J(J([], N(this.props.ables), !1), [To], !1), "Group");
  }, e.prototype._updateTargets = function() {
    t.prototype._updateTargets.call(this), this._originalDragTarget = this.props.dragTarget || this.areaElement, this._dragTarget = Ge(this._originalDragTarget, !0);
  }, e.prototype._updateEvents = function() {
    var r = this.state, n = this.props, a = this._prevDragTarget, i = n.dragTarget || this.areaElement, o = n.targets, s = this.differ.update(o), l = s.added, u = s.changed, c = s.removed, f = l.length || c.length;
    (f || this._prevOriginalDragTarget !== this._originalDragTarget) && (Pr(this, !1), Pr(this, !0), this.updateState({ gestos: {} })), a !== i && (r.target = null), r.target || (r.target = this.areaElement, this.controlBox.style.display = "block"), r.target && (this.targetGesto || (this.targetGesto = tc(this, this._dragTarget, "Group")), this.controlGesto || (this.controlGesto = ec(this, "GroupControl")));
    var d = !Bi(r.container, n.container);
    d && (r.container = n.container), (d || f || this.transformOrigin !== (n.defaultGroupOrigin || "50% 50%") || u.length || o.length && !Xu(this._targetGroups, n.targetGroups || [])) && (this.updateRect(), this._hasFirstTargets = !0), this._isPropTargetChanged = !!f;
  }, e.prototype._updateObserver = function() {
  }, e.defaultProps = O(O({}, Yr.defaultProps), { transformOrigin: ["50%", "50%"], groupable: !0, dragArea: !0, keepRatio: !0, targets: [], defaultGroupRotate: 0, defaultGroupOrigin: "50% 50%" }), e;
})(Yr), dh = /* @__PURE__ */ (function(t) {
  wn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.moveables = [], r;
  }
  return e.prototype.render = function() {
    var r = this, n, a = this.props, i = a.cspNonce, o = a.cssStyled, s = a.persistData, l = a.targets || [], u = l.length, c = this.isUnmounted || !u, f = (n = s == null ? void 0 : s.children) !== null && n !== void 0 ? n : [];
    return c && !u && f.length ? l = f.map(function() {
      return null;
    }) : c || (f = []), rt.createElement(o, { cspNonce: i, ref: rr(this, "controlBox"), className: dt("control-box") }, l.map(function(d, p) {
      var h, g, x = (g = (h = a.individualGroupableProps) === null || h === void 0 ? void 0 : h.call(a, d, p)) !== null && g !== void 0 ? g : {};
      return rt.createElement(Yr, O({ key: "moveable" + p, ref: Rl(r, "moveables", p) }, a, x, { target: d, wrapperMoveable: r, isWrapperMounted: r.isMoveableMounted, persistData: f[p] }));
    }));
  }, e.prototype.componentDidMount = function() {
  }, e.prototype.componentDidUpdate = function() {
  }, e.prototype.getTargets = function() {
    return this.props.targets;
  }, e.prototype.updateRect = function(r, n, a) {
    a === void 0 && (a = !0), Fr(!0), this.moveables.forEach(function(i) {
      i.updateRect(r, n, a);
    }), Fr();
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
})(Yr);
function ic(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (we(n)) {
        e[n] && r.push.apply(r, J([], N(e[n]), !1));
        return;
      }
      Yt(n) ? r.push.apply(r, J([], N(ic(n, e)), !1)) : r.push(n);
    }
  }), r;
}
function oc(t, e) {
  var r = [];
  return t.forEach(function(n) {
    if (n) {
      if (we(n)) {
        e[n] && r.push.apply(r, J([], N(e[n]), !1));
        return;
      }
      Yt(n) ? r.push(oc(n, e)) : r.push(n);
    }
  }), r;
}
function sc(t, e) {
  return t.length !== e.length || t.some(function(r, n) {
    var a = e[n];
    return !r && !a ? !1 : r != a ? Yt(r) && Yt(a) ? sc(r, a) : !0 : !1;
  });
}
var ph = /* @__PURE__ */ (function(t) {
  wn(e, t);
  function e() {
    var r = t !== null && t.apply(this, arguments) || this;
    return r.refTargets = [], r.selectorMap = {}, r._differ = new Yl(), r._elementTargets = [], r._tmpRefTargets = [], r._tmpSelectorMap = {}, r._onChangeTargets = null, r;
  }
  return e.makeStyled = function() {
    var r = {}, n = this.getTotalAbles();
    n.forEach(function(i) {
      var o = i.css;
      o && o.forEach(function(s) {
        r[s] = !0;
      });
    });
    var a = Xr(r).join(`
`);
    this.defaultStyled = Ul("div", jf(lo, Zd + a));
  }, e.getTotalAbles = function() {
    return J([Vu, To, nc, qu], N(this.defaultAbles), !1);
  }, e.prototype.render = function() {
    var r, n = this.constructor;
    n.defaultStyled || n.makeStyled();
    var a = this.props, i = a.ables, o = a.props, s = Bd(a, ["ables", "props"]), l = N(this._updateRefs(!0), 2), u = l[0], c = l[1], f = ic(u, c), d = f.length > 1, p = n.getTotalAbles(), h = J(J([], N(p), !1), N(i || []), !1), g = O(O(O({}, s), o || {}), { ables: h, cssStyled: n.defaultStyled, customStyledMap: n.customStyledMap });
    this._elementTargets = f;
    var x = null, y = this.moveable, b = s.persistData;
    if (b != null && b.children && (d = !0), s.individualGroupable)
      return rt.createElement(dh, O({ key: "individual-group", ref: rr(this, "moveable") }, g, { target: null, targets: f }));
    if (d) {
      var w = oc(u, c);
      if (y && !y.props.groupable && !y.props.individualGroupable) {
        var E = y.props.target;
        E && f.indexOf(E) > -1 && (x = O({}, y.state));
      }
      return rt.createElement(fh, O({ key: "group", ref: rr(this, "moveable") }, g, (r = s.groupableProps) !== null && r !== void 0 ? r : {}, { target: null, targets: f, targetGroups: w, firstRenderState: x }));
    } else {
      var _ = f[0];
      if (y && (y.props.groupable || y.props.individualGroupable)) {
        var D = y.moveables || [], M = xe(D, function(m) {
          return m.props.target === _;
        });
        M && (x = O({}, M.state));
      }
      return rt.createElement(Yr, O({ key: "single", ref: rr(this, "moveable") }, g, { target: _, firstRenderState: x }));
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
    var n = this.refTargets, a = wo(this.props.target || this.props.targets), i = typeof document < "u", o = sc(n, a), s = this.selectorMap, l = {};
    return this.refTargets.forEach(function u(c) {
      if (we(c)) {
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
  }, e.defaultAbles = [], e.customStyledMap = {}, e.defaultStyled = null, Gd([
    Ol(tp)
  ], e.prototype, "moveable", void 0), e;
})(rt.PureComponent), vh = /* @__PURE__ */ (function(t) {
  wn(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e.defaultAbles = uh, e;
})(ph), Li = function(t, e) {
  return Li = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Li(t, e);
};
function hh(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Li(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
function gh(t, e) {
  return e = {
    exports: {}
  }, t(e, e.exports), e.exports;
}
var kn = gh(function(t, e) {
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
kn.code;
kn.codes;
kn.aliases;
var mh = kn.names;
kn.title;
var al = {
  "+": "plus",
  "left command": "meta",
  "right command": "meta"
}, il = {
  shift: 1,
  ctrl: 2,
  alt: 3,
  meta: 4
};
function lc(t, e) {
  var r = (mh[t] || e || "").toLowerCase();
  for (var n in al)
    r = r.replace(n, al[n]);
  return r.replace(/\s/g, "");
}
function uc(t, e) {
  e === void 0 && (e = lc(t.keyCode, t.key));
  var r = xh(t);
  return r.indexOf(e) === -1 && r.push(e), r.filter(Boolean);
}
function xh(t) {
  var e = [t.shiftKey && "shift", t.ctrlKey && "ctrl", t.altKey && "alt", t.metaKey && "meta"];
  return e.filter(Boolean);
}
function ol(t) {
  var e = t.slice();
  return e.sort(function(r, n) {
    var a = il[r] || 5, i = il[n] || 5;
    return a - i;
  }), e;
}
var sl, yh = /* @__PURE__ */ (function(t) {
  hh(e, t);
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
      return sl || (sl = new e());
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
    return Yt(a) ? this.on("".concat(n, ".").concat(ol(a).join(".")), i) : we(a) ? this.on("".concat(n, ".").concat(a), i) : this.on(n, a), this;
  }, r.removeEvent = function(n, a, i) {
    return Yt(a) ? this.off("".concat(n, ".").concat(ol(a).join(".")), i) : we(a) ? this.off("".concat(n, ".").concat(a), i) : this.off(n, a), this;
  }, r.triggerEvent = function(n, a) {
    this.ctrlKey = a.ctrlKey, this.shiftKey = a.shiftKey, this.altKey = a.altKey, this.metaKey = a.metaKey;
    var i = lc(a.keyCode, a.key), o = i === "ctrl" || i === "shift" || i === "meta" || i === "alt", s = {
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
    var l = uc(a, i);
    l.length > 1 && this.trigger("".concat(n, ".").concat(l.join(".")), s);
  }, e;
})(En), Wi = function(t, e) {
  return Wi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Wi(t, e);
};
function cc(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Wi(t, e);
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
function bh(t, e) {
  var r = {};
  for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e.indexOf(n) < 0 && (r[n] = t[n]);
  if (t != null && typeof Object.getOwnPropertySymbols == "function") for (var a = 0, n = Object.getOwnPropertySymbols(t); a < n.length; a++)
    e.indexOf(n[a]) < 0 && Object.prototype.propertyIsEnumerable.call(t, n[a]) && (r[n[a]] = t[n[a]]);
  return r;
}
function Sh(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n === null ? n = Object.getOwnPropertyDescriptor(e, r) : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
function pn(t, e, r) {
  for (var n = 0, a = e.length, i; n < a; n++)
    (i || !(n in e)) && (i || (i = Array.prototype.slice.call(e, 0, n)), i[n] = e[n]);
  return t.concat(i || Array.prototype.slice.call(e));
}
function Ch(t) {
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
function Eh(t) {
  if (typeof Map > "u")
    return t.filter(function(r, n) {
      return t.indexOf(r) === n;
    });
  var e = /* @__PURE__ */ new Map();
  return t.filter(function(r) {
    return e.has(r) ? !1 : (e.set(r, !0), !0);
  });
}
function wh(t, e, r) {
  var n = Ie(t);
  return n.elementFromPoint && n.elementFromPoint(e, r) || null;
}
function fc(t, e, r) {
  var n = t.tag, a = t.children, i = t.attributes, o = t.className, s = t.style, l = e || Ie(r).createElement(n);
  for (var u in i)
    l.setAttribute(u, i[u]);
  var c = l.children;
  if (a.forEach(function(d, p) {
    fc(d, c[p], l);
  }), o && o.split(/\s+/g).forEach(function(d) {
    d && !Qt(l, d) && to(l, d);
  }), s) {
    var f = l.style;
    for (var u in s)
      f[u] = s[u];
  }
  return !e && r && r.appendChild(l), l;
}
function Dh(t, e) {
  for (var r = [], n = 2; n < arguments.length; n++)
    r[n - 2] = arguments[n];
  var a = e || {}, i = a.className, o = i === void 0 ? "" : i, s = a.style, l = s === void 0 ? {} : s, u = bh(a, ["className", "style"]);
  return {
    tag: t,
    className: o,
    style: l,
    attributes: u,
    children: r
  };
}
function oi(t, e, r) {
  t !== e && r(t, e);
}
function ll(t, e, r) {
  var n;
  r === void 0 && (r = t.data.boundArea);
  var a = t.distX, i = a === void 0 ? 0 : a, o = t.distY, s = o === void 0 ? 0 : o, l = t.data, u = l.startX, c = l.startY;
  if (e > 0) {
    var f = Math.sqrt((i * i + s * s) / (1 + e * e)), d = e * f;
    i = (i >= 0 ? 1 : -1) * d, s = (s >= 0 ? 1 : -1) * f;
  }
  var p = Math.abs(i), h = Math.abs(s), g = i < 0 ? u - r.left : r.right - u, x = s < 0 ? c - r.top : r.bottom - c;
  n = Qi([p, h], [0, 0], [g, x], !!e), p = n[0], h = n[1], i = (i >= 0 ? 1 : -1) * p, s = (s >= 0 ? 1 : -1) * h;
  var y = Math.min(0, i), b = Math.min(0, s), w = u + y, E = c + b;
  return {
    left: w,
    top: E,
    right: w + p,
    bottom: E + h,
    width: p,
    height: h
  };
}
function ra(t) {
  var e = t.getBoundingClientRect(), r = e.left, n = e.top, a = e.width, i = e.height;
  return {
    pos1: [r, n],
    pos2: [r + a, n],
    pos3: [r, n + i],
    pos4: [r + a, n + i]
  };
}
function ul(t, e, r) {
  var n = Tr(t, e), a = n.list, i = n.prevList, o = n.added, s = n.removed, l = n.maintained;
  return pn(pn(pn([], o.map(function(u) {
    return a[u];
  }), !0), s.map(function(u) {
    return i[u];
  }), !0), r ? l.map(function(u) {
    var c = u[1];
    return a[c];
  }) : []);
}
function cl(t) {
  for (var e = 0, r = t.length, n = 1; n < r; ++n)
    e = Math.max(Be(t[n], t[n - 1]), e);
  return e;
}
var dc = Vl(`
:host {
    position: fixed;
    display: none;
    border: 1px solid #4af;
    background: rgba(68, 170, 255, 0.5);
    pointer-events: none;
    will-change: transform;
    z-index: 100;
}
`), Yi = "selecto-selection ".concat(dc.className), Io = ["className", "boundContainer", "selectableTargets", "selectByClick", "selectFromInside", "continueSelect", "continueSelectWithoutDeselect", "toggleContinueSelect", "toggleContinueSelectWithoutDeselect", "keyContainer", "hitRate", "scrollOptions", "checkInput", "preventDefault", "ratio", "getElementRect", "preventDragFromInside", "rootContainer", "dragCondition", "clickBySelectEnd", "checkOverflow", "innerScrollOptions"], _h = pn([
  // ignore target, container,
  "dragContainer",
  "cspNonce",
  "preventClickEventOnDrag",
  "preventClickEventOnDragStart",
  "preventRightClick"
], Io), pc = ["dragStart", "drag", "dragEnd", "selectStart", "select", "selectEnd", "keydown", "keyup", "scroll", "innerScroll"], Mh = ["clickTarget", "getSelectableElements", "setSelectedTargets", "getElementPoints", "getSelectedTargets", "findSelectableTargets", "triggerDragStart", "checkScroll", "selectTargetsByPoints", "setSelectedTargetsByPoints"], kh = /* @__PURE__ */ (function(t) {
  cc(e, t);
  function e(n) {
    n === void 0 && (n = {});
    var a = t.call(this) || this;
    a.selectedTargets = [], a.dragScroll = new Xl(), a._onDragStart = function(s, l) {
      var u = s.data, c = s.clientX, f = s.clientY, d = s.inputEvent, p = a.options, h = p.selectFromInside, g = p.selectByClick, x = p.rootContainer, y = p.boundContainer, b = p.preventDragFromInside, w = b === void 0 ? !0 : b, E = p.clickBySelectEnd, _ = p.dragCondition;
      if (_ && !_(s)) {
        s.stop();
        return;
      }
      u.data = {};
      var D = Ce(a.container);
      u.innerWidth = D.innerWidth, u.innerHeight = D.innerHeight, a.findSelectableTargets(u), u.startSelectedTargets = a.selectedTargets, u.scaleMatrix = ao(), u.containerX = 0, u.containerY = 0;
      var M = a.container, m = {
        left: -1 / 0,
        top: -1 / 0,
        right: 1 / 0,
        bottom: 1 / 0
      };
      if (x) {
        var I = a.container.getBoundingClientRect();
        u.containerX = I.left, u.containerY = I.top, u.scaleMatrix = ud(a.container, x);
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
        }, z = k.element, P = void 0;
        if (z) {
          we(z) ? P = Ie(M).querySelector(z) : z === !0 ? P = a.container : P = z;
          var R = P.getBoundingClientRect();
          k.left && (m.left = R.left), k.top && (m.top = R.top), k.right && (m.right = R.right), k.bottom && (m.bottom = R.bottom);
        }
      }
      u.boundArea = m;
      var A = {
        left: c,
        top: f,
        right: c,
        bottom: f,
        width: 0,
        height: 0
      }, j = [], W = g && !E, X = !1;
      if (!h || W) {
        var L = a._findElement(
          l || d.target,
          // elementFromPoint(clientX, clientY),
          u.selectableTargets
        );
        X = !!L, W && (j = L ? [L] : []);
      }
      var q = !h && X;
      if (q && !g)
        return s.stop(), !1;
      var V = d.type, F = V === "mousedown" || V === "touchstart", et = !s.isClick && F ? a.emit("dragStart", Kt(Kt({}, s), {
        data: u.data
      })) : !0;
      if (!et)
        return s.stop(), !1;
      if (a.continueSelect ? (j = ul(a.selectedTargets, j, a.continueSelectWithoutDeselect), u.startPassedTargets = a.selectedTargets) : u.startPassedTargets = [], a._select(j, A, s, !0, q && g && !E && w), u.startX = c, u.startY = f, u.selectFlag = !1, u.preventDragFromInside = !1, d.target) {
        var tt = oa(u.scaleMatrix, [c - u.containerX, f - u.containerY]);
        a.target.style.cssText += "position: ".concat(x ? "absolute" : "fixed", ";") + "left:0px;top:0px;" + "transform: translate(".concat(tt[0], "px, ").concat(tt[1], "px)");
      }
      if (q && g && !E)
        d.preventDefault(), w && (a._selectEnd(u.startSelectedTargets, u.startPassedTargets, A, s, !0), u.preventDragFromInside = !0);
      else {
        u.selectFlag = !0;
        var K = a.options, nt = K.scrollOptions, Q = K.innerScrollOptions, at = !1;
        if (Q) {
          for (var it = s.inputEvent, mt = it.target, bt = null, Z = mt; Z && Z !== Ie(M).body; ) {
            var ut = getComputedStyle(Z).overflow !== "visible";
            if (ut) {
              bt = Z;
              break;
            }
            Z = Z.parentElement;
          }
          bt && (u.innerScrollOptions = Kt({
            container: bt,
            checkScrollEvent: !0
          }, Q === !0 ? {} : Q), a.dragScroll.dragStart(s, u.innerScrollOptions), at = !0);
        }
        !at && nt && nt.container && a.dragScroll.dragStart(s, nt), q && g && E && (u.selectFlag = !1, s.preventDrag());
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
      var l = s.data, u = s.inputEvent, c = ll(s, a.options.ratio), f = l.selectFlag, d = a.container;
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
        var p = a._findElement((u == null ? void 0 : u.target) || wh(d, s.clientX, s.clientY), l.selectableTargets);
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
      var l = Ie(a.container);
      if (a.gesto.isFlag()) {
        var u = a.dragContainer;
        u === Ce(a.container) && (u = l.documentElement);
        var c = mn(u) ? [u] : [].slice.call(u), f = s.target;
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
      getElementRect: ra,
      cspNonce: "",
      ratio: 0
    }, n);
    var o = a.options.portalContainer;
    return o && (i = o.parentElement), a.container = i || document.body, a.initElement(), a.initDragScroll(), a.setKeyController(), a;
  }
  var r = e.prototype;
  return r.setSelectedTargets = function(n) {
    var a = this.selectedTargets, i = Tr(a, n), o = i.added, s = i.removed, l = i.prevList, u = i.list;
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
    var a = this.getElementRect || ra, i = a(n), o = [i.pos1, i.pos2, i.pos4, i.pos3];
    if (a !== ra) {
      var s = n.getBoundingClientRect();
      return Ci(o, s);
    }
    return o;
  }, r.getSelectableElements = function() {
    var n = this.container, a = [];
    return this.options.selectableTargets.forEach(function(i) {
      if (wa(i)) {
        var o = i();
        o && a.push.apply(a, [].slice.call(o));
      } else if (mn(i))
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
    var s = this.options, l = s.checkOverflow || s.innerScrollOptions, u = Ie(this.container);
    if (l) {
      var c = /* @__PURE__ */ new Map();
      n.selectableInnerScrollParentMap = c, n.selectableInnerScrollPathsList = i.map(function(f, d) {
        for (var p = f.parentElement, h = [], g = [], x = function() {
          var y = c.get(p);
          if (!y) {
            var b = getComputedStyle(p).overflow !== "visible";
            if (b) {
              var w = ra(p);
              y = {
                parentElement: p,
                indexes: [],
                points: [w.pos1, w.pos2, w.pos4, w.pos3],
                paths: pn([], g)
              }, h.push(p), h.forEach(function(E) {
                c.set(E, y);
              }), h = [];
            }
          }
          y ? (p = y.parentElement, c.get(p).indexes.push(d), g.push(p)) : h.push(p), p = p.parentElement;
        }; p && p !== u.body; )
          x();
        return g;
      });
    }
    return s.checkOverflow || (n.selectableInners = i.map(function() {
      return !0;
    })), this._refreshGroups(n), i;
  }, r.clickTarget = function(n, a) {
    var i = Ch(n), o = i.clientX, s = i.clientY, l = {
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
    this.keycon && (this.keycon.destroy(), this.keycon = null), (i || o) && (this.keycon = new yh(a || Ce(this.container)), this.keycon.keydown(this._onKeyDown).keyup(this._onKeyUp).on("blur", this._onBlur));
  }, r.setClassName = function(n) {
    this.options.className = n, this.target.setAttribute("class", "".concat(Yi, " ").concat(n || ""));
  }, r.setKeyEvent = function() {
    var n = this.options, a = n.toggleContinueSelect, i = n.toggleContinueSelectWithoutDeselect;
    !a && !i || this.keycon || this.setKeyController();
  }, r.setKeyContainer = function(n) {
    var a = this, i = this.options;
    oi(i.keyContainer, n, function() {
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
    oi(i.toggleContinueSelect, n, function() {
      i.toggleContinueSelect = n, a.setKeyEvent();
    });
  }, r.setToggleContinueSelectWithoutDeselect = function(n) {
    var a = this, i = this.options;
    oi(i.toggleContinueSelectWithoutDeselect, n, function() {
      i.toggleContinueSelectWithoutDeselect = n, a.setKeyEvent();
    });
  }, r.setPreventDefault = function(n) {
    this.gesto.options.preventDefault = n;
  }, r.setCheckInput = function(n) {
    this.gesto.options.checkInput = n;
  }, r.initElement = function() {
    var n = this.options, a = n.dragContainer, i = n.checkInput, o = n.preventDefault, s = n.preventClickEventOnDragStart, l = n.preventClickEventOnDrag, u = n.preventClickEventByCondition, c = n.preventRightClick, f = c === void 0 ? !0 : c, d = n.className, p = this.container;
    this.target = fc(Dh("div", {
      className: "".concat(Yi, " ").concat(d || "")
    }), this.target, p);
    var h = this.target;
    this.dragContainer = typeof a == "string" ? [].slice.call(Ie(p).querySelectorAll(a)) : a || this.target.parentNode, this.gesto = new ql(this.dragContainer, {
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
    }), Zt(document, "selectstart", this._onDocumentSelectStart), this.injectResult = dc.inject(h, {
      nonce: this.options.cspNonce
    });
  }, r.hitTest = function(n, a, i, o) {
    var s = this.options, l = s.hitRate, u = s.selectByClick, c = n.left, f = n.top, d = n.right, p = n.bottom, h = a.innerGroups, g = a.innerWidth, x = a.innerHeight, y = o == null ? void 0 : o.clientX, b = o == null ? void 0 : o.clientY, w = a.ignoreClick, E = [[c, f], [d, f], [d, p], [c, p]], _ = function(L, q) {
      var V = hr(typeof l == "function" ? "".concat(l(q)) : "".concat(l)), F = w ? !1 : da([y, b], L);
      if (!i && u && F)
        return !0;
      var et = wi(E, L);
      if (!et.length)
        return !1;
      var tt = sn(et), K = 0;
      if (tt === 0 && sn(L) === 0 ? (K = cl(L), tt = cl(et)) : K = sn(L), V.unit === "px")
        return tt >= V.value;
      var nt = ca(Math.round(tt / K * 100), 0, 100);
      return nt >= Math.min(100, V.value);
    }, D = a.selectableTargets, M = a.selectablePoints, m = a.selectableInners;
    if (!h)
      return D.filter(function(L, q) {
        return m[q] ? _(M[q], D[q]) : !1;
      });
    for (var I = [], k = Math.floor(c / g), z = Math.floor(d / g), P = Math.floor(f / x), R = Math.floor(p / x), A = k; A <= z; ++A) {
      var j = h[A];
      if (j)
        for (var W = P; W <= R; ++W) {
          var X = j[W];
          X && X.forEach(function(L) {
            var q = M[L], V = m[L], F = D[L];
            V && _(q, F) && I.push(F);
          });
        }
    }
    return Eh(I);
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
          var h = u.selectableInnerScrollParentMap, g = h.get(d);
          g && (g.paths.forEach(function(x) {
            var y = h.get(x);
            y.points.forEach(function(b) {
              b[0] -= i, b[1] -= o;
            });
          }), g.indexes.forEach(function(x) {
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
    var l = i.inputEvent, u = i.data, c = this.setSelectedTargets(n), f = Tr(u.startSelectedTargets, n), d = f.added, p = f.removed, h = f.prevList, g = f.list, x = {
      startSelected: h,
      startAdded: d.map(function(y) {
        return g[y];
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
    var l = o.inputEvent, u = o.isDouble, c = o.data, f = l && l.type, d = f === "mousedown" || f === "touchstart", p = Tr(n, this.selectedTargets), h = p.added, g = p.removed, x = p.prevList, y = p.list, b = Tr(a, this.selectedTargets), w = b.added, E = b.removed, _ = b.prevList, D = b.list;
    this.emit("selectEnd", {
      startSelected: n,
      beforeSelected: a,
      selected: this.selectedTargets,
      added: h.map(function(M) {
        return y[M];
      }),
      removed: g.map(function(M) {
        return x[M];
      }),
      afterAdded: w.map(function(M) {
        return D[M];
      }),
      afterRemoved: E.map(function(M) {
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
    a === void 0 && (a = ll(n, this.options.ratio));
    var i = n.data, o = a.top, s = a.left, l = a.width, u = a.height, c = i.selectFlag, f = i.containerX, d = i.containerY, p = i.scaleMatrix, h = oa(p, [s - f, o - d]), g = oa(p, [l, u]), x = [];
    if (c) {
      this.target.style.cssText += "display: block;left:0px;top:0px;" + "transform: translate(".concat(h[0], "px, ").concat(h[1], "px);") + "width:".concat(g[0], "px;height:").concat(g[1], "px;");
      var y = this.hitTest(a, i, !0, n);
      x = ul(i.startPassedTargets, y, this.continueSelect && this.continueSelectWithoutDeselect);
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
    var o = uc(n.inputEvent, n.key), s = [].concat(a), l = Yt(s[0]) ? s : [s];
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
        var g = !1;
        return p.every(function(x) {
          if (g)
            return !0;
          if (x === l)
            return g = !0, !0;
          var y = u.get(x);
          if (y) {
            var b = s[h], w = y.points, E = wi(b, w);
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
      f.forEach(function(p, h) {
        var g = 1 / 0, x = -1 / 0, y = 1 / 0, b = -1 / 0;
        p.forEach(function(_) {
          var D = Math.floor(_[0] / i), M = Math.floor(_[1] / o);
          g = Math.min(D, g), x = Math.max(D, x), y = Math.min(M, y), b = Math.max(M, b);
        });
        for (var w = g; w <= x; ++w)
          for (var E = y; E <= b; ++E)
            d[w] = d[w] || {}, d[w][E] = d[w][E] || [], d[w][E].push(h);
      }), n.innerGroups = d;
    }
  }, e = Sh([Bf(Io, function(n, a) {
    var i = {
      enumerable: !0,
      configurable: !0,
      get: function() {
        return this.options[a];
      }
    }, o = gi("get ".concat(a));
    n[o] ? i.get = function() {
      return this[o]();
    } : i.get = function() {
      return this.options[a];
    };
    var s = gi("set ".concat(a));
    n[s] ? i.set = function(l) {
      this[s](l);
    } : i.set = function(l) {
      this.options[a] = l;
    }, Object.defineProperty(n, a, i);
  })], e), e;
})(En), Th = /* @__PURE__ */ (function(t) {
  cc(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  return e;
})(kh), Xi = function(t, e) {
  return Xi = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function(r, n) {
    r.__proto__ = n;
  } || function(r, n) {
    for (var a in n) Object.prototype.hasOwnProperty.call(n, a) && (r[a] = n[a]);
  }, Xi(t, e);
};
function Ih(t, e) {
  if (typeof e != "function" && e !== null) throw new TypeError("Class extends value " + String(e) + " is not a constructor or null");
  Xi(t, e);
  function r() {
    this.constructor = t;
  }
  t.prototype = e === null ? Object.create(e) : (r.prototype = e.prototype, new r());
}
var Ca = function() {
  return Ca = Object.assign || function(e) {
    for (var r, n = 1, a = arguments.length; n < a; n++) {
      r = arguments[n];
      for (var i in r) Object.prototype.hasOwnProperty.call(r, i) && (e[i] = r[i]);
    }
    return e;
  }, Ca.apply(this, arguments);
};
function Rh(t, e, r, n) {
  var a = arguments.length, i = a < 3 ? e : n, o;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function") i = Reflect.decorate(t, e, r, n);
  else for (var s = t.length - 1; s >= 0; s--) (o = t[s]) && (i = (a < 3 ? o(i) : a > 3 ? o(e, r, i) : o(e, r)) || i);
  return a > 3 && i && Object.defineProperty(e, r, i), i;
}
var fl = pc.map(function(t) {
  return gi("on ".concat(t));
}), Oh = /* @__PURE__ */ (function(t) {
  Ih(e, t);
  function e() {
    return t !== null && t.apply(this, arguments) || this;
  }
  var r = e.prototype;
  return r.render = function() {
    return rt.createElement("div", {
      className: Yi,
      ref: rr(this, "selectionElement")
    });
  }, r.componentDidMount = function() {
    var n = this, a = this.props, i = {};
    _h.forEach(function(o) {
      o in a && (i[o] = a[o]);
    }), this.selecto = new Th(Ca(Ca({}, i), {
      portalContainer: this.selectionElement
    })), pc.forEach(function(o, s) {
      n.selecto.on(o, function(l) {
        var u = n.props, c = u[fl[s]] && u[fl[s]](l);
        c === !1 && l.stop();
      });
    });
  }, r.componentDidUpdate = function(n) {
    var a = this.props, i = this.selecto;
    Io.forEach(function(o) {
      n[o] !== a[o] && (i[o] = a[o]);
    });
  }, r.componentWillUnmount = function() {
    this.selecto.destroy();
  }, Rh([Ol(Mh)], e.prototype, "selecto", void 0), e;
})(rt.PureComponent);
const je = "http://www.w3.org/2000/svg";
function na(t, e) {
  const r = URL.createObjectURL(t), n = document.createElement("a");
  n.href = r, n.download = e, document.body.appendChild(n), n.click(), n.remove(), setTimeout(() => URL.revokeObjectURL(r), 1e3);
}
function zr(t, e, r, n = { x: 0, y: 0 }) {
  const a = t.getBoundingClientRect();
  return {
    left: (a.left - e.left) / r - n.x,
    top: (a.top - e.top) / r - n.y,
    width: a.width / r,
    height: a.height / r
  };
}
function dl(t, e, r, n, a, i) {
  e.forEach((o) => {
    if (!o.text) return;
    const s = document.createElementNS(je, "text");
    s.setAttribute("x", String(r + o.left)), s.setAttribute("y", String(n + o.top + a * 0.82)), s.setAttribute("font-size", String(a)), s.setAttribute("font-family", i.fontFamily || Kc), s.setAttribute("font-weight", i.fontWeight || "400"), s.setAttribute("fill", i.color || "#1e293b"), s.setAttribute("xml:space", "preserve"), s.textContent = o.text, t.appendChild(s);
  });
}
function Ph(t, e) {
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
function pl(t, e, r, n, a, i, o) {
  const s = zr(e, r, n, i), l = document.createElementNS(je, "g");
  l.setAttribute("transform", `translate(${Math.round(s.left)},${Math.round(s.top)})`);
  const u = e.querySelector("canvas");
  if (u) {
    const f = document.createElementNS(je, "image"), d = zr(u, r, n, i);
    f.setAttribute("x", "0"), f.setAttribute("y", "0"), f.setAttribute("width", String(Math.round(d.width || s.width))), f.setAttribute("height", String(Math.round(d.height || s.height))), f.setAttribute("href", Zc(e, a, Math.round(d.width || s.width)) ?? u.toDataURL("image/png")), l.appendChild(f);
  }
  const c = e.querySelector("svg");
  if (c) {
    const f = c.cloneNode(!0), d = c.clientWidth || Number(c.getAttribute("width")) || s.width, p = d > 0 ? s.width / d : 1;
    if (Math.abs(p - 1) > 1e-3) {
      const h = document.createElementNS(je, "g");
      h.setAttribute("transform", `scale(${p})`), h.appendChild(f), l.appendChild(h);
    } else l.appendChild(f);
  }
  Jc(l, o), t.appendChild(l);
}
function Nh(t, e, r) {
  var f, d;
  const { width: n, height: a } = pi(e.page), i = la(e.page)[r.pageIndex ?? 0] ?? { x: 0, y: 0 }, o = document.createElementNS(je, "svg");
  o.setAttribute("xmlns", je), o.setAttribute("width", String(n)), o.setAttribute("height", String(a)), o.setAttribute("viewBox", `0 0 ${n} ${a}`);
  const s = document.createElementNS(je, "rect");
  s.setAttribute("width", "100%"), s.setAttribute("height", "100%"), s.setAttribute("fill", "#ffffff"), o.appendChild(s);
  const l = t.getBoundingClientRect(), u = [...t.querySelectorAll(".gl-layout-item")].sort((p, h) => (Number(p.style.zIndex) || 0) - (Number(h.style.zIndex) || 0));
  let c = 0;
  for (const p of u) {
    const h = zr(p, l, r.zoom, i);
    if (h.left >= n || h.top >= a || h.left + h.width <= 0 || h.top + h.height <= 0) continue;
    c += 1;
    const g = p.dataset.title ?? ((f = p.querySelector(".gl-layout-item-head span")) == null ? void 0 : f.textContent) ?? "";
    if (p.classList.contains("has-frame")) {
      const E = document.createElementNS(je, "rect");
      E.setAttribute("x", String(Math.round(h.left) + 0.5)), E.setAttribute("y", String(Math.round(h.top) + 0.5)), E.setAttribute("width", String(Math.round(h.width) - 1)), E.setAttribute("height", String(Math.round(h.height) - 1)), E.setAttribute("fill", "none"), E.setAttribute("stroke", "#94a3b8"), E.setAttribute("id", tn("frame", c, g)), o.appendChild(E);
    }
    const x = p.querySelector(".gl-layout-text-surface");
    if (x) {
      const E = x instanceof HTMLTextAreaElement ? x.value : x.textContent ?? "", _ = getComputedStyle(x), D = zr(x, l, r.zoom, i), M = Number(p.dataset.zoom) || 1, m = (parseFloat(_.fontSize) || 14) * M, I = (parseFloat(_.paddingLeft) || 0) * M, k = (parseFloat(_.paddingTop) || 0) * M, z = ((d = Ph(x, E)) == null ? void 0 : d.map((R) => ({ text: R.text, left: R.left * M, top: R.top * M }))) ?? E.split(`
`).map((R, A) => ({ text: R, left: 0, top: A * m * 1.3 })), P = document.createElementNS(je, "g");
      P.setAttribute("id", tn("text", c, E.trim().split(/\s+/).slice(0, 4).join(" "))), dl(P, z, D.left + I, D.top + k, m, _), o.appendChild(P);
      continue;
    }
    const y = p.querySelector(".gl-layout-plot-host");
    if (!y) continue;
    if (y.__miniPlotCfg) {
      pl(o, y, l, r.zoom, r.dpi, i, tn("plot", c, g));
      continue;
    }
    const b = y.querySelector(".gl-prop-chart");
    if (b) {
      const E = Vc(b);
      if (E) {
        const _ = zr(b, l, r.zoom, i), D = E.width > 0 ? _.width / E.width : 1, M = document.createElementNS(je, "g");
        M.setAttribute("id", tn("chart", c, g)), M.setAttribute("transform", `translate(${_.left},${_.top}) scale(${D})`), M.appendChild(E.root), o.appendChild(M);
      }
      continue;
    }
    y.querySelectorAll(".strategy-context-title, .illustration-row-header").forEach((E) => {
      const _ = (E.textContent ?? "").trim();
      if (!_) return;
      const D = getComputedStyle(E), M = zr(E, l, r.zoom, i), m = E.offsetWidth > 0 ? M.width / E.offsetWidth : 1;
      dl(o, [{ text: _, left: 0, top: 0 }], M.left, M.top, (parseFloat(D.fontSize) || 12) * m, D);
    });
    const w = tn(y.querySelector(".gl-figure-grid") ? "figure" : "strategy", c, g);
    y.querySelectorAll(".mini-plot-cell").forEach((E, _) => pl(o, E, l, r.zoom, r.dpi, i, `${w}-panel-${_ + 1}`));
  }
  return Uc(o, { widthPx: n, heightPx: a, ...$i(e.page) }), { root: o, width: n, height: a };
}
function vl(t) {
  return `<?xml version="1.0" encoding="UTF-8"?>
` + new XMLSerializer().serializeToString(t);
}
function zh(t, e, r) {
  return la(e.page).map((n, a) => Nh(t, e, { dpi: e.page.dpi, zoom: r.zoom, pageIndex: a }));
}
async function Ah(t, e, r) {
  const n = e.page.dpi, a = Hc(e.name) || "layout";
  if (!t.length) return;
  if (r === "svg") {
    if (t.length === 1) {
      na(new Blob([vl(t[0].root)], { type: "image/svg+xml" }), `${a}.svg`);
      return;
    }
    const c = {};
    t.forEach((f, d) => {
      c[`${a}-p${d + 1}.svg`] = $c(vl(f.root));
    }), na(new Blob([os(c)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  if (r === "png") {
    if (t.length === 1) {
      na(await ss(await Ha(t[0], n), n), `${a}.png`);
      return;
    }
    const c = {};
    for (const [f, d] of t.entries()) {
      const p = await Ha(d, n);
      c[`${a}-p${f + 1}.png`] = new Uint8Array(await (await ss(p, n)).arrayBuffer()), await ls();
    }
    na(new Blob([os(c)], { type: "application/zip" }), `${a}.zip`);
    return;
  }
  const { widthMm: i, heightMm: o } = $i(e.page), s = i >= o ? "landscape" : "portrait", { jsPDF: l } = await import("./jspdf.es.min-DRSlxWrz.js").then((c) => c.j), u = new l({ orientation: s, unit: "mm", format: [i, o], compress: !0 });
  for (const [c, f] of t.entries()) {
    if (c > 0 && u.addPage([i, o], s), !await qc(u, f.root, { width: i, height: o })) {
      const d = await Ha(f, n);
      u.addImage(d, "PNG", 0, 0, i, o, void 0, "FAST");
    }
    await ls();
  }
  u.save(`${a}.pdf`);
}
const jh = "", vc = "{none}", aa = [
  { id: "auto", label: "What differs across the page", template: jh },
  { id: "population", label: "Population", template: "{population}" },
  { id: "file", label: "File", template: "{file}" },
  { id: "sample", label: "Sample id", template: "{sample}" },
  { id: "population-file", label: "Population · file", template: "{population} · {file}" },
  { id: "population-plot", label: "Population · plot", template: "{population} · {plot}" },
  { id: "none", label: "No title", template: vc }
], si = "{population}, {file}, {sample}, {x}, {y}, {plot}, {count}, {meta:column}, {popmeta:field}";
function Bh(t, e) {
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
const li = [
  { id: "dot", label: "·", value: " · " },
  { id: "space", label: "space", value: " " },
  { id: "comma", label: ",", value: ", " },
  { id: "slash", label: "/", value: " / " },
  { id: "dash", label: "–", value: " – " }
];
function hl(t, e) {
  return t.join(e);
}
function Gh(t) {
  const e = t.match(/\{[^}]+\}/g) ?? [];
  if (!e.length) return null;
  const r = t.split(/\{[^}]+\}/);
  if (r[0] !== "" || r[r.length - 1] !== "") return null;
  const n = r.slice(1, -1), a = n[0] ?? " · ";
  return n.some((i) => i !== a) ? null : { tokens: e, separator: a };
}
function gl(t, e, r, n, a) {
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
function Ea(t, e) {
  return t.trim() === vc ? "" : t.replace(/\{(population|file|sample|x|y|plot|count|meta:[^}]+|popmeta:[^}]+)\}/g, (n, a) => {
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
function Fh(t, e) {
  const r = new Set(t.map((o) => o.sampleId)), n = new Set(t.map((o) => o.populationId)), a = t.some((o) => o.label), i = e != null && e.metadataColumn ? n.size > 1 ? `{meta:${e.metadataColumn}} · {population}` : `{meta:${e.metadataColumn}}` : r.size <= 1 && n.size > 1 ? "{population}" : n.size <= 1 && r.size > 1 ? "{file}" : "{population} · {file}";
  return a ? `${i} · {plot}` : i;
}
const Lh = "Unassigned";
function hc(t) {
  const e = {};
  for (const [r, n] of Object.entries(t[0] ?? {}))
    t.every((a) => (a == null ? void 0 : a[r]) === n) && (e[r] = n);
  return e;
}
function gc(t) {
  return oe(t.recipe) && t.recipe.iterated === !0;
}
function ml(t, e, r, n) {
  return t.replace(/\{(sample|file|group|population|n|N|meta:[^}]+)\}/g, (a, i) => {
    var o;
    return i === "n" ? String(r) : i === "N" ? String(n) : e ? i === "population" ? e.populationId ? e.name : a : i === "sample" ? e.sampleName ?? e.name : i === "file" ? e.fileName : i === "group" ? e.groupName ?? "" : i.startsWith("meta:") ? ((o = e.metadata) == null ? void 0 : o[i.slice(5).trim()]) ?? "" : a : a;
  });
}
function ui(t, e, r, n, a, i) {
  const o = gc(t), s = { ...t.recipe };
  let l;
  return s.kind === "text" ? s.text = ml(s.text, s.readsFrom ? null : e, r, n) : (o && e && e.populationId ? "populationId" in s && (s.populationId = e.populationId) : o && e && e.sampleIds ? ((s.kind === "biplot" || s.kind === "histogram") && e.sampleIds.length > 1 ? s.pool = { sampleIds: [...e.sampleIds] } : "pool" in s && delete s.pool, "sampleId" in s && !e.sampleIds.includes(s.sampleId) && e.sampleIds.length && (l = s.sampleId, s.sampleId = e.sampleIds[0])) : o && e && "sampleId" in s && s.sampleId !== e.id && (l = s.sampleId, s.sampleId = e.id), s.title && (s.title = ml(s.title, e, r, n))), {
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
function Wh(t, e) {
  if (e)
    for (const r of t) {
      if (r.recipe.kind !== "text" || !r.recipe.readsFrom) continue;
      const n = r.recipe.readsFrom, a = t.find((o) => o.templateId === n && o.offset.x === r.offset.x && o.offset.y === r.offset.y);
      if (!a || !oe(a.recipe)) continue;
      const i = e(a.recipe, a.templateSampleId, a.unitId);
      i && (r.recipe = { ...r.recipe, text: Ea(r.recipe.text, i) });
    }
}
function Yh(t, e, r) {
  const n = Xh(t, e);
  for (const a of n) Wh(a.items, r);
  return n;
}
function Xh(t, e) {
  const r = t.iteration ?? Sl;
  if (r.mode === "off" || !e.length)
    return [{ index: 0, units: [], items: t.items.map((p) => ui(p, null, 1, 1, { x: 0, y: 0 }, 0)) }];
  const n = e.length;
  if (r.arrangement.kind === "page-per-unit")
    return e.map((p, h) => ({
      index: h,
      units: [p],
      items: t.items.map((g) => ui(g, p, h + 1, n, { x: 0, y: 0 }, 0))
    }));
  const { rows: a, columns: i, order: o, gap: s } = r.arrangement, l = Qc(t.items);
  if (!l) return [{ index: 0, units: [], items: [] }];
  const u = a * i, c = l.width + s, f = l.height + s, d = [];
  for (let p = 0; p < n; p += u) {
    const h = e.slice(p, p + u), g = [];
    h.forEach((x, y) => {
      const b = o === "row-major" ? Math.floor(y / i) : y % a, E = { x: (o === "row-major" ? y % i : Math.floor(y / a)) * c, y: b * f };
      for (const _ of t.items) g.push(ui(_, x, p + y + 1, n, E, y));
    }), d.push({ index: d.length, units: h, items: g });
  }
  return d;
}
function mc(t, e, r, n) {
  return e.filter((a) => {
    var i;
    return t.kind === "all" ? !0 : t.kind === "checked" ? r.includes(a.id) : t.kind === "group" ? n[a.id] === t.groupId : (((i = a.metadata) == null ? void 0 : i[t.column]) ?? "") === t.value;
  });
}
function Hh(t, e, r, n, a) {
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
  return mc(t.source, e, r, a).map(i);
}
function $h(t, e, r, n, a, i) {
  var d;
  const o = t.column ?? "";
  if (!o) return [];
  const s = /* @__PURE__ */ new Map(), l = [];
  for (const p of mc(t.source, e, r, a)) {
    const h = ((d = p.metadata) == null ? void 0 : d[o]) ?? "";
    if (!h) {
      l.push(p);
      continue;
    }
    s.set(h, [...s.get(h) ?? [], p]);
  }
  const u = [...s.keys()], c = i ? [...i.filter((p) => s.has(p)), ...u.filter((p) => !i.includes(p)).sort(us)] : u.sort(us), f = (p, h) => {
    const g = new Set(h.map((x) => {
      var y;
      return (y = n.find((b) => b.id === a[x.id])) == null ? void 0 : y.name;
    }));
    return {
      id: `meta:${o}=${p}`,
      name: p,
      fileName: `${h.length} files`,
      ...g.size === 1 && [...g][0] ? { groupName: [...g][0] } : {},
      metadata: hc(h.map((x) => x.metadata)),
      sampleIds: h.map((x) => x.id)
    };
  };
  return [
    ...c.map((p) => f(p, s.get(p))),
    ...l.length ? [f(Lh, l)] : []
  ];
}
function qh(t, e, r) {
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
  return ia(e.populations, n).filter(({ popId: s }) => s !== n && i(s)).map(({ popId: s }) => {
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
function Vh(t, e) {
  return { id: t.templateId, x: e.x - t.offset.x, y: e.y - t.offset.y, width: e.width, height: e.height };
}
const Uh = (t) => [...t].sort((e, r) => e - r);
function ci(t, e) {
  const r = Uh(t);
  if (!r.length) return NaN;
  const n = (r.length - 1) * e, a = Math.floor(n), i = Math.ceil(n);
  return r[a] + (r[i] - r[a]) * (n - a);
}
function Kh(t, e) {
  const r = e.map((o) => o.value), n = r.length, a = n ? r.reduce((o, s) => o + s, 0) / n : NaN, i = n > 1 ? Math.sqrt(r.reduce((o, s) => o + (s - a) ** 2, 0) / (n - 1)) : 0;
  return {
    label: t,
    points: e,
    n,
    mean: a,
    sd: i,
    median: ci(r, 0.5),
    q1: ci(r, 0.25),
    q3: ci(r, 0.75),
    min: n ? Math.min(...r) : NaN,
    max: n ? Math.max(...r) : NaN
  };
}
function Zh(t) {
  const e = [], r = /* @__PURE__ */ new Map();
  for (const n of t)
    r.has(n.group) || (r.set(n.group, []), e.push(n.group)), r.get(n.group).push(n);
  return e.map((n) => Kh(n, r.get(n)));
}
function xc(t) {
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
function Jh(t) {
  const e = Math.abs(t) / Math.SQRT2, r = 1 / (1 + 0.3275911 * e), i = r * (0.254829592 + r * (-0.284496736 + r * (1.421413741 + r * (-1.453152027 + r * 1.061405429)))) * Math.exp(-e * e) / 2;
  return t >= 0 ? i : 1 - i;
}
function Qh(t, e) {
  if (e <= 0) return 0;
  const r = tg(t);
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
function tg(t) {
  const e = [76.18009172947146, -86.50532032941678, 24.01409824083091, -1.231739572450155, 0.001208650973866179, -5395239384953e-18];
  let r = t, n = t, a = r + 5.5;
  a -= (r + 0.5) * Math.log(a);
  let i = 1.000000000190015;
  for (const o of e) i += o / ++n;
  return -a + Math.log(2.5066282746310007 * i / r);
}
function eg(t, e) {
  return t > 0 ? Math.max(0, Math.min(1, 1 - Qh(e / 2, t / 2))) : 1;
}
function rg(t, e) {
  if (t.length < 2 || e.length < 2) return null;
  const r = t.length, n = e.length, { rank: a, ties: i } = xc([...t, ...e]), s = a.slice(0, r).reduce((p, h) => p + h, 0) - r * (r + 1) / 2, l = r + n, u = r * n / 2, c = Math.sqrt(r * n / 12 * (l + 1 - i / (l * (l - 1))));
  if (!(c > 0)) return { name: "Wilcoxon rank-sum", statistic: s, p: 1, label: "Wilcoxon p = 1" };
  const f = (Math.abs(s - u) - 0.5) / c, d = Math.min(1, 2 * Jh(Math.max(0, f)));
  return { name: "Wilcoxon rank-sum", statistic: s, p: d, label: `Wilcoxon ${yc(d)}` };
}
function ng(t) {
  const e = t.filter((c) => c.length > 0);
  if (e.length < 2 || e.some((c) => c.length < 2)) return null;
  const r = e.flat(), n = r.length, { rank: a, ties: i } = xc(r);
  let o = 0, s = 0;
  for (const c of e) {
    const f = a.slice(o, o + c.length).reduce((d, p) => d + p, 0);
    s += f * f / c.length, o += c.length;
  }
  s = 12 / (n * (n + 1)) * s - 3 * (n + 1);
  const l = 1 - i / (n ** 3 - n);
  l > 0 && (s /= l);
  const u = eg(s, e.length - 1);
  return { name: "Kruskal–Wallis", statistic: s, p: u, label: `Kruskal–Wallis ${yc(u)}` };
}
function ag(t) {
  const e = t.map((r) => r.points.map((n) => n.value));
  return e.length === 2 ? rg(e[0], e[1]) : e.length > 2 ? ng(e) : null;
}
function yc(t) {
  return Number.isFinite(t) ? t < 1e-3 ? "p < 0.001" : `p = ${t < 0.01 ? t.toFixed(3) : t.toFixed(2)}` : "p = ?";
}
function ig(t, e = 5) {
  const r = t.filter((d) => Number.isFinite(d)), n = Math.min(0, ...r), a = Math.max(...r, n + 1e-9), o = (a - n || 1) / e, s = 10 ** Math.floor(Math.log10(o)), l = [1, 2, 2.5, 5, 10].map((d) => d * s).find((d) => d >= o) ?? s * 10, u = Math.floor(n / l) * l, c = Math.ceil((a + l * 0.15) / l) * l, f = [];
  for (let d = u; d <= c + l / 2; d += l) f.push(Number(d.toFixed(10)));
  return { min: u, max: c, ticks: f };
}
const bc = {
  percent_of_parent: "% of parent",
  percent_of_total: "% of total",
  count: "Events",
  median: "Median"
};
function og(t, e, r, n, a) {
  var d, p;
  const i = e.find((h) => h.id === t.sampleId) ?? null, o = ((d = i == null ? void 0 : i.tree.populations[t.populationId]) == null ? void 0 : d.name) ?? "the population", s = t.files === "all" ? e : e.filter((h) => n.includes(h.id)), l = [], u = [];
  for (const h of s) {
    let g = t.populationId;
    if (i && i.tree.id !== h.tree.id) {
      const b = Mr(
        { hierarchyId: i.tree.id, populationId: t.populationId },
        h.tree,
        ur(a)
      );
      if (!b.id) {
        u.push(h.name);
        continue;
      }
      g = b.id;
    }
    let x;
    if (t.statistic === "median") {
      const b = t.channel ? h.sample.index(t.channel) : void 0, w = h.derived.masks[g];
      if (b === void 0 || !w) x = null;
      else {
        const E = h.sample.displayColumn(b), _ = [];
        for (let D = 0; D < E.length; D++) w[D] && Number.isFinite(E[D]) && _.push(E[D]);
        x = _.length ? tf(_) : null;
      }
    } else
      x = h.derived.stats[t.statistic === "count" ? "event_count" : t.statistic][g];
    if (typeof x != "number" || !Number.isFinite(x)) continue;
    const y = t.groupBy ? ((p = r[h.id]) == null ? void 0 : p[t.groupBy]) ?? "" : h.name;
    l.push({ sampleId: h.id, name: h.name, group: y, value: x });
  }
  const c = Zh(l), f = t.statistic === "median" ? `Median ${t.channel ?? ""}`.trim() : bc[t.statistic];
  return { points: l, groups: c, test: t.test && t.groupBy ? ag(c) : null, population: o, axis: f, missing: u };
}
const fi = (t) => Math.abs(t) >= 1e3 ? Math.round(t).toLocaleString() : String(Number(t.toPrecision(3))), sg = (t) => (Math.sin(t * 12.9898) * 43758.5453 % 1 + 1) % 1 * 2 - 1;
function lg({
  data: t,
  recipe: e,
  style: r,
  width: n,
  height: a,
  title: i
}) {
  const o = r.fontTick, s = r.fontAxis, l = r.fontTitle, u = t.groups, c = rt.useMemo(() => ig(t.points.map((k) => k.value)), [t.points]), f = 8 + s + 6 + Math.max(...c.ticks.map((k) => fi(k).length), 1) * o * 0.6 + 8, d = 8 + (i ? l + 6 : 0) + (t.test ? o + 10 : 0), p = Math.max(0, ...u.map((k) => k.label.length)), h = u.length > 0 && p * o * 0.6 > (n - f - 8) / u.length, g = 8 + (h ? p * o * 0.45 + 10 : o + 8), x = Math.max(20, n - f - 8), y = Math.max(20, a - d - g), b = (k) => d + y - (k - c.min) / (c.max - c.min || 1) * y, w = u.length ? x / u.length : x, E = (k) => f + (k + 0.5) * w, _ = Math.min(48, w * 0.6), D = r.pubStyle ? "#000000" : "#334155", M = r.pubStyle ? "#d4d4d8" : "#93c5fd", m = r.pubStyle ? "#000000" : "#1d4ed8", I = b(Math.max(c.min, 0));
  return /* @__PURE__ */ C.jsx("div", { className: "mini-plot-cell gl-layout-chart", style: { width: n, height: a, position: "relative" }, role: "img", "aria-label": `${i}: ${t.axis} across ${t.points.length} files`, children: /* @__PURE__ */ C.jsxs("svg", { width: n, height: a, viewBox: `0 0 ${n} ${a}`, style: { display: "block", fontFamily: "Arial, Helvetica, sans-serif" }, children: [
    /* @__PURE__ */ C.jsx("rect", { width: n, height: a, fill: "#ffffff" }),
    i && /* @__PURE__ */ C.jsx("text", { x: n / 2, y: 8 + l, textAnchor: "middle", fontSize: l, fontWeight: 600, fill: D, children: i }),
    !t.points.length && /* @__PURE__ */ C.jsx("text", { x: n / 2, y: a / 2, textAnchor: "middle", fontSize: o, fill: "#64748b", children: t.missing.length ? `${t.population} is not on ${t.missing.length} of the files` : "No files to draw" }),
    /* @__PURE__ */ C.jsxs("g", { className: "gl-layout-chart-axis", fontSize: o, fill: D, children: [
      /* @__PURE__ */ C.jsx("line", { x1: f, x2: f, y1: d, y2: d + y, stroke: D }),
      c.ticks.map((k) => /* @__PURE__ */ C.jsxs("g", { children: [
        /* @__PURE__ */ C.jsx("line", { x1: f - 4, x2: f, y1: b(k), y2: b(k), stroke: D }),
        /* @__PURE__ */ C.jsx("text", { x: f - 6, y: b(k), textAnchor: "end", dominantBaseline: "central", children: fi(k) })
      ] }, k)),
      /* @__PURE__ */ C.jsx("text", { transform: `translate(${8 + s} ${d + y / 2}) rotate(-90)`, textAnchor: "middle", fontSize: s, children: t.axis }),
      /* @__PURE__ */ C.jsx("line", { x1: f, x2: f + x, y1: I, y2: I, stroke: D })
    ] }),
    /* @__PURE__ */ C.jsx("g", { className: "gl-layout-chart-groups", children: u.map((k, z) => {
      const P = E(z), R = e.showPoints || e.chartType === "dots" ? k.points : [];
      return /* @__PURE__ */ C.jsxs("g", { children: [
        e.chartType === "bars" && Number.isFinite(k.mean) && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
          /* @__PURE__ */ C.jsx("rect", { x: P - _ / 2, y: Math.min(b(k.mean), I), width: _, height: Math.abs(I - b(k.mean)), fill: M, stroke: D, strokeWidth: 0.8 }),
          k.n > 1 && k.sd > 0 && /* @__PURE__ */ C.jsxs("g", { stroke: D, strokeWidth: 1, children: [
            /* @__PURE__ */ C.jsx("line", { x1: P, x2: P, y1: b(k.mean - k.sd), y2: b(k.mean + k.sd) }),
            /* @__PURE__ */ C.jsx("line", { x1: P - _ / 4, x2: P + _ / 4, y1: b(k.mean + k.sd), y2: b(k.mean + k.sd) }),
            /* @__PURE__ */ C.jsx("line", { x1: P - _ / 4, x2: P + _ / 4, y1: b(k.mean - k.sd), y2: b(k.mean - k.sd) })
          ] })
        ] }),
        e.chartType === "box" && k.n > 0 && /* @__PURE__ */ C.jsxs("g", { stroke: D, strokeWidth: 1, fill: M, children: [
          /* @__PURE__ */ C.jsx("line", { x1: P, x2: P, y1: b(k.min), y2: b(k.q1) }),
          /* @__PURE__ */ C.jsx("line", { x1: P, x2: P, y1: b(k.q3), y2: b(k.max) }),
          /* @__PURE__ */ C.jsx("rect", { x: P - _ / 2, y: b(k.q3), width: _, height: Math.max(0.5, b(k.q1) - b(k.q3)) }),
          /* @__PURE__ */ C.jsx("line", { x1: P - _ / 2, x2: P + _ / 2, y1: b(k.median), y2: b(k.median), strokeWidth: 2 })
        ] }),
        e.chartType === "dots" && k.n > 1 && /* @__PURE__ */ C.jsx("line", { x1: P - _ / 2, x2: P + _ / 2, y1: b(k.mean), y2: b(k.mean), stroke: D, strokeWidth: 2 }),
        R.map((A, j) => /* @__PURE__ */ C.jsx("circle", { cx: P + sg(j + z * 31) * _ * 0.3, cy: b(A.value), r: Math.max(2, o * 0.28), fill: m, stroke: "#ffffff", strokeWidth: 0.8, children: /* @__PURE__ */ C.jsx("title", { children: `${A.name}: ${fi(A.value)}` }) }, A.sampleId)),
        /* @__PURE__ */ C.jsx(
          "text",
          {
            x: P,
            y: d + y + 6,
            textAnchor: h ? "end" : "middle",
            dominantBaseline: "hanging",
            fontSize: o,
            fill: D,
            transform: h ? `rotate(-45 ${P} ${d + y + 6})` : void 0,
            children: k.label
          }
        )
      ] }, k.label || String(z));
    }) }),
    t.test && u.length >= 2 && /* @__PURE__ */ C.jsxs("g", { className: "gl-layout-chart-test", fontSize: o, fill: D, children: [
      /* @__PURE__ */ C.jsx("line", { x1: E(0), x2: E(u.length - 1), y1: d - 4, y2: d - 4, stroke: D }),
      /* @__PURE__ */ C.jsx("text", { x: (E(0) + E(u.length - 1)) / 2, y: d - 7, textAnchor: "middle", children: t.test.label })
    ] })
  ] }) });
}
const di = (t) => ({
  tick: t.fontTick,
  axis_label: t.fontAxis,
  gate_label: t.fontGate,
  title: t.fontTitle
}), ug = { x: "X (px)", y: "Y (px)", width: "Width (px)", height: "Height (px)" }, en = [0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4], xl = 10, cg = { index: 0, units: [], items: [] }, fg = {}, yl = { top: !0, left: !0, bottom: !0, right: !0, center: !0, middle: !0 }, dg = [
  { how: "left", label: "Left", title: "Align the left edges (one item: to the page margin)" },
  { how: "centerX", label: "Centre", title: "Align the horizontal centres (one item: to the page centre)" },
  { how: "right", label: "Right", title: "Align the right edges (one item: to the page margin)" },
  { how: "top", label: "Top", title: "Align the top edges (one item: to the page margin)" },
  { how: "centerY", label: "Middle", title: "Align the vertical centres (one item: to the page centre)" },
  { how: "bottom", label: "Bottom", title: "Align the bottom edges (one item: to the page margin)" }
], pg = [
  { how: "horizontal", label: "Distribute ↔", title: "Equal spacing between three or more items or groups, left to right; the outer two stay where they are" },
  { how: "vertical", label: "Distribute ↕", title: "Equal spacing between three or more items or groups, top to bottom; the outer two stay where they are" }
];
function vg(t) {
  var r, n, a;
  if (!t) return;
  t.stopDrag();
  const e = (r = t.getManager) == null ? void 0 : r.call(t);
  for (const i of ((n = e == null ? void 0 : e.getMoveables) == null ? void 0 : n.call(e)) ?? []) i !== e && ((a = i.stopDrag) == null || a.call(i));
}
function hg(t) {
  return {
    x: Math.round(parseFloat(t.style.left) || 0),
    y: Math.round(parseFloat(t.style.top) || 0),
    width: Math.round(parseFloat(t.style.width) || t.offsetWidth),
    height: Math.round(parseFloat(t.style.height) || t.offsetHeight)
  };
}
function gg(t, e, r) {
  return e ? r.some((n) => !!n && (t === `${e} · ${n}` || t.startsWith(`${e} · ${n} · `))) : !1;
}
function qe(t, e, r) {
  var s, l, u;
  const n = t.recipe;
  if (n.kind === "text") return n.text.split(`
`)[0] || "Text";
  if ((s = n.title) != null && s.trim()) return n.title.trim();
  if (n.kind === "figure") return ((u = (l = n.illustration.figure) == null ? void 0 : l.name) == null ? void 0 : u.trim()) || "Figure";
  if (n.kind === "proportions") return n.settings.plotType === "box" ? "Boxplot" : "Composition";
  const a = e.find(({ id: c }) => c === n.sampleId), i = a == null ? void 0 : a.tree.populations[n.populationId];
  if (n.kind === "chart") return `${(i == null ? void 0 : i.name) ?? "Population"} · ${bc[n.statistic]}`;
  if (n.kind === "strategy")
    return `${(i == null ? void 0 : i.name) ?? "Population"} strategy`;
  const o = vn(n);
  return o ? `${(i == null ? void 0 : i.name) ?? "Population"} · ${o.length} files` : `${(i == null ? void 0 : i.name) ?? "Population"} · ${(a == null ? void 0 : a.name) ?? "FCS"}`;
}
function vn(t) {
  return (t.kind === "biplot" || t.kind === "histogram") && t.pool && t.pool.sampleIds.length > 1 ? t.pool.sampleIds : null;
}
function Hi(t, e, r, n) {
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
    const d = Cl(t.populationId, f.tree, r, n ?? i.tree.id);
    if (d.missing) {
      s.push({ name: f.name, reason: "no corresponding population" });
      continue;
    }
    const p = f === i ? null : cf(i.sample, f.sample, t.xChannel, l);
    if (p) {
      s.push({ name: f.name, reason: p });
      continue;
    }
    o.push({ id: f.id, name: f.name, sample: f.sample, tree: f.tree, gating: f.derived, populationId: d.id });
  }
  return { members: o, leftOut: s };
}
function mg({
  files: t,
  pool: e,
  checkedSampleIds: r,
  groups: n,
  fileGroups: a,
  report: i,
  onChange: o
}) {
  const { t: s } = bn(), [l, u] = rt.useState(""), c = rt.useMemo(
    () => Object.fromEntries(t.filter((g) => g.metadata).map((g) => [g.id, g.metadata])),
    [t]
  ), f = rt.useMemo(
    () => hf(c, [...new Set(Object.values(c).flatMap((g) => Object.keys(g)))].map((g) => ({ name: g }))),
    [c]
  ), d = rt.useMemo(() => new Set(t.filter((g) => !e.includes(g.id)).map((g) => g.id)), [t, e]), p = (g) => t.filter((x) => g instanceof Set ? g.has(x.id) : g.includes(x.id)).map((x) => x.id), h = l.trim().toLowerCase();
  return /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-pool", children: [
    /* @__PURE__ */ C.jsxs("div", { className: "gl-figure-actions gl-figure-list-actions", children: [
      /* @__PURE__ */ C.jsx("button", { type: "button", onClick: () => o(p(r)), children: s("Checked files") }),
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
    /* @__PURE__ */ C.jsx("div", { className: "gl-figure-list gl-layout-pool-list", children: t.filter((g) => !h || `${g.name} ${g.fileName ?? ""}`.toLowerCase().includes(h)).map((g) => /* @__PURE__ */ C.jsxs("label", { className: "gl-figure-row", title: g.fileName && g.fileName !== g.name ? `${g.name} · ${g.fileName}` : g.name, children: [
      /* @__PURE__ */ C.jsx(
        "input",
        {
          type: "checkbox",
          checked: e.includes(g.id),
          onChange: () => o(e.includes(g.id) ? e.filter((x) => x !== g.id) : p([...e, g.id]))
        }
      ),
      /* @__PURE__ */ C.jsx("span", { className: "gl-figure-row-name", children: g.name })
    ] }, g.id)) }),
    f.length > 0 && /* @__PURE__ */ C.jsx("div", { className: "gl-sample-facets gl-figure-facets", "aria-label": s("Select pooled files by metadata"), children: f.map((g) => /* @__PURE__ */ C.jsxs("div", { className: "gl-sample-facet-row", children: [
      /* @__PURE__ */ C.jsx("span", { className: "gl-sample-facet-lock", "aria-hidden": "true" }),
      /* @__PURE__ */ C.jsx("span", { className: "gl-sample-facet-name", title: g.name, children: g.name }),
      /* @__PURE__ */ C.jsx("div", { className: "gl-sample-facet-values", children: g.values.map((x) => {
        const y = gf(x.sampleIds, d), b = x.sampleIds.length, w = y === b ? "all" : y === 0 ? "none" : "some", E = b > 0 ? Math.round(y / b * 100) : 0;
        return /* @__PURE__ */ C.jsxs(
          "button",
          {
            type: "button",
            className: `gl-sample-facet-chip is-${w}`,
            style: w === "some" ? { "--gl-facet-fill": `${E}%` } : void 0,
            "aria-pressed": y === b,
            title: `${x.value}: ${y} of ${b} pooled — ${y === b ? `click to drop all ${b}` : `click to pool all ${b}`}`,
            onClick: () => o(p(new Set(t.filter((_) => !mf(x.sampleIds, d).has(_.id)).map((_) => _.id)))),
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
    ] }, g.name)) }),
    i && /* @__PURE__ */ C.jsxs("p", { className: "gl-hint", children: [
      s("{n} of {m} files pooled", { n: i.pooled, m: i.total }),
      i.leftOut.length > 0 && ` · ${s("Not pooled: {files}", { files: i.leftOut.map((g) => `${g.name} (${g.reason})`).join(", ") })}`,
      i.omittedGates.length > 0 && ` · ${s("Gates not shown: {names} — they differ between the pooled files", { names: i.omittedGates.join(", ") })}`
    ] })
  ] });
}
function xg({
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
  var z, P;
  const c = rt.useRef(null), f = t.recipe, d = JSON.stringify(o), p = rt.useMemo(() => ur(r), [r]), h = f.kind === "text" ? null : e.find(({ id: R }) => R === f.sampleId) ?? null, g = vn(f), x = (g == null ? void 0 : g.join("|")) ?? "", y = rt.useMemo(
    () => x ? x.split("|").map((R) => e.find((A) => A.id === R) ?? null) : null,
    [e, x]
  ), b = h ? { ...r, ...h.tree } : r, w = f.kind !== "text" && t.templateSampleId && t.templateSampleId !== f.sampleId ? e.find(({ id: R }) => R === t.templateSampleId) ?? null : null, E = f.kind === "text" || !h ? { id: f.kind === "text" ? "" : f.populationId, missing: !1 } : Cl(f.populationId, h.tree, p, w == null ? void 0 : w.tree.id), _ = E.id, D = E.missing ? ((z = w == null ? void 0 : w.tree.populations[f.kind === "text" ? "" : f.populationId]) == null ? void 0 : z.name) ?? "the population" : null, M = f.kind === "text" ? null : u({ ...f, populationId: _ }, void 0, t.unitId), m = (R) => M ? Ea(R, M) : R, I = f.kind === "strategy" ? m(((P = f.title) == null ? void 0 : P.trim()) || "{population}") : m(l), k = JSON.stringify(f);
  return rt.useEffect(() => {
    const R = c.current;
    if (!R || f.kind === "text") return;
    const A = window.setTimeout(() => {
      var nt, Q;
      if (R.innerHTML = "", !h) {
        R.textContent = "The referenced file is unavailable or still loading.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      const j = b.populations[_];
      if (D || !j) {
        R.textContent = D ? `${h.name} has no population corresponding to ${D}.` : "The referenced population is unavailable.", R.className = "gl-layout-plot-host is-missing";
        return;
      }
      R.className = "gl-layout-plot-host";
      const W = Math.max(120, t.width - 8), X = Math.max(120, t.height - 8);
      if (f.kind === "strategy") {
        const at = wf(
          h.sample,
          b.gates,
          b.populations,
          b.root_population_id ?? "",
          _,
          { fullPath: f.fullPath, maxEvents: o.maxEvents }
        ), it = 8, mt = 26, bt = Math.max(1, at.length);
        let Z = 1, ut = 0;
        for (let pt = 1; pt <= bt; pt++) {
          const ht = Math.ceil(bt / pt), St = Math.floor((W - it * (pt - 1)) / pt), gt = Math.floor((X - mt - it * (ht - 1)) / ht), Mt = Math.min(St, gt);
          Mt > ut && (ut = Mt, Z = pt);
        }
        ut = Math.max(100, Math.min(800, ut));
        const Et = Df(
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
            fontSizes: di(o),
            contextTitle: I
          }
        );
        R.id = `layout-strategy-${t.id}`;
        for (const pt of Object.values(Et.plots ?? {})) pt.canvas_scale = s;
        xs().renderStrategyGrid(R.id, Et);
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
        fontSizes: di(o),
        scaleFontsWithPlot: !0
      }, F = (at, it) => xs().renderMiniPlot(R, {
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
        title: I,
        contour_levels: o.contourLevels,
        font_sizes: di(o),
        gate_style: { pub_style: o.pubStyle, line_width: o.gateLineWidth, label_format: o.gateLabels },
        pop_color: "#334155",
        gates: it
      });
      if (y) {
        const { members: at } = Hi(f, e, p, w == null ? void 0 : w.tree.id), it = at.length ? _f(at, f.xChannel, q, n, V, p) : null;
        if (!it) {
          R.textContent = "No events are available for this FCS/population combination.", R.className = "gl-layout-plot-host is-missing";
          return;
        }
        F(it.config, it.gates);
        return;
      }
      const et = Mf(
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
    return () => window.clearTimeout(A);
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
    I,
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
function yg({
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
  divisionProfiles: g,
  canvasScale: x,
  onTextChange: y,
  onTextFocus: b,
  textEditing: w,
  onTextEditStart: E,
  onTextEditEnd: _,
  onIsolate: D
}) {
  var k;
  const { t: M } = bn(), m = Sf(t), I = m === 1 ? t : { ...t, width: Math.max(1, Math.round(t.width / m)), height: Math.max(1, Math.round(t.height / m)) };
  return /* @__PURE__ */ C.jsx(
    "article",
    {
      "data-item-id": t.id,
      "data-template-id": t.templateId,
      "data-zoom": m === 1 ? void 0 : m,
      title: `${t.locked ? `${M("Locked")} · ` : ""}${qe(t, n)}`,
      "data-title": qe(t, n),
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
      children: /* @__PURE__ */ C.jsx("div", { className: "gl-layout-item-body", style: m === 1 ? void 0 : { zoom: m, width: I.width, height: I.height }, children: t.recipe.kind === "text" ? /* @__PURE__ */ C.jsx(
        Sg,
        {
          text: t.recipe.text,
          templateText: e ?? t.recipe.text,
          fontSize: t.recipe.fontSize,
          bold: t.recipe.bold,
          editing: w,
          onEditStart: E,
          onEditEnd: _,
          onCommit: y,
          onFocus: b
        }
      ) : t.recipe.kind === "figure" ? /* @__PURE__ */ C.jsx(
        Cf,
        {
          recipe: t.recipe,
          files: p,
          sources: h,
          state: a,
          globalScales: i,
          width: Math.max(120, I.width - 8),
          height: Math.max(80, I.height - 8)
        }
      ) : t.recipe.kind === "proportions" ? /* @__PURE__ */ C.jsx(
        Ef,
        {
          recipe: t.recipe,
          samples: p,
          state: a,
          metadataById: d,
          divisionProfiles: g,
          width: Math.max(120, I.width - 8),
          height: Math.max(80, I.height - 8),
          containerId: `layout-proportions-${t.id}`
        }
      ) : t.recipe.kind === "chart" ? /* @__PURE__ */ C.jsx("div", { className: "gl-layout-plot-host gl-layout-chart-host", children: /* @__PURE__ */ C.jsx(
        lg,
        {
          data: og(t.recipe, n, d, f, a),
          recipe: t.recipe,
          style: l,
          width: Math.max(120, I.width - 8),
          height: Math.max(80, I.height - 8),
          title: ((k = t.recipe.title) == null ? void 0 : k.trim()) || qe(t, n)
        }
      ) }) : /* @__PURE__ */ C.jsx(
        xg,
        {
          item: I,
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
const bg = [
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
function bl({
  effective: t,
  own: e,
  onChange: r
}) {
  const { t: n } = bn();
  return /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-style-fields", children: [
    bg.map(({ key: a, label: i, step: o, integer: s }) => /* @__PURE__ */ C.jsxs(rt.Fragment, { children: [
      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline" + (a in e ? " is-own" : ""), children: [
        n(i),
        /* @__PURE__ */ C.jsx(
          ke,
          {
            "aria-label": n(i),
            value: a === "maxEvents" && t.maxEvents === 0 ? hs.maxEvents : t[a],
            min: vs[a][0],
            max: vs[a][1],
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
            onChange: (l) => r({ maxEvents: l.target.checked ? 0 : hs.maxEvents })
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
function Sg({
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
  const { t: u } = bn(), [c, f] = rt.useState(e), d = rt.useRef(null);
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
function Eg({
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
  illustrationConfig: g,
  onOpenInIllustration: x,
  plottingSettings: y,
  divisionProfiles: b = fg,
  onOpenInPlotting: w,
  dataRevision: E,
  densityColorPower: _,
  onOpenInGating: D,
  onExported: M
}) {
  var es, rs, ns, as;
  const { t: m } = bn(), [I, k] = rt.useState([]), [z, P] = rt.useState(null), [R, A] = rt.useState(!0), [j, W] = rt.useState(null), [X, L] = rt.useState(null), [q, V] = rt.useState([]), [F, et] = rt.useState([]), tt = rt.useRef(null), K = rt.useRef(null), [nt, Q] = rt.useState(null), [at, it] = rt.useState(null), [mt, bt] = rt.useState(
    u ?? ((es = r[0]) == null ? void 0 : es.id) ?? ""
  ), [Z, ut] = rt.useState("item"), [Et, pt] = rt.useState(!1), [ht, St] = rt.useState({ shift: !1, meta: !1 });
  rt.useEffect(() => {
    const v = (T) => St((B) => {
      const G = { shift: T.shiftKey, meta: T.metaKey || T.ctrlKey };
      return G.shift === B.shift && G.meta === B.meta ? B : G;
    }), S = () => St((T) => T.shift || T.meta ? { shift: !1, meta: !1 } : T);
    return window.addEventListener("keydown", v), window.addEventListener("keyup", v), window.addEventListener("blur", S), () => {
      window.removeEventListener("keydown", v), window.removeEventListener("keyup", v), window.removeEventListener("blur", S);
    };
  }, []);
  const [gt, Mt] = rt.useState(1), Ct = rt.useRef(gt);
  Ct.current = gt;
  const [kt, Ht] = rt.useState(gt);
  rt.useEffect(() => {
    const v = window.setTimeout(() => Ht(gt), 250);
    return () => window.clearTimeout(v);
  }, [gt]);
  const ne = Math.min(4, Math.max(1, (typeof window > "u" ? 1 : window.devicePixelRatio || 1) * kt)), [$t, Ft] = rt.useState("pdf"), [zt, Me] = rt.useState(!1), ge = rt.useRef(null), Cr = rt.useRef(null), Le = (v) => {
    var S;
    k(v), (S = ge.current) == null || S.focus({ preventScroll: !0 });
  }, Na = (v) => Le(v ? [v] : []), de = ef(
    r,
    r.map((v) => v.id),
    f,
    E
  ), It = rt.useMemo(
    () => de.current ? de.sources.map((v) => ({ ...v, derived: v.gating })) : [],
    [de.current, de.sources]
  ), Er = rt.useMemo(
    () => Object.fromEntries(r.map((v) => [v.id, v.metadata])),
    [r]
  ), We = rt.useMemo(() => ur(f), [f]), Lt = r.length === 0 || de.current && de.pending === 0, Ke = rt.useRef([]), sr = rt.useRef([]), U = t.sheets.find(({ id: v }) => v === t.activeSheetId) ?? t.sheets[0], ct = (U == null ? void 0 : U.iteration) ?? Sl, yt = rt.useMemo(() => {
    const v = U == null ? void 0 : U.items.find((T) => oe(T.recipe) && T.recipe.iterated === !0), S = v && "sampleId" in v.recipe ? v.recipe.sampleId : u;
    return It.find(({ id: T }) => T === S) ?? It[0] ?? null;
  }, [U, It, u]), jt = rt.useMemo(
    () => ct.mode === "populations" ? yt ? qh(ct, yt.tree, r.find(({ id: v }) => v === yt.id) ?? yt) : [] : ct.mode === "metadata" ? $h(ct, r, n, a, i, s == null ? void 0 : s[ct.column ?? ""]) : Hh(ct, r, n, a, i),
    [ct, r, n, a, i, yt, s]
  ), Ye = rt.useCallback((v, S, T) => {
    var lt;
    const B = r.find(({ id: _t }) => _t === v.sampleId) ?? null, G = It.find(({ id: _t }) => _t === v.sampleId) ?? null;
    let $ = v.populationId;
    if (G && S && S !== v.sampleId) {
      const _t = It.find(({ id: te }) => te === S);
      if (_t && _t.tree.id !== G.tree.id) {
        const te = Mr({ hierarchyId: _t.tree.id, populationId: v.populationId }, G.tree, ur(f));
        te.id && ($ = te.id);
      }
    }
    const Y = G == null ? void 0 : G.tree.populations[$], st = vn(v);
    if (st && v.kind !== "strategy") {
      const { members: _t } = Hi(v, It, We, S ? (lt = It.find(({ id: Vt }) => Vt === S)) == null ? void 0 : lt.tree.id : void 0), te = _t.reduce((Vt, is) => Vt + (is.gating.stats.event_count[is.populationId] ?? 0), 0), be = T ? jt.find((Vt) => Vt.id === T) : void 0;
      return gl(
        v,
        { name: be != null && be.sampleIds ? be.name : `${st.length} files`, fileName: `${st.length} files`, metadata: hc(st.map((Vt) => Er[Vt])) },
        Y ? { id: $, name: Y.name } : null,
        _t.length ? te : void 0,
        l
      );
    }
    const Dt = G == null ? void 0 : G.derived.stats.event_count[$];
    return gl(
      v.kind === "strategy" ? {} : v,
      B ? { name: B.name, fileName: B.fileName ?? B.name, metadata: B.metadata } : null,
      Y ? { id: $, name: Y.name } : null,
      typeof Dt == "number" ? Dt : void 0,
      l
    );
  }, [r, It, f, l, We, Er, jt]), ie = rt.useMemo(
    () => U ? Yh(U, jt, Ye) : [],
    [U, jt, Ye]
  ), [Vr, Ne] = rt.useState(0), [Ro, Sc] = rt.useState(!1), [Cc, Ec] = rt.useState(" · "), Oo = rt.useMemo(
    () => [...new Set(Object.values(l ?? {}).flatMap((v) => Object.keys(v)))].sort(),
    [l]
  ), Po = rt.useMemo(() => Bh(o, Oo), [o, Oo]), ze = Math.min(Vr, Math.max(0, ie.length - 1)), qt = ie[ze] ?? cg, No = ((rs = U == null ? void 0 : U.titleTemplate) == null ? void 0 : rs.trim()) || Fh(
    qt.items.flatMap((v) => {
      var S;
      return oe(v.recipe) ? [{ sampleId: ((S = vn(v.recipe)) == null ? void 0 : S.join(",")) ?? v.recipe.sampleId, populationId: v.recipe.populationId, label: v.recipe.kind === "strategy" ? void 0 : v.recipe.label }] : [];
    }),
    ct.mode === "metadata" ? { metadataColumn: ct.column } : void 0
  );
  rt.useEffect(() => {
    Vr !== ze && Ne(ze);
  }, [Vr, ze]);
  const Ur = (v) => v.split("::")[0], ae = [...new Set(I.map(Ur))], pe = (U == null ? void 0 : U.items.filter(({ id: v }) => ae.includes(v))) ?? [], ot = pe.length === 1 ? pe[0] : null, Ae = ot ? qt.items.find((v) => v.templateId === ot.id) ?? null : null, zo = (v) => v.split("::")[1] ?? "", Tn = (v) => {
    var S;
    return (S = qt.items.find((T) => T.id === v)) == null ? void 0 : S.group;
  }, Ao = (v) => {
    const S = new Set(v.map(Tn).filter((G) => !!G));
    if (!S.size) return [...v];
    const T = new Set(v.map(zo)), B = new Set(v);
    for (const G of qt.items) G.group && S.has(G.group) && T.has(zo(G.id)) && B.add(G.id);
    return [...B];
  }, Kr = rf(pe).length, wc = pe.length > 1 && pe.every((v) => v.group && v.group === pe[0].group), jo = (v, S) => {
    var G;
    if (!oe(v.recipe)) return "";
    const T = ((G = v.recipe.title) == null ? void 0 : G.trim()) ?? "";
    if (!T) return "";
    const B = Ye(v.recipe, S);
    return B && gg(T, B.population, [B.file, B.sample]) ? "" : T;
  }, Dc = Ae && oe(Ae.recipe) ? Ea(No, Ye(Ae.recipe, Ae.templateSampleId, Ae.unitId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "", za = pe.some((v) => v.locked), In = new Set(((U == null ? void 0 : U.items) ?? []).filter((v) => v.locked).map((v) => v.id)), Xe = q.filter((v) => !In.has(Ur(v.dataset.itemId ?? "")) && v.dataset.itemId !== z), Zr = Xe.length > 1 && Xe.every((v) => !Tn(v.dataset.itemId ?? "")), Bo = rt.useRef(Xe);
  Bo.current = Xe;
  const Rn = rt.useRef(!1);
  rt.useEffect(() => {
    I.length && I.some((v) => !qt.items.some((S) => S.id === v)) && k((v) => v.filter((S) => qt.items.some((T) => T.id === S)));
  }, [qt, I]), rt.useLayoutEffect(() => {
    var v;
    (v = tt.current) == null || v.updateRect();
  }, [qt, gt, kt]), rt.useLayoutEffect(() => {
    var G;
    if (!j) return;
    const v = [...j.querySelectorAll("[data-item-id]")], S = ($, Y) => $.length === Y.length && $.every((st, Dt) => st === Y[Dt]), T = v.filter(($) => I.includes($.dataset.itemId ?? "")), B = v.filter(($) => !I.includes($.dataset.itemId ?? ""));
    V(($) => S($, T) ? $ : T), et(($) => S($, B) ? $ : B), (G = K.current) == null || G.setSelectedTargets(T);
  }, [j, I, qt, U == null ? void 0 : U.id]), rt.useEffect(() => {
    Ko();
  }, [U == null ? void 0 : U.id]);
  const Aa = (v, S = !0) => {
    S && (Ke.current = [
      Ln(t),
      ...Ke.current
    ].slice(0, 30), sr.current = []), e(v);
  }, wr = (v) => {
    const S = Ln(t);
    v(S), Aa(S);
  }, Rt = (v) => {
    wr((S) => {
      const T = S.sheets.find(({ id: B }) => B === S.activeSheetId);
      T && v(T);
    });
  }, ja = rt.useRef(null), [_c, Ba] = rt.useState(null), Dr = (v, S) => {
    let T = "";
    const B = ja.current;
    ja.current = null, Rt((G) => {
      T = crypto.randomUUID();
      const $ = ms(G, S == null ? void 0 : S.width, S == null ? void 0 : S.height);
      B && ($.x = Math.max(0, Math.round(B.x)), $.y = Math.max(0, Math.round(B.y))), G.items.push({
        id: T,
        ...$,
        recipe: v
      });
    }), Na(T), jc(T);
  }, re = It.find(({ id: v }) => v === mt) ?? It[0] ?? null, Ga = re && c ? Mr(
    {
      hierarchyId: f.active_hierarchy_id,
      populationId: c
    },
    re.tree,
    ur(f)
  ) : null, Ze = (Ga == null ? void 0 : Ga.id) ?? (re == null ? void 0 : re.tree.root_population_id) ?? "", On = (v) => {
    var S, T, B;
    if (!re || !Ze) {
      it(m("Check an FCS file and select a population first."));
      return;
    }
    Dr({
      kind: v,
      sampleId: re.id,
      populationId: Ze,
      ...ct.mode !== "off" ? { iterated: !0 } : {},
      xChannel: re.sample.index(p) !== void 0 ? p : ((S = re.sample.channels[0]) == null ? void 0 : S.key) ?? "",
      yChannel: v === "histogram" ? null : re.sample.index(h) !== void 0 ? h : ((T = re.sample.channels[1]) == null ? void 0 : T.key) ?? ((B = re.sample.channels[0]) == null ? void 0 : B.key) ?? null,
      displayMode: "pseudocolor"
    });
  }, Go = () => {
    if (!re || !Ze) {
      it(m("Check an FCS file and select a population first."));
      return;
    }
    Dr(
      {
        kind: "chart",
        sampleId: re.id,
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
  }, Fo = () => Dr({ kind: "text", text: "Text", fontSize: 18 }, { width: 160, height: 32 }), Mc = (v, S) => {
    Rt((T) => {
      const B = T.items.find((G) => G.id === v);
      B && (B.recipe = S(B.recipe));
    });
  }, kc = (v) => {
    v.preventDefault();
    const S = v.target.closest("[data-item-id]");
    if (S != null && S.dataset.itemId) {
      const $ = S.dataset.itemId, Y = U == null ? void 0 : U.items.find(({ id: Vt }) => Vt === Ur($));
      if (!Y) return;
      const st = I.includes($);
      st || Le(Ao([$]));
      const Dt = Y.group ? ((U == null ? void 0 : U.items) ?? []).filter((Vt) => Vt.group === Y.group).map(({ id: Vt }) => Vt) : [Y.id], lt = st && ae.length > 1 ? ae : Dt, _t = lt.length > 1, te = oe(Y.recipe), be = [
        { label: _t ? m("Duplicate {n} items", { n: lt.length }) : m("Duplicate"), onClick: () => Qr(lt) },
        { label: m("Bring to front"), onClick: () => He(lt, "front") },
        { label: m("Bring forward"), onClick: () => He(lt, "forward") },
        { label: m("Send backward"), onClick: () => He(lt, "backward") },
        { label: m("Send to back"), onClick: () => He(lt, "back") },
        { label: Y.locked ? m("Unlock") : m("Lock"), onClick: () => Nn(lt, !Y.locked) },
        ...st && Kr > 1 ? [{ label: m("Group"), onClick: Pn }] : [],
        ...Y.group ? [{ label: m("Ungroup"), onClick: () => Rt((Vt) => gs(Vt, lt)) }] : [],
        "separator",
        ...ct.mode !== "off" && te ? [
          {
            label: "iterated" in Y.recipe && Y.recipe.iterated ? m("Stop following the iteration") : m("Follow the iteration"),
            onClick: () => Mc(Y.id, (Vt) => oe(Vt) ? { ...Vt, iterated: !Vt.iterated } : Vt)
          },
          "separator"
        ] : [],
        ...te ? [{ label: m("Open in Gating"), onClick: () => D(Y.recipe) }] : [],
        ...Y.recipe.kind === "figure" && x ? [{ label: m("Edit in Illustration"), onClick: () => x(structuredClone(Y.recipe.illustration)) }] : [],
        ...Y.recipe.kind === "proportions" && w ? [{ label: m("Edit in Plotting"), onClick: () => w(structuredClone(Y.recipe.settings)) }] : [],
        { label: _t ? m("Remove {n} items", { n: lt.length }) : m("Remove"), onClick: () => Jr(lt) }
      ];
      Ba({ x: v.clientX, y: v.clientY, items: be, label: qe(Y, It) });
      return;
    }
    const T = v.currentTarget.getBoundingClientRect(), B = { x: (v.clientX - T.left) / gt, y: (v.clientY - T.top) / gt }, G = ($) => () => {
      ja.current = B, $();
    };
    Ba({
      x: v.clientX,
      y: v.clientY,
      label: m("Page"),
      items: [
        { label: m("+ Biplot"), disabled: !Lt, onClick: G(() => On("biplot")) },
        { label: m("+ Histogram"), disabled: !Lt, onClick: G(() => On("histogram")) },
        { label: m("+ Gating strategy"), disabled: !Lt, onClick: G(Yo) },
        { label: m("+ Chart"), disabled: !Lt, onClick: G(Go) },
        { label: m("+ Text"), onClick: G(Fo) },
        { label: m("+ Illustration figure"), disabled: !Lt || !(g != null && g.figure), onClick: G(Lo) },
        { label: m("+ Plotting chart"), disabled: !Lt || !y, onClick: G(Wo) },
        "separator",
        // With a selection on the page, the menu on blank paper offers what the selection's own menu does for grouping, as Illustrator's does.
        ...Kr > 1 ? [{ label: m("Group"), onClick: Pn }] : [],
        ...pe.some(($) => $.group) ? [{ label: m("Ungroup"), onClick: La }] : [],
        { label: m("Select all"), disabled: !qt.items.length, onClick: () => Le(qt.items.filter(($) => !In.has($.templateId)).map(({ id: $ }) => $)) }
      ]
    });
  }, Lo = () => {
    if (!(g != null && g.figure)) {
      it(m("Make a figure on the Illustration tab first."));
      return;
    }
    U && Dr({ kind: "figure", illustration: structuredClone(g), page: 0 }, ff(g, r, f, U));
  }, Wo = () => {
    if (!y || !U) return;
    const v = y(), S = df(v, pf(r), f, Er, b);
    if (!S.catLevels.length || !S.perSample.length) {
      it(m("Choose files and populations on the Plotting tab first."));
      return;
    }
    Dr({ kind: "proportions", settings: v }, vf(v, S, U));
  }, Yo = () => {
    var T;
    if (!re || !Ze) {
      it(m("Check an FCS file and select a population first."));
      return;
    }
    const v = re.tree.root_population_id ?? "", S = Ze !== v ? Ze : ((T = ia(re.tree.populations, v).filter(({ popId: B }) => B !== v).at(-1)) == null ? void 0 : T.popId) ?? Ze;
    Dr(
      {
        kind: "strategy",
        sampleId: re.id,
        populationId: S,
        fullPath: !0,
        displayMode: "pseudocolor",
        ...ct.mode !== "off" ? { iterated: !0 } : {}
      },
      { width: 600, height: 320 }
    );
  }, Tc = () => {
    var G, $;
    if (!g) {
      it(m("Render or configure an Illustration selection first."));
      return;
    }
    if (!g.figure && g.plotType === "heatmap") {
      it(
        m("Heatmap layout blocks are planned for the next Layout phase.")
      );
      return;
    }
    const v = new Map(It.map((Y) => [Y.id, Y])), S = [], T = g.figure;
    for (const Y of It) {
      if (T) {
        if (!T.sampleIds.includes(Y.id)) continue;
        for (const Dt of T.plots)
          if (Dt.type !== "heatmap")
            for (const lt of Dt.population ? [Dt.population] : ((G = T.samplePopulations) == null ? void 0 : G[Y.id]) ?? T.populations) {
              const _t = Mr(
                lt,
                Y.tree,
                ur(f)
              );
              _t.id && _t.status !== "changed" && S.push({
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
        for (const lt of g.xChannels)
          S.push({ sampleId: Y.id, populationId: Dt, xChannel: lt });
    }
    const B = S.slice(0, 60);
    if (B.length === 0) {
      it(
        m("The current Illustration selection has no plot combinations.")
      );
      return;
    }
    Rt((Y) => {
      for (const st of B) {
        if (!v.get(st.sampleId)) continue;
        const lt = st.type ?? (g.plotType === "histogram" ? "histogram" : "biplot");
        Y.items.push({
          id: crypto.randomUUID(),
          ...ms(Y),
          recipe: {
            kind: lt,
            sampleId: st.sampleId,
            populationId: st.populationId,
            xChannel: st.xChannel,
            yChannel: lt === "histogram" ? null : st.yChannel ?? g.yChannel,
            displayMode: g.displayMode === "dots" ? "scatter" : g.displayMode
          }
        });
      }
    }), it(
      S.length > B.length ? m(
        "Added the first {count} Illustration plots; refine the selection before adding more.",
        {
          count: B.length
        }
      ) : m("Added {count} Illustration plots.", { count: B.length })
    );
  }, Ot = (v) => {
    ot && Rt((S) => {
      const T = S.items.find(({ id: B }) => B === ot.id);
      T && (T.recipe = v(T.recipe));
    });
  }, Fa = (v) => Ot((S) => {
    if (S.kind !== "biplot" && S.kind !== "histogram") return S;
    const T = v ? r.filter(($) => v.includes($.id)).map(($) => $.id) : [];
    if (!T.length) {
      const { pool: $, ...Y } = S;
      return Y;
    }
    const B = T.includes(S.sampleId) ? S.sampleId : T[0];
    let G = S.populationId;
    if (B !== S.sampleId) {
      const $ = It.find(({ id: st }) => st === S.sampleId), Y = It.find(({ id: st }) => st === B);
      $ && Y && (G = Mr({ hierarchyId: $.tree.id, populationId: G }, Y.tree, We).id ?? Y.tree.root_population_id ?? G);
    }
    return { ...S, sampleId: B, populationId: G, pool: { sampleIds: T } };
  }), Ic = rt.useMemo(() => {
    var $;
    const v = ot == null ? void 0 : ot.recipe;
    if (!v || !oe(v) || v.kind === "strategy" || !v.pool) return null;
    const S = Ae != null && Ae.templateSampleId ? ($ = It.find(({ id: Y }) => Y === Ae.templateSampleId)) == null ? void 0 : $.tree.id : void 0, { members: T, leftOut: B } = Hi(v, It, We, S), G = v.kind === "biplot" && v.yChannel && T.length > 1 ? nf(We, T.map((Y) => Y.tree.id), v.xChannel, v.yChannel).omitted.map((Y) => Y.name) : [];
    return { pooled: T.length, total: v.pool.sampleIds.length, leftOut: B, omittedGates: G };
  }, [ot, Ae, It, We]), Jr = (v) => {
    Rt((S) => {
      S.items = S.items.filter((T) => !v.includes(T.id));
    }), k((S) => S.filter((T) => !v.includes(T)));
  }, Qr = (v, S) => {
    const T = [];
    return Rt((B) => {
      let G = Math.max(0, ...B.items.map((Y) => Y.z));
      const $ = /* @__PURE__ */ new Map();
      for (const Y of v) {
        const st = B.items.find((te) => te.id === Y);
        if (!st) continue;
        const Dt = crypto.randomUUID();
        T.push(Dt);
        const lt = (S == null ? void 0 : S[Y]) ?? { x: st.x + 20, y: st.y + 20, width: st.width, height: st.height }, _t = st.group ? $.get(st.group) ?? crypto.randomUUID() : void 0;
        st.group && _t && $.set(st.group, _t), B.items.push({ ...st, ...lt, id: Dt, locked: !1, z: ++G, recipe: { ...st.recipe }, ..._t ? { group: _t } : {} });
      }
    }), T.length && Le(T), T;
  }, Rc = (v, S, T) => {
    Rt((B) => {
      for (const G of B.items)
        !v.includes(G.id) || G.locked || (G.x += S, G.y += T);
    });
  }, He = (v, S) => {
    Rt((T) => {
      const B = [...T.items].sort((st, Dt) => st.z - Dt.z), G = B.filter((st) => v.includes(st.id)), $ = B.filter((st) => !v.includes(st.id));
      let Y;
      if (S === "front") Y = [...$, ...G];
      else if (S === "back") Y = [...G, ...$];
      else {
        Y = B;
        const st = Y.map((Dt, lt) => lt);
        S === "forward" && st.reverse();
        for (const Dt of st) {
          const lt = S === "forward" ? Dt + 1 : Dt - 1;
          !v.includes(Y[Dt].id) || lt < 0 || lt >= Y.length || v.includes(Y[lt].id) || ([Y[Dt], Y[lt]] = [Y[lt], Y[Dt]]);
        }
      }
      Y.forEach((st, Dt) => {
        st.z = Dt;
      });
    });
  }, Pn = () => {
    Kr < 2 || Rt((v) => {
      kf(v, ae);
    });
  }, La = () => {
    pe.some((v) => v.group) && Rt((v) => gs(v, ae));
  }, Nn = (v, S) => {
    Rt((T) => {
      for (const B of T.items) v.includes(B.id) && (B.locked = S);
    });
  }, Oc = (v) => {
    Rt((S) => Tf(S, ae.filter((T) => {
      var B;
      return !((B = S.items.find((G) => G.id === T)) != null && B.locked);
    }), v));
  }, Pc = (v) => {
    Rt((S) => If(S, ae.filter((T) => {
      var B;
      return !((B = S.items.find((G) => G.id === T)) != null && B.locked);
    }), v));
  }, zn = (v, S) => {
    const T = {};
    for (const G of v) {
      const $ = G.dataset.itemId, Y = qt.items.find((lt) => lt.id === $);
      if (!Y) continue;
      const { id: st, ...Dt } = Vh(Y, hg(G));
      T[st] = Dt;
    }
    const B = Object.keys(T);
    if (B.length) {
      if (S) {
        for (const G of v) {
          const $ = qt.items.find((Y) => Y.id === G.dataset.itemId);
          $ && Object.assign(G.style, { left: `${$.x}px`, top: `${$.y}px`, width: `${$.width}px`, height: `${$.height}px` });
        }
        Qr(B, T);
        return;
      }
      Rt((G) => {
        for (const $ of G.items) T[$.id] && Object.assign($, T[$.id]);
      });
    }
  }, Xo = (v) => v.flatMap((S) => {
    if (!(S instanceof HTMLElement) || !S.parentElement) return [];
    const T = S.cloneNode(!0);
    T.classList.add("gl-layout-ghost"), T.classList.remove("is-selected"), T.removeAttribute("data-item-id"), T.setAttribute("aria-hidden", "true");
    const B = S.querySelectorAll("canvas");
    return T.querySelectorAll("canvas").forEach((G, $) => {
      var st;
      const Y = B[$];
      Y && (G.width = Y.width, G.height = Y.height, (st = G.getContext("2d")) == null || st.drawImage(Y, 0, 0));
    }), S.parentElement.insertBefore(T, S), [T];
  }), An = (v) => {
    if (Array.isArray(v)) for (const S of v) S.remove();
  }, Wa = (v) => {
    for (const S of v) {
      const T = qt.items.find((B) => B.id === S.dataset.itemId);
      T && Object.assign(S.style, { left: `${T.x}px`, top: `${T.y}px`, width: `${T.width}px`, height: `${T.height}px` });
    }
  }, Ho = rt.useRef(Wa);
  Ho.current = Wa;
  const Je = rt.useRef(null), jn = (v, S) => {
    const T = { targets: v, ghosts: S, cancelled: !1 };
    Je.current = T;
    const B = () => {
      window.removeEventListener("mouseup", B, !0), window.removeEventListener("touchend", B, !0), window.setTimeout(() => {
        Je.current === T && (Je.current = null, An(T.ghosts));
      }, 0);
    };
    window.addEventListener("mouseup", B, !0), window.addEventListener("touchend", B, !0);
  }, Bn = (v, S, T, B) => {
    const G = Je.current;
    Je.current = null, An(G == null ? void 0 : G.ghosts);
    const $ = S == null ? void 0 : S.dist, Y = !$ || Math.hypot($[0] ?? 0, $[1] ?? 0) >= 3;
    G != null && G.cancelled || !T || !Y ? Wa(v) : B();
  }, $o = (v) => {
    var G;
    v.target.style.left = `${v.left}px`, v.target.style.top = `${v.top}px`;
    const S = (G = v.datas) == null ? void 0 : G.companions;
    if (!(S != null && S.length)) return;
    const T = v.left - v.datas.startLeft, B = v.top - v.datas.startTop;
    for (const { el: $, left: Y, top: st } of S)
      $.style.left = `${Y + T}px`, $.style.top = `${st + B}px`;
  }, qo = (v) => {
    var T;
    const S = (T = v.datas) == null ? void 0 : T.companions;
    return [v.target, ...(S ?? []).map(({ el: B }) => B)];
  }, Nc = (v) => {
    var G;
    v.datas.alt = !!((G = v.inputEvent) != null && G.altKey);
    const S = v.target, T = Zr ? Bo.current.filter(($) => $ !== S) : [];
    v.datas.startLeft = parseFloat(S.style.left) || 0, v.datas.startTop = parseFloat(S.style.top) || 0, v.datas.companions = T.map(($) => ({ el: $, left: parseFloat($.style.left) || 0, top: parseFloat($.style.top) || 0 }));
    const B = qo(v);
    jn(B, v.datas.alt ? Xo(B) : void 0);
  }, Vo = (v) => {
    v.target.style.width = `${v.width}px`, v.target.style.height = `${v.height}px`, v.target.style.left = `${v.drag.left}px`, v.target.style.top = `${v.drag.top}px`;
  }, zc = (v) => {
    var B;
    const S = (B = v.inputEvent) == null ? void 0 : B.target;
    if (!S) return;
    const T = tt.current;
    if (T != null && T.isMoveableElement(S)) {
      v.stop();
      return;
    }
    if (Xe.some((G) => G === S || G.contains(S)) && (v.stop(), Xe.length > 1 && !Zr)) {
      T == null || T.dragStart(v.inputEvent);
      const G = v.inputEvent, $ = (Y) => {
        var st;
        window.removeEventListener("mouseup", $), Math.hypot(Y.clientX - G.clientX, Y.clientY - G.clientY) < 4 && ((st = K.current) == null || st.clickTarget(G, S));
      };
      window.addEventListener("mouseup", $);
    }
  }, Ac = (v) => {
    var G, $, Y;
    const S = v.isClick || v.isDragStart, T = new Set((v.removed ?? []).map((st) => Tn(st.dataset.itemId ?? "")).filter(Boolean)), B = Ao(
      v.selected.map((st) => st.dataset.itemId ?? "").filter((st) => st && (S || !In.has(Ur(st))))
    ).filter((st) => !T.has(Tn(st)));
    if (Le(B), v.isDragStart && !v.isClick) {
      if (!B.filter((lt) => !In.has(Ur(lt)) && lt !== z).length) return;
      ($ = (G = v.inputEvent) == null ? void 0 : G.preventDefault) == null || $.call(G), Rn.current = !0;
      const Dt = () => {
        Rn.current = !1;
      };
      window.setTimeout(() => window.addEventListener("mousedown", Dt, { capture: !0, once: !0 }), 0), (Y = tt.current) == null || Y.waitToChangeTarget().then(() => {
        var lt;
        return (lt = tt.current) == null ? void 0 : lt.dragStart(v.inputEvent);
      });
    }
  }, jc = (v) => {
    window.requestAnimationFrame(() => {
      var S, T, B;
      (B = (T = (S = Cr.current) == null ? void 0 : S.querySelector(`[data-item-id="${v}"]`)) == null ? void 0 : T.scrollIntoView) == null || B.call(T, { block: "nearest", inline: "nearest" });
    });
  }, lr = (v) => {
    Rt((S) => xf(S, v));
  }, Bc = () => Rt((v) => yf(v)), Gc = () => Rt((v) => bf(v)), Uo = (() => {
    const v = [], S = [];
    if (!U) return { vertical: v, horizontal: S };
    const T = pi(U.page), B = cs(U.page.marginMm);
    for (const G of la(U.page))
      v.push(G.x, G.x + B, G.x + T.width / 2, G.x + T.width - B, G.x + T.width), S.push(G.y, G.y + B, G.y + T.height / 2, G.y + T.height - B, G.y + T.height);
    return { vertical: [...new Set(v)], horizontal: [...new Set(S)] };
  })(), Ko = () => {
    const v = ge.current;
    if (!v || !U) return;
    const S = { width: v.clientWidth - 36, height: v.clientHeight - 36 };
    if (S.width <= 0 || S.height <= 0) return;
    const T = Math.min(S.width / U.width, S.height / U.height);
    Mt(Math.max(0.1, Math.min(4, Math.floor(T * 100) / 100)));
  };
  rt.useEffect(() => {
    const v = X;
    if (!v) return;
    const S = (T) => {
      if (!(T.altKey || T.shiftKey || T.ctrlKey)) return;
      const B = T.deltaY || T.deltaX;
      if (!B) return;
      T.preventDefault();
      const G = Ct.current, $ = Math.max(0.1, Math.min(4, Math.round(G * Math.exp(-B * 25e-4) * 100) / 100));
      if ($ === G) return;
      Ct.current = $, Mt($);
      const Y = v.getBoundingClientRect(), st = T.clientX - Y.left, Dt = T.clientY - Y.top, lt = $ / G, _t = (v.scrollLeft + st) * lt - st, te = (v.scrollTop + Dt) * lt - Dt;
      requestAnimationFrame(() => {
        v.scrollLeft = _t, v.scrollTop = te;
      });
    };
    return v.addEventListener("wheel", S, { passive: !1 }), () => v.removeEventListener("wheel", S);
  }, [X]);
  const Zo = (v) => {
    const S = v > 0 ? en.find((T) => T > gt + 1e-3) : [...en].reverse().find((T) => T < gt - 1e-3);
    S && Mt(S);
  }, Fc = () => new Promise((v) => {
    window.setTimeout(() => window.requestAnimationFrame(() => window.requestAnimationFrame(() => v())), 450);
  }), Jo = async () => {
    const v = Cr.current;
    if (!v || !U || zt) return;
    Me(!0);
    const S = ze;
    try {
      const T = [];
      for (let B = 0; B < ie.length; B++)
        ie.length > 1 && (Ne(B), await Fc()), T.push(...zh(v, U, { zoom: gt }));
      await Ah(T, U, $t), M == null || M();
    } catch (T) {
      it(T instanceof Error ? T.message : String(T));
    } finally {
      ie.length > 1 && Ne(S), Me(!1);
    }
  }, $e = (v) => {
    Rt((S) => {
      var T;
      if (v.mode === "off") {
        delete S.iteration;
        return;
      }
      if ((((T = S.iteration) == null ? void 0 : T.mode) ?? "off") === "off" && !S.items.some(gc))
        for (const B of S.items) oe(B.recipe) && (B.recipe.iterated = !0);
      S.iteration = v;
    }), Ne(0);
  }, Lc = (v) => [...new Set(r.map((S) => {
    var T;
    return ((T = S.metadata) == null ? void 0 : T[v]) ?? "";
  }).filter(Boolean))], Wc = ct.source.kind === "group" ? `group:${ct.source.groupId}` : ct.source.kind === "metadata" ? `meta:${ct.source.column}=${ct.source.value}` : ct.source.kind, Yc = (v) => {
    if (v === "all") return { kind: "all" };
    if (v.startsWith("group:")) return { kind: "group", groupId: v.slice(6) };
    if (v.startsWith("meta:")) {
      const [S, ...T] = v.slice(5).split("=");
      return { kind: "metadata", column: S, value: T.join("=") };
    }
    return { kind: "checked" };
  }, Xc = (v) => {
    const S = ps(v.nativeEvent);
    if (S) {
      v.preventDefault(), S === "undo" ? Gn() : Fn();
      return;
    }
    if (v.target.closest("input, textarea, select")) return;
    const T = v.metaKey || v.ctrlKey;
    if (v.key === "Escape") {
      k([]);
      return;
    }
    if (T && v.key.toLowerCase() === "a") {
      v.preventDefault(), Le(((U == null ? void 0 : U.items) ?? []).filter((Y) => !Y.locked).map((Y) => Y.id));
      return;
    }
    if (!I.length) return;
    if (v.key === "Enter" && I.length === 1) {
      const Y = qt.items.find((st) => st.id === I[0]);
      if ((Y == null ? void 0 : Y.recipe.kind) === "text") {
        v.preventDefault(), P(Y.id);
        return;
      }
    }
    if (v.key === "Delete" || v.key === "Backspace") {
      v.preventDefault(), Jr(ae);
      return;
    }
    if (T && v.key.toLowerCase() === "d") {
      v.preventDefault(), Qr(ae);
      return;
    }
    if (T && (v.key === "]" || v.key === "[")) {
      v.preventDefault(), He(ae, v.key === "]" ? v.shiftKey ? "front" : "forward" : v.shiftKey ? "back" : "backward");
      return;
    }
    if (T && v.key.toLowerCase() === "g") {
      v.preventDefault(), v.shiftKey ? La() : Pn();
      return;
    }
    if (T && v.shiftKey && v.key.toLowerCase() === "l") {
      v.preventDefault(), Nn(ae, !za);
      return;
    }
    const B = v.shiftKey ? 10 : 1, $ = {
      ArrowLeft: [-B, 0],
      ArrowRight: [B, 0],
      ArrowUp: [0, -B],
      ArrowDown: [0, B]
    }[v.key];
    $ && (v.preventDefault(), Rc(ae, $[0], $[1]));
  }, Ya = ot == null ? void 0 : ot.recipe, Bt = Ya && "sampleId" in Ya ? It.find(({ id: v }) => v === Ya.sampleId) ?? null : null, Qo = Bt ? Bt.sample.channels.map((v) => ({
    value: v.key,
    label: Bt.sample.channelLabel(Bt.sample.index(v.key) ?? 0)
  })) : [], ts = Bt ? ia(
    Bt.tree.populations,
    Bt.tree.root_population_id ?? ""
  ) : [], Gn = () => {
    const v = Ke.current.shift();
    v && (sr.current = [
      Ln(t),
      ...sr.current
    ].slice(0, 30), Aa(v, !1));
  }, Fn = () => {
    const v = sr.current.shift();
    v && (Ke.current = [
      Ln(t),
      ...Ke.current
    ].slice(0, 30), Aa(v, !1));
  }, Xa = rt.useRef({ undo: Gn, redo: Fn });
  return Xa.current = { undo: Gn, redo: Fn }, rt.useEffect(() => {
    const v = (T) => {
      var G, $;
      if (T.key === "Escape" && Je.current) {
        const Y = Je.current;
        Y.cancelled = !0, T.preventDefault(), T.stopPropagation(), Ho.current(Y.targets), An(Y.ghosts), Y.ghosts = void 0, vg(tt.current);
        return;
      }
      const B = ps(T);
      B && (($ = (G = T.target) == null ? void 0 : G.closest) != null && $.call(G, "input, textarea, select, [contenteditable='true']") || (T.preventDefault(), T.stopPropagation(), B === "undo" ? Xa.current.undo() : Xa.current.redo()));
    }, S = () => {
      const T = Je.current;
      T && (An(T.ghosts), T.ghosts = void 0);
    };
    return window.addEventListener("keydown", v, !0), window.addEventListener("blur", S), () => {
      window.removeEventListener("keydown", v, !0), window.removeEventListener("blur", S);
    };
  }, []), U ? /* @__PURE__ */ C.jsxs(
    "div",
    {
      className: `gl-tab-panel gl-tab-fill gl-layout-tab${Et ? " is-preview" : ""}`,
      children: [
        /* @__PURE__ */ C.jsxs(
          "div",
          {
            className: "gl-layout-sheet-tabs",
            role: "tablist",
            "aria-label": m("Layout sheets"),
            children: [
              t.sheets.map((v) => /* @__PURE__ */ C.jsx("div", { className: "gl-layout-sheet-tab-wrap", children: nt === v.id ? /* @__PURE__ */ C.jsx(
                "input",
                {
                  className: "gl-layout-sheet-rename",
                  defaultValue: v.name,
                  autoFocus: !0,
                  onFocus: (S) => S.currentTarget.select(),
                  onBlur: (S) => {
                    const T = S.currentTarget.value.trim();
                    T && wr((B) => {
                      const G = B.sheets.find(
                        ({ id: $ }) => $ === v.id
                      );
                      G && (G.name = T);
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
                  title: m("Double-click to rename"),
                  onClick: () => wr((S) => {
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
                  title: m("New blank layout"),
                  onClick: () => {
                    const v = af(
                      `Layout ${t.sheets.length + 1}`,
                      { ...U.page }
                    );
                    wr((S) => {
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
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => On("biplot"), disabled: !Lt, title: m(Lt ? "Add a plot of one population on two channels of the chosen file" : "Preparing the files…"), children: m("+ Biplot") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => On("histogram"), disabled: !Lt, title: m(Lt ? "Add a histogram of one population on one channel of the chosen file" : "Preparing the files…"), children: m("+ Histogram") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Yo, disabled: !Lt, title: m(Lt ? "Add the gating steps that lead to a population, as a strip of plots" : "Preparing the files…"), children: m("+ Gating strategy") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Go, disabled: !Lt, title: m(Lt ? "Add a summary chart: one statistic of a population per file, grouped by a metadata column, with a test between the groups" : "Preparing the files…"), children: m("+ Chart") }),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: m("Add a text block; edit it on the page"),
                    onClick: Fo,
                    children: m("+ Text")
                  }
                ),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Tc, disabled: !Lt, title: m("Add one plot per file and plot of the Illustration tab's current selection"), children: m("Add Illustration selection") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Lo, disabled: !Lt, title: m("Add the Illustration tab's current figure as one block, drawn here as it is there"), children: m("+ Illustration figure") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Wo, disabled: !Lt || !y, title: m("Add the Plotting tab's current chart as one block, drawn here as it is there"), children: m("+ Plotting chart") })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-arrange", role: "group", "aria-label": m("Arrange"), children: [
                dg.map(({ how: v, label: S, title: T }) => /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Oc(v), disabled: !I.length || Et, title: m(T), children: m(S) }, v)),
                pg.map(({ how: v, label: S, title: T }) => /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Pc(v), disabled: Kr < 3 || Et, title: m(T), children: m(S) }, v)),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": R, onClick: () => A((v) => !v), title: m("Snap moves and resizes to a 10 px grid; edges and centres of other items and the page snap always"), children: m("Snap grid") })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group", children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", "aria-pressed": Et, onClick: () => pt(!Et), title: m("Show the page as it exports, without grid, margins or handles"), children: m(Et ? "Edit layout" : "Preview") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !Ke.current.length, onClick: Gn, title: m("Undo the last layout edit (Cmd-Z)"), children: m("Undo") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", disabled: !sr.current.length, onClick: Fn, title: m("Redo the undone edit (Shift-Cmd-Z)"), children: m("Redo") }),
                /* @__PURE__ */ C.jsx(
                  "button",
                  {
                    className: "gl-mini-btn",
                    type: "button",
                    title: m("Copy this sheet, with its page and items, as a new sheet"),
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
                      wr((S) => {
                        S.sheets.push(v), S.activeSheetId = v.id;
                      }), k([]);
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
                      wr((v) => {
                        const S = v.sheets.findIndex(
                          ({ id: T }) => T === v.activeSheetId
                        );
                        v.sheets.splice(S, 1), v.activeSheetId = v.sheets[Math.max(0, S - 1)].id;
                      }), k([]);
                    },
                    children: m("Delete sheet")
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-zoom-controls", role: "group", "aria-label": m("Zoom"), children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: Ko, title: m("Fit the page to the window"), children: m("Fit") }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Zo(-1), "aria-label": m("Zoom out"), title: m("Zoom out"), disabled: gt <= en[0], children: "−" }),
                /* @__PURE__ */ C.jsxs("span", { className: "gl-layout-zoom-level", "aria-live": "polite", children: [
                  Math.round(gt * 100),
                  "%"
                ] }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Zo(1), "aria-label": m("Zoom in"), title: m("Zoom in"), disabled: gt >= en[en.length - 1], children: "+" })
              ] }),
              (ie.length > 1 || ct.mode !== "off") && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-toolbar-group gl-layout-pages", role: "group", "aria-label": m("Pages of the iteration"), children: [
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Ne(Math.max(0, ze - 1)), disabled: ze === 0, "aria-label": m("Previous page"), title: m("Previous page"), children: "◀" }),
                /* @__PURE__ */ C.jsxs("span", { className: "gl-layout-page-label", "aria-live": "polite", children: [
                  m("Page {n} of {count}", { n: ze + 1, count: Math.max(1, ie.length) }),
                  qt.units.length > 0 && ` · ${qt.units.map((v) => v.name).join(", ")}`
                ] }),
                /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => Ne(Math.min(ie.length - 1, ze + 1)), disabled: ze >= ie.length - 1, "aria-label": m("Next page"), title: m("Next page"), children: "▶" })
              ] }),
              /* @__PURE__ */ C.jsx("div", { className: "gl-layout-toolbar-group", children: /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void Jo(), disabled: zt || !U.items.length, title: ie.length > 1 ? m("Write every page of the iteration; the format is chosen under Page") : m("Write this sheet at its page size; the format is chosen under Page"), children: zt ? m("Exporting…") : m("Export {format}", { format: $t.toUpperCase() }) }) }),
              /* @__PURE__ */ C.jsx("span", { className: "gl-layout-performance-note", children: m("Plots follow the Gating tab's axes and gates; edit gates there.") })
            ]
          }
        ),
        at && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-message", role: "status", children: [
          /* @__PURE__ */ C.jsx("span", { children: at }),
          /* @__PURE__ */ C.jsx("button", { type: "button", title: m("Dismiss"), "aria-label": m("Dismiss"), onClick: () => it(null), children: "×" })
        ] }),
        /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-workspace", children: [
          /* @__PURE__ */ C.jsxs("aside", { className: "gl-layout-controls", "aria-label": "Layout controls", children: [
            /* @__PURE__ */ C.jsx("nav", { className: "gl-presentation-tabs", "aria-label": "Layout inspector", children: ["item", "page", "iterate", "style"].map((v) => /* @__PURE__ */ C.jsx(
              "button",
              {
                "aria-pressed": Z === v,
                title: m(v === "item" ? "The selected item, or the file new plots take" : v === "page" ? "Page size, margins, pages and export" : v === "iterate" ? "Draw the sheet once per file: which files, and pages or tiles" : "How the sheet's plots are drawn: points, contours, histograms, gates and fonts"),
                onClick: () => ut(v),
                children: m(v === "item" ? "Items" : v === "page" ? "Page" : v === "iterate" ? "Iterate" : "Style")
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
                    onChange: (v) => bt(v.target.value),
                    children: r.map((v) => /* @__PURE__ */ C.jsx("option", { value: v.id, children: v.name }, v.id))
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: "Placed plots keep their own file and hierarchy, independently of the Gating selection." }),
              de.error && /* @__PURE__ */ C.jsx("p", { role: "alert", children: de.error }),
              pe.length > 1 && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-inspector", "aria-label": m("Selected layout items"), children: [
                /* @__PURE__ */ C.jsx("strong", { children: wc ? m("{count} items selected, one group", { count: pe.length }) : m("{count} items selected", { count: pe.length }) }),
                /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                  Kr > 1 && /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Pn, title: m("One group: selected, moved, aligned and distributed together (Cmd-G)"), children: m("Group") }),
                  pe.some((v) => v.group) && /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: La, title: m("Dissolve the group; the items stay where they are (Shift-Cmd-G)"), children: m("Ungroup") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Qr(ae), title: m("Copies of every selected item, 20 px down and right (Cmd-D)"), children: m("Duplicate") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => He(ae, "front"), title: m("Draw the selected items over every other"), children: m("Bring to front") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => He(ae, "back"), title: m("Draw the selected items under every other"), children: m("Send to back") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Nn(ae, !za), title: m("Lock or unlock the selected items"), children: m(za ? "Unlock" : "Lock") }),
                  /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Jr(ae), title: m("Remove the selected items (Delete)"), children: m("Remove") })
                ] }),
                /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("Align and distribute them with the toolbar; drag any of them to move them together; Cmd-G makes them one group.") })
              ] }),
              !pe.length && /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("Click an item to select it, drag empty page to select several, Shift-click to add or remove. Drag to move, Shift holds the direction; drag a corner handle or an edge to resize, Shift keeps the proportions, Option resizes from the centre; Cmd turns snapping off; Option-drag copies. Delete removes, arrows nudge (Shift: 10 px), Cmd-D duplicates, Cmd-A selects all, Cmd-] and Cmd-[ bring forward and send backward (Shift: to the front or back), Cmd-G groups and Shift-Cmd-G ungroups, Shift-Cmd-L locks, Cmd-Z undoes.") }),
              ot && /* @__PURE__ */ C.jsxs(
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
                          checked: ot.showFrame === !0,
                          onChange: (v) => Rt((S) => {
                            const T = S.items.find(
                              (B) => B.id === ot.id
                            );
                            T && (T.showFrame = v.target.checked);
                          })
                        }
                      ),
                      "Surrounding frame"
                    ] }),
                    /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Qr([ot.id]), title: m("A copy 20 px down and right (Cmd-D); Option-drag an item to copy it where you drop it"), children: m("Duplicate") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => He([ot.id], "front"), title: m("Draw this item over every other"), children: m("Bring to front") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => He([ot.id], "back"), title: m("Draw this item under every other"), children: m("Send to back") }),
                      /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: () => Jr([ot.id]), title: m("Remove this item from the page (Delete)"), children: m("Remove") })
                    ] }),
                    /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: m("A locked item keeps its place and size; it can still be selected to unlock it"), children: [
                      /* @__PURE__ */ C.jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: ot.locked === !0,
                          onChange: (v) => Nn([ot.id], v.target.checked)
                        }
                      ),
                      m("Locked")
                    ] }),
                    /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["x", "y", "width", "height"].map((v) => /* @__PURE__ */ C.jsxs("label", { children: [
                      ug[v],
                      /* @__PURE__ */ C.jsx(
                        ke,
                        {
                          "aria-label": `Item ${v}`,
                          min: v === "width" || v === "height" ? of(ot.recipe.kind)[v] : 0,
                          integer: !0,
                          value: ot[v],
                          onCommit: (S) => Rt((T) => {
                            const B = T.items.find(
                              (G) => G.id === ot.id
                            );
                            B && (B[v] = S);
                          })
                        }
                      )
                    ] }, v)) }),
                    ot.recipe.kind === "text" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Text"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            value: ot.recipe.text,
                            onChange: (v) => Ot(
                              (S) => S.kind === "text" ? { ...S, text: v.target.value } : S
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
                            value: ot.recipe.readsFrom ?? "",
                            onChange: (v) => Ot((S) => {
                              if (S.kind !== "text") return S;
                              const T = { ...S };
                              return v.target.value ? T.readsFrom = v.target.value : delete T.readsFrom, T;
                            }),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: m("Nothing: plain text") }),
                              U.items.filter((v) => oe(v.recipe)).map((v) => /* @__PURE__ */ C.jsx("option", { value: v.id, children: qe(v, It) }, v.id))
                            ]
                          }
                        )
                      ] }),
                      ot.recipe.readsFrom && /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("The placeholders read that plot: {list}. On an iterated sheet they follow it from tile to tile.", { list: si }) }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Font"),
                        /* @__PURE__ */ C.jsx(
                          ke,
                          {
                            min: 8,
                            max: 72,
                            integer: !0,
                            value: ot.recipe.fontSize,
                            onCommit: (v) => Ot(
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
                            onChange: (v) => Ot((S) => {
                              if (S.kind !== "text") return S;
                              const T = { ...S };
                              return v.target.checked ? T.bold = !0 : delete T.bold, T;
                            })
                          }
                        ),
                        m("Bold")
                      ] })
                    ] }) : ot.recipe.kind === "figure" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("An Illustration figure, drawn here as it is there. To change it, edit it on the Illustration tab and put it back with the button below.") }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Figure page"),
                        /* @__PURE__ */ C.jsx(
                          ke,
                          {
                            "aria-label": m("Figure page"),
                            value: ot.recipe.page + 1,
                            min: 1,
                            integer: !0,
                            onCommit: (v) => Ot((S) => S.kind === "figure" ? { ...S, page: Math.max(0, v - 1) } : S)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: qe(ot, It),
                            value: ot.recipe.title ?? "",
                            onChange: (v) => Ot((S) => S.kind === "figure" ? { ...S, title: v.target.value } : S)
                          }
                        )
                      ] }),
                      x && /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: m("Load this figure into the Illustration tab"),
                          onClick: () => x(structuredClone(ot.recipe.illustration)),
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
                          onClick: () => Ot(
                            (v) => v.kind === "figure" && g ? { ...v, illustration: structuredClone(g) } : v
                          ),
                          children: m("Replace with the current Illustration figure")
                        }
                      )
                    ] }) : ot.recipe.kind === "proportions" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("A Plotting chart, drawn here as it is there. To change it, edit it on the Plotting tab and put it back with the button below.") }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: qe(ot, It),
                            value: ot.recipe.title ?? "",
                            onChange: (v) => Ot((S) => S.kind === "proportions" ? { ...S, title: v.target.value } : S)
                          }
                        )
                      ] }),
                      w && /* @__PURE__ */ C.jsx(
                        "button",
                        {
                          type: "button",
                          className: "gl-mini-btn",
                          title: m("Load this chart's settings into the Plotting tab"),
                          onClick: () => w(structuredClone(ot.recipe.settings)),
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
                            const v = y == null ? void 0 : y();
                            v && Ot((S) => S.kind === "proportions" ? { ...S, settings: v } : S);
                          },
                          children: m("Replace with the current Plotting chart")
                        }
                      )
                    ] }) : ot.recipe.kind === "chart" ? /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Population"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: ot.recipe.populationId,
                            onChange: (v) => Ot((S) => S.kind === "chart" ? { ...S, populationId: v.target.value } : S),
                            children: ts.map(({ popId: v, depth: S }) => {
                              var T;
                              return /* @__PURE__ */ C.jsxs("option", { value: v, children: [
                                " ".repeat(S * 2),
                                ((T = Bt == null ? void 0 : Bt.tree.populations[v]) == null ? void 0 : T.name) ?? v
                              ] }, v);
                            })
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Statistic"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: ot.recipe.statistic,
                            onChange: (v) => Ot((S) => {
                              var G;
                              if (S.kind !== "chart") return S;
                              const T = v.target.value, B = T === "median" && !S.channel ? (G = Bt == null ? void 0 : Bt.sample.channels[0]) == null ? void 0 : G.key : S.channel;
                              return { ...S, statistic: T, ...B ? { channel: B } : {} };
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
                      ot.recipe.statistic === "median" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Channel"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: ot.recipe.channel ?? "",
                            onChange: (v) => Ot((S) => S.kind === "chart" ? { ...S, channel: v.target.value } : S),
                            children: ((Bt == null ? void 0 : Bt.sample.channels) ?? []).map((v) => /* @__PURE__ */ C.jsx("option", { value: v.key, children: (Bt == null ? void 0 : Bt.sample.labelForKey(v.key)) ?? v.key }, v.key))
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Files"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: ot.recipe.files,
                            onChange: (v) => Ot((S) => S.kind === "chart" ? { ...S, files: v.target.value === "all" ? "all" : "checked" } : S),
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
                            value: ot.recipe.groupBy,
                            onChange: (v) => Ot((S) => S.kind === "chart" ? { ...S, groupBy: v.target.value } : S),
                            children: [
                              /* @__PURE__ */ C.jsx("option", { value: "", children: m("Each file") }),
                              o.map((v) => /* @__PURE__ */ C.jsx("option", { value: v, children: v }, v))
                            ]
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Chart"),
                        /* @__PURE__ */ C.jsxs(
                          "select",
                          {
                            value: ot.recipe.chartType,
                            onChange: (v) => Ot((S) => S.kind === "chart" ? { ...S, chartType: v.target.value } : S),
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
                            checked: ot.recipe.showPoints,
                            onChange: (v) => Ot((S) => S.kind === "chart" ? { ...S, showPoints: v.target.checked } : S)
                          }
                        ),
                        m("Show each file as a point")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: m("Wilcoxon rank-sum between two groups, Kruskal–Wallis among more; every group needs two files"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ot.recipe.test,
                            onChange: (v) => Ot((S) => S.kind === "chart" ? { ...S, test: v.target.checked } : S)
                          }
                        ),
                        m("Test between groups")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                        m("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: qe(ot, It),
                            value: ot.recipe.title ?? "",
                            onChange: (v) => Ot((S) => S.kind === "chart" ? { ...S, title: v.target.value } : S)
                          }
                        )
                      ] })
                    ] }) : /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                      !vn(ot.recipe) && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("FCS"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: ot.recipe.sampleId,
                            onChange: (v) => Ot((S) => {
                              if (S.kind === "text" || S.kind === "figure" || S.kind === "proportions") return S;
                              const T = It.find(
                                (G) => G.id === v.target.value
                              );
                              if (!T) return S;
                              const B = Bt && Mr(
                                {
                                  hierarchyId: Bt.tree.id,
                                  populationId: S.populationId
                                },
                                T.tree,
                                ur(f)
                              );
                              return {
                                ...S,
                                sampleId: T.id,
                                populationId: (B == null ? void 0 : B.id) ?? T.tree.root_population_id ?? ""
                              };
                            }),
                            children: It.map((v) => /* @__PURE__ */ C.jsx("option", { value: v.id, children: v.name }, v.id))
                          }
                        )
                      ] }),
                      (ot.recipe.kind === "biplot" || ot.recipe.kind === "histogram") && /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: m("Draw the events of several files on this plot, as the Gating tab pools the checked files; a gate is drawn where every pooled file has it alike, with the pooled percentage"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: !!ot.recipe.pool,
                            onChange: (v) => {
                              if (!v.target.checked) {
                                Fa(null);
                                return;
                              }
                              const S = ot.recipe.kind === "biplot" || ot.recipe.kind === "histogram" ? ot.recipe.sampleId : "";
                              Fa(n.includes(S) ? n : [S]);
                            }
                          }
                        ),
                        m("Pool files")
                      ] }),
                      (ot.recipe.kind === "biplot" || ot.recipe.kind === "histogram") && ot.recipe.pool && /* @__PURE__ */ C.jsx(
                        mg,
                        {
                          files: r,
                          pool: ot.recipe.pool.sampleIds,
                          checkedSampleIds: n,
                          groups: a,
                          fileGroups: i,
                          report: Ic,
                          onChange: Fa
                        }
                      ),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                        m("Population"),
                        /* @__PURE__ */ C.jsx(
                          "select",
                          {
                            value: ot.recipe.populationId,
                            onChange: (v) => Ot(
                              (S) => S.kind === "text" ? S : {
                                ...S,
                                populationId: v.target.value
                              }
                            ),
                            children: ts.map(({ popId: v, depth: S }) => {
                              var T;
                              return /* @__PURE__ */ C.jsxs("option", { value: v, children: [
                                " ".repeat(S * 2),
                                ((T = Bt == null ? void 0 : Bt.tree.populations[v]) == null ? void 0 : T.name) ?? v
                              ] }, v);
                            })
                          }
                        )
                      ] }),
                      ot.recipe.kind !== "strategy" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                        /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                          "X",
                          /* @__PURE__ */ C.jsx(
                            fs,
                            {
                              label: m("X channel"),
                              value: ot.recipe.xChannel,
                              options: Qo,
                              onChange: (v) => Ot(
                                (S) => S.kind === "biplot" || S.kind === "histogram" ? { ...S, xChannel: v } : S
                              )
                            }
                          )
                        ] }),
                        ot.recipe.kind === "biplot" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                          "Y",
                          /* @__PURE__ */ C.jsx(
                            fs,
                            {
                              label: m("Y channel"),
                              value: ot.recipe.yChannel ?? "",
                              options: Qo,
                              onChange: (v) => Ot(
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
                            onChange: (v) => Ot(
                              (S) => S.kind === "strategy" ? {
                                ...S,
                                fullPath: v.target.checked
                              } : S
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
                            value: ot.recipe.displayMode,
                            onChange: (v) => Ot(
                              (S) => S.kind === "text" ? S : {
                                ...S,
                                displayMode: v.target.value
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
                      ct.mode !== "off" && /* @__PURE__ */ C.jsxs("label", { className: "gl-check", title: ct.mode === "populations" ? m("Drawn once per population of the iteration, for that population; unticked, it shows its own population on every page") : ct.mode === "metadata" ? m("Drawn once per value of {column}, pooling that value's files; unticked, it shows its own files on every page", { column: ct.column ?? "" }) : m("Drawn once per file of the iteration, for that file; unticked, it shows this file on every page"), children: [
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            type: "checkbox",
                            checked: ot.recipe.iterated === !0,
                            onChange: (v) => Ot(
                              (S) => S.kind === "text" ? S : { ...S, iterated: v.target.checked }
                            )
                          }
                        ),
                        m("Follows the iteration")
                      ] }),
                      /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", title: m("Empty: the sheet's title template, under Style. Placeholders: {list}", { list: si }), children: [
                        m("Title"),
                        /* @__PURE__ */ C.jsx(
                          "input",
                          {
                            placeholder: Dc || qe(ot, It),
                            value: ot.recipe.title ?? "",
                            onChange: (v) => Ot(
                              (S) => S.kind === "text" ? S : { ...S, title: v.target.value }
                            )
                          }
                        )
                      ] }),
                      /* @__PURE__ */ C.jsxs("details", { className: "gl-layout-item-style", children: [
                        /* @__PURE__ */ C.jsxs("summary", { children: [
                          m("Style"),
                          Object.keys(ot.recipe.style ?? {}).length > 0 ? ` · ${m("Own style")}` : ""
                        ] }),
                        /* @__PURE__ */ C.jsx(
                          bl,
                          {
                            effective: $a(U, ot.recipe),
                            own: ot.recipe.style ?? {},
                            onChange: (v) => Ot(
                              (S) => oe(S) ? { ...S, style: ys({ ...S.style, ...v }) } : S
                            )
                          }
                        ),
                        Object.keys(ot.recipe.style ?? {}).length > 0 && /* @__PURE__ */ C.jsx(
                          "button",
                          {
                            type: "button",
                            className: "gl-mini-btn",
                            title: m("Drop this item's own values; it then follows the sheet's style"),
                            onClick: () => Ot((v) => {
                              if (!oe(v)) return v;
                              const { style: S, ...T } = v;
                              return T;
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
                          onClick: () => D(
                            ot.recipe
                          ),
                          children: m("Open in Gating")
                        }
                      )
                    ] })
                  ]
                }
              )
            ] }),
            Z === "page" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: m("Page") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Size"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    value: U.page.preset,
                    onChange: (v) => lr(lf(v.target.value, U.page.orientation, U.page)),
                    children: [
                      Object.entries(sf).map(([v, S]) => /* @__PURE__ */ C.jsx("option", { value: v, children: S.label }, v)),
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
                    onChange: (v) => lr({ ...U.page, orientation: v.target.value }),
                    children: [
                      /* @__PURE__ */ C.jsx("option", { value: "portrait", children: m("Portrait") }),
                      /* @__PURE__ */ C.jsx("option", { value: "landscape", children: m("Landscape") })
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["width", "height"].map((v) => /* @__PURE__ */ C.jsxs("label", { children: [
                m(v === "width" ? "Width (mm)" : "Height (mm)"),
                /* @__PURE__ */ C.jsx(
                  ke,
                  {
                    min: 40,
                    max: 2e3,
                    step: 1,
                    "aria-label": m(v === "width" ? "Width (mm)" : "Height (mm)"),
                    value: $i(U.page)[v === "width" ? "widthMm" : "heightMm"],
                    onCommit: (S) => {
                      const T = U.page.orientation === "landscape", B = v === "width" == !T ? "widthMm" : "heightMm";
                      lr({ ...U.page, preset: "custom", [B]: S });
                    }
                  }
                )
              ] }, v)) }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Margin (mm)"),
                /* @__PURE__ */ C.jsx(
                  ke,
                  {
                    min: 0,
                    max: 100,
                    step: 1,
                    value: U.page.marginMm,
                    onCommit: (v) => lr({ ...U.page, marginMm: v })
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-dimensions", children: [
                /* @__PURE__ */ C.jsxs("label", { children: [
                  m("Pages across"),
                  /* @__PURE__ */ C.jsx(ke, { min: 1, max: ds, step: 1, integer: !0, "aria-label": m("Pages across"), value: U.page.columns, onCommit: (v) => lr({ ...U.page, columns: v }) })
                ] }),
                /* @__PURE__ */ C.jsxs("label", { children: [
                  m("Pages down"),
                  /* @__PURE__ */ C.jsx(ke, { min: 1, max: ds, step: 1, integer: !0, "aria-label": m("Pages down"), value: U.page.rows, onCommit: (v) => lr({ ...U.page, rows: v }) })
                ] })
              ] }),
              /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-item-actions", children: [
                /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Bc, disabled: !U.items.length, title: m("Make the page a custom size that holds every item inside the margin, as one page"), children: m("Fit page to content") }),
                /* @__PURE__ */ C.jsx("button", { type: "button", className: "gl-mini-btn", onClick: Gc, disabled: !U.items.length, title: m("Scale and centre every item, as one group, to fill the first page inside its margin"), children: m("Fit content to page") })
              ] }),
              /* @__PURE__ */ C.jsx("h3", { children: m("Export") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Format"),
                /* @__PURE__ */ C.jsxs("select", { value: $t, onChange: (v) => Ft(v.target.value), children: [
                  /* @__PURE__ */ C.jsx("option", { value: "pdf", children: m("PDF · the page at its size") }),
                  /* @__PURE__ */ C.jsx("option", { value: "svg", children: m("SVG · vector axes, gates and text") }),
                  /* @__PURE__ */ C.jsx("option", { value: "png", children: m("PNG") })
                ] })
              ] }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Resolution (dpi)"),
                /* @__PURE__ */ C.jsx(
                  ke,
                  {
                    min: 72,
                    max: 1200,
                    step: 1,
                    integer: !0,
                    value: U.page.dpi,
                    onCommit: (v) => lr({ ...U.page, dpi: v })
                  }
                )
              ] }),
              /* @__PURE__ */ C.jsx("button", { className: "gl-mini-btn", type: "button", onClick: () => void Jo(), disabled: zt || !U.items.length, children: m(zt ? "Exporting…" : "Export sheet") }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("The export is the page at its physical size; a grid of pages is written as one PDF page each, or one SVG or PNG file each in a zip. The data layer is drawn at the resolution above and anything beyond the pages is cut off.") })
            ] }),
            Z === "iterate" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: m("Iterate") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Draw the sheet"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    value: ct.mode,
                    onChange: (v) => {
                      const S = v.target.value;
                      if (S === "metadata") {
                        const T = ct.column && o.includes(ct.column) ? ct.column : o[0] ?? "";
                        $e({ ...ct, mode: "metadata", column: T, source: ct.source.kind === "metadata" ? { kind: "checked" } : ct.source });
                        return;
                      }
                      $e({ ...ct, mode: S === "files" ? "files" : S === "populations" ? "populations" : "off" });
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
              ct.mode === "metadata" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Column"),
                /* @__PURE__ */ C.jsx("select", { value: ct.column ?? "", onChange: (v) => $e({ ...ct, column: v.target.value }), children: o.map((v) => /* @__PURE__ */ C.jsx("option", { value: v, children: v }, v)) })
              ] }),
              ct.mode !== "off" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                ct.mode === "populations" && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  m("Populations"),
                  /* @__PURE__ */ C.jsxs(
                    "select",
                    {
                      value: ((ns = ct.populations) == null ? void 0 : ns.kind) === "branch" ? ct.populations.populationId : "all",
                      onChange: (v) => $e({
                        ...ct,
                        populations: v.target.value === "all" ? { kind: "all" } : { kind: "branch", populationId: v.target.value }
                      }),
                      children: [
                        /* @__PURE__ */ C.jsx("option", { value: "all", children: m("All in the tree") }),
                        (yt ? ia(yt.tree.populations, yt.tree.root_population_id ?? "") : []).filter(({ popId: v }) => v !== (yt == null ? void 0 : yt.tree.root_population_id)).map(({ popId: v, depth: S }) => {
                          var T;
                          return /* @__PURE__ */ C.jsxs("option", { value: v, children: [
                            " ".repeat(S * 2),
                            m("Under {name}", { name: ((T = yt == null ? void 0 : yt.tree.populations[v]) == null ? void 0 : T.name) ?? v })
                          ] }, v);
                        })
                      ]
                    }
                  )
                ] }),
                (ct.mode === "files" || ct.mode === "metadata") && /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  m("Files"),
                  /* @__PURE__ */ C.jsxs("select", { value: Wc, onChange: (v) => $e({ ...ct, source: Yc(v.target.value) }), children: [
                    /* @__PURE__ */ C.jsx("option", { value: "checked", children: m("Checked files") }),
                    /* @__PURE__ */ C.jsx("option", { value: "all", children: m("All files") }),
                    a.map((v) => /* @__PURE__ */ C.jsx("option", { value: `group:${v.id}`, children: m("Group {name}", { name: v.name }) }, v.id)),
                    ct.mode === "files" && o.flatMap(
                      (v) => Lc(v).map((S) => /* @__PURE__ */ C.jsxs("option", { value: `meta:${v}=${S}`, children: [
                        v,
                        " = ",
                        S
                      ] }, `${v}=${S}`))
                    )
                  ] })
                ] }),
                /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                  m("Arrangement"),
                  /* @__PURE__ */ C.jsxs(
                    "select",
                    {
                      value: ct.arrangement.kind,
                      onChange: (v) => $e({
                        ...ct,
                        arrangement: v.target.value === "tiles" ? { kind: "tiles", rows: 2, columns: 2, order: "row-major", gap: 24 } : { kind: "page-per-unit" }
                      }),
                      children: [
                        /* @__PURE__ */ C.jsx("option", { value: "page-per-unit", children: ct.mode === "populations" ? m("One page per population") : ct.mode === "metadata" ? m("One page per value") : m("One page per file") }),
                        /* @__PURE__ */ C.jsx("option", { value: "tiles", children: m("Tiles on each page") })
                      ]
                    }
                  )
                ] }),
                ct.arrangement.kind === "tiles" && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
                  /* @__PURE__ */ C.jsx("div", { className: "gl-layout-dimensions", children: ["columns", "rows"].map((v) => /* @__PURE__ */ C.jsxs("label", { children: [
                    m(v === "columns" ? "Tiles across" : "Tiles down"),
                    /* @__PURE__ */ C.jsx(
                      ke,
                      {
                        min: 1,
                        max: 12,
                        step: 1,
                        integer: !0,
                        "aria-label": m(v === "columns" ? "Tiles across" : "Tiles down"),
                        value: ct.arrangement.kind === "tiles" ? ct.arrangement[v] : 1,
                        onCommit: (S) => {
                          ct.arrangement.kind === "tiles" && $e({ ...ct, arrangement: { ...ct.arrangement, [v]: S } });
                        }
                      }
                    )
                  ] }, v)) }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                    m("Order"),
                    /* @__PURE__ */ C.jsxs(
                      "select",
                      {
                        value: ct.arrangement.order,
                        onChange: (v) => ct.arrangement.kind === "tiles" && $e({ ...ct, arrangement: { ...ct.arrangement, order: v.target.value === "column-major" ? "column-major" : "row-major" } }),
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
                      ke,
                      {
                        min: 0,
                        max: 400,
                        step: 1,
                        integer: !0,
                        value: ct.arrangement.gap,
                        onCommit: (v) => {
                          ct.arrangement.kind === "tiles" && $e({ ...ct, arrangement: { ...ct.arrangement, gap: v } });
                        }
                      }
                    )
                  ] })
                ] }),
                /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: ct.mode === "populations" ? m("{units} populations of {of} → {pages} pages. Items marked “Follows the iteration” are drawn for each population; the others repeat. Text and titles may use {population}, {sample}, {file}, {n} and {N}.", { units: jt.length, of: (yt == null ? void 0 : yt.name) ?? "the file", pages: Math.max(1, ie.length) }) : ct.mode === "metadata" ? m("{values} values of {column} over {files} files → {pages} pages. Items marked “Follows the iteration” pool the files of each value; the others repeat. Text and titles may use {sample} (the value), {meta:column}, {file} (how many files), {n} and {N}; a plot title may also use {population} and {count}.", { values: jt.length, column: ct.column ?? "", files: jt.reduce((v, S) => {
                  var T;
                  return v + (((T = S.sampleIds) == null ? void 0 : T.length) ?? 0);
                }, 0), pages: Math.max(1, ie.length) }) : m("{files} files → {pages} pages. Items marked “Follows the iteration” are drawn for each file; the others repeat. Text and titles may use {sample}, {file}, {group}, {n}, {N} and {meta:column}; a plot title may also use {population} and {count}.", { files: jt.length, pages: Math.max(1, ie.length) }) })
              ] })
            ] }),
            Z === "style" && U && /* @__PURE__ */ C.jsxs(C.Fragment, { children: [
              /* @__PURE__ */ C.jsx("h3", { children: m("Style") }),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m("How this sheet's plots are drawn. A plot or strategy may set its own values under Items; the rest follow the sheet.") }),
              /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                m("Plot titles"),
                /* @__PURE__ */ C.jsxs(
                  "select",
                  {
                    "aria-label": m("Plot titles"),
                    value: Ro ? "custom" : ((as = aa.find((v) => v.template === (U.titleTemplate ?? ""))) == null ? void 0 : as.id) ?? "custom",
                    onChange: (v) => {
                      const S = aa.find((T) => T.id === v.target.value);
                      Sc(!S), Rt((T) => {
                        var B;
                        S ? S.template ? T.titleTemplate = S.template : delete T.titleTemplate : T.titleTemplate = ((B = T.titleTemplate) == null ? void 0 : B.trim()) || "{population} · {file}";
                      });
                    },
                    children: [
                      aa.map((v) => /* @__PURE__ */ C.jsx("option", { value: v.id, children: m(v.label) }, v.id)),
                      /* @__PURE__ */ C.jsx("option", { value: "custom", children: m("Custom template…") })
                    ]
                  }
                )
              ] }),
              (() => {
                const v = U.items.filter((S) => jo(S));
                return v.length ? /* @__PURE__ */ C.jsxs("p", { className: "gl-hint gl-title-builder-own", children: [
                  m("{count} plots keep a title of their own, so the template does not reach them.", { count: v.length }),
                  " ",
                  /* @__PURE__ */ C.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-mini-btn",
                      title: m("Drop those plots' own titles so every plot on the sheet follows the template"),
                      onClick: () => Rt((S) => {
                        for (const T of S.items) oe(T.recipe) && delete T.recipe.title;
                      }),
                      children: m("Use the template for all")
                    }
                  )
                ] }) : null;
              })(),
              (Ro || !aa.some((v) => v.template === (U.titleTemplate ?? ""))) && (() => {
                var Dt;
                const v = U.titleTemplate ?? "", S = Gh(v), T = (S == null ? void 0 : S.tokens) ?? [], B = (S == null ? void 0 : S.separator) ?? Cc, G = (lt) => {
                  var _t;
                  return ((_t = Po.find((te) => te.token === lt)) == null ? void 0 : _t.label) ?? lt;
                }, $ = (lt) => Rt((_t) => {
                  _t.titleTemplate = hl(lt, B);
                }), Y = qt.items.find((lt) => oe(lt.recipe)), st = Y && oe(Y.recipe) ? Ea(v, Ye(Y.recipe, Y.templateSampleId) ?? { population: "", file: "", sample: "", x: "", y: "" }) : "";
                return /* @__PURE__ */ C.jsxs("div", { className: "gl-title-builder", role: "group", "aria-label": m("Title builder"), children: [
                  /* @__PURE__ */ C.jsxs("div", { className: "gl-title-builder-chosen", "aria-label": m("Fields in the title"), children: [
                    T.length === 0 && /* @__PURE__ */ C.jsx("span", { className: "gl-hint", children: m(S === null && v ? "Written by hand; choosing a field below starts a built title." : "Choose the fields below, in the order they should read.") }),
                    T.map((lt, _t) => /* @__PURE__ */ C.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "gl-chip active",
                        "aria-label": m("Remove {field}", { field: G(lt) }),
                        title: m("Remove {field} from the title", { field: G(lt) }),
                        onClick: () => $(T.filter((te, be) => be !== _t)),
                        children: [
                          G(lt),
                          " ×"
                        ]
                      },
                      `${lt}-${_t}`
                    ))
                  ] }),
                  /* @__PURE__ */ C.jsx("div", { className: "gl-title-builder-fields", "aria-label": m("Fields to add"), children: Po.map((lt) => /* @__PURE__ */ C.jsx(
                    "button",
                    {
                      type: "button",
                      className: "gl-chip",
                      "aria-label": m("Add {field}", { field: lt.label }),
                      title: lt.token,
                      onClick: () => $([...T, lt.token]),
                      children: lt.label
                    },
                    lt.token
                  )) }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline", children: [
                    m("Between fields"),
                    /* @__PURE__ */ C.jsx(
                      "select",
                      {
                        "aria-label": m("Separator"),
                        value: ((Dt = li.find((lt) => lt.value === B)) == null ? void 0 : Dt.id) ?? "dot",
                        onChange: (lt) => {
                          var te;
                          const _t = ((te = li.find((be) => be.id === lt.target.value)) == null ? void 0 : te.value) ?? " · ";
                          Ec(_t), T.length && Rt((be) => {
                            be.titleTemplate = hl(T, _t);
                          });
                        },
                        children: li.map((lt) => /* @__PURE__ */ C.jsx("option", { value: lt.id, children: m(lt.label) }, lt.id))
                      }
                    )
                  ] }),
                  /* @__PURE__ */ C.jsxs("label", { className: "gl-field-inline gl-layout-title-field", children: [
                    m("Template"),
                    /* @__PURE__ */ C.jsx(
                      "input",
                      {
                        "aria-label": m("Title template"),
                        value: v,
                        onChange: (lt) => Rt((_t) => {
                          _t.titleTemplate = lt.target.value;
                        })
                      }
                    )
                  ] }),
                  st && /* @__PURE__ */ C.jsx("div", { className: "gl-hint gl-title-builder-preview", children: m("First plot reads: {title}", { title: st }) })
                ] });
              })(),
              /* @__PURE__ */ C.jsx("p", { className: "gl-hint", children: m(`What every plot is called unless it has a title of its own under Items. Placeholders: {list}. "What differs across the page" names the population when the page is one file's populations, the file when it is one population's files, both otherwise.`, { list: si }) }),
              /* @__PURE__ */ C.jsx(
                bl,
                {
                  effective: $a(U),
                  own: U.style ?? {},
                  onChange: (v) => Rt((S) => {
                    S.style = ys({ ...S.style, ...v });
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
                  children: m("Reset to defaults")
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ C.jsx(uf, { menu: _c, onClose: () => Ba(null) }),
          /* @__PURE__ */ C.jsxs(
            "div",
            {
              ref: (v) => {
                ge.current = v, L(v);
              },
              className: "gl-layout-canvas-scroll",
              tabIndex: 0,
              "aria-label": m("Layout page"),
              onKeyDown: Xc,
              children: [
                !Et && X && /* @__PURE__ */ C.jsx(
                  Oh,
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
                      var S, T, B;
                      return !((B = (T = (S = v.inputEvent) == null ? void 0 : S.target) == null ? void 0 : T.closest) != null && B.call(T, "textarea, input, select, button"));
                    },
                    onDragStart: zc,
                    onSelectEnd: Ac
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
                          Cr.current = v, W(v);
                        },
                        className: "gl-layout-canvas",
                        "aria-label": U.name,
                        onContextMenu: kc,
                        style: { width: U.width, height: U.height, transform: `scale(${gt})` },
                        children: [
                          la(U.page).map((v) => {
                            const S = pi(U.page), T = cs(U.page.marginMm);
                            return /* @__PURE__ */ C.jsx("div", { className: "gl-layout-page", "aria-hidden": "true", style: { left: v.x, top: v.y, width: S.width, height: S.height }, children: T > 0 && /* @__PURE__ */ C.jsx("div", { className: "gl-layout-page-margin", style: { inset: T } }) }, `${v.row}-${v.column}`);
                          }),
                          qt.items.length === 0 && /* @__PURE__ */ C.jsxs("div", { className: "gl-layout-empty", children: [
                            /* @__PURE__ */ C.jsx("strong", { children: m("Blank layout") }),
                            /* @__PURE__ */ C.jsx("span", { children: m(
                              "Add a plot, gating strategy, text, or the current Illustration selection."
                            ) })
                          ] }),
                          qt.items.map((v) => /* @__PURE__ */ C.jsx(
                            yg,
                            {
                              item: v,
                              templateText: (() => {
                                const S = U.items.find((T) => T.id === v.templateId);
                                return (S == null ? void 0 : S.recipe.kind) === "text" ? S.recipe.text : void 0;
                              })(),
                              selected: I.includes(v.id),
                              samples: It,
                              state: f,
                              globalScales: d,
                              dataRevision: E,
                              densityColorPower: _,
                              style: $a(U, v.recipe),
                              titleTemplate: jo(v, v.templateSampleId) || No,
                              describe: Ye,
                              checkedSampleIds: n,
                              metadataById: Er,
                              files: r,
                              sources: de.sources,
                              divisionProfiles: b,
                              canvasScale: ne,
                              onTextChange: (S, T) => {
                                if (!S.trim()) {
                                  Jr([v.templateId]);
                                  return;
                                }
                                Rt((B) => {
                                  const G = B.items.find(
                                    ($) => $.id === v.templateId
                                  );
                                  (G == null ? void 0 : G.recipe.kind) === "text" && (G.recipe.text = S, T > 0 && (G.height = Math.max(G.height, Math.ceil(T) + 4)));
                                });
                              },
                              onTextFocus: () => {
                                (!I.includes(v.id) || I.length > 1) && k([v.id]);
                              },
                              textEditing: z === v.id,
                              onTextEditStart: () => {
                                k([v.id]), P(v.id);
                              },
                              onIsolate: v.group && I.includes(v.id) && I.length > 1 ? () => k([v.id]) : void 0,
                              onTextEditEnd: () => {
                                var S;
                                P((T) => T === v.id ? null : T), (S = ge.current) == null || S.focus({ preventScroll: !0 });
                              }
                            },
                            v.id
                          )),
                          !Et && /* @__PURE__ */ C.jsx(
                            vh,
                            {
                              ref: tt,
                              target: Xe.length === 1 ? Xe[0] : Xe,
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
                              snapDirections: yl,
                              elementSnapDirections: yl,
                              elementGuidelines: F,
                              verticalGuidelines: Uo.vertical,
                              horizontalGuidelines: Uo.horizontal,
                              snapGridWidth: R ? xl : 0,
                              snapGridHeight: R ? xl : 0,
                              renderDirections: ["nw", "n", "ne", "w", "e", "sw", "s", "se"],
                              edge: !0,
                              individualGroupable: Zr,
                              container: Zr ? j : void 0,
                              onDragStart: Nc,
                              onDrag: $o,
                              onDragEnd: (v) => {
                                const S = qo(v);
                                Bn(S, v.lastEvent, v.isDrag, () => zn(S, !!v.datas.alt));
                              },
                              onDragGroupStart: (v) => {
                                var S;
                                v.datas.alt = !!((S = v.inputEvent) != null && S.altKey), jn([...v.targets ?? []], v.datas.alt ? Xo(v.targets ?? []) : void 0);
                              },
                              onDragGroup: (v) => v.events.forEach($o),
                              onDragGroupEnd: (v) => Bn(v.targets, v.lastEvent, v.isDrag, () => zn(v.targets, !!v.datas.alt)),
                              onResizeStart: (v) => {
                                var S;
                                jn([v.target]), (S = v.inputEvent) != null && S.altKey && v.setFixedDirection([0, 0]);
                              },
                              onResize: Vo,
                              onResizeEnd: (v) => Bn([v.target], v.lastEvent, v.isDrag, () => zn([v.target], !1)),
                              onResizeGroupStart: (v) => {
                                var S;
                                jn([...v.targets ?? []]), (S = v.inputEvent) != null && S.altKey && v.events.forEach((T) => T.setFixedDirection([0, 0]));
                              },
                              onResizeGroup: (v) => v.events.forEach(Vo),
                              onResizeGroupEnd: (v) => Bn(v.targets, v.lastEvent, v.isDrag, () => zn(v.targets, !1)),
                              onClick: (v) => {
                                var S, T;
                                if (Rn.current) {
                                  Rn.current = !1;
                                  return;
                                }
                                ((S = v.inputEvent) != null && S.shiftKey || Zr) && ((T = K.current) == null || T.clickTarget(v.inputEvent, v.inputTarget));
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
  Eg as LayoutTab,
  gg as isBakedTitle
};
